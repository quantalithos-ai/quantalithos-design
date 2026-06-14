# Step 12. 定义实施完成判定

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 12
> 回填章节: `07-实施计划.md` §12 实施完成判定

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 12 定义实施完成判定 |
| 当前状态 | 已完成,按用户授权自动进入后续 Step |
| 输入基线 | Step 1~11 中间产物、正式 `06-验收标准.md`、可落码性标准 §9.1 |
| 输出文件 | `projects/L1-identity/design-calibration/07_implementation_plan_step_12_done_criteria.md` |
| 正式文档状态 | 本 Step 不修改正式 `07-实施计划.md` |
| 停审方式 | 每个模块先思考、再写入、再局部停审;全部模块完成后做实施完成、交付实现、验收就绪和未完成项分类审计 |

## 2. 本步目标

本 Step 定义什么时候可以宣称 L1-identity 本轮实施完成,以及哪些情况必须转为 blocker、延期项、风险接受或不通过。

本 Step 只回答:

- 本轮需求覆盖、交付物、phase / commit boundary、测试门禁和验收门禁如何判定完成。
- 未完成项如何分类为 blocker、deferred、residual 或 risk acceptance。
- 交付实现前是否必须按 phase / commit boundary 对 `03/05/06/07` 做整体可落码闭环审计。
- `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance/*`、`reports/review/*` 如何成为完成证据。
- 什么情况下可以移交实现 agent,什么情况下可以进入验收,什么情况下必须暂停。
- 为什么不能使用“基本完成”、口头证据、手写 pass、`latest` 或 raw artifact 替代 report。

本 Step 不裁决真实实现是否已经完成,不生成验收结论,不新增 TC、EV、AC、VETO、artifact schema、phase、commit boundary、schema、port、状态或实现任务。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `实施计划讨论流程_SOP.md` Step 12 | 当前标准 | 提供完成判定、未完成项和交付证据问题清单 |
| `实施计划书写规范.md` §5.12 | 当前标准 | 提供完成判定表最小格式和禁止“基本完成”规则 |
| `设计真相源闭环与可落码性标准.md` §9.1 | 当前标准 | 提供交付实现前整体可落码审计门禁 |
| `07_implementation_plan_step_01_input_boundary.md` | 已完成 | 提供输入基线和旧 `07` 历史诊断处理 |
| `07_implementation_plan_step_02_scope.md` | 已完成 | 提供 P0/P1/P2 范围、非范围和 VETO 边界 |
| `07_implementation_plan_step_03_prerequisites_reading.md` | 已完成 | 提供阅读清单、永久记忆种子和实现交付前审计种子 |
| `07_implementation_plan_step_04_deliverables.md` | 已完成 | 提供代码、测试、脚本、报告、文档交付物清单 |
| `07_implementation_plan_step_05_phases_dependencies.md` | 已完成 | 提供 PH-01~PH-08 阶段顺序和完成门禁 |
| `07_implementation_plan_step_06_tasks_commit_boundaries.md` | 已完成 | 提供 commit-01-a 到 commit-08-c 的边界和经验复核 |
| `07_implementation_plan_step_07_test_acceptance_gates.md` | 已完成 | 提供 GATE-01~12、artifact/report、AC/VETO 映射 |
| `07_implementation_plan_step_08_config_environment.md` | 已完成 | 提供 profile、adapter、依赖和 artifact/report root 准备 |
| `07_implementation_plan_step_09_spikes_risks.md` | 已完成 | 提供 blocker、spike、deferred、residual 和待确认事项 |
| `07_implementation_plan_step_10_rollback_change_control.md` | 已完成 | 提供 pause、rollback、change、resume 和禁止补口规则 |
| `07_implementation_plan_step_11_commit_review_delivery.md` | 已完成 | 提供提交、评审、交付和经验总结纪律 |
| `06-验收标准.md` | 已审核通过 | 提供 P0 blocking suite、VETO、风险接受、退出条件和最终三值结论规则 |

## 4. 模块计划 / 模块目录

