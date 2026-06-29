// ======================================
// js/config.js
// Krukung Game Hub - Firebase Version
// ======================================

// รหัสผ่าน Admin
const ADMIN_PASSWORD = "vip69";

// Firebase Config ของโปรเจกต์ krukung-game-hub
const firebaseConfig = {
  apiKey: "AIzaSyCVYn2hDEXG4J08hZwf5WMI6kyIJbWPVwg",
  authDomain: "krukung-game-hub.firebaseapp.com",
  projectId: "krukung-game-hub",
  storageBucket: "krukung-game-hub.firebasestorage.app",
  messagingSenderId: "63458233316",
  appId: "1:63458233316:web:3b3666b91b16bba28795f1",
  measurementId: "G-HWM115TVMB"
};

// ตั้งค่าระบบ
const APP_CONFIG = {
  ADMIN_PASSWORD,
  firebaseConfig,
  COLLECTION_GAMES: "games",
  DEFAULT_IMAGE: "https://via.placeholder.com/400x300",
  STATUS_LABELS: {
    open: "เปิดเล่น",
    soon: "เร็ว ๆ นี้",
    hidden: "ซ่อน",
    "เปิดเล่น": "เปิดเล่น",
    "ปิด": "ซ่อน"
  }
};

window.APP_CONFIG = APP_CONFIG;
window.ADMIN_PASSWORD = ADMIN_PASSWORD;

// โหลด Firebase SDK อัตโนมัติ เหมาะกับ GitHub Pages ไม่ต้องใช้ npm
function loadFirebaseScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error("โหลด Firebase SDK ไม่สำเร็จ: " + src));
    document.head.appendChild(script);
  });
}

window.firebaseReady = (async () => {
  await loadFirebaseScript("https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js");
  await loadFirebaseScript("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore-compat.js");

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  window.db = firebase.firestore();
  window.gamesRef = window.db.collection(APP_CONFIG.COLLECTION_GAMES);
  return { firebase, db: window.db, gamesRef: window.gamesRef };
})();
