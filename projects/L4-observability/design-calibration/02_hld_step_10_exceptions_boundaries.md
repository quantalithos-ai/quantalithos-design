# L4-observability 02-概要设计 Step 10 · 异常与边界场景轮廓

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 10
> 回填章节: `02-概要设计.md` §10 异常与边界场景轮廓
> 生成日期: 2026-07-09
> 状态: 已完成,等待用户确认后进入 Step 11

---

## 1. 本步目标

在 Step 08 处理流和 Step 09 多状态族已经收稳的前提下,点名会影响 `L4-observability` 主线理解、主要组成部分协作、接口读写性质、对象状态迁移或跨仓边界的关键异常与边界场景。

本步只写概要层异常轮廓:异常落在哪个部分处理、会让主流程在哪一层断开、会进入哪些受限 / 阻断 / 降级状态、以及哪些结果不能被伪装成成功。本步不写完整错误码表、异常类、retry / backoff 参数、补偿脚本、DLQ topic、事务 rollback 细节、监控指标、测试用例、真实 run id、真实 evidence alias、验收签署或实现代码。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `standards/document/概要设计讨论流程_SOP.md` Step 10 | 已读取 | 约束本步必须输出异常与边界场景表,必要时补异常影响图,且不得下沉到恢复机制。 |
| `standards/document/概要设计书写规范.md` 4.10 / 4.9 辅助段 | 已读取 | 约束场景粒度、表格字段和图示边界。 |
| `02_hld_step_08_processing_flows.md` | 已完成 | 提供 Command、Query、Consumer、Job / Outbox 的处理流族和 no-write / body-free 位置。 |
| `02_hld_step_09_state_machine.md` | 已完成 | 提供状态定义、允许迁移、禁止迁移、状态传播关系和 Step 10 移交主题。 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供异常会落在哪类接口入口和读写性质。 |
| `02_hld_step_06_key_objects.md` 及对象附录 | 已完成 | 提供异常对应的对象承载者和状态对象候选。 |
| `02_hld_step_03_constraints.md` | 已完成 | 提供 redaction-first、body-free、query no-write、consumer 不写外部 truth、job 不修复 truth 等硬约束。 |
| `projects/L4-observability/00-需求文档.md` | 当前正式需求基线 | 提供业务规则、数据归属、接口边界、真实性和验收否决线索。 |
| `projects/L4-observability/01-架构设计.md` | 当前正式架构基线 | 提供 observation-owned truth、一致性策略、通信方式和跨仓边界。 |
| `projects/L1-governance/design-calibration/02_hld_step_10_exceptions_boundaries.md` | 已读取 | 作为 Command / Query / Consumer / Job 异常组织和 no-repair 粒度参考。 |
| `projects/L1-artifact/design-calibration/02_hld_step_10_exceptions_boundaries.md` | 已读取 | 作为 body-free、handoff、derived failure 和 truth ownership 粒度参考。 |
| 旧 `02_hld_step_10_exceptions_boundaries.md` | 已读取 | 仅作 historical material,识别其 schema 摘要化、异常落点不足和自动顺推门禁问题。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取 Step 10 标准、Step 08~09、旧 Step 10 和 L1 参考粒度 | done | 本文件 §2 |
| 回答 SOP 问题,限定概要层异常轮廓边界 | done | 本文件 §4 |
| 诊断旧材料和当前文档风险 | done | 本文件 §5 |
| 输出异常设计取舍 | done | 本文件 §6 |
| 输出异常与边界场景总览表 | done | 本文件 §7 |
| 按处理流族归类异常口径 | done | 本文件 §8 |
| 判断是否需要异常影响图并输出 | done | 本文件 §9 |
| 输出状态机影响清单 | done | 本文件 §10 |
| 完成组成部分停审和跨异常一致性审计 | done | 本文件 §11~§12 |
| 完成 Step 11 移交、回填草稿、自检和门禁 | done | 本文件 §13~§17 |

---

## 4. SOP 问题回答

### 4.1 哪些关键异常路径必须在概要设计层先点名?

必须先点名的异常路径包括:

