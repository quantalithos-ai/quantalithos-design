# L4-observability 06-验收标准 Step 11 · 一票否决项

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 11
> 回填章节: `projects/L4-observability/06-验收标准.md` §11
> 参考粒度: `projects/L1-governance/design-calibration/06_acceptance_step_11_veto.md`、`projects/L1-artifact/design-calibration/06_acceptance_step_11_veto.md`

## 1. Step 状态

| 项目 | 当前值 |
|---|---|
| project / document | `L4-observability` / `06-验收标准.md` |
| step | `11 / 定义一票否决项` |
| mode | `full-restart` |
| current_module | `veto_redline_coverage_and_non_overridable_decision` |
| status | `completed_current_design_gate` |
| formal_document_write | `not_allowed_until_step_15` |
| implementation / test execution | `not_started` / `not_run` |
| run / artifact / report / evidence | `absent_by_design`；只有 planned candidate linkage |
| current formal veto identifiers | `VF-OBS-001~010`；不创建 `VETO-OBS-*` alias |
| new_upstream_blocker | `none` |
| inherited affected | 12 项继续开放，不由本 Step 关闭 |
| next_allowed_action | `start_current_06_step_12` |
| commit | 不需要；用户未要求提交 |

本文件是验收标准讨论中间产物，不是验收执行记录。`VF-OBS-001~010` 是当前需求文档已经存在的正式红线
标识；本 Step 将它们收口为验收裁决条件，不把设计阶段的覆盖审计写成实际“未触发”或“已通过”。

## 2. 本步目标与边界

### 2.1 本步目标

本 Step 定义任何情况下都不能被风险接受、人工口头确认或较低等级缺陷覆盖的验收失败。每项否决红线必须
同时具备：

1. 当前正式来源，包括需求红线、架构 / 数据边界或详细设计不变量。
2. 可执行的检查入口，包括 exact test case、primary suite 或固定静态检查。
3. 同一 `<run_id>` 下可回指的 raw artifact、suite/report 和 provenance 路径。
4. 命中后的唯一裁决，以及证据不足时的 `blocked` / `not_evaluated` 语义。
5. 不允许通过风险接受降级的边界。

### 2.2 本步不负责的内容

| 不负责项 | 归属 |
|---|---|
| 重新定义功能、数据所有权或详细设计状态 | `00~03` 当前正式文档和对应 calibration Step |
| 生成真实测试结果、run、artifact、report 或 evidence alias | 真实实现 / 测试执行阶段；当前均未建立 |
| 记录当前缺陷单或关闭缺陷 | Step 12 及真实测试缺陷流程 |
| 决定某项 residual 是否接受 | Step 13，由正式角色和真实材料决定 |
| 填写最终结论、姓名、日期或签署 | Step 14 及真实验收执行 |
| 创建实现边界、implementation ledger 或代码 | `07`；本轮不得提前创建或修改 |

## 3. 本步输入与权威顺序

| 优先级 | 输入 | 本 Step 的使用方式 |
|---:|---|---|
| 1 | `standards/document/验收标准讨论流程_SOP.md` Step 11 | 固定逐项红线、检查证据、停审和跨 VETO 审计要求 |
| 2 | `standards/document/验收标准书写规范.md` §5.11 | 固定正式 §11 的表结构和“命中即不通过”语义 |
| 3 | `projects/L4-observability/00-需求文档.md` §14.3 | `VF-OBS-001~010` 的唯一需求层否决集合 |
| 4 | current `03-详细设计.md` §14~§15 及 Step 06/08 | truth owner、body-free、redaction、no-write、retention、phase 和 recursion 不变量 |
| 5 | `design-calibration/06_acceptance_step_05_function_gate.md` | `AC-OBS-001~031` 与五个核心能力的验收主语 |
| 6 | `design-calibration/06_acceptance_step_06_data_arch_redlines.md` | `DR-OBS-*` / `AR-OBS-*` 数据、依赖、产品和历史材料红线 |
| 7 | `design-calibration/06_acceptance_step_08_state_tx_consistency.md` | 27 个正式状态 owner、UoW、幂等、恢复和 no-write 断言 |
| 8 | `design-calibration/06_acceptance_step_09_nonfunctional.md` | `NFG-OBS-001~008`、profile/lane、硬门禁和未执行语义 |
| 9 | `design-calibration/06_acceptance_step_10_observability_evidence.md` | `OBS-MAT-001~010`、`EVG-OBS-001~009`、canonical evidence/report path |
| 10 | current `05` Step 06/09/11/13/14 | exact TC、suite、candidate linkage、S/A/B/R 分级和真实性规则 |
| 11 | L1-governance / L1-artifact Step 11 | 只参考逐项矩阵和审计粒度，不复制其业务 ID 或 truth 语义 |

