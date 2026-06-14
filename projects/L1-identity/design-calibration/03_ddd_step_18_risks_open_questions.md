# Step 18. 风险与待确认事项

> 对应正式文档章节: `03-详细设计.md` 第 17 章 风险与待确认事项
> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 18
> 当前状态: Step 18.3 pre-implementation handling rules / formal draft / final closure 已写入;等待用户审核后进入 Step 19 正式详细设计文档装配
> 本文件性质: 详细设计 Step 18 中间产物,不是正式 `03-详细设计.md`
> 执行纪律: 本 Step 只记录风险、待确认事项、影响范围、确认方和未确认前处理方式,不新增 schema、port、state、error、DTO、配置默认值、测试编号、fixture、CI、evidence、phase 或 commit boundary

---

## 1. 18.0 framework / input boundary / batch plan

本批只建立 Step 18 的执行框架、输入边界、SOP 问题初答、当前材料诊断、风险分类原则、分批计划和写入红线。具体风险表、待确认事项表、未确认前处理规则和正式回填草稿在后续小批次逐步写入。

### 1.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前 Step | Step 18 风险与待确认事项 |
| 当前批次 | 18.0 framework / input boundary / batch plan |
| 当前结论 | Step 18 已进入;本批只完成风险 / 待确认事项框架,不新增实现契约 |
| 本批边界 | 不新增 object、field、function、port、adapter、repository、state、error、DTO、event、job、stored material、config key、test id、fixture、CI、evidence、phase 或 commit boundary |
| 输出文件 | `projects/L1-identity/design-calibration/03_ddd_step_18_risks_open_questions.md` |
| 下一批 | 18.1 risk classification and closure baseline |

### 1.2 Step 18 总体目标

Step 18 的目标是把详细设计阶段仍未关闭、可能影响实现移交或后续文档生成的风险与待确认事项显式记录下来,并给出未确认前实现者应该如何处理。

本 Step 需要回答:

- 哪些问题仍可能影响代码实现。
- 哪些问题会阻塞实现,哪些只阻塞下游文档、生产化 adapter 或最终验收。
- 每个待确认事项需要谁确认。
- 未确认前实现者应暂停、降级、使用 fake / fixture,还是等待正式下游文档闭口。
- 哪些历史 open item 已经由 Step 6~17 闭合,不应重复写成风险。
- 哪些事项不能写成已确认契约,只能移交 Step 19 或后续 `04/05/06/07`。

本 Step 不写解决方案、任务拆分、实施计划、测试用例、验收证据、配置 schema、产品选型、代码路径或提交计划。风险与待确认事项不是实现自由度;如果后续设计没有给出正式来源,实现阶段必须暂停并回报设计缺口。

### 1.3 本步输入

| 输入 | 当前状态 | 本 Step 用途 |
|---|---|---|
| `03_ddd_step_01_upstream_boundary.md` | 已完成并已审核通过 | 确认旧 `03` 只作诊断、新版 `00/01/02` 为详细设计输入 |
| `03_ddd_step_02_scope.md` | 已完成并已审核通过 | 判断风险是否扩大 identity 范围或误把非范围当待确认 |
| `03_ddd_step_03_constraints.md` | 已完成并已审核通过 | 判断目标仓、Rust、提交规范、sibling dependency 和编码约束风险 |
| `03_ddd_step_04_file_layout.md` | 已完成并已审核通过 | 判断实现仓 / workspace / crate / binary layout 是否仍有开工风险 |
| `03_ddd_step_05_module_contracts.md` | 已完成并已审核通过 | 排除已闭合的模块职责和依赖方向风险 |
| `03_ddd_step_06_object_contracts.md` | 已完成并已审核通过 | 识别对象字段、状态、不变量中是否还有未闭口风险;已由后续 Step 闭合的 open item 不重复列入 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成并已审核通过 | 复核 port / adapter / fake parity 是否仍有正式 surface 风险 |
| `03_ddd_step_08_protocol_contracts.md` | 已完成并已审核通过 | 复核 protocol DTO / receipt / report / event / job surface 是否还有下游风险 |
| `03_ddd_step_09_function_flows.md` | 已完成并已审核通过 | 复核 flow 顺序、事务、副作用和异常分支是否还有实现阻塞风险 |
| `03_ddd_step_10_state_matrix.md` | 已完成并已审核通过 | 复核状态名、迁移和非法转换是否还有测试 / 验收口径风险 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已完成并已审核通过 | 复核 persistence、version、cursor、UoW、stored replay 和 fake/durable parity 风险 |
| `03_ddd_step_12_error_recovery.md` | 已完成并已审核通过 | 复核 public error、retry、terminal、degraded、quarantine 和 recovery 风险 |
| `03_ddd_step_13_concurrency_idempotency.md` | 已完成并已审核通过 | 复核 duplicate replay、commit unknown、in-flight 和 idempotency guard 风险 |
| `03_ddd_step_14_config_external_binding.md` | 已完成并已审核通过 | 复核 config binding、adapter mode、runtime assembly 和旧 `04` 复核风险 |
| `03_ddd_step_15_observability_audit.md` | 已完成并已审核通过 | 复核 log / metric / audit / trace / handoff / forbidden material 风险 |
| `03_ddd_step_16_test_cuts.md` | 已完成并已审核通过 | 复核最小测试切口与后续正式 `05/06` 的承接风险 |
| `03_ddd_step_17_implementation_handoff.md` | 已完成并已审核通过 | 直接承接 Step 18 handoff input、`07` 审计门禁和正式回填草稿 |
| `00_req_step_15_risks_open_questions.md` | 已完成 | 判断需求层遗留风险是否已在详细设计闭合或仍需保留 |
| `01_arch_step_14_risks_open_questions.md` | 已完成 | 判断架构层遗留风险是否已在详细设计闭合或仍需保留 |
| `02_hld_step_13_risks_open_questions.md` | 已完成 | 判断概要层遗留风险是否已在详细设计闭合或仍需保留 |
| `standards/document/详细设计讨论流程_SOP.md` | 已读取 | 固定 Step 18 目标、问题和进入下一步条件 |
| `standards/document/详细设计书写规范.md` | 已读取 | 固定正式 `03` 第 17 章回填位置和边界 |
| `standards/document/设计文档讨论中间产物规范.md` | 已读取 | 固定风险 / 待确认事项、回填草稿和跨文档复核记录方式 |
| `projects/L1-governance/design-calibration/03_ddd_step_18_risks_open_questions.md` | 参考材料 | 只参考 Step 18 粒度和表结构,不复制 governance 业务风险 |

