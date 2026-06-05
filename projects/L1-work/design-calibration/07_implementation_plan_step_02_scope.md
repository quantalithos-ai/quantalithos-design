# L1-work 07 实施计划 Step 2: 明确实施目标、范围和非范围

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-work/07-实施计划.md` §2 实施目标与范围
> 状态: `[x] 已完成`
> 日期: 2026-06-04

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 2 |
| 主题 | 明确实施目标、范围和非范围 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-work/design-calibration/07_implementation_plan_step_02_scope.md` |

本步把 `00~06` 中已经确认的需求、详细设计、配置、测试和验收门禁转换为本轮实施目标、实施范围和非范围。本步不拆 phase、不拆 commit boundary、不创建正式 `07-实施计划.md`。

## 2. 本步输入

| 输入 | 本步使用方式 |
|---|---|
| `07_implementation_plan_step_01_input_boundary.md` | 承接已确认的输入边界、目标实现仓、实现形态和风险 |
| `00-需求文档.md` §9 / §10 / §11 / §14 / §15 | 提取 `FR-WORK-*`、`BR-WORK-*`、数据归属、`AC-WORK-*`、`VF-WORK-*`、风险和非目标 |
| `03-详细设计.md` §2 / §3 / §4 / §5 / §16 / §17 | 提取 P0 展开范围、workspace、crate、依赖、实现单元、测试切口和实施交接约束 |
| `04-配置设计.md` | 提取 `WorkRuntimeConfig`、profile、路径、redaction、fail-fast / fail-closed 和 runtime graph 范围 |
| `05-测试方案.md` | 提取 `TC-WORK-*`、`EV-WORK-*`、suite、gate、reports、artifacts、redaction 和证据范围 |
| `06-验收标准.md` §2 / §3 / §4 / §11 | 提取 P0 / P1 / P2 验收范围、基线、准入准出、一票否决和证据裁决口径 |

校准来源:

- `design-calibration/00_req_step_09_functional_requirements.md`
- `design-calibration/00_req_step_10_business_rules_boundaries.md`
- `design-calibration/00_req_step_11_data_ownership.md`
- `design-calibration/00_req_step_14_acceptance_criteria.md`
- `design-calibration/03_ddd_step_02_scope.md`
- `design-calibration/03_ddd_step_03_constraints.md`
- `design-calibration/03_ddd_step_04_file_layout.md`
- `design-calibration/03_ddd_step_05_module_contracts.md`
- `design-calibration/03_ddd_step_16_test_cuts.md`
- `design-calibration/03_ddd_step_17_implementation_handoff.md`
- `design-calibration/06_acceptance_step_02_scope.md`
- `design-calibration/06_acceptance_step_03_baseline.md`
- `design-calibration/06_acceptance_step_04_entry_exit.md`

## 3. SOP 问题回答

### 3.1 本轮实施的最小可交付结果是什么?

最小可交付结果是在 `/home/aris/Projects/quantalithos-work` 中交付一个可编译、可测试、可验收的 Rust 2024 workspace,让 `L1-work` 作为项目工作事实真相仓的 P0 闭环成立。

该闭环必须至少包括:

- `contracts/domain/application/infra/api/worker/jobs` 多 crate workspace。
- `Project` 作为项目工作主语的显式建立、生命周期变化、引用和追溯。
- `ProjectMember` 表达 GlobalMember 在项目内的承担事实,不接管 identity 生命周期。
- `Backlog`、`WorkItem`、`ChildWorkItem` 形成正式工作全集,并拒绝 conversation suggestion、personal step、runtime plan item 直接污染。
- `WorkDependency`、`WorkBlocker` 表达正式工作之间的依赖、阻塞、解除依据和可解释历史。
- `Iteration`、`IterationCommitment` 形成承诺子集,并保持与 Backlog 全集和 process planning 的边界。
- `PromoteResult`、external reference / snapshot、trace / audit / outbox / handoff 支撑显式 formalize / promote、完成依据、消费和追溯。
- Command / Query / Consumer / Event / Job 协议、状态矩阵、事务、幂等、projection、reconciliation、reports / artifacts 和 redaction 证据链。

