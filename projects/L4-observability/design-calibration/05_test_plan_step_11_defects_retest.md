# L4-observability 05-测试方案 Step 11 · 缺陷管理与复验规则

## Step 状态

| 字段 | 当前值 |
|---|---|
| project / document | `L4-observability` / `05-测试方案.md` |
| step | `11 / 定义缺陷管理与复验规则` |
| mode | `full-restart` |
| status | `completed_current_with_inherited_affected_open` |
| current_module | `defect_taxonomy_escalation_retest_closure` |
| direct_input | current Step 06、09、10；`00` §14.2~§14.4 的 `AC-OBS-001~031`、`VF-OBS-001~010` |
| formal_document_write | `not_allowed_until_step_15` |
| implementation / test execution | `not_started` / `not_run` |
| run / artifact / report / evidence | `absent_by_design`; 仅定义未来关闭证据 contract |
| new_upstream_blocker | `none` |
| inherited_blocker | 12 项 inherited blocker / affected 保持开放，见 §10 |
| next_allowed_action | `rebuild_current_05_step_12` |
| commit | 不需要；用户未要求提交 |

旧 81 行文件只重复仓定位和已废弃对象名，没有缺陷分级、VETO 不可降级、suite 映射、复验决策、关闭证据或
自动化防回归规则，已作为 `historical_material` 删除并重建。本文件是 Step 11 中间产物，不是缺陷执行记录。

## 1. 本步目标与输入边界

本 Step 只定义测试缺陷如何分级、升级、复验和关闭，不创建真实缺陷单，不判断当前实现质量，也不作验收裁决。
缺陷分级必须以影响语义为主，以失败 suite 为定位入口；同一 suite failure 可能是脚本缺陷、环境缺失或产品行为缺陷，
不能机械地全部判为同一级别。

### 1.1 权威输入

| 输入 | 本 Step 使用内容 |
|---|---|
| `00-需求文档.md` §14 | `VF-OBS-001~010` 以及 `AC-OBS-001~031` 的不可接受条件 |
| Step 06 | 99 个唯一 `TC-OBS-*`、16 切口、UoW / phase / no-write / redaction 断言 |
| Step 09 | 9 个 logical suite、五脚本、artifact/report 失败语义和 lane precondition |
| Step 10 | 12 专项、P0 红线、fault injection、evidence/retention/handoff authenticity |
| `00-需求文档.md` §14.2~§14.4 | `AC-OBS-001~031` 的通过口径与唯一 current 一票否决源 `VF-OBS-001~010`；`06` 是下游消费者，不反向定义本 Step |
| L1-governance / L1-artifact Step 11 | 分级、复验和关闭证据的粒度参考；不复制其 truth 或编号 |

### 1.2 真实性边界

- `run_id`、raw artifact、suite report 和 gate summary 在本 Step 中都是未来执行时的必需输入，不是当前存在事实。
- `EV-CAND-OBS-*` 仍是 planned linkage；缺陷关闭不能把 candidate ID 当正式 evidence。
- inherited blocker / affected 不是实现缺陷；只有实现或环境违反其 fail-closed / blocked 设计时才形成缺陷。
- `ENV-STG-RT` 未建立是 `not_evaluated` 前置状态，不自动判为产品 S/A 缺陷，也不能被 CI 结果替代。

## 2. SOP 问题回答

