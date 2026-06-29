Krukung Game Hub V6 - พร้อมใช้งาน

ไฟล์ที่ต้องอัปโหลดขึ้น GitHub
1) index.html
2) admin.html
3) game-player.html
4) โฟลเดอร์ css ทั้งโฟลเดอร์
5) โฟลเดอร์ js ทั้งโฟลเดอร์

หมายเหตุสำคัญ
- ใน GitHub ต้องให้ css และ js เป็นโฟลเดอร์ ไม่ใช่ไฟล์
- ถ้าเคยสร้าง css/js ผิดเป็นไฟล์ ให้ลบก่อน แล้วอัปโหลดโฟลเดอร์ใหม่

Firebase Rules สำหรับทดสอบ
Firestore:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}

Storage:
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}

วิธีเพิ่มเกม
1) เปิด admin.html
2) ใส่รหัส vip69
3) กรอกชื่อเกม
4) เลือกรูปปก
5) เลือกโฟลเดอร์เกม หรือเลือกไฟล์ index.html
6) กดบันทึก

เกมที่อัปโหลดควรมีไฟล์ index.html อยู่ด้านใน
