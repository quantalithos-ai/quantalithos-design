# Step 7 分件 B. 跨仓同步、逐协议停审与总审

> 父Step: `06_acceptance_step_07_interfaces_events_sync.md`
> 协议登记分件: `06_acceptance_step_07_protocol_trace_register.md`
> 对应SOP: `standards/document/验收标准讨论流程_SOP.md` Step 7
> 生成日期: 2026-07-15
> 状态: completed_reviewed_passed_to_step_8
> 本分件口径: 固定跨仓依赖类型、同步成功 /失败、下游未就绪裁决,并对`PG-SBX-001~055`执行item-level设计停审和跨接口总审。`PassDesign`只表示验收设计七维闭合,不是runtime Pass、测试结果、验收review、风险接受或签署。

---

## 1. 停审方法与结论词汇

每个协议检查七个维度:

| 维度 | `PassDesign`条件 |
|---|---|
| P 正式协议 | formal protocol name、逻辑surface和协议族与正式`03`一致,无旧名 /旁路入口 |
| F 字段与surface | request / selector / envelope / payload / spec及result / view / receipt / report字段可定位,未由`06`发明 |
| D 依赖与协作 | compile / runtime / event / handoff / downstream类型正确,没有跨仓源码依赖误要求 |
| T 测试来源 | 至少一个正向和关键负向TC可定位,共用负向适用关系清楚 |
| E 证据来源 | planned ESLOT、future EV form、source role、suite、report和case path固定,未把slot当实例 |
| U 不可用裁决 | required seam缺失、formal unavailable branch和未激活真实下游分别有Blocked / Fail / PassDesign / conditional边界 |
| B 职责边界 | 不拥有tools semantics、runtime loop、member lifecycle、artifact / observability / policy / investigation truth,不吞并Step 8~11 |

结论词汇:

| 词汇 | 含义 |
|---|---|
| `PassDesign` | P / F / D / T / E / U / B七维设计完整,允许等待真实实现与执行 |
| `DesignBlocked` | 正式协议、字段、依赖类型或测试 /证据设计本身缺失,必须先回写上游 |
| `ExecutionBlocked` | 设计完整,但目标仓、harness、fixed source、candidate或真实环境缺失 |
| `ConditionalNotActivated` | 非当前P0送验范围的真实下游 / real-like集成未激活 |

当前55项均为`PassDesign`;用户已明确确认Step 7并放行Step 8,但这不改变项目真实状态`NotEntered`,也不创建任何runtime review签署或结果实例。

### 1.1 本分件证据缩写

下列缩写只用于压缩停审表宽度。正式artifact必须保存完整`ESLOT-SBX-*`、future `EV-SBX-*`、source role、suite和report path;不得保存缩写。fixed source / report全称以父Step §9.2及协议登记分件§1.3为准。

| 缩写 | 正式含义 |
|---|---|
| `P01~P10` | 依次指`ESLOT-SBX-001 CONTRACT`至`ESLOT-SBX-010 REPLAY`;future EV三位后缀与slot一致 |
| `P15` / `P16` | `ESLOT-SBX-015 AUDIT` / `ESLOT-SBX-016 ARCH` |
| `P17~P19` | `ESLOT-SBX-017 QUAL-BOUNDARY`、`018 QUAL-LIFECYCLE`、`019 QUAL-IDENTITY` |
| `MC` / `MC-04~06` / `MC-11` | MAIN-CONTRACT source及SUITE-SBX-004~006 /011的固定suite report |
| `MS` / `MS-05` / `MS-11` | MAIN-SEAM source及SUITE-SBX-005 /011的固定suite report |
| `OPS` / `OPS-12` | OPS source及SUITE-SBX-012固定suite report |

---

## 2. 全局依赖类型判定

### 2.1 类型词汇

| 类型 | 判定 | 本项目验收证据 | 禁止替代 |
|---|---|---|---|
| compile | 本仓Cargo / package在编译期引用sibling shared contract | manifest闭集、contract compile、shared carrier roundtrip、dependency check | runtime mock /接口调用不能证明依赖图 |
| runtime | 通过port / adapter / entry在运行时调用或被调用 | fake / controlled / disabled adapter、typed outcome、service / entry case | 不得要求对方源码或内部DB |
| event | 通过trusted envelope、stored relay、publisher / feedback异步协作 | consumer receipt、event schema、relay / replay、binding completeness | local log /直写对方store不能替代 |
| handoff | 通过body-free material / target ref和receipt / status交接 | command / consumer / job report、failure no-rollback | receipt不能升格下游truth |
| downstream consumption | 对方只消费本仓query / event / handoff surface | schema / visibility / stored payload / redaction evidence | 不要求对方完整实现或验其内部状态 |

### 2.2 唯一compile dependency门禁

