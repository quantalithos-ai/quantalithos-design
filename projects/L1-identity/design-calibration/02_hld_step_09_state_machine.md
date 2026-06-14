# Step 9. 状态定义与状态流转

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 9
> 回填章节: `02-概要设计.md` §9 状态定义与状态流转
> 生成日期: 2026-06-11
> 状态: 9-I 已完成,等待审核后进入 Step 10

---

## 1. Step 状态 + Step 内计划

本 Step 不沿用旧版一次性状态总表。本轮先建立 Step 9 执行框架,再按 Step 5 的 8 个主要组成部分逐个收敛状态主语、状态含义、允许迁移、禁止迁移和传播影响。每批完成后停审,最后做跨状态一致性审计。

| 计划项 | 状态 | 产物位置 |
|---|---|---|
| 读取 Step 6 关键对象、Step 7 状态触发接口、Step 8 处理流和最新版 Step 9 SOP / 书写规范 | 已完成 | §2 |
| 回答 Step 9 SOP 问题 | 已完成 | §3 |
| 诊断旧 Step 9 一次性状态机的问题 | 已完成 | §4 |
| 比较改动前后口径 | 已完成 | §5 |
| 记录采用 / 不采用的设计取舍 | 已完成 | §6 |
| 建立状态主语选择规则、迁移图模板和状态传播判断规则 | 已完成 | §7.1~§7.3 |
| 建立 9-A~9-I 小循环计划 | 已完成 | §7.4 |
| 逐批补充“身份锚定与成员真相”状态集合 | 已完成 | §12 |
| 逐批补充“全局生命周期”状态集合 | 已完成 | §13 |
| 逐批补充“角色能力摘要”状态集合 | 已完成 | §14 |
| 逐批补充“身份生涯记录”状态集合 | 已完成 | §15 |
| 逐批补充“记忆引用关系”状态集合 | 已完成 | §16 |
| 逐批补充“身份事实消费与追溯”状态集合 | 已完成 | §17 |
| 逐批补充“派生维护与对账”状态集合 | 已完成 | §18 |
| 逐批补充“身份事实传播与外部交接”状态集合 | 已完成 | §19 |
| 完成跨状态一致性审计 | 已完成 | §20 |
| 形成正式 `02` §9 回填草稿 | 已完成 | §20.9 |
| 列出待确认事项和进入下一步条件 | 已完成 | §10~§19.10 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步用途 |
|---|---|---|
| `02_hld_step_06_key_objects.md` | 已完成并已获用户认可 | 提供状态必须归属的关键对象、policy、projection、trace / outbox / handoff 主语 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成并已获用户认可 | 提供会触发状态变化的 Command、Inbound Event Consumer、Operations Job 和只读 Query |
| `02_hld_step_08_processing_flows.md` | 已完成并已获用户认可 | 提供状态触发来源、非法方向线索、传播影响和 Step 9 状态承接清单 |
| `02_hld_step_03_constraints.md` | 已完成并已获用户认可 | 提供 query no-write、report-only、forbidden body、eventual propagation、handoff 不伪成功等状态门禁 |
| `projects/L1-identity/00-需求文档.md` | 当前需求输入 | 提供 `FR-ID-*`、业务规则、VETO 和验收边界 |
| `projects/L1-identity/01-架构设计.md` | 当前架构输入 | 提供 identity 与相邻仓只通过 ref / summary / event / projection / handoff 协作的边界 |
| `standards/document/概要设计讨论流程_SOP.md` | 最新流程标准 | 规定 Step 9 必须按主要组成部分或关键对象标注状态归属并停审 |
| `standards/document/概要设计书写规范.md` | 最新正式结构标准 | 规定 §9 状态定义表、状态流转图、允许 / 禁止迁移和状态传播图 |
| 旧 `02_hld_step_09_state_machine.md` | legacy draft | 只作为诊断输入,不得直接继承为新版结论 |

---

## 3. SOP 问题回答

### 3.1 本仓有哪些影响主线成立的正式状态?

当前 Step 9 只承接 Step 6 / Step 8 已出现的状态主语,不新增临时状态对象。候选状态主语如下:

| 状态主语 | 来源 | 所属主要组成部分 | 当前处理 |
|---|---|---|---|
| `IdentityAnchorState` | Step 6 / Step 8 §20.7 | 身份锚定与成员真相 | 9-A 展开 |
| `GlobalLifecycleState` | Step 6 / Step 8 §20.7 | 全局生命周期 | 9-B 展开 |
| `RoleCapabilitySummary` / source state | Step 6 / Step 8 §20.7 | 角色能力摘要 | 9-C 展开 |
| `CareerRecord.record_state` | Step 6 / Step 8 §20.7 | 身份生涯记录 | 9-D 展开 |
| `MemoryReferenceState` | Step 6 / Step 8 §20.7 | 记忆引用关系 | 9-E 展开 |
| `ProjectionState` | Step 6 / Step 8 §20.7 | 身份事实消费与追溯、派生维护与对账 | 9-F / 9-G 分别说明 query 只读与 job 维护语义 |
| `ReferenceResolutionState` | Step 6 / Step 8 §20.7 | 角色能力摘要、记忆引用关系、派生维护与对账 | 9-C / 9-E / 9-G 分别说明来源状态语义 |
| `ReconciliationReport` status | Step 6 / Step 8 §20.7 | 派生维护与对账 | 9-G 展开 |
| `OutboxState` | Step 6 / Step 8 §20.7 | 身份事实传播与外部交接 | 9-H 展开 |
| `HandoffState` | Step 6 / Step 8 §20.7 | 身份事实传播与外部交接 | 9-H 展开 |

若后续批次发现状态需要新 truth object 承接,必须回退 Step 6 / Step 8,不能在 Step 9 临时新增对象。

### 3.2 每个状态的含义是什么,是否可以进入正常主线?

本 Step 会为每个状态写四类判断:

| 判断项 | 说明 |
|---|---|
| 正常主线 | 状态允许继续被 Command / Query / Consumer / Job 正常消费 |
| 受限主线 | 状态可被读取或维护,但写路径需要 basis、policy、manual review 或 retry marker |
| 终态 / 保留态 | 状态不再允许普通业务推进,但 ref / trace / tombstone / report 必须保留 |
| 派生 / 维护态 | 状态只影响 projection、reference、outbox、handoff 或 report,不反写真相 |

### 3.3 哪些接口、事件或动作会触发状态迁移?

状态触发来源必须回指 Step 7 接口或 Step 8 处理流。当前触发类别如下:

| 触发类别 | 允许触发的状态主语 | 禁止事项 |
|---|---|---|
| Command | anchor、lifecycle、role capability summary、career append、memory reference、handoff intent | Query、Job、Outbound publish 不得伪造成业务 Command |
| Inbound Event Consumer | role source state、career source append marker、memory / archive source state、handoff callback marker | 不拥有外部 truth,不把外部事件绕过 policy 写成本仓核心 truth |
| Operations Job | projection state、reference resolution state、reconciliation report、outbox state、handoff delivery / retry marker | 不修复相邻仓 truth,不把 failed publish / handoff 当业务 truth 回滚 |
| Query | 无正式状态迁移 | 只能读取 found / not_found / not_visible / stale / degraded / failed surface |
| Outbound Event | 无直接状态迁移 | event material 来自 accepted fact;publish 状态由 outbox job 推进 |

### 3.4 哪些迁移明确允许,哪些迁移明确禁止?

每个批次会单独列允许 / 禁止迁移。全局禁止方向先固定如下:

| 禁止方向 | 原因 |
|---|---|
| Query 推进任何 truth / projection / reference / outbox / handoff 状态 | 违反 query no-write |
| Job 直接改写 `GlobalMember`、`GlobalLifecycleState`、`RoleCapabilitySummary`、`CareerRecord`、`MemoryReference` 业务 truth | 维护任务不是业务 Command |
| Publish / handoff delivery 成功反向决定 Command accepted | accepted truth 与传播可靠性分离 |
| `Tombstoned` / tombstone hold 回到可复用 ref | 违反 ref 不复用 |
| Career correction 原地修改旧记录 | 生涯记录是 append-only |
| Memory / archive unavailable 时保存 body 作为恢复手段 | 违反 forbidden body |
| Reconciliation finding 自动生成 remediation command | 对账 report-only |

### 3.5 状态变化如何影响 outbox、projection、下游感知或只读供给?

状态传播分三类:

| 传播类别 | 状态变化来源 | 传播口径 |
|---|---|---|
| accepted identity fact | anchor、lifecycle、role summary、career、memory reference accepted change | 产生 trace / outbox material,标记 projection stale,下游通过 event / query 感知 |
| derived maintenance marker | projection、reference、reconciliation report | 只影响 query freshness / degraded / report surface,不生成业务 fact event |
| propagation marker | outbox、handoff | 只表达 publish / delivery / receipt 状态,不改变业务 truth |

### 3.6 每个状态属于哪个主要组成部分或关键对象?

本 Step 按 9-A~9-H 逐主要组成部分展开。跨部分共享状态主语必须明确主归属和被读取方:

| 共享状态 | 主归属 | 被读取 / 影响方 |
|---|---|---|
| `ProjectionState` | 派生维护与对账 | 身份事实消费与追溯 Query |
| `ReferenceResolutionState` | 派生维护与对账 / 对应来源组成部分 | 角色能力摘要、记忆引用关系、对账 |
| `OutboxState` | 身份事实传播与外部交接 | 下游感知、retry job、outbox query |
| `HandoffState` | 身份事实传播与外部交接 | trace / audit / archive handoff query 和 retry job |

### 3.7 状态触发接口和处理流是否已经在 Step 7 / Step 8 定义?

当前框架只允许使用 Step 7 / Step 8 已存在的接口和处理流。待 9-I 做跨状态审计时,每个状态迁移都必须能回指:

```text
状态主语 -> 触发接口 -> Step 8 处理流 -> 允许 / 禁止迁移 -> 传播影响
```

### 3.8 是否存在同名 / 近义状态跨组成部分语义冲突?

潜在冲突先列为审计项,逐批写入后在 9-I 统一判断:

| 近义状态 | 风险 | 当前处理 |
|---|---|---|
| `Stale` | projection stale、reference stale、summary stale 可能混用 | 每个状态主语独立解释,不得跨对象复用含义 |
| `Unavailable` / `Failed` | 外部 source unavailable、projection rebuild failed、publish failed、handoff failed 含义不同 | 必须绑定对象和触发来源 |
| `Pending` | pending source、pending outbox、pending handoff、pending archive 不是同一状态 | 每批以对象名限定 |
| `Retired` / `Tombstoned` / held | lifecycle 与 anchor ref hold 容易混淆 | 9-A / 9-B 分开写,再定义联动关系 |

### 3.9 每个主要组成部分的状态集合完成后是否通过停审?

每批状态集合必须写停审记录:

| 停审项 | 通过条件 |
|---|---|
| 状态归属 | 状态能回指 Step 5 组成部分和 Step 6 对象 |
| 触发来源 | 每个允许迁移能回指 Step 7 接口和 Step 8 flow |
| 禁止方向 | 关键非法方向已明确,没有留给实现猜测 |
| 传播影响 | outbox、projection、reference、report、handoff 影响已说明 |
| 概要粒度 | 不写 enum 代码、错误码全集、SQL、retry 参数或 adapter 协议 |

---

## 4. 当前材料 / 旧文档问题诊断

| 材料 / 问题 | 诊断 | 本轮处理 |
|---|---|---|
| 旧 Step 9 一次性写成“已完成” | 与最新版 SOP “Step 5~9 按主要组成部分小循环停审”不一致 | 替换为新版框架,后续按 9-A~9-I 分批补充 |
| 旧 Step 9 使用旧状态词如 `Reserved` / `Active` / `Tombstoned` 直接定稿 | 未逐批回指 Step 7 / Step 8 触发来源,容易和新版接口命名漂移 | 仅作为候选诊断,正式状态名待对应批次收敛 |
| 旧 Step 9 把 `ProjectionState`、`ReferenceResolutionState`、`OutboxPublicationState`、`TraceHandoffState` 一次性混在一张表 | 容易混淆业务 truth 状态、派生维护状态和传播 marker | 本轮按业务 truth / derived marker / propagation marker 分开处理 |
| 旧 Step 9 的流转图过早给出完整状态图 | 没有先做每个组成部分停审,不利于发现同名状态冲突 | 后续每批只画本批核心图,9-I 再合并跨状态传播图 |
| 旧 Step 9 未显式说明 Query 不推进状态 | 可能导致 query stale / degraded 路径被实现成 hidden repair | 本轮把 query no-write 写入全局禁止方向 |
| 旧 Step 9 未明确“新增状态对象必须回退 Step 6 / 8” | 实现阶段可能从状态矩阵中反推新对象 | 本轮固定 Step 9 不新增状态主语 |

---

## 5. 改动前后对比

| 维度 | 旧口径 | 新口径 |
|---|---|---|
| 生成方式 | 一次性全仓状态总稿 | 先建 Step 9 框架,再按主要组成部分逐批写状态集合 |
| 状态来源 | 由状态表直接列出 | 必须从 Step 6 对象、Step 7 接口、Step 8 flow 反查 |
| 状态主语 | 可能混合业务 truth、projection、reference、outbox、handoff | 按业务 truth / derived marker / propagation marker 分类 |
| 流转图 | 先给完整图 | 每批画局部图,最后做跨状态传播图 |
| 禁止迁移 | 部分散落在说明中 | 每批必须列允许 / 禁止迁移 |
| Query 关系 | 只读约束不够突出 | Query 明确无状态迁移,只能返回状态 surface |
| 后续承接 | 直接看似可进详细设计 | 9-I 审计后才形成正式 §9 回填草稿 |

---

## 6. 设计取舍

| 取舍 | 是否采用 | 理由 |
|---|---|---|
| 按主要组成部分逐批展开状态 | 采用 | 与最新版 SOP 一致,能让状态归属、触发来源和传播影响逐批停审 |
| 一次性生成全仓状态总表 | 不采用 | 容易形成薄 calibration,也容易让同名状态语义冲突后置到实现阶段 |
| Step 9 新增状态对象以补全状态机 | 不采用 | 状态对象必须来自 Step 6;处理流触发必须来自 Step 8 |
| 将 projection / reference / outbox / handoff 状态和业务 truth 状态放进同一个统一生命周期 | 不采用 | 它们是不同语义的 marker,统一生命周期会误导实现为同一状态机 |
| 在概要层列完整 enum variant 和错误码 | 不采用 | 概要只收敛正式状态名、含义、迁移方向和传播影响;字段级 enum / error 后移 `03` |
| 每个状态都画完整图 | 不强制采用 | 只对影响主线或传播关系的状态画图;简单 append-only / report-only 可用迁移表说明 |

---

## 7. 结构化中间产物

### 7.1 状态主语选择规则

| 规则 | 说明 |
|---|---|
| 必须已有对象来源 | 状态主语必须能在 Step 6 找到对象、state object、projection、reference、outbox 或 handoff 主语 |
| 必须已有触发来源 | 迁移触发必须能回指 Step 7 接口或 Step 8 flow |
| 必须影响主线成立 | 只影响局部实现缓存、UI 展示、retry 计数、SQL row lock 的状态不进入概要 Step 9 |
| 必须排除外部 truth 状态 | ProjectMember、RoleDefinition、Memory、ArchivePackage、Runtime、Credential 等外部状态不得作为 identity 状态主语 |
| 必须分清业务 truth 与 marker | projection / reference / outbox / handoff / report 状态只表达派生或传播 marker,不得反向定义 identity truth |

### 7.2 状态定义表模板

| 状态主语 | 状态 | 含义 | 是否可进入正常主线 | 触发来源 | 说明 |
|---|---|---|---|---|---|
| `<对象或 marker>` | `<状态名>` | `<业务 / marker 语义>` | 是 / 否 / 受限 / 不适用 | `<Step 7 接口 / Step 8 flow>` | `<传播、边界或特殊约束>` |

### 7.3 状态流转与传播模板

```text
<initial_state>
    │ <trigger from Step 7 / Step 8>
    ▼
<state_a>
    │ <allowed trigger>
    ▼
<state_b>
```

允许的核心迁移:

- `<state_a> -> <state_b>`: `<触发来源和约束>`

禁止的核心迁移:

- `<state_x> -> <state_y>`: `<禁止原因>`

状态传播关系:

```text
<accepted truth / marker change>
    │
    ├─> <trace / outbox / projection / reference / report / handoff marker>
    └─> <query or downstream visible surface>
```

### 7.4 按主要组成部分的小循环计划

| 批次 | 主要组成部分 | 状态范围 | 必须明确的迁移 / 传播 | 本批停审重点 |
|---|---|---|---|---|
| 9-A | 身份锚定与成员真相 | `IdentityAnchorState` | establish、held / tombstone、ref 不复用、query not found / not visible 不创建 | anchor state 与 lifecycle terminal 的关系,不引入 account / credential / ProjectMember 状态 |
| 9-B | 全局生命周期 | `GlobalLifecycleState` | active / suspended / retired / tombstoned 候选、恢复 / 终态 / 高风险 basis | lifecycle 不由 runtime / ProjectMember / external event 直接推进 |
| 9-C | 角色能力摘要 | `RoleCapabilitySummary` / source state / `ReferenceResolutionState` | active / stale / unavailable / pending source / superseded 候选 | 不保存 role / capability definition body,source stale 不静默 accepted |
| 9-D | 身份生涯记录 | `CareerRecord.record_state` | append-only、correction append、duplicate no-op、superseded-by-correction 候选 | 不原地修改 career,不保存 work body / ProjectMember truth |
| 9-E | 记忆引用关系 | `MemoryReferenceState` / memory source state | linked / stale / unavailable / pending archive / archived / failed 候选 | body-free memory / archive ref,archive handoff 不伪成功 |
| 9-F | 身份事实消费与追溯 | query visible surface、`ProjectionState` 只读解释 | found / not_found / not_visible / stale / degraded / failed surface | Query 不推进状态,visibility / redaction 不反写 truth |
| 9-G | 派生维护与对账 | `ProjectionState`, `ReferenceResolutionState`, `ReconciliationReport` status | rebuild / refresh / report-only finding / failed / partial | maintenance 不改业务 truth,对账不自动修复 |
| 9-H | 身份事实传播与外部交接 | `OutboxState`, `HandoffState` | pending / published / retryable failed / failed / skipped;handoff pending / delivered / failed / cancelled | publish / handoff 不作 accepted 前置,delivered 必须来自 receipt marker |
| 9-I | 跨状态一致性审计 | 全部状态 | 同名状态、触发覆盖、禁止迁移、传播影响、详细设计承接 | 不新增状态主语;形成正式 §9 回填草稿 |

### 7.5 每批状态输出模板

每个 9-A~9-H 小节必须包含:

1. 本批输入与承接。
2. 本批状态主语与状态定义表。
3. 状态流转图或迁移清单。
4. 允许迁移清单。
5. 禁止迁移清单。
6. 状态传播影响。
7. 与 Step 7 / Step 8 触发来源反查表。
8. 本批停审记录。
9. 回填草稿片段。
10. 下一批进入条件。

---

## 8. 复杂度判断 / 是否拆分

Step 9 必须分批写入,原因:

- Identity 至少有 10 个状态主语,且业务 truth、projection、reference、outbox、handoff 和 report marker 语义不同。
- `Stale`、`Pending`、`Failed`、`Unavailable` 等近义状态跨组成部分出现,如果一次性成表,很容易把不同对象的状态语义混用。
- Query no-write、report-only、eventual propagation、handoff 不伪成功等约束必须在状态层逐批验证。
- Step 9 是进入 Step 10 异常边界前的最后一个状态口径关口,不能留下“状态名看似存在但触发和禁止方向不闭合”的缺口。

本 Step 暂不拆附录。若某个批次超过可审查规模,只在当前 Step 到达该批次时按 `02_hld_step_09_<batch>_*.md` 建附录,不得提前创建未来 Step 文件。

---

## 9. 回填草稿

正式 `02-概要设计.md` §9 后续应包含:

1. 状态定义表,按状态主语说明状态含义、正常主线可进入性和触发来源。
2. 按主要组成部分组织的状态归属表。
3. 核心状态流转 ASCII 图。
4. 允许 / 禁止迁移清单。
5. 状态传播关系图,说明 accepted identity fact、projection/reference maintenance marker、outbox/handoff marker 如何影响 query 和下游感知。
6. 明确 Query 不推进状态、Job 不改业务 truth、publish / handoff 不回滚 accepted truth、tombstone / career append-only / report-only 等状态边界。

