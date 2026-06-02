# Step 10. 异常与边界场景轮廓

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 10
> 回填章节: `02-概要设计.md` §10 异常与边界场景轮廓
> 生成日期: 2026-06-01
> 状态: 已完成

---

## 1. 本步目标

在 Step 8 关键处理流和 Step 9 状态机已收稳的前提下,点名 `L1-conversation` 不能留到详细设计才发现的关键异常路径与边界场景,并说明它们应落在哪个主要组成部分、application service、对象或边界处理。

本步只写概要设计层异常口径:场景、落点、对处理流 / 状态机 / 跨仓边界的影响。本步不写完整错误码、重试参数、补偿脚本、恢复实现、数据库状态列或运维操作步骤。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_08_processing_flows.md` | 已完成 | 提供 Command、Query、Consumer 和 Job 的主处理流 |
| `02_hld_step_09_state_machine.md` | 已完成 | 提供状态集合、允许迁移、禁止迁移和状态传播关系 |
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供异常应落到哪个主要组成部分 |
| `02_hld_step_06_key_objects.md` | 已完成 | 提供异常影响的关键对象和状态 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供异常从哪些接口进入 |

---

## 3. SOP 问题回答

### 3.1 哪些关键异常路径必须在概要设计层先点名？

必须先点名以下异常路径:

- 写入边界异常:closed / read-only space、actor 不在 participant scope、visibility sealed、source 不可追溯、forbidden body、idempotency 冲突。
- 跨仓显化异常:external ref invalid、source unresolved、snapshot digest 不匹配、来源版本 stale、来源正文试图进入 Conversation truth。
- 读取与订阅异常:projection stale / failed / disabled、cursor expired / invalidated、consumer visibility 不满足。
- 入站事件异常:重复事件、来源不可识别、缺少 space / visibility 边界、事件顺序或版本落后。
- 后台维护异常:outbox publish failed / suppressed、projection rebuild failed、reference refresh failed、handoff failed、consistency mismatch。

这些异常会直接改变 Step 8 主处理流分支,也会进入 Step 9 已定义的 `Rejected`、`Quarantined`、`Unresolved`、`Invalid`、`Stale`、`Failed`、`Suppressed`、`Invalidated` 等状态或 marker。

### 3.2 哪些边界场景会改写主要组成部分、接口、对象或状态机的协作关系？

以下边界场景会改变协作关系:

- 如果 Command 写入命中 closed / read-only / sealed,写入不能进入 domain mutation,只能形成 rejected receipt 或受限 marker。
- 如果 runtime / bridge / inbound event 缺少明确 space、scope 或 visibility,Consumer 不能补造归属,只能 deferred 或 rejected。
- 如果 external ref 无法解析或 digest 不匹配,Manifestation 不能直接进入 `Manifested`,必须进入 unresolved / invalid / stale 口径。
- 如果 projection failed / disabled,Query 不能把派生视图伪装为 fresh,必须走 fallback 或显式 marker。
- 如果 outbox / handoff 失败,不能回滚 truth,只能改变 outbox / handoff 状态和运维证据。

### 3.3 哪些失败不能留到详细设计才发现？

不能留到详细设计才发现的失败包括:

- “是否允许写入”的失败:会决定是否生成 `ConversationFact`、`ScopeChangeRecord`、`CrossDomainManifestation` 或 `ConversationOutboxRecord`。
- “是否复制外部正文”的失败:会决定本仓是否越界拥有 runtime、bridge、artifact、governance、identity 或 external platform truth。
- “派生失败是否影响 truth”的失败:会决定 projection rebuild、search、cursor、reference refresh 能否反写核心 truth。
- “传播失败是否回滚 truth”的失败:会决定 outbox、trace handoff、archive handoff 的状态语义。
- “cursor 是否可续读”的失败:会决定下游消费是否可能越权或漏读。

### 3.4 异常与边界场景在概要设计层需要讲到什么程度才足够？

概要设计层需要讲清:

- 异常从哪个接口、Consumer 或 Job 进入。
- 应由哪个主要组成部分、application service、关键对象或边界承接。
- 当前概要层固定的处理判断,例如 reject、defer、quarantine、mark stale、mark unresolved、mark failed、suppress publish。
- 该异常影响哪些状态机、处理流、outbox、projection、handoff 或 query marker。

不需要讲:

- 完整错误码枚举。
- retry 次数、退避参数和调度实现。
- 数据库事务细节、锁、补偿脚本和恢复操作步骤。
- HTTP / RPC / JSON / proto 字段级错误结构。

### 3.5 哪些内容仍属于详细设计，不应在本步展开？

以下内容留给详细设计:

- 每个异常的 Rust error type、返回类型和错误映射。
- repository 事务边界、并发冲突处理和幂等记录结构。
- retry 策略、dead letter、告警、报告和 run evidence 格式。
- source resolver、digest 校验实现、projection rebuild 算法和 cursor token 编码。
- 对应测试 case 的 fixture、断言和验收证据。

---

## 4. 异常与边界场景表

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| `CreateConversationSpace` 的 owner / actor 引用不满足上游边界 | `Space / scope management` 的 `ConversationSpaceCommandService` 和 `ConversationTruthPolicy` | 不创建 space,不形成 outbox;返回 rejected result,详细设计再定义错误映射 |
| `AppendConversationFact` 发生在 `ReadOnly` / `Closed` space | `Conversation truth core`、`Collaborative fact append` | 不生成 `ConversationFact`;形成 `FactAppendResult.Rejected`,truth 状态不改变 |
| actor 不在 `ParticipantScope` 或参与范围为 `Closed` | `Space / scope management`、`FactAppendPolicy` | 拒绝追加或范围变更;不得由 Query / projection 自动加入参与者 |
| `VisibilityScope` 为 `Sealed` 或 visibility 扩展越界 | `Space / scope management`、`VisibilityPolicy` | 不允许新增可见性扩展;可形成 rejected scope change 或 restricted marker |
| Command 命中幂等重复 | `Conversation truth core`、对应 application service | 返回已有成功结果,不得重复生成 fact、scope change、trace 或 outbox |
| Command 命中幂等冲突 | `Conversation truth core`、对应 application service | 拒绝本次写入,不得把冲突当作 duplicate 成功 |
| fact source 不可追溯或携带 runtime / bridge / external body | `Collaborative fact append`、`FactAppendPolicy`、`ConversationTruthPolicy` | 不追加为正式事实;必要时进入 `ConversationFactState.Quarantined` 或 `FactAppendResult.Rejected` |
| runtime result / bridge mapped event 缺少明确 space / visibility | `Collaborative fact append` 的 Consumer 入口 | Consumer 不补造归属;只能 deferred / rejected,不生成正式 `ConversationFact` |
| `RetractConversationFact` 目标 fact 不可见或不属于当前 space | `Collaborative fact append`、`VisibilityPolicy` | 不执行撤回;保留拒绝 marker,不得泄露不可见 fact |
| `ManifestExternalFact` 的 external ref 格式、来源或权限非法 | `Cross-domain manifestation`、`ReferenceValidityPolicy` | 不形成 `CrossDomainManifestation`;`ReferenceResolutionState.Invalid` 或 rejected result |
| external ref 暂不可解析 | `Local reference / snapshot / projection support`、`Cross-domain manifestation` | 不补造来源 fact;记录 `ReferenceResolutionState.Unresolved` 和降级 marker |
| external snapshot digest 与来源版本不匹配 | `Local reference / snapshot / projection support`、`ReferenceValidityPolicy` | 不把 snapshot 标记为 fresh;进入 `Invalid` 或 `Stale`,显化不得伪装正常 |
| 来源版本变化导致 manifestation stale | `Cross-domain manifestation`、`ExternalSnapshotRefreshJob` | `ManifestationState.Stale`,Query 必须暴露 stale marker,由 refresh job 尝试恢复 |
| 来源正文、secret 或外部平台 message body 试图进入 snapshot / outbox / trace | `Conversation truth core`、`Local reference / snapshot / projection support`、`History trace / review` | 直接拒绝或 quarantine;本仓只能保存引用、安全摘要和脱敏 marker |
| Query consumer 不满足 visibility | `Authorized consumption`、`VisibilityPolicy` | 输出裁剪视图、空视图或 rejected marker,不得输出未授权 fact / manifestation |
| read model / search projection stale | `Authorized consumption`、`Derived consumption support` | Query 返回 stale marker 或降级结果;不得伪装 fresh |
| projection rebuild failed | `Derived consumption support`、`ConversationDerivedMaintenanceService` | `ProjectionFreshnessState.Failed`;不反写 truth,等待后续维护或人工处理 |
| projection disabled | `Derived consumption support`、`Authorized consumption` | Query 不使用该投影作为依据;返回 disabled / unsupported marker 或 fallback |
| cursor expired | `Authorized consumption`、`ConversationChangeCursor` | 不允许继续续读;consumer 必须重新建立读取视图 |
| cursor invalidated by scope change | `Authorized consumption`、`Space / scope management` | 不允许静默恢复;必须重新校验 visibility 并建立新 cursor |
| inbound event 重复消费 | 对应 Consumer、idempotency 边界 | 返回 duplicate / consumed marker,不得重复更新 projection、snapshot、fact 或 outbox |
| inbound event 来源不可识别或 source version 落后 | 对应 Consumer、`ReferenceValidityPolicy` | deferred / unresolved / stale marker;不得覆盖较新的 projection 或 snapshot |
| outbox payload 因 visibility / boundary 不允许发布 | `Conversation truth core`、`PublishConversationOutbox` | `ConversationOutboxPublicationState.Suppressed`;保留内部证据,不跨仓发布 |
| outbox 发布失败 | `Conversation truth core`、`PublishConversationOutbox` | `RetryPending` 或 `Failed`;不得回滚已提交 truth |
| trace handoff payload 含 forbidden body | `History trace / review`、`TraceRetentionPolicy` | 不执行交接;handoff 进入 failed 或 rejected marker,不得外送正文 |
| observability / archive destination 不可用 | `History trace / review`、handoff Job | handoff 进入 `RetryPending` 或 `Failed`;不影响 fact / manifestation truth |
| consistency validation 发现 truth 与 projection / outbox / handoff 不一致 | `Conversation truth core`、`Derived consumption support`、`History trace / review` | 只生成诊断 evidence 和 marker;不得自动覆盖 truth |

说明:

- 表中场景是概要设计必须点名的异常主干,不是完整错误列表。
- 具体错误码、异常类型、HTTP / RPC 映射、retry 参数和测试 fixture 留给详细设计、测试方案和验收标准。
- 若详细设计发现新增异常会改变对象状态或处理流,必须回到本步补充。

---

## 5. 异常影响图

本步补图的原因:以下异常会改变 Step 8 的主处理流分支,并进入 Step 9 已收稳的状态机或 marker。如果不画图,后续详细设计容易把异常当成局部错误处理,而不是对象 / 状态 / 边界协作的一部分。

#### 写入拒绝 / 隔离异常影响图

```text
<Command / Inbound Event>
  │
  ▼
