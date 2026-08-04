# L4-observability 07-实施计划 Step 12：实施完成判定

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 12
> 对应书写规范：`standards/document/实施计划书写规范.md` §5.12
> 回填章节：正式 `projects/L4-observability/07-实施计划.md` §12
> 文档性质：设计讨论中间产物；只定义未来实施结束、送验和验收之间的判定边界。

## 1. Step 状态

| 项目 | 当前值 |
|---|---|
| project | `L4-observability` |
| document | `07-实施计划` |
| step | `Step 12 / 实施完成判定` |
| mode | `full-restart` |
| status | `completed_current_step_12` |
| current module | `completion-layer-and-delivery-closure` |
| input baseline | current Step 01~11；正式 `00~06`；实施计划 SOP/书写规范；代码实施台账规范 |
| design gate | `pass_with_affected_and_reality_preconditions` |
| implementation handoff | `blocked_until_target_repo_and_execution_assets_exist` |
| new upstream blocker | `none` |
| inherited affected | 12 项继续保持 `open_upstream_internal`、`open_controlled`、`open_internal_affected`、`covered_conditional` 或 `design_record_closed_implementation_open` |
| target reality | `/home/aris/Projects/quantalithos-observability` 不存在；真实 runner、CI/INT/RuntimeLike、run、artifact、report、evidence 均未建立 |
| next allowed action | `continue_to_step_13` |
| current commit | 不需要；用户未要求提交 |

## 2. 本步输入与阅读记录

| 输入 | Current 用法 | 结果 |
|---|---|---|
| Step 02 范围 | 固定 P0、外围增强和非范围边界 | `FR-OBS-001~013`、`BR-OBS-001~026`、`AC-OBS-001~031`、`VF-OBS-001~010` 进入实施映射；`FR-OBS-E01~E06` 不计 P0 完成 |
| Step 04 交付物 | 固定代码、配置、测试、脚本、证据、报告和台账交付面 | 不以文件存在替代可验证完成 |
| Step 06 boundary | 固定 `PH-01~PH-08` 与 `commit-01-a` 至 `commit-08-b` | 每个 boundary 必须有真实 scope、gate、review 和交付记录 |
| Step 07 门禁 | 固定 `GATE-OBS-01~12`、99 TC、82 DS、9 suite、6 lane、3 profile、5 script/check | 设计期只保留 planned；执行期不得折叠 blocked/not_run 为 passed |
| Step 09 风险 | 固定 10 个 Spike、12 个风险、12 项 inherited affected、8 个待确认事项 | 未关闭项必须分类为 blocker、controlled、conditional、residual 或 not_evaluated |
| Step 10 控制 | 固定 pause、rollback、change、failure、recovery 规则 | 失败材料保留；不得用新 run 覆盖旧失败材料 |
| Step 11 交付 | 固定一 boundary 一 commit、review、handoff、same-run provenance 和语言边界 | 当前不生成真实 commit/hash/hand-off 结论 |
| `06-验收标准.md` | 承接最终验收入口、VETO、EVG、review/signoff 职责 | 实施计划只能判定“完成并可送验”，不能替代最终验收 |

## 3. SOP 问题回答

### 3.1 本轮需求覆盖如何判定

需求覆盖以 current `00-需求文档.md` 的 P0 范围和 `06-验收标准.md` 的 exact acceptance contract 为准：

- 五个核心闭环 `C-OBS-1~5` 必须各有 phase、boundary、测试门禁和未来验收入口。
- 核心 `FR-OBS-001~013`、`BR-OBS-001~026`、`NFR-OBS-001~024`、`AC-OBS-001~031` 和 `VF-OBS-001~010` 必须全部可追溯。
- 60 个 exact protocol、27 个正式 state owner 和 1 个技术协调状态必须在实施边界中有归属；设计映射完成不等于实现完成。
- `FR-OBS-E01~E06`、生产容量/SLO、外部产品深度绑定和真实验收签署只能作为 future、selected scope 或 residual，不得反向扩大 P0。

