# Step 13. 非功能需求

## 1. Step 状态

- 状态：[x] 已完成并通过（2026-08-22）
- 对应 SOP：`需求文档讨论流程_SOP.md` Step 13
- 回填章节：`00-需求文档.md` §13（书写规范 4.13）
- 量化纪律：当前无正式 workload、环境基线或 release authority，不继承旧 SLA、容量、延迟和时间阈值

### 1.1 Step 内计划

- [x] 读取 Step 13 SOP、书写规范 4.13、Step 07 / 10 / 11 / 12
- [x] 按 C-MS-1~5 识别局部质量约束，并把全仓约束单列
- [x] 逐项检查性能、可用性、安全、审计 / 可追溯、幂等 / 一致性、可观测性
- [x] 为每项要求给出可判断口径，区分当前判断与未来量化
- [x] 映射能力节点、功能、规则和 Step 14 验收入口
- [x] 审计 pending、fake readiness 与旧指标污染
- [x] 检查监控、日志字段、重试、缓存、数据库和加密实现泄漏

## 2. 本步输入与效力

| 输入 | 效力 | 本步使用方式 |
|---|---|---|
| 需求 SOP Step 13 / 书写规范 4.13 | current_standard | 固定六类检查框架、三列表和可判断门禁 |
| `00_req_step_07_core_capability_loop.md` | pass | 固定 C-MS-1~5 及核心 / 外围质量范围 |
| `00_req_step_10_business_rules_boundaries.md` | pass | 将显式变化、owner、unknown fence、history 和 forbidden-body 规则转为质量门禁 |
| `00_req_step_11_data_ownership.md` | pass | 保护 truth / snapshot / ref / forbidden-body 的质量边界 |
| `00_req_step_12_interfaces_dependencies.md` | pass | 固定能力接口、依赖失效语义和 seam readiness 分层 |
| `L2-runtime` 当前正式 00~07 / `L2-member` 正式 00 | current_formal | 对齐 host / runtime / member owner 边界，不把兄弟质量目标搬入本仓 |
| `L2-member-images` 正式 00 与当前台账 | requirement_boundary_formally_stopped；detailed_contract_pending | 采用需求级 pinned entry 方向，不采用未闭口 exact contract、指标或 readiness |
| 旧正式 00 / README / 01~03 / 05~06 | historical_material | 只做候选测量维度与污染审计，不继承数字或实现方案 |

## 3. SOP 问题回答

1. 性能要求是什么？

   回答：宿主意图判定、当前事实读取、注册 / 信号受理和本地处置提交不应因外围视图、报告或外部 handoff 无限阻塞；装配、启动、恢复和清理必须区分本地处理与外部依赖等待。当前只能定义 workload、能力阶段、依赖状态、结果分类和环境一致的测量口径，不能给出正式数字。

2. 可用性要求是什么？

   回答：必要依赖失效时受影响的新动作必须 waiting / blocked / degraded / unknown 或 fail closed，但既有本地宿主 truth 和安全查询不能被抹写；Bus、Observability 和外围增强失效不能回滚核心 truth。

3. 安全要求是什么？

   回答：项目型执行主语、授权、凭据和 required binding 必须可验证；不得用 fallback、默认 actor 或 fake 绕过；本仓不得保存 L1、Member、Runtime、Images、Tools、Sandbox、backend 或外部消费正文。

4. 审计 / 可追溯要求是什么？

   回答：意图、决定、装配、实例世代、注册、会话、健康、处置、清理、对账与 handoff 的关键结论必须可回链来源、scope、实例、前置、结果和缺口；无需也不得保存外部正文或隐藏推理。

5. 幂等 / 一致性要求是什么？

   回答：重复、并发、迟到、乱序和结果未知不能产生第二套当前宿主 truth、第二活动注册、竞争实例或结果升格；新结论形成新历史，不原地改写旧事实。

6. 可观测性要求是什么？

   回答：关键状态、变化、失败层级、dependency gap 和本地 handoff 状态必须能形成最小、body-free、可关联材料；Observability backend 不可用时，本地可判断性仍须成立。

7. 哪些可以量化？

   回答：意图受理、事实查询、信号受理、装配 / 恢复 / 清理阶段耗时、并发宿主规模和事件交接延迟可在后续基线确定后量化；owner 不越权、forbidden-body 为零、无第二 truth、unknown 不升格等直接作为结构性一票否决口径。旧数字无 authority，不能进入当前目标值。