| 模块 | 目标 | 输入 | 输出 | 停审门禁 |
|---|---|---|---|---|
| M1 Step 12 规则与边界 | 固定完成判定不能替代真实验收结论 | SOP Step 12、书写规范 §5.12 | 规则边界 | 不写“基本完成”或真实 pass |
| M2 需求 / 范围 / 交付物完成判定 | 定义 P0 范围、非范围和交付物完成标准 | Step 2、Step 4、`06` §2 | 完成判定表 | P1/P2 不替代 P0 |
| M3 Phase / commit boundary 完成判定 | 定义 PH-01~PH-08 和 commit-01-a~08-c 全完成标准 | Step 5、Step 6、Step 11 | boundary completion 表 | 每个 boundary 有提交、门禁、证据 |
| M4 测试 / 验收 / evidence 完成判定 | 定义 GATE、artifact/report、VETO、risk acceptance 的完成标准 | Step 7、`06` §3~§14 | evidence completion 表 | raw artifact 不替代 report |
| M5 交付实现前可落码闭环审计 | 固定移交实现前整体审计表 | 标准 §9.1、Step 6、Step 10 | boundary audit 表 | 每个 boundary 覆盖 `03/05/06/07` |
| M6 未完成项处理 | 定义 blocker、deferred、residual、risk acceptance 分类 | Step 9、Step 10、`06` §12~§13 | 未完成项处理表 | VETO/S/P0 红线不可风险接受 |
| M7 handoff readiness and acceptance readiness | 定义实现移交就绪和验收就绪 | Step 11、`06` §4、§14 | readiness 表 | design baseline 未固定不得移交 |
| M8 stop condition and final decision wording | 固定不得宣称完成的条件和允许用语 | Step 10、`06` §14 | stop condition 表 | 只允许通过 / 有条件通过 / 不通过用于验收 |
| M9 cross-step completion audit | 审计 Step 1~12 是否可进入 Step 13 | M1~M8 | 回填草稿、待确认事项、进入下一步条件 | 无 unresolved 完成判定缺口 |

### 4.1 模块思考与写入记录

| 模块 | 思考重点 | 写入位置 | 局部停审结论 |
|---|---|---|---|
| M1 | Step 12 是“完成判定规则”,不是实际验收结论 | §9.1 | 通过 |
| M2 | P0 范围和交付物必须完整;P1/P2 只能 residual | §9.2~§9.3 | 通过 |
| M3 | 完成必须逐 phase / commit boundary 可审查 | §9.4~§9.5 | 通过 |
| M4 | evidence 必须 raw artifact + run report + acceptance review 配对 | §9.6 | 通过 |
| M5 | 移交实现前整体审计是强门禁,不是实现 agent 现场补洞 | §9.7 | 通过 |
| M6 | 未完成项必须分类;VETO/S/P0 红线不得风险接受 | §9.8 | 通过 |
| M7 | 实现移交和验收就绪是两级 readiness,不能混用 | §9.9 | 通过 |
| M8 | 禁止“基本完成”;失败条件必须直接阻断 | §9.10 | 通过 |
| M9 | Step 12 可进入 Step 13 正式装配 | §9.11~§13 | 通过 |

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本轮需求覆盖如何判定? | P0 范围内 C-ID、FR-ID、BR-ID、NFR-ID、AC-ID 和 VETO-ID 均有实现 boundary、测试门禁和证据入口;P1/P2 不得替代 P0。 |
| 交付物是否全部完成如何判定? | Step 4 的代码、测试、脚本、报告、文档交付物均对应到 Step 6 boundary 和 Step 7 GATE,且提交和证据路径可审查。 |
| 测试门禁和验收门禁是否全部通过如何判定? | GATE-01~12 对应 raw artifact 和 run report 均存在且通过;`reports/acceptance/*` 已审查;若有条件通过,必须有完整 risk acceptance。 |
| 风险、Spike 和待确认事项如何关闭? | blocker 必须修复并回写真相源;spike 必须有结论;deferred / residual 必须有 owner、影响、后续动作和是否影响 P0 的说明。 |
| 是否存在一票否决项如何判定? | `reports/acceptance/veto-checklist.md` 必须覆盖 `VETO-ID-001~006`;任一触发或不可裁决均不得通过或风险接受。 |
| 未完成项如何进入延期、风险接受或 blocker? | 命中 P0/VETO/S/evidence integrity 的未完成项只能 blocker;非 P0 或已证明不影响 P0 的项可 deferred / residual / risk acceptance。 |
| `reports/runs/<run_id>` 是否必须从 `artifacts/test/<run_id>` 生成? | 是。run report 必须能回指 raw artifact;不得用手写 pass 或 raw artifact 单独替代 report。 |
| `reports/acceptance/handoff.md`、`veto-checklist.md` 和 `risk-acceptance.md` 是否必须审查? | 是。脚本初稿不能替代人 / Agent 审查;有条件通过时 `risk-acceptance.md` 必须完整。 |
| artifact / report 是否需要 redaction 和 link 检查? | 是。redaction、dependency、artifact/report pairing、no static evidence 和 link integrity 均是完成判定输入。 |
| 是否仍可存在字段、DTO、状态、命名或 phase boundary 冲突? | 不可。任何未关闭冲突都阻断移交实现或实施完成判定。 |
| 是否需要交付实现前可落码闭环审计? | 必须。按 phase / commit boundary 对正式 `03/05/06/07` 和必要校准文件做整体审计,未通过先回写设计真相源。 |

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 1 | 输入文档部分仍有 Draft 元信息风险 | 本 Step 要求移交实现前固定 design baseline |
| Step 4 | 交付物已列,但完成判定尚未统一 | 本 Step 汇总成 §9.3 交付物完成表 |
| Step 6 | boundary 已完成设计阶段复核,但移交实现前还需要整体审计 | 本 Step 写 §9.7 |
| Step 7 | gate 路径已列,但不能自动等同真实完成 | 本 Step 要求真实 run-scoped evidence |
| Step 9 | blocker / residual 已分类,但完成前处理方式需固定 | 本 Step 写 §9.8 |
| Step 11 | 提交与交付纪律已有,但完成判定需检查真实提交和报告 | 本 Step 写 §9.4~§9.6 |
| `06` | 验收结论是三值裁决,不能被实施计划提前宣称 | 本 Step 只写 readiness,最终结论仍归 `06` |

