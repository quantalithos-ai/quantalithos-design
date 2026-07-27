# Step 10. 定义可观测性、审计与证据门禁

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 10
> 书写规范: `standards/document/验收标准书写规范.md` §5.10
> 回填章节: `06-验收标准.md` §10 可观测性、审计与证据门禁
> 参考粒度: `projects/L1-governance/design-calibration/06_acceptance_step_10_observability_evidence.md`
> 当前模式: full-restart / continuous execution

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 10 定义可观测性、审计与证据门禁 |
| 当前状态 | completed; design-only; no execution fact |
| 上一步 | `06_acceptance_step_09_nonfunctional.md` 已完成 |
| 输入基线 | active formal `00~05`; `03` §14; `03_ddd_step_15_observability_audit.md`; `05` §9 / §13 / §14; Steps 5~9 artifacts |
| 输出文件 | `projects/L3-capability-hub/design-calibration/06_acceptance_step_10_observability_evidence.md` |
| 正式文档 | `06-验收标准.md` 未修改; 仅 Step 15 可整体装配 |
| 真实事实 | implementation、run_id、artifact、report、evidence instance、review、verdict、signoff 均未建立 |
| blocker | unresolved upstream design blocker = `0` |
| 下一步 | `enter_06_step_11_veto` |

本文件中的 `EV-CH-*` 是 `05` 定义的 formal evidence contract。它不是实际 evidence alias、不是 run-scoped instance，也不是测试结果。Step-local gate ID 只用于本 Step 的裁决结构，不增加 formal `AC-CH-001..037` 的需求库存。

## 2. 本步目标与边界

本 Step 将可观测性、审计载体、测试 raw artifact、suite report、evidence index、验收交接和 review 组织成可判定的证据门禁。目标是让后续真实验收能够回答“某项结论来自哪一个明确 run、哪一个 canonical case、哪一份 raw artifact 和哪一个生成的 report”，而不是把日志摘要或人工表格当成事实来源。

本 Step 只回答：

- 哪些 capability-hub 业务行为必须有 trace、safe log、metric、durable audit projection 或 report marker。
- 哪些 `EV-CH-*` 必须从同一 run 的 TC/DS/raw/report/digest 链推导。
- `reports/runs/<run_id>`、`artifacts/test/<run_id>`、`reports/acceptance/*` 和 `reports/review/*` 各自的 authority 与用途。
- redaction、dependency boundary、responsibility boundary、artifact/report pairing、no-static-evidence 和 report audit 失败如何影响验收。
- acceptance handoff、veto checklist、risk acceptance 和 open issues 如何作为审查入口而不冒充最终结论。

本 Step 不回答：

- 具体 observability backend、crate、dashboard、alert、SLO、retention days 或部署拓扑。
- 运行日志是否已经产生、某个 metric 是否达到阈值或某个 report 是否已经通过。
- 真实实现仓、CI、run、digest、reviewer、acceptor、签名和验收 verdict。
- runtime execution、tools execution、governance approval、method body、marketplace transaction、provider route/cost 或 SDK client 的业务真相。

## 3. 本步输入与权威顺序

| 输入 | authority | 本 Step 消费内容 | 不得推断 |
|---|---|---|---|
| `00-需求文档.md` | active formal requirement | `AC-CH-001..037`、`VF-CH-001..013`、NFR/BR 数据红线和五个 core closure | 实现或验收结果 |
| `01-架构设计.md` | active formal architecture | truth owner、依赖裁剪、观察面与外部 seam 边界 | 产品可用性 |
| `02-概要设计.md` | active formal HLD | 43 objects、8 components、protocol/flow/state skeleton | evidence instance |
| `03-详细设计.md` §14 | direct observation contract | 6 layers、4 planes、60 log、48 metric、27 span + 3 event、20 durable profiles、redaction | backend 已选择 |
| `03-详细设计.md` §15 | test handoff | oracle precedence、12 OBS cuts、safe signal negative cases、planned report contracts | script 已存在 |
| `03_ddd_step_15_observability_audit.md` | exact calibration source | profile owner、phase、carrier、forbidden material、155/155 coverage和hard-stop | 真实 signal |
| `04-配置设计.md` | direct config contract | strict config、sensitive/no-output、activation、failure和audit边界 | selected environment |
| `05-测试方案.md` §9 | automation contract | 10 primary suites、5 gates、9 checks、4 builders、fixed roots | CI 已运行 |
| `05-测试方案.md` §13 | evidence contract | 189 `EV-CH-*`、raw/report schema、generation order、same-run pairing、retention rule | EV alias/result |
| `05-测试方案.md` §14 | regression/risk contract | failed-run保留、retest pairing、不可接受项和residual边界 | risk 已接受 |
| Steps 5~9 artifacts | acceptance calibration | AC/VF、functional/redline/interface/state/NFR gate consumer direction | formal 06 已装配 |
| L1 reference Step 10 artifacts | framework reference | 表格、证据流、停审和审计粒度 | domain ID或阈值 |

权威顺序固定为：formal `00` 的责任与边界 -> formal `03` 的可观测性和持久化载体 -> formal `05` 的测试与证据合同 -> 本 Step 的验收裁决门禁。旧 formal `06` 的 API/DB/audit-entry、旧对象、旧 topology、旧 threshold 和空白签署不进入当前链路。

## 4. SOP 问题回答

