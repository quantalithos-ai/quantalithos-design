# Step 9. 设计自动化与 CI/CD 门禁

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 9
> 回填章节: `05-测试方案.md` §9 自动化与 CI/CD 门禁
> 创建日期: 2026-06-27
> 当前模式: full-restart / step9-automation-gates
> 当前状态: completed_wait_user_confirm_to_R10.1
> 当前模块: `R9.12 cross-suite audit / closure:再写入`
> 当前门禁: `R9.12` completed_wait_user_confirm_to_R10.1;等待确认进入 Step 10 `R10.1 设计专项测试与非功能验证:先思考`

---

## 0. Step 8 handoff

Step 8 已确认当前 `05-测试方案.md` 的测试环境与配置矩阵:

- `local-dev`、`ci-test`、`integration-like`、`operations-replay` 已定位为 P0 candidate / support profile,其中 `ci-test` 是 P0 deterministic 主环境。
- `staging-like`、`production-like` 只作为 P1/P2 selected-run / future operations direction,不可成为当前 P0 pass 前置。
- 只有 `L0-core` / `core-contracts` 是 compile dependency candidate;其他 sibling repo 均只能通过 runtime / event / replay / handoff / fake / controlled seam 协作。
- P0 使用 fake / in-memory / controlled / disabled / event replay / operations replay;真实 DB、broker、secret provider、external product 不作为 P0 必备。
- P0 profile、fixture、fake、guard、controlled seam 或 replay root 不可用时不得跳过或伪 pass。
- optional degraded / unavailable / failed 分支必须复制正式 marker/source;source missing 必须停审,不得由 fixture、环境或 fake 合成。
- Step 8 未定义 CI suite、脚本、required check、run 参数、artifact path、report path、evidence schema 或验收 gate。

Step 9 的任务是把 Step 4 的测试分层、Step 6 的 83 条 `TC-ML-*` 候选用例、Step 7 的 81 个 `DS-ML-*` 数据集和 Step 8 的环境 / profile / 依赖策略,转译成自动化 suite family、gate 分层、脚本家族、失败处理和后续 evidence/report 承接方向。

---

## R9.1 automation / gates:先思考

### 1. 当前模块目标

`R9.1` 只思考 Step 9 的输入边界、必读文档、L1-governance Step 9 框架参考、L3-method-library 的 suite family 候选、gate layering 候选、run 参数边界、redaction / dependency / report audit 后移边界和 `R9.2` 写入边界。

当前模块不写最终自动化套件表、最终 CI/CD 门禁图、最终脚本表、artifact / report 输出映射、suite-to-case 映射、evidence schema、验收标准、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R9.2 |
| 用户确认 | 已确认从 Step 8 completed 推进到 Step 9 `R9.1`。 |
| 当前允许 | 思考自动化门禁输入、suite family 候选、PR / main / nightly / release / P1 selected-run 分层、run 参数边界、failure handling 和 R9.2 写入计划。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写最终 suite 表、最终 CI/CD 图、最终脚本表、artifact/report 映射、suite-to-TC 映射、evidence schema、验收标准、实施计划或 implementation code。 |

### 2. Step 9 启动前必须承接

| 输入 | 必须承接的内容 | 禁止继承 / 禁止提前 |
|---|---|---|
| `project_execution_ledger.md` | 当前恢复点为 Step 9 `R9.1`;每次确认只推进一个当前模块。 | 跳过 R9.1 直接写完整 suite / gate / script 表。 |
| `05_test_plan_calibration_flow.md` | Step 1~8 completed;Step 9 waiting_user_confirm_to_R9.1;Step 10+ blocked。 | 在 Step 9 写非功能专项、缺陷规则、退出准则或正式 `05`。 |
| `05_test_plan_step_04_strategy_layers.md` | Unit / Contract、Application service / Flow、Repository / UoW / Adapter fake integration、API / Worker / Job entry、Release gate / Evidence summary 分层。 | 用 release gate 替代底层断言。 |
| `05_test_plan_step_06_cases.md` | 83 条唯一 `TC-ML-*` 候选用例,以及自动化候选和 evidence candidate 后移边界。 | 新增 TC、改写断言或固定正式 evidence ID。 |
| `05_test_plan_step_07_test_data.md` | 81 个唯一 `DS-ML-*` 数据集、run namespace、fixture / seed / fake / corpus / fault profile 和清理规则。 | 新增 fixture 路径、builder 函数、seed 代码或 production data。 |
| `05_test_plan_step_08_environment_config.md` | P0 / P1 profile、依赖类型、协作方式、不可用处理和拓扑审计。 | 新增环境、真实产品、config key、artifact path 或 report path。 |
| SOP Step 9 | 自动化套件表、CI/CD 门禁图、gate/report/check 脚本表、artifact/report 映射、suite-to-case 映射和停审要求。 | 只写“CI 会跑测试”。 |
| 测试方案书写规范 §5.9 | 必须明确 suite、执行位置、触发、阻断级别、脚本、artifact 输出、report 输出。 | R9.1 不直接生成正式表;R9.2 才写候选结构。 |
| 正式 `03-详细设计.md` §15 / §14 / §13 | 承接最小测试切口、body-free observability、config/dependency/redline。 | 新增 metric schema、trace schema、config key、test evidence schema。 |
| 正式 `04-配置设计.md` §6 / §9 / §11 / §12 | 承接 profile、加载校验、fail-fast / degraded / failed、下游测试承接。 | 写实施 phase、acceptance gate 或运维 runbook。 |
| L1-governance Step 9 | 参考 suite/gate/report/check 表格密度、run-scoped artifact/report 意识和停审结构。 | 复制 governance 的 suite-to-TC 事实、业务闭环、TC/EV 编号或脚本结论。 |

### 3. SOP Step 9 问题思考边界

| SOP 问题 | R9.1 思考边界 | 后续落点 |
|---|---|---|
| 哪些 suite 必须进 PR? | 先识别 contract/domain、service flow、config redline、dependency boundary 等快速阻断候选。 | R9.2 写 suite/gate 候选结构。 |
| 哪些 suite 进 main CI? | 先识别 fake integration、entry/worker/job、operations replay core、redaction / observability guard 候选。 | R9.2 写 main gate 候选。 |
| 哪些 suite 进 nightly? | 先识别 extended replay、fault injection、report pairing / generation audit 等较重候选。 | R9.2 写 nightly 候选,不作为立即 P0 release 前置。 |
| 哪些 suite 是 staging smoke 或 release gate? | 先识别 release-main-smoke、release config/redaction/dependency/report audit 和 P1 selected-run 方向。 | R9.2 写 release / P1 分层候选。 |
| flaky、超时和依赖故障如何处理? | P0 deterministic suite flaky / timeout 视为 failed;P1 unavailable 只记 residual。 | R9.2 写 failure handling 原则。 |
| 每个阻断 suite 由哪个脚本执行? | 先识别 gate/report/check 三类脚本目录约束。 | R9.2 只写脚本家族候选;不实现脚本。 |
| artifact-root / report-root / run 参数如何处理? | 先固定必须 run-scoped、不得引用 latest、不得用静态报告宣告通过。 | R9.2 可写候选参数边界;Step 13 固定 schema。 |
| 每个 suite 覆盖哪些切口、用例和证据? | 先按用例族与测试分层思考覆盖方向。 | R9.2 可写 suite-to-family 候选;正式 evidence 留 Step 13。 |
| 哪些 P0 用例不能自动化? | 先判断当前 Step 6 P0 候选是否存在不可自动化项。 | R9.2 写人工/不可自动化清单候选。 |
| 是否存在 gate / evidence 缺口? | 先列审计维度: P0 gap、suite 重叠、report pairing、redaction check、dependency check。 | R9.2 写停审与跨 suite 审计框架。 |

### 4. L1-governance Step 9 框架参考思考

L1-governance Step 9 的可借鉴点是“把用例族落到 suite/gate/report/check 的可执行结构,并把 raw artifact 与 human report 的配对意识提前放进门禁设计”。L3 采用框架,不复制 governance 领域事实。

| L1-governance 框架点 | L3 采用方式 | L3 禁止 |
|---|---|---|
| 先声明 Step 状态、目标、输入基线和非范围 | L3 R9.1 先记录 Step 8 handoff、必读文档和禁止范围。 | 直接写正式 `05` §9。 |
| suite 表按覆盖范围、执行位置、触发、阻断、脚本、artifact、report 组织 | L3 R9.2 可按同样列组织候选表。 | R9.1 不写最终 suite 表。 |
| PR / main / nightly / release / P1 selected-run 分层 | L3 保留同类 gate layering,但按 L3 的 truth、formalization、consumption、job、config/redaction 用例族映射。 | 复制 governance 的业务闭环和 TC/EV 编号。 |
| gate/report/check 脚本目录约束 | L3 保留 `scripts/gates/`、`scripts/reports/`、`scripts/checks/` 三类职责。 | 在设计中实现脚本或写实现仓测试函数名。 |
| report 必须从 raw artifact 推导 | L3 Step 9 只定义方向,Step 13 才闭合 artifact/report schema。 | 用静态 JSON 或手写 report 直接宣告 EV pass。 |
| P1 selected-run 不阻断 P0 | L3 对 `staging-like` / `production-like` 采用 selected-run / residual。 | P1 unavailable 记作 P0 pass。 |

### 5. L3 suite family 候选思考

R9.1 只列 suite family 候选,不把它们定稿为最终 suite 表。最终命名、执行位置、触发条件、阻断级别和输出路径由 R9.2 以后写入。

| 候选 suite family | 主要风险方向 | 主要承接来源 |
|---|---|---|
| `contract-domain-fast` | typed refs、DTO shell、truth invariant、policy guard、state matrix。 | Step 4 Unit / Contract;Step 6 truth / formalization / state 用例族。 |
| `service-flow-fast` | command/query/consumer/outbound/job flow 编排、UoW、duplicate replay、query no-write。 | Step 4 Application service / Flow;Step 6 command/query/replay/job 用例族。 |
| `infra-runtime-fake` | fake repository、controlled adapter、runtime builder、profile assembly。 | Step 4 fake integration;Step 8 `ci-test` / `integration-like`。 |
| `entry-worker-job` | API / worker / job entry shell、runner envelope、safe response / report / disposition。 | Step 4 entry 层;Step 6 inbound/outbound/job 用例族。 |
| `operations-replay-core` | stored replay、checkpoint/report、partial failure、no truth repair。 | Step 6 trace/job/recovery;Step 7 replay/report DS;Step 8 operations-replay。 |
| `config-redline` | strict validation、profile isolation、no silent fallback、forbidden configurable boundary。 | `04` §6 / §9 / §11;Step 6 config 用例族。 |
| `dependency-boundary` | only `core-contracts` compile dependency、runtime/event/replay boundary。 | `03` §3 / §4 / §13;Step 8 dependency table。 |
| `redaction-boundary` | no raw body / secret / endpoint / provider response in logs、reports、artifacts。 | `03` §14;`04` §8 / §11;Step 6 redaction/observability 用例族。 |
| `observability-boundary` | metric low-cardinality、trace/span body-free、audit refs-only。 | `03` §14;Step 6 metric/observability/audit 用例族。 |
| `report-generation-audit` | raw artifact 与 human report 配对、failed suite 仍留 failure reason、禁止静态造证据。 | SOP Step 9;Step 13 后续 evidence/report。 |
| `release-main-smoke` | 最小跨入口闭环、profile assembly、redaction/dependency/report audit 汇总。 | Step 4 Release gate;Step 8 P0 profiles。 |
| `p1-real-like-selected-run` | future durable / real-like adapter selected-run。 | Step 8 `staging-like` / `production-like` P1/P2 direction。 |

### 6. Gate layering 候选思考

| Gate 层 | R9.1 候选职责 | 禁止误用 |
|---|---|---|
| PR | 快速阻断 schema、domain、service、config、dependency 边界错误。 | 跑过慢 replay 后替代 main/release。 |
| main CI | P0 自动化主门禁,覆盖 fake integration、entry/worker/job、redaction、operations replay core。 | 把 P1 real-like unavailable 算失败或成功。 |
| nightly | 承载更重的 recovery、fault injection、report audit、扩展 replay。 | 替代 release selected run 或掩盖 main CI failure。 |
| release gate | 固定最小 smoke、config/redaction/dependency/report audit 汇总,失败阻断送验。 | 用通用测试计数或手工 report 替代场景级断言。 |
| P1 selected-run | 针对 staging-like / production-like future dependency 的显式选择运行。 | 成为当前 P0 pass 前置。 |

### 7. Run 参数与输出边界思考

Step 9 必须建立 run-scoped 门禁意识,但 R9.1 不固定正式 artifact/report schema。

| 主题 | R9.1 判断 | 后续归属 |
|---|---|---|
| `run_id` / run namespace | 所有自动化结果必须可回到一个明确 run,不得引用 `latest`。 | R9.2 写 gate 参数候选;Step 13 固定 schema。 |
| artifact root | 需要按 SOP 使用 run-scoped raw artifact root 方向。 | R9.2 写输出方向;Step 13 定义 artifact schema。 |
| report root | human report 必须从 raw artifact 推导,不得静态宣告通过。 | R9.2 写 report script family;Step 13 固定 report 结构。 |
| config profile 参数 | gate 必须显式选择 Step 8 已存在 profile,不得新增 profile。 | R9.2 写参数边界;`04` owns profile source。 |
| failure artifact | failed / timeout / flaky / dependency missing 也必须留下 safe failure reason。 | R9.2 写失败处理;Step 13 定义字段和值域。 |

### 8. Redaction / dependency / report audit 后移边界

| 审计主题 | Step 9 可以做 | Step 9 不得做 |
|---|---|---|
| redaction check | 规定必须有自动化 check family 和 release gate 阻断方向。 | 定义 scanner 实现、secret pattern、artifact JSON 字段或验收裁决。 |
| dependency boundary | 规定必须检查非 `core-contracts` sibling compile dependency。 | 定义实现仓 manifest 具体路径或 dependency graph schema。 |
| report generation audit | 规定 report 必须从 artifact 推导、suite/report 必须配对。 | 定义 Step 13 report schema、retention、EV index 或 acceptance report。 |
| no static evidence | 规定不能从静态 JSON / 手写 report 伪造通过。 | 固定 evidence ID、evidence JSON required keys 或 acceptance verdict。 |
| observability audit | 规定 logs/metrics/traces/audit/report 不得泄露 raw body / secret。 | 定义 backend、metric name、span schema、dashboard 或 alert threshold。 |

### 9. source gap 与停审风险

| 风险 | R9.1 判断 | 处理 |
|---|---|---|
| suite 覆盖需要新增 TC 或断言 | Step 9 不新增用例或断言。 | 回 Step 6。 |
| suite 需要新数据集或 fixture | Step 9 不新增 DS、fixture、builder 或 seed。 | 回 Step 7。 |
| suite 需要新环境/profile/config key | Step 9 不新增 profile、config key、env key 或 product。 | 回 Step 8 / `04`。 |
| suite 需要 formal marker/source/mapper | Step 9 不用脚本、fake 或 check 私补正式 source。 | 回 owning `03/04`。 |
| artifact/report/schema 字段不闭合 | Step 9 只写输出方向和配对要求。 | Step 13 闭合。 |
| acceptance/release verdict 不闭合 | Step 9 只写阻断方向,不写验收裁决。 | Step 12 / `06` 闭合。 |
| implementation boundary 不存在 | Step 9 不写 phase、commit、ledger 或 required_checks。 | `07-实施计划.md` 闭合。 |

### 10. R9.2 写入边界

R9.2 可以写入:

1. Step 9 开工基线、输入列表和禁止范围。
2. SOP Step 9 问题回答的候选版本。
3. L1-governance Step 9 框架参考边界。
4. L3 suite family 候选表和 gate layering 候选图。
5. gate / report / check 脚本家族候选,只到职责和目录级别。
6. run 参数、artifact/report 输出方向和 failure handling 原则。
7. 后续 R9.x 分批计划和 R9.3 进入门禁。

R9.2 禁止写入:

1. 完整最终 suite-to-case / suite-to-evidence 映射。
2. 正式 evidence ID、artifact JSON schema、case JSON schema、report schema、retention、review status。
3. 具体实现仓测试函数名、脚本实现、CI YAML、package command 或 required check 绑定。
4. 新增 TC、DS、环境、config key、secret provider、adapter product、topic、port、mapper、marker source 或 phase boundary。
5. 修改正式 `05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` 或 implementation code。

### 11. R9.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 Step 9 自动化与 CI/CD 门禁边界 | pass |
| 是否承接 Step 4/6/7/8 已确认中间产物 | pass |
| 是否读取并对照 SOP Step 9 和书写规范 §5.9 | pass |
| 是否参考 L1-governance 框架但未复制领域事实 | pass |
| 是否形成 L3 suite family、gate layering、run 参数和审计后移边界思考 | pass |
| 是否未写最终 suite 表、CI/CD 图、脚本表、artifact/report 映射或 suite-to-case 映射 | pass |
| 是否未写 evidence schema、验收标准、实施计划或 implementation code | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 9 `R9.2 automation / gates:再写入`;只允许写入 Step 9 开工基线、输入列表、禁止范围、SOP 问题回答候选、L1-governance 框架参考边界、L3 suite family 候选表、gate layering 候选图、gate/report/check 脚本家族候选、run 参数边界、artifact/report 输出方向、failure handling 原则、后续 R9.x 分批计划和 `R9.3` 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写完整 suite-to-case/evidence 映射、evidence schema、验收标准、实施计划或 implementation code。

---

## R9.2 automation / gates:再写入

### 1. 当前模块写入目标

`R9.2` 将 R9.1 的思考固化为 Step 9 的执行骨架。它只写自动化门禁的开工基线、输入边界、候选 suite family、gate layering、脚本家族、run 参数、artifact/report 输出方向、failure handling 和后续分批计划。

当前模块不写完整 suite-to-case / suite-to-evidence 映射,不定义 evidence schema、artifact JSON schema、report schema、验收标准、实施计划、CI YAML、实现仓测试函数名或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R9.3 |
| 用户确认 | 已确认从 `R9.1` 推进到 `R9.2`。 |
| 当前允许 | 写 Step 9 开工基线、输入列表、禁止范围、SOP 问题候选回答、suite family 候选、gate layering 候选、脚本家族候选、run 参数边界、输出方向、失败处理和 R9.x 分批计划。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写完整 suite-to-case / suite-to-evidence 映射;evidence / artifact / report schema;验收标准;实施计划;CI YAML;实现仓测试函数名或 implementation code。 |

### 2. Step 9 开工基线

