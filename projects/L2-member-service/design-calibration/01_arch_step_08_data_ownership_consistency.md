# 01 架构校准 Step 8：数据所有权与一致性策略

> 状态：completed / pass
> 日期：2026-08-23
> 前序门禁：Step 7 completed / pass
> 本步目的：固定本仓 truth、snapshot / projection、reference、forbidden body 和一致性层次，并逐架构单元停审

## 1. Step 内计划

- [x] 读取 flow、台账、Step 3 / 5 / 7 与正式 00 的 D-MS-001~037 / E01~E04。
- [x] 逐项回答本仓拥有什么 truth、只持有什么影子、明确不拥有什么正文。
- [x] 按 A1~A5、S1~S3、P1~P3 归集数据责任。
- [x] 先收稳数据归属，再判断强一致、最终一致、幂等和 unknown 收束。
- [x] 诊断共享数据库、外部正文复制、cache / projection 反写和分布式事务污染。
- [x] 输出数据归属表、一致性表、简化关系图和失败约束。
- [x] 完成单元停审、跨数据审计、正式 §9 回填草稿和 gate 自检。

## 2. SOP 问题回答

### 2.1 本仓拥有哪些正式真相

1. A1：宿主意图受理、范围判定、编排决定、重复 / 冲突结论和决定追溯。
2. A2：宿主实例与世代、装配条件、分项装配本地结果和 host readiness。
3. A3：注册接受 / 替换 / 拒绝、活动 endpoint、注册历史、host session 壳及可用性。
4. A4：宿主健康、失败分类、恢复 / restart / stop / terminate / hold 决定和外部副作用 unknown。
5. A5：本地下线收束、cleanup / release 决定 / attempt / gap / residual、orphan / drift / reconciliation 结论。
6. S3：从已提交 host truth 形成的 body-free material、local handoff attempt / gap 和安全消费形成事实。

S1 / S2 不建立第二业务 truth：它们收束外部资格和能力反馈，最终由 A1~A5 形成本仓正式结论。P1~P3 只承载 snapshot / ref / projection。

### 2.2 哪些数据只是 snapshot、projection 或 reference

- P1：ProjectMember / GlobalMember 双锚、来源 / 授权摘要、pinned supply、credential qualification 与 freshness。
- P2：Member signal、Runtime ref、SandboxBinding / cleanup ref、carrier / registry ref、backend / external completion 安全摘要。
- P3：host safe view、聚合消费视图、交接状态投影和可重建索引。
- typed refs 只表明关联，不意味着外部正文、状态机或完成事实进入本仓。

### 2.3 哪些正文和 truth 明确禁止拥有

Identity / Work / Governance 正文；Member request / signal / presence / interaction body；Runtime run / turn / goal / plan / memory / checkpoint / outcome / entry body；image / build / signature / BOM / provenance evidence body；credential / secret；ToolInvocation / capability / external MCP / A2A / API truth；Sandbox policy / enforcement / capture / cleanup body；backend resource / filesystem / dump / log body；Bus receipt body、Observability / Artifact / Archive / Evidence / report / verdict body。

### 2.4 哪些关系必须强一致

- 本仓内一个正式决定及其来源 / 主语 / 当前宿主追溯关系。
- 宿主实例身份、世代和当前指向，不能出现竞争当前实例。
- 每次装配结论与组成该结论的本地分项结果 / 缺口关联。
- 活动注册、endpoint 和 host session 唯一关联及其替换 / 失效。
- 健康 / 恢复 / 终止决定与所依据的宿主实例、来源摘要和 generation fence。
- 本地下线关联失效、cleanup / release 决定和 residual / gap 结论。
- body-free material 与其来源 host truth / local handoff attempt 的关联。

这里的强一致只指本仓正式提交边界，不声称与外部 owner 或基础设施形成跨仓事务。

### 2.5 哪些关系允许最终一致

- 外部 owner truth 到 P1 / P2 snapshot 的刷新与 freshness。
- 外部承载 / Sandbox 实际状态到本仓本地结果 / reconciliation 的收敛。
- 本仓 truth 到 P3 safe view、Bus delivery、Observability observed 和下游 consumption 的传播。
- local cleanup / release attempt 到 external completion 摘要的关联。

