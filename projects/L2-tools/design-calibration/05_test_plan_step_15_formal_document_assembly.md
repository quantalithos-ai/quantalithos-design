# L2-tools 05 测试方案 · Step 15 正式文档装配

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 15「整理正式测试方案文档」
>
> 目标文件：`projects/L2-tools/05-测试方案.md`
>
> 直接输入：Step 1~14 全部已接受的 `design-calibration/05_test_plan_step_*.md`、
> `05_test_plan_calibration_flow.md`、项目执行台账及当前正式 `00~04`。

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | 15 / 整理正式测试方案文档 |
| 状态 | `completed / pass; stop review` |
| 当前模块 | `formal_document_assembly:completed_stop_review` |
| 正式文档写入门禁 | 已完成 15 章重建及 2026-08-07 深度终审；正式 `05-测试方案.md` 写入已关闭 |
| 目标 | 形成可供新版 `06-验收标准.md` 和后续 `07-实施计划.md` 消费的测试设计，不产生执行事实 |
| 当前 blocker | `L2T-UP-001~009` 继续开放；只影响 provider/readiness/真实联调 positive，不阻塞 local/negative/blocked-aware 方案装配 |
| 下一步 | 等待用户审阅；只有用户明确授权后才可读取验收标准 SOP/书写规范并创建 06 flow，不得沿用或修改旧 06 |

## 2. 本步输入与来源权限

| 输入 | 用途 | 装配权限 |
|---|---|---|
| `05_test_plan_step_01_input_boundary.md` | §1 上游关系、历史材料和 blocker 口径 | 直接承接；不复述 SOP 问答 |
| `05_test_plan_step_02_scope.md` | §2 目标、范围、非范围、优先级和 veto | 直接承接；不扩大范围 |
| `05_test_plan_step_03_test_objects_cuts.md` | §3 对象、模块、协议、状态和外部 seam 切口 | 直接承接；不新增对象 |
| `05_test_plan_step_04_strategy_layers.md` | §4 分层、金字塔、E2E 边界 | 直接承接；不把外部正向当事实 |
| `05_test_plan_step_05_traceability_coverage.md` | §5 双向需求/设计/TC/EV 覆盖 | 使用主题标签；具体 TC 以 Step 6 为准 |
| `05_test_plan_step_06_cases.md` | §6 concrete TC、断言、phase、EV 槽位 | 具体用例唯一身份来源 |
| `05_test_plan_step_07_test_data.md` | §7 dataset、fixture、deterministic primitive、清理 | 只写 planned 数据契约 |
| `05_test_plan_step_08_environment_config.md` | §8 profile、依赖类型、配置和 unavailable 处理 | 只写 planned 环境；不声称环境存在 |
| `05_test_plan_step_09_automation_gates.md` | §9 suite、gate、check、脚本、输出根 | 只写 planned interface |
| `05_test_plan_step_10_nonfunctional.md` | §10 专项、结构性 NFR、安全、恢复、观测 | 不写未经 authority 的数字结果 |
| `05_test_plan_step_11_defects_retest.md` | §11 S/A/B/R、复验和关闭证据 | 不写缺陷实例或签署 |
| `05_test_plan_step_12_entry_exit.md` | §12 进入、退出、暂停和阻断 | 只写未来执行门禁 |
| `05_test_plan_step_13_evidence.md` | §13 artifact/report/evidence 派生和真实性 | 不创建 run/alias/report |
| `05_test_plan_step_14_regression_risks.md` | §14 回归矩阵、全量、residual、06 交接 | 直接承接；主题标签不得变为第二套 TC |
| 当前正式 `00~04` | 测试 oracle | 以当前正式内容优先，冲突不沿用旧材料 |
| README、旧 `05/06` | 历史/污染审计 | 不进入正式测试 oracle、TC、EV 或结果 |

## 3. SOP 问题回答

