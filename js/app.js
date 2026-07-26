const vipLogin = document.getElementById("vipLogin");
const site = document.getElementById("site");

const vipPassword = document.getElementById("vipPassword");
const vipError = document.getElementById("vipError");

const grid = document.getElementById("games");
const search = document.getElementById("searchInput");
const chipsBox = document.getElementById("chips");
const countText = document.getElementById("countText");
const empty = document.getElementById("empty");

const promptModal = document.getElementById("promptModal");
const promptTitle = document.getElementById("promptTitle");
const promptText = document.getElementById("promptText");
const copyPromptBtn = document.getElementById("copyPromptBtn");
const promptCloseBtn = document.getElementById("promptCloseBtn");
const closePromptBtn = document.getElementById("closePromptBtn");
const copyMessage = document.getElementById("copyMessage");

let games = [];
let active = "all";


/* =====================================
   ฟังก์ชันพื้นฐาน
===================================== */

function safeText(text = "") {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function truncate(text = "", max = 72) {
  const cleanText = String(text || "").trim();

  return cleanText.length > max
    ? `${cleanText.slice(0, max - 1)}…`
    : cleanText;
}

function folderLink(folderName) {
  const cleanFolder = String(folderName || "")
    .trim()
    .replace(/^games\//, "")
    .replace(/\/index\.html$/, "");

  return `games/${cleanFolder}/index.html`;
}

function coverOf(game) {
  return (
    game.image ||
    (
      game.folder
        ? `games/${game.folder}/cover.png`
        : APP_CONFIG.DEFAULT_COVER
    )
  );
}

function gameUrl(game) {
  return (
    game.link ||
    game.gameUrl ||
    (
      game.folder
        ? folderLink(game.folder)
        : "#"
    )
  );
}

function isHidden(status) {
  return (
    status === "hidden" ||
    status === "ซ่อน"
  );
}

function isSoon(status) {
  return (
    status === "soon" ||
    status === "เร็ว ๆ นี้"
  );
}

function hasPrompt(game) {
  return Boolean(
    String(game.prompt || "").trim()
  );
}

function vipOK() {
  return localStorage.getItem("vip_ok") === "1";
}


/* =====================================
   ระบบเข้าสู่เว็บไซต์
===================================== */

function showSite() {
  vipLogin.classList.add("hidden");
  site.classList.remove("hidden");

  loadGames();
}

document.getElementById("vipLoginBtn").onclick = () => {
  if (
    vipPassword.value === APP_CONFIG.VIP_PASSWORD
  ) {
    localStorage.setItem("vip_ok", "1");

    vipError.textContent = "";

    showSite();
  } else {
    vipError.textContent =
      "รหัส VIP ไม่ถูกต้อง";
  }
};

vipPassword.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    document
      .getElementById("vipLoginBtn")
      .click();
  }
});

document.getElementById("logoutVip").onclick = () => {
  localStorage.removeItem("vip_ok");
  location.reload();
};

if (vipOK()) {
  showSite();
}


/* =====================================
   โหลดเกมจาก Firestore
===================================== */

async function loadGames() {
  grid.innerHTML =
    '<div class="loading">กำลังโหลดเกม...</div>';

  try {
    await window.firebaseReady;

    const snap = await window.gamesRef
      .orderBy("createdAt", "desc")
      .get();

    games = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(error);

    grid.innerHTML = `
      <div class="empty">
        โหลดเกมไม่สำเร็จ กรุณาตรวจสอบ Firestore Rules
      </div>
    `;

    games = [];
  }

  renderChips();
  render();
}


/* =====================================
   แสดงหมวดหมู่
===================================== */

function renderChips() {
  const categories = [
    "all",
    ...new Set(
      games
        .filter(game => !isHidden(game.status))
        .map(game => game.category)
        .filter(Boolean)
    )
  ];

  chipsBox.innerHTML = categories
    .map(categoryName => {
      const label =
        categoryName === "all"
          ? "ทั้งหมด"
          : safeText(categoryName);

      const activeClass =
        categoryName === active
          ? "active"
          : "";

      return `
        <button
          type="button"
          class="chip ${activeClass}"
          data-c="${safeText(categoryName)}"
        >
          ${label}
        </button>
      `;
    })
    .join("");

  document
    .querySelectorAll(".chip")
    .forEach(button => {
      button.onclick = () => {
        active = button.dataset.c;

        renderChips();
        render();
      };
    });
}


