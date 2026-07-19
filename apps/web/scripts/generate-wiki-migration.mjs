// apps/web/scripts/generate-wiki-migration.mjs
// 사용: node apps/web/scripts/generate-wiki-migration.mjs > /tmp/wiki-migration.sql
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../src/content/dictionary');
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;                 // SQL 문자열 이스케이프
const arr = (a) => `array[${(a ?? []).map(q).join(',')}]::text[]`;
const jsonOrNull = (o) => (o ? `${q(JSON.stringify(o))}::jsonb` : 'null');

// 아주 단순한 frontmatter 파서 (이 콘텐츠 형식 전용)
function parse(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error('frontmatter 없음');
  const [, fmRaw, body] = m;
  const fm = {};
  const lines = fmRaw.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^video:\s*$/.test(line)) {                                    // 중첩 video 블록
      const v = {};
      i++;
      for (; i < lines.length && /^\s{2}\S/.test(lines[i]); i++) {
        const mm = lines[i].match(/^\s{2}(\w+):\s?(.*)$/);
        if (!mm) continue;
        let [, k, val] = mm;
        if (val === '|') {                                             // 블록 스칼라(description, 여러 문단·빈 줄 포함)
          const buf = [];
          i++;
          for (; i < lines.length; i++) {
            const l = lines[i];
            if (l.trim() === '') { buf.push(''); continue; }           // 블록 내 빈 줄 보존
            if (/^\s{4}/.test(l)) { buf.push(l.slice(4)); continue; }  // 4칸 들여쓴 본문
            break;                                                     // 덜 들여쓴 다음 키 → 종료
          }
          while (buf.length && buf[0] === '') buf.shift();             // 앞 빈 줄 제거
          while (buf.length && buf[buf.length - 1] === '') buf.pop();  // 뒤 빈 줄 제거
          val = buf.join('\n');
          i--;
        }
        v[k] = val.replace(/^"(.*)"$/, '$1');
      }
      i--;
      fm.video = v;
      continue;
    }
    const mm = line.match(/^(\w+):\s?(.*)$/);
    if (!mm) continue;
    const [, k, raw] = mm;
    if (/^\[.*\]$/.test(raw)) fm[k] = raw.slice(1, -1).split(',').map((s) => s.trim()).filter(Boolean);
    else fm[k] = raw.replace(/^"(.*)"$/, '$1');
  }
  return { fm, body: body.trim() };
}

const files = readdirSync(DIR).filter((f) => f.endsWith('.md'));
console.log('-- 공식계정 profiles.id 조회');
console.log("with author as (select id from public.profiles where id = (select id from auth.users where email = 'alcolmeter@gmail.com'))");
const values = [];
for (const f of files) {
  const { fm, body } = parse(readFileSync(resolve(DIR, f), 'utf8'));
  const video = fm.video
    ? {
        id: fm.video.id,
        title: fm.video.title,
        description: fm.video.description ?? '',
        uploadDate: fm.video.uploadDate,
        ...(fm.video.orientation ? { orientation: fm.video.orientation } : {})
      }
    : null;
  values.push(
    `  (${q(fm.slug)}, ${q(fm.title)}, ${q(fm.summary)}, ${q(fm.category ?? '')}, ` +
      `${arr(fm.domain)}, ${arr(fm.related)}, ${jsonOrNull(video)}, ${q(body)}, ` +
      `${q(fm.updated ?? '2026-06-20')})`
  );
}
console.log(', seed(slug,title,summary,category,domain,related,video,body,updated) as (values');
console.log(values.join(',\n'));
console.log('),');
console.log(`ins_term as (
  insert into public.wiki_terms (slug,title,summary,category,domain,related,video,body,author_id,updated_at)
  select s.slug,s.title,s.summary,s.category,s.domain,s.related,s.video,s.body,a.id,(s.updated||'T00:00:00Z')::timestamptz
  from seed s cross join author a
  returning id, slug, title, summary, category, domain, related, video, body
)
insert into public.wiki_revisions (term_id,type,title,summary,category,domain,related,video,body,editor_id,comment)
select t.id,'add',t.title,t.summary,t.category,t.domain,t.related,t.video,t.body,a.id,'초기 이관'
from ins_term t cross join author a;`);