| 问题 | 收口答案 |
|---|---|
| 是否按 15 章主链装配？ | 是：§1 上游关系、§2 目标范围、§3 对象切口、§4 分层、§5 追溯、§6 用例、§7 数据、§8 环境、§9 自动化、§10 专项、§11 缺陷、§12 准则、§13 证据、§14 回归风险、§15 参考。 |
| 是否保留 P0 细节？ | 是。§3~§14 保留具体模块、协议、状态、TC、dataset、suite、check、路径和 residual；不压缩成旧式摘要。 |
| 是否删除讨论语气？ | 是。正式正文只保留结论、表格、清单和边界；SOP 问题回答、停审记录、改动诊断留在本目录。 |
| 需求/设计字段状态是否闭环？ | 是。P0 断言只使用 `03` 正式字段、状态、错误、协议和 flow；配置断言只使用 `04` canonical item、CFG 族和 profile。 |
| concrete TC 是否稳定？ | 是。具体身份只来自 Step 6 的 family/序号；Step 5 的 `RULE/DATA/NFR/CORE` 等仅为 derived coverage/evidence 标签。 |
| 是否能被 06 消费？ | 能。§5/§6/§12/§13/§14 提供 AC/VF 方向、full denominator、candidate EV、blocker/residual 和验收交接边界；不越权做 06 裁决。 |
| 是否写入执行事实？ | 否。没有真实 run、artifact、report、digest、commit、测试结果、缺陷 ID、risk signoff 或 readiness。 |

## 4. 正式章节装配映射

| 正式章节 | 必须保留的内容 | 具体校准来源 |
|---|---|---|
| §1 与上游文档的关系声明 | 真相源优先级、依赖类型、历史材料、`L2T-UP-*` | Step 1；Step 8 |
| §2 测试目标与范围 | 五能力、FR、P0/P1/P2、veto、非范围 | Step 2 |
| §3 测试对象与切口 | 七模块、协议族、状态/TX/CONC/ERR/CFG/OBS/NC、外部 seam | Step 3 |
| §4 测试策略与分层 | 测试金字塔、层级表、最小 E2E 和失败语义 | Step 4 |
| §5 需求追溯与覆盖矩阵 | C/FR/BR/DR/NFR/AC/VF、配置族、双向覆盖、主题标签规则 | Step 5；Step 14 §4 |
| §6 测试场景与用例设计 | concrete TC 全量矩阵、正式 oracle、禁止断言、EV 槽位 | Step 6；Step 14 §4 |
| §7 测试数据设计 | manifest、deterministic clock/ID、fixture、negative corpus、清理 | Step 7 |
| §8 测试环境与配置矩阵 | profile、依赖类型、拓扑、配置来源、故障状态 | Step 8 |
| §9 自动化与 CI/CD 门禁 | suite registry、pipeline、CLI、status、checks、report scripts | Step 9 |
| §10 专项测试与非功能验证 | 性能结构性 sample、安全、恢复、并发、观测和专项映射 | Step 10 |
| §11 缺陷管理与复验规则 | S/A/B/R、VF、复验矩阵、关闭材料、防回归 | Step 11 |
| §12 进入与退出准则 | planned entry/exit、暂停/阻断、P0 denominator 和 residual | Step 12 |
| §13 报告与证据归档 | raw/report 路径、schema、candidate EV、eligibility、审查边界 | Step 13 |
| §14 回归策略与残余风险 | 最小回归、P0 全量、S 级、residual、06 交接 | Step 14 |
| §15 参考 | 当前正式文档、标准、Step 产物、历史材料说明 | Step 1、Step 14；本装配记录 |

每个正式章节开头必须放置具体 `design-calibration/05_test_plan_step_*.md` 来源块，并注明应阅读该文件的“结构化中间产物”“回填草稿”“待确认事项”等小节。正式正文不得只写“详见 design-calibration”。

## 5. 跨文档一致性复核

### 5.1 真相源表

| 设计事实 | 真相源 | 测试消费 | 冲突处理 |
|---|---|---|---|
| 需求、规则、数据、NFR、AC/VF | `00-需求文档.md` | §2、§5、§10、§12、§14 | 旧 05/06 不覆盖当前编号 |
| owner、依赖类型、写权和接缝 | `01-架构设计.md` | §1、§3、§8、§9 | runtime/event 不写成 compile dependency |
| 组成部分、入口和流程轮廓 | `02-概要设计.md` | §3、§4、§6 | 细节以 `03` 为准 |
| 对象、字段、协议、状态、错误、UoW、Port | `03-详细设计.md` | §3、§6、§10~§14 | 测试不得私造第二 schema |
| 配置 root/item、profile、source、CFG/V/B | `04-配置设计.md` | §7、§8、§9、§10、§12 | 不新增配置 key 或默认值 |
| concrete TC 和 case oracle | Step 6 | §6、§12、§14 | Step 5 主题不创建第二 TC |
| artifact/report/evidence 派生 | Step 13 | §9、§12、§13、§14 | 只定义计划，不生成实例 |