### 1.4 SOP 问题初答

| SOP 问题 | Step 18 初答 |
|---|---|
| 哪些问题仍可能影响代码实现? | 初步判断主要来自 Step 17 handoff:正式 `03` 尚未 Step 19 装配、现有 `04/05/06/07` 需按新版 `03` 复核、正式 `07` 仍需逐 boundary 可落码审计、正式测试编号 / fixture / CI / evidence / 验收裁决不在 Step 17 定义、旧 `03/04/05/06/07` 和旧实现口径可能残留旧名。是否还有实现仓、sibling dependency、产品化 adapter 或下游验证风险,在 18.1~18.3 继续复核。 |
| 哪些问题会阻塞实现,哪些只影响后续优化? | 正式 `03` 未装配、`07` 未完成逐 boundary 审计会阻塞正式实现移交。`04/05/06` 未复核会阻塞配置、测试和验收门禁。生产化 adapter、真实外部依赖、最终 evidence 细节若未闭口,可能不阻塞 P0 fake / in-memory 闭环,但阻塞真实集成和最终验收。 |
| 每个待确认事项需要谁确认? | Step 19 正式装配由详细设计维护者确认;`04/05/06/07` 由对应文档维护者按新版 `03` 复核;目标实现仓、implementation boundary 和提交纪律由实施计划维护者 / 实现 agent 在 `07` 中确认;真实 adapter、产品、运维和外部集成由对应架构 / 配置 / 测试 / 运维 / 相邻仓负责人确认。 |
| 未确认前实现者应该如何处理? | 不得自行补设计。正式 `03` 未装配前不得按旧 `03` 开工;`07` 未生成前不得自行拆 phase / commit boundary;字段、DTO、状态、port、mapper、version source、stored surface、test/evidence source 缺失时必须暂停并回报;运行期依赖不可用时只能通过正式 fake / fixture / stub 语义处理,不能伪造业务成功。 |

### 1.5 当前材料诊断

| 材料 / 倾向 | 当前问题 | Step 18 处理 |
|---|---|---|
| Step 6 曾有大量 open item | 多数已经由 Step 7~17 闭合,若全量照搬会制造假风险 | 18.1 先做 closed-vs-carried-forward 分类,已闭合项不重复列风险 |
| Step 17 handoff 明确列出 5 个输入 | 它们是当前最直接的 Step 18 风险来源 | 18.1~18.3 逐项分类为阻塞、下游门禁或命名漂移风险 |
| 正式 `03-详细设计.md` 尚未由 Step 19 装配 | 当前中间产物不能直接替代正式实现基线 | 列为正式实现移交前置风险,但不在 Step 18 直接修改正式 `03` |
| 现有 `04/05/06/07` 可能早于新版 `03` | 容易反向污染配置、测试、验收和实施计划 | 列为下游文档复核风险,留给对应 SOP |
| 实现仓和真实依赖可能有现实差异 | 设计已闭合不等于实现仓和 sibling repo 条件已满足 | 18.2 判断是否需要列为开工风险,但不在详细设计中补代码或依赖 |
| governance Step 18 粒度完整 | 可作为表结构和停审粒度参考 | 只借鉴结构,identity 风险以 identity Step 1~17 为真相源 |

### 1.6 风险分类原则

| 分类 | 判定标准 | 当前处理 |
|---|---|---|
| Blocking design handoff risk | 缺正式 `03`、`07` 审计、formal source 或 design baseline,会阻塞实现 agent 开工 | 必须列入风险表,未确认前不得实现 |
| Downstream document risk | `04/05/06/07` 需要按新版 `03` 复核或重写,会影响配置 / 测试 / 验收 / 实施门禁 | 列入风险表或待确认事项,由对应文档 SOP 闭口 |
| Implementation environment risk | 目标仓、sibling dependency、真实 adapter、product binding 或运行环境未确认 | 判断是否阻塞代码开工、fake 闭环或真实验收 |
| Production / acceptance risk | 不影响详细设计对象和 flow,但影响真实集成、运维证据或最终 pass 裁决 | 不写成实现契约;交给 `05/06/07` 或后续 adapter / 运维设计 |
| Naming / legacy drift risk | 旧文档、旧对象、旧状态或旧实现口径可能进入正式装配 | 列为 Step 19 / 下游复核门禁 |
| Closed item | 已由 Step 6~17 明确闭合,且不再影响实现判断 | 不进入风险表;可在“已关闭风险不再列入”中说明 |

### 1.7 Step 18 分批计划

| 批次 | 内容 | 状态 |
|---|---|---|
| 18.0 | framework / input boundary / batch plan | [x] 已写入 |
| 18.1 | risk classification and closure baseline | [x] 已写入 |
| 18.2 | risk table and open-question table | [x] 已写入 |
| 18.3 | pre-implementation handling rules / formal draft / final closure | [x] 已写入 |

### 1.8 Step 18 写入红线

