# Step 10. 异常与边界场景轮廓

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 10
> 回填章节: `02-概要设计.md` §10 异常与边界场景轮廓
> 生成日期: 2026-06-11
> 状态: 已完成,等待审核后进入 Step 11

---

## 1. Step 状态 + Step 内计划

| 计划项 | 状态 | 产物位置 |
|---|---|---|
| 读取 Step 3 约束、Step 8 处理流、Step 9 状态流转和最新版 SOP / 书写规范 | 已完成 | §2 |
| 回答 Step 10 SOP 问题 | 已完成 | §3 |
| 诊断旧 Step 10 与当前材料的差距 | 已完成 | §4 |
| 比较改动前后口径 | 已完成 | §5 |
| 记录采用 / 不采用的设计取舍 | 已完成 | §6 |
| 输出异常分组原则、异常与边界场景表、异常影响图和边界口径 | 已完成 | §7 |
| 判断本 Step 是否需要拆分 | 已完成 | §8 |
| 形成正式 `02` §10 回填草稿 | 已完成 | §9 |
| 列出待确认事项和进入下一步条件 | 已完成 | §10~§11 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步用途 |
|---|---|---|
| `02_hld_step_03_constraints.md` | 已完成并已获用户认可 | 提供 VETO、query no-write、forbidden body、report-only、eventual propagation 等异常门禁 |
| `02_hld_step_08_processing_flows.md` | 已完成并已获用户认可 | 提供 command / query / consumer / job / handoff 处理流和异常触发线索 |
| `02_hld_step_09_state_machine.md` | 已完成并已获用户认可 | 提供状态异常输入清单、非法迁移和 failed / degraded / stale / pending surface |
| `projects/L1-identity/00-需求文档.md` | 当前需求输入 | 提供业务规则、VETO、验收边界和待确认事项 |
| `projects/L1-identity/01-架构设计.md` | 当前架构输入 | 提供 identity truth center、外部正文排除、依赖裁剪、eventual propagation 和 report-only maintenance 约束 |
| `standards/document/概要设计讨论流程_SOP.md` | 最新流程标准 | 规定 Step 10 只点名关键异常路径和边界场景 |
| `standards/document/概要设计书写规范.md` | 最新正式结构标准 | 规定异常与边界场景表的字段和图示粒度 |
| 旧 `02_hld_step_10_exceptions_boundaries.md` | legacy draft | 只作为诊断输入,不得直接继承为新版结论 |

---

## 3. SOP 问题回答

### 3.1 哪些关键异常路径必须在概要设计层先点名?

必须先点名的异常路径包括:

- 写路径进入 accepted truth 前失败:actor / metadata / idempotency 缺失或冲突、ref 复用、非法 lifecycle、高风险 basis 缺失、外部正文提交、append-only 破坏。
- 读路径未形成可返回正文:query not found、not visible、redacted、projection stale / degraded、trace / audit missing。
- 外部来源未形成可信 marker:role / capability source stale、work participation missing、memory ref unavailable、governance basis invalid、archive target unavailable、source event unmapped。
- 派生维护和对账失败:projection rebuild failed、reference refresh failed、reconciliation finding / partial / failed。
- 传播和 handoff 失败:outbox publish failed / skipped、handoff receipt missing、fake delivered、retryable failed / failed。
- 安全边界失败:memory body、artifact body、runtime body、archive package、receipt body、raw log、secret 或不可见字段出现在 query / event / report / handoff material 中。

### 3.2 哪些边界场景会改写主要组成部分、接口、对象或状态机的协作关系?

会改写协作关系的场景包括:

- Query not found / not visible 不会回到 Command 创建或修复;只返回 query surface。
- 外部来源 unavailable / unrecognized 不会被补造成 accepted truth;只更新 reference state、source snapshot、report 或 rejected surface。
- Rebuild / refresh / reconciliation 失败不会改写核心 truth;只影响 derived marker 或 report。
- Publish / handoff 失败不会回滚 accepted truth;只影响 `OutboxState` / `HandoffState`。
- Handoff delivery request 不等于 delivered;delivered 必须来自正式 receipt marker。
- Forbidden body 检测失败优先阻断 persistence / event / report / handoff,不能为了诊断保存正文。

### 3.3 哪些失败不能留到详细设计才发现?

不能留到详细设计才发现的失败是会改变主线理解的失败:

- ref 复用、tombstone 恢复、终态回普通主线。
- lifecycle 缺 basis 仍 accepted。
- career record 被原地修改或重复追加。
- query、projection、maintenance、reconciliation、publish 或 handoff 绕过 command 写 truth。
- stale / unavailable / failed / partial 被伪装成 resolved / fresh / no finding / published / delivered。
- forbidden body 进入 trace、event、report、query、handoff 或 diagnostic material。
- downstream publish / handoff 成功被误解成下游业务已处理或 archive truth 已更新。

### 3.4 异常与边界场景在概要设计层需要讲到什么程度才足够?

本 Step 只需要讲到以下程度:

- 点名异常 / 边界场景。
- 说明影响哪些主要组成部分、接口、对象、状态或跨仓边界。
- 明确当前概要口径:reject、not visible、redacted、degraded、stale、pending、failed、report-only、no-op、retryable marker 或 forbidden body block。
- 说明不能伪装成什么成功状态。

不需要写错误码、异常类型层级、重试参数、补偿步骤、恢复脚本、adapter 返回码、SQL 约束或完整协议 schema。

### 3.5 哪些内容仍属于详细设计的错误码、重试、补偿或恢复细节?

以下内容后移 `03/04/05/06/07`:

- DTO error enum、HTTP / RPC status、event dead-letter schema、consumer receipt schema。
- idempotency stored result schema、conflict digest、duplicate replay 事务时序。
- repository / port 函数签名、transaction rollback / commit ordering、SQL constraint。
- projection rebuild batch、cursor、retry policy、timeout、scheduler、backoff。
- outbox topic、envelope、payload version、publisher adapter、delivery attempt schema。
- handoff target、receipt payload、adapter profile、archive / observability target config。
- test case、acceptance evidence、implementation commit boundary。

---

## 4. 当前材料 / 旧文档问题诊断

| 旧材料 / 倾向 | 问题 | 本轮处理 |
|---|---|---|
| 旧 Step 10 直接写异常表并标“已完成” | 缺少 Step 内计划、SOP 问题回答、诊断、取舍和自检,不符合最新版中间产物规范 | 重写为完整 Step 文件 |
| 旧 Step 10 使用旧状态名如 `OutboxPublicationState` / `TraceHandoffState` | 与新版 Step 6 / Step 9 已收敛的 `OutboxState` / `HandoffState` 不一致 | 改为最新状态主语 |
| 旧 Step 10 将异常处理口径写得偏实现 | 容易进入 retry 参数、恢复机制或错误码细节 | 本轮只保留概要轮廓 |
| 旧 Step 10 未按 Step 9 §20.8 输入清单闭合 | 容易漏掉 handoff fake delivered、reconciliation partial、query redacted 等新版状态线 | 本轮直接承接 §20.8 |
| 旧 Step 10 缺少 forbidden body 横向复核 | 可能让正文泄漏只作为安全细节后移 | 本轮把 forbidden body 作为跨异常硬边界 |
| 旧 Step 10 未明确哪些异常不回滚 accepted truth | publish / handoff / rebuild / refresh failure 可能被误解为 accepted truth 失败 | 本轮明确状态与 truth 分离 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| Step 结构 | 只有目标、输入、异常表、影响图和进入条件 | 完整包含计划、问题回答、诊断、对比、取舍、结构化产物、复杂度、回填和进入条件 |
| 输入来源 | 泛泛引用 Step 8 / 9 / 3 | 明确承接 Step 9 §20.8 异常输入清单和 Step 3 约束门禁 |
| 异常粒度 | 混有旧状态名和实现口径 | 只写会影响对象、接口、处理流、状态机或跨仓边界的异常轮廓 |
| 状态主语 | 部分沿用旧名 | 对齐 Step 9: `OutboxState`、`HandoffState`、`ProjectionState`、`ReferenceResolutionState` 等 |
| forbidden body | 作为若干局部项出现 | 作为 query / event / report / handoff / diagnostic 的横向硬边界 |
| 后续承接 | 只写“进入下一步条件” | 明确 Step 11 配置影响输入和详细设计后移项 |

