# Step 6. 拆分阶段任务、编写顺序与提交边界

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 6  
> 书写规范：`standards/document/实施计划书写规范.md` §4.4～§4.7.3、§4.9  
> 可落码标准：`standards/document/设计真相源闭环与可落码性标准.md` §九  
> 实施台账规范：`standards/document/代码实施台账与门禁规范.md`
> 回填章节：未来正式 `projects/L5-runner/07-实施计划.md` §6  
> 执行方式：`full-restart + single-agent-serial`

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| `current_document` | `07-实施计划.md` calibration |
| `current_step` | `Step 6` |
| `current_module` | `tasks_code_batches_commit_boundaries` |
| `status` | `completed / self_reviewed` |
| `gate_status` | `pass_for_step_07` |
| `gate_reason` | 六个 phase 已逐一拆成 18 个计划性 commit boundary；每个 boundary 均有任务、编写顺序、代码批次、包含/不包含、台账规则、开工前闭环复核、§九经验复核、提交粒度判断和停审记录。当前实现仓、技术 authority、外部正向 seam、真实 run/baseline 和测试证据仍保持 blocked/waiting/not_created。 |
| `formal_07_write_allowed` | `false_until_step_13_assembly` |
| `implementation_write_allowed` | `false` |
| `test_execution_allowed` | `false` |
| `implementation_ledger_allowed` | `false_until_step_13_assembly` |
| `commit_required` | `false` |
| `next_allowed_action` | 创建并完成 `07_implementation_plan_step_07_test_acceptance_gates.md`；完成后停审 |

本 Step 只收敛实施计划的任务和提交边界。`commit-ph-*`、`BATCH-PH*-*`、ledger path 和 gate 均是未来 implementation handoff 的计划标识，不表示实现仓、代码、提交或测试已存在。

## 2. 本步输入、输出与执行约束

### 2.1 本步输入

| 输入 | 承接内容 | 使用上限 |
|---|---|---|
| `07_implementation_plan_step_05_phases_dependencies.md` | `PH-01`～`PH-06` 的可验证增量、依赖、阅读矩阵和停审结论 | 只在既定六阶段内拆任务；不新增 phase |
| `03-详细设计.md` §5～§16 及 03 Step 5～19 | 七逻辑模块、17 个对象、14 个 semantic port、11 Command、12 Query、4 planned Consumer、0 outbound event、5 Job、flow/state/UoW/错误/配置/观测/test-cut | 只转译实现顺序；不补字段、DTO、外部 owner truth 或技术产品 |
| `04-配置设计.md` §3～§13 | 41 项、四 profile、strict source、builder/readiness、failure/change/rollback | 只绑定配置门禁；不写真实 secret、endpoint 或生产值 |
| `05-测试方案.md` §3～§14 | 18 CUT、108 planned TC、12 suite、18 evidence slot、artifact/report path 和失败分类 | 只引用 planned gate；不生成执行结果或证据实例 |
| `06-验收标准.md` §3～§14 | 11 AC、AR/TX/NFA/VETO、fixed-run、handoff 和 verdict 语义 | 只嵌入验收门禁；不生成 verdict/signoff/readiness |
| 实施计划 SOP/书写规范/中间产物规范/台账规范 | phase/boundary 小循环、批次规模、台账 schema、Commit/Handoff Gate | 不以本 Step 重定义通用规范 |

### 2.2 本步输出

- 六个 phase 的阶段任务表和阶段内编写顺序；
- 18 个 `commit-ph-*` 的代码批次、提交时机、包含/不包含和验证门禁；
- 每个 boundary 的 planned implementation-ledger 路径、allowed/forbidden scope、required checks、Commit Gate、Handoff Gate；
- 每个 boundary 的字段、DTO、状态、typed ref、validation truth、metadata/idempotency、projection/rebuild、artifact materialization 和 phase-boundary 复核；
- 每个 boundary 从可落码标准 §九选择的经验项及 `通过 / 不适用 / blocker` 结论；
- 每个 boundary 停审记录与跨 boundary 依赖、粒度、测试、证据审计；
- 可回填未来正式 `07` §6 的草稿。

### 2.3 强制约束与边界

1. 任务以可验证功能动作命名，不以个人待办、单文件或单函数命名。
2. 代码批次按功能切片拆分；预计超过 300 行拆分，超过 500 行必须拆分；状态、事务、幂等、安全、恢复、Consumer、Job 和证据生成即使很小也独立验证。
3. 18 个 boundary 只使用逻辑模块名和语义端口名；不写 Rust、Tauri、Docker、gVisor、Firecracker、crate、package、binary、具体源码路径、数据库、cache backend、locking 产品、exact SDK method、transport、topic 或 owner DTO。
4. Runner outbound event/outbox/publisher/topic 数量固定为 0；任何“发布”字样只可指外部 owner handoff 的输入/读取边界或报告生成，不得创造 Runner-owned event。
5. Query 必须 no-write；Consumer 当前仅 header-first negative/strict stored duplicate；Job 只维护 Runner-owned 本地技术状态；`Accepted ≠ Running`、`Complete ≠ Verified ≠ Qualified`、`Confirmed ≠ Cleaned`、handoff receipt 不等 formal evidence。
6. 未来 implementation ledger skeleton 只能在 Step 13 创建；本 Step 只列计划路径和内容，不创建 `implementation_execution_ledger.md` 或 `implementation-boundaries/` 文件。
7. 设计者负责移交前经验复核；实现者只做二次校验，发现 schema/port/state/mapper/config/evidence 缺口必须 `wait_design`，不得在代码仓现场补口。

## 3. SOP 问题回答

| SOP 问题 | Runner 本步回答 | 处理结论 |
|---|---|---|
| 每个阶段有哪些实施动作？ | 先建立配置/测试/证据骨架，再按 context/selection/material、run/control/recovery、query/presentation、Consumer/Job/report、selected integration/handoff 纵切推进。 | 任务归属 `PH-01`～`PH-06`，不跨 phase 借用后续 truth。 |
| 阶段内先写什么？ | 先写 public contract 和 required carrier，再写 domain/state，再写 application flow/UoW，再写 adapter/entry/worker/operations，最后绑定测试和报告能力。 | 每个 phase 的任务序号均保持 contract → state → flow → boundary entry → gate。 |
| 是否先锁外部契约和测试切口？ | 是；外部 seam 只锁 semantic port、typed outcome、availability 和 blocked posture；测试切口先绑定正式 TC/CUT，不等待实现后再猜。 | exact owner DTO/API 未闭合时启用 negative lane 或暂停 positive lane。 |
| 哪些内容必须同提交？ | 同一可验证增量的 public secondary types、domain transition、必要的 service/port 和对应测试必须同 boundary；不同状态轴、后续 Query/Job/报告不混入。 | 每个 boundary 的子功能表给出共同提交理由。 |
| 哪些内容必须分开？ | selection/material 与 run/control、Query 与 mutation、Consumer 与 Job、脚本能力与真实 handoff、semantic adapter 与 release report 分开。 | 通过 phase boundary 和 18 个 boundary 隔离。 |
| 什么时候可以提交？ | 一个 boundary 的 scope、设计复核、目标测试/静态门禁、diff 和 message 检查都满足后；当前阶段不执行 commit。 | Commit Gate 只写未来条件，不声称通过。 |
| 哪些时机不能提交？ | 代码不能构造正式 DTO、门禁未执行/失败、设计 baseline 变化、外部 effect unknown 未冻结、证据跨 run、无关改动混入或需要现场发明 schema 时。 | `blocked`/`wait_design`，不提交 WIP。 |
| 如何处理大批次？ | PH-03、PH-05、PH-06 的高风险批次按状态/事务、header/receipt、claim/checkpoint、adapter/report 子批次编写；最终仍按一个可审查 boundary 组织。 | 预计规模写为 `100~300` 或 `需拆分`，不按文件机械提交。 |
| 经验复核由谁完成？ | 设计者在移交前逐 boundary 选择 §九适用项并回写 blocker；实现者只复核 baseline、allowed scope 和证据。 | 未闭口项不能写“实现时确认”。 |
| 如何处理 Runner 没有 outbound event？ | 所有 boundary 都把 outbox source identity 标为不适用，并要求 event/outbox/publisher/topic=0 静态/调用图扫描；不得为满足模板新增事件。 | 负向证据属于 PH-05/PH-06 门禁，不是功能交付。 |
| 当前是否能独立验证各 boundary？ | 设计层可以定义验证切口；执行层受 `RUN-DDD-*`、`RUN-UP-*`、`RUN-OPS-*`、`RUN-DOC-003` 阻断，不能生成 pass。 | boundary 状态统一为 planned/blocked/waiting。 |

## 4. 当前文档问题诊断

| 问题 | 影响 | Step 6 处理 |
|---|---|---|
| Step 5 只有六个 phase，没有可 review 的提交面 | 实现者可能按对象/文件随意切提交，无法回退和审计 | 以可验证安全增量拆成 18 个 boundary，并为每个 boundary 建 planned ledger 规则。 |
| 物理布局、语言/runtime 和 store/cache 未授权 | 直接写源码路径或工具命令会继承历史技术选择 | allowed scope 使用逻辑模块/语义规则；物理命名留到 authority gate。 |
| Runner 的 Query、Consumer、Job side-effect 红线不同 | 统一尾期实现会把 no-write/no-ACK/no-owner-repair 漏掉 | 分别在 PH-04、PH-05 建独立 boundary 和 gate。 |
| external effect 与 local truth 的事务顺序有高风险 | 可能把 ACK/PID/HTTP 成功写成 Running 或把 Unknown 自动重放 | PH-03 单独拆 intent/guard/recovery 与 UoW/unknown boundary。 |
| planned TC/evidence 容易被误当成已通过 | 会伪造测试、artifact、report 或 release readiness | 每个 boundary 只引用 planned suite/TC/slot；Commit/Handoff Gate 明确 `not_run` 和 pairing 要求。 |
| 未来 implementation ledger 需要完整 skeleton，但当前不能创建 | 提前建文件会把计划误写成实现事实 | 本 Step 只定义 path/schema；Step 13 一次性按最终 matrix 预创建。 |

## 5. 改动前后对比

| 项 | Step 6 前 | Step 6 收口后 | 原因 |
|---|---|---|---|
| 阶段任务 | 只有 phase 级目标 | 每个 phase 有有序任务、输入、输出和完成判定 | 可追踪实施动作和回退点 |
| 编写顺序 | 只有模块依赖图 | contract → state → flow → adapter/entry → gate 的批次顺序 | 防止实现者先写 UI/adapter 再猜 domain truth |
| 提交边界 | 未定义 | 18 个可一句话描述、可 review/验证/回退的 boundary | 固定提交粒度和 phase boundary |
| 经验复核 | 可能留给实现者现场发现 | 设计者逐 boundary 复核 §九并记录不适用理由 | 在移交前暴露闭环缺口 |
| 台账 | 只知道未来需要 ledger | 每个 boundary 均有 planned path、scope、checks、Commit/Handoff Gate | Step 13 可无歧义生成 skeleton |
| 证据 | 可能集中到最后 | 每个 boundary 指定 raw/report/check 责任，最终 evidence 仍受 fixed-run 约束 | 防止静态 evidence 和跨 run 拼接 |

## 6. 设计取舍

