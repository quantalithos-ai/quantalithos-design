# Step 3. 收稳前置条件、阅读清单与恢复合同

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 3
> 回填目标：正式 `07-实施计划.md` §3
> 模式：`full-restart + single-agent-serial`
> 本步状态：`completed_with_design_gate`

## 1. 本步目标与结论

本步把“可以开始实施计划”与“已经可以开始写实现代码”分开。实施计划可以继续装配，但任何实现 boundary 仍必须经过 Design Gate、Scope Gate、Worktree Gate、Test Gate、Evidence Gate、Commit Gate 和 Handoff Gate。目标实现仓不存在，故本步不执行实现仓命令、不创建替代仓、不生成实现台账和 boundary skeleton；这些输出只能在 Step 13 装配。

当前唯一允许承接的实现身份如下：

```text
language_candidate       = Rust
edition_candidate        = 2024
rust_version_candidate   = 1.93
compile_dependency       = verified L0-core contract only
other_dependency_types   = runtime | event | ref | adapter | fake
target_worktree          = absent
immutable_design_ref     = not_bound
implementation_status    = not_started
actual_run/evidence      = none
```

本步发现一个必须回写正式 03 的设计门禁：正式 `03-详细设计.md` §3.1 仍写“public Rustdoc 使用中文”，而 `03_ddd_step_03_constraints.md` 与 `standards/coding/rust.md` 都要求源码注释和 Rustdoc 使用英文。实施计划不替 owner 文档裁决；该冲突以 `L2R-LANG-002`（设计源冲突）记录，受影响 boundary 在实现前保持 `blocked / wait_design`。

## 2. 输入、历史材料与权威优先级

| 输入 | 当前定位 | 本步处理 |
|---|---|---|
| `projects/L2-runtime/00-需求文档.md` 至 `06-验收标准.md` | current formal source（当前工作树） | 逐章读取并建立实现回指；不以文件存在推断 immutable baseline |
| `projects/L2-runtime/07-实施计划.md` | historical material | 只做污染审计；不继承旧 phase、state、CUT、suite、check 或 alias |
| 旧 Step 3~12、旧 implementation ledger、35 个 skeleton | historical material | 删除并重建；旧数值和命名全部 reject-only |
| `standards/document/全局项目依赖关系与裁剪规则.md` | normative authority | 决定全局顺序和 owner 裁剪，优先于旧 README/依赖表 |
| `/home/aris/Projects/workdoc/ai/quantalithos_next_repo_dependency_order.md` | historical material | 只记录冲突，不用于当前顺序或 readiness |
| 上游正式链 | current upstream input | 只消费 owner contract/ref/event/adapter；开放 seam 原样传入 |

### 2.1 当前 canonical baseline

以下数字是当前 03/04/05/06 的交叉核对结果；任何旧文档出现不同数字均登记为 `historical_material`，不能在实现中兼容两套分母。

| 项目 | canonical |
|---|---:|
| capability | 12 CAP |
| command / query | 17 C / 12 Q |
| inbound / outbound event | 6 E / 6 O |
| job | 7 J |
| state machine | 31 SM |
| UoW crash windows | 7 |
| replay/concurrency families | 6 |
| configuration slices | 15（12 roots、153 leaves、39 derived semantics） |
| external adapter slots | 13 |
| test cut | 37 CUT |
| test cases/events | 172 raw + 5 same-run aggregate = 177 TC/EV |
| owning suites | 8，raw counts `35/32/32/16/25/15/17/5` |
| mandatory checks | 9 |
| acceptance / veto / NFR | 36 AC / 8 VF / 19 NFR |

`48 protocol/job surfaces` 是 `17+12+6+6+7` 的审计总和；它不是另一个可实现分母。`TC-QUAL-SLOT01~13` 属于独立 G3 lane，不进入 G1 的 177。

## 3. Required Reads：规范、SOP 与实现前闭环

