# L4-observability 06-验收标准 Step 12 · 缺陷分级、复验与放行规则

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 12
> 回填章节: `projects/L4-observability/06-验收标准.md` §12
> 参考粒度: `projects/L1-governance/design-calibration/06_acceptance_step_12_defects_retest_release.md`、`projects/L1-artifact/design-calibration/06_acceptance_step_12_defects_retest_release.md`

## 1. Step 状态

| 项目 | 当前值 |
|---|---|
| project / document | `L4-observability` / `06-验收标准.md` |
| step | `12 / 定义缺陷分级、复验与放行规则` |
| mode | `full-restart` |
| current_module | `defect_severity_retest_and_release_disposition` |
| status | `completed_current_design_gate` |
| formal_document_write | `not_allowed_until_step_15` |
| implementation / test execution | `not_started` / `not_run` |
| run / artifact / report / evidence | `absent_by_design`; 仅定义未来关闭证据 contract |
| severity authority | current `05` Step 11 的 `S/A/B/R` |
| veto authority | `VF-OBS-001~010`；由 Step 11 固定，不能由本 Step改写 |
| new_upstream_blocker | `none` |
| inherited affected | 12 项继续开放，不自动成为产品缺陷或可接受 residual |
| next_allowed_action | `start_current_06_step_13` |
| commit | 不需要；用户未要求提交 |

本文件定义缺陷如何影响验收结论、修复后如何复验以及何时可以进入放行讨论。不创建真实缺陷单，不判断当前
实现质量，不生成 acceptance verdict、formal evidence alias、signoff 或 release result。

## 2. 本步目标与边界

### 2.1 本步目标

把测试执行中的 failure、环境前置缺失、设计 / 实现缺陷和未来 residual 分离，并固定以下闭环：

```text
failure / blocked record
        -> severity and impact triage
        -> VETO / AC / suite linkage
        -> targeted retest
        -> same-family / affected-suite regression
        -> release gate when required
        -> closure review or residual handoff
```

### 2.2 本步不负责的内容

| 不负责项 | 归属 |
|---|---|
| 定义新的需求、VETO、状态或测试用例 | `00~05` 与 Step 11；如需新增必须回写上游 |
| 把 inherited affected 关闭为实现缺陷 | 上游 owner 闭合或实际违反 fail-closed 后按事实定级 |
| 直接接受风险 | Step 13；本 Step 只定义候选条件 |
| 填写真实缺陷 ID、run、artifact、report 或测试结论 | 真实执行阶段 |
| 生成最终验收结论或签署 | Step 14 |
| 创建 implementation ledger、boundary skeleton 或代码 | `07`；本轮不得提前进入 |

## 3. 本步输入与权威顺序

| 优先级 | 输入 | 本 Step 的使用方式 |
|---:|---|---|
| 1 | `standards/document/验收标准讨论流程_SOP.md` Step 12 | 固定分级、复验和放行问题及正式章节输出 |
| 2 | `standards/document/验收标准书写规范.md` §5.12 | 固定缺陷表和三值结论边界 |
| 3 | `projects/L4-observability/design-calibration/05_test_plan_step_11_defects_retest.md` | 唯一 `S/A/B/R`、升级、生命周期、关闭证据和自动化防回归规则 |
| 4 | `projects/L4-observability/design-calibration/05_test_plan_step_12_entry_exit.md` | blocked/not_run/not_evaluated、退出前置和 required lane 语义 |
| 5 | `projects/L4-observability/design-calibration/05_test_plan_step_14_regression_risks.md` | 回归触发、影响范围、residual 与跨文档回写规则 |
| 6 | `design-calibration/06_acceptance_step_11_veto.md` | `VF-OBS-001~010` 的不可降级和不可风险接受边界 |
| 7 | `design-calibration/06_acceptance_step_10_observability_evidence.md` | same-run raw/report/evidence provenance 与 acceptance handoff 证据要求 |
| 8 | L1-governance / L1-artifact Step 12 | 只参考分级和复验矩阵粒度，不复制其业务语义 |

### 3.1 历史材料处置

旧 `06` 的 `Blocker/Critical/Major/Minor`、旧缺陷表、静态 `passed` 或“已修复”文字均标记为
`historical_material`，不进入当前分级。当前只使用 `S/A/B/R`。旧 README 的 P95、SLA、保留天数和产品行为
也不能单独生成缺陷；没有正式来源的数值最多形成 `B` / `R` 的 trend candidate。

