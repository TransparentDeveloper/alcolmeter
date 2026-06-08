# apps/extension

## 커맨드

```bash
pnpm dev      # 개발 서버 (wxt)
pnpm build    # 프로덕션 빌드
pnpm zip      # Chrome Web Store 배포용 zip 생성
```

## Gotchas

- 아이콘은 PNG만 지원 (SVG 불가) — 변환: `rsvg-convert -w {size} -h {size} logo.svg -o icon-{size}.png`
- manifest `version`은 `pkg.version`으로 읽어옴 — `wxt.config.ts`에 하드코딩 금지
