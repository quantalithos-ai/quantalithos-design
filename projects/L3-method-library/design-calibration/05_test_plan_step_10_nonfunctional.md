# Step 10. 设计专项测试与非功能验证

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 10
> 回填章节: `05-测试方案.md` §10 专项测试与非功能验证
> 创建日期: 2026-06-28
> 当前模式: full-restart / step10-nonfunctional
> 当前状态: completed_wait_user_confirm_to_step11
> 当前模块: `R10.12 cross-special audit / closure:再写入`
> 当前门禁: `R10.12` completed_wait_user_confirm_to_step11;等待确认进入 Step 11 `R11.1 defects / retest:先思考`

---

## 0. Step 9 handoff

Step 9 已确认当前 `05-测试方案.md` 的自动化与 CI/CD 门禁:

- PR blocking suite 候选包含 `contract-domain-fast`、`service-flow-fast`、`config-redline`、`dependency-boundary`。
- main CI 候选在 PR suite 基础上加入 `infra-runtime-fake`、`entry-worker-job`、`operations-replay-core`、`redaction-boundary`、`observability-boundary`。
- nightly 候选承接 `operations-replay-extended`、`fault-injection-matrix`、`report-generation-audit`。
- release gate 候选包含 `release-main-smoke`、release config redline、release dependency boundary、release redaction boundary、release report audit。
- P1 selected-run 只记录 future real-like residual,不得计入 P0 closure。
- 所有 artifact/report 方向均 run-scoped,禁止 `latest`;正式 artifact/report JSON schema、case schema、assertion item key、retention 和 review status 留 Step 13。
- Step 9 已完成 P0 自动化缺口、suite 重叠、candidate evidence 冲突、artifact/report 配对、release gate、redaction 和 dependency check 总审计。

Step 10 的任务是把 `00` 的 NFR、`03` 的一致性 / 恢复 / 幂等 / 观测 / redaction、`04` 的配置失效与 profile 边界、Step 6 的用例族、Step 8 的环境和 Step 9 的 suite/gate,整理成专项测试与非功能验证框架。

---

## R10.1 设计专项测试与非功能验证:先思考

### 1. 当前模块目标

`R10.1` 只思考 Step 10 的输入边界、必读文档、SOP Step 10 五问、L1-governance Step 10 框架参考、L3-method-library 的专项验证轴、阈值来源规则、P0/P1 边界、R10.x 分批计划和 `R10.2` 写入边界。

当前模块不写最终专项测试矩阵,不固定正式 evidence ID、artifact/report JSON schema、阈值裁决、验收 verdict、CI required check、脚本实现、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.2 |
| 用户确认 | 已确认从 Step 9 completed 推进到 Step 10 `R10.1`。 |
| 当前允许 | 思考 Step 10 专项测试与非功能验证的输入、框架、专项轴、阈值来源、P0/P1 边界和 R10.2 写入计划。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写最终专项矩阵;定义 evidence schema、artifact/report 字段、验收标准、实施计划、CI YAML、required check、实现仓测试函数名或 implementation code。 |

### 2. Step 10 启动前必须承接

| 输入 | 必须承接的内容 | 禁止继承 / 禁止提前 |
|---|---|---|
| `project_execution_ledger.md` | 当前恢复点为 Step 10 `R10.1`;每次确认只推进一个当前模块。 | 跳过 R10.1 直接写完整专项矩阵。 |
| `05_test_plan_calibration_flow.md` | Step 1~9 completed;Step 10 waiting_user_confirm_to_R10.1;Step 11+ blocked。 | 在 Step 10 写缺陷分级、进入/退出准则、证据归档或正式 `05`。 |
| `05_test_plan_step_06_cases.md` | 83 条 `TC-ML-*` 候选用例,其中 `CONFIG`、`DEPENDENCY`、`REDACTION`、`DIAGNOSTIC`、`METRIC`、`OBSERVABILITY`、`MARKER`、`REPLAY`、`UOW`、`RECOVERY`、`JOB` 等已覆盖专项风险。 | 新增 TC 或改写断言。 |
| `05_test_plan_step_08_environment_config.md` | P0 环境为 `local-dev`、`ci-test`、`integration-like`、`operations-replay`;`staging-like` / `production-like` 为 P1/P2 direction。 | 把真实 DB、broker、secret provider、production-like 写成 P0 前置。 |
| `05_test_plan_step_09_automation_gates.md` | PR/main/nightly/release/P1 selected-run suite family、artifact/report 方向和 redaction/dependency/report audit 阻断原则。 | 定义 CI YAML、required check、script implementation 或 artifact schema。 |
| `00-需求文档.md` §13 / §14 / §15 | NFR-ML-001~016、非功能验收口径、风险和待确认事项。 | 继承旧 P95 / SLO 数字或把待确认项写成 P0 pass 阈值。 |
| `03-详细设计.md` §11~§15 | transaction、error/recovery、idempotency/concurrency、config/dependency、observability/audit/redaction/test cut。 | 用测试方案补正式 port、mapper、marker source、state 或 object schema。 |
| `04-配置设计.md` §8~§12 | secret/redaction、loading/validation、change/audit/rollback、failure/degradation、downstream handoff。 | 新增 config key、secret provider、hot reload、runbook 或 product binding。 |
| SOP Step 10 | 专项测试矩阵,覆盖性能、安全、一致性、恢复、观测和审计专项。 | 只写“非功能测试通过”。 |
| 书写规范 §5.10 | 每个专项必须有指标/风险、方法、环境、阈值/通过条件、证据。 | 使用无来源阈值或无证据专项。 |
| L1-governance Step 10 | 参考专项矩阵、性能口径、红线负向、故障注入、观测/审计证据和跨专项审计框架。 | 复制 governance 领域事实、VF/AC/EV 编号或旧性能数字。 |

### 3. SOP Step 10 五问思考边界

| SOP 问题 | R10.1 思考边界 | 后续落点 |
|---|---|---|
| 哪些性能指标必须验证? | 先判断 L3 当前只有结构性性能口径:核心查询 / 消费 / 追溯 / job 不被外围增强和 P1/P2 依赖阻塞;暂无正式 P95 / SLO 数字。 | R10.2 写性能专项候选;硬阈值若需要,后移 Step 12 / `06` 或回需求。 |
| 哪些安全和边界红线必须负向测试? | 先归并越权拥有、下游绕过定义真相、raw body/secret/full ref、non-core sibling compile dependency、observability 替代 truth 等红线。 | R10.2 写安全 / 边界专项候选。 |
| 哪些一致性和恢复场景必须故障注入? | 先归并 duplicate no-rerun、commit unknown、UoW rollback、stored surface missing、job no truth repair、publisher/handoff failed、source missing stop。 | R10.2 写一致性 / 恢复专项候选。 |
| 哪些日志、指标和审计证据必须存在? | 先归并 trace/audit refs-only、metric low-cardinality、safe diagnostic、body-free report、redaction scan、dependency report、report pairing audit。 | R10.2 写可观测性 / 审计专项候选。 |
| 阈值来自哪里? | 只允许来自正式 `00` NFR 判断口径、`03/04` 设计契约、Step 6 用例断言、Step 8 环境边界和 Step 9 suite/gate;无来源数字不得硬化。 | R10.2 写阈值来源规则;Step 12 / `06` 承接通过裁决。 |

### 4. L1-governance Step 10 框架参考思考

L1-governance Step 10 的可借鉴点是“将分散在需求、详细设计、配置、用例和自动化门禁中的非功能风险重新归并成专项矩阵,并明确哪些阈值有正式来源,哪些只能作为 sample/trend 或 residual”。L3 采用框架,不复制 governance 的领域事实或编号。

| L1-governance 框架点 | L3 采用方式 | L3 禁止 |
|---|---|---|
| 先声明 Step 状态、目标、输入基线和非范围 | L3 R10.1 先记录 Step 9 handoff、必读文档和禁止范围。 | 直接写正式 `05` §10。 |
| 专项测试矩阵按专项、风险、方法、环境、阈值/通过条件、证据组织 | L3 R10.2 可采用同类列结构。 | R10.1 不写最终矩阵。 |
| 性能口径区分硬阈值与 sample/trend | L3 当前仅有结构性性能判断,不硬化旧数字。 | 继承旧 P95 / SLA / capacity 数字。 |
| 安全红线必须负向测试 | L3 将 raw body/secret、下游绕过定义真相、dependency 越界、observability 替代 truth 作为专项。 | 只靠人工审查或 release smoke。 |
| 一致性 / 恢复采用 fake/controlled fault injection | L3 采用 Step 8 的 `ci-test` / `integration-like` / `operations-replay`。 | 要求真实外部产品作为 P0 前置。 |
| 观测 / 审计材料必须可验证且 safe | L3 承接 metric low-cardinality、trace/audit refs-only、redaction/report pairing。 | 定义具体 backend、dashboard、alert 或 schema。 |

### 5. L3 专项验证轴思考

| 专项轴 | 主要风险 | 主要来源 | R10.1 初判 |
|---|---|---|---|
| 性能结构性验证 | 核心 query / consumption / trace / job 被外围增强、P1/P2 依赖或证据线索拖垮。 | NFR-ML-001~003;Step 8/9。 | 记录 duration/count sample 和“不依赖 P1/P2”结构性断言;不写硬 P95。 |
| 可用性 / 降级 | 外围增强、条件型治理、下游、publisher/handoff 不可用导致 truth 被改写或整体不可用。 | NFR-ML-004~006;`04` §11;Step 6 dependency/recovery。 | 使用 fake/controlled unavailable/failed branch;正式 marker source 缺失必须停审。 |
| 安全 / 边界红线 | 本仓越权持有运行真相、raw body/secret、artifact/archive 正文、鉴权正文或下游绕过定义 truth。 | NFR-ML-007~008;BR-ML-005~008;Step 6 redaction/boundary。 | 负向测试 + redaction/dependency check;raw leak 阻断。 |
| 审计 / 可追溯 | 正式化、版本语义变化、消费影响和证据线索无法追溯。 | NFR-ML-009~011;FR-ML-007~009。 | 需要 trace/audit/evidence-lineage candidate,但正式 EV schema 留 Step 13。 |
| 幂等 / 一致性 | 重复读取/维护制造第二 truth,正式版本语义静默覆盖,duplicate 重新执行业务。 | NFR-ML-012~014;`03` §11~§13。 | 验证 no second truth、explicit change、stored replay、query no-write。 |
| 可观测性 | 关键状态不可观察,或 observability/audit material 被当作 truth。 | NFR-ML-015~016;`03` §14。 | 验证 safe log/metric/trace/audit/report 存在且不替代 truth。 |
| 配置失效 / redline | invalid config silent fallback、forbidden boundary override、unsafe redaction relax。 | `04` §8~§12;Step 9 `config-redline`。 | 验证 fail-fast / rejected / no activation;不新增 config key。 |
| 依赖边界 | non-core sibling compile dependency 或 runtime/event/replay 依赖混写。 | Step 8/9;架构 dependency rule。 | `dependency-boundary` 阻断;不定义 manifest path schema。 |

### 6. 阈值来源与通过口径思考

Step 10 可以讨论“通过条件方向”,但不能替代 Step 12 的进入/退出准则、Step 13 的证据 schema 或新版 `06-验收标准.md` 的验收裁决。

| 阈值 / 条件类型 | 当前来源判断 | R10.1 裁决 |
|---|---|---|
| 数字性能阈值 | 当前正式 `00` 只给结构性性能判断,未给 P95/SLO 数字。 | 不硬化;只允许 sample/trend 方向。 |
| redaction 阻断 | `03/04` 和 Step 9 均要求 raw body/secret/endpoint/provider response 泄露阻断。 | 可作为 P0 阻断方向。 |
| dependency boundary 阻断 | Step 8/9 固定只有 `L0-core` / `core-contracts` 是 compile dependency candidate。 | 可作为 P0 阻断方向。 |
| no truth repair / no second truth | NFR-ML-012~016、`03` transaction/recovery/observability 固定。 | 可作为 P0 阻断方向。 |
| availability/degraded | 必须复制正式 marker/source,不得合成。 | 仅正式 source 闭合时可通过。 |
| artifact/report evidence | Step 9 只定义方向;schema 留 Step 13。 | R10.1 不定义字段和值域。 |
| acceptance verdict | 后续 `06-验收标准.md` owns。 | R10.1 不写验收通过/不通过裁决。 |

### 7. 环境与 suite 承接思考

| 专项轴 | 候选环境 | 候选 suite family | 当前边界 |
|---|---|---|---|
| 性能结构性 sample | `ci-test`;`integration-like`;release smoke direction | `service-flow-fast`;`operations-replay-core`;`release-main-smoke` | 阻断“缺 sample / 依赖 P1/P2”,不阻断无来源数字。 |
| 可用性 / 降级 | `integration-like`;`operations-replay` | `infra-runtime-fake`;`operations-replay-core`;nightly fault matrix | fake/controlled failure;真实产品不可用不计 P0 pass。 |
| 安全 / redaction | `ci-test`;release gate | `redaction-boundary`;release redaction check | raw leak 阻断;scanner schema 后移。 |
| 审计 / 可追溯 | `ci-test`;`operations-replay` | `entry-worker-job`;`operations-replay-core`;`report-generation-audit` | 只做 candidate evidence family;正式 EV 留 Step 13。 |
| 幂等 / 一致性 | `ci-test`;`operations-replay` | `service-flow-fast`;`infra-runtime-fake`;`operations-replay-core` | fake UoW/repository/idempotency;不从 current truth 重算 duplicate。 |
| 可观测性 | `ci-test`;nightly / release audit | `observability-boundary`;`redaction-boundary`;`report-generation-audit` | 不定义 backend、metric name、trace schema。 |
| 配置失效 | `local-dev`;`ci-test`;release gate | `config-redline`;release config redline | fail-fast/no silent fallback。 |
| 依赖边界 | local tool;`ci-test`;release gate | `dependency-boundary`;release dependency check | 非 `core-contracts` sibling compile dependency 阻断。 |

### 8. source gap 与停审风险

| 风险 | R10.1 判断 | 处理 |
|---|---|---|
| 需要硬性能阈值但无正式来源 | Step 10 不能发明 P95/SLO。 | 记录 sample/trend 或回 `00/06/07` 定义容量基线。 |
| 需要正式 marker/source 才能断言 degraded/unavailable | Step 10 不能从 raw error、log、HTTP code 或 fake private map 合成。 | 回 `03/04` owning source 或停审。 |
| 需要 artifact/report 字段才能证明专项 | Step 10 只写证据方向。 | Step 13 闭合 schema。 |
| 需要真实外部产品证明可用性 | P0 使用 fake/controlled/replay。 | 标为 P1/P2 selected-run residual。 |
| 安全/redaction 需要 secret pattern 或 scanner 实现 | Step 10 只写风险与检查方向。 | Step 9/13/实施计划后续承接,不得写实现。 |
| dependency check 需要 manifest path / graph schema | Step 10 不定义实现细节。 | Step 9/13/07 后续承接。 |

### 9. R10.x 分批计划

| 模块 | 主题 | 输出边界 |
|---|---|---|
| R10.1/R10.2 | 开工、必读文档、专项轴和阈值来源 | 写输入基线、SOP 五问、L1 框架参考、专项轴、阈值规则、分批计划和 R10.3 进入门禁。 |
| R10.3/R10.4 | 性能 / 可用性 / 降级专项 | 思考并写性能结构性 sample、核心闭环不被外围阻断、unavailable/degraded/fail-closed 验证方向。 |
| R10.5/R10.6 | 安全 / redaction / dependency boundary 专项 | 思考并写 raw body/secret/full ref、越权持有、下游绕过 truth、compile dependency 越界专项。 |
| R10.7/R10.8 | 一致性 / 幂等 / 恢复专项 | 思考并写 duplicate no-rerun、commit unknown、UoW rollback、stored surface missing、job no truth repair、fault injection。 |
| R10.9/R10.10 | 可观测性 / 审计 / report pairing 专项 | 思考并写 log/metric/trace/audit/report safe evidence、low-cardinality、body-free、no static evidence。 |
| R10.11/R10.12 | cross-special audit / closure | 写 NFR 覆盖、阈值来源、P0/P1 边界、suite 映射、evidence 后移和 Step 11 进入门禁。 |

### 10. R10.2 写入边界

R10.2 可以写入:

1. Step 10 必读文档表与读取状态。
2. Step 9 handoff 承接表。
3. SOP Step 10 五问候选回答。
4. L1-governance Step 10 框架参考边界。
5. L3 专项验证轴、阈值来源规则、环境 / suite 承接思考。
6. source gap 与停审风险表。
7. R10.x 分批计划和 `R10.3` 进入门禁。

R10.2 禁止写入:

1. 最终专项测试矩阵、正式 evidence ID、artifact/report JSON schema、case JSON schema、assertion item key、retention、review status 或 acceptance verdict。
2. 缺陷分级、进入/退出准则、证据归档规则、回归策略、验收标准或实施计划。
3. CI YAML、脚本实现、package command、required check 绑定或实现仓测试函数名。
4. 新增 TC、DS、环境、profile、config key、adapter product、marker source、port、mapper、state、metric schema、trace schema 或 phase boundary。
5. 修改正式 `05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` 或 implementation code。

