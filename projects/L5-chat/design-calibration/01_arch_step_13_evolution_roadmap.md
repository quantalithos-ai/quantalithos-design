# Step 13 · 演进路线

> 架构主题：说明 `L5-chat` 当前主线做到哪里算成立、哪些设计债务可暂时接受、后续如何按结构条件演进，以及什么事实会触发调整。
> 当前状态：已完成本 Step 的阶段边界、可接受债务、后续结构演进和触发条件审计；允许进入 Step 14。
> 直接输入：`01_arch_step_10_key_technology_selection.md`、`01_arch_step_11_alternatives_tradeoffs.md`、`01_arch_step_12_cross_cutting_concerns.md`、`00-需求文档.md` §4/§6/§7/§10/§12/§13/§15。
> 本步限制：只讨论架构主线的结构阶段；不写版本号、排期、任务拆单、TODO 清单或未来愿望池。

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 13 · 演进路线 |
| 前置门禁 | Step 12 `pass` |
| 本步目标 | 确认当前主线的最低成立边界，区分可接受/不可接受债务，并给出由事实触发的结构演进。 |
| 本步输出 | 演进路线表、阶段边界说明、债务判断、触发条件小表和 §14 回填草稿。 |
| 本步不展开 | 项目排期、版本路线、实施任务、测试计划、平台愿望池和边界外系统路线。 |
| 当前产品范围 | Desktop-first 是当前产品阶段；Web/Mobile 只有在正式宿主和跨端能力条件成立后才进入主线。 |

## 2. SOP 问题回答

### 2.1 当前阶段做到哪里才算足够？

当前阶段的架构主线足够成立，需要同时具备：

- Chat 的客户端产品边界、owner truth 排除和 `L0-sdk` 唯一业务接入已明确。
- 共享客户端语义、平台 shell、safe projection、结果门控、formal change/resume、受限本地状态和 fail-closed 机制已在架构上分开。
- Desktop-first 运行承载能够解释同步入口、连续性承接、本地恢复和平台降级；不把具体框架或实现事实伪装成已完成。
- 发送、治理、Artifact、Workspace、成员/项目/运行摘要和恢复均有明确的 pending/unknown/stale/blocked 等姿态。
- 依赖、数据 ownership、通信类别、横切约束和主要取舍之间没有 unresolved 冲突。

“成立”指主线边界和承接方式足够支撑后续概要/详细设计，不指代码已实现、SDK 已闭合、测试已运行或生产 ready。

### 2.2 哪些设计债务当前可以接受？

- SDK exact method/DTO/schema、owner visibility/cursor/resume、Governance receipt/idempotency、Artifact preview、Workspace safe export、诊断 envelope 尚未闭合，但它们已被显式登记并不会被 Chat 私自补齐。
- React/TypeScript、Tauri、Web/Mobile shell、状态库、存储引擎和传输机制尚未最终选择，但架构机制不依赖某个载体。
- 精确性能、SLO、兼容矩阵、持久化上限、辅助技术组合和跨端恢复策略尚无 authority，但行为级底线已经固定。
- 搜索、复杂附件、通知/托盘、移动后台等外围增强暂不进入当前主线，只要不改变核心边界。

这些债务之所以可接受，是因为它们不会要求重新拥有 owner truth，也不会迫使当前主线直连私有 API、内部 bus、共享 DB 或离线副作用。

### 2.3 哪些债务不可接受？

- 以私有 API、内部 bus、共享数据库或外部正文填补 SDK/owner 合同缺口。
- 把 unknown、transport ACK、缓存命中、连接恢复或按钮点击升级为 confirmed。
- 将本地 cache/projection/recovery 写回 owner truth、Workspace attention 或治理结果。
- 在 visibility/scope 无法验证时继续展示或操作受保护材料。
- 为不同平台复制业务状态、权限和结果语义，或因 shell 能力缺失另造业务路径。
- 用固定数字、伪造测试、readiness 或生产事实掩盖未闭合 authority。

这些不是阶段债务，而是会打穿主线边界的阻塞条件。

### 2.4 哪些能力留到后续阶段？

- 正式 SDK/owner contract 闭合后的实现级 adapter、reducer、恢复和结果关联。
- Web/Mobile shell 的正式兼容、辅助技术和后台能力矩阵。
- 更完整的跨端恢复、跨设备草稿/选择协作和受控通知语义，前提是 owner/SDK 正式提供能力。
- 更细粒度的安全预览、治理回链、Workspace safe export 和低敏诊断关联。
- 规模压力出现后，对局部 materialization、性能隔离和可观测支持边界的结构增强。

