const STEP_ICON = {
  passed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
  failed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  broken: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 2 2 20h20L12 2Z"/></svg>',
  skipped: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M5 12h14"/></svg>',
};

const ICONS = {
  passed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.2 2.2L16 10" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  failed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6" stroke-linecap="round"/></svg>',
  skipped: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M9 9v6M13 9l4 3-4 3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

/* ---------------- toast ---------------- */
function showToast(msg){
  const root = document.getElementById('toastRoot');
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFB020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><circle cx="12" cy="12" r="9"/></svg>${esc(msg)}`;
  root.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 3200);
}

/* ---------------- 새 실행 트리거 모달 (화면만 — 실제 실행은 GitLab CI 연동 후) ---------------- */
function openNewRunModal(){
  const root = document.getElementById('modalRoot');
  root.innerHTML = `
    <div class="modal-backdrop" id="modalBackdrop">
      <div class="modal">
        <div class="modal-head">
          <h3>새 테스트 실행</h3>
          <button class="modal-close" id="modalClose">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
          </button>
        </div>

        <div class="segmented" id="modeSeg">
          <div class="seg-btn active" data-mode="mock">Mock 모드</div>
          <div class="seg-btn" data-mode="real_hw">실장비 연결</div>
        </div>

        <div id="deviceFields" style="display:none">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">디바이스 IP</label>
              <input class="form-input" id="deviceIp" placeholder="192.168.0.10">
            </div>
            <div class="form-group">
              <label class="form-label">포트</label>
              <input class="form-input" id="devicePort" placeholder="51211" value="51211">
            </div>
          </div>
          <div class="form-hint">실장비 모드는 GSDK Device Gateway가 해당 IP에서 실행 중이어야 합니다.</div>
        </div>

        <div class="form-group">
          <label class="form-label">실행 대상</label>
          <input class="form-input" value="tests/ (GSDK Connect Suite · 5건)" disabled style="color:var(--gray-400)">
        </div>

        <div class="modal-actions">
          <button class="btn-ghost" id="modalCancel">취소</button>
          <button class="btn-primary" id="modalStart">실행 시작</button>
        </div>
      </div>
    </div>
  `;

  const close = () => { root.innerHTML = ''; };
  document.getElementById('modalBackdrop').addEventListener('click', (e) => { if (e.target.id === 'modalBackdrop') close(); });
  document.getElementById('modalClose').addEventListener('click', close);
  document.getElementById('modalCancel').addEventListener('click', close);
  document.getElementById('modeSeg').querySelectorAll('.seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#modeSeg .seg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('deviceFields').style.display = btn.dataset.mode === 'real_hw' ? 'block' : 'none';
    });
  });
  document.getElementById('modalStart').addEventListener('click', () => {
    close();
    showToast('GitLab CI 연동이 아직 준비 중입니다 — 화면 흐름만 먼저 만들어뒀어요.');
  });
}

/* ---------------- 테스트 상세 단계 트리 ---------------- */
function renderStepTree(steps, depth) {
  return steps.map(s => {
    const attachHtml = (s.attachments || []).map(a => {
      const entry = window.__attachMap[a.uid];
      const body = entry
        ? (typeof entry.content === 'object' ? syntaxHighlightJSON(entry.content) : esc(entry.content ?? '(내용 없음)'))
        : '(로드 실패)';
      return `<div class="attach-card"><div class="attach-name">${esc(a.name)}</div><pre class="attach-body">${body}</pre></div>`;
    }).join('');
    const childHtml = (s.steps && s.steps.length) ? renderStepTree(s.steps, depth + 1) : '';
    return `
      <div class="step" style="--depth:${depth}">
        <div class="step-row">
          <span class="step-status ${s.status}">${STEP_ICON[s.status] || ''}</span>
          <span class="step-name">${esc(s.name)}</span>
          <span class="step-dur">${fmtDur(s.time && s.time.duration)}</span>
        </div>
        ${attachHtml ? `<div class="step-attachments">${attachHtml}</div>` : ''}
        ${childHtml}
      </div>`;
  }).join('');
}

/* ---------------- 테스트 목록 패널 (검색/필터/페이지네이션) ---------------- */
function testRowHtml(t, msgByUid, i){
  const label = {passed:'PASS', failed:'FAIL', broken:'BROKEN', skipped:'SKIP'}[t.status] || t.status.toUpperCase();
  const tagsHtml = (t.tags||[]).map(tag => `<span class="tag ${tag}">${tag.toUpperCase()}</span>`).join('');
  const msg = msgByUid[t.uid] ? msgByUid[t.uid].split('\n')[0] : '';
  return `
    <div class="trow" data-uid="${t.uid}" data-name="${esc(t.name)}" style="opacity:0; animation:rise .35s ease ${Math.min(i,10)*0.025}s forwards;">
      <span class="pill ${t.status}"><span class="d"></span>${label}</span>
      <div class="tname">
        <div class="n">${t.name}</div>
        ${msg ? `<div class="msg">${msg.replace(/</g,'&lt;')}</div>` : ''}
      </div>
      <div class="tags">${tagsHtml}</div>
      <span class="dur">${fmtDur(t.time && t.time.duration)}</span>
      <span class="view-btn">자세히 보기</span>
    </div>`;
}

function renderTestListPanel(tests, msgByUid, page){
  const filtered = filterTests(tests, testFilters);
  const { pageItems, page: curPage, totalPages } = paginate(filtered, page, TEST_PAGE_SIZE);
  const categories = [...new Set(tests.map(t => t.category))].sort();
  const statusOpts = [['all','전체'],['failed','FAIL'],['broken','BROKEN'],['passed','PASS'],['skipped','SKIP']];

  const filterBar = `
    <div class="filter-bar">
      <div class="search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        <input type="text" id="testSearch" placeholder="테스트 이름 검색…" value="${esc(testFilters.search)}">
      </div>
      <div class="filter-pills" id="statusPills">
        ${statusOpts.map(([s,l]) => `<button class="filter-pill ${testFilters.status===s?'active':''}" data-status="${s}">${l}</button>`).join('')}
      </div>
      ${categories.length > 1 ? `
      <select class="cat-select" id="catSelect">
        <option value="all">전체 카테고리</option>
        ${categories.map(c => `<option value="${esc(c)}" ${testFilters.category===c?'selected':''}>${esc(c)}</option>`).join('')}
      </select>` : ''}
    </div>`;

  const rowsHtml = pageItems.length
    ? pageItems.map((t,i) => testRowHtml(t, msgByUid, i)).join('')
    : `<div style="padding:44px 20px; text-align:center; color:var(--gray-400); font-size:13px;">조건에 맞는 테스트가 없습니다.</div>`;

  return { curPage, totalPages, filteredCount: filtered.length, filterBar, rowsHtml };
}

function refreshTestPanel(tests, msgByUid, base){
  const panel = document.getElementById('testPanel');
  const { curPage, totalPages, filteredCount, filterBar, rowsHtml } = renderTestListPanel(tests, msgByUid, testPage);
  panel.innerHTML = `
    <div class="panel-head">
      <h2>테스트 실행 결과</h2>
      <span>${filteredCount}건 / 전체 ${tests.length}건${totalPages>1 ? ` · ${curPage}/${totalPages} 페이지` : ''}</span>
    </div>
    ${filterBar}
    ${rowsHtml}
    ${paginationHtml(curPage, totalPages)}
  `;
  bindTestPanel(tests, msgByUid, base);
}

function bindTestPanel(tests, msgByUid, base){
  const panel = document.getElementById('testPanel');
  panel.querySelectorAll('.trow').forEach(row => {
    row.addEventListener('click', () => {
      renderTestDetail(document.getElementById('content'), base, row.dataset.uid, { name: row.dataset.name });
    });
  });
  bindPagination(panel, (p) => { testPage = p; refreshTestPanel(tests, msgByUid, base); });
  const searchInput = document.getElementById('testSearch');
  let debounceTimer;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const val = e.target.value;
    debounceTimer = setTimeout(() => {
      testFilters.search = val;
      testPage = 1;
      refreshTestPanel(tests, msgByUid, base);
      const el = document.getElementById('testSearch');
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }, 220);
  });
  document.getElementById('statusPills').querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      testFilters.status = btn.dataset.status;
      testPage = 1;
      refreshTestPanel(tests, msgByUid, base);
    });
  });
  document.getElementById('catSelect')?.addEventListener('change', (e) => {
    testFilters.category = e.target.value;
    testPage = 1;
    refreshTestPanel(tests, msgByUid, base);
  });
}
