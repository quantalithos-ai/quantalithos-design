# Step 9. 状态机与状态流转

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 9
- 回填章节：`projects/L3-method-library/02-概要设计.md` §9 状态定义与状态流转

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 6 关键对象 | MethodContentLifecycle、OutboxEvent、MethodPlugin(P1)、MethodConfiguration(P1) 已列出状态集合 |
| Step 7 接口骨架 | Create / Update / Submit / Publish / Deprecate / Retire / Supersede、PublishPlugin(P1)、ActivateConfiguration(P1) |
| Step 8 处理流 | P0 Command、关键 Query、可选 Inbound Event、Operations Job 处理流已收稳 |
| 需求业务规则 | BR-LC-001~006、BR-PUB、BR-P1-001~003 |
| 当前 02 状态线索 | lifecycle 分散在对象、接口、流程和数据所有权章节中 |

已确认结论：

```text
本仓存在正式状态机,核心是 MethodContentLifecycle。
OutboxEvent 有可靠发布状态,但不是业务生命周期。
P1 MethodPlugin / MethodConfiguration 有独立后置状态机,本轮只保留概要边界。
```

依赖的前序 Step：

```text
Step 1~8 已确认上游边界、范围、约束、代码主体、主要组成部分、对象、接口和处理流。
```

---

## 3. SOP 问题回答

### 3.1 本仓有哪些影响主线成立的正式状态？

回答：

| 状态机 | 状态 |
|---|---|
| MethodContentLifecycle | draft、in_review、published、deprecated、retired、superseded |
| OutboxEventStatus | pending、published、failed、dead_letter |
| MethodPluginLifecycle(P1) | draft、published、deprecated、retired |
| MethodConfigurationLifecycle(P1) | draft、active、superseded、retired |

MethodContentLifecycle 是 P0 主状态机。OutboxEventStatus 是可靠传播状态机。P1 状态机只保留后置边界。

### 3.2 每个状态的含义是什么，是否可以进入正常主线？

回答：

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| draft | 方法定义草稿,允许编辑 | 是 | 可被提交审核 |
| in_review | 已提交审核,等待 gate | 是 | 不能直接被下游作为正式定义消费 |
| published | 已发布权威定义 | 是 | 下游可消费,event / snapshot 可传播 |
| deprecated | 已废弃但保留历史引用 | 受限 | 新引用应优先使用替代版本 |
| retired | 已退役 | 受限 | 拒绝新建引用,保留历史追溯 |
| superseded | 被新版本替代 | 受限 | 不作为新引用目标,保留版本链 |
| pending(outbox) | 待发布事件 | 不适用 | 传播状态,不是业务定义状态 |
| published(outbox) | 事件已发布 | 不适用 | 表示已交给 L0-bus |
| failed(outbox) | 事件发布失败 | 不适用 | 可重试 |
| dead_letter(outbox) | 多次失败后等待人工处理 | 不适用 | 不改变 MethodContent 真相 |
| active(P1 configuration) | 配置已激活 | P1 | 只影响 P1 方法集组装 |

### 3.3 哪些接口、事件或动作会触发状态迁移？

回答：

| 触发动作 | 状态迁移 |
|---|---|
| CreateMethodContentDraft | none -> draft |
| UpdateMethodContentDraft | draft -> draft |
| SubmitMethodContentForReview | draft -> in_review |
| PublishMethodContent | in_review -> published |
| DeprecateMethodContent | published -> deprecated |
| RetireMethodContent | published / deprecated -> retired |
| SupersedeMethodContent | old published / deprecated -> superseded;new draft / in_review -> published |
| OutboxRelayWorker publish success | pending / failed -> published(outbox) |
| OutboxRelayWorker publish failure | pending -> failed |
| Outbox retry exhausted | failed -> dead_letter |
| PublishMethodPlugin(P1) | MethodPlugin draft -> published |
| ActivateMethodConfiguration(P1) | MethodConfiguration draft -> active |

### 3.4 哪些迁移明确允许，哪些迁移明确禁止？

回答：

允许的核心迁移：

```text
none -> draft
draft -> draft
draft -> in_review
in_review -> published
published -> deprecated
published -> retired
deprecated -> retired
published -> superseded
deprecated -> superseded
pending(outbox) -> published(outbox)
pending(outbox) -> failed(outbox)
failed(outbox) -> published(outbox)
failed(outbox) -> dead_letter(outbox)
```

禁止的核心迁移：

```text
none -> published
draft -> published
in_review -> retired
published -> draft
published -> in_review
deprecated -> draft
retired -> draft
retired -> published
superseded -> published
dead_letter(outbox) -> published(outbox) without operator recovery
```

### 3.5 状态变化如何影响 outbox、projection、下游感知或只读供给？

回答：