| SOP 问题 | 本项目裁决 |
|---|---|
| 哪些行为必须有 audit record、trace 或 safe marker? | 六类 accepted truth change、`AFP-TRACEABILITY` / `AFP-IMPACT`、body-free reference/material/report revision、inbound receipt、event capture、Job journal/report、config validation failure、dependency/redaction/report audit、handoff preparation 都必须能回指对应 durable carrier 或固定 report marker。 |
| 哪些行为必须有 runtime observation? | 26 Command、33 Query、6 Inbound、10 Outbound、8 Job、API/Worker/Jobs entry、UoW/resolution、repository/Port call、configuration Stage 0~7 和 observer boundary 各有既有 profile；Query 不得因观测而写业务事实。 |
| 哪些信号能够证明业务真相? | 只有对应 owner 的 typed persisted truth、change record、exact sidecar、snapshot/capture、Job journal/report 等设计载体；log、metric、span/event 只能观察，不能建立、修复或替代真相。 |
| 哪些报告必须归档? | blocking suite reports、run summary、gate summary、evidence index、redaction check、dependency boundary、responsibility boundary、report audit，以及 acceptance handoff、open issues、veto checklist、risk acceptance 和 review notes。 |
| 证据如何复查? | 从 `reports/runs/<run_id>/evidence-index.md` 回指 exact `EV-CH-*`、TC/DS、suite report、case raw、suite raw 和 digest，再检查同 run、redaction、pairing、no-static 和 review 状态。 |
| P0 EV 缺失或无法回源如何裁决? | 不能通过；若缺失原因尚不能分类为已知失败，则状态为 `not_evaluated` 或 `invalid_artifact`，验收停在不可裁决，不得手工补成 passed。 |
| `reports/acceptance/*` 能否替代 raw/report? | 不能。它们只汇总送验范围、问题和审查入口；不能创建 EV、升级 status、替代 suite raw/report、覆盖失败或生成签署。 |
| 是否允许静态 evidence index、默认 passed、`latest` 或跨 run 拼接? | 全部禁止。任何一种出现都触发 evidence integrity failure；release smoke、nightly 或人工说明不能补偿 main 的 canonical denominator。 |
| redaction / dependency / responsibility / report audit 失败是否可风险接受? | 不能。它们属于当前 P0 证据与责任红线；Step 11 进一步复核为 VETO，Step 13 不得把它们列为可接受 residual。 |
| 本 Step 是否填写真实结果? | 不填写。所有状态只表达 design contract 或 future execution state vocabulary；当前真实 instance、run、report、review 和 verdict 均为空。 |

## 5. 当前文档问题诊断

| 历史或现有材料 | 问题 | 本 Step 处置 |
|---|---|---|
| 旧 `06-验收标准.md` 的 API/DB/log/audit entry 证据 | 没有 canonical TC/DS/EV、run、raw/report/digest链 | 仅作 historical diagnostic；改用 `EV-CH-*` + fixed roots |
| 旧 `ProviderContract`、`CapabilityDecision`、`CostRecord` 和 provider/runtime topology | 与当前 identity/registry/descriptor/seam/relation/exposure owner冲突 | 不创建 alias；不得出现在 P0 evidence consumer |
| 旧 P95、30s、99.9% 和 100% 数字 | 无 active workload/threshold source，已被 formal 00 退休 | 保持 Step 9 的 numeric `not_evaluated`；不在 evidence gate 复活 |
| `05` 的 candidate evidence | 若直接把 candidate 当结果，会混淆设计合同和真实 instance | 保持三层身份：candidate -> formal contract -> run-scoped instance |
| `reports/acceptance/*` | 容易被误认为最终 acceptance truth | 只作 handoff/review input；最终结论留给 Step 14 schema |
| Observability profile | 观测面可能被误用为业务真相、重试或恢复来源 | 固定 six-layer/four-plane one-way authority 和 zero-substitution rules |
| failed / timeout / unavailable run | 删除失败 raw 或用 retry pass 覆盖会破坏可复盘性 | 保留 immutable safe failure material；status 不可升级 |
| 外部产品、observer backend 和 retention policy | 当前未选型 | 记录为 future prerequisite / controlled reopen，不扩大本 Step |

## 6. 改动前后对比

| 项 | 旧或未闭合口径 | 本 Step 口径 | 裁决原因 |
|---|---|---|---|
| evidence identity | candidate、alias、结果混用 | `EVC-CH-*` -> `EV-CH-*` -> explicit `(run_id,evidence_id)` instance | 维持设计合同与运行事实分离 |
| evidence source | 静态表、手写 JSON、人工摘要 | same-run case raw + suite raw/report + verified digest | 防止伪证据和跨 run 拼接 |
| observation authority | log/metric/trace 可被当成 truth | typed owner carrier only；four observation planes one-way | 防止第二真相源和自动修复 |
| report authority | human report 可覆盖 raw | raw-derived report；report 不能升级 status | 保留失败和不完整事实 |
| acceptance handoff | 可被解释成“已通过” | 只作送验/审查入口，无默认 verdict/signature | 分离交接与裁决 |
| redaction scope | 只扫单一 log 或 artifact | 扫 artifact root 与 report root，required/optional/atomic 规则 | 防止报告二次泄露 |
| downstream coverage | release smoke 可能代替底层 suite | 10 suite / 189 denominator 是底层 authority；smoke 只汇总代表链 | 防止 aggregate count 假通过 |
| failure retention | retry pass 覆盖失败 | failed/timeout/flaky/blocked/invalid 均保留 safe raw/report | 支持复验和审计 |