- 入口 material 含 raw body、source audit body、evidence body、unsafe payload 或未完成 redaction / safety disposition。
- correlation id、trace context、causation id、source event ref、source family 或 schema version 缺失、冲突、过期或不可解析。
- evidence linkage 不是 body-free、evidence ref 不可见、占位 evidence 被误当作真实 evidence、authenticity hint 不足。
- audit projection、safe signal、rollup、read model、diagnostic view、gap surface、handoff readiness 或 external audit export 出现 stale、failed、not-visible、blocked 或 degraded。
- retention marker 与 active reference protection 冲突,或者 cleanup / replay / export 试图绕过 active hold。
- replay、maintenance job、consumer 或 query 试图写入 Governance、Artifact、Identity、Runtime、Sandbox、Archive、Console 或外部 product truth。
- inbound event duplicate、unsupported schema、out-of-order、old source version、source unavailable、forbidden body 或 downstream feedback rejection。
- outbox publication、peripheral delivery、report handoff delivery、external audit export、projection rebuild、rollup rebuild、reference refresh 和 gap scan 失败。

### 4.2 哪些边界场景会改写主要组成部分、接口、对象或状态机的协作关系?

会改写协作关系的边界场景包括:

- Redaction / safety 未闭口时,Command 和 Consumer 不能把 material 推入 safe signal、audit projection、evidence linkage 或 handoff 主线,只能形成 rejected / quarantined / degraded / gap surface。
- Evidence ref 存在但不可见时,read / handoff / export 必须表达 `NotVisible`,不能把它伪装成 missing,也不能泄露 evidence body。
- Query 遇到 stale / failed projection、unresolved reference、blocked gap 或 not-visible material 时,只能返回 freshness / visibility / degraded surface,不得触发 refresh、rebuild、replay 或 source repair。
- Consumer 只能写本地 receipt、marker、snapshot、projection input、stale marker 或 history record;不能绕过 Command 生成外部业务 truth。
- Job 只能维护 outbox、projection、rollup、snapshot、gap、handoff、export 和 progress;失败只写派生 / 传播 / 交接状态,不能回滚已提交 observation truth,也不能修复 source truth。
- Downstream 拒收 outbound event、handoff 或 export 时,只能影响 publication / delivery / handoff marker,不能反向定义本仓 truth 是否成立。

### 4.3 哪些失败不能留到详细设计才发现?

不能留到详细设计才发现的失败,都是会打穿 observation truth 边界、body-free 边界或 no-write 边界的失败:

- raw log、metric label、trace attribute、source audit body、artifact evidence body 或 report body 被保存为本仓 truth。
- placeholder evidence、设计期 alias、伪造 run id 或 handoff readiness 被表达为真实验收证据、final verdict 或 signoff。
- not-visible、suppressed、quarantined、degraded、stale、failed 被静默转成 success。
- retention release、replay、cleanup、export 或 archive handoff 越过 active reference protection。
- outbox / handoff / export / projection 失败反向回滚或修复 observation truth 或外部业务 truth。
- query / consumer / job 在异常路径上写入 source truth、关闭 gap、生成业务结论或补造 external lifecycle state。

### 4.4 异常与边界场景在概要设计层需要讲到什么程度才足够?

概要层需要讲清四件事:

1. 场景落在哪个主要组成部分、application service、domain policy、对象状态或边界处理。
2. 它让主流程在哪一层断开:入口准入、correlation、audit / evidence、read / diagnostic、handoff / export、retention / replay 或 derived maintenance。
3. 它会进入哪些概要层状态语义:rejected、quarantined、body-blocked、not-visible、pending、stale、failed、blocked、degraded、dead-lettered 或 unresolved。
4. 它绝不能被伪装成什么:安全材料、完整关联、真实证据、final verdict、fresh read model、已解决 gap、source truth repair 或 downstream truth。

### 4.5 哪些内容仍属于详细设计,不应在本步展开?

以下内容不在本步展开:

- 每个 Command / Query / Consumer / Job 的正式错误码、response schema 和字段级错误映射。
- 幂等结果存储、duplicate replay、expected version、并发冲突和事务边界实现。
- quarantine / dead-letter payload、retry / backoff 策略、恢复脚本、人工处置和运维手册。
- projection rebuild 的 cursor、分页、affected-view 计算、并行策略和恢复流程。
- handoff / export adapter receipt、target error mapping、external consumer 协议和测试矩阵。

---

## 5. 当前文档问题诊断

