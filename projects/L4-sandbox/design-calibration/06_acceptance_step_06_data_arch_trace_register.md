# Step 6 分件 A. 数据边界与架构红线逐项追溯登记

> 父Step: `06_acceptance_step_06_data_arch_redlines.md`
> 对应SOP: `standards/document/验收标准讨论流程_SOP.md` Step 6
> 生成日期: 2026-07-15
> 状态: completed_reviewed_passed_to_step_7
> 本分件口径: 对canonical `AC-SBX-026~035`逐项固定规则 /数据 /设计、exact TC slice、planned ESLOT、future runtime EV form、source report与裁决影响。本文不创建run、EV、artifact、report、测试结果或验收结论。

---

## 1. 分件状态与引用纪律

| 项 | 固定规则 |
|---|---|
| canonical AC owner | 正式`00` §14的`AC-SBX-026~035`;父Step不改号 /改义 |
| 红线检查索引 | 父Step的`RL-SBX-001~016`;只帮助切片,不是新AC / VF / VETO |
| 设计owner | 正式`01~04`;对象、模块、flow、truth / snapshot / ref / body和配置红线必须使用正式名称 |
| TC owner | 正式`05` §6及测试Step 6分件;本文只选择exact assertion slice,不新增TC |
| slot owner | 正式`05` §13 /测试Step 13;ESLOT是planned catalog,不是runtime EV |
| primary evidence | future evidence item的`ac_refs`直接包含当前canonical AC,且exact TC / assertion证明本项 |
| supporting evidence | 通过正式TC / CUT / PER链补强,但不得伪改catalog `ac_refs`或单独宣称本项通过 |
| shared suite | suite级Passed不可复制为多个AC通过;必须消费case / parameter / assertion code |
| 当前实例 | 0 target repo、0 fixed run、0 runtime EV、0 report、0 item review;验收仍`NotEntered` |

用户已明确回复“同意”并放行父Step进入Step 7;该确认只批准本追溯设计,不形成run、runtime EV、报告、单项裁决或总体结论。

### 1.1 Fixed source role与future path

下列占位符继承Step 3 / Step 5,不是当前事实:

| 占位符 | 固定角色 /环境 |
|---|---|
| `<main_contract_run_id>` | MAIN-CONTRACT;SBX-ENV-02 / SBX-PROFILE-02;P0-C主结果 |
| `<main_seam_run_id>` | MAIN-SEAM;SBX-ENV-03 / SBX-PROFILE-03;controlled seam补强 |
| `<ops_run_id>` | OPS;SBX-ENV-04 / SBX-PROFILE-04;operations simulation补强 |
| `<p0q_run_id>` | P0Q;SBX-ENV-05 / SBX-PROFILE-05;P0-Q唯一主体 |
| `<release_run_id>` | RELEASE聚合器;只按序消费上述四源,自身不产生P0证明效力 |

每个证据引用未来必须闭环:

```text
artifacts/test/<source_run_id>/suites/<suite_id>/cases/<tc_id>/<parameter_id>.json
  -> artifacts/test/<source_run_id>/suites/<suite_id>/report.json
  -> reports/runs/<source_run_id>/suites/<suite_id>.md
  -> reports/runs/<release_run_id>/evidence/<evidence_id>.md
  -> reports/runs/<release_run_id>/evidence-index.md
```

尖括号、planned slot和future alias form均不得写成已有路径或证据事实。

### 1.2 紧凑引用展开规则

- `CMD-001/002`展开为`TC-SBX-CMD-001`,`TC-SBX-CMD-002`;range逐项展开,不得进入机器artifact。
- `ESLOT-002`展开为`ESLOT-SBX-002`;future form为`EV-SBX-INTAKE-002`,但当前不分配alias。
- `SUITE-004`展开为`SUITE-SBX-004`;source role必须与正式Gate矩阵一致。
- `VF-005` / `VETO-CFG-05`分别保持其正式来源编号;本Step不创建命中记录。

---

## 2. Canonical需求与设计追溯