| 红线 | 说明 |
|---|---|
| 不修改正式 `03` | 正式 `03-详细设计.md` 留 Step 19 装配 |
| 不新增实现契约 | 不新增 object、field、function、port、adapter、repository、state、error、DTO、event、job、stored material 或 config key |
| 不补下游文档 | 不生成正式 `04/05/06/07`,只记录它们对实现移交的风险 |
| 不写测试 / 验收细节 | 不创建正式 test id、suite、fixture path、CI job、coverage threshold、artifact schema、evidence id 或 acceptance result |
| 不写实施计划 | 不定义 phase、commit boundary、任务拆分、提交计划、交付排期或永久记忆种子 |
| 不把风险写成结论 | 未确认事项不能在回填草稿中变成已确认 schema、状态、默认值、产品选择或落码口径 |
| 不复制参考项目业务风险 | governance Step 18 只作粒度参考,identity 风险只来自 identity 真相源 |

### 1.9 18.0 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否承接 Step 17 handoff | 通过 | §1.3 / §1.4 已承接 `DDD-S18-HANDOFF-001`~`005` |
| 是否限定 Step 18 范围 | 通过 | 只写风险 / 待确认事项框架,不写实现契约 |
| 是否新增 schema / port / state / error / DTO | 未新增 | 本批只写框架和分类原则 |
| 是否提前定义 phase / commit boundary | 未定义 | 留给后续正式 `07` |
| 是否提前写 TC / fixture / CI / evidence | 未写入 | 留给 `05/06/07` |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | 18.1 | risk classification and closure baseline |

---

## 2. 18.1 risk classification and closure baseline

本批把需求 / 架构 / 概要层遗留风险、Step 6~17 曾出现的 open item、Step 17 handoff input 和当前详细设计收口状态统一分类。它只建立“哪些不再列为风险、哪些继续保留、哪些交给下游文档复核”的判断基线,不写风险表最终版本。

### 2.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 18.1 risk classification and closure baseline |
| 当前结论 | 已区分已闭合项、正式实现移交阻塞项、下游文档复核项、实现环境项、生产化 / 验收项和命名漂移项 |
| 本批关闭事项 | DDD-S18-OPEN-001 |
| 本批边界 | 不新增 schema、port、state、error、DTO、config key、test id、fixture、CI、evidence、phase 或 commit boundary |
| 下一批 | 18.2 risk table and open-question table |

### 2.2 Classification rule

| 分类 | 是否进入 18.2 风险表 | 判定口径 |
|---|---|---|
| 已由详细设计闭合 | 不进入 | Step 6~17 已给出正式 object / port / protocol / flow / state / persistence / error / idempotency / config binding / observability / test cut 来源,实现者不需要自行补口 |
| 正式实现移交阻塞 | 进入 | 没有 Step 19 正式 `03`、没有正式 `07` 逐 boundary 审计、或 design baseline 未固定,会阻塞实现 agent 开工 |
| 下游文档复核门禁 | 进入 | `04/05/06/07` 需要按新版 `03` 复核或重写,否则配置、测试、验收或实施计划会反向污染详细设计 |
| 实现环境开工风险 | 视影响进入 | 目标实现仓、sibling dependency、workspace / git config、真实 runtime 条件未确认;若阻塞代码写入或编译,进入风险表 |
| 生产化 / 验收风险 | 进入或作为待确认 | 不改变详细设计契约,但影响 durable adapter、真实集成、运行证据或最终 pass 裁决 |
| 命名 / legacy drift | 进入 | 旧文档、旧对象、旧状态、旧配置或旧实现口径可能进入 Step 19 / 下游文档 |
| 普通后续任务 | 不进入 | 不影响 1:1 落码、不改变实现契约、不阻塞正式移交的排期、优化或实施细节 |

### 2.3 已关闭风险不再列入

| 历史风险 / open item | 关闭依据 | 不再列入 18.2 风险表的原因 |
|---|---|---|
| 旧 `03` 可否直接继承 | Step 1 / Step 17 | 已明确旧 `03` 只作诊断;剩余风险是 Step 19 尚未装配正式 `03`,不是旧稿可继承性问题 |
| 本轮范围与非范围不清 | Step 2 | P0 范围、非范围、相邻仓 truth、配置 / 测试 / 验收 / 实施边界已固定 |
| 单 crate 还是 workspace 多 crate | Step 3 / Step 4 | 目标 workspace、crate / package / module / binary layout 已由 Step 4 固定;不再作为详细设计风险 |
| 模块职责和依赖方向不清 | Step 5 / Step 17 | contracts / domain / application / infra / api / worker / jobs 的职责和依赖方向已形成 implementation inventory |
| Step 6 对象字段来源大量 open item | Step 7~13 / Step 17 | 字段来源、required / optional、factory、policy、mapper、cursor、version、stored result 等已由后续 Step 闭合;不全量复制旧 open list |
| role / capability source 与 evidence accepted 主线不闭合 | Step 7 / Step 8 / Step 9 / Step 10 / Step 12 / Step 17 | accepted `Active` summary 的 resolver、safe summary、source version、authoritative evidence 和 forbidden material 口径已闭合 |
| high-risk lifecycle basis 只凭 ref presence 判断 | Step 7 / Step 9 / Step 10 / Step 12 | high-risk flow 必须 resolve valid governance basis summary,不得仅凭 ref / string accepted |
| work participation / career append-only 与 duplicate source marker 不清 | Step 8 / Step 9 / Step 10 / Step 11 / Step 13 | career append-only、correction append、source duplicate no-new-history、stored replay 和 version / key 区分已闭合 |
| memory / archive relation、handoff delivered 和 receipt marker 不清 | Step 6 / Step 8 / Step 9 / Step 10 / Step 12 / Step 14 | ref-only、pending / delivered / failed marker、formal receipt marker、no raw body 和 target binding 已闭合 |
| query visibility / read subject / projection lookup 不清 | Step 7 / Step 8 / Step 9 / Step 10 / Step 11 / Step 12 | query visibility-first、stable view lookup、not visible / degraded / stale / missing / redacted surface 和 no-write 已闭合 |
| trace / audit / outbox subject 需要字符串拼接 | Step 7 / Step 9 / Step 11 / Step 17 | formal subject mapper、marker mapper 和 canonical key 来源已作为 `07` 审计输入;不得实现者拼接 |
| projection / reference cursor、version、lookup 可混用 | Step 7 / Step 10 / Step 11 / Step 13 | cursor / version / key / idempotency key 禁止替代规则已闭合 |
| outbound payload / publisher 从 current truth 重构 | Step 8 / Step 9 / Step 11 / Step 12 | accepted-only payload snapshot、body-free marker、stored outbox record 和 publisher failure classification 已闭合 |
| fake / controlled adapter 伪造 business success | Step 7 / Step 14 / Step 16 / Step 17 | fake parity、disabled / controlled / endpoint boundary 和 no fake delivered / no fake published 已列为实现门禁 |
| observability / audit 保存 raw body 或 secret | Step 15 / Step 16 / Step 17 | log / metric / audit / trace / report / handoff 的 safe refs/kinds/issues/markers 和 forbidden material guard 已闭合 |
| 最小测试入口缺失 | Step 16 / Step 17 | 模块、协议、状态、persistence、error、config、observability 和 script contract 的最小 test cut 已给出;正式测试编号留 `05` |

