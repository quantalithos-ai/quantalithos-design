# L4-observability 06-验收标准 Step 05：定义功能验收门禁

## Step 状态

| 字段 | 当前值 |
|---|---|
| project / document | `L4-observability` / `06-验收标准.md` |
| step | `05 / 定义功能验收门禁` |
| mode | `full-restart` |
| status | `completed_current_design_record_with_inherited_affected_open` |
| current_module | `ac_obs_001_031_function_decision_loops` |
| formal_document_write | `not_allowed_until_step_15` |
| real execution | `not_run`;以下均为未来裁决合同 |
| new_upstream_blocker | `none` |
| inherited blocker / affected | 12 项保持开放，见 §9 |
| gate_status | `pass_for_function_gate_design` |
| next_allowed_action | `start_current_06_step_06` |
| commit | 不需要；用户未要求提交 |

本文件替换同名旧模板。旧文件没有使用 current `AC-OBS-001~031`，也没有设计契约、exact TC、candidate
linkage、report path、通过/失败条件和裁决影响，不能作为验收输入。

## 1. 本步目标、输入与执行计划

### 1.1 目标与输入

本 Step 以 31 个 current `AC-OBS-*` 为裁决主轴，把五个核心闭环、13 个功能、规则/数据归属和质量边界转成
可判定门禁。设计事实来自 `00` 和 `03`，测试 linkage 来自 `05`；`EV-CAND-OBS-*` 只表示未来 evidence 槽。

| 输入 | 本步使用 |
|---|---|
| 验收 SOP Step 05 / 书写规范 §5.5 | 逐项小循环、停审和跨功能审计要求 |
| Step 01~04 | current AC/VF、P0 范围、baseline 和进入/退出规则 |
| `00-需求文档.md` §7~§14 | `C-OBS-1~5`、`FR/BR/DO/NFR`、`AC-OBS-001~031` |
| `03-详细设计.md` §7~§14 | exact protocol、flow、state、UoW、error、redaction/no-write |
| `05-测试方案.md` §5~§13 | exact TC、DS、primary suite、candidate EV 和 report path |

### 1.2 Step 内计划完成情况

| 计划项 | 产物 | 状态 |
|---|---|---|
| 读取 current AC、设计 contract 和测试 mapping | 输入索引 | done |
| 按五个核心闭环收口 AC 001~005 | §4.1 | done |
| 按 13 FR 收口 AC 006~018 | §4.2 | done |
| 收口规则 / 数据 / NFR AC 019~031 | §4.3~§4.5 | done |
| 完成逐项停审与跨功能审计 | §6~§7 | done |
| 形成正式 §5 回填草稿和 gate | §10~§12 | done |

## 2. SOP 问题回答

| 问题 | Current 回答 |
|---|---|
| P0 功能通过条件 | 正式设计契约在 required lane/profile 的真实 run 中按 exact TC 成立，正向、负向、no-write / body-free / side-effect 断言均满足。 |
| P0 功能失败条件 | exact contract 不成立、required evidence 缺失、blocked 被计入 passed、外部 phase 被误当本地成功、或触发关联 VF。 |
| 证据来源 | 同 run raw case + 唯一 primary suite report + `evidence-index.md`；必要时叠加 redaction / dependency / report audit。 |
| P1 功能如何处理 | 真实产品、RuntimeLike、external consumer / archive / dashboard 只验 seam；未纳入 selected delivery 时不替代 P0，纳入后缺证则 blocked。 |
| 哪些失败导致总体不通过 | AC 001~030 的任一 P0 required gate 失败；AC 031 发现无来源硬指标/产品假设进入 current gate；任何关联 VF 触发。 |
| 是否回指正式来源 | 31/31 均回指 requirement / design section、exact TC family、candidate linkage 和固定 report root。 |
| 是否完成逐项停审 | 是，见 §6；停审只表示设计闭合，不表示真实执行通过。 |
| 跨功能冲突 | 无 unresolved 冲突；I05/J06/UoW/external 等 positive path 继续 conditional/blocked。 |

## 3. 当前问题诊断与裁决取舍

