# Step 10. 定义可观测性、审计与证据门禁

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 10  
> 回填章节：`06-验收标准.md` §10 可观测性、审计与证据门禁  
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与事实边界

| 项 | 当前值 |
|---|---|
| current_document | `06-验收标准.md` |
| current_step | Step 10 |
| current_module | `observability_evidence:18_runtime_ev_reports_checks_handoff_review` |
| gate_status | `pass_for_step_11` |
| planned_slots / canonical_aliases | 18 / 18 |
| actual_evidence_instances | 0 |
| actual_reports / reviews | 0 / 0 |
| acceptance_lifecycle | `not_entered / blocked_by_missing_baseline` |
| actual_verdict | `none` |
| formal_06_write_allowed | `false_until_step_15` |
| next_allowed_action | 创建并完成 Step 11 |

本步只定义证据资格与未来裁决方式。`ESLOT-RUN-*`、`EV-RUN-*`、路径模板和报告名均是 planned contract，不代表 artifact、report、audit record 或 evidence instance 已存在。当前没有 fixed `<run_id>`，不得把设计表、local log、receipt、handoff marker 或本文自身当成证据。

## 2. 本步输入、目标与非目标

### 2.1 权威输入

| 输入 | 本步用途 |
|---|---|
| 03 §14、Step 15 | Runner 本地 log/trace/metric、redaction、source attribution，以及 local record 不等 L4 truth |
| 05 §9、§12～§14、Step 13 | suite/check、18 planned slot、machine artifact、human report、证据生成与审查合同 |
| 06 Step 3～9 | fixed baseline、entry/exit、11 AC、15 红线、协议/状态/NFR 门禁与 target tier |
| L4-observability / L4-archive 当前正式边界 | formal audit/evidence/report/retention truth 仍归 owner；Runner 只交接安全 ref |

### 2.2 本步目标

- 固定 Runner 本地可观测记录、测试 artifact/report、验收 evidence 和 owner formal audit 四层边界。
- 为 18 个 canonical EV 逐项绑定 TC、producer suite、raw/report/check pair、AC 和缺失影响。
- 固定 run report、acceptance handoff、VETO/risk/open-issues 与独立 review 的生成和审查门禁。
- 阻断 `latest`、跨 run 拼接、静态/手写 EV、缺 raw 或 report、scanner unavailable、未审查 acceptance draft。

### 2.3 非目标

- 不运行 suite/check，不创建 `<run_id>`、artifact、report、EV detail、audit record 或 review note。
- 不定义 L4 Observability/Archive 的内部 schema、存储、retention 或 verdict。
- 不用 Step 10 替代 Step 11 VETO、Step 13 风险接受或 Step 14 最终签署。

## 3. SOP 问题回答与裁决取舍

| 问题 | 收口答案 |
|---|---|
| 哪些行为必须有 audit record？ | selection/authority/material/integrity、run/control/cleanup intent、owner projection、RecoveryCase、diagnosis/handoff 必须有 Runner-owned append/trace ref；若 target tier 要求 formal audit，则还必须由 L4 owner 提供正式 ref。前者不冒充后者。 |
| 哪些行为必须有 trace/log/metric？ | 11 Command、12 Query、4 planned Consumer、5 Job 均需 safe kind/outcome/correlation；外部副作用需 reservation/result/recovery 关联；metric 仅允许 finite low-cardinality label。 |
| 哪些报告必须归档？ | fixed-run summary、evidence index、gate results、四项完整性 check、suite report、18 个适用 EV detail，以及 acceptance handoff/veto/risk/open-issues 和独立 review。 |
| 证据缺失是否导致不通过？ | entry 阶段缺 baseline/run/report 表示验收未进入；进入后 target-tier required EV/report/check 缺失或 invalid 使相应 gate `blocked/failed`，总体不能通过。不能把未进入误写成实际不通过。 |
| 证据如何复查？ | 从 `evidence-index.md` 定位 `(run_id,evidence_id,item_digest)`，回指同 run 的 detail、suite report、case JSON、redacted logs 与四项 check，再核对 AC/VETO、status、blocker 和 digest。 |
| acceptance handoff 是否可自动裁决？ | 否。脚本只可生成初稿；人/Agent 必须在 `reports/review/*` 独立审查，且不能修改 raw status/digest 或写入签署。 |
| formal audit/evidence owner 是谁？ | L4 Observability/Archive/Governance 的正式边界由各 owner 决定；Runner 本地 log/trace/receipt/handoff 只作为安全本地记录或交接输入。 |

## 4. 证据层级、身份与状态纪律

### 4.1 四层边界

