# Step 6 对象契约粒度回归重审控制产物

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 6
> 创建日期: 2026-07-18
> 状态: `step6_review_confirmed_consumed_by_7r_m0`
> 所属流程: `03_ddd_calibration_flow.md`
> 回归来源: `/tmp/L4-sandbox_03_step06_step10_granularity_review_and_completion_plan.md`
> 当前边界: `6R-M0~07`均已完成，Step 6已获用户确认并由Step 7 regression `7R-M0`消费。本文继续作为Step 6历史控制与审计入口，不拥有Step 7 callable authority。

---

## 1. M0 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否确认启动补全 | 是。用户已确认 `/tmp` 审查与补全计划，允许启动 M0 / Step 6 回归重审。 |
| 项目级原恢复点 | 原为正式 `07` Step 13 已审查完成；该事实保留，但因 `03` Step 6~10 可落码粒度缺口，当前恢复点必须切回 `03` Step 6。 |
| 文档级原状态 | `03_ddd_calibration_flow.md` 原将 Step 6~10 和正式 Step 19 标为通过；这些通过结论已被本次 DesignReopen 失效。 |
| implementation 状态 | `CB-SBX-01A` 是唯一 current identity，仍为 `blocked / wait_design`；实现未开始。 |
| 是否发现新的 L1/L2 blocker | 否。当前 blocker 属于 L4-sandbox 详细设计内部闭环缺口。 |
| 本轮是否允许改正式 `03` | 否。正式 `03` 只能在回归后的 Step 19 重新装配。 |
| 本轮是否允许进入 Step 7 | 否。`6R-05` entry batch已完成待审，仍须用户确认并串行完成`6R-06~07`。 |

### 1.1 当前恢复事实

| 项 | 当前结论 |
|---|---|
| `6R-M0` | 已完成并经用户确认，作为 DesignReopen 控制基线保留。 |
| `6R-01` | `03_ddd_step_06_object_contracts_shared_types.md` 已完成且用户已确认，作为后续对象分件的 shared truth。 |
| `6R-02` | 已闭合并获用户确认；作为 `6R-03` 的 accepted context、established links、active handle / lease 与 read-source direct upstream。 |
| `6R-03` | 24项canonical inventory、12/12 registry mapping、对象正文与views均闭合；batch 7关闭审计已完成并获用户确认，现作为`6R-04`直接上游。 |
| `6R-04` | batch 1~7与§16.1~§16.10已完成、获用户确认并由`6R-05`消费。 |
| `6R-05` application | batch 1已获用户确认；context、replay、error/outcome/query access作为infra直接输入保留。 |
| `6R-05` infra | batch 2已闭合并获用户确认；18/18 adapter kind、18/18 availability coverage、18/18 `InfraError` mapping与10/10 historical consumer delta作为entry直接输入保留。 |
| `6R-05` entry | batch 3已闭合并获用户确认；application maintenance carrier、API/worker/jobs stable carrier、7/12/17三类entry error及16/16 historical consumer delta作为`6R-06`直接输入。 |
| `6R-06` | 17/17静态检查族、8/8恢复源和unresolved 0已获用户确认，并由`6R-07`消费；该结论只代表设计文本闭合。 |
| `6R-07` | 69-row registry索引、5/5 canonical source、7/7 module owner、15/15 Step 7 handoff、42/42 entry inventory和6/6预登记blocker已完成并获用户确认，现由`7R-M0`消费。 |
| 本批闭合 | 28/28 named type、13/13 fully closed support family、15/15 registry、39/39 status owner、52/52 ref kind/wrapper、21/21 reconciliation error owner、10/10 forward method和11/11 downstream overlay差集为0。以上是设计文本静态盘点，不是编译或运行结果。 |
| Step 7 | 继续 `blocked_by_step_6_regression`。 |
| implementation | `CB-SBX-01A blocked / wait_design`；未开始。 |
| 新 L1 / L2 blocker | 未发现。`BLK-SBX-CANONICAL-001`、`BLK-SBX-VERSION-001` 是既有 implementation gate，不是新上游 blocker。 |

---

## 2. 本产物目标

本产物只完成以下控制工作：

