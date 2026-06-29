const loginBox=document.getElementById('loginBox'), adminBox=document.getElementById('adminBox'), pass=document.getElementById('password'), form=document.getElementById('gameForm'), list=document.getElementById('list');
let games=[];
function login(){if(pass.value===ADMIN_PASSWORD){localStorage.setItem('admin_ok','1');showAdmin();}else alert('รหัสไม่ถูกต้อง');}
function logout(){localStorage.removeItem('admin_ok');location.reload();}
pass.addEventListener('keydown',e=>{if(e.key==='Enter')login();});
function showAdmin(){loginBox.classList.add('hidden');adminBox.classList.remove('hidden');loadGames();}
if(localStorage.getItem('admin_ok')==='1')showAdmin();
async function loadGames(){try{const r=await fetch(API_URL+'?action=list');games=await r.json();}catch(e){games=[]}renderList();}
function renderList(){list.innerHTML=games.map(g=>`<div class="item"><img src="${g.image||''}" onerror="this.style.display='none'"><div><b>${g.title}</b><small>${g.category} | ${g.status}</small></div><div><button class="edit" onclick='editGame(${JSON.stringify(g)})'>แก้ไข</button><button class="danger" onclick="deleteGame('${g.id}')">ลบ</button></div></div>`).join('')||'<p>ยังไม่มีเกม</p>';}
function val(id){return document.getElementById(id).value.trim();}
form.addEventListener('submit',async e=>{e.preventDefault();if(!API_URL||API_URL.includes('PASTE_')) return alert('ยังไม่ได้ใส่ API_URL ใน js/config.js');const data=new URLSearchParams({action:'save',id:val('id'),title:val('title'),description:val('description'),category:val('category'),image:val('image'),link:val('link'),status:val('status')});await fetch(API_URL,{method:'POST',body:data});alert('บันทึกสำเร็จ');resetForm();loadGames();});
function editGame(g){['id','title','description','category','image','link','status'].forEach(k=>document.getElementById(k).value=g[k]||'');scrollTo(0,0);}
async function deleteGame(id){if(!confirm('ลบเกมนี้ใช่ไหม?'))return;await fetch(API_URL,{method:'POST',body:new URLSearchParams({action:'delete',id})});loadGames();}
function resetForm(){form.reset();document.getElementById('id').value='';}