| 检查项 | 通过条件 | 失败 / Blocked条件 | 证据设计 |
|---|---|---|---|
| sibling compile闭集 | 仅`L0-core` / `core-contracts`出现在sibling compile dependency;shared ID / ref / actor / trace / error / metadata不在本地复制 | 出现L0-bus、L1 / L2 / L4 / backend sibling path dependency => Fail;目标manifest不存在 => Blocked | ARCH-001~003;CTR-001~006;ESLOT-SBX-016 /001;SUITE-SBX-003 |
| protocol carrier compile | 55协议public DTO只依赖contracts shared type,不直接暴露domain / infra / SDK type | domain-only / product type进入public DTO或本地复制core carrier => Fail | SUITE-SBX-001 /003 /011;P08 / P16 |

`core-contracts`是唯一允许的sibling compile dependency。bus client、backend SDK、store driver等第三方 / infra-private依赖如后续选择,仍不得改变跨仓sibling闭集或public/domain truth。

---

## 3. 跨仓同步方向与验收方式

### 3.1 输入与双向协作

| 同步ID | 关联方 /方向 | 依赖类型 | 正式协作surface | P0同步成功条件 | 失败 /未就绪裁决 | 证据设计 |
|---|---|---|---|---|---|---|
| SYNC-SBX-001 | `L0-core` -> Sandbox | compile | shared IDs、typed refs、actor / context、trace、error、metadata | 唯一sibling dependency且carrier family / digest / redaction roundtrip成立 | manifest / type不存在为Blocked;复制type或增加sibling为Fail | ARCH / CTR;P01 / P16;SUITE-001 /003 |
| SYNC-SBX-002 | `L1-identity` -> Sandbox | runtime + event | actor / member anchor、caller safe refs;`ConsumeCallerContextReferenceChanged` | typed ref / safe summary可解析;missing / stale / wrong-family拒绝或降级;identity正文0保存 | resolver seam缺失Blocked;source unavailable branch成立可Pass;真实identity服务未联调为conditional | CMD-001 /002;CNS-005 /006;P02 / P08 |
| SYNC-SBX-003 | `L1-work` -> Sandbox | runtime + event | project / work / context refs;caller reference consumer | work context只作responsibility anchor / typed ref;scope mismatch拒绝,不保存Project / WorkItem正文 | 同SYNC-002;旧ImplementationPlan等正文进入carrier为Fail | CMD-001 /002;CNS-005 /006;CTR / ARCH supporting |
| SYNC-SBX-004 | policy / governance / authorization source -> Sandbox | runtime + event | `EvaluatePolicyExecution`;`ConsumePolicySummaryChanged` | body-free snapshot / safe summary驱动本仓execution decision;missing / stale / conflicted fail-closed | source seam缺失Blocked;unavailable时Rejected / Pending且launch=0可Pass;真实source未激活conditional | CMD-005 /006 /008;CNS-007 /008;P04 / P08 |
| SYNC-SBX-005 | capability source / isolation backend <-> Sandbox | runtime + event | boundary / launch / capture / inspect / release ports;capability / lifecycle consumers | P0-C typed adapter outcome、unsupported / unavailable / weak fallback正式;P0-Q另固定candidate真实探针 | fake / controlled seam缺失Blocked;P0-C错误吞并Fail;P0-Q identity / lab缺失保持Blocked | CMD-003 /004 /007~010;CNS-009~012;JOB-003 /005;P03 / P08 / P17~019 |
| SYNC-SBX-006 | `L0-bus` <-> Sandbox | event | 9 inbound envelope、13 outbound event、relay feedback / publication job | trusted envelope / stored receipt、stored payload / source cursor、publisher no-rollback和13-key binding闭合 | consumer / publisher seam缺失Blocked;真实bus unavailable走retryable / dead-letter可Pass;真实bus未激活conditional | CNS / EVT / JOB-001;P08 / P09 / P10;SUITE-005 /011 |

### 3.2 调用方与下游消费