## 4. SOP 问题回答

| SOP 问题 | Current 回答 |
|---|---|
| `S/A/B/R` 如何定义? | `S` 命中 VF 或 P0 truth / 安全 / no-write / retention / dependency / evidence integrity 红线；`A` 是未命中 VF 但 P0 主线或 blocking gate 无法稳定证明；`B` 不影响当前 P0 主线和主证据链；`R` 是当前非范围、外部前置未建立或未来 residual。 |
| 每级对结论有什么影响? | `S` 未关闭只能不通过；`A` 默认阻断，只有经 Step 13/14 严格记录且证明不影响 P0 才能进入有条件通过候选；`B/R` 不自动阻断 P0，但必须留痕，是否条件通过由 Step 13/14 决定。 |
| 修复后如何复验? | 保留失败前 run，使用新的 invocation / run；先跑原失败 TC，再跑同切口 family、primary suite、受影响 check，触及共享契约或 release chain 时追加 full release gate。 |
| 哪些缺陷可以风险接受? | 只能是明确不触及 VF、P0 truth、P0 evidence、redaction、dependency、no-write、active retention 和正式退出条件的 `B/R`，以及满足额外约束的 `A` 候选；`S`、VF 和证据不可裁决状态不能接受。 |
| 哪些问题必须阻断下一阶段? | 任一 S、任一 VF finding、required P0 suite/check 未执行或缺 artifact/report、redaction/metric/dependency/report audit 失败、静态 evidence、source writer 非零、P0 lane 被低等级结果替代，或存在未解决的 P0 A。 |
| inherited affected 如何处理? | 上游能力缺失本身保持 `blocked/conditional`，不创建“缺陷已通过”；若实现绕过既定 fail-closed、controlled blocked 或 no-write 边界，才按实际 finding 定 A 或 S。 |

## 5. 当前材料问题诊断

| 输入 / 位置 | 当前问题 | Current 修正 |
|---|---|---|
| 旧 `06-验收标准.md` | 使用旧四级名称，未与 `05` 的 S/A/B/R 对齐 | 全面替换为 `S/A/B/R` |
| 旧 Step 12 | 只有观测对象摘要，没有缺陷生命周期、复验范围或关闭证据 | 建立 §8 的完整 defect/retest/release contract |
| `05` Step 11 | 已定义测试缺陷分级，但 `06` 尚未说明其对最终验收的影响 | 明确 S/A/B/R 到三值结论的映射 |
| Step 11 VFs | VFs 不可风险接受，但缺少缺陷升级和复验入口 | 任何 VF finding 直接 S；按 §8.2 全范围复验 |
| Step 10 证据门禁 | 缺 raw/report/provenance 容易被误报为“无缺陷” | 缺证据为 blocked / not_evaluated，不是 pass 或“未发现” |
| required lane 语义 | ISO/INT/RuntimeLike 可能被互相替代 | 每次复验固定 lane/profile；低真实性 lane 不填充高真实性 lane |

## 6. 改动前后对比

| 维度 | 旧口径 | Current 口径 | 影响 |
|---|---|---|---|
| 分级 | Blocker/Critical/Major/Minor 或泛化严重性 | S/A/B/R，按影响语义定级 | 与 `05` 和 Step 11 一致 |
| VETO | 只列在 §11，缺陷关系不清 | VF finding 直接 S，不可降级、不可接受 | 防止风险接受绕过红线 |
| 环境缺失 | 可能被当产品失败或被低等级结果替代 | `blocked/not_run/not_evaluated`，按送验范围裁决 | 保留真实性层级 |
| 复验 | 只重跑原失败用例 | targeted -> family -> suite/check -> release gate | 覆盖横切契约和共享边界 |
| 失败材料 | 可由新 summary 覆盖 | failed run/raw/report 永不覆盖，独立 before/after provenance | 支撑审计 |
| 关闭 | 手写“已修复” | `RetestPassedCandidate` 后人工 / Agent review 才可 `Closed` | 缺陷关闭不生成验收签署 |

## 7. 验收裁决取舍