P0 可以使用 in-memory repository、fake resolver、fake publisher、fake handoff 和 controlled adapter 完成本仓闭环;真实生产 DB / MQ / search / trace / archive 产品集成不是本轮通过条件。

### 3.2 哪些需求编号必须覆盖?

`FR-WORK-001~FR-WORK-008` 均属于当前 P0 硬范围,必须能被正式接口、状态、测试和验收证据支撑。

| 需求 | 本轮覆盖口径 |
|---|---|
| `FR-WORK-001` 项目工作主语成立 | 必须实现 Project 建立、引用、生命周期和追溯 |
| `FR-WORK-002` 项目内成员承担表达 | 必须实现 ProjectMember 承担关系、状态和 identity 边界 |
| `FR-WORK-003` 正式工作全集收束 | 必须实现 Backlog / WorkItem 正式全集和越界输入拒绝 |
| `FR-WORK-004` 正式工作拆分与升级边界 | 必须实现 child WorkItem 与 promote / formalize 显式边界 |
| `FR-WORK-005` 正式工作依赖与阻塞表达 | 必须实现 dependency / blocker / resolve / history |
| `FR-WORK-006` Iteration 承诺子集形成 | 必须实现 Iteration 和 commitment 主线 |
| `FR-WORK-007` 项目工作事实消费与追溯 | 必须实现授权查询、projection、trace、history 和 view marker |
| `FR-WORK-008` 项目工作事实维护与对账 | 必须实现 projection rebuild、reference refresh、reconciliation、outbox / job 证据 |

`FR-WORK-E01~FR-WORK-E05` 是外围增强能力,不进入 P0 硬实现范围。若 P0 查询需要基础 read view、搜索引用或项目看板最小面,只能按 `03` 已定义的 P0 projection / view 契约实现,不得扩展为高级看板、自动建议、容量预测、工具治理协同或跨项目依赖产品能力。

业务规则方面,`BR-WORK-001~BR-WORK-027` 必须可被实现和测试判断。尤其是 Backlog 不混入个人步骤、Work 不保存相邻仓正文、Query / projection / reconciliation 不反写真相、唯一编译期依赖只允许 `core-contracts`。

### 3.3 哪些详细设计章节必须落地?

必须落地的详细设计范围包括:

| 详细设计范围 | 本轮处理 |
|---|---|
| §2 目标与范围 | 作为 P0 实施范围边界,不扩大到生产运维、UI 或跨项目增强 |
| §3 实现约束与编码规范承接 | 作为 Rust、源码语言、commit、dependency 和 git 纪律输入 |
| §4 实现单元与文件布局 | 作为 workspace、crate、package、binary 和目录命名约束 |
| §5 模块实现契约 | 作为 phase / commit boundary 拆分输入,Step 5~6 继续细化 |
| §6 对象契约 | 作为 contracts / domain 字段、enum、policy 和 invariant 真相源 |
| §7 trait / port / adapter | 作为 application / infra 边界和 fake adapter 实现输入 |
| §8 协议契约 | 作为 Command / Query / Consumer / Event / Job DTO、result、receipt 和 error surface 输入 |
| §9 函数处理流 | 作为 application service、worker 和 jobs 编排输入 |
| §10 状态矩阵 | 作为 enum、状态迁移、非法迁移测试和报告命名输入 |
| §11~§13 持久化、错误、幂等 | 作为 UnitOfWork、repository、error、retry、dedup 和 concurrency 输入 |
| §14~§15 配置、观测、审计 | 作为 config、runtime graph、logs、metrics、audit 和 reports 输入 |
| §16~§17 测试切口与实施交接 | 作为 Step 6 / Step 7 拆任务和门禁输入 |

若实现阶段发现 `03` 的字段、DTO、状态、错误、配置默认值或 phase boundary 不足,必须暂停并回写设计真相源,不得由实现者自行补字段或选择一方落码。

