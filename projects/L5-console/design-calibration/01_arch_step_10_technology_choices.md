# 01 架构 Step 10：关键技术选型

> 对应正式章节：`01-架构设计.md` §11 关键技术选型  
> 当前模式：`full-restart + single-agent-serial`  
> 本步状态：`completed / stop_review`  
> 正式 `01` 写入：`false_until_step_16`

## 1. Step 状态与 Step 内计划

前序 Step 9 已通过门禁。本步只收敛已经影响系统结构、边界保护、一致性或关键交互主链的架构机制，并说明其解决的问题、采用理由和代价；不选择框架、库、协议产品、缓存产品、部署参数、源码目录、组件或 adapter 实现。

| 计划项 | 状态 | 产物 / 门禁 |
|---|---|---|
| 读取 Step 2、7、8、9、架构 SOP Step 10 与书写规范 §4.11 | done | §2 |
| 回答机制、问题、理由、代价和当前阶段必要性问题 | done | §3 |
| 诊断旧技术栈、Provider Contract、固定数量和聚合机制污染 | done | §4 |
| 区分架构机制、相邻替代思路和后续实现选择 | done | §5 |
| 输出关键技术机制固定结构表 | done | §6.1 |
| 输出技术边界说明与轻量采用 / 不采用表 | done | §6.2~§6.3 |
| 完成机制逐项停审与跨机制审计 | done | §6.4~§6.5 |
| 完成复杂度判断、回填草稿、pending、自检和三层门禁 | done | §7~§10 |

本步所称“技术机制”是必须跨页面、跨 owner 或跨交互阶段保持一致的结构性手段。技术产品和局部实现只有在后续设计获得正式合同、运行约束与验证 authority 后才能决定，不能反向定义本步架构。

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| `01_arch_step_02_goals_constraints.md` | 提供 SDK-only、客户端只收紧、多轴状态、结果分层、forbidden-body 和合同诚实等不可变约束。 |
| `01_arch_step_07_dependency_direction.md` | 提供核心语义隔离、正式接缝、客户端状态承载和外围输出接缝的允许依赖方向。 |
| `01_arch_step_08_data_ownership_consistency.md` | 提供 Console 交互真相、owner-safe 影子、正式引用、禁止正文，以及安全即时约束 / 只读最终收敛 / owner-confirmed 结果三类一致性。 |
| `01_arch_step_09_interactions_communication.md` | 提供同步 query/资格/受理、可选 SDK 失效提示、owner 延后工作和无 Console worker/consumer 的通信主链。 |
| `00-需求文档.md` §10~§15 | 提供业务规则、数据归属、接口依赖、NFR、验收与风险的需求约束。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 10 | 规定每项选型必须回答机制、问题、理由、代价和不采用口径。 |
| `standards/document/架构设计书写规范.md` §4.11 | 规定固定五列表、判定规则、边界短文和禁止技术栈 / 实现清单。 |
| 旧 `01-架构设计.md`、README、draft | 只审计前端框架、widget registry、Provider Contract、统一治理 core、固定指标等历史假设，不作为当前选型 authority。 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 当前采用哪些关键架构机制？ | 采用正式接缝隔离与依赖倒置、按 owner 分区的来源保真组合、Console 交互真相与可失效影子分离、安全边界即时重验与 fail-closed、请求经历 / 受理 / 正式结果分层、同步主链与可选提示及 owner 延后工作的分离、按 owner 局部故障隔离、forbidden-body 最小化与诊断旁路隔离、可访问等价交互、合同门控的保守激活。 |
| 每个机制解决什么问题？ | 分别解决外部语义反向侵入、跨域第二真相、客户端状态越权、安全旧态放行、受理冒充完成、客户端承担异步业务、单点故障扩散、敏感正文旁路泄漏、辅助技术路径语义漂移和 pending 被伪装为 ready。 |
| 为什么不用其他方案？ | 因为直接 owner/数据库接入、统一业务投影、本地 RBAC、乐观完成、Console worker/BFF、全局可用性压平、宽载荷诊断、仅视觉交互和历史合同默认启用都会打穿已停审的 truth、依赖或结果边界；完整路径比较留到 Step 11。 |
| 每个选型带来什么代价或风险？ | 主要代价是正式接缝增多、页面需携带来源与多轴状态、状态机更显式、部分失败更可见、需要重验/回查、正向能力按合同逐面开放、可访问语义必须从结构设计开始共用，且不能靠统一聚合隐藏 owner 差异。 |
| 哪些选型当前阶段必要？ | 十项机制均是当前主线成立的结构前提。具体框架、协议产品、缓存介质、刷新/重试参数、目录和组件都不是当前架构必要选型；exact contract 未闭口的能力仍可通过保守门控保持未激活。 |
| 为什么这些不是局部实现细节？ | 它们分别约束所有页面如何进入 owner 边界、哪些数据可进入客户端、何时可以披露或提交、怎样判定完成、故障如何隔离，以及未闭口能力是否能出现；改变任一项都会改变系统边界或关键交互主链。 |