| 议题 | 方案 | Current 取舍 |
|---|---|---|
| 是否按 suite 自动定级 | A. 是；B. 以影响语义为准 | 采用 B。suite 是发现入口，不是 truth / VETO authority。 |
| A 级是否永远阻断 | A. 永远阻断；B. 严格条件下可进入有条件通过候选 | 采用 B，但必须证明不触及 VF、P0 truth/evidence 和正式退出条件，并由 Step 13/14 记录接受。 |
| B/R 是否自动通过 | A. 是；B. 只允许作为显式 residual | 采用 B。B/R 不能变成 P0 passed，也不能跳过风险记录。 |
| required lane 缺失如何定级 | A. 产品缺陷；B. 保持 blocked/not_evaluated，按送验范围决定 | 采用 B。若送验要求该 lane，则阻断；否则保留 R/范围记录。 |
| 失败后是否可删除旧 artifact | A. 可以；B. 永久保留失败前证据 | 采用 B。新 run 只能追加，不能覆盖或删除失败材料。 |
| 缺陷关闭是否生成 verdict/signoff | A. 生成；B. 只生成 closure candidate | 采用 B。验收结论只能由 Step 14/真实验收角色产生。 |

## 8. 结构化中间产物

### 8.1 缺陷等级与结论影响

| 缺陷级别 | 精确定义 | Observability 例子 | 对验收结论的影响 | 最小复验要求 | 可否风险接受 |
|---|---|---|---|---|---|
| `S` | 命中任一 `VF-OBS-*`，或 P0 truth、redaction、body-free、no-write、active retention、dependency、evidence authenticity、commit-unknown 二写等硬红线失守 | raw body 入 report；Query 写 source truth；active material 被删；non-core compile edge；静态伪造 evidence；stale worker 二写 | 未关闭只能“不通过”；不得有条件通过 | 原失败 TC + 同切口 family + 受影响 blocking suite/check + 必要时完整 P0 release gate | 否 |
| `A` | P0 用例 / blocking suite 失败，或 P0 能力无法稳定证明，但尚未证实 VF 或 truth corruption | typed error mapping 错误；配置半激活但已 fail closed；report 缺非真实性字段；harness 无法复现 required case | 默认阻断；仅在证明不影响 P0 truth/evidence、无 VF、证据完整并有正式接受记录时进入“有条件通过”候选 | 原失败 TC + family + primary suite + 受影响 checks；共享契约或 release chain 触发 full gate | 仅严格条件下候选 |
| `B` | 不影响当前 P0 语义、主证据链或退出硬门禁的一般实现 / 报告 / 环境问题 | 非阻断可读性；无来源硬阈值的 duration sample；P1 adapter 维护性 | 不阻断 P0；必须记录，可能进入有条件通过 | 受影响 TC 或报告复核；若重复或扩散则升级 A | 可，需记录 |
| `R` | 当前非范围、外部前置未建立或未来能力 residual，不构成当前实现 failure | 真实 production capacity、未建立 RuntimeLike 深层行为、未选外部产品 SLA | 不自动阻断当前范围；不能写成已验证能力；由 Step 13/14决定是否可带条件继续 | 范围升级时重新固定 baseline、lane、TC 和 evidence | 可作为 residual 候选，不能伪造通过 |

### 8.2 S 级不可降级判定

| 触发条件 | 关联 VF / gate | 代表 TC / check / suite | 处理 |
|---|---|---|---|
| 任一核心闭环无法成立，或 duplicate / commit unknown 造成第二次 owner mutation | `VF-OBS-001/005` | `TC-OBS-REL-001~005`、`TC-OBS-UOW-003~008`、`S-OBS-RELEASE-SMOKE` | 立即定 S；修复并执行 full affected regression |
| forbidden body / secret / high-cardinality label / report 二次泄露 | `VF-OBS-002/003`、`NFG-OBS-003` | `TC-OBS-RED-001~004`、`TC-OBS-SIG-002/006`、`check_redaction.sh`、`check_metric_labels.sh` | finding 或 scanner fail-open 均阻断，不得接受 |
| observation / telemetry / handoff 被当作外部 truth | `VF-OBS-004` | `TC-OBS-TRUTH-001~003`、`TC-OBS-SIG-003`、`TC-OBS-RPT-003/005` | 定 S；复验 source/call-graph 和 affected suite |
| Query / diagnostic / rebuild / replay / report / export source write | `VF-OBS-005` | `TC-OBS-QRY-001~004`、`TC-OBS-DIA-002~004`、`TC-OBS-NW-001~005`、`TC-OBS-REB-006` | source writer 非零或 truth delta 非零定 S |
| active / held / referenced material 被删除或 marker 被绕过 | `VF-OBS-007` | `TC-OBS-RET-001~005`、`S-OBS-REPOSITORY-CONFORMANCE` | 定 S；保留原 finding 和保护状态 |
| 静态 evidence、wrong run、`latest`、fake verdict/signoff 或 report provenance 伪造 | `VF-OBS-006` | `TC-OBS-RPT-005`、`TC-OBS-AUT-001~003`、`EVG-OBS-001/003/007~009` | 定 S 或 evidence gate invalid；不得用人工说明补齐 |
| forbidden sibling compile edge 或 Bus package dependency | `VF-OBS-008` | `TC-OBS-DEP-001~003`、`check_dependency_boundary.sh` | 定 S；重新生成 dependency snapshot 后复验 |
| 外部产品成为 truth source / hard prerequisite，或历史材料升级为 current truth | `VF-OBS-009/010` | `TC-OBS-EXT-001~003`、`TC-OBS-HIST-001~002`、`TC-OBS-NFR-002` | 定 S；回写设计基线和文档 corpus 后复验 |