| 风险来源 | 问题 | 本轮处理 |
|---|---|---|
| 旧 Step 10 | 写成 log / metric / trace / audit schema 摘要,缺少异常落点、状态影响和处理流族归属 | 全量替换为异常与边界场景轮廓。 |
| 旧 Step 10 | gate 使用旧自动顺推门禁,违背当前“一 Step 一确认”纪律 | 改为 `wait_user_confirmation_before_step_11`。 |
| 旧正式 `02-概要设计.md` | 历史正文没有承接当前 Step 08 / Step 09 的多处理流和多状态族 | 当前不触碰正式文档,后续 Step 14 再装配。 |
| README / 历史材料 | TimescaleDB、Grafana、P95、hash chain、冷存天数等可能把异常写成产品或实现参数 | 保持 historical material,不作为本步正式结论。 |
| 上游协作风险 | Observability 容易在异常路径上变成业务 truth 聚合仓或 repair agent | 本步明确异常只能影响 observation-owned truth、marker、projection、handoff 和 derived side。 |
| 真实性风险 | Report handoff、authenticity hint、evidence linkage 容易被误读为验收签署或真实 run result | 本步将 placeholder、insufficient、not-visible、blocked 与 real evidence linkage 分离。 |

---

## 6. 设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否逐接口列完整异常表 | 不逐接口列 | 概要层按处理流族和状态影响归纳即可;逐接口错误码属于详细设计。 |
| 是否保留异常影响图 | 保留 1 张 | L4 异常会跨 intake、audit、read、handoff、retention、maintenance 和 downstream handoff 传播,需要图示边界。 |
| 是否把 stale / failed projection 作为 query 自动修复触发器 | 不采用 | Query no-write 是架构红线,只能显式返回 freshness / degraded surface。 |
| 是否让 downstream rejection 回滚 observation truth | 不采用 | 传播和交接失败不影响已成立 observation truth。 |
| 是否让 replay / job 修复 source truth | 不采用 | L4 只维护 observation side 和 derived side,不拥有上游业务 truth。 |
| 是否把 placeholder evidence 作为可交付 evidence | 不采用 | 会伪造真实 evidence alias、run id 或验收签署。 |
| 是否把 not-visible 与 missing 合并 | 不采用 | not-visible 表示存在性或可见性受限,不能泄露或伪装为缺失。 |

---