## 7. 改动前后对比

| 议题 | Step 12 前 | Step 12 后 | 作用 |
|---|---|---|---|
| 完成用语 | 有 phase / gate / commit 规则,但缺最终完成判定 | 禁止“基本完成”;必须证据化判定 | 防止模糊交付 |
| 交付实现 | 只有 boundary 复核 | 增加整体可落码闭环审计 | 减少实现阶段被动 blocker |
| 验收就绪 | Step 7 有 gate,`06` 有验收出口 | 两级 readiness:实现移交就绪与验收就绪 | 防止把实现完成当验收通过 |
| 未完成项 | Step 9 分类风险 | 完成前必须转 blocker/deferred/residual/risk acceptance | 防止遗留项悬空 |
| evidence | Step 7 写路径 | Step 12 要求 raw artifact、report、acceptance review 配对 | 防止静态 pass |

## 8. 设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否允许“基本完成” | A. 允许;B. 禁止 | 采用 B。完成判定必须可审查。 |
| 实施完成是否等于验收通过 | A. 等同;B. 不等同 | 采用 B。实施完成是进入验收或移交的条件,最终结论仍按 `06` 裁决。 |
| 是否用 raw artifact 替代 report | A. 可以;B. 不可以 | 采用 B。raw artifact 与 run report 必须配对。 |
| 是否把 unresolved P1/P2 当 blocker | A. 全部 blocker;B. 按 P0 影响分类 | 采用 B。P1/P2 可 residual,但不得证明 P0 pass。 |
| 实现移交前是否只引用可落码标准 | A. 只引用;B. 逐 boundary 审计 | 采用 B。标准存在不等于项目文档已符合标准。 |

## 9. 结构化中间产物

### 9.1 完成判定原则

| 原则 | 要求 | 失败处理 |
|---|---|---|
| 不使用“基本完成” | 结论必须是通过 / 不通过 / 不适用 / 有条件通过候选 | 改写为可证据化结论 |
| 完成必须有证据 | 每个判定项必须有 report、artifact、review note 或 design baseline | 缺证据则不通过 |
| 实施完成不替代验收 | 实施完成只说明可移交 / 可送验;最终通过由 `06` §14 裁决 | 不得在 `07` 提前宣称验收通过 |
| 未完成项必须分类 | blocker、deferred、residual、risk acceptance 均需 owner 和处理方式 | 未分类则阻断 |
| 红线不可接受 | VETO/S/P0 evidence integrity/redaction/dependency/query no-write/job no-repair/stored replay 失败不得风险接受 | 直接 blocker / 不通过 |
| baseline 必须固定 | design baseline、source commit、run_id、config digest 必须可定位 | 不得移交实现或送验 |