最终一致不等于忽略差异：必须显示 stale、unresolved、partial、unknown、residual、gap、not delivered 或 not observed。

### 2.6 失败时如何约束、补偿或挂起

- 外部资格不可解析：保持 invalid / stale / conflict / unknown，阻塞受影响决定，不复制正文补齐。
- 外部动作结果未知：提交本地 unknown / gap，使用实例世代 fence 和对账确认，禁止盲重放不可逆动作。
- 重复 / 迟到反馈：依据稳定幂等锚和关联世代形成同一结论或新关联事实，不覆盖历史。
- 投影 / 传播失败：保留旧视图、stale 或 gap，可重建 / 重试；不得回滚核心 truth。
- 外部 cleanup 未证实：保留 residual，不把 local attempt 写成 external completed。

## 3. 当前材料诊断与取舍

| 历史 / draft 内容 | 诊断 | 本步取舍 |
|---|---|---|
| Identity Store / Work 副本 | 外部正文复制会形成第二 truth | 只保留 P1 typed ref / safe snapshot / freshness。 |
| PostgreSQL 主表 + Redis cache | 存储产品与缓存策略过早 | 只要求正式状态承载；产品、表和 cache 后移。 |
| outbox 与跨系统事务 | 实现机制冒充一致性，且容易声称端到端原子 | 只固定本仓内强一致提交和外围最终一致 / gap。 |
| endpoint 当前值覆盖 | 会丢失注册替换 / 失效历史 | 活动唯一 + 历史连续，迟到反馈不覆盖。 |
| backend resource state 作为 host state | 设施状态反向定义 domain truth | 只作为 P2 snapshot / ref，经 A2 / A4 / A5 形成本地判断。 |
| receipt / observed 回写完成状态 | 外部完成层反写本地 truth | local truth、attempt / gap、external status 分层。 |
| Runtime checkpoint 用于 host recovery | 读取并拥有 Runtime 内容 | 只保存 ref；宿主恢复决定与 Runtime 内容恢复完全分离。 |

## 4. 结构化中间产物

### 4.1 数据归属表

| 数据项 | 数据类型 | 归属说明 | 边界说明 |
|---|---|---|---|
| 宿主意图、范围与编排决定 | 正式真相数据 | A1 拥有 accepted / rejected / waiting / conflict / no-action 和宿主决定 truth。 | Work 分配、Identity 和 authorization truth 不转移。 |
| 宿主实例、世代与装配 / readiness | 正式真相数据 | A2 拥有逻辑实例、世代、分项本地结果和 readiness truth。 | image、credential、Sandbox、carrier / registry truth 仍在外部。 |
| 注册、endpoint 与 Host Session | 正式真相数据 | A3 拥有 acceptance、活动关联和连续历史。 | Member 请求 / 报告和 Runtime run 只作输入 / ref。 |
| 宿主健康、失败与恢复 / 终止决定 | 正式真相数据 | A4 拥有四类健康和宿主侧处置 truth。 | 不等于 Runtime recovery、backend status 或 observed truth。 |
| 下线、local cleanup / release 与 reconciliation | 正式真相数据 | A5 拥有本地收束、attempt / gap / residual、orphan / drift 和处置 truth。 | external cleanup completed 只由外部 owner 声明。 |
| 宿主安全材料与 local handoff | 正式真相数据 | S3 拥有 body-free material formation、local attempt / gap。 | Bus delivery、observed、accepted 和 report / evidence truth 外置。 |
| 外部资格影子 | 快照 / 投影数据 | P1 保存双锚、来源、pinned supply、credential qualification 和 freshness 摘要。 | snapshot 不能修复或替代来源 truth。 |
| 外部运行 / 完成影子 | 快照 / 投影数据 | P2 保存信号、backend、binding、runtime 和 external completion 安全摘要。 | 原始 signal、run、capture、resource state 和 receipt body 禁止进入。 |
| 宿主安全消费视图 | 快照 / 投影数据 | P3 从已提交 truth 派生 safe / aggregate / handoff status view。 | 可迟滞、可重建，不是命令源或验收 truth。 |
| 项目主语、身份、供给与 credential 关联 | 引用关系数据 | 本仓保存 typed ref 和实例 / 决定关联。 | ref 可失效，不表示正文归属。 |
| Member / Runtime / Sandbox / carrier / downstream 关联 | 引用关系数据 | 本仓保存 host-side association refs。 | 正向合同 pending 时只允许 placeholder / unresolved。 |
| 外部领域、运行、隔离、基础设施、观测与证据正文 | 明确不拥有的正文 / 真相 | 由各正式 owner 拥有，本仓禁止吸收。 | 只允许 typed ref、safe summary、redacted marker 或 body-free material。 |

