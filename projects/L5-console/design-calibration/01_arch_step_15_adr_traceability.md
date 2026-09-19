# 01 架构 Step 15：ADR 与需求追溯

> 对应正式章节：`01-架构设计.md` §16 需求追溯矩阵 / §17 ADR 索引  
> 当前模式：`full-restart + single-agent-serial`  
> 本步状态：`completed / stop_review`  
> 正式 `01` 写入：`false_until_step_16`

## 1. Step 状态与 Step 内计划

前序 Step 14 已通过门禁。本步只将前文已收稳的需求结论、架构结果、风险和取舍连接起来，并建立长期架构决策候选索引；不创建正式 ADR 文件，不新增架构结论，不把未闭口的协议、字段、状态机、产品或参数升格为决策。

| 计划项 | 状态 | 产物 / 门禁 |
|---|---|---|
| 读取 Step 1~14、`00_req_step_16_traceability_matrix.md`、架构 SOP Step 15 与书写规范 §4.16~§4.17 | done | §2 |
| 回答 ADR、来源、孤儿需求、长期红线和停审问题 | done | §3 |
| 诊断旧 ADR 编号、技术栈和目录映射污染 | done | §4 |
| 形成需求结论到架构承接结果的主矩阵 | done | §6.1 |
| 形成追溯漏项检查与 pending 边界 | done | §6.2 |
| 建立长期架构决策候选索引并逐项停审 | done | §6.3~§6.4 |
| 完成跨 ADR / 需求追溯审计、回填草稿、自检与三层门禁 | done | §6.5、§7~§10 |

本步的 ADR 表是“候选索引”，不是已评审、已批准或已创建的 ADR 文件。只有已经在 Step 1~14 形成稳定、长期影响主线且可回指来源的架构决定才进入候选；exact owner contract、具体协议、字段、实现产品和量化目标继续留在风险/待确认表。

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| `00-需求文档.md` §2、§4、§7、§9~§16 | 提供 Console 定位、`C-CON-1~6`、`FR/BR/DR/IF/DEP/NFR/AC/VETO-CON-*` 与需求层风险/待确认。 |
| `design-calibration/00_req_step_16_traceability_matrix.md` | 提供功能中心的需求闭环、能力小循环、孤儿检查和外围 pending 状态。 |
| `01_arch_step_01_requirement_baseline.md` | 提供架构需求基线、硬约束、风险与回指入口。 |
| `01_arch_step_02_goals_constraints.md` | 提供架构目标、不可变约束、取舍和非目标。 |
| `01_arch_step_03_responsibility_boundary.md`~`01_arch_step_06_container_deployment.md` | 提供职责、上下文、运行承载和部署边界。 |
| `01_arch_step_07_dependency_direction.md`~`01_arch_step_09_interactions_communication.md` | 提供依赖分类、数据所有权、一致性与通信主链。 |
| `01_arch_step_10_technology_choices.md`~`01_arch_step_14_risks_open_questions.md` | 提供机制、路径取舍、横切约束、演进阶段和风险/pending。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 15 | 规定来源—承接追溯、ADR 候选和孤儿/新增结论审计。 |
| `standards/document/架构设计书写规范.md` §4.16~§4.17 | 规定追溯矩阵、漏项表、ADR 索引固定字段与进入标准。 |
| L1/L2/L3/L4 专项正式文档和台账 | 只作为 owner 边界和粒度参考，不把其 ADR 或实现状态复制进 Console。 |
| 旧 `01-架构设计.md`、README、draft | 仅审计旧 ADR-0008~0011、技术框架和页面目录，不作为新版来源。 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些架构决定需要沉淀为 ADR？ | 长期决定包括：Console 只拥有客户端交互 truth；owner truth 与消费面分离；所有业务访问经正式 SDK/服务接缝；按 owner 分区且保留来源/多轴状态；安全边界即时重验与 fail-closed；请求经历、受理与 owner 结果分层；同步主链、可选提示和 owner 延后工作分离；forbidden-body 最小化与诊断隔离；区域化故障与可访问等价交互；正式合同门控的渐进激活。 |
| 每个关键决定对应哪些需求、约束或风险来源？ | §6.1 将 `C-CON`、关键 `FR/BR/DR/DEP/NFR/AC/VETO` 与架构章节结果逐项连接；§6.3 再把长期决定回指 Step 2~14 的来源和取舍。 |
| 是否存在没有需求来源的架构设计？ | 当前主线没有。所有进入候选索引的决定都能回指正式 `00`、需求追溯矩阵、架构硬约束、横切规则、取舍或已知风险；产品名、框架、协议和参数没有进入主线。 |
| 是否存在没有架构承接的核心需求或关键约束？ | `C-CON-1~6`、`FR-CON-001~018`、`BR-CON-001~033`、`DR-CON-001~030`、接口/依赖边界、`NFR-CON-001~021` 与否决项均有对应架构承接；C5 正向 surface 和外围增强保持 conditional/pending，不被误写完成。 |
| 哪些取舍和红线必须长期可追溯？ | 单一 truth owner、SDK-only、客户端只收紧、source/freshness/coverage/availability/consistency 保真、unknown 不重放、forbidden-body 零进入、owner 局部故障、诊断不改业务语义、a11y 等价、合同门控和不引入 BFF/DB/worker/projection 均需长期可回指。 |
| 每个候选决定是否完成停审？ | §6.4 对每项检查架构层级、长期影响、来源、代价/取舍和是否新增未确认结论；均通过。正式 ADR 文件仍未建立。 |
| 是否有孤儿架构决定、孤儿需求、普通实现选择误入或新增结论？ | §6.5 未发现；旧 ADR、固定数字、技术栈、字段、状态机、数据库、实现目录和执行证据均被排除或保留为 pending。 |

