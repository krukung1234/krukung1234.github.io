// Krukung Game Hub V6
const ADMIN_PASSWORD = "vip69";
const firebaseConfig = {
  apiKey: "AIzaSyCVYn2hDEXG4J08hZwf5WMI6kyIJbWPVwg",
  authDomain: "krukung-game-hub.firebaseapp.com",
  projectId: "krukung-game-hub",
  storageBucket: "krukung-game-hub.firebasestorage.app",
  messagingSenderId: "63458233316",
  appId: "1:63458233316:web:3b3666b91b16bba28795f1",
  measurementId: "G-HWM115TVMB"
};
const APP_CONFIG = {
  ADMIN_PASSWORD,
  COLLECTION_GAMES: "games",
  DEFAULT_IMAGE: "https://placehold.co/800x450?text=Krukung+Game",
  STATUS_LABELS: { open:"เปิดเล่น", soon:"เร็ว ๆ นี้", hidden:"ซ่อน" }
};
window.APP_CONFIG = APP_CONFIG;
function loadFirebaseScript(src){return new Promise((res,rej)=>{if(document.querySelector(`script[src="${src}"]`)) return res(); const s=document.createElement('script'); s.src=src; s.onload=res; s.onerror=()=>rej(new Error('โหลด Firebase SDK ไม่สำเร็จ')); document.head.appendChild(s);});}
window.firebaseReady=(async()=>{await loadFirebaseScript('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js'); await loadFirebaseScript('https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore-compat.js'); await loadFirebaseScript('https://www.gstatic.com/firebasejs/10.12.5/firebase-storage-compat.js'); if(!firebase.apps.length) firebase.initializeApp(firebaseConfig); window.db=firebase.firestore(); window.storage=firebase.storage(); window.gamesRef=window.db.collection(APP_CONFIG.COLLECTION_GAMES); return {firebase,db:window.db,storage:window.storage,gamesRef:window.gamesRef};})();