后续项只有在触发条件成立后进入主线，不构成当前承诺的功能愿望池。

### 2.5 什么事实会迫使架构调整？

- SDK 或 owner 正式合同无法表达当前需要的 visibility、idempotency、receipt/result、change/resume 或 safe preview，导致 Chat 被迫推断或复制 truth。
- Desktop-first 主线出现无法局部隔离的性能/容量放大，要求重新划分材料投影、恢复承接或平台宿主边界。
- Web/Mobile 需要正式支持且宿主能力差异改变了状态、授权、通知或恢复语义。
- 跨设备恢复成为正式产品语义，但现有本地投影无法在不创建第二真相的情况下承接。
- 低敏诊断无法提供足够关联来解释 unknown、撤销或恢复，且支持需求不能靠本地提示解决。
- 新的 owner/治理边界要求 Chat 发送新的副作用类型，现有结果门控和安全接缝无法表达。

### 2.6 主线演进时最先改变哪类结构？

优先调整外部接缝和 owner-safe materialization，再调整连续性承接和平台 shell；核心语义和 owner truth 排除保持稳定。这样可以让合同、容量或平台压力在边界层吸收，避免把变化扩散到页面体验、局部状态和结果门控核心。

## 3. 历史材料与边界污染诊断

| 历史表达 | 污染风险 | 本 Step 处理 |
|---|---|---|
| “先做 UI，后面再补 SDK/权限/恢复” | 把边界阻塞隐藏在实现阶段，导致 UI 假造结果。 | 当前阶段先让边界、状态和失败姿态成立，exact contract 以 blocker 保留。 |
| “V1/V2/V3 功能排期” | 把项目计划误写成架构演进。 | 改为结构阶段和事实触发条件，不写版本或日期。 |
| “未来支持所有平台” | 把愿望池当演进主线，忽略宿主/AT/恢复条件。 | 只有正式跨端条件闭合后才触发 shell 扩展。 |
| “先接受直连/缓存，后续再收敛” | 不可接受债务被包装成阶段取舍。 | 直连、第二真相、unknown 重放和越权展示列为不可接受。 |
| “观察到性能问题再全局重构” | 缺少局部触发和先改变边界层的演进顺序。 | 明确容量/复杂度触发器，优先调整接缝和投影承接。 |

## 4. 演进路线表

| 阶段 | 当前目标 / 范围 | 当前可接受债务 | 后续演进项 | 触发条件 | 说明 |
|---|---|---|---|---|---|
| 边界稳定阶段（当前架构成立） | 让 Chat-owned 局部 truth、owner truth 排除、SDK-only 接入、safe projection、结果门控、变化/恢复、Desktop-first 承载和横切底线完整成立。 | exact SDK/owner contract、具体载体、精确 NFR/兼容矩阵、诊断 envelope 尚未闭合；正向能力保持 pending/blocked。 | 进入合同闭合后的实现级 adapter、reducer、view model、恢复和测试切口设计。 | 前述边界存在 unresolved 冲突，或任一缺口迫使 Chat 私自推断 truth。 | 当前阶段先建立可落码的结构边界，不宣称实现或 readiness。 |
| Desktop 主线承接阶段 | 在正式 SDK/owner surface 闭合后，形成可验证的 Desktop 协作入口、发送/重试、GateCard、Artifact safe preview、变化消费和恢复连续性。 | Web/Mobile shell、复杂搜索/附件、跨设备同步和增强通知仍不进入主线；局部 owner 能力可保持 read-only/stale。 | 补齐正式 shell 能力、跨端共享语义和更细的恢复/诊断关联。 | Desktop 核心路径需要的 query/command/change/resume、治理 receipt、Artifact preview、Workspace safe view 等合同均已正式可用。 | 该阶段以能力闭合为条件，不以时间或功能数量作为门槛。 |
| 跨端语义扩展阶段 | 在不改变业务语义的前提下增加 Web/Mobile shell，保持状态、授权、结果、可访问性和恢复解释一致。 | 某些平台特有通知、后台、文件/剪贴板能力仍可 unavailable/needs-action；跨端同步只在正式能力存在时提供。 | 正式跨设备 draft/selection/recovery、平台通知和后台恢复承接。 | 第二宿主成为正式支持范围，且平台/辅助技术/持久化/恢复矩阵已闭合；宿主差异不会迫使业务语义分叉。 | 扩展先发生在 shell 和接缝，不重写核心语义。 |
| 规模与承接增强阶段 | 面向更大协作语境、更多变化和更复杂 safe view，增强局部 materialization、容量隔离、可观测关联和恢复承接。 | 仍不允许 Chat 拥有跨域 truth、直订 bus 或保存 forbidden body。 | 细化投影粒度、分区的恢复承接、支持诊断和跨域安全摘要边界。 | 真实规模或变化复杂度导致当前局部/按需承接出现结构性放大、恢复不可解释或低敏追溯不足。 | 该阶段由边界压力触发，优先改变外部接缝和投影承接，不扩张核心 truth。 |