### 4.2 一致性策略表

| 数据关系 / 场景 | 关联数据类型 | 一致性口径 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 意图结论 -> 编排决定 -> 决定追溯 | 正式真相数据 | 本仓内强一致 | 整体拒绝或保持未决定，不形成孤儿决定 | 决定必须能回指主语和来源。 |
| 当前宿主实例 -> 世代历史 | 正式真相数据 | 本仓内强一致 + single-active fence | 冲突时 blocked / unknown，不建立竞争当前实例 | restart 建新实例，不覆盖旧历史。 |
| 分项装配结果 -> Host readiness | 正式真相数据 + snapshot / ref | 本仓结论强一致；外部来源时点一致 | 缺失 / stale / conflict / unknown 均为非 ready | 不需要跨 owner 事务，但判断依据必须冻结关联。 |
| 注册接受 -> endpoint -> Host Session | 正式真相数据 | 本仓内强一致 + 活动唯一 | 重放返回稳定结论；冲突拒绝或挂起 | 防止第二活动注册 / session。 |
| 来源信号 -> 健康结论 | snapshot / ref -> 正式真相数据 | 时点判断一致 + 顺序 / freshness 约束 | 迟到不覆盖；证据不足为 unknown | 原始信号不是健康 truth。 |
| 恢复 / 终止决定 -> 实例世代 | 正式真相数据 | 本仓内强一致 + generation fence | 结果未知则 hold / unknown / reconciliation | 防止旧实例迟到结果影响新实例。 |
| 下线失效 -> local cleanup / residual | 正式真相数据 + ref | 本仓内强一致；外部完成最终一致 | 外部失败保留 gap / residual，不回滚终止 truth | local attempt 不等于 external completed。 |
| 本地 truth -> safe view | 正式真相数据 -> 快照 / 投影数据 | 最终一致 | 保留 stale / unavailable，可重建 | 投影失败不阻塞或反写核心。 |
| 本地 truth -> Bus / Observability / downstream | 正式真相数据 -> ref / external truth | 最终一致 + local attempt 追溯 | 保留 gap，不声明 delivered / observed / accepted | 外部状态不参与本地提交原子性。 |
| 本地 truth <-> backend / binding 实际状态 | 正式真相数据 <-> snapshot / ref | 对账最终一致 | mismatch 形成 orphan / drift / unknown 和处置决定 | 不通过删除历史消除差异。 |
| 重复、并发、迟到和乱序输入 | 所有可写 truth | 幂等 + 顺序 / 世代约束 | 稳定重放、拒绝冲突或追加关联事实 | 不盲重放不可逆副作用。 |
| 引用 -> 外部正文 | 引用关系数据 -> 明确不拥有 | 边界约束一致 | unresolved / stale / blocked，不本地补正文 | 引用存在不转移 ownership。 |

### 4.3 简化关系示意图

```text
        +--------------------------+      +--------------------------+
        | external truth owners    |      | external raw bodies      |
        | identity/work/etc.       |      | forbidden / no input edge|
        +------------+-------------+      +--------------------------+
                     | typed ref / safe snapshot
                     v
        +------------+-------------+
        | P1/P2 shadow boundary    |
        | stale/unknown explicit   |
        +------------+-------------+
                     | qualified context
                     v
        +------------+-------------+
        | A1~A5 / S3 local truth  |
        | decisions and facts     |
        +------------+-------------+
                     | read-only derivation
                     v
        +------------+-------------+
        | P3 safe projections     |
        | rebuildable             |
        +--------------------------+
```

