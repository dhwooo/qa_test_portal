/* ---------------- mock Jira 로그인 (실제 OAuth는 Jira Cloud 앱 등록 후 연결) ---------------- */
const MOCK_USER = { name: '김도현 (dhwoo)', role: 'QA Engineer · Suprema', avatar: '김' };

function showApp(){
  document.getElementById('loginGate').style.display = 'none';
  document.getElementById('appShell').style.display = 'flex';
  document.getElementById('userAvatar').textContent = MOCK_USER.avatar;
  document.getElementById('userName').textContent = MOCK_USER.name;
  document.getElementById('userRole').textContent = MOCK_USER.role;
  switchView('dashboard');
}

document.getElementById('jiraLoginBtn').addEventListener('click', (e) => {
  const btn = e.currentTarget;
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner"></span> Jira 인증 확인 중…`;
  setTimeout(() => {
    sessionStorage.setItem('stp_user', JSON.stringify(MOCK_USER));
    showApp();
  }, 700);
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('stp_user');
  document.getElementById('appShell').style.display = 'none';
  document.getElementById('loginGate').style.display = 'flex';
  const btn = document.getElementById('jiraLoginBtn');
  btn.disabled = false;
  btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M11.53 2 2 11.4a1.3 1.3 0 0 0 0 1.85l3.2 3.16 6.33-6.28 6.33 6.28 3.2-3.16a1.3 1.3 0 0 0 0-1.85L11.53 2Z" fill="white"/><path d="M11.53 22 5.2 15.72 11.53 9.45l6.33 6.27L11.53 22Z" fill="white" opacity=".55"/></svg> Jira 계정으로 로그인`;
});