| 同步ID | 关联方 /方向 | 依赖类型 | 正式协作surface | P0同步成功条件 | 失败 /未就绪裁决 | 证据设计 |
|---|---|---|---|---|---|---|
| SYNC-SBX-007 | `L2-tools` -> Sandbox | runtime caller + downstream consumption | authorized Command / Query、execution / capture / failure events | tool仅提供semantic request的body-free refs / summary,隔离结果由Sandbox正式surface返回 | 不要求tools完整实现;synthetic caller entry缺失Blocked;ToolDefinition / ToolResult正文入Sandbox为Fail | CMD / QRY entry parameters;EVT-001~007;P08 |
| SYNC-SBX-008 | `L2-runtime` -> Sandbox | runtime caller + event | context / run command、control consumer、query / event反馈 | runtime调度但不写Sandbox truth;Sandbox不推进ExecutionInstance / checkpoint / recover | 不要求runtime loop;formal control seam缺失Blocked;runtime feedback改写source truth为Fail | CMD-007 /008 /013 /014;CNS-017 /018;EVT-004 /007 /008 |
| SYNC-SBX-009 | `L2-member-service` -> Sandbox | runtime caller + downstream consumption | environment responsibility refs、boundary / lifecycle / cleanup surface | member-service只消费bind / failure / cleanup结果并拥有SandboxBinding / host lifecycle;Sandbox只返回typed refs / status | 不要求member lifecycle实现;host session / worker / binding truth进入Sandbox为Fail | CMD-001~004 /017 /018;QRY / EVT boundary / cleanup slices |
| SYNC-SBX-010 | `L5-runner` / build / test / operator -> Sandbox | runtime caller + downstream consumption | authorized command / query、capture / failure / cleanup surface | 不同caller kind走同一formal gate;无第二隔离或输出回收主线 | caller-specific bypass / raw script正文 / host execution为Fail;真实caller未集成为conditional | caller-kind参数;CMD / QRY / CTR / ARCH supporting |
| SYNC-SBX-011 | Sandbox -> `L1-artifact` | handoff + event feedback | `OpenMaterialHandoff`;material handoff consumer / event / retry job | body-free candidate material refs、target和status交接;Artifact入库 /版本 /baseline由下游owner决定 | target fake / disabled seam缺失Blocked;unavailable时retryable / failed且capture不回滚可Pass;真实target conditional | CMD-011 /012;CNS-013 /014;EVT-005 /006;JOB-004 |
| SYNC-SBX-012 | Sandbox -> `L4-observability` | handoff + event + downstream | observability material ref、handoff status consumer、audit / failure / cleanup events | formal audit与obs material分离;只交body-free ref / marker,不声明store truth | handoff seam缺失Blocked;target unavailable且formal failed marker / no rollback可Pass;真实sink conditional | CMD-009~012;CNS-015 /016;EVT-005~010;P05 / P08 / P15 |
| SYNC-SBX-013 | Sandbox <-> investigation owner | handoff + event | investigation summary / status consumer、redline / cleanup job | investigation receipt只更新owning marker;containment / cleanup guard仍由Sandbox正式flow裁定 | adapter seam缺失Blocked;unavailable保持HandoffPending / Blocked可Pass;feedback直接release为Fail | CMD-017~020;CNS-019 /020;JOB-007;P06 / P08 |
| SYNC-SBX-014 | generic query / event subscribers | downstream consumption | 13 Query、13 Outbound Event | visibility / redaction、event schema / stored payload稳定,无需订阅方内部实现 | query / schema harness缺失Blocked;下游未订阅为conditional,不等于事件失败 | QRY-001~026;EVT-001~015;P07 / P08 / P09 |

### 3.3 同步责任红线

| 红线 | 本仓允许 | 本仓禁止 | 对方禁止 |
|---|---|---|---|
| caller input | typed ref、safe summary、formal actor / scope / source metadata | ToolDefinition / command body、ExecutionInstance、member session、Project / WorkItem正文 | 绕formal Command / Consumer直接调用backend / repository |
| runtime source | typed capability / policy / reference / lifecycle outcome | SDK response / product state / external lifecycle truth | 把receipt / adapter success当Sandbox accepted truth |
| event | trusted envelope、stored receipt、stored payload、relay status | raw topic / payload body、从current truth重建payload | publisher failure要求回滚source truth |
| handoff | material / target / status refs与safe reason | Artifact / observability / investigation正文或决策truth | receipt / target status反写capture / containment / cleanup历史 |
| downstream read | visible / redacted view和body-free event | 为下游便利复制其truth或开放store scan | UI / projection / cache反写Sandbox truth |

---

## 4. 上游旧契约与当前正式协议差异审计

| 材料 | 旧线索 | 当前处理 | 是否blocker |
|---|---|---|---|
| L2-tools旧文档 | `sandbox_exec`、SandboxRequest / SandboxResult、SDK / RPC和三态executor线索 | historical_material。当前接入必须适配55协议中的正式Command / Query / Event,不得反定义Sandbox public contract | 否;未来要求保留旧public surface时DesignReopen |
| L2-runtime旧文档 | `SandboxExecutionRef`、`sandbox.run()`和dispatch / feedback概要 | 只保留runtime是caller / orchestrator、Sandbox是能力层的责任关系;字段 /方法名不进入当前协议 | 否 |
| L2-member-service旧文档 | SandboxBinding装配、host lifecycle和callback材料 | 保留为member-service-owned truth;Sandbox只提供typed boundary / lifecycle / cleanup surface | 否 |
| L1-identity / L1-work旧文档 | actor / member、Project / WorkItem等业务对象 | 只允许core typed ref / safe snapshot;正文与生命周期均禁入 | 否 |
| 旧正式`06` | 旧API、事件、host runtime和泛化证据 | historical_material;不进入PG / SYNC登记 | 否 |

差异审计未发现要求回写当前正式`00~05`的冲突。若后续上游要求旧SDK / RPC / event name成为当前public compatibility surface,必须先回写`03`协议和`04`binding,再重开`05/06`对应Step,不能由实施adapter静默新增协议。

---

## 5. Command与Query逐项设计停审

