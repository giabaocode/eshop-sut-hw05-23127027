# Final Combined HW05 Video Recording Runbook

Status: **COMPLETED BY HUMAN — UNLISTED URL SUPPLIED**

Human-supplied video: <https://youtu.be/jPngjTuvT1Q> (playable/unlisted
metadata verified 2026-09-03; approximately 16:15). The runbook below remains
the preserved recording procedure.

Student: **23127027 — Phạm Ngọc Gia Bảo**

Target duration: **9 minutes 30 seconds**

Hard minimum: **6 minutes**

Narration: **Vietnamese, spoken by the student**

This runbook presents genuine existing evidence. It does not start the SUT,
provision accounts, or rerun k6. The official PDF requires an unlisted YouTube
video of at least six minutes showing the performance tool and resource monitor
in the same frame with the student's own Vietnamese narration. The same video
also demonstrates the submitted Agent Skill.

## One-time preparation before pressing Record

1. Connect the MacBook to power and enable Do Not Disturb.
2. Close Mail, Messages, password managers, private browser tabs, and all files
   whose names contain `credentials`, `.env`, `secret`, or `token`.
3. Do **not** open `credentials.local.csv`, any disposable runtime, raw response
   bodies, backend environment variables, or the rejected hardware image.
4. Set Terminal font to approximately 18–20 pt and browser zoom to 110–125%.
5. Keep this runbook on a second device or outside the recorded screen.
6. Open a new Terminal window. Type the following, but do not start recording
   until the prompt is clean:

   ```bash
   cd /Users/phamngocgiabao/eshop-sut-hw05-23127027
   clear
   ```

7. Press `Command + Shift + 5`, select **Record Entire Screen**, enable the
   correct microphone, and start recording.
8. Pause for two seconds before speaking. Speak slowly. If a command wraps, wait
   until the audience can read its output before continuing.

## [00:00–00:45] Identity, repository, and environment

### Goal

Establish the student's identity, public repository, hostname, and pinned k6
runtime without showing sensitive hardware identifiers.

### Before speaking

Show only the clean Terminal window. Ensure no other application or notification
contains personal data.

### Terminal command

```bash
printf 'Student: 23127027 - Pham Ngoc Gia Bao\nRepository: eshop-sut-hw05-23127027\n'
hostname
k6 version
git remote get-url origin
```

### What must be visible

- Student ID `23127027`.
- Hostname `Phams-MacBook-Pro.local`.
- `k6 v2.2.0` and `darwin/arm64`.
- Student repository URL, not the official SUT `upstream` URL.

### Vietnamese narration

> Xin chào thầy cô, em là Phạm Ngọc Gia Bảo, MSSV 23127027. Đây là bài
> HW05 Performance Testing của em trên repository eshop-sut-hw05-23127027.
> Em thực hiện trên macOS với hostname Phams-MacBook-Pro.local và dùng k6
> phiên bản 2.2.0 trên kiến trúc ARM64. Các lần chạy chính thức đã hoàn tất;
> video này chỉ trình bày bằng chứng thật, không chạy lại test và không tạo số
> liệu mới.

### Move on when

All four command outputs are visible and the recording timer is near 00:45.

## [00:45–01:30] Official plans and one shared workflow

### Goal

Show the three human-created official filenames and prove that all three are
thin wrappers calling the same `executeWf03()` implementation.

### Before speaking

Return focus to Terminal. Do not open the full wrapper files because their
historical header comments describe their earlier pre-execution state.

### Terminal command

```bash
rg -n "getWorkload|executeWf03|export function" performance/scenarios/official/*.js
```

### What must be visible

- `23127027_Load_20260901.js`
- `23127027_Stress_20260901.js`
- `23127027_Spike_20260901.js`
- Each file imports and calls the same `executeWf03()`.
- Only `getWorkload('load'|'stress'|'spike')` differs.

### Vietnamese narration

