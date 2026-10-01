# L5-chat 02 概要设计校准流程

> 文档类型：`02-概要设计.md`
> 当前模式：`regression-review + single-agent-serial`；前轮full-restart保留为历史记录。
> 生成流程：`standards/document/概要设计讨论流程_SOP.md` Step 1～14
> 结果结构：`standards/document/概要设计书写规范.md` §1～§14
> 当前状态：`stopped_after_02`；2026-10-01 用户授权的现有02逐章修复Step1～14已完成，当前停审，不进入03。
> 修改范围：只允许修改 `projects/L5-chat/`；不实现代码、不修改 SDK 源码或其他项目正式文档、不执行测试、不提交 commit。

## 1. 执行状态台账

### 当前逐章修复记录（2026-10-01）

本轮保留现有正式文档和中间产物，串行执行 Step 1～14；下方旧 done/pass 表仅为 historical_material。本轮授权覆盖现有章节修复，不执行旧流程中的删除重建操作。

| Step | 当前状态 | 回填 | 门禁与下一动作 |
|---|---|---|---|
| 1 | done | §1 | pass；Process/原型来源已补，合同未关闭 |
| 2 | done | §2 | pass；范围补齐，未确认能力blocked |
| 3 | done | §3 | pass；来源隔离和确认条件收稳 |
| 4 | done | §4 | pass；依赖倒置及页面主体补齐 |
| 5 | done | §5 | pass；七部分独立停审及跨部分审计完成 |
| 6 | done | §6 | pass；独立对象、边界类型和七部分审计完成 |
| 7 | done | §7 | pass；八新增Query及局部入口、七部分归属完成 |
| 8 | done | §8 | pass；独立流补齐及七部分覆盖审计完成 |
| 9 | done | §9 | pass；状态分轴和迁移/传播复核完成 |
| 10 | done | §10 | pass；九类新增边界映射完成 |
| 11 | done | §11 | pass；viewer/目录/隔离影响与禁配项补齐 |
| 12 | done | §12 | pass；新增主体/契约方向和证据边界补齐 |
| 13 | done | §13 | pass；新增四风险/四待确认，合同仍open |
| 14 | done | §14/全篇 | pass；引用/主语/状态/Step同步静态审计完成，stopped_after_02 |

### 前轮历史记录

| Step | 概要主题 | 输出文件 | 回填章节 | 状态 | gate_status | gate_reason | 下一动作 | blocker |
|---|---|---|---|---|---|---|---|---|
| 1 | 确认上游输入边界 | `02_hld_step_01_upstream_boundary.md` | §1，并为 §2/§3 提供输入 | `done` | `pass` | 已形成上游关系映射、本文不再回答/必须回答清单，未闭合合同保持 blocker | 创建并执行 Step 2 | inherited `CHAT-UP-*` / `WS-UP-*` |
| 2 | 明确本仓设计目标与当前范围 | `02_hld_step_02_scope.md` | §2 | `done` | `pass` | 已收稳结构目标、详细设计交付、Desktop-first 范围和非范围；未扩大到未闭合 owner/SDK 能力 | 创建并执行 Step 3 | inherited blockers |
| 3 | 收稳约束条件 | `02_hld_step_03_constraints.md` | §3 | `done` | `pass` | 已形成 C-01～C-18 结构性约束、后续章节影响和禁止配置化边界 | 创建并执行 Step 4 | inherited blockers |
| 4 | 代码主体框架映射 | `02_hld_step_04_code_skeleton.md` | §4 | `done` | `pass` | 已形成架构模块映射图、实现分层视图和主体/分层反查；未写目录、协议或实现 | 创建并执行 Step 5 | SDK surface pending |
| 5 | 主要组成部分、职责与边界 | `02_hld_step_05_components_boundary.md` | §5 | `done` | `pass` | 7 个主要组成部分均已逐一停审；对象候选池、交互总图和跨部分闭环审计已通过 | 创建并执行 Step 6 | SDK/owner safe surface pending |
| 6 | 关键对象轮廓 | `02_hld_step_06_key_objects.md` | §6 | `done` | `pass` | 关键对象已从 Step 5 候选池逐一正式化；字段/状态/函数停在概要层，Step 8/9 反查无遗漏 | 创建并执行 Step 7 | owner DTO/ref contracts pending |
| 7 | API / 接口骨架 | `02_hld_step_07_api_outline.md` | §7 | `done` | `pass` | Command/Query/Event/Outbound/Operations 分类、对象承接和边界审计已通过 | 创建并执行 Step 8 | `CHAT-UP-001~006` |
| 8 | 关键处理流 / 重要函数数据流 | `02_hld_step_08_processing_flows.md` | §8 | `done` | `pass` | 关键 Query、P0 Command、变化/结果 Consumer、恢复/探测、预览和清理流已独立展开并通过跨流审计 | 创建并执行 Step 9 | SDK result/change/resume pending |
| 9 | 状态定义与状态流转 | `02_hld_step_09_state_machine.md` | §9 | `done` | `pass` | 多轴客户端状态、允许/禁止迁移和传播关系已通过；无 owner domain state 被 Chat 重新定义 | 创建并执行 Step 10 | owner state/event semantics pending |
| 10 | 异常与边界场景轮廓 | `02_hld_step_10_exceptions_boundaries.md` | §10 | `done` | `pass` | 关键异常已映射到部分/对象/接口/状态；保持 fail-closed/unknown/stale/gap/cleanup 口径 | 创建并执行 Step 11 | inherited blockers |
| 11 | 配置影响轮廓 | `02_hld_step_11_config_impact.md` | §11 | `done` | `pass` | 配置影响、禁止配置化边界和 03/04 承接方向已通过；未写配置项/默认值/部署细节 | 创建并执行 Step 12 | platform/SDK config contracts pending |
| 12 | 详细设计承接清单 | `02_hld_step_12_ddd_handoff.md` | §12 | `done` | `pass` | 已明确 03 稳定输入、继续展开方向和主语变更回退规则 | 创建并执行 Step 13 | inherited blockers |
| 13 | 设计风险与待确认事项 | `02_hld_step_13_risks_open_questions.md` | §13 | `done` | `pass` | 风险与待确认事项已分开收口；未闭合合同保持 pending/blocked/deferred/unknown | 创建并执行 Step 14 | inherited blockers |
| 14 | 整理正式概要设计文档 | `02_hld_step_14_formal_document_assembly.md` | §1～§14 | `done` | `pass` | 正式 02 已按新版 §1～§14 full-restart 重建，章节来源、对象/接口/流/状态反查和禁写项审计通过 | 文档级停审；等待用户明确授权进入 03 | inherited blockers |

