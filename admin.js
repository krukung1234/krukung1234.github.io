// ======================================
// js/admin.js
// Krukung Game Hub V3
// เพิ่มเกมด้วยไฟล์เดียว / หลายไฟล์ / โฟลเดอร์ / ZIP
// แก้ไข ลบ ดูตัวอย่าง คัดลอกลิงก์ได้จากหน้า Admin
// ======================================

const loginBox = document.getElementById("loginBox");
const adminBox = document.getElementById("adminBox");
const pass = document.getElementById("password");
const form = document.getElementById("gameForm");
const list = document.getElementById("list");
const saveBtn = document.getElementById("saveBtn");
const uploadStatus = document.getElementById("uploadStatus");
const fileCheck = document.getElementById("fileCheck");
const dropZone = document.getElementById("dropZone");

let games = [];
let editingGame = null;
let droppedFiles = [];

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

function val(id) { return document.getElementById(id).value.trim(); }
function file(id) { return document.getElementById(id).files?.[0] || null; }
function files(id) { return Array.from(document.getElementById(id).files || []); }
function setStatus(text = "") { if (uploadStatus) uploadStatus.innerHTML = text; }
function setSaving(isSaving) {
  saveBtn.disabled = isSaving;
  saveBtn.textContent = isSaving ? "⏳ กำลังบันทึก..." : "💾 บันทึกเกม";
}

function safeFileName(name = "file") {
  const clean = String(name).replace(/[\\/:*?"<>|#%&{}$!'@+=`]/g, "-").replace(/\s+/g, "-");
  return `${Date.now()}-${Math.random().toString(36).slice(2)}-${clean}`;
}

function cleanPath(path = "") {
  return String(path).replace(/\\/g, "/").replace(/^\/+/, "").replace(/\/+/g, "/");
}

function getUploadFiles() {
  const zip = file("gameZip");
  if (zip) return { mode: "zip", files: [zip] };

  const folder = files("gameFolder");
  if (folder.length) return { mode: "files", files: folder };

  const selected = files("gameFiles");
  if (selected.length) return { mode: "files", files: selected };

  if (droppedFiles.length) {
    const zipDrop = droppedFiles.find((f) => f.name.toLowerCase().endsWith(".zip"));
    if (zipDrop) return { mode: "zip", files: [zipDrop] };
    return { mode: "files", files: droppedFiles };
  }

  return { mode: "none", files: [] };
}

function guessEntry(filesList) {
  const paths = filesList.map((f) => cleanPath(f.webkitRelativePath || f.relativePath || f.name));
  const names = paths.map((p) => p.toLowerCase());
  let idx = names.findIndex((p) => p.endsWith("/index.html") || p === "index.html");
  if (idx >= 0) return paths[idx];
  idx = names.findIndex((p) => p.endsWith("/game.html") || p === "game.html");
  if (idx >= 0) return paths[idx];
  idx = names.findIndex((p) => p.endsWith("/main.html") || p === "main.html");
  if (idx >= 0) return paths[idx];
  idx = names.findIndex((p) => p.endsWith(".html") || p.endsWith(".htm"));
  return idx >= 0 ? paths[idx] : "";
}

function showFileCheck() {
  const upload = getUploadFiles();
  if (upload.mode === "none") {
    fileCheck.classList.add("hidden");
    return;
  }

  fileCheck.classList.remove("hidden", "bad");
  if (upload.mode === "zip") {
    fileCheck.innerHTML = `✅ พบไฟล์ ZIP: <b>${safeText(upload.files[0].name)}</b><br>ระบบจะเปิดเกมผ่าน game-player.html`;
    return;
  }

  const entry = guessEntry(upload.files);
  const imageCount = upload.files.filter((f) => f.type.startsWith("image/")).length;
  const soundCount = upload.files.filter((f) => f.type.startsWith("audio/")).length;
  const htmlCount = upload.files.filter((f) => /\.html?$/i.test(f.name)).length;

  if (!entry) {
    fileCheck.classList.add("bad");
    fileCheck.innerHTML = `❌ ยังไม่พบไฟล์ HTML ในเกม<br>ควรมีไฟล์ <b>index.html</b> อย่างน้อย 1 ไฟล์`;
    return;
  }

  fileCheck.innerHTML = `✅ พร้อมอัปโหลด<br>ไฟล์ทั้งหมด: <b>${upload.files.length}</b> ไฟล์ | HTML: <b>${htmlCount}</b> | รูปภาพ: <b>${imageCount}</b> | เสียง: <b>${soundCount}</b><br>ไฟล์เริ่มเกม: <b>${safeText(entry)}</b>`;
}

["gameFiles", "gameFolder", "gameZip"].forEach((id) => {
  document.getElementById(id).addEventListener("change", () => {
    if (id !== "gameFiles") document.getElementById("gameFiles").value = id === "gameFiles" ? document.getElementById("gameFiles").value : "";
    if (id !== "gameFolder") document.getElementById("gameFolder").value = id === "gameFolder" ? document.getElementById("gameFolder").value : "";
    if (id !== "gameZip") document.getElementById("gameZip").value = id === "gameZip" ? document.getElementById("gameZip").value : "";
    droppedFiles = [];
    showFileCheck();
  });
});

["dragenter", "dragover"].forEach((evt) => {
  dropZone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });
});
["dragleave", "drop"].forEach((evt) => {
  dropZone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
  });
});
dropZone.addEventListener("drop", async (e) => {
  droppedFiles = await getFilesFromDrop(e.dataTransfer);
  document.getElementById("gameFiles").value = "";
  document.getElementById("gameFolder").value = "";
  document.getElementById("gameZip").value = "";
  showFileCheck();
});

