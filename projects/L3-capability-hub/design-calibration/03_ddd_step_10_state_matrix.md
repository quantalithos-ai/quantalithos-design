# L3-capability-hub 03 详细设计 Step 10: 状态机与转换矩阵

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 10
> 回填章节: `projects/L3-capability-hub/03-详细设计.md` §9 状态机与转换矩阵
> 创建日期: 2026-07-15
> 当前模式: full-restart
> 当前批次: `10.8`
> 状态: `step_10_completed_with_step_13_controlled_reopen`
> Step 13受控同步: 2026-07-18;`CapabilityIdempotencyState`收紧为`Reserved | Completed`,删除不可达persisted `Conflict`及`mark_conflict(...)`；state-like enum类型仍为24,exact variants为111,global pair closure为`638 = 239 current + 98 reserved + 301 illegal`
> 本轮口径: 本批次只执行全部状态机的final cross-state naming / trigger / reserved / propagation / test audit、historical-material隔离、正式§9回填草稿与Step 11~16 handoff；不新增状态、transition callable、Port、protocol或flow,不修改正式`03-详细设计.md`,不直接进入Step 11,不定义DDL / exact错误码 / concurrency algorithm / 配置 / 测试结果 / implementation artifact。

---

## 0. Step 10 开工确认

| 项 | 内容 |
|---|---|
| 当前文档 | `03-详细设计.md` |
| 当前 Step | Step 10 `定义状态机与转换矩阵` |
| 用户确认 | 用户已回复“同意”,允许从已完成的Step 9进入Step 10；本轮只推进batch `10.0` |
| 上一恢复点 | `03_step_09_completed_wait_user_review`;Step 9已完成83 / 83独立flow及最终cross-flow审计 |
| 本批次输出 | 本文件§0~§13；Step 6受控回开`CH-DDD-S10-GOVERNANCE-SEAM-REPLACED-001`；两份执行台账 |
| 正式文档写入 | 不写入；正式`03-详细设计.md`仍由Step 19统一装配 |
| 实现产物 | 不创建implementation ledger、planned boundary skeleton、源码、migration、commit或run |
| 停审方式 | batch `10.0`完成后停审；未经再次确认不得进入`10.1`或写第一张具体矩阵 |
| 参考粒度 | `projects/L1-governance/design-calibration/03_ddd_step_10_state_matrix.md`;`projects/L1-artifact/design-calibration/03_ddd_step_10_state_matrix.md` |

### 0.1 Batch `10.1` 进入确认

| 项 | 内容 |
|---|---|
| 用户确认 | 用户已回复“同意”,允许从已停审的batch `10.0`进入`10.1` |
| 本批次输入 | 本文件§5~§13；Step 6 §7.8.1、§8.2~§8.8、§15.1；Step 8 §7.12.1~§7.12.8；Step 9 §13~§16,并补读descriptor bind与四条exposure flow对registry的actual mutation；正式`02` §9 |
| 本批次输出 | 本文件§14~§18；Step 6 / 8 / 9受控回开同步；两份执行台账 |
| 正式文档写入 | 不写入；正式`03-详细设计.md`仍由Step 19统一装配 |
| 实现产物 | 不创建implementation ledger、planned boundary skeleton、源码、migration、commit或run |
| 停审方式 | 三个状态机与batch审计完成后停审；未经再次确认不得进入`10.2` |

### 0.2 Batch `10.2` 进入确认

| 项 | 内容 |
|---|---|
| 用户确认 | 用户已回复“同意”,允许从已停审的batch `10.1`进入`10.2` |
| 本批次输入 | 本文件§12第二行及§14~§18；Step 6 §7.8.1 / §9 / §15.1 / §20.15~§20.17；Step 7 governance / method current repositories；Step 8 §7.13.1~§7.13.9；Step 9 §17~§18；正式`02` §9 |
| 本批次输出 | 本文件§19~§26；Step 6 / 7 / 8 / 9受控回开同步；两份执行台账 |
| 正式文档写入 | 不写入；正式`03-详细设计.md`仍由Step 19统一装配 |
| 实现产物 | 不创建implementation ledger、planned boundary skeleton、源码、migration、commit或run |
| 停审方式 | 五个状态机与batch审计完成后停审；未经再次确认不得进入`10.3` |

### 0.3 Batch `10.3` 进入确认

| 项 | 内容 |
|---|---|
| 用户确认 | 用户在batch `10.2`停审后回复“继续”,允许进入`10.3` |
| 本批次输入 | 本文件§12第三行及§19~§26；Step 6 §7.9 / §7.10.3 / §10 / §20.18；Step 7 matching repositories / UoW；Step 8 §7.6 / §7.14.1~§7.14.6及downstream Consumer；Step 9 §19.1~§19.6 / §29.3；正式`02` §9~§10 |
| 本批次输出 | 本文件§27~§34；Step 6 / 8 / 9受控回开同步；两份执行台账 |
| 正式文档写入 | 不写入；正式`03-详细设计.md`仍由Step 19统一装配 |
| 实现产物 | 不创建implementation ledger、planned boundary skeleton、源码、migration、commit或run |
| 停审方式 | 五个状态机与batch审计完成后停审；未经再次确认不得进入`10.4` |

### 0.4 Batch `10.4` 进入确认

| 项 | 内容 |
|---|---|
| 用户确认 | 用户在batch `10.3`停审后回复“同意”,允许进入`10.4` |
| 本批次输入 | 本文件§12第四行及§27~§34；Step 6 §7.9 / §7.10.2 / §10.5~§10.6 / §11.2~§11.6 / §15.1；Step 7 controlled-view / derived-material / reconciliation repositories与UoW；Step 8 §11.6 / §11.8.2~§11.8.6；Step 9 §13.2 / §36.1~§36.6及reference-driven stale propagation；正式`02` §9~§10 |
| 本批次输出 | 本文件§35~§42；Step 6 / 8 / 9受控回开同步；两份执行台账 |
| 正式文档写入 | 不写入；正式`03-详细设计.md`仍由Step 19统一装配 |
| 实现产物 | 不创建implementation ledger、planned boundary skeleton、源码、migration、commit或run |
| 停审方式 | 四张mutable矩阵、immutable report formation audit与batch审计完成后停审；未经再次确认不得进入`10.5` |

### 0.5 Batch `10.5` 进入确认

| 项 | 内容 |
|---|---|
| 用户确认 | 用户在batch `10.4`停审后回复“同意”,允许进入`10.5` |
| 本批次输入 | 本文件§12第五行及§35~§42；Step 6 §7.9 / §7.10.4~§7.10.5 / §8.5 / §9.4 / §9.9 / §9.12 / §11.7~§11.13 / §15.2；Step 7 canonical-state / reference repositories与8类typed resolver Port；Step 8 reference Commands / Consumers / Queries / outbound event / Job；Step 9 all registration / re-observation / Query / Inbound / outbound / refresh flows；正式`02` §9~§10 |
| 本批次输出 | 本文件§43~§53；Step 8 / 9受控回开`CH-DDD-S10-REFERENCE-SAME-VALUE-COMMAND-001`；两份执行台账 |
| 正式文档写入 | 不写入；正式`03-详细设计.md`仍由Step 19统一装配 |
| 实现产物 | 不创建implementation ledger、planned boundary skeleton、源码、migration、commit或run |
| 停审方式 | canonical owner、8张kind-specific矩阵与cross-kind审计完成后停审；未经再次确认不得进入`10.6` |

### 0.6 Batch `10.6` 进入确认

| 项 | 内容 |
|---|---|
| 用户确认 | 用户在batch `10.5`停审后回复“同意”并再次回复“继续”,允许进入`10.6` |
| 本批次输入 | 本文件§12第六行及§43~§53；Step 6 `CapabilityEventCaptureState`、immutable payload snapshot、versioned capture与collaboration carriers；Step 7 event-capture repository、external collaboration Port与application facade；Step 8 §10.4~§10.8及§11.8.8；Step 9十条Outbound flow、source continuation与§38.2 repair Job；正式`02` §9~§10 |
| 本批次输出 | 本文件§54~§58；Step 7 / 8 / 9受控回开`CH-DDD-S10-EVENT-CAPTURE-TRACE-OWNERSHIP-001`；`03_ddd_calibration_flow.md`与`project_execution_ledger.md`恢复点同步 |
| 正式文档写入 | 不写入；正式`03-详细设计.md`仍由Step 19统一装配 |
| 实现产物 | 不创建implementation ledger、planned boundary skeleton、源码、migration、commit或run |
| 停审方式 | local capture矩阵、external Port-owned边界矩阵与cross-owner审计完成后停审；未经再次确认不得进入`10.7` |

### 0.7 Batch `10.7` 进入确认

| 项 | 内容 |
|---|---|
| 用户确认 | 用户在batch `10.6`停审后回复“同意”,允许进入`10.7` |
| 本批次输入 | 本文件§12第七行及§54~§58；Step 6 `CapabilityIdempotencyRecord` / `CapabilityJobExecutionRecord` / target outcome exact对象契约；Step 7 idempotency / typed stored-result / Job execution repositories与UoW；Step 8 shared write replay、Job journal assembler与final linkage；Step 9 Command / Consumer / Job reservation-replay、per-target与finalize flow；正式`02` §9~§10 |
| 本批次输出 | 本文件§59~§64；`03_ddd_calibration_flow.md`与`project_execution_ledger.md`恢复点同步 |
| 关键裁决 | Step 13 controlled reopen后的active state只有`Reserved -> Completed`；mismatch / reserve race返回typed conflict或winner classification且不改原reservation。旧`Reserved -> Conflict`、reason field与callable已删除 |
| 正式文档写入 | 不写入；正式`03-详细设计.md`仍由Step 19统一装配 |
| 实现产物 | 不创建implementation ledger、planned boundary skeleton、源码、migration、commit或run |
| 停审方式 | 三张application technical矩阵与cross-state审计完成后停审；未经再次确认不得进入`10.8` |

### 0.8 Batch `10.8` 进入确认

| 项 | 内容 |
|---|---|
| 用户确认 | 用户在batch `10.7`停审后回复“同意”,允许进入`10.8` |
| 本批次输入 | 本文件§5~§64全部screening / inventory / matrix / pair arithmetic / controlled reopen / stop-review；Step 6 §15 state inventory与所有Step 10 reopen记录；Step 7 completion gate / 22 repository traits / 36 Ports；Step 8 cross-protocol closure；Step 9 §40~§42 final cross-flow audit；正式`00 / 01 / 02` owner边界；README、旧正式`03`及旧`05 / 06` historical material |
| 本批次输出 | 本文件§65~§73；final cross-state audit、historical audit、正式§9 assembly source、Step 11~16 handoff；`03_ddd_calibration_flow.md`与`project_execution_ledger.md`恢复点同步 |
| 正式文档写入 | 不写入；正式`03-详细设计.md`仍由Step 19统一装配 |
| 实现产物 | 不创建implementation ledger、planned boundary skeleton、源码、migration、commit或run |
| 停审方式 | Step 10完成后停在用户审查点；未经再次确认不得创建Step 11中间产物 |

---

## 1. Step 内批次状态表

| 批次 | 覆盖范围 | 当前状态 | 本批次完成条件 | 后续动作 |
|---|---|---|---|---|
| `10.0` | 开工、输入、SOP问题预答、主语筛选、状态族、exact inventory、模板、callable gate、受控回开、机械审计 | completed_with_step_13_sync | 22个local mutable state machine、1个external Port-owned state boundary、1个immutable report outcome分类闭合；24个state-like enum / 111个active variant与Step 8/9引用差集为0 | 已被后续批次承接 |
| `10.1` | identity / access review / registry | completed_wait_user_review | 3张状态集合、ASCII图、矩阵、非法转换表及逐机停审 | 已被`10.2`承接 |
| `10.2` | descriptor / risk summary / secret safe summary / governance seam / method relation | completed_wait_user_review | 5张状态矩阵；factory-only与reserved recovery分开；`Replaced` terminal闭合 | 已被`10.3`承接 |
| `10.3` | formal exposure / formal visibility / traceability / impact / downstream feedback | completed_wait_user_review | 5张状态矩阵；same-UoW visibility、typed applicability与append-revision边界闭合 | 已被`10.4`承接 |
| `10.4` | controlled consumer view / directory / audit export / ecosystem discovery + immutable reconciliation report formation | completed_wait_user_review | 4张derived-material矩阵 + immutable formation audit；typed Partial、stale / rebuild / no-op / no-truth-repair闭合 | 已被`10.5`承接 |
| `10.5` | canonical reference resolution | completed_wait_user_review | 1个canonical owner + 8张`ReferenceKind`子矩阵；initial subset、terminal、same-value reason revision闭合 | 已被`10.6`承接 |
| `10.6` | local event capture / external event collaboration | completed_wait_user_review | local `Captured -> IntentBound`矩阵与external Port-owned状态边界分离；2个local pair和20个external pair分别全分类 | 已被`10.7`承接 |
| `10.7` | idempotency / Job execution / Job target outcome | completed_wait_user_review | 3张application technical矩阵；stored replay、all-terminal finalize、target terminal闭合 | 已被`10.8`承接 |
| `10.8` | final cross-state audit / historical audit /正式§9回填草稿 / Step 11 handoff | completed_wait_user_review | naming / trigger / side-effect / test / reserved-state审计无unresolved conflict | Step 10完成；用户确认后进入Step 11 |

批次纪律:

- 每个批次先读取本文件约定的上游小节和对应Step 6 / 8 / 9 exact contracts,再逐状态机写入。
- 每个状态机必须独立输出状态集合、ASCII图、转换矩阵、非法转换处理和停审记录,不得用一张generic矩阵替代。
- 每个批次完成后更新本文件、`03_ddd_calibration_flow.md`和`project_execution_ledger.md`,然后停审。
- 后续批次发现actual flow缺callable时必须受控回开Step 6；不得在矩阵中用repository update、adapter conditional或私有helper冒充domain transition。

---

## 2. 本 Step 目标与非目标

### 2.1 本 Step 必须闭合

1. 哪些Step 6对象 / application helper是独立状态主语,哪些只是marker、ref、immutable record、result tag或外部truth。
2. 每个正式状态机的enum、全部variant、initial / formation state、terminal / degraded / no-op规则。
3. 每条允许迁移的exact Step 6 factory / member / policy callable与exact Step 9 triggering flow。
4. 每条迁移的前置条件、对象内字段副作用、application flow副作用和非法转换错误入口。
5. 跨状态传播属于same-UoW local、same-UoW actual stale、post-commit collaboration、async hint或no propagation中的哪一种。
6. 8类canonical reference共享owner但各自状态子集 / terminal / replacement边界不同,必须分别成矩阵。
7. 每个状态机独立停审,最终再做命名、触发、错误、测试、phase和historical-material审计。

### 2.2 本 Step 不定义

| 后移内容 | owner Step | 当前禁止事项 |
|---|---|---|
| table / collection / index / optimistic SQL / isolation / physical transaction order | Step 11 | 不把matrix row写成DDL或repository实现 |
| exact `DomainError` / `ApplicationError` enum variant、HTTP / event / Job mapping、retryability | Step 12 | 当前只绑定稳定错误类别入口,不伪造最终code |
| digest canonical codec、reserve race、same-intent duplicate、optimistic retry算法 | Step 13 | 不把same-state/no-op描述成已实现算法 |
| endpoint / topic / scheduler / credential / timeout / adapter product | Step 14 | 不把external collaboration状态变成本地broker状态 |
| metric / log / span / audit record字段 | Step 15 | 不把状态change record冒充真实audit evidence |
| executable test、test result、coverage或验收证据 | Step 16及后续`05/06` | 只写test cut,不得声称已运行 |
| implementation ledger / planned boundary skeleton | `07-实施计划.md`完成时 | 当前不得提前创建 |

---

## 3. 已读取输入与使用方式

| 输入 | 已读取范围 | 本批次用途 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 10 | 目标、输入、输出、11个问题、模板、进入下一步条件 | 固定主语筛选、状态族、逐机矩阵、非法转换、停审和最终审计要求 |
| `standards/document/详细设计书写规范.md` §5.9 | 状态集合、ASCII图、矩阵、非法转换格式 | 固定正式§9装配形态和state/callable同名门禁 |
| `standards/document/设计真相源闭环与可落码性标准.md` | state / callable / flow闭环 | matrix row没有Step 6 callable时禁止声明可实现 |
| 正式`02-概要设计.md` §9~§10 | 状态主线、传播关系、异常边界 | 作为概要方向；不能覆盖Step 6 exact callable和Step 9 actual flow |
| `02_hld_step_09_state_machine.md` | 8组状态族、允许/禁止迁移、传播关系 | 接收候选方向并识别哪些仍只是概要reserved direction |
| `03_ddd_step_06_object_contracts.md` §7.8~§7.9、§8~§12、§15、§20~§21 | 24个state-like enum、object factory/member/policy、controlled reopen基线 | state name、callable、field side effect和terminal rule的直接真相源 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` current baseline | repository、external collaboration、UoW、version source | 判断local owner、external owner和same-UoW参与者；不把repository当transition callable |
| `03_ddd_step_08_protocol_contracts.md` current baseline | 83 protocol intent、state effect、Job journal assembly | 确认哪些迁移是current protocol可达,哪些只是reserved |
| `03_ddd_step_09_function_flows.md` §40~§42及83 flow中的state calls | actual call、transaction、no-op、terminal和side effect | 每条current matrix row必须回指exact flow |
| `L1-governance` / `L1-artifact` Step 10 | 批次、模板、逐机停审和final audit粒度 | 只参考结构密度,不复制其他领域状态 |

读取结论:概要层给出状态方向,Step 6提供可编码callable,Step 9提供当前可达路径。三者冲突时不能由Step 10选边；必须记录并受控回开。旧正式`03`、README及restart前材料不参与state truth裁决。

---

## 4. SOP 问题预答

| SOP问题 | batch `10.0`结论 |
|---|---|
| 哪些对象、marker、helper或entry result是候选状态主语? | Step 6共24个名称后缀为`State / Status / Outcome / Value`的enum；另检查read marker、stored disposition、change kind和external owner状态。 |
| 哪些候选应排除? | immutable reconciliation report outcome、ephemeral read decision、protocol/result disposition、stored result kind、immutable snapshot/change/result shell、ref/id/value/policy/marker以及外围owner truth均排除；理由见§5。 |
| 当前仓有哪些正式状态机? | 22个local mutable state machine；另有1个external Port-owned collaboration boundary。`ReconciliationReportState`只有factory-selected immutable outcome。 |
| 如何分状态族? | business truth、safe-summary/reference support、read/visibility、trace/impact、projection/material、local handoff、application technical及external collaboration八类,见§6。 |
| 每个状态机归属哪里? | §7逐项列出Step 6 object、module、enum和batch owner。 |
| 状态集合是什么? | §7 inventory给出exact variant set；后续逐机章节不得增删同义状态。 |
| 哪些函数触发转换? | §8固定factory/member/policy入口；具体From/To与Step 9 flow在`10.1~10.7`逐行绑定。 |
| 前置条件、副作用和错误是什么? | 后续每行必须写owner / expected state / exact loaded prerequisite、object field delta、flow effect、propagation class和stable error category。 |
| 非法转换是否写审计? | domain method只返回错误且不产生mutation；rejected trace/audit/public mapping由Step 12 / 15闭合,不得由matrix假定已写。 |
| 单状态机如何停审? | 使用§9模板检查enum、callable、flow、terminal/no-op、propagation、illegal error和test cut。 |
| 全部状态机如何审计? | `10.8`做exact enum / trigger / state-name / cross-state atomicity / reserved / test / historical / fabrication审计。 |

---

## 5. 状态主语筛选

### 5.1 进入Step 10的主语

| 候选主语 | 来源对象 / 字段 | 是否进入 | 状态机性质 | 原因 |
|---|---|---|---|---|
| `CapabilityIdentityState` | `CapabilityIdentity.identity_state` | 是 | local business truth | 有factory和correction / retirement lifecycle,被Command flow实际修改 |
| `CapabilityAccessReviewFactState` | `CapabilityAccessReviewFact.state` | 是 | local versioned fact | draft / recorded / terminal history有exact member |
| `RegistryLifecycleState` | `CapabilityRegistryEntry.lifecycle_state` | 是 | local business truth | registry / descriptor / exposure flow均会推进,且有policy guard |
| `AdapterDescriptorState` | `AdapterDescriptor.descriptor_state` | 是 | local business truth | accept / unresolved / replacement有actual flow；retirement仅有callable、无current flow |
| `DescriptorRiskConstraintSummaryState` | `DescriptorRiskConstraintSummary.state` | 是 | local safe-summary state | factory formation及partial/unavailable/supersede有member；reverse recovery受callable gate限制 |
| `SecretHandlingSafeSummaryState` | `SecretHandlingSafeSummary.state` | 是 | local safe-summary state | factory formation及stale/unavailable/forbidden有member；repair不得复制secret truth |
| `GovernanceSeamState` | `GovernanceSeamRelation.seam_state` | 是 | local relation truth | attach / reactivate / expire / unresolved / replace / forbidden有flow；本批次补齐`Replaced` |
| `CapabilityMethodRelationState` | `CapabilityMethodBodyFreeRelation.relation_state` | 是 | local relation truth | active / stale / unresolved / removed / forbidden有exact member |
| `FormalExposureState` | `FormalExposureBoundary.exposure_state` | 是 | local business truth | pending / accept / activate / suspend / unavailable / retire均为current Command effect |
| `FormalVisibilityState` | `FormalVisibilityApplicability.visibility_state` | 是 | local derived domain fact | 与exposure source version和same-UoW传播绑定,不等于runtime authorization |
| `ConsumerViewFreshnessState` | `ControlledConsumerView.freshness_state` | 是 | local rebuildable view | stale / rebuilding / ready / partial / unavailable由Command propagation或Job推进 |
| `TraceabilityState` | `CapabilityAccessTraceabilityRecord.traceability_state` | 是 | local append-revision trace | record / partial / handoff pending / superseded有revision语义 |
| `CapabilityImpactState` | `CapabilityChangeImpactFact.impact_state` | 是 | local impact fact | identified / partial / delayed / ignored / resolved有actual member |
| `DownstreamImpactSummaryState` | `DownstreamConsumptionImpactSummary.feedback_state` | 是 | local versioned safe feedback | factory可形成closed state且existing summary有partial/delayed/unavailable/ignored member；不是immutable report |
| `DirectoryProjectionState` | `DirectorySearchBrowseProjection.freshness_state` | 是 | local rebuildable material | stale / rebuilding / ready / unavailable有current Job / propagation path |
| `AuditExportState` | `AuditFriendlyExportSummary.export_state` | 是 | local rebuildable material | ready / partial / stale / unavailable有current Job / propagation path |
| `EcosystemDiscoveryState` | `ReadOnlyEcosystemDiscoverySummary.freshness_state` | 是 | local rebuildable material | ready / partial / stale / unavailable有current Job / propagation path |
| `ReferenceResolutionValue` | `ReferenceResolutionState.resolution_value` | 是 | local canonical reference truth | 单一owner,但8个`ReferenceKind`的initial subset / Expired / terminal边界不同 |
| `CapabilityEventCaptureState` | `CapabilityEventCaptureRecord.capture_state` | 是 | local technical handoff | 唯一本地迁移`Captured -> IntentBound`,不复制external delivery status |
| `CapabilityIdempotencyState` | `CapabilityIdempotencyRecord.state` | 是 | local application technical | reserve / complete / conflict控制stored replay,所有write channel共享 |
| `CapabilityJobExecutionState` | `CapabilityJobExecutionRecord.execution_state` | 是 | local application technical journal | `Planned -> Finalized`受all-target-terminal和same result ref约束 |
| `CapabilityJobExecutionTargetOutcome` | `CapabilityJobExecutionTarget.outcome` | 是 | local application technical target | `Planned -> Succeeded / Failed / Skipped`,terminal outcome不可改写 |
| `EventCollaborationStatus` | `CapabilityEventCollaborationOutcome.status`经Step 7 external Port返回 | 是,但仅边界矩阵 | external Port-owned state | Step 10只固定本仓可观察 / 可调用边界,不得本地持久化或私自推进 |

### 5.2 不进入可变状态矩阵的候选

| 候选 | 分类 | 不进入原因 | 仍需记录的约束 |
|---|---|---|---|
| `ReconciliationReportState` | immutable per-report outcome | `CapabilityReconciliationReport`由`from_findings(...)`或`failed(...)`一次形成,创建后immutable；new run创建new report id | `10.4`记录factory outcome与derived no-truth-repair关系,但不伪造From/To |
| `CapabilityReadVisibilityMarker` / `CapabilityReadVisibilityDecision` | ephemeral query decision | 每次request reevaluate,无独立persisted lifecycle | Query no-write；visible/degraded/not-visible只影响response surface |
| Command / Inbound / Job disposition和stored-result disposition | protocol/result classification | 是一次处理结果tag,不是对象生命周期 | Step 12绑定错误 / public mapping；Step 13绑定stored replay |
| `StoredCapabilityResultKind` | immutable type tag | shell形成时固定,无转换 | kind / channel / surface pairing必须保持 |
| `CapabilityEventPayloadSnapshot` | immutable technical record | `freeze(...)`后不可update / replace | 与source + capture same-UoW；不建payload lifecycle |
| change record、reconciliation report、stored result shell | immutable / append-only record | 新变化创建新record,不原地迁移 | exact previous / next snapshot与source truth对称 |
| typed ref、id、set、reason、scope、digest、policy、marker、change kind | value / classification | 无独立owner lifecycle | 可作为guard或副作用输入,不能升级为state owner |
| handler result、repository reserve result、stored lookup result | entry / adapter result | 调用期分类,不是持久化truth | 只在flow分支 / replay算法使用 |
| runtime execution、tools execution、provider availability | external owner truth | 不归capability-hub | 只允许body-free consumer / reference / handoff边界 |
| governance approval / Policy / shared_rules lifecycle | `L1-governance` owner | seam只保存ref + safe summary,不能复制approval state | `GovernanceSeamState::Active`不等于Approved |
| method-library asset lifecycle / body | `L3-method-library` owner | relation只保存body-free ref / scope | relation Active不等于asset publication state |
| SDK package/client/cache lifecycle | SDK owner | 本仓只拥有server exposure / consumer ref | FormalVisible / Visible不表示SDK package已发布 |
| marketplace listing / transaction lifecycle | ecosystem owner | discovery summary是read-only derived material | `EcosystemDiscoveryState::Ready`不形成listing truth |
| secret-store / KMS / Vault lifecycle | secret owner | 本仓只保存secret ref和safe summary | safe summary Available不表示secret access成功 |

筛选结论:

```text
Step 6 state-like enums = 24
local mutable state machines = 22
external Port-owned state boundary = 1
immutable per-report outcome enum = 1
global CapabilityStatus = forbidden
```

---

## 6. 状态族分组

| 状态族 | local state machine | external / immutable companion | owner边界 |
|---|---|---|---|
| business truth lifecycle | identity、access review、registry、descriptor、governance seam、method relation、formal exposure | governance / method external truth只作ref | 本仓只改变capability access truth,不改变approval、method body或runtime truth |
| safe-summary / reference support | descriptor risk summary、secret handling safe summary、canonical reference resolution | 8类external resolver observation | safe body / canonical local state可持久化；external body / owner lifecycle不可持久化 |
| read / visibility | formal visibility、controlled consumer view | ephemeral read visibility decision | formal visibility是server fact；view是derived snapshot；query decision不写 |
| trace / impact | traceability、impact、downstream feedback summary | downstream owner只给body-free feedback | downstream failure不得回滚source truth |
| projection / material | directory、audit export、ecosystem discovery | immutable reconciliation report outcome | material可stale/rebuild,不得反写core truth或形成evidence/listing |
| local handoff | event capture | external `EventCollaborationStatus` | local只拥有Captured/IntentBound；delivery状态归Port seam |
| application technical | idempotency、Job execution、Job target outcome | stored result / typed report immutable surface | 控制replay / reentry,不升级为business truth或scheduler state |

跨族隔离红线:

- 不把registry `FormalVisible`、formal visibility `Visible`、exposure `Active`和runtime allow / execution success合并为一个状态。
- 不把local capture `IntentBound`与external collaboration `Delivered`合并；前者只证明stable intent ref已本地绑定。
- 不把reference `Resolved`与governance approved、method published、secret accessible、provider healthy、SDK available或audit accepted等外围事实合并。
- 不把derived `Ready`当作core truth前置,也不让reconciliation report直接修复truth。
- 不把idempotency `Completed`或Job `Finalized`当作业务对象状态；它们只证明stored public result已完成绑定。

---

## 7. Exact 状态机 Inventory 与批次归属

| Batch | 状态机 / owner object | Step 6 enum与exact state set | module / state family | Step 6 callable候选 / external Port | 后续矩阵口径 |
|---|---|---|---|---|---|
| `10.1` | `CapabilityIdentity` | `CapabilityIdentityState::{Candidate, Active, CorrectionPending, Retired, Unresolved}` | `domain::identity` / truth | `create_from_intake`;`activate`;`request_correction`;`complete_correction`;`retire` | same-state `attach_review_fact`另列mutation/no-state-change；Retired terminal |
| `10.1` | `CapabilityAccessReviewFact` | `CapabilityAccessReviewFactState::{Draft, Recorded, Superseded, Invalidated}` | `domain::identity` / fact | `draft`;`record`;`supersede`;`invalidate` | Superseded / Invalidated terminal；current Step 9 reaches new Draft -> Recorded and optional old Recorded -> Superseded；invalidation reserved |
| `10.1` | `CapabilityRegistryEntry` | `RegistryLifecycleState::{Draft, Registered, Undescribed, Ungoverned, VisibilityPending, FormalVisible, Retired}` | `domain::registry` / truth | `register`;`bind_descriptor`;`transition_lifecycle`;`apply_visibility_basis`;`retire` | same-state target不调用transition；FormalVisible authority限exposure service；Retired terminal |
| `10.2` | `AdapterDescriptor` | `AdapterDescriptorState::{Draft, Accepted, Unresolved, Replaced, Retired}` | `domain::descriptor` / truth | `draft_for_entry`;`accept`;`mark_unresolved`;`replace_with`;`retire` | Replaced / Retired terminal；retirement仅`Draft / Accepted / Unresolved -> Retired`且无current flow；attachments是same-state mutation |
| `10.2` | `DescriptorRiskConstraintSummary` | `DescriptorRiskConstraintSummaryState::{Available, Partial, Unavailable, Superseded}` | `domain::descriptor` / safe summary | `derive`;`mark_partial`;`mark_unavailable`;`supersede` | no current in-place recovery-to-Available callable；不得从HLD方向发明row |
| `10.2` | `SecretHandlingSafeSummary` | `SecretHandlingSafeSummaryState::{Available, Stale, Unavailable, Forbidden}` | `domain::descriptor` / safe summary | `create`;`mark_stale`;`mark_unavailable`;`forbid` | no current in-place refresh-to-Available callable；Forbidden current-candidate terminal |
| `10.2` | `GovernanceSeamRelation` | `GovernanceSeamState::{Pending, Active, Unresolved, Expired, Replaced, Forbidden}` | `domain::governance_method` / relation truth | `create`;`activate`;`mark_unresolved`;`mark_expired`;`replace_with`;`forbid` | `Replaced`由本批次受控回开补齐并terminal；replacement必须先distinct Active |
| `10.2` | `CapabilityMethodBodyFreeRelation` | `CapabilityMethodRelationState::{Pending, Active, Stale, Removed, Unresolved, Forbidden}` | `domain::governance_method` / relation truth | `create`;`activate`;`mark_stale`;`mark_unresolved`;`remove`;`forbid` | Removed / Forbidden terminal；no method body/lifecycle |
| `10.3` | `FormalExposureBoundary` | `FormalExposureState::{Draft, Pending, Accepted, Active, Suspended, Unavailable, Retired}` | `domain::exposure` / truth | `draft`;`mark_pending`;`accept`;`activate`;`suspend`;`mark_unavailable`;`retire` | activation requiresfinal Visible fact；Retired terminal；consumer不能触发mutation |
| `10.3` | `FormalVisibilityApplicability` | `FormalVisibilityState::{NotVisible, Pending, Visible, Unavailable, Retired}` | `domain::exposure` / visibility fact | `derive`;`reevaluate`;`mark_pending`;`mark_unavailable`;`retire` | source exposure version必须等于final exposure revision；Retired terminal |
| `10.3` | `CapabilityAccessTraceabilityRecord` | `TraceabilityState::{Recorded, Partial, HandoffPending, Superseded}` | `domain::trace_impact` / trace | `record_for_changes`;`mark_partial`;`request_handoff`;`mark_recorded`;`supersede` | versioned append-revision；Superseded historical terminal；post-commit handoff不回滚truth |
| `10.3` | `CapabilityChangeImpactFact` | `CapabilityImpactState::{Identified, Partial, Delayed, Ignored, Resolved}` | `domain::trace_impact` / impact | `derive_from_traceability`;`mark_partial`;`mark_delayed`;`mark_ignored`;`resolve` | Ignored / Resolved terminal for current scope；feedback不能修改source truth |
| `10.3` | `DownstreamConsumptionImpactSummary` | `DownstreamImpactSummaryState::{Received, Partial, Delayed, Unavailable, Ignored}` | `domain::trace_impact` / safe feedback | `from_consumer_feedback`;`from_reported_state`;`mark_partial`;`mark_delayed`;`mark_unavailable`;`mark_ignored` | factory-selected initial state与in-place member分开；Ignored terminal |
| `10.4` | `ControlledConsumerView` | `ConsumerViewFreshnessState::{Ready, Stale, Rebuilding, Unavailable, Partial}` | `domain::exposure` / view | `build`;`refresh_from_exposure`;`mark_stale`;`mark_rebuilding`;`mark_unavailable` | any non-stale -> stale on newer truth；already-stale no-op；Query no-write |
| `10.4` | `DirectorySearchBrowseProjection` | `DirectoryProjectionState::{Ready, Stale, Rebuilding, Unavailable}` | `domain::derived_material` / projection | `build_from_access_truth`;`refresh_from_access_truth`;`mark_stale`;`mark_rebuilding`;`mark_unavailable` | Job / propagation only；Unchanged不造revision；no truth repair |
| `10.4` | `AuditFriendlyExportSummary` | `AuditExportState::{Ready, Partial, Unavailable, Stale}` | `domain::derived_material` / export | `build_from_traceability`;`refresh_from_traceability`;`mark_partial`;`mark_stale`;`mark_unavailable` | exact no-op check先于refresh；不得形成evidence / sign-off |
| `10.4` | `ReadOnlyEcosystemDiscoverySummary` | `EcosystemDiscoveryState::{Ready, Partial, Stale, Unavailable}` | `domain::derived_material` / discovery | `build_read_only_summary`;`refresh_from_exposure`;`mark_partial`;`mark_stale`;`mark_unavailable` | final Job outcome只Ready/Partial/Unavailable；Stale只由source propagation形成 |
| `10.4` companion | `CapabilityReconciliationReport` | `ReconciliationReportState::{Completed, Partial, Inconsistent, RebuildRequired, Failed}` | `domain::derived_material` / immutable report | `from_findings`;`failed` | 只写formation table,不写fake transition matrix |
| `10.5` | `ReferenceResolutionState` | `ReferenceResolutionValue::{Resolved, Unresolved, Stale, Invalid, Unavailable, Forbidden, Expired}` | `domain::reference_resolution` / canonical reference | `from_initial_resolution`;`resolved`;`unresolved`;`transition`;`mark_forbidden`;policy `validate_transition` | 按8个kind各写子矩阵；Invalid / Forbidden current candidate terminal；same value + changed reason是revision |
| `10.5-a` | external capability source kind | allowed subset不含`Expired` | canonical reference submatrix | source registration / replacement / refresh flows | 不吸收provider health / invocation状态 |
| `10.5-b` | governance result kind | 7态,允许`Expired` | canonical reference submatrix | governance Command / Consumer / refresh Job | 不吸收approval / Policy lifecycle |
| `10.5-c` | method asset kind | allowed subset不含`Expired` | canonical reference submatrix | method Command / Consumer / refresh Job | 不吸收asset publication lifecycle |
| `10.5-d` | secret kind | allowed subset不含`Expired` | canonical reference submatrix | descriptor secret Command / refresh Job | 不吸收KMS / Vault lifecycle |
| `10.5-e` | external document kind | allowed subset不含`Expired` | canonical reference submatrix | document Command / audit-document Consumer / refresh Job | 不吸收document content/version truth |
| `10.5-f` | runtime/tools consumer kind | allowed subset不含`Expired` | canonical reference submatrix | consumer-ref Command / refresh Job | 不吸收execution / tools result |
| `10.5-g` | SDK consumer kind | allowed subset不含`Expired` | canonical reference submatrix | SDK-ref Command / refresh Job | 不吸收SDK package/client state |
| `10.5-h` | observability/audit kind | allowed subset不含`Expired` | canonical reference submatrix | audit-ref Command / Consumer / refresh Job | 不吸收log / trace / evidence lifecycle |
| `10.6` | `CapabilityEventCaptureRecord` | `CapabilityEventCaptureState::{Captured, IntentBound}` | `application` / local handoff | `capture`;`bind_intent` | local terminal只表示intent bound；same intent duplicate算法后移Step 13 |
| `10.6` boundary | `CapabilityAccessEventCollaborationPort` outcome | `EventCollaborationStatus::{Candidate, PendingDelivery, Delivered, Failed, HandoffUnavailable}` | external collaboration owner | `collaborate`;`get`;`list`;`repair`及application facade | 写boundary matrix而非local persisted matrix；Delivered不回写capture为delivery state |
| `10.7` | `CapabilityIdempotencyRecord` | `CapabilityIdempotencyState::{Reserved, Completed}` | `application` / replay | `reserve`;`complete` | Completed terminal；same-key mismatch不改Reserved / Completed winner |
| `10.7` | `CapabilityJobExecutionRecord` | `CapabilityJobExecutionState::{Planned, Finalized}` | `application` / Job journal | `plan`;`finalize` | all targets terminal + stored response/result ref same final UoW；Finalized terminal |
| `10.7` | `CapabilityJobExecutionTarget` | `CapabilityJobExecutionTargetOutcome::{Planned, Succeeded(_), Failed(_), Skipped(_)}` | `application` / Job target journal | target `planned`;record `record_succeeded / record_failed / record_skipped` | terminal outcome immutable；Unchanged是Succeeded item,不是Skipped |

Inventory closure:

- 22个local mutable state machine均有唯一Step 6 owner object与state field。
- 1个external collaboration boundary只通过Step 7 Port观察 / 请求,不新增本地owner。
- 1个immutable reconciliation outcome只绑定factory,不伪造transition callable。
- canonical reference只有一个local owner / repository,8张子矩阵只是kind-specific policy约束,不是8份重复state truth。

---

## 8. Transition-callable 与受控重开门禁

### 8.1 每条矩阵行的准入条件

后续`10.1~10.7`每一条允许迁移必须同时满足:

1. From / To均是§7所列exact enum variant。
2. 有Step 6 existing factory/member,或external boundary行有Step 7 exact Port callable。
3. 有Step 9 actual flow；若没有,必须标为`reserved_not_callable_in_current_boundary`,不得写成当前可实现行。
4. 前置条件能从DTO、`Loaded<T>`、policy、resolver observation、stored snapshot / journal或同UoW新对象取得,不得读取私有adapter state。
5. object field delta与version规则确定；same-state field mutation和state transition分开表达。
6. flow side effect能回指Step 7 repository / UoW / capture / collaboration,且不拆分Step 9 atomic set。
7. illegal path不保存state/change/capture/material/result；exact public mapping后移Step 12。

### 8.2 Callable 分类

| 分类 | 可否进入allowed matrix | 写法 |
|---|---|---|
| current factory formation | 是,但From写`factory` | 写factory signature、formation guard、initial state及same-UoW create effect |
| current member transition | 是 | 写完整member signature / Step 6回指、exact Step 9 flow、From / To |
| current same-state mutation | 单独写,不得伪装迁移 | From = To并注明field/version delta；若无delta则不是accepted mutation |
| application no-op guard | 不写作transition | 写在state / illegal table：不调用member、不save、不append、不capture |
| policy-derived target | 不能单独改state | policy只决定target；仍必须由owner member执行 |
| repository-only update | 禁止 | 必须回开Step 6,不能用SQL / adapter conditional替代 |
| HLD direction但无callable / current flow | 只能reserved | 明确`reserved_not_callable_in_current_boundary`；不得给实现者承诺 |
| external Port-owned state | 只写boundary matrix | 不新增local enum / repository / mutation member |

### 8.3 Pre-entry callable watchpoints

| Watchpoint | 现状 | `10.0`裁决 | 后续要求 |
|---|---|---|---|
| descriptor risk summary recovery to`Available` | Step 6有`derive / mark_partial / mark_unavailable / supersede`,没有existing summary恢复Available callable；current Step 9只形成new summary或降级 / supersede | not blocking；reverse HLD direction不得作为current row | `10.2`写factory-selected Available及现有降级行；恢复方向标reserved,除非actual flow证明必须回开 |
| secret safe summary stale/unavailable recovery to`Available` | Step 6有`create / mark_stale / mark_unavailable / forbid`,没有refresh member；current flow不要求existing summary原地恢复 | not blocking；不得发明`refresh` | `10.2`只写current callable；新candidate可通过new summary factory形成Available |
| immutable reconciliation outcome | HLD曾出现`Inconsistent -> RebuildRequired`方向,但Step 6 report明确immutable | 以Step 6 + Step 9为准；不写transition | `10.4`写formation / follow-up hint表,新run创建new report |
| reference same-state re-observation | `transition(...)`允许value相同但reason变化,两者都相同则no-op rejection | current callable已闭合 | `10.5`逐kind都写reason-delta revision和exact no-op |
| derived already-stale propagation | member可mark stale,但Step 9先检查already-stale | application no-op,不是Stale -> Stale transition | `10.4`不得为already-stale增version / capture |
| capture same-intent duplicate | `bind_intent`契约允许same intent no-op或Step 13收紧 | state direction已闭合,算法未闭合 | `10.6`写不同intent conflict和no fake second state；exact duplicate算法交Step 13 |

### 8.4 Controlled reopen `CH-DDD-S10-GOVERNANCE-SEAM-REPLACED-001`

#### 冲突证据

| 来源 | 冲突前内容 |
|---|---|
| Step 6 enum | `GovernanceSeamState`只有`Pending / Active / Unresolved / Expired / Forbidden` |
| Step 6 callable | existing `GovernanceSeamRelation::replace_with(...)`说明old relation historical,但没有合法next state |
| Step 6 change kind | `GovernanceSeamChangeKind::Replaced`存在,但change classification不能代替current state |
| Step 8 `ReplaceGovernanceSeamRelation` | 要求new relation先独立`Active`,再调用old `replace_with(...)`,accepted result保留new / old refs |
| Step 9 `command_replace_governance_seam_relation_flow` | ASCII图和pseudocode实际使用old `GovernanceSeamState::Replaced`,并以`Replaced / Forbidden`拒绝再次替换 |
| 正式`02-概要设计.md` §9 | 列出replacement Command和seam受控状态方向,但状态定义摘要未单列replacement后的historical terminal名；同时明确详细设计继续展开enum / guard |

若不修正,实现者只能在`Active`上伪造`Replaced` change record、把`Forbidden`误作historical state、用私有字符串保存状态或拒绝实现已接受flow,均违反truth-source closure。

#### 最小修正

| 修正 | 当前exact contract |
|---|---|
| enum | existing `GovernanceSeamState`新增`Replaced`,英文Rustdoc为“A distinct active relation replaced this relation, which remains historical.” |
| allowed source | `Pending / Active / Unresolved / Expired` old relation,且application已证明different replacement relation独立进入`Active` |
| target / terminal | old relation进入`Replaced`,version +1；之后不得activate、unresolve、expire、forbid或再次replace |
| record symmetry | existing `replace_with(...)`返回`GovernanceSeamChangeKind::Replaced`,record next state与saved old relation均为`Replaced` |
| unchanged boundary | replacement object、owner、repository、change kind、trace / capture / material / UoW、83 protocol和83 flow不变 |

同步结果:

- Step 6 §7.8 enum code block、§7.8.1 variant table、§9.8 member/invariant、§15.1 state audit和§20.15 reopen说明已更新。
- Step 8 / Step 9已经使用修正后的exact语义,无需为“同步”重复改写内容。
- 正式`02`的replacement能力与详细设计承接边界未改变；`Replaced`只补齐old relation的historical terminal,不新增业务能力、owner或概要主线,因此不回改已完成的正式`02`。
- 新增的是1个public enum variant,已提供英文`///`;没有新增struct、field、variant payload或callable。
- 43个HLD objects + 7个application technical helpers、36个Port、83个protocol、83个flow均不变。

状态: `resolved_during_03_step_10_batch_10_0`。当前unresolved upstream blocker为`0`。

---

## 9. 单状态机写入模板

后续每个状态机使用同一结构,但内容必须独立推导,不得复制generic占位。

### 9.1 状态集合与ASCII图

```text
[StateMachineName]
  factory -> StateA
  StateA -> StateB -> TerminalState
  StateA -> DegradedState
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 | 不得解释为 |
|---|---|---|---|---|

### 9.2 状态转换矩阵

| From | To | Step 6触发函数 | Step 9 flow | exact前置条件 | 对象字段 / version副作用 | Flow副作用 / propagation class | 非法时错误类别 |
|---|---|---|---|---|---|---|---|

矩阵中的propagation class只允许:

| Class | 含义 |
|---|---|
| `same_uow_local_required` | source state与另一本地fact / history / snapshot必须同一UoW |
| `same_uow_actual_stale` | 只对实际non-stale material形成revision / capture；already-stale no-op |
| `post_commit_body_free_collaboration` | local result先commit,外部调用失败不回滚truth |
| `async_follow_up_hint_only` | 只形成typed hint / report,不在当前flow执行第二状态机mutation |
| `explicit_no_propagation` | 不触发其他state owner |

### 9.3 非法转换与no-op处理

| 场景 | 检测位置 | 对象是否改变 | history / capture / material | 稳定错误入口 | Step 12待闭合 |
|---|---|---|---|---|---|

统一规则:

- domain invalid transition不得修改对象字段、version或time。
- application same-state no-op若Step 9已定义为stable rejection / Unchanged,不得调用member、save repository、append record、capture event或mark material。
- expected-version conflict不属于domain state direction错误,由Step 11 / 13闭合；但当前矩阵必须注明update existing使用`Loaded.expected_version`。
- terminal state重新处理必须创建new truth / relation / summary / report或走正式replacement,不得原地恢复。
- exact error enum variant由Step 12定义；当前只使用`DomainError::InvalidStateTransition`、boundary / invariant / policy-rejected等稳定类别入口,不得伪造最终code。

### 9.4 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / variant与Step 6 exact一致 |  |  |
| initial / formation state有factory |  |  |
| 每条current transition有member / Port callable |  |  |
| 每条current transition回指exact Step 9 flow |  |  |
| same-state mutation / no-op分离 |  |  |
| terminal / degraded / reserved方向明确 |  |  |
| state field / version / time副作用明确 |  |  |
| cross-state propagation class明确 |  |  |
| illegal path无fake history / capture / result |  |  |
| query / external owner / no-truth-repair边界通过 |  |  |
| test cuts可由后续Step 16承接 |  |  |

---

## 10. 跨状态通用规则

| 规则 | 正式口径 |
|---|---|
| state name | 只使用Step 6 enum variant；正文小写口语不能成为第二套名称 |
| owner | 只有owner object member可改变local state；policy、repository、adapter、query、change record不能替代owner mutation |
| formation | factory可直接形成多个合法initial outcome,但必须按输入guard逐项写；factory outcome不等于existing object transition |
| version | accepted existing-object field/state mutation才version +1；rejected / exact no-op不更新时间 |
| history | change record必须与最终persisted source revision的subject / next state对称；中间内存state不得冒充committed source |
| trace / capture | 只对Step 9指定的committed record / exact revision形成；illegal / no-op path为0 |
| material stale | 先collect + typed union,再对actual non-stale object各自expected version单次mark/save/capture |
| query | Query只读并形成ephemeral visibility decision,不得refresh / repair / append / reserve |
| inbound | Consumer只改变本地reference / feedback / receipt owner,不得直接改governance、method或runtime external truth |
| Job | Job只改derived/reference/local handoff/application journal,不得修core access truth |
| external collaboration | failed / unavailable不回滚committed local truth；external status不复制进local capture |
| terminal replacement | terminal current object只能通过new object / explicit replacement关系继续,不能原地复活 |
| reserved direction | 没有current callable或flow的概要方向必须显式reserved,不得由实现agent自行补method |

---

## 11. Batch `10.0` 机械审计

### 11.1 Enum / variant / usage 差集审计

审计方法:

1. 只从Step 6中名称以`State / Status / Outcome / Value`结尾的24个public enum建立类型白名单。
2. 按`${Type}::${Variant}`抽取定义,避免把不同enum中的`Active / Pending / Stale`合并。
3. 从Step 8 / Step 9抽取白名单类型的显式variant引用。
4. 比较used - defined；发现`GovernanceSeamState::Replaced`后先受控回开Step 6,再重跑。

| 机械项 | 修正后结果 | 结论 |
|---|---:|---|
| Step 6 state-like enum type | 24 | 与§5筛选全集一致 |
| exact `Type::Variant` definition | 111 | 含新增`GovernanceSeamState::Replaced`,并扣除Step 13删除的idempotency `Conflict`；同名variant不合并 |
| Step 10 inventory enum exact match | 24 / 24 | missing enum / variant、unknown enum / variant、duplicate enum均为0 |
| Step 8 / 9显式使用的白名单variant | 73 | protocol / flow实际引用集合 |
| used but undefined | 0 | pass after controlled reopen |
| local mutable state machine | 22 | 全部进入`10.1~10.7` |
| external Port-owned state boundary | 1 | 进入`10.6`,不新增local owner |
| immutable report outcome enum | 1 | 进入`10.4`formation companion,不写transition |

### 11.2 Callable / owner 审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| actual Step 8/9 transition引用缺enum variant | pass | governance seam修正后为0 |
| actual Step 8/9 state mutation缺Step 6 owner callable | pass for batch-entry inventory | 后续逐行仍必须复核完整signature和From guard |
| HLD recovery方向缺callable | identified_not_blocking | risk / secret safe-summary reverse recovery只标reserved,当前flow不调用 |
| repository-only transition | 0 accepted | inventory未把save / update当callable |
| external owner误入local state | 0 | collaboration只作Port boundary；runtime/governance/method/SDK/marketplace/secret owner均排除 |
| immutable outcome误写为state machine | 0 | reconciliation report明确factory-only |

### 11.3 Rustdoc / 结构注释审计

| 检查 | 结果 |
|---|---|
| 本批次新增public struct / struct field | 0 |
| 本批次新增public enum | 0 |
| 本批次新增enum variant | 1个`GovernanceSeamState::Replaced` |
| 新variant英文`///` | pass |
| variant payload / field-level `pub` | 无新增 |
| 新callable / trait / Port | 0 |
| 结构体 / 字段注释遗漏 | 未引入结构体或字段；existing基线保持完整 |

### 11.4 基线 / 边界 / 真实性审计

| 检查项 | 结果 |
|---|---|
| 43个HLD objects + 7个application technical helpers | unchanged |
| 36个application-owned Port | unchanged |
| 83 protocols / 83 flows | unchanged |
| runtime execution / tools execution合并进Hub | no |
| marketplace listing合并进discovery | no |
| governance approval / method body / secret body复制进state | no |
| 旧正式`03`或README作为state truth | no;historical material only |
| 正式`03-详细设计.md`修改 | no |
| implementation ledger / boundary skeleton创建 | no |
| implementation commit / run_id /测试结果 / evidence alias /验收签署 | no |
| 当前unresolved upstream blocker | 0；发现1项local upstream contract conflict并已受控关闭 |
| 当前需要提交 | no |

---

## 12. 后续批次读取门禁

| 下一批次 | 用户确认后必须先读 | 不得提前做 |
|---|---|---|
| `10.1` | 本文件§5~§11；Step 6 §7.8.1、§8.2~§8.8、§15.1；Step 8 §7.12.1~§7.12.8；Step 9 §13~§16；正式`02` §9 | 不写descriptor / relation矩阵,不进入`10.2` |
| `10.2` | 本文件§14~§18与`10.1`停审；Step 6 §9、§20.15~§20.16；Step 8/9 descriptor / safe-summary / relation flow | 不发明safe-summary recovery callable |
| `10.3` | `10.2`停审；Step 6 §10；Step 8/9 exposure / trace / impact / feedback flow | 不把handoff failure写成truth rollback |
| `10.4` | `10.3`停审；Step 6 view + §11.2~§11.5；Step 9 material Jobs / stale propagation | 不把immutable report写成mutable state |
| `10.5` | `10.4`停审；Step 6 §11.7~§11.13、§15.2；所有reference flow | 不用一张generic矩阵省略8类差异 |
| `10.6` | `10.5`停审；Step 6 capture、Step 7 collaboration Port、Step 9 outbound / repair flow | 不复制external delivery state到capture |
| `10.7` | `10.6`停审；Step 6 idempotency / Job journal、Step 8 journal assembler、Step 9 Job common flow | 不新增Running / lease / attempt / scheduler state |
| `10.8` | 全部逐机停审、正式`02` §9~§10、Step 9 final audit | 不直接进入Step 11或修改正式`03` |

---

## 13. Batch `10.0` 完成结论与停审

| Gate | 结果 |
|---|---|
| Step 9完成并获用户确认 | pass |
| SOP / 书写规范 /上游输入已读 | pass |
| 状态主语筛选完整 | pass；24个state-like enum全部分类 |
| 状态族与owner边界完整 | pass；22 local + 1 external + 1 immutable outcome |
| exact inventory与batch归属完整 | pass |
| transition-callable准入规则完整 | pass |
| actual enum引用差集 | pass after reopen；73 used / 0 missing |
| controlled reopen | pass；`CH-DDD-S10-GOVERNANCE-SEAM-REPLACED-001`已关闭 |
| Rustdoc / 结构注释门禁 | pass；新增variant有英文`///`,无结构体 / 字段遗漏 |
| 第一张具体矩阵是否提前写入 | no |
| 正式文档 / implementation artifact / commit | none |

```text
gate_status = 03_step_10_batch_10_0_completed_wait_user_review
completed_document = 03-详细设计.md
completed_step = Step 10 batch 10.0 state screening / inventory / callable gate
formal_document_written = false
unresolved_upstream_blocker = 0
next_allowed_action = start_03_step_10_batch_10_1_after_user_confirmation
commit_required = false
```

当前停在batch `10.0`。用户确认后只进入`10.1`,先读取§12第一行指定材料,再逐个完成identity、access review、registry三张矩阵；不得跨到`10.2`。

---

## 14. Batch `10.1` 输入复核与受控回开

### 14.1 Exact flow读取范围

本批次除读取§12规定的八条identity / review / registry Command flow外,为避免遗漏registry的跨服务owner写入,继续读取:

- `command_establish_adapter_descriptor_flow`与`command_replace_adapter_descriptor_flow`中的`bind_descriptor(...)`、unresolved -> `Undescribed`和same-state no-op分支。
- `command_establish_formal_exposure_boundary_flow`、`command_update_formal_visibility_applicability_flow`、`command_suspend_formal_exposure_boundary_flow`、`command_retire_formal_exposure_boundary_flow`中的policy-derived registry target与actual-delta-only guard。
- Step 6 `CapabilityIdentity`、`CapabilityAccessReviewFact`、`CapabilityRegistryEntry`、`CapabilityIdentityPolicy`、`RegistryLifecycleState`与`RegistryVisibilityPolicy`完整callable / guard。

因此registry矩阵不是“四条registry Command摘要”,而是覆盖当前所有会合法修改`CapabilityRegistryEntry.lifecycle_state`的domain入口与Step 9 actual flow。

### 14.2 Controlled reopen `CH-DDD-S10-IDENTITY-REGISTRY-CALLABLE-001`

| 冲突 | 若不修正的实现风险 | 最小修正 | 状态 |
|---|---|---|---|
| identity factory可形成三态,但旧签名没有policy输入且non-resolved分流不确定 | 实现自行选择Candidate / Unresolved,或在factory外私建mapping | existing factory接收existing policy；`Resolved -> Active`,`Stale -> Candidate`,`Unresolved / Unavailable -> Unresolved`,`Invalid / Forbidden / Expired -> rejection` | resolved |
| HLD `Draft -> Registered`与current registry factory直接形成`Registered`不一致 | 伪造draft persistence、二次transition或错误history | `Draft`保留为enum / HLD reserved state,current boundary不可达；factory直接`Registered` | resolved |
| descriptor unresolved actual flow允许任一non-retired / non-Undescribed registry进入`Undescribed`,但旧enum guard摘要漏`Ungoverned / FormalVisible` | actual flow在domain guard处失败或application绕过member | existing `can_transition_to(...)`补`Ungoverned / FormalVisible -> Undescribed` | resolved |
| exposure establish actual flow可由complete prerequisites把`Registered`直接推进`FormalVisible`,但旧enum guard摘要只列Pending来源 | complete exposure在registry member处失败,或application伪造Pending中间revision | existing `can_transition_to(...)`补`Registered -> FormalVisible`;authority仍仅exposure service | resolved |

同步文件为Step 6、Step 8和Step 9中间产物；没有新增struct、field、enum、variant、object、callable、trait、Port、protocol或flow。新增public结构 / 字段数为0,故没有结构体注释新增面；既有英文`///`保持完整。正式`02`仍保留概要候选方向,本次只闭合详细设计current reachability,无需修改正式`02`。

---

## 15. `CapabilityIdentityState` 状态矩阵

### 15.1 状态集合与ASCII图

```text
[CapabilityIdentity]
  factory(Resolved source)             -> Active
  factory(Stale source)                -> Candidate
  factory(Unresolved/Unavailable)      -> Unresolved
  factory(Invalid/Forbidden/Expired)   -> rejection; no identity

  Candidate  - - reserved activate - -> Active
  Unresolved - - reserved activate - -> Active
  Active -> CorrectionPending -> Active   [one Command UoW;only final Active persists]
  Candidate / Active / CorrectionPending / Unresolved -> Retired
  Active -> Active                         [review link changes;not a state transition]
  Retired -> terminal
```

虚线方向有existing domain callable但没有current Step 9 entry flow,只能标`reserved_not_callable_in_current_boundary`。`CorrectionPending`是`CorrectCapabilityIdentity`同一次内存mutation中的合法中间态,不能独立save、capture或被Query观察为本次已提交truth。

| 状态 | 作用 | 是否终态 | 当前可达性 / 允许的关键操作 | 不得解释为 |
|---|---|---|---|---|
| `Candidate` | source是`Stale`,intake已形成但identity闭口不足 | 否 | current factory可形成；可显式retire；`activate`保留为reserved | 自动发现候选snapshot、active identity或provider可用性 |
| `Active` | stable identity可作为registry / descriptor等后续truth锚点 | 否 | current factory可形成；request / complete correction；attach review；retire | registry formal visible、governance approved或runtime executable |
| `CorrectionPending` | correction / merge / split已打开但尚未闭口 | 否 | 仅current correction flow同一UoW内进入并立即完成；可由domain `retire`接受但current flow不持久化该态 | 可单独提交、可供registry消费或canonical redirect truth |
| `Unresolved` | source为`Unresolved / Unavailable`,identity证据不足 | 否 | current factory可形成；可显式retire；`activate`保留为reserved | 缺省Active、空identity或外部resolver状态副本 |
| `Retired` | historical terminal identity | 是 | Query / trace / history read only | 可恢复Active、物理删除或级联退役依赖truth |

### 15.2 Current formation / transition矩阵

| From | To | Step 6触发函数 | Step 9 flow | exact前置条件 | 对象字段 / version副作用 | Flow副作用 / propagation class | 非法时错误类别 |
|---|---|---|---|---|---|---|---|
| factory | `Active` | `CapabilityIdentity::create_from_intake(..., &CapabilityIdentityPolicy, ...)` + `CapabilityIdentityPolicy::validate_new_identity(...)` | `command_establish_capability_access_context_flow` | exact source ref / canonical state id、subject、`ExternalCapabilitySource` kind对称；source kind allowlist通过；resolution=`Resolved`;identity key无current owner | 全字段形成；`identity_state=Active`,`review_fact_ref=None`,version=1,create / update time相同 | final identity、review、2 records、trace、captures、stored result same UoW；actual material stale=`same_uow_actual_stale`;local capture供后续post-commit collaboration | policy / invariant error；不形成identity |
| factory | `Candidate` | 同上 | 同上 | 同一owner / kind / key guard；resolution=`Stale` | `identity_state=Candidate`,其余factory字段完整,version=1 | 与Active factory branch相同；结果 / Created记录必须复制actual Candidate | policy / invariant error；不形成identity |
| factory | `Unresolved` | 同上 | 同上 | 同一owner / kind / key guard；resolution=`Unresolved`或`Unavailable` | `identity_state=Unresolved`,其余factory字段完整,version=1 | 与Active factory branch相同；不得在flow内调用`activate`补造resolved truth | policy / invariant error；不形成identity |
| `Active` | `CorrectionPending` | `CapabilityIdentity::request_correction(...)` | `command_correct_capability_identity_flow` | exact current non-retired target；kind/cardinality、自指/重复related ref、related non-retired和new key owner均通过`validate_correction` | state=`CorrectionPending`;version +1;updated_at=now；返回`CorrectionRequested`record | 只在内存形成；record进入same target trace；不得save intermediate identity或capture该record；`same_uow_local_required` | `DomainError::InvalidStateTransition` / policy rejection |
| `CorrectionPending` | `Active` | `CapabilityIdentity::complete_correction(...)` | `command_correct_capability_identity_flow` | 必须紧接同一对象的successful request；change kind仅`Corrected / Merged / Split`;related ref规则与new key通过 | state=`Active`;identity key按request更新；version再+1；返回terminal kind record | 只save一次final Active object,使用原`Loaded.expected_version`;两records同trace,terminal record唯一core capture；actual materials stale；`same_uow_local_required` + `same_uow_actual_stale` | `DomainError::InvalidStateTransition` / invariant error |
| `Candidate` / `Active` / `CorrectionPending` / `Unresolved` | `Retired` | `CapabilityIdentity::retire(...)` | `command_retire_capability_identity_flow` | exact current ref；state非Retired；`CapabilityRegistryRepository::find_current_by_identity(...) == None`;reason / actor / trace / time完整 | state=`Retired`;version +1;updated_at=now；返回`Retired`record | identity / record / trace / capture / result同UoW；actual materials stale；no cascade；`same_uow_local_required` + `same_uow_actual_stale` | invalid transition / policy rejection；依赖registry存在时member调用数0 |

### 15.3 Same-state mutation与reserved方向

| From | To | 分类 | Callable / flow | Exact规则 | Current处理 |
|---|---|---|---|---|---|
| factory形成的actual state | same | current same-state field mutation | `CapabilityIdentity::attach_review_fact(...)`;`command_establish_capability_access_context_flow` | new review必须same identity且`Recorded`;写`review_fact_ref`,version +1,updated_at=now；`ReviewFactAttached`previous / next均为actual state | same UoW保存final identity / review / history / trace / captures；不是lifecycle transition |
| any current non-retired state | same | current same-state field mutation | `attach_review_fact(...)`;`command_record_capability_access_review_fact_flow` | replacement review已Recorded；current review / identity link一致；新ref实际different | optional old review supersede、新review、identity link和sidecars原子；exact same review ref不构成accepted mutation |
| `Candidate` | `Active` | `reserved_not_callable_in_current_boundary` | existing `activate(...)`;no current Step 9 flow | future protocol必须证明canonical source已Resolved并加载exact current identity | 当前不得由reference Consumer / Job / Query自动调用 |
| `Unresolved` | `Active` | `reserved_not_callable_in_current_boundary` | existing `activate(...)`;no current Step 9 flow | 同上 | 当前不得通过repository update或private helper恢复 |
| `Candidate` | `Unresolved` | `reserved_not_callable_in_current_boundary` | Step 6概要方向存在；无member / current flow | 必须未来受控回开owner callable与protocol | 当前不能实现 |
| `Unresolved` | `Candidate` | `reserved_not_callable_in_current_boundary` | Step 6概要方向存在；无member / current flow | 必须未来受控回开owner callable与protocol | 当前不能实现 |
| `CorrectionPending` | `Retired` | domain-allowed but no independently persisted current source | existing `retire(...)`;retirement flow can accept if such exact state is ever loaded | current correction flow never savesCorrectionPending；不能为了调用retire人为落库中间态 | matrix保留domain row；current expected execution count通常0 |

### 15.4 非法转换与no-op处理

| 场景 | 检测位置 | 对象是否改变 | history / capture / material | 稳定错误入口 | Step 12待闭合 |
|---|---|---|---|---|---|
| initial state resolution=`Invalid / Forbidden / Expired`、source state id / subject / kind不对称或source kind forbidden | policy / factory before identity formation | 否 | 0 / 0 / 0；Register branch的external observation本身不可回滚,但local source/state/identity均不commit | policy rejection；Forbidden可归boundary error；不对称为invariant / consistency | exact public code、Forbidden安全surface、retryability |
| correction target不是`Active`,或complete时不是`CorrectionPending` | domain member | 否；失败member不得保留partial mutation供save | 0 accepted history / capture / material；whole UoW rollback | `DomainError::InvalidStateTransition` | exact variant / response mapping |
| correction在request成功后complete失败 | application UoW | 内存可曾进入pending,但持久化truth不变 | 两条record均不commit；capture / result / completion为0 | invariant / domain / application error | rollback mapping与safe issue ref |
| retire时已有current registry | application guard before member | 否 | accepted history / capture / material均0；可形成replayable rejection result | policy rejection | exact dependent-truth error |
| already `Retired`再次correction / review attach / retire / activate | application preguard + domain member | 否 | 0 accepted effects | policy rejection或`DomainError::InvalidStateTransition` | exact code和idempotent public disposition |
| attach同一个current review ref或fact非Recorded / owner mismatch | application consistency guard + member | 否 | 0 accepted effects；不造same-state record | no-op policy rejection / invariant error | no-op与consistency精确taxonomy |
| Query、Consumer、Job、runtime、SDK、search、marketplace请求改identity | entry / policy boundary | 否 | 0 | boundary / policy rejection | transport / event / Job mapping |

### 15.5 Propagation与测试切口

| Source变化 | 同UoW required | actual material | post-commit | 明确不传播 |
|---|---|---|---|---|
| factory / review-link / correction / retirement accepted revision | final identity、对应review（如有）、ordered identity changes、one trace、official captures、stored result / idempotency completion | 仅actual non-stale view / directory / audit export / ecosystem进入Stale并各自capture | durable local capture由后续outbound collaboration读取；失败不回滚identity | 不同步改registry、descriptor、seam、method relation、exposure、reference state、runtime / SDK / listing truth |

后续Step 16至少承接:三种accepted initial mapping、三种terminal initial rejection、source/state asymmetry、correction single-save / two-record / one-capture、complete failure rollback、四种non-retired retirement、dependent registry guard、review same-state mutation、reserved activation不可从Consumer / Job触发、Retired terminal和actual-stale-only传播。

### 15.6 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / variant与Step 6 exact一致 | pass | 5 / 5 variants,无新增同义state |
| initial / formation state有factory | pass after controlled reopen | three accepted outcomes与three rejection values穷尽 |
| 每条current transition有member | pass | correction pair、retire、review same-state mutation均有exact member |
| 每条current transition回指exact Step 9 flow | pass | establish / correct / retire / record review四flow |
| same-state mutation / no-op分离 | pass | review link实际delta单列；same ref不造record |
| terminal / degraded / reserved方向明确 | pass | Retired terminal；Candidate / Unresolved activation及cross-direction显式reserved |
| state field / version / time副作用明确 | pass | correction两次内存version increment、single final save明确 |
| cross-state propagation class明确 | pass | local atomic + actual stale + post-commit capture边界完整 |
| illegal path无fake history / capture / result | pass | CorrectionRequested不capture,failed complete不commit |
| query / external owner / no-truth-repair边界通过 | pass | reference refresh不自动改identity；无runtime / listing / approval合并 |
| test cuts可由后续Step 16承接 | pass | 未声称测试已执行 |

| unresolved blocker | none | `CH-DDD-S10-IDENTITY-REGISTRY-CALLABLE-001` identity部分已关闭 |

---

## 16. `CapabilityAccessReviewFactState` 状态矩阵

### 16.1 状态集合与ASCII图

```text
[CapabilityAccessReviewFact]
  factory -> Draft -> Recorded
                       |
                       +-> Superseded   [a distinct new Recorded fact replaces current]

  Draft    - - reserved invalidate - -> Invalidated
  Recorded - - reserved invalidate - -> Invalidated

  Superseded / Invalidated -> terminal
```

`Draft`由factory形成,但两条current review Command都在同一UoW内立即调用`record(...)`并只保存final `Recorded` revision；它和identity correction的`CorrectionPending`一样是合法domain中间态,不是当前独立持久化入口。`Invalidated`有existing member但没有current Step 8 protocol / Step 9 flow,故两条invalidation方向均为`reserved_not_callable_in_current_boundary`。

| 状态 | 作用 | 是否终态 | 当前可达性 / 允许的关键操作 | 不得解释为 |
|---|---|---|---|---|
| `Draft` | review fields已构造,但尚未证明`Separated`并正式记录 | 否 | current factory transaction-local形成；当前只能紧接`record(...)` | current review、governance approval或可供descriptor引用的fact |
| `Recorded` | current body-free access review fact | 否 | current flow可形成；可被new fact supersede；可供identity link与allowed summary读取 | approval、vote、Policy effective fact或runtime allow/deny |
| `Superseded` | distinct newer Recorded fact已替换本fact | 是 | historical Query / trace read only | 可继续作为current review、可恢复Recorded或删除历史 |
| `Invalidated` | source / boundary使fact失效 | 是 | existing member可形成,但current boundary无protocol / flow | governance revocation、descriptor risk state或外部审批状态 |

### 16.2 Current formation / transition矩阵

| From | To | Step 6触发函数 | Step 9 flow | exact前置条件 | 对象字段 / version副作用 | Flow副作用 / propagation class | 非法时错误类别 |
|---|---|---|---|---|---|---|---|
| factory | `Draft` | `CapabilityAccessReviewFact::draft(...)` | `command_establish_capability_access_context_flow`;`command_record_capability_access_review_fact_flow` | identity id来自new / loaded non-retired identity；context / risk是validated body-free values；marker只能由application固定为`AccessGovernanceSeparationMarker::Separated`;actor / id / time来源完整 | 写全部fact字段；state=`Draft`,version=1,recorded_at=updated_at=now | 仅在accepted UoW内staged；不得单独save / expose / capture；`same_uow_local_required` | domain / contract value error；不形成fact |
| `Draft` | `Recorded` | `CapabilityAccessReviewFact::record(now)` | 同上两flow | current state Draft；`separation_marker=Separated`;time有效 | state=`Recorded`;version +1;updated_at=now；其余review content不变 | 只保存final Recorded new fact；与identity `attach_review_fact(...)`及其history / trace / capture / result同UoW；`same_uow_local_required` | `DomainError::InvalidStateTransition` / policy-invariant error |
| `Recorded` | `Superseded` | `CapabilityAccessReviewFact::supersede(replacement_id, now)` | `command_record_capability_access_review_fact_flow` | repository current review与identity current review exact ref一致；replacement id different；replacement new fact已在同一UoW成功`Draft -> Recorded`且same identity | old state=`Superseded`;version +1;updated_at=now；old content / actor保持historical；replacement id用于distinct guard,不伪造未定义field | optional old save、new Recorded fact、identity new review link、one identity change / trace / capture / actual material stale、result原子；`same_uow_local_required` + `same_uow_actual_stale` | invalid transition / invariant / consistency error |

### 16.3 Reserved方向、same-state与current-fact规则

| From | To | 分类 | Callable / flow | Exact规则 | Current处理 |
|---|---|---|---|---|---|
| `Draft` | `Invalidated` | `reserved_not_callable_in_current_boundary` | existing `invalidate(...)`;no current Step 9 flow | callable要求actor、safe reason、time；state / version / updated_at必须原子变化；若未来需要reason / actor history,必须先闭合正式protocol与history owner | current handler / Consumer / Job不得调用；不得为失败draft保存Invalidated占位 |
| `Recorded` | `Invalidated` | `reserved_not_callable_in_current_boundary` | existing `invalidate(...)`;no current Step 9 flow | future flow还必须原子解除 / 替换identity current review link,否则repository current与identity ref不对称 | 当前不能实现；不得只改单个review row |
| `Recorded` | `Recorded` | no-op / duplicate,不是state mutation | application current-review guard；stored idempotent replay | same request key + digest回放原stored result；different request形成distinct new fact,不能overwrite current content | no member / save / version / history / capture for exact duplicate |
| `Superseded` / `Invalidated` | any | terminal illegal | domain guard | terminal fact只能historical read；后续有效审查必须new fact id | 无原地恢复 / 再supersede / 再invalidate |

Current fact一致性不变量:

1. repository `find_current_by_identity(...)`若返回fact,其state必须是`Recorded`,且identity `review_fact_ref`必须指向同一个exact revision。
2. identity有review ref但repository无current fact,或repository current与identity ref不一致,是consistency error,不是“无旧review”分支。
3. replacement accepted UoW中最多一个final `Recorded` current fact；old fact必须在identity link切换的同一UoW进入`Superseded`。
4. review state自身不拥有approval / governance history；current flow只通过`ReviewFactAttached` identity record解释current link变化,不得为review伪造不存在的change-record type。

### 16.4 非法转换与no-op处理

| 场景 | 检测位置 | 对象是否改变 | history / capture / material | 稳定错误入口 | Step 12待闭合 |
|---|---|---|---|---|---|
| marker不是`Separated`,或payload含approval / vote / Policy / shared-rules body | pre-reserve scanner / factory / record guard | 否 | 0 | boundary / policy rejection | exact BodyForbidden / InvalidField mapping |
| `record(...)`作用于非Draft | domain member | 否 | 0 | `DomainError::InvalidStateTransition` | exact variant |
| `supersede(...)`作用于非Recorded或replacement id=self | domain member | 否 | 0 | invalid transition / invariant error | exact variant与safe response |
| old current state非Recorded、identity link不对称、missing current但identity有ref | application guard | 否；whole UoW rollback | 0 accepted history / capture / material | consistency `ApplicationError` | exact consistency taxonomy / retryability |
| old supersede已staged,但new / identity / capture / material / result save失败 | UoW | persisted old保持Recorded,current link不变 | staged effects全部rollback | persistence / consistency error | optimistic conflict mapping |
| exact completed duplicate | idempotency / stored result branch | 否 | no new fact、no second supersede、no material scan | `DuplicateReplayed` | exact public disposition |
| Query / Consumer / Job试图record / supersede / invalidate | entry boundary | 否 | 0 | boundary / policy rejection | channel mapping |

### 16.5 Propagation与测试切口

| Source变化 | 同UoW required | actual material | post-commit | 明确不传播 |
|---|---|---|---|---|
| new review Recorded + optional old Superseded | identity current review link、one`ReviewFactAttached`identity record、one identity trace / capture、stored result / completion | identity subject下actual non-stale material才进入Stale并capture | durable identity capture后续协作失败不回滚review / identity link | 不创建governance seam、approval、descriptor risk、reference state、impact、runtime或listing truth |

后续Step 16至少承接:factory marker固定、Draft只在内存形成、Draft -> Recorded、无旧review、新旧review replacement原子性、old/new/identity三类expected-version、self replacement、current-link不一致、terminal重入、duplicate replay零新fact、approval body rejection和invalidation current不可调用。

### 16.6 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / variant与Step 6 exact一致 | pass | 4 / 4 variants |
| initial / formation state有factory | pass | Draft factory；current flow final Recorded save明确 |
| 每条current transition有member | pass | `record`与`supersede` |
| 每条current transition回指exact Step 9 flow | pass | establish context + record review fact |
| same-state mutation / no-op分离 | pass | duplicate Recorded不改；replacement创建new id |
| terminal / degraded / reserved方向明确 | pass | Superseded / Invalidated terminal；invalidation两方向reserved |
| state field / version / time副作用明确 | pass | current transitions均version +1 / updated_at更新 |
| cross-state propagation class明确 | pass | review / identity link same UoW；material actual-stale-only |
| illegal path无fake history / capture / result | pass | 不新增review change-record类型；失败whole rollback |
| query / external owner / no-truth-repair边界通过 | pass | access review不等于governance approval |
| test cuts可由后续Step 16承接 | pass | 未声称测试已执行 |
| unresolved blocker | none | invalidation保留为future protocol reopen condition,不阻塞current boundary |

---

## 17. `RegistryLifecycleState` 状态矩阵

### 17.1 状态集合与ASCII图

```text
[CapabilityRegistryEntry]
  factory(active identity) -> Registered

  Draft - - reserved only - -> Registered / Retired

  Registered ---------> Undescribed
      |  \------------> Ungoverned
      |  \------------> VisibilityPending
      |  \------------> FormalVisible [exposure service only]
      \---------------> Retired

  Undescribed --------> VisibilityPending -> FormalVisible
      |                       |     |              |
      |                       |     +-> Undescribed|
      |                       +-------> Ungoverned |
      +----------------------> Retired             |
                                                      v
  Ungoverned ----------> Undescribed / VisibilityPending / Retired
  FormalVisible -------> Undescribed / VisibilityPending / Retired

  accepted descriptor bind or changed visibility basis:
    any reachable non-retired -> VisibilityPending
    VisibilityPending -> VisibilityPending [real field/version delta]

  Retired -> terminal
```

`Draft`仍是Step 6 enum与HLD vocabulary的一部分,但current `register(...)`直接构造`Registered`;当前没有draft factory、save path、change record或Step 9 flow。它不能被实现成隐藏预注册row。

| 状态 | 作用 | 是否终态 | 当前可达性 / 允许的关键操作 | 不得解释为 |
|---|---|---|---|---|
| `Draft` | registry草稿概要语义 | 否,但current不可达 | 仅reserved；future flow必须先回开factory / protocol / history | 当前已持久化row、Registered前必经state或临时SQL值 |
| `Registered` | active identity已正式纳入registry,前置尚未等同formal visibility | 否 | current factory initial；可进入缺失 / pending / retirement；可绑定descriptor / basis | runtime allow、marketplace listing或已完成governance |
| `Undescribed` | accepted descriptor前置缺失或本次descriptor建立结果Unresolved | 否 | descriptor恢复后进入VisibilityPending；可retire | provider不可用、无MCP tool或secret不可访问 |
| `Ungoverned` | usable governance seam前置缺失 | 否 | descriptor unresolved可进一步揭示Undescribed；前置重评进入VisibilityPending；可retire | governance rejected / approved truth的本地副本 |
| `VisibilityPending` | formal visibility / exposure前置待评估或需重开 | 否 | exposure service可形成FormalVisible；缺失前置可转Undescribed / Ungoverned；descriptor / basis change可same-state revision；可retire | runtime pending、event delivery pending或Query freshness |
| `FormalVisible` | capability-hub formal registry visibility prerequisites成立 | 否 | descriptor unresolved可转Undescribed；basis / exposure change转VisibilityPending；可retire | runtime authorization、provider health、SDK发布或marketplace listing |
| `Retired` | historical terminal registry entry | 是 | Query / trace / history read only | identity退役、依赖对象物理删除或可原地恢复 |

### 17.2 Factory与public lifecycle transition矩阵

| From | To | Step 6触发函数 | Step 9 flow | exact前置条件 | 对象字段 / version副作用 | Flow副作用 / propagation class | 非法时错误类别 |
|---|---|---|---|---|---|---|---|
| factory | `Registered` | `CapabilityRegistryEntry::register(...)` | `command_register_capability_in_registry_flow` | exact identity state=`Active`;same identity无current registry；body-free basis / context通过policy；reason / actor / trace / ids / time完整 | 构造entry与`Registered`record；state=`Registered`,descriptor=None,version=1,lifecycle reason / effective / times完整 | entry / record / trace / capture / result / completion same UoW；identity read-only；actual material stale；`same_uow_local_required` + `same_uow_actual_stale` | policy / invariant error；不保存Draft或partial entry |
| `Registered` | `Undescribed` | `RegistryLifecycleState::can_transition_to(...)` + `RegistryVisibilityPolicy::validate_transition(...)` + `CapabilityRegistryEntry::transition_lifecycle(...)` | `command_update_registry_lifecycle_state_flow`;descriptor unresolved branch见§17.3 | public route target allowlist通过；target != current；object + policy双guard；exact loaded version | state / reason / effective / updated_at更新；version +1；one`LifecycleChanged`record | registry record / trace / capture / result同UoW；actual material stale；`same_uow_local_required` + `same_uow_actual_stale` | policy rejection / invalid transition |
| `Registered` | `Ungoverned` | 同上 | `command_update_registry_lifecycle_state_flow` | 同上,target=`Ungoverned` | 同上 | 同上 | 同上 |
| `Registered` | `VisibilityPending` | 同上 | `command_update_registry_lifecycle_state_flow`;descriptor / basis / exposure flows见§17.3~§17.4 | public route时双guard；跨服务时由exact domain member / policy-derived target决定 | transition path更新state context/version并返回record | actual delta才save / history / capture / material；`same_uow_local_required` + `same_uow_actual_stale` | policy rejection / invalid transition |
| `Registered` | `FormalVisible` | `CapabilityRegistryEntry::transition_lifecycle(...)`;exposure policy derives target | `command_establish_formal_exposure_boundary_flow`;`command_update_formal_visibility_applicability_flow` | establish时registry必须在`allows_formal_exposure_evaluation`集合；update时已有exact exposure owner；descriptor Accepted、seam Active、optional method与all canonical refs满足policy；final exposure=`Active`且final visibility=`Visible`;source exposure version对称；public registry route不可请求 | state context / version +1；oneLifecycleChanged record | exposure / visibility / registry truth、records、traces、captures、actual material typed union与result同UoW；`same_uow_local_required` + `same_uow_actual_stale` | policy / invalid transition / source-version invariant error |
| `Undescribed` | `VisibilityPending` | 同上 | `command_update_registry_lifecycle_state_flow`;descriptor / basis / exposure flows见§17.3~§17.4 | target != current；accepted descriptor或显式maintenance / visibility input不能越过policy | state context / version +1；one record | 同上 | 同上 |
| `Ungoverned` | `Undescribed` | 同上 | `command_update_registry_lifecycle_state_flow`;`command_establish_adapter_descriptor_flow` | public target与双guard通过,或descriptor flow形成new `Unresolved` descriptor且registry不在Undescribed | state context / version +1；one`LifecycleChanged`record | descriptor flow中descriptor + optional registry records各有own trace / capture并同UoW；actual materials按typed union；`same_uow_local_required` | invalid transition / policy / consistency error |
| `Ungoverned` | `VisibilityPending` | 同上 | `command_update_registry_lifecycle_state_flow`;descriptor / basis / exposure flows见后表 | exact target / policy guard；actual prerequisite / field delta | state context / version +1；one record | actual delta only；same UoW + actual stale | 同上 |
| `VisibilityPending` | `Undescribed` | 同上 | `command_update_registry_lifecycle_state_flow`;`command_establish_adapter_descriptor_flow` | public target与双guard通过,或new descriptor为Unresolved | state context / version +1；one record | same UoW；actual stale only | 同上 |
| `VisibilityPending` | `Ungoverned` | 同上 | `command_update_registry_lifecycle_state_flow` | public target=`Ungoverned`;target differs；object + policy双guard | state context / version +1；one record | same UoW；actual stale only | 同上 |
| `FormalVisible` | `Undescribed` | 同上 | `command_update_registry_lifecycle_state_flow`;`command_establish_adapter_descriptor_flow` | public target与双guard通过,或descriptor establishment得到Unresolved；不得保留旧visible解释 | state context / version +1；one record | core / descriptor state与registry degradation同UoW；actual stale；不调用runtime / listing | invalid transition / policy / consistency error |
| `FormalVisible` | `VisibilityPending` | 同上 | `command_update_registry_lifecycle_state_flow`;descriptor / basis / four exposure flows见后表 | target differs；public双guard或跨服务actual prerequisite / exposure delta | state context / version +1；one record | actual delta only；same UoW + actual stale | 同上 |

Public `UpdateRegistryLifecycleState`只允许target=`Undescribed / Ungoverned / VisibilityPending`。它不能请求`Draft / Registered / FormalVisible / Retired`;这些target在repository read / member call前按Step 9口径拒绝。即使target在allowlist内,仍必须通过from/to matrix和`RegistryVisibilityPolicy`双guard。

### 17.3 Descriptor-driven registry mutation

| From | To | Step 6触发函数 | Step 9 flow | exact前置条件 | 对象字段 / version副作用 | Flow副作用 / propagation class | 非法时错误类别 |
|---|---|---|---|---|---|---|---|
| `Registered` / `Undescribed` / `Ungoverned` / `FormalVisible` | `VisibilityPending` | `CapabilityRegistryEntry::bind_descriptor(...)` | `command_establish_adapter_descriptor_flow`;`command_replace_adapter_descriptor_flow` | descriptor distinct / same entry / same identity chain且final state=`Accepted`;registry non-retired；replacement flow先完成new Accepted与old replacement guards | 原子写`descriptor_ref`,state=`VisibilityPending`,reason / effective / updated_at；version只+1；one`DescriptorBound`record,previous=actual source,next=Pending | descriptor与registry truth / histories / traces / captures same UoW；不得追加第二条LifecycleChanged；material typed union / actual stale；`same_uow_local_required` | domain / policy / consistency error；whole rollback |
| `VisibilityPending` | `VisibilityPending` | `CapabilityRegistryEntry::bind_descriptor(...)` | 同上 | descriptor ref实际new / replacement且Accepted；same owner；非retired | state值不变,但descriptor ref / reason / effective / updated_at实际变化；version +1；oneprevious=next Pending `DescriptorBound`record | accepted same-state mutation；save / trace / capture / material合法；不调用`transition_lifecycle` | exact same descriptor / owner mismatch / terminal -> policy or invariant rejection |
| `Registered` / `Ungoverned` / `VisibilityPending` / `FormalVisible` | `Undescribed` | `CapabilityRegistryEntry::transition_lifecycle(...)` | `command_establish_adapter_descriptor_flow` unresolved branch | new descriptor从Draft进入Unresolved；source / optional document是recoverable non-resolved,不是Invalid / Forbidden；registry非retired且不已Undescribed | lifecycle context / version +1；oneLifecycleChanged record；descriptor ref不绑定 | unresolved descriptor与optional registry degradation同UoW；各subject own trace / capture；actual material typed union | invalid transition / policy / consistency error |
| `Undescribed` | `Undescribed` | application no-op guard；不调用member | `command_establish_adapter_descriptor_flow` unresolved branch | new descriptor Unresolved且registry already Undescribed | registry fields / version / time均不变 | registry save / id / record / trace / capture / material subject均0；descriptor自身accepted degraded effects照常 | 无registry错误；若仍造record为consistency defect |

### 17.4 Visibility-basis与exposure-driven mutation

| From | To | Step 6触发函数 | Step 9 flow | exact前置条件 | 对象字段 / version副作用 | Flow副作用 / propagation class | 非法时错误类别 |
|---|---|---|---|---|---|---|---|
| `Registered` / `Undescribed` / `Ungoverned` / `FormalVisible` | `VisibilityPending` | `CapabilityRegistryEntry::apply_visibility_basis(...)` | `command_update_registry_visibility_basis_flow` | exact non-retired entry；replacement basis与stored basis不同；basis/context body-free policy通过 | basis、state、reason / effective / updated_at更新；version +1；one`VisibilityBasisChanged`record | registry / record / trace / capture / result + actual stale materials same UoW；`same_uow_local_required` + `same_uow_actual_stale` | policy / boundary / invalid transition |
| `VisibilityPending` | `VisibilityPending` | 同上 | 同上 | basis实际different；context只作policy input,不能单独制造delta | state相同但basis / context-derived reason / time实际变化；version +1；one previous=next record | accepted same-state mutation；full actual effects合法 | same basis -> replayable no-op rejection |
| `Registered` / `VisibilityPending` | `FormalVisible` | `CapabilityRegistryEntry::transition_lifecycle(...)`;exposure policy derives target | `command_establish_formal_exposure_boundary_flow`;`command_update_formal_visibility_applicability_flow` | establish只接受registry `Registered / VisibilityPending / FormalVisible`;update要求existing exact exposure；descriptor Accepted、seam Active、optional method / all canonical refs满足policy；final exposure=`Active`且final visibility=`Visible`,source exposure version对称；registry target differs | state context / version +1；oneLifecycleChanged record | exposure / visibility / optional registry records、traces、captures、actual materials、result同UoW；`same_uow_local_required` + `same_uow_actual_stale` | policy / invalid transition / source-version invariant error |
| `Registered` / `Undescribed` / `Ungoverned` / `FormalVisible` | `VisibilityPending` | `CapabilityRegistryEntry::transition_lifecycle(...)`;exposure service derives target | `command_establish_formal_exposure_boundary_flow`;`command_update_formal_visibility_applicability_flow`;`command_suspend_formal_exposure_boundary_flow`;`command_retire_formal_exposure_boundary_flow` | establish来源只允许`Registered / FormalVisible`（Pending为same-target no-op）,不能由Undescribed / Ungoverned新建exposure；已有exact exposure的update / suspend / retire可从任一non-retired registry修复为Pending；member只在current != target调用 | state context / version +1；oneLifecycleChanged record | exposure / visibility与actual registry delta同UoW；registry subject仅actual delta时进入effect / material union | policy / invalid transition / consistency error |
| `VisibilityPending` | `VisibilityPending` | application actual-delta guard；不调用`transition_lifecycle` | 上述四exposure flows | exposure-derived registry target也是Pending | registry所有字段 / version / time不变 | registry save / id / record / trace / capture / changed subject / material scan为0；exposure / visibility自身effect照常 | 若生成synthetic registry effect为consistency defect |
| `FormalVisible` | `FormalVisible` | application actual-delta guard；不调用member | establish / update formal visibility flow | final exposure Active + visibility Visible,derived target FormalVisible,current already same | registry不变 | registry side effect全0；exposure / visibility actual effects不受影响 | synthetic history forbidden |

只有exposure service在加载exact formal prerequisites并得到final Active / Visible pair后可执行`Registered / VisibilityPending -> FormalVisible`。registry public Command、descriptor service、Query、Consumer、Job、runtime、SDK、search、marketplace均无此authority。

### 17.5 Retirement与reserved方向

| From | To | 分类 / Callable | Step 9 flow | Exact规则 | Current处理 |
|---|---|---|---|---|---|
| `Registered` / `Undescribed` / `Ungoverned` / `VisibilityPending` / `FormalVisible` | `Retired` | current `CapabilityRegistryEntry::retire(...)` | `command_retire_capability_registry_entry_flow` | exact current non-retired entry；safe reason / actor / trace / time；member返回Retired record | one terminal save / record / trace / capture / result + actual stale material same UoW；不级联identity / descriptor / relation / exposure deletion |
| `Draft` | `Registered` | `reserved_not_callable_in_current_boundary` | no current flow | future draft factory / persistence / history / promotion protocol必须整体回开 | current不得伪造中间save或复用`register(...)`作transition |
| `Draft` | `Retired` | domain direction reserved,source state unreachable | no current flow | future若持久化Draft才可设计retirement | current execution count 0 |
| any current state | `Registered` | illegal | no member / flow | registration只形成new entry；existing entry不回到Registered | stable rejection |
| `Retired` | any | terminal illegal | domain guard | new registration需先满足identity current uniqueness / historical ownership的future policy,不能原地恢复 | no mutation / history / capture |

### 17.6 非法转换与no-op处理

| 场景 | 检测位置 | 对象是否改变 | history / capture / material | 稳定错误入口 | Step 12待闭合 |
|---|---|---|---|---|---|
| public target=`Draft / Registered / FormalVisible / Retired` | handler / service pre-reserve allowlist | 否 | 0 | policy rejection | exact public error / HTTP mapping |
| public target=current | application after exact load,before member | 否 | accepted state effects全0；可完成replayable rejection result | no-op policy rejection | exact no-op taxonomy |
| target allowlisted但`can_transition_to=false`或visibility policy拒绝 | object / policy guards before member | 否 | 0 accepted effects | policy rejection / invalid transition | exact distinction |
| same basis但context不同 | application no-op guard | 否；context不持久化 | 0 registry history / capture / material | policy rejection | exact reason；不得把context当truth delta |
| descriptor not Accepted、owner mismatch、same descriptor或registry Retired | descriptor / registry member guard | 否 | descriptor / registry accepted set whole rollback | domain / policy / invariant error | exact code |
| exposure尝试从`Undescribed / Ungoverned / Draft`直接形成FormalVisible | exposure policy + registry guards | 否 | whole UoW rollback / stable rejection；no fake registry record | policy rejection / invalid transition | exact prerequisite issue surface |
| registry already exposure-derived target | application actual-delta guard | 否 | registry effects全0,其他owner actual effects保留 | no error；accepted cross-owner flow | effect-count invariant |
| retire alreadyRetired或request implicit cascade / deletion | application / member | 否 | 0 accepted registry effects | policy rejection / invalid field | exact terminal / cascade code |
| expected-version、record symmetry、capture / material / result失败 | repository / application invariant | persisted state不变 | staged全部rollback | application / persistence error | retryability / conflict mapping |
| Query / reconciliation / derived Job / runtime / SDK / listing写registry | entry / policy boundary | 否 | 0 | boundary / policy rejection | channel-specific mapping |

### 17.7 Propagation与测试切口

| Source变化 | 同UoW required | actual material | post-commit | 明确不传播 |
|---|---|---|---|---|
| registry Command accepted revision | registry、one record、one trace、official capture、stored result / completion | exact non-stale view / directory / audit / ecosystem only | local capture后续协作失败不回滚registry | 不创建descriptor、exposure、runtime / listing truth |
| descriptor bind / unresolved degradation | descriptor truth / record / trace与actual registry revision / record / trace；optional document bind | descriptor与registry candidate typed union后每material最多一次stale | each local capture later collaborates independently | registry不复制provider runtime / source body |
| exposure / visibility derived registry target | final exposure、final source-version-symmetric visibility、actual registry delta、all records / traces / captures | exposure总是按flow扫描；registry只在actual delta时作为material subject,先union再mutation | collaboration不决定formal visibility | FormalVisible不传播为runtime allow、SDK publish或marketplace listing |
| retirement | registry terminal revision与sidecars | actual stale only | capture later | identity与dependent histories保留且不改 |

后续Step 16至少承接:factory直接Registered / Draft零save、public三target allowlist每个合法from、所有非法from、descriptor accepted bind各source与Pending same-state、descriptor unresolved各source与alreadyUndescribed no-op、basis change各source与same-basis no-op、Registered / Pending -> FormalVisible authority / prerequisites、establish从Undescribed / Ungoverned拒绝、existing exposure从degraded registry修复Pending、exposure same-target zero registry effect、五种reachable retirement、Retired terminal、expected-version rollback和runtime / listing negative boundary。

### 17.8 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / variant与Step 6 exact一致 | pass | 7 / 7 variants；Draft保留但current unreachable |
| initial / formation state有factory | pass after controlled reopen | current `register(...)`直接Registered,不伪造Draft |
| 每条current transition有member | pass | `transition_lifecycle / bind_descriptor / apply_visibility_basis / retire` |
| 每条current transition回指exact Step 9 flow | pass | 4 registry + 2 descriptor + 4 exposure flows全部覆盖 |
| same-state mutation / no-op分离 | pass | descriptor / basis Pending->Pending有delta；exposure same target全0 |
| terminal / degraded / reserved方向明确 | pass | Retired terminal；Draft directions reserved |
| state field / version / time副作用明确 | pass | transition与compound mutation均version +1；no-op不更新时间 |
| cross-state propagation class明确 | pass | registry / descriptor / exposure atomic set与actual material union明确 |
| illegal path无fake history / capture / result | pass | public forbidden target、same target、policy failure、same basis均不造truth effect |
| FormalVisible authority | pass | only exposure service final Active + Visible pair |
| query / external owner / no-truth-repair边界通过 | pass | reconciliation / search / runtime / SDK / listing不能写registry |
| test cuts可由后续Step 16承接 | pass | 未声称测试已执行 |
| unresolved blocker | none | `CH-DDD-S10-IDENTITY-REGISTRY-CALLABLE-001` registry部分已关闭 |

---

## 18. Batch `10.1` 机械审计与停审

### 18.1 Enum / edge / callable覆盖审计

| 审计项 | 期望 | 实际 | 结论 |
|---|---:|---:|---|
| batch owner state machine | 3 | 3 | pass |
| exact enum variant | identity 5 + review 4 + registry 7 = 16 | 16 / 16 | pass |
| identity accepted factory outcomes | 3 | Active / Candidate / Unresolved = 3 | pass |
| identity initial rejected canonical values | 3 | Invalid / Forbidden / Expired = 3 | pass |
| identity current lifecycle direction | correction 2 + retirement 4 | 6 | pass；CorrectionPending retirement source通常不可独立持久化 |
| identity reserved direction | activation 2 + cross-degraded 2 | 4 | pass；其中activation有callable无flow,cross方向无callable |
| review current direction | Draft -> Recorded + Recorded -> Superseded | 2 | pass |
| review reserved direction | Draft / Recorded -> Invalidated | 2 | pass |
| registry current unique different-state direction | 17 | 17 | pass |
| registry reserved direction | Draft -> Registered / Retired | 2 | pass |
| registry accepted same-state mutation family | descriptor bind + visibility basis | 2 | pass；都要求实际field delta |
| registry application no-op family | descriptor alreadyUndescribed + exposure same target | 2 | pass；all registry effect counts 0 |

三组enum共有`5*(5-1) + 4*(4-1) + 7*(7-1) = 74`个possible different-state pair。审计将每个pair归入current、reserved或illegal；没有未分类pair。表格中多source聚合row按exact source展开后再计数,没有把`A / B -> C`误算成一条方向。

Registry 17条current different-state direction为:

```text
Registered -> Undescribed / Ungoverned / VisibilityPending / FormalVisible / Retired
Undescribed -> VisibilityPending / Retired
Ungoverned -> Undescribed / VisibilityPending / Retired
VisibilityPending -> Undescribed / Ungoverned / FormalVisible / Retired
FormalVisible -> Undescribed / VisibilityPending / Retired
```

### 18.2 Trigger / flow / authority审计

| Owner | Current exact callable | Current exact Step 9 flow | 结果 |
|---|---|---|---|
| identity factory / review-link | `create_from_intake`;`attach_review_fact` | `command_establish_capability_access_context_flow` | pass |
| identity correction | `request_correction`;`complete_correction` | `command_correct_capability_identity_flow` | pass |
| identity retirement | `retire` | `command_retire_capability_identity_flow` | pass |
| review record / replacement | `draft`;`record`;`supersede` | establish context + `command_record_capability_access_review_fact_flow` | pass |
| registry formation | `register` | `command_register_capability_in_registry_flow` | pass；Draft不可达 |
| registry public lifecycle | `can_transition_to`;`validate_transition`;`transition_lifecycle` | `command_update_registry_lifecycle_state_flow` | pass；target allowlist独立于full domain matrix |
| registry basis | `apply_visibility_basis` | `command_update_registry_visibility_basis_flow` | pass |
| registry retirement | `retire` | `command_retire_capability_registry_entry_flow` | pass |
| descriptor-driven registry | `bind_descriptor`;`transition_lifecycle` | establish / replace descriptor flows | pass；one atomic DescriptorBound or one unresolved LifecycleChanged |
| exposure-driven registry | `transition_lifecycle` | establish / update / suspend / retire exposure flows | pass；actual-delta-only |

Authority审计:

- `FormalVisible` target只有exposure service可以请求；public registry route预检查拒绝,descriptor / Query / Consumer / Job / runtime / SDK / listing均无authority。
- descriptor accepted bind只能重开`VisibilityPending`,不能直接形成FormalVisible。
- identity activation existing member没有current protocol；reference Consumer / refresh Job只改canonical ref state,不能隐式激活identity。
- review `invalidate(...)`没有current protocol；不能由repository、adapter或failure branch私自调用。
- registry `Draft`没有current factory / flow；不能作为数据库实现细节偷渡。

### 18.3 Cross-machine transaction / propagation审计

| Cross-machine场景 | Atomic set | No-op / rollback | 结论 |
|---|---|---|---|
| establish identity + review | source/state when Register、final identity、Recorded review、Created + ReviewFactAttached、one trace、captures、actual material、result/completion | factory / record / attach / material任一失败whole rollback | pass |
| correct identity | in-memory Pending + final Active、2 records、one trace、terminal capture、actual material、result/completion | intermediate identity不save；CorrectionRequested不capture；complete failurewhole rollback | pass |
| replace review | old Superseded、new Recorded、identity review link、identity record / trace / capture、actual material、result/completion | current-link mismatch或任一version / capture失败whole rollback | pass |
| descriptor accepted bind | descriptor truth / history与registry descriptor ref + Pending / DescriptorBound,own traces / captures / material union | Pending->Pending只有descriptor ref delta才accepted；不追加second lifecycle record | pass |
| descriptor unresolved | Unresolved descriptor与actual registry Undescribed revision | alreadyUndescribed registry effects全0 | pass |
| exposure visibility | exposure、final source-version-symmetric visibility、actual registry target delta、records / traces / captures / material union、result/completion | registry same target effects全0；任何owner/version/capture失败whole rollback | pass |
| identity / registry retirement | terminal owner revision与sidecars | no cascade；dependent guard / terminal / conflict拒绝不改truth | pass |

所有core truth accepted revision使用`same_uow_local_required`；受影响material只使用`same_uow_actual_stale`；official local capture提交后的external collaboration属于`post_commit_body_free_collaboration`,失败不回滚三类owner truth。当前三机没有`async_follow_up_hint_only`直接状态传播。

### 18.4 Historical / boundary / comment / fabrication审计

| 检查 | 结果 |
|---|---|
| 正式`02`概要方向与current callable差异 | 已分类；identity recovery / review invalidation / registry Draft均reserved,未伪造current flow |
| 旧正式`03` / README作为state truth | no；仍为historical material |
| runtime execution / tools execution进入identity / registry | no |
| marketplace listing / search / projection反写registry | no |
| governance approval与review / Ungoverned合并 | no |
| SDK package / client state与FormalVisible合并 | no |
| 新public struct / struct field / enum / variant / payload | 0 |
| 新public callable / trait / Port / protocol / flow | 0 |
| 结构体 / 字段英文`///`遗漏 | 0；本批无新结构声明,existing注释保持完整 |
| 43 HLD objects + 7 application helpers / 36 Ports / 83 protocols / 83 flows | unchanged |
| 正式`03-详细设计.md`修改 | no |
| implementation ledger / planned boundary skeleton创建 | no |
| implementation commit /真实run_id /测试结果 / evidence alias /验收签署 | none |
| 当前unresolved upstream blocker | 0；`CH-DDD-S10-IDENTITY-REGISTRY-CALLABLE-001`已受控关闭 |
| 当前需要提交 | no |

### 18.5 Batch完成结论与停审

| Gate | 结果 |
|---|---|
| 用户允许进入`10.1` | pass |
| 指定输入与registry跨服务flow已读 | pass |
| identity状态集合 / 图 / matrix / illegal / stop review | pass |
| access review状态集合 / 图 / matrix / illegal / stop review | pass |
| registry状态集合 / 图 / matrix / illegal / stop review | pass |
| all current rows有Step 6 callable + Step 9 flow | pass |
| reserved / terminal / same-state delta / no-op分类 | pass |
| 74 possible different-state pairs分类 | pass；unclassified=0 |
| cross-owner UoW / propagation / authority | pass |
| controlled reopen | pass；identity initial mapping、Draft reachability、3个registry actual guard方向已闭合 |
| Rustdoc / 结构注释门禁 | pass；无新结构声明或public symbol |
| 正式文档 / implementation artifact / commit | none |

```text
gate_status = 03_step_10_batch_10_1_completed_wait_user_review
completed_document = 03-详细设计.md
completed_step = Step 10 batch 10.1 identity / access review / registry state matrices
formal_document_written = false
unresolved_upstream_blocker = 0
next_allowed_action = start_03_step_10_batch_10_2_after_user_confirmation
commit_required = false
```

当前停在batch `10.1`。用户确认后只进入`10.2`,先读取§12第二行指定材料以及本文件§14~§18,再逐个完成descriptor、risk summary、secret safe summary、governance seam和method relation矩阵；不得跨到`10.3`。

---

## 19. Batch `10.2` 输入复核与受控回开

### 19.1 Exact contract读取结论

| 状态主语 | Step 6 owner / callable | Current Step 9 flow | 本批裁决 |
|---|---|---|---|
| `AdapterDescriptorState` | `AdapterDescriptor::{draft_for_entry,accept,mark_unresolved,attach_risk_summary,attach_secret_ref,replace_with,retire}` | establish / replace descriptor、record risk summary、attach secret reference | `Draft`只在同一UoW内形成；persisted current只接受`Accepted / Unresolved`；replacement与attachment exact source闭合 |
| `DescriptorRiskConstraintSummaryState` | `DescriptorRiskConstraintSummary::{derive,mark_partial,mark_unavailable,supersede}` | record descriptor risk / constraint summary | factory只形成`Available / Partial`；old current replacement可到`Superseded`；degradation / recovery无current protocol |
| `SecretHandlingSafeSummaryState` | `SecretHandlingSafeSummary::{create,mark_stale,mark_unavailable,forbid}` | attach descriptor secret reference | factory只形成`Available / Unavailable`；Forbidden candidate拒绝；existing summary没有current mutation flow |
| `GovernanceSeamState` | `GovernanceSeamRelation::{create,activate,mark_unresolved,mark_expired,forbid,replace_with}` | attach / replace / expire governance seam | `Pending`只在attach / replacement同一UoW内形成；current persisted state为`Active / Unresolved / Expired`；`Replaced / Forbidden` terminal |
| `CapabilityMethodRelationState` | `CapabilityMethodBodyFreeRelation::{create,activate,mark_stale,mark_unresolved,remove,forbid}` | attach / remove capability-method relation | `Pending`只在attach同一UoW内形成；current persisted state为`Active / Unresolved`；`Removed / Forbidden` terminal |

补读Step 7后确认:governance / method repository的current lookup必须保留current degraded relation,不得只返回active。否则attach duplicate guard会把已存在的Unresolved relation误判为不存在,进而形成第二条current relation。

### 19.2 Controlled reopen

| Blocker ID | 冲突 | 最小修正 | 状态 |
|---|---|---|---|
| `CH-DDD-S10-DESCRIPTOR-SUMMARY-REACHABILITY-001` | replacement flow实际接受old `Accepted / Unresolved`,但旧variant表漏`Unresolved -> Replaced`且member source guard不穷尽；risk-summary factory未固定closed risk / marker到initial state的映射 | Step 6收紧existing descriptor attachment / replacement source；固定known risk -> Available、Unknown -> Partial、ForbiddenBody -> rejection；Step 8/9同步exact guard与结果 | resolved_during_03_step_10_batch_10_2 |
| `CH-DDD-S10-RELATION-CURRENT-INDEX-001` | method repository旧说明只返回active / pending,会遗漏current Unresolved；replace / remove flow也未完全区分current可达state与future reserved state | Step 7 existing current lookup收紧为non-terminal state subset；Step 8/9 replace / remove route增加exact current parity并只接受current persisted state | resolved_during_03_step_10_batch_10_2 |

受控回开没有新增public struct、field、enum、variant、payload、callable、trait、Port、protocol或flow。43个HLD objects + 7个application technical helpers、36个Port、83个protocol / 83个flow保持不变；existing public declaration英文`///`未改变,结构体 / 字段注释遗漏为0。

---

## 20. `AdapterDescriptorState` 状态矩阵

### 20.1 状态集合与ASCII图

```text
[AdapterDescriptor]
  draft_for_entry -> Draft (transaction-local)
  Draft --resolved + boundary pass--> Accepted
  Draft --recoverable unresolved--> Unresolved

  current Accepted / Unresolved --distinct accepted replacement--> Replaced

  reserved:
    Accepted -> Unresolved
    Unresolved -> Accepted
    Draft / Accepted / Unresolved -> Retired

  Replaced / Retired -> terminal
```

| 状态 | 作用 | 持久化可达性 | 是否终态 | 不得解释为 |
|---|---|---|---|---|
| `Draft` | 尚未通过body-free boundary / reference校验的形成态 | current flow只在同一UoW内存在,不单独save / capture | 否 | 可被Query读取的current descriptor或provider draft |
| `Accepted` | 当前可用于formal prerequisite判断的body-free descriptor | establish / replacement resolved branch可达 | 否 | provider runtime可用、执行成功或secret可访问 |
| `Unresolved` | source或supporting document暂不可解析 | establish recoverable branch可达 | 否 | descriptor已删除或registry已退役 |
| `Replaced` | distinct accepted descriptor已替换当前descriptor | replace flow对old current形成 | 是 | 新descriptor状态或delete marker |
| `Retired` | descriptor显式退役后的historical状态 | existing callable存在,无current protocol | 是 | registry / identity / exposure级联退役 |

### 20.2 Current formation与转换矩阵

| From | To | Step 6触发函数 | Step 9 flow | Exact前置条件 | 对象字段 / version副作用 | Flow副作用 / propagation class | 非法时错误类别 |
|---|---|---|---|---|---|---|---|
| factory | `Draft` | `AdapterDescriptor::draft_for_entry(...)` | establish / replace adapter descriptor | active identity；same-owner non-retired registry；exact source ref / kind / body-free boundary；new id | 初始化所有字段；`state=Draft`,`version=1`,created / updated time相同；只在内存 | 还不是accepted truth；不得save / record / trace / capture | domain / policy / body boundary error |
| `Draft` | `Accepted` | `AdapterDescriptor::accept(...)` | `command_establish_adapter_descriptor_flow`;replacement new-object branch | source canonical state Resolved；kind / source / registry owner对称；optional document resolved；boundary marker非ForbiddenBody；replacement branch还要求old exact current可替换 | state=Accepted；version +1；updated_at=now；one Created record解释final revision | establish:descriptor + actual registry bind + optional document + histories / traces / captures / material + result同UoW；replace:new descriptor与old / registry / optional document同UoW；`same_uow_local_required` + `same_uow_actual_stale` | PolicyRejected / BodyForbidden / InvalidStateTransition |
| `Draft` | `Unresolved` | `AdapterDescriptor::mark_unresolved(...)` | `command_establish_adapter_descriptor_flow` only | source / optional document为recoverable unresolved / stale / unavailable；candidate非Invalid / Forbidden；reason / marker body-free | state=Unresolved；version +1；one MarkedUnresolved record；Draft不单独持久化 | final Unresolved descriptor保存；registry仅actual非Undescribed时进入Undescribed；one or two subject atomic set；replacement不接受unresolved new descriptor | PolicyRejected / BodyForbidden / InvalidStateTransition |
| `Accepted` / `Unresolved` | `Replaced` | `AdapterDescriptor::replace_with(...)` | `command_replace_adapter_descriptor_flow` | old exact ref等于current-by-entry；owner identity Active；new distinct descriptor已经Accepted；replacement id不同；optional document rebind与registry bind均可成功 | old state=Replaced；version +1；one Replaced record；risk / secret refs只作historical retention | new Accepted + old Replaced + registry DescriptorBound / VisibilityPending + optional document + separate records / traces / captures + typed-union actual materials同UoW；`same_uow_local_required` + `same_uow_actual_stale` | PolicyRejected / BodyForbidden / consistency / conflict |

replacement必须先使new descriptor达到Accepted,再改变old。若new source / document unresolved,whole flow稳定拒绝,old descriptor、registry和document均不变；不得把new Unresolved保存后仍替换old。

### 20.3 Current same-state mutation

| State保持 | Callable / flow | Actual delta guard | 对象副作用 | 同UoW副作用 | No-op / rejection |
|---|---|---|---|---|---|
| `Accepted -> Accepted`;`Unresolved -> Unresolved` | `attach_risk_summary(...)`;`command_record_descriptor_risk_constraint_summary_flow` | new summary属于same descriptor、non-Superseded且id不同；current descriptor必须Accepted / Unresolved | `risk_summary_id`替换为new id；state不变；version +1；one RiskSummaryChanged record previous=next=current state | optional old summary Superseded + new summary + descriptor revision / record / trace / capture + actual stale material + result/completion | same summary id、wrong owner、Superseded summary或Draft / terminal descriptor拒绝；不得save synthetic same-state revision |
| `Accepted -> Accepted`;`Unresolved -> Unresolved` | `attach_secret_ref(...)`;`command_attach_descriptor_secret_reference_flow` | current secret ref必须None；new SecretRef / canonical state / safe summary exact对称；state非Forbidden | `secret_ref_id`从None变Some；state不变；version +1；SecretReferenceChanged与SafeSummaryChanged两条record都解释同一final revision | new ref/state/safe summary + descriptor + two records / one trace / three core captures + actual stale material + result/completion同UoW | existing secret ref、same / wrong owner、Forbidden state / marker或Draft / terminal descriptor拒绝；不覆盖旧secret ref |

same-state attachment是实际字段变化,不是lifecycle no-op。Query、reference refresh、formal exposure evaluation、runtime、SDK、search与marketplace都不能调用这两个member。

### 20.4 Reserved与illegal方向

| From | To | 分类 / callable | Current flow | 规则 |
|---|---|---|---|---|
| `Accepted` | `Unresolved` | reserved；existing `mark_unresolved(...)` | none | future source-prerequisite maintenance必须新增正式protocol / history / material flow；reference refresh不能直接调用 |
| `Unresolved` | `Accepted` | reserved；existing `accept(...)` | none | future recovery必须重读exact source / document并形成Accepted record；不得由Query / Job修复 |
| `Draft` / `Accepted` / `Unresolved` | `Retired` | reserved；existing `retire(...)`;Draft source current unreachable | none | future retirement需定义public intent、dependent guard与non-cascade side effects；callable guard仅接受这三个source |
| `Draft` | `Replaced` | illegal | none | transaction-local object尚非current,不能被替换 |
| any non-Draft | `Draft` | illegal | none | 无回退到形成态 |
| `Accepted` | `Accepted`;`Unresolved` | `Unresolved`;terminals same target | no lifecycle transition | attachment之外same target不调用state member；exact no-op / illegal均不造history |
| `Replaced` / `Retired` | any different state | terminal illegal | none | 只能history read；尤其`Replaced -> Retired`不得因旧`non-retired`措辞被放行；新能力需要new descriptor,不得原地恢复 |

Exact different-state pair分类:

```text
current (4):
  Draft -> Accepted / Unresolved
  Accepted / Unresolved -> Replaced

reserved (5):
  Draft -> Retired
  Accepted -> Unresolved / Retired
  Unresolved -> Accepted / Retired

illegal (11):
  all remaining different-state pairs
```

### 20.5 传播与测试切口

| Source变化 | same-UoW local | actual material | post-commit | 明确不传播 |
|---|---|---|---|---|
| establish Accepted | descriptor + registry bind + optional document + records / traces / captures / result | descriptor / registry typed union后每material最多一次stale | official captures后续body-free collaboration失败不回滚truth | 不创建exposure、runtime route、provider health或secret body |
| establish Unresolved | descriptor + optional actual registry Undescribed | changed subject实际命中且non-stale才revision | 同上 | 不伪造Accepted、document binding或FormalVisible |
| replacement | new / old descriptor + registry + optional document及各自sidecars | multi-subject先collect / typed union,each material once | 同上 | old risk / secret history不删除,不级联external source |
| risk / secret attachment | supporting local truth + descriptor same-state revision | descriptor subject一次scan | 同上 | 不改descriptor lifecycle、registry、governance approval或KMS / Vault truth |

Step 16至少承接:resolved / recoverable establish、replacement old Accepted / Unresolved、unresolved new replacement rejection、Draft不持久化、risk / secret attachment两种descriptor state、same-id / existing-secret rejection、Replaced / Retired terminal、registry / document / material conflict whole rollback、Query / Job / runtime negative authority。

### 20.6 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / variant与Step 6 exact一致 | pass | 5 / 5 variants |
| initial / formation state有factory | pass | Draft transaction-local,final only Accepted / Unresolved |
| 每条current transition有member | pass after controlled reopen | Unresolved -> Replaced source guard已闭合 |
| 每条current transition回指exact Step 9 flow | pass | establish / replace两条flow |
| same-state mutation / no-op分离 | pass | risk / secret field delta与lifecycle no-op分离 |
| terminal / degraded / reserved方向明确 | pass | Replaced / Retired terminal；recovery / retirement reserved |
| state field / version / time副作用明确 | pass | formation与existing mutation分别闭合 |
| cross-state propagation class明确 | pass | descriptor / registry / document atomic set与actual material union |
| illegal path无fake history / capture / result | pass | unresolved replacement与terminal routeswhole reject |
| query / external owner / no-truth-repair边界通过 | pass | runtime / Job / Query均无descriptor mutation authority |
| test cuts可由后续Step 16承接 | pass | 未声称测试已执行 |

---

## 21. `DescriptorRiskConstraintSummaryState` 状态矩阵

### 21.1 状态集合与ASCII图

```text
[DescriptorRiskConstraintSummary]
  derive(known risk + non-forbidden marker) -> Available
  derive(Unknown + non-forbidden marker)    -> Partial
  derive(ForbiddenBody)                     -> rejection

  old current Available / Partial / Unavailable
    --new summary replacement--> Superseded

  reserved degradation:
    Available -> Partial / Unavailable
    Partial -> Unavailable
    Unavailable -> Partial

  reserved recovery without callable:
    Partial / Unavailable -> Available
```

| 状态 | 作用 | Current形成 / 到达 | 是否终态 | 不得解释为 |
|---|---|---|---|---|
| `Available` | known coarse risk与safe constraints完整可用 | current factory形成 | 否 | governance approval、runtime allow或低风险保证 |
| `Partial` | body-free材料足够保留摘要但risk仍Unknown | current factory形成 | 否 | Available或无约束 |
| `Unavailable` | 当前摘要不能被提供 | current factory不形成；member存在但无current flow | 否 | low risk、missing summary或technical repository error |
| `Superseded` | newer summary替代old current | current record-summary flow形成 | 是 | 删除或新summary状态 |

### 21.2 Formation与current replacement矩阵

| From | To | Step 6触发函数 | Step 9 flow | Exact前置条件 | 对象字段 / version副作用 | Flow副作用 / propagation class | 非法时错误类别 |
|---|---|---|---|---|---|---|---|
| factory | `Available` | `DescriptorRiskConstraintSummary::derive(...)` | `command_record_descriptor_risk_constraint_summary_flow` | descriptor exact current Accepted / Unresolved；review exact current Recorded / Separated且owner chain对称；risk=`Low / Medium / High / Critical`;constraint safe non-empty；marker BodyFree / ReferenceOnly | new summary完整字段；state=Available；version=1；created / updated相同 | new summary + descriptor risk-summary-id same-state revision；optional old summary Superseded；descriptor record / trace / capture、actual materials、result同UoW；`same_uow_local_required` + `same_uow_actual_stale` | PolicyRejected / BodyForbidden / InvalidField |
| factory | `Partial` | same `derive(...)` | same flow | 同上但risk=`Unknown`;safe constraint必须明确说明未知边界,不能是empty或低风险伪装；marker非ForbiddenBody | new summary state=Partial；risk保持Unknown；version=1 | 与Available branch同一atomic set；public result返回actual Partial | PolicyRejected / BodyForbidden / InvalidField |
| `Available` / `Partial` / `Unavailable` | `Superseded` | `DescriptorRiskConstraintSummary::supersede(...)` | same flow when prior current exists | old exact current summary属于same descriptor；new summary id different且new derive已成功；old不是Superseded | old state=Superseded；version +1；updated_at=now；replacement id只作guard,不改new object | old save + new save + descriptor attach与所有sidecars同UoW；任一old/new/descriptor conflict whole rollback | InvalidStateTransition / consistency / conflict |

`derive(...)`不会形成Unavailable或Superseded。ForbiddenBody不是一个可持久化的summary outcome；它在factory前 / factory内稳定拒绝并且不保留命中正文。

### 21.3 Reserved、no-op与illegal方向

| From | To | 分类 / callable | Current flow | Exact处理 |
|---|---|---|---|---|
| `Available` | `Partial` | reserved；existing `mark_partial(...)` | none | future degradation flow必须提供safe reason、history / material语义；same-state拒绝 |
| `Available` / `Partial` | `Unavailable` | reserved；existing `mark_unavailable(...)` | none | repository / resolver technical error不能直接持久化Unavailable |
| `Unavailable` | `Partial` | reserved；existing `mark_partial(...)` | none | 不是Available recovery；需future正式input说明仍可保留哪些safe fields |
| `Partial` / `Unavailable` | `Available` | reserved without callable | none | 只能new summary factory形成new Available并supersede old；不得原地赋值或由Query修复 |
| any state | same state | no accepted mutation | none | `mark_partial`对Partial、`mark_unavailable`对Unavailable、`supersede`对Superseded均拒绝；version / time / save / capture为0 |
| `Superseded` | any different state | terminal illegal | none | historical summary只读；恢复必须new summary |

Exact different-state pair分类:

```text
current (3):
  Available / Partial / Unavailable -> Superseded

reserved (6):
  Available -> Partial / Unavailable
  Partial -> Available / Unavailable
  Unavailable -> Available / Partial

illegal (3):
  Superseded -> Available / Partial / Unavailable
```

### 21.4 传播与测试切口

current flow只把summary state变化作为descriptor risk-summary replacement atomic member。summary本身没有独立change record / outbound event；one `RiskSummaryChanged` descriptor record解释final descriptor revision。material scan的source是descriptor,old / new summary不得分别触发重复scan。

Step 16至少承接:四个known risk均形成Available、Unknown形成Partial、Unknown + empty / misleading constraint拒绝、ForbiddenBody拒绝、old Available / Partial / Unavailable各自Superseded、same replacement id拒绝、Superseded terminal、descriptor attachment / material / capture failure whole rollback、mark partial / unavailable与in-place recovery current invocation count为0。

### 21.5 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / variant与Step 6 exact一致 | pass | 4 / 4 variants |
| initial / formation state有factory | pass after controlled reopen | known -> Available；Unknown -> Partial；ForbiddenBody rejects |
| 每条current transition有member | pass | `derive`;`supersede` |
| 每条current transition回指exact Step 9 flow | pass | record descriptor risk / constraint summary |
| same-state mutation / no-op分离 | pass | current无same-state mutation；repeat member拒绝 |
| terminal / degraded / reserved方向明确 | pass | Superseded terminal；Unavailable formation与recovery reserved |
| state field / version / time副作用明确 | pass | create=1；old supersede +1 |
| cross-state propagation class明确 | pass | summary replacement + descriptor revision same UoW |
| illegal path无fake history / capture / result | pass | forbidden / owner / old terminal失败whole rollback |
| query / external owner / no-truth-repair边界通过 | pass | Query只读；Job不修risk truth |
| test cuts可由后续Step 16承接 | pass | 未声称测试已执行 |
---
## 22. `SecretHandlingSafeSummaryState` 状态矩阵

### 22.1 状态集合与ASCII图

```text
[SecretHandlingSafeSummary]
  create(Resolved + non-forbidden marker)                  -> Available
  create(Unresolved / Stale / Unavailable + non-forbidden) -> Unavailable
  create(Invalid / Forbidden or Forbidden marker)          -> rejection

  reserved existing-summary directions:
    Available -> Stale / Unavailable / Forbidden
    Stale -> Available / Unavailable / Forbidden
    Unavailable -> Available / Stale / Forbidden

  Forbidden -> terminal for current candidate
```

| 状态 | 作用 | Current形成 / 到达 | 是否终态 | 不得解释为 |
|---|---|---|---|---|
| `Available` | body-free handling summary可按marker参与受控读取 | current factory在canonical secret state Resolved时形成 | 否 | secret值可读、KMS健康或runtime credential可用 |
| `Stale` | existing summary可能已过时 | existing member存在,无current flow | 否 | canonical reference Stale的复制字段；两者owner独立 |
| `Unavailable` | summary shell已成立,但canonical secret ref当前不可解析 / stale / unavailable | current factory在recoverable non-resolved时形成 | 否 | secret不存在、provider technical error或低风险 |
| `Forbidden` | existing candidate被body boundary终止 | member存在,但current attach flow在持久化前拒绝 | 是 | secret正文已安全持久化或redacted secret value |

### 22.2 Current formation矩阵

| From | To | Step 6触发函数 | Step 9 flow | Exact前置条件 | 对象字段 / version副作用 | Flow副作用 / propagation class | 非法时错误类别 |
|---|---|---|---|---|---|---|---|
| factory | `Available` | `SecretHandlingSafeSummary::create(...)` | `command_attach_descriptor_secret_reference_flow` | new SecretRef与canonical state id / subject / kind对称；resolution=Resolved；handling boundary safe；marker=`ConsumerSafe / RedactionRequired`;descriptor exact current Accepted / Unresolved且无secret ref | new summary完整字段；state=Available；version=1；created_at=refreshed_at=now | new SecretRef + canonical state + summary + descriptor same-state revision + two descriptor records / one trace / one reference capture / two descriptor captures + actual materials + result同UoW；`same_uow_local_required` + `same_uow_actual_stale` | PolicyRejected / BodyForbidden / resolver consistency |
| factory | `Unavailable` | same `create(...)` | same flow | resolution=`Unresolved / Stale / Unavailable`;candidate仍合法且marker非Forbidden；其余owner / boundary guard同上 | new summary state=Unavailable；安全字段保留；version=1 | 与Available branch相同atomic set；public result显式返回Unavailable,不得伪装Available | PolicyRejected / BodyForbidden / resolver consistency |

`Invalid` canonical state不是recoverable Unavailable summary；它稳定拒绝。`Forbidden` canonical state或`ExposureSafetyMarker::Forbidden`映射为BodyForbidden并且ref/state/summary/descriptor全部不保存。`Expired`不属于Secret kind允许的initial subset。

### 22.3 Reserved、no-op与illegal方向

| From | To | 分类 / callable | Current flow | Exact处理 |
|---|---|---|---|---|
| `Available` | `Stale` | reserved；existing `mark_stale(...)` | none | future source-change flow需加载exact summary与canonical ref,不得由reference refresh自动调用 |
| `Available` / `Stale` | `Unavailable` | reserved；existing `mark_unavailable(...)` | none | technical resolver error不自动变domain state；必须有正式safe reason / transaction |
| `Available` / `Stale` / `Unavailable` | `Forbidden` | reserved；existing `forbid(...)` | none | future boundary reclassification只保存typed reason / Forbidden marker,不得保存matched body |
| `Stale` / `Unavailable` | `Available` | reserved without callable | none | repair使用new candidate / new summary factory,或先正式回开refresh callable；不得原地赋值 |
| `Unavailable` | `Stale` | reserved without callable | none | HLD保留degraded方向,当前不可调用；不得用canonical state字符串替代member |
| any state | same state | no accepted mutation | none | same-state member调用拒绝；version / refreshed_at / repository / descriptor record / capture均为0 |
| `Forbidden` | any different state | terminal illegal | none | current candidate不能恢复；new safe summary必须new id且经正式attachment / replacement边界 |

Exact different-state pair分类:

```text
current (0):
  no existing-summary transition in current protocol boundary

reserved (9):
  Available -> Stale / Unavailable / Forbidden
  Stale -> Available / Unavailable / Forbidden
  Unavailable -> Available / Stale / Forbidden

illegal (3):
  Forbidden -> Available / Stale / Unavailable
```

### 22.4 传播与测试切口

Safe summary formation与SecretRef / canonical state / descriptor attachment是一个local atomic set。summary没有独立change record或独立outbound event；`SafeSummaryChanged` descriptor record解释final descriptor revision。后续canonical reference transition可让derived material stale,但不能直接改safe-summary state；Query只能组合persisted summary与canonical state形成degraded read surface。

Step 16至少承接:Resolved + ConsumerSafe / RedactionRequired -> Available、Unresolved / Stale / Unavailable -> Unavailable、Invalid / Forbidden / Forbidden marker拒绝、descriptor Accepted / Unresolved attachment、existing secret ref拒绝、all nine reserved direction invocation count=0、Forbidden terminal、resolver mismatch / capture / material / descriptor conflict whole rollback、no secret value / token / ciphertext persistence。

### 22.5 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / variant与Step 6 exact一致 | pass | 4 / 4 variants |
| initial / formation state有factory | pass | Available / Unavailable exact mapping；forbidden candidates reject |
| 每条current transition有member | pass | current existing-summary transition为0；formation有create |
| 每条current transition回指exact Step 9 flow | pass | attach descriptor secret reference |
| same-state mutation / no-op分离 | pass | no existing accepted same-state mutation |
| terminal / degraded / reserved方向明确 | pass | Forbidden terminal；9个future方向reserved |
| state field / version / time副作用明确 | pass | create version=1；existing reserved member不声称执行 |
| cross-state propagation class明确 | pass | ref/state/summary/descriptor same UoW |
| illegal path无fake history / capture / result | pass | forbidden / invalid path全部local writes为0 |
| query / external owner / no-truth-repair边界通过 | pass | secret/KMS owner与canonical reference owner分离 |
| test cuts可由后续Step 16承接 | pass | 未声称测试已执行 |

---

## 23. `GovernanceSeamState` 状态矩阵

### 23.1 状态集合与ASCII图

```text
[GovernanceSeamRelation]
  create -> Pending (transaction-local)
  Pending --Resolved + policy pass--> Active
  Pending --recoverable non-resolved--> Unresolved

  current Active --explicit expiry--> Expired
  current Active / Unresolved / Expired
    --distinct new Active relation--> Replaced

  reserved:
    Unresolved / Expired -> Active
    Active / Expired -> Unresolved
    Unresolved / Expired -> Pending
    Pending / Active / Unresolved / Expired -> Forbidden

  Replaced / Forbidden -> terminal
```

| 状态 | 作用 | 持久化可达性 | 是否终态 | 不得解释为 |
|---|---|---|---|---|
| `Pending` | relation已创建但尚未闭合canonical governance ref | current flow只在同一UoW内形成,不单独save | 否 | governance workflow pending或approval pending |
| `Active` | body-free governance ref relation通过local policy,可作为exposure prerequisite之一 | attach / replacement new relation可达 | 否 | 本仓作出approval、Policy或runtime allow decision |
| `Unresolved` | governance ref当前不可安全解析 | attach recoverable branch可达 | 否 | governance拒绝或access review失败 |
| `Expired` | 本地relation显式标记引用 / allowed summary已过期 | expire Command可达 | 否 | external governance result已被本仓修改 |
| `Replaced` | distinct Active relation替换old relation | replace Command对old current形成 | 是 | delete或new relation state |
| `Forbidden` | candidate违反governance-body boundary | member存在,但current attach / replacement在保存前拒绝 | 是 | redacted approval正文已进入本仓 |

### 23.2 Current formation与转换矩阵

| From | To | Step 6触发函数 | Step 9 flow | Exact前置条件 | 对象字段 / version副作用 | Flow副作用 / propagation class | 非法时错误类别 |
|---|---|---|---|---|---|---|---|
| factory | `Pending` | `GovernanceSeamRelation::create(...)` | attach / replace governance seam | active identity；body-free GovernanceResultRef；allowed safe summary；new relation id；same capability endpoint | 初始化state=Pending、version=1；transaction-local | 尚不save / record / capture；后续必须在同UoW进入Active / Unresolved,否则rollback | PolicyRejected / BodyForbidden |
| `Pending` | `Active` | `GovernanceSeamRelation::activate(...)` | `command_attach_governance_seam_relation_flow`;replacement new relation branch | canonical state Resolved；ref id / state owner对称；GovernanceSeamPolicy pass；current relation absence或replacement context已证明old distinct | state=Active；version +1；Attached record解释final relation | attach:actual ref/state + relation / record / trace / captures / material / result；replace:new Active + old Replaced atomic；`same_uow_local_required` + `same_uow_actual_stale` | PolicyRejected / BodyForbidden / InvalidStateTransition |
| `Pending` | `Unresolved` | `GovernanceSeamRelation::mark_unresolved(...)` | `command_attach_governance_seam_relation_flow` | canonical state为recoverable Unresolved / Stale / Unavailable / Expired；candidate非Invalid / Forbidden；safe summary body-free | state=Unresolved；version +1；MarkedUnresolved record | actual ref/state + final Unresolved relation / record / trace / capture / actual materials + result同UoW；replacement flow不接受此branch | PolicyRejected / BodyForbidden / InvalidStateTransition |
| `Active` | `Expired` | `GovernanceSeamRelation::mark_expired(...)` | `command_expire_governance_seam_relation_flow` | exact seam等于current-by-identity；state Active；safe expiry reason；不调用resolver | state=Expired；version +1；Expired record | relation / record / trace / capture / actual stale materials / result同UoW；governance ref/state不变；`same_uow_local_required` + `same_uow_actual_stale` | PolicyRejected / InvalidStateTransition / conflict |
| `Active` / `Unresolved` / `Expired` | `Replaced` | `GovernanceSeamRelation::replace_with(...)` | `command_replace_governance_seam_relation_flow` | old exact seam等于current-by-identity；identity Active；new endpoint different；new relation已独立Active；old不是Pending / terminal | old state=Replaced；version +1；Replaced record；safe summary / ref保留historical | optional actual replacement ref/state + new Active + old Replaced + two records / traces / captures + unioned materials + result同UoW；任一失败whole rollback | PolicyRejected / BodyForbidden / consistency / conflict |

### 23.3 Reserved与illegal方向

| From | To | 分类 / callable | Current flow | Exact处理 |
|---|---|---|---|---|
| `Unresolved` / `Expired` | `Active` | reserved；existing `activate(...)` | none | future reactivation需exact resolved canonical state、policy、record / material flow；reference Consumer / Job不能直接调用 |
| `Active` / `Expired` | `Unresolved` | reserved；existing `mark_unresolved(...)` | none | canonical reference变化只改reference owner；seam degradation需future explicit maintenance flow |
| `Unresolved` / `Expired` | `Pending` | reserved without callable | none | HLD refresh-reopen方向；当前不得repository direct update或复用create |
| `Pending` | `Replaced` | reserved；existing `replace_with(...)` | none | Pending current persistence尚无flow；public replace route显式拒绝 |
| `Pending` / `Active` / `Unresolved` / `Expired` | `Forbidden` | reserved；existing `forbid(...)` | none | current resolver/body scanner在relation保存前拒绝；future persisted reclassification需正式protocol |
| `Pending` | `Expired`;`Active` | `Pending`;`Unresolved` | `Expired` | illegal | no member / no概要方向；不造history |
| `Replaced` / `Forbidden` | any different state | terminal illegal | none | historical / candidate terminal只读；继续关系必须new relation |

Exact different-state pair分类:

```text
current (6):
  Pending -> Active / Unresolved
  Active -> Expired / Replaced
  Unresolved / Expired -> Replaced

reserved (11):
  Unresolved / Expired -> Active
  Active / Expired -> Unresolved
  Unresolved / Expired -> Pending
  Pending -> Replaced
  Pending / Active / Unresolved / Expired -> Forbidden

illegal (13):
  Pending -> Expired
  Active -> Pending
  Unresolved -> Expired
  Replaced / Forbidden -> all five other states
```

### 23.4 Same-state、传播与authority

- 本状态机没有accepted same-state mutation。safe summary变化必须建立distinct replacement relation；same endpoint / same relation不能用replace制造revision。
- Attach与replacement可重观察canonical reference,但只在actual state value / reason变化时保存reference revision / capture；same observation不会造reference effect。
- Seam state change驱动relation record / trace / capture与actual material stale；它不改变identity、review、registry、formal exposure或external governance truth。后续exposure reevaluation必须由正式exposure Command执行。
- Governance inbound consumer只更新GovernanceResultRef / canonical state并形成`GovernanceSeamReview` follow-up marker；不能调用seam member。Query、Job、runtime、SDK与marketplace同样无seam mutation authority。
- Local truth / sidecars使用`same_uow_local_required`与`same_uow_actual_stale`；official capture后的event collaboration是`post_commit_body_free_collaboration`，失败不回滚seam。

Step 16至少承接:attach Resolved / each recoverable state、replacement old Active / Unresolved / Expired、Pending old rejection、same endpoint / non-active new rejection、Active expiry、reserved activation/degradation/forbidden invocation count=0、Replaced / Forbidden terminal、current-index包含Unresolved / Expired、shared material union once、governance body / approval negative boundary。

### 23.5 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / variant与Step 6 exact一致 | pass | 6 / 6 variants,含batch `10.0`补齐Replaced |
| initial / formation state有factory | pass | Pending transaction-local -> Active / Unresolved |
| 每条current transition有member | pass | activate / unresolved / expired / replace |
| 每条current transition回指exact Step 9 flow | pass | attach / replace / expire三flow |
| same-state mutation / no-op分离 | pass | 无accepted same-state mutation |
| terminal / degraded / reserved方向明确 | pass | Replaced / Forbidden terminal；11个reserved方向 |
| state field / version / time副作用明确 | pass | transaction-local formation与persisted existing revision分开 |
| cross-state propagation class明确 | pass | new/old seam replacement与actual material union闭合 |
| illegal path无fake history / capture / result | pass | non-active new / same endpoint / terminal均whole reject |
| query / external owner / no-truth-repair边界通过 | pass after Step 7 clarification | current degraded seam可读；external governance truth不复制 |
| test cuts可由后续Step 16承接 | pass | 未声称测试已执行 |

---

## 24. `CapabilityMethodRelationState` 状态矩阵

### 24.1 状态集合与ASCII图

```text
[CapabilityMethodBodyFreeRelation]
  create -> Pending (transaction-local)
  Pending --Resolved + body-free policy pass--> Active
  Pending --recoverable non-resolved--> Unresolved

  current Active / Unresolved --explicit remove--> Removed

  reserved:
    Stale / Unresolved -> Active
    Active -> Stale / Unresolved
    Stale -> Unresolved
    Stale / Unresolved -> Pending
    Pending / Stale -> Removed
    Pending / Active / Stale / Unresolved -> Forbidden

  Removed / Forbidden -> terminal
```

| 状态 | 作用 | 持久化可达性 | 是否终态 | 不得解释为 |
|---|---|---|---|---|
| `Pending` | relation形成后等待canonical method ref闭合 | current flow只在同一UoW内形成 | 否 | method-library publication pending或method workflow state |
| `Active` | body-free method asset relation当前成立 | attach resolved branch可达 | 否 | method body已复制、crate dependency已建立或method execution可用 |
| `Stale` | existing relation引用可能过时 | member存在,无current flow | 否 | canonical reference Stale字段副本 |
| `Removed` | relation被显式移除并保留history | remove flow可达 | 是 | method asset / ref被删除 |
| `Unresolved` | method ref当前不可解析 | attach recoverable branch可达 | 否 | relation不存在或method body无效 |
| `Forbidden` | candidate含method body或越界材料 | member存在,current attach在持久化前拒绝 | 是 | method body已redact后持久化 |

### 24.2 Current formation与转换矩阵

| From | To | Step 6触发函数 | Step 9 flow | Exact前置条件 | 对象字段 / version副作用 | Flow副作用 / propagation class | 非法时错误类别 |
|---|---|---|---|---|---|---|---|
| factory | `Pending` | `CapabilityMethodBodyFreeRelation::create(...)` | `command_attach_capability_method_relation_flow` | identity Active；body-free MethodAssetRef / scope；new relation id；no current non-terminal relation | state=Pending；version=1；transaction-local | 尚不save / capture；同一UoW必须进入Active / Unresolved | PolicyRejected / BodyForbidden / InvalidScope |
| `Pending` | `Active` | `CapabilityMethodBodyFreeRelation::activate(...)` | same attach flow | canonical state Resolved；method ref / state id / subject / digest对称；MethodRelationBoundaryPolicy pass | state=Active；version +1；Attached record | actual ref/state + relation / record / trace / captures / actual materials + result同UoW；`same_uow_local_required` + `same_uow_actual_stale` | PolicyRejected / BodyForbidden / InvalidStateTransition |
| `Pending` | `Unresolved` | `CapabilityMethodBodyFreeRelation::mark_unresolved(...)` | same attach flow | canonical state为recoverable Unresolved / Stale / Unavailable；candidate非Invalid / Forbidden；scope body-free | state=Unresolved；version +1；MarkedUnresolved record | 与Active branch相同atomic set；public result显式Unresolved | PolicyRejected / BodyForbidden / InvalidStateTransition |
| `Active` / `Unresolved` | `Removed` | `CapabilityMethodBodyFreeRelation::remove(...)` | `command_remove_capability_method_relation_flow` | exact relation等于current-by-identity；state为current flow可达Active / Unresolved；safe removal reason | state=Removed；version +1；Removed record；method ref / scope保留 | relation / record / trace / capture / actual stale materials / result同UoW；method ref/state与external asset不变；`same_uow_local_required` + `same_uow_actual_stale` | PolicyRejected / InvalidStateTransition / conflict |

### 24.3 Reserved与illegal方向

| From | To | 分类 / callable | Current flow | Exact处理 |
|---|---|---|---|---|
| `Stale` / `Unresolved` | `Active` | reserved；existing `activate(...)` | none | future recovery必须exact resolved canonical ref + policy + record；reference refresh不能直接修relation |
| `Active` | `Stale` | reserved；existing `mark_stale(...)` | none | future source-change flow；canonical state transition仅形成follow-up / material,不直接调用 |
| `Active` / `Stale` | `Unresolved` | reserved；existing `mark_unresolved(...)` | none | future degradation flow必须显式relation record / capture / material |
| `Stale` / `Unresolved` | `Pending` | reserved without callable | none | HLD refresh-reopen方向；不能repository direct update或复用factory |
| `Pending` / `Stale` | `Removed` | reserved；existing `remove(...)` | none | 当前public remove只接受persisted Active / Unresolved；Pending current不可达,Stale无current producer |
| `Pending` / `Active` / `Stale` / `Unresolved` | `Forbidden` | reserved；existing `forbid(...)` | none | current attach在save前BodyForbidden；future persisted reclassification需正式protocol |
| `Pending` | `Stale`;`Active` | `Pending`;`Unresolved` | `Stale` | illegal | 无member / 无概要方向 |
| `Removed` / `Forbidden` | any different state | terminal illegal | none | reattach必须new relation / id；不能原地恢复 |

Exact different-state pair分类:

```text
current (4):
  Pending -> Active / Unresolved
  Active / Unresolved -> Removed

reserved (13):
  Stale / Unresolved -> Active
  Active -> Stale
  Active / Stale -> Unresolved
  Stale / Unresolved -> Pending
  Pending / Stale -> Removed
  Pending / Active / Stale / Unresolved -> Forbidden

illegal (13):
  Pending -> Stale
  Active -> Pending
  Unresolved -> Stale
  Removed / Forbidden -> all five other states
```

### 24.4 Same-state、传播与authority

- 本状态机没有accepted same-state mutation。relation scope不能通过same-state update；变化需要new relation / future explicit protocol。
- Attach对Existing method ref可actual-delta-only更新canonical state；same observation不save / capture reference revision。relation仍由new object factory形成,不是旧relation recovery。
- Remove保留MethodAssetRef / canonical state和external method-library asset,不delete、不调用method-library、不修改publication / version / body truth。
- Method inbound consumer只更新ref / canonical state；不能调用relation member。Job、Query、runtime、SDK、search、marketplace与governance也无relation mutation authority。
- Local truth / sidecars为`same_uow_local_required`和`same_uow_actual_stale`;post-commit body-free collaboration失败不回滚relation。不存在对method body的传播。

Step 16至少承接:attach Resolved / each recoverable state、remove Active / Unresolved、Pending / Stale current-route rejection、current index返回Unresolved、reserved activation/stale/degradation/forbidden invocation count=0、Removed / Forbidden terminal、method ref/state retain、material actual-delta-only、method body/source/Cargo dependency negative boundary。

### 24.5 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / variant与Step 6 exact一致 | pass | 6 / 6 variants |
| initial / formation state有factory | pass | Pending transaction-local -> Active / Unresolved |
| 每条current transition有member | pass | activate / unresolved / remove |
| 每条current transition回指exact Step 9 flow | pass | attach / remove两flow |
| same-state mutation / no-op分离 | pass | 无accepted same-state mutation |
| terminal / degraded / reserved方向明确 | pass | Removed / Forbidden terminal；13个reserved方向 |
| state field / version / time副作用明确 | pass | create / terminal revision分开 |
| cross-state propagation class明确 | pass | ref/state/relation及material same-UoW边界闭合 |
| illegal path无fake history / capture / result | pass | pending/stale route与terminal均稳定拒绝 |
| query / external owner / no-truth-repair边界通过 | pass after Step 7 clarification | current Unresolved relation可读；method body owner独立 |
| test cuts可由后续Step 16承接 | pass | 未声称测试已执行 |

---


## 25. Batch `10.2` 跨状态机审计

### 25.1 Enum / edge / formation覆盖审计

| 审计项 | 期望 | 实际 | 结论 |
|---|---:|---:|---|
| batch owner state machine | 5 | 5 | pass |
| exact enum variant | descriptor 5 + risk 4 + secret 4 + seam 6 + method 6 = 25 | 25 / 25 | pass |
| accepted factory final outcome | 每机2,共10 | 10 | pass；transaction-local Draft / Pending不单独持久化 |
| current enum-internal different-state edge | 17 | descriptor 4 + risk 3 + secret 0 + seam 6 + method 4 = 17 | pass；含transaction-local formation到final state |
| reserved different-state edge | 44 | 5 + 6 + 9 + 11 + 13 = 44 | pass |
| illegal different-state edge | 43 | 11 + 3 + 3 + 13 + 13 = 43 | pass |
| descriptor accepted same-state attachment direction | 4 | risk / secret attachment each on Accepted / Unresolved = 4 | pass；都要求actual field delta |
| other four machine accepted same-state direction | 0 | 0 | pass |

五个enum共有:

```text
5 * (5 - 1)
+ 4 * (4 - 1)
+ 4 * (4 - 1)
+ 6 * (6 - 1)
+ 6 * (6 - 1)
= 104 possible different-state pairs

17 current + 44 reserved + 43 illegal = 104
unclassified = 0
```

Factory formation不计入enum内部different-state pair，但逐项闭合为:

```text
descriptor: Draft -> Accepted / Unresolved before first save
risk summary: factory -> Available / Partial
secret summary: factory -> Available / Unavailable
governance seam: Pending -> Active / Unresolved before first save
method relation: Pending -> Active / Unresolved before first save
```

### 25.2 Trigger / callable / current-index审计

| Owner | Current exact callable | Current exact Step 9 flow | 结果 |
|---|---|---|---|
| descriptor formation | `draft_for_entry`;`accept`;`mark_unresolved` | establish descriptor；replacement只接受Accepted new object | pass；Draft不单独持久化 |
| descriptor replacement | `replace_with` | replace adapter descriptor | pass after reopen；old Accepted / Unresolved only |
| descriptor attachment | `attach_risk_summary`;`attach_secret_ref` | record risk summary；attach secret ref | pass；same-state actual delta only |
| descriptor retirement | `retire` | none | reserved only；source限Draft / Accepted / Unresolved,Replaced / Retired拒绝 |
| risk summary | `derive`;`supersede` | record risk summary | pass after reopen；factory mapping deterministic |
| secret summary | `create` | attach secret ref | pass；existing mutation current count 0 |
| governance seam formation | `create`;`activate`;`mark_unresolved` | attach governance seam | pass；Pending transaction-local |
| governance seam replacement / expiry | `replace_with`;`mark_expired` | replace / expire seam | pass；exact current parity / state subset |
| method relation formation | `create`;`activate`;`mark_unresolved` | attach method relation | pass；Pending transaction-local |
| method relation removal | `remove` | remove method relation | pass after reopen；exact current Active / Unresolved |

Current-index审计:

- descriptor `find_current_by_registry_entry`可返回persisted `Accepted / Unresolved`,必须排除Replaced / Retired且不能返回transaction-local Draft。
- risk current index可返回Available / Partial / Unavailable,必须排除Superseded；new summary与old supersede同UoW。
- secret current lookup只返回已持久化summary；本批无existing summary write route,不能因canonical state变化隐式改summary。
- governance current lookup返回non-terminal `Pending / Active / Unresolved / Expired`;current flow实际可持久化Active / Unresolved / Expired,必须排除Replaced / Forbidden。
- method current lookup返回non-terminal `Pending / Active / Stale / Unresolved`;current flow实际可持久化Active / Unresolved,必须排除Removed / Forbidden。

### 25.3 Cross-machine transaction / propagation审计

| 场景 | Atomic set | No-op / rollback | 结论 |
|---|---|---|---|
| establish accepted descriptor | final Accepted descriptor、actual registry bind / Pending、optional document、records / traces / captures、actual materials、result/completion | any owner / version / capture / material failure whole rollback；Draft不保存 | pass |
| establish unresolved descriptor | final Unresolved descriptor、optional actual registry Undescribed、records / traces / captures、actual materials、result/completion | already Undescribed registry effect=0；invalid / forbidden source no descriptor | pass |
| replace descriptor | new Accepted、old Accepted / Unresolved -> Replaced、registry bind / Pending、optional document rebind、three subject sidecars、unioned materials | new unresolved / owner mismatch / any conflict leaves old current and all new artifacts absent | pass |
| risk summary replacement | new Available / Partial、optional old -> Superseded、descriptor same-state field revision、one descriptor history / trace / capture、actual materials | no independent summary event；old/new/descriptor/material any failure whole rollback | pass |
| secret summary formation | SecretRef + canonical state + Available / Unavailable summary + descriptor same-state revision、ordered descriptor histories / captures、actual materials | Invalid / Forbidden / forbidden marker writes 0；existing secret ref rejects before resolver | pass |
| attach governance seam | actual ref/state + final Active / Unresolved seam、record / trace / captures、actual materials | Pending不保存；same Existing observation no reference write；forbidden body writes no seam | pass |
| replace governance seam | optional actual ref/state + new Active + old Active / Unresolved / Expired -> Replaced、two records / traces / captures、unioned materials | non-active new / same endpoint / any conflict retains old current | pass |
| expire governance seam | Active -> Expired + one record / trace / capture + actual materials | no resolver / governance truth mutation；non-Active rejects | pass |
| attach method relation | actual ref/state + final Active / Unresolved relation、record / trace / captures、actual materials | Pending不保存；same observation no reference write；forbidden body writes no relation | pass |
| remove method relation | Active / Unresolved -> Removed + one record / trace / capture + actual materials | ref/state/external asset retained；non-current / reserved / terminal source rejects | pass |

所有accepted local truth变化使用`same_uow_local_required`;affected material只使用`same_uow_actual_stale`;official capture提交后的协作属于`post_commit_body_free_collaboration`。External resolver read无法回滚,但其raw response不保存；local UoW失败不留下accepted local truth。本批没有`async_follow_up_hint_only`直接relation mutation。

### 25.4 Authority / historical / fabrication审计

| 检查 | 结果 |
|---|---|
| descriptor与provider runtime / route / quota / cost / failover合并 | no |
| secret safe summary与secret正文 / KMS / Vault lifecycle合并 | no |
| governance seam与approval / Policy / shared_rules / workflow合并 | no |
| method relation与method body / source / publication / execution合并 | no |
| canonical reference变化直接修改descriptor / summary / relation truth | no；只允许正式Command current flow或future reserved protocol |
| Query / inbound / Job / runtime / SDK / search / marketplace反写五机 | no |
| 正式`02`概要候选方向被伪造成current flow | no；所有无flow方向均reserved |
| 旧正式`03` / README作为state truth | no；historical material only |
| 新public struct / struct field / enum / variant / payload | 0 |
| 新public callable / trait / Port / protocol / flow | 0 |
| 结构体 / 字段 / enum variant英文`///`遗漏 | 0；本批无新声明,existing注释保持完整 |
| 43 HLD objects + 7 application helpers / 36 Ports / 83 protocols / 83 flows | unchanged |
| 正式`03-详细设计.md`修改 | no |
| implementation ledger / planned boundary skeleton创建 | no |
| implementation commit /真实run_id /测试结果 / evidence alias /验收签署 | none |
| 当前unresolved upstream blocker | 0；本批两项local contract conflict已受控关闭 |
| 当前需要提交 | no |

---

## 26. Batch `10.2` 完成结论与停审

| Gate | 结果 |
|---|---|
| 用户允许进入`10.2` | pass |
| §12第二行、`10.1`停审与Step 6 / 7 / 8 / 9 exact inputs已读 | pass |
| descriptor状态集合 / 图 / matrix / illegal / stop review | pass |
| risk summary状态集合 / 图 / matrix / illegal / stop review | pass |
| secret safe summary状态集合 / 图 / matrix / illegal / stop review | pass |
| governance seam状态集合 / 图 / matrix / illegal / stop review | pass |
| method relation状态集合 / 图 / matrix / illegal / stop review | pass |
| all current rows有Step 6 callable + Step 9 flow | pass |
| factory / current / reserved / terminal / same-state / no-op分类 | pass |
| 104 possible different-state pairs分类 | pass；unclassified=0 |
| cross-owner UoW / propagation / current-index / authority | pass |
| controlled reopen | pass；descriptor replacement / retirement / summary reachability与relation current index已闭合 |
| Rustdoc / 结构注释门禁 | pass；无新声明或public symbol,existing注释完整 |
| 正式文档 / implementation artifact / commit | none |

```text
gate_status = 03_step_10_batch_10_2_completed_wait_user_review
completed_document = 03-详细设计.md
completed_step = Step 10 batch 10.2 descriptor / safe summary / governance seam / method relation state matrices
formal_document_written = false
unresolved_upstream_blocker = 0
next_allowed_action = start_03_step_10_batch_10_3_after_user_confirmation
commit_required = false
```

当前停在batch `10.2`。用户确认后只进入`10.3`,先读取§12第三行指定材料以及本文件§19~§26,再逐个完成formal exposure、formal visibility、traceability、impact和downstream feedback五张矩阵；不得跨到`10.4`,不得修改正式`03-详细设计.md`或创建implementation artifact。

---

## 27. Batch `10.3` 输入复核与受控回开

### 27.1 开工门禁与本批读取集

| 项 | 结论 |
|---|---|
| 用户授权 | pass；用户在`10.2`停审后回复“继续”,只授权进入`10.3` |
| 标准 | 已复读详细设计SOP Step 10、书写规范§5.9、中间产物规范和真相源闭环标准的状态主语 / callable门禁 |
| 直接前序 | §19~§26与batch `10.2`停审完整读取 |
| object contract | Step 6 §7.9、§7.10.3、§10.2~§10.10、§20.18 |
| protocol / flow | Step 8 §7.6 / §7.14.1~§7.14.6 / downstream Consumer card；Step 9 §19.1~§19.6、§29.3 |
| repository / UoW | Step 7 identity / exposure / visibility / trace / impact repositories、external-reference + canonical-state read、common write UoW |
| HLD | 正式`02-概要设计.md` §9~§10及`02_hld_step_09_state_machine.md`；只作概要方向,不同状态pair仍以当前Step 6 callable + Step 9 actual flow裁剪 |
| historical material | README、旧正式`03/05/06`及旧provider/runtime合并口径继续只作historical_material,未成为矩阵来源 |
| 本批停止点 | 五机矩阵及跨机审计完成后停审；不得进入`10.4` |

### 27.2 进入矩阵前发现的冲突

| ID | 冲突 | 若不回开的实现歧义 | 处理 |
|---|---|---|---|
| `CH-DDD-S10-EXPOSURE-VISIBILITY-APPLICABILITY-001` | `FormalApplicabilityScope`旧为opaque safe text；visibility policy / factory缺identity、完整prerequisite与scope / basis；caller仍可传target；Update先derive再降级；Suspend / Retire未验证pre-mutation visibility symmetry；MarkPending direct record reason漂移 | 实现只能解析文本、私造consumer allowlist、让incomplete Accepted / Suspended变Active,或接受stale visibility作为suspend依据 | 已在Step 6 / 8 / 9受控关闭 |
| `CH-DDD-S10-TRACE-REVISION-INVARIANT-001` | 从Partial进入HandoffPending / Superseded未明确清`gap_reason` | 可持久化与字段契约冲突的revision,且fake / durable可能不同 | 已在Step 6 / 8 / 9受控关闭 |

这两项都是本仓详细设计内部冲突,不是上游项目 blocker。正式`02`已把完整字段、guard和transaction ordering交给详细设计展开,所以本批不回改正式`02`。

### 27.3 回开后的唯一可落码顺序

```text
Establish:
  load Active identity + exact registry / descriptor / seam / optional method
    + prerequisite reference states + typed applicability members
  -> draft exposure
  -> prerequisites complete ? accept : mark_pending
  -> visibility.derive(full inputs;policy selects target)
  -> if Visible:activate against pre-activation symmetric fact
  -> visibility.reevaluate(final exposure;save only final fact)

Reevaluate:
  load exact exposure + current visibility + registry + Active identity
  -> require visibility source version == loaded exposure version
  -> load exact prerequisites + typed applicability members
  -> complete Pending/Unavailable:accept first
  -> incomplete Accepted/Active/Suspended:mark_unavailable first
  -> visibility.reevaluate(full normalized inputs;policy selects target)
  -> if Visible and exposure Accepted/Suspended:activate
  -> reevaluate final exposure;save only final fact

Suspend / Retire:
  require pre-mutation same-subject source-version symmetry
  -> mutate exposure
  -> mutate visibility with final exposure version
  -> save both or rollback both
```

不可替代规则:

- `FormalApplicabilityScope::contains(...)`只比较closed `CapabilityConsumerRef` typed equality；不得读取safe text、`Debug / Display`、prefix、delimiter或runtime allowlist。
- `FormalExposurePolicy::derive_visibility_state(...)`是target唯一authority；DTO、application service、registry state、consumer view、runtime或SDK均不能选`Visible`。
- `FormalVisibilityApplicability::derive / reevaluate`不能修复exposure lifecycle；exposure必须先按readiness归一。
- visibility pre/post symmetry、exposure / registry / visibility saves、history / traces / captures、actual material stale、stored result与idempotency completion仍在Step 9声明的同一UoW。
- optional post-commit handoff失败不回滚trace revision；downstream feedback不修改impact或source truth。

### 27.4 Pair分类基线

| State machine | variants | possible different-state pairs | current | reserved | illegal |
|---|---:|---:|---:|---:|---:|
| `FormalExposureState` | 7 | 42 | 16 | 0 | 26 |
| `FormalVisibilityState` | 5 | 20 | 9 | 4 | 7 |
| `TraceabilityState` | 4 | 12 | 2 | 7 | 3 |
| `CapabilityImpactState` | 5 | 20 | 0 | 10 | 10 |
| `DownstreamImpactSummaryState` | 5 | 20 | 0 | 13 | 7 |
| total | 26 exact variants | 114 | 27 | 34 | 53 |

`current`只表示83-flow current boundary确实形成该different-state pair,含transaction-local formation；`reserved`要求Step 6已有member但当前无Step 9 flow；`illegal`必须由domain guard拒绝并保持字段 / version / time零变化。Factory-selected initial state与same-state revision另列,不偷计入114个pair。

---

## 28. `FormalExposureState` 状态矩阵

### 28.1 状态集合与owner

| 状态 | 作用 | persisted current可达 | 是否终态 | 允许的关键操作 |
|---|---|---|---|---|
| `Draft` | establish transaction内组装owner refs | 否；只在首次UoW内存态 | 否 | `mark_pending`;`accept` |
| `Pending` | formal prerequisites尚未完整 | 是 | 否 | `accept`;`retire`；MarkPending intent可保持exposure不变 |
| `Accepted` | local formal prerequisite已接受但尚未形成final Active | 是 | 否 | `activate`;`mark_unavailable`;`retire` |
| `Active` | server formal exposure active | 是 | 否 | `suspend`;`mark_unavailable`;`retire` |
| `Suspended` | server主动挂起且source truth保留 | 是 | 否 | complete reevaluation后`activate`;incomplete时`mark_unavailable`;`retire` |
| `Unavailable` | 已接受或挂起exposure的local prerequisite不再完整 | 是 | 否 | explicit`mark_pending`;complete后`accept`;`retire` |
| `Retired` | historical terminal exposure | 是 | 是 | historical read only |

Owner与字段为`domain::exposure::FormalExposureBoundary.exposure_state`。本状态机不拥有formal visibility、registry、runtime authorization、SDK publication、marketplace listing、governance approval或method lifecycle。

### 28.2 ASCII 状态图

```text
factory
  |
  v
Draft ----mark_pending----> Pending ----accept----> Accepted
  |                           |                       |  \
  +-----------accept----------+                       |   +--mark_unavailable--> Unavailable
                                                      |                           |  \
                                                      +--activate--> Active       |   +--mark_pending--> Pending
                                                                     |  \         +------accept------> Accepted
                                                                     |   +--mark_unavailable--> Unavailable
                                                                     +--suspend--> Suspended
                                                                                     |  \
                                                                                     |   +--mark_unavailable--> Unavailable
                                                                                     +------activate----------> Active

Pending / Accepted / Active / Suspended / Unavailable --retire--> Retired
Retired --X--> any
```

### 28.3 Current转换矩阵

| # | From | To | Step 6触发 | Step 9 actual flow | 前置条件 | object delta / history | UoW /传播 | 非法时 |
|---:|---|---|---|---|---|---|---|---|
| 1 | Draft | Pending | `mark_pending(...)` | establish incomplete branch | new owner chain合法；policy readiness=false | state Pending;version 1->2;`MarkedPending` | first exposure + visibility + sidecars same UoW；Draft不保存 | invalid transition / invariant error |
| 2 | Draft | Accepted | `accept(...,identity,...,policy,...)` | establish complete branch | Active identity、exact chain、policy validate pass | state Accepted;version 1->2;`Created` | same as above | policy / invalid transition |
| 3 | Pending | Accepted | `accept(...)` | update Reevaluate recovery | pre-mutation visibility symmetric；readiness=true | state Accepted;version +1;`PrerequisitesAccepted` | final visibility / optional activation same UoW | policy / invalid transition |
| 4 | Unavailable | Pending | `mark_pending(...)` | update MarkPending | explicit typed pending intent；current exposure exact | state Pending;version +1;`MarkedPending` | visibility Pending + direct applicability record same UoW | invalid transition |
| 5 | Unavailable | Accepted | `accept(...)` | update Reevaluate recovery | readiness=true | state Accepted;version +1;`PrerequisitesAccepted` | final visibility / optional activation same UoW | policy / invalid transition |
| 6 | Accepted | Active | `activate(...,visibility,...)` | establish / update | visibility same exposure、Visible、source version=self.version | state Active;version +1;`Activated` | visibility re-resync before only final save | invariant / invalid transition |
| 7 | Suspended | Active | `activate(...)` | update Reevaluate | readiness=true；derived interim fact Visible且source-symmetric | state Active;version +1;`Activated` | same UoW;no runtime invocation | invariant / invalid transition |
| 8 | Active | Suspended | `suspend(...)` | suspend Command | trusted server actor；pre-visibility Visible + symmetric | state Suspended;version +1;`Suspended` | visibility Unavailable + registry actual delta + sidecars atomic | policy / invalid transition |
| 9 | Accepted | Unavailable | `mark_unavailable(...)` | update Reevaluate | readiness=false before visibility derivation | state Unavailable;version +1;`MarkedUnavailable` | visibility derives Unavailable;no activation | invalid transition |
| 10 | Active | Unavailable | `mark_unavailable(...)` | update Reevaluate or MarkPending | readiness=false or explicit pending intent | state Unavailable;version +1;`MarkedUnavailable` | visibility Unavailable/Pending andregistry Pending actual delta | invalid transition |
| 11 | Suspended | Unavailable | `mark_unavailable(...)` | update Reevaluate | readiness=false | state Unavailable;version +1;`MarkedUnavailable` | visibility Unavailable;no activation | invalid transition |
| 12 | Pending | Retired | `retire(...)` | retire Command | persisted current exposure + symmetric non-retired visibility | state Retired;version +1;`Retired` | visibility Retired + sidecars atomic | invalid transition |
| 13 | Accepted | Retired | `retire(...)` | retire Command | same | same | same | invalid transition |
| 14 | Active | Retired | `retire(...)` | retire Command | same | same | same | invalid transition |
| 15 | Suspended | Retired | `retire(...)` | retire Command | same | same | same | invalid transition |
| 16 | Unavailable | Retired | `retire(...)` | retire Command | same | same | same | invalid transition |

Current different-state pair count=`16`。`Draft -> Pending / Accepted`是同一establish UoW中的transaction-local formation edge；两者仍是actual callable edge,但Draft不能作为repository current source。

### 28.4 Illegal方向与same-state规则

| Source | Illegal targets | count | 原因 |
|---|---|---:|---|
| Draft | Active、Suspended、Unavailable、Retired | 4 | 必须先pending / accepted；失败Draft回滚而非retire |
| Pending | Draft、Active、Suspended、Unavailable | 4 | 不可回草稿、跳过Accepted或用suspend/unavailable替代readiness |
| Accepted | Draft、Pending、Suspended | 3 | MarkPending intent只改visibility；suspend只接受Active |
| Active | Draft、Pending、Accepted | 3 | 不能降级成历史中间态；pending intent使用Unavailable |
| Suspended | Draft、Pending、Accepted | 3 | recovery直接Active；incomplete进入Unavailable |
| Unavailable | Draft、Active、Suspended | 3 | complete必须先Accepted；不能跳激活或挂起 |
| Retired | Draft、Pending、Accepted、Active、Suspended、Unavailable | 6 | historical terminal |
| total |  | 26 | `16 current + 0 reserved + 26 illegal = 42` |

Exposure没有accepted same-state member mutation。Update MarkPending在`Pending / Accepted / Suspended`上保持exposure不变时,application不得调用`transition`、save exposure或伪造lifecycle record；visibility direct record仍可形成。Same-key duplicate只replay stored result,任何state member调用数均为0。

### 28.5 跨机副作用与测试切口

| 场景 | 必须原子 | 禁止传播 |
|---|---|---|
| establish / update | final exposure、one final visibility、actual registry delta、ordered exposure/registry records、one trace per changed subject、eligible captures、actual material stale、result/completion | runtime execution、SDK package、listing、approval、method body |
| suspend / retire | exposure + visibility exact pair、actual registry delta及全部sidecars | partial commit、临时补visibility、consumer-triggered mutation |
| post-commit | body-free event collaboration only after local commit | collaboration failure回滚exposure |

Step 16至少承接16条current edge、26条illegal edge、Draft不持久化、Pending/Accepted/Suspended MarkPending exposure no-op、pre/post visibility symmetry、Retired terminal、duplicate no-call以及任一sidecar失败whole rollback。这里只定义test cuts,不声称测试已运行。

### 28.6 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / state field exact | pass | 7 / 7 variants,owner=`FormalExposureBoundary` |
| factory / persisted reachability | pass | Draft transaction-local；其余6态由current flows形成 |
| current edge有callable + flow | pass | 16 / 16 |
| reserved / illegal全分类 | pass | 0 reserved + 26 illegal |
| same-state / no-op | pass | 无domain same-state；3类MarkPending exposure no-op显式 |
| terminal / field delta | pass | Retired terminal；illegal零mutation |
| cross-owner UoW | pass after reopen | identity/prerequisite read、visibility / registry write和material sidecars闭合 |
| authority boundary | pass | no runtime / SDK / listing / governance approval merge |

---

## 29. `FormalVisibilityState` 状态矩阵

### 29.1 状态集合与formation

| 状态 | 作用 | current formation / reachability | 是否终态 | 允许的关键操作 |
|---|---|---|---|---|
| `NotVisible` | Draft exposure的policy classification | current flow不持久化；reserved formation | 否 | future reevaluate / pending / retire |
| `Pending` | visibility / applicability等待prerequisite或显式pending | establish factory、update | 否 | reevaluate、mark pending、retire |
| `Visible` | formal server visibility成立 | establish / update policy outcome | 否 | reevaluate、mark pending、suspend-linked unavailable、retire、pure consumer membership |
| `Unavailable` | exposure暂停或normalized unavailable | update / suspend | 否 | reevaluate、mark pending、retire |
| `Retired` | exposure retirement的historical visibility fact | retire | 是 | historical read only |

Factory `derive(...)`在current establish只持久化`Pending / Visible`。`NotVisible`可由policy对Draft分类,但Draft在derive前已归一且不会单独保存；`Unavailable / Retired`由后续member形成。Factory formation不计入different-state pair。

### 29.2 ASCII 状态图

```text
reserved Draft classification
          |
          v
      NotVisible ..........> Pending / Visible / Unavailable / Retired
                              (reserved: no current persisted NotVisible source)

current persisted core:

Pending --------reevaluate--------> Visible
   |  \                                |  \
   |   +--reevaluate----------------> Unavailable
   |                                   |   +--mark_pending--> Pending
   +----------------retire-----------> Retired
                                       |   +--suspend/reevaluate--> Unavailable
Unavailable --mark_pending-----------> Pending
Unavailable --reevaluate-------------> Visible
Unavailable ----------------retire---> Retired
Visible ---------------------retire---> Retired

Retired --X--> any
```

### 29.3 Current不同状态转换矩阵

| # | From | To | Step 6触发 | Step 9 actual flow | exact guard / source | fact delta | paired exposure effect |
|---:|---|---|---|---|---|---|---|
| 1 | Pending | Visible | `reevaluate(...)` | update recovery | source fact symmetric；complete Pending/Unavailable exposure先accept | state/scope/basis/source version/version/time更新 | Accepted随后同UoWactivate并final resync |
| 2 | Pending | Unavailable | `reevaluate(...)` | update degradation | current exposure Accepted且visibility曾explicit Pending；readiness=false后exposure先Unavailable | same | no activation |
| 3 | Pending | Retired | `retire(...)` | retire | pre-retire symmetric non-retired fact | state Retired、source=final exposure version、version+1 | exposure Retired |
| 4 | Visible | Pending | `mark_pending(...)` | update MarkPending | current fact Visible；Active exposure先Unavailable,或valid non-active exposure保持 | state Pending、source=final exposure version、version+1 | exposure actual delta only when Active |
| 5 | Visible | Unavailable | `reevaluate(...)` or `mark_unavailable(...)` | update degradation / suspend | reevaluate先degrade exposure；suspend要求pre-state Visible+symmetric | state Unavailable、source final version、version+1 | exposure Unavailable or Suspended |
| 6 | Visible | Retired | `retire(...)` | retire | symmetric current fact | terminal revision | exposure Retired |
| 7 | Unavailable | Pending | `mark_pending(...)` | update MarkPending | final exposure Pending / Accepted / Suspended / Unavailable合法branch | state Pending、source final version、version+1 | Unavailable exposure may->Pending |
| 8 | Unavailable | Visible | `reevaluate(...)` | update recovery / resume | prerequisites complete；Pending/Unavailable exposure先Accepted；Suspended可直接activation candidate | state Visible then final source resync | Accepted/Suspended -> Active |
| 9 | Unavailable | Retired | `retire(...)` | retire | symmetric current fact | terminal revision | exposure Retired |

### 29.4 Reserved、illegal与same-state revision

| Classification | Pair / direction | count | contract |
|---|---|---:|---|
| reserved | NotVisible -> Pending | 1 | existing `mark_pending / reevaluate`,但无persisted NotVisible current flow |
| reserved | NotVisible -> Visible | 1 | existing policy-driven `reevaluate`,future flow必须先证明合法exposure normalization |
| reserved | NotVisible -> Unavailable | 1 | existing policy-driven `reevaluate`,current boundary无source |
| reserved | NotVisible -> Retired | 1 | existing `retire`,current retire无NotVisible fact source |
| illegal | Pending / Visible / Unavailable -> NotVisible | 3 | exposure不可回Draft；不得用reevaluate倒退classification |
| illegal | Retired -> NotVisible / Pending / Visible / Unavailable | 4 | terminal |

Pair closure:`9 current + 4 reserved + 7 illegal = 20`。

| Same-state | 当前性 | 触发 / guard | history / no-op |
|---|---|---|---|
| Pending -> Pending | current | `reevaluate`或`mark_pending`;explicit scope/basis/reason/source reevaluation | visibility version +1 + direct applicability record；exposure可no-op |
| Visible -> Visible | current | `reevaluate`;complete Active exposure | version +1 + direct applicability record；不得重复activate |
| Unavailable -> Unavailable | current | `reevaluate`;incomplete normalized Unavailable exposure | version +1 + direct applicability record |
| NotVisible -> NotVisible | reserved | future policy reevaluation only | 无current persisted source |
| Retired -> Retired | illegal | all members reject | zero mutation |

Same-key duplicate不是same-state revision；它在reserve branch直接stored replay。Fresh new key可以请求正式reevaluation,但target仍由policy决定。MarkPending direct record必须使用`pending_reason.to_change_reason()`；Reevaluate direct record使用`change_reason`。

### 29.5 Consumer membership、传播与测试切口

- `is_consumable_by(consumer)`固定为`visibility_state == Visible && applicability_scope.contains(consumer)`；它不读取repository、不解析文本、不执行runtime authorization。
- RuntimeTools / SDK scope member只在Command entry通过existing ref + canonical-state repository验证；Ecosystem member是typed body-free context。Query再次验证请求consumer的current ref/state只决定degraded read surface,不改visibility。
- 每个persisted fact必须`formal_exposure_id`对称且`source_exposure_version == final exposure.version`。Stale-source fact不能作为activate、suspend、retire、controlled-view build或Query applicable依据。
- Update direct applicability record与visibility save、actual exposure / registry变化、traces、captures、materials、result/completion同UoW；suspend / retire由exposure lifecycle record解释,不伪造第二个visibility lifecycle owner。

Step 16至少承接9 current、4 reserved invocation count=0、7 illegal、4 same-state规则、typed membership inside/outside、empty/duplicate scope、wrong RuntimeTools / SDK ref-state、Ecosystem no text lookup、pre/post source symmetry、policy-only target、pending reason parity和Retired terminal。

### 29.6 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / owner exact | pass | 5 / 5 variants；owner=`FormalVisibilityApplicability` |
| deterministic membership | pass after reopen | typed scope + exact contains,no text parsing |
| target authority | pass after reopen | caller target removed；policy full inputs |
| current / reserved / illegal | pass | 9 / 4 / 7,unclassified=0 |
| same-state revision | pass | Pending / Visible / Unavailable current；duplicate分离 |
| source version / UoW | pass | pre/post guards与final-only save |
| query / consumer authority | pass | pure read explanation,no write / execution denial |
| test cut handoff | pass | 未声称执行结果 |

---

## 30. `TraceabilityState` 状态矩阵

### 30.1 状态集合与revision字段

| 状态 | 作用 | current formation / reachability | 是否终态 | 字段不变量 |
|---|---|---|---|---|
| `Recorded` | declared source set的trace完整 | factory current | 否 | `gap_reason=None`;`superseded_by=None` |
| `Partial` | 显式存在trace gap | factory current | 否 | `gap_reason=Some`;`superseded_by=None` |
| `HandoffPending` | local handoff request revision已形成,external outcome未成为本地truth | handoff Command current | 否 | `gap_reason=None`;`superseded_by=None`;handoff refs可None/Some |
| `Superseded` | newer trace revision取代本revision | current无flow；member reserved | 是 | `gap_reason=None`;`superseded_by=Some(distinct exact ref)` |

`CapabilityAccessTraceabilityRecord`是append-revision owner。Domain member改变内存中的next revision；Step 7 `append_revision(record, expected_previous_version, uow)`追加而非覆盖。`TraceId`不是record id或repository version。

### 30.2 ASCII 状态图

```text
factory -----------------------> Recorded
   |
   +---------------------------> Partial(gap=Some)

current flow:
  Recorded ----request_handoff----> HandoffPending
  Partial  ----request_handoff----> HandoffPending  (clear gap)
  HandoffPending --request_handoff--> HandoffPending (new revision)

reserved members:
  Recorded / HandoffPending ----mark_partial----> Partial
  Partial / HandoffPending ----mark_recorded----> Recorded
  Recorded / Partial / HandoffPending --supersede--> Superseded

Superseded --X--> any
```

### 30.3 Current不同状态转换矩阵

| # | From | To | Step 6触发 | Step 9 flow | 前置条件 | next revision delta | local / external phase |
|---:|---|---|---|---|---|---|---|
| 1 | Recorded | HandoffPending | `request_handoff(optional_pair,reason,actor,trace_id,now)` | RecordTraceabilityHandoffSummary | exact current ref；optional audit ref/state pair resolved andsame subject | optional handoff ref、new reason/actor/trace/time；gap/superseded pointer None；version +1 | append + result/completion commit first；Some only post-commit handoff |
| 2 | Partial | HandoffPending | same | same | exact current Partial；required old gap exists | same,并必须clear old `gap_reason`；version +1 | same；external failure不能恢复gap或回滚truth |

Current different-state count=`2`。`HandoffPending -> HandoffPending`是current same-state revision,另见§30.5。

### 30.4 Reserved与illegal方向

| # | From | To | Existing member | 预留条件 | 当前边界 |
|---:|---|---|---|---|---|
| 1 | Recorded | Partial | `mark_partial(...)` | explicit typed gap + actor/time | reserved；无83-flow caller |
| 2 | Recorded | Superseded | `supersede(...)` | distinct replacement exact ref | reserved |
| 3 | Partial | Recorded | `mark_recorded(...)` | gap closure proof | reserved |
| 4 | Partial | Superseded | `supersede(...)` | distinct replacement；clear gap | reserved |
| 5 | HandoffPending | Recorded | `mark_recorded(...)` | formal local closure | reserved；post-commit Port outcome不能自动调用 |
| 6 | HandoffPending | Partial | `mark_partial(...)` | explicit new gap | reserved |
| 7 | HandoffPending | Superseded | `supersede(...)` | distinct replacement | reserved |

Illegal directions只有`Superseded -> Recorded / Partial / HandoffPending`共3条。Superseded同态再supersede也拒绝；new valid trace必须是new/current revision,不能复活historical terminal。

Pair closure:`2 current + 7 reserved + 3 illegal = 12`。

### 30.5 Same-state revision、字段清理与无副作用

| Same-state | 当前性 | Callable | exact rule |
|---|---|---|---|
| HandoffPending -> HandoffPending | current | `request_handoff(...)` | new key + exact current ref形成one next revision；reason/optional ref/metadata更新,version exactly +1；gap/superseded pointer保持None |
| Recorded -> Recorded | reserved | `attach_handoff_ref(...)` | only distinct resolved ref attachment；无current flow |
| Partial -> Partial | reserved | `attach_handoff_ref(...)` or `mark_partial(...)` | required gap必须保留/替换；无current flow |
| Superseded -> Superseded | illegal | none | zero mutation |

`mark_handoff_pending(...)`也是reserved member,不得与`attach_handoff_ref(...)`在当前Command串联。Current flow只调用一次compound `request_handoff(...)`,因此一个repository append永远只跨一个object version。非法调用不得更新actor、trace、handoff refs、gap、superseded pointer、version或time。

### 30.6 传播、authority与测试切口

- Initial trace factory与source change records按Step 9各Command atomic set形成；本状态机不反写identity、registry、descriptor、seam、method relation或exposure。
- RecordTraceabilityHandoffSummary local revision、stored accepted response与idempotency completion同UoW；optional audit handoff严格post-commit。
- Port success/failure不保存receipt、delivery state、evidence alias、验收签署或raw audit body,也不推进`HandoffPending -> Recorded`。
- `CapabilityChangeImpactFact`只从exact current non-superseded trace factory形成；它不修改trace state。

Step 16至少承接Recorded/Partial factory、2 current edges、HandoffPending same-state current、7 reserved caller count=0、3 terminal illegal、gap/superseded field truth table、exactly-one-version append、stale ref rejection、None no-Port、Some post-commit failure no-rollback和duplicate no-repeat。

### 30.7 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / owner / persistence | pass | 4 variants；append-revision,not overwrite |
| current callable + flow | pass | 2 different + 1 same-state |
| reserved / illegal | pass | 7 / 3,unclassified=0 |
| mutually-exclusive fields | pass after reopen | leaving Partial clears gap；Superseded pointer exact |
| local / external phase | pass | commit-before-handoff,no truth rollback |
| fake evidence / audit body | none | refs + safe scope only |
| test handoff | pass | cuts defined,not executed |

---

## 31. `CapabilityImpactState` 状态矩阵

### 31.1 状态集合与current reachability

| 状态 | 作用 | current formation / reachability | 是否终态 | reason rule |
|---|---|---|---|---|
| `Identified` | exact trace subject与affected consumers已识别 | `derive_from_traceability(...)` current factory | 否 | `state_reason=None` |
| `Partial` | impact scope仅部分可知 | member reserved | 否 | `state_reason=Some` |
| `Delayed` | downstream acknowledgement / explanation延迟 | member reserved | 否 | `state_reason=Some` |
| `Ignored` | consumer明确无需动作 | member reserved | 是（当前scope） | `state_reason=Some`;不能由timeout猜测 |
| `Resolved` | explanation与required derived work闭合 | member reserved | 是（当前scope） | `state_reason=Some` |

Current `RecordCapabilityChangeImpactFact`只创建一个`Identified` fact并保存/capture。Downstream feedback Consumer创建`DownstreamConsumptionImpactSummary`与follow-up marker,明确不调用impact member。因此本状态机current different-state edge=`0`。

### 31.2 ASCII 状态图

```text
exact current non-superseded trace
              |
              v
          Identified
          .   |   .
       .      |      .
   Partial <..+..> Delayed
      .  \           /  .
      .   +-> Resolved <-+
      +------> Ignored <---

All dotted/member directions are reserved:current 83 flows do not mutate an existing impact.
Ignored / Resolved --X--> any
```

### 31.3 Reserved转换矩阵

| # | From | To | Existing member | exact guard / input | object delta | 当前没有flow时的禁止替代 |
|---:|---|---|---|---|---|---|
| 1 | Identified | Partial | `mark_partial(reason,actor,now)` | typed safe reason | state/reason/actor/version/time | feedback Consumer不得直接调用 |
| 2 | Identified | Delayed | `mark_delayed(reason,actor,now)` | typed delay reason | same | timeout / transport error不得私自推进 |
| 3 | Identified | Ignored | `mark_ignored(reason,actor,now)` | future formal consumer feedback proof required | terminal state + reason | follow-up marker不等于proof |
| 4 | Identified | Resolved | `resolve(reason,actor,now)` | future formal completion proof | terminal state + reason | derived material Ready不能反推 |
| 5 | Partial | Delayed | `mark_delayed(...)` | explicit delay reason | state/reason/version | no current caller |
| 6 | Partial | Ignored | `mark_ignored(...)` | explicit ignored feedback | terminal | no timeout inference |
| 7 | Partial | Resolved | `resolve(...)` | completion proof | terminal | no projection-driven repair |
| 8 | Delayed | Partial | `mark_partial(...)` | explicit newly known partial scope | state/reason/version | no current caller |
| 9 | Delayed | Ignored | `mark_ignored(...)` | explicit ignored feedback | terminal | no unavailable->ignored inference |
| 10 | Delayed | Resolved | `resolve(...)` | completion proof | terminal | no current caller |

Reserved count=`10`。在Step 8新增正式protocol与Step 9 flow前,implementation只能实现domain guard与unit-testable member,不能由existing Consumer / Job / Query擅自调用。

### 31.4 Illegal方向、factory与same-state

| Source | Illegal targets | count |
|---|---|---:|
| Partial | Identified | 1 |
| Delayed | Identified | 1 |
| Ignored | Identified、Partial、Delayed、Resolved | 4 |
| Resolved | Identified、Partial、Delayed、Ignored | 4 |
| total |  | 10 |

Pair closure:`0 current + 10 reserved + 10 illegal = 20`。Factory formation `new -> Identified`不计pair。没有accepted same-state member；fresh duplicate impact-for-exact-trace由repository uniqueness / Command rejection处理,不是Identified同态revision。

### 31.5 Owner边界、传播与测试切口

- `traceability_record_ref`必须exact current、non-superseded且subject复制自trace；caller不能提供第二subject。
- `affected_consumers`为non-empty stable typed set；runtime / tools / SDK execution、package/client state和cost不进入fact。
- Impact save + `CapabilityChangeImpactIdentified` capture + stored result/completion同UoW；没有change record、trace revision或material stale。
- Downstream summary通过exact `impact_fact_ref`关联；其Delayed / Unavailable / Ignored state不自动改变impact。

Step 16至少承接Identified factory、duplicate exact trace rejection、10 reserved member guards、10 illegal、Ignored必须explicit feedback、terminal no-reopen、consumer set validation、source trace symmetry、capture rollback以及Consumer / Query / Job impact mutation count=0。

### 31.6 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / owner exact | pass | 5 / 5 variants |
| current formation | pass | only Identified factory |
| current mutation | pass | zero,与Step 9一致 |
| reserved / illegal | pass | 10 / 10,unclassified=0 |
| terminal / reason | pass | Ignored / Resolved terminal；reason mandatory |
| feedback / truth boundary | pass | summary / follow-up不反写impact或source truth |
| test handoff | pass | no execution claim |

---

## 32. `DownstreamImpactSummaryState` 状态矩阵

### 32.1 State-specific factory formation

| Factory / payload state | Persisted state | observation | gap reason | state reason | current flow |
|---|---|---|---|---|---|
| `from_consumer_feedback(...)` | Received | Some required | None | None | downstream feedback Consumer |
| `from_reported_state(...,Partial,...)` | Partial | Some required | Some required | None | same |
| `from_reported_state(...,Delayed,...)` | Delayed | optional | None | Some required | same |
| `from_reported_state(...,Unavailable,...)` | Unavailable | None | None | Some required | same |
| `from_reported_state(...,Ignored,...)` | Ignored | None | None | Some required | same |

每个accepted inbound event创建new summary id/version=1；current flow从不加载并原地修改existing summary。Same `source_feedback_ref` duplicate只replay stored receipt / original summary ref。五个factory-selected initial state不计different-state pair。

### 32.2 状态集合与ASCII图

| 状态 | 作用 | 是否in-place终态 | Existing member能力 |
|---|---|---|---|
| `Received` | 完整body-free observation已收到 | 否 | partial / delayed / unavailable / ignored |
| `Partial` | observation不完整且有gap | 否 | partial revision / delayed / unavailable / ignored |
| `Delayed` | feedback延迟且有safe reason | 否 | partial / unavailable / ignored |
| `Unavailable` | 当前无法取得feedback且有safe reason | 否 | partial / delayed / unavailable revision / ignored |
| `Ignored` | consumer明确无需动作 | 是 | historical/current read only |

```text
factory -> Received / Partial / Delayed / Unavailable / Ignored

reserved in-place members only:
  Received ------> Partial / Delayed / Unavailable / Ignored
  Partial  ------> Delayed / Unavailable / Ignored
  Delayed  ------> Partial / Unavailable / Ignored
  Unavailable ---> Partial / Delayed / Ignored

  Partial ------mark_partial------> Partial       (reserved same-state revision)
  Unavailable --mark_unavailable--> Unavailable   (reserved same-state revision)

Ignored --X--> any
No state returns to Received;new feedback uses a new summary.
```

### 32.3 Reserved不同状态转换矩阵

| # | From | To | Existing member | Required field delta | 当前boundary |
|---:|---|---|---|---|---|
| 1 | Received | Partial | `mark_partial(observation,gap,actor,now)` | observation Some、gap Some、state_reason cleared | reserved |
| 2 | Received | Delayed | `mark_delayed(optional observation,reason,actor,now)` | gap cleared、reason Some | reserved |
| 3 | Received | Unavailable | `mark_unavailable(reason,actor,now)` | observation/gap cleared、reason Some | reserved |
| 4 | Received | Ignored | `mark_ignored(reason,actor,now)` | observation/gap cleared、reason Some | reserved terminal |
| 5 | Partial | Delayed | `mark_delayed(...)` | gap cleared、reason Some | reserved |
| 6 | Partial | Unavailable | `mark_unavailable(...)` | observation/gap cleared、reason Some | reserved |
| 7 | Partial | Ignored | `mark_ignored(...)` | observation/gap cleared、reason Some | reserved terminal |
| 8 | Delayed | Partial | `mark_partial(...)` | observation/gap Some、state_reason cleared | reserved |
| 9 | Delayed | Unavailable | `mark_unavailable(...)` | observation/gap cleared、reason Some | reserved |
| 10 | Delayed | Ignored | `mark_ignored(...)` | observation/gap cleared、reason Some | reserved terminal |
| 11 | Unavailable | Partial | `mark_partial(...)` | observation/gap Some、state_reason cleared | reserved |
| 12 | Unavailable | Delayed | `mark_delayed(...)` | optional observation、reason Some | reserved |
| 13 | Unavailable | Ignored | `mark_ignored(...)` | reason Some；observation/gap None | reserved terminal |

所有13条都已有Step 6 member,但83-flow current boundary没有caller。Inbound payload选择state时必须走factory,不得先创建Received再调用member伪造多version初始summary。

### 32.4 Illegal与same-state规则

| Source | Illegal targets | count | 原因 |
|---|---|---:|---|
| Partial | Received | 1 | 新完整反馈创建new summary,不恢复old snapshot |
| Delayed | Received | 1 | same |
| Unavailable | Received | 1 | same |
| Ignored | Received、Partial、Delayed、Unavailable | 4 | explicit ignored terminal |
| total |  | 7 | `0 current + 13 reserved + 7 illegal = 20` |

Reserved same-state member只有:`Partial -> Partial`通过new observation/gap revision；`Unavailable -> Unavailable`通过new reason revision。Received / Delayed / Ignored同态没有member。当前Consumer不调用任何same-state member；same-source duplicate必须stored replay而非version+1。

### 32.5 Processing disposition、impact边界与测试切口

- Payload state `Delayed`表示accepted downstream feedback内容；processing `Delayed`表示consumer prerequisite暂不可处理且whole UoW rollback。两者不可合并。
- Summary save、typed receipt/surface/shell与idempotency completion同一fresh UoW；impact和consumer refs只读,无outbound capture。
- Received/Partial/Delayed/Unavailable/Ignored均只表达body-free feedback,不保存execution result、tool output、SDK client state、raw error或cost。
- `Ignored`需要consumer明确payload；Unavailable / timeout不能映射为Ignored。Receipt只留下`CapabilityImpactReview` follow-up,不修改impact。

Step 16至少承接五类factory field truth table、13 reserved caller count=0、7 illegal、2 reserved same-state、source feedback uniqueness、payload Delayed vs processing Delayed、exact impact/consumer validation、duplicate replay、factory inconsistency rollback以及impact/source truth mutation count=0。

### 32.6 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / owner exact | pass | 5 / 5 variants |
| factory initial mapping | pass | five states exact field combinations |
| current in-place mutation | pass | zero |
| reserved / illegal | pass | 13 / 7,unclassified=0 |
| same-state / duplicate | pass | 2 reserved revisions；current duplicate replay only |
| processing / domain state split | pass | Delayed双语义明确分离 |
| downstream no-rollback | pass | summary / receipt only,no impact/core truth write |
| test handoff | pass | no result fabricated |

---

## 33. Batch `10.3` 跨状态机审计

### 33.1 Enum / pair / formation覆盖

| 审计项 | 期望 | 实际 | 结论 |
|---|---:|---:|---|
| batch owner state machine | 5 | 5 | pass |
| exact enum variants | exposure 7 + visibility 5 + trace 4 + impact 5 + summary 5 = 26 | 26 / 26 | pass |
| possible different-state pairs | 42 + 20 + 12 + 20 + 20 | 114 | pass |
| current different-state edges | 16 + 9 + 2 + 0 + 0 | 27 | pass |
| reserved different-state edges | 0 + 4 + 7 + 10 + 13 | 34 | pass |
| illegal different-state edges | 26 + 7 + 3 + 10 + 7 | 53 | pass |
| unclassified | 0 | 0 | pass |

```text
7 * (7 - 1) = 42
5 * (5 - 1) = 20
4 * (4 - 1) = 12
5 * (5 - 1) = 20
5 * (5 - 1) = 20
total = 114

27 current + 34 reserved + 53 illegal = 114
unclassified = 0
```

Factory / same-state closure另计:

| Owner | Current factory outcome | Current same-state revision | Reserved same-state |
|---|---|---|---|
| exposure | Draft -> Pending / Accepted before first save | none；application exposure no-op onthree MarkPending states | none |
| visibility | factory -> Pending / Visible | Pending / Visible / Unavailable reevaluation；Pending explicit reason revision | NotVisible reevaluation |
| trace | factory -> Recorded / Partial | HandoffPending handoff-request revision | Recorded / Partial attachment orpartial revision |
| impact | factory -> Identified | none | none |
| downstream summary | factory directly -> all five states | none | Partial / Unavailable revisions |

### 33.2 Callable / actual-flow审计

| Owner | Current callable | Current exact flow | 结果 |
|---|---|---|---|
| exposure formation | `draft`;`mark_pending` or `accept` | establish exposure | pass；Draft never persisted |
| exposure recovery / activation / degradation | `accept`;`activate`;`mark_unavailable`;`mark_pending` | update visibility | pass after normalization reopen |
| exposure suspension / retirement | `suspend`;`retire` | suspend / retire exposure | pass after pre/post visibility symmetry reopen |
| visibility formation / reevaluation | `derive`;`reevaluate`;`mark_pending` | establish / update | pass；policy-only target + typed scope |
| visibility unavailable / retired | `mark_unavailable`;`retire` | suspend / retire | pass；final source version exact |
| trace handoff | `request_handoff` | record handoff summary | pass；one member + one append,field invariant exact |
| impact formation | `derive_from_traceability` | record impact | pass；only Identified |
| downstream formation | two factories | consume downstream feedback | pass；all five payload states,zero mutation |

No current row uses repository-only state assignment、fake private map、string status、consumer view、runtime signal、SDK state、marketplace listing或external approval as trigger。

### 33.3 Cross-machine transaction与pairing审计

| 场景 | Required final pair / atomic set | Rejection / no-op | 结论 |
|---|---|---|---|
| establish incomplete | exposure Pending + visibility Pending | Draft not saved；registry actual delta only | pass |
| establish complete visible | exposure Active + visibility Visible,source versions symmetric | Accepted + Visible is transaction-local only | pass |
| update incomplete accepted state | exposure Unavailable + visibility Unavailable/Pending | degradation before derive；no activation | pass after reopen |
| update recovery | exposure Active + visibility Visible | accept/activation andfinal reeval same UoW | pass |
| suspend | exposure Suspended + visibility Unavailable | pre-state must Active + symmetric Visible | pass after reopen |
| retire | exposure Retired + visibility Retired | pre-state both non-retired + symmetric | pass after reopen |
| MarkPending | visibility Pending；exposure actual delta only forActive/Unavailable | Pending/Accepted/Suspended exposure save=0；direct reason typed | pass after reopen |
| trace handoff | HandoffPending + gap None + superseded pointer None | local commit before optional handoff；failure no rollback | pass after reopen |
| impact creation | Identified only | no trace/core/material mutation | pass |
| downstream feedback | new exact summary state + accepted receipt | impact unchanged；same source duplicate replay | pass |

Registry `FormalVisible`只在final exposure Active + final visibility Visible且source symmetric时形成；其他non-retired exposure combinations导出VisibilityPending并只在actual delta时保存。Registry不是visibility target authority。

### 33.4 Authority、historical与fabrication审计

| 检查 | 结果 |
|---|---|
| applicability membership解析safe text / runtime allowlist | no；typed set exact equality only |
| caller / registry / view选择Visible | no；FormalExposurePolicy only |
| incomplete Accepted / Suspended直接activate | no；先Unavailable |
| stale visibility触发activate / suspend / retire / controlled build | no；source version guard |
| runtime execution / tools execution / SDK publication并入exposure | no |
| governance approval / method lifecycle并入prerequisite owner | no；body-free local relation + refs only |
| post-commit handoff outcome回写trace/core truth | no |
| downstream summary回写impact或source truth | no |
| old formal`03` / README作为matrix source | no；historical_material only |
| new HLD object / application helper / state enum / variant | 0 |
| public carrier / callable delta | existing scope representation替换；2旧safe-text methods退出、3 typed-set methods进入；1 pure policy method新增,净+2 callable |
| struct / field / enum variant / callable English Rustdoc omission | 0；reworked tuple inner field与全部public methods已有`///` |
| 43 HLD objects + 7 application helpers / 36 Ports / 83 protocols / 83 flows | unchanged |
| formal `03-详细设计.md` modified | no |
| implementation ledger / planned boundary skeleton | not created |
| implementation commit / real run_id / test result / evidence alias / acceptance sign-off | none |
| unresolved upstream blocker | 0；两项local controlled reopen已关闭 |
| current commit requirement | none |

### 33.5 Mechanical stop audit

| Gate | 结果 |
|---|---|
| every state name exact Step 6 variant | pass |
| every current edge exact callable + Step 9 flow | pass |
| every reserved edge existing member + no current caller | pass |
| every illegal direction zero-mutation rule | pass |
| same-state / duplicate / factory separated | pass |
| reason / conditional optional field truth table | pass |
| expected-version / append-vs-save semantics handed toStep 11 | pass |
| legal / illegal test cuts handed toStep 16 | pass |
| conflict marker / whitespace | pass after mechanical check |

---

## 34. Batch `10.3` 完成结论与停审

| Gate | 结果 |
|---|---|
| 用户允许进入`10.3` | pass |
| §12第三行、§19~§26与Step 6 / 7 / 8 / 9 exact inputs已读 | pass |
| formal exposure状态集合 / 图 / matrix / illegal / stop review | pass |
| formal visibility状态集合 / 图 / matrix / illegal / stop review | pass |
| traceability状态集合 / 图 / matrix / illegal / stop review | pass |
| capability impact状态集合 / 图 / matrix / illegal / stop review | pass |
| downstream feedback状态集合 / 图 / matrix / illegal / stop review | pass |
| 114 possible different-state pairs分类 | pass；27 current + 34 reserved + 53 illegal,unclassified=0 |
| controlled reopen | pass；typed applicability / target authority / normalization / source symmetry / trace field invariant已闭合 |
| Rustdoc / 结构注释门禁 | pass；reworked struct inner field、public methods和policy callable英文`///`完整 |
| cross-owner UoW / authority / historical / fabrication | pass |
| 正式文档 / implementation artifact / commit | none |

```text
gate_status = 03_step_10_batch_10_3_completed_wait_user_review
completed_document = 03-详细设计.md
completed_step = Step 10 batch 10.3 exposure / visibility / trace / impact / downstream feedback state matrices
formal_document_written = false
unresolved_upstream_blocker = 0
next_allowed_action = start_03_step_10_batch_10_4_after_user_confirmation
commit_required = false
```

---

## 35. Batch `10.4` 输入复核与受控回开

### 35.1 开工门禁与exact读取结论

| 项 | 结论 |
|---|---|
| 用户授权 | pass；用户在`10.3`停审后回复“同意”,只授权进入`10.4` |
| 标准 | 已复读详细设计SOP Step 10、书写规范§5.9、中间产物规范与真相源闭环标准的state subject / callable / field-source门禁 |
| 直接前序 | §27~§34与batch `10.3`停审完整读取；不重开已闭合exposure / visibility / trace结论 |
| object contract | Step 6 `ControlledConsumerView`;`ConsumerViewFreshnessPolicy`;`DirectorySearchBrowseProjection`;`AuditFriendlyExportSummary`;`ReadOnlyEcosystemDiscoverySummary`;`CapabilityReconciliationReport`;matching enums / policy / typed carriers |
| protocol / flow | Step 8 §11.6 / §11.8.2~§11.8.6；Step 9四条material Job、两条reconciliation Job、§13.2 actual stale算法与所有reference-driven stale call sites |
| HLD | 正式`02-概要设计.md` §9~§10；HLD只给状态方向,是否current / persisted仍以Step 6 callable + Step 9 actual save path裁剪 |
| historical material | README、旧正式`03/05/06`继续只作historical_material；未把旧`QueryCapabilities`、marketplace listing或runtime cache状态带入矩阵 |
| 本批停止点 | 四张mutable矩阵 + immutable report formation audit + cross-machine audit后停审；不得进入`10.5` |

Exact flow复核得到三条分类基线:

1. Controlled-view与directory current Job都不调用`mark_rebuilding / mark_unavailable`,也不保存中间状态；changed target直接在loaded object上refresh并与capture / journal success一起保存唯一final revision。
2. Audit / discovery changed target先在内存恢复Ready,再根据frozen plan执行零或一次final degraded member；矩阵按persisted From -> final persisted To分类,不把未保存的内存Ready伪造成第二条transition或第二次capture。
3. Core / reference source propagation只对actual non-Stale material调用`mark_stale`；already-Stale是application no-op,不增version、不save、不capture、不进入affected refs。

### 35.2 Controlled reopen `CH-DDD-S10-CONSUMER-VIEW-PARTIAL-REBUILD-GUARD-001`

| 冲突来源 | 进入本批前的歧义 | 若不修正的落码分叉 |
|---|---|---|
| Step 6 view factory / policy | factory / refresh可形成Ready / Partial,policy按`ConsumerViewPartialKind`判断,但`DescriptorConsumerSummary`旧为opaque safe text | 解析文本选state、永远只形成Ready、或把required / forbidden缺口误降级Partial |
| Step 9 controlled-view plan | plan只冻结summary与source versions,没有第二typed partial input | reserved reentry可能重读optional source并选择不同final state；Unchanged无法证明Partial类别一致 |
| Step 6 state summary vs Step 9 Jobs | 旧摘要写`... -> Rebuilding -> ...`,actual view / directory Job均直接refresh final object | 私增Rebuilding save / capture / target UoW,破坏journal reentry与event cardinality |
| view / directory members | `mark_rebuilding / mark_unavailable`source guard不完整 | implementation / fake可接受不同From集合,状态pair和非法测试无法一致 |

受控修正已同步Step 6 / 8 / 9:

- existing `DescriptorConsumerSummary`改为有英文`///`的private `safe_summary` + typed `partial_kinds`;empty set确定Ready,non-empty policy-allowed set确定Partial。
- optional risk / secret-safe / method-summary缺口分别映射closed enum variant；required missing、forbidden body或duplicate / disallowed kind为target failure,不得解析文本。
- view refresh接受任一existing state；`mark_rebuilding`只接受Stale / Unavailable / Partial；`mark_unavailable`只接受Ready / Stale / Rebuilding / Partial。
- directory refresh接受任一existing state；`mark_rebuilding`只接受Stale / Unavailable；`mark_unavailable`只接受Ready / Stale / Rebuilding。
- current两条Job只调用factory / refresh并保存final state；reserved members调用数为0。

该项是本仓详细设计内部冲突,不是上游项目 blocker。没有新增public type、HLD object、application helper、state enum / variant、DTO field、protocol、flow、trait或Port；existing carrier变为2个private fields,全部field与10个public method均有英文`///`。43 HLD objects + 7 application helpers、36 Ports、83 protocols / flows保持不变。

### 35.3 Pair分类基线

| State machine | variants | possible different-state pairs | current | reserved | illegal |
|---|---:|---:|---:|---:|---:|
| `ConsumerViewFreshnessState` | 5 | 20 | 12 | 7 | 1 |
| `DirectoryProjectionState` | 4 | 12 | 6 | 5 | 1 |
| `AuditExportState` | 4 | 12 | 12 | 0 | 0 |
| `EcosystemDiscoveryState` | 4 | 12 | 12 | 0 | 0 |
| total mutable | 17 exact variants | 56 | 42 | 12 | 2 |

`ReconciliationReportState`的5个variant是per-report immutable factory outcome,不进入different-state pair算术。Current pair表示actual Step 9 flow对一个合法loaded persisted source会保存该final pair；某些source state本身只有reserved formation时,在状态集合表单独标明,不能据此伪造current formation。Factory、current same-state revision、application no-op与transient in-memory state均另列。

---

## 36. `ConsumerViewFreshnessState` 状态矩阵

### 36.1 状态集合、typed Partial与reachability

| 状态 | 作用 | current formation / reachability | 是否终态 | 允许的关键操作 |
|---|---|---|---|---|
| `Ready` | snapshot完整且source versions为本次accepted build basis | factory / current Job refresh | 否 | exact read；source change -> Stale；changed refresh -> Ready / Partial；reserved unavailable |
| `Partial` | snapshot只缺policy允许的optional safe summary类别 | factory / current Job refresh；`descriptor_summary.partial_kinds`必须non-empty allowed subset | 否 | safe read；source change -> Stale；refresh -> Ready / Partial；reserved rebuilding / unavailable |
| `Stale` | source truth / canonical reference已有newer accepted revision | actual core / reference propagation | 否 | current refresh -> Ready / Partial；reserved rebuilding / unavailable |
| `Rebuilding` | 可持久化的future maintenance in-progress marker | current 83 flows不形成；reserved member only；Query与current refresh仍能读取已有合法revision | 否 | current refresh -> Ready / Partial；newer source -> Stale；reserved unavailable |
| `Unavailable` | view当前不可服务但formal exposure truth未改变 | current 83 flows不形成；reserved member only；Query与current refresh仍能读取已有合法revision | 否 | current refresh -> Ready / Partial；newer source -> Stale；reserved rebuilding |

`DescriptorConsumerSummary`本身保存typed partial-kind set,因此Partial不是从safe text、timestamp、repository error或Query fallback推断。Required exposure / visibility / descriptor / consumer reference缺失不会创建Unavailable view,而是Job failed target并保持existing view不变。

### 36.2 ASCII 状态图

```text
structured factory / current refresh
  partial_kinds empty ------------------------------> Ready
  partial_kinds non-empty and policy-allowed ------> Partial

Ready ----------------source change----------------> Stale
Partial --------------source change----------------> Stale
Rebuilding -----------source change----------------> Stale
Unavailable ----------source change----------------> Stale

Stale / Rebuilding / Unavailable --refresh---------> Ready / Partial
Ready --------------------------------refresh------> Partial
Partial ------------------------------refresh------> Ready

reserved members:
  Stale / Partial / Unavailable ....mark_rebuilding....> Rebuilding
  Ready / Stale / Rebuilding / Partial ...mark_unavailable...> Unavailable

Ready --X mark_rebuilding--> Rebuilding
already Stale --no-op--> Stale
```

### 36.3 Current不同状态转换矩阵

| # | From | To | Step 6触发 | Step 9 actual flow | exact guard / target input | object delta | UoW / propagation |
|---:|---|---|---|---|---|---|---|
| 1 | Ready | Partial | `refresh_from_exposure(...)` | controlled-view refresh Job | complete exact audience/source mismatch requiresrevision；structured summary hasnon-empty allowed partial set | replace summary / source versions,state Partial,version +1,refreshed_at=Clock | view save + availability capture + journal success same target UoW |
| 2 | Ready | Stale | `mark_stale(reason,now)` | §13.2 core / reference actual propagation | indexed material isexact current Ready；accepted source reason bridge exists | state Stale,version +1,refreshed_at=Clock；snapshot fields retained | source owner UoW；`same_uow_actual_stale` |
| 3 | Stale | Ready | `refresh_from_exposure(...)` | controlled-view refresh Job | applicable symmetric Visible exposure；structured summary complete | replace summary / versions,state Ready,version +1 | changed target atomic set |
| 4 | Stale | Partial | same | same | same,non-empty allowed partial set | state Partial + replacement fields/version | same |
| 5 | Rebuilding | Ready | same | same | existing reserved-origin revision passesexact id / audience / source guard；new summary complete | state Ready + replacement fields/version | same；Job does not first saveRebuilding |
| 6 | Rebuilding | Partial | same | same | same,non-empty allowed partial set | state Partial + replacement fields/version | same |
| 7 | Rebuilding | Stale | `mark_stale(...)` | actual propagation | newer accepted source invalidatesin-progress snapshot | state Stale,version +1 | source owner UoW；actual-stale-only |
| 8 | Unavailable | Ready | `refresh_from_exposure(...)` | controlled-view refresh Job | valid loaded reserved-origin revision；summary complete | state Ready + replacement fields/version | changed target atomic set |
| 9 | Unavailable | Partial | same | same | same,non-empty allowed partial set | state Partial + replacement fields/version | same |
| 10 | Unavailable | Stale | `mark_stale(...)` | actual propagation | newer accepted source exists even thoughview already unavailable | state Stale,version +1 | source owner UoW；actual-stale-only |
| 11 | Partial | Ready | `refresh_from_exposure(...)` | controlled-view refresh Job | optional gaps resolved；new structured summary partial set empty | state Ready + replacement fields/version | changed target atomic set |
| 12 | Partial | Stale | `mark_stale(...)` | actual propagation | newer accepted source | state Stale,version +1 | source owner UoW；actual-stale-only |

Current different-state pair count=`12`。`Rebuilding / Unavailable`没有current formation,但current Job与actual propagation显式接受合法existing revision作为source；这不授权current flow调用reserved members去制造source state。

### 36.4 Reserved、illegal与same-state规则

| Classification | Pair | count | existing callable / exact boundary |
|---|---|---:|---|
| reserved | Stale / Partial / Unavailable -> Rebuilding | 3 | `mark_rebuilding(now)`；只有future显式maintenance flow可调用,current Job invocation count=0 |
| reserved | Ready / Stale / Rebuilding / Partial -> Unavailable | 4 | `mark_unavailable(reason,now)`；future flow必须有typed safe reason与explicit failure authority,current Job不得把target error持久化成view state |
| illegal | Ready -> Rebuilding | 1 | current fresh snapshot无需持久化in-progress marker；member必须返回invalid transition且零mutation |

Pair closure:`12 current + 7 reserved + 1 illegal = 20`。

| Same-state / no-op | 当前性 | exact rule | effect |
|---|---|---|---|
| Ready -> Ready | current same-state revision | complete structured summary / source versions或safe body发生actual change；exact match不是此分支 | refresh version +1；save / capture / journal success |
| Partial -> Partial | current same-state revision | final partial kinds仍non-empty allowed,但summary / kinds / source versions任一actual变化 | refresh version +1；same atomic set |
| exact Ready / Partial match | application no-op | audience、structured summary（含partial kinds）、source versions和deterministic target state全相等 | `Unchanged`;view Clock / id / save / capture calls=0；journal-only UoW |
| Stale -> Stale | application no-op | affected scan已读到Stale | member/save/capture/effect ref均为0 |
| Rebuilding -> Rebuilding / Unavailable -> Unavailable | illegal same-state | corresponding member rejects | zero field/version/time mutation |
| completed duplicate | stored replay | matchingCompleted reservation | no exposure / visibility / source / view read andzero state member calls |

`ControlledConsumerView`没有独立`state_reason`字段。Current stale reason只作为validated member input,其authority仍是same-UoW terminal change record或canonical reference-state reason；implementation不得私增adapter-only reason column、伪造view change record或把event delivery结果当reason。

### 36.5 Owner边界、传播与测试切口

- View owner只保存body-free summary、typed audience、source markers和freshness；不拥有formal exposure、runtime/tool authorization、SDK client/cache或provider execution。
- Query逐字复制persisted enum与structured summary；Stale / Partial可返回safe body,Rebuilding / Unavailable suppress body,且Query调用state member / save / Job数量为0。
- Actual stale revision与`ControlledConsumerViewAvailabilityChanged`capture、source transaction其余effect同UoW；post-commit collaboration failure不回写view。
- Refresh revision与availability capture、journal success同target UoW；failed target / optimistic conflict回滚后不能用Unavailable伪装success。

Step 16至少承接12 current pairs、7 reserved invocation-count=0、1 illegal、2 current same-state revisions、Ready / Partial exact no-op、Stale no-op、all optional-kind combinations、duplicate/disallowed kind rejection、source-version/audience symmetry、rollback/capture atomicity、Query no-write和runtime / SDK / execution call count=0。这里只定义test cuts,不声称已运行。

### 36.6 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / owner exact | pass | 5 / 5 variants；owner=`ControlledConsumerView.freshness_state` |
| deterministic Ready / Partial | pass after reopen | structured summary + typed partial set；no text parsing |
| current / reserved formation | pass | Ready / Partial factory,Stale actual propagation,Rebuilding / Unavailable reserved only |
| pair全分类 | pass | 12 current + 7 reserved + 1 illegal,unclassified=0 |
| same-state / no-op | pass | Ready / Partial actual revision与exact Unchanged分离；Stale propagation no-op |
| callable / flow | pass | every current pair hasexisting member + exact flow；reserved members havezero current callers |
| UoW / event | pass | actual revision + exact capture + owning outcome atomic；post-commit no rewrite |
| Rustdoc / structure comments | pass | reworked summary two fields、set inner field与public methods英文`///`完整；view struct / fields无遗漏 |
| authority boundary | pass | no exposure/runtime/SDK/execution ownership merge |

---

## 37. `DirectoryProjectionState` 状态矩阵

### 37.1 状态集合与current formation

| 状态 | 作用 | current formation / reachability | 是否终态 | 允许的关键操作 |
|---|---|---|---|---|
| `Ready` | projection与exact registry / descriptor / exposure source chain对称且可读 | factory / current rebuild Job refresh | 否 | search / browse read；source change -> Stale；changed refresh same-state；reserved unavailable |
| `Stale` | projection落后accepted source revision | actual core / reference propagation | 否 | current refresh -> Ready；reserved rebuilding / unavailable |
| `Rebuilding` | future persisted rebuild-in-progress marker | current Job不形成；reserved member only；Query / current refresh可消费existing legal revision | 否 | current refresh -> Ready；newer source -> Stale；reserved unavailable |
| `Unavailable` | projection不可服务且不改变core truth | current Job不形成；reserved member only；Query / current refresh可消费existing legal revision | 否 | current refresh -> Ready；newer source -> Stale；reserved rebuilding |

Current factory `build_from_access_truth(...)`只形成Ready。Search engine index-build status、ranking state、query plan、marketplace listing和runtime provider health均不进入本状态机。

### 37.2 ASCII 状态图

```text
factory ------------------------------> Ready
Ready / Rebuilding / Unavailable -----mark_stale----> Stale
Stale / Rebuilding / Unavailable -----refresh-------> Ready

reserved:
  Stale / Unavailable ........mark_rebuilding......> Rebuilding
  Ready / Stale / Rebuilding ...mark_unavailable...> Unavailable

Ready --X mark_rebuilding--> Rebuilding
already Stale --no-op--> Stale
```

### 37.3 Current不同状态转换矩阵

| # | From | To | Step 6触发 | Step 9 actual flow | exact guard | object delta | UoW / propagation |
|---:|---|---|---|---|---|---|---|
| 1 | Ready | Stale | `mark_stale(reason,now)` | §13.2 core / reference propagation | current exact projection indexed byaccepted changed subject；not alreadyStale | state Stale,reason Some,version +1,refreshed_at=Clock；material body / source refs retained | source owner UoW；`same_uow_actual_stale` |
| 2 | Stale | Ready | `refresh_from_access_truth(...)` | directory rebuild Job | exact non-retired registry + Accepted descriptor + Accepted/Active exposure owner chain；frozen safe fields / versions complete | replace three refs、display、facets、versions；state Ready,reason None,version +1 | projection save + derived capture + journal success same target UoW |
| 3 | Rebuilding | Ready | same | same | legal reserved-origin revision + exact source chain | same final Ready delta | same；no intermediate save |
| 4 | Rebuilding | Stale | `mark_stale(...)` | actual propagation | newer accepted source invalidatesin-progress material | state Stale,reason Some,version +1 | source owner UoW；actual-stale-only |
| 5 | Unavailable | Ready | `refresh_from_access_truth(...)` | directory rebuild Job | legal reserved-origin revision + exact source chain | final Ready delta | target atomic set |
| 6 | Unavailable | Stale | `mark_stale(...)` | actual propagation | newer accepted source exists | state Stale,reason Some,version +1 | source owner UoW；actual-stale-only |

Current different-state pair count=`6`。Current Job never savesRebuilding / Unavailable；it can restoreanexisting legal revision without makingthat source state current-formed。

### 37.4 Reserved、illegal与same-state规则

| Classification | Pair | count | existing callable / exact boundary |
|---|---|---:|---|
| reserved | Stale / Unavailable -> Rebuilding | 2 | `mark_rebuilding(now)`；clears stale/unavailable reason,version +1；future explicit maintenance flow only |
| reserved | Ready / Stale / Rebuilding -> Unavailable | 3 | `mark_unavailable(reason,now)`；reason Some,version +1；current Job target failure must not call |
| illegal | Ready -> Rebuilding | 1 | current fresh projection does not needpersisted in-progress state；zero mutation |

Pair closure:`6 current + 5 reserved + 1 illegal = 12`。

| Same-state / no-op | exact rule | effect |
|---|---|---|
| Ready -> Ready current revision | source refs / display / facets / source versions任一actual mismatch,但new source chain合法 | refresh version +1；save / capture / journal success |
| exact Ready match | all three refs、safe display、facets、source versions、Ready + reason None完整相等 | `Unchanged`;no projection Clock / id / save / capture |
| Stale -> Stale | affected propagation seesalreadyStale | application no-op；no member/version/capture/effect ref |
| Rebuilding / Unavailable same-state | member target equalscurrent | invalid transition；zero mutation |
| completed duplicate | typed stored replay | zero source / projection read orstate member call |

Reserved `mark_rebuilding`必须形成`state_reason=None`;Ready也必须None。Stale / Unavailable必须`state_reason=Some`。Implementation不得把Job execution target state、search adapter health或repository error写入projection enum / reason。

### 37.5 Owner边界、传播与测试切口

- Projection只复制accepted registry / descriptor / exposure safe fields；`is_read_only()`恒true,任何state都不能调用core save。
- Existing-projection scope若stored source refs损坏必须failed target,不能用current descriptor / exposure替换后声称refresh成功。
- Actual stale、derived capture与source owner transaction同UoW；multi-subject candidate先union,同一projection只mark / save / capture一次。
- Rebuild Ready revision、`DerivedMaterialRefreshed(DirectoryProjection)`capture与journal success同target UoW；post-commit collaboration failure不改state。
- Search / browse Query只聚合persisted `Unavailable > Rebuilding > Stale > Ready`,不按timestamp / latency / first item修状态。

Step 16至少承接6 current、5 reserved invocation-count=0、1 illegal、Ready same-state revision、exact no-op、Stale propagation no-op、reason truth table、three scope variants、corrupt stored source failure、multi-subject dedup、UoW rollback、Query no-write以及provider / search-index / ranking / listing / core-save调用数为0。

### 37.6 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / owner exact | pass | 4 / 4 variants；owner=`DirectorySearchBrowseProjection.freshness_state` |
| factory / formation | pass | current onlyReady；Stale actual propagation；Rebuilding / Unavailable reserved |
| pair全分类 | pass | 6 current + 5 reserved + 1 illegal,unclassified=0 |
| callable / actual flow | pass after reopen | current Job direct refresh final；reserved members zero callers |
| reason / same-state / no-op | pass | state_reason truth table与full Ready no-op exact |
| source integrity / UoW | pass | no corrupt-source current fallback；save/capture/journal atomic |
| read-only authority | pass | no registry repair、index state或listing truth |
| Rustdoc / structure comments | pass | directory struct与全部fields英文`///`完整；本机无新declaration |

---

## 38. `AuditExportState` 状态矩阵

### 38.1 状态集合、reason invariant与formation

| 状态 | 作用 | current formation / reachability | 是否终态 | 允许的关键操作 |
|---|---|---|---|---|
| `Ready` | exact trace / scope的allowed summary及全部可用observability refs已形成 | Job first materialization或existing refresh final outcome | 否 | allowed handoff read；changed plan -> Partial / Unavailable或same-state；source change -> Stale |
| `Partial` | required export shell可用,但一个或多个optional audit refs为Unresolved / Stale / Expired | Job build / refresh final outcome | 否 | degraded safe read；changed plan -> Ready / Unavailable或same-state；source change -> Stale |
| `Unavailable` | required shell可保留,但至少一个optional audit ref canonical state为Unavailable | Job build / refresh final outcome | 否 | unavailable surface；changed plan -> Ready / Partial或same-state；source change -> Stale |
| `Stale` | exact trace or another declared source已有newer accepted revision | actual core / reference propagation | 否 | Job rebuild -> Ready / Partial / Unavailable |

Field invariant固定为:`Ready -> state_reason=None`;`Partial / Unavailable / Stale -> state_reason=Some(AuditExportGapReason)`。`observability_refs`只保存Resolved subset的stable order；absence不是evidence failure、sign-off或delivery receipt。

### 38.2 Persisted formation与ASCII状态图

`build_from_traceability(...)`先在内存形成Ready base。Job随后按frozen canonical-state plan attach零到多个Resolved refs,并至多执行一次`mark_partial`或`mark_unavailable`,最后只save一个object revision。因此first persisted outcome可为Ready / Partial / Unavailable；内存base与每次attachment不单独计transition或capture。

```text
factory base Ready --attach zero or more Resolved refs--+
                                                     |
                                                     +--> persisted Ready
                                                     +--> mark_partial ----> persisted Partial
                                                     +--> mark_unavailable-> persisted Unavailable

existing Ready / Partial / Unavailable / Stale
  --refresh base Ready;clear old refs;reattach frozen Resolved subset--+
                                                                   +--> final Ready
                                                                   +--> final Partial
                                                                   +--> final Unavailable

Ready / Partial / Unavailable --accepted source change--> Stale
Stale --accepted source change--> no-op
```

### 38.3 Current不同状态转换矩阵

| # | From | To | Step 6触发 sequence | Step 9 actual flow | exact final guard | persisted object delta | UoW / propagation |
|---:|---|---|---|---|---|---|---|
| 1 | Ready | Partial | `refresh_from_traceability`;`attach_observability_ref*`;`mark_partial` | audit export Job | noInvalid/Forbidden/Unavailable；first stable Unresolved/Stale/Expired reason exists | exact same trace/scope identity；replace summary/versions,clear+reattach resolved subset,state Partial,reason Some | one final save + derived capture + journal success same target UoW |
| 2 | Ready | Unavailable | refresh + attach* + `mark_unavailable` | same | first stable Unavailable reason takes precedence | final state Unavailable,reason Some；same replacement rules | same |
| 3 | Ready | Stale | `mark_stale(reason,now)` | §13.2 actual propagation | accepted newer source；current notStale | state Stale,reason Some,version +1 | source owner UoW；`same_uow_actual_stale` |
| 4 | Partial | Ready | refresh + attach* | audit export Job | all planned refsResolved,includingzero refs；no degraded reason | clear old attachments,save exact new subset,state Ready,reason None | target atomic set |
| 5 | Partial | Unavailable | refresh + attach* + mark unavailable | same | anyUnavailable andnoInvalid/Forbidden | final Unavailable + first reason | same |
| 6 | Partial | Stale | `mark_stale(...)` | actual propagation | accepted newer source | state Stale,reason replaced bysource reason,version +1 | source owner UoW；actual-stale-only |
| 7 | Unavailable | Ready | refresh + attach* | audit export Job | all planned refsResolved | final Ready,reason None | target atomic set |
| 8 | Unavailable | Partial | refresh + attach* + mark partial | same | noUnavailable；at least oneUnresolved/Stale/Expired | final Partial + first stable reason | same |
| 9 | Unavailable | Stale | `mark_stale(...)` | actual propagation | accepted newer source | final Stale + source reason,version +1 | source owner UoW；actual-stale-only |
| 10 | Stale | Ready | refresh + attach* | audit export Job | all planned refsResolved | final Ready,reason None | target atomic set |
| 11 | Stale | Partial | refresh + attach* + mark partial | same | partial precedence branch | final Partial + reason | same |
| 12 | Stale | Unavailable | refresh + attach* + mark unavailable | same | unavailable precedence branch | final Unavailable + reason | same |

Pair closure:`12 current + 0 reserved + 0 illegal = 12`。这里的“无illegal different-state pair”只表示四个enum成员间每个不同方向都有actual persisted route；wrong trace/scope、Invalid/Forbidden reference、reason/state不对称和factory/member source错误仍是domain / consistency / target rejection,不是额外状态variant。

### 38.4 In-memory sequence、same-state与no-op

| 场景 | 分类 | exact rule | version / effect |
|---|---|---|---|
| Ready -> Ready | current same-state revision | complete match=false,final expected Ready | existing refresh +1；每个new resolved attachment +1；one final save/capture |
| Partial -> Partial | current same-state revision | final remainsPartial but summary、resolved subset、source versions或reason不同 | refresh + attachments + one mark_partial；one final save/capture |
| Unavailable -> Unavailable | current same-state revision | final remainsUnavailable but complete frozen outcome不同 | refresh + attachments + one mark_unavailable；one final save/capture |
| exact Ready / Partial / Unavailable match | application no-op | `matches_preparation(...)`比较trace/scope、safe summary、stable saved resolved ids、source versions、final state/reason全部相等 | `Unchanged`;material Clock / id / member / save / capture=0 |
| Stale -> Stale | application no-op | actual propagation seesalreadyStale | zero member/save/capture/effect ref |
| transient base Ready / each attachment | in-memory mutation only | changed target在save前完成全部sequence | 不单独repository save、journal item、event或pair count；final object version可增加`1 + resolved_count + degraded_bit` |
| completed duplicate | stored replay | exact completed reservation | no trace / ref / material reads andzero state calls |

Invalid / Forbidden canonical value在planning形成`PreclassifiedFailure`,不调用factory / refresh / mark member。Missing orwrong-version ref/state pair也是target failure,不能静默drop后保存Partial。Unavailable优先于Partial,reason取stable plan order的first matching safe reason；raw error不可拼接。

### 38.5 Owner边界、传播与测试切口

- Export只保存body-free allowed summary、typed local audit ids和source markers；不读取raw log/span/metric/audit/GRC body,也不形成evidence alias、签署、验收或governance approval。
- Existing id只能绑定same exact trace revision + same `AuditExportScope`;wrong pair失败,不能把id改绑latest trace。
- Changed save、`DerivedMaterialRefreshed(AuditExport)`capture与journal success同UoW；event collaboration不是audit handoff,post-commit failure不改export。
- Query只映射persisted四态；不存在synthetic Rebuilding branch,也不触发prepare Job。

Step 16至少承接12 current pairs、3 current same-state revisions、3 exact final no-op、Stale no-op、all seven reference values与precedence、resolved subset stable order、old attachment removal、wrong trace/scope、historical exact trace、version increment sequence、UoW rollback和raw audit/evidence/sign-off调用数为0。

### 38.6 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / owner exact | pass | 4 / 4 variants；owner=`AuditFriendlyExportSummary.export_state` |
| persisted formation | pass | first save onlyReady / Partial / Unavailable；Stale onlyactual propagation |
| pair全分类 | pass | all12 current,unclassified=0 |
| transient / persisted separation | pass | refresh-base / attachments / degrade save once,one capture |
| reason / attachment invariant | pass | four-state reason truth table + resolved-only stable set |
| same-state / no-op | pass | full frozen outcome match isonlyUnchanged branch |
| authority / UoW | pass | no raw audit / evidence / truth repair；save/capture/journal atomic |
| Rustdoc / structure comments | pass | export struct、allfields、rebuild callables英文`///`完整；本机无新declaration |

---

## 39. `EcosystemDiscoveryState` 状态矩阵

### 39.1 状态集合、reason invariant与formation

| 状态 | 作用 | current formation / reachability | 是否终态 | 允许的关键操作 |
|---|---|---|---|---|
| `Ready` | read-only discoverability summary与exact exposure/source versions完整 | Job first materialization或existing refresh final outcome | 否 | discovery read；changed plan -> Partial / Unavailable或same-state；source change -> Stale |
| `Partial` | usable shell存在,optional safe source不完整且policy允许 | Job build / refresh final outcome | 否 | degraded read；changed plan -> Ready / Unavailable或same-state；source change -> Stale |
| `Unavailable` | body-free shell可识别但当前不可服务 | Job build / refresh final outcome | 否 | unavailable surface；changed plan -> Ready / Partial或same-state；source change -> Stale |
| `Stale` | exposure、descriptor、relation或canonical reference已有newer accepted revision | actual core / reference propagation | 否 | Job rebuild -> Ready / Partial / Unavailable |

Invariant:`Ready -> state_reason=None`;`Partial / Unavailable / Stale -> state_reason=Some(DiscoveryUnavailableReason)`。Every state remains`is_listing_truth()==false`。

### 39.2 Persisted formation与ASCII状态图

Factory `build_read_only_summary(...)`先形成in-memory Ready。Planning已冻结final Ready / Partial / Unavailable + reason；target在first save前执行零或一次degraded member。Existing target先`refresh_from_exposure(...)`恢复in-memory Ready,再执行零或一次degraded member。只保存final object。

```text
factory base Ready ------------------------------> persisted Ready
                  +--mark_partial---------------> persisted Partial
                  +--mark_unavailable-----------> persisted Unavailable

existing Ready / Partial / Unavailable / Stale
  --refresh base Ready---------------------------> final Ready
                         +--mark_partial---------> final Partial
                         +--mark_unavailable-----> final Unavailable

Ready / Partial / Unavailable --source change---> Stale
Stale --source change----------------------------> no-op
```

### 39.3 Current不同状态转换矩阵

| # | From | To | Step 6触发 sequence | Step 9 actual flow | exact final guard | persisted object delta | UoW / propagation |
|---:|---|---|---|---|---|---|---|
| 1 | Ready | Partial | `refresh_from_exposure`;`mark_partial` | ecosystem discovery Job | frozen plan expected Partial + reason Some；same exposure/context/id parity | replace summary / versions,state Partial,reason Some,version +2 | one final save + derived capture + journal success same target UoW |
| 2 | Ready | Unavailable | refresh + `mark_unavailable` | same | expected Unavailable + reason Some | final Unavailable + reason,version +2 | same |
| 3 | Ready | Stale | `mark_stale(reason,now)` | §13.2 actual propagation | accepted newer source；notalreadyStale | state Stale,reason Some,version +1 | source owner UoW；`same_uow_actual_stale` |
| 4 | Partial | Ready | refresh only | ecosystem discovery Job | frozen plan complete,expected Ready + reason None | replace summary / versions,state Ready,reason None,version +1 | target atomic set |
| 5 | Partial | Unavailable | refresh + mark unavailable | same | expected Unavailable | final Unavailable + reason,version +2 | same |
| 6 | Partial | Stale | `mark_stale(...)` | actual propagation | accepted newer source | state Stale,reason replaced,version +1 | source owner UoW；actual-stale-only |
| 7 | Unavailable | Ready | refresh only | ecosystem discovery Job | expected Ready | final Ready,reason None,version +1 | target atomic set |
| 8 | Unavailable | Partial | refresh + mark partial | same | expected Partial | final Partial + reason,version +2 | same |
| 9 | Unavailable | Stale | `mark_stale(...)` | actual propagation | accepted newer source | final Stale + source reason,version +1 | source owner UoW；actual-stale-only |
| 10 | Stale | Ready | refresh only | ecosystem discovery Job | expected Ready | final Ready,reason None,version +1 | target atomic set |
| 11 | Stale | Partial | refresh + mark partial | same | expected Partial | final Partial + reason,version +2 | same |
| 12 | Stale | Unavailable | refresh + mark unavailable | same | expected Unavailable | final Unavailable + reason,version +2 | same |

Pair closure:`12 current + 0 reserved + 0 illegal = 12`。Persisted pair按pre-load state与single final save分类；in-memory Ready不增加pair。Wrong exposure/context、Stale frozen target、reason mismatch或required source failure属于rejection,不是未分类状态方向。

### 39.4 Same-state、no-op与factory version

| 场景 | 分类 | exact rule | version / effect |
|---|---|---|---|
| Ready -> Ready | current same-state revision | summary / source versions actual mismatch,final expected Ready | refresh +1；one final save/capture |
| Partial -> Partial | current same-state revision | final expected Partial butsummary / versions / reason actual mismatch | refresh +1 + mark_partial +1；one final save/capture |
| Unavailable -> Unavailable | current same-state revision | final expected Unavailable butcomplete outcome differs | refresh +1 + mark_unavailable +1；one final save/capture |
| exact Ready / Partial / Unavailable match | application no-op | exact exposure/context、summary、versions、state、optional reason全等 | `Unchanged`;no material Clock / id / save / capture |
| Stale -> Stale | application no-op | actual propagation seesalreadyStale | zero member/save/capture/effect ref |
| first persisted Ready | factory formation | build version=1 | one save/capture |
| first persisted Partial / Unavailable | compound factory formation | build version=1 + one degraded member | first saved object version=2；still one revision/capture |
| completed duplicate | stored replay | exact completed reservation | no exposure / material read andzero state calls |

Final state / reason由fresh planning一次冻结在existing Job plan private fields；reserved reentry不重读visibility、descriptor、relation、reference或marketplace state。Target只exact-loadplanned exposure与optional material,不能重新选state。

### 39.5 Owner边界、传播与测试切口

- Planning要求exact accepted/active exposure、source-version-symmetric Visible applicability和`is_consumable_by(Ecosystem(context))`;该判定不是runtime authorization或listing approval。
- Partial / Unavailable只来自policy允许的body-free optional source classification；required missing / forbidden source是failed target,不创建placeholder summary。
- Changed save、`DerivedMaterialRefreshed(EcosystemDiscovery)`capture与journal success同UoW；post-commit collaboration failure不mark unavailable。
- Query只映射persisted四态,没有synthetic Rebuilding；不得查询marketplace来补summary或state。
- No state grants listing、catalog ownership、ranking、pricing、transaction、settlement或fulfillment authority。

Step 16至少承接12 current pairs、3 current same-state revisions、3 exact no-op、Stale no-op、Ready/Partial/Unavailable reason symmetry、factory version 1/2、frozen-plan reentry、visibility version/applicability failure、mixed targets、UoW rollback、Query no-write和marketplace/runtime/core-write调用数为0。

### 39.6 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / owner exact | pass | 4 / 4 variants；owner=`ReadOnlyEcosystemDiscoverySummary.freshness_state` |
| persisted formation | pass | first save onlyReady / Partial / Unavailable；Stale actual propagation |
| pair全分类 | pass | all12 current,unclassified=0 |
| transient / final separation | pass | one final save/capture；in-memory Ready not counted |
| state / reason / version | pass | exact truth table + first-save version semantics |
| same-state / no-op | pass | complete frozen outcome equality isonlyUnchanged |
| applicability / authority | pass | formal visibility read-only；no listing/runtime/core ownership |
| Rustdoc / structure comments | pass | discovery struct、fields、plan fields和members英文`///`完整 |

---

## 40. Immutable `ReconciliationReportState` formation audit

### 40.1 为什么不写mutable From / To矩阵

`CapabilityReconciliationReport`是per-run append-only immutable report。`report_state`只在`from_findings(...)`或`failed(...)`中一次形成,`version`固定为1；repository只有append / immutable get语义。Later run必须使用new `CapabilityReconciliationReportId`,不能更新旧report、把Failed改Completed、把Inconsistent改RebuildRequired或写supersede pointer。

因此本节只审计factory outcome、formation guard、Job effect与follow-up hint。任何`Completed -> ...`或`Inconsistent -> RebuildRequired`箭头都会伪造不存在的member / repository update,违反Step 10 callable gate。

### 40.2 Outcome集合与formation表

| Outcome | 作用 | Factory | exact planning / factory guard | failure_reason | report-only implication |
|---|---|---|---|---|---|
| `Completed` | declared complete comparison basis未发现partial coverage、inconsistency或rebuild need | `from_findings(...,Completed,...)` | complete non-empty frozen truth/material basis；deterministic comparison selectsCompleted；factory rejectsFailed input | None | visible final report；no material/core mutation |
| `Partial` | complete inspected basis中有stable typed coverage gap,但仍足够形成可解释report | `from_findings(...,Partial,...)` | planning完成全部declared paging / exact-load classification并保留body-free gap finding；不得保存page prefix冒充Partial | None | public report degraded；matchingStableFailure run issue,不自动补扫 |
| `Inconsistent` | truth与material存在可解释不一致,但planning未选择explicit rebuild-required conclusion | `from_findings(...,Inconsistent,...)` | valid non-empty frozen basis + deterministic mismatch finding | None | `identifies_stale_material`可true；Advisory only,不改material |
| `RebuildRequired` | finding明确一个或多个rebuildable material需要独立后续rebuild | `from_findings(...,RebuildRequired,...)` | valid non-empty frozen basis + deterministic rebuild-required finding | None | `requires_rebuild()==true`;只形成hint,zero nested Job / material save |
| `Failed` | valid non-empty inspected basis存在,但comparison / report generation形成可安全持久化的失败结论 | `failed(...)` | complete basis + non-empty safe `ReconciliationFailureReason`;matchingStableFailure run issue required | Some | failed report仍append/capture；public Job disposition Failed,不修truth |

`ReconciliationFindingSummary`是body-free report内容,不是状态解析协议。Planning必须在完整typed comparison过程中同时冻结summary与closed enum outcome；factory只校验non-Failed-vs-Failed入口和field invariant。Implementation / fake不得在reentry、Query或repository层解析summary text重新选择state。

### 40.3 ASCII formation与zero-report分支

```text
fresh reconciliation planning
  |
  +-- invalid public scope ----------------------> Rejected;no report
  +-- complete valid empty scan -----------------> Completed Job detail with report=None
  +-- incomplete basis / stable-retryable failure> issue-bearing zero-target plan;report=None
  |
  +-- complete non-empty frozen basis
        |
        +-- deterministic outcome Completed ------> from_findings -> append new report v1
        +-- deterministic outcome Partial --------> from_findings -> append new report v1
        +-- deterministic outcome Inconsistent ---> from_findings -> append new report v1
        +-- deterministic outcome RebuildRequired > from_findings -> append new report v1
        +-- safe persisted failure ---------------> failed        -> append new report v1

existing report --X--> any state update
new run -----------> new report id + one newly selected outcome
```

Empty scan与planning failure都没有domain report,但Job disposition / run issues不同。它们不得生成fake empty `AccessTruthRefSet / DerivedMaterialRefSet`、fake report id、fake `job_run_id`或Failed report。

### 40.4 Factory、append、replay与follow-up审计

| 场景 | Required behavior | Forbidden shortcut |
|---|---|---|
| `from_findings` | accept onlyCompleted / Partial / Inconsistent / RebuildRequired；non-empty truth / material sets、source versions、actor / trace / run / time完整；version=1 | caller passesFailed withreason hidden insummary |
| `failed` | forceFailed andSome safe reason；same complete basis / metadata requirements；version=1 | convert any early repository error into fabricated domain report |
| target commit | report append + `DerivedMaterialRefreshed(ReconciliationReport)`capture + journal Succeeded inone UoW | update inspected material、registry或core truth |
| `RebuildRequired` | pure `requires_rebuild()`hint may be read；current flow invokeszero rebuild service | nested Job、new idempotency key、material save |
| current Query | immutable `get`;copy exact state / findings / refs；mapFailed toUnavailable surface | repair、supersede、parse findings、infer fromjob existence |
| completed duplicate | typed stored Job report replay only | append second report、find by run、rescan scope |
| new run same scope | new report id andfresh complete basis | mutate prior report orreuseprior id/version |
| post-commit event collaboration failure | prior report / journal unchanged；capture remainsrepairable | change report toFailed orroll backappend |

Both registry-centered and broad derived reconciliation Jobs use the same factories andimmutable repository,但scope guard不同。Registry Job不得形成`CapabilityRegistryChanged`;derived Job不得把RebuildRequired展开成view/directory/export/discovery target。

### 40.5 Test cuts与immutable stop review

Step 16至少承接5 factory outcomes、from_findings拒绝Failed、failed要求reason、state/reason invariant、empty scan no report、incomplete basis no report、report append/capture/journal atomicity、new-run new-id、duplicate no append/rescan、Query no-write、RebuildRequired nested-job count=0、all core/material save counts=0，以及job run id / trace id / report id三者不可替代。这里只写设计义务,不声称任何run或test存在。

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / owner exact | pass | 5 / 5 outcomes；owner=`CapabilityReconciliationReport.report_state` |
| mutable state subject | excluded | report immutable per run；no transition member / update repository |
| five outcome construction | pass | two existing factories + deterministic complete planning basis |
| zero-report branch | pass | empty / incomplete pre-basis不伪造report |
| field invariant | pass | Failed iff factory failed + reason Some；others reason None；version=1 |
| follow-up boundary | pass | RebuildRequired hint only；no nested Job / material/core write |
| replay / Query | pass | immutable get / stored replay；no parsing orrepair |
| Rustdoc / structure comments | pass | report struct、allfields、enum variants与public factory / helper英文`///`完整 |

---

## 41. Batch `10.4` 跨状态机审计

### 41.1 Enum / pair / formation覆盖

| 审计项 | 期望 | 实际 | 结论 |
|---|---:|---:|---|
| mutable owner state machine | 4 | 4 | pass |
| immutable report outcome family | 1 | 1 formation audit | pass |
| mutable exact enum variants | view 5 + directory 4 + audit 4 + discovery 4 | 17 / 17 | pass |
| immutable exact outcomes | reconciliation 5 | 5 / 5 | pass |
| mutable possible different-state pairs | 20 + 12 + 12 + 12 | 56 | pass |
| current different-state edges | 12 + 6 + 12 + 12 | 42 | pass |
| reserved different-state edges | 7 + 5 + 0 + 0 | 12 | pass |
| illegal different-state edges | 1 + 1 + 0 + 0 | 2 | pass |
| unclassified mutable pair | 0 | 0 | pass |

```text
5 * (5 - 1) = 20
4 * (4 - 1) = 12
4 * (4 - 1) = 12
4 * (4 - 1) = 12
mutable total = 56

42 current + 12 reserved + 2 illegal = 56
unclassified = 0

reconciliation = 5 immutable factory outcomes;0 mutable pair by design
```

Factory / same-state / no-op另计:

| Owner | Current persisted factory outcome | Current same-state revision | Application no-op |
|---|---|---|---|
| controlled view | Ready / Partial bytyped partial set | Ready / Partial changed refresh | exact Ready / Partial match；alreadyStale propagation |
| directory | Ready | Ready changed refresh | exact Ready match；alreadyStale propagation |
| audit export | Ready / Partial / Unavailable aftercompound in-memory formation | Ready / Partial / Unavailable changed preparation | complete `matches_preparation`;alreadyStale propagation |
| ecosystem discovery | Ready / Partial / Unavailable aftercompound in-memory formation | Ready / Partial / Unavailable changed rebuild | complete frozen plan match；alreadyStale propagation |
| reconciliation report | all five outcomes,one pernew report | none | completed duplicate replays stored report；no domain report equality update |

### 41.2 Callable / actual-flow审计

| Owner | Current callable sequence | Exact flow | Result |
|---|---|---|---|
| controlled-view formation / refresh | `build`;`refresh_from_exposure`;freshness policy | `job_refresh_controlled_consumer_view_flow` | pass；typed Partial deterministic,final-only save |
| controlled-view stale | `mark_stale` | all§13.2 core/reference propagation sites | pass；non-stale only,alreadyStale no-op |
| controlled-view rebuilding / unavailable | `mark_rebuilding`;`mark_unavailable` | no current caller | pass；7 pairs reserved,notadvertised current |
| directory formation / refresh | `build_from_access_truth`;`refresh_from_access_truth` | `job_rebuild_directory_search_browse_projection_flow` | pass；final-only Ready |
| directory stale | `mark_stale` | actual propagation | pass |
| directory rebuilding / unavailable | `mark_rebuilding`;`mark_unavailable` | no current caller | pass；5 pairs reserved |
| audit preparation | build / refresh -> attach* -> optional mark_partial / mark_unavailable | `job_prepare_audit_friendly_export_summary_flow` | pass；one final save,allnon-Stale outcomes |
| audit stale | `mark_stale` | actual propagation | pass |
| discovery rebuild | build / refresh -> optional mark_partial / mark_unavailable | `job_rebuild_read_only_ecosystem_discovery_summary_flow` | pass；one final save,allnon-Stale outcomes |
| discovery stale | `mark_stale` | actual propagation | pass |
| reconciliation | `from_findings`;`failed` | registry + derived reconciliation Jobs | pass；immutable append,nottransition |

No current row usesrepository-only state assignment、private SQL flag、adapter health、timestamp、error text、runtime/tools state、SDK client cache、marketplace listing、audit body orjob target state asdomain trigger。

### 41.3 Cross-machine transaction与propagation审计

| Scenario | Atomic / ordered set | No-op / failure boundary | Result |
|---|---|---|---|
| core/reference accepted source change | source truth/state + records/traces/receipt/result + each actual stale material save/capture | alreadyStale omitted；multi-subject material dedup；any staged sidecar failure rolls backowner UoW | pass |
| controlled-view refresh target | final Ready/Partial view + availability capture + journal success | exact match journal-only；target failure leavesprior view unchanged | pass |
| directory rebuild target | final Ready projection + derived capture + journal success | exact Ready match journal-only；no degraded placeholder | pass |
| audit preparation target | one final Ready/Partial/Unavailable export afterclear/reattach + derived capture + journal success | Invalid/Forbidden/missing exact pair fails；complete match no-op | pass |
| discovery rebuild target | one final Ready/Partial/Unavailable summary + derived capture + journal success | invalid applicability/source fails；complete match no-op | pass |
| reconciliation target | immutable report append + report-derived capture + journal success | no basis -> no report；RebuildRequired no nested Job | pass |
| all changed targets post-commit | exact local capture maycollaborate | collaboration failure cannotrewrite material/report/Job item | pass |
| Query | persisted state -> explicit visible/degraded/unavailable mapping | zero member/save/Job calls；no repair | pass |

Current Jobs usejournal target state forreentry,notdomain Rebuilding。No Job writescore truth,repairscanonical source,orusesfailure state toclaimpartial target success。

### 41.4 State-field、reason与version审计

| Owner | Exact invariant | Result |
|---|---|---|
| controlled view | structured summary partial kinds empty iffReady target,non-empty allowed iffPartial target；no private reason column；refresh/state mutation version rules explicit | pass after reopen |
| directory | Ready/Rebuilding reason None；Stale/Unavailable reason Some | pass |
| audit | Ready reason None；Partial/Unavailable/Stale reason Some；resolved attachments only | pass |
| discovery | Ready reason None；Partial/Unavailable/Stale reason Some；listing guard alwaysfalse | pass |
| reconciliation | Failed reason Some；other outcomes reason None；version exactly1 | pass |
| transient member sequence | onlyfinal object saved/captured；in-memory version increments retained,not split intoevents | pass |
| expected version | update usesloaded material expected_version；create usesNone；report append isnew id | handed toStep 11 withoutguessingSQL |

### 41.5 Authority、historical、Rustdoc与fabrication审计

| 检查 | 结果 |
|---|---|
| view / projection / export / discovery / report反写真相 | no |
| Rebuilding被Job execution journal state替代或混用 | no；domain variant reserved where declared,journal remainsseparate technical owner |
| consumer Partial从safe text / error推断 | no；typed closed set only |
| Query触发refresh / mark stale / repair | no |
| audit export形成evidence alias / sign-off / approval | no |
| ecosystem discovery形成listing / pricing / transaction truth | no |
| runtime/tools execution或SDK client/cache进入state | no |
| reconciliation finding自动触发rebuild / Command | no |
| old formal`03` / README作为matrix source | no；historical_material only |
| new public type / HLD object / helper / enum / variant / DTO field / Port / protocol / flow | 0 |
| reworked carrier private fields | 2；`DescriptorConsumerSummary.safe_summary / partial_kinds`,均有英文`///` |
| public callable delta | net +6；existing summary / partial-set replacement surface,全部英文`///` |
| matching structs / all fields / enum variants / variant payload Rustdoc omission | 0；用户要求的结构体注释门禁通过 |
| formal `03-详细设计.md` modified | no |
| implementation ledger / planned boundary skeleton | not created |
| implementation commit / real run_id / test result / evidence alias / acceptance sign-off | none |
| unresolved upstream blocker | 0；1项local controlled reopen已关闭 |
| current commit requirement | none |

### 41.6 Mechanical stop audit

| Gate | Result |
|---|---|
| every state name exact Step 6 variant | pass |
| every current edge exact callable sequence + Step 9 flow | pass |
| every reserved edge existing member + zero current caller | pass |
| every illegal direction zero-mutation rule | pass |
| factory / transient / persisted / same-state / no-op separated | pass |
| 56 mutable pairs arithmetic | pass；42 + 12 + 2 = 56 |
| 5 immutable outcomes no fake pair | pass |
| reason / optional field truth table | pass |
| source authority / no-truth-repair / owner boundary | pass |
| structure / field / callable English Rustdoc | pass；omission=0 |
| conflict marker / malformed fence / whitespace | pass；final mechanical command无损坏字符 / conflict marker,四个changed Step文件fence count均为偶数,whitespace check通过 |

---

## 42. Batch `10.4` 完成结论与停审

| Gate | 结果 |
|---|---|
| 用户允许进入`10.4` | pass |
| §12第四行、§27~§34与Step 6 / 7 / 8 / 9 exact inputs已读 | pass |
| controlled consumer view矩阵 / stop review | pass |
| directory projection矩阵 / stop review | pass |
| audit export矩阵 / stop review | pass |
| ecosystem discovery矩阵 / stop review | pass |
| immutable reconciliation formation audit | pass；5 outcomes,no fake transition |
| 56 mutable possible different-state pairs分类 | pass；42 current + 12 reserved + 2 illegal,unclassified=0 |
| controlled reopen | pass；typed Partial input、exact member guards与current final-only save已闭合 |
| Rustdoc / 结构注释门禁 | pass；reworked private fields / methods与matching structs / fields注释完整 |
| cross-owner UoW / authority / historical / fabrication | pass |
| 正式文档 / implementation artifact / commit | none |

```text
gate_status = 03_step_10_batch_10_4_completed_wait_user_review
completed_document = 03-详细设计.md
completed_step = Step 10 batch 10.4 controlled view / directory / audit / discovery matrices + immutable reconciliation formation audit
formal_document_written = false
unresolved_upstream_blocker = 0
next_allowed_action = start_03_step_10_batch_10_5_after_user_confirmation
commit_required = false
```

下一批只可在用户明确确认后进入`10.5`。进入前必须读取:

1. 本文件§12第五行及§35~§42,尤其current / reserved定义、actual-stale-only与immutable report边界；
2. Step 6 §7.9、§7.10.3~§7.10.6、§11.7~§11.13、§15.2与reference controlled reopens；
3. Step 7 external-reference / canonical-state repositories和8类resolver Port；
4. Step 8 reference Commands / Consumers / Queries / refresh Job cards；
5. Step 9 all8-kind initial / transition / replacement / terminal / same-value-reason flows；
6. 正式`02-概要设计.md` §9~§10的external-owner / body-free / no-runtime-state边界。

不得提前进入`10.6`、修改正式`03-详细设计.md`、创建implementation ledger / planned boundary skeleton或提交commit。

---

## 43. Batch `10.5` 输入复核、受控回开与canonical owner

### 43.1 开工门禁与exact读取结论

| 读取主题 | exact结论 | 矩阵约束 |
|---|---|---|
| canonical owner | `ReferenceResolutionState`是8类ref唯一local resolution truth；per-ref object只存`resolution_state_id` | 8张矩阵共享owner / repository,但不得合并kind-specific policy |
| state set | `Resolved / Unresolved / Stale / Invalid / Unavailable / Forbidden`适用于8类；仅`GovernanceResult`额外允许`Expired` | 7张6态矩阵 + 1张7态矩阵；non-governance的Expired是out-of-subset,不进入pair分母 |
| formation | current flow统一调用`from_initial_resolution(...)`；`resolved(...) / unresolved(...)`无Step 9调用 | factory formation与different-state pair分开；Forbidden不允许initial formation |
| mutable callable | `transition(...)`承接different-value和non-terminal same-value reason revision；`mark_forbidden(...)`只承接typed marker Command | repository save / resolver branch不得冒充domain transition |
| terminal | current`Invalid / Forbidden` candidate不得调用resolver恢复；refresh Job稳定`Skipped` | reason变化也不能修改terminal；恢复只能形成different candidate / subject |
| re-observation | exact value + reason相同不改state；value相同但safe reason变化是version +1 revision | Command / Consumer / Job disposition分别保持no-op rejection / Ignored / Unchanged语义 |
| replacement | same subject的locator / scope revision不等于terminal recovery；terminal recovery必须new subject + new state id | 不把object field replacement计为state pair |
| Query | generic state Query与4类typed ref Query只读persisted ref/state pair | Query不得resolver refresh、state save、material stale或truth repair |
| Job传播 | refresh Job只保存canonical state + `ReferenceResolutionChanged` capture + journal success | dependent material stale传播不是该Job target UoW的一部分 |
| owner red line | source / governance / method / secret / document / runtime / SDK / observability只允许body-free ref与reason | 不复制provider body、approval、method body、secret、execution、SDK client或audit evidence |

本批停止点是8张kind-specific矩阵、cross-kind pair算术和mechanical audit。不得进入`CapabilityEventCaptureState`或external`EventCollaborationStatus`,不得修改正式`03-详细设计.md`。

### 43.2 Controlled reopen `CH-DDD-S10-REFERENCE-SAME-VALUE-COMMAND-001`

| 项 | 原冲突 | 收口 |
|---|---|---|
| Step 6 object | non-terminal same value + changed`ReferenceResolutionReason`必须调用`transition(...)`并形成revision | 保持不变 |
| Inbound / Job | 5条reference Consumer和refresh Job已按value + reason二元比较 | 保持不变 |
| Step 8 Command card | 旧措辞把所有Same-value都归为rejected / no-op | 改为仅value + reason完全相同no-op；reason delta是actual revision |
| Step 9 Command flow | 旧pseudocode在`target == previous_value`时提前返回,且post-call invariant拒绝same-value revision | 保存`previous_reason`,只对value + reason完全相同提前返回；post-call按version与二元组判断actual revision |
| 计数 / 声明 | 无需新增type / field / callable / DTO / protocol / flow / Port | 43 HLD objects + 7 helpers、36 Ports、83 protocols / flows不变 |

该冲突是本仓详细设计内部不一致,不是上游项目 blocker。Step 8 / 9已经同步；没有新增或重写Rust struct / enum / field / variant / public callable,因此没有新增Rustdoc主体。Existing相关declaration的英文`///`注释保持完整。

### 43.3 Canonical owner callable与revision不变量

| 分类 | exact callable / source | current性 | exact contract |
|---|---|---|---|
| initial formation | `ReferenceResolutionState::from_initial_resolution(...)` | current；registration Command / Inbound Consumer | subject-kind一致、kind initial subset合法、reason body-free；version=1；state id与ref link对称 |
| convenience formation | `resolved(...)` / `unresolved(...)` | reserved callable；Step 9 call count=0 | 不得让实现自行替换current factory；若未来调用仍受相同subject-kind / initial subset约束 |
| different-state | `transition(target,reason,actor,trace,policy,now)` | current；Record Command、5 Consumers、refresh Job及relation re-observation | policy先验证kind subset / pair；state id / subject / kind不变；value、reason、checked_by、trace、last_checked_at更新；version +1 |
| same-value reason revision | same `transition(...)` | current for non-terminal | target=current且reason不同；metadata / reason更新、version +1；不是duplicate或no-op |
| exact no-op | application precheck或Job comparison | current | value + reason均相同；不调用save / capture；不更新时间 |
| typed forbidden | `mark_forbidden(ForbiddenBodyReason,...)` | current only onRecord Command marker branch | scanner-ownedtyped redacted reason；不保存命中body；non-terminal -> Forbidden |
| policy | `validate_subject_kind / validate_transition` | current pure guard | 不访问resolver / repository；Expired只允许GovernanceResult；terminal无outgoing pair |

Every accepted revision keeps one stable `resolution_state_id` and one exact `reference_subject / reference_kind` pair. Different candidate registration forms a new subject and a new state id;it never overwrites the old terminal candidate or installs a second current value for the old subject.

### 43.4 Kind-specific initial subset

| `ReferenceKind` | current initial values | current formation flow | excluded initial values | reason |
|---|---|---|---|---|
| `ExternalCapabilitySource` | Resolved、Unresolved、Stale、Unavailable；Inbound also Invalid | establish Register；source Inbound ResolveOrRegister | Forbidden、Expired | Command rejects unusable terminal;Inbound may retain body-free structurally invalid candidate;Forbidden body not persisted;Expired out-of-subset |
| `GovernanceResult` | Resolved、Unresolved、Stale、Unavailable、Expired；Inbound also Invalid | attach / replace Register；governance Inbound ResolveOrRegister | Forbidden | only kind with expiry semantics；Forbidden governance body quarantined |
| `MethodAsset` | Resolved、Unresolved、Stale、Unavailable；Inbound also Invalid | method attach Register；method Inbound ResolveOrRegister | Forbidden、Expired | Invalid body-free locator may be retained by Inbound；method body is not |
| `Secret` | Resolved、Unresolved、Stale、Unavailable | descriptor secret attach | Invalid、Forbidden、Expired | invalid candidate and forbidden marker reject the entire attachment |
| `ExternalDocument` | Resolved、Unresolved、Stale、Unavailable；Inbound also Invalid | document Register；document Inbound ResolveOrRegister | Forbidden、Expired | invalid body-free pointer may be retained by Inbound；document body is quarantined |
| `RuntimeToolsConsumer` | Resolved、Unresolved、Stale、Unavailable | consumer Register RuntimeTools branch | Invalid、Forbidden、Expired | registration does not accept terminal candidate or execution body |
| `SdkConsumer` | Resolved、Unresolved、Stale、Unavailable | consumer Register SDK branch | Invalid、Forbidden、Expired | registration does not accept terminal candidate or SDK client body |
| `ObservabilityAudit` | Resolved、Unresolved、Stale、Unavailable、Invalid | audit Inbound ResolveOrRegister | Forbidden、Expired | invalid body-free audit pointer may be retained；raw audit / evidence body is quarantined |

`Invalid` initial formation只由上述5条Inbound ResolveOrRegister path current可达；Command registration拒绝Invalid。所有kind的Forbidden initial formation均为illegal:scanner / resolver发现forbidden candidate时形成redacted rejection / quarantine,不得调用`from_initial_resolution`保存state。

### 43.5 Pair分类基线

| kind matrix | exact variants | possible different-state pairs | current | reserved | illegal |
|---|---:|---:|---:|---:|---:|
| external capability source | 6 | 30 | 14 | 0 | 16 |
| governance result | 7 | 42 | 18 | 0 | 24 |
| method asset | 6 | 30 | 14 | 0 | 16 |
| secret | 6 | 30 | 14 | 0 | 16 |
| external document | 6 | 30 | 14 | 0 | 16 |
| runtime / tools consumer | 6 | 30 | 14 | 0 | 16 |
| SDK consumer | 6 | 30 | 14 | 0 | 16 |
| observability / audit | 6 | 30 | 14 | 0 | 16 |
| total | 49 kind-applicable variants | 252 | 116 | 0 | 136 |

For each six-state kind,current edges are`Resolved -> Unresolved / Stale / Unavailable`,the three recoverable degraded values back to`Resolved`,and all four non-terminal values to`Invalid / Forbidden`。For governance,`Expired` joins the recoverable degraded set。This shared arithmetic is only an audit baseline;§44~§51 each independently names its own flows、initial subset、replacement andowner boundary。

---

## 44. External capability source reference矩阵

### 44.1 状态集合与formation

| 状态 | 含义 | current reachability | terminal | 不拥有 |
|---|---|---|---|---|
| `Resolved` | body-free MCP / A2A / API source locator可解析 | Command / Inbound formation；recovery | 否 | provider health / invocation success |
| `Unresolved` | locator可达语义不足或当前无法解析 | formation；degradation / re-observation | 否 | provider response |
| `Stale` | locator可能不再指向current external fact | formation；degradation | 否 | provider version truth |
| `Unavailable` | resolver边界暂不可用的explicit state observation | formation；degradation | 否 | runtime route / retry |
| `Invalid` | candidate结构不符合source kind | Inbound formation或existing transition | 是 | invalid payload body |
| `Forbidden` | candidate触碰forbidden source body boundary | existing transition / typed marker | 是 | matched body |

`Expired`对该kind不适用。Establish Register只在Resolved / Unresolved / Stale / Unavailable下继续identity factory；Inbound ResolveOrRegister可持久化Invalid但不会创建identity。

### 44.2 ASCII状态图

```text
factory(Command) -> Resolved / Unresolved / Stale / Unavailable
factory(Inbound) -> Resolved / Unresolved / Stale / Unavailable / Invalid

Resolved ----> Unresolved / Stale / Unavailable
   ^                         |
   +---- Unresolved / Stale / Unavailable

Resolved / Unresolved / Stale / Unavailable ----> Invalid
Resolved / Unresolved / Stale / Unavailable ----> Forbidden

Invalid / Forbidden --X--> any different value
```

### 44.3 Current different-state转换

| group | From | To | pair count | callable | exact flow | guard / delta / effect |
|---:|---|---|---:|---|---|---|
| 1 | Resolved | Unresolved / Stale / Unavailable | 3 | `transition` | Record Command；source Inbound；refresh Job | exact source union、kind、state-id、candidate digest；state metadata/version +1；channel-specific capture |
| 2 | Unresolved / Stale / Unavailable | Resolved | 3 | `transition` | same | resolver or trusted intent returns body-free Resolved；no provider body |
| 3 | Resolved / Unresolved / Stale / Unavailable | Invalid | 4 | `transition` | Record Command；source Inbound；refresh Job | body-free structural reason；candidate becomes terminal |
| 4 | Resolved / Unresolved / Stale / Unavailable | Forbidden | 4 | `transition` or `mark_forbidden` | resolver observations use`transition`；Record typed marker uses`mark_forbidden` | no body retained；candidate becomes terminal |

Current pair count=14。Record Command actual revision also marks exact reference-dependent mutable materials stale in the same UoW；Inbound saves ref/state delta andcapture only；refresh Job saves state + capture + journal success anddoes not mark materials。

### 44.4 Same-value、reference revision与replacement

| case | current contract |
|---|---|
| non-terminal same value + changed reason | one`transition` revision；Record / Inbound / Job current |
| non-terminal same value + same reason | Command no-op rejection；Inbound `Ignored + NoLocalEffect`；Job `Unchanged` |
| Invalid / Forbidden current | terminal；Job `Skipped` before resolver；Command/Inbound cannot reason-revise or recover |
| locator-only Existing Inbound delta | `ExternalCapabilitySourceRef::replace_locator(...)` saves ref version only,keeps same state id；no reference-state capture |
| terminal replacement | changed candidate throughInbound ResolveOrRegister forms new source subject + state；old terminal remains；identity is not created or rewritten bythe Consumer |
| direct establish Register | new source may support a new identity intake；it is not replacement of an existing identity/source link |

### 44.5 Illegal pair与stop review

| illegal source | targets | count | handling |
|---|---|---:|---|
| Unresolved | Stale / Unavailable | 2 | explicit policy rejection；must first resolve or receive a supported direct edge |
| Stale | Unresolved / Unavailable | 2 | same |
| Unavailable | Unresolved / Stale | 2 | same |
| Invalid | other 5 values | 5 | terminal candidate；new subject required |
| Forbidden | other 5 values | 5 | terminal candidate；new body-free subject required |
| total |  | 16 | `14 current + 0 reserved + 16 illegal = 30` |

Step 16至少承接4 Command initial outcomes、5 Inbound initial outcomes、14 current pairs、16 illegal pairs、same-value reason/no-op、locator-only revision、terminal Job skip、new-subject replacement、identity no-auto-create及provider body/runtime negative cases。单机停审:enum subset、callable、flow、version、capture和owner boundary均pass；无上游blocker。

### 44.6 单状态机停审记录

| 审查项 | 结论 | exact证据 |
|---|---|---|
| enum / kind subset | pass | 6 applicable values；Expired out-of-subset |
| factory / initial | pass | Command 4 + Inbound Invalid共5 outcomes；Forbidden initial=0 |
| current / illegal pair | pass | 14 / 16,unclassified=0 |
| same-value / terminal | pass after reopen | non-terminal reason revision；Invalid / Forbidden terminal |
| ref revision / replacement | pass | locator-only vsnew subject分开；no identity auto-write |
| owner / Rustdoc / test handoff | pass | no provider/runtime body；new declaration=0；test cuts named |

---

## 45. Governance result reference矩阵

### 45.1 状态集合与formation

| 状态 | 含义 | current reachability | terminal | 不拥有 |
|---|---|---|---|---|
| `Resolved` | governance / policy result ref可安全解析 | Command / Inbound formation；recovery | 否 | approval / Policy truth |
| `Unresolved` | result ref当前不可解析 | formation；degradation | 否 | workflow state |
| `Stale` | external result ref可能不再current | formation；degradation | 否 | governance source lifecycle |
| `Unavailable` | governance resolver boundary暂不可用 | formation；degradation | 否 | platform health |
| `Expired` | referenced result orallowed summary已过期 | formation；Resolved degradation | 否 | approval expiration owner truth |
| `Invalid` | body-free candidate结构非法 | Inbound formation或existing transition | 是 | invalid external body |
| `Forbidden` | governance body boundary被触碰 | existing transition / typed marker | 是 | approval、vote、Policy body |

Only this matrix includes`Expired`。Attach Register may persist any recoverable value andmaps non-Resolved relation toUnresolved；replacement Command requires the final replacement state Resolved before changing either relation。

### 45.2 ASCII状态图

```text
factory(Command) -> Resolved / Unresolved / Stale / Unavailable / Expired
factory(Inbound) -> Resolved / Unresolved / Stale / Unavailable / Expired / Invalid

Resolved ----> Unresolved / Stale / Unavailable / Expired
   ^                                      |
   +---- Unresolved / Stale / Unavailable / Expired

all five non-terminal values ----> Invalid / Forbidden
Invalid / Forbidden --X--> any different value
```

### 45.3 Current different-state转换

| group | From | To | pair count | callable | exact flow | guard / delta / effect |
|---:|---|---|---:|---|---|---|
| 1 | Resolved | Unresolved / Stale / Unavailable / Expired | 4 | `transition` | Record Command；governance attach / replace re-observation；governance Inbound；refresh Job | exact governance subject/kind/digest/state id；body-free reason；version +1 |
| 2 | Unresolved / Stale / Unavailable / Expired | Resolved | 4 | `transition` | same | candidate remains same andresolver observation isResolved；does not approve capability |
| 3 | five non-terminal values | Invalid | 5 | `transition` | Record Command；Inbound；refresh Job | structural reason；candidate terminal |
| 4 | five non-terminal values | Forbidden | 5 | `transition` or `mark_forbidden` | observation vs typed marker branch | no governance body retained；candidate terminal |

Current pair count=18。`Resolved -> Expired` and`Expired -> Resolved` are legal only here。A governance seam does not automatically follow canonical state:Inbound / Job never mutate seam；attach / replacement Command owns any relation creation / replacement in its own declared flow。

### 45.4 Same-value、scope revision与replacement

| case | current contract |
|---|---|
| non-terminal same value + changed reason | one state revision/capture；supported byRecord、attach Existing、Inbound andJob |
| exact same observation | Command no-op rejection；Inbound Ignored；Job Unchanged；attach Existing keeps exact state ref |
| terminal current | Job Skipped；no resolver recovery / reason revision |
| scope-only Inbound delta | `GovernanceResultRef::replace_scope(...)` revisions ref only whenkind/source unchanged；state id stable |
| terminal/new candidate replacement | Inbound ResolveOrRegister withdifferent candidate forms new subject/state；old terminal remains |
| seam replacement Command | replacement ref/state must beResolved andnew seam must becomeActive beforeold seam -> Replaced；Invalid / Forbidden / Expired replacement cannot alterold seam |

### 45.5 Illegal pair与stop review

| illegal source | targets | count | handling |
|---|---|---:|---|
| each of Unresolved / Stale / Unavailable / Expired | the other three degraded values | 12 | exact policy rejection；no generic degraded-to-degraded shortcut |
| Invalid | other 6 values | 6 | terminal |
| Forbidden | other 6 values | 6 | terminal |
| total |  | 24 | `18 current + 0 reserved + 24 illegal = 42` |

Step 16至少承接6 initial outcomes、18 current pairs、24 illegal pairs、Expired only-kind gate、same-reason/no-op、scope-only revision、terminal skip、new subject andseam replacement ordering、approval / Policy body negative cases。单机停审pass；no upstream blocker。

### 45.6 单状态机停审记录

| 审查项 | 结论 | exact证据 |
|---|---|---|
| enum / kind subset | pass | all 7 values；Expired only here |
| factory / initial | pass | Command 5 recoverable + Inbound Invalid共6；Forbidden initial=0 |
| current / illegal pair | pass | 18 / 24,unclassified=0 |
| same-value / terminal | pass | reason revision/no-op exact；Invalid / Forbidden terminal |
| scope / subject / seam replacement | pass | ref revision、new subject、relation replacement三层分离 |
| authority / Rustdoc / test handoff | pass | no approval / Policy body；new declaration=0；test cuts named |

---

## 46. Method asset reference矩阵

### 46.1 状态集合与formation

| 状态 | 含义 | current reachability | terminal | 不拥有 |
|---|---|---|---|---|
| `Resolved` | body-free method asset locator可解析 | Command / Inbound formation；recovery | 否 | method body/publication |
| `Unresolved` | locator当前不可解析 | formation；degradation | 否 | asset lifecycle |
| `Stale` | locator可能指向旧asset fact | formation；degradation | 否 | version body |
| `Unavailable` | method resolver boundary暂不可用 | formation；degradation | 否 | source repository health |
| `Invalid` | asset kind / locator结构非法 | Inbound formation或transition | 是 | method definition body |
| `Forbidden` | candidate触碰method body boundary | transition / typed marker | 是 | code、TaskDefinition、Policy definition |

`Expired` out-of-subset。Attach Register accepts four non-terminal values；Inbound ResolveOrRegister additionally persistsInvalid。No flow imports method content。

### 46.2 ASCII状态图

```text
factory(Command) -> Resolved / Unresolved / Stale / Unavailable
factory(Inbound) -> Resolved / Unresolved / Stale / Unavailable / Invalid

Resolved ----> Unresolved / Stale / Unavailable
   ^                         |
   +---- Unresolved / Stale / Unavailable

four non-terminal values ----> Invalid / Forbidden
Invalid / Forbidden --X--> any different value
```

### 46.3 Current different-state转换

| group | From | To | pairs | callable | exact flow | guard / effect |
|---:|---|---|---:|---|---|---|
| 1 | Resolved | Unresolved / Stale / Unavailable | 3 | `transition` | Record Command；method attach Existing；method Inbound；refresh Job | exact asset kind/locator/digest/state link；state revision/capture bychannel |
| 2 | Unresolved / Stale / Unavailable | Resolved | 3 | `transition` | same | body-free resolver success；does not publish asset |
| 3 | four non-terminal | Invalid | 4 | `transition` | Record / Inbound / Job | candidate terminal |
| 4 | four non-terminal | Forbidden | 4 | `transition` or `mark_forbidden` | observation / typed marker | no method body retained |

Current pair count=14。Method relation creation mapsResolved toActive andother accepted non-terminal values toUnresolved；reference changes afterthat do not automatically mutate the relation。

### 46.4 Same-value、locator revision与replacement

| case | current contract |
|---|---|
| non-terminal reason delta | one revision via`transition`；Record / attach Existing / Inbound / Job |
| exact no-op | channel-specific no-op；no state save/capture |
| terminal | Job Skipped；no in-place recovery |
| locator-only Inbound delta | `MethodAssetRef::replace_locator(...)` revises ref,keeps state id；no state capture |
| terminal replacement | different candidate throughInbound ResolveOrRegister createsnew subject/state；old terminal remains |
| relation attach | Existing re-observe never changes locator；new relation requires explicit attach anddoes not mutate method-library truth |

### 46.5 Illegal pair与stop review

| source | targets | count |
|---|---|---:|
| Unresolved | Stale / Unavailable | 2 |
| Stale | Unresolved / Unavailable | 2 |
| Unavailable | Unresolved / Stale | 2 |
| Invalid | other 5 | 5 |
| Forbidden | other 5 | 5 |
| total |  | 16 |

All illegal rows return domain/policy rejection withzero mutation；exact Step 12 variant remainslater-owned。Step 16至少承接5 initial outcomes、14/16 pair split、reason revision/no-op、locator-only revision、terminal replacement、relation no-auto-mutation andmethod body / source-code negatives。单机停审pass；no blocker。

### 46.6 单状态机停审记录

| 审查项 | 结论 | exact证据 |
|---|---|---|
| enum / kind subset | pass | 6 values；Expired out-of-subset |
| factory / initial | pass | Command 4 + Inbound Invalid共5 |
| current / illegal pair | pass | 14 / 16,unclassified=0 |
| same-value / terminal | pass | four non-terminal reason revisions；two terminal candidates |
| locator / relation boundary | pass | ref-only revision / new subject / relation mutation分离 |
| owner / Rustdoc / test handoff | pass | no method body/source code；new declaration=0；test cuts named |

---

## 47. Secret reference矩阵

### 47.1 状态集合与formation

| 状态 | 含义 | current reachability | terminal | 不拥有 |
|---|---|---|---|---|
| `Resolved` | external secret provider ref可解析且不读取secret | descriptor attach formation；recovery | 否 | secret value / access result |
| `Unresolved` | body-free provider ref当前不可解析 | formation；degradation | 否 | KMS lifecycle |
| `Stale` | provider ref可能过时 | formation；degradation | 否 | rotation state |
| `Unavailable` | secret reference boundary暂不可用 | formation；degradation | 否 | Vault health |
| `Invalid` | provider ref结构非法 | only existing transition | 是 | invalid credential body |
| `Forbidden` | secret material boundary被触碰 | existing transition / typed marker | 是 | value、token、ciphertext、key |

`Expired` out-of-subset。The only current formation flow,descriptor secret attach,acceptsResolved / Unresolved / Stale / Unavailable andrejectsInvalid / Forbidden beforeany ref/state/summary/descriptor save。

### 47.2 ASCII状态图

```text
factory(AttachDescriptorSecretReference)
  -> Resolved / Unresolved / Stale / Unavailable

Resolved ----> Unresolved / Stale / Unavailable
   ^                         |
   +---- Unresolved / Stale / Unavailable

four non-terminal values ----> Invalid / Forbidden
Invalid / Forbidden --X--> any different value
```

### 47.3 Current different-state转换

| group | From | To | pairs | callable | exact flow | guard / effect |
|---:|---|---|---:|---|---|---|
| 1 | Resolved | Unresolved / Stale / Unavailable | 3 | `transition` | Record Command；refresh Job | exact Secret union/digest/state link；state/capture bychannel |
| 2 | Unresolved / Stale / Unavailable | Resolved | 3 | `transition` | same | body-free resolver observation only；no secret read |
| 3 | four non-terminal | Invalid | 4 | `transition` | Record / Job | terminal candidate |
| 4 | four non-terminal | Forbidden | 4 | `transition` or `mark_forbidden` | Job observation / Record typed marker | no ForbiddenBodyReason fabrication inJob |

Current pair count=14。Attach formation also creates`SecretHandlingSafeSummary` atomically,butlater canonical state transitions do not silently mutate that summary ordescriptor truth。

### 47.4 Same-value、reserved ref replacement与terminal

| case | current contract |
|---|---|
| non-terminal reason delta | Record Command orJob forms one state revision |
| exact same value/reason | Command no-op rejection；Job Unchanged |
| terminal | Job Skipped；Command rejects；no reason revision |
| `SecretRef::replace_provider_ref(...)` | declared object callable butno current Step 9 flow；reserved object revision,not a state pair |
| same-descriptor terminal replacement | no current flow；attach rejects existing secret link andmust not overwrite it |
| new independent secret ref | may only be formed byanother valid attach context；does not imply old descriptor relation replacement |

### 47.5 Illegal pair与stop review

| source | targets | count |
|---|---|---:|
| Unresolved | Stale / Unavailable | 2 |
| Stale | Unresolved / Unavailable | 2 |
| Unavailable | Unresolved / Stale | 2 |
| Invalid | other 5 | 5 |
| Forbidden | other 5 | 5 |
| total |  | 16 |

Step 16至少承接4 initial outcomes、14 current / 16 illegal pairs、same-value reason/no-op、Job forbidden reason separation、reserved`replace_provider_ref` invocation count=0、same-descriptor replacement absence、safe-summary no-auto-repair及secret material negatives。单机停审pass；no upstream blocker。

### 47.6 单状态机停审记录

| 审查项 | 结论 | exact证据 |
|---|---|---|
| enum / kind subset | pass | 6 values；Expired out-of-subset |
| factory / initial | pass | exactly 4 non-terminal outcomes；Invalid / Forbidden initial rejected |
| current / illegal pair | pass | 14 / 16,unclassified=0 |
| same-value / terminal | pass | Record/Job reason revision；terminal Job skip |
| ref / summary replacement | pass | provider replacement reserved；safe summary no auto-repair |
| owner / Rustdoc / test handoff | pass | no secret material；new declaration=0；test cuts named |

---

## 48. External document reference矩阵

### 48.1 状态集合与formation

| 状态 | 含义 | current reachability | terminal | 不拥有 |
|---|---|---|---|---|
| `Resolved` | protocol/schema/guide ref可解析 | Command / Inbound formation；recovery | 否 | document body/version truth |
| `Unresolved` | body-free locator当前不可解析 | formation；degradation | 否 | publication state |
| `Stale` | document ref可能过时 | formation；degradation | 否 | content revision |
| `Unavailable` | document resolver边界暂不可用 | formation；degradation | 否 | external store health |
| `Invalid` | kind/locator结构非法 | Inbound formation或transition | 是 | invalid document body |
| `Forbidden` | candidate contains forbidden document/schema body | transition / typed marker | 是 | OpenAPI/schema/protocol body |

Direct Register accepts four non-terminal values；Inbound ResolveOrRegister additionally acceptsInvalid。`Expired` out-of-subset。

### 48.2 ASCII状态图

```text
factory(Command) -> Resolved / Unresolved / Stale / Unavailable
factory(Inbound) -> Resolved / Unresolved / Stale / Unavailable / Invalid

Resolved ----> Unresolved / Stale / Unavailable
   ^                         |
   +---- Unresolved / Stale / Unavailable

four non-terminal values ----> Invalid / Forbidden
Invalid / Forbidden --X--> any different value
```

### 48.3 Current different-state转换

| group | From | To | pairs | callable | exact flow | guard / effect |
|---:|---|---|---:|---|---|---|
| 1 | Resolved | Unresolved / Stale / Unavailable | 3 | `transition` | Record Command；document Inbound；refresh Job | exact document kind/digest/state link；binding preserved |
| 2 | Unresolved / Stale / Unavailable | Resolved | 3 | `transition` | same | no document body fallback |
| 3 | four non-terminal | Invalid | 4 | `transition` | Record / Inbound / Job | terminal |
| 4 | four non-terminal | Forbidden | 4 | `transition` or `mark_forbidden` | observation / typed marker | body quarantined |

Current pair count=14。Direct registration ofa new subject performs no affected-material scan because no committed material can yet carrythat subject marker。

### 48.4 Same-value、binding-preserving revision与replacement

| case | current contract |
|---|---|
| non-terminal reason delta | Record / Inbound / Job actual revision |
| exact no-op | Command rejection、Inbound Ignored、Job Unchanged |
| terminal | Job Skipped；no in-place recovery |
| locator-only Inbound delta | `replace_locator(...)` updates locator/digest/ref version only；existing`supported_descriptor_id` must remainexact |
| new Inbound subject | uses`supported_descriptor_id=None`；does not bind/rebind descriptor |
| terminal replacement | different candidate -> new subject/state；old terminal andold optional binding remain historical/current asdeclared |
| descriptor binding | `bind_supported_descriptor / rebind_supported_descriptor` belong descriptor Commands anddo not change canonical state |

### 48.5 Illegal pair与stop review

| source | targets | count |
|---|---|---:|
| Unresolved | Stale / Unavailable | 2 |
| Stale | Unresolved / Unavailable | 2 |
| Unavailable | Unresolved / Stale | 2 |
| Invalid | other 5 | 5 |
| Forbidden | other 5 | 5 |
| total |  | 16 |

Step 16至少承接5 initial outcomes、14/16 pairs、same reason/no-op、binding-preserving locator revision、new None binding、terminal replacement、descriptor no-auto-write anddocument/schema body negatives。单机停审pass；no blocker。

### 48.6 单状态机停审记录

| 审查项 | 结论 | exact证据 |
|---|---|---|
| enum / kind subset | pass | 6 values；Expired out-of-subset |
| factory / initial | pass | Command 4 + Inbound Invalid共5 |
| current / illegal pair | pass | 14 / 16,unclassified=0 |
| same-value / terminal | pass | reason revision / exact no-op / terminal skip |
| locator / binding / replacement | pass | binding preserved；new Inbound None；new subject recovery |
| owner / Rustdoc / test handoff | pass | no document/schema body；new declaration=0；test cuts named |

---

## 49. Runtime / tools consumer reference矩阵

### 49.1 状态集合与formation

| 状态 | 含义 | current reachability | terminal | 不拥有 |
|---|---|---|---|---|
| `Resolved` | runtime/tools consumer boundary ref可解析 | registration formation；recovery | 否 | invocation authorization |
| `Unresolved` | consumer boundary当前不可解析 | formation；degradation | 否 | execution result |
| `Stale` | consumer locator/scope可能过时 | formation；degradation | 否 | runtime cache |
| `Unavailable` | consumer resolver boundary暂不可用 | formation；degradation | 否 | provider availability |
| `Invalid` | consumer kind/locator/scope结构非法 | existing transition | 是 | invalid execution payload |
| `Forbidden` | candidate触碰runtime/tool result body | existing transition / typed marker | 是 | request/response/tool result |

Registration RuntimeTools branch accepts four non-terminal values andrejectsInvalid / Forbidden。No Inbound Consumer exists for this kind；`Expired` out-of-subset。

### 49.2 ASCII状态图

```text
factory(RegisterCapabilityConsumerReference.RuntimeTools)
  -> Resolved / Unresolved / Stale / Unavailable

Resolved ----> Unresolved / Stale / Unavailable
   ^                         |
   +---- Unresolved / Stale / Unavailable

four non-terminal values ----> Invalid / Forbidden
Invalid / Forbidden --X--> any different value
```

### 49.3 Current different-state转换

| group | From | To | pairs | callable | exact flow | guard / effect |
|---:|---|---|---:|---|---|---|
| 1 | Resolved | Unresolved / Stale / Unavailable | 3 | `transition` | Record Command；refresh Job | exact RuntimeTools union/kind/digest/state link |
| 2 | Unresolved / Stale / Unavailable | Resolved | 3 | `transition` | same | resolution isreference-only,not execution authorization |
| 3 | four non-terminal | Invalid | 4 | `transition` | Record / Job | terminal |
| 4 | four non-terminal | Forbidden | 4 | `transition` or `mark_forbidden` | Job observation / Record typed marker | no execution body |

Current pair count=14。A state revision can degrade consumer/material surfaces throughdeclared propagation,butcannot suspend formal exposure orcreatea runtime allow/deny decision。

### 49.4 Same-value、boundary replacement与terminal

| case | current contract |
|---|---|
| non-terminal reason delta | Record orJob actual revision |
| exact no-op | Command rejection；Job Unchanged |
| terminal | Job Skipped；new different subject required fornew candidate |
| `RuntimeToolsConsumerRef::replace_boundary(...)` | declared callable withno current flow；reserved ref-object revision,not a state pair |
| new registration | different candidate may createindependent new consumer ref/state；no old/new replacement history is implied |
| Query / view | Query may expose degraded state；it never executes tool、refreshes state orcreates ControlledConsumerView |

### 49.5 Illegal pair与stop review

| source | targets | count |
|---|---|---:|
| Unresolved | Stale / Unavailable | 2 |
| Stale | Unresolved / Unavailable | 2 |
| Unavailable | Unresolved / Stale | 2 |
| Invalid | other 5 | 5 |
| Forbidden | other 5 | 5 |
| total |  | 16 |

Step 16至少承接4 initial outcomes、14/16 pairs、reason/no-op、terminal skip、reserved`replace_boundary` zero-call、independent registration、Query no-write andruntime/tools execution negative cases。单机停审pass；no blocker。

### 49.6 单状态机停审记录

| 审查项 | 结论 | exact证据 |
|---|---|---|
| enum / kind subset | pass | 6 values；Expired out-of-subset |
| factory / initial | pass | exactly 4 non-terminal registration outcomes |
| current / illegal pair | pass | 14 / 16,unclassified=0 |
| same-value / terminal | pass | Record/Job reason revision；terminal Job skip |
| boundary replacement | pass | existing callable reserved；new registration independent |
| authority / Rustdoc / test handoff | pass | no execution/tool result；new declaration=0；test cuts named |

---

## 50. SDK consumer reference矩阵

### 50.1 状态集合与formation

| 状态 | 含义 | current reachability | terminal | 不拥有 |
|---|---|---|---|---|
| `Resolved` | SDK server-consumer boundary可解析 | registration formation；recovery | 否 | SDK package/client state |
| `Unresolved` | server-consumer locator当前不可解析 | formation；degradation | 否 | binding lifecycle |
| `Stale` | locator/surface/scope可能过时 | formation；degradation | 否 | client cache |
| `Unavailable` | SDK resolver boundary暂不可用 | formation；degradation | 否 | SDK release health |
| `Invalid` | SDK boundary candidate结构非法 | existing transition | 是 | invalid client body |
| `Forbidden` | candidate触碰SDK client/package body | existing transition / typed marker | 是 | package、binding、client code |

SDK registration accepts four non-terminal values；Invalid / Forbidden reject。No SDK Inbound reference Consumer exists；`Expired` out-of-subset。

### 50.2 ASCII状态图

```text
factory(RegisterCapabilityConsumerReference.Sdk)
  -> Resolved / Unresolved / Stale / Unavailable

Resolved ----> Unresolved / Stale / Unavailable
   ^                         |
   +---- Unresolved / Stale / Unavailable

four non-terminal values ----> Invalid / Forbidden
Invalid / Forbidden --X--> any different value
```

### 50.3 Current different-state转换

| group | From | To | pairs | callable | exact flow | guard / effect |
|---:|---|---|---:|---|---|---|
| 1 | Resolved | Unresolved / Stale / Unavailable | 3 | `transition` | Record Command；refresh Job | exact SDK union/digest/state id |
| 2 | Unresolved / Stale / Unavailable | Resolved | 3 | `transition` | same | server-side ref only；does not publish SDK |
| 3 | four non-terminal | Invalid | 4 | `transition` | Record / Job | terminal |
| 4 | four non-terminal | Forbidden | 4 | `transition` or `mark_forbidden` | observation / typed marker | no client/package body |

Current pair count=14。State resolution may gate SDK consumer read surface,butcannot mutate`FormalExposureBoundary` orSDK release truth。

### 50.4 Same-value、boundary replacement与terminal

| case | current contract |
|---|---|
| non-terminal reason delta | Record / Job one revision |
| exact no-op | Command no-op rejection；Job Unchanged |
| terminal | Job Skipped；no in-place reason change/recovery |
| `SdkExposureConsumerRef::replace_boundary(...)` | declared callable,no current Step 9 flow；reserved ref revision |
| new registration | different candidate formsindependent SDK ref/state；does not claimreplacement orpackage publication |
| Query | generic / SDK reference Query returnspersisted body-free state andnever refreshes client/server boundary |

### 50.5 Illegal pair与stop review

| source | targets | count |
|---|---|---:|
| Unresolved | Stale / Unavailable | 2 |
| Stale | Unresolved / Unavailable | 2 |
| Unavailable | Unresolved / Stale | 2 |
| Invalid | other 5 | 5 |
| Forbidden | other 5 | 5 |
| total |  | 16 |

Step 16至少承接4 initial outcomes、14/16 pairs、same reason/no-op、terminal skip、reserved boundary replacement、new independent registration、formal exposure no-write andSDK package/client/cache negatives。单机停审pass；no blocker。

### 50.6 单状态机停审记录

| 审查项 | 结论 | exact证据 |
|---|---|---|
| enum / kind subset | pass | 6 values；Expired out-of-subset |
| factory / initial | pass | exactly 4 non-terminal registration outcomes |
| current / illegal pair | pass | 14 / 16,unclassified=0 |
| same-value / terminal | pass | reason revision/no-op；terminal Job skip |
| boundary / exposure | pass | replacement reserved；no formal exposure orSDK publication mutation |
| owner / Rustdoc / test handoff | pass | no SDK package/client/cache；new declaration=0；test cuts named |

---

## 51. Observability / audit reference矩阵

### 51.1 状态集合与formation

| 状态 | 含义 | current reachability | terminal | 不拥有 |
|---|---|---|---|---|
| `Resolved` | body-free audit material pointer可解析 | Inbound formation；recovery | 否 | log/trace/audit body |
| `Unresolved` | pointer当前不可解析 | formation；degradation | 否 | evidence lifecycle |
| `Stale` | pointer可能过时 | formation；degradation | 否 | metric/alert state |
| `Unavailable` | audit resolver boundary暂不可用 | formation；degradation | 否 | observability platform health |
| `Invalid` | kind/locator结构非法 | Inbound formation或transition | 是 | invalid raw material |
| `Forbidden` | candidate触碰raw observability/audit body | transition / typed marker | 是 | evidence alias/signature |

Current formation only comes from`inbound_consume_audit_material_reference_changed_flow` ResolveOrRegister andallowsResolved / Unresolved / Stale / Unavailable / Invalid。Forbidden isquarantined；`Expired` out-of-subset。

### 51.2 ASCII状态图

```text
factory(Inbound Audit ResolveOrRegister)
  -> Resolved / Unresolved / Stale / Unavailable / Invalid

Resolved ----> Unresolved / Stale / Unavailable
   ^                         |
   +---- Unresolved / Stale / Unavailable

four non-terminal values ----> Invalid / Forbidden
Invalid / Forbidden --X--> any different value
```

### 51.3 Current different-state转换

| group | From | To | pairs | callable | exact flow | guard / effect |
|---:|---|---|---:|---|---|---|
| 1 | Resolved | Unresolved / Stale / Unavailable | 3 | `transition` | Record Command；audit Inbound；refresh Job | exact audit kind/locator/digest/state link |
| 2 | Unresolved / Stale / Unavailable | Resolved | 3 | `transition` | same | resolver only；handoff Port isnot used |
| 3 | four non-terminal | Invalid | 4 | `transition` | Record / Inbound / Job | terminal |
| 4 | four non-terminal | Forbidden | 4 | `transition` or `mark_forbidden` | observation / typed marker | no raw material retained |

Current pair count=14。`ObservabilityAuditReferencePort` resolves pointers；`ObservabilityAuditHandoffPort` remainsa separate external side effect anddoes not set canonical resolution state。

### 51.4 Same-value、locator revision与replacement

| case | current contract |
|---|---|
| non-terminal reason delta | Record / Inbound / Job actual revision |
| exact no-op | Command rejection、Inbound Ignored、Job Unchanged |
| terminal | Job Skipped；no resolver or reason revision |
| locator-only Inbound delta | `ObservabilityAuditRef::replace_locator(...)` withsame immutable material kind；ref-only save,no state capture |
| terminal replacement | different candidate throughResolveOrRegister createsnew subject/state；old terminal remains |
| handoff | reference resolution doesnot createhandoff receipt、evidence alias、test result oracceptance signature |

### 51.5 Illegal pair与stop review

| source | targets | count |
|---|---|---:|
| Unresolved | Stale / Unavailable | 2 |
| Stale | Unresolved / Unavailable | 2 |
| Unavailable | Unresolved / Stale | 2 |
| Invalid | other 5 | 5 |
| Forbidden | other 5 | 5 |
| total |  | 16 |

Step 16至少承接5 initial outcomes、14/16 pairs、reason/no-op、locator-only revision、terminal replacement、resolver/handoff separation、Query no-write andraw log/trace/metric/audit/evidence negatives。单机停审pass；no blocker。

### 51.6 单状态机停审记录

| 审查项 | 结论 | exact证据 |
|---|---|---|
| enum / kind subset | pass | 6 values；Expired out-of-subset |
| factory / initial | pass | Inbound 4 non-terminal + Invalid共5；Forbidden initial=0 |
| current / illegal pair | pass | 14 / 16,unclassified=0 |
| same-value / terminal | pass | Record/Inbound/Job reason revision；terminal skip |
| locator / replacement / handoff | pass | ref-only revision、新subject、external handoff separated |
| authority / Rustdoc / test handoff | pass | no raw audit/evidence/signature；new declaration=0；test cuts named |

---

## 52. Batch `10.5` cross-kind审计

### 52.1 Enum、subset、pair与formation覆盖

| 审计项 | 期望 | 实际 | 结论 |
|---|---:|---:|---|
| canonical owner | 1 | 1 `ReferenceResolutionState` | pass |
| independent kind matrices | 8 | 8 | pass |
| enum variants | 7 | 7 | pass |
| kind-applicable variant occurrences | `7 * 6 + 1 * 7` | 49 | pass |
| possible different-state pairs | `7 * 30 + 42` | 252 | pass |
| current pairs | `7 * 14 + 18` | 116 | pass |
| reserved pairs | 0 | 0 | pass |
| illegal pairs | `7 * 16 + 24` | 136 | pass |
| unclassified | 0 | 0 | pass |

```text
six-state kind: 6 * (6 - 1) = 30
seven six-state kinds: 7 * 30 = 210
governance seven-state kind: 7 * (7 - 1) = 42
total = 210 + 42 = 252

current = 7 * 14 + 18 = 116
illegal = 7 * 16 + 24 = 136
116 current + 0 reserved + 136 illegal = 252
unclassified = 0
```

Factory formation andsame-state revision are outside that pair denominator:

| kind | current initial values | initial Invalid current? | initial Forbidden current? | non-terminal same-value reason revision |
|---|---:|---|---|---|
| source | 5 | Inbound only | no | current |
| governance | 6 | Inbound only | no | current |
| method | 5 | Inbound only | no | current |
| secret | 4 | no | no | current |
| document | 5 | Inbound only | no | current |
| runtime/tools | 4 | no | no | current |
| SDK | 4 | no | no | current |
| audit | 5 | Inbound only | no | current |

### 52.2 Callable、flow与terminal审计

| contract | current callable / flow | 结果 |
|---|---|---|
| initial factory | `from_initial_resolution` inall registration / ResolveOrRegister flows | pass；kind subset exact |
| explicit state Command | `transition / mark_forbidden` in`command_record_reference_resolution_state_flow` | pass after controlled reopen |
| existing re-observation | governance/method Commands + five Inbound Consumers | pass；value/reason delta exact |
| all-kind refresh | exhaustive 8-variant resolver dispatch + `transition` | pass；no generic string resolver |
| terminal current | Job plan -> Skipped before resolver；Command / Consumer recovery rejected | pass |
| convenience factory | `resolved / unresolved` Step 9 call count=0 | explicit reserved formation callable；not substituted |
| Query | 5 reference Query flows | pass；no resolver/save/repair |
| outbound | exact state revision -> one`ReferenceResolutionChanged` capture | pass；no external body |

### 52.3 Replacement与reference-object revision审计

| kind | current same-subject ref-field revision | terminal candidate recovery |
|---|---|---|
| source | Inbound locator revision | changed candidate -> new subject/state；no identity auto-write |
| governance | Inbound scope revision | new subject/state；seam replacement separately requiresResolved replacement |
| method | Inbound locator revision | new subject/state；relation change staysseparate |
| secret | no current replacement flow；declared provider replacement reserved | no same-descriptor current recovery |
| document | Inbound locator revision preservingdescriptor binding | new subject/state；new Inbound binding None |
| runtime/tools | no current replacement flow；declared boundary replacement reserved | new independent registration only |
| SDK | no current replacement flow；declared boundary replacement reserved | new independent registration only |
| audit | Inbound locator revision withsame material kind | changed candidate -> new subject/state |

Ref-field revision doesnot callstate`transition` whenvalue/reason isunchanged anddoesnot form`ReferenceResolutionChanged`。Terminal replacement never rewritesold state id/value oruses`Invalid / Forbidden -> Resolved` asan in-place pair。

### 52.4 Transaction、propagation与authority审计

| channel | actual local atomic set | explicitly excluded |
|---|---|---|
| registration Command | new ref + state + reference capture + declared owner-side effects/result/completion | external body；fake prior material marker |
| Record state Command | state + reference capture + each actual dependent-material stale revision/capture + result/completion | ref object mutation；core change/trace |
| reference Inbound Consumer | actual ref/state writes + optional state capture + typed receipt/completion | material stale；relation/exposure truth |
| refresh Job | state + reference capture + target journal success | ref object write；material stale；post-commit collaboration |
| Query | no write UoW | resolver refresh / repair |

`ReferenceResolutionChanged` capture isnot delivery evidence。Post-commit collaboration remainsbatch`10.6` scope；failure cannot roll backstate。Dependent material stale handling afterthe refresh Job isaseparate declared consumer/maintenance responsibility andisnot fabricated asa current Job call。

### 52.5 Owner、historical、Rustdoc与fabrication审计

| gate | result |
|---|---|
| capability identity / registry / descriptor / seam / relation / exposure not merged into reference owner | pass |
| provider runtime / tools execution / SDK client / marketplace listing not introduced | pass |
| governance approval / Policy / method body / secret body / document body / audit evidence not copied | pass |
| old README / old formal `03` excluded ashistorical material | pass |
| controlled reopen declarations | no new struct / enum / field / variant / callable |
| existing Step 6 / 7 / 8 reference structs,fields,variants andpublic methods English`///` | pass；omission=0 |
| implementation commit / run_id / test result / evidence alias / sign-off | none fabricated |
| formal `03-详细设计.md` | unchanged |
| implementation ledger / planned boundary skeleton | not created |

### 52.6 Mechanical stop audit

| check | result |
|---|---|
| 8 matrix headings / stop records | pass |
| 252 pair arithmetic | pass；116 + 0 + 136 |
| Expired applicability | pass；GovernanceResult only |
| Invalid / Forbidden terminal andinitial distinction | pass |
| same-value reason vs exact no-op | pass after controlled reopen |
| query no-write / Job no-material-repair | pass |
| structure / field Rustdoc gate | pass |
| conflict markers / malformed fences / trailing whitespace | checked in final command |

---

## 53. Batch `10.5` 完成结论与停审

| Gate | 结果 |
|---|---|
| 用户允许进入`10.5` | pass |
| §12第五行、§35~§42与Step 6 / 7 / 8 / 9 exact reference inputs已读 | pass |
| canonical owner / callable / revision invariant | pass |
| 8张kind-specific矩阵 | pass |
| initial subset | pass；5类Inbound-only Invalid formation、Forbidden initial=0、Expired only governance |
| 252 possible different-state pairs | pass；116 current + 0 reserved + 136 illegal,unclassified=0 |
| same-value reason / exact no-op | pass after`CH-DDD-S10-REFERENCE-SAME-VALUE-COMMAND-001` |
| Invalid / Forbidden terminal / replacement | pass |
| Query / Job / propagation / owner boundary | pass |
| Rustdoc / 结构注释门禁 | pass；new declaration=0,existing relevant omission=0 |
| unresolved upstream blocker | 0 |
| 正式文档 / implementation artifact / commit | none |

```text
gate_status = 03_step_10_batch_10_5_completed_wait_user_review
completed_document = 03-详细设计.md
completed_step = Step 10 batch 10.5 canonical reference owner + eight ReferenceKind matrices
formal_document_written = false
unresolved_upstream_blocker = 0
next_allowed_action = start_03_step_10_batch_10_6_after_user_confirmation
commit_required = false
```

下一批只可在用户明确确认后进入`10.6`。进入前必须读取:

1. 本文件§12第六行、§43~§53和canonical-state capture / post-commit边界；
2. Step 6 `CapabilityEventCaptureState`、`CapabilityEventCaptureRecord`、event snapshot/collaboration carrier；
3. Step 7 event-capture repository与external`CapabilityAccessEventCollaborationPort`；
4. Step 8 Outbound capture / collaboration与repair Job contracts；
5. Step 9 ten Outbound flows、source-continuation flow和collaboration repair Job；
6. 正式`02-概要设计.md` §9~§10的local-capture-vs-external-owner边界。

不得提前进入`10.7`、修改正式`03-详细设计.md`、创建implementation ledger / planned boundary skeleton或提交commit。

---

## 54. Batch `10.6` 输入复核与双 owner 分离

### 54.1 开工门禁与exact读取结论

| 读取主题 | exact结论 | 本批矩阵约束 |
|---|---|---|
| local capture owner | `CapabilityEventCaptureRecord.capture_state`是本仓唯一event-capture mutable state；只保存source-to-snapshot durability与stable intent binding | 只写`Captured -> IntentBound` local matrix；不得新增Pending / Delivered / Failed等variant |
| immutable payload | `CapabilityEventPayloadSnapshot`冻结完整Step 8 envelope、schema、digest、trace与time | snapshot不是状态机；不得update、delete-and-replace或按current truth重建 |
| external collaboration owner | `EventCollaborationStatus`只出现在external Port outcome / item与public Job result snapshot | 写Port-owned boundary matrix,不写本地repository / aggregate transition |
| exact local callable | initial只调用`CapabilityEventCaptureRecord::capture(...)`；唯一异态member是`bind_intent(...)` | repository `capture / bind_intent`只持久化object结果,不得冒充state callable |
| exact external callable | `CapabilityAccessEventCollaborationPort::{collaborate,get,list,repair}` | `get / list`只观察；`collaborate / repair`请求external owner动作,但不是本仓domain transition member |
| source continuation | ten Outbound flows在source UoW保存source + snapshot + Captured record；commit后才调用shared facade | external failure不得回滚source；capture ref必须来自本次commit或official scan |
| facade reentry | Captured走stored candidate + collaborate + source validation + short bind UoW；IntentBound走bound intent `get` | IntentBound不得second collaborate / bind；missing item不得解绑或重建candidate |
| repair Job | Captured target inline collaborate并把bind + journal success放入同一target UoW；IntentBound只get；intent target按status inspect / repair | Job不得调用self-committing facade；不得形成new snapshot / capture / event |
| external formation vs observation | external intent owner的formation是`none -> Candidate`；一次`collaborate`可在返回前完成0~N条owner edge,所以本仓首次可观察五种status | 首次观察不是五条local initial transition,也不是`Captured -> external status` cross-owner pair |
| owner red line | source truth、local capture、external intent status与Job result snapshot是四个不同角色 | 不合并outbox、broker relay、topic、attempt、retry counter、worker lease、scheduler或delivery log |

读取后没有发现缺失callable、缺失variant或actual flow与state guard冲突,但字段级反查发现Step 7~9部分prose要求capture与snapshot做`trace / bytes`对称,而正式`CapabilityEventCaptureRecord`没有`trace_id / bytes`字段。该local contract conflict已按§54.2最小受控回开关闭；本批没有新增field、type、callable、Port、protocol或flow。

### 54.2 Controlled reopen `CH-DDD-S10-EVENT-CAPTURE-TRACE-OWNERSHIP-001`

| 项 | 原冲突 | 收口 |
|---|---|---|
| Step 6正式结构 | `CapabilityEventCaptureRecord`只保存source、snapshot id、schema、digest、local state / intent、version与times；`CapabilityEventPayloadSnapshot`独占trace和complete bytes | 保持不变；不得为满足旧prose新增capture `trace_id / bytes` |
| Step 6合法validator | `CapabilityEventCaptureRecord::validates_snapshot(...)`只校验source / snapshot id / schema / digest四元组 | 保持不变；captured time由repository join追加校验,snapshot自身校验non-empty bytes / digest |
| Step 7 loaded / repository prose | 旧措辞要求capture / snapshot的trace对称并要求bind保留capture trace | 改为source、snapshot id、schema、digest、captured time五元组对称；snapshot-owned trace / complete bytes immutable且由candidate原样复制 |
| Step 8 facade prose | 旧措辞要求`snapshot/capture source/schema/digest/trace/bytes`对称 | 改为input ref/version + 五元组 + snapshot bytes / digest完整性,typed snapshot trace只原样复制；missing/asymmetry仍禁止current-truth rebuild |
| Step 9 repair invariant | 旧措辞要求binding保留capture trace | 改为capture五元组不变,并保持关联snapshot-owned trace / complete bytes immutable |
| declaration / count | 实现者可能被迫添加伪字段或跳过文档校验 | 无field / type / method / trait / Port / DTO / protocol / flow变化；43/7/36/83不变 |

该冲突是本仓详细设计内部字段所有权不一致,不是上游项目 blocker。修正后trace仍从source mapping进入immutable snapshot与transient candidate,不会丢失；capture record继续只负责recoverable snapshot join与stable intent binding。没有新增或重写Rust struct / enum / field / variant / public callable,existing英文`///`注释保持完整。

### 54.3 状态主语与非状态载体

| 名称 | owner / persistence | 是否是本批状态主语 | exact作用 | 明确不是 |
|---|---|---|---|---|
| `CapabilityEventPayloadSnapshot` | application local；insert-only immutable | 否 | 保存complete serialized envelope与source/schema/digest/trace/time authority | outbox message lifecycle、delivery attempt、mutable event state |
| `CapabilityEventCaptureRecord` | application local；versioned | 是 | 关闭source commit后、external intent bind前的恢复窗口 | capability truth、event delivery truth、broker relay item |
| `CapabilityEventCaptureState` | capture record field | 是,local matrix | `Captured / IntentBound` binding lifecycle | PendingDelivery / Delivered / Failed / HandoffUnavailable |
| `CapabilityEventCollaborationCandidateSurface` | application-to-Port transient | 否 | 从official capture + snapshot复制exact candidate | persisted queue、第二payload owner |
| `CapabilityEventCollaborationOutcome` | external callable typed result | 否,承载external state observation | exact source、stable intent、current status、body-free reason | local aggregate、delivery proof、acceptance evidence |
| `CapabilityEventCollaborationItem` | external read carrier | 否 | one stable intent + source + outcome symmetry | local persisted collaboration row |
| `EventCollaborationStatus` | external collaboration owner | 是,仅boundary matrix | external intent的body-free协作进度 | local capture variant、source truth状态 |
| `CapabilityJobExecutionSuccess::EventCollaboration` | local immutable target outcome snapshot | 否 | 保存该Job target已观察到的typed item以支持exact replay | external current-status owner、下一次repair planning authority |

Job journal可保存一次调用返回的body-free `status`作为immutable target result,但它不维护可变collaboration state。后续repair必须重新通过external Port按exact intent读取current item,不得从旧Job report推断current status。

### 54.4 两套pair分母与callable口径

| matrix | variants | possible different-state pairs | current owner edges | reserved | illegal | callable口径 |
|---|---:|---:|---:|---:|---:|---|
| local `CapabilityEventCaptureState` | 2 | 2 | 1 | 0 | 1 | `capture` formation；`bind_intent`唯一异态member |
| external `EventCollaborationStatus` | 5 | 20 | 6 | 0 | 14 | external owner edge；本仓只经Port请求 / 观察 |

两行不得做cross-product。`Captured + external Candidate`或`IntentBound + external Failed`不是一个联合aggregate state；机械总和`22 = 7 current + 0 reserved + 15 illegal`只用于检查两张独立矩阵均无漏pair,不定义第三张组合状态机。

### 54.5 受控回开与结构注释门禁

| gate | result |
|---|---|
| Step 6 state / struct / field / callable变化 | none |
| Step 7 helper / trait / method / Port变化 | prose-only field-owner correction；36 Ports不变 |
| Step 8 DTO / protocol / facade变化 | prose-only validation correction；83 protocols不变 |
| Step 9 flow变化 | invariant prose correction；83 / 83 flows不变 |
| controlled reopen | `CH-DDD-S10-EVENT-CAPTURE-TRACE-OWNERSHIP-001` resolved |
| new public declaration | 0 |
| relevant existing public struct / enum Rustdoc | pass；struct / enum、全部field、variant与variant payload均保留英文`///` |
| formal `03-详细设计.md` | unchanged |
| unresolved upstream blocker | 0 |

结构注释审查覆盖Step 6 `CapabilityEventPayloadSnapshot`、`CapabilityEventCaptureRecord`、`CapabilityEventCaptureState`、`EventCollaborationStatus`,Step 7 loaded capture、scan scope、candidate、outcome、item及Port,以及Step 8 application facade。没有遗漏结构体注释、字段注释、enum variant注释或public callable注释。

---

## 55. `CapabilityEventCaptureState` local状态矩阵

### 55.1 状态集合、formation与字段不变量

| 状态 | exact字段形态 | current formation / reachability | local terminal | 不表示 |
|---|---|---|---|---|
| `Captured` | `collaboration_intent_ref=None`;version=1 on formation | ten Outbound source UoW与`list(AwaitingIntent)`恢复扫描 | 否 | external candidate已形成、投递pending / delivered / failed |
| `IntentBound` | `collaboration_intent_ref=Some(stable intent)`;version=prior + 1 | facade或repair Job对Captured成功绑定 | 是,仅对local binding lifecycle | external delivered；intent current status仍须Port读取 |

`CapabilityEventCaptureRecord::capture(id,snapshot)`是唯一formation callable。它从validated immutable snapshot复制`source_ref / payload_snapshot_id / schema_ref / candidate_digest / captured_at`,固定`Captured + None + version 1`,并使`updated_at == captured_at`。Snapshot与capture必须和exact source revision在同一local source UoW提交。

所有后续revision必须保持以下字段不变:

```text
capture_id
source_ref
payload_snapshot_id
schema_ref
candidate_digest
captured_at
```

唯一允许改变的是:

```text
capture_state: Captured -> IntentBound
collaboration_intent_ref: None -> Some(exact stable intent)
version: N -> N + 1
updated_at: previous -> bind clock
```

### 55.2 ASCII状态图

```text
source-owned local UoW
  source revision + immutable payload snapshot
  -> CapabilityEventCaptureRecord::capture(...)
  -> Captured + intent None + version 1

Captured
  | exact official snapshot join
  | external typed outcome with exact source + stable intent
  | CapabilityEventCaptureRecord::bind_intent(intent, now)
  v
IntentBound + intent Some + version N+1
  X no unbind
  X no second intent
  X no local delivery-state transition
```

External `ApplicationError`、source / intent asymmetry、missing snapshot或bind UoW rollback都不会形成`Captured -> Captured` revision。它们保留原persisted `Captured`record,供same stored candidate后续恢复。

### 55.3 Current different-state转换

| From | To | current? | exact callable | exact triggering flow | guard | object delta | persistence / external effect |
|---|---|---|---|---|---|---|---|
| `Captured` | `IntentBound` | yes | `CapabilityEventCaptureRecord::bind_intent(intent_ref,now)` | ten Outbound shared `CapabilityEventCollaborationService::collaborate_captured_event`;repair Job `EventCapture { existing_intent_ref=None }` | loaded record isexact `Captured + None`;capture / snapshot source、snapshot id、schema、digest、captured time五元组对称；snapshot bytes non-empty / digest匹配且typed trace原样复制；typed outcome source equals candidate/capture/snapshot source；stable intent valid；loaded expected version exact | state toIntentBound；intent None toSome；version +1；updated_at=now；all immutable fields unchanged | facade: external collaborate first,thenindependent short bind UoW；Job: external collaborate first,thenbind + target journal success inone target UoW |
| `IntentBound` | `Captured` | no | none | none | terminal local binding；external status change / missing item / repair failure不是解绑依据 | none | reject asinvalid local transition；do notdelete intent、snapshot或source |

Pair arithmetic:

```text
2 * (2 - 1) = 2 possible different-state pairs
1 current + 0 reserved + 1 illegal = 2
unclassified = 0
```

### 55.4 Same-state、duplicate与reentry边界

| case | current flow行为 | state结论 | 后续owner |
|---|---|---|---|
| Captured beforeexternal call | build candidate only fromofficial stored capture/snapshot | no local revision yet | facade / repair Job |
| external call has no typed outcome | return/classify error；do notcall`bind_intent` | persisted state remainsCaptured | Step 12 error / recovery |
| typed outcome returned,local bind commit fails | rollback bind UoW；source/snapshot remaincommitted | persisted state remainsCaptured；external intent may already exist | Step 13 exact idempotent reentry |
| Captured reentry | repeat same capture/source/schema/digest candidate | successful external contract must return same stable intent semantics | Step 13 duplicate / collision algorithm |
| IntentBound facade reentry | call`bound_intent_ref` + external`get` | no local revision；zero collaborate / bind | current flow closed |
| IntentBound repair Job target | external`get`;journal-only success | no capture save；same exact capture ref/version | current flow closed |
| direct same-intent `bind_intent` duplicate | current normal flows avoid this call | no second state；exact no-op vs optimistic conflict algorithm not selected here | Step 13 |
| different-intent bind attempt | conflict | no mutation / no replacement | Step 12 category；Step 13 race detail |

The deferred same-intent algorithm does not block this matrix:both legal implementations must preserveone stable intent、one local successor revision at most andno second state value。No current flow intentionally invokes`bind_intent`onan alreadyIntentBound record。

### 55.5 External outcome与local bind正交矩阵

| external typed outcome status | stable intent may bind toCaptured? | local result | forbidden inference |
|---|---|---|---|
| `Candidate` | yes | `IntentBound`;return Candidate outcome | Candidate不是local Captured的同义词 |
| `PendingDelivery` | yes | `IntentBound`;return pending outcome | 不新增local Pending state |
| `Delivered` | yes | `IntentBound`;return delivered outcome | IntentBound不等于delivery proof |
| `Failed` | yes,with required body-free reason | `IntentBound`;source truth remainscommitted | 不回滚source、不把capture标Failed |
| `HandoffUnavailable` | yes,with required body-free reason | `IntentBound`;source truth remainscommitted | 不删除capture、不把unavailable复制为local state |

Binding proves only that one committed immutable candidate is associated with one stable external intent。It is valid even when the external owner reports a degraded status,because repair must address that same intent rather thanform a second intent。

### 55.6 Phase、transaction与side-effect矩阵

| phase / branch | local atomic set | external call | failure visibility | prohibited |
|---|---|---|---|---|
| source Phase A | exact source save/append + complete snapshot + initial Captured record | none | commit failure makesall three invisible | pre-commit publish、transient-only candidate |
| facade Phase B | no local UoW | `collaborate(stored candidate)`or`get(bound intent)` | external outcome cannot rollback source | current truth reload、mapper rerun、new bytes |
| facade Phase C Captured | onecapture bind inshort UoW | none aftertyped outcome | rollback leavesCaptured scan-visible | source result rewrite、delivery-state copy |
| facade Phase C IntentBound | no local write | `get`already performed | missing/asymmetric item isconsistency error | second collaborate / bind |
| repair Job Captured target | capture bind + terminal target success inone target UoW | inline`collaborate`beforelocal UoW commit | external intent may survive local rollback；journal staysPlanned | self-committing facade、nested local transaction |
| repair Job IntentBound target | journal-only target success | exact`get` | external failure cannot altercapture | bind / repair / collaborate |

The initial capture and later intent binding intentionally do not share one transaction:the external call cannot participate in the local source UoW。Durability comes fromthe committed snapshot/capture andstable external candidate identity,not frompretending the external call isatomic withsource truth。

### 55.7 Illegal transition handling与test cuts

Illegal `IntentBound -> Captured`、different-intent rebind、state/intent nullability mismatch、immutable field delta或wrong expected version must return an explicit domain/application consistency or state-transition error withoutmutation。Exact error variants andretryability remainStep 12 / 13 scope。

Step 16至少承接:

1. all ten event source families form exact `Captured + None + version 1` records in the source UoW;
2. source/snapshot/capture rollback at every pre-commit failure point;
3. all five typed external statuses bind one stable intent withoutcopyingstatus;
4. outcome source mismatch、missing / corrupt snapshot andempty bytes never bind orreloadcurrent truth;
5. bind commit rollback leavesCaptured andsame candidate recoverable;
6. IntentBound facade andJob branches call`get`once and`collaborate / bind`zero times;
7. `IntentBound -> Captured`anddifferent-intent bind reject withoutmutation;
8. same-intent race tests are handed toStep 13 andmust never produceversion +2 orsecond intent;
9. no topic、relay、attempt、retry counter、worker lease、scheduler ordelivery status field appears inlocal capture persistence。

### 55.8 单状态机停审记录

| 审查项 | 结论 | exact证据 |
|---|---|---|
| enum / owner | pass | 2 local variants owned only by`CapabilityEventCaptureRecord` |
| factory / initial | pass | `capture(...) -> Captured + None + version 1` |
| current / illegal pair | pass | 1 / 1,unclassified=0 |
| exact callable / flow | pass | `bind_intent`;ten Outbound facade paths + repair Job Captured branch |
| terminal / duplicate | pass | IntentBound local terminal；same-intent algorithm explicitly handed toStep 13 |
| immutable fields / transaction | pass | source/snapshot/schema/digest/time stable；facade andJob UoWs separated exactly |
| external owner boundary | pass | all five outcomes orthogonal tolocal state；no rollback / delivery copy |
| Rustdoc / structure comments | pass | new declaration=0；existing enum、struct、fields、variants、methods omission=0 |
| test handoff / blocker | pass | test cuts named；unresolved blocker=0 |

---

## 56. `EventCollaborationStatus` external Port-owned边界矩阵

### 56.1 状态集合、owner invariant与首次观察

| status | external owner语义 | current first observation through`collaborate` | terminal for external candidate | reason invariant |
|---|---|---|---|---|
| `Candidate` | stable intent已为committed source candidate形成 | yes | 否 | `reason=None` |
| `PendingDelivery` | same intent正在等待publisher / handoff delivery | yes | 否 | `reason=None` |
| `Delivered` | declared collaboration target已完成delivery | yes | 是,current terminal | `reason=None` |
| `Failed` | delivery attempt failed withouttruth rollback | yes | 否,repairable | `reason=Some(body-free ChangeReason)` |
| `HandoffUnavailable` | external handoff boundary unavailable | yes | 否,repairable | `reason=Some(body-free ChangeReason)` |

External owner的formation是`none -> Candidate`。`collaborate(candidate)`同时允许external owner形成intent并尝试delivery,所以调用返回前可能已经执行`Candidate -> PendingDelivery -> final outcome`。因此application首次可观察五种status,但只有Candidate是owner formation state；其余不是五条local factory path,也不是local capture transition。

Across every owner transition,`CapabilityEventCollaborationIntentRef`and`CapabilityEventCaptureSourceRef`remainexact andunchanged。Status/reason不允许改变intent、source、payload snapshot、schema或candidate digest。

### 56.2 ASCII状态图

```text
external owner formation
  none -> Candidate -> PendingDelivery -> Delivered
                         |        ^
                         +-> Failed ------------+
                         |                       |
                         +-> HandoffUnavailable -+

every repaired Failed / HandoffUnavailable intent
  -> PendingDelivery -> Delivered / Failed / HandoffUnavailable

Delivered --X--> any other status
Candidate / Delivered --X--> repair(...)
```

`Failed / HandoffUnavailable -> PendingDelivery -> Delivered / Failed / HandoffUnavailable` may complete inside onePort `repair` call。A before/after observation such asFailed -> Delivered istherefore a multi-edge operation path,not anatomic direct state edge。

### 56.3 Current external owner edges

| group | From | To | pair count | external trigger | 本仓可调用 / 可观察面 | exact guard / effect |
|---:|---|---|---:|---|---|---|
| 1 | `Candidate` | `PendingDelivery` | 1 | external owner accepts candidate for delivery | `collaborate` may execute beforereturn；`get` observes | same intent/source；reason remainsNone |
| 2 | `PendingDelivery` | `Delivered` | 1 | external delivery succeeds | `collaborate`or`repair`typed outcome；`get/list` observes | same intent/source；reasonNone；Delivered terminal |
| 3 | `PendingDelivery` | `Failed` | 1 | external delivery fails | same | same intent/source；body-free reason required；no truth rollback |
| 4 | `PendingDelivery` | `HandoffUnavailable` | 1 | external handoff unavailable | same | same intent/source；body-free reason required；no truth rollback |
| 5 | `Failed` | `PendingDelivery` | 1 | same-intent repair restarts delivery | `repair(exact intent)`only | no second intent；external owner clears / replaces failure reason pernext state |
| 6 | `HandoffUnavailable` | `PendingDelivery` | 1 | same-intent repair restarts handoff | `repair(exact intent)`only | no second intent；external owner remainsauthority |

`CapabilityAccessEventCollaborationPort` is a behavior boundary,not a local state-transition trait。The table names external owner edges;application does not instantiate orsave an external aggregate。`get`and`list` always havezero transition authority。

### 56.4 Port operation / status guard矩阵

| callable | allowed input basis | allowed current external status | return / observation contract | local mutation authority |
|---|---|---|---|---|
| `collaborate(candidate)` | official stored capture + immutable snapshot only | no existing local intent branch；external duplicate identity may already map same intent | exact same source + stable intent；outcome may beany five statuses after0~N owner edges | none；application may separately bind intent |
| `get(intent)` | exact already-bound orplanned intent | any five | oneitem withintent/source/outcome symmetry；missing isnotFailed | none |
| `list(ExplicitIntents / Source)` | typed scope + stable page | any five matching scope | body-free current observations inadapter-declared stable order | none |
| `list(Repairable)` | no local capture scan | onlyPendingDelivery / Failed / HandoffUnavailable | Candidate / Delivered result iscontract violation | none |
| `repair(intent)` | exact item reread current status | PendingDelivery / Failed / HandoffUnavailable only | Pending continues toDelivered / Failed / HandoffUnavailable；Failed / HandoffUnavailable must pass throughsame-intent Pending beforethat same final set；Candidate return isinvalid | none；Job writes onlyimmutable target outcome snapshot |

Candidate andDelivered are inspection-only in the repair Job。Calling`repair`for either isillegal even ifan adapter could physically redeliver。A new delivery request forDelivered would requirea separately designed source/candidate contract,not anuntyped retry shortcut。

### 56.5 Atomic pair classification与illegal handling

| source | current atomic targets | illegal direct targets | current / illegal count | handling |
|---|---|---|---:|---|
| `Candidate` | PendingDelivery | Delivered / Failed / HandoffUnavailable | 1 / 3 | direct final observation may occur afterhidden Pending edge,butmust notbe modeled asatomic pair |
| `PendingDelivery` | Delivered / Failed / HandoffUnavailable | Candidate | 3 / 1 | no return topre-delivery formation |
| `Delivered` | none | Candidate / PendingDelivery / Failed / HandoffUnavailable | 0 / 4 | current terminal；repair prohibited |
| `Failed` | PendingDelivery | Candidate / Delivered / HandoffUnavailable | 1 / 3 | Delivered / HandoffUnavailable may onlybe final result aftermandatory Pending intermediate |
| `HandoffUnavailable` | PendingDelivery | Candidate / Delivered / Failed | 1 / 3 | Delivered / Failed may onlybe final result aftermandatory Pending intermediate |
| total | 6 | 14 | 6 / 14 | `6 current + 0 reserved + 14 illegal = 20` |

```text
5 * (5 - 1) = 20 possible different-state pairs
6 current + 0 reserved + 14 illegal = 20
unclassified = 0
```

An adapter outcome that violatesintent/source symmetry、reason invariant、Repairable scopeorrepair guard is an explicit Port contract / consistency error。Application must notcoerce it toFailed、parse transport text、save a guessed statusoradvance local capture。Exact error taxonomy remainsStep 12。

### 56.6 Same-state observation、repair cycle与result snapshot

| case | exact interpretation | forbidden interpretation |
|---|---|---|
| repeated`get / list`returns same status | read-only observation；zero owner edge asserted byapplication | local no-op transition saved tocapture |
| `collaborate`returnsCandidate | intent formed,delivery has notyet producedPending observation | source transaction incomplete |
| repair startsFailed andreturnsFailed | external multi-edge cycle`Failed -> PendingDelivery -> Failed` | same-state no-op ordirect Failed -> Failed edge |
| repair startsHandoffUnavailable andreturnsHandoffUnavailable | external cycle throughPendingDelivery | no attempted repair |
| repair startsFailed andreturnsDelivered | external`Failed -> PendingDelivery -> Delivered` | atomic Failed -> Delivered pair |
| Job journal storesreturned status | immutable per-target result used forsame-run final assembly / duplicate replay | external current-status cache ornext-run repair authority |

No current application flow requests a same-state external transition directly。The external owner may complete a repair cycle andreturn the same final degraded value;this remains a real attempted operation witha typed outcome,not an application-side no-op。

### 56.7 Failure、recovery与owner红线

| scenario | external boundary result | local capture effect | source / truth effect |
|---|---|---|---|
| typed Failed | stable intent + exact source + required reason | Captured may bind intent；IntentBound unchanged | none；accepted source remainscommitted |
| typed HandoffUnavailable | same | same | none |
| untyped `ApplicationError` | no explainable outcome | no bind orstatus inference | none；Job target classification waitsStep 12 |
| external intent missing forIntentBound capture | consistency failure | no unbind、new intent ornew snapshot | none |
| source / intent mismatch | reject outcome | no bind / nojournal success item | none |
| repair succeeds externally,local journal commit fails | external status may haveadvanced | capture unchanged；target remainsPlanned | reentry exact-gets current intent；does notrollbackexternal owner |
| Delivered later read | terminal external observation | local capture remainsIntentBound atsame version | no delivery evidence alias oracceptance signature generated |

External status never authorizes runtime/tools execution、SDK invocation、marketplace listing、governance approval、method useorformal exposure。It only reports collaboration progress foran already committed body-free event candidate。

### 56.8 Test cuts与边界矩阵停审

Step 16至少承接:

1. external owner formation atCandidate andall six atomic edges;
2. all14 illegal direct pairs,includingDelivered terminal andCandidate / Delivered repair rejection;
3. reasonNone forCandidate / Pending / Delivered andrequired body-free reason forFailed / HandoffUnavailable;
4. `get / list` read-only behavior andRepairable scope exclusion ofCandidate / Delivered;
5. Pending repair final outcomes andFailed / HandoffUnavailable mandatory Pending intermediate;
6. same degraded result afterrepair isverified asa cycle,not ano-op;
7. exact stable intent/source symmetry acrosscollaborate、get、list andrepair;
8. typed degraded outcome vsuntyped ApplicationError separation;
9. external advance + local Job rollback reentry withoutexternal rollback orduplicate intent;
10. zero local mutable collaboration-state table、capture status field、outbox、topic、relay、attempt、retry counterortransport error-body persistence。

| 审查项 | 结论 | exact证据 |
|---|---|---|
| enum / owner | pass | 5 variants；external Port owner only |
| formation / first observation | pass | owner none -> Candidate；application may first observeall5 after0~N edges |
| current / illegal pair | pass | 6 / 14,unclassified=0 |
| terminal / repair guard | pass | Delivered terminal；Candidate / Delivered inspect only |
| multi-edge repair | pass | Failed / unavailable pass throughPending；direct pair未伪造 |
| reason / identity invariant | pass | degraded requiresreason；intent/source stable |
| local persistence boundary | pass | capture storesintent only；Job storesimmutable result snapshot only |
| Rustdoc / structure comments | pass | new declaration=0；existing status/outcome/item/Port comments omission=0 |
| test handoff / blocker | pass | test cuts named；unresolved blocker=0 |

---

## 57. Batch `10.6` cross-owner、phase与mechanical audit

### 57.1 Reachable cross-owner relation审计

| local capture observation | external intent observation | 是否合法 | recovery / read path | 说明 |
|---|---|---|---|---|
| Captured + None | no external intent formed | yes,normal pre-call | collaborate fromofficial snapshot | no external status exists locally |
| Captured + None | external intent may already exist aftercall/beforebind commit | yes,crash / rollback seam；not locally persisted | repeat same candidate；external returns same stable intent semantics | 这是durability gap的恢复场景,不是third local state |
| IntentBound + Some(intent) | Candidate | yes | exact`get`;Candidate inspect only | local bind不要求delivery已开始 |
| IntentBound + Some(intent) | PendingDelivery | yes | exact`get`orintent repair Job | external mutable only |
| IntentBound + Some(intent) | Delivered | yes | exact`get`;no repair | local capture version不随delivery变化 |
| IntentBound + Some(intent) | Failed | yes | exact`get`;separate repair Job mayrepair same intent | no local rollback |
| IntentBound + Some(intent) | HandoffUnavailable | yes | same | no local unavailable state |
| IntentBound + Some(intent) | missing / different intent / different source | no | explicit consistency failure | no unbind、second intent orcurrent-truth rebuild |

There is no valid`Captured + Some(intent)`or`IntentBound + None`record shape。Repository load must reject sucha record asan invariant failure rather thanrepairing it fromexternal state。

### 57.2 Ten Outbound flow parity

| source family | local initial state | post-commit facade branch | external status handling | forbidden coupling |
|---|---|---|---|---|
| six truth / relation change events | Captured | same shared facade | any typed status may bindstable intent | status cannotchangeidentity / registry / descriptor / seam / relation / exposure |
| controlled consumer view availability | Captured | same | same | noformal exposure / runtime cache rewrite |
| impact identified | Captured | same | same | noimpact resolution / downstream execution claim |
| four-kind derived material refreshed | Captured | same | same | nomaterial freshness rewrite / marketplace truth |
| canonical reference resolution changed | Captured | same | same | noresolver rerun / reference state rewrite |

All ten flows shareone local matrix andone external boundary matrix。Event-specific mapping differences end before snapshot/capture persistence；none may definea different delivery lifecycle oradapter-private status。

### 57.3 Repair Job branch审计

| planned target | precondition | external call | local transition / write | terminal outcome semantics |
|---|---|---|---|---|
| `EventCapture`,existing intent None | exact Captured revision + official snapshot/source | `collaborate(stored candidate)` | `Captured -> IntentBound` + journal success same target UoW | any five typed statuses produceitem；degraded status may carryredacted issue |
| `EventCapture`,existing intent Some | exact IntentBound revision + same intent/source | `get(intent)` | no capture transition；journal-only success | no collaborate / repair / second bind |
| `CollaborationIntent`,Candidate | exact item/source reread | `get`only | journal-only success | inspected,not repaired |
| `CollaborationIntent`,Delivered | exact item/source reread | `get`only | journal-only success | terminal inspected |
| `CollaborationIntent`,PendingDelivery | exact item/source reread | `get(intent) -> repair(intent)` | journal-only success | final status isDelivered / Failed / HandoffUnavailable |
| `CollaborationIntent`,Failed | same | `get(intent) -> repair(intent)` | journal-only success | external passes throughPending,thenreturnsoneofthat same final set |
| `CollaborationIntent`,HandoffUnavailable | same | `get(intent) -> repair(intent)` | journal-only success | external passes throughPending,thenreturnsoneofthat same final set |

The Job never calls`CapabilityEventCollaborationService::collaborate_captured_event`,because that facade commitsan independent bind UoW。The inline Captured branch joins local bind withdurable target outcome;all intent branches leavecapture untouched。

### 57.4 No-rollback、reentry与authority审计

| gate | required result | actual contract |
|---|---|---|
| source commit beforeexternal call | mandatory | pass in10 / 10 Outbound flows |
| external call inlocal transaction | forbidden | pass；external effect precedes later bind/journal commit butcannotjoin it |
| external success + local rollback | recoverable | same capture candidate orsame intent reread；noexternal rollback |
| external degraded outcome | explicit typed status | no source rollback；stable intent stillbinds |
| external untyped error | no inferred status | no local status / issue fromerror text |
| current truth / mapper rebuild | zero aftersource commit | official immutable snapshot only |
| IntentBound second collaboration | zero | exact get only |
| repair formsnew event / snapshot / capture | zero | same intent / stored candidate only |
| Job report ascurrent external truth | forbidden | report isimmutable result snapshot；new Job rereadsPort |
| governance / method / runtime / SDK / marketplace / audit authority merge | zero | status iscollaboration progress only |

### 57.5 Pair arithmetic与matrix completeness

| audit | expected | actual | result |
|---|---:|---:|---|
| local variants | 2 | 2 | pass |
| local different-state pairs | 2 | 2 | pass |
| local current / reserved / illegal | 1 / 0 / 1 | 1 / 0 / 1 | pass |
| external variants | 5 | 5 | pass |
| external different-state pairs | 20 | 20 | pass |
| external current / reserved / illegal | 6 / 0 / 14 | 6 / 0 / 14 | pass |
| separate-matrix mechanical sum | 22 pairs | 7 current + 0 reserved + 15 illegal | pass |
| cross-owner combined aggregate / cross-product | 0 expected | 0 | pass |
| unclassified | 0 | 0 | pass |

### 57.6 Historical、Rustdoc、fabrication与artifact audit

| gate | result |
|---|---|
| old README / old formal `03` outbox、publisher、provider runtime语义继承 | no；historical material only |
| formal `02` no-outbox / no-truth-rollback boundary | preserved |
| local capture converted intobroker relay / queue item | no |
| external status persisted asmutable local state owner | no |
| snapshot、capture、loaded carrier、candidate、outcome、item、scan enum、Port与facade structure comments | pass；all relevant public declarations / fields / variants / payloads / methods haveEnglish`///` |
| controlled reopen | `CH-DDD-S10-EVENT-CAPTURE-TRACE-OWNERSHIP-001` closed；Step 7~9 prose-only |
| implementation commit / run_id / test result / evidence alias / sign-off | none fabricated |
| implementation ledger / planned boundary skeleton | not created |
| formal `03-详细设计.md` | unchanged |
| unresolved upstream blocker | 0 |

### 57.7 Mechanical stop audit

| check | result |
|---|---|
| local matrix heading / independent stop record | pass；§55 |
| external boundary matrix heading / independent stop record | pass；§56 |
| local 2-pair arithmetic | pass；1 + 0 + 1 |
| external 20-pair arithmetic | pass；6 + 0 + 14 |
| external formation vsfirst observation | pass；none -> Candidate separated fromPort returnedstatus |
| repair atomic edge vsmulti-edge operation | pass |
| IntentBound local terminal vsDelivered external terminal | pass；not merged |
| facade vsrepair Job transaction distinction | pass |
| structure / field Rustdoc gate | pass；new declaration=0,existing relevant omission=0 |
| conflict marker / fence / table / trailing whitespace | checked in final command |

---

## 58. Batch `10.6` 完成结论与停审

| Gate | 结果 |
|---|---|
| 用户允许进入`10.6` | pass |
| §12第六行、§43~§53与Step 6 / 7 / 8 / 9 exact capture / collaboration inputs已读 | pass |
| local capture状态集合 / factory / callable | pass；`capture -> Captured`,`bind_intent -> IntentBound` |
| local pair closure | pass；2 = 1 current + 0 reserved + 1 illegal |
| external owner formation / first observation | pass；none -> Candidate与五种first-observed outcome分离 |
| external pair closure | pass；20 = 6 current + 0 reserved + 14 illegal |
| Port callable / repair guard | pass；get/list read-only,Candidate/Delivered inspect only,three repairable states exact |
| cross-owner / phase / no-rollback | pass |
| same-intent algorithm boundary | pass；direction closed,exact algorithm留Step 13 |
| outbox / broker / topic / relay / retry / attempt exclusion | pass |
| Rustdoc / 结构注释门禁 | pass；new declaration=0,existing relevant omission=0 |
| controlled reopen / unresolved upstream blocker | `CH-DDD-S10-EVENT-CAPTURE-TRACE-OWNERSHIP-001` closed / 0 |
| 正式文档 / implementation artifact / commit | none |

```text
gate_status = 03_step_10_batch_10_6_completed_wait_user_review
completed_document = 03-详细设计.md
completed_step = Step 10 batch 10.6 local event capture + external Port-owned collaboration boundary
formal_document_written = false
unresolved_upstream_blocker = 0
next_allowed_action = start_03_step_10_batch_10_7_after_user_confirmation
commit_required = false
```

下一批只可在用户明确确认后进入`10.7`。进入前必须读取:

1. 本文件§12第七行、§54~§58和application technical state inventory；
2. Step 6 `CapabilityIdempotencyState` / `CapabilityIdempotencyRecord`、`CapabilityJobExecutionState`、`CapabilityJobExecutionTargetOutcome`与`CapabilityJobExecutionRecord`；
3. Step 7 idempotency repository、Job execution repository、typed stored-result repository与UoW contract；
4. Step 8 shared write replay、Operations Job journal / response assembler / final result linkage；
5. Step 9 Command / Consumer / Job common reservation-replay flow、all-target-terminal finalize与per-target journal flow；
6. 正式`02-概要设计.md` §9~§10的application technical state / no-runtime-owner边界。

不得提前进入`10.8`、修改正式`03-详细设计.md`、创建implementation ledger / planned boundary skeleton或提交commit。

---

## 59. Batch `10.7` 输入复核与application technical owner裁决

### 59.1 开工门禁与exact读取结论

| 读取主题 | exact结论 | 本批矩阵约束 |
|---|---|---|
| idempotency formation | `CapabilityIdempotencyRecord::reserve(...)`只形成`Reserved + result_ref=None + version 1` | formation不计入两态ordered-pair分母；Query不得形成reservation |
| atomic reserve | `CapabilityIdempotencyRepository::reserve_if_absent(...)`返回`CapabilityIdempotencyReserveResult::{Reserved(Loaded<_>),Existing(Loaded<_>)}` | reserve result是repository operation result,不是第二套持久化状态机；`Existing`不是state transition |
| completed replay | same key / channel / operation / digest且state=Completed时只按stored result ref读取exact immutable surface / typed envelope | replay不写idempotency、business truth或Job journal,不重跑Command / Consumer / Job |
| current conflict handling | mismatch、unsafe existing state或atomic reserve race均保留winning existing record；Step 9只执行zero-write winner classification | public conflict / quarantine / race classification不得变成idempotency state mutation |
| idempotency completion | accepted Command / Consumer在各自accepted UoW调用`complete(...)`；Job在final-report UoW调用 | current idempotency异态边只有`Reserved -> Completed` |
| Job formation | `CapabilityJobExecutionRecord::plan(...)`形成完整stable plan,execution=`Planned`,每个target outcome=`Planned`,final ref / finalized time为空 | initial reservation + complete journal同一UoW；没有partial plan、Running或private checkpoint |
| target progression | `record_succeeded / record_failed / record_skipped`只改一个exact Planned target并使parent journal version +1 | execution state仍为Planned；每个terminal outcome单独持久化并exact reload |
| Job finalization | `finalize(...)`只接受all-target-terminal journal,写same application result ref并形成Finalized | typed response、stored shell / surface / envelope、journal Finalized和idempotency Completed同一final UoW |
| no-op / failure distinction | `CapabilityJobItemChange::Unchanged`属于plan-symmetric Succeeded payload；stable failure / skip均无business effect | Unchanged不得降为Skipped；rollback前不得记录Failed / Skipped |
| preclassified failure | `CapabilityJobExecutionTargetPlan::PreclassifiedFailure`仍由`CapabilityJobExecutionTarget::planned(...)`形成Planned outcome | loop只在zero-business-effect UoW调用`record_failed(...)`;不得在initial journal直接写Failed |

本批受Step 13 controlled reopen同步后,没有发现需要新增的variant、field、callable、repository method、protocol或flow。旧材料中的`Conflict` state、`conflict_reason`和`mark_conflict(...)`已从active object / repository / matrix surface删除；mismatch、reserve race和different-run只做zero-write winner classification,不形成新的持久化状态。

### 59.2 状态主语与容易混淆的非状态载体

| 名称 | owner / persistence | 是否是本批状态主语 | exact作用 | 不得解释为 |
|---|---|---|---|---|
| `CapabilityIdempotencyState` | application local idempotency record | 是 | reservation durable lifecycle | public result disposition、HTTP conflict或Job outcome |
| `CapabilityIdempotencyReserveResult` | repository call return；ephemeral | 否 | 区分本调用是否赢得absent-key reserve | persisted state transition |
| `StoredCapabilityResultDisposition`及channel-specific disposition | immutable stored result surface | 否 | duplicate replay原始结果分类 | idempotency lifecycle |
| `CapabilityJobExecutionState` | application local Job journal | 是 | complete plan到stored result linkage的最小lifecycle | runner / worker / lease / attempt状态 |
| `CapabilityJobExecutionTargetOutcome` | one target inside versioned Job journal | 是,独立矩阵 | target effect是否未提交或已形成immutable terminal result | execution-level state或public Job disposition |
| `CapabilityJobExecutionTargetPlan::PreclassifiedFailure` | immutable target plan payload | 否 | planning时已闭合的typed failed-target输入 | initial Failed outcome |
| `CapabilityJobExecutionSuccess` | Succeeded variant payload | 否 | 保存plan-symmetric typed result | current business truth或另一套state machine |
| `CapabilityJobItemChange` | success item marker | 否 | Created / Updated / Unchanged业务效果分类 | target lifecycle；Unchanged仍是Succeeded |
| `CapabilityJobExecutionIssueImpact` | failure / run issue payload | 否 | final disposition assembler输入 | target或execution state |
| `CapabilityJobResponse` disposition | public / stored final marker | 否 | 从all-terminal journal与run issues纯装配 | execution Failed / Retryable state；execution只有Planned / Finalized |

三张矩阵必须分别计数。`Reserved + Planned execution + three Planned targets`只是一个可达cross-object relation,不是联合enum、数据库status string或第四张组合状态机。

### 59.3 Conflict classification与winner-preservation裁决

| 证据面 | 观察 | 裁决 |
|---|---|---|
| Step 6 object | active `CapabilityIdempotencyState`只有`Reserved / Completed`;record没有`conflict_reason`或`mark_conflict` | persisted conflict direction不存在 |
| Step 7 repository | `save`只接受object已验证的`Reserved -> Completed` | adapter不得持久化Conflict row或补私有终止路径 |
| Step 8 protocols | Command / Consumer / Job mismatch均要求返回typed conflict / quarantine surface并保持stored result / report不变 | 没有protocol要求持久化Conflict |
| Step 9 shared guards | Existing mismatch先rollback本次uncommitted UoW,随后preserve original reservation / result；atomic race只discard local plan并重分类winner | 没有conflict save UoW |
| completed mismatch | original Completed及result ref必须保持exact | 绝不允许Completed -> Conflict |
| reserved mismatch | winning Reserved可能仍属于首个合法执行；把它改Conflict会破坏owner execution | current只返回conflict surface,winning record不变 |

因此conflict是application observation / public mapping,不是`CapabilityIdempotencyState` variant。任何未来需要终止Reserved owner的能力都必须先新增完整的owner、reason、authorization、repository与reentry设计；当前Step 13不得通过同key mismatch隐式创造该能力。

### 59.4 Pair分母、formation与callable口径

| matrix | variants | possible different-state pairs | current | reserved | illegal | formation / current callable |
|---|---:|---:|---:|---:|---:|---|
| `CapabilityIdempotencyState` | 2 | 2 | 1 | 0 | 1 | `reserve -> Reserved`;current `complete` |
| `CapabilityJobExecutionState` | 2 | 2 | 1 | 0 | 1 | `plan -> Planned`;current `finalize` |
| `CapabilityJobExecutionTargetOutcome` | 4 | 12 | 3 | 0 | 9 | target `planned -> Planned`;current three `record_*` members |

Formation edge、same-state parent-record revision与read-only replay均不计入different-state pair。三张独立矩阵的机械总和是`16 = 5 current + 0 reserved + 11 illegal`;该总和只检查漏pair,不建立idempotency × execution × target的cross-product。

### 59.5 受控回开、结构注释与artifact门禁

| gate | result |
|---|---|
| Step 6 object / state / field / callable变化 | none |
| Step 7 trait / repository / method / UoW变化 | none；36 Ports保持不变 |
| Step 8 DTO / protocol / assembler变化 | none；83 protocols保持不变 |
| Step 9 function flow变化 | none；83 / 83 flows保持不变 |
| controlled reopen | Step 13 sync已落入Step 6 / 7 / 8 / 9；本文件只同步active two-state baseline |
| new public declaration | 0 |
| relevant Rustdoc | pass；`CapabilityIdempotencyRecord`、`CapabilityJobExecutionRecord`、`CapabilityJobExecutionTarget`及其全部fields,三个state enum、全部variants与tuple payload均已有英文`///` |
| struct / field comment omission | 0；本批没有新增结构体或字段 |
| formal `03-详细设计.md` | unchanged |
| implementation ledger / boundary skeleton | not created |
| unresolved upstream blocker | 0 |

---

## 60. `CapabilityIdempotencyState` 状态矩阵

### 60.1 状态集合、formation与字段不变量

| state | exact字段形态 | current persisted reachability | terminal | 不表示 |
|---|---|---|---|---|
| `Reserved` | `result_ref=None`;version 1 at formation | all accepted write channels fresh reserve；Job target processing期间持续保留 | 否 | domain mutation已完成、worker lease或in-progress response |
| `Completed` | `result_ref=Some(exact application result ref)`;version=prior+1 | accepted Command / Consumer result UoW或Job final-report UoW | 是 | business success only；stable rejection、ignored receipt、Failed / Retryable Job report也可被完整存储后完成幂等 |

Across every legal mutation,以下identity fields不得改变:

```text
idempotency_key
channel
operation_name
request_digest
reservation_trace_id
reserved_at
```

`complete(...)`只改变`state / result_ref / version / updated_at`。它不得替换key / digest / first trace；conflict observation不产生record revision。

### 60.2 ASCII状态图

```text
validated write context + canonical stable digest
  |
  | CapabilityIdempotencyRecord::reserve(...)
  | CapabilityIdempotencyRepository::reserve_if_absent(...)
  v
Reserved + no result
  |
  | current: exact immutable result is staged in the same UoW
  | CapabilityIdempotencyRecord::complete(same result ref, now)
  v
Completed + exact result ref
  X terminal;duplicate only reads stored result

Existing mismatch / reserve race
  -> rollback request-local UoW
  -> preserve winning Reserved or Completed record
  -> return typed classification;zero state edge
```

### 60.3 Different-state转换矩阵

| From | To | class | exact callable | current Step 9 trigger | guard | state / field effect | persistence / rejection |
|---|---|---|---|---|---|---|---|
| `Reserved` | `Completed` | current | `CapabilityIdempotencyRecord::complete(result_ref,now)` | all 26 Command accepted/stored-rejection outcomes；all 6 Inbound terminal stored receipts；all 8 Job final-report flows | exact loaded reservation stillReserved；result operation matches record；matching immutable channel surface / shell / typed envelope staged；expected version来自same `Loaded` | state=Completed；result ref Some；reason remainsNone；version +1；updated_at=now | save in same UoW as exact stored result and declared accepted local effects；any failure rolls backcompletion |
| `Completed` | `Reserved` | illegal | none | none | terminal completed result不得reopen | none | reject / consistency error；no result deletion、version/time change |

Pair arithmetic:

```text
2 * (2 - 1) = 2 possible different-state pairs
1 current + 0 reserved + 1 illegal = 2
unclassified = 0
```

### 60.4 Collision、duplicate与same-state行为

| case | current action | persisted idempotency state | business / stored-result effect |
|---|---|---|---|
| absent key,atomic reserve wins | persist exact Reserved | formation toReserved | Command / Consumer continue same accepted UoW；Job initial UoW also createscomplete journal |
| preflight absent,butatomic reserve returnsExisting | rollback local UoW；discard request-local object / Job plan；exact-load and classify winner once | winner unchanged | zero business id / resolver / factory / effect；Job不得递归进入自身entry |
| Existing Completed + exact match | `completed_result_ref()` then exact channel-specific stored result get | Completed unchanged | zero truth / journal / capture write；response-only duplicate marker may differ |
| Existing Completed + mismatch | return typed conflict without exposing or replacing original result | Completed unchanged | original stored shell / surface / typed envelope unchanged |
| Existing Reserved + exact Job match | exact-load matching journal and resume first Planned target / final assembly | Reserved unchanged until final UoW | no replan / rescan；already terminal targets remaincommitted |
| Existing Reserved + Command / Consumer in-progress or unsafe state | transient transaction-visible in-progress may map to existing `IdempotencyInProgress`; committed orphan is consistency defect | Reserved unchanged | no second mutation；不得猜stored result |
| Existing Reserved + mismatch | return conflict classification | winning Reserved unchanged | no state revision;first execution ownership不被第二request破坏 |
| result store missing / corrupt behindCompleted | consistency error | Completed unchanged | never rerun operation or reconstruct fromcurrent truth |

Same-state observation不创建revision。Repeated reserve、duplicate replay、mismatch handling和in-progress inspection都不得写`Reserved -> Reserved`或`Completed -> Completed`记录。

### 60.5 Transaction、phase与failure边界

| channel / phase | required atomic set | completion point | rollback / reentry |
|---|---|---|---|
| Command fresh accepted | exact truth / relation / material effects、records / traces / captures、immutable command result + reservation | `complete(same result ref)` before one UoW commit | any staged failure leaves absent reservation when reserve was in same UoW；no partial Completed |
| Inbound fresh terminal outcome | declared canonical/downstream effect、typed receipt shell / surface / envelope + reservation | same receipt result ref | resolver observation is external read,但local failure留下no completion；retry reclassifiesexact key |
| Job initial | Reserved reservation + complete Planned journal | no completion yet | both visible or neither；target effects不得先于initial commit |
| Job target loop | one target effect / no-effect journal update | reservation remainsReserved | target rollback不complete reservation；earlier terminal targets remain |
| Job final report | typed response + stored shell / surface / envelope + Finalized journal + Completed reservation | same application result ref across all owners | failure keepsjournal Planned、reservation Reserved、stored final result invisible；reentry只重试final assembly |
| post-commit external collaboration / audit handoff | outside completion UoW | no idempotency mutation | external failure不得把Completed改回Reserved或形成parallel conflict row |

Step 11仍需选择physical save order / isolation,Step 12定义exact error code,Step 13定义digest、race和in-progress算法；这些后续选择不得改变本矩阵的atomic membership、terminality或winner-preservation规则。

### 60.6 Illegal handling与Step 16测试切口

非法terminal reopen、completed result ref替换 / 清空、Reserved携带result、identity field mutation或wrong expected version必须返回typed domain/application consistency或state-transition error,并保持record与stored result不变。Exact错误variant留Step 12。

Step 16至少承接:

1. all three write channels fresh reserve形成exact Reserved field shape,Query reserve count为0;
2. Command、Consumer、Job各自completion UoW任一点失败均不留下Completed-without-result;
3. exact Completed duplicate只读取matching stored result,domain / resolver / scan / journal mutation计数为0;
4. Completed mismatch保持state、result ref、version、updated time与stored bytes全部不变;
5. Reserved mismatch与atomic race均不改winner、不生成business ids;
6. missing / corrupt stored result behindCompleted返回consistency error且operation rerun计数为0;
7. the one illegal terminal direction、wrong expected version和field-shape corruption拒绝且零mutation;
8. Job Failed / Retryable public disposition仍可在stored report成功后使idempotency Completed,不得映射为persisted conflict。

### 60.7 单状态机停审记录

| 审查项 | 结论 | exact证据 |
|---|---|---|
| enum / owner | pass | two variants owned by`CapabilityIdempotencyRecord.state` |
| formation | pass | `reserve(...) -> Reserved`,atomic repository result separate |
| current / reserved / illegal pairs | pass | 1 / 0 / 1,unclassified=0 |
| conflict classification | pass | public/application conflict mapping is zero-write; no persisted conflict state |
| completed terminal / replay | pass | exact stored result only；missing/corrupt never reruns |
| transaction / result linkage | pass | channel-specific immutable result与completion同UoW |
| Rustdoc / structure comments | pass | new declaration=0；existing struct / fields / enum / variants / methods omission=0 |
| test handoff / blocker | pass | test cuts named；unresolved upstream blocker=0 |

---

## 61. `CapabilityJobExecutionState` 状态矩阵

### 61.1 状态集合、formation与record-level invariant

| state | exact record shape | current reachability | terminal | 不表示 |
|---|---|---|---|---|
| `Planned` | complete immutable plan；zero or more target outcomes may still bePlanned；`final_result_ref=None`;`finalized_at=None` | initial Job UoW以及全部target UoW后、final-report commit前 | 否 | no work happened；部分 / 全部targets可能已terminal |
| `Finalized` | all targets terminal；`final_result_ref=Some(exact ref)`;`finalized_at=Some(time)` | final-report UoW only | 是 | all targets succeeded；public disposition可为Completed / PartiallyCompleted / Failed / Retryable |

Across execution revisions,以下plan identity不得改变:

```text
idempotency_key / operation_name / job_name / schema_version / run_id
actor_context / trace_id / request_digest / planned_at
targets.length / target ordinal order / target_ref / target plan
initial run issue order and payload
```

Target outcome和允许的duplicate-free appended run issue是Planned execution下的record content progression；它们不得append / delete / reorder target plan。Current Step 9只使用initial run issues和target outcome members,没有调用`record_run_issue(...)`追加post-plan issue；该member不得被adapter私自用于保存raw errors。

### 61.2 ASCII状态图

```text
complete deterministic planning outcome
  | CapabilityJobExecutionTarget::planned(...) for every ordinal
  | CapabilityJobExecutionRecord::plan(...)
  | initial UoW with idempotency Reserved
  v
Planned execution
  | target 1 Planned -> terminal;save + exact reload
  | target 2 Planned -> terminal;save + exact reload
  | ... stable ordinal order ...
  | zero-target journal is already all-target-terminal
  v
Planned execution with all targets terminal
  | pure typed response assembly from journal only
  | CapabilityJobExecutionRecord::finalize(same result ref, now)
  | stored Job result + idempotency complete in same final UoW
  v
Finalized execution
  X no reopen / ref replacement / target rewrite
  -> duplicate uses immutable stored Job response only
```

`Planned`既覆盖“仍有target待处理”,也覆盖“all targets terminal但final result尚未原子提交”的recoverable gap。不得新增`Running / Completing / Failed / Retryable` execution state来编码worker过程或public disposition。

### 61.3 Different-state转换矩阵

| From | To | class | exact callable | exact triggering flows | guard | object delta | atomic persistence |
|---|---|---|---|---|---|---|---|
| `Planned` | `Finalized` | current | `CapabilityJobExecutionRecord::finalize(result_ref,now)` | all 8 Operations Job flows after target loop / zero-target plan | matching request / journal identity；`next_planned_target()==None`;every target `is_terminal`;current state Planned；result operation matches execution；final ref/time empty | execution state Finalized；final ref Some；finalized_at=Some(now)；version +1；updated_at=now；plan/outcomes/issues unchanged | same final UoW as variant-bound typed response、stored shell / surface / envelope andidempotency `Reserved -> Completed` withsame ref |
| `Finalized` | `Planned` | illegal | none | none | terminal journal and immutable result linkage | none | reject；不得clear final ref/time、delete stored result或reopen target |

Pair arithmetic:

```text
2 * (2 - 1) = 2 possible different-state pairs
1 current + 0 reserved + 1 illegal = 2
unclassified = 0
```

### 61.4 Planned same-state record progression

| operation / branch | execution state before / after | allowed record delta | forbidden |
|---|---|---|---|
| `record_succeeded` | Planned -> Planned | one exact target Planned -> Succeeded；parent version +1 / updated time | plan / target identity rewrite；second target mutation |
| `record_failed` | Planned -> Planned | one exact target Planned -> Failed；parent version +1 / updated time | failed-before-rollback、raw error、Advisory impact |
| `record_skipped` | Planned -> Planned | one exact target Planned -> Skipped；parent version +1 / updated time | Unchanged-as-skip、business effect alongside skip |
| `record_run_issue` | Planned -> Planned, reserved same-state callable | no current Step 9 trigger；future use would append one duplicate-free typed redacted issue + explicit impact andparent version +1 | adapter / catch-all error path私自调用、raw error、opaque-ref impact inference、initial issue duplication |
| target save optimistic conflict | persisted Planned remains prior revision until exact reload | no assumed delta | object version / ordinal /timestamp as expected-version token |
| all targets terminal | Planned remains persisted until final UoW | no implicit auto-finalize | adapter-triggered Finalized、report-by-run reconstruction |
| final UoW rollback | persisted Planned with all prior target terminals | no final ref/time | rolling back earlier target commits、claiming stored response exists |

Same-state revisions are legitimate because nested target outcomes progress,但它们不增加`CapabilityJobExecutionState` pair。Every save uses latest `Loaded<CapabilityJobExecutionRecord>.expected_version`;after each commit / conflict application exact-reloads before choosing the next ordinal。

### 61.5 Finalization、response assembly与reentry

| gate | exact rule | failure behavior |
|---|---|---|
| identity symmetry | key / operation / Job / schema / run / digest match accepted request and Reserved reservation | consistency/conflict；no finalize |
| all-target-terminal | `next_planned_target()==None` and every target terminal；zero-target complete plan satisfies vacuously | any Planned target blocks assembler / result id generation |
| pure assembler source | only journal plans、typed outcomes、run issues and original actor / trace | no current truth / material / reference / collaboration reads |
| disposition derivation | typed outcomes + explicit impacts deriveCompleted / PartiallyCompleted / Failed / Retryable | no private counters、error strings或target-state shortcut |
| exact result identity | one generated application result ref maps symmetrically toprotocol result ref、shell、surface / envelope、journal andreservation | any mismatch rolls back final UoW |
| final atomic set | `save_job_report` + journal Finalized save + reservation Completed save | all visible or none；physical order Step 11 |
| crash before final commit | journal remainsPlanned,all committed target outcomes retained,reservation remainsReserved | reentry skips terminal targets and reruns pure final assembly only |
| completed duplicate | typed stored Job report replay | no journal load required for recomputation；no scan / target execution |

Finalization does not prove external post-commit event collaboration succeeded anddoes not convert Job journal intoexecution / tools runtime truth。A target can preserve an external collaboration outcome snapshot,但journal cannot become external current-status owner。

### 61.6 Illegal handling与Step 16测试切口

Finalized mutation、finalize with Planned target、wrong result operation、preexisting final ref/time、plan or target order mutation、missing matching reservation、wrong expected version、stored result asymmetry或assembler current-truth read必须失败且不改变persisted journal。Exact错误mapping留Step 12。

Step 16至少承接:

1. all eight Jobs initial commit形成Planned + None final fields + complete contiguous target plan；reservation / journal visibility原子;
2. `targets=[] / run_issues=[]`可直接all-terminal finalize为Completed report,但不得跳过stored result atomic set;
3. `targets=[] + StableFailure / RetryablePrerequisite`分别装配Failed / Retryable report,execution仍Planned -> Finalized;
4. every target commit keepsexecution state Planned andincrements parent version exactly once;
5. all-target-terminal前`finalize`拒绝且result id / stored result write计数为0;
6. final UoW每个failure point留下Planned + Reserved且stored report不可见,earlier terminal outcomes不回滚;
7. reentry fromall-terminal Planned不重新scan / resolve / mutate target,只重新assemble/finalize;
8. Finalized -> Planned、second finalize、result-ref replacement和plan mutation拒绝且零mutation;
9. final stored response、journal与reservation的application result ref逐字段相同,wrong union / schema / run / ref replay失败;
10. `record_run_issue(...)` current integration调用计数为0；object unit test验证duplicate-free ref / explicit impact / version guard,但不得声称current protocol reachability;
11. no Running / lease / attempt / heartbeat / scheduler / runtime execution field或transition进入journal。

### 61.7 单状态机停审记录

| 审查项 | 结论 | exact证据 |
|---|---|---|
| enum / owner | pass | 2 variants owned byversioned Job journal |
| formation | pass | complete`plan(...) -> Planned`,initial UoW withReserved |
| current / illegal pair | pass | 1 / 1,reserved=0,unclassified=0 |
| nested same-state progression | pass | exact one-target terminal revisions keep execution Planned |
| reserved same-state callable | pass | `record_run_issue`无current Step 9 trigger,不得被adapter用作raw-error append |
| all-terminal / zero-target | pass | both closed；no auto-finalize |
| final linkage / reentry | pass | stored report + Finalized + Completed same-ref UoW；rollback gap recoverable |
| Rustdoc / structure comments | pass | new declaration=0；existing execution enum / record / every field / method omission=0 |
| test handoff / blocker | pass | test cuts named；unresolved upstream blocker=0 |

---

## 62. `CapabilityJobExecutionTargetOutcome` 状态矩阵

### 62.1 状态集合、formation与payload invariant

| outcome variant | exact meaning | terminal | payload / effect invariant | 不得解释为 |
|---|---|---|---|---|
| `Planned` | frozen target尚无committed terminal outcome | 否 | no outcome payload；target plan / ref alreadycomplete | Running、claimed、attempted或一定未调用external read |
| `Succeeded(success)` | declared target effect orplan-symmetric no-op / external observation与typed success已原子记录 | 是 | `success.matches_plan(plan)`且exact target refs对称 | external current truth、all Job success或一定创建了revision |
| `Failed(failure)` | target没有committed business effect,并有matching redacted stable / retryable issue | 是 | issue target ref matches；impact不是Advisory；attempted local UoW已rollback或PreclassifiedFailure根本未尝试 | execution Failed state、raw exception log |
| `Skipped(issue)` | stable boundary rule明确使target不执行且无business effect | 是 | issue target ref exact；只用于protocol-declared skip | `Unchanged`、temporary worker choice或silent target drop |

`CapabilityJobExecutionTarget::planned(...)`是唯一formation callable。它验证positive contiguous ordinal由record plan承接、target ref与typed plan对称,并固定outcome=`Planned`。`PreclassifiedFailure { failure }`也必须走该factory；embedded failure只是未来`record_failed`输入,不是initial outcome。

### 62.2 ASCII状态图

```text
complete frozen target plan + exact public-safe target ref
  | CapabilityJobExecutionTarget::planned(...)
  v
Planned
  |-- declared effect / no-op / external observation accepted
  |   record_succeeded(plan-symmetric typed success)
  |   -> Succeeded(payload) [terminal]
  |
  |-- attempted target UoW rolled back,or PreclassifiedFailure has zero attempt
  |   record_failed(matching stable/retryable issue)
  |   -> Failed(payload) [terminal]
  |
  `-- stable protocol boundary intentionally skips all effect
      record_skipped(matching issue)
      -> Skipped(payload) [terminal]

Succeeded / Failed / Skipped
  X no payload replacement
  X no terminal-to-terminal conversion
  X no reset to Planned
```

### 62.3 Current Planned-to-terminal转换

| From | To | exact callable | current triggering branches | required guard | parent journal / local effect | persistence boundary |
|---|---|---|---|---|---|---|
| `Planned` | `Succeeded(_)` | `CapabilityJobExecutionRecord::record_succeeded(ordinal,success,now)` | all 8 Job flows：actual report / material / reference / capture-binding effect；exact Unchanged；external collaboration observation | execution state Planned；exact ordinal currently Planned；success variant / refs match frozen plan；declared source/ref/version guards pass | one target outcome changes；journal version +1 / updated time；actual local effect only whendeclared | changed target: effect + snapshot/capture + success + journal save same target UoW；Unchanged / external-observation-only:journal-only UoW |
| `Planned` | `Failed(_)` | `record_failed(ordinal,failure,now)` | `PreclassifiedFailure` in all relevant Job loops；post-rollback typed target failure allowed byshared guard | exact target ref；StableFailure / RetryablePrerequisite impact；no target business effect committed；forattempted write,rollback complete beforecall | one target terminal failure；journal version +1；business effect count 0 | independent no-business-effect UoW；PreclassifiedFailure skips source read / resolver / id / factory / capture entirely |
| `Planned` | `Skipped(_)` | `record_skipped(ordinal,issue,now)` | reference refresh exact current Invalid / Forbidden branch；other skip only whereconcrete protocol declares stable boundary issue | exact target / current frozen ref symmetry；stable skip reason；no business effect | one target terminal skip；journal version +1；effect / capture count 0 | journal-only target UoW；no resolver for terminal reference branch |

All three methods leaveexecution state Planned andchange exactly onetarget。They useparent journal expected version,not target ordinal、record object version、clock或repository cursor as concurrency token。

### 62.4 Terminal pair与payload immutability矩阵

| From | To | class | rejection reason |
|---|---|---|---|
| `Succeeded(_)` | `Planned` | illegal | committed typed success / effect不得uncommit |
| `Succeeded(_)` | `Failed(_)` | illegal | later observation / external failure不得重写committed result |
| `Succeeded(_)` | `Skipped(_)` | illegal | success includingUnchanged不得relabel为skip |
| `Failed(_)` | `Planned` | illegal | retry需要new accepted run / key policy,不是重开terminal target |
| `Failed(_)` | `Succeeded(_)` | illegal | reentry不得重新执行failed target或补写success |
| `Failed(_)` | `Skipped(_)` | illegal | issue impact / classification不得事后降格 |
| `Skipped(_)` | `Planned` | illegal | stable boundary conclusion immutable |
| `Skipped(_)` | `Succeeded(_)` | illegal | later source change需new run,不得修改historical journal |
| `Skipped(_)` | `Failed(_)` | illegal | skip与failure payload不能互换 |

Current Planned outbound edges为3,terminal outbound edges为0:

```text
4 * (4 - 1) = 12 possible different-state pairs
3 current + 0 reserved + 9 illegal = 12
unclassified = 0
```

同一terminal variant内更换payload也非法。`Succeeded(old) -> Succeeded(new)`、`Failed(issue A) -> Failed(issue B)`和`Skipped(issue A) -> Skipped(issue B)`虽然不属于different-variant pair,仍被terminal immutability guard拒绝且不得version +1。

### 62.5 Branch semantics：Succeeded、Failed与Skipped不可混用

| scenario | required terminal outcome | business / external effect rule | prohibited classification |
|---|---|---|---|
| exact material / report Created or Updated | Succeeded | local effect + matching capture + outcome same UoW | Failed aftercommit、Skipped |
| complete exact no-op | Succeeded with`CapabilityJobItemChange::Unchanged` | journal-only；zero id / clock-for-fake-change / save / capture | Skipped、silent omission |
| reference same value + same reason | Succeeded Unchanged | no canonical state revision / event | Skipped |
| reference current Invalid / Forbidden | Skipped | no resolver、factory、state save或capture | Succeeded Unchanged、Failed |
| planning foundstable per-target issue withknown target | initial Planned,thenFailed from`PreclassifiedFailure` | zero source read / resolver / id / target effect | initial Failed、run issue、Skipped |
| attempted local target UoW fails androlls back | Failed onlyafterrollback iftyped stable/retryable issue exists | rollback proves no business effect；failure UoW只保存journal | Failed beforerollback、Succeeded |
| unsafe untyped error | no forced terminal outcome | propagate application error；journal staysPlanned | fabricate issue / Failed payload |
| external resolver / collaboration returnsaccepted typed observation | Succeeded ifplan-symmetric | external effect/read may precede journal UoW；local target effect perplan | treating external current status asjournal state |
| external outcome exists butlocal target UoW fails | remainsPlanned | reentry repeats onlydeclared idempotent exact-candidate / exact-intent operation | terminal success based onlyonexternal return |

Earlier terminal targets remaincommitted whena later target fails。The final response assembler derives partial / failed / retryable disposition fromall target payloads andrun issues;it does not convert terminal outcome variants duringassembly。

### 62.6 Transaction、ordinal progression与reentry

| phase | exact rule | recovery invariant |
|---|---|---|
| target selection | only`next_planned_target()` returns smallest Planned ordinal | never skip smaller ordinal or rescan plan |
| changed success | declared target local effect、outbound snapshot/capture andSucceeded journal revision one UoW | rollback leavesall members absent andtarget Planned |
| Unchanged success | journal-only Succeeded UoW | no fake material version / event / id |
| post-rollback failure | exact reload latest journal,then no-effect Failed UoW | concurrent terminal winner preserved；do not overwrite |
| preclassified failure | no-effect Failed UoW directly fromfrozen plan | no source / resolver / id / factory / capture call |
| stable skip | journal-only Skipped UoW | terminal source branch not resolved / mutated |
| post-commit collaboration | onlyafterchanged local success commit whereflow declares | collaboration failure不能重写Succeeded或business truth |
| exact reload | after every target commit / optimistic conflict | subsequent selection seeslatest terminal set |
| reentry | alreadyterminal targets ignored by`next_planned_target` | no repeated id generation、effect、capture、resolver或collaboration |

For event-collaboration repair,external operation may have side effects beforelocal journal commit。A failed local commit does not createSucceeded;reentry repeats onlythe protocol-declared idempotent same candidate / same intent action。For all local material / report / canonical state writes,the effect andSucceeded are strictly same-UoW。

### 62.7 Illegal handling与Step 16测试切口

Wrong ordinal、plan / target / success mismatch、failure withAdvisory impact、issue target mismatch、terminal overwrite、skip withbusiness effect、success afteruncommitted effect、failed-before-rollback、plan mutation或wrong journal expected version必须 reject andleave target / journal unchanged。

Step 16至少承接:

1. every plan variant includingPreclassifiedFailure形成initial Planned target,不得直接terminal;
2. each success variant与matching plan / target ref正例及所有wrong-variant / wrong-ref负例;
3. Created / Updated target effect、snapshot / capture、Succeeded和journal save逐failure-point原子回滚;
4. each Unchanged branch形成Succeeded且effect / id / source save / capture计数为0;
5. PreclassifiedFailure只调用`record_failed + journal save`,source / resolver / id / factory / capture计数为0;
6. attempted write failure仅在rollback完成后记录Failed,rollback failure或unsafe error保持Planned;
7. reference Invalid / Forbidden形成Skipped且resolver / state mutation为0;
8. all nine terminal-to-other pair与three same-variant payload replacements拒绝、version/time不变;
9. optimistic race exact reload preserveswinning terminal outcome,loser不得second terminal write;
10. reentry skipsall terminal targets andcontinues smallest Planned ordinal;
11. external outcome + local commit failure保持Planned,reentry使用same frozen candidate / intent;
12. no Running / attempt / retry-counter state,并验证public Job disposition不反写target outcome。

### 62.8 单状态机停审记录

| 审查项 | 结论 | exact证据 |
|---|---|---|
| enum / owner | pass | 4 variants inside oneversioned Job journal target |
| formation | pass | `CapabilityJobExecutionTarget::planned -> Planned`;PreclassifiedFailure不例外 |
| current / illegal pairs | pass | 3 / 9,reserved=0,unclassified=0 |
| payload / plan symmetry | pass | success / failure / skip exact target guards闭合 |
| Unchanged / skip distinction | pass | Unchanged alwaysSucceeded；reference terminal branch exactSkipped |
| failure / rollback discipline | pass | PreclassifiedFailure zero-attempt；attempted effect rollback first |
| terminal / reentry | pass | terminal payload immutable；`next_planned_target`only |
| Rustdoc / structure comments | pass | target struct、all fields、outcome enum / variants / tuple payload与methods omission=0 |
| test handoff / blocker | pass | test cuts named；unresolved upstream blocker=0 |

---

## 63. Batch `10.7` cross-state、transaction与mechanical audit

### 63.1 Reachable cross-object relation

| phase | idempotency | execution | target outcomes | stored result | exact interpretation |
|---|---|---|---|---|---|
| beforefresh Job initial commit | absent | absent | absent | absent | planning request-local only,not recovery truth |
| afterfresh Job initial commit,N > 0 | Reserved | Planned | all Planned | absent | stable complete plan durable,zero target effect required so far |
| aftersome target commits | Reserved | Planned | terminal prefix / set + remaining Planned | absent | each terminal outcome durable；execution remainsPlanned |
| all targets terminal,beforefinal commit | Reserved | Planned | all Succeeded / Failed / Skipped | absent | valid recoverable finalization gap |
| afterfinal-report commit | Completed(same ref) | Finalized(same ref) | all terminal unchanged | exact typed Job report visible | final atomic linkage complete |
| completed duplicate | Completed | no mutation | no mutation | exact typed stored replay | no scan / target / external action |
| final UoW rollback | Reserved | Planned | all previously committed terminals remain | absent | retry final assembly only；不回滚target history |

Unreachable / forbidden cross-relations include`Completed + Planned execution`,`Reserved + Finalized execution`,`Finalized + any Planned target`以及`Completed / Finalized`result ref不相同。A persisted idempotency state outside`Reserved / Completed`isalso anunknown-value consistency defect；adapters must detect rather than normalize these inconsistencies。

### 63.2 Initial、per-target与final UoW membership

| UoW | required members | explicitly outside | rollback proof |
|---|---|---|---|
| Job initial | exact Reserved reservation + complete Planned journal + all Planned targets / initial run issues | target business effect、stored final result、external collaboration | both records visible or neither |
| changed target | one declared material / report / canonical state / local capture bind effect + matching outbound snapshot/capture whenapplicable + exactly one Succeeded outcome | other targets、reservation completion、final report、post-commit collaboration | no effect withoutterminal success,noterminal success without effect |
| Unchanged / skip / preclassified orpost-rollback failure target | one journal revision only | business truth / material / source / capture | exact zero-business-effect count |
| collaboration repair target | external call beforelocal UoW；local capture bind whenneeded + Succeeded journal,orjournal-only observation | external owner transaction itself | local rollback leavesPlanned；external owner result does not fakejournal commit |
| final report | exact surface / shell / typed envelope + execution Finalized + idempotency Completed,one result ref | current truth scans、target effects、post-commit event collaboration | all final members visible or none |

Command / Consumer没有`CapabilityJobExecutionRecord`,因此它们只使用各自accepted effect + stored result + idempotency completion UoW。不得为了统一模板给它们创建empty Job journal。

### 63.3 Replay、collision与failure ownership audit

| scenario | required owner action | forbidden shortcut | result |
|---|---|---|---|
| same Completed Command | stored command shell / surface replay | reload current truth / rebuild response | pass |
| same Completed Consumer | typed receipt replay | rerun resolver / effect | pass |
| same Completed Job | variant-bound typed Job report replay | broad scan / report-by-run / generic decode | pass |
| same Reserved Job | exact journal resume | replan、append targets、current source substitution | pass |
| mismatch against Reserved / Completed | response classification only,existing unchanged | persisted conflict mutation、winner overwrite | pass |
| reserve race | rollback local initial UoW,discard local plan,classify winner | merge two plans / generated ids | pass |
| target local rollback | target remainsPlanned；optional typed no-effect terminalization onlyafterrollback | failure marker alongsidepartial effect | pass |
| final rollback | execution Planned + reservation Reserved；terminal targets retained | whole-run rollback claim | pass |
| stored result corrupt | consistency error | rerun business operation / reconstruct response | pass |

### 63.4 Eight-Job parity audit

| Job family | initial Planned journal | target terminal callable | final same-ref linkage | special invariant |
|---|---|---|---|---|
| capability registry reconciliation | yes | Reconciliation Succeeded / Preclassified Failed | yes | immutable report append + capture + success same target UoW |
| controlled consumer view refresh | yes | Created / Updated / Unchanged Succeeded orFailed | yes | Unchanged journal-only；no exposure truth repair |
| directory search / browse projection rebuild | yes | Created / Updated / Unchanged Succeeded orFailed | yes | exact frozen source chain |
| audit-friendly export preparation | yes | Created / Updated / Unchanged Succeeded orFailed | yes | body-free refs only；no evidence / acceptance truth |
| read-only ecosystem discovery rebuild | yes | Created / Updated / Unchanged Succeeded orFailed | yes | no marketplace listing write |
| derived material reconciliation | yes | Reconciliation Succeeded / Preclassified Failed | yes | report append-only,not mutable material state |
| external reference resolution refresh | yes | Updated / Unchanged Succeeded、terminal state Skipped、Preclassified Failed | yes | Invalid / Forbidden skip无resolver；canonical state exact revision |
| access-event collaboration repair | yes | EventCollaboration Succeeded orPreclassified Failed | yes | external status remainsPort-owned；local capture bind onlywhenplanned |

All eight flows use`Reserved + Planned`initial pair、per-target exact reload和`Completed + Finalized`same-ref final pair。No flow persists a conflict state,directly createsterminal target,orusespublic disposition asjournal state。

### 63.5 Pair arithmetic与matrix completeness

| matrix | variants | possible pairs | current | reserved | illegal | unclassified |
|---|---:|---:|---:|---:|---:|---:|
| idempotency | 2 | 2 | 1 | 0 | 1 | 0 |
| Job execution | 2 | 2 | 1 | 0 | 1 | 0 |
| Job target outcome | 4 | 12 | 3 | 0 | 9 | 0 |
| mechanical total only | 8 variant mentions across independent owners | 16 | 5 | 0 | 11 | 0 |

Formation edges are`reserve -> Reserved`,`plan -> Planned execution`and`target planned -> Planned outcome`;they are audited separately andnot counted asstate pairs。Parent Planned same-state target revisions、duplicate reads andcollision no-write branches likewiseexcluded frompair denominator。

### 63.6 Historical、boundary、Rustdoc与fabrication audit

| check | result |
|---|---|
| formal `02` overview `Reserved -> Conflict` vsactual flow | obsolete persisted capability;not copied；typed conflict classification andwinner preservation active |
| old formal `03` / README used asstate truth | no；historical material only |
| repository operation result merged withstate | no；`CapabilityIdempotencyReserveResult`kept ephemeral |
| Job public disposition merged withexecution state | no；onlyPlanned / Finalized |
| `CapabilityJobItemChange::Unchanged` merged withSkipped | no；Unchanged isSucceeded payload |
| runtime / tools execution state merged withJob journal | no |
| marketplace listing / governance approval / method asset truth merged withtechnical state | no |
| worker / scheduler / lease / attempt / retry counter added | no |
| new public struct / enum / field / variant / payload / callable / trait / Port | 0 |
| structure / field / variant payload English `///` omission | 0；relevant declarations逐项复核 |
| 43 HLD objects + 7 application helpers / 36 Ports / 83 protocols / 83 flows | unchanged |
| formal `03-详细设计.md` modified | no |
| implementation ledger / planned boundary skeleton created | no |
| implementation commit / real run_id / test result / evidence alias / acceptance signature | none |
| unresolved upstream blocker | 0 |
| current commit required | no |

### 63.7 Mechanical stop audit

| audit item | result |
|---|---|
| input read set complete | pass |
| three state owners separated | pass |
| formation callable / field shape | pass |
| every current edge hasexact Step 6 callable + Step 9 trigger | pass |
| reserved callable hasno fabricated flow | pass |
| terminal / same-state / no-op / payload immutability | pass |
| transaction membership / rollback / reentry | pass |
| same result ref across final owners | pass |
| 16 ordered different-state pairs classified | pass；unclassified=0 |
| test cuts handed toStep 16 withoutclaiming execution | pass |
| structure / field Rustdoc gate | pass；new declaration=0,existing relevant omission=0 |
| conflict marker / fence / table / trailing whitespace | checked in final command |

---

## 64. Batch `10.7` 完成结论与停审

| Gate | 结果 |
|---|---|
| 用户允许进入`10.7` | pass |
| §12第七行、§54~§58与Step 6 / 7 / 8 / 9 exact technical-state inputs已读 | pass |
| idempotency formation / current / reserved / terminal | pass；2 = 1 current + 0 reserved + 1 illegal |
| conflict classification | pass；no persisted variant/callable,mismatch / race preserveswinner |
| Job execution formation / all-terminal finalize | pass；2 = 1 current + 0 reserved + 1 illegal |
| target outcome formation / three terminal paths | pass；12 = 3 current + 0 reserved + 9 illegal |
| PreclassifiedFailure / Unchanged / Skipped distinction | pass |
| initial / per-target / final UoW与exact reentry | pass |
| same application result ref final linkage | pass |
| cross-state impossible relation / owner boundary | pass |
| Rustdoc / 结构注释门禁 | pass；new declaration=0,existing relevant omission=0 |
| controlled reopen / unresolved upstream blocker | none / 0 |
| 正式文档 / implementation artifact / commit | none |

```text
gate_status = 03_step_10_batch_10_7_completed_wait_user_review
completed_document = 03-详细设计.md
completed_step = Step 10 batch 10.7 idempotency + Job execution + Job target outcome state matrices
formal_document_written = false
unresolved_upstream_blocker = 0
next_allowed_action = start_03_step_10_batch_10_8_after_user_confirmation
commit_required = false
```

当前停在batch `10.7`。用户确认后只可进入`10.8`,并必须先读取:

1. 本文件§5~§13及§14~§64全部batch completion / pair arithmetic / controlled reopen结论;
2. Step 6 §15 state inventory与所有Step 10受控回开记录;
3. Step 7 completion gate、36 Ports与repository / external owner边界;
4. Step 8 cross-protocol closure / formal §7 draft与83 protocol inventory;
5. Step 9 final 83-flow coverage、cross-flow transaction / state / replay / phase audit与Step 10 handoff;
6. 正式`00 / 01 / 02`的capability identity、registry、adapter descriptor、governance / method seam、SDK exposure和runtime / marketplace非范围;
7. 旧正式`03`与README historical-material污染项。

`10.8`只执行final cross-state audit、historical audit、正式§9回填草稿与Step 11 handoff,完成后再次停审。不得提前进入Step 11、修改正式`03-详细设计.md`、创建implementation ledger / planned boundary skeleton或提交commit。

---

## 65. Batch `10.8` 输入、方法与最终边界

### 65.1 Exact输入复核

| 输入 | 已读取的final surface | 本批用途 |
|---|---|---|
| Step 10 §5~§64 | 24个state-like enum筛选、7个逐机batch、全部pair arithmetic / stop-review / controlled reopen | 建立全局inventory、pair closure与cross-state audit |
| Step 6 object contracts | §15 state subject inventory、43 HLD objects + 7 application helpers、所有Step 10 reopen记录 | 校验exact enum / variant、owner field、factory / member、terminal / nullable与Rustdoc |
| Step 7 Port contracts | 22 repository traits、36 Ports、`Loaded.expected_version`、current / history / affected indexes、UoW和fake / durable parity | 形成Step 11可直接承接的persistence / index / transaction清单 |
| Step 8 protocol contracts | 26 Command + 33 Query + 6 Inbound + 10 Outbound + 8 Job = 83 protocols、stored replay / capture / Job response schema | 校验状态暴露、result disposition与local/external owner隔离 |
| Step 9 function flows | 83 / 83 flow、final transaction / state / replay / phase audit、historical isolation | 校验每条current transition / no-op / side effect有actual trigger |
| 正式`00 / 01 / 02` | capability identity / registry / descriptor / governance-method seam / formal exposure / SDK exposure边界及runtime / marketplace非范围 | 防止最终矩阵越过正式上游owner |
| README、旧正式`03 / 05 / 06` | provider contract、allow/deny、cost、KMS/Vault、runtime gateway、marketplace等旧主线 | historical-material污染审计,不作为truth source |
| L1 Governance / Artifact参考 | final naming / trigger / test audit、handoff、回填草稿粒度 | 只参考结构,不复制领域状态 |

所有输入指向同一active基线:`43 HLD business objects + 7 application technical helpers + 36 application-owned Ports + 83 protocols / flows`。本批未发现需要重开Step 6 / 7 / 8 / 9的新缺口。

### 65.2 最终审计方法

本批使用以下两层审计,不能以数量闭合替代语义闭合:

1. mechanical closure:逐batch复算enum variant、ordered different-state pair、current / reserved / illegal分类和unclassified数;
2. semantic closure:逐owner审计exact name、formation、current callable / flow、reserved current-call count、terminal / same-state、precondition source、version / time、propagation class、test cut和external owner红线。

审计不重新展开638个pair形成第二套矩阵。若global audit与逐机矩阵冲突,必须回到对应§15~§62修正,不能在本节以汇总表覆盖。

### 65.3 状态主语最终分类

| class | count | exact subjects | final treatment |
|---|---:|---|---|
| local mutable state machine | 22 | identity、review、registry、descriptor、risk / secret summary、governance / method relation、exposure / visibility、trace / impact / feedback、4种material、canonical reference、capture、idempotency、Job execution / target | formal §9逐机保留状态集合、ASCII图、matrix、illegal/no-op、side effect和test handoff |
| external Port-owned boundary | 1 | `EventCollaborationStatus` | formal §9写external boundary matrix；不得本地持久化或复制到capture |
| immutable formation outcome | 1 | `ReconciliationReportState` | formal §9写factory outcome / immutable guard,不伪造transition |
| excluded non-state subject | multiple | refs / ids / reason / scope / digest、immutable change/snapshot/result、ephemeral read/result disposition、runtime/governance/method/SDK/marketplace/secret external truth | 只作guard / relation / result / owner boundary,不建global state |

`ReferenceResolutionValue`只有一个local owner和一份canonical current state。八张kind-specific矩阵是同一enum的policy subset,不是八个repository owner；机械pair只按八张矩阵分别审计业务适用性,不意味着持久化八份resolution truth。

### 65.4 Blocker、reopen与结构注释结论

| gate | result |
|---|---|
| unresolved upstream blocker | 0 |
| new Step 10 controlled reopen | none |
| previous Step 10 reopen | 9项全部resolved,见§70.3 |
| new public struct / enum / field / variant / payload / callable / trait / Port | 0 |
| structure / field / enum variant / variant payload English `///` omission | 0；本批只新增Markdown audit / assembly source |
| formal `03-详细设计.md` | unchanged |
| implementation ledger / planned boundary skeleton | not created |
| commit / run_id / test result / evidence alias / acceptance signature | none |

---

## 66. Global State Inventory and Pair Closure

### 66.1 Batch级算术总表

| batch | mutable / boundary matrix | exact enum variants in batch | possible ordered different-state pairs | current | reserved | illegal | unclassified |
|---|---:|---:|---:|---:|---:|---:|---:|
| `10.1` | 3 | 16 | 74 | 25 | 8 | 41 | 0 |
| `10.2` | 5 | 25 | 104 | 17 | 44 | 43 | 0 |
| `10.3` | 5 | 26 | 114 | 27 | 34 | 53 | 0 |
| `10.4` | 4 mutable + 1 immutable companion | 17 mutable + 5 immutable | 56 mutable | 42 | 12 | 2 | 0 |
| `10.5` | 1 canonical owner / 8 kind matrices | 7 per kind | 252 across kind policy matrices | 116 | 0 | 136 | 0 |
| `10.6` | 1 local + 1 external boundary | 2 + 5 | 22 | 7 | 0 | 15 | 0 |
| `10.7` | 3 application technical | 2 + 2 + 4 | 16 | 5 | 0 | 11 | 0 |
| total | 22 local + 1 external boundary | 111 active state-like variants inStep 6 inventory | 638 | 239 | 98 | 301 | 0 |

Arithmetic:

```text
possible = 74 + 104 + 114 + 56 + 252 + 22 + 16 = 638
current  = 25 + 17 + 27 + 42 + 116 + 7 + 5 = 239
reserved =  8 + 44 + 34 + 12 +   0 + 0 + 0 = 98
illegal  = 41 + 43 + 53 +  2 + 136 + 15 + 11 = 301
239 + 98 + 301 = 638
unclassified = 0
```

`10.5`的252 pairs是八个kind-specific policy矩阵总和；`10.6`的22 pairs是local capture 2与external boundary 20的机械和。二者都不创建cross-product state machine。`ReconciliationReportState`五个outcome只做formation audit,不进入mutable pair分母。

### 66.2 Formation、same-state与pair分母边界

| classification | 是否计入638 pair | required treatment |
|---|---|---|
| factory -> initial state | no | 每个factory outcome仍需exact input guard、field shape、first version/time和first persistence rule |
| transaction-local Draft / Pending -> first persisted final state | 只有enum内部direction按逐机口径计current；factory marker本身另审 | Draft / Pending不得单独save / expose / capture |
| accepted same-state field revision | no | 必须有actual field delta、member、version +1、history / capture规则；exact no-op分离 |
| exact same-state no-op / duplicate observation | no | member/save/history/capture/material/time update全部为0 |
| terminal same-variant payload replacement | no | 即使variant名相同也按terminal immutability拒绝 |
| current different-state edge | yes | exact Step 6 member / policy orStep 7 external callable + exact Step 9 trigger |
| reserved different-state edge | yes | current flow调用数0；future启用必须整体回开protocol / flow / transaction / test |
| illegal different-state edge | yes | stable invalid / policy / boundary / invariant rejection；zero mutation |

### 66.3 Coverage gate

| coverage item | result | evidence |
|---|---|---|
| 24 state-like enum全部分类 | pass | 22 local + 1 external boundary + 1 immutable outcome；类型数不变 |
| 111 active variants与Step 6一致 | pass | Step 10 `10.0` whitelist / usage差集和Step 13 controlled reopen同步 |
| 23 mutable / boundary subjects完成pair closure | pass | 22 local + 1 external；canonical reference owner展开8张kind-policy子矩阵；638 pairs,unclassified=0 |
| immutable outcome未伪造matrix | pass | `ReconciliationReportState` factory-only audit |
| excluded ref / DTO / marker / result未升级truth | pass | §5.2和§65.3 |
| global `CapabilityStatus / SystemState` | absent / forbidden | cross-object rules只写audit / UoW relation |

---

## 67. Cross-state Naming and Owner Audit

### 67.1 Exact enum name与HLD shorthand归一

正式`02`状态章节是概要输入,其中部分小写variant或组合短名不够精确。它们分类为`hld_shorthand_not_formal_ddd_name`,不阻塞Step 10,但不得原样进入正式§9:

| HLD shorthand / old expression | formal DDD name | rule |
|---|---|---|
| `CapabilityIdentityState::candidate / unresolved` | `CapabilityIdentityState::{Candidate, Unresolved}` | Rust variant大小写exact |
| `MethodRelationState` | `CapabilityMethodRelationState` | 禁止形成第二type alias / enum |
| `ConsumerViewFreshness` | `ConsumerViewFreshnessState` | Query / Job / test统一formal enum名 |
| `CapabilityReconciliationReport::inconsistent / rebuild_required / failed` | `ReconciliationReportState::{Inconsistent, RebuildRequired, Failed}` | report object与outcome enum分开 |
| `EventCollaborationState` | `EventCollaborationStatus` | external Port-owned status,不是local state object |
| `EventCollaborationStatus::candidate / pending_delivery / failed / handoff_unavailable` | `EventCollaborationStatus::{Candidate, PendingDelivery, Failed, HandoffUnavailable}` | exact variant spelling |
| generic `active / visible / formal_visible / ready / unavailable` | owner-qualified exact enum + variant | 不允许无owner状态名成为test / schema / migration label |

旧正式`03`中的`CapabilityDecision` allow/deny、provider contract active、runtime available、outbox retry等状态名没有formal mapping,全部historical-only,不得迁入新§9。

### 67.2 同名 / 近义状态owner矩阵

| word family | exact owners | semantic separation | forbidden inference |
|---|---|---|---|
| `Active` | identity、governance seam、method relation、formal exposure | identity可作为registry owner；seam / relation只证明local body-free relation；exposure只证明formal server boundary | 任一Active不等于governance approved、method published、runtime executable或SDK available |
| `Pending` / `*Pending` | registry VisibilityPending、seam / method formation Pending、exposure Pending、visibility Pending、trace HandoffPending、Job target Planned | 每个owner有不同guard / persistence；部分只transaction-local | 不得用一个pending column、status string或generic transition helper合并 |
| `Available / Unavailable` | risk / secret summary、visibility、consumer view/material、reference、external handoff status | safe-summary completeness、read availability、canonical observation和external handoff各自独立 | Unavailable不自动传播为另一owner Unavailable；只能经exact current flow / policy |
| `Stale` | secret summary、method relation、consumer/material、reference | summary/relation current routes多为reserved；material可actual propagation；reference是canonical truth | source Stale不允许repository trigger直接级联所有dependent state |
| `Partial` | risk summary、trace、impact / feedback、consumer view、audit / ecosystem material、report outcome | body-free completeness / gap / freshness / immutable outcome | Partial不等于failure,也不能被empty / missing silently替代 |
| `Failed` | reconciliation report、external collaboration、Job target payload / public Job disposition | immutable report outcome、external current status、local journal terminal payload、response marker | Job execution没有Failed state；idempotency Completed可指向Failed report |
| `Completed / Finalized` | reconciliation report outcome、idempotency、Job execution、public Job disposition | report formation、stored replay linkage、journal final link、public result各自分层 | Completed不等于business success；Finalized不等于all targets Succeeded |
| `Resolved / Unresolved` | canonical reference、identity、descriptor / relation | onlyreference iscanonical source observation；其他为local truth conclusion | reference Resolved不自动activate identity / relation / exposure |
| `Forbidden / Invalid` | reference candidate terminal、summary / relation candidate terminal、policy rejection | owner-specific rejected candidate / terminal value | 不得通过same object reason update、Job refresh或adapter fallback恢复 |
| `Retired / Replaced / Superseded / Removed` | owner-specific historical terminal | historical exact read保留,continuation使用new object / replacement relation | 不得generic reopen、upsert或current index命中 |
| `Ready / Visible / FormalVisible / Delivered / IntentBound` | material、formal visibility、registry、external collaboration、local capture | material freshness、server applicability、registry lifecycle、external delivery、local intent binding | 不形成全局“可用能力”,尤其不代表runtime execution / marketplace listing / SDK publication |

### 67.3 Owner authority audit

| state owner | only current mutation authority | read / external actors明确无权做什么 | result |
|---|---|---|---|
| core identity / registry / descriptor | exact Command application services + owner members / policies | Query、Consumer、Job、runtime、SDK、marketplace不得mutate / repair | pass |
| governance seam / method relation | exact attach / replace / expire / remove Commands | inbound只更新ref/state与follow-up；不改external approval / asset truth | pass |
| exposure / visibility | four exposure Commands；visibility target由policy独占派生 | registry public route不能请求FormalVisible；consumer/view/runtime不能反写 | pass |
| trace / impact / downstream summary | exact Commands / Consumer withbody-free typed input | downstream failure不能回滚source；audit handoff不能形成evidence / acceptance | pass |
| material / report | source propagation + exact Jobs；report append-only | Query no-write；Job不修core truth；listing / evidence不形成 | pass |
| canonical reference | reference Commands / Consumers / refresh Job viaone owner repository | resolver raw result不是truth；state change不直接修dependent truth | pass |
| local capture | source UoW factory + facade / repair Job bind | external delivery status不复制；worker/adapter不重建payload | pass |
| external collaboration | external Port owner via collaborate / repair | local repository不保存status；Delivered不改capture state | pass |
| idempotency / Job journal | application shared write / Job service | repository不做business classification；runner / scheduler无hidden progress truth | pass |

---

## 68. Trigger, Reserved, Illegal, Error, and Test Audit

### 68.1 Current transition trigger closure

| audit axis | requirement | result |
|---|---|---|
| local current edge | exact Step 6 owner factory/member/policy + exact Step 9 flow | pass for all239 batch-counted current edges |
| external current edge | exact Step 7 collaboration Port operation / owner direction + Step 9 facade / repair observation | pass for6 external edges；local capture edge separately closed |
| repository save | only persists already-validated owner result | no repository-only transition accepted |
| same-state accepted revision | actual field delta + exact member + version/time/history rule | pass；registry binding/basis、visibility reevaluation、trace handoff、material refresh、reference reason revision等逐机分开 |
| no-op | current value + exact fields/reason already equal oralready stale | zero member/save/id/history/capture/material/time mutation |
| cross-owner transition | each owner member called explicitly inapplication flow | no DB trigger、cascade、mapper、fake-private state orchange-kind parsing |

All current state effects canbeclassified bythe five formal propagation rules from§9.2；wherean individual row doesnot printthe class token,its UoW / phase column still fixes the same semantics。No current row relies onimplementation-created helper、string status、repository conditional orold formal`03` flow。

### 68.2 Reserved edge and callable gate

| reserved category | examples | current boundary rule | final result |
|---|---|---|---|
| callable exists,no protocol / flow | identity activate、review invalidate、descriptor retire / degrade、safe-summary mutation、relation recovery / forbid、visibility / trace / impact / feedback reserved members、material Rebuilding / Unavailable helpers | Step 9 invocation count=0；future activation reopens Step 8 / 9 / 10 andlater tests；idempotency conflict不属于此类 | pass |
| HLD direction,no same-layer callable | identity cross-degraded direction、safe-summary recovery等 | remainsreserved_not_callable；repository / adapter不得补 | pass |
| transaction-local source | registry Draft、descriptor Draft、relation Pending等 | no standalone current persistence / Query / capture unlessformal future direction opens | pass |
| reserved same-state callable | view/material reserved markers、feedback revisions、Job `record_run_issue` | current integration call count=0；object unit guard可测,不得声称current reachability | pass |
| external future behavior | no additional external collaboration edges beyondsix owner directions | adapter physical capability不扩大matrix；Candidate / Delivered repair拒绝 | pass |

98条reserved different-state edge全部保持未被current flow调用。Reserved source若出现在repository current index,只能按逐机明确subset读取；不得因“可读取”推断“可由current service生成”。

### 68.3 Illegal / terminal / error gate

| illegal class | state effect | side effect | current error owner | downstream handoff |
|---|---|---|---|---|
| enum different-state illegal pair | zero field / version / time mutation | no truth save、history、trace、capture、material、result | domain invalid transition / policy / boundary / invariant category | Step 12 exact variant / public mapping |
| terminal reopen / terminal-to-terminal rewrite | zero | no update / delete / upsert | owner guard | new object / formal replacement only |
| same-state exact no-op | zero | either stable no-op result/rejection perflow,neverfake history | application guard | Step 12 result mapping；Step 13 duplicate priority |
| expected-version conflict | persisted winner unchanged | staged UoW rollback | persistence / application conflict | Step 11 isolation + Step 13 retry/race |
| owner / ref / state / payload asymmetry | zero accepted local effect | explicit consistency error；no fallback scan / reconstruction | application / persistence invariant | Step 11 constraints + Step 12 error |
| external outcome afterlocal rollback | local state unchanged | external owner may retain outcome,但no fake local success | application recovery | Step 13 exact idempotent reentry |

304条illegal different-state edge全部有zero-mutation处理；exact error enum / HTTP / event / Job surface仍由Step 12拥有。本Step没有伪造最终error code。

### 68.4 Test / acceptance naming handoff

Step 16、后续`05-测试方案.md`和`06-验收标准.md`必须使用本文件exact type + variant,不得使用HLD小写、旧`ProviderContract / CapabilityDecision`状态或无owner的`active / ready / failed`。最低测试维度:

| dimension | required cuts |
|---|---|
| formation | each accepted factory outcome、rejected initial canonical value、transaction-local state not persisted |
| current edge | every current direction至少positive owner/member/flow case；multi-source edge按exact source guard覆盖 |
| reserved | callable / route integration invocation count=0；future-only source不得被fake adapter放行 |
| illegal / terminal | every grouped illegal source-target set、same-variant terminal payload overwrite、new-object recovery |
| same-state / no-op | actual delta version +1 vs exact no-op all effects 0 |
| transaction | truth / sidecar / capture / material / result rollback injection；Job initial / target / final UoW |
| expected version / fake parity | only`Loaded.expected_version`;durable/fake same uniqueness、current index、ordering、conflict |
| owner negative | Query no-write、Consumer no-core-truth、Job no-core-truth-repair、external no-local-status、runtime / SDK / marketplace / governance / method body call count=0 |
| replay / reentry | exact stored result only、missing/corrupt no rerun、target terminal skip、capture same candidate / intent |
| structure comments | any later public struct / field / enum / variant / payload / callable English `///` completeness |

No test has been executed inStep 10；all rows arefuture design obligations only。

---

## 69. Cross-state Propagation, Transaction, and Consistency Audit

### 69.1 Five propagation classes

| class | allowed use | atomic / phase rule | forbidden interpretation |
|---|---|---|---|
| `same_uow_local_required` | source truth + required local fact / history / trace / capture / stored result | all declared local participants commit or rollback together | database trigger / eventual repair may fill missing sidecar |
| `same_uow_actual_stale` | accepted source revision affects indexed current non-stale view/material | collect typed union before mutation；each eligible material one versioned revision + capture；already-stale no-op | full-table scan、immutable report mutation、blind all-material update |
| `post_commit_body_free_collaboration` | official local snapshot/capture aftersource commit；audit / event external handoff | external call afterlocal commit；failure never rolls back orrewrites local truth | outbox/product implementation、local Delivered status、acceptance proof |
| `async_follow_up_hint_only` | typed follow-up / review / report signals whose target owner isnot mutated in current flow | current UoW stores onlydeclared hint / safe result | hidden Consumer / Job core truth repair |
| `explicit_no_propagation` | state change / observation hasno declared second-owner effect | no implicit state / history / capture / material effect | repository cascade oradapter side effect |

If a future Step 11 schema cannot implement the declared class,that is a design blocker requiringStep 7 / 9 / 10 reopen；Step 11 cannot silently downgrade atomicity or invent eventual compensation。

### 69.2 Cross-owner state relation matrix

| source / scenario | exact same-UoW owners | later / external owner | prohibited coupling |
|---|---|---|---|
| establish identity | source ref/state whennew、final identity、Recorded review、records / trace / captures、actual materials、stored result / completion | post-commit collaboration | governance approval / runtime allow |
| descriptor / relation change | descriptor orrelation + optional ref/state + registry actual delta + own histories / traces / captures + material union | post-commit collaboration；future exposure reevaluation onlythroughCommand | direct exposure activation、method/governance body write |
| exposure / visibility | final exposure、source-version-symmetric visibility、actual registry delta、histories / traces / captures / material union、result | collaboration aftercommit | registry public FormalVisible、consumer/runtime reverse write |
| source truth / canonical reference propagation | source revision + all actual stale material revisions/captures + result | rebuild Jobs later consume stale objects | reconciliation / Query repairs truth |
| trace handoff | one final trace revision + local result/completion | optional audit handoff post-commit | external failure rewrites trace / acceptance |
| event source | source revision + immutable snapshot + Captured record | external collaborate,thenlocal intent bind inshort UoW | pre-commit publish、payload rebuild、delivery state copy |
| Job target changed success | one exact material/report/reference/capture-bind effect + matching snapshot/capture + Succeeded journal revision | post-commit collaboration whenflow declares | target success withouteffect or effect withoutsuccess |
| Job target no-effect terminal | journal-only Succeeded Unchanged / Failed / Skipped | none | fake business revision、capture或id |
| Job final | typed response + shell/surface/envelope + Finalized journal + Completed reservation,one result ref | duplicate replay later | current truth scan、target mutation、whole-run rollback claim |

### 69.3 Impossible / consistency-error cross-state combinations

| combination | handling |
|---|---|
| identity non-Active used fornew registry / exposure prerequisite | policy / state rejection,zero accepted effect |
| registry FormalVisible withoutfinal exposure Active + visibility Visible same source revision | consistency defect；nevernormalize |
| exposure Active withvisibility non-Visible afteraccepted exposure UoW | impossible accepted pair；rollback / persistence error |
| descriptor / relation current index returns terminal history | persistence/index defect；do notattach duplicate orselect fallback |
| canonical ref object state id != current state id / subject / kind | consistency error；do notrepair withinitial factory |
| material indexed hit missing exact current object / source marker | consistency error；source owner UoW rollback |
| local capture IntentBound withoutintent orCaptured withintent | invariant error；do notinfer external status |
| external item intent / source / outcome asymmetry | Port/application consistency error；no local bind / journal success |
| idempotency Completed withoutmatching immutable stored result | consistency error；neverrerun operation |
| idempotency Completed + Job execution Planned、Reserved + Finalized、Finalized + Planned target、different final result refs | impossible accepted relation；adapter detects,does notnormalize |

### 69.4 UoW and phase closure

| transaction class | current closed membership | Step 11 remaining work |
|---|---|---|
| Command / Consumer accepted UoW | owner truth / ref / state、change / trace、actual stale material、snapshot/capture、typed stored result / receipt、idempotency completion accordingtoexact flow | physical ordering、isolation、constraint timing、rollback visibility |
| Outbound source UoW | exact committed source + immutable payload snapshot + initial Captured record | table/collection shape、unique `(source,schema)` constraint、insert ordering |
| facade bind UoW | one Captured -> IntentBound expected-version save afterexternal outcome | same-intent race / lock behavior handed toStep 13,physical write toStep 11 |
| Job initial UoW | fresh Reserved + complete Planned journal / all Planned targets + initial run issues | normalized-key uniqueness、initial version allocation、visibility |
| Job target UoW | exact target effect/capture + one terminal journal outcome,orjournal-only no-effect terminal | physical save order、optimistic conflict / rollback visibility |
| Job final UoW | typed stored Job report + journal Finalized + reservation Completed withsame ref | insert/update order、constraints、crash visibility |
| post-commit external phase | event collaboration / audit handoff only | no distributed transaction；recovery selection/index/config later |

---

## 70. Historical-material and Controlled-reopen Audit

### 70.1 Historical pollution matrix

| material | conflicting old subject | active replacement / treatment | final result |
|---|---|---|---|
| `README.md` | Provider Contract、LLM route、whitelist、cost、KMS / Vault、runtime must-pass hub、old source tree | onlyL3 integration-center / MCP-A2A-external API clues survive afterformal upstream validation | isolated |
| old formal `03-详细设计.md` | `ProviderContract`、`CapabilityDecision`、`CostRecord`、`QueryCapabilities`、provider secret/quota/route、policy refresh、runtime gateway、marketplace metadata | diagnostic input only；new state truth solely fromSteps 6 / 9 / 10 | isolated |
| old formal `05-测试方案.md` | provider / allow-deny / cost / KMS / runtime test chain andclaimed evidence assumptions | historical until`05` full-restart；cannot nameStep 10 states orclaimresults | isolated |
| old formal `06-验收标准.md` | old acceptance subject / signoff / evidence path | historical until`06` full-restart；no acceptance fact entersstate | isolated |
| restart-predecessor calibration | obsolete object / Port / flow / count snapshots | current full-restart Step files + calibration flow + project ledger areonlyrecovery source | isolated |
| formal`02` lowercase / combined status shorthand | `MethodRelationState`、`ConsumerViewFreshness`、`EventCollaborationState`、lowercase variants | mapped toexact Step 6 names in§67.1；not copied verbatim toformal§9 | classified_non_blocking |

No old state,route,repository,topic,outbox,worker retry,quota,cost,secret-store orruntime execution flow is imported merely because an old document names it。

### 70.2 Critical owner-boundary audit

| boundary | allowed inCapability Hub | forbidden merge | result |
|---|---|---|---|
| capability identity / registry | local access identity、registry lifecycle、descriptor binding / visibility basis | runtime invocation、tools execution、global allow/deny | pass |
| external MCP / A2A / API | body-free identity / reference / descriptor / safe boundary | session、request / response、execution result、provider health owner | pass |
| governance | body-free result ref / safe summary / seam relation | approval、Policy / shared_rules、workflow truth | pass |
| method-library | body-free asset ref / scope / relation | method body、source、version / publication / execution lifecycle | pass |
| SDK | consumer ref、server formal exposure / controlled view | package、generated client、cache / publication state | pass |
| marketplace / ecosystem | read-only discovery summary | listing、ranking、pricing、transaction、fulfillment | pass |
| runtime / tools | body-free consumer reference / controlled view / impact handoff | invocation、tool result、route/quota/cost、enforcement truth | pass |
| secret / document / audit | opaque refs、canonical state、safe summary / body-free export | secret/document/raw audit body、KMS/Vault action、real evidence / acceptance | pass |

### 70.3 Step 10 controlled-reopen closure

| blocker id | closed subject | final status |
|---|---|---|
| `CH-DDD-S10-GOVERNANCE-SEAM-REPLACED-001` | old relation historical `Replaced` terminal variant / member symmetry | resolved in`10.0` |
| `CH-DDD-S10-IDENTITY-REGISTRY-CALLABLE-001` | identity initial mapping andregistry actual transition guards / Draft reachability | resolved in`10.1` |
| `CH-DDD-S10-DESCRIPTOR-SUMMARY-REACHABILITY-001` | descriptor replacement / retirement andrisk factory mapping | resolved in`10.2` |
| `CH-DDD-S10-RELATION-CURRENT-INDEX-001` | governance / method current degraded relation andterminal exclusion | resolved in`10.2` |
| `CH-DDD-S10-EXPOSURE-VISIBILITY-APPLICABILITY-001` | typed applicability、policy-only target、normalization / source symmetry | resolved in`10.3` |
| `CH-DDD-S10-TRACE-REVISION-INVARIANT-001` | trace gap / superseded field clearing | resolved in`10.3` |
| `CH-DDD-S10-CONSUMER-VIEW-PARTIAL-REBUILD-GUARD-001` | structured partial kinds、final-only material save、reserved helper guards | resolved in`10.4` |
| `CH-DDD-S10-REFERENCE-SAME-VALUE-COMMAND-001` | same value + changed reason actual revision parity | resolved in`10.5` |
| `CH-DDD-S10-EVENT-CAPTURE-TRACE-OWNERSHIP-001` | capture five-tuple vs snapshot-owned trace / bytes | resolved in`10.6` |
| `CH-DDD-S10-REPOSITORY-COUNT-001` | Step 7 exact repository trait count was summarized as 23 in the Step 10 handoff | corrected in`11.0` pre-entry to 22; no trait, method, Port, object or flow change |

Batch `10.7` and`10.8` required no semantic controlled reopen。The Step 10 pre-entry audit corrected one handoff count typo: Step 7 has 22 repository traits and 36 Ports. All active Step 6 / 7 / 8 / 9 counts andRustdoc gates remainconsistent afterthe ten documented corrections。

### 70.4 Fabrication / artifact audit

| check | result |
|---|---|
| implementation source ormigration modified | no |
| formal `03-详细设计.md` modified | no |
| implementation execution ledger created | no |
| planned boundary skeleton created | no |
| implementation commit / commit hash claimed | no |
| real run_id / test result claimed | no |
| real evidence alias / acceptance signature claimed | no |
| external collaboration delivery success claimed | no |
| unresolved upstream blocker | 0 |
| commit required now | no |

---

## 71. Step 11~16 and Step 19 Handoff

### 71.1 Step 11 persistence / transaction hard input

Step 11必须从本表逐项闭合physical schema / collection / index / constraint / transaction,不得把状态语义后移给adapter实现:

| persistence family | mutable / immutable owners | required key / index / version semantics | required transaction / consistency closure |
|---|---|---|---|
| identity / review / registry | threeversioned owners | identity key current uniqueness；review / registry current-by-identity terminal exclusion；exact/history read；`Loaded.expected_version` | create/update/replacement/retirement atomic withmatching records / trace / capture / materials / result |
| descriptor / summaries | descriptor、risk summary、secret safe summary | current descriptor byentry；current risk bydescriptor；secret summary byref / descriptor；terminal history exclusion | new/old summary + descriptor attachment / replacement andactual registry delta atomic |
| governance / method relation | two versioned relation owners | onecurrent non-terminal relation peridentity；degraded current included；terminal history excluded | ref/state + new/old relation + records/traces/captures/material union atomic |
| exposure / visibility | two versioned owners | current exposure byregistry；current visibility byexposure；source exposure version parity | final normalized exposure + final visibility + actual registry delta same UoW |
| change / trace / impact / feedback | six immutable change families、append-revision trace、two versioned impact owners | change append-only；trace exact revision + current highest revision / expected previous；impact bytrace / consumer；feedback source-event uniqueness | source / record / trace / impact / feedback/capture/result membership fromexact flows |
| controlled view / derived material | view + directory / audit / ecosystem mutable materials；reconciliation immutable report | current compound owner indexes；truth/reference affected indexes；stable pagination / typed union；report append-only | collect-before-mutate snapshot semantics；each material own expected version；changed target atomicity |
| external ref / canonical state | 8 typed ref variants behindone union + onecanonical state owner | kind+candidate digest uniqueness；onecurrent state per subject；state-id / subject / kind parity；non-resolved scan | ref + initial state same UoW；actual state revision + capture + affected materials + result atomic |
| event snapshot / capture | insert-only payload snapshot + versioned capture | `(source_ref,schema_ref)` unique；snapshot id / schema / digest / captured time parity；AwaitingIntent index；snapshot neverupdate/delete | source + snapshot + Captured atomic；bind expected-version UoW；repair bind + journal success target UoW |
| idempotency / stored result | versioned reservation + insert-only shell / surface / typed envelopes | normalized key atomic absent reserve；result ref insert-only；shell/surface/envelope symmetry | Command / Consumer accepted UoW；mismatch winner unchanged；Completed nevervisible withoutresult |
| Job journal | oneversioned journal bynormalized idempotency key | complete immutable plan、ordinal/ref uniqueness、latest expected version、terminal payload immutable；no run / target alternate index | initial Reserved+Planned；per-target effect+terminal；final stored report+Finalized+Completed exact UoWs |
| external collaboration status | no local status store | external Port ref/source/status parity only | no distributed transaction；local capture keepsopaque intent only |

Step 11 must also close:

1. physical save order andconstraint timing inside each declared UoW;
2. isolation / read snapshot needed bymulti-subject affected-index collect-before-mutate;
3. exact table/collection mapping forappend-only vsversioned vsinsert-only objects;
4. current / history / affected / scope indexes andstable cursor semantics withoutfull-body scan;
5. durable / fake parity forunique keys、terminal exclusion、expected version、ordering、missing/asymmetry failures;
6. rollback / crash visibility forsource-capture、Job initial / target / final andstored replay atomic sets;
7. explicit absence ofdatabase trigger / cascade thatcreatesundeclared state transitions。

If any required index / constraint cannot beimplemented throughcurrent Step 7 surface,Step 11 must record a blocker andcontrolled-reopen Step 7 / affected Step,not inventprivate finder orfake-map scan。

### 71.2 Later detailed-design Step handoff

| later Step | required input fromStep 10 | must not silently change |
|---|---|---|
| Step 12 error / recovery | invalid / policy / boundary / consistency categories、terminal / no-op、missing stored result / snapshot、external-after-local-failure branches | exact state set / pair classification；no error-text parsing或fake owner result |
| Step 13 concurrency / idempotency | `Loaded.expected_version`、atomic reserve、same/different digest、stored replay authority、capture bind / collaboration reentry、Job three-phase journal | no duplicate rerun、current-truth reconstruction、terminal overwrite或persisted conflict state |
| Step 14 config / external binding | logical resolver / handoff / collaboration / runner seams anddegraded states | no config-created domain transition、fake success、topic/outbox product backport |
| Step 15 observability / audit | transition / rejection / rollback / post-commit phase refs andsafe reasons | no raw body、evidence alias、acceptance fact或external owner status copy |
| Step 16 tests | §15~§62 per-machine cuts + §68.4 global cuts | no claim thattests alreadyran；exact enum spelling only |
| Step 17 implementation handoff | 22 local + 1 external + 1 immutable inventory、43/7/36/83 baseline、state-to-owner / repository / flow index | no implementation ledger / planned boundary skeleton before`07` completion |
| Step 19 formal assembly | §72 formal§9 source andall§15~§62 exact matrices | no patch inheritance fromold formal`03`;noHLD shorthand ormatrix compression |

### 71.3 Step 11 start read set

Afterexplicit user confirmation,Step 11 must read:

1. detailed-design SOP Step 11 andwriting standard §5.10;
2. this file §65~§73 plus§15~§62 exact matrices;
3. Step 6 current object/helper contracts、state-dependent field invariants andallcontrolled reopen records;
4. Step 7 §8~§13 repositories、UoW manager、fake/durable parity andcompletion gate;
5. Step 8 stored result / receipt / Job report / event snapshot schemas andcross-protocol closure;
6. Step 9 shared write guards、all83 flow transaction tables、Job initial / target / final UoWs andfinal audit;
7. formal`01` data ownership / consistency andformal`02` §8~§12 handoff;
8. global standards forStep 11 truth-source closure。

---

## 72. Formal `03-详细设计.md` §9 Assembly Source

### 72.1 Assembly authority and non-compression rule

Formal §9 atStep 19 must beassembled onlyfrom:

- §5~§10 forscreening、family、inventory、callable / propagation common rules;
- §15~§62 forper-machine exact state set、ASCII graph、matrix、illegal/no-op、side effects、test cuts;
- §66~§70 forglobal pair、name、owner、reserved、propagation andhistorical closure;
- current Steps 6 / 7 / 8 / 9 forfull signatures / flow links;
- formal`02` §9~§10 onlyforHLD intent afterapplying§67.1 exact-name mapping。

Formal assembly must not reduce the22 local state machines、one external boundary andeight canonical-reference kind submatrices tooneglobal summary table,orreplaceper-machine guards / side effects withlinks only。Each local mutable state machine andthe external boundary must retainatleast:

1. exact owner object / state field / enum set;
2. oneASCII formation / current / terminal graph;
3. current / reserved / illegal transition matrix withStep 6 callable + Step 9 flow;
4. same-state revision / exact no-op andterminal rules;
5. field / version / time andtransaction / propagation effects;
6. illegal error category andStep 12 handoff;
7. Step 16 test cuts / negative owner boundary。

### 72.2 Required formal chapter structure

```markdown
## 9. 状态机与转换矩阵

> 校准来源:
> - `design-calibration/03_ddd_step_06_object_contracts.md`
> - `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`
> - `design-calibration/03_ddd_step_09_function_flows.md`
> - `design-calibration/03_ddd_step_10_state_matrix.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“状态主语筛选”“Exact 状态机 Inventory”“逐状态机矩阵”“Global State Inventory and Pair Closure”“Cross-state Naming and Owner Audit”“Step 11~16 Handoff”小节,了解状态如何从对象和函数级 flow 收敛到可实现矩阵。

### 9.1 状态主语筛选与通用规则
#### 9.1.1 22 local + 1 external + 1 immutable inventory
#### 9.1.2 formation / current / reserved / illegal / terminal / no-op规则
#### 9.1.3 owner、version、history、capture和五类propagation规则

### 9.2 Identity / Review / Registry
#### 9.2.1 `CapabilityIdentityState`
#### 9.2.2 `CapabilityAccessReviewFactState`
#### 9.2.3 `RegistryLifecycleState`

### 9.3 Descriptor / Safe Summary / Governance-Method Relation
#### 9.3.1 `AdapterDescriptorState`
#### 9.3.2 `DescriptorRiskConstraintSummaryState`
#### 9.3.3 `SecretHandlingSafeSummaryState`
#### 9.3.4 `GovernanceSeamState`
#### 9.3.5 `CapabilityMethodRelationState`

### 9.4 Formal Exposure / Visibility / Trace / Impact
#### 9.4.1 `FormalExposureState`
#### 9.4.2 `FormalVisibilityState`
#### 9.4.3 `TraceabilityState`
#### 9.4.4 `CapabilityImpactState`
#### 9.4.5 `DownstreamImpactSummaryState`

### 9.5 Controlled View / Derived Material / Immutable Report
#### 9.5.1 `ConsumerViewFreshnessState`
#### 9.5.2 `DirectoryProjectionState`
#### 9.5.3 `AuditExportState`
#### 9.5.4 `EcosystemDiscoveryState`
#### 9.5.5 immutable `ReconciliationReportState` formation

### 9.6 Canonical External-reference Resolution
#### 9.6.1 one `ReferenceResolutionValue` owner and common rules
#### 9.6.2 ExternalCapabilitySource / GovernanceResult / MethodAsset / Secret
#### 9.6.3 ExternalDocument / RuntimeToolsConsumer / SdkConsumer / ObservabilityAudit

### 9.7 Event Capture and External Collaboration
#### 9.7.1 local `CapabilityEventCaptureState`
#### 9.7.2 external Port-owned `EventCollaborationStatus`
#### 9.7.3 source UoW / post-commit / repair cross-owner rules

### 9.8 Application Technical States
#### 9.8.1 `CapabilityIdempotencyState`
#### 9.8.2 `CapabilityJobExecutionState`
#### 9.8.3 `CapabilityJobExecutionTargetOutcome`
#### 9.8.4 stored replay andsame-result-ref final linkage

### 9.9 Forbidden Transitions and Cross-state Audit
#### 9.9.1 638-pair closure andreserved current-call gate
#### 9.9.2 owner-qualified naming andHLD shorthand mapping
#### 9.9.3 impossible cross-state relations
#### 9.9.4 query / consumer / job / external owner negative boundaries
#### 9.9.5 Step 11~16 handoff
```

### 72.3 Formal per-machine minimum content index

| formal group | calibration source | pair / companion baseline |
|---|---|---|
| §9.2 identity / review / registry | §§15~18 | 74 pairs |
| §9.3 descriptor / safe summary / relations | §§20~26 | 104 pairs |
| §9.4 exposure / visibility / trace / impact | §§28~34 | 114 pairs |
| §9.5 mutable materials / immutable report | §§36~42 | 56 mutable pairs + 1 immutable formation table |
| §9.6 canonical reference | §§43~53 | 252 kind-policy pairs / one canonical owner |
| §9.7 capture / collaboration | §§54~58 | 2 local + 20 external pairs |
| §9.8 application technical | §§59~64 | 16 pairs |
| §9.9 final audit | §§65~71 | 638 total / 239 current / 98 reserved / 301 illegal / 0 unclassified |

### 72.4 Formal writing gates

| gate | required result |
|---|---|
| exact names | onlyStep 6 enum / variant names；apply§67.1 mapping,neverHLD lowercase asformal code name |
| callable links | full signature orunambiguous Step 6 / 7 callable + exact Step 9 flow |
| diagrams | ASCII only；oneperstate machine,external boundary separate |
| error | stable category here,exact Step 12 variant / mapping aftercompletion |
| persistence | onlylogical UoW / expected-version membership fromthisStep；physical schema must citecompletedStep 11 atassembly time |
| tests | future cuts only；must citecompletedStep 16 atassembly time,no fabricated result |
| source links | everyformal subsection citescalibration source andkeepsimplementation-critical content inbody |
| historical | no old formal`03` section / state / route / object copied |
| process material | no batch status / stop-review / pair-work arithmetic narration exceptfinal audit facts useful toimplementation |

This draft isassembly source only。Formal `03-详细设计.md` remainsunchanged untilStep 19。

---

## 73. Step 10 Completion Gate and Stop-review

### 73.1 SOP completion conditions

| condition | result | evidence |
|---|---|---|
| state subject screening excludesnon-state objects | pass | §5 / §65.3 |
| state family grouping andowner boundary | pass | §6 / §67 |
| state set table for everyaccepted subject | pass | §§15~62 |
| ASCII state graph perstate machine | pass | §§15~62；external boundary separate |
| transition matrix / illegal handling | pass | 22 local + 1 external subject；canonical reference展开8 kind-policy submatrices；638 pairs classified |
| exact trigger / precondition / side effect | pass | allcurrent rows map Step 6/7 callable + Step 9 flow |
| reserved directions notcalled | pass | 98 different-state edges + reserved same-state callables current call count=0 |
| terminal / same-state / no-op | pass | per-machine stop reviews + §68 |
| cross-state naming / trigger / test audit | pass | §§67~69 |
| historical / owner redline | pass | §70 |
| formal§9 assembly source | pass | §72；notwritten toformal document |
| Step 11~16 handoff | pass | §71;Step 13 controlled reopen synchronized the two-state idempotency surface |
| unresolved conflict / blocker | 0 | no newreopen required |

Step 10 entering-next-step condition ismet:

```text
state subjects screened
22 local mutable state machines complete
1 external Port-owned boundary complete
1 immutable outcome formation audit complete
111 active state-like variants classified
638 ordered different-state pairs = 239 current + 98 reserved + 301 illegal
unclassified = 0
all per-machine stop reviews = pass
cross-state naming / trigger / test audit = pass
unresolved upstream blocker = 0
```

### 73.2 Artifact / truthfulness gate

| check | result |
|---|---|
| formal `03-详细设计.md` modified | no |
| Step 11 file created | no |
| implementation code / migration modified | no |
| implementation ledger / planned boundary skeleton created | no |
| commit created / requested | no |
| run_id / test execution / evidence / acceptance claimed | no |
| new Rust declaration / structure-comment risk | none；new declaration=0,Rustdoc omission=0 |

### 73.3 Recovery point

```text
gate_status = 03_step_10_completed_with_step_13_controlled_reopen
completed_document = 03-详细设计.md
completed_step = Step 10 state machines and transition matrices
completed_batch = 10.8 final audit / Step 13 two-state sync / formal §9 assembly source / Step 11 handoff
formal_document_written = false
unresolved_upstream_blocker = CH-DDD-S13-CORE-IDEMPOTENCY-CANONICAL-001
next_allowed_action = remain_at_03_step_13_until_upstream_accessor_contract_is_closed
commit_required = false
```

Step 10的状态矩阵已完成Step 13受控同步，但Step 13整体仍受L0-core canonical accessor blocker阻塞；Step 11原有内容只作为已完成上游输入，不因本次同步重新创建。不得修改正式`03-详细设计.md`、创建implementation ledger / planned boundary skeleton或提交commit。