## 4. 当前材料与旧文档问题诊断

| 历史材料 | 问题 | 本步处置 |
|---|---|---|
| React / Svelte、ECharts / D3 等候选 | 产品或库名没有解释架构问题，也缺少当前运行和团队 authority。 | 不进入架构选型；后移到后续技术设计并受正式约束。 |
| `domain-oriented feature slices`、widget registry、query adapter、shared core | 把源码组织或局部扩展手段写成架构事实，并可能制造统一治理/权限核心。 | 只保留 owner 分区、正式接缝和核心交互语义隔离这些结构性机制。 |
| Provider Contract、固定 38 个控制项、8 个指标 | 未经当前 owner 合同核验，却反向限定页面、模型和验收。 | 视为历史污染；能力和数量由正式 owner 结果决定，未闭口即 pending。 |
| 页面 guard、前端角色和缓存授权 | 把客户端状态当资格 truth，无法承接撤销、过期或冲突。 | 采用边界即时重验与 fail-closed；本地状态只能进一步收紧。 |
| optimistic update、toast 或 transport success | 把交互反馈升级为 owner 正式结果，存在重复副作用风险。 | 采用请求经历 / 受理 / owner 结果分层和 reconciliation 门控。 |
| 统一跨域聚合、整体健康或 readiness | 压平 owner/source/freshness/coverage/availability/consistency，形成第二真相。 | 采用按 owner 分区组合、局部降级和来源保真。 |
| Console BFF、worker、bus consumer、投影重放 | 新增无 authority 的服务端真相、任务和事件责任。 | 不引入；同步主链、可选 SDK 提示和 owner 延后工作保持分离。 |
| 宽载荷日志、前端导出或验证 helper | forbidden body 可能通过错误、诊断、导出进入 Console 生命周期。 | 采用数据最小化与外围诊断隔离；正式报告/证据/验证仍由 owner 提供。 |

## 5. 改动前后对比与设计取舍

### 5.1 改动前后对比

| 维度 | 历史口径 | 本步口径 | 变化理由 |
|---|---|---|---|
| 选型单位 | 框架、图库、registry、adapter | 影响边界、一致性和交互主链的架构机制 | 技术产品不能替代架构判断。 |
| 多域组织 | 统一治理 core / 聚合面 | owner 分区、来源保真、局部组合 | Console 不拥有跨域 truth。 |
| 权限与资格 | 客户端 guard / RBAC 缓存 | 正式决定即时重验，客户端 fail-closed | 防止旧 UI 状态授权。 |
| 结果处理 | transport / optimistic 即完成 | 请求经历、受理和 owner 正式结果分层 | 防止虚假完成和重复副作用。 |
| 异步 | Console consumer / polling / worker | SDK 可选提示 + 正式回查 + owner 延后工作 | 不引入事件投影或后台职责。 |
| 故障 | 全局 loading / error / green | owner 分区、多轴状态和局部降级 | 单一故障不应被放大或掩盖。 |
| 合同成熟度 | 旧协议或 mock 先启用 | 正式合同门控，未闭口即 read-only/blocked/partial | 保护事实诚实和后续可替换性。 |

### 5.2 本步取舍边界