async function getFilesFromDrop(dataTransfer) {
  const items = Array.from(dataTransfer.items || []);
  if (!items.length) return Array.from(dataTransfer.files || []);
  const out = [];
  await Promise.all(items.map(async (item) => {
    const entry = item.webkitGetAsEntry?.();
    if (entry) await readEntry(entry, "", out);
    else {
      const f = item.getAsFile?.();
      if (f) out.push(f);
    }
  }));
  return out;
}

function readEntry(entry, prefix, out) {
  return new Promise((resolve) => {
    if (entry.isFile) {
      entry.file((file) => {
        file.relativePath = cleanPath(prefix + file.name);
        out.push(file);
        resolve();
      }, resolve);
    } else if (entry.isDirectory) {
      const reader = entry.createReader();
      const all = [];
      const readBatch = () => reader.readEntries(async (entries) => {
        if (!entries.length) {
          for (const child of all) await readEntry(child, prefix + entry.name + "/", out);
          resolve();
        } else {
          all.push(...entries);
          readBatch();
        }
      }, resolve);
      readBatch();
    } else resolve();
  });
}

function login() {
  if (pass.value === window.APP_CONFIG.ADMIN_PASSWORD) {
    localStorage.setItem("admin_ok", "1");
    showAdmin();
  } else alert("รหัสไม่ถูกต้อง");
}
function logout() { localStorage.removeItem("admin_ok"); location.reload(); }
pass?.addEventListener("keydown", (e) => { if (e.key === "Enter") login(); });
async function showAdmin() { loginBox.classList.add("hidden"); adminBox.classList.remove("hidden"); await loadGames(); }
if (localStorage.getItem("admin_ok") === "1") showAdmin();

async function loadGames() {
  list.innerHTML = "<p>กำลังโหลดข้อมูล...</p>";
  try {
    await window.firebaseReady;
    const snapshot = await window.gamesRef.orderBy("createdAt", "desc").get();
    games = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), link: doc.data().link || doc.data().gameUrl || "#" }));
  } catch (error) {
    console.error(error);
    games = [];
    alert("โหลดข้อมูลไม่สำเร็จ กรุณาตรวจสอบ Firestore Rules หรืออินเทอร์เน็ต");
  }
  renderList();
}