### 11. R10.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 Step 10 专项测试与非功能验证边界 | pass |
| 是否承接 Step 9 completed handoff | pass |
| 是否读取并对照 SOP Step 10 和书写规范 §5.10 | pass |
| 是否参考 L1-governance 框架但未复制领域事实 | pass |
| 是否形成 L3 专项验证轴和阈值来源思考 | pass |
| 是否形成环境 / suite 承接和 source gap 停审规则 | pass |
| 是否形成 R10.x 分批计划和 R10.2 写入边界 | pass |
| 是否未写最终专项矩阵、evidence schema、验收或实施内容 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.2 设计专项测试与非功能验证:再写入`;只允许写入 Step 10 必读文档表、Step 9 handoff 承接、SOP 五问候选回答、L1-governance 框架参考边界、L3 专项验证轴、阈值来源规则、环境 / suite 承接、source gap 与停审风险、R10.x 分批计划和 `R10.3` 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写最终专项测试矩阵、正式 evidence schema、验收标准、实施计划或 implementation code。

---

## R10.2 设计专项测试与非功能验证:再写入

### 1. 当前模块写入目标

`R10.2` 将 R10.1 的思考固化为 Step 10 的执行框架。它只写 Step 10 必读文档表、Step 9 handoff 承接、SOP 五问候选回答、L1-governance 框架参考边界、L3 专项验证轴、阈值来源规则、环境 / suite 承接、source gap 与停审风险、R10.x 分批计划和 `R10.3` 进入门禁。

当前模块不写最终专项测试矩阵,不定义正式 evidence ID、artifact/report JSON schema、case JSON schema、assertion item key、retention、review status、acceptance verdict、CI YAML、required check、实现仓测试函数名、验收标准、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.3 |
| 用户确认 | 已确认从 `R10.1` 推进到 `R10.2`。 |
| 当前允许 | 写 Step 10 必读文档表、Step 9 handoff 承接、SOP 五问候选回答、L1-governance 框架参考边界、L3 专项验证轴、阈值来源规则、环境 / suite 承接、source gap 与停审风险、R10.x 分批计划和 R10.3 进入门禁。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写最终专项测试矩阵;定义 evidence / artifact / report schema;写缺陷规则、进入/退出准则、验收标准、实施计划或 implementation code。 |

### 2. 必读文档表与读取状态

| 文档 | 读取状态 | Step 10 用途 | 当前裁决 |
|---|---|---|---|
| `project_execution_ledger.md` | 已读取并承接 | 确认当前模块为 `R10.2`,单模块推进。 | 本轮只推进 `R10.2`。 |
| `05_test_plan_calibration_flow.md` | 已读取并承接 | 确认 Step 1~9 completed、Step 10 R10.1 completed、Step 11+ blocked。 | `R10.2` 完成后等待 `R10.3`。 |
| `05_test_plan_step_10_nonfunctional.md` | 已读取并承接 | 作为当前 Step 文件,承接 R10.1 思考和 R10.2 写入边界。 | 不重写 R10.1。 |
| `05_test_plan_step_06_cases.md` | 已承接 | 提供 NFR、recovery、redaction、metric、observability、dependency、marker 等专项用例族。 | 不新增 TC 或改断言。 |
| `05_test_plan_step_08_environment_config.md` | 已承接 | 提供 `ci-test`、`integration-like`、`operations-replay`、P1/P2 selected-run 环境边界。 | 不新增环境、profile 或真实产品前置。 |
| `05_test_plan_step_09_automation_gates.md` | 已承接 | 提供 suite/gate/check/report family 和 artifact/report 方向。 | 不定义 CI YAML、脚本实现或 schema。 |
| `00-需求文档.md` §13 / §14 / §15 | 已读取关键段落 | 提供 NFR-ML-001~016、非功能验收方向、风险和待确认事项。 | 旧 P95/SLO 不硬化。 |
| `03-详细设计.md` §11~§15 | 已按关键主题承接 | 提供 transaction、recovery、idempotency、config、observability、redaction、test cut 基线。 | Step 10 不补 port、mapper、state、marker source。 |
| `04-配置设计.md` §8~§12 | 已按关键主题承接 | 提供 secret/redaction、validation、rollback、failure/degradation、downstream handoff。 | Step 10 不新增 config key、secret provider 或 hot reload。 |
| SOP Step 10 | 已读取 | 固定 Step 10 五问和专项测试矩阵输出要求。 | 当前只写框架候选,最终矩阵后续分批。 |
| 书写规范 §5.10 | 已读取 | 固定专项矩阵列:专项、指标/风险、方法、环境、阈值/通过条件、证据。 | R10.2 不填最终矩阵。 |
| L1-governance Step 10 | 已读取框架 | 参考输入基线、性能口径、红线负向、故障注入、观测/审计证据、跨专项审计。 | framework reference only。 |

### 3. Step 9 handoff 承接表

| Step 9 输出 | Step 10 承接方式 | 当前裁决 |
|---|---|---|
| PR / main / nightly / release / P1 selected-run 分层 | 专项必须映射到已有 suite/gate family。 | 不新增 suite,不写 CI required check。 |
| `config-redline` | 配置失效 / redline 专项承接 strict validation、profile isolation、no silent fallback。 | R10.3+ 后续细化。 |
| `dependency-boundary` | 依赖边界专项承接 only `core-contracts` compile dependency。 | 非 core sibling compile dependency 为 blocking direction。 |
| `redaction-boundary` | 安全 / redaction 专项承接 raw body、secret、endpoint、provider response 泄露阻断。 | 不定义 scanner 实现或 secret pattern。 |
| `observability-boundary` | 可观测性专项承接 metric low-cardinality、trace/span body-free、audit refs-only。 | 不定义 backend、metric name、span schema。 |
| `operations-replay-core` / `operations-replay-extended` | 一致性 / 恢复专项承接 stored replay、checkpoint/report、partial failure、no truth repair。 | core 与 extended 分层,不互相替代。 |
| `report-generation-audit` | 审计 / evidence 专项承接 artifact/report pairing、failed artifact 留存方向、no static evidence。 | schema 留 Step 13。 |
| `release-main-smoke` | 性能结构性 sample 和最小跨入口代表性闭环。 | representative only,不替代底层 suite。 |
| P1 selected-run | future real-like / production-like residual。 | 不计入 P0 closure。 |

### 4. SOP Step 10 五问候选回答

| SOP 问题 | R10.2 候选回答 |
|---|---|
| 哪些性能指标必须验证? | 当前 P0 只验证结构性性能口径:核心 query / consumption / trace / job 不依赖外围增强、P1/P2 real-like、production-like、真实 observability backend 或真实外部产品才能完成。自动化可记录 duration/count sample,但不设置无来源 P95/SLO 硬阈值。 |
| 哪些安全和边界红线必须负向测试? | 必须覆盖 raw body/secret/full sensitive ref 禁入、artifact/archive 正文禁入、鉴权实现正文禁入、下游绕过定义 truth、observability 替代 truth、non-core sibling compile dependency 等负向红线。 |
| 哪些一致性和恢复场景必须故障注入? | 必须覆盖 duplicate no-rerun、query no-write、commit unknown、UoW rollback、stored surface missing、version / unique conflict、job no truth repair、publisher/handoff failed、resolver unavailable、source missing stop。 |
| 哪些日志、指标和审计证据必须存在? | 必须存在 safe log/metric/trace/audit/report candidate:trace/audit refs-only、metric low-cardinality、safe diagnostic、body-free report、redaction check report、dependency report、report pairing audit。 |
| 阈值来自哪里? | 阈值只能来自正式 `00` NFR 判断口径、`03/04` 设计契约、Step 6 用例断言、Step 8 环境边界和 Step 9 suite/gate。当前没有正式负载模型、容量基线、生产 SLO 或 P95 数字,所以性能数字只作 sample/trend。 |

### 5. L1-governance Step 10 框架参考边界

| 框架点 | L3 采用 | L3 差异 |
|---|---|---|
| 输入基线表 | 采用;L3 明确 `00` NFR、Step 6 cases、Step 8 env、Step 9 gates、`03/04` 设计输入。 | L3 不复制 governance 的 AC/VF/EV 编号。 |
| SOP 五问回答 | 采用;L3 先写候选回答,后续分批落专项。 | L3 不在 R10.2 写最终专项矩阵。 |
| 性能硬阈值审计 | 采用;区分正式来源与旧数字污染。 | L3 当前无硬 P95/SLO,只 sample/trend。 |
| 红线负向专项 | 采用;L3 聚焦 definition truth、body-free、dependency、redaction、observability boundary。 | L3 不复制 governance policy/decision/nonconformity 领域事实。 |
| 故障注入矩阵 | 采用;L3 后续用 fake/controlled/replay 验证 recovery consistency。 | L3 不要求真实 DB/bus/external product 作为 P0。 |
| 观测 / 审计证据矩阵 | 采用;L3 关注 safe log/metric/trace/audit/report candidate。 | L3 不定义具体 backend、dashboard、alert 或 evidence schema。 |

### 6. L3 专项验证轴候选表

| 专项轴 | 主要风险 | 主要来源 | 后续落点 |
|---|---|---|---|
| 性能结构性验证 | 核心 query / consumption / trace / job 被外围增强、P1/P2 依赖或证据线索拖垮。 | NFR-ML-001~003;Step 8/9。 | R10.3/R10.4 |
| 可用性 / 降级 | 外围增强、条件型治理、下游、publisher/handoff 不可用导致 truth 被改写或整体不可用。 | NFR-ML-004~006;`04` §11;Step 6 dependency/recovery。 | R10.3/R10.4 |
| 安全 / 边界红线 | 越权持有运行真相、raw body/secret、artifact/archive 正文、鉴权正文或下游绕过 definition truth。 | NFR-ML-007~008;BR-ML-005~008;Step 6 redaction/boundary。 | R10.5/R10.6 |
| 审计 / 可追溯 | 正式化、版本语义变化、消费影响和证据线索无法追溯。 | NFR-ML-009~011;FR-ML-007~009。 | R10.9/R10.10 |
| 幂等 / 一致性 | 重复读取/维护制造第二 truth,正式版本语义静默覆盖,duplicate 重新执行业务。 | NFR-ML-012~014;`03` §11~§13。 | R10.7/R10.8 |
| 可观测性 | 关键状态不可观察,或 observability/audit material 被当作 truth。 | NFR-ML-015~016;`03` §14。 | R10.9/R10.10 |
| 配置失效 / redline | invalid config silent fallback、forbidden boundary override、unsafe redaction relax。 | `04` §8~§12;Step 9 `config-redline`。 | R10.5/R10.6 或 R10.11 closure |
| 依赖边界 | non-core sibling compile dependency 或 runtime/event/replay 依赖混写。 | Step 8/9;架构 dependency rule。 | R10.5/R10.6 |

### 7. 阈值来源规则

| 阈值 / 条件类型 | 可用来源 | 当前裁决 |
|---|---|---|
| 数字性能阈值 | 需要正式 NFR、容量基线、验收标准或实施计划明确。 | 当前不存在,不得硬化。 |
| duration/count sample | Step 9 suite/gate 可产生 run-scoped sample 方向。 | 可记录为 sample/trend candidate。 |
| redaction 阻断 | `03/04`、Step 6、Step 9 均有来源。 | 可作为 P0 blocking direction。 |
| dependency boundary 阻断 | Step 8/9 和架构依赖裁剪有来源。 | 可作为 P0 blocking direction。 |
| no truth repair / no second truth | NFR-ML-012~016、`03` transaction/recovery/observability 有来源。 | 可作为 P0 blocking direction。 |
| availability/degraded | 必须有正式 marker/source。 | source 缺失时停审。 |
| artifact/report 证据 | Step 9 只定义方向。 | schema 留 Step 13。 |
| acceptance verdict | `06-验收标准.md` owns。 | Step 10 不写 verdict。 |

### 8. 环境 / suite 承接表

| 专项轴 | 候选环境 | 候选 suite family | 阻断方向 |
|---|---|---|---|
| 性能结构性 sample | `ci-test`;`integration-like`;release smoke direction | `service-flow-fast`;`operations-replay-core`;`release-main-smoke` | 缺 sample 或依赖 P1/P2 阻断;无来源数字不阻断。 |
| 可用性 / 降级 | `integration-like`;`operations-replay` | `infra-runtime-fake`;`operations-replay-core`;nightly fault matrix | required missing / unsafe fallback 阻断;P1 unavailable residual。 |
| 安全 / redaction | `ci-test`;release gate | `redaction-boundary`;release redaction check | raw body/secret/full ref 泄露阻断。 |
| 审计 / 可追溯 | `ci-test`;`operations-replay` | `entry-worker-job`;`operations-replay-core`;`report-generation-audit` | 缺 trace/audit/report candidate 方向阻断;正式 schema 后移。 |
| 幂等 / 一致性 | `ci-test`;`operations-replay` | `service-flow-fast`;`infra-runtime-fake`;`operations-replay-core` | duplicate rerun、query write、truth repair 阻断。 |
| 可观测性 | `ci-test`;nightly / release audit | `observability-boundary`;`redaction-boundary`;`report-generation-audit` | high-cardinality label、raw body、observability truth 替代阻断。 |
| 配置失效 | `local-dev`;`ci-test`;release gate | `config-redline`;release config redline | silent fallback、forbidden override、unsafe redaction relax 阻断。 |
| 依赖边界 | local tool;`ci-test`;release gate | `dependency-boundary`;release dependency check | 非 `core-contracts` sibling compile dependency 阻断。 |

### 9. source gap 与停审风险表

| 风险 | 停审条件 | 处理 |
|---|---|---|
| 硬性能阈值无正式来源 | 需要 P95/SLO/pass 数字但 `00/06/07` 或容量基线未给出。 | 只记录 sample/trend,或回 owning 文档闭口。 |
| degraded/unavailable marker source 缺失 | 需要公开 degraded/unavailable 断言,但 `03/04` 未给正式 marker/source。 | 停审,不得从 raw error、log、HTTP code 或 fake private map 合成。 |
| artifact/report 字段缺失 | 需要字段级证据判断,但 Step 13 未定义 schema。 | 只写证据方向,字段留 Step 13。 |
| 真实外部产品成为 P0 前置 | 专项必须依赖真实 DB/bus/secret provider/product 才能通过。 | 改为 fake/controlled/replay 或 P1/P2 selected-run residual。 |
| scanner / checker 实现细节缺失 | 需要 secret pattern、manifest path、dependency graph schema 或 scanner command。 | 留 Step 9/13/07/实现计划,Step 10 不实现。 |
| 新 TC/DS/profile/config key 才能表达专项 | Step 10 框架无法回指 Step 6/7/8/`04`。 | 回对应 Step,不得在 R10.2 补口。 |

### 10. R10.x 分批计划

| 模块 | 主题 | 输出边界 |
|---|---|---|
| R10.3/R10.4 | 性能 / 可用性 / 降级专项 | 先思考再写入性能结构性 sample、核心闭环不被外围阻断、unavailable/degraded/fail-closed 验证方向。 |
| R10.5/R10.6 | 安全 / redaction / dependency boundary 专项 | 先思考再写入 raw body/secret/full ref、越权持有、下游绕过 truth、compile dependency 越界专项。 |
| R10.7/R10.8 | 一致性 / 幂等 / 恢复专项 | 先思考再写入 duplicate no-rerun、commit unknown、UoW rollback、stored surface missing、job no truth repair、fault injection。 |
| R10.9/R10.10 | 可观测性 / 审计 / report pairing 专项 | 先思考再写入 log/metric/trace/audit/report safe evidence、low-cardinality、body-free、no static evidence。 |
| R10.11/R10.12 | cross-special audit / closure | 先思考再写入 NFR 覆盖、阈值来源、P0/P1 边界、suite 映射、evidence 后移和 Step 11 进入门禁。 |

### 11. R10.3 进入门禁

| 门禁项 | 裁决 |
|---|---|
| R10.2 是否只写 Step 10 框架 | pass |
| 必读文档、Step 9 handoff、SOP 五问和 L1 框架参考是否已固化 | pass |
| L3 专项轴、阈值来源、环境 / suite 承接是否已固化 | pass |
| source gap 与停审风险是否已固化 | pass |
| 是否允许进入性能 / 可用性 / 降级专项最终矩阵 | no;R10.3 只允许先思考。 |

进入 `R10.3 性能 / 可用性 / 降级专项:先思考` 时,只允许思考性能结构性 sample、核心闭环不被外围阻断、availability/degraded/fail-closed 风险、环境 / suite 承接、阈值来源和 `R10.4` 写入边界;不得直接修改正式 `05-测试方案.md`;不得定义正式 evidence schema、artifact/report JSON 字段、验收标准、实施计划或 implementation code。

### 12. R10.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 Step 10 必读文档表与读取状态 | pass |
| 是否写入 Step 9 handoff 承接表 | pass |
| 是否写入 SOP Step 10 五问候选回答 | pass |
| 是否写入 L1-governance 框架参考边界 | pass |
| 是否写入 L3 专项验证轴、阈值来源规则、环境 / suite 承接 | pass |
| 是否写入 source gap 与停审风险、R10.x 分批计划和 R10.3 进入门禁 | pass |
| 是否未写最终专项测试矩阵、evidence schema、验收或实施内容 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.3 性能 / 可用性 / 降级专项:先思考`;只允许思考性能结构性 sample、核心闭环不被外围阻断、availability/degraded/fail-closed 风险、环境 / suite 承接、阈值来源和 `R10.4` 写入边界;不得直接修改正式 `05-测试方案.md`;不得定义正式 evidence schema、artifact/report JSON 字段、验收标准、实施计划或 implementation code。

---

## R10.3 性能 / 可用性 / 降级专项:先思考

### 1. 当前模块目标

`R10.3` 只思考性能结构性 sample、核心闭环不被外围阻断、availability / degraded / fail-closed 风险、环境 / suite 承接、阈值来源和 `R10.4` 写入边界。

当前模块不写最终专项测试矩阵,不定义硬 P95 / SLO / capacity 阈值,不定义正式 evidence ID、artifact/report JSON schema、验收标准、实施计划、CI YAML、required check 或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.4 |
| 用户确认 | 已确认从 `R10.2` 推进到 `R10.3`。 |
| 当前允许 | 思考性能结构性 sample、核心闭环不被外围/P1/P2/真实产品阻断、可用性 / 降级 / fail-closed 分支、环境 / suite 承接、阈值来源和 R10.4 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写最终专项矩阵;定义硬性能阈值;evidence / artifact / report schema;验收标准;实施计划或 implementation code。 |

### 2. 当前专项输入承接

| 输入 | 必须承接 | R10.3 裁决 |
|---|---|---|
| NFR-ML-001 | 方法资产目录识别、正式定义读取和下游受控消费不应成为当前主链能力阻塞点。 | 只验证结构性不阻塞和 sample/trend,不写 P95。 |
| NFR-ML-002 | 证据线索查看和追溯查看不应阻塞正式化、受控消费或一致性维护。 | 证据线索 / 追溯验证不能反向拖垮核心闭环。 |
| NFR-ML-003 | 性能与一致性冲突时,以定义真相、版本语义和追溯完整为优先。 | 不允许为低延迟牺牲 truth / version / trace 完整性。 |
| NFR-ML-004 | 外围增强失效时核心定义、正式化、消费和追溯仍成立。 | MethodPlugin、MethodConfiguration、marketplace、console、标准映射材料不可用不能拖垮核心。 |
| NFR-ML-005 | 条件型治理或候选下游依赖不可用时,不得丢失或改写定义 truth。 | governance / artifact / marketplace / console 等不可用只能影响协作判断。 |
| NFR-ML-006 | 下游消费方不可用或回报延迟时,不得把下游运行状态当作本仓 truth。 | process / identity / runtime / member-images unavailable 不改变本仓 truth。 |
| `04` §11 | fail-fast、fail-closed、rejected、degraded、delayed、failed marker、no activation。 | R10.4 需要按这些失效类别写候选专项行。 |
| Step 6 `DEPENDENCY` / `MARKER` / `RECOVERY` | required missing、optional unavailable、publisher/handoff failed、marker copy-only、source-missing stop。 | 可作为可用性/降级专项候选用例来源。 |
| Step 8 环境 | `ci-test`、`integration-like`、`operations-replay`;P1/P2 selected-run。 | P0 用 fake/controlled/replay;真实产品留 P1/P2。 |
| Step 9 suite | `service-flow-fast`、`infra-runtime-fake`、`operations-replay-core`、`release-main-smoke`、nightly fault matrix。 | R10.4 只映射方向,不写 CI required check。 |

### 3. 性能结构性 sample 思考

当前正式来源没有给 P95、吞吐、容量、SLO 或真实生产基线。R10.3 因此只能把性能专项定位为“结构性不阻塞 + run-scoped sample/trend”。

| 性能风险 | 思考方向 | R10.4 写入提醒 |
|---|---|---|
| 核心 query / consumption 依赖 P1/P2 能力 | 验证 P0 profile 下不依赖 marketplace、console、真实 product、production-like、真实 observability backend。 | 写成阻断“依赖 P1/P2 才能完成”,不是阻断某个数字阈值。 |
| 证据线索 / trace 查看拖垮正式化或消费 | 验证 evidence lineage / trace query 不反写 truth,且可记录 duration/count sample。 | sample 只作趋势材料,不作为 pass/fail 数字。 |
| job / replay 维护拖垮核心闭环 | 验证 operations replay 不修 core truth,partial/failed 可见,核心 query/command 不等 job 成功。 | job duration/count 可记录,但不替代一致性断言。 |
| 为低延迟牺牲定义 truth 或版本完整性 | 明确一致性优先;性能专项不得要求跳过 version / trace / stored replay。 | 若发现性能与一致性冲突,以 truth/version/trace 完整性为通过方向。 |
| 旧 P95 / SLA 污染 | 旧材料无正式来源。 | 明确不得继承旧数字;如需要硬阈值,回 `00/06/07` 或容量基线。 |

### 4. 核心闭环不被外围阻断思考

| 外围 / 条件依赖 | 当前 P0 口径 | R10.4 写入提醒 |
|---|---|---|
| MethodPlugin / MethodConfiguration | 外围增强不可用时,核心方法资产定义、正式化、消费和追溯仍成立。 | 不把 plugin/configuration marketplace 能力写成 P0 前置。 |
| marketplace / console | 只作为外围发现 / 管理体验方向。 | unavailable 只能是 residual,不得阻断核心闭环。 |
| 标准映射材料 / 外部标准来源 | 可作为摘要 / 引用 / 证据线索方向。 | 缺失不得改写定义 truth 或正式版本语义。 |
| L1-governance 条件型结论 | 可能作为 basis summary / ref。 | 不把 governance execution / Gate 流程作为 P0 必可用运行前置。 |
| L1-artifact / archive | 只允许 ref / summary / body-free boundary。 | artifact/archive 正文不可成为本仓 truth 或 P0 必需正文。 |
| 下游 process / identity / runtime / member-images | 运行期消费方或回报摘要候选。 | 下游 unavailable / delayed 不改变本仓 definition truth。 |

### 5. availability / degraded / fail-closed 风险思考

| 失效类别 | 触发方向 | 预期测试判断 | 禁止误用 |
|---|---|---|---|
| fail-fast | required startup config/store/adapter missing 或 invalid。 | runtime builder not Ready;safe issue/ref;无 facade dispatch。 | half-assembled facade 或 lower-priority silent fallback。 |
| fail-closed | raw secret/body、unsafe redaction、production-like fake、forbidden boundary override。 | 拒绝危险动作,无 unsafe reporting。 | 降级为 warning 或继续执行。 |
| rejected | job/entry/query/input required missing 或 selector invalid。 | 当前 action rejected;不修改全局配置或 truth。 | 修改全局配置或伪成功。 |
| degraded / unavailable | optional read material stale/unavailable、formal adapter degraded branch。 | 复制 formal marker/source;query no-write。 | 从 raw error、HTTP code、log、private map 合成 marker。 |
| delayed | consumer / publisher / handoff target temporary unavailable。 | 可重试但不证明成功;truth 不回滚。 | 用 delivery ack 证明 truth 或 rollback accepted truth。 |
| failed marker | publisher/handoff/reference/report job partial failure。 | 写正式 failed marker/report issue;truth unchanged。 | query repair 或 truth mutation。 |
| no activation | critical boundary change、unsafe redaction relax、unsupported reload/hot。 | change rejected and not active。 | force apply 或 hot relax。 |
| test fail-fast | fixture missing、fixed clock/id invalid、production-like fixture contamination。 | test failed,不得 skip 后计 pass。 | 用 fixture/fake 伪造 P0 pass。 |

