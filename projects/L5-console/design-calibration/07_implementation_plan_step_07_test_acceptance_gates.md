# Step 7. 嵌入测试与验收门禁

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 7
> 回填章节：`07-实施计划.md` §7 测试与验收门禁嵌入
> 粒度参考：`projects/L1-governance/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md`
> 执行模式：`full-restart + single-agent-serial`

## 1. Step 状态与开工确认

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 7 · 嵌入测试与验收门禁 |
| 当前状态 | `done / pass / self_reviewed`（设计层完成；`step_stop_review`） |
| 输入基线 | Step 5 `PH-01～PH-08`；Step 6 `commit-01-a～commit-08-c`；正式 `03/05/06` |
| 正式 07 写入 | `false`；Step 13 full-restart 前不得创建或修改正式文件 |
| 实现移交 | `blocked / wait_design`；目标仓、exact owner/SDK/host contract 和 immutable baseline 未固定 |
| 本步输出 | phase 门禁矩阵、22 个 boundary 门禁矩阵、证据/报告规则、失败姿态、停审和跨门禁审计 |
| 下一动作 | 停在 Step 7 审查点，等待用户明确授权 Step 8；不自动推进 |

### 1.1 Step 开工确认

| 检查项 | 记录 |
|---|---|
| 已读取通用规范 | yes：设计文档编写通则、中间产物规范、设计真相源闭环与可落码性标准 |
| 已读取文档类型规范 | yes：实施计划讨论流程 SOP、实施计划书写规范、代码实施台账与门禁规范 |
| 已读取项目输入 | yes：项目执行台账、07 flow、Step 5/6 产物、正式 `03`/`05`/`06` 相关章节、L1-governance Step 7 参考 |
| 当前模式 | `full-restart`；旧文档只作 historical_material/污染审计，不继承 gate、阈值或框架 |
| 模块骨架 | `done`：PH-01～PH-08；boundary `commit-01-a～commit-08-c` |
| 项目级进入条件 | `pass`（仅允许写当前 calibration；不允许实现/测试执行/正式 07） |

本 Step 的“通过”只表示门禁设计在文档层可审查；不会产生 suite run、artifact、report、EV instance、verdict、signoff 或 readiness。

## 2. 本步输入与权威顺序

| 输入 | 读取范围 | 本步用途 | 当前事实 |
|---|---|---|---|
| Step 5 阶段表 | `07_implementation_plan_step_05_phases_dependencies.md` §7～§12 | 固定八个 phase 的可验证增量和先后关系 | 设计层已通过；实现未开始 |
| Step 6 任务/边界 | `07_implementation_plan_step_06_tasks_commits.md` §7～§16 | 将每个 boundary 绑定提交前测试、验收、证据和失败动作 | 22 个 planned boundary；无真实 commit |
| 详细设计 | `03-详细设计.md` §7～§15、`03_ddd_step_16_test_slices.md` | 提供 5 Command、16 Query、1 conditional consumer、状态、并发、诊断和测试切口 | Query zero-write；唯一潜在 owner write 为 `OwnerCommandPort.submit` |
| 测试方案 | `05-测试方案.md` §9～§14 及 Step 6/9/10/13/14 | 提供 suite、TC、脚本、artifact/report 路径、失败/回归规则 | 全部 `planned / not_created`；未执行 |
| 验收标准 | `06-验收标准.md` §5～§14 | 提供 AC、AR、IFG、ST、TX、CC、NFR、EV、VETO 和裁决上限 | evidence instance=0；实际生命周期 `not_entered / blocked_by_missing_baseline` |
| 可落码性标准 | `设计真相源闭环与可落码性标准.md` §9.1～§9.2 | 约束每个 phase/boundary 的字段、DTO、状态、ref、artifact 和 phase closure 复核 | 缺口必须 `wait_design`；实现者不得补 schema |
| 粒度参考 | `projects/L1-governance/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` §7 | 借用 phase/boundary 门禁矩阵、报告审查和跨门禁审计结构 | 不迁移 Governance truth、Rust、DB、Event、Job、outbox |

权威顺序固定为：正式 `03/05/06` → 当前 Step 5/6 calibration → 本 Step 的门禁编排。若正式文档与 calibration 冲突，以正式文档为准；仍不清楚则暂停并回写设计，不由本 Step 发明新 AC、状态、阈值或 owner contract。

## 3. SOP 问题回答

| 问题 | 本项目结论 |
|---|---|
| 1. 每个阶段应执行哪些测试切口？ | PH-01 执行 package/config/architecture/path 的 planned structural checks；PH-02 执行 CTX/NAV/SEC/A11Y；PH-03 执行 VIEW/QUERY/ADAPTER/no-write；PH-04 执行 INTENT/STATE/CONSISTENCY；PH-05 执行 TOPIC/partition/isolation；PH-06 执行 RECOVERY/A11Y/DIAG/SEC；PH-07 执行 ADAPTER/consumer/invalidation；PH-08 执行 release safety、pairing、redaction、dependency、no-static-evidence 和 handoff 审计。 |
| 2. 哪些阶段必须对齐 AC？ | 所有涉及外部可见行为、状态转换、数据一致性或跨仓边界的 phase 都绑定正式 AC；PH-01 绑定结构性 `AC-NFR-003/004/005`，PH-02～PH-07 绑定相应 `AC-CON/AC-FR/AC-NFR`，PH-08 绑定 `AC-CON-007`、全部适用 NFR 和 EV 资格。 |
| 3. 每个门禁需要什么证据？ | 未来执行时必须在同一显式 `<run_id>` 下产生 raw suite artifact、suite report、gate status、case refs、failure/blocker reason 和 digest；无真实 run 时只保留 planned path，不能生成 evidence instance。 |
| 4. 门禁失败能否继续？ | P0 blocking gate、S 级红线、VETO、redaction、dependency、pairing 或 no-static-evidence 失败均不得提交或进入下一 phase；仅 selected/P1 环境不可用可记录 residual，不能贡献 P0 pass。 |
| 5. 哪些可自动化、哪些需人工？ | suite、结构扫描、redaction、pairing、dependency、no-static-evidence 必须自动化；`reports/acceptance/*`、release summary、open issues、risk 草稿可脚本生成初稿，但必须由人或 Agent 审查，不能自动写 verdict/signoff/readiness。 |
| 6. 哪些 VETO 要前置规避？ | `VETO-CON-001～007` 全部从 PH-01 起前置；重点是第二 truth/旁路依赖、访问绕过、unknown replay、forbidden body、客户端推导业务结论、语义可访问性断裂和 owner failure 扩散。静态 evidence/VETO pass 属证据完整性 S/送验无效，不新增第八项产品 VETO。 |
| 7. 每个阶段调用哪些脚本？ | 规划使用 `scripts/gates/run_console_gate.sh`、`scripts/gates/run_console_release_gate.sh`、`scripts/gates/run_console_selected_gate.sh`，以及 `scripts/checks/check_console_architecture.sh`、`check_console_redaction.sh`、`check_console_report_pairing.sh`、`check_no_static_evidence.sh`；具体 CLI 仍待目标仓 runner authority。 |
| 8. 每个阶段输出哪些 artifact？ | 统一为 `artifacts/test/<run_id>/suites/<suite>/` 及其 case/manifest/raw 附件；PH-08 另需 gate summary、evidence index 和 release 输入。目录只是 future contract，当前不存在。 |
| 9. 哪些阶段生成 run report？ | PH-01 可生成 dry-run/结构报告；PH-02～PH-07 生成 targeted suite reports；PH-08 必须生成 `reports/runs/<run_id>/` 全套报告和 `reports/acceptance/*` 草稿。 |
| 10. 哪些阶段生成 acceptance reports？ | 只有 PH-08 生成或更新 `handoff.md`、`veto-checklist.md`、`risk-acceptance.md`、`open-issues.md`；早期阶段不得写验收 verdict 或 signoff。 |
| 11. 哪些报告需人工审查？ | handoff、VETO checklist、risk/open-issues、release summary、evidence index 的追溯争议必须审查；raw artifact 和 suite report 可自动生成，但来源、失败姿态和配对审计仍须有人/Agent确认。 |
| 12. 每个 boundary 提交前执行什么？ | §7.4 的 22 行 boundary 矩阵逐一给出 suite/check、TC、AC/AR/IFG/ST/TX/CC/VETO 关联、artifact/report、失败动作和 Commit/Handoff Gate；任何未执行项只写 pending。 |
| 13. 是否存在 phase 有门禁但 boundary 无门禁？ | 设计上不允许。每个 `commit-01-a～commit-08-c` 均有至少一个提交前 check；文档/骨架 boundary 也必须执行 diff/path/dry-run 类结构检查，不能以“无业务代码”跳过。 |
| 14. 门禁完成后是否停审？ | 是。每个 phase、每个 boundary 都检查覆盖增量、artifact/report 归属、失败姿态、AC/VETO 风险、redaction 和人工审查责任；设计层停审不等于执行通过。 |
| 15. 全部门禁后的跨门禁审计？ | 必须审计 8 phase、22 boundary 的重复/遗漏、P0/selected 分离、run/artifact/report pairing、EV 候选来源、VETO 覆盖、失败历史保留和报告审查责任；本 Step 完成后给出跨门禁结论。 |

