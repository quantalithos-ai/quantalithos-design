# Step 4. 代码主体框架

## 1. Step 状态与计划

- 模式：full-restart / single-agent-serial；输入门禁 pass；思考记录、结构化、回填、自检 done。
- gate_status=pass；gate_reason=本Step静态自检完成；next_allowed_action=由flow串行推进；formal_fill_allowed=step14_only。
- source_files：Step 3；01 §6~11；项目台账；02 flow；概要SOP对应Step与概要规范对应章节。
- 写入前检查：本项目/本文档授权有效；无正式正文污染；分批规模不限制最终完整性。

### Step 内计划

1. 已读取三层台账、前序及规范。
2. 问题回答、诊断、取舍见§3~6。
3. 两张必需图、U到CP映射和shared boundary判断；Step5再逐CP发现对象
4. 结构化后后置历史审计；从§7摘录回填。
5. 自检通过后更新flow，不把上游pending改为闭合。

## 2. 本步输入

Step 3；01 §6~11；00 FR-WS-001~010/BR-WS-001~012；01 §6/8/9/10/13/15。前步的问题回答、诊断、取舍、待确认均承接，具体依赖见flow §3。

## 3. SOP 问题回答

1. U1落scope/partition管理；U2拆安全输入与统一裁剪依赖；U3为投影应用；U4拆Inbox派生与local intent；U5为恢复；U6为读组合。2. 三运行角色进入Inbound/Operations，再Application编排。3. Domain持局部不变量，Ports定义消费与原子存储，Adapters实现。4. 服务、数据主语和关键Port需要先命名。5. crate路径、框架/数据库不进入本Step。

## 4. 当前文档问题诊断

直接一单元一crate会混合业务轴和实现轴；让所有来源逻辑塞进WorkspaceService会把可见性、原子写和query副作用边界混为一体。

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 尚无本Step正式校准；01只有架构约束 | 本Step将已核验边界转为代码主体框架，不补上游schema |

## 6. 设计取舍

采用七个业务组成部分：CP1分区范围、CP2安全来源、CP3连续投影、CP4Inbox、CP5局部意图、CP6恢复、CP7读取交接。U4拆两部分因重建所有权不同，其余沿既定语义细化；不采用按六个上游域各建truth模块。

## 7. 结构化中间产物

### 7.1 架构到组成部分

| 架构单元 | 主要组成部分 | 代码主体 |
|---|---|---|
| U1 | CP1 分区与范围 | ScopeService、PartitionService、WorkspacePartition、ScopeResolverPort |
| U2 | CP2 安全来源消费 | SourceReadService、SourceSlice、VisibilityBinding、OwnerSourcePort、VisibilityResolverPort |
| U3 | CP3 连续投影 | ProjectionApplyService、PartitionProjection、SourceApplicationRecord、SourceCoverage、WorkspaceStorePort |
| U4派生 | CP4 Inbox投影 | InboxProjector、InboxItem |
| U4局部truth | CP5 局部注意力 | LocalAttentionService、LocalAttentionState、ReadCursor、WorkspaceOperationRecord |
| U5 | CP6 失效与重建 | RecoveryService、RebuildAttempt、GenerationState、InvalidationRecord、RecoverySourcePort |
| U6 | CP7 读取与交接 | WorkspaceQueryService、WorkspaceReadView、WorkspacePageCursor |

#### 架构模块到代码主体映射图

```text
L1-workspace
├─ U1 / CP1 分区与范围
│  └─ ScopeService / PartitionService / ScopeResolverPort
├─ U2 / CP2 安全来源消费
│  └─ SourceReadService / VisibilityResolverPort / OwnerSourcePort
├─ U3 / CP3 连续投影
│  └─ ProjectionApplyService / WorkspaceStorePort
├─ U4 / CP4 Inbox投影
│  └─ InboxProjector
├─ U4 / CP5 局部注意力
│  └─ LocalAttentionService / WorkspaceOperationRecord
├─ U5 / CP6 失效与重建
│  └─ RecoveryService / RecoverySourcePort
└─ U6 / CP7 读取与交接
   └─ WorkspaceQueryService / WorkspaceReadView
```

关键说明：

- U4拆分以保护派生Inbox与不可被重建覆盖的用户意图，不改变01 ownership。
- 图中主体是代码骨架，不是crate/目录/部署或已存在实现。

#### 实现分层视图

```text
外部请求 / owner事件 / 显式维护
                 │
                 ▼
Inbound / Operations
                 │
                 ▼
Application Services
                 │
                 ▼
Domain Model + Contracts
                 │
                 ▼
Ports  ◄── Adapters / Persistence
```

关键说明：

- 入口负责分类及上下文，Application编排，Domain保护局部不变量；图不定义具体框架。
- Ports的实现适配只能调用正式owner读取/事件接缝，query不能获取写能力。
- 共享词汇不生成共享业务owner，原子存储跨CP协调仍限本仓分区。

### 7.2 双轴与shared boundary判断

| 项 | 说明 |
|---|---|
| 业务主要组成部分 | CP1~CP7说明业务结构做什么；不是七个独立部署 |
| 实现分层 | Inbound/Application/Domain/Ports/Adapters说明主体放哪里 |
| 关系 | 一个CP跨层实现；同一实现层可以承接多个CP，03再选module/crate布局 |
| 共享边界 | principal/scope、source identity、版本种类、请求/操作元数据由本地contracts统一引用；Core exact经核验，不重复造shared schema |
| 持久化协作 | CP3应用与CP4派生共用分区原子提交；CP5 local intent独立于generation，CP6切换不覆盖它 |
| 本轮无Outbox主体 | 未授权workspace outbound family；本地应用/操作记录不是bus outbox |

### 7.3 关键判断

七CP是本轮概要组成部分，六U是既定架构语义，两者不按数字机械等同；不按identity/work等源域建立内部truth对象。
技术产品与语言未选择。本层不存在新增架构技术选型，只有既有边界的代码主体化。

## 8. 回填草稿

正式§4摘录本文件§7的结论表/图；模块附录只摘录已停审结论，不复制讨论过程。详细字段不越过概要粒度。

## 9. 待确认事项

WS-UP-001~008/006-S持续开放；仅允许本地骨架与负向边界收口，受影响正向合同不能交实现。

## 10. 进入下一步条件

### 后置历史冲突审计

| 历史位置 | 旧口径 | 当前判断 | 理由/回填影响 |
|---|---|---|---|
| README §一~三 | 未完成00/01、页面式Personal/Project | 废弃状态；scope语义经00/01核验保留 | README不改，不能作当前台账 |
| draft/03 §1 | 九组成部分与旧FR001~018 | 修改为七CP；FR以正式00的001~010为准 | Personal/Project组合合并，Inbox/意图拆分；横切truth core非独立业务部分 |
| draft/03 §4.1 | current/stale/partial/blocked混为projection状态 | 废弃混轴集合 | 采用01的多轴姿态与独立generation生命周期 |
| draft/03 §2 | Outbox候选层 | 后移/阻塞 | 当前无workspace outbound family，不创建Outbox主体 |
| draft/03 §4.3 | export或本地handoff attempt | 只保留纯read/export | query不持久化handoff；未定义archive状态 |

两必需图及双轴表齐全；后置历史审计已纠正九候选、旧FR编号、混轴状态与Outbox污染。七CP无新增truth，允许Step5逐部分校准。
自检仅为文档静态审查，不是测试执行或上游签署。gate_status=pass；允许进入Step 5。
