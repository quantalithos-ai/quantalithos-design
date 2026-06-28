# Step 7. 嵌入测试与验收门禁

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 7
> 回填章节: `07-实施计划.md` §7 测试与验收门禁嵌入
> 当前模块: `R7.2 test and acceptance gates:再写入`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 7 嵌入测试与验收门禁 |
| 当前模块 | `R7.2 test and acceptance gates:再写入` |
| 当前状态 | completed_confirmed |
| 输入基线 | Step 5 phase;Step 6 candidate commit boundary;`05-测试方案.md`;`06-验收标准.md`;台账规范 |
| 输出文件 | `projects/L3-method-library/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` |
| 停审方式 | 用户已确认 Step 7,允许进入 Step 8 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 5 PH-01~PH-11 | completed_confirmed | 将 phase 绑定 suite / AC / VETO / evidence |
| Step 6 commit-01-a~commit-11-b | completed_confirmed | 将每个 boundary 绑定提交前测试、artifact/report 和失败处理 |
| `05-测试方案.md` §3~§5 | 已读取 | 提供测试对象族、测试层级、TC-ML 覆盖轴 |
| `05-测试方案.md` §9~§13 | 已读取 | 提供 suite family、自动化门禁、缺陷复验、artifact/report 路径 |
| `06-验收标准.md` §5~§11 | 已读取 | 提供 ML-FG、ML-RL、ML-SYNC、ML-STATE/TX/READ/JOB/IDEMP/NFR、AC-ML-EV、VETO-ML |
| L1-governance Step 7 | framework_reference | 只参考“输出规则 / phase 矩阵 / boundary 矩阵 / 失败处理 / 审查责任”结构 |

## 3. SOP 问题回答

1. 每个阶段应执行哪些测试用例或测试切口。

   回答: PH-01 执行 workspace/config/script/dependency baseline checks;PH-02~PH-07 按 core truth、formalization、consumption、trace、external/peripheral 使用 `contract-domain-fast`、`service-flow-fast` 和 targeted redaction/dependency checks;PH-08 执行 query no-write/read material/marker checks;PH-09 执行 entry-worker-job 的 inbound/outbound slice;PH-10 执行 operations-replay-core 和 job entry slice;PH-11 执行 release-main-smoke、config-redline、redaction-boundary、dependency-boundary、observability-boundary、report-generation-audit 和 VETO audit。

2. 哪些阶段必须对齐验收标准。

   回答: 所有 phase 都必须对齐 `06`。PH-03 对齐 ML-FG-001/005、ML-RL-001;PH-04 对齐 ML-FG-002/006、ML-RL-003/007、ML-STATE;PH-05 对齐 ML-FG-003/007/008、ML-RL-002;PH-06 对齐 ML-FG-004/009/010/011、ML-RL-004/009;PH-07 对齐 ML-FG-012 和 external/body-free redlines;PH-08 对齐 ML-SYNC-002、ML-READ-001;PH-09 对齐 ML-SYNC-003/004、ML-TX-002;PH-10 对齐 ML-SYNC-005、ML-JOB-TX、ML-IDEMP、ML-CHKPT;PH-11 对齐 AC-ML-EV 和 VETO-ML。

3. 每个门禁需要产出什么证据。

   回答: 执行期门禁必须产出 `artifacts/test/<run_id>/suites/<suite>/...` raw artifact 和 `reports/runs/<run_id>/...` report。正式 EV / VETO / acceptance handoff 只在 release run 中从 raw artifact/report 推导,不得在设计阶段或早期 boundary 手写 pass。

4. 门禁失败是否允许继续进入下一阶段。

   回答: P0 blocking gate 失败不得提交当前 boundary,不得进入下一 phase。P1 selected-run unavailable 只能进入 residual/risk,不得计入 P0 pass。

5. 哪些门禁可以自动化,哪些需要人工或 Agent 审查。

   回答: P0 suite、config、dependency、redaction、observability、report-generation audit 必须自动化。`reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md`、`open-issues.md` 可由脚本生成初稿,但必须由人或 Agent 审查。