## 4. 当前材料问题诊断

| 问题 | 风险 | 本 Step 修正 |
|---|---|---|
| Step 6 已有 planned check 名称，但未逐 phase 映射 TC/AC/EV/VETO | 实施者可能只跑命令，不知道失败如何影响交付 | 建立 PH-01～PH-08 阶段门禁矩阵，逐项绑定正式编号和失败动作 |
| 05 的 suite/TC 是全局测试方案 | boundary 级提交无法判定最小验证集和证据归属 | 建立 22 行 boundary 门禁矩阵，区分 blocking、conditional、disabled 和 selected |
| 06 的证据、VETO 和风险接受集中在最终阶段 | 早期可能产生不可追溯的“通过”草稿 | 从 PH-01 前置 pairing/redaction/dependency/no-static 结构检查，PH-08 才生成正式候选/交接草稿 |
| 旧 Governance 参考含服务端 Event/Job/outbox/projection | 复制会制造 Console 不存在的协议或 truth | 仅保留矩阵粒度；Console 行统一写 0 Event/0 Job、Query zero-write 和 forbidden scope |
| 目标仓、runner、owner positive contract 未固定 | 具体命令和正向集成会被误写成可执行 | 所有命令/path/status 标为 planned；positive 只在 authority 到达后解锁 |
| selected browser/AT、量化和 production sink 未选择 | 容易把 sample 或 semantic pass 写成兼容/readiness | 只允许 structural/semantic P0；selected unavailable 记 residual，不给数值 verdict |

## 5. 改动前后对比

| 项 | 本 Step 前 | 本 Step 后 | 收口目的 |
|---|---|---|---|
| 阶段门禁 | phase 只有能力和大致 suite | 8 phase 均有测试、验收、脚本、artifact、report、失败处理 | 阶段完成可审查 |
| 提交门禁 | boundary 有 planned check，但映射不完整 | 22 boundary 各自有 TC/AC/红线/证据/失败姿态 | 防止无证据提交 |
| 证据成熟度 | 可能把 candidate 与 EV 混用 | raw → report → candidate → formal EV 严格分层 | 防静态 evidence |
| 验收责任 | PH-08 末端汇总 | 早期生成事实报告，PH-08 由人/Agent审查 handoff/VETO/risk | 防自动裁决 |
| 失败处理 | 失败动作分散在 05/06 | 统一 `blocked / fix_gate_failure / wait_design / residual` 语义 | 防止失败后继续推进 |
| Console 边界 | 参考项目可能带服务端测试模型 | 明确 0 Event/0 Job、无 DB/repository/projection/outbox/worker | 保持 ownership 红线 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 每个 boundary 直接生成正式 EV | 追溯看似最细 | 过早固定 run/证据，容易静态伪造 | 不采用；仅保留 future candidate slot |
| 只在 PH-08 执行全部测试 | 结构简单 | 无法及时阻断状态、访问、redaction 和 dependency 红线 | 不采用；P0 gate 前置 |
| 每个 phase 只绑定一个总 suite | 表格短 | 无法覆盖跨模块风险和失败归属 | 不采用；按 suite/TC family 分层 |
| 每个 boundary 绑定最小 blocking suite，PH-08 汇总 | 可独立 review、回退和追溯；不提前裁决 | 矩阵较长，需维护映射 | 采用 |
| 复制 Governance 的 Cargo/worker/outbox 门禁 | 可直接借用旧表 | 与 TypeScript 客户端 ownership 冲突 | 不采用；仅借用结构和停审方法 |
| 将 selected browser/owner/quantitative 当 P0 | 能覆盖更多正向能力 | authority 未定会伪造 readiness | 不采用；保留 conditional/residual |

## 7. 结构化中间产物

### 7.1 门禁编号、状态和路径约定

本 Step 使用 `GATE-01`～`GATE-08` 表示八个 phase 的 planned gate bundle；它们不是新的验收标准，不替代 `AC-*`、`AR-*`、`IFG-*`、`ST-*`、`TX-*`、`CC-*`、`NFR-*` 或 `VETO-*`。

| 状态 | 含义 | 允许的下一动作 |
|---|---|---|
| `planned` | 设计了门禁但没有执行实例 | 等待目标仓/runner/baseline；不得写 pass |
| `pending` | 当前 boundary 已打开但证据尚未齐全 | 补执行或补配对，不得提交 |
| `pass` | 未来真实 run 的适用 gate 已通过且有证据 | 仅在实现台账中允许下一动作；本 Step 不产生 |
| `blocked` | 设计、环境、依赖或门禁失败 | `wait_design`、`fix_gate_failure` 或 handoff |
| `not_applicable` | 该 gate 对当前 boundary 不适用 | 必须写原因；不能默认为成功 |
| `residual` | selected/P1 能力未启用或环境不可用 | 不贡献 P0 pass；记录 owner/trigger |

