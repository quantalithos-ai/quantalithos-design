# L3-capability-hub 06 验收标准 Step 6: 定义数据边界与架构红线验收

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 6
> 书写规范: `standards/document/验收标准书写规范.md` §5.6
> 回填章节: `06-验收标准.md` §6
> Step 状态: `in_progress / not-evaluated`
> 日期: 2026-07-26

本 Step 将 Capability Hub 的数据所有权、相邻仓职责、派生面和禁止正文转成可检查的架构红线。本文只定义红线门禁和数据归属，不提前替 Step 11 宣布一票否决，也不声称实现、扫描、artifact、report、evidence instance 或验收结论存在。

## 1. Step 状态、目标与边界

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 6 数据边界与架构红线验收 |
| Primary acceptance rows | `AC-CH-023..032`：不变量、禁止行为、相邻边界、数据归属和禁止正文 |
| 需求输入 | `BR-CH-001..037`、`BR-CH-E001`、`AC-CH-023..032`、`VF-CH-002..012` |
| 设计输入 | `01-架构设计.md` §§3~5、§8~9、§13；`03-详细设计.md` §§3、5~7、9~14；`04-配置设计.md` §§5~11 |
| 测试输入 | `TC/DS/EV-CH-FOUNDATION-*`、`STATE-*`、`TX-*`、`BIND-*`、`OBS-*`、`CONFIG-*` 与 boundary/zero-effect cases |
| 输出 | 数据分类表、10 个 AC 红线闭环、红线停审记录、P1/P2 防污染规则、跨红线审计 |
| 不在本步 | 具体 API/Event/Job 同步裁决（Step 7）、状态/TX/幂等（Step 8）、NFR（Step 9）、证据完整性（Step 10）、VETO 最终清单（Step 11） |
| 当前事实 | 所有红线为设计合同；真实实现、source scan、run、artifact、report、review、verdict 均未建立 |

Capability Hub 正向拥有的真相范围只有 capability identity、registry、adapter descriptor、governance seam relation、access-review separation、body-free method relation、formal exposure/visibility、trace/impact 和本仓维护事实。runtime/tools execution、governance approval/Policy truth、method body/source、marketplace listing/transaction、provider route/cost/quota/secret body、SDK client/cache、observability backend 只能作为负向边界或引用关系。

## 2. 本步输入与 authority precedence

| 输入 | 权威内容 | 本步使用 | 不得推断 |
|---|---|---|---|
| `00-需求文档.md` §10 | 37 条业务规则和外围边界 | 红线主语、禁止动作、显式变化要求 | 规则已执行 |
| `00-需求文档.md` §11 | 真相/快照/引用/禁止正文分类 | owner 与禁止保存矩阵 | 外部正文已被扫描 |
| `00-需求文档.md` §14 | AC/VF 需求方向 | `AC-CH-023..032` 与 veto consumer | AC/VF 已通过 |
| `01-架构设计.md` §§3~5 | 硬约束、职责、上下文与数据所有权 | 架构 owner、相邻仓 boundary | 部署或产品 ready |
| `01-架构设计.md` §8~9 | 依赖方向、一致性、truth/snapshot/ref 分层 | source/import/authority redline | 实际依赖图无违规 |
| `03-详细设计.md` §§3/5~7/9/14 | module graph、对象、protocol、state、observation forbidden surfaces | static/typed/zero-effect oracle | Rust source 已存在 |
| `04-配置设计.md` §§5~11 | source/profile/binding/failure and forbidden configuration | config redline | selected environment exists |
| `05` Step 5/6/9/13 | exact cuts、cases、checks、EV contract/path | evidence selector | evidence instance exists |
| Step 5 | functional gate and P1 isolation | 功能与红线交叉影响 | 功能 gate 已执行 |

Authority order for a conflict is:

```text
active 00 requirement/data boundary
  > active 01 architecture ownership/dependency
  > active 02 HLD object/component boundary
  > active 03 DDD contract/flow/state/observation
  > active 04 configuration boundary
  > active 05 test/evidence contract
  > historical formal 06/README/old objects
```

Any conflict with historical `ProviderContract`, `CapabilityDecision`, `CostRecord`, `QueryCapabilities`, KMS/Vault topology, runtime gateway, marketplace listing or retired numeric threshold is recorded as historical material and does not alter an active redline.

## 3. SOP 五问回答

| 问题 | L3-capability-hub 收口答案 |
|---|---|
| 哪些数据不得由本仓保存？ | 外部 provider/secret/KMS/Vault、runtime/tools execution/result、governance approval/Policy/shared_rules、method body/source/version、SDK client/package/cache、marketplace listing/transaction/pricing/fulfillment、cost/billing、observability log/trace/metric/audit store 正文均不得进入 Hub。允许的只是 typed ref、body-free relation、safe summary、bounded snapshot 或本仓自己的 access truth。 |
| 哪些下游不得反写真相？ | runtime、tools、SDK、console、marketplace、observability、报告/导出、search/browse、consumer feedback、event collaboration 和 maintenance job 都不得创建、修正、合并、拆分或覆盖 identity/registry/descriptor/seam/relation/exposure truth。 |
| 哪些 projection/cache 不得反写？ | controlled consumer view、directory projection、audit-friendly export summary、ecosystem discovery summary、safe summary、reconciliation report、consumer impact summary、任何 cache 或 search index 只能从正式 truth 派生。 |
| 哪些 P1/P2 不得污染 P0？ | 管理入口、搜索优化、候选发现、安全摘要深化、SDK 说明、生态发现、审计导出、真实产品/staging/production、capacity/SLO 和观测后端不可成为 P0 红线通过依据或替代 canonical cases。 |
| 红线失败是否直接 VETO？ | 本 Step 先定义可检查 redline 与 potential impact；Step 11 才将命中 `VF-CH-*` 的项正式列为不可waive veto。任何红线真实失败都至少阻断相关 AC；不能用风险接受直接覆盖。 |

## 4. 当前材料问题诊断与取舍

| 旧/当前材料问题 | 风险 | 本 Step 处理 |
|---|---|---|
| 旧 formal 06 将 provider、cost、KMS、runtime 和 approval 写成 Hub acceptance owner | 责任越界、产生错误正向证据 | active boundary 取代旧 owner；外部面只做 negative/ref check |
| 数据表只写“不保存正文” | 无法区别 truth、snapshot、ref、forbidden body | 建立四类数据契约和 owner/source/lifecycle/no-write predicate |
| projection/report 被写成可修复 truth | 派生面变成第二真相源 | 所有 derived/maintenance rows 强制 source-read + zero-core-write |
| 下游未就绪被当作 Hub 失败或 Hub 通过 | 混淆 seam 与完整下游产品 | 用 dependency kind + scope manifest 分离；P1/selected 不补偿 P0 |
| 静态扫描和 runtime negative evidence混在一起 | 无法定位违规 | foundation static、flow zero-effect、config redaction、observation boundary分别绑定 exact contract |

| 取舍议题 | 选择 | 原因 |
|---|---|---|
| 是否在本步直接把所有红线命名为 VF | 否，保留 AC primary + VF secondary impact | VETO 由 Step 11 统一裁决，避免跨 Step 合并 |
| 是否要求真实 provider/治理/marketplace 系统参与 P0 | 否，采用 controlled/fake/disabled seam + forbidden corpus + zero-effect oracle | P0 验的是 Hub boundary，不是相邻产品完整实现 |
| 是否允许 snapshot 在缺 truth 时“临时补真相” | 否 | snapshot 只可呈现 explicit unavailable/partial/stale；不得升级为 owner |
| 是否保留旧对象名作兼容别名 | 否 | alias 会让 historical truth 回流 active baseline；旧名只在 historical audit 出现 |
| 是否引入数字安全/性能阈值 | 否 | 本 Step 只验结构性 ownership/redline；旧阈值已退休 |