### 3.4 哪些验收项必须在本轮可判定?

本轮必须让 `AC-WORK-001~AC-WORK-029` 全部可判定,并让 `VF-WORK-001~VF-WORK-008` 全部进入一票否决检查。

| 验收组 | 范围 | 本轮判定要求 |
|---|---|---|
| `AC-WORK-001~005` | 核心能力闭环 | C-1~C-5 任一失败不得通过 |
| `AC-WORK-006~013` | 功能能力 | `FR-WORK-001~008` 必须有正式接口、状态和证据覆盖 |
| `AC-WORK-014~019` | 规则 / 边界 / 审计 | 不变量、禁止行为、显式变化、相邻仓边界、治理约束和审计约束可判定 |
| `AC-WORK-020~023` | 数据归属 | Work truth、外部快照、外部引用和禁止正文边界成立 |
| `AC-WORK-024~029` | 非功能底线 | 性能判断口径、可用性、安全、追溯、幂等一致性和可观测性可判定 |
| `VF-WORK-001~008` | 一票否决 | 全部进入 `reports/acceptance/veto-checklist.md`,任一命中不得风险接受 |

P1 controlled integration seams 可以选测,失败进入风险接受或后续专项,不阻断 P0。P2 production-like、容量、SLO、config center、hot reload、runbook 和真实端到端产品集成只记录,不裁决。

### 3.5 哪些能力明确不在本轮实施?

以下能力不进入本轮 P0 实施范围:

- 高级看板、多视图偏好、复杂排序分组和 workspace 产品体验。
- 自动化维护建议、自动 spillover、自动解除阻塞、自动修复 Work truth。
- 容量趋势、负载风险预测、长期吞吐模型和 production SLO 数字。
- 项目内工具能力调整治理协同、方法定义治理、审批策略或决策正文。
- 跨项目依赖理解、组合风险分析和 portfolio 级计划。
- 真实生产 DB / MQ / search / trace / archive 产品选型和接入。
- 真实相邻仓端到端联调作为 P0 通过条件。
- deployment topology、config center、hot reload、admin override、on-call runbook。
- conversation、process、governance、artifact、runtime、workspace 等相邻仓正文和生命周期。

这些能力可以进入 risk acceptance、open issues、后续专项或下游仓实施计划,但不能成为 P0 DTO 必填字段、P0 gate、P0 配置必填项或 P0 通过条件。

### 3.6 是否存在 P1 / P2 能力容易被误做进 P0?

存在。最容易误膨胀的是:

- 把高级看板、多视图偏好或 workspace 聚合体验写成 Work truth 或 P0 query 硬验收。
- 把 conversation suggestion、runtime plan item、process planning 或 ImplementationPlan step 直接写入 Backlog / WorkItem / child WorkItem。
- 把自动维护建议、自动 spillover 或自动修复写成可以改变业务 truth 的 job。
- 把容量趋势、负载风险、production SLO 或旧候选性能数字写成 P0 硬阈值。
- 把真实 MQ、真实 DB、真实 search、真实 archive 或真实 observability 产品接入作为本仓 P0 前置。
- 把 ProjectMember 扩展成 GlobalMember / Role / Actor 生命周期管理。
- 把 artifact evidence、governance decision、runtime progress 或 conversation body 保存为 Work 正文。