| PG /协议 | P / F审查 | D / U审查 | T / E审查 | B审查 | 结论 /当前执行限制 |
|---|---|---|---|---|---|
| PG-SBX-001 `OpenControlledExecutionContext` | exact metadata / source / responsibility / summary / guard与完整result refs | runtime caller + resolver;missing / unsafe正式reject / pending | CMD-001 /002;P08 / P10;MC-04 /011 | 不接管caller / identity / work truth | PassDesign;target /run缺失ExecutionBlocked |
| PG-SBX-002 `EstablishExecutionBoundary` | context / identity / policy / four-dimension requirement / capability与boundary / handle / lease result完整 | runtime backend;unsupported / unavailable / weak fallback边界明确 | CMD-003 /004;P08 + qualification supporting;MC-04 /011 | 不选backend产品,不把P0-C当P0-Q | PassDesign;P0-Q另Blocked |
| PG-SBX-003 `EvaluatePolicyExecution` | policy refs / authorization / high-risk marker与fail-closed result完整 | runtime / event policy source;unavailable不allow | CMD-005 /006 /008;P08;MC-04 /011 | 不拥有policy / approval truth | PassDesign;真实source conditional |
| PG-SBX-004 `StartControlledExecutionRun` | context / boundary / handle / policy / launch summary与run result完整 | runtime backend;guard failure launch=0 | CMD-007 /008;P08;MC-04 /011 | 不进入tool semantics / agent loop | PassDesign;real backend资格另Blocked |
| PG-SBX-005 `RecordCaptureResult` | run / safe output / material / obs / safe reason与capture result完整 | runtime capture / handoff;adapter failure不伪Complete | CMD-009 /010;P08;MC-04 /011 | capture不等于Artifact / obs store truth | PassDesign;真实adapter conditional |
| PG-SBX-006 `OpenMaterialHandoff` | capture / material / obs / targets与handoff / relay result完整 | handoff;target unavailable有retryable / failed且no rollback | CMD-011 /012;P08 / P09;MC / MS / OPS适用 | 不宣布下游truth | PassDesign;真实target conditional |
| PG-SBX-007 `SubmitSandboxControl` | context / kind / source / conflict guard与stored result完整 | runtime caller / event;invalid / conflict拒绝 | CMD-013 /014;P08 / P10;MC-04 /011 | 不执行runtime recover / replay | PassDesign;target /run缺失ExecutionBlocked |
| PG-SBX-008 `ClassifySandboxFailure` | context / optional run / source markers / policy / capture与failure result完整 | backend inspect可unavailable;Unknown不success | CMD-015 /016;P08;MC-04 /011 | 不改run / external truth | PassDesign;real inspect conditional |
| PG-SBX-009 `EvaluateCleanupReadiness` | capture / handoff / investigation / guard与cleanup result完整 | investigation / lifecycle handoff;missing默认pending / blocked | CMD-017 /018;P08;MC / OPS适用 | command不执行release | PassDesign;real lifecycle另Blocked |
| PG-SBX-010 `RecordRedlineContainment` | context / boundary / kind / containment / investigation与result完整 | investigation handoff;unavailable保持HandoffPending | CMD-019 /020;P08;MC / OPS适用 | 不允许advisory-only / auto-release | PassDesign;real containment另Blocked |
| PG-SBX-011 `GetSandboxExecutionStatus` | context selector和execution status view / marker完整 | downstream read;missing / restricted / stale正式 | QRY-001 /002;P08;MC-04 /011 | zero-write;不refresh | PassDesign;read harness ExecutionBlocked |
| PG-SBX-012 `GetBoundaryStatus` | context / boundary selector与decision / handle / lease view完整 | downstream read;direct selector未开放不scan | QRY-003 /004;P08;MC-04 /011 | 不调用capability / establish | PassDesign;read harness ExecutionBlocked |
| PG-SBX-013 `GetPolicyDecisionSummary` | selector与decision / snapshot / high-risk / fail-closed view完整 | downstream read;stale / unavailable不allow | QRY-005 /006;P08;MC-04 /011 | 不读取DSL / approval、不refresh | PassDesign;read harness ExecutionBlocked |
| PG-SBX-014 `GetCaptureSummary` | run / capture selector与body-free capture view完整 | downstream read / handoff;missing / degraded正式 | QRY-007 /008;P08;MC-04 /011 | 不读artifact body、不创建capture | PassDesign;read harness ExecutionBlocked |
| PG-SBX-015 `GetMaterialHandoffStatus` | selector与target / status / relay view完整 | downstream / handoff;missing / pending正式 | QRY-009 /010;P08;MC-04 /011 | 不retry、不改capture | PassDesign;read harness ExecutionBlocked |
| PG-SBX-016 `GetFailureControlStatus` | selector与failure / control / lease view完整 | downstream read;restricted / missing安全 | QRY-011 /012;P08;MC-04 /011 | 不classify / control | PassDesign;read harness ExecutionBlocked |
| PG-SBX-017 `GetCleanupReadiness` | selector与guard / evidence / investigation view完整 | downstream read;missing projection不评估 | QRY-013 /014;P08;MC-04 /011 | release调用0 | PassDesign;read harness ExecutionBlocked |
| PG-SBX-018 `GetRedlineContainmentStatus` | selector与redline / boundary / investigation view完整 | downstream read;restricted不泄漏 | QRY-015 /016;P08;MC-04 /011 | 不investigate / release | PassDesign;read harness ExecutionBlocked |
| PG-SBX-019 `GetSandboxReadProjection` | projection / context selector与status / nested view / cursor完整 | downstream read;missing / rebuilding正式 | QRY-017 /018;P08 / READ;MC-04 /011 | 不rebuild,不混page / truth cursor | PassDesign;read harness ExecutionBlocked |
| PG-SBX-020 `GetDerivedInspectPreviewTrend` | scope / source与derived kind / freshness / failure summary完整 | downstream read;failed / empty / degraded正式 | QRY-019 /020;P08 / READ;MC-04 /011 | derived不升格truth,不maintenance | PassDesign;feature disabled按formal surface裁决 |
| PG-SBX-021 `GetBackendCapabilityComparison` | scope / profiles与comparison / unsupported limit / freshness完整 | runtime source + downstream read;stale / unavailable正式 | QRY-021 /022;P08;MC-04 /011 | comparison不是qualification / boundary | PassDesign;real source conditional |
| PG-SBX-022 `GetSandboxReconciliationReport` | report / scope与status / findings / generated time完整 | downstream read;latest selector未开放不scan | QRY-023 /024;P08 / READ;MC / OPS适用 | 不run reconciliation / repair | PassDesign;OPS未执行 |
| PG-SBX-023 `GetSandboxAuditTrace` | subject / filter / page与trace item / source cursor完整 | downstream read;restricted / invalid cursor安全 | QRY-025 /026;P08 / AUDIT;MC-04 /011 | 不append,不泄raw audit body | PassDesign;read harness ExecutionBlocked |