## 5. 当前可接受与不可接受债务表

| 债务 | 当前判断 | 可接受/不可接受理由 | 触发后动作 |
|---|---|---|---|
| SDK exact surface 未闭合 | 可接受但阻塞正向能力 | 架构只需保持 SDK-only；不能以私有接口填补。 | 合同闭合后更新接缝和交互承接。 |
| Owner visibility/cursor/resume 不一致 | 可接受但需保持 blocked/stale/unknown | 未闭合时不宣称实时/完整历史；边界仍安全。 | 统一正式消费合同，调整变化与恢复承接。 |
| 精确性能/容量数字缺 authority | 可接受 | 结构性能底线已固定，不用伪数字推进。 | authority 形成后补预算和验证边界。 |
| Web/Mobile/AT 矩阵未闭合 | 可接受 | V1 Desktop-first；shell 扩展不阻塞核心边界设计。 | 第二宿主进入正式范围时扩展 shell/可访问矩阵。 |
| 诊断 envelope 未闭合 | 可接受 | 主业务不依赖诊断 sink；低敏 handoff 可 deferred。 | 支持定位需求超过本地提示时收敛 handoff。 |
| 直连 owner 私有 API | 不可接受 | 破坏 SDK-only、授权和演进边界。 | 立即阻塞相关实现/设计，回到正式 SDK 合同。 |
| 本地投影反写 owner truth | 不可接受 | 形成双真相和隐式副作用。 | 立即阻塞，删除反写路径并回到 owner command。 |
| unknown 自动重放 | 不可接受 | 可能造成重复发送或治理副作用。 | 保持 unknown，增加正式 probe/result 或用户决定。 |
| visibility 不明仍展示敏感材料 | 不可接受 | 造成越权和正文泄露。 | fail-closed、清理/遮蔽并等待正式验证。 |

## 6. 触发条件小表

| 触发事实 | 首先受影响的结构面 | 演进动作 |
|---|---|---|
| 正式 SDK/owner contract 可用且覆盖核心路径 | 外部接缝、safe material、结果承接 | 从边界设计进入可落码的 adapter/reducer/view model 设计。 |
| Desktop 核心路径需要的恢复/预览/治理能力仍无法闭合 | 外部接缝、连续性承接 | 保持 read-only/blocked，不扩张本地 truth；回流缺口到 owner/SDK。 |
| 第二平台进入正式支持范围 | 平台 shell、可访问性、持久化/恢复 | 先验证语义等价和宿主矩阵，再扩展 shell；不复制业务状态。 |
| 跨设备恢复成为正式能力 | 本地投影、owner safe view、同步接缝 | 先确定正式 owner/SDK 语义，再扩展跨端恢复；不以共享缓存代替。 |
| 变化量/视图复杂度造成结构性放大 | safe projection、变化承接、性能隔离 | 优先细化按需投影、局部恢复和外部接缝，不改变核心 truth。 |
| unknown/撤销无法被低敏解释 | 诊断 handoff、审计回链、结果姿态 | 增强正式低敏 correlation/ref；不保存 raw body。 |

## 7. 阶段边界说明

当前阶段不是“所有能力都已完成”，而是先确认 Chat 的主线在没有 owner truth 泄漏、直接 bus/API、第二真相和 unknown 重放的前提下可以继续进入后续详细设计。exact SDK/owner 合同、技术载体、数值 NFR 和跨端矩阵可以暂时未闭合，因为它们不会迫使当前架构改变核心边界；一旦缺口开始要求客户端推断或复制正式事实，就不再是可接受债务。后续演进由正式能力、平台范围、规模压力和诊断需求等事实触发，不由版本愿望或排期推动。

## 8. 正式回填草稿

### 8.1 §14 演进路线