### 3.2 交付物是否全部完成

只有当 Step 04 的代码、协议、运行绑定、配置、测试、scripts、raw artifact、run report、acceptance input、review input 和实施台账均有对应真实交付记录，且每个 boundary 的 Commit Gate/Handoff Gate 通过，才可称为“实现完成”。设计仓中存在计划文件、空目录、模板或 planned skeleton 不能证明交付完成。

### 3.3 测试门禁和验收门禁如何区分

实施完成要求 Step 07 的 required blocking gate 有真实来源，且没有 hard redline failure；送验就绪还要求 evidence/report/handoff/review 输入完整。最终 `通过`、`有条件通过` 或 `不通过` 仍由 `06-验收标准.md` 的授权裁决流程产生。实现 agent、测试脚本和本实施计划都不得代填最终 verdict 或 signoff。

### 3.4 风险、Spike 和待确认事项如何处理

- P0 truth、redaction、no-write、dependency、evidence provenance、required lane、字段/DTO/state/phase closure 的未完成项是 blocker。
- 12 项 inherited affected 必须保留 exact ID、状态、owner、截止点/触发条件和禁止的正向声明；Observability 不得自行关闭。
- P1/P2/future 或未冻结数字阈值可以进入 residual，但必须有 owner、acceptor（适用时）、action 和 `deadline_or_trigger`。
- Open question 到达对应 boundary 截止点仍未关闭时，相关 boundary 不得进入 `implement` 或 `commit`。

### 3.5 证据和报告如何证明完成

证据链必须从同一真实 `<run_id>` 下的 `artifacts/test/<run_id>` 生成 `reports/runs/<run_id>`，再形成 `reports/acceptance` 与 `reports/review` 的审查输入。禁止 `latest`、跨 run 拼接、静态 passed、伪造 evidence alias、空 artifact 或手写 verdict。raw artifact 只能证明机器原始输出存在，不能替代人类可读 report、review 或验收裁决。

### 3.6 设计闭环如何在实施完成时复核

每个 phase/boundary 必须再次核对字段、DTO、state、ref identity、validation truth、metadata/idempotency、UoW/version、projection/rebuild source、artifact materialization 和 phase boundary。发现任何冲突，必须按 Step 10 回写正确真相源并固定新 design baseline；不得用实现端临时 schema、alias、默认状态或字符串 ref 继续。

## 4. 当前材料问题诊断与历史处置

| 材料 | 问题 | 处置 |
|---|---|---|
| 旧正式 `07-实施计划.md` | 使用旧编号、旧阶段和未区分实施/验收的完成语义 | 作为 `historical_material`；正式正文由 Step 13 重新装配 |
| 旧 Step 12 | 只写通用“完成/可送验”表，未固定 Observability 的 31 AC、10 VF、9 EVG、99/82/9 和 12 项 affected 关系 | 删除旧结构，按 current 输入重建 |
| 旧 implementation ledger/boundaries | 可能把 planned、current 和执行事实混用 | Step 13 全部重建；当前不激活任何实现 boundary |
| `05-测试方案.md` | 只定义未来测试和证据生产合同，当前没有真实 run | 保留 planned/not_run/not_evaluated 语义，不写结果 |
| `06-验收标准.md` | 最终裁决属于验收职责，且当前 `final decision/signoff=not_evaluated` | Step 12 只定义送验条件，不能替代验收 |
| README/历史性能数字 | 包含产品、存储、P95、保留期限等未冻结假设 | 仅作历史差异材料；不进入完成判定 |

## 5. 改动前后对比