### 2.4 继续保留的风险来源

| 风险来源 | 保留原因 | 后续归类 |
|---|---|---|
| `DDD-S18-HANDOFF-001`:正式 `03` 尚未 Step 19 装配 | 当前中间产物不是正式实现基线;旧 `03` 不能作为新版实现入口 | 正式实现移交阻塞 |
| `DDD-S18-HANDOFF-002`:现有 `04/05/06/07` 需按新版 `03` 复核 | 下游配置、测试、验收、实施计划可能仍有旧口径,不得反向约束新版详细设计 | 下游文档复核门禁 |
| `DDD-S18-HANDOFF-003`:正式 `07` 必须逐 boundary 可落码审计 | Step 17 只提供审计输入,不替 `07` 给出 boundary 结论 | 正式实现移交阻塞 |
| `DDD-S18-HANDOFF-004`:正式测试编号 / fixture / CI / evidence / 验收裁决未定义 | Step 16 只有最小测试切口;正式验证材料属于 `05/06/07` | 下游验证门禁 |
| `DDD-S18-HANDOFF-005`:旧文档和旧实现口径可能残留旧名 | Step 19 和下游文档装配时仍可能出现旧对象、旧状态、旧配置或旧验收名 | 命名 / legacy drift |
| `core-contracts` baseline 与目标实现仓现实条件 | Step 3 已限定唯一编译期 sibling 依赖候选,但开工前仍需确认实际 path、version 和 type shape | 实现环境开工风险 |
| 目标实现仓 / git config / workspace 实际状态 | Step 3 / Step 4 只给设计约束;正式代码开工前仍需由 `07` 和实现 agent 二次校验 | 实现环境开工风险 |
| durable store、broker、search、HTTP、metric、DLQ、external GRC、archive 等真实产品绑定 | 详细设计已固定 port / adapter 语义,但真实产品和 deployment evidence 不在 `03` 中裁决 | 生产化 / 验收风险 |
| performance / availability baseline 和最终 pass 裁决 | 需求 / 架构 / 概要均要求不继承旧硬阈值;Step 16 不生成正式验收阈值 | 生产化 / 验收风险 |

### 2.5 不进入风险表的普通后续任务

| 普通后续任务 | 不进入风险表原因 | 应由谁处理 |
|---|---|---|
| 编写正式 `04/05/06/07` 正文 | 本身是后续文档任务;只有未按新版 `03` 复核才构成风险 | 对应文档 SOP |
| 为已闭合协议补具体 Rust 文件 | 属于实现计划和代码实施,不是详细设计风险 | `07` 和实现 agent |
| 为 Step 16 test cut 分配正式测试编号 | 属于测试方案职责,不是 Step 18 直接新增事项 | `05-测试方案.md` |
| 为验收 evidence 分配编号和报告路径 | 属于验收标准 / 测试方案 / 实施计划职责 | `05/06/07` |
| 选择某个 durable DB、message broker 或 metric backend | 若不影响 port semantics,只是后续 adapter / 配置产品绑定 | `04/07` 或 adapter design |
| 性能优化、缓存策略、部署脚本、运维 runbook | 不改变当前详细设计实现契约 | 后续运维 / 实施文档 |

### 2.6 18.1 预复核结论

| 复核项 | 结论 | 说明 |
|---|---|---|
| 是否区分已闭合项与保留风险 | 通过 | §2.3 / §2.4 已拆分 |
| 是否避免把 Step 6 历史 open item 全量复制成风险 | 通过 | 只保留 Step 17 handoff 和仍影响实现移交 / 下游复核的事项 |
| 是否保留正式实现移交阻塞项 | 通过 | 正式 `03`、正式 `07` boundary audit 和 design baseline 已保留 |
| 是否把下游测试 / 验收 / evidence 留给 `05/06/07` | 通过 | Step 18 只记录风险,不创建测试或证据编号 |
| 是否新增实现契约 | 未新增 | 本批只做分类基线 |
| 是否关闭 DDD-S18-OPEN-001 | 已关闭 | risk classification and closure baseline 已写入 |

### 2.7 18.1 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 已闭合风险是否不再列入 | 通过 | §2.3 已列 closed baseline |
| 仍需保留风险是否有来源 | 通过 | §2.4 主要来自 Step 17 handoff 和实现环境 / 生产化门禁 |
| 是否把普通后续任务包装成风险 | 未包装 | §2.5 明确排除 |
| 是否新增 schema / port / state / error / DTO | 未新增 | 本批只做分类 |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | 18.2 | risk table and open-question table |

---

## 3. 18.2 risk table and open-question table