固定输出根：

```text
artifacts/test/<run_id>/
  suites/<suite>/
reports/runs/<run_id>/
reports/acceptance/
reports/review/
```

`<run_id>` 必须显式且不可变；禁止 `latest`、跨 run 拼接、手写 EV/VETO pass、删除失败 run 或把 report 当 raw artifact。脚本计划路径为 `scripts/gates/*`、`scripts/checks/*`、`scripts/reports/*`；当前目标仓不存在，所有路径仍 `planned / not_created`。

### 7.2 通用门禁执行顺序

```text
Design/Scope Gate
  -> read current boundary ledger
  -> run deterministic test/check slice
  -> materialize raw artifact under the same run_id
  -> generate paired report
  -> redaction + dependency + pairing/no-static checks
  -> map AC/AR/IFG/ST/TX/CC/VETO references
  -> human/Agent review where required
  -> Commit Gate / Handoff Gate
```

关键说明：

- 图表达每个 boundary 的“测试事实→报告→审查→提交”顺序，不表达 owner 服务端内部处理。
- Query、diagnostic、a11y、disabled consumer 的 side path 不得写 owner truth 或把本地姿态提升为 formal 状态。
- raw artifact、report、candidate、formal EV、acceptance verdict 是不同成熟度；任何缺 source/pair/digest 的对象都不能升级。

### 7.3 失败处理总则

| 失败类型 | 是否可继续 | 处理动作 |
|---|---|---|
| package/type/config/architecture static failure | 否 | 停止当前 boundary；修复或回写设计后重跑同一 gate |
| P0 suite、state、Query no-write、redaction、dependency failure | 否 | 保留失败 run；创建/更新 defect；不得提交或风险接受 |
| AC/VETO 关联的安全姿态失败 | 否 | 按正式 06 映射为 P0/S/VETO；受影响 boundary 全量复验 |
| report 缺 raw、run mismatch、orphan、缺 digest | 否 | 修复生成/配对链；不得手写补 report/EV |
| selected browser/AT、owner positive、quantitative unavailable | 可继续主链，但不计 P0 pass | 标 `residual / not_run_environment_unavailable`，保持 disabled/blocked/read-only |
| design contract、scope、state、ref、carrier 或 host 缺口 | 否 | `wait_design`；回写正式真相源并固定新 baseline，不能由实现补 schema |
| flaky/timeout/runner/config failure | 否（P0） | 保留失败材料；按 05 复验规则使用新 run_id，不覆盖历史 |

### 7.4 Phase 门禁矩阵

| Phase | Planned 测试门禁 / TC 切口 | 验收与红线关联 | Planned 脚本 / artifact | report | 失败与进入条件 |
|---|---|---|---|---|---|
| `PH-01` | `console-pure-contract`（CONFIG/STATE 基础）；`console-config-redline`；`console-architecture-static`（`TC-CONFIG-001～011`、`TC-ARCH-001～004`） | `AC-NFR-003/004/005`；`AR-CON-002/003/005/008/012`；`IFG-CON-004/005/007`；`VETO-CON-001/004` 前置 | `run_console_gate.sh` dry-run；`check_console_architecture.sh`；future raw `artifacts/test/<run_id>/suites/{console-pure-contract,console-config-redline,console-architecture-static}/` | targeted config/dependency/architecture reports | 任一结构/配置/依赖失败不得进入 PH-02；目标仓或 runner 缺失保持 `blocked / wait_design` |
| `PH-02` | `console-module-flow`、`console-semantic-a11y`、`console-redaction-boundary`（`TC-CTX-*`、`TC-NAV-*`、`TC-SEC-001/004`、`TC-A11Y-001～003`） | `AC-CON-001/002`、`AC-FR-001/002`、`AC-NFR-002/007`；`AR-CON-001/002/003/007`；`ST-CON-001～003/010/011`、`CC-CON-001`；`VETO-CON-002/006` | `run_console_gate.sh --gate pr`；`check_console_redaction.sh`；run-scoped suite artifacts | suite reports + redaction report | protected disclosure、selection 或 semantic action 失败即阻断；不得进入 PH-03 |
| `PH-03` | `console-pure-contract`、`console-module-flow`、`console-port-adapter`、`console-redaction-boundary`、`console-architecture-static`（`TC-VIEW-001～009`、`TC-ADAPTER-001～003`、`TC-ARCH-004`） | `AC-CON-003`、`AC-FR-003`、`AC-NFR-003/004/005`；`AR-CON-001～005/007/012`；`IFG-CON-002`；Query zero-write；`VETO-CON-001/004/005` | targeted gate + architecture/redaction checks；raw 绑定同一 run | view/query/adapter reports | 任一 Query write、safe-field/axis 丢失或 forbidden body 失败不得进入 PH-04 |
| `PH-04` | `console-module-flow`、`console-port-adapter`、`console-controlled-composition`、`console-concurrency-race`、`console-recovery-matrix`（`TC-INTENT-001～011`、`TC-STATE-001～008`、`TC-CONSISTENCY-001～007`） | `AC-CON-004`、`AC-FR-004`、`AC-NFR-001/004/005`；`ST-CON-005/006/009`、`TX-CON-001/002`、`CC-CON-003～005`；`VETO-CON-003`；`OwnerCommandPort.submit` 唯一写入 | targeted main/nightly slices；raw command/state/race artifacts | flow/contract/concurrency/recovery reports | double submit、terminal shortcut、unknown replay、carrier scope/race 失败不得提交或进入 PH-05 |
| `PH-05` | `console-controlled-composition`、`console-recovery-matrix`、`console-module-flow`、`console-semantic-a11y`、`console-redaction-boundary`（`TC-TOPIC-001～012`、`TC-SEC-005`、`TC-CONSISTENCY-003`） | `AC-CON-005`、`AC-FR-005～010`、`AC-NFR-001/002/005/007`；`AR-CON-009/010`；`IFG-CON-006`；`ST-CON-007`、`CC-CON-002`；`VETO-CON-005/007` | controlled profile gate；partition/order/redaction raw artifacts | composition/recovery/a11y reports | owner failure 扩散、strict-empty 错误、activation elevation 或正文越界阻断；不得进入 PH-06 |
| `PH-06` | `console-recovery-matrix`、`console-semantic-a11y`、`console-redaction-boundary`、`console-module-flow`（`TC-RECOVERY-001～005`、`TC-A11Y-001～004`、`TC-DIAG-001～004`、`TC-SEC-001～005`） | `AC-CON-006`、`AC-FR-011/012`、`AC-NFR-002/003/006/007`；`AR-CON-003/011`；`ST-CON-008/011`、`CC-CON-003/004`；`VETO-CON-003/004/006` | recovery/a11y/redaction checks；selected browser/AT 仅 conditional | recovery/a11y/security reports | stale plan、retry loop、semantic divergence、diagnostic recursion 或 body leak 阻断；不得进入 PH-07 |
| `PH-07` | `console-port-adapter`、`console-architecture-static`、`console-concurrency-race`、`console-controlled-composition`、`console-recovery-matrix`、`console-redaction-boundary`（`TC-ADAPTER-001～006`、`TC-CONSISTENCY-008`、`TC-ARCH-001～004`） | `AC-FR-003/004/005/010`、`AC-NFR-003/005`；`AR-CON-002/004/005/010`；`IFG-CON-003/007`；`CC-CON-006`；`VETO-CON-001/003/005/007` | formal adapter gate only after exact contract；consumer default disabled/pending-contract；raw adapter/invalidation artifacts | adapter/architecture/race reports | guessed DTO、direct bus/cursor、positive invalidation without authority or write edge blocks; only safe disabled branch may proceed |
| `PH-08` | `console-release-safety-smoke`、`console-release-config-redline`、`console-release-redaction`、`console-release-dependency`、`console-release-report-audit`、`console-report-pairing-audit`；all required P0 representative TC | `AC-CON-007`、all applicable `AC-NFR-*`/`AC-FR-*`；8 EV families；`VETO-CON-001～007`；`AR-CON-012` | `run_console_release_gate.sh --run-id <run_id>` + report/check scripts；full raw release tree | `reports/runs/<run_id>/` + `reports/acceptance/*` + `reports/review/*` | 任一 blocking gate/VETO/pairing/redaction failure makes handoff invalid; this phase drafts handoff only and never writes verdict/signoff/readiness |

