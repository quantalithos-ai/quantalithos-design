# 01 架构 Step 14：风险与待确认事项

> 对应正式章节：`01-架构设计.md` §15 风险与待确认事项  
> 当前模式：`full-restart + single-agent-serial`  
> 本步状态：`completed / stop_review`  
> 正式 `01` 写入：`false_until_step_16`

## 1. Step 状态与 Step 内计划

前序 Step 13 已通过门禁。本步只把前文已经识别且影响架构主线的风险，与尚未形成定论的待确认事项分成两张表；不新增需求、不给出最终解决方案、不把普通 TODO 或未来愿望写成风险。

| 计划项 | 状态 | 产物 / 门禁 |
|---|---|---|
| 读取 Step 1~13、正式 `00` §15、架构 SOP Step 14 与书写规范 §4.15 | done | §2 |
| 汇总已识别风险并标明影响范围、处理口径、阻塞性 | done | §6.1 |
| 汇总待确认事项并标明缺失确认、挂起口径 | done | §6.2 |
| 诊断历史污染、上游状态差异和需求/架构层次混写 | done | §4 |
| 区分可接受 pending、精确设计 blocker 与结构性 blocker | done | §5、§6.3 |
| 完成风险/待确认逐项停审和跨前文覆盖审计 | done | §6.4~§6.5 |
| 完成复杂度、回填草稿、自检与三层门禁 | done | §7~§10 |

风险表示“已经识别出会影响主线判断、但尚未关闭的问题”；待确认事项表示“尚未形成确定结论、仍缺外部确认或前置判断的问题”。两者均保持当前保守口径，不在本步预支解决方案。

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| `01_arch_step_01_requirement_baseline.md` | 承接架构基线中的 `RISK-CON-*`、`CON-Q-*` 和后续章节回指。 |
| `01_arch_step_02_goals_constraints.md` | 判断风险是否打穿不可变边界、当前阶段取舍和非目标。 |
| `01_arch_step_05_bounded_context_subdomains.md` | 用九个架构单元定位风险影响范围，不把 owner 页面当本仓上下文。 |
| `01_arch_step_07_dependency_direction.md` | 判断直接穿透、反向依赖、私有 bus 和合同接缝风险。 |
| `01_arch_step_08_data_ownership_consistency.md` | 判断 safe-field、snapshot/ref、forbidden-body、unknown 和跨域一致性风险。 |
| `01_arch_step_09_interactions_communication.md` | 判断同步/提示/owner 延后、回查、重放和诊断风险。 |
| `01_arch_step_10_technology_choices.md` | 承接技术机制代价、合同门控、最小化和配置 pending。 |
| `01_arch_step_11_alternatives_tradeoffs.md` | 承接主线取舍、渐进激活、显式查询基线和局部降级。 |
| `01_arch_step_12_cross_cutting.md` | 承接横切项的诊断、性能、配置、兼容和 a11y pending。 |
| `01_arch_step_13_evolution_roadmap.md` | 承接阶段触发条件和不可接受债务。 |
| `00-需求文档.md` §15 | 唯一需求层风险与待确认来源；不改变其状态或编号。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 14 | 要求风险/待确认分表、具体影响和当前口径。 |
| `standards/document/架构设计书写规范.md` §4.15 | 规定风险表、待确认表、阻塞性和禁止假挂起。 |
| 历史正式文档与 README | 仅记录污染回流风险，不作为已知事实或解决依据。 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 当前还有哪些尚未关闭的架构风险？ | 风险集中在 owner exact surface、scope/visibility、safe-field 与多轴状态、unknown reconciliation、跨 owner 状态解释、专项 owner 接缝、客户端状态生命周期、SDK 提示、诊断 envelope、量化 authority、相邻产品边界、历史污染回流和撤销传播。它们已明确会限制主线的正向深度或精确设计。 |
| 这些风险会影响哪层架构结构？ | 合同风险影响正式接缝、数据影子、交互和 C5 正向面；scope/visibility 影响安全上下文；safe-field 影响数据最小化；reconciliation 影响结果与恢复；时效/覆盖影响跨 owner 组合；量化、诊断和兼容影响横切与后续实现。 |
| 当前还有哪些待确认事项？ | `CON-Q-034~047` 的 exact surface、scope、visibility/reason、safe-field、reconciliation、Workspace、Method、Capability、Observability、Archive/Sandbox、状态生命周期、性能、a11y/诊断和其他 L5/L6 链接均继续待确认。 |
| 哪些待确认项会影响前文结论是否成立？ | 若 scope/visibility 无法提供安全语境，受保护路径只能 fail-closed；若 owner-safe 或正式结果合同缺失，对应区域只能 read-only/blocked/unknown；这些限制不会推翻 Console 的客户端边界，但阻塞相关正向能力。 |
| 哪些风险当前可接受，哪些会阻塞后续推进？ | 需求级行为闭合不被 pending 阻塞；外围提示、未停审链接和数值 authority 可带约束推进。精确 owner surface、scope/visibility、safe-field、reconciliation、诊断 envelope、性能/兼容 authority 会阻塞对应精确架构、接口、概要/详细和测试设计。 |
| 为什么不在本步给出最终方案？ | 风险表要说明当前如何约束，待确认表要说明缺什么确认和如何挂起；最终方案需在正式 owner 合同、后续文档或授权的实施设计中产生，不能用 Step 14 填空。 |