---

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 把所有低层错误、校验失败和恢复方式列成大全 | 不采用 | 会变成错误码 / 运维手册,不符合概要层粒度 |
| 只保留 Step 9 §20.8 的 12 条输入清单 | 不采用 | 粒度过粗,无法支撑正式 §10 异常表 |
| 按写路径、读路径、外部来源、维护对账、传播 handoff、安全边界分组 | 采用 | 能覆盖主线协作变化,同时避免下沉到实现 |
| 为每个异常画独立影响图 | 不采用 | 会重复 Step 8 处理流,且容易写成异常微流程 |
| 只画一个总影响图 | 采用 | 足以说明异常如何让主线断开、降级或停在 marker / report |
| 在本 Step 定义 retry policy、topic、receipt 和 error enum | 不采用 | 属于 `03/04/07` 详细设计或实施计划 |

---

## 7. 结构化中间产物

### 7.1 异常分组原则

| 分组 | 判断标准 | 输出口径 |
|---|---|---|
| 写路径异常 | command / consumer 在 accepted truth 前失败 | reject、pending basis、duplicate no-op、body-free block,不写 accepted trace / outbox |
| 读路径异常 | query 不能返回完整可见正文 | not_found、not_visible、redacted、stale、degraded,不写 truth |
| 外部来源异常 | method / work / governance / memory / archive / observability 来源不可用或不可信 | source marker、reference state、rejected source、report-only,不接管外部 truth |
| 派生维护异常 | projection rebuild、reference refresh、reconciliation 失败或部分成功 | derived marker、failed / partial report,不修复 truth |
| 传播交接异常 | outbox publish、handoff delivery、receipt callback 未闭合 | `OutboxState` / `HandoffState` failed / retryable / skipped / cancelled,不回滚 accepted truth |
| 安全边界异常 | forbidden body、secret、不可见字段进入 material | block / redaction failure / rejected surface,不得持久化或发布 |

### 7.2 异常与边界场景表

