# Step 1. 确认验收输入边界

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 1
> 回填章节：`06-验收标准.md` §1 与上游文档的关系声明
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| current_document | `06-验收标准.md` calibration |
| current_step | Step 1 |
| current_module | `acceptance_input_boundary` |
| gate_status | `pass_for_step_02` |
| acceptance_lifecycle | `not_entered / blocked_by_missing_baseline` |
| formal_06_write_allowed | `false_until_step_15` |
| next_allowed_action | 创建并完成 Step 2；不得修改正式 06 |

## 2. 本步目标、输入与非目标

本步只固定新版 06 承接的正式输入、验收与测试/实施/运行职责边界、当前缺失事实及历史污染。它不定义具体验收门禁，不选择送验版本，不生成证据，也不对不存在的交付给出三值 verdict。

| 输入 | 状态 | 本步用途 |
|---|---|---|
| 正式 `00-需求文档.md` | `formal / stop_review` | 五能力、16 FR、25 BR、六类 NFR、11 AC、数据与 owner 红线 |
| 正式 `01-架构设计.md` | formal baseline | Layer 5、SDK-first、truth ownership、依赖分类、跨平台和技术中立 |
| 正式 `02-概要设计.md` | formal baseline | 六组成部分、17 对象、11/12/4/5 协议与 flow/state 轮廓 |
| 正式 `03-详细设计.md` | `completed_with_upstream_blockers` | 七模块、字段/port/协议、11/12/4/0/5、21 状态主语、一致性/恢复/观测 |
| 正式 `04-配置设计.md` | `completed_with_upstream_blockers` | 41 项、四 profile、strict source、builder/readiness、failure/rollback |
| 正式 `05-测试方案.md` | `completed_with_upstream_blockers` | 18 CUT、108 TC、12 suite、18 slot、T0～T4、缺陷/证据/风险合同 |
| 05 Step 12～15 | completed | 分层进出、fixed-run 证据、residual、正式装配事实与 06 承接项 |
| 专项上游正式文档/必要台账 | 有 blocker | 判断 Runner-facing seam 与真实 positive integration 准入 |
| 旧正式 06、README、draft | `historical_material` | 只扫描旧对象、阈值、技术和泛证据污染 |
| 验收 SOP / 书写规范 | authority | 固定 15 Step、15 章、三值结论、逐项闭环和证据路径 |

非目标：不新增需求、对象、状态、协议、配置、TC、suite、slot、实现任务、部署步骤或 owner 结论；不创建 delivery/build/environment/run/evidence/defect/risk/signoff 事实。

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 本轮验收依据哪些需求和设计？ | 只依据当前正式 00～05；需求 AC 是功能裁决入口，03 是字段/协议/状态直接真相源，05 是测试与 future evidence 合同。 | 00 §14；03 §5～§15；05 §5～§14 |
| 哪些测试证据支撑验收？ | 未来由 `EV-RUN-CTX-001` 至 `EV-RUN-BND-018` 的合格 runtime instance，以及同一 fixed run 的 TC case、suite report、完整性 check 和 digest 支撑。当前 slot/alias 只是 planned contract。 | 05 §13 |
| 哪些交付、环境和数据成为基线？ | 未来必须固定 design/implementation source ref、delivery ref/digest、四 profile 中的一个、完整 config/digest、dependency/environment refs、fixture/data refs、suite manifest、fixed `run_id` 和 acceptance review version。当前均未固定。 | 04 §6～§12；05 §7～§13 |
| 哪些内容属于测试或实施，不写入 06？ | TC/fixture/suite/script 如何实现归 05/07；源码、phase、commit 归 07；部署/runbook/SLO 运维归后续正式文档。06 只定义是否具备裁决资格和如何裁决。 | SOP 边界；05/07 职责 |
| 是否有阻塞 06 生成的上游缺口？ | 没有阻塞“验收合同设计”的缺口；`RUN-UP-*`、`RUN-DDD-*`、`RUN-OPS-*` 与缺 baseline 会阻断实际验收进入或对应 positive gate。 | 项目台账；05 §14 |

## 4. 当前旧文档问题诊断

| 旧正文问题 | 影响 | 本轮处理 |
|---|---|---|
| 以 `RunnerRun`、`RunQueueEntry`、`RunnerRunState`、`RunControlEntry` 等旧对象为验收主语 | 与新版 03 的 17 对象、正式状态与协议冲突 | Step 15 整文件删除后重建；零继承 |
| 使用 `CreateRun`、`TriggerRetry/Replay/Cancel/Kill`、`BuildRun*` 等旧操作 | 无法回指 11 Command / 12 Query / 4 Consumer / 5 Job | 全部替换为新版正式协议与 flow |
| 以 API 响应、DB 记录、compare report、空 `[]` 作为证据 | 不具 fixed-run raw/report/check/digest 资格 | 改为 TC→slot→runtime EV→report/artifact→AC/VETO 闭环 |
| 写死 `<200ms`、`<1s`、`100%` 等阈值 | 需求明确无 workload/平台 authority，不可裁决 | 量化保持 measurement/residual，authority 到达才选入 gate |
| 10 章结构且功能/红线/证据/签署混合 | 缺 SOP 要求的独立门禁与 VETO/风险闭环 | Step 15 重建为固定 15 章 |
| “Draft/In Review/Accepted”和空签名易被误读为实际送验 | 混淆文档状态、验收生命周期与 verdict | 固定三层语义，当前只允许 `not_entered` + `actual_verdict=none` |