| 层级 | 可拥有内容 | 不可推出 |
|---|---|---|
| Runner local observability | safe kind/outcome/correlation、local transition/ref、redaction posture、RecoveryCase/handoff posture | Release approved、Sandbox running/cleaned、formal audit/evidence、verdict |
| Test raw/report | fixed-run case/suite/check status、safe artifact refs/digests、未执行与 blocker | owner truth、产品 readiness、验收签署 |
| Acceptance evidence | 从同 run 合格 pair 生成的 EV item/detail/index 与经审查 handoff | 自动风险接受、自动 signoff、跨 tier 升级 |
| Owner formal audit/archive | owner-issued audit/evidence/archive refs，带 visibility/freshness/retention | Runner 可补写、改写或用本地副本替代 |

### 4.2 Evidence instance 身份

```text
planned slot: ESLOT-RUN-NNN
canonical alias pattern: EV-RUN-<FAMILY>-<NNN>
runtime evidence identity: (run_id, evidence_id, evidence_item_digest)
```

只有固定 run 下至少一个真实 case artifact、producer suite report、required check 和 evidence item/detail 均可配对时，alias 才能指向 instance。alias、路径、slot、root digest、文档表格或 `latest` 单独都不是证据。

### 4.3 状态与不可变性

| 对象 | 允许状态/口径 | 规则 |
|---|---|---|
| case/suite/check | `passed/failed/blocked/not_run/timeout/flaky/incomplete` 的适用子集 | aggregate 不得吞掉 failed/blocked/not_run；scanner unavailable 不是 clean |
| evidence slot | complete item 或 explicit incomplete slot | incomplete 不生成可宣称覆盖的 EV alias |
| review | `pending/reviewed/disputed` | review 不回写 raw status、digest 或 owner truth |
| superseding run | 新 run + predecessor/supersedes ref | 不覆盖旧 run，不跨 run 补洞 |
| actual gate | `not_evaluated` 直到验收合法进入 | planned/design pass 不得改写 actual |

## 5. 可观测性与正式审计门禁

| Gate ID / 主题 | 必须存在 | 通过条件 | 失败/blocked 条件 | 主要消费 |
|---|---|---|---|---|
| `EG-RUN-001` Command effect trace | entry、validation、reservation、local commit、external result/recovery 的 safe correlation | 11 Command 的 accepted/rejected/duplicate/blocked/unknown 可还原；外部 effect 与 tx A/B 可关联 | raw body/secret；reservation/result 断链；ACK 被记为 running；Unknown 被记 success | AC 005～011；UOW/IDM/OBS EV |
| `EG-RUN-002` Query observation | query kind、section/version、visibility/freshness、typed outcome | 12 Query no-write，stale/restricted/unknown 保真 | query 触发 refresh/repair/write；log 补出 owner truth | AC 006/009/010；QRY/BND EV |
| `EG-RUN-003` Consumer/Job trace | header/readiness/disposition；claim/checkpoint/report/current generation | Consumer no payload/no ACK；Job 只改 local operations；Blocked 保真 | payload/raw 保存、ACK、owner repair、stale claim overwrite | AC 001/003/008～011；CNS/JOB/BND EV |
| `EG-RUN-004` Safety/redaction telemetry | safe category/count/source ref、scanner version/ref | artifact 与 report 双面扫描 clean；metric label bounded | raw fallback、高基数/free text label、scanner unavailable/命中 | AC 010/011；PRE/OBS/BND EV |
| `EG-RUN-005` Owner audit handoff | source/target/trace/receipt refs、visibility/freshness/redaction posture | handoff delivered 只记录 local posture；formal audit 需 owner ref | receipt/local log 直接升级 audit/evidence/report/verdict | AC 010/011；PRE/OBS EV |

所有 Gate 的 actual result 当前均为 `not_evaluated`。`EG-RUN-*` 是 06 的 evidence gate ID，不是新的 runtime EV，也不增加 05 的 18-slot 分母。

## 6. 18 个 canonical EV 逐项证据闭环

共同入口：`artifacts/test/<run_id>/evidence-index.json`、`reports/runs/<run_id>/evidence-index.md`、`reports/runs/<run_id>/gate-results.md`。每行 detail 固定为 `reports/runs/<run_id>/evidence/<evidence_id>.md`；raw case 固定在 producer suite 的 `cases/<tc_id>.json`。实际状态均为 `not_evaluated`。