| 状态变化 | outbox | projection / snapshot | 下游感知 |
|---|---|---|---|
| draft -> in_review | 不发下游事件 | 可更新管理端草稿视图 | 下游运行态不可消费 |
| in_review -> published | 写 published event | 更新 read model / snapshot | 下游可通过 event + snapshot 同步 |
| published -> deprecated | 写 deprecated / content changed event | 更新 read model / trace | 下游新引用应避免 |
| published / deprecated -> retired | 写 retired event | 更新 read model / snapshot | 下游拒绝新引用 |
| published / deprecated -> superseded | 写 published / fingerprint_changed / supersede 相关 event | 更新版本链和 trace | 下游可感知替代版本 |
| outbox pending -> published | 更新 outbox 状态 | 可更新 trace / relay metric | 下游已收到或可收到事件 |
| outbox failed / dead_letter | 保留 backlog / dead letter | trace 可见传播异常 | 下游可能滞后,通过 replay / snapshot 恢复 |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §6.8 / §11 / §12 | lifecycle 状态散落在对象、接口、处理流中 | 详细设计容易重复定义状态机 |
| §12 处理流 | 描述了状态变化,但没有单独列允许 / 禁止迁移 | 无法约束非法状态转换 |
| §11 Outbound Event | 事件和 lifecycle 的关系存在,但未明确传播关系 | 下游感知和 projection 更新边界不清 |
| P1 相关章节 | MethodPlugin / MethodConfiguration 状态存在,但和 P0 生命周期混放 | 容易让 P1 状态污染 P0 主链 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 状态定义 | 分散在对象和流程中 | 单独状态定义表 | 防止详细设计重新发明状态集合 |
| 状态迁移 | 只在处理流中隐含 | 独立状态流转图和允许 / 禁止迁移清单 | 明确非法转换 |
| 传播关系 | event / snapshot 分散说明 | 单独状态传播关系图 | 明确状态变化如何影响 outbox、projection、下游 |
| P1 状态 | 与 P0 混在说明中 | 单独 P1 状态机概要保留 | P1 不阻塞 P0 |
| Outbox 状态 | 只在同步语义中出现 | 明确为可靠传播状态机 | 避免把传播失败误读成定义状态失败 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只写 MethodContent 状态机 | 简洁 | 忽略 outbox 可靠传播状态,无法解释 replay / dead letter | 不采用 |
| 把 P0、outbox、P1 状态全部画成一个大状态机 | 信息完整 | 不同语义混在一起,容易误解 | 不采用 |
| MethodContent 主状态机 + Outbox 传播状态 + P1 后置状态分开表达 | 边界清楚,能支撑详细设计 | 文档稍长 | 采用 |

---

## 7. 结构化中间产物

### 7.1 MethodContent 状态定义表

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| draft | 草稿定义,允许编辑 | 是 | Create / Update 只在此状态改正文 |
| in_review | 已提交审核,等待 gate | 是 | Publish 必须从该状态或受控等价状态进入 |
| published | 已发布权威定义 | 是 | 可被下游通过 event / snapshot 消费 |
| deprecated | 已废弃 | 受限 | 保留历史引用,新引用应避免 |
| retired | 已退役 | 受限 | 拒绝新建引用,保留历史追溯 |
| superseded | 已被新版本替代 | 受限 | 不作为新引用目标,保留版本链 |

### 7.2 MethodContent 状态流转图

```text
none
  |
  | CreateMethodContentDraft
  v
draft
  |
  | SubmitMethodContentForReview
  v
in_review
  |
  | PublishMethodContent
  v
published
  |\
  | \ DeprecateMethodContent
  |  v
  |  deprecated
  |     |\
  |     | \ RetireMethodContent
  |     |  v
  |     |  retired
  |     |
  |     | SupersedeMethodContent
  |     v
  |  superseded
  |
  | RetireMethodContent
  v
retired

published
  |
  | SupersedeMethodContent
  v
superseded
```

关键说明：

- `draft -> published` 不允许绕过 review / gate。
- `published` 核心字段不允许原地修改,必须通过新版本 + supersede。
- `retired` 和 `superseded` 都保留历史追溯,不物理删除。
- 图中不表达错误码、数据库列或补偿脚本。

### 7.3 MethodContent 允许 / 禁止迁移

允许的核心迁移：

- `none -> draft`
- `draft -> draft`
- `draft -> in_review`
- `in_review -> published`
- `published -> deprecated`
- `published -> retired`
- `deprecated -> retired`
- `published -> superseded`
- `deprecated -> superseded`

禁止的核心迁移：

- `none -> published`
- `draft -> published`
- `in_review -> retired`
- `published -> draft`
- `published -> in_review`
- `deprecated -> draft`
- `retired -> draft`
- `retired -> published`
- `superseded -> published`

### 7.4 OutboxEvent 状态定义表

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| pending | 事件已写入 outbox,等待 relay | 不适用 | MethodContent 真相已提交 |
| published | 事件已发布到 L0-bus | 不适用 | 下游可消费 |
| failed | 发布失败,等待重试 | 不适用 | 不回滚 MethodContent 真相 |
| dead_letter | 多次失败后进入人工处理 | 不适用 | 需要运维恢复或 replay |

### 7.5 OutboxEvent 状态流转图

