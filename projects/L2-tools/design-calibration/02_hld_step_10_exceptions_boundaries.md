# L2-tools 02 概要 Step 10: 异常与边界场景轮廓

> 创建日期: 2026-08-05
> 状态: completed
> 当前模式: full-restart / single-agent-serial
> 文档级 flow: `design-calibration/02_hld_calibration_flow.md`
> 正式文档目标: `projects/L2-tools/02-概要设计.md`
> 本轮口径: 只点名会改变主要组成部分、接口、处理流或状态分支的关键异常；不展开错误码全集、重试参数、补偿脚本、恢复 runbook、协议 schema 或实现算法。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 10 异常与边界场景轮廓 |
| 已读取台账 / flow | yes |
| 已读取前序 Step | yes: Step 3 / 5 / 7 / 8 / 9，直接异常反查入口来自 Step 9 §17 |
| 已读取 SOP / 书写规范 | yes: 概要 SOP Step 10；概要书写规范 §4.10 |
| 已读取正式输入 | yes: 正式 00 的失败语境 / 业务规则 / 接口边界；正式 01 的失效模式 / owner / local-truth-first 边界 |
| 旧材料处理 | retryable result、ToolPolicy error、host callback、MCP / builtin 异常、ToolHealth 与 replay 只作 historical pollution |
| 进入条件 | pass: Step 9 completed |
| next_allowed_action | 按主线阶段建立关键异常场景表、异常影响图、覆盖审计与 Step 11 配置反查入口。 |

## 1. 本步输入与目标

### 1.1 输入

- Step 5 的六个主要组成部分与跨部分接缝。
- Step 7 的 Command / Query / Consumer / Event skeleton / Job / Port 骨架。
- Step 8 的 12 个关键处理流族及 common path。
- Step 9 的对象限定状态族、允许 / 禁止迁移与迟到材料纪律。
- `L2T-UP-001~009` 的开放 owner / contract / mapping / route / client / baseline 缺口。
- 正式 00 / 01 已确认的 body-free、fail-closed、Sandbox 不旁路、local-truth-first、formal re-entry 与外部状态不反写规则。

### 1.2 目标

本 Step 只回答以下问题：

1. 哪些失败若不在概要层先固定，会让 03 误设 owner、对象、接口或状态机？
2. 异常发生时是“无执行终态”“暂不能形成可信终态”“本地终态已成立但外围降级”，还是“仅派生读取降级”？
3. 哪个主要组成部分和 owning flow 承接异常，是否必须 formal re-entry？
4. 哪些开放 seam 必须保持 blocked / unknown / unverifiable，而不是被描绘为已具备重试或降级方案？
5. 哪些实现细节必须继续留给 03 / 04 / 05 / 06，而不能借异常讨论提前定稿？

## 2. SOP 问题回答

1. 概要层必须点名：identity / revision 冲突、Binding 来源异常、canonical invocation 不可解释、authorization / Sandbox 前置失效、execution source 不可信、terminal outcome 冲突、audit 原子关系失败、安全外发资格失败、external status 不可验证、gap / projection 失效。
2. 会改写协作关系的边界场景有四类：执行前保守终止、执行材料暂不能归一化、Outcome 后外围独立降级、派生读取独立降级。
3. 不能留到详细设计才发现的失败包括：Sandbox-required host bypass、authorization 缺失默认为 allow、source / outcome owner 合并、audit 晚于 outcome 且丢失、external feedback 反写终态、Job / Query 自动修复核心、forbidden body 外发。
4. 概要层固定 owner、触发 flow、对状态 / 主线的影响、是否 fail closed / degrade / gap，以及禁止行为；具体错误码、retry、transaction、dedup、ordering、correction 与 recovery contract 留给 03。
5. 不在本 Step 定义错误类型全集、重试次数 / 退避、DLQ / replay、补偿脚本、数据库回滚、告警阈值、runbook、HTTP / RPC / event payload 或真实测试期望。

## 3. 当前材料问题诊断

| 旧材料 / 常见写法 | 问题 | 当前修正 |
|---|---|---|
| `validation / policy / execution error` 三类大筐 | 混合 admission、authorization、Sandbox、tool semantic 与 carrier owner。 | 以异常发生时点、owner 和是否真实执行分层。 |
| `retryable / non-retryable` 作为工具终态 | 把 Runtime / carrier recovery 决策写进 L2 outcome truth。 | L2 只形成 normalized outcome / no-execution / gap；重试资格由正式 owner contract 后续定义。 |
| Sandbox 不可用时 host fallback | 绕过 isolation truth 和 `sandbox_required` 硬约束。 | 形成 no-execution unavailable / blocked，绝不静默直跑。 |
| Host callback / raw stdout 归一化失败仍返回成功 | Capture 或 provider body 被当作可信工具结果。 | Source assessment conservative；无可信 mapping 不形成成功 outcome。 |
| Audit publish 失败即调用失败 | Tool-domain audit、Bus delivery 与 observation 状态合并。 | Outcome / ToolAuditEntry 本地先收口；外围 submission / feedback 独立降级。 |
| Reconciliation / replay 自动修复 truth | Job、delivery 或旧材料取得第二写权。 | 检测只写 assessment / gap；subject 修复 formal re-entry。 |
| ToolHealth degraded | 用一个派生标签遮蔽 contract、Binding、carrier、source 和 projection 的不同失败。 | 使用 object-qualified state 与明确影响范围。 |
| SLA / availability 数值决定异常分支 | 伪造尚未定稿的 measurement authority 和恢复承诺。 | 只固定语义分支；量化指标留给后续正式链。 |

