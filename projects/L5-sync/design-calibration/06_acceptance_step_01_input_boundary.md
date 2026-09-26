# Step 1. 确认验收输入边界

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 1
> 回填位置：正式 `06-验收标准.md` §1

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 1 / input_boundary |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 当前模块 | `requirements_design_test_delivery_boundary` |
| 正式 06 写入 | `blocked_until_step_15` |
| 下一步 | `Step 2 / scope` |

本步只确认验收输入与边界，不写实际验收结论、不创建真实证据、不把送验版本或 `run_id` 猜成当前事实。

## 2. 本步输入

| 输入 | 来源 | 状态 | 说明 |
|---|---|---|---|
| 需求目标、功能、规则、NFR、AC、VETO、风险 | `00-需求文档.md` | `available` | 固定 `FR/BR/AC/VETO/NFR` 词汇及 owner boundary |
| 架构 boundary、truth ownership、依赖裁剪、红线 | `01-架构设计.md` | `available` | Sync 只拥有 local sync truth |
| CP、对象轮廓、协议/flow/state 骨架 | `02-概要设计.md` | `available` | 用作验收主题分组，不新增设计字段 |
| 29 对象、10 Command、13 Query、3 Consumer、0 Event、3 Job、17 state、UoW、error、observability | `03-详细设计.md` | `available` | P0 验收项的直接契约来源 |
| 42 leaf、4 P0 profile、strict source、activation/failure/redaction | `04-配置设计.md` | `available` | 配置与 redaction 门禁来源 |
| TC/Suite/EV 计划、证据路径、测试层级、P0/P1/P2 和 blocker | `05-测试方案.md` | `available` | 只消费计划，不写执行结果 |
| 送验实现、环境、数据、run | 交付材料 | `not_provided` | 在正式验收前固定；当前不得填写 |
| 上游专项正式文档/台账 | L0/L1/L4 专项仓 | `contract_partial` | 能力级边界可消费；未闭合合同保持 blocked/waiting |

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 本轮依据哪些需求和设计？ | 依据当前正式 00～05；旧 06、README、draft 只作历史诊断。 | 00～05 文档元信息、05 §1 |
| 哪些测试证据支撑裁决？ | 只消费 05 规划的 `TC-SYNC-*`、`EV-SYNC-*`、suite artifact 和固定 report path；当前均是 planned identity。 | 05 §5、§13、`05_test_plan_calibration_flow.md` |
| 哪些版本、环境和数据成为基线？ | 由 Step 3 在送验前固定 source refs、implementation/build、4 P0 profile、config digest、fixture/replay root 和 `<run_id>`；当前不预填。 | 06 SOP Step 3；05 §8/§13 |
| 哪些内容不应写入验收标准？ | 需求重定义、实现细节、测试执行流水、CLI/package 选择、部署步骤、真实结果、artifact/report/evidence 实例、review verdict/signoff/readiness。 | 06 SOP §1、书写规范 §2 |
| 是否存在阻塞缺口？ | 存在 `SYNC-UP-001~010`、`SYNC-LOCAL-001~005`；可定义 local/negative/state/UoW/redaction 门禁，真实正向 integration 保持 blocked/waiting。 | 00 §15、03 §17、05 §1/§14 |

## 4. 当前文档问题诊断

| 问题 | 旧 06 / 历史材料影响 | 处理 |
|---|---|---|
| 旧文档以 `SyncTask/SyncStatus/ConflictView` 为主语 | 与 03 的 29 对象、17 状态、分层协议不一致 | full-restart；正式 06 只使用当前对象、协议和状态 |
| 旧验收项可能把 ACK/commit/日志当成功 | 会越权消费外部 truth 或证据 truth | 在 §1 输入边界和后续 VETO 中明确不可升格 |
| 旧文档未固定 evidence ceiling | 无法复验、容易伪造“通过” | 只允许 `artifacts/test/<run_id>/`、`reports/runs/<run_id>/`、`reports/acceptance/` |
| 上游合同未闭合 | 无法把正向 owner/Git/fs integration 写成通过条件 | 记录 blocker；local contract 可验，positive integration 为 blocked/waiting |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 真相源 | 旧 06/README/draft 混合 | 00～05 当前正式文档单向输入 | 避免历史污染 |
| 验收职责 | “功能能否使用”泛化判断 | 以 AC、VETO、设计契约、TC、EV、report path 裁决 | 满足可判定和可追溯 |
| 外部结果 | 可能默认 external success | 只允许分层 handoff/transport/probe/Decision，ACK≠accepted | 保持 owner boundary |
| 证据 | 泛化“测试报告” | run-scoped artifact/report/acceptance 入口 | 固定可复核路径 |
| 当前结论 | 容易误写完成 | 设计阶段不填写 verdict/signoff/readiness | 不伪造事实 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 直接沿用旧 06 | 写入快 | 主语、状态、证据和 ownership 失真 | 拒绝 |
| 只引用 05 不列具体输入 | 篇幅小 | 无法知道 AC/VETO 如何回链设计与测试 | 拒绝 |
| 以 00～05 为唯一输入，逐 Step 形成裁决 | 可审计、可回填、能保留 blocker | 需要较多中间产物 | 采用 |

