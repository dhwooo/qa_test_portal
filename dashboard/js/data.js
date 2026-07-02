/* ---- 데이터 레이어: 지금은 Allure JSON, 나중에 ReportPortal API로 교체 가능하도록 분리 ----
 * 화면 컴포넌트는 이 파일의 함수만 거쳐서 데이터를 가져온다 (직접 fetch 금지, DESIGN.md 참고). */

const TEST_PAGE_SIZE = 10;
const RUN_PAGE_SIZE = 8;

const dataCache = {}; // runId -> { summary, env, tests, msgByUid }
let runsIndexCache = null;

// 현재 보고 있는 뷰 상태
let currentRunId = null;
let lastIsDefault = true;
let testPage = 1;
let testFilters = { search: '', status: 'all', category: 'all' };
let filtersOwnerRunId = null;

async function getRunsIndex(){
  if (runsIndexCache) return runsIndexCache;
  runsIndexCache = await fetch('./runs/index.json').then(r => r.ok ? r.json() : []).catch(() => []);
  return runsIndexCache;
}

async function loadReportData(base) {
  const [summary, env, suites] = await Promise.all([
    fetch(`${base}/widgets/summary.json`).then(r => { if(!r.ok) throw new Error('summary ' + r.status); return r.json(); }),
    fetch(`${base}/widgets/environment.json`).then(r => r.ok ? r.json() : []),
    fetch(`${base}/data/suites.json`).then(r => { if(!r.ok) throw new Error('suites ' + r.status); return r.json(); }),
  ]);

  const flatten = (node, acc, parentName) => {
    if (!node) return acc;
    if (node.uid && node.status && !node.children) { node.category = parentName || '기타'; acc.push(node); }
    if (node.children) node.children.forEach(c => flatten(c, acc, node.name || parentName));
    return acc;
  };
  const order = {failed:0, broken:1, skipped:2, passed:3};
  const tests = flatten(suites, []).sort((a,b) => (order[a.status]??9) - (order[b.status]??9));

  const failing = tests.filter(t => t.status === 'failed' || t.status === 'broken');
  const details = await Promise.all(failing.map(t =>
    fetch(`${base}/data/test-cases/${t.uid}.json`).then(r => r.ok ? r.json() : null).catch(() => null)
  ));
  const msgByUid = {};
  failing.forEach((t,i) => { if (details[i]) msgByUid[t.uid] = details[i].statusMessage; });

  return { summary, env, tests, msgByUid };
}

async function loadTestDetail(base, uid) {
  const tc = await fetch(`${base}/data/test-cases/${uid}.json`).then(r => { if(!r.ok) throw new Error('test-case ' + r.status); return r.json(); });

  const refs = [];
  const collect = (stage) => {
    if (!stage) return;
    (stage.attachments || []).forEach(a => refs.push(a));
    (stage.steps || []).forEach(collect);
  };
  (tc.beforeStages || []).forEach(collect);
  collect(tc.testStage);
  (tc.afterStages || []).forEach(collect);

  const contents = await Promise.all(refs.map(a =>
    fetch(`${base}/data/attachments/${a.source}`)
      .then(r => a.type && a.type.includes('json') ? r.json() : r.text())
      .catch(() => null)
  ));
  const attachMap = {};
  refs.forEach((a, i) => { attachMap[a.uid] = { meta: a, content: contents[i] }; });

  return { tc, attachMap };
}

function filterTests(tests, filters){
  return tests.filter(t => {
    if (filters.status !== 'all' && t.status !== filters.status) return false;
    if (filters.category !== 'all' && t.category !== filters.category) return false;
    if (filters.search && !t.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}