| 方案 | 优点 | 风险/代价 | 结论 |
|---|---|---|---|
| 按 17 个对象各提交 | 对象边界清楚 | 无法独立验证用户能力，跨对象状态会被拆断 | 不采用 |
| 每个 phase 一笔提交 | 提交少 | PH-03/PH-05/PH-06 高风险且难回退 | 不采用 |
| 按可验证安全增量拆 18 个 boundary | 可 review、验证、回退，能绑定 TC/AC/VETO | 台账和审计表较长 | 采用 |
| 先实现正向 owner adapter | 端到端看似更快 | exact seam 未闭合时会猜 DTO/API，无法 fail-closed | 不采用 |
| semantic/negative shell 先行，positive conditional | 可先验证安全红线和拒绝姿态 | 不能宣称产品 ready | 采用 |
| 以文件路径锁 scope | 具体 | 物理布局未授权，易继承旧技术 | 不采用；以逻辑模块和行为规则锁 scope |
| 为模板创建 Runner outbound event | 形式上完整 | 违反 event=0 和 truth ownership | 不采用；保留 no-residue scan |

## 7. 结构化中间产物

### 7.1 通用编写顺序与开工前闭环复核

每个 boundary 开工前都必须完成下表。`适用` 表示当前 boundary 必须有正式来源；`不适用` 必须写出具体原因；任一适用项缺少正式 schema/port/flow/state/persistence/test 位置时，boundary 只能 `blocked / wait_design`。

| 复核项 | 统一检查口径 | 失败处理 |
|---|---|---|
| 字段闭环 | domain truth、状态条件字段、reason、actor、time、source、version、generation 和 optional/empty 语义有唯一来源 | 回写 03；不得由实现者补字段 |
| DTO 构造闭环 | command/query/consumer/job request、result、receipt 或 report 能构造目标 domain/service input；二级 carrier 有 owner 和完整 schema | 回写 03 protocol/flow；不得临时填 struct |
| 状态闭环 | enum、factory 初始值、合法 transition、错误映射、TC/AC/VETO 使用同一正式名称 | 回写 03 state/error/test/acceptance |
| Typed ref / identity | public generic ref、repository typed ref、scope/ref kind、canonical subject key 和 lookup key 分离且可回指 | 回写 03 object/port；禁止字符串解析或 fake 私有 key |
| Validation truth | 每条 authority、scope、digest、generation、visibility、resource、redaction、readiness 校验都有 truth source/semantic port | 回写 03/04；不得用 cache、ACK、PID、HTTP code 或错误文本推导 |
| Metadata / idempotency | trusted actor/scope/trace/issued-at、operation namespace、canonical digest、expected version、reservation、stored result/ref 和 UoW 顺序闭合 | 回写 03 protocol/persistence/concurrency |
| Projection / rebuild | read model、section、stale marker、generation/version guard 和 rebuild truth source 成对；缺 identity 不 upsert | 回写 03 persistence/flow；Query 不能隐式 refresh |
| Artifact materialization | 本 boundary 若写 artifact/report/check，root、run_id、schema、digest、redaction、pairing 和 reader/writer owner 明确 | 回写 05/06/07；不能创建静态 evidence |
| Accepted side-effect inventory | accepted flow 的 local truth、trace/audit、stale、stored result 和 external effect 分项列出；Runner event/outbox 永远为 0 | 回写 03 flow/persistence；不得隐式发 event |
| Phase boundary | 不引用后续 phase 对象、结果、证据或未授权 positive seam；reserved 状态只保留形状，不进入当前测试要求 | 调整 boundary 或标 `blocked` |

### 7.2 通用代码批次与提交前检查

| 检查面 | 未来执行要求 | 当前状态/失败处理 |
|---|---|---|
| Design Gate | 读取项目台账、当前 boundary 台账、正式 03/05/06/07 及必要 calibration；确认不可变 design baseline | 当前无实现 baseline；`blocked / wait_design` |
| Scope Gate | 工作区只触碰 allowed scope；无用户无关改动、跨 boundary 重构或物理路径越界 | 当前不执行；未来失败则 `fix_gate_failure` |
| Toolchain Gate | 语言/runtime/format/build/lint/test 命令由正式 authority 在 Step 8/11 绑定；本计划不猜命令 | `RUN-DDD-002` 未关闭；不能以历史命令代替 |
| Contract/State Gate | 当前 boundary 的 schema、状态、factory、mapper、错误和测试切口闭合 | 缺口回写设计并暂停 |
| Negative boundary scan | no `latest/default/newest`、no private Sandbox implementation、no direct DB/bus/topic、no owner write、no outbound event | 失败即阻断，不以 warning 继续 |
| Targeted test Gate | 只跑当前 boundary 声明的 CUT/suite；positive blocked/not_run 与 semantic negative 分开记 | 当前不执行，不能生成结果 |
| Artifact/Report Gate | 若有输出，必须同一 `run_id`、source digest、artifact/report/check pairing；不存在实例则 `not_created` | 跨 run、静态文件或缺 pair 即阻断 |
| Commit Gate | staged scope、diff/whitespace、message、boundary mapping、required checks 全通过 | 当前 `commit_required=false`；未来未通过不得提交 |
| Handoff Gate | boundary 台账回写 baseline、实际 gate 状态、阻塞项、下一 boundary；无伪造 hash/result | 当前不移交；未来缺记录则 `handoff` 不通过 |

### 7.3 Planned boundary 台账规则

Step 13 预创建的每个 boundary 台账必须使用以下逻辑；本 Step 不创建文件。

| 字段 | planned 口径 |
|---|---|
| ledger file | `projects/L5-runner/design-calibration/implementation-boundaries/<boundary_id>.md` |
| status | 当前 boundary 以外统一 `planned`;当前实现尚未授权，不能写 `pass` |
| next_allowed_action | `wait_until_current`；若设计缺口出现则 `wait_design` |
| allowed scope | 本 Step 对应的逻辑模块、语义 port/adapter 和测试/证据责任；不写死物理路径 |
| forbidden scope | 后续 phase 对象、owner truth、private implementation、未授权正向 payload、Runner outbound event、跨 run evidence |
| required reads | 正式 03/04/05/06 对应章节、当前 Step calibration、项目台账和 flow；冲突以正式文档为准 |
| Commit Gate | scope、设计闭环、目标 checks、diff、message 和 planned evidence pairing 条件满足后才可 `commit` |
| Handoff Gate | 记录真实 baseline、实际 check 状态、commit（若用户授权）、blocker 和下一 boundary；当前均为 future/blocked |

### 7.4 Boundary 编号与提交纪律

- `commit-ph-01-a`～`commit-ph-01-b` 属于 `PH-01`；`commit-ph-02-a`～`commit-ph-02-c` 属于 `PH-02`；依此类推，至 `commit-ph-06-b`，共 18 个 boundary。
- 一个 commit 只能对应一个 boundary；不能把同 phase 的多个 boundary 合并，也不能按单文件、单 struct 或当天工作量拆散。
- commit message 的真实实现仓格式由 Step 11 再收口；当前只固定“英文 `type(scope): subject`、body 按子功能分组、footer 遵守目标仓规则”的原则，不生成 message、hash 或 commit 事实。
- 一个 boundary 内的多个代码批次可以先分批本地验证，最终在该 boundary 的 Commit Gate 通过后形成一笔提交；若批次之间出现独立可回退的功能，应重新审查并拆 boundary，而不是临时多提交。

## 8. PH-01 仓、配置、测试与证据前置

### 8.1 阶段任务表与编写顺序

| 任务编号 | 顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| `IMPL-01-01` | 1 | 核验目标实现仓、语言/runtime/入口 authority、逻辑模块装配和依赖分类 | 03 §3～§5；Step 3/4；`RUN-DDD-001~003` | authority decision record、逻辑 composition map、blocked 物理落点清单 | authority、路径、命名、依赖类型可追溯；未获 authority 则保持 blocked |
| `IMPL-01-02` | 2 | 编写 strict configuration contract、profile posture、validated snapshot 与 builder/readiness 语义壳 | 04 §3～§12；41 项/四 profile | 配置 schema/来源/失败映射、configured/enabled/ready marker 设计 | unknown/duplicate/invalid/缺 required guarantee 的整份拒绝口径可测试 |
| `IMPL-01-03` | 3 | 编写 deterministic fixture、fault、redaction corpus、header、claim/checkpoint 和 run/artifact/report manifest 合同 | 05 §7～§8、§13；06 §3、§10 | test data registry、same-run path contract、manifest schema 计划 | 数据不含真实 secret/body；所有 root 需要显式 run/profile，不接受隐式 selector |
| `IMPL-01-04` | 4 | 建立 gate/check/report capability 的逻辑入口与事件零残留扫描责任 | 05 §9、§13；06 §10～§12 | gate/check/report 入口责任表、event/outbox/topic=0 scan contract | 只生成计划性能力；不生成 artifact/report/evidence 实例 |

### 8.2 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| `BATCH-01-01` | authority 与逻辑 composition 壳 | 03 §3～§5；Step 3 | logical module registry、dependency classification、blocked physical checklist | `100~300` 行；物理落点待 authority | contract/path review；当前不执行 | `commit-ph-01-a` |
| `BATCH-01-02` | strict config/profile/readiness contract | 04 §3～§12 | 41 项 binding map、四 profile posture、immutable snapshot/builder/readiness marker | `需拆分`；schema 与 failure mapping 分批 | config contract/static negative | `commit-ph-01-b` |
| `BATCH-01-03` | fixture、manifest、artifact/report path contract | 05 §7～§9/§13；06 §3/§10 | deterministic dataset registry、run/artifact/report pairing shape | `100~300` 行；不写实例 | path/pairing/redaction review | `commit-ph-01-b` |
| `BATCH-01-04` | gate/check/report/event-zero capability | 05 §9/§13；06 §10～§12 | future gate/check/report responsibility and no-residue scan | `100~300` 行；脚本实现受 Step 8/11 authority | dry-run contract/static scan plan | `commit-ph-01-b` |

### 8.3 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| `commit-ph-01-a` | authority、逻辑 composition、依赖分类和物理 blocker 记录均闭合后 | logical module composition、semantic dependency map、target-repo/manifest authority check、blocked physical layout record | 业务 DTO/domain transition、真实 adapter、store backend、测试实例、脚本输出 | Design/Scope Gate；`RUN-DDD-001~003` 状态核验；path/dependency boundary review；diff/message review |
| `commit-ph-01-b` | config contract、fixture/path contract、gate/check/report capability 壳完成并能被静态审查后 | strict config/profile/readiness contract、fixture/manifest/path rules、gate/check/report responsibility、event-zero scan contract | 选择/运行业务 flow、owner body、真实下载/启动、实际 artifact/report/evidence、release verdict | config/schema negative review；same-run/pairing/redaction review；no-residue scan design；当前不执行测试 |

### 8.4 Commit boundary 实施台账规则

| Boundary | planned ledger file | allowed scope | forbidden scope | required reads/checks | Commit Gate | Handoff Gate |
|---|---|---|---|---|---|---|
| `commit-ph-01-a` | `implementation-boundaries/commit-ph-01-a.md` | authority、逻辑模块、依赖分类、物理 blocker 记录 | 具体语言/package/path、业务 truth、owner/private implementation | 03 §3～§5；Step 3/4；scope/dependency review | 只含该 boundary；无技术猜测；检查记录完整 | baseline（未来）+ blocker + 下一 boundary；无 commit/hash 事实 |
| `commit-ph-01-b` | `implementation-boundaries/commit-ph-01-b.md` | config contract、profile/readiness、fixture/path/gate capability 逻辑面 | real secret、endpoint、run/artifact/report/evidence 实例、outbound event | 04 §3～§12；05 §7～§9/§13；06 §10 | schema、pairing、redaction、event-zero 规则闭合 | future check 状态、not_created 产物和 PH-02 入口 |