| 问题 | 当前回答 |
|---|---|
| 哪些缺陷属于 S 级阻断 | 任一 `VF-OBS-001~010` 命中；核心能力、body-free、truth ownership、no-write、retention protection、dependency 或 evidence authenticity 失守；commit unknown / replay 造成第二次 owner write；报告静态造 passed / run / alias / signoff。 |
| 哪些缺陷可以风险接受 | 只允许 B/R：无正式阈值的 performance sample/trend、当前非 P0 的 RuntimeLike / 外部产品深层行为、非阻断报告可读性或维护性问题。S 不得接受；A 默认阻断，只有证明不触及任何 `VF-OBS-*`、P0 主证据链和正式退出条件后，才可由 Step 14 形成 risk candidate，并交下游 `06` 独立裁决。 |
| 修复后必须回归哪些用例 | 至少重跑原失败 TC、同切口 family、primary suite、涉及的 check script；触及共享 contract、UoW、redaction、no-write、dependency、report provenance、external phase 或 release evidence 时追加相关 suite，必要时重跑完整 release gate。 |
| 缺陷关闭需要哪些证据 | 失败前后固定 `run_id`、raw artifact、suite report、gate result、failure reason、修复影响面、复验报告和防回归说明；安全/metric/dependency/report provenance 缺陷还需同 run 的专项 check report。 |
| 是否需要新增自动化防回归 | 手工或 RuntimeLike 才发现 P0、release smoke 发现但 lower suite 漏检、同类缺陷复发、现有 scanner/write spy/fault seam 无法捕捉时必须补；新增编号需回写 Step 05~09/13/14，不能只在缺陷单私建。 |

## 3. 历史材料诊断与设计取舍

| 议题 | 采用方案 | 不采用方案 | 理由 |
|---|---|---|---|
| 缺陷等级 | `S/A/B/R`，按影响语义分级 | 按 suite 名或失败次数自动定级 | suite 只是发现入口，不能替代 truth / veto 判断 |
| VF | `VF-OBS-001~010` 直接 S、不可降级 | 用风险接受绕过 | 一票否决语义唯一来自 current `00`，由下游 `06` 消费而非反向定义 |
| inherited affected | 保持 blocked/conditional，不当成产品缺陷 | 因正向路径未建立就记 defect passed/failed | 上游能力缺失与本仓实现违反 fail-closed 是不同事实 |
| performance | 无来源数值只记录 B/R sample risk | 任意 P95/SLA 偏差记 S/A | 当前需求没有数值阈值来源 |
| 复验层级 | targeted -> family -> gate/release 三档 | 修复后只跑原单测 | 共享 contract 和横切红线需要证明无回归 |
| 关闭证据 | 失败前后 run-scoped artifact/report 对比 | 手写“已修复”或静态 candidate EV | 与 Step 09 provenance / Step 13 evidence 真实性一致 |

## 4. 缺陷分级与阻断模型

### 4.1 分级表

| 级别 | 定义 | Observability 示例 | 处理要求 | 阻断 |
|---|---|---|---|---|
| `S` | 命中 VETO / VF，或 P0 truth、安全、no-write、留存、依赖、证据真实性失守 | raw body 泄漏；Query 写 source truth；active material 被删；non-core compile edge；static passed evidence；commit unknown 二写 | 必须修复并按 full scope 复验；不得风险接受；关闭需完整失败前后证据 | 是 |
| `A` | P0 主线或 gate 无法稳定证明，但尚未证实命中 VETO / truth corruption | typed state/error 错误；config activation 半失败被正确阻断；report 缺非真实性字段；suite harness 无法重复 | 默认阻断测试退出；修复并复验。只有明确不触 VETO/P0 evidence 时才可进入条件性风险评审 | 通常是 |
| `B` | 不影响当前 P0 语义和主证据链的实现、报告或环境问题 | 非阻断可读性；无硬阈值的 duration sample 波动；P1/P2 adapter 维护性 | 记录、排期和最小复验；不得写成已验证的 future capability | 否 |
| `R` | 当前非范围、外部前置未建立或未来能力残余风险 | production capacity、真实外部 backend SLA、未建立 RuntimeLike 深层场景 | 记录 owner、触发条件和后续动作；不创建缺陷通过事实 | 否 |

### 4.2 S 级不可降级判定