| 基线项 | 当前裁决 | Step 9 使用方式 |
|---|---|---|
| 上游测试分层 | Step 4 已固定 Unit / Contract、Application service / Flow、Fake integration、Entry / runner、Release gate。 | suite family 必须按风险发现层级承接,不得让 release gate 替代底层断言。 |
| 用例矩阵 | Step 6 已形成 83 条唯一 `TC-ML-*` 候选用例。 | Step 9 只分配自动化承接方向,不新增或改写 TC。 |
| 测试数据 | Step 7 已形成 81 个唯一 `DS-ML-*` 数据集和 run namespace / fixture / fake / fault profile 规则。 | suite 只能引用数据族方向,不新增 fixture / builder / seed。 |
| 环境与 profile | Step 8 已固定 P0 `local-dev`、`ci-test`、`integration-like`、`operations-replay`;P1/P2 `staging-like`、`production-like`。 | gate 只能使用这些 profile,不得新增环境或产品。 |
| 依赖裁剪 | 只有 `L0-core` / `core-contracts` 是 compile dependency candidate。 | dependency check 必须防止其他 sibling repo 进入 compile dependency。 |
| 证据边界 | evidence ID、artifact JSON schema、case JSON schema、report schema 未闭合。 | Step 9 只写输出方向和配对要求,正式 schema 留 Step 13。 |

### 3. 必读输入清单与读取状态

| 输入 | 读取状态 | Step 9 用途 | 当前裁决 |
|---|---|---|---|
| `project_execution_ledger.md` | 已读取并承接 | 确认当前模块为 `R9.2`,单模块推进。 | 本轮只推进 `R9.2`。 |
| `05_test_plan_calibration_flow.md` | 已读取并承接 | 确认 Step 1~8 completed、Step 9 R9.1 completed、Step 10+ blocked。 | `R9.2` 完成后等待 `R9.3`。 |
| `05_test_plan_step_04_strategy_layers.md` | 已承接 | 提供 suite 分层依据。 | 不重开分层。 |
| `05_test_plan_step_06_cases.md` | 已承接 | 提供 TC family、自动化候选和后移边界。 | 不新增 TC。 |
| `05_test_plan_step_07_test_data.md` | 已承接 | 提供 DS family、run namespace、fixture / fake / fault profile。 | 不新增 DS。 |
| `05_test_plan_step_08_environment_config.md` | 已承接 | 提供 profile、依赖类型、协作方式、不可用处理。 | 不新增环境 / profile。 |
| SOP Step 9 | 已读取 | 固定 suite 表、CI/CD 图、脚本表、artifact/report 映射、停审和审计要求。 | 当前先写候选骨架。 |
| 书写规范 §5.9 | 已读取 | 固定正式 §9 必须有 suite、gate、脚本、artifact、report 和阻断级别。 | 正式 §9 留 Step 15 装配。 |
| L1-governance Step 9 | 已对照 | 参考表格密度、run-scoped 输出和停审结构。 | framework reference only。 |

### 4. SOP Step 9 问题候选回答

| SOP 问题 | R9.2 候选回答 |
|---|---|
| 哪些 suite 必须进 PR? | `contract-domain-fast`、`service-flow-fast`、`config-redline`、`dependency-boundary` 是 PR 快速阻断候选。它们覆盖 schema/domain/service/config/dependency 方向,具体 TC 映射后续分批写。 |
| 哪些 suite 进 main CI? | main CI 候选在 PR suite 基础上加入 `infra-runtime-fake`、`entry-worker-job`、`operations-replay-core`、`redaction-boundary`、`observability-boundary`。 |
| 哪些 suite 进 nightly? | nightly 候选承接更重的 `operations-replay-extended`、`fault-injection-matrix`、`report-generation-audit`。 |
| 哪些 suite 是 staging smoke 或 release gate? | release gate 候选包含 `release-main-smoke`、release config/redaction/dependency/report audit;`p1-real-like-selected-run` 只属于 P1 selected-run。 |
| flaky、超时和依赖故障如何处理? | P0 suite 必须 deterministic;flaky、timeout、阻断依赖缺失均为 failed,不得自动改写为 pass。P1 selected-run unavailable 只记 residual。 |
| 每个阻断 suite 由哪个脚本执行? | gate 入口候选在 `scripts/gates/`;report 生成候选在 `scripts/reports/`;redaction/dependency/report pairing 等 check 候选在 `scripts/checks/`。 |
| artifact-root 是否为 `artifacts/test/<run_id>`? | 是,但当前只固定路径方向和 run-scoped 约束;schema 留 Step 13。不得使用 `latest`。 |
| gate 是否支持 `--run-id`、`--artifact-root`、`--config-profile`? | 必须支持 run/profile 显式选择方向;参数和值域约束在本 Step 只到边界级别,不定义 CLI 实现。 |
| 哪些 checks 进入 release gate? | redaction、dependency boundary、artifact/report pairing、no static evidence 是 release 阻断 check family 候选。 |
| 哪些 reports 在 gate 后生成 `reports/runs/<run_id>`? | suite human report、gate summary、redaction/dependency/report audit 和 evidence candidate summary 是 report family 候选;正式结构留 Step 13。 |
| 每个 suite 覆盖哪些切口、用例和证据 ID? | R9.2 只按 suite family 和测试切口族建立承接方向;完整 suite-to-TC / evidence mapping 留后续 R9.x。 |
| 哪些 P0 用例不能自动化? | 当前没有发现必须标为不可自动化的 P0 用例;若后续 R9.x 发现不可自动化,必须写原因、人工证据方向和风险接受。 |

### 5. L1-governance Step 9 框架参考边界

| 框架点 | L3 采用 | L3 差异 |
|---|---|---|
| suite / gate / script / output 分表 | 采用;L3 也需要 suite family、gate layering、脚本家族和输出方向。 | R9.2 只写候选骨架,完整 mapping 后续分批。 |
| run-scoped artifact/report | 采用;所有自动化结果必须绑定 `<run_id>`。 | 正式 JSON 字段和值域不在 R9.2 定义。 |
| PR / main / nightly / release / P1 selected-run | 采用;作为自动化层次。 | L3 release smoke 只证明方法资产最小闭环和边界 guard,不复制 governance 业务闭环。 |
| redaction / dependency / report audit | 采用;作为阻断 check family。 | scanner、manifest path、report schema 和验收裁决均后移。 |
| P1 selected-run residual | 采用;不可用不阻断 P0。 | 不把 staging-like / production-like 作为当前 P0 前置。 |

### 6. L3 suite family 候选表

| Suite family | 覆盖范围候选 | 候选执行位置 | 阻断级别候选 | 脚本家族候选 | 输出方向候选 | 后续落点 |
|---|---|---|---|---|---|---|
| `contract-domain-fast` | typed refs、DTO shell、truth invariant、policy guard、state matrix。 | PR / main | P0 blocking | gate | suite artifact + suite report | R9.3/R9.4 |
| `service-flow-fast` | command/query/consumer/outbound/job flow、UoW、duplicate replay、query no-write。 | PR / main | P0 blocking | gate | suite artifact + suite report | R9.3/R9.4 |
| `config-redline` | strict validation、profile isolation、no silent fallback、forbidden configurable boundary。 | PR / main / release | P0 blocking | gate/check | suite artifact + config report | R9.3/R9.4 |
| `dependency-boundary` | only `core-contracts` compile dependency、runtime/event/replay boundary。 | PR / main / release | P0 blocking | check | dependency report | R9.3/R9.4 |
| `infra-runtime-fake` | fake repository、controlled adapter、runtime builder、profile assembly。 | main | P0 blocking | gate | suite artifact + suite report | R9.3/R9.4 |
| `entry-worker-job` | API / worker / job entry shell、runner envelope、safe response/report/disposition。 | main | P0 blocking | gate | suite artifact + suite report | R9.3/R9.4 |
| `operations-replay-core` | stored replay、checkpoint/report、partial failure、no truth repair。 | main / release | P0 blocking | gate | replay artifact + suite report | R9.5/R9.6 |
| `redaction-boundary` | no raw body / secret / endpoint / provider response in observable outputs。 | main / release | P0 blocking | check | redaction report | R9.5/R9.6 |
| `observability-boundary` | metric low-cardinality、trace/span body-free、audit refs-only。 | main / nightly | P0 blocking | gate/check | observability report | R9.5/R9.6 |
| `operations-replay-extended` | wider recovery、fault injection、race / retry / partial report samples。 | nightly | P0 nightly blocking;release only selected | gate | replay artifact + suite report | R9.5/R9.6 |
| `fault-injection-matrix` | UoW fault、adapter unavailable、publisher/handoff failed、source missing stop。 | nightly | P0 nightly blocking | gate | fault artifact + suite report | R9.5/R9.6 |
| `report-generation-audit` | artifact/report pairing、failed artifact retention、no static evidence。 | nightly / release | P0 blocking | check/report | report audit | R9.7/R9.8 |
| `release-main-smoke` | minimal cross-entry smoke、profile assembly、release summary input。 | release | P0 blocking | gate | release suite artifact + report | R9.5/R9.6 |
| `p1-real-like-selected-run` | future durable / real-like adapter selected-run。 | explicit P1 selected-run | non-P0 residual | gate | selected-run artifact + report direction | R9.5/R9.6 |

### 7. Gate layering 候选图

```text
PR
  -> contract-domain-fast
  -> service-flow-fast
  -> config-redline
  -> dependency-boundary

main CI
  -> PR suites
  -> infra-runtime-fake
  -> entry-worker-job
  -> operations-replay-core
  -> redaction-boundary
  -> observability-boundary

nightly
  -> main CI suites
  -> operations-replay-extended
  -> fault-injection-matrix
  -> report-generation-audit

release gate
  -> release-main-smoke
  -> config-redline
  -> dependency-boundary
  -> redaction-boundary
  -> report-generation-audit
  -> gate summary / report generation

P1 selected-run
  -> p1-real-like-selected-run
  -> unavailable is residual,not P0 pass
```

关键说明:

- PR gate 只负责快速阻断,不代表全部 P0 覆盖完成。
- main CI 是当前 P0 自动化主体,必须覆盖 fake / controlled / entry / redaction / observability 主体。
- nightly 可覆盖更重故障矩阵,但不得掩盖 main CI failure。
- release gate 必须从已执行 suite 的 raw artifact / report direction 汇总,不得用手写 summary 宣告通过。
- P1 selected-run 不可用只记录 residual,不得计入 P0 pass。

### 8. Gate / report / check 脚本家族候选

| 脚本家族 | 类型 | 输入边界候选 | 输出方向候选 | 失败处理候选 |
|---|---|---|---|---|
| `scripts/gates/run_ci_gate.sh` | gate | `--gate`;`--suite`;`--run-id`;`--artifact-root`;`--config-profile`。 | suite raw artifact direction。 | 非 0 阻断;failed suite 仍保留 safe failure reason。 |
| `scripts/gates/run_release_gate.sh` | gate | `--run-id`;`--artifact-root`;`--report-root`;`--config-profile`;release suite selector。 | release suite artifact and gate summary input direction。 | 任一 P0 release suite failed 即阻断送验。 |
| `scripts/gates/run_selected_p1_gate.sh` | gate | `--run-id`;`--artifact-root`;P1 profile / selected dependency refs direction。 | selected-run artifact / unavailable report direction。 | 不阻断 P0;unavailable 记录 residual。 |
| `scripts/reports/generate_reports.sh` | report | `--run-id`;`--artifact-root`;`--report-root`。 | suite human report and run summary direction。 | artifact 缺失或不可解析时 failed。 |
| `scripts/reports/build_gate_summary.sh` | report | run-scoped report root。 | gate summary direction。 | 不得覆盖 failed suite 为 passed。 |
| `scripts/reports/build_evidence_candidates.sh` | report | suite artifact / report direction。 | evidence candidate summary direction。 | 只生成 candidate,正式 EV / schema 留 Step 13。 |
| `scripts/checks/check_redaction.sh` | check | artifact/report roots and safe deny-list ref direction。 | redaction check report direction。 | raw body / secret / endpoint / unsafe full ref 命中即阻断。 |
| `scripts/checks/check_dependency_boundary.sh` | check | dependency metadata / generated graph direction。 | dependency boundary report direction。 | 非 `core-contracts` sibling compile dependency 命中即阻断。 |
| `scripts/checks/check_artifact_report_pairing.sh` | check | artifact root and report root direction。 | pairing audit report direction。 | blocking suite 缺 artifact 或 report 即阻断。 |
| `scripts/checks/check_no_static_evidence.sh` | check | reports / evidence candidate direction。 | static evidence guard report direction。 | 静态 JSON / 手写 report 直接宣告通过即阻断。 |

### 9. Run 参数与输出方向

| 参数 / 输出 | R9.2 边界 | 禁止 |
|---|---|---|
| `--run-id` | 每次 gate 必须绑定 run identity;可由 CI 显式传入或由受控入口生成。 | 使用 `latest`、当前时间随机拼接后不可追溯、跨 run 复用。 |
| `--artifact-root` | 默认方向为 `artifacts/test/<run_id>`。 | `artifacts/test/<project>/<run_id>`、无 run scope、写入正式 `reports/`。 |
| `--report-root` | 默认方向为 `reports/runs/<run_id>`。 | `reports/<project>`、手写 summary 覆盖 raw artifact。 |
| `--config-profile` | 必须来自 Step 8 / `04` 已定义 profile。 | 新增 profile、用 profile 改变 truth owner / state / marker source。 |
| suite artifact direction | `artifacts/test/<run_id>/suites/<suite>/`。 | R9.2 不定义 `report.json` 字段或 case JSON 字段。 |
| suite report direction | `reports/runs/<run_id>/suites/<suite>.md`。 | R9.2 不定义 report 模板或 acceptance verdict。 |
| gate summary direction | `reports/runs/<run_id>/gate-summary.md` 候选。 | 从静态文件直接宣告 suite pass。 |

### 10. Failure handling 原则

| 失败类型 | P0 处理 | P1/P2 处理 | 备注 |
|---|---|---|---|
| suite failed | 阻断对应 gate。 | selected-run 可记录 residual。 | failed artifact/report direction 仍需保留。 |
| flaky | 视为 failed。 | 可记录 unstable residual。 | 不允许自动 retry 后改写为 pass;retry 策略后续若需要回测试/实施门禁。 |
| timeout | 视为 failed。 | 记录 unavailable / timeout residual。 | 不从 timeout 推断业务状态。 |
| required fixture / fake / profile missing | test fail-fast。 | 不适用。 | 不能跳过后仍计 pass。 |
| optional dependency unavailable | 只有正式 marker/source 存在的预期场景可通过。 | residual。 | 不从 raw error、HTTP code、log 合成 marker。 |
| report generation failed | 阻断 release / report audit。 | residual。 | report 失败不得掩盖 suite 失败。 |
| redaction failure | 阻断。 | 阻断 selected-run report acceptance direction。 | raw body / secret 命中不能降级为 warning。 |
| dependency boundary failure | 阻断。 | 阻断 selected-run dependency check direction。 | 非 `core-contracts` sibling compile dependency 不允许。 |

### 11. 后续 R9.x 分批计划

| 模块 | 主题 | 写入边界 |
|---|---|---|
| `R9.3` | PR / main automation suites:先思考 | 思考 PR / main suite 的覆盖范围、执行位置、触发、阻断、数据/profile 承接和 R9.4 写入边界。 |
| `R9.4` | PR / main automation suites:再写入 | 写 PR / main suite 候选表和单 gate 停审,仍不写完整 evidence schema。 |
| `R9.5` | nightly / release / P1 selected-run gates:先思考 | 思考 nightly、release gate、P1 selected-run 和 release report/check 分层。 |
| `R9.6` | nightly / release / P1 selected-run gates:再写入 | 写 nightly / release / P1 gate 候选表和停审。 |
| `R9.7` | script / run parameter / output direction:先思考 | 思考 gate/report/check 脚本家族、run 参数、artifact/report 方向和 failure handling。 |
| `R9.8` | script / run parameter / output direction:再写入 | 写脚本表、参数表、输出方向表和 failure handling 表。 |
| `R9.9` | suite-to-cut / candidate evidence mapping:先思考 | 思考 suite 到测试切口 / 用例族 / evidence candidate 的映射边界。 |
| `R9.10` | suite-to-cut / candidate evidence mapping:再写入 | 写 suite-to-family / candidate evidence 映射,不定义正式 schema。 |
| `R9.11` | cross-suite audit / closure:先思考 | 思考 P0 自动化缺口、suite 重叠、report pairing、redaction/dependency 和 Step 10 进入门禁。 |
| `R9.12` | cross-suite audit / closure:再写入 | 写 Step 9 总停审、跨 suite 审计和 Step 10 进入门禁。 |

### 12. R9.3 进入门禁

| 门禁项 | 裁决 |
|---|---|
| R9.2 是否只写自动化门禁候选骨架 | pass |
| R9.2 是否未修改正式 `05-测试方案.md` | pass |
| R9.2 是否未写完整 suite-to-case / evidence 映射 | pass |
| R9.2 是否未定义 evidence / artifact / report schema | pass |
| R9.2 是否未新增 TC、DS、环境、config key、marker source 或 phase boundary | pass |

进入 `R9.3 PR / main automation suites:先思考` 时,只允许思考 PR / main suite 的覆盖范围、执行位置、触发、阻断级别、profile / data family 承接、不可用 / flaky / timeout 处理和 `R9.4` 写入边界;不得直接修改正式 `05-测试方案.md`;不得写 nightly / release / P1 gate 正文、完整 suite-to-case/evidence 映射、evidence schema、验收标准、实施计划或 implementation code。

### 13. R9.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 Step 9 开工基线和输入列表 | pass |
| 是否写入 SOP 问题候选回答 | pass |
| 是否参考 L1-governance 框架但未复制领域事实 | pass |
| 是否写入 L3 suite family 候选表和 gate layering 候选图 | pass |
| 是否写入 gate/report/check 脚本家族候选、run 参数边界、输出方向和 failure handling | pass |
| 是否形成后续 R9.x 分批计划和 R9.3 进入门禁 | pass |
| 是否未写完整 suite-to-case / suite-to-evidence 映射 | pass |
| 是否未写 evidence schema、artifact/report schema、验收标准、实施计划或 implementation code | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 9 `R9.3 PR / main automation suites:先思考`;只允许思考 PR / main suite 的覆盖范围、执行位置、触发条件、阻断级别、profile / data family 承接、不可用 / flaky / timeout 处理和 `R9.4 PR / main automation suites:再写入` 边界;不得直接修改正式 `05-测试方案.md`;不得写 nightly / release / P1 gate 正文、完整 suite-to-case/evidence 映射、evidence schema、验收标准、实施计划或 implementation code。

---

## R9.3 PR / main automation suites:先思考

### 1. 当前模块目标

`R9.3` 只思考 PR / main automation suites 的覆盖范围、执行位置、触发条件、阻断级别、profile / data family 承接、不可用 / flaky / timeout 处理和 `R9.4` 写入边界。

当前模块不写最终 PR / main suite 表,不写 nightly / release / P1 selected-run 正文,不写完整 suite-to-case / suite-to-evidence 映射,不定义 evidence schema、artifact JSON schema、report schema、CI YAML、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R9.4 |
| 用户确认 | 已确认从 `R9.2` 推进到 `R9.3`。 |
| 当前允许 | 思考 PR / main suite 的覆盖范围、执行位置、触发条件、阻断级别、profile / data family 承接、不可用 / flaky / timeout 处理和 R9.4 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写 nightly / release / P1 gate 正文;写完整 suite-to-case/evidence 映射;evidence / artifact / report schema;验收标准;实施计划或 implementation code。 |

