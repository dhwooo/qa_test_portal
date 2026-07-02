#!/usr/bin/env bash
# docs/ 를 GitHub Pages 배포(및 로컬 미리보기) 아티팩트로 빌드한다.
# docs/index.html, styles.css, js/  <- dashboard/ (Suprema Test Portal, 항상 이게 루트)
# docs/runs/index.json        <- 실행 기록 목록 (누적)
# docs/runs/history/<run_id>/ <- 각 실행의 allure-report 스냅샷 (JSON 데이터 소스 + 원본 리포트)
set -euo pipefail
cd "$(dirname "$0")/.."

./scripts/build_report.sh

mkdir -p docs/runs/history
RUN_ID="$(date +%Y%m%d-%H%M%S)"
cp -R allure-report "docs/runs/history/$RUN_ID"
python3 scripts/update_runs_index.py "$RUN_ID"
cp dashboard/index.html docs/index.html
cp dashboard/styles.css docs/styles.css
mkdir -p docs/js
cp dashboard/js/*.js docs/js/

echo "완료: docs/ (실행 ID: $RUN_ID)"
echo "  로컬 미리보기: .claude/launch.json 의 'docs' 서버로 확인"
echo "  실제 배포: git add docs && git commit && git push"