1. 把项目、`03` 文档、Step 6 和 implementation 四层状态切换到同一个 DesignReopen 恢复点。
2. 将旧 Step 6~10 的“已通过”保留为历史审查事实，但撤销其当前 implementation baseline 效力。
3. 建立 Step 6 串行回归批次、产物拆分和完成门禁。
4. 固定下游冻结范围，防止 Step 7~19、`04~07` 或 implementation agent 在 Step 6 未闭合前继续推导。

本产物不定义或修改任何对象字段、factory、transition helper、guard 签名、typed-ref kind、error variant 或 Rustdoc 正文。

---

## 3. 本步输入

| 输入 | 用途 | 当前处理口径 |
|---|---|---|
| `project_execution_ledger.md` | 项目恢复点和全局 blocker | 从 `07` 完成态切回 `03` Step 6 DesignReopen。 |
| `03_ddd_calibration_flow.md` | 文档级 Step gate | Step 6 reopened；Step 7~10 串行阻塞；Step 11~19 待影响回查。 |
| `03_ddd_step_06_object_contracts.md` | 原 Step 6 对象材料 | 作为 historical reviewed material 和回归输入，不再视为当前 pass。 |
| 正式 `00/01/02` | 当前上游边界 | 仍为 current reviewed baseline；不能由回归自行重定义。 |
| 正式 `03` | 原正式详细设计 | 保留历史审查事实，但当前不得作为 implementation baseline。 |
| 详细设计 SOP / 书写规范 | Step 6 完成门槛 | 每对象独立、字段/函数 exact、中文 Rustdoc、模块停审。 |
| 可落码性标准 | schema / ref / helper / guard 门槛 | support carrier、named ref kind、member parameter、transition helper 必须闭合。 |
| `/tmp` 审查计划 | 问题清单和回归方案 | 仅作临时审查来源；长期状态必须写入本文件和三层台账。 |

---

## 4. SOP 问题回答

| SOP 问题 | M0 回答 |
|---|---|
| 是否已建立 Step 6 回归骨架和批次状态 | 是，见 §8；`6R-04`已确认并消费，`6R-05` application/infra已确认，entry batch 3已完成并进入用户审查停点。 |
| 是否需要先收敛 shared vocabulary / typed ref / public marker | 是。原 Step 6 在模块正文、摘要卡和 support carrier 间分散，必须先建立 canonical registry。 |
| 哪些模块进入本次回归 | `contracts/domain/application/infra/api/worker/jobs` 七模块均进入 inventory；按风险分批，不一次性写完。 |
| 哪些对象类别必须重验 | shared type、named typed ref、status/error、domain truth、guard/policy、view/report、application helper、infra outcome、entry carrier。 |
| 非 core 模块是否可以继续 defer | 不能机械 defer。凡当前 boundary 唯一拥有 visibility、stored result、idempotency、availability、receipt/report 或 entry disposition 的载体必须在 Step 6 闭口。 |
| 哪些内容明确留给 Step 7+ | trait/port exact callable、public protocol DTO、逐接口 flow、状态矩阵、persistence mapping；但它们引用的类型和同层 transition helper 必须先在 Step 6 存在。 |
| 当前是否具备进入下一对象正文批次的条件 | 否。batch 3已完成待用户审查；确认后才允许读取`6R-06`输入并创建closure audit，完成`6R-05~07`且逐批审查前仍不具备进入Step 7的条件。 |

---

## 5. 当前材料问题诊断