> Đây là ba test plan chính thức do em tạo tên theo đúng mẫu MSSV, loại
> scenario và ngày. Ba file chỉ khác cấu hình workload. Cả Load, Stress và
> Spike đều gọi cùng một hàm executeWf03, nên không có việc sao chép business
> flow, thay đổi endpoint hoặc làm yếu assertion giữa các scenario.

### Move on when

The three filenames and their `executeWf03` calls have been shown.

## [01:30–02:30] WF-03, think time, data, and correlation

### Goal

Demonstrate the complete auth/read/transactional lifecycle, public data-driven
input, and iteration-local dynamic correlation.

### Before speaking

Keep Terminal full-screen. The following commands display source structure and
the first six **public non-secret** rows only.

### Terminal command

```bash
rg -n "executeWf03|group\('|thinkTime\(|context\.(jwt|userId|productId|price|orderId)" performance/lib/workflow.js
sed -n '1,7p' performance/data/workflow.csv
awk 'END { print "Public workflow rows:", NR - 1 }' performance/data/workflow.csv
```

### What must be visible

- Seven ordered groups: login, search, detail, checkout, pending probe,
  cancellation, final probe.
- Four reviewed think-time calls.
- Runtime assignments for JWT, user ID, product ID, price, and order ID.
- Public CSV headers and the total of 20 rows; no credential file.

### Vietnamese narration

> Workflow em chọn là WF-03, mua hàng rồi khách hủy đơn. Luồng gồm Login,
> Search, Detail, Checkout, kiểm tra đúng đơn ở trạng thái pending, chờ từ
> 0.5 đến 1 giây, hủy chính đơn đó và kiểm tra trạng thái canceled. Các think
> time trước Search và Detail cũng được mô phỏng theo quyết định đã review.
>
> CSV này chỉ chứa dữ liệu công khai như account key, từ khóa tìm kiếm, tên
> sản phẩm mong đợi và địa chỉ tổng hợp. Có 20 dòng xác định. Credential thật
> nằm ngoài Git. JWT và user ID lấy từ login; product ID và giá lấy từ response;
> order ID lấy từ checkout. Mọi giá trị chỉ thuộc iteration và VU hiện tại,
> không dùng ID tĩnh hoặc fallback sang account khác.

### Move on when

The seven groups, dynamic values, and `Public workflow rows: 20` are visible.

## [02:30–03:20] Official Load evidence

### Goal

Show the full native Load raw artifact and its genuine aggregate report.

### Before speaking

Keep Terminal visible for the file-size command. After `open`, allow the browser
to load the local HTML, then show the report title and summary table.

### Terminal command

```bash
ls -lh performance/results/load/20260902T092131+0700/raw/load-raw.json performance/results/load/20260902T092131+0700/raw/load-summary.json
open performance/results/load/20260902T092131+0700/report/load-aggregate.html
```

### What must be visible

- Non-empty `load-raw.json` and `load-summary.json`.
- Page title `WF-03 load aggregate report`.
- Workflow, HTTP request/failure, and latency values.

### Vietnamese narration

> Load Test tăng từ 0 lên 5 VU trong một phút, giữ 5 VU trong 5 phút và giảm
> về 0 trong một phút. Native raw JSON đầy đủ được giữ làm nguồn dữ liệu chính.
> Report aggregate thật cho thấy 345 trên 345 workflow thành công, 2.415 HTTP
> request, không có HTTP failure và p95 tổng thể là 4.1019 mili giây. Đây là
> kết quả của workload đã chạy, không phải công suất tối đa của hệ thống.

### Move on when

The Load report title and the 345/345, 2,415/0 values have been shown.

## [03:20–04:15] Official Stress evidence

### Goal

Show the full Stress raw JSON/CSV and the distinct CSV-derived time-series
report.

### Before speaking

Switch back to Terminal, run the command, then wait for the local report to
open. Scroll slowly through the VU, RPS, and p95 charts.

### Terminal command

