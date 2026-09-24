# Step 12. 定义进入准则与退出准则

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 12  
> 回填章节：`05-测试方案.md` §12  
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与事实边界

| 项 | 当前值 |
|---|---|
| current_document | `05-测试方案.md` |
| current_step | Step 12 |
| current_module | `entry_exit:layered_readiness_and_exit_decision` |
| gate_status | `pass_for_step_13` |
| gate_reason | 语义 P0、controlled integration、product/release 三层进入/退出准则均已拆分为可判定条件；文档、实现、环境、数据、suite、缺陷、证据和 blocker 条件没有混淆；当前实现仓和真实依赖仍使执行层保持 `blocked/not_run`。 |
| formal_05_write_allowed | `false_until_step_15` |
| implementation_write_allowed | `false` |
| test_execution_allowed | `false` |
| commit_required | `false` |
| next_allowed_action | 创建并完成 Step 13 |

本 Step 定义准入/退出门禁，不填写实际 pass/fail、run_id、artifact、report、evidence、verdict、signoff 或 readiness。`pass_for_step_13` 只表示测试方案设计层门禁通过，不表示任何测试可执行或已通过。

## 2. 本步目标、输入与非目标

### 2.1 目标

1. 把测试开始前的文档、实现、环境、配置、数据、自动化和缺陷前置条件写成可检查清单；
2. 把 P0 semantic、controlled integration、product/release 三类退出条件分开，避免 blocked 依赖被当作 pass；
3. 明确 `not_run`、`blocked`、`pass`、`fail`、`incomplete` 和 `risk_accepted` 的决策含义；
4. 确定一票否决、未分类失败、清理失败、证据不完整和残余风险对退出的影响；
5. 为 Step 13 报告/证据归档提供可引用的准则 ID。

### 2.2 输入基线

| 输入 | 本 Step 用途 |
|---|---|
| `05_test_plan_step_08_environment_config.md` | 提供四个 profile、环境角色、依赖和 unavailable 处理。 |
| `05_test_plan_step_09_automation_gates.md` | 提供 suite、gate、脚本参数、artifact/report 合同和失败分类。 |
| `05_test_plan_step_10_nonfunctional.md` | 提供专项安全、一致性、恢复、观测、平台和性能边界。 |
| `05_test_plan_step_11_defects_retest.md` | 提供 S/A/B/R 分级、风险接受和复验要求。 |
| `00-需求文档.md` §13～§14 | 提供 NFR、AC-RUN-001～011 和禁止条件。 |
| `03-详细设计.md` §15～§17 | 提供最小测试切口、实施前置和持续 blocker。 |
| `04-配置设计.md` §9～§12 | 提供 builder/readiness、fail-fast/fail-closed、测试承接和证据边界。 |

### 2.3 非目标

- 不把文档校准完成当作实现或测试执行完成。
- 不把 `test-deterministic` semantic fake 的退出条件扩展为真实上游、生产、跨平台或 release readiness。
- 不创建测试 runner、CI job、fixture、artifact、report、evidence 或验收结论。
- 不把 `blocked` 依赖强行转成 `risk_accepted`；只有有权责任方明确接受的非 P0 residual 才可记录为接受。
- 不定义 06 的最终 verdict、VETO、signoff 格式；只提供可消费的准则和证据字段。

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 开始测试前哪些文档必须冻结？ | 本版 `00/01/02/03/04/05` 及其引用的正式对象、协议、状态、配置 profile、测试切口和 gate 合同必须有一致版本；任何待确认会改变字段/状态/owner/协议的事项必须阻止对应层执行。 |
| 哪些环境和数据必须可用？ | 语义 P0 至少需要 `test-deterministic`、固定 clock/id/digest、隔离 run namespace、完整 DS-RUN 数据族、semantic fake/controlled ports、write/call spies 和 redaction scanner；真实 slot 另需对应 authority/seam。 |
| 哪些自动化必须可运行？ | 适用层的 Contract/Domain/Service/Config/Security suites 及其 gate/check/report 合同必须能产生固定 run-scoped 输出；缺实现仓、runner、脚本或 harness 时不得开始，标 `not_run/blocked`。 |
| 退出时哪些用例必须通过？ | 所有适用 P0 TC 和专项负向断言必须是 `pass` 或明确的预期 controlled-failure pass；不能有 S 级、未分类失败、redaction/依赖/证据完整性失败；真实正向 blocked 不计通过。 |
| 哪些缺陷/风险阻断退出？ | S、未接受的 A、P0 suite fail/flaky/timeout、artifact/report pairing 缺失、raw-field finding、cleanup unknown 未保护、未授权 dependency、任何 `latest`/truth writeback/unknown replay 均阻断。 |
| 何时可以写“退出”？ | 只有在层级适用条件全部满足、实际固定 run 的 artifact/report/evidence 可回指且人工审查完成后，才可对该层记录 `exit_eligible`；本轮设计阶段只能写 `planned/blocked`。 |

