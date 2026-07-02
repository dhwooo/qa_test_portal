#!/usr/bin/env bash
# allure-report/를 GitHub Pages가 서빙하는 docs/에 스냅샷으로 복사.
# (allure-report/는 재생성 가능한 빌드 산출물이라 git에 안 올리고, docs/만 커밋 대상으로 관리한다.)
set -euo pipefail
cd "$(dirname "$0")/.."

./scripts/build_report.sh
rm -rf docs
cp -R allure-report docs

echo "완료: docs/ 를 커밋 + push 하면 GitHub Pages에 반영됩니다."
