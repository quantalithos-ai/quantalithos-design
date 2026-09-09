# Step 5. 组成部分与边界

## 1. Step 状态与计划

- 模式：full-restart / single-agent-serial；输入门禁 pass；思考记录、结构化、回填、自检 done。
- gate_status=pass；gate_reason=本Step静态自检完成；next_allowed_action=由flow串行推进；formal_fill_allowed=step14_only。
- source_files：Step 4；00 §9、01 §6/9；项目台账；02 flow；概要SOP对应Step与概要规范对应章节。
- 写入前检查：本项目/本文档授权有效；无正式正文污染；分批规模不限制最终完整性。

### Step 内计划

1. 已读取三层台账、前序及规范。
2. 问题回答、诊断、取舍见§3~6。
3. CP1→CP2→CP3→CP4→CP5→CP6→CP7，每部分独立思考/结构化/停审；结束后总表和交互图
4. 结构化后后置历史审计；从§7摘录回填。
5. 自检通过后更新flow，不把上游pending改为闭合。

## 2. 本步输入

Step 4；00 §9、01 §6/9；00 FR-WS-001~010/BR-WS-001~012；01 §6/8/9/10/13/15。前步的问题回答、诊断、取舍、待确认均承接，具体依赖见flow §3。

## 3. SOP 问题回答

1~3. 七CP职责沿Step4，并分别声明非职责。4~7. 先列capability与输入输出，再发现对象，不在本Step定义字段。8~9. 跨CP通过scope、source slice、原子投影及只读view交接。10~13. 候选按truth/state/policy/projection/reference/audit/history区分，port/service/DTO不升为领域对象。14~15. 每CP停审后再做跨CP归属与覆盖审计。

## 4. 当前文档问题诊断

WorkspaceService大对象会同时拥有授权、投影与已读；U4若不拆会在重建时丢用户动作。候选中的cursor/revision与状态枚举必须区分字段类型和有生命周期对象。

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 尚无本Step正式校准；01只有架构约束 | 本Step将已核验边界转为组成部分与边界，不补上游schema |

## 6. 设计取舍

采用七CP逐个capability小循环；不按外部owner建立六套领域模型，不设跨域授权中心。复杂度高，本Step模块小节分批，Step6对象附录分CP。

## 7. 结构化中间产物

### 组成部分总表

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| CP1 分区与范围 | 解析正式principal与Personal/Project scope；显式建立局部分区；查询已有分区身份 | ScopeService / PartitionService；WorkspacePartition、WorkspaceScope | 不创建GlobalMember/Project/ProjectMember，不认证或裁决权限 |
| CP2 安全来源消费 | 读取owner-safe摘要与ref；验证来源/版本/可见性绑定；在内存形成来源切片 | SourceReadService；SourceSlice、VisibilityBinding | 不拉取正文，不创建allowlist，不将治理视为全域授权owner |
| CP3 连续投影 | 应用owner输入；版本/重复/乱序/缺口判定；按分区原子推进projection、cursor和revision | ProjectionApplyService；PartitionProjection、SourceApplicationRecord、SourceCoverage | 不从timestamp或cursor整数猜顺序，不跨域事务、不吞gap |
| CP4 Inbox投影 | 从owner明示attention派生稳定条目；更新/撤回；给CP7提供可见候选 | InboxProjector；InboxItem | 不从摘要文字推断待办，不产生业务优先级/通知决定或receipt |
| CP5 局部注意力 | 显式read/unread、pin/mute/hide、preference/focus/last-opened；局部并发和幂等结果 | LocalAttentionService；LocalAttentionState、ReadCursor、WorkspaceOperationRecord | 不把query当读意图，不同步其他scope、不确认对话已读或任务完成 |
| CP6 失效与重建 | 显式失效、刷新/重建、基线接续、候选验证与原子cutover；保留恢复诊断 | RecoveryService；RebuildAttempt、GenerationState、InvalidationRecord | 不从旧projection/SDK cache/archive重建，不修source truth、不假定bus executor |
| CP7 读取与交接 | Personal/Project读取、Inbox/local/维护结果查询、临时聚合、分页与只读export | WorkspaceQueryService；WorkspaceReadView、WorkspacePageCursor | 不创建partition/标已读/触发维护，不拥有UI/cache/sync/archive状态 |