### 3.1 历史材料处置

旧 `06` 中的 `VETO-OBS-*`、旧 README 的产品 / 性能假设、旧 evidence alias、静态 `passed` 文本和旧
implementation boundary 均标记为 `historical_material`。它们不参与当前否决集合，也不能作为本 Step 的
证据来源。当前正式编号只使用 `VF-OBS-001~010`，避免需求 VF、验收 VETO 和 candidate EV 形成三套
不一致的主键。

## 4. SOP 问题回答

| SOP 问题 | Current 回答 |
|---|---|
| 哪些失败会直接导致不通过? | 任一 `VF-OBS-001~010` 的实际 finding；以及无法建立所需证据、redaction / dependency / report integrity hard gate 失败，导致否决无法裁决时的暂停 / 不通过。 |
| 否决项来自哪个正式红线? | `VF-OBS-001~010` 直接来自 `00` §14.3；具体检查由 `03` 的 truth/no-write/retention/phase 不变量、`05` 的测试与证据契约和 Step 06/09/10 补充。 |
| 否决项如何检查? | 行为红线使用 exact `TC-OBS-*`、primary suite 和同 run raw case；静态边界使用 `check_redaction.sh`、`check_metric_labels.sh`、`check_dependency_boundary.sh`、documentation / report audit；最终由 `reports/acceptance/veto-checklist.md` 逐项复核。 |
| 否决项是否允许风险接受? | 不允许。命中 VF 时总体只能是不通过；证据缺失、扫描未执行或 report provenance 失败也不能被写成“未触发”。 |
| 是否覆盖所有 P0 红线? | `VF-OBS-001~010` 覆盖五个核心闭环、禁止正文、外部 truth、no-write、retention、证据真实性、依赖、产品中立和历史材料边界；Step 10/12 的硬门禁补齐检查入口，不新增第二套正式 VF。 |
| 每项能否回指需求、设计、测试和报告? | 可以。见 §8.2 的逐项闭环矩阵；每行同时给出 VF、AC/设计来源、exact TC / candidate EV、suite/check 和 canonical report path。 |
| 证据不存在时如何裁决? | 设计阶段为 `planned`；真实验收阶段缺 required raw artifact/report/evidence index 时为 `blocked` 或 `not_evaluated`，不得当作 `not_triggered`，也不得正向放行。 |
| 每项是否逐项停审? | 是。§8.3 对十项分别检查来源、检查方式、证据路径、命中裁决和不可风险接受性。 |
| 跨项是否存在漏覆盖或冲突? | 当前设计审计未发现新的漏覆盖；`VF-OBS-002/003` 与 `VF-OBS-004/006` 存在有意交叉，但判定主语和检查证据不同，见 §8.4。 |

## 5. 当前材料问题诊断

| 输入 / 位置 | 发现的问题 | Current 修正 |
|---|---|---|
| 旧 `06-验收标准.md` | 使用旧 `VETO-OBS-*`，部分来源、TC 和路径已不在 current `05` | 删除旧口径；正式 §11 直接使用 `VF-OBS-001~010` |
| 旧 Step 11 模板 | 只有 9 条简表，缺少 `VF-OBS-010`、逐项 report path、evidence 缺失语义和跨项审计 | 本 Step 扩展为十项逐行闭环矩阵 |
| `00` §14.3 | VF 是需求红线，但没有逐项验收 checklist 字段 | 由 §8.2 补齐 exact TC / EV / suite/check / report / trigger ruling，不修改需求编号 |
| `05` Step 11 | S 级不可接受规则已存在，但旧 `06` 使用 Blocker/Critical/Major/Minor | Step 11 只定义 VF 的不可覆盖性；缺陷分级在 Step 12 使用 `S/A/B/R` |
| `05` Step 13 | candidate EV、run 和 report 是 planned contract，不是真实证据 | 所有 candidate 只作为未来 linkage；缺 raw/report 时保持 blocked |
| Step 10 | 已固定 `EVG-OBS-001~009`，但未把每一项 VF 映射到具体否决裁决 | 本 Step 将 evidence integrity 与 VF 命中 / 不可裁决分开表达 |

## 6. 改动前后对比