Phase 门禁均为 future planned contract。当前没有 target runner、run_id、artifact 或 report；因此不能将上述矩阵中的 `pass` 解释为执行结果。

### 7.5 Commit boundary 门禁矩阵（PH-01～PH-03）

| Boundary | 提交前测试 / check | AC / 红线 / VETO 关联 | Artifact / report 归属 | 失败处理与状态 |
|---|---|---|---|---|
| `commit-01-a` | `console-pure-contract` config slice；`console-config-redline` schema/profile；`git diff --check`；architecture path dry-run | `AC-NFR-003/004/005`；`AR-CON-005/008`；`IFG-CON-007`；`VETO-CON-004` | `suites/console-pure-contract/`、`suites/console-config-redline/`；targeted reports | config/schema/path 缺口→`blocked / wait_design`；不得提交 |
| `commit-01-b` | fixture/corpus/gate shell dry-run；`console-architecture-static` planned scan；redaction/no-static path check | `AC-NFR-003/004`；`AR-CON-003/005/012`；`VETO-CON-001/004` | fixture/gate raw（future）；architecture/redaction report | 只能修 tooling skeleton；不得生成静态 pass 或真实 evidence |
| `commit-02-a` | `console-module-flow` CTX/access slice；`console-redaction-boundary` minimum disclosure；`TC-CTX-001～005`、`TC-SEC-001` | `AC-CON-001`、`AC-FR-001`；`ST-CON-001/010`、`AR-CON-007`；`VETO-CON-002` | context/access suite artifact + paired report | access/cleanup/disclosure 失败→阻断；exact authority 缺失→`wait_design` |
| `commit-02-b` | `console-module-flow` NAV；`console-semantic-a11y` `TC-NAV-001～004`/`TC-A11Y-001～003`；redaction | `AC-CON-002`、`AC-FR-002`、`AC-NFR-007`；`ST-CON-002/003/011`、`CC-CON-001`；`VETO-CON-002/006` | navigation/a11y/redaction artifacts + reports | route/menu/host fallback 放宽 guard→S/VETO；不得进入 PH-03 |
| `commit-03-a` | `console-pure-contract`/`console-redaction-boundary` safe mapper；`TC-VIEW-001～005`、`TC-ADAPTER-002/003` | `AC-CON-003`、`AC-FR-003`；`AR-CON-001/003/004`；`IFG-CON-002`；`VETO-CON-001/004` | view mapper raw + suite/redaction reports | safe-field/axis/body/no-write 缺口→设计 blocker；不准猜 owner schema |
| `commit-03-b` | `console-module-flow` + `console-port-adapter` first Core Query slice；`TC-VIEW-001～004/009` | `AC-CON-003`；`AC-FR-003`；`IFG-CON-002`；`ST-CON-004`；`VETO-CON-001/005` | query suite artifact/report；Query call ledger future | 任一 Query write 或 empty/status 混同→阻断；后四 Query不在本边界 |
| `commit-03-c` | remaining Core Query/link/reconcile/activation safety；`TC-VIEW-005～009`、`TC-ADAPTER-004` | `AC-FR-003/004/005/010`；`IFG-CON-002/007`；`ST-CON-007`；`VETO-CON-001/005` | link/reconcile/activation artifacts + reports | exact reconcile/activation contract 缺失→positive blocked；只允许 no-call/read-only |

### 7.6 Commit boundary 门禁矩阵（PH-04～PH-06）