### 对象发现维度总表

| 组成部分 | Truth / State | Policy / Invariant | Projection / Read model | Reference / Boundary | Audit / History | Step 6 必须独立展开 |
|---|---|---|---|---|---|---|
| CP1 分区与范围 | WorkspacePartition | 分区唯一性与scope一致性 | - | WorkspaceScope | 复用CP5定义的WorkspaceOperationRecord局部技术结构，各service拥有自身操作 | WorkspacePartition、WorkspaceScope |
| CP2 安全来源消费 | - | 正式决定消费/正文边界 | SourceSlice | VisibilityBinding | 来源回链随SourceSlice | SourceSlice、VisibilityBinding |
| CP3 连续投影 | SourceApplicationRecord / SourceCoverage | 连续性与幂等不变量 | PartitionProjection | source cursor为字段 | SourceApplicationRecord | PartitionProjection、SourceApplicationRecord、SourceCoverage |
| CP4 Inbox投影 | 派生状态非业务truth | 稳定来源identity/无重复 | InboxItem | attention ref为字段 | 来源application回链 | InboxItem |
| CP5 局部注意力 | LocalAttentionState / ReadCursor | principal/scope与版本保护 | unread是响应派生非独立truth | stable Inbox/ref targets | WorkspaceOperationRecord | LocalAttentionState、ReadCursor、WorkspaceOperationRecord |
| CP6 失效与重建 | RebuildAttempt / GenerationState / InvalidationRecord | 候选隔离/覆盖/授权/写栅栏 | 候选projection复用CP3 | owner baseline/cursor refs | 失效及attempt结果历史 | RebuildAttempt、GenerationState、InvalidationRecord |
| CP7 读取与交接 | - | 读取安全/游标绑定规则 | WorkspaceReadView | WorkspacePageCursor | 只读provenance非新审计truth | WorkspaceReadView、WorkspacePageCursor |

#### 各部分交互总图

```text
CP1 分区与范围
     │
     ▼
CP2 安全来源消费
     │
     ├─ query ─> CP7 读取与交接
     │
     ▼
CP3 连续投影 ──> CP4 Inbox投影
     │                  │
     ▼                  ▼
CP6 失效与重建      CP5 局部注意力
     │                  │
     └──────────> CP7 <──┘
```

关键说明：

- CP3与CP4写入在同一分区原子边界，CP6候选应用复用该边界。
- CP5意图不受generation替换；箭头不是上游写路径。
- CP7只读其他部分，绝不借读取反向启动CP6；图不含协议字段/时序。

### 跨组成部分审计

| 检查 | 结论 | 说明 |
|---|---|---|
| ownership唯一 | pass | projection/Inbox是派生，local意图是独立truth，source/visibility仍属owner |
| 候选池完整 | pass | 16个候选关键对象各属一个CP；端口与service留接口/flow，不重复定义 |
| 原子边界 | pass | CP3/4同apply；CP6 cutover隔离；CP5不被重建替换 |
| read/维护 | pass | CP7 query不写；失效与恢复由显式入口触发 |
| 后续同名承接 | pending_at_this_step | 16对象进入Step6；服务/port由Step7/8；状态先筛选再Step9 |
| 外部正向 | blocked | WS-UP-001~008/006-S保留，无本地schema替代 |

总体边界：每个组成部分都有独立小节与停审；不会把源域、SDK或archive列为内部模块。Step6将16候选逐一正式化，字段值类型、port与DTO分类排除另记。

### CP1 分区与范围 校准