| 项目 | 旧材料 | Current 口径 | 目的 |
|---|---|---|---|
| 否决主键 | `VETO-OBS-*` 九项 | `VF-OBS-001~010` 十项 | 复用唯一正式需求红线，避免 alias 漂移 |
| 核心闭环 | 只列部分输入 / 查询 | `TC-OBS-REL-001~005` 加 family suite 共同证明 | 覆盖五个 `C-OBS` 节点和交叉边界 |
| 安全边界 | 泛化 raw body / secret | pre-serialization、全 root scan、metric label 和 report 二次泄露 | 可执行且覆盖失败输出 |
| Truth ownership | 只写“不能反写” | source writer call、snapshot delta、capability graph、typed outcome | 能判断实际越权行为 |
| 证据真实性 | 静态 evidence / latest 风险描述 | same-run raw -> suite -> report -> candidate linkage + audit | 禁止复制、跨 run 和静态 passed |
| 缺证据语义 | 容易被当作未命中 | `blocked` / `not_evaluated`，不可正向裁决 | 不把缺材料伪装成安全 |
| 风险接受 | 可能被泛化 residual 覆盖 | VF、S 级、redaction、dependency、evidence integrity 不可接受 | 保持否决优先级 |

## 7. 验收裁决取舍

| 议题 | 方案 | Current 取舍 |
|---|---|---|
| 是否创建 `VETO-OBS-*` 别名 | A. 创建；B. 直接使用 `VF-OBS-*` | 采用 B。需求层 VF 已稳定，新增 alias 会导致正式正文、checklist 和 candidate linkage 漂移。 |
| evidence integrity 是否属于否决边界 | A. 只记测试问题；B. 作为验收成立性 hard gate | 采用 B。静态 passed、orphan、wrong run 或缺 raw artifact 时无法形成合法裁决。 |
| 缺 required 证据是否算“未触发” | A. 是；B. 否 | 采用 B。缺证据是 `blocked/not_evaluated`，不是安全结论。 |
| `VF-OBS-002` 与 `VF-OBS-003` 是否合并 | A. 合并；B. 保持分开 | 采用 B。前者覆盖运行 / 输出面所有 forbidden material，后者专门保护外部 evidence/artifact/identity/governance/source-audit 正文，检查范围不同。 |
| telemetry 被解释为 truth 是否单独保留 | A. 并入 raw body；B. 保留 `VF-OBS-004` | 采用 B。无正文泄漏时仍可能发生 authority inversion，必须独立否决。 |
| 外部产品未建立是否自动命中 `VF-OBS-009` | A. 是；B. 只有被升级为 truth / hard prerequisite 才命中 | 采用 B。未建立的 optional product 保持 `not_evaluated` / `Unavailable`，不得被伪造为通过；越权绑定才是 VF。 |
| 历史材料出现于 discrepancy audit 是否命中 `VF-OBS-010` | A. 是；B. 只有升级为 current gate / evidence / default 才命中 | 采用 B。历史材料可被明确标记为诊断输入，越权升级才构成否决。 |

## 8. 结构化中间产物

### 8.1 否决状态与证据状态语义

本 Step 不生成真实 checklist 结果。未来 `reports/acceptance/veto-checklist.md` 必须区分下列状态：

| 状态 | 含义 | 可否形成正向验收结论 |
|---|---|---|
| `planned` | 设计期已定义检查合同，尚无真实运行 | 否 |
| `not_established` | 实现仓、环境、运行或所需 producer 尚未建立 | 否 |
| `not_run` | required 检查未执行 | 否 |
| `blocked` | 前置缺失、证据链不完整或被 inherited affected 阻断 | 否 |
| `not_evaluated` | 当前送验范围未包含或环境真实性等级未建立 | 只能作为范围记录，不能冒充通过 |
| `triggered` | 有同 run、可复核的 finding 命中 VF | 否；总体不通过 |
| `not_triggered_reviewed` | required 证据完整、检查真实执行、由人 / Agent 审查确认未发现命中 | 可作为该项未命中的输入，但不等于总体通过 |

禁止使用 `passed`、`clean` 或 `未发现` 替代上述状态，除非真实执行、输入完整、同 run provenance 和审查记录
均已存在。设计材料中的 `pass_design` 只表示本 Step 的设计覆盖审查，不表示未来 VETO 未触发。

### 8.2 十项 VF 闭环矩阵