本步只解释“当前哪些机制值得成为架构主线”，不做完整方案路径比较。每项机制的相邻替代思路仅用于证明边界，不比较产品、框架或协议；主线与路径级备选的完整得失将在 Step 11 统一审查。

## 6. 结构化中间产物

### 6.1 关键技术机制表

| 技术机制 | 解决的问题 | 采用理由 | 代价 / 约束 | 说明 |
|---|---|---|---|---|
| 通过正式接缝和依赖倒置隔离外部 owner 与核心交互语义 | 防止具体 owner、协议、浏览器介质或诊断 sink 反向定义 Console 核心，并阻止数据库、repository、私有 bus 穿透。 | Console 面向多个成熟度不同的 owner，只有让正式 `L0-sdk` / 服务边界在承接侧进入，核心才能稳定表达“可信管理交互”而不复制领域规则。 | 增加边界映射、失败语义保真和合同适配成本；任何正向能力都受正式 surface 与 activation 约束。 | 该机制决定所有外部能力如何进入核心边界，改变依赖方向，不能由单页自行选择。 |
| 采用按 owner 分区的来源保真组合 | 防止多域结果被聚合为无来源的整体健康、合规、审计或 readiness，并避免一个 owner 的成功掩盖另一 owner 的缺失。 | 各 owner 独立拥有 truth、版本和可用性；按来源保留 freshness、coverage、availability、consistency 才能让联合管理入口不产生第二真相。 | 页面和用户必须面对非原子、不同步和局部缺项；跨域排序、比较和摘要仅在 owner 明确支持时成立。 | 该机制同时改变数据组织、故障边界和所有管理主题的呈现结构。 |
| 分离 Console 交互真相与可失效 owner-safe 影子 | 防止导航、草稿、缓存和请求呈现升级为成员、治理、制品、能力或运行 truth。 | Console 确实需要拥有交互连续性，但外部内容只能以安全快照或引用进入；结构分离可同时保留体验与单一真相。 | 必须定义影子失效、撤除和安全保留上限；离线或跨会话连续性不能默认承诺，forbidden body 永不进入本地生命周期。 | 该机制决定客户端状态承载的类型上限，不是缓存库或存储介质选择。 |
| 在受保护披露与提交边界即时重验并 fail-closed | 防止过期、撤销、冲突或未知的 actor/scope/visibility/资格继续放行内容与动作。 | 安全资格不能依赖最终收敛的影子；在真正产生披露或副作用的边界重新约束，才能保持正式 owner 决定优先。 | 增加重验等待和依赖可用性要求；无法判别时会牺牲部分可用性，且客户端只能收紧不能放宽。 | 该机制横跨路由、视图和命令入口，直接保护最小披露和副作用边界。 |
| 分层承接请求经历、即时受理姿态与 owner 正式结果 | 防止 receipt、accepted、pending、toast 或 transport success 冒充业务完成，并避免 unknown 下重复副作用。 | Console 只拥有本客户端请求经历；正式结果由 owner confirmed/rejected 提供，unknown 只有正式 reconciliation / 幂等依据才可安全恢复。 | 交互状态更显式，可能长期保留 pending/unknown；无正式回查能力时必须挂起或由用户重新发起，不能自动重放。 | 该机制改变所有受控命令的完成语义和恢复主链，不能由按钮局部处理。 |
| 分离同步当前交互、可选异步失效提示与 owner 延后工作 | 防止把所有工作强压进同步闭环，或让 Console 通过 consumer/worker 接管业务任务与事件 truth。 | 当前语境、查询、受理和回查需要可判别反馈；提示只用于失效协作；长时审批、报告、归档、验证、能力和 sandbox 工作天然属于 owner。 | 必须同时处理提示缺失、延迟结果和显式重查；不承诺即时新鲜，也不能以事件通知直接改写正式结果。 | 该机制决定三类交互的责任分配，不绑定 HTTP、RPC、MQ、轮询或事件产品。 |
| 采用按 owner 区域化故障隔离与有界交互 | 防止单一 owner 的慢、错、缺失扩散成整个 Console 不可用，或被统一 loading/error/green 压平。 | 多 owner 管理面没有跨域原子性；独立有界读取与区域状态既保护可用性，也保留事实差异。 | 需要区域级等待、重试入口、恢复和可归因诊断；具体预算、并发和超时仍需后续 authority。 | 该机制改变页面组合、失败传播和运行承载，不是单个错误组件的样式选择。 |
| 采用 forbidden-body 最小化与诊断旁路隔离 | 防止 credential、授权依据、raw/hidden payload、owner 正文、audit/evidence/report 通过缓存、错误、日志、诊断或导出旁路复制。 | Console 的职责只需要最小安全摘要、引用和请求经历；诊断不是业务 truth，也不应成为业务成功或恢复的前置条件。 | 排障上下文更受限，必须依赖安全标识与 owner 正式追踪；无法证明安全的诊断需丢弃，外围 sink 故障不保证补送。 | 该机制同时约束数据入口、错误路径和外围输出，是跨边界的数据保护决定。 |
| 采用视觉与辅助技术共享正式语义的可访问等价交互 | 防止键盘、焦点、播报或非颜色路径在资格、状态、确认和恢复上获得不同业务语义。 | 可访问性不是展示补丁；受保护操作、部分数据、unknown 和危险确认都必须在同一正式状态模型上提供等价路径。 | 所有核心交互从结构阶段就需保留语义、焦点和恢复能力；具体支持矩阵尚待 authority，不能只靠视觉组件补齐。 | 该机制横跨导航、查询、命令、错误和恢复，是产品主链的架构约束。 |
| 采用正式合同门控的保守能力激活 | 防止旧文档、mock、历史 API 或相邻项目草案把未闭口能力伪装成 integrated/ready。 | owner exact surface、safe-field、scope、activation 和量化 authority 成熟度不同；按能力门控可在不编造合同的前提下逐面开放。 | 首批体验可能是 read-only、partial、blocked 或不出现；需要持续维护 pending、依赖来源和激活条件。 | 该机制决定能力何时进入产品边界及其安全上限，不等同 feature flag 产品或配置实现。 |