| AC | 正式规则 /数据来源 | 正式架构 /概要来源 | 正式详细 /配置契约 | 本项唯一边界主语 |
|---|---|---|---|---|
| AC-SBX-026 | BR-001~005;§11 context truth / snapshot / refs / body | `01` §4 intake职责 / §9 owner;`02` intake组成 /对象 /flow | `03` `ControlledExecutionContext`,`ExecutionEnvironmentIdentity`,`ReferenceResolutionState`;Open flow;`04` scoped / body / hard guard | 受理与归责必须先于动作,不得由调用方 /日志补造 |
| AC-SBX-027 | BR-006~010;boundary truth / capability snapshot / backend refs / host body | `01` §3 /§7 /§13 coherent boundary与运行载体;`02` boundary组成 /异常 | `03` `BoundaryRequirementSet`,`BoundaryEstablishmentDecision`,`CoherentBoundary`,`IsolationEnvironmentHandle`,`LeaseRecord`,backend ports;`04` AHG-03 /04 /08 /13 /19 | 四维同代边界与产品中立backend outcome |
| AC-SBX-028 | BR-011~017;policy decision truth / applicability snapshot / policy refs / DSL body | `01` §4 /§9 /§13 policy来源与fail-closed;`02` policy组成 /flow /异常 | `03` `PolicyApplicabilitySnapshot`,`PolicyExecutionDecision`,`HighRiskActionDecision`,`PolicySummaryPort`;`04` AHG-04 /13 /17 | 给定policy执行裁定与外部policy truth分离 |
| AC-SBX-029 | BR-018~024;capture / handoff truth、downstream refs、formal body禁区 | `01` capture / handoff职责与no downstream truth;`02` execution capture组成 /flow | `03` `ControlledExecutionRun`,`CaptureFact`,`HandoffFact`,handoff ports / relay;`04` AHG-06 /07 /15 /16 | source capture、handoff marker与下游truth三层分离 |
| AC-SBX-030 | BR-025~033;safety truth、downstream snapshot / refs、recover / UI body禁区 | `01` cleanup / reaper / redline与no reverse truth;`02` safety组成 /flow /异常 | `03` `FailureClassification`,`ControlFact`,`CleanupGuard`,`RedlineContainment`,`LeaseRecord`,`OrphanRecoveryRecord`;`04` AHG-13~16 | safety只收束Sandbox truth,不修外部truth或删未交接材料 |
| AC-SBX-031 ARCH-SLICE | §6 compile / runtime / event依赖;§12接口类型边界 | `01` §8依赖方向 /禁止依赖;`02` §3 /§4框架与组成 | `03` §5.1~5.2七模块 / §13.4跨仓Rust依赖;`04` AHG-17 /18 | 仅`core-contracts`为sibling compile依赖;协议完整性留Step 7 |
| AC-SBX-032 | §11全部Sandbox truth分类 | `01` §9 truth ownership / consistency;`02`六组成owner与状态主题 | `03` §5 domain / application owner,§10.1 truth / audit / relay stores,shared accepted flow;`04` hard guard | execution isolation truth只有正式Sandbox writer |
| AC-SBX-033 | §11四类safe snapshot | `01` §6.3 local reference / projection / §9 snapshot;`02` local support对象 /flow | `03` `ReferenceResolutionState`,`BackendCapabilitySummary`,`PolicyApplicabilitySnapshot`,projection / refresh jobs;`04` degraded no-write | snapshot保留来源 /freshness,永不成为Accepted / Allowed / Coherent truth |
| AC-SBX-034 | §11全部external refs | `01` §5上下游 / §9 reference层;`02` protocol /对象ref轮廓 | `03` `SandboxOpaqueRef` typed families、metadata / cursor边界、external ports;`04` material / adapter refs和qualification identity | typed ref只表达关系,不接管外部生命周期 |
| AC-SBX-035 | §11四组forbidden body;VF-005 | `01` §4 /§9 /§13 external body红线;`02`对象 /异常 /配置body边界 | `03` contracts body-free、`ForbiddenExternalBodyPersistence`、safe carrier / redaction;`04` SEC / ALC / AHG-06 /07 /16 | 外部正文 / raw material不得进入任何持久化或输出carrier |

### 2.1 AC-SBX-031切片登记

| Slice | 当前owner | 必须证明 | 不得宣称 |
|---|---|---|---|
| `ARCH-SLICE` | Step 6 | dependency graph、七模块方向、entry边界、unsupported absence、product-neutral responsibility | 55协议、event / job同步和兼容性全部通过 |
| `PROTOCOL-SLICE` | Step 7 | 10 Command +13 Query +9 Consumer +13 Event +10 Job逐项协议、协作和同步 | 重复计算第二个AC-SBX-031或改变ARCH-SLICE结果 |
| canonical disposition | Step 7之后的验收聚合 | 两个slice均满足且证据有效 | 任一slice Failed / Blocked / missing时写Passed |