---

## 6. Consumer与Outbound Event逐项设计停审

| PG /协议 | P / F审查 | D / U审查 | T / E审查 | B审查 | 结论 /当前执行限制 |
|---|---|---|---|---|---|
| PG-SBX-024 `ConsumeCallerContextReferenceChanged` | trusted envelope + caller ref payload + typed receipt完整 | identity / work / caller event;unavailable delayed / quarantine | CNS-005 /006 +共用负向;P08 / P10;MC / MS-05 /011 | 只写reference / stale marker | PassDesign;consumer seam未执行 |
| PG-SBX-025 `ConsumePolicySummaryChanged` | policy safe payload / receipt完整 | policy event;missing / stale / unsafe正式 | CNS-007 /008 +共用;P08 / P10;MC / MS | 不改existing decision为Accepted | PassDesign;consumer seam未执行 |
| PG-SBX-026 `ConsumeBackendCapabilitySummaryChanged` | capability payload / receipt完整 | backend capability event;unavailable delayed | CNS-009 /010 +共用;P08 / P10;MC / MS | 不建立boundary / launch | PassDesign;consumer seam未执行 |
| PG-SBX-027 `ConsumeIsolationBackendLifecycleSignal` | handle / profile / lifecycle / lease / reason完整 | backend event;unknown / mismatch quarantine | CNS-011 /012 +共用;P08 / P10;MC / MS | 不造handle / lease或直接release | PassDesign;real lifecycle另Blocked |
| PG-SBX-028 `ConsumeMaterialHandoffStatusChanged` | handoff / targets / status / marker / reason完整 | artifact / material feedback;unavailable / mismatch正式 | CNS-013 /014 +共用;P08 / P10;MC / MS | 不回滚capture / material | PassDesign;real target conditional |
| PG-SBX-029 `ConsumeObservabilityHandoffStatusChanged` | obs material / handoff / status / reason完整 | observability feedback;missing / body quarantine | CNS-015 /016 +共用;P08 / P10;MC / MS | 不宣称obs store truth | PassDesign;real target conditional |
| PG-SBX-030 `ConsumeSandboxControlRequested` | context / control / source / version与receipt完整 | runtime / operator event;untrusted / conflict拒绝 | CNS-017 /018 +共用;P08 / P10;MC / MS | 只能进入formal command path | PassDesign;consumer seam未执行 |
| PG-SBX-031 `ConsumeInvestigationHandoffStatusChanged` | redline / cleanup relation + investigation summary完整 | investigation feedback;unavailable保持guard | CNS-019 /020 +共用;P08 / P10;MC / MS | receipt不直接release | PassDesign;real target conditional |
| PG-SBX-032 `ConsumeSandboxTruthRelayFeedback` | relay / outcome / marker / reason与receipt完整 | bus feedback;retryable / dead-letter正式 | CNS-021 /022 +共用;P08 / P09 / P10;MC / MS / OPS | 只更新relay,不改source truth | PassDesign;bus seam未执行 |
| PG-SBX-033 `SandboxExecutionContextChanged` | context / identity / resolution / intake / audit payload完整 | event downstream;publisher unavailable no rollback | EVT-001 /014 /015;P08 / P09;MC / MS | no caller body / second truth | PassDesign;publisher seam未执行 |
| PG-SBX-034 `SandboxBoundaryChanged` | decision / coherent? / handle? / lease? payload完整 | event downstream;rejected / pending可发布formal snapshot | EVT-002 /014 /015;P08 / P09;MC / MS | no raw backend / partial coherent | PassDesign;publisher seam未执行 |
| PG-SBX-035 `SandboxPolicyDecisionChanged` | decision / snapshot or fail-closed / high-risk payload完整 | event downstream;publisher unavailable no rollback | EVT-003 /014 /015;P08 / P09;MC / MS | no policy body;stale不Accepted | PassDesign;publisher seam未执行 |
| PG-SBX-036 `SandboxRunChanged` | context / run / handle / status / lifecycle marker完整 | event downstream;publish failure只改relay | EVT-004 /014 /015;P08 / P09;MC / MS | no tool command / agent loop body | PassDesign;publisher seam未执行 |
| PG-SBX-037 `SandboxCaptureChanged` | run / capture / status / material / obs refs完整 | artifact / obs consumers;publish no rollback | EVT-005 /014 /015;P08 / P09;MC / MS | no output body / downstream truth | PassDesign;publisher seam未执行 |
| PG-SBX-038 `SandboxMaterialHandoffChanged` | handoff / capture / target / status / relay payload完整 | handoff / event;target unavailable formal | EVT-006 /014 /015;P08 / P09;MC / MS | receipt不成artifact / obs truth | PassDesign;publisher seam未执行 |
| PG-SBX-039 `SandboxFailureChanged` | context / failure / kind / status / markers完整 | event downstream;Unknown / pending准确 | EVT-007 /014 /015;P08 / P09;MC / MS | no raw stack,不改run历史 | PassDesign;publisher seam未执行 |
| PG-SBX-040 `SandboxControlChanged` | context / control / kind / status / source marker完整 | event downstream;publisher unavailable no rollback | EVT-008 /014 /015;P08 / P09;MC / MS | event不执行control | PassDesign;publisher seam未执行 |
| PG-SBX-041 `SandboxCleanupChanged` | context / guard / status / blockers / handoff完整 | event downstream;Allowed不等于Released | EVT-009 /014 /015;P08 / P09;MC / MS | no backend cleanup side effect | PassDesign;publisher seam未执行 |
| PG-SBX-042 `SandboxRedlineContainmentChanged` | context / containment / kind / status / investigation完整 | event / investigation;publisher unavailable no release | EVT-010 /014 /015;P08 / P09;MC / MS | advisory不成Contained | PassDesign;publisher seam未执行 |
| PG-SBX-043 `SandboxProjectionChanged` | projection / status / affected refs / source cursor完整 | downstream read event;disabled / unavailable按配置 | EVT-011 /014 /015;P08 / P09;MC / MS / OPS | no projection body / truth repair | PassDesign;optional activation按formal config |
| PG-SBX-044 `SandboxDerivedViewChanged` | derived / kind / freshness / sources / failure summary完整 | downstream event;feature未激活conditional | EVT-012 /014 /015;P08 / P09;MC / MS / OPS | derived不成core truth | PassDesign;optional activation conditional |
| PG-SBX-045 `SandboxReconciliationFindingAvailable` | report / scope / status / nonempty findings完整 | downstream event;Clean / Failed不publish finding | EVT-013 /014 /015;P08 / P09;MC / MS / OPS | event不修truth | PassDesign;OPS未执行 |