| 旧写法 / 方案 | 结论 | 原因 / Current 处理 |
|---|---|---|
| 只验五个核心闭环 | 拒绝 | 不能覆盖 13 FR、规则、数据归属和 NFR；保留 31 个正式 AC |
| 把 99 TC 直接变成 99 AC | 拒绝 | TC 是测试执行身份，不是需求裁决身份；AC 为主、TC 为证据 |
| 每个 AC 只引用一个 happy-path TC | 拒绝 | 必须包含 negative/boundary、truth/no-write 和 applicable recovery evidence |
| candidate EV 视为真实 evidence | 拒绝 | 没有 raw/report provenance；只保留 planned linkage 名称 |
| 核心闭环由 `REL-001~005` 单独证明 | 拒绝 | release composite 必须与各基础 family 证据共同成立；不能用一条 smoke 覆盖底层失败 |
| AC 031 用历史 P95 / 产品栈填阈值 | 拒绝 | 这正是 AC 031 / VF 009~010 要阻断的行为 |

## 4. 结构化功能验收门禁

统一证据入口：每个 `TC-OBS-X-NNN` 的 candidate linkage 为同 suffix 的 `EV-CAND-OBS-X-NNN`，raw case 位于
`artifacts/test/<run_id>/suites/<primary-suite>/cases/<TC>.json`，suite report 位于
`reports/runs/<run_id>/suites/<primary-suite>.md`，总索引位于 `reports/runs/<run_id>/evidence-index.md`。
下表中的 range 必须在真实 index 中展开，不能以 wildcard 作为 evidence record。

### 4.1 五个核心闭环

| AC | 场景 / 设计契约 | 通过条件 | 失败条件 | Exact TC / candidate linkage | 裁决影响 |
|---|---|---|---|---|---|
| `AC-OBS-001` | `C-OBS-1`; `03` C01~C04、I01、receipt/safety/correlation flow | safe material 可 accepted/rejected/quarantined/degraded；来源、关联、redaction 和重复语义成立；forbidden body 为 0 | raw/secret 入面、来源/状态被猜、重复二写、入口无法显式失败 | `ING-001~004`,`COR-001~003`,`RED-001~004`,`REL-001` / 同 suffix EV | P0 failure；若闭环不成立触发 `VF-OBS-001/002` |
| `AC-OBS-002` | `C-OBS-2`; C05/C06、Q05/Q06、E04/E05、audit/evidence state | audit projection append-only、evidence linkage body-free、visibility/gap/provenance 可追溯 | 保存 source/evidence body、projection 冒充外部 truth、linkage 无 owner/digest | `AUD-001~004`,`EVD-001~004`,`REL-002` / 同 suffix EV | P0 failure；可能触发 VF 003/004 |
| `AC-OBS-003` | `C-OBS-3`; C04、Q03/Q04/Q09/Q10、safe signal/rollup/diagnostic | safe log/metric/trace summary、finite labels、correlation、freshness/degraded 均可判定且不等于 execution truth | raw signal/高敏 label、false Fresh、telemetry 推进业务状态、递归失控 | `SIG-001~006`,`DEG-001~005`,`REL-003` / 同 suffix EV | P0 failure；可能触发 VF 002/004 |
| `AC-OBS-004` | `C-OBS-4`; Q01~Q14、C07/C08、J07、diagnostic/report/hint | Query 全部 zero-write；handoff input immutable；hint 不生成 alias/verdict；external phase 有 intent/token/fence | Query repair/write、交接生成 verdict/signoff、blind external retry、missing 被当 success | `QRY-001~004`,`DIA-001~004`,`RPT-001~005`,`AUT-001~003`,`REL-004` | P0 failure；可能触发 VF 005/006 |
| `AC-OBS-005` | `C-OBS-5`; C09~C13、Q08/Q11/Q14、J02/J03/J05/J06/J09 | active/held/referenced 优先；rebuild/replay 只改派生面；no-write violation 可记录且 attempted write 仍阻断 | active material 被清理、source repair/write、J06 fabricated Completed、rollback 留部分写 | `RET-001~005`,`REB-001~006`,`NW-002~005`,`UOW-001~008`,`REL-005` | P0 failure；可能触发 VF 001/005/007；J06 positive blocked |

### 4.2 13 个功能能力