---

## 3. Exact TC与assertion slice登记

| AC | Primary TC slice | Supporting TC slice | 必须观察的assertion | 禁止用作替代 |
|---|---|---|---|---|
| AC-SBX-026 | CTR-001~003 /006;CMD-001 /002;STA-001~003 | CNS-005 /006;TXN-001 /002;ERR-014 /015;CFG-009 | formal context / identity先建立;body-free source refs;0旁路 /匿名formal success;accepted / reject可归责 | 日志、trace、caller本地状态或旧session对象 |
| AC-SBX-027 | CMD-003 /004 /007 /008;STA-004~009;CONF-001~006 /011 /012 | CNS-009~012;EVT-002 /004;ERR-006 /007 /029;CFG-008 /010 /016 /018;ARCH-003 | 四维同代、partial=0 launch、typed backend outcome、逐维真实probe、identity连续 | 单维smoke、fake handle、host path、backend success字符串 |
| AC-SBX-028 | CMD-005 /006 /008;STA-010~012;ERR-005;CONF-004 /006 /012 | CNS-007 /008;EVT-003;CFG-008 /018;ARCH-003 | policy body-free、new snapshot -> new decision、非Accepted backend call=0、no local policy truth | 本地allowlist、旧Accepted、technical Degraded、candidate capability success |
| AC-SBX-029 | CMD-009~012;CNS-013~016;EVT-005 /006;CONF-008 /013 | EVT-004 /015;JOB-001 /004;STA-014 /015 /024;ERR-008 /033;CFG-009 /021 | capture / handoff owner分离;raw=0;receipt不升格;target /publish failure no source rollback | observability log、downstream receipt、Artifact状态或suite总绿 |
| AC-SBX-030 | CMD-013~020;STA-016~019;JOB-005~007;CONF-009 /010 | CNS-017~020;EVT-007~010;JOB-011;ERR-010 /011 /020;CFG-022 /023 /026 | stable safety truth;non-Allowed release=0;new recovery fact;material /investigation refs保留 | runtime recover、force clean、普通receipt、旧report重写 |
| AC-SBX-031 ARCH-SLICE | ARCH-001~003;CFG-007 /008 /029 | CTR-003;CFG-014 /017;ERR-029~032适用 | only core-contracts sibling;module /entry direction;no new unsupported / domain owner | PROTOCOL slot总体绿、文档review或未生成target manifest |
| AC-SBX-032 | CMD-001~020 accepted / rejected owner slice;TXN-001~006 | STA-001~019;QRY-001~026 zero-write;JOB-008~012 no-repair;CFG-008 /019 /023 | formal owner write;accepted group原子;adapter / query / job不成第二writer | DB行存在、log、projection或report自身 |
| AC-SBX-033 | CNS-005~010 /013~016;QRY-002 /006 /022;JOB-002 /003 /008~010 | CMD-002 /004 /006 /012;STA-003 /006 /010 /020~023;CFG-018 /019 | source / freshness / resolution存在;stale / unavailable非success;refresh只写owning marker | cache hit、latest snapshot、provider状态或query repair |
| AC-SBX-034 | CTR-001~005;CMD-001 /002;CNS-001 /002;CONF-011~013 | CNS-005~020适用;ARCH-001 /003;ERR-014 /015;CFG-006 /013 | ref family严格;cursor / version / digest不混同;qualification identity完整;不本地复制type | string ID、raw path、local DTO copy或missing identity N/A |
| AC-SBX-035 | CTR-001 /002 /006;CMD-002 /008 /010 /020;CNS-002 /006 /008 /016 /020;CFG-009 /012 /013 /030;CONF-008 /013 | EVT-001~013 body-free slice;ERR-008 /033;ARCH-003 | truth / audit / event / error / report / log / metric / handoff / workload marker泄漏=0 | 只扫log、真实secret、失败报告回显marker或人工目检 |

所有range必须在future case / evidence artifact中展开。`CMD-001~020 owner slice`也必须按当前AC要求选择assertion code,不能把20个case全部结果重复归属给AC-SBX-032。

---

## 4. Planned evidence与future runtime form登记