## 4. 改动前后对比与设计取舍

| 维度 | Historical / 不采用 | 当前采用 |
|---|---|---|
| 异常主语 | Tool / system generic error | Contract、Binding、Admission、Requirement、Handoff、Source、Outcome、Audit、Submission、Gap、Projection 对象限定语义 |
| 执行前失败 | Policy error 或 retryable | 明确 no-execution rejected / unavailable，且不生成 Sandbox run / capture 事实 |
| 执行中材料问题 | Host / Sandbox error 直接映射工具失败 | 先验证 source authority / correlation / mapping；不可信时只形成 assessment / gap |
| 执行后外围失败 | 回滚 result 或把 invocation 标为 failed | Local outcome / audit 不变，submission / delivery / observation 独立降级 |
| 迟到 / 冲突 | Last-write-wins | 新 ref / snapshot / assessment / gap；terminal truth 不覆盖 |
| 恢复方式 | Job / replay / fallback 自动修复 | Subject owner formal re-entry；03 再定义 correction / retry / transaction 细节 |
| 开放 seam | 写成 unavailable dependency with planned retry | 保持 blocked / unknown / unverifiable，不伪造 schema、provider、route 或 readiness |

核心取舍：

- 采用“失败隔离面”而不是“统一异常中心”；每个异常由已有组成部分和 owning flow 承接。
- 采用 conservative no-execution 表达执行前失败，避免未执行行动被伪装成 tool / Sandbox failure。
- 采用 source acceptance gate，避免 carrier delivery 与 semantic normalization 混为一体。
- 采用 local outcome / audit first，外部协作失败只形成独立 degradation / gap。
- 采用 append-only conflict / late-material 纪律，不使用 last-write-wins 修订历史。
- 当前不画逐异常恢复图；只画一张异常影响总图，因为恢复算法与参数属于 03 / 04 / 运维层。

## 5. 异常处置分类

| 处置类 | 适用时点 | L2 概要结果 | 是否允许真实执行 / 继续主线 |
|---|---|---|---|
| `pre_execution_fail_closed` | Canonical admission、authorization、Sandbox 前置未成立 | `InvocationAdmission` conservative state 或 `ToolInvocationOutcome::no_execution_*` + audit | 否 |
| `source_not_accepted` | 外部执行材料已到达，但 authority / correlation / mapping 不可信 | `ExecutionSourceAssessment` + `ConsistencyGap`，暂不形成伪 outcome | 否（终态归一化主线暂停） |
| `terminal_conflict` | Terminal outcome 已存在，又到达重复 / 冲突材料 | 保留原 outcome / audit；追加 conflict assessment / gap | 原调用不得再次推进 |
| `post_truth_degradation` | Outcome / audit 已成立，safe handoff / delivery / observation 失败 | `ExternalSubmissionAttempt` / external ref / gap 降级 | 本地终态不变；外围路径受限 |
| `derived_read_degradation` | Report / search / diff / diagnostic / guidance stale / failed | 返回 stale / rebuilding / unavailable 与稳定 truth ref | Core write / stable read 不受影响 |
| `formal_reentry_required` | 检测发现 core subject 需修复 | Gap 保持 open / pending；经 subject owner Command 修复后再关闭 | 受影响路径依 impact 阻断或降级 |

## 6. 工具合同与演进异常

| ID | 场景 | 应落在哪个部分处理 | 对对象 / 接口 / 流 / 状态的影响 | 当前概要口径 |
|---|---|---|---|---|
| `EX-L2T-001` | Stable identity 来源冲突、同名歧义或外部 identity 被误当本地 identity | 工具合同与演进；`EstablishToolContract` | Contract establishment 不得留下半合同；ref assessment / gap 可成立 | 拒绝正式建立；不按名称、implementation、Hub / provider identity 猜测 `ToolId`。 |
| `EX-L2T-002` | Definition source 缺失、陈旧、冲突或不可验证 | 工具合同与演进；establish / adopt flow | `DefinitionSourceRef` conservative；新 formalization / adoption 阻断 | 保留已成立历史 definition，但不得形成或切换 current revision。 |
| `EX-L2T-003` | Definition 不完整、含 forbidden body 或风险 / execution requirement 语义无法解释 | 工具合同与演进；inbound boundary + contract service | Candidate 不进入 current；形成 explicit rejection / gap | 不保存 raw provider / secret body，不以默认值补造完整定义。 |
| `EX-L2T-004` | Compatibility impact 为 incompatible / unverifiable，或 adoption 时 basis 已陈旧 | 工具合同与演进；assess / adopt flow | Impact fact 追加；current pointer 不变 | 不自动 adopt、不原地回滚旧 revision；重新评估形成新 fact。 |
| `EX-L2T-005` | Retirement 请求存在未收口的当前消费影响 | 工具合同与演进；`RetireToolContract` | Contract 可进入 `retirement_pending`，但不能虚假标为 retired | 影响闭口规则留 03；新 invocation 的 guard 必须保守，不删除历史。 |
| `EX-L2T-006` | Retired / superseded / withdrawn definition 被新请求引用 | 规范调用与受理消费合同边界 | Admission rejected / unavailable；不复活旧状态 | 历史读取允许；新行动必须选择正式 current contract / revision。 |