### 2. R9.3 输入承接

| 输入 | 已闭合结论 | R9.3 思考影响 |
|---|---|---|
| Step 4 分层 | Unit / Contract 和 Application service / Flow 适合 PR / fast CI;Fake integration 和 Entry / runner 适合 main CI。 | PR suite 只能覆盖快速阻断风险;main CI 承接更完整 P0 自动化主体。 |
| Step 6 用例闭合 | 83 条 `TC-ML-*` 已分成 truth/formalization/consumption/trace-job/config-redaction 五批。 | R9.3 只按 family 思考 PR/main 覆盖,不逐条映射 TC。 |
| Step 7 数据闭合 | 81 个 `DS-ML-*`;`DS-ML-RUN-001` 只作 run 壳。 | PR/main suite 可使用 DS family 和 run namespace,但不新增 fixture / builder / seed。 |
| Step 8 环境矩阵 | `ci-test` 是 P0 deterministic 主环境;`integration-like` 是 P0 controlled seam;`local-dev` 是 support。 | PR 默认 fast deterministic;main CI 覆盖 `ci-test` 和 controlled seam 主体。 |
| R9.2 suite family | PR 候选: `contract-domain-fast`、`service-flow-fast`、`config-redline`、`dependency-boundary`;main 候选还包括 `infra-runtime-fake`、`entry-worker-job`、`operations-replay-core`、`redaction-boundary`、`observability-boundary`。 | R9.4 可把这些候选写成 PR/main suite 表。 |
| R9.2 failure handling | P0 flaky / timeout / required dependency missing 均 failed;failed artifact/report direction 仍需保留。 | R9.4 需要为 PR/main suite 写失败处理和停审。 |

### 3. PR suite 候选边界思考

PR gate 的目标是快速阻断“进入 main 前不该存在”的错误。它不承担全部 P0 证明,也不承担慢 replay、release smoke 或 P1 selected-run。

| PR suite 候选 | 主要发现风险 | 数据 / profile 承接 | R9.4 写入提醒 |
|---|---|---|---|
| `contract-domain-fast` | typed refs、DTO shell、truth invariant、policy guard、state matrix、body-free shell。 | `ci-test`;`DS-ML-RUN-001`;`DEF` / `CATALOG` / `FORMAL` / `VERSION` / `STATE` / `BODY` family。 | 写为 PR / main P0 blocking;不写逐 TC mapping。 |
| `service-flow-fast` | command/query/consumer/outbound/job 编排、UoW 调用顺序、duplicate replay、query no-write。 | `ci-test`;`RUN`;`IDEMP` / `RECOVERY` / `QUERY` / `CONSUME` / `REPLAY` family 的 fast subset。 | 只承接 fast deterministic subset;重 replay 留 main/nightly。 |
| `config-redline` | strict validation、profile isolation、no silent fallback、forbidden configurable boundary、unsafe redaction config。 | `ci-test`;`CONFIG` / `DEPENDENCY` / `REDACTION` / `MARKER` family。 | PR 必须阻断非法配置和 forbidden boundary override。 |
| `dependency-boundary` | only `core-contracts` compile dependency、runtime/event/replay 依赖不得进 Cargo。 | local tool + `ci-test`;不需要业务 DS,可用 run context 记录。 | 写为 PR / main / release check family;不定义 manifest path schema。 |

### 4. main CI suite 候选边界思考

main CI 是当前 P0 自动化主体。它必须在 PR suites 基础上覆盖 fake integration、entry/worker/job、operations replay core、redaction 和 observability 的可执行主体。

| main CI suite 候选 | 主要发现风险 | 数据 / profile 承接 | R9.4 写入提醒 |
|---|---|---|---|
| PR suites | 快速阻断风险复跑。 | `ci-test`。 | main CI 应包含 PR suites,避免 merge 后漂移。 |
| `infra-runtime-fake` | fake repository/UoW、controlled adapter、runtime builder、profile assembly、fake parity。 | `ci-test`;`integration-like`;`RUN` / `UOW` / `DEPENDENCY` / `MARKER` / profile family。 | 不要求真实 DB/bus/product;controlled seam 不等于 real SLA。 |
| `entry-worker-job` | API/worker/job entry shell、runner envelope、safe response/report/disposition、entry mapping。 | `ci-test`;`operations-replay` subset;`TRACE` / `AUDIT` / `JOB` / `REPORT` family。 | 验证入口映射和 runner envelope,不替代 service flow 断言。 |
| `operations-replay-core` | stored replay、checkpoint/report、partial failure、no truth repair。 | `operations-replay`;`REPLAY` / `RECOVERY-003~004` / `UOW` / `JOB` / `REPORT` family。 | main 只承接 core subset;extended fault matrix 留 nightly。 |
| `redaction-boundary` | logs/reports/artifacts/diagnostics 不含 raw body、secret、endpoint、provider response。 | `ci-test`;dummy corpus `REDACTION` / `BODY` / `SHELL` family。 | raw secret/body 命中必须阻断;scanner 实现和 schema后移。 |
| `observability-boundary` | metric low-cardinality、trace/span body-free、audit refs-only、diagnostic 不作为 truth。 | `ci-test`;`OBS` / `METRIC` / `AUDIT` / `DIAGNOSTIC` family。 | 不定义 backend、metric name、span schema。 |

### 5. PR 与 main 的触发条件思考

| 触发类型 | PR gate 思考 | main CI 思考 | 禁止 |
|---|---|---|---|
| contract/domain change | 必跑 `contract-domain-fast`。 | 复跑 PR suites。 | 只跑 release smoke。 |
| application / flow change | 必跑 `service-flow-fast`。 | 复跑并加 fake integration / entry。 | 用 unit pass 代替 service flow。 |
| config / profile / runtime builder change | 必跑 `config-redline`。 | 跑 runtime fake / redaction / dependency。 | 非法配置 silent fallback。 |
| manifest / dependency metadata change | 必跑 `dependency-boundary`。 | 复跑 dependency boundary。 | 允许非 `core-contracts` sibling compile dependency。 |
| infra / adapter / fake change | PR 可按 touched scope 跑 fast subset。 | 必跑 `infra-runtime-fake`。 | 把 controlled seam 失败降级为 skip。 |
| entry / worker / jobs change | PR 可跑 service fast subset。 | 必跑 `entry-worker-job` 和相关 replay core。 | 入口层测试替代 service 断言。 |
| observability / redaction change | PR 应跑 config/redaction fast guard。 | 必跑 redaction / observability boundary。 | raw body/secret 命中后记 warning。 |

### 6. 阻断级别与不可用处理思考

| 场景 | PR 处理 | main CI 处理 | R9.4 写入提醒 |
|---|---|---|---|
| suite failed | 阻断 merge。 | 阻断 main pass。 | failed artifact/report direction 仍保留。 |
| flaky | failed。 | failed。 | 不得自动 retry 后改写 pass。 |
| timeout | failed。 | failed。 | 不从 timeout 推断业务状态。 |
| required fixture / fake missing | test fail-fast。 | test fail-fast。 | 不得 skip 后计 pass。 |
| marker/source missing | stop-review / failed。 | stop-review / failed。 | 不用 test helper 合成 marker。 |
| optional dependency unavailable | 仅预期 degraded/unavailable 用例可通过。 | 仅正式 marker/source 存在时可通过。 | raw error/log/HTTP code 不构成 marker。 |
| report generation direction missing | PR 可标记 reporting gap。 | main CI 应 failed 或 stop-review。 | 具体 schema 留 Step 13。 |

### 7. PR / main 与后续模块边界

| 后续模块 | R9.3 可以思考 | R9.3 禁止 |
|---|---|---|
| R9.4 PR / main 写入 | 准备 PR/main suite 表、触发、阻断、profile/data 承接和停审。 | 在 R9.3 直接写最终表。 |
| R9.5/R9.6 nightly / release / P1 | 仅说明不属于本批。 | 写 nightly / release / P1 gate 正文。 |
| R9.7/R9.8 script / output | 复用脚本家族候选。 | 定义 CLI 实现、CI YAML、artifact/report schema。 |
| R9.9/R9.10 suite mapping | 只按 family 粗粒度思考。 | 完整 suite-to-TC / evidence mapping。 |
| Step 13 evidence | 保留 artifact/report direction。 | 写 JSON 字段、EV ID、retention、review status。 |

### 8. R9.4 写入边界

R9.4 可以写入:

1. PR / main suite 候选表。
2. PR / main gate 触发条件表。
3. PR / main profile / data family 承接表。
4. PR / main failure handling 与单 gate stop-review。
5. R9.5 进入门禁。

R9.4 禁止写入:

1. nightly / release / P1 selected-run gate 正文。
2. 完整 suite-to-case / suite-to-evidence 映射。
3. evidence ID、artifact JSON schema、case JSON schema、report schema。
4. CI YAML、实现仓测试函数名、脚本实现、package command 或 required check 绑定。
5. 新增 TC、DS、环境、profile、config key、marker source、adapter product 或 phase boundary。
6. 修改正式 `05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` 或 implementation code。

### 9. R9.3 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 PR / main automation suites | pass |
| 是否承接 Step 4/6/7/8 和 R9.2 | pass |
| 是否区分 PR 快速阻断与 main P0 自动化主体 | pass |
| 是否形成 PR / main suite 候选、触发条件、阻断级别和 data/profile 承接思考 | pass |
| 是否明确 flaky / timeout / required fixture missing / marker source missing 不得伪 pass | pass |
| 是否未写 nightly / release / P1 gate 正文 | pass |
| 是否未写完整 suite-to-case/evidence 映射、evidence schema、验收或实施内容 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 9 `R9.4 PR / main automation suites:再写入`;只允许写入 PR / main suite 候选表、PR / main gate 触发条件表、PR / main profile / data family 承接表、PR / main failure handling 与单 gate stop-review、R9.5 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写 nightly / release / P1 gate 正文、完整 suite-to-case/evidence 映射、evidence schema、验收标准、实施计划或 implementation code。

---

## R9.4 PR / main automation suites:再写入

### 1. 当前模块写入目标

`R9.4` 将 `R9.3` 的 PR / main 思考写成候选表。它只覆盖 PR gate 和 main CI gate 的 suite 候选、触发条件、profile / data family 承接、failure handling、单 gate stop-review 和 `R9.5` 进入门禁。

当前模块不写 nightly / release / P1 selected-run gate 正文,不写完整 suite-to-case / suite-to-evidence 映射,不定义 evidence schema、artifact JSON schema、report schema、CI YAML、required check、实现仓测试函数名、验收标准、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R9.5 |
| 用户确认 | 已确认从 `R9.3` 推进到 `R9.4`。 |
| 当前允许 | 写 PR / main suite 候选表、PR / main gate 触发条件表、PR / main profile / data family 承接表、PR / main failure handling 与单 gate stop-review、R9.5 进入门禁。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写 nightly / release / P1 gate 正文;写完整 suite-to-case/evidence 映射;evidence / artifact / report schema;验收标准;实施计划或 implementation code。 |

### 2. PR gate suite 候选表

PR gate 只做快速阻断。它必须在进入 main 前发现 schema、domain、service、config 和 dependency 边界错误,但不声称完成全部 P0 自动化覆盖。

| Suite | 覆盖范围候选 | 执行位置 | 触发条件候选 | 阻断级别 | 脚本家族候选 | artifact/report 方向 |
|---|---|---|---|---|---|---|
| `contract-domain-fast` | typed refs、DTO shell、truth invariant、policy guard、state matrix、body-free shell。 | PR / main | contracts/domain/shared type/object/state/policy 相关变更。 | P0 blocking | `scripts/gates/run_ci_gate.sh` family | `artifacts/test/<run_id>/suites/contract-domain-fast/`;`reports/runs/<run_id>/suites/contract-domain-fast.md` direction。 |
| `service-flow-fast` | command/query/consumer/outbound/job flow fast subset、UoW 调用顺序、duplicate replay、query no-write。 | PR / main | application flow、port contract、service orchestration、fast fake 相关变更。 | P0 blocking | `scripts/gates/run_ci_gate.sh` family | `artifacts/test/<run_id>/suites/service-flow-fast/`;`reports/runs/<run_id>/suites/service-flow-fast.md` direction。 |
| `config-redline` | strict validation、profile isolation、no silent fallback、forbidden configurable boundary、unsafe redaction config。 | PR / main / release direction | config source/profile/runtime builder/redaction/config boundary 相关变更。 | P0 blocking | gate/check family | `artifacts/test/<run_id>/suites/config-redline/`;`reports/runs/<run_id>/suites/config-redline.md` direction。 |
| `dependency-boundary` | only `core-contracts` compile dependency、runtime/event/replay 依赖不得进 Cargo。 | PR / main / release direction | dependency metadata、manifest、workspace layout、sibling repo boundary 相关变更。 | P0 blocking | `scripts/checks/check_dependency_boundary.sh` family | `artifacts/test/<run_id>/suites/dependency-boundary/`;`reports/runs/<run_id>/dependency-boundary.md` direction。 |

### 3. main CI suite 候选表

main CI 是当前 P0 自动化主体。它应复跑 PR suites,并增加 fake integration、entry/worker/job、operations replay core、redaction 和 observability boundary。

| Suite | 覆盖范围候选 | 执行位置 | 触发条件候选 | 阻断级别 | 脚本家族候选 | artifact/report 方向 |
|---|---|---|---|---|---|---|
| PR suites | PR gate 所有快速阻断 suite。 | main | merge to main 或 main branch validation。 | P0 blocking | gate/check family | 复用各 suite 输出方向。 |
| `infra-runtime-fake` | fake repository/UoW、controlled adapter、runtime builder、profile assembly、fake parity。 | main | infra、adapter、runtime builder、fake store、profile binding 相关变更。 | P0 blocking | `scripts/gates/run_ci_gate.sh` family | `artifacts/test/<run_id>/suites/infra-runtime-fake/`;`reports/runs/<run_id>/suites/infra-runtime-fake.md` direction。 |
| `entry-worker-job` | API/worker/job entry shell、runner envelope、safe response/report/disposition、entry mapping。 | main | api/worker/jobs entry、runner envelope、public shell mapping 相关变更。 | P0 blocking | `scripts/gates/run_ci_gate.sh` family | `artifacts/test/<run_id>/suites/entry-worker-job/`;`reports/runs/<run_id>/suites/entry-worker-job.md` direction。 |
| `operations-replay-core` | stored replay、checkpoint/report、partial failure、no truth repair core subset。 | main | job/replay/checkpoint/report/UoW/recovery source 相关变更。 | P0 blocking | `scripts/gates/run_ci_gate.sh` family | `artifacts/test/<run_id>/suites/operations-replay-core/`;`reports/runs/<run_id>/suites/operations-replay-core.md` direction。 |
| `redaction-boundary` | logs/reports/artifacts/diagnostics 不含 raw body、secret、endpoint、provider response。 | main | redaction、diagnostic、report/artifact output、adapter error handling 相关变更。 | P0 blocking | `scripts/checks/check_redaction.sh` family | `artifacts/test/<run_id>/suites/redaction-boundary/`;`reports/runs/<run_id>/redaction-check.md` direction。 |
| `observability-boundary` | metric low-cardinality、trace/span body-free、audit refs-only、diagnostic 不作为 truth。 | main | metric/trace/audit/diagnostic/observability guard 相关变更。 | P0 blocking | gate/check family | `artifacts/test/<run_id>/suites/observability-boundary/`;`reports/runs/<run_id>/suites/observability-boundary.md` direction。 |

### 4. PR / main gate 触发条件表

| 触发类型 | PR gate 候选 | main CI 候选 | 裁决 |
|---|---|---|---|
| contracts / domain / state / policy change | `contract-domain-fast` | PR suites | PR 必跑;main 复跑。 |
| application / flow / port contract change | `service-flow-fast` | PR suites + `infra-runtime-fake` when port fake affected | PR 必跑 service fast;main 补 fake integration。 |
| config / profile / runtime builder change | `config-redline` | PR suites + `infra-runtime-fake` + redaction/dependency as needed | 非法配置、profile 污染和 forbidden boundary override 必阻断。 |
| manifest / dependency metadata / workspace layout change | `dependency-boundary` | PR suites + `dependency-boundary` | 非 `core-contracts` sibling compile dependency 必阻断。 |
| infra / adapter / fake store change | impacted PR fast subset | `infra-runtime-fake` | controlled seam / fake parity 失败不得 skip。 |
| api / worker / jobs entry change | `service-flow-fast` fast subset | `entry-worker-job` + impacted PR suites | entry 只验证映射和 envelope,不替代 service flow。 |
| job / replay / checkpoint / report core change | `service-flow-fast` fast subset | `operations-replay-core` | main 承接 core replay;extended replay 留 nightly。 |
| redaction / diagnostic / report output change | `config-redline` or redaction fast guard direction | `redaction-boundary` | raw body / secret 命中必须阻断。 |
| metric / trace / audit output change | impacted contract/service fast subset | `observability-boundary` | 不定义 backend/schema,只验证 body-free / low-cardinality direction。 |

### 5. PR / main profile 与 data family 承接表

| Suite | profile 承接 | data family 承接 | 不得使用 |
|---|---|---|---|
| `contract-domain-fast` | `ci-test`;local support 可手动 sanity。 | `RUN`;`DEF`;`CATALOG`;`FORMAL`;`VERSION`;`STATE`;`BODY` family。 | `staging-like` / `production-like`;真实 provider;production data。 |
| `service-flow-fast` | `ci-test`。 | `RUN`;`IDEMP`;`RECOVERY-001~002`;`QUERY`;`CONSUME`;fast `REPLAY` subset。 | slow replay matrix;真实 downstream state。 |
| `config-redline` | `ci-test`;profile isolation includes negative production-like fixture contamination checks。 | `CONFIG`;`DEPENDENCY`;`REDACTION`;`MARKER`;`RUN`。 | 新 config key、env key、secret provider schema。 |
| `dependency-boundary` | `ci-test` local tool direction。 | `RUN` optional for run context;no business DS required。 | dependency graph schema in this step;non-core path dependency。 |
| `infra-runtime-fake` | `ci-test`;`integration-like` controlled seam subset。 | `RUN`;`UOW`;`DEPENDENCY`;`MARKER`;profile / fake store family。 | real DB、broker、secret provider、external product。 |
| `entry-worker-job` | `ci-test`;operations-replay subset only when entry/job runner needs replay shell。 | `TRACE`;`AUDIT`;`JOB`;`REPORT`;`RUN`。 | entry test replacing domain/service assertions。 |
| `operations-replay-core` | `operations-replay`;`ci-test` for deterministic core subset。 | `REPLAY`;`RECOVERY-003~004`;`UOW`;`JOB`;`REPORT`;`TRACE`;`AUDIT`。 | raw replay body;truth repair worker。 |
| `redaction-boundary` | `ci-test`。 | `REDACTION`;`BODY`;`SHELL`;`DIAGNOSTIC`;dummy leak corpus。 | real secret、endpoint、DSN、provider response。 |
| `observability-boundary` | `ci-test`。 | `OBS`;`METRIC`;`AUDIT`;`DIAGNOSTIC`;`TRACE`。 | metric backend、trace backend、dashboard schema。 |

