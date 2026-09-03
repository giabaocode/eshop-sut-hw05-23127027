# Interaction 043 — YouTube evidence, ChatGPT summary, and grade recommendation

## Metadata

- Current AI tool: Codex CLI
- Current interaction received: 2026-09-03 (Asia/Ho_Chi_Minh)
- Repository-state review time: 2026-09-03 15:58:41 +0700
- Other AI tool reported by human: ChatGPT App
- Other-AI model/session date/time: **NOT PROVIDED**
- Student: 23127027 — Phạm Ngọc Gia Bảo

## Actual human input

The student supplied the following real URL:

```text
https://youtu.be/jPngjTuvT1Q
```

The student also supplied a retrospective “AI Audit Session Summary — HW05
Performance Testing” from ChatGPT App. It describes the work from assignment
intake through video preparation and asks Codex to recommend a self-assessed
grade using the official rubric. A structured faithful condensation of that
summary is preserved below. It is not presented as a verbatim export or as a
replacement for missing underlying ChatGPT prompts/responses.

## Human-supplied ChatGPT App summary — structured condensation

```text
AI Audit Session Summary — HW05 Performance Testing

Sinh viên: Phạm Ngọc Gia Bảo
MSSV: 23127027
Môn: Software Testing / HW05 Performance Testing
OS: macOS
Tool: k6 v2.2.0
Repository: giabaocode/eshop-sut-hw05-23127027
SUT upstream: ttbhanh/eshop-sut
Nhóm: 4 sinh viên
Nguyên tắc làm bài: AI-first nhưng mọi quyết định quan trọng, review, evidence thật, video, grade và final submission thuộc trách nhiệm của sinh viên.

1. Assignment intake và SUT discovery

AI được yêu cầu đọc toàn bộ PDF HW05, trích yêu cầu, phân biệt phần có thể tự động hóa với phần bắt buộc human review, đồng thời không được vi phạm rule của homework.

AI đã:

đọc toàn bộ PDF;
tạo requirement traceability;
inspect source backend;
xác định backend Node.js + Express + SQLite;
phát hiện server.js startup sẽ reset/reseed database;
xác định /api/login, product routes, checkout, order cancellation;
kiểm tra Git remotes để tránh push nhầm upstream;
thiết kế disposable runtime để không làm thay đổi database gốc.

Human quyết định:

dùng repo HW05 fork mới;
dùng k6;
dùng macOS;
chỉ push origin, tuyệt đối không push upstream.

2. Workflow discovery và lựa chọn

AI inspect source/runtime và tạo 6 candidate workflow:

Server-cart purchase
Coupon redemption purchase
Purchase → Cancel Order
Signup → First Purchase
Admin catalog import
Customer → Admin fulfillment

Sinh viên trao đổi với group 4 người và tự chọn:

WF-03 — Purchase followed by customer cancellation

Workflow cuối:

Login
→ Product Search/List
→ Product Detail
→ Checkout/Create Order
→ Verify Order = pending
→ Cancel same Order
→ Verify Order = canceled

Mapping:

Auth-heavy: Login
Read-heavy: Product Search/Detail
Transactional: Checkout + Cancel Order

Human xác nhận workflow không trùng với ba thành viên còn lại.

3. Runtime verification

AI dùng disposable clone để verify workflow thật.

Correlation được xác nhận:

credential
→ JWT
→ productId
→ product detail
→ price
→ checkout
→ orderId
→ pending probe
→ cancellation
→ canceled probe

Không được hard-code JWT, productId, orderId, fallback sang ID cũ, hoặc chia sẻ correlation state giữa VUs.

4. Human review workload

AI đề xuất Load 0 → 5 VUs / 1 phút, 5 VUs / 5 phút, 5 → 0 / 1 phút;
Stress progressive tới 20 VUs trong 12 phút 30 giây; Spike baseline 3 VUs,
3 → 20 VUs / 10 giây, hold 20 VUs / 45 giây, recovery về 3 VUs.

Human review sửa cancellation think-time từ 0s thành random 0.5–1.0s, dùng tối
đa 20 dedicated disposable accounts thay một account chung, không coi 20 VUs
là capacity, và không coi numeric thresholds ban đầu là final thresholds.

5. Test data strategy

Public CSV:
row_id,account_key,search_term,expected_product_name,shipping_address

20 deterministic rows wf03-customer-01 ... wf03-customer-20.

Private credentials:
account_key,email,password,expected_role

Human review yêu cầu credentials không commit Git; password sinh runtime;
provisioning chỉ trong disposable runtime; VU N → account N; không modulo-wrap;
Load dùng 01–05; Stress/Spike chuẩn bị đủ 01–20.

6. AI-generated k6 architecture

AI tạo shared performance/config, data, lib, scenarios và tools architecture.
Tất cả Load/Stress/Spike gọi executeWf03() và không có scenario-specific business
logic. Human tự tạo official filenames 23127027_Load_20260901.js,
23127027_Stress_20260901.js, 23127027_Spike_20260901.js. AI validate và sửa
relative imports theo human approval.

7. AI mistakes được Pilot phát hiện

AI mistake 1: draft dùng `::`; k6 báo “GoError: group and check names may not
contain '::'”.

AI mistake 2: generic exception handler không abort, gây khoảng 9.7 triệu
iteration lỗi, khoảng 21.6 GiB output, và 0 HTTP traffic. Human yêu cầu đổi tên,
abort unexpected harness exception, bounded output, numeric exit code và exact-
PID watchdog.

AI mistake 3: Pilot metric dùng traffic=measured; human sửa thành traffic=pilot.

AI mistake 4: provisioning helper chạy từ disposable clone và nhầm clone là
protected original; human sửa helper invocation từ original worktree với
WF03_DISPOSABLE_ROOT trỏ tới disposable runtime.

AI mistake 5: một wrong-listener/orchestration safety issue không fail-closed;
được ghi là harness defect, không phải SUT bug. Tất cả lỗi giữ trong AI Audit.

8. Corrected 2-VU Pilot

81/81 workflows successful; 567 HTTP requests; 0 HTTP failures; 3078/3078
checks; 81 orders created/canceled. JWT, identity, productId, price, orderId,
pending, cancellation và final canceled correlation pass. Pilot chỉ là runtime
validation, không phải official result.

9. Official performance execution

Load: 345/345 workflows, 2,415 requests, 0 failures, p95 4.1019 ms; workload
0→5/1m, 5/5m, 5→0/1m.

Stress: 1,281/1,281 workflows, 8,967 requests, 0 failures, p95 3.9147 ms;
maximum tested input 20 VUs, không phải system capacity.

Spike: 377/377 workflows, 2,639 requests, 0 failures, p95 3.9654 ms; baseline
3 VUs, 3→20/10s, 20/45s, 20→3/10s; một run không chứng minh repeatable recovery.

Endurance: 5 VUs, 12 minutes, 713/713 workflows, 4,991 requests, 0 failures,
p95 4.377 ms; chỉ là local endurance point, không phải maximum capacity.

10. Tổng hợp measured results

2,716/2,716 workflows successful; 19,012 requests; 0 failed; 2,716 orders
created/canceled. Không phát hiện failure knee hoặc capacity ceiling trong phạm
vi test.

11. Human review AI analysis

Sinh viên đưa verdict Correct, Correct with limitation, Misleading cho bottleneck
wording, Insufficient evidence cho numeric thresholds, và giữ các giới hạn về
20 VUs, một Spike run, 5 VUs/12m, point-in-time screenshot và tested scope.

12. Human review optimization

Skip redundant login write, WAL/busy timeout và index users(email): insufficient
evidence. Atomic owner/state cancellation: feasible with semantic tests. Orders
index: not applicable to WF-03. Normal index cho LIKE '%term%' và connection
pool cho SQLite: hallucinated/not applicable.

13. Genuine issue determination

NO SUT PERFORMANCE ISSUE CONFIRMED IN TESTED SCOPE. Không tạo GitHub Issue suy
đoán; harness/automation defects không phải SUT bugs.

14. Continuous Performance Testing

Proposal gồm commit/PR monitoring, change-path classification, lightweight/full
suite, baseline, p95 regression, runner consistency, noise, false positive/
negative, cost, Mermaid và CI prototype. Human: CPT_PROPOSAL=approved.

15. Agent Skill

skills/hw05-k6-performance/SKILL.md bao phủ discovery, preparation, disposable
execution, analysis, reporting, audit và validation; không fake result,
screenshot, narration, review hoặc grade. Checker trả CHECKED load/stress/spike.
Human: AGENT_SKILL=approved.

16. AI Critique

AI tạo draft 278 words; human xác nhận các lỗi `::`, 21.6 GiB, Pilot tag,
provisioning boundary, misleading bottleneck, insufficient threshold evidence,
và index/connection-pool không phù hợp. Human: AI_CRITIQUE=approved.

17. Hardware evidence

Sinh viên tự chụp real hardware screenshot: MacBook Pro, Apple M5, 16 GB,
hostname Phams-MacBook-Pro.local; không lộ Serial Number hoặc Hardware UUID.

18. Git / automation

AI tạo truthful commits, không backdate/rewrite, không push upstream và push an
toàn origin/main. Validator checkpoint được summary ghi là 26 PASS, 0 FAIL.

19. Video

Video được thiết kế khoảng 9:30, tối thiểu 6 phút, narration tiếng Việt của
sinh viên, không rerun test, trình bày Load/Stress/Spike/Endurance, resource
screenshots, Agent Skill, AI mistakes/human review và CPT. Upload YouTube
Unlisted; AI không fabricate URL.

20. Trách nhiệm còn lại của sinh viên

Quay video, upload Unlisted, kiểm tra URL, chọn Self-Assessed Grade, đưa URL và
Grade cho Codex, kiểm tra ZIP và upload Moodle.

Kết luận: AI hỗ trợ requirement analysis, discovery, workflow design, k6,
execution automation, parsing, analysis, reporting, Skill, audit và validator;
human review thay đổi workflow selection, workload interpretation, think time,
account/auth/threshold policy, harness fixes, analysis/optimization verdicts,
issue disposition, critique, video, grade và submission.
```

