# HƯỚNG DẪN DÀNH CHO GEMINI (AI ASSISTANT)

> **Dự án**: Quản lý cược và tra cứu kết quả Xổ Số 3 Miền (LOTO)  
> **Nguồn kết quả**: Website Xổ Số Minh Chính (`https://www.minhchinh.com/ket-qua-xo-so-mien-nam.html`)  
> **Tài liệu luật chơi gốc**: Xem tại [LUAT_CHOI.md](./LUAT_CHOI.md)

---

## 1. VAI TRÒ CỦA GEMINI TRONG DỰ ÁN
Khi người dùng tương tác trong cuộc trò chuyện (ví dụ: yêu cầu ghi vé mới, kiểm tra vé hôm nay, dò số trúng thưởng cho khách hàng):
1. **Tra cứu luật**: Phân biệt chính xác giữa **Miền Nam / Miền Trung (MN & MT)** và **Miền Bắc (MB)** theo [LUAT_CHOI.md](./LUAT_CHOI.md).
2. **Kiểm tra kết quả trực tiếp**:
   - Khi có khách chơi cần dò kết quả, chạy thẳng lệnh `python3 check_ket_qua.py --settle` hoặc cào trực tiếp từ Minh Chính để lấy kết quả mới nhất theo ngày và đài tương ứng.
3. **Cập nhật dữ liệu**:
   - Ghi nhận vé vào file `lich_su_danh.csv`.
   - Cập nhật số dư thắng/thua của khách vào `nguoi_choi.json`.
   - Lưu kết quả xổ số đã cào vào `ket_qua_xo_so.json`.

---

## 2. QUY TẮC TÍNH TIỀN CỐT LÕI

### A. Miền Nam & Miền Trung (MN & MT - Mỗi đài 18 giải)
- **Bao Lô 2 Số**:
  - Tiền xác = $\text{Điểm (k)} \times 14 \times \text{Số đài} \times \text{Số con}$.
  - Trúng mỗi nháy: $\text{Điểm (k)} \times 72$.
- **Bao Lô 3 Số**: Trúng $\times 620$.
- **Bao Lô 4 Số**: Trúng $\times 5200$.
- **Đầu Đuôi (2 Số)**:
  - Cược 10k $\rightarrow$ Xác 16k (Hệ số 1.6).
  - Vị trí dò: **Giải 8** (Đầu) và **Giải Đặc Biệt** (Đuôi).
  - Trúng mỗi vị trí ăn $\times 72$ (Ví dụ cược 10k ăn 720k).
- **Xỉu Chủ (3 Số)**:
  - Vị trí dò: **Giải 7** và **Giải Đặc Biệt**.
  - Trúng mỗi vị trí ăn $\times 620$.

### B. Miền Bắc (MB - Chỉ 1 đài, 27 giải, KHÔNG có Giải 8)
- **Bao Lô**:
  - Tiền xác: **1k điểm = 21k xác** (Do có 27 lô).
  - Trúng 2 số: $\times 72$ ($1\text{k} \rightarrow 72\text{k}$).
  - Trúng 3 số: $\times 620$ ($1\text{k} \rightarrow 620\text{k}$).
- **Đầu Đuôi (2 Số)**:
  - Tiền xác: **1k cược $\rightarrow$ Xác 4k** (10k cược $\rightarrow$ Xác 40k).
  - Vị trí dò: Gồm **4 số của Giải 7** (Đầu) và **Giải Đặc Biệt** (Đuôi) *(Tổng 5 vị trí)*.
  - Trúng mỗi vị trí ăn $\times 72$ ($1\text{k} \rightarrow 72\text{k}$; $10\text{k} \rightarrow 720\text{k}$).
- **Xỉu Chủ (3 Số)**:
  - Tiền xác: **10k cược $\rightarrow$ Xác 32k** (Hệ số 3.2).
  - Vị trí dò: Gồm **3 số của Giải 6** (Đầu) và **Giải Đặc Biệt** (Đuôi) *(Tổng 4 vị trí)*.
  - Trúng mỗi vị trí ăn $\times 620$ ($10\text{k} \rightarrow 6.200\text{k}$).

---

## 3. CÁC LỆNH NHANH GEMINI CÓ THỂ CHẠY

```bash
# 1. Cào và xem kết quả xổ số hôm nay (hoặc ngày chỉ định)
python3 check_ket_qua.py --region MB --date 15-10-2026

# 2. Tự động dò toàn bộ vé cược trong file lich_su_danh.csv với kết quả Minh Chính
python3 check_ket_qua.py --settle
```