### 6. PR / main failure handling

| 失败类型 | PR gate 裁决 | main CI 裁决 | 说明 |
|---|---|---|---|
| suite failed | blocking failed。 | blocking failed。 | 不允许手工 summary 改 pass。 |
| flaky | failed。 | failed。 | Retry 后若仍不稳定,不得计 pass;retry 策略不在本 Step 定义。 |
| timeout | failed。 | failed。 | timeout 不是业务状态或 unavailable marker。 |
| required fixture / fake / profile missing | test fail-fast。 | test fail-fast。 | 不能 skip 后计 pass。 |
| marker/source/schema missing | stop-review / failed。 | stop-review / failed。 | 不用 fixture、private fake map、raw error 或 route param 私补。 |
| optional dependency unavailable | 仅预期 degraded/unavailable 用例可通过。 | 仅正式 marker/source 存在时可通过。 | raw error、HTTP code、log、metric 不构成 marker。 |
| redaction failure | blocking failed。 | blocking failed。 | raw body / secret / endpoint / full sensitive ref 命中不能降为 warning。 |
| dependency boundary failure | blocking failed。 | blocking failed。 | 非 `core-contracts` sibling compile dependency 不允许。 |
| report generation direction missing | reporting gap。 | failed or stop-review。 | 具体 JSON/schema 留 Step 13,但 main 不应缺 human report direction。 |

### 7. PR / main 单 gate stop-review

| Gate / Suite | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| PR gate | 是否覆盖快速阻断风险 | pass | 覆盖 contract/domain、service flow、config redline、dependency boundary。 |
| PR gate | 是否未声称完成全部 P0 | pass | fake integration、entry、replay、redaction/observability 主体留 main。 |
| main CI | 是否覆盖 P0 自动化主体 | pass | 覆盖 PR suites、infra runtime fake、entry/worker/job、operations replay core、redaction、observability。 |
| main CI | 是否避免真实产品前置 | pass | 仅使用 `ci-test`、`integration-like`、`operations-replay` P0 profile direction。 |
| PR/main | 是否保留 failed artifact/report direction | pass | 输出方向已写,正式 schema 留 Step 13。 |
| PR/main | 是否未写 nightly / release / P1 正文 | pass | 后续 R9.5/R9.6 承接。 |
| PR/main | 是否未写完整 suite-to-TC / evidence 映射 | pass | 后续 R9.9/R9.10 承接。 |

### 8. R9.5 进入门禁

| 门禁项 | 裁决 |
|---|---|
| R9.4 是否只写 PR / main suite 候选与门禁 | pass |
| PR / main 是否区分快速阻断与 P0 主体 | pass |
| PR / main 是否有 profile / data family 承接 | pass |
| PR / main 是否有 failure handling 和 stop-review | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写 nightly / release / P1 gate 正文 | pass |
| 是否未写完整 suite-to-case/evidence 映射或 evidence schema | pass |

进入 `R9.5 nightly / release / P1 selected-run gates:先思考` 时,只允许思考 nightly、release gate、P1 selected-run 的覆盖范围、执行位置、触发条件、阻断 / residual 级别、profile / data family 承接、release report/check 分层和 `R9.6` 写入边界;不得直接修改正式 `05-测试方案.md`;不得写 script/output 最终表、完整 suite-to-case/evidence 映射、evidence schema、验收标准、实施计划或 implementation code。

### 9. R9.4 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 PR gate suite 候选表 | pass |
| 是否写入 main CI suite 候选表 | pass |
| 是否写入 PR / main gate 触发条件表 | pass |
| 是否写入 PR / main profile 与 data family 承接表 | pass |
| 是否写入 PR / main failure handling 与单 gate stop-review | pass |
| 是否形成 R9.5 进入门禁 | pass |
| 是否未写 nightly / release / P1 gate 正文 | pass |
| 是否未写完整 suite-to-case/evidence 映射、evidence schema、验收或实施内容 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 9 `R9.5 nightly / release / P1 selected-run gates:先思考`;只允许思考 nightly、release gate、P1 selected-run 的覆盖范围、执行位置、触发条件、阻断 / residual 级别、profile / data family 承接、release report/check 分层和 `R9.6 nightly / release / P1 selected-run gates:再写入` 边界;不得直接修改正式 `05-测试方案.md`;不得写 script/output 最终表、完整 suite-to-case/evidence 映射、evidence schema、验收标准、实施计划或 implementation code。

---

## R9.5 nightly / release / P1 selected-run gates:先思考

### 1. 当前模块目标

`R9.5` 只思考 nightly、release gate 和 P1 selected-run 的覆盖范围、执行位置、触发条件、阻断 / residual 级别、profile / data family 承接、release report/check 分层和 `R9.6` 写入边界。

当前模块不写最终 nightly / release / P1 gate 表,不写 script/output 最终表,不写完整 suite-to-case / suite-to-evidence 映射,不定义 evidence schema、artifact JSON schema、report schema、CI YAML、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R9.6 |
| 用户确认 | 已确认从 `R9.4` 推进到 `R9.5`。 |
| 当前允许 | 思考 nightly、release gate、P1 selected-run 的 suite 范围、触发、阻断 / residual 口径、profile / data family 承接、release report/check 分层和 R9.6 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写最终 gate 表、script/output 最终表、完整 suite-to-case/evidence 映射;evidence / artifact / report schema;验收标准;实施计划或 implementation code。 |

### 2. R9.5 输入承接

| 输入 | 已闭合结论 | R9.5 思考影响 |
|---|---|---|
| Step 4 release gate 边界 | Release gate 只做最小跨入口 smoke、profile assembly、redaction / dependency scan 和 report completeness summary。 | release gate 不替代 unit / service / fake integration / entry 的底层断言。 |
| Step 6 用例闭合 | 83 条 `TC-ML-*` 覆盖 trace/job/recovery、config/dependency/redaction/observability 等横切风险。 | nightly / release 只能按用例族承接,不逐条重写 TC 或新增断言。 |
| Step 7 数据闭合 | 81 个 `DS-ML-*`;`REPLAY` / `UOW` / `JOB` / `REPORT` / `REDACTION` / `OBS` / `MARKER` 数据族已定位。 | nightly 重故障矩阵和 release 检查必须引用已有数据族方向,不得新增 fixture / corpus / fault script。 |
| Step 8 环境矩阵 | `ci-test`、`integration-like`、`operations-replay` 是 P0 自动化候选;`staging-like`、`production-like` 只作 P1/P2 direction。 | nightly / release 主要用 P0 profile;P1 selected-run 不阻断 P0。 |
| R9.2 suite family | `operations-replay-extended`、`fault-injection-matrix`、`report-generation-audit`、`release-main-smoke`、`p1-real-like-selected-run` 已作为候选。 | R9.6 可把这些写入 nightly / release / P1 候选表。 |
| R9.4 PR / main | PR/main 已覆盖 fast 和 P0 主体候选。 | nightly / release 不需要重复宣称 main CI 已证明的底层断言,只补重场景和送验门禁。 |

### 3. nightly gate 边界思考

nightly 的目标是发现较重、较慢、组合型和报告配对类风险。它可以阻断 nightly pass,但不得用来掩盖 PR/main failure,也不得把 nightly 成功当作 release smoke 的替代。

| nightly suite 候选 | 主要发现风险 | profile / data family 承接 | R9.6 写入提醒 |
|---|---|---|---|
| main CI suites | merge 后漂移、main 主体回归。 | `ci-test`;`integration-like`;`operations-replay` 的已定义主体。 | nightly 可以复跑 main suites,但不改变 main failure 裁决。 |
| `operations-replay-extended` | stored replay 缺失、checkpoint resume、partial report、race / retry sample、job no truth repair。 | `operations-replay`;`REPLAY`;`UOW`;`RECOVERY-003~004`;`JOB`;`REPORT`;`TRACE`;`AUDIT`。 | 写为 nightly P0 blocking;release 只消费 selected passing run 或 core subset。 |
| `fault-injection-matrix` | UoW rollback、commit unknown、resolver unavailable、publisher / handoff failed、source missing stop。 | `ci-test`;`integration-like`;`operations-replay`;`RECOVERY`;`DEPENDENCY`;`MARKER`;`PUBLISHER`;`HANDOFF`。 | 只能触发正式 failure / degraded / unavailable 分支,不得用 timeout/log/private flag 作 proof。 |
| `report-generation-audit` | raw artifact 与 human report 缺配对、failed suite 无 failure reason、静态造 evidence。 | run-scoped artifact/report direction;`REPORT`;`EVIDENCE`;`REDACTION` dummy corpus。 | 只写 audit 方向;正式 report/artifact 字段留 Step 13。 |
| `observability-boundary` extended | trace/span/log/report body-free、metric label 低基数、audit refs-only 的输出扫描扩展。 | `OBS`;`METRIC`;`AUDIT`;`DIAGNOSTIC`;`REDACTION`。 | 不定义 backend、metric name、span schema 或 scanner 实现。 |

### 4. release gate 边界思考

release gate 的目标是“送验前的阻断门禁和证据汇总入口”。它必须验证最小跨入口 smoke、P0 profile assembly、redaction、dependency boundary、artifact/report pairing 和 no-static-evidence,但不能新增业务真相或替代底层 suite。

| release gate 组成候选 | 主要职责 | profile / data family 承接 | R9.6 写入提醒 |
|---|---|---|---|
| `release-main-smoke` | 最小跨入口闭环: definition truth / formalization / consumption / query / job report / safe shell direction。 | `ci-test`;必要时 `operations-replay` core subset;`DEF`;`FORMAL`;`CONSUME`;`QUERY`;`JOB`;`REPORT`;`REDACTION`。 | 必须是场景级 smoke,不得只用通用测试计数。 |
| release config redline | strict validation、profile isolation、forbidden configurable boundary、profile pollution。 | `ci-test`;`CONFIG`;`DEPENDENCY`;`REDACTION`;`MARKER`。 | 可复用 `config-redline` family,但 R9.6 只写门禁关系,不写 key/schema。 |
| release dependency boundary | only `core-contracts` compile dependency、runtime/event/replay dependency 不越界。 | local tool direction;run context optional。 | 可复用 `dependency-boundary`,不定义 dependency graph schema。 |
| release redaction boundary | artifact/report/log/diagnostic 不含 raw body、secret、endpoint、provider response。 | `ci-test`;dummy leak corpus;`REDACTION`;`BODY`;`SHELL`;`DIAGNOSTIC`。 | raw leak 必须阻断,不得降级 warning。 |
| release report audit | blocking suite artifact/report 配对、gate summary 可推导、no static evidence。 | `REPORT`;`EVIDENCE`;run-scoped output direction。 | report 必须从 raw artifact 推导;正式 schema 留 Step 13。 |

### 5. P1 selected-run 边界思考

P1 selected-run 的目标是给 future durable / real-like adapter 或 staging-like / production-like direction 留可执行入口。它不是当前 P0 pass 前置,不可用时只能记录 residual / unavailable,不得改写 P0 通过或失败。

| P1 selected-run 主题 | 思考裁决 | profile / data family 承接 | 禁止误用 |
|---|---|---|---|
| `p1-real-like-selected-run` | 只在显式 selected-run 被触发时执行。 | `staging-like` direction;future durable / real-like adapter refs direction。 | 自动进入 PR/main/release P0。 |
| production-like future direction | 当前不执行,只记录 future risk。 | `production-like` direction;no fixture / replay override。 | 用测试 fixture、fake adapter 或 raw secret 证明 production readiness。 |
| unavailable / missing product | 记录 residual / unavailable。 | selected-run report direction。 | 计作 P0 pass,或阻断当前 P0 release gate。 |
| selected-run evidence | 只能生成 selected-run artifact/report direction。 | `reports/runs/<run_id>/suites/p1-real-like-selected-run.md` direction。 | 固定正式 EV、acceptance verdict 或 artifact JSON 字段。 |

### 6. profile 与 data family 承接思考

| gate 层 | profile 承接 | data family 承接 | 不得使用 |
|---|---|---|---|
| nightly | `ci-test`;`integration-like`;`operations-replay`。 | `REPLAY`;`UOW`;`RECOVERY`;`JOB`;`REPORT`;`DEPENDENCY`;`MARKER`;`OBS`;`METRIC`;`REDACTION`。 | production-like、真实 secret、真实 provider response、未去标识 replay body。 |
| release gate | `ci-test`;必要时 `operations-replay` core subset。 | `DEF`;`FORMAL`;`CONSUME`;`QUERY`;`JOB`;`REPORT`;`CONFIG`;`DEPENDENCY`;`REDACTION`;`EVIDENCE`。 | 用 release smoke 生成新 truth source、修复 core truth 或补 marker。 |
| P1 selected-run | `staging-like` / future selected profile direction。 | future selected dataset direction,不消费 P0 fixture 作为 production proof。 | 把 P1 unavailable 计入 P0 pass/fail。 |

### 7. release report/check 分层思考

release gate 需要分清 gate、check、report 三层。gate 负责执行和阻断,check 负责横切审计,report 负责从 artifact 推导 human-readable 输出。

| 层级 | 候选职责 | R9.6 可写 | R9.6 不写 |
|---|---|---|---|
| gate | 运行 release smoke 和调用 release checks;任一 P0 release item failed 即阻断。 | release gate 组成、触发和阻断级别。 | CI YAML、shell 实现、package command。 |
| check | redaction、dependency boundary、artifact/report pairing、no static evidence。 | check family 必须进入 release gate。 | scanner pattern、dependency graph schema、JSON 字段。 |
| report | suite report、gate summary、evidence candidate summary。 | report 由 raw artifact 推导,失败不得伪 pass。 | Step 13 report 模板、EV ID、retention、acceptance verdict。 |

### 8. blocking / residual 级别思考

| 场景 | nightly 裁决 | release 裁决 | P1 selected-run 裁决 |
|---|---|---|---|
| P0 suite failed | nightly failed。 | release blocking failed。 | 不适用。 |
| flaky / timeout | failed,不得改写 pass。 | failed,不得送验。 | unstable / unavailable residual。 |
| required fixture / profile / replay root missing | test fail-fast。 | blocking failed 或 stop-review。 | residual / unavailable,不计 P0。 |
| marker/source/schema missing | stop-review / failed。 | stop-review / blocking failed。 | residual 或 stop-review,不得合成。 |
| redaction failure | blocking failed。 | blocking failed。 | selected-run report 不可接受,但不改变 P0 pass。 |
| report generation failed | report audit failed。 | blocking failed。 | residual。 |

### 9. source gap 与越界风险

| 风险 | R9.5 判断 | 处理 |
|---|---|---|
| nightly 需要新增 fault fixture 或 failure branch | Step 9 不新增 fixture / state / marker source。 | 回 Step 7 或 owning `03/04`。 |
| release smoke 需要新增业务 flow | Step 9 不发明 flow。 | 回 `03` function flow 或 Step 6。 |
| release check 需要 artifact/report JSON 字段 | R9.5 只固定 check family 和输出方向。 | Step 13 闭合 schema。 |
| P1 selected-run 想升级 P0 | 这会改变范围和验收基线。 | 回 Step 2 / Step 8 / 后续 `06/07`。 |
| script 参数或 CI required check 未闭合 | R9.5 不实现脚本。 | R9.7/R9.8 只写方向;实施计划后续闭合。 |

### 10. R9.6 写入边界

R9.6 可以写入:

1. nightly suite 候选表、触发条件、阻断级别和 profile / data family 承接。
2. release gate 组成候选、触发条件、阻断级别和 release report/check 分层。
3. P1 selected-run 候选表、触发条件、residual / unavailable 口径。
4. nightly / release / P1 failure handling 与单 gate stop-review。
5. R9.7 进入门禁。

R9.6 禁止写入:

1. script/output 最终表、CLI 实现、CI YAML、package command 或 required check 绑定。
2. 完整 suite-to-case / suite-to-evidence 映射。
3. evidence ID、artifact JSON schema、case JSON schema、report schema、retention 或 acceptance verdict。
4. 新增 TC、DS、环境、profile、config key、adapter product、marker source、port、mapper、state 或 phase boundary。
5. 修改正式 `05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` 或 implementation code。

### 11. R9.5 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 nightly / release / P1 selected-run gates | pass |
| 是否承接 Step 4/6/7/8 和 R9.2/R9.4 | pass |
| 是否区分 nightly 重场景、release 送验门禁和 P1 residual | pass |
| 是否形成 profile / data family 承接思考 | pass |
| 是否形成 release report/check 分层思考 | pass |
| 是否明确 P1 selected-run 不阻断 P0 | pass |
| 是否未写最终 gate 表、script/output 最终表或 suite-to-case/evidence 映射 | pass |
| 是否未写 evidence schema、验收标准、实施计划或 implementation code | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 9 `R9.6 nightly / release / P1 selected-run gates:再写入`;只允许写入 nightly suite 候选表、release gate 组成候选表、P1 selected-run 候选表、nightly / release / P1 触发条件、profile / data family 承接、failure handling、单 gate stop-review 和 `R9.7 script / run parameter / output direction:先思考` 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写 script/output 最终表、完整 suite-to-case/evidence 映射、evidence schema、验收标准、实施计划或 implementation code。

---

## R9.6 nightly / release / P1 selected-run gates:再写入

### 1. 当前模块写入目标

`R9.6` 将 `R9.5` 的 nightly、release gate 和 P1 selected-run 思考写成候选门禁表。它只覆盖 nightly suite 候选、release gate 组成候选、P1 selected-run 候选、触发条件、profile / data family 承接、failure handling、单 gate stop-review 和 `R9.7` 进入门禁。

当前模块不写 script/output 最终表,不写完整 suite-to-case / suite-to-evidence 映射,不定义 evidence schema、artifact JSON schema、report schema、CI YAML、required check、实现仓测试函数名、验收标准、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R9.7 |
| 用户确认 | 已确认从 `R9.5` 推进到 `R9.6`。 |
| 当前允许 | 写 nightly suite 候选表、release gate 组成候选表、P1 selected-run 候选表、触发条件、profile / data family 承接、failure handling、单 gate stop-review 和 R9.7 进入门禁。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写 script/output 最终表;写完整 suite-to-case/evidence 映射;evidence / artifact / report schema;验收标准;实施计划或 implementation code。 |

### 2. nightly suite 候选表

nightly gate 承接较重、较慢、组合型和报告配对类风险。它可以阻断 nightly pass,但不得替代 PR / main CI 的阻断裁决,也不得替代 release gate 的送验前 smoke。