| 项 | 旧口径 | Current Step 12 口径 | 影响 |
|---|---|---|---|
| 完成语义 | “实现完成”和“验收通过”容易混写 | 拆成设计计划完成、实现完成、送验就绪、最终验收四层 | 防止实现计划代签验收 |
| 需求覆盖 | 只写少量功能摘要 | 固定核心 FR/BR/NFR/AC/VF 与 60 protocol/27+1 state 的追溯要求 | 防止漏项和 family 摘要替代 exact closure |
| 证据 | raw、report、evidence、verdict 可能混用 | run-scoped raw -> report -> acceptance/review input；final decision 单独归 `06` | 保持 provenance 和职责边界 |
| 未完成项 | 口头延期或笼统 residual | 按 blocker、controlled、conditional、residual、not_evaluated 分类并记录 owner/trigger | 可恢复、可审计 |
| 当前状态 | 旧资产看似可执行 | 目标仓、runner、真实 evidence 明确为未建立 | 不伪造 ready/pass |

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 只用测试通过作为完成条件 | 不采用 | 不能覆盖 VETO、evidence provenance、review 和设计闭环 |
| 将实施完成等同最终验收通过 | 不采用 | 越过 `06` 的独立裁决和签署职责 |
| 只声明“可送验”而不要求证据闭环 | 不采用 | 送验材料可能不可裁决，无法审查 same-run provenance |
| 四层完成模型 | 采用 | 能明确设计阶段、实现交付、送验材料和最终裁决的不同权威 |
| 用风险接受关闭 P0 hard redline | 不采用 | raw/secret、source truth write、non-core dependency、static evidence、VF 和设计 blocker 不可风险接受 |

## 7. 结构化中间产物

### 7.1 四层完成状态模型

| 层级 | 责任主体 | 进入条件 | 必须具备 | 允许状态 | 当前设计期状态 |
|---|---|---|---|---|---|
| `PLAN-DESIGN-COMPLETE` 设计计划完成 | 设计者 | Step 01~12 current 产物完整，正式 07 可装配 | phase/boundary、gate、风险、控制、完成判定和来源闭合 | `complete_with_preconditions` | `pass_with_affected_and_reality_preconditions` |
| `IMPLEMENTATION-COMPLETE` 实现完成 | 实现负责人 | 16 boundary 完成并逐 boundary 通过 Commit/Handoff Gate | 实现、测试、review、ledger、失败处理和 scope 证据完整 | `complete` / `conditional` / `blocked` | `not_evaluated` |
| `HANDOFF-READY` 送验就绪 | 测试/交付负责人 | 实现完成且 required evidence/report/review 输入齐全 | same-run raw/report、99 TC join、82 DS、9 suite、EVG、handoff/VF/risk/open-issues 输入 | `ready` / `blocked` / `not_adjudicable` | `not_evaluated` |
| `FINAL-ACCEPTANCE` 最终验收 | `06` 授权验收角色 | 送验输入可裁决，执行 `06` 的 entry/positive/VF/defect/risk 规则 | 真实 baseline、run、证据、审查和签署权限 | `通过` / `有条件通过` / `不通过` | `not_evaluated` |

规则：上层状态不能由下层的设计文件存在自动推导；`PLAN-DESIGN-COMPLETE` 不等于 `IMPLEMENTATION-COMPLETE`，`HANDOFF-READY` 不等于 `FINAL-ACCEPTANCE`。

### 7.2 实施完成判定表

