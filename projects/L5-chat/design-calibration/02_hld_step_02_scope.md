# L5-chat 02 · Step 2 本仓设计目标与当前范围

> Step 状态：`done`
> gate_status：`pass`
> 本步主题：在 Step 1 已确认的输入边界内，收稳概要设计应达到的结构深度、必须交付给详细设计的骨架，以及明确不进入本轮的内容。
> 生成依据：`standards/document/概要设计讨论流程_SOP.md` §5 Step 2；`standards/document/概要设计书写规范.md` §4.2。
> 上游输入：`02_hld_step_01_upstream_boundary.md`、`projects/L5-chat/00-需求文档.md`、`projects/L5-chat/01-架构设计.md`、`draft/01_项目作用与交互对象.md`、`draft/02_功能推演.md`、`draft/03_模块划分与分层.md`。

## 1. Step 内计划

| 子阶段 | 产物 | 状态 | 门禁 |
|---|---|---|---|
| 读取 Step 1 输入 | Step 1 关系映射、排除清单、必须回答清单和项目/flow 台账 | `done` | 输入边界已通过 |
| 回答 SOP 问题 | 目标、深度、范围和非范围回答 | `done` | 每项均能回指需求/架构边界 |
| 历史材料诊断 | 旧概要设计的过宽 UI/服务端混合、固定技术和指标污染 | `done` | 不继承旧范围 |
| 设计取舍 | Desktop-first、共享客户端语义、SDK-only、概要层骨架深度 | `done` | 不锁实现目录和 exact contract |
| 结构化产物 | 设计目标表、非范围表、深度口径和范围矩阵 | `done` | 能直接回填正式 §2 |
| 复杂度判断 | 确认本步不画图，图留给 Step 4/5/8/9 | `done` | 符合 §4.2 禁止图示规则 |
| 回填草稿 | §2 回填草稿 | `done` | 只承载范围结论 |
| 自检与门禁 | Step 自检、三层门禁和下一步条件 | `done` | `pass`，允许创建 Step 3 |

## 2. SOP 问题回答

### 2.1 本次概要设计最主要要把哪些结构说清？

本轮要把“客户端产品体验如何落到可实现结构”说清，具体包括：共享客户端语义与平台 shell 的分界；应用壳、页面与路由族的责任；主要组成部分及其 capability；Chat-local 对象与 owner-safe 材料的边界；SDK adapter 的能力类别；event/change reducer、结果门控、缓存/恢复承接和平台能力适配；关键 query/command/change/resume/operations 处理流；结果与连续性状态轴；异常边界和配置影响。它们必须能让 `03-详细设计.md` 继续定义字段、协议、函数、事务、错误、幂等、持久化和测试切口，但本轮不写这些实现细节。

### 2.2 本轮概要设计应停在什么深度？

停在“代码主体骨架层”：可以正式命名主要组成部分、应用入口、页面/路由族、view model、client store、SDK adapter、event reducer、local persistence/recovery boundary、关键对象、Command/Query/Event/Operations 类别、状态集合、关键处理流和配置影响类别；可以写关键字段的概要类型名和函数/工厂的参数类型骨架。不得下沉为代码目录、文件路径、完整 struct/trait、完整函数签名、协议 schema、数据库结构、部署参数、具体默认值、错误码全集、测试结果或实现指令。

### 2.3 哪些内容属于本次概要设计范围？

范围聚焦在 V1 Desktop-first 的共享客户端产品结构：

- 共享客户端 core 的产品语义、view model、store、reducer 和 SDK adapter 边界。
- Desktop 应用壳与页面/路由族的结构职责；Web shared UI 与 Mobile provisional shell 只保留语义复用和边界，不扩大 V1 交付面。
- group/channel/dm/thread 协作入口、Turn 展示、草稿与选择、发送/重试结果、GateCard、Artifact 引用/安全预览、成员/项目/运行摘要和恢复入口的结构骨架。
- formal query/command/change/resume 的消费类别、结果门控、幂等关联、unknown/重查/等待姿态和安全失败边界。
- 本地受限展示缓存、草稿、恢复上下文、来源/visibility/freshness 元数据和登出/撤销清理的结构影响。
- 跨端可访问语义和平台能力缺失时的 `unavailable` / `needs-action` / `blocked` 姿态。

### 2.4 哪些相关内容当前不进入概要设计？

明确不进入本轮的内容包括：

