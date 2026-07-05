# Step 5. 定义功能验收门禁

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 5
> 回填章节: `06-验收标准.md` §5 功能验收门禁

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 5 定义功能验收门禁 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 2 验收范围;Step 4 进入 / 退出条件;`00-需求文档.md` §14.1~§14.5;`03-详细设计.md` §5~§8;`05-测试方案.md` §5 / §6 / §13 |
| 输出文件 | `projects/L1-artifact/design-calibration/06_acceptance_step_05_function_gate.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 6 |

## 2. 本步目标

把 `L1-artifact` 的 P0 核心能力和功能需求转成可裁决的验收门禁。

本 Step 只回答:

- 五个核心能力如何判定通过 / 失败。
- `FR-ART-001~020` 如何判定通过 / 失败。
- 每个功能验收项引用哪些正式设计契约、`TC-ART-*` 用例、`EV-CAND-ART-*` 证据和 report path。
- 哪些 P1/P2 功能只作为后置边界或 residual,不污染 P0 功能验收。
- 每个功能验收项是否完成停审,跨功能门禁是否存在冲突。

本 Step 不裁决数据边界、接口同步、状态事务一致性、非功能、证据真实性和一票否决;这些分别由后续 Step 6~11 收口。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_02_scope.md` | 已完成 | 提供 P0/P1/P2 范围和只验接缝口径 |
| `06_acceptance_step_04_entry_exit.md` | 已完成 | 提供正式验收准入、准出和不可裁决条件 |
| `00-需求文档.md` §14.1~§14.5 | 已完成 | 提供五个核心能力和 `FR-ART-001~020` 功能验收方向 |
| `03-详细设计.md` §5~§8 | 已完成 | 提供 truth object、public protocol、Command / Query / Consumer / Event / Job 和函数级 flow |
| `05-测试方案.md` §5 | 已完成 | 提供核心能力、`FR-ART`、`BR-ART`、`NFR-ART`、`VF-ART` 的覆盖矩阵 |
| `05-测试方案.md` §6 | 已完成 | 提供 `TC-ART-CMD-*`、`TC-ART-QUERY-*`、`TC-ART-CONSUMER-*`、`TC-ART-OUTBOX-*`、`TC-ART-JOB-*` 用例族 |
| `05-测试方案.md` §13 | 已完成 | 提供 `EV-CAND-ART-*` 证据候选族和 `reports/runs/<run_id>` / `artifacts/test/<run_id>` 结构 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 P0 功能的通过条件是什么? | 每个 AC-ART-001~020 必须由正式设计契约、至少一个对应 `TC-ART-*` 用例族、`EV-CAND-ART-*` 证据候选族、`reports/runs/<run_id>/...` report path 和 raw artifact pairing 同时支撑。 |
| 每个 P0 功能的失败条件是什么? | 只要核心 truth 不能形成、功能主线缺 accepted / rejected / degraded / duplicate 等必需分支、query / job 反写真相、或证据无法回指 raw artifact,对应验收项失败。 |
| 证据来自哪些测试用例或报告? | 功能门禁主要引用 `release-main-smoke`、`contract-domain-fast`、`service-flow-fast`、`entry-worker-job` 和 `operations-replay-core` 的 report;证据候选族使用 `EV-CAND-ART-CORE-*`、`EV-CAND-ART-FR-*`、`EV-CAND-ART-QUERY-*`、`EV-CAND-ART-CONSUMER-*`、`EV-CAND-ART-OUTBOX-*`、`EV-CAND-ART-JOB-*`、`EV-CAND-ART-HANDOFF-*`。 |
| 哪些 P1 功能只做后置边界验收? | real-like resolver / durable store / real bus / staging-like / external GRC 深度集成 / capacity / advanced analytics 只作为 selected-run、residual 或 future,不得作为 P0 功能通过证据。 |
| 哪些功能失败会导致总体不通过? | `AC-ART-001~020` 任一 P0 功能失败均导致不能“通过”。若失败触发 `VF-ART-001~004`,则不得风险接受;若只是 P1 unavailable,进入 residual / risk acceptance。 |
| 每个功能验收项能否回指需求 / 设计契约、测试用例、证据 ID 和 report path? | 可以。见 §8.2 功能验收闭环矩阵。 |
| 每个功能验收项完成后是否通过停审? | 已按设计来源、测试来源、证据来源、通过 / 失败可判定性和 P1 污染风险逐项停审。见 §8.4。 |
| 所有功能验收项完成后是否存在 P0 功能缺门禁、证据重复或裁决影响冲突? | 未发现 unresolved 冲突。重复证据属于 suite 复用,已要求 evidence index 按 AC / TC / EV 反查,不得用单条 smoke 泛化替代详细用例。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` §4~§7 | 旧功能门禁围绕 create / publish / adopt / freeze 少量旧主线,无法覆盖新版 `FR-ART-001~020` | 改为围绕五个核心能力和 `FR-ART-001~020` 定义功能验收 |
| 旧 `06-验收标准.md` | 通过条件多为“功能可用 / 接口返回成功”式描述 | 改为每项必须写通过条件、失败条件、测试用例、证据候选 ID 和 report path |
| `05-测试方案.md` §5 | 覆盖矩阵仍是候选证据族 | 本 Step 只引用 §13 已固定的候选证据族,不发明正式 EV 编号 |
| Step 2 / Step 4 | P1/P2 已定义为 residual / future | 本 Step 明确 P1/P2 不作为 P0 功能通过条件 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 功能验收对象 | 旧 create / publish / adopt / freeze 主线 | Artifact truth center 的五个核心能力和 `FR-ART-001~020` | 承接新版 `00`~`05` |
| 通过条件 | 功能可用、接口返回成功 | 正式 truth / protocol / flow / state / evidence 同时成立 | 验收必须可裁决 |
| 失败条件 | 泛化异常或缺陷 | 明确 truth 缺失、边界被打穿、query/job 反写、证据不可追溯 | 支撑不通过和 VETO |
| 证据 | API / DB / audit entry | `EV-CAND-ART-*` + `reports/runs/<run_id>` + `artifacts/test/<run_id>` | 防止静态造证据 |
| P1/P2 | 容易混入功能通过 | selected-run / residual / future | 防止真实产品不可用污染 P0 |

## 7. 验收裁决取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否把 `FR-ART-001~020` 全部写成独立验收项 | A. 合并成 5 个核心项;B. 保留 20 个稳定 FR | 采用 B。稳定 FR 便于后续 evidence index 和缺陷定位 |
| 是否允许 `release-main-smoke` 单独证明全部功能 | A. 允许;B. 不允许 | 采用 B。smoke 只证明代表性主链,详细功能仍需 `TC-ART-*` 用例族支撑 |
| 是否把数据边界 / 接口 / 一致性 / 非功能混入本 Step | A. 混入;B. 留给后续 Step | 采用 B。它们需要独立裁决 |
| 是否允许 P1 real-like selected-run 补 P0 功能证据 | A. 允许;B. 不允许 | 采用 B。P0 必须由 fake / controlled / disabled seam 下的正式语义证明 |

## 8. 结构化中间产物

### 8.1 功能验收门禁表

| 验收项 ID | 功能 / 场景 | 优先级 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|---|
| AC-ART-001 | 制品事实纳管成立 | P0 | actor、scope、subject、purpose、responsibility context 能形成正式 fact truth,且外部对象只以 ref / safe summary 进入 | context / input 缺正式 truth;相邻仓状态或正文隐式创造治理语境;unresolved 外部引用无 degraded / rejected surface | `TC-ART-CMD-001~002`;`TC-ART-QUERY-001`;`EV-CAND-ART-CORE-*`;`EV-CAND-ART-CMD-*`;`EV-CAND-ART-QUERY-*` |
| AC-ART-002 | 自动化产出事实收束成立 | P0 | automation input register / accept 主线成立,runtime 只作 summary/ref | runtime/output body 直接进入 truth;automation bypass command | `TC-ART-CMD-013~014`;`TC-ART-CONSUMER-005`;`EV-CAND-ART-CMD-*`;`EV-CAND-ART-CONSUMER-*` |
| AC-ART-003 | 事实责任与审查语境成立 | P0 | review anchor、responsibility assignment、review summary query 成立 | review responsibility 缺 truth anchor;责任 actor 不可追溯 | `TC-ART-CMD-011~012`;`TC-ART-QUERY-006`;`EV-CAND-ART-CMD-*`;`EV-CAND-ART-QUERY-*` |
| AC-ART-004 | 真相与派生材料区分成立 | P0 | preview / report / outbox / handoff 只能呈现 formal refs / summary,不得保存 raw body | body / secret / full sensitive ref 进入 truth 或输出面 | `TC-ART-QUERY-010~012`;`TC-ART-OUTBOX-001~008`;`EV-CAND-ART-QUERY-*`;`EV-CAND-ART-OUTBOX-*` |
| AC-ART-005 | 稳定版本事实形成 | P0 | candidate / publish / supersede / history retain / current pointer 成立 | current truth 被无声覆盖;历史版本被删除 | `TC-ART-CMD-003~005`;`TC-ART-QUERY-002~003`;`EV-CAND-ART-CMD-*`;`EV-CAND-ART-QUERY-*` |
| AC-ART-006 | 自动化迭代版本收束 | P0 | automation result enters candidate / publish flow | automation 直接改写 current truth | `TC-ART-CMD-013~014`;`TC-ART-IDEMP-001~004` |
| AC-ART-007 | 版本审查与责任语境 | P0 | get version / list versions / review responsibility around version 成立 | version review 无 formal anchor | `TC-ART-CMD-004~005`;`TC-ART-QUERY-002~003`;`EV-CAND-ART-QUERY-*` |
| AC-ART-008 | 历史版本可追溯保留 | P0 | history / trace / report / archive explanation 成立 | 历史版本不可追溯或被重写 | `TC-ART-QUERY-003~004`;`TC-ART-JOB-004~006`;`EV-CAND-ART-QUERY-*`;`EV-CAND-ART-JOB-*` |
| AC-ART-009 | 正式血缘语境建立 | P0 | establish lineage link / reject invalid lineage 成立 | trace / event 被当成 lineage truth | `TC-ART-CMD-006~007`;`TC-ART-QUERY-004`;`EV-CAND-ART-CMD-*`;`EV-CAND-ART-QUERY-*` |
| AC-ART-010 | 自动化产出关系收束 | P0 | runtime / external source signals only become formal lineage by explicit flow | consumer 直接创造 lineage truth | `TC-ART-CONSUMER-001~006`;`EV-CAND-ART-CONSUMER-*` |
| AC-ART-011 | 血缘审查与影响理解 | P0 | lineage summary / preview / report 可审查 | lineage summary 静默退化为 trace 列表 | `TC-ART-QUERY-004`;`TC-ART-OUTBOX-003`;`EV-CAND-ART-QUERY-*`;`EV-CAND-ART-OUTBOX-*` |
| AC-ART-012 | 血缘审计与跨仓消费边界 | P0 | trace / backref / event seam point back to formal lineage | backref 不可回指正式 truth | `TC-ART-QUERY-008`;`TC-ART-CONSUMER-001~006`;`EV-CAND-ART-QUERY-*`;`EV-CAND-ART-CONSUMER-*` |
| AC-ART-013 | 受控版本集合形成 | P0 | create baseline candidate / freeze baseline | membership 未稳定、current version 动态重算 | `TC-ART-CMD-008~010`;`TC-ART-QUERY-005`;`EV-CAND-ART-CMD-*`;`EV-CAND-ART-QUERY-*` |
| AC-ART-014 | 基线候选与冻结语境收束 | P0 | only formal versions enter baseline, temporary material rejected | 外部集合替代 baseline | `TC-ART-CMD-008~010`;`TC-ART-JOB-004`;`EV-CAND-ART-CMD-*`;`EV-CAND-ART-JOB-*` |
| AC-ART-015 | 冻结责任与审查语境 | P0 | baseline review / responsibility coherence 成立 | baseline 无 formal review anchor | `TC-ART-CMD-011~012`;`TC-ART-QUERY-005~006`;`EV-CAND-ART-CMD-*`;`EV-CAND-ART-QUERY-*` |
| AC-ART-016 | 历史基线可审计与跨仓边界 | P0 | baseline history / report / archive handoff 有稳定 membership | baseline report 直接从 current truth 重算 | `TC-ART-QUERY-005`;`TC-ART-JOB-004~006`;`EV-CAND-ART-QUERY-*`;`EV-CAND-ART-JOB-*` |
| AC-ART-017 | 稳定 Artifact truth 引用表达 | P0 | issue consumable reference and stable read surface 成立 | 下游直接消费正文或 current truth | `TC-ART-CMD-015`;`TC-ART-QUERY-007`;`EV-CAND-ART-CMD-*`;`EV-CAND-ART-QUERY-*` |
| AC-ART-018 | 消费边界与 truth 不转移 | P0 | record backref、consumer / sync / archive / observability seam no ownership transfer | 消费方反写 truth | `TC-ART-CMD-016`;`TC-ART-CONSUMER-001~006`;`EV-CAND-ART-CMD-*`;`EV-CAND-ART-CONSUMER-*` |
| AC-ART-019 | 审查责任与协作消费一致 | P0 | review / responsibility and downstream consumption point to same truth anchor | 协作消费与审查责任不一致 | `TC-ART-QUERY-006~007`;`TC-ART-CONSUMER-001~006`;`EV-CAND-ART-QUERY-*`;`EV-CAND-ART-CONSUMER-*` |
| AC-ART-020 | 跨仓审计回指与事实解释 | P0 | trace, report, archive / observability / sync handoff explain source truth | trace / report / handoff 无来源 | `TC-ART-QUERY-008~013`;`TC-ART-JOB-004~006`;`EV-CAND-ART-QUERY-*`;`EV-CAND-ART-JOB-*` |

### 8.2 功能验收闭环矩阵

| 验收项 ID | 设计契约 | 测试用例 | 证据候选 ID | report path | 裁决影响 |
|---|---|---|---|---|---|
| AC-ART-001 | `03` §6.1 context/input objects;§7.1 Command;§8.1 accepted transaction;§8.2 Query | `TC-ART-CMD-001~002`;`TC-ART-QUERY-001` | `EV-CAND-ART-CORE-*`;`EV-CAND-ART-CMD-*`;`EV-CAND-ART-QUERY-*` | `reports/runs/<run_id>/suites/release-main-smoke.md`;`reports/runs/<run_id>/suites/service-flow-fast.md` | 失败则不通过 |
| AC-ART-002 | `03` §7.1 automation input / acceptance;§8.1;redaction boundary | `TC-ART-CMD-013~014`;`TC-ART-CONSUMER-005` | `EV-CAND-ART-CMD-*`;`EV-CAND-ART-CONSUMER-*` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/redaction-check.md` | 失败则不通过 |
| AC-ART-003 | `03` §6.1 review / responsibility;§7.1;§8.2 | `TC-ART-CMD-011~012`;`TC-ART-QUERY-006` | `EV-CAND-ART-CMD-*`;`EV-CAND-ART-QUERY-*` | `reports/runs/<run_id>/suites/service-flow-fast.md` | 失败则不通过 |
| AC-ART-004 | `03` §7.2 Query;`03` §7.3 Event;`03` §7.4 Job | `TC-ART-QUERY-010~012`;`TC-ART-OUTBOX-001~008` | `EV-CAND-ART-QUERY-*`;`EV-CAND-ART-OUTBOX-*` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/entry-worker-job.md` | 失败则不通过 |
| AC-ART-005 | `03` §7.1 version commands;`03` §10~§13 | `TC-ART-CMD-003~005`;`TC-ART-QUERY-002~003`;`TC-ART-IDEMP-001~004` | `EV-CAND-ART-CMD-*`;`EV-CAND-ART-QUERY-*`;`EV-CAND-ART-IDEMP-*` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/contract-domain-fast.md` | 失败则不通过 |
| AC-ART-006 | `03` §7.1 automation version path;§13 idempotency | `TC-ART-CMD-013~014`;`TC-ART-IDEMP-001~005` | `EV-CAND-ART-CMD-*`;`EV-CAND-ART-IDEMP-*` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/contract-domain-fast.md` | 失败则不通过 |
| AC-ART-007 | `03` §7.1 version query;§10 state matrix | `TC-ART-CMD-004~005`;`TC-ART-QUERY-002~003` | `EV-CAND-ART-CMD-*`;`EV-CAND-ART-QUERY-*` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/contract-domain-fast.md` | 失败则不通过 |
| AC-ART-008 | `03` §7.2 Query;`03` §7.4 Job | `TC-ART-QUERY-003~004`;`TC-ART-JOB-004~006` | `EV-CAND-ART-QUERY-*`;`EV-CAND-ART-JOB-*` | `reports/runs/<run_id>/suites/entry-worker-job.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | 失败则不通过 |
| AC-ART-009 | `03` §7.1 lineage commands;`03` §10 state matrix | `TC-ART-CMD-006~007`;`TC-ART-QUERY-004` | `EV-CAND-ART-CMD-*`;`EV-CAND-ART-QUERY-*` | `reports/runs/<run_id>/suites/service-flow-fast.md` | 失败则不通过 |
| AC-ART-010 | `03` §7.3 consumer;`03` §7.1 lineage commands | `TC-ART-CONSUMER-001~006` | `EV-CAND-ART-CONSUMER-*` | `reports/runs/<run_id>/suites/entry-worker-job.md` | 失败则不通过 |
| AC-ART-011 | `03` §7.2 Query;`03` §7.3 Event | `TC-ART-QUERY-004`;`TC-ART-OUTBOX-003` | `EV-CAND-ART-QUERY-*`;`EV-CAND-ART-OUTBOX-*` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/entry-worker-job.md` | 失败则不通过 |
| AC-ART-012 | `03` §7.2 Query;`03` §7.3 Consumer | `TC-ART-QUERY-008`;`TC-ART-CONSUMER-001~006` | `EV-CAND-ART-QUERY-*`;`EV-CAND-ART-CONSUMER-*` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/entry-worker-job.md` | 失败则不通过 |
| AC-ART-013 | `03` §7.1 baseline commands;`03` §10 state matrix | `TC-ART-CMD-008~010`;`TC-ART-QUERY-005` | `EV-CAND-ART-CMD-*`;`EV-CAND-ART-QUERY-*` | `reports/runs/<run_id>/suites/service-flow-fast.md` | 失败则不通过 |
| AC-ART-014 | `03` §7.1 baseline commands;`03` §7.4 jobs | `TC-ART-CMD-008~010`;`TC-ART-JOB-004` | `EV-CAND-ART-CMD-*`;`EV-CAND-ART-JOB-*` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/entry-worker-job.md` | 失败则不通过 |
| AC-ART-015 | `03` §7.1 review / baseline commands;`03` §8.2 | `TC-ART-CMD-011~012`;`TC-ART-QUERY-005~006` | `EV-CAND-ART-CMD-*`;`EV-CAND-ART-QUERY-*` | `reports/runs/<run_id>/suites/service-flow-fast.md` | 失败则不通过 |
| AC-ART-016 | `03` §7.2 Query;`03` §7.4 Job | `TC-ART-QUERY-005`;`TC-ART-JOB-004~006` | `EV-CAND-ART-QUERY-*`;`EV-CAND-ART-JOB-*` | `reports/runs/<run_id>/suites/operations-replay-core.md` | 失败则不通过 |
| AC-ART-017 | `03` §7.1 issue consumable ref;`03` §8.2 | `TC-ART-CMD-015`;`TC-ART-QUERY-007` | `EV-CAND-ART-CMD-*`;`EV-CAND-ART-QUERY-*` | `reports/runs/<run_id>/suites/service-flow-fast.md` | 失败则不通过 |
| AC-ART-018 | `03` §7.1 backref command;`03` §7.3 consumer;`03` §8.2 | `TC-ART-CMD-016`;`TC-ART-CONSUMER-001~006` | `EV-CAND-ART-CMD-*`;`EV-CAND-ART-CONSUMER-*` | `reports/runs/<run_id>/suites/entry-worker-job.md` | 失败则不通过 |
| AC-ART-019 | `03` §7.2 Query;`03` §7.3 Consumer | `TC-ART-QUERY-006~007`;`TC-ART-CONSUMER-001~006` | `EV-CAND-ART-QUERY-*`;`EV-CAND-ART-CONSUMER-*` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/entry-worker-job.md` | 失败则不通过 |
| AC-ART-020 | `03` §7.2 Query;`03` §7.4 Job | `TC-ART-QUERY-008~013`;`TC-ART-JOB-004~006` | `EV-CAND-ART-QUERY-*`;`EV-CAND-ART-JOB-*` | `reports/runs/<run_id>/suites/operations-replay-core.md` | 失败则不通过 |

### 8.3 P1 / P2 功能后置边界

| 功能 | 当前裁决 | 后续承接 |
|---|---|---|
| real-like resolver / durable store / real bus | 不作为 P0 功能通过前置 | Step 13 residual / selected-run;若升级为 P0 需补基线和 evidence |
| staging-like / production-like runtime | 不作为 P0 功能通过前置 | Step 13 / Step 14 记录条件或 future |
| advanced analytics / dashboard | 不作为 AC-ART 功能通过条件 | future enhancement;不得替代正式 truth / query / job 证据 |
| complex orchestration / extra automation | 不作为 AC-ART 功能通过条件 | future enhancement;不得替代正式 Command / Consumer truth |
| external GRC deep integration | 不作为 AC-ART-020 通过条件 | P0 只验 disabled / fake / controlled export boundary |

### 8.4 功能验收项停审记录

| 验收项 ID | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| AC-ART-001~005 | 核心闭环均回指五个核心能力、详细设计 truth / protocol / flow 和正式证据候选族 | 通过 | 需要正式验收时由 `EV-CAND-ART-CORE-*` 证明 release smoke 是场景级闭环,不是通用测试计数 |
| AC-ART-006~012 | `FR-ART-001~012` 均回指 Command / Query / Consumer / Event / Job / redaction 用例族 | 通过 | redaction 细节在 Step 10 继续审计,但功能项可引用 `EV-CAND-ART-REDACTION-*` |
| AC-ART-013~020 | baseline / consumable / handoff / observability 功能有正式设计契约和证据入口 | 通过 | query no-write 和 job no-truth-repair 的一致性细节由 Step 8 / Step 11 加严 |
| 全部 AC-ART-001~020 | 通过 / 失败条件可判定 | 通过 | 不填真实 pass/fail;正式裁决等实际 `run_id` 和 evidence index |
| 全部 AC-ART-001~020 | 未误用 P1/P2 结果 | 通过 | P1/P2 已放入 §8.3 后置边界 |

### 8.5 跨功能门禁裁决审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 功能是否缺门禁 | 未发现缺口 | AC-ART-001~020 均有通过 / 失败 / evidence 候选 |
| 是否存在孤儿功能 AC | 未发现缺口 | 每项均回指核心能力或 FR-ART |
| 是否存在孤儿 P0 用例族 | 未在本 Step 发现 | Step 6~10 继续覆盖接口、一致性、证据和非功能用例 |
| 是否用单条 smoke 代替全部功能证据 | 未采用 | `EV-CAND-ART-CORE-*` 只证明代表主链;详细项继续引用 service / domain / job suites |
| 是否存在 P1 污染 P0 | 未发现 | P1/P2 明确进入 selected-run / residual / future |
| 是否存在证据路径断裂 | 未发现设计层断裂 | 正式验收时仍必须由 Step 3/4 固定 `run_id` 和 artifact/report pairing |
| 是否存在裁决影响冲突 | 未发现 | 任一 P0 功能失败均不能通过;VETO 触发由 Step 11 最终裁决 |

## 9. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_05_function_gate.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“功能验收门禁表”“功能验收闭环矩阵”“P1 / P2 功能后置边界”“功能验收项停审记录”和“跨功能门禁裁决审计表”小节,了解功能验收门禁如何从核心能力、`FR-ART`、详细设计和测试证据收敛。

正式 `06-验收标准.md` §5 应回填:

- 功能验收门禁覆盖 `AC-ART-001~020`,其中 `AC-ART-001~005` 裁决五个核心能力闭环,`AC-ART-006~020` 裁决 `FR-ART-001~020` 功能能力。
- 每个 P0 功能验收项必须同时具备正式设计契约、`TC-ART-*` 用例、`EV-CAND-ART-*` 证据候选、`reports/runs/<run_id>/...` report path 和 raw artifact pairing。
- `release-main-smoke` 只能证明代表性 Artifact 业务闭环,不能单独替代 service / domain / query / consumer / outbox / job 详细证据。
- 任一 `AC-ART-001~020` 失败时,正式结论不得为“通过”。若失败同时命中 `VF-ART-001~004`,不得风险接受。
- P1/P2 功能只能进入 selected-run、residual、future 或 Step 13 风险接受,不得作为 P0 功能通过证据。

## 10. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| `EV-CAND-ART-CORE-*` 的 release smoke 是否由实现仓证明为场景级闭环 | 影响 `AC-ART-001~005` 的核心闭环证据强度 | 本 Step 要求正式验收时必须证明,否则不能作为核心功能通过证据 |
| P1 selected-run 是否在某个 release candidate 强制 | 影响 `AC-ART-014/016/020` 的外部接缝 confidence | 当前不作为 P0 前置;Step 13 / Step 14 处理 |
| 是否需要为核心能力 / FR / redaction / handoff 单独拆正式 EV 编号 | 影响 evidence index 粒度 | 当前复用 §13 已固定 `EV-CAND-ART-*`;若后续测试方案新增正式 EV,Step 15 可引用 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 功能都有可裁决门禁 | 通过 | `AC-ART-001~020` 均已定义通过 / 失败条件 |
| 每项均有设计契约、测试用例、证据候选 ID、report path | 通过 | 见 §8.2 |
| 功能验收项已停审 | 通过 | 见 §8.4 |
| 跨功能门禁审计无 unresolved 冲突 | 通过 | 见 §8.5 |
| 可进入 Step 6 | 通过 | 下一步定义数据边界与架构红线验收;进入前等待用户审查 |