| 诊断 ID | 当前问题 | 为什么不是摘要问题 | Step 6 owner |
|---|---|---|---|
| `SBX-DDD-GRAN-06-001` | 同一类型分散在原 §10~14、§24 和 §25 | 实现者必须跨三处选择 canonical shape | type registry / 单对象 canonical section |
| `SBX-DDD-GRAN-06-002` | HLD guard 未逐个给 exact input/output/error/snapshot dependency | Step 8/9 已消费 guard 名称，服务实现会被迫自补逻辑 | guard inventory / 独立 guard contract |
| `SBX-DDD-GRAN-06-003` | Step 10 引用不存在的同层 transition helper | 状态矩阵不能转成对象 `impl` | object method / factory closure |
| `SBX-DDD-GRAN-06-004` | typed-ref family 以共同壳和名称表表达 | named wrapper、exact kind、wrong-kind reject 未确定 | contracts ref registry |
| `SBX-DDD-GRAN-06-005` | public/internal status 名称和 variant 漂移 | Step 8 receipt/report 与 Step 6/10 状态无法唯一映射 | shared status owner / mapping |
| `SBX-DDD-GRAN-06-006` | 大量类型、variant、公开函数 Rustdoc 为英文 | 不符合详细设计中文 Rustdoc 规范 | 所有 current public contract |
| `SBX-DDD-GRAN-06-007` | 原自检把摘要卡和 support carrier 表判为“全部闭口” | 机械存在不等于字段、方法、来源和错误 1:1 闭环 | closure audit |

---

## 6. 改动前后对比

| 维度 | DesignReopen 前 | 回归目标 |
|---|---|---|
| 类型真相源 | 对象组正文、摘要卡、support carrier 分散 | 每个 current 类型一个 canonical section，其余只索引 |
| Guard | 名称或状态来源散落 | 逐 guard exact input/output/error/dependency/negative cut |
| Typed ref | 共同 `SandboxTypedRef` + 名称表 | 逐 named wrapper + exact kind + constructor + wrong-kind error |
| Transition | 变体表、flow、state matrix 可引用不存在方法 | 每条 current transition exact join 到 Step 6 method/factory |
| Status | internal/public 名称和 variant 可漂移 | 唯一 owner + 显式 mapping |
| Rustdoc | 大量英文 | 类型、variant、公开函数契约中文 Rustdoc |
| 自检 | 手工写“通过” | registry 差集和 unresolved count 为 0 才能通过 |

---

## 7. 设计取舍

| 方案 | 优点 | 风险 | 决策 |
|---|---|---|---|
| A. 只修正式 `03` 摘要 | 改动小 | 中间产物缺口仍在，正式正文只能复制冲突 | 不采用 |
| B. 在原 Step 6 文件末尾追加一张总表 | 写入快 | 形成第四个并列定义位置，继续掩盖单对象缺口 | 不采用 |
| C. 主控 registry + 分域附属中间产物 + 单对象 canonical section | 真相唯一，可按对象停审，可机械对账 | 文档较长，需要串行批次 | 采用 |
| D. Step 6~10 并行修补 | 表面进度快 | 后一步会继续猜前一步类型和签名 | 不采用 |

---

## 8. Step 6 回归批次状态表

| 批次 | 产物 | 范围 | 当前状态 | 内容完整 | 停审状态 | 下一动作 |
|---|---|---|---|---|---|---|
| `6R-M0` | 本文件 + 三层台账 + implementation freeze | DesignReopen 控制面 | done | 是 | `review_confirmed` | 作为回归控制基线保留 |
| `6R-01` | `03_ddd_step_06_object_contracts_shared_types.md` | canonical registry、shared carriers、named refs、status/error owner | done | 是 | `review_confirmed` | 作为 `6R-02~07` shared truth 保留 |
| `6R-02` | `03_ddd_step_06_object_contracts_context_boundary.md` | context、identity、resolution、boundary、capability、handle、lease、相关 guard | done | 是 | review_confirmed | 已由 `6R-03` 消费 |
| `6R-03` | `03_ddd_step_06_object_contracts_policy_run_capture.md` | policy/high-risk、run、capture、handoff、相关 guard与views | done | 是 | review_confirmed | 已由`6R-04`消费 |
| `6R-04` | `03_ddd_step_06_object_contracts_failure_cleanup_read.md` | failure/control/cleanup/redline/reference/projection/derived/relay/audit | completed_and_consumed | 是；§16.1~§16.10与§17均闭合并经用户确认 | passed_to_6r_05 | 已消费；不再修改其canonical正文 |
| `6R-05` | `03_ddd_step_06_object_contracts_application_infra_entry.md` | application/infra/api/worker/jobs stable carrier | completed_review_confirmed | 是；application/infra/entry三批均已确认 | passed_to_6r_06 | 作为`6R-06`直接输入，不再修改canonical正文 |
| `6R-06` | `03_ddd_step_06_object_contracts_closure_audit.md` | 字段/factory/guard/transition/ref/status/dependency 审计 | completed_review_confirmed | 是；17/17检查族、8/8恢复源、unresolved 0 | review_confirmed_consumed_by_6r_07 | 已由`6R-07`消费；canonical正文保持冻结 |
| `6R-07` | `03_ddd_step_06_object_contracts_handoff_assembly.md` + Step 6主控回填 | registry、唯一 canonical 链接、Step 7 handoff、自检 | completed_review_confirmed | 是；69/69 registry、5/5 source、7/7 owner、15/15 handoff、6/6 blocker | review_confirmed_consumed_by_7r_m0 | 作为Step 7 current上游保持冻结 |