| AC / FR | 正式设计入口 | 可判定通过条件 | 可判定失败条件 | Exact TC / candidate EV | 裁决影响 |
|---|---|---|---|---|---|
| `AC-OBS-006` / FR001 | C01 `SubmitObservationMaterial`; receipt/safety accepted flow | required source/purpose + safe material 形成 exact committed receipt/result；invalid/raw 分支无 partial write | silent accept、quarantine 被写 accepted、accepted 缺 result/history | `ING-001~004` / `EV-CAND-OBS-ING-001~004` | P0 failure |
| `AC-OBS-007` / FR002 | C03 `BindCorrelationContext`; correlation owner/source | trace/causation/source 保持 typed、source parity、partial 显式；opaque ref 不推导业务关系 | source mismatch、typed ref 混用、correlation 被当业务 truth | `COR-001~003` / matching EV | P0 failure |
| `AC-OBS-008` / FR003 | C02 `RecordSafetyDisposition`; redaction-before-serialization | Pending 合法进入 Safe/Redacted/Rejected/Quarantined；forbidden material 在 serializer/sink 前阻断 | terminal rewrite、hash/base64 绕过、unsafe field 仍输出 | `RED-001~004` / matching EV；`redaction-check.md` | P0 failure / VF 002 |
| `AC-OBS-009` / FR004 | C05/Q05/E04；`AuditProjectionState`、append UoW | body-free source audit ref、subject/context、visibility 和 append record 同 UoW | source audit body 入仓、wrong owner、append record / projection 分叉 | `AUD-001~004` / matching EV | P0 failure / VF 004 |
| `AC-OBS-010` / FR005 | C06/Q06/E05；`EvidenceLinkageState` | boundary ref、digest、purpose、visibility/gap 唯一且 body-free；preview 不保存 | evidence body、wrong owner、无 digest、Query preview 写入 | `EVD-001~004` / matching EV | P0 failure / VF 003；I05 positive conditional |
| `AC-OBS-011` / FR006 | C04/Q03/Q04/E03；safe signal/rollup | 只使用 safe summary；rollup 仅聚合 stored Recorded signal；marker/freshness 可追溯 | raw log/metric/trace、incomplete cursor 标 Fresh、signal 反写 runtime | `SIG-001~006` / matching EV；metric-label check | P0 failure |
| `AC-OBS-012` / FR007 | Query surfaces；gap/degraded/availability | Missing、NotVisible、Stale、Rebuilding、Unavailable、Degraded 保持 distinct，恢复需正式依据 | 空值/timeout 当成功或 missing；Blocked 返回替代成功；Query 原地 reset | `DEG-001~005` / matching EV | P0 failure |
| `AC-OBS-013` / FR008 | Q01~Q14，§8.3 strict read-only flow | 14/14 visible/empty/missing/hidden/stale/corrupt rows有 total surface，全部 write spy 0 | 任一 Query reserve/UoW/history/outbox/refresh/rebuild/repair | `QRY-001~004`,`NW-001` / matching EV | P0 failure / VF 005 |
| `AC-OBS-014` / FR009 | Q10 `GetDiagnosticView`; recursion/no-write guard | committed composite 原子可读；scope/summary/marker/progress parity；self-observation recursion 被抑制 | partial/corrupt composite 被拼成成功、diagnostic 下控制命令或 repair | `DIA-001~004` / matching EV | P0 failure / VF 005 |
| `AC-OBS-015` / FR010 | C07/Q07/J07/E06；handoff lifecycle | complete immutable evidence input、visibility/gap/retention/no-write readiness；external phase same binding/token | ref-only input、blocked still deliver、Delivered 被写成验收通过 | `RPT-001~005` / matching EV；report-audit | P0 failure；external phase conditional |
| `AC-OBS-016` / FR011 | C08；`AuthenticityHintState`; provenance | RealEvidenceLinked 仅来自 formal owner-backed origin；placeholder/insufficient 显式；无 alias/verdict | no-origin Real、terminal hint rewrite、candidate/static 被当真实证据 | `AUT-001~003` / matching EV | P0 failure / VF 006/010 |
| `AC-OBS-017` / FR012 | C09/C10/Q08/E07；retention/protection states | active consumer/hold/reference 优先阻断 release/cleanup；状态变化 versioned 且可追溯 | protected material cleanup、ReleaseEligible 当删除、并发释放丢保护 | `RET-001~005` / matching EV | P0 failure / VF 007 |
| `AC-OBS-018` / FR013 | C11~C13、J02/J03/J05/J06/J09、maintenance states | immutable plan、claim/fence、bounded capture、failure report；派生面重建且 source writer=0 | source repair、plan/resume 漂移、stale fence commit、J06 fake positive | `REB-001~006`,`NW-002` / matching EV | P0 failure / VF 005；J06 positive blocked |