## 7. 异常与边界场景总览

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| Command 缺少 `ActorContext`、`CommandMetadata`、idempotency key 或 trace context | Inbound adapter / application service | 不进入 domain transition;不得生成 observation truth、history 或 outbox success。 |
| 入口 material 含 raw body、source audit body、evidence body 或 unsafe payload | Observation Intake and Safety Admission;Redaction / Safety policy | 进入 `Rejected` / `Quarantined` / `BodyBlocked`;只能保留 safe summary、ref、decision record 或 gap surface。 |
| redaction-first 未完成却试图进入 safe signal / audit projection | SafetyDisposition policy;Safe Signal service;Audit Projection service | 阻断主线;`Pending` / `Quarantined` 不能被下游视为 `Safe`。 |
| log message、metric label、trace attribute 携带高风险正文或高基数字段 | Intake / Safe Signal policy;Correlation service | 拒绝、裁剪或降级为 safe label / template;不得保存 raw payload 或业务正文 label。 |
| correlation id / trace context 缺失、冲突或部分可用 | Correlation Binding service;CorrelationContext policy | 进入 `Unbound` / `Partial` / `Invalid`;partial 只能显式 degraded,不能当完整关联进入 handoff。 |
| source event ref、source family 或 schema version 不合法 | Consumer envelope validation;Reference Snapshot support | consumer receipt rejected / delayed / quarantined;不得猜 schema 或创建业务 truth。 |
| safe signal 被 visibility / safety policy 压制 | Safe Signal service;Gap and Degraded Expression | 进入 `Suppressed`;不能进入正常 rollup / dashboard metric,必须进入 diagnostic / gap surface。 |
| audit projection 候选缺少安全来源、correlation 或 source audit ref | Audit Projection service | 保持 `PendingAppend` 或拒绝 append;不得补造 source audit truth。 |
| audit projection 输入携带 source audit body | Audit Projection boundary;Redaction policy | 拒绝或只提取 safe summary / ref;`AuditProjection::Appended` 不能含 source audit body。 |
| evidence linkage 不是 body-free 或 evidence ref 携带正文 | Body-free Evidence Linkage policy | 进入 `BodyBlocked`;不得进入 `Linked` 或 report evidence index input。 |
| evidence ref 存在但当前不可见 | Evidence Visibility policy;Read Visibility policy;Handoff Readiness policy | 表达为 `NotVisible`;不得伪装成 missing,不得泄露正文或存在性 beyond policy。 |
| evidence linkage 过期或 reference freshness 不足 | Reference Freshness policy;Evidence Linkage service | 进入 `Stale`;handoff / query / export 必须传播 stale。 |
| authenticity hint 发现 placeholder evidence 或设计期 alias | Authenticity Hint policy;Report Handoff and Authenticity | 进入 `PlaceholderDetected` / `Insufficient`;不得成为真实 evidence alias、run id、final verdict 或 signoff。 |
| handoff 缺 evidence index input、gap 未闭口或 visibility 不满足 | Handoff Readiness policy;Gap Status view | 进入 `PendingEvidence` / `Blocked` / `Degraded`;不得导出为 ready。 |
| report handoff delivery 失败或 archive feedback 拒收 | Report Handoff lifecycle;Peripheral Delivery / Outbox publication | 记录 `Failed` / retryable marker;不回滚 handoff record 或 source report truth。 |
| retention marker 与 active reference protection 冲突 | Retention Marker service;Active Reference Protection policy | 进入 `Conflict` / `Protected`;阻断 release、cleanup、destructive replay、handoff / export 越界。 |
| `ReleaseEligible` 被用来删除 source truth 或 archive package | Retention / No-write Guard | 明确禁止;L4 只标记 observation hold / release eligibility,不拥有 source cleanup truth。 |
| replay scope 被 active hold、invalid reference 或 no-write guard 阻断 | Replay Coordination service;NoWriteGuard policy | 进入 `Blocked`;replay 只能作用 observation side,不得修复 runtime / artifact / governance / identity truth。 |
| 发现越权写源尝试 | NoWriteViolation service;NoWriteGuard policy | 记录 `Detected` / `Blocked` / `Escalated`;不得触发补偿写源。 |
| Query 请求触发 refresh、rebuild、replay 或 gap repair | ObservationReadQueryService;DiagnosticViewService | 拒绝写入意图;Query 只返回 visibility、freshness、degraded、blocked 或 unavailable surface。 |
| Query actor 对 material、projection 或 evidence 不可见 | Read Visibility policy | 返回 `NotVisible` / `Restricted`;不得泄露正文、safe summary 或存在性细节 beyond policy。 |
| projection / read model / diagnostic view stale、missing 或 failed | Projection Maintenance state;Read Query assembler | 返回 stale / degraded / unavailable;不写 projection,不触发同步 rebuild。 |
| gap open / acknowledged 被当作 success | GapState policy;DegradedOutput policy | gap 作为可审查输出存在,但不是成功;必须影响 handoff、export、read surface。 |
| gap suppressed 被当作 resolved | Gap Visibility policy | 明确禁止;suppression 只表示当前消费面不展示,不代表缺口解决。 |
| degraded output blocked 时仍生成替代成功输出 | Degraded Output policy;Read / Handoff / Export assembler | 进入 `Blocked`;不得生成替代 success surface。 |
| reference snapshot unresolved、invalid、unavailable 或 stale | Reference Snapshot service;RefreshReferenceSnapshots job | 影响 gap、diagnostic freshness、handoff readiness 和 read freshness;不得补造外部 lifecycle truth。 |
| inbound event duplicate | Consumer idempotency / receipt store | 返回 duplicate receipt 或忽略;不得重复写 snapshot、projection input、gap marker 或 outbox。 |
| inbound event unsupported schema version | Consumer envelope validation | rejected / delayed / quarantined;不得猜 payload 字段或写核心状态。 |
| inbound event out-of-order 或 source version 过旧 | Reference Snapshot support;Consumer ordering policy | 标记 stale / ignored / delayed;不得让 snapshot 或 projection 倒退。 |
| source unavailable 或 external context fetch 失败 | Reference Snapshot support;Refresh job | 进入 `Unavailable` / `Unresolved`;affected read / gap / handoff surface degraded。 |
| report consumer feedback 试图反写 report truth 或关闭 gap | Report Consumer Feedback consumer;Gap input boundary | 只写本地 feedback marker / gap input marker;不能定义 report truth 或直接 resolve gap。 |
| external audit export 被 visibility、gap、retention 或 body-free 阻断 | Peripheral Consumption and Export;External Audit Export policy | 进入 `Blocked`;不得导出替代成功材料或 evidence body。 |
| peripheral / dashboard / alert delivery failed | Peripheral Delivery state;RebuildPeripheralViews job | 记录 failed / retryable marker;不改变 read truth、audit projection 或 gap truth。 |
| outbox publication failed | PublishObservationOutbox job;OutboxPublicationState | 进入 `Failed`;不回滚已提交 observation truth。 |
| outbox publication unrecoverable | PublishObservationOutbox job;operations visibility | 进入 `DeadLettered`;必须运维可见,不能被 query / ops 静默隐藏。 |
| projection rebuild / rollup rebuild failed | Derived Maintenance and Replay Coordination | `ProjectionMaintenanceState::Failed` / `RollupRebuildState::Failed`;query degraded,truth 不变。 |
| gap scan failed 或只得到 partial result | Gap Scan job;Diagnostic freshness | 返回 failed / partial diagnostic;不得自动关闭 gap。 |
| downstream rejects outbound event / handoff / export | Publish / Handoff / Export boundary | 只影响 publication / delivery / handoff marker;downstream 不能反向定义 L4 truth。 |