| Boundary | 提交前测试 / check | AC / 红线 / VETO 关联 | Artifact / report 归属 | 失败处理与状态 |
|---|---|---|---|---|
| `commit-04-a` | `console-module-flow` local intent；`console-pure-contract` draft/patch；`TC-INTENT-001～004`、`TC-STATE-005/006` | `AC-FR-004`；`ST-CON-005/006`、`TX-CON-001`；`AR-CON-006`；`VETO-CON-003/004` | intent/state artifacts + flow/pure reports | terminal revive、partial merge、forbidden patch→阻断；local-only 不得碰 owner |
| `commit-04-b` | `console-port-adapter` submit seam；`console-concurrency-race` dispatch/single-flight；`console-recovery-matrix` reconcile；`TC-INTENT-005～011`、`TC-CONSISTENCY-004～007` | `AC-CON-004`、`AC-FR-004`；`IFG-CON-001`；`ST-CON-006`、`TX-CON-002`、`CC-CON-003～005`；`VETO-CON-003` | submit/race/recovery raw + paired reports | exact owner/idempotency 未闭口→`blocked_for_positive`；unknown replay/double submit→S，保留失败 run |
| `commit-04-c` | `console-pure-contract` carrier；`console-controlled-composition` local consistency；`console-concurrency-race` late/scope；`TC-STATE-001～004/008`、`TC-CONSISTENCY-001/002/006` | `AC-NFR-001/005`；`AR-CON-006`；`ST-CON-009`、`TX-CON-001/002`、`CC-CON-001`；`VETO-CON-003/007` | carrier/race artifacts + contract/composition reports | medium/TTL/CAS 未有 authority→session-only ceiling；mismatch/late mutation→阻断 |
| `commit-05-a` | `console-pure-contract` descriptor/activation；`console-module-flow` exhaustive registry；`TC-VIEW-008`、`TC-TOPIC-001/012` | `AC-FR-005～010`；`AR-CON-009/010`；`ST-CON-007`；`VETO-CON-005/007` | descriptor/activation raw + registry reports | owner facet authority 未闭口→conditional/blocked；package/flag/page 不得 active |
| `commit-05-b` | `console-controlled-composition` eight partitions；`console-redaction-boundary` topic safe material；`TC-TOPIC-001～011`、`TC-SEC-005`、`TC-CONSISTENCY-003` | `AC-CON-005`、`AC-FR-005～010`；`IFG-CON-006`；`AR-CON-009`、`CC-CON-002`；`VETO-CON-007` | per-partition raw + composition/redaction reports | one failure 扩散/被掩盖、canonical order 漂移→阻断；positive owner value 仍 conditional |
| `commit-05-c` | `console-module-flow` page/empty；`console-semantic-a11y` page binding；`console-concurrency-race` completion permutation；`TC-TOPIC-001～003/012`、`TC-A11Y-001～003` | `AC-CON-005`、`AC-NFR-001/002/007`；`ST-CON-007`、`CC-CON-002`；`VETO-CON-005～007` | page/a11y/order artifacts + reports | strict empty 或 semantic equivalence 失败→阻断；browser compatibility 不得伪造 |
| `commit-06-a` | `console-recovery-matrix` typed error/plan；`console-module-flow` recovery branches；`TC-RECOVERY-001～004`、`TC-STATE-007` | `AC-CON-006`、`AC-FR-011`；`ST-CON-008`；`VETO-CON-003/006` | recovery plan raw + recovery/module reports | stale/mismatch/retry-all/action-as-recovered→S/P0；不得进入 a11y boundary |
| `commit-06-b` | `console-semantic-a11y` C1～C6；`console-module-flow` semantic action；`TC-A11Y-001～004`、`TC-NAV-002`、`TC-INTENT-009`、`TC-RECOVERY-005` | `AC-CON-006`、`AC-FR-012`、`AC-NFR-007`；`ST-CON-011`、`CC-CON-003`；`VETO-CON-006` | semantic/focus/announce artifacts + a11y report | selected matrix 未定只保留 semantic P0/residual；visual-only 或 alternate guard→阻断/VETO |
| `commit-06-c` | `console-redaction-boundary` diagnostic/forbidden corpus；`console-pure-contract` candidate; `TC-DIAG-001～004`、`TC-SEC-001～004` | `AC-NFR-003/006`；`AR-CON-003/011`；`VETO-CON-004/005` | redaction raw + diagnostic/security reports | body/secret/stack/free-text/recursive sink→S；不得用 diagnostic receipt 作 evidence |

### 7.7 Commit boundary 门禁矩阵（PH-07～PH-08）

| Boundary | 提交前测试 / check | AC / 红线 / VETO 关联 | Artifact / report 归属 | 失败处理与状态 |
|---|---|---|---|---|
| `commit-07-a` | `console-architecture-static` registry/forbidden dependency；`console-port-adapter` slot availability；`TC-ARCH-001～004`、`TC-ADAPTER-001/004` | `AC-NFR-003/005`；`AR-CON-002/005/010`；`IFG-CON-007`；`VETO-CON-001` | architecture/registry raw + reports | SDK export/host/package 未固定→planned/blocked；出现 DB/private bus/extra write→S |
| `commit-07-b` | `console-port-adapter` parity；`console-controlled-composition` approved adapters；`console-concurrency-race` command/reconcile；`TC-ADAPTER-001～004/006`、`TC-INTENT-006`、`TC-TOPIC-004～011` | `AC-FR-003～010`；`IFG-CON-001/006/007`；`AR-CON-001/002/007/010`；`VETO-CON-001/002/003/005/007` | adapter/partition raw + contract/composition reports | exact owner/SDK contract 未闭口时 `blocked_for_positive`；不得猜 DTO、path、error、idempotency 或 source |
| `commit-07-c` | `console-architecture-static` absence；`console-concurrency-race` invalidation; `console-port-adapter` disabled consumer；`TC-ADAPTER-005/006`、`TC-CONSISTENCY-008` | `AC-NFR-005`；`IFG-CON-003/004/005`；`AR-CON-004/005/012`；`CC-CON-006`；`VETO-CON-001/005` | disabled/conditional invalidation raw + architecture/race reports | 默认 disabled/zero-write；无 envelope/order/dedup authority 不得启用；direct bus/cursor/write→S |
| `commit-08-a` | `console-release-config-redline` dry-run；`console-release-dependency`；`console-report-pairing-audit`；`check_no_static_evidence.sh` | `AC-NFR-003/004/005`；`AR-CON-008/012`；`VETO-CON-001/004` 前置 | release dry-run + pairing/no-static reports | 缺 raw/pair/digest、静态 pass、config fallback→阻断；不写 acceptance verdict |
| `commit-08-b` | all required P0 source suites + `console-release-safety-smoke`、redaction、dependency、report audit；representative 96-TC in-scope set | `AC-CON-007`、all applicable `AC-FR/NFR`；8 EV families；`VETO-CON-001～007` | full fixed-run artifacts, evidence index, suite reports | 任一 blocking/S/VETO/failed source→handoff invalid；selected unavailable 仅 residual |
| `commit-08-c` | `console-release-report-audit`、pairing/redaction/no-static；review completeness checks；acceptance draft source audit | `AC-CON-007`、`AR-CON-012`、`VETO-CON-001～007`、06 §12～§14 | `reports/acceptance/{handoff,veto-checklist,risk-acceptance,open-issues}.md` + review notes | 只能生成 draft；缺 review/run/source 不得 verdict/signoff/readiness；风险接受不得覆盖 VETO/S |

### 7.8 报告生成与人工/Agent 审查规则

| Phase | Planned generator | 输入 | 输出 | 审查责任与限制 |
|---|---|---|---|---|
| PH-01 | `scripts/reports/generate_console_reports.sh`（dry-run/targeted） | config/dependency/static raw | targeted reports | 设计者检查路径、profile 和 forbidden dependency；不产生 EV |
| PH-02～PH-04 | `generate_console_reports.sh` targeted | module-flow、redaction、query/intent/state raw | `reports/runs/<run_id>/suites/*.md` | 实施者解释失败；设计者处理 schema/state blocker；失败不能改写 |
| PH-05～PH-07 | same generator + conditional adapter/invalidation reports | composition/recovery/adapter/race raw | suite reports + degradation/disabled summaries | 检查 partition isolation、no-write、conditional posture；selected unavailable 记录 residual |
| PH-08 | `generate_console_reports.sh`、`build_console_evidence_candidates.sh`、`build_console_acceptance_draft.sh`、pairing/redaction/no-static checks | same-run raw artifacts + reports + defect/risk refs | evidence index/candidates、`reports/acceptance/*`、`reports/review/*` | 人/Agent 必须审查 handoff/VETO/risk/open issues/evidence trace；脚本不得写 verdict/signoff/readiness |