本批基于 18.1 的保留风险来源,输出详细设计收口阶段仍需记录的风险表和待确认事项表。风险表记录已识别且会影响实现移交、下游文档复核、开工环境或最终验收的事项;待确认事项表记录仍缺裁决且不能写成已闭口结论的事项。

### 3.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 18.2 risk table and open-question table |
| 当前结论 | 已输出风险表和待确认事项表,并为每项标注影响、阻塞范围、确认方和未确认前处理方式 |
| 本批关闭事项 | DDD-S18-OPEN-002、DDD-S18-OPEN-003 |
| 本批边界 | 不新增 schema、port、state、error、DTO、config key、test id、fixture、CI、evidence、phase 或 commit boundary |
| 下一批 | 18.3 pre-implementation handling rules / formal draft / final closure |

### 3.2 风险表

| 风险编号 | 风险 | 影响 | 阻塞范围 | 缓解方式 | 负责人 / 待确认方 |
|---|---|---|---|---|---|
| DDD-S18-RISK-001 | Step 19 正式 `03-详细设计.md` 尚未装配 | 当前 `design-calibration` 是中间产物,不能替代正式实现基线;旧 `03` 不能作为新版实现真相源 | 阻塞正式实现移交和 `07` 最终审计通过 | Step 19 从 Step 1~18 已审核产物装配正式 `03`,并保留校准来源 | 详细设计维护者 |
| DDD-S18-RISK-002 | 现有 `04/05/06/07` 需要按新版 `03` 复核或重写 | 配置、测试、验收、实施计划可能仍含旧对象、旧状态、旧阈值、旧证据或旧 boundary | 阻塞正式配置 / 测试 / 验收 / 实施计划移交;不阻塞 Step 19 装配 | 后续按对应 SOP 复核或重写 `04/05/06/07`,不得反向约束新版 `03` | 配置 / 测试 / 验收 / 实施计划维护者 |
| DDD-S18-RISK-003 | 正式 `07` 尚未按 phase / commit boundary 完成可落码闭环审计 | Step 17 只提供审计输入,未定义正式 boundary 结论;实现 agent 不能自行拆分 | 阻塞实现 agent 开工门禁 | `07` 根据正式 `03/05/06` 定义 boundary,逐项审计字段、DTO、flow、state、persistence、error、idempotency、config、observability、test/evidence 和经验项 | 实施计划维护者 |
| DDD-S18-RISK-004 | 正式测试编号、fixture、CI、evidence 和验收裁决未定义 | Step 16 只有最小测试切口,无法替代正式 test plan、acceptance gate 和 evidence traceability | 阻塞正式测试 / 验收门禁;不阻塞详细设计对象契约 | `05` 分配测试用例、suite、fixture、CI 和 artifact 口径;`06` 定义验收 / veto / evidence 裁决;`07` 映射到 boundary | 测试方案 / 验收标准 / 实施计划维护者 |
| DDD-S18-RISK-005 | 旧 `03/04/05/06/07` 和旧实现口径可能残留旧名 | Step 19 或下游复核时可能把旧对象、旧状态、旧 API、旧配置或旧验收名带回新版链路 | 阻塞正式 `03` 装配自检和下游文档复核通过 | Step 19 装配时执行命名一致性检查;下游文档按新版 `03` 重建引用 | 详细设计维护者 / 下游文档维护者 |
| DDD-S18-RISK-006 | `core-contracts` baseline 与目标实现仓现实条件开工前仍需二次校验 | Step 3 已限定唯一编译期 sibling 依赖候选,但实现仓实际 path、version、shared type shape 可能变化 | 阻塞依赖 shared type 的代码开工或编译通过 | `07` 开工前检查目标实现仓、path dependency 和 shared type;缺失时暂停并回设计或上游 contracts | core 负责人 / 实施计划维护者 / 实现 agent |
| DDD-S18-RISK-007 | 目标实现仓、workspace、git config 和提交纪律需在正式开工前确认 | 详细设计给出 layout 和提交约束,但代码仓实际状态仍需 implementation handoff 二次校验 | 阻塞代码写入、测试运行和实现仓提交 | `07` 前置阅读 / 开工门禁确认实现仓、workspace、crate、git config、commit language 和 quality gates | 实施计划维护者 / 实现 agent |
| DDD-S18-RISK-008 | durable store、broker、search、HTTP、metric、DLQ、external GRC、archive 等真实产品绑定未在 `03` 裁决 | port / adapter 语义已闭合,但真实产品、deployment 参数、operator evidence 不属于详细设计正文 | 不阻塞 P0 fake / in-memory 实现;阻塞 production adapter 和真实集成验收 | `04/07` 或后续 adapter / 运维设计固定产品绑定;实现未确认前使用正式 fake / disabled / controlled 语义 | 架构 / 配置 / 运维 / 相邻仓负责人 |
| DDD-S18-RISK-009 | performance / availability baseline 和最终 pass 裁决未定义 | 需求 / 架构 / 概要均不继承旧硬阈值;Step 16 不定义正式验收阈值 | 阻塞最终 performance / availability pass 裁决 | `05/06` 建立 baseline、sample、threshold 或人工评审口径;不得在实现阶段沿用旧数字 | 测试方案 / 验收标准维护者 |

### 3.3 待确认事项表