## 5. 数据分类与 owner contract

### 5.1 四类数据模型

| 类别 | Hub 可以拥有的内容 | 典型成员 | 允许变化来源 | 明确禁止 |
|---|---|---|---|---|
| `truth` | 本仓正式接入/关系/变化事实 | `CapabilityIdentity`、`CapabilityRegistryEntry`、`AdapterDescriptor`、`GovernanceSeamRelation`、`CapabilityMethodBodyFreeRelation`、`FormalExposureBoundary`、`FormalVisibilityApplicability`、trace/impact/change record | 仅声明的 Command、合法 inbound relation update 或本仓明确定义的维护事实 | consumer、Query、Job、projection、report、external result 反写或隐式修正 |
| `snapshot` | 对外部 truth 或本仓 truth 的 body-free 派生视图 | governance/secret safe summary、controlled view、directory/search/browse、export/discovery、downstream impact summary、reconciliation report | 由正式 source 的显式版本/范围派生，可标 stale/partial/unavailable | 独立 truth lifecycle、反向创建 identity/registry/exposure、保存正文 |
| `reference` | 指向外部对象/消费方/文档/观测位置的 typed ref | external source、governance result、method asset、secret、runtime/tools consumer、SDK consumer、observability/audit、document/ecosystem ref | 外部来源变化通过 typed inbound/resolver contract进入 | 复制 locator body、正文、外部 lifecycle、执行结果或 approval |
| `forbidden body` | 不属于 Hub 的正文和产品状态 | secret/credential、provider request/result、method content、Policy/approval、SDK package/client、listing/transaction、raw telemetry/audit、cost/billing | 无 | 任何 object/DTO/store/event/report/config/raw artifact 持久化或发出 |

### 5.2 Truth owner matrix

| Subject | Hub status | Canonical owner | Allowed consumers | Redline |
|---|---|---|---|---|
| capability identity/access context | owned truth | capability-hub identity module | registry, descriptor, seam, method, exposure, downstream refs | URL/provider/config/listing cannot substitute |
| registry/lifecycle/visibility semantics | owned truth | capability-hub registry module | queries, formal exposure, derived views | not allowlist/cache/listing/runtime state |
| adapter descriptor/risk summary | owned truth | capability-hub descriptor module | exposure/consumer/ref surfaces | no provider runtime/route/quota/cost/secret body |
| governance seam/access-review separation | relation truth | capability-hub seam module + upstream result ref | exposure and audit-friendly consumers | no approval/Policy/shared_rules creation |
| method relation | body-free relation truth | capability-hub relation module | exposure/trace/consumer surfaces | no method body/source/lifecycle |
| formal exposure/visibility/applicability | owned server truth | capability-hub exposure module | runtime/tools/SDK server-boundary consumers | no consumer-side authority or execution decision |
| trace/change/impact | owned access-change truth | capability-hub trace/impact modules | event collaboration and reports | no observer/audit backend as source |
| derived material | snapshot/maintenance fact | capability-hub derived job boundary | read-only consumers | no core repair or source substitution |
| external internals | not owned | respective source system | typed ref/resolver only | no body, secret, cost, execution or product state |

### 5.3 Required source/version symmetry

Every snapshot, reference, event capture, controlled view and maintenance report must retain enough typed source identity to answer:

```text
which formal truth owner -> which subject/version -> which scope/applicability
  -> which derivation/consumer -> which state/reason/result
```

Missing owner, subject, version, scope, source ref, or result symmetry is a consistency/redline failure, not a permissible degraded success. A declared unavailable external source may produce a typed unavailable/ref state; it may not produce a synthetic truth.

## 6. Evidence and verdict contract for redlines

### 6.1 Fixed path template

