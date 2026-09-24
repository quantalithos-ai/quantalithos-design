# Step 9. 定义非功能验收门禁

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 9  
> 回填章节：`06-验收标准.md` §9 非功能验收门禁  
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与事实边界

| 项 | 当前值 |
|---|---|
| current_document | `06-验收标准.md` |
| current_step | Step 9 |
| current_module | `nonfunctional:safety_availability_consistency_trace_observation_portability_measurement` |
| gate_status | `pass_for_step_10` |
| actual_nfr_results | 0；全部 `not_evaluated` |
| numeric_slo_authority | `absent / RUN-OPS-001` |
| formal_06_write_allowed | `false_until_step_15` |
| next_allowed_action | 创建并完成 Step 10 |

本文只定义如何裁决，不包含性能结果、SLO、生产观测、跨平台实测或 readiness。旧文档中的 `<200ms`、`<1s`、`100%`、冷/热启动、并发和容量数字全部为 historical pollution，不进入门禁。

## 2. 输入、优先级与阈值纪律

| 输入 | 用途 |
|---|---|
| 00 §13～§14 | 六类正式 NFR 与 AC 禁止条件 |
| 01 §13、03 §10～§15、04 §8～§12 | 安全、一致性、恢复、观测、配置和跨平台设计约束 |
| 05 §10、§12～§14 | 八类专项、T0～T4、evidence、回归与 residual |
| Step 5～8 | P0 功能/红线/协议/状态事务门禁及 target-tier |

阈值来源顺序固定为：正式需求/验收 → owner/platform/security/operations authority → 经批准且绑定 workload/platform/实现的 baseline。没有来源时只允许记录 measurement、分布、样本和 residual，不能设 hard pass 数值、不能声明达标，也不能支持 T3/T4 verdict。

布尔安全不变量（例如 owner write=0、Query write=0、outbound event=0、raw forbidden finding=0）不是无来源性能阈值；它们直接来自正式需求/设计红线，任何非零都失败。

## 3. SOP 问题回答与取舍

| 问题 | 收口答案 |
|---|---|
| 哪些 NFR 是 P0？ | 安全/truth boundary、可用性 fail-closed、一致性/幂等、Unknown 恢复、追溯与证据边界、观测/redaction、selected platform 的资源/清理安全均为 P0。 |
| 哪些指标有 hard threshold？ | 仅正式不变量的零违规/零危险副作用、全 required item 有明确 actual status、所有 selected/required platform/slot 均需门禁结论；性能延迟/吞吐/容量/SLO 当前无数值 authority。 |
| 哪些专项未覆盖会影响验收？ | target tier required 的 `NF-RUN-SEC/CONS/REC/DEP/OBS/PORT` 未执行或 blocked 均不能总体通过；`NF-RUN-PERF` 在无 authority 时只形成 measurement residual，T3/T4 若 authority 要求则必须重基线；`NF-RUN-UX` 为 P1 补充。 |
| 哪些失败阻断？ | P0 assertion/check failed、required suite blocked/not_run、redaction/dependency finding、unsafe fallback/replay/cleanup、selected platform 未覆盖均阻断；VETO 由 Step 11 收口。 |
| 证据从哪里来？ | 同一 fixed run 的对应 EV detail/index、producer suite raw/report、gate-results、redaction/dependency/link/pairing checks；measurement 另需 workload/platform/baseline authority ref。 |

## 4. 非功能验收门禁

共同 report 入口：`reports/runs/<run_id>/evidence-index.md`、`gate-results.md`；每个 EV 需对应 detail 和 same-run raw/suite/check pair。actual result 当前全部为 `not_evaluated`。