```bash
ls -lh performance/results/stress/20260902T101857+0700/raw/stress-raw.json performance/results/stress/20260902T101857+0700/raw/stress-timeseries.csv
open performance/results/stress/20260902T101857+0700/report/stress-timeseries.html
```

### What must be visible

- Non-empty Stress raw JSON and native CSV.
- Page title `WF-03 Stress CSV time-series report`.
- VU progression, RPS, and p95 charts.

### Vietnamese narration

> Stress Test tăng theo các mức 2, 5, 10, 15 và tối đa 20 VU trong lịch chạy
> 12 phút 30 giây. View riêng của Stress được tạo từ native CSV thật theo các
> bucket 30 giây. Kết quả là 1.281 trên 1.281 workflow thành công, 8.967
> request, không có failure và p95 tổng thể là 3.9147 mili giây. Ở các bucket
> đủ 20 VU, throughput khoảng 25.93 đến 26.53 request mỗi giây. Không thấy suy
> giảm trong lịch đã chạy, nhưng 20 VU chỉ là input lớn nhất, không phải capacity.

### Move on when

The time-series charts and the warning that the report does not define capacity
have been visible.

## [04:15–05:05] Official Spike evidence

### Goal

Show the full Spike raw artifact and the genuine k6 web-dashboard HTML export.

### Before speaking

Return to Terminal, run the command, then show the dashboard overview and the
phase summary without exposing unrelated browser tabs.

### Terminal command

```bash
ls -lh performance/results/spike/20260902T104549+0700/raw/spike-raw.json performance/results/spike/20260902T104549+0700/raw/spike-summary.json
open performance/results/spike/20260902T104549+0700/report/spike-dashboard.html
```

### What must be visible

- Non-empty Spike raw JSON and summary.
- Genuine k6 dashboard HTML.
- Request/check overview or time-series section.

### Vietnamese narration

> Spike Test có baseline 3 VU, tăng từ 3 lên 20 VU trong 10 giây, giữ đỉnh
> 45 giây, sau đó giảm về 3 VU để quan sát recovery. Kết quả có 377 trên 377
> workflow thành công, 2.639 request, không có HTTP failure và p95 tổng thể
> là 3.9654 mili giây. Một lần chạy này phục hồi không có failure hoặc backlog
> quan sát được, nhưng chưa đủ để chứng minh recovery lặp lại trong mọi điều kiện.

### Move on when

The dashboard and actual 377/377 outcome have been explained.

## [05:05–06:00] Tool/resource screenshots and safe hardware evidence

### Goal

Present the genuine same-frame k6/backend-resource evidence required by the PDF
and the safe hardware/hostname screenshot.

### Before speaking

The command opens five genuine images in Preview. Use Preview thumbnails or the
left/right arrow keys to show Load, Stress, Spike, Endurance, then hardware.
Do not zoom far enough to expose unrelated desktop/browser content.

### Terminal command

```bash
open performance/results/load/20260902T092131+0700/evidence/screenshots/load-k6-backend-resource.png performance/results/stress/20260902T101857+0700/evidence/screenshots/stress-k6-backend-resource.png performance/results/spike/20260902T104549+0700/evidence/screenshots/spike-k6-backend-resource.png performance/results/endurance/20260902T143823+0700/evidence/screenshots/endurance-k6-backend-resource.png evidence/hardware/hardware-specs-hostname.jpg
```

### What must be visible

- For every run, k6 progress and Activity Monitor with the exact `node` backend
  PID in the same captured image.
- Safe hardware image showing hostname, MacBook Pro 14-inch, Apple M5, and
  16 GB.
- No serial number or hardware UUID.

### Vietnamese narration

> Đây là bốn screenshot thật được chụp trong lúc Load, Stress, Spike và
> Endurance đang chạy. Mỗi ảnh giữ k6 progress và Activity Monitor lọc đúng
> backend Node PID trong cùng khung hình. Đây là bằng chứng quan sát tài nguyên
> tại một thời điểm, không phải telemetry liên tục nên em không suy ra CPU hoặc
> memory trung bình của toàn bộ run. Ảnh phần cứng an toàn cho thấy đúng hostname,
> MacBook Pro dùng Apple M5 và 16 GB RAM, không hiển thị serial hay hardware UUID.