### 8.5 子功能分组与开工闭环

| Boundary | 子功能分组 | 必须同提交的理由 | 涉及批次 | 关键复核 | 不包含 |
|---|---|---|---|---|---|
| `commit-ph-01-a` | authority decision + logical composition + dependency classification | 后续 boundary 必须以同一逻辑装配和依赖方向为基线；拆开会允许实现者自行选技术 | `BATCH-01-01` | path baseline、phase boundary、typed module ownership | config/业务 flow/adapter |
| `commit-ph-01-b` | strict config + deterministic data/path contract + gate capability | 配置、测试数据和报告路径共同定义后续验证的输入/输出边界，不能各自发明 root/profile | `BATCH-01-02`～`01-04` | config binding、artifact materialization、metadata/run identity、phase boundary | business DTO、owner positive、实际证据 |

| 复核项 | `commit-ph-01-a` | `commit-ph-01-b` |
|---|---|---|
| 字段/DTO/状态 | 不适用：只建逻辑装配与 blocker record；不得新增业务字段 | 适用配置 snapshot/profile marker；schema、unknown/duplicate/failure variant 必须闭合 |
| typed ref / validation truth | 适用 authority/path identity；来源只能是正式 authority 或项目台账 | 适用 profile/config source、run/artifact root；不得从环境默认值推导 |
| metadata/idempotency | 不适用：尚无 command/job mutation | 适用 manifest/run identity 计划；不生成 operation result |
| projection/rebuild | 不适用：尚无 read model | 不适用：path/index 不是 projection truth |
| artifact materialization | 不适用：只记录未来 root/schema 责任 | 适用：writer/reader、run pairing、redaction 和 schema 责任必须闭合 |
| phase boundary | 通过：不进入 PH-02 | 通过：不进入业务 flow 或实际 evidence |

### 8.6 §九经验复核与提交粒度停审

| Boundary | 适用经验项 | 不适用理由 | 结论 | 设计者处理 / 实现者责任 |
|---|---|---|---|---|
| `commit-ph-01-a` | path baseline、typed module ownership、phase boundary | command/query/state/UoW/outbox/job/projection 尚未引入 | 设计层通过；执行仍 physical blocked | authority 缺失先回写；实现者只二次核验 |
| `commit-ph-01-b` | config binding、artifact materialization、machine artifact schema（仅计划形状）、phase boundary | domain state、external effect、Consumer payload、Job claim 不在本 boundary | 设计层通过；实例 not_created | schema/root 未闭合则回写 04/05/06；不得现场补 |

| Boundary | 粒度 | 一句话描述 | 独立验证/回退 | 停审结论 |
|---|---|---|---|---|
| `commit-ph-01-a` | 适中 | “固定实现 authority 与逻辑装配边界” | 可做 scope/dependency review；可单独回退 | 通过；目标仓和技术 authority 仍为开工 blocker |
| `commit-ph-01-b` | 适中 | “固定配置、测试数据和证据路径合同” | 可做 schema/path/redaction review；不依赖业务代码 | 通过；不得把计划 shell 当执行结果 |

## 9. PH-02 Context、显式选择与材料资格

### 9.1 阶段任务表与编写顺序

| 任务编号 | 顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| `IMPL-02-01` | 1 | 编写 `RunnerContextRef`、selection generation、exact release/version binding、command/query secondary types 和 deterministic fixtures | 03 Step 6/8；C01/C02、Q01～Q03 | context/selection public contract | 所有 ref、scope、generation、actor、source/freshness 字段可构造；隐式 selector 被拒绝 |
| `IMPL-02-02` | 2 | 编写 `ReleaseSelection` domain、generation fence、invalidate/current/stale/blocked transition 与单元切口 | 03 Step 6/10 | local selection truth 与 state transition | 初始状态保留 C01 可执行迁移；不把 authority 判定写入 local shortcut |
| `IMPL-02-03` | 3 | 编写 acquisition/integrity/cache contracts、domain objects、qualification axes 与 C03～C06 flow input | 03 Step 6/8/10；AC-RUN-003/004 | task、integrity posture、cache entry、binding/error surface | transfer、verification、qualification、cache/protection 分轴闭合 |
| `IMPL-02-04` | 4 | 编写 selection/material application services、local repositories、idempotency/UoW 与 semantic adapter negative mapping | 03 Step 7/9/11/13；04 builder/readiness | C01～C06 service slice、blocked/unknown result | duplicate zero-effect、version/generation conflict、authority/source unavailable 均有 typed result |
| `IMPL-02-05` | 5 | 绑定 authority/source/verifier/cache 的 conditional adapter slot 与 Q01～Q05 safe views | 03 required ports；RUN-UP-001/002/008 | adapter registry/availability posture、safe query surface | positive seam 未闭合时只输出 Blocked/Unavailable/Unknown，不声称 qualified |

### 9.2 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| `BATCH-02-01` | context/selection public contracts | 03 Step 6/8；CUT-01/02 | refs、binding、generation、C01/C02/Q01～Q03 DTO/fixtures | `需拆分`；secondary types 与 envelope 分批 | contract/schema negative | `commit-ph-02-a` |
| `BATCH-02-02` | selection domain/state | 03 Step 6/10；CUT-01/02 | selection factory、fence、state tests | `200~400` 行；state 单独验证 | domain selection slice | `commit-ph-02-a` |
| `BATCH-02-03` | acquisition/integrity/cache contracts/domain | 03 Step 6/8/10；CUT-03/04/16 | task/cache/integrity objects、qualification markers | `需拆分`；integrity/cache 分批 | contract-domain material slice | `commit-ph-02-b` |
| `BATCH-02-04` | local service/UoW/idempotency | 03 Step 7/9/11/13；CUT-01～04/13 | C01～C06 services、repositories、stored result/RecoveryCase mapping | `需拆分`；external-read path 与 local mutation path 分批 | service-flow semantic negative | `commit-ph-02-b` |
| `BATCH-02-05` | conditional adapter/read views | 03 Step 7/8/9；Q01～Q05 | semantic adapter slots、availability marker、safe query sections | `200~400` 行；positive adapter reserved | controlled negative/query no-write | `commit-ph-02-c` |

### 9.3 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| `commit-ph-02-a` | context/selection DTO、domain state、generation/invalidate tests 通过后 | context/selection typed contracts、selection truth、C01/C02 local transitions、fixtures | acquisition task、integrity/cache、Sandbox/Runtime、Query projection persistence、Consumer/Job | contract-domain selection；implicit-selector negative；state/generation review |
| `commit-ph-02-b` | acquisition/integrity/cache contracts/domain 与 C03～C06 local service tests 通过后 | task/integrity/cache objects、qualification axes、C03～C06 services、UoW/idempotency、local repository/fake semantics | run/control、real download/verification algorithm、owner adapter positive、Q09+、Consumer/Job | material contract/domain/service negative；duplicate/version/generation checks |
| `commit-ph-02-c` | semantic authority/source/verifier/cache slots、Q01～Q05 safe sections 和 availability mapping 通过后 | conditional adapter registry、typed blocked/unsupported/unavailable outcomes、context/selection/material query views | external private implementation、actual Release bytes/body、Sandbox request、running/cleanup、formal evidence | SDK/API boundary scan；query no-write；authority/cache bypass veto checks |

### 9.4 Commit boundary 实施台账规则

| Boundary | planned ledger file | allowed scope | forbidden scope | required reads/checks | Commit Gate | Handoff Gate |
|---|---|---|---|---|---|---|
| `commit-ph-02-a` | `implementation-boundaries/commit-ph-02-a.md` | contracts/domain context-selection、C01/C02 | implicit selector、authority-local approval、material/run state | 03 Step 6/8/10/16；05 CUT-01/02；06 AC-001/002 | DTO/state/ref/generation and negative checks | record future baseline、selection blocker、PH-02-b handoff |
| `commit-ph-02-b` | `implementation-boundaries/commit-ph-02-b.md` | material objects、C03～C06、local UoW/idempotency、repository semantics | bytes/body、verification algorithm invention、Sandbox/Runtime、Query side effect | 03 Step 7/9/11/13；05 CUT-03/04/13/16；06 AC-003/004 | duplicate/version/qualification posture recorded; no positive claim |
| `commit-ph-02-c` | `implementation-boundaries/commit-ph-02-c.md` | semantic external slots、availability、Q01～Q05 safe read | private SDK/DB/bus, cache-as-authority, actual qualified result | 03 required ports；05 S-RUN-CONTROLLED/CONFIG;06 AC-001～004 | external seam status and blocked lane recorded |

### 9.5 子功能分组、闭环复核与经验复核

| Boundary | 子功能分组 | 必须同提交的理由 | 不包含 |
|---|---|---|---|
| `commit-ph-02-a` | context/selection contract + selection state/generation | exact immutable selection 的 public identity 与 domain fence 必须同源，否则实现会猜 generation | material/run/control/query projection |
| `commit-ph-02-b` | material axes + local command flow/UoW | task、integrity、cache 和 command result 才能共同证明 Complete 不等 Qualified | external positive/download body |
| `commit-ph-02-c` | semantic adapter outcome + safe query sections | availability/blocked posture 是 query 和 service 的共同边界；拆开会产生不同 failure mapping | private implementation/owner truth |

| 复核项 | `02-a` | `02-b` | `02-c` |
|---|---|---|---|
| 字段/DTO/状态 | selection binding、generation、authority marker、invalidate state 闭合 | task/cache/integrity required fields、axis states、C03～C06 result 闭合 | adapter availability、safe section、visibility/freshness/degraded 闭合 |
| typed ref / validation truth | Release/version/scope/generation 只能来自 explicit input/formal source | locator/manifest/digest/qualification 只能来自 formal source/verifier port | adapter outcome 和 authority posture 不能由 HTTP/cache/错误文本推导 |
| metadata/idempotency | C01/C02 key/digest/result/ref/UoW 闭合 | C03～C06 duplicate/version/result/RecoveryCase 闭合 | Query 无 reservation；adapter read 不改变 truth |
| projection/rebuild | 不适用：selection truth 非 projection | 不适用：material local truth 尚未 read model | Q01～Q05 只读；无隐式 rebuild/upsert |
| artifact materialization | 不适用 | 不适用：无报告输出 | 只定义 safe source/availability marker，不生成 evidence |
| phase boundary | 不进入 material/run | 不进入 Sandbox/Runtime/diagnosis/Job | 不进入 positive owner integration |

| Boundary | §九适用经验项 | 不适用理由 | 结论 |
|---|---|---|---|
| `commit-ph-02-a` | 字段、DTO、状态、typed ref、validation truth、metadata/idempotency、phase boundary | Query projection、job、artifact 不在当前增量 | 设计层通过；authority/physical blocked |
| `commit-ph-02-b` | 字段、DTO、状态、validation truth、optimistic version、idempotency、side-effect inventory、phase boundary | Consumer、outbound event、presentation Query 不在当前增量 | 设计层通过；verifier/cache backend blocked |
| `commit-ph-02-c` | validation truth、config binding、Query response/visibility、phase boundary、SDK/public adapter boundary | domain transition、Job claim/checkpoint、artifact report 不在当前增量 | 设计层通过；positive seam blocked |

### 9.6 提交粒度与停审