## 7. 结构化中间产物

### 7.1 验收输入映射表

| 来源文档 | 验收输入 | 本文如何裁决 | 证据/路径上限 |
|---|---|---|---|
| 00 | `FR-SYNC-001~015`、`BR-SYNC-001~025`、`AC-SYNC-001~020`、`VETO-SYNC-001~005`、NFR、owner boundary | 转成范围、功能/红线/NFR/VETO/风险和结论条件 | 由 05 的 `TC-SYNC-*`、`EV-SYNC-*` 计划承接 |
| 01 | Sync-owned local truth、禁止 owner truth、dependency direction、fail-closed | 转成数据边界、架构红线、跨仓同步和 VETO | `EV-SYNC-ARCH-001` 等计划 ID |
| 02 | CP1～CP6、处理流、状态轮廓、非范围 | 转成功能验收主题和范围裁决 | `EV-SYNC-FLOW-001` 等计划 ID |
| 03 | 29 objects、10 Command、13 Query、3 Consumer、0 Event、3 Job、17 states、UoW/error/observability | 转成每条 P0 门禁的正式设计契约 | `EV-SYNC-TRACE-001`、`EV-SYNC-CONSISTENCY-001` 等计划 ID |
| 04 | 42 leaf、38 required、4 nullable operations、4 P0 profile、strict source/activation/failure/redaction | 转成配置、非功能、证据和 VETO 门禁 | `EV-SYNC-CONFIG-001`、`EV-SYNC-REDACT-001` 等计划 ID |
| 05 | TC/Suite/EV 设计级计划、固定根、P0/P1/P2、blocker | 转成通过/失败条件与证据入口；不消费结果 | `reports/runs/<run_id>/...`、`reports/acceptance/...` |

### 7.2 必须回答 / 不回答矩阵

| 必须由 06 回答 | 不由 06 回答 |
|---|---|
| 在固定基线和证据下什么算通过/有条件通过/不通过 | 需求、对象、字段、协议和状态的重新设计 |
| P0 功能、红线、同步、一致性、NFR、证据门禁 | 实现模块、源码文件、package、runner、CI 命令 |
| VETO、缺陷影响、复验、风险接受、签署口径 | 测试执行流水、实际 run、真实报告内容 |
| evidence/report/handoff 如何支撑裁决 | Project/Artifact/Baseline/Review Gate/Workspace/Archive/Git remote truth |

### 7.3 输入边界图

```text
00 requirements ─┐
01 architecture ─┤
02 HLD ──────────┤
03 DDD ──────────┼─> 06 acceptance gates ─> conclusion/signoff口径
04 config ───────┤             ^
05 test plan ────┘             │
delivery baseline + run-scoped evidence (Step 3 固定)
```

关键说明：

1. 06 只把已确认输入转成裁决门禁，不替代上游设计。
2. 当前没有送验版本或真实证据，因此 Step 3 前不能出现实际结论。
3. 上游 blocker 只限制对应正向门禁，不允许用替代信号关闭。

## 8. 回填草稿

正式 §1 应声明：本验收标准承接当前正式 00～05；00 提供需求/规则/AC/VETO，01 提供 ownership 与架构红线，02 提供 CP/flow/state 范围，03 提供字段级对象/协议/状态/UoW/error/observability 契约，04 提供配置与 redaction 契约，05 提供测试用例、证据计划和固定路径。本文只定义裁决条件，不重新定义需求、设计、测试、实现或部署；旧 06/README/draft 仅作历史材料。缺少正式字段、状态、source、version、证据或 report 关系时必须暂停并回写上游。

## 9. 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| 送验 implementation/build/source refs | 无法进入真实验收基线 | Step 3 / 验收开始前 |
| `<run_id>`、raw artifact、run report、acceptance handoff | 无法作最终证据裁决 | Step 3/10/14 |
| 上游 SDK/source/access/review/probe exact contract | 正向跨仓门禁保持 blocked/waiting | 对应 blocker 解锁时 |
| `.qs-sync` 物理 schema、Git/fs 支持矩阵和 CLI/package 选择 | 物理 integration 与实施 readiness 不可裁决 | 07 前置/后续专项确认 |

## 10. 进入下一步条件

- [x] 00～05 输入和历史边界已固定。
- [x] 06 必须回答与不回答的问题已明确。
- [x] 证据路径、blocker 和当前不存在真实结果的上限已记录。
- [x] 正式 §1 回填草稿可直接引用本步结论。
- [x] 本步完成后停审记录已写入；进入 Step 2 前须先读取本 flow、台账和本文件。

## 11. Step 停审记录

- 本步裁决：`pass_with_upstream_blockers`。
- 未生成正式 06、未创建真实 evidence/report、未填写 verdict/signoff/readiness。
- 下一步阅读：`06_acceptance_calibration_flow.md`、本文件和 `00-需求文档.md` §2/§4/§9/§10/§14，再创建 Step 2 中间产物。
