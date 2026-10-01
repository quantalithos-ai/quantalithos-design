# L5-chat 02 · Step 14 正式概要设计文档装配

> Step 状态：`done`
> gate_status：`pass`
> 本步主题：按《概要设计书写规范》§1～§14 重组已收敛的 Step 1～13 结论，完成 full-restart 正式文档重建；不新增未经讨论的设计主语，不进入 `03`。
> 生成依据：`standards/document/概要设计讨论流程_SOP.md` Step 14；`standards/document/概要设计书写规范.md` §3～§4.14；Step 1～13 中间产物。

## 1. Step 内计划

| 子阶段 | 产物 | 状态 | 门禁 |
|---|---|---|---|
| 输入确认 | Step 1～13、前序正式 00/01、旧 02 历史材料 | `done` | Step 1～13 均为 `done/pass`；旧 02 只作 historical material |
| 章节装配 | §1～§14 回填矩阵与术语表 | `done` | 每章有具体 calibration 来源；不新增结论 |
| 正式重建 | 删除旧 02 后按新版主链写入 | `done` | 已按新版主链重建 |
| 静态审计 | 结构、来源、反查、边界和禁写项审计 | `done` | 静态审计通过 |
| 停审记录 | flow、台账和本文件收口 | `done` | 已切换文档级 stopped，不创建或启动 03 材料 |

## 2. Step 1～13 输入与正式章节映射

| 正式章节 | 主要校准输入 | 装配口径 |
|---|---|---|
| §1 与上游文档的关系声明 | `02_hld_step_01_upstream_boundary.md` | 只写承接关系、不再回答和必须回答；不复制上游摘要。 |
| §2 本次设计目标与范围 | `02_hld_step_02_scope.md` | 写结构目标、交付给 03 的结果和非范围。 |
| §3 约束条件 | `02_hld_step_03_constraints.md` | 写影响对象、接口、流和状态的硬约束。 |
| §4 代码主体框架总览 | `02_hld_step_04_code_skeleton.md` | 保留两张规定图、分层关系和关键判断；不写目录或实现。 |
| §5 主要组成部分、职责与边界 | `02_hld_step_05_components_boundary.md` | 保留 7 个主要组成部分、对象发现维度、交互图和独立小节。 |
| §6 关键对象轮廓 | `02_hld_step_06_key_objects.md` | 逐一正式化已筛选对象；字段和函数停在概要骨架。 |
| §7 API / 接口骨架 | `02_hld_step_07_api_outline.md` | 按 Command、Query、Inbound Event Consumer、Outbound、Operations 分类。 |
| §8 关键处理流 / 重要函数数据流 | `02_hld_step_08_processing_flows.md` | 收纳 P0 Command、变化/结果 Consumer、恢复、预览、持久化和清理流。 |
| §9 状态定义与状态流转 | `02_hld_step_09_state_machine.md` | 收纳客户端多轴状态、迁移、传播和禁止迁移；不制造 owner 状态机。 |
| §10 异常与边界场景轮廓 | `02_hld_step_10_exceptions_boundaries.md` | 只列影响结构成立性的异常和保守口径。 |
| §11 配置影响轮廓 | `02_hld_step_11_config_impact.md` | 只写影响类别、禁止配置化边界和 03/04 承接。 |
| §12 详细设计承接清单 | `02_hld_step_12_ddd_handoff.md` | 固定 03 的稳定输入和主语变更回退规则。 |
| §13 设计风险与待确认事项 | `02_hld_step_13_risks_open_questions.md` | 风险与待确认分表；保留 inherited blockers。 |
| §14 参考 | 本 Step 的实际阅读材料 | 只列实际用于本次装配和校验的正式材料。 |

## 3. 旧正式 02 的 historical 差异审计