## 4. 能力节点与全局约束停审

| 顺序 | 范围 | 重点 NFR | gate_status | 停审结论 |
|---:|---|---|---|---|
| 1 | C-MS-1 意图与决定 | NFR-MS-001 / 004 / 007 / 010 / 013 | pass | 主语与决定 fail closed、可追溯、重复稳定；无无源延迟指标 |
| 2 | C-MS-2 装配与就绪 | NFR-MS-002 / 005 / 008~010 / 015 | pass | 外部等待可分解、required 前置不降级、partial 不升格 ready |
| 3 | C-MS-3 注册与会话 | NFR-MS-001 / 005 / 007~008 / 010 / 014 | pass | 活动关联唯一，凭据 / 正文边界成立，对端 pending 不伪造可用 |
| 4 | C-MS-4 健康与处置 | NFR-MS-002 / 005~006 / 010 / 012 / 014 / 016 | pass | 四层失败、迟到保护、unknown fence 和实例世代成立 |
| 5 | C-MS-5 清理与交接 | NFR-MS-003~006 / 008 / 011~012 / 015~019 | pass | 本地与外部完成分层，历史保留，安全材料与 gap 可判断 |
| 6 | 全局 / 外围 | NFR-MS-007~009 / 017~020 | pass | owner、seam、body-free 和非伪造证据为全仓门禁；外围不阻塞核心 |

## 5. 非功能需求表

