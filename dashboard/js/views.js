async function renderTestDetail(root, base, uid, meta){
  root.innerHTML = `<div class="boot">불러오는 중…</div>`;
  document.getElementById('backBtn').style.display = 'flex';
  document.getElementById('topbarRight').style.display = 'none';
  document.getElementById('viewTitle').textContent = meta.name;
  document.getElementById('viewMeta').textContent = '테스트 상세 · Allure 데이터 기반';

  try {
    const { tc, attachMap } = await loadTestDetail(base, uid);
    window.__attachMap = attachMap;

    const feature = (tc.labels || []).find(l => l.name === 'feature');
    const story = (tc.labels || []).find(l => l.name === 'story');
    const tags = (tc.labels || []).filter(l => l.name === 'tag');
    const links = tc.links || [];

    const statusBox = tc.status === 'failed' || tc.status === 'broken'
      ? `<div class="status-box failed">${esc(tc.statusMessage || '')}</div>`
      : '';

    const before = (tc.beforeStages || []).filter(s => s.hasContent || s.attachmentsCount);
    const after = (tc.afterStages || []).filter(s => s.hasContent || s.attachmentsCount);

    root.innerHTML = `
      <div class="detail-head">
        <div>
          <div class="crumb">${feature ? esc(feature.value) : ''} ${story ? '· <b>' + esc(story.value) + '</b>' : ''}</div>
          <div class="detail-title">${esc(tc.name)}</div>
          <div class="detail-meta">
            <span class="pill ${tc.status}"><span class="d"></span>${tc.status.toUpperCase()}</span>
            ${tags.map(t => `<span class="tag ${t.value}">${t.value.toUpperCase()}</span>`).join('')}
            <span class="dur">${fmtDur(tc.time && tc.time.duration)}</span>
          </div>
        </div>
        <div class="detail-links">
          ${links.map(l => `<a href="${l.url}" target="_blank">${esc(l.name || l.url)} ↗</a>`).join('')}
        </div>
      </div>

      ${statusBox}

      ${before.length ? `<div class="step-panel"><h3>사전 준비 (Setup)</h3>${renderStepTree(before, 0)}</div>` : ''}

      <div class="step-panel">
        <h3>테스트 단계</h3>
        ${tc.testStage && tc.testStage.steps ? renderStepTree(tc.testStage.steps, 0) : '<div style="padding:10px 14px; color:var(--gray-500); font-size:13px;">기록된 단계가 없습니다.</div>'}
      </div>

      ${after.length ? `<div class="step-panel"><h3>사후 정리 (Teardown)</h3>${renderStepTree(after, 0)}</div>` : ''}
    `;
  } catch (err) {
    root.innerHTML = `<div class="error-box">⨯ 테스트 상세를 불러오지 못했습니다 (${err.message}).</div>`;
  }
}