### 9.2 实施完成判定表

| 判定项 | 标准 | 证据 | 结论 |
|---|---|---|---|
| 需求覆盖 | P0 C-ID / FR-ID / BR-ID / NFR-ID / AC-ID / VETO-ID 均由 boundary、gate 和 evidence 覆盖 | Step 2、Step 6、Step 7、`06` §2 / §5~§11 | 通过 |
| 范围边界 | P1/P2、真实产品、UI、production capacity、selected-run 不替代 P0 | Step 2、Step 8、Step 9、`06` §2 / §13 | 通过 |
| 交付物 | Step 4 代码、测试、脚本、报告、文档交付物均映射到 boundary | Step 4、Step 6、Step 7 | 通过 |
| phase 完成 | PH-01~PH-08 均有可验证增量、依赖、门禁和停审 | Step 5、Step 6、Step 7 | 通过 |
| commit boundary 完成 | commit-01-a 到 commit-08-c 均有 included/excluded、BATCH、gate、body 分组和提交纪律 | Step 6、Step 7、Step 11 | 通过 |
| 测试门禁 | GATE-01~12 均绑定正式 suite/check、TC/EV、report path 和失败处理 | Step 7、`05`、`06` | 通过 |
| 验收门禁 | AC/VETO、risk acceptance 和最终结论规则均由 `06` 裁决 | `06` §5~§14 | 通过 |
| 设计变更控制 | blocker 需 pause、回写真相源、固定 baseline、重审 boundary | Step 9、Step 10、标准 §9 | 通过 |
| 提交与交付纪律 | git config、scope、body 分组、footer、artifact/report 引用规则完整 | Step 11 | 通过 |

### 9.3 最终交付清单

| 交付物类型 | 完成标准 | 证据 | 结论 |
|---|---|---|---|
| 代码交付物 | workspace、contracts、domain、application、infra、api、worker、jobs 按 PH-01~PH-08 完成 | Step 4、Step 6、实现仓 diff / commit | 规则已定义 |
| 测试交付物 | P0 suite、targeted tests、negative tests、fake parity 和 write-audit 可运行并出报告 | Step 7、`reports/runs/<run_id>` | 规则已定义 |
| 脚本交付物 | gate/report/check/dev scripts 支持 run-scoped artifact/report | Step 4、Step 7、commit-08-b | 规则已定义 |
| 报告交付物 | suite report、gate summary、evidence index、report audit、redaction/dependency report 完整 | Step 7、Step 11、`06` §3 / §10 | 规则已定义 |
| 验收交付物 | handoff、veto checklist、risk acceptance、open issues / review notes 已审查 | Step 7、Step 11、`06` §4 / §13 / §14 | 规则已定义 |
| 文档交付物 | 正式 `07` 装配完成,引用 Step 1~12 中间产物 | Step 13 | 待 Step 13 |

### 9.4 Phase 完成判定表

| Phase | 完成标准 | 证据 | 完成判定 |
|---|---|---|---|
| PH-01 | workspace / dependency / skeleton 编译和依赖边界 clean | commit-01-a、GATE-01 report | 实现后判定 |
| PH-02 | contracts / domain / state foundation 通过 contract-domain-fast 和 redaction 相关检查 | commit-02-a~c、GATE-02/10 report | 实现后判定 |
| PH-03 | application ports、fake runtime、stored replay 和 fake parity 通过 | commit-03-a~c、GATE-03 report | 实现后判定 |
| PH-04 | 6 Command 写链 accepted/rejected/duplicate/conflict 和 redaction 通过 | commit-04-a~c、GATE-04/10 report | 实现后判定 |
| PH-05 | 14 Query visibility-first、no-write、degraded/stale/missing 通过 | commit-05-a~c、GATE-05 report | 实现后判定 |
| PH-06 | inbound/callback receipt replay、missing no-create、outbound accepted-only material 通过 | commit-06-a~c、GATE-06/07/10 report | 实现后判定 |
| PH-07 | job report replay、maintenance no-repair、propagation retry/terminal guard 通过 | commit-07-a~c、GATE-07/08 report | 实现后判定 |
| PH-08 | entry/config/scripts/evidence/release smoke 和 acceptance handoff 通过 | commit-08-a~c、GATE-09/10/11/12 report | 实现后判定 |