### 6. 环境 / suite 承接思考

| 专项方向 | P0 环境 | suite / gate 候选 | R10.4 边界 |
|---|---|---|---|
| 性能结构性 sample | `ci-test`;release smoke direction | `service-flow-fast`;`release-main-smoke` | 记录 duration/count sample;不写硬阈值。 |
| 核心闭环不被外围阻断 | `ci-test`;`integration-like` | `service-flow-fast`;`infra-runtime-fake` | 外围 unavailable 不使 P0 核心闭环失败。 |
| optional dependency unavailable | `integration-like` | `infra-runtime-fake`;`operations-replay-core` | 只有 formal marker/source 闭合时可通过。 |
| publisher/handoff failed | `operations-replay` | `operations-replay-core`;nightly fault matrix | failed marker/report issue;truth unchanged。 |
| required dependency missing | `ci-test` | `config-redline`;`infra-runtime-fake` | fail-fast/rejected;不得 fallback。 |
| production-like / real-like unavailable | P1/P2 selected-run | `p1-real-like-selected-run` | residual only;不计 P0 pass。 |

### 7. 阈值来源思考

| 条件 | 是否可作为 R10.4 通过方向 | 原因 |
|---|---|---|
| “不依赖 P1/P2 / 外围增强即可完成核心闭环” | 是 | 来自 NFR-ML-001~006 和 Step 8/9。 |
| “记录 duration/count sample” | 是 | 可作为 run-scoped 趋势候选,但非硬阈值。 |
| “P95 < 某固定值” | 否 | 当前正式来源未给负载模型或数值。 |
| “SLO / availability percentage” | 否 | 当前无 production-like SLO 定义。 |
| “required missing 必须 fail-fast / rejected” | 是 | 来自 `04` §11 和 Step 6 dependency/config 用例。 |
| “optional unavailable 必须复制 formal marker” | 是,但有前提 | formal marker/source 必须已由 `03/04` 闭合。 |
| “publisher/handoff failed 不回滚 truth” | 是 | 来自 `04` §11、Step 6 dependency 和 Step 9 operations replay。 |

### 8. R10.4 写入边界

R10.4 可以写入:

1. 性能结构性 sample 专项候选表。
2. 核心闭环不被外围阻断专项候选表。
3. availability / degraded / fail-closed 专项候选表。
4. 环境 / suite 承接候选表。
5. 阈值来源 / 禁止硬化表。
6. 本批 stop-review 和 `R10.5 安全 / redaction / dependency boundary 专项:先思考` 进入门禁。

R10.4 禁止写入:

1. 硬 P95、SLO、容量、吞吐、可用率或 production baseline。
2. 正式 evidence ID、artifact/report JSON schema、case JSON schema、assertion item key、retention、review status 或 acceptance verdict。
3. 新增 TC、DS、环境、profile、config key、adapter product、marker source、port、mapper、state 或 phase boundary。
4. CI YAML、脚本实现、required check、实现仓测试函数名、验收标准、实施计划或 implementation code。
5. 修改正式 `05-测试方案.md`、`06-验收标准.md` 或 `07-实施计划.md`。

### 9. R10.3 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考性能 / 可用性 / 降级专项 | pass |
| 是否承接 NFR-ML-001~006 和 `04` §11 失效策略 | pass |
| 是否区分 sample/trend 与硬性能阈值 | pass |
| 是否识别核心闭环不被外围 / P1/P2 阻断 | pass |
| 是否识别 fail-fast、fail-closed、rejected、degraded、delayed、failed marker、no activation、test fail-fast | pass |
| 是否形成环境 / suite 承接思考 | pass |
| 是否形成 R10.4 写入边界 | pass |
| 是否未写最终专项矩阵、evidence schema、验收或实施内容 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.4 性能 / 可用性 / 降级专项:再写入`;只允许写入性能结构性 sample 专项候选表、核心闭环不被外围阻断专项候选表、availability / degraded / fail-closed 专项候选表、环境 / suite 承接候选表、阈值来源 / 禁止硬化表、本批 stop-review 和 `R10.5 安全 / redaction / dependency boundary 专项:先思考` 进入门禁;不得直接修改正式 `05-测试方案.md`;不得定义正式 evidence schema、artifact/report JSON 字段、验收标准、实施计划或 implementation code。

---

## R10.4 性能 / 可用性 / 降级专项:再写入

### 1. 当前模块写入目标

`R10.4` 将 R10.3 的思考固化为性能 / 可用性 / 降级专项候选矩阵。当前模块只写性能结构性 sample、核心闭环不被外围阻断、availability / degraded / fail-closed、环境 / suite 承接、阈值来源 / 禁止硬化、本批 stop-review 和 `R10.5` 进入门禁。

当前模块不定义硬 P95、SLO、容量、吞吐、可用率、production baseline、正式 evidence ID、artifact/report JSON schema、case JSON schema、assertion item key、retention、review status、acceptance verdict、CI YAML、required check、实现仓测试函数名、验收标准、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.5 |
| 用户确认 | 已确认从 `R10.3` 推进到 `R10.4`。 |
| 当前允许 | 写入性能结构性 sample 专项候选、核心闭环不被外围阻断专项候选、availability / degraded / fail-closed 专项候选、环境 / suite 承接、阈值来源 / 禁止硬化、stop-review 和 R10.5 进入门禁。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;定义硬性能 / 可用率数字;定义 evidence / artifact / report schema;新增 TC、DS、环境、profile、config key、marker source、port、mapper、state 或 phase boundary。 |

### 2. 性能结构性 sample 专项候选表

| 专项候选 | 指标 / 风险 | 方法 | 环境 | 阈值 / 通过条件 | 证据方向 |
|---|---|---|---|---|---|
| core-query-consumption-structural-sample | 核心 query / consumption 依赖 P1/P2 能力、真实产品或外围增强才可完成。 | 在 P0 profile 下执行代表性 query / consumption flow,记录 duration/count sample,同时断言不触发 marketplace、console、production-like、真实 observability backend 或真实下游产品前置。 | `ci-test`;`integration-like` controlled seam。 | 通过条件为“核心闭环不依赖 P1/P2 / 外围增强即可完成”;duration/count 仅作 run-scoped sample/trend,不得作为硬 pass 数字。 | `service-flow-fast` / `infra-runtime-fake` suite report direction;正式 artifact 字段留 Step 13。 |
| trace-evidence-nonblocking-sample | evidence lineage / trace 查看反向拖垮正式化、受控消费或一致性维护。 | 执行 trace / evidence-lineage candidate read,验证 query no-write、只读 refs / safe shell,记录 read count / duration sample。 | `ci-test`;`operations-replay` core subset。 | 通过条件为“不反写 truth、不阻断正式化 / 消费 / 维护”;无硬 P95。 | `operations-replay-core` / `entry-worker-job` report direction;schema 留 Step 13。 |
| job-replay-nonblocking-sample | replay / maintenance job 成功与否被错误写成核心 command/query 前置。 | 执行 core flow 与 job/replay core subset,验证 job duration/count 可记录但 core accepted truth 不等待 job 成功。 | `operations-replay`;`ci-test` deterministic subset。 | 通过条件为“job/replay 不修 core truth,partial/failed 可见,核心闭环不以 job success 为前置”。 | `operations-replay-core` report direction;failed / partial proof 字段留 Step 13。 |
| consistency-priority-over-latency | 为低延迟跳过 version、stored replay、trace/audit 或 safe marker。 | 构造需要 version / replay / trace 的代表性 flow,检查低延迟分支不得绕开正式一致性约束。 | `ci-test`;`integration-like`。 | 如果性能目标与 truth / version / trace 完整性冲突,以一致性和追溯完整为通过方向。 | `service-flow-fast` report direction;不产生性能硬阈值。 |

### 3. 核心闭环不被外围阻断专项候选表

| 外围 / 条件依赖 | 风险 | 方法 | 环境 | 阈值 / 通过条件 | 证据方向 |
|---|---|---|---|---|---|
| MethodPlugin / MethodConfiguration | 外围增强不可用导致定义、正式化、消费或追溯整体不可用。 | 在外围增强 disabled / unavailable fixture 下运行核心 definition / formalization / consumption / trace 代表性闭环。 | `ci-test`;`integration-like`。 | 核心闭环仍成立;外围 unavailable 只影响增强体验或 residual,不得成为 P0 前置。 | `service-flow-fast` / `infra-runtime-fake` report direction。 |
| marketplace / console | 市场或控制台不可用被误写成 P0 主链失败。 | controlled unavailable branch 验证核心 API / job / query 不依赖 marketplace / console 完成。 | `ci-test`;release smoke direction。 | marketplace / console unavailable 不阻断 P0 closure;release smoke 只作代表性闭环。 | `release-main-smoke` summary direction;不替代底层 suite。 |
| 标准映射材料 / 外部标准来源 | 外部标准材料缺失时改写 definition truth 或正式版本语义。 | 构造 external mapping missing / unavailable 分支,验证只影响引用 / 摘要 / 证据线索,不改写本仓 truth。 | `integration-like`;`operations-replay`。 | 缺失不得触发 truth mutation、version overwrite 或 hidden repair。 | `operations-replay-core` report direction。 |
| L1-governance 条件型结论 | governance execution / Gate 被当作本仓 P0 运行前置。 | 在 governance basis unavailable / delayed 条件下验证本仓只复制正式 ref / summary,不等待外部执行完成。 | `integration-like` controlled seam。 | 外部治理不可用只能影响协作判断,不得丢失或改写已成立 definition truth。 | `infra-runtime-fake` / `service-flow-fast` direction。 |
| L1-artifact / archive | artifact/archive 正文被当作本仓 truth 或 P0 必需正文。 | 验证只使用 ref / summary / body-free boundary,正文不可用不阻断核心定义判断。 | `ci-test`;`operations-replay`。 | artifact/archive body absence 不改变 truth;raw body 不进入 safe output。 | `redaction-boundary` 后续承接;本批只记录可用性方向。 |
| 下游 process / identity / runtime / member-images | 下游 unavailable / delayed 被用于回滚或修改本仓 truth。 | 模拟 downstream unavailable / delayed / no callback,验证 consumption impact 只形成 safe outcome 或 delayed/failed direction。 | `integration-like`;`operations-replay`。 | 下游状态不得成为本仓 definition truth;delivery / callback 不证明 accepted truth。 | `operations-replay-core` / `entry-worker-job` direction。 |

### 4. availability / degraded / fail-closed 专项候选表

| 失效类别 | 触发风险 | 方法 | 环境 | 阈值 / 通过条件 | 证据方向 |
|---|---|---|---|---|---|
| fail-fast | required startup config、store、adapter、profile 或 strict validation 缺失 / 非法。 | 启动 runtime builder / facade assembly 前注入 required missing 或 invalid config。 | `local-dev`;`ci-test`。 | builder not Ready;无 half-assembled facade;safe issue/ref;不得 silent fallback。 | `config-redline` / `infra-runtime-fake` report direction。 |
| fail-closed | raw secret/body、unsafe redaction、production-like fake、forbidden boundary override。 | 构造 unsafe redaction relax、raw credential/body 或 production-like fake 污染分支。 | `ci-test`;release redaction direction。 | 危险动作拒绝;无 unsafe reporting;不得降级为 warning 后继续执行。 | `redaction-boundary` 后续承接;本批保留 fail-closed 方向。 |
| rejected | job/entry/query/input required missing 或 selector invalid。 | 在 job-run-start / entry-local / query selector 注入 required missing 或非法选择。 | `ci-test`;`operations-replay`。 | 当前 action rejected;不修改全局配置、truth 或 stored result;不伪成功。 | `service-flow-fast` / `operations-replay-core` direction。 |
| degraded / unavailable | optional read material stale/unavailable、formal adapter degraded branch。 | 触发 optional material / resolver / diagnostic sink unavailable,验证 public surface 复制正式 marker/source。 | `integration-like`;`operations-replay`。 | 仅在 formal marker/source 已闭合时可通过;query no-write;不得合成 marker。 | `infra-runtime-fake` / `fault-injection-matrix` direction;marker schema 留 owning source / Step 13。 |
| delayed | consumer、publisher、handoff target temporary unavailable。 | 控制 publisher / handoff temporary unavailable,验证 retryable / delayed outcome。 | `integration-like`;`operations-replay`。 | 可重试但不证明成功;不回滚 accepted truth;delivery ack 不证明 truth。 | `operations-replay-core` / nightly `fault-injection-matrix` direction。 |
| failed marker | publisher / handoff / reference / report job partial failure。 | 注入 target failure 或 partial item failure,验证正式 failed marker / report issue direction。 | `operations-replay`;nightly direction。 | failed marker / report issue 可见;truth unchanged;不得 query repair。 | `operations-replay-core` / `report-generation-audit` direction;字段留 Step 13。 |
| no activation | critical boundary change、unsafe redaction relax、unsupported reload/hot。 | 尝试应用 forbidden boundary override 或 unsafe hot change。 | `ci-test`;release config direction。 | change rejected and not active;不得 force apply。 | `config-redline` direction。 |
| test fail-fast | fixture missing、fixed clock/id invalid、production-like fixture contamination。 | 在 test harness / replay fixture 载入前注入 fixture 缺失或污染。 | `ci-test`;`operations-replay`。 | test failed,不得 skip 后计 pass;不得 fallback 到 production runtime。 | `infra-runtime-fake` / `operations-replay-core` direction。 |

### 5. 环境 / suite 承接候选表

| 专项方向 | P0 环境 | suite / gate 候选 | 承接边界 | 禁止 |
|---|---|---|---|---|
| 性能结构性 sample | `ci-test`;`integration-like`;release smoke direction | `service-flow-fast`;`infra-runtime-fake`;`release-main-smoke` | 记录 duration/count sample 和结构性不阻塞断言。 | 把 sample 数字写成 P95/SLO/pass gate。 |
| 核心闭环不被外围阻断 | `ci-test`;`integration-like` | `service-flow-fast`;`infra-runtime-fake`;`release-main-smoke` representative | 验证外围 unavailable 不阻断 P0 core closure。 | 用 release smoke 替代底层 service / infra suite。 |
| optional unavailable / degraded | `integration-like`;`operations-replay` | `infra-runtime-fake`;`operations-replay-core`;nightly `fault-injection-matrix` | controlled seam 复制 formal marker/source。 | 从 raw error、HTTP code、log、private map 或 fake helper 合成 marker。 |
| publisher / handoff failed | `operations-replay`;`integration-like` | `operations-replay-core`;nightly `fault-injection-matrix`;`report-generation-audit` | failed marker / report issue direction;truth unchanged。 | 用 delivery ack 证明 truth 或 rollback accepted truth。 |
| required dependency missing | `local-dev`;`ci-test` | `config-redline`;`infra-runtime-fake` | fail-fast / rejected / no activation。 | lower-priority silent fallback 或 half-assembled facade。 |
| future real-like selected-run | P1/P2 only | `p1-real-like-selected-run` | residual / selected-run direction,不计 P0 closure。 | 要求真实 DB、broker、secret provider、external product 或 production-like 作为 P0 prerequisite。 |

### 6. 阈值来源 / 禁止硬化表

| 条件 / 阈值类型 | 当前可否硬化 | 来源 / 原因 | R10.4 裁决 |
|---|---|---|---|
| 核心闭环不依赖 P1/P2 / 外围增强即可完成 | 可作为通过方向 | NFR-ML-001~006、Step 8 环境、Step 9 suite/gate。 | 写入专项候选。 |
| duration/count sample | 可记录,不可硬化 | Step 9 run-scoped suite/report direction 支持样本趋势。 | 只作 sample/trend candidate。 |
| P95 / throughput / capacity 数字 | 不可硬化 | 当前正式 `00` 未给负载模型、容量基线或 SLO 数字。 | 禁止写成 pass/fail。 |
| availability percentage / production baseline | 不可硬化 | 当前无 production-like SLO 和真实产品基线。 | 禁止写成 P0 closure。 |
| required missing fail-fast / rejected | 可作为通过方向 | `04` §11、Step 6 dependency/config 用例。 | 写入专项候选。 |
| optional unavailable 复制 formal marker | 可作为通过方向,但有前提 | `03/04` formal marker/source 必须闭合。 | source 缺失则停审,不得补口。 |
| publisher/handoff failed truth unchanged | 可作为通过方向 | `04` §11、Step 6 dependency、Step 9 operations replay。 | 写入专项候选。 |
| artifact/report/case/assertion 字段 | 不可在本批硬化 | Step 13 owns schema、retention、review status。 | 只写证据方向。 |
| acceptance verdict | 不可在本批硬化 | `06-验收标准.md` owns。 | Step 10 不写 verdict。 |

### 7. R10.5 进入门禁

| 门禁项 | 裁决 |
|---|---|
| R10.4 是否只写性能 / 可用性 / 降级专项候选 | pass |
| 是否写入性能结构性 sample 专项候选表 | pass |
| 是否写入核心闭环不被外围阻断专项候选表 | pass |
| 是否写入 availability / degraded / fail-closed 专项候选表 | pass |
| 是否写入环境 / suite 承接候选表 | pass |
| 是否写入阈值来源 / 禁止硬化表 | pass |
| 是否避免硬 P95 / SLO / capacity / availability percentage / production baseline | pass |
| 是否避免定义 evidence schema、artifact/report JSON 字段、case JSON 字段、assertion key、验收 verdict 或实施计划 | pass |
| 是否未新增 TC、DS、环境、profile、config key、marker source、port、mapper、state 或 phase boundary | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

进入 `R10.5 安全 / redaction / dependency boundary 专项:先思考` 时,只允许思考 raw body / secret / full ref、artifact/archive body-free、越权持有、下游绕过 definition truth、observability 替代 truth、non-core sibling compile dependency、redaction/dependency suite 承接和 R10.6 写入边界;不得直接修改正式 `05-测试方案.md`;不得定义正式 evidence schema、artifact/report JSON 字段、验收标准、实施计划或 implementation code。

### 8. R10.4 stop-review

| 检查项 | 结果 |
|---|---|
| 是否完成性能结构性 sample、核心闭环不被外围阻断、availability / degraded / fail-closed 三类专项候选写入 | pass |
| 是否承接 NFR-ML-001~006、`04` §11、Step 6 dependency/marker/recovery、Step 8 环境和 Step 9 suite | pass |
| 是否明确 sample/trend 与硬阈值边界 | pass |
| 是否明确 P1/P2 selected-run 不计入 P0 closure | pass |
| 是否明确 formal marker/source 缺失时停审 | pass |
| 是否未写安全 / redaction / dependency boundary 正文 | pass |
| 是否未写 evidence schema、验收、缺陷管理、进入/退出准则或实施内容 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.5 安全 / redaction / dependency boundary 专项:先思考`;只允许思考 raw body / secret / full ref、artifact/archive body-free、越权持有、下游绕过 definition truth、observability 替代 truth、non-core sibling compile dependency、redaction/dependency suite 承接和 R10.6 写入边界;不得直接修改正式 `05-测试方案.md`;不得定义正式 evidence schema、artifact/report JSON 字段、验收标准、实施计划或 implementation code。

---

## R10.5 安全 / redaction / dependency boundary 专项:先思考

### 1. 当前模块目标

`R10.5` 只思考安全、redaction 和 dependency boundary 专项的输入边界、风险归类、负向触发、suite 承接、source gap 和 `R10.6` 写入边界。

当前模块不写最终专项测试矩阵,不定义 redaction scanner pattern、deny-list schema、dependency graph schema、manifest path schema、正式 evidence ID、artifact/report JSON schema、验收标准、CI YAML、required check 或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.6 |
| 用户确认 | 已确认从 `R10.4` 推进到 `R10.5`。 |
| 当前允许 | 思考 raw body / secret / full sensitive ref、artifact/archive body-free、越权持有、下游绕过 definition truth、observability 替代 truth、non-core sibling compile dependency、redaction/dependency suite 承接和 R10.6 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写 R10.6 专项候选表;定义 scanner / graph / artifact schema;新增 TC、DS、环境、profile、config key、port、mapper、state 或 phase boundary。 |

### 2. 当前专项输入承接