| Slot / canonical alias | TC / producer suite | 必需 raw/report pair | Required checks | AC / 主要门禁 | 缺失或 invalid 影响 |
|---|---|---|---|---|---|
| `ESLOT-RUN-001` / `EV-RUN-CTX-001` | `TC-RUN-CTX-001~006`; CONTRACT/DOMAIN/SERVICE | 全 6 case + 各 producer `report.json`/logs + detail | redaction/link/pairing | AC 001/002；selection/authority/source | target required 时 incomplete/blocked；不得称 context qualified |
| `002` / `EV-RUN-MAT-002` | `TC-RUN-MAT-001~007`; DOMAIN/SERVICE/CONTROLLED | 全 7 case + suite/report/log/detail | redaction/link/pairing | AC 003/004；download/integrity/cache | 不得称 material verified/qualified |
| `003` / `EV-RUN-REQ-003` | `TC-RUN-REQ-001~006`; SERVICE/UOW/CONTROLLED | 全 6 case + effect/UoW refs + report/detail | redaction/link/pairing | AC 005；formal Sandbox request | 不得称 request accepted/running |
| `004` / `EV-RUN-CTL-004` | `TC-RUN-CTL-001~005`; SERVICE/UOW/CONTROLLED | 全 5 case + control effect refs + report/detail | redaction/link/pairing | AC 005/006；stop/cleanup intent | 不得称 confirmed/cleaned |
| `005` / `EV-RUN-OWN-005` | `TC-RUN-OWN-001~005`; SERVICE/CONTROLLED/REPLAY | 全 5 case + owner readback refs + report/detail | redaction/link/pairing | AC 006；owner projection | 不得称 running/terminal；T2+ positive blocked |
| `006` / `EV-RUN-RES-006` | `TC-RUN-RES-001~006`; DOMAIN/CONTROLLED/JOB | 全 6 case + probe/guard/cleanup refs + report/detail | redaction/link/pairing | AC 007/008；resource/protection | 不得称 allocation/lease/released |
| `007` / `EV-RUN-REC-007` | `TC-RUN-REC-001~006`; SERVICE/UOW/JOB/REPLAY | 全 6 case + RecoveryCase/readback refs + report/detail | redaction/link/pairing | AC 009；disconnect/Unknown | 不得称 recovered or safe replay |
| `008` / `EV-RUN-PRE-008` | `TC-RUN-PRE-001~006`; DOMAIN/SERVICE/SECURITY | 全 6 case + safe presentation refs + report/detail | redaction/link/pairing | AC 010；preview/diagnosis/handoff | raw finding VETO 候选；不得称 formal evidence |
| `009` / `EV-RUN-QRY-009` | `TC-RUN-QRY-001~006`; SERVICE/ENTRY/SECURITY | 全 6 case + write-audit + report/detail | redaction/link/pairing | AC 006/009/010；Query no-write | 任一 write 失败；缺失不得称 read model safe |
| `010` / `EV-RUN-CON-010` | `TC-RUN-CON-001~006`; CONTRACT/ENTRY | 全 6 case + contract/entry report/detail | dependency/redaction/link/pairing | AC 001/011；public seam/entry | private seam 或缺 pair 阻断；不得冒充 SDK integration |
| `011` / `EV-RUN-IDM-011` | `TC-RUN-IDM-001~006`; SERVICE/UOW | 全 6 case + stored-result/effect refs + report/detail | redaction/link/pairing | AC 005/009/011；idempotency | 不得称 duplicate exact replay/conflict safe |
| `012` / `EV-RUN-UOW-012` | `TC-RUN-UOW-001~006`; UOW/SERVICE/REPLAY | 全 6 case + tx/version/recovery refs + report/detail | redaction/link/pairing | AC 009/011；atomicity/commit unknown | 不得称 durable/atomic/recoverable |
| `013` / `EV-RUN-ENT-013` | `TC-RUN-ENT-001~005`; ENTRY/CONTRACT/SERVICE | 全 5 case + entry mapping/report/detail | dependency/redaction/link/pairing | AC 001/005/011；entry safety | 不得称 input/result/error mapping complete |
| `014` / `EV-RUN-CNS-014` | `TC-RUN-CNS-001~006`; CONSUMER/CONTRACT | 全 6 case + call/write/ACK audit + report/detail | dependency/redaction/link/pairing | AC 011；header-first/no ACK | payload/ACK 非零为 VETO 候选；positive remains blocked |
| `015` / `EV-RUN-JOB-015` | `TC-RUN-JOB-001~008`; JOB/UOW/REPLAY | 全 8 case + claim/checkpoint/report refs + detail | redaction/link/pairing | AC 003/008/009/010/011；jobs | 不得称 current claim/cleanup/recovery job safe |
| `016` / `EV-RUN-CFG-016` | `TC-RUN-CFG-001~006`; CONFIG/CONTROLLED/SECURITY | 全 6 case + config summary/report/detail | dependency/redaction/link/pairing | AC 002/004/011；config/readiness | 不得称 profile safe/ready；bypass 为 VETO 候选 |
| `017` / `EV-RUN-OBS-017` | `TC-RUN-OBS-001~006`; SECURITY/CONTRACT/REPLAY | 全 6 case + telemetry/redaction artifacts + detail | redaction/link/pairing | AC 010/011；observability/evidence boundary | finding/unavailable/静态 EV 阻断，VETO 候选 |
| `018` / `EV-RUN-BND-018` | `TC-RUN-BND-001~006`; CONTRACT/SECURITY/SERVICE | 全 6 case + dependency/call/write report/detail | all four checks | AC 005/006/008/010/011；architecture boundary | 任一 boundary finding 阻断，VETO 候选 |