| 触发 | 来源 | 代表测试 / gate |
|---|---|---|
| redaction gate 可关闭、绕过或 corpus 不可执行仍继续 | `VF-OBS-002` | `TC-OBS-CFG-001~006`、`TC-OBS-RED-001~004`、`check_redaction.sh` |
| raw body、secret、credential、provider/evidence/artifact/runtime body 进入任一输出面 | `VF-OBS-002~003` | `TC-OBS-ING-002`、`TC-OBS-SIG-002/006`、`S-OBS-TELEMETRY-SAFETY` |
| audit/log/metric/trace/report 被当成上游或 execution truth | `VF-OBS-004` | `TC-OBS-AUD-003`、`TC-OBS-SIG-001/003`、`TC-OBS-OWN-001~004` |
| Query、diagnostic、rebuild、maintenance、report/export 或 sink 写 source truth | `VF-OBS-005` | `TC-OBS-QRY-001~004`、`TC-OBS-DIA-002~004`、`TC-OBS-REB-001/006`、`TC-OBS-NW-001~005` |
| active / held / referenced material 被清理或 backend retention 改写 marker | `VF-OBS-007` | `TC-OBS-RET-001~005`、`S-OBS-REPOSITORY-CONFORMANCE` |
| planned / blocked / not-run 材料生成真实 run、EV、passed、verdict、signoff 或 `latest` 引用 | `VF-OBS-006/010` | `TC-OBS-RPT-005`、`TC-OBS-AUT-001~003`、各 TC exact primary suite + `generate_reports.sh` provenance 阶段 |
| non-core sibling compile dependency 或 Bus 被写成 package dependency | `VF-OBS-008` | `TC-OBS-DEP-001~003`、`check_dependency_boundary.sh` |
| report / evidence index 保存正文或 final acceptance verdict | `VF-OBS-003/006` | `TC-OBS-EVD-001~004`、`TC-OBS-RPT-001~005` |
| duplicate / commit unknown / missing stored result 导致第二次 owner mutation 或 current truth rebuild | `VF-OBS-001/005`、Step 10 §7 | `TC-OBS-UOW-003~008`、`TC-OBS-REB-004` |
| 外部产品或历史材料成为 truth / 硬前置 / 无来源阈值 | `VF-OBS-009~010` | `TC-OBS-HIST-001~002`、`TC-OBS-DEP-003`、`TC-OBS-NFR-002` |

## 5. Suite / check 到分级映射

| suite / check | 默认级别 | 升为 S 的条件 | 环境缺失处置 |
|---|---|---|---|
| `S-OBS-CONTRACT-DOMAIN` | A | illegal/reserved state accepted、body-bearing public contract、truth owner 混淆 | ISO 未建立则 blocked/not_run，不记产品 pass |
| `S-OBS-SERVICE-FLOW` | A | owner/source write 越界、duplicate 二写、accepted partial write、evidence/report body | ISO/INT 分开记录，不可互相填充 |
| `S-OBS-REPOSITORY-CONFORMANCE` | A | UoW atomicity、commit unknown、CAS/fence、stored result 造成 truth divergence | `ENV-CI-INT` 缺失为 blocked/not_run |
| `S-OBS-ENTRY-CAPABILITY` | A | I05 在 pre-parse gate 前解析/ack/write，或缺 binding 仍 positive landing | inherited upstream 缺失保持 planned_blocked |
| `S-OBS-RECOVERY-REPLAY` | A | blind retry、external token 更换、J06 伪造 positive H13/run/evidence、report fold 假完成 | controlled blocked 与 RuntimeLike 结果分离 |
| `S-OBS-CONFIG-REDLINE` | A | invalid config silent fallback、关闭 safety/no-write、半激活 facade | config corpus 缺失阻断 suite entry |
| `S-OBS-TELEMETRY-SAFETY` | S | 任一 forbidden material、高基数 label、sink recursion、truth authority finding | scanner 不可执行即 S / gate invalid |
| `S-OBS-STATIC-REDLINE` | A | dependency / historical / writer capability 命中 VETO | source snapshot 缺失则 gate blocked |
| `S-OBS-RELEASE-SMOKE` | A | 定位到任一 VETO 或五能力核心闭环失守 | `ENV-STG-RT` 未建立为 not_evaluated，不降级填充 |
| `check_redaction.sh` | S | finding 非零或 scanner fail-open | 不可执行即 release evidence 无效 |
| `check_metric_labels.sh` | S | forbidden/high-cardinality label 命中或 descriptor 无法审计 | 不可执行即 telemetry gate 无效 |
| `check_dependency_boundary.sh` | S | non-core compile edge、越权 writer/capability edge | graph/source snapshot 缺失即 gate 无效 |
| `generate_reports.sh` provenance audit | A | static passed、orphan report、wrong run、missing raw artifact、fake EV/verdict 则升 S | raw artifact 不完整时只生成 blocked/missing-input report |