## 2. 总流程计划（前轮历史；本轮沿同一顺序逐章修复）

```text
Step 1 上游输入边界
  -> Step 2 设计目标与当前范围
  -> Step 3 约束条件
  -> Step 4 代码主体框架映射
  -> Step 5 主要组成部分、职责与边界
  -> Step 6 关键对象轮廓
  -> Step 7 API / 接口骨架
  -> Step 8 关键处理流 / 重要函数数据流
  -> Step 9 状态定义与状态流转
  -> Step 10 异常与边界场景轮廓
  -> Step 11 配置影响轮廓
  -> Step 12 详细设计承接清单
  -> Step 13 设计风险与待确认事项
  -> Step 14 正式概要设计文档整理与停审
```

每个 Step 必须独立完成：

```text
读取输入
  -> 回答 SOP 问题
  -> 诊断旧材料 / 边界污染
  -> 做设计取舍
  -> 形成结构化中间产物
  -> 判断复杂度与图表需要
  -> 写回填草稿
  -> 完成 Step / 模块自检和三层门禁
  -> 更新本 flow 与项目台账
```

Step 5～9 必须以主要组成部分为小循环主轴。每个组成部分先完成 capability、对象线索、接口、处理流和状态归属的局部审查，再做跨组成部分闭环审计。未来 Step 文件只能在前一步通过后创建。

## 3. 输入与定位

当前直接基线为逐章修复后00/01，冻结原型只提供体验核对；已补Process truth来源、项目详情五标签、分层流程/并行结构/独立Gate、双向群聊与目录。所有正式消费能力仍须SDK确认，未采用未停审Bridges设计。

| 输入类别 | 当前材料 | 处理口径 |
|---|---|---|
| 需求基线 | `projects/L5-chat/00-需求文档.md` | 当前正式需求输入，已停审；不在 02 重写需求。 |
| 架构基线 | `projects/L5-chat/01-架构设计.md` | 当前正式架构输入，已停审；不在 02 重做系统边界、子域或技术取舍。 |
| 产品预推演 | `draft/01_项目作用与交互对象.md`、`draft/02_功能推演.md`、`draft/03_模块划分与分层.md` | 作为候选输入，必须经过本 flow 重新收敛；不直接成为正式事实。 |
| SDK / owner 输入 | `L0-sdk` 与各正式 owner 当前 `00～07`、必要台账 | 只采用已明确的正式边界；exact DTO/API/schema/cursor 未闭合处保持 blocker。 |
| 历史材料 | `README.md`、旧 `02-概要设计.md`、旧 `03-详细设计.md` 和其他旧 Chat 文档 | 只做污染诊断；不得直接沿用旧对象、协议、指标、目录或技术定论。 |

## 4. 正式装配门禁（前轮历史，当前已按用户授权逐章修复）