实施计划必须在 Step 5~7 拆阶段、任务和门禁时持续防止这些能力进入 P0 主线。

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| `07` 尚未定义范围 | 实施者只能从 `00~06` 自行推断 | 容易把增强能力做进 P0 | 本步收敛实施目标、范围和非范围 |
| `FR-WORK-E01~E05` 容易误入硬范围 | 增强能力在需求中已列出 | 高级看板、自动建议、容量预测和跨项目能力膨胀 | 本步列为非 P0,只允许 P0 最小 query / projection 面 |
| 目标实现仓不存在 | Step 1 已确认 `/home/aris/Projects/quantalithos-work` 当前不存在 | 后续 agent 不知道建仓是否属于本轮 | 本步把目标仓初始化列入支撑范围 |
| fake adapter 容易被误当 production success | P0 允许 fake / controlled adapter | 验收中可能误报真实集成通过 | 本步明确 fake 只证明本仓闭环 |
| 下游体验容易反向定义本仓 truth | workspace、conversation、process、runtime 都可能消费 Work | 下游视图或计划项污染 Work truth | 本步明确相邻仓只通过 ref / snapshot / event / seam 协作 |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 实施目标 | 散落在需求、详细设计和验收标准 | 收敛为 Work truth center P0 可交付闭环 | 实现者知道第一目标 |
| 实施范围 | `FR`、`AC`、对象、接口、配置和证据分散 | 形成可追溯实施范围表 | 后续 phase / commit boundary 有边界 |
| 非范围 | 分散在 `00`、`03`、`06` | 集中列出高级看板、自动建议、容量、真实生产集成等后置能力 | 防止范围膨胀 |
| P0-supporting | 容易被误认为后置 | projection、reference refresh、outbox、reconciliation、reports 进入最小切口 | 符合验收标准 |
| controlled seam | fake / in-memory 只在设计中分散说明 | 明确 P0 可用 fake 证明闭环,但不得标 production success | 避免验收误判 |

## 6. 实施计划取舍

### 6.1 本轮是否只做核心写模型

| 方案 | 优点 | 风险 | 结论 |
|---|---|---|---|
| A. 只做 Project / WorkItem / Iteration 写模型 | 范围最小 | 无法满足消费追溯、维护对账、证据和一票否决检查 | 不采用 |
| B. 做 `FR-WORK-001~008` P0 闭环,但限制增强深度 | 与 `06` 验收标准一致 | 需要后续 Step 严格控制 projection / job / report 不反写真相 | 采用 |

推荐方案 B。原因是 Work truth center 的 P0 通过不仅要证明业务 truth 写入,还要证明授权消费、追溯、对账、outbox、redaction 和证据路径成立。

### 6.2 是否把目标仓初始化纳入范围

| 方案 | 优点 | 风险 | 结论 |
|---|---|---|---|
| A. 纳入本轮范围 | 目标仓不存在也能按计划开工 | Step 5 需要把建仓和 workspace 初始化放在第一阶段 | 采用 |
| B. 不纳入本轮范围 | 范围更像纯业务实现 | 交给 agent 时会缺少落地入口 | 不采用 |

推荐方案 A。原因是 Step 1 已确认目标仓当前不存在;实施计划必须把 repo scaffold、workspace、scripts、reports 和 artifacts 作为支撑交付物。

### 6.3 是否要求真实相邻仓集成作为 P0

| 方案 | 优点 | 风险 | 结论 |
|---|---|---|---|
| A. 要求真实相邻仓集成 | 更接近生产 | 下游 / 来源仓 readiness 会阻塞 Work truth center 本仓闭环 | 不采用 |
| B. P0 使用 in-memory / fake / controlled adapter,真实集成进风险接受或后续专项 | 可独立验证本仓 truth | 需要严格标记 fake,不得写成 production success | 采用 |

推荐方案 B。原因是本仓 P0 要先证明自身 truth、state、transaction、idempotency、redaction 和 evidence 成立;真实端到端联调不应成为本仓实施的前置阻塞。

## 7. 结构化中间产物

### 7.1 实施目标表