## 7. Capability Binding 与受控来源异常

| ID | 场景 | 应落在哪个部分处理 | 对对象 / 接口 / 流 / 状态的影响 | 当前概要口径 |
|---|---|---|---|---|
| `EX-L2T-007` | Bound relation 的 Hub ref / snapshot missing、stale、conflicting 或 unverifiable | Binding 与受控来源；consumption assessment / consistency flow | 新 `CapabilityBindingAssessment` + gap；受影响 invocation fail closed | 不回退 local registry、inventory、string match 或旧 cache。 |
| `EX-L2T-008` | 缺少 Hub ref 被误解释为 explicit-unbound | Binding owning Commands | 不得建立 / 替换 relation | `explicit_unbound` 必须由正式 classification reason 成立，不能由 null 推断。 |
| `EX-L2T-009` | Hub change clue 迟到、重复、乱序或 authority / version 不合法 | `ConsumeHubCapabilityChangeClue` | Consumer 拒绝 / dedup 或追加新 assessment / gap；不改 relation | 不覆盖 invocation-time snapshot，不由 Consumer replace / invalidate Binding。 |
| `EX-L2T-010` | Binding replacement 中新 relation 不可验证 | `ReplaceCapabilityBinding` | Current relation 保持；不得留下 new ref 已写、relation 未切换的半状态 | 强一致替换；失败显式，不自动退化为 unbound。 |
| `EX-L2T-011` | Binding 已 invalidated 但 caller 仍提交 invocation | 规范调用与受理；`SubmitToolInvocation` | Admission rejected / unavailable + no-execution outcome / audit | 不恢复 relation、不让 caller 绕过 Binding assessment。 |

## 8. 规范调用与受理异常

| ID | 场景 | 应落在哪个部分处理 | 对对象 / 接口 / 流 / 状态的影响 | 当前概要口径 |
|---|---|---|---|---|
| `EX-L2T-012` | Caller intent 含 raw request / provider / secret body，或必需 context ref 缺失 | 规范调用与受理；inbound boundary / `SubmitToolInvocation` | Context insufficient；admission rejected；适用时原子形成 no-execution / audit | 只保留 canonical safe semantics 与 typed refs；禁止正文落库或继续执行。 |
| `EX-L2T-013` | Caller / work / trace ref 冲突或 authority 不可验证 | 规范调用与受理 | 依影响标 insufficient / degraded；blocking ref 导致 no-execution | 不补造 caller、work item、trace 或 Runtime checkpoint。 |
| `EX-L2T-014` | 相同 idempotency key 携带相同语义重复提交 | Generic Command boundary | 返回既有语义 / stable ref，不创建第二 invocation / outcome | 算法和保留期留 03；不得用重复请求推进状态。 |
| `EX-L2T-015` | 相同 idempotency key 携带不同 canonical intent | Generic Command boundary | 显式 idempotency conflict；不复用旧 invocation 作为新请求 | 不 last-write-wins，不创建含混双重语义。 |
| `EX-L2T-016` | Invocation 建立期间 admission / no-execution / audit 不能同边界收口 | 规范调用与受理 persistence boundary | 整体不形成可见半事实；失败情况显式暴露 | 具体 transaction / recovery 留 03，不允许有 invocation 无可解释受理。 |
| `EX-L2T-017` | Contract / definition / Binding 在 invocation 建立后变化 | Invocation anchor + 后续消费 | 既有 invocation 仍锚定原消费时点；变化只影响新 invocation 或显式 re-evaluation | 禁止后到变化穿越改写 admission / outcome。 |

## 9. 执行前置与条件交接异常