正式正文要等 9-A~9-I 完成并在 Step 14 统一装配,当前不直接回填。

---

## 10. 待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可 Step 9 只承接 Step 6 / Step 8 已出现的状态主语 | 若不认可,需回退 Step 6 / Step 8 补对象或处理流来源 | 当前不新增状态主语 |
| 是否认可 9-A~9-H 按主要组成部分逐批写入 | 若不认可,会回到旧版一次性状态总表风险 | 当前采用逐批停审 |
| 是否认可 projection / reference / outbox / handoff / report 状态属于 marker,不属于业务 truth 生命周期 | 若不认可,会导致维护 / 传播状态反向定义 identity truth | 当前严格区分 |
| 是否认可状态名最终以各批次收敛为准,旧 Step 9 仅作诊断输入 | 若不认可,旧状态词可能和新版接口 / 处理流漂移 | 当前不继承旧稿结论 |

---

## 11. 进入 9-A 的条件

进入 9-A “身份锚定与成员真相状态集合”前,需要用户确认:

- 本 Step 9 框架、状态主语选择规则和 9-A~9-I 小循环计划可接受。
- Step 9 不新增未来源于 Step 6 / Step 8 的状态主语。
- 每批完成后继续停审,不一次性写完整状态机。

当前已获用户确认,本文件进入 §12 9-A 批次。

---

## 12. 9-A 身份锚定与成员真相状态集合

### 12.1 本批输入与承接

| 来源 | 本批承接点 |
|---|---|
| `FR-ID-001` | `EstablishGlobalMember` 必须建立平台级成员身份主语 |
| `FR-ID-002` | `GetGlobalMemberAnchor` 只能读取成员锚点,不得隐式创建 |
| `FR-ID-003` / `BR-ID-001` | `GlobalMemberRef` 建立或进入 hold 后不得复用 |
| `BR-ID-002` / `VETO-ID-002` | query、projection、maintenance 不得创建成员 |
| `BR-ID-003` / `VETO-ID-001` | account、credential、runtime instance、ProjectMember 不得等同 `GlobalMember` truth |
| Step 6 `GlobalMember` | 承载平台级成员身份 truth 和稳定 `GlobalMemberRef` |
| Step 6 `IdentityAnchorState` | 承载锚定状态和不可复用持有状态 |
| Step 6 `IdentityAnchorPolicy` | 承接创建、防复用、query no-create 和边界混层 guard |
| Step 7 `EstablishGlobalMember` | `None -> Established` 的唯一建档触发来源 |
| Step 7 `GetGlobalMemberAnchor` | 只读 anchor state / summary,无状态迁移 |
| Step 8 §12 | 提供建档处理流、query no-create、outbox material 和 projection stale 线索 |
| Step 8 §20.7 | 明确 `IdentityAnchorState` 不得新增未来源状态主语 |

### 12.2 本批状态主语与定义表

本批只定义 `IdentityAnchorState` 的概要状态。`NoAnchorRecord`、`NotVisible`、`Stale`、`Degraded` 是 query / projection surface,不是持久化 anchor state。

| 状态主语 | 状态 | 含义 | 是否可进入正常主线 | 触发来源 | 说明 |
|---|---|---|---|---|---|
| `IdentityAnchorState` | `Established` | `GlobalMemberRef` 已被正式建立并绑定到一个 `GlobalMember` truth 主语 | 是 | `EstablishGlobalMember` accepted | 允许后续 lifecycle、role、career、memory 等能力依附该成员主语 |
| `IdentityAnchorState` | `RetiredHeld` | 成员已进入退役后的 ref 持有状态,ref 仍不可复用 | 受限 | `UpdateGlobalLifecycleState` 退役路径的 anchor side effect | 本批只定义 anchor hold 语义;退役生命周期本身在 9-B 展开 |
| `IdentityAnchorState` | `TombstoneHeld` | 成员已进入墓碑持有状态,ref 永久保留且不得复用 | 否,但可被追溯读取 | `UpdateGlobalLifecycleState` 墓碑路径的 anchor side effect | 不释放 ref,不允许重新建立新成员 |
| query surface | `NoAnchorRecord` | 读取时没有找到对应 `GlobalMember` / anchor state | 不适用 | `GetGlobalMemberAnchor` read miss | 不是持久状态;不得由 query 创建 `Established` |
| query surface | `NotVisibleAnchor` | 当前 actor 无权读取 anchor 摘要 | 不适用 | `GetGlobalMemberAnchor` visibility decision | 不等同不存在;不得泄露 source body 或内部原因正文 |

### 12.3 状态流转图

```text
<no anchor record>
    │ EstablishGlobalMember accepted
    ▼
Established
    │ lifecycle retire accepted
    ▼
RetiredHeld
    │ lifecycle tombstone accepted
    ▼
TombstoneHeld

Established
    │ lifecycle tombstone accepted
    ▼
TombstoneHeld
```

关键说明:

- `<no anchor record>` 是 create 前读取结果,不是 `IdentityAnchorState` 持久状态。
- `RetiredHeld` / `TombstoneHeld` 的触发来源属于全局生命周期 command,本批只定义 anchor ref 持有结果。
- `TombstoneHeld` 不释放 `GlobalMemberRef`,也不允许任何后续 create 复用该 ref。
- `GetGlobalMemberAnchor` 只读取状态和 surface,不参与状态迁移。

### 12.4 允许迁移清单

| 迁移 | 触发来源 | 约束 |
|---|---|---|
| `<no anchor record> -> Established` | `EstablishGlobalMember` accepted | 必须通过 `IdentityAnchorPolicy.assert_can_establish(...)` 和 `assert_ref_not_reused(...)`;必须有受控 actor、metadata、idempotency 和 body-free `IdentitySourceRef` |
| `Established -> RetiredHeld` | `UpdateGlobalLifecycleState` retire accepted | 9-A 只承接 anchor hold;生命周期合法性、高风险 basis 和 reason 在 9-B 展开 |
| `Established -> TombstoneHeld` | `UpdateGlobalLifecycleState` tombstone accepted | 直接墓碑化时 anchor 进入永久 hold;不释放 ref |
| `RetiredHeld -> TombstoneHeld` | `UpdateGlobalLifecycleState` tombstone accepted | 退役后可进一步进入墓碑 hold;不可恢复为可复用 ref |

### 12.5 禁止迁移清单

| 禁止迁移 / 方向 | 禁止原因 |
|---|---|
| `Established -> <no anchor record>` | 物理删除或释放 ref 会破坏身份引用稳定性和追溯 |
| `RetiredHeld -> Established` 作为新成员建档 | 会复用已退役 ref,违反 `BR-ID-001` |
| `TombstoneHeld -> Established` | 会复用墓碑 ref,违反 ref 不复用 |
| `TombstoneHeld -> <no anchor record>` | 墓碑 hold 必须保留,不能通过删除绕过防复用 |
| `GetGlobalMemberAnchor` 触发 `<no anchor record> -> Established` | Query no-write,读取不存在只能返回 not_found surface |
| `RebuildIdentityProjection` / `RefreshExternalReferenceState` 创建 `Established` | maintenance job 不得创建业务 truth |
| account / credential / runtime / ProjectMember event 直接创建 `Established` | 外部状态不是 identity 建档入口,不得绕过 actor、metadata、idempotency 和 anchor policy |

### 12.6 状态传播影响

```text
EstablishGlobalMember accepted
    │
    ├─> GlobalMember + IdentityAnchorState::Established
    ├─> IdentityTraceRecord
    ├─> IdentityOutboxRecord pending material
    ├─> MemberSummaryView / anchor projection stale
    └─> GetGlobalMemberAnchor returns found when visible

Lifecycle terminal accepted
    │
    ├─> GlobalLifecycleState transition handled in 9-B
    ├─> IdentityAnchorState::RetiredHeld or TombstoneHeld
    ├─> IdentityTraceRecord / IdentityOutboxRecord material
    └─> downstream sees ref held,not reusable
```

传播约束:

- Anchor state accepted change 可以产生 trace / outbox material 和 projection stale marker。
- Outbox publish 成功不决定 anchor state 是否 accepted。
- Projection stale / degraded 只影响 query surface,不得反写 `IdentityAnchorState`。
- Lifecycle terminal 到 anchor hold 的具体事务顺序、event payload 和 stored result 留给 `03` 详细设计闭合。

### 12.7 与 Step 7 / Step 8 触发来源反查表

| 状态 / surface | Step 7 来源 | Step 8 flow | 本批结论 |
|---|---|---|---|
| `Established` | `EstablishGlobalMember` | §12.6 `EstablishGlobalMember` 处理流 | 唯一建档 accepted 状态 |
| `RetiredHeld` | `UpdateGlobalLifecycleState` | 8-B / Step 9 承接线索 | anchor hold 结果在 9-A 定义,lifecycle 迁移在 9-B 展开 |
| `TombstoneHeld` | `UpdateGlobalLifecycleState` | 8-B / Step 9 承接线索 | 永久不可复用 hold |
| `NoAnchorRecord` | `GetGlobalMemberAnchor` | §12.7 `GetGlobalMemberAnchor` 处理流 | read miss surface,不是持久状态 |
| `NotVisibleAnchor` | `GetGlobalMemberAnchor` | §12.7 `GetGlobalMemberAnchor` 处理流 | visibility surface,不等同不存在 |
| projection stale / degraded | `GetGlobalMemberAnchor`, `RebuildIdentityProjection` | 8-A query / 8-G maintenance | query 只读,maintenance 只改 projection marker |

### 12.8 本批停审记录

| 停审项 | 结论 | 说明 |
|---|---|---|
| 状态归属 | 通过 | `IdentityAnchorState` 属于“身份锚定与成员真相”,并回指 Step 6 `GlobalMember` |
| 触发来源 | 通过 | `Established` 回指 `EstablishGlobalMember`;hold 状态回指 `UpdateGlobalLifecycleState` 的终态路径 |
| 禁止方向 | 通过 | query create、job create、ref release、retired / tombstone ref reuse 均明确禁止 |
| 传播影响 | 通过 | accepted anchor change 到 trace / outbox / projection stale / query surface 的影响已说明 |
| 概要粒度 | 通过 | 未写 enum 代码、SQL、repository trait、错误码全集、event payload 字段全集或事务细节 |
| 外部边界 | 通过 | account、credential、runtime、ProjectMember 状态未进入 anchor 状态机 |

### 12.9 本批回填草稿片段

正式 `02-概要设计.md` §9 后续可汇总为:

- `IdentityAnchorState` 表达 `GlobalMemberRef` 的锚定和不可复用持有语义,不等同全局生命周期。
- `Established` 只能由 `EstablishGlobalMember` accepted 创建;query、projection、maintenance 和外部 event 不得创建成员。
- `RetiredHeld` / `TombstoneHeld` 表达生命周期终态后的 ref hold,防止退役或墓碑成员 ref 被新成员复用。
- `NoAnchorRecord`、`NotVisibleAnchor`、stale / degraded 是读取 surface,不是 anchor truth 状态。
- Anchor accepted change 可产生 trace、pending outbox material 和 projection stale marker,但 publish / projection rebuild 不反向决定 anchor truth。

正式正文要等 9-I 完成并在 Step 14 统一装配,当前不直接回填。

### 12.10 进入 9-B 的条件

进入 9-B “全局生命周期状态集合”前,需要用户确认:

- `IdentityAnchorState` 只包含锚定和 ref hold 语义,不承接 lifecycle 可用性状态。
- `Established`、`RetiredHeld`、`TombstoneHeld` 的概要状态方向可接受。
- Query / Job / external event 不创建 `GlobalMember` 的禁止方向可作为后续详细设计门禁。

当前已获用户确认,本文件进入 §13 9-B 批次。

---

## 13. 9-B 全局生命周期状态集合

### 13.1 本批输入与承接

| 来源 | 本批承接点 |
|---|---|
| `FR-ID-004` | `GlobalLifecycleState` 必须表达成员在平台范围内的全局可用性 |
| `FR-ID-005` / `BR-ID-005` | 高风险生命周期处置必须具备 body-free `GovernanceBasisRef` |
| `BR-ID-004` | 生命周期变化必须来自显式 command,具备 actor 和 reason |
| `BR-ID-006` | runtime、task、ProjectMember 状态不得成为 lifecycle truth |
| `VETO-ID-004` | 不保存 governance basis body,不把 governance truth 纳入 identity |
| Step 6 `GlobalLifecycleState` | 承载 `Available`、`Paused`、`Retired`、`Tombstoned` 生命周期 truth state |
| Step 6 `LifecycleTransitionPolicy` | 承接显式 command、合法迁移、reason、actor 和来源 guard |
| Step 6 `HighRiskLifecycleGuard` | 承接高风险目标状态的 basis ref guard |
| Step 7 `UpdateGlobalLifecycleState` | 本批唯一 lifecycle truth 写入口 |
| Step 7 `GetGlobalLifecycleSummary` | lifecycle 只读入口,不推进状态 |
| Step 7 `GlobalLifecycleChanged` / `GlobalMemberAvailabilityChanged` | accepted lifecycle change 的 outbound material |
| Step 8 §13 | 提供 lifecycle command / query 处理流、高风险 basis、trace / outbox、projection stale 线索 |
| Step 8 §20.7 | 明确 `GlobalLifecycleState` 是 Step 9 必须承接的状态主语 |

### 13.2 本批状态主语与定义表

本批只定义 `GlobalLifecycleState` 的概要状态。`pending_basis`、`not_found`、`not_visible`、`stale`、`degraded` 是 command / query surface,不是持久化 lifecycle state。`IdentityAnchorState::RetiredHeld` / `TombstoneHeld` 是 9-A 已定义的 ref hold 结果,不替代生命周期状态。

| 状态主语 | 状态 | 含义 | 是否可进入正常主线 | 触发来源 | 说明 |
|---|---|---|---|---|---|
| `GlobalLifecycleState` | `Available` | 成员在平台范围内可被选择、调用或展示 | 是 | `EstablishGlobalMember` 初始建档;`UpdateGlobalLifecycleState` 恢复 accepted | 不代表 runtime instance 正在运行,也不代表 ProjectMember 可承担某项目职责 |
| `GlobalLifecycleState` | `Paused` | 成员被显式暂停,暂不可作为可用成员进入普通选择或调用主线 | 受限 | `UpdateGlobalLifecycleState` pause accepted | 可按正式 lifecycle command 恢复或继续处置;必须有 reason 和 actor |
| `GlobalLifecycleState` | `Retired` | 成员已退役,通常不再作为可用成员被选择 | 终态 / 保留态 | `UpdateGlobalLifecycleState` retire accepted | ref 不释放;anchor side effect 进入 `RetiredHeld` |
| `GlobalLifecycleState` | `Tombstoned` | 成员进入墓碑化生命周期状态,只保留追溯和防复用语义 | 终态 / 保留态 | `UpdateGlobalLifecycleState` tombstone accepted | ref 永久持有;anchor side effect 进入 `TombstoneHeld` |
| command surface | `PendingBasis` | 高风险目标状态缺少、不可用或待确认正式 basis | 不适用 | `UpdateGlobalLifecycleState` precheck | 不是持久 lifecycle state;不得在缺 basis 时先写入 `Retired` / `Tombstoned` |
| query surface | `LifecycleNotFound` | 读取时未找到 member 或 lifecycle summary | 不适用 | `GetGlobalLifecycleSummary` read miss | 不是持久状态;query 不创建或修复 lifecycle |
| query surface | `LifecycleNotVisible` | 当前 actor 无权读取 lifecycle 摘要 | 不适用 | `GetGlobalLifecycleSummary` visibility decision | 不等同不存在;不得泄露 governance basis body 或内部原因正文 |

### 13.3 状态流转图

```text
<new GlobalMember accepted>
    │ EstablishGlobalMember accepted
    ▼
Available
    │ UpdateGlobalLifecycleState pause accepted
    ▼
Paused
    │ UpdateGlobalLifecycleState resume accepted
    ▼
Available

Available
    │ UpdateGlobalLifecycleState retire accepted
    ▼
Retired
    │ UpdateGlobalLifecycleState tombstone accepted
    ▼
Tombstoned

Available
    │ UpdateGlobalLifecycleState tombstone accepted
    ▼
Tombstoned

Paused
    │ UpdateGlobalLifecycleState retire accepted
    ▼
Retired

Paused
    │ UpdateGlobalLifecycleState tombstone accepted
    ▼
Tombstoned
```

关键说明:

- `Available` 是成员建档后的初始 lifecycle state,但不表达 runtime health。
- `Paused` 是受限态,只允许通过显式 `UpdateGlobalLifecycleState` 恢复、退役或墓碑化。
- `Retired` 与 `Tombstoned` 是 lifecycle 终态 / 保留态;它们不释放 `GlobalMemberRef`。
- 高风险目标状态在写入前必须通过 `HighRiskLifecycleGuard`;缺 basis 时返回 `PendingBasis` 或 rejected surface,不得先写 lifecycle truth。

### 13.4 允许迁移清单

| 迁移 | 触发来源 | 约束 |
|---|---|---|
| `<new GlobalMember accepted> -> Available` | `EstablishGlobalMember` accepted | 建档 accepted 后生成初始 `GlobalLifecycleState`;必须具备 actor、reason 和 command metadata |
| `Available -> Paused` | `UpdateGlobalLifecycleState` pause accepted | 必须通过 `LifecycleTransitionPolicy.assert_explicit_command(...)` 和 `assert_allowed_transition(...)`;需要 reason 和 actor |
| `Paused -> Available` | `UpdateGlobalLifecycleState` resume accepted | 必须显式恢复,不得由 runtime recovered、query 或 projection rebuild 触发 |
| `Available -> Retired` | `UpdateGlobalLifecycleState` retire accepted | 属于高风险候选时必须通过 `HighRiskLifecycleGuard`;同步产生 anchor `RetiredHeld` side effect |
| `Paused -> Retired` | `UpdateGlobalLifecycleState` retire accepted | 暂停成员可进一步退役;不得由后台 job 自动推进 |
| `Available -> Tombstoned` | `UpdateGlobalLifecycleState` tombstone accepted | 必须通过高风险 basis guard;同步产生 anchor `TombstoneHeld` side effect |
| `Paused -> Tombstoned` | `UpdateGlobalLifecycleState` tombstone accepted | 暂停成员可直接墓碑化;必须保持 ref hold |
| `Retired -> Tombstoned` | `UpdateGlobalLifecycleState` tombstone accepted | 退役后可进一步墓碑化;不得恢复 ref 可复用性 |

### 13.5 禁止迁移清单

| 禁止迁移 / 方向 | 禁止原因 |
|---|---|
| `Retired -> Available` | 退役是保留态,恢复为普通可用成员会破坏生命周期终态语义 |
| `Tombstoned -> Available` | 墓碑化后不得重新进入可用主线,也不得复用 ref |
| `Tombstoned -> Paused` | tombstone 不是可恢复暂停态 |
| `Tombstoned -> Retired` | tombstone 已是更强保留态,不得降级为普通退役态 |
| `Retired -> Paused` | 退役后不再进入普通可用性控制状态 |
| `Query` 触发任意 lifecycle transition | `GetGlobalLifecycleSummary` 只能读取 found / not_found / not_visible / stale / degraded surface |
| `RebuildIdentityProjection` 或 reconciliation job 触发 `Paused` / `Retired` / `Tombstoned` | maintenance job 不得静默改写业务 truth |
| runtime health、task status、ProjectMember event 触发 `Paused` / `Available` | 外部运行态和项目内承担事实不是 identity lifecycle truth |
| governance / authorization event 直接触发生命周期迁移 | governance / authorization 只作为 basis ref 或 resolution source,不能绕过 identity command 和 policy |
| 缺高风险 basis 时先写 `Retired` / `Tombstoned` | 高风险 guard 是 accepted 前置,不能用后补 basis 修正已经写入的 truth |

### 13.6 状态传播影响

```text
UpdateGlobalLifecycleState accepted
    │
    ├─> GlobalLifecycleState target state
    ├─> IdentityAnchorState::RetiredHeld or TombstoneHeld when terminal
    ├─> IdentityTraceRecord
    ├─> IdentityOutboxRecord pending material
    ├─> MemberSummaryView lifecycle slice stale
    ├─> GlobalLifecycleChanged material
    └─> GlobalMemberAvailabilityChanged material when availability summary changes

GetGlobalLifecycleSummary
    │
    ├─> reads GlobalLifecycleState truth summary
    ├─> reads MemberSummaryView lifecycle slice when available
    └─> returns found / not_found / not_visible / stale / degraded without writing truth
```