/* =====================================
   แสดงการ์ดเกม
===================================== */

function render() {
  const key = String(search.value || "")
    .toLowerCase()
    .trim();

  let data = games.filter(
    game => !isHidden(game.status)
  );

  data = data.filter(game => {
    const matchesCategory =
      active === "all" ||
      game.category === active;

    const searchText = `
      ${game.title || ""}
      ${game.description || ""}
      ${game.category || ""}
    `.toLowerCase();

    return (
      matchesCategory &&
      searchText.includes(key)
    );
  });

  countText.textContent =
    `${data.length} เกม`;

  empty.classList.toggle(
    "hidden",
    data.length > 0
  );

  grid.innerHTML = data
    .map(game => {
      const soon = isSoon(game.status);
      const url = gameUrl(game);

      const playHref = soon
        ? "#"
        : `game-player.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(game.title || "เกม")}`;

      const promptButton = hasPrompt(game)
        ? `
          <button
            type="button"
            class="prompt-button"
            data-game-id="${safeText(game.id)}"
          >
            📋 Prompt
          </button>
        `
        : "";

      return `
        <article class="game-card">

          <div class="cover">

            <img
              src="${safeText(coverOf(game))}"
              alt="${safeText(game.title)}"
              onerror="
                this.parentElement.classList.add('no-img');
                this.remove();
              "
            >

            <span>🎮</span>

          </div>

          <div class="game-info">

            <h3>
              ${safeText(game.title || "ไม่มีชื่อเกม")}
            </h3>

            <p>
              ${safeText(
                truncate(game.description || "", 72)
              )}
            </p>

            <div class="card-bottom">

              <span class="tag">
                ${safeText(game.category || "เกม")}
              </span>

              <div class="game-buttons">

                ${promptButton}

                <a
                  class="play ${soon ? "soon" : ""}"
                  href="${safeText(playHref)}"
                  ${soon ? 'aria-disabled="true"' : ""}
                >
                  ${soon ? "เร็ว ๆ นี้" : "▶ เล่นเกม"}
                </a>

              </div>

            </div>

          </div>

        </article>
      `;
    })
    .join("");

  document
    .querySelectorAll(".prompt-button")
    .forEach(button => {
      button.addEventListener("click", () => {
        openPrompt(button.dataset.gameId);
      });
    });
}

search.addEventListener("input", render);


/* =====================================
   เปิด Prompt
===================================== */

function openPrompt(gameId) {
  const game = games.find(
    item =>
      String(item.id) === String(gameId)
  );

  if (!game || !hasPrompt(game)) {
    alert("เกมนี้ยังไม่มี Prompt");

    return;
  }

  promptTitle.textContent =
    `Prompt: ${game.title || "เกม"}`;

  promptText.value =
    String(game.prompt || "");

  copyMessage.classList.remove("show");

  promptModal.classList.add("show");
  promptModal.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";
}


/* =====================================
   ปิด Prompt
===================================== */

function closePrompt() {
  promptModal.classList.remove("show");
  promptModal.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";
}

promptCloseBtn.addEventListener(
  "click",
  closePrompt
);

closePromptBtn.addEventListener(
  "click",
  closePrompt
);

promptModal.addEventListener(
  "click",
  event => {
    if (event.target === promptModal) {
      closePrompt();
    }
  }
);

document.addEventListener(
  "keydown",
  event => {
    if (event.key === "Escape") {
      closePrompt();
    }
  }
);


/* =====================================
   คัดลอก Prompt
===================================== */

copyPromptBtn.addEventListener(
  "click",
  async () => {
    const text = promptText.value;

    if (!text) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      promptText.focus();
      promptText.select();

      promptText.setSelectionRange(
        0,
        promptText.value.length
      );

      document.execCommand("copy");
    }

    copyMessage.classList.add("show");

    copyPromptBtn.textContent =
      "✅ คัดลอกแล้ว";

    setTimeout(() => {
      copyMessage.classList.remove("show");

      copyPromptBtn.textContent =
        "📋 คัดลอก Prompt";
    }, 2000);
  }
);