## 5. 改动前后对比与裁决取舍

| 议题 | 旧口径 | 新口径 | 取舍理由 |
|---|---|---|---|
| 验收分母 | 五条旧 UI/run 主线 | `AC-RUN-001~011` + 横切设计/证据/VETO | 对齐正式需求与详细设计 |
| 协议 | 私有产品动作名 | 11 Command、12 Query、4 planned Consumer、0 event、5 Job | 避免接口漂移 |
| Evidence | 泛化日志/API/DB | fixed-run raw/report/check pair + digest + runtime EV instance | 可复验、防静态造证据 |
| 上游未就绪 | 模糊排除或直接失败 | baseline 未启用则 blocked；启用后 positive evidence 必需 | 既不伪造成功，也不把缺 baseline 混成 verdict |
| 当前结论 | 待评审空表 | 文档可完成；实际验收 `not_entered`，无三值结论 | 事实诚实 |
| 正式装配 | 增量改旧文件 | Step 15 full-restart | 隔离历史污染 |

拒绝两种方案：一是把 `T0-DESIGN design_ready` 当作通过；二是因当前缺实现/证据直接写“不通过”。前者伪造成熟度，后者把尚未进入的验收误写成已裁决失败。

## 6. 结构化中间产物

### 6.1 验收输入映射

| 来源 | 正式输入 | 新版 06 如何裁决 |
|---|---|---|
| 00 | `CP-RUN-01~05`、`FR-RUN-001~016`、`BR-RUN-001~025`、NFR、`AC-RUN-001~011` | 范围、功能门禁、红线、NFR、VETO 与总体裁决 |
| 01 | SDK-first、依赖类型、owner truth、数据/通信/技术红线 | §6/§7 架构与跨仓门禁 |
| 02 | 六组成部分、对象/接口/flow/state/exception 轮廓 | 验收主题分组，不作为字段真相 |
| 03 | 七模块、对象/port、正式协议/state/error/UoW/recovery | §5～§10 的直接设计契约 |
| 04 | 七配置域、41 项、四 profile、strict/builder/readiness/rollback | baseline/config/NFR/release redline |
| 05 | 18 CUT、108 TC、12 suite、18 slot、fixed-run schema、缺陷与 residual | future evidence、充分性、复验与风险来源 |

### 6.2 新版 06 必须回答

| 问题 | 收口 Step |
|---|---|
| 验收目标、P0/P1/P2 和非范围 | Step 2 |
| 未来送验必须固定什么，当前缺什么 | Step 3 |
| 如何进入、暂停、退出验收 | Step 4 |
| 功能、红线、接口、状态一致性、NFR、证据如何判定 | Step 5～10 |
| 哪些问题不可接受且一票否决 | Step 11 |
| 缺陷、复验、风险接受和签署如何影响 verdict | Step 12～14 |

### 6.3 新版 06 不再回答

| 不回答的问题 | 正式归属 |
|---|---|
| 新需求、业务规则、owner approval/execution/cleanup/evidence truth | 00 / 对应 owner |
| 新模块、DTO、port、协议、状态、错误、一致性算法 | 01～03 |
| 新配置项/profile/default/secret/阈值 | 04 |
| 新 TC、fixture、suite、script、测试执行结果 | 05 / 未来实现 |
| phase、代码任务、commit、implementation ledger/skeleton | 07 |
| 部署、告警、生产 SLO/readiness、runbook | 后续部署运维文档/authority |

### 6.4 当前缺失事实与影响

| 缺失事实 | 当前状态 | 对 06 设计 | 对实际验收 |
|---|---|---|---|
| 目标实现仓、source/commit/build/image/package | `not_created / not_fixed` | 不阻塞规则设计 | 阻断进入 |
| 环境、dependency、config/data manifest | `not_fixed` | 不阻塞 | 阻断进入 |
| fixed `run_id`、suite execution | `not_created / not_run` | 不阻塞 | 阻断进入 |
| raw artifact、report、runtime EV | `not_created` | 不阻塞 | 阻断裁决 |
| defect snapshot、handoff、VETO/risk review | `not_created` | 不阻塞 | 阻断 decision_pending |
| risk acceptance、verdict、signoff | `none` | 不阻塞合同 | 不得推断结果 |

## 7. 回填草稿

正式 §1 应声明：新版 06 强承接正式 00～05，只定义未来交付的裁决合同，不重定义需求、设计、配置和测试；旧正式 06/README/draft 仅作历史污染输入。每个 P0 验收项必须回指正式设计契约、具体 TC、planned slot/runtime EV pattern、同一 fixed run 的 artifact/report/check 与裁决影响。当前实际验收尚未进入，文档完成不等于任何交付 verdict 或 readiness。

## 8. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 真实 delivery/environment/config/data/dependency refs | 实际准入 | 留待 07/实现/送验，不伪造 |
| `RUN-UP-001~008` exact positive seams | 真实 T2/T3 positive gate | 保持 conditional/blocked |
| workload、SLO、retention、平台矩阵 authority | hard NFR/release gate | 未到达前不写数字 |

## 9. 进入下一步条件

- [x] 正式 00～05 的验收输入与使用上限清楚。
- [x] 测试、验收、实施和运维职责已分开。
- [x] 当前缺失事实没有被伪装成 verdict。
- [x] 旧正式 06 已隔离为 historical material。
- [x] 允许进入 Step 2；正式 06 仍禁止写入。