## 4. 当前材料与旧文档问题诊断

| 历史材料 | 问题 | 本步处置 |
|---|---|---|
| 旧正式 `01` 顶部关联 `ADR-0008~0011` | 编号、状态和主题来自旧架构，且绑定旧页面、方法库和治理叙事，当前来源无法证明。 | 只记录为 historical material；不继承编号、状态或决定内容。 |
| 旧 §16 需求映射 | 以旧用户故事、页面和固定指标为主，无法承接新版 `C/FR/BR/DR/NFR/AC` 体系。 | 以正式 `00` 需求 ID 和当前架构章节建立新矩阵。 |
| 旧 ADR 可能把 Provider、SoA 数量、图表或技术栈视为决定 | 这些是历史合同、产品或实现偏好，不是当前长期架构决定。 | 不进入 ADR 候选；相关边界以 Step 10~14 的机制/风险结论为准。 |
| 旧目录式“需求章节 → 架构章节”对照 | 不能说明具体结论如何被结构承接，也无法暴露 pending。 | 使用固定五列表写来源、结论、承接结果、位置和成立理由。 |
| 直接创建正式 ADR 文件或编号 | 超出本步范围，且会把候选误写成评审结论。 | 只建立 `未建立` 的候选索引，不创建文件、不声明 signoff。 |

## 5. 改动前后对比与设计取舍

| 维度 | 历史口径 | 本步口径 | 原因 |
|---|---|---|---|
| 追溯主轴 | 页面、旧故事或章节目录 | 需求结论/约束 → 架构承接结果 → 正式位置 → 成立理由 | 追溯必须解释“为什么这样设计”，而不是只对照目录。 |
| ADR 范围 | 继承旧编号或把产品/实现都列入 | 只列长期影响 truth、依赖、数据、结果、恢复和演进的稳定决策候选 | 保持 ADR 的架构层级和事实诚实。 |
| pending 处理 | 通过占位字段或旧协议填补 | 在漏项表和 Step 14 风险中保持 open/blocked/read-only/conditional | 不把未闭口事项润色成决定。 |
| 外围增强 | 可能被当作核心缺口 | 进入追溯说明和漏项表的 conditional/pending，不成为当前主线前置 | 保留来源而不虚构 ready。 |
| 历史 ADR | 直接沿用 | 仅作为污染审计输入 | full-restart 不继承旧真相。 |

## 6. 结构化中间产物

### 6.1 需求追溯矩阵