| 输入 | 必须承接 | R10.5 裁决 |
|---|---|---|
| NFR-ML-007 | 本仓不得越权拥有流程运行、成员状态、治理执行、外部能力注册、交易履约、UI 渲染、artifact/archive 正文或鉴权实现正文。 | 安全专项必须覆盖越权持有负向测试。 |
| NFR-ML-008 | 下游消费能力不得绕过本仓 definition truth 边界创建或修改方法资产定义。 | dependency / boundary 专项必须覆盖下游绕过 truth。 |
| NFR-ML-016 | observability、audit material 或 telemetry 只能支持观察和追溯,不能替代 definition truth。 | observability 替代 truth 归入安全边界红线。 |
| `02` body-free 处理流 | Inbound、Query、maintenance、publication 和 peripheral 路径不得引入 raw body、archive 内容、provider payload 或交易履约正文。 | R10.6 需要按入口面归并 body-free 专项。 |
| `03` observability / test cut | log、metric、trace、audit、operations fact、report 均 body-free / secret-free;metric low-cardinality;no synthetic marker。 | redaction / observability 边界必须可被扫描和断言。 |
| `04` sensitive / redaction / boundary | ordinary config/env/entry/job input 禁 raw secret/body;unsafe redaction fail-closed;body limit and report shell body-free。 | 不新增 secret provider schema,只验证 raw material 禁入和 fail-closed。 |
| Step 6 `REDACTION` / `SHELL` / `MARKER` | 已有 raw body、secret、adapter raw error、report artifact、public shell body-free、marker copy-only 用例。 | Step 10 不新增 TC,只汇总专项方向。 |
| Step 8 dependency matrix | 只有 `L0-core` / `core-contracts` 是 compile dependency candidate;其他 sibling repo 只能 runtime/event/replay/fake/controlled seam。 | dependency boundary 专项必须检查 non-core sibling compile dependency。 |
| Step 9 suite / checks | `redaction-boundary`、`dependency-boundary`、`observability-boundary` 和 release checks 已是候选 gate。 | R10.6 只能映射到既有 suite/check family,不定义脚本实现。 |

### 3. 安全红线风险归类思考

| 风险类 | 触发方向 | 应验证的判断 | R10.6 写入提醒 |
|---|---|---|---|
| 越权持有外部 / 下游 truth | 输入或存储流程运行、成员状态、治理执行、外部能力注册、交易履约、UI 渲染、artifact/archive 正文或鉴权实现正文。 | 请求被拒绝、进入 body-boundary violation 或只保留 safe ref / summary;本仓 truth 不被外部正文替代。 | 写成安全边界专项,不写上游对象 schema。 |
| 下游绕过 definition truth | downstream consumer、publisher/handoff callback、marketplace/console 或 runtime 尝试创建/修改方法资产定义。 | 下游只能通过 ref、summary、index、正式消费边界使用语义;不得写 definition truth。 | 与 R10.4 下游 unavailable 区分:本批关注绕过写入。 |
| raw body / secret / full sensitive ref 泄露 | config/env/job input、adapter raw error、provider response、report/artifact/log/trace/audit 输出 raw value。 | fail-closed / rejected / redaction clean;输出只含 safe issue/ref/digest/category。 | 不定义真实 secret、scanner pattern 或 deny-list schema。 |
| artifact/archive/report body 入仓 | artifact/archive 包体、evidence body、external document body、report body 被保存或作为证明。 | 只允许 ref / digest hint / marker / safe summary;raw body 不进入 truth、audit、report 或 generated artifact。 | schema 和 retention 留 Step 13。 |
| observability 替代 truth | log/metric/trace/audit/report 被用作 accepted truth、stored replay、marker source 或 recovery source。 | observability 只观察;accepted truth 只来自正式 UoW / stored surface / owning source。 | 与 R10.9/R10.10 观测专项交叉,本批只思考安全红线。 |
| marker / diagnostic 合成 | 从 raw adapter error、HTTP code、route param、topic、private map、metric/log 或 test helper 合成 public marker。 | marker copy-only;source missing 停审或 formal safe failure。 | 不补 marker source / mapper / port。 |

### 4. redaction / body-free 输出面思考

| 输出面 | 需要保护的材料 | 预期判断 | 禁止误用 |
|---|---|---|---|
| public command/query shell | raw method body、external body、artifact body、provider payload、secret、private adapter state。 | 只暴露 typed refs、safe summary、marker、state / outcome category。 | 把 response snapshot、旧 fingerprint 或 package body 当 safe output。 |
| inbound / outbound / handoff shell | raw payload、delivery receipt body、transport response、topic/private routing detail。 | envelope / receipt / outcome 只保留 safe refs、markers、counts、receipt refs。 | 用 delivery ack 证明 truth 或保存 receipt body。 |
| logs / diagnostics | raw exception text、SQL/HTTP body、endpoint、credential、token、stack with secret。 | safe issue/ref、redacted digest、category、operation family。 | 把 debug log 当证据或 marker source。 |
| metrics / traces / spans | high-cardinality refs、actor/subject ids、operation key、route param、free text、payload digest。 | low-cardinality labels and safe correlation refs only。 | 在 Step 10 定义 metric name/backend/schema。 |
| audit / operations fact | raw reason body、external document body、report body、provider response。 | refs-only audit,accepted fact 只来自 accepted UoW;job/outcome 是 operations fact。 | rejected/duplicate/query 伪造成 accepted audit。 |
| artifact / report direction | raw config files、secret、package body、external response body、evidence body。 | body-free report/artifact shell direction;redaction scan clean。 | 在本批定义 artifact JSON 字段或 retention。 |

### 5. dependency boundary 思考

| 依赖类型 | 当前允许 | 当前禁止 | R10.6 写入提醒 |
|---|---|---|---|
| compile dependency | 仅 `L0-core` / `core-contracts` 作为 candidate。 | process、identity、runtime、member-images、governance、artifact、archive、bus、observability、marketplace、console 等 sibling repo 进入 Cargo path dependency。 | 专项写“non-core sibling compile dependency 阻断”,不写 graph schema。 |
| runtime dependency | 通过 port、adapter、resolver、publisher、handoff、safe refs / summary 协作。 | 把 runtime adapter 可用性写成 compile dependency 或 truth owner。 | 与 R10.4 unavailable 区分:本批关注依赖类型越界。 |
| event collaboration | 通过 body-free envelope、dedup、safe marker、fixture/fake 承接。 | raw payload、topic/private broker detail 或 event schema 私补 truth。 | 不新增 event schema。 |
| replay dependency | 使用 de-identified replay root、stored surface、checkpoint/report refs。 | raw body、secret、provider response 或 evidence body 回放。 | 与 Step 8 replay 环境保持一致。 |
| local tool / check | dependency-boundary / redaction-boundary / observability-boundary check family。 | 在 Step 10 固定 manifest path、shell script body 或 generated graph fields。 | 实现细节后移。 |

### 6. suite / gate 承接思考

| 专项方向 | 候选 suite / gate | 承接方式 | R10.5 边界 |
|---|---|---|---|
| raw body / secret / full sensitive ref leak | `redaction-boundary`;release redaction boundary;`report-generation-audit` leak support。 | dummy leak corpus、observable output / report / artifact scan direction。 | raw leak 阻断;不定义 scanner pattern。 |
| public shell body-free | `contract-domain-fast`;`service-flow-fast`;`entry-worker-job`;`redaction-boundary`。 | public shell、receipt/outcome、trace/audit/report body-free assertions。 | 不新增 response schema。 |
| dependency boundary | `dependency-boundary`;release dependency boundary。 | only `core-contracts` compile dependency check direction。 | 非 core sibling compile dependency 阻断;不定义 graph schema。 |
| observability not truth | `observability-boundary`;`service-flow-fast`;`operations-replay-core` support。 | log/metric/trace/audit/report 不作为 truth/recovery/marker source。 | 详细观测专项留 R10.9/R10.10。 |
| marker copy-only / source missing stop | `infra-runtime-fake`;`fault-injection-matrix`;`dependency-boundary` support。 | formal marker/source 复制;source missing 停审。 | 不补 mapper/source。 |

### 7. source gap 与停审风险

| 风险 | 停审条件 | 处理 |
|---|---|---|
| redaction scanner 需要正式 pattern / deny-list 字段 | Step 10 需要字段级扫描规则才能判断,但 `03/04/09/13` 未闭合。 | 只写 redaction clean / raw leak 阻断方向;pattern/schema 留 owning step。 |
| dependency check 需要 manifest path / graph schema | 实现细节未由 Step 9/13/07 固定。 | 只写 only `core-contracts` compile dependency 方向。 |
| public shell 缺正式 DTO 字段 | 需要新增字段或改 DTO 才能断言。 | 回 `03` protocol/object owner,Step 10 不补 schema。 |
| marker source / mapper 缺失 | degraded/unavailable/diagnostic marker 需要正式来源但未闭合。 | 停审,不得从 raw error、log、HTTP code、route、private fake map 合成。 |
| observability 证据字段缺失 | 需要 log/metric/span/audit/report 字段级 schema。 | R10.9/R10.10 和 Step 13 承接,本批不补字段。 |
| 真实 secret / provider response 被要求作为测试数据 | 违反 Step 8 / `04` redaction 边界。 | 使用 dummy leak corpus / safe fixture direction;不得使用真实 secret/body。 |

### 8. R10.6 写入边界

R10.6 可以写入:

1. 安全 / 越权持有专项候选表。
2. redaction / body-free 输出面专项候选表。
3. dependency boundary 专项候选表。
4. observability not truth / marker copy-only 交叉专项候选表。
5. suite / gate 承接候选表。
6. 阈值 / 通过条件来源和禁止硬化表。
7. 本批 stop-review 和 `R10.7 一致性 / 幂等 / 恢复专项:先思考` 进入门禁。

R10.6 禁止写入:

1. redaction scanner pattern、deny-list schema、dependency graph schema、manifest path schema、metric name、trace/span schema 或 artifact/report JSON 字段。
2. 新增 TC、DS、环境、profile、config key、secret provider、marker source、port、mapper、state、DTO 字段或 phase boundary。
3. CI YAML、脚本实现、required check、实现仓测试函数名、验收标准、缺陷分级、进入/退出准则、证据归档规则或 implementation code。
4. 修改正式 `05-测试方案.md`、`06-验收标准.md` 或 `07-实施计划.md`。
5. 写 R10.7 / R10.8 一致性、幂等和恢复正文。

### 9. R10.5 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考安全 / redaction / dependency boundary 专项 | pass |
| 是否承接 NFR-ML-007~008、NFR-ML-016、`02/03/04` body-free / redaction / dependency 边界 | pass |
| 是否承接 Step 6 redaction / dependency / marker 用例族、Step 8 环境依赖矩阵和 Step 9 suite / check family | pass |
| 是否识别 raw body / secret / full sensitive ref、artifact/archive body-free、越权持有、下游绕过 truth 和 observability 替代 truth | pass |
| 是否识别 only `core-contracts` compile dependency 和 non-core sibling compile dependency 阻断方向 | pass |
| 是否形成 source gap / 停审风险和 R10.6 写入边界 | pass |
| 是否未定义 scanner / graph / artifact schema、TC、DS、config key、port、mapper、state 或 implementation code | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.6 安全 / redaction / dependency boundary 专项:再写入`;只允许写入安全 / 越权持有专项候选表、redaction / body-free 输出面专项候选表、dependency boundary 专项候选表、observability not truth / marker copy-only 交叉专项候选表、suite / gate 承接候选表、阈值 / 通过条件来源和禁止硬化表、本批 stop-review 和 `R10.7 一致性 / 幂等 / 恢复专项:先思考` 进入门禁;不得直接修改正式 `05-测试方案.md`;不得定义正式 evidence schema、artifact/report JSON 字段、验收标准、实施计划或 implementation code。

---

## R10.6 安全 / redaction / dependency boundary 专项:再写入

### 1. 当前模块写入目标

`R10.6` 将 R10.5 的思考固化为安全 / redaction / dependency boundary 专项候选矩阵。当前模块只写安全 / 越权持有、redaction / body-free 输出面、dependency boundary、observability not truth / marker copy-only、suite / gate 承接、阈值 / 通过条件来源和禁止硬化、本批 stop-review 和 `R10.7` 进入门禁。

当前模块不定义 redaction scanner pattern、deny-list schema、dependency graph schema、manifest path schema、metric name、trace/span schema、artifact/report JSON 字段、正式 evidence ID、验收标准、实施计划、CI YAML、required check 或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.7 |
| 用户确认 | 已确认从 `R10.5` 推进到 `R10.6`。 |
| 当前允许 | 写入安全 / 越权持有专项候选表、redaction / body-free 输出面专项候选表、dependency boundary 专项候选表、observability not truth / marker copy-only 交叉专项候选表、suite / gate 承接候选表、阈值 / 通过条件来源和禁止硬化表、stop-review 和 R10.7 进入门禁。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;定义 scanner / graph / artifact schema;新增 TC、DS、环境、profile、config key、secret provider、marker source、port、mapper、state、DTO 字段或 phase boundary。 |

### 2. 安全 / 越权持有专项候选表

| 专项候选 | 指标 / 风险 | 方法 | 环境 | 阈值 / 通过条件 | 证据方向 |
|---|---|---|---|---|---|
| unauthorized-external-truth-ownership | 本仓越权持有流程运行、成员状态、治理执行、外部能力注册、交易履约、UI 渲染、artifact/archive 正文或鉴权实现正文。 | 构造外部 / 下游 truth 或正文进入 definition / formalization / consumption / audit 的负向输入。 | `ci-test`;`integration-like` controlled seam。 | 请求 rejected / boundary violation / safe summary only;本仓 definition truth 不被外部正文或运行 truth 替代。 | `contract-domain-fast` / `service-flow-fast` / `redaction-boundary` report direction。 |
| downstream-bypass-definition-truth | downstream consumer、publisher/handoff callback、marketplace/console 或 runtime 绕过本仓 definition truth 创建或修改方法资产定义。 | 在 downstream callback / controlled seam / handoff outcome 中注入修改 definition truth 的尝试。 | `integration-like`;`operations-replay`。 | 下游只能使用 ref、summary、index 或正式消费边界;不得写 definition truth、formal version truth 或 catalog truth。 | `service-flow-fast` / `operations-replay-core` report direction。 |
| forbidden-boundary-override | 配置、entry-local selector、job input 或 operator 参数尝试放宽 truth owner、body-free、query no-write、stored replay、marker source。 | 构造 forbidden boundary override / unsafe redaction relax / hot change attempt。 | `ci-test`;release config direction。 | change rejected and not active;不得 force apply、silent fallback 或 half-assembled facade。 | `config-redline` / release config redline direction。 |
| artifact-archive-body-as-proof | artifact/archive 包体、evidence body、external document body 或 report body 被当作 definition proof。 | 输入 artifact/archive body 或 evidence body,验证只可承接 ref / digest hint / marker / safe summary。 | `ci-test`;`operations-replay`。 | raw body 不进入 truth、audit、stored result、report 或 generated artifact。 | `redaction-boundary` / `report-generation-audit` direction;字段留 Step 13。 |

### 3. redaction / body-free 输出面专项候选表

| 输出面专项 | 指标 / 风险 | 方法 | 环境 | 阈值 / 通过条件 | 证据方向 |
|---|---|---|---|---|---|
| public-shell-body-free | public command/query shell 泄露 raw method body、external body、artifact body、provider payload、secret 或 private adapter state。 | 组装 definition / catalog / consumption / trace / handoff public surface 并执行 body-free assertion。 | `ci-test`。 | surface 只包含 typed refs、safe summary、marker、state / outcome category。 | `contract-domain-fast` / `service-flow-fast` / `redaction-boundary` direction。 |
| inbound-outbound-handoff-body-free | inbound/outbound/handoff shell 泄露 raw payload、delivery receipt body、transport response 或 private routing detail。 | 执行 inbound intake、publication outcome、handoff outcome 的 negative body fixture。 | `integration-like`;`operations-replay`。 | envelope / receipt / outcome 只保留 safe refs、markers、counts、receipt refs;delivery ack 不证明 truth。 | `entry-worker-job` / `operations-replay-core` direction。 |
| diagnostic-log-redaction | logs / diagnostics 泄露 raw exception text、SQL/HTTP body、endpoint、credential、token 或 secret-bearing stack。 | 使用 dummy leak corpus 触发 adapter failure、config failure、job failure 和 diagnostic output。 | `ci-test`;release redaction direction。 | 输出 safe issue/ref、redacted digest、category、operation family;raw leak 阻断。 | `redaction-boundary` / release redaction check direction。 |
| audit-report-artifact-body-free | audit、operations fact、report 或 generated artifact 保存 raw reason body、external document body、provider response、raw config 或 package body。 | 检查 accepted/rejected/duplicate/query/job/publication/report candidate output。 | `ci-test`;`operations-replay`。 | accepted fact 只来自 accepted UoW;job/outcome 是 operations fact;report/artifact body-free。 | `report-generation-audit` / `redaction-boundary` direction;schema 留 Step 13。 |

### 4. dependency boundary 专项候选表

| 专项候选 | 指标 / 风险 | 方法 | 环境 | 阈值 / 通过条件 | 证据方向 |
|---|---|---|---|---|---|
| compile-dependency-only-core-contracts | 非 `L0-core` / `core-contracts` sibling repo 成为 Cargo compile dependency。 | dependency metadata / generated graph check direction,审计 workspace / manifest 依赖类型。 | `ci-test`;local tool direction;release gate。 | only `core-contracts` compile dependency candidate;non-core sibling compile dependency 阻断。 | `dependency-boundary` / release dependency boundary report direction。 |
| runtime-seam-not-compile | runtime adapter、resolver、publisher、handoff、marketplace、console 或 downstream relation 被升级为 compile dependency。 | controlled seam 测试与 dependency check 联合判断依赖类型。 | `ci-test`;`integration-like`。 | runtime/event/handoff/downstream 只能经 port、adapter、event、safe ref / summary / fake seam 协作。 | `dependency-boundary` + `infra-runtime-fake` direction。 |
| event-replay-body-free-dependency | event/replay dependency 通过 raw payload、topic/private broker detail、raw body、secret、provider response 或 evidence body 建立事实。 | 用 event fixture / replay root negative case 验证 body-free and de-identified boundary。 | `ci-test`;`operations-replay`。 | event/replay 只承接 body-free envelope、dedup、safe marker、de-identified replay root、stored surface、checkpoint/report refs。 | `entry-worker-job` / `operations-replay-core` / `redaction-boundary` direction。 |
| dependency-check-no-schema-hardening | dependency boundary 需要 manifest path / graph schema 才能执行时,测试方案自行补字段。 | design review gate 检查本 Step 是否发明 graph fields。 | design review;`ci-test` direction。 | 本 Step 只保留 only-core direction;graph schema 留 Step 9/13/07 owning source。 | design review note;不生成正式 artifact schema。 |

### 5. observability not truth / marker copy-only 交叉专项候选表

| 专项候选 | 指标 / 风险 | 方法 | 环境 | 阈值 / 通过条件 | 证据方向 |
|---|---|---|---|---|---|
| observability-not-definition-truth | log、metric、trace、audit、report 或 telemetry 被用作 accepted truth、stored replay、recovery source 或 marker source。 | 构造 current truth missing / stored surface missing / marker source missing 分支,验证 observability 不补真相。 | `ci-test`;`operations-replay`。 | accepted truth 只来自正式 UoW / stored surface / owning source;observability 只观察。 | `observability-boundary` / `operations-replay-core` direction。 |
| marker-copy-only-boundary | public degraded / unavailable / failed marker 从 raw adapter error、HTTP code、route param、topic、private map、metric/log 或 test helper 合成。 | 触发 resolver / adapter / handoff / diagnostic unavailable branch。 | `integration-like`;nightly fault matrix direction。 | marker 复制 formal source;source missing 停审或 formal safe failure。 | `infra-runtime-fake` / `fault-injection-matrix` direction。 |
| diagnostic-not-proof | safe diagnostic、redacted issue、report issue 或 metric label 被当作 accepted proof。 | 对 accepted/rejected/duplicate/query/job 分支分别检查 proof source。 | `ci-test`;`operations-replay`。 | diagnostic 只能辅助定位;不能证明 accepted truth、delivery truth 或 recovery success。 | `service-flow-fast` / `report-generation-audit` direction。 |

### 6. suite / gate 承接候选表

| 专项方向 | Primary suite / gate | Secondary suite / gate | P0 阻断方向 | 禁止 |
|---|---|---|---|---|
| 安全 / 越权持有 | `contract-domain-fast`;`service-flow-fast` | `release-main-smoke` representative | 禁止外部 / 下游 truth 或正文写入本仓 truth。 | 用 release smoke 替代底层负向断言。 |
| raw body / secret / full sensitive ref | `redaction-boundary` | release redaction boundary;`report-generation-audit` leak support | raw leak 命中即阻断。 | 降级为 warning 或要求真实 secret。 |
| public / audit / report body-free | `redaction-boundary`;`service-flow-fast` | `entry-worker-job`;`operations-replay-core`;`report-generation-audit` | body-free 断言失败阻断。 | 定义 artifact/report JSON 字段。 |
| dependency boundary | `dependency-boundary` | release dependency boundary | 非 `core-contracts` sibling compile dependency 阻断。 | 定义 graph schema 或 manifest path。 |
| observability not truth / marker copy-only | `observability-boundary`;`infra-runtime-fake` | `operations-replay-core`;nightly `fault-injection-matrix` | observability 替代 truth、synthetic marker 或 source-missing 私补阻断。 | 用 log/metric/private map 证明 marker 或 accepted truth。 |

### 7. 阈值 / 通过条件来源和禁止硬化表

| 条件 / 阈值类型 | 当前可否硬化 | 来源 / 原因 | R10.6 裁决 |
|---|---|---|---|
| no raw body / secret / full sensitive ref in outputs | 可作为 P0 阻断方向 | NFR-ML-007~008、`03` observability / test cut、`04` redaction、Step 6 redaction 用例、Step 9 redaction-boundary。 | 写入专项候选。 |
| only `core-contracts` compile dependency | 可作为 P0 阻断方向 | Step 8 dependency matrix、Step 9 dependency-boundary、全局 dependency discipline。 | 写入专项候选。 |
| observability not truth | 可作为 P0 阻断方向 | NFR-ML-016、`03` observability / recovery / stored surface 边界。 | 写入交叉专项候选。 |
| marker copy-only / source missing stop | 可作为 P0 阻断方向,但依赖 formal source | Step 6 marker 用例、`03/04` marker source redline。 | formal source 缺失时停审,不得补口。 |
| redaction scanner pattern / deny-list 字段 | 不可在本批硬化 | Step 10 不拥有 scanner schema。 | 留 Step 9/13/07 或 owning source。 |
| dependency graph schema / manifest path | 不可在本批硬化 | Step 10 只定义专项方向。 | 留 Step 9/13/07 或 implementation plan。 |
| artifact/report/case/assertion 字段 | 不可在本批硬化 | Step 13 owns evidence schema。 | 只写证据方向。 |
| acceptance verdict / release veto | 不可在本批硬化 | `06-验收标准.md` owns。 | Step 10 不写 verdict。 |

### 8. R10.7 进入门禁

| 门禁项 | 裁决 |
|---|---|
| R10.6 是否只写安全 / redaction / dependency boundary 专项候选 | pass |
| 是否写入安全 / 越权持有专项候选表 | pass |
| 是否写入 redaction / body-free 输出面专项候选表 | pass |
| 是否写入 dependency boundary 专项候选表 | pass |
| 是否写入 observability not truth / marker copy-only 交叉专项候选表 | pass |
| 是否写入 suite / gate 承接候选表 | pass |
| 是否写入阈值 / 通过条件来源和禁止硬化表 | pass |
| 是否避免 scanner / graph / artifact schema、metric / trace schema、TC、DS、config key、port、mapper、state 和 implementation code | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

进入 `R10.7 一致性 / 幂等 / 恢复专项:先思考` 时,只允许思考 duplicate no-rerun、query no-write、commit unknown、UoW rollback、stored surface missing、version conflict、job no truth repair、publisher/handoff failed、source missing stop、fault injection、suite 承接和 R10.8 写入边界;不得直接修改正式 `05-测试方案.md`;不得定义正式 evidence schema、artifact/report JSON 字段、验收标准、实施计划或 implementation code。

### 9. R10.6 stop-review

| 检查项 | 结果 |
|---|---|
| 是否完成安全 / 越权持有、redaction / body-free、dependency boundary、observability not truth / marker copy-only 专项候选写入 | pass |
| 是否承接 NFR-ML-007~008、NFR-ML-016、`02/03/04` body-free / redaction / dependency 边界 | pass |
| 是否承接 Step 6 redaction / dependency / marker 用例族、Step 8 环境依赖矩阵和 Step 9 suite / check family | pass |
| 是否明确 raw leak、non-core compile dependency、observability truth 替代、synthetic marker 均为阻断方向 | pass |
| 是否明确 scanner pattern、dependency graph schema、artifact/report 字段和 acceptance verdict 后移 | pass |
| 是否未写 R10.7 / R10.8 一致性、幂等和恢复正文 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.7 一致性 / 幂等 / 恢复专项:先思考`;只允许思考 duplicate no-rerun、query no-write、commit unknown、UoW rollback、stored surface missing、version conflict、job no truth repair、publisher/handoff failed、source missing stop、fault injection、suite 承接和 R10.8 写入边界;不得直接修改正式 `05-测试方案.md`;不得定义正式 evidence schema、artifact/report JSON 字段、验收标准、实施计划或 implementation code。