图后说明：
- A1~A5 与 S3 承载本仓正式 truth，P1 / P2 和 P3 都不能反写这些 truth。
- 外部 owner 只能通过 typed ref / safe snapshot 进入 P1 / P2；stale / unknown 必须显式。
- external raw bodies 没有进入本仓的连线，表示正文无论多相关都不得被吸收。
- 图不表达数据库、事务实现、缓存、同步任务、事件流或字段结构。

## 5. 按架构单元的数据所有权与停审

| 单元 | 正式 truth | snapshot / projection / ref | forbidden body / write | 一致性口径 | 结果 |
|---|---|---|---|---|---|
| A1 | 意图 / 范围 / 决定 / trace | P1 refs / summaries | Work / Identity / auth body | 本仓内强一致 | pass |
| A2 | instance / generation / assembly / readiness | P1 / P2 | image / credential / Sandbox / backend body | 本仓强一致 + 外部时点一致 | pass |
| A3 | registration / endpoint / host session | P2 Member / Runtime refs | Member body / Runtime run | 活动唯一 + 历史连续 | pass |
| A4 | health / failure / recovery decision / unknown | P2 signals / feedback refs | checkpoint / backend / observed body | 时点判断 + generation fence | pass |
| A5 | closure / cleanup attempt / residual / reconciliation | P2 external completion refs | external cleanup / receipt body | 本仓强一致 + 外部最终一致 | pass |
| S1 | 无独立核心 truth | P1 qualification snapshots / refs | external truth modification | 资格关联时点一致 | pass |
| S2 | 无独立核心 truth | P2 capability refs / summaries | backend / isolation truth write | 反馈关联 + unknown | pass |
| S3 | material formation / local handoff attempt / gap | P3 views / receipt summaries | delivery / observed / accepted write | 来源强关联 + 外部最终一致 | pass |
| P1 | none | qualification snapshot / ref | 反写 A1 / A2；保存外部正文 | 最终一致 + freshness | pass |
| P2 | none | runtime / carrier / binding / completion snapshot / ref | 反写 A2~A5；保存正文 | 最终一致 + reconciliation | pass |
| P3 | none | safe view / aggregate projection | 命令或核心写入 | 最终一致 + rebuildable | pass |

## 6. 跨数据边界审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 是否存在双真相 | pass | 外部 owner 只通过 P1 / P2 / ref 参与；本仓 truth 限于 host-side facts。 |
| projection 是否反写 | pass | P3 和外围视图明确只读、可重建。 |
| 引用是否吸收正文 | pass | forbidden body 全量排除，unresolved 不本地补齐。 |
| 强一致是否跨仓扩张 | pass | 强一致仅限本仓提交；外部关系均时点或最终一致。 |
| unknown / partial 是否有收束 | pass | fence、gap、residual、reconciliation 和禁止盲重放均明确。 |
| S1 / S2 是否形成第二核心 truth | pass | 两者只承接资格 / 能力，正式结论回归 A1~A5。 |
| S3 support truth 是否越界 | pass | 只拥有 material / local attempt / gap，不拥有外部完成。 |

## 7. 回填草稿

- 正式 §9 采用 12 行数据归属表、12 行一致性策略表、简化关系图和数据边界短文。
- 正式正文保留“本仓内强一致不等于跨 owner 分布式事务”的明确判断。
- 单元数据停审和跨数据审计留在 calibration；具体对象、字段、表和事务实现后移。

## 8. Gate 自检

| 检查项 | 结果 |
|---|---|
| truth / snapshot / projection / ref / forbidden 是否完整 | pass |
| 11 个架构单元是否逐项停审 | pass |
| 强一致 / 最终一致 / 幂等 / unknown 是否有关系级口径 | pass |
| 是否预设数据库、缓存、outbox 或分布式事务 | pass（均未采用） |
| 是否存在 unresolved 数据 owner 冲突 | pass（无） |
| 是否允许创建 Step 9 | pass；须先同步 flow 与项目台账 |

```text
gate_status = pass
next_allowed_action = update_flow_and_ledger_then_create_step_09
formal_01_write_allowed = false
```
