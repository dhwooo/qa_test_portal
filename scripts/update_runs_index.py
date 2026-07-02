#!/usr/bin/env python3
"""allure-report 스냅샷 하나를 docs/runs/index.json에 실행 기록으로 추가한다."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX_PATH = ROOT / "docs" / "runs" / "index.json"
MAX_RUNS = 200


def main():
    if len(sys.argv) != 2:
        sys.exit("usage: update_runs_index.py <run_id>")
    run_id = sys.argv[1]

    summary = json.loads((ROOT / "allure-report" / "widgets" / "summary.json").read_text())
    env_list = json.loads((ROOT / "allure-report" / "widgets" / "environment.json").read_text())
    env = {e["name"]: ", ".join(e["values"]) for e in env_list}

    stat = summary.get("statistic", {})
    total = stat.get("total", 0)
    passed = stat.get("passed", 0)
    failed = stat.get("failed", 0) + stat.get("broken", 0)
    skipped = stat.get("skipped", 0)
    pass_rate = round(passed / total * 100) if total else 0

    entry = {
        "id": run_id,
        "startedAt": summary.get("time", {}).get("start"),
        "project": env.get("Project", ""),
        "mode": env.get("Execution.Mode", ""),
        "total": total,
        "passed": passed,
        "failed": failed,
        "skipped": skipped,
        "passRate": pass_rate,
    }

    INDEX_PATH.parent.mkdir(parents=True, exist_ok=True)
    runs = json.loads(INDEX_PATH.read_text()) if INDEX_PATH.exists() else []
    runs.insert(0, entry)
    runs = runs[:MAX_RUNS]
    INDEX_PATH.write_text(json.dumps(runs, ensure_ascii=False, indent=2))
    print(f"runs/index.json 갱신 ({len(runs)}건 기록됨)")


if __name__ == "__main__":
    main()