| ID | 场景 | 应落在哪个部分处理 | 对对象 / 接口 / 流 / 状态的影响 | 当前概要口径 |
|---|---|---|---|---|
| `EX-L2T-018` | Governed / authorization-required，但正式 owner / source / result contract 未闭口 | 执行前置与条件交接；authorization port / precondition flow | Assessment missing / unverifiable；形成 no-execution unavailable / audit | `L2T-UP-001~002` 下 fail closed；不推定 Governance 直边、不自授权。 |
| `EX-L2T-019` | Authorization result stale、conflicting、subject / invocation 不匹配或 authority 不可验证 | `EvaluateExecutionPreconditions` | 新 conservative assessment；真实执行不得发生 | 不用旧 allow、caller role、Hub visibility 或 local policy fallback。 |
| `EX-L2T-020` | 正式 authorization result 为 deny | Precondition flow | `accepted_deny` + no-execution rejected / audit | Deny 是外部 result 消费事实，不改写 admission 为 rejected，也不生成 Sandbox run。 |
| `EX-L2T-021` | Constrained allow 的约束无法由当前 handoff context 验证 | Precondition / handoff flow | Assessment 可保持 constrained；handoff blocked；no-execution | 约束未证明满足即不可交接，不把 constrained 当 unconditional allow。 |
| `EX-L2T-022` | Sandbox-required，但 mapping、readiness、carrier 或正式 execution port 不可用 | 执行前置与条件交接；`PrepareExecutionHandoff` | Readiness mapping-blocked / unavailable；handoff blocked；no-execution unavailable | `L2T-UP-003~004` 下不得 host direct execution，也不伪造 attempt / receipt。 |
| `EX-L2T-023` | Execution safe summary 不足、含 forbidden body 或与 invocation anchor 冲突 | Handoff boundary | Handoff blocked / invalidated；不调用 Sandbox port | 只交接最小 canonical safe context；具体 schema 留 03。 |
| `EX-L2T-024` | L2 调用 execution port 时本地失败 / carrier unavailable | Handoff attempt boundary | Append locally-failed / carrier-unavailable attempt；no-execution outcome / audit | Local attempt 不等于 Sandbox accepted / run / receipt；外部未发生事实不得补造。 |
| `EX-L2T-025` | Attempt 后迟到的 readiness / authorization 变化 | 引用完整性 + precondition assessment | 新 assessment / gap，不能改写原 attempt | 如需新行动须形成正式新 context / invocation；不原地恢复 handoff。 |

## 10. Outcome、审计与安全交接异常

| ID | 场景 | 应落在哪个部分处理 | 对对象 / 接口 / 流 / 状态的影响 | 当前概要口径 |
|---|---|---|---|---|
| `EX-L2T-026` | Sandbox execution source authority、correlation 或 invocation mapping 缺失 / 冲突 | Outcome、审计与安全交接；source Consumer + `AcceptExecutionSource` | Source assessment missing / conflict / mapping-blocked；gap；不形成伪 outcome | `L2T-UP-003` 未闭口时保守处理；delivery 到达不等于 semantic acceptance。 |
| `EX-L2T-027` | Execution source 含 raw capture、secret、大正文或 forbidden body | Source Consumer / inbound boundary | 拒绝材料或只保留允许 ref / safe summary；gap 可见 | 不复制 raw stdout、provider payload、capture body 入 L2 truth / audit / event。 |
| `EX-L2T-028` | Execution source 重复、迟到、乱序或不支持 contract version | Source Consumer | Dedup / reject / append assessment；不能重复创建 outcome | Envelope / ordering / retention 算法留 03，不采用 last-write-wins。 |
| `EX-L2T-029` | Carrier 表示 execution success，但工具语义返回 failure | `AcceptExecutionSource` normalization | Source 可 accepted；Outcome 为 `tool_failed`，audit 记录 basis | Execution success 与 tool semantic success 不合并。 |
| `EX-L2T-030` | Execution / capture failure 可验证 | `AcceptExecutionSource` | Outcome 为 `execution_failed` / `capture_failed`，并同边界形成 audit | 不返回伪成功，不保存外部失败正文；错误分类全集留 03。 |
| `EX-L2T-031` | Source 可信但无法按已闭口 mapping 归一化 | Source acceptance / normalization boundary | Assessment mapping-blocked / unverifiable；gap；暂不形成猜测 outcome | 不将 unknown provider response 塞入 generic success / error。 |
| `EX-L2T-032` | 同一 invocation 已有 terminal outcome，又到达不同结果材料 | Outcome service + integrity flow | 原 outcome / audit 保留；追加 terminal conflict assessment / gap | 03 需定义 correction / superseding fact；禁止原地覆盖或创建第二“当前终态”。 |
| `EX-L2T-033` | Outcome 与 ToolAuditEntry 无法在同一 L2 边界收口 | Outcome / audit persistence boundary | 不暴露 outcome-only 半状态；显式内部收口失败 | 事务与恢复机制留 03；不能用 Bus / Observability material 替代 ToolAuditEntry。 |
| `EX-L2T-034` | Safe material 任一门禁 minimal necessary / body-free / redacted / correlated 不成立 | `PrepareSafeExternalHandoff` | Eligibility ineligible / unverifiable；不创建 material / submission | 无“加密即可外发”“测试环境可外发”例外。 |
| `EX-L2T-035` | Event route / producer / source contract 未闭口 | Safe event collaboration boundary | Submission route-blocked / degraded；outcome / audit 不变 | `L2T-UP-004~006` 下不声明已 publish / delivered / observed。 |
| `EX-L2T-036` | Local event port call 失败 | `ExternalSubmissionAttempt` | Append locally-failed；gap / degradation 可见 | 不回滚 outcome / audit，不把调用结果改为 tool failure。 |
| `EX-L2T-037` | Bus delivery feedback missing / stale / conflicting / unverifiable | Bus feedback Consumer / refresh Job | `BusDeliveryStatusRef` 独立变化；submission / outcome 不变 | Submitted 不推导 delivered；L2 不拥有 retry / DLQ / replay truth。 |
| `EX-L2T-038` | Observability feedback route blocked / unknown / stale / conflicting | Observation feedback boundary | `ObservationMaterialRef` 独立变化；不声明 observed | Observation 不替代 audit，不反写 outcome，不驱动 Runtime recovery。 |
| `EX-L2T-039` | Bus delivery 与 Observability observation 结论不一致 | 引用完整性与受控派生 | 两 refs 分别保留并形成 gap / diagnostic input | 不合并成 global handoff success，不让一个 owner 覆盖另一个。 |