## 4. 当前材料与旧文档问题诊断

| 材料 | 问题 | 本步处置 |
|---|---|---|
| 旧 `00/01/02/03/05/06` | 固定数字、SLA、Provider Contract、技术框架和绿色状态被写成确定事实。 | 记录为历史污染回流风险；不作为 owner authority 或已关闭风险的解决依据。 |
| 上游正式文档 / 台账 | 设计停审、实现完成、activation 与可消费合同状态可能不同。 | 只承接已停审边界；未闭口项保持 owner 局部 pending/blocked/read-only。 |
| C5 多 owner 主题 | freshness、coverage、visibility 和结果语义可能不兼容。 | 作为已知跨域状态解释风险，采用分 owner、来源回链和局部降级。 |
| 客户端状态候选 | 草稿、缓存、布局和请求反馈可能被误当业务 truth。 | 作为状态生命周期风险，当前只承认交互 truth，不承认外部对象或授权 truth。 |
| 事件/诊断候选 | 内部总线直连或原始载荷诊断会形成投影/证据旁路。 | 作为依赖和数据最小化风险，当前只允许 SDK 正式提示和安全裁剪诊断。 |
| 未停审 L5/L6 | deep-link、诊断和引用责任可能漂移。 | 作为待确认的外围协作项，不写入本仓主链。 |

## 5. 风险与待确认边界判定

| 判断对象 | 归类 | 判定理由 |
|---|---|---|
| 已知 exact surface 尚未闭口且会阻塞 C3~C5 正向设计 | 风险 | 影响已明确，当前可以用能力级边界和 blocked/read-only 约束其影响。 |
| scope/visibility 的最终 owner、层级或 reason 尚未形成定论 | 待确认事项 | 缺少外部确认，不能把可能的错配直接宣称为已发生风险；先以引用/fail-closed 挂起。 |
| unknown 没有正式 reconciliation 时重复副作用的可能 | 风险 | 风险机制已明确，当前可直接禁止自动重放并保持 unknown。 |
| `L1-workspace` 是否提供某种 safe read/export | 待确认事项 | 仍缺正式消费范围和合同，不能先假设该能力存在或缺失。 |
| 旧 Provider Contract 可能在后续回流 | 风险 | 污染来源与后果已知，可通过持续历史审计约束。 |
| 未来是否需要更强预取、提示或组合 | 待确认事项 / 触发依赖 | 只有测量或正式合同能决定，不把愿望写成风险或路线。 |

## 6. 结构化中间产物

### 6.1 风险表