问题/依据：U1与00能力要求本部分完成解析正式principal与Personal/Project scope；显式建立局部分区；查询已有分区身份。
诊断：不创建GlobalMember/Project/ProjectMember，不认证或裁决权限；必须避免把相邻状态混入本部分。
取舍：使用ScopeService / PartitionService承接该功能，以ScopeResolverPort提供owner解析；WorkspaceStorePort按principal/scope查已有分区；CP2提供决定绑定隔离；不创建新的外部truth副本。
模块思考门禁：pass；下批仅写本部分结构化，不开始其他部分。
#### 本部分职责与capability

解析正式principal与Personal/Project scope；显式建立局部分区；查询已有分区身份。

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 解析正式principal与Personal/Project scope；显式建立局部分区；查询已有分区身份 | ActorContext、ScopeSelector、owner scope resolution | WorkspaceScope、WorkspacePartition或拒绝 | 仅显式ProvisionWorkspacePartition可建立局部分区；ScopeService内部解析不写（不是独立公开API） | Step6~9 |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| ScopeService / PartitionService | application/domain service | 编排本部分capability | §7/8；完整service对象留03 |
| WorkspacePartition | 候选对象 | 承接本部分局部状态或安全语境 | §6独立筛选展开，§8/9反查 |
| WorkspaceScope | 候选对象 | 承接本部分局部状态或安全语境 | §6独立筛选展开，§8/9反查 |

#### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | WorkspacePartition | 候选先独立筛选；规则/字段不得伪造独立状态机 |
| Policy / Invariant | 分区唯一性与scope一致性 | 候选先独立筛选；规则/字段不得伪造独立状态机 |
| Projection / Read model | - | 不适用，无本部分对象 |
| Reference / Boundary | WorkspaceScope | 候选先独立筛选；规则/字段不得伪造独立状态机 |
| Audit / History | 复用CP5定义的WorkspaceOperationRecord局部技术结构，各service拥有自身操作 | 候选先独立筛选；规则/字段不得伪造独立状态机 |

#### 非职责与接缝

不创建GlobalMember/Project/ProjectMember，不认证或裁决权限。ScopeResolverPort提供owner解析；WorkspaceStorePort按principal/scope查已有分区；CP2提供决定绑定。

#### 本部分回填与停审

正式§5摘录本部分职责、两表、非职责/接缝。

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能→候选→后续 | pass | WorkspacePartition、WorkspaceScope均有上述capability来源；字段留Step6 |
| 数据owner/接缝 | pass | 仅显式ProvisionWorkspacePartition可建立局部分区；ScopeService内部解析不写（不是独立公开API）；不越权 |
| 正向外部合同 | blocked | 沿项目WS-UP，不用本部分对象补owner定义 |

模块gate_status=pass；允许下一部分思考。

### CP2 安全来源消费 校准

问题/依据：U2与00能力要求本部分完成读取owner-safe摘要与ref；验证来源/版本/可见性绑定；在内存形成来源切片。
诊断：不拉取正文，不创建allowlist，不将治理视为全域授权owner；必须避免把相邻状态混入本部分。
取舍：使用SourceReadService承接该功能，以OwnerSourcePort、VisibilityResolverPort、RecoverySourcePort；CP3应用切片，CP7临时组合隔离；不创建新的外部truth副本。
模块思考门禁：pass；下批仅写本部分结构化，不开始其他部分。
#### 本部分职责与capability

读取owner-safe摘要与ref；验证来源/版本/可见性绑定；在内存形成来源切片。

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 读取owner-safe摘要与ref；验证来源/版本/可见性绑定；在内存形成来源切片 | WorkspaceScope、SourceSelection、owner正式query/visibility输入 | SourceSlice或BlockedSource | query纯内存；持久化仅由CP3或CP6显式应用 | Step6~9 |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| SourceReadService | application/domain service | 编排本部分capability | §7/8；完整service对象留03 |
| SourceSlice | 候选对象 | 承接本部分局部状态或安全语境 | §6独立筛选展开，§8/9反查 |
| VisibilityBinding | 候选对象 | 承接本部分局部状态或安全语境 | §6独立筛选展开，§8/9反查 |

#### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | - | 不适用，无本部分对象 |
| Policy / Invariant | 正式决定消费/正文边界 | 候选先独立筛选；规则/字段不得伪造独立状态机 |
| Projection / Read model | SourceSlice | 候选先独立筛选；规则/字段不得伪造独立状态机 |
| Reference / Boundary | VisibilityBinding | 候选先独立筛选；规则/字段不得伪造独立状态机 |
| Audit / History | 来源回链随SourceSlice | 候选先独立筛选；规则/字段不得伪造独立状态机 |

#### 非职责与接缝

不拉取正文，不创建allowlist，不将治理视为全域授权owner。OwnerSourcePort、VisibilityResolverPort、RecoverySourcePort；CP3应用切片，CP7临时组合。

#### 本部分回填与停审

正式§5摘录本部分职责、两表、非职责/接缝。

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能→候选→后续 | pass | SourceSlice、VisibilityBinding均有上述capability来源；字段留Step6 |
| 数据owner/接缝 | pass | query纯内存；持久化仅由CP3或CP6显式应用；不越权 |
| 正向外部合同 | blocked | 沿项目WS-UP，不用本部分对象补owner定义 |

模块gate_status=pass；允许下一部分思考。

### CP3 连续投影 校准

问题/依据：U3与00能力要求本部分完成应用owner输入；版本/重复/乱序/缺口判定；按分区原子推进projection、cursor和revision。
诊断：不从timestamp或cursor整数猜顺序，不跨域事务、不吞gap；必须避免把相邻状态混入本部分。
取舍：使用ProjectionApplyService承接该功能，以WorkspaceStorePort支持应用结果读回/原子保存；CP4派生包含同事务；CP6候选写隔离隔离；不创建新的外部truth副本。
模块思考门禁：pass；下批仅写本部分结构化，不开始其他部分。
#### 本部分职责与capability

应用owner输入；版本/重复/乱序/缺口判定；按分区原子推进projection、cursor和revision。

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 应用owner输入；版本/重复/乱序/缺口判定；按分区原子推进projection、cursor和revision | 已验证SourceSlice或事件输入、已有projection/application/coverage | 既有应用结果、新revision或gap/conflict | 局部原子写；不写bus delivery | Step6~9 |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| ProjectionApplyService | application/domain service | 编排本部分capability | §7/8；完整service对象留03 |
| PartitionProjection | 候选对象 | 承接本部分局部状态或安全语境 | §6独立筛选展开，§8/9反查 |
| SourceApplicationRecord | 候选对象 | 承接本部分局部状态或安全语境 | §6独立筛选展开，§8/9反查 |
| SourceCoverage | 候选对象 | 承接本部分局部状态或安全语境 | §6独立筛选展开，§8/9反查 |

#### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | SourceApplicationRecord / SourceCoverage | 候选先独立筛选；规则/字段不得伪造独立状态机 |
| Policy / Invariant | 连续性与幂等不变量 | 候选先独立筛选；规则/字段不得伪造独立状态机 |
| Projection / Read model | PartitionProjection | 候选先独立筛选；规则/字段不得伪造独立状态机 |
| Reference / Boundary | source cursor为字段 | 候选先独立筛选；规则/字段不得伪造独立状态机 |
| Audit / History | SourceApplicationRecord | 候选先独立筛选；规则/字段不得伪造独立状态机 |

#### 非职责与接缝

不从timestamp或cursor整数猜顺序，不跨域事务、不吞gap。WorkspaceStorePort支持应用结果读回/原子保存；CP4派生包含同事务；CP6候选写隔离。

#### 本部分回填与停审

正式§5摘录本部分职责、两表、非职责/接缝。

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能→候选→后续 | pass | PartitionProjection、SourceApplicationRecord、SourceCoverage均有上述capability来源；字段留Step6 |
| 数据owner/接缝 | pass | 局部原子写；不写bus delivery；不越权 |
| 正向外部合同 | blocked | 沿项目WS-UP，不用本部分对象补owner定义 |