| 需求来源 | 需求结论 / 约束 | 架构承接结果 | 承接位置 | 说明 |
|---|---|---|---|---|
| `00` §2、`C-CON-1`、`FR-CON-001~002`、`BR-CON-001~004` | 受保护视图和意图必须绑定正式 actor/scope；客户端 session 不是身份或授权 truth。 | 以访问语境与导航支撑单元承接外部语境引用、入口姿态和失效保护；受保护边界即时重验并 fail-closed。 | §4 职责边界；§5 系统边界与上下文；§6 限界上下文；§9 数据所有权；§10 关键交互 | 架构把 C1 的行为约束转译成外部语境接缝与客户端不可放宽的结构。 |
| `C-CON-2`、`FR-CON-003~004`、`BR-CON-005~008/018` | 入口可见性和动作资格来自正式 visibility/Policy/Gate，客户端只能收紧。 | 访问语境/资格引用与正式 owner 接缝分离；菜单、route、按钮、feature flag 和缓存不承担授权。 | §3 约束条件；§4 职责边界；§8 依赖方向；§12 备选方案；§13 横切关注点 | 该承接同时保护最小披露、直接链接和提交前资格边界。 |
| `C-CON-3`、`FR-CON-005~006`、`BR-CON-009~012`、`NFR-CON-010/013/018` | owner-safe 查询必须保留来源、多轴状态、空/缺失/过期/不可用/冲突/未知语义，且经 SDK/正式服务边界。 | 采用 owner 分区的来源保真视图、可失效安全影子和局部降级；联合视图不生成跨域 truth。 | §5 系统上下文；§6 限界上下文；§8 依赖方向；§9 数据所有权；§10 关键交互；§13 横切关注点 | 需求同时约束数据归属、一致性和通信；架构以同一 owner 分区结构承接三者。 |
| `C-CON-4`、`FR-CON-007~009`、`BR-CON-013~019`、`NFR-CON-011/014` | 草稿、提交/受理、处理中、confirmed、rejected、unknown 必须区分；unknown 无正式依据不得重放。 | 采用受控意图与结果支撑单元、请求经历/受理/正式结果分层和 reconciliation 门控。 | §6 限界上下文；§9 数据所有权；§10 关键交互；§11 关键技术选型；§13 横切关注点 | 只有 owner 正式结果收口业务完成，Console 不拥有副作用或幂等 truth。 |
| `C-CON-5`、`FR-CON-010~015`、`BR-CON-020~027` | 员工、项目/Workspace、方法、治理/evidence、审计/指标、Capability、Archive、Sandbox 是 owner 分区消费面，不是 Console truth。 | 采用管理主题组织支撑单元，按 owner 合同独立门控，安全摘要/ref 仅作为可失效影子；不合成 readiness。 | §4 职责边界；§5 系统上下文；§6 限界上下文；§7 容器/部署；§12 备选方案；§14 演进路线 | 八类主题的共同结构是消费边界和局部降级，而非统一领域模型；正向 surface pending 被保留。 |
| `C-CON-6`、`FR-CON-016~018`、`BR-CON-028~033`、`NFR-CON-004~006/019~021` | 非理想状态须可区分、局部隔离、可恢复且可访问路径等价。 | 采用韧性与可访问交互支撑单元、区域化故障、保守恢复和共享正式语义的 a11y 机制。 | §4 职责边界；§6 限界上下文；§7 容器/部署；§10 关键交互；§13 横切关注点 | C6 是跨页面闭环，但不拥有 owner 状态，也不能用视觉/诊断覆盖正式结果。 |
| `DR-CON-001~030`、`AC-DR-001~005` | Console 只拥有会话/导航/草稿/请求经历/恢复/a11y；外部数据最多为 owner-safe snapshot/ref；forbidden body 禁止进入本地或诊断生命周期。 | 采用交互真相与可失效影子分离、来源保真、正式引用和 forbidden-body 最小化。 | §3 约束条件；§6 限界上下文；§8 依赖方向；§9 数据所有权；§11 关键技术选型；§13 横切关注点 | 该映射直接保护单一 owner、最小披露和错误/日志/导出旁路边界。 |
| `IF-CON-001~013`、`DEP-CON-001~014`、`NFR-CON-007` | 业务 query/command/result/ref 必须经 `L0-sdk` 或正式服务边界；`L0-core`/`L0-sdk` 与 L1~L4 依赖类型需分层。 | 采用正式接缝与依赖倒置；编译期仅允许正式共享边界，owner 能力运行期，SDK 提示为可选协作；不直连 DB/repository/private bus。 | §5 系统上下文；§7 容器/部署；§8 依赖方向；§11 关键技术选型 | 依赖裁剪从需求接口约束转成长期方向红线，防止服务源码或私有事件反向统治核心。 |
| `NFR-CON-001~003/013~018`、`AC-NFR-001~007` | 本地交互应有界；多 owner 不得无界 fan-out；正式结果可追溯；诊断不能改业务语义；安全、幂等、观测和性能只能在 authority 内量化。 | 采用有界且可归因的交互负载、正式结果/来源追溯、最小诊断旁路和横切配置约束；数值保持 pending。 | §11 关键技术选型；§12 备选方案；§13 横切关注点；§14 演进路线；§15 风险 | 需求质量约束被转译为长期结构口径，而不是监控产品、日志字段或旧 SLA。 |
| `VETO-CON-001~007`、`AC-CON-001~007` | DB/私有 bus/本地授权/forbidden-body/receipt 成功/统一 readiness/视觉替代等越界不得通过。 | 将否决项作为依赖、数据、结果、横切、风险和 ADR 长期红线；Step 16 总审计继续检查。 | §3 约束条件；§8 依赖方向；§9 数据所有权；§10 关键交互；§13 横切关注点；§15 风险与待确认事项 | 否决项不是单一功能，而是对所有架构路径的守门条件，因此需跨章节追溯。 |
| `RISK-CON-001~014`、`CON-Q-034~047` | exact surface、scope/visibility、safe-field、reconciliation、专项 owner、状态生命周期、诊断、量化和相邻产品仍未闭口。 | 在 §15 风险/待确认表中保持具体影响、阻塞性和挂起口径；能力按 `pending/blocked/read-only/conditional` 限制，不转为 ADR 结论。 | §12 备选方案；§14 演进路线；§15 风险与待确认事项；本文件 §6.2 | 这些事项影响精确深度和正向激活，但不推翻已收稳的客户端架构骨架。 |