| AC | Primary planned slot -> future form | Supporting slot -> future form | Source role / suite主入口 | 当前成熟度 |
|---|---|---|---|---|
| AC-SBX-026 | ESLOT-002 INTAKE -> `EV-SBX-INTAKE-002` | ESLOT-001 CONTRACT -> `EV-SBX-CONTRACT-001`;ESLOT-011 CONSISTENCY -> `EV-SBX-CONSISTENCY-011`;ESLOT-015 AUDIT -> `EV-SBX-AUDIT-015` | MAIN-CONTRACT SUITE-001 /002 /004;exact TXN / audit producer适用 | planned P0-C |
| AC-SBX-027 | ESLOT-003 BOUNDARY -> `EV-SBX-BOUNDARY-003`;ESLOT-017 QUAL-BOUNDARY -> `EV-SBX-QUAL-BOUNDARY-017`;ESLOT-019 QUAL-IDENTITY -> `EV-SBX-QUAL-IDENTITY-019` | ESLOT-013 CONFIG -> `EV-SBX-CONFIG-013`;ESLOT-016 ARCH -> `EV-SBX-ARCH-016`;ESLOT-012 ERROR -> `EV-SBX-ERROR-012` | MAIN-CONTRACT SUITE-002 /003 /004 /010;P0Q SUITE-013 | P0-C planned;P0-Q Blocked |
| AC-SBX-028 | ESLOT-004 POLICY -> `EV-SBX-POLICY-004`;ESLOT-019 QUAL-IDENTITY -> `EV-SBX-QUAL-IDENTITY-019` | ESLOT-013 CONFIG -> `EV-SBX-CONFIG-013`;ESLOT-016 ARCH -> `EV-SBX-ARCH-016`;ESLOT-017 QUAL-BOUNDARY -> `EV-SBX-QUAL-BOUNDARY-017` | MAIN-CONTRACT SUITE-003 /004 /010;P0Q SUITE-013 | P0-C planned;P0-Q适用Blocked |
| AC-SBX-029 | ESLOT-005 EXECUTION -> `EV-SBX-EXECUTION-005`;ESLOT-018 QUAL-LIFECYCLE -> `EV-SBX-QUAL-LIFECYCLE-018`;ESLOT-019 QUAL-IDENTITY -> `EV-SBX-QUAL-IDENTITY-019` | ESLOT-008 PROTOCOL -> `EV-SBX-PROTOCOL-008`;ESLOT-009 RELAY -> `EV-SBX-RELAY-009`;ESLOT-015 AUDIT -> `EV-SBX-AUDIT-015` | MAIN-CONTRACT SUITE-001 /003~006;MAIN-SEAM SUITE-005;OPS SUITE-012;P0Q SUITE-013 | P0-C planned;P0-Q Blocked |
| AC-SBX-030 | ESLOT-006 SAFETY -> `EV-SBX-SAFETY-006`;ESLOT-007 READ -> `EV-SBX-READ-007`;ESLOT-018 QUAL-LIFECYCLE -> `EV-SBX-QUAL-LIFECYCLE-018`;ESLOT-019 QUAL-IDENTITY -> `EV-SBX-QUAL-IDENTITY-019` | ESLOT-010 REPLAY -> `EV-SBX-REPLAY-010`;ESLOT-012 ERROR -> `EV-SBX-ERROR-012` | MAIN-CONTRACT SUITE-002 /004 /006 /010;OPS SUITE-012;P0Q SUITE-013 | P0-C planned;P0-Q Blocked |
| AC-SBX-031 ARCH-SLICE | ESLOT-016 ARCH -> `EV-SBX-ARCH-016` | ESLOT-001 CONTRACT -> `EV-SBX-CONTRACT-001`;ESLOT-013 CONFIG -> `EV-SBX-CONFIG-013`;ESLOT-008 PROTOCOL留Step 7 | MAIN-CONTRACT SUITE-001 /003;scope-change SUITE-016只作触发补强 | planned P0-C;target repo execution blocked |
| AC-SBX-032 | ESLOT-002 INTAKE -> `EV-SBX-INTAKE-002`;ESLOT-003 BOUNDARY -> `EV-SBX-BOUNDARY-003`;ESLOT-011 CONSISTENCY -> `EV-SBX-CONSISTENCY-011` | ESLOT-004~007 exact owner TC supporting;ESLOT-015 audit supporting | MAIN-CONTRACT SUITE-002 /004 /007~009;其他suite按exact owner slice | planned P0-C |
| AC-SBX-033 | ESLOT-002 INTAKE -> `EV-SBX-INTAKE-002` | ESLOT-003~007 snapshot / read slices;ESLOT-011 /015 /016适用supporting | MAIN-CONTRACT SUITE-002 /004 /006;MAIN-SEAM / OPS只按refresh / read补强 | planned P0-C |
| AC-SBX-034 | ESLOT-001 CONTRACT -> `EV-SBX-CONTRACT-001`;ESLOT-002 INTAKE -> `EV-SBX-INTAKE-002`;ESLOT-016 ARCH -> `EV-SBX-ARCH-016`;ESLOT-019 QUAL-IDENTITY -> `EV-SBX-QUAL-IDENTITY-019` | ESLOT-011 CONSISTENCY -> `EV-SBX-CONSISTENCY-011`;ESLOT-015 AUDIT适用 | MAIN-CONTRACT SUITE-001 /003 /004 /007~009;P0Q SUITE-013 | P0-C planned;P0-Q identity Blocked |
| AC-SBX-035 | ESLOT-001 CONTRACT -> `EV-SBX-CONTRACT-001`;ESLOT-002 INTAKE -> `EV-SBX-INTAKE-002`;ESLOT-005 EXECUTION -> `EV-SBX-EXECUTION-005`;ESLOT-015 AUDIT -> `EV-SBX-AUDIT-015`;ESLOT-019 QUAL-IDENTITY -> `EV-SBX-QUAL-IDENTITY-019` | ESLOT-016 ARCH / ESLOT-018 QUAL-LIFECYCLE适用supporting | MAIN-CONTRACT SUITE-001 /003~005;MAIN-SEAM SUITE-005;P0Q SUITE-013 | P0-C planned;provider / P0-Q anti-leak Blocked |