For every redline selector:

```text
case raw   = artifacts/test/<run_id>/suites/<primary-suite>/cases/<tc-id>.json
suite raw  = artifacts/test/<run_id>/suites/<primary-suite>/suite-result.json
report     = reports/runs/<run_id>/suites/<primary-suite>.md
index      = reports/runs/<run_id>/evidence-index.md
```

The path is a future contract. It is not evidence existence, and no `<run_id>` is currently claimed.

### 6.2 Redline result semantics

| Result | Redline interpretation |
|---|---|
| `passed` | All required static/typed/zero-effect/redaction assertions are raw-derived passed in one explicit run; no forbidden body and no owner violation. |
| `failed` | A forbidden body/write/import/owner, reverse truth mutation, source/version contradiction, or P0 redline oracle failure is observed. |
| `blocked_dependency` | Required prerequisite or selected scope dependency is unavailable; cannot be treated as redline pass. |
| `invalid_artifact` | Cross-run, missing digest, static/manual evidence, schema/path/pairing or redaction provenance is invalid. |
| `not_evaluated` | No real run/result exists, as in this design workspace. |
| `not_decided` | Evidence exists but required review/authorization is not complete. |

`failed`, `blocked_dependency`, `invalid_artifact`, `not_evaluated` and `not_decided` are not pass. Step 13 may consider only eligible residuals that do not touch truth ownership, forbidden bodies, evidence integrity, VF or current P0; it cannot waive a redline failure.

## 7. `AC-CH-023..032` 架构红线门禁表

每行是一个 primary redline gate。`TC/DS/EV` selector 仍使用 formal 05 的同 ordinal identity；若同一 canonical EV 被多个 AC 消费，仍只有一个 primary suite/run-scoped evidence instance。`release-main-smoke`、P1 selected、real product、staging/production 和 capacity/SLO 均不能替代本表的 canonical evidence。