## 7. 验收裁决取舍

| 议题 | 候选 | 采用方案 | 影响 |
|---|---|---|---|
| 是否新增 Step-local formal AC | A. 扩充 `AC-CH` 库；B. 使用 `EVG-CH` gate ID并引用既有 AC | 采用 B | 保持 `37` 个 formal AC 不变；Step-local gate不成为新需求 |
| evidence index 是否可静态生成 | A. 可以；B. 只能从 verified same-run pair 生成 | 采用 B | 静态映射、orphan、跨 run 全部无效 |
| Observability 是否可作 acceptance oracle | A. 可替代 typed state；B. 只作 observation-plane assertion | 采用 B | 业务真相仍由 typed/persisted owner证明 |
| failed suite 是否可删除 | A. 只留最新 pass；B. 保留 immutable failure material | 采用 B | 失败/复验关系可审计，旧失败不能被覆盖 |
| acceptance handoff 是否可代替 raw | A. 可以；B. 只能作 review input | 采用 B | 缺 raw/report 时不可通过或不可裁决 |
| redaction failure 是否可风险接受 | A. 可由解释补偿；B. 进入 hard stop/VETO | 采用 B | 禁止 secret/body/forbidden owner 进入验收证据 |
| release smoke 是否可代替 189 cases | A. 可以；B. 只能汇总代表性链 | 采用 B | 不削减 Command/Query/Inbound/Outbound/Job/state 分母 |

## 8. 观测与审计 authority 模型

### 8.1 六层载体

| Layer | capability-hub owner/meaning | 可证明 | 绝不能证明或替代 |
|---|---|---|---|
| L1 runtime signal | exact callsite 的 structured log、metric、span/event | 调用阶段、typed outcome、safe category、低基数统计 | business truth、durability、replay、recovery、acceptance |
| L2 accepted truth/audit fact | 六类 change record、traceability、impact 在 Durable UoW 后的投影 | 本地已提交的变化/追溯/影响载体 | external delivery、approval、execution、signoff |
| L3 operations/derived fact | reference、feedback、material、reconciliation carrier | body-free owner revision 和 derived result | core truth correction、marketplace/runtime truth |
| L4 continuity fact | stored result/receipt、snapshot/capture、Job journal/report | 本载体自己的重放、连续性和执行记录 | 更高层 business semantics、外部 delivery truth |
| L5 handoff/collaboration | request-local typed Port outcome、stable local intent relation | 本地协作请求和 intent binding 的关系 | physical delivery、attempt、retry、DLQ、external acceptance |
| L6 diagnostic identity | 17 `ApplicationError`、51 public-safe issue identities、entry wrappers | 可分类的安全失败原因和定位引用 | retry authority、incident truth、business state、evidence result |

### 8.2 四个观测平面

| Plane | 本项目 inventory | authority rule | hard negative |
|---|---:|---|---|
| structured log | 60 profiles = 52 primary + 8 folded | exact owner/phase/profile row；只投影 allowlist | 不复制 raw body、secret、provider response、full sensitive ref |
| metric | 48 profiles = 34 Counter + 12 Histogram + 2 Gauge | fixed low-cardinality labels；Gauge 只读 exact source | 不用 metric 触发 retry、repair、state change或补零掩盖 read failure |
| span/event | 27 span profiles + 3 fixed events | TraceId级 local/historical link；entry observation与owned invocation分开 | 不声称 remote propagation、delivery truth或取消 business future |
| durable projection | 20 existing-carrier profiles = 8 accepted + 7 operations/derived + 5 continuity | exact carrier + sidecar symmetry + Durable 后才投影 | 不新增 business object，不让 projection 反写真相 |

### 8.3 观测 profile cardinality lock

| Inventory | Exact source | Acceptance use |
|---|---:|---|
| structured log | `03` §14.2; `L-API/L-APP/L-UOW/L-PORT/L-WKR/L-OUT/L-JOB/L-INF/L-DIAG` | `CUT-OBS-*`、`EV-CH-OBS-*` 和 `NFR-CH-018..020` |
| metric | `03` §14.3; `MP-*` | low-cardinality completeness and forbidden-label scan |
| span/event | `03` §14.4; `FSP-*` + 3 fixed event IDs | correlation/phase/no-cancel checks |
| durable projection | `03` §14.5; `AFP-*` / `OFP-*` / `CFP-*` | accepted truth/continuity and no-second-truth checks |
| redaction | `03` §14.6 and Step 15 `RD-01..RD-16` | hard evidence gate; no raw unsafe material |

任何 inventory discrepancy必须回开 `03` 对应 observability/test-cut source；本 Step 不通过增加、删除或重命名 profile 来修复计数。

## 9. Evidence identity 与 instance 完整性

### 9.1 三层身份

| 层 | 身份形式 | authority | 当前状态 |
|---|---|---|---|
| test candidate | `EVC-CH-<FAMILY>-<NNN>` | `05` Step 6/13 candidate registry | design contract |
| formal evidence contract | `EV-CH-<FAMILY>-<NNN>` | `05_test_plan_step_13_evidence.md` | design contract |
| run-scoped evidence instance | explicit `(run_id, evidence_id)` row | same-run raw-derived `evidence-index` | none established |