### 6.2 漏项检查表

| 追溯缺口类型 | 对象 / 缺口 | 影响范围 | 当前状态 | 说明 |
|---|---|---|---|---|
| 需求未被承接 | `C-CON-1~6` 与核心 `FR-CON-001~018` | Console 责任、上下文、数据、交互、横切主线 | 无缺口 | 六个能力节点均已在矩阵中连接到明确架构结果和正式章节。 |
| 需求未被承接 | `FR-CON-E01~E03` 外围增强 | 个性化、比较/评审、批量/导出边界 | 已条件化承接，非当前缺口 | 外围能力进入 Step 13~14 的演进/待确认口径，不作为核心 ready 前置。 |
| 需求未被承接 | `BR-CON-001~033` | 语境、资格、来源、结果、主题真相、降级与 a11y | 无缺口 | 规则被职责、依赖、数据、一致性、交互和横切章节承接。 |
| 需求未被承接 | `DR-CON-001~030` | Console 真相、snapshot/ref、forbidden body | 无缺口 | 数据类别、owner、生命周期上限和禁止旁路在 §9/§11/§13 明确。 |
| 需求未被承接 | `IF/DEP-CON-*` | SDK-only、compile/runtime/event 裁剪、owner 访问 | 无缺口 | §5/§7/§8 明确正式接缝和禁止穿透。 |
| 需求未被承接 | `NFR-CON-001~021`、`AC-NFR-*` | 性能/可用/安全/追溯/幂等/观测/a11y | 行为口径已承接，量化待确认 | 无 authority 的数字、矩阵和 envelope 不被伪造；行为底线已进入 §13。 |
| 架构判断缺来源 | 单一客户端交互 truth、owner 分区、合同门控、显式查询基线 | 主线运行、数据和演进 | 无缺口 | 均可回指 `G/C/FR/BR/DR/DEP/NFR` 和 Step 10~13 取舍。 |
| 架构判断缺来源 | 禁止 Console BFF/DB/worker/projection、客户端不拥有 readiness | 运行承载、依赖、truth 与演进 | 无缺口 | 来源来自 `NG/VETO/BR/DEP` 和 Step 6~8、11、13 的边界审计。 |
| 承接关系未闭合 | owner exact query/command/result/ref、safe-field、scope/visibility、reconciliation | 后续概要/详细、配置、测试和正向激活 | 保留 pending / blocks exact design | 架构只承接能力级边界，不在本步补协议、字段或幂等定义。 |
| 承接关系未闭合 | 状态介质、跨会话偏好、诊断 envelope、性能/兼容矩阵 | 后续配置、测试、实施和外围链接 | 保留 pending / conditional | 当前只给出影子失效、最小诊断、有界负载和等价目标，不声明载体或验证结果。 |
| ADR 缺口 | `L5-console` 正式 ADR 文件和评审状态 | 长期决策治理 | 候选索引已形成，正式 ADR 未建立 | 本步只提供索引和来源，不能将候选写为已评审、已批准或 signoff。 |