以下路径在 Step 3 已作为全局必读集逐项读取；任何新增 boundary 必须再次从该表取得具体路径，不能用“已读全部设计”替代。

| 类别 | 必读路径 | 读取目的 |
|---|---|---|
| 文档总则 | `standards/document/设计文档编写通则.md` | 文档真相源、历史材料、章节与回填纪律 |
| 中间产物 | `standards/document/设计文档讨论中间产物规范.md` | Step 状态、删除重建、批量写入、恢复门禁 |
| 可落码性 | `standards/document/设计真相源闭环与可落码性标准.md` | construction/flow/ref/validation/transaction/evidence closure |
| 全局裁剪 | `standards/document/全局项目依赖关系与裁剪规则.md` | 当前项目顺序、owner、依赖类别和禁止合并项 |
| 需求流程 | `standards/document/需求文档讨论流程_SOP.md` | 需求真相源和历史污染识别方式 |
| 需求规范 | `standards/document/需求文档书写规范.md` | FR/BR/NFR/AC 的回指粒度 |
| 实施流程 | `standards/document/实施计划讨论流程_SOP.md` | Step 1~13、phase/boundary 停审、commit/handoff 门禁 |
| 实施规范 | `standards/document/实施计划书写规范.md` | 正式 §1~§12 结构、ASCII、台账和证据语义 |
| 实施台账 | `standards/document/代码实施台账与门禁规范.md` | 唯一 current boundary、状态机、恢复和提交规则 |
| Rust 编码 | `standards/coding/rust.md` | 英文源码注释/Rustdoc、命名、可见性、错误和格式 |
| 目录组织 | `standards/document/子项目目录与代码文件组织规范.md` | workspace、crate、binary、script、artifact/report 路径 |

### 3.1 当前正式项目链读取集

实施计划只消费已完成正式链的契约，不把校准文件变成新的业务真相源。下列各组均已读取 `00-需求文档.md` 至 `07-实施计划.md`（若某上游正式文件本身标记 pending/blocker，则只传递该状态）：

| 上游组 | 必读路径 | Runtime 只接收 |
|---|---|---|
| 直接上游 | `projects/L2-tools/{00-需求文档,01-架构设计,02-概要设计,03-详细设计,04-配置设计,05-测试方案,06-验收标准,07-实施计划}.md` | 工具行动请求/状态/receipt/feedback 的正式边界；不接管执行 |
| capability | `projects/L3-capability-hub/{00-需求文档,01-架构设计,02-概要设计,03-详细设计,04-配置设计,05-测试方案,06-验收标准,07-实施计划}.md` | identity、registry、adapter descriptor、formal exposure |
| method | `projects/L3-method-library/{00-需求文档,01-架构设计,02-概要设计,03-详细设计,04-配置设计,05-测试方案,06-验收标准,07-实施计划}.md` | method/role/process definition 与版本/ref；不接管 body/source |
| sandbox | `projects/L4-sandbox/{00-需求文档,01-架构设计,02-概要设计,03-详细设计,04-配置设计,05-测试方案,06-验收标准,07-实施计划}.md` | isolation execution boundary 和 handoff；不接管 policy/cleanup truth |
| observability | `projects/L4-observability/{00-需求文档,01-架构设计,02-概要设计,03-详细设计,04-配置设计,05-测试方案,06-验收标准,07-实施计划}.md` | safe observation/audit carrier 与 projection seam；不接管 backend |
| foundations | current formal docs under `projects/L0-core`, `projects/L0-bus`, `projects/L0-sdk` and related ledgers | Core exact compile candidate；Bus event seam；SDK downstream/ref |
| governance/artifact | current formal docs under `projects/L1-governance`, `projects/L1-artifact` and related ledgers | approval/policy truth；artifact/evidence/ref granularity；不在 Runtime 本地重建 |