| 目标 ID | 实施目标 | 来源 | 完成判定 |
|---|---|---|---|
| `GOAL-WORK-IMPL-001` | 建立 Work truth center P0 主闭环 | `FR-WORK-001~008`;`AC-WORK-001~013` | Project、ProjectMember、Backlog、WorkItem、child WorkItem、dependency / blocker、Iteration、promote、query / trace / maintenance 均通过 |
| `GOAL-WORK-IMPL-002` | 落地 Rust workspace 和 crate 边界 | `03` §3~§5;`VF-WORK-008` | `contracts/domain/application/infra/api/worker/jobs` 可编译,依赖方向正确 |
| `GOAL-WORK-IMPL-003` | 让协议、对象、状态、事务和错误可 1:1 落码 | `03` §6~§13 | DTO roundtrip、domain state、service flow、error mapping 和 idempotency tests 通过 |
| `GOAL-WORK-IMPL-004` | 交付 P0-supporting projection、reference、outbox、handoff、jobs 和 reports | `FR-WORK-007~008`;`AC-WORK-012~013`;`AC-WORK-027~029` | authorized view、trace、reconciliation、outbox publish、handoff marker 和 evidence 可验证 |
| `GOAL-WORK-IMPL-005` | 交付配置、脚本、reports / artifacts 和验收证据链 | `04`;`05`;`06` | gate、redaction check、evidence index、veto checklist 和 acceptance handoff 可生成 |

### 7.2 实施范围表

