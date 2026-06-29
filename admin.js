// ======================================
// js/admin.js
// Admin จัดการเกมผ่าน Firebase Firestore
// ======================================

const loginBox = document.getElementById("loginBox");
const adminBox = document.getElementById("adminBox");
const pass = document.getElementById("password");
const form = document.getElementById("gameForm");
const list = document.getElementById("list");

let games = [];

function statusText(status) {
  const labels = window.APP_CONFIG?.STATUS_LABELS || {};
  return labels[status] || status || "เปิดเล่น";
}

function safeText(text = "") {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function login() {
  if (pass.value === window.APP_CONFIG.ADMIN_PASSWORD) {
    localStorage.setItem("admin_ok", "1");
    showAdmin();
  } else {
    alert("รหัสไม่ถูกต้อง");
  }
}

function logout() {
  localStorage.removeItem("admin_ok");
  location.reload();
}

pass?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") login();
});

async function showAdmin() {
  loginBox.classList.add("hidden");
  adminBox.classList.remove("hidden");
  await loadGames();
}

if (localStorage.getItem("admin_ok") === "1") showAdmin();

async function loadGames() {
  list.innerHTML = "<p>กำลังโหลดข้อมูล...</p>";
  try {
    await window.firebaseReady;
    const snapshot = await window.gamesRef.orderBy("createdAt", "desc").get();
    games = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        link: data.link || data.gameUrl || "#"
      };
    });
  } catch (error) {
    console.error(error);
    games = [];
    alert("โหลดข้อมูลไม่สำเร็จ กรุณาตรวจสอบ Firestore Rules หรืออินเทอร์เน็ต");
  }
  renderList();
}

function renderList() {
  if (!games.length) {
    list.innerHTML = "<p>ยังไม่มีเกม</p>";
    return;
  }

  list.innerHTML = games.map((g) => `
    <div class="item">
      <img src="${safeText(g.image || "")}" onerror="this.style.display='none'">
      <div>
        <b>${safeText(g.title || "ไม่มีชื่อเกม")}</b>
        <small>${safeText(g.category || "ไม่ระบุหมวดหมู่")} | ${safeText(statusText(g.status))}</small>
      </div>
      <div>
        <button class="edit" onclick='editGame(${JSON.stringify(g).replaceAll("'", "&apos;")})'>แก้ไข</button>
        <button class="danger" onclick="deleteGame('${g.id}')">ลบ</button>
      </div>
    </div>
  `).join("");
}

function val(id) {
  return document.getElementById(id).value.trim();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = val("id");
  const now = firebase.firestore.FieldValue.serverTimestamp();

  const data = {
    title: val("title"),
    description: val("description"),
    category: val("category"),
    image: val("image"),
    link: val("link") || "#",
    gameUrl: val("link") || "#",
    status: val("status") || "open",
    updatedAt: now
  };

  if (!data.title) return alert("กรุณากรอกชื่อเกม");

  try {
    await window.firebaseReady;

    if (id) {
      await window.gamesRef.doc(id).update(data);
    } else {
      await window.gamesRef.add({
        ...data,
        createdAt: now
      });
    }

    alert("บันทึกสำเร็จ");
    resetForm();
    await loadGames();
  } catch (error) {
    console.error(error);
    alert("บันทึกไม่สำเร็จ กรุณาตรวจสอบ Firestore Rules");
  }
});

function editGame(g) {
  document.getElementById("id").value = g.id || "";
  document.getElementById("title").value = g.title || "";
  document.getElementById("description").value = g.description || "";
  document.getElementById("category").value = g.category || "อื่น ๆ";
  document.getElementById("image").value = g.image || "";
  document.getElementById("link").value = g.link || g.gameUrl || "";
  document.getElementById("status").value = g.status || "open";
  scrollTo(0, 0);
}

async function deleteGame(id) {
  if (!confirm("ลบเกมนี้ใช่ไหม?")) return;
  try {
    await window.firebaseReady;
    await window.gamesRef.doc(id).delete();
    await loadGames();
  } catch (error) {
    console.error(error);
    alert("ลบไม่สำเร็จ");
  }
}

function resetForm() {
  form.reset();
  document.getElementById("id").value = "";
}

window.login = login;
window.logout = logout;
window.editGame = editGame;
window.deleteGame = deleteGame;
window.resetForm = resetForm;