| Boundary | 粒度判断 | 独立验证/回退 | 停审结论 |
|---|---|---|---|
| `commit-ph-02-a` | 适中 | selection contract/domain 可单独审查和回退 | 通过；不得提前暴露 qualified/run |
| `commit-ph-02-b` | 偏大但必要；批次拆写 | material axes 与 local commands 可按批次验证，最终同一资格增量提交 | 通过；Complete/Verified/Qualified 不得合并 |
| `commit-ph-02-c` | 适中 | adapter availability/query safe view 可单独负向验证 | 通过；positive seam 缺失保持 waiting |

## 10. PH-03 请求、控制、资源与恢复

### 10.1 阶段任务表与编写顺序

| 任务编号 | 顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| `IMPL-03-01` | 1 | 编写 `RunIntent`、`ControlIntent`、`OwnerRunProjection`、owner basis 与 control-kind contracts | 03 Step 6/8；C07/C08；AC-RUN-005/006 | request/control/result DTO 与 body-free owner projection | Accepted、Running、terminal 和 control posture 分轴可构造 |
| `IMPL-03-02` | 2 | 编写 run/control domain transition、resource observation、ProtectionGuard 和 cleanup basis | 03 Step 6/10/11；C09；AC-RUN-007/008 | local intent/guard state、expected basis、resource conflict posture | probe、allocation/lease、cleanup、protection 不混淆；guard 缺失 fail-closed |
| `IMPL-03-03` | 3 | 编写 Sandbox/Runtime/platform semantic adapter slots、UoW external-effect 顺序和 stored result | 03 Step 7/9/11/13；RUN-UP-003/004/007 | typed accepted/rejected/unknown/blocked outcomes、transaction orchestration | ACK/PID/port 不构造 Running；external unknown 进入 RecoveryCase |
| `IMPL-03-04` | 4 | 编写 RecoveryCase、manual review、disconnect/restart/expiry/reconciliation basis 及 Q06～Q08 safe reads | 03 Step 8～12；J03；AC-RUN-009 | frozen/manual-review/reconciled/conflict posture、read-only recovery views | 无自动 replay/resend/reclaim/resume；Query zero-write |
| `IMPL-03-05` | 5 | 编写 RequestRun/Control/Cleanup、OpenManualReview application flows 与 resource/recovery tests | 03 flows/state/persistence；05 CUT-03～07/11/12/15/18；06 AC/ TX/VETO | C07～C10 service slice、typed issue/recovery report | idempotency、version、guard、effect ordering 和 no-replay 切口均绑定 |

### 10.2 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| `BATCH-03-01` | lifecycle/control contracts 与 domain | 03 Step 6/8/10；CUT-05/06 | run/control intent、owner basis/projection、state tests | `200~400` 行；按 run/control 分批 | contract-domain lifecycle | `commit-ph-03-a` |
| `BATCH-03-02` | resource/protection contracts/domain | 03 Step 6/10；CUT-07/12/18 | observation、guard、cleanup basis、conflict tests | `200~400` 行 | guard/resource negative | `commit-ph-03-a` |
| `BATCH-03-03` | external-effect orchestration/UoW | 03 Step 7/9/11/13；TX-001/002/006 | semantic adapter calls、reservation、stored result、unknown mapper | `需拆分`；transaction and adapter outcome separate | S-RUN-SERVICE/UOW/CONTROLLED | `commit-ph-03-b` |
| `BATCH-03-04` | RecoveryCase/manual review | 03 Step 6/8/9/10/12；CUT-11/12/18 | recovery transitions、manual review command/result、readback basis | `200~400` 行 | recovery/no-replay | `commit-ph-03-c` |
| `BATCH-03-05` | C07～C10 service and Q06～Q08 reads | 03 flows；05 CUT-03～07/11/12/15/18 | application services, safe query views, fake ports | `需拆分`；C07/C08/C09/C10 分批 | service-flow + query no-write | `commit-ph-03-d` |

### 10.3 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| `commit-ph-03-a` | run/control/resource/guard contracts、domain transition 和 state tests 通过后 | RunIntent、ControlIntent、OwnerRunProjection、ResourceObservation、ProtectionGuard、cleanup basis 与 domain tests | external call、RecoveryCase、Query、Job、真实 Sandbox/Runtime 状态 | DTO/state/ref/source review；Accepted≠Running、Confirmed≠Cleaned 断言 |
| `commit-ph-03-b` | semantic adapter outcome、UoW 顺序、idempotency/stored result 和 controlled negative tests 通过后 | Sandbox/Runtime/platform semantic slots、C07～C09 orchestration、effect unknown mapper、guarded cleanup | 自动恢复、Consumer、diagnosis/handoff、Job runner、owner mutation | S-RUN-SERVICE/UOW/CONTROLLED；TX-001/002/006；zero owner write |
| `commit-ph-03-c` | RecoveryCase/manual review/recovery basis 和 no-replay tests 通过后 | recovery state、manual-review command、readback/reconcile basis、disconnect/expiry mapping | 自动 replay/resend/reclaim/resume、final evidence、release handoff | S-RUN-REPLAY/JOB；AC-RUN-009；VETO-RUN-007；Query/Job 只读边界 |
| `commit-ph-03-d` | C07～C10 services、Q06～Q08 safe views、fake/durable logical parity 通过后 | lifecycle/control/cleanup/manual-review application flows、resource/recovery queries、stored result/report mapping | Q09～Q12 presentation、Consumer payload、Job repair、release | service/query no-write；TX-RUN-001～009；AC-RUN-005～009 |

### 10.4 Commit boundary 实施台账规则

| Boundary | planned ledger file | allowed scope | forbidden scope | required reads/checks | Commit Gate | Handoff Gate |
|---|---|---|---|---|---|---|
| `commit-ph-03-a` | `implementation-boundaries/commit-ph-03-a.md` | lifecycle/resource contracts/domain/guards | external effect、owner truth、RecoveryCase、Query write | 03 Step 6/8/10/16；05 CUT-05～07/12；06 AC-005～008 | state/ref/guard scope and tests | basis/blocker and PH-03-b entry |
| `commit-ph-03-b` | `implementation-boundaries/commit-ph-03-b.md` | semantic adapter slots、UoW、C07～C09 effect orchestration | private Sandbox/Runtime、ACK/PID shortcut、auto replay | 03 Step 7/9/11/13；05 S-RUN-UOW/CONTROLLED；06 TX/VETO | transaction/effect/unknown evidence conditions | no positive claim; external seam status |
| `commit-ph-03-c` | `implementation-boundaries/commit-ph-03-c.md` | RecoveryCase/manual review/readback basis | replay/resend/reclaim/resume、owner repair | 03 Step 10/12/13；05 CUT-11/12/18；06 AC-009/VETO-007 | recovery/no-replay and stored issue surface | recovery blocker and PH-03-d entry |
| `commit-ph-03-d` | `implementation-boundaries/commit-ph-03-d.md` | C07～C10 services、Q06～Q08 no-write read surface | presentation Query、Consumer/Job side effects、release | 03 Step 8/9/11/16；05 S-RUN-SERVICE/ENTRY/UOW；06 AC-005～009 | targeted service/query gates and scope diff | reports only future/not_run; next PH-04 |

### 10.5 子功能分组与开工闭环

| Boundary | 子功能分组 | 必须同提交的理由 | 不包含 |
|---|---|---|---|
| `commit-ph-03-a` | run/control intent + resource/guard state | 请求、控制、资源保护共享 expected basis 与状态红线；拆开会允许 guard 先验收而无 intent 约束 | external adapter/recovery/query |
| `commit-ph-03-b` | effect ordering + typed adapter outcome + guarded cleanup | 外部 effect 的 reserve→call→readback/unknown→local commit 只能由同一事务增量验证 | owner private implementation/auto recovery |
| `commit-ph-03-c` | RecoveryCase + manual review + no-replay | ambiguous effect、断线和人工处理必须共享冻结/预期 basis/issue ref | Job repair/positive owner read |
| `commit-ph-03-d` | lifecycle services + resource/recovery queries | C07～C10 与 Q06～Q08 是同一运行控制纵切，且需同时验证 query no-write | presentation/Consumer/operations |

| 复核项 | `03-a` | `03-b` | `03-c` | `03-d` |
|---|---|---|---|---|
| 字段/DTO/状态 | intent/control/observation/guard fields and transitions | adapter outcome、effect basis、stored result fields | RecoveryCase、manual review、expected basis、issue refs | service result、Q06～Q08 view/marker/empty/degraded |
| typed ref / validation truth | run/control/resource/lease refs 来自正式 input/read port | owner status/lease/cleanup 只能来自 semantic adapter | recovery subjects/basis 来自 persisted case + formal readback | visibility/read subject/scope 来自 query resolver，不从 ref 字符串猜 |
| metadata/idempotency | C07～C09 operation context、digest、expected version、UoW | external effect 前 reservation、unknown 后不重跑 | C10/manual review duplicate replay、stored result | Query 不 reserve/write；command result 明细由 facade 返回 |
| projection/rebuild | OwnerRunProjection 只读 projection | 不适用：effect orchestration 不 rebuild | readback 只形成 recovery posture，不修 owner | Q06～Q08 只读；无 implicit refresh/reconcile |
| artifact materialization | 不适用 | 不适用：local result 尚非报告实例 | issue/recovery record 非 evidence | 只保留 planned report refs，不生成 EV |
| phase boundary | 不进入 presentation/Consumer/Job | 不进入 future payload/release | 不自动进入 PH-04/05 | 不进入 Q09～Q12/operations |

| Boundary | §九适用经验项 | 不适用理由 | 结论 |
|---|---|---|---|
| `commit-ph-03-a` | 字段、DTO、状态、typed ref、validation truth、phase boundary | artifact/report、Consumer/job、projection rebuild 不在当前增量 | 设计层通过；Sandbox/Runtime seam blocked |
| `commit-ph-03-b` | metadata/idempotency、accepted side-effect inventory、UoW/version、validation truth、adapter outcome、phase boundary | Query visibility、Consumer payload、artifact evidence 不在当前增量 | 设计层通过；external effect positive blocked |
| `commit-ph-03-c` | state/error/recovery、idempotency、stored result/receipt、phase boundary | projection rebuild、outbox、final evidence 不适用 | 设计层通过；recovery readback blocked |
| `commit-ph-03-d` | Query response/visibility、entry result details、projection identity（读取）、no-write、phase boundary | Consumer/job/artifact materialization 不在当前 boundary | 设计层通过；store/entry authority blocked |

### 10.6 提交粒度与停审

| Boundary | 粒度判断 | 独立验证/回退 | 停审结论 |
|---|---|---|---|
| `commit-ph-03-a` | 适中 | domain state/guard 可独立验证 | 通过；不表示 owner running/cleanup |
| `commit-ph-03-b` | 偏大但必要；按 effect/transaction 批次写 | 可由 controlled negative/UoW 复核，不能拆成各自改变语义的半提交 | 通过；external positive waiting |
| `commit-ph-03-c` | 适中 | RecoveryCase/manual review 可独立回退 | 通过；Unknown 只能冻结并人工/只读恢复 |
| `commit-ph-03-d` | 适中 | service 和 no-write query 有独立切口 | 通过；Q09～Q12 后置 |

## 11. PH-04 预览、诊断、交接与 Query/read model

### 11.1 阶段任务表与编写顺序