模块gate_status=pass；允许下一部分思考。

### CP4 Inbox投影 校准

问题/依据：U4派生与00能力要求本部分完成从owner明示attention派生稳定条目；更新/撤回；给CP7提供可见候选。
诊断：不从摘要文字推断待办，不产生业务优先级/通知决定或receipt；必须避免把相邻状态混入本部分。
取舍：使用InboxProjector承接该功能，以CP3提供来源与幂等；CP5只提供局部intent；CP7在权限裁剪后计算unread隔离；不创建新的外部truth副本。
模块思考门禁：pass；下批仅写本部分结构化，不开始其他部分。
#### 本部分职责与capability

从owner明示attention派生稳定条目；更新/撤回；给CP7提供可见候选。

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 从owner明示attention派生稳定条目；更新/撤回；给CP7提供可见候选 | owner attention输入、SourceSlice、来源稳定identity | InboxItem集合或blocked attention | 经CP3应用或CP6重建原子保存；无独立上游写 | Step6~9 |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| InboxProjector | application/domain service | 编排本部分capability | §7/8；完整service对象留03 |
| InboxItem | 候选对象 | 承接本部分局部状态或安全语境 | §6独立筛选展开，§8/9反查 |

#### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | 派生状态非业务truth | 候选先独立筛选；规则/字段不得伪造独立状态机 |
| Policy / Invariant | 稳定来源identity/无重复 | 候选先独立筛选；规则/字段不得伪造独立状态机 |
| Projection / Read model | InboxItem | 候选先独立筛选；规则/字段不得伪造独立状态机 |
| Reference / Boundary | attention ref为字段 | 候选先独立筛选；规则/字段不得伪造独立状态机 |
| Audit / History | 来源application回链 | 候选先独立筛选；规则/字段不得伪造独立状态机 |

#### 非职责与接缝

不从摘要文字推断待办，不产生业务优先级/通知决定或receipt。CP3提供来源与幂等；CP5只提供局部intent；CP7在权限裁剪后计算unread。

#### 本部分回填与停审

正式§5摘录本部分职责、两表、非职责/接缝。

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能→候选→后续 | pass | InboxItem均有上述capability来源；字段留Step6 |
| 数据owner/接缝 | pass | 经CP3应用或CP6重建原子保存；无独立上游写；不越权 |
| 正向外部合同 | blocked | 沿项目WS-UP，不用本部分对象补owner定义 |

模块gate_status=pass；允许下一部分思考。

### CP5 局部注意力 校准

问题/依据：U4局部truth与00能力要求本部分完成显式read/unread、pin/mute/hide、preference/focus/last-opened；局部并发和幂等结果。
诊断：不把query当读意图，不同步其他scope、不确认对话已读或任务完成；必须避免把相邻状态混入本部分。
取舍：使用LocalAttentionService承接该功能，以WorkspaceStorePort保存local state+operation；CP4 stable ref关联，CP7只读组合，CP6不得重置隔离；不创建新的外部truth副本。
模块思考门禁：pass；下批仅写本部分结构化，不开始其他部分。
#### 本部分职责与capability

显式read/unread、pin/mute/hide、preference/focus/last-opened；局部并发和幂等结果。

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 显式read/unread、pin/mute/hide、preference/focus/last-opened；局部并发和幂等结果 | ActorContext、分区、LocalAttentionChange、预期local revision与幂等语境 | 局部变更结果或冲突；重放返回同一安全结果 | 只写local intent及操作记录；不改generation/owner | Step6~9 |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| LocalAttentionService | application/domain service | 编排本部分capability | §7/8；完整service对象留03 |
| LocalAttentionState | 候选对象 | 承接本部分局部状态或安全语境 | §6独立筛选展开，§8/9反查 |
| ReadCursor | 候选对象 | 承接本部分局部状态或安全语境 | §6独立筛选展开，§8/9反查 |
| WorkspaceOperationRecord | 候选对象 | 承接本部分局部状态或安全语境 | §6独立筛选展开，§8/9反查 |

#### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | LocalAttentionState / ReadCursor | 候选先独立筛选；规则/字段不得伪造独立状态机 |
| Policy / Invariant | principal/scope与版本保护 | 候选先独立筛选；规则/字段不得伪造独立状态机 |
| Projection / Read model | unread是响应派生非独立truth | 候选先独立筛选；规则/字段不得伪造独立状态机 |
| Reference / Boundary | stable Inbox/ref targets | 候选先独立筛选；规则/字段不得伪造独立状态机 |
| Audit / History | WorkspaceOperationRecord | 候选先独立筛选；规则/字段不得伪造独立状态机 |

#### 非职责与接缝

不把query当读意图，不同步其他scope、不确认对话已读或任务完成。WorkspaceStorePort保存local state+operation；CP4 stable ref关联，CP7只读组合，CP6不得重置。

#### 本部分回填与停审

正式§5摘录本部分职责、两表、非职责/接缝。

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能→候选→后续 | pass | LocalAttentionState、ReadCursor、WorkspaceOperationRecord均有上述capability来源；字段留Step6 |
| 数据owner/接缝 | pass | 只写local intent及操作记录；不改generation/owner；不越权 |
| 正向外部合同 | blocked | 沿项目WS-UP，不用本部分对象补owner定义 |

模块gate_status=pass；允许下一部分思考。

### CP6 失效与重建 校准

问题/依据：U5与00能力要求本部分完成显式失效、刷新/重建、基线接续、候选验证与原子cutover；保留恢复诊断。
诊断：不从旧projection/SDK cache/archive重建，不修source truth、不假定bus executor；必须避免把相邻状态混入本部分。
取舍：使用RecoveryService承接该功能，以RecoverySourcePort读取baseline/允许接续；CP3复用apply；WorkspaceStorePort栅栏与原子切换；CP7只读状态隔离；不创建新的外部truth副本。
模块思考门禁：pass；下批仅写本部分结构化，不开始其他部分。
#### 本部分职责与capability

显式失效、刷新/重建、基线接续、候选验证与原子cutover；保留恢复诊断。

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 显式失效、刷新/重建、基线接续、候选验证与原子cutover；保留恢复诊断 | MaintenanceContext、已有分区/coverage、owner baseline/event接续 | attempt/generation/失效结果或blocked | 仅本地候选/当前指针/安全失效；用户intent不覆盖 | Step6~9 |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| RecoveryService | application/domain service | 编排本部分capability | §7/8；完整service对象留03 |
| RebuildAttempt | 候选对象 | 承接本部分局部状态或安全语境 | §6独立筛选展开，§8/9反查 |
| GenerationState | 候选对象 | 承接本部分局部状态或安全语境 | §6独立筛选展开，§8/9反查 |
| InvalidationRecord | 候选对象 | 承接本部分局部状态或安全语境 | §6独立筛选展开，§8/9反查 |

#### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | RebuildAttempt / GenerationState / InvalidationRecord | 候选先独立筛选；规则/字段不得伪造独立状态机 |
| Policy / Invariant | 候选隔离/覆盖/授权/写栅栏 | 候选先独立筛选；规则/字段不得伪造独立状态机 |
| Projection / Read model | 候选projection复用CP3 | 候选先独立筛选；规则/字段不得伪造独立状态机 |
| Reference / Boundary | owner baseline/cursor refs | 候选先独立筛选；规则/字段不得伪造独立状态机 |
| Audit / History | 失效及attempt结果历史 | 候选先独立筛选；规则/字段不得伪造独立状态机 |

#### 非职责与接缝

不从旧projection/SDK cache/archive重建，不修source truth、不假定bus executor。RecoverySourcePort读取baseline/允许接续；CP3复用apply；WorkspaceStorePort栅栏与原子切换；CP7只读状态。

#### 本部分回填与停审