---

## 7. Operations Job逐项设计停审

| PG /协议 | P / F审查 | D / U审查 | T / E审查 | B审查 | 结论 /当前执行限制 |
|---|---|---|---|---|---|
| PG-SBX-046 `PublishSandboxEventRelay` | relay scope / status filter与四类result refs完整 | bus runtime / event;publisher unavailable retryable / dead-letter | JOB-001 /011 /012;P08 / P09 / P10;MC / OPS | source truth不变,payload不重建 | PassDesign;job / bus seam未执行 |
| PG-SBX-047 `RefreshSandboxReferenceStates` | refresh scope / source kinds与refreshed / stale / failed refs完整 | identity / work / policy runtime source;unavailable honest partial | JOB-002 /011 /012;P08 / P10;MC / OPS | 只写reference / stale marker | PassDesign;job seam未执行 |
| PG-SBX-048 `RefreshBackendCapabilitySummaries` | profile / capability scope与summary / affected / failed refs完整 | backend runtime;unavailable degraded | JOB-003 /011 /012;P08 / P10;MC / OPS | 不establish / authorize launch | PassDesign;real backend另Blocked |
| PG-SBX-049 `RetryPendingMaterialHandoffs` | handoff scope / target kinds与delivery分类完整 | artifact / obs handoff;target unavailable formal | JOB-004 /011 /012;P08 / P10;MC / OPS | capture / material / guard不回滚 | PassDesign;real target conditional |
| PG-SBX-050 `RunLeaseOrphanReaper` | lease scope / safe reason与orphan / release / guard / failed refs完整 | backend lifecycle;inspect unavailable honest | JOB-005 /011 /012;P08 / P10;MC / OPS | 不绕cleanup guard | PassDesign;real lifecycle P0-Q另Blocked |
| PG-SBX-051 `EvaluatePendingCleanupGuards` | cleanup scope / explicit include-blocked与四类guard refs完整 | maintenance local + investigation state;missing保守 | JOB-006 /011 /012;P08 / P10;MC / OPS | 不执行release | PassDesign;OPS未执行 |
| PG-SBX-052 `MaintainRedlineContainmentHandoffs` | redline scope / filter与opened / released / terminal / failed refs完整 | investigation handoff;unavailable degraded / partial | JOB-007 /011 /012;P08 / P10;MC / OPS | guard before release,no auto-fix | PassDesign;real target conditional |
| PG-SBX-053 `RebuildSandboxReadProjections` | projection scope / refs与rebuilt / stale / missing / failed refs完整 | local store / snapshot;missing snapshot degraded | JOB-008 /011 /012;P08 / P10;MC / OPS | 从truth snapshot,不写core truth | PassDesign;OPS未执行 |
| PG-SBX-054 `MaintainDerivedInspectPreviewTrend` | derived scope / kinds与rebuilt / stale / failed refs完整 | local derived adapter;feature disabled / unavailable formal | JOB-009 /011 /012;P08 / P10;MC / OPS | failure不创建core failure / policy | PassDesign;optional activation conditional |
| PG-SBX-055 `RunSandboxReconciliation` | scope / targets与report / findings / degraded / failed refs完整 | local snapshot / derived;partial honest | JOB-010 /011 /012;P08 / P10;MC / OPS | report只诊断,不修truth / projection | PassDesign;OPS未执行 |