| 类别 | 内容 | 来源 | 是否本轮实施 | 说明 |
|---|---|---|---|---|
| 仓库初始化 | `/home/aris/Projects/quantalithos-work` workspace、Cargo、crates、tests、scripts、reports、artifacts | Step 1;`03` §3~§4 | 是 | 目标仓不存在,必须纳入初始交付 |
| 核心功能 | `Project` truth | `FR-WORK-001`;`AC-WORK-001`;`AC-WORK-006` | 是 | 显式建立、生命周期、引用和追溯 |
| 核心功能 | `ProjectMember` 承担事实 | `FR-WORK-002`;`AC-WORK-002`;`AC-WORK-007` | 是 | 分离 GlobalMember 生命周期,只保存 ref / snapshot |
| 核心功能 | `Backlog` / `WorkItem` / `ChildWorkItem` | `FR-WORK-003~004`;`AC-WORK-003`;`AC-WORK-008~009` | 是 | 正式工作全集、拆分、升级、拒绝边界外输入 |
| 核心功能 | `WorkDependency` / `WorkBlocker` | `FR-WORK-005`;`AC-WORK-010`;`AC-WORK-019` | 是 | 依赖、阻塞、解除依据和历史 |
| 核心功能 | `Iteration` / `IterationCommitment` | `FR-WORK-006`;`AC-WORK-004`;`AC-WORK-011` | 是 | 承诺子集、状态和 Backlog 边界 |
| 支撑功能 | `PromoteResult` / external reference / snapshot | `FR-WORK-004`;`BR-WORK-014~015`;`AC-WORK-018`;`AC-WORK-020~023` | 是 | 显式 promote / formalize,不保存外部正文 |
| 支撑功能 | Authorized query / projection / board view | `FR-WORK-007`;`AC-WORK-005`;`AC-WORK-012`;`BR-WORK-006`;`BR-WORK-011` | 是 | 只读、可滞后、可解释,不得反写真相 |
| 支撑功能 | Trace / audit / outbox / outbound event | `BR-WORK-026~027`;`AC-WORK-019`;`AC-WORK-027~029` | 是 | accepted truth 同事务写 trace / audit / outbox |
| 支撑功能 | Inbound consumer / reference refresh | `03` §7~§9;`AC-WORK-020~023` | 是 | controlled seam,只更新 snapshot / marker,不补外部 truth |
| 支撑功能 | Operations jobs / reconciliation / handoff | `FR-WORK-008`;`AC-WORK-013`;`AC-WORK-029` | 是 | projection rebuild、reference refresh、reconciliation、trace / archive handoff |
| 配置和环境 | `WorkRuntimeConfig`、profile、runtime graph、redaction、path shape | `04`;`AC-WORK-024~029` | 是 | config 不能改变 truth 边界和依赖裁剪 |
| 测试和证据 | P0 suite、gate scripts、reports、artifacts、acceptance handoff | `05`;`06` | 是 | 路径固定为 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` |
| 真实产品集成 | production DB / MQ / search / trace / archive / config center | `06` P1 / P2 | 否 | 只保留 port / fake / controlled adapter 和风险记录 |

### 7.3 非范围表

| 非范围 | 后续归属 | 本轮只保留什么 | 误纳入风险 |
|---|---|---|---|
| 高级看板、多视图偏好、复杂排序分组 | `L1-workspace` 或后续 Work 增强 | P0 `ProjectBoardView` / query surface | view preference 反写 Work truth |
| 自动化维护建议、自动 spillover、自动解除阻塞 | 后续 operations / governance 专项 | reconciliation issue marker / report | job 自动修改业务 truth |
| 容量趋势、负载风险预测、portfolio 视图 | 后续分析专项 | 定性 NFR 证据和风险记录 | 未确认容量数字成为 P0 阈值 |
| 项目内工具能力调整治理协同 | `L3-method-library` / `L1-governance` | ref / snapshot / controlled resolver | Work 接管治理或方法定义 truth |
| 跨项目依赖理解 | 后续跨项目能力 | 单项目正式依赖 / blocker | 单项目 P0 被 portfolio 能力阻塞 |
| conversation suggestion / process planning / runtime plan body | 来源仓 | source ref、summary ref、promote marker | 外部正文进入 Backlog 或 child WorkItem |
| Artifact evidence / ImplementationPlan 正文 | `L1-artifact` | evidence ref / completion summary ref | Work 保存 artifact 或 plan 正文 |
| Identity GlobalMember / Role / Actor 生命周期 | `L1-identity` | GlobalMemberRef、ActorRef、capability snapshot | ProjectMember 接管 identity truth |
| 真实生产 DB / MQ / search / trace / archive | 后续 infra / ops 专项 | port + in-memory / fake adapter | 真实集成阻塞 P0 或 fake 被标 production |
| config center / hot reload / admin override | 后续配置专项 | static JSON + fail-fast / fail-closed | 配置绕过 redaction / authorization |
| deployment topology、SLO、on-call runbook | 后续运维文档 | selected reports 和 risk acceptance | 运维未就绪阻塞本仓 P0 |

### 7.4 范围到验收项映射表

| 实施范围 | 关键验收项 | 关键证据 |
|---|---|---|
| Project truth | `AC-WORK-001`;`AC-WORK-006`;`AC-WORK-014`;`VF-WORK-001` | `TC-WORK-*`;`EV-WORK-CORE-*` |
| ProjectMember | `AC-WORK-002`;`AC-WORK-007`;`AC-WORK-017`;`VF-WORK-003` | `EV-WORK-MEMBER-*` |
| Backlog / WorkItem / child WorkItem | `AC-WORK-003`;`AC-WORK-008~009`;`VF-WORK-002`;`VF-WORK-005` | `EV-WORK-FORMAL-*`;`EV-WORK-PROMOTE-*` |
| Dependency / blocker | `AC-WORK-010`;`AC-WORK-019`;`AC-WORK-027` | `EV-WORK-FORMAL-*`;`EV-WORK-OPS-*` |
| Iteration / commitment | `AC-WORK-004`;`AC-WORK-011`;`AC-WORK-016` | `EV-WORK-ITER-*` |
| Query / projection / trace | `AC-WORK-005`;`AC-WORK-012`;`AC-WORK-021`;`AC-WORK-028~029` | `EV-WORK-QUERY-*`;`EV-WORK-TRACE-*` |
| Reference / snapshot / promote source | `AC-WORK-018`;`AC-WORK-020~023`;`VF-WORK-004`;`VF-WORK-006` | `EV-WORK-PROMOTE-*`;`EV-WORK-CFG-*` |
| Outbox / consumer / jobs / reconciliation | `AC-WORK-013`;`AC-WORK-019`;`AC-WORK-029` | `EV-WORK-OPS-*`;`reports/runs/<run_id>/evidence-index.md` |
| Config / reports / redaction | `AC-WORK-024~029`;`VF-WORK-008` | `EV-WORK-CFG-*`;`reports/runs/<run_id>/redaction-check.md`;`reports/acceptance/veto-checklist.md` |

### 7.5 范围边界图

图类型: 实施范围边界图

图标题: L1-work P0 实施范围与后置能力边界

```text
P0 implementation scope
  |
  +-- work truth center
  |     +-- Project / ProjectMember
  |     +-- Backlog / WorkItem / ChildWorkItem
  |     +-- WorkDependency / WorkBlocker
  |     +-- Iteration / IterationCommitment
  |     +-- PromoteResult / trace / audit / outbox
  |
  +-- controlled implementation seams
  |     +-- external refs / snapshots / resolvers
  |     +-- inbound consumers / outbound events
  |     +-- projection / reconciliation / handoff jobs
  |
  +-- verification surface
        +-- config / redaction / scripts
        +-- tests / artifacts / reports / acceptance