上游存在 dirty workspace、开放正向接口或未验证实现时，读取完成不等于 activation。其状态分别记录为 `L2R-UP-001~008`、`L2R-CP-001`、`L2R-ENTRY-001`、`L2R-IMPL-001`，并在受影响 boundary 上维持负向姿态。

## 4. Phase / boundary 精读策略

Step 5 尚未锁定最终 phase 数量和编号，因此本节按能力族定义阅读合同，不提前继承旧 `PH-01~PH-12`。Step 5 会根据 Loop Kernel（SM-25~SM-29）和 Operation Reservation（SM-30）的隔离要求重新计算 phase graph；Step 6 再生成唯一 boundary 集合。

| 能力族 | 必读正式章节 | 必读校准产物 | 精读结果 |
|---|---|---|---|
| workspace/vocabulary/loop kernel | 03 §3~§6、§9~§13 | `03_ddd_step_03_constraints.md`、`03_ddd_step_04_file_layout.md`、`03_ddd_step_06_object_contracts.md`、`03_ddd_step_11_persistence_consistency.md`、`03_ddd_step_13_concurrency_idempotency.md` | crate/path、cursor/snapshot/T1/T2/T3、lease、reservation、Unknown |
| admission/run/goal/plan | 03 §5~§9、§15 | `03_ddd_step_05_capabilities_01_03.md`、`03_ddd_step_06_contracts_run_goal_plan.md`、`03_ddd_step_08_protocol_commands.md`、`03_ddd_step_09_flows_commands_01_06.md` | accepted-only admission、plan source、query zero-write |
| context/working/episodic/semantic memory | 03 §5~§6、§13~§15；04 matching roots | `03_ddd_step_05_capabilities_04_06.md`、`03_ddd_step_06_contracts_context_memory_model.md`、`03_ddd_step_14_configuration_dependencies.md` | working-owned facts、durable ref-only、candidate/gap/fail-closed |
| model routing/decision | 03 CAP-06、§7~§13；04 `model_decision`/slots | model portions of `03_ddd_step_06_contracts_context_memory_model.md`、protocol/flow/state/concurrency annexes | provider-neutral intent、two UoW、stable identity、no secret/route/quota/cost |
| action/tool orchestration | 03 CAP-07、§7~§15；L2-tools formal chain | `03_ddd_step_05_capabilities_07_09.md`、`03_ddd_step_06_contracts_action_delegation_feedback.md`、`03_ddd_step_09_flows_commands_07_12.md` | five guards、record-before-call、Tool contract consumer only |
| sub-agent/delegation/feedback/reflection | 03 CAP-08/09；L3 method and entry refs | delegation/feedback object, flow, state, concurrency annexes | strict child subset、once-only incorporation、no member lifecycle |
| checkpoint/resume/recovery | 03 CAP-10、§9~§13；04 checkpoint roots | `03_ddd_step_05_capabilities_10_12.md`、`03_ddd_step_06_contracts_recovery_outcome_handoff_projection.md`、`03_ddd_step_10_states_11_15.md` | Prepared/Committed split、matching receipt、manual/Unknown fence |
| outcome/handoff/projection/events/jobs | 03 CAP-11/12、§7~§15；Bus/Obs/Artifact | outcome/handoff annexes、`03_ddd_step_15_observability_audit.md`、`03_ddd_step_16_test_cuts.md` | local-first truth、immutable outbox、safe material、gap/ACK/observed separation |
| config/entry/tooling/evidence | 04 §3~§14、05 §3~§14、06 §3~§14 | all 04/05/06 calibration steps relevant to builder, gates and handoff | 12 roots/13 slots/7 jobs, 37/177, 9 checks, review-only acceptance |

每一个最终 boundary 的 header 必须列出 exact formal section、exact calibration file、source status、owner、dependency type 和 failure action；缺任何一项即 `wait_design`。

## 5. 目标仓、工具链与本地多仓 preflight

### 5.1 当前事实