## 11. 引用完整性与受控派生异常

| ID | 场景 | 应落在哪个部分处理 | 对对象 / 接口 / 流 / 状态的影响 | 当前概要口径 |
|---|---|---|---|---|
| `EX-L2T-040` | Integrity Job 发现 required ref missing / stale / conflict / unverifiable | 引用完整性与受控派生；integrity flow | 新 assessment / `ConsistencyGap::open`;report current / partial | Job 不修 subject；core-blocking path fail closed，peripheral path degrade。 |
| `EX-L2T-041` | Gap resolution 只有文本说明、猜测 commit / run_id、伪 evidence alias 或签署 | `RecordConsistencyGapResolution` | Gap 保持 open / resolution_pending | Subject 必须先由 owner formal repair；本设计不伪造 evidence / 测试 / 验收事实。 |
| `EX-L2T-042` | Owner 修复线索到达，但 subject 当前状态尚不可验证 | Gap resolution flow | `resolution_pending`，不得标 resolved | 新 evidence contract 与 verification guard 留 03 / 05 / 06。 |
| `EX-L2T-043` | Report 只覆盖部分 refs 或读取源暂不可用 | Integrity report | Report partial / stale / failed；不改变 subject | 报告状态必须显式，不用“健康”总标签掩盖缺口。 |
| `EX-L2T-044` | Derived projection 落后或 rebuild 进行中 | Derived rebuild / complex Query | Projection stale / rebuilding；返回稳定 truth ref / gap surface | 不阻塞 core write / stable Query，不同步等待 rebuild。 |
| `EX-L2T-045` | Derived rebuild 失败或 projection unavailable | Rebuild Job / complex Query | 仅 projection failed / unavailable | 禁止 fallback inventory、allowlist、外部正文或旧 cache 冒充 current truth。 |
| `EX-L2T-046` | Query 试图触发 refresh / repair 或穿透拉取 external body | Query boundary | 拒绝越界请求或返回 explicit unavailable / gap | Query 永不取得 write、external orchestration 或正文读取能力。 |
| `EX-L2T-047` | Core Tools-specific shared authority 仅 candidate / missing / conflict | Shared contract boundary / integrity flow | `SharedContractAuthorityRef` conservative；具体 compile contract 阻断 | `L2T-UP-008` 下不私造 package、type、schema。 |
| `EX-L2T-048` | SDK consumer 请求被理解为已有 Tools client / compatibility coverage | Guidance Query / downstream seam | 只返回 body-free guidance / gap；不进入本仓状态 | `L2T-UP-009` 保持 future，不能声明 client ready 或联调通过。 |

## 12. 跨组成部分边界场景

| ID | 边界场景 | 受影响组成部分 / 接缝 | 当前概要口径 |
|---|---|---|---|
| `EX-L2T-049` | Contract current revision 与 invocation anchor revision 不同 | 合同演进 -> 调用受理 / Outcome | 历史 invocation 按 anchor 解释；新 revision 只影响新 invocation，除非未来有显式 re-evaluation contract。 |
| `EX-L2T-050` | Binding current relation 与 invocation-time assessment 不同 | Binding -> 调用受理 / 前置 | 保留消费时点 snapshot；不得用 current relation 重写历史判断。 |
| `EX-L2T-051` | Admission 已通过，但适用 authorization / Sandbox 前置随后失败 | 调用受理 -> 执行前置 | Admission 不翻转；另建 requirement / assessment / no-execution outcome。 |
| `EX-L2T-052` | Sandbox execution truth 存在，但 source 尚不能被 L2 正式接受 | Sandbox source seam -> Outcome | 不伪造 normalized terminal truth；保留 source assessment / gap，向消费者显式 unresolved。 |
| `EX-L2T-053` | Outcome 已成立，但 audit / safe handoff / external feedback处于不同状态 | Outcome -> safe handoff / external refs | ToolAuditEntry 必须与 outcome 同边界；safe handoff 及外部 refs 可独立 degraded / unknown。 |
| `EX-L2T-054` | Integrity / diagnostic 发现核心异常 | 派生维护 -> owning component | 只创建 gap 与 formal re-entry 提示；不直接 adopt definition、replace Binding、改 outcome 或恢复 Runtime。 |
| `EX-L2T-055` | 外部 owner 全部可用但某一次调用不适用相应前置 | Contract requirement -> precondition | 条件路径按 invocation-specific requirement 决定；不把 authorization / Sandbox 画成所有工具固定 pipeline。 |
| `EX-L2T-056` | 多个外部 seam 同时失效 | Authorization / Sandbox / Bus / Observability / Core / SDK | 逐 seam 保留独立 assessment / ref / gap；不构造 global unavailable / degraded 状态或跨 owner 补偿事务。 |