### 6.3 ADR 决策候选索引

| ADR 编号 | 架构决策 | 解决的问题 | 关联主线 | 说明 |
|---|---|---|---|---|
| 未建立 | Console 只拥有客户端交互 truth，外部业务/治理/执行 truth 保持 owner 单一归属 | 防止管理入口膨胀为成员、项目、治理、制品、能力、观测、归档或 sandbox 真相中心 | 职责边界 / 限界上下文 / 数据所有权 | 这是本仓存在方式和所有后续设计的根决定，长期影响页面、状态、依赖和演进。 |
| 未建立 | 通过正式 SDK/服务接缝与依赖倒置隔离 owner 和核心交互语义 | 防止 DB、repository、服务源码、私有 bus 或具体 owner 反向定义核心 | 系统上下文 / 依赖方向 / 技术机制 | 该决定长期保护 SDK-only、compile/runtime/event 裁剪和可替换接缝，不是某个 adapter 实现。 |
| 未建立 | 按 owner 分区提供来源保真的安全视图，不建立跨域业务投影 | 防止 freshness、coverage、availability、consistency 被压成整体健康、合规或 readiness | 子域划分 / 数据一致性 / 备选方案 | 该决定长期影响主题组织、局部故障、状态解释和联合视图边界。 |
| 未建立 | Console 交互真相与可失效 owner-safe snapshot/ref 分离 | 防止 session、草稿、缓存、请求经历或引用升级为业务对象和授权 truth | 数据所有权 / 一致性 / 技术机制 | 该决定规定客户端状态承载的类型上限，长期影响失效、清理和错误旁路。 |
| 未建立 | 受保护披露和提交前即时重验，无法验证即 fail-closed | 防止撤销、过期、冲突或 unknown 的旧姿态继续放行敏感内容和副作用 | 约束 / 关键交互 / 横切安全 | 该决定跨页面和直接入口保护最小披露与动作边界，不能由局部 guard 替代。 |
| 未建立 | 请求经历、即时受理姿态与 owner 正式结果分层，unknown 无依据不重放 | 防止 receipt、accepted、toast、刷新或 transport success 冒充完成 | 数据一致性 / 关键交互 / 韧性 | 该决定长期影响所有受控意图的完成语义、回查和副作用恢复。 |
| 未建立 | 同步当前交互、可选 SDK 提示与 owner 延后工作三路分离 | 防止全同步伪装长时完成，或 Console 通过 worker/consumer 接管业务任务 | 关键交互 / 容器部署 / 技术机制 | 该决定明确提示不是 truth、后台不属于 Console，长期影响通信与运行边界。 |
| 未建立 | forbidden-body 最小化与诊断旁路隔离 | 防止 credential、授权依据、raw/hidden payload、业务/证明正文经错误、日志、诊断或导出进入客户端 | 数据所有权 / 横切安全与观测 | 该决定同时约束正常、失败和外围输出路径，值得独立长期保留。 |
| 未建立 | 按 owner 的局部故障隔离与多轴状态保真 | 防止单一 owner 失败拖垮全局，或其他成功掩盖 stale/partial/unavailable/unknown | 容器部署 / 数据一致性 / 韧性 | 该决定是 Console 在多 owner 现实下保持诚实可用的长期主线。 |
| 未建立 | 可访问交互与视觉路径共享正式语义、结果和恢复上限 | 防止辅助技术路径出现不同资格、状态、确认或恢复含义 | 横切关注点 / C6 / 技术机制 | 该决定跨所有 C1~C6 核心目标，不是局部组件或样式偏好。 |
| 未建立 | 按正式合同门控、渐进激活能力，未闭口保持 pending/blocked/read-only/partial | 防止历史协议、mock、产品开关或计划把能力伪装成 integrated/ready | 备选方案 / 演进路线 / 风险 | 该决定长期控制能力进入产品边界的条件，不等同具体 feature flag。 |