附属文件只承载主控 registry 指定的 canonical section，不能互相重复定义。任何跨分件共享类型必须回到 `6R-01`，不得在对象分件复制一份 schema。

---

## 9. 当前 blocker 与冻结范围

| Blocker ID | owner | 状态 | 阻塞范围 | 关闭条件 |
|---|---|---|---|---|
| `SBX-DDD-GRANULARITY-REOPEN-001` | `03` Step 6~10 | open | 正式 `03` implementation baseline、Step 7~19 当前 pass、`04~07` 下游有效性、全部 implementation Activation | Step 6~10 串行重审、Step 11~18 影响回查、Step 19 重装配、`04~07` 定向重验均经用户逐阶段确认 |
| `SBX-DDD-GRANULARITY-STEP6-001` | Step 6 | resolved_review_confirmed_consumed_by_7r_m0 | none_current | `6R-06`与`6R-07`已完成、静态差集为0并获用户确认；Step 7已通过`7R-M0`消费其current authority |
| `SBX-DDD-VIEW-OWNER-6R03-001` | Step 6 / `6R-03` batch 6 | resolved_in_6r03_batch_6_revalidated_batch_7 | none_current | 10/10 support declarations unique、contracts反向public field dependency为0；batch 7复核未回归 |
| `SBX-DDD-CONTRACTS-FILE-6R03-001` | Step 4 / Step 6 / `6R-03` batch 7 | resolved_in_6r03_batch_7 | none_current | Step 4 planned tree与shared registry统一使用既有`refs.rs`承接shared enum / marker，current path差集为0；不得由实现者新增未规划module |
| `SBX-DDD-STATE-INVENTORY-6R03-001` | Step 10 / Step 16 /正式`05~07` / `CB-SBX-12A` | downstream_revalidation_pending | historical state inventory，不阻塞`6R-03`对象关闭 | batch 7只证明39个shared status enum唯一；Step 10回归后再把historical 29状态机 /30 enum清单重验为30状态机 /31 enum，并传播受影响下游计数 |

冻结规则:

- Step 7~10 只能读取，不得修补；必须等待前一步审查确认。
- Step 11~19 只能登记为 downstream revalidation pending，不得先改正文适配未完成的 Step 6。
- 正式 `03`、`04~07` 本轮不改。
- `CB-SBX-01A` 保持 `blocked / wait_design`；其余 planned boundary 保持 `planned / wait_until_current`。
- 不创建实现仓、代码、commit、run、evidence alias、测试结果或验收签署。

---

## 10. 当前恢复口径

项目级恢复口径:

```text
current_document = 03-详细设计.md
current_step = Step 6 regression / 6R-06
current_batch = 6R-06 full closure audit
step_status = reopened_waiting_6R_06_review
batch_status = completed_wait_user_review
gate_status = completed_wait_user_review
current_module = all Step 6 canonical modules
current_object = registry + field/factory + guard + transition + ref/status/error + dependency closure
object_gate_status = full_closure_audit_closed_wait_review
next_allowed_action = wait_user_review_before_6R_07
application_registry = 8/8 families_closed
checked_deserialize = 3/3
application_error_detail_mapping = 41/41_exact_once
adapter_kind = 18/18
activation_kind = 2/2_required_or_disabled
availability_coverage = 18/18
infra_error_mapping = 18/18_exact_once
api_error_mapping = 7/7_exact_once
worker_error_mapping = 12/12_exact_once
jobs_error_mapping = 17/17_exact_once
entry_historical_consumer_delta = 16/16_registered
named_types = 28/28
support_families = 13/13
registry_mappings = 15/15
forward_methods = 10/10
implementation = CB-SBX-01A blocked / wait_design
```