转换关系必须是一对一：

```text
TC-CH-* + DS-CH-* + EVC-CH-*
              |
              v
        EV-CH-* contract
              |
              v
(explicit run_id, EV-CH-*) instance
              |
              v
case raw + suite raw/report + digest + checks + review refs
```

`EV-CH-*` 的存在不等于 instance 存在；instance 的完整不等于 case passed；case passed 也不等于总体 acceptance verdict。任何一层缺失，都必须保留其真实缺失/失败状态，不得用上一层的设计状态填补。

### 9.2 Instance completeness predicate

对显式 run 中的 evidence instance `e`，只有以下条件全部满足时，才可进入 `complete_evidence_bundle`：

```text
explicit_run_id(e)
AND canonical_ev_contract(e.evidence_id)
AND exact_tc_ds_pair(e.tc_id, e.ds_id)
AND exact_primary_suite(e.primary_suite)
AND case_raw_exists_same_run(e)
AND suite_raw_exists_same_run(e)
AND suite_report_exists_same_run(e)
AND report_generated_from_raw(e)
AND all_required_digests_verified(e)
AND redaction_check_passed_for_artifact_and_report(e)
AND dependency_and_responsibility_scope_passed(e)
AND artifact_report_pairing_passed(e)
AND no_static_evidence_passed(e)
AND no_orphan_or_duplicate_identity(e)
```

该 predicate 只判断证据链完整性。`status` 必须逐字来自 case raw 并受 suite/gate worst-status 约束，report、handoff、review note 或人工摘要不得升级为 `passed`。`blocked_dependency`、`invalid_artifact`、`timed_out`、`cancelled`、缺失或跨 run 均不能形成可通过的 P0 instance。

### 9.3 Status 与裁决映射

| 证据/报告状态 | 语义 | Step 10 影响 | 能否作为通过 |
|---|---|---|---|
| `passed` | raw、pairing、checks和safe projection均闭合 | 可供后续 AC/VF 复核 | 仅作为对应 item 的证据，不自动形成总 verdict |
| `failed` | typed assertion 或硬 gate 失败 | 相关 AC 失败；若命中红线交 Step 11 | 否 |
| `blocked_dependency` | 所需依赖或 selected prerequisite 不可用 | P0 不可裁决；selected claim 保持 blocked | 否 |
| `invalid_artifact` | schema、digest、pairing、static或redaction完整性失败 | evidence gate 失败；不得风险接受 | 否 |
| `timed_out` / `cancelled` | harness 或执行未完成 | 保留 partial raw；不能宣告完成 | 否 |
| `not_evaluated` | 没有合法执行 instance 或当前无 numeric oracle | 对应 claim 未裁决 | 否 |
| `not_decided` | 证据存在但授权审查/签署尚未完成 | 交给 Step 12~14 | 否 |

## 10. Evidence gate 表

下表的 `EVG-CH-*` 是本 Step 的 gate row 标识，不扩充 formal `AC-CH-*` 库。每一行必须在未来 evidence index、gate report 和验收交接中保留可逆引用。

| Gate ID | 证据主题 | 必须存在的证据 | 通过条件 | 失败条件 | 裁决影响 |
|---|---|---|---|---|---|
| `EVG-CH-001` | canonical evidence index | `reports/runs/<run_id>/evidence-index.md` 与 machine index | 189 formal EV identity、TC/DS、primary suite、raw/report/digest、AC/VF refs和status逐项可回指 | 缺行、extra、duplicate、orphan、implicit run、跨 run或静态生成 | P0 evidence 不可裁决；不通过 |
| `EVG-CH-002` | blocking suite raw/report pair | `artifacts/test/<run_id>/suites/<suite-id>/` 与对应 suite report | 10 primary suite按 `05` 分区各有 raw、case/parameter refs、safe failure和generated report | 缺 raw、缺 report、failed 被删除、report 手写补洞或 suite owner重复 | 对应 AC/TC family 不可裁决 |
| `EVG-CH-003` | run/gate aggregate | `summary.md`、`gate-summary.md`、gate raw | aggregate保留 worst status、missing cells、P0/P1/P2和blocking/non-blocking分类 | count-only pass、release/nightly覆盖 main、缺 gate cell或状态升级 | 不得进入完整送验 |
| `EVG-CH-004` | observability safe signal | `observability-redaction` suite及对应 `EV-CH-OBS-*` | 60/48/27+3/20 profile cardinality、owner、phase、safe allowlist和zero-substitution均可复核 | observer建立/修复业务真相、Query写入、remote propagation被伪称支持、profile缺失 | AC-CH-037不可通过；必要时交 Step 11 |
| `EVG-CH-005` | durable audit/continuity symmetry | accepted change、trace/impact、snapshot/capture、receipt/journal/report的对应 raw/sidecar | exact carrier、source/version/scope、sidecar和Durable UoW对称；duplicate/no-op不造新事实 | log/metric/span反推truth、capture/revision缺失、post-commit失败回滚local truth或重复写入 | AC-CH-025/036不可通过 |
| `EVG-CH-006` | redaction boundary | `reports/runs/<run_id>/redaction-check.md`及check raw | artifact root和report root均扫描；required/optional/atomic group规则通过；finding只含safe class/location/digest | secret、body、credential、provider response、full sensitive ref或finding复现原文 | AC-CH-035/032失败；不可风险接受 |
| `EVG-CH-007` | dependency/responsibility boundary | `dependency-boundary.md`、`responsibility-boundary.md`及check raw | 仅允许声明的 `core-contracts` compile edge；七类 forbidden owner=0 | non-core sibling compile edge、runtime/approval/method/marketplace/provider/SDK/observer truth被吸收 | AC-CH-026/027/032失败；可能触发 VF-CH-012 |
| `EVG-CH-008` | report integrity | `report-audit.md`、pairing/no-static check raw | same-run raw/report/digest、no `latest`、no static result map、no orphan EV、failed retention均通过 | raw-less EV、digest mismatch、跨 run、手写 passed或覆盖失败 | evidence gate hard failure |
| `EVG-CH-009` | acceptance handoff | `reports/acceptance/handoff.md`、`open-issues.md` | 明确 baseline、explicit run IDs、scope、P0/P1/P2、未覆盖项、失败项和审查入口 | 缺 run refs、把 draft 当 verdict、遗漏 blocker、未审查 | 送验交接不完整；Step 14 不可签署 |
| `EVG-CH-010` | veto/risk review input | `veto-checklist.md`、`risk-acceptance.md`、`reports/review/*` | 每个 VF 有 EV/report/defect direction；risk 只含 eligible residual并有真实授权字段 | 默认全 passed、VETO/S/P0-A进入risk、无接受人/截止/触发条件或review provenance | Step 11/13 阻断；不得有条件通过 |