表中 `002`～`018` 均是同前缀完整 `ESLOT-RUN-NNN`；正式 machine index 必须写完整 ID，不得使用缩写或 range。secondary AC 消费不重复计算 slot 覆盖，108 个 TC 必须在 machine index 中逐个展开。

## 7. Report 完整性与验收交接门禁

| Gate ID | 检查项 / 固定路径 | 通过条件 | 失败影响 | 当前 |
|---|---|---|---|---|
| `RG-RUN-001` | context/source/config：`artifacts/test/<run_id>/meta/*` | run、tier、profile、environment、source revisions、roots 与 context digest 固定；无 `latest` | baseline/送验 identity 不成立 | `not_evaluated` |
| `RG-RUN-002` | suite raw/report：`artifacts/test/<run_id>/suites/*` | planned/executed/not-run 全列；case/report/log digest pair 完整 | 对应 suite/slot incomplete | `not_evaluated` |
| `RG-RUN-003` | EV machine index：`artifacts/test/<run_id>/evidence-index.json` | 只从同 run pair/check 生成；逐 TC/slot/AC/status/digest | 静态/手写、跨 run 或 orphan 时证据无效 | `not_evaluated` |
| `RG-RUN-004` | 人读索引/detail：`reports/runs/<run_id>/evidence-index.md`、`evidence/*` | 与 machine index 同源；18 slot complete 或显式 incomplete | 隐藏 gap 或 detail 不可回指时总体不能通过 | `not_evaluated` |
| `RG-RUN-005` | `reports/runs/<run_id>/gate-results.md` | target-tier 全 required gate 有 status、denominator、blocker/ref | 缺 gate、blocked 计 pass 或层级升级时不通过 | `not_evaluated` |
| `RG-RUN-006` | `redaction-check.md` + `checks/redaction.json` | artifact/report/acceptance/review 双面扫描；finding=0；scanner available | finding 或 unavailable 命中 VETO 候选 | `not_evaluated` |
| `RG-RUN-007` | `dependency-boundary.md` + check JSON | manifest/import/call/runtime binding 无 private/bypass/隐含技术 | finding/unavailable 命中 VETO 候选 | `not_evaluated` |
| `RG-RUN-008` | `evidence-link-check.md` + check JSON | TC/CUT/suite/raw/report/slot/EV/AC/run/digest 无 orphan/mismatch | orphan、跨 run、duplicate 主归属使相关 evidence invalid | `not_evaluated` |
| `RG-RUN-009` | `report-pairing.md` + check JSON | 每个 invocation 有 report/log/case source，raw 与 report 双向可达 | 缺一侧即 incomplete；禁止手工补洞 | `not_evaluated` |
| `RG-RUN-010` | `reports/acceptance/handoff.md` | 固定 source run/digest、送验范围、未执行、blocker、tier；已独立审查 | 交接未审查或宣称 verdict/signoff 时送验不完整 | `not_evaluated` |
| `RG-RUN-011` | `reports/acceptance/veto-checklist.md` | Step 11 全 VETO 有 source/check/status/ref；已审查 | 任一缺结论/命中未处理时总体不通过 | `not_evaluated` |
| `RG-RUN-012` | `reports/acceptance/risk-acceptance.md` | Step 13 每项有范围、理由、责任/接受角色、期限、动作、状态 | 缺结构不得有条件通过；VETO 不得进入 | `not_evaluated` |
| `RG-RUN-013` | `reports/acceptance/open-issues.md` | failed/blocked/incomplete/defect/dispute 全列且与 raw 一致 | 隐藏 open item 或改写 status 时交接无效 | `not_evaluated` |
| `RG-RUN-014` | `reports/review/*` | reviewer identity/role、source digest、抽查范围、争议和结论完整 | acceptance 初稿未审查不得进入 final decision | `not_evaluated` |