6. 哪些验收一票否决项需要在实施阶段提前规避。

   回答: `VETO-ML-001~014` 全部前置规避,尤其是 truth owner 不清、正式版本静默覆盖、下游替代定义、未正式资产被消费、raw body/secret 泄露、non-core sibling compile dependency、query/job/observability 反写真相、static evidence 和 invalid P0 config silent fallback。

7. 每个 commit boundary 是否都有提交前门禁。

   回答: 有。Step 7 的 boundary 矩阵覆盖 Step 6 的 25 个 candidate boundary。若后续 Step 7/11/12 校准后拆分或合并 boundary,必须同步更新矩阵。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| Step 6 | boundary 只有 checks seed | 实现者可能只跑编译不留证据 | 本 Step 绑定 suite / EV / VETO / report |
| `05` suite family | suite 是全局定义 | 需要落到 phase 和 commit | 建立 phase / boundary 门禁矩阵 |
| `06` AC/VETO | 验收项跨阶段 | 若 PH-11 才发现会返工 | 将 VETO 风险前置到相关 boundary |
| artifact/report | 设计阶段不能伪造 run | 需要区分 targeted run 与 release run | 只定义规则,不生成真实 evidence |
| implementation ledger | Step 7 补 gate 后仍未完成 Step 11/12 | 不能现在创建真实 ledger | 本 Step 只给 required_checks 和 handoff gate 输入 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 阶段门禁 | phase 只有门禁方向 | phase 绑定 suite、EV、验收项和失败处理 | 防止最后补测 |
| boundary 门禁 | checks seed 粗粒度 | 每个 boundary 有提交前门禁和 VETO 风险 | 防止无证据提交 |
| EV / VETO | release 才汇总 | early phase 规避,V11 release run 汇总 | 防止静态 evidence |
| acceptance reports | 未分审查责任 | 脚本生成 + 人/Agent 审查 | 保证裁决可审计 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 每个 commit 都生成正式 EV | 追踪细 | 正式 EV 过早固定,与最终 release run 冲突 | 不采用 |
| 每个 commit 生成 targeted artifact/report,PH-11 汇总正式 EV | 证据真实,release 口径稳定 | PH-11 工作量集中 | 采用 |
| release-main-smoke 替代底层 suite | 快 | 违反 `05/06` | 不采用 |
| release-main-smoke 只做代表性闭环 | 可验收且不替代底层证据 | 需 report audit 约束 | 采用 |

## 7. 结构化中间产物

### 7.1 门禁输出规则

| 输出类型 | 路径 | 生成阶段 | 要求 |
|---|---|---|---|
| raw suite artifact | `artifacts/test/<run_id>/suites/<suite>/...` | 所有执行 suite 的 phase | 必须包含 status、case refs、config profile、duration/count、safe failure reason 和 digest direction |
| suite report | `reports/runs/<run_id>/suites/<suite>.md` | PH-02 起 targeted;PH-11 必须 | 必须从 raw artifact 推导 |
| run summary | `reports/runs/<run_id>/summary.md` | PH-11 必须 | 只汇总,不得替代 suite report |
| gate summary | `reports/runs/<run_id>/gate-summary.md` | PH-11 必须 | blocking/non-blocking 分类清楚 |
| evidence index | `reports/runs/<run_id>/evidence-index.md` | PH-11 | EV-ML -> TC-ML -> suite -> artifact -> report -> AC/VETO |
| redaction report | `reports/runs/<run_id>/redaction-check.md` | PH-06 起 targeted;PH-11 必须 | artifact 和 report 均纳入 scan |
| dependency report | `reports/runs/<run_id>/dependency-boundary.md` | PH-01 targeted;PH-11 必须 | 证明 only `core-contracts` compile dependency |
| report audit | `reports/runs/<run_id>/report-audit.md` | PH-11 | artifact/report pairing、no latest、no static evidence |
| acceptance handoff | `reports/acceptance/handoff.md` | PH-11 | 审查入口,不替代 raw artifact |
| VETO checklist | `reports/acceptance/veto-checklist.md` | PH-11 | `VETO-ML-*` 不得静态默认 passed |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | PH-11 | 不得接受 VETO / S 级缺陷 |