<Command Intake / Event Consumer>
  │ validate actor, scope, visibility, source, idempotency
  ▼
<Policy Boundary>
  │ allowed
  ▼
<Domain Mutation + Outbox>
  │
  ▼
<Committed Result>

<Policy Boundary>
  │ rejected / conflict / unsafe source
  ▼
<Rejected Receipt / Quarantined Marker>
  │
  ▼
<No Fact / No Scope Change / No Outbox>
```

关键说明:

- 写入异常必须在 domain mutation 前截断,不能先写 truth 再靠补偿撤回。
- `Quarantined` 只用于需要保留隔离证据的输入,普通边界失败应是 rejected receipt。
- 图不表达错误码、异常类型、事务实现或补偿脚本。

#### 跨仓引用异常影响图

```text
<ExternalFactRef / Source Event>
  │
  ▼
<ReferenceValidityPolicy>
  │ accepted and resolved
  ▼
<ExternalFactSnapshot.Fresh>
  │
  ▼
<CrossDomainManifestation.Manifested>

<ReferenceValidityPolicy>
  │ unresolved / stale / invalid
  ▼
<ReferenceResolutionState Marker>
  │
  ▼
<ExternalReferenceProjection Degraded View>
  │
  ▼
<No Source Truth Copy>
```

关键说明:

- unresolved / stale / invalid 都是本仓引用状态,不改变来源仓 truth。
- digest 不匹配或权限非法不能绕过 policy 进入 `Manifested`。
- 降级展示只能输出引用、安全摘要和 marker,不能输出来源正文。

#### 派生读取异常影响图

```text
<Query API>
  │
  ▼