| 非功能类别 | 要求 | 判断口径 / 目标值 |
|---|---|---|
| 性能 | `NFR-MS-001` 宿主意图受理、当前事实读取、注册 / 信号受理和本地处置提交不应因外围视图、报告、归档或外部消费无限阻塞。 | 在固定 workload、宿主规模、依赖状态和同一环境下按能力面分别测量本地处理与外部等待；当前无正式数值目标。 |
| 性能 | `NFR-MS-002` 装配、健康判定、恢复与终止路径必须能区分 member-service 本地处理耗时和镜像、承载、binding、Member / Runtime 对端等待。 | 测量材料必须按能力阶段、依赖方、结果类别和是否包含资产拉取分解；不得用单一端到端数字掩盖外部等待，当前无正式数值目标。 |
| 性能 | `NFR-MS-003` 对账、预热和安全材料形成必须具有可审查的 workload 与资源边界，不得以无界扫描、无界材料或外围任务挤占核心控制面。 | 后续量化前必须给出 workload、宿主规模、材料边界、环境和超限语义；缺少 authority 时保持候选指标，不默认无限。 |
| 可用性 | `NFR-MS-004` Bus、Observability、只读消费方或外围增强能力失效时，已提交宿主 truth、核心控制决定和安全查询必须保持成立。 | 注入输出不可用、消费延迟或外围失败后，本地事实不回滚，handoff / consumption 只形成 attempt、gap、unknown 或 stale。 |
| 可用性 | `NFR-MS-005` Identity、Work、Member Images、Sandbox、Member、Runtime 或基础设施等必要依赖不可验证时，受影响动作必须显式等待、阻塞、降级、未知或拒绝，既有历史不得丢失。 | 对每类必要依赖验证 unavailable、stale、conflict、partial 和 unknown；不得出现默认值、旁路或伪 ready，存量事实仍可安全读取。 |
| 可用性 | `NFR-MS-006` 中断、重启、迟到反馈或外部副作用未知后，系统必须能保持旧实例历史和当前处置缺口，避免静默生成竞争宿主。 | 在 restart、late feedback、commit unknown 和 cleanup unknown 场景下，实例世代、hold / blocked / unknown 和残留关联仍可判定。 |
| 安全 | `NFR-MS-007` 所有宿主变更和安全读取必须受当前项目型执行主语、身份锚、scope、调用语境与正式授权边界约束。 | 非项目主语、默认 actor、scope 不匹配、授权缺失或冲突必须拒绝 / 等待；不得以 GlobalMember 或 Workspace view 替代 ProjectMember 执行主语。 |
| 安全 | `NFR-MS-008` secret、credential 正文、L1 / Member / Runtime / Images / Tools / Sandbox / backend 正文和外部 evidence / report 不得进入本仓 truth、接口输出、事件材料或观测材料。 | 对全部写面、读面和 handoff 面检查四类数据边界；任何 forbidden-body 或 secret 泄漏均为不通过。 |
| 安全 | `NFR-MS-009` required SandboxBinding、正式 pinned 镜像、凭据资格及其他正向 seam 不得被 host fallback、本地猜测、未资格 fake 或默认成功绕过。 | owner、scope、freshness、实例绑定或 readiness 无法证明时必须 fail closed；fake 只证明受控语义，不计真实集成通过。 |
| 审计 / 可追溯 | `NFR-MS-010` 意图、决定、装配、注册、会话、健康和处置的关键结论必须回链正式来源、适用 scope、宿主实例、前置、结果与原因。 | 任一当前结论都可从安全材料定位其来源和历史关系；外部正文不是追溯成立的必要条件。 |
| 审计 / 可追溯 | `NFR-MS-011` 清理、对账与事实交接必须区分本地决定、attempt、gap、residual、delivered、observed 与 accepted。 | 对任一交接或清理状态都能说明 truth owner、来源、当前层级和已知缺口；不得以回执或超时推导外部完成。 |
| 审计 / 可追溯 | `NFR-MS-012` 宿主实例世代、迟到 / 重复 / 冲突反馈和结论替代必须保留连续历史。 | 新事实回链旧事实且不原地抹写；可解释当前实例为何生效以及旧实例、反馈和缺口如何处置。 |
| 幂等 / 一致性 | `NFR-MS-013` 等价宿主意图在相同已提交事实下必须产生稳定结论，不得因重复或并发形成第二套生效决定或宿主。 | 对相同意图语境的重复和并发输入，当前决定、宿主关联和冲突语义唯一可判定。 |
| 幂等 / 一致性 | `NFR-MS-014` 同一当前宿主实例的活动注册、endpoint 和 host session 关联必须唯一；迟到、重放或旧实例输入不得覆盖当前关联。 | duplicate、replay、out-of-order、instance mismatch 和 replacement 场景中最多只有一个可判定当前关联，历史均保留。 |
| 幂等 / 一致性 | `NFR-MS-015` 装配 ready、健康、cleanup 和 handoff 各层语义必须保持单一正式含义，partial、attempt、receipt 或 snapshot 不得升格为完成 truth。 | 对 partial / unknown / stale / duplicate fixture 检查状态分层；不存在以局部结果替代整体或外部 owner 结论。 |
| 幂等 / 一致性 | `NFR-MS-016` 外部副作用或本地提交结果 unknown 时不得自动重放不可逆动作、竞争创建实例或改写既有事实。 | unknown 场景保持 hold / blocked / reconciliation-needed，直到新正式结论形成；不以“消除差异”为由删历史。 |
| 可观测性 | `NFR-MS-017` 宿主意图、装配、注册、会话、健康、处置、清理、对账和 handoff 的关键状态、变化与异常必须能形成最小、body-free、可关联材料。 | 即使 Observability backend 不可用，本地 safe material、查询结果或 handoff gap 仍足以判断是否发生及关联哪个宿主实例。 |
| 可观测性 | `NFR-MS-018` host、session、backend、binding 和 unknown 失败层级，以及依赖 unavailable、stale、conflict、partial 状态必须可区分。 | 任一异常均能定位到能力阶段和来源类别；不得把进程存活等同业务成功，也不得把外部失败压平为 host truth。 |
| 可观测性 | `NFR-MS-019` 事件 / 观测交接的本地 attempt、失败、重复和 gap 必须可见，但不得改变源宿主事实的成功或失败语义。 | 关闭或故障化 Bus / Observability 后仍可判断本地提交与交接状态，且源 truth 不回滚、不升格。 |
| 审计 / 可追溯 | `NFR-MS-020` 设计、测试、验收和实施材料必须持续区分 planned、waiting、blocked、not_run、fake-qualified 和真实 readiness。 | 任一正向合同或真实依赖未闭口时，不得出现无对应证据的 pass、ready、artifact、verdict 或 signoff。 |

## 6. 六类适用性与能力映射