- 各 owner 的领域模型、数据库、服务端 workflow、授权策略和正式事件 schema。
- L0-sdk 的通用实现、传输层、认证实现、retry/timeout 具体参数、bus broker/offset/topic 和公共包发布。
- 完全离线业务、离线发送/审批成功、客户端自建 BFF、Runtime 推理、Tools 执行、Bridges 映射和 Observability backend。
- 详细 UI 视觉设计、像素级组件规范、设计 token、文案库、动效脚本和平台原生实现。
- 完整路由 path、协议字段全集、DTO/serde 定义、数据库/文件格式、完整函数调用链、错误码全集和补偿脚本。
- 质量数字、容量/性能/可用率承诺、兼容设备矩阵、真实测试、证据、验收和 readiness。

### 2.5 哪些内容应留给详细设计？

`03-详细设计.md` 继续收口：正式类型与字段完整定义、SDK adapter 的实际接口映射、协议/事件 envelope、selector/reducer 函数签名、幂等键和 attempt 关联细节、分页/cursor/resume 处理、持久化格式与清理顺序、平台桥接实现、异常分类与重试/探测策略、可访问性实现、日志/redaction 细节、单元/集成测试切口及证据边界。若详细设计需要改变本步确定的主要组成部分或主语，必须先回退本概要设计修正。

## 3. 历史材料问题诊断

| 旧材料口径 | 问题 | 本步处置 |
|---|---|---|
| 旧 `02-概要设计.md` 把“为什么做”“页面组件”和服务端对象混写 | 回滑到需求/架构，且把 UI 名称误当领域主语 | 改为结构目标和下游交付口径，细节按 Step 4～9 独立收口。 |
| README 固定 React/Svelte/Tauri/React Native、AG-UI 17、目录结构 | 把候选载体和历史协议写成实现事实 | V1 Desktop-first 保留为范围决策；具体 shell/协议继续保持 candidate/pending。 |
| 旧文件使用固定性能数字和容量假设 | 无当前 authority，容易产生虚假 NFR | 本轮排除数字，仅保留行为级安全、可恢复和可访问性目标。 |
| draft 页面/模块清单直接当正式结构 | 候选未经过职责、对象和接缝停审 | 只将其作为范围线索，后续逐 Step 重新验证。 |
| 旧“流式输出/消息/附件”叙述容易吞并 Runtime/Artifact truth | Chat 变成第二 owner | 只设计安全展示、受控意图和结果反馈，不拥有执行或正文。 |

## 4. 设计取舍

### 4.1 采用“共享语义 core + 平台 shell”的概要范围

本轮把共享客户端 core 作为概要设计的主要下沉对象，把 Desktop shell 作为 V1 主承载，把 Web shared UI 和 Mobile provisional shell 作为边界参考。这样可以在桌面版本优先的前提下，先收稳路由、view model、store、reducer、SDK adapter 和状态语义，而不为多个宿主复制业务规则。具体载体仍不被写成代码实现事实。

### 4.2 采用“展示与受控交互”而非“纯静态展示”的范围

用户此前确认 Chat 倾向展示层，但展示层必须包含草稿、选择、发送/重试入口、GateCard 受控操作入口、optimistic/pending/confirmed/failed/unknown 反馈和恢复提示。这些是 Chat-local 交互状态及 owner 结果映射，不是 Conversation、Governance 或 Runtime truth。若把范围压成只读页面，将无法覆盖需求中的受控协作闭环。

### 4.3 采用能力级 SDK adapter，不锁 exact SDK surface

概要设计需要明确 adapter 的责任和边界，否则详细设计会重新发明私有调用；但当前 SDK/owner 合同未完全闭合，因此只确定 query、command、formal change/resume、safe ref/preview、错误/redaction 和低敏诊断能力类别。方法名、DTO、schema、transport 和包名留给上游合同与详细设计。

### 4.4 采用行为级状态和边界目标，不写无 authority 数字

本轮必须明确结果门控、幂等、重连、缺口、缓存失效、可见性撤销和可访问性等行为；不把首屏时间、P95、连接数、容量、可用率或跨设备矩阵写成目标。后者需要正式质量 authority 和测试/验收文档承接。

## 5. 结构化中间产物

### 5.1 设计目标表

