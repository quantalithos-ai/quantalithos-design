# Step 2. 明确本轮实现范围和非范围

## 1. Step 状态

- 状态：[x] 本Step校准完成；gate_status=pass；current_part=closed。
- 对应SOP：详细设计讨论流程Step2；回填：详细设计§2。
- 开工依据：[Step1](03_ddd_step_01_upstream_boundary.md)已pass，项目ledger/03 flow允许Step2。
- 写入前检查：仅校准材料，formal_fill_allowed=false，无实现/测试/commit授权。

### 1.1 Step 内计划

1. 读Step1与正式02 §2/5~12。
2. 区分“整份03目标”与“本轮到Step4的实际交付”，逐项回答SOP问题。
3. 形成七CP目标/14入口覆盖和非范围表；后置核对draft增强项。
4. 从结构化结果回填，核对无漏项/新增用例/隐式Outbox；通过后创建Step3。

## 2. 本步输入

[正式02](../02-概要设计.md) §2/4/5/6/7/8/9/10/11/12；[Step1](03_ddd_step_01_upstream_boundary.md)关系/依赖/缺口；[03 flow](03_ddd_calibration_flow.md)；详细设计书写规范§5.2。

## 3. SOP 问题回答

1. 必须覆盖哪些模块？覆盖CP1分区与scope、CP2安全来源消费、CP3连续投影、CP4 Inbox派生、CP5局部意图、CP6恢复/失效、CP7安全读取。此处是语义范围，crate/module的正式划分留Step4/5。
2. 哪些对象/接口/事件/job/状态必须定义？02的16对象、2 Command/6 Query/2 Consumer/4 Operations全部进入整份03目标；无独立CP2/4公开API，无outbound event。SourceApplicationRecord终局、coverage、Inbox、局部read意图、attempt、generation角色/安全、response分轴均须后续矩阵。
3. 哪些是后续增强？搜索排名、跨源统计/历史比较、预测优先级、更多scope、个人执行宿主、静态seed等不纳入当前核心；不能用P1标签后置no-write、权限、幂等、恢复和显式公开Operations语义。
4. 哪些归其他文档？04写配置项/默认值/生效；05写完整测试方案；06写验收/证据门禁；07写phase/commit boundary/实施台账；部署运维另行授权。03必须先提供这些文档需要的实现结构，不代写下游文档。
5. 实现者拿到后应能做什么？完整03最终应支持按模块/对象/协议/flow/状态/持久化/配置契约落码，但本轮Step1~4只交付输入边界、范围、实现约束和计划布局，不能作为编码许可或完整实现说明。外部exact缺口未闭合的正向adapter仍blocked。

## 4. 当前文档问题诊断

| 位置 | 风险 | 修正方向 |
|---|---|---|
| 02 §2.2/12 | “03定义完整契约”容易与本轮仅到Step4混同 | 单列整份03目标与本轮实际完成深度 |
| 02 §7 Operations/Query | export、recovery status容易被当维护写入口 | export/status仍Query；四Operations不降为未来可选 |
| 02 §6/9 | 16对象可能被扩成所有DTO的业务生命周期 | DTO/port不算新truth对象；保持状态主语筛选 |
| 02 §11 | 配置影响容易在Step2被铺成默认参数 | 这里只划归属，禁止用配置关闭安全不变量 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 本轮深度 | 概要交给完整03 | 本轮止于布局；后续契约另授权 | 最新用户停点优先 |
| 功能覆盖 | 七CP和入口散列 | 统一覆盖表可逐项反查 | 防遗漏Operations与纯查询 |
| 非范围 | 需求/架构排除项 | 指明owner或04~07归属 | 不让实现者补相邻truth |

## 6. 设计取舍

| 方案 | 收益 | 代价 | 结论 |
|---|---|---|---|
| 全核心范围保留，分步定义契约，外部路径逐项blocked | 不遗漏安全与恢复闭环 | 必须区分设计计划和可运行交付 | 采用 |
| 本轮只保留GetWorkspaceView，把恢复/失效移P1 | 首屏路径较少 | 无法解释投影维护/安全撤销和缺口 | 不采用 |
| 把所有draft增强和产品能力纳入03 | 表面覆盖丰富 | 超出00/01/02及当前授权 | 不采用 |

## 7. 结构化中间产物

### 7.1 整份03的设计目标（非本轮已完成声明）

| 目标 | 说明 | 最终交付给实现者的结果 |
|---|---|---|
| CP1分区/scope | WorkspacePartition、WorkspaceScope；ProvisionWorkspacePartition | 唯一身份、resolver、无partition id时幂等与原子创建 |
| CP2安全来源 | SourceSlice、VisibilityBinding；内部SourceReadService | safe输入、list/item决定与有效性、只读port；exact路径blocked |
| CP3连续投影 | PartitionProjection、SourceApplicationRecord、SourceCoverage；ConsumeSourceChange | 终局/重复/冲突/缺口/晚到分类、原子应用、unknown读取 |
| CP4 Inbox派生 | InboxItem、InboxProjector内部协作 | owner明示输入、Present/Withdrawn、CP3/6同事务，无独立公开写 |
| CP5局部意图 | LocalAttentionState、ReadCursor、WorkspaceOperationRecord；ChangeWorkspaceLocalState | typed变体、expected版本、Read/Unread/Unknown和重建保留 |
| CP6恢复/失效 | RebuildAttempt、GenerationState、InvalidationRecord | 四Operations及ConsumeSourceInvalidation，baseline接续、候选、双轴、切换栅栏 |
| CP7读取/交接 | WorkspaceReadView、WorkspacePageCursor | 六Query请求响应、当前裁剪、两种读模式、页绑定与纯读export |
| 跨部分约束 | 分区事务/读写port隔离/配置绑定/诊断 | 持久化、并发、错误、测试切口和实施前置检查，不新增跨域truth |

