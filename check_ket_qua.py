#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Công cụ kiểm tra kết quả xổ số từ Minh Chính (minhchinh.com)
Hỗ trợ cả 3 miền: Miền Nam (MN), Miền Trung (MT), Miền Bắc (MB)
Tự động dò vé cược theo đúng quy định từng miền và cập nhật lich_su_danh.csv
"""

import sys
import os
import json
import csv
import argparse
import urllib.request
from datetime import datetime
from lxml import html

USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

URLS = {
    "MN": "https://www.minhchinh.com/ket-qua-xo-so-mien-nam/{date}.html",
    "MT": "https://www.minhchinh.com/ket-qua-xo-so-mien-trung/{date}.html",
    "MB": "https://www.minhchinh.com/ket-qua-xo-so-mien-bac/{date}.html"
}

PRIZE_MAP_MN_MT = {
    "100N": "G8",
    "200N": "G7",
    "400N": "G6",
    "1TR": "G5",
    "3TR": "G4",
    "10TR": "G3",
    "15TR": "G2",
    "30TR": "G1",
    "2TỶ": "DB",
    "ĐB": "DB"
}

PRIZE_MAP_MB = {
    "ĐB": "DB",
    "G.Nhất": "G1",
    "G.Nhì": "G2",
    "G.Ba": "G3",
    "G.Tư": "G4",
    "G.Năm": "G5",
    "G.Sáu": "G6",
    "G.Bảy": "G7"
}

def get_current_date():
    return datetime.now().strftime("%d-%m-%Y")

def fetch_minhchinh(region="MN", date_str=None):
    """Lấy dữ liệu kết quả từ minhchinh.com"""
    if not date_str:
        date_str = get_current_date()
    
    url = URLS.get(region, URLS["MN"]).format(date=date_str)
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    
    try:
        content = urllib.request.urlopen(req, timeout=10).read().decode("utf-8")
    except Exception as e:
        print(f"[-] Lỗi khi tải {url}: {e}")
        return None

    tree = html.fromstring(content)
    
    if region in ("MN", "MT"):
        tables = tree.xpath("//table[contains(@class, 'kqxsmiennam')]")
        if not tables:
            print(f"[-] Không tìm thấy bảng kết quả tại {url}")
            return None
        table = tables[0]
        
        # Lấy tên các đài
        provinces = []
        for a in table.xpath(".//thead//tr[3]//td[contains(@class, 'tentinh')]//a"):
            name = a.text_content().strip()
            if name:
                provinces.append(name)
        if not provinces:
            for td in table.xpath(".//thead//tr[contains(@class, 'tentinh')]//td|.//thead//td[contains(@class, 'tentinh')]"):
                name = td.text_content().strip()
                if name:
                    provinces.append(name)

        results = {p: {} for p in provinces}
        all_numbers = {p: [] for p in provinces}

        for tr in table.xpath(".//tbody//tr"):
            tds = tr.xpath("./td")
            if not tds:
                continue
            raw_prize = tds[0].text_content().strip()
            prize_name = PRIZE_MAP_MN_MT.get(raw_prize, raw_prize)

            for idx, td in enumerate(tds[1:]):
                if idx < len(provinces):
                    prov = provinces[idx]
                    nums = [s.strip() for s in td.xpath(".//span/text()|.//div/text()") if s.strip().isdigit()]
                    if not nums:
                        text = td.text_content().strip()
                        nums = [n for n in text.split() if n.isdigit()]
                    results[prov][prize_name] = nums
                    all_numbers[prov].extend(nums)

        return {
            "source": "MinhChinh.com",
            "region": region,
            "date": date_str,
            "provinces": provinces,
            "results": results,
            "all_numbers": all_numbers
        }

    else: # Miền Bắc
        tables = tree.xpath("//table[contains(@class, 'kqxsmienbac')]")
        if not tables:
            print(f"[-] Không tìm thấy bảng kết quả MB tại {url}")
            return None
        table = tables[0]
        prov = "Miền Bắc"
        results = {prov: {}}
        all_numbers = {prov: []}

        for tr in table.xpath(".//tbody//tr"):
            tds = tr.xpath("./td")
            if not tds:
                continue
            raw_prize = tds[0].text_content().strip()
            prize_name = PRIZE_MAP_MB.get(raw_prize, raw_prize)
            nums = [s.strip() for s in tds[1].xpath(".//span/text()|.//div/text()") if s.strip().isdigit()]
            if not nums:
                nums = [n for n in tds[1].text_content().strip().split() if n.isdigit()]
            results[prov][prize_name] = nums
            all_numbers[prov].extend(nums)

        return {
            "source": "MinhChinh.com",
            "region": "MB",
            "date": date_str,
            "provinces": [prov],
            "results": results,
            "all_numbers": all_numbers
        }

def save_lottery_cache(lottery_data):
    """Lưu kết quả vào ket_qua_xo_so.json"""
    cache_file = "ket_qua_xo_so.json"
    cache = {}
    if os.path.exists(cache_file):
        try:
            with open(cache_file, "r", encoding="utf-8") as f:
                cache = json.load(f)
        except Exception:
            cache = {}
    
    key = f"{lottery_data['region']}_{lottery_data['date']}"
    cache[key] = lottery_data
    with open(cache_file, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)
    print(f"[+] Đã lưu kết quả [{lottery_data['region']}] ngày {lottery_data['date']} vào {cache_file}")

def settle_csv(date_str=None):
    """Dò toàn bộ vé cược trong lich_su_danh.csv theo quy chuẩn MN/MT hoặc MB"""
    if not date_str:
        date_str = get_current_date()
    
    csv_file = "lich_su_danh.csv"
    if not os.path.exists(csv_file):
        print(f"[-] Không tìm thấy file {csv_file}")
        return

    rows = []
    with open(csv_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        for r in reader:
            rows.append(r)

    # Lấy danh sách kết quả xổ số cần thiết
    lottery_cache = {}
    for r in rows:
        reg = r.get("Mien", "MN").upper()
        dt = r.get("Ngay", date_str)
        key = f"{reg}_{dt}"
        if key not in lottery_cache:
            print(f"[*] Đang lấy kết quả Minh Chính cho [{reg}] ngày {dt}...")
            data = fetch_minhchinh(reg, dt)
            if data:
                save_lottery_cache(data)
                lottery_cache[key] = data

    updated_count = 0
    print("\n" + "="*75)
    print(f"🎯 KẾT QUẢ DÒ VÉ CƯỢC NGÀY {date_str}")
    print("="*75)

    for r in rows:
        reg = r.get("Mien", "MN").upper()
        dt = r.get("Ngay", date_str)
        key = f"{reg}_{dt}"
        data = lottery_cache.get(key)
        if not data:
            continue

        dai = r.get("Dai", "").strip()
        loai = r.get("Loai_Cuoc", "").strip()
        so = str(r.get("So_Danh", "")).strip()
        diem = float(r.get("Diem_Cuoc", 0))

        prov_results = data["results"].get(dai)
        if not prov_results and reg == "MB":
            prov_results = data["results"].get("Miền Bắc")

        if not prov_results:
            continue

        matches = 0
        hit_notes = []

        if reg == "MB":
            # ----------------- LUẬT MIỀN BẮC (MB) -----------------
            if loai == "bao_lo_2":
                # Dò 2 số cuối của 27 giải
                for prize, nums in prov_results.items():
                    for num in nums:
                        if len(num) >= 2 and num[-2:] == so:
                            matches += 1
                            hit_notes.append(f"{prize}:{num}")
                payout = matches * diem * 72
            elif loai == "bao_lo_3":
                # Dò 3 số cuối
                for prize, nums in prov_results.items():
                    for num in nums:
                        if len(num) >= 3 and num[-3:] == so:
                            matches += 1
                            hit_notes.append(f"{prize}:{num}")
                payout = matches * diem * 620
            elif loai == "dau_duoi":
                # MB Đầu Đuôi: Dò 4 số Giải 7 (Đầu) và 2 số cuối Giải Đặc Biệt (Đuôi)
                # Giải 7
                for num in prov_results.get("G7", []):
                    if len(num) >= 2 and num[-2:] == so:
                        matches += 1
                        hit_notes.append(f"G7:{num}")
                # Giải Đặc Biệt
                for num in prov_results.get("DB", []):
                    if len(num) >= 2 and num[-2:] == so:
                        matches += 1
                        hit_notes.append(f"ĐB:{num}")
                # Ăn x72 cho mỗi nháy
                payout = matches * diem * 72
            elif loai == "xiu_chu":
                # MB Xỉu Chủ: Dò 3 số Giải 6 (Đầu) và 3 số cuối Giải Đặc Biệt (Đuôi)
                # Giải 6
                for num in prov_results.get("G6", []):
                    if len(num) >= 3 and num[-3:] == so:
                        matches += 1
                        hit_notes.append(f"G6:{num}")
                # Giải Đặc Biệt
                for num in prov_results.get("DB", []):
                    if len(num) >= 3 and num[-3:] == so:
                        matches += 1
                        hit_notes.append(f"ĐB:{num}")
                payout = matches * diem * 620
            else:
                payout = 0

        else:
            # ----------------- LUẬT MIỀN NAM & MIỀN TRUNG (MN & MT) -----------------
            if loai == "bao_lo_2":
                for prize, nums in prov_results.items():
                    for num in nums:
                        if len(num) >= 2 and num[-2:] == so:
                            matches += 1
                            hit_notes.append(f"{prize}:{num}")
                payout = matches * diem * 72
            elif loai == "bao_lo_3":
                for prize, nums in prov_results.items():
                    for num in nums:
                        if len(num) >= 3 and num[-3:] == so:
                            matches += 1
                            hit_notes.append(f"{prize}:{num}")
                payout = matches * diem * 620
            elif loai == "bao_lo_4":
                for prize, nums in prov_results.items():
                    for num in nums:
                        if len(num) >= 4 and num[-4:] == so:
                            matches += 1
                            hit_notes.append(f"{prize}:{num}")
                payout = matches * diem * 5200
            elif loai == "dau_duoi":
                # G8 (Đầu) & ĐB (Đuôi)
                for num in prov_results.get("G8", []):
                    if num[-2:] == so:
                        matches += 1
                        hit_notes.append(f"G8:{num}")
                for num in prov_results.get("DB", []):
                    if num[-2:] == so:
                        matches += 1
                        hit_notes.append(f"DB:{num}")
                payout = matches * (diem / 10.0) * 720
            elif loai == "xiu_chu":
                # G7 (Đầu) & ĐB (Đuôi)
                for num in prov_results.get("G7", []):
                    if len(num) >= 3 and num[-3:] == so:
                        matches += 1
                        hit_notes.append(f"G7:{num}")
                for num in prov_results.get("DB", []):
                    if len(num) >= 3 and num[-3:] == so:
                        matches += 1
                        hit_notes.append(f"DB:{num}")
                payout = matches * diem * 620
            else:
                payout = 0

        cost = float(r.get("Tien_Xac", 0))
        r["Ket_Qua"] = "TRUNG" if matches > 0 else "TRUOT"
        r["So_Nhay"] = str(matches)
        r["Tien_Trung"] = f"{int(payout)}"
        r["Loi_Nhuan"] = f"{int(payout - cost)}"
        if hit_notes:
            r["Ghi_Chu"] = f"Trúng: {', '.join(hit_notes)}"
        elif matches == 0:
            r["Ghi_Chu"] = "Không về giải nào"
        updated_count += 1

        status_text = "🎉 TRÚNG" if matches > 0 else "❌ TRƯỢT"
        print(f"Vé {r['Ma_Ve']} | [{reg}] {r['Nguoi_Choi']} | {dai} | {loai} '{so}' | {status_text} ({matches} nháy) -> Thưởng: {int(payout):,}k")

    # Ghi lại vào file CSV
    with open(csv_file, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"\n[+] Đã cập nhật thành công {updated_count} vé vào {csv_file}")

def main():
    parser = argparse.ArgumentParser(description="Kiểm tra kết quả xổ số Minh Chính")
    parser.add_argument("--region", default="MN", choices=["MN", "MT", "MB"], help="Miền: MN, MT, MB")
    parser.add_argument("--date", default=None, help="Ngày (dạng DD-MM-YYYY), mặc định hôm nay")
    parser.add_argument("--settle", action="store_true", help="Dò toàn bộ vé cược trong file lich_su_danh.csv")
    args = parser.parse_args()

    date_str = args.date or get_current_date()

    if args.settle:
        settle_csv(date_str)
    else:
        print(f"[*] Đang lấy kết quả Minh Chính [{args.region}] ngày {date_str}...")
        data = fetch_minhchinh(args.region, date_str)
        if data:
            save_lottery_cache(data)
            print(f"[+] Các đài mở thưởng: {', '.join(data['provinces'])}")
            for prov in data['provinces']:
                res = data['results'].get(prov, {})
                print(f"\n--- {prov} ---")
                print(f"  Giải ĐB : {', '.join(res.get('DB', []))}")
                print(f"  Giải Nhất: {', '.join(res.get('G1', []))}")
                if "G7" in res:
                    print(f"  Giải Bảy : {', '.join(res.get('G7', []))}")
                if "G8" in res:
                    print(f"  Giải Tám : {', '.join(res.get('G8', []))}")

if __name__ == "__main__":
    main()