| 判定项 | 完成标准 | 必须来源 | 设计期结论 |
|---|---|---|---|
| P0 范围覆盖 | 核心闭环、FR/BR/NFR/AC/VF 和 exact protocol/state 均有实现映射和门禁入口 | Step 02/05/06/07；正式 `00/03/05/06` | `planned` |
| 交付物完成 | Step 04 交付面全部有真实文件、行为和检查；非范围未混入 | Step 04；boundary ledger；实现 diff | `not_evaluated` |
| 16 boundary 完成 | `commit-01-a` 至 `commit-08-b` 各自 scope、checks、review、提交和 handoff 完整 | Step 06/11；16 boundary ledger | `not_evaluated` |
| 阶段门禁 | `GATE-OBS-01~12` 适用项有真实可回链输出；失败状态未被折叠 | Step 07；`reports/runs/<run_id>` | `not_evaluated` |
| 99 TC/82 DS/9 suite | 每个 TC 有唯一 primary suite、exact DS、candidate linkage 和 same-run raw/report | `05`；Step 07；run manifest | `not_evaluated` |
| 验收红线 | `VF-OBS-001~010` 逐项有真实、可复核的结果；hard failure 未被风险接受 | `06`；`reports/acceptance/veto-checklist.md` | `not_evaluated` |
| EVG 完整性 | `EVG-OBS-001~009` 的输入、路径、digest、审查和状态完整 | `06`；Step 07/11 | `not_evaluated` |
| 缺陷和风险 | P0 blocker/S 级已关闭；允许 residual 有 owner/acceptor/action/trigger | `reports/acceptance/open-issues.md`、`risk-acceptance.md` | `not_evaluated` |
| 设计闭环 | 所有 boundary 的字段、DTO、state、port、version、outbox、job、projection、artifact、phase boundary 无 blocker | Step 06/10；design closure audit | `not_evaluated` |
| 交付审查 | handoff、review、affected register 与选定 run 一致，并由责任角色审查 | `reports/acceptance/*`、`reports/review/*` | `not_evaluated` |

### 7.3 设计闭环审计矩阵

| Phase | Boundary | 复核重点 | 实施完成要求 | 当前状态 |
|---|---|---|---|---|
| `PH-01` | `commit-01-a` | target/workspace/package/crate、only-core dependency、目录 | metadata、format、compile、dependency gate 有真实输出 | `not_evaluated` |
| `PH-01` | `commit-01-b` | strict config、profile、canonical roots、script input | parse、path、no-latest、negative config gate 有真实输出 | `not_evaluated` |
| `PH-02` | `commit-02-a` | public ref/DTO/protocol/error、secondary owner、body-free | contract roundtrip、owner/use/static gate 有真实输出 | `not_evaluated` |
| `PH-02` | `commit-02-b` | domain object/state/policy/history、finite transition | state/factory/policy/error tests 有真实输出 | `not_evaluated` |
| `PH-03` | `commit-03-a` | intake/redaction/correlation、UoW、idempotency、recovery | service/UoW/redaction gate 有真实输出 | `not_evaluated` |
| `PH-03` | `commit-03-b` | entry pre-parse、consumer binding、completion/outbox | entry capability and controlled affected gate 有真实输出 | `not_evaluated` |
| `PH-04` | `commit-04-a` | audit/evidence/gap append、snapshot、cursor、no-write | repository/audit/body-free gate 有真实输出 | `not_evaluated` |
| `PH-04` | `commit-04-b` | Q05/Q06 read provenance、visibility、strict no-write | query/read provenance gate 有真实输出 | `not_evaluated` |
| `PH-05` | `commit-05-a` | log/metric/trace schema、allowlist、projection/rebuild source | telemetry/metric/redaction gate 有真实输出 | `not_evaluated` |
| `PH-05` | `commit-05-b` | Q01~Q14、diagnostic、freshness/degraded、writer capability | exhaustive query/no-write gate 有真实输出 | `not_evaluated` |
| `PH-06` | `commit-06-a` | handoff/evidence input、authenticity hint、retention protection | immutable/no-verdict/protection gate 有真实输出 | `not_evaluated` |
| `PH-06` | `commit-06-b` | J01~J09、claim/fence/UoW、rebuild、external phase | recovery/unknown/no-write gate 有真实输出 | `not_evaluated` |
| `PH-07` | `commit-07-a` | config assembly、facade assignment、registrar、activation | profile/13-stage/least-authority gate 有真实输出 | `not_evaluated` |
| `PH-07` | `commit-07-b` | redaction/metric/dependency/report scanners | all static checks and provenance inputs有真实输出 | `not_evaluated` |
| `PH-08` | `commit-08-a` | 99/82/9 manifest、raw artifact、same-run report | runner、join、report audit 有真实输出 | `not_evaluated` |
| `PH-08` | `commit-08-b` | acceptance handoff、VF、risk、review、open issues | review input complete；不自动 verdict/signoff | `not_evaluated` |