| AC | 红线主题与正式来源 | Exact TC / DS / EV selector | 通过条件 | 失败条件 | 固定报告入口与 verdict impact |
|---|---|---|---|---|---|
| `AC-CH-023` | `BR-CH-001..009` 核心不变量；03 §§5~10 identity/registry/descriptor/seam/relation/exposure/derived | FOUNDATION `{001,002,012,013,014,015}`; CMD `001..021`; QUERY `001..019,024..028`; STATE `001..017,024`; TX `001..022`; BIND `001..012`; OBS `001..012` | identity、registry、descriptor、seam、method relation、formal exposure 及 derived source 均有独立 typed owner；identity anchors registry；registry/descriptor/seam/relation/exposure states和 source/version/history 维持 formal invariant；derived outputs read-only且可回溯 source。 | URL/provider/tool/runtime/listing/allowlist/cache替代 identity/registry；safe summary、view、report、event、job成为 truth；任一 invariant 缺 field、wrong owner、illegal transition、reverse write 或 source asymmetry。 | `static-contract-docs`, `domain-state`, `service-command-query`, `repository-transaction`, `runtime-binding`, `observability-redaction`；缺失/失败阻断 AC023，并作为 `VF-CH-001/002/003/004/005/006/007/008/010` 的 secondary input。 |
| `AC-CH-024` | `BR-CH-010..019` 禁止行为；03 §§3/7~8/14、04 sensitive/failure sections | FOUNDATION `008..011`; QUERY `001..033`; INBOUND `001..006`; OUTBOUND `001..010`; JOB `001..008`; OBS `006,008,012`; CONFIG `008,016`；all relevant `BIND` | Query/read/browse/export/consume/maintenance/event/job 对 core truth 的 writes/calls=0；forbidden corpus 在 decode/persist/emit 前被 typed rejection/quarantine；approval/Policy、method body、SDK/client、marketplace、provider/cost/secret/observability body 不出现在 public/store/event/report/config surfaces。 | 任一 reverse write、implicit mutation、raw body leakage、provider/approval/method/SDK/marketplace/telemetry/cost owner、generic text bypass 或 observer cancellation；negative check只扫静态文本但没有 runtime zero-effect oracle（或反之）。 | `static-contract-docs`, `service-command-query`, `entry-inbound`, `outbound-collaboration`, `jobs-lifecycle`, `observability-redaction`, `configuration-strict`; failure blocks AC024 and is non-waivable candidate for `VF-CH-004..007,011`. |
| `AC-CH-025` | `BR-CH-020..026` 显式变化；03 §§8~12 Command/state/trace/capture | FOUNDATION `003,007,012,016,018`; CMD `001..026`; OUTBOUND `001..010`; JOB `001..008`; STATE `001..024`; TX `001..022` | identity merge/split/correct/retire、registry lifecycle/visibility、descriptor replace/summary、review/seam、method relation、exposure/visibility 和 maintenance/collaboration outputs only change through declared owner/flow; each accepted delta has source, scope, version, trace/history/capture/result as specified; no-op remains no-op. | Query, projection, cache, inbound feedback, derived report, event consumer or Job implicitly creates/merges/replaces/repairs truth; missing change record/trace/capture; same-value changed-reason mishandled; source/old/new version not symmetric. | `service-command-query`, `domain-state`, `outbound-collaboration`, `jobs-lifecycle`, `repository-transaction`; missing exact change/capture evidence blocks AC025 and feeds `VF-CH-009/010`. |
| `AC-CH-026` | `BR-CH-027..033` adjacent responsibility/dependency boundaries；01 §4/§8、03 §§3/7/13~14 | FOUNDATION `008..010`; QUERY `018,019,27,31,32,33`; INBOUND `001,002,004,005`; OUTBOUND `003..006,009,010`; BIND `005,006,009,010,012`; OBS `001..012` | dependency graph has only declared `L0-core/core-contracts` compile edge; runtime/tools, governance, method-library, SDK, provider/secret/cost, marketplace and observability are represented only by correct ref/API/event seam; no sibling source import, copied type, direct store, or hidden external truth owner. | illegal sibling import or copied contract; Hub owns execution/approval/method body/SDK client/marketplace/cost/observability store; direct source coupling replaces declared seam; dependency missing is incorrectly passed by pretending full downstream implementation. | `static-contract-docs`, `runtime-binding`, `entry-inbound`, `outbound-collaboration`, `observability-redaction`; dependency/responsibility reports fixed under run root; failure blocks AC026 and may trigger `VF-CH-012`. |
| `AC-CH-027` | `BR-CH-034..037` governance/trace constraints；03 §§8~10/14 | CMD `004,013..015,018..023`; QUERY `011,012,15..23`; INBOUND `001,002`; OUTBOUND `004,005,006,008,009`; STATE `002,005,007,009..13`; OBS `004,008,012` | Formal visibility/use has an exact governance seam source when required; high-risk descriptor/exposure changes preserve review-vs-approval separation; every key change/derived output declares source, scope, trace, capture/result; observability/audit refs explain but do not source truth. | local review/summary/allowlist substitutes governance result; high-risk change bypasses seam; trace/capture/source/scope/result missing or generated from log/audit body; derived report becomes event source for core truth. | `service-command-query`, `entry-inbound`, `outbound-collaboration`, `domain-state`, `observability-redaction`; failure blocks AC027 and is secondary input to `VF-CH-005,009`. |
| `AC-CH-028` | `BR-CH-E001` peripheral truth isolation；AC022/FR-E01~E07；03 derived/view/job boundary | QUERY `019,024..028`; JOB `002..006`; OUTBOUND `009`; STATE `015..017,024`; TX `013,014,020,021`; OBS `001..012` | peripheral management/search/discovery/safe-summary/SDK-description/ecosystem/export surfaces are either explicitly absent by scope manifest or consume only formal truth; their failure/unavailability produces selected/P2 limitation, not P0 truth change; core writes=0 and forbidden body=0. | peripheral absence silently removes P0 selectors; UI/search/discovery/export/SDK explanation/listing/report/job changes core truth; P1/production result used as P0 evidence; marketplace, audit body or client cache becomes owner. | `service-command-query`, `jobs-lifecycle`, `outbound-collaboration`, `repository-transaction`, `observability-redaction`; failure affecting only declared peripheral claim stays selected-blocked, but leakage blocks AC028 and overall acceptance. |
| `AC-CH-029` | data ownership: Hub truth; 00 §11.1, 01 §9, 03 §§5~6/9 | FOUNDATION `001,002,012`; CMD `001..026`; STATE `001..024`; TX `001..022`; BIND `001..004,007..010`; OBS `004,012` | only capability-hub-owned truth subjects are persisted/returned as truth: access context/identity, registry/lifecycle/visibility, descriptor/risk, seam/access-review separation, body-free method relation, trace/impact, formal exposure/visibility and declared maintenance fact; each owner/current/history/index is exact. | any external or derived surface declares ownership of those subjects without formal contract; duplicate truth store, shadow registry, consumer-side authority or hidden private finder; owner/version/index contradiction is degraded instead of consistency defect. | `static-contract-docs`, `domain-state`, `service-command-query`, `repository-transaction`, `runtime-binding`; evidence index consumer `EV` rows under fixed run path; failure blocks AC029 and supports `VF-CH-001/003/010`. |
| `AC-CH-030` | snapshot is not second truth；00 §11.1 snapshot rows、03 §§8~10/14 | QUERY `017,024..028`; INBOUND `003,005,006`; OUTBOUND `007,009,010`; JOB `002..006`; STATE `014..17,19,23,24`; TX `013,014,17..21`; OBS `004,006,008,11,12` | governance/secret safe summaries, controlled view, directory/search/browse/export/discovery, downstream impact summary, reconciliation and observation summaries retain source/version/scope/freshness/reason and are rebuildable; stale/partial/unavailable is explicit; no core truth write. | snapshot creates lifecycle/identity/registry/exposure truth; stale view is used as current source; report/derived output repairs core data; source/version/scope omitted; cache or projection has hidden write authority. | `service-command-query`, `entry-inbound`, `outbound-collaboration`, `jobs-lifecycle`, `repository-transaction`, `observability-redaction`; failure blocks AC030 and maps to `VF-CH-007/009/010`. |
| `AC-CH-031` | references do not own body；00 §11.1 refs、03 reference-resolution/ref objects、04 sensitive bindings | CMD `009..017,024..026`; QUERY `007..14,19,29..33`; INBOUND `001,002,004..006`; OUTBOUND `003..006,010`; BIND `005..012`; OBS `006,008,012`; CONFIG `008,016` | external source/governance/method/secret/runtime/tools/SDK/observability/document/ecosystem refs are typed, body-free, subject/kind/digest/state/source-symmetric; resolver unavailable/forbidden remains typed ref/state; no body load or lifecycle transfer. | ref stores locator/body/credential/method/approval/SDK/package/listing/telemetry content; generic string or raw bytes bypass typed union; resolver result asymmetry accepted; ref state triggers forbidden mutation. | `service-command-query`, `entry-inbound`, `outbound-collaboration`, `runtime-binding`, `configuration-strict`, `observability-redaction`; failure blocks AC031 and supports `VF-CH-004..006,011`. |
| `AC-CH-032` | forbidden body absence；00 §11.2, 01 hard constraints, 03 §3.4/§14, 04 §8/§11 | FOUNDATION `001,005,006,008..011`; CMD `004,009..13,16,22..26`; QUERY `007..09,11..13,19,26,27,30..33`; INBOUND `001,002,004..06`; OUTBOUND `003..06,09,10`; JOB `004,005`; OBS `006,008,012`; CONFIG `008,016` | source scan, strict protocol inventory, typed constructors, redaction scan, runtime negative cases and report projection all show zero forbidden body/material in declaration, DTO, store, event/capture, config, artifact or report; findings retain only safe class/location/digest. | secret/provider request/result/cost, approval/Policy, method body, SDK client/package/cache, marketplace listing/transaction, raw log/trace/metric/audit, production request/response or LLM routing material appears anywhere in active surface; finding leaks the material itself. | `static-contract-docs`, `service-command-query`, `entry-inbound`, `outbound-collaboration`, `jobs-lifecycle`, `runtime-binding`, `configuration-strict`, `observability-redaction`; failure blocks AC032, cannot be risk-accepted, and is Step 11 VETO candidate. |