### 5.2 字段闭环表（代表性 P0）

| 领域对象/载体 | 字段或边界 | 构造入口 | DTO/Event/Job 传递 | 缺失行为 | 测试覆盖 | 证据方向 |
|---|---|---|---|---|---|---|
| typed ref / identity | kind、scope、version、correlation | `contracts` factory/validator | Command/Query/Consumer metadata | typed validation error；禁止字符串 fallback | `TC-L2T-FOUNDATION-001~005` | `EV-CAND-L2T-FOUNDATION-001` |
| ToolContract / definition | identity、revision、current/terminal state、digest | CF-01~04 application flow | contract command/result/view | duplicate/conflict/CAS typed error | `TC-L2T-CONTRACT-001~008` | `EV-CAND-L2T-CONTRACT-001` |
| Binding | relation、snapshot、assessment、gap、CAS token | CF-05~07 / IF-01 / JF-01 | Hub clue/selector/job report | blocked/stale/conflict；不复制 registry | `TC-L2T-BIND-001~008` | `EV-CAND-L2T-BIND-001` |
| Invocation/admission | canonical frame、metadata、anchor、admission | CF-08 / QF-04 / IF-03 | caller/adapter/Sandbox carrier | rejected/unavailable；不执行 | `TC-L2T-INV-001~008` | `EV-CAND-L2T-INV-001` |
| Precondition/handoff | requirement、auth/readiness refs、Prepared、call outcome | CF-09~10 / OF | consumer/continuation carrier | fail-closed、unknown/manual、one call | `TC-L2T-PRE-001~010`、`HANDOFF-*` | `EV-CAND-L2T-PRE-001`、`EV-CAND-L2T-HANDOFF-001` |
| Outcome/audit | source assessment、terminal outcome、audit pair | CF-11 / QF-06 | local view/safe handoff refs | result/error XOR；pair atomic；late append | `TC-L2T-OUTCOME-001~010` | `EV-CAND-L2T-OUTCOME-001` |
| Query/Job projection | visibility、freshness、cursor/watermark、disposition | QF/JF | Query response/JobReport | zero-write/no-repair/bounded partial | `QUERY-*`、`JOB-*` | `EV-CAND-L2T-QUERY-001`、`EV-CAND-L2T-JOB-001` |
| Config candidate | profile/source/item/ref/sensitivity | 04 V0~V8/B0~B8 | runtime bundle/entry selector | fail-fast/no partial/no raw output | `CFG-*` | `EV-CAND-L2T-CFG-*` |
| Observation/audit material | TraceContext、安全字段、low-cardinality、redaction | 03 §14 / 04 safety floor | log/metric/report/evidence | forbidden body reject；status独立 | `OBS-*`、`VETO-*` | `EV-CAND-L2T-OBS-001`、`EV-CAND-L2T-VETO-001` |

### 5.3 DTO/Event/Job 到 Domain 构造闭环

| 输入契约 | 目标对象/处理流 | 必填检查 | 不得混同 | 缺失/冲突行为 | 代表 TC |
|---|---|---|---|---|---|
| Command `CF-01~13` | contract/binding/invocation/precondition/outcome/handoff | metadata、typed ref、scope、digest、expected version | request != runtime action；outcome != raw capture | reject/typed conflict/unknown fence | `CONTRACT/BIND/INV/PRE/OUTCOME/HANDOFF` |
| Query `QF-01~11` | view/projection mapper | visibility、freshness、selector、page | empty != NotVisible；query != repair | zero-write/degraded surface | `QUERY-001~011` |
| Consumer `IF-01~05` | claim/receipt/assessment/re-entry | source、version、correlation、dedup | IF-03 only formal CF-11 re-entry | duplicate/unsupported/blocked | `CONSUMER-001~005` |
| Event `OF-01~04` | safe material/attempt/status | committed material、four gates、Prepared | SubmittedLocally != Delivered/Observed | ineligible/unknown/manual | `CONT/HANDOFF-*` |
| Job `JF-01~04` | bounded report/projection/gap | scope、cursor/watermark、limit、snapshot | job != core repair/replan | Partial/Blocked/Failed report | `JOB-001~004` |

