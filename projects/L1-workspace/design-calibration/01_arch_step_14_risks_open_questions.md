# 01 架构 Step 14：风险与待确认事项

## 1. Step 状态

状态：completed / stop_review；模式：full-restart；对应 SOP：架构 SOP Step 14。
开工确认：项目台账、flow、前序 Step 已读；三层门禁允许当前 Step。formal_01_write_allowed 仍关闭。

### Step 内计划

- [x] 读取输入和前序结论：见 §2。
- [x] SOP 问题回答：见 §3。
- [x] 当前材料诊断：见 §4。
- [x] 设计取舍：见 §6。
- [x] 结构化中间产物。
- [x] 复杂度判断与按单元停审。
- [x] 回填草稿。
- [x] 自检与进入下一步条件。

模块骨架：not_applicable。未来 Step 不创建。

## 2. 本步输入

Step 1~13、project_execution_ledger §4；上游 flow/正式文档复核表；架构规范 §4.15；共同输入：正式 00、项目台账、架构 flow 的来源复核表、架构 SOP 对应 Step、书写规范对应章节、中间产物规范和真相源闭环标准。前序产物的未闭合 seam 仍保留。

## 3. SOP 问题回答

1. 已识别风险是什么？来源契约不足造成不完整/无法恢复，visibility 不闭合导致潜在泄露，attention/游标混用导致局部体验失真，跨域写或下游反定义带来越权。
2. 影响哪层？U1/U2 权限和范围、U3/U5 连续性、U4 attention、U6 消费交接。
3. 当前能否收束？可固定 owner、原子边界和失败上限；不能承诺 exact schema、真实集成或 readiness。
4. 待确认有哪些？WS-UP-001~008 的具体 owner 查询/事件/版本/权限/attention/ref/export/schema；增加 seed owner 作为已有下游 seam 的关联子项，不声称 live view owner 能关闭它。
5. 谁关闭？owning 项目；本仓只能描述需要的消费性质，不能实现或发明上游方法。
6. 回流怎么处理？写权限限制于本项目；本地登记 owner flow/ledger 待回流，不声称已经回写或通知。
7. 哪些不阻塞 01？外部 exact schema、部署/负载未定只阻塞受影响正向承诺；局部架构若仍有双真相/反写则必须修复才可装配。

## 4. 当前文档问题诊断

已有 WS-UP-001~008 太概括，需要按 owner 入口和解锁证明细化；上游部分项目没有项目台账，不能把不存在的文件写作已回写目标。L2 的 00 可能保留当时兄弟项目进行中叙述，以当前项目台账和最新正式 07 判定阶段，不改外部历史文档。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 当前架构主题 | 正式 01 未创建，draft 只作候选 | 由本步输入独立收束后进入 §7 | 阻止历史草稿升级为真相 |
| 外部依赖 | 00 已登记 pending/blocker | 保留 owner 和解锁条件 | 不以架构补外部合同 |

## 6. 设计取舍

| 方案 | 优点 | 代价 | 结论 |
|---|---|---|---|
| 已知风险与缺失确认分别列，隔离不可执行 seam | 架构可审查且不伪造 ready | 下游落码仍需闭包 | 采用 |
| 全部 blocker 标已解决以完成 01 | 无表面阻塞 | 没有 owner authority | 禁止 |

## 7. 结构化中间产物

### 7.1 架构风险

| 风险项 | 影响范围 | 当前处理口径 | 是否阻塞 | 说明 |
|---|---|---|---|---|
| AR-WS-01 来源覆盖无法证明 | U2/U3/U6 | 每源保留版本/coverage，不完整即 partial/blocked | 有条件阻塞正向集成 | WS-UP-001，非架构 owner 冲突。 |
| AR-WS-02 事件衔接和重放不确定 | U3/U5 | 连续 cursor 与候选隔离；无基线接续不切换 | 阻塞未闭合恢复路径 | WS-UP-002；bus preparation 不等于 executor。 |
| AR-WS-03 权限来源/时效缺口 | 所有读分区及元信息 | 只能消费 owner 正式决定，失效 fail-closed | 阻塞受影响可见结果 | WS-UP-003/005；不能由 workspace 私造 allow。 |
| AR-WS-04 attention 与局部状态混用 | U4 | owner 明示 attention；local overlay 独立 | 阻塞不明 attention 正向路径 | WS-UP-004；read 不等于业务完成。 |
| AR-WS-05 下游/静态资产反向定义 truth | U1/U5/U6 | archive 为消费者；seed/live/执行主语分开 | 阻塞扩展承诺 | WS-UP-006/008 与 MI-UP-006。 |
| AR-WS-06 共享契约或技术实现被假定存在 | 接缝/编译/证据 | 仅保留 Core 候选，fake 不证明集成 | 阻塞具体落码/交付声明 | WS-UP-007，无已实现符号证据。 |
| AR-WS-07 多实例与保留范围破坏恢复 | U3/U5 | 本地原子、写入栅栏、去重/恢复范围相容 | 有条件阻塞规模扩展 | 未有 workload/存储决策，不能发量化 baseline。 |

### 7.2 待确认事项