报告成熟度固定为：`raw artifact → paired report → EV candidate → formal EV instance → acceptance draft → human/Agent review → 06 decision`。任何阶段都不得跳级；`EV-CAND-*` 不是 `EV-*-001`，`reports/acceptance/*` 不是正式裁决。

### 7.9 证据字段、配对和归档规则

未来 evidence instance 至少需要 `schema_version`、`run_id`、`evidence_id`、`suite`、`tc_refs`、`status`、`artifact_path`、`artifact_digest`、`report_path`、`report_digest`、`config_profile`、`source_refs`、`ac_refs`、`veto_refs`、`blocker_refs`、`redaction_status`、`pairing_status`、`review_status`；字段与 digest 算法必须由实现前正式合同固定，本 Step 不填写示例值。

| 规则 | 设计结论 |
|---|---|
| run binding | raw、report、candidate、EV、acceptance draft 必须属于同一显式 `<run_id>`；禁止 `latest` 和跨 run 拼接 |
| failure preservation | failed/blocked/not_run/residual 原样保留；重跑用新 run_id，不删除或覆盖失败材料 |
| redaction | artifact、stdout/stderr、report、evidence index 都必须扫描 forbidden body；命中值不得回显 |
| pairing | orphan raw、缺 report、run mismatch、缺 digest、TC/AC/VETO orphan 都阻断送验 |
| candidate qualification | 只能由真实 suite raw/report/digest 关系推导；无 source 不生成 candidate |
| acceptance | handoff/VETO/risk/open issues 只生成待审草稿；不自动宣告通过、有条件通过、签署或 readiness |
| ownership | Console 只归档 body-free safe refs、enum、digest、count、status、failure reason 和执行关系；不归档 owner body、DB snapshot 或 audit/evidence body |

### 7.9.1 验收交接报告审查表

| 报告 | 生成来源 | 必须审查 | 不允许的解释 |
|---|---|---|---|
| `reports/acceptance/handoff.md` | 同一 `<run_id>` 的 gate/suite/evidence/report 汇总 | baseline、scope、enabled/disabled facet、passed/failed/blocked/residual、open issues、review version | 缺 run/source refs；把草稿当正式 verdict 或 readiness |
| `reports/acceptance/veto-checklist.md` | 从真实 evidence index、suite reports、defect refs 计算 | `VETO-CON-001～007` 逐项来源、状态、reviewer conclusion | 默认全 passed；缺 evidence 仍宣称未命中；不得新增产品 VETO |
| `reports/acceptance/risk-acceptance.md` | residual/defect/report 汇总脚本初稿 | risk id、影响、owner、acceptor、trigger/deadline、fixed-run refs、签署 | 接受 VETO/S/required P0；用角色占位代替真实接受 |
| `reports/acceptance/open-issues.md` | failed/blocked/residual/defect 输入 | S/A/B/R 分级、复验状态、设计回写和下一动作 | 隐藏失败 suite；把 `not_run` 改成 pass |
| `reports/runs/<run_id>/evidence-index.md` | raw artifact + paired suite reports | TC/AC/VETO/EV/source/digest/run pairing、redaction、review status | 静态 JSON、通用计数或人工补 source 生成 EV |
| `reports/review/reviewer-notes.md` / `agent-review.md` | 人/Agent 审查记录 | 争议、完整性、失败保真、是否允许进入 06 裁决 | 改写 raw outcome、替代正式签署或风险接受 |

### 7.10 AC / EV / VETO 覆盖摘要

| 门禁族 | 主要阶段/boundary | 正式 AC / 结构红线 | Future EV candidate | VETO / 结论上限 |
|---|---|---|---|---|
| context/access/navigation | PH-02；`commit-02-a/b` | `AC-CON-001/002`、`AC-FR-001/002`、`AR-CON-001/002/007`、`ST-CON-001～003/010` | `EV-CAND-UNIT/FLOW/SECURITY/ACCESSIBILITY-001` | `VETO-CON-002/006`；不能证明 owner truth |
| safe view/Core Query | PH-03；`commit-03-a/b/c` | `AC-CON-003`、`AC-FR-003`、`IFG-CON-002`、`AR-CON-003/004`、Query write=0 | `EV-CAND-UNIT/FLOW/CONTRACT/SECURITY/ARCH-001` | `VETO-CON-001/004/005`；不能证明 owner positive |
| intent/command/state | PH-04；`commit-04-a/b/c` | `AC-CON-004`、`AC-FR-004`、`ST-CON-005/006/009`、`TX-CON-001/002`、`CC-CON-003～005` | `EV-CAND-UNIT/FLOW/CONTRACT/INTEGRATION-001` | `VETO-CON-003`；unknown 不 replay |
| topic partition | PH-05；`commit-05-a/b/c` | `AC-CON-005`、`AC-FR-005～010`、`IFG-CON-006`、`AR-CON-009/010`、`CC-CON-002` | `EV-CAND-FLOW/INTEGRATION/SECURITY/ACCESSIBILITY-001` | `VETO-CON-005/007`；不推 readiness |
| recovery/a11y/diagnostics | PH-06；`commit-06-a/b/c` | `AC-CON-006`、`AC-FR-011/012`、`AC-NFR-003/006/007`、`ST-CON-008/011`、`AR-CON-011` | `EV-CAND-UNIT/FLOW/INTEGRATION/ACCESSIBILITY/SECURITY-001` | `VETO-CON-003/004/006`；sink/AT positive conditional |
| adapters/consumer | PH-07；`commit-07-a/b/c` | `AC-FR-003/004/005/010`、`IFG-CON-001/003/007`、`AR-CON-002/004/005/010`、`CC-CON-006` | `EV-CAND-CONTRACT/INTEGRATION/ARCH/FLOW-001` | `VETO-CON-001/003/005/007`；consumer 默认 disabled |
| release/evidence/handoff | PH-08；`commit-08-a/b/c` | `AC-CON-007`、all applicable `AC-*`、`AR-CON-012`、06 §10～§14 | `EV-CAND-RELEASE-001` + 7 other candidates | `VETO-CON-001～007`；只生成 draft，不生成 verdict/signoff |

`AC-BR-001～007`、`AC-DR-001～005` 和 `AC-NFR-001～007` 通过上述 phase/boundary 交叉引用覆盖；本 Step 不新增需求 AC。正式 VETO 集合严格为 `VETO-CON-001～007`，文档/证据造假按 S/送验无效处理。

### 7.11 Phase / boundary 停审记录

