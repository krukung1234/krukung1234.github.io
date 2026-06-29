// วางลิงก์ Apps Script /exec ตรงนี้
const API_URL = "https://script.google.com/macros/s/AKfycbzjV6IWOQJedG3ZnujlgQvij6puPIBYvCtvGnny05xwb6N7_acU3UPEx83CIik1uV0mQQ/exec";

// ==========================================
// config.js
// Krukung Game Hub
// Firebase Configuration
// ==========================================

// -------------------------------
// Admin
// -------------------------------
const ADMIN_PASSWORD = "vip69";

// -------------------------------
// Firebase Config
// -------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyCVYn2hDEXG4J08hZwf5WMI6kyIJbWPVwg",
  authDomain: "krukung-game-hub.firebaseapp.com",
  projectId: "krukung-game-hub",
  storageBucket: "krukung-game-hub.firebasestorage.app",
  messagingSenderId: "63458233316",
  appId: "1:63458233316:web:3b3666b91b16bba28795f1",
  measurementId: "G-HWM115TVMB"
};

// -------------------------------
// Firestore
// -------------------------------
const COLLECTION_GAMES = "games";

// -------------------------------
// Default
// -------------------------------
const DEFAULT_GAME_IMAGE = "https://via.placeholder.com/400x300";
const DEFAULT_GAME_URL = "#";

// -------------------------------
// Categories
// -------------------------------
const GAME_CATEGORIES = [
  "คณิตศาสตร์",
  "ภาษาไทย",
  "ภาษาอังกฤษ",
  "วิทยาศาสตร์",
  "คอมพิวเตอร์",
  "AR",
  "Coding",
  "AI",
  "อื่น ๆ"
];

// -------------------------------
// Status
// -------------------------------
const GAME_STATUS = {
  OPEN: "เปิดเล่น",
  CLOSED: "ปิด"
};