### Move on when

All four run screenshots and the safe hardware image have appeared once.

## [06:00–06:50] Endurance and cross-scenario interpretation

### Goal

Show the genuine 12-minute sustained workload and compare all runs without
turning unlike workloads into a capacity claim.

### Before speaking

Return to Terminal. Open the Endurance report first, scroll across its RPS/p95
charts, then return to Terminal for the compact comparison table.

### Terminal command

```bash
open performance/results/endurance/20260902T143823+0700/report/endurance-timeseries.html
sed -n '1,32p' analysis/scenario-comparison.md
```

### What must be visible

- Endurance RPS/p95/order-growth charts.
- Comparison table with four scenario rows and the totals section.

### Vietnamese narration

> Endurance giữ 5 VU trong 12 phút, ngoài hai ramp 30 giây. Kết quả là 713
> trên 713 workflow thành công, 4.991 request, không có failure và p95 là
> 4.377 mili giây. Đây là local endurance point trên máy, commit, dữ liệu và
> thời lượng này, không phải maximum endurance capacity.
>
> Tổng cộng bốn lần chạy có 2.716 trên 2.716 workflow và 19.012 HTTP request
> không lỗi. Tuy nhiên mỗi dòng có workload khác nhau nên không được so sánh
> p95 hoặc RPS như cùng một thí nghiệm.

### Move on when

The Endurance limitations and cross-scenario totals have been stated.

## [06:50–07:45] Agent Skill demonstration

### Goal

Show the submitted Agent Skill's scope and execute its verified, read-only
result-tree checker against the complete official evidence.

### Before speaking

Use Terminal only. This is the repository-supported demo mechanism. Do not type
an invented `$hw05-k6-performance` Codex command and do not start a new agent or
performance run.

### Terminal command

```bash
sed -n '1,90p' skills/hw05-k6-performance/SKILL.md
skills/hw05-k6-performance/scripts/check-result-tree.sh
```

### What must be visible

- Skill name, description, routing steps, and anti-fabrication boundaries.
- Exactly one `CHECKED` result for Load, Stress, and Spike.
- The actual timestamped result directories.

### Vietnamese narration

> Đây là Agent Skill hw05-k6-performance mà em nộp cùng bài. Skill mô tả quy
> trình từ requirement validation, source discovery, data preconditioning,
> execution, phân tích raw result, reporting đến AI Audit và submission check.
> Nó quy định rõ không được tạo giả screenshot, narration, grade hoặc result.
>
> Em đang áp dụng thành phần kiểm tra chỉ đọc của Skill lên endpoint workflow
> hoàn chỉnh. Ba dòng CHECKED xác nhận cây Load, Stress và Spike đều có thư mục
> raw, report, logs, evidence và native raw JSON không rỗng. Lệnh này không chạy
> lại test và không thay đổi bằng chứng.

### Move on when

All three `CHECKED` lines are visible and no `FAIL` line appears.

## [07:45–08:45] AI-first corrections and human judgment

### Goal

Demonstrate genuine AI mistakes, preserved correction history, and the student's
own review of analysis and optimization recommendations.

### Before speaking

Keep Terminal wide enough that Markdown table rows remain readable. Scroll only
through the displayed output; do not open large failed-Pilot raw artifacts.

### Terminal command

```bash
sed -n '30,38p' reviews/test-plan-review.md
rg -n "MISLEADING|INSUFFICIENT EVIDENCE|HALLUCINATED / NOT APPLICABLE|FEASIBLE WITH SEMANTIC TESTS" reviews/ai-analysis-review.md reviews/optimization-review.md
```

### What must be visible

