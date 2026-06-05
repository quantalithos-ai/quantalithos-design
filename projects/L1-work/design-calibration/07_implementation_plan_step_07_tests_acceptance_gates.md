# L1-work 07 实施计划 Step 7: 测试与验收门禁嵌入

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-work/07-实施计划.md` §7 测试与验收门禁嵌入
> 状态: `[x] 已完成`
> 日期: 2026-06-05

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 7 |
| 主题 | 嵌入测试与验收门禁 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-work/design-calibration/07_implementation_plan_step_07_tests_acceptance_gates.md` |

本步把 `05-测试方案.md` 和 `06-验收标准.md` 的测试、证据、报告、验收和一票否决口径嵌入 PH-01~PH-09 与 `commit-01-a`~`commit-09-a`。本步不新增 `TC-WORK-*`、`EV-WORK-*`、`AC-WORK-*` 或 `VETO-WORK-*`,也不创建正式 `07-实施计划.md`。

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_05_phases_dependencies.md` | 已确认 | 继承 PH-01~PH-09、阶段目标、阶段依赖和阶段门禁 |
| `07_implementation_plan_step_06_tasks_commits.md` | 已确认 | 继承 22 个 commit boundary、批次、提交时机和提交前门禁 |
| `05-测试方案.md` §5~§13 | 已完成 | 提取 `TC-WORK-*`、`EV-WORK-*`、suite、gate、artifact、report、defect、entry / exit 和 evidence index |
| `06-验收标准.md` §4~§14 | 已完成 | 提取进入 / 退出条件、`AC-WORK-*`、红线、状态 / 事务 / NFR、证据门禁、`VETO-WORK-*` 和签署边界 |
| `04-配置设计.md` §7~§13 | 已完成 | 提取 `run_id`、artifact root、report root、profile、redaction、fail-fast 和 path stability |
| `standards/document/实施计划讨论流程_SOP.md` Step 7 | 已读取 | 约束阶段门禁矩阵、证据归档、报告生成、失败处理和审查责任 |

校准来源:

- `design-calibration/05_test_plan_step_06_cases_matrix.md`
- `design-calibration/05_test_plan_step_09_automation_gates.md`
- `design-calibration/05_test_plan_step_12_entry_exit.md`
- `design-calibration/05_test_plan_step_13_reports_evidence.md`
- `design-calibration/06_acceptance_step_04_entry_exit.md`
- `design-calibration/06_acceptance_step_05_function_gate.md`
- `design-calibration/06_acceptance_step_06_data_architecture_redline.md`
- `design-calibration/06_acceptance_step_08_state_transaction_consistency.md`
- `design-calibration/06_acceptance_step_09_non_functional_gate.md`
- `design-calibration/06_acceptance_step_10_observability_evidence.md`
- `design-calibration/06_acceptance_step_11_veto.md`

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 每个阶段应执行哪些测试用例或测试切口 | PH-01 执行 workspace / config / path / dependency smoke;PH-02~PH-08 绑定 CORE、MEMBER、FORMAL、PROMOTE、DEP、ITER、QUERY、OPS、CFG、NFR 用例族;PH-09 执行 release gate 和 evidence pack。 |
| 2. 哪些阶段必须对齐验收标准 AC 项 | PH-02~PH-08 必须对齐对应 `AC-WORK-001~013` 和相关红线 / 状态 / NFR;PH-09 对齐 `AC-WORK-024~029`、证据门禁和全部 `VETO-WORK-*`。 |
| 3. 每个门禁需要产出什么证据 | 每个阻断门禁必须产出 `artifacts/test/<run_id>/...` 下的原始 artifact,并在需要报告时写入 `reports/runs/<run_id>/...`;P0 证据必须进入 evidence index。 |
| 4. 门禁失败是否允许继续进入下一阶段 | P0 阻断 suite、redaction、no-write、dependency boundary、evidence index 或任一 veto 失败时不得进入下一阶段;nightly 非 release selected 失败只能进入风险队列,不得伪装通过。 |
| 5. 哪些门禁可以自动化,哪些需要人工审查 | fmt / check / suite / path / redaction / evidence index 结构检查可自动化;gate results、evidence index、redaction report、acceptance handoff、veto checklist 和 risk acceptance 必须人工或 Agent 审查。 |
| 6. 哪些验收一票否决项需要在实施阶段提前规避 | `VETO-WORK-001~012` 均要前置规避;其中 dependency boundary、forbidden body、query no-write、configured adapter fake fallback、duplicate truth 和 evidence path 要从 PH-01 起持续检查。 |
| 7. 每个阶段应调用哪些 `scripts/gates/*.sh` | PH-01~PH-08 以 PR / main gate 的目标 suite 为主;PH-08 可加 replay selected;PH-09 调用 release gate。具体脚本入口由 PH-01 创建,但语义必须覆盖 PR、main、nightly / replay 和 release 四类 gate。 |
| 8. 每个阶段会输出哪些 artifact | 所有阶段均输出到 `artifacts/test/<run_id>/...`;suite 输出位于 `artifacts/test/<run_id>/suites/<suite>/...`;redaction、path、fake marker、evidence index 等检查输出位于对应 checks / scan 子目录。 |
| 9. 哪些阶段需要调用 `scripts/reports/*.sh` 生成 `reports/runs/<run_id>` | 每个形成阻断 suite 的阶段都应生成或更新 suite summary 和 gate results;PH-07 起必须生成 no-write / projection 相关报告;PH-08 起必须生成 job / redaction / operations 报告;PH-09 生成 release summary 和完整 evidence index。 |
| 10. 哪些阶段需要生成或更新 `reports/acceptance/*` | 只有 PH-09 必须生成 `reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md` 和 `open-issues.md`;PH-01~PH-08 不写验收裁决,只保留可被 PH-09 汇总的 run reports。 |
| 11. 哪些报告必须由人或 Agent 审查补充后才能进入验收 | `gate-results.md`、`evidence-index.md`、`redaction-check.md`、`release-summary.md`、`reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md` 必须审查;acceptance handoff 不得写最终验收裁决。 |

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 阶段门禁只到族级别 | Step 5 / Step 6 已写 CORE / QUERY / OPS 等门禁,但没有报告和证据要求 | 实现阶段可能只跑测试,不产可复核证据 | 本步补 phase gate、commit gate、artifact 和 report 规则 |
| 验收标准可能被最后才读取 | `AC-WORK-*` 和 `VETO-WORK-*` 在 `06` 中完整,但实施计划尚未嵌入 | 到 PH-09 才发现一票否决项 | 本步把 VETO 前置到最早可能阶段 |
| report 和 artifact 容易混淆 | `05` 要求 raw artifact 与 readable report 分层 | 审查时无法追溯机器证据 | 本步固定 artifact root、report root 和 acceptance handoff root |
| 查询 / operations no-write 风险高 | PH-07 / PH-08 都有读写边界和维护边界 | gate 不提前绑定会导致 late failure | 本步把 no-write、redaction 和 recovery marker 写进阶段与 commit 门禁 |
| 失败处理未落到阶段 | `05` / `06` 有缺陷分级,但 Step 6 只写提交前门禁 | 失败后可能继续推进或覆盖失败证据 | 本步补失败处理矩阵和证据保留要求 |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 阶段测试 | 阶段表只列测试族 | 每个 PH 绑定 suite、TC / EV、report 和失败处理 | 阶段完成可复核 |
| 提交前验证 | commit boundary 有最小门禁 | 每个 boundary 有 suite、artifact、report 和审查要求 | 每笔提交可 review / 回退 |
| 验收嵌入 | `AC` / VETO 独立在 `06` | `AC` / VETO 前置到阶段和 release gate | 避免最后才触发硬否决 |
| 证据路径 | `05` 定义路径 | 实施计划要求每阶段使用固定 `<run_id>` | 证据不依赖口头确认 |
| 报告审查 | `05` 有报告清单 | 实施计划明确人 / Agent 审查责任 | 防止脚本生成即误当验收通过 |
| 失败处理 | 缺陷规则在测试 / 验收文档 | 实施阶段明确 fail-stop、artifact 保留、缺陷和回归 | 防止失败证据被覆盖 |

## 6. 实施计划取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 每个 commit 都跑 release gate | 质量最高 | 速度慢,会把 PH-09 的职责提前 | 不采用 |
| 每个阶段只跑单测 | 快 | API、UoW、redaction、evidence 和 no-write 风险后移 | 不采用 |
| 阶段按风险绑定最小阻断 suite | 可执行,反馈快 | 需要 PH-09 再全量收口 | 采用 |
| artifact 和 report 同目录 | 查找简单 | 原始证据与人读报告混杂 | 不采用 |
| 所有 reports 都自动通过 | 实现简单 | 违背验收交接和一票否决审查 | 不采用 |
| 自动化生成 + 人 / Agent 审查 | 保持效率,证据可复核 | 需要审查清单 | 采用 |

## 7. 结构化中间产物

### 7.1 全局门禁规则

| 规则 | 要求 |
|---|---|
| run id | 所有 gate 必须显式使用 `run_id`;正式 artifact / report / acceptance handoff 不得引用 `latest` |
| artifact root | 原始机器证据统一写入 `artifacts/test/<run_id>` |
| report root | 人类可读报告统一写入 `reports/runs/<run_id>` |
| acceptance root | 送验交接材料统一写入 `reports/acceptance` |
| suite artifact | suite 机器结果必须至少包含 `report.json`、stdout、stderr、failure reason 或 skipped reason |
| evidence index | P0 evidence 必须能表达 `EV-WORK-* -> TC-WORK-* -> AC-WORK-* -> design_contract_refs -> artifact_refs` |
| failure artifact | 失败 suite 也必须保留 artifact,不得被后续成功 run 覆盖或删除 |
| redaction | raw secret、token、payload、source body、runtime body 和外部正文命中时阻断 |
| no-write | query、projection、reconciliation 和 report 不能反写真相;相关 gate 失败时阻断 |
| acceptance handoff | `reports/acceptance/handoff.md` 只写事实、开放问题和风险入口,不写最终验收裁决 |

### 7.2 阶段门禁矩阵

| 阶段 | 测试门禁 | 验收门禁 | 执行脚本类别 | artifact 输出 | report 输出 | 失败处理 |
|---|---|---|---|---|---|---|
| PH-01 | workspace check、dependency boundary、config smoke、script help、path check | `RL-WORK-ARCH-007`;`RL-WORK-EVID-001`;预防 `VETO-WORK-007/010/012` | `scripts/gates/*.sh`;`scripts/checks/*.sh` skeleton | `artifacts/test/<run_id>/suites/config-fast`;checks / path / dependency artifacts | `reports/runs/<run_id>/config-fast.md`;gate skeleton summary | 任何路径、依赖或 config redline 失败即停止;不得进入业务纵切 |
| PH-02 | `unit-contract-domain` CORE selected;`service-core` CORE selected | `AC-WORK-001/006`;`ST-WORK-TX-001/002`;`ST-WORK-IDEM-001/002`;预防 `VETO-WORK-001/006/009` | PR gate selected;report collection | `artifacts/test/<run_id>/suites/unit-contract-domain`;`.../service-core` | CORE suite summary;gate results;CORE evidence drafts | CORE 主线、duplicate 或 UoW 失败即停止;保留 failure reason 并补回归用例 |
| PH-03 | MEMBER contract / domain / service selected;resolver unavailable selected | `AC-WORK-002/007`;`RL-WORK-ARCH-001`;预防 `VETO-WORK-003/004` | PR gate selected;main gate selected if resolver seam touches integration | `artifacts/test/<run_id>/suites/service-core`;`.../integration-p0` selected | MEMBER suite summary;resolver negative report | identity body 或 ownership 越界失败即停止;不得风险接受 |
| PH-04 | FORMAL / PROMOTE contract、domain、service、redaction selected、version conflict selected | `AC-WORK-003/008/009`;`RL-WORK-DATA-002`;预防 `VETO-WORK-002/004/009` | PR gate selected;main gate selected;redaction check selected | `artifacts/test/<run_id>/suites/service-all`;`artifacts/test/<run_id>/redaction-scan` | FORMAL / PROMOTE suite summary;redaction slice report | forbidden body、multi-winner 或 raw output 命中即停止;补自动化防回归 |
| PH-05 | DEP contract / graph / service selected;evidence resolver selected;redaction selected | `AC-WORK-010/019/020/027/028`;预防 `VETO-WORK-004/006` | PR gate selected;main gate selected | `artifacts/test/<run_id>/suites/service-all`;evidence resolver artifacts | DEP suite summary;evidence ref report | cycle accept、missing evidence resolve 或 body 保存失败即停止 |
| PH-06 | ITER contract / domain / service selected;concurrency selected | `AC-WORK-004/011`;`ST-WORK-CONC-001`;预防 `VETO-WORK-001/009` | PR gate selected;main gate selected;nightly stress optional | `artifacts/test/<run_id>/suites/service-all`;concurrency selected artifacts | ITER suite summary;concurrency selected report | 非 formal commit、非法 reopen、single-winner 失败即停止 |
| PH-07 | `api-contract-fast` QUERY;`service-core` QUERY;`integration-p0` selected;no-write checks | `AC-WORK-005/012/021/022/023/027`;`ST-WORK-TX-003`;预防 `VETO-WORK-005/008/012` | PR gate;main gate;report collection;path / no-write checks | `artifacts/test/<run_id>/suites/api-contract-fast`;`.../integration-p0`;no-write artifacts | QUERY suite summary;projection freshness report;no-write report | unauthorized leak、projection failed surface 缺失或 query write 失败即停止 |
| PH-08 | `worker-job-contract`;`consumer-outbox`;OPS selected;CFG / NFR redaction selected;operations replay selected when applicable | `AC-WORK-013/015/019/021/025/028/029`;`ST-WORK-TX-004`;`ST-WORK-REC-*`;预防 `VETO-WORK-004/005/009/010/011` | main gate;nightly / replay gate selected;redaction and fake marker checks | `artifacts/test/<run_id>/suites/worker-job-contract`;`.../consumer-outbox`;`.../operations-replay`;redaction scan | OPS suite summary;job reports;redaction check;replay selected report | job truth repair、silent success、fake fallback 或 redaction 失败即停止 |
| PH-09 | `release-main-smoke`;`release-config-redline`;`release-evidence-pack`;selected replay / integration-like if in scope | `AC-WORK-024~029`;`EVG-WORK-*`;全部 `VETO-WORK-*`;release conclusion input | release gate;report builders;acceptance handoff builders | `artifacts/test/<run_id>/suites/release-*`;release evidence artifacts | `reports/runs/<run_id>/gate-results.md`;`evidence-index.md`;`redaction-check.md`;`release-summary.md`;`reports/acceptance/*` | 任一 release redline、VETO、P0 EV 缺失或路径错误即不得送验通过 |

### 7.3 Commit Boundary 门禁矩阵

| 提交边界 | 测试 / 检查门禁 | 证据与报告 | 人 / Agent 审查要求 | 失败处理 |
|---|---|---|---|---|
| commit-01-a | fmt / check、dependency boundary、crate naming | dependency artifact;workspace check summary | 审查非 core sibling dependency 为 0 | 不提交,修复 workspace / dependency |
| commit-01-b | config smoke、script help、path check | config-fast artifact;path check artifact | 审查 artifact / report root 无错误 | 不提交,修复 skeleton |
| commit-02-a | CORE contract / domain selected | unit-contract-domain artifact;CORE draft evidence | 审查 DTO / domain 与设计 refs 对齐 | 不提交,回到 contract / domain |
| commit-02-b | `TC-WORK-CORE-001~004` service selected | service-core artifact;CORE suite summary | 审查 UoW、outbox、trace、idempotency 证据 | 不提交,保留 failure reason |
| commit-03-a | MEMBER contract / domain selected | member protocol / domain artifact | 审查 identity boundary 无 body ownership | 不提交,修正 member truth |
| commit-03-b | `TC-WORK-MEMBER-001~004` selected | service-core / integration selected artifact | 审查 resolver unavailable 和 accepted truth 边界 | 不提交,补 negative case |
| commit-04-a | FORMAL contract / domain / redaction selected | unit / redaction selected artifacts | 审查 maintenance lock 和 forbidden body guard | 不提交,redaction 失败不得接受 |
| commit-04-b | `TC-WORK-FORMAL-001~005` selected | service-all selected artifact;FORMAL evidence | 审查 lifecycle、stale marker 和 reject rollback | 不提交,补 service 回归 |
| commit-04-c | `TC-WORK-PROMOTE-001~005`;version conflict selected | PROMOTE artifact;conflict report | 审查 accept / reject / version single-winner | 不提交,补 concurrency / idempotency 回归 |
| commit-05-a | DEP contract / graph / state selected | dependency graph artifact | 审查 cycle reject 和 terminal guard | 不提交,修正 graph invariant |
| commit-05-b | `TC-WORK-DEP-001~005`;redaction selected | service-all artifact;evidence ref report | 审查 evidence ref only 和 no body | 不提交,补 resolver / redaction case |
| commit-06-a | ITER contract / domain / state selected | iteration domain artifact | 审查 state enum 和 illegal transition | 不提交,修正状态机 |
| commit-06-b | `TC-WORK-ITER-001~005`;concurrency selected | service-all artifact;concurrency report | 审查 process ref boundary 和 single-winner | 不提交,补 UoW / version test |
| commit-07-a | query / view / page protocol selected | api-contract-fast artifact | 审查 page、view、error surface 和 DTO roundtrip | 不提交,修正 public protocol |
| commit-07-b | `TC-WORK-QUERY-001~005`;no-write selected | service-core artifact;no-write report | 审查 authorized read 与 projection freshness | 不提交,query write 即阻断 |
| commit-07-c | `TC-WORK-QUERY-006~008`;integration selected | api / integration artifacts;trace / board report | 审查 trace page、search 和 board 不写 truth | 不提交,补 no-write 回归 |
| commit-08-a | event / job contract selected | worker-job-contract schema artifact | 审查 event / job receipt 和 failure surface | 不提交,修正 protocol |
| commit-08-b | consumer dedup / marker selected;redaction selected | consumer-outbox artifact;redaction slice | 审查 duplicate / digest conflict / quarantine | 不提交,补 dedup negative |
| commit-08-c | outbox publish / retry / failed selected | consumer-outbox artifact;outbox report | 审查 retry、failed marker 和 event body boundary | 不提交,补 publication state test |
| commit-08-d | projection rebuild、reference refresh、reconciliation selected | operations artifacts;read-only report | 审查 rebuild truth source 和 report read-only | 不提交,job truth repair 即阻断 |
| commit-08-e | handoff jobs、rerun、redaction selected | handoff artifacts;redaction report | 审查 failed marker、rerun idempotency 和 no body | 不提交,补 handoff recovery test |
| commit-09-a | release gates、evidence pack、veto checklist | release artifacts;acceptance handoff | 人 / Agent 审查全部 release reports 和 VETO | 不送验,修复后重跑 release gate |

### 7.4 Artifact 与 Report 输出矩阵

| 输出类别 | 生成阶段 | 输入 | 输出位置 | 审查要求 |
|---|---|---|---|---|
| suite artifact | PH-01~PH-09 | gate suite execution | `artifacts/test/<run_id>/suites/<suite>/...` | 失败也必须保留 `report.json`、stdout / stderr 和 failure reason |
| check artifact | PH-01~PH-09 | path、dependency、redaction、fake marker、evidence index checks | `artifacts/test/<run_id>/checks/...` 或 `artifacts/test/<run_id>/redaction-scan/...` | 检查 artifact 只写 safe summary、ref、digest 或 sanitized location |
| suite report | PH-02~PH-09 | suite artifact | `reports/runs/<run_id>/suites/<suite>.md` | Agent 审查失败解释、设计 refs 和 scope |
| gate results | PH-02~PH-09 | suite reports / report.json | `reports/runs/<run_id>/gate-results.md` | Agent 审查阻断 / 非阻断分类;release 前人工确认 |
| evidence index | PH-09 必须;PH-02~PH-08 可增量 | `EV-WORK-*` artifacts 和 suite reports | `reports/runs/<run_id>/evidence-index.md` | 必须回指 `TC / AC / design_contract_refs / artifact_refs` |
| redaction report | PH-04 起 selected;PH-08 / PH-09 必须 | redaction scan、path check、fake marker | `reports/runs/<run_id>/redaction-check.md` | 任一 forbidden output 命中即阻断 |
| NFR report | PH-08 / PH-09 | service / job duration、availability、idempotency、observability artifacts | `reports/runs/<run_id>/nfr-summary.md` | 性能观察只看 presence 和样本,不把旧数字当硬阈值 |
| release summary | PH-09 | gate results、evidence index、redaction、defects | `reports/runs/<run_id>/release-summary.md` | 人 / Agent 审查 release redline 和 open risks |
| acceptance handoff | PH-09 | release reports | `reports/acceptance/handoff.md` | 只写事实摘要、开放问题和风险入口;不得写最终裁决 |
| veto checklist | PH-09 | VETO evidence、redaction、gate results | `reports/acceptance/veto-checklist.md` | 每个 `VETO-WORK-*` 必须有结论、证据、缺陷和 review status |
| risk acceptance | PH-09 | B / C risk candidates | `reports/acceptance/risk-acceptance.md` | S / VETO / P0 A 不得进入风险接受 |

### 7.5 门禁失败处理矩阵

| 失败类型 | 是否允许继续下一阶段 | 必须保留的证据 | 必须动作 |
|---|---|---|---|
| fmt / check / compile 失败 | 否 | stdout / stderr、failure reason | 修复后重跑同一 gate |
| P0 suite 失败 | 否 | suite `report.json`、stdout / stderr、failure reason、defect ref | 建 S / A 缺陷,补直接回归和同族回归 |
| redaction / forbidden output 失败 | 否 | redaction artifact、sanitized location、defect ref | 删除泄露面,补 scan 防回归,不得风险接受 |
| dependency boundary 失败 | 否 | dependency report、Cargo metadata | 移除非 core sibling dependency,重跑 check |
| query / projection / report no-write 失败 | 否 | before / after state digest、no-write report | 修正 side effect,补 no-write 回归 |
| duplicate / dedup / version conflict 失败 | 否 | idempotency / dedup artifact、state snapshot digest | 修正 single-winner 或 duplicate result,补 stress selected |
| job silent success / fake fallback 失败 | 否 | job report、fake marker check、config profile evidence | 改为 failed / unavailable / marker surface,补 config redline |
| evidence index 缺 P0 EV | 否 | evidence index check artifact | 补缺失 EV、TC、AC、artifact refs 后重建报告 |
| release VETO 失败 | 否 | veto checklist、相关 suite / report refs | 修复后重跑 release gate;不得风险接受 |
| nightly 非 release selected 失败 | 可以不阻断当前提交,但不得标记通过 | nightly artifact、risk ref | 进入风险 / 缺陷队列;若 release selected 则转阻断 |
| 设计闭环缺口 | 否 | blocker 说明、涉及文档 refs | 暂停实现,回写设计真相源,不在代码侧补第二真相 |

### 7.6 报告审查责任矩阵

| 报告 | 生成责任 | Agent 审查 | 人工审查 | 进入验收条件 |
|---|---|---|---|---|
| `reports/runs/<run_id>/suites/<suite>.md` | gate / report 脚本 | 检查 suite scope、fail / skip reason、design refs | 高风险 suite 或失败后必审 | 阻断 suite 必须 reviewed |
| `reports/runs/<run_id>/gate-results.md` | report 脚本 | 检查阻断级别、failed / skipped reason 和 defect refs | release 前必审 | P0 阻断项全部 passed 或明确不适用 |
| `reports/runs/<run_id>/evidence-index.md` | report 脚本 | 检查 `EV / TC / AC / artifact / design_contract_refs` | release 前必审 | P0 EV 完整且 review_status 非 pending |
| `reports/runs/<run_id>/redaction-check.md` | report 脚本 | 检查 forbidden output 零命中 | release 前必审 | passed;任一 failed 阻断 |
| `reports/runs/<run_id>/release-summary.md` | report 脚本 | 检查 release gate、redline、defects 和 open risks | 必审 | 不写最终验收裁决,只给裁决输入 |
| `reports/acceptance/handoff.md` | report 脚本生成初稿 | 补送验范围、基线、gate、开放问题 | 必审 | 明确不包含最终通过 / 不通过裁决 |
| `reports/acceptance/veto-checklist.md` | report 脚本生成初稿 | 逐项检查 `VETO-WORK-*` evidence | 必审 | 全部 passed / not_applicable 且有证据 |
| `reports/acceptance/risk-acceptance.md` | 人 / Agent 整理候选 | 检查是否混入 S / VETO / P0 A | 必审 | 只有可接受风险候选,且有 owner / deadline |

### 7.7 一票否决前置规避矩阵

| VETO | 最早规避阶段 | 阶段门禁 | 释放前复核 |
|---|---|---|---|
| `VETO-WORK-001` | PH-02 | CORE / FORMAL / ITER / QUERY 主链分阶段成立 | release-main-smoke;gate results |
| `VETO-WORK-002` | PH-04 | FORMAL / PROMOTE forbidden body 和外部步骤污染检查 | redaction report;veto checklist |
| `VETO-WORK-003` | PH-03 | MEMBER identity boundary 和 resolver negative | evidence index;dependency review |
| `VETO-WORK-004` | PH-01 | redaction skeleton,PH-04 起 selected scan,PH-08 / PH-09 必跑 | redaction-check.md |
| `VETO-WORK-005` | PH-07 | query no-write,PH-08 job / reconciliation read-only | no-write report;OPS evidence |
| `VETO-WORK-006` | PH-02 | accepted truth trace / audit / outbox evidence 随主链递增 | evidence index;observability audit |
| `VETO-WORK-007` | PH-01 | dependency boundary check | dependency report;build metadata |
| `VETO-WORK-008` | PH-07 | unauthorized query / command negative selected | authorization negative report |
| `VETO-WORK-009` | PH-02 | command idempotency,PH-04 / PH-06 concurrency,PH-08 event dedup | idempotency / dedup reports |
| `VETO-WORK-010` | PH-01 | config-fast,strict validation,config redline | release-config-redline |
| `VETO-WORK-011` | PH-08 | configured adapter unavailable / fake marker checks | integration-like selected;fake marker report |
| `VETO-WORK-012` | PH-01 | path check from skeleton,PH-09 full evidence pack | release-evidence-pack;veto checklist |

### 7.8 阶段进入 / 退出门禁

| 阶段 | 进入条件 | 退出条件 |
|---|---|---|
| PH-01 | Step 1~Step 6 已确认;目标仓不存在或可初始化口径明确 | workspace / config / path / dependency skeleton 通过 |
| PH-02~PH-08 | 前一 PH 的阻断门禁通过;当前 boundary 设计闭环复核通过 | 当前 PH 的 commit boundary 均通过对应 suite、artifact、report 和审查要求 |
| PH-09 | PH-01~PH-08 的 P0 阻断门禁通过;无未处理 S / P0 A;run_id 固定 | release gates、evidence index、redaction、veto checklist 和 acceptance handoff 均 reviewed |

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §7。

````markdown
## 7. 测试与验收门禁嵌入

> 校准来源:
> - `design-calibration/07_implementation_plan_step_07_tests_acceptance_gates.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“全局门禁规则”“阶段门禁矩阵”“Commit Boundary 门禁矩阵”“Artifact 与 Report 输出矩阵”“门禁失败处理矩阵”和“一票否决前置规避矩阵”小节,了解测试、证据、报告和验收如何嵌入每个实施阶段。

每个 phase 和 commit boundary 都必须绑定测试门禁、证据输出和失败处理。测试通过不等于验收通过;验收必须基于固定 `run_id` 的 `reports/runs/<run_id>`、`reports/acceptance/handoff.md`、`veto-checklist.md` 和 `risk-acceptance.md`。

全局路径规则:

| 类型 | 固定路径 |
|---|---|
| 原始 artifact | `artifacts/test/<run_id>` |
| run report | `reports/runs/<run_id>` |
| acceptance handoff | `reports/acceptance` |

正式 artifact、report 和 acceptance handoff 不得引用 `latest`。失败 suite 也必须保留 `report.json`、stdout / stderr 和 failure reason。

| 阶段 | 测试门禁 | 验收门禁 | report 输出 | 失败处理 |
|---|---|---|---|---|
| PH-01 | workspace check、dependency boundary、config smoke、script help、path check | dependency / config / evidence path redline | config-fast summary、path / dependency report | 失败即停止,不得进入业务纵切 |
| PH-02 | CORE contract / domain / service selected | `AC-WORK-001/006`;UoW / idempotency | CORE suite summary、CORE evidence | CORE 主线或 duplicate 失败即停止 |
| PH-03 | MEMBER contract / domain / service selected | `AC-WORK-002/007`;identity boundary | MEMBER suite summary、resolver negative report | identity ownership 或 body 越界即停止 |
| PH-04 | FORMAL / PROMOTE selected、redaction selected、version conflict selected | `AC-WORK-003/008/009`;forbidden body redline | FORMAL / PROMOTE reports、redaction slice | forbidden body 或 multi-winner 失败即停止 |
| PH-05 | DEP graph / service / evidence resolver selected | `AC-WORK-010/019/020/027/028` | DEP suite summary、evidence ref report | cycle accept 或 evidence body 保存即停止 |
| PH-06 | ITER service selected、concurrency selected | `AC-WORK-004/011`;single-winner | ITER suite summary、concurrency report | 非 formal commit 或 illegal reopen 失败即停止 |
| PH-07 | QUERY api / service / integration selected、no-write checks | `AC-WORK-005/012`;query no-write | QUERY reports、projection freshness、no-write report | unauthorized leak 或 query write 即停止 |
| PH-08 | worker-job-contract、consumer-outbox、OPS、redaction、replay selected | `AC-WORK-013/025/028/029`;job no truth repair | job reports、redaction check、replay selected report | silent success、fake fallback 或 truth repair 即停止 |
| PH-09 | release-main-smoke、release-config-redline、release-evidence-pack | `AC-WORK-024~029`;全部 `VETO-WORK-*`;`EVG-WORK-*` | gate-results、evidence-index、redaction-check、release-summary、acceptance handoff | 任一 VETO / P0 evidence / release redline 失败即不得送验通过 |

报告审查规则:

- `reports/runs/<run_id>/gate-results.md` 必须有人或 Agent 检查阻断 / 非阻断分类。
- `reports/runs/<run_id>/evidence-index.md` 必须能回指 `EV-WORK-* -> TC-WORK-* -> AC-WORK-* -> design_contract_refs -> artifact_refs`。
- `reports/runs/<run_id>/redaction-check.md` 任一 forbidden output 命中即阻断。
- `reports/acceptance/handoff.md` 只提供送验事实、开放问题和风险入口,不得写最终验收裁决。
- `reports/acceptance/veto-checklist.md` 必须覆盖全部 `VETO-WORK-*`。
- `reports/acceptance/risk-acceptance.md` 不得接受 S 级、VETO、P0 A、redaction failed、重复 truth 或 evidence pack 不可复核风险。
````

## 9. 待确认事项

无阻塞进入 Step 8 的待确认事项。

后续必须继续收口:

- Step 8 细化配置、环境、profile、外部依赖准备和 failure mode。
- Step 9 记录可能影响门禁的 Spike、风险和待确认事项。
- Step 10 把本步失败处理口径转成暂停、回退和变更控制规则。
- Step 11 展开提交、评审和交付纪律,并与本步 commit boundary 门禁一致。
- Step 12 定义实施完成判定,必须引用本步 release gate、evidence pack 和 VETO 审查口径。

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 每个阶段至少绑定一个测试门禁 | 已满足 |
| 涉及外部可见行为、状态转换、跨仓交互或数据一致性的阶段均绑定验收门禁 | 已满足 |
| 门禁失败处理已明确 | 已满足 |
| artifact 输出统一为 `artifacts/test/<run_id>` | 已满足 |
| report 输出统一为 `reports/runs/<run_id>` 和 `reports/acceptance` | 已满足 |
| `reports/acceptance/*` 的审查补充责任已声明 | 已满足 |
| 未创建正式 `07-实施计划.md` | 已满足 |

用户审核确认后,可以进入 Step 8: 定义配置、环境与外部依赖准备。
