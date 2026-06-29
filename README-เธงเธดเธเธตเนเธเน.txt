Krukung Game Hub V13 Full

วิธีลงไฟล์
1) แตก ZIP
2) เปิดโฟลเดอร์ krukung_v13_full
3) คัดลอกไฟล์ทั้งหมดไปวางทับในโฟลเดอร์ krukung1234.github.io
4) เปิด GitHub Desktop > Commit > Push origin
5) เปิดเว็บด้วย ?v=13

ลิงก์เว็บ
หน้าเว็บหลัก: https://krukung1234.github.io/?v=13
หน้า Admin: https://krukung1234.github.io/admin.html?v=13

วิธีเพิ่มเกมแบบง่าย
1) ในโฟลเดอร์ krukung1234.github.io ให้เข้าโฟลเดอร์ games
2) สร้างโฟลเดอร์เกม เช่น ar-sudoku
3) ใส่ไฟล์เกมไว้ในนั้น โดยต้องมี index.html
4) ถ้ามีรูปปก ให้ตั้งชื่อ cover.png แล้วใส่ในโฟลเดอร์เกม
ตัวอย่าง: games/ar-sudoku/index.html และ games/ar-sudoku/cover.png
5) GitHub Desktop > Commit > Push origin
6) เข้า Admin > กรอกชื่อเกม หมวด รายละเอียด และชื่อโฟลเดอร์ ar-sudoku
7) ช่องรูปปกเว้นว่างได้ ระบบจะใช้ games/ar-sudoku/cover.png อัตโนมัติ

Firestore Rules สำหรับทดสอบ
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /games/{docId} {
      allow read, write: if true;
    }
  }
}
