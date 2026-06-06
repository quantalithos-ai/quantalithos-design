# L1-work 07 实施计划 Step 12: 实施完成判定

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-work/07-实施计划.md` §12 实施完成判定
> 状态: `[x] 已完成`
> 日期: 2026-06-05

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 12 |
| 主题 | 定义实施完成判定 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-work/design-calibration/07_implementation_plan_step_12_completion_criteria.md` |

本步定义什么时候可以宣称 L1-work 本轮 P0 实施完成,以及未完成项如何处理。本步不生成真实验收结论,不替代 `06-验收标准.md`,不新增 P0 范围,不创建正式 `07-实施计划.md`。

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_02_scope.md` | 已确认 | 继承 P0 范围、`FR-WORK-001~008`、`AC-WORK-001~029`、`VF-WORK-001~008` 和非范围 |
| `07_implementation_plan_step_04_deliverables.md` | 已确认 | 继承代码、接口、事件、job、adapter、配置、测试、脚本、artifact、report 和非交付物清单 |
| `07_implementation_plan_step_07_tests_acceptance_gates.md` | 已确认 | 继承 phase gate、commit gate、release gate、artifact / report 和 VETO 前置规则 |
| `07_implementation_plan_step_09_spikes_risks.md` | 已确认 | 继承 Spike、P0 risk、P1/P2 risk、open item、blocker 和上游回写触发 |
| `07_implementation_plan_step_10_rollback_change_control.md` | 已确认 | 继承暂停、恢复、不得风险接受和设计缺口处理规则 |
| `07_implementation_plan_step_11_commit_review_delivery.md` | 已确认 | 继承提交、评审、交付、固定 run report 和 acceptance handoff 审查规则 |
| `06-验收标准.md` §3~§14 | 已完成 | 提取基线、进入 / 退出条件、VETO、缺陷复验、风险接受、最终签署和 evidence gate |
| `standards/document/实施计划书写规范.md` §5.12 | 已读取 | 约束完成判定必须可审查,未完成项必须分类,不得写“基本完成” |
| `standards/document/实施计划讨论流程_SOP.md` Step 12 | 已读取 | 约束完成判定表、未完成项处理表和最终交付清单 |

校准来源:

- `design-calibration/07_implementation_plan_step_02_scope.md`
- `design-calibration/07_implementation_plan_step_04_deliverables.md`
- `design-calibration/07_implementation_plan_step_07_tests_acceptance_gates.md`
- `design-calibration/07_implementation_plan_step_09_spikes_risks.md`
- `design-calibration/07_implementation_plan_step_10_rollback_change_control.md`
- `design-calibration/07_implementation_plan_step_11_commit_review_delivery.md`
- `design-calibration/06_acceptance_step_04_entry_exit.md`
- `design-calibration/06_acceptance_step_10_observability_evidence.md`
- `design-calibration/06_acceptance_step_11_veto.md`
- `design-calibration/06_acceptance_step_12_defect_retest_release.md`
- `design-calibration/06_acceptance_step_13_risk_acceptance.md`
- `design-calibration/06_acceptance_step_14_conclusion_signoff.md`

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 本轮需求覆盖如何判定 | `FR-WORK-001~008` 必须全部有实现、测试、证据和 `AC-WORK-*` 回链;`FR-WORK-E01~E05` 若未实现必须在非范围或后续专项中明确,不得伪装为 P0 完成。 |
| 2. 交付物是否全部完成 | Step 4 的 workspace、contracts、domain、application、infra、api、worker、jobs、18 Commands、8 Queries、7 Consumers、9 Outbound Events、6 Jobs、fake / in-memory adapters、config、scripts、tests、artifacts 和 reports 必须全部有对应实现或正式不适用说明。 |
| 3. 测试门禁和验收门禁是否全部通过或有明确风险接受 | PH-01~PH-09 的 P0 阻断门禁必须通过。只有不影响 P0 / release / P0 evidence 的 B / C 或 P1/P2 风险允许进入 `risk-acceptance.md`;S、VETO、P0 A、release redline 不得风险接受。 |
| 4. 风险、Spike 和待确认事项是否关闭 | `SP-WORK-001~007` 必须有输出;P0 risk 必须关闭或转为已修复缺陷;P1/P2 risk 必须移交后续专项;open item 必须关闭、not_applicable 或进入明确后续项。 |
| 5. 是否存在一票否决项 | `reports/acceptance/veto-checklist.md` 必须覆盖全部 `VETO-WORK-001~012` 和 `VF-WORK-001~008`;任一 failed 即不得宣称实施完成。 |
| 6. 未完成项如何进入延期、风险接受或 blocker | 不影响 P0 的 P1/P2 能力进入延期;不影响 P0 / release / evidence 的 B / C 风险可进入风险接受;影响 P0、VETO、release、redaction、no-write、duplicate truth、design closure 或 evidence 的未完成项必须是 blocker。 |
| 7. `reports/runs/<run_id>` 是否已经从 `artifacts/test/<run_id>` 生成 | 必须生成,且不能用 raw artifact 替代 report。`gate-results.md`、`evidence-index.md`、`redaction-check.md`、`release-summary.md` 必须可读、可回链、可审查。 |
| 8. acceptance handoff、veto checklist 和 risk acceptance 是否已经审查 | PH-09 必须审查 `reports/acceptance/handoff.md`、`reports/acceptance/veto-checklist.md`;有条件通过或保留 B / C 风险时必须审查 `risk-acceptance.md`。handoff 文件名固定为 `handoff.md`,正文和审查元数据必须记录固定 `run_id`。 |
| 9. artifact / report 是否通过 redaction 和 link 检查 | 必须通过。正式引用不得使用 `latest`;路径必须固定到 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance`;redaction 任一 forbidden output 命中即阻断。 |
| 10. 是否仍存在字段、DTO、状态、命名或 phase boundary 冲突 | 不允许存在。任一当前 P0 需要的字段 / DTO / state / flow / config / test / acceptance / boundary 未闭合,必须暂停并回写上游,不得宣称完成。 |

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 完成判定尚未集中 | Step 2/4/7/9/10/11 各自有范围、交付、门禁和风险 | 实施结束时可能只看测试通过,忽略 evidence / VETO / closure | 本步形成总判定表 |
| 测试通过容易被误当验收通过 | Step 7 已声明测试不等于验收 | release evidence、risk acceptance 和 VETO 可能漏审 | 本步要求 reports / acceptance 全部审查 |
| 未完成项分类需要落地 | Step 9 有风险,Step 10 有 blocker | 未完成 P0 项可能被写成后续优化 | 本步把延期、风险接受、blocker 分类固定 |
| raw artifact 与 report 容易混用 | `05/06` 区分 artifact 和 report | 机器日志不可审查或泄露 raw body | 本步要求 raw artifact 必须生成可读 report 且 redaction 通过 |
| “基本完成”口径不合规 | 标准明确禁止 | 实施结束描述不可执行 | 本步只允许通过 / 不通过 / 不适用 / 已接受风险 |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 完成定义 | 分散在 scope、deliverables、gates 和 acceptance | 形成一张实施完成总判定表 | 可审查、可执行 |
| 未完成项 | 只有风险表和非范围表 | 分类为延期、风险接受、blocker | 防止 P0 缺口被弱化 |
| 证据 | Step 7 有路径规则 | 固定到 release evidence pack 和 acceptance handoff 审查 | 不依赖口头说明 |
| VETO | 验收标准有一票否决 | 写入实施完成硬阻断条件 | 避免用风险接受绕过 |
| design closure | Step 6/10 有暂停规则 | 写入完成判定硬门槛 | 防止第二真相进入交付 |