| Suite / gate item | 覆盖范围候选 | 执行位置 | 触发条件候选 | 阻断级别 | profile / data family 承接 |
|---|---|---|---|---|---|
| main CI suites replay | main CI 已定义的 P0 自动化主体回归。 | nightly | scheduled nightly;main branch validation after merge window。 | P0 nightly blocking | `ci-test`;`integration-like`;`operations-replay`;复用 main suite 数据族。 |
| `operations-replay-extended` | stored replay missing、checkpoint resume、partial report、race / retry sample、job no truth repair。 | nightly | replay/job/recovery/report/checkpoint 相关变更或 scheduled nightly。 | P0 nightly blocking | `operations-replay`;`REPLAY`;`UOW`;`RECOVERY-003~004`;`JOB`;`REPORT`;`TRACE`;`AUDIT`。 |
| `fault-injection-matrix` | UoW rollback、commit unknown、resolver unavailable、publisher / handoff failed、source missing stop。 | nightly | persistence/UoW/adapter seam/recovery/marker-source 相关变更或 scheduled nightly。 | P0 nightly blocking | `ci-test`;`integration-like`;`operations-replay`;`RECOVERY`;`DEPENDENCY`;`MARKER`;`PUBLISHER`;`HANDOFF`。 |
| `report-generation-audit` | raw artifact 与 human report 配对、failed suite failure reason、no static evidence。 | nightly | report generation、artifact layout direction、evidence candidate 相关变更或 scheduled nightly。 | P0 nightly blocking | run-scoped artifact/report direction;`REPORT`;`EVIDENCE`;`REDACTION` dummy corpus。 |
| `observability-boundary` extended | trace/span/log/report body-free、metric label 低基数、audit refs-only 扩展输出扫描。 | nightly | observability、diagnostic、metric、trace/audit/report 相关变更或 scheduled nightly。 | P0 nightly blocking | `OBS`;`METRIC`;`AUDIT`;`DIAGNOSTIC`;`REDACTION`。 |

### 3. release gate 组成候选表

release gate 是送验前阻断门禁和证据汇总入口。它只证明最小跨入口 smoke、profile assembly、redaction、dependency boundary、artifact/report pairing 和 no-static-evidence,不替代底层 unit / service / fake integration / entry suite。

| Release item | 覆盖范围候选 | 执行位置 | 触发条件候选 | 阻断级别 | profile / data family 承接 |
|---|---|---|---|---|---|
| `release-main-smoke` | 最小跨入口闭环: definition truth、formalization、controlled consumption、query safe shell、job report / no truth repair。 | release gate | release candidate;送验前。 | P0 release blocking | `ci-test`;必要时 `operations-replay` core subset;`DEF`;`FORMAL`;`CONSUME`;`QUERY`;`JOB`;`REPORT`;`REDACTION`。 |
| release config redline | strict validation、profile isolation、forbidden configurable boundary、profile pollution。 | release gate | release candidate;config/profile/runtime builder changed。 | P0 release blocking | `ci-test`;`CONFIG`;`DEPENDENCY`;`REDACTION`;`MARKER`。 |
| release dependency boundary | only `core-contracts` compile dependency、runtime/event/replay dependency 不越界。 | release gate | release candidate;dependency metadata/workspace layout changed。 | P0 release blocking | local tool direction;run context optional;不需要业务 DS。 |
| release redaction boundary | artifact/report/log/diagnostic 不含 raw body、secret、endpoint、provider response。 | release gate | release candidate;redaction/report/diagnostic/adapter output changed。 | P0 release blocking | `ci-test`;dummy leak corpus;`REDACTION`;`BODY`;`SHELL`;`DIAGNOSTIC`。 |
| release report audit | blocking suite artifact/report 配对、gate summary 可推导、no static evidence。 | release gate | release candidate;report/evidence candidate changed。 | P0 release blocking | `REPORT`;`EVIDENCE`;run-scoped output direction。 |

### 4. P1 selected-run 候选表

P1 selected-run 给 future durable / real-like adapter 或 staging-like direction 留显式执行入口。它不是当前 P0 pass 前置,不可用时只能记录 residual / unavailable。

| Selected-run item | 覆盖范围候选 | 执行位置 | 触发条件候选 | 阻断 / residual 级别 | profile / data family 承接 |
|---|---|---|---|---|---|
| `p1-real-like-selected-run` | future durable / real-like adapter smoke 或 dry-run。 | explicit P1 selected-run | operator / CI 明确选择 selected-run;future profile ready。 | non-P0 residual;unavailable 记录 residual。 | `staging-like` direction;future durable / real-like adapter refs direction。 |
| production-like future direction | future approved product / secret provider / operations profile direction。 | future P2 / operations direction | future production-like baseline 明确后。 | 当前不执行;future risk。 | `production-like` direction;no fixture / replay override。 |
| selected-run unavailable record | selected-run 环境、产品、secret provider 或 adapter refs 不可用。 | explicit P1 selected-run | selected-run 被请求但依赖不可用。 | residual / unavailable;不计 P0 pass。 | selected-run report direction;不得生成 P0 evidence。 |

### 5. nightly / release / P1 触发条件表

| 触发类型 | nightly 候选 | release gate 候选 | P1 selected-run 候选 |
|---|---|---|---|
| replay / job / checkpoint / report change | `operations-replay-extended`;`report-generation-audit`。 | `release-main-smoke` + release report audit core subset。 | 不默认触发。 |
| persistence / UoW / recovery / marker source change | `fault-injection-matrix`。 | release config redline if config boundary affected;release smoke if job/replay affected。 | 不默认触发。 |
| config / profile / runtime builder change | main CI suites replay + selected config nightlies。 | release config redline。 | only if selected profile explicitly requested。 |
| redaction / diagnostic / output change | `observability-boundary` extended;`report-generation-audit`。 | release redaction boundary + release report audit。 | selected-run report acceptance direction only。 |
| dependency metadata / workspace change | main CI dependency replay direction。 | release dependency boundary。 | selected-run dependency residual direction。 |
| release candidate | 可 consume latest scheduled run direction,但不得引用 `latest` as evidence。 | all release items。 | only explicit opt-in。 |
| staging-like / real-like selected request | 不进入 nightly P0。 | 不进入 P0 release gate。 | `p1-real-like-selected-run`。 |

### 6. profile 与 data family 承接表

| Gate / item | profile 承接 | data family 承接 | 不得使用 |
|---|---|---|---|
| `operations-replay-extended` | `operations-replay`;必要时 `ci-test` UoW deterministic subset。 | `REPLAY`;`UOW`;`RECOVERY-003~004`;`JOB`;`REPORT`;`TRACE`;`AUDIT`。 | raw replay body、provider response、truth repair worker。 |
| `fault-injection-matrix` | `ci-test`;`integration-like`;`operations-replay`。 | `RECOVERY`;`DEPENDENCY`;`MARKER`;`PUBLISHER`;`HANDOFF`;`UOW`。 | timeout/log/private flag 作为正式 marker 或 recovery proof。 |
| `report-generation-audit` | `ci-test`;run-scoped report direction。 | `REPORT`;`EVIDENCE`;`REDACTION`;`RUN`。 | 静态 JSON / 手写 report 直接宣告通过。 |
| `release-main-smoke` | `ci-test`;必要时 `operations-replay` core subset。 | `DEF`;`FORMAL`;`CONSUME`;`QUERY`;`JOB`;`REPORT`;`SHELL`;`REDACTION`。 | 用 release smoke 补 domain/service 断言或生成新 truth source。 |
| release checks | `ci-test`;local tool direction。 | `CONFIG`;`DEPENDENCY`;`REDACTION`;`BODY`;`DIAGNOSTIC`;`REPORT`;`EVIDENCE`。 | 新 config key、dependency graph schema、scanner schema、artifact schema。 |
| `p1-real-like-selected-run` | `staging-like` direction;future selected profile。 | future selected dataset direction。 | P0 fixture、fake adapter、raw secret、production proof。 |

### 7. nightly / release / P1 failure handling

| 失败类型 | nightly 裁决 | release gate 裁决 | P1 selected-run 裁决 |
|---|---|---|---|
| suite / gate item failed | nightly failed。 | release blocking failed。 | selected-run failed residual;不改变 P0 pass。 |
| flaky | failed。 | failed,不得送验。 | unstable residual。 |
| timeout | failed。 | failed,不得送验。 | timeout / unavailable residual。 |
| required fixture / profile / replay root missing | test fail-fast。 | blocking failed 或 stop-review。 | unavailable residual;不计 P0。 |
| marker/source/schema missing | stop-review / failed。 | stop-review / blocking failed。 | stop-review 或 residual;不得合成 marker。 |
| redaction failure | blocking failed。 | blocking failed。 | selected-run report 不可接受,但不改变 P0 pass。 |
| dependency boundary failure | blocking failed。 | blocking failed。 | selected-run dependency residual,不改变 P0 pass。 |
| report generation failed | report audit failed。 | blocking failed。 | residual。 |

### 8. nightly / release / P1 单 gate stop-review

| Gate / Suite | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| nightly gate | 是否覆盖重 replay、fault injection、report audit 和 observability extended | pass | 已定位 `operations-replay-extended`、`fault-injection-matrix`、`report-generation-audit`、observability extended。 |
| nightly gate | 是否未替代 PR / main failure 裁决 | pass | nightly 可复跑 main suites,但 main failure 仍由 main CI 阻断。 |
| release gate | 是否包含最小 smoke、config、dependency、redaction 和 report audit | pass | release gate 候选已覆盖送验前阻断门禁。 |
| release gate | 是否未用通用测试计数替代场景级 smoke | pass | `release-main-smoke` 保持场景级闭环方向。 |
| release report/check | 是否区分 gate、check、report | pass | R9.6 只写分层职责,具体脚本/output 最终表留 R9.7/R9.8。 |
| P1 selected-run | 是否未写成 P0 pass 前置 | pass | unavailable / missing product 只记 residual。 |
| profile / data | 是否未新增 profile、DS、fixture、fault script | pass | 只承接 Step 7/8 已闭合 family。 |
| evidence / schema | 是否未定义正式 EV、artifact/report JSON schema 或 acceptance verdict | pass | 相关内容留 Step 13 / 后续 `06`。 |

### 9. R9.7 进入门禁

| 门禁项 | 裁决 |
|---|---|
| R9.6 是否只写 nightly / release / P1 gate 候选与门禁 | pass |
| nightly 是否定位为重场景 / 回归 / 审计而非 main 替代 | pass |
| release 是否定位为送验前阻断和报告审计入口 | pass |
| P1 selected-run 是否保持 non-P0 residual | pass |
| 是否有 profile / data family 承接 | pass |
| 是否有 failure handling 和单 gate stop-review | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写 script/output 最终表、完整 suite-to-case/evidence 映射或 evidence schema | pass |

进入 `R9.7 script / run parameter / output direction:先思考` 时,只允许思考 gate / report / check 脚本家族、run 参数、artifact/report 输出方向、failure handling 和 `R9.8 script / run parameter / output direction:再写入` 边界;不得直接修改正式 `05-测试方案.md`;不得写完整 suite-to-case/evidence 映射、evidence schema、验收标准、实施计划或 implementation code。

### 10. R9.6 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 nightly suite 候选表 | pass |
| 是否写入 release gate 组成候选表 | pass |
| 是否写入 P1 selected-run 候选表 | pass |
| 是否写入 nightly / release / P1 触发条件表 | pass |
| 是否写入 profile 与 data family 承接表 | pass |
| 是否写入 failure handling 与单 gate stop-review | pass |
| 是否形成 R9.7 进入门禁 | pass |
| 是否未写 script/output 最终表、完整 suite-to-case/evidence 映射、evidence schema、验收或实施内容 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 9 `R9.7 script / run parameter / output direction:先思考`;只允许思考 gate / report / check 脚本家族、run 参数、artifact/report 输出方向、failure handling 和 `R9.8 script / run parameter / output direction:再写入` 边界;不得直接修改正式 `05-测试方案.md`;不得写完整 suite-to-case/evidence 映射、evidence schema、验收标准、实施计划或 implementation code。

---

## R9.7 script / run parameter / output direction:先思考

### 1. 当前模块目标

`R9.7` 只思考 gate / report / check 脚本家族、run 参数、artifact/report 输出方向、failure handling 和 `R9.8` 写入边界。

当前模块不写最终脚本表、最终参数表、最终输出映射表,不写完整 suite-to-case / suite-to-evidence 映射,不定义 evidence schema、artifact JSON schema、report schema、CI YAML、required check、实现仓测试函数名、验收标准、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R9.8 |
| 用户确认 | 已确认从 `R9.6` 推进到 `R9.7`。 |
| 当前允许 | 思考 gate / report / check 脚本家族、run 参数、artifact/report 输出方向、failure handling 和 R9.8 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写最终脚本表 / 参数表 / 输出映射表;写完整 suite-to-case/evidence 映射;evidence / artifact / report schema;验收标准;实施计划或 implementation code。 |

### 2. R9.7 输入承接

| 输入 | 已闭合结论 | R9.7 思考影响 |
|---|---|---|
| SOP Step 9 | gate script 必须在 `scripts/gates/`,report script 必须在 `scripts/reports/`,check script 必须在 `scripts/checks/`;artifact root 必须是 `artifacts/test/<run_id>`;report root 必须是 `reports/runs/<run_id>`。 | R9.8 需要写脚本家族、参数和输出方向表,但仍不实现脚本或定义 JSON schema。 |
| 书写规范 §5.9 | 正式 §9 需要 suite、执行位置、触发、阻断、执行脚本、artifact 输出和 report 输出。 | R9.8 可以把已确认 suite family 绑定到脚本家族和输出方向。 |
| R9.2 脚本候选 | 已列 gate/report/check family 候选。 | R9.7 检查这些候选是否足够覆盖 PR/main/nightly/release/P1。 |
| R9.4 PR / main | PR/main suites 已固定候选和输出方向。 | R9.8 脚本参数必须支持 PR/main gate 和 suite selector。 |
| R9.6 nightly / release / P1 | nightly / release / P1 gate item 已固定候选和 residual 口径。 | R9.8 脚本参数必须支持 release report/check 和 P1 selected-run residual。 |
| Step 13 后移 | artifact/report/case JSON 字段、EV、retention、review status 未闭合。 | R9.7/R9.8 只写 path direction 和 pairing rule,不写 schema。 |

### 3. gate 脚本家族思考

gate script 负责执行 suite / gate item 并产出 raw artifact direction。它不负责发明测试数据、修复 truth、生成正式 EV 或覆盖 report failure。

| Gate family | 主要职责 | 需要支持的 gate 层 | R9.8 写入提醒 |
|---|---|---|---|
| `scripts/gates/run_ci_gate.sh` | PR / main / nightly 的 suite 执行入口,支持 gate selector 和 suite selector。 | PR、main CI、nightly。 | 写入输入参数、输出方向和失败处理,不写 shell 实现或 package command。 |
| `scripts/gates/run_release_gate.sh` | release candidate 送验前门禁入口,调用 release smoke、config/dependency/redaction/report audit。 | release gate。 | 必须接受 run/report root direction,任一 P0 release item failed 阻断。 |
| `scripts/gates/run_selected_p1_gate.sh` | P1 selected-run 显式入口,记录 selected-run success/fail/unavailable residual。 | P1 selected-run。 | 不得影响 P0 pass;unavailable 必须写 residual direction。 |

### 4. report 脚本家族思考

report script 负责从 raw artifact direction 推导 human report direction。它不得用手写 summary 覆盖 failed suite,也不得从静态 JSON 直接宣告 evidence pass。

| Report family | 主要职责 | 输入方向 | 输出方向 | R9.8 写入提醒 |
|---|---|---|---|---|
| `scripts/reports/generate_reports.sh` | 从 suite raw artifact 生成 suite human reports 和 run summary direction。 | `--run-id`;`--artifact-root`;`--report-root` direction。 | `reports/runs/<run_id>` direction。 | artifact 缺失或不可解析时 failed。 |
| `scripts/reports/build_gate_summary.sh` | 汇总 blocking / non-blocking / residual gate item。 | run-scoped reports / artifacts direction。 | gate summary direction。 | 不得覆盖 failed suite 为 passed。 |
| `scripts/reports/build_evidence_candidates.sh` | 生成 evidence candidate summary direction。 | suite artifact/report direction。 | evidence candidate summary direction。 | 只生成 candidate,正式 EV / schema 留 Step 13。 |

### 5. check 脚本家族思考

check script 负责横切审计,尤其 release gate 需要的 redaction、dependency、artifact/report pairing 和 no static evidence。check 输出是审计报告方向,不是正式 evidence schema。

| Check family | 主要职责 | 进入 gate | R9.8 写入提醒 |
|---|---|---|---|
| `scripts/checks/check_redaction.sh` | 扫描 artifact/report/log/diagnostic direction 中的 raw body、secret、endpoint、provider response。 | main / nightly / release。 | raw leak 阻断;不定义 scanner pattern 或 deny-list schema。 |
| `scripts/checks/check_dependency_boundary.sh` | 审计 only `core-contracts` compile dependency 和 runtime/event/replay boundary。 | PR / main / release。 | 不定义 manifest path 或 graph schema。 |
| `scripts/checks/check_artifact_report_pairing.sh` | 检查 blocking suite 是否同时有 raw artifact direction 和 human report direction。 | nightly / release。 | 缺配对阻断;schema 留 Step 13。 |
| `scripts/checks/check_no_static_evidence.sh` | 防止静态 JSON / 手写 report 直接宣告 pass。 | nightly / release。 | 命中即阻断;正式 EV 仍未定义。 |

### 6. run 参数思考

R9.7 只思考参数语义和禁止范围,不定义 CLI parser、默认值生成算法或 CI YAML。

| 参数 | 必要性 | 语义方向 | 禁止 |
|---|---|---|---|
| `--run-id` | 必需。 | 绑定一次 gate / suite 执行和后续 report 生成。 | 使用 `latest`;跨 run 复用;由 report script 随机改写。 |
| `--artifact-root` | 必需或可由 `run-id` 派生。 | 默认方向 `artifacts/test/<run_id>`。 | `artifacts/test/<project>/<run_id>`;无 run scope。 |
| `--report-root` | release/report 阶段必需。 | 默认方向 `reports/runs/<run_id>`。 | `reports/<project>`;手写 summary 覆盖 raw artifact。 |
| `--config-profile` | 必需。 | 只能来自 Step 8 / `04` 已确认 profile。 | 新增 profile、用 profile 改变 truth owner / marker source。 |
| `--gate` | gate execution 需要。 | `pr` / `main` / `nightly` / `release` / `p1-selected` direction。 | 把 P1 selected-run 当 P0 gate。 |
| `--suite` | suite 选择需要。 | 选择已确认 suite family / gate item。 | 选择不存在 suite、动态生成 suite 名。 |

### 7. artifact/report 输出方向思考

Step 9 需要固定输出方向和配对规则,但不能定义 JSON 字段、case file schema、report 模板或 retention。