| 事项编号 | 事项 | 当前影响 | 需要谁确认 | 未确认前处理方式 |
|---|---|---|---|---|
| DDD-S18-OQ-001 | Step 19 何时装配正式 `03-详细设计.md` | 决定何时形成正式实现基线和 `07` 审计输入 | 详细设计维护者 / 用户 | 不按旧 `03` 或单独校准文件正式开工;继续等待 Step 19 |
| DDD-S18-OQ-002 | `04-配置设计.md` 是保留修订还是按新版 `03` 重写 | 影响 config schema、profile、adapter binding、entry-local 参数、secret boundary 和 config evidence | 配置设计维护者 / 用户 | 不在代码中补完整 config 真相源;只保留 Step 14 的 binding contract |
| DDD-S18-OQ-003 | `05-测试方案.md` / `06-验收标准.md` 如何按新版 `03` 复核 | 影响正式测试编号、fixture、CI、artifact、evidence、veto 和验收裁决 | 测试方案 / 验收标准维护者 / 用户 | 不引用旧测试 / 旧验收作为新版实现门禁;只使用 Step 16 最小测试切口作为输入 |
| DDD-S18-OQ-004 | `07-实施计划.md` 何时生成并完成逐 boundary 审计 | 影响 phase / commit boundary、提交纪律、经验复核、开工门禁和实现 agent handoff | 实施计划维护者 / 用户 | 不自行拆 phase、commit boundary 或提交计划 |
| DDD-S18-OQ-005 | 目标实现仓、workspace 和 `core-contracts` baseline 是否与设计一致 | 影响代码落点、Cargo dependency、shared type 编译和测试运行 | 实施计划维护者 / core 负责人 / 实现 agent | 开工前二次校验;不复制上游类型,缺失时暂停回写设计或上游 contracts |
| DDD-S18-OQ-006 | 真实 durable / broker / search / HTTP / metric / DLQ / external GRC / archive 产品选择 | 影响 durable adapter、migration、topic、handoff target、observability backend、real integration evidence | 架构 / 配置 / 运维 / 相邻仓负责人 | P0 使用 fake / in-memory / disabled / controlled 语义;不把产品细节写入 domain / application |
| DDD-S18-OQ-007 | performance / availability baseline 与 pass 规则 | 影响 `05/06` NFR 测试、release evidence 和最终 pass / conditional pass | 测试方案 / 验收标准维护者 | 不继承旧阈值;未定义前不能宣告最终性能 / 可用性通过 |
| DDD-S18-OQ-008 | 旧名 / 旧对象 / 旧状态 / 旧配置在 Step 19 和下游文档中的清理策略 | 影响正式文档一致性和实现者阅读口径 | 详细设计维护者 / 下游文档维护者 | 旧材料只作历史诊断;发现旧名回流时暂停装配或复核 |

### 3.4 风险覆盖复核

| 覆盖面 | 结论 | 说明 |
|---|---|---|
| 正式实现移交阻塞 | 已覆盖 | DDD-S18-RISK-001、003 |
| 下游文档复核门禁 | 已覆盖 | DDD-S18-RISK-002、004 |
| 命名 / legacy drift | 已覆盖 | DDD-S18-RISK-005 |
| 实现环境开工风险 | 已覆盖 | DDD-S18-RISK-006、007 |
| 生产化 / 验收风险 | 已覆盖 | DDD-S18-RISK-008、009 |
| 已闭合详细设计 surface | 未重复列入 | role/source/basis/projection/outbox/fake/redaction 等已由 Step 6~17 闭合的事项不再重复挂起 |

### 3.5 18.2 预复核结论

| 复核项 | 结论 | 说明 |
|---|---|---|
| 风险表是否覆盖保留风险来源 | 通过 | §3.2 覆盖 §2.4 的全部来源 |
| 待确认事项是否有确认方 | 通过 | §3.3 每项均列确认方 |
| 未确认前处理方式是否明确 | 通过 | §3.3 每项均列处理方式 |
| 是否把已闭合项重新列为风险 | 未列入 | §3.4 明确已闭合 surface 不重复挂起 |
| 是否新增 schema / port / state / error / DTO | 未新增 | 本批只写风险 / 待确认事项 |
| 是否关闭 DDD-S18-OPEN-002 / 003 | 已关闭 | 风险表和待确认事项表已写入 |

### 3.6 18.2 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否形成风险表 | 通过 | §3.2 |
| 是否形成待确认事项表 | 通过 | §3.3 |
| 是否标注阻塞范围 | 通过 | 风险表含 `阻塞范围` |
| 是否说明未确认前处理 | 通过 | 待确认事项表含处理方式 |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | 18.3 | pre-implementation handling rules / formal draft / final closure |

---

## 4. 18.3 pre-implementation handling rules / formal draft / final closure

本批收口 Step 18,补充未确认前实现处理规则、正式 `03` 第 17 章回填草稿和进入 Step 19 的条件。本批不新增风险项或待确认事项,也不把待确认事项写成已闭口实现契约。

### 4.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 18.3 pre-implementation handling rules / formal draft / final closure |
| 当前结论 | 已形成未确认前处理规则、正式回填草稿和 Step 19 进入条件;Step 18 可收口 |
| 本批关闭事项 | DDD-S18-OPEN-004 |
| 本批边界 | 不新增 schema、port、state、error、DTO、config key、test id、fixture、CI、evidence、phase 或 commit boundary |
| 下一步 | Step 19 正式详细设计文档装配 |

### 4.2 未确认前实现处理规则

| 场景 | 未确认前处理方式 | 禁止事项 |
|---|---|---|
| 正式 `03` 未装配 | 不正式移交实现;继续 Step 19 装配 | 按旧 `03`、单个校准文件或实现仓现状直接开工 |
| `04/05/06/07` 未按新版 `03` 复核 | 不把旧配置、旧测试、旧验收或旧实施计划作为新版实现门禁 | 用旧下游文档反向改写新版详细设计 |
| 正式 `07` boundary 审计未完成 | 不拆 phase / commit boundary,不提交实现计划,不交给实现 agent | 让实现 agent 自行决定任务批次、测试门禁或经验复核结论 |
| 测试 / fixture / CI / evidence 未定义 | 只引用 Step 16 最小测试切口作为输入,等待 `05/06/07` 给正式门禁 | 在 Step 18 或代码实现中临时创建正式测试 / 验收编号 |
| 旧名 / 旧对象 / 旧状态回流 | 暂停装配或复核,回到对应 Step / 正式文档修正 | 把旧名作为兼容别名进入正式实现契约 |
| `core-contracts` 或目标实现仓与设计不一致 | 开工前暂停,记录缺口并回设计或上游 contracts | 复制上游类型、私自定义 shared DTO 或绕过 path dependency |
| 真实产品绑定未确认 | 使用已定义 fake / in-memory / disabled / controlled 语义;真实 adapter 后续闭口 | 把 DB / broker / GRC / archive / metric / DLQ 产品选择写入 domain / application |
| 性能 / 可用性 baseline 未确认 | 不宣告最终 NFR pass;等待 `05/06` 建立基线 | 沿用旧阈值或用单次样本替代正式验收裁决 |
| 实现中发现字段 / DTO / 状态 / port / mapper / version source 缺口 | 暂停并按 Step 17 blocker 格式回报设计缺口 | 在代码里补 placeholder、拼 key、猜 mapper、默认 version 或绕过 repository surface |