逐项停审结论:55 /55达到`PassDesign`;0项为runtime Pass / Fail;目标仓和fixed run缺失使真实执行保持Blocked / NotEntered,没有因此删除或降级任何P0协议。

---

## 8. 跨接口同步门禁总审

| 审计ID | 审计项 | 结论 | 缺口 /修正 |
|---|---|---|---|
| ISA-SBX-001 | 协议总数与五族计数是否准确 | pass;55 = 10 +13 +9 +13 +10 | 无 |
| ISA-SBX-002 | PG是否连续唯一且不成为新AC | pass | PG-SBX-001~055只作检查索引 |
| ISA-SBX-003 | formal protocol name是否与正式`03`一致 | pass;55 /55 | 未继承旧SDK / API / event name |
| ISA-SBX-004 | logical surface是否稳定且transport-neutral | pass | 只用Command / Query / InboundEvent / OutboundEvent / Job逻辑名 |
| ISA-SBX-005 | 是否发明HTTP / RPC / topic / queue / executable | pass;未发明 | transport值保持未定义 |
| ISA-SBX-006 | Outbound 13-key binding是否与schema分离 | pass | 只验`transport_topic_bindings`闭集和fail-fast,不写topic |
| ISA-SBX-007 | 每协议是否有正式字段 / surface | pass;55 /55 | 无验收自造字段 |
| ISA-SBX-008 | 每协议是否有正向与关键负向TC | pass;55 /55 | 共用CNS / EVT / JOB负向适用关系明确 |
| ISA-SBX-009 | 每协议是否有P08 primary | pass;55 /55 | P09 / P10 /领域slot只补强 |
| ISA-SBX-010 | source role / suite / report / case path是否固定 | pass | current无实例,不使用latest |
| ISA-SBX-011 | planned slot是否被伪写成runtime EV | pass | future form仅作命名规则 |
| ISA-SBX-012 | 是否只允许`core-contracts` sibling compile dependency | pass | 其他关系无package / path dependency要求 |
| ISA-SBX-013 | runtime dependency是否误要求对方源码 / DB | pass | 只验port / adapter / entry seam |
| ISA-SBX-014 | event dependency是否用local log替代 | pass | 必须consumer receipt / stored relay / publisher feedback |
| ISA-SBX-015 | handoff receipt是否升格下游truth | pass | Artifact / obs / investigation owner保持外部 |
| ISA-SBX-016 | downstream consumption是否要求完整实现 | pass | schema / visibility / stored payload即可证明本仓P0 seam |
| ISA-SBX-017 | Command metadata / accepted / rejected / stored result是否闭合 | pass;10 /10 | duplicate不得重跑 |
| ISA-SBX-018 | Query visibility / degraded / missing / zero-write是否闭合 | pass;13 /13 | Step 8继续加严事务write audit |
| ISA-SBX-019 | Consumer trusted envelope / stored receipt / quarantine是否闭合 | pass;9 /9 | invalid no parse / no mutation |
| ISA-SBX-020 | Outbound committed payload / relay / no-rollback是否闭合 | pass;13 /13 | source cursor不混page cursor |
| ISA-SBX-021 | Job typed input / partial report / replay / no-repair是否闭合 | pass;10 /10 | Step 8继续加严idempotency / race |
| ISA-SBX-022 | required seam缺失是否诚实传播Blocked | pass | 不以文档评审 /空mock标Passed |
| ISA-SBX-023 | 正式unavailable branch是否可成为负向Pass | pass | 必须exact TC证明fail-closed / no-write / no-rollback |
| ISA-SBX-024 | 未激活真实下游是否被冒充P0通过 /失败 | pass | 保持ConditionalNotActivated / NotEvaluated |
| ISA-SBX-025 | P0-C seam是否替代P0-Q | pass | P0-Q candidate / lab缺失仍Blocked |
| ISA-SBX-026 | P1 / real-like是否补偿P0 | pass | conditional结果无P0证明效力 |
| ISA-SBX-027 | AC-SBX-031是否保持一个canonical disposition | pass | ARCH / PROTOCOL双slice mandatory |
| ISA-SBX-028 | 是否吞并Step 8事务 /状态责任 | pass | 本Step只验public replay / no-write / no-rollback surface |
| ISA-SBX-029 | 是否吞并Step 10 evidence integrity责任 | pass | 只固定planned source / path,不裁pairing / digest真实性 |
| ISA-SBX-030 | historical material是否回流 | pass | 旧sandbox_exec / request / result / run / host接口未进入正式登记 |
| ISA-SBX-031 | tools semantics / runtime loop / member lifecycle是否混入Sandbox | pass | caller / consumer边界明确 |
| ISA-SBX-032 | artifact / observability / policy / investigation truth是否混入Sandbox | pass | 仅typed ref / safe summary / handoff marker |
| ISA-SBX-033 | 是否发现需回写正式`00~05`的冲突 | pass;未发现 | future public compatibility要求触发DesignReopen |
| ISA-SBX-034 | 当前事实是否诚实 | pass | NotEntered;无target、run、EV、report、review、风险或结论 |