| 检查 | 要求 | 当前 | 失败处理 |
|---|---|---|---|
| target worktree | `/home/aris/Projects/quantalithos-runtime` 是授权 git root | `absent` | `commit-01-a` blocked；不创建替代仓 |
| immutable design baseline | 00~06 source manifest + content digests + source status | `not_bound`（当前设计仓有 dirty changes） | 设计完成后重新固定；不得用日期/hash 猜测 |
| Rust toolchain | edition 2024、rust-version 1.93 candidate 可解析/构建 | `not_run` | 目标仓建立并授权后实测；不降低版本 |
| Core contract | exact package/crate/API/schema/codec/source compatibility | `pending` | 先做 `SP-L2R-001`；不建 shadow type |
| local persistence/lease | CAS、atomicity、Unknown、fence 可验证 | `not_selected` | `SP-L2R-002` 只验证语义，不证明产品 readiness |
| git identity | repo-local `quantalithos-labs` / `quantalithos.ai@gmail.com` | `not_run` | Commit Gate blocked；禁止 `--global` |
| actual tests/artifacts | fixed run + same-run raw/report/evidence | `none` | 不写静态结果、不创建 `latest` |

### 5.2 预期 workspace 和命名检查

只有正式 03 §4 与后续 baseline 同时确认后，才能在目标仓检查以下候选结构；这些不是已创建事实：

```text
quantalithos-runtime/
  Cargo.toml
  crates/{contracts,domain,application,infra,api,worker,jobs}/
```

候选 package 为 `runtime-{contracts,domain,application,infra,api,worker,jobs}`，候选 library crate 为 `runtime_{contracts,domain,application,infra,api,worker,jobs}`；binary 只允许正式 03 确认的 `runtime-api`、`runtime-worker` 和 job candidate，未确认的 job binary 名称不得发明。任何 package/crate/type/module/file/binary 含 `L2` 或 `l2_` 都属于架构泄漏检查失败。

### 5.3 依赖类型和激活条件

| owner | 设计类别 | 允许的 Runtime 形态 | 激活条件 |
|---|---|---|---|
| L0-core | compile candidate | exact compatible path/package/API | manifest、source、schema、codec、baseline 实测闭合 |
| L0-bus | event/adapter/fake | immutable outbox、publisher port、safe spy | route/schema/status/qualification 闭合 |
| L0-sdk | downstream/ref | server contract/ref | Runtime 不反向依赖 |
| L2-tools | runtime/ref/adapter/fake | typed invocation port、blocked/negative fake | owner contract、selected adapter/profile、real qualification |
| capability-hub | runtime/ref | identity/descriptor resolver port | formal exposure + version/source |
| method-library | runtime/ref | method/role/process resolver port | immutable formal source；当前 dirty source 必须披露 |
| governance | runtime/ref/event | decision/policy consumer | authority/effective version/source |
| sandbox | runtime/adapter | controlled handoff port | isolation contract + selected adapter + real test |
| observability | event/adapter/fake | body-free material carrier | route/schema/backend qualification；Runtime 不拥有 backend |
| model/memory/checkpoint | runtime/ref/adapter/fake | provider-neutral/ref/status port | owner contract/profile/receipt；开放项 fail-closed |
| artifact/SDK/product/member | ref/downstream | typed ref/handoff only | 不进入 Runtime Cargo 或容器生命周期 |

## 6. 脚本、artifact、report 与证据前置

脚本是未来交付物，不是当前存在事实。正式 05 的 gate runners、四个 check scripts 和 report/evidence generators 必须在专属 tooling phase 中创建；前序 boundary 只能记录真实命令或 `not_applicable`，不能手写报告。