文档级恢复口径:

```text
Step 6 = reopened_6r_06_completed_wait_user_review
Step 7 = blocked_by_step_6_regression
Step 8 = blocked_by_step_7_regression
Step 9 = blocked_by_step_8_regression
Step 10 = blocked_by_step_9_regression
Step 11~19 = downstream_revalidation_pending
```

对象级恢复口径:

```text
§16.1 = completed_and_consumed
§16.2 = completed_and_consumed
§16.3 = completed_and_consumed
§16.4 = completed_and_consumed
§16.5 = completed_and_consumed
§16.6 = completed_and_consumed
§16.7 = completed_and_consumed
§16.8 = completed_and_consumed
§16.9 = completed_and_consumed
§16.10 = completed_and_consumed
application_context = completed_wait_user_review
idempotency_and_stored_replay = completed_wait_user_review
application_error_outcome_query_access = completed_wait_user_review
application_establishment_port_result_delta = completed_wait_user_review
infra_config_binding_availability = review_confirmed
infra_establishment_handoff_publisher_outcomes = review_confirmed
infra_error = review_confirmed
application_maintenance_carrier = completed_wait_user_review
api_entry = completed_wait_user_review
worker_entry = completed_wait_user_review
jobs_entry = completed_wait_user_review
```

---

## 11. 当前批次自检