### 8.3 Suite / check 到分级的默认映射

默认级别只用于 triage 起点，实际级别仍按 §8.2 和真实影响裁决。

| Suite / check | 默认级别 | 升为 S 的条件 | 环境缺失处置 |
|---|---|---|---|
| `S-OBS-CONTRACT-DOMAIN` | `A` | body-bearing contract、illegal state accepted、truth owner 混淆 | ISO 未建立为 blocked/not_run |
| `S-OBS-SERVICE-FLOW` | `A` | source write、duplicate 二写、accepted partial write、body leakage | ISO/INT 分开记录 |
| `S-OBS-REPOSITORY-CONFORMANCE` | `A` | UoW atomicity、CAS/fence、stored result 导致 truth divergence | `ENV-CI-INT` 缺失为 blocked/not_run |
| `S-OBS-ENTRY-CAPABILITY` | `A` | I05 在 pre-parse 前 ack/write 或缺 binding 仍 positive landing | inherited capability 缺失保持 blocked |
| `S-OBS-RECOVERY-REPLAY` | `A` | blind retry、token 更换、J06 伪造 positive outcome、stale fence write | controlled blocked 与 RuntimeLike 分开 |
| `S-OBS-CONFIG-REDLINE` | `A` | silent fallback、关闭 safety/no-write、partial activation；redline finding升级S | config corpus 缺失阻断 entry |
| `S-OBS-TELEMETRY-SAFETY` | `S` | forbidden material、high-cardinality、recursion、truth authority finding | scanner 不可执行即 gate invalid/S |
| `S-OBS-STATIC-REDLINE` | `A` | dependency/history/writer capability 命中 VF | source snapshot 缺失为 blocked |
| `S-OBS-RELEASE-SMOKE` | `A` | 定位任一 VF 或五能力失守 | `ENV-STG-RT` 未建立为 not_evaluated |
| `check_redaction.sh` | `S` | finding 非零或 fail-open | 不可执行即 evidence invalid |
| `check_metric_labels.sh` | `S` | forbidden/high-cardinality 或 descriptor 不可审计 | 不可执行即 telemetry gate invalid |
| `check_dependency_boundary.sh` | `S` | non-core edge 或越权 writer/capability | graph 缺失即 gate invalid |
| `generate_reports.sh` provenance | `A` | static pass、orphan、wrong run、缺 raw、fake EV/verdict 时升 S | 只能生成 blocked/missing-input report |

### 8.4 修复后复验范围决策矩阵

每次复验必须创建新的 invocation / `<run_id>`，并保留失败前材料。`retest` 不是把旧报告改成绿色，
也不是只运行一个修复后的单例。

