# Step 6. 拆分阶段任务、编写顺序与提交边界

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 6
> 回填章节: `07-实施计划.md` §6 阶段任务拆分、编写顺序与提交边界
> 当前模块: `R6.2 tasks and commit boundaries:再写入`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 6 拆分阶段任务、编写顺序与提交边界 |
| 当前模块 | `R6.2 tasks and commit boundaries:再写入` |
| 当前状态 | completed_confirmed |
| 输入基线 | Step 5 PH-01~PH-11;Step 4 交付物;`03-详细设计.md`;`05-测试方案.md`;`06-验收标准.md`;实施计划规范;台账规范 |
| 输出文件 | `projects/L3-method-library/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` |
| 停审方式 | 用户已确认 Step 6,允许进入 Step 7 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 5 阶段顺序 | completed_confirmed | 作为 commit boundary 拆分主轴 |
| Step 4 交付物清单 | completed_confirmed | 确认每个 boundary 的代码、测试、脚本、证据和 ledger 输出类型 |
| `03-详细设计.md` §4~§16 | 已读取 | 提供 layout、object、port、protocol、flow、state、tx、error、idempotency、observability |
| `05-测试方案.md` §6 / §9 / §13 / §14 | 已读取 | 提供 suite、artifact/report、EV-ML 和 regression 门禁 |
| `06-验收标准.md` §3 / §5~§14 | 已读取 | 提供 AC/VETO、evidence index、risk acceptance 和 final decision 约束 |
| `standards/document/代码实施台账与门禁规范.md` | 标准输入 | 提供 project ledger、boundary ledger、Commit Gate、Handoff Gate 和恢复顺序 |
| L1-governance Step 6 | framework_reference | 只参考任务表、提交边界表、复核表和停审粒度 |

## 3. SOP 问题回答

1. 每个阶段内有哪些实施动作。

   回答: 每个 phase 按固定写入顺序拆为 contracts / domain / application / infra / entry / tests / evidence。PH-01 先处理旧 layout 迁移和 tooling;PH-02 建公共 shell;PH-03~PH-07 建业务 truth 纵切;PH-08 建 query/material;PH-09 建 worker event;PH-10 建 jobs;PH-11 汇总 release evidence。

2. 每个任务的输入、输出和完成判定是什么。

   回答: 本 Step 使用 boundary 表给出输入、allowed scope、forbidden scope、输出和 required checks。每个 boundary 都必须能独立 review、独立验证、必要时独立回退。

3. 阶段内代码应该按什么顺序写,为什么。

   回答: 固定顺序为 public contract/ref/marker -> domain state/policy -> application ports/services/UoW/idempotency -> infra fake/controlled adapter -> entry runner -> tests/evidence scripts。先锁外部契约和设计真相源,再写内部实现,避免实现侧发明 schema。

4. 哪些任务必须同提交,哪些任务必须分开提交。

   回答: 同一可验证能力纵切内的 DTO + domain + focused tests 可同提交;service + fake repository + handler + service tests 可同提交。不同 phase、不同 protocol family、jobs、release evidence 和 business truth 必须分开提交。

5. 哪些测试必须在提交前执行。

   回答: 每个 boundary 至少执行 `cargo fmt --check`、相关 package `cargo check`、targeted tests、`git diff --check`。涉及 scripts/report/evidence 的 boundary 还必须执行 dry-run 或 report audit。

6. 每个 commit boundary 开工前如何处理设计闭口。

   回答: 先读 project implementation ledger 和当前 boundary ledger 的正式版本;但本 Step 仍处于设计中间产物阶段,只定义候选 boundary 和 ledger 字段。真实 `implementation_execution_ledger.md` 与 `implementation-boundaries/<boundary_id>.md` 在 Step 7/11/12 补齐 gate 后、实现移交前创建。

7. 发现正式 `03/05/06/07` 与 boundary 表冲突时怎么办。

   回答: 暂停并回写设计真相源;不得把 boundary 表当成覆盖 `03/05/06` 的 schema、port、state、mapper、config 或 evidence 依据。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| Step 5 | 只有 phase,没有 commit boundary | 实现 agent 无法按可提交增量推进 | 本 Step 定义 candidate commit boundary |