## 6. 实施计划取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只看 `cargo test` / release gate 通过 | 简单 | 无法证明 AC、EV、VETO、redaction 和 handoff 审查 | 不采用 |
| 以验收标准最终签署替代实施完成 | 结论明确 | 实施计划不应替代验收裁决,且签署需要额外角色 | 不采用 |
| 定义可送验的实施完成门槛 | 与 `06` 配合,不越权裁决 | 需要列证据与未完成项分类 | 采用 |
| 允许“基本完成,后续补证据” | 推进快 | 不可审查,违反规范 | 不采用 |
| 未完成项统一作为风险接受 | 便于收口 | 会放过 S / VETO / P0 A / evidence redline | 不采用 |
| 未完成项按延期 / 风险接受 / blocker 分类 | 可控且符合验收标准 | 需要严格判断影响面 | 采用 |

## 7. 结构化中间产物

### 7.1 实施完成总判定表

| 判定项 | 标准 | 证据 | 结论 |
|---|---|---|---|
| 需求覆盖 | `FR-WORK-001~008` 全部实现并有 `TC / EV / AC` 回链;`FR-WORK-E01~E05` 均为非 P0 或后续专项 | trace matrix、`evidence-index.md`、release summary | 通过 / 不通过 |
| 交付物完成 | Step 4 交付物均完成或有正式不适用说明 | final delivery checklist、commit list、crate / script / report refs | 通过 / 不通过 |
| 阶段与提交完成 | PH-01~PH-09、`commit-01-a`~`commit-09-a` 均完成,提交 message 合规 | git log、commit review、Step 6 / Step 11 映射 | 通过 / 不通过 |
| 测试门禁 | Step 7 所有 P0 阻断 suite 和 release gate 通过 | `reports/runs/<run_id>/gate-results.md`、suite reports | 通过 / 不通过 |
| 验收门禁可判定 | `AC-WORK-001~029` 均有证据,且无缺失 P0 evidence | `evidence-index.md`、`reports/acceptance/handoff.md` | 通过 / 不通过 |
| 一票否决 | `VETO-WORK-001~012` 与 `VF-WORK-001~008` 均 reviewed 且无 failed | `reports/acceptance/veto-checklist.md` | 通过 / 不通过 |
| 缺陷复验 | 无 S;无影响 P0 / release / P0 evidence 的未关闭 A;direct 和 impacted regression 已跑 | defect log、retest report、gate results | 通过 / 不通过 |
| 风险处理 | P0 risk 均关闭;P1/P2 risk 后续移交;允许风险均有 owner / 接受人 / 截止条件 | `risk-acceptance.md`、open issues、risk notes | 通过 / 不适用 / 不通过 |
| Spike 关闭 | `SP-WORK-001~007` 均产出 artifact、report 或设计回写结论 | spike outputs、report refs、design change refs | 通过 / 不通过 |
| 证据路径 | artifact / report / acceptance 全部固定 `<run_id>`,无 `latest`,raw artifact 对应 report | path check、`evidence-index.md`、report refs | 通过 / 不通过 |
| Redaction | truth、event、log、artifact、report、fixture dump 无 forbidden output | `redaction-check.md`、scan artifacts | 通过 / 不通过 |
| No-write | query、projection、reconciliation、report 不反写真相 | no-write report、state digest artifacts | 通过 / 不通过 |
| Dependency boundary | 编译期 sibling dependency 仅 `core-contracts` | dependency report、Cargo metadata | 通过 / 不通过 |
| Design closure | 字段、DTO、state、flow、config、test、acceptance、phase boundary 无未闭合冲突 | design closure review、commit review、blocker log | 通过 / 不通过 |
| Acceptance handoff | 固定 `run_id` 的 handoff、veto checklist、必要 risk acceptance 已由人 / Agent 审查 | `reports/acceptance/handoff.md`、review status | 通过 / 不通过 |