## 8. P1/P2 防污染规则

| 场景 | 允许的验收使用 | 不允许的替代行为 | 影响 |
|---|---|---|---|
| management/search/discovery/export/SDK explanation | 作为 derived snapshot/selected claim 的独立证据，消费已存在的 formal truth | 用外围结果减少 P0 selector，或让 UI/listing/export成为 truth | peripheral failure只影响 selected claim；越界写阻断 AC028/整体 |
| real product/staging/production | 仅在 immutable selected/R4 manifest明确选择时作后置集成证据 | 以产品存在证明 Hub ownership/redline；用 production通过掩盖 canonical P0缺口 | 不补偿 P0；缺失为 selected/R4 blocked |
| capacity/SLO/numeric performance | 仅在正式 NFR/controlled reopen有来源时记录 | 重新引入旧 P95/30s/100%/SLA阈值 | 当前保持 `not_evaluated` |
| observability backend/audit store | 只消费或提供 typed ref/safe summary | 作为 identity/registry/trace truth 或正文存储 | redline failure，不能 waiver |
| governance/method/provider/SDK downstream not ready | controlled/fake/disabled seam证明边界和 unavailable语义 | 要求相邻仓完整实现，或把缺失当作 Hub 正向失败/成功 | 按 dependency/scope manifest裁决，不改变 owner |