## 11. 189 evidence contract 的 primary 追溯矩阵

| Family | Exact `EV-CH-*` | Exact TC/DS | Primary suite / report | 主要验收消费者 | 缺失影响 |
|---|---|---|---|---|---|
| FOUNDATION | `FOUNDATION-001..018` | `TC/DS-CH-FOUNDATION-001..018` | `static-contract-docs`、并由各 owning suite承接；`.../suites/static-contract-docs.md` | AC-CH-001..005、023..032；VF-CH-001/002/003/004/005/006/007/011/012/013 | module/object/protocol/Port/Rustdoc/依赖边界不可裁决 |
| CMD | `CMD-001..026` | `TC/DS-CH-CMD-001..026` | `service-command-query`; `.../suites/service-command-query.md` | AC-CH-001..005、006..021、023..027；VF-CH-001/002/003/004/005/007/008/009/010 | 26 Command主线或显式mutation/no-op不可裁决 |
| QUERY | `QUERY-001..033` | `TC/DS-CH-QUERY-001..033` | `service-command-query`; same report | AC-CH-001..005、006..021、023..032、036..037；VF-CH-007/008/009/011 | Query no-write、visible/degraded/trace/exposure边界不可裁决 |
| INBOUND | `INBOUND-001..006` | `TC/DS-CH-INBOUND-001..006` | `entry-inbound`; `.../suites/entry-inbound.md` | AC-CH-001..005、015..018、024..027、029..032；VF-CH-005/006/007/009/011 | 外部输入、header、receipt、body-free relation和禁止写入不可裁决 |
| OUTBOUND | `OUTBOUND-001..010` | `TC/DS-CH-OUTBOUND-001..010` | `outbound-collaboration`; `.../suites/outbound-collaboration.md` | AC-CH-001..005、021、025..032、034/036/037；VF-CH-007/009/010/011 | snapshot/capture/A-B-C/intent和下游协作边界不可裁决 |
| JOB | `JOB-001..008` | `TC/DS-CH-JOB-001..008` | `jobs-lifecycle`; `.../suites/jobs-lifecycle.md` | AC-CH-002/005/006/011/021/022/024..028/030/036/037；VF-CH-003/007/010/011 | frozen plan、journal、target、report和no-repair不可裁决 |
| STATE | `STATE-001..024` | `TC/DS-CH-STATE-001..024` + all `SP-CH-*` pairs | `domain-state`; `.../suites/domain-state.md` | AC-CH-001..005、009/010/012/015/020/023/025/029/030/031/034/036；VF-CH-001/003/008/009/010 | 24 family、111 variant、638 pair完整性不可裁决 |
| TX | `TX-001..022` | `TC/DS-CH-TX-001..022` | `repository-transaction`; `.../suites/repository-transaction.md` | AC-CH-001..005、023..027、029/030/036；VF-CH-007/009/010/012 | UoW、CAS、idempotency、commit-unknown和rollback不可裁决 |
| BIND | `BIND-001..012` | `TC/DS-CH-BIND-001..012` | `runtime-binding`; `.../suites/runtime-binding.md` | AC-CH-003/005/022/024/026/028/032/033..035/037；VF-CH-004/011/012/013 | profile/source/Port/route/Stage和依赖边界不可裁决 |
| OBS | `OBS-001..012` | `TC/DS-CH-OBS-001..012` | `observability-redaction`; `.../suites/observability-redaction.md` | AC-CH-024/026/027/029..032/035..037；VF-CH-007/009/011/012 | 观测、审计、redaction、第二真相源和责任泄漏不可裁决 |
| CONFIG | `CONFIG-001..018` | `TC/DS-CH-CONFIG-001..018` | `configuration-strict`; `.../suites/configuration-strict.md` | AC-CH-022/024/026/028/032/033..035/037；VF-CH-004/011/012/013 | strict source/profile/fail-fast/sensitive/no-output不可裁决 |