| 否决项 ID | 正式红线 / 设计来源 | 触发条件 | Exact 检查入口 | Candidate EV / primary suite | Canonical report path | 触发后裁决 |
|---|---|---|---|---|---|---|
| `VF-OBS-001` | `00` §14.3；`AC-OBS-001~005`；`03` 五个核心闭环与 Step 05 | `C-OBS-1~5` 任一核心节点不能同时满足 observation-owned fact、safe projection、no-write、证据 / handoff 边界，或核心流依赖外围产品才能成立 | `TC-OBS-REL-001~005`；各 family 的 primary suite；`NFG-OBS-001/002/005` | `EV-CAND-OBS-REL-001~005`；`S-OBS-RELEASE-SMOKE` | `reports/runs/<run_id>/suites/S-OBS-RELEASE-SMOKE.md`、`reports/runs/<run_id>/gate-results.md`、`reports/acceptance/veto-checklist.md` | 命中即不通过；核心证据缺失则 blocked，不得以局部 suite 代替 |
| `VF-OBS-002` | `BR-OBS-002/012`、`DO-OBS-007/020`、`NFR-OBS-003/011/021`；`03` redaction | raw body、secret、credential、payload/provider/runtime/archive body、raw log/trace/metric 或 full sensitive ref 进入 owner、event、outbox、telemetry、artifact、report、query 或 acceptance/review 输出 | `TC-OBS-ING-002`、`TC-OBS-RED-002~004`、`TC-OBS-SIG-002/006`、`TC-OBS-EVD-002`、`TC-OBS-RPT-005`；`check_redaction.sh`、`check_metric_labels.sh` | 对应 `EV-CAND-OBS-ING-002`、`RED-002~004`、`SIG-002/006`、`EVD-002`、`RPT-005`；`S-OBS-TELEMETRY-SAFETY` | `reports/runs/<run_id>/redaction-check.md`、`metric-label-check.md`、受影响 suite report、`reports/review/*` | 任一 finding 即不通过；scanner 未执行 / 输入缺失则 evidence gate 无效并暂停 |
| `VF-OBS-003` | `BR-OBS-008/025`、`DO-OBS-014`、`NFR-OBS-006/021`；`03` body-free evidence linkage | evidence/artifact/identity/governance decision/source audit 正文或消费副本被本仓保存、序列化、报告交接或查询返回 | `TC-OBS-EVD-001~004`、`TC-OBS-AUD-001~002`、`TC-OBS-RPT-001/005`、`TC-OBS-AUT-001~003`；`OBS-MAT-002/008` | `EV-CAND-OBS-EVD-001~004`、`AUD-001~002`、`RPT-001/005`、`AUT-001~003`；`S-OBS-TELEMETRY-SAFETY` / `S-OBS-SERVICE-FLOW` | `reports/runs/<run_id>/redaction-check.md`、`report-audit.md`、对应 `suites/<suite_id>.md` | 命中即不通过；resolver / raw input 缺失时只能 blocked，不得以空正文或摘要补成功 |
| `VF-OBS-004` | `BR-OBS-007/011/014/017`、`NFR-OBS-023`；`03` observation truth boundary | audit projection、metric、log、trace、dashboard、alert、summary、diagnostic hint 或 report handoff 被映射为业务 / Governance / Artifact / Identity / runtime execution / archive truth | `TC-OBS-TRUTH-001~003`、`TC-OBS-SIG-003`、`TC-OBS-RPT-003/005`、`TC-OBS-REL-003~004`；source / call-graph audit | `EV-CAND-OBS-TRUTH-001~003`、`SIG-003`、`RPT-003/005`、`REL-003~004`；`S-OBS-STATIC-REDLINE` | `reports/runs/<run_id>/dependency-boundary.md`、`report-audit.md`、`suites/S-OBS-STATIC-REDLINE.md`、`reports/acceptance/veto-checklist.md` | 命中即不通过；telemetry 缺失不等于未命中，需保持 blocked / not_evaluated |
| `VF-OBS-005` | `BR-OBS-015/016/022/023`、`NFR-OBS-015/018`；Step 06/08 no-write capability | Query、diagnostic、maintenance job、rebuild、replay、report assembly 或 external export 写 source truth、修复外部事实、覆盖外部 owner 或下发执行控制 | `TC-OBS-QRY-001~004`、`TC-OBS-DIA-002~004`、`TC-OBS-NW-001~005`、`TC-OBS-REB-006`、`TC-OBS-RET-005`、`TC-OBS-RPT-002/003`；write spies / capability scan | `EV-CAND-OBS-QRY-001~004`、`DIA-002~004`、`NW-001~005`、`REB-006`、`RET-005`、`RPT-002/003`；`S-OBS-SERVICE-FLOW` / `S-OBS-STATIC-REDLINE` | `reports/runs/<run_id>/suites/S-OBS-SERVICE-FLOW.md`、`dependency-boundary.md`、`gate-results.md`、`reports/acceptance/open-issues.md` | source writer call 或 truth delta 非零即不通过；capability graph / spy 不可执行则不得放行 |
| `VF-OBS-006` | `BR-OBS-018`、`DO-OBS-027`、`NFR-OBS-014/016`；Step 10 evidence authenticity | 设计或报告材料静态填写真实 `run_id`、正式 evidence alias、passed evidence、final verdict、signoff 或把 `latest` 当验收依据 | `TC-OBS-RPT-005`、`TC-OBS-AUT-001~003`、`TC-OBS-HIST-002`；`EVG-OBS-001/003/007/008/009`；report/static scan | `EV-CAND-OBS-RPT-005`、`AUT-001~003`、`HIST-002`；`S-OBS-STATIC-REDLINE`、report provenance audit | `reports/runs/<run_id>/report-audit.md`、`evidence-index.md`、`reports/acceptance/handoff.md`、`veto-checklist.md` | 静态伪造或 provenance 失败即不通过 / 不可裁决；不存在真实 run 时不填写未触发 |
| `VF-OBS-007` | `BR-OBS-020/021`、`DO-OBS-028/029`、`NFR-OBS-017/020`；`03` retention marker / active protection | retention、archive preparation 或后台清理删除仍被 audit、diagnostic、report、legal hold、replay、active reference 或 retention marker 引用的材料 | `TC-OBS-RET-001~005`、`TC-OBS-REB-001/002`、`TC-OBS-NW-004`；repository delete spy / protection CAS | `EV-CAND-OBS-RET-001~005`、`REB-001/002`、`NW-004`；`S-OBS-REPOSITORY-CONFORMANCE` / `S-OBS-RECOVERY-REPLAY` | `reports/runs/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE.md`、`report-audit.md`、`reports/acceptance/open-issues.md` | protected delete 或 marker bypass 即不通过；未冻结 TTL 只保持 not_evaluated，不得借旧天数判定 |
| `VF-OBS-008` | `DB-OBS-001/002`、Step 06/09；全局依赖裁剪规则 | 引入除允许的 `core-contracts` / `L0-core` 外的 L1/L2/L3/L4 sibling 编译期依赖，或将 `L0-bus` 写成 package dependency | `TC-OBS-DEP-001~003`、`TC-OBS-OWN-002/004`、`TC-OBS-NW-005`；`check_dependency_boundary.sh` | `EV-CAND-OBS-DEP-001~003`、`OWN-002/004`、`NW-005`；`S-OBS-STATIC-REDLINE` | `reports/runs/<run_id>/dependency-boundary.md`、`reports/runs/<run_id>/suites/S-OBS-STATIC-REDLINE.md` | 任一 forbidden edge 或扫描缺失即不通过 / 不可裁决；不能以 runtime adapter 存在替代 compile boundary |
| `VF-OBS-009` | `BR-OBS-026`、`DB-OBS-011~014`、`NFR-OBS-022/024`；产品中立边界 | TimescaleDB、Grafana、Prometheus、OTel Collector、对象存储、APM、dashboard 或外部 GRC 产品成为本仓 truth source、当前硬前置或拥有本仓状态 | `TC-OBS-EXT-001~003`、`TC-OBS-DEP-003`、`TC-OBS-CFG-003/005/006`、`TC-OBS-TRUTH-001~003`；adapter / config / source scan | `EV-CAND-OBS-EXT-001~003`、`DEP-003`、`CFG-003/005/006`、`TRUTH-001~003`；`S-OBS-STATIC-REDLINE` / `S-OBS-CONFIG-REDLINE` | `reports/runs/<run_id>/dependency-boundary.md`、`report-audit.md`、`suites/S-OBS-CONFIG-REDLINE.md` | 越权 truth / hard prerequisite 即不通过；optional 未建立只能记录 unavailable/not_evaluated |
| `VF-OBS-010` | `BR-OBS-026`、`NFR-OBS-024`、项目台账历史材料规则 | README、历史正式文档、旧测试路径、P95/SLA/冷存期限、旧事件数量、hash 分片或旧 implementation boundary 被直接升级为 current gate、默认值、evidence 或验收事实 | `TC-OBS-HIST-001~002`、`TC-OBS-NFR-002`、`TC-OBS-AUT-003`、`TC-OBS-RPT-005`；documentation / report provenance scan | `EV-CAND-OBS-HIST-001~002`、`NFR-002`、`AUT-003`、`RPT-005`；`S-OBS-STATIC-REDLINE` | `reports/runs/<run_id>/report-audit.md`、`dependency-boundary.md`、`reports/acceptance/open-issues.md` | 历史材料越权进入 current truth 即不通过；仅有明确 `historical_material` 标记不构成命中 |