| 影响面 | 最小复验 | 必须追加 | 何时进入 full release gate |
|---|---|---|---|
| 单一 fixture / assertion，未改共享契约 | 原失败 TC + 同切口正/负向 | 该 TC 的 primary suite | 该 TC 是 release evidence 或失败影响组合核心时 |
| public DTO / enum / state / typed error / transition | 原失败 TC | `S-OBS-CONTRACT-DOMAIN` + 关联 `S-OBS-SERVICE-FLOW` | 触及 VF、核心闭环或跨协议状态时 |
| UoW / repository / idempotency / commit unknown / stored result | `TC-OBS-UOW-001~008` 中受影响项 | `S-OBS-REPOSITORY-CONFORMANCE`、`S-OBS-SERVICE-FLOW`、相关 recovery cases | 总是；这些语义影响 accepted truth / evidence chain |
| Query / diagnostic / visibility / freshness / no-write | 原失败 `TC-OBS-QRY-*`、`TC-OBS-DIA-*`、`TC-OBS-DEG-*` | write-spy representative cases、`S-OBS-SERVICE-FLOW`、`S-OBS-STATIC-REDLINE` | 进入 release read/report chain，或触及 `VF-OBS-005` 时 |
| redaction / serializer / log / metric / trace | 原失败 `TC-OBS-RED-*`、`TC-OBS-SIG-*` | `S-OBS-TELEMETRY-SAFETY`、`check_redaction.sh`、`check_metric_labels.sh`、raw/report scan | 总是；安全和证据真实性不可局部放行 |
| audit / evidence linkage / authenticity | 原失败 `TC-OBS-AUD-*`、`TC-OBS-EVD-*`、`TC-OBS-AUT-*` | service、entry、telemetry、report provenance 相关 suite | 触及 P0 evidence、`VF-OBS-003/006` 或 handoff 时 |
| external phase / outbox / Job / replay / fence / report fold | 原失败 `TC-OBS-UOW-006~008`、`TC-OBS-REB-*`、`TC-OBS-RPT-*`、`TC-OBS-EXT-*` | repository + recovery suites；same-token / probe / fence cases | 触及 delivery / report release path 时 |
| retention / active protection / cleanup | 原失败 `TC-OBS-RET-001~005` | repository suite、no-delete capability scan、相关 handoff cases | 触及 active material、legal hold 或 `VF-OBS-007` 时 |
| config / runtime builder / profile activation | 原失败 `TC-OBS-CFG-001~006` | `S-OBS-CONFIG-REDLINE`、受影响 suite 的三 profile contract smoke | required profile 或 `VF-OBS-009/010` 受影响时 |
| dependency / ownership / historical corpus | 原失败 `TC-OBS-DEP-*`、`OWN-*`、`HIST-*`、`TRUTH-*`、`NW-*` | `S-OBS-STATIC-REDLINE`、`check_dependency_boundary.sh`、documentation/report audit | 总是；静态红线不能只靠局部测试关闭 |
| report generation / evidence provenance | 原失败 `TC-OBS-RPT-*`、`AUT-*` | 所有受影响 suite report、`report-audit.md`、`evidence-index.md`、redaction check | 总是；没有同 run provenance 不能关闭 |
| RuntimeLike / future external behavior | 原失败 selected case | 同 lane/family；保留真实性等级 | 不得用 CI/controlled 结果替代；只有正式升级为 P0 才进入 |

### 8.5 复验顺序与停止规则

**图标题：缺陷从失败到关闭候选的复验顺序**

```text
freeze failed run + finding + affected scope
                  |
                  v
new invocation / new run with same semantic fixture
                  |
                  v
targeted failed TC
                  |
                  v
same-cut family + primary suite
                  |
                  v
affected checks / provenance / redaction / dependency
                  |
                  +--> required release impact --> full release gate
                  |
                  v
before/after report comparison + reviewer closure review
                  |
                  +--> any failure --> RetestFailed / reopen
                  +--> complete --> RetestPassedCandidate
```

规则：

1. targeted TC 仍失败时立即停止，不运行后续绿色汇总来覆盖失败。
2. family 或专项 check 失败时保持 `RetestFailed`，不得只关闭原始 TC。
3. 任一新 finding 命中 `VF-OBS-*`，立即按 S 级升级；不允许沿用旧 severity。
4. commit / external outcome `indeterminate` 必须按正式 probe/manual 规则处理；不得盲重试、换 token 或从 current truth 重建输入。
5. flaky、timeout、blocked、not_run 和 failed 均保留原状态与 failure reason；重复执行要有新的 attempt / invocation identity。

### 8.6 缺陷生命周期与状态约束

| 生命周期状态 | 进入条件 | 允许动作 | 禁止动作 |
|---|---|---|---|
| `Reported` | 有 failed run/case/reason，或设计期记录 planned rule gap | triage，关联 TC/suite/VF/AC | 直接写 closed / passed |
| `Triaged` | severity、owner、影响面、复验范围已确认 | 修复或记录外部 blocker | 将 S/VF 降级为风险 |
| `InFix` | fix boundary、设计基线和影响面已固定 | 在受影响实现边界修复 | 顺手改无关 truth / baseline |
| `ReadyForRetest` | 修复检查完成，新的复验输入齐全 | 按 §8.4 执行 | 用旧 run 或 candidate EV 代替新证据 |
| `RetestFailed` | targeted/family/gate 任一失败 | reopen、升级、扩回归范围 | 关闭或接受 S |
| `RetestPassedCandidate` | 所需复验完成且报告可回指 | 请求人 / Agent 审查关闭材料 | 自动生成 verdict / signoff |
| `Closed` | 关闭清单完整，S/A 有审查，原失败材料保留 | 归档并加入回归集 | 删除失败前证据、重写历史 finding |
| `Residual` | 仅 B/R，且有明确 owner、trigger、follow-up | 交 Step 13/14 风险处理 | 冒充已验证能力或 P0 pass |