### 7.2 闭环项判定表

| 闭环项 | 完成标准 | 证据 | 结论 |
|---|---|---|---|
| 字段 / DTO 闭环 | 所有 P0 public protocol、domain object、repository return、job receipt 和 report DTO 按 `03` 正式 schema 落码,无 placeholder | contract tests、design closure checklist | 通过 / 不通过 |
| 状态闭环 | 代码、测试、report 和验收均使用 `03` / Step 10 的正式状态名和错误名 | domain state tests、state matrix coverage、report samples | 通过 / 不通过 |
| 事务闭环 | accepted command 同 UoW 完成 truth、正式定义的 history 或 trace、audit、outbox、projection stale 和 idempotency complete | service tests、UoW report、EVG audit evidence | 通过 / 不通过 |
| 幂等 / 并发闭环 | duplicate、dedup、version conflict、commit unknown 不产生重复 truth | idempotency / dedup / single-winner tests | 通过 / 不通过 |
| Visibility / authorization 闭环 | unauthorized command / query 不返回 visible truth,不写 truth | authorization negative report、query no-write report | 通过 / 不通过 |
| External body boundary | Work 只保存 ref / snapshot / summary marker,不保存相邻仓正文 | redaction report、forbidden body tests | 通过 / 不通过 |
| Projection / query 闭环 | read model stale / failed / rebuilding surface 成立,query 不修 truth | query suite、projection report、no-write digest | 通过 / 不通过 |
| Consumer / outbox 闭环 | inbound dedup、quarantine、dead-letter、outbox publish retry / failed marker 成立 | consumer-outbox report、event tests | 通过 / 不通过 |
| Job / maintenance 闭环 | rebuild、refresh、reconciliation、handoff job 有 item UoW、partial failure、rerun 和 report refs | job reports、operations replay evidence | 通过 / 不通过 |
| Config / dependency 闭环 | profile、adapter binding、fake marker、dependency boundary 和 unsupported feature fail-fast 成立 | config-fast、config-redline、dependency report | 通过 / 不通过 |
| Artifact / report 闭环 | P0 raw artifact、run report、acceptance handoff 和 evidence index 可互相回指 | release evidence pack、path check | 通过 / 不通过 |
| Phase boundary 闭环 | 无当前 phase 依赖后续 phase 才能解释的实现、测试或证据 | commit review、boundary checklist | 通过 / 不通过 |