### 8.3 逐项停审记录

以下结论是“设计覆盖停审”而非真实执行结果。真实 checklist 必须在同一 `<run_id>` 下重新填充。

| VF | 正式来源已确认 | 检查入口可执行 | report / raw 关系已固定 | 命中裁决固定 | 风险接受边界 | 设计停审结论 |
|---|---|---|---|---|---|---|
| `VF-OBS-001` | yes，`00` VF 与 `AC-OBS-001~005` | yes，5 个 REL + release smoke | yes，suite/report/evidence-index | yes，命中不通过，缺证据 blocked | 禁止 | `pass_design` |
| `VF-OBS-002` | yes，BR/DO/NFR + redaction invariant | yes，negative/phase/static TC + 2 checks | yes，raw/report 全 root scan | yes，finding 或 scanner invalid 不通过 | 禁止 | `pass_design` |
| `VF-OBS-003` | yes，body-free evidence boundary | yes，EVD/AUD/RPT/AUT family | yes，同 run report-audit | yes，正文或 owner 越权不通过 | 禁止 | `pass_design` |
| `VF-OBS-004` | yes，observation truth boundary | yes，TRUTH + signal/report/static cases | yes，source/call graph report | yes，authority inversion 不通过 | 禁止 | `pass_design` |
| `VF-OBS-005` | yes，no-write / capability redline | yes，QRY/DIA/NW/REB/RET cases | yes，write spy + capability report | yes，source writer 非零不通过 | 禁止 | `pass_design_with_affected` |
| `VF-OBS-006` | yes，evidence authenticity boundary | yes，RPT/AUT/HIST + EVG gates | yes，same-run provenance paths | yes，静态伪造不通过；缺证据不可裁决 | 禁止 | `pass_design` |
| `VF-OBS-007` | yes，retention / active reference invariant | yes，RET/REB/NW cases | yes，repository/recovery report | yes，protected delete 不通过 | 禁止 | `pass_design` |
| `VF-OBS-008` | yes，dependency policy + DB redline | yes，DEP/OWN/NW static checks | yes，dependency-boundary report | yes，forbidden edge 不通过 | 禁止 | `pass_design` |
| `VF-OBS-009` | yes，product-neutral boundary | yes，EXT/DEP/CFG/TRUTH checks | yes，config/dependency/report audit | yes，产品成为 truth/hard prerequisite 不通过 | 禁止 | `pass_design` |
| `VF-OBS-010` | yes，historical material policy | yes，HIST/NFR/AUT/RPT documentation scan | yes，report-audit + open-issues | yes，历史升级不通过 | 禁止 | `pass_design` |