传播约束:

- Lifecycle accepted change 可以产生 trace、pending outbox material 和 projection stale marker。
- `Retired` / `Tombstoned` lifecycle accepted 后必须与 9-A anchor hold 语义保持一致,但具体事务顺序留给 `03`。
- `GlobalLifecycleChanged` / `GlobalMemberAvailabilityChanged` 是 accepted fact material;publish 失败不回滚 lifecycle truth。
- Projection stale / degraded 只影响 query surface,不得反写 `GlobalLifecycleState`。
- `GovernanceBasisRef` 只以 body-free ref / marker 形式进入 result 或 event material,不得保存 governance body。

### 13.7 与 Step 7 / Step 8 触发来源反查表

| 状态 / surface | Step 7 来源 | Step 8 flow | 本批结论 |
|---|---|---|---|
| `Available` 初始 | `EstablishGlobalMember` | 8-A 建档 flow;8-B lifecycle 承接 | 新成员初始 lifecycle truth state |
| `Available` 恢复 | `UpdateGlobalLifecycleState` | §13.6 `UpdateGlobalLifecycleState` 处理流 | 只能由显式恢复 accepted 触发 |
| `Paused` | `UpdateGlobalLifecycleState` | §13.6 `UpdateGlobalLifecycleState` 处理流 | 受限可恢复状态 |
| `Retired` | `UpdateGlobalLifecycleState` | §13.6 `UpdateGlobalLifecycleState` 处理流 | 终态 / 保留态,触发 anchor `RetiredHeld` |
| `Tombstoned` | `UpdateGlobalLifecycleState` | §13.6 `UpdateGlobalLifecycleState` 处理流 | 最强保留态,触发 anchor `TombstoneHeld` |
| `PendingBasis` / rejected marker | `UpdateGlobalLifecycleState` | §13.6 `UpdateGlobalLifecycleState` 处理流 | high-risk precheck surface,不是 lifecycle truth |
| `LifecycleNotFound` / `LifecycleNotVisible` | `GetGlobalLifecycleSummary` | §13.7 `GetGlobalLifecycleSummary` 处理流 | read surface,不创建 / 不修复 truth |
| projection stale / degraded | `GetGlobalLifecycleSummary`, `RebuildIdentityProjection` | 8-B query / 8-G maintenance | query 只读,maintenance 只改 projection marker |
| publish pending / failed | `GlobalLifecycleChanged`, `GlobalMemberAvailabilityChanged`, `PublishIdentityOutbox` | 8-H outbound publish | outbox marker,不改变 lifecycle truth |

### 13.8 本批停审记录

| 停审项 | 结论 | 说明 |
|---|---|---|
| 状态归属 | 通过 | `GlobalLifecycleState` 属于“全局生命周期”,并回指 Step 6 lifecycle objects |
| 触发来源 | 通过 | lifecycle truth 写入只回指 `EstablishGlobalMember` 初始建档和 `UpdateGlobalLifecycleState` accepted |
| 禁止方向 | 通过 | query/job/runtime/ProjectMember/governance event 直接推进 lifecycle 均明确禁止 |
| 高风险 basis | 通过 | `Retired` / `Tombstoned` 等高风险候选必须先过 `HighRiskLifecycleGuard`;缺 basis 不写 truth |
| 传播影响 | 通过 | accepted lifecycle change 到 anchor hold、trace、outbox、projection stale、availability material 的影响已说明 |
| 概要粒度 | 通过 | 未写 enum 完整 variant、错误码全集、resolver schema、SQL、事务顺序或 event payload 字段全集 |
| 外部边界 | 通过 | runtime、task、ProjectMember、governance truth 均未进入 lifecycle state machine |

### 13.9 本批回填草稿片段

正式 `02-概要设计.md` §9 后续可汇总为:

- `GlobalLifecycleState` 表达成员平台级可用性,包含 `Available`、`Paused`、`Retired`、`Tombstoned` 四类概要状态。
- `Available` 是建档后的初始可用状态,但不代表 runtime instance 正常运行。
- `Paused` 是显式暂停后的受限态,只能通过 `UpdateGlobalLifecycleState` 恢复或继续处置。
- `Retired` / `Tombstoned` 是生命周期保留态,不释放 `GlobalMemberRef`,并与 `IdentityAnchorState::RetiredHeld` / `TombstoneHeld` 保持一致。
- 生命周期变化必须来自显式 command,且通过 transition policy、actor、reason 和高风险 basis guard;query、job、runtime、ProjectMember、governance event 均不得直接改写 lifecycle truth。
- Lifecycle accepted change 可产生 trace、pending outbox material、projection stale marker 和 lifecycle / availability outbound material;publish 或 projection rebuild 不反向决定 lifecycle truth。

正式正文要等 9-I 完成并在 Step 14 统一装配,当前不直接回填。

### 13.10 进入 9-C 的条件

进入 9-C “角色能力摘要状态集合”前,需要用户确认:

- `GlobalLifecycleState` 的概要状态集合固定为 `Available`、`Paused`、`Retired`、`Tombstoned`。
- `Retired` / `Tombstoned` 不可恢复为 `Available` 或 `Paused`,且必须保持 ref hold 语义。
- `PendingBasis`、not_found、not_visible、stale、degraded 只作为 command / query surface,不是 lifecycle truth state。
- lifecycle truth 不由 runtime、ProjectMember、external event、query 或 maintenance job 直接推进。

当前已获用户确认,本文件进入 §14 9-C 批次。

---

## 14. 9-C 角色能力摘要状态集合

### 14.1 本批输入与承接

| 来源 | 本批承接点 |
|---|---|
| `FR-ID-006` | `RoleCapabilitySummary` 必须表达成员身份侧角色摘要 |
| `FR-ID-007` | `RoleCapabilitySummary` 必须表达能力安全摘要和证据引用 |
| `FR-ID-008` | `RoleCapabilitySourceSnapshot` 必须响应 role / capability 来源变化 |
| `BR-ID-007` / `VETO-ID-003` | 不保存 RoleDefinition、CapabilityDefinition、method body 或自动评估算法正文 |
| `BR-ID-008` | 角色能力摘要必须有来源或证据,不得形成无来源声明 |
| `BR-ID-009` | 不把能力等级、绩效推断或自动评分写成 identity truth |
| Step 6 `RoleCapabilitySummary` | 承载成员身份侧 role / capability safe summary 和 `summary_state` |
| Step 6 `RoleCapabilitySourceSnapshot` | 承载 body-free 来源 snapshot、版本 marker 和 `source_state` |
| Step 6 `RoleCapabilitySourcePolicy` | 承接 source / evidence、forbidden body 和自动评分 guard |
| Step 6 `ReferenceResolutionState` | 提供通用外部引用解析状态,本批只说明与 source state 的关系,完整状态在 9-G 展开 |
| Step 7 `MaintainRoleCapabilitySummary` | summary accepted 写入口 |
| Step 7 `GetRoleCapabilitySummary` | role capability 只读入口 |
| Step 7 `HandleRoleCapabilitySourceChanged` | method-library 来源变化 Consumer |
| Step 7 `RoleCapabilitySummaryChanged` / `RoleCapabilitySourceStateChanged` | accepted summary / source state 的 outbound material |
| Step 8 §14 | 提供 maintain summary、query、source changed 三条处理流 |
| Step 8 §20.7 | 明确 `RoleCapabilitySummary` / source state 是 Step 9 必须承接的状态主语 |

### 14.2 本批状态主语与定义表

本批定义两个状态主语:`RoleCapabilitySummary.summary_state` 和 `RoleCapabilitySourceSnapshot.source_state`。`ReferenceResolutionState` 是跨来源解析状态,本批只在传播和反查中说明其关联,完整解析状态集合留给 9-G。`not_found`、`not_visible`、`degraded` 是 query surface,不是 summary truth state。

| 状态主语 | 状态 | 含义 | 是否可进入正常主线 | 触发来源 | 说明 |
|---|---|---|---|---|---|
| `RoleCapabilitySummary.summary_state` | `Active` | 摘要具备有效 source / evidence 和 safe summary,可用于受控读取、筛选和传播 | 是 | `MaintainRoleCapabilitySummary` accepted | 不代表保存 method-library definition body,也不代表能力自动评分已成立 |
| `RoleCapabilitySummary.summary_state` | `Stale` | 来源版本变化或 source event 表明摘要需要刷新 | 受限 | `HandleRoleCapabilitySourceChanged` stale marker accepted;`RefreshExternalReferenceState` 后续 marker | 可被读取为 stale / degraded,但不得静默当作最新 truth |
| `RoleCapabilitySummary.summary_state` | `Unavailable` | 当前来源不可用或无法解析,摘要不能作为可靠最新来源 | 受限 / 降级 | `HandleRoleCapabilitySourceChanged` unavailable / unrecognized marker accepted | 查询可降级;写入必须经 policy 拒绝或等待正式来源 |
| `RoleCapabilitySummary.summary_state` | `PendingReconciliation` | 摘要与来源存在待对账差异,需要正式维护或对账处理 | 受限 | `HandleRoleCapabilitySourceChanged` pending marker;maintenance finding | 不自动修复,不改写 method-library truth |
| `RoleCapabilitySourceSnapshot.source_state` | `Resolved` | 来源已被解析为 body-free snapshot 和 safe marker | 是 | `MaintainRoleCapabilitySummary` source resolved;`HandleRoleCapabilitySourceChanged` resolved marker | 只能保存 ref、version、state、safe summary 和 evidence refs |
| `RoleCapabilitySourceSnapshot.source_state` | `Stale` | 来源版本已变化或 snapshot 过期 | 受限 | `HandleRoleCapabilitySourceChanged` stale marker | 触发相关 summary stale / pending,不得直接 active accepted summary |
| `RoleCapabilitySourceSnapshot.source_state` | `Unavailable` | 来源暂不可用 | 受限 / 降级 | `HandleRoleCapabilitySourceChanged` unavailable marker;reference refresh marker | 不得用旧值静默覆盖新事实 |
| `RoleCapabilitySourceSnapshot.source_state` | `Unrecognized` | 来源无法映射到正式 ref / marker | 否 / 待处置 | `HandleRoleCapabilitySourceChanged` unrecognized marker | 进入 rejected、pending 或 report-only 路径,不得生成 active summary |
| command surface | `PendingSource` | summary 写入所需 source / evidence 尚未闭合 | 不适用 | `MaintainRoleCapabilitySummary` precheck | 不是持久 summary state;不得先写 `Active` 后补来源 |
| query surface | `RoleCapabilityNotFound` | 未找到成员摘要或指定 summary | 不适用 | `GetRoleCapabilitySummary` read miss | 不是持久状态;query 不创建 summary |
| query surface | `RoleCapabilityNotVisible` | 当前 actor 无权读取 role capability 摘要 | 不适用 | `GetRoleCapabilitySummary` visibility decision | 不等同不存在,不得泄露来源或证据正文 |

### 14.3 状态流转图

```text
<no role capability summary>
    │ MaintainRoleCapabilitySummary accepted with resolved source/evidence
    ▼
Active
    │ HandleRoleCapabilitySourceChanged stale marker
    ▼
Stale
    │ MaintainRoleCapabilitySummary accepted with resolved source/evidence
    ▼
Active

Active
    │ HandleRoleCapabilitySourceChanged unavailable / unrecognized marker
    ▼
Unavailable
    │ MaintainRoleCapabilitySummary accepted with resolved source/evidence
    ▼
Active

Active
    │ HandleRoleCapabilitySourceChanged pending reconciliation marker
    ▼
PendingReconciliation
    │ MaintainRoleCapabilitySummary accepted or reconciliation resolved by formal flow
    ▼
Active

RoleCapabilitySourceSnapshot::Resolved
    │ source changed stale marker
    ▼
RoleCapabilitySourceSnapshot::Stale

RoleCapabilitySourceSnapshot::Resolved
    │ source unavailable / unrecognized marker
    ▼
RoleCapabilitySourceSnapshot::Unavailable or Unrecognized
```

关键说明:

- `<no role capability summary>` 是写入前或读取 miss surface,不是持久 summary state。
- `Active` 只能由受控 `MaintainRoleCapabilitySummary` 在 source / evidence guard 通过后写入。
- `HandleRoleCapabilitySourceChanged` 可以更新 source snapshot state 并把 summary 标记为 `Stale`、`Unavailable` 或 `PendingReconciliation`,但不得直接把外部事件写成 `Active` summary。
- `ReferenceResolutionState` 可作为 source 解析 / refresh 的辅助 marker,但不替代 `RoleCapabilitySourceSnapshot.source_state`。

### 14.4 允许迁移清单

| 迁移 | 触发来源 | 约束 |
|---|---|---|
| `<no role capability summary> -> Active` | `MaintainRoleCapabilitySummary` accepted | 必须读取已建立 member;必须具备 source 或 evidence;必须通过 forbidden body 和自动评分 guard |
| `Active -> Active` | `MaintainRoleCapabilitySummary` accepted update | 允许 role source rebind、capability summary update 或 evidence correction;不得保存 definition / evidence body |
| `Stale -> Active` | `MaintainRoleCapabilitySummary` accepted | 必须使用 resolved source snapshot 或正式 evidence refs 重新维护 |
| `Unavailable -> Active` | `MaintainRoleCapabilitySummary` accepted | 必须重新获得 usable source / evidence,不能复用 unavailable 旧值静默恢复 |
| `PendingReconciliation -> Active` | `MaintainRoleCapabilitySummary` accepted 或后续正式对账闭口 flow | 必须通过正式来源 / 证据和 policy guard |
| `Active -> Stale` | `HandleRoleCapabilitySourceChanged` stale marker accepted | 只标记摘要过期,不保存来源正文 |
| `Active -> Unavailable` | `HandleRoleCapabilitySourceChanged` unavailable / unrecognized marker accepted | 读取侧降级,写入侧不得静默 accepted |
| `Active -> PendingReconciliation` | `HandleRoleCapabilitySourceChanged` pending marker 或 maintenance finding | 只表达待对账,不自动修复外部 truth |
| `Resolved -> Stale` | `HandleRoleCapabilitySourceChanged` source stale marker | 更新 `RoleCapabilitySourceSnapshot.source_state`,关联 summary stale |
| `Resolved -> Unavailable` | `HandleRoleCapabilitySourceChanged` source unavailable marker | 更新 snapshot state,关联 summary unavailable / degraded |
| `Resolved -> Unrecognized` | `HandleRoleCapabilitySourceChanged` source unrecognized marker | 不得生成 active summary;进入 pending / rejected / report-only |

### 14.5 禁止迁移清单

| 禁止迁移 / 方向 | 禁止原因 |
|---|---|
| `<no role capability summary> -> Active` 由 query 触发 | `GetRoleCapabilitySummary` 只读,不得创建 summary |
| `<no role capability summary> -> Active` 由 source event 直接触发 | source event 只更新 snapshot / marker,不得绕过 source / evidence command guard 写 active summary |
| `Stale -> Active` 由 query 或 projection rebuild 触发 | query / projection 不刷新 source,也不修复 summary truth |
| `Unavailable -> Active` 由旧 snapshot 自动恢复 | 来源不可用时不得用旧值静默覆盖新事实 |
| `Unrecognized -> Active` | 无法识别的来源不能形成有效 summary |
| `PendingSource -> Active` 无 source / evidence | 违反 `BR-ID-008`,不得先写 active 后补来源 |
| 任意状态保存 RoleDefinition / CapabilityDefinition / method body | 违反 forbidden body 边界,正文归 `L3-method-library` |
| 任意状态保存 evidence body 或 artifact body | identity 只保存 evidence ref / marker |
| 任意状态保存自动评分、绩效推断或能力等级算法正文 | 违反 `BR-ID-009`,identity 不拥有自动评估 truth |
| ProjectMember role assignment 直接写入 `RoleCapabilitySummary` | 项目内角色属于 `L1-work`,不得混入 identity role capability truth |
| `ReferenceResolutionState` 自动覆盖 `RoleCapabilitySummary.summary_state` | 引用解析是辅助 marker,summary 更新仍需正式 flow 和 policy |

### 14.6 状态传播影响

```text
MaintainRoleCapabilitySummary accepted
    │
    ├─> RoleCapabilitySummary::Active
    ├─> RoleCapabilitySourceSnapshot::Resolved
    ├─> IdentityTraceRecord
    ├─> IdentityOutboxRecord pending material
    ├─> MemberSummaryView role capability slice stale
    └─> RoleCapabilitySummaryChanged material

HandleRoleCapabilitySourceChanged accepted
    │
    ├─> RoleCapabilitySourceSnapshot source_state change
    ├─> RoleCapabilitySummary::Stale / Unavailable / PendingReconciliation
    ├─> IdentityTraceRecord
    ├─> IdentityOutboxRecord pending material
    ├─> MemberSummaryView role capability slice stale
    └─> RoleCapabilitySourceStateChanged material

GetRoleCapabilitySummary
    │
    ├─> reads RoleCapabilitySummary truth / snapshot
    ├─> reads RoleCapabilitySourceSnapshot state
    ├─> reads MemberSummaryView slice when available
    └─> returns found / not_found / not_visible / stale / degraded without writing truth
```

传播约束:

- Summary accepted change 可以产生 trace、pending outbox material 和 projection stale marker。
- Source state change 可以产生 `RoleCapabilitySourceStateChanged` material,但不携带 method body、definition body 或 evidence body。
- Outbox publish 成功不决定 summary / source state 是否 accepted。
- Projection stale / degraded 只影响 query surface,不得反写 `RoleCapabilitySummary`。
- `ReferenceResolutionState` 的 refresh / failed / unrecognized 语义在 9-G 统一展开;本批不得把它写成 summary 的第二 truth。

### 14.7 与 Step 7 / Step 8 触发来源反查表

| 状态 / surface | Step 7 来源 | Step 8 flow | 本批结论 |
|---|---|---|---|
| `Active` | `MaintainRoleCapabilitySummary` | §14.6 `MaintainRoleCapabilitySummary` 处理流 | 唯一 active summary accepted 写入口 |
| `Stale` | `HandleRoleCapabilitySourceChanged`;后续 `RefreshExternalReferenceState` marker | §14.8 source changed;8-G refresh | source/version 变化后的受限状态 |
| `Unavailable` | `HandleRoleCapabilitySourceChanged`;reference refresh marker | §14.8 source changed;8-G refresh | 来源不可用或无法解析时的降级状态 |
| `PendingReconciliation` | `HandleRoleCapabilitySourceChanged`;maintenance finding | §14.8 source changed;8-G reconciliation | 只表达待对账,不自动修复 |
| `Resolved` source snapshot | `MaintainRoleCapabilitySummary`;`HandleRoleCapabilitySourceChanged` | §14.6 / §14.8 | 可用于 summary 更新的 body-free source snapshot |
| `Unrecognized` source snapshot | `HandleRoleCapabilitySourceChanged`;reference refresh marker | §14.8 source changed;8-G refresh | 不能生成 active summary |
| `PendingSource` | `MaintainRoleCapabilitySummary` | §14.6 precheck | command surface,不是 summary truth |
| `RoleCapabilityNotFound` / `RoleCapabilityNotVisible` | `GetRoleCapabilitySummary` | §14.7 query | read surface,不创建 / 不修复 summary |
| projection stale / degraded | `GetRoleCapabilitySummary`, `RebuildIdentityProjection` | 8-C query / 8-G maintenance | query 只读,maintenance 只改 projection marker |
| publish pending / failed | `RoleCapabilitySummaryChanged`, `RoleCapabilitySourceStateChanged`, `PublishIdentityOutbox` | 8-H outbound publish | outbox marker,不改变 summary truth |

### 14.8 本批停审记录

| 停审项 | 结论 | 说明 |
|---|---|---|
| 状态归属 | 通过 | `RoleCapabilitySummary.summary_state` 和 `RoleCapabilitySourceSnapshot.source_state` 均属于“角色能力摘要” |
| 触发来源 | 通过 | `Active` 回指 `MaintainRoleCapabilitySummary`;source marker 回指 `HandleRoleCapabilitySourceChanged` |
| 禁止方向 | 通过 | query create、source event direct active、projection repair、unrecognized active、forbidden body 均明确禁止 |
| 来源 / 证据 guard | 通过 | 无 source / evidence、stale / unavailable / unrecognized source 不得静默 accepted |
| 传播影响 | 通过 | summary / source accepted 到 trace、outbox、projection stale 和 read surface 的影响已说明 |
| 概要粒度 | 通过 | 未写 resolver schema、event payload 字段全集、错误码、SQL、dedup 机制或评分算法 |
| 外部边界 | 通过 | method-library definition body、ProjectMember truth、evidence body 和自动评分均未进入 identity 状态机 |

