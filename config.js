// ======================================
// Krukung Game Hub
// Firebase Config
// ======================================

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

const COLLECTION = "games";

const STATUS = {
  OPEN: "open",
  SOON: "soon",
  HIDDEN: "hidden"
};

const DEFAULT_IMAGE = "";

window.APP = {
  ADMIN_PASSWORD,
  firebaseConfig,
  COLLECTION,
  STATUS,
  DEFAULT_IMAGE
};