### 8.4 跨 VF 覆盖审计

| 审计项 | Current 结果 | 处理说明 |
|---|---|---|
| 五个核心能力是否都有硬红线保护 | covered | `VF-OBS-001` 覆盖核心闭环，`VF-OBS-002~007` 覆盖其安全、truth、no-write、retention 和证据边界 |
| forbidden body 与 body-free evidence 是否漏分 | covered | `VF-OBS-002` 是全输出面正文安全，`VF-OBS-003` 是外部正文 / 消费副本所有权；交叉不改变主语 |
| telemetry authority inversion 是否被 raw scan 遗漏 | covered | 独立由 `VF-OBS-004`、TRUTH cases 和 source/call-graph audit 检查 |
| Query / Job / rebuild / export source write 是否有重复或遗漏 | covered | `VF-OBS-005` 汇总 QRY/DIA/NW/REB/RET/RPT 的 zero-writer 断言；不另建 alias |
| evidence authenticity 是否能阻断验收结论 | covered | `VF-OBS-006` 与 `EVG-OBS-001/003/007~009` 联动；缺证据是 blocked，不是未触发 |
| retention marker 是否被错误解释为 cleanup authorization | covered | `VF-OBS-007` 明确 marker、release candidate、backend TTL 和 physical delete 分离 |
| dependency / product / historical 三类边界是否分别可查 | covered | 分别由 `VF-OBS-008`、`VF-OBS-009`、`VF-OBS-010` 主导，允许检查入口交叉但不合并含义 |
| VFs 是否创建了第二套业务 truth | no | VF 只属于验收裁决投影，不写入业务、治理、Artifact、Identity、runtime 或 archive truth |
| P1/P2 / 未冻结数值是否被误设为 VF | no | selected RuntimeLike、旧 P95、长期 TTL 和 optional product 未建立只保持 `not_evaluated` / residual candidate |
| VF 与 Step 13 risk acceptance 是否冲突 | no | 任一 VF、S 级或 hard evidence/redaction/dependency finding 均禁止风险接受 |
| 当前是否存在真实“未触发”结论 | no | 实现仓、run、artifact、report、evidence 均未建立；只完成设计覆盖审计 |