## 9. 红线逐项停审记录

| AC | 正式 owner/source 是否明确 | 静态/typed/zero-effect 证据是否固定 | pass/fail/blocked 是否可分 | P1/后续 Step 是否污染 | 设计停审 |
|---|---|---|---|---|---|
| `AC-CH-023` | yes；00/01/03 truth matrix | yes；foundation + state/flow/TX | yes | no | `pass-designed / not-evaluated` |
| `AC-CH-024` | yes；BR forbidden matrix | yes；static + zero-effect + redaction | yes | no | `pass-designed / not-evaluated` |
| `AC-CH-025` | yes；Command/state/change contracts | yes；flow/state/TX/capture | yes | no | `pass-designed / not-evaluated` |
| `AC-CH-026` | yes；01/03 dependency boundary | yes；dependency/responsibility/Rustdoc | yes | no | `pass-designed / not-evaluated` |
| `AC-CH-027` | yes；BR034~037 and seam/trace | yes；seam/trace/observation | yes | no | `pass-designed / not-evaluated` |
| `AC-CH-028` | yes；BR-E001/AC022 | yes；derived/no-write/selected | yes | no | `pass-designed / not-evaluated` |
| `AC-CH-029` | yes；00/01/03 owner matrix | yes；owner/index/state | yes | no | `pass-designed / not-evaluated` |
| `AC-CH-030` | yes；snapshot matrix | yes；source/version/freshness/no-write | yes | no | `pass-designed / not-evaluated` |
| `AC-CH-031` | yes；ref union/locator contracts | yes；typed body-free/redaction | yes | no | `pass-designed / not-evaluated` |
| `AC-CH-032` | yes；forbidden corpus/03/04 | yes；static + runtime negative + redaction | yes | no | `pass-designed / not-evaluated` |