矩阵中的 AC/VF 是 consumer direction，不代表当前存在任何 run-scoped evidence。任何 family 的 primary owner变化、suite分区变化或 `189` arithmetic变化，必须回开 `05` 对应 Step，不由 `06` 改写。

## 12. Fixed artifact/report roots 与生成顺序

### 12.1 目录 authority

```text
artifacts/test/<run_id>/
  meta/context.json
  run-manifest.json
  evidence-index.json
  gates/<gate-id>/gate-result.json
  suites/<suite-id>/
    suite-result.json
    report.json
    cases/<tc-id>.json
    parameters/<parameter-result-id>.json
    stdout.log
    stderr.log
  checks/<check-id>/check-result.json

reports/runs/<run_id>/
  summary.md
  gate-summary.md
  evidence-index.md
  redaction-check.md
  dependency-boundary.md
  responsibility-boundary.md
  report-audit.md
  suites/<suite-id>.md
  checks/<check-id>.md
  evidence/EV-CH-<FAMILY>-<NNN>.md

reports/acceptance/
  handoff.md
  open-issues.md
  veto-checklist.md
  risk-acceptance.md

reports/review/
  reviewer-notes.md
  agent-review.md
```

以上是 `05` 的 future path contract，不表示这些目录或文件已经存在。`<run_id>` 必须显式出现在 raw root、run report root 和每一条 evidence row 中；`reports/acceptance/*` 与 `reports/review/*` 虽不含 run segment，也必须在正文中列出所引用的显式 run IDs。正式引用、链接、摘要、审查记录和验收材料都禁止 `latest`、隐式 current run、项目嵌套 artifact root 或跨 run 合并 row。

### 12.2 生成顺序

```text
1. gate / test / check runners
   -> artifacts/test/<run_id> raw records
2. suite report builders
   -> reports/runs/<run_id>/suites/*.md and checks/*.md
3. run summary / gate summary builders
   -> summary.md and gate-summary.md
4. redaction / dependency / responsibility checks
   -> check raw and safe reports
5. artifact-report pairing / no-static-evidence checks
   -> report-audit.md
6. evidence index builder
   -> evidence-index.json + evidence-index.md + per-EV pages
7. acceptance draft builders
   -> reports/acceptance/* with no default verdict or signature
8. human / Agent review
   -> reports/review/* and reviewed supplements
```

前序步骤失败时，后续仍可生成 `incomplete` 或 `blocked` diagnostic report，但不能生成 `complete`、`passed` 或可供 P0 通过的 evidence bundle。report builder 只投影 raw authority；它不能创建缺失 case、补写 status、删除失败 attempt 或把 report generation failure 改成 passed。

### 12.3 Future builder / check ownership

| Future contract | 输入 authority | 输出方向 | 失败含义 |
|---|---|---|---|
| suite report builder | suite/case/parameter raw | `reports/runs/<run_id>/suites/<suite-id>.md` | raw 缺失、不可解析或生成失败；suite 非 passed |
| run summary builder | run/gate/suite/check raw + suite reports | `summary.md` | worst status、missing cell 或 P0/P1 分类不得被隐藏 |
| gate summary builder | frozen gate manifest + required raw | `gate-summary.md` | 任一 required cell unresolved 时保持 non-pass |
| evidence index builder | same-run case raw + suite raw/report + verified digests | `evidence-index.*`、per-EV page | orphan、duplicate、cross-run、raw-less 或 static row 阻断 |
| redaction check | complete artifact and report roots | `redaction-check.md` + check raw | forbidden material 或 scan scope gap；不得回显原文 |
| dependency check | workspace graph、imports、public surface | `dependency-boundary.md` | non-core compile edge 或 copied owner |
| responsibility check | declarations、call graph、protocol and data surfaces | `responsibility-boundary.md` | 七类 forbidden ownership 任一非零 |
| pairing/no-static checks | raw/report paths and generation provenance | `report-audit.md` | missing pair、digest mismatch、static result或`latest` |
| acceptance handoff builder | explicit run reports、evidence index、defect/residual refs | `reports/acceptance/handoff.md` | 缺 baseline、run ref、scope或未覆盖项；不得自签 |
| veto checklist builder | evidence index、check reports、defect state | `veto-checklist.md` | VF 无来源或默认 passed；交 Step 11 |
| risk acceptance builder | eligible residual records only | `risk-acceptance.md` | 不合格风险、缺授权字段或误收 P0/VF/S；交 Step 13 |

这些是验收消费的 future interfaces，不是本 Step 要创建的脚本、CI job 或实现 boundary。具体脚本名、机器字段 schema、digest algorithm、backend 和 retention policy 继续以 `05` / `04` / controlled reopen 为准。

## 13. Report 完整性与 handoff 约束