### 6.4 架构决定停审记录

| 架构决定组 | 架构层级明确 | 长期影响明确 | 需求/约束/风险来源明确 | 是否新增未确认结论 | 停审结论 |
|---|---|---|---|---|---|
| 客户端交互 truth 与 owner truth 分离 | yes | yes | yes：`C/BR/DR/VETO-CON-*`、Step 2/5/8 | no | `pass` |
| SDK/正式服务接缝与依赖倒置 | yes | yes | yes：`IF/DEP/NFR-CON-007`、Step 7 | no | `pass` |
| owner 分区、来源保真和局部降级 | yes | yes | yes：`FR/BR/NFR-CON-*`、Step 8/11/12 | no | `pass` |
| 交互真相 / snapshot-ref / forbidden-body 分离 | yes | yes | yes：`DR/BR/VETO-CON-*`、Step 8/10/12 | no | `pass` |
| 即时重验、fail-closed 和客户端只收紧 | yes | yes | yes：`BR/NFR/VETO-CON-002`、Step 2/12 | no | `pass` |
| 请求 / 受理 / 正式结果 / unknown 分层 | yes | yes | yes：`BR/NFR/VETO-CON-003`、Step 8/9 | no | `pass` |
| 同步 / 提示 / owner 延后工作分离 | yes | yes | yes：`IF/DEP/NFR-CON-*`、Step 6/9/10 | no | `pass` |
| 数据最小化、诊断隔离、追溯回链 | yes | yes | yes：`DR/NFR/AC-CON-*`、Step 8/12/14 | no | `pass` |
| a11y 等价交互 | yes | yes | yes：`FR/BR/NFR/VETO-CON-006`、Step 12 | no | `pass` |
| 合同门控和渐进激活 | yes | yes | yes：`RISK/CON-Q-*`、Step 10/11/13/14 | no | `pass_with_pending_contracts` |

### 6.5 跨 ADR / 需求追溯审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 是否存在孤儿架构决定 | pass | 每个候选均回指正式需求、约束、风险或 Step 10~13 的已收稳取舍。 |
| 是否存在孤儿核心需求 | pass | `C-CON-1~6`、`FR/BR/DR/IF/DEP/NFR/AC/VETO-CON-*` 均在 §6.1 或漏项表有明确承接。 |
| 是否存在普通实现选择误入 ADR | pass | 未将框架、协议、数据库、字段、状态机、缓存、目录、测试或部署参数列为决定。 |
| 是否存在旧 ADR/技术污染回流 | pass | ADR-0008~0011、固定 38/8、旧 SLA、Provider Contract 只作历史审计输入。 |
| 是否存在 pending 被伪装为已闭合 | pass | exact surface、scope、safe-field、reconciliation、量化、诊断、兼容和外围 activation 仍 open/conditional。 |
| 是否存在需求矩阵与 ADR 职责混写 | pass | §6.1 解释来源—承接，§6.3 解释长期决策；两者不互相替代。 |
| 是否新增未确认架构结论 | pass | 本步只整理 Step 1~14 已确认内容，没有新增 owner、协议、产品或实现决定。 |
| 是否暴露追溯缺口 | pass | exact contracts、ADR 文件、量化与外围链接均显式列为 pending/缺口。 |
| 是否完成逐决定停审 | pass | §6.4 十组决定均完成层级、来源、长期性和新增结论审计。 |
| 是否伪造正式 ADR、signoff 或 readiness | pass | ADR 编号均为未建立候选，未生成文件或评审事实。 |
| 对 Step 16 的输入是否清晰 | pass | 正式装配只需按 §1~§18 组织已确认结论，保留 §15/§16 pending 和 §17 候选口径。 |

## 7. 复杂度判断

主矩阵以十组需求结论/约束为中心，覆盖六个能力节点、客户端数据边界、依赖裁剪、质量红线和风险/pending；ADR 候选十组只保留跨章节、长期影响主线的决定。漏项、停审和跨项审计足以暴露孤儿或新增结论，不需要创建正式 ADR 文件或将每个功能 ID 逐项复制到架构正文。

## 8. 正式 §16/§17 回填草稿（Step 16 才写入）