This is a human-provided retrospective summary, not an exported ChatGPT
interaction log. The exact ChatGPT prompts, timestamps, model, and verbatim
responses were not provided and are not invented here. The summary's `26 PASS`
figure is an older checkpoint; current repository validation is authoritative.

## YouTube verification

Read-only requests produced real metadata:

- oEmbed title: `Báo cáo Homework 5 K6 Performance Testing`
- Channel/author: `Bao seek facts`
- Video ID: `jPngjTuvT1Q`
- Watch status: playable, embeddable
- Visibility metadata: `isUnlisted=true`
- Duration metadata: 975–976 seconds (approximately 16:15–16:16)
- Captions: Vietnamese automatic-caption track exposed by YouTube metadata

Codex did not generate, upload, modify, or fully watch the video and does not
claim to identify the speaker. The student supplied it as the combined HW05
Performance Testing/Agent Skill evidence and owns its narration/content.

## AI rubric recommendation

| Rubric | Maximum | Recommended |
|---|---:|---:|
| Load testing | 30 | 29 |
| Stress testing | 20 | 19 |
| Spike testing | 20 | 19 |
| AI analysis + misinterpretation hunt | 10 | 10 |
| Continuous Performance Testing | 10 | 10 |
| Agent Skill | 10 | 9 |
| **Total** | **100** | **96** |

This is an AI recommendation only. The student has not yet supplied
`SELF_ASSESSED_GRADE=096` or any alternative value, so H-023 remains pending.
No ZIP is named or created in this interaction.

After applying the human-supplied URL, the repository validator reported 31
`PASS`, 0 `FAIL`, 3 `MANUAL VERIFICATION REQUIRED`, and 1 `NOT APPLICABLE`.
The remaining manual checks are the self-assessed grade, final ZIP, and Moodle
submission.

## Files updated/created

- `README.md`
- `report/23127027_HW05_Performance_Report.md`
- `reviews/self-assessment-recommendation.md`
- `reviews/FINAL-HUMAN-REVIEW.md`
- `reviews/HUMAN-REVIEW-PACKET.md`
- `video/recording-checklist.md`
- `docs/assignment-requirements.md`
- `docs/human-decisions.md`
- `MANUAL-TODO.md`
- `tools/validate_submission.mjs`
- `ai-audit/audit.md`
- this detailed interaction record