| 任务编号 | 顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| `IMPL-04-01` | 1 | 编写 OutputPreview、FailureDiagnosis、HandoffPosture、RunnerReadSection/RunnerReadModel 和 safe surface secondary types | 03 Step 6/8/14；04 redaction/readiness | bounded/redacted view contract | body、secret、raw path/URL/PID/port/stack 不可构造为 safe surface |
| `IMPL-04-02` | 2 | 编写 visibility/freshness/source/degraded/blocked resolver 与 redaction semantic port slots | 03 Step 7/8/14/15；RUN-UP-005 | visibility decision、redaction outcome、diagnostic source posture | NotVisible/Degraded/Blocked/Unknown 来源明确，不从错误文本合成 |
| `IMPL-04-03` | 3 | 编写 Preview/Diagnosis/Handoff application flows、redaction all-or-nothing 和 handoff unknown recovery | 03 Step 9/11/12/13；C11/Q09～Q11 | C11、Q09～Q11 services、stored posture/receipt | receipt/delivered 不升级 evidence/report/verdict；unknown 不 resend |
| `IMPL-04-04` | 4 | 编写 RunnerReadModel composer、Q12 section lookup、generation/version guard 和 pure entry presentation | 03 Step 7/9/10/11；05 CUT-08～10/17 | Q12 committed safe sections、empty/stale/degraded mapping | Query/render/reconnect 不 save/refresh/reconcile/probe/cleanup/dispatch |
| `IMPL-04-05` | 5 | 编写诊断/预览/交接与 read-model redaction/static tests、handoff source pairing checks | 05 S-RUN-ENTRY/SECURITY；06 AC-010/011、AR-002/005/010/015 | targeted test/check responsibility | local record 与 formal observability evidence 明确分层 |

### 11.2 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| `BATCH-04-01` | safe presentation contracts | 03 Step 6/8/14；CUT-08/09/10/17 | preview/diagnosis/handoff/read-section/view DTO | `需拆分`；每类 view 单独 schema review | contract/redaction | `commit-ph-04-a` |
| `BATCH-04-02` | visibility/redaction/source adapters | 03 Step 7/14/15；04 §7/9/11 | resolver、redaction/diagnostic/handoff semantic slots | `200~400` 行 | security/visibility negative | `commit-ph-04-b` |
| `BATCH-04-03` | C11/Q09～Q11 flows | 03 Step 9/11/12/13；06 AC-010 | handoff/preview/diagnosis services and recovery mapping | `需拆分`；C11 与 Query 分批 | service/redaction/handoff | `commit-ph-04-b` |
| `BATCH-04-04` | Q12 read model/composer | 03 Step 8/9/10/11；CUT-09/17 | section repository lookup、generation guard、pure composer | `200~400` 行 | query no-write/projection identity | `commit-ph-04-c` |
| `BATCH-04-05` | entry/static/handoff checks | 05 §9/§13；06 §10 | forbidden-field scan、source pairing、presentation mapping checks | `100~300` 行 | S-RUN-ENTRY/SECURITY；AR/VETO | `commit-ph-04-c` |

### 11.3 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| `commit-ph-04-a` | safe view/read-section contracts、body-free/redaction schema 和 tests 通过后 | OutputPreview、FailureDiagnosis、HandoffPosture、RunnerReadSection/ReadModel public surface | diagnosis/handoff adapter、Query service、formal evidence/report | DTO/query response/redaction schema；forbidden-field construction check |
| `commit-ph-04-b` | visibility/redaction/diagnostic/handoff semantic slots 与 C11/Q09～Q11 negative flows 通过后 | resolver、redaction adapter slot、C11/Q09～Q11 service、handoff unknown/recovery | Q12 rebuild/refresh、Consumer/Job、formal L4 evidence | visibility/source/freshness/degraded、all-or-nothing redaction、no-resend |
| `commit-ph-04-c` | Q12 composer/section lookup、entry mapping 和 static/no-write checks 通过后 | RunnerReadModel composition、section identity/generation guard、Q12、presentation/static checks | Query-triggered refresh/reconcile、Job repair、release verdict | query write audit、projection lookup/generation、AR-RUN-005/010/015 |

### 11.4 Commit boundary 实施台账规则

| Boundary | planned ledger file | allowed scope | forbidden scope | required reads/checks | Commit Gate | Handoff Gate |
|---|---|---|---|---|---|---|
| `commit-ph-04-a` | `implementation-boundaries/commit-ph-04-a.md` | safe presentation/query secondary types | raw body/secret/path、formal evidence、mutation | 03 Step 6/8/14/15；04 §7；05 CUT-08～10/17 | view schema/redaction review | future baseline + view blocker + PH-04-b |
| `commit-ph-04-b` | `implementation-boundaries/commit-ph-04-b.md` | visibility/resolver/redaction/handoff semantic slots、C11/Q09～Q11 | Observability private implementation、handoff ACK→evidence、Query write | 03 Step 7/9/11/12/13/15；06 AC-010 | source/freshness/unknown evidence conditions | seam status and no-resend posture |
| `commit-ph-04-c` | `implementation-boundaries/commit-ph-04-c.md` | Q12 read model/composer、entry/static checks | refresh/reconcile/probe/cleanup/Job dispatch、release evidence | 03 Step 8/9/10/11；05 S-RUN-ENTRY/SECURITY；06 AR/VETO | no-write/static scan and scope diff | next PH-05; no formal evidence claim |

### 11.5 子功能分组与开工闭环

| Boundary | 子功能分组 | 必须同提交的理由 | 不包含 |
|---|---|---|---|
| `commit-ph-04-a` | safe view contracts + body-free/redaction rules | 所有 presentation surface 必须共享字段来源、visibility/freshness 和禁止字段规则 | adapter/service |
| `commit-ph-04-b` | diagnosis/handoff semantic adapter + C11/Q09～Q11 flow | handoff/diagnosis 的 redaction、unknown、receipt 语义只有与 flow 同提交才可验证 | Q12 rebuild/Job |
| `commit-ph-04-c` | Q12 projection read + pure entry/static checks | read model identity、generation guard 和 no-write call graph 共同构成可验证读取增量 | refresh/reconcile/evidence |

| 复核项 | `04-a` | `04-b` | `04-c` |
|---|---|---|---|
| 字段/DTO/状态 | safe body-free view fields、empty/not-visible/degraded markers | diagnosis/handoff state、receipt/issue/target posture | section identity、composition generation、stale/degraded markers |
| typed ref / validation truth | view/read subject/scope/ref identity 正式定义 | redaction/visibility/freshness 来自 semantic ports | Q12 lookup 通过 typed section identity；不解析 generic ref |
| metadata/idempotency | 不适用：view contracts 本身 no-write | C11 handoff key/digest/result/unknown recovery 闭合 | Query no idempotency reservation；entry metadata 只读校验 |
| projection/rebuild | view identity 预定义但不 rebuild | Q09～Q11 不触发 rebuild | Q12 committed section lookup/generation guard/replacement source 闭合；不能隐式 upsert |
| artifact materialization | 不适用：safe view 非 evidence | handoff receipt 仅 local posture；正式 report/evidence 后置 | 只做 pairing/check responsibility，不生成 EV |
| phase boundary | 不进入 operations/release | 不进入 final evidence/verdict | 不进入 Consumer/Job/selected integration |

| Boundary | §九适用经验项 | 不适用理由 | 结论 |
|---|---|---|---|
| `commit-ph-04-a` | Query response、typed ref、redaction、phase boundary | persistence/rebuild、job、artifact writer 尚未实现 | 设计层通过；safe field authority 仍待 L4 seam |
| `commit-ph-04-b` | Query visibility resolution、validation truth、handoff marker/receipt、idempotency、error/recovery、phase boundary | Consumer/job/report generator 不在当前 boundary | 设计层通过；Observability positive blocked |
| `commit-ph-04-c` | Projection identity/lookup/rebuild source（读取侧）、Query no-write、entry result detail、artifact path responsibility、phase boundary | 不写 projection rebuild job、formal evidence、outbound event | 设计层通过；store/entry authority blocked |

### 11.6 提交粒度与停审

| Boundary | 粒度判断 | 独立验证/回退 | 停审结论 |
|---|---|---|---|
| `commit-ph-04-a` | 适中 | view contract/redaction schema 可独立检查 | 通过；不表示 safe content 已生成 |
| `commit-ph-04-b` | 适中 | C11/Q09～Q11、redaction/unknown 可独立验证 | 通过；handoff receipt 不等 evidence |
| `commit-ph-04-c` | 适中 | Q12/no-write/static boundary 可独立验证 | 通过；不触发 Job/refresh/reconcile |

## 12. PH-05 Consumer、Jobs、自动化与报告能力

### 12.1 阶段任务表与编写顺序

| 任务编号 | 顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| `IMPL-05-01` | 1 | 编写四个 Consumer header/schema/version/dedup/receipt/disposition contracts 与 blocked-first loop state | 03 Step 8/10/12；E01～E04 | header-first Consumer public/worker surface | 缺 header、unsupported、rejected、blocked、strict duplicate 均有 typed result；不读 payload |
| `IMPL-05-02` | 2 | 编写 Consumer receipt/ordering local store、duplicate replay 和 no-ACK/no-owner-cursor enforcement | 03 Step 7/9/11/13；05 CNS CUT | stored receipt 可读回；payload parse/hash/store/ACK=0 | strict duplicate 仅在完整 trusted header + stored receipt 时成立 |
| `IMPL-05-03` | 3 | 编写五个 Operations Job metadata、claim/checkpoint/report/result contracts 与 local-only policy | 03 Step 6/8/10/12/13；J01～J05 | Job surface、terminal disposition、report assembly | Blocked/Unknown 不压成 Partial/Failed；不修 owner truth |
| `IMPL-05-04` | 4 | 编写 J01～J05 local jobs、generation/version guard、bounded report 和 duplicate replay | 03 Step 9/11；05 JOB/REPLAY；06 TX/VETO | claim/checkpoint/report local flows | stale claim/checkpoint 不 takeover/reclaim/resume |
| `IMPL-05-05` | 5 | 编写 scripts/checks/reports capability、event-zero static scan、same-run index shell 与 report mapping | 05 §9/§13；06 §10/§11 | planned report/index/check capability | 只从真实未来 raw/report 输入；当前不生成 EV/verdict |

### 12.2 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| `BATCH-05-01` | Consumer header/receipt/disposition contracts | 03 Step 8/10/12；CUT-14/18 | E01～E04 header, receipt, disposition, loop state | `需拆分`；header 与 receipt 分批 | consumer contract/negative | `commit-ph-05-a` |
| `BATCH-05-02` | Consumer blocked-first service/worker | 03 Step 7/9/11/13；S-RUN-CONSUMER | readiness gate、stored duplicate replay、no-payload/no-ACK enforcement | `200~400` 行 | header-only/no-ACK/static scan | `commit-ph-05-a` |
| `BATCH-05-03` | Job shared surface | 03 Step 6/8/10/12/13；CUT-15 | five job request/result/report/claim/checkpoint/duplicate types | `需拆分`；shared schema and report mapping separate | job contract/replay | `commit-ph-05-b` |
| `BATCH-05-04` | J01/J02 material/cache jobs | 03 Step 9；AC-003/004/008 | bounded acquisition/verification/eviction candidate reports | `需拆分`；J01/J02 separate | S-RUN-JOB/REPLAY | `commit-ph-05-c` |
| `BATCH-05-05` | J03/J04/J05 recovery/diagnosis/source jobs | 03 Step 9/10/11；AC-009/010 | recovery report、redacted diagnosis、generation-guarded section refresh | `需拆分`；each job state/guard separate | operations replay/no-owner-repair | `commit-ph-05-c` |
| `BATCH-05-06` | report/check/index capability | 05 §9/§13；06 §10/§11 | same-run artifact/report/check pairing shape、event-zero scan | `200~400` 行 | report-generation/link/pairing design | `commit-ph-05-d` |