async function renderRunDashboard(root, runId, opts = {}){
  const { page = 1, isDefault = false } = opts;
  root.innerHTML = `<div class="boot">불러오는 중…</div>`;
  document.getElementById('backBtn').style.display = 'none';
  if (filtersOwnerRunId !== runId) { testFilters = { search: '', status: 'all', category: 'all' }; filtersOwnerRunId = runId; }
  currentRunId = runId;
  lastIsDefault = isDefault;
  testPage = page;

  try {
    const runs = await getRunsIndex();
    if (!runs.length) return renderSoon(root, '아직 실행 기록이 없습니다', './scripts/deploy_pages.sh 를 한 번 실행하면 여기가 채워집니다.');
    const isLatest = runs.length && runs[0].id === runId;
    const base = `./runs/history/${runId}`;

    if (!dataCache[runId]) dataCache[runId] = await loadReportData(base);
    const { summary, env, tests, msgByUid } = dataCache[runId];
    const stat = summary.statistic || {};
    const total = stat.total || 0, passed = stat.passed || 0;
    const failed = (stat.failed||0) + (stat.broken||0), skipped = stat.skipped || 0;
    const passRate = total ? Math.round((passed/total)*100) : 0;

    const envMap = {};
    env.forEach(e => { envMap[e.name] = e.values.join(', '); });
    document.getElementById('viewTitle').textContent = isDefault ? '대시보드' : `실행 결과 · ${formatRunDate(runId)}`;
    document.getElementById('viewMeta').innerHTML = [envMap['Project'], envMap['Test.Framework']]
      .filter(Boolean).map(esc).join(' <span class="sep">·</span> ') + (isLatest ? '' : ' <span class="sep">·</span> 과거 실행 기록');
    document.getElementById('modeBadge').innerHTML = `<span class="d"></span>${esc(shortMode(envMap['Execution.Mode']))}`;
    document.getElementById('topbarRight').style.display = 'flex';
    document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.view === 'dashboard' && isDefault));

    const R = 34, C = 2*Math.PI*R;
    const { curPage, totalPages, filteredCount, filterBar, rowsHtml } = renderTestListPanel(tests, msgByUid, testPage);

    root.innerHTML = `
      ${!isDefault ? `<div class="back-link" id="toRunsList">← 실행 기록으로 돌아가기</div>` : ''}
      <div class="stats-row">
        <div class="card hero" style="animation-delay:.02s">
          <div class="ring-wrap">
            <svg width="88" height="88" viewBox="0 0 88 88">
              <circle cx="44" cy="44" r="${R}" fill="none" stroke="var(--gray-100)" stroke-width="8"/>
              <circle id="ring" cx="44" cy="44" r="${R}" fill="none" stroke="${failed>0 ? 'var(--red-500)' : 'var(--green-500)'}"
                stroke-width="8" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C - (passRate/100)*C}"/>
            </svg>
            <div class="ring-label">${passRate}%</div>
          </div>
          <div class="hero-text">
            <div class="t">전체 Pass Rate</div>
            <div class="n" id="numTotal">0</div>
            <div class="s">GSDK Connect Suite · 총 ${total}건</div>
          </div>
        </div>
        <div class="card stat passed" style="animation-delay:.06s">
          <div class="stat-icon">${ICONS.passed}</div>
          <div class="lbl">Passed</div>
          <div class="num" id="numPassed">0</div>
        </div>
        <div class="card stat failed" style="animation-delay:.1s">
          <div class="stat-icon">${ICONS.failed}</div>
          <div class="lbl">Failed</div>
          <div class="num" id="numFailed">0</div>
        </div>
        <div class="card stat skipped" style="animation-delay:.14s">
          <div class="stat-icon">${ICONS.skipped}</div>
          <div class="lbl">Skipped</div>
          <div class="num" id="numSkipped">0</div>
        </div>
      </div>

      ${trendTileHtml(runs, runId)}

      <div class="panel" id="testPanel">
        <div class="panel-head">
          <h2>테스트 실행 결과</h2>
          <span>${filteredCount}건 / 전체 ${tests.length}건${totalPages>1 ? ` · ${curPage}/${totalPages} 페이지` : ''}</span>
        </div>
        ${filterBar}
        ${rowsHtml}
        ${paginationHtml(curPage, totalPages)}
      </div>
    `;

    animateNumber(document.getElementById('numTotal'), total);
    animateNumber(document.getElementById('numPassed'), passed);
    animateNumber(document.getElementById('numFailed'), failed);
    animateNumber(document.getElementById('numSkipped'), skipped);

    bindTestPanel(tests, msgByUid, base);
    bindTrendTile(root, runs);
    root.querySelector('#toRunsList')?.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.view === 'runs'));
      renderRunsList(root, 1);
    });

  } catch (err) {
    root.innerHTML = `<div class="error-box">
      ⨯ 리포트 데이터를 불러오지 못했습니다 (${err.message}).<br><br>
      pytest tests/ --alluredir=allure-results &amp;&amp; allure generate allure-results -o allure-report --clean<br>
      실행 후 ./scripts/deploy_pages.sh 로 docs/를 갱신하고 docs/ 를 서빙하고 있는지 확인하세요.
    </div>`;
  }
}

async function renderDefaultDashboard(root){
  document.getElementById('backBtn').style.display = 'none';
  const runs = await getRunsIndex();
  if (!runs.length) return renderSoon(root, '아직 실행 기록이 없습니다', './scripts/deploy_pages.sh 를 한 번 실행하면 대시보드가 채워집니다.');
  return renderRunDashboard(root, runs[0].id, { isDefault: true });
}