正式 `02-概要设计.md` 只有在以下条件全部满足后才能重建：

- Step 1～13 均有独立中间产物，状态为 `done`，对应 gate_status 为 `pass`。
- 项目级台账允许装配 `02`，文档级 flow 允许 Step 14，Step 14 文件允许正式回填。
- 正式章节只引用已存在的具体 `design-calibration/02_hld_step_*.md` 文件。
- 主要组成部分、关键对象、接口、处理流、状态和配置影响之间完成名称反查，没有悬空主语。
- 未闭合的 SDK/owner 合同保持 `pending / blocked / waiting / unavailable / unknown`，不被润色为实现或 readiness。
- 前轮删除重建指令只属historical_material；当前授权是在现有§1～14逐章修复，同步既有Step文件，不删除重建，不新增替代正式文档。
- 正式文档完成静态审计后立即把本 flow 和项目台账切换为 `02 stopped`，不创建 `03` flow 或 Step 文件。

## 5. 继承 blocker

| ID | 当前影响 | 02 的保守口径 |
|---|---|---|
| `CHAT-UP-001` | SDK typed query/command/event/ref/change/resume surface 尚未逐场景闭合 | 只定义能力类别、adapter 角色和结果姿态，不固化方法名、DTO 或协议 schema。 |
| `CHAT-UP-002` | Conversation visibility、cursor、change 和 resume 消费合同仍需确认 | 只定义 group/channel/dm/thread 的页面与消费边界；缺合同时保持 stale/gap/blocked/unavailable。 |
| `CHAT-UP-003` | Governance Gate/Decision receipt、授权语境和幂等结果待 SDK 暴露 | GateCard 只提供受控意图入口；confirmed 依赖正式 owner receipt/result/change。 |
| `CHAT-UP-004` | Artifact safe preview/ref/visibility 尚未完全闭合 | 只定义 ref/summary/preview/unavailable 轮廓，不引入正文。 |
| `CHAT-UP-005` | Workspace safe view、freshness、attention、cursor、export 未完全闭合 | 不自行拼 Inbox 或跨域 projection；缺失时保持 partial/stale/blocked。 |
| `CHAT-UP-006` | Identity/Work/Member/Runtime 摘要层级仍需逐项对齐 | 只保存 safe summary/ref 和来源元数据，不推断生命周期、项目完成或 runtime outcome。 |
| `CHAT-UP-007` | Observability 前端低敏 handoff 尚未闭合 | 只登记诊断 intent/correlation 角色；不直接写 backend 或把 UI log 当 truth。 |
| `CHAT-UP-008` | Process整体/阶段/节点投影、拓扑/状态/Gateway/分支/关联版本及SDK change/resume未确认 | Process owner已辨明，正向消费blocked；不从Work/Runtime/原型补图，不推join。 |
| `CHAT-UP-009` | 项目/群聊绑定owner与解除/撤销、公司目录provider/人类AI覆盖/搜索分页访问待确认 | 关系和目标access各自验证；目录/项目成员/参与者/在场分立，缺能力blocked/unavailable。 |
| `CHAT-BASE-001` | 00新增追溯行引用未定义AC-NFR008～024 | 只使用已定义AC-NFR001～007、NFR001～024与AC-FR011～014；缺口open，本轮不改00。 |
| `WS-UP-001~008` | Workspace read-model 相关合同未完全关闭 | 仅消费正式 safe view/export；不将候选字段升级为 Workspace truth。 |
| `OPEN-CHAT-*` | 质量数值、平台合同和部分恢复语义待确认 | 保持候选、pending 或 blocked，不产生 readiness、性能或兼容承诺。 |

## 6. 停审规则

- 本 flow 只管理正式 `02`，不授权后续 `03`。
- 用户后续若未明确授权，正式 `02` 完成后不得继续创建 `03` 相关材料。
- 本轮不修改 `projects/L0-sdk/` 或任何其他项目正式文档。
- 本轮不提交 commit；工作区其他路径已有变化不触碰、不清理、不回滚。

## 7. 当前静态审计与停审

正式02保留14章逐章修复，无重复小节、代码块闭合，14个章节Step来源均存在；32个独立关键对象、43个接口/consumer/job/局部入口均在§8有流或复用/未独立理由。30个独立处理流标题已核对；规范/原型引用路径存在，旧主体别名已统一，git diff --check无输出。当前Step gate pass只表示文档结构审查，所有SDK/owner/平台/质量合同缺口保持open。

本轮修改现有正式02、既有02 flow、14个既有Step文件及project_execution_ledger；未改00/01/03、原型或上游正式文件，未实现、安装、build/run/test或提交。下一文档如获授权，应先读修复后02、旧03差异、详细设计SOP/书写规范、Process/关系/目录相关正式合同与台账；当前停止。