### 8.7 关闭证据清单

| 关闭材料 | `S` | `A` | `B/R` |
|---|---|---|---|
| defect ref、severity、影响面、对应 `VF/AC/TC` | 必需 | 必需 | 必需 |
| 失败前 `<run_id>`、case、primary suite、raw artifact、report、failure reason | 必需 | 必需 | 有执行事实时必需 |
| design baseline、implementation boundary、fix summary | 必需 | 必需 | 视影响需要 |
| 复验 `<run_id>`、targeted/family/gate report | 必需 | 必需 | 有复验时必需 |
| redaction / metric / dependency / report provenance check | 相关即必需 | 相关即必需 | 相关则附 |
| no-write / truth 类 before/after snapshot 或 write-spy 结果 | 相关即必需 | 相关即必需 | 相关则附 |
| failure-to-fix 影响分析和防回归说明 | 必需 | 必需 | 建议 |
| reviewer / Agent closure note | 必需 | 必需 | 可选 |
| acceptance verdict / signoff / formal evidence alias | 不由缺陷关闭生成 | 不由缺陷关闭生成 | 不生成 |

所有 raw artifact 和 report 必须同一 run 内自洽，失败前与修复后使用不同 run identity。失败材料不得被删除、
覆盖、复制到新的 run 后宣称其 provenance 等价。

### 8.8 自动化防回归与文档回写

| 触发条件 | 必须动作 | 允许回写范围 |
|---|---|---|
| 手工或 RuntimeLike 首次发现 P0，而现有 suite 未捕捉 | 增加可重复 fixture / assertion，并下沉到最早可判定层 | `05` Step 05~09、13、14；必要时 `03` test cut |
| release smoke 发现、lower suite 漏检 | 将核心断言下沉至 contract/service/repository/entry/recovery suite | `05` Step 06/09 |
| redaction / metric scanner 漏检 | 扩 sentinel corpus、descriptor allowlist、同 run report scan | `05` Step 07/09/13；`06` 证据映射 |
| write spy / capability scan 漏检 source writer | 扩 write spy/capability graph；不得用日志断言替代 | `03` / `05` Step 06/07/09/10 |
| duplicate / commit unknown / missing result / fence 复发 | 扩 same-key concurrency、fault schedule、probe-first cases | `05` Step 06/07/09/10 |
| report provenance / static evidence 漏检 | 扩 raw pairing、run identity、no-static-evidence audit | `05` Step 09/13；`06` Step 10/11 |
| dependency / historical misuse 漏检 | 扩 manifest/source/docs corpus；产品名本身不自动成为 finding | `05` Step 07/09/13 |
| B/R 被提出升级为 P0 | 先回写需求、范围、环境、门禁和验收，再新增 TC/DS/candidate linkage | `00`、`05`、`06`、必要时 `03/04` |

新增用例必须维持：

```text
TC -> DS -> lane/profile -> primary suite
   -> raw case artifact -> suite report
   -> EV-CAND linkage -> AC/VF -> final acceptance input
```

不得只增加静态 candidate EV 行，也不得在缺陷单内私建第二套测试主键。

### 8.9 放行规则