| 表面 | canonical path | 当前 | 约束 |
|---|---|---|---|
| gate runners | `scripts/gates/test_{unit,contract,service,integration,worker_jobs,security_boundaries,full}.sh` | `not_created` | caller 必须传 `--run-id --artifact-root --config-profile`；selector 非空 |
| checks | `scripts/checks/check_{source_manifest,dependency_boundaries,forbidden_material,fake_profile_leak,status_truth,redaction,artifact_report_pairing,no_static_evidence,test_denominators}.sh`（以正式 05 §9.5 exact names 为准） | `not_created` | 9 个身份、退出码、raw pairing 必须从 05 逐字回指 |
| reports | `scripts/reports/{generate_reports,generate_evidence_index,generate_acceptance_handoff}.sh` | `not_created` | 只读同一 run raw/check，输出 draft/derived，不生成 verdict |
| raw artifacts | `artifacts/test/<run_id>/meta|checks|suites/...` | `not_generated` | 无 project segment、无 `latest`、失败 append-only 保留 |
| reports | `reports/runs/<run_id>/...` | `not_generated` | same-run/digest-bound；不能跨 run 拼接 |
| acceptance review | `reports/acceptance/{handoff,veto-checklist,risk-acceptance,open-issues}.md` | `not_generated` | 最高 `draft/review_required`，不等于 verdict/signoff |

## 7. 永久记忆种子与机械生成门禁

永久记忆只能在 Step 13 由下表机械投影；本步不写入实现仓记忆。种子不包含 DTO 字段、状态矩阵、业务正文、TC 全文或临时 blocker 细节。

| ID | 必须写入的记忆文本 | 来源 | 触发 | 失效/冲突处理 |
|---|---|---|---|---|
| `MEM-L2R-001` | 开始任何代码、配置、脚本或测试改动前，必须读取当前 boundary 的 Required Reads，并从正式 07 §3 取得技术栈、目录和台账规范的具体路径；不得凭旧 README 实现。 | 正式 07 §3 | 首次开工/规范变化 | 正式文档优先；暂停刷新 |
| `MEM-L2R-002` | 只有 project implementation ledger 标记的唯一 current boundary 可实现；其他 boundary 保持 `planned / wait_until_current`。 | 正式 07 §3/§6 | boundary 切换 | 修正 ledger 后继续 |
| `MEM-L2R-003` | 发现字段、DTO、状态、Port、配置、证据或 phase 缺口时，必须 `blocked / wait_design` 并回写 owning design source，不得在实现仓补 schema/default/fallback。 | 可落码性标准 | Design Gate/baseline 变化 | 停止实现、回写设计 |
| `MEM-L2R-004` | 只触碰和暂存 current boundary 的 Allowed Scope；不得清理或暂存用户和其他 agent 的既有改动。 | 台账规范 | 编辑/提交前 | 重叠即暂停回报 |
| `MEM-L2R-005` | Query 必须零写入，Job 必须有界且不修复 truth，external Unknown 必须保留 stable identity/fence 并禁止 blind retry，外部 status 不得提升 local outcome。 | 正式 03/05/06 | query/job/effect/handoff boundary | 回正式源复核 |
| `MEM-L2R-006` | 只有正式确认的 L0-core exact candidate 可作为 compile dependency；其他 sibling 保持 runtime/event/ref/adapter/fake seam，Runtime 不拥有相邻 owner truth。 | 全局裁剪/正式 03 | dependency/adapter 变化 | hard stop |
| `MEM-L2R-007` | 交给实现 agent 或进入新 baseline 前，必须按 phase/boundary 审计正式 03/05/06/07；未通过先回写设计并固定新 baseline。 | 可落码性标准/正式 07 §12 | handoff/baseline 变化 | 暂停移交 |
| `MEM-L2R-008` | 测试、artifact、report、evidence 必须来自同一 fixed run；不得使用 `latest`、cross-run、static pass、empty selector 或 blocked/fake readiness。 | 正式 05/06/07 | Test/Evidence/Handoff Gate | invalid/unavailable，保留失败 |
| `MEM-L2R-009` | 修复设计文档后必须执行经验沉淀检查，按项目归属决定新增提交或经明确授权 amend；无新增经验时最终明确记录，并输出可恢复交接说明。 | 正式 07 §11 | 每次设计修复/提交前 | 未完成则不提交 |