### 12.3 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| `commit-ph-05-a` | four Consumer header/receipt/disposition、blocked-first loop 和 no-payload tests 通过后 | E01～E04 header-first negative/strict duplicate、receipt store/replay、no-ACK/no-owner-cursor | positive payload parse/apply、owner projection mutation、outbound event | S-RUN-CONSUMER；CUT-14/18；AR/VETO-005/006；event-zero |
| `commit-ph-05-b` | five Job shared DTO、claim/checkpoint/report/result、duplicate semantics 通过后 | J01～J05 public/local job surface、report disposition、stored report/idempotency | concrete runner、owner repair、release evidence | S-RUN-JOB/REPLAY；job surface/idempotency/replay checks |
| `commit-ph-05-c` | J01～J05 local job runners、generation guard、no-repair tests 通过后 | acquisition/cache candidate、reconciliation、diagnosis/source refresh local jobs and reports | owner mutation、automatic reclaim/replay/resume、formal evidence | CUT-15/18；TX-007；AR-RUN-007；VETO-RUN-007 |
| `commit-ph-05-d` | gate/check/report capability、event-zero scan、same-run index shell 通过后 | script/check/report responsibility、artifact/report pairing/index shape、static event/outbox/topic scan | final EV detail、verdict/signoff/readiness、release adapter | 05 §9/§13 planned gates；06 §10/§11 no-static/pairing rules |

### 12.4 Commit boundary 实施台账规则

| Boundary | planned ledger file | allowed scope | forbidden scope | required reads/checks | Commit Gate | Handoff Gate |
|---|---|---|---|---|---|---|
| `commit-ph-05-a` | `implementation-boundaries/commit-ph-05-a.md` | worker header/receipt/disposition and negative loop | payload parse/hash/store/ACK/owner cursor/outbound event | 03 Step 8/9/10/12/13；05 CNS CUT-14/18；06 AR/VETO-005/006 | header/receipt/no-ACK/event-zero | blocked/duplicate posture and PH-05-b |
| `commit-ph-05-b` | `implementation-boundaries/commit-ph-05-b.md` | job DTO/claim/checkpoint/report/idempotency | concrete job effects, owner repair, evidence | 03 Step 6/8/10/12/13；05 JOB/REPLAY；06 TX-007 | public job surface/replay schema | report surface/blocker and PH-05-c |
| `commit-ph-05-c` | `implementation-boundaries/commit-ph-05-c.md` | J01～J05 local-only runners and guards | owner truth mutation/reclaim/replay/resume | 03 Step 9/11/12；05 S-RUN-JOB/REPLAY；06 AC-003/009/010 | claim/checkpoint/report/no-repair | local result only; no formal evidence |
| `commit-ph-05-d` | `implementation-boundaries/commit-ph-05-d.md` | scripts/checks/reports/index capability and event-zero scan | static EV/verdict/signoff/readiness | 05 §9/§13；06 §10/§11 | path/run/pairing/no-static check design | future report outputs `not_created`; PH-06 entry |

### 12.5 子功能分组与开工闭环

| Boundary | 子功能分组 | 必须同提交的理由 | 不包含 |
|---|---|---|---|
| `commit-ph-05-a` | header readiness + receipt replay + negative disposition | header、dedup、stored receipt 和 no-ACK 是同一安全 Consumer 增量；拆开会出现可 ACK 的半实现 | payload/owner cursor/event |
| `commit-ph-05-b` | public Job schema + claim/checkpoint/report/idempotency | entry、stored report 和 duplicate replay 必须同一 surface，避免 entry 反推结果 | runners/repair/evidence |
| `commit-ph-05-c` | local Job runners + generation/claim guards | jobs 的实际可验证增量是本地技术状态和报告，不是 owner lifecycle | owner mutation/replay |
| `commit-ph-05-d` | script/report/index capability + event-zero scan | 报告路径、same-run pairing 和 no-event 扫描共同约束证据边界 | final EV/verdict/release |

| 复核项 | `05-a` | `05-b` | `05-c` | `05-d` |
|---|---|---|---|---|
| 字段/DTO/状态 | header、receipt、disposition、loop state 穷尽 | Job metadata、claim/checkpoint/report、terminal disposition 穷尽 | job input/basis、guard、report refs、blocked/unknown mapping | run/artifact/report/check/index schema 计划闭合 |
| typed ref / validation truth | header source/schema/event/dedup identity；不读 body | job kind/input/basis 由 typed DTO，不从 route/name 猜 | scope/generation/version/claim source 正式读取 | run_id/root/profile/suite 来自显式参数/registry |
| metadata/idempotency | strict duplicate stored receipt；不计算 payload hash | key/digest/result/report/UoW/claim 顺序闭合 | duplicate replay 在 claim/adapter 前返回；stale claim 不 takeover | report/index 不成为 idempotency truth |
| projection/rebuild | 不适用：negative consumer 不写 projection | 不适用：shared job surface 不 rebuild | J03/J05 only explicit local report/section replacement，identity/generation 闭合 | 不执行 rebuild；只记录检查责任 |
| artifact materialization | receipt 是 local safe record，不是 evidence | report 是 local operations surface，不是 evidence | report refs 可被未来 materialize；当前 not_created | writer/reader/schema/pairing 责任明确，不静态造 EV |
| phase boundary | 不进入 positive Consumer | 不进入具体 runner/release | 不修 owner truth、不自动恢复 | 不进入 final release/verdict |

| Boundary | §九适用经验项 | 不适用理由 | 结论 |
|---|---|---|---|
| `commit-ph-05-a` | public protocol/receipt、stored receipt save/get、entry context、idempotency、phase boundary、event-zero | projection rebuild、artifact finalization、owner positive payload 不适用 | 设计层通过；transport schema blocked |
| `commit-ph-05-b` | public job surface、entry result detail、idempotency、metadata、phase boundary | Consumer payload、projection rebuild、formal evidence 不适用 | 设计层通过；job runner authority blocked |
| `commit-ph-05-c` | maintenance job typed output、claim/checkpoint/version、projection generation、job policy summary、artifact materialization、phase boundary | outbound event、owner repair、release evidence 不适用 | 设计层通过；store/scheduler blocked |
| `commit-ph-05-d` | artifact materialization、machine artifact schema、path baseline、phase boundary、event-zero | domain DTO/state、owner adapter、Query service 不适用 | 设计层通过；脚本/tool authority blocked |

### 12.6 提交粒度与停审

| Boundary | 粒度判断 | 独立验证/回退 | 停审结论 |
|---|---|---|---|
| `commit-ph-05-a` | 适中 | header-only/no-ACK/no-event 可独立验证 | 通过；positive consumer reserved |
| `commit-ph-05-b` | 适中 | job schema/replay 可独立验证 | 通过；不表示 job runner ready |
| `commit-ph-05-c` | 偏大但必要；按 J01/J02 与 J03～J05 批次写 | 每组有 operations replay/no-repair 切口，最终同一 local-job capability review | 通过；owner positive blocked |
| `commit-ph-05-d` | 适中 | path/pairing/event-zero capability 可独立审查 | 通过；不生成报告/EV 实例 |

## 13. PH-06 Selected integration、release 与 handoff

### 13.1 阶段任务表与编写顺序

| 任务编号 | 顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| `IMPL-06-01` | 1 | 固定 selected target tier、authority chain、immutable design baseline、environment/capability manifest 和 fixed-run 入口条件 | 03 §13～§16；05 §8～§14；06 §3～§4；RUN-UP/RUN-OPS | baseline/environment/fixed-run preflight contract | 所有 source revision/digest、scope、profile、dependency、run root 和 review role 可回指；缺一项则 blocked |
| `IMPL-06-02` | 2 | 在正式 public seam 到达后启用窄 semantic adapter slot 与 selected controlled/staging/release orchestration | 03 required ports；04 bindings；Artifact/Governance/Sandbox/Runtime/Observability/Archive authority | selected adapter mapping、availability/readiness、run pairing、blocked fallback | 只经 SDK/formal API/semantic port；不复制私有实现、不修改 Release/owner truth |
| `IMPL-06-03` | 3 | 绑定 same-run raw artifact、suite/check、report、evidence index/detail 和 VETO/link/pairing checks | 05 §9/§13/§14；06 §10～§12；PH-05 report capability | selected run report/evidence package plan | artifact/report/check/EV/AC/VETO 共享 run、source digest 和 pairing；缺失即 incomplete/blocked |
| `IMPL-06-04` | 4 | 生成 release handoff、open issues、risk acceptance 输入和 review handoff；按条件暂停，不自行产生 verdict/signoff/readiness | 06 §12～§14；review authority/GRC | handoff package、未决项、下一步 gate | handoff 只在 required checks 和 VETO 条件有真实结果后进行；当前不创建实例 |

### 13.2 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| `BATCH-06-01` | baseline/environment/fixed-run preflight | 05 §8/§13；06 §3/§4；Step 8/9/12 inputs | manifest fields、dependency/authority/capability checks、run pairing preflight | `200~400` 行；manifest 与 checks 分批 | baseline/link/pairing design review | `commit-ph-06-a` |
| `BATCH-06-02` | selected adapter slot and controlled run | 03 §13；04 §9～§13；upstream formal seam | typed adapter mapping、selected run orchestration、safe blocked fallback | `需拆分`；各 owner seam 独立验证 | controlled/staging gate (future) | `commit-ph-06-a` |
| `BATCH-06-03` | report/evidence/veto pairing | PH-05-d；05 §13/§14；06 §10～§12 | same-run index/detail/link/veto check composition | `需拆分`；raw/report/check and index/detail separate | report-generation/link/pairing | `commit-ph-06-b` |
| `BATCH-06-04` | handoff and completion package | 06 §12～§14；review/GRC authority | handoff package, open issue/risk inputs, completion checklist | `100~300` 行；不生成 verdict | handoff audit; current not_run | `commit-ph-06-b` |

### 13.3 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| `commit-ph-06-a` | baseline/environment/fixed-run preflight、selected adapter slot 和 controlled negative/positive conditions（若获 authority）均闭合后 | baseline manifest contract、dependency/capability checks、selected semantic adapter mapping、run orchestration and blocked fallback | 未授权 owner DTO/endpoint、private implementation、Release mutation、final evidence/verdict/handoff | G-RUN-CONTROLLED/STAGING/RELEASE 适用门禁；AC-RUN-011；AR-RUN-004；VETO-RUN-001～004；当前 blocked/not_run |
| `commit-ph-06-b` | same-run artifact/report/check pairing、VETO/link checks、handoff package 通过后 | selected report/evidence index/detail composition、VETO/risk/open-issue inputs、handoff/checklist generation | 新业务功能、静态 EV、跨 run 拼接、伪造 verdict/signoff/readiness、owner truth write | evidence/link/pairing/no-static/redaction audit；06 exit/decision conditions；当前不执行 |

### 13.4 Commit boundary 实施台账规则

| Boundary | planned ledger file | allowed scope | forbidden scope | required reads/checks | Commit Gate | Handoff Gate |
|---|---|---|---|---|---|---|
| `commit-ph-06-a` | `implementation-boundaries/commit-ph-06-a.md` | baseline/environment preflight、selected public adapter slot、run orchestration | exact unapproved API、private implementation、Release/owner mutation、implicit selector | 03 §13～§16；04 §9～§13；05 §8/§9；06 §3～§9；upstream ledgers | authority/baseline/scope/dependency checks and selected run conditions | real baseline/run/check status or blocked reason；无伪造 hash/result |
| `commit-ph-06-b` | `implementation-boundaries/commit-ph-06-b.md` | same-run report/evidence pairing、VETO/link checks、handoff package | static evidence/verdict/signoff/readiness、跨 run、owner repair | 05 §13/§14；06 §10～§14；PH-05-d | report/index/detail/pairing and VETO checks | handoff receipt、open issues、risk inputs and next decision authority；不产生 verdict |