| 检查项 | 固定入口 | 通过条件 | 失败影响 |
|---|---|---|---|
| canonical evidence index | `reports/runs/<run_id>/evidence-index.md` | 189 formal EV 与 TC/DS/suite/raw/report/digest/AC refs完整、唯一、同 run | P0 evidence gate 不通过或不可裁决 |
| suite raw/report pairing | `artifacts/test/<run_id>/suites/*` + `reports/runs/<run_id>/suites/*` | 每个 primary suite均有 raw-derived report；失败、超时、取消和 unavailable有safe evidence | 对应 suite 不能贡献 passed |
| gate/run aggregate | `summary.md` + `gate-summary.md` | worst status、required suites/checks、P0/P1/P2和missing cell完整 | 不得进入完整送验 |
| redaction | `redaction-check.md` | artifact root、report root、stdout/stderr和acceptance/review生成物均覆盖；finding不回显内容 | AC-CH-032/035失败；VETO候选 |
| dependency | `dependency-boundary.md` | only declared `core-contracts` compile candidate，runtime/event seam不伪装源码依赖 | AC-CH-026失败；VF-CH-012候选 |
| responsibility | `responsibility-boundary.md` | identity/registry/descriptor/seam/relation/exposure owner清晰，forbidden owner=0 | AC-CH-024/026/027/032失败 |
| report audit | `report-audit.md` | no `latest`、no static evidence、no orphan/duplicate、same-run pairing和digest通过 | evidence integrity hard failure |
| acceptance handoff | `reports/acceptance/handoff.md` | explicit run IDs、baseline、scope、未覆盖/失败/blocked项和审查入口完整 | 交接不完整，Step 14 不可签署 |
| open issues | `reports/acceptance/open-issues.md` | 所有 non-pass、blocked、invalid、dispute、residual和design reopen入口均列出 | 不得把 P0 blocker 降成普通 note |
| veto checklist | `reports/acceptance/veto-checklist.md` | 13 个 `VF-CH-*` 每项有来源、EV/check/report direction和当前状态 | 缺一项即不通过或不可裁决 |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | 只列 eligible residual，含真实授权、理由、动作、截止与trigger字段 | 不得有条件通过 |

### 13.1 Handoff、review 与 verdict 的分离

| 文档 | 允许作用 | 禁止作用 |
|---|---|---|
| `reports/acceptance/handoff.md` | 汇总送验 baseline、显式 run、scope、P0/P1/P2、失败和未覆盖项 | 创建 EV、升级 status、替代 raw/report、宣告最终通过 |
| `reports/acceptance/open-issues.md` | 保留不可裁决项、缺口、争议、controlled reopen入口 | 隐藏 P0 blocker、把 blocked 写成 accepted |
| `reports/acceptance/veto-checklist.md` | 提供 Step 11 的 VF 逐项复核入口 | 默认全 passed、用 risk acceptance 覆盖 VF/S/P0-A |
| `reports/acceptance/risk-acceptance.md` | 承接 Step 13 允许的 residual decision 输入 | 接受 redaction、dependency、responsibility、evidence integrity、VF、S或当前 P0-A |
| `reports/review/*` | 记录真实 reviewer/Agent 对 raw-derived material 的复核、争议和引用 | 修改 raw、修改 case status、伪造姓名/时间/签名或替代 Step 14 |

当前设计阶段上述文件均不存在。未来文件若只存在 draft、空模板或没有显式 run/reviewer provenance，不得被解释成 review complete、handoff complete 或 acceptance passed。

## 14. 证据门禁停审记录

| 审查项 | 设计结论 | 当前事实 |
|---|---|---|
| `EV-CH-*` 是否能回指 TC/DS/AC/VF/suite/raw/report | closed | 189 contracts only; no instance |
| 10 primary suite 是否有唯一 owner | closed | 10/10 partition design; no suite run |
| 638 state pair 是否禁止 sampling | closed | registry contract only; no parameter artifact |
| observation plane 是否有第二真相源风险 | closed | four-plane one-way rule; no signal emitted |
| durable carrier 是否要求 source/sidecar/Durable symmetry | closed | design contract only; no persisted record |
| raw/report 是否同 run、可验证 digest | closed | path/schema contract only; no digest |
| failed/incomplete 是否保留 | closed | future retention rule; no failed run exists |
| redaction 是否覆盖 artifact 与 report | closed | future scan scope; not executed |
| dependency/responsibility 是否有 hard gate | closed | future check contract; not executed |
| acceptance handoff 是否不替代原始证据 | closed | rule only; no handoff |
| VETO/risk/review 是否无默认结论 | closed | schemas/directions only; no checklist or decision |

## 15. 跨证据裁决审计

| Audit item | Static design result | Future execution gate |
|---|---|---|
| formal EV arithmetic | `189/189`; missing=0; extra=0 | evidence-index set equality |
| TC/DS/EV one-to-one | `189/189`; duplicate=0 by design | raw identity and duplicate scan |
| primary suite partition | `189=8+26+60+8+10+9+25+13+12+18` | suite owner manifest equality |
| state pair denominator | `638=239+98+301` | all parameter identities present; no sampling |
| AC consumer direction | `37/37`; missing=0 | evidence-index AC ref audit |
| VF consumer direction | `13/13`; missing=0 | veto checklist EV/check audit |
| orphan evidence | forbidden by contract | report-audit orphan scan |
| duplicate/cross-run evidence | forbidden by contract | `(run_id,evidence_id)` uniqueness and path equality |
| static pass/manual result map | forbidden by contract | no-static-evidence check |
| report/raw/digest mismatch | forbidden by contract | pairing and digest check |
| failed result overwrite | forbidden by contract | immutable attempt/retest audit |
| redaction and forbidden ownership | zero active design mapping | full artifact/report/source scan |
| historical material re-entry | zero active mapping | denylist and responsibility scan |
| fabricated review/verdict/signoff | zero in design warehouse | provenance audit; missing is not pass |