<AuthorizedConversationQueryService>
  │ load projection and visibility
  ▼
<ProjectionFreshnessState>
  │ Fresh
  ▼
<Authorized Fresh Result>

<ProjectionFreshnessState>
  │ Stale / Rebuilding / Failed / Disabled
  ▼
<Fallback or Explicit Marker>
  │
  ▼
<No Truth Mutation>
```

关键说明:

- projection 异常只改变读取结果的 freshness / fallback marker,不得反写 truth。
- `Failed` 和 `Disabled` 不能伪装为 `Fresh`。
- 具体 fallback 策略、分页和一致性标记留给详细设计。

#### 传播 / 交接异常影响图

```text
<Committed Truth / Handoff Intent>
  │
  ▼
<Outbox / Handoff Record Pending>
  │ publish or deliver success
  ▼
<Published / HandedOff / Archived>

<Outbox / Handoff Record Pending>
  │ publish or deliver failed
  ▼
<RetryPending / Failed>
  │
  ▼
<Truth Remains Committed>
```

关键说明:

- outbox、trace handoff 和 archive handoff 失败不能回滚已提交 truth。
- failed / retry pending 必须留下可审查 marker,不能被后台静默吞掉。
- 图不表达重试参数、调度策略、dead letter 或运维步骤。

---

## 6. 异常与状态机影响反查

| 异常类别 | 主要影响状态 / marker | 影响的处理流 | 不允许的处理 |
|---|---|---|---|
| 写入边界失败 | `FactAppendResult.Rejected`、`ConversationTruthState.Restricted` | Command 写路径、fact append、scope update | 先写 truth 再补偿删除 |
| 幂等重复 / 冲突 | duplicate result、rejected result | 所有 Command、Consumer | 重复生成 fact、trace、outbox 或 projection |
| source 不可追溯 / forbidden body | `ConversationFactState.Quarantined`、rejected result | `AppendConversationFact`、runtime / bridge consumer | 保存 runtime 推理过程、外部消息正文或 secret |
| external ref invalid / unresolved | `ReferenceResolutionState.Invalid`、`ReferenceResolutionState.Unresolved`、`ManifestationState.Unresolved` | `ManifestExternalFact`、source event consumer、snapshot refresh | 补造来源事实或把 invalid 当 fresh |
| source stale / snapshot stale | `ReferenceResolutionState.Stale`、`ManifestationState.Stale` | `RefreshExternalReferenceSnapshots`、Query | 隐藏 stale 或输出伪 fresh |
| projection failure | `ProjectionFreshnessState.Failed`、`ProjectionFreshnessState.Disabled` | read model / search / cursor query, rebuild job | projection 反写 truth 或伪装 fresh |
| cursor 不可续读 | `ConversationChangeCursorState.Expired`、`ConversationChangeCursorState.Invalidated` | cursor query、poll changes、cursor maintenance | 静默恢复旧 cursor 或绕过 visibility |
| outbox publish 异常 | `RetryPending`、`Failed`、`Suppressed` | `PublishConversationOutbox` | 回滚 truth 或越过 visibility 发布 |
| handoff 异常 | `TraceHandoffState.Failed`、`ArchiveHandoffState.Failed`、`RetryPending` | `DeliverTraceHandoff`、`DeliverArchiveHandoff` | 让交接失败撤回 fact 或删除 history |
| consistency mismatch | diagnostic marker | `ValidateConversationConsistency` | 自动覆盖 truth 或隐藏不一致 |

---

## 7. 异常处理边界说明

### 7.1 可以在概要设计层固定的口径

- 写入前置边界失败必须在 truth mutation 前截断。
- 已提交 truth 的传播 / 交接失败只能改变 outbox / handoff 状态。
- projection / cursor / search / reference refresh 失败只影响读取和维护 marker。
- external unresolved / invalid 不能补造来源事实。
- forbidden body 不能进入 fact、snapshot、trace、outbox 或 handoff payload。
- visibility 和 participant scope 变化后,旧 cursor 不能静默续读。

### 7.2 必须留给详细设计的内容

- `Error` / `Result` 类型、错误码和错误到协议响应的映射。
- 具体幂等记录、事务句柄、锁和并发冲突处理。
- retry 参数、批次大小、dead letter、告警和运维报告。
- source resolver、digest 校验、projection rebuild 和 cursor token 的具体实现。
- 每个异常对应的测试 fixture、断言和验收 evidence 文件。

---

## 8. 当前文档问题诊断与修正结果

| 诊断项 | 修正前风险 | 本步修正 |
|---|---|---|
| 异常如果只留到详细设计 | 详细设计会自行决定 reject、quarantine、stale、failed 等状态 | 将异常映射到 Step 9 状态和 marker |
| 写入异常边界不清 | 可能先写 truth 再补偿 | 明确写入边界失败在 mutation 前截断 |
| 跨仓引用异常不清 | 可能复制来源 truth 或补造来源事实 | 明确 unresolved / invalid / stale 只影响本仓引用状态 |
| 派生异常不清 | 可能让 projection 失败影响 truth | 明确派生异常不反写真相 |
| 传播 / handoff 异常不清 | 可能回滚 truth 或吞掉失败 | 明确只改变 outbox / handoff 状态和 evidence |

---

## 9. 输出约束检查

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否使用异常与边界场景表 | 通过 | §4 使用规范要求的三列表 |
| 场景是否影响对象、接口、处理流、状态机或跨仓边界 | 通过 | 每项均关联 Step 8 处理流或 Step 9 状态 |
| 是否明确异常落点 | 通过 | 每项写明主要组成部分、application service、对象或边界 |
| 是否说明概要口径 | 通过 | 每项写明 reject、defer、quarantine、stale、failed、suppressed 等判断 |
| 是否按需补异常影响图 | 通过 | §5 补 4 张改变主流程或传播关系的图 |
| 是否避免详细设计细节 | 通过 | 未写错误码全集、retry 参数、补偿脚本、数据库列或运维步骤 |

---

## 10. 回填草稿

正式 `02-概要设计.md` §10 可以按以下结构回填:

```text
## 10. 异常与边界场景轮廓