### 6.2 技术边界说明

上述机制均会跨页面或跨 owner 改变边界接入、数据可进入范围、一致性、完成语义或故障传播，因此属于架构层决定。它们不绑定具体框架、协议、缓存或部署产品，也不预先规定目录、组件和 adapter。看似技术性的产品名、TTL、轮询、重试和指标阈值只有在后续合同与运行 authority 成立时才能选择。任何实现载体都必须服从本表，不能反向放宽 truth、Policy/Gate、forbidden-body 或结果边界。

### 6.3 当前采用 / 不采用的轻量边界

| 当前采用的架构机制 | 当前不采用或不在本章决定的相邻思路 | 边界原因 |
|---|---|---|
| 正式 SDK / 服务接缝、核心语义隔离 | DB/repository/服务源码直连，或具体 API/RPC 产品选择 | 前者保护依赖边界；后者被禁止或属于后续实现。 |
| owner 分区的安全视图组合 | Console 自有统一业务投影、统一治理 core、整体 readiness | 会制造跨域第二真相。 |
| 可失效安全影子 | 持久业务缓存、cursor/replay/rebuild | Console 不拥有外部投影生命周期。 |
| 边界重验与 fail-closed | 页面角色、菜单、route、feature flag 独立授权 | 客户端状态不能放宽正式决定。 |
| 受理 / 结果分层与正式回查 | 乐观完成、unknown 自动重放 | 会混淆结果并危及副作用。 |
| SDK 可选提示与 owner 延后工作 | Console bus consumer、BFF、worker/job | 无当前责任与 truth authority。 |
| 区域化故障隔离 | 全局成功/失败/绿色状态 | 会掩盖来源差异并扩大故障。 |
| 最小安全诊断旁路 | raw payload 日志、客户端证据/报告/验证器 | 会复制 forbidden body 或冒充正式材料。 |
| 可访问等价语义 | 仅视觉主链后补 a11y | 会形成不同安全和恢复语义。 |
| 正式合同门控 | Provider Contract、固定控制项/指标、旧协议默认启用 | 当前无正式 authority。 |
| 后续按约束选择框架、图库、存储与参数 | React/Svelte、图表库、TTL、轮询/重试值现在定案 | 这些不是当前架构主线决定。 |