### 13.5 子功能分组与开工闭环

| Boundary | 子功能分组 | 必须同提交的理由 | 不包含 |
|---|---|---|---|
| `commit-ph-06-a` | baseline preflight + selected adapter + run orchestration | adapter 能否启用取决于同一 baseline、environment、authority 和 fixed-run 条件；拆开会产生无基线的“集成成功”假象 | final evidence/release decision |
| `commit-ph-06-b` | report/evidence pairing + VETO/handoff package | handoff 只能由同一 run 的真实 raw/report/check 和 VETO/link 结果推导，不能事后手工拼接 | new business capability/verdict |

| 复核项 | `06-a` | `06-b` |
|---|---|---|
| 字段/DTO/状态 | baseline manifest、dependency/authority/capability、adapter availability/readiness、selected run/ref 状态闭合 | artifact/report/check/EV/link/VETO/handoff fields、maturity and incomplete/blocked markers 闭合 |
| typed ref / validation truth | release/version/scope/generation、owner/adapter refs 和 environment capability 来自正式 authority/manifest | run_id、source digest、artifact/report/evidence refs 来自同一 run producer；不从文件名或 report 文本推导 |
| metadata/idempotency | selected run operation identity、digest、fixed-run pairing and no replay of unknown effect | report generation keyed by explicit run; no cross-run merge; handoff duplicate surface follows 06 contract |
| projection/rebuild | 不适用：selected adapter/run 不创建 Runner read-model rebuild | 不适用：handoff/release reports 不是 business projection；只读 materialization |
| artifact materialization | preflight 只定义 writer/reader roots/schema/authority，不生成 artifacts | 适用：raw artifact→report→index/detail→handoff pairing、digest/redaction、maturity 必须闭合 |
| phase boundary | 不进入 final verdict；不修改 owner/Release truth | 不新增业务功能、不把 receipt/report 升级为 evidence/verdict/signoff |

| Boundary | §九适用经验项 | 不适用理由 | 结论 |
|---|---|---|---|
| `commit-ph-06-a` | path/baseline、config binding、validation truth、typed ref、metadata/idempotency、adapter outcome、phase boundary | Query/Consumer/Job internal implementation、final artifact evidence 不在本 boundary | 设计层通过；所有 real authority/baseline/target environment blocked |
| `commit-ph-06-b` | artifact materialization、machine artifact schema、evidence source/link/pairing、handoff marker、phase boundary、VETO source closure | domain state、outbound event、owner repair、new adapter 不适用 | 设计层通过；真实 fixed run/review authority blocked |

### 13.6 提交粒度与停审

| Boundary | 粒度判断 | 独立验证/回退 | 停审结论 |
|---|---|---|---|
| `commit-ph-06-a` | 适中但条件性 | preflight/adapter/run slot 可在 selected environment 独立审查；无 authority 时只形成 blocked result | 通过；当前不能执行或提交 |
| `commit-ph-06-b` | 适中 | pairing/VETO/handoff generator 可独立审查；不依赖手工 verdict | 通过；当前不产生 evidence/verdict/signoff/readiness |

## 14. 跨 boundary 粒度、依赖、测试与证据审计

| 审计项 | 结论 | 证据与修正 |
|---|---|---|
| boundary 总数与 phase 归属 | 通过；共 18 个 planned boundary | `PH-01` 2、`PH-02` 3、`PH-03` 4、`PH-04` 3、`PH-05` 4、`PH-06` 2；编号连续且不跨 phase |
| 阶段依赖顺序 | 通过 | `PH-01 → PH-02 → PH-03 → PH-04 → PH-05 → PH-06`；任何 boundary 不读取后续 phase 的业务 truth、result 或 evidence |
| boundary 一句话描述 | 通过 | 每个 boundary 在提交边界表和停审表均可用单一可验证增量描述 |
| boundary 可独立 review/验证/回退 | 设计层通过 | 每 boundary 有 allowed/forbidden scope、required reads、targeted gate 和 commit timing；实际执行尚未授权 |
| 代码批次规模 | 通过 | 大于 300 行或高风险状态/事务/Job/报告批次均标 `需拆分`；未以单文件/函数提交 |
| contract → state → flow → adapter/entry → gate 顺序 | 通过 | PH-02～PH-04 先闭合 public/domain，再编排 application，再绑定 semantic adapter/entry；PH-05/06 后置 worker/job/report |
| 前置 surface repair | 通过（逻辑层） | 每个 boundary 的 required reads 与 §九复核要求先回写已闭合 carrier/repo/result；若实际实现发现缺口，必须 `wait_design` |
| Query no-write | 通过 | PH-03 `Q06～Q08`、PH-04 `Q09～Q12`、PH-05 report/read checks 分开；没有 Query refresh/reconcile/probe/cleanup/dispatch |
| Consumer no-payload/no-ACK | 通过 | `commit-ph-05-a` 只允许 header-first negative/strict stored duplicate；positive payload/ACK/cursor 明确 forbidden |
| Job no-owner-repair | 通过 | `commit-ph-05-b/c` 只维护 claim/checkpoint/report/local sections；不 repair/replay/reclaim/resume owner truth |
| Runner outbound event=0 | 通过 | 每个涉及 boundary 均列 no-residue scan；未创建 outbox/publisher/topic/event |
| 多轴状态 | 通过 | selection/material/run/control/resource/cleanup/recovery/handoff/readiness/verification 分开；未把 ACK/PID/port/cache/report 当业务 truth |
| idempotency/UoW/Unknown | 通过（计划层） | Command/Job/Consumer 各自有 key/digest/result/receipt/report；external/commit/checkpoint unknown 均冻结并关联 RecoveryCase；未执行 |
| projection/rebuild | 通过 | Q12/J05 仅显式 generation/version guarded section replacement；缺 identity 不 upsert；未把 Query 当 rebuild |
| artifact/report/evidence maturity | 通过 | PH-01 path contract、PH-05 capability/index shell、PH-06 same-run pairing/handoff；无静态 EV、跨 run 或 verdict |
| AC/AR/TX/NFA/VETO 覆盖 | 通过（planned） | 每个 boundary 回指相关 CUT/suite/AC/AR/TX/NFA/VETO；Step 7 将再收敛详细 gate matrix |
| 台账覆盖 | 通过（planned） | 每个 boundary 都有唯一 `implementation-boundaries/<boundary_id>.md` 计划路径；Step 13 才预创建 skeleton |
| 提交纪律 | 通过（计划层） | 一笔 commit 对应一个 boundary；英文 `type(scope): subject` 等细则留 Step 11；当前不提交 |
| blocker 处理 | 通过 | `RUN-DDD-*`、`RUN-UP-*`、`RUN-OPS-*`、`RUN-DOC-003` 未被关闭；所有 positive/physical/release lane 保持 blocked/waiting/not_run |

### 14.1 跨 boundary 依赖图

```text
PH-01: 01-a -> 01-b
          |
PH-02:    02-a -> 02-b -> 02-c
                                      |
PH-03:                                03-a -> 03-b -> 03-c -> 03-d
                                                                  |
PH-04:                                                            04-a -> 04-b -> 04-c
                                                                                     |
PH-05:                                                                               05-a -> 05-b -> 05-c -> 05-d
                                                                                                                         |
PH-06:                                                                                                                   06-a -> 06-b
```

关键说明：
- 图表达 planned boundary 的串行依赖和 handoff 方向，不表达实现仓、线程、部署拓扑或已执行 commit。
- 同一 phase 内可在当前 boundary 内分批编写和验证，但最终只能按一个 boundary 的 Commit Gate 形成一次提交。
- 任一上游 boundary 的 design/Scope/Build/Test/Evidence Gate 未通过，后续 boundary 只能 `planned / wait_until_current`，不得用 fake positive 绕过。

### 14.2 18 个 boundary 停审记录

| Boundary | 一句话增量 | 可独立 review/验证/回退 | 设计闭环结论 | 当前缺口/修正 |
|---|---|---|---|---|
| `commit-ph-01-a` | 固定实现 authority 与逻辑装配边界 | 是；authority/path/dependency review | 设计层通过 | target repo、language/runtime 未获 authority；保持 physical blocked |
| `commit-ph-01-b` | 固定配置、测试数据和证据路径合同 | 是；schema/path/redaction review | 设计层通过 | builder/store/script authority 未闭合；不创建实例 |
| `commit-ph-02-a` | 固定 context 与 immutable selection truth | 是；contract/domain/generation tests | 设计层通过 | Artifact/Governance positive seam blocked |
| `commit-ph-02-b` | 固定 acquisition、integrity、cache 轴与本地命令流 | 是；material/service negative tests | 设计层通过 | locator/manifest/verifier/cache backend 未闭合 |
| `commit-ph-02-c` | 固定 authority/source/verifier semantic slots 和安全 Query | 是；availability/query no-write | 设计层通过 | exact SDK/public seam blocked |
| `commit-ph-03-a` | 固定 run/control/resource/guard local truth | 是；state/guard tests | 设计层通过 | Sandbox/Runtime/platform read surface blocked |
| `commit-ph-03-b` | 固定 external effect、UoW、unknown 和 guarded cleanup 顺序 | 是；controlled negative/UoW | 设计层通过 | external effect positive、durable store blocked |
| `commit-ph-03-c` | 固定 RecoveryCase、manual review 和 no-replay | 是；recovery/no-replay | 设计层通过 | readback/lease/orphan seam blocked |
| `commit-ph-03-d` | 固定 C07～C10 与 Q06～Q08 的运行控制纵切 | 是；service/query no-write | 设计层通过 | entry/store authority blocked |
| `commit-ph-04-a` | 固定 bounded/redacted presentation contracts | 是；view/schema/static scan | 设计层通过 | safe diagnostic/handoff DTO 待上游闭合 |
| `commit-ph-04-b` | 固定 C11/Q09～Q11 diagnosis/handoff flow | 是；redaction/unknown/no-resend | 设计层通过 | Observability positive seam blocked |
| `commit-ph-04-c` | 固定 Q12 committed read model 与 no-write entry | 是；projection identity/query audit | 设计层通过 | physical read store/rebuild authority blocked |
| `commit-ph-05-a` | 固定四 Consumer header-first negative/duplicate surface | 是；header/no-ACK/event-zero | 设计层通过 | transport header/schema 未闭合 |
| `commit-ph-05-b` | 固定五 Job public/local report surface | 是；job schema/replay | 设计层通过 | job runner/scheduler authority blocked |
| `commit-ph-05-c` | 固定 J01～J05 local-only runners 与 guards | 是；claim/checkpoint/no-repair | 设计层通过 | durable store/operations environment blocked |
| `commit-ph-05-d` | 固定 script/check/report/index 和 event-zero capability | 是；path/pairing/static scan | 设计层通过 | toolchain/report generator 未获 authority |
| `commit-ph-06-a` | 固定 selected baseline、adapter slot 与 run preflight | 条件性；无 authority 时只审 blocked lane | 设计层通过 | baseline、fixed run、环境和 owner seam 缺失 |
| `commit-ph-06-b` | 固定 same-run report/evidence pairing 与 handoff package | 是；link/pairing/VETO review | 设计层通过 | 无真实 raw/report/check/review，不生成 handoff 实例 |