## 4. 分层准则模型

| 层级 | 目标 | 可使用 profile | 退出语义 | 当前状态 |
|---|---|---|---|---|
| `T0-DESIGN` | 测试方案、追溯、用例、数据、环境、gate 和证据合同完整 | N/A | `design_ready` | 本轮已达到 |
| `T1-SEMANTIC-P0` | Runner-owned contract/domain/service/entry/job/config/security 语义可重复验证 | `test-deterministic` | P0 semantic suite 可判断 pass/fail | blocked：实现仓/runner 不存在 |
| `T2-CONTROLLED-INTEGRATION` | 经授权的单个 upstream/platform slot 受控验证 | `integration-pending` | 该 slot 的正/负/恢复证据分离 | blocked：`RUN-UP-001~008` |
| `T3-PRODUCT-REHEARSAL` | approved product-like selected run 与跨平台体验 | `product-pending` | 只能在 approved environment 和真实证据满足后讨论 | blocked：无 approved environment/artifact |
| `T4-RELEASE/ACCEPTANCE` | 供 06/治理裁决的完整固定 run 证据 | approved profile（待定） | `exit_eligible`，不是本测试方案自行 verdict | blocked：06/真实证据未生成 |

不得将 T0 的 `design_ready` 写成 T1～T4 的 `pass`。

## 5. 进入准则

### 5.1 通用进入准则（`E-GEN-*`）

- [ ] `E-GEN-001`：测试对象、18 个 P0 切口、TC、数据集、环境、suite、缺陷和证据 schema 均可由 Step 1～11 追溯；无未解释的孤儿 P0。
- [ ] `E-GEN-002`：正式 `00/01/02/03/04` 与当前 05 输入版本一致；变更不会静默改变 owner、状态、协议、配置或测试断言。
- [ ] `E-GEN-003`：所有开放 blocker（`RUN-UP-*`、`RUN-DDD-*`、`RUN-OPS-*`）已按目标层标记 `blocked/pending`，没有被默认值、fake positive 或旧文档关闭。
- [ ] `E-GEN-004`：执行责任、测试层级、profile、数据隔离键和清理责任已明确；不得共享未隔离的本地数据或使用 `latest`。
- [ ] `E-GEN-005`：没有 S 级未关闭缺陷、未分类失败或安全扫描失败；风险接受仅适用于符合 Step 11 的 B/R/受控 A。

### 5.2 T1 语义 P0 进入准则（`E-T1-*`）

- [ ] `E-T1-001`：目标实现仓存在且能被正式 test runner 装载；manifest、语言/runtime、测试命令和物理路径已经由 authority 确认（当前 `RUN-DDD-001/002` 未满足）。
- [ ] `E-T1-002`：`test-deterministic` profile 通过 strict schema、profile isolation、core store/UoW capability、clock/id/digest provider 和 fixture digest 校验。
- [ ] `E-T1-003`：所有 P0 semantic suite 的逻辑 gate/check/report 入口可使用显式 `--run-id`、`--artifact-root`、`--config-profile`，并能区分 assertion/timeout/blocked/not_run。
- [ ] `E-T1-004`：DS-RUN 基础、负向、并发、恢复、redaction 和禁止字段数据可重复构造；每个 run namespace 有可验证清理或安全残留处理。
- [ ] `E-T1-005`：write/call spies、header-first opaque fixture、redaction scanner、dependency boundary check 和 no-static-evidence check 可用。
- [ ] `E-T1-006`：执行前已确认没有待写入的实现/配置/协议变更；如有变更，必须生成新 run，不得复用旧证据。

