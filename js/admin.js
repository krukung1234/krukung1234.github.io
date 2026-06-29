const loginBox=document.getElementById('loginBox'), adminBox=document.getElementById('adminBox'), pass=document.getElementById('password'), form=document.getElementById('gameForm'), list=document.getElementById('list'), picker=document.getElementById('folderPicker');
let games=[];
function $(id){return document.getElementById(id)}
function val(id){return $(id).value.trim()}
function esc(t=""){return String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
function cleanFolder(f=""){return String(f).trim().replace(/\\/g,"/").replace(/^\/+|\/+$/g,"").split("/").filter(Boolean).pop()||""}
function makeLink(folder){folder=cleanFolder(folder); return folder?`games/${folder}/index.html`:""}
function updatePreview(){ $('linkPreview').value=makeLink(val('folder')); }
function login(){ if(pass.value===window.APP_CONFIG.ADMIN_PASSWORD){localStorage.setItem('admin_ok','1');showAdmin()}else alert('รหัสไม่ถูกต้อง'); }
function logout(){localStorage.removeItem('admin_ok');location.reload();}
pass?.addEventListener('keydown',e=>{if(e.key==='Enter')login()});
if(localStorage.getItem('admin_ok')==='1') showAdmin();
async function showAdmin(){loginBox.classList.add('hidden');adminBox.classList.remove('hidden'); await loadGames();}
async function loadGames(){
  list.innerHTML='<p>กำลังโหลด...</p>';
  try{ await window.firebaseReady; const snap=await window.gamesRef.orderBy('createdAt','desc').get(); games=snap.docs.map(d=>({id:d.id,...d.data()})); }
  catch(e){ console.error(e); alert('โหลดข้อมูลไม่สำเร็จ ตรวจสอบ Firestore Rules'); games=[]; }
  renderStats(); renderList();
}
function renderStats(){ $('totalCount').textContent=games.length; $('openCount').textContent=games.filter(g=>g.status==='open').length; $('soonCount').textContent=games.filter(g=>g.status==='soon').length; }
function renderList(){
  const key=($('adminSearch')?.value||'').toLowerCase().trim();
  const data=games.filter(g=>(g.title||'').toLowerCase().includes(key)||(g.folder||'').toLowerCase().includes(key));
  if(!data.length){list.innerHTML='<p>ยังไม่มีเกม</p>';return;}
  list.innerHTML=data.map(g=>{const link=g.link||makeLink(g.folder); return `<div class="item"><img src="${esc(g.image||'')}" onerror="this.style.display='none'"><div><b>${esc(g.title||'ไม่มีชื่อเกม')}</b><small>${esc(g.category||'')} | ${esc(g.folder||'')}<br>${esc(link)}</small></div><div class="btns"><button onclick="openGame('${esc(link)}')">ดู</button><button onclick="copyLink('${esc(link)}')">คัดลอก</button><button class="edit" onclick='editGame(${JSON.stringify(g).replaceAll("'","&apos;")})'>แก้ไข</button><button class="danger" onclick="deleteGame('${g.id}')">ลบ</button></div></div>`}).join('');
}
$('adminSearch')?.addEventListener('input',renderList);
$('folder')?.addEventListener('input',updatePreview);
function pickFolder(){ picker.click(); }
picker?.addEventListener('change',()=>{
  const files=[...picker.files];
  if(!files.length)return;
  const first=files[0].webkitRelativePath || files[0].name;
  const folder=first.split('/')[0];
  $('folder').value=cleanFolder(folder);
  updatePreview();
  const hasIndex=files.some(f=>f.name.toLowerCase()==='index.html');
  $('folderHint').textContent = hasIndex ? `✅ พบ index.html ในโฟลเดอร์ ${folder}` : `⚠️ ไม่พบ index.html กรุณาตรวจสอบก่อน Push`;
});
function previewCurrent(){ const link=makeLink(val('folder')); if(!link)return alert('กรุณาใส่ชื่อโฟลเดอร์เกม'); window.open(`game-player.html?url=${encodeURIComponent(link)}`,'_blank'); }
form.addEventListener('submit',async e=>{
  e.preventDefault();
  const folder=cleanFolder(val('folder'));
  if(!val('title'))return alert('กรุณากรอกชื่อเกม');
  if(!folder)return alert('กรุณาใส่ชื่อโฟลเดอร์เกม เช่น ar-sudoku');
  const now=firebase.firestore.FieldValue.serverTimestamp();
  const data={title:val('title'),description:val('description'),category:val('category'),image:val('image'),folder,link:makeLink(folder),gameUrl:makeLink(folder),status:val('status')||'open',updatedAt:now};
  try{await window.firebaseReady; const id=val('id'); if(id) await window.gamesRef.doc(id).update(data); else await window.gamesRef.add({...data,createdAt:now}); alert('บันทึกสำเร็จ'); resetForm(); await loadGames();}
  catch(err){console.error(err); alert('บันทึกไม่สำเร็จ ตรวจสอบ Firestore Rules');}
});
function editGame(g){$('id').value=g.id||'';$('title').value=g.title||'';$('description').value=g.description||'';$('category').value=g.category||'อื่น ๆ';$('image').value=g.image||'';$('folder').value=g.folder||'';$('status').value=g.status||'open';updatePreview();scrollTo(0,0)}
async function deleteGame(id){ if(!confirm('ลบเกมนี้ออกจากรายการใช่ไหม?\nหมายเหตุ: ต้องลบโฟลเดอร์เกมใน games ด้วย GitHub Desktop เอง'))return; try{await window.firebaseReady; await window.gamesRef.doc(id).delete(); await loadGames();}catch(e){alert('ลบไม่สำเร็จ')}}
function resetForm(){form.reset();$('id').value='';$('folderHint').textContent='เลือกโฟลเดอร์ที่มี index.html ระบบจะกรอกชื่อโฟลเดอร์ให้เอง';updatePreview();}
function openGame(link){window.open(`game-player.html?url=${encodeURIComponent(link)}`,'_blank')}
async function copyLink(link){const full=new URL(link,location.href).href; await navigator.clipboard.writeText(full); alert('คัดลอกลิงก์แล้ว');}
window.login=login;window.logout=logout;window.pickFolder=pickFolder;window.previewCurrent=previewCurrent;window.resetForm=resetForm;window.editGame=editGame;window.deleteGame=deleteGame;window.openGame=openGame;window.copyLink=copyLink;
