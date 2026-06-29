// วางลิงก์ Apps Script /exec ตรงนี้
const API_URL = "https://script.google.com/macros/s/AKfycbzjV6IWOQJedG3ZnujlgQvij6puPIBYvCtvGnny05xwb6N7_acU3UPEx83CIik1uV0mQQ/exec";

// ===============================
// config.js
// ตั้งค่าระบบเว็บรวมเกมครูกุ้ง
// ใช้ Firebase แทน Apps Script
// ===============================

// รหัสผ่าน Admin แบบง่าย
// ถ้ายังไม่ทำ Firebase Login ใช้ตัวนี้ไปก่อน
const ADMIN_PASSWORD = "vip69";

// Firebase Config
// ให้เปลี่ยนค่าด้านล่างเป็นของโปรเจกต์ krukung-game-hub
const firebaseConfig = {
  apiKey: "วาง apiKey ตรงนี้",
  authDomain: "krukung-game-hub.firebaseapp.com",
  projectId: "krukung-game-hub",
  storageBucket: "krukung-game-hub.firebasestorage.app",
  messagingSenderId: "วาง messagingSenderId ตรงนี้",
  appId: "วาง appId ตรงนี้"
};

// ชื่อ Collection ใน Firestore
const COLLECTION_GAMES = "games";

// ค่าเริ่มต้นของระบบ
const DEFAULT_GAME_IMAGE = "https://via.placeholder.com/400x300";
const DEFAULT_GAME_URL = "#";

// หมวดหมู่เกม
const GAME_CATEGORIES = [
  "คณิตศาสตร์",
  "ภาษาไทย",
  "ภาษาอังกฤษ",
  "วิทยาศาสตร์",
  "คอมพิวเตอร์",
  "เกม AR",
  "เกมฝึกสมอง",
  "อื่น ๆ"
];

// สถานะเกม
const GAME_STATUS = {
  OPEN: "เปิดเล่น",
  CLOSED: "ปิด"
};

// Export สำหรับไฟล์อื่นเรียกใช้
window.APP_CONFIG = {
  ADMIN_PASSWORD,
  firebaseConfig,
  COLLECTION_GAMES,
  DEFAULT_GAME_IMAGE,
  DEFAULT_GAME_URL,
  GAME_CATEGORIES,
  GAME_STATUS
};