---

## 8. 按处理流族归类的异常口径

### 8.1 Command 写路径异常

| 异常 | 影响状态 | 概要口径 |
|---|---|---|
| actor / metadata / idempotency / trace context 缺失 | 无 truth 状态变化 | 在 inbound / application 层拒绝,不进入 domain transition。 |
| redaction、body-free、correlation、retention、gap 或 no-write policy 不通过 | 对应对象保持原状态或进入 rejected / blocked / degraded | command 返回失败 surface;不得写 success history / outbox。 |
| evidence / reference / source context 不可见或不可解析 | `PendingEvidence`、`NotVisible`、`Unresolved`、`Unavailable`、`Stale` | 暂停或阻断主线;不得补造 external truth。 |
| expected state 与 Step 09 允许迁移不匹配 | 对象保持原状态或进入显式 blocked / invalid surface | 概要层要求不得私自跨状态;具体错误映射留给详细设计。 |
| truth、history、outbox、stale marker 或 command result 同一成立边界不完整 | 不形成 accepted truth | 详细设计闭口事务与幂等;概要层只要求不能半成功对外表达。 |

### 8.2 Query 只读异常

| 异常 | 影响状态 | 概要口径 |
|---|---|---|
| actor 不可见或 visibility scope 不满足 | 无核心状态变化 | 返回 restricted / not-visible / redacted surface,不泄露正文。 |
| projection / rollup / diagnostic stale 或 failed | 无核心状态变化 | 返回 freshness / degraded / unavailable,不触发 rebuild。 |
| evidence body blocked、not-visible 或 stale | 无核心状态变化 | 明确区分 body-blocked、not-visible、missing 和 stale。 |
| gap open、suppressed 或 degraded active | 无核心状态变化 | 响应必须暴露 gap / degraded surface,不补造成功。 |
| query 参数试图要求 replay、refresh、repair 或 source write | 无状态变化 | 拒绝写意图或降为只读查询;Query 不写业务状态。 |

### 8.3 Inbound Event Consumer 异常

| 异常 | 影响状态 | 概要口径 |
|---|---|---|
| duplicate source event | consumer receipt only | 不重复写本地 marker、snapshot、projection input 或 outbox。 |
| unsupported schema version 或 invalid envelope | rejected / delayed / quarantine surface | 不猜 payload,不写核心状态。 |
| forbidden body received | 无核心 truth 状态变化或 quarantine marker | 只允许 ref / safe summary / rejection reason,正文不得保存。 |
| out-of-order 或 old source version | stale / ignored / delayed marker | 不让 reference snapshot、projection input 或 gap marker 倒退。 |
| source unavailable / reference unresolved | `ReferenceSnapshotState::Unavailable / Unresolved`;affected stale marker | 影响 read / diagnostic / handoff freshness,不创建 source truth。 |
| downstream feedback 带有业务结论或 truth override | feedback marker rejected or safe summary only | 不能反写 report、governance、artifact、runtime 或 archive truth。 |

### 8.4 Operations Job / Outbox / Handoff 异常

| 异常 | 影响状态 | 概要口径 |
|---|---|---|
| outbox publish failed | `OutboxPublicationState::Failed` | 单项传播失败不回滚 truth,只进入 publication / operations surface。 |
| outbox unrecoverable failure | `OutboxPublicationState::DeadLettered` | 必须运维可见;具体 dead-letter payload 与恢复留给详细设计。 |
| read model / diagnostic / rollup rebuild failed | `ProjectionMaintenanceState::Failed`;`RollupRebuildState::Failed` | query degraded,truth 不变。 |
| reference refresh failed | `ReferenceSnapshotState::Unavailable / Unresolved / Stale` | affected views stale,不补造 external state。 |
| gap scan partial / failed | `DiagnosticFreshnessState::Partial / Unavailable`;gap unchanged | 只暴露 partial / failed,不自动 close / resolve。 |
| handoff / external audit export / peripheral delivery failed | `ReportHandoffState::Failed`;`ExternalAuditExportState::Blocked`;`PeripheralDeliveryState::Failed` | 只影响交付状态,不生成 final verdict 或 source truth。 |
| replay coordination blocked | `ReplayScopeState::Blocked`;`NoWriteViolationState::Blocked` | replay 不越过 no-write、retention 和 active reference boundary。 |