生成门禁：种子必须有稳定 ID、来源、触发、失效和冲突处理；文本只能逐字投影；技术栈路径只能来自 Required Reads；`MEM-L2R-007` 与 `MEM-L2R-009` 不得弱化。任一项失败则不生成永久记忆。

## 8. 当前设计门禁与上游 blocker

| ID | 状态 | 影响 | 实施计划处理 |
|---|---|---|---|
| `L2R-UP-001` | open_upstream_contract | Tools/Sandbox invocation、receipt、feedback、cleanup | typed Port + blocked/negative fake；正向 lane blocked |
| `L2R-UP-002` | open_integration_boundary | safe material producer/source/route/observed | local attempt/gap only；不宣称 delivered/observed |
| `L2R-UP-003` | schema_candidate | Core tools schema/SDK compatibility | 不复制 shared type；保持 ref |
| `L2R-UP-004` | owner_contract_pending | model provider adapter | Runtime 只拥有 intent/selection/decision；route/secret/quota/cost 禁止 |
| `L2R-UP-005` | owner_boundary_pending | durable episodic/semantic memory | working-owned；durable body/index/retention 不进入 Runtime |
| `L2R-UP-006` | schema_and_route_pending | Runtime Core/Bus/Obs shared schema | 不私造 schema/route；affected positive blocked |
| `L2R-UP-007` | implementation_readiness_absent | Sandbox/Obs real qualification | fake/adapter 设计可继续；readiness 不可声明 |
| `L2R-UP-008` | uncommitted_upstream_input | Method immutable baseline | 披露 dirty source；不得以 commit/hash 冒充 |
| `L2R-CP-001` | open | physical checkpoint atomicity/status/reconcile | Prepared/Unknown/manual fence；positive blocked |
| `L2R-ENTRY-001` | open | typed production entry/child scope | facade-only/fixture；生产 entry blocked |
| `L2R-IMPL-001` | target_repo_absent | implementation, runner, artifact/report/evidence | 首 boundary blocked；不建仓 |
| `L2R-LANG-001` | preflight_pending | Rust/toolchain compatibility | 实现前实测；不降低 baseline |
| `L2R-LANG-002` | design_source_conflict | Chinese vs English Rustdoc rule | owning formal 03 must be corrected before affected activation |

上述 blocker 不阻塞设计期的 local deterministic、negative、blocked-aware 路径设计；阻塞相应 positive qualification、实际运行、证据、验收和 readiness。

## 9. 恢复顺序与 Step 门禁

未来实现恢复顺序固定为：

```text
project_execution_ledger
  -> implementation_execution_ledger
  -> current implementation-boundary ledger
  -> exact formal/calibration Required Reads
  -> target worktree + user-owned-change audit
  -> Design / Scope / Worktree Gate
  -> code edit only inside current boundary
```

本步门禁：

| 检查 | 结论 |
|---|---|
| global standards/SOP/writing/ledger/coding/layout read set | `pass-designed` |
| upstream formal chains and dependency owner map | `pass-designed`; open seams retained |
| canonical denominator 37/177/31/9 and 12/17/12/6/6/7 | `pass` |
| target repo/toolchain/identity/run facts | `pass as absent/pending`; no positive claim |
| Core-only compile and six dependency categories | `pass-designed` |
| phase reading strategy avoids freezing stale phase IDs | `pass` |
| permanent-memory seed and mechanical gates | `pass-designed` |
| formal 03 Rustdoc conflict | `blocker: L2R-LANG-002` |
| formal 07 write / implementation ledger / skeleton creation | `forbidden until Step 13` |

```text
step_03 = completed_with_design_gate
next_allowed_action = rebuild_step_04
formal_07_write_allowed = false
implementation_repo_write_allowed = false
```