## 15. 回填草稿（未来正式 `07-实施计划.md` §6）

> 校准来源：
> - `design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md`
>
> 延伸阅读：建议继续阅读本文件 §7 的通用复核、§8～§13 的 phase/boundary 表、§14 的跨 boundary 审计与 §14.2 的停审记录。

### 15.1 阶段任务和编写顺序

正式 §6 应承接六阶段的以下顺序：

```text
PH-01 authority/config/test/report contract
  -> PH-02 context/selection/material qualification
  -> PH-03 run/control/resource/recovery
  -> PH-04 preview/diagnosis/handoff/query
  -> PH-05 consumer/jobs/report capability
  -> PH-06 selected integration/release handoff
```

每阶段内部先固定 public contract、typed ref、secondary carrier 和测试切口，再实现 domain/state，再实现 application/UoW/idempotency，再绑定 semantic adapter/entry/worker/operations，最后执行该 boundary 的测试、静态安全、artifact/report pairing 和 handoff gate。物理语言、runtime、目录、具体 SDK、store/cache backend 和 transport 只有在 authority gate 关闭后才能进入实现仓计划。

### 15.2 Boundary Gate Matrix 草稿

| Phase | Boundary | 可验证增量 | 主要 planned gate | 未来台账 |
|---|---|---|---|---|
| PH-01 | `commit-ph-01-a` | authority/logic composition | Design/Scope/path | `implementation-boundaries/commit-ph-01-a.md` |
| PH-01 | `commit-ph-01-b` | config/data/path capability | config/schema/pairing | `implementation-boundaries/commit-ph-01-b.md` |
| PH-02 | `commit-ph-02-a` | context/selection | contract/domain/generation | `implementation-boundaries/commit-ph-02-a.md` |
| PH-02 | `commit-ph-02-b` | material axes/commands | service/UoW/qualification | `implementation-boundaries/commit-ph-02-b.md` |
| PH-02 | `commit-ph-02-c` | semantic source slots/queries | adapter/no-write | `implementation-boundaries/commit-ph-02-c.md` |
| PH-03 | `commit-ph-03-a` | run/control/resource guard | state/guard | `implementation-boundaries/commit-ph-03-a.md` |
| PH-03 | `commit-ph-03-b` | external effect/UoW | controlled/unknown/TX | `implementation-boundaries/commit-ph-03-b.md` |
| PH-03 | `commit-ph-03-c` | recovery/manual review | recovery/no-replay | `implementation-boundaries/commit-ph-03-c.md` |
| PH-03 | `commit-ph-03-d` | lifecycle/control queries | service/query no-write | `implementation-boundaries/commit-ph-03-d.md` |
| PH-04 | `commit-ph-04-a` | safe presentation contract | schema/redaction | `implementation-boundaries/commit-ph-04-a.md` |
| PH-04 | `commit-ph-04-b` | diagnosis/handoff flows | visibility/unknown | `implementation-boundaries/commit-ph-04-b.md` |
| PH-04 | `commit-ph-04-c` | Q12/read model | projection/no-write | `implementation-boundaries/commit-ph-04-c.md` |
| PH-05 | `commit-ph-05-a` | Consumer negative surface | header/no-ACK/event-zero | `implementation-boundaries/commit-ph-05-a.md` |
| PH-05 | `commit-ph-05-b` | Job public surface | job/replay/idempotency | `implementation-boundaries/commit-ph-05-b.md` |
| PH-05 | `commit-ph-05-c` | local Job runners | claim/checkpoint/no-repair | `implementation-boundaries/commit-ph-05-c.md` |
| PH-05 | `commit-ph-05-d` | report/check/index capability | path/pairing/no-static | `implementation-boundaries/commit-ph-05-d.md` |
| PH-06 | `commit-ph-06-a` | selected run preflight/adapter | baseline/authority/controlled | `implementation-boundaries/commit-ph-06-a.md` |
| PH-06 | `commit-ph-06-b` | report/evidence pairing/handoff | link/VETO/decision | `implementation-boundaries/commit-ph-06-b.md` |

每一笔未来实现提交只能对应一个 boundary。当前唯一允许的计划状态是 `planned / blocked / waiting / not_created`；任何真实 `pass`、commit hash、run_id、artifact、report、evidence、verdict、signoff 或 readiness 必须由后续执行事实产生，不能由本节预填。

### 15.3 提交纪律回填要点

- 一个 boundary 完成后，先通过 Design、Scope、Build、Targeted Test、Evidence/Pairing、Commit 和 Handoff Gate，再形成一笔提交。
- boundary 内部多个代码批次可分批编写和本地验证，但不能因此产生未经审查的跨 boundary WIP 提交。
- 实现仓的 commit message 在 Step 11 再固定；原则是英文 `type(scope): subject`、一句话 boundary 摘要、按子功能分组的 body、项目规定 footer。设计仓当前不提交。
- 所有失败、blocked、not_run、incomplete 和 unknown 必须保留原状态并回写台账；不得为了提交或推进压成 success/pass。

## 16. 待确认事项与重开触发

| 事项 | 影响 boundary/phase | 当前状态 | 重开动作 |
|---|---|---|---|
| 目标实现仓、语言/runtime、GUI/CLI/process/packaging authority | PH-01 全部、所有物理 scope | `RUN-DDD-001~002 / blocked` | 关闭后重开 `commit-ph-01-a`，补 authority/path baseline；不从 README 继承 |
| local store/cache、locking、migration、atomicity、corruption guarantee | PH-01-b、PH-02-b、PH-03-b/d、PH-04-c、PH-05-b/c | `RUN-DDD-003 / blocked` | 重开受影响 boundary 的 persistence/build gate；补 fake/durable parity |
| Artifact Release locator/manifest/digest/revoke seam | PH-02-b/c、PH-06-a | `RUN-UP-001 / blocked` | owner 合同到达后重开 material positive lane；保留 negative lane |
| Governance approved/baselined authority chain | PH-02-a/c、PH-06-a | `RUN-UP-002 / blocked` | 重开 selection/authority adapter 与 AC/VETO mapping；Runner 不本地批准 |
| Sandbox request/lease/control/cleanup/recovery DTO | PH-03-b/c/d、PH-06-a | `RUN-UP-003 / blocked` | 重开 controlled/positive adapter；Accepted 不升级 Running |
| Runtime safe status/result read surface | PH-03-b/d、PH-06-a | `RUN-UP-004 / blocked` | 重开 owner projection/readback；不把 local intent 当 result |
| Observability diagnostic/handoff/redaction seam | PH-04-b、PH-06-b | `RUN-UP-005 / blocked` | 重开 diagnosis/handoff positive lane；local report 不变 formal evidence |
| Archive/reference recovery seam | PH-06-a/b | `RUN-UP-006 / blocked` | 仅在正式 public read/handoff 合同到达后重开；不进入启动成功判定 |
| Platform resource/port/allocation/cleanup responsibility | PH-03-a/b/c、PH-06-a | `RUN-UP-007 / blocked` | 重开 selected platform resource lane；probe 不等 allocation/lease |
| L0-sdk version/error/redaction/trace surface | PH-02-c、PH-03-b、PH-04-b、PH-06-a | `RUN-UP-008 / blocked` | 重开 SDK adapter mapping；不写 exact method/version |
| Consumer transport header/version/dedup and Job runner authority | PH-05-a/c | `transport/scheduler pending` | 重开 only after formal contract; current remains header-first/local-only |
| Production SLO/capacity/retention authority and GRC/fixed-run environment | PH-05-d、PH-06-a/b | `RUN-OPS-001~002 / blocked` | 重开 release/evidence lane；不得设置无来源 hard threshold |
| Step 7 gate matrix changes or upstream truth-source repair | 全部 boundary | `deferred` | 先回写 03/04/05/06，更新 baseline，再重审受影响 boundary |

## 17. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 六个 phase 均有有序任务表 | `pass` | §8～§13 已覆盖 PH-01～PH-06 |
| 每个 phase 均有代码批次及规模/验证/提交关系 | `pass` | 高风险和大批次已标 `需拆分`，未按文件/函数拆提交 |
| 18 个 boundary 均有包含、不包含、提交时机和前置门禁 | `pass` | 每个 boundary 均有提交边界表和停审记录 |
| 每个 boundary 均有 planned ledger path、allowed/forbidden scope、required reads/checks、Commit/Handoff Gate | `pass` | §8.4、9.4、10.4、11.4、12.4、13.4 |
| 每个 boundary 均有开工前闭环复核和 §九经验复核 | `pass` | 按 phase 表格逐 boundary 展开；不适用项说明理由 |
| 每个 boundary 已完成停审 | `pass` | §8.6、9.6、10.6、11.6、12.6、13.6、14.2 |
| 跨 boundary 依赖、粒度、测试、证据和 truth ownership 审计无 unresolved 顺序冲突 | `pass` | §14；执行期仍需以真实 baseline/环境重做 |
| 未创建实现仓、代码、测试结果、artifact/report/evidence、正式 07 或 implementation ledger | `pass` | 继续保持 `RUN-DOC-003` 与 `implementation_ledger_allowed=false_until_step_13_assembly` |
| 可进入 Step 7 | `pass_for_step_07` | 下一步只能创建并完成 `07_implementation_plan_step_07_test_acceptance_gates.md`；完成后停审 |

## 18. Step 自审记录

- [x] 已按恢复顺序读取项目台账、07 flow、Step 5、正式 03/04/05/06 和实施计划/可落码/台账规范。
- [x] 已按六个既定 phase 串行拆分任务，不新增 phase，不引入 L1-governance 的对象数量、技术栈或 outbound event 结构。
- [x] 已为每个 phase 给出任务表、编写顺序、代码批次、预计规模、验证门禁和提交关系。
- [x] 已为 18 个 boundary 给出包含、不包含、commit 时机、allowed/forbidden scope、required reads/checks、Commit Gate 和 Handoff Gate。
- [x] 已逐 boundary 复核字段、DTO、状态、typed ref、validation truth、metadata/idempotency、projection/rebuild、artifact materialization 和 phase boundary；不适用项均说明理由。
- [x] 已逐 boundary 记录 §九经验复核、设计者责任、实现者二次校验和 blocker 回写口径。
- [x] 已显式保持 Query no-write、Consumer header-first/no-ACK/no-payload、Job local-only/no-owner-repair、Runner outbound event=0 和多轴状态红线。
- [x] 已完成跨 boundary 依赖/粒度/测试/证据审计和 18 个 boundary 停审；实际实现、测试、提交和证据均未执行。
- [x] 已执行本文件 diff 空白检查；未创建正式 `07-实施计划.md`、`implementation_execution_ledger.md` 或 boundary skeleton。

## 19. Step 结论与门禁

```text
step = 06
status = completed / pass / self_reviewed
gate_status = pass_for_step_07
gate_reason = PH-01～PH-06 已拆成 18 个计划性 commit boundary；每个 boundary 的任务、批次、scope、台账、闭环复核、§九经验复核、提交粒度和停审均已收口。目标实现仓、技术 authority、外部正向 seam、真实 baseline/fixed run、测试 artifact/report/evidence 和 release review 仍保持 blocked/waiting/not_created。
next_allowed_action = create_and_complete_07_step_07_test_acceptance_gates
formal_07_write_allowed = false_until_step_13_assembly
implementation_write_allowed = false
test_execution_allowed = false
implementation_ledger_allowed = false_until_step_13_assembly
commit_required = false
```