### 4.3 Formal `03` 回填草稿

> 校准来源:
> - `projects/L1-identity/design-calibration/03_ddd_step_18_risks_open_questions.md`

#### 17. 风险与待确认事项

本章记录详细设计阶段仍未关闭、会影响正式实现移交、下游文档复核、开工环境或最终验收裁决的风险与待确认事项。风险和待确认事项不是实现自由度;如果后续正式设计没有给出 schema、port、state、error、DTO、config、test、evidence 或 boundary 来源,实现阶段必须暂停并回报设计缺口。

##### 17.1 风险表

| 风险编号 | 风险 | 影响 | 阻塞范围 | 缓解方式 | 负责人 / 待确认方 |
|---|---|---|---|---|---|
| DDD-S18-RISK-001 | Step 19 正式 `03-详细设计.md` 尚未装配 | 当前 `design-calibration` 是中间产物,不能替代正式实现基线;旧 `03` 不能作为新版实现真相源 | 阻塞正式实现移交和 `07` 最终审计通过 | Step 19 从 Step 1~18 已审核产物装配正式 `03`,并保留校准来源 | 详细设计维护者 |
| DDD-S18-RISK-002 | 现有 `04/05/06/07` 需要按新版 `03` 复核或重写 | 配置、测试、验收、实施计划可能仍含旧对象、旧状态、旧阈值、旧证据或旧 boundary | 阻塞正式配置 / 测试 / 验收 / 实施计划移交;不阻塞 Step 19 装配 | 后续按对应 SOP 复核或重写 `04/05/06/07`,不得反向约束新版 `03` | 配置 / 测试 / 验收 / 实施计划维护者 |
| DDD-S18-RISK-003 | 正式 `07` 尚未按 phase / commit boundary 完成可落码闭环审计 | Step 17 只提供审计输入,未定义正式 boundary 结论;实现 agent 不能自行拆分 | 阻塞实现 agent 开工门禁 | `07` 根据正式 `03/05/06` 定义 boundary,逐项审计字段、DTO、flow、state、persistence、error、idempotency、config、observability、test/evidence 和经验项 | 实施计划维护者 |
| DDD-S18-RISK-004 | 正式测试编号、fixture、CI、evidence 和验收裁决未定义 | Step 16 只有最小测试切口,无法替代正式 test plan、acceptance gate 和 evidence traceability | 阻塞正式测试 / 验收门禁;不阻塞详细设计对象契约 | `05` 分配测试用例、suite、fixture、CI 和 artifact 口径;`06` 定义验收 / veto / evidence 裁决;`07` 映射到 boundary | 测试方案 / 验收标准 / 实施计划维护者 |
| DDD-S18-RISK-005 | 旧 `03/04/05/06/07` 和旧实现口径可能残留旧名 | Step 19 或下游复核时可能把旧对象、旧状态、旧 API、旧配置或旧验收名带回新版链路 | 阻塞正式 `03` 装配自检和下游文档复核通过 | Step 19 装配时执行命名一致性检查;下游文档按新版 `03` 重建引用 | 详细设计维护者 / 下游文档维护者 |
| DDD-S18-RISK-006 | `core-contracts` baseline 与目标实现仓现实条件开工前仍需二次校验 | Step 3 已限定唯一编译期 sibling 依赖候选,但实现仓实际 path、version、shared type shape 可能变化 | 阻塞依赖 shared type 的代码开工或编译通过 | `07` 开工前检查目标实现仓、path dependency 和 shared type;缺失时暂停并回设计或上游 contracts | core 负责人 / 实施计划维护者 / 实现 agent |
| DDD-S18-RISK-007 | 目标实现仓、workspace、git config 和提交纪律需在正式开工前确认 | 详细设计给出 layout 和提交约束,但代码仓实际状态仍需 implementation handoff 二次校验 | 阻塞代码写入、测试运行和实现仓提交 | `07` 前置阅读 / 开工门禁确认实现仓、workspace、crate、git config、commit language 和 quality gates | 实施计划维护者 / 实现 agent |
| DDD-S18-RISK-008 | durable store、broker、search、HTTP、metric、DLQ、external GRC、archive 等真实产品绑定未在 `03` 裁决 | port / adapter 语义已闭合,但真实产品、deployment 参数、operator evidence 不属于详细设计正文 | 不阻塞 P0 fake / in-memory 实现;阻塞 production adapter 和真实集成验收 | `04/07` 或后续 adapter / 运维设计固定产品绑定;实现未确认前使用正式 fake / disabled / controlled 语义 | 架构 / 配置 / 运维 / 相邻仓负责人 |
| DDD-S18-RISK-009 | performance / availability baseline 和最终 pass 裁决未定义 | 需求 / 架构 / 概要均不继承旧硬阈值;Step 16 不定义正式验收阈值 | 阻塞最终 performance / availability pass 裁决 | `05/06` 建立 baseline、sample、threshold 或人工评审口径;不得在实现阶段沿用旧数字 | 测试方案 / 验收标准维护者 |

##### 17.2 待确认事项表