### 5.4 状态闭环表

| 状态族 | 正式来源 | 测试要求 | 禁止替代 |
|---|---|---|---|
| contract evolution | `03` §9.2 | Candidate/Current/Superseded/RetirementPending/Retired 合法迁移和 terminal guard | 旧 `Registered`/`Completed` 口语 |
| binding/source | `03` §9.3 | Bound/ExplicitUnbound/Replaced/Invalidated 与 assessment/gap 分离 | visibility 当 authorization |
| invocation/admission | `03` §9.4 | Admitted/AwaitingPrecondition/Rejected/Unavailable 等正式状态 | accepted/executed 推断 |
| precondition/handoff | `03` §9.5 | Prepared、known failure、CallOutcomeUnknown、phase-2 local disposition | Prepared=accepted/run/receipt |
| outcome/audit/handoff | `03` §9.6 | terminal outcome、audit pair、attempt/status 独立、late material append | Delivered/Observed 覆盖 local truth |
| integrity/derived | `03` §9.7 | stale/rebuilding/unavailable/failed/partial 只表示 projection/job surface | Query/Job 修复核心 truth |

### 5.5 Phase / commit boundary 闭环

| Flow | phase-1 local commit | Port call | phase-2 local disposition | 失败/unknown |
|---|---|---|---|---|
| `CF-10` | Prepared handoff + token | 最多一次 Sandbox/执行 Port | local attempt/status CAS | `CallOutcomeUnknown`，manual；不重调 |
| `CF-12` / `OF-01~04` | safe material + Prepared attempt | 最多一次 collaboration Port | local submission disposition | `SubmissionOutcomeUnknown`，不推 Delivered |
| outcome/audit | outcome/audit 同一 UoW | 无外部 call | local pair 完成后才可 handoff | `CommitOutcomeUnknown` 不重算 |
| Query | 无写 UoW | 无外部 Port | view only | unavailable/degraded，不 refresh |
| Job | bounded snapshot/plan | 只允许声明的外围调用 | report/projection/gap | partial/blocked，不 repair |

### 5.6 Public protocol 传递类型闭环

| Surface | 外层载体 | 正式传递类型 | 依赖边界 | 测试 |
|---|---|---|---|---|
| Command result/error | typed result + protocol error | contracts/shared carrier | `contracts` 不依赖 domain | `FOUNDATION`、`ERR` |
| Query view/page | projection/view + freshness/visibility | contracts/query carrier | zero-write | `QUERY` |
| Consumer envelope | source/version/correlation/dedup | consumer carrier | IF-03 only re-entry | `CONSUMER` |
| Event/continuation | safe material + attempt/status refs | outbound carrier | body-free, target/route separated | `HANDOFF`、`CONT` |
| Job report | bounded per-target disposition | job/report carrier | no-repair | `JOB` |

### 5.7 命名与冲突修正表

| 潜在冲突 | 当前统一口径 | 处理 |
|---|---|---|
| Step 5 `RULE/DATA/NFR/CORE` 与 Step 6 无同名 TC | 主题是 derived grouping，Step 6 concrete TC 是唯一 case identity | 正式 §5 标签化，§6 只列 concrete TC |
| 旧 05 的 `Accepted/Completed/Delivered/Observed` 泛化状态 | 以 `03` 正式 enum、phase 和独立 status ref 为准 | 旧材料不继承 |
| planned EV 与真实 evidence | `EV-CAND-L2T-*` 仅槽位；实例由 fixed run 元组派生 | 不写 alias、digest、eligible 结果 |
| `staging-like`/`production-like` | conditional/inactive | 不进入 P0 denominator/readiness |
| `blocked_dependency` 与 `passed` | 独立 status | blocked/unknown/not_evaluated 不得转 pass |

## 6. 正式文档装配与自审规则

### 6.1 写入批次