## 8. Evidence 与 report 逐项停审记录

### 8.1 Canonical EV 停审

| EV 范围 | TC/producer 固定 | raw/report pair 固定 | AC/门禁固定 | 缺失影响固定 | 设计停审 | Actual |
|---|---:|---:|---:|---:|---:|---|
| `EV-RUN-CTX-001`～`EV-RUN-CTL-004` | pass | pass | pass | pass | pass | `not_evaluated` |
| `EV-RUN-OWN-005`～`EV-RUN-PRE-008` | pass | pass | pass | pass | pass | `not_evaluated` |
| `EV-RUN-QRY-009`～`EV-RUN-UOW-012` | pass | pass | pass | pass | pass | `not_evaluated` |
| `EV-RUN-ENT-013`～`EV-RUN-BND-018` | pass | pass | pass | pass | pass | `not_evaluated` |

分组行只压缩停审记录，不压缩 §6 的 18 个逐项合同；每个 canonical alias 均已单独审查。设计停审 `pass` 只说明 future evidence contract 完整。

### 8.2 Report gate 停审

| Gate 范围 | 固定路径 | source/pair | review 要求 | 失败影响 | 设计停审 | Actual |
|---|---:|---:|---:|---:|---:|---|
| `RG-RUN-001~005` fixed-run identity/index/gates | pass | pass | pass | pass | pass | `not_evaluated` |
| `RG-RUN-006~009` integrity checks | pass | pass | pass | pass | pass | `not_evaluated` |
| `RG-RUN-010~014` acceptance/review | pass | pass | pass | pass | pass | `not_evaluated` |

## 9. 跨证据裁决审计

| 审计项 | 结论 | 处理 |
|---|---|---|
| 18 planned slot 是否逐一消费 | pass | 18/18 有 TC、producer、pair、check、AC、缺失影响和 detail pattern |
| 108 TC 是否可能被 range 隐藏 | pass | 文档可用 range；machine index 必须逐 ID 展开，missing 显式保留 |
| orphan EV / 静态造证据 | pass | 无 producer pair 不生成合格 alias；link/no-static 规则阻断 |
| raw/report/check 是否双向可达 | pass | pairing + link gate，同时核对 digest 与同 run |
| 跨 run / `latest` 污染 | pass | fixed identity tuple；superseding run 不覆盖旧 run |
| blocked/not-run 是否被计 pass | pass | status 保真；target required 缺失使 gate blocked/failed |
| local telemetry 是否冒充 formal audit | pass | 四层边界和 `EG-RUN-005` 明确禁止 |
| acceptance draft 是否自动 verdict | pass | handoff/veto/risk/open-issues 必须独立 review；不写 signoff |
| redaction/dependency unavailable 是否被写 clean | pass | unavailable 阻断，且进入 Step 11 VETO 候选 |
| 当前是否伪造证据事实 | pass | instance/report/review 均为 0，actual 全为 `not_evaluated` |

## 10. 回填草稿

正式 §10 应保留：四层证据边界、runtime instance 身份、5 个 observability/audit gate、18 个 EV 逐项闭环、14 个 report/acceptance/review gate、停审和跨证据审计结论。正文不得把 planned slot/alias 写成已存在，不得展示伪 `<run_id>` 或 digest，不得写 actual pass/verdict/signoff。

## 11. 待确认事项、blocker 与下一步

| blocker | 影响 | 当前处理 |
|---|---|---|
| `RUN-DDD-001~003` | 无实现、runner/store/cache，无法产生 raw/report/check | 所有 runtime evidence `not_evaluated`；不创建目录或样例实例 |
| `RUN-UP-001~008` | owner/SDK/platform positive producer 缺失 | T1 safe negative contract 可规划；启用后的 T2+ positive 保持 blocked |
| `RUN-OPS-001~002` | SLO、真实 integration/GRC 与 formal retention 缺失 | 不造阈值、环境、formal audit 或归档期限 |
| `RUN-DOC-002~003` | 正式 06/07 尚未完成 | Step 15/后续 07 分别处理；不提前关闭 |

- [x] 18 个 canonical EV 均闭环到 TC、producer、same-run pair、check、AC 和缺失影响。
- [x] fixed-run report、四项完整性检查、acceptance handoff 与 review 门禁可判定。
- [x] Runner local telemetry、测试证据与 owner formal audit truth 已分离。
- [x] orphan/static/cross-run/`latest`/missing-pair/unreviewed-draft 均被阻断。
- [x] actual instance/report/review/verdict 均未生成。
- [x] 允许进入 Step 11；正式 06 仍禁止写入。
