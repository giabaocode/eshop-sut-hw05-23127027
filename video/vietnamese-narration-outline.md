# Dàn ý thuyết minh tiếng Việt

Trạng thái: **SINH VIÊN PHẢI TỰ THUYẾT MINH VÀ GHI HÌNH**

1. Giới thiệu MSSV 23127027, repository, macOS và k6 v2.2.0.
2. Giải thích vì sao chọn WF-03 và xác nhận workflow không trùng trong nhóm.
3. Trình bày chuỗi Login → Search → Detail → Checkout → Pending → Cancel →
   Canceled; nhấn mạnh JWT, productId, price và orderId lấy động.
4. Giải thích 20 account riêng trong runtime dùng một lần, không commit mật khẩu,
   và Load chỉ kích hoạt account 01..05.
5. Trình bày Load, Stress, Spike dùng cùng workflow nhưng workload khác nhau.
6. Mở raw JSON thật và ba report khác nhau: Load aggregate, Stress CSV
   time-series, Spike k6 dashboard.
7. Chỉ rõ screenshot thật có k6 và Activity Monitor/PID backend; nói đây chỉ là
   quan sát tại một thời điểm, không phải telemetry liên tục.
8. Trình bày endurance 5 VUs trong 12 phút, 713/713 workflow, nhưng không gọi đó
   là công suất tối đa.
9. Nêu lỗi AI thật: tên `::`, vòng lặp exception 21.6 GiB, sai traffic tag,
   boundary provisioning và wrong-listener guard.
10. Trình bày phán quyết human: bottleneck wording gây hiểu nhầm, threshold thiếu
    bằng chứng, index/search và connection pool không phù hợp.
11. Demo Agent Skill: phạm vi, safety boundary và script kiểm tra ba result tree.
12. Kết luận về Continuous Performance Testing và giới hạn của kết quả.

Không đọc mật khẩu/JWT, không gọi Pilot là official, không gọi 20 VUs là
capacity, và không khẳng định CPU/RAM trung bình từ một screenshot.