### 14.9 本批回填草稿片段

正式 `02-概要设计.md` §9 后续可汇总为:

- `RoleCapabilitySummary.summary_state` 表达成员身份侧角色能力摘要是否 `Active`、`Stale`、`Unavailable` 或 `PendingReconciliation`。
- `RoleCapabilitySourceSnapshot.source_state` 表达来源 snapshot 是否 `Resolved`、`Stale`、`Unavailable` 或 `Unrecognized`。
- `Active` summary 只能由 `MaintainRoleCapabilitySummary` 在 source / evidence guard、forbidden body guard 和自动评分 guard 通过后写入。
- `HandleRoleCapabilitySourceChanged` 只更新 body-free source snapshot state,并把相关 summary 标记为 stale / unavailable / pending reconciliation,不得直接把外部事件写成 active summary。
- `GetRoleCapabilitySummary` 只读 summary / source snapshot / projection slice,不得刷新 method source、补 evidence 或修复 summary。
- `RoleCapabilitySummaryChanged` / `RoleCapabilitySourceStateChanged` 是 accepted material;publish 或 projection rebuild 不反向决定 summary truth。

正式正文要等 9-I 完成并在 Step 14 统一装配,当前不直接回填。

### 14.10 进入 9-D 的条件

进入 9-D “身份生涯记录状态集合”前,需要用户确认:

- `RoleCapabilitySummary.summary_state` 的概要状态集合固定为 `Active`、`Stale`、`Unavailable`、`PendingReconciliation`。
- `RoleCapabilitySourceSnapshot.source_state` 的概要状态集合固定为 `Resolved`、`Stale`、`Unavailable`、`Unrecognized`。
- `Active` 只能由 `MaintainRoleCapabilitySummary` accepted 写入;source changed event 不直接写 active summary。
- Query / projection / maintenance 不刷新 method source、不补 evidence、不修复 summary truth。
- RoleDefinition / CapabilityDefinition / method body、evidence body、ProjectMember role 和自动评分不得进入 identity 状态机。

当前已获用户确认,本文件进入 §15 9-D 批次。

---

## 15. 9-D 身份生涯记录状态集合

### 15.1 本批输入与承接

| 来源 | 本批承接点 |
|---|---|
| `FR-ID-009` | `CareerRecord` 必须追加成员身份侧生涯历史 |
| `BR-ID-010` | 生涯记录必须 append-only,不得改写、删除或重排已确认历史 |
| `BR-ID-011` | Project、WorkItem、ProjectMember truth 不得由 identity 反向定义 |
| `BR-ID-014` | 生涯追加必须可追溯到安全可见来源、reason 或 actor |
| `NFR-ID-006` / `NFR-ID-007` | 重复项目参与来源不得产生重复 career history,追加路径必须具备幂等 / 重放安全 |
| `VETO-ID-003` | ProjectMember、work item、artifact 等正文不得进入 identity truth / event / report |
| Step 6 `CareerRecord` | 承载 append-only career history 和 `record_state` |
| Step 6 `CareerAppendPolicy` | 承接来源可信、重复来源、append-only、work truth 排除 guard |
| Step 7 `AppendCareerRecord` | command 追加和纠错追加入口 |
| Step 7 `ListCareerRecords` | career 只读入口 |
| Step 7 `HandleWorkParticipationAccepted` | work accepted fact 的 inbound consumer |
| Step 7 `CareerRecordAppended` / `CareerCorrectionAppended` | accepted career append 的 outbound material |
| Step 8 §15 | 提供 append command、list query、work participation consumer 三条处理流 |
| Step 8 §20.7 | 明确 `CareerRecord.record_state` 是 Step 9 必须承接的状态主语 |

### 15.2 本批状态主语与定义表

本批只定义 `CareerRecord.record_state` 的概要状态。duplicate、conflict、rejected、empty、not_found、not_visible、stale、degraded 是 command / query / consumer surface,不是持久化 career record state。career 记录是 append-only history,不是可覆盖履历。

| 状态主语 | 状态 | 含义 | 是否可进入正常主线 | 触发来源 | 说明 |
|---|---|---|---|---|---|
| `CareerRecord.record_state` | `Appended` | 正常追加的成员身份侧生涯记录 | 是 | `AppendCareerRecord` accepted;`HandleWorkParticipationAccepted` accepted | 不允许原地修改为其他项目事实 |
| `CareerRecord.record_state` | `CorrectionAppended` | 以新记录表达对既有历史的纠错 | 是,但带解释关系 | `AppendCareerRecord` correction accepted | 纠错仍是追加,不是覆盖旧记录 |
| `CareerRecord.record_state` | `SupersededByCorrection` | 旧记录被后续 correction record 在解释上替代 | 受限 / 保留 | correction append accepted 的关系 side effect | 旧记录仍保留,不得删除或改写正文 |
| `CareerRecord.record_state` | `SourcePendingReview` | 来源可信性、映射或 safe marker 需要复核 | 受限 | `HandleWorkParticipationAccepted` unresolved / untrusted marker;`AppendCareerRecord` pending review surface | 不得直接反写 work truth,也不得自动 accepted |
| command / consumer surface | `DuplicateSourceNoOp` | 同一 `CareerSourceMarkerRef` 已存在,本次不新增 history | 不适用 | `AppendCareerRecord` duplicate;`HandleWorkParticipationAccepted` duplicate | 不是 record state;不得新增重复 `CareerRecord` |
| command / consumer surface | `CareerAppendRejected` | 来源不可信、成员不存在、forbidden body 或非法改写 | 不适用 | `AppendCareerRecord` / `HandleWorkParticipationAccepted` precheck | 不写 career truth |
| query surface | `CareerEmpty` | 成员存在但没有可见 career record | 不适用 | `ListCareerRecords` read empty | 不是持久状态;query 不追加记录 |
| query surface | `CareerNotVisible` | 当前 actor 无权读取 career summary | 不适用 | `ListCareerRecords` visibility decision | 不等同不存在,不得泄露 work body |

### 15.3 状态流转图

```text
<no career record for source marker>
    │ AppendCareerRecord accepted
    │ or HandleWorkParticipationAccepted accepted
    ▼
Appended

Appended
    │ AppendCareerRecord correction accepted
    ├───────────────┐
    ▼               ▼
SupersededByCorrection    CorrectionAppended

<career append candidate>
    │ source unresolved / untrusted / mapping pending
    ▼
SourcePendingReview
    │ AppendCareerRecord accepted after formal review
    ▼
Appended or CorrectionAppended

<existing source marker>
    │ duplicate command / duplicate event
    ▼
DuplicateSourceNoOp
```

关键说明:

- `DuplicateSourceNoOp` 是 command / consumer 结果 surface,不是新增 `CareerRecord.record_state`。
- `CorrectionAppended` 必须创建新 `CareerRecord`;旧记录最多进入 `SupersededByCorrection` 解释状态,不得被覆盖。
- `SourcePendingReview` 表达 identity 暂不接受来源为 truth,不是 work truth 待修复状态。
- `ListCareerRecords` 只读取 append history 和 projection slice,不参与状态迁移。

### 15.4 允许迁移清单

| 迁移 | 触发来源 | 约束 |
|---|---|---|
| `<no career record for source marker> -> Appended` | `AppendCareerRecord` accepted | 必须依附已建立 `GlobalMemberRef`;必须通过 source trusted、not duplicate、append-only、not work truth write guard |
| `<no career record for source marker> -> Appended` | `HandleWorkParticipationAccepted` accepted | event 必须携带 `GlobalMemberRef`、`ProjectParticipationRef`、`WorkSourceRef`、`CareerSourceMarkerRef`、safe summary marker 和 dedup key |
| `Appended -> SupersededByCorrection` | `AppendCareerRecord` correction accepted | 只表达解释替代关系;旧记录仍保留 |
| `<new correction record> -> CorrectionAppended` | `AppendCareerRecord` correction accepted | 必须创建新 record,并可引用 original record ref |
| `SourcePendingReview -> Appended` | 后续正式 `AppendCareerRecord` accepted | 必须重新通过 source / member / append-only guard |
| `SourcePendingReview -> CorrectionAppended` | 后续正式 correction append accepted | 必须保持纠错追加语义,不得覆盖原记录 |
| `<existing source marker> -> DuplicateSourceNoOp` | duplicate command 或 duplicate work event | 不新增 history;是否回放 stored result 留给 `03` |

### 15.5 禁止迁移清单

| 禁止迁移 / 方向 | 禁止原因 |
|---|---|
| `Appended -> Appended` 通过 update 原记录 | 生涯历史 append-only,不得原地修改 |
| `Appended -> <deleted>` | 删除已确认 history 会破坏追溯 |
| `CorrectionAppended -> <overwrite original>` | 纠错只能追加新记录,不能覆盖旧记录 |
| `SupersededByCorrection -> <deleted>` | 被替代记录仍需保留用于审计和解释 |
| `DuplicateSourceNoOp -> Appended` 同一 source marker 新增记录 | 重复来源不得产生重复 history |
| `ListCareerRecords` 触发任何 append / correction | Query no-write,读取不追加、不纠错、不修复 duplicate marker |
| `RebuildIdentityProjection` 或 reconciliation job 直接追加 career truth | maintenance job 只能重建 projection 或生成 report,不得写 core truth |
| work event 缺 `GlobalMemberRef` / source marker / safe summary marker 时 accepted | 不得从项目私有字段推导成员身份或绕过 dedup |
| 保存 Project / WorkItem / ProjectMember body 到任何 career state | work truth 和正文不属于 identity |
| cursor / filter 改变 career history 顺序或状态 | cursor / filter 是读取控制面,不得反向改写 history |

### 15.6 状态传播影响

```text
AppendCareerRecord accepted
    │
    ├─> CareerRecord::Appended or CorrectionAppended
    ├─> optional original CareerRecord::SupersededByCorrection
    ├─> IdentityTraceRecord
    ├─> IdentityOutboxRecord pending material
    ├─> MemberSummaryView career slice stale
    └─> CareerRecordAppended or CareerCorrectionAppended material

HandleWorkParticipationAccepted accepted
    │
    ├─> CareerRecord::Appended
    ├─> IdentityTraceRecord
    ├─> IdentityOutboxRecord pending material
    ├─> MemberSummaryView career slice stale
    └─> CareerRecordAppended material

ListCareerRecords
    │
    ├─> reads CareerRecord append history
    ├─> reads MemberSummaryView career slice when available
    └─> returns found / empty / not_found / not_visible / stale / degraded without writing truth
```

传播约束:

- Career accepted append 可以产生 trace、pending outbox material 和 projection stale marker。
- `CareerRecordAppended` / `CareerCorrectionAppended` 不携带 Project、WorkItem、ProjectMember body 或 artifact body。
- Outbox publish 成功不决定 career append 是否 accepted。
- Projection stale / degraded 只影响 query surface,不得反写 `CareerRecord`。
- Duplicate source 不生成新的 `CareerRecord`,也不生成新的 career accepted fact。

### 15.7 与 Step 7 / Step 8 触发来源反查表

| 状态 / surface | Step 7 来源 | Step 8 flow | 本批结论 |
|---|---|---|---|
| `Appended` | `AppendCareerRecord`;`HandleWorkParticipationAccepted` | §15.6 command;§15.8 consumer | 正常追加 career history |
| `CorrectionAppended` | `AppendCareerRecord` | §15.6 command | 纠错也是新增 record |
| `SupersededByCorrection` | `AppendCareerRecord` correction accepted | §15.6 command | 旧记录解释性被替代,但仍保留 |
| `SourcePendingReview` | `AppendCareerRecord`;`HandleWorkParticipationAccepted` | §15.6 / §15.8 precheck | 来源待复核,不写 accepted truth |
| `DuplicateSourceNoOp` | `AppendCareerRecord`;`HandleWorkParticipationAccepted` | §15.6 / §15.8 duplicate branch | duplicate surface,不是 record state |
| `CareerAppendRejected` | `AppendCareerRecord`;`HandleWorkParticipationAccepted` | §15.6 / §15.8 rejected branch | rejected surface,不写 career truth |
| `CareerEmpty` / `CareerNotVisible` | `ListCareerRecords` | §15.7 query | read surface,不追加 / 不修复 |
| projection stale / degraded | `ListCareerRecords`, `RebuildIdentityProjection` | 8-D query / 8-G maintenance | query 只读,maintenance 只改 projection marker |
| publish pending / failed | `CareerRecordAppended`, `CareerCorrectionAppended`, `PublishIdentityOutbox` | 8-H outbound publish | outbox marker,不改变 career truth |

### 15.8 本批停审记录

| 停审项 | 结论 | 说明 |
|---|---|---|
| 状态归属 | 通过 | `CareerRecord.record_state` 属于“身份生涯记录”,并回指 Step 6 `CareerRecord` |
| 触发来源 | 通过 | append / correction 回指 `AppendCareerRecord`;work source append 回指 `HandleWorkParticipationAccepted` |
| 禁止方向 | 通过 | update、delete、reorder、duplicate 新增、query append、maintenance append 均明确禁止 |
| append-only | 通过 | 纠错只能追加新记录,旧记录保留;duplicate source 不新增 history |
| 传播影响 | 通过 | accepted career append 到 trace、outbox、projection stale、read surface 的影响已说明 |
| 概要粒度 | 通过 | 未写 repository 唯一约束、stored result、event payload 字段全集、错误码或 SQL |
| 外部边界 | 通过 | Project、WorkItem、ProjectMember truth / body 和 artifact body 均未进入 identity 状态机 |

### 15.9 本批回填草稿片段

正式 `02-概要设计.md` §9 后续可汇总为:

- `CareerRecord.record_state` 表达 append-only career history 的语义状态,包含 `Appended`、`CorrectionAppended`、`SupersededByCorrection`、`SourcePendingReview`。
- 普通追加和 work accepted fact 追加只能新增 `CareerRecord`;重复 `CareerSourceMarkerRef` 返回 duplicate / no-op surface,不得新增重复 history。
- 纠错必须通过新 `CareerRecord` 表达,旧记录只能解释性标记为 `SupersededByCorrection`,不能被覆盖、删除或重排。
- `ListCareerRecords` 只读 career append history 和 projection slice,不得追加、纠错、调用 work source 或修复 duplicate marker。
- Career accepted append 可产生 trace、pending outbox material 和 projection stale marker;publish 或 projection rebuild 不反向决定 career truth。

正式正文要等 9-I 完成并在 Step 14 统一装配,当前不直接回填。

### 15.10 进入 9-E 的条件

进入 9-E “记忆引用关系状态集合”前,需要用户确认:

- `CareerRecord.record_state` 的概要状态集合固定为 `Appended`、`CorrectionAppended`、`SupersededByCorrection`、`SourcePendingReview`。
- duplicate、rejected、empty、not_found、not_visible、stale、degraded 只作为 command / query / consumer surface,不是持久 career record state。
- 纠错只允许追加新记录,不得覆盖、删除或重排旧记录。
- work source event 可以在 policy 通过时追加 career record,但不得保存 Project、WorkItem、ProjectMember body 或反写 work truth。
- Query / projection / maintenance job 不追加、不纠错、不修复 career truth。

当前已获用户确认,本文件进入 §16 9-E 批次。

---

## 16. 9-E 记忆引用关系状态集合

### 16.1 本批输入与承接

| 来源 | 本批承接点 |
|---|---|
| `FR-ID-010` | `MemoryReference` 必须维护成员相关 memory / archive refs |
| `FR-ID-011` | `MemoryReferenceState` 必须表达迁移、冷存和 handoff 结果方向 |
| `BR-ID-012` / `VETO-ID-003` | identity 不保存 memory 原文、embedding、index、artifact body、conversation body、runtime body、archive package 或 receipt body |
| `BR-ID-014` | memory ref 变化必须可追溯到安全可见来源、reason 或 actor |
| `OQ-ID-003` / `R-ID-003` | memory refs 承载方、handoff target、migration result surface 后移 `03/04`,本批只保留 refs / markers |
| Step 6 `MemoryReference` | 承载成员与外部 memory / archive refs 的身份侧关系 |
| Step 6 `MemoryReferenceState` | 承载 linked、stale、unavailable、migrated、archived、handoff pending / failed 等状态 |
| Step 6 `MemoryReferencePolicy` | 承接 member、reference present、source trusted、body-free、handoff marker guard |
| Step 6 `ReferenceResolutionState` | 提供通用外部引用解析状态,本批只说明关联,完整状态在 9-G 展开 |
| Step 7 `MaintainMemoryReference` | memory / archive relation 与 state 的 command 写入口 |
| Step 7 `ListMemoryReferences` | memory reference 只读入口 |
| Step 7 `HandleMemoryReferenceSourceStateChanged` | memory / archive carrier source state consumer |
| Step 7 `HandleArchiveHandoffResult` | archive / memory handoff result consumer |
| Step 7 `MemoryReferenceChanged` / `MemoryArchiveHandoffStateChanged` | accepted memory reference / handoff state 的 outbound material |
| Step 8 §16 | 提供 maintain command、list query、source state consumer、handoff result consumer 四条处理流 |
| Step 8 §20.7 | 明确 `MemoryReferenceState` 是 Step 9 必须承接的状态主语 |

### 16.2 本批状态主语与定义表

本批只定义 `MemoryReferenceState` 的概要状态。`ReferenceResolutionState` 是跨来源解析状态,在 9-G 统一展开;`HandoffState` 是 trace / audit / archive handoff 的传播状态,在 9-H 展开,不得与本批 memory/archive 引用迁移状态混用。empty、not_found、not_visible、stale、degraded 是 query surface,不是新增 relation state。

| 状态主语 | 状态 | 含义 | 是否可进入正常主线 | 触发来源 | 说明 |
|---|---|---|---|---|---|
| `MemoryReferenceState` | `Linked` | memory ref 已与成员建立身份侧引用关系 | 是 | `MaintainMemoryReference` accepted;`HandleMemoryReferenceSourceStateChanged` linked marker | 不代表 memory body 在 identity 内可读 |
| `MemoryReferenceState` | `PendingVerification` | 引用已收到,但来源、承载状态或 marker 仍需确认 | 受限 | `MaintainMemoryReference` pending verification;source state event pending marker | 不写成 completed,后续 formal flow 决定 accepted / rejected / report-only |
| `MemoryReferenceState` | `Stale` | 外部引用状态、版本或 summary 可能过期 | 受限 / 降级 | `HandleMemoryReferenceSourceStateChanged` stale marker;`RefreshExternalReferenceState` marker | 不得用作最新事实静默传播 |
| `MemoryReferenceState` | `Unavailable` | 外部 memory / archive 承载方不可用或无法解析 | 受限 / 降级 | `HandleMemoryReferenceSourceStateChanged` unavailable marker;reference refresh marker | 读取可降级,写入必须经 policy 处理 |
| `MemoryReferenceState` | `Migrated` | 引用已迁移到新 memory 或 archive ref | 是,但仅 ref / marker 层面 | `HandleArchiveHandoffResult` migrated marker;`MaintainMemoryReference` record migration accepted | 只记录新 ref / handoff marker,不保存迁移正文 |
| `MemoryReferenceState` | `Archived` | 引用已进入冷存或归档关系 | 是,但受限读取 | `HandleArchiveHandoffResult` archived marker;`MaintainMemoryReference` attach archive accepted | 只记录 `ArchiveRef` / `ArchiveHandoffRef`,不保存 archive package |
| `MemoryReferenceState` | `HandoffPending` | 迁移 / 冷存 handoff 已发起或回调不完整,结果未确认 | 受限 | `MaintainMemoryReference` handoff intent marker;`HandleArchiveHandoffResult` pending marker | 不得伪造成 migrated / archived |
| `MemoryReferenceState` | `HandoffFailed` | handoff 失败或需要人工 / 后台复核 | 受限 / 待处置 | `HandleArchiveHandoffResult` failed marker | 后续 retry / diagnosis 在 8-H、Step 10 或 `03/04` 细化 |
| command / consumer surface | `MemoryReferenceRejected` | 缺成员、缺 ref、来源不可信、forbidden body 或缺 marker | 不适用 | `MaintainMemoryReference` / consumers precheck | 不写 memory reference truth |
| query surface | `MemoryReferenceEmpty` | 成员存在但没有可见 memory reference | 不适用 | `ListMemoryReferences` read empty | 不是持久状态;query 不创建 relation |
| query surface | `MemoryReferenceNotVisible` | 当前 actor 无权读取 memory reference summary | 不适用 | `ListMemoryReferences` visibility decision | 不等同不存在,不得泄露 carrier 内部状态 |