```text
pending
  |
  | relay success
  v
published

pending
  |
  | relay failure
  v
failed
  |\
  | \ retry success
  |  v
  |  published
  |
  | retry exhausted
  v
dead_letter
```

关键说明：

- OutboxEvent 状态是传播状态,不是 MethodContent 生命周期。
- `failed` 或 `dead_letter` 不代表定义发布失败。
- replay / resync 可以帮助下游恢复,具体 retry 策略留详细设计。

### 7.6 状态传播关系图

```text
MethodContent lifecycle change
  |
  | publish / retire / supersede
  v
AuditRecord
  - actor_ref
  - reason
  - version / fingerprint
  |
  v
OutboxEvent pending
  |
  | outbox relay
  v
L0-bus event
  |
  v
Downstream consumers
  - identity / process / capability-hub
  - artifact / governance / UI
  |
  | snapshot query if needed
  v
DefinitionSnapshot

MethodContent lifecycle change
  |
  v
ReadModel / TraceProjection / ViewProfileProjection
```

关键说明：

- 状态变化先成为本仓已提交事实,再通过 outbox 传播。
- projection / snapshot 是只读供给,不是第二定义真相。
- 下游感知延迟不回滚 MethodContent 状态。
- 图中不表达具体 topic、字段全集或重试参数。

### 7.7 P1 状态机概要

#### MethodPlugin(P1)

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| draft | 资产包草稿 | P1 | 不阻塞 P0 |
| published | 资产包已发布 | P1 | marketplace 可消费 package metadata |
| deprecated | 资产包已废弃 | P1 | 新安装应避免 |
| retired | 资产包已退役 | P1 | 保留历史追溯 |

允许迁移：

- `draft -> published`
- `published -> deprecated`
- `published -> retired`
- `deprecated -> retired`

#### MethodConfiguration(P1)

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| draft | 配置草稿 | P1 | 可编辑组合 |
| active | 已激活配置 | P1 | effective_content_set 生效 |
| superseded | 被新配置替代 | P1 | 保留历史 |
| retired | 已退役配置 | P1 | 不再作为当前配置 |

允许迁移：

- `draft -> active`
- `active -> superseded`
- `active -> retired`
- `superseded -> retired`

P1 状态机本轮不继续展开完整处理流和非法迁移清单,留给 P1 详细设计。

---

## 8. 回填草稿

以下内容可回填到新版 `02-概要设计.md` §9。

```md
## 9. 状态定义与状态流转

### 9.1 MethodContent 状态定义表

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| draft | 草稿定义,允许编辑 | 是 | Create / Update 只在此状态改正文 |
| in_review | 已提交审核,等待 gate | 是 | Publish 必须从该状态或受控等价状态进入 |
| published | 已发布权威定义 | 是 | 可被下游通过 event / snapshot 消费 |
| deprecated | 已废弃 | 受限 | 保留历史引用,新引用应避免 |
| retired | 已退役 | 受限 | 拒绝新建引用,保留历史追溯 |
| superseded | 已被新版本替代 | 受限 | 不作为新引用目标,保留版本链 |

### 9.2 MethodContent 状态流转图

```text
none
  |
  | CreateMethodContentDraft
  v
draft
  |
  | SubmitMethodContentForReview
  v
in_review
  |
  | PublishMethodContent
  v
published
  |\
  | \ DeprecateMethodContent
  |  v
  |  deprecated
  |     |\
  |     | \ RetireMethodContent
  |     |  v
  |     |  retired
  |     |
  |     | SupersedeMethodContent
  |     v
  |  superseded
  |
  | RetireMethodContent
  v
retired

published
  |
  | SupersedeMethodContent
  v
superseded
```

### 9.3 状态传播关系

```text
MethodContent lifecycle change
  |
  v
AuditRecord
  |
  v
OutboxEvent pending
  |
  v
L0-bus event
  |
  v
Downstream consumers
  |
  v
DefinitionSnapshot

MethodContent lifecycle change
  |
  v
ReadModel / TraceProjection / ViewProfileProjection
```

```

---

## 9. 待确认事项

| 问题 | 当前建议 | 是否阻塞 Step 9 |
|---|---|---|
| 是否同意 MethodContentLifecycle 是 P0 主状态机 | 建议同意 | 阻塞 |
| 是否同意 OutboxEvent 状态单独表达为传播状态机 | 建议同意,避免和业务状态混淆 | 阻塞 |
| 是否同意 P1 MethodPlugin / MethodConfiguration 只保留概要状态 | 建议同意,P1 后置 | 不阻塞 |
| 是否同意状态变化传播到 outbox、projection、snapshot、下游感知,但不回滚 MethodContent 真相 | 建议同意 | 阻塞 |

---

## 10. 进入下一步条件

进入 Step 10 前需要确认：

- [x] 是否同意本步的状态机拆分方式
- [x] 是否同意 MethodContent 的状态定义、允许迁移和禁止迁移
- [x] 是否同意 OutboxEvent 只表达可靠传播状态
- [x] 是否同意 Step 10 再处理异常与边界场景,本步不展开错误码和补偿实现