| 旧材料特征 | 处理决定 | 原因 |
|---|---|---|
| 旧文档以“先用人话理解本仓”、背景、量化指标和需求概要开篇 | 不沿用；改由新版 §1～§3 承接已停审 00/01 的结论 | 旧结构回滑到需求层，且部分数字没有当前 authority。 |
| 旧文档把 ChatThread、ChatReplyState、VisibleMemberCard 等名称写成稳定对象 | 不沿用旧对象名；使用 Step 5/6 正式化的 Chat-local 对象和 owner-safe 引用 | 避免把 owner truth 或历史候选名固化为 Chat entity。 |
| 旧文档将 `conversation`、`runtime`、`member`、`artifact`、`observability` 写成直接模块交互 | 改写为经 `L0-sdk` 的 query/command/event/ref/change/resume 能力类别 | Chat 不直连 owner 私有接口或内部 bus。 |
| 旧文档出现 AG-UI、SSE、WebSocket、具体 UI 框架和外部协议倾向 | 不作为正式协议或技术定论 | SDK exact transport 和平台载体仍是 blocker；概要层只保留正式能力 seam。 |
| 旧文档写入 SLA、性能数字、容量规划、ready/integrated 等措辞 | 删除或降为待确认/风险 | 当前 02 不产生未经 authority 的质量数字、运行事实或 readiness。 |
| 旧文档混合需求、架构、概要和详细实现表达 | 按新版 §1～§14 full-restart 重建 | 保持概要设计在可实现结构骨架层。 |

旧文件只用于差异审计，不作为新版正文的事实来源；正式写入前删除旧文件，再创建同名文件。

## 4. 正式章节装配与术语统一

### 4.1 章节装配规则

- 正式正文只承载 Step 1～13 已收口的结论；SOP 问题回答、历史诊断、取舍过程、自检和门禁记录留在本目录的中间产物。
- 每个正式章节开头显式列出具体 `design-calibration/02_hld_step_*.md` 来源，并说明延伸阅读小节。
- §5 只按主要组成部分组织；§6 只按关键对象组织；不交叉复制成两套对象定义。
- §7 只写接口骨架；§8 才写处理流；§9 才写状态定义和迁移。
- §11 不写配置项、默认值、JSON、部署参数；§13 不把待确认事项润色成定论。

### 4.2 统一术语表

| 统一术语 | 使用口径 | 禁止替代 |
|---|---|---|
| 主要组成部分 | §5 的 7 个业务结构主语 | 不用“模块”代替其全部语义，不用代码目录名代替 |
| 关键对象 | §6 已筛选并正式化的 Chat-local 对象 | 不把 owner DTO、HTTP body 或后端原始响应当 Chat 对象 |
| owner truth | 各正式 owner 持有的领域事实 | 不写成 Chat truth 或缓存事实 |
| safe material / owner-safe | 带可见性、来源、新鲜度边界的展示材料 | 不扩展为正文、凭据、raw log 或未脱敏 payload |
| formal change / result / resume | 经 SDK 暴露的正式变化、结果和恢复能力 | 不用 transport ACK、websocket ACK 或 UI toast 替代 |
| confirmed | `CommandResultGate` 经正式 owner receipt/result/change 门控后的客户端姿态 | 不表示按钮点击、提交成功或连接成功 |
| unknown | 副作用结果无法判定的客户端姿态 | 不自动重放命令 |
| stale / gap / blocked / unavailable | 缺少连续性、授权或能力时的保守姿态 | 不润色为 fresh、ready、verified |

## 5. 对象、接口、处理流、状态和配置影响交叉引用审计

| 反查起点 | 必须在后文找到 | 审计口径 |
|---|---|---|
| §5 主要组成部分 | §6 对象、§7 接口、§8 流程、§9 状态 | 7 个部分各自的主语均能落到至少一个对象或结构接缝；不承担项保持可见。 |
| §6 关键对象 | §7/§8/§9 的使用位置 | 对象名称、字段类型和状态姿态保持一致；不在后文隐式发明同义对象。 |
| §7 接口 | §8 处理流与 §9 状态影响 | 每个 P0 Command、状态改写 Consumer 和恢复/清理 Job 都有相应流或说明。 |
| §8 处理流 | §6 对象、§7 接口、§9 状态 | 处理流中的对象、入口和状态均已在前文正式化。 |
| §9 状态 | §8 触发来源、§10 边界、§11 配置禁线 | confirmed/fresh/visible 等状态均有正式来源条件，不能由宿主反馈生成。 |
| §11 配置影响 | §3 约束、§9 状态、§12 03 承接 | 配置只选择允许 profile，不改变 invariant、owner boundary 或状态红线。 |

## 6. blocker 保留审计

