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

---

## R1 全量重审追加区

> 本区从 2026-06-20 起按当前 Step 5 / Step 6 / Step 7 / Step 8 结论重启 Step 9。上方既有 `MethodContentLifecycle`、`OutboxEventStatus`、P1 plugin/configuration 状态内容全部降级为 historical material,只能用于后置差异审计,不得作为本轮状态定义第一来源。

### R1.1 开工与必读文档:先思考

#### R1.1.1 当前恢复点判断

当前允许进入 Step 9 的依据:

| 来源 | 当前结论 | 对 Step 9 的影响 |
|---|---|---|
| `02_hld_calibration_flow.md` | Step 8 已由 `R1.33` 记录正式 §8 回填。 | Step 9 可以开工,但必须先做必读和框架思考。 |
| `project_execution_ledger.md` | 当前恢复点为 Step 9 `开工与必读文档:先思考`。 | 不得直接写状态定义表或状态流转图。 |
| 正式 `02-概要设计.md` §8 | 已改为当前八个组成部分处理流和状态来源提示。 | Step 9 的状态来源必须从当前 §8 推导。 |
| 本文件旧内容 | 仍是旧 `MethodContentLifecycle` / `OutboxEventStatus` 主线。 | 只作污染检查和差异审计,不得继承。 |

#### R1.1.2 旧 Step 9 初步诊断

旧 Step 9 不符合本轮输入基线:

| 旧主线 | 当前问题 | 本轮处理 |
|---|---|---|
| `MethodContentLifecycle` | 当前 Step 5 / Step 6 / Step 7 / Step 8 已不再以 `MethodContent` 作为核心状态 owner。 | 不继承;后续只在旧材料差异审计中记录。 |
| `OutboxEventStatus` | 当前概要 §8 只定义 event candidate,不定义 outbox delivery / relay / retry 状态。 | 不作为概要状态主线;如需投递状态,后续 03 / 04 重新闭口。 |
| `DefinitionSnapshot` / fingerprint drift | 当前正式 §8 已排除 snapshot / fingerprint 主线。 | 不继承;freshness / drift 只能从 read material、external summary、maintenance progress 重新推导。 |
| P1 plugin / configuration lifecycle | 当前外围包与方法集组织是 peripheral organization,不是旧 P1 plugin/configuration 主线。 | 不继承;如需外围组织状态,从 package / method set / composition 对象重推。 |
| worker queue / retry 状态 | 当前 §8 明确 worker / scheduler / retry 留给后续设计。 | 不进入概要 Step 9 状态机。 |

#### R1.1.3 Step 9 必读文档候选

本轮 Step 9 开工必须读取以下文档,并在下一批写入状态:

| 类别 | 文档 | 用途 | 下一批状态 |
|---|---|---|---|
| 项目台账 | `design-calibration/project_execution_ledger.md` | 确认恢复点和不得跳步。 | 写入 read。 |
| Flow | `design-calibration/02_hld_calibration_flow.md` | 确认 Step 8 completed / Step 9 opening。 | 写入 read。 |
| SOP | `standards/document/概要设计讨论流程_SOP.md` Step 9 | 状态定义表、状态流转图、允许 / 禁止迁移、传播关系和停审要求。 | 写入 read。 |
| 书写规范 | `standards/document/概要设计书写规范.md` §4.9 / §9 | 正式 §9 回填格式、ASCII 图约束和禁止下沉内容。 | 写入 read。 |
| 中间产物规范 | `standards/document/设计文档讨论中间产物规范.md` | 先思考后写入、状态主语筛选、台账和门禁要求。 | 写入 read。 |
| 当前正式文档 | `projects/L3-method-library/02-概要设计.md` §5~§8 / §9 | §5~§8 是当前输入;§9 是旧材料污染审计对象。 | 写入 read。 |
| Step 5 | `02_hld_step_05_components_boundary.md` | 八个主要组成部分和职责边界。 | 写入 read。 |
| Step 6 | `02_hld_step_06_key_objects.md` | 状态 owner、对象能力、material / view / task / history / lineage / boundary 来源。 | 写入 read。 |
| Step 7 | `02_hld_step_07_api_interface_skeleton.md` `R1.45` | 状态触发接口来源,尤其 Command / Inbound / Operations Job。 | 写入 read。 |
| Step 8 | `02_hld_step_08_processing_flows.md` `R1.30`~`R1.33` | 状态触发处理流、传播边界和 Step 9 状态来源提示。 | 写入 read。 |
| 参考框架 | `projects/L1-governance/design-calibration/02_hld_step_09_state_machine.md` | 只参考状态组、定义表、迁移图、传播图、审计收尾方式。 | 写入 read。 |

#### R1.1.4 本轮 Step 9 应回答的问题

按 SOP 和本仓当前状态,本轮 Step 9 至少回答:

1. 本仓是否存在独立正式状态机,还是存在多组对象状态 / material freshness / maintenance progress。
2. 哪些状态影响核心主线成立,哪些只是 read material、event candidate、maintenance progress 或 peripheral availability。
3. 每个状态属于哪个主要组成部分和哪个 Step 6 对象。
4. 哪些 Command / Inbound / Operations Job 会触发状态变化;Query 是否保持 no-write。
5. 哪些状态变化会传播到 event candidate、read material、trace / audit、maintenance progress 或下游感知。
6. 哪些旧状态主线必须禁止回流。
7. 是否需要按八个主要组成部分逐个先思考、再写入并停审。

#### R1.1.5 状态 owner 初筛框架

下一批只搭框架,不写最终状态定义。建议先按以下状态来源池筛选:

| 来源组 | 候选 owner 类型 | 初步判断 |
|---|---|---|
| 方法资产定义与目录 | definition truth、catalog entry、catalog view freshness。 | 可能存在 definition / catalog lifecycle 与 stale view 状态。 |
| 正式化与版本 | formalization state、formal method asset version、version history。 | 可能是核心状态组。 |
| 受控消费 | consumption boundary、consumption material、availability。 | 可能存在 acceptance / availability 状态。 |
| 追溯与一致性保护 | trace material、impact summary、protection decision、audit/evidence lineage。 | 可能存在 material freshness、decision disposition、lineage completeness 状态。 |
| 关系与分发语义 | relation lifecycle、integrity result、distribution availability。 | 可能存在 relation / integrity / distribution 状态。 |
| 外部摘要与引用 | external summary、artifact ref、body boundary、external intake。 | 可能存在 resolution / boundary / intake disposition 状态。 |
| 后台维护与收敛 | maintenance request、refresh task/run、recovery convergence、progress。 | 必然存在 maintenance / progress 状态,但不得修 core truth。 |
| 外围包与方法集组织 | package、method set、composition evaluation、peripheral view。 | 可能存在 peripheral organization / availability 状态,不得阻塞核心闭环。 |

#### R1.1.6 Step 内执行框架候选

本轮 Step 9 不应一次性写全仓状态总表。建议按以下模块推进:

| 序号 | 模块 | 目标 |
|---:|---|---|
| 1 | 开工与必读文档 | 确认输入基线、旧材料边界和 Step 内框架。 |
| 2 | 状态 owner 候选池 | 从 Step 6 对象和 Step 8 状态来源筛选状态 owner。 |
| 3 | L1-governance 框架对齐 | 只借状态组 / 迁移 / 传播 / 审计结构。 |
| 4~11 | 八个主要组成部分状态小循环 | 每个组成部分先思考、再写入,完成状态集合、触发来源、允许 / 禁止迁移和停审。 |
| 12 | 跨状态一致性审计 | 审计同名 / 近义状态、触发覆盖、传播边界和旧材料污染。 |
| 13 | 旧材料差异审计 | 专门审计旧正式 §9 和本文件旧内容。 |
| 14 | 正式 §9 回填草稿 | 形成可回填草稿,不直接改正式文档。 |
| 15 | 自检与停审 | 判断 Step 9 是否完成、是否可正式回填、是否可进入 Step 10。 |

#### R1.1.7 下一写入批次边界

下一批 `R1.2 开工与必读文档:再写入` 只允许写:

1. 必读文档表和读取状态。
2. 当前输入基线确认。
3. 旧 Step 9 降级声明。
4. 本轮 Step 9 模块执行计划。
5. 下一模块停审记录和 `next_allowed_action`。

不得写状态定义表、状态流转图、允许 / 禁止迁移清单、状态传播图或正式 §9 草稿;不得修改正式 `02-概要设计.md`;不得进入 Step 10。

#### R1.1.8 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 本模块只做开工诊断、必读清单和 Step 内框架思考。 |
| 是否直接写状态机正文 | no | 未写正式状态定义表、迁移图或传播图。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否继承旧 Step 9 | no | 已明确旧内容降级为 historical material。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9 开工。 |

next_allowed_action: 等待用户确认后进入 Step 9 `开工与必读文档:再写入`;只写必读文档表、输入基线、旧 Step 9 降级声明、Step 内模块计划和停审记录,不得写状态定义表或状态流转图,不得修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.2 开工与必读文档:再写入

#### R1.2.1 当前有效文件头

| 项 | 当前口径 |
|---|---|
| 当前 Step | Step 9 状态机与状态流转 |
| 当前模式 | full-restart / R1 重审 |
| 第一来源 | 当前 Step 5 / Step 6 / Step 7 / Step 8 结论 |
| 正式文档目标 | `projects/L3-method-library/02-概要设计.md` §9 |
| 当前禁止 | 不写状态定义表、不写状态流转图、不写允许 / 禁止迁移清单、不改正式 §9、不进入 Step 10 |
| 旧材料处理 | 本文件既有 completed 内容、正式 §9 旧正文、历史 DDD 状态矩阵均为 historical material |

#### R1.2.2 必读文档表

| 类别 | 文档 | 读取状态 | 本步用途 |
|---|---|---|---|
| 项目台账 | `design-calibration/project_execution_ledger.md` | read | 确认当前只允许 Step 9 `开工与必读文档:再写入`,不得跳到状态表或 Step 10。 |
| Flow | `design-calibration/02_hld_calibration_flow.md` | read | 确认 Step 8 已正式回填,Step 9 当前为 opening loop。 |
| SOP | `standards/document/概要设计讨论流程_SOP.md` Step 9 | read | 固定状态定义表、状态流转 ASCII 图、迁移清单、传播关系和逐主要组成部分停审要求。 |
| 书写规范 | `standards/document/概要设计书写规范.md` §4.9 / §9 | read | 固定正式 §9 的表格、ASCII 图和禁止下沉边界。 |
| 中间产物规范 | `standards/document/设计文档讨论中间产物规范.md` | read | 固定先思考后写入、状态主语筛选、长文档分批和台账门禁。 |
| 当前正式概要 | `projects/L3-method-library/02-概要设计.md` §5~§8 / §9 | read | §5~§8 是当前输入;§9 是旧状态主线污染对象。 |
| Step 5 | `02_hld_step_05_components_boundary.md` | read | 提供八个主要组成部分、后续 Step 9 承接规则和状态来源红线。 |
| Step 6 | `02_hld_step_06_key_objects.md` | read | 提供状态 owner 候选、对象归属、read material / task / recovery / peripheral 状态来源。 |
| Step 7 | `02_hld_step_07_api_interface_skeleton.md` `R1.45` | read | 提供状态触发接口来源,尤其 Command、Inbound Consumer、Operations Job。 |
| Step 8 | `02_hld_step_08_processing_flows.md` `R1.30`~`R1.33` | read | 提供状态来源提示、处理流触发、事件候选和维护边界。 |
| 参考框架 | `projects/L1-governance/design-calibration/02_hld_step_09_state_machine.md` | read | 只参考状态组、定义表、迁移图、传播图、审计收尾方式,不得复制 governance 语义。 |

#### R1.2.3 输入基线确认

| 输入 | 当前可用结论 | Step 9 使用方式 |
|---|---|---|
| Step 5 八个主要组成部分 | 已完成并回填正式 §5。 | 作为状态 owner 分组和逐组成部分小循环顺序。 |
| Step 6 关键对象 | 已完成并回填正式 §6;`8.45` 已关闭。 | 状态必须回指对象、state owner、view/material、task/recovery、history/lineage 或 peripheral 对象。 |
| Step 7 接口骨架 | 已完成并回填正式 §7;`R1.45` 已记录。 | 状态触发动作必须回指 Command、Inbound 或 Operations Job;Query 不触发持久状态迁移。 |
| Step 8 处理流 | 已完成并回填正式 §8;`R1.33` 已记录。 | 状态来源必须回指处理流、维护流、事件候选来源或 Step 8 状态来源提示。 |
| 正式 §9 | 仍为旧 `MethodContentLifecycle` / `OutboxEventStatus` 主线。 | 仅作差异审计对象,不得作为状态定义来源。 |

#### R1.2.4 旧 Step 9 降级声明

本文件上方既有内容和正式 §9 旧正文全部降级为 historical material。具体裁决如下:

| 旧状态主线 | 本轮裁决 | 说明 |
|---|---|---|
| `MethodContentLifecycle` | 不继承 | 当前状态 owner 必须来自 `MethodAssetDefinition`、`FormalizationState`、availability、acceptance、maintenance、peripheral 等当前对象。 |
| `OutboxEventStatus` | 不作为概要状态主线 | 当前 §8 只定义 event candidate,不定义 outbox delivery / relay / retry / dead letter。 |
| snapshot export state | 不继承 | 当前受控消费、artifact archive、read material 不恢复 `DefinitionSnapshot` 主线。 |
| fingerprint drift state | 不继承 | 当前 freshness / drift 若需要,必须从 read material、external summary 或 maintenance progress 重推。 |
| worker / retry / queue state | 不进入 Step 9 | worker、scheduler、retry、dead letter 属于后续详细设计、配置或实施计划。 |
| P1 plugin / configuration lifecycle | 不继承 | 当前外围组织从 method package、method set、composition 和 peripheral view 重新推导。 |

#### R1.2.5 Step 内模块计划

| 序号 | 模块 | 状态 | 输出 | next_allowed_action |
|---:|---|---|---|---|
| 1 | 开工与必读文档:先思考 | done | `R1.1` 开工诊断、必读候选、旧材料降级、执行框架。 | 进入再写入。 |
| 2 | 开工与必读文档:再写入 | done | `R1.2` 当前文件头、必读表、输入基线、旧材料降级声明、模块计划。 | 进入状态 owner 候选池:先思考。 |
| 3 | 状态 owner 候选池:先思考 / 再写入 | done | `R1.3` / `R1.4` 已完成 owner 筛选规则、候选池、排除口径和后续模块分配,不写迁移图。 | 进入 L1-governance 框架对齐:先思考。 |
| 4 | L1-governance 框架对齐:先思考 / 再写入 | done | `R1.5` / `R1.6` 已完成可复用框架、禁止复制语义、L3 后续整体骨架和单组成部分模板。 | 进入方法资产定义与目录状态:先思考。 |
| 5 | 方法资产定义与目录状态:先思考 / 再写入 | done | `R1.7` / `R1.8` 已完成 definition / catalog / catalog view 状态集合、触发、传播和停审。 | 进入正式化与版本状态:先思考。 |
| 6 | 正式化与版本状态:先思考 / 再写入 | done | `R1.9` / `R1.10` 已完成 formalization / formal version / basis 状态集合、触发、传播和停审。 | 进入受控消费状态:先思考。 |
| 7 | 受控消费状态:先思考 / 再写入 | done | `R1.11` / `R1.12` 已完成 consumption material / availability / boundary / guard 状态集合、触发、传播和停审。 | 进入追溯与一致性保护状态:先思考。 |
| 8 | 追溯与一致性保护状态:先思考 / 再写入 | done | `R1.13` / `R1.14` 已完成 trace / impact / protection / audit / lineage 状态集合、触发、传播和停审。 | 进入关系与分发语义状态:先思考。 |
| 9 | 关系与分发语义状态:先思考 / 再写入 | done | `R1.15` / `R1.16` 已完成 relation / integrity / distribution availability 状态集合、触发、传播和停审。 | 进入外部摘要与引用状态:先思考。 |
| 10 | 外部摘要与引用状态:先思考 / 再写入 | done | `R1.17` / `R1.18` 已完成 external summary / refs / body boundary / acceptance / summary view 状态集合、触发、传播和停审。 | 进入后台维护与收敛状态:先思考。 |
| 11 | 后台维护与收敛状态:先思考 / 再写入 | done | `R1.19` / `R1.20` 已完成 maintenance task / run / progress / recovery convergence 状态集合、触发、传播和停审。 | 进入外围包与方法集组织状态:先思考。 |
| 12 | 外围包与方法集组织状态:先思考 / 再写入 | done | `R1.21` / `R1.22` 已完成 package / method set / composition / peripheral availability 状态集合、触发、传播和停审。 | 进入跨状态一致性审计:先思考。 |
| 13 | 跨状态一致性审计:先思考 / 再写入 | done | `R1.23` / `R1.24` 已完成同名 / 近义状态、触发覆盖、传播边界和 event candidate 红线审计。 | 进入旧材料差异审计:先思考。 |
| 14 | 旧材料差异审计:先思考 / 再写入 | done | `R1.25` / `R1.26` 已完成旧正式 §9 和 historical Step 9 污染审计。 | 进入正式 §9 回填草稿:先思考。 |
| 15 | 正式 §9 回填草稿:先思考 / 再写入 | done | `R1.27` / `R1.28` 已完成正式 §9 可回填草稿,不直接改正式文档。 | 进入自检与停审:先思考。 |
| 16 | 自检与停审:先思考 / 再写入 | done | `R1.29` / `R1.30` 已完成门禁自检、可回填性检查、Step 10 承接裁决和停审记录。 | 进入正式 §9 回填记录。 |
| 17 | 正式 §9 回填记录:再写入 | done | `R1.31` 已完成正式 §9 回填动作记录、回填后检查、后续风险保留和最终裁决。 | 等待用户确认进入 Step 10 开工与必读文档:先思考。 |

#### R1.2.6 下一模块边界

当前 Step 9 已完成正式 §9 回填。下一动作必须等待用户确认后进入 Step 10 `开工与必读文档:先思考`;在用户明确前不得直接进入 Step 10。

下一模块必须回答:

1. 哪些状态 owner 是核心 truth / lifecycle。
2. 哪些状态 owner 是 view / material freshness 或 availability。
3. 哪些状态 owner 是 maintenance task / recovery / progress。
4. 哪些状态 owner 是 external acceptance / boundary disposition。
5. 哪些候选只作为后续详细设计或运维状态,不进入概要 Step 9。

#### R1.2.7 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写入必读文档表 | pass | 已列出项目台账、flow、SOP、书写规范、中间产物规范、当前正式文档、Step 5~8 和参考框架。 |
| 是否确认输入基线 | pass | 已确认 Step 5~8 为当前来源,正式 §9 为旧材料。 |
| 是否降级旧 Step 9 | pass | 已明确旧 lifecycle / outbox / snapshot / fingerprint / worker / P1 状态不继承。 |
| 是否写状态定义表或迁移图 | no | 状态正文留给后续逐模块小循环。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9 开工。 |

next_allowed_action: 等待用户确认后进入 Step 9 `状态 owner 候选池:先思考`;只思考状态 owner 筛选框架、候选分类和排除口径,不得写状态定义表正文、状态流转图、允许 / 禁止迁移清单,不得修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.3 状态 owner 候选池:先思考

#### R1.3.1 本模块问题

本模块只回答“哪些对象或对象家族有资格成为 Step 9 状态 owner”。它不回答具体状态值、允许迁移、禁止迁移、状态流转图或正式 §9 草稿。

需要先把 owner 筛选清楚,原因有三点:

1. 当前 Step 6 已经点名多个 state candidate,但并非所有有状态字段或读取标记的对象都应成为独立状态机。
2. 当前 Step 8 已经给出 Command / Inbound / Operations Job 的触发来源,但 Step 9 不能把每个流程结果都升级为状态 owner。
3. 旧 Step 9 的统一 `MethodContentLifecycle` 会把定义、正式化、消费、追溯、分发、外部摘要、维护和外围组织压成一条生命周期,这正是本轮需要避免的污染。

#### R1.3.2 状态 owner 筛选规则

候选进入 Step 9 状态 owner 池,至少需要同时满足以下条件:

| 规则 | 必须满足 | 不满足时处理 |
|---|---|---|
| 有 Step 6 对象归属 | 能回指 truth、state object、view/material、task/recovery、history/lineage、boundary 或 peripheral 对象。 | 只作为流程局部结果、safe reason 或后续详细设计材料。 |
| 有 Step 8 触发来源 | 能回指 Command、Inbound Consumer、Operations Job 或 material refresh / recovery flow。 | 不进入状态迁移讨论。 |
| 有业务可见含义 | 会影响正式化、可消费性、读取可用性、追溯一致性、关系完整性、外部接受或外围可见性。 | 降级为实现内部状态或诊断信息。 |
| 不属于实现机制 | 不表达 worker、queue、retry、outbox relay、adapter cache、DB lock 或投递 checkpoint。 | 后置到 03 / 04 / 07,不得进入概要 §9。 |
| 不复制外部 truth | 不保存外部正文、治理执行、artifact 正文、marketplace 交易或下游运行状态。 | 只能以 summary/ref/boundary disposition 表达。 |

#### R1.3.3 候选分类框架

本轮 Step 9 的 owner 池按五类筛选,后续再按八个主要组成部分逐项落表。

| 分类 | 适用 owner | 判断重点 |
|---|---|---|
| Core truth / lifecycle | 定义、目录、正式版本、正式化、关系等本仓拥有的 truth 或 state object。 | 是否影响核心闭环成立;是否能由 Command 显式触发。 |
| View / material freshness or availability | consumption material、availability view、trace material、relation/distribution material、external summary view、peripheral view。 | 是否只是派生读取状态;是否禁止反写 truth。 |
| Maintenance task / recovery / progress | read material refresh、trace material refresh、consistency recovery、maintenance progress。 | 是否只推进派生材料和恢复收敛;是否不修核心 truth。 |
| External acceptance / boundary disposition | external summary acceptance、artifact/archive ref 接受、external body boundary、downstream consumption boundary、definition-use guard。 | 是否只承接 body-free summary/ref/marker;是否不拥有外部系统生命周期。 |
| Peripheral organization availability | method package、method set assembly、composition result、peripheral discovery view。 | 是否保持外围增强;是否不阻塞核心定义、正式化和受控消费。 |

#### R1.3.4 初步 owner 池判断

以下只是 owner 候选池,不是状态定义表。

| 组成部分 | 强候选 owner | 弱候选 / 待后续判断 | 当前排除 |
|---|---|---|---|
| 方法资产定义与目录 | `MethodAssetDefinition`;`MethodAssetCatalogEntry` | `MethodAssetCatalogView` freshness / availability | 搜索索引状态、UI 分类状态、旧 draft lifecycle。 |
| 正式化与版本 | `FormalizationState`;`FormalMethodAssetVersion` | `FormalizationBasisSummary` freshness / basis availability | governance 执行状态、fingerprint drift、发布流水线状态。 |
| 受控消费 | `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`DownstreamConsumptionBoundary` | `DefinitionUseBoundaryGuard` disposition | 下游运行状态、授权矩阵执行状态、snapshot export 状态。 |
| 追溯与一致性保护 | `MethodAssetTraceMaterial`;`ConsumptionImpactSummary`;`ConsistencyProtectionPolicy`;`MethodAssetAuditTrail` | evidence lineage completeness / trace view freshness | raw audit log 状态、report body 状态、telemetry 状态。 |
| 关系与分发语义 | `MethodAssetRelation`;`DistributionReadMaterial`;`RelationIntegrityRule` | relation view freshness / distribution availability | runtime dependency、call graph、marketplace listing / install 状态。 |
| 外部摘要与引用 | `ExternalSourceSummary`;`ExternalBasisAcceptanceHistory`;`ArtifactArchiveRef`;`ExternalBodyBoundaryRule` | external summary view freshness / reference availability | 外部文档生命周期、artifact body/archive package 状态。 |
| 后台维护与收敛 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MaintenanceProgressView` | maintenance run history visibility | worker、scheduler、queue、retry、lock、dead letter 状态。 |
| 外围包与方法集组织 | `MethodPackage`;`MethodSetAssembly`;`PackageCompositionRule` | package / set view availability、peripheral discovery availability | marketplace order、installation、organization runtime config、console UI 状态。 |

#### R1.3.5 取舍诊断

本轮不应把所有候选都写成同等强度的状态机。建议后续按以下取舍推进:

| 取舍 | 当前判断 | 后续写入要求 |
|---|---|---|
| `FormalizationState` 应作为核心状态 owner | yes | 后续必须独立定义状态集合、触发来源、允许 / 禁止迁移和消费影响。 |
| `FormalMethodAssetVersion` 应作为版本生命周期 owner | yes | 需与正式化判断分开,避免“状态通过”等于“版本成立”。 |
| `MethodAssetDefinition` / `MethodAssetCatalogEntry` 是否独立成完整状态机 | likely_limited | 后续只写概要级状态语义,避免恢复旧 draft / publish 主线。 |
| consumption availability 是否独立 | yes | 但 owner 更偏 view / material availability,不得反写正式版本 truth。 |
| trace / relation / external summary freshness 是否统一 | no | 只能共享 freshness 语义框架,owner 必须分别回指各自 material / view。 |
| maintenance 状态是否等于 job 状态 | no | 只写 task / recovery / progress 语义,不得写 worker 执行状态。 |
| peripheral 状态是否影响核心闭环 | no | 只表达外围可见性和组合结果,不得污染核心状态。 |

#### R1.3.6 排除口径

以下候选不得进入当前 Step 9 状态 owner 池:

| 排除项 | 排除原因 | 后续位置 |
|---|---|---|
| `OutboxEventStatus` / delivery status | 当前 §8 只有 event candidate,不定义 outbox、topic、relay、retry、dead letter。 | 若需要,后置 03 / 04 / 07。 |
| worker / queue / scheduler / lock / retry | 属于执行机制或运维机制,不是概要业务状态。 | 后置详细设计、配置设计或实施计划。 |
| snapshot export / fingerprint drift | 当前受控消费和版本语义已不以 snapshot / fingerprint 为主线。 | 如需摘要一致性,从 material freshness 重新讨论。 |
| governance execution lifecycle | 本仓只承接依据摘要 / ref,不执行治理流程。 | 留在 governance 或外部系统。 |
| marketplace transaction / install / fulfillment | 本仓只表达分发语义和外围 context,不拥有交易履约 truth。 | 留给 marketplace / 下游系统。 |
| UI / console / SDK session state | 展示或客户端状态不属于方法资产状态机。 | 留给 console / SDK。 |
| adapter private cache / fake runtime state | 无 Step 6 owner 和 Step 8 正式触发来源。 | 不作为设计真相源。 |

#### R1.3.7 下一写入批次边界

下一批 `状态 owner 候选池:再写入` 只允许把本模块思考收敛为正式候选池表、筛选规则和停审记录。

不得写:

1. 具体状态值定义表。
2. 状态流转 ASCII 图。
3. 允许 / 禁止迁移清单。
4. 正式 §9 回填草稿。
5. Step 10 异常边界。

#### R1.3.8 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 只定义 owner 筛选规则、候选分类和排除口径。 |
| 是否写状态定义表 | no | 未定义具体状态值和状态含义全集。 |
| 是否写迁移图 / 迁移清单 | no | 未写允许迁移、禁止迁移或 ASCII 状态流转图。 |
| 是否继承旧状态主线 | no | 已再次排除 `MethodContentLifecycle`、`OutboxEventStatus`、snapshot、fingerprint 和 worker 状态。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9 owner 候选池。 |

next_allowed_action: 等待用户确认后进入 Step 9 `状态 owner 候选池:再写入`;只写 owner 筛选规则、候选池表、排除口径和停审记录,不得写状态定义表正文、状态流转图、允许 / 禁止迁移清单,不得修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.4 状态 owner 候选池:再写入

#### R1.4.1 owner 筛选规则定稿

Step 9 状态 owner 必须同时满足以下规则,否则不得进入后续状态定义小循环:

| 规则 | 定稿口径 | 后续检查 |
|---|---|---|
| 来源闭合 | 必须能回指 Step 6 当前对象、view/material、task/recovery、history/lineage、boundary 或 peripheral 对象。 | 后续每个状态模块必须写 `owner -> Step 6 来源`。 |
| 触发闭合 | 必须能回指 Step 7 / Step 8 的 Command、Inbound Consumer、Operations Job 或 material refresh / recovery flow。 | Query 只读,不得作为持久状态迁移触发。 |
| 业务可见 | 必须影响正式化、版本、消费、读取可用性、追溯一致性、关系完整性、外部接受、维护收敛或外围可见性。 | 只影响实现过程的状态不得进入概要 §9。 |
| 边界安全 | 不保存外部正文、artifact 正文、治理执行正文、marketplace 交易、下游运行状态或 UI 会话状态。 | 只能以 summary/ref/boundary disposition 表达外部或下游关系。 |
| 分层清楚 | truth / state、view/material、task/progress、boundary disposition、peripheral availability 必须分层。 | 不把派生材料状态写成 core truth 状态。 |

#### R1.4.2 状态 owner 候选池

本表只确定状态 owner 池和后续讨论位置,不定义状态值、不写迁移图。

| 组成部分 | owner 候选 | owner 层级 | 状态关注点 | 触发来源类型 | 后续模块 |
|---|---|---|---|---|---|
| 方法资产定义与目录 | `MethodAssetDefinition` | core truth | 定义是否作为稳定锚点成立、调整或退出当前语境。 | Command | 方法资产定义与目录状态。 |
| 方法资产定义与目录 | `MethodAssetCatalogEntry` | core truth / catalog | 目录项是否可作为适用语境入口。 | Command | 方法资产定义与目录状态。 |
| 方法资产定义与目录 | `MethodAssetCatalogView` | view/material | 目录读取材料 freshness / availability。 | Operations Job / material refresh | 方法资产定义与目录状态;后台维护状态交叉审计。 |
| 正式化与版本 | `FormalizationState` | state object | 正式化判断结果和正式消费资格。 | Command / Inbound summary | 正式化与版本状态。 |
| 正式化与版本 | `FormalMethodAssetVersion` | core truth / lifecycle | 正式版本成立、语义变化和退出新消费语境。 | Command | 正式化与版本状态。 |
| 正式化与版本 | `FormalizationBasisSummary` | support summary | 正式依据摘要可用性和过期风险。 | Inbound / Command / refresh hint | 正式化与版本状态;外部摘要状态交叉审计。 |
| 受控消费 | `MethodAssetConsumptionMaterial` | material | 消费材料可用性、边界阻断后的读取形态。 | Command / material refresh | 受控消费状态。 |
| 受控消费 | `MethodAssetAvailabilityView` | view/material | 可消费性读取结果和不可用提示。 | Command / Operations Job | 受控消费状态。 |
| 受控消费 | `DownstreamConsumptionBoundary` | boundary | 消费边界是否允许当前使用语境。 | Command | 受控消费状态。 |
| 追溯与一致性保护 | `MethodAssetTraceMaterial` | material / lineage | 追溯材料是否可用于变化解释和影响定位。 | Command / Inbound / Operations Job | 追溯与一致性保护状态。 |
| 追溯与一致性保护 | `ConsumptionImpactSummary` | support summary | 下游影响摘要是否已承接、可见或待处理。 | Inbound / Command | 追溯与一致性保护状态。 |
| 追溯与一致性保护 | `ConsistencyProtectionPolicy` | policy / guard | 一致性保护判断是否阻断或允许变化继续。 | Command | 追溯与一致性保护状态。 |
| 追溯与一致性保护 | `MethodAssetAuditTrail` | audit / history | 审计线索是否能串起 body-free 依据和变化。 | Command / Inbound / Job result | 追溯与一致性保护状态。 |
| 关系与分发语义 | `MethodAssetRelation` | relation truth | 定义性关系是否成立、调整或退出。 | Command | 关系与分发语义状态。 |
| 关系与分发语义 | `RelationIntegrityRule` | policy / invariant | 关系端点和语义是否保持完整。 | Command / Job diagnostic | 关系与分发语义状态。 |
| 关系与分发语义 | `DistributionReadMaterial` | material | 分发语义读取材料是否可用或需要刷新。 | Command / Operations Job | 关系与分发语义状态。 |
| 外部摘要与引用 | `ExternalSourceSummary` | support summary | 外部安全摘要是否被接受、拒绝或待确认。 | Command / Inbound | 外部摘要与引用状态。 |
| 外部摘要与引用 | `ExternalBasisAcceptanceHistory` | history / acceptance | 外部依据接受线索是否可追溯。 | Command / Inbound | 外部摘要与引用状态。 |
| 外部摘要与引用 | `ArtifactArchiveRef` | reference / boundary | artifact / archive 引用是否安全可用。 | Command / Inbound / reference check | 外部摘要与引用状态。 |
| 外部摘要与引用 | `ExternalBodyBoundaryRule` | policy / guard | 外部正文是否被拒绝或隔离。 | Command / Inbound | 外部摘要与引用状态。 |
| 后台维护与收敛 | `ReadMaterialRefreshTask` | task/progress | 读取材料刷新请求和收敛进度。 | Operations Job / maintenance command | 后台维护与收敛状态。 |
| 后台维护与收敛 | `TraceMaterialRefreshTask` | task/progress | 追溯材料刷新请求和收敛进度。 | Operations Job / maintenance command | 后台维护与收敛状态。 |
| 后台维护与收敛 | `ConsistencyRecoveryTask` | recovery task | 一致性恢复是否需要、进行中或完成介入。 | Operations Job / maintenance command | 后台维护与收敛状态。 |
| 后台维护与收敛 | `MaintenanceProgressView` | progress view | 维护进度的可见读取结果。 | Operations Job | 后台维护与收敛状态。 |
| 外围包与方法集组织 | `MethodPackage` | peripheral truth | 方法包外围组织是否可用、调整或退出。 | Command | 外围包与方法集组织状态。 |
| 外围包与方法集组织 | `MethodSetAssembly` | peripheral truth | 方法集组装是否可用、调整或不可用。 | Command | 外围包与方法集组织状态。 |
| 外围包与方法集组织 | `PackageCompositionRule` | policy / invariant | package / set 组合结果是否满足外围规则。 | Command / Query diagnostic | 外围包与方法集组织状态。 |

#### R1.4.3 分层输出

后续状态讨论按以下分层展开,不得把各层压成统一 lifecycle:

| 分层 | 当前 owner | 写入要求 |
|---|---|---|
| Core truth / lifecycle | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`FormalMethodAssetVersion`;`MethodAssetRelation` | 只讨论概要级业务生命周期,不恢复旧 draft / publish 主线。 |
| State object | `FormalizationState` | 必须独立讨论正式化判断和版本成立的关系。 |
| View / material availability | catalog view、consumption material、availability view、trace material、distribution material、external summary view、peripheral view | 只表达读取材料状态,不得反写 truth。 |
| Boundary / acceptance disposition | consumption boundary、external summary acceptance、artifact/archive ref、body boundary、definition-use guard | 表达允许、阻断、拒绝、待确认等边界 disposition,不拥有外部 truth。 |
| Task / recovery / progress | refresh task、recovery task、maintenance progress | 表达维护请求和收敛进度,不写 worker / queue / retry。 |
| Peripheral organization | method package、method set、composition rule | 表达外围可用性和组合结果,不得阻塞核心闭环。 |

#### R1.4.4 排除清单定稿

以下内容在 Step 9 当前范围内排除:

| 排除项 | 定稿处理 |
|---|---|
| `MethodContentLifecycle` | 不继承;旧 draft / in_review / published / deprecated / retired / superseded 不作为当前统一状态机。 |
| `OutboxEventStatus` | 不进入概要状态主线;event 当前只作为 candidate,不定义投递状态。 |
| snapshot export / fingerprint drift | 不作为状态 owner;如后续需要一致性提示,只能从 material freshness 重新推导。 |
| worker / scheduler / queue / retry / lock / dead letter | 后置到详细设计、配置设计或实施计划。 |
| governance execution lifecycle | 不属于本仓;本仓只承接 body-free basis summary/ref。 |
| marketplace listing / order / install / fulfillment | 不属于本仓;外围只保留 context/ref/organization 语义。 |
| external document / artifact body lifecycle | 不属于本仓;只保留 summary/ref/boundary disposition。 |
| UI / console / SDK session state | 不属于方法资产业务状态。 |

#### R1.4.5 后续模块分配

下一模块先进行 `L1-governance 框架对齐:先思考`,只学习其状态组、定义表、迁移图、传播图和审计收尾结构。对齐完成后,八个主要组成部分按以下顺序逐项先思考、再写入:

| 顺序 | 后续模块 | 使用本 owner 池的方式 |
|---:|---|---|
| 1 | 方法资产定义与目录状态 | 使用 definition、catalog entry、catalog view owner。 |
| 2 | 正式化与版本状态 | 使用 formalization state、formal version、basis summary owner。 |
| 3 | 受控消费状态 | 使用 consumption material、availability view、boundary owner。 |
| 4 | 追溯与一致性保护状态 | 使用 trace material、impact summary、protection policy、audit owner。 |
| 5 | 关系与分发语义状态 | 使用 relation、integrity rule、distribution material owner。 |
| 6 | 外部摘要与引用状态 | 使用 external summary、acceptance history、artifact ref、body boundary owner。 |
| 7 | 后台维护与收敛状态 | 使用 refresh task、recovery task、progress view owner。 |
| 8 | 外围包与方法集组织状态 | 使用 package、method set、composition rule owner。 |

#### R1.4.6 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成 owner 筛选规则 | pass | 已固定来源闭合、触发闭合、业务可见、边界安全和分层清楚五条规则。 |
| 是否完成候选池 | pass | 已按八个主要组成部分列出 owner 候选、层级、关注点、触发来源和后续模块。 |
| 是否排除旧状态主线 | pass | 已定稿排除 `MethodContentLifecycle`、`OutboxEventStatus`、snapshot、fingerprint、worker 和外围交易状态。 |
| 是否写具体状态值 | no | 本模块只写 owner 池,未定义状态值全集。 |
| 是否写迁移图 / 迁移清单 | no | 未写状态流转图、允许迁移或禁止迁移。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9。 |

next_allowed_action: 等待用户确认后进入 Step 9 `L1-governance 框架对齐:先思考`;只参考 L1-governance 的 Step 9 框架、深度、状态定义表组织、迁移图组织、传播图组织和审计收尾方式,不得复制 governance 领域语义,不得写本仓具体状态定义表正文、状态流转图、允许 / 禁止迁移清单,不得修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.5 L1-governance 框架对齐:先思考

#### R1.5.1 本模块问题

本模块只抽象 L1-governance Step 9 的写作框架,用于约束 L3-method-library 后续状态模块的深度和顺序。它不复制 governance 的状态名、对象名、流程语义或领域判断。

需要回答:

1. L1-governance 的 Step 9 为什么比当前 L3 旧 Step 9 更适合作为框架参照。
2. 哪些章节结构可以迁移到 L3。
3. 哪些内容不能迁移,避免把 governance 语义污染 method-library。
4. 后续八个主要组成部分应按什么结构写“状态:先思考 / 再写入”。

#### R1.5.2 governance Step 9 框架观察

L1-governance 的 Step 9 不是只列一个 lifecycle enum。它的骨架更完整:

| 框架元素 | governance 做法 | L3 可借鉴点 |
|---|---|---|
| SOP 问题回答 | 先回答正式状态、状态含义、触发来源、允许 / 禁止迁移、传播影响。 | L3 每个状态组也应先回答 owner、含义、触发、迁移边界和传播。 |
| 状态机边界总览 | 先按状态组列承载对象、主要触发和说明。 | L3 应先写状态组总览,再进入具体组成部分状态。 |
| 状态定义表 | 每个状态类型列状态、含义、是否可进入正常主线。 | L3 后续状态表必须包含“是否进入核心 / 正常主线”判断。 |
| ASCII 流转图 | 每组状态有概要流转图和关键说明。 | L3 不应只写表,重要状态组要画概要图。 |
| 允许迁移清单 | 按对象列允许迁移和触发动作。 | L3 后续每组都要写允许迁移来源,但保持概要粒度。 |
| 禁止迁移清单 | 集中列红线迁移和原因。 | L3 必须明确 Query no-write、Job 不修 truth、外部缺失不回滚 truth。 |
| 状态传播关系 | 分清 core truth、derived view、reference、outbox / handoff。 | L3 可改写为 truth、read material、external summary、event candidate、maintenance progress、peripheral view。 |
| 处理流对应关系 | 回指 Step 8 flow family 与状态影响。 | L3 每个状态组必须能回指 Step 8 当前处理流。 |
| 问题诊断与取舍 | 说明旧材料问题、改动前后和设计取舍。 | L3 应保留旧 `MethodContentLifecycle` / outbox / snapshot / fingerprint 差异审计。 |
| 回填草稿和进入条件 | 说明正式 §9 如何摘录,以及进入下一步条件。 | L3 后续正式 §9 草稿前必须先完成自检和停审。 |

#### R1.5.3 可迁移到 L3 的章节骨架

建议 L3 Step 9 后续整体采用以下骨架,但内容按 method-library 当前 owner 池重写:

| 顺序 | 章节 / 模块 | L3 用途 |
|---:|---|---|
| 1 | SOP 问题回答 | 回答本仓有哪些状态组、触发来源、迁移边界、传播影响。 |
| 2 | 状态组边界总览 | 按 owner 池汇总 core truth、state object、material availability、boundary disposition、maintenance progress、peripheral availability。 |
| 3 | 八个主要组成部分状态小循环 | 每个组成部分先思考、再写入状态定义表、概要流转、允许 / 禁止迁移和传播提示。 |
| 4 | 跨状态传播关系 | 画 truth -> read material / trace / event candidate / maintenance progress / peripheral view 的传播图。 |
| 5 | Step 8 处理流对应关系 | 回指 Command / Inbound / Operations Job 对状态的影响;Query no-write。 |
| 6 | 旧材料差异审计 | 对比旧 `MethodContentLifecycle`、`OutboxEventStatus`、snapshot、fingerprint 和 P1 plugin 状态。 |
| 7 | 设计取舍 | 说明为什么不建立单一 lifecycle,为什么不把 freshness / maintenance / peripheral 状态写成 truth。 |
| 8 | 正式 §9 回填草稿 | 形成可摘录到正式 `02-概要设计.md` 的压缩版。 |
| 9 | 自检与进入 Step 10 条件 | 确认状态 owner、定义、流转、迁移红线和传播关系闭合。 |

#### R1.5.4 后续单组成部分模块模板

后续每个组成部分不应一次性写全仓状态,而应使用同一小模板:

| 子段 | 内容 | 限制 |
|---|---|---|
| 问题回答 | 本组成部分有哪些 owner,是否影响核心主线。 | 不写其他组成部分状态。 |
| owner 到对象映射 | owner、Step 6 对象、Step 8 触发来源。 | 不新增 Step 6 没有的 owner。 |
| 状态定义表 | 状态类型、状态、含义、是否可进入正常主线。 | 只写概要状态,不写 enum 代码或字段。 |
| 状态流转图 | 关键状态的 ASCII 图。 | 只写主迁移,不写详细并发 / 幂等矩阵。 |
| 允许迁移 | 对象、允许迁移、触发动作。 | 触发动作必须来自 Step 7 / Step 8。 |
| 禁止迁移 | 禁止行为、原因。 | 必须包含 Query no-write 和外部 / maintenance 不反写 truth 的红线。 |
| 传播影响 | 状态变化传播到哪些 read material、trace、event candidate、maintenance 或 peripheral surface。 | 不写 event payload、topic、outbox relay。 |
| 停审 | 检查是否越界、是否可进入下一组成部分。 | 不直接修改正式文档。 |

#### R1.5.5 L3 特有适配

L3 与 governance 的差异必须显式保留:

| 差异 | L3 适配 |
|---|---|
| governance 有裁决 / 责任 / 控制 / 不符合闭环 | L3 不复制这些语义,改为定义、正式化、消费、追溯、关系、外部摘要、维护和外围组织。 |
| governance 把 outbox 作为状态组之一 | L3 当前只保留 event candidate,不把 outbox delivery 状态写入概要 Step 9。 |
| governance 有 reference / snapshot / handoff | L3 只可使用 external summary/ref、artifact archive ref、read material freshness 和 maintenance progress,不恢复 snapshot 主线。 |
| governance 的 derived view freshness 可作为独立组 | L3 freshness 需要分散到 catalog、consumption、trace、relation、external、peripheral material,再由后台维护交叉审计。 |
| governance 结论状态影响 dashboard / GRC | L3 状态传播影响 read material、controlled consumption、trace / audit、event candidate、maintenance progress 和 peripheral discovery。 |

#### R1.5.6 当前取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否照搬 governance 的 7 个状态组 | no | L3 owner 池不同,照搬会污染领域语义。 |
| 是否照搬章节顺序 | yes_with_adaptation | SOP 问题、状态组、定义表、流转图、迁移清单、传播、对应关系、差异审计、取舍和回填草稿的顺序可复用。 |
| 是否每个组成部分都画图 | selective_yes | 核心 truth / formalization / consumption / maintenance / external boundary 等关键组要画图;极简单 view availability 可合并图。 |
| 是否允许统一 lifecycle | no | 单一 lifecycle 会再次恢复旧 `MethodContentLifecycle` 风险。 |
| 是否现在写 L3 具体状态定义 | no | 当前模块只做框架先思考,具体状态留给后续组成部分小循环。 |

#### R1.5.7 下一写入批次边界

下一批 `L1-governance 框架对齐:再写入` 只允许写:

1. governance 可复用框架清单。
2. L3 禁止复制的 governance 语义清单。
3. L3 Step 9 后续整体骨架。
4. 单组成部分状态模块模板。
5. 停审记录和下一模块边界。

不得写 L3 具体状态定义表正文、状态流转图、允许 / 禁止迁移清单或正式 §9 草稿;不得修改正式 `02-概要设计.md`;不得进入 Step 10。

#### R1.5.8 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做框架先思考 | pass | 只抽象 governance 的写作结构和 L3 适配策略。 |
| 是否复制 governance 领域语义 | no | 未把 governance 状态名迁入 L3 owner 池。 |
| 是否写 L3 具体状态定义 | no | 未写 L3 状态值、迁移图或迁移清单。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9 框架对齐。 |

next_allowed_action: 等待用户确认后进入 Step 9 `L1-governance 框架对齐:再写入`;只写可复用框架清单、禁止复制语义清单、L3 后续整体骨架、单组成部分状态模块模板和停审记录,不得写本仓具体状态定义表正文、状态流转图、允许 / 禁止迁移清单,不得修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.6 L1-governance 框架对齐:再写入

#### R1.6.1 可复用框架清单

L1-governance Step 9 中可复用于本仓的是“写法骨架”,不是领域内容。

| 可复用框架 | L3 当前采用方式 |
|---|---|
| SOP 问题先回答 | 后续状态模块先说明 owner、触发、正常主线、迁移边界和传播影响。 |
| 状态组边界总览 | 先按 owner 池整理 core truth、state object、material availability、boundary disposition、maintenance progress、peripheral availability。 |
| 状态定义表 | 每个状态类型必须写状态、含义、是否可进入正常主线。 |
| ASCII 状态流转图 | 对核心状态组、正式化 / 版本、受控消费、外部边界、维护恢复等关键状态写概要图。 |
| 允许迁移清单 | 按对象列允许迁移和触发来源,触发来源必须来自 Step 7 / Step 8。 |
| 禁止迁移清单 | 集中写 Query no-write、Job 不修 truth、外部缺失不回滚 truth、外围不可用不污染核心。 |
| 状态传播关系 | 写 truth / boundary / material / maintenance / peripheral 状态如何传播到 read surface、trace、event candidate 和 progress。 |
| 处理流与状态对应 | 回指 Step 8 Command / Inbound / Operations Job;Query 只读。 |
| 旧材料差异审计 | 专门审计旧 lifecycle、outbox、snapshot、fingerprint 和 P1 状态。 |
| 设计取舍与回填草稿 | 在正式 §9 回填前先完成取舍和可摘录草稿。 |

#### R1.6.2 禁止复制的 governance 语义

以下 governance 语义不得进入 L3-method-library:

| governance 语义 | L3 禁止原因 | L3 替代口径 |
|---|---|---|
| Gate / Decision / Approval lifecycle | 本仓不拥有治理裁决 truth。 | 仅承接 body-free basis summary/ref。 |
| Policy / Control / Compliance / Nonconformity 状态 | 这些属于 governance 专属闭环。 | L3 使用 formalization、consumption、trace、relation 和 protection owner。 |
| OutboxPublicationState 作为概要状态组 | 当前 L3 §8 只承认 event candidate,不闭口 outbox delivery。 | event candidate 传播影响留概要,delivery 后置。 |
| Reference snapshot / handoff 状态 | L3 不恢复 snapshot 主线。 | 使用 external summary/ref、artifact archive ref、material freshness。 |
| Dashboard / GRC / report 状态 | 属于治理可视化和外部合规交接。 | L3 使用 read material、trace/audit、maintenance progress、peripheral view。 |
| WorkItem / corrective loop 类状态 | 属于 work/process 协作闭环。 | L3 只保留 consistency recovery / maintenance progress,不创建 work truth。 |

#### R1.6.3 L3 Step 9 后续整体骨架

本轮 Step 9 后续使用以下整体骨架推进:

| 顺序 | 模块 | 输出 |
|---:|---|---|
| 1 | 方法资产定义与目录状态 | definition / catalog / catalog view 状态定义、主迁移和红线。 |
| 2 | 正式化与版本状态 | formalization state、formal version lifecycle、basis availability 状态定义、主迁移和红线。 |
| 3 | 受控消费状态 | consumption material、availability view、boundary disposition 状态定义、主迁移和红线。 |
| 4 | 追溯与一致性保护状态 | trace material、impact summary、protection decision、audit lineage 状态定义、主迁移和红线。 |
| 5 | 关系与分发语义状态 | relation lifecycle、integrity disposition、distribution material availability 状态定义、主迁移和红线。 |
| 6 | 外部摘要与引用状态 | external summary acceptance、artifact/archive ref、body boundary 状态定义、主迁移和红线。 |
| 7 | 后台维护与收敛状态 | refresh task、recovery task、progress view 状态定义、主迁移和红线。 |
| 8 | 外围包与方法集组织状态 | package、method set、composition、peripheral view availability 状态定义、主迁移和红线。 |
| 9 | 跨状态一致性审计 | owner 覆盖、同名状态、触发覆盖、传播边界、Query / Job 红线审计。 |
| 10 | 旧材料差异审计 | 旧正式 §9 和历史 Step 9 污染审计。 |
| 11 | 正式 §9 回填草稿 | 形成可回填草稿,不直接修改正式文档。 |
| 12 | 自检与停审 | 判断 Step 9 是否可回填、是否可进入 Step 10。 |

#### R1.6.4 单组成部分状态模块模板

后续每个组成部分按同一模板执行:

| 子段 | 固定输出 | 必须避免 |
|---|---|---|
| 先思考 | owner 范围、状态组取舍、触发来源、传播风险、排除项。 | 直接写完整状态表或迁移图。 |
| 再写入:owner 映射 | owner、Step 6 来源、Step 8 触发来源、是否核心主线。 | 新增 Step 6 未点名 owner。 |
| 再写入:状态定义表 | 状态类型、状态、含义、是否可进入正常主线。 | 写 Rust enum、DTO 字段或数据库列。 |
| 再写入:概要流转图 | ASCII 图和关键说明。 | 写完整并发、expected version、幂等或错误矩阵。 |
| 再写入:允许迁移 | 对象、允许迁移、触发动作。 | 使用 Query、adapter 私有状态或错误字符串作为迁移来源。 |
| 再写入:禁止迁移 | 禁止迁移 / 行为、原因。 | 漏掉外部正文、maintenance 修 truth 或外围污染核心。 |
| 再写入:传播影响 | 来源状态变化、必须传播到、不允许传播到。 | 写 topic、payload schema、outbox relay 或 worker。 |
| 停审 | 越界检查、旧材料污染检查、下一模块边界。 | 直接修改正式 `02-概要设计.md`。 |

#### R1.6.5 本仓全局状态红线

后续每个组成部分状态模块都必须继承以下红线:

| 红线 | 说明 |
|---|---|
| Query no-write | Query 只能读取状态、freshness、availability、diagnostic 或 progress,不得刷新、修复或创建状态。 |
| Job 不修 core truth | Operations Job 只能刷新材料、推进恢复和记录 progress,不得改 definition、formal version、relation、external summary 或 package truth。 |
| 外部缺失不回滚 truth | 外部依据缺失、artifact 不可用或引用失效只能形成 pending / unavailable / degraded / recovery needed 等状态,不得回滚已成立 truth。 |
| event candidate 不等于 delivery | 当前概要只写 event candidate 传播影响,不写 outbox 投递状态。 |
| read material 不等于 truth | freshness / stale / unavailable 只影响读取面,不得成为第二 truth。 |
| peripheral 不阻塞核心 | package / method set / discovery 不可用不得使定义、正式版本、消费材料或追溯主线失效。 |
| 不恢复旧主线 | 不恢复 `MethodContentLifecycle`、snapshot export、fingerprint drift、P1 plugin/config lifecycle。 |

#### R1.6.6 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成框架清单 | pass | 已定稿可复用结构和 L3 后续整体骨架。 |
| 是否明确禁止复制语义 | pass | 已排除 governance 的 gate、decision、policy、control、nonconformity、outbox publication 和 snapshot / handoff 语义。 |
| 是否给出单模块模板 | pass | 已固定先思考、owner 映射、状态定义、流转、允许 / 禁止迁移、传播影响和停审。 |
| 是否写本仓具体状态正文 | no | 未写 L3 具体状态值、状态流转图或迁移清单。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9。 |

next_allowed_action: 等待用户确认后进入 Step 9 `方法资产定义与目录状态:先思考`;只思考 definition / catalog / catalog view 的 owner 范围、状态组取舍、触发来源、传播风险和排除项,不得写完整状态定义表、状态流转图、允许 / 禁止迁移清单,不得修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.7 方法资产定义与目录状态:先思考

#### R1.7.1 本模块问题

本模块只思考方法资产定义与目录这一组成部分的状态范围。当前不写完整状态定义表、状态流转图、允许迁移清单或禁止迁移清单。

需要回答:

1. `MethodAssetDefinition`、`MethodAssetCatalogEntry`、`MethodAssetCatalogView` 哪些状态语义必须进入 Step 9。
2. definition truth、catalog truth、catalog view freshness 如何分层。
3. 哪些 Step 7 / Step 8 入口能触发状态变化,哪些 Query 只能读取。
4. definition / catalog 状态变化如何传播到正式化、目录读取、追溯和事件候选。
5. 哪些旧状态或实现状态必须排除。

#### R1.7.2 当前来源判断

| owner | Step 6 来源 | Step 8 触发来源 | 初步状态职责 |
|---|---|---|---|
| `MethodAssetDefinition` | core truth A1;正式 §6 方法资产定义与目录对象家族。 | `EstablishMethodAssetDefinition`;`AdjustMethodAssetDefinition`。 | 表达定义 truth 是否已成立、被显式调整、仍可作为后续正式化锚点或退出当前语境。 |
| `MethodAssetCatalogEntry` | core truth A2;`CatalogScopeRef` typed boundary。 | `RegisterMethodAssetCatalogEntry`;`ReclassifyMethodAssetCatalogEntry`。 | 表达目录项是否已登记、是否处于当前适用目录语境、是否需刷新读取材料。 |
| `MethodAssetCatalogView` | views/materials C1;非 truth、派生读取材料。 | catalog changed refresh hint;后台 read material refresh。 | 表达目录读取材料 freshness / availability,不得替代 catalog truth。 |

#### R1.7.3 状态组取舍

方法资产定义与目录不应恢复旧 `MethodContentLifecycle`。本组成部分建议拆成三类状态语义:

| 状态组方向 | 是否进入后续写入 | 理由 |
|---|---|---|
| definition truth lifecycle | yes_limited | 定义 truth 是本仓核心锚点,但只需表达成立、调整、退出当前语境等概要状态,不恢复 draft / review / publish 主线。 |
| catalog entry lifecycle | yes_limited | 目录项是独立目录语义 truth,需要表达登记、重分类、退出或不可用等目录语境状态。 |
| catalog view freshness / availability | yes_as_material | 目录 view 是派生读取材料,需要表达 fresh / stale / unavailable 类读取状态,但不得反写 truth。 |
| definition ref resolution diagnostic | no_as_state_owner | `ResolveMethodAssetDefinitionRef` 是 Query 边界,可返回诊断,但不触发持久状态迁移。 |
| search / UI / marketplace listing state | no | 不属于 definition / catalog truth,也不属于本仓业务状态。 |

#### R1.7.4 触发来源思考

后续写入时应把触发来源限定为:

| 触发来源 | 可影响 | 不可影响 |
|---|---|---|
| `EstablishMethodAssetDefinition` | 建立 definition truth 状态和 definition changed event candidate。 | 不建立正式版本,不自动登记 catalog entry,不生成 catalog view truth。 |
| `AdjustMethodAssetDefinition` | 调整 definition truth 状态、追溯线索和 refresh hint。 | 不直接触发正式化通过或正式版本替换。 |
| `RegisterMethodAssetCatalogEntry` | 建立 catalog entry truth 和 catalog view refresh hint。 | 不改变 definition truth,不刷新 view 本体。 |
| `ReclassifyMethodAssetCatalogEntry` | 调整 catalog entry 适用语境和 catalog view refresh hint。 | 不迁移 definition ownership,不触发正式版本变化。 |
| catalog / read material refresh job | 推进 catalog view freshness / availability。 | 不创建或修改 definition / catalog truth。 |
| `ResolveMethodAssetDefinitionRef` / catalog Query | 读取 ref、summary 或 view 状态。 | 不创建、刷新、修复或迁移任何状态。 |

#### R1.7.5 传播风险

本组成部分状态变化会影响后续模块,但传播必须有限:

| 来源变化 | 可传播到 | 风险控制 |
|---|---|---|
| definition established / adjusted | trace / audit lineage、definition changed event candidate、formalization eligibility 的输入提示、catalog refresh hint。 | 不自动变成 formal version,不自动可消费。 |
| definition retired / no longer current | formalization / consumption / relation 后续判断需要可见历史状态。 | 不删除历史引用,不破坏既有 trace。 |
| catalog entry registered / reclassified | catalog view stale / refresh needed、catalog changed event candidate。 | 不修改 definition summary,不替代 catalog scope boundary。 |
| catalog view stale / unavailable | Query surface freshness / unavailable 提示、maintenance progress。 | 不反写 catalog entry,不在 Query 中刷新。 |

#### R1.7.6 排除项

本组成部分后续写入必须排除:

| 排除项 | 排除原因 |
|---|---|
| 旧 draft / in_review / published lifecycle | 属于旧 `MethodContentLifecycle`,会把定义、正式化和发布混在一起。 |
| fingerprint / snapshot 状态 | 当前 definition / catalog 不以 fingerprint 或 snapshot 为状态主线。 |
| search index / ranking / UI category 状态 | 属于读取实现或展示实现,不是 catalog truth。 |
| marketplace listing / install 状态 | 属于外围生态或 marketplace,不属于目录 truth。 |
| Query miss -> auto create / refresh | 违反 Query no-write。 |
| catalog view 反写 catalog entry | 违反 read material 不等于 truth。 |
| definition adjust -> formal version replace | 越过正式化与版本状态 owner。 |

#### R1.7.7 下一写入批次边界

下一批 `方法资产定义与目录状态:再写入` 可以写:

1. owner 到对象 / 触发来源映射。
2. 概要状态定义表。
3. 精简 ASCII 流转图。
4. 允许迁移和禁止迁移清单。
5. 传播影响表和停审记录。

不得写 Rust enum、字段全集、repository / port、DTO、DDL、event payload、topic、outbox relay、worker、retry、正式 §9 回填草稿或 Step 10 异常边界。

#### R1.7.8 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 只思考 owner 范围、状态组取舍、触发来源、传播风险和排除项。 |
| 是否写完整状态定义表 | no | 未写状态类型 / 状态 / 含义 / 正常主线的完整表。 |
| 是否写状态流转图 | no | 未写 ASCII 状态图。 |
| 是否写允许 / 禁止迁移清单 | no | 只做触发来源和排除项思考,迁移清单留给再写入。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9 方法资产定义与目录状态小循环。 |

next_allowed_action: 等待用户确认后进入 Step 9 `方法资产定义与目录状态:再写入`;可写 owner 映射、概要状态定义表、精简 ASCII 流转图、允许 / 禁止迁移清单、传播影响表和停审记录,不得写 Rust enum、字段全集、repository / port、DTO、DDL、event payload、topic、outbox relay、worker、retry,不得修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.8 方法资产定义与目录状态:再写入

#### R1.8.1 owner 映射

| owner | Step 6 来源 | Step 8 触发来源 | 是否核心主线 |
|---|---|---|---|
| `MethodAssetDefinition` | `5.4.1` / core truth A1 | `EstablishMethodAssetDefinition`;`AdjustMethodAssetDefinition` | yes:定义 truth 是正式化、消费、关系和追溯锚点。 |
| `MethodAssetCatalogEntry` | `5.4.2` / core truth A2 | `RegisterMethodAssetCatalogEntry`;`ReclassifyMethodAssetCatalogEntry` | yes_limited:目录项是目录语义 truth,但不决定正式消费。 |
| `MethodAssetCatalogView` | `5.4.4` / views material C1 | catalog changed refresh hint;read material refresh job | no:只读派生材料,不成为 truth。 |

#### R1.8.2 状态定义表

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 |
|---|---|---|---|
| Definition lifecycle | `DefinitionEstablished` | 定义 truth 已建立,可作为目录、正式化和追溯锚点。 | 是,但不等于正式版本成立。 |
| Definition lifecycle | `DefinitionUnderAdjustment` | 定义语义正在显式调整或等待变化确认。 | 有条件:可被追溯和读取,但不得隐式改变既有正式版本含义。 |
| Definition lifecycle | `DefinitionRetired` | 定义退出当前使用语境,历史引用和追溯仍保留。 | 否,只保留历史和追溯。 |
| Catalog entry lifecycle | `CatalogEntryActive` | 目录项当前可作为识别和查找锚点。 | 是,但不等于可正式消费。 |
| Catalog entry lifecycle | `CatalogEntryScopeLimited` | 目录项存在明确适用范围限制。 | 是,但查询和消费必须暴露 scope。 |
| Catalog entry lifecycle | `CatalogEntryRetired` | 目录项退出当前目录语境,历史 trace / audit 仍可解释。 | 否,只保留历史语境。 |
| Catalog view freshness | `CatalogViewCurrent` | 目录视图与来源 definition / catalog truth 对齐。 | 是,作为读取材料。 |
| Catalog view freshness | `CatalogViewStale` | 来源 truth 已变化,视图等待刷新。 | 是,但 query 必须暴露 stale / freshness。 |
| Catalog view freshness | `CatalogViewUnavailable` | 视图当前不可用,但不影响来源 truth 成立。 | 否,只能作为读取不可用提示。 |

#### R1.8.3 概要状态流转图

```text
+==============================================================+
|          Method Asset Definition / Catalog State Flow         |
+==============================================================+
| MethodAssetDefinition                                        |
|   <establish command>                                        |
|        |                                                     |
|        v                                                     |
|   DefinitionEstablished                                      |
|        | adjust                                              |
|        v                                                     |
|   DefinitionUnderAdjustment ---- confirm adjustment --------> |
|        |                                                     |
|        +------------------------------> DefinitionEstablished |
|        |                                                     |
|        | explicit retirement command required                 |
|        v                                                     |
|   DefinitionRetired                                          |
|                                                              |
| MethodAssetCatalogEntry                                      |
|   <register command>                                         |
|        |                                                     |
|        v                                                     |
|   CatalogEntryActive ---- reclassify with limited scope ----> |
|        |                                                     |
|        v                                                     |
|   CatalogEntryScopeLimited ---- reclassify current scope ---> |
|        |                                                     |
|        +------------------------------> CatalogEntryActive    |
|        |                                                     |
|        | explicit retirement command required                 |
|        v                                                     |
|   CatalogEntryRetired                                        |
|                                                              |
| MethodAssetCatalogView                                       |
|   CatalogViewCurrent ---- source truth changed ------------> CatalogViewStale |
|        ^                                                     |
|        | refresh succeeds                                    |
|        +--------------------- refresh job -------------------+
|        |                                                     |
|        +---- unavailable during read / refresh failure ----> CatalogViewUnavailable |
+==============================================================+
```

关键说明:

- `DefinitionEstablished` 是定义锚点成立,不是 publish、正式版本或可消费状态。
- `DefinitionUnderAdjustment` 不允许直接改写既有正式版本含义;正式版本影响留给“正式化与版本状态”。
- `CatalogEntryActive` / `CatalogEntryScopeLimited` 只表达目录语境,不表达 UI 分类或搜索索引。
- `CatalogViewStale` / `CatalogViewUnavailable` 只影响读取面和维护进度,不得反写 `MethodAssetCatalogEntry`。
- 图中 retirement 需要后续显式 Command 或详细设计闭口;当前不得由 Query、Job 或错误字符串隐式触发。

#### R1.8.4 允许迁移清单

| 对象 | 允许迁移 | 触发动作 |
|---|---|---|
| `MethodAssetDefinition` | create -> `DefinitionEstablished` | `EstablishMethodAssetDefinition` accepted。 |
| `MethodAssetDefinition` | `DefinitionEstablished -> DefinitionUnderAdjustment` | `AdjustMethodAssetDefinition` accepted。 |
| `MethodAssetDefinition` | `DefinitionUnderAdjustment -> DefinitionEstablished` | adjustment 确认后保存新的 definition summary。 |
| `MethodAssetDefinition` | `DefinitionEstablished / DefinitionUnderAdjustment -> DefinitionRetired` | 后续需由显式 retirement Command 闭口,当前不得隐式触发。 |
| `MethodAssetCatalogEntry` | create -> `CatalogEntryActive` | `RegisterMethodAssetCatalogEntry` accepted。 |
| `MethodAssetCatalogEntry` | `CatalogEntryActive -> CatalogEntryScopeLimited` | `ReclassifyMethodAssetCatalogEntry` accepted with limited `CatalogScopeRef`。 |
| `MethodAssetCatalogEntry` | `CatalogEntryScopeLimited -> CatalogEntryActive` | `ReclassifyMethodAssetCatalogEntry` accepted with current / broader allowed scope。 |
| `MethodAssetCatalogEntry` | `CatalogEntryActive / CatalogEntryScopeLimited -> CatalogEntryRetired` | 后续需由显式 catalog retirement Command 闭口,当前不得隐式触发。 |
| `MethodAssetCatalogView` | `CatalogViewCurrent -> CatalogViewStale` | definition / catalog truth changed 或 refresh hint accepted。 |
| `MethodAssetCatalogView` | `CatalogViewStale -> CatalogViewCurrent` | read material refresh succeeds。 |
| `MethodAssetCatalogView` | `CatalogViewCurrent / CatalogViewStale -> CatalogViewUnavailable` | refresh unavailable 或读取材料不可用。 |
| `MethodAssetCatalogView` | `CatalogViewUnavailable -> CatalogViewCurrent` | read material refresh succeeds with valid source truth。 |

#### R1.8.5 禁止迁移清单

| 禁止迁移或行为 | 原因 |
|---|---|
| `DefinitionEstablished` 自动进入 formal version / consumable 状态 | 定义成立不等于正式化通过或可消费。 |
| `DefinitionUnderAdjustment` 原地改写既有正式版本语义 | 正式版本影响必须由正式化与版本 owner 显式处理。 |
| `DefinitionRetired` 删除历史 trace、audit 或既有引用 | retired 仍需支持追溯和历史解释。 |
| catalog register / reclassify 修改 definition summary | 目录语境不能反写定义 truth。 |
| `CatalogEntryActive` 被解释为全局可消费 | 目录可见不等于消费材料可用。 |
| `CatalogViewCurrent` 反写 `MethodAssetDefinition` 或 `MethodAssetCatalogEntry` | view 是可重建读取材料,不是第二 truth。 |
| Query miss 自动创建 definition / catalog entry / catalog view | Query no-write。 |
| catalog view stale 时由 Query 触发 refresh | 刷新归 Operations Job 或明确 maintenance flow。 |
| 使用 search index、UI category、marketplace listing 推导 catalog 状态 | 这些不是本仓 catalog truth。 |
| 用 snapshot / fingerprint drift 替代 catalog view freshness | 当前不恢复 snapshot / fingerprint 主线。 |

#### R1.8.6 传播影响

| 来源状态变化 | 必须传播到 | 不允许传播到 |
|---|---|---|
| `DefinitionEstablished` | definition summary read surface、trace/audit lineage、definition changed event candidate、formalization eligibility input hint。 | formal version truth、consumption material truth、marketplace listing。 |
| `DefinitionUnderAdjustment` | trace/audit lineage、formalization re-evaluation hint、catalog view stale hint。 | existing formal version mutation、downstream runtime truth。 |
| `DefinitionRetired` | historical trace、catalog visibility decision、formalization / consumption follow-up checks。 | hard delete、existing trace removal。 |
| `CatalogEntryActive` / `CatalogEntryScopeLimited` | catalog view stale hint、catalog changed event candidate、catalog read surface。 | definition summary rewrite、formalization outcome。 |
| `CatalogEntryRetired` | catalog view stale hint、historical catalog trace。 | definition retired、formal version retired。 |
| `CatalogViewStale` / `CatalogViewUnavailable` | query freshness / unavailable surface、maintenance progress。 | catalog entry truth mutation、definition truth mutation。 |

#### R1.8.7 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| owner 是否回指 Step 6 | pass | `MethodAssetDefinition`、`MethodAssetCatalogEntry`、`MethodAssetCatalogView` 均有 Step 6 来源。 |
| 触发来源是否回指 Step 8 | pass | Command 与 refresh job 均来自 Step 8;Query 仅读取。 |
| 是否区分 truth 与 view | pass | definition / catalog entry 是 truth, catalog view 是派生读取材料。 |
| 是否写入状态定义表 | pass | 已写概要状态表,未下沉 enum / 字段。 |
| 是否写入流转图和迁移清单 | pass | 已写精简 ASCII 图和概要允许 / 禁止迁移。 |
| 是否保留后续闭口 | pass | retirement 类迁移已标注需后续显式 Command 闭口。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9。 |

next_allowed_action: 等待用户确认后进入 Step 9 `正式化与版本状态:先思考`;只思考 formalization state、formal version lifecycle、basis availability 的 owner 范围、状态组取舍、触发来源、传播风险和排除项,不得写完整状态定义表、状态流转图、允许 / 禁止迁移清单,不得修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.9 正式化与版本状态:先思考

#### R1.9.1 本模块问题

本模块只思考正式化与版本这一组成部分的状态范围。当前不写完整状态定义表、状态流转图、允许迁移清单或禁止迁移清单。

需要回答:

1. `FormalizationState`、`FormalMethodAssetVersion`、`FormalizationBasisSummary` 哪些状态语义必须进入 Step 9。
2. 正式化判断、正式版本成立、basis availability 如何分层。
3. 哪些 Command / Inbound 能触发状态变化,哪些 Query 只能读取。
4. 正式化和版本状态变化如何传播到受控消费、追溯、一致性保护和事件候选。
5. 哪些旧 publish / fingerprint / snapshot / governance gate 状态必须排除。

#### R1.9.2 当前来源判断

| owner | Step 6 来源 | Step 8 触发来源 | 初步状态职责 |
|---|---|---|---|
| `FormalizationState` | `5.6.3`;state object;状态词表来源。 | `EvaluateMethodAssetFormalization`;`EstablishFormalMethodAssetVersion`;version semantic change / retire commands。 | 表达定义是否已进入正式化判断、是否满足正式化资格、是否被拒绝、替代或退出。 |
| `FormalMethodAssetVersion` | `5.6.1`;core truth / version boundary。 | `EstablishFormalMethodAssetVersion`;`RecordFormalVersionSemanticChange`;`RetireFormalMethodAssetVersion`。 | 表达正式版本候选、激活、替代和退役,并保留稳定历史引用。 |
| `FormalizationBasisSummary` | `5.6.2`;summary / boundary object。 | `ConsumeFormalizationBasisSummaryAccepted`;外部摘要 / basis command;refresh hint。 | 表达正式化依据摘要是否可用、足够、过期或被拒绝。 |
| `FormalizationEligibilityRule` | `5.6.4`;policy / guard。 | formalization evaluation command 内部 guard。 | 不作为独立业务生命周期主线;只影响 formalization decision。 |

#### R1.9.3 状态组取舍

正式化与版本必须拆成三类状态语义:

| 状态组方向 | 是否进入后续写入 | 理由 |
|---|---|---|
| formalization decision state | yes | `FormalizationState` 是正式化判断结果,决定是否允许进入正式版本和受控消费链路。 |
| formal version lifecycle | yes | `FormalMethodAssetVersion` 是稳定版本边界,必须表达 candidate / active / superseded / retired 等生命周期。 |
| basis availability / acceptance | yes_limited | `FormalizationBasisSummary` 是判断输入,需要表达 accepted / insufficient / stale / rejected,但不能直接创建版本。 |
| eligibility rule lifecycle | no_as_primary_state | rule active / superseded / disabled 可作为 policy 背景,但本模块状态主线不以规则生命周期展开。 |
| formal version read material freshness | no_here | 正式版本读取材料刷新归后台维护与收敛状态,本模块只记录 refresh hint。 |

#### R1.9.4 触发来源思考

后续写入时应把触发来源限定为:

| 触发来源 | 可影响 | 不可影响 |
|---|---|---|
| `EvaluateMethodAssetFormalization` | 改写 `FormalizationState`,形成 accepted / rejected decision event candidate。 | 不自动创建 `FormalMethodAssetVersion`。 |
| `EstablishFormalMethodAssetVersion` | 建立 `FormalMethodAssetVersion`,并将允许的 `FormalizationState` 绑定到版本。 | 不改写 definition / catalog truth,不由 Query 隐式触发。 |
| `RecordFormalVersionSemanticChange` | 将旧正式版本标记为被显式语义变化替代,产生影响 / trace hint。 | 不使用 fingerprint / hash 漂移替代业务语义。 |
| `RetireFormalMethodAssetVersion` | 让正式版本退出新消费语境并保留历史追溯。 | 不删除既有消费材料、trace 或历史引用。 |
| `ConsumeFormalizationBasisSummaryAccepted` | 承接 body-free basis linkage / availability hint。 | 不直接调用正式化裁决,不创建正式版本。 |
| `GetFormalizationState` / `GetFormalMethodAssetVersion` / `ListConsumableFormalVersions` | 读取 formalization / version / availability surface。 | 不推进正式化、不刷新材料、不创建版本。 |
| `RefreshFormalVersionReadMaterials` | 后续维护读取材料 freshness。 | 不重做正式化裁决,不生成新 formal version。 |

#### R1.9.5 传播风险

正式化与版本状态会影响核心闭环中后续多个组成部分,但传播必须保持方向:

| 来源变化 | 可传播到 | 风险控制 |
|---|---|---|
| formalization pending / rejected | formalization read surface、trace / audit、event candidate、basis follow-up。 | 不生成 formal version,不进入 consumption material。 |
| formalization formalized | formal version establishment command 的前置、trace / audit、event candidate。 | 不自动创建 formal version;必须显式 Command。 |
| formal version active | consumption material preparation、relation / distribution、trace material、peripheral organization、read material refresh hint。 | 不等同下游已消费或同步成功。 |
| formal version superseded / retired | consumption impact hint、consistency protection、trace / audit、read material stale hint。 | 不删除历史版本,不自动修复下游。 |
| basis stale / rejected | formalization re-evaluation hint、external summary follow-up、read surface unavailable / insufficient。 | 不回滚已成立 definition truth;不执行 governance。 |

#### R1.9.6 排除项

本组成部分后续写入必须排除:

| 排除项 | 排除原因 |
|---|---|
| 旧 publish lifecycle | 会把正式化、版本、事件投递和消费发布混成一条旧主线。 |
| governance gate approved / rejected consumer | 本仓不执行治理 gate;只承接 body-free basis summary/ref。 |
| fingerprint / hash drift 作为版本状态 | 版本语义变化必须是显式业务事实,不是旧 fingerprint 机制。 |
| snapshot export / snapshot schema 状态 | 当前 formal version 不以 snapshot 包或导出状态为主线。 |
| Query / 下游使用隐式正式化 | 违反 Query no-write 和正式化显式 Command 边界。 |
| basis inbound 自动正式化 | 外部依据到达只是输入,不是业务裁决。 |
| Job 重做正式化或生成版本 | Operations Job 不修 core truth,不生成 formal version。 |

#### R1.9.7 下一写入批次边界

下一批 `正式化与版本状态:再写入` 可以写:

1. owner 到对象 / 触发来源映射。
2. 概要状态定义表。
3. 精简 ASCII 流转图。
4. 允许迁移和禁止迁移清单。
5. 传播影响表和停审记录。

不得写 Rust enum、字段全集、repository / port、DTO、DDL、版本号算法、hash、fingerprint、schema version、event payload、topic、outbox relay、worker、retry、正式 §9 回填草稿或 Step 10 异常边界。

#### R1.9.8 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 只思考 owner 范围、状态组取舍、触发来源、传播风险和排除项。 |
| 是否写完整状态定义表 | no | 未写状态类型 / 状态 / 含义 / 正常主线的完整表。 |
| 是否写状态流转图 | no | 未写 ASCII 状态图。 |
| 是否写允许 / 禁止迁移清单 | no | 只做触发来源和排除项思考,迁移清单留给再写入。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9 正式化与版本状态小循环。 |

next_allowed_action: 等待用户确认后进入 Step 9 `正式化与版本状态:再写入`;可写 owner 映射、概要状态定义表、精简 ASCII 流转图、允许 / 禁止迁移清单、传播影响表和停审记录,不得写 Rust enum、字段全集、repository / port、DTO、DDL、版本号算法、hash、fingerprint、schema version、event payload、topic、outbox relay、worker、retry,不得修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.10 正式化与版本状态:再写入

#### R1.10.1 owner 映射

| owner | Step 6 来源 | Step 8 / Step 7 触发来源 | 本模块状态职责 |
|---|---|---|---|
| `FormalizationState` | `5.6.3`;core state object。 | `EvaluateMethodAssetFormalizationEligibility`;`InitiateMethodAssetFormalization`;`EstablishFormalMethodAssetVersion`;version change / retire command。 | 表达正式化判断是否已发起、是否满足资格、是否阻断 / 拒绝、是否已绑定正式版本。 |
| `FormalMethodAssetVersion` | `5.6.1`;core truth / stable version boundary。 | `EstablishFormalMethodAssetVersion`;`RecordFormalVersionSemanticChange`;`SupersedeFormalMethodAssetVersion`;`RetireFormalMethodAssetVersion`。 | 表达正式版本 candidate / active / superseded / retired 生命周期,并保护稳定引用不漂移。 |
| `FormalizationBasisSummary` | `5.6.2`;support summary / basis boundary。 | 外部摘要与引用流形成 safe basis;formalization evaluation 只消费 basis refs。 | 表达依据摘要可用、缺失、不足、过期或被拒绝的判断输入,但不执行治理裁决。 |
| `FormalizationEligibilityRule` | `5.6.4`;policy / invariant。 | formalization eligibility evaluation guard。 | 只作为判断 guard,不成为独立生命周期 owner。 |

#### R1.10.2 状态定义表

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 |
|---|---|---|---|
| Formalization decision | `FormalizationNotStarted` | 方法资产定义 / 目录语境存在,但尚未显式发起正式化判断。 | 是,作为定义建立后的初始状态或未建状态的读取解释。 |
| Formalization decision | `FormalizationPending` | 已显式发起正式化,等待依据、资格判断或人工业务意图闭合。 | 是,但不得建立正式版本。 |
| Formalization decision | `FormalizationEligible` | 资格判断通过,可作为建立正式版本的前置输入。 | 是,但仍不是正式版本。 |
| Formalization decision | `FormalizationBlocked` | 依据缺失、边界不满足或规则不允许,当前不能继续正式化。 | 有条件,可在补齐依据或调整前置条件后重新评估。 |
| Formalization decision | `FormalizationRejected` | 显式判断该定义 / 目录语境不进入正式化。 | 否,除非后续以新依据重新发起。 |
| Formalization decision | `FormalizationFormalized` | 正式化状态已绑定一个正式版本引用。 | 是,但消费仍需受控消费材料和边界判断。 |
| Formal version lifecycle | `FormalVersionCandidate` | 已有建立正式版本的候选边界,等待 accepted command 完成。 | 有条件,不能对外作为可消费版本。 |
| Formal version lifecycle | `FormalVersionActive` | 正式版本已建立,可作为受控消费、关系、追溯和外围组织的稳定锚点。 | 是。 |
| Formal version lifecycle | `FormalVersionSuperseded` | 该版本被后续正式版本显式替代,历史引用保持有效。 | 否,不进入新消费;保留追溯和既有解释。 |
| Formal version lifecycle | `FormalVersionRetired` | 版本退出当前使用语境,不再作为新消费入口。 | 否,只保留历史和追溯。 |
| Basis availability | `BasisAccepted` | 依据摘要已通过 body-free 边界,可作为正式化判断输入。 | 是,但不自动正式化。 |
| Basis availability | `BasisInsufficient` | 依据摘要存在但不足以支持当前正式化判断。 | 有条件,补齐后可重新判断。 |
| Basis availability | `BasisStale` | 依据摘要可能落后于 definition / catalog / 外部摘要语境。 | 有条件,需要外部摘要刷新或重新评估。 |
| Basis availability | `BasisRejected` | 依据摘要违反边界或不能用于正式化。 | 否,不能作为建立正式版本输入。 |

#### R1.10.3 概要状态流转图

```text
+==============================================================+
|             Formalization / Formal Version State Flow         |
+==============================================================+
| FormalizationState                                           |
|   FormalizationNotStarted                                    |
|        | initiate formalization                              |
|        v                                                     |
|   FormalizationPending ---- eligibility blocked -----------> FormalizationBlocked |
|        | basis rejected / explicit reject                    |
|        +-----------------------------------------------> FormalizationRejected |
|        | eligibility accepted                               |
|        v                                                     |
|   FormalizationEligible                                      |
|        | establish formal version accepted                   |
|        v                                                     |
|   FormalizationFormalized                                    |
|                                                              |
| FormalizationBasisSummary                                    |
|   BasisAccepted ---- source/basis drift -------------------> BasisStale |
|        | insufficient for current rule                       |
|        v                                                     |
|   BasisInsufficient                                          |
|        | rejected by body-free / eligibility boundary        |
|        v                                                     |
|   BasisRejected                                              |
|                                                              |
| FormalMethodAssetVersion                                     |
|   FormalVersionCandidate                                     |
|        | establish accepted                                  |
|        v                                                     |
|   FormalVersionActive ---- semantic supersession ----------> FormalVersionSuperseded |
|        | explicit retire                                     |
|        v                                                     |
|   FormalVersionRetired                                       |
+==============================================================+
```

关键说明:

- `FormalizationEligible` 只是前置判断通过,不能被读作 `FormalVersionActive`。
- `FormalizationFormalized` 必须绑定 `FormalMethodAssetVersionRef`;绑定动作来自显式建立正式版本 Command。
- `BasisAccepted` 只是输入可用,不代表治理已执行、审批已通过或版本已成立。
- `FormalVersionSuperseded` 与 `FormalVersionRetired` 都不删除历史引用,也不重写下游已持有的正式版本 ref。
- `BasisStale` 或 `BasisInsufficient` 可以触发重新评估提示,但不能由 Query 或 Job 直接改写正式化结果。

#### R1.10.4 允许迁移清单

| owner | 允许迁移 | 触发动作 |
|---|---|---|
| `FormalizationState` | absent / `FormalizationNotStarted -> FormalizationPending` | `InitiateMethodAssetFormalization` accepted。 |
| `FormalizationState` | `FormalizationPending -> FormalizationEligible` | `EvaluateMethodAssetFormalizationEligibility` accepted with eligible decision。 |
| `FormalizationState` | `FormalizationPending -> FormalizationBlocked` | eligibility evaluation 发现 basis missing、boundary blocked 或 rule not satisfied。 |
| `FormalizationState` | `FormalizationPending / FormalizationBlocked -> FormalizationRejected` | explicit rejected decision with safe reason。 |
| `FormalizationState` | `FormalizationBlocked -> FormalizationPending` | 新 basis / definition / catalog 条件到达后显式重新发起。 |
| `FormalizationState` | `FormalizationEligible -> FormalizationFormalized` | `EstablishFormalMethodAssetVersion` accepted and version ref bound。 |
| `FormalizationBasisSummary` | create -> `BasisAccepted` | 外部摘要与引用边界形成 safe body-free basis summary。 |
| `FormalizationBasisSummary` | `BasisAccepted -> BasisStale` | definition / catalog / external summary 变化使 basis 需要复核。 |
| `FormalizationBasisSummary` | `BasisAccepted / BasisStale -> BasisInsufficient` | eligibility rule 判断该 basis 不足。 |
| `FormalizationBasisSummary` | `BasisAccepted / BasisStale / BasisInsufficient -> BasisRejected` | body-free boundary 或正式化规则判定不能使用。 |
| `FormalMethodAssetVersion` | create -> `FormalVersionCandidate` | 建立正式版本命令准备 accepted boundary。 |
| `FormalMethodAssetVersion` | `FormalVersionCandidate -> FormalVersionActive` | `EstablishFormalMethodAssetVersion` accepted。 |
| `FormalMethodAssetVersion` | `FormalVersionActive -> FormalVersionSuperseded` | `SupersedeFormalMethodAssetVersion` accepted 或 semantic change 后显式替代。 |
| `FormalMethodAssetVersion` | `FormalVersionActive -> FormalVersionRetired` | `RetireFormalMethodAssetVersion` accepted。 |

#### R1.10.5 禁止迁移清单

| 禁止迁移或行为 | 原因 |
|---|---|
| `FormalizationNotStarted -> FormalVersionActive` | 正式版本必须经过 formalization initiation / eligibility / establish command。 |
| `FormalizationEligible` 被消费方直接当作可消费正式版本 | eligibility 不是 version truth,消费必须锚定 `FormalMethodAssetVersion`。 |
| `BasisAccepted` 自动创建 `FormalizationFormalized` 或 `FormalVersionActive` | basis 只是输入,不是业务裁决。 |
| `FormalizationRejected` 由 Query、cache miss 或读取失败产生 | 拒绝必须来自显式业务判断或资格评估。 |
| `RecordFormalVersionSemanticChange` 原地覆盖 `FormalVersionActive` 含义 | 版本稳定引用不得漂移;语义变化需建立 candidate / supersession 线索。 |
| `FormalVersionSuperseded` / `FormalVersionRetired` 删除历史 trace、audit、history 或消费材料引用 | 历史版本仍需解释既有消费和追溯。 |
| 使用 fingerprint、hash、snapshot drift 判定版本替代 | 当前版本迁移只承认显式业务语义变化。 |
| 由受控消费、关系分发、外围 package 或 marketplace 使用隐式建立正式版本 | 下游使用不是正式化触发。 |
| Operations Job 刷新 read material 时改写 `FormalizationState` 或 `FormalMethodAssetVersion` | Job 只刷新材料和可见性,不修 core truth。 |

#### R1.10.6 传播影响

| 来源状态变化 | 必须传播到 | 不允许传播到 |
|---|---|---|
| `FormalizationPending` | formalization read surface、trace / history、event candidate。 | formal version truth、consumption material、downstream use。 |
| `FormalizationEligible` | establish formal version 前置、formalization decision event candidate、trace / audit。 | 直接消费、关系分发 active binding、外围 package current version。 |
| `FormalizationBlocked` / `FormalizationRejected` | diagnostic read surface、basis follow-up、trace / audit、event candidate。 | 自动创建 version、自动 retire definition、下游运行状态。 |
| `FormalizationFormalized` | formal version establishment result、controlled consumption preparation hint、trace / relation / maintenance refresh hint。 | 跳过 consumption boundary、声明下游已同步。 |
| `BasisStale` / `BasisInsufficient` / `BasisRejected` | formalization re-evaluation hint、external summary follow-up、read material stale / unavailable surface。 | 回滚 definition / catalog truth、删除历史 version。 |
| `FormalVersionActive` | consumption material preparation、relation / distribution、trace material、peripheral organization、read material refresh hint。 | 下游 runtime truth、outbox delivery 状态、marketplace publish 状态。 |
| `FormalVersionSuperseded` / `FormalVersionRetired` | consumption impact summary、consistency protection evaluation、trace / audit、read material stale hint、peripheral organization update hint。 | hard delete、旧 ref 改义、自动修复所有下游。 |

#### R1.10.7 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| owner 是否回指 Step 6 | pass | `FormalizationState`、`FormalMethodAssetVersion`、`FormalizationBasisSummary` 和 `FormalizationEligibilityRule` 均来自 Step 6。 |
| 触发来源是否回指 Step 7 / Step 8 | pass | 使用 eligibility / initiation / establish / semantic change / supersede / retire 等当前接口与处理流。 |
| 是否区分正式化判断与正式版本 | pass | `FormalizationEligible` 与 `FormalVersionActive` 明确分离。 |
| 是否区分 basis 与裁决 | pass | basis availability 只作为输入状态,不自动创建版本。 |
| 是否写入状态定义表 | pass | 已写概要状态表,未写 Rust enum 或字段全集。 |
| 是否写入流转图和迁移清单 | pass | 已写精简 ASCII 图和概要允许 / 禁止迁移。 |
| 是否排除旧 publish / fingerprint / snapshot | pass | 禁止迁移清单已明确排除。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9。 |

next_allowed_action: 等待用户确认后进入 Step 9 `受控消费状态:先思考`;只思考 consumption material、availability view、downstream boundary 和 definition-use guard 的 owner 范围、状态组取舍、触发来源、传播风险和排除项,不得写完整状态定义表、状态流转图、允许 / 禁止迁移清单,不得修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.11 受控消费状态:先思考

#### R1.11.1 本模块问题

本模块只思考受控消费这一组成部分的状态范围。当前不写完整状态定义表、状态流转图、允许迁移清单或禁止迁移清单。

需要回答:

1. `MethodAssetConsumptionMaterial`、`MethodAssetAvailabilityView`、`DownstreamConsumptionBoundary`、`DefinitionUseBoundaryGuard` 哪些状态语义必须进入 Step 9。
2. 消费材料 readiness / freshness、availability view、downstream boundary、Definition vs Use guard violation 如何分层。
3. 哪些 Command 能触发状态变化,哪些 Query 只能读取或解析 typed context。
4. 正式版本变化、边界变化和材料状态变化如何传播到追溯、一致性保护、关系分发、外围组织和后台维护。
5. 哪些旧 snapshot、publish sync、cache hit、下游 runtime、鉴权矩阵和 refresh job 状态必须排除。

#### R1.11.2 当前来源判断

| owner | Step 6 来源 | Step 8 / Step 7 触发来源 | 初步状态职责 |
|---|---|---|---|
| `MethodAssetConsumptionMaterial` | `views_materials` C2;read material / boundary carrier;`MethodAssetConsumptionReadMaterial` 已并入。 | `PrepareMethodAssetConsumptionMaterial`;`MarkMethodAssetConsumptionMaterialState`;formal version / boundary changed hint。 | 表达消费材料是否 ready、stale、blocked、unavailable,以及材料是否仍锚定正式版本和消费边界。 |
| `MethodAssetAvailabilityView` | `views_materials` C3;projection / availability view;`MethodAssetAvailabilityState` 词表 owner。 | material prepared / state marker;availability derivation changed;后台维护刷新 hint。 | 表达指定 formal version + consumption context 下的 available、pending convergence、not available、stale、unavailable 读取线索。 |
| `DownstreamConsumptionBoundary` | `policies_guards` B2;boundary object。 | `RegisterDownstreamConsumptionBoundary`;`AdjustDownstreamConsumptionBoundary`;boundary changed event candidate。 | 表达消费语境的边界是否 active、scope-limited、suspended / retired 或 adjusted。 |
| `DefinitionUseBoundaryGuard` | `policies_guards` B1;guard / boundary。 | `RecordDefinitionUseBoundaryViolation`;material prepare guard;diagnostic Query。 | 表达 Definition vs Use 越界线索是否已记录、是否阻断当前消费或需要追溯 / 一致性保护承接。 |
| `ConsumptionContextRef` | typed ref / boundary ref family。 | `ResolveConsumptionContextRef`;boundary register / query。 | 不作为独立生命周期状态 owner;只作为状态定位维度和 typed selector。 |

#### R1.11.3 状态组取舍

受控消费状态后续写入应拆成四类状态语义:

| 状态组方向 | 是否进入后续写入 | 理由 |
|---|---|---|
| consumption material readiness / freshness | yes | `MethodAssetConsumptionMaterial` 是正式版本进入下游读取前的受控材料,必须表达 ready / stale / blocked / unavailable。 |
| availability view state | yes | `MethodAssetAvailabilityView` 是下游读取最常接触的状态面,必须区分 available、pending convergence、not available、stale、unavailable。 |
| downstream boundary disposition | yes | `DownstreamConsumptionBoundary` 是消费前置边界,active / limited / suspended 等状态会影响材料准备和读取。 |
| definition-use violation disposition | yes_limited | guard violation 需要表达 noticed / blocked / handoff,但完整 trace / audit / protection 交给后续组成部分。 |
| consumption context resolution | no_as_primary_state | context ref 是 typed 定位维度,解析失败可作为 Query diagnostic,不成为主生命周期。 |
| consumption material refresh job progress | no_here | refresh / repair / convergence progress 属于后台维护与收敛状态,本模块只记录 stale / pending hint。 |
| downstream runtime / sync / auth state | no | 本仓不保存下游安装、同步、运行、授权矩阵、token、role 或 policy engine 状态。 |

#### R1.11.4 触发来源思考

后续写入时应把触发来源限定为:

| 触发来源 | 可影响 | 不可影响 |
|---|---|---|
| `RegisterDownstreamConsumptionBoundary` | 建立 boundary active / scope-limited 等初始 disposition,并可产生 boundary changed candidate。 | 不创建 formal version,不写鉴权实现,不保存下游运行 truth。 |
| `AdjustDownstreamConsumptionBoundary` | 改变 boundary disposition 或 allowed / forbidden use summary,并使相关 material / availability 进入 stale 或 not available hint。 | 不修改 formal version truth、definition truth 或下游仓状态。 |
| `PrepareMethodAssetConsumptionMaterial` | 生成 / 更新 `MethodAssetConsumptionMaterial` ready 状态,并可更新 availability hint。 | 不复制 definition body,不生成旧 snapshot,不隐式正式化。 |
| `MarkMethodAssetConsumptionMaterialState` | 标记 material stale / blocked / unavailable,并传播 availability changed hint。 | 不修复来源 truth,不启动 refresh job,不扩大 consumption boundary。 |
| `RecordDefinitionUseBoundaryViolation` | 记录 body-free violation noticed / blocked 线索,给 trace / audit / consistency protection handoff。 | 不保存原始请求、payload、raw log、证据正文,不自动修复。 |
| `GetMethodAssetConsumptionMaterial` / `GetMethodAssetAvailabilityView` / `GetDownstreamConsumptionBoundary` / diagnostic Queries | 读取 material、availability、boundary、guard diagnostic。 | 不创建材料,不刷新 view,不推进状态,不把 cache hit 当正式消费成立。 |
| `FormalMethodAssetVersionEstablished / Changed / Retired` | 作为受控消费材料准备、stale、impact hint 的上游来源。 | 不自动生成 consumption material,不绕过 boundary / guard。 |
| 后台维护 read material refresh | 后续可把 stale / pending convergence 收敛为 available / current。 | 不在本模块定义 job 状态、worker、retry、queue 或修复算法。 |

#### R1.11.5 传播风险

受控消费状态会影响下游读取和后续保护链路,但传播方向必须保持受控:

| 来源变化 | 可传播到 | 风险控制 |
|---|---|---|
| boundary registered / adjusted | material stale / blocked hint、availability view、boundary changed event candidate、trace / audit。 | 不改变 formal version / definition truth,不声明下游已授权或已同步。 |
| material ready | consumption material read surface、availability available hint、trace subject hint、event candidate。 | 不表示下游已安装、运行、执行或保存私有副本。 |
| material stale / unavailable | availability stale / unavailable、maintenance refresh request hint、consistency protection diagnostic。 | 不回滚 formal version,不自动修复。 |
| material blocked / not available for context | guard diagnostic、trace / audit handoff、boundary violation event candidate。 | 不把 blocked 解读成正式版本无效或 definition retired。 |
| availability pending convergence | query read surface、maintenance progress / refresh hint。 | 不向下游承诺可消费,不隐藏来源 truth 已成立。 |
| definition-use violation noticed | trace / audit、consistency protection、safe violation event candidate。 | 不保存原始 payload,不把 violation 自动变成 boundary adjustment。 |

#### R1.11.6 排除项

本组成部分后续写入必须排除:

| 排除项 | 排除原因 |
|---|---|
| `MethodAssetConsumptionReadMaterial` 独立状态 | Step 6 已裁决并入 `MethodAssetConsumptionMaterial`;恢复会制造双主语。 |
| 旧 snapshot / export package / publish sync 状态 | 当前消费材料不是同步包、导出物或发布状态。 |
| 下游 runtime / install / sync success 状态 | 本仓只表达消费边界和读取材料,不拥有下游运行事实。 |
| 鉴权矩阵、token、role、policy engine 状态 | `DownstreamConsumptionBoundary` 只保存安全摘要,不实现鉴权系统。 |
| Query miss 自动创建 material 或 availability view | 违反 Query no-write 和受控消费显式 Command 边界。 |
| cache hit 代表可消费或正式版本成立 | cache / view 命中不是 truth,也不能替代 boundary / guard。 |
| material stale 自动触发 refresh job 状态 | refresh / repair / progress 留给后台维护与收敛。 |
| guard violation 保存原始请求或证据正文 | 当前只允许 body-free safe violation / reason ref。 |
| boundary blocked 自动 retire formal version 或 definition | 消费边界阻断不等于来源 truth 失效。 |

#### R1.11.7 下一写入批次边界

下一批 `受控消费状态:再写入` 可以写:

1. owner 到对象 / 触发来源映射。
2. 概要状态定义表。
3. 精简 ASCII 流转图。
4. 允许迁移和禁止迁移清单。
5. 传播影响表和停审记录。

不得写 Rust enum、字段全集、repository / port、DTO、DDL、鉴权规则矩阵、token / role、policy engine、下游运行状态、snapshot/export、worker、retry、queue、refresh algorithm、event payload、topic、outbox relay、正式 §9 回填草稿或 Step 10 异常边界。

#### R1.11.8 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 只思考 owner 范围、状态组取舍、触发来源、传播风险和排除项。 |
| 是否写完整状态定义表 | no | 未写状态类型 / 状态 / 含义 / 正常主线的完整表。 |
| 是否写状态流转图 | no | 未写 ASCII 状态图。 |
| 是否写允许 / 禁止迁移清单 | no | 只做触发来源和排除项思考,迁移清单留给再写入。 |
| 是否以当前 R1 接口为准 | pass | 使用 `RegisterDownstreamConsumptionBoundary`、`PrepareMethodAssetConsumptionMaterial`、`MarkMethodAssetConsumptionMaterialState` 等当前接口,未恢复旧 snapshot / publish sync 主线。 |
| 是否区分 material / availability / boundary / guard | pass | 四类 owner 已分层,context ref 只作为定位维度。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9 受控消费状态小循环。 |

next_allowed_action: 等待用户确认后进入 Step 9 `受控消费状态:再写入`;可写 owner 映射、概要状态定义表、精简 ASCII 流转图、允许 / 禁止迁移清单、传播影响表和停审记录,不得写 Rust enum、字段全集、repository / port、DTO、DDL、鉴权规则矩阵、token / role、policy engine、下游运行状态、snapshot/export、worker、retry、queue、refresh algorithm、event payload、topic、outbox relay,不得修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.12 受控消费状态:再写入

#### R1.12.1 owner 映射

| owner | Step 6 来源 | Step 8 / Step 7 触发来源 | 本模块状态职责 |
|---|---|---|---|
| `MethodAssetConsumptionMaterial` | `views_materials` C2;read material / boundary carrier。 | `PrepareMethodAssetConsumptionMaterial`;`MarkMethodAssetConsumptionMaterialState`;formal version / boundary changed hint。 | 表达正式消费材料 ready、stale、blocked、unavailable,并保持材料锚定 formal version 与 boundary。 |
| `MethodAssetAvailabilityView` | `views_materials` C3;availability projection / state view。 | material prepared / state marker;availability derivation changed;read material refresh hint。 | 表达指定 formal version + consumption context 的可用性读取状态。 |
| `DownstreamConsumptionBoundary` | `policies_guards` B2;boundary object。 | `RegisterDownstreamConsumptionBoundary`;`AdjustDownstreamConsumptionBoundary`。 | 表达消费语境边界 active、scope-limited、suspended、retired 或 adjusted。 |
| `DefinitionUseBoundaryGuard` | `policies_guards` B1;guard / boundary。 | `RecordDefinitionUseBoundaryViolation`;material prepare guard;diagnostic Query。 | 表达 Definition vs Use 越界线索 noticed、blocked、handoff 或 dismissed。 |
| `ConsumptionContextRef` | typed ref / boundary ref family。 | `ResolveConsumptionContextRef`;boundary register / query。 | 作为状态定位维度,不单独成为生命周期 owner。 |

#### R1.12.2 状态定义表

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 |
|---|---|---|---|
| Consumption material | `ConsumptionMaterialReady` | 材料已由正式版本和消费边界派生,可按当前语境受控读取。 | 是,但不等于下游已同步或运行。 |
| Consumption material | `ConsumptionMaterialStale` | 来源 formal version、definition safe summary、boundary 或 context 条件变化后,材料等待刷新或复核。 | 有条件,读取必须暴露 stale。 |
| Consumption material | `ConsumptionMaterialBlocked` | 当前消费语境被 boundary 或 guard 阻断,不得输出正式消费材料。 | 否,只可作为阻断解释。 |
| Consumption material | `ConsumptionMaterialUnavailable` | 材料暂不可用或读取材料缺失,来源 truth 不受影响。 | 否,只可作为不可用提示。 |
| Availability view | `AvailableForConsumption` | 当前 formal version + context 可读取正式消费材料。 | 是,仍受 boundary / guard 约束。 |
| Availability view | `PendingConvergence` | 来源 truth 已成立,但 material / availability 仍在收敛。 | 有条件,不得承诺可消费。 |
| Availability view | `NotAvailableForContext` | 当前 context 不满足 boundary 或 guard 要求。 | 否。 |
| Availability view | `AvailabilityStale` | 可用性视图落后于 material、formal version 或 boundary 变化。 | 有条件,读取必须暴露 stale。 |
| Availability view | `AvailabilityUnavailable` | 可用性视图暂不可读或缺失。 | 否,不改变来源 truth。 |
| Boundary disposition | `ConsumptionBoundaryActive` | 消费边界已建立,允许在声明范围内使用。 | 是。 |
| Boundary disposition | `ConsumptionBoundaryScopeLimited` | 边界只允许受限范围、受限 context 或受限 use kind。 | 是,但 material / query 必须暴露限制。 |
| Boundary disposition | `ConsumptionBoundarySuspended` | 边界暂时挂起,需停止新材料准备或返回不可用。 | 否。 |
| Boundary disposition | `ConsumptionBoundaryRetired` | 边界退出当前使用语境,保留历史解释。 | 否。 |
| Guard violation | `DefinitionUseViolationNoticed` | 已记录 body-free 越界线索。 | 有条件,用于诊断和追溯。 |
| Guard violation | `DefinitionUseViolationBlocking` | 越界线索阻断当前 material prepare / read。 | 否,需 safe reason。 |
| Guard violation | `DefinitionUseViolationHandedOff` | 越界线索已交给 trace / audit / consistency protection 承接。 | 有条件,不代表已修复。 |
| Guard violation | `DefinitionUseViolationDismissed` | 经安全判断该线索不再阻断当前消费。 | 有条件,需保留历史解释。 |

#### R1.12.3 概要状态流转图

```text
+==============================================================+
|               Controlled Consumption State Flow               |
+==============================================================+
| DownstreamConsumptionBoundary                                |
|   <register boundary>                                        |
|        |                                                     |
|        v                                                     |
|   ConsumptionBoundaryActive ---- adjust scope -------------> ConsumptionBoundaryScopeLimited |
|        | suspend / retire                                   |
|        +-------------------------------> ConsumptionBoundarySuspended |
|        +-------------------------------> ConsumptionBoundaryRetired   |
|                                                              |
| MethodAssetConsumptionMaterial                               |
|   <prepare material with active/limited boundary>            |
|        |                                                     |
|        v                                                     |
|   ConsumptionMaterialReady ---- source/boundary changed ---> ConsumptionMaterialStale |
|        | guard or boundary blocks                            |
|        +-------------------------------> ConsumptionMaterialBlocked   |
|        | read material missing / unavailable                  |
|        +-------------------------------> ConsumptionMaterialUnavailable |
|                                                              |
| MethodAssetAvailabilityView                                  |
|   AvailableForConsumption ---- source stale ---------------> AvailabilityStale |
|        | material not yet converged                          |
|        +-------------------------------> PendingConvergence  |
|        | boundary / guard forbids                            |
|        +-------------------------------> NotAvailableForContext |
|        | view missing / temporarily unavailable              |
|        +-------------------------------> AvailabilityUnavailable |
|                                                              |
| DefinitionUseBoundaryGuard                                   |
|   DefinitionUseViolationNoticed                              |
|        | blocking violation                                  |
|        v                                                     |
|   DefinitionUseViolationBlocking ---- handoff -------------> DefinitionUseViolationHandedOff |
|        | safe dismissal                                      |
|        +-------------------------------> DefinitionUseViolationDismissed |
+==============================================================+
```

关键说明:

- `AvailableForConsumption` 只能表示本仓读取材料可用,不能表示下游已安装、已同步、已运行或已授权。
- `ConsumptionMaterialReady` 必须锚定正式版本和消费边界;不能从 definition、cache hit 或 snapshot 直接生成。
- `ConsumptionBoundaryScopeLimited` 仍可进入正常读取主线,但所有 material / availability surface 必须暴露限制。
- `DefinitionUseViolationHandedOff` 是追溯 / 审计 / 保护承接完成,不是自动修复完成。
- `PendingConvergence` 和 `AvailabilityStale` 可提示后台维护,但本模块不定义 job progress。

#### R1.12.4 允许迁移清单

| owner | 允许迁移 | 触发动作 |
|---|---|---|
| `DownstreamConsumptionBoundary` | create -> `ConsumptionBoundaryActive` | `RegisterDownstreamConsumptionBoundary` accepted。 |
| `DownstreamConsumptionBoundary` | `ConsumptionBoundaryActive -> ConsumptionBoundaryScopeLimited` | `AdjustDownstreamConsumptionBoundary` accepted with limited scope / use kind。 |
| `DownstreamConsumptionBoundary` | `ConsumptionBoundaryScopeLimited -> ConsumptionBoundaryActive` | boundary adjustment 恢复 broader allowed scope。 |
| `DownstreamConsumptionBoundary` | `ConsumptionBoundaryActive / ConsumptionBoundaryScopeLimited -> ConsumptionBoundarySuspended` | boundary adjustment with suspension reason。 |
| `DownstreamConsumptionBoundary` | `ConsumptionBoundaryActive / ConsumptionBoundaryScopeLimited / ConsumptionBoundarySuspended -> ConsumptionBoundaryRetired` | explicit boundary retirement / replacement decision;后续详细设计闭口。 |
| `MethodAssetConsumptionMaterial` | create -> `ConsumptionMaterialReady` | `PrepareMethodAssetConsumptionMaterial` accepted with valid formal version + boundary + guard。 |
| `MethodAssetConsumptionMaterial` | `ConsumptionMaterialReady -> ConsumptionMaterialStale` | formal version、definition safe summary、boundary 或 context 条件变化。 |
| `MethodAssetConsumptionMaterial` | `ConsumptionMaterialReady / ConsumptionMaterialStale -> ConsumptionMaterialBlocked` | boundary / guard 判断当前 context 不允许。 |
| `MethodAssetConsumptionMaterial` | `ConsumptionMaterialReady / ConsumptionMaterialStale -> ConsumptionMaterialUnavailable` | material missing、read material unavailable 或安全原因不可读。 |
| `MethodAssetConsumptionMaterial` | `ConsumptionMaterialStale / ConsumptionMaterialUnavailable -> ConsumptionMaterialReady` | 后续 read material refresh 或显式 prepare 成功。 |
| `MethodAssetAvailabilityView` | create / refresh -> `AvailableForConsumption` | ready material 可读且 boundary / guard 允许。 |
| `MethodAssetAvailabilityView` | `AvailableForConsumption -> AvailabilityStale` | material、boundary、formal version 或 context 变化。 |
| `MethodAssetAvailabilityView` | `AvailableForConsumption / AvailabilityStale -> PendingConvergence` | 来源 truth 已成立但 material / view 仍在收敛。 |
| `MethodAssetAvailabilityView` | any current state -> `NotAvailableForContext` | boundary / guard 判定 context 不可消费。 |
| `MethodAssetAvailabilityView` | any current state -> `AvailabilityUnavailable` | availability view 暂不可用或缺失。 |
| `DefinitionUseBoundaryGuard` | create / detect -> `DefinitionUseViolationNoticed` | `RecordDefinitionUseBoundaryViolation` accepted with safe violation summary。 |
| `DefinitionUseBoundaryGuard` | `DefinitionUseViolationNoticed -> DefinitionUseViolationBlocking` | guard 判定越界阻断当前消费。 |
| `DefinitionUseBoundaryGuard` | `DefinitionUseViolationBlocking -> DefinitionUseViolationHandedOff` | trace / audit / consistency protection 接收 safe handoff。 |
| `DefinitionUseBoundaryGuard` | `DefinitionUseViolationNoticed / DefinitionUseViolationBlocking -> DefinitionUseViolationDismissed` | safe diagnostic 判定不再阻断当前消费。 |

#### R1.12.5 禁止迁移清单

| 禁止迁移或行为 | 原因 |
|---|---|
| formal version established 自动进入 `ConsumptionMaterialReady` | 正式版本存在只是前提,必须经过 boundary / guard 和 material prepare。 |
| Query miss 自动创建 material / availability view | Query no-write;材料生成必须走显式 Command 或后续维护流。 |
| cache hit / index hit 直接标记 `AvailableForConsumption` | cache / index 不是 truth,不能替代 boundary、guard 和 material 状态。 |
| `ConsumptionMaterialReady` 保存定义正文全集、外部正文或旧 snapshot 包 | 消费材料是只读摘要 / ref,不是下游私有定义副本。 |
| `AvailabilityStale` 反向修改 formal version、definition 或 boundary | availability 是派生 view,不能修来源 truth。 |
| `ConsumptionBoundarySuspended` 自动 retire formal version 或 definition | boundary 状态不等于来源 truth 失效。 |
| guard violation 保存原始请求、下游 payload、raw log 或证据正文 | 当前只允许 body-free safe violation / reason ref。 |
| guard violation 自动调整 boundary 或 material refresh | violation 只是线索和阻断,调整 / 刷新需显式流程。 |
| 将 token、role、auth matrix、policy engine 状态写入 boundary | boundary 只表达安全摘要和消费语境,不实现鉴权系统。 |
| 将下游安装、同步、运行、展示或交易状态写入受控消费状态 | 这些不是本仓 truth。 |
| 恢复独立 `MethodAssetConsumptionReadMaterial` 状态 | Step 6 已裁决并入 `MethodAssetConsumptionMaterial`。 |

#### R1.12.6 传播影响

| 来源状态变化 | 必须传播到 | 不允许传播到 |
|---|---|---|
| `ConsumptionBoundaryActive` / `ConsumptionBoundaryScopeLimited` | material prepare 前置、availability view、boundary changed event candidate、trace / audit。 | formal version truth、definition truth、下游授权实现。 |
| `ConsumptionBoundarySuspended` / `ConsumptionBoundaryRetired` | material blocked / unavailable hint、availability not available、consistency protection diagnostic、event candidate。 | 自动删除 material、自动 retire formal version、下游运行状态。 |
| `ConsumptionMaterialReady` | material read surface、availability available hint、trace subject hint、event candidate、peripheral organization hint。 | 下游已同步 / 已安装 / 已运行声明。 |
| `ConsumptionMaterialStale` | availability stale、maintenance refresh request hint、consistency protection diagnostic。 | 自动刷新 job 状态、来源 truth 修复。 |
| `ConsumptionMaterialBlocked` / `ConsumptionMaterialUnavailable` | guard diagnostic、availability unavailable / not available、trace / audit handoff、safe event candidate。 | definition retired、formal version invalid、boundary 自动调整。 |
| `AvailableForConsumption` | controlled read surface、relation / distribution read hint、peripheral discovery hint。 | marketplace listing、交易、安装、履约或下游运行成功。 |
| `PendingConvergence` / `AvailabilityStale` / `AvailabilityUnavailable` | maintenance progress / refresh hint、query freshness surface。 | 隐藏 truth 已成立、自动修复或自动重试。 |
| `DefinitionUseViolationNoticed` / `DefinitionUseViolationBlocking` | trace / audit、consistency protection、safe violation event candidate。 | raw payload 保存、自动修复、自动处罚或鉴权配置变更。 |
| `DefinitionUseViolationHandedOff` / `DefinitionUseViolationDismissed` | audit history、diagnostic read surface、protection follow-up。 | 删除 violation history、改写 boundary history。 |

#### R1.12.7 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| owner 是否回指 Step 6 | pass | material、availability、boundary、guard 均来自 Step 6;context ref 只作为定位维度。 |
| 触发来源是否回指 Step 7 / Step 8 | pass | 使用 boundary register / adjust、material prepare / state marker、violation record 和当前 Query。 |
| 是否区分 material / availability / boundary / guard | pass | 四类状态分别定义,未混写。 |
| 是否排除下游运行 truth 和鉴权实现 | pass | 禁止迁移清单已排除 token、role、auth matrix、policy engine、runtime / sync 状态。 |
| 是否排除旧 snapshot / publish sync | pass | 消费材料不恢复 snapshot/export/publish sync 主线。 |
| 是否写入状态定义表 | pass | 已写概要状态表,未写 Rust enum 或字段全集。 |
| 是否写入流转图和迁移清单 | pass | 已写精简 ASCII 图和概要允许 / 禁止迁移。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9。 |

next_allowed_action: 等待用户确认后进入 Step 9 `追溯与一致性保护状态:先思考`;只思考 trace material、impact summary、consistency protection、audit / evidence lineage 的 owner 范围、状态组取舍、触发来源、传播风险和排除项,不得写完整状态定义表、状态流转图、允许 / 禁止迁移清单,不得修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.13 追溯与一致性保护状态:先思考

#### R1.13.1 本模块问题

本模块只思考追溯与一致性保护这一组成部分的状态范围。当前不写完整状态定义表、状态流转图、允许迁移清单或禁止迁移清单。

需要回答:

1. `MethodAssetTraceMaterial`、`ConsumptionImpactSummary`、`ConsistencyProtectionPolicy`、`MethodAssetAuditTrail`、`MethodAssetEvidenceLineage` 哪些状态语义必须进入 Step 9。
2. trace material freshness / completeness、impact disposition、protection decision、audit / evidence lineage completeness 如何分层。
3. 哪些 Command 能触发状态变化,哪些 Query 只能读取安全摘要。
4. 受控消费、正式版本、关系分发、外部摘要和后台维护如何影响本模块状态。
5. 哪些 raw log、event payload、trace span、report body、evidence body、worker / recovery 状态必须排除。

#### R1.13.2 当前来源判断

| owner | Step 6 来源 | Step 8 / Step 7 触发来源 | 初步状态职责 |
|---|---|---|---|
| `MethodAssetTraceMaterial` | `views_materials` C4;trace material。 | `OrganizeMethodAssetTraceMaterial`;`MarkMethodAssetTraceMaterialState`;trace material refresh hint。 | 表达 trace material 是否 organized、ready、stale、incomplete 或 unavailable。 |
| `MethodAssetTraceView` | `views_materials` C5;projection / trace view。 | trace material changed;read material refresh hint。 | 可作为读取视图 freshness / partial availability 的补充,但不替代 trace material owner。 |
| `ConsumptionImpactSummary` | `core_truth` A8;support summary / impact boundary。 | `RegisterConsumptionImpactSummary`;`MarkConsumptionImpactDisposition`;formal version / consumption / relation changed hint。 | 表达 impact unknown、pending downstream summary、known、no known effect、superseded 等影响处置口径。 |
| `ConsumptionImpactView` | `views_materials` C6;projection / impact view。 | impact summary changed;trace material changed。 | 只表达影响读取视图的新鲜度和可用性,不拥有影响 truth。 |
| `ConsistencyProtectionPolicy` | `policies_guards` B5;policy / guard。 | `EstablishConsistencyProtectionDecision`;impact / trace input changed。 | 表达 protected、pending、unknown、required action 或 no-action 等保护判断状态。 |
| `MethodAssetAuditTrail` | `refs_trace_audit` D20;audit trail / safe audit material。 | `OrganizeMethodAssetAuditTrail`;history / lineage linked。 | 表达审计材料 organized、partial、stale、unsafe body rejected 或 unavailable。 |
| `MethodAssetEvidenceLineage` | `refs_trace_audit` D21;lineage / evidence handoff。 | `LinkMethodAssetEvidenceLineage`;external evidence lineage changed。 | 表达 lineage linked、partial、superseded、body rejected 或 unavailable。 |
| `ConsumptionTraceMaterial` | `refs_trace_audit` D19;consumption trace material / history。 | consumption material prepared;trace material organization。 | 作为正式消费回溯材料,可并入 trace material 状态讨论,不单独展开主生命周期。 |
| `TraceSubjectRef` / `ConsumptionImpactSourceRef` | typed ref family。 | trace / impact / audit / evidence Commands and Queries。 | 不作为独立生命周期状态 owner;只作为状态定位和来源边界。 |

#### R1.13.3 状态组取舍

追溯与一致性保护状态后续写入应拆成五类状态语义:

| 状态组方向 | 是否进入后续写入 | 理由 |
|---|---|---|
| trace material freshness / completeness | yes | `MethodAssetTraceMaterial` 是变化解释和保护判断的主要读取材料,必须表达 ready / stale / incomplete / unavailable。 |
| impact summary disposition | yes | `ConsumptionImpactSummary` 承接“影响已知 / 未知 / 待承接 / 被替代”口径,不能折叠进 trace 或 audit。 |
| consistency protection decision | yes | `ConsistencyProtectionPolicy` 的 protected / pending / unknown / no-action 直接决定是否需要后续维护或正式介入。 |
| audit trail safety / completeness | yes_limited | `MethodAssetAuditTrail` 要表达 safe audit material 是否 organized、partial、stale 或 body rejected;但不写 raw log 状态。 |
| evidence lineage completeness | yes_limited | `MethodAssetEvidenceLineage` 要表达 refs / digest hints 是否 linked、partial、superseded 或 rejected;不保存证据正文。 |
| trace / impact read view freshness | yes_limited | `MethodAssetTraceView`、`ConsumptionImpactView` 可作为读取 view freshness / partial availability,但不能成为第二 truth。 |
| recovery / refresh task progress | no_here | trace refresh、consistency recovery、maintenance progress 属于后台维护与收敛状态。 |
| raw log / telemetry / report / evidence body state | no | 这些正文和技术运行状态不进入本仓状态机。 |

#### R1.13.4 触发来源思考

后续写入时应把触发来源限定为:

| 触发来源 | 可影响 | 不可影响 |
|---|---|---|
| `OrganizeMethodAssetTraceMaterial` | 建立或更新 trace material organized / ready / incomplete 状态。 | 不修改 definition、formal version、relation、consumption truth;不保存 raw log。 |
| `MarkMethodAssetTraceMaterialState` | 标记 trace stale / incomplete / unavailable。 | 不启动 refresh job,不修复来源 truth。 |
| `RegisterConsumptionImpactSummary` | 登记 impact unknown / pending / known / no known effect 初始口径。 | 不扫描下游运行 truth,不保存下游 payload 或执行结果。 |
| `MarkConsumptionImpactDisposition` | 改变 impact disposition,例如 pending、known、dismissed、superseded。 | 不把 unknown 折叠为 no impact,不同步等待所有下游。 |
| `EstablishConsistencyProtectionDecision` | 建立 protected / pending / unknown / no-action / action required 判断。 | 不执行 recovery、告警、重试、worker 或维护任务。 |
| `OrganizeMethodAssetAuditTrail` | 组织 safe audit material、history refs、trace subject 和 lineage refs。 | 不保存 raw audit log、telemetry、metric、event payload、report body。 |
| `LinkMethodAssetEvidenceLineage` | 连接 external source refs、artifact archive refs、digest hints 和 lineage summary。 | 不保存 artifact 包体、archive 内容、证据文件正文、标准全文或验收报告正文。 |
| `GetMethodAssetTraceMaterial` / `GetConsumptionImpactSummary` / `GetConsistencyProtectionDiagnostic` / audit / lineage Queries | 读取 body-free summary、unknown / stale / unavailable / diagnostic。 | 不组织材料,不登记 impact,不建立 protection decision,不刷新材料。 |
| formal version changed / consumption material state changed / relation changed / external summary changed | 作为 trace stale、impact pending、protection re-evaluation 或 audit lineage update 的上游提示。 | 不自动生成完整 trace / audit / recovery 结果。 |
| 后台维护 trace refresh / consistency recovery | 后续可收敛 trace view、impact view、protection follow-up。 | 本模块不定义 task、run、worker、retry、queue、progress 或 recovery algorithm。 |

#### R1.13.5 传播风险

追溯与一致性保护状态会影响后续关系、分发、外部摘要、维护和验收材料,但传播必须保持 body-free 和 no repair:

| 来源变化 | 可传播到 | 风险控制 |
|---|---|---|
| trace material organized / ready | audit trail、impact view、protection decision、relation integrity input、event candidate。 | 不替代业务 truth,不携带 raw log。 |
| trace material stale / incomplete / unavailable | maintenance trace refresh hint、protection unknown / pending、query freshness。 | 不自动修复来源 truth,不启动 job 状态。 |
| impact unknown / pending downstream summary | protection pending / unknown、maintenance follow-up、read diagnostic。 | 不折叠为 no impact,不扫描下游 truth。 |
| impact known / no known effect | protection decision input、audit trail、event candidate。 | no known effect 必须带依据,不能声称全量下游已扫描。 |
| protection action required / pending | maintenance request hint、formal intervention hint、query diagnostic。 | 不执行 recovery,不写 worker / retry / alert 状态。 |
| protection no-action | audit / diagnostic surface、event candidate。 | 不因缺少 trace / impact 材料默认 no-action。 |
| audit trail organized / lineage linked | evidence lineage read surface、验收 / 审计 handoff、event candidate。 | 不保存 report body、evidence body 或 telemetry。 |
| evidence lineage superseded / partial / rejected | external summary follow-up、audit trail stale、maintenance hint。 | 不删除旧 lineage,不复制外部正文或 artifact body。 |

#### R1.13.6 排除项

本组成部分后续写入必须排除:

| 排除项 | 排除原因 |
|---|---|
| raw log / trace span / telemetry 状态 | 当前 trace / audit 只承接 body-free material 和 safe summary。 |
| event payload / outbox body / topic / relay 状态 | 事件候选只表达 fact,投递状态后置。 |
| report body / evidence file body / artifact body / archive 内容 | evidence lineage 只保存 refs、markers、digest hints。 |
| 下游运行状态、同步成功、UI 状态、member state、runtime binding | `ConsumptionImpactSummary` 不能拥有下游 truth。 |
| recovery / refresh / worker / retry / queue / maintenance run 状态 | 后台维护与收敛单独讨论。 |
| Query 自动组织 trace、登记 impact 或建立 protection decision | Query no-write。 |
| unknown impact 被写成 no impact | unknown 是正式状态,不得折叠。 |
| protection decision 自动修复 relation、consumption 或 formal version truth | protection 只判断边界和 required action,不执行修复。 |
| audit trail 替代业务 truth | audit 只解释变化线索,不决定当前 definition、version、relation 或 external summary。 |
| evidence lineage 替代外部来源 truth | 外部来源和 artifact/archive lifecycle 不归本对象拥有。 |

#### R1.13.7 下一写入批次边界

下一批 `追溯与一致性保护状态:再写入` 可以写:

1. owner 到对象 / 触发来源映射。
2. 概要状态定义表。
3. 精简 ASCII 流转图。
4. 允许迁移和禁止迁移清单。
5. 传播影响表和停审记录。

不得写 Rust enum、字段全集、repository / port、DTO、DDL、raw log、trace span、event payload、outbox body、report body、evidence body、artifact/archive body、worker、retry、queue、recovery algorithm、maintenance progress schema、topic、relay、正式 §9 回填草稿或 Step 10 异常边界。

#### R1.13.8 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 只思考 owner 范围、状态组取舍、触发来源、传播风险和排除项。 |
| 是否写完整状态定义表 | no | 未写状态类型 / 状态 / 含义 / 正常主线的完整表。 |
| 是否写状态流转图 | no | 未写 ASCII 状态图。 |
| 是否写允许 / 禁止迁移清单 | no | 只做触发来源和排除项思考,迁移清单留给再写入。 |
| 是否以当前 R1 接口为准 | pass | 使用 `OrganizeMethodAssetTraceMaterial`、`RegisterConsumptionImpactSummary`、`EstablishConsistencyProtectionDecision` 等当前接口,未恢复旧 `AcceptConsumptionImpactSummary` 命名。 |
| 是否保持 body-free 边界 | pass | 已排除 raw log、event payload、evidence body、report body 和 artifact/archive body。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9 追溯与一致性保护状态小循环。 |

next_allowed_action: 等待用户确认后进入 Step 9 `追溯与一致性保护状态:再写入`;可写 owner 映射、概要状态定义表、精简 ASCII 流转图、允许 / 禁止迁移清单、传播影响表和停审记录,不得写 Rust enum、字段全集、repository / port、DTO、DDL、raw log、trace span、event payload、outbox body、report body、evidence body、artifact/archive body、worker、retry、queue、recovery algorithm、maintenance progress schema、topic、relay,不得修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.14 追溯与一致性保护状态:再写入

#### R1.14.1 owner 映射

| owner | Step 6 来源 | Step 8 / Step 7 触发来源 | 本模块状态职责 |
|---|---|---|---|
| `MethodAssetTraceMaterial` | `views_materials` C4;trace material。 | `OrganizeMethodAssetTraceMaterial`;`MarkMethodAssetTraceMaterialState`;trace refresh hint。 | 表达 trace material ready、stale、incomplete、unavailable。 |
| `MethodAssetTraceView` | `views_materials` C5;projection / trace view。 | trace material changed;read material refresh hint。 | 表达 trace read surface readable、stale、partially available、unavailable。 |
| `ConsumptionImpactSummary` | `core_truth` A8;support summary / impact boundary。 | `RegisterConsumptionImpactSummary`;`MarkConsumptionImpactDisposition`;formal version / consumption / relation changed hint。 | 表达 impact unknown、pending downstream summary、known、no known effect、superseded。 |
| `ConsumptionImpactView` | `views_materials` C6;projection / impact view。 | impact summary changed;trace material changed。 | 表达 impact read surface known、unknown、pending、stale、unavailable。 |
| `ConsistencyProtectionPolicy` | `policies_guards` B5;policy / guard。 | `EstablishConsistencyProtectionDecision`;impact / trace input changed。 | 表达 protected、pending、unknown、action required、no-action。 |
| `MethodAssetAuditTrail` | `refs_trace_audit` D20;audit trail / safe audit material。 | `OrganizeMethodAssetAuditTrail`;history / lineage linked。 | 表达 audit organized、partial、stale、unsafe body rejected、unavailable。 |
| `MethodAssetEvidenceLineage` | `refs_trace_audit` D21;lineage / evidence handoff。 | `LinkMethodAssetEvidenceLineage`;external evidence lineage changed。 | 表达 lineage linked、partial、superseded、body rejected、unavailable。 |
| `TraceSubjectRef` / `ConsumptionImpactSourceRef` | typed ref family。 | trace / impact / audit / evidence Commands and Queries。 | 只作为状态定位和来源边界,不作为生命周期 owner。 |

#### R1.14.2 状态定义表

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 |
|---|---|---|---|
| Trace material | `TraceMaterialReady` | 追溯材料已组织完成,可用于变化解释和保护判断。 | 是。 |
| Trace material | `TraceMaterialStale` | 来源 formal version、consumption material、relation 或 external summary 变化后等待刷新。 | 有条件,读取必须暴露 stale。 |
| Trace material | `TraceMaterialIncomplete` | 已有部分线索,但 lineage、impact 或 subject 关联尚未收敛。 | 有条件,不得作为完整解释。 |
| Trace material | `TraceMaterialUnavailable` | 追溯材料暂不可用,但来源 truth 不受影响。 | 否,只可作为不可用提示。 |
| Trace view | `TraceViewReadable` | 追溯视图可读取 body-free trace summary。 | 是。 |
| Trace view | `TraceViewStale` | 视图落后于 trace material 或 impact summary。 | 有条件。 |
| Trace view | `TraceViewPartiallyAvailable` | 部分 trace / impact / lineage 可读,部分仍缺失。 | 有条件。 |
| Trace view | `TraceViewUnavailable` | 追溯视图暂不可读。 | 否。 |
| Impact summary | `ImpactUnknown` | 影响尚不可判定,必须保留未知口径。 | 有条件,需保护或后续承接。 |
| Impact summary | `ImpactPendingDownstreamSummary` | 等待正式下游影响摘要或安全回报引用。 | 有条件,不得声明无影响。 |
| Impact summary | `ImpactKnown` | 已形成可解释影响摘要。 | 是。 |
| Impact summary | `ImpactNoKnownEffect` | 当前依据下未发现已知影响。 | 有条件,不能声称全量下游已扫描。 |
| Impact summary | `ImpactSuperseded` | 当前影响摘要已被后续变化或后续摘要替代。 | 否,保留历史解释。 |
| Protection decision | `ProtectionPending` | 保护判断等待 trace / impact / context 输入。 | 有条件。 |
| Protection decision | `ProtectionUnknown` | 保护影响不可判定,需保留 unknown reason。 | 有条件,通常触发维护或正式介入提示。 |
| Protection decision | `ProtectionActionRequired` | 需要保护动作或后续收敛承接。 | 否,不等于 recovery 已执行。 |
| Protection decision | `ProtectionSatisfied` | 当前依据下既有正式消费已受保护。 | 是。 |
| Protection decision | `ProtectionNoAction` | 当前依据下无需保护动作。 | 是,但必须有 safe reason。 |
| Audit trail | `AuditTrailOrganized` | 审计材料已组织为 safe audit summary。 | 是。 |
| Audit trail | `AuditTrailPartial` | 审计线索不完整,history 或 lineage 仍待补齐。 | 有条件。 |
| Audit trail | `AuditTrailStale` | 来源 history / trace / lineage 变化后审计材料待刷新。 | 有条件。 |
| Audit trail | `AuditTrailUnsafeBodyRejected` | 含 raw log、report body 或 evidence body 的候选已被拒绝。 | 否,只作为安全拒绝线索。 |
| Audit trail | `AuditTrailUnavailable` | 审计材料暂不可用。 | 否。 |
| Evidence lineage | `EvidenceLineageLinked` | lineage 已连接 external source refs、artifact archive refs 或 digest hints。 | 是。 |
| Evidence lineage | `EvidenceLineagePartial` | lineage 存在但 refs / digest hints 不完整。 | 有条件。 |
| Evidence lineage | `EvidenceLineageSuperseded` | lineage 被后续 evidence lineage 替代。 | 否,保留历史解释。 |
| Evidence lineage | `EvidenceLineageBodyRejected` | evidence / artifact / report body 候选被拒绝。 | 否。 |
| Evidence lineage | `EvidenceLineageUnavailable` | lineage 暂不可用。 | 否。 |

#### R1.14.3 概要状态流转图

```text
+==============================================================+
|          Trace / Impact / Protection / Audit State Flow       |
+==============================================================+
| MethodAssetTraceMaterial                                     |
|   <organize trace material>                                  |
|        |                                                     |
|        v                                                     |
|   TraceMaterialReady ---- source changed ------------------> TraceMaterialStale |
|        | missing lineage / impact                            |
|        +--------------------------------> TraceMaterialIncomplete |
|        | material unavailable                                |
|        +--------------------------------> TraceMaterialUnavailable |
|                                                              |
| ConsumptionImpactSummary                                     |
|   ImpactUnknown ---- downstream summary received ----------> ImpactKnown |
|        | waiting for summary                                 |
|        +--------------------------------> ImpactPendingDownstreamSummary |
|        | safe basis says no known effect                     |
|        +--------------------------------> ImpactNoKnownEffect |
|        | later impact summary supersedes                     |
|        +--------------------------------> ImpactSuperseded   |
|                                                              |
| ConsistencyProtectionPolicy                                  |
|   ProtectionPending ---- enough evidence ------------------> ProtectionSatisfied |
|        | impact unknown                                      |
|        +--------------------------------> ProtectionUnknown  |
|        | action needed                                       |
|        +--------------------------------> ProtectionActionRequired |
|        | safe no-action basis                                |
|        +--------------------------------> ProtectionNoAction |
|                                                              |
| MethodAssetAuditTrail / MethodAssetEvidenceLineage            |
|   AuditTrailOrganized ---- source changed -----------------> AuditTrailStale |
|        | partial refs                                        |
|        +--------------------------------> AuditTrailPartial  |
|        | unsafe body candidate                               |
|        +--------------------------------> AuditTrailUnsafeBodyRejected |
|                                                              |
|   EvidenceLineageLinked ---- later lineage ----------------> EvidenceLineageSuperseded |
|        | partial refs                                        |
|        +--------------------------------> EvidenceLineagePartial |
|        | unsafe body candidate                               |
|        +--------------------------------> EvidenceLineageBodyRejected |
+==============================================================+
```

关键说明:

- `ImpactUnknown` 是正式状态,不能被查询层或保护判断折叠为 `ImpactNoKnownEffect`。
- `ProtectionActionRequired` 只表达需要后续承接,不表示 recovery、告警、worker 或维护任务已经执行。
- `AuditTrailUnsafeBodyRejected` 和 `EvidenceLineageBodyRejected` 只保存安全拒绝线索,不得保留被拒正文。
- trace / impact / audit / lineage 的 stale 或 partial 可提示后台维护,但本模块不定义维护进度。
- view freshness 只服务读取面,不得反写 trace material、impact summary 或 source truth。

#### R1.14.4 允许迁移清单

| owner | 允许迁移 | 触发动作 |
|---|---|---|
| `MethodAssetTraceMaterial` | create -> `TraceMaterialReady` | `OrganizeMethodAssetTraceMaterial` accepted with valid subject and body-free refs。 |
| `MethodAssetTraceMaterial` | `TraceMaterialReady -> TraceMaterialStale` | formal version、consumption material、relation、external summary 或 basis 变化。 |
| `MethodAssetTraceMaterial` | `TraceMaterialReady / TraceMaterialStale -> TraceMaterialIncomplete` | lineage、impact 或 subject 关联不足。 |
| `MethodAssetTraceMaterial` | any current state -> `TraceMaterialUnavailable` | trace material 暂不可读或缺失。 |
| `MethodAssetTraceMaterial` | `TraceMaterialStale / TraceMaterialIncomplete / TraceMaterialUnavailable -> TraceMaterialReady` | 显式组织 trace material 或后续 trace refresh 收敛成功。 |
| `MethodAssetTraceView` | create / refresh -> `TraceViewReadable` | trace material ready 且读取视图可用。 |
| `MethodAssetTraceView` | `TraceViewReadable -> TraceViewStale` | trace material 或 impact summary 变化。 |
| `MethodAssetTraceView` | any current state -> `TraceViewPartiallyAvailable` | 部分 trace / impact / lineage 可读。 |
| `MethodAssetTraceView` | any current state -> `TraceViewUnavailable` | trace view 暂不可用。 |
| `ConsumptionImpactSummary` | create -> `ImpactUnknown` | 影响不可判定但必须保留 unknown reason。 |
| `ConsumptionImpactSummary` | create / `ImpactUnknown -> ImpactPendingDownstreamSummary` | 等待正式下游影响摘要或安全回报引用。 |
| `ConsumptionImpactSummary` | `ImpactUnknown / ImpactPendingDownstreamSummary -> ImpactKnown` | `RegisterConsumptionImpactSummary` 或 `MarkConsumptionImpactDisposition` 形成可解释影响。 |
| `ConsumptionImpactSummary` | `ImpactUnknown / ImpactPendingDownstreamSummary / ImpactKnown -> ImpactNoKnownEffect` | safe basis 表明当前依据下无已知影响。 |
| `ConsumptionImpactSummary` | any active impact state -> `ImpactSuperseded` | 后续版本变化或后续影响摘要替代当前摘要。 |
| `ConsistencyProtectionPolicy` | create -> `ProtectionPending` | `EstablishConsistencyProtectionDecision` 等待 trace / impact / context 输入。 |
| `ConsistencyProtectionPolicy` | `ProtectionPending -> ProtectionUnknown` | 影响不可判定或 trace / impact 不足。 |
| `ConsistencyProtectionPolicy` | `ProtectionPending / ProtectionUnknown -> ProtectionActionRequired` | 保护判断需要后续承接或正式介入。 |
| `ConsistencyProtectionPolicy` | `ProtectionPending / ProtectionUnknown -> ProtectionSatisfied` | 既有正式消费已被保护。 |
| `ConsistencyProtectionPolicy` | `ProtectionPending / ProtectionUnknown -> ProtectionNoAction` | safe reason 表明无需保护动作。 |
| `MethodAssetAuditTrail` | create -> `AuditTrailOrganized` | `OrganizeMethodAssetAuditTrail` accepted with body-free history / lineage refs。 |
| `MethodAssetAuditTrail` | `AuditTrailOrganized -> AuditTrailStale` | history、trace 或 lineage 变化。 |
| `MethodAssetAuditTrail` | any current state -> `AuditTrailPartial` | history refs 或 lineage refs 不完整。 |
| `MethodAssetAuditTrail` | any current state -> `AuditTrailUnsafeBodyRejected` | raw log、report body、event payload 或 evidence body candidate 被拒绝。 |
| `MethodAssetEvidenceLineage` | create -> `EvidenceLineageLinked` | `LinkMethodAssetEvidenceLineage` accepted with safe external / artifact refs。 |
| `MethodAssetEvidenceLineage` | `EvidenceLineageLinked -> EvidenceLineagePartial` | refs、digest hints 或 subject 线索不完整。 |
| `MethodAssetEvidenceLineage` | `EvidenceLineageLinked / EvidenceLineagePartial -> EvidenceLineageSuperseded` | 后续 lineage 替代当前 lineage。 |
| `MethodAssetEvidenceLineage` | any current state -> `EvidenceLineageBodyRejected` | evidence / artifact / archive / report body candidate 被拒绝。 |

#### R1.14.5 禁止迁移清单

| 禁止迁移或行为 | 原因 |
|---|---|
| `ImpactUnknown -> ImpactNoKnownEffect` without safe basis | unknown 不能被折叠成无影响。 |
| `ProtectionActionRequired` 自动执行 recovery / refresh / retry / alert | 保护判断不执行维护或恢复。 |
| trace material stale 自动修复 definition、formal version、relation 或 consumption truth | trace material 是解释材料,不修来源 truth。 |
| audit trail 保存 raw log、telemetry、metric、event payload、outbox body 或 report body | audit 只允许 safe audit summary。 |
| evidence lineage 保存 artifact 包体、archive 内容、证据文件正文、标准全文或验收报告正文 | lineage 只保存 refs、markers、digest hints。 |
| Query 自动组织 trace、登记 impact、建立 protection decision 或链接 lineage | Query no-write。 |
| trace / impact view 反写 trace material 或 impact summary | view 是 projection / read surface,不是 truth。 |
| `ImpactKnown` 声明下游运行事实已同步或已执行 | impact summary 不拥有下游 runtime truth。 |
| protection no-action 因缺少材料自动成立 | no-action 必须有 safe reason。 |
| evidence lineage superseded 删除旧 lineage | 旧 lineage 仍用于历史解释。 |
| 将 worker、queue、retry、maintenance run progress 写入本模块状态 | 维护与收敛状态后续单独讨论。 |

#### R1.14.6 传播影响

| 来源状态变化 | 必须传播到 | 不允许传播到 |
|---|---|---|
| `TraceMaterialReady` | audit trail、impact view、protection decision、relation integrity input、event candidate。 | definition / version / consumption truth rewrite、raw log export。 |
| `TraceMaterialStale` / `TraceMaterialIncomplete` / `TraceMaterialUnavailable` | trace view freshness、protection unknown / pending、maintenance trace refresh hint。 | 自动修复、worker state、默认 no-action。 |
| `ImpactUnknown` / `ImpactPendingDownstreamSummary` | protection unknown / pending、diagnostic read surface、maintenance follow-up。 | no impact、下游已扫描声明。 |
| `ImpactKnown` / `ImpactNoKnownEffect` | protection decision、audit trail、event candidate、relation / distribution diagnostic。 | 下游 runtime truth、同步成功记录。 |
| `ImpactSuperseded` | audit history、impact view stale、protection re-evaluation hint。 | hard delete、旧 impact summary 改义。 |
| `ProtectionActionRequired` / `ProtectionUnknown` | maintenance request hint、formal intervention hint、query diagnostic、event candidate。 | recovery 已执行、告警已发送、任务已排队。 |
| `ProtectionSatisfied` / `ProtectionNoAction` | audit / diagnostic surface、event candidate。 | 证明所有下游已同步或已运行。 |
| `AuditTrailOrganized` / `EvidenceLineageLinked` | 验收 / 审计 handoff、external summary follow-up、event candidate。 | evidence body、report body、artifact body。 |
| `AuditTrailPartial` / `EvidenceLineagePartial` | maintenance / external follow-up、read surface partial marker。 | 自动补正文、复制外部材料。 |
| `AuditTrailUnsafeBodyRejected` / `EvidenceLineageBodyRejected` | body boundary diagnostic、audit safety trail。 | 保存被拒正文、返回正文摘录。 |

#### R1.14.7 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| owner 是否回指 Step 6 | pass | trace material、impact summary、protection policy、audit trail、evidence lineage 均来自 Step 6。 |
| 触发来源是否回指 Step 7 / Step 8 | pass | 使用当前 R1 的 trace、impact、protection、audit、lineage Command / Query。 |
| 是否区分 trace / impact / protection / audit / lineage | pass | 五类状态分别定义,未混写。 |
| 是否保留 unknown 语义 | pass | `ImpactUnknown` 和 `ProtectionUnknown` 均未折叠。 |
| 是否保持 body-free 边界 | pass | 禁止 raw log、event payload、report body、evidence body、artifact/archive body。 |
| 是否排除 recovery / worker / maintenance 状态 | pass | 仅写保护判断和提示,不写维护执行状态。 |
| 是否写入状态定义表 | pass | 已写概要状态表,未写 Rust enum 或字段全集。 |
| 是否写入流转图和迁移清单 | pass | 已写精简 ASCII 图和概要允许 / 禁止迁移。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9。 |

next_allowed_action: 等待用户确认后进入 Step 9 `关系与分发语义状态:先思考`;只思考 relation truth、relation integrity、distribution ref/read material、distribution availability 的 owner 范围、状态组取舍、触发来源、传播风险和排除项,不得写完整状态定义表、状态流转图、允许 / 禁止迁移清单,不得修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.15 关系与分发语义状态:先思考

#### R1.15.1 问题回答

本批只思考 `关系与分发语义` 的状态 owner 和状态组边界,不直接写完整状态定义表、状态流转图、允许 / 禁止迁移清单或正式 §9 回填草稿。

需要回答的问题:

1. 哪些对象真正拥有关系与分发状态。
2. relation truth、relation integrity、distribution ref、distribution read material 和 distribution availability 是否应拆成不同状态组。
3. Step 8 的 relation lifecycle、integrity、distribution reference、read flow 和 event candidate 如何映射到状态变化。
4. 哪些状态只属于派生读取材料或 invalidation hint,不能反写 relation truth。
5. 哪些旧主线必须排除,尤其是运行依赖图、推荐图、marketplace listing、安装履约、worker refresh 和 projection storage。

当前判断:

- `MethodAssetRelation` 是 relation truth 的状态 owner,负责关系成立、约束、替代和退出当前适用语境。
- `RelationIntegrityRule` / integrity diagnostic 是关系完整性判断的 owner,负责 pass、violation、unknown / pending 等诊断口径,但不执行修复。
- `MethodAssetRelationView` 与 `DistributionReadMaterial` 是读取材料 owner,负责 fresh、stale、blocked、unavailable 等读取可用性和新鲜度口径。
- `MethodAssetDistributionRef` 和 `DistributionContextRef` 是分发语义边界和上下文 ref,可以产生 prepared、context adjusted、retired 等 ref 语义变化,但不能承接 marketplace 或安装履约状态。
- `RelationChangeHistory` 只记录 body-free 变化线索,不成为第二套 relation truth 或状态 owner。

#### R1.15.2 当前 owner 来源判断

| owner 候选 | Step 6 来源 | Step 8 / Step 7 触发来源 | 当前判断 |
|---|---|---|---|
| `MethodAssetRelation` | `core_truth` A5 | `EstablishMethodAssetRelation`;`AdjustMethodAssetRelation`;`ConstrainMethodAssetRelation`;`SupersedeMethodAssetRelation`;`RetireMethodAssetRelation`;`MethodAssetRelationChanged` | 必须进入本批状态组,承载 relation lifecycle truth。 |
| `RelationIntegrityRule` | `policies_guards` B6 | `EvaluateRelationIntegrity`;`MarkRelationIntegrityViolation`;`MethodAssetRelationIntegrityChanged` | 必须进入本批状态组,但只表达诊断 / violation / unknown,不写算法和修复。 |
| `MethodAssetRelationView` | `views_materials` C7 | relation truth changed;`MethodAssetRelationReadMaterialInvalidated`;relation Query | 进入读取状态组,表达 fresh / stale / unavailable,不得替代 relation truth。 |
| `DistributionReadMaterial` | `views_materials` C8 | `PrepareMethodAssetDistributionRef`;`AdjustMethodAssetDistributionContext`;`MarkMethodAssetDistributionAvailability`;distribution Query | 进入读取材料状态组,表达 ready / stale / blocked / unavailable。 |
| `MethodAssetDistributionRef` | `refs_trace_audit` D8 | `PrepareMethodAssetDistributionRef`;`AdjustMethodAssetDistributionContext`;`MethodAssetDistributionRefChanged` | 进入分发语义 ref 状态组,但仅作为分发边界,不承接 marketplace truth。 |
| `DistributionContextRef` | `refs_trace_audit` D9 | distribution context adjustment;context-scoped read | 作为 scope / selector 边界,不单独写生命周期状态。 |
| `RelationChangeHistory` | `refs_trace_audit` D22 | relation / distribution change accepted | 作为历史线索和传播输入,不作为当前 lifecycle owner。 |
| `MethodAssetRelationReadMaterialInvalidated` | Step 7 / Step 8 event candidate | relation / distribution truth changed or integrity changed | 作为 invalidation hint,不等同 refresh job 或 projection rebuild state。 |

#### R1.15.3 状态组取舍

后续写入应拆成四组,避免把关系 truth、完整性诊断、分发语义和读取材料混成一条 lifecycle:

| 状态组 | 建议 owner | 保留理由 | 不进入本组 |
|---|---|---|---|
| Relation lifecycle state | `MethodAssetRelation` | 关系有 established、adjusted / constrained、superseded、retired 等业务可见变化。 | integrity pass、material freshness、marketplace listing、runtime dependency。 |
| Relation integrity disposition | `RelationIntegrityRule` / diagnostic summary | integrity pass、violation、unknown / pending 会影响保护、维护和读取诊断。 | 图算法、policy engine、自动修复、外部正文证据。 |
| Distribution semantic state | `MethodAssetDistributionRef` + `DistributionContextRef` | prepared、context adjusted、retired / invalid context 表达分发语义边界变化。 | marketplace 上架、定价、订单、安装、履约、provider payload。 |
| Relation / distribution read material state | `MethodAssetRelationView`;`DistributionReadMaterial` | fresh、stale、blocked、unavailable 影响读取面和维护提示。 | relation truth 修改、refresh worker、queue、retry、projection storage。 |

暂不单独建立的状态组:

| 排除状态组 | 原因 |
|---|---|
| relation graph traversal state | 本仓不拥有运行依赖图、推荐图或搜索排序图。 |
| marketplace distribution lifecycle | 分发语义 ref 不是 listing、订单、安装或履约。 |
| relation history lifecycle | `RelationChangeHistory` 是 body-free history record,不替代当前 relation truth。 |
| read material refresh progress | 后台维护与收敛单独讨论,本批只保留 invalidation / stale hint。 |
| package / method set distribution state | 外围组织由后续组成部分处理,当前只提供可引用的 distribution ref / material。 |

#### R1.15.4 触发来源思考

后续写入时应把触发来源限定为:

| 触发来源 | 可影响 | 不可影响 |
|---|---|---|
| `EstablishMethodAssetRelation` | 创建 relation lifecycle 初始成立状态,产生 relation changed 和 read material invalidation hint。 | 不创建 definition、formal version、consumption material、marketplace listing。 |
| `AdjustMethodAssetRelation` | 调整 relation summary、scope 或 endpoint 线索,产生 relation changed。 | 不静默覆盖旧关系,不绕过完整性诊断。 |
| `ConstrainMethodAssetRelation` | 将 relation 限定到 catalog、formal version 或 distribution context。 | 不写下游授权、安装状态、交易规则或 marketplace policy。 |
| `SupersedeMethodAssetRelation` | 标记旧 relation 被后续 relation 替代,保留历史线索。 | 不删除历史关系,不把 history 当当前 truth。 |
| `RetireMethodAssetRelation` | 标记 relation 退出当前适用语境。 | 不级联删除消费材料、分发材料、package 或 method set。 |
| `EvaluateRelationIntegrity` | 产生 integrity pass / violation / unknown / pending 诊断。 | 不运行图算法、推荐算法、policy engine 或自动修复。 |
| `MarkRelationIntegrityViolation` | 标记 violation summary 和 safe reason,影响保护、维护和 read diagnostic。 | 不保存 raw evidence、外部正文、运行日志或下游状态正文。 |
| `PrepareMethodAssetDistributionRef` | 建立分发语义 ref,可影响 distribution semantic state 和 read material stale。 | 不表示上架、交易、安装、下载、履约或同步成功。 |
| `AdjustMethodAssetDistributionContext` | 调整分发上下文,影响 context-scoped distribution material。 | 不扩大消费授权,不修改 package / method set 正文。 |
| `MarkMethodAssetDistributionAvailability` | 标记 distribution availability / blocked / unavailable。 | 不修复消费材料、下游状态或外围组织 truth。 |
| relation / distribution Query | 读取 relation truth、integrity diagnostic、distribution material 和 stale / unavailable hint。 | 不建立 relation,不刷新材料,不创建 distribution ref。 |
| `MethodAssetRelationReadMaterialInvalidated` | 提示 relation view / distribution material 需要后续刷新。 | 不执行 worker、queue、retry、projection rebuild。 |

#### R1.15.5 传播风险

关系与分发状态会传播到受控消费、追溯一致性、外部摘要、维护收敛和外围组织,但必须保持 ref / summary / material 边界:

| 来源变化 | 可传播到 | 风险控制 |
|---|---|---|
| relation established / constrained | consumption read boundary、trace subject、relation view、event candidate。 | 不推导 runtime dependency 或推荐图。 |
| relation superseded / retired | relation view stale、distribution material stale、impact summary、audit / history。 | 不删除历史 relation,不级联删除消费或外围对象。 |
| integrity violation / unknown | protection diagnostic、maintenance follow-up、read diagnostic、event candidate。 | 不自动修复 relation truth,不折叠 unknown 为 pass。 |
| distribution ref prepared / context adjusted | distribution read material、peripheral organization input、event candidate。 | 不声称 marketplace 上架或下游同步成功。 |
| distribution blocked / unavailable | controlled consumption read surface、peripheral availability、maintenance hint。 | 不修改 formal version truth 或消费授权。 |
| relation / distribution material stale | Query freshness hint、maintenance refresh request。 | 不在 Query 中刷新,不写 worker progress。 |
| relation change history appended | trace / audit / impact interpretation。 | 不成为第二 relation truth,不保存 graph result 或 external body。 |

#### R1.15.6 排除项

本组成部分后续写入必须排除:

| 排除项 | 排除原因 |
|---|---|
| runtime dependency / call graph / relation traversal 状态 | `MethodAssetRelation` 不是运行依赖图。 |
| recommendation、similarity、search ranking、UI category 状态 | 这些属于发现、展示或算法输出,不是定义性关系 truth。 |
| marketplace listing、定价、订单、购买、安装、履约状态 | `MethodAssetDistributionRef` 只表达分发语义引用。 |
| provider payload、URL、download package、artifact/archive body | 分发语义和读取材料保持 body-free。 |
| 外部正文、raw evidence、运行日志、下游状态正文 | integrity / violation 只能保存 safe summary / ref。 |
| Query 刷新 relation view 或 distribution material | Query no-write。 |
| read material stale 反写 relation truth | view/material 是派生读取面。 |
| integrity violation 自动修复 relation、definition、formal version 或 distribution material | integrity 是诊断,不是 repair 执行。 |
| worker、queue、retry、projection storage、refresh progress | 后台维护与收敛单独讨论。 |
| package / method set truth 状态 | 外围包与方法集组织后续单独讨论。 |

#### R1.15.7 下一写入批次边界

下一批 `关系与分发语义状态:再写入` 可以写:

1. owner 到对象 / 触发来源映射。
2. relation lifecycle、integrity disposition、distribution semantic、read material 四组概要状态定义表。
3. 精简 ASCII 流转图。
4. 允许迁移和禁止迁移清单。
5. 传播影响表和停审记录。

不得写 Rust enum、字段全集、repository / port、DTO、DDL、图算法、推荐算法、marketplace 交易 / 安装 / 履约、外部正文、artifact body、provider payload、worker、retry、queue、projection storage、refresh job、package / method set truth、正式 §9 回填草稿或 Step 10 异常边界。

#### R1.15.8 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 只思考 owner、状态组取舍、触发来源、传播风险和排除项。 |
| 是否写完整状态定义表 | no | 未写状态类型 / 状态 / 含义 / 正常主线的完整表。 |
| 是否写状态流转图 | no | 未写 ASCII 状态图。 |
| 是否写允许 / 禁止迁移清单 | no | 迁移清单留给再写入。 |
| 是否以当前 Step 6 / Step 8 为准 | pass | 使用 `MethodAssetRelation`、`RelationIntegrityRule`、`MethodAssetDistributionRef`、`DistributionReadMaterial` 和 R1.18 flow。 |
| 是否排除旧状态主线 | pass | 未恢复 `MethodContentLifecycle`、outbox delivery、fingerprint drift 或 worker retry 主线。 |
| 是否排除 marketplace 和图算法 | pass | 已明确不进入 listing、交易、安装、履约、推荐或运行依赖图。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9 关系与分发语义状态小循环。 |

next_allowed_action: 等待用户确认后进入 Step 9 `关系与分发语义状态:再写入`;可写 owner 映射、四组概要状态定义表、精简 ASCII 流转图、允许 / 禁止迁移清单、传播影响表和停审记录,不得写 Rust enum、字段全集、repository / port、DTO、DDL、图算法、推荐算法、marketplace 交易 / 安装 / 履约、外部正文、artifact body、provider payload、worker、retry、queue、projection storage、refresh job、package / method set truth,不得修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.16 关系与分发语义状态:再写入

#### R1.16.1 本组成部分写入说明

本模块只把 `R1.15` 的关系与分发语义状态裁决落成概要级状态机材料。写入范围包括 relation lifecycle、relation integrity disposition、distribution semantic / availability、relation / distribution read material 四组状态。

本模块不写运行依赖图、调用图、推荐 / 相似度、搜索排序、UI 分类、marketplace listing、交易、安装、履约、provider payload、artifact body、refresh worker、queue、retry、projection storage、package truth 或 method set truth。

#### R1.16.2 owner 映射

| owner | Step 6 来源 | Step 8 / Step 7 触发来源 | 本模块状态职责 |
|---|---|---|---|
| `MethodAssetRelation` | `core_truth` A5 | `EstablishMethodAssetRelation`;`AdjustMethodAssetRelation`;`ConstrainMethodAssetRelation`;`SupersedeMethodAssetRelation`;`RetireMethodAssetRelation` | 表达 relation active、constrained、superseded、retired。 |
| `RelationIntegrityRule` / diagnostic summary | `policies_guards` B6 | `EvaluateRelationIntegrity`;`MarkRelationIntegrityViolation` | 表达 integrity pending、satisfied、violation、unknown、violation marked。 |
| `MethodAssetDistributionRef` | `refs_trace_audit` D8 | `PrepareMethodAssetDistributionRef`;`AdjustMethodAssetDistributionContext`;`MarkMethodAssetDistributionAvailability` | 表达 distribution prepared、context adjusted、available、blocked、unavailable、retired。 |
| `DistributionContextRef` | `refs_trace_audit` D9 | distribution context adjustment;context-scoped Query | 作为 distribution 状态的 scope / selector,不单独拥有 lifecycle。 |
| `MethodAssetRelationView` | `views_materials` C7 | relation truth changed;relation Query;read material invalidated | 表达 relation view fresh、stale、unavailable。 |
| `DistributionReadMaterial` | `views_materials` C8 | distribution ref / context / availability changed;distribution Query | 表达 distribution material ready、stale、blocked、unavailable。 |
| `RelationChangeHistory` | `refs_trace_audit` D22 | relation / distribution accepted change | 记录 body-free history 线索,不成为当前 relation truth。 |
| `MethodAssetRelationReadMaterialInvalidated` | Step 7 / Step 8 event candidate | relation / distribution truth or integrity disposition changed | 表达 invalidation hint,不执行 refresh。 |

#### R1.16.3 状态定义表

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 |
|---|---|---|---|
| Relation lifecycle | `RelationActive` | 关系已由显式命令建立,当前可作为定义性关系 truth。 | 是。 |
| Relation lifecycle | `RelationConstrained` | 关系被限定到 catalog、formal version 或 distribution context。 | 是,但读取和消费必须暴露约束。 |
| Relation lifecycle | `RelationSuperseded` | 当前关系已被后续关系替代,保留历史解释。 | 否,只作为历史和追溯来源。 |
| Relation lifecycle | `RelationRetired` | 关系退出当前适用语境。 | 否,不再作为当前关系。 |
| Relation integrity | `IntegrityPending` | 完整性判断等待端点、正式化或分发边界输入。 | 有条件。 |
| Relation integrity | `IntegritySatisfied` | 当前依据下 relation endpoint、formalization 和 distribution boundary 满足规则。 | 是。 |
| Relation integrity | `IntegrityViolation` | 发现关系完整性违规,但仅表达诊断结果。 | 否,需后续处理或正式介入。 |
| Relation integrity | `IntegrityUnknown` | 现有材料不足以判定完整性。 | 有条件,读取必须暴露 unknown。 |
| Relation integrity | `IntegrityViolationMarked` | violation 已以 safe reason / marker 记录。 | 否,不表示已修复。 |
| Distribution semantic | `DistributionRefPrepared` | 分发语义 ref 已由正式来源和上下文建立。 | 是。 |
| Distribution semantic | `DistributionContextAdjusted` | 分发上下文已显式调整。 | 是,但相关读取材料需失效或刷新。 |
| Distribution semantic | `DistributionAvailable` | 当前分发语义引用可用于受控消费读取或外围发现。 | 是。 |
| Distribution semantic | `DistributionBlocked` | 分发边界、消费边界或安全原因阻止输出。 | 否,只能作为 blocked surface。 |
| Distribution semantic | `DistributionUnavailable` | 分发语义引用暂不可用或不可判定。 | 否,但不破坏 relation truth。 |
| Distribution semantic | `DistributionRefRetired` | 分发语义引用退出当前适用语境。 | 否,保留历史线索。 |
| Relation read material | `RelationViewFresh` | relation view 与当前 relation truth 对齐。 | 是。 |
| Relation read material | `RelationViewStale` | relation truth、端点语境或 integrity disposition 变化后待刷新。 | 有条件,读取必须暴露 stale。 |
| Relation read material | `RelationViewUnavailable` | relation view 暂不可读。 | 否,但不影响 relation truth。 |
| Distribution read material | `DistributionMaterialReady` | 分发读取材料可用于受控消费和外围发现。 | 是。 |
| Distribution read material | `DistributionMaterialStale` | relation、distribution ref、context 或 availability 变化后待刷新。 | 有条件。 |
| Distribution read material | `DistributionMaterialBlocked` | 材料因边界阻止而不可输出。 | 否。 |
| Distribution read material | `DistributionMaterialUnavailable` | 材料暂不可用。 | 否,但不反写 distribution ref。 |

#### R1.16.4 概要状态流转图

```text
+==============================================================+
|             Relation / Distribution State Flow                |
+==============================================================+
| MethodAssetRelation                                           |
|   <establish relation>                                        |
|        |                                                      |
|        v                                                      |
|   RelationActive ---- constrain ---------------------------> RelationConstrained |
|        | adjust                                               |
|        +-------------------------------> RelationActive       |
|        | supersede                                            |
|        +-------------------------------> RelationSuperseded   |
|        | retire                                               |
|        +-------------------------------> RelationRetired      |
|                                                               |
| RelationIntegrityRule / Diagnostic                            |
|   IntegrityPending ---- enough input ----------------------> IntegritySatisfied |
|        | violation found                                      |
|        +-------------------------------> IntegrityViolation   |
|        | mark safe violation                                  |
|        +-------------------------------> IntegrityViolationMarked |
|        | missing / ambiguous input                            |
|        +-------------------------------> IntegrityUnknown     |
|                                                               |
| MethodAssetDistributionRef                                    |
|   DistributionRefPrepared ---- context changed ------------> DistributionContextAdjusted |
|        | available                                            |
|        +-------------------------------> DistributionAvailable |
|        | boundary blocks output                               |
|        +-------------------------------> DistributionBlocked  |
|        | unavailable                                          |
|        +-------------------------------> DistributionUnavailable |
|        | retired                                              |
|        +-------------------------------> DistributionRefRetired |
|                                                               |
| RelationView / DistributionReadMaterial                       |
|   RelationViewFresh ---- relation / integrity changed -----> RelationViewStale |
|        | view unavailable                                     |
|        +-------------------------------> RelationViewUnavailable |
|                                                               |
|   DistributionMaterialReady ---- relation / distribution changed -> DistributionMaterialStale |
|        | boundary blocks output                               |
|        +-------------------------------> DistributionMaterialBlocked |
|        | material unavailable                                 |
|        +-------------------------------> DistributionMaterialUnavailable |
+==============================================================+
```

关键说明:

- relation lifecycle 和 relation integrity 必须分离;violation 不自动修改 relation truth。
- distribution availability 不等于 marketplace 可交易、已安装、已同步或履约完成。
- stale / invalidated 只表达读取材料需要后续收敛,不表示 refresh worker 已启动。
- `RelationSuperseded` 和 `RelationRetired` 都保留历史解释,不得 hard delete。

#### R1.16.5 允许迁移清单

| owner | 允许迁移 | 触发动作 |
|---|---|---|
| `MethodAssetRelation` | create -> `RelationActive` | `EstablishMethodAssetRelation` accepted with typed endpoints and relation kind。 |
| `MethodAssetRelation` | `RelationActive -> RelationConstrained` | `ConstrainMethodAssetRelation` accepted with catalog / formal version / distribution context scope。 |
| `MethodAssetRelation` | `RelationActive / RelationConstrained -> RelationActive` | `AdjustMethodAssetRelation` accepted with safe change summary。 |
| `MethodAssetRelation` | `RelationActive / RelationConstrained -> RelationSuperseded` | `SupersedeMethodAssetRelation` accepted with next relation refs。 |
| `MethodAssetRelation` | `RelationActive / RelationConstrained -> RelationRetired` | `RetireMethodAssetRelation` accepted with safe retirement reason。 |
| `RelationIntegrityRule` | create / evaluate -> `IntegrityPending` | integrity input incomplete or waiting for boundary inputs。 |
| `RelationIntegrityRule` | `IntegrityPending / IntegrityUnknown -> IntegritySatisfied` | `EvaluateRelationIntegrity` confirms endpoint / formalization / distribution boundary。 |
| `RelationIntegrityRule` | `IntegrityPending / IntegritySatisfied / IntegrityUnknown -> IntegrityViolation` | evaluation detects violation。 |
| `RelationIntegrityRule` | `IntegrityViolation -> IntegrityViolationMarked` | `MarkRelationIntegrityViolation` records safe violation marker。 |
| `RelationIntegrityRule` | any diagnostic state -> `IntegrityUnknown` | material unavailable, ambiguous or insufficient。 |
| `MethodAssetDistributionRef` | create -> `DistributionRefPrepared` | `PrepareMethodAssetDistributionRef` accepted with source and context refs。 |
| `MethodAssetDistributionRef` | `DistributionRefPrepared / DistributionAvailable -> DistributionContextAdjusted` | `AdjustMethodAssetDistributionContext` accepted。 |
| `MethodAssetDistributionRef` | `DistributionRefPrepared / DistributionContextAdjusted / DistributionUnavailable -> DistributionAvailable` | availability marker says usable within current boundary。 |
| `MethodAssetDistributionRef` | any active distribution state -> `DistributionBlocked` | boundary or safe reason blocks output。 |
| `MethodAssetDistributionRef` | any active distribution state -> `DistributionUnavailable` | distribution semantic temporarily unavailable。 |
| `MethodAssetDistributionRef` | any active distribution state -> `DistributionRefRetired` | explicit retirement or superseding distribution context。 |
| `MethodAssetRelationView` | create / refresh -> `RelationViewFresh` | relation view aligns with relation truth。 |
| `MethodAssetRelationView` | `RelationViewFresh -> RelationViewStale` | relation truth, endpoint context or integrity disposition changed。 |
| `MethodAssetRelationView` | any current state -> `RelationViewUnavailable` | relation view not readable。 |
| `DistributionReadMaterial` | create / refresh -> `DistributionMaterialReady` | material aligns with relation and distribution source。 |
| `DistributionReadMaterial` | `DistributionMaterialReady -> DistributionMaterialStale` | relation / distribution ref / context / availability changed。 |
| `DistributionReadMaterial` | any current state -> `DistributionMaterialBlocked` | boundary blocks material output。 |
| `DistributionReadMaterial` | any current state -> `DistributionMaterialUnavailable` | material unavailable or missing。 |

#### R1.16.6 禁止迁移清单

| 禁止迁移或行为 | 原因 |
|---|---|
| runtime dependency / call graph -> `MethodAssetRelation` | 运行依赖不是定义性关系 truth。 |
| recommendation / search ranking / UI category -> `RelationActive` | 发现和展示结果不得建立 relation truth。 |
| `IntegrityViolation` 自动修复 relation、definition、formal version 或 distribution material | integrity 是诊断,不是 repair。 |
| `IntegrityUnknown -> IntegritySatisfied` without formal input | unknown 不能默认 pass。 |
| `DistributionAvailable` 表示 marketplace 上架、交易、安装或履约完成 | distribution ref 只表达分发语义。 |
| `DistributionBlocked` 反写 formal version 或 consumption authorization | blocked 只限制输出,不修改来源 truth。 |
| Query 建立 relation、修复 integrity 或创建 distribution ref | Query no-write。 |
| `RelationViewStale` 自动刷新 view 或启动 worker | stale 只提示后续维护。 |
| `DistributionMaterialStale` 反写 `MethodAssetDistributionRef` | read material 是派生面。 |
| `RelationSuperseded` / `RelationRetired` hard delete 历史关系 | 历史关系仍用于 trace、audit、impact 和 change summary。 |
| `RelationChangeHistory` 替代当前 relation truth | history 是解释线索,不是当前状态 owner。 |
| 在本模块保存外部正文、provider payload、artifact body、marketplace fact 或下游运行状态 | 违反 body-free 和跨仓 truth 边界。 |

#### R1.16.7 传播影响

| 来源状态变化 | 必须传播到 | 不允许传播到 |
|---|---|---|
| `RelationActive` / `RelationConstrained` | relation view、consumption read boundary、trace subject、event candidate。 | runtime dependency graph、recommendation result、UI category。 |
| `RelationSuperseded` / `RelationRetired` | relation view stale、distribution material stale、relation change history、impact summary。 | hard delete、级联删除 consumption / package / method set。 |
| `IntegrityViolation` / `IntegrityViolationMarked` | consistency protection diagnostic、maintenance follow-up、read diagnostic、event candidate。 | 自动修复、默认退役 relation、外部正文保存。 |
| `IntegrityUnknown` / `IntegrityPending` | diagnostic read surface、maintenance hint、formal intervention hint。 | pass、no issue、自动消费授权。 |
| `DistributionRefPrepared` / `DistributionContextAdjusted` | distribution read material stale、peripheral organization input、trace / event candidate。 | marketplace listing、订单、安装、同步成功事实。 |
| `DistributionAvailable` | controlled consumption read material、peripheral discovery、event candidate。 | 交易可用、已安装、已履约声明。 |
| `DistributionBlocked` / `DistributionUnavailable` | read surface blocked / unavailable、maintenance follow-up、boundary diagnostic。 | formal version truth rewrite、relation truth deletion。 |
| `RelationViewStale` / `DistributionMaterialStale` | Query freshness hint、maintenance refresh hint。 | worker progress、projection storage、retry state。 |

#### R1.16.8 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| owner 是否回指 Step 6 | pass | relation、integrity、distribution ref、relation view、distribution material 均来自 Step 6。 |
| 触发来源是否回指 Step 7 / Step 8 | pass | 使用当前 R1 的 relation lifecycle、integrity、distribution 和 read material invalidation 接口。 |
| 是否拆分 relation truth / integrity / distribution / read material | pass | 四组状态分别定义,未混为统一 lifecycle。 |
| 是否写入状态定义表 | pass | 已写概要状态定义表,未写 Rust enum 或字段全集。 |
| 是否写入流转图和迁移清单 | pass | 已写精简 ASCII 图和概要允许 / 禁止迁移。 |
| 是否排除 marketplace 和图算法 | pass | 已排除 listing、交易、安装、履约、推荐、搜索排序和运行依赖图。 |
| 是否保持 Query no-write | pass | Query 只读,不刷新、不建立 relation、不创建 distribution ref。 |
| 是否排除 worker / queue / refresh progress | pass | 只保留 stale / invalidation hint,维护执行后置。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9。 |

next_allowed_action: 等待用户确认后进入 Step 9 `外部摘要与引用状态:先思考`;只思考 external summary、external source / artifact refs、body boundary、acceptance / rejection、summary view freshness 的 owner 范围、状态组取舍、触发来源、传播风险和排除项,不得写完整状态定义表、状态流转图、允许 / 禁止迁移清单,不得修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.17 外部摘要与引用状态:先思考

#### R1.17.1 问题回答

本批只思考 `外部摘要与引用` 的状态 owner 和状态组边界,不直接写完整状态定义表、状态流转图、允许 / 禁止迁移清单或正式 §9 回填草稿。

需要回答的问题:

1. 外部摘要、外部来源 ref、artifact / archive ref、正文边界、外部依据承接历史和 summary view 哪些对象真正拥有状态。
2. external summary lifecycle、basis acceptance disposition、source / archive ref validity、body boundary disposition、summary view freshness 是否应拆成不同状态组。
3. Step 8 `ExternalSourceSummaryLifecycleFlow`、`ExternalSourceArtifactRefFlow`、`ExternalBodyBoundaryFlow`、`ExternalEvidenceLineageFlow`、`ExternalInboundIntakeFlow` 和 read flow 如何映射状态变化。
4. 哪些状态只能作为 history / lineage / diagnostic / read material,不能反写 `ExternalSourceSummary` truth。
5. 哪些旧主线必须排除,尤其是 raw document、webhook payload、provider payload、artifact body、标准解释、治理审批执行、external polling 和 source refresh worker。

当前判断:

- `ExternalSourceSummary` 是外部安全摘要和 basis acceptance disposition 的主要状态 owner,负责 captured、accepted、rejected、unavailable、stale、superseded 等业务可见处置。
- `ExternalSourceRef` 与 `ArtifactArchiveRef` 是 typed boundary owner,可以表达 registered、invalid、duplicate / reused、unavailable marker 等引用边界状态,但不能拥有外部来源或 archive 生命周期。
- `ExternalBodyBoundaryRule` 是正文禁止边界 owner,负责 boundary accepted / rejected / violation noticed 等状态或诊断口径,但不是内容审查、标准解释或治理审批系统。
- `ExternalSourceSummaryView` 是读取材料 owner,负责 fresh、stale、rejected、unavailable 等 view freshness / availability 口径,不得替代 summary truth。
- `ExternalBasisAcceptanceHistory` 只记录 body-free 历史线索,不成为当前 external summary truth。
- `MethodAssetEvidenceLineage` 已在追溯与一致性保护模块覆盖 lineage 状态;本批只思考 external evidence lineage 对 external 状态的触发和传播,不重复写完整 lineage lifecycle。

#### R1.17.2 当前 owner 来源判断

| owner 候选 | Step 6 来源 | Step 8 / Step 7 触发来源 | 当前判断 |
|---|---|---|---|
| `ExternalSourceSummary` | `core_truth` A7 / support summary | `CaptureExternalSourceSummary`;`AcceptExternalBasisSummary`;`MarkExternalBasisDisposition`;`SupersedeExternalSourceSummary`;`ConsumeBodyFreeExternalSummaryAccepted`;`ExternalSourceSummaryChanged` | 必须进入本批状态组,承载 external summary lifecycle 和 basis disposition。 |
| `ExternalSourceRef` | `refs_trace_audit` D10 | `RegisterExternalSourceRef`;`ConsumeExternalSourceRefRegistered`;`ResolveExternalSourceRef`;`ExternalSourceRefChanged` | 进入 source ref boundary 状态组,但只表达 opaque typed ref 边界。 |
| `ArtifactArchiveRef` | `refs_trace_audit` D11 | `RegisterArtifactArchiveRef`;`ConsumeArtifactArchiveRefRegistered`;`GetArtifactArchiveRef`;`ArtifactArchiveRefChanged` | 进入 artifact / archive ref boundary 状态组,但不拥有 artifact 生命周期或包体。 |
| `ExternalBodyBoundaryRule` | `policies_guards` B4 | `AssertExternalBodyBoundary`;`RejectExternalBodyCandidate`;`ConsumeExternalBodyBoundaryViolation`;`ExternalBodyBoundaryViolationNoticed` | 进入 body boundary disposition 状态组,只表达入仓边界判断和拒绝线索。 |
| `ExternalSourceSummaryView` | `views_materials` C9 | summary changed;source / archive ref changed;summary view Query | 进入 summary view freshness 状态组,不得替代 summary truth。 |
| `ExternalBasisAcceptanceHistory` | `refs_trace_audit` D23 | summary accepted / disposition changed / superseded | 作为 acceptance 历史线索和传播输入,不作为当前状态 owner。 |
| `MethodAssetEvidenceLineage` | `refs_trace_audit` D21 | `LinkExternalEvidenceLineage`;`ExternalEvidenceLineageChanged` | 本批只记录 external refs / archive refs 对 lineage 的影响,完整 lineage 状态已在 R1.14 覆盖。 |
| inbound intake result | Step 7 Inbound Consumer | four external inbound consumers | 可作为 accepted / ignored / rejected intake disposition,但不进入正式 summary truth 状态表主体。 |

#### R1.17.3 状态组取舍

后续写入应拆成五组,避免把外部摘要、typed ref、正文边界、history 和 read view 混成一条 lifecycle:

| 状态组 | 建议 owner | 保留理由 | 不进入本组 |
|---|---|---|---|
| External summary lifecycle / disposition | `ExternalSourceSummary` | captured、accepted、rejected、unavailable、stale、superseded 直接影响正式化、追溯、关系和外围组织是否能引用外部依据。 | external source lifecycle、artifact storage lifecycle、provider status。 |
| External source / artifact ref boundary | `ExternalSourceRef`;`ArtifactArchiveRef` | registered、invalid、duplicate / reused、unavailable marker 防止 URL/path/provider id 私补。 | URL、文件路径、object storage path、signed URL、archive package。 |
| External body boundary disposition | `ExternalBodyBoundaryRule` | accepted body-free、candidate rejected、violation noticed 是本仓正文禁止红线。 | 内容审查、标准解释、治理审批执行、malware scan。 |
| External summary view freshness | `ExternalSourceSummaryView` | fresh、stale、rejected、unavailable 影响读取面和维护提示。 | summary truth 修改、external polling、view refresh worker。 |
| External basis acceptance history hint | `ExternalBasisAcceptanceHistory` | accepted / updated / invalid / suspended / rejected 的历史线索用于审计和解释。 | 当前 summary truth、治理执行正文、外部日志。 |

暂不单独建立的状态组:

| 排除状态组 | 原因 |
|---|---|
| external system lifecycle | 外部来源生命周期和权限归来源系统或相邻仓。 |
| artifact / archive retention lifecycle | artifact 创建、存储、删除、保留策略不归本仓。 |
| provider adapter / webhook delivery state | 本仓只承接 body-free inbound fact,不拥有 provider 传输或 webhook payload 状态。 |
| external source refresh / polling progress | 后台维护与收敛单独讨论,本批只保留 stale / unavailable / invalidation hint。 |
| evidence lineage lifecycle duplicate | `MethodAssetEvidenceLineage` 状态已在追溯与一致性保护中定义,本批只处理外部来源输入对它的影响。 |

#### R1.17.4 触发来源思考

后续写入时应把触发来源限定为:

| 触发来源 | 可影响 | 不可影响 |
|---|---|---|
| `CaptureExternalSourceSummary` | 建立 `ExternalSourceSummary` captured / pending boundary 状态。 | 不保存标准全文、ADR 正文、外部文档正文、provider payload 或 artifact body。 |
| `AcceptExternalBasisSummary` | 将外部摘要标记为 accepted / usable basis,记录 acceptance history。 | 不执行治理裁决、Gate、policy enforce 或标准解释。 |
| `MarkExternalBasisDisposition` | 标记 external basis rejected、unavailable、stale、suspended 等处置。 | 不同步修改 formal version、relation、trace、package 或 method set truth。 |
| `SupersedeExternalSourceSummary` | 将旧 summary 替换为后续 summary,保留历史线索。 | 不删除旧摘要,不重写已成立正式化结果。 |
| `RegisterExternalSourceRef` | 登记 opaque typed external source ref。 | 不从 URL、path、route param、provider id 或外部 id 私造 ref。 |
| `RegisterArtifactArchiveRef` | 登记 body-free artifact / archive ref 和 digest hint。 | 不保存文件内容、archive 包、证据正文、对象存储路径或 retention policy。 |
| `AssertExternalBodyBoundary` | 产生 body-free accepted / rejected / diagnostic marker。 | 不做内容审查、标准解释、治理审批或安全扫描实现。 |
| `RejectExternalBodyCandidate` | 记录正文候选被拒和 safe reason。 | 不保存被拒正文摘录、payload 片段、文件内容或证据正文。 |
| `LinkExternalEvidenceLineage` | 连接 external refs、artifact refs、digest hints 和 trace subject。 | 不保存 evidence body、artifact body、archive body 或验收报告正文。 |
| four external Inbound Consumers | 接收 body-free external fact,形成 intake summary 或后续 command handoff hint。 | 不接 raw document、webhook payload、provider payload、artifact body 或 evidence body。 |
| external Query family | 读取 summary/ref/archive/boundary/view/history/lineage hint。 | 不拉取外部系统,不注册 ref,不刷新 view,不摘要化正文。 |
| external summary/ref/body/lineage event candidates | 传播 external fact changed / violation noticed / lineage changed。 | 不写 topic、payload schema、outbox relay、delivery、retry。 |

#### R1.17.5 传播风险

外部摘要与引用状态会传播到正式化、追溯一致性、关系分发、外围组织、维护和验收材料,但传播必须保持 body-free:

| 来源变化 | 可传播到 | 风险控制 |
|---|---|---|
| summary captured / accepted | formalization basis、trace material、relation diagnostic、package composition input、event candidate。 | 不复制外部正文,不执行治理审批。 |
| summary rejected / body violation | boundary diagnostic、audit trail、maintenance follow-up、upstream correction hint。 | 不保存被拒正文,不把 rejection 当成外部来源不存在。 |
| summary unavailable / stale | formalization pending、trace / audit stale、external summary view stale、maintenance refresh hint。 | 不自动 external polling,不默认 reject。 |
| summary superseded | formalization basis reassessment hint、trace / audit history、view stale、event candidate。 | 不删除旧 summary,不重写已经成立的 truth。 |
| source ref registered / version hint changed | summary capture input、basis resolution、trace / relation / peripheral reads。 | 不暴露 URL、认证信息、provider payload 或外部 lifecycle。 |
| artifact archive ref registered | evidence lineage、audit handoff、验收材料解释、maintenance hint。 | 不保存 archive 包、文件内容、object storage path 或 retention policy。 |
| body boundary violation noticed | audit / diagnostic、上游修正、maintenance follow-up。 | 不返回 violation payload 或正文摘录。 |
| summary view stale / unavailable | Query freshness hint、maintenance refresh hint。 | 不在 Query 中刷新,不写 worker progress。 |

#### R1.17.6 排除项

本组成部分后续写入必须排除:

| 排除项 | 排除原因 |
|---|---|
| raw document、standard 全文、ADR 正文、治理记录正文 | 本仓只保存 safe summary / ref / digest hint。 |
| webhook payload、provider API response、external payload schema | Inbound 只能承接 body-free fact。 |
| artifact body、archive package、evidence file、object storage path、signed URL | artifact/archive 只以 `ArtifactArchiveRef` 和 digest hint 表达。 |
| URL / path / route param / provider id 直接成为 `ExternalSourceRef` | 必须使用 opaque typed ref,防止实现侧拼接。 |
| external content review、standard interpretation、governance approval execution | `ExternalBodyBoundaryRule` 只判断入仓边界。 |
| external source polling、availability worker、refresh progress | 后台维护与收敛单独讨论。 |
| Query 拉取外部系统或摘要化正文 | Query no-write / no-fetch。 |
| acceptance history 替代当前 summary truth | history 只解释外部依据承接变化。 |
| evidence lineage 保存证据正文或验收报告正文 | lineage 只连接 refs、digest hints 和 safe markers。 |
| external summary accepted 自动建立 formal version、relation 或 package truth | 其他组成部分只能引用 accepted summary,不能被它自动创建 truth。 |

#### R1.17.7 下一写入批次边界

下一批 `外部摘要与引用状态:再写入` 可以写:

1. owner 到对象 / 触发来源映射。
2. external summary lifecycle、source / archive ref boundary、body boundary disposition、summary view freshness、acceptance history hint 五组概要状态定义表。
3. 精简 ASCII 流转图。
4. 允许迁移和禁止迁移清单。
5. 传播影响表和停审记录。

不得写 Rust enum、字段全集、repository / port、DTO、DDL、外部正文、provider payload、webhook schema、artifact body、archive package、object storage path、标准解释、治理审批执行、external polling、source refresh worker、queue、retry、正式 §9 回填草稿或 Step 10 异常边界。

#### R1.17.8 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 只思考 owner、状态组取舍、触发来源、传播风险和排除项。 |
| 是否写完整状态定义表 | no | 未写状态类型 / 状态 / 含义 / 正常主线的完整表。 |
| 是否写状态流转图 | no | 未写 ASCII 状态图。 |
| 是否写允许 / 禁止迁移清单 | no | 迁移清单留给再写入。 |
| 是否以当前 Step 6 / Step 8 为准 | pass | 使用 `ExternalSourceSummary`、`ExternalSourceRef`、`ArtifactArchiveRef`、`ExternalBodyBoundaryRule`、`ExternalSourceSummaryView`、`ExternalBasisAcceptanceHistory` 和 R1.20 flow。 |
| 是否保持唯一 Inbound owner | pass | 外部 inbound 只由外部摘要与引用承接 body-free fact。 |
| 是否排除 raw body / provider payload / artifact body | pass | 已明确只允许 summary、typed ref、digest hint、marker 和 safe reason ref。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9 外部摘要与引用状态小循环。 |

next_allowed_action: 等待用户确认后进入 Step 9 `外部摘要与引用状态:再写入`;可写 owner 映射、五组概要状态定义表、精简 ASCII 流转图、允许 / 禁止迁移清单、传播影响表和停审记录,不得写 Rust enum、字段全集、repository / port、DTO、DDL、外部正文、provider payload、webhook schema、artifact body、archive package、object storage path、标准解释、治理审批执行、external polling、source refresh worker、queue、retry,不得修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.18 外部摘要与引用状态:再写入

#### R1.18.1 本组成部分写入说明

本模块只把 `R1.17` 的外部摘要与引用状态裁决落成概要级状态机材料。写入范围包括 external summary lifecycle / disposition、external source / artifact ref boundary、external body boundary disposition、external summary view freshness、external basis acceptance history hint 五组状态。

本模块不写外部正文、provider payload、webhook schema、artifact body、archive package、object storage path、signed URL、标准解释、治理审批执行、external polling、source refresh worker、queue、retry、repository / port、DTO、DDL 或正式 §9 回填草稿。

#### R1.18.2 owner 映射

| owner | Step 6 来源 | Step 8 / Step 7 触发来源 | 本模块状态职责 |
|---|---|---|---|
| `ExternalSourceSummary` | `core_truth` A7 / support summary | `CaptureExternalSourceSummary`;`AcceptExternalBasisSummary`;`MarkExternalBasisDisposition`;`SupersedeExternalSourceSummary`;`ConsumeBodyFreeExternalSummaryAccepted` | 表达 external summary captured、accepted、rejected、unavailable、stale、superseded。 |
| `ExternalSourceRef` | `refs_trace_audit` D10 | `RegisterExternalSourceRef`;`ConsumeExternalSourceRefRegistered`;`ResolveExternalSourceRef`;`ExternalSourceRefChanged` | 表达 source ref registered、duplicate / reused、invalid、unavailable marker。 |
| `ArtifactArchiveRef` | `refs_trace_audit` D11 | `RegisterArtifactArchiveRef`;`ConsumeArtifactArchiveRefRegistered`;`GetArtifactArchiveRef`;`ArtifactArchiveRefChanged` | 表达 archive ref registered、digest changed、invalid、unavailable marker。 |
| `ExternalBodyBoundaryRule` | `policies_guards` B4 | `AssertExternalBodyBoundary`;`RejectExternalBodyCandidate`;`ConsumeExternalBodyBoundaryViolation`;`ExternalBodyBoundaryViolationNoticed` | 表达 body-free accepted、candidate rejected、violation noticed。 |
| `ExternalSourceSummaryView` | `views_materials` C9 | summary changed;source / archive ref changed;summary view Query | 表达 external summary view fresh、stale、rejected、unavailable。 |
| `ExternalBasisAcceptanceHistory` | `refs_trace_audit` D23 | summary accepted / disposition changed / superseded | 记录 accepted、updated、invalidated、suspended、rejected 历史线索,不成为当前 summary truth。 |
| `MethodAssetEvidenceLineage` | `refs_trace_audit` D21 | `LinkExternalEvidenceLineage`;`ExternalEvidenceLineageChanged` | 只承接 external refs / archive refs 对 evidence lineage 的影响,完整 lineage 状态沿用 R1.14。 |
| external inbound intake result | Step 7 Inbound Consumer | four external inbound consumers | 表达 accepted / ignored / rejected intake disposition,不直接成为 summary truth。 |

#### R1.18.3 状态定义表

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 |
|---|---|---|---|
| External summary | `ExternalSummaryCaptured` | 外部安全摘要已按 typed source / marker / digest 进入本仓。 | 有条件,需后续 accepted 或 disposition。 |
| External summary | `ExternalSummaryAccepted` | 摘要通过 body-free 和 basis acceptance 判断,可被正式化、追溯、关系或外围组织引用。 | 是。 |
| External summary | `ExternalSummaryRejected` | 摘要因正文、来源、权限或安全边界原因不可使用。 | 否。 |
| External summary | `ExternalSummaryUnavailable` | 外部来源或摘要暂不可用、不可解析或不可判定。 | 有条件,读取必须暴露 unavailable。 |
| External summary | `ExternalSummaryStale` | 来源版本、digest、artifact ref 或边界状态变化后待复核。 | 有条件。 |
| External summary | `ExternalSummarySuperseded` | 摘要已被后续来源版本或更安全摘要替代。 | 否,保留历史解释。 |
| Source / archive ref | `ExternalSourceRefRegistered` | 外部来源 typed ref 已登记。 | 是。 |
| Source / archive ref | `ExternalSourceRefDuplicateReused` | 相同来源 ref 已存在,本次登记复用既有 ref。 | 是。 |
| Source / archive ref | `ExternalSourceRefInvalid` | 来源 ref 候选不满足 typed boundary 或 body-free 边界。 | 否。 |
| Source / archive ref | `ExternalSourceRefUnavailable` | 来源引用暂不可解析或不可判定。 | 有条件。 |
| Source / archive ref | `ArtifactArchiveRefRegistered` | artifact / archive body-free ref 已登记。 | 是。 |
| Source / archive ref | `ArtifactArchiveDigestChanged` | archive digest hint 或 marker 发生变化。 | 有条件,会触发 view / lineage stale。 |
| Source / archive ref | `ArtifactArchiveRefInvalid` | archive ref 候选不满足 body-free / typed boundary。 | 否。 |
| Source / archive ref | `ArtifactArchiveRefUnavailable` | archive ref 暂不可解析或不可判定。 | 有条件。 |
| Body boundary | `ExternalBodyFreeAccepted` | 候选材料满足 summary-only / ref-only / marker-only 入仓边界。 | 是。 |
| Body boundary | `ExternalBodyCandidateRejected` | 外部正文候选被显式拒绝。 | 否。 |
| Body boundary | `ExternalBodyViolationNoticed` | 外部边界违规事实已被记录为 safe violation summary。 | 否,只作为诊断 / 修正线索。 |
| Body boundary | `ExternalBodyBoundaryUnknown` | 现有 marker 或 refs 不足以判定正文边界。 | 有条件,不得作为 accepted。 |
| Summary view | `ExternalSummaryViewFresh` | view 与当前 accepted / captured summary 对齐。 | 是。 |
| Summary view | `ExternalSummaryViewStale` | summary、source ref、archive ref、digest 或 disposition 变化后待刷新。 | 有条件。 |
| Summary view | `ExternalSummaryViewRejected` | 来源违反正文边界,不得输出 view。 | 否。 |
| Summary view | `ExternalSummaryViewUnavailable` | view 暂不可用。 | 否,但不反写 summary truth。 |
| Acceptance history | `ExternalBasisAcceptedHistory` | 记录外部依据被接受的历史线索。 | 是,作为历史解释。 |
| Acceptance history | `ExternalBasisUpdatedHistory` | 记录外部依据更新或 digest / source hint 改变。 | 有条件。 |
| Acceptance history | `ExternalBasisInvalidatedHistory` | 记录外部依据失效或不再适用。 | 否,作为历史解释。 |
| Acceptance history | `ExternalBasisSuspendedHistory` | 记录外部依据暂挂或等待复核。 | 有条件。 |
| Acceptance history | `ExternalBasisRejectedHistory` | 记录外部依据被拒绝。 | 否。 |

#### R1.18.4 概要状态流转图

```text
+================================================================+
|                External Summary / Reference State Flow          |
+================================================================+
| ExternalSourceSummary                                           |
|   <capture safe summary>                                        |
|        |                                                        |
|        v                                                        |
|   ExternalSummaryCaptured ---- accept ------------------------> ExternalSummaryAccepted |
|        | mark rejected                                          |
|        +------------------------------------> ExternalSummaryRejected |
|        | source unavailable                                     |
|        +------------------------------------> ExternalSummaryUnavailable |
|        | source / digest / boundary changed                     |
|        +------------------------------------> ExternalSummaryStale |
|        | supersede                                              |
|        +------------------------------------> ExternalSummarySuperseded |
|                                                                 |
| ExternalSourceRef / ArtifactArchiveRef                          |
|   <register typed ref>                                          |
|        |                                                        |
|        +--> ExternalSourceRefRegistered                         |
|        |        | duplicate                                     |
|        |        +--------------------------> ExternalSourceRefDuplicateReused |
|        |        | invalid / unavailable                         |
|        |        +--------------------------> ExternalSourceRefInvalid / ExternalSourceRefUnavailable |
|        |                                                        |
|        +--> ArtifactArchiveRefRegistered                        |
|                 | digest changed                                |
|                 +-------------------------> ArtifactArchiveDigestChanged |
|                 | invalid / unavailable                         |
|                 +-------------------------> ArtifactArchiveRefInvalid / ArtifactArchiveRefUnavailable |
|                                                                 |
| ExternalBodyBoundaryRule                                        |
|   ExternalBodyFreeAccepted                                      |
|        | unsafe body candidate                                  |
|        +------------------------------------> ExternalBodyCandidateRejected |
|        | inbound violation                                      |
|        +------------------------------------> ExternalBodyViolationNoticed |
|        | insufficient marker                                    |
|        +------------------------------------> ExternalBodyBoundaryUnknown |
|                                                                 |
| ExternalSourceSummaryView                                       |
|   ExternalSummaryViewFresh ---- summary/source changed ------> ExternalSummaryViewStale |
|        | rejected source                                        |
|        +------------------------------------> ExternalSummaryViewRejected |
|        | unavailable                                            |
|        +------------------------------------> ExternalSummaryViewUnavailable |
|                                                                 |
| ExternalBasisAcceptanceHistory                                  |
|   accepted / updated / invalidated / suspended / rejected       |
|   are append-only history hints, not current summary truth.      |
+================================================================+
```

关键说明:

- `ExternalSummaryRejected` 和 `ExternalBodyCandidateRejected` 不保存被拒正文,只保存 safe reason / violation marker。
- `ExternalSummaryUnavailable` 与 `ExternalSummaryRejected` 不同;unavailable 不得被默认解释为拒绝或不存在。
- `ExternalSourceRefRegistered` 不代表外部来源可信、可用或已被正式化引用。
- `ExternalSummaryViewStale` 只提示后续维护,不在 Query 中刷新。
- acceptance history 是 append-only 解释线索,不替代 `ExternalSourceSummary` 当前处置。

#### R1.18.5 允许迁移清单

| owner | 允许迁移 | 触发动作 |
|---|---|---|
| `ExternalSourceSummary` | create -> `ExternalSummaryCaptured` | `CaptureExternalSourceSummary` 或 `ConsumeBodyFreeExternalSummaryAccepted` accepted with body-free marker / digest。 |
| `ExternalSourceSummary` | `ExternalSummaryCaptured / ExternalSummaryStale / ExternalSummaryUnavailable -> ExternalSummaryAccepted` | `AcceptExternalBasisSummary` accepted with safe reason。 |
| `ExternalSourceSummary` | `ExternalSummaryCaptured / ExternalSummaryAccepted / ExternalSummaryStale -> ExternalSummaryRejected` | `MarkExternalBasisDisposition` or boundary rejection marks unusable。 |
| `ExternalSourceSummary` | any active summary state -> `ExternalSummaryUnavailable` | source / summary temporarily unavailable or undecidable。 |
| `ExternalSourceSummary` | `ExternalSummaryAccepted / ExternalSummaryCaptured -> ExternalSummaryStale` | source version, digest, archive ref or boundary input changed。 |
| `ExternalSourceSummary` | any active summary state -> `ExternalSummarySuperseded` | `SupersedeExternalSourceSummary` links next summary ref。 |
| `ExternalSourceRef` | create -> `ExternalSourceRefRegistered` | `RegisterExternalSourceRef` or inbound source ref registered fact。 |
| `ExternalSourceRef` | `ExternalSourceRefRegistered -> ExternalSourceRefDuplicateReused` | duplicate typed ref found and reused idempotently。 |
| `ExternalSourceRef` | candidate -> `ExternalSourceRefInvalid` | candidate fails typed boundary or body-free rule。 |
| `ExternalSourceRef` | any source ref state -> `ExternalSourceRefUnavailable` | source ref cannot be resolved or verified by current material。 |
| `ArtifactArchiveRef` | create -> `ArtifactArchiveRefRegistered` | `RegisterArtifactArchiveRef` or inbound archive ref registered fact。 |
| `ArtifactArchiveRef` | `ArtifactArchiveRefRegistered -> ArtifactArchiveDigestChanged` | digest hint or archive marker changed。 |
| `ArtifactArchiveRef` | candidate -> `ArtifactArchiveRefInvalid` | candidate includes body/path/storage payload or fails typed boundary。 |
| `ArtifactArchiveRef` | any archive ref state -> `ArtifactArchiveRefUnavailable` | archive ref cannot be resolved or verified by current material。 |
| `ExternalBodyBoundaryRule` | evaluate -> `ExternalBodyFreeAccepted` | `AssertExternalBodyBoundary` confirms summary/ref/marker-only material。 |
| `ExternalBodyBoundaryRule` | evaluate -> `ExternalBodyCandidateRejected` | `RejectExternalBodyCandidate` rejects unsafe body candidate。 |
| `ExternalBodyBoundaryRule` | inbound / evaluate -> `ExternalBodyViolationNoticed` | `ConsumeExternalBodyBoundaryViolation` or boundary assertion records violation。 |
| `ExternalBodyBoundaryRule` | evaluate -> `ExternalBodyBoundaryUnknown` | marker / refs insufficient to decide safely。 |
| `ExternalSourceSummaryView` | create / refresh -> `ExternalSummaryViewFresh` | view aligns with current body-free summary source。 |
| `ExternalSourceSummaryView` | `ExternalSummaryViewFresh -> ExternalSummaryViewStale` | summary, source ref, archive ref, digest or disposition changed。 |
| `ExternalSourceSummaryView` | any view state -> `ExternalSummaryViewRejected` | source violates body boundary and view must not output。 |
| `ExternalSourceSummaryView` | any view state -> `ExternalSummaryViewUnavailable` | view temporarily unavailable。 |
| `ExternalBasisAcceptanceHistory` | append -> `ExternalBasisAcceptedHistory` | summary accepted。 |
| `ExternalBasisAcceptanceHistory` | append -> `ExternalBasisUpdatedHistory` | source / digest / disposition changed。 |
| `ExternalBasisAcceptanceHistory` | append -> `ExternalBasisInvalidatedHistory` | accepted basis invalidated or no longer applicable。 |
| `ExternalBasisAcceptanceHistory` | append -> `ExternalBasisSuspendedHistory` | basis waiting for review or unavailable material。 |
| `ExternalBasisAcceptanceHistory` | append -> `ExternalBasisRejectedHistory` | basis rejected with safe reason。 |

#### R1.18.6 禁止迁移清单

| 禁止迁移或行为 | 原因 |
|---|---|
| raw document / standard / ADR / governance body -> `ExternalSummaryCaptured` | captured summary 只能来自 safe summary / marker / digest。 |
| URL / file path / route param / provider id -> `ExternalSourceRefRegistered` | source ref 必须是 opaque typed ref。 |
| object storage path / signed URL / archive package -> `ArtifactArchiveRefRegistered` | archive ref 不能保存路径、URL 或包体。 |
| `ExternalBodyBoundaryUnknown -> ExternalBodyFreeAccepted` without formal marker | unknown 不得默认 accepted。 |
| `ExternalSummaryUnavailable -> ExternalSummaryRejected` by default | unavailable 不等于拒绝或不存在。 |
| `ExternalSummaryAccepted` 自动建立 formal version、relation、trace 或 package truth | accepted summary 只是输入,不能创建其他 truth。 |
| `ExternalSummarySuperseded` hard delete old summary | 旧 summary 仍用于 trace、audit、history 和依据解释。 |
| `ExternalSummaryViewStale` 自动拉取外部系统或刷新 view | Query / view stale 不执行外部 polling 或 worker。 |
| acceptance history 替代 `ExternalSourceSummary` 当前处置 | history 是解释线索。 |
| inbound consumer 接收 webhook payload、provider payload、artifact body 或 evidence body | Inbound 只承接 body-free fact。 |
| boundary rejection 保存被拒正文摘录或 payload 片段 | 违反正文禁止边界。 |
| `ExternalBodyBoundaryRule` 执行内容审查、标准解释、治理审批或 malware scan | boundary rule 只判断入仓边界。 |

#### R1.18.7 传播影响

| 来源状态变化 | 必须传播到 | 不允许传播到 |
|---|---|---|
| `ExternalSummaryCaptured` / `ExternalSummaryAccepted` | formalization basis、trace material、relation diagnostic、peripheral composition input、event candidate。 | 外部正文、治理执行、standard interpretation。 |
| `ExternalSummaryRejected` | body boundary diagnostic、audit trail、maintenance follow-up、upstream correction hint。 | 被拒正文保存、默认删除 source ref。 |
| `ExternalSummaryUnavailable` / `ExternalSummaryStale` | formalization pending、summary view stale、trace / audit stale、maintenance refresh hint。 | 默认 reject、external polling started。 |
| `ExternalSummarySuperseded` | basis reassessment hint、acceptance history、summary view stale、event candidate。 | hard delete、已成立 truth rewrite。 |
| `ExternalSourceRefRegistered` / `ExternalSourceRefDuplicateReused` | summary capture input、basis resolution、trace / relation / peripheral reads。 | URL、认证信息、provider payload 暴露。 |
| `ExternalSourceRefInvalid` / `ExternalSourceRefUnavailable` | diagnostic read surface、maintenance follow-up、summary unavailable。 | 私造 fallback ref、从字符串拼接 ref。 |
| `ArtifactArchiveRefRegistered` / `ArtifactArchiveDigestChanged` | evidence lineage、audit handoff、验收解释、summary view stale。 | archive 包体、文件内容、object storage path。 |
| `ArtifactArchiveRefInvalid` / `ArtifactArchiveRefUnavailable` | lineage partial / unavailable、maintenance follow-up、diagnostic。 | 自动下载或复制 artifact。 |
| `ExternalBodyCandidateRejected` / `ExternalBodyViolationNoticed` | audit / diagnostic、upstream correction、maintenance follow-up。 | violation payload、正文摘录、evidence body。 |
| `ExternalSummaryViewStale` / `ExternalSummaryViewUnavailable` | Query freshness hint、maintenance refresh hint。 | worker progress、external fetch、provider adapter state。 |
| `ExternalBasisAcceptedHistory` / updated / invalidated / suspended / rejected | trace / audit / formalization explanation、event candidate。 | 当前 summary truth 替代、治理执行正文。 |

#### R1.18.8 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| owner 是否回指 Step 6 | pass | external summary、source ref、archive ref、body boundary、summary view、acceptance history 均来自 Step 6。 |
| 触发来源是否回指 Step 7 / Step 8 | pass | 使用当前 R1 的 external summary lifecycle、source/archive ref、body boundary、lineage、inbound 和 read flow。 |
| 是否拆分 summary / ref / body boundary / view / history | pass | 五组状态分别定义,未混为统一 lifecycle。 |
| 是否写入状态定义表 | pass | 已写概要状态定义表,未写 Rust enum 或字段全集。 |
| 是否写入流转图和迁移清单 | pass | 已写精简 ASCII 图和概要允许 / 禁止迁移。 |
| 是否保持唯一 Inbound owner | pass | Inbound 只承接 body-free external fact。 |
| 是否排除 raw body / provider payload / artifact body | pass | 已排除外部正文、webhook/provider payload、archive 包、evidence body。 |
| 是否排除内容审查 / 标准解释 / 治理执行 | pass | boundary 只做入仓边界判断。 |
| 是否排除 external polling / worker / queue | pass | 只保留 stale / unavailable / diagnostic hint,维护执行后置。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9。 |

next_allowed_action: 等待用户确认后进入 Step 9 `后台维护与收敛状态:先思考`;只思考 read material refresh、trace refresh、consistency recovery、maintenance progress、maintenance request/suspension/intervention 的 owner 范围、状态组取舍、触发来源、传播风险和排除项,不得写完整状态定义表、状态流转图、允许 / 禁止迁移清单,不得修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.19 后台维护与收敛状态:先思考

#### R1.19.1 问题回答

本批只思考 `后台维护与收敛` 的状态 owner 和状态组边界,不直接写完整状态定义表、状态流转图、允许 / 禁止迁移清单或正式 §9 回填草稿。

需要回答的问题:

1. 维护请求、读取材料刷新、追溯材料刷新、一致性恢复、维护进度和运行历史分别由哪些对象拥有状态。
2. maintenance request / control、read refresh、trace refresh、recovery convergence、progress / history 是否应拆成不同状态组。
3. Step 8 的 `MaintenanceRequestControlFlow`、`ReadMaterialRefreshJobFlow`、`TraceAuditImpactRefreshJobFlow`、`ConsistencyRecoveryConvergenceFlow`、`MaintenanceProgressReadFlow` 如何映射状态变化。
4. 哪些状态只是 run / progress / history / issue hint,不能反写 core truth。
5. 哪些旧主线必须排除,尤其是 worker loop、scheduler、queue、retry、outbox replay、snapshot export、fingerprint recalculation 和自动 truth repair。

当前判断:

- `ReadMaterialRefreshTask` 是 read material refresh 状态 owner,负责 pending、in progress、converged、stale、unavailable 等刷新语义。
- `TraceMaterialRefreshTask` 是 trace / audit / impact / lineage refresh 状态 owner,负责 pending、in progress、partial、converged、unavailable 等 body-free 刷新语义。
- `ConsistencyRecoveryTask` 是 recovery convergence 状态 owner,负责 recovery needed、pending acknowledgement、converged、suspended、rejected、formal intervention required 等收敛语义,但不自动修复 truth。
- `MaintenanceProgressView` 是维护可见状态 owner,负责 pending、stale、recovery needed、converged、unavailable 等读取口径,不得替代 task truth。
- `MaintenanceRunRef` 与 `RefreshScopeRef` 是 run / scope selector,可以限定状态作用域,但不单独拥有业务 lifecycle。
- `MaintenanceRunHistory` 只记录 body-free run outcome / scope / task 历史线索,不成为当前任务或进度 truth。

#### R1.19.2 当前 owner 来源判断

| owner 候选 | Step 6 来源 | Step 8 / Step 7 触发来源 | 当前判断 |
|---|---|---|---|
| `ReadMaterialRefreshTask` | `operations_peripheral` E1 | `RequestReadMaterialRefresh`;`RefreshCatalogAndDefinitionReadMaterials`;`RefreshFormalVersionReadMaterials`;`RefreshConsumptionReadMaterials`;`RefreshRelationDistributionMaterials`;`RefreshExternalSummaryReadMaterials`;`RefreshPeripheralReadMaterials`;`MethodAssetReadMaterialRefreshChanged` | 必须进入本批状态组,承载读取材料刷新语义。 |
| `TraceMaterialRefreshTask` | `operations_peripheral` E2 | `RequestTraceMaterialRefresh`;`RefreshTraceAuditImpactMaterials`;`MethodAssetTraceMaterialRefreshChanged` | 必须进入本批状态组,承载 trace / audit / impact 刷新语义。 |
| `ConsistencyRecoveryTask` | `operations_peripheral` E3 | `RequestConsistencyRecovery`;`MarkMaintenanceSuspended`;`RequireMaintenanceFormalIntervention`;`SupersedeMaintenanceRequest`;`RunConsistencyRecoveryConvergence`;`MethodAssetConsistencyRecoveryChanged` | 必须进入本批状态组,承载 recovery convergence 和 formal intervention 线索。 |
| `MaintenanceProgressView` | `views_materials` C10 | maintenance request / refresh / recovery changed;maintenance Query | 进入 progress 状态组,表达 body-free 可见进度。 |
| `MaintenanceRunRef` | `refs_trace_audit` D12 | maintenance request accepted;job execution scope;progress read | 作为 run selector 和状态聚合锚点,不单独写 lifecycle。 |
| `RefreshScopeRef` | `refs_trace_audit` D13 | maintenance request accepted;scope progress Query | 作为 scope selector 和传播边界,不单独写 lifecycle。 |
| `MaintenanceRunHistory` | `refs_trace_audit` D24 | maintenance request / job / recovery outcome changed | 作为 append-only run outcome 线索,不作为当前状态 owner。 |
| maintenance issue / pending scope hint | progress/task Query and event candidates | progress changed;pending scopes listed | 可作为 progress/read output,但不独立成核心状态 owner。 |

#### R1.19.3 状态组取舍

后续写入应拆成五组,避免把任务语义、恢复收敛、progress 视图和运行历史混成一条 lifecycle:

| 状态组 | 建议 owner | 保留理由 | 不进入本组 |
|---|---|---|---|
| Maintenance request / control state | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask` + `MaintenanceRunRef` | requested、superseded、suspended、formal intervention required 直接体现维护意图和控制边界。 | worker id、queue id、scheduler id、retry token。 |
| Read material refresh state | `ReadMaterialRefreshTask` | pending、in progress、converged、stale、unavailable 影响目录、正式化、消费、关系、外部、外围读取材料。 | core truth repair、cache/index/store implementation。 |
| Trace / audit / impact refresh state | `TraceMaterialRefreshTask` | partial、converged、blocked、unavailable 影响 trace、audit、impact、evidence lineage 读取材料。 | raw log、telemetry、evidence body、report body。 |
| Consistency recovery convergence state | `ConsistencyRecoveryTask` | recovery needed、pending acknowledgement、converged、suspended、rejected、formal intervention required 体现收敛结果和边界。 | 自动修复 truth、重做正式化、绕过消费边界。 |
| Maintenance progress / history state | `MaintenanceProgressView`;`MaintenanceRunHistory` | progress read model 和 run history 共同支撑运维可见性、审计和 pending scope 读取。 | worker loop、cron、lock、retry、metrics body、raw incident report。 |

暂不单独建立的状态组:

| 排除状态组 | 原因 |
|---|---|
| worker / scheduler / queue lifecycle | 属于实现和运维细节,不进入概要 §9。 |
| outbox replay / delivery retry lifecycle | 本轮不恢复旧 outbox / replay 主线。 |
| snapshot export / fingerprint recalculation lifecycle | 已被当前 read material / refresh / recovery 语义替代。 |
| maintenance telemetry lifecycle | metric、trace span、raw log 不是设计状态 owner。 |
| peripheral truth lifecycle | package / method set truth 后续单独讨论,这里只处理 `RefreshPeripheralReadMaterials` 的维护语义。 |

#### R1.19.4 触发来源思考

后续写入时应把触发来源限定为:

| 触发来源 | 可影响 | 不可影响 |
|---|---|---|
| `RequestReadMaterialRefresh` | 建立 read refresh task request / pending 状态。 | 不在 Command 中执行刷新,不修改 definition、catalog、formal version、relation、external summary 或 package truth。 |
| `RequestTraceMaterialRefresh` | 建立 trace refresh task request / pending 状态。 | 不保存 raw log、trace span、event payload、evidence body、report body 或 artifact body。 |
| `RequestConsistencyRecovery` | 建立 recovery needed / pending 状态和 affected scope。 | 不自动修复 core truth,不重做正式化,不绕过消费或外部正文边界。 |
| `MarkMaintenanceSuspended` | 将维护或恢复标记为 suspended。 | 不把 suspended 解释为 truth 不成立,不复制外部正文补齐。 |
| `RequireMaintenanceFormalIntervention` | 将 recovery 标记为 formal intervention required。 | 不直接执行治理审批、正式化裁决、版本替代或消费边界修改。 |
| `SupersedeMaintenanceRequest` | 用后续 run 替代旧维护请求。 | 不删除旧 run history,不重放 worker 任务。 |
| six read material refresh jobs | 推动 read refresh task 进入 in progress / converged / stale / unavailable / partial。 | 不修改来源 truth,不写 worker/scheduler/queue 实现。 |
| `RefreshTraceAuditImpactMaterials` | 推动 trace refresh task 进入 in progress / partial / converged / unavailable。 | 不保存 raw log、evidence body、report body、artifact/archive 包体。 |
| `RunConsistencyRecoveryConvergence` | 推动 recovery convergence 状态演进。 | 不自动修复 truth,不复制外部正文,不扫描下游运行 truth。 |
| maintenance Query family | 读取 progress、task summary、run history、pending scopes。 | 不触发 job、不确认 issue、不修复 truth。 |
| maintenance events | 传播 maintenance requested / refresh changed / recovery changed / progress changed。 | 不写 topic、payload schema、worker scheduling、queue、retry。 |

#### R1.19.5 传播风险

后台维护与收敛状态会传播到各读取面、追溯审计、正式流程和外围读取,但必须保持 body-free 和 no truth repair:

| 来源变化 | 可传播到 | 风险控制 |
|---|---|---|
| maintenance requested / superseded / suspended | progress view、run history、event candidate、pending scope page。 | 不触发 job 细节泄漏,不把 request 当执行完成。 |
| read refresh pending / stale / unavailable | catalog / version / consumption / relation / external / peripheral read freshness hints。 | 不修改任何来源 truth,不隐式修复 stale。 |
| read refresh converged | progress view、material freshness cleared、event candidate。 | 只表示派生材料对齐,不表示 truth 改变。 |
| trace refresh partial / unavailable | trace / audit / impact read hints、maintenance follow-up。 | 不补 raw log 或 evidence body。 |
| recovery needed / pending acknowledgement | progress view、formal intervention hint、consistency diagnostic。 | 不自动声明已收敛或已修复。 |
| recovery converged | progress view、audit / diagnostic、event candidate。 | 不代表 core truth 自动修复,仅表示收敛判断完成。 |
| recovery suspended / rejected / formal intervention required | maintenance read、正式流程承接、audit trail。 | 不复制外部正文,不绕过正式流程。 |
| progress unavailable / stale | Query unavailable / stale hint、maintenance follow-up。 | 不返回 worker state、queue depth、metrics body。 |
| run history outcome changed | audit / diagnostic / pending scope reads。 | 不替代当前 task state,不暴露 raw incident report。 |

#### R1.19.6 排除项

本组成部分后续写入必须排除:

| 排除项 | 排除原因 |
|---|---|
| worker、scheduler、queue、lock、retry、cron 状态 | 属于实现与运维细节。 |
| outbox replay、delivery retry、relay lifecycle | 本轮不恢复旧 outbox / replay 主线。 |
| snapshot export、fingerprint recalculation、index rebuild 主线 | 已由当前 refresh / recovery 语义替代。 |
| 自动修复 definition、formal version、relation、external summary 或 package truth | maintenance 只能刷新材料和记录收敛语义。 |
| 重做正式化、扩大消费边界、扫描下游运行状态 | 这些只能由对应业务或相邻系统负责。 |
| raw log、telemetry、trace span、metrics body、incident report body | progress / history / task 只保存 body-free summary 和 issue refs。 |
| evidence body、report body、artifact/archive 包体 | trace / recovery 刷新必须保持 body-free。 |
| Query 启动 job、确认 issue 或修复 truth | Query no-write。 |
| maintenance progress 替代 task truth | progress view 是 read model,不是任务真相源。 |
| maintenance event 变成 worker 调度消息 | 事件只表达维护事实变化。 |

#### R1.19.7 下一写入批次边界

下一批 `后台维护与收敛状态:再写入` 可以写:

1. owner 到对象 / 触发来源映射。
2. maintenance request/control、read refresh、trace refresh、recovery convergence、progress/history 五组概要状态定义表。
3. 精简 ASCII 流转图。
4. 允许迁移和禁止迁移清单。
5. 传播影响表和停审记录。

不得写 Rust enum、字段全集、repository / port、DTO、DDL、worker、scheduler、queue、lock、retry、outbox replay、snapshot export、fingerprint recalculation、raw log、telemetry、evidence body、report body、artifact body、正式 §9 回填草稿或 Step 10 异常边界。

#### R1.19.8 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 只思考 owner、状态组取舍、触发来源、传播风险和排除项。 |
| 是否写完整状态定义表 | no | 未写状态类型 / 状态 / 含义 / 正常主线的完整表。 |
| 是否写状态流转图 | no | 未写 ASCII 状态图。 |
| 是否写允许 / 禁止迁移清单 | no | 迁移清单留给再写入。 |
| 是否以当前 Step 6 / Step 8 为准 | pass | 使用 `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask`、`MaintenanceProgressView`、`MaintenanceRunRef`、`RefreshScopeRef`、`MaintenanceRunHistory` 和 R1.22 flow。 |
| 是否排除 worker / scheduler / queue / retry | pass | 已明确只允许 task、run、scope、progress、issue 和 body-free outcome 语义。 |
| 是否排除 core truth repair | pass | 已明确 maintenance 不自动修复业务 truth。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9 后台维护与收敛状态小循环。 |

next_allowed_action: 等待用户确认后进入 Step 9 `后台维护与收敛状态:再写入`;可写 owner 映射、五组概要状态定义表、精简 ASCII 流转图、允许 / 禁止迁移清单、传播影响表和停审记录,不得写 Rust enum、字段全集、repository / port、DTO、DDL、worker、scheduler、queue、lock、retry、outbox replay、snapshot export、fingerprint recalculation、raw log、telemetry、evidence body、report body、artifact body,不得修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.20 后台维护与收敛状态:再写入

#### R1.20.1 本组成部分写入说明

本模块只写 `后台维护与收敛` 的概要状态定义,覆盖 maintenance request / control、read material refresh、trace / audit / impact refresh、consistency recovery convergence、maintenance progress / history 五组状态。它只表达 body-free 的任务、收敛、可见进度和历史线索,不进入 worker、scheduler、queue、lock、retry、telemetry、artifact body 或 core truth repair。

维护状态的统一边界如下:

- `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask` 拥有任务 / 恢复真相源。
- `MaintenanceProgressView` 只拥有可见进度,不能替代 task truth。
- `MaintenanceRunHistory` 只保留 append-only 历史线索,不能反写当前 run。
- `MaintenanceRunRef`、`RefreshScopeRef` 只做 run / scope 锚点,不单独拥有生命周期。
- 所有维护状态都只能刷新派生读取材料、推进收敛判断、暴露 safe reason / marker / history hint,不得建立、撤销或修复 definition、formal version、relation、external summary、package 或 method set truth。

#### R1.20.2 owner 映射

| owner | Step 6 来源 | Step 8 / Step 7 触发来源 | 本模块状态职责 |
|---|---|---|---|
| `ReadMaterialRefreshTask` | `operations_peripheral` E1 | `RequestReadMaterialRefresh`;6 个 read material refresh jobs;`MarkMaintenanceSuspended`;`SupersedeMaintenanceRequest`;maintenance changed event。 | 表达 read material refresh request、pending、in progress、partial、converged、stale、unavailable 和 control 语义。 |
| `TraceMaterialRefreshTask` | `operations_peripheral` E2 | `RequestTraceMaterialRefresh`;`RefreshTraceAuditImpactMaterials`;`MarkMaintenanceSuspended`;`SupersedeMaintenanceRequest`;maintenance changed event。 | 表达 trace / audit / impact / lineage refresh request、partial、blocked、converged、unavailable 和 control 语义。 |
| `ConsistencyRecoveryTask` | `operations_peripheral` E3 | `RequestConsistencyRecovery`;`RunConsistencyRecoveryConvergence`;`MarkMaintenanceSuspended`;`RequireMaintenanceFormalIntervention`;`SupersedeMaintenanceRequest`;maintenance changed event。 | 表达 recovery needed、pending acknowledgement、converged、suspended、rejected、formal intervention required。 |
| `MaintenanceProgressView` | `views_materials` C10 | task / recovery changed;progress Query family。 | 表达 run / scope 维度下 pending、converging、recovery needed、converged、stale、unavailable 的可见进度。 |
| `MaintenanceRunHistory` | `refs_trace_audit` D24 | request accepted;refresh / recovery outcome changed;superseded / intervention changed。 | 表达 append-only run outcome、superseded hint、formal intervention hint,不替代当前 task state。 |
| `MaintenanceRunRef` | `refs_trace_audit` D12 | maintenance request accepted;progress / history read。 | 作为状态聚合锚点,不单独成为状态 owner。 |
| `RefreshScopeRef` | `refs_trace_audit` D13 | maintenance request accepted;scope progress Query。 | 作为 refresh / recovery 范围边界,不单独成为状态 owner。 |

#### R1.20.3 五组概要状态定义表

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 |
|---|---|---|---|
| Maintenance request / control | `MaintenanceRequestRegistered` | 维护请求已登记,等待后续 refresh 或 recovery flow 承接。 | 是,但不等于已执行。 |
| Maintenance request / control | `MaintenanceRequestSuperseded` | 当前 run 已被后续 run 替代,保留历史解释。 | 否,只保留历史。 |
| Maintenance request / control | `MaintenanceSuspended` | 维护因边界冲突、外部依据缺失或上游未闭合而挂起。 | 否。 |
| Maintenance request / control | `MaintenanceFormalInterventionRequired` | 维护不能在当前 operation semantic 内闭合,需正式流程或人工介入。 | 否。 |
| Read material refresh | `ReadRefreshPending` | 已登记读取材料刷新请求,等待 job 承接。 | 是。 |
| Read material refresh | `ReadRefreshInProgress` | refresh job 正在刷新 catalog / version / consumption / relation / external / peripheral 派生材料。 | 是。 |
| Read material refresh | `ReadRefreshPartiallyConverged` | 部分材料已刷新,部分仍受边界、缺失或 stale 影响。 | 有条件。 |
| Read material refresh | `ReadRefreshConverged` | 目标读取材料与当前 truth / boundary 已重新对齐。 | 是,但只表示派生材料对齐。 |
| Read material refresh | `ReadRefreshStale` | 来源 truth 或 boundary 再次变化,现有刷新结果待重跑。 | 有条件,必须暴露 stale。 |
| Read material refresh | `ReadRefreshUnavailable` | 刷新结果暂不可达或安全不可读。 | 否。 |
| Trace / audit / impact refresh | `TraceRefreshPending` | 已登记追溯材料刷新请求,等待 job 承接。 | 是。 |
| Trace / audit / impact refresh | `TraceRefreshInProgress` | 正在刷新 trace、audit、impact、lineage 读取材料。 | 是。 |
| Trace / audit / impact refresh | `TraceRefreshPartial` | 部分 trace / audit / impact / lineage 已收敛,部分仍缺失。 | 有条件。 |
| Trace / audit / impact refresh | `TraceRefreshConverged` | trace / audit / impact / lineage 材料已按当前安全边界重新对齐。 | 是。 |
| Trace / audit / impact refresh | `TraceRefreshBlockedByBodyBoundary` | 刷新命中外部正文、report body 或 evidence body 边界而被阻断。 | 否。 |
| Trace / audit / impact refresh | `TraceRefreshUnavailable` | 追溯材料刷新暂不可完成或结果不可读。 | 否。 |
| Recovery convergence | `RecoveryNeeded` | 已识别可恢复异常,需进入收敛判断。 | 有条件。 |
| Recovery convergence | `RecoveryPendingAcknowledgement` | 收敛判断已形成待确认结论或待承接线索。 | 有条件。 |
| Recovery convergence | `RecoveryConverged` | 当前 recovery semantic 已完成收敛判断。 | 是,但不表示 truth 自动修复。 |
| Recovery convergence | `RecoverySuspended` | 收敛因外部依据、边界冲突或依赖未闭合而挂起。 | 否。 |
| Recovery convergence | `RecoveryRejected` | 当前恢复路径被正式拒绝或判断不应继续。 | 否。 |
| Recovery convergence | `RecoveryFormalInterventionRequired` | 需要正式流程 / 人工介入才能继续。 | 否。 |
| Maintenance progress view | `ProgressPending` | 当前 run / scope 已登记但未开始完成主要刷新或恢复。 | 是。 |
| Maintenance progress view | `ProgressConverging` | 当前 run / scope 正在推进 refresh / recovery 收敛。 | 是。 |
| Maintenance progress view | `ProgressRecoveryNeeded` | 当前可见进度明确存在待恢复项或待正式承接项。 | 有条件。 |
| Maintenance progress view | `ProgressConverged` | 当前 run / scope 可见层面已无未闭合维护项。 | 是。 |
| Maintenance progress view | `ProgressStale` | 进度视图落后于 task / recovery 最新变化。 | 有条件。 |
| Maintenance progress view | `ProgressUnavailable` | 进度视图暂不可读。 | 否。 |
| Maintenance run history | `RunHistoryRecorded` | 某次维护 run 的 safe outcome 已被追加到历史。 | 是,仅用于历史读取。 |
| Maintenance run history | `RunHistorySupersededHint` | 历史记录显示本 run 已被后续 run 替代。 | 是,仅用于历史解释。 |
| Maintenance run history | `RunHistoryInterventionHint` | 历史记录显示该 run 导向 formal intervention / manual follow-up。 | 是,仅用于历史解释。 |

#### R1.20.4 概要状态流转图

```text
+====================================================================+
|                 Maintenance / Convergence State Flow               |
+====================================================================+
| Request / Control                                                  |
|   <request refresh or recovery>                                    |
|        |                                                           |
|        v                                                           |
|   MaintenanceRequestRegistered ---- supersede ------------------> MaintenanceRequestSuperseded |
|        | suspend                                                  |
|        +--------------------------------> MaintenanceSuspended    |
|        | require formal handling                                  |
|        +--------------------------------> MaintenanceFormalInterventionRequired |
|                                                                    |
| ReadMaterialRefreshTask                                            |
|   ReadRefreshPending ---- job starts ----------------------------> ReadRefreshInProgress |
|        | partial coverage                                          |
|        +--------------------------------> ReadRefreshPartiallyConverged |
|        | all target materials aligned                              |
|        +--------------------------------> ReadRefreshConverged     |
|        | source changed again                                      |
|        +--------------------------------> ReadRefreshStale         |
|        | unavailable / safe miss                                   |
|        +--------------------------------> ReadRefreshUnavailable   |
|                                                                    |
| TraceMaterialRefreshTask                                           |
|   TraceRefreshPending ---- job starts ---------------------------> TraceRefreshInProgress |
|        | partial lineage / impact                                  |
|        +--------------------------------> TraceRefreshPartial      |
|        | body-free refresh done                                    |
|        +--------------------------------> TraceRefreshConverged    |
|        | body boundary blocks                                      |
|        +--------------------------------> TraceRefreshBlockedByBodyBoundary |
|        | unavailable                                               |
|        +--------------------------------> TraceRefreshUnavailable  |
|                                                                    |
| ConsistencyRecoveryTask                                            |
|   RecoveryNeeded ---- convergence evaluated ---------------------> RecoveryPendingAcknowledgement |
|        | converged judgement                                       |
|        +--------------------------------> RecoveryConverged        |
|        | suspend / reject / escalate                               |
|        +--------------------------------> RecoverySuspended        |
|        +--------------------------------> RecoveryRejected         |
|        +--------------------------------> RecoveryFormalInterventionRequired |
|                                                                    |
| MaintenanceProgressView / RunHistory                               |
|   ProgressPending -> ProgressConverging -> ProgressConverged       |
|        | recovery still needed / source stale / read unavailable   |
|        +----------------> ProgressRecoveryNeeded                   |
|        +----------------> ProgressStale                            |
|        +----------------> ProgressUnavailable                      |
|   RunHistoryRecorded -> RunHistorySupersededHint / RunHistoryInterventionHint |
+====================================================================+
```

关键说明:

- `MaintenanceRequestRegistered` 只表示维护意图已登记,不表示任何 job 已执行。
- `ReadRefreshConverged`、`TraceRefreshConverged`、`RecoveryConverged` 都只表示派生材料或收敛判断闭合,不表示 core truth 被自动修复。
- `TraceRefreshBlockedByBodyBoundary` 是正式阻断状态,说明刷新遵守 body-free 边界。
- `ProgressConverged` 是 read model 结论,必须来源于 task / recovery truth,不能自行合成。
- `RunHistorySupersededHint` 和 `RunHistoryInterventionHint` 只增强历史解释,不回写当前 task state。

#### R1.20.5 允许迁移清单

| owner | 允许迁移 | 触发动作 |
|---|---|---|
| `ReadMaterialRefreshTask` | create -> `MaintenanceRequestRegistered` / `ReadRefreshPending` | `RequestReadMaterialRefresh` accepted。 |
| `ReadMaterialRefreshTask` | `ReadRefreshPending -> ReadRefreshInProgress` | 任一 read material refresh job 开始处理目标材料。 |
| `ReadMaterialRefreshTask` | `ReadRefreshInProgress -> ReadRefreshPartiallyConverged` | 部分 target material 已刷新,剩余 scope 仍待收敛。 |
| `ReadMaterialRefreshTask` | `ReadRefreshInProgress / ReadRefreshPartiallyConverged -> ReadRefreshConverged` | 目标材料全部按当前 truth / boundary 对齐。 |
| `ReadMaterialRefreshTask` | `ReadRefreshConverged -> ReadRefreshStale` | 来源 truth、boundary 或上游摘要再次变化。 |
| `ReadMaterialRefreshTask` | `ReadRefreshPending / ReadRefreshInProgress / ReadRefreshPartiallyConverged -> ReadRefreshUnavailable` | material source miss、safe read unavailable 或显式不可读。 |
| `ReadMaterialRefreshTask` | any active state -> `MaintenanceSuspended` / `MaintenanceRequestSuperseded` | `MarkMaintenanceSuspended`;`SupersedeMaintenanceRequest` accepted。 |
| `TraceMaterialRefreshTask` | create -> `MaintenanceRequestRegistered` / `TraceRefreshPending` | `RequestTraceMaterialRefresh` accepted。 |
| `TraceMaterialRefreshTask` | `TraceRefreshPending -> TraceRefreshInProgress` | `RefreshTraceAuditImpactMaterials` 开始执行。 |
| `TraceMaterialRefreshTask` | `TraceRefreshInProgress -> TraceRefreshPartial` | 部分 trace / audit / impact / lineage 已组织。 |
| `TraceMaterialRefreshTask` | `TraceRefreshInProgress / TraceRefreshPartial -> TraceRefreshConverged` | body-free 刷新全部完成。 |
| `TraceMaterialRefreshTask` | `TraceRefreshInProgress / TraceRefreshPartial -> TraceRefreshBlockedByBodyBoundary` | 命中外部正文、report body 或 evidence body 边界。 |
| `TraceMaterialRefreshTask` | `TraceRefreshPending / TraceRefreshInProgress / TraceRefreshPartial -> TraceRefreshUnavailable` | safe material miss 或读取不可达。 |
| `TraceMaterialRefreshTask` | any active state -> `MaintenanceSuspended` / `MaintenanceRequestSuperseded` | `MarkMaintenanceSuspended`;`SupersedeMaintenanceRequest` accepted。 |
| `ConsistencyRecoveryTask` | create -> `MaintenanceRequestRegistered` / `RecoveryNeeded` | `RequestConsistencyRecovery` accepted。 |
| `ConsistencyRecoveryTask` | `RecoveryNeeded -> RecoveryPendingAcknowledgement` | `RunConsistencyRecoveryConvergence` 形成待确认结论或待承接线索。 |
| `ConsistencyRecoveryTask` | `RecoveryNeeded / RecoveryPendingAcknowledgement -> RecoveryConverged` | 收敛判断完成且无未闭合恢复项。 |
| `ConsistencyRecoveryTask` | `RecoveryNeeded / RecoveryPendingAcknowledgement -> RecoverySuspended` | `MarkMaintenanceSuspended` accepted。 |
| `ConsistencyRecoveryTask` | `RecoveryNeeded / RecoveryPendingAcknowledgement -> RecoveryRejected` | 当前恢复路径被正式拒绝或判断不应继续。 |
| `ConsistencyRecoveryTask` | `RecoveryNeeded / RecoveryPendingAcknowledgement -> RecoveryFormalInterventionRequired` | `RequireMaintenanceFormalIntervention` accepted。 |
| `ConsistencyRecoveryTask` | any active state -> `MaintenanceRequestSuperseded` | `SupersedeMaintenanceRequest` accepted with later run。 |
| `MaintenanceProgressView` | create / refresh -> `ProgressPending` | 新 run / scope 已登记,等待 task 进度同步。 |
| `MaintenanceProgressView` | `ProgressPending -> ProgressConverging` | 任一 task 进入 in progress / partial。 |
| `MaintenanceProgressView` | `ProgressConverging -> ProgressConverged` | relevant task / recovery 全部收敛。 |
| `MaintenanceProgressView` | `ProgressPending / ProgressConverging -> ProgressRecoveryNeeded` | recovery needed / formal intervention / pending acknowledgement 暴露到读取面。 |
| `MaintenanceProgressView` | any current state -> `ProgressStale` / `ProgressUnavailable` | progress read model 落后或暂不可读。 |
| `MaintenanceRunHistory` | create -> `RunHistoryRecorded` | accepted request、refresh outcome 或 recovery outcome 被安全记入历史。 |
| `MaintenanceRunHistory` | `RunHistoryRecorded -> RunHistorySupersededHint` | 后续 run 替代当前 run。 |
| `MaintenanceRunHistory` | `RunHistoryRecorded -> RunHistoryInterventionHint` | 历史结果指向 formal intervention / manual follow-up。 |

#### R1.20.6 禁止迁移清单

| 禁止迁移或行为 | 原因 |
|---|---|
| `RequestReadMaterialRefresh` / `RequestTraceMaterialRefresh` / `RequestConsistencyRecovery` accepted 后直接进入 `*Converged` | Command 只登记维护意图,不执行 job 或收敛判断。 |
| Query miss 自动创建 task、推进 progress 或确认 recovery | Query no-write。 |
| `ReadRefreshConverged` / `TraceRefreshConverged` / `RecoveryConverged` 反向修改 definition、formal version、relation、external summary、package 或 method set truth | maintenance 只刷新派生材料和收敛语义。 |
| `MaintenanceSuspended` 被解释为来源 truth 不成立 | 挂起只说明维护路径暂停。 |
| `RecoveryConverged` 被解释为已自动修复所有异常 | 收敛完成不等于 truth repair 完成。 |
| `TraceRefreshBlockedByBodyBoundary` 通过复制正文、report body、artifact body 或 raw log 绕过边界 | body-free 边界是正式红线。 |
| `MaintenanceFormalInterventionRequired` 自动执行治理审批、正式化裁决、消费边界扩张或版本替代 | 正式介入只能由后续正式流程承接。 |
| `ProgressConverged` 先于 task / recovery truth 单独生成 | progress view 只能复制来源状态。 |
| `MaintenanceRequestSuperseded` 删除旧 run history 或覆盖旧 outcome | supersede 只替代当前请求,历史必须保留。 |
| 在 maintenance state 中写 worker id、scheduler id、queue depth、lock token、retry token、cron 名 | 这些属于实现 / 运维细节。 |
| 在 maintenance state 中写 raw log、telemetry、metrics body、incident report body、evidence body | 当前只允许 body-free summary / marker / history hint。 |

#### R1.20.7 传播影响

| 来源状态变化 | 必须传播到 | 不允许传播到 |
|---|---|---|
| `MaintenanceRequestRegistered` / `MaintenanceSuspended` / `MaintenanceRequestSuperseded` | `MaintenanceProgressView`;`MaintenanceRunHistory`;maintenance event candidate;pending scope read。 | worker / queue / scheduler 实现、core truth 变更。 |
| `ReadRefreshPending` / `ReadRefreshInProgress` / `ReadRefreshPartiallyConverged` | catalog / version / consumption / relation / external / peripheral read freshness hint;progress view。 | definition / formal version / relation / external summary / package truth。 |
| `ReadRefreshConverged` / `ReadRefreshStale` / `ReadRefreshUnavailable` | material freshness cleared / stale hint、query unavailable hint、maintenance history。 | 自动修复 truth、自动重试策略、projection storage internals。 |
| `TraceRefreshPartial` / `TraceRefreshBlockedByBodyBoundary` / `TraceRefreshUnavailable` | trace / audit / impact / lineage read hints、recovery request hint、progress view。 | raw log、report body、evidence body、artifact body。 |
| `RecoveryNeeded` / `RecoveryPendingAcknowledgement` / `RecoveryFormalInterventionRequired` | maintenance diagnostics、formal handoff hint、progress view、event candidate。 | 自动治理执行、自动消费边界修改、自动外部正文补录。 |
| `RecoveryConverged` / `RecoverySuspended` / `RecoveryRejected` | maintenance history、query diagnostic、audit trail follow-up。 | 声称 core truth 已被修复、删除旧 issue 历史。 |
| `ProgressStale` / `ProgressUnavailable` | maintenance Query stale / unavailable surface、follow-up request hint。 | worker 状态、queue depth、lock / retry internals。 |
| `RunHistoryRecorded` / `RunHistorySupersededHint` / `RunHistoryInterventionHint` | audit / acceptance 线索、run history Query、pending scope explanation。 | 当前 task truth 回写、incident report body。 |

#### R1.20.8 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成五组状态定义 | pass | 已覆盖 request/control、read refresh、trace refresh、recovery convergence、progress/history。 |
| owner 是否回指 Step 6 | pass | 只使用 `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask`、`MaintenanceProgressView`、`MaintenanceRunHistory`、`MaintenanceRunRef`、`RefreshScopeRef`。 |
| 触发来源是否回指 Step 7 / Step 8 | pass | 使用 maintenance Command / Query / Job 与当前 maintenance event candidate。 |
| 是否排除 worker / scheduler / queue / retry | pass | 禁止迁移清单已显式排除。 |
| 是否排除 core truth repair | pass | 已明确 converged 不等于 truth repair。 |
| 是否保持 body-free 边界 | pass | 已排除 raw log、telemetry、report body、evidence body、artifact body。 |
| 是否写入概要状态表 / 流转图 / 迁移清单 | pass | 已写五组状态定义表、精简 ASCII 图、允许 / 禁止迁移和传播影响表。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9。 |

next_allowed_action: 等待用户确认后进入 Step 9 `外围包与方法集组织状态:先思考`;只思考 `MethodPackage`、`MethodSetAssembly`、`PackageCompositionRule`、`MethodPackageView`、`MethodSetAssemblyView` 的 owner 范围、状态组取舍、触发来源、传播风险和排除项,不得写完整状态定义表、状态流转图、允许 / 禁止迁移清单,不得修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.21 外围包与方法集组织状态:先思考

#### R1.21.1 问题回答

本模块只思考 `外围包与方法集组织` 的状态范围。当前不写完整状态定义表、状态流转图、允许迁移清单或禁止迁移清单。

需要回答:

1. `MethodPackage`、`MethodSetAssembly`、`PackageCompositionRule`、`MethodPackageView`、`MethodSetAssemblyView` 哪些状态语义必须进入 Step 9。
2. package / method set truth、composition disposition、peripheral view freshness / availability 如何分层。
3. 哪些 Step 7 / Step 8 入口能触发状态变化,哪些 Query 只能读取外围组织语义。
4. 外围 package / method set 状态变化如何传播到 discovery、history、event candidate 和外围 view,同时不污染核心闭环。
5. 哪些 marketplace listing、order、install、fulfillment、artifact body、组织运行配置、UI / SDK 本地状态必须排除。

当前判断:

- `MethodPackage` 是 package truth lifecycle owner,负责表达外围包组织语义是否已建立、调整、退役或被隔离。
- `MethodSetAssembly` 是 method set assembly lifecycle owner,负责表达组织级方法集是否可组装、需复核或已退出当前外围语境。
- `PackageCompositionRule` 是 composition disposition owner,负责表达 package / assembly 是否满足外围组合边界,但不拥有成员 truth。
- `MethodPackageView` 与 `MethodSetAssemblyView` 是外围读取材料 owner,负责 freshness、stale、invalid member、partially available、unavailable 等只读状态。
- `MarketplaceContextRef`、`DistributionContextRef`、`ConsumptionContextRef`、`PackageAssemblyHistory` 只作为定位、语境或历史线索,不单独成为生命周期 owner。

#### R1.21.2 当前来源判断

| owner | Step 6 来源 | Step 8 / Step 7 触发来源 | 初步状态职责 |
|---|---|---|---|
| `MethodPackage` | `operations_peripheral` E4;peripheral aggregate / package truth candidate。 | `EstablishMethodPackage`;`AdjustMethodPackageComposition`;`RetireMethodPackage`;`MarkMethodPackageUnavailable`。 | 表达外围 package 是否已建立、可用、受限、退役或隔离。 |
| `MethodSetAssembly` | `operations_peripheral` E5;peripheral aggregate / method set truth candidate。 | `AssembleMethodSet`;`AdjustMethodSetAssembly`;`RetireMethodSetAssembly`;`MarkMethodSetAssemblyStaleOrUnavailable`。 | 表达组织级方法集是否已组装、可用、待复核、退役或隔离。 |
| `PackageCompositionRule` | `policies_guards` B7;外围 composition policy / invariant。 | `EvaluatePackageComposition`;package / assembly establish / adjust accepted;diagnostic Query。 | 表达 composition accepted、rejected、invalid、unavailable 等外围组合判断。 |
| `MethodPackageView` | `views_materials` C11;projection / peripheral view。 | package changed;composition result changed;`GetMethodPackageView`;外围 refresh hint。 | 表达 package 读取视图 fresh、stale、invalid member、context unavailable、unavailable。 |
| `MethodSetAssemblyView` | `views_materials` C12;projection / peripheral view。 | assembly changed;composition result changed;`GetMethodSetAssemblyView`;外围 refresh hint。 | 表达 assembly 读取视图 fresh、stale、invalid composition、partial、unavailable。 |
| `MarketplaceContextRef` / `DistributionContextRef` / `ConsumptionContextRef` | typed ref family / boundary refs。 | package / assembly establish / adjust;discovery Query。 | 作为外围语境定位维度,不单独拥有业务生命周期。 |
| `PackageAssemblyHistory` | refs / history family。 | package / assembly changed;composition result changed。 | 作为 append-only 历史线索,不替代当前 package / assembly truth。 |

#### R1.21.3 状态组取舍

外围包与方法集组织后续写入应拆成五类状态语义,避免把外围 truth、规则判断和 view freshness 混成一条单一 lifecycle:

| 状态组方向 | 是否进入后续写入 | 理由 |
|---|---|---|
| package truth lifecycle | yes | `MethodPackage` 是外围组织 truth candidate,需要表达 established / adjusted / retired / unavailable 等外围生命周期。 |
| method set assembly lifecycle | yes | `MethodSetAssembly` 是组织级组装 truth candidate,需要表达 assembled / stale / retired / unavailable 等外围生命周期。 |
| composition disposition | yes | `PackageCompositionRule` 必须独立表达 accepted / rejected / invalid / unavailable,不能折叠进 package 或 assembly truth。 |
| peripheral view freshness / availability | yes | `MethodPackageView`、`MethodSetAssemblyView` 是只读材料,需要表达 fresh / stale / partial / unavailable 等读取状态。 |
| discovery / history read hint | yes_limited | discovery context 与 history 需要承接外围变化线索,但只作为传播面,不另立核心状态 owner。 |
| marketplace transaction / install lifecycle | no | listing、price、order、purchase、install、fulfillment 不属于本仓外围组织状态。 |
| artifact / archive package body lifecycle | no | package body、binary、archive content 是边界外正文。 |
| organization runtime config / UI preset / SDK profile / AI override lifecycle | no | 这些不是方法库外围组织 truth。 |
| peripheral refresh job / worker lifecycle | no | 外围 refresh 只由后台维护承接,不在本模块建立任务状态机。 |

#### R1.21.4 触发来源思考

后续写入时应把触发来源限定为:

| 触发来源 | 可影响 | 不可影响 |
|---|---|---|
| `EstablishMethodPackage` | 建立 package truth 初始状态,并产生 package view / history invalidation hint。 | 不创建 definition truth、不发布 formal version、不写 marketplace listing。 |
| `AdjustMethodPackageComposition` | 调整 package composition、外围可用性和 view stale hint。 | 不扩大 consumption boundary,不修 relation truth。 |
| `RetireMethodPackage` | 推进 package 退出当前外围语境。 | 不撤销成员 definition、formal version 或 relation truth。 |
| `MarkMethodPackageUnavailable` | 标记 package 隔离或外围不可用。 | 不把 unavailable 解释为核心闭环失败。 |
| `AssembleMethodSet` | 建立 method set assembly 初始状态和相关 view stale hint。 | 不声明组织运行成功,不写 runtime config。 |
| `AdjustMethodSetAssembly` | 调整 package/member 组装语义和外围可用性。 | 不改变 formal version truth,不绕过受控消费。 |
| `RetireMethodSetAssembly` | 推进 method set assembly 退出当前外围语境。 | 不撤销 package truth 或 adoption context truth。 |
| `MarkMethodSetAssemblyStaleOrUnavailable` | 标记 assembly 需复核或暂不可用。 | 不生成 recovery task,不改写核心 truth。 |
| `EvaluatePackageComposition` | 形成 accepted / rejected / invalid / unavailable 的 composition disposition。 | 不写完整规则引擎、配置矩阵或 marketplace business rule。 |
| package / assembly Query family | 读取 truth summary、view、diagnostic、history、discovery context。 | 不创建 package / assembly,不刷新 view,不做 ranking / 推荐 / 安装判断。 |
| `RefreshPeripheralReadMaterials` | 后续可推动外围 view freshness 收敛。 | 本模块不定义其 job 进度状态。 |
| peripheral event candidates | 传播 package / assembly / composition / view availability changed。 | 不写 topic、payload schema、relay、subscriber 或 worker。 |

#### R1.21.5 传播风险

外围包与方法集组织状态会影响发现、采用评估和外围只读视图,但传播必须保持 peripheral-only:

| 来源变化 | 可传播到 | 风险控制 |
|---|---|---|
| package established / adjusted | package view、assembly view、discovery context、history、event candidate。 | 不传播为 core truth established,不宣称可直接消费。 |
| package retired / unavailable | package view unavailable、assembly stale、history、event candidate。 | 不使成员 definition、formal version、relation 或 external summary 失效。 |
| assembly established / adjusted | assembly view、discovery context、history、event candidate。 | 不传播为组织运行成功或下游采用成功。 |
| assembly stale / unavailable / retired | assembly view stale / unavailable、package discovery hint、history、event candidate。 | 不升级为消费边界失败或 trace failure。 |
| composition accepted / rejected / invalid / unavailable | package / assembly diagnostic、view freshness / availability、history、event candidate。 | 只传播 safe marker / reason,不暴露规则算法或配置正文。 |
| package / assembly view stale / partial / unavailable | peripheral Query freshness surface、maintenance refresh hint。 | 不回写 package / assembly truth,不触发自动 repair。 |
| discovery / history 变化 | 外围读取面、审计线索、acceptance hint。 | 不替代当前 package / assembly truth,不暴露 marketplace body 或 transaction fact。 |

#### R1.21.6 排除项

本组成部分后续写入必须排除:

| 排除项 | 排除原因 |
|---|---|
| marketplace listing、price、order、purchase、install、fulfillment、settlement、refund 状态 | 属于边界外商业 / 交付系统。 |
| package binary、archive package、artifact body、object storage path、signed URL | 外围组织只保存 summary / ref / context,不保存正文或包体。 |
| organization runtime config、console UI preset、SDK profile、AI policy override 状态 | 不属于方法库外围组织 truth。 |
| Query 自动创建 package / assembly 或自动刷新 view | Query no-write。 |
| composition rule 自动修成员 truth、formal version、relation 或 consumption boundary | rule 只做外围组合判断。 |
| peripheral unavailable 反向使核心 definition、formalization、consumption、trace consistency 失败 | 外围增强不得污染核心闭环。 |
| peripheral refresh worker、scheduler、queue、retry、lock、cron | 属于后台维护实现细节。 |
| recommendation / ranking / search algorithm 状态 | discovery 只读不拥有推荐算法 lifecycle。 |
| package / assembly history 替代当前 truth | history 只保留变化线索。 |

#### R1.21.7 下一写入批次边界

下一批 `外围包与方法集组织状态:再写入` 可以写:

1. owner 到对象 / 触发来源映射。
2. package lifecycle、method set assembly lifecycle、composition disposition、package view、assembly view 五组概要状态定义表。
3. 精简 ASCII 流转图。
4. 允许迁移和禁止迁移清单。
5. 传播影响表和停审记录。

不得写 Rust enum、字段全集、repository / port、DTO、DDL、marketplace listing / price / order / install / fulfillment、artifact / archive body、package binary、organization runtime config、UI / SDK 状态、ranking / recommendation algorithm、worker / queue / retry、正式 §9 回填草稿或 Step 10 异常边界。

#### R1.21.8 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 只思考 owner 范围、状态组取舍、触发来源、传播风险和排除项。 |
| 是否写完整状态定义表 | no | 未写状态类型 / 状态 / 含义 / 正常主线的完整表。 |
| 是否写状态流转图 | no | 未写 ASCII 状态图。 |
| 是否写允许 / 禁止迁移清单 | no | 迁移清单留给再写入。 |
| 是否以当前 Step 6 / Step 8 为准 | pass | 使用 `MethodPackage`、`MethodSetAssembly`、`PackageCompositionRule`、`MethodPackageView`、`MethodSetAssemblyView` 和 `R1.24` 处理流。 |
| 是否保持 peripheral-only 边界 | pass | 已排除 marketplace、安装履约、artifact body、组织运行配置和核心闭环污染。 |
| 是否排除 Query 副作用 | pass | 已明确 Query 只读不创建、不刷新。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9 外围包与方法集组织状态小循环。 |

next_allowed_action: 等待用户确认后进入 Step 9 `外围包与方法集组织状态:再写入`;可写 owner 映射、五组概要状态定义表、精简 ASCII 流转图、允许 / 禁止迁移清单、传播影响表和停审记录,不得写 Rust enum、字段全集、repository / port、DTO、DDL、marketplace listing / price / order / install / fulfillment、artifact / archive body、package binary、organization runtime config、UI / SDK 状态、ranking / recommendation algorithm、worker / queue / retry,不得修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.22 外围包与方法集组织状态:再写入

#### R1.22.1 本组成部分写入说明

本模块只写 `外围包与方法集组织` 的概要状态定义,覆盖 package truth lifecycle、method set assembly lifecycle、composition disposition、package view freshness / availability、assembly view freshness / availability 五组状态。它只表达外围组织 truth、外围规则判断和只读视图状态,不进入 marketplace transaction、artifact body、organization runtime config、ranking algorithm 或后台 worker 实现。

外围状态的统一边界如下:

- `MethodPackage` 和 `MethodSetAssembly` 只拥有外围组织 truth candidate,不拥有核心定义、正式版本、消费或追溯 truth。
- `PackageCompositionRule` 只拥有外围组合判断,不修成员 truth、不扩大消费授权。
- `MethodPackageView` 和 `MethodSetAssemblyView` 只拥有只读 freshness / availability,不能替代 truth。
- `PackageAssemblyHistory` 与 discovery context 只承接传播线索,不单独成为当前状态 owner。
- 外围 unavailable、retired、rejected、partial 都只能影响外围读取和采用评估,不得污染核心闭环成立。

#### R1.22.2 owner 映射

| owner | Step 6 来源 | Step 8 / Step 7 触发来源 | 本模块状态职责 |
|---|---|---|---|
| `MethodPackage` | `operations_peripheral` E4 | `EstablishMethodPackage`;`AdjustMethodPackageComposition`;`RetireMethodPackage`;`MarkMethodPackageUnavailable`。 | 表达外围 package draft、ready、retired、unavailable 等 truth lifecycle。 |
| `MethodSetAssembly` | `operations_peripheral` E5 | `AssembleMethodSet`;`AdjustMethodSetAssembly`;`RetireMethodSetAssembly`;`MarkMethodSetAssemblyStaleOrUnavailable`。 | 表达 method set assembly draft、ready、stale、retired、unavailable 等 truth lifecycle。 |
| `PackageCompositionRule` | `policies_guards` B7 | `EvaluatePackageComposition`;package / assembly establish / adjust accepted;composition diagnostic Query。 | 表达 composition accepted、rejected、invalid member / boundary、context unavailable。 |
| `MethodPackageView` | `views_materials` C11 | package changed;composition result changed;`GetMethodPackageView`;peripheral read refresh hint。 | 表达 package view fresh、stale、invalid member、marketplace context unavailable、unavailable。 |
| `MethodSetAssemblyView` | `views_materials` C12 | assembly changed;composition result changed;`GetMethodSetAssemblyView`;peripheral read refresh hint。 | 表达 assembly view fresh、stale、invalid composition、partially available、unavailable。 |
| `PackageAssemblyHistory` / discovery context | history / context refs | package / assembly changed;composition result changed;history / discovery Query。 | 只作为传播输出面,不独立承接生命周期。 |

#### R1.22.3 五组概要状态定义表

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 |
|---|---|---|---|
| Package lifecycle | `PackageDraft` | 外围 package 组织语义正在形成,不得作为核心闭环前置。 | 有条件,仅外围准备态。 |
| Package lifecycle | `PackageReady` | package 成员引用和组合边界满足外围可用条件。 | 是,但仅在外围读取 / 发现主线。 |
| Package lifecycle | `PackageRetired` | package 退出当前外围语境,历史线索仍需保留。 | 否。 |
| Package lifecycle | `PackageUnavailable` | package 因成员、composition 或生态上下文问题被隔离。 | 否。 |
| Method set assembly lifecycle | `AssemblyDraft` | 组织级方法集组装语义正在形成。 | 有条件。 |
| Method set assembly lifecycle | `AssemblyReady` | package / asset refs、boundary 和 adoption context 满足外围可用条件。 | 是,但仅在外围读取 / 采用评估主线。 |
| Method set assembly lifecycle | `AssemblyStale` | 依赖的 package、成员、消费边界或上下文变化后需要复核。 | 有条件,必须暴露 stale。 |
| Method set assembly lifecycle | `AssemblyRetired` | 方法集退出当前外围语境,历史线索仍需保留。 | 否。 |
| Method set assembly lifecycle | `AssemblyUnavailable` | 方法集外围语义暂不可用。 | 否。 |
| Composition disposition | `CompositionAccepted` | 当前 package / assembly 满足组合边界。 | 是,作为外围可用前提。 |
| Composition disposition | `CompositionRejected` | 当前组合不满足外围规则,不得进入外围可用主线。 | 否。 |
| Composition disposition | `CompositionInvalidMemberOrBoundary` | 成员引用或边界条件非法,只能暴露 safe diagnostic。 | 否。 |
| Composition disposition | `CompositionContextUnavailable` | marketplace / distribution / adoption context 暂不可用。 | 否。 |
| Package view freshness / availability | `PackageViewFresh` | package view 与 package truth、成员引用和分发上下文对齐。 | 是。 |
| Package view freshness / availability | `PackageViewStale` | package truth、成员或 context 变化后待刷新。 | 有条件。 |
| Package view freshness / availability | `PackageViewInvalidMember` | 成员引用不满足组成规则,只能返回外围不可用 / diagnostic。 | 否。 |
| Package view freshness / availability | `PackageViewMarketplaceContextUnavailable` | 生态发现上下文不可用,但核心闭环不受影响。 | 有条件。 |
| Package view freshness / availability | `PackageViewUnavailable` | package view 暂不可读。 | 否。 |
| Assembly view freshness / availability | `AssemblyViewFresh` | assembly view 与 method set truth、package refs 和组合规则对齐。 | 是。 |
| Assembly view freshness / availability | `AssemblyViewStale` | assembly truth、package / member refs 或采用语境变化后待刷新。 | 有条件。 |
| Assembly view freshness / availability | `AssemblyViewInvalidComposition` | 组成规则不满足,只能返回 safe diagnostic / unavailable。 | 否。 |
| Assembly view freshness / availability | `AssemblyViewPartiallyAvailable` | 部分 package / member 可读,部分外围材料仍待收敛。 | 有条件。 |
| Assembly view freshness / availability | `AssemblyViewUnavailable` | assembly view 暂不可读。 | 否。 |

#### R1.22.4 概要状态流转图

```text
+====================================================================+
|            Peripheral Package / Assembly / View State Flow         |
+====================================================================+
| MethodPackage                                                      |
|   PackageDraft ---- accepted composition -----------------------> PackageReady |
|        | retire                                                   |
|        +--------------------------------> PackageRetired          |
|        | member/context unavailable                               |
|        +--------------------------------> PackageUnavailable      |
|   PackageUnavailable ---- context restored + accepted ----------> PackageReady |
|                                                                    |
| MethodSetAssembly                                                  |
|   AssemblyDraft ---- accepted composition ----------------------> AssemblyReady |
|        | dependency changed                                        |
|        +--------------------------------> AssemblyStale            |
|        | retire                                                   |
|        +--------------------------------> AssemblyRetired          |
|        | unavailable                                              |
|        +--------------------------------> AssemblyUnavailable      |
|   AssemblyStale / AssemblyUnavailable ---- revalidated ---------> AssemblyReady |
|                                                                    |
| PackageCompositionRule                                             |
|   CompositionAccepted <---- evaluate accepted -------------------+ |
|        | evaluate rejected / invalid / context unavailable       | |
|        +--> CompositionRejected                                  | |
|        +--> CompositionInvalidMemberOrBoundary                   | |
|        +--> CompositionContextUnavailable                        | |
|                                                                    |
| MethodPackageView / MethodSetAssemblyView                          |
|   *ViewFresh ---- truth/context changed ------------------------> *ViewStale |
|        | invalid composition / invalid member                     |
|        +-------------------------------> PackageViewInvalidMember / AssemblyViewInvalidComposition |
|        | partial convergence                                      |
|        +-------------------------------> AssemblyViewPartiallyAvailable |
|        | context or source unavailable                            |
|        +-------------------------------> PackageViewMarketplaceContextUnavailable / *ViewUnavailable |
+====================================================================+
```

关键说明:

- `PackageReady` 和 `AssemblyReady` 只表示外围组织可用,不代表核心方法资产可直接消费或下游已采用成功。
- `PackageRetired` 和 `AssemblyRetired` 必须保留 history 线索,不能被当成硬删除。
- `CompositionRejected`、`CompositionInvalidMemberOrBoundary`、`CompositionContextUnavailable` 是外围组合判断,不直接改写 package / assembly truth。
- `PackageViewMarketplaceContextUnavailable` 只影响外围发现上下文,不影响 package truth。
- `AssemblyViewPartiallyAvailable` 允许暴露外围部分可读,但不得声明整体已 ready。

#### R1.22.5 允许迁移清单

| owner | 允许迁移 | 触发动作 |
|---|---|---|
| `MethodPackage` | create -> `PackageDraft` | `EstablishMethodPackage` accepted with initial member refs。 |
| `MethodPackage` | `PackageDraft -> PackageReady` | establish / adjust 后 composition accepted。 |
| `MethodPackage` | `PackageReady -> PackageReady` | `AdjustMethodPackageComposition` accepted and rule still accepted。 |
| `MethodPackage` | `PackageReady / PackageUnavailable -> PackageRetired` | `RetireMethodPackage` accepted。 |
| `MethodPackage` | `PackageDraft / PackageReady -> PackageUnavailable` | `MarkMethodPackageUnavailable` accepted due to member / context / rule issue。 |
| `MethodPackage` | `PackageUnavailable -> PackageReady` | affected member / context restored and composition accepted。 |
| `MethodSetAssembly` | create -> `AssemblyDraft` | `AssembleMethodSet` accepted with initial package / asset refs。 |
| `MethodSetAssembly` | `AssemblyDraft -> AssemblyReady` | assembly established and composition accepted。 |
| `MethodSetAssembly` | `AssemblyReady -> AssemblyStale` | dependent package、member、boundary 或 context changed。 |
| `MethodSetAssembly` | `AssemblyStale / AssemblyUnavailable -> AssemblyReady` | `AdjustMethodSetAssembly` or revalidation accepted。 |
| `MethodSetAssembly` | `AssemblyReady / AssemblyStale / AssemblyUnavailable -> AssemblyRetired` | `RetireMethodSetAssembly` accepted。 |
| `MethodSetAssembly` | `AssemblyDraft / AssemblyReady / AssemblyStale -> AssemblyUnavailable` | `MarkMethodSetAssemblyStaleOrUnavailable` accepted with unavailable reason。 |
| `PackageCompositionRule` | any evaluated state -> `CompositionAccepted` | `EvaluatePackageComposition` returned accepted。 |
| `PackageCompositionRule` | any evaluated state -> `CompositionRejected` | evaluate returned rejected by rule。 |
| `PackageCompositionRule` | any evaluated state -> `CompositionInvalidMemberOrBoundary` | evaluate found invalid member ref or boundary mismatch。 |
| `PackageCompositionRule` | any evaluated state -> `CompositionContextUnavailable` | evaluate found marketplace / distribution / adoption context unavailable。 |
| `MethodPackageView` | create / refresh -> `PackageViewFresh` | package truth and context aligned after read refresh or direct rebuild。 |
| `MethodPackageView` | `PackageViewFresh -> PackageViewStale` | package truth / member refs / distribution context changed。 |
| `MethodPackageView` | `PackageViewStale -> PackageViewInvalidMember` | composition diagnostic indicates invalid member。 |
| `MethodPackageView` | `PackageViewFresh / PackageViewStale -> PackageViewMarketplaceContextUnavailable` | marketplace discovery context unavailable。 |
| `MethodPackageView` | any current state -> `PackageViewUnavailable` | package view source temporarily unavailable。 |
| `MethodSetAssemblyView` | create / refresh -> `AssemblyViewFresh` | assembly truth、package refs and rule aligned。 |
| `MethodSetAssemblyView` | `AssemblyViewFresh -> AssemblyViewStale` | assembly truth / member refs / adoption context changed。 |
| `MethodSetAssemblyView` | `AssemblyViewStale -> AssemblyViewInvalidComposition` | composition diagnostic indicates rejected / invalid。 |
| `MethodSetAssemblyView` | `AssemblyViewStale -> AssemblyViewPartiallyAvailable` | only subset of package / member material available。 |
| `MethodSetAssemblyView` | any current state -> `AssemblyViewUnavailable` | assembly view source temporarily unavailable。 |

#### R1.22.6 禁止迁移清单

| 禁止迁移或行为 | 原因 |
|---|---|
| `EstablishMethodPackage` / `AssembleMethodSet` accepted 后直接进入 view fresh | truth 建立不等于 view 已刷新。 |
| Query miss 自动创建 package / assembly truth | Query no-write。 |
| `PackageUnavailable` / `AssemblyUnavailable` 反向使 definition、formal version、relation、external summary 或 consumption truth 失效 | 外围状态不得污染核心闭环。 |
| `CompositionRejected` / `CompositionInvalidMemberOrBoundary` 自动修成员 truth、formal version 或 consumption boundary | composition rule 只做外围判断。 |
| `PackageRetired` / `AssemblyRetired` 删除 history 或覆盖旧引用 | retired 只退出当前外围语境,历史必须保留。 |
| `PackageViewFresh` / `AssemblyViewFresh` 被当成 package / assembly truth | view 只读可重建,不是 truth。 |
| `PackageViewMarketplaceContextUnavailable` 被解释为 marketplace listing / order / install truth | context unavailable 只表达外围发现上下文缺失。 |
| `AssemblyViewPartiallyAvailable` 被解释为整体 assembly ready | partial 只能暴露部分可读。 |
| 在外围状态中写 listing、price、order、purchase、install、fulfillment、package binary、artifact/archive body | 这些都在边界外。 |
| 在外围状态中写 organization runtime config、UI preset、SDK profile、AI override、ranking / recommendation algorithm | 不属于外围组织状态机。 |
| `RefreshPeripheralReadMaterials` 直接修改 package / assembly truth | 后台维护只刷新 view / material,不修外围 truth。 |

#### R1.22.7 传播影响

| 来源状态变化 | 必须传播到 | 不允许传播到 |
|---|---|---|
| `PackageDraft` / `PackageReady` / `PackageRetired` / `PackageUnavailable` | `MethodPackageView`;`MethodSetAssemblyView`;`PackageAssemblyHistory`;discovery context read;event candidate。 | definition truth、formal version truth、relation truth、consumption truth。 |
| `AssemblyDraft` / `AssemblyReady` / `AssemblyStale` / `AssemblyRetired` / `AssemblyUnavailable` | assembly view、history、discovery hint、event candidate。 | organization runtime success fact、downstream adoption fact、core truth failure。 |
| `CompositionAccepted` / `CompositionRejected` / `CompositionInvalidMemberOrBoundary` / `CompositionContextUnavailable` | package / assembly diagnostic、view freshness / availability、history、event candidate。 | rule engine internals、config matrix body、automatic core truth repair。 |
| `PackageViewStale` / `PackageViewInvalidMember` / `PackageViewMarketplaceContextUnavailable` / `PackageViewUnavailable` | peripheral Query freshness surface、maintenance refresh hint、discovery warning。 | package truth rewrite、marketplace transaction state。 |
| `AssemblyViewStale` / `AssemblyViewInvalidComposition` / `AssemblyViewPartiallyAvailable` / `AssemblyViewUnavailable` | peripheral Query freshness surface、maintenance refresh hint、history / acceptance hint。 | assembly truth rewrite、consumption boundary mutation、trace failure。 |
| package / assembly retired or unavailable history change | history Query、audit hint、event candidate。 | hard delete old refs、incident body、raw log。 |

#### R1.22.8 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成五组状态定义 | pass | 已覆盖 package lifecycle、assembly lifecycle、composition disposition、package view、assembly view。 |
| owner 是否回指 Step 6 | pass | 只使用 `MethodPackage`、`MethodSetAssembly`、`PackageCompositionRule`、`MethodPackageView`、`MethodSetAssemblyView` 和 history / context 作为传播面。 |
| 触发来源是否回指 Step 7 / Step 8 | pass | 使用外围 Command / Query / composition evaluation / peripheral read refresh hint / event candidate。 |
| 是否保持 peripheral-only 边界 | pass | 已明确外围 unavailable / retired / rejected 不污染核心闭环。 |
| 是否排除 marketplace / 安装履约 / 包体 / 运行配置 | pass | 禁止迁移清单已显式排除。 |
| 是否排除 Query 副作用 | pass | Query 只读不创建、不刷新 truth。 |
| 是否写入概要状态表 / 流转图 / 迁移清单 | pass | 已写五组状态定义表、精简 ASCII 图、允许 / 禁止迁移和传播影响表。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9。 |

next_allowed_action: 等待用户确认后进入 Step 9 `跨状态一致性审计:先思考`;只思考同名 / 近义状态、触发覆盖、传播边界、Query / Job 红线和旧材料污染审计范围,不得直接写跨状态审计表正文、正式 §9 回填草稿或 Step 10 异常边界,不得修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.23 跨状态一致性审计:先思考

#### R1.23.1 本模块问题

本模块只思考 `跨状态一致性审计` 的范围、审计轴和主要风险。当前不直接写跨状态审计表正文、正式 §9 回填草稿或 Step 10 异常边界。

需要回答:

1. 八个主要组成部分已形成的状态集合里,哪些同名 / 近义状态最容易被误读为同一语义。
2. Step 7 / Step 8 的 Command、Query、Inbound、Operations Job、event candidate 是否都已被某个状态 owner 或传播面承接。
3. 各组成部分的传播方向是否仍保持 `truth / boundary -> view / material / trace / event candidate / maintenance / peripheral` 的单向约束。
4. `Query no-write`、`Job 不修 core truth`、`event candidate 不等于 delivery`、`外围不可用不污染核心` 这些全局红线是否已在各模块中持续成立。
5. 到下一模块 `旧材料差异审计` 时,需要重点比对哪些旧 §9 主线和 historical 术语。

本模块的目标不是重写八个状态组,而是为后续 `跨状态一致性审计:再写入` 固定审计表结构和风险候选,避免直接进入正式 §9 回填时才发现冲突。

#### R1.23.2 审计输入与范围

本模块当前审计输入只来自本轮已闭合材料,不回退到旧 §9 结论:

| 输入来源 | 当前用途 | 本模块处理方式 |
|---|---|---|
| Step 6 `02_hld_step_06_key_objects.md` 及其附录 | 核对状态 owner 是否真实存在、是否分层。 | 作为 owner 真相源。 |
| Step 7 `02_hld_step_07_api_interface_skeleton.md` | 核对触发来源和只读 / 写入边界。 | 作为 trigger / no-write 边界真相源。 |
| Step 8 `02_hld_step_08_processing_flows.md` | 核对 flow 到状态的承接和传播边界。 | 作为触发覆盖、传播边界和 event candidate 来源。 |
| Step 9 `R1.7`~`R1.22` | 汇总八个组成部分的状态定义、禁止迁移和传播影响。 | 作为 cross-audit 主体输入。 |
| L1-governance Step 9 框架 | 只参考跨状态审计的结构和收尾方式。 | 不复制 governance 领域语义。 |
| 旧正式 `02-概要设计.md` §9 与历史 Step 9 | 暂不作为本模块结论来源。 | 仅列入下一模块污染审计范围。 |

本模块当前只审计五类问题:

1. 同名 / 近义状态是否被不同 owner 使用且语义混淆。
2. 触发来源是否覆盖完整且未遗漏 owner。
3. 传播方向是否越界或存在反向污染。
4. Query / Job / event candidate 红线是否被破坏。
5. 旧材料污染的重点比对对象有哪些。

不在本模块直接展开的内容:

- 不直接重写某个组成部分状态定义表。
- 不直接做旧材料逐段 diff。
- 不直接生成正式 §9 摘要文案。
- 不进入 Step 10 异常与边界。

#### R1.23.3 同名 / 近义状态风险候选

当前最需要 cross-audit 的不是每个状态值本身,而是多模块共享术语是否会被误读。初步风险候选如下:

| 状态族 | 涉及组成部分 | 当前风险判断 |
|---|---|---|
| `Ready` / `Available` | 正式版本、受控消费、关系分发、外围 package / assembly、各类 view | 需要确认这些状态都只在各自 owner 层成立,不能跨层误读为“全链路可消费”。 |
| `Stale` | 正式版本 basis、consumption material / availability、trace material、distribution material、external summary view、maintenance progress、assembly / package view | 需要确认 stale 只表达当前 owner 的 freshness 落后,不是上游 truth 无效。 |
| `Unavailable` | consumption、trace、relation / distribution、external summary、maintenance、peripheral package / assembly / view | 需要确认 unavailable 都不回滚 core truth,且区分 truth unavailable、view unavailable、context unavailable。 |
| `Pending` | formalization、impact、protection、maintenance request / progress | 需要确认 pending 是等待判断、等待摘要、等待收敛还是等待执行,不能被统一成单一 backlog 语义。 |
| `Partial` / `Incomplete` | trace material / trace view、audit trail、evidence lineage、maintenance trace refresh、assembly view | 需要确认 partial/incomplete 是否都表示“部分材料可读但不完整”,避免和 rejected / unavailable 混用。 |
| `Retired` / `Superseded` | formal version、impact summary、external summary、maintenance request、package / assembly | 需要确认 retired 是退出当前语境,superseded 是被后续结果替代,两者不能互代。 |
| `Rejected` / `Blocked` / `Violation` | formalization、consumption guard、external body boundary、composition rule、recovery | 需要确认 rejected 是规则或边界否决,blocked 是当前动作被拦截,violation 是线索或正式违规状态。 |
| `Unknown` / `NoAction` / `NoKnownEffect` | impact、protection、integrity、maintenance diagnostics | 需要确认 unknown 不被折叠为 no known effect / no action。 |

当前初步裁决:

- `Ready` / `Available` / `Accepted` 绝不能形成跨模块的“全仓绿色”错觉,后续审计必须显式按 owner 层拆开。
- `Stale` / `Unavailable` / `Partial` 绝不能被任何模块解释为自动触发 truth 修复。
- `Retired` / `Superseded` / `Rejected` 需要按“退出当前语境 / 被后续替代 / 被规则否决”三类固定语义。

#### R1.23.4 触发覆盖审计思路

后续再写入时,触发覆盖要按 `Step 7 接口 -> Step 8 处理流 -> Step 9 状态 owner` 的方向检查。当前先固定检查维度:

| 审计维度 | 当前检查问题 | 预期结果 |
|---|---|---|
| Command 覆盖 | 每个会改变 truth / boundary / material / maintenance / peripheral 的 Command 是否都有状态承接。 | 不允许出现“有 Command,无状态后果”的空洞。 |
| Query 覆盖 | 每个只读 Query 是否只读取已有状态 / view / diagnostic / history。 | 不允许出现 Query 暗含 refresh、repair、create。 |
| Inbound 覆盖 | 外部摘要 / 回报 / safe summary 是否只触发已定义状态或 stale / pending hint。 | 不允许 inbound 直接生成 core truth。 |
| Operations Job 覆盖 | 8 个 Job 是否只承接 maintenance / view refresh / convergence 语义。 | 不允许 job 偷改 truth。 |
| Event candidate 覆盖 | 每组 truth / boundary / material 变化是否都有对应 candidate 或明确无需 candidate。 | 不允许把 candidate 缺口误解为 delivery / relay 需求。 |

当前需要重点核对的触发风险:

- `RefreshPeripheralReadMaterials` 只能承接 package / assembly view freshness,不能改外围 truth。
- `EvaluatePackageComposition` 只应落在 composition disposition 和相关 diagnostic / stale hint,不能变成 truth repair。
- maintenance request / refresh / recovery 与外围 stale / unavailable 的交叉,不能形成双重 owner。
- external summary、relation / distribution、consumption boundary 变化对 peripheral 只应形成 stale / invalidation,不能直接强改 package / assembly。

#### R1.23.5 传播边界审计思路

当前 cross-audit 必须把“状态变化传播到哪里”与“绝不能传播到哪里”统一成一张总边界。先固定审计问题:

| 审计面 | 当前问题 | 预期结论方向 |
|---|---|---|
| truth -> view / material | 核心 truth 变化是否只让各 view/material stale / unavailable / pending。 | 允许单向传播,不允许 view 反写 truth。 |
| boundary / rule -> diagnostic / material | boundary 或 rule 变化是否只影响 blocked / rejected / invalid / stale。 | 允许诊断传播,不允许自动扩权。 |
| external / trace / impact -> protection / maintenance | 这些变化是否只影响 pending / unknown / action required / refresh hint。 | 不允许自动恢复或自动裁决。 |
| maintenance -> read surface | maintenance 结果是否只传播 progress / freshness / convergence。 | 不允许 maintenance 宣称 truth 已修复。 |
| peripheral -> discovery / event candidate | package / assembly 变化是否只影响外围发现和 event candidate。 | 不允许 peripheral 反向影响核心闭环。 |

当前初步裁决:

- 总传播主线应仍是 `core/support truth -> boundary/rule -> read material/view/diagnostic -> maintenance hint / event candidate / peripheral discovery`。
- 任何 `view/material/progress/history` 都不得成为新的反向 truth 输入,除非通过显式 Command / Inbound / Job 重新承接。
- `event candidate` 在本轮始终只是传播候选,不是 outbox delivery truth。

#### R1.23.6 Query / Job / event 红线审计范围

后续再写入时,需要把全局红线集中审计。当前先固定红线范围:

| 红线 | 本轮审计问题 |
|---|---|
| `Query no-write` | 是否有任何 Query 被状态表、传播说明或 unavailable / stale 语义暗示成自动 refresh / create / repair。 |
| `Job 不修 core truth` | 是否有任何 refresh / recovery / peripheral read job 被写成修改 definition、formal version、relation、external summary、package 或 assembly truth。 |
| `event candidate 不等于 delivery` | 是否有任何事件语义滑向 outbox、topic、relay、retry、subscriber、dead letter。 |
| `外部缺失不回滚 truth` | 是否有任何 external unavailable、artifact ref invalid、body boundary rejected 被写成 truth 失效。 |
| `外围不可用不污染核心` | package / assembly / marketplace context unavailable 是否被误写成核心闭环失败。 |
| `maintenance progress 不替代 task truth` | 是否有任何 maintenance progress 被写成 task 真相源。 |

当前高风险点:

- `stale` 很容易在 Query 文案里滑向“自动刷新中”。
- `converged` 很容易在 maintenance 文案里滑向“truth 已修复”。
- `available/ready` 很容易在 peripheral 或 distribution 文案里滑向“已安装 / 已履约 / 已采用成功”。

#### R1.23.7 旧材料污染审计范围预设

下一模块 `旧材料差异审计` 不应从零开始找污染对象,这里先固定范围:

| historical 污染对象 | 下一模块需要重点比对的原因 |
|---|---|
| `MethodContentLifecycle` | 当前 Step 5~9 已不以 `MethodContent` 为主 owner,必须核对旧 §9 是否仍残留统一主状态机。 |
| `OutboxEventStatus` / relay / retry / dead letter | 当前只保留 event candidate,必须核对旧 §9 是否仍混入传播状态机。 |
| snapshot export / `DefinitionSnapshot` | 当前已改成 read material / freshness / maintenance 口径,需核对旧 snapshot 主线残留。 |
| fingerprint drift / recalculation | 当前不作为状态主线,需核对旧 drift 术语残留。 |
| publish / sync / projection rebuild 主线 | 当前只保留 view freshness 和 maintenance,需核对旧发布 / 同步主线残留。 |
| plugin / config / marketplace transaction lifecycle | 当前外围组织只保留 package / method set / composition / discovery,需核对旧外围商业或运行语义残留。 |
| raw log / evidence body / report body | 当前 trace / audit / maintenance 全都 body-free,需核对旧正文型状态残留。 |

#### R1.23.8 下一写入批次边界

下一批 `跨状态一致性审计:再写入` 可以写:

1. 同名 / 近义状态审计表。
2. 接口 / 处理流 / 状态 owner 触发覆盖审计表。
3. 传播边界审计表。
4. Query / Job / event 红线审计表。
5. 旧材料污染审计前置范围确认和停审记录。

不得直接写旧材料逐段 diff、正式 §9 回填草稿、正式文档正文或 Step 10 异常边界。

#### R1.23.9 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做审计先思考 | pass | 只固定 cross-audit 的范围、风险和检查轴。 |
| 是否重写已有状态表 | no | 未修改任何组成部分状态定义。 |
| 是否提前写审计总表正文 | no | 审计表留到再写入。 |
| 是否把旧 §9 当结论来源 | no | 旧材料只作为下一模块污染审计范围。 |
| 是否保持 Query / Job 红线 | pass | 已把 `Query no-write`、`Job 不修 core truth`、`event candidate 不等于 delivery` 固定为审计轴。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9。 |

next_allowed_action: 等待用户确认后进入 Step 9 `跨状态一致性审计:再写入`;可写同名 / 近义状态审计表、触发覆盖审计表、传播边界审计表、Query / Job / event 红线审计表、旧材料污染审计前置范围确认和停审记录,不得直接写正式 §9 回填草稿、旧材料逐段 diff 或 Step 10 异常边界,不得修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.24 跨状态一致性审计:再写入

#### R1.24.1 本模块写入说明

本模块只写 `跨状态一致性审计` 的概要审计产物。它覆盖:

1. 同名 / 近义状态审计表。
2. 接口 / 处理流 / 状态 owner 触发覆盖审计表。
3. 传播边界审计表。
4. Query / Job / event 红线审计表。
5. 旧材料污染审计前置范围确认。
6. 停审记录。

本模块不直接做旧材料逐段 diff,不写正式 §9 回填草稿,不进入 Step 10。

#### R1.24.2 同名 / 近义状态审计表

| 状态族 | 涉及 owner / 组成部分 | 当前统一解释 | 审计结论 |
|---|---|---|---|
| `Ready` / `Available` / `Accepted` | `FormalMethodAssetVersion`;`MethodAssetAvailabilityView`;`DistributionReadMaterial`;`MethodPackage`;`MethodSetAssembly`;各类 view freshness | 这些状态都只在当前 owner 层表达“当前对象在本层可用”,不得跨层推导为“全链路已可消费 / 已采用 / 已安装 / 已履约”。 | pass_with_guard |
| `Stale` | basis summary、consumption material / availability、trace material / view、distribution material、external summary view、maintenance progress、package / assembly view | stale 统一表示“当前 owner 相对其来源落后”,不是来源 truth 失效,也不是自动刷新中的执行态。 | pass_with_guard |
| `Unavailable` | consumption、trace、relation / distribution、external summary、maintenance、peripheral truth / view | unavailable 统一表示“当前 owner 或上下文不可用”,不得回滚已成立 truth;必须区分 truth unavailable、view unavailable、context unavailable。 | pass_with_guard |
| `Pending` | formalization、impact、protection、maintenance request / progress | pending 统一表示“等待判断 / 等待摘要 / 等待收敛 / 等待执行承接”,不得被压成单一 backlog 语义。 | pass_with_guard |
| `Partial` / `Incomplete` | trace material / trace view、audit trail、evidence lineage、trace refresh、assembly view | partial/incomplete 统一表示“部分材料可读但未完整闭合”,不得直接等同 unavailable 或 rejected。 | pass_with_guard |
| `Retired` / `Superseded` | formal version、impact summary、external summary、maintenance request、package / assembly | retired 统一表示退出当前语境;superseded 统一表示被后续结果替代;两者不得互代。 | pass_with_guard |
| `Rejected` / `Blocked` / `Violation` | formalization、consumption guard、external body boundary、composition、recovery | rejected 表示规则 / 边界否决;blocked 表示当前动作被拦截;violation 表示违规或越界线索。三者不能混用。 | pass_with_guard |
| `Unknown` / `NoKnownEffect` / `NoAction` | impact、protection、integrity、maintenance diagnostics | unknown 必须保留未知;no known effect / no action 只能在明确安全依据下出现,不得折叠 unknown。 | pass_with_guard |

统一裁决:

- 本轮未发现必须回退的同名状态冲突,但正式 §9 回填时必须继续显式标注 owner 层,避免把局部 ready / available 误写成全局成功。
- `stale`、`unavailable`、`partial` 是最容易在摘要文案里误读的三组术语,后续旧材料审计和正式回填都要重点复核。

#### R1.24.3 触发覆盖审计表

| 组成部分 | 主要触发来源 | 只读来源 | 运维 / 异步来源 | 事件候选承接 | 审计结论 |
|---|---|---|---|---|---|
| 方法资产定义与目录 | definition / catalog Command | catalog Query | read refresh hint | definition / catalog changed candidate | pass |
| 正式化与版本 | formalization / version Command | formalization / version Query | basis stale / refresh hint | formalization / version changed candidate | pass |
| 受控消费 | boundary / material / guard Command | consumption Query | read refresh hint | boundary / material / violation candidate | pass |
| 追溯与一致性保护 | trace / impact / protection / audit Command | trace / impact / diagnostic Query | trace refresh / maintenance follow-up | trace / impact / protection / lineage candidate | pass |
| 关系与分发语义 | relation / distribution Command | relation / distribution Query | read refresh hint | relation / distribution changed candidate | pass |
| 外部摘要与引用 | external summary / boundary Command + inbound safe summary | external Query | refresh hint / maintenance follow-up | external summary / boundary / lineage candidate | pass |
| 后台维护与收敛 | maintenance Command | progress / task / history Query | 8 个 Operations Job | maintenance request / refresh / recovery / progress candidate | pass |
| 外围包与方法集组织 | package / assembly / composition Command | package / assembly / diagnostic / discovery / history Query | peripheral read refresh hint | peripheral package / assembly / composition / view candidate | pass |

覆盖结论:

- 当前 Step 7 / Step 8 中会改变状态的 Command 已全部找到对应 owner 或传播面。
- 当前 Query 家族都能回指到已有 truth / view / diagnostic / history,未发现必须依赖 Query side effect 的空洞。
- 当前 Inbound 只落在 external summary 等安全摘要输入,未发现直接生成 core truth 的越界。
- 8 个 Operations Job 都已被限制在 refresh / convergence / progress 语义内,没有被状态机要求改 core truth。
- event candidate 已覆盖各 truth / boundary / material / maintenance / peripheral 变化;当前无 delivery / relay 级别覆盖要求。

#### R1.24.4 传播边界审计表

| 审计面 | 允许传播方向 | 禁止传播方向 | 审计结论 |
|---|---|---|---|
| core / support truth -> view / material | definition、formal version、relation、external summary、package / assembly truth 可让相关 view / material stale / unavailable / pending。 | view / material 反向改 truth。 | pass |
| boundary / rule -> diagnostic / material | eligibility、consumption boundary、integrity、external body boundary、composition rule 可传播 blocked / rejected / invalid / stale。 | boundary / rule 自动扩权、自动建立 truth。 | pass |
| external / trace / impact -> protection / maintenance | external summary、trace、impact 可传播 pending / unknown / action required / refresh hint。 | 自动 recovery、自动裁决、自动治理执行。 | pass |
| maintenance -> read surface | maintenance task / progress 只传播 freshness / convergence / history / follow-up hint。 | maintenance 宣称 truth 已修复或直接覆写 truth。 | pass |
| peripheral -> discovery / event candidate | package / assembly / composition 只传播外围 discovery、history、event candidate、view freshness。 | peripheral 反向使核心 definition / formalization / consumption / trace 失败。 | pass |
| event candidate -> downstream | 本轮只传播 candidate fact。 | outbox delivery、relay、subscriber、retry、dead letter 被写成当前状态机。 | pass |

总边界裁决:

- 当前总传播主线仍保持 `truth / rule / boundary -> view / material / diagnostic -> maintenance hint / event candidate / peripheral discovery`。
- 未发现当前模型要求任何 `view / history / progress` 反向充当 truth。
- 当前若在正式 §9 中需要总图,也必须保持单向传播,不得把 candidate、history、progress 画成主状态机节点。

#### R1.24.5 Query / Job / event 红线审计表

| 红线 | 当前检查结果 | 涉及模块 | 审计结论 |
|---|---|---|---|
| `Query no-write` | 各组成部分都已把 Query 固定为读取 truth / view / diagnostic / history / progress,未发现 Query 建立 truth、刷新 view、修复异常或启动 job 的要求。 | Step 9 全部 8 组状态 | pass |
| `Job 不修 core truth` | read refresh、trace refresh、recovery convergence、peripheral read refresh 都只刷新材料、推进收敛或记录 progress,未要求改 definition、formal version、relation、external summary、package truth。 | maintenance、trace、peripheral 交叉 | pass |
| `event candidate 不等于 delivery` | 当前状态和传播说明都停留在 candidate,未进入 topic、relay、subscriber、retry、dead letter。 | definition / formalization / relation / external / maintenance / peripheral | pass |
| `外部缺失不回滚 truth` | external unavailable、artifact ref invalid、body boundary rejected 都只产生 unavailable / rejected / pending / follow-up,未要求回滚已成立 truth。 | external、formalization、trace、maintenance | pass |
| `外围不可用不污染核心` | package / assembly / marketplace context unavailable 只影响外围 view、history、discovery 和 candidate,未要求使核心闭环失败。 | peripheral、relation / distribution、consumption | pass |
| `maintenance progress 不替代 task truth` | progress 只作为 read model,没有被要求替代 `ReadMaterialRefreshTask` / `TraceMaterialRefreshTask` / `ConsistencyRecoveryTask`。 | maintenance | pass |

当前高风险但已压住的点:

- `stale` 文案不能写成“系统正在自动刷新中”。
- `converged` 文案不能写成“所有 truth 已自动修复”。
- `available/ready` 文案不能写成“市场可交易 / 下游已安装 / 组织已采用成功”。

#### R1.24.6 旧材料污染审计前置范围确认

| historical 对象 | 当前确认状态 | 下一模块要做什么 |
|---|---|---|
| `MethodContentLifecycle` | 已明确不继承 | 核对旧 §9 和 historical 内容中是否仍残留统一主状态机文案。 |
| `OutboxEventStatus` / relay / retry / dead letter | 已明确不继承 | 核对旧 §9 是否仍把传播状态混入业务状态。 |
| `DefinitionSnapshot` / snapshot export | 已明确不继承 | 核对旧 snapshot 主线残留是否仍被写成消费或版本状态。 |
| fingerprint drift / recalculation | 已明确不继承 | 核对 drift 术语是否仍被写成正式化或版本状态。 |
| publish / sync / projection rebuild 主线 | 已降级为 freshness / maintenance 语义 | 核对旧发布 / 同步主线残留。 |
| plugin / config / marketplace transaction lifecycle | 已降级为 package / method set / composition / discovery 语义 | 核对旧外围商业或运行语义残留。 |
| raw log / evidence body / report body | 已明确 body-free | 核对旧正文型状态残留。 |

前置结论:

- 下一模块不需要再重新定义污染范围,可以直接对以上七类 historical 对象做差异审计。
- 当前 cross-audit 未发现必须在进入旧材料审计前回退的当前模型冲突。

#### R1.24.7 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成同名 / 近义状态审计 | pass | 已固定 8 组高风险状态族的统一解释。 |
| 是否完成触发覆盖审计 | pass | 已按 8 个组成部分核对 Command / Query / Job / candidate 覆盖。 |
| 是否完成传播边界审计 | pass | 已确认总传播方向和禁止反向传播。 |
| 是否完成 Query / Job / event 红线审计 | pass | 6 条全局红线均已检查。 |
| 是否完成旧材料前置范围确认 | pass | 已固定下一模块的 7 类污染对象。 |
| 是否发现必须回退当前状态模型的冲突 | no | 当前模型可继续进入旧材料差异审计。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9。 |

next_allowed_action: 等待用户确认后进入 Step 9 `旧材料差异审计:先思考`;只思考旧正式 §9 / historical Step 9 的污染比对顺序、比对维度、记录格式和回退判定门槛,不得直接写逐段 diff 正文、正式 §9 回填草稿或 Step 10 异常边界,不得修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.25 旧材料差异审计:先思考

#### R1.25.1 本模块目标与输入边界

本模块只为下一批 `旧材料差异审计:再写入` 固定审计方法,不直接写差异正文。审计对象只包括两类:

1. 正式 `02-概要设计.md` 当前仍残留的旧 §9,即 `9.1 MethodContent 状态定义表`、`9.2 MethodContent 状态流转图`、`9.3 OutboxEvent 状态定义表`、`9.4 OutboxEvent 状态流转图`、`9.5 状态传播关系图`、`9.6 P1 状态概要`。
2. 本文件顶端 historical material,即旧 `MethodContentLifecycle`、`OutboxEventStatus`、snapshot / fingerprint / publish / sync 主线以及旧 P1 plugin / configuration 状态段落。

本模块输入来源如下:

| 输入来源 | 本模块用途 | 使用限制 |
|---|---|---|
| 当前 Step 5~8 和 Step 9 `R1.7`~`R1.24` | 作为“当前真相源”,判断旧材料是否污染当前状态模型。 | 不回退到旧主线取结论。 |
| 正式 `02-概要设计.md` §9 | 作为正式旧材料污染对象。 | 只审计,不在本模块改写。 |
| 本文件顶部 historical 段落 | 作为 historical 旧材料污染对象。 | 只审计,不恢复其语义。 |
| L1-governance Step 9 框架 | 只参考差异审计的章节结构、记录方式和停审方式。 | 不复制 governance 领域语义。 |

本模块不做的事:

- 不直接逐段摘录旧 §9 正文。
- 不直接输出正式 §9 回填草稿。
- 不直接重写当前 8 组状态 owner 表。
- 不进入 Step 10 异常与边界。

#### R1.25.2 差异审计顺序

旧材料差异审计不能按“看到一段旧文案就改一段”的方式进行,否则会重新被旧主线牵引。下一批写入必须按以下顺序:

| 顺序 | 审计层 | 先看什么 | 为什么先看 |
|---:|---|---|---|
| 1 | 主语污染 | 旧 `MethodContentLifecycle`、旧 P1 plugin/configuration、旧 `OutboxEventStatus` 是否仍被当作当前 owner。 | owner 一旦错,后续流转、传播、边界都会一起错。 |
| 2 | 状态族污染 | 旧 `draft / in_review / published / deprecated / retired / superseded`、`pending / published / failed / dead_letter` 是否仍覆盖当前多 owner 状态组。 | 先拆掉旧统一生命周期,才能正确审计各组状态。 |
| 3 | 传播污染 | 旧 event / snapshot / replay / resync / sync 主线是否仍被写成当前传播链。 | 当前只允许 candidate / freshness / maintenance 语义,必须先消歧。 |
| 4 | 只读材料污染 | 旧 snapshot export、fingerprint drift / recalculation、projection rebuild 是否仍被写成业务状态 owner。 | 当前这些只能退回 read material / maintenance / freshness 语义。 |
| 5 | 外围语义污染 | 旧 plugin / configuration / marketplace transaction / install / fulfillment 是否仍被写进当前外围状态。 | 当前外围只允许 package / method set / composition / discovery 语义。 |
| 6 | 形式污染 | 旧 ASCII 图、状态传播图、P1 摘要段是否仍把被排除的主线画成当前主链。 | 即使文字已清理,图示残留仍会反向污染正式文档。 |

顺序裁决:

- 先审 owner 和状态族,再审传播和外围。
- 先审“旧语义是否仍存在”,再审“它应该回落到哪个当前对象”。
- 旧正式 §9 和 historical Step 9 要并行比对,但记录时必须分栏,不能混为一条。

#### R1.25.3 差异审计维度

下一批再写入时,每个旧材料对象都要按固定维度审计,避免只做术语替换。

| 维度 | 审计问题 | 当前判定标准 |
|---|---|---|
| owner 维度 | 旧状态是否仍把 `MethodContent`、`OutboxEvent`、plugin/config 当成当前状态 owner。 | 当前 owner 必须来自 Step 5~8 已闭合对象。 |
| trigger 维度 | 旧状态是否仍依赖 publish、relay、retry、snapshot export、fingerprint recalc 触发。 | 当前触发必须回指 Step 7 / Step 8 的 Command / Query / Inbound / Job / candidate。 |
| transition 维度 | 旧迁移是否仍把多组对象压成单一 lifecycle。 | 当前迁移必须分散到 8 个组成部分的局部状态机。 |
| propagation 维度 | 旧状态是否仍要求 event / snapshot / replay 驱动主传播。 | 当前传播只允许 `truth / rule / boundary -> view / material / diagnostic -> maintenance hint / candidate / discovery`。 |
| boundary 维度 | 旧状态是否越过 body-free、cross-project truth、P0/P1 / peripheral 边界。 | 外部正文、交易履约、下游运行态、UI 状态都不得进入本仓状态主线。 |
| read/write 维度 | 旧 Query / replay / rebuild 语义是否暗含写入。 | 当前必须保持 `Query no-write`、`Job 不修 core truth`。 |
| formal-shape 维度 | 旧表格、ASCII 图和传播图是否仍展示被排除主线。 | 图表也必须按当前对象重建,不能只改正文。 |
| downstream 维度 | 旧语义是否把下游同步 / marketplace / governance 执行结果写成本仓 truth。 | 当前只允许 summary/ref/boundary disposition。 |

高优先级污染维度:

1. `owner + transition`
2. `propagation + read/write`
3. `boundary + downstream`
4. `formal-shape`

如果低优先级术语改掉但高优先级维度仍冲突,则视为“未完成清污”。

#### R1.25.4 差异记录格式

下一批 `旧材料差异审计:再写入` 不做散文式描述,而是固定三张审计记录表:

| 记录表 | 用途 | 每条最少字段 |
|---|---|---|
| 旧正式 §9 污染审计表 | 审计正式文档旧 §9 每个主段落。 | `旧位置`;`旧主语/状态`;`冲突类型`;`当前应回指对象`;`风险级别`;`是否需回退`;`处置结论` |
| historical Step 9 污染审计表 | 审计本文件顶部历史主线内容。 | `旧位置`;`旧主语/状态`;`冲突类型`;`当前应回指对象`;`风险级别`;`是否需回退`;`处置结论` |
| 审计结论汇总表 | 汇总哪些属于纯清污,哪些要求回退当前 Step 9 乃至 Step 5~8。 | `污染族`;`影响范围`;`当前可直接清理`;`需回退到哪一步`;`原因` |

固定冲突类型枚举:

- `owner_conflict`
- `state_family_conflict`
- `propagation_conflict`
- `boundary_conflict`
- `historical_only_but_formal_residual`
- `shape_conflict`
- `downstream_truth_conflict`

固定风险级别口径:

- `L1-cleanup`: 只需在旧材料差异审计中记录,后续正式回填可直接清理。
- `L2-rewrite-section`: 说明正式 §9 某段必须整体重写,不能局部修补。
- `L3-rollback-current-step`: 说明当前 Step 9 已形成的状态模型仍被旧污染牵制,要回退当前 Step 9 某个模块。
- `L4-rollback-upstream-step`: 说明 Step 5~8 的当前结论本身仍缺对象 / 接口 / 处理流支撑,必须回退上游 Step。

#### R1.25.5 回退判定门槛

旧材料差异审计不是默认触发回退。只有满足下面门槛,才允许宣布必须回退:

| 触发条件 | 回退级别 | 判定口径 |
|---|---|---|
| 旧材料只是在正式 §9 或 historical 段落残留,但当前 Step 5~9 已有明确替代 owner / flow / 边界。 | 不回退,只做 `L1-cleanup` 或 `L2-rewrite-section` | 属于文档清污,不是当前模型缺口。 |
| 旧材料暴露出当前 Step 9 某组状态没有 owner、没有 trigger 或没有传播归宿。 | 回退当前 Step 9 对应组成部分 | 说明当前状态模型未闭口。 |
| 旧材料暴露出当前 Step 8 处理流无法支撑当前 Step 9 状态触发。 | 回退 Step 8 对应处理流模块 | flow / state 断裂。 |
| 旧材料暴露出当前 Step 7 接口骨架无法提供状态 owner 或触发入口。 | 回退 Step 7 对应接口模块 | interface / state 断裂。 |
| 旧材料暴露出当前 Step 6 对象轮廓缺失 owner 或对象边界本身错误。 | 回退 Step 6 对应对象模块 | object / state 断裂。 |
| 旧材料试图把已被显式排除的 `MethodContentLifecycle`、`OutboxEventStatus`、snapshot、fingerprint、marketplace transaction 重新拉回当前主线,且当前 Step 5 边界无法容纳替代解释。 | 回退到 Step 5 对应组成部分 | 组成部分边界错误。 |

当前预判:

- 大概率属于 `L1-cleanup` 和 `L2-rewrite-section` 为主。
- 只有发现“当前 8 组状态模型中有哪一组实际上仍靠旧主线撑着”,才进入 `L3/L4` 回退。
- 旧 formal 图示若仍强依赖 `MethodContentLifecycle` 或 `OutboxEventStatus`,通常判为 `L2-rewrite-section`,不直接构成上游回退。

#### R1.25.6 停审边界

下一批 `旧材料差异审计:再写入` 写到下面边界就必须停:

1. 已完成旧正式 §9 污染审计表。
2. 已完成 historical Step 9 污染审计表。
3. 已完成审计结论汇总表。
4. 已明确是否需要回退,以及若回退应回到哪一层。
5. 已写本模块停审记录。

下一批仍不得提前进入的内容:

- 不写正式 §9 回填草稿。
- 不修改正式 `02-概要设计.md`。
- 不直接开始 Step 10。
- 不把差异审计表替换成最终正式图表。

#### R1.25.7 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做旧材料差异审计的先思考 | pass | 只固定顺序、维度、记录格式和回退门槛。 |
| 是否把旧正式 §9 和 historical Step 9 区分开 | pass | 已要求分表记录,不得混写。 |
| 是否明确比较顺序 | pass | 已固定 owner -> 状态族 -> 传播 -> 材料 -> 外围 -> 图示顺序。 |
| 是否明确回退门槛 | pass | 已区分 `L1-cleanup` 到 `L4-rollback-upstream-step`。 |
| 是否直接写了逐段 diff 正文 | no | 本模块未写差异明细条目。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9。 |

next_allowed_action: 等待用户确认后进入 Step 9 `旧材料差异审计:再写入`;可写旧正式 §9 污染审计表、historical Step 9 污染审计表、审计结论汇总表和停审记录,明确哪些属于 `L1-cleanup` / `L2-rewrite-section` / `L3-rollback-current-step` / `L4-rollback-upstream-step`,不得直接写正式 §9 回填草稿、不得修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.26 旧材料差异审计:再写入

#### R1.26.1 本模块写入说明

本模块按 `R1.25` 已固定的方法,正式记录旧正式 §9 和 historical Step 9 的污染审计结果。当前只输出:

1. 旧正式 §9 污染审计表。
2. historical Step 9 污染审计表。
3. 审计结论汇总表。
4. 本模块停审记录。

本模块不直接修改正式 `02-概要设计.md`,不写正式 §9 回填草稿,不进入 Step 10。

#### R1.26.2 旧正式 §9 污染审计表

| 旧位置 | 旧主语/状态 | 冲突类型 | 当前应回指对象 | 风险级别 | 是否需回退 | 处置结论 |
|---|---|---|---|---|---|---|
| 正式 `02-概要设计.md` `§9.1 MethodContent 状态定义表` | `draft / in_review / published / deprecated / retired / superseded` 被当作统一业务状态机。 | `owner_conflict`;`state_family_conflict` | 应拆回当前 8 组 owner,至少回指 `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`FormalizationState`;`FormalMethodAssetVersion`;`MethodAssetAvailabilityView`;`TraceReadMaterial`;`MethodAssetRelation`;`ExternalMethodSummary`;`ReadMaterialRefreshTask`;`MethodPackage`;`MethodSetAssembly`。 | `L2-rewrite-section` | no | 旧统一 lifecycle 与当前多 owner 模型冲突,正式 §9.1 需整体重写,不能局部替换术语。 |
| 正式 `02-概要设计.md` `§9.2 MethodContent 状态流转图` | 旧 `Create/Submit/Publish/Deprecate/Retire/Supersede` 主线把 definition、formalization、consumption 和外围语义压成单一迁移图。 | `state_family_conflict`;`shape_conflict` | 应改为按当前 8 个组成部分分别表达局部流转,至少由 definition / formalization / consumption / trace / relation / external / maintenance / peripheral 分组承接。 | `L2-rewrite-section` | no | 当前 Step 9 已按八组状态 owner 闭口,旧总图必须整体替换。 |
| 正式 `02-概要设计.md` `§9.3 OutboxEvent 状态定义表` | `pending / published / failed / dead_letter` 被当作当前概要状态主线的一部分。 | `owner_conflict`;`propagation_conflict` | 当前只允许 `event candidate` 作为传播候选;若后续确需 delivery / relay / retry 状态,只能留给 `03/04/07` 再闭口。 | `L2-rewrite-section` | no | 旧 delivery 状态不再属于当前概要 Step 9,正式 §9.3 需整段替换为 candidate 边界说明或并入传播备注。 |
| 正式 `02-概要设计.md` `§9.4 OutboxEvent 状态流转图` | relay success / failure / retry exhausted 被画成当前状态流转图。 | `propagation_conflict`;`shape_conflict` | 应回到 `event candidate != delivery` 口径;如保留传播图,只能表达 candidate 影响面,不能画 relay / retry / dead letter。 | `L2-rewrite-section` | no | 当前状态机不拥有投递状态图,正式 §9.4 需整体删除或重写。 |
| 正式 `02-概要设计.md` `§9.5 状态传播关系图` | 旧主线依赖 `AuditRecord -> OutboxEvent -> L0-bus event -> Downstream consumers -> DefinitionSnapshot`。 | `propagation_conflict`;`downstream_truth_conflict`;`shape_conflict` | 应回指当前总传播主线 `truth / rule / boundary -> view / material / diagnostic -> maintenance hint / event candidate / peripheral discovery`。 | `L2-rewrite-section` | no | 旧传播图把 outbox、snapshot 和下游同步写成主传播链,与当前 candidate / freshness / maintenance 口径冲突。 |
| 正式 `02-概要设计.md` `§9.6 P1 状态概要` | `MethodPlugin(P1)`、`MethodConfiguration(P1)` 被保留为外围状态主语。 | `owner_conflict`;`boundary_conflict` | 应回指 `MethodPackage`;`MethodSetAssembly`;`PackageCompositionRule`;`MethodPackageView`;`MethodSetAssemblyView`;`MarketplaceContextRef`。 | `L2-rewrite-section` | no | 当前外围组织已改为 package / method set / composition / discovery 语义,旧 P1 状态概要需整体重写。 |

旧正式 §9 裁决:

- 旧正式 §9 六个主段落全部存在结构级污染,不适合“改几个词”后继续使用。
- 这类污染主要是 `L2-rewrite-section`,即正式 §9 对应段落必须整体重写。
- 当前没有发现必须把 Step 9 乃至 Step 5~8 回退的证据。

#### R1.26.3 historical Step 9 污染审计表

| 旧位置 | 旧主语/状态 | 冲突类型 | 当前应回指对象 | 风险级别 | 是否需回退 | 处置结论 |
|---|---|---|---|---|---|---|
| historical Step 9 `§2 本步输入` + 已确认结论 | 直接声明“本仓存在正式状态机,核心是 `MethodContentLifecycle`;OutboxEvent 有可靠发布状态;P1 plugin/config 有独立后置状态机”。 | `owner_conflict`;`historical_only_but_formal_residual` | 当前 Step 9 应回指 Step 5 的八个组成部分和 Step 6 当前对象群,而不是 `MethodContent` / outbox / plugin/config 三主线。 | `L1-cleanup` | no | 保留为 historical evidence,不得再作为当前结论来源。 |
| historical Step 9 `§3.1`~`§3.4 SOP 回答` | 旧状态集合、触发动作和允许 / 禁止迁移全部围绕 `MethodContentLifecycle`、`OutboxRelayWorker` 和 P1 plugin/config 展开。 | `state_family_conflict`;`propagation_conflict` | 应回指当前 8 组状态 owner、Step 7 当前接口骨架和 Step 8 当前处理流。 | `L1-cleanup` | no | 这些旧回答只能作为污染比对样本,不得复用其状态族或触发动作。 |
| historical Step 9 `§3.5 状态变化影响 outbox、projection、snapshot、下游感知` | 旧传播说明仍以 event / snapshot / replay / sync 为主传播链。 | `propagation_conflict`;`downstream_truth_conflict` | 应回指当前 cross-audit 已固定的总传播主线和 `event candidate != delivery` 红线。 | `L1-cleanup` | no | 保留为历史污染样本,后续正式 §9 传播说明必须完全按当前传播主线重写。 |
| historical Step 9 `§4 当前文档问题诊断` + `§5 改动前后对比` + `§6 设计取舍` | 这些解释建立在“保留 MethodContent 主状态机 + Outbox 传播状态 + P1 后置状态”这个旧方案上。 | `historical_only_but_formal_residual`;`boundary_conflict` | 应回指当前 Step 5~9 已形成的分组状态模型、candidate 边界和 peripheral-only 口径。 | `L1-cleanup` | no | 保留审计痕迹即可,不需要回退当前模型。 |
| historical Step 9 `§7.1`~`§7.4 结构化中间产物` | 旧 `MethodContent` 表、旧 Outbox 表、旧传播图、旧 P1 状态概要仍以结构化产物形式存在。 | `shape_conflict`;`historical_only_but_formal_residual` | 当前可回指 `R1.7`~`R1.24` 的八组状态表、cross-audit 表和后续正式 §9 回填草稿。 | `L1-cleanup` | no | 这些旧产物仅可作为污染证据保留,不得继续参与当前摘要装配。 |

historical Step 9 裁决:

- 旧内容虽仍留在当前文件上方,但已经被明确降级为 historical material。
- 它们当前构成的是“误继承风险”,不是当前模型闭口缺口。
- 因此对 historical 段落的处置以 `L1-cleanup` 为主,不触发回退。

#### R1.26.4 审计结论汇总表

| 污染族 | 影响范围 | 当前可直接清理 | 需回退到哪一步 | 原因 |
|---|---|---|---|---|
| 统一 `MethodContentLifecycle` 主线 | 正式 §9.1 / §9.2;historical `§2`、`§3.1`~`§3.4`、`§7.1` / `§7.2` | 否,正式段落需整体重写;historical 仅保留为证据 | 无 | 当前 Step 5~9 已形成八组 owner,旧统一 lifecycle 只是旧文案残留。 |
| Outbox delivery / relay / retry / dead letter 主线 | 正式 §9.3 / §9.4 / §9.5;historical `§3.3`~`§3.5`、`§7.3` | 否,需整体移出当前概要状态机 | 无 | 当前概要只保留 `event candidate`,delivery 状态不再属于 Step 9 主体。 |
| snapshot / replay / sync / fingerprint 主线 | 正式 §9.5;historical `§3.5`、传播说明与旧论证段落 | 否,需改写为 freshness / maintenance / safe summary 语义 | 无 | 当前 Step 6~8 已把 snapshot / fingerprint 从主状态机降级移除。 |
| P1 plugin / configuration 状态主语 | 正式 §9.6;historical `§2`、`§3.1`、`§5`、`§7.4` | 部分可清理,但正式 §9.6 仍需整体重写 | 无 | 当前外围状态 owner 已切换为 package / method set / composition / discovery。 |
| 图形与表格结构残留 | 正式 §9.2 / §9.4 / §9.5 / §9.6;historical `§7` | 否,不能做局部 patch | 无 | 图示本身承载旧主线,必须按当前状态模型重新装配。 |
| 当前模型回退评估 | Step 5~9 当前结论 | 是 | 无 | 本轮未发现当前状态模型缺 owner、缺 trigger、缺传播归宿,因此不触发 `L3` 或 `L4` 回退。 |

总裁决:

1. 本轮旧材料污染已被锁定为“正式 §9 需要整体重写,historical 内容继续降级保留”的问题类型。
2. 当前没有证据表明 Step 5~8 或 Step 9 已写成的当前模型本身仍靠旧主线支撑。
3. 因此下一步不回退,而是进入 `正式 §9 回填草稿:先思考`。

#### R1.26.5 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成旧正式 §9 污染审计表 | pass | 已逐段审计 `§9.1`~`§9.6`。 |
| 是否完成 historical Step 9 污染审计表 | pass | 已审计顶部旧结论、旧 SOP 回答、旧传播说明和旧结构化产物。 |
| 是否完成审计结论汇总表 | pass | 已汇总污染族、影响范围、是否可直接清理和是否需回退。 |
| 是否发现必须回退当前 Step 9 的缺口 | no | 当前问题属于旧材料残留,不是当前模型未闭口。 |
| 是否发现必须回退 Step 5~8 的缺口 | no | 未发现对象 / 接口 / 处理流支撑断裂。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9。 |

next_allowed_action: 等待用户确认后进入 Step 9 `正式 §9 回填草稿:先思考`;只思考正式 §9 的当前章节骨架、段落压缩顺序、哪些状态表 / 迁移图 / 审计结论需要摘入正式文档以及如何避免把审计表原样搬进正文,不得直接写正式 `02-概要设计.md`,不得进入 Step 10。

### R1.27 正式 §9 回填草稿:先思考

#### R1.27.1 本模块目标与输入边界

本模块只为下一批 `正式 §9 回填草稿:再写入` 固定正式章节骨架和摘录规则,不直接改正式 `02-概要设计.md`。当前输入只来自:

| 输入来源 | 本模块用途 | 使用限制 |
|---|---|---|
| `R1.7`~`R1.22` 八个组成部分状态模块 | 作为正式 §9 的主体内容来源。 | 只摘概要状态定义、精简流转和关键边界,不整表照搬。 |
| `R1.23` / `R1.24` 跨状态一致性审计 | 提供正式 §9 的传播主线、禁止迁移红线和统一术语约束。 | 不把审计表原样搬进正文。 |
| `R1.25` / `R1.26` 旧材料差异审计 | 提供“哪些旧主线必须排除”的正式清污口径。 | 只压缩成正式正文的一句排除声明,不保留风险级别 / 回退列。 |
| `L1-governance` 正式 §9 与其 Step 9 回填草稿说明 | 参考“总览表 + 传播图 + 红线段落”的正式压缩方式。 | 不复制 governance 的状态语义和分组命名。 |
| 正式 `02-概要设计.md` 当前旧 §9 结构 | 作为被替换对象,帮助判断新 §9 如何重排章节。 | 不延续旧 `MethodContentLifecycle` / `OutboxEventStatus` 编排。 |

本模块不做的事:

- 不直接写正式 `02-概要设计.md`。
- 不直接复制 `R1.24` / `R1.26` 的审计表。
- 不提前写 Step 10 异常边界。
- 不把详细设计层的 enum、字段、repository / port、retry、worker 语义带入回填草稿。

#### R1.27.2 正式 §9 当前章节骨架

正式 `02-概要设计.md` 的新 §9 不再沿用旧 `9.1 MethodContent` / `9.3 OutboxEvent` / `9.6 P1` 切法,而应按当前八个组成部分和全局传播边界重排。建议骨架如下:

| 正式章节 | 目标 | 主要来源 |
|---|---|---|
| `9.1 状态机边界总览` | 先声明本仓存在多个正式状态组,并说明本节不再采用旧 `MethodContentLifecycle`、`OutboxEventStatus`、snapshot / fingerprint、P1 plugin/config 主线。 | `R1.3`~`R1.6`;`R1.24`;`R1.26` |
| `9.2 方法资产定义与目录状态` | 摘录 definition / catalog / catalog view 的核心状态和局部流转。 | `R1.7`;`R1.8` |
| `9.3 正式化与版本状态` | 摘录 formalization state、formal version lifecycle、basis availability。 | `R1.9`;`R1.10` |
| `9.4 受控消费状态` | 摘录 consumption material、availability、boundary guard。 | `R1.11`;`R1.12` |
| `9.5 追溯与一致性保护状态` | 摘录 trace material、impact、protection、audit / lineage。 | `R1.13`;`R1.14` |
| `9.6 关系与分发语义状态` | 摘录 relation lifecycle、integrity、distribution ref / material / availability。 | `R1.15`;`R1.16` |
| `9.7 外部摘要与引用状态` | 摘录 external summary、body boundary、acceptance / rejection、summary view freshness。 | `R1.17`;`R1.18` |
| `9.8 后台维护与收敛状态` | 摘录 read refresh、trace refresh、recovery、progress、maintenance request / intervention。 | `R1.19`;`R1.20` |
| `9.9 外围包与方法集组织状态` | 摘录 package、method set assembly、composition、peripheral view availability。 | `R1.21`;`R1.22` |
| `9.10 状态传播与禁止迁移红线` | 压缩 cross-audit 结论,用一张传播图和一段红线说明收束全章。 | `R1.23`;`R1.24`;`R1.26` |

骨架裁决:

- 新 §9 必须从“状态组总览”开头,而不是从某一个旧单对象生命周期开头。
- 八个组成部分各占一个子节,不再把 P1 / outbox / snapshot 单独列为主章节。
- 全局传播和红线统一放到收尾 `9.10`,而不是散落到各子节之外的旧 event / snapshot 主线。

#### R1.27.3 段落压缩顺序

正式 §9 的写入顺序不能按旧 §9 六小节顺序修修补补,必须按当前状态主线重新装配。建议下一批再写入时使用以下顺序:

| 顺序 | 正式段落 | 压缩目标 |
|---:|---|---|
| 1 | `9.1 状态机边界总览` | 用一张总览表和一段排除声明,先拆掉旧单一生命周期错觉。 |
| 2 | `9.2`~`9.4` | 先写 core / support truth 邻近状态组:definition、formalization、consumption。 |
| 3 | `9.5`~`9.7` | 再写 trace / relation / external 等支撑与边界状态组。 |
| 4 | `9.8`~`9.9` | 最后写 maintenance 和 peripheral,避免把它们误读成核心主线。 |
| 5 | `9.10 状态传播与禁止迁移红线` | 以总传播图和红线段落收束,承接后续 Step 10。 |

压缩原则:

- 先写“谁拥有什么状态”,再写“如何流转”,最后写“传播到哪里 / 不得传播到哪里”。
- 每个正式子节只保留当前对象组最核心的状态表、精简 ASCII 图和 2~4 条关键边界说明。
- `9.10` 负责吸收 `R1.24` 的 cross-audit 结果,各局部子节不重复整张审计表。

#### R1.27.4 中间产物到正式 §9 的摘录映射

下一批再写入时,需要明确“摘什么”和“怎么摘”。建议映射如下:

| 中间产物来源 | 正式节 | 建议摘录形态 | 不应直接搬运的内容 |
|---|---|---|---|
| `R1.7` / `R1.8` | `9.2` | 一张压缩状态定义表 + 一张精简 ASCII 图 + 一小段关键说明。 | owner 诊断表、排除项全表、停审记录。 |
| `R1.9` / `R1.10` | `9.3` | 一张 formalization / version 组合表 + 一张局部流转图 + 关键禁止迁移说明。 | 版本排除项长表、旧 fingerprint 清污分析。 |
| `R1.11` / `R1.12` | `9.4` | 一张 consumption / availability / guard 组合表 + 一张局部流转图。 | 下沉到鉴权矩阵、运行时策略、详细 guard 说明。 |
| `R1.13` / `R1.14` | `9.5` | 一张 trace / impact / protection / lineage 组合表 + 一张局部流转图。 | 详细诊断支路、report / evidence 细节。 |
| `R1.15` / `R1.16` | `9.6` | 一张 relation / integrity / distribution 组合表 + 一张局部流转图。 | 图算法、marketplace / runtime 反例长清单。 |
| `R1.17` / `R1.18` | `9.7` | 一张 external summary / boundary / acceptance 组合表 + 一张局部流转图。 | 外部正文边界反例全表、source refresh 细节。 |
| `R1.19` / `R1.20` | `9.8` | 一张 maintenance 组合表 + 一张局部流转图 + 一段“job 不修 truth”说明。 | worker / retry / scheduler 语义。 |
| `R1.21` / `R1.22` | `9.9` | 一张 package / assembly / composition / peripheral view 组合表 + 一张局部流转图。 | marketplace 交易、安装履约、UI / SDK 状态反例长表。 |
| `R1.23` / `R1.24` | `9.1`;`9.10` | `9.1` 摘一张总览表;`9.10` 摘一张传播图 + 一段红线说明。 | cross-audit 明细表、风险候选表、停审记录。 |
| `R1.25` / `R1.26` | `9.1`;`9.10` | `9.1` 用一句“本节不再采用旧主线”;`9.10` 用一句“event candidate 不等于 delivery”。 | 污染审计表、风险级别、回退判定过程。 |

摘录裁决:

- 正式正文摘的是“稳定结论”,不是“思考过程”。
- 一个中间产物进入正式正文时,最多保留:压缩状态表、精简 ASCII 图、关键边界说明。
- 审计表只服务于筛选和清污,不直接成为正式章节主体。

#### R1.27.5 避免把审计表原样搬进正文的规则

`R1.24` 和 `R1.26` 已经很长,下一批必须主动压缩,否则正式 §9 会变成中间产物转存。压缩规则固定如下:

| 审计来源 | 正文压缩方式 | 禁止做法 |
|---|---|---|
| `R1.24` 同名 / 近义状态审计 | 在 `9.1` 用一句“本仓存在多个正式状态组,ready / stale / unavailable 等术语仅在各自 owner 层成立”。 | 把整张同名状态审计表直接贴入正文。 |
| `R1.24` 触发覆盖审计 | 在各局部子节里只保留 1~2 句“由哪些 Command / Inbound / Job 触发”。 | 把 `Command 覆盖 / Query 覆盖 / Job 覆盖` 的审计矩阵搬进正文。 |
| `R1.24` 传播边界审计 | 在 `9.10` 用一张总传播图和 6 条红线压缩。 | 复制整张传播边界审计表。 |
| `R1.26` 旧正式 §9 污染审计 | 在 `9.1` 用一句排除声明,说明不再采用旧 `MethodContentLifecycle` / `OutboxEventStatus` / snapshot / P1 主线。 | 复制 `旧位置 / 冲突类型 / 风险级别 / 是否需回退` 等列。 |
| `R1.26` historical 审计 | 不直接入正文,只作为回填时的排除检查。 | 在正式正文里大段讨论 historical Step 9。 |

固定压缩口径:

1. 正文可以保留结论句,不能保留审计过程列。
2. 正文可以保留红线清单,不能保留 `L1/L2/L3/L4` 风险标签。
3. 正文可以声明“哪些旧主线被排除”,不能继续以旧章节名组织内容。

#### R1.27.6 下一写入批次边界

下一批 `正式 §9 回填草稿:再写入` 只允许在本文件中形成可回填草稿,可写:

1. 新 `9.1`~`9.10` 的正式章节草稿。
2. 一张状态组总览表。
3. 八个组成部分的压缩状态表和精简 ASCII 图。
4. 一张总传播关系图。
5. 一段禁止迁移红线说明。
6. 停审记录。

下一批仍不得做的事:

- 不直接修改正式 `02-概要设计.md`。
- 不回贴 `R1.24` / `R1.26` 原始审计表。
- 不展开 Step 10 异常边界。
- 不写详细设计层 enum、schema、repository / port、worker / retry 细节。

#### R1.27.7 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做正式 §9 回填草稿的先思考 | pass | 只固定章节骨架、压缩顺序和摘录规则。 |
| 是否明确新 §9 章节切法 | pass | 已改为 `9.1 总览 + 8 组状态 + 9.10 红线`。 |
| 是否明确哪些中间产物进入正文 | pass | 已给出从 `R1.7`~`R1.26` 到正式节的摘录映射。 |
| 是否明确避免审计表原样入正文 | pass | 已固定压缩规则和禁止做法。 |
| 是否直接写正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9。 |

next_allowed_action: 等待用户确认后进入 Step 9 `正式 §9 回填草稿:再写入`;可在本文件内写新 `9.1`~`9.10` 的正式回填草稿、状态组总览表、八组压缩状态表、精简 ASCII 图、总传播关系图和红线说明,不得直接修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.28 正式 §9 回填草稿:再写入

#### R1.28.1 回填说明

本草稿用于后续整体替换正式 `02-概要设计.md` 的 §9。它只依据当前 Step 9 的 `R1.7`~`R1.27` 中间产物生成,不继承旧正式 §9 的 `MethodContentLifecycle`、`OutboxEventStatus`、snapshot / fingerprint、publish / sync 或旧 P1 plugin / configuration 主线。

本草稿采用摘要化写法:

- 正式正文只保留状态组总览、八个组成部分的压缩状态表、精简 ASCII 流转图、全局传播图和禁止迁移红线。
- 同名 / 近义状态审计、触发覆盖审计、旧材料污染审计和回退判定过程继续保留在本中间产物。
- 正式正文不下沉到 enum、字段、repository / port、DTO、DDL、worker / retry、topic / payload 或实现细节。

#### R1.28.2 §9.1 状态机边界总览草稿

本仓存在多个正式状态组,不是单一全局状态机。本节不再采用旧 `MethodContentLifecycle`、`OutboxEventStatus`、snapshot / fingerprint 或 P1 plugin / configuration 主线。

| 状态组 | 承载对象 | 主线可消费 / 可见状态 |
|---|---|---|
| 方法资产定义与目录 | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`MethodAssetCatalogView` | `DefinitionEstablished`;`CatalogEntryActive`;`CatalogViewCurrent` |
| 正式化与版本 | `FormalizationState`;`FormalMethodAssetVersion`;`FormalizationBasisSummary` | `FormalizationEligible`;`FormalizationFormalized`;`FormalVersionActive`;`BasisAccepted` |
| 受控消费 | `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard` | `ConsumptionMaterialReady`;`AvailableForConsumption`;`ConsumptionBoundaryActive` |
| 追溯与一致性保护 | `MethodAssetTraceMaterial`;`ConsumptionImpactSummary`;`ConsistencyProtectionPolicy`;`MethodAssetAuditTrail`;`MethodAssetEvidenceLineage` | `TraceMaterialReady`;`ImpactKnown`;`ProtectionSatisfied`;`AuditTrailOrganized`;`EvidenceLineageLinked` |
| 关系与分发语义 | `MethodAssetRelation`;`RelationIntegrityRule`;`MethodAssetDistributionRef`;`DistributionReadMaterial` | `RelationActive`;`IntegritySatisfied`;`DistributionAvailable`;`DistributionMaterialReady` |
| 外部摘要与引用 | `ExternalSourceSummary`;`ExternalSourceRef`;`ArtifactArchiveRef`;`ExternalBodyBoundaryRule`;`ExternalSourceSummaryView` | `ExternalSummaryAccepted`;`ExternalSourceRefRegistered`;`ArtifactArchiveRefRegistered`;`ExternalBodyFreeAccepted`;`ExternalSummaryViewFresh` |
| 后台维护与收敛 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MaintenanceProgressView`;`MaintenanceRunHistory` | `ReadRefreshConverged`;`TraceRefreshConverged`;`RecoveryConverged`;`ProgressConverged` |
| 外围包与方法集组织 | `MethodPackage`;`MethodSetAssembly`;`PackageCompositionRule`;`MethodPackageView`;`MethodSetAssemblyView` | `PackageReady`;`AssemblyReady`;`CompositionAccepted`;`PackageViewFresh`;`AssemblyViewFresh` |

总边界说明:

- `ready / available / accepted` 只在各自 owner 层成立,不得跨层解释为“全链路已成功”。
- `stale / unavailable / partial / pending` 只表达当前 owner 的新鲜度、可见性或待承接状态,不自动触发 truth 修复。
- event 在概要层只保留 `event candidate`,不定义 delivery / relay / retry / dead letter 状态。

#### R1.28.3 §9.2 方法资产定义与目录状态草稿

| 状态组 | 核心状态 | 边界说明 |
|---|---|---|
| Definition lifecycle | `DefinitionEstablished`;`DefinitionUnderAdjustment`;`DefinitionRetired` | definition truth 是正式化、消费、关系和追溯锚点,但不等于正式版本成立。 |
| Catalog entry lifecycle | `CatalogEntryActive`;`CatalogEntryScopeLimited`;`CatalogEntryRetired` | catalog 只表达目录语境和适用范围,不代表全局可消费。 |
| Catalog view freshness | `CatalogViewCurrent`;`CatalogViewStale`;`CatalogViewUnavailable` | view 是派生读取材料,不得反写 definition / catalog truth。 |

```text
DefinitionEstablished -> DefinitionUnderAdjustment -> DefinitionEstablished
DefinitionEstablished / DefinitionUnderAdjustment -> DefinitionRetired

CatalogEntryActive <-> CatalogEntryScopeLimited -> CatalogEntryRetired

CatalogViewCurrent -> CatalogViewStale -> CatalogViewCurrent
CatalogViewCurrent / CatalogViewStale -> CatalogViewUnavailable
```

关键边界:

- definition 成立不等于 formal version active。
- catalog active 不等于 consumption available。
- Query 不创建 definition / catalog entry / catalog view。

#### R1.28.4 §9.3 正式化与版本状态草稿

| 状态组 | 核心状态 | 边界说明 |
|---|---|---|
| Formalization decision | `FormalizationNotStarted`;`FormalizationPending`;`FormalizationEligible`;`FormalizationBlocked`;`FormalizationRejected`;`FormalizationFormalized` | formalization judgement 与 formal version truth 分离。 |
| Basis availability | `BasisAccepted`;`BasisStale`;`BasisInsufficient`;`BasisRejected` | basis 只是输入,不能自动建立版本。 |
| Formal version lifecycle | `FormalVersionCandidate`;`FormalVersionActive`;`FormalVersionSuperseded`;`FormalVersionRetired` | 版本稳定引用不得漂移,历史版本不得被硬删除。 |

```text
FormalizationNotStarted -> FormalizationPending
FormalizationPending -> FormalizationEligible / FormalizationBlocked / FormalizationRejected
FormalizationEligible -> FormalizationFormalized

BasisAccepted -> BasisStale / BasisInsufficient / BasisRejected

FormalVersionCandidate -> FormalVersionActive
FormalVersionActive -> FormalVersionSuperseded / FormalVersionRetired
```

关键边界:

- `FormalizationEligible` 不等于 `FormalVersionActive`。
- `BasisAccepted` 不等于治理审批已完成。
- Job 不重做正式化,也不创建正式版本。

#### R1.28.5 §9.4 受控消费状态草稿

| 状态组 | 核心状态 | 边界说明 |
|---|---|---|
| Boundary disposition | `ConsumptionBoundaryActive`;`ConsumptionBoundaryScopeLimited`;`ConsumptionBoundarySuspended`;`ConsumptionBoundaryRetired` | 边界决定消费语境,但不改 formal version truth。 |
| Consumption material | `ConsumptionMaterialReady`;`ConsumptionMaterialStale`;`ConsumptionMaterialBlocked`;`ConsumptionMaterialUnavailable` | 材料必须锚定 formal version + boundary + guard。 |
| Availability view | `AvailableForConsumption`;`PendingConvergence`;`NotAvailableForContext`;`AvailabilityStale`;`AvailabilityUnavailable` | available 只表示本仓可读,不表示下游已同步或运行。 |
| Guard violation | `DefinitionUseViolationNoticed`;`DefinitionUseViolationBlocking`;`DefinitionUseViolationHandedOff`;`DefinitionUseViolationDismissed` | violation 是线索或阻断,不自动调整 boundary。 |

```text
ConsumptionBoundaryActive <-> ConsumptionBoundaryScopeLimited
ConsumptionBoundaryActive / ConsumptionBoundaryScopeLimited -> ConsumptionBoundarySuspended / ConsumptionBoundaryRetired

ConsumptionMaterialReady -> ConsumptionMaterialStale / ConsumptionMaterialBlocked / ConsumptionMaterialUnavailable
ConsumptionMaterialStale / ConsumptionMaterialUnavailable -> ConsumptionMaterialReady

AvailableForConsumption -> AvailabilityStale / PendingConvergence / NotAvailableForContext / AvailabilityUnavailable
```

关键边界:

- Query 不创建 material 或 availability view。
- cache / index 命中不能替代 boundary / guard。
- boundary blocked 不等于 definition 或 formal version 失效。

#### R1.28.6 §9.5 追溯与一致性保护状态草稿

| 状态组 | 核心状态 | 边界说明 |
|---|---|---|
| Trace material / view | `TraceMaterialReady`;`TraceMaterialStale`;`TraceMaterialIncomplete`;`TraceMaterialUnavailable`;`TraceViewReadable`;`TraceViewPartiallyAvailable` | trace 是解释材料,不修来源 truth。 |
| Impact summary | `ImpactUnknown`;`ImpactPendingDownstreamSummary`;`ImpactKnown`;`ImpactNoKnownEffect`;`ImpactSuperseded` | unknown 必须保留,不能默认压成 no known effect。 |
| Protection decision | `ProtectionPending`;`ProtectionUnknown`;`ProtectionActionRequired`;`ProtectionSatisfied`;`ProtectionNoAction` | protection 只表达判断,不执行 recovery。 |
| Audit / lineage | `AuditTrailOrganized`;`AuditTrailPartial`;`AuditTrailStale`;`AuditTrailUnsafeBodyRejected`;`EvidenceLineageLinked`;`EvidenceLineagePartial`;`EvidenceLineageSuperseded`;`EvidenceLineageBodyRejected` | audit 和 lineage 全部 body-free。 |

```text
TraceMaterialReady -> TraceMaterialStale / TraceMaterialIncomplete / TraceMaterialUnavailable

ImpactUnknown -> ImpactPendingDownstreamSummary / ImpactKnown / ImpactNoKnownEffect / ImpactSuperseded

ProtectionPending -> ProtectionUnknown / ProtectionActionRequired / ProtectionSatisfied / ProtectionNoAction

AuditTrailOrganized -> AuditTrailStale / AuditTrailPartial / AuditTrailUnsafeBodyRejected
EvidenceLineageLinked -> EvidenceLineagePartial / EvidenceLineageSuperseded / EvidenceLineageBodyRejected
```

关键边界:

- `ProtectionActionRequired` 不等于 recovery 已执行。
- `AuditTrailUnsafeBodyRejected` 和 `EvidenceLineageBodyRejected` 不保存被拒正文。
- Query 不组织 trace、impact、protection 或 lineage truth。

#### R1.28.7 §9.6 关系与分发语义状态草稿

| 状态组 | 核心状态 | 边界说明 |
|---|---|---|
| Relation lifecycle | `RelationActive`;`RelationConstrained`;`RelationSuperseded`;`RelationRetired` | relation truth 不是 runtime dependency / recommendation graph。 |
| Integrity disposition | `IntegrityPending`;`IntegritySatisfied`;`IntegrityViolation`;`IntegrityUnknown`;`IntegrityViolationMarked` | integrity 是诊断,不是 repair。 |
| Distribution semantic | `DistributionRefPrepared`;`DistributionContextAdjusted`;`DistributionAvailable`;`DistributionBlocked`;`DistributionUnavailable`;`DistributionRefRetired` | distribution 只表达语义引用,不表示 marketplace listing / install / fulfillment。 |
| Relation / distribution read material | `RelationViewFresh`;`RelationViewStale`;`RelationViewUnavailable`;`DistributionMaterialReady`;`DistributionMaterialStale`;`DistributionMaterialBlocked`;`DistributionMaterialUnavailable` | stale / blocked 只影响读取面和维护提示。 |

```text
RelationActive -> RelationConstrained / RelationSuperseded / RelationRetired
RelationConstrained -> RelationActive / RelationSuperseded / RelationRetired

IntegrityPending -> IntegritySatisfied / IntegrityViolation / IntegrityUnknown
IntegrityViolation -> IntegrityViolationMarked

DistributionRefPrepared -> DistributionContextAdjusted / DistributionAvailable / DistributionBlocked / DistributionUnavailable / DistributionRefRetired

RelationViewFresh -> RelationViewStale -> RelationViewFresh
DistributionMaterialReady -> DistributionMaterialStale / DistributionMaterialBlocked / DistributionMaterialUnavailable
```

关键边界:

- Query 不建立 relation 或 distribution ref。
- integrity violation 不自动修 relation truth。
- distribution available 不等于交易可用或下游已安装。

#### R1.28.8 §9.7 外部摘要与引用状态草稿

| 状态组 | 核心状态 | 边界说明 |
|---|---|---|
| External summary | `ExternalSummaryCaptured`;`ExternalSummaryAccepted`;`ExternalSummaryRejected`;`ExternalSummaryUnavailable`;`ExternalSummaryStale`;`ExternalSummarySuperseded` | accepted summary 可被后续模块引用,但不直接建立其他 truth。 |
| Source / archive ref | `ExternalSourceRefRegistered`;`ExternalSourceRefDuplicateReused`;`ExternalSourceRefInvalid`;`ExternalSourceRefUnavailable`;`ArtifactArchiveRefRegistered`;`ArtifactArchiveDigestChanged`;`ArtifactArchiveRefInvalid`;`ArtifactArchiveRefUnavailable` | ref 必须是 opaque typed ref,不能保存 URL、路径或包体。 |
| Body boundary | `ExternalBodyFreeAccepted`;`ExternalBodyCandidateRejected`;`ExternalBodyViolationNoticed`;`ExternalBodyBoundaryUnknown` | body boundary 只判断入仓边界,不做内容审查或治理审批。 |
| Summary view / history | `ExternalSummaryViewFresh`;`ExternalSummaryViewStale`;`ExternalSummaryViewRejected`;`ExternalSummaryViewUnavailable`;accepted / updated / invalidated / suspended / rejected history | history 是 append-only 线索,不替代当前处置。 |

```text
ExternalSummaryCaptured -> ExternalSummaryAccepted / ExternalSummaryRejected / ExternalSummaryUnavailable / ExternalSummaryStale / ExternalSummarySuperseded

ExternalSourceRefRegistered -> ExternalSourceRefDuplicateReused / ExternalSourceRefInvalid / ExternalSourceRefUnavailable
ArtifactArchiveRefRegistered -> ArtifactArchiveDigestChanged / ArtifactArchiveRefInvalid / ArtifactArchiveRefUnavailable

ExternalBodyFreeAccepted -> ExternalBodyCandidateRejected / ExternalBodyViolationNoticed / ExternalBodyBoundaryUnknown

ExternalSummaryViewFresh -> ExternalSummaryViewStale / ExternalSummaryViewRejected / ExternalSummaryViewUnavailable
```

关键边界:

- unavailable 不等于 rejected。
- inbound 只承接 body-free fact,不接收 payload / artifact body / evidence body。
- stale 只提示后续维护,不在 Query 中刷新。

#### R1.28.9 §9.8 后台维护与收敛状态草稿

| 状态组 | 核心状态 | 边界说明 |
|---|---|---|
| Maintenance request / control | `MaintenanceRequestRegistered`;`MaintenanceRequestSuperseded`;`MaintenanceSuspended`;`MaintenanceFormalInterventionRequired` | request 只登记意图,不等于已执行。 |
| Read refresh | `ReadRefreshPending`;`ReadRefreshInProgress`;`ReadRefreshPartiallyConverged`;`ReadRefreshConverged`;`ReadRefreshStale`;`ReadRefreshUnavailable` | 只刷新派生读取材料。 |
| Trace refresh | `TraceRefreshPending`;`TraceRefreshInProgress`;`TraceRefreshPartial`;`TraceRefreshConverged`;`TraceRefreshBlockedByBodyBoundary`;`TraceRefreshUnavailable` | 只刷新 trace / audit / impact / lineage 材料。 |
| Recovery convergence | `RecoveryNeeded`;`RecoveryPendingAcknowledgement`;`RecoveryConverged`;`RecoverySuspended`;`RecoveryRejected`;`RecoveryFormalInterventionRequired` | recovery converged 不等于 truth 自动修复。 |
| Progress / history | `ProgressPending`;`ProgressConverging`;`ProgressRecoveryNeeded`;`ProgressConverged`;`ProgressStale`;`ProgressUnavailable`;`RunHistoryRecorded`;`RunHistorySupersededHint`;`RunHistoryInterventionHint` | progress 是 read model,history 是 append-only。 |

```text
MaintenanceRequestRegistered -> MaintenanceRequestSuperseded / MaintenanceSuspended / MaintenanceFormalInterventionRequired

ReadRefreshPending -> ReadRefreshInProgress -> ReadRefreshPartiallyConverged / ReadRefreshConverged / ReadRefreshUnavailable
ReadRefreshConverged -> ReadRefreshStale

TraceRefreshPending -> TraceRefreshInProgress -> TraceRefreshPartial / TraceRefreshConverged / TraceRefreshBlockedByBodyBoundary / TraceRefreshUnavailable

RecoveryNeeded -> RecoveryPendingAcknowledgement -> RecoveryConverged / RecoverySuspended / RecoveryRejected / RecoveryFormalInterventionRequired

ProgressPending -> ProgressConverging -> ProgressConverged
ProgressPending / ProgressConverging -> ProgressRecoveryNeeded / ProgressStale / ProgressUnavailable
```

关键边界:

- Query 不创建 task、推进 progress 或确认 recovery。
- Job 不修 definition、formal version、relation、external summary、package 或 method set truth。
- worker / queue / scheduler / retry 不是概要状态。

#### R1.28.10 §9.9 外围包与方法集组织状态草稿

| 状态组 | 核心状态 | 边界说明 |
|---|---|---|
| Package lifecycle | `PackageDraft`;`PackageReady`;`PackageRetired`;`PackageUnavailable` | package ready 只表示外围组织可用。 |
| Assembly lifecycle | `AssemblyDraft`;`AssemblyReady`;`AssemblyStale`;`AssemblyRetired`;`AssemblyUnavailable` | assembly ready 不等于组织运行成功或下游采用成功。 |
| Composition disposition | `CompositionAccepted`;`CompositionRejected`;`CompositionInvalidMemberOrBoundary`;`CompositionContextUnavailable` | composition 只做外围组合判断。 |
| Package / assembly view | `PackageViewFresh`;`PackageViewStale`;`PackageViewInvalidMember`;`PackageViewMarketplaceContextUnavailable`;`PackageViewUnavailable`;`AssemblyViewFresh`;`AssemblyViewStale`;`AssemblyViewInvalidComposition`;`AssemblyViewPartiallyAvailable`;`AssemblyViewUnavailable` | view 是外围读取面,不替代 package / assembly truth。 |

```text
PackageDraft -> PackageReady -> PackageRetired / PackageUnavailable
PackageUnavailable -> PackageReady

AssemblyDraft -> AssemblyReady -> AssemblyStale / AssemblyRetired / AssemblyUnavailable
AssemblyStale / AssemblyUnavailable -> AssemblyReady

CompositionAccepted <-> CompositionRejected / CompositionInvalidMemberOrBoundary / CompositionContextUnavailable

PackageViewFresh -> PackageViewStale / PackageViewInvalidMember / PackageViewMarketplaceContextUnavailable / PackageViewUnavailable
AssemblyViewFresh -> AssemblyViewStale / AssemblyViewInvalidComposition / AssemblyViewPartiallyAvailable / AssemblyViewUnavailable
```

关键边界:

- peripheral unavailable 不污染 core truth。
- package / assembly Query 只读不创建、不刷新 truth。
- marketplace listing / order / install / fulfillment 不属于本仓状态机。

#### R1.28.11 §9.10 状态传播与禁止迁移红线草稿

状态传播关系:

```text
+====================================================================+
|             Method Library State Propagation                       |
+====================================================================+
| Core / support truth accepted                                      |
|   +--> catalog / version / consumption / trace / relation /        |
|        external / peripheral view or material stale / current hint |
|   +--> audit / lineage / history hint                              |
|   +--> event candidate                                             |
|                                                                    |
| Boundary / rule / diagnostic changed                               |
|   +--> blocked / rejected / invalid / unavailable / stale surface  |
|   +--> maintenance follow-up hint                                  |
|                                                                    |
| External / trace / impact / maintenance result                     |
|   +--> protection / progress / discovery / query freshness surface |
|   +--> event candidate                                             |
+====================================================================+
```

禁止迁移红线:

- `Query no-write`: Query 只读取 truth、view、material、diagnostic、history、lineage、progress 或 safe absence。
- `Job 不修 core truth`: maintenance job 只刷新派生材料、推进收敛判断、记录 progress / history。
- `event candidate 不等于 delivery`: 当前只保留 candidate fact,不定义 topic、relay、retry、dead letter。
- `外部缺失不回滚 truth`: external unavailable、artifact ref invalid、body boundary rejected 只产生 safe unavailable / rejected / follow-up。
- `外围不可用不污染核心`: package / assembly / marketplace context unavailable 只影响外围读取和 discovery。
- `maintenance progress 不替代 task truth`: progress view 只能复制 task / recovery truth。

本章不直接定义 outbox delivery、snapshot export、fingerprint drift、worker queue、marketplace transaction 或下游运行状态。

#### R1.28.12 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否形成新 §9 章节骨架草稿 | pass | 已覆盖 `9.1`~`9.10`。 |
| 是否回指当前 Step 9 八组状态结论 | pass | 各节均来自 `R1.7`~`R1.22` 的压缩结果。 |
| 是否吸收 cross-audit 与旧材料清污结论 | pass | `9.1` 和 `9.10` 已压缩承接 `R1.24` / `R1.26`。 |
| 是否避免直接搬运审计表 | pass | 正文只保留结论句、总览表、简图和红线。 |
| 是否避免恢复旧 `MethodContentLifecycle` / `OutboxEventStatus` 主线 | pass | 新草稿改为多状态组结构。 |
| 是否避免下沉详细设计或实现细节 | pass | 未写 enum、字段、repository / port、worker / retry、topic / payload 等细节。 |
| 是否直接修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 当前仍在 Step 9。 |

next_allowed_action: 等待用户确认后进入 Step 9 `自检与停审:先思考`;只思考 Step 9 完成门禁、正式 §9 是否可回填、Step 10 承接输入和 flow / 台账推进策略,不得直接修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.29 自检与停审:先思考

#### R1.29.1 本模块边界

本模块只思考 Step 9 自检与停审口径,不写最终停审结论,不修改正式 `02-概要设计.md`,不进入 Step 10。

本模块目标是判断下一批 `R1.30 自检与停审:再写入` 应如何检查:

1. Step 9 中间产物是否已经完成到可停审状态。
2. `R1.28` 的正式 §9 草稿是否具备回填条件。
3. Step 10 异常与边界场景重审需要承接哪些新状态组、传播红线和旧材料排除口径。
4. flow / 项目台账应在 `R1.30` 后推进到“等待用户决定正式 §9 回填或进入 Step 10 开工”的哪种状态。

#### R1.29.2 自检输入盘点

| 输入 | 用途 | 当前判断 |
|---|---|---|
| `R1.1`~`R1.2` 开工与必读文档 | 检查 Step 9 启动基线、旧正式 §9 降级和本轮只以 Step 5~8 当前结论为第一来源。 | 已完成,可作为门禁依据。 |
| `R1.3`~`R1.4` 状态 owner 候选池 | 检查状态是否仍以 Step 6 当前对象和 Step 5 当前组成部分为 owner 候选。 | 已完成,需在最终自检中确认未回退到旧单一生命周期主线。 |
| `R1.5`~`R1.6` L1-governance 框架对齐 | 检查是否只参考框架深度、章节顺序和停审结构,未复制 governance 领域语义。 | 已完成,需在自检中确认仅借框架不借语义。 |
| `R1.7`~`R1.22` 八个组成部分状态循环 | 检查每个组成部分是否先思考、再写入,且覆盖 truth / view / material / task / history 等状态来源。 | 已完成,是 Step 9 完成门禁主依据。 |
| `R1.23`~`R1.24` 跨状态一致性审计 | 检查同名 / 近义状态、触发覆盖、传播边界、Query / Job / event candidate 红线是否闭合。 | 已完成,需转入停审表。 |
| `R1.25`~`R1.26` 旧材料差异审计 | 检查旧 `MethodContentLifecycle`、`OutboxEventStatus`、snapshot / fingerprint、publish / sync、P1 plugin / configuration 主线是否被排除。 | 已完成,正式 §9 回填前必须保留该红线。 |
| `R1.27`~`R1.28` 正式 §9 回填草稿 | 检查正式 §9 草稿是否覆盖 `9.1`~`9.10`,且只承接当前 Step 9 结论。 | 已完成草稿,但尚未修改正式文档。 |
| Step 5 / Step 6 / Step 7 / Step 8 当前结论 | 检查状态 owner、触发来源、处理流来源和传播方向是否可追溯。 | 已完成,Step 9 可引用其当前结论。 |
| 当前正式 `02-概要设计.md` §9 | 只用于后置污染比对,判断是否仍残留旧状态主线。 | 已完成审计,不得作为 Step 9 第一来源。 |

#### R1.29.3 Step 9 完成门禁候选

下一批应写入以下完成门禁表:

| 门禁 | 应检查内容 | 预期结论 |
|---|---|---|
| 必读与开工基线完成 | 是否列明 Step 9 必读文档、输入基线、旧材料只作后置审计。 | 预计 pass。 |
| owner 候选池正确 | 是否以 Step 5 组成部分和 Step 6 对象为状态 owner 候选,未恢复旧单一 lifecycle。 | 预计 pass。 |
| L1-governance 框架参考正确 | 是否只参考框架粒度、图表密度和收尾方式,未复制治理语义。 | 预计 pass。 |
| 八个组成部分逐个完成 | 是否每个组成部分均完成先思考、再写入和停审。 | 预计 pass。 |
| 跨状态一致性审计完成 | 是否审计同名状态、触发覆盖、传播边界和禁止迁移红线。 | 预计 pass。 |
| 旧材料差异审计完成 | 是否排除旧 `MethodContentLifecycle` / `OutboxEventStatus` / snapshot / fingerprint / publish / sync / P1 主线。 | 预计 pass。 |
| 正式 §9 草稿完成 | 是否形成可回填草稿,且来源只来自当前 `R1.7`~`R1.28` 和 Step 5~8 当前结论。 | 预计 pass。 |
| 正式状态传播方向明确 | 是否锁定 `truth / rule / boundary -> view / material / diagnostic -> maintenance hint / event candidate / peripheral discovery`。 | 预计 pass。 |
| 未下沉详细设计 / 实现 | 是否未写 enum、字段全集、repository / port、DTO、DDL、topic / payload、worker / retry、config、test。 | 预计 pass。 |
| 未进入 Step 10 | 是否只给 Step 10 承接条件,未写异常边界正文。 | 预计 pass。 |

#### R1.29.4 正式 §9 可回填性判断口径

正式 §9 回填应采用与 Step 8 类似的两段式裁决:

1. `R1.30` 只判断 `R1.28` 草稿是否可回填,并提出 flow / 台账推进建议。
2. 只有在用户明确确认后,才允许实际替换正式 `02-概要设计.md` 的 `## 9` 到 `## 10` 之间内容。

可回填性检查应覆盖:

| 检查项 | 判断标准 |
|---|---|
| 章节覆盖 | `R1.28` 已覆盖 `9.1`~`9.10`,能替换正式 §9 主体。 |
| 来源可追溯 | 每个草稿段落能回指 `R1.7`~`R1.28` 和 Step 5 / Step 6 / Step 8 当前结论。 |
| 摘要化适度 | 正式文档只保留状态组总览、压缩状态表、精简 ASCII 图、传播图和红线;完整审计留在中间产物。 |
| 旧主线禁入 | 不恢复旧正式 §9 的 `MethodContentLifecycle`、`OutboxEventStatus`、snapshot / fingerprint、publish / sync 或 P1 plugin / configuration 主线。 |
| 详细设计隔离 | 不写协议 schema、port、repository、topic、payload、worker、scheduler、retry、storage、config 或 test 细节。 |
| 正式文档状态 | 当前仍为 not_written;实际回填必须等用户确认。 |

#### R1.29.5 Step 10 承接判断口径

Step 10 不得沿用旧异常边界前提。下一批自检若通过,只应把 Step 10 推进到“可开工 / 待用户确认”,并要求 Step 10 以新状态组和新传播红线为第一来源。

Step 10 启动前应承接:

| 承接输入 | 来源 | Step 10 使用方式 |
|---|---|---|
| 八个组成部分状态组 | Step 9 `R1.7`~`R1.22` | 作为异常场景 owner 分组,不得新建旧单一 lifecycle 主线。 |
| 状态传播方向与红线 | Step 9 `R1.24` / `R1.28` | 判断异常是否能反写 truth、何处只能降级为 view / material / maintenance hint。 |
| 关键对象与接口触发来源 | Step 6 / Step 7 / Step 8 当前结论 | 判断异常分支属于 Command、Query、Job、Inbound 还是 event candidate 语境。 |
| 旧材料排除清单 | Step 9 `R1.26` | 阻断旧 `OutboxEventStatus`、snapshot / fingerprint、plugin / configuration 生命周期回流。 |
| Step 10 / Step 11 当前状态 | flow 当前表 | 仍视为 `completed_pending_recheck`,只能在 Step 9 停审后按新状态主线重审。 |

若 Step 9 自检发现状态来源仍有缺口,必须回到 Step 9 修补,不得在 Step 10 私补状态或传播规则。

#### R1.29.6 flow / 台账推进策略候选

若 `R1.30` 自检通过,建议状态如下:

| 文件 | 建议状态 | 建议 next_allowed_action |
|---|---|---|
| `02_hld_step_09_state_machine.md` | Step 9 intermediate_completed | 等待用户决定:正式回填 §9,或进入 Step 10 `开工与必读文档:先思考`。 |
| `02_hld_calibration_flow.md` | Step 9 intermediate_completed / wait_user_decision | 不自动进入 Step 10;等待用户确认正式 §9 回填或继续。 |
| `project_execution_ledger.md` | Step 9 intermediate_completed / wait_user_decision | 恢复点指向“等待用户决定正式 §9 回填或 Step 10 开工”。 |
| `02-概要设计.md` | formal §9 pending_rewrite | 当前不修改;后续若用户确认,按 `R1.28` 草稿整体替换 §9。 |

#### R1.29.7 下一写入批次结构

下一批 `R1.30 自检与停审:再写入` 只写:

1. `Step 9 完成门禁自检表`。
2. `正式 §9 草稿可回填性检查`。
3. `Step 10 承接输入与后续风险保留`。
4. `停审裁决`。
5. `flow / 台账推进建议`。
6. `next_allowed_action`。
7. `本模块停审记录`。

#### R1.29.8 禁止事项

下一批不得直接修改正式 `02-概要设计.md`,不得进入 Step 10,不得写异常分支全集、完整 DTO、repository / port、SQL、topic、payload schema、worker、scheduler、queue、retry、dead letter、config 或 test 方案。

若自检发现 Step 9 中间产物缺口,必须停在 Step 9 修复,不得通过正式回填或 Step 10 补口。

#### R1.29.9 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 本模块只定义自检口径和下一写入结构。 |
| 是否写最终停审结论 | no | 最终 pass / fail 留给 `R1.30`。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 10 | no | 只定义 Step 10 承接判断口径。 |
| 是否允许进入自检与停审:再写入 | pass | 自检口径、可回填判断和 flow / 台账推进策略已闭合。 |

next_allowed_action: 等待用户确认后进入 Step 9 `自检与停审:再写入`;只写 Step 9 完成门禁自检、正式 §9 草稿可回填性检查、Step 10 承接输入与后续风险保留、停审裁决和 flow / 台账推进建议,不得直接修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.30 自检与停审:再写入

#### R1.30.1 Step 9 完成门禁自检表

| 门禁 | 结论 | 依据 | 说明 |
|---|---|---|---|
| 必读与开工基线完成 | pass | `R1.1`;`R1.2` | 已列明 Step 9 必读文档、输入基线和旧正式 §9 只作后置差异审计的使用边界。 |
| owner 候选池正确 | pass | `R1.3`;`R1.4`;Step 5;Step 6 | 状态 owner 已回指八个主要组成部分和当前关键对象,未恢复旧单一 lifecycle 主语。 |
| L1-governance 框架参考正确 | pass | `R1.5`;`R1.6` | 仅参考状态章节深度、压缩图组织和停审方式,未复制 governance 领域语义。 |
| 八个组成部分逐个完成 | pass | `R1.7`~`R1.22` | 八个主要组成部分均完成先思考、再写入和停审记录。 |
| 跨状态一致性审计完成 | pass | `R1.23`;`R1.24` | 已审计同名 / 近义状态、触发覆盖、传播边界、event candidate 红线和禁止迁移规则。 |
| 旧材料差异审计完成 | pass | `R1.25`;`R1.26` | 已排除旧 `MethodContentLifecycle`、`OutboxEventStatus`、snapshot / fingerprint、publish / sync 和 P1 plugin / configuration 主线。 |
| 正式 §9 草稿完成 | pass | `R1.27`;`R1.28` | 已形成覆盖 `9.1`~`9.10` 的可回填草稿,来源限定为当前 Step 9 中间产物和 Step 5~8 当前结论。 |
| 正式状态传播方向明确 | pass | `R1.24`;`R1.28` | 已锁定 `truth / rule / boundary -> view / material / diagnostic -> maintenance hint / event candidate / peripheral discovery`。 |
| 未下沉详细设计 / 实现 | pass | `R1.7`~`R1.29` | 未写 enum、字段全集、repository / port、DTO、DDL、topic / payload、worker / retry、config 或 test 细节。 |
| 未进入 Step 10 | pass | `R1.29`;`R1.30` | 当前只完成 Step 10 承接口径,未写异常边界正文。 |

#### R1.30.2 正式 §9 草稿可回填性检查

| 检查项 | 结论 | 说明 |
|---|---|---|
| 章节覆盖 | pass | `R1.28` 已覆盖 `9.1` 状态机边界总览、`9.2`~`9.9` 八个状态组和 `9.10` 状态传播与禁止迁移红线。 |
| 来源可追溯 | pass | 草稿来源可回指 `R1.7`~`R1.28`、Step 5 当前组成部分、Step 6 当前对象和 Step 8 当前处理流来源。 |
| 摘要化适度 | pass | 正式草稿只保留状态组总览、压缩状态表、精简 ASCII 图、传播图和红线;完整审计表留在中间产物。 |
| 旧主线禁入 | pass | 草稿未恢复旧 `MethodContentLifecycle`、`OutboxEventStatus`、snapshot / fingerprint、publish / sync 或 P1 plugin / configuration 主线。 |
| 详细设计隔离 | pass | 草稿未写协议 schema、port、repository、topic、payload、worker、scheduler、retry、storage、配置或测试切口。 |
| 正式文档状态 | not_written | 当前只完成中间产物草稿;正式 `02-概要设计.md` 的 §9 尚未由本模块回填。 |
| 回填前置动作 | wait_user_decision | 需要用户明确确认是否按 `R1.28` 草稿整体替换正式 §9。 |

#### R1.30.3 Step 10 承接输入与后续风险保留

| 承接 / 风险 | 状态 | 后续要求 |
|---|---|---|
| 八个主要组成部分状态组 | ready_for_step10 | Step 10 必须按 Step 9 `R1.7`~`R1.22` 的 owner 分组讨论异常,不得退回旧统一 lifecycle 主线。 |
| 状态传播方向与红线 | ready_for_step10 | Step 10 必须遵守 `truth / rule / boundary -> view / material / diagnostic -> maintenance hint / event candidate / peripheral discovery` 的传播限制。 |
| 关键对象与接口触发来源 | ready_for_step10 | Step 10 必须回指 Step 6 / Step 7 / Step 8 当前结论,区分 Command、Query、Inbound、Job 和 event candidate 语境。 |
| Step 10 / Step 11 historical 结论 | ready_for_recheck | `02_hld_step_10_exceptions_boundaries.md` 和 `02_hld_step_11_configuration_impact.md` 只能作为 historical material,必须按新状态组重审。 |
| 正式 §9 尚未回填 | open_formal_doc_risk | 若用户先进入 Step 10,必须以 Step 9 当前中间产物为第一来源,不得回读旧正式 §9。 |
| 旧 `MethodContentLifecycle` 回流 | blocked_by_rule | Step 10 不得把旧统一生命周期当作异常主链。 |
| 旧 `OutboxEventStatus` 回流 | blocked_by_rule | Step 10 不得把 delivery / relay / retry / dead letter 当作本仓业务状态主链。 |
| snapshot / fingerprint / plugin / configuration lifecycle 回流 | open_risk_for_step10 | 若讨论 freshness / drift / package 相关异常,只能从当前 view / material / progress / package state 重新推导。 |

#### R1.30.4 停审裁决

| 裁决项 | 结论 | 说明 |
|---|---|---|
| Step 9 中间产物是否完成 | completed | 状态机与状态流转已按当前 Step 5 / Step 6 / Step 8 全量重审并完成自检。 |
| 正式 §9 是否已回填 | no | 当前只完成 `R1.28` 可回填草稿,未修改正式 `02-概要设计.md`。 |
| 是否存在 Step 9 blocker | no_blocker_for_current_step | 未发现状态 owner、状态来源、传播边界、旧材料污染或详细设计下沉 blocker。 |
| 是否允许正式 §9 回填 | ready_when_user_confirms | 可按 `R1.28` 草稿整体替换正式 §9,但必须等待用户明确确认。 |
| 是否允许进入 Step 10 | ready_after_user_decision | 若用户选择继续 Step 10,下一动作只能是 Step 10 `开工与必读文档:先思考`,不得直接沿用旧 Step 10 completed 结论。 |

#### R1.30.5 flow / 台账推进建议

| 文件 | 建议状态 | 建议 next_allowed_action |
|---|---|---|
| `02_hld_step_09_state_machine.md` | Step 9 intermediate_completed | 等待用户决定:正式回填 §9,或进入 Step 10 `开工与必读文档:先思考`。 |
| `02_hld_calibration_flow.md` | Step 9 intermediate_completed / wait_user_decision | 不自动进入 Step 10;等待用户确认正式 §9 回填或继续。 |
| `project_execution_ledger.md` | Step 9 intermediate_completed / wait_user_decision | 恢复点指向“等待用户决定正式 §9 回填或 Step 10 开工”。 |
| `02_hld_step_10_exceptions_boundaries.md` | historical completed_pending_recheck / ready_to_reopen | 若用户选择继续,必须从 `开工与必读文档:先思考` 重开。 |
| `02-概要设计.md` | formal §9 pending_rewrite | 当前不修改;后续若用户确认,按 `R1.28` 草稿整体替换 §9。 |

#### R1.30.6 next_allowed_action

```text
等待用户决定下一动作:
1. 若用户要求正式回填 §9,则按 R1.28 草稿整体替换 projects/L3-method-library/02-概要设计.md 的 §9,并同步 flow / 台账。
2. 若用户要求继续 Step 10,则先进入 Step 10 `开工与必读文档:先思考`;Step 10 必须以 Step 9 `R1.7`~`R1.30`、Step 8 `R1.33`、Step 7 `R1.45`、Step 5 / Step 6 当前结论为输入,不得沿用旧正式 §9 或旧 Step 10 作为第一来源。
3. 在用户明确前,不得直接修改正式 02-概要设计.md,不得进入 Step 10。
```

#### R1.30.7 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成最终自检表 | pass | 已写 Step 9 完成门禁自检。 |
| 是否判断正式 §9 草稿可回填 | pass | `R1.28` 可作为正式 §9 回填草稿,但尚未实际修改正式文档。 |
| 是否保留 Step 10 后续风险 | pass | 已保留 formal §9 未回填、旧 lifecycle / outbox status 回流和 historical Step 10 / 11 重审要求。 |
| 是否明确停审裁决 | pass | Step 9 中间产物 completed;下一步等待用户决定。 |
| 是否直接修改正式文档 | no | 未修改正式 `02-概要设计.md`。 |
| 是否进入 Step 10 | no | 未写 Step 10 异常边界正文。 |

next_allowed_action: 等待用户决定下一动作:正式回填 §9,或进入 Step 10 `开工与必读文档:先思考`;在用户明确前不得直接修改正式 `02-概要设计.md`,不得进入 Step 10。

### R1.31 正式 §9 回填记录:再写入

#### R1.31.1 回填动作记录

| 项 | 记录 |
|---|---|
| 用户确认 | 已确认执行正式 §9 回填。 |
| 回填来源 | `R1.28 正式 §9 回填草稿:再写入`。 |
| 回填目标 | `projects/L3-method-library/02-概要设计.md` 的 `## 9. 状态定义与状态流转`。 |
| 回填范围 | 仅整体替换正式 `## 9` 到 `## 10` 之前的内容。 |
| 未修改范围 | 未修改正式 `## 10` 或后续章节。 |
| 回填方式 | 摘要化回填:保留状态组总览、八组压缩状态表、精简 ASCII 图、状态传播关系图和禁止迁移红线;完整 cross-audit、旧材料差异审计和停审过程仍以本文件 `R1.1`~`R1.30` 为准。 |

#### R1.31.2 回填后检查

| 检查项 | 结论 | 说明 |
|---|---|---|
| 正式 §9 是否已回填 | pass | 正式 `02-概要设计.md` 的 §9 已按 `R1.28` 草稿整体替换。 |
| 是否只修改 §9 | pass | 本次回填目标限定在 `## 9` 到 `## 10` 之前。 |
| 是否恢复旧状态主线 | pass | §9 正文未恢复旧 `MethodContentLifecycle`、`OutboxEventStatus`、snapshot / fingerprint、publish / sync 或 P1 plugin / configuration 主线。 |
| 是否保持多状态组结构 | pass | §9 已改为 `9.1` 总览、`9.2`~`9.9` 八组状态和 `9.10` 传播红线结构。 |
| 是否下沉 Step 10 | pass | §9 只写状态边界和传播红线,未写异常边界正文。 |
| 是否下沉详细设计 / 实现 | pass | §9 未写 enum、字段全集、repository / port、topic / payload schema、worker、DDL、配置或测试方案。 |

#### R1.31.3 后续风险保留

| 风险 | 当前状态 | 后续要求 |
|---|---|---|
| Step 10 / Step 11 仍是 historical completed_pending_recheck | open_for_step10_reopen | Step 10 必须从 `开工与必读文档:先思考` 重开,Step 11 继续等待 Step 10 重审后确认。 |
| 旧 Step 10 异常主线回流 | open_for_step10 | Step 10 不得把旧 `MethodContentLifecycle`、`OutboxEventStatus` 或 delivery / retry / dead letter 当异常主链。 |
| 状态传播红线被后续异常讨论削弱 | open_for_step10 | Step 10 必须承接 §9.10 的传播方向和禁止迁移红线,不得通过异常分支反写 truth owner。 |
| worker / queue / retry / outbox delivery 细节回流 | open_for_03_or_04 | 若后续需要,只能在详细设计、配置设计或实施计划重新闭口,不得回灌概要状态机。 |

#### R1.31.4 本模块最终裁决

| 裁决项 | 结论 | 说明 |
|---|---|---|
| Step 9 中间产物 | completed | `R1.1`~`R1.30` 已闭合状态 owner、八组状态、cross-audit、旧材料审计、草稿和停审。 |
| 正式 §9 | backfilled | 正式 §9 已按 `R1.28` 回填。 |
| Step 9 blocker | none | 当前 Step 9 无遗留 blocker。 |
| 下一步 | ready_for_step10_opening | 下一步只能进入 Step 10 `开工与必读文档:先思考`,不得直接沿用旧 Step 10 completed 结论。 |

next_allowed_action: 等待用户确认后进入 Step 10 `开工与必读文档:先思考`;Step 10 必须以正式 §9 回填后文本、Step 9 `R1.1`~`R1.31`、Step 8 `R1.33`、Step 7 `R1.45`、Step 5 / Step 6 当前结论为输入基线,不得沿用旧正式 §10 或 historical Step 10 作为第一来源。