| Step 4 | protocol / flow 数量大 | 单 phase 容易过大 | 按业务纵切和 protocol family 拆边界 |
| 台账规范 | 要求实施前有 project / boundary ledger | 当前尚无 boundary id 和 gate | 本 Step 定义 boundary id 与 ledger hook,不生成实例 |
| `05/06` | gate/evidence 在后续 Step 7/12 细化 | 当前 checks 只能给方向 | 本 Step 给 required checks seed,Step 7 精确映射 |
| 旧实现仓 | 当前 layout 属旧实现形态 | 首个代码 boundary 必须先处理 | commit-01-a 负责 layout migration |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 任务拆分 | 只有 PH-01~PH-11 | 每个 phase 有 candidate boundary | 可移交实现前继续细化 |
| 写入顺序 | 只知道纵切顺序 | 固定 contract -> domain -> application -> infra -> entry -> tests/evidence | 防止跳写实现 |
| 台账 | 只有规范路径 | 明确 ledger hook 和创建时机 | 防止现在自造真实执行台账 |
| 提交粒度 | 未定义 | 25 个候选 boundary | 支撑 review、rollback 和 evidence |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 每个 phase 一笔提交 | 文档短 | PH-03~PH-10 太大,无法 review | 不采用 |
| 每个 DTO / struct 一笔提交 | diff 小 | 不可独立验证业务能力 | 不采用 |
| 每个可验证纵切 1~3 个 boundary | review、test、rollback 均可控 | boundary 表较长 | 采用 |
| Step 6 直接生成真实 implementation ledger | 看似更快 | Step 7/11/12 gate 尚未闭合 | 不采用 |

## 7. 结构化中间产物

### 7.1 通用写入顺序

| 顺序 | 写入层 | 内容 | 不得越界 |
|---:|---|---|---|
| 1 | contracts | typed refs、metadata、safe marker、request/result/view/event/job shell、fixtures | 不写 domain truth 或 adapter |
| 2 | domain | truth object、state、policy、guard、domain error、unit tests | 不读 config、repository 或 runtime |
| 3 | application | ports、UoW、idempotency、service flow、mapper、application error | 不实现 concrete storage / transport |
| 4 | infra | in-memory/fake/controlled adapter、repository、runtime builder、config binding | 不新增未设计 port 或 truth |
| 5 | entry | api / worker / jobs runner,只调用 application facade | 不直连 repository / domain / adapter |
| 6 | tests/evidence | suite slice、script dry-run、artifact/report path | 不静态造 pass,不写 `latest` |

### 7.2 通用开工前设计闭环复核

| 复核项 | 适用条件 | 检查内容 | 失败处理 |
|---|---|---|---|
| 字段闭环 | 新增或修改 truth / state / material | 必填字段、reason、actor、time、version、marker 来源正式存在 | 暂停并回写 `03` |
| DTO 构造闭环 | 新增 command / query / event / job | request 能构造 service input, result / error surface 有正式字段 | 暂停并回写 `03` protocol |
| Port / repository 闭环 | application 需要读取或保存对象 | trait、输入、输出、version、UoW 语义正式存在 | 暂停并回写 `03` port / persistence |
| State / transition 闭环 | domain 状态变化 | state matrix、合法触发、非法分支、terminal guard 已定义 | 暂停并回写 `03` state |
| Idempotency / replay 闭环 | command / inbound / job 有 duplicate path | key、digest、stored result/receipt/report、UoW 顺序闭合 | 暂停并回写 `03` idempotency |
| Query surface 闭环 | 新增 query / view / page | empty/stale/degraded/unavailable/visibility/freshness 来源正式存在 | 暂停并回写 `03` query/material |
| Event / publisher 闭环 | 新增 candidate/outcome | candidate source、safe payload shell、publisher outcome、failure marker 闭合 | 暂停并回写 `03` event |
| Job report 闭环 | 新增 operations job | input scope、checkpoint、progress、stored report、partial issue 闭合 | 暂停并回写 `03` job |
| Config binding 闭环 | 新增 adapter/profile/script | config key/source/requiredness/degraded/unavailable 正式存在 | 暂停并回写 `04` |
| Evidence 闭环 | 生成 artifact/report | raw artifact schema、report path、EV/TC mapping、redaction rule 闭合 | 暂停并回写 `05/06` |
| Phase scope 闭环 | 每个 boundary | 不引用后续 phase 的 service/job/report/evidence 作为通过条件 | 调整 Step 6 |