### 7.2 门禁失败处理

| 失败类型 | 是否可继续 | 处理 |
|---|---|---|
| compile / format / targeted test failure | 否 | 修复后重跑当前 boundary 门禁 |
| `contract-domain-fast` / `service-flow-fast` blocking failure | 否 | 不得提交;若设计冲突则回写设计 |
| redaction leak | 否 | 视为 VETO / S 级风险,修复后重跑 redaction and affected suites |
| dependency boundary violation | 否 | 移除 non-core compile dependency 或回写架构,不得风险接受 |
| query writes truth | 否 | 回写 flow / port / state 或修实现,不得进入下一 boundary |
| job repairs core truth | 否 | 修 job flow 或回写设计,不得风险接受 |
| report missing raw artifact | 否 | 修 report generator or suite output,不得手写补洞 |
| static evidence / default VETO passed | 否 | 删除静态来源,改为从 artifact/report 推导 |
| P1 selected-run unavailable | 是,但不计 P0 pass | 记录 residual / risk,不得影响 P0 结论 |

### 7.3 Phase 门禁矩阵

| Phase | 测试门禁 | 验收 / VETO 关联 | artifact / report 输出 | 失败处理 |
|---|---|---|---|---|
| PH-01 | `cargo check`;config smoke;script dry-run;dependency-boundary targeted | ML-RL-006/011;ML-SYNC-006/008;ML-NFR-004/005;VETO-ML-012/014 | dependency/config targeted artifact/report optional | 不得进入 PH-02 |
| PH-02 | `contract-domain-fast` foundation;domain/application unit tests | ML-SYNC-001 seed;ML-STATE-001;ML-TX-001;ML-IDEMP-001 seed | contract/domain foundation artifacts | 不得进入 PH-03 |
| PH-03 | `contract-domain-fast`;`service-flow-fast`;`infra-runtime-fake` definition/catalog slice | ML-FG-001/005;ML-RL-001;ML-SYNC-001;VETO-ML-001 | definition/catalog suite reports | truth owner 或 UoW 缺口阻断 |
| PH-04 | `contract-domain-fast`;`service-flow-fast` formalization/version slice | ML-FG-002/006;ML-RL-003/007;ML-STATE;ML-IDEMP;VETO-ML-002/004 | formalization/version artifacts/reports | state/replay 缺口阻断 |
| PH-05 | consumption/distribution service tests;availability/degraded checks;handoff fake | ML-FG-003/007/008;ML-RL-002;ML-SYNC-007;VETO-ML-003/004 | consumption/distribution reports | downstream truth 或 availability marker 缺口阻断 |
| PH-06 | trace/audit/impact tests;redaction targeted;stored replay regression | ML-FG-004/009/010/011;ML-RL-004/009;VETO-ML-005/006/009/011 | trace/audit/redaction targeted reports | raw body 或不可追溯阻断 |
| PH-07 | external body-free tests;peripheral residual tests;dependency/redaction targeted | ML-FG-012;ML-RL-004/005;ML-SYNC-007;VETO-ML-005/008 | external/peripheral reports | peripheral 阻塞 core 或 provider body 入仓阻断 |
| PH-08 | query no-write;read material;projection stale/degraded/unavailable;API query tests | ML-SYNC-002;ML-READ-001;ML-RL-008/009/012;VETO-ML-010 | query/material suite reports | query 写入、私补 marker 阻断 |
| PH-09 | inbound receipt/dedup;outbound candidate/outcome;worker publisher;redaction | ML-SYNC-003/004/008;ML-TX-002;VETO-ML-005/010 | entry-worker-job inbound/outbound reports | inbound 改 truth 或 publisher rollback 阻断 |
| PH-10 | job protocol;operations-replay-core;checkpoint/report;partial failure;handoff/export | ML-SYNC-005;ML-JOB-TX-001;ML-IDEMP;ML-CHKPT;VETO-ML-010 | operations-replay-core and job reports | job 修 truth 或 duplicate rerun 阻断 |
| PH-11 | release-main-smoke;config-redline;dependency;redaction;observability;report-generation-audit;VETO audit | AC-ML-EV-001~009;VETO-ML-001~014;ML-NFR-001~009 | full `reports/runs/<run_id>` and `reports/acceptance/*` | 任一 blocking/VETO/report audit failed 不得 pass |

