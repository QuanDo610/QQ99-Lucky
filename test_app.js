/**
 * LUCKY QQ99 - BỘ TEST CASE TỰ ĐỘNG CHO CORE FUNCTIONS
 * Chạy lệnh: node test_app.js
 */

const assert = require('assert');

// 1. DỮ LIỆU ĐÀI QUAY THEO THỨ
const STATIONS_SCHEDULE = {
  MN: {
    0: ['Tiền Giang', 'Kiên Giang', 'Đà Lạt'],
    1: ['TP.HCM', 'Đồng Tháp', 'Cà Mau'],
    2: ['Bến Tre', 'Vũng Tàu', 'Bạc Liêu'],
    3: ['Đồng Nai', 'Cần Thơ', 'Sóc Trăng'],
    4: ['Tây Ninh', 'An Giang', 'Bình Thuận'],
    5: ['Vĩnh Long', 'Bình Dương', 'Trà Vinh'],
    6: ['TP.HCM', 'Long An', 'Bình Phước', 'Hậu Giang']
  },
  MT: {
    0: ['Kon Tum', 'Khánh Hòa', 'Thừa Thiên Huế'],
    1: ['Thừa Thiên Huế', 'Phú Yên'],
    2: ['Đắk Lắk', 'Quảng Nam'],
    3: ['Đà Nẵng', 'Khánh Hòa'],
    4: ['Bình Định', 'Quảng Trị', 'Quảng Bình'],
    5: ['Gia Lai', 'Ninh Thuận'],
    6: ['Đà Nẵng', 'Quảng Ngãi', 'Đắk Nông']
  },
  MB: {
    0: ['Miền Bắc (Hà Nội)'],
    1: ['Miền Bắc (Hà Nội)'],
    2: ['Miền Bắc (Quảng Ninh)'],
    3: ['Miền Bắc (Bắc Ninh)'],
    4: ['Miền Bắc (Hà Nội)'],
    5: ['Miền Bắc (Hải Phòng)'],
    6: ['Miền Bắc (Nam Định)']
  }
};

// 2. HÀM XỬ LÝ CHUỖI & DẤU TIẾNG VIỆT
function removeVietnameseTones(str) {
  if (!str) return '';
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  return str.replace(/[^a-zA-Z0-9 ]/g, "").trim();
}

// 3. SINH MÃ GIAO DỊCH NGẮN GỌN & DUY NHẤT
function generateSimpleOrderId() {
  const randNum = Math.floor(100000 + Math.random() * 900000);
  return `QQ-${randNum}`;
}

// 4. TẠO MEMO NỘI DUNG CHUYỂN KHOẢN
function getTransferMemoString(fullName, orderId) {
  const code = orderId || 'QQ-999999';
  if (fullName && fullName.trim()) {
    const cleanName = removeVietnameseTones(fullName).slice(0, 15);
    return `Ung ho Page ${cleanName} ${code}`;
  }
  return `Ung ho Page QQ99 ${code}`;
}

// 5. TÁCH DANH SÁCH SỐ ĐÁNH
function parseTargetNumbers(rawInput) {
  if (!rawInput) return [];
  return rawInput.trim().split(/[\s,;]+/).filter(Boolean);
}

// 6. CÔNG THỨC TÍNH TIỀN CƯỢC THEO LUẬT CHƠI
function calculateBetCost({ region, betType, point, stationsCount, numbersCount }) {
  let unitFactor = 0;
  let winMultiplier = 0;

  if (betType === 'BAO_LO_2') {
    unitFactor = (region === 'MB') ? 21000 : 14000;
    winMultiplier = 72000;
  } else if (betType === 'BAO_LO_3') {
    unitFactor = (region === 'MB') ? 21000 : 13600;
    winMultiplier = 620000;
  } else if (betType === 'BAO_LO_4') {
    unitFactor = 16000;
    winMultiplier = 5200000;
  } else if (betType === 'DAU_DUOI') {
    unitFactor = (region === 'MB') ? 4000 : 1600;
    winMultiplier = 72000;
  } else if (betType === 'XIU_CHU') {
    unitFactor = (region === 'MB') ? 3200 : 1600;
    winMultiplier = 620000;
  } else if (betType === 'KIEN_THIET') {
    unitFactor = 10000;
    winMultiplier = 0;
  }

  let total = 0;
  if (betType === 'KIEN_THIET') {
    total = point * 10000;
  } else {
    total = Math.round(point * unitFactor * stationsCount * numbersCount);
  }

  const potentialWin = Math.round(point * winMultiplier);
  return { total, potentialWin, unitFactor };
}