| 对象 | 一句话目标/增量 | 测试覆盖 | 验收/证据归属 | 设计层结论 |
|---|---|---|---|---|
| `PH-01` / `commit-01-a/b` | 建立可检查的 package/config/path/evidence shell | config/architecture/redaction/no-static planned | NFR/AR/IFG；targeted raw/report future | 通过设计停审；目标仓/runner blocker |
| `PH-02` / `commit-02-a/b` | context/access/navigation restricted shell | CTX/NAV/SEC/A11Y | AC-CON-001/002、VETO-002/006 | 通过设计停审；authority/host pending |
| `PH-03` / `commit-03-a/b/c` | safe views 与 16 Query zero-write | VIEW/ADAPTER/ARCH | AC-CON-003、IFG-002、VETO-001/004/005 | 通过设计停审；safe-field/exact query pending |
| `PH-04` / `commit-04-a/b/c` | local intent、submit safety、carrier/race | INTENT/STATE/CONSISTENCY | AC-CON-004、TX/CC、VETO-003 | 通过设计停审；owner idempotency/carrier medium pending |
| `PH-05` / `commit-05-a/b/c` | eight owner partitions and semantic page composition | TOPIC/COMPOSITION/A11Y | AC-CON-005、IFG-006、VETO-005/007 | 通过设计停审；owner facet/browser pending |
| `PH-06` / `commit-06-a/b/c` | typed recovery, semantic a11y, diagnostic isolation | RECOVERY/A11Y/DIAG/SEC | AC-CON-006、NFR、VETO-003/004/006 | 通过设计停审；sink/AT pending |
| `PH-07` / `commit-07-a/b/c` | approved adapter slots and disabled invalidation | ADAPTER/ARCH/RACE | IFG-001/003/007、AR-002/004/005 | 通过设计停审；exact SDK/invalidation pending |
| `PH-08` / `commit-08-a/b/c` | release gate/report/evidence/handoff draft | release/pairing/redaction/dependency | AC-CON-007、EV/VETO/06 handoff | 通过设计停审；fixed run/review authority absent |

每个对象的结论是设计层 `pass with blockers`，不是执行层 gate `pass`。任何 blocker 修复后必须回写正式真相源和本 Step，并重做受影响 phase/boundary 停审。

### 7.12 跨门禁覆盖与证据归属审计

| 审计项 | 结论 | 依据/修正 |
|---|---|---|
| 8 phase 是否每个至少一个测试门禁 | `pass` | §7.4；PH-01～PH-08 均有 blocking 或 structural planned suite |
| 22 boundary 是否每个有提交前门禁 | `pass` | §7.5～§7.7；无 boundary 依赖“最后统一测试” |
| 96 TC 是否有阶段或 boundary 归属 | `pass with conditional` | 05 Step 5/6 的 19 cut、TC family 和 §7.10 反向覆盖；positive owner/browser/consumer 保持 blocked/conditional |
| AC/AR/IFG/ST/TX/CC/NFR 是否被引用 | `pass` | phase/boundary 表逐项回指正式 `06` 编号；不新增 AC 或 gate truth |
| VETO 覆盖 | `pass` | `VETO-CON-001～007` 均前置到相关 phase，并在 PH-08 汇总；不新增 VETO-008 |
| raw artifact/report pairing | `pass planned` | 统一 `<run_id>` roots、digest、pairing/no-static；当前无实例 |
| failed/blocked/residual 保真 | `pass planned` | 失败不得覆盖、删除或改写；selected unavailable 不计 P0 pass |
| redaction/dependency 前置 | `pass` | PH-01/02/03/06/07 targeted，PH-08 full；无 forbidden body/旁路依赖例外 |
| 人/Agent 审查责任 | `pass planned` | suite 可自动生成；acceptance/evidence/review draft 必须人工审查 |
| Query/side-path ownership | `pass` | 16 Query zero-write、唯一 `OwnerCommandPort.submit` write、0 Event/0 Job 始终保持 |
| 旧阈值/production readiness 污染 | `pass` | 无 `<2s>`、P95、固定控制数量或 profile/UI→readiness 推导 |

### 7.12.1 覆盖计数复核

| 覆盖对象 | 设计层结果 | 复核口径 |
|---|---|---|
| Phase | `8/8` | `PH-01～PH-08` 均在 §7.4 有测试、验收、artifact、report、失败处理 |
| Commit boundary | `22/22` | `commit-01-a/b`、`commit-02-a/b`、`commit-03-a/b/c`、`commit-04-a/b/c`、`commit-05-a/b/c`、`commit-06-a/b/c`、`commit-07-a/b/c`、`commit-08-a/b/c` 均在 §7.5～§7.7 出现一次 |
| Test cut family | `19/19` | `05` Step 3 的 19 cut 均由 PH/boundary 的 TC family 或 ARCH/absence check 承接；conditional positive 保持 blocked/conditional |
| Test cases | `96/96 planned` | `05` Step 6 的 96 TC 通过 CTX/NAV/VIEW/INTENT/TOPIC/RECOVERY/A11Y/ADAPTER/STATE/CONSISTENCY/DIAG/SEC/CONFIG/ARCH 入口覆盖；无执行实例 |
| Formal AC | `7 AC-CON + 13 AC-FR + 7 AC-BR + 5 AC-DR + 7 AC-NFR` | 本 Step 只引用正式 06 编号，不新增需求或裁决 |
| Architecture / interface gates | `12 AR + 7 IFG + 11 ST + 2 TX + 6 CC` | 仅消费正式 06 的红线/状态/一致性门禁；Query zero-write 与唯一 owner write贯穿 |
| VETO | `7/7` | 严格为 `VETO-CON-001～007`；证据完整性失败按 S/送验无效，不新增产品 VETO |
| Protocol absence | `0 Event / 0 Job` | PH-01/PH-03/PH-07/PH-08 architecture checks 保持 absence；任何实现出现即 architecture blocker |

### 7.13 本 Step 的不可执行事实

以下均保持未创建/未执行：目标实现仓、framework/router/bundler/package manager/runner、scripts、suite、run_id、artifact、report、evidence instance、defect、risk acceptance、verdict、signoff、readiness 和 commit。上述矩阵中的命令、目录、报告名和 candidate ID 仅是未来合同；任何实现者在 authority 未固定前不得据此猜造实现。

## 8. 回填草稿

以下内容仅供 Step 13 full-restart 装配到正式 `07-实施计划.md` §7；本文件之外不得提前写正式 07。

### 8.1 阶段门禁原则

每个 PH-01～PH-08 必须在进入下一 phase 前执行对应 planned suite/check，生成同一 `<run_id>` 下的 raw artifact 和 paired report，并完成 redaction、dependency、pairing/no-static 适用检查。P0 blocking gate、VETO、S 级、证据完整性和设计闭口失败均阻断提交及后续 phase；selected/P1 unavailable 只记录 residual，不贡献 positive pass。

### 8.2 Boundary 门禁与证据

22 个 `commit-*` boundary 各自绑定最小测试切口、正式 AC/AR/IFG/ST/TX/CC/NFR/VETO、artifact/report 路径和失败处理。`EV-CAND-*` 只能由真实 suite raw/report/digest 关系推导；正式 `EV-*-001`、VETO checklist、acceptance handoff 和 risk draft 只能在 PH-08 生成待审草稿，不得自动写 verdict、signoff 或 readiness。

### 8.3 报告审查与失败处理