### 6.4 机制逐项停审

| 机制组 | 影响架构边界 / 一致性 / 交互主链 | 理由与代价完整 | 未滑入产品 / 实现 | 与 Step 2/7/8/9 一致 | 结论 |
|---|---|---|---|---|---|
| 正式接缝与依赖倒置 | yes：依赖方向和核心隔离 | yes | yes | yes | `pass` |
| owner 分区与来源保真 | yes：跨域数据和故障边界 | yes | yes | yes | `pass` |
| 交互真相 / 影子分离 | yes：数据所有权和客户端承载 | yes | yes | yes | `pass` |
| 安全即时重验 | yes：披露与提交边界 | yes | yes | yes | `pass` |
| 请求 / 受理 / 结果分层 | yes：命令完成和恢复语义 | yes | yes | yes | `pass` |
| 同步 / 提示 / owner 延后分离 | yes：通信责任主链 | yes | yes | yes | `pass` |
| 区域化故障隔离 | yes：运行与页面组合 | yes | yes | yes | `pass` |
| 数据最小化与诊断旁路 | yes：输入、错误和输出边界 | yes | yes | yes | `pass` |
| 可访问等价交互 | yes：所有核心交互路径 | yes | yes | yes | `pass` |
| 合同门控的能力激活 | yes：产品边界与演进接缝 | yes | yes | yes | `pass_with_pending_contracts` |

### 6.5 跨机制审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 是否只纳入上升为架构决定的机制 | pass | 十项均影响系统结构、边界保护、一致性或关键交互主链。 |
| 是否形成技术栈、产品对比或实现清单 | pass | 未选择框架、图库、协议、中间件、缓存、存储、目录或类名。 |
| 是否每项都有问题、理由、代价和架构说明 | pass | §6.1 固定五列完整。 |
| 是否重写数据所有权或通信分类 | pass | 只解释支撑它们的技术机制及代价，详细规则仍回指 Step 8/9。 |
| 是否引入 BFF、数据库、worker、consumer 或直接 bus | pass | none；这些均明确排除。 |
| 是否把本地影子、提示或 receipt 升级为 truth | pass | 影子可失效、提示只促使重查、正式结果由 owner 确认。 |
| 是否将 Policy/Gate 或 readiness 本地化 | pass | 正式决定优先，客户端仅收紧；不生成统一结论。 |
| 是否覆盖 forbidden-body 和诊断旁路 | pass | 所有入口、错误、缓存、日志、诊断和导出均受最小化上限。 |
| 是否把 accessibility 当局部展示实现 | pass | 等价语义作为跨核心主链机制保留。 |
| 是否把 pending 写成激活/ready | pass | contract-gated；未闭口时 read-only/partial/blocked/hidden。 |
| 对 Step 11 的输入是否清晰 | pass | Step 11 可比较路径级主线，不再逐项重做机制产品选择。 |

## 7. 复杂度判断

本步有十项机制，但可归入四条架构主线：正式边界与 owner 分区、客户端真相与安全重验、请求结果与通信责任分层、故障/数据/a11y/合同的横向保护。它们都必须跨页面保持一致，因此不能降为局部实现选择；同时没有必要为每个 owner 重复一套技术栈或机制。单个 Step 文件足以完成机制级停审，具体 view model、adapter、状态机、缓存失效、配置和测试切口必须后移到 `02/03/04/05`。

## 8. 正式 §11 回填草稿（Step 16 才写入）