### 7.4 交付证据项

| 证据项 | 固定路径 | 完成标准 | 当前设计期状态 |
|---|---|---|---|
| raw artifact | `artifacts/test/<run_id>` | 由真实 invocation 产生 meta、manifest、suite/case/gate raw；失败材料保留 | `not_evaluated` |
| run report | `reports/runs/<run_id>` | 仅由同 run raw 生成 summary、suite reports、evidence-index、gate-results 和三项 check report | `not_evaluated` |
| acceptance handoff | `reports/acceptance/handoff.md` | 包含 baseline、scope、run、blocked/residual/open issue，并经责任角色审查 | `not_evaluated` |
| VETO checklist | `reports/acceptance/veto-checklist.md` | `VF-OBS-001~010` 逐项有真实证据入口和审查状态 | `not_evaluated` |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | 仅在允许 residual 时填写 owner、acceptor、理由、action、deadline_or_trigger | `not_evaluated` / `not_applicable` |
| open issues | `reports/acceptance/open-issues.md` | blocker、affected、defect、retest 和关闭/接受状态可追溯 | `not_evaluated` |
| review notes | `reports/review/` | 人工/Agent review 输入独立于机器 report，不产生 verdict | `not_evaluated` |
| design closure audit | `reports/acceptance/design-closure-audit.md` 或 handoff section | phase/boundary 复核无未修 blocker | `not_evaluated` |

### 7.5 未完成项处理表

| 未完成项 | 处理分类 | 是否允许宣称实施完成 |
|---|---|---|
| P0 protocol/object/state/service/job 缺失 | blocker；回到对应 boundary 并补实现/门禁 | 否 |
| P0 blocking gate failed、required lane blocked/not_run | blocker 或不可送验；保留原始失败/不可用材料 | 否 |
| `VF-OBS-001~010` 命中或 hard redline finding | blocker；不可用风险接受替代 | 否 |
| raw body/secret/source truth write/non-core dependency/static evidence/latest/cross-run join | blocker；修复后新 run/新审查 | 否 |
| 字段、DTO、state、ref、source、metadata、UoW、phase boundary 冲突 | design blocker；回写 `03/04/05/06/07` 后固定新 baseline | 否 |
| inherited affected positive 未闭合 | `open/controlled/conditional`；保留受影响路径阻塞 | 不得宣称相关 positive 完成 |
| P1/P2/future 能力未实现 | residual/future；记录 owner、acceptor（适用时）、action、trigger | 可，但不计 P0 |
| 无来源的性能、容量、SLO、retention 数字未冻结 | `not_evaluated` / residual | 可，但不得宣称数字通过 |
| report 可读性或 review 输入缺陷且不影响真实性 | B 级修复或正式风险接受 | 依 `06` 裁决，不可口头放行 |

### 7.6 最终交付清单（设计期合同）

| 交付面 | 真实完成要求 | 当前状态 |
|---|---|---|
| 七 role crate workspace | target repo 中可核验 package/crate/name/dependency 和 compile 结果 | `not_evaluated` |
| contracts/domain/application/infra/api/worker/jobs | 按 16 boundary 实现并通过适用 suite/check | `not_evaluated` |
| config/runtime/adapter | 三 profile、13-stage complete-or-error、合法 lane 和 least-authority activation | `not_evaluated` |
| protocol/state/flow | 60 exact protocol、27+1 state、UoW/idempotency/recovery/no-write 逐项可回链 | `not_evaluated` |
| tests/scripts/checks | 99 TC、82 DS、9 suite、5 script/check 的真实输出可回链 | `not_evaluated` |
| artifacts/reports | same-run raw/report/candidate linkage，失败状态保留 | `not_evaluated` |
| acceptance/review input | handoff/VF/risk/open issues/review 输入完整且未代签 | `not_evaluated` |
| implementation ledger | 项目台账和 16 boundary 台账真实记录当前实施状态 | `not_evaluated` |