function renderList() {
  if (!games.length) { list.innerHTML = "<p>ยังไม่มีเกม</p>"; return; }
  list.innerHTML = games.map((g) => {
    const gameLink = g.link || g.gameUrl || "#";
    return `
      <div class="item">
        <img src="${safeText(g.image || "")}" onerror="this.style.display='none'">
        <div class="meta">
          <b>${safeText(g.title || "ไม่มีชื่อเกม")}</b>
          <small>${safeText(g.category || "ไม่ระบุหมวดหมู่")} | ${safeText(statusText(g.status))}</small>
          <small>${safeText(g.uploadMode || "link")}${g.entryPath ? " | " + safeText(g.entryPath) : ""}</small>
        </div>
        <div class="actions">
          <button class="preview" onclick="openPreview('${safeText(gameLink)}')">👁 ดู</button>
          <button class="copy" onclick="copyLink('${safeText(gameLink)}')">📋 ลิงก์</button>
          <button class="edit" onclick='editGame(${JSON.stringify(g).replaceAll("'", "&apos;")})'>✏ แก้ไข</button>
          <button class="danger" onclick="deleteGame('${g.id}')">🗑 ลบ</button>
        </div>
      </div>`;
  }).join("");
}

async function uploadFileToStorage(path, uploadFile, progressText = "") {
  const ref = window.storage.ref(path);
  const task = ref.put(uploadFile);
  return new Promise((resolve, reject) => {
    task.on("state_changed", (snap) => {
      const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
      setStatus(`${progressText} ${pct}%<div class="progress"><div class="bar" style="width:${pct}%"></div></div>`);
    }, reject, async () => {
      const url = await ref.getDownloadURL();
      resolve({ url, path });
    });
  });
}

async function uploadCover(docId) {
  const cover = file("coverFile");
  if (!cover) return null;
  const path = `${window.APP_CONFIG.STORAGE_COVERS_PATH}/${docId}/${safeFileName(cover.name)}`;
  return uploadFileToStorage(path, cover, "กำลังอัปโหลดรูปปก");
}

async function uploadGameZip(docId, zipFile) {
  const path = `${window.APP_CONFIG.STORAGE_ZIPS_PATH}/${docId}/${safeFileName(zipFile.name)}`;
  const uploaded = await uploadFileToStorage(path, zipFile, "กำลังอัปโหลด ZIP");
  return {
    uploadMode: "zip",
    zipUrl: uploaded.url,
    zipPath: uploaded.path,
    gameUrl: `game-player.html?id=${encodeURIComponent(docId)}`,
    link: `game-player.html?id=${encodeURIComponent(docId)}`,
    storagePaths: [uploaded.path]
  };
}

async function uploadGameFiles(docId, fileList) {
  const entryPath = guessEntry(fileList);
  if (!entryPath) throw new Error("ไม่พบไฟล์ index.html หรือไฟล์ HTML สำหรับเริ่มเกม");

  const manifest = [];
  const storagePaths = [];
  for (let i = 0; i < fileList.length; i++) {
    const f = fileList[i];
    const rel = cleanPath(f.webkitRelativePath || f.relativePath || f.name);
    const storagePath = `${window.APP_CONFIG.STORAGE_GAME_FILES_PATH}/${docId}/${rel}`;
    const uploaded = await uploadFileToStorage(storagePath, f, `กำลังอัปโหลดไฟล์ ${i + 1}/${fileList.length}`);
    storagePaths.push(uploaded.path);
    manifest.push({
      path: rel,
      url: uploaded.url,
      storagePath: uploaded.path,
      contentType: f.type || guessContentType(rel),
      size: f.size
    });
  }

  return {
    uploadMode: "files",
    entryPath,
    manifest,
    gameUrl: `game-player.html?id=${encodeURIComponent(docId)}`,
    link: `game-player.html?id=${encodeURIComponent(docId)}`,
    storagePaths
  };
}

