#!/usr/bin/env python3
"""`allure generate` 직후 실행: theme/allure-jira-theme.css를 리포트에 주입한다.
allure generate는 --clean 옵션이면 출력 폴더를 통째로 지우므로, 매 실행마다 다시 적용해야 한다."""
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REPORT_DIR = ROOT / "allure-report"
THEME_SRC = ROOT / "theme" / "allure-jira-theme.css"


def main():
    if not REPORT_DIR.exists():
        sys.exit("allure-report/ 가 없습니다. 먼저 `allure generate`를 실행하세요.")

    shutil.copy(THEME_SRC, REPORT_DIR / THEME_SRC.name)

    index = REPORT_DIR / "index.html"
    html = index.read_text(encoding="utf-8")
    tag = f'<link rel="stylesheet" href="./{THEME_SRC.name}">'
    if tag not in html:
        html = html.replace("</head>", f"{tag}</head>")
        index.write_text(html, encoding="utf-8")

    print(f"Jira 테마 적용 완료: {REPORT_DIR}/{THEME_SRC.name}")


if __name__ == "__main__":
    main()
