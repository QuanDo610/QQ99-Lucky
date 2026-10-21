# LUCKY QQ99 - HỆ THỐNG MUA VÉ SỐ & ĐÁNH SỐ HỘ 3 MIỀN

Trang web ứng dụng đặt vé số trực tuyến, tính tiền xác chuẩn xác theo luật xổ số 3 Miền (Miền Nam, Miền Trung, Miền Bắc), tự động tích hợp đồng bộ dữ liệu vào **Google Sheets**, thanh toán **VietQR Vietcombank**, và tra cứu mã giao dịch thông minh.

---

## 🌟 TÍNH NĂNG NỔI BẬT

1. **Giao diện đặt số hiện đại & Responsive 100%**:
   - Tối ưu hoàn hảo trên điện thoại di động và máy tính để bàn.
   - Hiệu ứng chọn đài, chọn loại cược, chọn điểm cược sống động (`hover`, `active`, phản hồi màu sắc trực quan).
   - Trên điện thoại: Tự động cuộn và hiển thị mã QR thanh toán sau khi xác nhận đặt số.

2. **Công thức tính tiền xác & Thưởng chuẩn xác 3 Miền**:
   - **Miền Nam & Miền Trung (18 giải)**:
     - Bao Lô 2 Số: Điểm $\times 14.000$ xác $\times$ Số đài $\times$ Số con • Ăn $\times 72$.
     - Bao Lô 3 Số: Điểm $\times 13.600$ xác • Ăn $\times 620$.
     - Bao Lô 4 Số: Điểm $\times 16.000$ xác • Ăn $\times 5200$.
     - Đầu Đuôi: Cược 10k $\rightarrow$ Xác 16k (G8 & G.ĐB) • Ăn $\times 72$.
     - Xỉu Chủ: Cược 10k $\rightarrow$ Xác 16k (G7 & G.ĐB) • Ăn $\times 620$.
   - **Miền Bắc (27 giải)**:
     - Bao Lô 2 Số: 1k điểm = 21k xác • Ăn $\times 72$.
     - Đầu Đuôi: 1k cược $\rightarrow$ Xác 4k (5 vị trí: 4 con G7 + G.ĐB) • Ăn $\times 72$.
     - Xỉu Chủ: 10k cược $\rightarrow$ Xác 32k (4 vị trí: 3 con G6 + G.ĐB) • Ăn $\times 620$.
   - **Vé Kiến Thiết**: 10.000 đ / vé.

3. **Mã Giao Dịch & Quy Tắc Giữ Vé Thông Minh**:
   - Mã giao dịch ngắn gọn dạng `QQ-XXXXXX` (VD: `QQ-782914`), không trùng lặp, dễ đọc, dễ nhớ.
   - Nội dung chuyển khoản ngân hàng (Memo): `Ung ho Page [Tên khách] [Mã đơn]`.
   - Hệ thống tra cứu linh hoạt: Khách có thể tìm bằng `QQ-782914`, `782914` hoặc Số điện thoại.
   - Quy tắc kích hoạt vé: Đơn chỉ được xác nhận hợp lệ sau khi khách đã chuyển khoản thành công.

4. **Tích hợp Google Sheets & Google Apps Script**:
   - Tự động lưu mọi đơn đặt số vào Google Sheets của chủ shop qua Web App URL ẩn bảo mật.
   - Quản lý tập trung mọi thông tin khách hàng, số đánh, đài, tiền cược và trạng thái đối soát.

5. **Bộ Test Suite Tự Động (100% Pass)**:
   - 22/22 test cases kiểm tra độc lập các module tính toán, mã đơn, xử lý chuỗi và logic lịch mở thưởng.

---

## 📁 CẤU TRÚC DỰ ÁN

| Tệp / Thư mục | Mô tả chức năng |
| :--- | :--- |
| **`index.html`** | Giao diện chính Lucky QQ99 (HTML5, TailwindCSS, Vanilla JS) |
| **`luat_choi.html`** | Trang chi tiết luật chơi, bảng so sánh tỷ lệ 3 miền và máy tính cược nhanh |
| **`test_app.js`** | Bộ test case tự động kiểm tra toàn bộ core functions |
| **`google_apps_script.js`** | Mã nguồn triển khai backend trên Google Apps Script liên kết Google Sheet |
| **`HUONG_DAN_GOOGLE_SHEET.md`** | Hướng dẫn từng bước cách tạo Sheet và kích hoạt Web App |
| **`vcb_qr_clean.png`** | Thẻ mã QR Vietcombank hiển thị trên giao diện thanh toán |
| **`LUAT_CHOI.md`** | Tài liệu quy chuẩn tỷ lệ và luật chơi gốc |
| **`check_ket_qua.py`** | Script Python tự động cào kết quả từ Minh Chính (`minhchinh.com`) |

---

## 🧪 CHẠY BỘ TEST SUITE

Chạy kiểm tra tự động tất cả các hàm cốt lõi bằng lệnh:
```bash
node test_app.js
```
Kết quả kiểm tra:
```text
====================================================
🧪 BẮT ĐẦU CHẠY BỘ TEST SUITE LUCKY QQ99
====================================================
[Nhóm 1] Kiểm tra Mã Giao Dịch: 2/2 PASS
[Nhóm 2] Kiểm tra Bỏ Dấu Tiếng Việt & Memo: 3/3 PASS
[Nhóm 3] Kiểm tra Tách Số Dự Thưởng: 2/2 PASS
[Nhóm 4] Kiểm tra Công Thức Tính Tiền Xác (LUAT_CHOI.md): 8/8 PASS
[Nhóm 5] Kiểm tra Lịch Mở Thưởng Các Đài: 2/2 PASS
[Nhóm 6] Kiểm tra Tính Năng Tra Cứu Đơn Hàng: 5/5 PASS
====================================================
🎉 KẾT QUẢ TEST: 22/22 TESTS ĐẠT YÊU CẦU!
====================================================
```

---

## 🚀 KHỞI CHẠY ỨNG DỤNG

Chỉ cần mở trực tiếp file `index.html` trên bất kỳ trình duyệt nào (Chrome, Safari, Edge, Firefox):
```bash
open index.html
```

---
*© 2026 Lucky QQ99 - Dịch vụ mua vé số & đánh số hộ chuyên nghiệp.*