| 异常 / 边界场景 | 影响哪些部分 / 流程 | 当前轮廓口径 | 说明 |
|---|---|---|---|
| 试图复用已建立、退役或墓碑持有的 `GlobalMemberRef` | 身份锚定与成员真相;`EstablishGlobalMember`;`IdentityAnchorState` | reject before accepted truth | 防止 ref 复用和 tombstone 恢复成新成员 |
| `GetGlobalMemberAnchor` 查不到成员 | 身份锚定 query;query surface | return not_found surface;no create | Query missing 不触发建档 |
| actor、metadata、idempotency key 缺失或不可信 | 所有 Command / Consumer intake | reject before accepted truth | 不用系统默认 actor 伪造责任链 |
| idempotency key duplicate same digest | command application service;stored result | replay stored result or duplicate no-op | 不重复生成 truth、trace 或 outbox |
| idempotency key duplicate different digest | command application service | conflict / rejected surface | 不允许同 key 承载不同业务意图 |
| 高风险 lifecycle 缺少 governance basis | 全局生命周期;`UpdateGlobalLifecycleState`;`HighRiskLifecycleGuard` | pending basis or rejected;no lifecycle truth write | 不得先写 `Retired` / `Tombstoned` 后补依据 |
| 非法 lifecycle transition | 全局生命周期;`GlobalLifecycleState` | reject transition;no accepted trace / outbox | 终态不得恢复为普通主线 |
| runtime / ProjectMember / governance event 试图直接推进 lifecycle | 全局生命周期;跨仓边界 | reject or ignore as non-owner signal | 外部状态只能作为 basis / source marker,不能绕过 identity command |
| role / capability source stale 或 unavailable | 角色能力摘要;`RoleCapabilitySourceSnapshot`;`ReferenceResolutionState` | mark stale / unavailable;do not synthesize active summary | 不保存 RoleDefinition / CapabilityDefinition body |
| role / capability evidence 或 safe summary 缺失 | 角色能力摘要;`MaintainRoleCapabilitySummary` | reject or keep pending / degraded marker | 无来源摘要不能伪装成 `Active` |
| work participation source 不存在或不可解析 | 身份生涯记录;`AppendCareerRecord`;work source consumer | reject / unresolved / report-only;no append | 不伪造项目参与 |
| 重复 work participation event 或 duplicate career append | 身份生涯记录;`CareerRecord.record_state` | duplicate no-op or stored receipt;no repeated append | append-only 与幂等必须同时成立 |
| 试图修改、删除或重排已确认 career record | 身份生涯记录;`CareerAppendPolicy` | reject in-place mutation;correction append only | 纠错走追加记录,不改旧 truth |
| memory ref 不可解析或外部 memory source unavailable | 记忆引用关系;`MemoryReferenceState`;`ReferenceResolutionState` | mark unavailable / stale / unlinked candidate;no body save | 不用默认值补造 memory relation |
| archive handoff target 不可用或 archive result failed | 记忆引用关系;archive source consumer;`MemoryReferenceState` | `ArchiveFailed` / pending marker;report-only if needed | archive failure 不删除 memory ref truth |
| 提交 memory body、embedding、archive package 或 receipt body | 记忆引用关系;安全边界 | block / reject before persistence and event material | identity 只保存 refs / marker |
| source event 无法映射到 `GlobalMemberRef` | role / career / memory source consumer | unresolved / noop / rejected source marker;no member create | 外部事件不能隐式建档 |
| `ReadMemberSummary` projection missing / stale / degraded | 身份事实消费与追溯;`ProjectionState`;summary query | return stale / degraded / not_found surface;no rebuild in query | query no-write |
| trace / audit missing、not visible 或需要 redaction | 身份事实消费与追溯;`IdentityTraceRecord`;visibility | empty / not_visible / redacted / degraded surface | 不补写 trace,不可见不等于不存在 |
| projection rebuild 部分失败或失败 | 派生维护与对账;`RebuildIdentityProjection`;`ProjectionState` | `Degraded` / `RebuildFailed`;optional report issue | 不修复 core truth |
| reference refresh failed、unavailable 或 unrecognized | 派生维护与对账;`RefreshExternalReferenceState`;`ReferenceResolutionState` | `Unavailable` / `Unrecognized` / `RefreshFailed` marker | 不接管外部 owner truth |
| reconciliation 发现 drift / partial / failed | 派生维护与对账;`RunIdentityReconciliation`;`ReconciliationReport` | finding / partial / failed report-only | finding 不是 remediation plan |
| 维护任务试图修复相邻仓 truth 或绕过 command 写 identity truth | 派生维护与对账;maintenance jobs | reject / forbidden maintenance boundary | `VETO-ID-005` 0 容忍 |
| outbox publish failed | 身份事实传播与外部交接;`PublishIdentityOutbox`;`OutboxState` | `RetryableFailed` or `Failed`;accepted truth remains committed | publish failure 不回滚 truth |
| outbox publish skipped by policy | 身份事实传播与外部交接;`OutboundEventPolicy`;`OutboxState` | `SkippedByPolicy` with reason marker | 不能伪装成 `Published` |
| `Published` 被解释为下游业务已处理 | 身份事实传播与外部交接;downstream boundary | forbidden interpretation | `Published` 只代表 outbound boundary 成功 |
| handoff delivery request 已发出但没有 receipt | 身份事实传播与外部交接;`DeliverTraceHandoff`;`HandoffState` | remain pending or retryable failed;not delivered | delivered 必须来自正式 receipt marker |
| handoff callback 缺 intent / target / attempt / result marker | handoff inbound consumer;`HandleTraceHandoffResult` | rejected / quarantine / pending review surface | 不拼接 receipt 或 target |
| fake delivered 或 receipt body 入仓 | handoff boundary;`HandoffPolicy`;`HandoffState` | reject / forbidden body block;no delivered | receipt 只能是 marker / ref |
| retry job 试图绕过 policy 或处理不可重试 failed | propagation jobs;`RetryIdentityPropagationFailures` | reject retry selection or keep failed marker | retry 不能改变 policy / truth boundary |
| event、query、trace、report、handoff 或 diagnostic material 出现 forbidden body | 横切安全边界;all read / write / event material | block persistence / publish or return redacted failure | forbidden body 不能为诊断而保存 |
| 配置或 adapter profile 试图放宽 query no-write、body-free、report-only 或 dependency boundary | 配置影响轮廓输入;Step 11 | mark as forbidden configuration boundary | 具体配置项后移 Step 11,但越界口径先点名 |

### 7.3 异常影响图