---

## R10.7 一致性 / 幂等 / 恢复专项:先思考

### 1. 当前模块目标

`R10.7` 只思考一致性、幂等和恢复专项的输入边界、风险归类、故障触发、suite 承接、source gap 和 `R10.8` 写入边界。

当前模块不写最终专项测试矩阵,不定义正式 evidence ID、artifact/report JSON schema、case JSON schema、assertion item key、checkpoint/report 字段、stored surface 字段、验收标准、CI YAML、required check、实现仓测试函数名或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.8 |
| 用户确认 | 已确认从 `R10.6` 推进到 `R10.7`。 |
| 当前允许 | 思考 duplicate no-rerun、query no-write、commit unknown、UoW rollback、stored surface missing、version conflict、job no truth repair、publisher/handoff failed、source missing stop、fault injection、suite 承接和 R10.8 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写 R10.8 专项候选表;定义 stored surface / checkpoint / report / artifact schema;新增 TC、DS、环境、profile、config key、marker source、port、mapper、state 或 phase boundary。 |

### 2. 当前专项输入承接

| 输入 | 必须承接 | R10.7 裁决 |
|---|---|---|
| NFR-ML-012 | 方法资产定义真相在平台范围内保持单一正式语义。 | 一致性专项必须证明重复执行、恢复和观测材料不会制造第二 truth。 |
| NFR-ML-013 | 重复读取、重复变化感知、重复证据线索查看或后台维护不得改变定义正文或制造重复正式语义。 | 幂等专项必须覆盖 duplicate no-rerun、query no-write、job no truth repair。 |
| NFR-ML-014 | 正式版本语义变化必须显式、可区分,不得静默覆盖既有正式引用含义。 | version conflict / expected_version / race 必须防 lost update 和 silent overwrite。 |
| NFR-ML-016 | observability、audit material 或 telemetry 不能替代 definition truth。 | recovery proof 不得来自 log、metric、trace、diagnostic、timeout 或 private flag。 |
| `03-详细设计.md` §10~§12 | UoW atomicity、stored replay、commit unknown、expected_version、checkpoint resume、duplicate replay。 | R10.8 可写专项候选,但不能补 persistence schema 或 replay store 字段。 |
| `03-详细设计.md` §14~§16 | no synthetic marker、query no-write、duplicate no-rerun、post-commit failure no rollback、source-missing stop。 | 一致性专项必须把这些列为阻断方向。 |
| `04-配置设计.md` §4 / §11 | 配置不得关闭 stored replay / no-rerun;publisher / handoff failed 不回滚 truth。 | 配置失效和 target failed 只作为故障触发,不新增配置 key。 |
| Step 6 用例 | `TC-ML-IDEMP-*`、`TC-ML-RECOVERY-*`、`TC-ML-REPLAY-*`、`TC-ML-UOW-*`、`TC-ML-JOB-*`、`TC-ML-DEPENDENCY-003`、`TC-ML-MARKER-002`。 | R10.8 汇总专项方向,不得新增或改号 TC。 |
| Step 8 环境 | `ci-test`、`integration-like`、`operations-replay` 支撑 fake UoW、controlled seam、stored replay、checkpoint/report、publisher/handoff failed。 | 不要求真实 DB、broker、scheduler 或 production-like 作为 P0。 |
| Step 9 suite | `service-flow-fast`、`infra-runtime-fake`、`operations-replay-core`、`operations-replay-extended`、`fault-injection-matrix`、`entry-worker-job`。 | 只能映射既有 suite/gate family,不写 CI command 或脚本实现。 |

### 3. 一致性 / 幂等风险归类思考

| 风险类 | 触发方向 | 应验证的判断 | R10.8 写入提醒 |
|---|---|---|---|
| duplicate no-rerun | command / inbound / job 使用相同 operation/source/run key 和 same digest 重放。 | 只复制 stored result / receipt / report / checkpoint;不重跑 mutation、adapter source、job body 或 event candidate assembly。 | 写成幂等专项候选;不定义 stored surface 字段。 |
| same key different digest | command 或 source key 已 completed,新请求 digest 不同。 | 返回 conflict / safe rejection;不覆盖原 stored surface,不执行第二 mutation。 | 保持与 `TC-ML-IDEMP-002` 对齐。 |
| query no-write | query visible / degraded / empty / stale / trace/audit/report read 分支被诱导刷新 material、append audit、启动 job 或 reserve idempotency。 | Query 只能读取和组装 public surface;不得写 truth、material、trace/audit、event candidate、job 或 idempotency guard。 | 写成一致性红线,不补 query DTO 字段。 |
| stored surface missing | guard completed 但 stored result / receipt / report missing、wrong-kind 或 unreadable。 | 进入 manual / consistency-safe surface 或 formal safe failure;不从 current truth、query surface、log、metric、adapter note 重建。 | 只写专项方向;manual issue / artifact 字段留 Step 13。 |
| version conflict / race | 两个写路径持有同一 expected_version 或语义变化并发。 | 一个成功,另一个 safe conflict / reload-required;不得 lost update 或 silent overwrite。 | 不把 checkpoint、page cursor、timestamp 或 source cursor 当 optimistic version。 |

### 4. 恢复与事务风险思考

| 风险类 | 触发方向 | 应验证的判断 | R10.8 写入提醒 |
|---|---|---|---|
| UoW atomic commit | accepted command 保存 truth/support/material、stored result、trace/audit/lineage refs、candidate refs。 | 同一 logical boundary 要么全部可见,要么全部不可见。 | 写 accepted atomicity 专项候选。 |
| UoW rollback / no-commit | accepted transaction 内注入 repository、stored result、candidate、audit 或 lineage 保存失败。 | rollback 后无 accepted truth、stored result、candidate、audit、trace、publication outcome 残留。 | 不用 log/metric/private flag 证明 rollback。 |
| commit unknown | commit 返回 unknown 或 transport/runtime timeout。 | 只能依据 stored surface、formal read-back 或正式 recovery source 判断;不能私判成功或失败。 | 与 `TC-ML-RECOVERY-001/003` 对齐,避免重复发明场景。 |
| post-commit publisher / handoff failed | accepted truth 已提交后 publisher 或 handoff target failed/unavailable。 | failure 不回滚 accepted truth、stored result、receipt、report 或 checkpoint;只记录 failed marker / delayed outcome / report issue。 | 与 R10.4 availability、R10.6 boundary 交叉,本批关注 no rollback。 |
| source missing stop | marker、mapper、checkpoint、report、handoff outcome 或 recovery source 缺失。 | 停审回 owning design source,或返回 formal safe failure;不得 fixture/private fake map/raw string/synthetic marker 私补。 | 与 `TC-ML-MARKER-002` 对齐。 |

### 5. operations job / replay 思考

| job / replay 风险 | 触发方向 | 应验证的判断 | 禁止误用 |
|---|---|---|---|
| job duplicate replay | completed job run key 重放。 | 返回 stored report / progress summary;不重跑 job body、不刷新 material、不创建第二 report / issue / handoff candidate。 | 用 current material scan 重建 report。 |
| checkpoint resume | job interrupted / partial 后 resume。 | 只能从 formal checkpoint / progress / report / issue source 继续。 | 用 scheduler lease、queue offset、timestamp、current material scan 或 adapter note 替代 checkpoint。 |
| partial failure | refresh / reconciliation / handoff job 中部分 item failed。 | 记录 safe issue / report summary / counters;继续边界必须来自正式 issue/progress。 | 保存 raw report body、external payload、stack 或 provider response。 |
| no truth repair | core truth 缺失、损坏或与 derived material 不一致。 | job 只写 derived material、progress、checkpoint、report、issue;不得创建、更新、删除或修复 core definition truth。 | 把 reconciliation 写成 truth repair worker。 |
| report missing / corrupt | stored report 或 checkpoint report source 缺失。 | 进入 blocked / manual / consistency-safe;不从 logs、artifact body 或 scheduler state 补 report。 | 在 Step 10 发明 report JSON schema。 |

### 6. fault injection 能力思考

| 故障注入方向 | 候选环境 | 需要观察的断言 | R10.7 边界 |
|---|---|---|---|
| fake UoW save / commit failure | `ci-test`;`infra-runtime-fake` | rollback no residue;accepted surface 不半提交。 | 不定义 durable DB isolation 或 physical lock。 |
| stored result / receipt / report missing | `operations-replay`;`ci-test` | duplicate / recovery 进入 manual / consistency-safe;no current truth rebuild。 | 不定义 stored surface schema。 |
| expected_version race | `ci-test`;`infra-runtime-fake` | safe conflict / reload-required;no lost update。 | 不写线程模型或 lock table。 |
| publisher / handoff failed | `integration-like`;`operations-replay` | accepted truth no rollback;failed / pending / report issue only。 | 不保存 transport response body。 |
| checkpoint missing / corrupt | `operations-replay` | resume blocked / manual;lease/offset 不替代 checkpoint。 | 不定义 checkpoint JSON 字段。 |
| source missing / marker missing | `integration-like`;nightly fault matrix | source-missing stop;no synthetic marker/private fallback。 | 不补 marker source、mapper、port 或 state。 |
| commit unknown | `ci-test`;nightly fault matrix | formal recovery source only;no timeout/log/private flag proof。 | 不定义 retry policy、backoff 或 TTL。 |

### 7. suite / gate 承接思考

| 专项方向 | Primary suite / gate | Secondary suite / gate | R10.7 判断 |
|---|---|---|---|
| duplicate command / inbound / job no-rerun | `service-flow-fast`;`operations-replay-core` | `operations-replay-extended` | fast/core 必须覆盖 stored replay 主判断;extended 只补重场景。 |
| query no-write | `service-flow-fast` | `contract-domain-fast`;`release-main-smoke` representative | release smoke 不替代 service-flow。 |
| UoW rollback / atomicity | `infra-runtime-fake`;`service-flow-fast` | `fault-injection-matrix` | fake UoW 与 write spy 是 P0 deterministic 主手段。 |
| commit unknown / stored surface missing | `operations-replay-core` | `fault-injection-matrix`;`operations-replay-extended` | 不得用 timeout/log/private flag 作为 proof。 |
| version conflict / race | `infra-runtime-fake`;`service-flow-fast` | nightly extended sample | expected_version 语义为主,不锁 DB lock 实现。 |
| job no truth repair / checkpoint resume | `operations-replay-core` | `operations-replay-extended`;`report-generation-audit` support | operations job 不修 core truth,report schema 留 Step 13。 |
| publisher / handoff failed no rollback | `entry-worker-job`;`infra-runtime-fake` | `fault-injection-matrix`;`operations-replay-core` | failed outcome 不回滚 accepted truth;delivered 不证明 downstream truth。 |

### 8. source gap 与停审风险

| 风险 | 停审条件 | 处理 |
|---|---|---|
| stored surface 字段不闭合 | 专项断言需要 result / receipt / report / checkpoint 字段级 schema。 | R10.8 只写 stored surface direction;字段留 owning design / Step 13。 |
| recovery source 不闭合 | commit unknown 或 stored missing 需要正式 source,但 `03/04` 没有来源。 | 停审;不得用 log、timeout、metric、adapter note 或 private flag 私判。 |
| marker / mapper 来源不闭合 | failed/degraded/unavailable/manual marker 需要正式来源。 | 回 owning design source;不得 synthetic marker。 |
| checkpoint/report source 不闭合 | job resume 或 report replay 需要 checkpoint/report 来源,但缺正式 port/object。 | 停审;不得用 scheduler lease、queue offset、current material scan。 |
| fault injection 需要真实产品 | P0 要求真实 DB/broker/provider 才能复现。 | 降为 P1/P2 selected-run residual;P0 使用 fake/controlled/replay。 |
| acceptance / release veto 需要裁决 | 专项失败是否阻断 release 或如何签收。 | Step 12 / `06-验收标准.md` owns;R10.7 不写 verdict。 |
| evidence/report 字段需要正式 schema | 需要 artifact/report/case/assertion 字段证明专项。 | Step 13 owns;R10.7 不写 schema。 |

### 9. R10.8 写入边界

R10.8 可以写入:

1. 一致性 / 幂等专项候选表:duplicate no-rerun、same-key conflict、query no-write、stored surface missing、version conflict。
2. 事务 / 恢复专项候选表:UoW atomicity、rollback no residue、commit unknown formal recovery source、post-commit failure no rollback、source missing stop。
3. operations job / replay 专项候选表:job duplicate stored report、checkpoint resume、partial failure safe issue、no truth repair、report missing / corrupt。
4. fault injection 候选表和 suite / gate 承接表。
5. 阈值 / 通过条件来源和禁止硬化表。
6. 本批 stop-review 和 `R10.9 可观测性 / 审计 / report pairing 专项:先思考` 进入门禁。

R10.8 禁止写入:

1. stored surface、checkpoint、report、artifact、case、assertion、metric、trace/span 或 diagnostic 字段级 schema。
2. 新增 TC、DS、环境、profile、config key、retry policy、TTL、lock table、marker source、port、mapper、state、DTO 字段或 phase boundary。
3. CI YAML、脚本实现、required check、实现仓测试函数名、验收标准、缺陷分级、进入/退出准则、证据归档规则或 implementation code。
4. 修改正式 `05-测试方案.md`、`06-验收标准.md` 或 `07-实施计划.md`。
5. 写 R10.9/R10.10 可观测性、审计和 report pairing 正文。