当前阶段先让 `L5-chat` 的客户端边界、SDK-only 接入、owner-safe 投影、局部 truth、结果门控、formal change/resume、Desktop-first 承载和横切底线成立；它不要求 exact SDK surface、具体 shell、性能数字、兼容矩阵或诊断 envelope 已闭合。可接受债务是明确登记且不会打穿边界的合同、载体和测量缺口；直连 owner/bus、第二真相、unknown 重放、visibility 不明继续展示和平台业务语义分叉不可接受。

后续先进入 Desktop 主线承接阶段，在正式 query/command/change/resume、Governance receipt、Artifact preview 和 Workspace safe view 可用后形成可落码核心路径；当第二宿主正式进入范围且矩阵闭合时，再扩展 Web/Mobile shell；当规模、变化复杂度或低敏追溯超过当前局部承接能力时，再细化投影、恢复和诊断边界。演进优先发生在外部接缝、safe materialization、连续性和 shell，核心语义与 owner truth 排除保持稳定。

## 9. Step 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确当前阶段最低成立边界 | `pass` | 边界、承载、依赖、数据、通信和横切主线均有成立条件。 |
| 是否区分可接受与不可接受债务 | `pass` | 合同/载体/测量缺口与真相越界/unknown 重放/越权展示清晰分开。 |
| 是否给出结构阶段而非项目排期 | `pass` | 使用边界稳定、Desktop 承接、跨端扩展、规模增强四类结构阶段。 |
| 是否给出事实触发条件 | `pass` | 合同闭合、第二平台、跨设备、规模压力和诊断需求均有触发器。 |
| 是否保持前文边界和横切约束 | `pass` | 不把 Runtime/Bridges/Observability backend 或 owner truth纳入后续主线。 |
| 是否避免未来愿望池 | `pass` | 后续项均由明确事实触发，不列无限扩展功能。 |
| 是否存在 unresolved 演进冲突 | `none` | 演进优先外部接缝/投影/连续性/shell，核心语义保持稳定。 |
| 是否完成正式 §14 回填草稿 | `pass` | 阶段、债务、触发条件和结构顺序已形成。 |

## 10. Step 门禁

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| 阶段级 | `pass` | 当前成立边界、后续结构阶段、债务和触发条件均已停审。 | 允许进入 Step 14，集中收纳风险与待确认项。 |
| Step / 模块级 | `pass` | 演进表、债务表、触发条件和阶段说明完成。 | 更新 flow 与项目台账后创建 Step 14。 |
| 文档级 | `in_progress` | 正式 `01-架构设计.md` 尚未完成 Step 14～16，旧正式文件仍保持 historical material。 | 继续 Step 14；不装配正式 `01`。 |
| 项目级 | `in_progress` | 本项目仍处于 `01` 架构校准，未进入 `02`。 | 保留 exact SDK/owner/platform blocker，按顺序进入 Step 14。 |


## 本轮逐章审查与修复（2026-10-01）

> 模式：regression-review / single-agent-serial。前轮记录作为差异材料；本节为当前章节修复基线。前序修复已通过，未闭合合同不升级为 ready。

### 执行计划与输入

- [x] 读取本 Step SOP、书写规范对应章、修复后 00、冻结原型和相关正式 owner 边界。
- [x] 顺序完成问题回答、旧材料诊断、取舍、结构化结果、复杂度判断和回填自检。
- [x] 只回填本 Step 对应现有正式章节并更新 flow/ledger；无实现、测试或 commit。

### 问题回答与诊断

新增项目/流程/目录是不是后续增强？00 F-CHAT-018～021 属核心展示，因此不能隐藏在未来愿望池。旧 Desktop 主线仅通用协作/Gate/Artifact；补上五标签、BPMN、节点关联、双向入口和目录。V1 不承诺完整 BPMN 执行语言支持或所有人员覆盖，只要求获准结构的展示面及诚实降级。

### 取舍与结构化结果

演进依正式能力而非时间表：先闭合 Process projection、绑定/撤销与目录来源；再细化 02/03 页面/导航、组件/view model/store、adapter/reducer、配置和测试；然后才可按 04～07及实施门禁落码。缺合同可写 blocked UI 设计，不能宣布正向集成已完成；不在本轮推进下游。

回填 §14 主线与触发条件、可接受债务表说明。复杂度：阶段表已有；不新增排期图。自检：主线功能不被当外围，完整执行引擎不吸收，Web/Mobile 仍后续，07前不创建 implementation ledger。

### 门禁

- gate_status：pass（架构文档级；上游正向能力继续 blocked/pending）。
- gate_reason：演进阶段已纳入流程/目录主线并以正式 capability 为触发条件。
- next_allowed_action：进入 Step 14，重新读取其 SOP 与前序输入。