### 9.5 Commit boundary 完成判定表

| Commit boundary | 完成标准 | 必需证据 | 未满足时 |
|---|---|---|---|
| commit-01-a | skeleton、manifest、entry、dependency scan 完成 | GATE-01 | blocker |
| commit-02-a | contracts shell 与 body-free schema clean | GATE-02/10 | blocker |
| commit-02-b | core domain truth / policy / invariant 通过 | GATE-02 | blocker |
| commit-02-c | support state / outbox / handoff / replay state 通过 | GATE-02/10 | blocker |
| commit-03-a | context/id/clock/cursor/mapper helper 通过 | GATE-03 subset | blocker |
| commit-03-b | formal ports + fake runtime skeleton parity 通过 | GATE-03/09 | blocker |
| commit-03-c | idempotency and stored replay no-rerun 通过 | GATE-03 | blocker |
| commit-04-a | member/lifecycle command vertical slice 通过 | GATE-04/03 | blocker |
| commit-04-b | role/career/memory command vertical slice 通过 | GATE-04/10 | blocker |
| commit-04-c | trace handoff command and command effect audit 通过 | GATE-04/10/03 | blocker |
| commit-05-a | query foundation no-write and stable lookup 通过 | GATE-05/03 | blocker |
| commit-05-b | core/member/trace/audit query family 通过 | GATE-05/10 | blocker |
| commit-05-c | operations read no mutation 通过 | GATE-05/07/08 subset | blocker |
| commit-06-a | consumer context and receipt replay scaffold 通过 | GATE-06/03 | blocker |
| commit-06-b | 5 consumer/callback mutation flows 通过 | GATE-06/10/03 | blocker |
| commit-06-c | 10 outbound accepted material body-free 通过 | GATE-07/10 | blocker |
| commit-07-a | job report and stored replay foundation 通过 | GATE-08/03 | blocker |
| commit-07-b | rebuild/refresh/reconciliation maintenance no-repair 通过 | GATE-08/05 | blocker |
| commit-07-c | publish/deliver/retry propagation guard 通过 | GATE-07/08/10 | blocker |
| commit-08-a | entry/runtime config/dependency redline 通过 | GATE-09/01/06/08 | blocker |
| commit-08-b | gate/report/check scripts and artifact/report writer 通过 | GATE-11/10 | blocker |
| commit-08-c | release smoke、evidence index、handoff、veto checklist 通过 | GATE-12/11/10/01/09 | blocker 或 risk acceptance,按 `06` §13 |

### 9.6 交付证据项检查表

| 交付证据项 | 固定路径 | 完成标准 | 结论 |
|---|---|---|---|
| raw artifacts | `artifacts/test/<run_id>` | P0 suite 原始证据完整,含失败 / partial 记录 | 实现后判定 |
| suite reports | `reports/runs/<run_id>/suites/<suite>.md` | 每个 P0 suite report 可回指 raw artifact | 实现后判定 |
| gate summary | `reports/runs/<run_id>/gate-summary.md` | 汇总 GATE-01~12 结果和 run baseline | 实现后判定 |
| evidence index | `reports/runs/<run_id>/evidence-index.md` | EV / TC / artifact / report / AC / VETO 回指完整 | 实现后判定 |
| dependency report | `reports/runs/<run_id>/dependency-boundary.md` | dependency boundary clean | 实现后判定 |
| redaction report | `reports/runs/<run_id>/redaction-check.md` | forbidden material clean | 实现后判定 |
| report audit | `reports/runs/<run_id>/report-audit.md` | raw artifact/report pairing、no static evidence clean | 实现后判定 |
| acceptance handoff | `reports/acceptance/handoff.md` | 已人 / Agent 审查,绑定 fixed run_id | 实现后判定 |
| veto checklist | `reports/acceptance/veto-checklist.md` | `VETO-ID-001~006` 全部有证据且未触发 | 实现后判定 |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | 有条件通过时完整;无风险时不适用 | 实现后判定 |
| review notes | `reports/review/<run_id>-*.md` | 人 / Agent 审查结论和缺口记录 | 实现后判定 |