| 目标 | 说明 | 交付给详细设计的结果 |
|---|---|---|
| 收稳共享客户端代码主体 | 说明应用壳、页面/路由、体验编排、view model、store、reducer、SDK adapter、缓存/恢复和平台接缝的结构关系 | 主要组成部分、实现分层、组件职责和依赖方向输入。 |
| 收稳 Desktop-first 页面与入口骨架 | 说明协作入口、对话空间、compose、GateCard、Artifact、成员/项目/运行摘要和恢复入口的职责，不固化视觉细节 | 页面/路由族、view model 输入输出类别、壳能力和 03 组件契约输入。 |
| 收稳 Chat-local 对象边界 | 把 route/context、selection/focus、draft、attempt、view snapshot、recovery context 与 owner-safe ref/result/change 分开 | 关键对象骨架、字段类型候选、状态集合和持久化/清理承接。 |
| 收稳 SDK-only 接口骨架 | 区分 Query、Command、Inbound Change/Event、Outbound local intent/result 和 Operations 恢复入口 | 03 的 adapter 接口、envelope、幂等/错误/trace 和映射细节输入。 |
| 收稳关键处理流 | 明确读取、发送/治理意图、变化消费、缺口恢复、Artifact preview 和本地恢复的主路径与边界 | 03 的函数、事务边界、reducer action、异常、重试/探测和测试切口输入。 |
| 收稳多轴状态与降级 | 分离命令结果、数据新鲜度、可见性、连接/恢复和本地编辑状态 | 03 的状态类型、迁移守卫、持久化清理和跨端同步映射输入。 |
| 收稳配置影响与禁止配置化边界 | 识别平台、SDK、缓存、恢复、诊断和可访问性受配置影响的方向；保护 owner 权限、结果门控和安全红线 | 03 的 RuntimeConfig/adapter/job 注入方向，04 的配置说明输入。 |
| 保留真实 blocker 与证据边界 | 不以假 SDK、假事件或 UI mock 宣称集成、测试、验收或 readiness | 03/04/05/06/07 的风险、前置条件和证据边界输入。 |

### 5.2 非范围表

| 非范围 | 留给哪一层 |
|---|---|
| 需求目标、用户故事、功能验收和需求追溯 | `00-需求文档.md` |
| 系统上下文、子域、owner truth、依赖方向和技术取舍 | `01-架构设计.md` |
| 完整页面视觉、设计 token、文案、动效和像素布局 | 设计系统 / 产品设计 / 后续详细设计 |
| 完整字段、函数签名、协议 schema、序列化、持久化格式和错误码 | `03-详细设计.md` 与专项上游合同 |
| 配置键、默认值、环境变量、密钥和部署挂载 | `04-配置设计.md` |
| 测试用例全集、真实运行、报告、evidence 和验收 verdict | `05-测试方案.md`、`06-验收标准.md` |
| commit boundary、开发排期、实现仓和发布步骤 | `07-实施计划.md` |
| Conversation/Identity/Work/Governance/Artifact/Workspace/Member/Runtime/Observability truth | 对应 owner 项目 |
| 通用 SDK、内部 bus、Runtime/Tools、Bridges、Observability backend | 对应专项项目；Chat 只经正式 seam 消费 |
| 完全离线业务、离线审批和未知副作用自动重放 | 当前产品范围外；保留恢复/查询/用户决策入口 |
| 性能、容量、可用率、平台兼容和辅助技术数字承诺 | 待正式 authority、测试和验收闭合 |

### 5.3 当前阶段设计深度口径

本轮概要设计收敛到“可落码的客户端结构骨架”：每个主要组成部分都要能指向 capability、关键对象、接口类别、处理流、状态和配置影响；每个关键字段和函数只写概要类型/参数骨架。正式文档不写代码目录、完整 schema、实现调用链、部署细节、测试结果或 readiness。所有未闭合 SDK/owner/platform/diagnostic 合同均保留 `pending / blocked / waiting / unavailable / unknown` 姿态，并在 Step 13 汇总。

## 6. 回填草稿（正式 §2）

> 校准来源：本文件 `§5.1 设计目标表`、`§5.2 非范围表`、`§5.3 当前阶段设计深度口径`。

本次概要设计在已收稳的需求与架构边界下，收敛 `L5-chat` 的可落码客户端结构：共享客户端语义 core、Desktop-first 应用壳、页面与路由族、view model、client store、SDK adapter、formal change/event reducer、受限缓存与恢复、平台能力接缝、关键对象、接口类别、处理流、状态机和配置影响。目标是让详细设计能够继续定义字段、协议、函数、事务、错误、幂等、持久化、平台适配和测试切口，同时保持 owner truth、SDK-only、结果门控、fail-closed、最小披露和跨端语义一致。