`reports/runs/<run_id>/` 保存 suite/gate/evidence/pairing/redaction reports；`reports/acceptance/` 保存 handoff、VETO、risk、open-issues 草稿；`reports/review/` 保存人/Agent审查。缺 raw/pair/digest、run mismatch、静态 pass、forbidden body、P0 gate failure 或 VETO 命中时保留失败材料、停止当前 boundary、按 05/06 复验或回写设计；不使用 `latest` 或手写补洞。

## 9. 待确认事项

| 事项 | 状态 | 影响 | 安全处理 |
|---|---|---|---|
| target repo/framework/router/bundler/package manager/runner | `BLK-CON-07-001 / RES-CON-07-002` | 全部 phase/boundary | 保持 planned/blocked；不运行、不选型、不创建实现仓 |
| exact owner/SDK DTO、query/command/result/ref、scope/qualification/safe-field | `BLK-CON-07-002` | PH-03～PH-07 | positive gate `blocked_for_positive`；先验证 no-call/read-only/safe mapping |
| reconciliation/idempotency/dispatch contract | `pending` / `CON-Q-038` | PH-04、PH-07 | ambiguous→unknown；无 formal reconcile 不 replay |
| carrier medium/TTL/migration/cross-tab | `pending` / `CON-Q-044` | PH-04-c、PH-07-c | session-volatile whole-record/single-writer ceiling |
| browser/AT authority and matrix | `pending` / `CON-Q-046` | PH-02-b、PH-05-c、PH-06-b | semantic P0 only；selected unavailable=residual |
| diagnostic sink/envelope and production authority | `pending` / `RES-CON-07-001` | PH-06-c、PH-08 | body-free/disabled isolation；不生成 production evidence |
| invalidation envelope/version/order/dedup | `pending` | PH-07-c | consumer disabled/zero-write；合同到达后重审 |
| immutable design/delivery/environment/dependency baseline | `BLK-CON-07-003` | PH-01、PH-08、handoff | 不填写 hash/digest；baseline 缺失即 not_entered |
| formal evidence retention/acceptance authority | `pending` | PH-08 | 仅生成 draft；不得风险接受 VETO/S |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| SOP 15 问回答完整 | `pass` | §3 已逐项回答并保持 Console 边界 |
| 8 phase 门禁矩阵完整 | `pass` | §7.4 覆盖测试、验收、脚本、artifact、report、失败处理 |
| 22 boundary 门禁矩阵完整 | `pass` | §7.5～§7.7 每个 boundary 有提交前门禁和证据归属 |
| 报告/证据成熟度与人工审查明确 | `pass` | §7.8～§7.9；candidate、EV、handoff、verdict 分层 |
| VETO/AC/红线前置与失败姿态明确 | `pass` | §7.10～§7.12；VETO-CON-001～007 全覆盖 |
| 跨门禁重复/遗漏/ownership 审计 | `pass with blockers` | 设计层无 unresolved 冲突；目标仓、exact contract、baseline、run 仍阻塞执行 |
| 正式 07 是否可写 | `false` | Step 13 full-restart 前关闭 |
| 可进入 Step 8 | `pass` | 需用户明确授权；下一步收敛配置、环境与外部依赖准备 |

## 11. Step 自审记录

- [x] 已读取项目台账、07 flow、Step 5/6 中间产物、正式 `03/05/06` 相关范围、实施计划 SOP/书写规范、台账规范、可落码性标准和 L1-governance Step 7 参考。
- [x] 已回答 Step 7 全部 15 个 SOP 问题。
- [x] 已为 PH-01～PH-08 绑定测试门禁、验收/红线关联、脚本、artifact、report 和失败处理。
- [x] 已为 22 个 planned boundary 提供提交前门禁、AC/AR/IFG/ST/TX/CC/NFR/VETO 关联、证据归属和失败姿态。
- [x] 已分离 raw artifact、paired report、EV candidate、formal EV、acceptance draft、verdict/signoff/readiness；未伪造任何执行事实。
- [x] 已完成 phase/boundary 停审与跨门禁覆盖、证据归属、VETO、redaction、dependency、P0/selected 审计。
- [x] 未创建 scripts、suite、run、artifact、report、evidence、defect、risk acceptance、implementation ledger、boundary skeleton、正式 `07-实施计划.md`；未运行项目测试；未提交 commit。

### 11.1 最终静态审计记录（2026-09-19）

| 审计项 | 结果 | 证据与边界 |
|---|---|---|
| Phase 覆盖 | `pass`：8/8（`PH-01`～`PH-08`） | §7.4、§7.11、§7.12.1；每个 phase 均有 planned suite/check、验收关联、artifact/report 归属和失败动作。 |
| Commit boundary 覆盖 | `pass`：22/22 | §7.5～§7.7；边界 ID 唯一，无遗漏、重复或以“末端统一测试”替代提交前门禁。 |
| Test cut / TC 覆盖 | `pass with conditional`：19/19 cut、96/96 planned TC | §7.10、§7.12.1；owner-positive、selected browser/AT、invalidation 和量化项仍按 `blocked/conditional/residual` 处理。 |
| 正式 AC/红线/VETO 映射 | `pass`：正式 `AC-*`、`AR-*`、`IFG-*`、`ST-*`、`TX-*`、`CC-*`、`NFR-*` 与 `VETO-CON-001～007` 均有 phase/boundary 入口 | 未新增验收标准或产品 VETO；证据完整性仍按 S/送验无效处理，不扩展正式 VETO 集合。 |
| Evidence/report 诚实性 | `pass planned` | raw → paired report → candidate → formal EV → acceptance draft → review → 06 decision 的成熟度顺序完整；当前 instance 数仍为 0。 |
| Ownership / absence | `pass` | 16 Query zero-write、唯一潜在 owner write=`OwnerCommandPort.submit`、0 Outbound Event、0 Operations Job；无 DB/repository/projection/outbox/worker 旁路。 |
| Blocker 保真 | `pass` | `BLK-CON-07-001～003`、`RES-CON-07-001～002`、`CON-Q-034～047` 未被转写为 positive integration、verdict、signoff 或 readiness。 |
| 文件与事实检查 | `pass` | 正式 `07-实施计划.md`、implementation execution ledger、planned boundary 文件均未创建；`implementation-boundaries/` 目录保持空目录；未运行项目测试、未生成 run/artifact/report/evidence。 |
| 工作区静态检查 | `pass` | `git diff --check -- projects/L5-console` 通过。 |

### 11.2 Step 7 停审结论

Step 7 的门禁设计在文档层 `done / pass / self_reviewed`，并切换为 `step_stop_review`。该结论只表示 phase/boundary 门禁、证据配对、失败姿态和跨门禁审计已经可审查；不表示任何实现、测试、run、artifact、report、evidence、verdict、signoff 或 readiness 已发生。当前允许的唯一后续动作是等待用户明确授权 Step 8；在授权前不得创建或修改 Step 8 产物、正式 `07-实施计划.md`、implementation ledger 或 planned boundary skeleton。