| 输出方向 | 用途 | R9.8 可写 | R9.8 不写 |
|---|---|---|---|
| `artifacts/test/<run_id>` | 当前 run 的 raw artifact root direction。 | root direction、run-scoped、不得 `latest`。 | JSON schema、digest 字段、case result schema。 |
| `artifacts/test/<run_id>/suites/<suite>/` | suite raw artifact direction。 | suite 与 artifact 方向配对。 | `report.json` required keys、stdout/stderr 内容格式。 |
| `reports/runs/<run_id>` | 当前 run 的 human report root direction。 | report root direction、由 raw artifact 推导。 | report 模板、review status、acceptance verdict。 |
| `reports/runs/<run_id>/suites/<suite>.md` | suite human report direction。 | suite report pairing direction。 | markdown 章节模板或证据字段。 |
| gate summary direction | gate 汇总报告方向。 | `reports/runs/<run_id>/gate-summary.md` candidate direction。 | release verdict / acceptance report。 |
| evidence candidate direction | evidence candidate summary direction。 | candidate 输出方向。 | 正式 EV ID、EV schema、retention。 |

### 8. failure handling 思考

R9.7 需要把 failure handling 绑定到脚本职责和输出方向,但不定义 artifact 字段和值域。

| 失败类型 | gate script 思考 | report/check script 思考 | R9.8 写入提醒 |
|---|---|---|---|
| suite failed | gate 非 0 或 failed status direction;保留 safe failure reason direction。 | report 不得改写 pass。 | P0 blocking gate failed。 |
| flaky | 视为 failed。 | 可记录 unstable direction,不得 pass。 | 不定义 retry 算法。 |
| timeout | 视为 failed。 | 保留 timeout failure direction。 | 不从 timeout 推断业务 unavailable。 |
| required fixture/profile missing | test fail-fast。 | report 生成 failure direction。 | 不 skip 后计 pass。 |
| marker/source/schema missing | stop-review / failed。 | report/check 只记录 gap,不补 marker。 | 不用 fake/private map/raw error 补口。 |
| redaction failure | blocking failed。 | redaction check report direction。 | raw leak 不降级 warning。 |
| dependency boundary failure | blocking failed。 | dependency report direction。 | 非 core sibling compile dependency 不允许。 |
| report generation failed | release/report audit blocking。 | report script non-pass direction。 | 不用静态 report 补齐。 |

### 9. R9.8 写入边界

R9.8 可以写入:

1. gate / report / check 脚本家族表。
2. run 参数表和参数禁止范围。
3. artifact/report 输出方向表和配对规则。
4. failure handling 表。
5. script / output stop-review 和 `R9.9 suite-to-cut / candidate evidence mapping:先思考` 进入门禁。

R9.8 禁止写入:

1. 完整 suite-to-case / suite-to-evidence 映射。
2. evidence ID、artifact JSON schema、case JSON schema、report schema、retention、review status 或 acceptance verdict。
3. CI YAML、脚本实现、package command、required check 绑定或实现仓测试函数名。
4. 新增 TC、DS、环境、profile、config key、adapter product、marker source、port、mapper、state 或 phase boundary。
5. 修改正式 `05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` 或 implementation code。

### 10. R9.7 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 script / run parameter / output direction | pass |
| 是否承接 SOP Step 9 和书写规范 §5.9 | pass |
| 是否区分 gate / report / check 三类脚本职责 | pass |
| 是否形成 run 参数和禁止范围思考 | pass |
| 是否形成 artifact/report 输出方向和配对规则思考 | pass |
| 是否形成 failure handling 思考 | pass |
| 是否未写最终脚本表、参数表、输出映射表 | pass |
| 是否未写 suite-to-case/evidence 映射、evidence schema、验收或实施内容 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 9 `R9.8 script / run parameter / output direction:再写入`;只允许写入 gate / report / check 脚本家族表、run 参数表、artifact/report 输出方向表、failure handling 表、script / output stop-review 和 `R9.9 suite-to-cut / candidate evidence mapping:先思考` 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写完整 suite-to-case/evidence 映射、evidence schema、验收标准、实施计划或 implementation code。

---

## R9.8 script / run parameter / output direction:再写入

### 1. 当前模块写入目标

`R9.8` 将 `R9.7` 的脚本家族、run 参数、artifact/report 输出方向和 failure handling 思考写成候选表。它只覆盖 gate / report / check 脚本家族表、run 参数表、artifact/report 输出方向表、failure handling 表、script / output stop-review 和 `R9.9` 进入门禁。

当前模块不写完整 suite-to-case / suite-to-evidence 映射,不定义 evidence schema、artifact JSON schema、case JSON schema、report schema、CI YAML、required check、实现仓测试函数名、验收标准、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R9.9 |
| 用户确认 | 已确认从 `R9.7` 推进到 `R9.8`。 |
| 当前允许 | 写 gate / report / check 脚本家族表、run 参数表、artifact/report 输出方向表、failure handling 表、script / output stop-review 和 R9.9 进入门禁。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写完整 suite-to-case/evidence 映射;evidence / artifact / report schema;CI YAML;required check;验收标准;实施计划或 implementation code。 |

### 2. gate / report / check 脚本家族表

| 脚本家族 | 类型 | 输入边界候选 | 输出方向候选 | 失败处理候选 |
|---|---|---|---|---|
| `scripts/gates/run_ci_gate.sh` | gate | `--gate`;`--suite`;`--run-id`;`--artifact-root`;`--config-profile` direction。 | suite raw artifact direction;stdout/stderr safe capture direction。 | 非 0 / failed status 阻断;failed suite 仍保留 safe failure reason direction。 |
| `scripts/gates/run_release_gate.sh` | gate | `--run-id`;`--artifact-root`;`--report-root`;`--config-profile`;release item selector direction。 | release suite artifact direction;release gate summary input direction。 | 任一 P0 release item failed 即阻断送验。 |
| `scripts/gates/run_selected_p1_gate.sh` | gate | `--run-id`;`--artifact-root`;`--report-root`;`--config-profile`;selected dependency refs direction。 | selected-run artifact direction;selected-run residual report direction。 | 不阻断 P0;unavailable / missing product 记录 residual。 |
| `scripts/reports/generate_reports.sh` | report | `--run-id`;`--artifact-root`;`--report-root` direction。 | suite human reports and run summary direction。 | artifact 缺失、不可解析或报告生成失败则 failed。 |
| `scripts/reports/build_gate_summary.sh` | report | run-scoped artifact/report direction。 | `reports/runs/<run_id>/gate-summary.md` direction。 | 不得覆盖 failed suite 或 failed gate item 为 passed。 |
| `scripts/reports/build_evidence_candidates.sh` | report | suite artifact/report direction。 | evidence candidate summary direction。 | 只生成 candidate;正式 EV / schema 留 Step 13。 |
| `scripts/checks/check_redaction.sh` | check | artifact/report/log/diagnostic direction;safe deny-list ref direction optional。 | redaction check report direction。 | raw body、secret、endpoint、provider response 或 unsafe full ref 命中即阻断。 |
| `scripts/checks/check_dependency_boundary.sh` | check | dependency metadata / generated graph direction;artifact-root direction。 | dependency boundary report direction。 | 非 `core-contracts` sibling compile dependency 命中即阻断。 |
| `scripts/checks/check_artifact_report_pairing.sh` | check | artifact root and report root direction。 | pairing audit report direction。 | 任一 blocking suite 缺 raw artifact 或 human report direction 即阻断。 |
| `scripts/checks/check_no_static_evidence.sh` | check | reports and evidence candidate direction。 | static evidence guard report direction。 | 静态 JSON / 手写 report 直接宣告 pass 即阻断。 |

### 3. run 参数表

| 参数 | 适用脚本 | 必要性 | 语义方向 | 禁止 |
|---|---|---|---|---|
| `--run-id` | all gate/report/check families | 必需。 | 绑定一次 gate / suite 执行和后续 report 生成。 | 使用 `latest`;跨 run 复用;report script 随机改写。 |
| `--artifact-root` | gate/report/check families | 必需或可由 `run-id` 派生。 | 默认方向 `artifacts/test/<run_id>`。 | `artifacts/test/<project>/<run_id>`;无 run scope。 |
| `--report-root` | release/report/check families | release/report 阶段必需。 | 默认方向 `reports/runs/<run_id>`。 | `reports/<project>`;手写 summary 覆盖 raw artifact。 |
| `--config-profile` | gate families | 必需。 | 只能来自 Step 8 / `04` 已确认 profile。 | 新增 profile;用 profile 改变 truth owner、state transition、marker source 或 schema。 |
| `--gate` | `run_ci_gate.sh` | PR/main/nightly 必需。 | `pr` / `main` / `nightly` direction。 | 把 P1 selected-run 当 P0 gate;动态生成 gate 名。 |
| `--suite` | gate families | suite/item selector。 | 选择已确认 suite family / release item / selected-run item。 | 选择不存在 suite;运行时生成新 suite 名。 |
| selected dependency refs direction | `run_selected_p1_gate.sh` | P1 selected-run 需要。 | 指向 future selected-run dependency refs。 | 作为 P0 required dependency 或 P0 evidence source。 |

### 4. artifact/report 输出方向表

| 输出方向 | 用途 | 来源 | 要求 |
|---|---|---|---|
| `artifacts/test/<run_id>` | 当前 run 的 raw artifact root direction。 | gate / suite / check execution。 | 必须 run-scoped;不得引用 `latest`;不得使用 `artifacts/test/<project>/<run_id>`。 |
| `artifacts/test/<run_id>/suites/<suite>/` | suite raw artifact direction。 | gate / suite execution。 | blocking suite 必须存在可配对 raw artifact direction;具体 JSON 字段留 Step 13。 |
| `artifacts/test/<run_id>/suites/<suite>/cases/` direction | case result direction。 | automated case runner direction。 | 只保留方向;case JSON schema、required keys 和 assertion item schema 留 Step 13。 |
| `reports/runs/<run_id>` | 当前 run 的 human report root direction。 | report scripts。 | 必须从 raw artifact 推导;不得手写 summary 覆盖 raw artifact。 |
| `reports/runs/<run_id>/suites/<suite>.md` | suite human report direction。 | `generate_reports.sh` direction。 | blocking suite 必须与 suite artifact direction 配对。 |
| `reports/runs/<run_id>/gate-summary.md` | gate summary direction。 | `build_gate_summary.sh` direction。 | 汇总 blocking/non-blocking/residual;不得伪 pass。 |
| `reports/runs/<run_id>/evidence-candidates.md` direction | evidence candidate summary direction。 | `build_evidence_candidates.sh` direction。 | 只生成 candidate;正式 EV ID / schema / retention 留 Step 13。 |
| `reports/runs/<run_id>/redaction-check.md` direction | redaction check report direction。 | `check_redaction.sh` direction。 | raw leak 命中必须阻断;不得回显 secret/body。 |
| `reports/runs/<run_id>/dependency-boundary.md` direction | dependency boundary report direction。 | `check_dependency_boundary.sh` direction。 | 证明 only `core-contracts` compile dependency direction;graph schema 留后续。 |
| `reports/runs/<run_id>/report-audit.md` direction | artifact/report pairing and no-static-evidence audit direction。 | pairing/static-evidence checks。 | release gate 必读 direction;正式 acceptance report 留后续。 |

### 5. artifact/report 配对规则

| 规则 | 裁决 |
|---|---|
| 每个 blocking suite 必须有 raw artifact direction 和 human report direction。 | missing 即 failed / stop-review。 |
| human report 必须由 raw artifact 推导。 | 手写 summary 不能宣告 pass。 |
| failed / timeout / flaky suite 也必须保留 safe failure reason direction。 | 不允许删除 failed artifact 后重跑伪 pass。 |
| release gate 必须检查 artifact/report pairing。 | `check_artifact_report_pairing.sh` family 进入 release。 |
| evidence candidate 只能从 suite artifact/report direction 推导。 | 不得用静态 JSON 直接宣告 EV/VETO pass。 |
| Step 9 不定义 artifact/report JSON 字段。 | 具体 schema 留 Step 13。 |

### 6. failure handling 表

| 失败类型 | gate 处理 | report/check 处理 | 阻断口径 |
|---|---|---|---|
| suite failed | gate failed;保留 safe failure reason direction。 | report 不得改写 pass。 | P0 blocking gate failed。 |
| flaky | failed。 | 可记录 unstable direction,不得 pass。 | P0 blocking failed。 |
| timeout | failed。 | 记录 timeout failure direction。 | P0 blocking failed;不从 timeout 推断业务 unavailable。 |
| required fixture / profile missing | test fail-fast。 | 生成 failure direction 或 stop-review direction。 | P0 blocking failed。 |
| replay root missing / not de-identified | replay job rejected / test fail-fast。 | report 记录 replay input gap direction。 | operations-replay P0 blocking failed。 |
| marker/source/schema missing | stop-review / failed。 | report/check 只记录 gap,不补 marker。 | P0 blocking failed 或 design blocker。 |
| redaction failure | blocking failed。 | redaction report direction。 | raw leak 不降级 warning。 |
| dependency boundary failure | blocking failed。 | dependency report direction。 | 非 `core-contracts` sibling compile dependency 不允许。 |
| report generation failed | gate/report audit failed。 | report script non-pass direction。 | release/report audit blocking failed。 |
| P1 selected-run unavailable | selected-run unavailable residual。 | selected-run residual report direction。 | 不计 P0 pass;不阻断 P0。 |

### 7. script / output stop-review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| gate/report/check 是否三类职责清楚 | pass | gate 执行 suite;report 推导 human report;check 做横切审计。 |
| 脚本目录是否符合 SOP | pass | gate under `scripts/gates/`;report under `scripts/reports/`;check under `scripts/checks/`。 |
| run 参数是否支持 run-scoped 输出 | pass | `--run-id`、`--artifact-root`、`--report-root` direction 已写。 |
| artifact root 是否符合规范 | pass | 使用 `artifacts/test/<run_id>` direction。 |
| report root 是否符合规范 | pass | 使用 `reports/runs/<run_id>` direction。 |
| 是否禁止 `latest` | pass | 所有正式门禁不得引用 `latest`。 |
| artifact/report 是否有配对规则 | pass | blocking suite 缺配对即 failed / stop-review。 |
| 是否未定义 JSON schema / EV / acceptance verdict | pass | schema 和正式 evidence 留 Step 13 / 后续 `06`。 |
| 是否未写 CI YAML / 脚本实现 / required check | pass | 当前只写设计方向。 |

### 8. R9.9 进入门禁

| 门禁项 | 裁决 |
|---|---|
| R9.8 是否只写脚本家族、run 参数、输出方向和 failure handling | pass |
| gate/report/check 职责是否分清 | pass |
| artifact/report 输出是否 run-scoped | pass |
| blocking suite 是否有 pairing 规则 | pass |
| failure handling 是否阻断清楚 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写完整 suite-to-case/evidence 映射或 evidence schema | pass |

进入 `R9.9 suite-to-cut / candidate evidence mapping:先思考` 时,只允许思考 suite 到测试切口 / 用例族 / evidence candidate 的映射边界、P0 自动化覆盖缺口风险、重复覆盖和 `R9.10 suite-to-cut / candidate evidence mapping:再写入` 边界;不得直接修改正式 `05-测试方案.md`;不得定义正式 evidence schema、artifact/report JSON 字段、验收标准、实施计划或 implementation code。

### 9. R9.8 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 gate / report / check 脚本家族表 | pass |
| 是否写入 run 参数表 | pass |
| 是否写入 artifact/report 输出方向表 | pass |
| 是否写入 artifact/report 配对规则 | pass |
| 是否写入 failure handling 表 | pass |
| 是否形成 script / output stop-review 和 R9.9 进入门禁 | pass |
| 是否未写完整 suite-to-case/evidence 映射、evidence schema、验收或实施内容 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 9 `R9.9 suite-to-cut / candidate evidence mapping:先思考`;只允许思考 suite 到测试切口 / 用例族 / evidence candidate 的映射边界、P0 自动化覆盖缺口风险、重复覆盖和 `R9.10 suite-to-cut / candidate evidence mapping:再写入` 边界;不得直接修改正式 `05-测试方案.md`;不得定义正式 evidence schema、artifact/report JSON 字段、验收标准、实施计划或 implementation code。

---

## R9.9 suite-to-cut / candidate evidence mapping:先思考

### 1. 当前模块目标

`R9.9` 只思考 suite 到测试切口 / 用例族 / evidence candidate 的映射边界、P0 自动化覆盖缺口风险、重复覆盖和 `R9.10` 写入边界。

当前模块不写最终 suite-to-case / suite-to-evidence 映射表,不定义正式 evidence ID、artifact JSON schema、case JSON schema、report schema、验收标准、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R9.10 |
| 用户确认 | 已确认从 `R9.8` 推进到 `R9.9`。 |
| 当前允许 | 思考 suite 到测试切口 / 用例族 / evidence candidate 的映射边界、P0 自动化覆盖缺口风险、重复覆盖和 R9.10 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写最终 suite-to-case/evidence 映射;定义 evidence / artifact / report schema;验收标准;实施计划或 implementation code。 |

### 2. R9.9 输入承接

| 输入 | 已闭合结论 | R9.9 思考影响 |
|---|---|---|
| Step 5 覆盖矩阵 | P0 FR-ML / BR-ML / NFR-ML 未发现覆盖空洞;evidence 只保留 candidate / family。 | R9.10 只映射 suite 到用例族和候选证据族,不新增覆盖项。 |
| Step 6 用例矩阵 | 83 条唯一 `TC-ML-*`;按五批和多个 ID family 收口。 | R9.10 可按 TC family / range 映射,不逐行定义正式 EV。 |
| Step 7 数据矩阵 | 81 个唯一 `DS-ML-*`;83 条 TC 均有数据前置。 | suite mapping 可引用 DS family,不新增数据集。 |
| Step 8 环境矩阵 | P0 profile 和 P1/P2 residual 已隔离。 | suite mapping 必须遵守 PR/main/nightly/release/P1 的 profile 边界。 |
| R9.4/R9.6 suite tables | PR/main/nightly/release/P1 suite 候选已写。 | R9.10 可把 suite family 连接到测试切口和 TC family。 |
| R9.8 output direction | artifact/report direction 和 pairing 已写。 | R9.10 可写 candidate evidence direction,但不写 JSON schema。 |

### 3. suite-to-cut 映射边界思考

R9.10 应该按 suite family 映射到测试切口和用例族,不是把 83 条 TC 全量展开成最终 case/evidence schema。若某 suite 同时覆盖多个切口,允许重复映射,但必须说明“主覆盖”和“辅助覆盖”。