| 检查项 | 结果 |
|---|---|
| 是否读取项目、文档、Step 和 implementation 当前状态 | 通过 |
| 是否读取 Step 6 SOP / 书写规范 / 可落码性标准 | 通过 |
| 是否把 `/tmp` 计划误当长期真相源 | 否；长期状态已落入本文件和三层台账 |
| 是否修改正式 `03` | 否；只创建 / 更新 Step 6 regression calibration 中间产物 |
| 是否提前创建 Step 7~10 补全内容 | 否 |
| 是否保持 implementation freeze | 是，`CB-SBX-01A blocked / wait_design` |
| 是否伪造 commit / run / evidence / test / acceptance | 否 |
| 是否需要提交 | 否，用户未要求 |
| `6R-01` shared registry unresolved | 0 |
| object kind / named wrapper | 52 / 52；设计差集 0，未声明测试结果 |
| protocol selector | 55 / 55；设计差集 0 |
| status / public error | 39 / 16；batch 5新增`HandoffTargetProgressStatus`，owner唯一 |
| `6R-02` canonical inventory | 24 / 24；missing 0；duplicate owner 0 |
| `S6T-02-*` registry | 17 / 17 映射到唯一 canonical section |
| boundary dimension | 10 / 10；resource 4 + 独立 dimension 6 |
| public type / callable / variant / named field / payload-field Rustdoc missing | 0 / 0 / 0 / 0 / 0 |
| exact `6R-04` forward methods | 10 / 10 closed；batch 2闭合failure/control 3项，batch 3闭合lease 2项，batch 4闭合cleanup / redline 5项 |
| `6R-03` canonical inventory / registry | 24 / 24；12 / 12；missing / duplicate / pending均0 |
| `6R-04` canonical inventory / registry | 41 / 41 review units（28 named + 13 support family）；15 / 15；§16.10完成后为28 / 28 named、13 / 13 fully closed support，10 / 10 forward；其余为设计文本静态盘点 |
| `6R-04` forward owner allocation | 10 / 10；batch 5完成后仍为10 / 10，caller bool / borrowed reason / status compare替代路径为0 |
| planned contracts current path | 10 / 10 source files；未规划kind / status / state / marker current path为0；`refs.rs` shared enum职责已固定 |
| batch 7 named / support / registry | 28 / 28；13 / 13；15 / 15；unresolved均为0 |
| batch 7 status / ref / reconciliation error | 39 / 39；52 / 52；21 / 21；unresolved均为0 |
| batch 7 source owner / downstream overlay | 28 / 28；11 / 11；unresolved均为0 |
| batch 7 Rustdoc / fence | missing / unbalanced均为0；这是设计文本静态审计，不是编译、lint或测试结果 |
| `ControlFact`创建时间语义 | closed | `accept / duplicate / conflict`统一写`recorded_at`；不存在只适用于accepted disposition的字段名漂移 |
| control failure attach | closed | `mark_failed`消费`Option<&FailureClassification>`并验证lineage/status后复制ref；裸`Option<FailureClassificationRef>`被禁止 |
| control source / effect observation | closed | system source缺request id有独立typed error；三类effect各有closed `SafeSummaryRef.source_kind`矩阵；`Unsupported`无observation path |
| terminal override callable | closed | `TerminalOverride`由`ControlFact::accept`消费checked decision，并将disposition、decision reason与evaluation time持久化；不存在`accept_terminal_override`幽灵方法 |
| orphan / redline marker reverse validation | orphan_revalidated_batch_4;redline_closed_batch_4 | `from_orphan`已按release/failure basis重新校验；`from_redline`已按status、lineage、impact、kind、safe reason和source time反向重验 |
| partial-handle unavailable recovery | closed | `BoundaryOnlyReleaseFailureRecovery`允许持久化body-free `Unavailable` observation，但strict guard必须生成`ReleaseRecoveryInspectionPending + ReleaseTarget`并保持`PendingEvidence`；investigation `Accepted`不得清除该门禁 |
| `6R-05` application registry | 8 / 8 families closed | context、idempotency、stored replay、error、outcome、side-effect/reason set与query access均有唯一owner |
| checked deserialize | 3 / 3 | idempotency record、stored surface ref、stored operation result均经private wire回到唯一validator/constructor并拒绝unknown field |
| application error detail mapping | 41 / 41 exact once | batch 3增加4项maintenance detail；detail -> kind -> public kind无缺失、无重复、无wildcard；current generic error union为0 |
| `6R-05` infra adapter kind / activation | 18 / 18；2 / 2 | activation只`Required | Disabled`；projection/derived/reference selected binding均为required startup assembly |
| infra binding / availability coverage | 18 / 18 | same-order、same-marker、disabled slot也必须占位；startup required failure不得生成degraded generation |
| infra outcome branch | establishment 4 / 4；handoff 3 / 3；publisher 3 / 3 | exact correlation、body-free、adapter success不等于domain accepted；run/release不复用establishment outcome |
| `InfraError` mapping | 18 / 18 exact once | detail/public mapping无wildcard；两个commit-unknown只进入exact inspection |
| infra historical consumer delta | 10 / 10 | Step 7/9/10/12/正式`03`差集已登记，未跨步修改 |
| API entry / error | 3 carrier families；`ApiError` 7 / 7 | command/query/error mapping穷尽；stored surface kind/operation/status relation闭合 |
| worker entry / error | 5 carrier families；`WorkerError` 12 / 12 | consumer/fulfillment/relay关系穷尽；Worker channel只允许4 command + 1 relay job |
| jobs entry / error | 3 carrier families；`JobsError` 17 / 17 | full-batch accumulator、continuation chain、fresh/duplicate finalization和error action闭合 |
| entry owner / field / constructor | 13 / 13；16 / 16；13 / 13 | owner唯一、字段来源和checked construction/accessor/move差集均为0 |
| entry historical consumer delta | 16 / 16 | Step 7/8/9/10/12/13/15/正式链冲突均登记later rewrite owner，未跨步修改 |
| actor authority conflict | registered_for_step_8_regression | current core无`Maintenance` kind；worker/job P0 system-only；不是新L1/L2 blocker |

---

## 12. 进入下一批条件

`6R-05` entry batch 3已完成静态闭合待审。用户确认前不得创建或进入`6R-06`，不得进入Step 7或
修改正式`03~07`。本批收尾已重新读取:

1. `project_execution_ledger.md`
2. `03_ddd_calibration_flow.md`
3. 本文件与`03_ddd_step_06_object_contracts_application_infra_entry.md` §9.2~§11.19
4. Step 6 SOP 与书写规范
5. `03_ddd_step_06_object_contracts_shared_types.md` §8.6、§12.8、§13与物理末尾§21 current override
6. Step 4 planned application/api/worker/jobs paths与Step 5 module owner
7. current core `ActorKind` export与正式`00/01/02`职责边界
8. 原Step 7/8/9/10/12/13/15 entry consumers，只作historical conflict输入
9. `implementation_execution_ledger.md`与`CB-SBX-01A` freeze状态

entry batch固定42/42 operation mapping、Worker channel 4-command + 1-relay allow-set、application
maintenance完整batch outcome、API/worker/jobs exact carrier、7/12/17 module error与16/16 historical consumer
delta。actor P0保持worker/job system-only；historical Step 8 `Maintenance/operator-scoped`差异只登记为
后续回归义务，不扩大当前权限。

当前只允许等待用户审查`03_ddd_step_06_object_contracts_application_infra_entry.md` §11。用户确认后
只允许读取上述输入并开始`6R-06` closure audit；不得把一次确认扩展为完成`6R-06~07`、进入Step 7、
修改正式`03~07`或激活implementation。

上述§10~§12均为回归过程中的historical recovery snapshots，现由物理末尾§13覆盖；其中已确认的
对象契约与静态审计事实继续有效，但旧`next_allowed_action`不得用于恢复。

---

## 13. `6R-07`完成态与Step 6正式停审点

`6R-06`用户确认已被`6R-07`消费。`6R-07`没有新增schema，只把shared types §8的69-row registry、
五份canonical source、七模块owner和Step 7 handoff装配为唯一恢复入口。最终静态审计读取15个设计
输入，验证69/69 registry、5/5 source、7/7 owner、15/15 handoff、6/6 blocker及10/10完成态恢复源，
unresolved为0。该结果不是Rust compile、test、runtime或验收结果。

项目级恢复口径：

```text
current_document = 03-详细设计.md
current_step = Step 6 regression / 6R-07
current_batch = 6R-07 master assembly and Step 7 handoff completed_wait_user_review
step_status = reopened_completed_wait_user_review
batch_status = completed_wait_user_review
gate_status = completed_wait_user_review
object_gate_status = step_6_current_canonical_baseline_closed_wait_review
next_allowed_action = wait_user_review_before_step_7_regression
upstream_6R_06 = review_confirmed_consumed_by_6R_07
registry_rows = 69/69
canonical_sources = 5/5
module_owners = 7/7
step_7_handoff_groups = 15/15
step_7_entry_callable_inventory = 42/42
step_7_preregistered_blockers = 6/6
static_audit_unresolved = 0
implementation = CB-SBX-01A blocked / wait_design
```

文档级恢复口径：

```text
Step 6 = reopened_6r_07_completed_wait_user_review
Step 7 = blocked_by_step_6_user_review
Step 8 = blocked_by_step_7_regression
Step 9 = blocked_by_step_8_regression
Step 10 = blocked_by_step_9_regression
Step 11~19 = downstream_revalidation_pending
```

当前只允许等待用户审查Step 6。用户确认后只可读取Step 7 SOP、书写规范、Step 6 `6R-07` handoff、
historical Step 7和上游current canonical source，创建Step 7 regression控制产物并启动第一个明确批次；
不得把确认扩展为完成Step 7、进入Step 8、修改正式`03~07`或激活implementation。

上述§13是Step 6完成待审时的historical recovery snapshot，现由物理末尾§14覆盖。

## 14. Step 6 review confirmation consumed by Step 7 control

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-M0
Step 6 = review_confirmed_consumed_by_7R_M0
Step 7 = reopened_7R_M0_completed_wait_user_review
Step 8 = blocked_by_step_7_regression
Step 9 = blocked_by_step_8_regression
Step 10 = blocked_by_step_9_regression
Step 11~19 = downstream_revalidation_pending
next_allowed_action = wait_user_review_before_7R_01_service_facades
implementation = CB-SBX-01A blocked / wait_design
```

Step 6 blocker已关闭为`resolved_review_confirmed`，但总blocker
`SBX-DDD-GRANULARITY-REOPEN-001`继续open，直到Step 7~10和下游重验全部闭合。