function guessContentType(path) {
  const p = path.toLowerCase();
  if (p.endsWith(".html") || p.endsWith(".htm")) return "text/html";
  if (p.endsWith(".css")) return "text/css";
  if (p.endsWith(".js")) return "text/javascript";
  if (p.endsWith(".json")) return "application/json";
  if (p.endsWith(".png")) return "image/png";
  if (p.endsWith(".jpg") || p.endsWith(".jpeg")) return "image/jpeg";
  if (p.endsWith(".webp")) return "image/webp";
  if (p.endsWith(".svg")) return "image/svg+xml";
  if (p.endsWith(".mp3")) return "audio/mpeg";
  if (p.endsWith(".wav")) return "audio/wav";
  if (p.endsWith(".mp4")) return "video/mp4";
  return "application/octet-stream";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setSaving(true);
  try {
    await window.firebaseReady;
    const currentId = val("id");
    const docRef = currentId ? window.gamesRef.doc(currentId) : window.gamesRef.doc();
    const docId = docRef.id;
    const now = firebase.firestore.FieldValue.serverTimestamp();

    let data = {
      title: val("title"),
      description: val("description"),
      category: val("category"),
      image: val("image"),
      link: val("link") || "#",
      gameUrl: val("link") || "#",
      status: val("status") || "open",
      updatedAt: now
    };
    if (!data.title) throw new Error("กรุณากรอกชื่อเกม");

    const cover = await uploadCover(docId);
    if (cover) {
      data.image = cover.url;
      data.coverPath = cover.path;
    } else if (editingGame?.coverPath) data.coverPath = editingGame.coverPath;

    const upload = getUploadFiles();
    if (upload.mode === "zip") data = { ...data, ...(await uploadGameZip(docId, upload.files[0])) };
    if (upload.mode === "files") data = { ...data, ...(await uploadGameFiles(docId, upload.files)) };

    if (!currentId) data.createdAt = now;
    await docRef.set(data, { merge: true });

    alert("บันทึกสำเร็จ");
    resetForm();
    await loadGames();
  } catch (error) {
    console.error(error);
    alert(error.message || "บันทึกไม่สำเร็จ กรุณาตรวจสอบ Firestore/Storage Rules");
  } finally {
    setSaving(false);
    setStatus("");
  }
});

function editGame(g) {
  editingGame = g;
  document.getElementById("id").value = g.id || "";
  document.getElementById("title").value = g.title || "";
  document.getElementById("description").value = g.description || "";
  document.getElementById("category").value = g.category || "อื่น ๆ";
  document.getElementById("image").value = g.image || "";
  document.getElementById("link").value = g.link || g.gameUrl || "";
  document.getElementById("status").value = g.status || "open";
  document.getElementById("coverFile").value = "";
  document.getElementById("gameFiles").value = "";
  document.getElementById("gameFolder").value = "";
  document.getElementById("gameZip").value = "";
  droppedFiles = [];
  showFileCheck();
  scrollTo(0, 0);
}

async function deleteStoragePath(path) {
  if (!path) return;
  try { await window.storage.ref(path).delete(); } catch (e) { console.warn("ลบไฟล์ไม่ได้", path, e.message); }
}

async function deleteGame(id) {
  if (!confirm("ลบเกมนี้ใช่ไหม? ข้อมูลและไฟล์ที่อัปโหลดไว้จะถูกลบด้วย")) return;
  try {
    await window.firebaseReady;
    const doc = await window.gamesRef.doc(id).get();
    const data = doc.exists ? doc.data() : {};
    const paths = new Set([...(data.storagePaths || []), data.coverPath, data.zipPath].filter(Boolean));
    for (const p of paths) await deleteStoragePath(p);
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
  editingGame = null;
  droppedFiles = [];
  showFileCheck();
  setStatus("");
}

function openPreview(url) {
  if (!url || url === "#") return alert("ยังไม่มีลิงก์เกม");
  window.open(url, "_blank");
}

async function copyLink(url) {
  if (!url || url === "#") return alert("ยังไม่มีลิงก์เกม");
  const full = new URL(url, location.href).href;
  try { await navigator.clipboard.writeText(full); alert("คัดลอกลิงก์แล้ว"); }
  catch { prompt("คัดลอกลิงก์นี้", full); }
}

window.login = login;
window.logout = logout;
window.loadGames = loadGames;
window.editGame = editGame;
window.deleteGame = deleteGame;
window.resetForm = resetForm;
window.openPreview = openPreview;
window.copyLink = copyLink;