### 5.3 T2/T3/T4 附加进入准则

| 层级 | 附加条件 |
|---|---|
| `T2` | 目标 upstream slot 有正式 public SDK/API/adapter seam、版本/authority/错误/redaction 合同、测试账号/范围和 controlled failure profile；未闭合 slot 只能执行 negative/blocked path。 |
| `T3` | 有 approved immutable Release/version、Governance authority、完整 integrity manifest、平台/资源/安全环境、Sandbox/Runtime/Observability/Archive seam、固定 run id 和清理 owner；不能以 `product-pending` 标签替代。 |
| `T4` | T1～T3 适用证据齐全，06/治理定义的验收/否决项可引用真实 artifact/report/evidence；人工/Agent 审查、风险接受和未决 blocker 均已登记。 |

## 6. 退出准则

### 6.1 T1 语义 P0 退出准则（`X-T1-*`）

- [ ] `X-T1-001`：所有适用 P0 TC 和 `NF-RUN-SEC/CONS/REC/DEP/OBS` 断言均为 `pass`；预期 controlled failure 只在对应负向 TC 内通过。
- [ ] `X-T1-002`：Contract/Domain/Service/UOW/Entry/Consumer/Job/Config/Security suite 均无 `fail`、`flaky`、`timeout`、未分类 infra failure；blocked/not_run 单独列出且不计 pass。
- [ ] `X-T1-003`：Query no-write、Consumer header-first/no-ACK、Job no-owner-repair、event-zero、Accepted/Running、Complete/Verified/Qualified、Confirmed/Cleaned 等跨轴断言全部可回指 suite artifact。
- [ ] `X-T1-004`：所有 S 级缺陷关闭；A 级若存在必须有符合 Step 11 的明确接受人/期限且不影响 P0 安全/证据；B/R 进入残余风险表。
- [ ] `X-T1-005`：每个 suite 产生固定 run-scoped `report.json`、stdout/stderr 或等价原始记录；人读报告由真实 artifact 生成，不得静态手写。
- [ ] `X-T1-006`：redaction、dependency、evidence-link 和 no-static-evidence checks 无 finding；所有报告不含 raw secret/body/path/URL/PID/port/stack。
- [ ] `X-T1-007`：run namespace、fake journal、write spy、canary、receipt 和临时 material metadata 已清理；cleanup unknown 时保护仍为 `Protected/Blocked` 且有 RecoveryCase。

### 6.2 T2/T3/T4 退出准则

| 层级 | 必须满足 | 不满足时 |
|---|---|---|
| `T2` | 对每个已授权 slot，正向/负向/Unavailable/Unknown/恢复结果均有真实 artifact/report；owner outcome 与 Runner posture 分离；未授权 slot 仍 blocked。 | 该 slot `blocked/incomplete`，不影响语义 P0，但不能宣称 integration pass。 |
| `T3` | approved environment 中 selected run 的 authority/integrity、Sandbox/Runtime lifecycle、resource/cleanup、preview/diagnosis/handoff、跨平台和安全证据均满足；无 S/A blocking。 | product/release `blocked`；不得用 fake 或 T1 结果替代。 |
| `T4` | 06/治理要求的 AC/VETO 有真实证据链、固定 run id、人工审查和残余风险接受；无 orphan/mismatch/latest/static evidence。 | 只能输出 `not_ready/blocked`，不得由 05 自行给 verdict/signoff。 |

## 7. 结果分类与决策表