> 校准来源：
> - `design-calibration/01_arch_step_02_goals_constraints.md`
> - `design-calibration/01_arch_step_07_dependency_direction.md`
> - `design-calibration/01_arch_step_08_data_ownership_consistency.md`
> - `design-calibration/01_arch_step_09_interactions_communication.md`
> - `design-calibration/01_arch_step_10_technology_choices.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“关键技术机制表”“当前采用 / 不采用的轻量边界”和“待确认事项”，了解机制的采用理由、成本与当前技术边界。

正式 §11 应以 §6.1 的固定五列表为主体，以 §6.2 的 4 句边界说明和 §6.3 的轻量对照表为辅。正文必须保留十项机制的完整问题—理由—代价链，并明确这些机制约束的是所有管理页面的边界、一致性和交互主链。

正式正文不得加入 React/Svelte、Tailwind、图表库、SPA/微前端、HTTP/RPC/MQ 产品、缓存/存储产品、TTL、轮询/重试参数、widget registry、具体目录、adapter 类名、固定 SLA/阈值、38 个控制项、8 个指标或 Provider Contract。也不得新增 Console BFF、数据库、worker、consumer、内部 bus 投影，或把任何 pending 写为 integrated/ready。

## 9. 待确认事项

| 待确认项 | 本步处理 | 当前状态 |
|---|---|---|
| owner exact query/command/result/ref、safe-field、scope/visibility 与 activation | 由正式接缝和合同门控承接；不决定具体协议与实现。 | `open / blocks exact adapters and positive activation` |
| 正式 reconciliation / 幂等依据 | 只确立结果分层和 unknown 挂起；无正式依据不自动重放。 | `open / blocks automatic recovery` |
| SDK 状态 / 失效提示 | 仅作为可选增强，缺失时显式 query/revalidation 仍成立。 | `open / non-blocking` |
| 客户端状态介质、生命周期、失效触发与跨会话范围 | 只确立交互真相 / 影子分离和安全撤除上限。 | `open / blocks concrete state technology` |
| 性能、请求预算、超时、并发和可用率 authority | 只确立有界交互和区域化故障隔离，不填写数值。 | `open / blocks quantified mechanics` |
| 诊断 envelope、保留边界与浏览器 / 辅助技术支持矩阵 | 只确立最小化、旁路隔离和等价交互机制。 | `open / blocks exact implementation` |
| 相邻 L5/L6 正式 link/ref 合同 | 纳入合同门控，未停审内容不进入正向能力。 | `open / pending` |

本步未发现阻塞 Step 11 的新问题。上述 pending 只限制具体载体、参数和正向能力，不影响当前十项架构机制的必要性。

## 10. 自检、三层门禁与进入 Step 11 条件

### 10.1 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否回答采用机制、问题、理由、代价和阶段必要性 | pass | §3 与 §6.1 完整覆盖。 |
| 是否使用规范固定五列表 | pass | §6.1 列名与 §4.11 一致。 |
| 是否说明为何不是局部实现细节 | pass | 每行“说明”及 §6.2 均完成去歧义。 |
| 是否把技术栈或产品名当架构选型 | pass | none；只在排除边界中列出历史候选。 |
| 是否提前展开完整路径比较 | pass | §6.3 仅作轻量边界，完整比较留给 Step 11。 |
| 是否与依赖、数据和通信主线一致 | pass | 无反向依赖、第二 truth、通信责任或结果语义冲突。 |
| 是否引入无 authority 的运行单元 | pass | 无 BFF、DB、worker、consumer 或内部 bus projection。 |
| 是否保留每项机制的真实代价 | pass | 映射/状态/重验/局部失败/保守激活等成本均明确。 |
| 是否保留 pending 且未宣称 ready | pass | exact contract、参数、激活和支持矩阵继续 open。 |
| 正式 `01` 是否被提前写入 | pass | 仅创建 Step 10 calibration。 |

### 10.2 三层门禁

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step / 模块级 | `pass` | 十项架构机制均具备问题、理由、代价和架构层说明，且逐项停审通过。 | 更新 flow 与项目台账，激活 Step 11。 |
| 文档级 | `pass_to_step_11` | 正式 §11 回填基础已形成，未滑入产品、协议、实现或部署细节；正式 `01` 继续等待 Step 16。 | 读取 Step 11 SOP / 书写规范并创建 `01_arch_step_11_alternatives_tradeoffs.md`。 |
| 项目级 | `pass_with_open_contracts` | exact contract、reconciliation、状态介质、量化和支持矩阵仍 pending，但不阻塞路径级方案比较。 | 进入 Step 11；不修改正式 `01`，不进入 `02`。 |

本步 `pass` 只表示设计静态校准通过，不表示实现、测试、集成、用户 signoff 或 readiness 已发生。