async function renderRunsList(root, page = 1){
  document.getElementById('backBtn').style.display = 'none';
  document.getElementById('topbarRight').style.display = 'none';
  root.innerHTML = `<div class="boot">불러오는 중…</div>`;
  try {
    const runs = await getRunsIndex();
    if (!runs.length) return renderSoon(root, '아직 실행 기록이 없습니다', './scripts/deploy_pages.sh 를 실행하면 여기에 기록이 쌓입니다.');
    const latestId = runs[0].id;
    const { pageItems, page: curPage, totalPages } = paginate(runs, page, RUN_PAGE_SIZE);

    const rowsHtml = pageItems.map((r, i) => `
      <div class="run-row ${r.id===latestId?'current':''}" data-run="${r.id}" style="opacity:0; animation:rise .4s ease ${0.1+i*0.03}s forwards;">
        <div class="run-date">${formatRunDate(r.id)}<div class="rel">${relTime(r.startedAt)}</div></div>
        <span class="run-mode ${(r.mode||'').toLowerCase().includes('real')?'real_hw':''}">${esc(shortMode(r.mode))}</span>
        <span class="run-rate" style="color:${r.failed>0?'var(--red-500)':'var(--green-500)'}">${r.passRate}%</span>
        <div class="run-counts">
          <span class="p">Pass <b>${r.passed}</b></span>
          <span class="f">Fail <b>${r.failed}</b></span>
          <span class="s">Skip <b>${r.skipped}</b></span>
        </div>
        ${r.id===latestId ? '<span class="current-tag">최신</span>' : '<span class="view-btn">보기</span>'}
      </div>`).join('');

    root.innerHTML = `
      <div class="panel" style="opacity:0; animation:rise .5s ease forwards;">
        <div class="panel-head">
          <h2>실행 기록</h2>
          <div style="display:flex; align-items:center; gap:14px;">
            <span>${runs.length}건${totalPages>1 ? ` · ${curPage}/${totalPages} 페이지` : ''}</span>
            <button class="new-run-btn" id="newRunBtn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
              새 실행
            </button>
          </div>
        </div>
        ${rowsHtml}
        ${paginationHtml(curPage, totalPages)}
      </div>`;

    document.getElementById('newRunBtn').addEventListener('click', openNewRunModal);
    root.querySelectorAll('.run-row').forEach(row => {
      row.addEventListener('click', () => {
        renderRunDashboard(document.getElementById('content'), row.dataset.run, { isDefault: row.dataset.run === latestId });
      });
    });
    bindPagination(root, (p) => renderRunsList(root, p));
  } catch (err) {
    root.innerHTML = `<div class="error-box">⨯ 실행 기록을 불러오지 못했습니다 (${err.message}).</div>`;
  }
}

function renderSoon(root, title, desc){
  document.getElementById('backBtn').style.display = 'none';
  document.getElementById('topbarRight').style.display = 'none';
  root.innerHTML = `<div class="empty">
    <div class="ic"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8B95A1" stroke-width="1.6"><path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="9"/></svg></div>
    <h3>${title}</h3>
    <p>${desc}</p>
  </div>`;
}

const VIEWS = {
  dashboard: { title: '대시보드', meta: 'Suprema G-SDK 연동 테스트 · 실행 결과 요약', render: renderDefaultDashboard },
  runs: { title: '테스트 실행', meta: '실행 기록 전체 보기', render: (r) => renderRunsList(r, 1) },
  flaky: { title: 'Flaky 관리', meta: 'ReportPortal 연동 예정', render: (r) => renderSoon(r, 'ReportPortal 연동 예정', '실행 이력이 쌓이면 반복 실패/불안정 테스트를 자동으로 잡아내는 화면이 여기 생깁니다.') },
  cases: { title: '테스트 케이스', meta: 'Jira · Zephyr Scale / Xray', render: (r) => renderSoon(r, 'Jira에서 관리 중', '테스트 케이스 자체는 Jira Cloud(Zephyr Scale / Xray)에서 관리됩니다. 여기서는 연결 상태와 커버리지만 요약해서 보여줄 예정입니다.') },
  settings: { title: '설정', meta: '데이터 소스 · 연동 관리', render: (r) => renderSoon(r, '설정', 'Allure / ReportPortal / Jira 연동 정보를 관리하는 화면이 이후 추가됩니다.') },
};

function switchView(key){
  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.view === key));
  document.getElementById('viewTitle').textContent = VIEWS[key].title;
  document.getElementById('viewMeta').textContent = VIEWS[key].meta;
  VIEWS[key].render(document.getElementById('content'));
}