### 10. R10.7 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考一致性 / 幂等 / 恢复专项 | pass |
| 是否承接 NFR-ML-012~014、NFR-ML-016 和 `03` transaction / recovery / idempotency / observability test cut | pass |
| 是否承接 Step 6 `IDEMP` / `RECOVERY` / `REPLAY` / `UOW` / `JOB` / `DEPENDENCY` / `MARKER` 用例族 | pass |
| 是否识别 duplicate no-rerun、query no-write、stored surface missing、version conflict 和 no current truth rebuild | pass |
| 是否识别 UoW rollback、commit unknown、publisher/handoff failed no rollback、source missing stop | pass |
| 是否识别 job duplicate replay、checkpoint resume、partial failure 和 no truth repair | pass |
| 是否形成 fault injection、suite 承接、source gap / 停审风险和 R10.8 写入边界 | pass |
| 是否未定义 stored surface / checkpoint / report / artifact schema、TC、DS、config key、port、mapper、state 或 implementation code | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.8 一致性 / 幂等 / 恢复专项:再写入`;只允许写入一致性 / 幂等专项候选表、事务 / 恢复专项候选表、operations job / replay 专项候选表、fault injection 候选表、suite / gate 承接表、阈值 / 通过条件来源和禁止硬化表、本批 stop-review 和 `R10.9 可观测性 / 审计 / report pairing 专项:先思考` 进入门禁;不得直接修改正式 `05-测试方案.md`;不得定义正式 evidence schema、artifact/report JSON 字段、验收标准、实施计划或 implementation code。

---

## R10.8 一致性 / 幂等 / 恢复专项:再写入

### 1. 当前模块写入目标

`R10.8` 将 R10.7 的思考固化为一致性 / 幂等 / 恢复专项候选矩阵。当前模块只写一致性 / 幂等专项候选表、事务 / 恢复专项候选表、operations job / replay 专项候选表、fault injection 候选表、suite / gate 承接表、阈值 / 通过条件来源和禁止硬化表、本批 stop-review 和 `R10.9` 进入门禁。

当前模块不定义 stored surface、checkpoint、report、artifact、case、assertion、metric、trace/span 或 diagnostic 字段级 schema,不定义正式 evidence ID、验收标准、实施计划、CI YAML、required check、实现仓测试函数名或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.9 |
| 用户确认 | 已确认从 `R10.7` 推进到 `R10.8`。 |
| 当前允许 | 写入一致性 / 幂等专项候选表、事务 / 恢复专项候选表、operations job / replay 专项候选表、fault injection 候选表、suite / gate 承接表、阈值 / 通过条件来源和禁止硬化表、stop-review 和 R10.9 进入门禁。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;定义 stored surface / checkpoint / report / artifact schema;新增 TC、DS、环境、profile、config key、retry policy、TTL、lock table、marker source、port、mapper、state、DTO 字段或 phase boundary。 |

### 2. 一致性 / 幂等专项候选表

| 专项候选 | 指标 / 风险 | 方法 | 环境 | 阈值 / 通过条件 | 证据方向 |
|---|---|---|---|---|---|
| duplicate-command-inbound-job-no-rerun | command、inbound 或 job duplicate 重新执行业务 mutation、source adapter、job body、event candidate assembly 或 audit append。 | 使用 same operation/source/run key + same digest 重放已完成分支,并观察 stored surface replay 和写入 spy。 | `ci-test`;`operations-replay`。 | 只复制 stored result / receipt / report / checkpoint;无第二 truth mutation、adapter scan、job body、candidate 或 accepted audit。 | `service-flow-fast` / `operations-replay-core` report direction。 |
| same-key-different-digest-conflict | 同一 key 不同 digest 覆盖原 stored surface 或静默接受第二语义变化。 | 构造 completed guard 后提交 different digest。 | `ci-test`。 | 返回 conflict / safe rejection;原 stored surface 不被覆盖;不执行第二 mutation。 | `service-flow-fast` report direction。 |
| query-no-write | query visible / degraded / empty / stale / trace / audit / report read 分支执行 hidden write、material refresh、audit append、event candidate 或 job start。 | 对 query flow 加 write guard / spy,覆盖 visible、empty、degraded、stale 和 page read candidate。 | `ci-test`;`integration-like` controlled seam。 | Query 只读取和组装 public surface;不得写 truth、material、trace/audit、event candidate、job 或 idempotency guard。 | `service-flow-fast` / `observability-boundary` support direction。 |
| stored-surface-missing-no-current-truth-rebuild | completed guard 存在但 stored result / receipt / report missing、wrong-kind 或 unreadable 时,从 current truth、query surface、log、metric 或 adapter note 重建响应。 | 注入 missing / wrong-kind stored surface 后执行 duplicate replay / recovery read。 | `operations-replay`;`ci-test` deterministic subset。 | 返回 manual / consistency-safe surface 或 formal safe failure;不得重读 current truth 重建 stored response/report。 | `operations-replay-core` / `fault-injection-matrix` direction。 |
| version-conflict-no-lost-update | 并发语义变化或正式版本变化发生 lost update、silent overwrite 或 cursor/checkpoint/timestamp 替代 optimistic version。 | 两个写路径加载同一 expected_version 后并发保存。 | `ci-test`;`infra-runtime-fake`。 | 一个成功,另一个 safe conflict / reload-required;不得用 checkpoint、page cursor、timestamp 或 source cursor 当 version guard。 | `infra-runtime-fake` / `service-flow-fast` direction。 |

### 3. 事务 / 恢复专项候选表

| 专项候选 | 指标 / 风险 | 方法 | 环境 | 阈值 / 通过条件 | 证据方向 |
|---|---|---|---|---|---|
| accepted-uow-atomicity | accepted truth/support/material、stored result、trace/audit/lineage refs、candidate refs 半提交。 | accepted command happy path 加 repository / store / candidate write spy,检查 logical boundary。 | `ci-test`;`infra-runtime-fake`。 | accepted side effects 要么全部可见,要么全部不可见;不得出现 only truth、only stored result、only candidate 或 only audit。 | `service-flow-fast` / `infra-runtime-fake` direction。 |
| rollback-no-accepted-residue | transaction 内 repository / stored result / candidate / audit / lineage save failure 后残留 accepted truth 或 outcome。 | 在 accepted path 中注入 save / commit failure。 | `ci-test`;`infra-runtime-fake`;nightly fault matrix。 | rollback 后无 accepted truth、stored result、candidate、audit、trace、publication outcome 或 job outcome 残留。 | `infra-runtime-fake` / `fault-injection-matrix` direction。 |
| commit-unknown-formal-recovery-source-only | commit unknown 或 timeout 后用 log、metric、timeout、adapter note、private flag 私判成功。 | 注入 commit unknown,控制 stored surface / formal read-back / formal recovery source 存在或缺失。 | `ci-test`;nightly fault matrix。 | 只能依据 stored surface、formal read-back 或正式 recovery source 判断;source 缺失进入 manual / consistency-safe。 | `fault-injection-matrix` / `operations-replay-core` direction。 |
| post-commit-publisher-handoff-failed-no-rollback | accepted truth 已提交后 publisher / handoff target failed 导致 truth、stored result、receipt、report 或 checkpoint 回滚。 | accepted command 或 completed job 后注入 publisher / handoff failed / unavailable。 | `integration-like`;`operations-replay`。 | failure 只产生 failed marker、delayed / pending outcome 或 report issue;不回滚 accepted truth / stored surface。 | `entry-worker-job` / `operations-replay-core` direction。 |
| source-missing-stop-no-private-fallback | marker、mapper、checkpoint、report、handoff outcome 或 recovery source 缺失时用 fixture/private map/raw string/synthetic marker 私补。 | 构造 source missing / mapper missing / checkpoint missing / marker missing 分支。 | `integration-like`;nightly fault matrix。 | 停审回 owning design source,或返回 formal safe failure;不得合成 marker、stored surface、checkpoint 或 report。 | `fault-injection-matrix` / design review direction。 |

### 4. operations job / replay 专项候选表

| 专项候选 | 指标 / 风险 | 方法 | 环境 | 阈值 / 通过条件 | 证据方向 |
|---|---|---|---|---|---|
| job-duplicate-stored-report-only | completed job duplicate 重跑 job body、刷新 material、创建第二 report / issue / handoff candidate。 | 使用同一 run key 重放 completed job。 | `operations-replay`。 | 返回 stored report / progress summary;不重跑 job body,不写第二 report/issue/material/handoff candidate。 | `operations-replay-core` direction。 |
| checkpoint-resume-formal-source-only | job resume 使用 scheduler lease、queue offset、timestamp、current material scan 或 adapter note 替代 checkpoint。 | 构造 interrupted / partial job,只提供正式 checkpoint / progress / report / issue source。 | `operations-replay`;nightly extended。 | resume 只能从 formal checkpoint/progress/report/issue source 继续;checkpoint missing/corrupt 进入 blocked / manual。 | `operations-replay-core` / `operations-replay-extended` direction。 |
| partial-failure-safe-issue-report-summary | partial failure 保存 raw external payload、provider response、stack、report body,或继续边界不来自 issue/progress。 | 注入 refresh / reconciliation / handoff partial failure。 | `operations-replay`;`integration-like`。 | 只记录 safe issue、report summary、counts、marker direction;继续边界来自正式 issue/progress。 | `operations-replay-core` / `report-generation-audit` direction;schema 留 Step 13。 |
| operations-job-no-core-truth-repair | job 在 core truth 缺失、损坏或派生 material 不一致时创建、更新、删除或修复 definition truth。 | 构造 core truth 与 derived material 不一致 / missing 的维护场景。 | `operations-replay`。 | job 只写 derived material、progress、checkpoint、report、issue;不得修复 core definition truth、formal version truth 或 accepted audit。 | `operations-replay-core` / `operations-replay-extended` direction。 |
| report-missing-corrupt-no-log-rebuild | stored report 或 checkpoint report source missing/corrupt 时从 logs、artifact body、scheduler state 重建 report。 | 注入 report missing / corrupt / unreadable。 | `operations-replay`。 | 进入 blocked / manual / consistency-safe;不得从 log、artifact body、scheduler state 或 current material scan 补 report。 | `operations-replay-extended` / `fault-injection-matrix` direction。 |

### 5. fault injection 候选表

| 故障注入候选 | 主要断言 | 候选环境 | suite / gate 承接 | 禁止 |
|---|---|---|---|---|
| fake-uow-save-commit-failure | rollback no accepted residue;accepted side effects 不半提交。 | `ci-test`;`infra-runtime-fake`。 | `infra-runtime-fake`;`service-flow-fast`;nightly `fault-injection-matrix`。 | 定义 physical lock、DB isolation 或 durable schema。 |
| stored-surface-missing-wrong-kind | manual / consistency-safe;no current truth rebuild。 | `operations-replay`;`ci-test`。 | `operations-replay-core`;`fault-injection-matrix`。 | 定义 stored result / receipt / report 字段。 |
| expected-version-race | safe conflict / reload-required;no lost update。 | `ci-test`;`infra-runtime-fake`。 | `infra-runtime-fake`;`service-flow-fast`。 | 用 cursor、timestamp、checkpoint 替代 expected_version。 |
| publisher-handoff-target-failed | post-commit failure no rollback;failed / pending / issue only。 | `integration-like`;`operations-replay`。 | `entry-worker-job`;`operations-replay-core`;`fault-injection-matrix`。 | 用 delivery ack 证明 downstream truth 或保存 transport body。 |
| checkpoint-report-missing-corrupt | resume blocked / manual;no lease / offset / log rebuild。 | `operations-replay`。 | `operations-replay-core`;`operations-replay-extended`。 | 定义 checkpoint/report JSON schema。 |
| source-marker-missing | source-missing stop;no synthetic marker/private fallback。 | `integration-like`;nightly fault matrix。 | `fault-injection-matrix`;`infra-runtime-fake` support。 | 私补 marker source、mapper、port、state 或 fake map。 |
| commit-unknown | formal recovery source only;no timeout/log/private flag proof。 | `ci-test`;nightly fault matrix。 | `fault-injection-matrix`;`operations-replay-core`。 | 定义 retry policy、backoff、TTL 或私判规则。 |

### 6. suite / gate 承接表

| 专项方向 | Primary suite / gate | Secondary suite / gate | P0 阻断方向 | 禁止 |
|---|---|---|---|---|
| duplicate no-rerun | `service-flow-fast`;`operations-replay-core` | `operations-replay-extended` | duplicate 重跑 mutation / job body / adapter scan 阻断。 | 用 release smoke 代替 stored replay 主断言。 |
| query no-write | `service-flow-fast` | `contract-domain-fast`;`release-main-smoke` representative | query hidden write、audit append、event candidate、job start 阻断。 | 把 query degraded/empty 分支当维护入口。 |
| UoW atomicity / rollback | `infra-runtime-fake`;`service-flow-fast` | nightly `fault-injection-matrix` | 半提交或 rollback residue 阻断。 | 用 log/metric/private flag 证明 rollback。 |
| commit unknown / stored missing | `operations-replay-core` | `fault-injection-matrix`;`operations-replay-extended` | 私判成功、current truth rebuild 或 log rebuild 阻断。 | 在 Step 10 定义 recovery schema。 |
| version conflict / race | `infra-runtime-fake`;`service-flow-fast` | nightly extended sample | lost update、silent overwrite、cursor-as-version 阻断。 | 锁定 DB lock table 或 thread model。 |
| job checkpoint/report/no repair | `operations-replay-core` | `operations-replay-extended`;`report-generation-audit` support | job 修 core truth、checkpoint 替代、report 重建阻断。 | 定义 report artifact fields。 |
| publisher / handoff failed no rollback | `entry-worker-job`;`infra-runtime-fake` | `fault-injection-matrix`;`operations-replay-core` | failed outcome 回滚 accepted truth 或 stored surface 阻断。 | 把 delivered marker 当 downstream truth。 |

### 7. 阈值 / 通过条件来源和禁止硬化表

| 条件 / 阈值类型 | 当前可否硬化 | 来源 / 原因 | R10.8 裁决 |
|---|---|---|---|
| duplicate no-rerun | 可作为 P0 阻断方向 | NFR-ML-013、`03` duplicate replay、Step 6 `IDEMP` / `REPLAY` / `JOB` 用例、Step 9 replay suite。 | 写入专项候选。 |
| query no-write | 可作为 P0 阻断方向 | `03` query no-write、Step 6 query / audit negative、Step 9 `service-flow-fast`。 | 写入专项候选。 |
| rollback no accepted residue | 可作为 P0 阻断方向 | `03` UoW atomicity / rollback、Step 6 `UOW` / `RECOVERY`。 | 写入专项候选。 |
| commit unknown formal source only | 可作为 P0 阻断方向 | NFR-ML-012~014、`03` recovery source、Step 6 `RECOVERY`。 | 写入专项候选。 |
| job no truth repair | 可作为 P0 阻断方向 | NFR-ML-013~016、`03` job flow/test cut、Step 6 `JOB`。 | 写入专项候选。 |
| publisher / handoff failed no rollback | 可作为 P0 阻断方向 | `03/04` post-commit side effect boundary、Step 6 `DEPENDENCY-003`。 | 写入专项候选。 |
| fault injection timing / retry count / TTL | 不可在本批硬化 | `04/07` 或 implementation plan owns retry/backoff/runtime values。 | 不写数字阈值。 |
| stored surface / checkpoint / report字段 | 不可在本批硬化 | Step 10 不拥有 schema;Step 13 owns evidence/report artifact schema。 | 只写证据方向。 |
| release veto / acceptance verdict | 不可在本批硬化 | Step 12 和 `06-验收标准.md` owns。 | 不写验收裁决。 |

### 8. R10.9 进入门禁

| 门禁项 | 裁决 |
|---|---|
| R10.8 是否只写一致性 / 幂等 / 恢复专项候选 | pass |
| 是否写入一致性 / 幂等专项候选表 | pass |
| 是否写入事务 / 恢复专项候选表 | pass |
| 是否写入 operations job / replay 专项候选表 | pass |
| 是否写入 fault injection 候选表 | pass |
| 是否写入 suite / gate 承接表 | pass |
| 是否写入阈值 / 通过条件来源和禁止硬化表 | pass |
| 是否避免 stored surface / checkpoint / report / artifact schema、TC、DS、config key、port、mapper、state 和 implementation code | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

进入 `R10.9 可观测性 / 审计 / report pairing 专项:先思考` 时,只允许思考 safe log、metric low-cardinality、trace/span body-free、audit refs-only、operations fact、report pairing、artifact/report direction、observability not truth、redaction overlap、suite 承接和 R10.10 写入边界;不得直接修改正式 `05-测试方案.md`;不得定义正式 evidence schema、artifact/report JSON 字段、验收标准、实施计划或 implementation code。

### 9. R10.8 stop-review

| 检查项 | 结果 |
|---|---|
| 是否完成一致性 / 幂等、事务 / 恢复、operations job / replay 专项候选写入 | pass |
| 是否承接 NFR-ML-012~014、NFR-ML-016、`03` transaction / recovery / idempotency / observability test cut | pass |
| 是否承接 Step 6 `IDEMP` / `RECOVERY` / `REPLAY` / `UOW` / `JOB` / `DEPENDENCY` / `MARKER` 用例族 | pass |
| 是否明确 duplicate no-rerun、query no-write、rollback no residue、commit unknown formal source only、job no truth repair 和 post-commit failed no rollback 为阻断方向 | pass |
| 是否明确 stored surface / checkpoint / report 字段、fault injection timing、retry / TTL、artifact/report schema 和 acceptance verdict 后移 | pass |
| 是否未写 R10.9/R10.10 可观测性、审计和 report pairing 正文 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.9 可观测性 / 审计 / report pairing 专项:先思考`;只允许思考 safe log、metric low-cardinality、trace/span body-free、audit refs-only、operations fact、report pairing、artifact/report direction、observability not truth、redaction overlap、suite 承接和 R10.10 写入边界;不得直接修改正式 `05-测试方案.md`;不得定义正式 evidence schema、artifact/report JSON 字段、验收标准、实施计划或 implementation code。

---

## R10.9 可观测性 / 审计 / report pairing 专项:先思考

### 1. 当前模块目标

`R10.9` 只思考可观测性、审计和 report pairing 专项的输入边界、风险归类、输出面、suite 承接、source gap 和 `R10.10` 写入边界。

当前模块不写最终专项测试矩阵,不定义正式 evidence ID、artifact/report JSON schema、case JSON schema、assertion item key、metric name、log field schema、span payload schema、audit record schema、retention、review status、验收标准、CI YAML、required check、实现仓测试函数名或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.10 |
| 用户确认 | 已确认从 `R10.8` 推进到 `R10.9`。 |
| 当前允许 | 思考 safe log、metric low-cardinality、trace/span body-free、audit refs-only、operations fact、report pairing、artifact/report direction、observability not truth、redaction overlap、suite 承接和 R10.10 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写 R10.10 专项候选表;定义 metric/log/span/audit/report/artifact schema;新增 TC、DS、环境、profile、config key、marker source、port、mapper、state 或 phase boundary。 |

### 2. 当前专项输入承接

| 输入 | 必须承接 | R10.9 裁决 |
|---|---|---|
| NFR-ML-009~011 | 正式化、版本语义变化、消费影响和证据线索必须可追溯并承接验收 / 审计语境。 | 审计专项必须覆盖 trace / audit / lineage / report 方向,但不定义 evidence schema。 |
| NFR-ML-015 | 正式化状态、版本语义变化、消费影响变化、证据线索状态和边界异常应能被稳定观察。 | 可观测性专项必须覆盖 safe log、metric、trace/span、operations fact。 |
| NFR-ML-016 | observability、audit material 或 telemetry 不能替代 definition truth。 | 所有可观测材料只能观察和追溯,不能作为 truth、stored replay、report、checkpoint、publication outcome 或 recovery source。 |
| `03-详细设计.md` §14 | log、metric、trace/span、business audit、operations fact、redaction / diagnostic 的 body-free 边界。 | R10.10 可写候选表,不得定义 backend、metric name、span schema、dashboard、alert threshold。 |
| `03-详细设计.md` §15~§16 | Step 16 要测试 no raw body、no secret、metric low-cardinality、no synthetic marker、query no-write、duplicate no-rerun、post-commit failure no rollback、source-missing stop。 | 本批只承接 observability / audit / report 相关切口。 |
| `04-配置设计.md` §8 / §10 / §11 | raw secret/body 不得进 log/audit/trace/report;safe diagnostic sink unavailable 只输出 safe issue / degraded reporting。 | redaction overlap 必须承接,不新增 redaction config key。 |
| Step 6 用例 | `TC-ML-AUDIT-*`、`TC-ML-EVIDENCE-*`、`TC-ML-DIAGNOSTIC-*`、`TC-ML-METRIC-*`、`TC-ML-OBSERVABILITY-*`、`TC-ML-REDACTION-*`、`TC-ML-MARKER-*`。 | R10.10 汇总专项方向,不得新增或改号 TC。 |
| Step 8 环境 | `ci-test` 支撑 redaction / metric / trace guard;`operations-replay` 支撑 report/checkpoint lineage direction。 | 不要求真实 observability backend、dashboard、alert 或 production-like。 |
| Step 9 suite | `redaction-boundary`、`observability-boundary`、`report-generation-audit`、release report audit、run-scoped artifact/report direction。 | 只能映射既有 suite/check family,不写脚本实现或 schema。 |

### 3. 可观测性输出面思考

| 输出面 | 需要观察的事实 | 允许材料 | 禁止误用 |
|---|---|---|---|
| safe runtime log | entry、facade、adapter、publisher、handoff、job execution 的 safe runtime fact。 | operation family、result category、adapter family、safe diagnostic ref direction。 | raw request body、raw response body、secret、endpoint、stack trace、SQL/HTTP body。 |
| runtime metric | command/query/job/adapter count、latency sample、availability/degraded category。 | family、kind、state、result、category 等低基数 label。 | truth ref、operation key、actor id、trace id、route param、candidate/report/receipt ref、free text、payload digest、marker ref。 |
| trace / span | 串联 command/query/inbound/outbound/job/publisher/handoff execution boundary。 | trace context、stored result/receipt/report/candidate/outcome refs direction、safe marker category。 | payload body、transport response、provider body、topic、scheduler private payload。 |
| business audit / history | accepted business fact、lineage、impact、safe reason。 | accepted UoW、truth refs、safe reason refs、audit/trace/lineage refs。 | rejected/duplicate/query branch 伪造成 accepted audit。 |
| operations fact | job progress/checkpoint/report、publication/handoff outcome、diagnostic issue。 | formal report/outcome/issue refs、safe counters、marker category。 | core truth repair、raw report body、scheduler lease、queue offset。 |
| safe diagnostic | error/recovery/report issue 的 safe explanation。 | safe issue/ref、redacted digest、diagnostic category。 | raw exception text、secret、external response body、provider payload、full sensitive ref。 |

### 4. 审计 / report pairing 风险归类思考

| 风险类 | 触发方向 | 应验证的判断 | R10.10 写入提醒 |
|---|---|---|---|
| audit accepted fact boundary | rejected、duplicate、query、diagnostic 或 report observation 被写成 accepted business audit。 | accepted audit 只能来自 accepted UoW;其他分支只允许 safe observation / diagnostic direction。 | 写 audit refs-only 专项候选,不定义 audit schema。 |
| operations fact truth confusion | job report、publication outcome、handoff outcome 被当成 core truth 或 downstream truth。 | operations fact 只记录 local fact refs / outcome refs;不修 core truth,delivered 不证明 downstream truth。 | 与 R10.8 no truth repair / no rollback 交叉。 |
| report pairing missing | blocking suite 只有 human report 或只有 raw artifact,无法追溯到 run-scoped output。 | 每个 blocking suite 需要 artifact/report pairing direction;failed suite 仍保留 failed artifact/report direction。 | 正式字段、路径结构和 review status 留 Step 13。 |
| static evidence / latest | 使用静态 JSON、手写 report、`latest` 路径或跨 run report 宣告 pass。 | 自动化输出必须 run-scoped,report 从 raw artifact 推导,不得用 `latest`。 | 只写阻断方向,不定义 EV ID。 |
| report body leak | report / generated artifact 保存 raw config、package body、external response、evidence body。 | report 只保留 safe summary、marker refs、issue refs、counts、redacted refs direction。 | 与 R10.6 redaction overlap。 |
| observability as recovery proof | log、metric、trace、diagnostic、audit/report 被用作 recovery source、marker source 或 stored replay proof。 | observability 只能观察;recovery 仍依赖 stored surface、formal marker、checkpoint 或 owning source。 | 与 R10.8 consistency overlap。 |