| blocker | 正式文档保留位置 | 不得写成 |
|---|---|---|
| `CHAT-UP-001` SDK exact surface | §1、§7、§8、§13 | 已接通的 SDK 方法、DTO、schema 或 transport |
| `CHAT-UP-002` Conversation visibility/cursor/change/resume | §3、§8、§9、§10、§13 | 由连接、时间戳或缓存推断 fresh/continuous |
| `CHAT-UP-003` Governance receipt/result/idempotency | §7、§8、§9、§13 | 点击即审批成功或本地生成 Decision |
| `CHAT-UP-004` Artifact safe preview/ref | §5、§6、§8、§10、§13 | raw body、未授权下载或正文缓存 |
| `CHAT-UP-005` Workspace safe view/export | §5、§8、§10、§13 | Chat 自建跨域 Inbox/projection/export truth |
| `CHAT-UP-006` Identity/Work/Member/Runtime summary | §5、§6、§10、§13 | 统一生命周期、完成度或授权结论 |
| `CHAT-UP-007` Observability handoff | §5、§7、§8、§10、§13 | 前端 log/evidence/audit backend 写入 |
| `WS-UP-001~008` Workspace contracts | §1、§8、§10、§13 | 候选字段升级为 Workspace truth |
| `OPEN-CHAT-*` 平台、存储、质量和证据 authority | §11、§13、§14 | readiness、兼容或性能承诺 |

## 7. 正式写入前三级门禁检查

| 门禁层 | 检查项 | 结论 |
|---|---|---|
| 项目级 | 项目台账允许继续完成 `02`；修改范围仅为 `projects/L5-chat/`；不进入 `03` | `pass` |
| 文档级 | 写入前已确认 Step 1～13 为 `done/pass`；写入后 Step 14 与文档级状态均切换为 `done/stopped` | `pass` |
| Step / 模块级 | 本 Step 具备章节映射、历史差异、术语、反查、blocker 和静态审计计划；正式写入不新增结论 | `pass` |

## 8. 正式文档重建记录

执行顺序固定为：

1. 删除旧 `projects/L5-chat/02-概要设计.md`，使 full-restart 可审计。
2. 按《概要设计书写规范》§1～§14 创建同名正式文档。
3. 将每章回填为收口结论，并在章首写具体 calibration 来源与延伸阅读。
4. 运行静态文本审计：章节连续性、来源覆盖、对象/接口/流程/状态反查、禁止项和 blocker 姿态。
5. 审计通过后把本 Step、flow 和项目台账切换为文档级 `stopped`。

本记录不代表代码、运行、测试、证据、验收或 readiness 已发生。

## 9. 正式写入后的静态审计记录

正式文档写入后的静态审计结果如下：

| 审计项 | 预期判定 |
|---|---|
| §1～§14 连续存在且顺序正确 | `pass`；章节检查显示修订记录后连续存在 §1～§14。 |
| 每章均有具体 Step 文件来源和延伸阅读 | `pass`；14 章均有对应 `02_hld_step_*.md`。 |
| §5 的 7 个主要组成部分可反查到 §6～§9 | `pass`；7 个部分均有对象、接口、处理流和状态承接。 |
| §6 对象名称可反查到 §7/§8/§9，未出现隐式新对象 | `pass`；25 个关键对象均可反查，owner 对象明确排除。 |
| §7/§8 未出现 HTTP path、完整 DTO/schema、topic 或内部 bus | `pass`；仅在禁止事项中说明不得直连，不固化协议。 |
| §9 未把 owner domain state 重新定义为 Chat truth | `pass`；只定义客户端多轴状态。 |
| §10/§13 保留 fail-closed、unknown、stale、gap、blocked、unavailable、needs-action | `pass` |
| §11 未写配置项、默认值、部署参数或热更新细节 | `pass` |
| §14 只列实际使用材料 | `pass`；列出规范、已停审 00/01、专项上游和本次 Step 文件。 |
| 没有实现、测试结果、commit、验收或 readiness 声明 | `pass`；文档只声明设计骨架和停审状态。 |

## 10. 停审门禁结论

正式 `02-概要设计.md` 完成后：

- Step 1～14 均标记 `done`，`gate_status = pass`。
- 文档级状态切换为 `stopped`。
- `03-详细设计.md` 保持 `not_started/blocked`，不创建新的 `03` 校准流或 Step 文件。
- 上游 blocker 继续保留在正式 §13、flow 和项目台账中。
- 不实现代码、不执行测试、不伪造运行或证据、不提交 commit。

## 11. Step 自检与门禁