> 校准来源：
> - `design-calibration/00_req_step_16_traceability_matrix.md`
> - `design-calibration/01_arch_step_01_requirement_baseline.md`
> - `design-calibration/01_arch_step_02_goals_constraints.md`
> - `design-calibration/01_arch_step_07_dependency_direction.md`
> - `design-calibration/01_arch_step_08_data_ownership_consistency.md`
> - `design-calibration/01_arch_step_09_interactions_communication.md`
> - `design-calibration/01_arch_step_10_technology_choices.md`
> - `design-calibration/01_arch_step_11_alternatives_tradeoffs.md`
> - `design-calibration/01_arch_step_12_cross_cutting.md`
> - `design-calibration/01_arch_step_13_evolution_roadmap.md`
> - `design-calibration/01_arch_step_14_risks_open_questions.md`
> - `design-calibration/01_arch_step_15_adr_traceability.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“需求追溯矩阵”“漏项检查表”“ADR 决策候选索引”和“跨 ADR / 需求追溯审计”，了解每项主线决定的来源、长期影响和未闭口边界。

正式 §16 应摘录 §6.1 的来源—承接矩阵与 §6.2 的漏项结论；正式 §17 应摘录 §6.3 的候选索引并保留“正式 ADR 尚未建立”口径。正文不得继承旧 ADR 编号或状态，不得把候选索引写成批准、实现、signoff 或 readiness。

## 9. 待确认事项（本 Step 自身）

| 待确认项 | 当前处理口径 | 当前状态 |
|---|---|---|
| 正式 ADR 文件命名、评审流程和编号 authority | 仅保留“未建立”的候选索引，不创建文件、不发明编号。 | `open / non_blocking_for_step_16` |
| 正式 §16 是否按功能逐行展开还是保留架构级分组 | calibration 保留分组矩阵与漏项审计；Step 16 只在不丢来源和状态的前提下压缩。 | `open / assembly_granularity_pending` |
| 外围增强与 C5 positive surface 在正式追溯中的展示粒度 | 保留 conditional/pending 状态，不转成核心完成。 | `open / non_blocking` |

本 Step 自身未发现阻塞 Step 16 的问题；上述事项只影响正式装配粒度和 ADR 管理载体，不改变已收稳的架构主线。

## 10. 自检、三层门禁与进入 Step 16 条件

### 10.1 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否建立来源—承接—位置—理由矩阵 | pass | §6.1 使用固定五列表，不是章节目录对照。 |
| 是否显式暴露追溯缺口 | pass | §6.2 保留 exact contract、量化、兼容、诊断和 ADR 文件缺口。 |
| 是否明确 ADR 进入标准 | pass | 仅收纳架构层、长期影响且值得单独理解的决定。 |
| 是否完成每项决定停审 | pass | §6.4 十组决定逐项检查。 |
| 是否避免普通实现选择进入 ADR | pass | 无框架、协议、数据库、字段、组件、测试或部署参数。 |
| 是否避免旧 ADR 直接继承 | pass | 旧 ADR 仅作 historical material。 |
| 是否保留 pending/conditional | pass | C5、外围、exact surface、量化、兼容与正式 ADR 均未伪造闭合。 |
| 是否新增需求或架构结论 | pass | none。 |
| 是否伪造 ADR、signoff、readiness 或执行证据 | pass | none。 |
| 正式 `01` 是否被提前写入 | pass | 仅创建 Step 15 calibration。 |

### 10.2 三层门禁

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step / 模块级 | `pass` | 需求追溯、漏项、ADR 候选与逐决定停审均完成，未发现孤儿或新增未确认结论。 | 更新 flow 与项目台账，激活 Step 16。 |
| 文档级 | `pass_to_step_16` | §16/§17 回填基础已形成；正式 `01` 仍不可写入，待最终装配。 | 读取 Step 16 SOP / 书写规范并创建 `01_arch_step_16_formal_document_assembly.md`。 |
| 项目级 | `pass_with_open_contracts` | exact owner contract、scope、safe-field、reconciliation、量化、诊断、兼容、ADR 文件和外围 link 仍 pending，但不阻塞正式架构装配。 | 进入 Step 16；装配后立即停审，不进入 `02`。 |

本步 `pass` 只表示设计静态校准通过，不表示实现、测试、集成、用户 signoff 或 readiness 已发生。
