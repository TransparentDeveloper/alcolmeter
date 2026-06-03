# Alcolmeter 크롬 확장 프로그램

막걸리 배합 계산기. 쌀 총량과 형태를 입력하면 단양주·이양주·삼양주별 쌀/물/누룩 배합표를 팝업에서 바로 확인할 수 있다.

- Chrome Web Store: [Alcolmeter](https://chromewebstore.google.com/detail/alcolmeter/dpmgfjlhmgngplmlbcodijnnjjlmjjpi)

## 기술 스택

- WXT 0.20 + Svelte 5
- TypeScript
- `@alcolmeter/domain` (모노레포 공유 패키지)

## 로컬 실행

```bash
pnpm install
pnpm --filter @alcolmeter/extension dev
```

## 배포

`apps/extension/**` 파일이 변경된 상태로 `main` 브랜치에 push되면 GitHub Actions가 자동으로 빌드·압축·게시한다.

### 자동 배포 흐름

```
main push (apps/extension/** 변경)
  └─ pnpm --filter @alcolmeter/extension zip   (빌드 + 압축)
       └─ chrome-webstore-upload-cli upload --auto-publish
```

### 필요한 GitHub Secrets

| Secret | 설명 |
|---|---|
| `CHROME_EXTENSION_ID` | Chrome Web Store 확장 ID |
| `CHROME_CLIENT_ID` | Google Cloud Console OAuth 클라이언트 ID |
| `CHROME_CLIENT_SECRET` | Google Cloud Console OAuth 클라이언트 Secret |
| `CHROME_REFRESH_TOKEN` | `npx chrome-webstore-upload-keys`로 발급 |

### 최초 Secrets 설정

1. [Google Cloud Console](https://console.cloud.google.com)에서 Chrome Web Store API 활성화
2. OAuth 2.0 클라이언트 ID 생성 (애플리케이션 유형: 데스크톱 앱)
3. Refresh Token 발급:
   ```bash
   npx chrome-webstore-upload-keys
   ```
4. 발급된 값을 GitHub 리포지토리 Secrets에 등록