| 检查项 | 结论 |
|---|---|
| 是否只做重组、润色、统一术语和交叉引用？ | 是。 |
| 是否按新版 §1～§14 full-restart 重建？ | 是。 |
| 是否把历史旧结构、协议偏好和无 authority 数字排除？ | 是。 |
| 是否保留未闭合合同的 blocker 姿态？ | 是。 |
| 是否在正式完成后立即停审而不进入 03？ | 是。 |

Step 14 已完成正式文档写入和静态审计，最终门禁为 `pass`。本 Step、flow 和项目台账均已切换为文档级 `stopped`；不创建、不启动 `03`。

## 2026-10-01 当前逐章修复装配与审计计划

本轮覆盖旧删除重建执行指令：依据用户逐章修复要求，保留现有正式02，Step1～13已顺序原位回填，旧full-restart记录仅historical_material。当前只统一引用/术语/编号/章节来源，不新增分析，不进入03。

输入：当前Step1～13及Step14 SOP/规范§4.14；补读冻结原型三记录核对体验与证据声明。直接基线为修复后00/01；规范路径改为设计真相源闭环与可落码性标准。Process参考指向实际用于权属复核的01/02，不声称SDK消费已可用。

装配修正：正式§1～14保留具体Step来源；§6新增对象独立节和候选池，§7接口分类及局部入口，§8新增独立流，§9分轴迁移与传播，§10异常，§11禁配，§12稳定骨架/待确认能力分立，§13新增风险挂起。统一GovernanceIntentCoordinator/CommandResultCoordinator为既有UserIntentCoordinator、RestorationViewModel为RecoveryViewModel、ArtifactPanel展示输出为PreviewReference/SafeMaterialSnapshot；既有策略角色归属在§6.35说明，避免新同义对象。

审计计划：检查章节/小节编号、Markdown fences、Step来源实际存在、对象与API/流同名、流程标题类别、有效验收编号、规范与原型路径、blocked保留及台账停审一致性。纯文档静态核对，不build/run/test；检查结果随后登记，不预写通过。

## 当前静态审计结果与停审（2026-10-01）

| 检查 | 实际文档检查结果 |
|---|---|
| 正式章节 | §1～14连续，无重复二级小节；3683行附近（后续术语整理可能改变行数），不是实现规模证据 |
| Markdown结构 | 82个fence边界闭合，无残留patch前缀 |
| 校准来源 | 14个具体Step引用全部存在 |
| 主体/API/流 | 32个独立关键对象；43个接口/consumer/job/局部入口均有§8独立流或复用/未独立理由；30个规范化独立处理流标题 |
| 引用 | 完整规范/原型路径存在，错误真相源规范路径已修；Process参考为实际权属复核01/02 |
| 术语 | 旧GovernanceIntentCoordinator/CommandResultCoordinator/RestorationViewModel已统一；新增流精确标记类别；receipt/optimistic/context/source-local分立 |
| 编号authority | CHAT-BASE001继续open，未使用未定义AC-NFR008～024作为已成立验收；NFR与AC不互换 |
| blocker | CHAT-UP001～009、WS-UP001～008、OPEN-CHAT及质量authority保留，正向projection/关系/目录未闭合blocked |
| diff whitespace | git diff --check -- projects/L5-chat/02-概要设计.md无输出 |
| 写入范围 | 现有02、既有flow、14个既有Step及本项目台账；未改00/01/03、原型或上游正式文档 |

以上为真实文本检查，不是代码测试、SDK集成、AT验证或验收结果。第一次API扫描发现两个handoff意图仅被统称，已改覆盖表为精确名称并再次检查；未掩盖发现项。项目/文档/Step三层门禁收口：当前授权覆盖02，前序Step1～13已顺序done，Step14术语/引用/交叉检查完成，章节gate pass；正式02 v1.1.0-chapter-reviewed stopped_after_02。所有正向能力合同仍blocked/pending，不产生readiness。

下一阅读（须后续授权）：修复后02、旧03差异、03 SOP/书写规范、Process投影/关系/目录/SDK正式合同及必要台账。当前立即停止，不进入03、不实现、不安装、不build/run/test、不提交commit。

最终回查：43个接口/consumer/job/局部入口均在§8精确提及或有理由，缺失列表为空；14章、14Step来源及flow/ledger停审一致。ContinuityState成员函数部分覆盖与unknown探测failed口径同步至Step6/8；这些仅统一现有状态结论。正式02停审，不进入03。