## 6. 复验范围决策矩阵

| 缺陷影响面 | 最小复验 | 必须追加 | full release gate |
|---|---|---|---|
| 单一 TC fixture / assertion 编排，未改 shared contract | 原失败 TC + 同切口正/负向 | primary suite | 否，除非该 TC 属 release evidence |
| public DTO / enum / state / typed error / transition | 原失败 TC | `S-OBS-CONTRACT-DOMAIN` + 关联 `S-OBS-SERVICE-FLOW` | 触及 VETO/核心闭环时是 |
| UoW / repository / idempotency / commit unknown / stored result | 原失败 `TC-OBS-UOW-001~008` | `S-OBS-REPOSITORY-CONFORMANCE`、`S-OBS-SERVICE-FLOW`、相关 recovery cases | 是 |
| Query / diagnostic / visibility / freshness / no-write | 原失败 `TC-OBS-QRY-001~004`、`TC-OBS-DIA-001~004`、`TC-OBS-DEG-001~005` | 全部 write spy 代表用例、`S-OBS-SERVICE-FLOW`、`S-OBS-STATIC-REDLINE` | 是，若进入 release read/report 链 |
| redaction / serializer / log / metric / trace | 原失败 `TC-OBS-RED-001~004`、`TC-OBS-SIG-001~006` | `S-OBS-TELEMETRY-SAFETY`、redaction 和 metric checks、raw/report scan | 是 |
| audit / evidence linkage / authenticity | 原失败 `TC-OBS-AUD-001~004`、`TC-OBS-EVD-001~004`、`TC-OBS-AUT-001~003` | service + entry/telemetry/report provenance 相关 suite | 是 |
| external phase / outbox / Job / replay / fence / report fold | 原失败 `TC-OBS-UOW-006~008`、`TC-OBS-REB-001~006`、`TC-OBS-RPT-001~005`、`TC-OBS-EXT-001~003` | repository + recovery suites；same-token/probe/fence cases | 是 |
| retention / protection / cleanup | 原失败 `TC-OBS-RET-001~005` | repository suite、no-delete capability scan、相关 report handoff cases | 是 |
| config / activation / profile | 原失败 `TC-OBS-CFG-001~006` | `S-OBS-CONFIG-REDLINE`、受影响 suite 的三 profile smoke | 是 |
| dependency / ownership / historical | 原失败 `TC-OBS-DEP-001~003`、`TC-OBS-OWN-001~004`、`TC-OBS-HIST-001~002`、`TC-OBS-TRUTH-001~003`、`TC-OBS-NW-001~005` | `S-OBS-STATIC-REDLINE`、dependency check | 是 |
| report generation / evidence provenance | 原失败 `TC-OBS-RPT-001~005`、`TC-OBS-AUT-001~003` | 所有受影响 suite report + report provenance + redaction checks | 是 |
| RuntimeLike only / future external behavior | 原失败 selected case | 同 lane/family；不得用 CI 结果替代 | 否，除非已升级为当前 P0 |

### 6.1 复验顺序

```text
freeze defect scope and failed run references
        |
        v
run targeted failed TC with same semantic fixture
        |
        v
run same-cut family and primary suite
        |
        v
run affected redaction / metric / dependency / provenance checks
        |
        v
run release gate when §6 requires it
        |
        v
compare before/after reports and request closure review
```

任何阶段失败都停止关闭流程；不得跳过 targeted failure reproduction，也不得只用一次新的 green summary 覆盖旧失败事实。

## 7. 缺陷生命周期、升级与关闭

### 7.1 生命周期

