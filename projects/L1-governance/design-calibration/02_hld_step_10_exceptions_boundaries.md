# Step 10. 异常与边界场景轮廓

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 10
> 回填章节: `02-概要设计.md` §10 异常与边界场景轮廓
> 生成日期: 2026-06-08
> 状态: 已完成

---

## 1. 本步目标

在 Step 8 处理流和 Step 9 状态机已经收稳的前提下,点名会影响主线理解、组成部分协作或状态传播的关键异常与边界场景。后续 `03-详细设计.md` 必须继续展开正式错误码、重试、补偿、幂等、并发冲突、dead letter、测试和恢复流程。

本步不写完整错误码表、异常类、补偿脚本、retry 参数、DLQ topic、事务 rollback 细节、监控指标或测试用例。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_08_processing_flows.md` | 已完成 | 提供 Command、Query、Consumer、Job 的主路径和写入边界 |
| `02_hld_step_09_state_machine.md` | 已完成 | 提供状态集合、允许迁移、禁止迁移和状态传播关系 |
| `02_hld_step_03_constraints.md` | 已完成 | 提供失败状态显式、正文排除、派生不反写和配置不可越界约束 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供异常会落到的接口类别和读写性质 |
| `01-架构设计.md` §8 / §9 / §10 / §13 | 已完成 | 提供依赖裁剪、一致性分层、通信方式和降级边界 |

---

## 3. SOP 问题回答

### 3.1 哪些关键异常路径必须在概要设计层先点名?

必须先点名的异常路径包括:

- actor / command metadata / idempotency 缺失或重复。
- governed subject、source、evidence、method、actor capability、process / work context 等外部引用 unresolved、stale、invalid 或 unavailable。
- context 未 ready、input pending evidence、gate expired / cancelled、decision 已 superseded / revoked。
- approval responsibility 不满足、责任链 blocked、delegation 不合法。
- policy conflict 未解决、shared rules 被低 scope 规则或配置削弱。
- control applicability 不成立、control review failed、AIIA / SoA evidence 或 coverage 缺口。
- nonconformity verification failed / inconclusive、corrective action failed / cancelled。
- query not visible、projection missing / stale / failed / unavailable。
- inbound event duplicate、unsupported version、source body 越界、乱序或来源不可用。
- outbox publish failed / dead-lettered、projection rebuild failed、snapshot refresh failed、handoff / export failed。

### 3.2 哪些边界场景会改写主要组成部分、接口、对象或状态机的协作关系?

会改写协作关系的边界场景包括:

- 外部事实不可解析时,Command 不得继续核心 truth 主线,只能把 context / input 或 reference state 推到 pending / unresolved / degraded。
- Consumer 收到外部事件时,不得直接改写 decision、policy、control、conclusion 或 nonconformity truth,只能写 snapshot / reference / stale marker。
- Query 遇到 stale / failed projection 时,不得触发 refresh / rebuild,只能返回 freshness / degraded / unavailable surface。
- Job 发现 drift、发布失败或 handoff 失败时,不得修复核心业务 truth,只能写 report、marker 或 publication state。
- 下游或 external GRC 拒收 Governance outbound event 时,不得反向撤销已成立 Governance truth。

### 3.3 哪些失败不能留到详细设计才发现?

不能留到详细设计才发现的失败,都是会打穿 Governance truth 边界或状态传播边界的失败:

- process waiting、conversation card、runtime cache、dashboard row 或 external GRC record 试图替代正式 Governance Decision。
- artifact evidence body、AIIA / SoA body、method definition body、runtime log 或 archive package body 进入 Governance truth。
- shared rules 被配置、project local policy 或 lower-scope override 静默绕过。
- nonconformity 因 corrective action completed 自动关闭,跳过 verification。
- projection / reconciliation / report 结果反写核心 truth。
- outbox publish failure 被当成 command failure 回滚已成立 truth。

### 3.4 异常与边界场景在概要设计层需要讲到什么程度才足够?

概要层需要讲清异常落在哪个接口类别、哪个组成部分处理、影响哪个状态或传播关系、以及不能越过哪些边界。具体错误码、retry 次数、延迟策略、冲突版本、dead-letter payload、恢复脚本和测试断言留给详细设计。

### 3.5 哪些内容仍属于详细设计,不应在本步展开?

以下内容不在本步展开:

- 每个 command / query / event / job 的正式错误码和 response schema。
- 幂等结果存储结构、duplicate replay 规则和 expected version 冲突处理。
- repository / port 失败类型、事务回滚和 partial commit 机制。
- event retry、backoff、dead letter、quarantine 和 replay 参数。
- projection rebuild 的分页、cursor、affected view 计算和恢复脚本。
- handoff / export adapter 的 receipt schema、external target 错误映射和人工恢复流程。

---

## 4. 异常与边界场景总览

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| Command 缺少 actor、metadata 或 idempotency key | Inbound adapter / application service | 不进入 domain truth 写路径;详细设计定义 rejected / invalid request surface |
| idempotency key 重复 | Application idempotency support | 返回 stored result 或 duplicate surface;不得重复生成 truth、trace 或 outbox |
| subject / source ref 无法解析 | Governance context and input management / External context mirror support | `GovernanceContextState::PendingReference` 或 `ReferenceResolutionKind::Unresolved`;不得进入正式 decision 主线 |
| evidence summary 不可用或未验证 | Context / input、Control / compliance、Nonconformity | input 进入 `PendingEvidence` 或 command 被拒绝;不得保存 evidence body |
| context 不是 `Ready` | 各 command service | gate / decision / control / conclusion / nonconformity command 不得继续 |
| input 已 `Rejected` / `Superseded` | Context / input command service | 不得被用来创建新 decision;只能作为历史查询 |
| gate 已 `Expired` / `Cancelled` | Gate and decision management | 不得 attach decision;需要打开新 gate 或显式处理历史 |
| decision 已 `Superseded` / `Revoked` | Gate and decision management | 不得作为当前批准依据;下游只能看到历史追溯 |
| approval responsibility 不满足 | Approval and responsibility management | responsibility chain 保持 `Open`、`Escalated` 或 `Blocked`;不得推动 decision approved |
| actor capability snapshot stale | Approval and responsibility / External context mirror support | 不得直接依赖旧能力形成批准;需要 refresh 或 degraded / pending surface |
| delegation 不满足 shared rules | ApprovalResponsibilityPolicy / SharedRulesPolicy | 委托被拒绝或责任链升级;不得削弱审批要求 |
| policy conflict detected | Policy and shared rules management | 进入 `PolicyConflictState::Detected` 或 `PendingDecision`;不得静默选择高优先级 |
| shared rules 被 lower-scope override 触碰 | SharedRulesPolicy / PolicyScopePolicy | 阻断 policy 变更或形成 conflict;配置和项目局部规则不得覆盖 |
| method policy / control snapshot stale | External context mirror support / Policy / Control service | 不得基于旧定义形成新有效事实;进入 stale / pending refresh |
| control applicability 无依据 | ControlApplicabilityPolicy | 不得标记 applicable / excluded;需要 evidence summary 或 rejected surface |
| control review failed | Control and compliance conclusion management | `ControlReviewState::Failed` 可触发 nonconformity input,但不自动创建或关闭 nonconformity |
| AIIA / SoA 正文或 evidence body 越界 | Control / compliance service / adapter boundary | 只允许 artifact ref、evidence ref、safe summary;正文必须被拒绝或丢弃 |
| AIIA / SoA coverage 缺口 | ComplianceConclusionPolicy | conclusion 不能 approve;保持 `Drafted` / `InReview` 或 rejected |
| corrective action failed / cancelled | Nonconformity corrective loop | nonconformity 不得关闭;需要重新规划、升级或保持 correcting |
| verification failed / inconclusive | NonconformityClosurePolicy | 不得进入 `Closed`;回到 correction / evidence 补充路径 |
| Query actor 不可见 | AuthorizedGovernanceQueryService / ReadVisibilityPolicy | 返回 not visible surface;不得泄露 body、summary 或存在性细节 beyond policy |
| Projection stale / missing / failed | DerivedGovernanceViewPolicy / query assembler | Query 返回 freshness / degraded / unavailable;不得写 projection 或触发 rebuild |
| Trace / audit missing expected link | Governance consumption and traceability | Query 或 reconciliation 暴露 degraded / issue;不得补造 audit |
| Inbound event duplicate | Consumer idempotency / receipt store | 返回 duplicate receipt;不得重复写 snapshot、reference 或 stale marker |
| Inbound event unsupported version | Consumer envelope validation | rejected / delayed / quarantine surface;不得猜 schema |
| Inbound event body 包含禁止正文 | Consumer boundary | 只提取 ref / summary / version;正文不得保存进 Governance |
| Inbound event 乱序或来源版本过旧 | External context mirror support | 标记 stale / ignored / delayed;不得倒退核心 truth |
| Outbox publish failed | Governance truth core / publish job | `OutboxPublicationState::Failed`;不回滚已成立 truth |
| Outbox unrecoverable failure | PublishGovernanceOutbox job | `DeadLettered` 并进入 job report / operations surface |
| Projection rebuild failed | Derived maintenance and reconciliation | `DerivedGovernanceViewFreshnessState::Failed`;不得修复 truth |
| Snapshot refresh failed | External context mirror support | reference state `Unavailable` / `Unresolved`;affected view stale 或 degraded |
| Reconciliation found drift | Derived maintenance and reconciliation | 写 reconciliation report 或 issue marker;不得直接改业务 truth |
| Trace / archive / external GRC handoff failed | Governance consumption and traceability / handoff job | 保存 failed marker / job report;不得改变 Governance fact state |
| Downstream rejects outbound event | Publish / handoff boundary | 保留 truth,标记 publication / handoff failure;不得让下游定义 Governance state |

---

## 5. 按处理流族归类的异常口径

### 5.1 Command 写路径异常

| 异常 | 影响状态 | 概要口径 |
|---|---|---|
| actor / metadata / idempotency 缺失 | 无 truth 状态变化 | 在 inbound / application 层拒绝,不得进入 domain transition |
| policy guard 不通过 | 对应对象保持原状态 | command 返回失败 surface;不得写 trace / outbox 表示成功事实 |
| 外部引用未解析 | `PendingReference`、`PendingEvidence`、`Unresolved` | 主 command 暂停或拒绝,由 refresh / evidence 补齐后重新走 command |
| expected current state 不匹配 | 对象保持原状态或进入显式 terminal / historical surface | 详细设计定义并发和非法迁移错误;概要只要求不得私自跨状态 |
| 写入一半失败 | 不产生 accepted truth | 详细设计定义事务;概要层要求 truth、trace、audit、outbox、result 同一成立边界 |

### 5.2 Query 只读异常

| 异常 | 影响状态 | 概要口径 |
|---|---|---|
| not visible | 无状态变化 | 返回 not visible / redacted surface,不泄露正文 |
| projection stale | 无状态变化 | 返回 stale / freshness marker,不触发 rebuild |
| projection missing / failed | 无状态变化 | 返回 degraded / unavailable 或 fallback surface,不写修复 |
| external reference unresolved | 无状态变化 | 响应中显式标记 unresolved / degraded |
| trace link missing | 无状态变化 | 响应中显式标记 trace degraded,不补造记录 |

### 5.3 Consumer 异常

| 异常 | 影响状态 | 概要口径 |
|---|---|---|
| duplicate source event | consumer receipt only | 不重复写 snapshot、reference 或 stale marker |
| unsupported schema version | delayed / rejected / quarantine surface | 不猜测 payload,不写核心 truth |
| source unavailable | `ReferenceResolutionKind::Unavailable` | 标记 reference / snapshot 不可用,影响 query degraded |
| stale source version | `ReferenceResolutionKind::Stale` | 不倒退 snapshot,只标记 stale 或 ignored |
| forbidden body received | 无核心 truth 状态变化 | 只保留 ref / summary,正文丢弃或拒绝 |

### 5.4 Operations Job 异常

| 异常 | 影响状态 | 概要口径 |
|---|---|---|
| publish one item failed | `OutboxPublicationState::Failed` | 单项失败进入 report,不影响其他 pending item 或 truth |
| publish unrecoverable | `OutboxPublicationState::DeadLettered` | 进入 operations 可见面和人工处置 surface |
| rebuild failed | `DerivedGovernanceViewFreshnessState::Failed` | 视图 failed,query degraded;truth 不变 |
| refresh failed | `ReferenceResolutionKind::Unavailable` / `Unresolved` | reference degraded,affected views stale |
| reconciliation drift | reconciliation report issue | 只报告 drift,不自动修正 |
| handoff / export failed | failed marker / job report | 不改变 Governance truth,不把 external GRC 状态当 truth |

---

## 6. 异常影响图

```text
+====================================================================+
|                    Governance Exception Boundary                   |
+====================================================================+
| Command exception                                                  |
|   | invalid actor / metadata / state / policy / reference           |
|   v                                                                |
| Reject or pending surface                                          |
|   | no accepted truth unless domain transition succeeds             |
|   v                                                                |
| Truth + trace + outbox + result boundary remains atomic             |
|                                                                    |
| Consumer exception                                                 |
|   | duplicate / unsupported version / stale source / forbidden body |
|   v                                                                |
| Receipt + ReferenceResolutionState + stale marker only             |
|   | never writes core decision / policy / control / conclusion      |
|   v                                                                |
| Query sees unresolved / stale / degraded surface                    |
|                                                                    |
| Job exception                                                      |
|   | publish / rebuild / refresh / reconcile / handoff failure       |
|   v                                                                |
| Publication / derived / reference / report / handoff marker         |
|   | never repairs or rolls back core truth                          |
|   v                                                                |
| Operations visibility + retry / manual handling in detailed design  |
+====================================================================+
```

关键说明:

- 该图只表达异常落点和跨部分边界,不表达错误码、重试参数、补偿脚本或 DLQ 结构。
- Command 只有完成 domain transition 和同一成立边界后,才允许产生 accepted truth、trace、outbox 和 stored result。
- Consumer 异常最多影响 receipt、reference、snapshot 和 stale marker,不能生成核心 Governance truth。
- Job 异常只影响 publication、derived、reference、report 或 handoff marker,不能修正或回滚核心 truth。

---

## 7. 状态机影响清单

| 异常类别 | 可能进入的状态 | 禁止进入的状态 |
|---|---|---|
| reference unresolved / unavailable | `PendingReference`、`PendingEvidence`、`Unresolved`、`Unavailable` | `Ready`、`Approved`、`Effective` |
| gate expired / cancelled | `Expired`、`Cancelled` | `Decided` without new decision |
| responsibility blocked | `Blocked`、`Escalated` | `GovernanceDecisionState::Approved` |
| policy conflict unresolved | `Detected`、`PendingDecision` | `PolicyEffectiveState::Effective` by silent override |
| shared rules violation | conflict / rejected command surface | lower-scope active override |
| control / conclusion evidence gap | `PendingAssessment`、`InReview`、rejected command surface | `Approved` without basis |
| corrective verification failed | `ReadyForVerification`、`Correcting`、`Reopened` | `Closed` |
| projection maintenance failure | `Stale`、`Failed`、`Unavailable` | core truth state mutation |
| outbox failure | `Failed`、`DeadLettered` | rollback of accepted truth |
| handoff / export failure | failed marker / job report | external GRC truth replacing Governance truth |

---

## 8. 当前文档问题诊断

| 旧 `02-概要设计.md` 内容 | 问题 | 本轮处理 |
|---|---|---|
| Exception 多作为治理概念或用户解释出现 | 没有落到 command / query / consumer / job 的异常边界 | 本步按接口类别和处理流族列出异常落点 |
| 外部来源不可用、引用过期、证据缺失没有明确状态影响 | 详细设计可能自行把缺失视为成功或同步失败 | 本步规定 pending / unresolved / stale / degraded surface |
| Projection、report、external GRC 失败和核心 truth 失败混写 | 可能让维护失败回滚或修复核心 truth | 本步明确 job 失败只写 marker / report |
| Outbox 发布失败和 command 成立关系不清 | 可能把下游拒收当作 command rollback | 本步明确 outbox failure 不影响 accepted truth |
| 正文越界只在数据章节出现 | Consumer / command 仍可能保存 body | 本步把 forbidden body 作为异常边界场景点名 |

---

## 9. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 异常组织方式 | 概念解释和隐含失败 | 按 Command、Query、Consumer、Job 和状态机影响组织 |
| 外部不可用 | 未形成统一口径 | 统一进入 pending / unresolved / stale / unavailable / degraded |
| 派生失败 | 容易混入业务失败 | 只影响 derived / report / query surface |
| 发布失败 | 可能影响 truth 成立 | 只影响 outbox publication state |
| 正文越界 | 数据边界提示 | 明确为 command / consumer 异常场景 |

---

## 10. 设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否列出完整错误码 | 不列出 | 错误码属于详细设计协议契约 |
| 是否为每个 Command 写异常表 | 不逐个写 | 概要层按流族归纳,详细设计再逐接口展开 |
| 是否补异常影响图 | 补 1 张 | Command / Consumer / Job 异常会改变跨部分协作边界,需要图示 |
| 是否把 retry / compensation 写入概要 | 不写 | 参数、策略和脚本属于详细设计和运维设计 |
| 是否把设计风险全部写入本步 | 不写 | 本步只写影响主线理解的异常;开放风险留到 Step 13 |

---

## 11. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §10 引用本文件 §4 的异常与边界场景总览。
- §10 摘录本文件 §5 的按处理流族归类异常口径。
- §10 摘录本文件 §6 的异常影响图和关键说明。
- §10 摘录本文件 §7 的状态机影响清单。
- 详细设计必须基于本文件继续展开正式错误码、response surface、幂等结果、并发版本、retry、dead letter、quarantine、rebuild / refresh / handoff 恢复和测试矩阵。

---

## 12. 待确认事项

本步不新增阻塞 Step 11 的待确认事项。详细设计阶段需要继续闭合:

- Command 失败是否保存 rejected result surface,以及 duplicate replay 的正式结果结构。
- Query not visible、redacted、degraded、stale、unavailable 的正式字段和组合规则。
- Consumer unsupported version、quarantine、delayed、ignored、dead-letter 的正式状态和证据 surface。
- Outbox retry、dead-letter、manual recovery、partial publish report 的正式契约。
- Reconciliation drift 是否只报告还是允许生成 manual remediation intent。
- Handoff / external GRC export failed refs、receipt、target error mapping 和人工处置 surface。

这些属于 `03-详细设计.md` 契约闭口,不阻塞概要设计进入配置影响 Step。

---

## 13. 进入下一步条件

- 已明确关键异常路径和边界场景。
- 已说明异常落在哪个主要部分、接口类别或状态机处理。
- 已说明异常对状态流转、outbox、projection、reference、query 和 handoff 的影响。
- 已明确 Query no-write、Consumer 不写核心 truth、Job 不修复 truth 的异常边界。
- 未写入完整错误码、重试参数、补偿脚本、DLQ 结构、事务细节或测试用例。
- 可以进入 Step 11 “配置影响轮廓”。
