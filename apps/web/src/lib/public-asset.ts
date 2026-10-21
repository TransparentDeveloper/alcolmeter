import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { publicDir } from 'astro:config/server';

// public/ 파일은 이름에 해시가 붙지 않아 브라우저가 옛 파일을 오래 캐시한다.
// 파일 내용 해시를 쿼리로 붙여 내용이 바뀔 때만 주소가 바뀌게 한다. 빌드 때 페이지마다 다시 읽지 않도록 담아 둔다.
const versioned = new Map<string, string>();

export function withContentHash(path: `/${string}`) {
  let href = versioned.get(path);
  if (!href) {
    const hash = createHash('sha256').update(readFileSync(new URL(`.${path}`, publicDir))).digest('hex').slice(0, 8);
    href = `${path}?v=${hash}`;
    versioned.set(path, href);
  }
  return href;
}