| 风险项 | 影响范围 | 当前处理口径 | 是否阻塞 | 说明 |
|---|---|---|---|---|
| `RISK-CON-001` owner 面向 Console 的 exact query/command/result/ref 未全部闭口。 | 正式接缝、C3~C5 正向读取/受控入口、Step 6/9/11/12/15 精确设计。 | 只保留能力级消费边界；主题按 owner 独立 `pending/blocked/read-only`，不使用旧协议或 mock 补齐。 | 有条件阻塞 | 影响对象和当前约束已明确，但不阻塞行为级架构骨架。 |
| `RISK-CON-002` tenant/organization/project scope 的 owner、层级和切换语义未确认。 | C1/C2 语境、导航、路由、查询与提交前重验。 | scope 仅作为外部正式语境引用；无法验证时 fail-closed，不在 Console 建模或推导层级。 | 阻塞精确安全设计 | 若无正式语境，受保护正向路径不能安全开放；当前仍可保留客户端壳和退出/重选。 |
| `RISK-CON-003` visibility、动作资格和受限 reason 的披露粒度未闭口。 | C2/C4/C5 可见性、动作姿态、最小披露和对象存在性。 | 使用最小披露、unknown 和客户端只能收紧的上限；不展示未获允许的原因或正文。 | 阻塞正向披露/提交设计 | 风险已知且可用保守姿态约束，不应由 UI 自行猜测原因。 |
| `RISK-CON-004` safe-field、redaction、freshness、coverage、availability、consistency 合同不一致。 | C3/C5/C6 view、快照、错误、诊断、导出和 forbidden-body 一票否决。 | 只允许最小安全摘要/ref；raw/hidden body 禁入所有 Console 生命周期；exact safe-field 保持 pending。 | 有条件阻塞 | 只读边界可成立，但精确 view model、缓存失效和诊断不能闭口。 |
| `RISK-CON-005` unknown 命令结果缺少正式 reconciliation，存在重复提交或误报完成风险。 | C4/C6 结果状态、恢复、幂等和副作用交互。 | unknown 不自动重放、不宣称成功；无正式回查能力时保持 unknown/blocked。 | 阻塞自动恢复设计 | 风险可由保守挂起控制，但不能提前设计自动补偿。 |
| `RISK-CON-006` C5 owner 的时效、覆盖和一致性不同，联合页面可能被误读为统一当前或强一致。 | C3/C5/C6 组合视图、筛选、比较、健康/合规/readiness 解释。 | 按 owner 保留 source/freshness/coverage/availability/consistency，局部独立降级，不合成单一结论。 | 不阻塞架构骨架 | 当前分域主线足以成立；比较和联合摘要需继续受状态轴约束。 |
| `RISK-CON-007` Workspace、Method、Capability、Observability、Archive、Sandbox 接缝成熟度不同。 | C5 专项主题、外围入口、阶段 B 激活与 Step 15 追溯。 | 条件化消费；未闭口时只读、partial 或 blocked，不影响壳和横向闭环。 | 有条件阻塞 | 影响各专项正向 surface，不改变 Console 不拥有 owner truth 的结论。 |
| `RISK-CON-008` 草稿、布局偏好、筛选和请求呈现的生命周期/跨设备范围未定。 | 客户端状态承载、C3/C4/C6 连续性、清理和失效。 | 只确认其为 Console 交互 truth；生命周期细节挂起，提交前后和退出姿态显式。 | 不阻塞架构骨架 | 不同生命周期会改变体验承载，但不能改变 owner truth 或安全上限。 |
| `RISK-CON-009` SDK 状态/失效通知未定。 | owner-safe 影子失效、C3/C6 新鲜度和通信承接。 | 事件不是核心前置；无正式封装时显式 query/revalidation/reconciliation，禁止内部 bus/projection。 | 不阻塞架构骨架 | 缺通知只降低即时新鲜感，不影响安全主链成立。 |
| `RISK-CON-010` 客户端诊断与 Observability 的安全 envelope、关联粒度和保留边界未定。 | 诊断旁路、C5/C6 可定位性、forbidden-body 和审计语义。 | 仅允许最小、无 forbidden body 的交互诊断；sink 失败不改业务结果，正式 audit/evidence 归 owner。 | 阻塞精确诊断设计 | 核心交互可在诊断缺失时运行，但诊断合同不能假设。 |
| `RISK-CON-011` 性能、可用率、负载和兼容矩阵无正式 authority。 | 全仓 NFR、查询/回查有界性、区域故障、a11y 支持和后续验收。 | 使用有界、可归因、局部隔离和等价可访问行为口径；不继承旧 P95/首屏/SLA/百分比。 | 阻塞量化设计 | 行为级架构可继续，但任何数字承诺和测试预算不能闭口。 |
| `RISK-CON-012` 未停审 L5/L6 可能改变导航、deep-link 或交互边界。 | 外围链接、主题组织、Step 15 追溯和未来跨产品协作。 | 只记录 pending 协作候选，不写入 Console truth 或主链；以本仓已停审边界为准。 | 不阻塞架构骨架 | 影响外围联动，不改变当前独立客户端主线。 |
| `RISK-CON-013` 旧 Provider Contract、固定控制项/指标和绿色语义可能回流。 | 全部正式章节、历史审计、truth/readiness 和一票否决。 | 持续标记 historical material；任何重新写成 ready/结论的内容按越界风险处理。 | 不阻塞当前架构，阻塞污染性回填 | 风险来自文档治理，必须在正式装配和后续审计持续检查。 |
| `RISK-CON-014` owner 资格、状态或引用撤销传播不及时，旧快照可能继续可见或可操作。 | C1~C4/C6 语境、披露、提交、影子失效和直接入口。 | 撤销/过期/冲突统一触发保守收紧；未经重新验证的旧快照不得放宽敏感内容或动作。 | 阻塞敏感路径放行 | 这是安全边界风险，不能用状态提示或缓存便利性抵消。 |