### 7.3 交付证据项判定表

| 交付证据项 | 固定路径 | 完成标准 | 结论 |
|---|---|---|---|
| raw artifacts | `artifacts/test/<run_id>` | P0 suite 原始证据完整,失败也保留 `report.json`、stdout / stderr、failure reason | 通过 / 不通过 |
| suite reports | `reports/runs/<run_id>/suites/*.md` | 每个阻断 suite 有可读 summary、scope、fail / skip reason 和 design refs | 通过 / 不通过 |
| gate results | `reports/runs/<run_id>/gate-results.md` | release gate 和 selected gate 有 pass / fail / skipped reason / defect refs | 通过 / 不通过 |
| evidence index | `reports/runs/<run_id>/evidence-index.md` | P0 EV 全覆盖,包含 `EV / TC / AC / suite / artifact_refs / report_refs / design_contract_refs / redaction_status / review_status` | 通过 / 不通过 |
| redaction report | `reports/runs/<run_id>/redaction-check.md` | raw secret、token、payload、source body、runtime reasoning body、artifact body 零命中 | 通过 / 不通过 |
| no-write report | `reports/runs/<run_id>/no-write.md` 或 suite report 中同等章节 | query / projection / reconciliation / report before / after state digest 无写入 | 通过 / 不通过 |
| release summary | `reports/runs/<run_id>/release-summary.md` | 汇总 gate、defects、redline、open risks 和 evidence refs,不写最终裁决 | 通过 / 不通过 |
| acceptance handoff | `reports/acceptance/handoff.md` | 已补送验范围、基线、gate、开放问题、风险入口;不写最终裁决 | 通过 / 不通过 |
| veto checklist | `reports/acceptance/veto-checklist.md` | 全部 VETO 有结论、证据、缺陷和 review status | 通过 / 不通过 |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | 有条件通过时风险接受完整;无可接受风险时标 not_applicable | 通过 / 不适用 / 不通过 |

### 7.4 未完成项处理表

| 未完成项类型 | 可进入分类 | 条件 | 处理 |
|---|---|---|---|
| `FR-WORK-E01~E05` 增强能力 | 延期 | 已明确非 P0,不影响 `FR-WORK-001~008`、AC、VETO 或 P0 evidence | 进入后续专项或 open issue,不得作为 P0 完成缺口 |
| 真实 DB / MQ / search / trace / archive 产品 adapter | 延期 | P0 port + fake / in-memory / configured seam 已验证,未声称 production success | 进入 P1/P2 production integration 专项 |
| B / C 缺陷 | 风险接受 | 不影响 P0、release gate、P0 evidence、VETO、redaction、no-write 或 duplicate truth | 写入 `risk-acceptance.md`,标 owner、接受人、后续动作和截止条件 |
| 非阻断 nightly / staging-like 结果 | 风险接受 | release selected gate 未受影响,有 failure reason 和后续动作 | 写入 risk acceptance 或 open issues |
| P1/P2 production-like 能力未覆盖 | 延期或风险接受 | 不影响 P0 主线和 release evidence | 写入后续专项、owner 和截止点 |
| Spike 未产出 | blocker | 该 Spike 是对应 P0 boundary 或 release gate 的前置 | 补产出或回写计划后重跑 gate |
| P0 risk 未关闭 | blocker | 影响 PH-01~PH-09 任一阻断门禁或 P0 evidence | 暂停,修复或回写上游 |
| 任一 `VETO-WORK-*` failed | blocker | 一票否决命中 | 必须修复并复验,不得风险接受 |
| S 级缺陷 | blocker | 任一 S 未关闭 | 必须修复并复验 |
| 影响 P0 / release / P0 evidence 的 A 级缺陷 | blocker | 未关闭且未有上游正式降级 | 必须修复并复验 |
| redaction failed | blocker | forbidden output 命中 | 删除泄露面,补 scan,重跑 redaction |
| query / report no-write failed | blocker | 反写真相或写 trace / audit / outbox / idempotency | 修复 side effect,重跑 no-write |
| duplicate truth | blocker | duplicate / dedup / version conflict 产生重复 Work truth | 修复 single-winner / idempotency 并补回归 |
| evidence pack 缺失或引用 `latest` | blocker | P0 EV 缺失、路径错误、缺 report、缺 review | 重建固定 `<run_id>` evidence pack |
| 字段 / DTO / 状态 / phase boundary 冲突 | blocker | 当前 P0 需要但设计真相源不闭合 | 暂停并回写 `03/04/05/06/07` |