### 10.1 异常与边界场景表
摘录 `design-calibration/02_hld_step_10_exceptions_boundaries.md` §4。

### 10.2 异常影响图
摘录 `design-calibration/02_hld_step_10_exceptions_boundaries.md` §5。

### 10.3 异常与状态机影响反查
摘录 `design-calibration/02_hld_step_10_exceptions_boundaries.md` §6。

### 10.4 异常处理边界说明
摘录 `design-calibration/02_hld_step_10_exceptions_boundaries.md` §7。
```

回填时必须在 §10 开头列出本章引用来源:

- `design-calibration/02_hld_step_05_components_boundary.md`
- `design-calibration/02_hld_step_06_key_objects.md`
- `design-calibration/02_hld_step_07_api_interface_skeleton.md`
- `design-calibration/02_hld_step_08_processing_flows.md`
- `design-calibration/02_hld_step_09_state_machine.md`
- `design-calibration/02_hld_step_10_exceptions_boundaries.md`

---

## 11. 待确认事项

当前 Step 10 无阻塞性待确认事项。

后续 Step 11 需要继续确认:

- 哪些异常口径会受配置影响,例如 projection 是否启用、reference refresh 是否启用、handoff destination 是否启用。
- 哪些边界禁止配置化,例如 forbidden body 不能通过配置放开、projection 不能通过配置反写真相。
- 配置缺失时是否创建配置说明文档并声明本仓是否需要运行期配置。

---

## 12. 进入下一步条件

Step 10 已满足进入 Step 11 的条件:

- 已明确关键异常路径与边界场景。
- 已说明异常分别落在哪个主要组成部分、application service、对象或边界处理。
- 已说明异常对处理流、状态机、outbox、projection、handoff 或 query marker 的影响。
- 未下沉到错误码、重试参数、补偿脚本或恢复实现。
