# HỆ THỐNG QUẢN LÝ & TRA CỨU LOTO 3 MIỀN (MINH CHÍNH)

Hệ thống quản lý vé cược, tra cứu kết quả và đối chiếu trực tiếp từ **Xổ Số Minh Chính** (`minhchinh.com`).

---

## 📁 DANH SÁCH FILE TRONG THƯ MỤC

| Tên File | Chức năng | Cách mở / sử dụng |
| :--- | :--- | :--- |
| **`LUAT_CHOI.md`** | Quy định chi tiết luật chơi, tỷ lệ xác, tỷ lệ trúng thưởng của công ty | Mở bằng trình đọc Markdown hoặc text editor |
| **`GEMINI.md`** | Hướng dẫn dành cho AI Gemini khi bạn yêu cầu kiểm tra vé hoặc dò kết quả | Gemini tự động đọc |
| **`AGENTS.md`** | Quy chuẩn hoạt động và playbook tác vụ của Agent | Quy chuẩn quy trình |
| **`lich_su_danh.csv`** | Danh sách lịch sử khách đánh, tiền cược, kết quả trúng/trượt, tiền thưởng | Mở trực tiếp bằng **Microsoft Excel** hoặc **Apple Numbers** |
| **`nguoi_choi.json`** | Danh sách khách hàng và thống kê tổng tiền cược / trúng | Lưu trữ JSON nhẹ |
| **`ket_qua_xo_so.json`** | Cache kết quả xổ số đã cào trực tiếp từ Minh Chính | Lưu trữ JSON |
| **`check_ket_qua.py`** | Script Python tự động lên website Minh Chính lấy kết quả và dò vé | Chạy qua Terminal |
| **`index.html`** | Giao diện tính tiền xác nhanh và tra cứu luật | **Nhấp đúp chuột để mở bằng Safari / Chrome** |

---

## ⚡ CÁCH SỬ DỤNG NHANH

### 1. Ngày có khách chơi mới:
- Bạn chỉ cần ghi vào file `lich_su_danh.csv` (bằng Excel/Numbers), hoặc bảo Gemini ghi giúp.
- Muốn tính nhanh tiền xác phải thu: Nhấp đúp chuột mở file `index.html`.

### 2. Chiều có kết quả xổ số (16h15 MN, 17h15 MT, 18h15 MB):
Chỉ cần chạy 1 lệnh trong Terminal:
```bash
python3 check_ket_qua.py --settle
```
*Script sẽ tự động kết nối trực tiếp đến website Minh Chính, lấy kết quả hôm nay, đối chiếu từng vé trong `lich_su_danh.csv`, tính tiền trúng thưởng và cập nhật trạng thái `TRUNG` / `TRUOT` ngay lập tức.*