| ID / 维度 / 优先级 | 要求与有来源阈值 | 通过条件 | 失败/blocked 条件 | TC / EV / report | tier 裁决 |
|---|---|---|---|---|---|
| `NFA-RUN-001` 安全与 truth boundary / P0 | owner write、private dependency、implicit selector、dangerous fallback 均为 0 | `latest/default`、越权 scope、未资格材料、私有 backend/DB/bus、owner truth write 均被拒绝且危险调用=0 | 任一违规/扫描 unavailable；角色/cache/profile/ACK 补 authority | `TC-RUN-CTX/CON/ENT/CFG/BND/OBS-*`；`EV-RUN-CTX-001`、`CON-010`、`ENT-013`、`CFG-016`、`OBS-017`、`BND-018`；`dependency-boundary.md` | 所有 tier required；失败 VETO 候选 |
| `NFA-RUN-002` 可用性/fail-closed / P0 | 无 uptime 百分比；正式要求是 unavailable/denied/conflict 时有 typed posture、安全下一步、零 fail-open | Artifact/Governance/Sandbox/Runtime/Observability/platform/store 失效分别为 Blocked/Unavailable/Unsupported/Unknown/Degraded，核心安全门禁不被跳过 | 空值/旧 cache/fake/alternate private impl 继续；意外 dependency unavailable 被写 pass | `TC-RUN-CTX/MAT/REQ/OWN/RES/REC/CFG-*`；相关 EV；`gate-results.md` | T1 semantic fault required；T2+ selected slot positive/negative required |
| `NFA-RUN-003` 幂等、一致性与并发 / P0 | duplicate second effect=0、Query writes=0、event emit=0；expected version/generation exact | same duplicate exact replay；different digest/version/generation Conflict；UoW 原子；claim/checkpoint current | last-write-wins、missing result rerun、Blocked 压缩、stale overwrite、Query mutation | `TC-RUN-IDM/UOW/QRY/JOB/CNS/BND-*`；`EV-RUN-IDM-011`、`UOW-012`、`QRY-009`、`JOB-015`、`CNS-014`、`BND-018` | 所有 tier required；durable proof按 target tier |
| `NFA-RUN-004` 断线、Unknown 与恢复 / P0 | 无“自动恢复率”；安全阈值是 ambiguous effect 自动 resend/reclaim/resume/delete=0 | disconnect/sleep/restart/expiry/commit unknown 建 `RecoveryCase`，freeze，formal readback/manual review；旧 effect 不重放 | reconnect/cache/cursor/PID 推导成功，Unknown 压成 failure/success，guard unknown 删除 | `TC-RUN-REC-001~006`、`UOW-004`、`JOB-003/004/007`、`RES-005`；`EV-RUN-REC-007`、`UOW-012`、`JOB-015`、`RES-006` | T1 semantic required；T2+ owner readback real evidence required if enabled |
| `NFA-RUN-005` 审计/追溯与来源保真 / P0 | 每个 in-scope result 必须有 source/correlation/freshness/visibility/ref；local record→formal audit/evidence 数为 0 | selection→authority→material→intent→owner projection→cleanup/diagnosis 各轴可回指；stale/partial/restricted 保真 | orphan ref、source/freshness丢失、local log/receipt/report 冒充 formal audit/evidence | `TC-RUN-OWN/QRY/OBS/BND/CON-*`；`EV-RUN-OWN-005`、`QRY-009`、`OBS-017`、`BND-018`、`CON-010`；`evidence-link-check.md` | 所有 tier required；formal audit truth 仍归 L4 |
| `NFA-RUN-006` 可观测性与 redaction / P0 | forbidden raw secret/token/body/path/URL/PID/port/stack finding=0；metrics 仅 finite low-cardinality labels | Command/Query/Consumer/Job 有 safe kind/outcome/correlation；Unknown 有 case/issue；artifact/report 双面 scan clean | raw fallback、accepted success metric误记、scanner unavailable、high-cardinality/free-text label | `TC-RUN-OBS-001~006`、`PRE-001~006`；`EV-RUN-OBS-017`、`PRE-008`；`redaction-check.md` | 所有 tier required；finding/unavailable 为 VETO 候选 |
| `NFA-RUN-007` 兼容性、跨平台与资源/清理 / P0 | baseline 选中的 platform/OS/arch/capability 全部有结论；无预设产品或固定数量阈值 | platform capability/unsupported/conflict typed；probe≠allocation；guard/current lease/capture/handoff/retention/orphan 保护；平台差异不改变 truth | selected platform not_run/blocked、静默换端口/抢占、Docker/gVisor/Firecracker/Tauri 假定、ACK→Cleaned | `TC-RUN-RES-001~006`、`CFG-004/006`、`BND-006`；`EV-RUN-RES-006`、`CFG-016`、`BND-018`；`dependency-boundary.md` | T1 platform-neutral semantics required；T3/T4 selected platforms real positive required |
| `NFA-RUN-008` 性能、资源与容量 measurement / conditional | 无数值 authority；只测 selection/validation、bounded query、recovery read、redaction scan、local collisions、metadata/cache growth 的分布/趋势 | baseline 固定 workload、sample、platform、implementation、tool 与 threshold authority 时按其裁决；否则完整记录 exploratory measurement 与 residual，不宣称 pass | 继承旧 `<200ms/<1s/100%`、选择样本、无 workload/platform/digest 仍宣称达标 | `NF-RUN-PERF`；未来 run measurement/raw/report；当前无独立 runtime EV alias，不得借其他 EV 冒充 | T1 不作为 hard release threshold；T3/T4 若 baseline/authority 要求则 required，否则 residual only |
| `NFA-RUN-009` 失败体验与可理解性 / P1 | 无百分比；人工审查 exact state/source/freshness/reason/next-step 是否不误导 | authority/integrity blocked、accepted/pending/unknown、resource conflict、stale/restricted、disconnect 文案与状态一致 | 文案宣称 running/cleaned/approved/evidence，隐藏 blocked/unknown 或提供危险动作 | `NF-RUN-UX` + affected QRY/PRE/CTX/REQ/RES/REC EV；`reports/review/*` | 不降低 P0；T3 产品 rehearsal 可由 baseline 升为 required |

## 5. Target-tier NFR 分母