| 条件 | 是否可进入正向放行 | 唯一合法处理 |
|---|---|---|
| 存在未关闭 `S` | 否 | 不通过或暂停；修复并按 full affected scope 复验 |
| 任一 `VF-OBS-*` 命中 | 否 | 不通过；不可风险接受 |
| redaction / metric / dependency / report provenance failed | 否 | 证据链无效；补齐同 run 或新 run 后复验 |
| required P0 suite/check 未执行、artifact/report 缺失 | 否 | `blocked/not_run`；不得用低等级 lane 或 summary 填充 |
| source writer 非零、truth delta 非零、query/job truth repair | 否 | S 级阻断；修复 capability / flow 后全量受影响复验 |
| 未关闭 `A`，且影响 P0 或正式退出条件 | 否 | 修复并复验 |
| 未关闭 `A`，证明不影响 P0 truth/evidence，且有正式接受记录 | 仅可作为有条件通过候选 | 交 Step 13/14；不自动放行 |
| 仅有 `B/R`，无 P0 影响 | 可进入风险讨论 | 交 Step 13，必须记录 owner、acceptor、action、deadline/trigger |
| `ENV-STG-RT` 未建立 | 视送验范围 | `not_evaluated`；不得用 CI/controlled 结果代替 |
| 无来源 numeric sample 高于历史数字 | 不自动阻断 | 记录 trend / R candidate；不能把历史数字升级为阈值 |
| inherited affected positive path 未闭合 | 不可声称能力完成 | 保持 blocked/conditional；不能作为普通 B/R 隐藏 |

### 8.10 缺陷 / 复验停审记录

| 审查项 | 设计结论 | 说明 |
|---|---|---|
| 分级是否与 `05` 唯一一致 | `pass_design` | 当前只使用 S/A/B/R |
| VF 是否直接进入 S 且不可降级 | `pass_design` | `VF-OBS-001~010` 全部不可风险接受 |
| 缺证据是否与 finding 分离 | `pass_design` | 缺 raw/report/index 是 blocked/not_run，不是未触发 |
| required lane 是否可被低保真结果替代 | `no` | ISO/INT/RuntimeLike 保持真实性等级 |
| 复验是否至少覆盖 targeted/family/suite/check | `pass_design` | §8.4 固定，必要时 full release gate |
| 失败材料是否保留且 before/after 可追溯 | `pass_design` | 新 run 追加，不覆盖旧 run |
| 关闭是否需要 reviewer / Agent | `pass_design` | `RetestPassedCandidate` 不是 `Closed` |
| 缺陷关闭是否生成验收 verdict/signoff | `no` | 仅 Step 14 / 真实验收角色生成 |
| B/R 是否能绕过 Step 13 | `no` | 所有 residual 必须交风险接受审查 |

### 8.11 跨缺陷裁决审计

| 审计项 | Current 结果 | 处理 |
|---|---|---|
| 是否存在 S 可通过风险接受关闭 | no | Step 13/14 继续保留硬禁止 |
| 是否存在仅用新 summary 覆盖旧 failure | no | 关闭证据要求 before/after run 和原始 finding |
| 是否把同一 failure 在多个 suite 重复计数 | no | primary suite 唯一；secondary checks 只补充证据 |
| 是否将 inherited affected 当成 defect passed/failed | no | 维持 blocked/conditional；实际绕过才定级 |
| 是否把 RuntimeLike 未建立当作 CI green | no | 保持 not_evaluated |
| 是否把无来源性能数字变成 S/A | no | 只按结构性失败或正式来源阈值定级 |
| 是否由缺陷关闭产生 formal EV/verdict/signoff | no | 明确禁止 |
| 是否存在新的上游 blocker | none | 12 个 inherited affected 继续开放 |

## 9. 正式 `06` §12 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_12_defects_retest_release.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“缺陷等级与结论影响”“S 级不可降级判定”“修复后复验范围决策矩阵”“缺陷生命周期与状态约束”“关闭证据清单”和“放行规则”小节，了解缺陷如何影响验收裁决。

正式 §12 只承载以下收口结论：

- 缺陷分级固定为 `S/A/B/R`；不得恢复旧 Blocker/Critical/Major/Minor。
- 任一 `VF-OBS-001~010`、redaction / dependency / evidence integrity / no-write / active retention 或 P0 truth finding 均为 `S`，不能风险接受。
- `A` 默认阻断；只有证明不影响 P0 truth/evidence、没有 VF、证据完整且有正式风险接受记录时，才可进入有条件通过候选。
- `B/R` 只能作为显式 residual 交 Step 13/14，不能写成 P0 已验证能力。
- 复验必须使用新 invocation / `<run_id>`，保留失败前 raw artifact/report，至少跑原失败 TC、同切口 family、primary suite 和受影响 checks；涉及共享契约或 release chain 时追加 full release gate。
- 缺 required artifact/report、wrong run、orphan candidate、`latest`、静态 passed 或 scanner 未执行时，不得放行。
- `RetestPassedCandidate` 不等于 `Closed`；缺陷关闭不生成 acceptance verdict、formal evidence alias 或 signoff。

正式正文不得填写真实 defect ref、run、artifact digest、report digest、实际 severity、修复结论或接受签署。