---

## 9. 异常影响图

```text
+====================================================================+
|                 Observation Exception Boundary Map                 |
+====================================================================+
| Command / Intake exception                                          |
|   | unsafe body / missing metadata / policy / reference failure     |
|   v                                                                |
| Rejected / Quarantined / Pending / Blocked / Degraded surface       |
|   | no accepted observation truth unless safety + domain transition |
|   v                                                                |
| History / outbox / stale marker only after committed boundary       |
|                                                                    |
| Query exception                                                     |
|   | not-visible / stale / failed projection / open gap              |
|   v                                                                |
| Read / diagnostic / evidence index degraded surface                 |
|   | never refreshes, rebuilds, replays, repairs, or writes source    |
|   v                                                                |
| Consumer sees explicit visibility and freshness limits              |
|                                                                    |
| Consumer exception                                                  |
|   | duplicate / unsupported / forbidden body / old source           |
|   v                                                                |
| Receipt + local marker + snapshot + projection input only           |
|   | never creates external business truth                           |
|   v                                                                |
| Observation side remains source-bound and body-free                 |
|                                                                    |
| Job / outbox / handoff exception                                    |
|   | publish / rebuild / refresh / scan / delivery failure           |
|   v                                                                |
| Publication / projection / reference / gap / handoff failure state  |
|   | never rolls back truth and never repairs source truth            |
|   v                                                                |
| Operations visibility + detailed-design recovery later              |
+====================================================================+
```

关键说明:

- 该图只表达异常落点和跨处理流边界,不表达错误码、重试参数、补偿脚本、DLQ 结构或运维步骤。
- Command / Intake 异常的红线是:没有通过 safety 与 domain transition,就没有 accepted observation truth。
- Query 异常的红线是:只能显式暴露可见性、freshness、gap 或 degraded surface,不能顺手修复。
- Consumer / Job 异常的红线是:只能影响本地 marker、snapshot、projection、publication、handoff 和 operations visibility,不能改写 source truth。

---

## 10. 状态机影响清单

| 异常类别 | 可能进入的状态 | 禁止进入的状态或行为 |
|---|---|---|
| unsafe material / forbidden body | `ObservationReceipt::Rejected / Quarantined`;`SafetyDisposition::Rejected / Quarantined`;`EvidenceLinkage::BodyBlocked` | `Accepted`、`Safe`、`Linked` by shortcut |
| redaction pending | `SafetyDisposition::Pending`;`ObservationReceipt::Degraded` | safe signal、audit projection 或 handoff success |
| correlation partial / invalid | `CorrelationContext::Partial / Invalid`;`DegradedOutput::Active` | 完整 `Bound` 语义或正常 handoff |
| signal suppressed / stale | `SafeSignal::Suppressed / Stale`;`SignalRollup::Stale / Failed` | normal rollup / dashboard success |
| audit projection blocked / restricted | `AuditProjection::PendingAppend / VisibilityRestricted / Suppressed` | source audit truth mutation |
| evidence not visible / body blocked / stale | `EvidenceLinkage::NotVisible / BodyBlocked / Stale`;`ReadVisibility::NotVisible` | evidence missing success、body leakage、`Linked` by assumption |
| handoff evidence gap / placeholder | `HandoffReadiness::PendingEvidence / Blocked / Degraded`;`AuthenticityHint::PlaceholderDetected / Insufficient` | final verdict、signoff、real evidence alias |
| retention conflict / active protection | `RetentionMarker::Conflict`;`ActiveReferenceProtection::Protected` | cleanup、release、destructive replay、source delete |
| replay no-write violation | `ReplayScope::Blocked`;`NoWriteViolation::Detected / Blocked / Escalated` | runtime / artifact / governance / identity truth repair |
| query visibility / freshness issue | `ReadVisibility::Restricted / NotVisible / Blocked`;`DiagnosticFreshness::Stale / Partial / Unavailable` | query-triggered refresh / rebuild / replay |
| gap / degraded output issue | `GapState::Open / Acknowledged / Suppressed`;`DegradedOutput::Active / Blocked` | implicit success or auto resolve |
| reference unresolved / unavailable / stale | `ReferenceSnapshotState::Unresolved / Invalid / Unavailable / Stale` | external lifecycle truth replacement |
| consumer duplicate / old event / unsupported schema | receipt duplicate / rejected / delayed / stale marker | repeated projection input、snapshot rollback、schema guessing |
| outbox publish failed / dead-lettered | `OutboxPublication::Failed / DeadLettered` | rollback of accepted observation truth |
| projection / rollup rebuild failed | `ProjectionMaintenance::Failed`;`RollupRebuild::Failed` | core truth mutation or query success without freshness |
| handoff / peripheral / export delivery failed | `ReportHandoff::Failed`;`PeripheralDelivery::Failed / Retryable`;`ExternalAuditExport::Blocked` | downstream rejection defining L4 truth |