| Target tier | required NFR | 不允许的升级 |
|---|---|---|
| `T1-SEMANTIC-P0` | `NFA-RUN-001~007` 的 Runner-owned semantic/negative/zero-effect；`008` measurement contract；`009` P1 | semantic fake、设计完成或零样本不能称 integration/product/release pass |
| `T2-CONTROLLED-INTEGRATION` | T1 + baseline enabled slot 的正/负/Unavailable/Unknown/recovery；selected platform slot 按 manifest | 未启用 slot 的 safe blocked 不贡献 positive；单 slot pass 不代表全链 |
| `T3-PRODUCT-REHEARSAL` | T1/T2 + approved product-like environment、selected platforms、真实主链/cleanup/redaction；baseline 可要求 UX/measurement threshold | profile 名、PID/port、局部 owner success 不等 product readiness |
| `T4-RELEASE/ACCEPTANCE` | T1～T3适用项 + release evidence/check/VETO/risk/signoff；有 authority 的 SLO/capacity threshold 必须满足 | verdict 本身仍不自动表示 production readiness |

## 6. 缺失、测量与 residual 规则

| 情况 | 裁决 |
|---|---|
| P0 suite/check 未运行或 unexpected dependency unavailable | `blocked/not_run`，不能通过 |
| controlled fault 得到预期 typed fail-closed + zero effect | 该负向 TC 可 pass；不证明 positive availability |
| target-tier required positive slot/environment/platform 缺失 | 对应 NFR `blocked`，总体不能通过 |
| 性能/SLO 无 authority | 不设 hard number；登记 `RUN-OPS-001` residual，不得宣称性能通过/不通过 |
| threshold 有 authority 但 workload/platform/implementation/run 不匹配 | evidence invalid；新 baseline/run |
| UX review 未做 | P1 residual；若 baseline 将其升为 required 则 blocked |
| scanner/check unavailable | 不是“零 finding”；P0 blocked/failed，按 Step 11 VETO 处理 |

## 7. NFR 停审与跨门禁审计

| NFR | 正式来源 | 阈值来源清楚 | TC/EV/report | tier 影响 | 设计停审 | Actual result |
|---|---:|---:|---:|---:|---:|---|
| `NFA-RUN-001` | pass | pass | pass | pass | pass | `not_evaluated` |
| `NFA-RUN-002` | pass | pass | pass | pass | pass | `not_evaluated` |
| `NFA-RUN-003` | pass | pass | pass | pass | pass | `not_evaluated` |
| `NFA-RUN-004` | pass | pass | pass | pass | pass | `not_evaluated` |
| `NFA-RUN-005` | pass | pass | pass | pass | pass | `not_evaluated` |
| `NFA-RUN-006` | pass | pass | pass | pass | pass | `not_evaluated` |
| `NFA-RUN-007` | pass | pass | pass | pass | pass | `not_evaluated` |
| `NFA-RUN-008` | pass | pass（measurement only） | conditional | pass | pass | `not_evaluated` |
| `NFA-RUN-009` | pass | n/a | conditional | pass | pass | `not_evaluated` |

| 跨审计 | 结论 | 处理 |
|---|---|---|
| 六类正式 NFR 是否覆盖 | pass | 性能、可用性、安全、审计、幂等、一致性、可观测性全覆盖；兼容/跨平台单列 |
| 无来源阈值污染 | pass | `<200ms/<1s/100%` 与旧成功率/容量为 0 |
| 安全零违规是否误当性能阈值 | pass | 明确为正式布尔不变量 |
| blocked/not_run 是否计 pass | pass | 全部禁止；controlled negative 仅证明负向行为 |
| P1 是否降低 P0 | pass | PERF/UX 不绕安全/一致性门禁 |
| evidence 是否可追踪 | pass | canonical 18 EV + fixed checks/report；不新造 runtime EV |
| 当前是否伪造实际 NFR | pass | 9/9 `not_evaluated`，无 SLO/readiness 声明 |

## 8. 回填草稿、blocker 与下一步门禁

正式 §9 应保留阈值纪律、9 项 NFR 门禁、tier 分母和 residual 规则。不得复制旧数值，不得将 measurement plan 写成性能 pass，不得把 semantic controlled fault 写成生产可用性。

| blocker | 影响 | 当前处理 |
|---|---|---|
| `RUN-OPS-001` | performance/capacity/SLO 无 authority | `NFA-RUN-008` measurement/residual only |
| `RUN-OPS-002` | T2～T4 integration/GRC environment 缺失 | required positive blocked |
| `RUN-UP-001~008` | owner/SDK/platform positive NFR evidence 缺失 | T1 negative/semantic；higher tier blocked |
| `RUN-DDD-001~003` | 无实现、runner/store/cache | actual NFR execution not entered |

- [x] P0 安全、可用性、一致性、恢复、追溯、观测与跨平台门禁可判定。
- [x] 性能/容量/SLO 无 authority 时只作 measurement/residual。
- [x] 每项有正式来源、通过/失败、TC/EV/report 与 tier 影响。
- [x] NFR 停审和跨门禁审计无 unresolved 内部冲突。
- [x] 允许进入 Step 10；正式 06 仍禁止写入。