### 6.2 待确认事项表

| 待确认事项 | 影响范围 | 缺失确认 | 当前挂起口径 | 说明 |
|---|---|---|---|---|
| `CON-Q-034` 各 owner 面向 Console 的 exact query/command/result/ref 与 activation 清单。 | C3~C5 正向入口、接缝、概要/详细接口和追溯。 | 缺各 owner 的正式 surface、safe-field、开放条件和结果/ref 语义。 | 不回填具体协议；主题保持 `pending/blocked/read-only`，只保留能力级边界。 | 尚未形成统一定论，不能把历史接口或草案当正式合同。 |
| `CON-Q-035` tenant/organization/project scope 的正式 owner、层级、切换与跨页绑定语义。 | C1/C2 语境、导航、查询和提交前约束。 | 缺 scope 真相 owner、层级关系、切换规则和撤销传播确认。 | 只承接外部 actor/scope 引用；无法验证即 fail-closed，不建本地 scope 模型。 | 当前只能挂起，不能把角色或 URL 形状写成 scope 定论。 |
| `CON-Q-036` visibility、动作资格、受限 reason 披露及撤销传播。 | C2/C4/C5 最小披露、动作姿态和安全解释。 | 缺正式决定的字段/粒度、对象存在性保护和失效时间语义。 | 采用最小披露、unknown、客户端只可收紧；不显示未获准原因或正文。 | 这是待确认而非已知事实，当前保守姿态不能替代最终 owner 合同。 |
| `CON-Q-037` owner safe-field、redaction 及 freshness/coverage/availability/consistency 合同。 | C3/C5/C6 视图、影子、错误、诊断、导出和状态解释。 | 缺各 owner 的安全字段边界、裁剪语义、时效/覆盖/可用/一致性声明。 | 只允许最小安全摘要/ref；raw/hidden body 和不可证明字段不进入 Console。 | 不同 owner 可能分域闭口，当前不能假设共同字段模型。 |
| `CON-Q-038` unknown 命令结果的 reconciliation、幂等和重复风险语义。 | C4/C6 结果、回查、恢复、重放和测试切口。 | 缺 owner 对受理后中断的正式查询、幂等依据、重复副作用和终态定义。 | unknown 挂起/blocked；只有正式 reconciliation 才能提升恢复能力。 | 当前没有足够依据把任何刷新或本地 key 当幂等。 |
| `CON-Q-039` `L1-workspace` safe read/export 是否成为项目/Workspace 主题的可选来源及范围。 | C5 项目/Workspace 监控、导出、来源和局部降级。 | 缺 Workspace 正式消费合同、safe-field、export 边界和来源优先级。 | 只作为条件化、非唯一来源候选；合同未闭口不启用正向面。 | 不能从 draft 或相邻项目页面推导 Workspace truth。 |
| `CON-Q-040` Method Library 的方法资产消费与提交/发布请求合同。 | C5 方法主题、草稿、版本、受控动作和回链。 | 缺方法目录/版本安全字段、编辑/发布 surface、资格和正式结果。 | 浏览 + 本地草稿 + 条件化入口；未闭口时不声称可提交或 ready。 | 当前仅有能力级边界，不能补造方法对象模型。 |
| `CON-Q-041` Capability Hub access-review/暴露状态的可见语义和管理入口。 | C5 Capability 主题、状态引用、受控操作与 readiness 禁止。 | 缺 access-review/暴露状态 safe-field、动作资格和结果/ref 合同。 | 只消费 owner 状态/ref；不创建注册、不做适配、不推导 capability readiness。 | 正向入口的缺失不改变 Console 只读裁剪。 |
| `CON-Q-042` Observability audit/metric/validation/report 与客户端诊断接缝。 | C5 审计/指标主题、C6 诊断、追溯、报告/证据语义。 | 缺正式 query/result/ref、验证/报告责任、诊断接收和保留边界。 | 只读 owner 结果 + 最小客户端诊断；无正式 contract 不生成 audit/evidence/report。 | 不能把客户端日志或页面回放称为 Observability truth。 |
| `CON-Q-043` Archive/Sandbox activation、正向命令及多轴状态范围。 | C5 Archive/Sandbox 入口、长时工作、恢复和 readiness 边界。 | 缺 activation、命令受理/结果、状态轴、引用和执行责任确认。 | 分 owner `read-only/blocked/partial`；Console 不执行归档/恢复/隔离。 | 这是专项合同待确认，不是 Console 未来必做的执行任务。 |
| `CON-Q-044` 草稿、布局偏好、筛选和请求呈现的保留、清理、跨设备/跨会话范围。 | 客户端状态承载、C3/C4/C6 连续性、隐私和失效。 | 缺生命周期、介质、跨会话范围、清理触发和恢复冲突语义。 | 只保留交互 truth 上限；不承诺跨设备/离线连续性，不影响 owner truth。 | 不能用历史缓存假设替代正式生命周期决定。 |
| `CON-Q-045` 本地交互、owner 请求、回查和故障隔离的性能/可用率/负载 authority。 | NFR、查询 fan-out、回查、局部降级、验收和演进触发。 | 缺场景、测量边界、环境、窗口、owner 责任和证据来源。 | 不写数字；采用有界、可归因、局部隔离和禁止无界放大口径。 | 只有 authority 完整后才可形成量化预算和测试证据。 |
| `CON-Q-046` 受支持浏览器、辅助技术组合、适用核心路径和诊断 envelope。 | C6 等价交互、兼容验收、诊断最小化和支持范围。 | 缺支持矩阵、核心路径集合、状态/播报要求和安全诊断 envelope。 | 先要求适用核心目标等价完成；具体矩阵与 envelope 继续 pending。 | 不能把“常见浏览器可用”写成已验证事实。 |
| `CON-Q-047` 未停审 L5/L6 的正式导航、deep-link、诊断或引用合同。 | 外围导航、跨产品回链、协作边界和 Step 15 追溯。 | 缺相邻项目正式停审结论、责任 owner、字段和失效语义。 | 不进入本仓主链，仅保留未来正式合同候选；不得复制私有状态。 | pending 项不能成为本仓真相，也不能反向限制已停审主线。 |