### 8.5 否决证据链与裁决流

**图标题：VF 证据到验收裁决流**

```text
exact TC / static check
        |
        v
same-run raw artifact + failure record
        |
        v
suite report + canonical check report
        |
        v
evidence-index / report-audit provenance
        |
        +--> finding for VF ------> triggered ------> 不通过
        |
        +--> missing / mismatched -> blocked -------> 不可正向裁决
        |
        +--> complete + reviewed --> not_triggered_reviewed
                                      (仅作为该 VF 输入)
```

关键说明：

- `EV-CAND-OBS-*` 只表示设计期到未来运行的 candidate linkage，不是正式 evidence alias。
- `reports/acceptance/veto-checklist.md` 必须由人或 Agent 复核，生成器不能默认填“未触发”。
- 任一 VF 命中时不进入 Step 13 风险接受；缺证据时先回流补齐，不用人工说明替代 raw provenance。
- `Delivered`、`RealEvidenceLinked`、metric clean 或 audit append 都不能单独产生最终验收结论。

### 8.6 Inherited affected 处置

以下项目继续开放，本 Step 不关闭、不转化为 VF 命中，也不把 positive capability 写成已成立：

`S08-E-I05-PAYLOAD-SCHEMA-01`、`S08-E-I05-PRODUCER-EVENT-BINDING-01`、`R06.6-F2-H13-UPSTREAM`、
`R06-F-AFFECT-UOW-01`、`S08-RECOVERY-CLASS-OWNER-01`、`R07-EXTERNAL-PHASE-LINK-01`、
`R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01`、`S08-CONSUMER-OUTBOX-SURFACE-01`、
`S08-CONSUMER-INDETERMINATE-COMPLETION-01`、`S08-JOB-REPORT-REF-OWNER-01`、
`S08-M1-SECONDARY-TYPE-OWNER-01`、`03-RPR-S09-PER-FLOW`。

处置规则：

1. I05 缺 schema / producer binding 时，只能在 pre-parse / binding 阶段 fail closed，不能构造本地 positive DTO。
2. J06 的 H13 缺口只能形成 controlled `Blocked` / manual outcome，不能生成 positive H13、`Completed`、真实 run 或 evidence alias。
3. 其他 affected 的 positive path 缺失保持 `blocked` / `conditional`；只有实现绕过既定 fail-closed 或发生越权写入时，才依据本 Step 的 VF 或 Step 12 形成实际缺陷。
4. 不能用 inherited affected 的存在本身宣称某项 VF 已触发，也不能用风险接受把它们改写为 capability complete。

## 9. 正式 `06` §11 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_11_veto.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“十项 VF 闭环矩阵”“逐项停审记录”“跨 VF 覆盖审计”和“否决证据链与裁决流”小节，了解正式 §11 的裁决条件如何从需求红线、设计不变量、测试用例和证据真实性规则收敛。

正式 §11 只承载以下结论：

| 否决项 ID | 一票否决条件 | 触发后裁决 |
|---|---|---|
| `VF-OBS-001` | 五个核心闭环任一不能成立 | 不通过 |
| `VF-OBS-002` | forbidden body、secret、credential 或 full sensitive ref 进入任一禁止输出 / 存储面 | 不通过 |
| `VF-OBS-003` | evidence/artifact/identity/governance/source-audit 正文或消费副本被本仓拥有或输出 | 不通过 |
| `VF-OBS-004` | 观察投影、telemetry、summary 或 handoff 被解释为外部 truth 或 execution truth | 不通过 |
| `VF-OBS-005` | Query、diagnostic、Job、rebuild、replay、report 或 export 反写 source truth 或下发控制 | 不通过 |
| `VF-OBS-006` | 静态伪造 run/evidence/verdict/signoff，或使用 `latest` / 无 provenance 材料作为验收依据 | 不通过或验收不可裁决 |
| `VF-OBS-007` | 删除仍受 active reference、audit、report、hold 或 replay 保护的材料 | 不通过 |
| `VF-OBS-008` | 引入禁止的 sibling 编译期依赖或把 Bus 写成 package dependency | 不通过 |
| `VF-OBS-009` | 外部观测 / 存储 / GRC 产品成为 truth source 或当前硬前置 | 不通过 |
| `VF-OBS-010` | 历史材料被升级为 current gate、默认值、evidence 或验收事实 | 不通过 |