```text
+==================================================================+
|              L1-identity exception impact overview                |
+==================================================================+
|                                                                  |
|  invalid command / missing actor / reused ref / missing basis     |
|      |                                                           |
|      v                                                           |
|  reject or pending-before-accepted-truth                          |
|      |                                                           |
|      +--> no core truth write                                    |
|      +--> no accepted trace / outbox material                    |
|                                                                  |
|  query missing / not visible / projection stale                   |
|      |                                                           |
|      v                                                           |
|  read surface: not_found / not_visible / redacted / degraded      |
|      |                                                           |
|      +--> no create / repair / refresh / rebuild                 |
|                                                                  |
|  external source unavailable / unrecognized / unmapped            |
|      |                                                           |
|      v                                                           |
|  reference state / source snapshot / unresolved marker            |
|      |                                                           |
|      +--> no external truth ownership                            |
|                                                                  |
|  rebuild / refresh / reconciliation failure                       |
|      |                                                           |
|      v                                                           |
|  derived marker or report-only finding                            |
|      |                                                           |
|      +--> no core truth repair                                   |
|                                                                  |
|  publish / handoff / retry failure                                |
|      |                                                           |
|      v                                                           |
|  OutboxState / HandoffState failed marker                         |
|      |                                                           |
|      +--> accepted truth remains committed                       |
|                                                                  |
|  forbidden body detected                                          |
|      |                                                           |
|      v                                                           |
|  block / redact before persistence, event, report or handoff      |
|                                                                  |
+==================================================================+
```

关键说明:

- 异常图只表达主线断开、降级或停在 marker / report 的位置,不表达错误码、重试参数或补偿脚本。
- 写路径失败发生在 accepted truth 前,不得产生 accepted trace / outbox。
- 读路径失败只返回 surface,不得回写 truth。
- 派生、传播和 handoff 失败不回滚已 committed truth。
- forbidden body 检测失败优先保护安全边界,不因诊断需要保存正文。

### 7.4 分组处理口径说明

| 分组 | 当前概要口径 | 不做什么 |
|---|---|---|
| 写路径边界 | reject / pending before accepted truth;不写 accepted trace / outbox | 不补错误码全集,不写事务回滚细节 |
| 读路径边界 | return body-free surface: not_found / not_visible / redacted / stale / degraded | 不创建 truth,不触发 rebuild / refresh |
| 外部来源边界 | 保存 refs / marker / source state / unresolved surface | 不保存外部正文,不接管外部 truth |
| 派生维护边界 | 更新 projection / reference marker 或 report-only finding | 不修复 identity core truth 或相邻仓 truth |
| 传播与 handoff 边界 | 更新 outbox / handoff marker;accepted truth remains committed | 不把 publish / delivered 作为 accepted 前置 |
| 安全边界 | block or redact before persistence / publish / report / handoff | 不为诊断保存 forbidden body |

### 7.5 不在本 Step 展开的内容

| 不展开项 | 后续位置 | 原因 |
|---|---|---|
| 错误码、错误 enum、HTTP / RPC status | `03` protocol contracts | 当前只写异常轮廓 |
| idempotency digest / stored result schema | `03` concurrency / persistence | 当前只说明 duplicate 口径 |
| repository / port 签名 | `03` trait / adapter contracts | 当前不写函数级细节 |
| SQL constraint、transaction ordering、rollback / commit 时序 | `03` persistence | 当前只说明 accepted 前后边界 |
| retry policy、timeout、batch、cursor、scheduler | `04/07` | 当前只说明 retry 不绕过 policy |
| topic、envelope、payload version、publisher adapter | `03/04` | 当前只说明 outbox state 和 forbidden body |
| handoff target、receipt payload、adapter profile | `03/04` | 当前只说明 receipt marker required |
| 详细测试 case、suite、evidence | `05/06` | 当前只提供测试切口线索 |

### 7.6 本 Step 自检

| 自检项 | 结论 | 说明 |
|---|---|---|
| 是否覆盖 Step 9 §20.8 输入清单 | 通过 | query、basis、source、duplicate、memory、trace、projection、reference、reconciliation、outbox、handoff、forbidden body 均覆盖 |
| 是否说明异常影响对象 / 接口 / flow / 状态 | 通过 | 异常表逐项列出影响部分和当前轮廓 |
| 是否避免错误码 / retry / 补偿细节 | 通过 | 只写 reject、surface、marker、report-only 和 forbidden boundary |
| 是否保持 query no-write | 通过 | 所有读路径异常均不触发 create / repair / rebuild / refresh |
| 是否保持 accepted truth 与 propagation 分离 | 通过 | publish / handoff / retry failure 不回滚 accepted truth |
| 是否保持 forbidden body 0 容忍 | 通过 | event、query、trace、report、handoff、diagnostic 均覆盖 |