### 7.4 Commit Boundary 门禁矩阵

| Boundary | 提交前测试门禁 | EV / 验收关联 | artifact / report 输出 | 失败处理 |
|---|---|---|---|---|
| commit-01-a | fmt;check;dependency-boundary seed | EV-ML-DEPENDENCY-001;ML-RL-006;VETO-ML-012 | dependency targeted artifact/report optional | 不提交;修 workspace/dependency |
| commit-01-b | config smoke;script dry-run;path check | EV-ML-CONFIG-001 seed;AC-ML-EV path seed;VETO-ML-014 | config/script dry-run artifact optional | 不提交;修 config/script |
| commit-02-a | contracts check;contract-domain-fast foundation | EV-ML-CONTRACT-001 seed;ML-SYNC-001 seed | contract foundation report optional | DTO/shell 缺口回写设计 |
| commit-02-b | domain check;domain tests | EV-ML-CONTRACT-001 seed;ML-STATE-001/002 | domain foundation artifact | state/policy 缺口阻断 |
| commit-02-c | application check;UoW/idempotency unit tests | EV-ML-SERVICE-001 seed;ML-TX-001;ML-IDEMP-001 seed | application foundation artifact | UoW/replay 缺口阻断 |
| commit-03-a | contract-domain-fast definition/catalog slice | EV-ML-CONTRACT-001;ML-FG-001/005;VETO-ML-001 | definition/catalog report | truth owner 缺口阻断 |
| commit-03-b | service-flow-fast definition/catalog;infra-runtime-fake slice | EV-ML-SERVICE-001;EV-ML-INFRA-001;ML-TX-001 | service/infra targeted reports | accepted flow 或 repo fake 缺口阻断 |
| commit-04-a | contract-domain-fast formalization/version | EV-ML-CONTRACT-001;ML-FG-002/006;ML-STATE | formalization report | state/version 静默覆盖阻断 |
| commit-04-b | service-flow-fast formalization/replay | EV-ML-SERVICE-001;EV-ML-REPLAY-001 seed;VETO-ML-002/004 | formal service report | duplicate rerun 或 commit unknown 缺口阻断 |
| commit-05-a | contract-domain-fast consumption material | EV-ML-CONTRACT-001;EV-ML-SERVICE-001 seed;ML-FG-007 | consumption report | Definition vs Use 缺口阻断 |
| commit-05-b | service-flow-fast distribution/handoff;infra-runtime-fake | EV-ML-SERVICE-001;EV-ML-ENTRY-001 seed;ML-FG-008;ML-SYNC-007 | distribution/handoff reports | downstream truth 或 availability 缺口阻断 |
| commit-06-a | contract-domain-fast trace/audit/impact/lineage | EV-ML-CONTRACT-001;EV-ML-REPORT-001 seed;ML-FG-009/011 | trace/audit contract report | raw body 或 source 缺口阻断 |
| commit-06-b | service-flow-fast trace/audit/impact;redaction targeted | EV-ML-SERVICE-001;EV-ML-REDACTION-001 seed;VETO-ML-005/006/011 | trace service/redaction reports | redaction leak 不得风险接受 |
| commit-07-a | contract-domain-fast external summary/body boundary;redaction targeted | EV-ML-CONTRACT-001;EV-ML-REDACTION-001;ML-RL-004 | external/redaction reports | provider body 入仓阻断 |
| commit-07-b | service-flow-fast peripheral package/set residual | EV-ML-RISK-001 seed;EV-ML-DEPENDENCY-001 seed;ML-FG-012;VETO-ML-008 | peripheral residual report | peripheral 阻塞 core 阻断 |
| commit-08-a | contracts check;query DTO tests | EV-ML-SERVICE-001 seed;ML-SYNC-002 seed | query DTO report optional | view surface 缺口阻断 |
| commit-08-b | service-flow-fast core query no-write | EV-ML-SERVICE-001;ML-READ-001;VETO-ML-010 | core query report | query write/marker 私补阻断 |
| commit-08-c | service-flow-fast extended query;infra-runtime-fake material | EV-ML-SERVICE-001;EV-ML-INFRA-001;ML-RL-008/009 | extended query/material report | stale/degraded source 缺口阻断 |
| commit-09-a | entry-worker-job inbound slice | EV-ML-ENTRY-001;EV-ML-SERVICE-001;ML-SYNC-003 | inbound report | inbound 改 truth 或 unsupported parse 阻断 |
| commit-09-b | entry-worker-job outbound/publisher;redaction targeted | EV-ML-ENTRY-001;EV-ML-REPLAY-001 seed;ML-SYNC-004 | outbound/publisher reports | payload/current truth 重算阻断 |
| commit-10-a | contracts check;job DTO/report tests | EV-ML-ENTRY-001 seed;ML-SYNC-005 seed | job protocol report optional | job report surface 缺口阻断 |
| commit-10-b | operations-replay-core refresh jobs | EV-ML-REPLAY-001;ML-JOB-TX-001;ML-CHKPT-001 | refresh job report | job 修 truth 或 checkpoint 缺口阻断 |
| commit-10-c | operations-replay-core recovery/replay/handoff;entry-worker-job job slice | EV-ML-REPLAY-001;EV-ML-ENTRY-001;ML-IDEMP;ML-NFR-006 | recovery/handoff job reports | duplicate rerun / partial no report 阻断 |
| commit-11-a | report-generation-audit;redaction;dependency;observability | EV-ML-REPORT-001;EV-ML-REDACTION-001;EV-ML-DEPENDENCY-001;EV-ML-OBSERVABILITY-001;AC-ML-EV-001~006 | report audit / redaction / dependency / observability reports | static evidence、orphan EV、leak、dependency violation 阻断 |
| commit-11-b | release-main-smoke;VETO checklist;handoff/risk/open issues dry-run | EV-ML-RELEASE-001;EV-ML-RISK-001;AC-ML-EV-007~009;VETO-ML-001~014 | release smoke and `reports/acceptance/*` | 任一 VETO 或 missing handoff 阻断 |

