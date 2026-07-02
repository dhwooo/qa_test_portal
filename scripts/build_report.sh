#!/usr/bin/env bash
# 테스트 실행 -> Allure 리포트 생성 -> Jira 톤 테마 주입까지 한 번에.
set -euo pipefail
cd "$(dirname "$0")/.."

.venv/bin/pytest tests/ --alluredir=allure-results --junitxml=junit-results.xml "$@" || true
allure generate allure-results -o allure-report --clean
python3 scripts/apply_theme.py

echo "완료: allure-report/index.html"