正式§5摘录本部分职责、两表、非职责/接缝。

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能→候选→后续 | pass | RebuildAttempt、GenerationState、InvalidationRecord均有上述capability来源；字段留Step6 |
| 数据owner/接缝 | pass | 仅本地候选/当前指针/安全失效；用户intent不覆盖；不越权 |
| 正向外部合同 | blocked | 沿项目WS-UP，不用本部分对象补owner定义 |

模块gate_status=pass；允许下一部分思考。

### CP7 读取与交接 校准

问题/依据：U6与00能力要求本部分完成Personal/Project读取、Inbox/local/维护结果查询、临时聚合、分页与只读export。
诊断：不创建partition/标已读/触发维护，不拥有UI/cache/sync/archive状态；必须避免把相邻状态混入本部分。
取舍：使用WorkspaceQueryService承接该功能，以CP1/2正式解析优先；CP3/4/5/6同语境只读；OwnerSourcePort临时聚合；无下游写adapter隔离；不创建新的外部truth副本。
模块思考门禁：pass；下批仅写本部分结构化，不开始其他部分。
#### 本部分职责与capability

Personal/Project读取、Inbox/local/维护结果查询、临时聚合、分页与只读export。

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| Personal/Project读取、Inbox/local/维护结果查询、临时聚合、分页与只读export | ActorContext、scope、selector/filters、稳定版本或page cursor | WorkspaceReadView/安全诊断与多轴姿态 | 所有查询no-write；临时source聚合无durable revision | Step6~9 |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| WorkspaceQueryService | application/domain service | 编排本部分capability | §7/8；完整service对象留03 |
| WorkspaceReadView | 候选对象 | 承接本部分局部状态或安全语境 | §6独立筛选展开，§8/9反查 |
| WorkspacePageCursor | 候选对象 | 承接本部分局部状态或安全语境 | §6独立筛选展开，§8/9反查 |

#### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | - | 不适用，无本部分对象 |
| Policy / Invariant | 读取安全/游标绑定规则 | 候选先独立筛选；规则/字段不得伪造独立状态机 |
| Projection / Read model | WorkspaceReadView | 候选先独立筛选；规则/字段不得伪造独立状态机 |
| Reference / Boundary | WorkspacePageCursor | 候选先独立筛选；规则/字段不得伪造独立状态机 |
| Audit / History | 只读provenance非新审计truth | 候选先独立筛选；规则/字段不得伪造独立状态机 |

#### 非职责与接缝

不创建partition/标已读/触发维护，不拥有UI/cache/sync/archive状态。CP1/2正式解析优先；CP3/4/5/6同语境只读；OwnerSourcePort临时聚合；无下游写adapter。

#### 本部分回填与停审

正式§5摘录本部分职责、两表、非职责/接缝。

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能→候选→后续 | pass | WorkspaceReadView、WorkspacePageCursor均有上述capability来源；字段留Step6 |
| 数据owner/接缝 | pass | 所有查询no-write；临时source聚合无durable revision；不越权 |
| 正向外部合同 | blocked | 沿项目WS-UP，不用本部分对象补owner定义 |

模块gate_status=pass；允许下一部分思考。

## 8. 回填草稿

正式§5摘录本文件§7的结论表/图；模块附录只摘录已停审结论，不复制讨论过程。详细字段不越过概要粒度。

## 9. 待确认事项

WS-UP-001~008/006-S持续开放；仅允许本地骨架与负向边界收口，受影响正向合同不能交实现。

装配前机械整理记录：按CP1→CP7恢复阅读顺序，未改变原执行先后；操作记录共享结构不表示CP5拥有CP1业务；内部scope解析名称统一到Step7。

## 10. 进入下一步条件

七CP全部经过独立思考/结构化/停审；16关键候选无重复；总表、维度表、交互图及后续展开检查完成。未来Step命名承接作为Step6~9输入，非当前孤儿对象。
自检仅为文档静态审查，不是测试执行或上游签署。gate_status=pass；允许进入Step 6。