- [x] 旧 `projects/L2-tools/05-测试方案.md` 已整体替换，其旧内容只保留 `historical_material` 处理记录。
- [x] 已按 §1~§15 顺序写入；每章包含来源块、收口正文和必要矩阵。
- [x] 未复制 Step 文件的 SOP 问答、改动前后诊断、停审记录或未确认讨论。
- [x] 未新增 concrete TC、业务配置 key、业务状态、依赖类型或实现命令；Step 15 回补的 artifact DTO 仅属于 local test infrastructure。

### 6.2 正式文档评审清单

| 检查项 | 通过标准 |
|---|---|
| 章节结构 | 恰好包含规范要求的 15 章主链，章节名不漂移 |
| 来源入口 | 每章开头列出一个或多个具体 Step 文件和延伸阅读小节 |
| 上游承接 | `00~04` 的需求、owner、字段、状态、协议、配置和 blocker 口径一致 |
| 范围 | P0/P1/P2/non-scope 可判定，外部 positive 不被伪造 |
| TC identity | §6 只出现 Step 6 concrete TC；无第二套 `RULE/DATA/NFR` 用例编号 |
| 断言闭环 | P0 断言能回指 `03` 对象/协议/状态/error/flow 或 `04` CFG/profile |
| 数据/环境 | fixture、profile、依赖类型、隔离和清理可落码；不声称已存在 |
| 门禁 | suite/check/script/status/path 有固定契约；无 `latest`、project 子目录或静态 pass |
| 非功能 | 结构性 NFR 有方法；无 authority 数字阈值或结果 |
| 缺陷/准则 | S/A/B/R、进入/退出、暂停/阻断、复验和 residual 一致 |
| 证据 | fixed-run、artifact/report pairing、redaction、candidate EV 和 06 边界清楚 |
| 两阶段 evidence | pre-check index 只含 derivation；final seal 才含 eligibility，且 `single_suite` 禁止 seal |
| gate/check 闭集 | PR/main/nightly/integration/release/conditional-provider 的 `check_refs` 是固定 10/11/11/9/11/9，不由运行时删减 |
| namespace | 13 semantic suite 与 11 root check 分离；check 不写入 `suites/<suite>` |
| release source | release 固定一个 `ci-test` run/profile，11 P0 suite 同 run；controlled seam 仅 scripted local parity，不拼 integration run |
| acceptance 生命周期 | run-scoped staging -> checks/redaction -> single locked publisher -> fixed files -> manifest-last -> release seal；review seal 后 append-only，无 writer 环和多文件原子性假设 |
| 事实性 | 无真实 run、commit、digest、执行结果、签署、readiness 或 acceptance verdict |
| 参考 | 列出现行正式文档、标准、Step 产物和历史材料说明 |

### 6.3 装配前置结论

- [x] Step 1~14 均标记 `accepted_for_step_N / proceed_to_next`。
- [x] 项目台账和 flow 已允许 Step 15 装配。
- [x] 旧正式 05 已确定为 historical material，不能作为正文输入。
- [x] 装配期间 `06-验收标准.md` 保持 `blocked_by_05` 且未创建或修改；05 完成后已转为 `awaiting_user_authorization`。
- [x] 当前无新增 blocker；`L2T-UP-001~009` 继续以 blocked/conditional/residual 承接。

## 7. 回填执行结果（装配完成）

以下是文档装配审计，不是测试执行结果、artifact、evidence、验收 verdict 或签署。