审计结果 `closed` 仅表示规则和反向 registry 已闭合，不表示 future check 已运行。任何实际 finding 应保留原始 safe finding、显式 run 和受影响 EV/AC/VF，不得直接编辑设计文档抹平结果。

## 16. 回填草稿：formal `06-验收标准.md` §10

> 校准来源：
> - `design-calibration/06_acceptance_step_10_observability_evidence.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“观测与审计 authority 模型”“Evidence identity 与 instance 完整性”“Evidence gate 表”“189 evidence contract 的 primary 追溯矩阵”“Fixed artifact/report roots 与生成顺序”“Report 完整性与 handoff 约束”和“跨证据裁决审计”小节。

正式 §10 只应承载以下收口结论：

1. capability-hub 的 log、metric、span/event 和 durable projection 只能观察或投影既有 owner carrier，不能建立、修复或替代 identity、registry、descriptor、governance seam、method relation、formal exposure 或 consumer impact truth。
2. 每个 P0 evidence instance 必须绑定显式 `(run_id, EV-CH-*)`，并可回指 exact TC/DS、唯一 primary suite、same-run case/suite raw、generated report、verified digest、AC/VF consumer、redaction、dependency/responsibility、pairing 和 no-static checks。
3. raw artifact 固定在 `artifacts/test/<run_id>`，人类可读 run report 固定在 `reports/runs/<run_id>`；`latest`、隐式 run、跨 run 拼接、静态 evidence、手写 passed、失败覆盖和 raw-less report 均无效。
4. `reports/acceptance/handoff.md`、`open-issues.md`、`veto-checklist.md`、`risk-acceptance.md` 与 `reports/review/*` 只作交接和审查入口，不能替代 raw、suite report、evidence index 或最终签署；缺少真实 review/provenance 不得宣称 handoff complete。
5. redaction、dependency boundary、responsibility boundary、artifact/report pairing、report audit、no-static-evidence 和 required observability safe signal 任一 P0 gate failed、invalid 或无法回源时，不得通过；VF、S、当前 P0-A 和 evidence integrity failure 不得进入风险接受。
6. `release-main-smoke`、nightly、selected integration 和人工审查只能引用或汇总既有底层证据，不能代替 10 suites、189 TC/DS/EV 或 638 state-pair denominator。

正式章节不得写入本文件的 SOP 问答、历史诊断、真实状态或任何不存在的 run/report/reviewer/signoff。

## 17. 待确认事项与受控重开

| 事项 | 当前状态 | 影响 | 处理规则 |
|---|---|---|---|
| concrete observability backend/crate | 未选择 | 影响实现 binding，不影响当前 authority | 选择后按 `03` §14.7 和 `04` 对应 Step 受控回开 |
| machine artifact/report field schema | 已由 `05` 提供基础合同；实现细节仍需目标仓承接 | 影响 writer/reader | 不在 `06` 私自增字段；冲突回开 `05`/schema owner |
| digest algorithm | 当前只要求 verified digest，不指定算法 | 影响实现与报告 | 由 `05`/实施计划明确；改变 identity 或 pairing 时回开 |
| evidence retention days | 无 active numeric policy | 影响长期运维 | 当前只要求 run-scoped 可追溯；不得复活旧 30/90/180 天数字 |
| selected product/environment | 未选定 | 影响 P1/R4 claims | immutable manifest决定 applicability；不可补偿 P0 |
| acceptance reviewer/signatory | 未指定 | 影响 Step 14 | 当前保持 none；不得伪造姓名、时间或签署 |
| remote trace propagation | 当前不在 9 external Port contract | 影响跨系统追踪 | 不声称支持；若新增字段/Port则回开 `03`/`07` |

以上均不是当前 upstream blocker；它们是 future implementation/acceptance prerequisites 或 controlled reopen triggers。

## 18. Step 10 完成门禁与下一步

| 条件 | 结果 |
|---|---|
| SOP Step 10 问题回答完整 | `pass-designed` |
| 6 layers / 4 planes / 155 profiles authority闭合 | `pass-designed` |
| 189 EV contracts、10 suites、638 pairs追溯闭合 | `pass-designed` |
| raw/report/review fixed roots和生成顺序闭合 | `pass-designed` |
| same-run、digest、pairing、no-static、redaction和responsibility规则闭合 | `pass-designed` |
| handoff / open issues / veto / risk / review不得伪造结论 | `pass-designed` |
| 真实 implementation/run/artifact/report/evidence/review/verdict/signoff | none claimed |
| formal `06-验收标准.md` 修改 | `no; Step 15 only` |
| unresolved upstream blocker | `0` |
| 下一步 | `enter_06_step_11_veto` |

## 19. Stop-review snapshot

本 Step 的 `pass-designed` 只表示可观测性、审计与证据裁决合同已静态闭合。它不表示任何 suite、check、run、artifact、report、evidence instance、review、acceptance handoff、VETO 或 signoff 已通过。

```text
document = 06-验收标准.md
step = 10_completed
artifact = 06_acceptance_step_10_observability_evidence.md
formal_writeback = deferred_until_step_15
ev_contracts = 189
primary_suites = 10
state_pairs = 638
observability_profiles = 155
real_run_id = none
real_evidence_instance = none
acceptance_verdict = not_entered
unresolved_upstream_blocker = none
commit_required = no
next_allowed_action = enter_06_step_11_veto
```