### 7.2 14入口范围清单

| 类别 | 入口 | 允许效果 / 禁止效果 |
|---|---|---|
| Command（2） | ProvisionWorkspacePartition；ChangeWorkspaceLocalState | 显式局部创建/用户意图，不调用上游command |
| Query（6） | GetWorkspaceView；ListWorkspaceInbox；GetWorkspaceLocalState；GetWorkspaceOperationResult；GetWorkspaceRecoveryStatus；ExportWorkspaceReadModel | no-write，诊断/export不建snapshot/job/分区，不标已读 |
| Consumer（2） | ConsumeSourceChange；ConsumeSourceInvalidation | 可信输入后本地应用/失效，不定义owner事件或bus ack |
| Operations（4） | RequestWorkspaceRecovery；AdvanceWorkspaceRecovery；SupersedeWorkspaceRecovery；InvalidateWorkspaceView | 显式获准维护，不覆盖local overlay，不创archive状态 |
| Outbound Event（0） | 不适用 | 不建Outbox/publisher或WorkspaceProjectionUpdated family |

状态范围保持02 §9：SourceApplicationRecord只存Applied/LateIgnored终局；Duplicate回读、Gap/Blocked不占成功键；RebuildAttempt的Blocked/Failed/Superseded/Completed不复活；GenerationRole与GenerationSafetyState独立；DataStale不等SafetyBlocked；无稳定映射则ReadCursor派生Unknown；响应的可用性/新鲜度/完整度/安全性不能合并为单状态。

### 7.3 非范围与归属

| 非范围 | owner / 承接文档 | 当前限制 |
|---|---|---|
| 六L1 truth、正文和command | 六owning domain | 安全摘要/ref，不共享业务库或反写 |
| authorization/membership/governance决定 | 各owning chain | 消费决定，不从projection/ref/cursor造allow |
| delivery/ack/replay executor | L0-bus及正式owner恢复接缝 | application record非传递事实 |
| runtime/tools/capability/sandbox/member host | 对应L2/L3/L4 owner | 不建执行模块或第三执行主语 |
| seed/template语义 | MI-UP-006待owner裁决 | 不默认workspace live拥有 |
| UI/SDK cache/sync engine/archive package | 下游产品/SDK/sync/archive | read/export不定义接收/冻结/恢复truth |
| 搜索排名/跨源统计/历史比较/预测优先级 | 后续需求重开 | 不列本轮必建文件 |
| 配置目录/默认值/生效/部署参数 | 04及部署运维 | 03负责实现结构/绑定要求；本步无默认值 |
| 测试执行/结果、验收证据 | 05/06及获准实施 | 本轮只有文档静态审计 |
| 排期、commit boundary、implementation ledger/skeleton | 07 | 本轮不提前创建 |

### 7.4 本轮交付截面

Step1~4只完成关系/范围/约束/布局，Step5模块契约尚未开始，Step6~19均未授权。目标布局文件为planned，不是创建实现文件的动作或证明。未来实施需完整设计链、external closure与用户实施授权。

复杂度判断：范围表可审查，不需对象/协议附录；本步不以细致为由越过Step5停点。

## 8. 回填草稿

### 8.1 后置历史差异审计

| 材料 | 候选口径 | 结论 / 影响 |
|---|---|---|
| draft/02 §3增强项、§4非目标 | 统计/搜索和框架选型后置 | 保留增强非范围；本次Step3独立决定实现语言 |
| draft/03 §3对象候选 | RefreshAttempt、SourceCursorState、UnreadProjection等 | 不新增对象，以02的16对象为主语全集 |
| draft/03 §2 Outbox / Read Handoff | 获准后才可输出 | 当前无family，裁剪Outbox；export是Query |

### 8.2 详细设计§2草稿

本文覆盖CP1~CP7的局部状态、安全来源消费、连续投影、Inbox派生、局部意图、恢复/失效和安全读取。目标采用§7.1，接口范围采用§7.2；所有响应、诊断和export执行现时可见性约束。非范围及归属采用§7.3。

不得通过typed wrapper、fake或后续增强改变owner边界或后置核心安全/恢复语义。当前只校准至Step4，不代表上述全部实现契约已完成，实际成熟度以03 flow为准。

## 9. 待确认事项

WS-UP-001~008/006-S维持开放；不把前序来源缺口归为“实现者自行补齐”。

## 10. 进入下一步条件

七CP/16对象/14入口无遗漏/新增，public Operations未移后续，query no-write与派生/用户意图分离保持；非范围都有owner或承接文档。结构化、复杂度、历史审计、回填及静态自检done。

gate_status=pass；next_allowed_action=create_03_step3；formal_fill_allowed=false；无代码/项目测试/commit。