### 4.3 规则与边界能力

| AC | 正式规则 / 设计入口 | 通过条件 | 失败条件 | Exact TC / report | 裁决影响 |
|---|---|---|---|---|---|
| `AC-OBS-019` | BR001~006；entry/redaction/config | 来源、安全、关联、typed metadata 和准入状态齐备；strict config 不可绕过 | raw/secret/unsafe default、无来源 material 被 accepted | `ING-*`,`COR-*`,`RED-*`,`CFG-001~006`；suite + redaction | P0 failure |
| `AC-OBS-020` | BR007~010；audit/evidence/handoff | audit/evidence 只读 body-free；缺口、责任、目的和 provenance 可反查 | 正文入仓、缺口隐藏、linkage 多义 | `AUD-*`,`EVD-*`,`OWN-*`；suite + evidence index | P0 failure |
| `AC-OBS-021` | BR011~014；telemetry schema/allowlist | log/metric/trace 安全、有限、低基数、可关联；不声称执行真相 | raw body、高基数 ref/key/digest、telemetry->truth transition | `SIG-*`,`RED-*`,`TRUTH-003`；redaction + metric check | P0 failure |
| `AC-OBS-022` | BR015~019；Query/diagnostic/handoff/export | 所有 read/report/export surface no-write、no-control、no-verdict，phase/state distinct | hidden write、control command、report/evidence fabrication | `QRY-*`,`DIA-*`,`RPT-*`,`AUT-*`,`NW-*`,`EXT-*` | P0 failure / VF 005/006 |
| `AC-OBS-023` | BR020~023；retention/rebuild/replay/no-write | active reference guard、typed gap、immutable rebuild scope、source writer 0 | active cleanup、source repair、synthetic success | `RET-*`,`REB-*`,`NW-*`,`UOW-*` | P0 failure / VF 005/007 |
| `AC-OBS-024` | BR024~026；dependency/product/history boundary | compile edge 仅 core-contracts；sibling 只 runtime/event/handoff；产品/旧材料不成 truth | non-core sibling compile、bus package dependency、历史 fallback、vendor hard owner | `DEP-001~003`,`HIST-001~002`,`EXT-001~003`；dependency/report audit | P0 failure / VF 008~010 |

### 4.4 数据归属能力

| AC | 数据边界 | 通过条件 | 失败条件 | Exact TC / report | 裁决影响 |
|---|---|---|---|---|---|
| `AC-OBS-025` | owned observation fact / projection / marker / handoff | owned rows 有唯一 owner、typed identity、state/history/UoW；与外部 truth store before/after 分离 | owner 漂移、外部 truth 被本仓更新、owned fact 无 history/provenance | `OWN-001~004`,`TRUTH-001~003`,`UOW-*` | P0 failure / VF 004/005 |
| `AC-OBS-026` | safe snapshot / read / diagnostic / impact summary | snapshot 只保存 body-free committed material，source/version/freshness 可解释，不能反向升级 truth | snapshot 替代 source、stale/unknown 写 Fresh、Query 刷新 | `DEG-*`,`QRY-*`,`DIA-*`,`TRUTH-*` | P0 failure |
| `AC-OBS-027` | source/evidence/consumer/reference linkage | typed ref owner 隔离、relation 唯一、正文 lifecycle 留在 source owner | typed ref 同字节混用、linkage 持有正文/locator、consumer 接管 owner | `EVD-*`,`OWN-002/004`,`EXT-*` | P0 failure / VF 003/004 |
| `AC-OBS-028` | forbidden body / secret / execution / verdict material | schema、store、event、telemetry、report 全扫描为 body-free；unsafe input fail closed | 任一 forbidden material 进入 durable/public/report surface | `RED-*`,`EVD-*`,`RPT-005`,`AUT-003`,`OWN-*`；redaction check | P0 failure / VF 002/003/006 |