| Suite family | 主测试切口方向 | 辅助切口方向 | R9.10 写入提醒 |
|---|---|---|---|
| `contract-domain-fast` | truth invariant、typed ref / DTO shell、state machine、policy guard、body-free shell。 | config parser / redaction helper / metric label pure rule。 | 映射到 `TRUTH` / `IDENTITY` / `CATALOG` / `FORMALIZATION` / `VERSION` / `STATE` / `SHELL` / `POLLUTION` family。 |
| `service-flow-fast` | command/query/consumer/outbound/job service flow、UoW ordering、duplicate replay、query no-write。 | safe error mapping、marker copy-only fast branch。 | 映射到 `COMMAND` 等价 flow family、`QUERY`、`CONSUMER`/`DISTRIBUTION`、`REPLAY`、`RECOVERY`、`JOB` family。 |
| `config-redline` | config validation、source priority、profile isolation、forbidden configurable boundary。 | marker source / redaction config / dependency availability。 | 映射到 `CONFIG` / `DEPENDENCY` / `MARKER` / `REDACTION` family。 |
| `dependency-boundary` | compile dependency boundary、Definition vs Use、sibling seam。 | report audit support。 | 映射到 `BOUNDARY` / `DEPENDENCY` / `POLLUTION` family。 |
| `infra-runtime-fake` | repository/UoW/fake adapter/runtime builder/profile assembly。 | rollback/version conflict/fake parity。 | 映射到 `UOW` / `RECOVERY` / `DEPENDENCY` / `MARKER` / `CONFIG` family。 |
| `entry-worker-job` | API/worker/job entry shell、runner envelope、safe response/report/disposition。 | public shell and body-free output scan。 | 映射到 `SHELL` / `TRACE` / `AUDIT` / `JOB` / `REPORT` / `HANDOFF` family。 |
| `operations-replay-core` | stored replay、checkpoint/report、partial failure core、no truth repair。 | lineages, handoff replay and audit refs-only。 | 映射到 `REPLAY` / `RECOVERY-003~004` / `UOW` / `JOB` / `REPORT` / `TRACE` / `AUDIT` family。 |
| `redaction-boundary` | no raw body/secret/provider payload in outputs。 | report/artifact leak scan。 | 映射到 `REDACTION` / `BODY` / `SHELL` / `DIAGNOSTIC` / `OBSERVABILITY` family。 |
| `observability-boundary` | metric low-cardinality、trace/span body-free、audit refs-only。 | diagnostic not truth。 | 映射到 `METRIC` / `OBSERVABILITY` / `AUDIT` / `DIAGNOSTIC` family。 |
| `report-generation-audit` | artifact/report pairing、no static evidence。 | evidence lineage candidate。 | 映射到 `EVIDENCE` / `REPORT` / redaction report family。 |
| `release-main-smoke` |最小跨入口闭环和送验前 summary。 | config/redaction/dependency/report audit summary。 | 只映射 representative family,不得替代底层 suite。 |
| `p1-real-like-selected-run` | future selected-run seam。 | residual / unavailable reporting。 | 不作为 P0 coverage closure。 |

### 4. candidate evidence 映射边界思考

Step 9 可以把 suite 映射到 evidence candidate family,用于 Step 13 继续闭合归档;不能在 R9.9/R9.10 固定正式 EV ID、JSON 字段、assertion item key 或 retention。

| Evidence candidate family | 来源 suite 候选 | 使用边界 |
|---|---|---|
| definition / identity / catalog evidence candidate | `contract-domain-fast`;`service-flow-fast`;`release-main-smoke` representative。 | 证明 definition truth、catalog safe shell、query no-write 的候选证据来源。 |
| formalization / version / state evidence candidate | `contract-domain-fast`;`service-flow-fast`。 | 证明 state transition、formal version、duplicate replay 和 illegal transition。 |
| consumption / distribution / handoff evidence candidate | `service-flow-fast`;`entry-worker-job`;`infra-runtime-fake`;`operations-replay-core`。 | 证明 downstream boundary、publisher/handoff seam、safe shell 和 failed outcome。 |
| trace / audit / lineage / report evidence candidate | `entry-worker-job`;`operations-replay-core`;`report-generation-audit`;`observability-boundary`。 | 证明 refs-only trace/audit、job report/no repair、report pairing。 |
| config / dependency / redaction / observability evidence candidate | `config-redline`;`dependency-boundary`;`redaction-boundary`;`observability-boundary`;release checks。 | 证明 config fail-fast、dependency boundary、redaction scan、metric/trace/audit safe output。 |
| selected-run residual evidence candidate | `p1-real-like-selected-run`。 | 只记录 residual/unavailable,不计 P0 pass。 |

### 5. P0 自动化覆盖缺口风险

| 风险 | R9.9 判断 | R9.10 写入提醒 |
|---|---|---|
| 用例族只有 release-main-smoke 覆盖 | 不可接受。release smoke 只做代表性闭环。 | 底层 suite 必须同时覆盖主用例族。 |
| redaction 只在 report audit 中出现 | 不足。redaction 必须有 boundary/check suite。 | `redaction-boundary` 和 release redaction check 都要映射。 |
| dependency boundary 只靠人工审查 | 不足。必须进入 PR/main/release check family。 | `dependency-boundary` 映射 `BOUNDARY` / `DEPENDENCY` family。 |
| marker source / schema 缺口由 suite 私补 | 不允许。 | 映射表只记录 stop-review / owning source,不补口。 |
| P1 selected-run 被计入 P0 coverage | 不允许。 | selected-run 单独标 non-P0 residual。 |
| suite 与 TC family 重叠导致重复 evidence | 可接受但需说明主/辅覆盖。 | R9.10 写重复覆盖说明,正式 EV 去重留 Step 13。 |

### 6. 重复覆盖思考

| 重复覆盖类型 | 是否允许 | 处理口径 |
|---|---|---|
| redaction / body-free 跨多个 suite | 允许。 | 横切红线,不同输出面分别覆盖。 |
| query no-write 被 contract/service/release smoke 多次覆盖 | 允许。 | service-flow 为主,release smoke 只代表性验证。 |
| replay / recovery 被 service-flow、operations-replay-core、nightly extended 覆盖 | 允许。 | fast/core/extended 分层,不可互相替代。 |
| report evidence 被 job suite、operations replay 和 report audit 覆盖 | 允许。 | job/report 证明业务输出,report audit 证明配对和 no static evidence。 |
| P1 selected-run 与 integration-like seam 重叠 | 不作为 P0 重复覆盖。 | selected-run 只记录 residual/future direction。 |

### 7. R9.10 写入边界

R9.10 可以写入:

1. suite-to-cut / TC family / candidate evidence family 映射候选表。
2. P0 自动化覆盖风险表。
3. 重复覆盖说明表。
4. mapping stop-review 和 `R9.11 cross-suite audit / closure:先思考` 进入门禁。

R9.10 禁止写入:

1. 正式 evidence ID、artifact JSON schema、case JSON schema、report schema、retention、review status 或 acceptance verdict。
2. 全量逐条 case assertion JSON 字段或 assertion item key。
3. CI YAML、脚本实现、package command、required check 绑定或实现仓测试函数名。
4. 新增 TC、DS、环境、profile、config key、adapter product、marker source、port、mapper、state 或 phase boundary。
5. 修改正式 `05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` 或 implementation code。

### 8. R9.9 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 suite-to-cut / candidate evidence mapping 边界 | pass |
| 是否承接 Step 5/6/7/8 和 R9.4/R9.6/R9.8 | pass |
| 是否形成 suite family 到测试切口 / TC family 的映射思考 | pass |
| 是否形成 candidate evidence family 思考 | pass |
| 是否识别 P0 自动化覆盖缺口风险 | pass |
| 是否区分允许重复覆盖与不可替代覆盖 | pass |
| 是否未写最终 suite-to-case/evidence 映射 | pass |
| 是否未写 evidence schema、artifact/report JSON 字段、验收或实施内容 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 9 `R9.10 suite-to-cut / candidate evidence mapping:再写入`;只允许写入 suite-to-cut / TC family / candidate evidence family 映射候选表、P0 自动化覆盖风险表、重复覆盖说明表、mapping stop-review 和 `R9.11 cross-suite audit / closure:先思考` 进入门禁;不得直接修改正式 `05-测试方案.md`;不得定义正式 evidence schema、artifact/report JSON 字段、验收标准、实施计划或 implementation code。

---

## R9.10 suite-to-cut / candidate evidence mapping:再写入

### 1. 当前模块写入目标

`R9.10` 将 `R9.9` 的 suite-to-cut / candidate evidence mapping 思考写成候选表。它只覆盖 suite-to-cut / TC family / candidate evidence family 映射候选表、P0 自动化覆盖风险表、重复覆盖说明表、mapping stop-review 和 `R9.11` 进入门禁。

当前模块不定义正式 evidence ID、artifact JSON schema、case JSON schema、report schema、retention、review status、acceptance verdict、CI YAML、required check、实现仓测试函数名、验收标准、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R9.11 |
| 用户确认 | 已确认从 `R9.9` 推进到 `R9.10`。 |
| 当前允许 | 写 suite-to-cut / TC family / candidate evidence family 映射候选表、P0 自动化覆盖风险表、重复覆盖说明表、mapping stop-review 和 R9.11 进入门禁。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;定义正式 evidence schema、artifact/report JSON 字段、验收标准、实施计划或 implementation code。 |

### 2. suite-to-cut / TC family / candidate evidence 映射候选表

| Suite family | 主测试切口 | TC family / range 候选 | Candidate evidence family | 执行层级 | 映射裁决 |
|---|---|---|---|---|---|
| `contract-domain-fast` | typed refs、DTO shell、truth invariant、policy guard、state matrix、body-free shell。 | `TRUTH`;`IDENTITY`;`CATALOG`;`FORMALIZATION`;`VERSION`;`CHANGE`;`STATE`;`SHELL`;`POLLUTION`。 | definition-truth;identity-catalog;formal-version;state-machine;public-shell;pollution-guard candidate。 | PR / main | P0 blocking 主覆盖。 |
| `service-flow-fast` | command/query/consumer/outbound/job flow、UoW ordering、duplicate replay、query no-write。 | `QUERY`;`IDEMP`;`RECOVERY-001~002`;`CONSUMPTION`;`DISTRIBUTION`;`PUBLISHER`;`HANDOFF`;`AVAILABILITY`;fast `REPLAY`;fast `JOB`。 | service-flow;query-no-write;idempotency;replay-fast;handoff-seam candidate。 | PR / main | P0 blocking 主覆盖。 |
| `config-redline` | strict validation、profile isolation、source priority、forbidden configurable boundary。 | `CONFIG`;`DEPENDENCY`;`REDACTION`;`MARKER`。 | config-source-conflict;profile-isolation;config-redline;marker-copy-only candidate。 | PR / main / release | P0 blocking 主覆盖。 |
| `dependency-boundary` | only `core-contracts` compile dependency、runtime/event/replay dependency boundary。 | `BOUNDARY`;`DEPENDENCY`;`POLLUTION`。 | dependency-boundary;definition-use-boundary;pollution-guard candidate。 | PR / main / release | P0 blocking 主覆盖。 |
| `infra-runtime-fake` | fake repository/UoW、controlled adapter、runtime builder、profile assembly、fake parity。 | `UOW`;`RECOVERY`;`DEPENDENCY`;`MARKER`;`CONFIG`;`AVAILABILITY`。 | fake-runtime;transaction;dependency-unavailable;marker-source candidate。 | main | P0 blocking 主覆盖。 |
| `entry-worker-job` | API/worker/job entry shell、runner envelope、safe response/report/disposition。 | `SHELL`;`TRACE`;`AUDIT`;`JOB`;`REPORT`;`HANDOFF`;`OBSERVABILITY`。 | entry-shell;job-report;trace-audit;safe-disposition candidate。 | main | P0 blocking 主覆盖。 |
| `operations-replay-core` | stored replay、checkpoint/report、partial failure core、no truth repair。 | `REPLAY`;`RECOVERY-003~004`;`UOW`;`JOB`;`REPORT`;`TRACE`;`AUDIT`;`LINEAGE`;`EVIDENCE`。 | operations-replay;checkpoint-report;no-truth-repair;lineage candidate。 | main / release core subset | P0 blocking 主覆盖。 |
| `redaction-boundary` | no raw body、secret、endpoint、provider response in observable outputs。 | `REDACTION`;`BODY`;`SHELL`;`DIAGNOSTIC`;`OBSERVABILITY`;`REPORT`。 | redaction-secret;redaction-output;body-free-shell;safe-diagnostic candidate。 | main / release | P0 blocking 主覆盖。 |
| `observability-boundary` | metric low-cardinality、trace/span body-free、audit refs-only。 | `METRIC`;`OBSERVABILITY`;`AUDIT`;`DIAGNOSTIC`;`TRACE`。 | metric-cardinality;trace-span-body-free;audit-refs-only;diagnostic-safe candidate。 | main / nightly | P0 blocking 主覆盖。 |
| `operations-replay-extended` | wider recovery、fault injection、race/retry/partial report sample。 | extended `REPLAY`;`RECOVERY`;`UOW`;`JOB`;`REPORT`;`DEPENDENCY`;`MARKER`。 | extended-replay;fault-injection;partial-report candidate。 | nightly | P0 nightly blocking;not release replacement。 |
| `fault-injection-matrix` | UoW rollback、commit unknown、resolver unavailable、publisher/handoff failed、source missing stop。 | `RECOVERY`;`UOW`;`DEPENDENCY`;`PUBLISHER`;`HANDOFF`;`MARKER`。 | fault-injection;commit-unknown;target-failed;source-missing-stop candidate。 | nightly | P0 nightly blocking;formal source only。 |
| `report-generation-audit` | artifact/report pairing、failed artifact retention、no static evidence。 | `EVIDENCE`;`REPORT`;redaction report subset。 | report-pairing;no-static-evidence;evidence-candidate-summary candidate。 | nightly / release | P0 blocking audit coverage。 |
| `release-main-smoke` | 最小跨入口闭环、profile assembly、release summary input。 | representative `TRUTH`;`FORMALIZATION`;`CONSUMPTION`;`QUERY`;`JOB`;`REPORT`;`CONFIG`;`REDACTION`。 | release-smoke;release-summary-input candidate。 | release | Representative coverage only;does not replace lower suites。 |
| `p1-real-like-selected-run` | future durable / real-like adapter selected-run。 | future selected TC only;non-P0。 | selected-run residual candidate。 | explicit P1 selected-run | non-P0 residual;unavailable not P0 pass。 |

### 3. P0 自动化覆盖风险表

| 风险 | 裁决 | 处理 |
|---|---|---|
| P0 用例族只有 `release-main-smoke` 覆盖 | blocking gap if happens | R9.10 映射中每个 P0 主族均有底层 suite;release smoke 只做代表性闭环。 |
| redaction 只出现在 report audit | blocking gap if happens | `redaction-boundary` 和 release redaction check 均映射,report audit 只做配对/静态证据审计。 |
| dependency boundary 只靠人工审查 | blocking gap if happens | `dependency-boundary` 进入 PR / main / release check family。 |
| replay/recovery 只有 nightly extended | blocking gap if happens | `service-flow-fast` 与 `operations-replay-core` 承接 fast/core;nightly extended 只补重场景。 |
| marker/source/schema 缺口由 suite 私补 | forbidden | 映射表只记录 candidate family;source missing 必须 stop-review,不得由 suite 合成 marker。 |
| P1 selected-run 被计入 P0 coverage | forbidden | `p1-real-like-selected-run` 标记 non-P0 residual。 |
| suite 到 TC family 映射过宽导致伪覆盖 | watch | R9.10 使用 TC family / range candidate,正式逐 case 与 EV schema 留 Step 13。 |

### 4. 重复覆盖说明表

| 重复覆盖类型 | 主覆盖 | 辅助 / 代表性覆盖 | 裁决 |
|---|---|---|---|
| query no-write | `service-flow-fast` | `contract-domain-fast` shell rule;`release-main-smoke` representative。 | acceptable;release 不替代 service。 |
| body-free / redaction | `redaction-boundary` | `contract-domain-fast`;`entry-worker-job`;release redaction check;`report-generation-audit` leak guard。 | acceptable;不同输出面分别覆盖。 |
| replay / recovery | `operations-replay-core` | `service-flow-fast` fast subset;`operations-replay-extended`;`fault-injection-matrix`。 | acceptable;fast/core/extended 分层。 |
| config / marker source | `config-redline` | `infra-runtime-fake`;`fault-injection-matrix`;release config redline。 | acceptable;config redline 为主。 |
| report / evidence candidate | `report-generation-audit` | `entry-worker-job`;`operations-replay-core`;release report audit。 | acceptable;job/report 证明业务输出,audit 证明配对。 |
| dependency boundary | `dependency-boundary` | release dependency boundary;config redline support。 | acceptable;static/check family 为主。 |
| P1 seam | `p1-real-like-selected-run` | `integration-like` controlled seam。 | not P0 duplicate;selected-run residual only。 |

### 5. mapping stop-review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否覆盖 Step 6 五个用例批次 | pass | definition/catalog、formal/state、consumption/seam、trace/job/recovery、config/redaction/observability 均有 suite family。 |
| 是否每个 P0 suite 有主测试切口 | pass | 映射表已列主测试切口。 |
| 是否每个 P0 suite 有 candidate evidence family | pass | 仅为 candidate,正式 EV 留 Step 13。 |
| 是否避免 release smoke 替代底层断言 | pass | release-main-smoke 标记 representative only。 |
| 是否避免 P1 selected-run 计入 P0 | pass | selected-run 标记 non-P0 residual。 |
| 是否说明重复覆盖 | pass | 重复覆盖说明表已写。 |
| 是否未定义正式 evidence schema / artifact JSON 字段 | pass | R9.10 只写 candidate family。 |
| 是否未新增 TC / DS / profile / marker source | pass | 只承接 Step 6/7/8 和已写 suite。 |

### 6. R9.11 进入门禁

| 门禁项 | 裁决 |
|---|---|
| R9.10 是否只写 suite-to-cut / TC family / candidate evidence mapping | pass |
| P0 自动化覆盖风险是否已记录 | pass |
| 重复覆盖是否已说明主/辅或 representative 口径 | pass |
| release smoke 是否未替代底层 suite | pass |
| P1 selected-run 是否未计入 P0 closure | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未定义正式 evidence schema、artifact/report JSON 字段、验收或实施内容 | pass |

进入 `R9.11 cross-suite audit / closure:先思考` 时,只允许思考 P0 自动化缺口、suite 重叠、证据候选冲突、artifact/report 配对、release gate 覆盖、redaction / dependency check、Step 9 closure 和 `R9.12 cross-suite audit / closure:再写入` 边界;不得直接修改正式 `05-测试方案.md`;不得定义正式 evidence schema、artifact/report JSON 字段、验收标准、实施计划或 implementation code。

