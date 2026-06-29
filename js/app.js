let games = [];
let active = "all";
const grid = document.getElementById("games");
const search = document.getElementById("searchInput");
const chipsBox = document.getElementById("chips");
const countText = document.getElementById("countText");
const empty = document.getElementById("empty");
const fallback = [];
function safeText(text=""){return String(text).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('\"',"&quot;").replaceAll("'","&#039;")}
function shortText(text="",max=78){const t=String(text||"").replace(/\s+/g," " ).trim();return t.length>max?t.slice(0,max).trim()+"...":t}
function normalizeGame(doc){const data=doc.data?doc.data():doc; const folder=(data.folder||data.gameFolder||"").trim(); const image=(data.image||"").trim() || (folder?`games/${folder}/cover.png`:""); return {id:doc.id||data.id||"",...data,folder,image,link:data.link||data.gameUrl||(folder?`games/${folder}/index.html`:"#")}}
function isHidden(s){return s==="hidden"||s==="ซ่อน"}
function isSoon(s){return s==="soon"||s==="เร็ว ๆ นี้"}
async function load(){try{await window.firebaseReady; const snap=await window.gamesRef.orderBy("createdAt","desc").get(); games=snap.docs.map(normalizeGame); if(!games.length) games=fallback;}catch(e){console.error(e); games=fallback;} renderChips(); render();}
function renderChips(){const cats=["all",...new Set(games.map(g=>g.category).filter(Boolean))]; chipsBox.innerHTML=cats.map(c=>`<button class="chip ${c===active?'active':''}" data-c="${safeText(c)}">${c==='all'?'ทั้งหมด':safeText(c)}</button>`).join(''); document.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{active=b.dataset.c; renderChips(); render();});}
function render(){const key=(search?.value||"").toLowerCase().trim(); let data=games.filter(g=>!isHidden(g.status)); data=data.filter(g=>(active==='all'||g.category===active)&&((g.title||'').toLowerCase().includes(key)||(g.description||'').toLowerCase().includes(key)||(g.category||'').toLowerCase().includes(key))); if(countText) countText.textContent=`${data.length} เกม`; empty?.classList.toggle('hidden',data.length>0); grid.innerHTML=data.map(g=>{const soon=isSoon(g.status); const href=soon?'#':(g.link||g.gameUrl||'#'); const img=g.image?`<img src="${safeText(g.image)}" alt="${safeText(g.title)}" onerror="this.parentElement.innerHTML='<span class=&quot;thumb-fallback&quot;>🎮</span>'">`:`<span class="thumb-fallback">🎮</span>`; return `<article class="card"><div class="thumb">${img}</div><div class="body"><h3>${safeText(g.title||'ไม่มีชื่อเกม')}</h3><p title="${safeText(g.description||'')}">${safeText(shortText(g.description||'',72))}</p><div class="card-actions"><span class="tag">${safeText(g.category||'เกม')}</span><a class="play ${soon?'soon':''}" href="${safeText(href)}" ${soon?'onclick="return false"':''}>${soon?'เร็ว ๆ นี้':'▶ เล่นเกม'}</a></div></div></article>`}).join('')}
search?.addEventListener('input',render); load();