### 7.3 通用提交门禁

| 门禁 | 执行动作 | 失败处理 |
|---|---|---|
| worktree gate | `git status --short` | 排除无关改动,不得提交用户未授权文件 |
| format gate | `cargo fmt --check` | 修正后重跑 |
| compile gate | 当前 boundary 影响 package 的 `cargo check` | 编译失败不得提交 |
| targeted test gate | 当前 boundary 所属 suite slice | 失败不得提交 |
| diff gate | `git diff --check` 和 staged diff review | 修正 whitespace / scope |
| design gate | 当前 boundary ledger required_reads 全部已读 | 缺读或冲突则暂停 |

### 7.4 Candidate Commit Boundary 总表

| Boundary | Phase | 一句话目标 | Allowed scope | Forbidden scope | Required checks seed |
|---|---|---|---|---|---|
| commit-01-a | PH-01 | 迁移 workspace layout 到七正式 crate | root Cargo、七 crate skeleton、package/crate naming、core path dependency | config profile、业务 DTO、domain/service | fmt;check;dependency-boundary seed |
| commit-01-b | PH-01 | 建立 config/script/artifact/report baseline | config skeleton、scripts shell、artifact/report dirs、path checks | 真实 evidence、业务 tests | fmt;check;script dry-run |
| commit-02-a | PH-02 | 建立 public contract foundation | refs、metadata、safe marker、shared shells、fixtures | 业务 accepted flow、infra adapter | contracts check;contract-domain-fast seed |
| commit-02-b | PH-02 | 建立 shared domain foundation 与 pure-domain test support | `crates/domain` shared error foundation;`DefinitionUseBoundaryGuard` / `DownstreamConsumptionBoundary` / `ConsistencyProtectionPolicy` / `RelationIntegrityRule` / `ExternalBodyBoundaryRule` pure policy shell;exact judgement state enums;focused pure-domain tests | business truth owner、`FormalizationEligibilityRule` / `PackageCompositionRule` full rule schema、application/service/UoW/idempotency、repository/adapter/runtime、artifact/report generator | domain check;domain tests |
| commit-02-c | PH-02 | 建立 application foundation ports/UoW/idempotency shell | application ports、UoW、idempotency/stored surface shell | concrete repository、业务 service | application check;unit tests |
| commit-03-a | PH-03 | 建立 method asset definition/catalog contracts/domain | definition/catalog DTO、domain object、state/policy | formalization、consumer、query API | contract-domain-fast slice |
| commit-03-b | PH-03 | 建立 definition/catalog accepted service vertical slice | service、repo fake、minimal API handler、UoW/stored result | formal version、publisher、job | service-flow-fast slice;infra fake slice |
| commit-04-a | PH-04 | 建立 formalization/version contracts/domain | formalization/version DTO、state guard、domain tests | consumption/distribution、events | contract-domain-fast formal slice |
| commit-04-b | PH-04 | 建立 formalization/version services and replay | services、idempotency stored result、version conflict/commit unknown | query/material、publisher/job | service-flow-fast formal slice |
| commit-05-a | PH-05 | 建立 controlled consumption material contracts/domain | consumption material、Definition vs Use guard、availability marker | actual downstream runtime | contract-domain-fast consumption slice |
| commit-05-b | PH-05 | 建立 distribution/handoff semantics services | distribution context、handoff shell、availability mapper/fake | worker publisher、real handoff delivery | service-flow-fast;infra-runtime-fake |
| commit-06-a | PH-06 | 建立 trace/audit/impact/lineage contracts/domain | trace material、audit trail、impact summary、lineage/evidence refs | external body、query projection | contract-domain-fast trace slice |
| commit-06-b | PH-06 | 建立 trace/audit/impact services and stores | application services、stores、refs-only tests | report generator、jobs | service-flow-fast;redaction targeted |
| commit-07-a | PH-07 | 建立 external summary/source/artifact boundary | external summary refs、source/artifact refs、body boundary adapter fake | provider body、archive lifecycle | contract-domain-fast external;redaction targeted |
| commit-07-b | PH-07 | 建立 package/method set peripheral shell | package/set DTO/domain/service、residual markers | marketplace transaction、advanced UX | service-flow-fast peripheral slice |
| commit-08-a | PH-08 | 建立 query/view DTO and read material ports | 57 query shells、view/page surfaces、material/repository ports | query service behavior | contracts check;query DTO tests |
| commit-08-b | PH-08 | 建立 core query services and read materials | definition/formalization/consumption queries、no-write tests | trace/external/peripheral query | service-flow-fast query core |
| commit-08-c | PH-08 | 建立 trace/external/peripheral query and projection surfaces | trace/audit/external/peripheral read surfaces、stale/degraded marker copy | refresh jobs、worker events | service-flow-fast query extended;infra-runtime-fake |
| commit-09-a | PH-09 | 建立 inbound consumer intake/receipt | 4 consumer envelopes、receipt store、dedup replay、source adapter fake | core truth mutation from inbound | entry-worker-job inbound slice |
| commit-09-b | PH-09 | 建立 outbound event candidate and publisher worker | 34 event candidate/outcome、publisher fake、worker runner | operations jobs、real transport | entry-worker-job outbound slice;redaction |
| commit-10-a | PH-10 | 建立 job protocol/checkpoint/report foundation | 8 job input/report/progress/checkpoint DTO、ports | job body implementation | contracts check;job DTO tests |
| commit-10-b | PH-10 | 建立 read material refresh job family | catalog/formal/consumption/relation/external/trace/peripheral refresh jobs | consistency recovery | operations-replay-core slice |
| commit-10-c | PH-10 | 建立 recovery/replay/handoff job behavior | recovery convergence、partial issue、stored report replay、handoff/export seam | release evidence verdict | operations-replay-core;entry-worker-job job slice |
| commit-11-a | PH-11 | 建立 report generator and evidence index | report scripts、evidence-index、summary/gate summary、report audit | acceptance signoff | report-generation-audit;redaction/dependency |
| commit-11-b | PH-11 | 建立 release smoke and acceptance handoff shell | release-main-smoke、handoff、veto checklist、risk/open issues shell | final human verdict | release-main-smoke;VETO checklist dry-run |

