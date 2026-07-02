document.querySelectorAll('.nav-item[data-view]').forEach(el => {
  el.addEventListener('click', () => switchView(el.dataset.view));
});
document.getElementById('backBtn').addEventListener('click', () => {
  renderRunDashboard(document.getElementById('content'), currentRunId, { page: testPage, isDefault: lastIsDefault });
});
document.getElementById('settingsBtn').addEventListener('click', openSettingsModal);
document.getElementById('navSettings').addEventListener('click', openSettingsModal);
document.getElementById('refreshBtn').addEventListener('click', (e) => {
  runsIndexCache = null;
  if (currentRunId) delete dataCache[currentRunId];
  e.currentTarget.classList.add('spin');
  renderRunDashboard(document.getElementById('content'), currentRunId, { page: testPage, isDefault: lastIsDefault })
    .finally(() => e.currentTarget.classList.remove('spin'));
});

if (sessionStorage.getItem('stp_user')) {
  showApp();
}