### 6.3 当前处理口径与推进边界

已知风险的当前处理重点是限制影响，不是宣称关闭：用 fail-closed、最小披露、owner 分区、多轴状态、unknown 挂起、合同门控和历史污染审计维持主线。待确认事项则保留缺失确认和挂起口径，只有正式 owner authority、可审计测量或用户后续授权才能改变其状态。需求级架构骨架可以继续追溯和装配，但精确接口、概要/详细实现、量化测试和正向 activation 仍受相应风险/待确认项约束。

### 6.4 风险逐项停审

| 风险组 | 对象明确 | 影响范围具体 | 当前口径是约束而非方案 | 阻塞性明确 | 未新增结论 | 结论 |
|---|---|---|---|---|---|---|
| owner surface / activation | yes | yes | yes | yes | yes | `pass_with_contract_pending` |
| scope / visibility / qualification | yes | yes | yes | yes | yes | `pass_with_security_pending` |
| safe-field / freshness / coverage | yes | yes | yes | yes | yes | `pass_with_data_pending` |
| unknown / reconciliation | yes | yes | yes | yes | yes | `pass_with_recovery_pending` |
| 多 owner 状态与专项接缝 | yes | yes | yes | yes | yes | `pass_with_owner_pending` |
| 客户端状态生命周期 | yes | yes | yes | yes | yes | `pass_non_blocking_architecture` |
| SDK 提示与诊断 | yes | yes | yes | yes | yes | `pass_with_envelope_pending` |
| 性能 / 可用 / 兼容 authority | yes | yes | yes | yes | yes | `pass_with_measurement_pending` |
| 历史污染与跨项目边界 | yes | yes | yes | yes | yes | `pass_with_audit_required` |