### 7.5 Report 生成与审查规则

| 阶段 | 生成规则 | 审查要求 |
|---|---|---|
| PH-01 | 可生成 targeted dependency/config dry-run report | 确认无 `latest` 和静态 pass |
| PH-02~PH-07 | 可为 targeted suite 生成 candidate suite reports | 失败必须保留 safe failure artifact |
| PH-08~PH-10 | query/worker/job reports 必须能回指 raw artifact | 审查 no-write/no truth repair/source marker |
| PH-11 | 必须生成 `summary.md`、`gate-summary.md`、`evidence-index.md`、suite reports、redaction/dependency/report audit 和 acceptance reports | 人或 Agent 审查 handoff、VETO、risk、open issues |

### 7.6 VETO 前置规避矩阵

| VETO | 最早规避 boundary | Release 验证 |
|---|---|---|
| VETO-ML-001 | commit-03-a | EV-ML-CONTRACT-001;dependency report |
| VETO-ML-002 | commit-04-a / commit-04-b | formalization/version suite reports |
| VETO-ML-003 | commit-05-a / commit-05-b | service/dependency reports |
| VETO-ML-004 | commit-04-a / commit-05-a | contract/service reports |
| VETO-ML-005 | commit-06-a / commit-07-a | redaction/report audit |
| VETO-ML-006 | commit-06-a / commit-06-b | trace/replay/report evidence |
| VETO-ML-007 | commit-01-a | dependency-boundary |
| VETO-ML-008 | commit-07-b | risk/residual report |
| VETO-ML-009 | commit-06-b / commit-08-b | observability/report audit |
| VETO-ML-010 | commit-08-b / commit-10-b | service/replay/observability reports |
| VETO-ML-011 | commit-06-b / commit-07-a / commit-09-b | redaction-check |
| VETO-ML-012 | commit-01-a | dependency-boundary |
| VETO-ML-013 | commit-11-a | report-audit;veto-checklist |
| VETO-ML-014 | commit-01-b | config-redline |