### 7. R9.10 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 suite-to-cut / TC family / candidate evidence 映射候选表 | pass |
| 是否写入 P0 自动化覆盖风险表 | pass |
| 是否写入重复覆盖说明表 | pass |
| 是否写入 mapping stop-review 和 R9.11 进入门禁 | pass |
| 是否未定义正式 evidence schema、artifact/report JSON 字段、验收或实施内容 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 9 `R9.11 cross-suite audit / closure:先思考`;只允许思考 P0 自动化缺口、suite 重叠、证据候选冲突、artifact/report 配对、release gate 覆盖、redaction / dependency check、Step 9 closure 和 `R9.12 cross-suite audit / closure:再写入` 边界;不得直接修改正式 `05-测试方案.md`;不得定义正式 evidence schema、artifact/report JSON 字段、验收标准、实施计划或 implementation code。

---

## R9.11 cross-suite audit / closure:先思考

### 1. 当前模块目标

`R9.11` 只思考 P0 自动化缺口、suite 重叠、证据候选冲突、artifact/report 配对、release gate 覆盖、redaction / dependency check、Step 9 closure 和 `R9.12` 写入边界。

当前模块不写最终 Step 9 closure 表,不把 Step 9 标记为 completed,不进入 Step 10,不定义正式 evidence schema、artifact JSON schema、case JSON schema、report schema、验收标准、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R9.12 |
| 用户确认 | 已确认从 `R9.10` 推进到 `R9.11`。 |
| 当前允许 | 思考 P0 自动化缺口、suite 重叠、证据候选冲突、artifact/report 配对、release gate 覆盖、redaction / dependency check、Step 9 closure 和 R9.12 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写最终 closure;进入 Step 10;定义 evidence / artifact / report schema;验收标准;实施计划或 implementation code。 |

### 2. P0 自动化缺口审计思考

R9.12 需要确认 Step 6 的五个 P0 用例批次都有 P0 blocking suite 承接,并区分 release smoke 的代表性覆盖与底层 suite 的主覆盖。

| 覆盖批次 | 已有 suite 承接 | R9.11 判断 | R9.12 写入提醒 |
|---|---|---|---|
| definition truth / identity / catalog | `contract-domain-fast`;`service-flow-fast`;`release-main-smoke` representative。 | 无 P0 自动化空洞。 | release smoke 不替代底层 suite。 |
| formal version / explicit change / state | `contract-domain-fast`;`service-flow-fast`;`config-redline` support。 | 无 P0 自动化空洞。 | duplicate/recovery fast 与 replay core 分层说明。 |
| controlled consumption / distribution / seam | `service-flow-fast`;`infra-runtime-fake`;`entry-worker-job`;`operations-replay-core`。 | 无 P0 自动化空洞。 | seam 语义使用 controlled profile,不证明 real SLA。 |
| traceability / consistency / job / recovery | `entry-worker-job`;`operations-replay-core`;`operations-replay-extended`;`fault-injection-matrix`;`report-generation-audit`。 | 无 P0 自动化空洞;extended 只属 nightly。 | core vs extended 不互相替代。 |
| config / dependency / redaction / observability | `config-redline`;`dependency-boundary`;`redaction-boundary`;`observability-boundary`;release checks。 | 无 P0 自动化空洞。 | redaction/dependency 必须一票阻断。 |

### 3. suite 重叠审计思考

| 重叠项 | 当前判断 | R9.12 写入提醒 |
|---|---|---|
| `contract-domain-fast` 与 `service-flow-fast` 都覆盖 shell / state | acceptable | domain 发现 invariant/schema;service 发现编排和副作用。 |
| `service-flow-fast` 与 `operations-replay-core` 都覆盖 replay | acceptable | service fast 验证 duplicate/no-rerun;operations core 验证 stored replay/checkpoint/report。 |
| `redaction-boundary` 与 `report-generation-audit` 都扫描 report output | acceptable | redaction 扫泄露;audit 扫配对/no static evidence。 |
| release gate 与 main/nightly suite 重叠 | acceptable_with_note | release gate 是送验前 smoke 和审计,不替代底层 pass。 |
| P1 selected-run 与 integration-like seam | not P0 overlap | selected-run residual/future only。 |

### 4. evidence candidate 冲突审计思考

当前只使用 evidence candidate family,未定义正式 EV ID、artifact schema 或 report schema。R9.12 可以审计“候选族重复是否可接受”,但不能固定 EV 编号或字段。

| 冲突类型 | 当前判断 | 后续归属 |
|---|---|---|
| 多个 suite 指向同一 candidate evidence family | acceptable | Step 13 做正式 EV / generated_from / dedupe。 |
| evidence candidate 与 report audit candidate 重叠 | acceptable | Step 13 区分业务证据与报告审计证据。 |
| release summary candidate 与 suite report candidate 重叠 | acceptable_with_note | release summary 只能汇总,不得替代 suite artifact。 |
| P1 selected-run residual candidate 被误用为 P0 EV | forbidden | R9.12 标记禁止;Step 13/14 继续 residual。 |
| 旧 `EV` / old report path 被引用 | forbidden | 命中 historical pollution stop-review。 |

### 5. artifact/report 配对审计思考

| 审计项 | 当前判断 | R9.12 写入提醒 |
|---|---|---|
| blocking suite 是否都有 raw artifact direction | pass candidate | R9.8 已写 suite artifact direction。 |
| blocking suite 是否都有 human report direction | pass candidate | R9.8 已写 suite report direction。 |
| failed suite 是否保留 failure reason direction | pass candidate | R9.8 failure handling 已写。 |
| report 是否从 raw artifact 推导 | pass candidate | R9.8 配对规则已写。 |
| `latest` 是否被禁止 | pass candidate | R9.8 已禁止。 |
| schema 是否仍后移 Step 13 | pass candidate | R9.12 需要再次确认不补 JSON 字段。 |

### 6. release gate 覆盖审计思考

| Release gate 维度 | 当前判断 | R9.12 写入提醒 |
|---|---|---|
| release-main-smoke | 覆盖最小跨入口代表性闭环。 | representative only。 |
| config redline | 进入 release blocking。 | 禁止 config 放宽 truth/state/replay/schema/marker source。 |
| dependency boundary | 进入 release blocking。 | only `core-contracts` compile dependency。 |
| redaction boundary | 进入 release blocking。 | raw leak 一票阻断。 |
| report audit | 进入 release blocking。 | pairing/no static evidence。 |
| P1 selected-run | 不进入 P0 release gate。 | explicit selected-run residual only。 |

### 7. redaction / dependency check 审计思考

| Check | 当前判断 | R9.12 写入提醒 |
|---|---|---|
| redaction check | 必须进入 main/nightly/release。 | raw body、secret、endpoint、provider response 命中即阻断。 |
| dependency boundary check | 必须进入 PR/main/release。 | 非 `core-contracts` sibling compile dependency 阻断。 |
| artifact/report pairing check | 必须进入 nightly/release。 | blocking suite 缺配对阻断。 |
| no static evidence check | 必须进入 nightly/release。 | 静态 JSON / 手写 report 宣告 pass 阻断。 |

### 8. Step 9 closure 思考

R9.12 需要写 Step 9 completed stop-review,但仍不得修改正式 `05-测试方案.md`。Step 10 只有在 R9.12 完成后才能等待用户确认进入。

| closure 项 | R9.11 判断 |
|---|---|
| SOP Step 9 输出是否覆盖 | suite、gate、script family、artifact/report direction、mapping、stop-review 和 audit 都已分批覆盖。 |
| P0 自动化门禁是否清晰 | PR/main/nightly/release/P1 selected-run 分层清晰。 |
| 每个阻断 suite 是否已停审 | PR/main、nightly/release/P1、script/output、mapping 均有停审;总停审留 R9.12。 |
| 跨 suite 门禁 / 证据审计是否无 unresolved 冲突 | 当前未发现 unresolved;R9.12 写总表。 |
| 正式 evidence / artifact schema 是否未提前定义 | pass candidate。 |
| 正式 `05-测试方案.md` 是否未提前修改 | pass candidate。 |

### 9. R9.12 写入边界

R9.12 可以写入:

1. P0 自动化缺口总审计表。
2. suite 重叠 / candidate evidence 冲突审计表。
3. artifact/report 配对总审计表。
4. release gate / redaction / dependency check 总审计表。
5. Step 9 completed stop-review。
6. Step 10 进入门禁。

R9.12 禁止写入:

1. 正式 evidence ID、artifact JSON schema、case JSON schema、report schema、retention、review status 或 acceptance verdict。
2. CI YAML、脚本实现、package command、required check 绑定或实现仓测试函数名。
3. 新增 TC、DS、环境、profile、config key、adapter product、marker source、port、mapper、state 或 phase boundary。
4. 修改正式 `05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` 或 implementation code。
5. 直接进入 Step 10 正文。

### 10. R9.11 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 cross-suite audit / closure | pass |
| 是否覆盖 P0 自动化缺口审计思考 | pass |
| 是否覆盖 suite 重叠和 evidence candidate 冲突思考 | pass |
| 是否覆盖 artifact/report pairing 思考 | pass |
| 是否覆盖 release gate、redaction、dependency check 思考 | pass |
| 是否形成 R9.12 写入边界 | pass |
| 是否未写最终 closure、evidence schema、验收或实施内容 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 9 `R9.12 cross-suite audit / closure:再写入`;只允许写入 P0 自动化缺口总审计表、suite 重叠 / candidate evidence 冲突审计表、artifact/report 配对总审计表、release gate / redaction / dependency check 总审计表、Step 9 completed stop-review 和 Step 10 进入门禁;不得直接修改正式 `05-测试方案.md`;不得定义正式 evidence schema、artifact/report JSON 字段、验收标准、实施计划或 implementation code。

---

## R9.12 cross-suite audit / closure:再写入

### 1. 当前模块写入目标

`R9.12` 将 `R9.11` 的 cross-suite audit / closure 思考写成 Step 9 总审计记录。它只写 P0 自动化缺口总审计表、suite 重叠 / candidate evidence 冲突审计表、artifact/report 配对总审计表、release gate / redaction / dependency check 总审计表、Step 9 completed stop-review 和 Step 10 进入门禁。

当前模块不定义正式 evidence ID、artifact JSON schema、case JSON schema、assertion item key、report schema、retention、review status、acceptance verdict、CI YAML、required check、实现仓测试函数名、验收标准、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.1 |
| 用户确认 | 已确认从 `R9.11` 推进到 `R9.12`。 |
| 当前允许 | 写 P0 自动化缺口总审计、suite 重叠 / candidate evidence 冲突审计、artifact/report 配对审计、release gate / redaction / dependency check 总审计、Step 9 completed stop-review 和 Step 10 进入门禁。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;定义 evidence / artifact / report schema;写验收标准;写实施计划;写 CI YAML、脚本实现、required check 或 implementation code。 |

### 2. P0 自动化缺口总审计表

| P0 覆盖批次 | 主阻断 suite | 辅助 / 代表性 suite | 审计结论 | 后续约束 |
|---|---|---|---|---|
| definition truth / identity / catalog | `contract-domain-fast`;`service-flow-fast` | `release-main-smoke` representative | pass:no P0 automation gap | release smoke 只做代表性闭环,不得替代底层 suite。 |
| formal version / explicit change / state | `contract-domain-fast`;`service-flow-fast` | `config-redline` support | pass:no P0 automation gap | duplicate / recovery fast 与 replay core 分层,不得互相冒充。 |
| controlled consumption / distribution / seam | `service-flow-fast`;`infra-runtime-fake`;`entry-worker-job` | `operations-replay-core` | pass:no P0 automation gap | controlled seam 不证明真实外部产品 SLA。 |
| traceability / consistency / job / recovery | `entry-worker-job`;`operations-replay-core` | `operations-replay-extended`;`fault-injection-matrix`;`report-generation-audit` | pass:no P0 automation gap | extended / fault injection 属 nightly 扩展,core gate 不被替代。 |
| config / dependency / redaction / observability | `config-redline`;`dependency-boundary`;`redaction-boundary`;`observability-boundary` | release checks | pass:no P0 automation gap | redaction、dependency、config redline 命中即阻断。 |

### 3. suite 重叠 / candidate evidence 冲突审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| `contract-domain-fast` 与 `service-flow-fast` 均覆盖 shell / state | acceptable | domain suite 负责 invariant/schema;service suite 负责编排、副作用、query no-write。 |
| `service-flow-fast` 与 `operations-replay-core` 均覆盖 replay | acceptable | service fast 覆盖 duplicate/no-rerun;operations core 覆盖 stored replay、checkpoint、report。 |
| `redaction-boundary` 与 `report-generation-audit` 均检查输出安全 | acceptable | redaction 发现泄露;report audit 发现 artifact/report 配对和静态造证据。 |
| release gate 与 main/nightly suite 存在代表性重叠 | acceptable_with_note | release gate 只汇总 smoke/check/audit,不得替代 main/nightly suite 通过。 |
| 多个 suite 指向同一 candidate evidence family | acceptable | Step 13 才定义正式 EV、dedupe、generated_from 和 report schema。 |
| release summary candidate 与 suite report candidate 重叠 | acceptable_with_note | release summary 只能引用/汇总 suite artifact/report,不得单独宣告底层 pass。 |
| P1 selected-run residual candidate 被计入 P0 closure | forbidden | `p1-real-like-selected-run` 只记录 residual / future selected-run。 |
| 旧 `EV`、旧 report path 或 historical material 被引用 | forbidden | 命中即停审,不得污染本轮 Step 9。 |

### 4. artifact/report 配对总审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 每个 P0 blocking suite 有 raw artifact 输出方向 | pass | 方向为 `artifacts/test/<run_id>/suites/<suite>/`;字段和值域留 Step 13。 |
| 每个 P0 blocking suite 有 human report 输出方向 | pass | 方向为 `reports/runs/<run_id>/suites/<suite>.md`;模板与结构留 Step 13。 |
| failed / timeout / flaky suite 也保留 safe failure reason 方向 | pass | 当前只定义方向;failure JSON key、status 值域留 Step 13。 |
| report 必须由 raw artifact 推导 | pass | 手写 pass report、静态 JSON 或无 raw artifact report 均为 blocking gap。 |
| 自动化输出不得引用 `latest` | pass | 所有门禁必须绑定显式 `<run_id>`。 |
| suite report 与 gate summary 的关系 | pass_with_note | gate summary 可汇总 suite report,不得覆盖或删除 suite 级 raw artifact。 |
| artifact/report schema 是否提前定义 | pass | Step 9 未定义 JSON 字段、case schema、assertion item key、retention 或 review status。 |

### 5. release gate / redaction / dependency check 总审计表

| Gate / Check | 进入层级 | 阻断裁决 | 审计结论 |
|---|---|---|---|
| `release-main-smoke` | release | blocking representative | pass;只做最小跨入口代表性闭环。 |
| release config redline | release | blocking | pass;不得放宽 truth/state/replay/schema/marker source。 |
| release dependency boundary | release | blocking | pass;非 `core-contracts` sibling compile dependency 阻断。 |
| release redaction boundary | release | blocking | pass;raw body、secret、endpoint、provider response 泄露阻断。 |
| release report audit | release | blocking | pass;artifact/report pairing 和 no static evidence 阻断。 |
| `redaction-boundary` | main / release;nightly extended | blocking | pass;覆盖 observable output / report / artifact leak guard。 |
| `dependency-boundary` | PR / main / release | blocking | pass;覆盖 compile dependency 边界。 |
| `report-generation-audit` | nightly / release | blocking | pass;覆盖 pairing、failed artifact 留存方向、no static evidence。 |
| `p1-real-like-selected-run` | explicit P1 selected-run | residual / non-P0 | pass;不可用不算 P0 pass,也不阻断当前 P0 closure。 |

### 6. Step 9 completed stop-review

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否输出自动化 suite family 和 gate layering | pass | PR / main / nightly / release / P1 selected-run 分层已写。 |
| 是否输出 gate / report / check 脚本家族 | pass | 已固定 `scripts/gates/`、`scripts/reports/`、`scripts/checks/` 职责方向。 |
| 是否输出 run 参数和 artifact/report 输出方向 | pass | 已固定 `<run_id>`、`artifacts/test/<run_id>`、`reports/runs/<run_id>` 和禁止 `latest`。 |
| 是否输出 suite-to-cut / TC family / candidate evidence mapping | pass | 已到 candidate family 级别,未越界定义正式 EV。 |
| 是否完成 P0 自动化缺口审计 | pass | 五个 P0 覆盖批次均有 blocking suite 承接。 |
| 是否完成 suite 重叠和 candidate evidence 冲突审计 | pass | 重叠均有主/辅/representative 口径;无 unresolved 冲突。 |
| 是否完成 artifact/report pairing 审计 | pass | 已固定配对方向和静态造证据阻断原则。 |
| 是否完成 release / redaction / dependency check 审计 | pass | release blocking check family 已收口。 |
| 是否未修改正式 `05-测试方案.md` | pass | Step 9 仍只写中间产物。 |
| 是否未定义正式 evidence schema、artifact/report JSON 字段或验收裁决 | pass | schema 留 Step 13;进入/退出准则留 Step 12;验收裁决留 `06-验收标准.md`。 |
| 是否未新增 TC、DS、环境、profile、config key、marker source、port、mapper、state 或 phase boundary | pass | Step 9 只承接 Step 1~8 和正式 `03/04`。 |

### 7. Step 10 进入门禁

| 门禁项 | 裁决 |
|---|---|
| Step 9 是否 completed | pass |
| 是否允许直接写 Step 10 正文 | no;必须等待用户确认后进入 `R10.1 设计专项测试与非功能验证:先思考`。 |
| Step 10 开工前必读 | `project_execution_ledger.md`;`05_test_plan_calibration_flow.md`;`05_test_plan_step_10_nonfunctional.md` 如存在;Step 1~9 中间产物;SOP Step 10;书写规范 §5.10;正式 `00`~`04`。 |
| Step 10 初始允许 | 只允许思考性能、安全、一致性、可恢复性、可观测性、审计等专项验证框架、必读输入、非范围和 R10.2 写入边界。 |
| Step 10 初始禁止 | 不得修改正式 `05-测试方案.md`;不得定义正式 evidence schema;不得写缺陷规则、进入/退出准则、回归策略、验收标准、实施计划或 implementation code。 |

### 8. R9.12 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 P0 自动化缺口总审计表 | pass |
| 是否写入 suite 重叠 / candidate evidence 冲突审计表 | pass |
| 是否写入 artifact/report 配对总审计表 | pass |
| 是否写入 release gate / redaction / dependency check 总审计表 | pass |
| 是否写入 Step 9 completed stop-review | pass |
| 是否写入 Step 10 进入门禁但未进入 Step 10 正文 | pass |
| 是否未定义正式 evidence schema、artifact/report JSON 字段、验收或实施内容 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: Step 9 completed;等待用户确认后进入 Step 10 `R10.1 设计专项测试与非功能验证:先思考`;只允许思考 Step 10 的专项测试与非功能验证输入、性能 / 安全 / 一致性 / 可恢复性 / 可观测性 / 审计验证框架、非范围和 `R10.2` 写入边界;不得直接修改正式 `05-测试方案.md`;不得定义正式 evidence schema、artifact/report JSON 字段、验收标准、实施计划或 implementation code。