## 8. 回填草稿

正式 `07` §12 只回填以下收口规则：

> 本实施计划区分设计计划完成、实现完成、送验就绪和最终验收。设计计划完成只表示实施路径、phase、boundary、门禁、风险、暂停/回退和交付规则已收稳；实现完成必须由 16 个 boundary 的真实实现、测试、review 和台账证据证明；送验就绪还必须具备同一 `<run_id>` 的 raw artifact、run report、99 TC/82 DS/9 suite 追溯、EVG 输入、handoff 和 review 材料；最终 `通过`、`有条件通过` 或 `不通过` 由 `06-验收标准.md` 的授权验收流程裁决。当前 target repo、runner、真实 run/artifact/report/evidence、implementation commit 和 signoff 均未建立，不在设计阶段填写。

实施完成不得使用“基本完成”。P0 blocker、VETO、hard redline、设计闭环冲突、source truth 写入、静态证据、错误 run 或未关闭的 required lane 不得被风险接受为完成；P1/P2/future 只能以明确 owner、action 和 `deadline_or_trigger` 进入 residual。

## 9. 待确认事项

| 编号 | 事项 | 当前处理 | 截止点 |
|---|---|---|---|
| `OQ-OBS-12-001` | 实施完成是否允许带 residual 送验 | 只按 `06` 的 conditional 规则，由授权验收角色裁决；实施 agent 不自行放行 | PH-08 / acceptance handoff |
| `OQ-OBS-12-002` | design closure audit 独立报告还是 handoff 子节 | 两种路径均可，但必须有唯一 same-run/设计 baseline 入口 | `commit-08-b` 前 |
| `OQ-OBS-12-003` | 实际 reviewer、测试负责人、验收负责人 | 在真实 handoff 前具名并记录 authority scope | PH-08 |
| `OQ-OBS-12-004` | 12 项 affected 的上游 closure 时间 | 未确认前保持原状态，不改变 positive gate | 对应 boundary 开工前 |

## 10. Step 自检与进入下一步条件

| 检查项 | 结论 |
|---|---|
| 是否逐项回答 SOP 问题 | pass |
| 是否区分设计、实现、送验和最终验收责任 | pass |
| 是否承接 current 31 AC/24 NFR/10 VF/9 EVG、99 TC/82 DS/9 suite | pass |
| 是否固定 16 boundary 的完成复核入口 | pass |
| 是否明确 raw/report/same-run/review 真实性 | pass |
| 是否把 P0 hard blocker 与 residual 分开 | pass |
| 是否将 12 项 inherited affected 自行关闭 | no |
| 是否伪造 commit/hash/run/artifact/report/evidence/verdict/signoff | no |
| new upstream blocker | none |
| gate_status | `pass_with_affected_and_reality_preconditions` |
| next_allowed_action | `continue_to_step_13` |

## 11. 参考

- `standards/document/实施计划讨论流程_SOP.md` Step 12
- `standards/document/实施计划书写规范.md` §5.12
- `standards/document/代码实施台账与门禁规范.md`
- `standards/document/设计真相源闭环与可落码性标准.md` §九
- `projects/L4-observability/design-calibration/07_implementation_plan_step_02_scope.md`
- `projects/L4-observability/design-calibration/07_implementation_plan_step_04_objects_deliverables.md`
- `projects/L4-observability/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md`
- `projects/L4-observability/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md`
- `projects/L4-observability/design-calibration/07_implementation_plan_step_09_spikes_risks_open_questions.md`
- `projects/L4-observability/design-calibration/07_implementation_plan_step_10_rollback_pause_change_control.md`
- `projects/L4-observability/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md`
- `projects/L4-observability/05-测试方案.md`
- `projects/L4-observability/06-验收标准.md`