- Invalid `::` naming and tight exception-loop rows.
- Human verdict `MISLEADING` for the bottleneck wording.
- Human verdict `INSUFFICIENT EVIDENCE` for numeric thresholds.
- Optimization verdicts including feasible-with-tests and hallucinated/not
  applicable.

### Vietnamese narration

> AI draft ban đầu dùng hai dấu hai chấm trong tên group, nhưng k6 2.2.0 từ
> chối. Generic exception handler còn tạo tight loop khoảng 9.7 triệu iteration
> và sinh khoảng 21.6 GiB output dù chưa có HTTP request. Human review đã sửa
> naming, traffic tag, exception abort, bounded output và provisioning boundary.
> Lịch sử lỗi vẫn được giữ trong AI Audit.
>
> Khi review phân tích, em đánh giá cách gọi Checkout và Cancellation là
> bottleneck là misleading: chúng tương đối chậm nhất nhưng độ trễ chỉ vài mili
> giây và không có failure. Các threshold số học cũng thiếu bằng chứng repeat-run.
> Đề xuất atomic cancellation có thể thử nếu có semantic tests; còn B-tree index
> cho leading-wildcard search và connection pool chung cho SQLite là không phù hợp.

### Move on when

At least one genuine harness correction, one analysis verdict, and one
optimization verdict have been explained.

## [08:45–09:30] Continuous testing, issue disposition, and conclusion

### Goal

Close with the CPT proposal, evidence boundaries, public repository, and the
reason no speculative GitHub Issue was created.

### Before speaking

Show the beginning of the CPT proposal, then open the main report PDF. End on
the report title or conclusion page and keep it visible for two seconds.

### Terminal command

```bash
sed -n '1,160p' proposal/continuous-performance-testing.md
open report/23127027_HW05_Performance_Report.pdf
```

### What must be visible

- CPT Mermaid flowchart source and lightweight/full-suite decision.
- Main report PDF.
- No placeholder YouTube URL presented as real.

### Vietnamese narration

> Đề xuất Continuous Performance Testing theo dõi thay đổi code, chạy suite nhẹ
> trên pull request phù hợp và full suite theo lịch hoặc trước release. Baseline
> phải giữ cùng runner, có warm-up, repeat-run và quản lý noise trước khi cảnh báo
> p95 regression, để cân bằng chi phí và false alarm.
>
> Trong phạm vi workload đã chạy, em không xác nhận được SUT bug hay performance
> issue có thể tái hiện, nên em không tạo GitHub Issue suy đoán. Bài làm giữ raw
> k6 JSON thật cho mọi scenario, ba report view khác nhau, screenshot tài nguyên,
> human review, AI Audit và Agent Skill. Các kết quả không chứng minh capacity
> ceiling hoặc threshold phổ quát. Em xin kết thúc phần trình bày. Cảm ơn thầy cô.

### Move on when

The final sentence is complete. Pause for two seconds, then stop the screen
recording from the macOS menu bar.

## After recording — mandatory human checks

1. Confirm the video duration is at least 6:00; target 8:30–10:00.
2. Watch the complete recording once with sound.
3. Verify the student's Vietnamese narration is audible throughout.
4. Verify no password, credential CSV, JWT, Authorization header, secret,
   serial number, hardware UUID, or private environment variable is visible.
5. Verify Load/Stress/Spike/Endurance are described as existing evidence, not
   live reruns.
6. Verify the video never calls 20 VUs capacity, 5 VUs a maximum, a screenshot
   continuous telemetry, proposed thresholds validated, or harness defects SUT
   bugs.
7. Upload the final video to YouTube as **Unlisted**.
8. Open the URL in a private/incognito browser window to verify it works.
9. Send the exact real URL and human-selected grade to Codex:

   ```text
   YOUTUBE_URL=https://...
   SELF_ASSESSED_GRADE=000..100
   ```

Codex may then insert only the supplied metadata, regenerate reports, rerun the
submission validator, create/checksum the correctly named ZIP, commit, and push
to the student `origin`. The student must upload the final ZIP to Moodle.