| 目标 | 说明 | 交付给详细设计的结果 |
|---|---|---|
| 收稳共享客户端代码主体 | 组织应用壳、页面/路由、体验编排、view model、store、reducer、SDK adapter、缓存/恢复和平台接缝 | 主要组成部分、实现分层和职责边界。 |
| 收稳 Desktop-first 入口骨架 | 覆盖协作入口、对话/线程、compose、GateCard、Artifact、摘要和恢复路径 | 页面/路由族、组件职责和 view model 输入输出类别。 |
| 收稳 Chat-local 对象、接口和处理流 | 区分客户端局部状态与 owner-safe material/result/change | 03 的类型、协议、函数、事务、错误、幂等和测试输入。 |
| 收稳多轴状态与配置影响 | 保持结果门控、恢复、可见性、安全和跨端语义 | 03/04 的状态实现、配置契约和清理规则方向。 |

| 非范围 | 留给哪一层 |
|---|---|
| 需求/架构重新定义 | `00` / `01` |
| 完整实现与协议细节 | `03` 与上游 owner/SDK |
| 配置项和部署细节 | `04` |
| 测试、验收和实施事实 | `05`～`07` |
| 外部 owner truth 与服务端执行 | 对应专项 owner |

## 7. 待确认事项

| 待确认 | 影响 | 当前挂起口径 |
|---|---|---|
| V1 Desktop shell 的最终载体和宿主能力矩阵 | 应用壳、平台 adapter、存储/通知/深链边界 | 以 Desktop-first 作为范围；具体载体保持 candidate。 |
| Web shared UI 与 Mobile provisional shell 的交付层级 | 共享 core 与 shell 的拆分深度 | 只纳入语义复用和边界，不把移动交付作为 V1 前置。 |
| SDK/owner exact surface | adapter、接口、处理流和状态实现 | 能力级设计；未闭合处 blocked/unknown。 |
| 本地缓存和恢复的正式留存/清理上限 | persistence 对象和配置影响 | 仅定义最小安全材料、来源/visibility/freshness 和清理方向。 |

## 8. 自检与门禁

### 8.1 Step 自检

| 检查项 | 结论 |
|---|---|
| 是否明确本轮概要设计的结构目标？ | 是；目标覆盖代码主体、页面/路由、对象、接口、处理流、状态和配置影响。 |
| 是否明确交付给详细设计的结果？ | 是；每项目标均列出 03 可继续展开的骨架。 |
| 是否写清当前不进入概要设计的内容及归属层？ | 是；已分到 00/01/03/04/05～07、专项 owner、设计系统或范围外。 |
| 是否把候选技术、页面或实现目录写成事实？ | 否；载体和实现细节保持 candidate/pending。 |
| 是否引入无 authority 的性能/容量目标？ | 否；只保留行为级结构目标。 |
| 是否回滑到需求或架构重写？ | 否；只承接前序结论并收稳结构深度。 |
| 是否可支撑 Step 3 约束讨论？ | 是；范围和深度已给出约束提炼边界。 |

### 8.2 进入下一步条件

- 设计目标、非范围和深度口径已收稳。
- 范围与 Step 1 的可承接输入一致，没有以愿望扩大到未闭合 owner/SDK 能力。
- 详细设计交付结果明确，且不提前写完整字段、协议、函数和实现。
- 项目级台账、02 flow 和本 Step 文件一致，允许创建并执行 Step 3。

### 8.3 门禁结论

`gate_status = pass`。Step 2 已完成，下一动作是创建并执行 `02_hld_step_03_constraints.md`；继承的 SDK/owner/platform blocker 继续限制正向实现级结论，但不阻止约束条件收稳。

## 2026-10-01 当前逐章复核

计划/输入：读取Step2 SOP、书写规范§4.2、既有Step2与正式§2，承接当前Step1及修复后01。

问题回答/诊断：旧范围只有项目摘要，遗漏项目详情五标签、整体/阶段/节点、并行结构和目录。当前只收稳客户端骨架；正向Process/关系/目录消费仍受CHAT-UP008/009阻塞。完整协议、函数实现、视觉token及质量数值留给后续文档/owner。

取舍/结构结果：保留七单元，项目进度归项目详情；补分层流程/独立Gate/双向群聊/分立成员集合结构目标及非范围。概要给03对象/接口/状态骨架，不生成完整owner类型或SDK方法。复杂度用目标表，不画图。

回填/自检：§2目标、范围和非范围原位修复；未扩大V1到Mobile、未写实现与验收。Step2 done，章节gate pass；合同blocked；允许Step3，不提交。