| 状态 | 进入条件 | 允许动作 | 禁止动作 |
|---|---|---|---|
| `Reported` | 有固定 failed run / case / failure reason，或设计阶段记录 planned rule gap | triage、关联 TC/suite/VETO | 直接写 closed/passed |
| `Triaged` | severity、owner、影响面和复验范围已确认 | 修复或记录外部 blocker | 将 S 降级为风险 |
| `InFix` | 修复边界和 design baseline 已固定 | 在对应实现 boundary 修改 | 顺手修改无关 truth / design |
| `ReadyForRetest` | 修复 checks 通过、复验输入齐全 | 执行 §6 顺序 | 用旧 run 或 candidate EV 代替复验 |
| `RetestFailed` | targeted/family/gate 任一仍失败 | 重新打开并更新 impact | 关闭或接受 S |
| `RetestPassedCandidate` | 所需复验完成且报告可回指 | 人/Agent 审查关闭证据 | 自动生成 signoff/verdict |
| `Closed` | 关闭清单完整，S/A 已有人/Agent 审查 | 归档并进入回归集 | 删除失败前证据 |
| `Residual` | 仅 B/R 且有 owner/trigger/follow-up | Step14/`06` 风险管理 | 冒充已测试通过 |

### 7.2 升级规则

1. 任何 finding 命中 §4.2，立即升级为 S，不能由 triage owner 降级。
2. A 缺陷在复验中出现 owner truth divergence、raw body、source write、active delete 或 fake evidence，升级为 S。
3. 同一 B 缺陷重复出现并影响 P0 suite 稳定性，至少升级为 A；若触 VETO，升级为 S。
4. inherited affected 一旦被实现绕过 fail-closed / controlled blocked，按实际影响定 A/S，而不是继续标 affected。
5. RuntimeLike 缺失仍是环境前置；只有当前正式退出准则要求该 lane 时，才转成 release blocker。

### 7.3 关闭证据清单

| 关闭材料 | S | A | B/R |
|---|---|---|---|
| defect ID、severity、影响面、对应 VETO/VF/AC | 必需 | 必需 | 必需 |
| failed `run_id`、TC、suite、raw artifact、report、failure reason | 必需 | 必需 | 有执行事实则必需 |
| design baseline / implementation boundary / fix summary | 必需 | 必需 | 视情况 |
| retest `run_id`、targeted/family/gate reports | 必需 | 必需 | 有复验则必需 |
| redaction / metric / dependency / provenance report | 相关即必需 | 相关即必需 | 相关则附 |
| before/after source truth snapshot 或 write-spy result | no-write/truth 类必需 | 相关即必需 | 相关则附 |
| 自动化新增或“不新增”的理由 | 必需 | 必需 | 建议 |
| reviewer / Agent closure note | 必需 | 必需 | 可选 |
| acceptance verdict / signoff | 不由测试缺陷关闭生成 | 不由测试缺陷关闭生成 | 不生成 |

## 8. 自动化防回归规则

| 触发条件 | 必须动作 | 回写范围 |
|---|---|---|
| 手工或 RuntimeLike 首次发现 P0，而现有 TC/suite 未捕捉 | 增加最小可重复 fixture/断言并下沉到最早层 | Step 05~09、13、14；必要时 `03` test cut |
| release smoke 发现、lower suite 漏检 | 将核心断言下沉到 contract/service/repository/entry/recovery suite | Step 06/09 |
| redaction / metric label scanner 漏检 | 扩 sentinel corpus、descriptor allowlist 和同 run report scan | Step 07/09/10/13 |
| write spy / capability scan 漏检 source writer | 扩 spy/capability graph，不以日志断言替代 | Step 06/07/09/10 |
| duplicate / commit unknown / missing result / fence 缺陷复发 | 扩 fault schedule、same-key concurrency 和 probe-first 断言 | Step 06/07/09/10 |
| report provenance / static evidence 漏检 | 扩 raw-artifact pairing、run identity 和 no-static-evidence audit | Step 09/13 |
| dependency / historical misuse 漏检 | 扩 manifest/source/docs corpus，不将产品名本身当 finding | Step 07/09/10 |
| B/R 风险升级为 P0 | 先回写需求/范围/环境/门禁/验收，再创建新的 TC/EV candidate | `00`、Step 02、05~14、`06` |