| 审计项 | 实际结果 | 结论 |
|---|---|---|
| 正式章节 | 恰好 15 个一级正式章节，顺序为 §1~§15；每章均有具体 Step 来源和延伸阅读入口 | pass |
| Concrete TC | Step 6 与正式 05 的稳定 TC 集合逐 ID 差分为空；两侧均为 234 个 | pass |
| Derived theme | `CORE/RULE/DATA/NFR/BOUNDARY/REDACTION` 仅为 coverage/evidence theme；无可执行 derived TC | pass |
| Test data | 18 个 canonical `DS-L2T-*` + 6 个 negative/recovery corpus | pass |
| Automation registry | 13 个 suite、7 个 planned gate、11 个 mandatory check、7 个 report generator | pass |
| Residual | `L2T-RR-001~016` 连续且每项有 status、缓解、owner role/reopen trigger 和 06 disposition | pass |
| Artifact codability | 回补 Step 13 与正式 §13.4：固定 `l2-tools.test-artifact.v1`、`sha256`、canonicalization/self-exclusion、required/conditional field、closed enum、stdout/stderr exact-byte digest、writer/reader owner 和 failure retention | pass |
| Evidence phase separation | `evidence-index.json` 只含 `L2DerivationStatus`；`gate-summary.json` 才含 `L2EvidenceStatus`，final priority 为 `invalid > ineligible > unavailable > pending_review > eligible`；review requirement 非空不高于 pending | pass |
| Gate-check closed sets | main/nightly/release 各 11，PR 10，integration/conditional-provider 各 9；`single_suite` 仅诊断且不得生成 final seal | pass |
| Suite/check namespace | 13 semantic suite 与 11 root check identity/path/context refs 分离；未发现 check 占用 `suites/<suite>` | pass |
| Release source closure | release 固定单一 `ci-test` run/profile 执行 11 P0 suite；`controlled-seam` 只跑 scripted local parity，`release-local-smoke` 只引用 same-run case；无跨 run/profile 拼证 | pass |
| Acceptance/review lifecycle | generator 输入闭集为 pre-seal raw/report/index/blocker/residual；run staging 进入 redaction；single publisher lock、逐文件 replace、manifest-last、seal 绑定 manifest digest；review post-seal append-only；无 seal 反向输入或不可落码的多文件原子替换声明 | pass |
| TC/EV identity | 已扫描正式 05 与 Step 1~15；Step 5 的 TC-like derived theme 已回校为 concrete source mapping，Step 9/13 的斜杠式 candidate slot 已拆成完整稳定 ID；无第二 TC namespace 或正式 EV alias/instance | pass |
| Source and protocol closure | `00~04` 的 owner、字段、DTO/Event/Job、状态、phase、UoW、public protocol、CFG/profile 和依赖类型保持一致 | pass |
| Historical pollution | README、旧 05、旧 06 明确为 `historical_material`；未继承旧状态、阈值、API、静态结果或签署叙事 | pass |
| Factuality | 未发现真实 run、commit、digest、artifact/report、测试结果、缺陷 ID、risk acceptance、signoff 或 readiness claim | pass |
| Markdown/diff hygiene | 目标文件 `git diff --check` 通过 | pass |

最终审计未发现新增上游 blocker。`L2T-UP-001~009` 保持 open，并由 blocked/conditional/unverifiable/future residual 承接，不阻塞正式 05 完成。

## 8. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 新版 06 的 evidence consumer、签署和 risk acceptance 结构 | 影响 §12~§14 下游裁决 | 05 只提供输入和 candidate 方向，06 启动时重新确认 |
| 实现仓/runner/CI/持久化 backend | 影响实际脚本和执行环境 | 05 只固定外层接口和路径，不伪造命令 |
| `L2T-UP-001~009` owner closure | 影响 conditional provider/readiness | 保持 blocked/conditional，不能阻断本次文档装配 |
| retention、measurement authority、source baseline | 影响证据长期有效性和数字 NFR | 进入 §14 residual 与新版 06/运维 |

## 9. 完成与停止条件

- [x] 15 章来源映射和装配规则完成。
- [x] 跨文档字段、DTO/Event/Job、状态、phase、public protocol 和命名闭环完成。
- [x] 正式文档自审清单可判定，旧材料和事实性边界明确。
- [x] 正式 `05-测试方案.md` 完成写入并通过最终审计。
- [x] flow/ledger 更新为 `05_completed_stop_review`。

## 10. Step 15 停审记录

| 项 | 结论 |
|---|---|
| Step 状态 | `completed / pass; stop review` |
| 正式文档 | `projects/L2-tools/05-测试方案.md` 已完成并关闭写入 |
| 停审时间 | 2026-08-07（设计文档深度终审记录；不是测试执行时间） |
| 上游 blocker | 无新增；`L2T-UP-001~009` 继续开放，不阻塞 local/negative/blocked-aware 测试方案完成 |
| 下游门禁 | `06-验收标准.md` 为 `awaiting_user_authorization`；旧 06 仍是 `historical_material` |
| 下一允许动作 | 等待用户明确授权 06；获授权后先读验收标准讨论流程 SOP、书写规范和当前正式 00~05，再创建 06 calibration flow |
| Commit | `false`；当前不需要且未获授权提交 |