### 4.5 非功能与验收自身完整性

| AC | 正式入口 | 通过条件 | 失败条件 | Exact TC / report | 裁决影响 |
|---|---|---|---|---|---|
| `AC-OBS-029` | NFR001~020；UoW/recovery/degraded | 安全、可用、可追溯、幂等、一致性和自观测的 capability-level judgment 全部可证；无来源性能仅 sample/trend | required recovery/availability/no-write 不成立，或以未定义数值代替能力判断 | `DEG-*`,`UOW-*`,`NFR-003`,`CFG-*`；summary/gate results | P0 failure |
| `AC-OBS-030` | NFR021~024；ownership/dependency/evidence | 全仓不越权、外围降级不污染核心、historical/product/evidence misuse 可被阻断 | 外部产品或观察输出成为第二 truth，边界违规不可观察 | `OWN-*`,`TRUTH-*`,`NW-*`,`DEP-*`,`HIST-*`,`EXT-*` | P0 failure |
| `AC-OBS-031` | no-source threshold / implementation non-gate | current gate 只使用有正式来源的 capability/contract；历史 P95/SLA/retention/product/stack 均未硬化 | 无 source 的数字、产品、目录、backend 或旧文档被写成 pass/fail | `NFR-001~002`,`HIST-001~002`,`CFG-006`；report-audit | P0 failure；可能 VF 009/010 |

## 5. Evidence 与 suite 解释规则

| 规则 | 判定 |
|---|---|
| exact expansion | 表内 range 只作设计索引；真实 `evidence-index` 必须展开每个 TC/EV/DS/suite/path |
| primary suite | 每个 TC 只有一个 current primary suite；secondary check 不创建第二 evidence identity |
| composite closure | `REL-001~005` 只证明组合行为，不能覆盖底层 family failure或缺失 |
| conditional row | `planned_conditional`、`planned_blocked_controlled`、`planned_not_evaluated` 不能计入 passed |
| required lane | exact row 要求 INT/RT 时 ISO 结果不能替代；每次 invocation 独立 run/provenance |
| candidate truthfulness | `EV-CAND-OBS-*` 只有在真实同 run raw relation 存在后才可进入 candidate index，永不等于 final evidence/signoff |

## 6. 功能验收项停审记录

| 验收项组 | 数量 | 正式设计来源 | exact test/evidence source | 通过/失败可判定 | current 停审结论 |
|---|---:|---|---|---|---|
| `AC-OBS-001~005` | 5 | C-OBS + `03` exact flow/state/UoW | family rows + `REL-001~005` | 是 | `pass_design`;真实 RT 未运行 |
| `AC-OBS-006~018` | 13 | FR + C/Q/E/J exact contract | 13 canonical TC families | 是 | `pass_design_with_affected_open` |
| `AC-OBS-019~024` | 6 | BR + config/dependency/redline | functional + CFG/DEP/HIST/EXT | 是 | `pass_design` |
| `AC-OBS-025~028` | 4 | DO + owner/store/schema | OWN/TRUTH/NW/RED/EVD | 是 | `pass_design` |
| `AC-OBS-029~031` | 3 | NFR + no-source rule | NFR/CFG/DEP/HIST + reports | 是；硬阈值明确不评估 | `pass_design` |
| **总计** | **31** | 无 orphan AC | 每项有 TC/report 入口 | 是 | `31/31 design-closed` |

逐项停审共同检查：正式 ID 未改名；设计来源可定位；通过与失败不是镜像空话；candidate linkage 未冒充真实证据；
P1/P2 未污染 P0；affected positive path 未写成 pass。

## 7. 跨功能门禁裁决审计

| 审计项 | 结果 | 处理 |
|---|---|---|
| orphan AC | 0 / 31 | Step 15 再做正文审计 |
| AC 使用旧协议 / 状态 / suite | 0 | 只使用 current exact name |
| candidate EV 当真实 evidence | 0 | 全文标为 future linkage |
| 只有 happy-path、无负向 | 0 | 每组含 negative/redline/recovery 入口 |
| composite smoke 覆盖底层失败 | 0 | 明确禁止 |
| P1/P2 被计入 P0 | 0 | selected scope 单独裁决 |
| affected positive claim | 0 | I05/J06/UoW/external 保持 blocked/conditional |
| 无来源 hard threshold | 0 | AC 031 主动阻断 |
| unresolved 裁决冲突 | 0 | 可进入 Step 06 |

