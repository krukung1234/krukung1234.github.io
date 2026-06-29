let games = [], active = "all";
const grid = document.getElementById("games");
const search = document.getElementById("searchInput");
const chipsBox = document.getElementById("chips");
const countText = document.getElementById("countText");
const empty = document.getElementById("empty");

function esc(t="") { return String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"); }
function normalize(doc){ const d=doc.data?doc.data():doc; return { id:doc.id||d.id||"", ...d, link:d.link||d.gameUrl||folderLink(d.folder||"") }; }
function folderLink(folder){ folder=String(folder||"").trim().replace(/^\/+|\/+$/g,""); return folder ? `games/${folder}/index.html` : "#"; }
function isHidden(s){ return s==="hidden" || s==="ซ่อน"; }
function isSoon(s){ return s==="soon" || s==="เร็ว ๆ นี้"; }

async function load(){
  try{
    await window.firebaseReady;
    const snap = await window.gamesRef.orderBy("createdAt","desc").get();
    games = snap.docs.map(normalize);
  }catch(e){ console.error(e); games=[]; }
  renderChips(); render();
}
function renderChips(){
  const cats = ["all", ...new Set(games.map(g=>g.category).filter(Boolean))];
  chipsBox.innerHTML = cats.map(c=>`<button class="chip ${c===active?'active':''}" data-c="${esc(c)}">${c==='all'?'ทั้งหมด':esc(c)}</button>`).join("");
  document.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{active=b.dataset.c;renderChips();render();});
}
function render(){
  const key=(search?.value||"").toLowerCase().trim();
  let data=games.filter(g=>!isHidden(g.status)).filter(g=> (active==='all'||g.category===active) && ((g.title||'').toLowerCase().includes(key)||(g.description||'').toLowerCase().includes(key)||(g.category||'').toLowerCase().includes(key)) );
  countText.textContent = `${data.length} เกม`;
  empty.classList.toggle("hidden", data.length>0);
  grid.innerHTML=data.map(g=>{
    const soon=isSoon(g.status), link=g.link||folderLink(g.folder);
    const playHref= soon ? "#" : `game-player.html?url=${encodeURIComponent(link)}`;
    return `<article class="card"><div class="thumb">${g.image?`<img src="${esc(g.image)}" alt="${esc(g.title)}">`:"🎮"}</div><div class="body"><h3>${esc(g.title||"ไม่มีชื่อเกม")}</h3><p>${esc(g.description||"")}</p><span class="tag">${esc(g.category||"เกม")}</span><br><a class="play ${soon?'soon':''}" href="${esc(playHref)}">${soon?'เร็ว ๆ นี้':'▶ เล่นเกม'}</a></div></article>`;
  }).join("");
}
search?.addEventListener("input", render);
load();