### 7.5 最终交付清单

| 交付项 | 必须存在 | 完成证据 |
|---|---|---|
| 实现仓 | `/home/aris/Projects/quantalithos-work` | git log、workspace check、source baseline |
| Rust workspace | root `Cargo.toml`、`crates/contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` | `cargo check`、crate boundary review |
| 编译期依赖 | 仅 `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | dependency report、Cargo metadata |
| Contracts surface | refs、commands、queries、events、jobs、views、errors、fixtures | contract tests、DTO roundtrip |
| Domain surface | Project、ProjectMember、Backlog、WorkItem、ChildWorkItem、Dependency、Blocker、Iteration、Trace、Outbox、Policy | domain tests、state matrix |
| Application surface | command / query / consumer / job services、ports、UoW、idempotency | service tests、transaction reports |
| Infra surface | in-memory stores、fake / configured adapters、runtime builder、projection stores、clock / id | integration-p0、config tests |
| API / worker / jobs | handlers、event consumers、outbox publisher、job runners | api-contract-fast、consumer-outbox、worker-job-contract |
| Config profiles | `local-dev`、`ci-test`、`integration-like`、`operations-replay` fixtures | config-fast、config-redline |
| Scripts | `scripts/gates/*`、`scripts/reports/*`、`scripts/checks/*`、`scripts/dev/*` as applicable | script help、path check |
| Tests | P0 unit / contract / service / integration / worker / job / config / redaction suites | suite reports、gate results |
| Artifacts | `artifacts/test/<run_id>` | raw artifact index、failure evidence |
| Run reports | `reports/runs/<run_id>` | gate-results、evidence-index、redaction-check、release-summary |
| Acceptance handoff | `reports/acceptance/handoff.md` | review status |
| Veto checklist | `reports/acceptance/veto-checklist.md` | all VETO reviewed |
| Risk acceptance | `reports/acceptance/risk-acceptance.md` | not_applicable 或 accepted B / C risks only |
| Open issues / residual risks | `reports/acceptance/open-issues.md` or linked section | owner、action、deadline、classification |

### 7.6 禁止宣称完成清单

| 情况 | 结论 |
|---|---|
| 使用“基本完成”“大体完成”“测试基本通过” | 不允许 |
| 正式 evidence 引用 `latest` | 不允许 |
| raw artifact 无对应可读 report | 不允许 |
| `reports/acceptance/*` 只有脚本初稿,无人或 Agent 审查 | 不允许 |
| 任一 VETO failed | 不允许 |
| S / P0 A / release redline 未关闭 | 不允许 |
| redaction failed 或 forbidden output 命中 | 不允许 |
| query / projection / report 反写真相 | 不允许 |
| duplicate truth 或 single-winner 失败 | 不允许 |
| configured adapter fallback fake success | 不允许 |
| 非 core sibling repo 进入 Cargo dependency | 不允许 |
| 字段、DTO、状态、命名、flow、config 或 phase boundary 仍冲突 | 不允许 |
| `FR-WORK-001~008` 任一缺实现、缺测试或缺 evidence | 不允许 |

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §12。

````markdown
## 12. 实施完成判定

> 校准来源:
> - `design-calibration/07_implementation_plan_step_12_completion_criteria.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“实施完成总判定表”“闭环项判定表”“交付证据项判定表”“未完成项处理表”“最终交付清单”和“禁止宣称完成清单”小节,了解本轮什么时候可以宣称实现已完成并可送验。

本轮不允许使用“基本完成”。只有当范围、交付物、门禁、证据、风险和设计闭环均可审查时,才允许宣称 L1-work P0 实施完成并进入验收交接。实施完成不等于最终验收通过;最终裁决仍由 `06-验收标准.md` 的签署规则决定。

| 判定项 | 标准 | 证据 | 结论 |
|---|---|---|---|
| 需求覆盖 | `FR-WORK-001~008` 全部实现并有 `TC / EV / AC` 回链;增强项均明确延期 | trace matrix、`evidence-index.md` | 通过 / 不通过 |
| 交付物完成 | workspace、contracts、domain、application、infra、api、worker、jobs、config、tests、scripts、artifacts、reports 全部完成 | final delivery checklist、commit list | 通过 / 不通过 |
| 阶段与提交完成 | PH-01~PH-09 与 `commit-01-a`~`commit-09-a` 均完成且提交合规 | git log、commit review | 通过 / 不通过 |
| 测试门禁 | 所有 P0 阻断 suite 和 release gate 通过 | `reports/runs/<run_id>/gate-results.md` | 通过 / 不通过 |
| 验收门禁可判定 | `AC-WORK-001~029` 均有 evidence | `reports/runs/<run_id>/evidence-index.md` | 通过 / 不通过 |
| 一票否决 | `VETO-WORK-001~012` 与 `VF-WORK-001~008` 均 reviewed 且无 failed | `reports/acceptance/veto-checklist.md` | 通过 / 不通过 |
| 缺陷复验 | 无 S;无影响 P0 / release / P0 evidence 的未关闭 A | defect log、retest report | 通过 / 不通过 |
| 风险处理 | P0 risk 均关闭;允许风险均有 owner / 接受人 / 截止条件 | `risk-acceptance.md`、open issues | 通过 / 不适用 / 不通过 |
| 证据路径 | artifact / report / acceptance 全部固定 `<run_id>`,无 `latest` | path check、report refs | 通过 / 不通过 |
| Redaction / no-write | forbidden output 零命中,query / projection / report 不反写真相 | `redaction-check.md`、no-write report | 通过 / 不通过 |
| Design closure | 字段、DTO、state、flow、config、test、acceptance、phase boundary 无未闭合冲突 | design closure review | 通过 / 不通过 |

未完成项必须按以下规则处理:

| 未完成项类型 | 处理 |
|---|---|
| 非 P0 增强能力、真实生产 adapter、config center、secret provider、advanced search | 延期到 P1/P2 或后续专项 |
| 不影响 P0 / release / evidence 的 B / C 风险 | 可进入 `reports/acceptance/risk-acceptance.md`,必须有 owner、接受人、动作和截止条件 |
| 任一 P0 risk、VETO failed、S、P0 A、redaction failed、no-write failed、duplicate truth、evidence 缺失、design closure 冲突 | blocker,必须修复并复验 |

正式交付证据至少包括:

- `artifacts/test/<run_id>` 原始 artifact。
- `reports/runs/<run_id>/gate-results.md`。
- `reports/runs/<run_id>/evidence-index.md`。
- `reports/runs/<run_id>/redaction-check.md`。
- `reports/runs/<run_id>/release-summary.md`。
- `reports/acceptance/handoff.md`。
- `reports/acceptance/veto-checklist.md`。
- `reports/acceptance/risk-acceptance.md` 或 not_applicable 说明。

以下情况禁止宣称完成:正式证据引用 `latest`,raw artifact 无 report,acceptance 文件未审查,任一 VETO failed,S / P0 A / release redline 未关闭,redaction failed,query / projection / report 反写真相,duplicate truth,configured adapter fallback fake success,非 core sibling repo 进入 Cargo dependency,或字段 / DTO / 状态 / phase boundary 仍冲突。
````

## 9. 待确认事项

| 项 | 当前结论 |
|---|---|
| 是否需要用户确认后进入 Step 13 | 是。用户要求每个 Step 完成后暂停审核。 |
| 是否创建正式 `07-实施计划.md` | 否。正式文档只在 Step 13 创建。 |
| 是否生成真实验收结论 | 否。本步只定义完成判定,不替代验收签署。 |
| 是否有阻塞进入 Step 13 的待确认事项 | 无。Step 13 将整理正式实施计划全文。 |

## 10. 本步完成判定

| 判定项 | 状态 |
|---|---|
| 回答 Step 12 SOP 问题 | 已完成 |
| 实施完成总判定表 | 已完成 |
| 闭环项判定表 | 已完成 |
| 交付证据项判定表 | 已完成 |
| 未完成项处理表 | 已完成 |
| 最终交付清单 | 已完成 |
| 禁止宣称完成清单 | 已完成 |
| §12 回填草稿 | 已完成 |
| 正式 `07-实施计划.md` 未创建 | 已验证 |