## 10. 跨红线裁决审计

| 审计项 | 设计结论 | 后续 owner |
|---|---|---|
| AC primary coverage | `AC-CH-023..032` 10/10；每项唯一 primary redline owner | Step 15 assembly |
| BR coverage | `BR-CH-001..037` 均在至少一条 AC/VF boundary selector中；`BR-CH-E001`由 AC022/028隔离 | Step 15 reverse audit |
| data categories | truth/snapshot/reference/forbidden body 四类均有 owner、source、lifecycle、negative condition | Step 8/10 cross-check |
| responsibility leakage | runtime/tools、approval/Policy、method body、marketplace、provider/secret/cost、SDK client、observability backend均只有 negative/ref usage | Step 11 VETO / Step 15 |
| derived reverse write | Query、event、job、projection、report、cache均有 zero-core-write predicate | Step 7/8/10 |
| dependency typing | compile/runtime/event seam分别按正式依赖类型裁决，不要求下游完整实现 | Step 7 |
| P1/P2 contamination | selected/production/capacity/SLO不会进入 P0 redline pass predicate | Step 9/12 |
| historical leakage | old object/topology/threshold/TC/signer active rows=0 | Step 15 / VF013 |
| VETO boundary | 本步只登记 secondary impact；最终 non-waivable list留 Step 11 | Step 11 |
| unresolved upstream blocker | `0`；若 active 00/01/03/04/05 source drift，受控回开对应 source step | controlled reopen |

## 11. 回填草稿：formal `06-验收标准.md` §6

正式章节只承载：

1. truth/snapshot/reference/forbidden body 四类数据归属；
2. `AC-CH-023..032` 红线表的正式主题、通过条件、失败条件和证据入口；
3. Query/derived/event/job/cache/report 不反写真相、相邻仓职责不越界和唯一编译依赖红线；
4. P1/P2、真实产品、staging/production、observability backend 和 capacity/SLO 不补偿 P0；
5. redline failure 影响相关 AC，命中 `VF-CH-*` 的最终一票否决由 §11 裁决；
6. 本章不写真实运行结果、风险接受、人员、签署或历史对象兼容别名。

## 12. 待确认事项与受控重开

| 事项 | 当前状态 | 处理 |
|---|---|---|
| 具体外部系统/产品是否选为 P1 | 未选择 | 由 immutable scope manifest决定，不改变 P0 owner |
| physical DB/cache/broker/backend | 未固定 | 只验 typed boundary/owner/no-write；具体形态由 07 前置与实现约束决定 |
| forbidden corpus 的实际文件/fixture | 未生成 | 05 DS/07 implementation handoff定义；本文件只固定类别、safe finding和路径合同 |
| numeric threshold | 无 active source | 保持 `not_evaluated`，不得从历史材料恢复 |
| source drift | 未发现 | 若发现，回开 00/01/03/04/05 owner step，不在 06 局部修文 |

## 13. Step 6 完成门禁与下一步

| 条件 | 结果 |
|---|---|
| 四类数据边界定义完整 | `pass-designed` |
| `AC-CH-023..032` 逐项红线闭环 | `10/10; pass-designed` |
| `BR-CH-001..037`、`BR-CH-E001` 可追溯 | `38/38 planned; no orphan` |
| static/typed/zero-effect/redaction evidence selectors | `closed; no real instance claimed` |
| P1/P2/selected/production/capacity不污染 P0 | `closed` |
| Step 11 VETO 未被提前合并 | `closed` |
| implementation/run/artifact/report/evidence/verdict/signoff facts | none claimed |
| unresolved upstream blocker | `0` |
| formal `06-验收标准.md` modified | `no; Step 15 only` |
| 下一步 | `enter_06_step_07_interfaces_events_sync` |

Step 6 的 `pass-designed` 只表示红线设计静态闭合，不表示任何红线已在真实交付物上通过。