### 6.5 跨前文风险审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 风险和待确认事项是否严格分表 | pass | §6.1 是已知影响与处理口径，§6.2 是缺失确认与挂起口径。 |
| 每项风险是否有具体对象、影响范围、当前口径和阻塞性 | pass | 无“复杂度高”“未来可能变化”等空泛风险。 |
| 每项待确认是否写明缺失确认和当前挂起方式 | pass | 无“后续再看”“继续讨论”等假挂起。 |
| 是否覆盖 `RISK-CON-001~014` | pass | 14 条需求层风险均进入风险表，未新增编号。 |
| 是否覆盖 `CON-Q-034~047` | pass | 14 条需求层待确认均进入待确认表，未改写状态。 |
| 是否把可接受 pending 错判为主线 blocker | pass | 需求/架构骨架可继续；只有相关精确设计和正向激活被阻塞。 |
| 是否把未知事项冒充已知风险 | pass | scope、Workspace、Method、Capability 等保持待确认，不强行定性。 |
| 是否把风险表写成最终方案或任务 | pass | 当前口径只限制边界，不给实施动作、负责人或日期。 |
| 是否覆盖历史污染、相邻产品、a11y、量化和诊断 | pass | 均有风险或待确认落点。 |
| 是否与 Step 10~13 冲突 | pass | 风险状态只约束激活和精确深度，不撤销已收稳的架构主线。 |
| 是否伪造 ready / implementation / evidence | pass | 未写 baseline、run_id、测试结果、artifact、report、evidence、verdict、signoff 或 readiness。 |
| 对 Step 15 的输入是否清晰 | pass | ADR 与追溯可引用已收稳结论、风险和 pending，不新增未确认架构判断。 |

## 7. 复杂度判断

14 条风险和 14 条待确认事项完全来自需求基线及 Step 2~13 的显式 pending。复杂度不在数量，而在于避免把“已知风险”“缺失确认”“可接受债务”和“未来触发条件”混写；两张固定结构表、逐组停审和跨前文审计已经足以保持层次，不需要拆分附录。