### 7.5 Phase 写入顺序摘要

| Phase | Boundary 顺序 | 阶段完成判定 |
|---|---|---|
| PH-01 | commit-01-a -> commit-01-b | 正式 layout、config/script/artifact/report baseline 可运行 |
| PH-02 | commit-02-a -> commit-02-b -> commit-02-c | contract/domain/application foundation 可编译可测 |
| PH-03 | commit-03-a -> commit-03-b | definition/catalog truth accepted vertical slice 成立 |
| PH-04 | commit-04-a -> commit-04-b | formalization/version state/replay 成立 |
| PH-05 | commit-05-a -> commit-05-b | controlled consumption/distribution/handoff semantics 成立 |
| PH-06 | commit-06-a -> commit-06-b | trace/audit/impact/lineage refs-only 成立 |
| PH-07 | commit-07-a -> commit-07-b | external summary body-free 和 peripheral residual boundary 成立 |
| PH-08 | commit-08-a -> commit-08-b -> commit-08-c | 57 Query 和 read material no-write surface 成立 |
| PH-09 | commit-09-a -> commit-09-b | inbound/outbound worker 不修 truth 且可 replay |
| PH-10 | commit-10-a -> commit-10-b -> commit-10-c | operations jobs no truth repair、checkpoint、report replay 成立 |
| PH-11 | commit-11-a -> commit-11-b | run-scoped report/evidence/handoff shell 成立 |

### 7.6 Boundary Ledger Hook

