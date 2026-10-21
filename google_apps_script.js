/**
 * =========================================================================
 * GOOGLE APPS SCRIPT: HỆ THỐNG QUẢN LÝ ĐẶT MUA SỐ / VÉ SỐ HỘ - BẢO TRẦN QQ
 * =========================================================================
 * 
 * HƯỚNG DẪN CÀI ĐẶT NHANH TRONG 1 PHÚT:
 * 1. Mở Google Sheets (truy cập https://sheets.new)
 * 2. Đổi tên trang tính thành: "Quản Lý Đơn Vé Số - Bảo Trần QQ"
 * 3. Vào menu: Tiện ích mở rộng (Extensions) -> Apps Script
 * 4. Xóa hết mã cũ trong file Code.gs, DÁN TOÀN BỘ MÃ NÀY VÀO
 * 5. Bấm biểu tượng Lưu (Ctrl+S hoặc Cmd+S)
 * 6. Bấm nút màu xanh "Triển khai" (Deploy) góc trên bên phải -> "Tùy chọn triển khai mới" (New deployment)
 *    - Chọn loại: Ứng dụng web (Web app)
 *    - Mô tả: "Hệ thống nhận đơn vé số"
 *    - Thực thi dưới dạng (Execute as): "Tôi" (Me)
 *    - Ai có quyền truy cập (Who has access): "Bất kỳ ai" (Anyone) -> RẤT QUAN TRỌNG!
 * 7. Bấm "Triển khai" -> Cấp quyền cho Google Tài khoản của bạn
 * 8. Copy đường link "URL ứng dụng web" (dạng: https://script.google.com/macros/s/.../exec)
 * 9. Dán URL này vào mục "Cài đặt Google Sheet" trên Website!
 * =========================================================================
 */

const SHEET_ORDERS = "DonDatSo";

/**
 * Tự động tạo và định dạng bảng Google Sheet nếu chưa có
 */
function initSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_ORDERS);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_ORDERS);
    
    // Header cột
    const headers = [
      "Mã Đơn",
      "Thời Gian Đặt",
      "Họ Và Tên",
      "SĐT / Zalo",
      "Miền",
      "Ngày Xổ",
      "Đài Đánh",
      "Loại Cược",
      "Số Đánh",
      "Tiền Mỗi Con (k)",
      "Tiền Phải Chuyển (VNĐ)",
      "Nội Dung CK (Memo)",
      "Trạng Thái",
      "Ghi Chú"
    ];
    
    sheet.appendRow(headers);
    
    // Định dạng giao diện Header chuyên nghiệp
    const headerRange = sheet.getRange("A1:N1");
    headerRange.setFontWeight("bold")
               .setBackground("#059669") // Emerald green Vietcombank style
               .setFontColor("#ffffff")
               .setHorizontalAlignment("center");
    
    sheet.setFrozenRows(1);
    
    // Căn lề các cột
    sheet.getRange("A:A").setHorizontalAlignment("center"); // Mã đơn
    sheet.getRange("B:B").setHorizontalAlignment("center"); // Thời gian
    sheet.getRange("D:D").setHorizontalAlignment("center"); // SĐT
    sheet.getRange("E:F").setHorizontalAlignment("center"); // Miền, Ngày xổ
    sheet.getRange("J:J").setHorizontalAlignment("right");  // Tiền mỗi con
    sheet.getRange("K:K").setHorizontalAlignment("right").setFontWeight("bold"); // Tiền phải chuyển
    sheet.getRange("M:M").setHorizontalAlignment("center"); // Trạng thái
    
    sheet.autoResizeColumns(1, 14);
  }
  
  return sheet;
}

/**
 * Xử lý yêu cầu GET: Kiểm tra kết nối từ Website hoặc đọc dữ liệu
 */
function doGet(e) {
  try {
    initSheet();
    const action = (e && e.parameter && e.parameter.action) || 'ping';
    
    if (action === 'get_orders') {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName(SHEET_ORDERS);
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const rows = data.slice(1).reverse().slice(0, 50); // 50 đơn mới nhất
      
      const orders = rows.map(r => {
        let obj = {};
        headers.forEach((h, i) => obj[h] = r[i]);
        return obj;
      });
      
      return createJsonResponse({
        status: "success",
        total: orders.length,
        orders: orders
      });
    }
    
    // Mặc định trả về kết nối thành công (dùng để test URL từ website)
    return createJsonResponse({
      status: "success",
      message: "Kết nối thành công với Google Sheet Quản Lý Đơn Vé Số!",
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return createJsonResponse({
      status: "error",
      message: err.toString()
    });
  }
}

/**
 * Xử lý yêu cầu POST: Nhận dữ liệu đặt số từ Website và lưu vào Google Sheet
 */
function doPost(e) {
  try {
    const sheet = initSheet();
    let data = {};
    
    // Hỗ trợ cả JSON body lẫn URL-encoded parameter
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }
    
    // Chuẩn bị dữ liệu từng cột
    const orderId = data.orderId || ('BT-' + Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd-HHmmss"));
    const orderTime = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");
    const fullName = data.fullName || 'Khách vãng lai';
    const phone = data.phone || '';
    const region = data.region || 'MN';
    const drawDate = data.drawDate || Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy");
    const stations = data.stations || 'Đài mặc định';
    const betType = data.betType || 'Bao Lô 2 Số';
    const numbers = data.numbers || '';
    const pointPerNumber = data.pointPerNumber || 10;
    const totalAmount = Number(data.totalAmount || 0);
    const memo = data.memo || ('Ung ho Page ' + fullName);
    const status = data.status || 'CHO_THANH_TOAN';
    const note = data.note || '';
    
    // Ghi hàng mới vào Sheet
    const newRow = [
      orderId,
      orderTime,
      fullName,
      "'" + phone, // Thêm dấu ' để không bị mất số 0 ở đầu SĐT
      region,
      drawDate,
      stations,
      betType,
      numbers,
      pointPerNumber,
      totalAmount,
      memo,
      status,
      note
    ];
    
    sheet.appendRow(newRow);
    
    // Định dạng màu nhẹ cho hàng mới theo trạng thái
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 11).setNumberFormat("#,##0 \"đ\"");
    
    return createJsonResponse({
      status: "success",
      message: "Đơn đặt số đã được lưu vào Google Sheet thành công!",
      orderId: orderId,
      row: lastRow
    });
    
  } catch (err) {
    return createJsonResponse({
      status: "error",
      message: "Lỗi ghi dữ liệu: " + err.toString()
    });
  }
}

/**
 * Trả về phản hồi JSON có hỗ trợ CORS
 */
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
                       .setMimeType(ContentService.MimeType.JSON);
}