### 9.7 交付实现前可落码闭环审计表

| Phase / commit boundary | 复核范围 `03/05/06/07` | 适用标准项 | 结论 | blocker | 修复 baseline |
|---|---|---|---|---|---|
| PH-01 / commit-01-a | file layout、module contracts、dependency boundary、GATE-01 | path/dependency boundary;phase boundary | 通过 | 无 | 不适用 |
| PH-02 / commit-02-a | object/protocol contracts、contract suite、redaction | 字段闭环;DTO 构造闭环;body-free schema | 通过 | 无 | 不适用 |
| PH-02 / commit-02-b | domain truth、policy、state matrix、domain tests | 状态闭环;validation truth | 通过 | 无 | 不适用 |
| PH-02 / commit-02-c | support states、outbox/handoff/replay/job state | 状态闭环;terminal guard;public surface | 通过 | 无 | 不适用 |
| PH-03 / commit-03-a | application helper、context、id/clock/cursor、mapper | accepted subject identity;cursor source;operation context | 通过 | 无 | 不适用 |
| PH-03 / commit-03-b | formal ports、fake runtime、adapter outcome | fake parity;adapter outcome;config binding | 通过 | 无 | 不适用 |
| PH-03 / commit-03-c | idempotency、stored result/receipt/report replay | idempotency reserve context;stored replay typed surface | 通过 | 无 | 不适用 |
| PH-04 / commit-04-a | member/lifecycle command flows | command DTO;state transition;same-UoW;duplicate replay | 通过 | 无 | 不适用 |
| PH-04 / commit-04-b | role/career/memory command flows | body-free summary;sidecar version;append-only | 通过 | 无 | 不适用 |
| PH-04 / commit-04-c | trace handoff command and side-effect inventory | handoff marker;accepted side-effect inventory;stored result | 通过 | 无 | 不适用 |
| PH-05 / commit-05-a | visibility、projection lookup、read model helper | query visibility;projection-backed lookup;query no-write | 通过 | 无 | 不适用 |
| PH-05 / commit-05-b | core/member/trace/audit query family | read subject/scope;redaction;not-visible semantics | 通过 | 无 | 不适用 |
| PH-05 / commit-05-c | operations read queries | no repair;degraded/stale/missing priority;report/outbox read | 通过 | 无 | 不适用 |
| PH-06 / commit-06-a | inbound/callback envelope、receipt replay | typed receipt save/get;entry context;idempotency channel | 通过 | 无 | 不适用 |
| PH-06 / commit-06-b | consumer/callback mutation flows | reference marker;sidecar version;missing no-create | 通过 | 无 | 不适用 |
| PH-06 / commit-06-c | outbound accepted material | accepted-only;payload marker;body-free outbox | 通过 | 无 | 不适用 |
| PH-07 / commit-07-a | job request/report/stored replay | public job surface;stored job report replay | 通过 | 无 | 不适用 |
| PH-07 / commit-07-b | rebuild/refresh/reconciliation | projection source;reference version;job no-repair | 通过 | 无 | 不适用 |
| PH-07 / commit-07-c | publish/deliver/retry propagation | publisher outcome;terminal retry;body-free recovery | 通过 | 无 | 不适用 |
| PH-08 / commit-08-a | entry/runtime config/dependency | entry facade;runtime config;adapter availability | 通过 | 无 | 不适用 |
| PH-08 / commit-08-b | scripts/artifact/report writer | machine artifact schema;path baseline;no static evidence | 通过 | 无 | 不适用 |
| PH-08 / commit-08-c | release/evidence/acceptance handoff | evidence integrity;VETO checklist;P1/P2 no P0 pollution | 通过 | 无 | 不适用 |

本表是设计阶段交付实现前审计模板和当前规划审计结果。实现移交前必须用固定 design baseline 和最新正式 `07` 重跑一次,并记录 baseline / commit。

### 9.8 未完成项处理表