Primary列表示catalog可直接承载当前AC的主要item。Supporting列中的item若`ac_refs`不直接包含该AC,只能按正式TC / CUT / PER链补强,不得提升为primary。

---

## 5. Fixed report与单项裁决入口

| Source role | 适用证据 | 必须定位的报告 | 资格限制 |
|---|---|---|---|
| MAIN-CONTRACT | CONTRACT / INTAKE / BOUNDARY / POLICY / EXECUTION / SAFETY / READ / CONSISTENCY / ERROR / CONFIG / AUDIT / ARCH | `reports/runs/<main_contract_run_id>/suites/<suite_id>.md`和对应case JSON | P0-C主证;不能证明真实四维或真实provider |
| MAIN-SEAM | PROTOCOL / RELAY / adapter failure / redaction适用补强 | `reports/runs/<main_seam_run_id>/suites/SUITE-SBX-005.md`及008 /010 /011适用报告 | 只证明controlled seam;不能替代MAIN-CONTRACT / P0Q |
| OPS | cleanup / reaper / redline / replay / no-repair适用补强 | `reports/runs/<ops_run_id>/suites/SUITE-SBX-012.md`及expanded suite报告 | simulation不证明真实release / containment |
| P0Q | QUAL-BOUNDARY / QUAL-LIFECYCLE / QUAL-IDENTITY | `reports/runs/<p0q_run_id>/suites/SUITE-SBX-013.md`;qualification-result.json | fixed candidate / profile / generation / environment / provider identity缺一即Blocked |
| RELEASE | 所有最终item detail / index | `reports/runs/<release_run_id>/evidence/<evidence_id>.md`;`evidence-index.md` | 只聚合四源;不得改变source status或用latest |

每个AC的裁决记录必须至少包含:

```text
canonical_ac_id
assertion_slice
source_role + source_run_id
evidence_id + artifact_digest
suite_id + tc_id + parameter_id + assertion_codes
source suite report path + case artifact path
Pass / Fail / Blocked / NotEvaluated disposition及reason refs
```

当前不得实例化上述字段。

---

## 6. 逐项追溯自检

| 自检项 | 当前设计结论 |
|---|---|
| AC-SBX-026~035是否各出现一次为canonical owner | 是,10 /10 |
| BR-SBX-001~033是否全部由AC-026~030覆盖 | 是,五组连续闭合 |
| truth / snapshot / ref / forbidden body是否分别有owner | 是,AC-032~035 |
| AC-SBX-031是否分离ARCH / PROTOCOL slice | 是 |
| 每项是否有正式对象 /模块 /flow | 是 |
| 每项是否有正向与关键负向TC | 是;适用项另有P0-Q真实probe |
| primary与supporting slot是否区分 | 是 |
| 每项是否有future EV form与fixed report入口 | 是;当前均未分配 /未生成 |
| P0-Q是否被fake / seam / OPS / P1替代 | 否 |
| 是否创建run、EV、report、review或结果 | 否 |