---

## 11. 异常归属停审记录

| 主要组成部分 | 停审结果 | 说明 |
|---|---|---|
| `Observation Intake and Safety Admission` | pass | 已点名 unsafe body、redaction pending、quarantine、rejected 和 degraded intake 场景。 |
| `Correlation and Safe Signal Capture` | pass | 已点名 partial / invalid correlation、suppressed signal、stale rollup 和 high-risk label 场景。 |
| `Audit Projection and Body-free Evidence Linkage` | pass | 已点名 source audit body、body-free failure、not-visible、stale evidence 和 audit append 前置缺口。 |
| `Report Handoff and Authenticity` | pass | 已点名 pending evidence、blocked / degraded readiness、placeholder evidence、delivery failed 和 non-signoff 边界。 |
| `Retention, Replay and No-write Guard` | pass | 已点名 active reference、retention conflict、replay blocked、no-write violation 和 source cleanup 越界。 |
| `Read Query and Diagnostic Consumption` | pass | 已点名 not-visible、restricted、stale / failed projection、gap / degraded surface 和 query no-write。 |
| `Gap and Degraded Expression` | pass | 已点名 open、acknowledged、suppressed、blocked、partial scan 和不得自动 resolve。 |
| `Peripheral Consumption and Export` | pass | 已点名 export blocked、delivery failed、external audit handoff rejected 和 no evidence body。 |
| `External Reference Snapshot and Adapter Boundary` | pass | 已点名 unresolved、invalid、unavailable、stale、old source event 和 unsupported schema。 |
| `Derived Maintenance and Replay Coordination` | pass | 已点名 outbox failed / dead-lettered、rebuild failed、refresh failed、gap scan failed 和 no-repair。 |

---

## 12. 跨异常一致性审计表

| 审计项 | 结果 | 说明 |
|---|---|---|
| 是否有异常要求 Query 写核心状态 | pass | Query 始终只返回 surface,不 refresh、rebuild、replay、repair 或 source write。 |
| 是否有异常要求 Consumer 直接写外部业务 truth | pass | Consumer 只写 receipt、marker、snapshot、projection input、stale marker 或 history。 |
| 是否有异常要求 Job 修复 source truth | pass | Job 只维护 derived / outbox / handoff / export / progress。 |
| 是否把 outbox、handoff 或 export failure 当作 truth 未成立 | pass | 传播失败与 observation truth 成立分离。 |
| 是否把 raw body、source audit body 或 evidence body 写成可接受输入 | pass | 正文一律拒绝、隔离、裁剪或表达 body-blocked;只允许 ref / safe summary。 |
| 是否把 not-visible 当作 missing 或 success | pass | not-visible 单独表达,不泄露也不伪装。 |
| 是否把 placeholder evidence 伪造成真实 evidence alias / run id / signoff | pass | placeholder 和 insufficient 均阻断真实性表达。 |
| 是否让 retention / replay / cleanup 越过 active reference | pass | active hold / protected 是硬阻断。 |
| 是否让 stale / failed projection 被 Query 静默吞掉 | pass | 必须返回 freshness / degraded / unavailable surface。 |
| 是否把 downstream rejection 反向变成本仓 truth | pass | downstream rejection 只影响 delivery / publication / handoff marker。 |

---

## 13. Step 11 配置影响移交门禁

Step 11 只能从本步异常红线中提取“哪些口径会影响配置设计”,不得把本步未定义的恢复机制、retry 参数、DLQ 结构或监控指标提前写入概要设计。