### 5. redaction overlap 思考

| overlap | R10.9 关注 | R10.6 / R10.8 已覆盖 | R10.10 写入提醒 |
|---|---|---|---|
| raw body / secret in observable outputs | logs、metrics、trace/span、audit、operations fact、report 和 generated artifact。 | R10.6 已写 redaction / body-free 输出面。 | 本批只强调 observability / audit / report 输出面,不重复定义 scanner pattern。 |
| metric high-cardinality | per-ref、trace id、route param、free text、payload digest 或 marker ref 成为 metric label。 | R10.6 未细化 metric;R10.8 禁止 metric/log 证明一致性。 | 写 low-cardinality 专项候选,不写 metric name。 |
| diagnostic safe surface | safe diagnostic 被公开但不泄露 raw error;同时不能作为 truth。 | R10.6 处理 raw leak;R10.8 处理 proof 禁用。 | 写 diagnostic-safe-observable candidate。 |
| report body-free | job / handoff / release report 不含 raw body,且 report 不代替 raw artifact。 | R10.6 处理 body-free;R10.8 处理 report missing no rebuild。 | 写 report body-free + pairing 双重方向。 |
| marker copy-only | observable marker 只复制 formal marker/source。 | R10.6/R10.8 已写 marker/source-missing stop。 | 本批只说明 log/metric/trace/report 不能合成 marker。 |

### 6. suite / gate 承接思考

| 专项方向 | 候选 suite / gate | 承接方式 | R10.9 边界 |
|---|---|---|---|
| metric low-cardinality | `observability-boundary`;release observability/report audit direction。 | 检查 metric label family/kind/state/result/category candidate。 | 不定义 backend、metric name、label schema。 |
| trace/span body-free | `observability-boundary`;`redaction-boundary` support。 | 检查 trace/span candidate 不含 payload / response / provider body。 | 不定义 span payload schema。 |
| audit refs-only | `observability-boundary`;`service-flow-fast`;`operations-replay-core` support。 | 检查 accepted audit 与 rejected/duplicate/query observation 分离。 | 不定义 audit record schema。 |
| operations fact / job report boundary | `operations-replay-core`;`report-generation-audit` support。 | 检查 report/outcome/issue refs direction 和 no core truth repair。 | 不定义 report JSON 字段。 |
| artifact/report pairing | `report-generation-audit`;release report audit。 | 检查 blocking suite artifact/report pairing、failed suite retention direction、no static evidence。 | schema / retention / review status 留 Step 13。 |
| observable redaction | `redaction-boundary`;release redaction boundary。 | 检查 logs/reports/artifacts/diagnostics no raw body / secret / endpoint / provider response。 | scanner pattern / deny-list schema 后移。 |
| observability not truth | `observability-boundary`;`fault-injection-matrix` support。 | 检查 log/metric/trace/audit/report 不作为 truth/recovery/marker/stored replay proof。 | 不新增 recovery source。 |

### 7. source gap 与停审风险

| 风险 | 停审条件 | 处理 |
|---|---|---|
| metric/log/span/audit 字段不闭合 | 专项断言需要字段级 schema 才能编码。 | R10.10 只写风险和检查方向;schema 留 owning design / Step 13 / implementation plan。 |
| artifact/report JSON 字段不闭合 | report pairing 需要正式 artifact/report 字段。 | 只写 pairing direction;Step 13 闭合 artifact/report/case/assertion schema。 |
| retention / review status 不闭合 | failed artifact 留存、human review、report approval 需要正式规则。 | Step 13 / Step 12 / `06` 承接,本批不写。 |
| observability backend 未选型 | 需要真实 backend、dashboard、alert 才能通过。 | P0 使用 local capture / fake guard;真实 backend 为 P1/P2 residual。 |
| redaction scanner pattern 不闭合 | 需要具体 pattern、deny-list 或 leak corpus schema。 | 只写 raw leak 阻断方向;pattern/schema 留后续 owner。 |
| audit subject / safe actor / diagnostic source 缺失 | 需要正式 source 才能写 audit/diagnostic。 | 停审回 owning design source;不得从 route/log/private map 合成。 |
| report 被要求证明 acceptance | Step 10 不能定义 acceptance verdict。 | Step 12 和 `06-验收标准.md` owns。 |

### 8. R10.10 写入边界

R10.10 可以写入:

1. 可观测性专项候选表:safe log、metric low-cardinality、trace/span body-free、safe diagnostic observable。
2. 审计专项候选表:accepted audit refs-only、rejected/duplicate/query 不伪造 accepted audit、operations fact boundary、observability not truth。
3. report pairing / artifact direction 专项候选表:run-scoped pairing、failed artifact/report direction、no static evidence、report body-free。
4. redaction overlap 和 suite / gate 承接候选表。
5. 阈值 / 通过条件来源和禁止硬化表。
6. 本批 stop-review 和 `R10.11 cross-special audit / closure:先思考` 进入门禁。

R10.10 禁止写入:

1. metric name、log field schema、span payload schema、audit record schema、artifact/report JSON 字段、case schema、assertion item key、retention、review status 或 EV ID。
2. 新增 TC、DS、环境、profile、config key、backend product、dashboard、alert、marker source、port、mapper、state、DTO 字段或 phase boundary。
3. CI YAML、脚本实现、required check、实现仓测试函数名、验收标准、缺陷分级、进入/退出准则、证据归档规则或 implementation code。
4. 修改正式 `05-测试方案.md`、`06-验收标准.md` 或 `07-实施计划.md`。
5. 写 R10.11/R10.12 cross-special audit / closure 正文。

### 9. R10.9 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考可观测性 / 审计 / report pairing 专项 | pass |
| 是否承接 NFR-ML-009~011、NFR-ML-015~016 和 `03` §14 observability / audit 边界 | pass |
| 是否承接 Step 6 diagnostic / metric / observability / audit / evidence / redaction / marker 用例族 | pass |
| 是否识别 safe log、metric low-cardinality、trace/span body-free、audit refs-only、operations fact 和 safe diagnostic 输出面 | pass |
| 是否识别 report pairing、no static evidence、no latest、failed artifact/report direction 和 report body-free 风险 | pass |
| 是否识别 observability not truth、redaction overlap 和 source gap / 停审风险 | pass |
| 是否形成 suite 承接和 R10.10 写入边界 | pass |
| 是否未定义 metric/log/span/audit/report/artifact schema、TC、DS、config key、backend、port、mapper、state 或 implementation code | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.10 可观测性 / 审计 / report pairing 专项:再写入`;只允许写入可观测性专项候选表、审计专项候选表、report pairing / artifact direction 专项候选表、redaction overlap 和 suite / gate 承接候选表、阈值 / 通过条件来源和禁止硬化表、本批 stop-review 和 `R10.11 cross-special audit / closure:先思考` 进入门禁;不得直接修改正式 `05-测试方案.md`;不得定义正式 evidence schema、artifact/report JSON 字段、验收标准、实施计划或 implementation code。

---

## R10.10 可观测性 / 审计 / report pairing 专项:再写入

### 1. 当前模块写入目标

`R10.10` 将 R10.9 的思考固化为可观测性 / 审计 / report pairing 专项候选矩阵。当前模块只写可观测性专项候选表、审计专项候选表、report pairing / artifact direction 专项候选表、redaction overlap 和 suite / gate 承接候选表、阈值 / 通过条件来源和禁止硬化表、本批 stop-review 和 `R10.11` 进入门禁。

当前模块不定义 metric name、log field schema、span payload schema、audit record schema、artifact/report JSON 字段、case schema、assertion item key、retention、review status、正式 evidence ID、验收标准、实施计划、CI YAML、required check、实现仓测试函数名或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.11 |
| 用户确认 | 已确认从 `R10.9` 推进到 `R10.10`。 |
| 当前允许 | 写入可观测性专项候选表、审计专项候选表、report pairing / artifact direction 专项候选表、redaction overlap 和 suite / gate 承接候选表、阈值 / 通过条件来源和禁止硬化表、stop-review 和 R10.11 进入门禁。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;定义 metric/log/span/audit/report/artifact schema;新增 TC、DS、环境、profile、config key、backend product、dashboard、alert、marker source、port、mapper、state、DTO 字段或 phase boundary。 |

### 2. 可观测性专项候选表

| 专项候选 | 指标 / 风险 | 方法 | 环境 | 阈值 / 通过条件 | 证据方向 |
|---|---|---|---|---|---|
| safe-runtime-log-body-free | runtime log 泄露 raw request / response、secret、endpoint、stack、SQL/HTTP body 或 provider payload。 | 触发 command、query、adapter、publisher、handoff、job 的 success / failure / degraded branch,检查 safe log candidate。 | `ci-test`;`integration-like` controlled seam。 | log 只表达 operation family、result category、adapter family、safe diagnostic direction;raw body/secret 命中阻断。 | `observability-boundary` / `redaction-boundary` direction。 |
| metric-low-cardinality | metric label 使用 truth ref、operation key、actor id、trace id、route param、candidate/report/receipt ref、free text、payload digest 或 marker ref。 | 采集 command/query/job/adapter metric candidate,执行 low-cardinality guard。 | `ci-test`。 | labels 只包含 family、kind、state、result、category 等低基数候选;不得含 per-ref / free text。 | `observability-boundary` direction。 |
| trace-span-body-free | trace/span 泄露 payload body、transport response、provider body、topic 或 scheduler private payload。 | 执行 command/query/inbound/outbound/job/publisher/handoff trace capture candidate。 | `ci-test`;`operations-replay`。 | trace/span 只含 trace context、stored surface / candidate / outcome / report / checkpoint refs direction 和 safe marker category。 | `observability-boundary` / `redaction-boundary` direction。 |
| diagnostic-safe-observable | diagnostic 输出 raw exception、secret、external response、provider payload、full sensitive ref,或作为 recovery proof。 | 用 dummy leak corpus 触发 config / adapter / job / handoff failure。 | `ci-test`;`integration-like`。 | diagnostic 只输出 safe issue/ref、redacted digest、diagnostic category;不作为 truth、stored replay、checkpoint 或 marker source。 | `redaction-boundary` / `fault-injection-matrix` support direction。 |

### 3. 审计专项候选表

| 专项候选 | 指标 / 风险 | 方法 | 环境 | 阈值 / 通过条件 | 证据方向 |
|---|---|---|---|---|---|
| accepted-audit-refs-only | accepted business audit 保存 raw body、raw reason、external document body、artifact body 或 provider response。 | 执行 accepted command / formalization / version / impact path 后检查 audit candidate。 | `ci-test`;`operations-replay` support。 | accepted audit 只能来自 accepted UoW,记录 truth refs、safe actor/reason refs、trace/lineage refs direction。 | `service-flow-fast` / `observability-boundary` direction。 |
| rejected-duplicate-query-not-accepted-audit | rejected、duplicate replay、query observation、diagnostic 或 report observation 伪造成 accepted audit。 | 分别执行 rejected、duplicate、query visible/degraded、diagnostic branch。 | `ci-test`。 | 不新增 accepted business audit、success event candidate 或 truth mutation;只允许 safe observation / diagnostic direction。 | `service-flow-fast` / `observability-boundary` direction。 |
| operations-fact-not-core-truth | job report、publication outcome、handoff outcome、diagnostic issue 被用作 core truth、downstream truth 或 repair source。 | 执行 job partial、publisher failed、handoff delivered/failed、diagnostic issue branch。 | `operations-replay`;`integration-like`。 | operations fact 只记录 report/outcome/issue refs、safe counters、marker category;不修 core truth,delivered 不证明 downstream truth。 | `operations-replay-core` / `entry-worker-job` direction。 |
| observability-not-truth-source | log、metric、trace、audit、report 或 telemetry 被用作 stored replay、report、checkpoint、publication outcome、recovery source 或 marker source。 | 构造 stored surface missing、checkpoint missing、marker missing、commit unknown branch。 | `operations-replay`;nightly fault matrix。 | observability 只观察;recovery 仍依赖 stored surface、formal marker、checkpoint 或 owning source。 | `fault-injection-matrix` / `observability-boundary` direction。 |

### 4. report pairing / artifact direction 专项候选表

| 专项候选 | 指标 / 风险 | 方法 | 环境 | 阈值 / 通过条件 | 证据方向 |
|---|---|---|---|---|---|
| run-scoped-artifact-report-pairing | blocking suite 只有 human report 或只有 raw artifact,无法追溯到同一 run。 | 审计 suite artifact direction 与 report direction 是否成对绑定 run identity。 | `ci-test`;nightly / release report audit。 | 每个 blocking suite 需要 run-scoped artifact/report pairing direction;不得跨 run 拼接。 | `report-generation-audit` / release report audit direction。 |
| failed-suite-artifact-report-retained-direction | suite failed 时覆盖或丢弃 failed artifact/report,只留下通过摘要。 | 构造 failed suite / failed check / report generation failed direction。 | nightly / release report audit direction。 | failed suite 仍保留 failure artifact/report direction;report 失败不得掩盖 suite 失败。 | `report-generation-audit` direction;retention 留 Step 13。 |
| no-static-evidence-no-latest | 使用静态 JSON、手写 report、`latest` 路径或跨 run report 宣告 pass。 | 审计 automation output direction、report source direction 和 run parameter。 | `ci-test`;release report audit。 | 所有自动化输出必须绑定显式 run;report 从 raw artifact direction 推导;禁止 `latest`。 | `report-generation-audit` / release report audit direction。 |
| report-body-free | report / generated artifact 保存 raw config、package body、external response、provider payload、evidence body 或 raw report body。 | 对 job report、handoff report、release report、generated artifact direction 执行 body-free audit。 | `operations-replay`;release report audit。 | report 只保留 safe summary、marker refs、issue refs、counts、redacted refs direction;raw body 命中阻断。 | `redaction-boundary` / `report-generation-audit` direction。 |

### 5. redaction overlap 和 suite / gate 承接表

| 专项方向 | Primary suite / gate | Secondary suite / gate | P0 阻断方向 | 禁止 |
|---|---|---|---|---|
| safe log / diagnostic redaction | `redaction-boundary` | `observability-boundary`;release redaction check | raw body、secret、endpoint、provider response、unsafe full ref leak 阻断。 | 定义 scanner pattern / deny-list schema。 |
| metric low-cardinality | `observability-boundary` | release report audit support | high-cardinality label 阻断。 | 定义 metric name、backend、dashboard 或 alert。 |
| trace/span body-free | `observability-boundary` | `redaction-boundary` | payload / response / provider body in span 阻断。 | 定义 span payload schema。 |
| audit refs-only | `observability-boundary`;`service-flow-fast` | `operations-replay-core` support | rejected/duplicate/query 伪 accepted audit 阻断。 | 定义 audit record schema。 |
| operations fact boundary | `operations-replay-core` | `entry-worker-job`;`report-generation-audit` support | operations fact 修 truth 或证明 downstream truth 阻断。 | 定义 report JSON 字段。 |
| artifact/report pairing | `report-generation-audit` | release report audit | blocking suite 缺 artifact/report pairing、static evidence、`latest` 阻断。 | 定义 EV ID、retention、review status。 |
| report body-free | `report-generation-audit`;`redaction-boundary` | release report audit | raw report body、raw config、evidence body、provider response 阻断。 | 把 report body 当 proof。 |

### 6. 阈值 / 通过条件来源和禁止硬化表

| 条件 / 阈值类型 | 当前可否硬化 | 来源 / 原因 | R10.10 裁决 |
|---|---|---|---|
| no raw body / secret in observable outputs | 可作为 P0 阻断方向 | NFR-ML-007~008、`03` §14、`04` §8 / §11、Step 6 redaction/observability 用例、Step 9 redaction-boundary。 | 写入专项候选。 |
| metric low-cardinality | 可作为 P0 阻断方向 | NFR-ML-015~016、`03` §14、Step 6 `TC-ML-METRIC-001`。 | 写入专项候选。 |
| trace/span body-free | 可作为 P0 阻断方向 | `03` §14、Step 6 `TC-ML-OBSERVABILITY-001`。 | 写入专项候选。 |
| audit refs-only / no accepted audit spoofing | 可作为 P0 阻断方向 | FR-ML-007~009、BR-ML-020~022、`03` audit boundary、Step 6 `TC-ML-AUDIT-*`。 | 写入专项候选。 |
| observability not truth | 可作为 P0 阻断方向 | NFR-ML-016、`03` observability / recovery boundary、R10.8 recovery source 规则。 | 写入专项候选。 |
| run-scoped artifact/report pairing and no latest | 可作为 P0 阻断方向 | Step 9 run-scoped output、report pairing、no static evidence 方向。 | 写入专项候选。 |
| metric/log/span/audit schema | 不可在本批硬化 | Step 10 不拥有字段级 schema。 | 留后续 owner / implementation plan。 |
| artifact/report JSON fields、EV ID、retention、review status | 不可在本批硬化 | Step 13 owns evidence/report schema and archive rules。 | 只写方向。 |
| acceptance verdict / release veto | 不可在本批硬化 | Step 12 和 `06-验收标准.md` owns。 | 不写验收裁决。 |

### 7. R10.11 进入门禁

| 门禁项 | 裁决 |
|---|---|
| R10.10 是否只写可观测性 / 审计 / report pairing 专项候选 | pass |
| 是否写入可观测性专项候选表 | pass |
| 是否写入审计专项候选表 | pass |
| 是否写入 report pairing / artifact direction 专项候选表 | pass |
| 是否写入 redaction overlap 和 suite / gate 承接表 | pass |
| 是否写入阈值 / 通过条件来源和禁止硬化表 | pass |
| 是否避免 metric/log/span/audit/report/artifact schema、EV ID、retention、review status、TC、DS、config key、backend 和 implementation code | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

进入 `R10.11 cross-special audit / closure:先思考` 时,只允许思考 Step 10 已写专项之间的 NFR 覆盖、阈值来源、P0/P1 边界、suite 映射、重复断言、source gap、evidence 后移、Step 11 进入门禁和 R10.12 写入边界;不得直接修改正式 `05-测试方案.md`;不得定义正式 evidence schema、artifact/report JSON 字段、验收标准、实施计划或 implementation code。

### 8. R10.10 stop-review

| 检查项 | 结果 |
|---|---|
| 是否完成可观测性、审计、report pairing / artifact direction 专项候选写入 | pass |
| 是否承接 NFR-ML-009~011、NFR-ML-015~016、`03` §14 和 Step 6 diagnostic / metric / observability / audit / evidence / redaction / marker 用例族 | pass |
| 是否明确 safe log、metric low-cardinality、trace/span body-free、audit refs-only、operations fact boundary 和 safe diagnostic | pass |
| 是否明确 report pairing、failed artifact/report direction、no static evidence、no latest 和 report body-free | pass |
| 是否明确 observability not truth 和 redaction overlap | pass |
| 是否明确 metric/log/span/audit schema、artifact/report字段、EV ID、retention、review status、acceptance verdict 后移 | pass |
| 是否未写 R10.11/R10.12 cross-special audit / closure 正文 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.11 cross-special audit / closure:先思考`;只允许思考 Step 10 已写专项之间的 NFR 覆盖、阈值来源、P0/P1 边界、suite 映射、重复断言、source gap、evidence 后移、Step 11 进入门禁和 R10.12 写入边界;不得直接修改正式 `05-测试方案.md`;不得定义正式 evidence schema、artifact/report JSON 字段、验收标准、实施计划或 implementation code。

---

## R10.11 cross-special audit / closure:先思考

### 1. 当前模块目标

`R10.11` 只思考 Step 10 已写专项之间的总审计和收口边界: NFR 覆盖、阈值来源、P0/P1 边界、suite 映射、重复断言、source gap、evidence 后移、Step 11 进入门禁和 `R10.12` 写入边界。

当前模块不写最终 cross-special audit 表,不宣布 Step 10 completed,不进入 Step 11,不定义正式 evidence ID、artifact/report JSON schema、case JSON schema、assertion item key、retention、review status、缺陷分级、进入/退出准则、验收标准、实施计划、CI YAML、required check、实现仓测试函数名或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.12 |
| 用户确认 | 已确认从 `R10.10` 推进到 `R10.11`。 |
| 当前允许 | 思考 Step 10 已写专项之间的 NFR 覆盖、阈值来源、P0/P1 边界、suite 映射、重复断言、source gap、evidence 后移、Step 11 进入门禁和 R10.12 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写 R10.12 收口表;宣布 Step 10 completed;进入 Step 11;定义 evidence / artifact / report schema、验收标准、实施计划或 implementation code。 |

### 2. NFR 覆盖思考