正式章节必须同时声明：任一 VF 不得由 risk acceptance 覆盖；缺 required raw artifact、report、evidence index、
redaction、dependency 或 report provenance 时，状态为 `blocked` / `not_evaluated`，不得写成“未触发”或通过。
正式章节不得写入真实 `<run_id>`、artifact digest、evidence alias、finding、verdict、review approval 或 signoff。

## 10. 待确认事项

| ID | 待确认事项 | 当前状态 | 影响 |
|---|---|---|---|
| `Q-06-11-01` | 未来实际执行时每个 VF 的 reviewer / Agent 角色和审查范围 | `not_assigned` | Step 14 只定义职责，不能填写姓名 |
| `Q-06-11-02` | 真实实现仓的 primary suite producer 与 current `05` exact suite 的最终绑定 | `target_absent` | 未来 report path 可用前不得生成未触发结论 |
| `Q-06-11-03` | I05 payload schema / producer binding 的上游闭合时间 | `open_upstream_affected` | EVD-004 只能 fail closed；不能以正向 evidence 关闭 |
| `Q-06-11-04` | RuntimeLike selected lane 是否进入某次送验范围 | `not_selected` | 未选时为 `not_evaluated`，不能由 CI 替代 |
| `Q-06-11-05` | 长期 retention / backend cleanup 的正式 owner 与策略 | `not_frozen` | 不影响 `VF-OBS-007` 的 active protection 红线；不设置天数 |

## 11. Step 自检与 gate

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否使用唯一正式否决集合 | `pass_design` | 直接使用 `VF-OBS-001~010`，不恢复 `VETO-OBS-*` |
| 十项 VF 是否逐项有正式来源 | `pass_design` | 每项回指 `00`、`03`、Step 05/06/08/09/10 或 `05` |
| 十项 VF 是否逐项有 exact 检查入口 | `pass_design` | 使用 current `TC-OBS-*`、9 primary suite 或 5 scripts/check contract |
| 是否固定 canonical raw/report/evidence 路径 | `pass_design` | 使用 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` |
| 是否区分 finding、缺证据和设计期 planned | `pass_design` | `triggered`、`blocked`、`not_evaluated`、`planned` 不折叠 |
| VFs 是否允许 risk acceptance | `pass_design` | 全部禁止；Step 13 只能消费非 VF residual |
| 是否覆盖 body、truth、no-write、retention、dependency、product、history | `pass_design` | `VF-OBS-002~010` 逐类覆盖 |
| 是否发现新上游 blocker | `none` | 12 项 inherited affected 继续开放 |
| 是否伪造真实运行、证据、结论或签署 | `no` | 当前无实现仓、run、artifact、report、evidence |
| 正式 `06` 是否修改 | `no` | 仅 Step 15 允许装配 |
| `gate_status` | `pass_for_veto_redline_design` | 可进入 Step 12；不是实际验收通过 |
| `next_allowed_action` | `start_current_06_step_12` | 需先同步 flow/ledger，再读取 Step 12 输入 |

## 12. 参考

- `standards/document/验收标准讨论流程_SOP.md` Step 11
- `standards/document/验收标准书写规范.md` §5.11
- `standards/document/设计文档讨论中间产物规范.md`
- `standards/document/设计真相源闭环与可落码性标准.md`
- `standards/document/全局项目依赖关系与裁剪规则.md`
- `projects/L4-observability/00-需求文档.md` §14.2~§14.3、§15
- `projects/L4-observability/03-详细设计.md` §8~§15、§17
- `projects/L4-observability/design-calibration/06_acceptance_step_05_function_gate.md`
- `projects/L4-observability/design-calibration/06_acceptance_step_06_data_arch_redlines.md`
- `projects/L4-observability/design-calibration/06_acceptance_step_08_state_tx_consistency.md`
- `projects/L4-observability/design-calibration/06_acceptance_step_09_nonfunctional.md`
- `projects/L4-observability/design-calibration/06_acceptance_step_10_observability_evidence.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_06_cases.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_09_automation_gates.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_11_defects_retest.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_13_evidence.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_14_regression_risks.md`
- `projects/L1-governance/design-calibration/06_acceptance_step_11_veto.md`
- `projects/L1-artifact/design-calibration/06_acceptance_step_11_veto.md`