### 7.7 门禁停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 每个 phase 是否至少绑定一个测试门禁 | 通过 | PH-01~PH-11 均已绑定 |
| 每个 commit boundary 是否有提交前门禁 | 通过 | commit-01-a 到 commit-11-b 均已绑定 |
| 每个 EV-ML 是否有 suite/report 方向 | 通过 | EV-ML-CONTRACT/SERVICE/INFRA/ENTRY/REPLAY/CONFIG/DEPENDENCY/REDACTION/OBSERVABILITY/REPORT/RELEASE/RISK 已列 |
| VETO-ML 是否提前规避 | 通过 | 最早规避 boundary 已列 |
| artifact/report path 是否统一 | 通过 | `artifacts/test/<run_id>` 与 `reports/runs/<run_id>` |
| acceptance report 是否有人/Agent 审查 | 通过 | PH-11 必须审查 |
| 是否创建真实 evidence | 未创建 | 本 Step 只定义规则 |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“门禁输出规则”“Phase 门禁矩阵”“Commit Boundary 门禁矩阵”“VETO 前置规避矩阵”和“门禁停审记录”小节。

正式 `07-实施计划.md` §7 后续应回填:

实施过程必须把 `05-测试方案.md` 和 `06-验收标准.md` 嵌入 phase 与 commit boundary。任何 P0 blocking gate 失败时,不得提交当前 boundary,不得进入下一 phase,也不得把失败改写为风险接受。门禁输出统一使用 `artifacts/test/<run_id>/suites/<suite>/...`、`reports/runs/<run_id>/...` 和 `reports/acceptance/...`;正式证据不得引用 `latest`。

每个 boundary 至少执行格式、编译、targeted tests 和 diff 检查。涉及 config、dependency、redaction、observability、report、release 的 boundary 必须执行对应 audit。正式 EV、VETO checklist 和 acceptance handoff 只能在 PH-11 release run 中从真实 raw artifact/report 推导,不得由静态 JSON、手写 pass 表或默认 passed 生成。

`VETO-ML-001~014` 必须在相关 boundary 前置规避,并在 PH-11 由 report audit / VETO checklist 汇总验证。任一 VETO 命中时,最终结论不得为“通过”或“有条件通过”。

## 9. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| Step 6 的 25 个 boundary 是否在 Step 7 后需要拆细 | 影响 required checks 粒度 | Step 11/12 前可再校准 |
| release run_id 命名 | 影响正式 evidence | Step 12 固定占位规则,执行期填真实 run_id |
| scripts 具体 CLI 名称 | 影响 Step 8 / Step 11 | 本 Step 只定义逻辑门禁,Step 8/11 再固定 |
| P1 selected-run 是否要在 `07` 正式列出 | 影响 residual | Step 9 记录风险 / residual |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| Step 6 已确认 | 通过 | 用户已确认 |
| phase 门禁矩阵已定义 | 通过 | PH-01~PH-11 均覆盖 |
| boundary 门禁矩阵已定义 | 通过 | commit-01-a 到 commit-11-b 均覆盖 |
| EV / VETO 映射已定义 | 通过 | EV-ML 与 VETO-ML 均有来源方向 |
| artifact/report 规则已定义 | 通过 | run-scoped paths, no latest, no static evidence |
| 未修改正式 `07` 或实现仓 | 通过 | 本 Step 只写设计中间产物 |
| 可进入 R7.2 / Step 8 | 通过 | 用户已确认,允许推进到 Step 8 |

## 11. R7.2 用户确认记录

| 确认项 | 结论 |
|---|---|
| 用户确认 | 已确认 |
| 确认输入 | `同意` |
| 确认范围 | Step 7 测试与验收门禁中间产物 |
| 后续动作 | 推进到 Step 8 `R8.1 config environment dependencies:先思考` |
| 限制 | Step 13 前仍不得修改正式 `07-实施计划.md`;不得创建真实 implementation ledger、boundary ledger、CI、脚本、代码或 evidence |