| 事项编号 | 事项 | 当前影响 | 需要谁确认 | 未确认前处理方式 |
|---|---|---|---|---|
| DDD-S18-OQ-001 | Step 19 何时装配正式 `03-详细设计.md` | 决定何时形成正式实现基线和 `07` 审计输入 | 详细设计维护者 / 用户 | 不按旧 `03` 或单独校准文件正式开工;继续等待 Step 19 |
| DDD-S18-OQ-002 | `04-配置设计.md` 是保留修订还是按新版 `03` 重写 | 影响 config schema、profile、adapter binding、entry-local 参数、secret boundary 和 config evidence | 配置设计维护者 / 用户 | 不在代码中补完整 config 真相源;只保留 Step 14 的 binding contract |
| DDD-S18-OQ-003 | `05-测试方案.md` / `06-验收标准.md` 如何按新版 `03` 复核 | 影响正式测试编号、fixture、CI、artifact、evidence、veto 和验收裁决 | 测试方案 / 验收标准维护者 / 用户 | 不引用旧测试 / 旧验收作为新版实现门禁;只使用 Step 16 最小测试切口作为输入 |
| DDD-S18-OQ-004 | `07-实施计划.md` 何时生成并完成逐 boundary 审计 | 影响 phase / commit boundary、提交纪律、经验复核、开工门禁和实现 agent handoff | 实施计划维护者 / 用户 | 不自行拆 phase、commit boundary 或提交计划 |
| DDD-S18-OQ-005 | 目标实现仓、workspace 和 `core-contracts` baseline 是否与设计一致 | 影响代码落点、Cargo dependency、shared type 编译和测试运行 | 实施计划维护者 / core 负责人 / 实现 agent | 开工前二次校验;不复制上游类型,缺失时暂停回写设计或上游 contracts |
| DDD-S18-OQ-006 | 真实 durable / broker / search / HTTP / metric / DLQ / external GRC / archive 产品选择 | 影响 durable adapter、migration、topic、handoff target、observability backend、real integration evidence | 架构 / 配置 / 运维 / 相邻仓负责人 | P0 使用 fake / in-memory / disabled / controlled 语义;不把产品细节写入 domain / application |
| DDD-S18-OQ-007 | performance / availability baseline 与 pass 规则 | 影响 `05/06` NFR 测试、release evidence 和最终 pass / conditional pass | 测试方案 / 验收标准维护者 | 不继承旧阈值;未定义前不能宣告最终性能 / 可用性通过 |
| DDD-S18-OQ-008 | 旧名 / 旧对象 / 旧状态 / 旧配置在 Step 19 和下游文档中的清理策略 | 影响正式文档一致性和实现者阅读口径 | 详细设计维护者 / 下游文档维护者 | 旧材料只作历史诊断;发现旧名回流时暂停装配或复核 |

##### 17.3 未确认前实现处理规则

实现者或后续文档维护者在上述事项未确认前必须遵守以下规则:

- 不得按旧 `03`、旧 `04/05/06/07` 或实现仓现状反向改写新版详细设计。
- 不得自行新增 schema、port、state、error、DTO、mapper、lookup、version source、stored surface、config key、test id、fixture、CI、evidence、phase 或 commit boundary。
- 不得用字符串拼接、默认 version、fake private map、raw external body、adapter success、旧阈值或旧测试编号替代正式设计来源。
- 运行期产品未确认时,只能使用详细设计已定义的 fake / in-memory / disabled / controlled 语义,不得伪造业务成功。
- 发现实现条件与设计 baseline 不一致时,必须暂停并回报具体 blocker、证据、影响范围和建议闭口点。

### 4.4 Step 18 final closure checklist

| 检查项 | 结论 | 说明 |
|---|---|---|
| 风险表是否完整 | 通过 | §3.2 和 §4.3 已覆盖正式实现移交、下游文档、开工环境、生产化 / 验收和 legacy drift |
| 待确认事项是否完整 | 通过 | §3.3 和 §4.3 已给出确认方和未确认前处理方式 |
| 未确认前实现处理规则是否明确 | 通过 | §4.2 和 §4.3 已给出暂停 / 禁止 / 降级规则 |
| 是否把不确定项写成已确认契约 | 未写成 | 回填草稿保留风险 / 待确认事项身份 |
| 是否新增实现契约 | 未新增 | 未新增 schema、port、state、error、DTO、config、test、evidence 或 boundary |
| 是否可进入 Step 19 | 可以 | Step 18 风险与待确认事项已收口 |

### 4.5 18.3 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否关闭 DDD-S18-OPEN-004 | 已关闭 | 未确认前处理规则、正式回填草稿和 Step 19 条件已写入 |
| Step 18 是否完成 | 完成 | 18.0~18.3 均已写入 |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | Step 19 | 正式详细设计文档装配 |

---

## 5. 待确认事项

| 编号 | 事项 | 所属批次 | 当前处理 |
|---|---|---|---|
| DDD-S18-OPEN-001 | Step 6~17 已闭合风险与仍需保留风险如何分界 | 18.1 | 已闭合 |
| DDD-S18-OPEN-002 | 风险表是否完整覆盖会影响实现或下游移交的事项 | 18.2 | 已闭合 |
| DDD-S18-OPEN-003 | 待确认事项是否都有确认方和未确认前处理方式 | 18.2 | 已闭合 |
| DDD-S18-OPEN-004 | 未确认前实现处理规则、正式回填草稿和 Step 19 进入条件是否闭合 | 18.3 | 已闭合 |

---

## 6. 进入下一步条件

进入 Step 19 前必须满足:

- 用户审核通过 Step 18.3。
- Step 19 只从 Step 1~18 已审核中间产物装配正式 `03-详细设计.md`,不得新增未审核设计结论。
- Step 19 必须显式标注每个正式章节的校准来源。
- Step 19 必须保留 Step 18 的风险与待确认事项身份,不得把它们润色成已确认契约。
