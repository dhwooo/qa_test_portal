function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function formatRunDate(runId){
  const m = runId.match(/^(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})$/);
  if (!m) return runId;
  return `${m[1]}.${m[2]}.${m[3]} ${m[4]}:${m[5]}`;
}
function relTime(ts){
  if (!ts) return '';
  const diff = Date.now() - ts;
  const min = Math.floor(diff/60000);
  if (min < 1) return '방금 전';
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min/60);
  if (hr < 24) return `${hr}시간 전`;
  return `${Math.floor(hr/24)}일 전`;
}

function shortMode(raw){
  if (!raw) return '—';
  const l = raw.toLowerCase();
  if (l.includes('mock')) return 'Mock 모드';
  if (l.includes('real')) return 'Real HW';
  return raw;
}

function fmtDur(ms){ if (ms == null) return '—'; return ms < 1000 ? ms + 'ms' : (ms/1000).toFixed(2) + 's'; }

function animateNumber(el, target, duration=700){
  const start = performance.now();
  function tick(now){
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function syntaxHighlightJSON(obj){
  const jsonStr = JSON.stringify(obj, null, 2);
  const escaped = esc(jsonStr);
  return escaped.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false)\b|\bnull\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
    let cls = 'jn';
    if (/^"/.test(match)) cls = /:$/.test(match) ? 'jk' : 'js';
    else if (/true|false/.test(match)) cls = 'jb';
    else if (/null/.test(match)) cls = 'jz';
    return `<span class="${cls}">${match}</span>`;
  });
}

function paginate(items, page, pageSize){
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const p = Math.min(Math.max(1, page), totalPages);
  const start = (p - 1) * pageSize;
  return { pageItems: items.slice(start, start + pageSize), page: p, totalPages };
}
function paginationHtml(page, totalPages){
  if (totalPages <= 1) return '';
  let btns = `<button class="page-btn" data-page="${page-1}" ${page<=1?'disabled':''}>‹</button>`;
  for (let i = 1; i <= totalPages; i++){
    if (totalPages > 7 && Math.abs(i-page) > 2 && i !== 1 && i !== totalPages){
      if (i === 2 || i === totalPages-1) btns += `<span style="color:var(--gray-400); padding:0 4px;">···</span>`;
      continue;
    }
    btns += `<button class="page-btn${i===page?' active':''}" data-page="${i}">${i}</button>`;
  }
  btns += `<button class="page-btn" data-page="${page+1}" ${page>=totalPages?'disabled':''}>›</button>`;
  return `<div class="pagination">${btns}</div>`;
}
function bindPagination(root, onGoto){
  root.querySelectorAll('.pagination .page-btn').forEach(btn => {
    if (btn.disabled) return;
    btn.addEventListener('click', () => onGoto(Number(btn.dataset.page)));
  });
}