### 16.3 状态流转图

```text
<no memory reference relation>
    │ MaintainMemoryReference accepted with MemoryRef
    ▼
Linked
    │ source stale marker
    ▼
Stale
    │ MaintainMemoryReference accepted with usable ref/source
    ▼
Linked

Linked
    │ source unavailable marker
    ▼
Unavailable
    │ MaintainMemoryReference accepted with usable ref/source
    ▼
Linked

<memory/archive relation candidate>
    │ source or marker needs verification
    ▼
PendingVerification
    │ formal maintain/source state accepted
    ▼
Linked or Archived

Linked
    │ handoff requested or pending callback
    ▼
HandoffPending
    │ handoff migrated marker
    ▼
Migrated
    │ archive marker confirmed
    ▼
Archived

HandoffPending
    │ handoff failed marker
    ▼
HandoffFailed
```

关键说明:

- `HandoffPending`、`Migrated`、`Archived`、`HandoffFailed` 必须由正式 command intent 或 inbound result marker 触发,不能由请求发送或缺字段 callback 推断成功。
- `Archived` / `Migrated` 只表达 identity 侧引用已经指向 archive / migrated ref,不表达外部 archive owner 的完整状态机。
- `Stale` / `Unavailable` 不触发本流自动刷新外部 carrier;refresh / reconciliation 后移 9-G。
- `ListMemoryReferences` 只读取 relation / state / projection slice,不参与状态迁移。

### 16.4 允许迁移清单

| 迁移 | 触发来源 | 约束 |
|---|---|---|
| `<no memory reference relation> -> Linked` | `MaintainMemoryReference` accepted | 必须依附已建立 member;必须有 body-free `MemoryRef` 或 `ArchiveRef`;必须通过 source trusted 和 body-free guard |
| `<no memory reference relation> -> Linked` | `HandleMemoryReferenceSourceStateChanged` linked marker accepted | event 必须有 typed refs、source ref、state marker、event id 和 dedup key |
| `<candidate> -> PendingVerification` | `MaintainMemoryReference` pending verification 或 source event pending marker | 缺确认但可保留待审 marker;不得标记 completed |
| `PendingVerification -> Linked` | `MaintainMemoryReference` accepted 或 source state linked marker | 必须重新通过 reference present、source trusted、body-free guard |
| `PendingVerification -> Archived` | `HandleArchiveHandoffResult` archived marker accepted | 必须有 `ArchiveRef`、`ArchiveHandoffRef` 和 result marker |
| `Linked -> Stale` | `HandleMemoryReferenceSourceStateChanged` stale marker 或 reference refresh marker | 只标记过期,不保存 external body |
| `Stale -> Linked` | `MaintainMemoryReference` accepted 或 linked source state marker | 必须使用 usable ref / source,不得静默复用旧事实 |
| `Linked -> Unavailable` | `HandleMemoryReferenceSourceStateChanged` unavailable marker 或 reference refresh marker | 读取侧降级,不自动修复 external truth |
| `Unavailable -> Linked` | `MaintainMemoryReference` accepted 或 linked source state marker | 必须重新获得 usable ref / source |
| `Linked -> HandoffPending` | `MaintainMemoryReference` archive handoff intent 或 pending result marker | pending 不等于 archived / migrated |
| `HandoffPending -> Migrated` | `HandleArchiveHandoffResult` migrated marker | 只能保存 refs / marker,不保存迁移正文 |
| `HandoffPending -> Archived` | `HandleArchiveHandoffResult` archived marker | 只能保存 `ArchiveRef` / handoff marker,不保存 package |
| `HandoffPending -> HandoffFailed` | `HandleArchiveHandoffResult` failed marker | 失败状态用于后续 retry / review,不回滚业务 truth |
| `Linked -> Migrated` | `MaintainMemoryReference` record migration accepted | 必须显式携带 body-free new ref / archive marker |
| `Migrated -> Archived` | `HandleArchiveHandoffResult` archived marker | 表达迁移后进入冷存 / archive relation |

### 16.5 禁止迁移清单

| 禁止迁移 / 方向 | 禁止原因 |
|---|---|
| `HandoffPending -> Archived` 由请求发送或缺字段 callback 推断 | handoff pending 不得伪造成 completed |
| `HandoffPending -> Migrated` 无正式 result marker | migrated 必须来自明确 result marker |
| `HandoffFailed -> Archived` 由 retry job 静默修复 | retry / diagnosis 不能绕过 formal result marker |
| `Stale -> Linked` 由 query 触发 | query 不刷新 external carrier,也不修复 reference state |
| `Unavailable -> Linked` 由旧 ref 自动恢复 | unavailable 不得用旧值静默覆盖新事实 |
| `MemoryReferenceRejected -> Linked` 无 ref / source / marker | 缺引用或来源不得写 accepted relation |
| 保存 memory body、embedding、index 到任何状态 | 违反 forbidden body 边界 |
| 保存 archive package、package metadata 或 receipt body 到任何状态 | identity 只保存 refs / markers |
| 复制外部 memory / archive owner 完整状态机 | `MemoryReferenceState` 只表达身份侧引用状态 |
| `RebuildIdentityProjection` 或 reconciliation job 直接改写 `MemoryReferenceState` 为 completed | maintenance 不能伪造成 external result |
| `ReferenceResolutionState` 自动覆盖 `MemoryReferenceState` | 引用解析是辅助 marker,本批 relation state 仍需正式 flow |

### 16.6 状态传播影响

```text
MaintainMemoryReference accepted
    │
    ├─> MemoryReference relation
    ├─> MemoryReferenceState target state
    ├─> IdentityTraceRecord
    ├─> IdentityOutboxRecord pending material
    ├─> MemberSummaryView memory reference slice stale
    └─> MemoryReferenceChanged material

HandleMemoryReferenceSourceStateChanged accepted
    │
    ├─> MemoryReferenceState::Linked / Stale / Unavailable / PendingVerification
    ├─> IdentityTraceRecord
    ├─> IdentityOutboxRecord pending material
    ├─> MemberSummaryView memory reference slice stale
    └─> MemoryReferenceChanged material

HandleArchiveHandoffResult accepted
    │
    ├─> MemoryReferenceState::Migrated / Archived / HandoffPending / HandoffFailed
    ├─> IdentityTraceRecord
    ├─> IdentityOutboxRecord pending material
    ├─> MemberSummaryView memory reference slice stale
    └─> MemoryArchiveHandoffStateChanged material

ListMemoryReferences
    │
    ├─> reads MemoryReference relation and MemoryReferenceState
    ├─> reads MemberSummaryView memory slice when available
    └─> returns found / empty / not_found / not_visible / stale / degraded without writing truth
```

传播约束:

- Memory reference accepted change 可以产生 trace、pending outbox material 和 projection stale marker。
- `MemoryReferenceChanged` / `MemoryArchiveHandoffStateChanged` 不携带 memory body、embedding、index、artifact body、archive package、package metadata 或 receipt body。
- Outbox publish 成功不决定 memory reference state 是否 accepted。
- Projection stale / degraded 只影响 query surface,不得反写 `MemoryReferenceState`。
- 9-E 的 memory / archive reference state 与 9-H 的 trace handoff delivery state 分属不同状态主语,不得互相覆盖。

### 16.7 与 Step 7 / Step 8 触发来源反查表

| 状态 / surface | Step 7 来源 | Step 8 flow | 本批结论 |
|---|---|---|---|
| `Linked` | `MaintainMemoryReference`;`HandleMemoryReferenceSourceStateChanged` | §16.6 command;§16.8 source consumer | memory ref 已建立身份侧关系 |
| `PendingVerification` | `MaintainMemoryReference`;`HandleMemoryReferenceSourceStateChanged` | §16.6 / §16.8 precheck | 待确认状态,不伪装 completed |
| `Stale` | `HandleMemoryReferenceSourceStateChanged`;`RefreshExternalReferenceState` marker | §16.8 source consumer;8-G refresh | 外部引用可能过期 |
| `Unavailable` | `HandleMemoryReferenceSourceStateChanged`;reference refresh marker | §16.8 source consumer;8-G refresh | 外部承载方不可用或无法解析 |
| `Migrated` | `HandleArchiveHandoffResult`;`MaintainMemoryReference` | §16.9 handoff result;§16.6 command | 迁移结果 marker accepted |
| `Archived` | `HandleArchiveHandoffResult`;`MaintainMemoryReference` | §16.9 handoff result;§16.6 command | 冷存 / archive relation accepted |
| `HandoffPending` | `MaintainMemoryReference`;`HandleArchiveHandoffResult` | §16.6 command;§16.9 handoff result | pending 不等于完成 |
| `HandoffFailed` | `HandleArchiveHandoffResult` | §16.9 handoff result | 失败 marker,后续 retry / review |
| `MemoryReferenceRejected` | command / consumers precheck | §16.6 / §16.8 / §16.9 | rejected surface,不写 relation truth |
| `MemoryReferenceEmpty` / `MemoryReferenceNotVisible` | `ListMemoryReferences` | §16.7 query | read surface,不创建 / 不修复 |
| projection stale / degraded | `ListMemoryReferences`, `RebuildIdentityProjection` | 8-E query / 8-G maintenance | query 只读,maintenance 只改 projection marker |
| publish pending / failed | `MemoryReferenceChanged`, `MemoryArchiveHandoffStateChanged`, `PublishIdentityOutbox` | 8-H outbound publish | outbox marker,不改变 memory reference truth |

### 16.8 本批停审记录

| 停审项 | 结论 | 说明 |
|---|---|---|
| 状态归属 | 通过 | `MemoryReferenceState` 属于“记忆引用关系”,并回指 Step 6 `MemoryReferenceState` |
| 触发来源 | 通过 | command、source consumer、archive handoff result consumer 均能回指 Step 7 / Step 8 |
| 禁止方向 | 通过 | query refresh、handoff 伪成功、failed 静默修复、forbidden body、external state machine copy 均明确禁止 |
| body-free | 通过 | memory body、embedding、index、archive package、receipt body 均不得进入 state、event、trace 或 result |
| handoff 不伪成功 | 通过 | `HandoffPending`、`HandoffFailed`、`Migrated`、`Archived` 明确区分 |
| 传播影响 | 通过 | memory state accepted 到 trace、outbox、projection stale、read surface 的影响已说明 |
| 概要粒度 | 通过 | 未写 receipt schema、handoff target schema、retry 参数、adapter 协议、SQL 或错误码全集 |
| 外部边界 | 通过 | memory / archive carrier truth、package metadata 和 receipt body 均未进入 identity 状态机 |

### 16.9 本批回填草稿片段

正式 `02-概要设计.md` §9 后续可汇总为:

- `MemoryReferenceState` 表达成员与外部 memory / archive refs 的身份侧引用状态,包含 `Linked`、`PendingVerification`、`Stale`、`Unavailable`、`Migrated`、`Archived`、`HandoffPending`、`HandoffFailed`。
- `Linked` 只表示 identity 侧 relation 成立,不表示 memory 原文或 embedding 进入 identity。
- `Migrated` / `Archived` 只保存 refs 和 handoff marker,不保存 archive package、receipt body 或 package metadata。
- `HandoffPending` 不得伪装为 `Migrated` / `Archived`;completed 状态必须来自正式 result marker。
- `ListMemoryReferences` 只读 relation / state / projection slice,不得刷新 external carrier 或修复 `MemoryReferenceState`。
- Memory reference accepted change 可产生 trace、pending outbox material 和 projection stale marker;publish 或 projection rebuild 不反向决定 memory reference truth。

正式正文要等 9-I 完成并在 Step 14 统一装配,当前不直接回填。

### 16.10 进入 9-F 的条件

进入 9-F “身份事实消费与追溯状态集合”前,需要用户确认:

- `MemoryReferenceState` 的概要状态集合固定为 `Linked`、`PendingVerification`、`Stale`、`Unavailable`、`Migrated`、`Archived`、`HandoffPending`、`HandoffFailed`。
- empty、not_found、not_visible、stale、degraded、rejected 只作为 command / query / consumer surface,不是新增 relation state。
- `HandoffPending` 不得伪装为 `Migrated` / `Archived`;completed 必须来自正式 result marker。
- memory body、embedding、index、artifact body、conversation body、runtime body、archive package、package metadata、receipt body 不得进入 identity 状态机。
- Query / projection / maintenance job 不刷新 external carrier、不修复 `MemoryReferenceState`、不反写 memory / archive owner truth。

当前已获用户确认,本文件进入 §17 9-F 批次。

---

## 17. 9-F 身份事实消费与追溯状态集合

### 17.1 本批输入与承接

| 来源 | 本批承接点 |
|---|---|
| `FR-ID-012` | `ReadMemberSummary` 必须让相邻仓通过正式边界消费成员身份事实 |
| `FR-ID-013` | `ReadIdentityTrace` / `ReadAuditTrail` 必须支持身份变化追溯 |
| `BR-ID-013` | 消费方只能读 / 订阅 / 展示身份事实,不得反写 identity truth |
| `BR-ID-014` | trace / audit 必须保留安全可见原因、来源、actor、basis 或 marker |
| `OQ-ID-004` | 字段级 visibility / privacy 裁剪后移 `03`,本批只定义概要 visibility surface |
| Step 6 `MemberSummaryView` | 成员身份事实消费 read model;freshness 由 `ProjectionState` 承接 |
| Step 6 `IdentityTraceRecord` | accepted identity fact 的 append-only 追溯 material |
| Step 6 `AuditTrail` | 由 trace refs 组装的审计时间线读取 aggregate |
| Step 6 `VisibilityPolicy` | summary / trace / audit 读取的 visibility guard |
| Step 6 `ProjectionState` | summary 读取可能返回 stale / degraded 的 freshness marker;完整状态在 9-G 展开 |
| Step 7 `ReadMemberSummary` | 成员摘要 Query |
| Step 7 `ReadIdentityTrace` | trace Query |
| Step 7 `ReadAuditTrail` | audit Query |
| Step 8 §17 | 提供三条只读处理流和 no-write / redaction / degraded 口径 |
| Step 8 §20.7 | 明确 `ProjectionState` / query visible surface 是 Step 9 必须承接的读取状态线索 |

### 17.2 本批状态主语与定义表

本批不新增业务 truth 状态主语。`MemberSummaryView` 是 projection / read model,其 freshness 由 `ProjectionState` 在 9-G 展开;`AuditTrail` 多数是读取组装或可重建投影,不定义长期业务状态。`IdentityTraceRecord` 只定义追溯记录的 append-only 语义状态。query surface 用于表达读取结果,不是持久 truth state。

| 状态主语 | 状态 | 含义 | 是否可进入正常主线 | 触发来源 | 说明 |
|---|---|---|---|---|---|
| `IdentityTraceRecord` | `Appended` | 追溯记录已从 accepted identity fact 追加 | 是 | accepted command / consumer 的 trace material | trace 是追溯 material,不是第二 truth |
| `IdentityTraceRecord` | `Redacted` | 对外读取时需要裁剪部分字段 | 是,但输出受限 | `ReadIdentityTrace` / `ReadAuditTrail` visibility decision | 不删除原始安全 marker,只影响读取视图 |
| `IdentityTraceRecord` | `SupersededByCorrection` | 后续 correction trace 在解释上替代本条 | 受限 / 保留 | 后续正式 correction append trace | 纠错仍以追加记录表达,不得原地覆盖 |
| query surface | `SummaryFound` | 成员摘要可见且可返回安全 summary refs | 不适用 | `ReadMemberSummary` | 读取结果 surface,不写 truth |
| query surface | `SummaryNotFound` | 未找到 member 或 summary projection | 不适用 | `ReadMemberSummary` | 不触发创建 member 或 rebuild projection |
| query surface | `SummaryNotVisible` | 当前 actor / consumer 无权读取成员摘要 | 不适用 | `ReadMemberSummary` visibility decision | 不等同不存在,不得泄露不可见字段 |
| query surface | `SummaryStale` | summary projection freshness 落后或来源 cursor 已变化 | 不适用 | `ReadMemberSummary` / `ProjectionState` | 不触发 rebuild;完整 freshness 在 9-G 展开 |
| query surface | `SummaryDegraded` | projection、visibility 或部分 slice 不可完整返回 | 不适用 | `ReadMemberSummary` | 不伪装成 fresh;不得泄露 debug body |
| query surface | `TraceEmpty` | 查询范围内无可见 trace | 不适用 | `ReadIdentityTrace` / `ReadAuditTrail` | 不补写 trace |
| query surface | `TraceNotVisible` | trace / audit 因 visibility 不可见 | 不适用 | `ReadIdentityTrace` / `ReadAuditTrail` visibility decision | 不泄露 reason / source / basis / actor 详情 |
| query surface | `TraceDegraded` | trace 缺失、不完整、projection 不可用或审计组装降级 | 不适用 | `ReadIdentityTrace` / `ReadAuditTrail` | 不修复缺失 trace |

### 17.3 状态流转图

```text
<accepted identity fact change>
    │ accepted command / consumer creates trace material
    ▼
IdentityTraceRecord::Appended
    │ ReadIdentityTrace / ReadAuditTrail visibility decision
    ▼
redacted read surface

IdentityTraceRecord::Appended
    │ later formal correction trace appended
    ▼
IdentityTraceRecord::SupersededByCorrection

ReadMemberSummary
    │ read truth summary / projection / visibility
    ├─> SummaryFound
    ├─> SummaryNotFound
    ├─> SummaryNotVisible
    ├─> SummaryStale
    └─> SummaryDegraded

ReadIdentityTrace / ReadAuditTrail
    │ read trace refs / audit scope / visibility
    ├─> trace found with redacted refs
    ├─> TraceEmpty
    ├─> TraceNotVisible
    └─> TraceDegraded
```

关键说明:

- `SummaryFound`、`SummaryStale`、`TraceEmpty` 等是 query result surface,不是长期状态。
- `IdentityTraceRecord::Redacted` 表达读取视图被裁剪,不是对 trace truth 的原地改写。
- `MemberSummaryView` 的 stale / degraded 由 `ProjectionState` 表达,本批只说明读取 surface。
- `ReadMemberSummary`、`ReadIdentityTrace`、`ReadAuditTrail` 均不创建、刷新、重建、修复或发布。

### 17.4 允许迁移 / surface 清单

| 迁移 / surface | 触发来源 | 约束 |
|---|---|---|
| `<accepted identity fact change> -> IdentityTraceRecord::Appended` | accepted command / consumer trace material | 必须绑定 accepted change、member ref、subject ref、change kind 和安全 marker |
| `IdentityTraceRecord::Appended -> redacted read surface` | `ReadIdentityTrace` / `ReadAuditTrail` visibility decision | 只影响读取输出,不修改 trace record |
| `IdentityTraceRecord::Appended -> SupersededByCorrection` | 后续正式 correction trace appended | 必须通过追加 trace 表达,不得覆盖原 trace |
| `ReadMemberSummary -> SummaryFound` | `ReadMemberSummary` | 必须经过 visibility / redaction boundary;只返回 safe summary refs |
| `ReadMemberSummary -> SummaryNotFound` | `ReadMemberSummary` read miss | 不创建 member、不创建 projection |
| `ReadMemberSummary -> SummaryNotVisible` | `ReadMemberSummary` visibility decision | 不可见不等于不存在 |
| `ReadMemberSummary -> SummaryStale / SummaryDegraded` | `ReadMemberSummary` 读取 `ProjectionState` / projection slice | 不触发 rebuild,不伪装成 fresh |
| `ReadIdentityTrace -> TraceEmpty / TraceNotVisible / TraceDegraded` | `ReadIdentityTrace` | 不补写 trace,不泄露不可见字段 |
| `ReadAuditTrail -> TraceEmpty / TraceNotVisible / TraceDegraded` | `ReadAuditTrail` | 不修复缺失 trace,不保存 raw log |

### 17.5 禁止迁移清单