| 非功能类别 | 是否适用 | 重点能力 | 当前结论 |
|---|---|---|---|
| 性能 | 适用，当前不量化 | C-MS-1~5；外围任务隔离 | 定义分阶段、分依赖、固定 workload / 环境的测量口径 |
| 可用性 | 强适用 | C-MS-2 / 4 / 5；全仓 truth 保留 | 依赖失效可解释、核心历史不丢、下游失败不回滚 |
| 安全 | 强适用 | C-MS-1~3；全仓边界 | 项目型 scope、body-free、required seam no-bypass |
| 审计 / 可追溯 | 强适用 | C-MS-1~5；全生命周期 | 来源、实例世代、结果层级和非伪造 readiness 可回链 |
| 幂等 / 一致性 | 强适用 | C-MS-1 / 3~5 | 重复 / 并发 / 迟到 / unknown 不分叉 truth |
| 可观测性 | 强适用 | C-MS-2 / 4 / 5；全仓异常 | 安全材料独立于 backend，失败和 handoff gap 分层可见 |

### 6.1 NFR 与功能 / 规则来源

| NFR 范围 | 能力范围 | 功能来源 | 规则来源 |
|---|---|---|---|
| NFR-MS-001~003 | C-MS-1~5 + 外围 | FR-MS-001~012 / E01~E04 | BR-MS-046 / 048 / 050；各功能的主链 / 外围关系 |
| NFR-MS-004~006 | C-MS-1~5 | FR-MS-001~012 | BR-MS-016 / 025 / 030 / 033~044 / 046 |
| NFR-MS-007~009 | C-MS-1~3 + 全仓 | FR-MS-001~007 / 012 | BR-MS-001~019 / 022 / 024 / 042 / 046~049 |
| NFR-MS-010~012 | C-MS-1~5 | FR-MS-001~012 | BR-MS-007 / 017 / 026 / 036 / 045 |
| NFR-MS-013~016 | C-MS-1 / 3~5；C-MS-2 readiness | FR-MS-001~012 | BR-MS-005 / 016 / 019~021 / 025 / 030 / 033~044 |
| NFR-MS-017~019 | C-MS-1~5 | FR-MS-001~012 | BR-MS-017 / 026 / 036 / 043 / 045 / 047 / 049 |
| NFR-MS-020 | 全局质量约束 | 全部核心 / 外围功能与 pending seam | BR-MS-046 / 048；Step 12 §9 |

## 7. 判断口径与未来量化门禁

### 7.1 当前可直接判断的硬门禁

| 门禁 | 当前判断 |
|---|---|
| owner / scope | 无外部 truth 反转；非项目或授权不可证时 fail closed |
| forbidden-body / secret | 本仓 truth、查询、事件与证据材料中不得出现，发现即不通过 |
| readiness | 必要前置共同成立；partial / pending / fake 不得计为真实 ready |
| single truth | 无第二活动注册、第二 host session、竞争当前宿主或历史抹写 |
| result layering | local / attempt / delivered / observed / accepted 和 cleanup 各层不可混写 |
| evidence honesty | planned / blocked / not_run 不得写成 pass、artifact、verdict 或 signoff |

### 7.2 未来量化的最小前置

量化目标只有在以下信息同时具备 authority 后才能进入正式基线：稳定 workload 与宿主规模、执行环境、能力阶段边界、外部依赖状态、成功 / 失败 / unknown 定义、是否包含资产拉取、采样与统计口径、证据 owner、变更规则。缺一时只能记录候选测量维度，不能倒填目标或验收结果。

| 可候选量化维度 | 当前状态 | 后续落点 |
|---|---|---|
| 意图受理、当前事实查询、注册 / 信号受理延迟 | candidate_without_authority | 05 测试方案建立 workload 后讨论 |
| 装配、启动、恢复、终止和清理的分阶段耗时 | candidate_without_authority | 03 / 04 定义边界后，05 建立测量方法 |
| 并发宿主、信号和对账 workload | candidate_without_authority | 04 配置设计与 05 测试方案闭口 |
| handoff attempt 到外部反馈的延迟 | blocked_by_route_contract | Bus / Observability route 和 receipt owner 闭口后讨论 |

## 8. Pending 对 NFR 的影响