Out of P0 hard scope
  |
  +-- advanced board / workspace product experience
  +-- auto recommendation / auto repair truth
  +-- capacity trend / cross-project dependency intelligence
  +-- production DB / MQ / search / trace / archive product integration
  +-- source repository body / lifecycle ownership
```

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §2。

```markdown
## 2. 实施目标与范围

> 校准来源:
> - `design-calibration/07_implementation_plan_step_02_scope.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“实施目标表”“实施范围表”“非范围表”和“范围到验收项映射表”小节,了解本轮 P0 为什么覆盖 `FR-WORK-001~008`,以及哪些 P1 / P2 能力不得进入硬范围。

本轮实施目标是在 `/home/aris/Projects/quantalithos-work` 中交付一个可编译、可测试、可验收的 Rust 2024 workspace,让 `L1-work` 作为项目工作事实真相仓的 P0 闭环成立。

本轮硬范围覆盖 `FR-WORK-001~FR-WORK-008`、`BR-WORK-001~BR-WORK-027`、`AC-WORK-001~AC-WORK-029` 和 `VF-WORK-001~VF-WORK-008`。实现必须落地 `contracts/domain/application/infra/api/worker/jobs` 七个 workspace member,并覆盖 Project、ProjectMember、Backlog、WorkItem、child WorkItem、WorkDependency、WorkBlocker、Iteration、IterationCommitment、PromoteResult、projection、reference、trace、audit、outbox、handoff、jobs、config、tests、reports 和 artifacts。

本轮不交付高级看板、多视图偏好、自动维护建议、容量趋势、工具能力治理协同、跨项目依赖理解、真实生产 DB / MQ / search / trace / archive 产品集成、config center、hot reload、admin override、deployment runbook 或真实跨仓端到端产品验收。P0 可使用 in-memory / fake / controlled adapter 证明本仓闭环,但不得把 fake success 写成 production success。
```

## 9. 待确认事项

无阻塞进入 Step 3 的待确认事项。

后续必须继续收口:

- Step 3 固定实施前阅读清单,确保实现 agent 开工前读取 Rust 编码规范、提交规范、目录组织规范、详细设计和对应校准来源。
- Step 3 固定目标实现仓 `/home/aris/Projects/quantalithos-work` 建仓 / 初始化检查和 `core-contracts` commit 基线。
- Step 5 / Step 6 拆 phase / commit boundary 时,必须持续防止 `FR-WORK-E01~E05`、真实生产集成和自动修写真相进入 P0 硬范围。
- Step 7 必须把 `AC-WORK-001~029`、`VF-WORK-001~008` 和 `EV-WORK-*` 嵌入阶段门禁,不能最后统一验收。

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 本轮目标已明确 | 已满足 |
| 实施范围已能追溯到上游编号 | 已满足 |
| 非范围已显式写出 | 已满足 |
| P0 / P1 / P2 边界已明确 | 已满足 |
| 已形成实施目标表 | 已满足 |
| 已形成实施范围表 | 已满足 |
| 已形成非范围表 | 已满足 |
| 已形成范围到验收项映射表 | 已满足 |

结论:可以进入 Step 3,收稳前置条件与阅读清单。