| Ledger 字段 | 本 Step 定义方式 | 后续 Step 承接 |
|---|---|---|
| boundary_id | 使用 `commit-xx-y` | Step 7 绑定 TC / suite / EV;Step 11 绑定 commit message |
| current_design_baseline | 暂留 `<design-commit>` | Step 12 / Step 13 固定 |
| required_reads | 本 Step 给 phase / boundary 来源方向 | Step 7/8/11 细化到正式章节和 calibration 文件 |
| allowed_scope | 本 Step 给 candidate allowed scope | Step 13 装配正式 §6 |
| forbidden_scope | 本 Step 给 candidate forbidden scope | Step 7/11 增加 gate 与 review 条款 |
| required_checks | 本 Step 给 seed | Step 7 精确到 suite/report |
| Commit Gate | 本 Step 给通用门禁 | Step 11 固定提交纪律 |
| Handoff Gate | 本 Step 只定义必须存在 | Step 12 固定完成判定 |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“通用写入顺序”“通用开工前设计闭环复核”“Candidate Commit Boundary 总表”“Phase 写入顺序摘要”和“Boundary Ledger Hook”小节。

正式 `07-实施计划.md` §6 后续应回填:

本轮实施按 Step 5 的 PH-01~PH-11 拆分为候选 commit boundary。每个 boundary 必须具备一句话目标、allowed scope、forbidden scope、required checks、required reads、Commit Gate 和 Handoff Gate。写入顺序固定为 contracts -> domain -> application -> infra -> entry -> tests/evidence,不得跳过 public contract 和 domain truth 直接写 service、adapter、query、worker 或 job。

候选边界从 `commit-01-a` 到 `commit-11-b`。PH-01 处理 workspace layout、config/script/artifact/report baseline;PH-02 建 contract/domain/application foundation;PH-03~PH-07 建 core truth、formalization、consumption、trace、external/peripheral;PH-08 建 query/read material;PH-09 建 inbound/outbound worker;PH-10 建 operations jobs;PH-11 建 release evidence 和 acceptance handoff shell。

本 Step 只定义候选 boundary 和台账承接口径,不创建真实 implementation ledger 或 boundary ledger 实例。真实 project implementation ledger 和 `implementation-boundaries/<boundary_id>.md` 必须在 Step 7/11/12 补齐 gate、review 和 completion criteria 后,于实现移交前创建。

## 9. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 25 个 candidate boundary 是否需要合并或拆细 | 影响实施节奏 | Step 7 绑定 suite 后再校准 |
| commit-08 Query 是否仍过大 | 影响 query phase review | Step 7 按 TC family 再切 suite |
| commit-10 jobs 是否需要按 job family 再拆 | 影响 operations replay evidence | Step 7/11 根据 tests 和 commit size 校准 |
| implementation ledger 实例创建时点 | 影响实现移交 | 本 Step 不创建;Step 7/11/12 后创建 |
| old implementation layout 如何迁移 | 影响 commit-01-a allowed scope | 实现移交前按目标仓实际状态审计 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| Step 5 已确认 | 通过 | 用户已确认 |
| 通用写入顺序已定义 | 通过 | contracts -> domain -> application -> infra -> entry -> tests/evidence |
| 通用设计闭环复核已定义 | 通过 | schema/DTO/port/state/idempotency/query/event/job/config/evidence/scope |
| candidate commit boundary 已定义 | 通过 | commit-01-a 到 commit-11-b |
| 台账承接口径已定义 | 通过 | 仅定义 hook,不创建真实 ledger 实例 |
| 未修改正式 `07` 或实现仓 | 通过 | 本 Step 只写设计中间产物 |
| 可进入 R6.2 / Step 7 | 通过 | 用户已确认,允许进入 Step 7 |

## 11. R6.2 用户确认记录

| 项 | 状态 |
|---|---|
| 用户确认 | 已确认 |
| 确认内容 | Step 6 通用写入顺序、设计闭环复核、候选 commit boundary、phase 写入顺序和 boundary ledger hook |
| 后续动作 | 进入 Step 7 `R7.1 test and acceptance gates:先思考` |