| 结果 | 定义 | 是否满足退出 | 后续动作 |
|---|---|---:|---|
| `pass` | 适用 TC 断言、扫描、清理和证据链全部满足 | 是（该 TC/suite） | 进入汇总 |
| `fail` | 业务/契约/安全断言失败 | 否 | 建 S/A 缺陷，按 Step 11 复验 |
| `blocked` | 已知外部权威、实现或环境前置未闭合 | 否；保留 blocker | 记录 owner、触发条件和未执行范围 |
| `not_run` | 未启动或 harness/基础设施不能安全执行 | 否 | 修复前置后新 run；不得计 pass |
| `timeout` | 超过已授权预算且结果不完整 | 否 | 保留原始阶段和清理状态，建缺陷/风险 |
| `flaky` | 固定输入重复结果不稳定 | 否 | quarantine/issue；稳定前不退出 |
| `incomplete` | 部分 suite/证据/report/cleanup 缺失 | 否 | 补齐或重新执行；不静默合并 |
| `risk_accepted` | 明确接受的 B/R/受控 A residual | 仅可作为非阻断项 | 记录接受人、期限、触发条件；不转为 pass |

## 8. 进入/退出停审

| 审计项 | 结论 | 缺口/修正 |
|---|---|---|
| 准则是否可判定而非“基本完成” | 通过（设计层） | 每项有 ID、条件和结果分类。 |
| 语义 P0 与真实 integration/product 是否分层 | 通过 | T1/T2/T3/T4 独立，不允许 fake 升级。 |
| blocked/not_run 是否会伪造 pass | 无 | 决策表明确二者不满足退出。 |
| 缺陷、清理、redaction、证据缺口是否阻断 | 通过 | S/A、cleanup unknown、scan finding、incomplete 均阻断。 |
| 性能无来源阈值是否误阻断 | 无 | Step 10 exploratory 保持 residual，除非 authority 后置硬化。 |
| 06 是否被 05 越权裁决 | 无 | T4 只定义 evidence-ready，verdict/signoff 留 06/治理。 |

## 9. 结构化回填草稿

正式 §12 应收录：通用进入准则、T1 语义 P0 进入/退出清单、T2/T3/T4 附加条件、结果分类表和“blocked/not_run 不计通过”规则。正文不得写实际测试结果或把当前 blocker 改成退出通过。

## 10. 待确认与持续 blocker

| 项 | 影响 | 当前处理 |
|---|---|---|
| 实现仓/test runner/语言/runtime/store (`RUN-DDD-001~003`) | T1 不能实际启动 | 保持 `blocked/not_run`；不创建实现。 |
| 上游 Artifact/Governance/Sandbox/Runtime/Observability/Archive/平台/SDK seam (`RUN-UP-001~008`) | T2/T3 正向退出不可判定 | 只允许 controlled negative；正向保持 blocked。 |
| 06/治理 verdict、signoff、风险接受模板 (`RUN-DOC-002`, `RUN-OPS-002`) | T4 不能给最终裁决 | 只提供可消费条件，留 Step 13/06。 |
| 性能容量/SLO authority (`RUN-OPS-001`) | 量化退出门槛未定 | exploratory，不作为当前 gate。 |

## 11. Step 12 进入下一步门禁

- [x] 文档、环境、数据、suite、缺陷和证据的进入前置条件可检查。
- [x] T1 semantic、T2 controlled、T3 product、T4 acceptance 层级独立。
- [x] 退出条件覆盖 P0、专项、缺陷、redaction、依赖、artifact/report、清理和残余风险。
- [x] `pass/fail/blocked/not_run/timeout/flaky/incomplete/risk_accepted` 语义不混淆。
- [x] 未授权依赖、实现仓缺失和无来源阈值不会被误写成 readiness。
- [ ] 测试执行、实际缺陷、artifact、report、evidence、verdict、signoff：未发生，不作为本 Step 条件。

Step 12 完成，允许进入 Step 13；正式 `05-测试方案.md` 仍不可写。
