const vipLogin = document.getElementById('vipLogin');
const site = document.getElementById('site');
const vipPassword = document.getElementById('vipPassword');
const vipError = document.getElementById('vipError');
const grid = document.getElementById('games');
const search = document.getElementById('searchInput');
const chipsBox = document.getElementById('chips');
const countText = document.getElementById('countText');
const empty = document.getElementById('empty');
let games=[]; let active='all';

function safeText(t=''){return String(t).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;')}
function truncate(t='',max=72){t=String(t||'').trim(); return t.length>max?t.slice(0,max-1)+'…':t}
function folderLink(folder){return `games/${String(folder||'').trim().replace(/^games\//,'').replace(/\/index\.html$/,'')}/index.html`}
function coverOf(g){return g.image || (g.folder ? `games/${g.folder}/cover.png` : APP_CONFIG.DEFAULT_COVER)}
function gameUrl(g){return g.link || g.gameUrl || (g.folder ? folderLink(g.folder) : '#')}
function isHidden(s){return s==='hidden'||s==='ซ่อน'}
function isSoon(s){return s==='soon'||s==='เร็ว ๆ นี้'}
function vipOK(){return localStorage.getItem('vip_ok')==='1'}
function showSite(){vipLogin.classList.add('hidden'); site.classList.remove('hidden'); loadGames()}

document.getElementById('vipLoginBtn').onclick=()=>{ if(vipPassword.value===APP_CONFIG.VIP_PASSWORD){localStorage.setItem('vip_ok','1');showSite()}else{vipError.textContent='รหัส VIP ไม่ถูกต้อง'}};
vipPassword.addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('vipLoginBtn').click()});
document.getElementById('logoutVip').onclick=()=>{localStorage.removeItem('vip_ok');location.reload()};
if(vipOK()) showSite();

async function loadGames(){
  grid.innerHTML='<div class="loading">กำลังโหลดเกม...</div>';
  try{await window.firebaseReady; const snap=await window.gamesRef.orderBy('createdAt','desc').get(); games=snap.docs.map(d=>({id:d.id,...d.data()}));}
  catch(e){console.error(e); grid.innerHTML='<div class="empty">โหลดเกมไม่สำเร็จ กรุณาตรวจสอบ Firestore Rules</div>'; games=[];}
  renderChips(); render();
}
function renderChips(){const cats=['all',...new Set(games.filter(g=>!isHidden(g.status)).map(g=>g.category).filter(Boolean))]; chipsBox.innerHTML=cats.map(c=>`<button class="chip ${c===active?'active':''}" data-c="${safeText(c)}">${c==='all'?'ทั้งหมด':safeText(c)}</button>`).join(''); document.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{active=b.dataset.c;renderChips();render()})}
function render(){const key=(search.value||'').toLowerCase().trim(); let data=games.filter(g=>!isHidden(g.status)); data=data.filter(g=>(active==='all'||g.category===active)&&(`${g.title||''} ${g.description||''} ${g.category||''}`.toLowerCase().includes(key))); countText.textContent=`${data.length} เกม`; empty.classList.toggle('hidden',data.length>0); grid.innerHTML=data.map(g=>{const soon=isSoon(g.status); const url=gameUrl(g); const playHref=soon?'#':`game-player.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(g.title||'เกม')}`; return `<article class="game-card"><div class="cover"><img src="${safeText(coverOf(g))}" alt="${safeText(g.title)}" onerror="this.parentElement.classList.add('no-img');this.remove()"><span>🎮</span></div><div class="game-info"><h3>${safeText(g.title||'ไม่มีชื่อเกม')}</h3><p>${safeText(truncate(g.description||'',72))}</p><div class="card-bottom"><span class="tag">${safeText(g.category||'เกม')}</span><a class="play ${soon?'soon':''}" href="${safeText(playHref)}">${soon?'เร็ว ๆ นี้':'▶ เล่นเกม'}</a></div></div></article>`}).join('')}
search.addEventListener('input',render);