| 禁止迁移 / 方向 | 禁止原因 |
|---|---|
| Query 创建 `GlobalMember`、summary、trace 或 audit entry | 违反 query no-write |
| Query 触发 projection rebuild、source refresh、trace repair 或 reconciliation | 维护职责属于 9-G / Operations Job |
| `SummaryStale -> SummaryFound` 由 query 自动修复 | stale 只能显式返回或由正式 job 后续处理 |
| `TraceEmpty -> IdentityTraceRecord::Appended` 由 trace query 补写 | trace 必须来自 accepted change |
| `Redacted -> Appended` 作为 trace truth 覆盖 | redaction 是读取视图,不是 trace 状态恢复 |
| 原地修改或删除已确认 `IdentityTraceRecord` | trace 追溯必须 append-only |
| 使用 trace / audit 推导并覆盖业务 truth | trace / audit 不是第二 truth |
| cursor / filter / audit scope 改变 truth 顺序或状态 | cursor / scope 是读取控制面 |
| summary / trace / audit 输出 method、work、memory、artifact、conversation、archive package、runtime body、debug log 或 raw log | 违反 forbidden body 与 visibility 边界 |
| query response 被当成 outbound event material | event material 必须来自 accepted fact,统一在 9-H 展开 |

### 17.6 状态传播影响

```text
Accepted identity fact change
    │
    ├─> IdentityTraceRecord::Appended
    ├─> IdentityOutboxRecord pending material in propagation layer
    └─> related MemberSummaryView / ProjectionState stale marker

ReadMemberSummary
    │
    ├─> reads MemberSummaryView / ProjectionState
    ├─> applies VisibilityPolicy
    └─> returns found / not_found / not_visible / stale / degraded without writing truth

ReadIdentityTrace
    │
    ├─> reads IdentityTraceRecord append history
    ├─> applies VisibilityPolicy
    └─> returns trace refs / empty / not_visible / degraded without writing truth

ReadAuditTrail
    │
    ├─> assembles trace refs by AuditScopeRef
    ├─> applies VisibilityPolicy
    └─> returns audit refs / empty / not_visible / degraded without writing truth
```

传播约束:

- Accepted change 追加 trace 和标记 projection stale 可以发生在业务写路径;9-F 的 Query 只读取这些结果。
- `ReadMemberSummary` 返回 stale / degraded 不会触发 rebuild;9-G 再定义 projection maintenance。
- `ReadIdentityTrace` / `ReadAuditTrail` 只读取 trace refs 和 redacted material,不得补写、修复或删除 trace。
- Query response 不进入 outbox,也不替代 accepted outbound event。
- 不可见或 degraded 输出不得通过 diagnostic、debug 或 raw marker 泄露 forbidden body。

### 17.7 与 Step 7 / Step 8 触发来源反查表

| 状态 / surface | Step 7 来源 | Step 8 flow | 本批结论 |
|---|---|---|---|
| `IdentityTraceRecord::Appended` | accepted command / consumer trace material | 8-A~8-E accepted flows;8-H propagation | 追溯来自 accepted fact,不是 query 生成 |
| `IdentityTraceRecord::Redacted` read surface | `ReadIdentityTrace`, `ReadAuditTrail` | §17.7 / §17.8 query | 读取视图裁剪,不是原地改写 |
| `IdentityTraceRecord::SupersededByCorrection` | 后续正式 correction trace | §17.7 trace query;前序 correction append flow | 解释性替代,旧 trace 保留 |
| `SummaryFound` / `SummaryNotFound` | `ReadMemberSummary` | §17.6 query | read surface,不创建 / 不修复 |
| `SummaryNotVisible` | `ReadMemberSummary` | §17.6 visibility boundary | 不可见不等同不存在 |
| `SummaryStale` / `SummaryDegraded` | `ReadMemberSummary`, `GetProjectionState` | §17.6 query;8-G projection state | 读取降级,不触发 rebuild |
| `TraceEmpty` / `TraceNotVisible` / `TraceDegraded` | `ReadIdentityTrace`, `ReadAuditTrail` | §17.7 / §17.8 query | trace / audit read surface,不补写 |
| projection freshness | `GetProjectionState`, `RebuildIdentityProjection` | 8-G projection flow | 完整状态在 9-G 展开 |
| publish pending / failed | accepted outbox material, `PublishIdentityOutbox` | 8-H outbound publish | 传播状态在 9-H 展开 |

### 17.8 本批停审记录

| 停审项 | 结论 | 说明 |
|---|---|---|
| 状态归属 | 通过 | `IdentityTraceRecord` 属于“身份事实消费与追溯”;summary freshness 归 `ProjectionState`,不在本批新建业务状态 |
| 触发来源 | 通过 | 三个 Query 回指 Step 7 / Step 8;trace append 回指 accepted change material |
| 禁止方向 | 通过 | query create、query repair、trace second truth、cursor 改 truth、query response event 均明确禁止 |
| visibility / redaction | 通过 | summary、trace、audit 均必须经 `VisibilityPolicy`;字段级 schema 后移 `03` |
| forbidden body | 通过 | 外部正文、raw log、debug body、archive package、basis body 等不得通过读取或 diagnostic 泄漏 |
| 传播影响 | 通过 | accepted trace append、summary read、trace read、audit read 的影响和边界已说明 |
| 概要粒度 | 通过 | 未写 DTO 字段全集、redaction schema、repository port、SQL、cursor 排序规则或错误码全集 |
| 外部边界 | 通过 | consumer 私有状态、observability raw log、外部审计仓 truth 均未进入 identity 状态机 |

### 17.9 本批回填草稿片段

正式 `02-概要设计.md` §9 后续可汇总为:

- 身份事实消费与追溯不新增业务 truth 状态;`ReadMemberSummary`、`ReadIdentityTrace`、`ReadAuditTrail` 只返回读取 surface。
- `IdentityTraceRecord` 的长期语义是 append-only trace material,包含 `Appended`、读取时 `Redacted` surface 和 `SupersededByCorrection` 解释状态。
- `MemberSummaryView` 的 freshness / stale / degraded 由 `ProjectionState` 承接,读取时只暴露 found / not_found / not_visible / stale / degraded。
- Trace / audit 读取只返回可见 trace refs / audit refs / empty / not_visible / degraded,不得修复缺失 trace 或把 trace 当第二 truth。
- 所有读取必须经过 visibility / redaction,不得输出外部正文、raw log、debug body、archive package、basis body 或不可见字段。

正式正文要等 9-I 完成并在 Step 14 统一装配,当前不直接回填。

### 17.10 进入 9-G 的条件

进入 9-G “派生维护与对账状态集合”前,需要用户确认:

- 9-F 不新增业务 truth 状态主语;summary / trace / audit 读取只定义 query surface。
- `IdentityTraceRecord` 只承接 append-only 追溯语义,不替代业务 truth。
- `MemberSummaryView` 的 freshness / stale / degraded 完整状态交给 9-G `ProjectionState`。
- `ReadMemberSummary`、`ReadIdentityTrace`、`ReadAuditTrail` 不创建、不刷新、不重建、不修复、不发布。
- query response 不作为 outbound event material;event / outbox / handoff 状态在 9-H 展开。

当前已获用户确认,本文件进入 §18 9-G 批次。

## 18. 9-G 派生维护与对账状态集合

### 18.1 本批输入与承接

| 来源 | 本批承接点 |
|---|---|
| `FR-ID-014` | projection、reference resolution 和 reconciliation report 需要可维护、可读取、可降级 |
| `BR-ID-015` | 维护 / 对账只能 report-only 或更新本仓派生状态,不得修复相邻仓 truth |
| `VETO-ID-005` | maintenance / reconciliation 修改相邻仓 truth 或绕过正式 command 写 identity truth 为 0 容忍 |
| `AC-ID-005` | 需要证明身份事实可被消费、变化可追溯、对账不修复相邻仓 truth |
| Step 3 query no-write / report-only 约束 | Query 不触发 rebuild / refresh / reconciliation;finding 不等于 remediation plan |
| Step 6 `ProjectionState` | projection freshness、stale、degraded、rebuild pending、rebuilt、failed 状态主语 |
| Step 6 `ReferenceResolutionState` | 外部引用 resolved、stale、unavailable、unrecognized、pending reconciliation、refresh failed 状态主语 |
| Step 6 `ReconciliationPolicy` | report-only、no cross-repo repair、no command bypass、no query refresh guard |
| Step 6 `ReconciliationReport` | 对账范围、finding refs、issue refs、failed / partial / no finding 的 report-only 主语 |
| Step 7 `GetProjectionState` / `GetReferenceResolutionState` / `ReadReconciliationReport` | 本批 Query surface,只读状态和报告 |
| Step 7 `RebuildIdentityProjection` / `RefreshExternalReferenceState` / `RunIdentityReconciliation` | 本批 Operations Job,只写派生状态、marker 或 report |
| Step 8 §18 | 明确三条 Query no-write 和三条维护 Job 的处理流 |
| Step 8 §20.7 | 明确 `ProjectionState`、`ReferenceResolutionState`、`ReconciliationReport` 是 Step 9 必须承接的状态主语 |

### 18.2 本批状态主语与状态定义表

本批定义三个长期状态主语:`ProjectionState.state_kind`、`ReferenceResolutionState.state_kind` 和 `ReconciliationReport.report_state`。`ReconciliationPolicy` 是 guard,不保存长期状态。Query 返回的 found、not_found、not_visible、empty 等是读取 surface,不是本批新增 truth state。

| 状态主语 | 状态 | 含义 | 主线判断 | 触发 / 暴露来源 | 边界说明 |
|---|---|---|---|---|---|
| `ProjectionState` | `Fresh` | projection 与已知 accepted fact cursor 或 projection cursor 对齐 | 正常读取 | `GetProjectionState`;accepted write path 标记后续读取 | 不代表 projection 拥有 truth |
| `ProjectionState` | `Stale` | projection 落后、来源 cursor 已变化或需要重建 | 受限读取 / 可维护 | accepted fact 后续 marker;`RebuildIdentityProjection` | 必须显式暴露,不得静默当 fresh |
| `ProjectionState` | `RebuildPending` | 已安排或需要后台重建,尚未完成 | 派生维护态 | `RebuildIdentityProjection` intake / scheduling marker | 不阻塞 accepted truth |
| `ProjectionState` | `Rebuilt` | 最近一次重建完成并携带 cursor / checked marker | 派生维护态 / 可转 fresh | `RebuildIdentityProjection` | 只说明派生状态更新完成 |
| `ProjectionState` | `Degraded` | projection 可读但不完整、受限或存在 issue marker | 受限读取 | `GetProjectionState`;`RebuildIdentityProjection` | 不能伪装完整成功 |
| `ProjectionState` | `RebuildFailed` | projection 重建失败 | 维护失败态 | `RebuildIdentityProjection` | 失败不触发跨仓 repair |
| `ReferenceResolutionState` | `Resolved` | 外部引用可解析,安全摘要 marker 可用 | 正常 / 可被后续正式 flow 使用 | `RefreshExternalReferenceState`;source consumer marker | 不代表 identity 拥有外部 truth |
| `ReferenceResolutionState` | `Stale` | 外部来源版本变化、解析状态过期或需刷新 | 受限读取 / 可维护 | source changed marker;`RefreshExternalReferenceState` | 不自动生成 accepted truth |
| `ReferenceResolutionState` | `Unavailable` | 外部来源暂不可用或读取失败 | 受限 / report-only | `RefreshExternalReferenceState`;`GetReferenceResolutionState` | 不得用默认值补造事实 |
| `ReferenceResolutionState` | `Unrecognized` | 外部引用无法映射到正式 ref / marker | 阻断或 report-only | `RefreshExternalReferenceState` | 不得拼接私有 ID 当本仓 subject |
| `ReferenceResolutionState` | `PendingReconciliation` | 引用状态与本仓 projection / truth 存在待解释差异 | report-only / 待维护 | `RefreshExternalReferenceState`;`RunIdentityReconciliation` | 修复必须回正式 owner 能力 |
| `ReferenceResolutionState` | `RefreshFailed` | 引用刷新任务失败 | 维护失败态 | `RefreshExternalReferenceState` | 生成 issue / report,不修复外部 truth |
| `ReconciliationReport` | `Generated` | 报告已生成且可读取 | report-only | `RunIdentityReconciliation`;`ReadReconciliationReport` | 不代表 finding 已修复 |
| `ReconciliationReport` | `NoFinding` | 本次范围未发现漂移 | report-only 正常结果 | `RunIdentityReconciliation` | 仍是对账结论,不是 truth |
| `ReconciliationReport` | `FindingDetected` | 发现 projection / reference / consumer 边界漂移 | report-only 待处理 | `RunIdentityReconciliation` | 修复需回到正式 owner 能力 |
| `ReconciliationReport` | `Partial` | 部分范围完成、部分失败或不可用 | report-only 降级结果 | `RunIdentityReconciliation` | 不得伪造成全量成功 |
| `ReconciliationReport` | `Failed` | 对账执行失败 | report-only 失败结果 | `RunIdentityReconciliation` | 必须显式暴露 issue marker |

### 18.3 状态流转图

`ProjectionState`:

```text
Fresh
  |
  | accepted fact cursor changed / source marker changed
  v
Stale
  |
  | RebuildIdentityProjection scheduled
  v
RebuildPending
  | \
  |  \ rebuild failed
  |   v
  |  RebuildFailed
  |
  | rebuild completed with cursor
  v
Rebuilt
  |
  | freshness check accepted
  v
Fresh

Fresh / Stale / Rebuilt
  |
  | partial material / visibility / safe summary issue
  v
Degraded
```

`ReferenceResolutionState`:

```text
Resolved
  |
  | source version changed / marker expired
  v
Stale
  |
  | RefreshExternalReferenceState
  +--------------------+
  |                    |
  v                    v
Resolved          Unavailable
  |                    |
  |                    v
  |              RefreshFailed
  |
  +--> PendingReconciliation

External reference cannot be mapped
  |
  v
Unrecognized
```

`ReconciliationReport.report_state`:

```text
RunIdentityReconciliation
  |
  +--> Generated
          |
          +--> NoFinding
          |
          +--> FindingDetected
          |
          +--> Partial
          |
          +--> Failed
```

Query surface:

```text
GetProjectionState / GetReferenceResolutionState / ReadReconciliationReport
  |
  v
read persisted state or report
  |
  v
return visible marker

Query 不进入 RebuildIdentityProjection / RefreshExternalReferenceState / RunIdentityReconciliation。
```

### 18.4 允许迁移 / surface 清单

| 迁移 / surface | 触发来源 | 允许条件 | 结果 |
|---|---|---|---|
| `ProjectionState::Fresh -> Stale` | accepted identity fact 改变、projection cursor 落后、source marker 变化 | 只标记 projection 需要重建,不修改核心 truth | 读取必须可见 stale |
| `ProjectionState::Stale -> RebuildPending` | `RebuildIdentityProjection` 开始或维护调度 marker | 维护任务在 Operations Job 路径运行 | 标记后台重建中 |
| `ProjectionState::RebuildPending -> Rebuilt` | `RebuildIdentityProjection` 成功完成 | 只重建 identity-owned projection / safe summary | 写入 rebuilt cursor / checked marker |
| `ProjectionState::Rebuilt -> Fresh` | freshness check 认可 rebuilt cursor | cursor 来源合法且不被解释为 truth cursor | projection 可作为 fresh read model |
| `ProjectionState::* -> Degraded` | safe summary 缺失、visibility 降级、部分 projection 不完整 | issue marker 可追溯 | 读取返回 degraded |
| `ProjectionState::RebuildPending -> RebuildFailed` | 重建失败 | 失败可报告,不得修复 truth | 写 issue marker / failed state |
| `ReferenceResolutionState::Resolved -> Stale` | 外部 source version 或 marker 变化 | 只标记解析状态过期 | 需要 refresh 或 report |
| `ReferenceResolutionState::Stale -> Resolved` | `RefreshExternalReferenceState` 成功 | 只保存 body-free ref / version / safe summary marker | resolved 可供后续正式 flow 参考 |
| `ReferenceResolutionState::* -> Unavailable` | 外部来源不可用 | 不使用默认值补造事实 | 返回 unavailable / issue marker |
| `ReferenceResolutionState::* -> Unrecognized` | 外部引用无法映射到正式 ref | 不拼接私有 ID | 返回 unrecognized / report-only |
| `ReferenceResolutionState::* -> PendingReconciliation` | 解析状态与 projection / truth 出现待解释差异 | 修复不在本状态机执行 | 后续生成 report-only finding |
| `ReferenceResolutionState::Stale -> RefreshFailed` | 刷新任务失败 | 保存失败 issue marker | 不反写外部 owner |
| `ReconciliationReport::Generated -> NoFinding` | `RunIdentityReconciliation` 完成且无发现 | report-only | 返回 clean report marker |
| `ReconciliationReport::Generated -> FindingDetected` | `RunIdentityReconciliation` 发现 drift / stale / unavailable | finding body-free | 记录 finding refs / issue refs |
| `ReconciliationReport::Generated -> Partial` | 只完成部分 target 或部分来源不可用 | partial 必须显式 | 不伪造成 no finding |
| `ReconciliationReport::Generated -> Failed` | 对账任务失败 | 保存 issue marker | 返回 failed report |
| Query found / not_found / not_visible / stale / degraded / failed surface | 三个 Query | 只读已持久化状态和 report | 不创建、不重建、不刷新、不对账 |

### 18.5 禁止迁移清单

| 禁止迁移 / 行为 | 禁止原因 |
|---|---|
| `GetProjectionState -> RebuildIdentityProjection` | Query no-write;读取不得触发维护任务 |
| `GetReferenceResolutionState -> RefreshExternalReferenceState` | Query 不调用外部 resolver,不刷新来源 |
| `ReadReconciliationReport -> RunIdentityReconciliation` | report 读取不得触发对账或 remediation |
| `ProjectionState::* -> GlobalMember / lifecycle / role / career / memory truth write` | projection 是派生状态,不是第二 truth |
| `RebuildIdentityProjection -> 修复相邻仓 truth` | 违反 report-only maintenance 和 no cross-repo repair |
| `ReferenceResolutionState::Unavailable / Unrecognized -> Resolved` 且无正式 refresh 成功 marker | 防止默认补造外部事实 |
| `RefreshExternalReferenceState -> 保存 method / work / governance / memory / archive body` | reference state 只能保存 refs、version、safe marker、issue marker |
| `ReconciliationReport::FindingDetected -> 自动 remediation command` | finding 不是修复计划 |
| `ReconciliationReport::Partial / Failed -> NoFinding` | 不得把部分完成或失败伪装成 clean |
| `ProjectionState::Degraded / RebuildFailed -> Fresh` 且无合法 rebuild / freshness marker | 不得隐藏降级或失败 |
| maintenance job 绕过正式 command 写 identity truth | 违反业务写入边界 |
| 通过外部私有 ID 字符串拼本仓 subject / scope / reference | typed ref 和 boundary marker 必须正式来源 |
| report / issue 携带 external body、raw log、adapter response、archive package、debug dump | forbidden body 约束 |

### 18.6 状态传播影响

```text
accepted identity truth change
    │
    ├─> IdentityTraceRecord::Appended
    ├─> IdentityOutboxRecord::Pending        (9-H 展开)
    └─> ProjectionState::Stale

RebuildIdentityProjection
    │
    └─> ProjectionState::RebuildPending / Rebuilt / Degraded / RebuildFailed
            │
            └─> GetProjectionState / ReadMemberSummary visible freshness surface

RefreshExternalReferenceState
    │
    └─> ReferenceResolutionState::Resolved / Stale / Unavailable / Unrecognized / PendingReconciliation / RefreshFailed
            │
            └─> role / memory / career source flow 只能读取 marker,不得当作外部 truth body

RunIdentityReconciliation
    │
    └─> ReconciliationReport::NoFinding / FindingDetected / Partial / Failed
            │
            └─> ReadReconciliationReport visible report-only surface
```

传播结论:

- 业务 accepted truth 可以标记 projection stale,但 projection stale / rebuilt 不反向改写业务 truth。
- reference refresh 只能改变 `ReferenceResolutionState`,不能让外部 owner truth 被本仓修复。
- reconciliation report 只能产生 finding / issue / failed / partial marker,不能触发自动 remediation。
- failed、partial、degraded、unavailable、unrecognized 必须对 Query / report 可见,不得在传播中被隐藏。
- 9-G 不定义 outbound event publish 或 handoff delivered;这些传播状态在 9-H 展开。