## 10. 待确认事项

| ID | 待确认事项 | 当前状态 | 影响 |
|---|---|---|---|
| `Q-06-12-01` | 真实缺陷系统的字段名、链接格式和 reviewer 角色 | `not_assigned` | 本文只固定可追溯字段，不绑定工具 |
| `Q-06-12-02` | 某次送验是否把 `ENV-STG-RT` / RuntimeLike 升为 required | `not_selected` | 影响 R/B 与 blocked/not_evaluated 裁决，需在 Step 03/04/13固定 |
| `Q-06-12-03` | A 级候选的正式接受角色和截止 / 触发字段 | `not_assigned` | Step 13/14 定义，不在本 Step填写姓名 |
| `Q-06-12-04` | 实现仓的 primary suite producer 与 current `05` exact suite manifest 的最终绑定 | `target_absent` | 未绑定前不能产生真实关闭证据 |
| `Q-06-12-05` | 未来是否把 numeric performance / retention 目标升级为 P0 | `not_frozen` | 升级前必须回写需求、测试和验收基线 |

## 11. Inherited affected 处置

以下项目继续开放，本 Step 不将其转化为缺陷关闭事实，也不把 fail-closed 负向证据当作 positive closure：

`S08-E-I05-PAYLOAD-SCHEMA-01`、`S08-E-I05-PRODUCER-EVENT-BINDING-01`、`R06.6-F2-H13-UPSTREAM`、
`R06-F-AFFECT-UOW-01`、`S08-RECOVERY-CLASS-OWNER-01`、`R07-EXTERNAL-PHASE-LINK-01`、
`R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01`、`S08-CONSUMER-OUTBOX-SURFACE-01`、
`S08-CONSUMER-INDETERMINATE-COMPLETION-01`、`S08-JOB-REPORT-REF-OWNER-01`、
`S08-M1-SECONDARY-TYPE-OWNER-01`、`03-RPR-S09-PER-FLOW`。

I05 仅允许 pre-parse/schema/binding fail-closed；J06 仅允许 controlled `Blocked/manual`。如果未来实现违反这些
约束，才按实际影响升级为 A/S；当前不创建 defect ref 或关闭证据。

## 12. Step 自检与 gate

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否使用 current `S/A/B/R` | `pass_design` | 来源为 `05` Step 11，旧四级名称已废止 |
| 是否与 `VF-OBS-001~010` 一致 | `pass_design` | VF finding 直接 S，不可降级 |
| 每级对三值结论的影响是否可判定 | `pass_design` | §8.1 与 §8.9 固定 |
| 复验是否有 targeted/family/suite/check/full gate 条件 | `pass_design` | §8.4~§8.5 固定 |
| 失败前后证据、same-run 和保留规则是否明确 | `pass_design` | §8.7；当前无真实 run |
| blocked/not_run/not_evaluated 是否与 pass 分离 | `pass_design` | 不允许低真实性替代 |
| 缺陷关闭是否与 verdict/signoff 分离 | `pass_design` | 关闭只产生 defect closure fact |
| inherited affected 是否被错误当作 defect | `no` | 继续保持开放 |
| 是否发现新上游 blocker | `none` | 12 项 inherited affected 继续开放 |
| 是否伪造真实缺陷、测试或放行结果 | `no` | 当前只定义 contract |
| 正式 `06` 是否修改 | `no` | Step 15 前禁止 |
| `gate_status` | `pass_for_defect_retest_release_design` | 可进入 Step 13，不代表验收已通过 |
| `next_allowed_action` | `start_current_06_step_13` | 需先同步 flow/ledger |

## 13. 参考

- `standards/document/验收标准讨论流程_SOP.md` Step 12
- `standards/document/验收标准书写规范.md` §5.12
- `standards/document/设计文档讨论中间产物规范.md`
- `projects/L4-observability/05-测试方案.md` §11~§14
- `projects/L4-observability/design-calibration/05_test_plan_step_06_cases.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_09_automation_gates.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_11_defects_retest.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_12_entry_exit.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_13_evidence.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_14_regression_risks.md`
- `projects/L4-observability/design-calibration/06_acceptance_step_10_observability_evidence.md`
- `projects/L4-observability/design-calibration/06_acceptance_step_11_veto.md`
- `projects/L1-governance/design-calibration/06_acceptance_step_12_defects_retest_release.md`
- `projects/L1-artifact/design-calibration/06_acceptance_step_12_defects_retest_release.md`