## 13. 异常影响图

```text
<Formal intent / external clue / execution source>
  |
  v
<Owning L2 boundary validates identity, authority, body and anchor>
  |
  +-- before execution: invalid / missing / unverifiable
  |       -> fail closed
  |       -> no-execution outcome + ToolAuditEntry
  |       -> no Sandbox run / no host bypass
  |
  +-- execution source cannot be accepted
  |       -> source assessment + ConsistencyGap
  |       -> no fabricated terminal outcome
  |
  +-- terminal outcome already exists
  |       -> preserve outcome + audit
  |       -> append conflict / late-material gap
  |
  +-- local outcome + audit committed, peripheral handoff fails
  |       -> submission / delivery / observation degradation
  |       -> local terminal truth unchanged
  |
  +-- only derived view fails
          -> stale / rebuilding / unavailable surface
          -> core truth and stable read remain available
```

关键说明：

- 异常首先按发生时点和 truth owner 分流，不进入一个全局异常处理器或统一失败状态。
- 执行前异常必须形成可解释的 no-execution 语义，且不能产生 Sandbox run / capture 或 host fallback 事实。
- Source 未被正式接受时宁可暂不形成 normalized outcome，也不能把 carrier / raw material 猜成工具终态。
- Outcome / audit 后的 event collaboration 与派生读取都允许独立降级，但不得反向污染 core truth。
- 图不表达错误码、retry / backoff、transaction rollback、DLQ / replay、补偿脚本或运维恢复步骤。

## 14. 处理流异常覆盖审计

| Step 8 流族 / common path | 关键异常覆盖 | 主要处置类 | 覆盖结果 |
|---|---|---|---|
| Contract establishment | `EX-L2T-001~003` | precondition rejection / gap | pass |
| Contract evolution | `EX-L2T-002 / 004~006` | current unchanged / append assessment | pass |
| Binding mutation | `EX-L2T-008 / 010` | atomic reject / no implicit unbound | pass |
| Binding external clue / check | `EX-L2T-007 / 009` | new assessment / gap | pass |
| Canonical invocation / admission | `EX-L2T-012~017` | pre-execution fail-closed / idempotency conflict | pass |
| Execution precondition | `EX-L2T-018~021 / 051 / 055` | no-execution rejected / unavailable | pass |
| Sandbox handoff | `EX-L2T-022~025` | blocked / invalidated / local attempt failure | pass |
| Execution source / outcome / audit | `EX-L2T-026~033 / 052~053` | source-not-accepted / terminal conflict / atomic local truth | pass |
| Safe external handoff | `EX-L2T-034~036` | post-truth degradation | pass |
| External feedback | `EX-L2T-037~039 / 056` | independent external refs / gap | pass |
| Integrity / gap resolution | `EX-L2T-040~043 / 054` | formal re-entry required | pass |
| Derived rebuild / complex read | `EX-L2T-044~048` | derived read degradation | pass |
| Simple stable Queries | `EX-L2T-043 / 046` | explicit partial / unavailable, no refresh | pass |
| Safe outbound common path | `EX-L2T-034~039` | eligibility failure / route degradation | pass |
| Generic Consumer path | `EX-L2T-009 / 028 / 037~039` | reject / dedup / append-only assessment | pass |
| Generic Job path | `EX-L2T-040~045` | assessment / projection only | pass |

不存在未被异常口径覆盖的 P0 Command、改变本地 ref / gap 的 Consumer 或影响一致性的 Job；简单 Query 的失败仍维持只读语义。

## 15. 状态红线与异常一致性审计