| 未完成项类型 | 可否完成判定通过 | 处理方式 | 示例 |
|---|---|---|---|
| P0 blocker | 否 | 修复、回写真相源、复跑门禁 | schema/port/state/evidence 缺口 |
| VETO 命中 | 否 | 修复并复验;不得风险接受 | ref reuse、query implicit create、forbidden body |
| S 级缺陷 | 否 | 修复并复验;不得风险接受 | evidence integrity、redaction、dependency fail |
| 未关闭 A 级缺陷 | 通常否;满足 `06` §13 才可有条件 | risk acceptance,替代 evidence,owner,deadline | P0 语义未破坏的测试工具缺陷 |
| B 级缺陷 | 可通过或有条件 | open issue / residual 记录 | 报告可读性非阻断问题 |
| P1/P2 selected-run 缺失 | 可通过 P0 | residual / deferred | 真实产品端到端未跑 |
| 生产容量 / advanced UI | 可通过 P0 | backlog / residual | production-like capacity 未硬化 |
| report/review 文案缺陷 | 视影响 | 修文案或记录条件 | 不影响 raw evidence 的清晰度问题 |

### 9.9 Readiness 判定表

| Readiness | 必须满足 | 不满足时 |
|---|---|---|
| design ready for formal assembly | Step 1~12 中间产物均完成;无旧口径残留;正式 `07` 尚未提前改写 | 暂停 Step 13 |
| ready for implementation handoff | 正式 `07` 已装配;design baseline 固定;§9.7 审计重跑通过;永久记忆种子可生成 | 不得移交实现 |
| ready for commit | 当前 boundary 实现完成;Step 11 提交纪律通过;对应 gate/report 通过 | 不得提交 |
| ready for acceptance | PH-01~PH-08 完成;GATE-01~12 artifact/report 完整;handoff/veto/risk 已审查 | 不得进入最终裁决 |
| ready for final signoff | `06` §14 三值结论可裁决;签署表完整 | 不得关闭为 passed |

### 9.10 Stop condition 表

| Stop condition | 影响 | 处理 |
|---|---|---|
| 使用“基本完成”或无证据完成描述 | 完成判定无效 | 改为具体判定项 + 证据 |
| 未固定 design baseline | 不得移交实现 | 固定 baseline 后重审 |
| Step 13 前修改正式 `07` 且未记录装配来源 | 正式文档不可追溯 | 回到 Step 13 装配流程 |
| `03/04/05/06` 与 `07` boundary 冲突 | 不得实现 / 不得完成 | 回写冲突真相源并重审 |
| raw artifact 缺 report | 不得提交 / 送验 | 生成 run report 并通过 report audit |
| acceptance report 未审查 | 不得 final signoff | 人 / Agent 审查补充 |
| `latest` 被用作证据 | 证据无效 | 改为固定 `<run_id>` |
| VETO/S/P0 红线未关闭 | 总体不通过 | 修复并复验 |
| query/job/consumer 越权写 truth | 总体不通过 | 修复 no-write/no-repair/no-create |
| 设计修复后未做经验检查 | 后序任务未完成 | 执行 Step 11 §9.12 |

### 9.11 跨 Step 完成审计表

| Step | 输出 | 完成判定 | 缺口 |
|---|---|---|---|
| Step 1 | 输入边界 | 已完成 | 无 |
| Step 2 | 范围 / 非范围 | 已完成 | 无 |
| Step 3 | 前置条件 / 阅读清单 | 已完成 | 无 |
| Step 4 | 交付物 | 已完成 | 无 |
| Step 5 | phases / dependency | 已完成 | 无 |
| Step 6 | tasks / commit boundaries | 已完成 | 无 |
| Step 7 | test / acceptance gates | 已完成 | 无 |
| Step 8 | config / environment | 已完成 | 无 |
| Step 9 | spikes / risks | 已完成 | 无 |
| Step 10 | rollback / change control | 已完成 | 无 |
| Step 11 | commit / review / delivery | 已完成 | 无 |
| Step 12 | done criteria | 已完成 | 无 |

## 10. 对上游 / 下游文档的影响判定

| 文档 | 是否需要回写 | 理由 | 处理 |
|---|---|---|---|
| `03-详细设计.md` | 否 | 本 Step 不改变 object、state、port、flow 或 persistence | 无需回写 |
| `04-配置设计.md` | 否 | 本 Step 不新增 config key、profile 或 loader 规则 | 无需回写 |
| `05-测试方案.md` | 否 | 本 Step 不新增 TC、EV、suite、artifact JSON 字段或 report schema | 无需回写 |
| `06-验收标准.md` | 否 | 本 Step 只承接既有退出、VETO、risk acceptance 和最终结论规则 | 无需回写 |
| `07-实施计划.md` | 是 | Step 13 需装配 §12 正式完成判定 | 等 Step 13 装配 |
| `设计真相源闭环与可落码性标准.md` | 否 | 本 Step 已覆盖整体审计规则,未发现新增可复用经验 | 无需回写 |