新增自动化不得私自复用已有 TC ID 表达不同语义，也不得只创建静态 `EV-CAND` 映射。若新增 TC，必须维持
TC -> dataset -> lane -> suite -> raw artifact -> report -> candidate EV -> AC/VF 的双向闭环。

## 9. 单项停审与跨缺陷审计

### 9.1 单项停审

| 审查项 | 结论 | 修正 / 说明 |
|---|---|---|
| `VF-OBS-001~010` 是否全部不可降级 | pass | 全部进入 §4.2 S 级表，且唯一来源为 current `00` §14.3 |
| `VF-OBS-001~010` 是否有缺陷处置 | pass | 核心能力、正文、truth、no-write、retention、dependency、产品/历史误用均覆盖 |
| 9 suite / 五脚本是否有 severity 入口 | pass | 见 §5；脚本不可执行按证据链失效处理 |
| inherited affected 是否与 defect 区分 | pass | 缺能力保持 blocked；绕过 fail-closed 才形成缺陷 |
| 复验是否至少覆盖 targeted + family + gate | pass | 见 §6 |
| 关闭是否要求失败前后 run-scoped evidence | pass | 见 §7.3；当前未创建任何真实 evidence |
| 自动化新增是否有回写纪律 | pass | 见 §8 |

### 9.2 跨缺陷审计

| 审计项 | 结论 |
|---|---|
| 是否存在 S 可通过风险接受关闭 | 否 |
| 是否存在仅凭新 summary 覆盖旧失败的关闭路径 | 否 |
| 是否把无来源 performance 数值变成 S/A | 否；只按结构性失败或已正式阈值判断 |
| 是否把 RuntimeLike 未建立当作 CI 可填充的 green | 否 |
| 是否由缺陷关闭生成 verdict / signoff / formal EV | 否 |
| 是否新增上游 blocker | 否 |

## 10. inherited blocker / affected 与上游影响

以下项保持开放：`S08-E-I05-PAYLOAD-SCHEMA-01`、`S08-E-I05-PRODUCER-EVENT-BINDING-01`、
`R06.6-F2-H13-UPSTREAM`、`R06-F-AFFECT-UOW-01`、`S08-RECOVERY-CLASS-OWNER-01`、
`R07-EXTERNAL-PHASE-LINK-01`、`R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01`、
`S08-CONSUMER-OUTBOX-SURFACE-01`、`S08-CONSUMER-INDETERMINATE-COMPLETION-01`、
`S08-JOB-REPORT-REF-OWNER-01`、`S08-M1-SECONDARY-TYPE-OWNER-01`、`03-RPR-S09-PER-FLOW`。

本 Step 没有修改上游需求、schema、owner、flow 或 VETO，只细化测试管理语义。若未来把 numeric performance 或
RuntimeLike 正向能力升级为 P0，必须先回写 `00/03/04/05/06/07`，不能只调整 severity。

## 11. 正式 §11 回填草稿

正式 `05-测试方案.md` §11 应装配：

- `S/A/B/R` 四级定义，S 覆盖全部 VETO/VF 和 P0 truth、安全、no-write、retention、dependency、evidence 红线。
- suite/check failure 先定位影响语义，再定级；`ENV-STG-RT` 未建立保持 not-evaluated。
- 复验按原失败 TC、同切口 family、primary suite、横切 checks 和必要的 full release gate 顺序执行。
- S/A 关闭必须有失败前后固定 run、raw artifact、report、gate、修复影响面和防回归说明。
- 缺陷关闭不产生 acceptance verdict、signoff 或 formal evidence alias。

## 12. Step 门禁

| 条件 | 状态 |
|---|---|
| 缺陷分级可执行且 VETO 不可降级 | pass |
| suite/check 到 severity 映射完整 | pass |
| 复验范围和 release 触发条件明确 | pass |
| 关闭证据和自动化补强规则明确 | pass |
| 新上游 blocker | none |
| gate_status | `pass_current_step_11_with_inherited_affected_open` |
| next_allowed_action | `rebuild_current_05_step_12` |
| commit | 不需要；用户未要求提交 |