| Step 9 红线 | Step 10 承接 | 结果 |
|---|---|---|
| Retired / invalidated / superseded 不原地复活 | `EX-L2T-004~006 / 011` | pass |
| Admission 不被后到材料翻转 | `EX-L2T-017 / 025 / 049~051` | pass |
| Authorization conservative state 不原地变 allow | `EX-L2T-018~021 / 025` | pass |
| Sandbox-required 不 host bypass | `EX-L2T-022~024` | pass |
| Local handoff attempt 不等于 external lifecycle | `EX-L2T-024 / 026 / 052` | pass |
| Terminal outcome 不原地覆盖 | `EX-L2T-028 / 032 / 049~053` | pass |
| Local submission 不等于 delivered / observed | `EX-L2T-035~039 / 053` | pass |
| Query / Consumer / Job 不修改 core subject | `EX-L2T-009 / 040~046 / 054` | pass |
| Projection 不反推 core truth | `EX-L2T-043~045` | pass |
| Missing ref / inventory 不触发 fallback | `EX-L2T-001 / 007~008 / 018~019 / 045` | pass |
| 安全门禁不可绕过 | `EX-L2T-003 / 012 / 023 / 027 / 034` | pass |
| Logical / candidate / blocked seam 不润色为 ready | `EX-L2T-018 / 022 / 026 / 035 / 047~048` | pass |

### 15.1 异常状态的消费者可解释性

| 消费者 | 必须能区分 | 不得看到的伪语义 |
|---|---|---|
| Runtime / direct caller | admission rejected / unavailable、no-execution rejected / unavailable、tool / execution / capture failure、terminal unresolved | 未执行被标为 execution failure；route blocked 被标为 tool failure |
| 工具维护者 | source / revision / Binding conflict、retirement pending、terminal conflict、open gap | 自动 adopted / repaired / recovered |
| 安全 / 边界审查者 | authorization assessment、Sandbox requirement / readiness、safe eligibility | L2 self-allow、host bypass、正文因加密而可外发 |
| 审计 / 合规查看者 | ToolAuditEntry 与 outcome basis、external submission / delivery / observation 分层 | Bus / Observability material 代替 ToolAuditEntry |
| 运行问题调查者 | contract、admission、precondition、carrier、source、semantic outcome、handoff、projection 分层异常 | 单一 ToolHealth / global degraded 状态 |

## 16. Blocker 与异常场景映射

| Blocker | 对应异常 | 当前概要处置 | 阻塞的后续定稿 |
|---|---|---|---|
| `L2T-UP-001` authorization owner | `EX-L2T-018~021` | Owner / source 不可验证则 fail closed | Authority、provider、调用协议、正向 path |
| `L2T-UP-002` source matrix / taxonomy | `EX-L2T-018~021 / 055` | 不私造高风险分类 / allow-deny schema | Classification、freshness、constraint mapping |
| `L2T-UP-003` Sandbox mapping | `EX-L2T-022~023 / 026 / 029~031 / 052` | Mapping blocked，不 host bypass / 猜 outcome | Invocation-to-command、capture/failure normalization |
| `L2T-UP-004` receipt / downstream handoff | `EX-L2T-024 / 035~037` | Local attempt 与 receipt / delivery 分离 | Receipt、retry、DLQ、feedback、cleanup |
| `L2T-UP-005` Observability producer / source | `EX-L2T-034~039 / 053` | Route blocked / unknown，不声明 observed | Producer enum、source family、route / material contract |
| `L2T-UP-006` Observability readiness conflict | `EX-L2T-035 / 038` | Current workspace input 不等于 ready | Readiness、正向集成 / 验收证据 |
| `L2T-UP-007` uncommitted baseline | 所有依赖输入 | 只声明 current workspace state | Frozen baseline / commit attribution |
| `L2T-UP-008` Core shared authority | `EX-L2T-047` | Candidate / missing 时具体 compile contract blocked | Package、type、schema、version |
| `L2T-UP-009` SDK client seam | `EX-L2T-048` | Guidance only，SDK 保持 future | Client API、language wrapper、compatibility / coverage |

未发现新增 blocker。以上 blocker 不阻塞本 Step 的逻辑异常边界完成，但阻塞受影响的正向 schema、mapping、route、provider、client、readiness、测试与验收声明。

## 17. Historical pollution 审计

| Historical 内容 | 当前判定 | 处理结果 |
|---|---|---|
| `ToolPolicy / ToolScope` 查询错误或工具层 allow / deny | 与当前 authorization owner / assessment 分权冲突 | 未继承；用 formal result consumption + fail-closed。 |
| `member-service` host execution / callback 异常 | 当前边界无此 owner 主线，且 raw callback 不可成为 truth | 未继承；统一为 blocked execution carrier / source seam。 |
| `retryable / denied / blocked` 混合结果 | 将 recovery policy 与 no-execution / semantic outcome 合并 | 未继承；只保留对象限定 terminal / assessment / attempt。 |
| MCP / builtin / extras / provider-specific error | 产品库存 / provider registry 越界 | 未继承；不进入当前异常表。 |
| `ReplayToolAudit` / DLQ / replay 失败 | 冒领 Bus / Observability / recovery truth | 未继承；只保留 local audit 与 external ref / gap。 |
| Tool availability SLA、固定 P95 / QPS / success rate | 无 measurement authority / evidence | 未继承；不写量化异常门槛。 |
| ToolHealth / metrics / trace 驱动恢复 | 派生观察反写核心或 Runtime recovery | 未继承；diagnostic / observation 只读。 |
| 上线回滚 / 灰度 /告警步骤 | 属于 07 / 运维层 | 未进入 Step 10。 |