## 11. 回填草稿

> 回填目标: `07-实施计划.md` §12 实施完成判定。

草稿:

````markdown
## 12. 实施完成判定

不得使用“基本完成”。实施完成必须逐项给出标准、证据和结论。实施完成不等于验收通过;最终结论仍按 `06-验收标准.md` §14 的 `通过 / 有条件通过 / 不通过` 裁决。

| 判定项 | 标准 | 证据 | 结论 |
|---|---|---|---|
| 需求覆盖 | P0 C-ID / FR-ID / BR-ID / NFR-ID / AC-ID / VETO-ID 均由 boundary、gate 和 evidence 覆盖 | §2、§6、§7、`06` §5~§11 | 通过 / 不通过 |
| 交付物 | 代码、测试、脚本、报告、文档交付物均完成并可回指 commit boundary | §4、§6、§7、提交记录 | 通过 / 不通过 |
| 测试门禁 | GATE-01~12 均通过或有正式不通过结论 | `reports/runs/<run_id>` | 通过 / 不通过 |
| 验收门禁 | AC/VETO、risk acceptance 和最终裁决材料完整 | `reports/acceptance/*`、`06` §14 | 通过 / 有条件通过 / 不通过 |
| 可落码闭环 | 已按 phase / commit boundary 对正式 `03/05/06/07` 执行整体审计 | 本章审计表 | 通过 / 不通过 |

交付实现前必须完成整体可落码闭环审计:

| Phase / commit boundary | 复核范围 `03/05/06/07` | 适用标准项 | 结论 | blocker | 修复 baseline |
|---|---|---|---|---|---|
| PH-xx / commit-xx-y | `<文件 / 章节>` | `<标准项>` | 通过 / 不通过 | `<blocker>` | `<baseline>` |

交付证据项:

| 交付证据项 | 固定路径 | 完成标准 | 结论 |
|---|---|---|---|
| raw artifacts | `artifacts/test/<run_id>` | P0 suite 原始证据完整 | 通过 / 不通过 |
| run reports | `reports/runs/<run_id>` | suite report、gate summary、evidence index、redaction、dependency、report audit 完整 | 通过 / 不通过 |
| acceptance handoff | `reports/acceptance/handoff.md` | 已审查并绑定 fixed run_id | 通过 / 不通过 |
| veto checklist | `reports/acceptance/veto-checklist.md` | `VETO-ID-001~006` 全部可裁决且未触发 | 通过 / 不通过 |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | 有条件通过时完整;无条件通过时不适用 | 通过 / 不适用 / 不通过 |

未完成项必须分类为 blocker、deferred、residual 或 risk acceptance。VETO、S 级缺陷、P0 evidence integrity、redaction、dependency、query no-write、job no-repair、stored replay 和 config fail-fast 失败不得风险接受。
````

## 12. 待确认事项

| 事项 | 影响 | 后续处理 |
|---|---|---|
| 正式 `07` 装配后是否仍有旧口径残留 | 影响 Step 13 final self-check | Step 13 全文扫描 |
| design baseline / commit 如何记录 | 影响实现移交 | Step 13 装配后记录当前 design baseline |
| 目标实现仓实际 run_id 和 report path | 影响实现后完成判定 | 实现阶段按 Step 7/11 写入真实路径 |
| 是否有新设计 blocker 需要经验沉淀 | 影响后序任务 | 按 Step 11 §9.12 执行 |

## 13. 进入下一步条件

| 条件 | 结论 |
|---|---|
| 实施完成判定表已写入 | 通过 |
| 未完成项处理表已写入 | 通过 |
| 最终交付清单已写入 | 通过 |
| 交付实现前可落码闭环审计表已写入 | 通过 |
| artifact/report/acceptance evidence 完成标准已写入 | 通过 |
| 未使用“基本完成”作为完成结论 | 通过 |
| 可以进入 Step 13 正式实施计划装配 | 是 |
