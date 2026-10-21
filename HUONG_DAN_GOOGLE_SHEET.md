# HƯỚNG DẪN TÍCH HỢP GOOGLE SHEET CHO HỆ THỐNG MUA VÉ SỐ BẢO TRẦN QQ

Hệ thống cho phép khách hàng đặt số trực tiếp trên Website (`index.html`) và **tự động lưu vào Google Sheet online** của bạn mà không tốn chi phí máy chủ (100% Miễn phí trọn đời từ Google).

---

## BƯỚC 1: TẠO GOOGLE SHEET MỚI
1. Mở trình duyệt và truy cập: **[https://sheets.new](https://sheets.new)**
2. Đặt tên cho Google Sheet ở góc trên bên trái: **`Quản Lý Đơn Vé Số - Bảo Trần QQ`**

---

## BƯỚC 2: DÁN MÃ GOOGLE APPS SCRIPT
1. Trên thanh menu của Google Sheet, chọn: **Tiện ích mở rộng** (Extensions) -> **Apps Script**.
2. Xóa hết toàn bộ các dòng mã có sẵn trong khung `Code.gs`.
3. Mở file [**`google_apps_script.js`**](./google_apps_script.js) trong thư mục này, **Sao chép (Copy) toàn bộ nội dung** và dán (Paste) vào khung Apps Script.
4. Bấm biểu tượng **Lưu** (Đĩa mềm) hoặc ấn phím tắt `Ctrl + S` (hoặc `Cmd + S` trên Mac).

---

## BƯỚC 3: TRIỂN KHAI THÀNH ỨNG DỤNG WEB (WEB APP)
1. Bấm nút màu xanh **"Triển khai" (Deploy)** ở góc trên bên phải -> Chọn **"Tùy chọn triển khai mới" (New deployment)**.
2. Bấm vào biểu tượng bánh răng ⚙️ bên cạnh chữ *Chọn loại*, chọn **"Ứng dụng web" (Web app)**.
3. Thiết lập chính xác 3 mục sau:
   - **Mô tả**: `Hệ thống nhận đơn vé số Bảo Trần QQ`
   - **Thực thi dưới dạng (Execute as)**: Chọn **"Tôi" (Me - địa chỉ gmail của bạn)**.
   - **Ai có quyền truy cập (Who has access)**: Chọn **"Bất kỳ ai" (Anyone)** *(Bắt buộc chọn Anyone để khách gửi đơn từ web vào được)*.
4. Bấm nút **"Triển khai" (Deploy)**.
5. Google sẽ yêu cầu ủy quyền:
   - Chọn tài khoản Google của bạn.
   - Nếu hiện màn hình *"Google chưa xác minh ứng dụng này"*, bấm vào chữ **Nâng cao (Advanced)** ở góc dưới -> Bấm tiếp **"Đi tới ... (không an toàn)"**.
   - Bấm **Cho phép (Allow)**.
6. Sau khi xong, Google sẽ cung cấp **URL ứng dụng web**:
   - Dạng link: `https://script.google.com/macros/s/AKfycb.../exec`
   - Bấm nút **Sao chép (Copy)** đường link này.

---

## BƯỚC 4: KÍCH HOẠT TRÊN WEBSITE
1. Mở file `index.html` trên trình duyệt.
2. Bấm nút **"⚙️ Cài Đặt Sheet"** ở góc trên cùng của Website.
3. Dán đường link vừa copy vào ô **"URL Google Apps Script"**.
4. Bấm **"Kiểm tra kết nối"** (Khi hiện đèn xanh *✓ Kết nối Google Sheet thành công!* là xong) -> Bấm **"Lưu cấu hình"**.

Từ thời điểm này, mỗi khi có khách đặt số trên web:
- Dữ liệu sẽ tự động nhảy trực tiếp vào Sheet **`DonDatSo`** trên Google Sheet của bạn.
- Các cột được tạo tự động:
  1. **Mã Đơn** (VD: `BT-20261021-1345`)
  2. **Thời Gian Đặt** (VD: `21/10/2026 13:45:00`)
  3. **Họ Và Tên** (Full name)
  4. **SĐT / Zalo**
  5. **Miền** (Bắc / Trung / Nam)
  6. **Ngày Xổ**
  7. **Đài Đánh** (VD: `Đồng Nai, Cần Thơ (2 đài)`)
  8. **Loại Cược** (Bao Lô 2 Số, Đầu Đuôi, Xỉu Chủ...)
  9. **Số Đánh** (VD: `68, 79`)
  10. **Tiền Mỗi Con (k)** (VD: `10k`)
  11. **Tiền Phải Chuyển (VNĐ)** (Tự động tính đúng tiền xác)
  12. **Nội Dung CK (Memo)** (`Ung ho Page [Tên]`)
  13. **Trạng Thái** (`CHO_THANH_TOAN`)
  14. **Ghi Chú**