## 18. 详细设计继续展开的异常契约

Step 10 已固定异常 owner、分支和禁止行为，但下列内容必须由 `03-详细设计.md` 继续展开，不能在本 Step 定稿：

| 03 承接方向 | 必须保持的概要不变量 |
|---|---|
| Error taxonomy 与 typed error / rejection / unavailable surface | 不合并 admission、authorization、carrier、source、tool semantic、submission 和 projection owner。 |
| Transaction / unit-of-work / partial-write recovery | Invocation + admission、outcome + audit 等 L2 内部关系不得留下消费者可见半状态；不扩为跨 owner 事务。 |
| Idempotency / dedup / ordering / late-material guards | 重复不推进状态，冲突显式，迟到材料不覆盖历史 anchor / terminal truth。 |
| Source authority / correlation / mapping validation | Mapping 未闭口不得声明 ready；raw / secret body 不进入 L2。 |
| Terminal correction / superseding fact | 不原地修改 terminal outcome / audit，且 correction 必须可追溯。 |
| Retry / retry-eligibility / recovery ownership | L2 不把 Runtime、Sandbox、Bus、Observability recovery 决策写入 outcome；未闭口 owner 保持 blocked。 |
| Safe handoff redaction / correlation verification | 四项合取不可配置绕过，route / delivery / observation 独立。 |
| Gap evidence verification / formal re-entry | Gap closure 不修 subject，不接受伪 commit / run / evidence / signoff。 |
| Projection stale / rebuild failure surface | 派生失败不阻塞 core truth，不 fallback inventory / old cache。 |

错误码编号、HTTP / RPC status、event failure schema、retry / backoff / timeout、DLQ / replay、database rollback、alert threshold、runbook 与测试用例仍分别留给 03 / 04 / 05 / 06 / 07。

## 19. Step 11 配置影响反查入口

Step 11 必须特别验证下列边界不会被配置化绕过：

- Stable identity / current definition / Binding classification 与 formal owner 写权。
- `explicit_unbound` 的正式分类要求。
- Canonical invocation、forbidden-body 拒绝与 admission / no-execution 原子关系。
- Authorization missing / stale / conflict / unverifiable 的 fail-closed。
- Sandbox-required 不 host bypass，以及 mapping / readiness blocked 不伪装为可执行。
- Source acceptance、terminal immutability、outcome + audit 同边界收口。
- Safe material 四项合取、local-truth-first、delivery / observation 分权。
- Query / Consumer / Job no-write 与 formal re-entry。
- Gap closure evidence guard 与派生 view no-fallback。

允许受配置影响的只能是外部 endpoint / profile / timeout / batch / retry policy / job cadence / projection scope 等装配轮廓；是否真的允许 retry 仍取决于 03 定义的 owner / contract，不能仅凭配置项存在推导。

## 20. 正式 §10 回填草稿

正式第 10 章应使用一张“异常与边界场景表”按以下主题压缩吸收本 Step：

1. 工具合同 / definition / Binding 来源异常。
2. Invocation canonicalization、context、idempotency 与历史 anchor 异常。
3. Authorization / Sandbox 前置与 handoff 异常。
4. Execution source / normalized outcome / audit 异常。
5. Safe handoff / Bus / Observability 外围降级。
6. Integrity / gap / projection / Core / SDK blocked boundary。

正式表每行必须包含“场景、应落在哪个部分处理、当前概要口径”，并保留一张 §13 异常影响总图；不得复制 56 行细目、不得补错误码 / 重试参数 / 补偿实现，也不得把 open blocker 写成 planned success path。

## 21. Step 完成门禁

| 门禁 | 结果 | 说明 |
|---|---|---|
| 关键异常路径完整 | pass | 56 个场景覆盖六组成部分、12 个 flow family 与 common path。 |
| Owner / 落点明确 | pass | 每个场景均落到已有组成部分、接口或边界，无“系统处理”。 |
| 主线 / 状态影响明确 | pass | 区分 pre-execution、source unresolved、terminal conflict、post-truth 与 derived degradation。 |
| 执行事实诚实 | pass | No-execution 不制造 Sandbox fact；source 不可信不伪造 outcome。 |
| Local-truth-first | pass | Outcome / audit 不被 event / observation 失败改写。 |
| Formal re-entry | pass | Consumer / Job / diagnostic 不修 core subject。 |
| Blocker 诚实性 | pass | `L2T-UP-001~009` 保持 open；无 schema / mapping / route / provider / client / readiness 伪事实。 |
| Historical pollution | pass | Policy self-decision、host callback、retryable、replay、SLA 与 ToolHealth 未回流。 |
| Step 11 可承接 | pass | 配置影响与禁止配置化反查入口已建立。 |
| 详细设计越界 | pass | 未写错误码全集、retry 参数、补偿脚本、DDL、协议或恢复 runbook。 |

```text
step_status = completed
gate_status = pass
next_allowed_action = create_step_11_configuration_impact
formal_document_write_allowed = false
commit_required = false
```