## 8. 正式 §15 回填草稿（Step 16 才写入）

> 校准来源：
> - `design-calibration/01_arch_step_01_requirement_baseline.md`
> - `design-calibration/01_arch_step_08_data_ownership_consistency.md`
> - `design-calibration/01_arch_step_09_interactions_communication.md`
> - `design-calibration/01_arch_step_10_technology_choices.md`
> - `design-calibration/01_arch_step_11_alternatives_tradeoffs.md`
> - `design-calibration/01_arch_step_12_cross_cutting.md`
> - `design-calibration/01_arch_step_13_evolution_roadmap.md`
> - `design-calibration/01_arch_step_14_risks_open_questions.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“风险表”“待确认事项表”“当前处理口径与推进边界”和“跨前文风险审计”，了解哪些结论已知但未关闭、哪些仍缺外部确认。

正式 §15 应将 §6.1 与 §6.2 两张表压缩回填，保留风险的影响范围、当前约束和阻塞性，以及待确认事项的缺失确认和挂起口径。风险与待确认不得合并成一张“问题清单”；不得把 `pending` 润色成 integrated/ready，也不得为填补叙事新增架构、owner、协议或实现结论。

## 9. 待确认事项（本 Step 自身）

| 待确认项 | 当前处理口径 | 当前状态 |
|---|---|---|
| 风险表在正式 §15 中是否保留全部 14 条，还是按影响组压缩 | calibration 保留逐条审计；正式正文可压缩但不得丢失影响和阻塞性。 | `open / non_blocking_for_architecture` |
| 风险编号是否与未来项目风险系统共享 | 当前继续使用本仓 `RISK-CON-*` / `CON-Q-*`，不推导外部编号。 | `open / non_blocking` |

本 Step 自身不新增主线风险；上述两项只影响正式文字装配粒度，不影响 Step 15 的 ADR/追溯判断。

## 10. 自检、三层门禁与进入 Step 15 条件

### 10.1 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否严格区分风险与待确认事项 | pass | 两张固定结构表分别承载已知影响和缺失确认。 |
| 每条风险是否有影响范围、当前口径和阻塞性 | pass | §6.1 完整覆盖。 |
| 每条待确认是否有缺失确认和挂起口径 | pass | §6.2 完整覆盖。 |
| 是否覆盖前文全部主要 pending | pass | exact surface、scope、visibility、safe-field、reconciliation、专项 owner、状态、量化、a11y、诊断和 L5/L6 均在表中。 |
| 是否把普通 TODO、实现动作或愿望写入 | pass | none。 |
| 是否把待确认事项提前升级为风险 | pass | scope、Workspace 等仍保留 open confirmation。 |
| 是否把风险写成最终方案 | pass | 当前处理口径只做保守约束。 |
| 是否标明需求级推进与精确设计阻塞边界 | pass | §6.3 明确。 |
| 是否伪造 ready 或执行证据 | pass | none。 |
| 正式 `01` 是否被提前写入 | pass | 仅创建 Step 14 calibration。 |

### 10.2 三层门禁

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step / 模块级 | `pass` | 风险与待确认已分表、具体化、完整覆盖并完成跨前文审计，没有脑补新结论。 | 更新 flow 与项目台账，激活 Step 15。 |
| 文档级 | `pass_to_step_15` | 正式 §15 回填基础已形成，未关闭项仍显式挂起；正式 `01` 继续等待 Step 16。 | 读取 Step 15 SOP / 书写规范并创建 `01_arch_step_15_adr_traceability.md`。 |
| 项目级 | `pass_with_open_contracts` | 精确 owner contract、scope、safe-field、reconciliation、量化、诊断和兼容仍 pending，但不阻塞 ADR/追溯闭环。 | 进入 Step 15；不修改正式 `01`，不进入 `02`。 |

本步 `pass` 只表示设计静态校准通过，不表示实现、测试、集成、用户 signoff 或 readiness 已发生。