| Pending | 受影响 NFR | 当前质量口径 |
|---|---|---|
| MSVC-UP-001 Runtime surface | 002 / 005 / 010 / 017~020 | 只能验收宿主侧分层与 fail-closed，不能声称 Runtime entry / recovery readiness |
| MSVC-UP-002 Member 详细合同 | 001 / 005 / 007 / 010 / 014 / 018 / 020 | 需求级 owner 可验收；字段、IPC、凭据与真实联调仍 blocked |
| MSVC-UP-003 Member Images handoff | 002 / 005 / 009 / 015 / 020 | 可验正式 pinned entry 方向与 no-bypass；真实正向装配 readiness 仍等待 exact contract 与集成证据闭口 |
| MSVC-UP-004 SandboxBinding / release | 002 / 005 / 009 / 011 / 015 / 018~020 | required binding fail-closed 可验；backend / caller / cleanup 正向证据 pending |
| MSVC-UP-005 policy 传递 owner | 无当前 NFR 正向路径 | 不新增可用性或性能承诺；owner 闭口且形成 FR 后重开 |
| MSVC-UP-006 launch credential owner | 005 / 007~010 / 020 | 可验不保存 / 不复用 / 不绕过；签发撤销和真实资格证据 pending |
| MSVC-UP-007 Core schema / event family | 001 / 010 / 017~020 | 能力语义可验；共享 schema、route 和 receipt readiness 不可声称 |
| MSVC-UP-008 SDK target / Server 自测试 | 020 | 只记录 compile 基线；准确 target 和真实测试证据后移 |

## 9. 旧指标与实现污染审计

| 历史内容 | 当前处理 | 原因 |
|---|---|---|
| StartMember P95 小于 5 秒（不含镜像拉取） | 不继承；只保留 NFR-MS-001 / 002 的阶段化候选维度 | 无 workload、环境、起止边界、结果语义或 release authority |
| 单实例并发管理容器数不少于 500、心跳处理 QPS 不少于 500 | 不继承；进入并发 workload 候选 | 无容量模型、信号合同、环境或测量证据 |
| Identity / method / backend / registry 99.9%，Bus 99.95% | 不进入本仓目标 | 外部 SLA 不归本仓定义，且 method-library 不应直接依赖 |
| 心跳 30 秒乘连续 3 次、identity 秒级最终一致 | 不继承 | 健康阈值和上游传播基线无当前 authority |
| forensic 保留 10 分钟 | 不继承 | 保留、删除与 evidence 正文 owner 未闭口，本仓禁止保存 forensic 正文 |
| retry、cache、outbox、backlog、fail-fast、动态阈值 | 全部后移或删除 | 属于架构、配置或实现方案，不能替代质量要求 |
| Runtime 从 checkpoint 恢复 | 从本仓 NFR 排除 | 宿主重启不等于 Runtime checkpoint 恢复成功 |
| 具体日志字段、指标名、仪表盘、数据库索引和加密产品 | 不进入本步 | 属于后续设计或外部 backend truth |

## 10. Step 14 承接与门禁

### 10.1 验收承接要求

| NFR 范围 | Step 14 最小承接 |
|---|---|
| NFR-MS-001~003 | 性能 / workload 验收：无正式数字时验证测量边界完整且不伪造达标 |
| NFR-MS-004~006 | 依赖失效、中断、unknown 与历史保留场景验收 |
| NFR-MS-007~009 | scope、forbidden-body、required seam no-bypass 一票否决 |
| NFR-MS-010~012 | 全生命周期关联与历史连续性验收 |
| NFR-MS-013~016 | duplicate、concurrent、late、out-of-order、unknown 一致性验收 |
| NFR-MS-017~019 | 安全材料、失败分层和 handoff gap 可判断验收 |
| NFR-MS-020 | 非伪造 evidence / readiness 一票否决 |

### 10.2 回填草稿

> 校准来源：
> - `design-calibration/00_req_step_13_non_functional_requirements.md`

正式装配时采用 §5 的三列 NFR 表和 §6 六类适用性摘要，保留 §7 的“当前无正式数值目标”量化门禁及影响正向验收的 pending。过程计划、历史指标清单和后续设计提示留在校准材料。

### 10.3 门禁自检

- [x] 六类 NFR 全部完成适用性判断，20 项要求均有判断口径
- [x] NFR 均回指能力节点或全局质量目标，并有功能 / 规则来源
- [x] 性能要求区分本地与外部等待，未继承任何无来源数字或 SLA
- [x] 安全、追溯、一致性、可观测性和 evidence honesty 可由 Step 14 承接
- [x] pending / fake / planned 均未升格为真实 readiness 或证据
- [x] 无监控平台配置、日志字段、重试算法、缓存参数、数据库优化、加密实现或详细测试方案

结论：`gate_status = pass`，`current_state = stop_review`。用户已授权完成整份 00，下一动作是先更新 flow / ledger，再读取 Step 14 SOP、书写规范 4.14 和本 Step 结论。