## 8. Current 实际状态

目标实现仓、CI、durable runtime、RuntimeLike、真实 `<run_id>`、artifact、report、evidence 和验收签署均未建立。
所以 31 个 AC 当前状态全部是 `designed_not_executed`，不能填写 passed / failed；表中的 failure 是未来判定规则。

## 9. Inherited affected

以下 12 项继续开放，不能由本 Step 关闭：

`S08-E-I05-PAYLOAD-SCHEMA-01`、`S08-E-I05-PRODUCER-EVENT-BINDING-01`、`R06.6-F2-H13-UPSTREAM`、
`R06-F-AFFECT-UOW-01`、`S08-RECOVERY-CLASS-OWNER-01`、`R07-EXTERNAL-PHASE-LINK-01`、
`R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01`、`S08-CONSUMER-OUTBOX-SURFACE-01`、
`S08-CONSUMER-INDETERMINATE-COMPLETION-01`、`S08-JOB-REPORT-REF-OWNER-01`、
`S08-M1-SECONDARY-TYPE-OWNER-01`、`03-RPR-S09-PER-FLOW`。

它们主要影响 `AC-OBS-002/005/010/015/018/029` 的某些 positive paths。现有 fail-closed/blocked case 可以验证
安全处置，但不能证明正向能力通过；上游正式 owner 闭合后须更新 design/test baseline 并新 run 重验。

## 10. 正式 `06` §5 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_05_function_gate.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“结构化功能验收门禁”“Evidence 与 suite 解释规则”“功能验收项停审记录”和“跨功能门禁裁决审计”小节。

正式 §5 应保留 31 项 AC 的裁决表、统一 evidence path、range 展开规则、current 未执行状态和 affected positive
path 约束。Step 06~10 会补充同一 AC 的红线、协议、一致性、NFR 和证据门禁，但不得创造第二套 AC ID。

## 11. 待确认事项

| ID | 事项 | 当前状态 | 处理 |
|---|---|---|---|
| `Q-06-05-01` | selected delivery 是否要求 RuntimeLike 五闭环 smoke | `not_frozen` | Step 04/09/14 条件化；声明后不能由 ISO/INT 替代 |
| `Q-06-05-02` | I05 / J06 positive owner closure 时间 | `open_inherited` | 不在 06 伪造；对应 gate 保持 blocked |
| `Q-06-05-03` | P1 external product seam 是否纳入本轮送验 | `not_selected` | 未选择时只验 product-neutral contract；选择需新 baseline |

## 12. Step 自检与 gate

| 检查项 | 结论 |
|---|---|
| 31 个 AC 是否全部进入门禁 | `31/31` |
| 每项是否有设计、TC/EV、report、通过、失败、影响 | pass |
| 是否使用旧 AC/VETO/suite/protocol | no |
| 是否把 TC/EV/REL smoke 当成需求 truth | no |
| 是否伪造真实执行结果 | no |
| 是否发现新 upstream blocker | none |
| inherited affected | open，不阻断设计 gate |
| `gate_status` | `pass_for_function_gate_design` |
| `next_allowed_action` | `start_current_06_step_06` |
| 正式 `06` 是否修改 | no；Step 15 前禁止 |

## 13. 参考

- `standards/document/验收标准讨论流程_SOP.md` Step 05
- `standards/document/验收标准书写规范.md` §5.5
- `projects/L4-observability/design-calibration/06_acceptance_step_01_input_boundary.md` through `06_acceptance_step_04_entry_exit.md`
- `projects/L4-observability/00-需求文档.md` §7~§14
- `projects/L4-observability/03-详细设计.md` §7~§14
- `projects/L4-observability/05-测试方案.md` §5~§13
- `projects/L1-governance/design-calibration/06_acceptance_step_05_function_gate.md`
- `projects/L1-artifact/design-calibration/06_acceptance_step_05_function_gate.md`
