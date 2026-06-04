# L1-conversation 07 实施计划 Step 7: 测试与验收门禁嵌入

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/07-实施计划.md` §7 测试与验收门禁嵌入
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 7 |
| 主题 | 嵌入测试与验收门禁 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/07_implementation_plan_step_07_tests_acceptance_gates.md` |

本步把 `05-测试方案.md` 和 `06-验收标准.md` 嵌入 PH-01~PH-08。它不重排阶段，不改 Step 6 的 commit boundary，不创建正式 `07-实施计划.md`。

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_05_phases_dependencies.md` | 已确认 | 继承 PH-01~PH-08 阶段顺序 |
| `07_implementation_plan_step_06_tasks_commits.md` | 已确认 | 继承阶段任务、代码批次和提交边界 |
| `05-测试方案.md` §5~§14 | 已完成 | 提取 TC、suite、artifact、report、EV 和脚本规则 |
| `06-验收标准.md` §5~§14 | 已完成 | 提取 AC、VETO、证据进入 / 退出条件和风险接受规则 |
| `03-详细设计.md` §15 | 已完成 | 提取 `run_ci_gate.sh`、`generate_reports.sh`、`check_redaction.sh` 脚本契约 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 每个阶段应执行哪些测试用例或测试切口 | 见 §7.1 阶段门禁矩阵；每个 PH 至少绑定一个 TC / suite。 |
| 2. 哪些阶段必须对齐验收标准 AC 项 | PH-02~PH-08 必须对齐 AC；PH-01 对齐 AC-SYNC-006、AC-NFR-010 和 AC-RED-008 的准备门禁。 |
| 3. 每个门禁需要产出什么证据 | 每阶段输出 run-scoped artifact，并通过 report 生成对应 EV 页面或 suite report。 |
| 4. 门禁失败是否允许继续进入下一阶段 | P0-blocking、redaction、path shape、VETO 相关失败不得进入下一阶段；readiness 风险只能在 PH-08 进入风险接受。 |
| 5. 哪些门禁可以自动化，哪些需要人工审查 | TC / suite / redaction / report path 可自动化；acceptance handoff、veto checklist、risk acceptance 和 open issues 必须人或 Agent 审查补充。 |
| 6. 哪些验收一票否决项需要在实施阶段提前规避 | VETO-CONV-001~014 均提前规避；其中 truth 缺失、授权失效、forbidden body、source truth 破坏、partial commit、fake-as-production 和证据缺失尤其需要阶段内阻断。 |
| 7. 每个阶段应调用哪些 `scripts/gates/*.sh` | PH-01 起使用 `scripts/gates/run_ci_gate.sh`；PH-08 还必须调用 release redline。 |
| 8. 每个阶段会输出哪些 `artifacts/test/<run_id>/...` | 见 §7.2；路径只允许 `artifacts/test/<run_id>/<suite>`，不得加 `<project>` 或 `latest`。 |
| 9. 哪些阶段需要调用 `scripts/reports/*.sh` 生成 `reports/runs/<run_id>` | PH-01 可验证 report skeleton；PH-02~PH-07 每阶段生成对应 suite / EV report；PH-08 生成完整 run report。 |
| 10. 哪些阶段需要生成或更新 `reports/acceptance/*` | 只有 PH-08 正式生成 `handoff.md`、`veto-checklist.md`；如有风险，还生成 `risk-acceptance.md` 和 `open-issues.md`。 |
| 11. 哪些报告必须由人或 Agent 审查补充后才能进入验收 | `reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md`、`open-issues.md` 必须审查补充。 |

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| Step 6 只写提交前门禁 | 没有完整 TC / AC / EV / report 映射 | 实施者可能只跑局部单测 | 本步补阶段门禁矩阵 |
| EV 与 AC 没有按 PH 固定 | `05` / `06` 分别定义证据和验收 | 阶段完成无法直接判断验收覆盖 | 本步把 EV、AC、VETO 嵌入 PH |
| reports / acceptance 容易提前或后补 | PH-08 才需要正式送验材料 | 早期误写 acceptance，或最终缺证据 | 本步区分运行报告和验收交接 |
| 失败处理容易模糊 | 有些 readiness 可接受，有些是 veto | 错把 S0 / S1 风险接受 | 本步固定 failure handling |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 测试门禁 | 分散在 `05` 和 Step 6 提交前门禁 | 每个 PH 绑定 TC / suite / script | 阶段完成可验证 |
| 验收门禁 | 分散在 `06` | 每个 PH 绑定 AC / VETO 防线 | 提前阻断验收红线 |
| 证据路径 | 已有全局规则 | 每阶段固定 artifact / report 输出 | 防止路径漂移 |
| 报告审查 | 只在测试方案说明 | 分阶段区分自动报告和人工审查 | 防止 acceptance 初稿未审查 |
| 失败处理 | 可能按实现者判断 | P0 / VETO 失败明确不得推进 | 降低错误放行 |

## 6. 实施计划取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 每个 commit boundary 都生成完整 release report | 证据最完整 | 过重，早期阶段没有完整 P0 证据 | 不采用 |
| 每个 PH 生成对应 suite artifact 和 EV 页面 | 证据随阶段增长 | 需要 report generator 支持增量输入 | 采用 |
| 只在 PH-08 统一测试 | 实现阶段更快 | 不符合 SOP，阶段不可验 | 不采用 |
| PH-08 统一生成 acceptance handoff | 避免早期误判通过 | 最终阶段压力较大 | 采用 |
| readiness 风险允许阶段内条件推进 | 可保持进度 | 易掩盖 P0 红线 | 仅允许非 P0 / 非 VETO 风险，并在 PH-08 审查 |

## 7. 结构化中间产物

### 7.1 阶段门禁矩阵

| 阶段 | 测试门禁 | 验收门禁 | 执行脚本 | artifact 输出 | report 输出 | 失败处理 |
|---|---|---|---|---|---|---|
| PH-01 | `cargo check`; path / script smoke; `TC-CONV-CONFIG-001` skeleton | AC-SYNC-006; AC-NFR-010; AC-RED-008 | `scripts/gates/run_ci_gate.sh --suite main-config --run-id <run_id>` | `artifacts/test/<run_id>/main-config` | `reports/runs/<run_id>/main-config.md` | compile、path、profile 或 script failure 阻断 PH-02 |
| PH-02 | `TC-CONV-SPACE-*`; `TC-CONV-SCOPE-*`; `SUITE-CONV-PR-UNIT`; `SUITE-CONV-PR-CONTRACT`; `SUITE-CONV-MAIN-SERVICE` | AC-FUNC-001; AC-RED-004; AC-SYNC-001; AC-STATE-001 | `scripts/gates/run_ci_gate.sh --suite main-service --run-id <run_id>` | `artifacts/test/<run_id>/main-service` | `reports/runs/<run_id>/evidence/EV-CONV-TRUTH-001.md` | P0 failure、sealed visibility failure 或 field drift 阻断 PH-03 |
| PH-03 | `TC-CONV-FACT-*`; `TC-CONV-TX-001`; `TC-CONV-FACT-004`; `SUITE-CONV-MAIN-SERVICE` | AC-FUNC-002; AC-RED-001/002; AC-TX-001; AC-IDEM-001; VETO-CONV-005/009/011 | `scripts/gates/run_ci_gate.sh --suite main-service --run-id <run_id>` | `artifacts/test/<run_id>/main-service` | `reports/runs/<run_id>/evidence/EV-CONV-FACT-001.md`; `reports/runs/<run_id>/redaction-check.md` | append-only、rollback、idempotency 或 forbidden body failure 阻断 PH-04 |
| PH-04 | `TC-CONV-QUERY-*`; `TC-CONV-SEARCH-001`; `TC-CONV-CURSOR-001`; `SUITE-CONV-MAIN-QUERY` | AC-FUNC-003/007; AC-RED-004/006/007; AC-TX-003; VETO-CONV-004/010 | `scripts/gates/run_ci_gate.sh --suite main-query --run-id <run_id>` | `artifacts/test/<run_id>/main-query` | `reports/runs/<run_id>/evidence/EV-CONV-AUTH-001.md` | authorization、query no-write、refs-only 或 cursor regression 阻断 PH-05 |
| PH-05 | `TC-CONV-MAN-*`; `TC-CONV-CONSUMER-*`; `TC-CONV-CONSUMER-003`; `SUITE-CONV-MAIN-WORKER-JOB`; integration-like resolver case | AC-FUNC-004; AC-RED-002/005; AC-SYNC-003/008; AC-CONS-002; VETO-CONV-007 | `scripts/gates/run_ci_gate.sh --suite main-worker-job --run-id <run_id>` | `artifacts/test/<run_id>/main-worker-job` | `reports/runs/<run_id>/evidence/EV-CONV-MAN-001.md`; `EV-CONV-CONSUMER-001.md` | source body、invalid envelope truth write、quarantine failure 或 digest overwrite 阻断 PH-06 |
| PH-06 | `TC-CONV-TRACE-001`; `TC-CONV-HANDOFF-*`; `SUITE-CONV-MAIN-WORKER-JOB`; handoff failure script | AC-FUNC-005; AC-SYNC-009; AC-STATE-004; AC-NFR-003; VETO-CONV-005/008 | `scripts/gates/run_ci_gate.sh --suite main-worker-job --run-id <run_id>` | `artifacts/test/<run_id>/main-worker-job` | `reports/runs/<run_id>/evidence/EV-CONV-HANDOFF-001.md` | handoff body leak、failure rollback 或 fake-as-production 阻断 PH-07 |
| PH-07 | `TC-CONV-OUTBOX-*`; `TC-CONV-DERIVED-*`; `TC-CONV-CURSOR-001`; `TC-CONV-CONSISTENCY-001`; `SUITE-CONV-NIGHTLY-OPS-REPLAY` | AC-FUNC-006/008; AC-SYNC-004/005/007; AC-STATE-003/004; AC-IDEM-002; VETO-CONV-003/010/011 | `scripts/gates/run_ci_gate.sh --suite nightly-ops-replay --run-id <run_id>` | `artifacts/test/<run_id>/nightly-ops-replay` | `reports/runs/<run_id>/evidence/EV-CONV-OUTBOX-001.md`; `EV-CONV-DERIVED-001.md` | duplicate publish、auto repair truth、cursor regression 或 missing report ref 阻断 PH-08 |
| PH-08 | `TC-CONV-REPORT-001`; `TC-CONV-REDACTION-001`; all P0-blocking TC; `SUITE-CONV-RELEASE-REDLINE`; `SUITE-CONV-RELEASE-REPORT` | AC-EVID-001~008; AC-NFR-010~012; VETO-CONV-001~014 | `scripts/gates/run_ci_gate.sh --suite release-redline --run-id <run_id>`; `scripts/checks/check_redaction.sh`; `scripts/reports/generate_reports.sh` | `artifacts/test/<run_id>/release-redline` | `reports/runs/<run_id>`; `reports/acceptance/*` | any VETO、S0/S1、redaction、path、P0 EV missing -> 不通过；S2/S3 only 可进入风险接受 |

### 7.2 报告生成与审查表

| 阶段 | 生成脚本 | 输入 artifact | 输出 report | 人 / Agent 审查要求 |
|---|---|---|---|---|
| PH-01 | `scripts/reports/generate_reports.sh --suite main-config` | `artifacts/test/<run_id>/main-config` | `reports/runs/<run_id>/main-config.md` | 检查路径、profile 和 fake marker，没有验收结论 |
| PH-02~PH-04 | `scripts/reports/generate_reports.sh --suite <suite>` | service / query suite artifact | `reports/runs/<run_id>/evidence/EV-CONV-TRUTH-001.md`; `EV-CONV-FACT-001.md`; `EV-CONV-AUTH-001.md` | 检查 TC / AC 追溯、失败解释和无 forbidden body |
| PH-05~PH-07 | `scripts/reports/generate_reports.sh --suite <suite>` | worker / job / operations artifact | `EV-CONV-MAN-001.md`; `EV-CONV-CONSUMER-001.md`; `EV-CONV-HANDOFF-001.md`; `EV-CONV-OUTBOX-001.md`; `EV-CONV-DERIVED-001.md` | 检查 source isolation、fake marker、rerun 和 no-auto-repair 证据 |
| PH-08 / commit-08-a | `scripts/reports/generate_reports.sh --run-id <run_id>` | `artifacts/test/<run_id>` | `reports/runs/<run_id>/summary.md`; 最小 `evidence-index.md`; `gate-results.md`; `redaction-check.md` | 审查 path shape、链接、失败摘要和 redaction,不生成 acceptance 结论 |
| PH-08 / commit-08-b | `scripts/reports/generate_reports.sh --run-id <run_id>` | `artifacts/test/<run_id>` | 完整 `evidence-index.md`; `reports/runs/<run_id>/evidence/EV-CONV-*.md` | 审查 EV 覆盖和 P0 evidence 完整性 |
| PH-08 | acceptance report generator 或 report script 子命令 | `reports/runs/<run_id>` | `reports/acceptance/handoff.md`; `veto-checklist.md`; optional `risk-acceptance.md`; `open-issues.md` | 必须由人或 Agent 补充 baseline、scope、commit、run id、风险 owner、截止时间和 veto 结论 |

### 7.3 证据归档规则

| 证据类别 | 规则 |
|---|---|
| artifact root | 只允许 `artifacts/test/<run_id>`；每个 suite 使用子目录，例如 `main-service`、`main-query`、`nightly-ops-replay`、`release-redline` |
| report root | 人类可读报告只允许 `reports/runs/<run_id>` 和 `reports/acceptance` |
| 禁止路径 | 不得使用 `artifacts/test/<project>/<run_id>`、`reports/<project>`、`latest` 或隐式当前 run |
| EV 页面 | commit-08-a 只要求最小 `evidence-index.md` 壳可从 `artifacts/test/<run_id>/evidence-index.json` 渲染;commit-08-b / final release gate 要求每个 P0 EV 在 `reports/runs/<run_id>/evidence/EV-CONV-*.md` 中出现并被完整 `evidence-index.md` 引用 |
| failure summary | 失败 suite 也必须保留 stdout / stderr、tc-results、failure summary 和重跑说明 |
| redaction | `redaction-check.md` 必须扫描 artifact 与 report；命中 raw secret、raw payload、forbidden body 即阻断 |
| acceptance | `reports/acceptance/*` 只能作为 PH-08 送验交接；脚本初稿不等于审查通过 |

### 7.4 门禁失败处理口径

| 失败类型 | 是否允许进入下一阶段 | 处理方式 |
|---|---|---|
| compile / workspace / path shape failure | 否 | 修复后重跑 PH-01 gate |
| P0-blocking TC failure | 否 | 修复对应 boundary，重跑直接 TC、同组 TC 和相关 suite |
| redaction / forbidden body failure | 否 | 定位泄漏源，清理 artifact / report，重跑 redaction 和相关功能 suite |
| VETO-CONV-* 命中 | 否 | 最终只能不通过；必须修复并重新生成证据 |
| design / test / acceptance 冲突 | 否 | 暂停实现，回到 design repo 修正文档并提交新 baseline |
| nightly readiness failure | 有条件 | 仅限不影响 P0 truth、安全、redaction、evidence 的 S2 / S3；PH-08 写入 risk / open issues |
| P1 / P2 非范围缺口 | 有条件 | 不阻断 P0，但必须在 PH-08 acceptance handoff 中说明 |
| report generator failure | 否 | 保留 failure artifact，修复脚本或输入后重跑报告生成 |

### 7.5 一票否决提前规避表

| VETO | 提前规避阶段 | 规避方式 |
|---|---|---|
| VETO-CONV-001 核心能力缺失 | PH-02~PH-08 | 每个 PH 生成对应 EV，不允许跳过核心闭环 |
| VETO-CONV-003 / 010 truth 被反写或自动修复 | PH-04 / PH-07 | query no-write、projection no-auto-repair、consistency report-only |
| VETO-CONV-004 授权失效 | PH-02 / PH-04 | sealed visibility、authorized query、hidden fact negative cases |
| VETO-CONV-005 / 006 forbidden body 或 secret 泄漏 | PH-03 / PH-05 / PH-06 / PH-08 | forbidden body negative cases 和 redaction check |
| VETO-CONV-007 source truth isolation 被破坏 | PH-05 | unresolved、digest mismatch 和 source body absent tests |
| VETO-CONV-009 partial commit | PH-03 / PH-05 | UoW rollback、consumer transaction 和 outbox enqueue failure tests |
| VETO-CONV-011 duplicate / conflict | PH-03 / PH-07 | command idempotency、event idempotency、stable event id |
| VETO-CONV-013 fake-as-production | PH-01 / PH-05~PH-08 | config fake marker、acceptance handoff 风险说明 |
| VETO-CONV-014 evidence 缺失 | PH-08 | evidence index、gate results、redaction check、veto checklist 全覆盖 |

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §7。正式文档生成时应从本文件摘录，不重新发明 TC、AC、EV 或脚本路径。

````markdown
## 7. 测试与验收门禁嵌入

> 校准来源：
> - `design-calibration/07_implementation_plan_step_07_tests_acceptance_gates.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“阶段门禁矩阵”“报告生成与审查表”“证据归档规则”“门禁失败处理口径”和“一票否决提前规避表”小节，了解每个阶段如何把 `05-测试方案.md` 与 `06-验收标准.md` 嵌入实施过程。

正式 §7 应摘录：

1. §7.1 阶段门禁矩阵。
2. §7.2 报告生成与审查表。
3. §7.3 证据归档规则。
4. §7.4 门禁失败处理口径。
5. §7.5 一票否决提前规避表。

正式 §7 不得把测试统一后置到 PH-08。PH-08 只负责 release gate、最终报告、验收交接和风险接受，不替代 PH-02~PH-07 的阶段门禁。
````

## 9. 待确认事项

| 事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| 是否每个 PH 都生成 EV 页面 | A: 每阶段生成对应 EV；B: PH-08 统一生成全部 EV | 推荐 A | EV 随阶段增长更容易定位失败；PH-08 的 commit-08-a 只验证最小 index 壳,commit-08-b 再做完整总索引和送验 |
| nightly readiness failure 是否允许推进 | A: 全部阻断；B: 非 P0 / 非 VETO 的 S2/S3 可条件推进 | 推荐 B | projection / integration-like readiness 可能不影响 P0 truth，但必须在 PH-08 风险接受 |
| acceptance handoff 是否提前生成 | A: 每阶段生成；B: PH-08 生成并审查 | 推荐 B | acceptance handoff 需要 fixed implementation commit、run id 和完整 P0 EV，提前生成容易误导 |

建议接受上述推荐。它们既满足阶段性验证，也避免把送验结论提前写成未审查事实。

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 阶段门禁矩阵完整 | 已满足 |
| 每个阶段至少绑定一个测试门禁 | 已满足 |
| 涉及外部可见行为、状态转换、跨仓交互或数据一致性的阶段已绑定 AC | 已满足 |
| 证据归档和失败处理已明确 | 已满足 |
| `reports/acceptance/*` 的审查责任已明确 | 已满足 |
| 未创建正式 `07-实施计划.md` | 已满足 |

Step 7 可以进入 Step 8。Step 8 应继续严格单 Step 执行，专门定义配置、环境与外部依赖准备，不重写测试门禁或提交边界。