| NFR 范围 | 已有专项承接 | R10.11 初判 | R10.12 写入提醒 |
|---|---|---|---|
| NFR-ML-001~003 性能 / 主链结构性 | R10.3/R10.4 性能结构性 sample、核心闭环不被外围阻断、一致性优先。 | 已有专项方向;无正式 P95/SLO 数字。 | 写“sample/trend,无硬数字阈值”。 |
| NFR-ML-004~006 可用性 / 降级 | R10.3/R10.4 unavailable/degraded/fail-fast/fail-closed/delayed/failed marker。 | 已覆盖 P0 fake/controlled/replay 分支;真实外部产品是 P1/P2 residual。 | 写 P0/P1 边界和 formal marker source 停审。 |
| NFR-ML-007~008 安全 / 边界 | R10.5/R10.6 越权持有、redaction/body-free、dependency boundary、downstream bypass truth。 | 已覆盖 raw body/secret/full sensitive ref、non-core compile dependency、observability not truth。 | 写重复红线允许跨专项复用。 |
| NFR-ML-009~011 审计 / 可追溯 | R10.9/R10.10 trace/audit/report pairing、evidence lineage direction。 | 已覆盖审计和 report direction;正式 evidence schema 后移 Step 13。 | 写 evidence 后移和 Step 13 blocker watch。 |
| NFR-ML-012~014 幂等 / 一致性 | R10.7/R10.8 duplicate no-rerun、query no-write、UoW rollback、commit unknown、version conflict、job no truth repair。 | 已覆盖阻断方向;stored surface/checkpoint/report 字段后移。 | 写 source gap 停审。 |
| NFR-ML-015~016 可观测性 | R10.9/R10.10 safe log、metric low-cardinality、trace/span body-free、observability not truth。 | 已覆盖可观察和不替代 truth;不定义 backend/metric/span schema。 | 写 backend/P1 residual 和 schema 后移。 |

### 3. 阈值来源思考

| 条件 / 阈值族 | 当前来源 | 是否可硬化为 P0 阻断方向 | R10.11 判断 |
|---|---|---|---|
| raw body / secret / full sensitive ref leak | `00` NFR、`03` body-free/redaction、`04` redaction、Step 6 redaction 用例。 | 是。 | 可写阻断方向,但 scanner pattern 后移。 |
| non-core sibling compile dependency | Step 8 dependency matrix、Step 9 dependency-boundary、架构依赖方向。 | 是。 | 可写阻断方向,但 graph schema 后移。 |
| duplicate no-rerun / query no-write / job no truth repair | `03` flow / persistence / idempotency、Step 6 replay/query/job 用例。 | 是。 | 可写阻断方向。 |
| rollback no residue / commit unknown formal source | `03` UoW / recovery、Step 6 recovery/UOW 用例。 | 是。 | 可写阻断方向,但 recovery source 缺失则停审。 |
| metric low-cardinality / trace body-free / audit refs-only | `03` §14、Step 6 metric/observability/audit 用例。 | 是。 | 可写阻断方向,但字段级 schema 后移。 |
| artifact/report pairing / no latest / no static evidence | Step 9 run-scoped output、report-generation-audit。 | 是,作为方向性阻断。 | schema/retention/review status 后移 Step 13。 |
| performance P95/SLO/容量数字 | 当前正式 `00/03/04/09` 无数字来源。 | 否。 | 只写 sample/trend 和结构性判断。 |
| release veto / acceptance verdict | `06-验收标准.md` owns。 | Step 10 不硬化。 | R10.12 只能写后移。 |

### 4. P0 / P1 边界思考

| 边界项 | P0 当前要求 | P1/P2 residual | 禁止 |
|---|---|---|---|
| 环境 | `ci-test`、`integration-like`、`operations-replay` 的 fake/controlled/replay。 | `staging-like`、`production-like`、future real-like selected-run。 | 用 P1 selected-run 替代 P0 closure。 |
| 性能 | 结构性不阻塞、sample/trend、核心闭环不依赖外围增强。 | 真实容量、P95/SLO、生产负载模型。 | 继承旧 P95 或发明容量数字。 |
| 可用性 / 降级 | formal marker/source 闭合的 fake/controlled unavailable/degraded/failed 分支。 | 真实外部产品 SLA、真实 bus/provider/handoff。 | marker/source 缺失时合成 marker。 |
| report/evidence | run-scoped artifact/report direction、pairing/no latest/no static evidence。 | 正式 EV ID、retention、review status、archive product。 | Step 10 定义 evidence schema。 |
| observability | local capture / guard / fake runtime 中验证 safe output 和 not truth。 | 真实 backend、dashboard、alert、sampling、runbook。 | 观测后端作为 truth/recovery proof。 |

### 5. suite 映射思考

| 专项族 | 主 suite / gate | 支撑 suite / gate | R10.11 判断 |
|---|---|---|---|
| 性能结构性 | `service-flow-fast`;`operations-replay-core`;release smoke direction | `release-main-smoke` representative | release smoke 不替代底层 suite。 |
| 可用性 / 降级 | `infra-runtime-fake`;`operations-replay-core` | `fault-injection-matrix`;`entry-worker-job` | formal marker/source 是通过前置。 |
| 安全 / redaction | `redaction-boundary` | release redaction boundary;`report-generation-audit` | raw leak 阻断;scanner schema 后移。 |
| dependency boundary | `dependency-boundary` | release dependency boundary | non-core compile dependency 阻断;graph schema 后移。 |
| 幂等 / 恢复 | `service-flow-fast`;`infra-runtime-fake`;`operations-replay-core` | `operations-replay-extended`;`fault-injection-matrix` | fast/core/extended 分层,不可互相替代。 |
| 可观测 / 审计 | `observability-boundary`;`report-generation-audit` | `service-flow-fast`;`operations-replay-core` | backend/schema 后移。 |
| report pairing | `report-generation-audit` | release report audit | pairing/no latest/no static evidence 是方向性阻断。 |

### 6. 重复断言与交叉风险思考

| 重复断言族 | 出现位置 | 是否允许 | R10.11 判断 |
|---|---|---|---|
| body-free / no raw body | R10.4、R10.6、R10.10 | 允许。 | 横切红线,按输出面和故障面重复覆盖。 |
| observability not truth | R10.6、R10.8、R10.10 | 允许。 | 分别覆盖 security boundary、recovery proof、observable material。 |
| marker copy-only / source missing stop | R10.4、R10.6、R10.8、R10.10 | 允许。 | 不同分支共享停审规则,不得伪覆盖。 |
| report body-free / report pairing | R10.8、R10.10 | 允许。 | R10.8 关注 recovery/report missing,R10.10 关注 generated report/pairing。 |
| no truth repair | R10.4、R10.8、R10.10 | 允许。 | availability、job recovery、operations fact 分别覆盖。 |
| suite 重叠 | 多个专项映射同一 suite | 允许。 | suite 是执行载体,专项矩阵是风险视角;R10.12 需写不互相替代。 |

### 7. source gap / evidence 后移思考

| 后移项 | 后移 owner | Step 10 当前处理 |
|---|---|---|
| artifact/report JSON 字段、case schema、assertion item key | Step 13 | 只写 artifact/report direction、pairing、no latest、no static evidence。 |
| evidence ID、retention、review status、archive path | Step 13 / Step 12 / `06` | 只写 evidence direction,不写正式 EV。 |
| release veto / acceptance verdict | Step 12 / `06-验收标准.md` | 只写阻断方向,不写验收裁决。 |
| defect severity / retest rule | Step 11 | R10.12 只写 Step 11 进入门禁。 |
| CI YAML、scripts、required checks | Step 9 / `07` / implementation plan | Step 10 只引用 suite/gate family。 |
| metric/log/span/audit schema | owning design / Step 13 / implementation plan | Step 10 只写安全输出和低基数方向。 |
| config key、secret provider、backend product、dashboard、alert | `04` / `07` / ops owner | Step 10 不补配置或产品。 |

### 8. Step 11 进入门禁思考

| 进入项 | R10.11 判断 | R10.12 写入提醒 |
|---|---|---|
| Step 10 是否覆盖 P0 非功能和红线验证方式 | 基本覆盖,需 R10.12 总表确认。 | 写 Step 10 总停审。 |
| 是否仍有 Step 10 内部未写模块 | R10.1~R10.10 已完成,剩 R10.12 closure。 | R10.12 完成后才允许 Step 11。 |
| 是否存在阻塞 Step 11 的 source gap | 当前主要为后移项,不阻塞 Step 10 closure,但需要写入后移 owner。 | 不得用 Step 10 补 schema。 |
| Step 11 是否可开始缺陷管理与复验规则 | 只能在 R10.12 完成并用户确认后进入。 | R10.12 写 next_allowed_action 到 Step 11 R11.1。 |

### 9. R10.12 写入边界

R10.12 可以写入:

1. Step 10 NFR 覆盖总表。
2. 阈值来源 / 禁止硬化总审计表。
3. P0/P1 边界和 suite 映射总表。
4. 重复断言 / 交叉风险审计表。
5. source gap / evidence 后移表。
6. Step 10 completed stop-review 和 Step 11 进入门禁。

R10.12 禁止写入:

1. 新专项候选表、新 TC、新 DS、新环境、新 suite、新 config key、新 marker source、新 port/mapper/state/schema。
2. evidence ID、artifact/report JSON 字段、case schema、assertion item key、retention、review status。
3. 缺陷分级、复验规则、进入/退出准则、证据归档规则、回归策略、验收标准、实施计划或 implementation code。
4. 修改正式 `05-测试方案.md`、`06-验收标准.md` 或 `07-实施计划.md`。

### 10. R10.11 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 cross-special audit / closure | pass |
| 是否覆盖 NFR 覆盖、阈值来源、P0/P1 边界、suite 映射、重复断言和 source gap | pass |
| 是否识别 evidence / artifact / report schema、验收裁决、缺陷分级和实施内容后移 | pass |
| 是否形成 Step 11 进入门禁思考和 R10.12 写入边界 | pass |
| 是否未写最终 cross-special audit 表或宣布 Step 10 completed | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.12 cross-special audit / closure:再写入`;只允许写入 Step 10 NFR 覆盖总表、阈值来源 / 禁止硬化总审计表、P0/P1 边界和 suite 映射总表、重复断言 / 交叉风险审计表、source gap / evidence 后移表、Step 10 completed stop-review 和 Step 11 进入门禁;不得直接修改正式 `05-测试方案.md`;不得定义正式 evidence schema、artifact/report JSON 字段、验收标准、实施计划或 implementation code。

---

## R10.12 cross-special audit / closure:再写入

### 1. 当前模块写入目标

`R10.12` 将 R10.11 的思考固化为 Step 10 总收口。当前模块只写 Step 10 NFR 覆盖总表、阈值来源 / 禁止硬化总审计表、P0/P1 边界和 suite 映射总表、重复断言 / 交叉风险审计表、source gap / evidence 后移表、Step 10 completed stop-review 和 Step 11 进入门禁。

当前模块不新增专项候选表、不新增 TC / DS / 环境 / suite / config key / marker source / port / mapper / state / schema,不定义 evidence ID、artifact/report JSON 字段、case schema、assertion item key、retention、review status、缺陷分级、复验规则、进入/退出准则、验收标准、实施计划、CI YAML、required check、实现仓测试函数名或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_step11 |
| 用户确认 | 已确认从 `R10.11` 推进到 `R10.12`。 |
| 当前允许 | 写入 Step 10 NFR 覆盖总表、阈值来源 / 禁止硬化总审计表、P0/P1 边界和 suite 映射总表、重复断言 / 交叉风险审计表、source gap / evidence 后移表、Step 10 completed stop-review 和 Step 11 进入门禁。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写 Step 11 缺陷分级;定义 evidence / artifact / report schema、验收标准、实施计划或 implementation code。 |

### 2. Step 10 NFR 覆盖总表

| NFR 范围 | Step 10 专项承接 | 覆盖结论 | 后续承接 |
|---|---|---|---|
| NFR-ML-001~003 性能 / 主链结构性 | R10.3/R10.4 性能结构性 sample、核心闭环不被外围增强 / P1/P2 / 真实产品阻断、一致性优先。 | pass_with_boundary | 数字容量、P95/SLO、真实负载模型不在 Step 10 硬化。 |
| NFR-ML-004~006 可用性 / 降级 | R10.3/R10.4 fail-fast、fail-closed、rejected、degraded、delayed、failed marker、no activation、test fail-fast。 | pass_with_source_watch | formal marker/source 缺失时停审;真实外部产品 SLA 为 P1/P2 residual。 |
| NFR-ML-007~008 安全 / 边界 | R10.5/R10.6 unauthorized truth ownership、downstream bypass、raw body/secret/full ref、artifact/archive body-free、dependency boundary。 | pass | scanner pattern、deny-list schema、dependency graph schema 后移。 |
| NFR-ML-009~011 审计 / 可追溯 | R10.9/R10.10 audit refs-only、operations fact、report pairing、no static evidence、run-scoped direction。 | pass_with_evidence_schema_deferred | evidence ID、artifact/report schema、retention、review status 留 Step 13。 |
| NFR-ML-012~014 幂等 / 一致性 | R10.7/R10.8 duplicate no-rerun、query no-write、UoW rollback、commit unknown、stored surface missing、version conflict、job no truth repair。 | pass_with_source_watch | stored surface / checkpoint / report 字段和 recovery source 缺失时停审。 |
| NFR-ML-015~016 可观测性 | R10.9/R10.10 safe log、metric low-cardinality、trace/span body-free、observability not truth。 | pass_with_schema_deferred | backend、metric name、span/log/audit schema、dashboard、alert 后移。 |

### 3. 阈值来源 / 禁止硬化总审计表

| 条件 / 阈值族 | Step 10 裁决 | 来源 | 禁止硬化 |
|---|---|---|---|
| no raw body / secret / full sensitive ref | P0 阻断方向 | `00` NFR、`03` body-free/redaction、`04` redaction、Step 6 redaction 用例。 | scanner pattern、secret provider、deny-list schema。 |
| only `core-contracts` compile dependency | P0 阻断方向 | Step 8 dependency matrix、Step 9 dependency-boundary、架构依赖方向。 | graph schema、manifest path、implementation command。 |
| duplicate no-rerun / query no-write / job no truth repair | P0 阻断方向 | `03` flow / persistence / idempotency、Step 6 replay/query/job 用例。 | stored surface schema、private replay map。 |
| rollback no residue / commit unknown formal source | P0 阻断方向 | `03` UoW / recovery、Step 6 recovery/UOW 用例。 | retry count、backoff、TTL、timeout private rule。 |
| marker copy-only / source missing stop | P0 阻断 direction with source watch | `03/04` marker/source redline、Step 6 marker 用例。 | synthetic marker、raw error/log/route/private map source。 |
| metric low-cardinality / trace body-free / audit refs-only | P0 阻断方向 | `03` §14、Step 6 metric/observability/audit 用例。 | metric name、log field schema、span payload schema、audit record schema。 |
| artifact/report pairing / no latest / no static evidence | P0 阻断 direction | Step 9 run-scoped output、report-generation-audit。 | artifact/report JSON 字段、EV ID、retention、review status。 |
| performance sample / trend | P0 support only | `00` 只给结构性性能判断。 | P95/SLO/容量数字、生产负载模型。 |
| acceptance verdict / release veto | Step 10 不定义 | Step 12 / `06-验收标准.md` owns。 | 把专项方向写成最终验收裁决。 |

### 4. P0/P1 边界和 suite 映射总表

| 专项族 | P0 环境 / suite | P1/P2 residual | Step 10 裁决 |
|---|---|---|---|
| 性能结构性 | `ci-test`;`integration-like`;`service-flow-fast`;`operations-replay-core`;release smoke direction。 | production-like load、P95/SLO、capacity benchmark。 | P0 只证明结构性和 sample/trend。 |
| 可用性 / 降级 | `integration-like`;`operations-replay`;`infra-runtime-fake`;`fault-injection-matrix`。 | 真实 external product / bus / provider SLA。 | P0 controlled failure,formal marker/source required。 |
| 安全 / redaction | `ci-test`;`redaction-boundary`;release redaction boundary。 | 真实 secret provider、生产扫描器配置。 | raw leak 阻断,scanner schema 后移。 |
| dependency boundary | local tool direction;`dependency-boundary`;release dependency boundary。 | future approved sibling integration。 | non-core compile dependency 阻断。 |
| 幂等 / 恢复 | `service-flow-fast`;`infra-runtime-fake`;`operations-replay-core`;nightly `operations-replay-extended`;`fault-injection-matrix`。 | durable DB isolation proof、production recovery runbook。 | fast/core/extended 分层,不可互相替代。 |
| 可观测 / 审计 | `observability-boundary`;`report-generation-audit`;`operations-replay-core` support。 | observability backend、dashboard、alert、sampling。 | safe output / not truth 为 P0;backend 产品后移。 |
| report pairing | `report-generation-audit`;release report audit。 | archive product、retention policy、human review workflow。 | run-scoped pairing / no latest / no static evidence direction。 |

### 5. 重复断言 / 交叉风险审计表

| 重复断言族 | 出现专项 | 审计结论 | 处理 |
|---|---|---|---|
| body-free / no raw body | 性能降级、security/redaction、observability/report。 | acceptable | 横切红线,按输出面 / 故障面 / report 面重复覆盖。 |
| observability not truth | security boundary、recovery proof、observability。 | acceptable | 分别覆盖 truth ownership、recovery source、observable material。 |
| marker copy-only / source missing stop | availability、redaction/dependency、recovery、observability。 | acceptable_with_source_watch | formal source 缺失时停审,不得伪覆盖。 |
| report body-free / report pairing | recovery job、observability/report audit。 | acceptable | recovery 关注 no rebuild/report missing;report audit 关注 pairing/no static evidence。 |
| no truth repair | availability、job recovery、operations fact。 | acceptable | 外围 failure、job execution、operations fact 均需保持。 |
| suite 重叠 | `service-flow-fast`、`operations-replay-core`、`redaction-boundary`、`observability-boundary` 多专项复用。 | acceptable | suite 是执行载体,专项是风险视角;release smoke 不替代底层 suite。 |

### 6. source gap / evidence 后移表

| 后移项 | 后移 owner | Step 10 处理 | 是否阻塞 Step 10 |
|---|---|---|---|
| artifact/report JSON 字段、case schema、assertion item key | Step 13 | 只写 artifact/report direction、pairing、no latest、no static evidence。 | 否,但阻塞正式 evidence schema。 |
| evidence ID、retention、review status、archive path | Step 13 / Step 12 / `06` | 只写 evidence direction。 | 否。 |
| release veto / acceptance verdict | Step 12 / `06-验收标准.md` | 只写阻断方向,不写验收裁决。 | 否。 |
| defect severity / retest rule | Step 11 | 只写 Step 11 进入门禁。 | 否。 |
| CI YAML、scripts、required checks | Step 9 / `07` / implementation plan | 只引用 suite/gate family。 | 否。 |
| metric/log/span/audit schema | owning design / Step 13 / implementation plan | 只写安全输出和低基数方向。 | 否。 |
| config key、secret provider、backend product、dashboard、alert | `04` / `07` / ops owner | 不补配置或产品。 | 否。 |
| formal marker/source/stored surface/checkpoint/report source 缺失 | owning design source | 记录停审规则;不得合成。 | 是,若具体用例落码时发现缺口。 |

### 7. Step 10 completed stop-review

| 检查项 | 结果 |
|---|---|
| 是否完成 Step 10 全部分批 R10.1~R10.12 | pass |
| 是否覆盖性能 / 可用性 / 降级、安全 / redaction / dependency、一致性 / 幂等 / 恢复、可观测性 / 审计 / report pairing | pass |
| 是否完成 NFR 覆盖、阈值来源、P0/P1 边界、suite 映射和重复断言审计 | pass |
| 是否明确无来源性能数字不得硬化 | pass |
| 是否明确 formal marker/source、stored surface、checkpoint/report source 缺失时停审 | pass |
| 是否明确 evidence / artifact / report schema、验收裁决、缺陷分级、复验规则、进入/退出准则后移 | pass |
| 是否未新增 TC、DS、环境、suite、config key、marker source、port、mapper、state、schema 或 phase boundary | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

### 8. Step 11 进入门禁

| 门禁项 | 裁决 |
|---|---|
| Step 10 是否可作为 `05-测试方案.md` §10 装配输入 | pass |
| Step 11 当前是否允许开始 | wait_user_confirm |
| Step 11 首个模块 | `R11.1 defects / retest:先思考` |
| Step 11 允许主题 | 缺陷分级、复验规则、一票否决缺陷、风险接受、修复后回归用例、缺陷关闭证据、新增自动化防回归的思考。 |
| Step 11 禁止主题 | 正式 `05-测试方案.md`、evidence schema、artifact/report JSON 字段、进入/退出准则、验收标准、实施计划、implementation code。 |

next_allowed_action: Step 10 completed;等待用户确认后进入 Step 11 `R11.1 defects / retest:先思考`;只允许思考缺陷分级、复验规则、一票否决缺陷、风险接受、修复后回归用例、缺陷关闭证据、新增自动化防回归和 R11.2 写入边界;不得直接修改正式 `05-测试方案.md`;不得定义正式 evidence schema、artifact/report JSON 字段、验收标准、实施计划或 implementation code。