// 7. KHỚP TRA CỨU ĐƠN HÀNG LINH HOẠT
function matchOrderLookup(order, query) {
  if (!order || !query) return false;
  const cleanQ = query.toLowerCase().replace(/\s+/g, '');
  const rawDigits = query.replace(/[^0-9]/g, '');
  const id = (order.orderId || '').toLowerCase().replace(/\s+/g, '');
  const idDigits = id.replace(/[^0-9]/g, '');
  const phone = (order.phone || '').replace(/\s+/g, '');

  return id === cleanQ ||
         (rawDigits.length >= 6 && idDigits === rawDigits) ||
         (cleanQ.length >= 4 && phone.includes(cleanQ));
}

// =============================================================================
// THỰC THI BỘ TEST SUITE
// =============================================================================
let passedTests = 0;
let totalTests = 0;

function runTest(testName, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ PASS: ${testName}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${testName}`);
    console.error(`    ${err.message}`);
  }
}

console.log('====================================================');
console.log('🧪 BẮT ĐẦU CHẠY BỘ TEST SUITE LUCKY QQ99');
console.log('====================================================\n');

// NHÓM 1: MÃ GIAO DỊCH (ORDER ID)
console.log('[Nhóm 1] Kiểm tra Mã Giao Dịch:');
runTest('Định dạng mã giao dịch phải là QQ-XXXXXX (6 chữ số)', () => {
  const id = generateSimpleOrderId();
  assert.match(id, /^QQ-\d{6}$/, `Mã không đúng định dạng QQ-6 số: ${id}`);
});

runTest('Sinh 100 mã ngẫu nhiên liên tiếp đảm bảo tính phân tán cao', () => {
  const set = new Set();
  for (let i = 0; i < 100; i++) {
    const id = generateSimpleOrderId();
    set.add(id);
  }
  assert.ok(set.size >= 99, 'Phát hiện mã trùng lặp bất thường trong 100 lần sinh');
});

// NHÓM 2: BỎ DẤU TIẾNG VIỆT & MEMO NGÂN HÀNG
console.log('\n[Nhóm 2] Kiểm tra Bỏ Dấu Tiếng Việt & Nội Dung Memo:');
runTest('Bỏ dấu tiếng Việt chuẩn xác', () => {
  assert.strictEqual(removeVietnameseTones('Nguyễn Văn An'), 'Nguyen Van An');
  assert.strictEqual(removeVietnameseTones('Đỗ Trọng Minh Quân'), 'Do Trong Minh Quan');
  assert.strictEqual(removeVietnameseTones('Trần Thị Mai!@#$'), 'Tran Thi Mai');
});

runTest('Tạo Memo ngân hàng có họ tên và mã đơn', () => {
  const memo = getTransferMemoString('Nguyễn Văn An', 'QQ-782914');
  assert.strictEqual(memo, 'Ung ho Page Nguyen Van An QQ-782914');
});

runTest('Tạo Memo mặc định khi chưa có họ tên', () => {
  const memo = getTransferMemoString('', 'QQ-782914');
  assert.strictEqual(memo, 'Ung ho Page QQ99 QQ-782914');
});

// NHÓM 3: TÁCH SỐ ĐÁNH
console.log('\n[Nhóm 3] Kiểm tra Tách Số Dự Thưởng:');
runTest('Tách chuỗi số cách nhau bởi dấu cách, dấu phẩy, chấm phẩy', () => {
  const nums = parseTargetNumbers('68 79,  86; 99');
  assert.deepStrictEqual(nums, ['68', '79', '86', '99']);
});

runTest('Bỏ qua khoảng trắng thừa và ký tự trống', () => {
  const nums = parseTargetNumbers('   79     83   ');
  assert.deepStrictEqual(nums, ['79', '83']);
});

// NHÓM 4: CÔNG THỨC TÍNH TIỀN THEO LUẬT CHƠI
console.log('\n[Nhóm 4] Kiểm tra Công Thức Tính Tiền Xác & Tiền Ăn (LUAT_CHOI.md):');
runTest('MN - Bao Lô 2 Số: 10k x 14.000 xác x 1 đài x 2 con = 280.000đ • Ăn 720.000đ', () => {
  const res = calculateBetCost({ region: 'MN', betType: 'BAO_LO_2', point: 10, stationsCount: 1, numbersCount: 2 });
  assert.strictEqual(res.total, 280000);
  assert.strictEqual(res.potentialWin, 720000);
});

runTest('MN - Bao Lô 3 Số: 5k x 13.600 xác x 2 đài x 1 con = 136.000đ • Ăn 3.100.000đ', () => {
  const res = calculateBetCost({ region: 'MN', betType: 'BAO_LO_3', point: 5, stationsCount: 2, numbersCount: 1 });
  assert.strictEqual(res.total, 136000);
  assert.strictEqual(res.potentialWin, 3100000);
});

runTest('MN - Đầu Đuôi: Cược 10k -> Xác 16k x 1 đài = 16.000đ • Ăn 720.000đ', () => {
  const res = calculateBetCost({ region: 'MN', betType: 'DAU_DUOI', point: 10, stationsCount: 1, numbersCount: 1 });
  assert.strictEqual(res.total, 16000);
  assert.strictEqual(res.potentialWin, 720000);
});

runTest('MN - Xỉu Chủ: Cược 10k -> Xác 16k x 1 đài = 16.000đ • Ăn 6.200.000đ', () => {
  const res = calculateBetCost({ region: 'MN', betType: 'XIU_CHU', point: 10, stationsCount: 1, numbersCount: 1 });
  assert.strictEqual(res.total, 16000);
  assert.strictEqual(res.potentialWin, 6200000);
});

runTest('MB - Bao Lô 2 Số: 10k x 21.000 xác (27 giải) x 1 đài x 2 con = 420.000đ', () => {
  const res = calculateBetCost({ region: 'MB', betType: 'BAO_LO_2', point: 10, stationsCount: 1, numbersCount: 2 });
  assert.strictEqual(res.total, 420000);
  assert.strictEqual(res.potentialWin, 720000);
});

runTest('MB - Đầu Đuôi: Cược 10k -> Xác 40k (5 vị trí: 4 con G7 + G.ĐB) = 40.000đ', () => {
  const res = calculateBetCost({ region: 'MB', betType: 'DAU_DUOI', point: 10, stationsCount: 1, numbersCount: 1 });
  assert.strictEqual(res.total, 40000);
  assert.strictEqual(res.potentialWin, 720000);
});

runTest('MB - Xỉu Chủ: Cược 10k -> Xác 32k (4 vị trí: 3 con G6 + G.ĐB) = 32.000đ • Ăn 6.200.000đ', () => {
  const res = calculateBetCost({ region: 'MB', betType: 'XIU_CHU', point: 10, stationsCount: 1, numbersCount: 1 });
  assert.strictEqual(res.total, 32000);
  assert.strictEqual(res.potentialWin, 6200000);
});

runTest('Vé Kiến Thiết: 10 vé x 10.000đ = 100.000đ', () => {
  const res = calculateBetCost({ region: 'MN', betType: 'KIEN_THIET', point: 10, stationsCount: 1, numbersCount: 1 });
  assert.strictEqual(res.total, 100000);
});

// NHÓM 5: LỊCH ĐÀI VÀ THỨ TRONG TUẦN
console.log('\n[Nhóm 5] Kiểm tra Lịch Mở Thưởng Các Đài:');
runTest('Miền Nam Thứ 4 (day 3) phải có Đồng Nai, Cần Thơ, Sóc Trăng', () => {
  const stations = STATIONS_SCHEDULE.MN[3];
  assert.deepStrictEqual(stations, ['Đồng Nai', 'Cần Thơ', 'Sóc Trăng']);
});

runTest('Miền Bắc chỉ có 1 đài mở thưởng mỗi ngày', () => {
  for (let day = 0; day <= 6; day++) {
    assert.strictEqual(STATIONS_SCHEDULE.MB[day].length, 1);
  }
});

// NHÓM 6: TRA CỨU ĐƠN HÀNG LINH HOẠT
console.log('\n[Nhóm 6] Kiểm tra Tính Năng Tra Cứu Đơn Hàng:');
const sampleOrder = {
  orderId: 'QQ-782914',
  phone: '0973807027',
  fullName: 'Nguyen Van A'
};

runTest('Tìm kiếm bằng chính xác mã QQ-782914', () => {
  assert.strictEqual(matchOrderLookup(sampleOrder, 'QQ-782914'), true);
});

runTest('Tìm kiếm không phân biệt chữ hoa thường (qq-782914)', () => {
  assert.strictEqual(matchOrderLookup(sampleOrder, 'qq-782914'), true);
});

runTest('Tìm kiếm chỉ gõ 6 số: 782914', () => {
  assert.strictEqual(matchOrderLookup(sampleOrder, '782914'), true);
});

runTest('Tìm kiếm bằng Số điện thoại: 0973807027', () => {
  assert.strictEqual(matchOrderLookup(sampleOrder, '0973807027'), true);
});

runTest('Không tìm thấy khi nhập sai mã hoặc SĐT khác', () => {
  assert.strictEqual(matchOrderLookup(sampleOrder, 'QQ-111111'), false);
  assert.strictEqual(matchOrderLookup(sampleOrder, '0901234567'), false);
});

console.log('\n====================================================');
console.log(`🎉 KẾT QUẢ TEST: ${passedTests}/${totalTests} TESTS ĐẠT YÊU CẦU!`);
console.log('====================================================');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