| 待确认事项 | 影响范围 | 缺失确认 | 当前挂起口径 | 说明 |
|---|---|---|---|---|
| WS-UP-001 owner-safe query/summary | U2/U6 | 各域正式安全读取、source version、水位、覆盖证明 | source 逐域 pending，不能猜字段 | 已有业务 query 不自动满足 workspace 消费合同。 |
| WS-UP-002 event/cursor/replay/baseline | U3/U5 | 事件身份/顺序、重复判定、缺口检测、基线切点和 replay 范围 | 无衔接证明则 blocked | bus preparation ready 不证明实际重放可用。 |
| WS-UP-003 visibility owning chain | U1~U6 | principal/scope 决定来源、绑定、一致性、撤销和有效性 | 受影响内容及元信息 fail-closed | governance 不自动成为所有域的统一授权 owner。 |
| WS-UP-004 attention input | U4 | 明示事件/查询、稳定 identity、生命周期与去重规则 | 不自行产生 Inbox 事实或业务优先级 | unread 只基于可证明条目和局部读意图派生。 |
| WS-UP-005 Personal/Project safe refs | U1 | GlobalMember/Project/ProjectMember 解析及 scope 关系 | 不解析字符串或从投影反推 | scope 概念已定，exact contract 未定。 |
| WS-UP-006 read/export consumer contract | U6 | SDK/product/sync/archive 的版本、分页与安全读取约定 | 不定义下游私有状态，不声明 accepted | archive 仍需串行后续。 |
| WS-UP-006-S seed 关联边界 | 镜像静态输入边界 | member-images MI-UP-006 的 seed/template 正式 owner | 不把 live workspace 作为默认静态 seed 来源 | 原 owner 未定；不是新授予 workspace 的职责。 |
| WS-UP-007 Core 专用 type/error/event | 跨仓契约与编译 | 是否纳入 Core、正式符号/版本及事件授权 | 不建 shadow schema；不预发 workspace event | 架构术语不是公开类型。 |
| WS-UP-008 非项目执行主语 | 下游执行边界 | owning execution subject 正式定义 | workspace 不执行，个人视图可存在但不能创建独立宿主 | 不阻塞 Personal read-model 概念。 |

### 7.3 架构完成上限

上述项不阻塞 owner、局部原子边界、no-write 与保守姿态的架构定论；阻塞 exact schema、相关正向联调、可落码交接、量化 baseline 与真实 readiness。正式 01 完成不等于上游关闭，也不等于整体 00~07 完成。

### 7.4 Owning 项目待回流登记（未执行外部写入）

| 事项 | 正式依据 | 目标 flow / ledger | 所需闭合证明 | 回流状态 |
|---|---|---|---|---|
| WS-UP-001/003/004/005 | identity/work/conversation/process/governance/artifact 正式 00/01 输入与数据边界；各 owner 03 的查询/事件面 | 对应 owner `design-calibration/01_architecture_calibration_flow.md` 与 `03_ddd_calibration_flow.md`（实际目标需 owner 确认） | 每来源 query/visibility/event/attention 是否适用于 workspace；无则由 owner 定义 | pending_owner_coordination；未写入 |
| WS-UP-002 | L0-bus `07-实施计划.md` PH-06、`06-验收标准.md` AC-FUNC-005 | `projects/L0-bus/design-calibration/07_implementation_plan_calibration_flow.md` | preparation 与 replay executor 的边界；各 owner baseline/变化衔接证明 | pending_owner_coordination；未写入 |
| WS-UP-006 | L0-sdk 正式访问边界；全局 §4.1 | `projects/L0-sdk/design-calibration/01_arch_calibration_flow.md`；archive 后续项目 flow 尚不创建 | read/export 输入条件、分页/版本/visibility 消费约定 | pending_downstream；未写入 |
| WS-UP-006-S | member-images `02-概要设计.md` §3、`03-详细设计.md` MI-UP-006 | `projects/L2-member-images/design-calibration/project_execution_ledger.md` | seed/template owner 正式裁决；live state 排除 | pending_owner_decision；未写入 |
| WS-UP-007 | L0-core `00-需求文档.md` §6 | `projects/L0-core/design-calibration/01_arch_calibration_flow.md` | shared symbol/event/error contract 正式来源 | pending_owner_coordination；未写入 |
| WS-UP-008 | member-service 正式 00 NG-MS-012 / 01 HC-MS-002；member 03 L2M-UP-008 | `projects/L2-member-service/design-calibration/project_execution_ledger.md`、`projects/L2-member/design-calibration/project_execution_ledger.md` | 如范围扩展需 execution owning authority 裁决 | 当前项目型约束保留；未写入 |

以上是本项目待回流材料，不是已发消息或已修 owner 的证明。部分早期项目没有 project_execution_ledger，不能代造台账；本轮只在授权目录内写入。

## 8. 回填草稿

正式 §15 承接 §7 已收束的表、图和结论；图注随图一起回填。不复制 §3~6 的讨论过程。

复杂度判断：风险与待确认分开；具体回流目标保留在本 Step 校准附录，不进入正式正文。

## 9. 待确认事项

WS-UP-001~008 仍保持 open；exact query/event/ref/visibility/cursor/export 和共享 schema 必须由 owner 关闭，不由本 Step 补全。

## 10. 进入下一步条件

每个 blocker 有影响范围与保守姿态；未把外部缺口写成局部事实；所有风险都能回指前序 Step。

写入前检查：模块思考已完成，结构化结论仅整理 §3/6；正式回填草稿无新增协议。
思考记录 = done；写入记录 = done；自检状态 = done；gate_status = pass；gate_reason = 本步架构结论可引用，未闭合外部能力已隔离为 blocker；next_allowed_action = 进入 Step 15。
本 pass 只指设计静态自检，不是测试、集成、证据、用户 signoff 或 readiness。
