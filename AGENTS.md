# AGENTS.MD - HỆ THỐNG AGENT LOTO TRACKING

Tài liệu quy định vai trò và nguyên tắc hoạt động của AI Agent khi làm việc với hệ thống vé cược Xổ Số Minh Chính.

## 1. NGUYÊN TẮC CỐT LÕI
- **Độ chính xác tuyệt đối**: Mọi phép tính tiền xác, tiền trúng và nháy số phải đối chiếu chính xác theo [LUAT_CHOI.md](./LUAT_CHOI.md).
- **Minh bạch nguồn dữ liệu**: Kết quả phải lấy trực tiếp từ trang chính thống Minh Chính (`minhchinh.com`).
- **Không tự ý giả định tỷ lệ**: Nếu gặp loại cược chưa rõ mức xác (như xác 3 số, 4 số hoặc Miền Bắc), cần thông báo rõ mức giả định đang dùng và hỏi lại người dùng để chốt.

## 2. CÁC TÁC VỤ THƯỜNG GẶP (PLAYBOOK)

### Tác vụ 1: Ghi nhận vé cược mới cho khách
- Đọc thông tin: Tên khách, ngày đánh, miền, đài, loại cược, số đánh, điểm/tiền cược.
- Tính tiền xác cần thu và tiền trúng tiềm năng.
- Ghi 1 dòng mới vào `lich_su_danh.csv` với trạng thái ban đầu là `CHO_SO` (Pending).

### Tác vụ 2: Tra cứu kết quả và dò thưởng
- Chạy script `python3 check_ket_qua.py --settle` hoặc tải HTML từ Minh Chính.
- Kiểm tra các số trúng thưởng:
  - Với Bao Lô: kiểm tra 2/3/4 số cuối của từng giải.
  - Với Đầu Đuôi: kiểm tra giải 8 và giải Đặc Biệt.
  - Với Xỉu Chủ: kiểm tra giải 7 và giải Đặc Biệt.
- Ghi lại số nháy, tiền thưởng và cập nhật cột `Ket_Qua` thành `TRUNG` hoặc `TRUOT`.
