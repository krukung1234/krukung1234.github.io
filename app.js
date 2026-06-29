// ======================================
// js/app.js
// หน้าเว็บหลัก ดึงเกมจาก Firebase Firestore
// ======================================

let games = [];
let active = "all";

const grid = document.getElementById("games");
const search = document.getElementById("searchInput");
const chipsBox = document.getElementById("chips");
const countText = document.getElementById("countText");
const empty = document.getElementById("empty");

const fallback = [
  {
    id: "demo-1",
    title: "ภารกิจคัดแยกขยะ",
    description: "ใช้กล้องและมือ ลากขยะลงถังให้ถูกต้อง",
    category: "สิ่งแวดล้อม",
    image: "garbage.png",
    link: "garbage-hand-game/",
    status: "open"
  },
  {
    id: "demo-2",
    title: "AR Math",
    description: "ภารกิจสูตรคูณ ป.4 - ป.6 ฝึกคิดเร็ว",
    category: "คณิตศาสตร์",
    image: "math.png",
    link: "#",
    status: "soon"
  }
];

function safeText(text = "") {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeGame(doc) {
  const data = doc.data ? doc.data() : doc;
  return {
    id: doc.id || data.id || "",
    ...data,
    link: data.link || data.gameUrl || "#"
  };
}

async function load() {
  try {
    await window.firebaseReady;
    const snapshot = await window.gamesRef.orderBy("createdAt", "desc").get();
    games = snapshot.docs.map(normalizeGame);
    if (!Array.isArray(games) || !games.length) games = fallback;
  } catch (error) {
    console.error(error);
    games = fallback;
  }

  renderChips();
  render();
}

function renderChips() {
  const cats = ["all", ...new Set(games.map((g) => g.category).filter(Boolean))];
  chipsBox.innerHTML = cats.map((c) => `
    <button class="chip ${c === active ? "active" : ""}" data-c="${safeText(c)}">
      ${c === "all" ? "ทั้งหมด" : safeText(c)}
    </button>
  `).join("");

  document.querySelectorAll(".chip").forEach((b) => {
    b.onclick = () => {
      active = b.dataset.c;
      renderChips();
      render();
    };
  });
}

function isHidden(status) {
  return status === "hidden" || status === "ซ่อน";
}

function isSoon(status) {
  return status === "soon" || status === "เร็ว ๆ นี้";
}

function render() {
  const key = (search?.value || "").toLowerCase().trim();

  let data = games.filter((g) => !isHidden(g.status));
  data = data.filter((g) => {
    const matchCategory = active === "all" || g.category === active;
    const matchSearch =
      (g.title || "").toLowerCase().includes(key) ||
      (g.description || "").toLowerCase().includes(key) ||
      (g.category || "").toLowerCase().includes(key);
    return matchCategory && matchSearch;
  });

  if (countText) countText.textContent = `${data.length} เกม`;
  if (empty) empty.classList.toggle("hidden", data.length > 0);

  grid.innerHTML = data.map((g) => {
    const soon = isSoon(g.status);
    const playText = soon ? "เร็ว ๆ นี้" : "▶ เล่นเกม";
    const href = soon ? "#" : (g.link || g.gameUrl || "#");

    return `
      <article class="card">
        <div class="thumb">
          ${g.image ? `<img src="${safeText(g.image)}" alt="${safeText(g.title)}">` : "🎮"}
        </div>
        <div class="body">
          <h3>${safeText(g.title || "ไม่มีชื่อเกม")}</h3>
          <p>${safeText(g.description || "")}</p>
          <span class="tag">${safeText(g.category || "เกม")}</span><br>
          <a class="play ${soon ? "soon" : ""}" href="${safeText(href)}">${playText}</a>
        </div>
      </article>
    `;
  }).join("");
}

search?.addEventListener("input", render);
load();