---

## 8. 复杂度判断 / 是否拆分

本 Step 不需要按主要组成部分拆成多个停审批次,原因:

- Step 10 只做异常轮廓,不是继续展开对象、接口、处理流或状态机。
- 异常表虽覆盖全仓,但每条只写概要口径,未进入错误码、恢复机制或 adapter 细节。
- Step 5~9 已按主要组成部分完成小循环,本 Step 应作为跨部分收口,不再拆回组成部分。

但本 Step 后续进入正式文档装配时,可按“写路径 / 读路径 / 外部来源 / 维护对账 / 传播交接 / 安全边界”分段呈现,方便阅读。

---

## 9. 正式 `02` §10 回填草稿

正式 `02-概要设计.md` §10 后续可汇总为:

1. L1-identity 的异常与边界场景按写路径、读路径、外部来源、派生维护、传播 handoff 和安全边界六类理解。
2. 写路径异常发生在 accepted truth 前,包括 actor / metadata / idempotency、ref 复用、高风险 basis、非法 lifecycle、append-only 破坏和 forbidden body。默认口径是 reject、pending basis、duplicate no-op 或 body-free block,不生成 accepted trace / outbox。
3. 读路径异常包括 not_found、not_visible、redacted、projection stale / degraded、trace / audit missing。Query 只返回 surface,不得创建、修复、刷新、重建、发布或交付。
4. 外部来源异常包括 role / capability source unavailable、work participation missing、memory ref unavailable、archive target failed、source event unmapped。Identity 只保存 refs、safe summary、source state、reference state 或 unresolved marker,不接管相邻仓 truth。
5. 派生维护与对账异常包括 projection rebuild failed、reference refresh failed、reconciliation finding / partial / failed。它们只能更新 derived marker 或 report-only finding,不得修复 identity core truth 或相邻仓 truth。
6. 传播与 handoff 异常包括 outbox publish failed / skipped、handoff receipt missing、fake delivered、retry bypass policy。`OutboxState` 和 `HandoffState` 必须显式保留 failed / retryable / skipped / cancelled marker;publish / handoff 失败不回滚 accepted truth。
7. Forbidden body 是横向硬边界。memory body、artifact body、conversation body、runtime body、archive package、receipt body、raw log、secret 和不可见字段不得进入 query、trace、event、report、handoff 或 diagnostic material。
8. 本章只固定异常轮廓和边界口径;错误码、DTO、port、transaction、retry、topic、receipt、adapter、SQL 和测试 evidence 后移 `03/04/05/06/07`。

正式正文要等 Step 14 统一装配,当前不直接回填到 `02-概要设计.md`。

---

## 10. 本 Step 待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可 Step 10 只写异常轮廓,不写错误码和恢复机制 | 若不认可,会提前进入 `03/04/07` 细节 | 当前保持概要层粒度 |
| 是否认可六类异常分组 | 若不认可,正式 §10 可调整呈现结构 | 当前按写 / 读 / 外部 / 维护 / 传播 / 安全分组 |
| 是否认可 forbidden body 作为横向异常硬边界 | 若不认可,后续 query / event / report / handoff 边界会松动 | 当前保持 0 容忍 |
| 是否认可 publish / handoff 失败不回滚 accepted truth | 若不认可,会改变 Step 8/9 的 propagation state 设计 | 当前保持 eventual propagation |
| 是否认可配置越界只点名、具体配置后移 Step 11 | 若不认可,Step 10 会混入配置项清单 | 当前留给 Step 11 |

---

## 11. 进入 Step 11 的条件

进入 Step 11 “配置影响轮廓”前,需要用户确认:

- Step 10 的异常与边界场景表覆盖了会影响对象、接口、处理流、状态机或跨仓边界的关键异常。
- 异常影响图只表达主线断开、降级或停在 marker / report 的位置,没有下沉到错误码、重试参数或补偿实现。
- 写路径、读路径、外部来源、派生维护、传播 handoff 和安全边界六类口径可作为正式 §10 回填输入。
- Step 11 可以在不改变 truth ownership、query no-write、forbidden body、report-only 和 eventual propagation 的前提下,继续识别配置影响轮廓。
