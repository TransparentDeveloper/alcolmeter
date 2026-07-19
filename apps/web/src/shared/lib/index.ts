export * from './json-ld';
// renderWiki(markdown-it·sanitize-html, 서버 전용·무거움)는 이 배럴에 두지 않는다.
// 배럴은 클라이언트 컴포넌트(JsonLd 등)도 import하므로, 여기 re-export하면 서버 렌더러가
// 클라 번들까지 끌려온다. 서버 로더에서 `$shared/lib/wiki-render`로 직접 import할 것.