跨接口总审结论:`no_unresolved_interface_event_sync_conflict`。

---

## 9. `AC-SBX-031`协议slice停审

| 审查面 | ARCH-SLICE状态 | PROTOCOL-SLICE状态 | canonical约束 |
|---|---|---|---|
| 正式来源 | Step 6已PassDesign | 正式`03` 55协议 / shared carrier完整 | 两者均来自同一正式设计链 |
| 测试来源 | ARCH-001~003 / SUITE-003 | CMD / QRY / CNS / EVT / JOB + SUITE-004~006 /011 | 不允许inventory count替代exact PG |
| planned evidence | ESLOT-SBX-016 primary | ESLOT-SBX-008 primary;001 /013 /016 supporting | source item必须分别保留 |
| 当前执行 | target manifest缺失,Blocked | target / suite / run缺失,Blocked | canonical当前不得Pass |
| 最终合并 | mandatory | mandatory | 仅Step 14消费两个slice后形成一个disposition |

PROTOCOL-SLICE设计结论:`PassDesign`;runtime状态:`Blocked / NotEvaluated`。这不会把canonical `AC-SBX-031`提前写成Passed。

---

## 10. 后续Step责任保留

| 本Step出现的横切语义 | 本Step只裁决 | 后续唯一加严owner |
|---|---|---|
| stored result / receipt / report replay | public typed replay与duplicate不重跑义务 | Step 8 UoW、idempotency winner、commit unknown、race |
| event source cursor / relay | committed stored payload与publisher no-rollback | Step 8 transaction / relay consistency |
| unavailable / retry / batch | formal bounded surface存在 | Step 9 NFR / availability / boundedness |
| source / report / case path | planned evidence入口固定 | Step 10 pairing / digest / index / review / redaction integrity |
| protocol / dependency失败 | 对应IFG / AC / release阻断 | Step 11正式VETO映射 |
| missing seam / failed protocol | Blocked / Fail语义 | Step 12 defect / retest / release |
| real downstream未激活 | conditional / NotEvaluated | Step 13 risk acceptance / residual |
| overall acceptance | 五族与同步门禁mandatory | Step 14三值结论 /签署 |

---

## 11. 分件自检

| 自检项 | 结论 |
|---|---|
| 是否定义compile / runtime / event / handoff / downstream类型 | 是 |
| 是否逐方向定义同步成功、失败和未就绪 | 是,SYNC-SBX-001~014 |
| 是否对55个PG逐项停审 | 是,55 /55 |
| 是否逐项覆盖P / F / D / T / E / U / B | 是 |
| 是否存在DesignBlocked项 | 否 |
| 是否把PassDesign写成runtime通过 | 否 |
| 是否存在unresolved跨接口冲突 | 否 |
| 是否要求下游完整实现 | 否 |
| 是否创建真实review / evidence /结果 /签署 | 否 |
| 当前状态 | completed_reviewed_passed_to_step_8;用户确认不等于runtime通过 |
