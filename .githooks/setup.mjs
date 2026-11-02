// pnpm install 의 prepare 로 실행된다. .git 이 없는 빌드 환경과 CI 에서는 조용히 넘어간다.
// CI 의 예약 발행 커밋은 리뷰어를 부를 수 없으므로 훅을 걸지 않는다.
import { execFileSync } from "node:child_process";

function git(...args) {
  return execFileSync("git", args, { stdio: ["ignore", "pipe", "ignore"] });
}

if (process.env.CI) {
  process.exit(0);
}
try {
  git("rev-parse", "--git-dir");
} catch {
  process.exit(0);
}
git("config", "core.hooksPath", ".githooks");