### 18.7 与 Step 7 / Step 8 触发来源反查表

| 状态 / surface | 触发来源 | Step 8 来源 | 说明 |
|---|---|---|---|
| `ProjectionState::Fresh` | `GetProjectionState`, freshness check after rebuild | §18.6 / §18.9 | 读取或维护结果,不写 truth |
| `ProjectionState::Stale` | accepted fact cursor changed, `GetProjectionState`, `RebuildIdentityProjection` | §18.6 / §18.9 | 读取必须可见 stale |
| `ProjectionState::RebuildPending` | `RebuildIdentityProjection` | §18.9 | Operations Job 路径,不是 Query |
| `ProjectionState::Rebuilt` | `RebuildIdentityProjection` | §18.9 | 只写派生 projection / state |
| `ProjectionState::Degraded` | `GetProjectionState`, `RebuildIdentityProjection` | §18.6 / §18.9 | 可读但不完整或受限 |
| `ProjectionState::RebuildFailed` | `RebuildIdentityProjection` | §18.9 | 失败产生 issue marker |
| `ReferenceResolutionState::Resolved` | `RefreshExternalReferenceState` | §18.10 | 保存 ref / version / safe marker |
| `ReferenceResolutionState::Stale` | source marker changed, `RefreshExternalReferenceState` | §18.10 | 不生成 accepted truth |
| `ReferenceResolutionState::Unavailable` | `RefreshExternalReferenceState`, `GetReferenceResolutionState` | §18.7 / §18.10 | 外部不可用显式暴露 |
| `ReferenceResolutionState::Unrecognized` | `RefreshExternalReferenceState`, `GetReferenceResolutionState` | §18.7 / §18.10 | 无法识别 ref 不得拼接 |
| `ReferenceResolutionState::PendingReconciliation` | `RefreshExternalReferenceState`, `RunIdentityReconciliation` | §18.10 / §18.11 | 待解释差异只进入 report-only |
| `ReferenceResolutionState::RefreshFailed` | `RefreshExternalReferenceState` | §18.10 | refresh failure 不伪成功 |
| `ReconciliationReport::Generated` | `RunIdentityReconciliation` | §18.11 | report 已生成,不是修复 |
| `ReconciliationReport::NoFinding` | `RunIdentityReconciliation`, `ReadReconciliationReport` | §18.8 / §18.11 | 本范围无发现 |
| `ReconciliationReport::FindingDetected` | `RunIdentityReconciliation`, `ReadReconciliationReport` | §18.8 / §18.11 | finding 不等于 remediation |
| `ReconciliationReport::Partial` | `RunIdentityReconciliation`, `ReadReconciliationReport` | §18.8 / §18.11 | 部分完成 / 部分不可用显式暴露 |
| `ReconciliationReport::Failed` | `RunIdentityReconciliation`, `ReadReconciliationReport` | §18.8 / §18.11 | 对账失败必须可见 |

### 18.8 本批停审记录

| 停审项 | 结论 | 说明 |
|---|---|---|
| 状态归属 | 通过 | `ProjectionState`、`ReferenceResolutionState`、`ReconciliationReport` 均来自 Step 6 / Step 8 |
| 触发来源 | 通过 | 三个 Query 和三个 Operations Job 均回指 Step 7 / Step 8 |
| Query no-write | 通过 | Query 只读 state / report,不触发 rebuild、refresh、reconciliation 或 repair |
| 派生维护边界 | 通过 | Job 只写 projection state、reference resolution state 或 report,不写业务 truth |
| report-only | 通过 | finding / failed / partial 只形成报告和 issue marker,不自动修复 |
| forbidden body | 通过 | reference state 和 report 禁止 external body、raw log、adapter response、archive package、debug dump |
| 状态失败显式性 | 通过 | stale、degraded、unavailable、unrecognized、refresh failed、partial、failed 均不得伪成功 |
| 概要粒度 | 通过 | 未写 repository port、runner schedule、retry policy、cursor schema、SQL 或 adapter timeout |
| 传播边界 | 通过 | outbound publish / handoff 状态未提前展开,留给 9-H |

### 18.9 本批回填草稿片段

正式 `02-概要设计.md` §9 后续可汇总为:

- 派生维护与对账包含 `ProjectionState`、`ReferenceResolutionState` 和 `ReconciliationReport.report_state` 三类状态主语。
- `ProjectionState` 表达 projection 的 `Fresh`、`Stale`、`RebuildPending`、`Rebuilt`、`Degraded`、`RebuildFailed`;projection 不是第二 truth,重建不修改核心身份事实。
- `ReferenceResolutionState` 表达外部引用 `Resolved`、`Stale`、`Unavailable`、`Unrecognized`、`PendingReconciliation`、`RefreshFailed`;刷新只保存 body-free marker,不拥有外部 truth。
- `ReconciliationReport.report_state` 表达 `Generated`、`NoFinding`、`FindingDetected`、`Partial`、`Failed`;finding 是 report-only,不是 remediation plan。
- `GetProjectionState`、`GetReferenceResolutionState`、`ReadReconciliationReport` 全部 no-write;`RebuildIdentityProjection`、`RefreshExternalReferenceState`、`RunIdentityReconciliation` 只能写派生状态、marker 或 report。
- failed、partial、stale、degraded、unavailable、unrecognized 必须显式暴露,不得伪装成 fresh / resolved / no finding。

正式正文要等 9-I 完成并在 Step 14 统一装配,当前不直接回填。

### 18.10 进入 9-H 的条件

进入 9-H “身份事实传播与外部交接状态集合”前,需要用户确认:

- 9-G 的三类状态主语和状态集合可以作为后续 9-H / Step 10 / `03` 输入。
- Query no-write 已闭合:读取 projection state、reference state、report 不触发维护任务。
- Operations Job 只写派生状态 / marker / report,不修复相邻仓 truth,不绕过 command 写 identity truth。
- report-only、forbidden body、failed / partial / stale / degraded 显式暴露口径已满足本批停审。
- outbound event publish、outbox retry、trace handoff 和 receipt 状态在 9-H 展开,本批不提前定义。

当前已获用户确认,本文件进入 §19 9-H 批次。

## 19. 9-H 身份事实传播与外部交接状态集合

### 19.1 本批输入与承接

| 来源 | 本批承接点 |
|---|---|
| `FR-ID-012` | accepted identity fact 必须通过正式 outbox / event material 被相邻仓消费 |
| `FR-ID-013` | 身份变化 trace / audit / archive / observability material 必须可追溯交接 |
| `BR-ID-013` | 下游消费不得反写 identity truth,传播只表达本仓 accepted fact |
| `BR-ID-014` | handoff 必须可追溯到安全可见原因、来源、actor、basis 或 marker |
| `VETO-ID-003` | event / handoff material 携带 memory、artifact、conversation、runtime body、receipt body、archive package 或 secret 为 0 容忍 |
| `AC-ID-005` | 必须证明身份事实可消费、变化可追溯、传播失败不回滚 accepted truth |
| Step 3 accepted fact eventual propagation | publish / handoff 失败不能回滚 accepted identity truth |
| Step 6 `IdentityOutboxRecord` / `OutboxState` | outbox material 与 publish state 主语 |
| Step 6 `TraceHandoffIntent` / `HandoffState` | trace / audit / archive handoff intent 与交接状态主语 |
| Step 6 `OutboundEventPolicy` / `HandoffPolicy` | accepted-only、body-free、visibility、not acceptance gate 和 no fake delivered guard |
| Step 7 `PrepareTraceHandoff` | 本批唯一 Command,只创建 pending handoff intent |
| Step 7 `ListPendingIdentityOutbox` / `GetIdentityOutboxState` / `GetTraceHandoffState` | 本批传播 / handoff 状态 Query |
| Step 7 `HandleTraceHandoffResult` | 本批 handoff receipt / failure marker Consumer |
| Step 7 outbound event skeleton | 前序 accepted fact material 的统一发布输入 |
| Step 7 `PublishIdentityOutbox` / `DeliverTraceHandoff` / `RetryIdentityPropagationFailures` | 本批传播 / handoff Operations Job |
| Step 8 §19 | 明确 prepare、query、consumer、publish、deliver、retry 的处理流和 no-write / no fake success 边界 |
| Step 8 §20.7 | 明确 `OutboxState` 和 `HandoffState` 是 Step 9 必须承接的状态主语 |

### 19.2 本批状态主语与状态定义表

本批定义两个长期状态主语:`OutboxState.state_kind` 和 `HandoffState.state_kind`。`IdentityOutboxRecord` 与 `TraceHandoffIntent` 是承载记录 / intent,不再另起重复状态枚举。`OutboundEventPolicy` 与 `HandoffPolicy` 是 guard,不保存长期状态。

| 状态主语 | 状态 | 含义 | 主线判断 | 触发 / 暴露来源 | 边界说明 |
|---|---|---|---|---|---|
| `OutboxState` | `PendingPublish` | accepted change 已形成 outbox material,等待发布 | 传播待处理 | accepted command / consumer outbox material;`ListPendingIdentityOutbox` | command accepted 不等待发布 |
| `OutboxState` | `Published` | outbox 已成功发布到正式 outbound boundary | 传播完成态 | `PublishIdentityOutbox` | 不代表所有下游业务已处理 |
| `OutboxState` | `RetryableFailed` | 发布失败但可重试 | 可恢复失败态 | `PublishIdentityOutbox`;`RetryIdentityPropagationFailures` | retry 必须重新经过 policy |
| `OutboxState` | `Failed` | 发布失败且需报告或人工处理 | 失败态 | `PublishIdentityOutbox`;retry exhaustion | 不回滚 accepted truth |
| `OutboxState` | `SkippedByPolicy` | 因可见性、topic 或传播策略跳过 | 策略终态 / 可解释态 | `PublishIdentityOutbox`;`OutboundEventPolicy` | 必须保留原因 marker |
| `HandoffState` | `PendingHandoff` | handoff intent 已创建,等待交接 | 交接待处理 | `PrepareTraceHandoff`;`GetTraceHandoffState` | 不代表 delivered |
| `HandoffState` | `Delivered` | 已收到正式 receipt marker | 交接完成态 | `HandleTraceHandoffResult` | 不保存 receipt body |
| `HandoffState` | `RetryableFailed` | 交接失败但可重试 | 可恢复失败态 | `DeliverTraceHandoff`;`HandleTraceHandoffResult`;retry job | retry 不能绕过 target / body-free guard |
| `HandoffState` | `Failed` | 交接失败且需报告或人工处理 | 失败态 | `DeliverTraceHandoff`;`HandleTraceHandoffResult`;retry exhaustion | 不回滚 accepted truth |
| `HandoffState` | `Cancelled` | 交接按策略取消 | 策略终态 / 可解释态 | `HandleTraceHandoffResult`;`HandoffPolicy` | 必须有原因 marker |

### 19.3 状态流转图

`OutboxState`:

```text
accepted identity change
  |
  v
PendingPublish
  | \
  |  \ policy skip
  |   v
  |  SkippedByPolicy
  |
  | PublishIdentityOutbox success
  v
Published

PendingPublish
  |
  | publish failure retryable
  v
RetryableFailed
  | \
  |  \ retry exhausted / non-retryable
  |   v
  |  Failed
  |
  | RetryIdentityPropagationFailures success
  v
Published
```

`HandoffState`:

```text
PrepareTraceHandoff
  |
  v
PendingHandoff
  |
  | DeliverTraceHandoff request sent
  |   delivered state not set here
  v
PendingHandoff
  |
  | HandleTraceHandoffResult with HandoffReceiptRef
  v
Delivered

PendingHandoff
  |
  | delivery / callback retryable failure
  v
RetryableFailed
  | \
  |  \ retry exhausted / non-retryable
  |   v
  |  Failed
  |
  | retry delivery + receipt marker
  v
Delivered

PendingHandoff / RetryableFailed
  |
  | policy cancellation marker
  v
Cancelled
```

传播关系:

```text
accepted identity truth change
    │
    ├─> IdentityTraceRecord::Appended
    ├─> IdentityOutboxRecord::from_accepted_change(...)
    │       └─> OutboxState::PendingPublish
    └─> optional TraceHandoffIntent via PrepareTraceHandoff
            └─> HandoffState::PendingHandoff

PublishIdentityOutbox / RetryIdentityPropagationFailures
    └─> OutboxState::Published / RetryableFailed / Failed / SkippedByPolicy

DeliverTraceHandoff / HandleTraceHandoffResult
    └─> HandoffState::Delivered / RetryableFailed / Failed / Cancelled
```

### 19.4 允许迁移 / surface 清单

| 迁移 / surface | 触发来源 | 允许条件 | 结果 |
|---|---|---|---|
| accepted change -> `OutboxState::PendingPublish` | accepted command / accepted consumer | 已有 accepted identity fact、trace record、body-free payload marker 和 topic marker | 创建 `IdentityOutboxRecord` |
| `PendingPublish -> Published` | `PublishIdentityOutbox` | `OutboundEventPolicy` 通过;publisher boundary 返回成功 attempt marker | 记录 attempt marker,状态 published |
| `PendingPublish -> RetryableFailed` | `PublishIdentityOutbox` | 发布失败但 retry policy / issue marker 判定可重试 | 保留 issue marker |
| `RetryableFailed -> Published` | `RetryIdentityPropagationFailures` | 重试重新经过 `OutboundEventPolicy` 且 publish 成功 | 状态 published |
| `RetryableFailed -> Failed` | retry exhaustion / non-retryable issue | 不再可自动重试或需人工处理 | 状态 failed,不回滚 truth |
| `PendingPublish -> Failed` | `PublishIdentityOutbox` | 非重试失败 | 状态 failed,保留 issue marker |
| `PendingPublish -> SkippedByPolicy` | `PublishIdentityOutbox` / `OutboundEventPolicy` | visibility、topic 或策略明确不允许传播 | 状态 skipped,保留原因 marker |
| `PrepareTraceHandoff -> HandoffState::PendingHandoff` | `PrepareTraceHandoff` | trace refs、安全 material、target、scope、visibility guard 通过 | 创建 pending `TraceHandoffIntent` |
| `PendingHandoff -> Delivered` | `HandleTraceHandoffResult` | callback 携带正式 `HandoffReceiptRef` marker 且 target / attempt 匹配 | 状态 delivered |
| `PendingHandoff -> RetryableFailed` | `DeliverTraceHandoff` 或 callback failure | delivery / callback 失败且可重试 | 保留 issue marker |
| `RetryableFailed -> Delivered` | `RetryIdentityPropagationFailures` + callback receipt | retry 后收到正式 receipt marker | 状态 delivered |
| `RetryableFailed -> Failed` | retry exhaustion / non-retryable issue | 不再可自动重试或需人工处理 | 状态 failed |
| `PendingHandoff / RetryableFailed -> Cancelled` | `HandleTraceHandoffResult` 或 `HandoffPolicy` | 正式取消原因 marker 存在 | 状态 cancelled |
| outbox / handoff Query surface | `ListPendingIdentityOutbox`, `GetIdentityOutboxState`, `GetTraceHandoffState` | 只读当前状态和 marker | 返回 found / empty / not_visible / pending / delivered / failed surface |

### 19.5 禁止迁移清单

| 禁止迁移 / 行为 | 禁止原因 |
|---|---|
| `PendingPublish -> Published` 且没有 publisher success attempt marker | 防止伪造发布成功 |
| `Published -> accepted truth changed` | 发布状态不能反写业务 truth |
| `Published` 被解释为所有下游业务已消费 | 本仓只能证明 outbound boundary 成功,不能证明 consumer business ack |
| `RetryableFailed / Failed -> Published` 且未重新经过 `OutboundEventPolicy` | retry 不能绕过 accepted-only、visibility、body-free 和 topic guard |
| `SkippedByPolicy -> Published` 且无新策略 / 新 material | 被策略跳过的传播不能静默发布 |
| Query 触发 publish、deliver 或 retry | Query no-write |
| event material 来自 query、projection rebuild、report finding、rejected result 或 stale marker | outbound event 只能来自 accepted identity fact |
| event / payload / topic material 携带 memory body、artifact body、conversation body、runtime body、secret、不可见字段或 archive package | forbidden body / visibility 约束 |
| `PrepareTraceHandoff -> Delivered` | prepare 只创建 pending intent,不执行交付 |
| `DeliverTraceHandoff -> Delivered` 且没有 `HandleTraceHandoffResult` receipt marker | delivered 必须来自正式 receipt marker |
| `PendingHandoff` 被当成 `Delivered` | 防止 handoff 伪成功 |
| `HandoffState` 保存 receipt body、archive package、raw log 或 adapter response | handoff 只保存 refs / marker |
| handoff 成功或失败反写 `GlobalMember`、lifecycle、role、career、memory truth | handoff 是交接状态,不是业务 truth owner |
| retry job 修改不可重试 failed 记录为 retryable | retryability 必须来自正式 issue / policy marker |
| implementation 自造 topic / target / receipt schema | topic、event envelope、handoff target、receipt schema 后移 `03/04` |

### 19.6 状态传播影响

```text
Business accepted transaction
    │
    ├─> core identity truth saved
    ├─> IdentityTraceRecord appended
    ├─> IdentityOutboxRecord pending
    │       └─> OutboxState::PendingPublish
    └─> command result accepted

Outbox publishing
    │
    ├─> Published             (publisher success marker)
    ├─> RetryableFailed       (retryable issue marker)
    ├─> Failed                (non-retryable / exhausted)
    └─> SkippedByPolicy       (policy reason marker)

Trace handoff
    │
    ├─> PrepareTraceHandoff creates PendingHandoff
    ├─> DeliverTraceHandoff sends safe material but does not mark Delivered
    └─> HandleTraceHandoffResult receives marker
            ├─> Delivered
            ├─> RetryableFailed
            ├─> Failed
            └─> Cancelled
```

传播结论:

- accepted truth 与 propagation state 分离;publish / handoff 失败不回滚 accepted truth。
- `IdentityOutboxRecord` 可以让下游感知 accepted fact,但下游消费状态不是本仓 truth。
- `TraceHandoffIntent` 可以让 trace / audit / archive / observability 交接可恢复,但不保存外部 package 或 receipt body。
- query 读取 outbox / handoff state 只解释当前 marker,不触发发布、交付或重试。
- `Published`、`Delivered`、`Failed`、`SkippedByPolicy`、`Cancelled` 均必须带有可追溯 marker,不能只靠状态名。

### 19.7 与 Step 7 / Step 8 触发来源反查表

| 状态 / surface | 触发来源 | Step 8 来源 | 说明 |
|---|---|---|---|
| `OutboxState::PendingPublish` | accepted command / consumer outbox material | §19.11 / 前序 accepted flows | 来自 accepted fact,不是 query / report |
| `OutboxState::Published` | `PublishIdentityOutbox`, `RetryIdentityPropagationFailures` | §19.12 / §19.14 | 只表示 outbound boundary publish success |
| `OutboxState::RetryableFailed` | `PublishIdentityOutbox`, `RetryIdentityPropagationFailures` | §19.12 / §19.14 | 可恢复失败,需 issue marker |
| `OutboxState::Failed` | `PublishIdentityOutbox`, retry exhaustion | §19.12 / §19.14 | 失败不回滚 truth |
| `OutboxState::SkippedByPolicy` | `PublishIdentityOutbox`, `OutboundEventPolicy` | §19.12 | 策略跳过必须有原因 marker |
| `HandoffState::PendingHandoff` | `PrepareTraceHandoff` | §19.6 | intent 创建后进入 pending |
| `HandoffState::Delivered` | `HandleTraceHandoffResult` | §19.10 | 必须有 `HandoffReceiptRef` marker |
| `HandoffState::RetryableFailed` | `DeliverTraceHandoff`, `HandleTraceHandoffResult`, retry job | §19.10 / §19.13 / §19.14 | 可重试失败必须保留 issue marker |
| `HandoffState::Failed` | `DeliverTraceHandoff`, callback failure, retry exhaustion | §19.10 / §19.13 / §19.14 | 失败不回滚 truth |
| `HandoffState::Cancelled` | `HandleTraceHandoffResult`, `HandoffPolicy` | §19.10 | 取消必须有原因 marker |
| outbox list / state query surface | `ListPendingIdentityOutbox`, `GetIdentityOutboxState` | §19.7 / §19.8 | 只读,不发布 / 不重试 |
| handoff state query surface | `GetTraceHandoffState` | §19.9 | 只读,不交付 / 不重试 |