| Step 11 预计配置影响主题 | 来源异常 / 边界 | Step 11 必须守住的边界 |
|---|---|---|
| redaction / body-free policy 是否可配置 | unsafe body、source audit body、evidence body、body-blocked | 可配置只能影响策略选择或 allowlist 口径,不能允许正文进入 truth。 |
| visibility / not-visible surface 配置 | not-visible vs missing、restricted query | 配置不能把 not-visible 映射成 missing 或 success。 |
| freshness / stale 阈值 | stale projection、stale evidence、stale reference、rollup stale | 阈值只能影响 freshness surface,不能触发 Query 写入。 |
| retention hold / active protection 策略 | retention conflict、active reference protected | 配置不能越过 active hold 或授权 source cleanup。 |
| replay / maintenance guard | replay blocked、no-write violation、job no-repair | 配置不能允许 job / replay 修复 source truth。 |
| consumer schema / source family admission | unsupported schema、old source version、forbidden body | 配置不能让 consumer 猜 schema 或保存正文。 |
| handoff / export consumer policy | handoff blocked、external export blocked、delivery failed | 配置不能把 handoff ready / delivered 变成 final verdict 或 signoff。 |
| outbox / dead-letter visibility | outbox failed、dead-lettered | Step 11 可标记可见性和开关边界,但不写 retry / DLQ 实现参数。 |

进入 Step 11 的条件: 仅当用户确认后,Step 11 才能读取本文件并开始配置影响轮廓;不得自动跨 Step,不得触碰正式 `02-概要设计.md`。

---

## 14. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §10 “异常与边界场景轮廓”引用本文件 §7 的异常与边界场景总览。
- §10 摘录本文件 §8 的 Command / Query / Consumer / Job 异常归类,保留 query no-write、consumer non-truth、job non-repair 和 downstream non-truth 红线。
- §10 摘录本文件 §9 的异常影响图,用于说明异常跨 intake、read、consumer、job / handoff 的边界。
- §10 摘录本文件 §10 的状态机影响清单,尤其保留 body-blocked、not-visible、placeholder、retention protected、no-write blocked、dead-lettered 和 degraded output 的禁止口径。
- `03-详细设计.md` 继续展开正式错误码、response surface、幂等结果、expected version、并发、事务、retry、dead-letter、恢复和测试矩阵。

---

## 15. 待确认事项

本步不新增阻塞 Step 11 的上游 blocker。以下事项留给后续详细设计或配置设计闭口,不阻塞概要设计继续推进:

| 编号 | 待确认事项 | 当前处理口径 |
|---|---|---|
| `Q-HLD-STEP10-001` | restricted / redacted / not-visible / unavailable 在各 Query response 中的 exact 字段组合 | 概要层只锁定语义差异,字段组合留给详细设计。 |
| `Q-HLD-STEP10-002` | duplicate consumer receipt、ignored old event 和 delayed unsupported event 的 stored result 结构 | 概要层只锁定不得重复写、不得倒退、不得猜 schema。 |
| `Q-HLD-STEP10-003` | outbox failed 与 dead-lettered 的具体 retry、payload 和人工处置 | 概要层只锁定不回滚 truth 且必须运维可见。 |
| `Q-HLD-STEP10-004` | handoff / export target error mapping 和 receipt schema | 概要层只锁定交付失败不反写 truth、不伪造 signoff。 |
| `Q-HLD-STEP10-005` | freshness 阈值和 retention hold 分类是否进入配置设计 | 移交 Step 11 评估,但不得削弱 no-write、body-free 和 active protection 红线。 |

---

## 16. 自检

| 检查项 | 结果 |
|---|---|
| 是否先读取 Step 10 SOP、书写规范、Step 08~09、旧 Step 10 和 L1 参考粒度 | pass |
| 是否输出 SOP 要求的异常与边界场景表 | pass |
| 是否说明异常应落在哪个主要组成部分、application service、对象或边界处理 | pass |
| 是否说明异常对处理流、状态机和跨仓边界的影响 | pass |
| 是否按处理流族归类 Command、Query、Consumer、Job / Outbox 异常 | pass |
| 是否在必要时补异常影响图且只表达概要边界 | pass |
| 是否未写完整错误码、重试参数、补偿脚本、DLQ topic、事务细节、监控指标或测试用例 | pass |
| 是否保持 redaction-first、body-free、no-write、query no-write、consumer non-truth 和 job non-repair | pass |
| 是否未伪造真实 run id、真实 evidence alias、验收签署、测试结果或 implementation evidence | pass |
| 是否未触碰正式 `02-概要设计.md` | pass |
| 是否发现阻塞 Step 11 的上游 blocker | no |

---

## 17. 门禁

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| pass | 已按概要 SOP Step 10、概要书写规范 4.10、Step 08 处理流、Step 09 状态机、新版 `00`、新版 `01` 和 L1 参考粒度重建 Step 10;旧 Step 10 已降级为 historical material | wait_user_confirmation_before_step_11 |
