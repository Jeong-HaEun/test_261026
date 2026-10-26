// .env 의 AMPLITUDE_API_KEY 를 랜딩 페이지에 넣어 dist/ 에 만든다.
// 실행: node build.js
// 원본 HTML 과 GitHub 에는 키가 들어가지 않는다 (.env, dist/ 는 .gitignore 대상).
const fs = require("fs");
const path = require("path");

const root = __dirname;
const envPath = path.join(root, ".env");
if (!fs.existsSync(envPath)) {
  console.error(".env 파일이 없어요. .env.example 을 복사해서 .env 를 만들고 키를 넣어 주세요.");
  process.exit(1);
}

const env = {};
for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const apiKey = env.AMPLITUDE_API_KEY;
if (!apiKey) {
  console.error(".env 에 AMPLITUDE_API_KEY 값이 없어요.");
  process.exit(1);
}

// 원본 → 결과 파일
const targets = [["class101-landing.html", "정하은_landing.html"]];

fs.mkdirSync(path.join(root, "dist"), { recursive: true });
for (const [src, out] of targets) {
  const html = fs.readFileSync(path.join(root, src), "utf8");
  if (!html.includes("%%AMPLITUDE_API_KEY%%")) {
    console.error(src + " 에 %%AMPLITUDE_API_KEY%% 자리가 없어요.");
    process.exit(1);
  }
  fs.writeFileSync(path.join(root, "dist", out), html.replace("%%AMPLITUDE_API_KEY%%", apiKey));
  console.log("dist/" + out + " 만들었어요.");
}