### 19.8 本批停审记录

| 停审项 | 结论 | 说明 |
|---|---|---|
| 状态归属 | 通过 | `OutboxState` 和 `HandoffState` 均来自 Step 6 / Step 8;record / intent 不另起重复状态 |
| 触发来源 | 通过 | Command、Query、Consumer、Outbound material、Job 均回指 Step 7 / Step 8 |
| accepted truth 分离 | 通过 | publish / handoff 成功或失败不作为 command accepted 前置,也不回滚 accepted truth |
| no fake success | 通过 | `Published` 需 publisher success marker;`Delivered` 需正式 receipt marker |
| Query no-write | 通过 | outbox / handoff Query 不发布、不交付、不重试 |
| retry 边界 | 通过 | retry 只能处理 retryable marker,且必须重新经过 policy |
| forbidden body | 通过 | event / handoff / receipt / diagnostic 均不得携带 memory、artifact、runtime、receipt body、archive package、raw log 或 secret |
| 概要粒度 | 通过 | 未写 topic 字符串、event envelope、receipt schema、adapter、runner、retry 配置或 SQL |
| 下游语义边界 | 通过 | `Published` 不代表所有下游业务已处理;handoff 不拥有外部 archive / observability truth |

### 19.9 本批回填草稿片段

正式 `02-概要设计.md` §9 后续可汇总为:

- 身份事实传播与外部交接包含 `OutboxState` 与 `HandoffState` 两类状态主语。
- `OutboxState` 表达 `PendingPublish`、`Published`、`RetryableFailed`、`Failed`、`SkippedByPolicy`;outbox 只传播 accepted identity fact,publish 失败不回滚 accepted truth。
- `HandoffState` 表达 `PendingHandoff`、`Delivered`、`RetryableFailed`、`Failed`、`Cancelled`;delivered 必须来自正式 receipt marker,prepare / deliver request 不能伪造成 delivered。
- `PrepareTraceHandoff` 只创建 pending handoff intent,不执行交付、不改变业务 truth。
- `ListPendingIdentityOutbox`、`GetIdentityOutboxState`、`GetTraceHandoffState` 全部 no-write,不触发 publish、deliver 或 retry。
- `PublishIdentityOutbox`、`DeliverTraceHandoff`、`RetryIdentityPropagationFailures` 只处理 pending / retryable propagation marker,不得发布未 accepted material,不得绕过 policy。
- event / handoff material 不得携带外部正文、memory body、artifact body、conversation body、runtime body、secret、receipt body、archive package 或 raw log。

正式正文要等 9-I 完成并在 Step 14 统一装配,当前不直接回填。

### 19.10 进入 9-I 的条件

进入 9-I “跨状态一致性审计”前,需要用户确认:

- `OutboxState` 与 `HandoffState` 的状态集合和迁移方向可以作为后续 Step 10 / `03` 输入。
- accepted truth 与 propagation / handoff state 分离的口径可接受:publish / handoff 失败不回滚 accepted truth。
- `Published` 不代表下游业务已处理,`Delivered` 必须来自正式 receipt marker。
- Query no-write、retry 重新经过 policy、event / handoff forbidden body 和 no fake success 已满足本批停审。
- topic、event envelope、handoff target、receipt、adapter、retry policy 和 durable schema 后移 `03/04/07`,不在本批补细节。

当前已获用户确认,本文件进入 §20 9-I 批次。

## 20. 9-I 跨状态一致性审计

### 20.1 本批输入与承接

| 来源 | 本批承接点 |
|---|---|
| 9-A 身份锚定与成员真相 | `IdentityAnchorState`、query anchor surface、anchor hold side effect |
| 9-B 全局生命周期 | `GlobalLifecycleState`、high-risk basis surface、lifecycle / availability propagation |
| 9-C 角色能力摘要 | `RoleCapabilitySummary.summary_state`、`RoleCapabilitySourceSnapshot.source_state`、source stale / unavailable |
| 9-D 身份生涯记录 | `CareerRecord.record_state`、append-only、correction append、duplicate no-op |
| 9-E 记忆引用关系 | `MemoryReferenceState`、archive / memory relation marker、memory source state 关联 |
| 9-F 身份事实消费与追溯 | query visible surface、`IdentityTraceRecord` append-only 语义、summary freshness 归属 |
| 9-G 派生维护与对账 | `ProjectionState`、`ReferenceResolutionState`、`ReconciliationReport.report_state` |
| 9-H 身份事实传播与外部交接 | `OutboxState`、`HandoffState`、publish / handoff 状态 |
| Step 6 关键对象 | 所有状态主语必须已在 Step 6 出现 |
| Step 7 / Step 8 | 每个迁移或 query surface 必须可回指接口和处理流 |

### 20.2 状态主语总表

| 状态主语 | 主归属批次 | 主要状态 / surface | truth / marker / surface 分类 | 后续承接 |
|---|---|---|---|---|
| `IdentityAnchorState` | 9-A | `Established`, `RetiredHeld`, `TombstoneHeld` | core truth state | Step 10 ref reuse / tombstone;`03` state matrix |
| `GlobalLifecycleState` | 9-B | `Available`, `Paused`, `Retired`, `Tombstoned` | core truth state | Step 10 high-risk / terminal;`03` lifecycle state |
| `RoleCapabilitySummary.summary_state` | 9-C | `Draft`, `Active`, `Stale`, `Unavailable`, `Superseded` | summary truth / marker | Step 10 stale / source unavailable;`03` role summary |
| `RoleCapabilitySourceSnapshot.source_state` | 9-C | `SourceResolved`, `SourceStale`, `SourceUnavailable`, `SourceUnrecognized`, `SourceSuperseded` | source snapshot marker | Step 10 external source boundary;`03` resolver |
| `CareerRecord.record_state` | 9-D | `Appended`, `CorrectionAppended`, `DuplicateIgnored`, `SupersededByCorrection`, `RejectedAppend` | append-only truth / surface | Step 10 duplicate / correction;`03` append state |
| `MemoryReferenceState` | 9-E | `Linked`, `Stale`, `Unavailable`, `PendingArchive`, `Archived`, `ArchiveFailed`, `Unlinked` | relation truth / marker | Step 10 memory unavailable / archive failed;`03` memory refs |
| `IdentityTraceRecord` read state | 9-F | `Appended`, read-time `Redacted`, `SupersededByCorrection` | trace material / read surface | Step 10 trace missing / redaction;`03` trace contracts |
| query visible surface | 9-F | found / not_found / not_visible / stale / degraded / empty | query surface | Step 10 query boundary;`03` query response |
| `ProjectionState` | 9-G | `Fresh`, `Stale`, `RebuildPending`, `Rebuilt`, `Degraded`, `RebuildFailed` | derived marker | Step 10 projection degraded;`03` projection |
| `ReferenceResolutionState` | 9-G | `Resolved`, `Stale`, `Unavailable`, `Unrecognized`, `PendingReconciliation`, `RefreshFailed` | reference marker | Step 10 source unavailable;`03` resolver |
| `ReconciliationReport.report_state` | 9-G | `Generated`, `NoFinding`, `FindingDetected`, `Partial`, `Failed` | report-only marker | Step 10 drift / failed report;`03` report |
| `OutboxState` | 9-H | `PendingPublish`, `Published`, `RetryableFailed`, `Failed`, `SkippedByPolicy` | propagation marker | Step 10 publish failed;`03/04` outbox |
| `HandoffState` | 9-H | `PendingHandoff`, `Delivered`, `RetryableFailed`, `Failed`, `Cancelled` | handoff marker | Step 10 handoff failed / fake delivered;`03/04` handoff |

审计结论:未新增 Step 6 / Step 8 之外的状态主语。query surface、read-time redaction、duplicate no-op、rejected marker 等均已标注为 surface 或 marker,未被误写成 core truth。

### 20.3 同名状态语义审计

| 同名 / 近似状态 | 出现位置 | 审计结论 |
|---|---|---|
| `Stale` | role summary、source snapshot、memory ref、projection、reference resolution、query surface | 均表示“来源 / 派生 / 关系已过期或需刷新”,但归属不同;不得跨对象复用迁移函数 |
| `Unavailable` | role source、memory reference、reference resolution | 均是外部来源或引用不可用 marker;不得用默认值补造 accepted truth |
| `Failed` | archive handoff、projection rebuild、reference refresh、reconciliation、outbox publish、handoff delivery | 均必须显式暴露 issue marker;失败不回滚已 accepted truth |
| `RetryableFailed` | outbox、handoff | 只适用于传播 / 交接恢复;不得用于业务 truth 状态 |
| `Pending*` | `PendingArchive`, `PendingReconciliation`, `PendingPublish`, `PendingHandoff`, `RebuildPending`, `PendingBasis` surface | pending 含义由状态主语限定;不得把 pending query surface 当作已 accepted truth |
| `Archived` / `Delivered` | memory archive relation、trace handoff | `Archived` 属于 memory reference relation,`Delivered` 属于 trace handoff receipt;二者不得混用 |
| `Published` | outbox | 只表达本仓 outbound boundary 成功;不代表 downstream business consumed |
| `Tombstoned` / `TombstoneHeld` | lifecycle、anchor | lifecycle tombstone 与 anchor ref hold 必须一致,但主语不同;事务顺序后移 `03` |

### 20.4 触发覆盖审计

| 触发类别 | 覆盖状态主语 | 是否闭合 | 说明 |
|---|---|---|---|
| Command accepted | `IdentityAnchorState`, `GlobalLifecycleState`, `RoleCapabilitySummary`, `CareerRecord`, `MemoryReferenceState`, `TraceHandoffIntent` / `HandoffState` | 通过 | 所有业务写入口均回指 Step 7 Command 和 Step 8 flow |
| Query | anchor / lifecycle / role / career / memory / summary / trace / audit / projection / reference / report / outbox / handoff surface | 通过 | 全部 no-write;只返回 found / not_found / not_visible / stale / degraded / failed 等 surface |
| Inbound Event Consumer | role source snapshot、career record、memory reference、archive result、handoff result | 通过 | 只消费外部已成立事实或 callback marker;不得保存正文 |
| Operations Job | projection、reference resolution、reconciliation report、outbox、handoff retry | 通过 | job 只写派生 marker / report / propagation marker,不改业务 truth |
| Outbound Event material | accepted identity fact outbox | 通过 | event material 只来自 accepted fact,发布状态在 `OutboxState` |
| Maintenance / reconciliation | projection / reference / report | 通过 | report-only,不得修复相邻仓 truth |

### 20.5 禁止迁移总审计

| 禁止类别 | 覆盖批次 | 统一结论 |
|---|---|---|
| Query 写 truth | 9-A~9-H | 所有 Query 均 no-write,不得 create、repair、refresh、publish、deliver、retry |
| Job 写业务 truth | 9-G~9-H | rebuild / refresh / reconciliation / publish / handoff / retry 不得改写 `GlobalMember`、lifecycle、role、career、memory truth |
| 外部正文入仓 | 9-C~9-H | role body、method body、work body、memory body、archive package、receipt body、runtime body、raw log、secret 均禁止 |
| ref 复用 / 释放 | 9-A~9-B | `GlobalMemberRef` established / retired / tombstoned 后不得释放或复用 |
| 终态恢复 | 9-A~9-B | `TombstoneHeld`、`Tombstoned`、`Retired` 等终态 / 保留态不得回到普通主线 |
| append-only 破坏 | 9-D | career correction 必须追加,不得原地修改或删除旧记录 |
| stale / unavailable 伪成功 | 9-C~9-G | stale、unavailable、unrecognized、degraded、failed、partial 不得伪装为 active / resolved / fresh / clean |
| finding 自动修复 | 9-G | reconciliation finding 只 report-only,不得自动 remediation |
| publish / handoff 伪成功 | 9-H | `Published` 需 publisher success marker;`Delivered` 需正式 receipt marker |
| downstream 状态反写 | 9-H | 下游消费、archive、observability、runtime 状态不得反写 identity truth |

### 20.6 状态传播总图

```text
EstablishGlobalMember accepted
    ├─> IdentityAnchorState::Established
    ├─> GlobalLifecycleState::Available
    ├─> IdentityTraceRecord::Appended
    ├─> IdentityOutboxRecord + OutboxState::PendingPublish
    └─> ProjectionState::Stale

Business truth accepted change
    ├─> corresponding core truth state
    ├─> IdentityTraceRecord::Appended
    ├─> IdentityOutboxRecord + OutboxState::PendingPublish
    └─> ProjectionState::Stale

External source / callback accepted
    ├─> role source / career / memory / handoff marker
    ├─> IdentityTraceRecord::Appended when accepted
    ├─> optional IdentityOutboxRecord pending material
    └─> ReferenceResolutionState marker when only reference state changes

Maintenance job
    ├─> ProjectionState
    ├─> ReferenceResolutionState
    └─> ReconciliationReport

Propagation / handoff job or callback
    ├─> OutboxState
    └─> HandoffState
```

传播边界:

- core truth -> trace / outbox / projection stale 可以单向传播。
- projection / report / outbox / handoff 不反向决定 core truth。
- external source marker 只有通过正式 Command / Consumer flow 才能形成 accepted truth。
- query surface 不进入传播图,只读取当前 truth / marker。

### 20.7 详细设计承接清单

| 承接项 | 后续设计位置 | 当前 Step 9 结论 |
|---|---|---|
| 状态 enum / newtype 具体命名 | `03` object contracts / state matrix | 以本 Step 状态主语和状态语义为准,可在 `03` 固化命名 |
| 状态迁移 precondition / side effect | `03` state matrix / function flows | 本 Step 给方向和禁止迁移,`03` 补参数、repo、transaction、error |
| trace / outbox / projection stale 同事务顺序 | `03` persistence / transaction | 本 Step 只说明传播影响,不定义事务顺序 |
| query response marker schema | `03` protocol contracts | found / not_found / not_visible / stale / degraded / failed 等 surface 需闭合 DTO |
| visibility / redaction 字段级规则 | `03` query / view contracts | 本 Step 只固定 no leak 和 not-visible surface |
| external resolver / safe summary / evidence port | `03` ports | 本 Step 只保留 refs / marker 和状态语义 |
| projection rebuild source ordering | `03` persistence / job design | 本 Step 固定 rebuild 不改 truth |
| reconciliation finding taxonomy | Step 10 / `03` | 本 Step 固定 finding report-only |
| outbox envelope / topic / payload version | `03/04` | 本 Step 固定 pending / published / failed state 和 forbidden body |
| handoff target / receipt / adapter schema | `03/04` | 本 Step 固定 delivered 必须来自 receipt marker |
| retry policy / batch / cursor | `03/04/07` | 本 Step 固定 retry 不绕过 policy |
| Step 10 异常边界 | Step 10 | 本 Step 输出异常触发清单和 forbidden transitions |

### 20.8 Step 10 异常边界输入清单

| 异常 / 边界场景 | 来源批次 | Step 10 需要展开 |
|---|---|---|
| query missing / not visible 不创建 truth | 9-A~9-H | not_found、not_visible、hidden、redacted 的统一 surface |
| high-risk lifecycle 缺 basis | 9-B | pending basis / rejected surface,不得先写 truth |
| external source stale / unavailable / unrecognized | 9-C / 9-E / 9-G | source unavailable、resolver failed、safe summary missing |
| duplicate career append / duplicate command result | 9-D | duplicate no-op、stored result 和 append-only 不冲突 |
| memory archive failed / unavailable | 9-E | archive failure、retry、report-only 和 handoff 边界 |
| trace / audit missing or redacted | 9-F | trace read degraded、visibility denied、forbidden body |
| projection rebuild failed / degraded | 9-G | rebuild failed、stale projection、query degraded |
| reference refresh failed | 9-G | refresh failed、unavailable、unrecognized |
| reconciliation finding / partial / failed | 9-G | report-only finding、partial result、failed report |
| outbox publish failed / skipped | 9-H | retryable failed、failed、skipped by policy |
| handoff fake delivered / receipt missing | 9-H | pending / delivered / failed / cancelled,receipt marker required |
| forbidden body in event / handoff / report / query | 9-C~9-H | body-free enforcement 和 rejection / redaction |

### 20.9 正式 `02` §9 回填草稿

正式 `02-概要设计.md` §9 后续可汇总为:

1. `IdentityAnchorState` 表达 `GlobalMemberRef` 的锚定与不可复用持有。`Established` 只能由 `EstablishGlobalMember` accepted 创建;`RetiredHeld` / `TombstoneHeld` 用于生命周期终态后的 ref hold。query、projection、maintenance 和外部 event 不得创建成员或释放 ref。
2. `GlobalLifecycleState` 表达成员平台级生命周期,包含 `Available`、`Paused`、`Retired`、`Tombstoned`。生命周期变化必须来自显式 command,高风险迁移必须先通过 basis guard;runtime、ProjectMember、governance event、query 和 job 不得直接推进 lifecycle truth。
3. `RoleCapabilitySummary` 与 `RoleCapabilitySourceSnapshot` 表达角色能力摘要和来源状态。`Active` 只能来自 body-free safe summary;`Stale`、`Unavailable`、`Unrecognized`、`Superseded` 必须显式暴露,不得保存 role / capability definition body。
4. `CareerRecord.record_state` 是 append-only 状态。`Appended` 和 `CorrectionAppended` 通过追加记录形成;duplicate 只能 no-op 或返回 stored result;不得原地修改、覆盖或删除 career record,不得保存 work / ProjectMember body。
5. `MemoryReferenceState` 表达 memory / archive 引用关系,包含 `Linked`、`Stale`、`Unavailable`、`PendingArchive`、`Archived`、`ArchiveFailed`、`Unlinked`。它只保存 refs / marker,不保存 memory body、embedding、archive package 或 receipt body。
6. 身份事实消费与追溯不新增业务 truth 状态。`IdentityTraceRecord` 是 append-only trace material;summary、trace、audit query 只返回 found / not_found / not_visible / stale / degraded / redacted 等 surface,不修复 truth。
7. `ProjectionState`、`ReferenceResolutionState` 和 `ReconciliationReport.report_state` 承接派生维护与对账。Projection rebuild、reference refresh 和 reconciliation 只能写派生状态、marker 或 report;finding 是 report-only,不得自动 remediation。
8. `OutboxState` 与 `HandoffState` 承接 accepted fact propagation 和 trace / audit / archive handoff。`Published` 只表示 outbound boundary 成功,不代表下游业务已处理;`Delivered` 必须来自正式 receipt marker;publish / handoff 失败不回滚 accepted truth。
9. 所有 Query 均 no-write;所有 Operations Job 均不得绕过 command 写业务 truth;所有 event、query、report、handoff material 均不得携带外部正文、secret、runtime body、memory body、artifact body、archive package、receipt body 或 raw log。
10. 状态迁移的详细 precondition、repository / port、transaction ordering、DTO surface、错误码、topic / envelope / receipt / retry schema 后移 `03/04/07`;本 Step 只给状态主语、迁移方向、禁止方向和传播影响。

正式正文要等 Step 14 统一装配,当前不直接回填到 `02-概要设计.md`。

### 20.10 本 Step 待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可 Step 9 不新增 Step 6 / Step 8 之外的状态主语 | 若不认可,需回退 Step 6 / Step 8 补对象或处理流来源 | 当前审计为通过 |
| 是否认可 query surface 不等同持久 truth state | 若不认可,query DTO 和 state matrix 会混淆 | 当前 query surface 全部标为 no-write |
| 是否认可 derived / propagation marker 不反写 core truth | 若不认可,projection、report、outbox、handoff 会变成第二 truth | 当前坚持单向传播 |
| 是否认可 forbidden body 作为跨状态硬约束 | 若不认可,后续 `03/04` 需要重做 payload / query / report / handoff 边界 | 当前保持 0 容忍 |
| 是否认可 Step 10 从本节异常输入清单展开 | 若不认可,需补充遗漏的异常场景 | 当前以 §20.8 作为 Step 10 输入 |

### 20.11 进入 Step 10 的条件

进入 Step 10 “异常与边界场景轮廓”前,需要用户确认:

- 9-A~9-H 的状态主语、状态集合、允许迁移、禁止迁移和传播影响均可接受。
- 9-I 的同名状态审计、触发覆盖审计、禁止迁移总审计和详细设计承接清单没有遗漏关键状态线。
- 正式 `02` §9 回填草稿可以作为 Step 14 装配输入。
- Step 10 可以基于 §20.8 的异常边界输入清单继续展开,且仍不提前创建或改写未来 Step 文件。
