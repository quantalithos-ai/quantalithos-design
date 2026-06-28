# Step 11. 定义缺陷管理与复验规则

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 11
> 回填章节: `05-测试方案.md` §11 缺陷管理与复验规则
> 创建日期: 2026-06-28
> 当前模式: full-restart / step11-defects-retest
> 当前状态: completed
> 当前模块: `R11.2 defects / retest:再写入`
> 当前门禁: `R11.2` completed_wait_user_confirm_to_R12.1;等待确认进入 Step 12 `R12.1 entry / exit criteria:先思考`

---

## 0. Step 10 handoff

Step 10 已确认当前 `05-测试方案.md` 的专项测试与非功能验证输入:

- NFR-ML-001~003 只支持结构性性能、sample / trend 和一致性优先判断,不得硬化无来源 P95 / SLO / capacity 数字。
- NFR-ML-004~006 已覆盖 fake / controlled / replay 下的 fail-fast、fail-closed、rejected、degraded、delayed、failed marker、no activation 和 test fail-fast。
- NFR-ML-007~008 已覆盖 raw body / secret / full sensitive ref、artifact/archive body-free、downstream bypass truth 和 dependency boundary。
- NFR-ML-009~011 已覆盖 audit refs-only、operations fact、report pairing、no static evidence 和 run-scoped direction,正式 evidence schema 留 Step 13。
- NFR-ML-012~014 已覆盖 duplicate no-rerun、query no-write、UoW rollback、commit unknown、stored surface missing、version conflict 和 job no truth repair。
- NFR-ML-015~016 已覆盖 safe log、metric low-cardinality、trace/span body-free 和 observability not truth,backend / metric / span schema 后移。
- formal marker/source、stored surface、checkpoint/report source 缺失时必须停审,不得由测试、fixture、fake、log、metric 或 raw error 合成。
- Step 10 不定义缺陷分级、复验规则、进入/退出准则、验收裁决、正式 evidence schema 或 implementation code。

Step 11 的任务是把 Step 6 用例、Step 9 自动化门禁和 Step 10 专项红线转成缺陷分级、风险接受、复验和关闭规则。它不得提前定义 Step 12 进入/退出准则、Step 13 evidence schema、`06-验收标准.md` 验收裁决或 `07-实施计划.md` 实施门禁。

---

## R11.1 defects / retest:先思考

### 1. 当前模块目标

`R11.1` 只思考 Step 11 的开工边界、必读文档、SOP 五问、L1-governance Step 11 框架参考、L3-method-library 的缺陷分级候选、S 级阻断候选、风险接受边界、复验维度、缺陷关闭证据、新增自动化防回归触发和 `R11.2` 写入边界。

当前模块不写最终缺陷分级表、最终复验矩阵、正式 evidence schema、artifact/report JSON 字段、进入/退出准则、验收标准、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R11.2 |
| 用户确认 | 已确认从 Step 10 completed 推进到 Step 11 `R11.1`。 |
| 当前允许 | 思考缺陷分级、S 级阻断、风险接受、修复后回归、缺陷关闭证据、新增自动化防回归和 R11.2 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写 Step 12 进入/退出准则;定义 evidence / artifact / report schema、验收标准、实施计划、CI YAML、required check 或 implementation code。 |

### 2. Step 11 启动前必须承接

| 输入 | 必须承接的内容 | 禁止继承 / 禁止提前 |
|---|---|---|
| `project_execution_ledger.md` | 当前恢复点和单模块推进规则。 | 跳过 R11.1 直接写完整 Step 11 或正式 `05`。 |
| `05_test_plan_calibration_flow.md` | Step 1~10 completed,Step 11 in_progress,Step 12+ blocked。 | 在 Step 11 写进入/退出准则或验收裁决。 |
| `05_test_plan_step_06_cases.md` | 83 条 `TC-ML-*` 候选用例、P0 用例族、source blocker 和 evidence candidate 后移。 | 新增 TC、改写断言或固定正式 EV。 |
| `05_test_plan_step_09_automation_gates.md` | P0 blocking suite、release check、artifact/report direction、no latest、no static evidence。 | 定义 CI YAML、required check、脚本实现或 artifact schema。 |
| `05_test_plan_step_10_nonfunctional.md` | NFR 覆盖、阈值来源、P0/P1 边界、redaction/dependency/report/source gap 收口。 | 把 sample/trend 写成硬性能缺陷或补 marker/source。 |
| `00-需求文档.md` §14.2 | 一票否决项:truth 归属、正式版本稳定、下游不可替代、边界外正文禁入、追溯、源码依赖、外围增强和 observability truth 替代。 | 使用旧 `05/06/07` 的一票否决或旧 MethodContent 口径。 |
| SOP Step 11 | 固定缺陷分级表、复验规则和五个问题。 | 只写口号式“修复后回归”。 |
| 书写规范 §5.11 | 固定 S / A / B 分级表和复验规则必须说明回归用例、新增自动化、验收证据影响。 | R11.1 不直接写最终表。 |
| L1-governance Step 11 | 参考分级、S 级阻断、复验矩阵、风险接受、关闭证据和防回归框架深度。 | 复制 governance 的 VF、TC、suite、业务对象或领域事实。 |

### 3. SOP Step 11 五问思考

| SOP 问题 | R11.1 初判 | R11.2 写入提醒 |
|---|---|---|
| 哪些缺陷属于 S 级阻断? | 一票否决项、P0 truth / boundary / redaction / dependency / evidence integrity / source missing stop 被破坏,或 P0 blocking suite 无法给出可信失败/通过证据时,应进入 S 级候选。 | 写 S 级阻断判定表,但不得写 Step 12 退出准则。 |
| 哪些缺陷可以风险接受? | 只允许 P1/P2 residual、无正式阈值的性能 sample/trend、真实外部产品 selected-run unavailable、报告可读性不影响 raw artifact 的问题进入风险接受候选。 | 写风险接受规则,明确 P0 truth/redaction/dependency/evidence/source gap 不可接受。 |
| 修复后必须回归哪些用例? | 至少回归原失败 TC、同 family TC、所属 suite、相关 release check。共享契约、redaction、dependency、report pairing、query no-write、job no truth repair 影响面要扩大回归。 | 写复验矩阵,但不写实现仓命令或 CI required check。 |
| 缺陷关闭需要哪些证据? | 需要缺陷记录、失败前后 run / artifact / report 方向、修复说明、复验 suite status、redaction/dependency/report audit 结果和是否新增防回归的说明。 | 只写证据类型和方向,正式 JSON 字段、路径和值域留 Step 13。 |
| 是否需要新增自动化防回归? | 手工发现 P0、release smoke 发现但底层 suite 未覆盖、redaction/dependency/report audit 漏检、source gap 被绕过、P0 negative assertion 缺失时必须新增或扩展自动化候选。 | 写触发规则,不新增 TC / DS / suite / script。 |

### 4. L1-governance Step 11 框架参考思考

L1-governance Step 11 的可借鉴点是“把一票否决、P0 blocking suite、证据真实性、redaction / dependency 红线和复验范围绑定到缺陷分级”。L3 采用框架,不复制 governance 领域事实。

| L1 框架点 | L3 采用方式 | L3 禁止 |
|---|---|---|
| S / A / B / R 分层 | L3 可采用 S/A/B/R 或 S/A/B + residual 风险表达,用于区分不可接受缺陷、主线风险、一般缺陷和范围外残余风险。 | 复制 VF-GOV、Policy / Decision / Nonconformity 领域事实。 |
| 一票否决不得降级 | L3 将 `00` §14.2 的一票否决项映射为 S 级候选。 | 把 truth 归属、版本静默覆盖、下游替代定义真相降级为普通风险。 |
| 修复后回归同 family / suite / check | L3 按 TC family、suite family、release check family 思考复验范围。 | 只跑单个失败测试就关闭 P0 缺陷。 |
| 关闭必须有失败前后证据 | L3 只写证据类型和 run-scoped 方向。 | 写正式 EV ID、artifact JSON key、case schema 或 report 模板。 |
| 手工发现 P0 必须补自动化 | L3 保留该原则,但新增自动化的具体 TC / suite / script 后续按 owning Step 回写。 | 在 Step 11 直接新增 TC、DS、suite 或脚本。 |

### 5. L3 缺陷分级候选思考

| 候选级别 | 初步定义 | L3 示例族 | R11.2 注意 |
|---|---|---|---|
| S | 一票否决、P0 truth / boundary / security / evidence integrity 破坏,或 P0 阻断证据失真。 | 定义真相不归属本仓、正式版本静默覆盖、下游替代定义、raw body/secret 泄露、non-core compile dependency、static evidence 伪通过。 | 不允许风险接受,但具体退出阻断留 Step 12 / `06`。 |
| A | P0 主线或 blocking suite 风险,未命中一票否决但影响核心闭环可信证明。 | command/query/job flow 编排错误、controlled seam failure、candidate report 缺失、P0 suite flaky / timeout。 | 可要求修复或经明确接受后临时风险接受,但不得覆盖 S。 |
| B | P1/P2、selected-run、文档可读性、报告体验或非阻断维护性问题。 | production-like load 不可用、旧 P95 候选未达但无正式阈值、report 文案不清但 raw artifact 完整。 | 不计 P0 pass,需记录 residual。 |
| R | 范围外、future 或设计未闭口风险。 | secret provider 产品、真实外部 SLA、dashboard/alert、capacity benchmark、未闭合 marker/source/schema。 | 不得伪装为已验证;source gap 必须回 owning design。 |

### 6. S 级阻断候选思考

| S 级候选 | 来源 | R11.1 判断 |
|---|---|---|
| 方法资产定义真相不能明确归属本仓 | `00` §14.2;BR-ML-001~005 | 一票否决,应为 S。 |
| 正式版本语义被静默覆盖或未正式化资产进入正式消费 | `00` §14.2;BR-ML-004 / 007 / 009~011 | 一票否决,应为 S。 |
| 下游消费仓创建、修改或替代方法资产定义真相 | `00` §14.2;BR-ML-005 / 008 / 012~018 | 一票否决,应为 S。 |
| 边界外正文或运行真相进入本仓 truth | `00` §14.2;NFR-ML-007~008 | 一票否决,应为 S。 |
| formal trace / evidence lineage 不可追溯 | `00` §14.2;FR-ML-007~009;NFR-ML-009~011 | 一票否决或 P0 evidence integrity,应为 S。 |
| non-core sibling compile dependency | Step 8 / Step 9 / Step 10 | P0 dependency boundary 阻断,应为 S。 |
| raw body / secret / full sensitive ref 泄露 | Step 6 / Step 9 / Step 10 | P0 redaction 阻断,应为 S。 |
| artifact/report pairing 缺失、no latest 违背或 static evidence 伪 pass | Step 9 / Step 10 | P0 evidence integrity,应为 S。 |
| duplicate rerun、query write、job truth repair 或 observability truth 替代 | Step 6 / Step 10;NFR-ML-012~016 | P0 consistency / truth boundary,应为 S。 |
| marker/source/stored surface/checkpoint/report source 缺失时被测试或实现私补 | Step 6 / Step 10 source gap | source-missing stop 被绕过,应为 S 或 design blocker。 |

### 7. 风险接受边界思考

| 风险族 | 是否可接受候选 | 原因 |
|---|---|---|
| P0 truth ownership、Definition vs Use、version stability | 否 | 命中一票否决或核心闭环。 |
| redaction、dependency boundary、artifact/report integrity | 否 | 安全 / 边界 / 证据真实性不可降级。 |
| source missing stop 被绕过 | 否 | 违反不得自行补 schema/marker/source/port 的全局规则。 |
| P0 suite flaky / timeout | 原则上否 | P0 deterministic suite 无法证明可信结果;若确认为测试脚本缺陷,也必须修复脚本并复验。 |
| 性能 sample/trend 未达旧候选数字 | 是,仅 residual | 当前无正式 P95/SLO/capacity 数字。 |
| P1 selected-run unavailable | 是 | 不计入 P0 closure,记录 residual。 |
| 真实外部产品 / production-like / dashboard / alert 未覆盖 | 是 | Step 8/10 已标 P1/P2 或后移。 |
| 报告可读性问题 | 条件接受 | 仅当 raw artifact、report pairing 和 P0 断言完整。 |

### 8. 复验维度思考

| 缺陷触发面 | 复验应覆盖 | R11.2 写入提醒 |
|---|---|---|
| contract / domain / object invariant | 原 TC、同 family TC、`contract-domain-fast`。 | 若输出 surface 或 safe message 改变,同步 redaction check。 |
| command / query / consumer / outbound / job flow | 原 TC、同 flow family、`service-flow-fast` 或 `entry-worker-job`。 | query no-write、duplicate replay、job no truth repair 需回归关联用例。 |
| UoW / recovery / replay / report | 原 TC、recovery family、`operations-replay-core`。 | report pairing / no static evidence 相关时必须复验 report audit。 |
| config / profile / dependency | 原 TC、`config-redline`、`dependency-boundary`。 | 不新增 config key 或 manifest schema。 |
| redaction / observability / audit | 原 TC、`redaction-boundary`、`observability-boundary`、report audit。 | 不定义 scanner pattern、metric name 或 span schema。 |
| release smoke | release scenario、受影响底层 suite、release redaction/dependency/report audit。 | release smoke 不可替代底层 suite。 |

### 9. 缺陷关闭证据思考

| 证据类型 | R11.1 判断 | 后续 owner |
|---|---|---|
| 缺陷记录和影响范围 | Step 11 可要求必须存在。 | 缺陷系统字段不在本 Step 固定。 |
| 失败前后 run / artifact / report 方向 | Step 11 可要求方向,不得定义字段。 | Step 13 定义正式 schema / path / retention。 |
| 修复说明和变更范围 | Step 11 可要求。 | 实施计划 / review 流程承接具体格式。 |
| 复验 TC / suite status | Step 11 可要求。 | Step 9 suite family 与 Step 13 report 承接。 |
| redaction / dependency / report audit 结果 | 相关缺陷必须要求。 | Step 9 / Step 13 承接 schema。 |
| 是否新增防回归自动化 | Step 11 可要求说明。 | 新增 TC/DS/suite/script 必须回 owning Step。 |
| 风险接受人和理由 | 对 B/R 或少数 A 候选可要求。 | Step 12 / `06` 决定退出和验收裁决。 |

### 10. 自动化防回归触发思考

| 触发 | R11.1 判断 |
|---|---|
| 手工发现 P0 缺陷 | 必须新增或扩展自动化候选,不能长期手工兜底。 |
| release smoke 发现但底层 suite 未发现 | 必须把断言下沉到对应底层 suite family。 |
| redaction / dependency / report audit 漏检 | 必须扩展对应 check family 候选,但不在 Step 11 写 scanner/schema/script。 |
| duplicate / idempotency / UoW / job no truth repair 缺陷复发 | 必须补 recovery / replay / fault injection 用例候选。 |
| source-missing stop 被绕过 | 必须补设计门禁 / source guard 候选,并回 owning design source。 |
| P1/P2 residual 升级为 P0 | 必须先回写测试范围、数据、环境、suite 和 gate,再新增自动化。 |

### 11. R11.2 写入边界思考

`R11.2 defects / retest:再写入` 可以写入:

1. Step 11 必读文档表和读取状态。
2. Step 10 handoff 承接表。
3. SOP Step 11 五问回答。
4. L1-governance Step 11 框架参考边界。
5. L3 缺陷分级表和 S 级阻断判定表。
6. 修复后复验矩阵。
7. 风险接受规则。
8. 缺陷关闭证据清单。
9. 自动化防回归新增规则。
10. source gap / evidence 后移表。
11. Step 11 completed stop-review 和 Step 12 进入门禁。

`R11.2` 禁止写入:

1. 正式 `05-测试方案.md`。
2. Step 12 进入/退出准则正文或最终验收裁决。
3. 正式 evidence ID、artifact/report JSON 字段、case schema、assertion item key、retention、review status。
4. 新增 TC、DS、环境、suite、config key、marker source、port、mapper、state、schema、CI YAML、script implementation、required check 或 phase boundary。
5. `06-验收标准.md`、`07-实施计划.md` 或 implementation code。

### 12. R11.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 Step 11 缺陷管理与复验规则 | pass |
| 是否承接 Step 6 / Step 9 / Step 10 已确认输入 | pass |
| 是否读取并对照 SOP Step 11 和书写规范 §5.11 | pass |
| 是否参考 L1-governance 框架但未复制领域事实 | pass |
| 是否形成 L3 缺陷分级、S 级阻断、风险接受、复验、关闭证据和防回归思考 | pass |
| 是否形成 R11.2 写入边界 | pass |
| 是否未写最终缺陷分级表、复验矩阵、进入/退出准则或 evidence schema | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.2 defects / retest:再写入`;只允许写入 Step 11 必读文档表、Step 10 handoff 承接、SOP 五问回答、缺陷分级表、S 级阻断判定表、修复后复验矩阵、风险接受规则、缺陷关闭证据清单、自动化防回归新增规则、source gap / evidence 后移表、Step 11 completed stop-review 和 Step 12 进入门禁;不得直接修改正式 `05-测试方案.md`;不得定义正式 evidence schema、artifact/report JSON 字段、进入/退出准则、验收标准、实施计划或 implementation code。

---

## R11.2 defects / retest:再写入

### 1. 当前模块写入目标

`R11.2` 将 R11.1 的思考固化为 Step 11 的缺陷管理与复验规则中间产物。当前模块只写 Step 11 必读文档、Step 10 handoff、SOP 五问、缺陷分级、S 级阻断、复验矩阵、风险接受、关闭证据、防回归新增、source gap / evidence 后移、Step 11 completed stop-review 和 Step 12 进入门禁。

当前模块不修改正式 `05-测试方案.md`,不定义进入/退出准则正文、正式 evidence ID、artifact/report JSON 字段、case schema、assertion item key、retention、review status、验收标准、实施计划、CI YAML、required check、实现仓测试函数名或 implementation code。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R12.1 |
| 用户确认 | 已确认从 `R11.1` 推进到 `R11.2`。 |
| 当前允许 | 写入缺陷分级、S 级阻断、复验、风险接受、关闭证据、防回归和 Step 12 进入门禁。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写 Step 12 进入/退出准则正文;定义 evidence / artifact / report schema、验收标准、实施计划或 implementation code。 |

### 2. 必读文档表与读取状态

| 文档 | 读取状态 | Step 11 用途 | 当前裁决 |
|---|---|---|---|
| `project_execution_ledger.md` | 已读取并承接 | 确认当前恢复点、单模块推进和正式 05 不得跳写。 | 本轮只推进 `R11.2`。 |
| `05_test_plan_calibration_flow.md` | 已读取并承接 | 确认 Step 1~10 completed、Step 11 R11.1 completed、Step 12+ blocked。 | `R11.2` 完成后等待 `R12.1`。 |
| `05_test_plan_step_06_cases.md` | 已承接 | 提供 83 条 `TC-ML-*` 候选用例、P0 用例族、source blocker 和 evidence candidate 后移。 | 不新增或改写 TC。 |
| `05_test_plan_step_09_automation_gates.md` | 已承接 | 提供 P0 blocking suite、release check、artifact/report direction、no latest、no static evidence。 | 不定义 CI YAML、required check 或脚本。 |
| `05_test_plan_step_10_nonfunctional.md` | 已承接 | 提供 NFR 覆盖、阈值来源、P0/P1 边界、redaction/dependency/report/source gap 收口。 | 不把后移项写成已闭合 schema。 |
| `00-需求文档.md` §14.2 | 已读取 | 提供本仓一票否决项。 | 一票否决不得降级。 |
| SOP Step 11 | 已读取 | 固定缺陷分级表、复验规则和五个问题。 | Step 11 输出必须可执行。 |
| 书写规范 §5.11 | 已读取 | 固定 S / A / B 分级和复验规则要说明回归用例、新增自动化、验收证据影响。 | 正式 §11 留 Step 15 装配。 |
| L1-governance Step 11 | 已对照 | 参考表格密度、分级、复验、风险接受、证据和防回归框架。 | framework reference only。 |

### 3. Step 10 handoff 承接表

| Step 10 输出 | Step 11 承接方式 | 当前状态 |
|---|---|---|
| P0 redaction / dependency / report pairing / no static evidence 为阻断方向 | 映射为 S 级候选和不可风险接受项。 | pass |
| marker/source、stored surface、checkpoint/report source 缺失必须停审 | 映射为 source-missing stop 缺陷或 design blocker,不得由测试私补。 | pass |
| performance 只有 sample/trend 和结构性判断 | 无正式阈值时不得定为 S/A 性能缺陷。 | pass |
| P1 selected-run / production-like / real-like 为 residual | 可风险接受,但不得计入 P0 closure。 | pass |
| evidence / artifact / report schema 留 Step 13 | Step 11 只要求证据类型和方向,不写字段。 | pass |
| release veto / acceptance verdict 留 Step 12 / `06` | Step 11 只写缺陷阻断方向,不写退出准则或验收裁决。 | pass |

### 4. SOP 五问回答

| SOP 问题 | Step 11 回答 |
|---|---|
| 哪些缺陷属于 S 级阻断? | 一票否决项、P0 truth / boundary / redaction / dependency / evidence integrity 破坏、source-missing stop 被绕过、P0 blocking suite 无可信 artifact/report、query/write/job/observability 反写真相或静态证据伪 pass,均为 S 级候选。 |
| 哪些缺陷可以风险接受? | 只允许 P1/P2 residual、无正式阈值的性能 sample/trend、真实外部产品 selected-run unavailable、非阻断报告可读性和范围外 future 风险接受。P0 truth、redaction、dependency、evidence integrity、source missing stop 不可接受。 |
| 修复后必须回归哪些用例? | 至少回归原失败 TC、同 family TC、所属 suite 和相关 release check。共享契约、query no-write、duplicate replay、job no truth repair、redaction、dependency、report pairing 的修复必须扩大到相关 suite。 |
| 缺陷关闭需要哪些证据? | 必须有缺陷记录、影响范围、失败前后 run / artifact / report 方向、修复说明、复验 TC / suite status、相关 redaction/dependency/report audit 结果和是否新增防回归说明。正式字段和值域留 Step 13。 |
| 是否需要新增自动化防回归? | 手工发现 P0、release smoke 发现但底层 suite 未覆盖、redaction/dependency/report audit 漏检、source gap 被绕过、P0 negative assertion 缺失或 P1/P2 升级为 P0 时必须新增或扩展自动化候选。 |

### 5. 缺陷分级表

| 级别 | 定义 | 示例 | 处理要求 | 是否阻断 |
|---|---|---|---|---|
| S | 一票否决、P0 truth / boundary / security / evidence integrity 破坏,或 P0 阻断证据失真。 | 定义真相不归属本仓;正式版本静默覆盖;raw body/secret 泄露;non-core compile dependency;static evidence 伪 pass;source missing stop 被绕过。 | 必须修复;不得风险接受;必须复验相关 blocking suite / release check;关闭必须有失败前后证据方向。 | 是 |
| A | P0 主线或 blocking suite 风险,未命中 S,但影响核心闭环可信证明。 | P0 suite flaky / timeout;flow 编排错误;controlled seam failure;candidate report 缺失;复验证据不完整。 | 必须修复或经明确接受后临时风险接受;修复后回归原 TC、同 family 和所属 suite。 | 视情况;release 前通常阻断 |
| B | P1/P2、selected-run、文档可读性、非阻断报告体验或可维护性问题。 | production-like selected-run unavailable;报告文字不清但 raw artifact 完整;无正式阈值性能 sample 偏高。 | 可排期处理或风险接受;不得影响 P0 pass。 | 否 |
| R | 范围外、future、设计未闭口或 residual 风险。 | secret provider 产品、真实外部 SLA、capacity benchmark、dashboard/alert、未闭合 marker/source/schema。 | 记录 residual 和 owner;不得伪装为已验证;若变成 P0 必须回写前序 Step。 | 否 |

### 6. S 级阻断判定表

| 触发条件 | 对应来源 | 判定 |
|---|---|---|
| 方法资产定义真相不能明确归属本仓 | `00` §14.2;BR-ML-001~005 | S |
| 正式版本语义被静默覆盖 | `00` §14.2;BR-ML-004 / 010 | S |
| 未正式化或不稳定方法资产作为正式消费依据 | `00` §14.2;BR-ML-007 / 009 | S |
| 下游消费仓创建、修改或替代方法资产定义真相 | `00` §14.2;BR-ML-005 / 008 / 012~018 | S |
| process / identity / governance / capability-hub / marketplace / UI / artifact/archive / auth 正文进入本仓 truth | `00` §14.2;NFR-ML-007~008 | S |
| 正式化、版本语义变化、消费影响变化或证据线索不可追溯 | `00` §14.2;FR-ML-007~009;NFR-ML-009~011 | S |
| 运行期依赖或事件协作依赖被写成源码级拥有关系 | `00` §14.2;Step 8 / Step 9 dependency boundary | S |
| 外围增强能力成为核心闭环前置 | `00` §14.2;NFR-ML-004~006 | S |
| 可观测材料替代方法资产定义真相 | `00` §14.2;NFR-ML-016 | S |
| raw body / secret / full sensitive ref 泄露到 log / trace / report / artifact / evidence candidate | Step 6 / Step 9 / Step 10 | S |
| artifact/report pairing 缺失、引用 `latest` 或 static evidence 伪 pass | Step 9 / Step 10 | S |
| duplicate rerun、query write、job truth repair、recovery 从 observability 重建 truth | Step 6 / Step 10;NFR-ML-012~016 | S |
| marker/source/stored surface/checkpoint/report source 缺失时被测试、fixture、fake 或实现私补 | Step 6 / Step 10 source gap | S 或 design blocker |

### 7. 修复后复验矩阵

| 缺陷触发面 | 必跑用例 / suite family | 必要复验方向 | 关闭证据方向 |
|---|---|---|---|
| contract / domain / object invariant | 原 TC + same family + `contract-domain-fast` | schema / invariant / safe surface;相关时 redaction。 | suite report direction + case artifact direction。 |
| command / application flow / UoW | 原 TC + command family + `service-flow-fast` | accepted/rejected、rollback、commit unknown、duplicate replay。 | service suite report + UoW assertion artifact direction。 |
| query / visibility / no-write | 原 TC + query family + `service-flow-fast` | query no-write、degraded/stale marker copy-only、no repair。 | query report + write-audit direction。 |
| inbound / outbound / handoff | 原 TC + consumer/outbound/handoff family + `entry-worker-job` | safe response / disposition、failed/delayed marker、no raw transport body。 | entry/worker/job report direction。 |
| replay / recovery / operations job | 原 TC + recovery/job family + `operations-replay-core` | stored replay、checkpoint/report、partial failure、no truth repair。 | replay artifact + job report direction。 |
| config / profile | 原 TC + `config-redline` | fail-fast、no silent fallback、profile isolation、no forbidden override。 | config validation report direction。 |
| dependency boundary | 原 TC + `dependency-boundary` + release dependency check | only `core-contracts` compile dependency、runtime/event/replay boundary。 | dependency report direction。 |
| redaction / observability / audit | 原 TC + `redaction-boundary` / `observability-boundary` | no raw body/secret、metric low-cardinality、trace/audit refs-only。 | redaction / observability report direction。 |
| artifact/report integrity | failing report audit + `report-generation-audit` | artifact/report pairing、no latest、no static evidence、failed reason retained。 | report audit direction。 |
| release smoke | original scenario + affected lower suite + release checks | release smoke representative only;lower suite must pass separately。 | release summary + lower suite report direction。 |

### 8. 风险接受规则

| 项 | 是否可风险接受 | 条件 |
|---|---|---|
| S 级缺陷 | 否 | 必须修复和复验。 |
| 一票否决项命中 | 否 | 不得降级为普通风险。 |
| P0 redaction / dependency / evidence integrity | 否 | 安全、边界和证据真实性不可接受。 |
| source missing stop 被绕过 | 否 | 需要回 owning design source 或标 design blocker。 |
| P0 blocking suite failure | 原则上否 | 只有证明为测试脚本缺陷且 P0 语义另有可信 artifact 方向时,可临时标 A 并必须修脚本。 |
| 性能 sample/trend 未达旧候选数字 | 是 | 当前无正式 P95/SLO/capacity 阈值。 |
| P1 selected-run unavailable | 是 | 不计入 P0 closure,记录 residual。 |
| production-like / real external product / dashboard / alert 未覆盖 | 是 | 当前为 P1/P2 或后移项。 |
| 报告可读性问题 | 条件接受 | raw artifact、report pairing 和 P0 断言必须完整。 |
| R 级 future 风险 | 是 | 必须记录 owner、触发条件和回写要求。 |

### 9. 缺陷关闭证据清单

| 证据类型 | S 级 | A 级 | B/R 级 |
|---|---|---|---|
| 缺陷记录和影响范围 | 必需 | 必需 | 必需 |
| 失败前 run / artifact / report 方向 | 必需 | 必需 | 可选,视是否有执行 |
| 修复说明和变更范围 | 必需 | 必需 | 可选 |
| 修复后 TC / suite status | 必需 | 必需 | 可选 |
| redaction / dependency / report audit 结果 | 相关即必需;安全/证据类必需 | 相关即必需 | 可选 |
| 是否新增防回归说明 | 必需 | 必需 | 可选 |
| 风险接受人 / 接受理由 | 不允许 | 若接受则必需 | 必需 |
| Step 13 evidence candidate 更新说明 | 若影响证据则必需 | 若影响证据则必需 | 可选 |

### 10. 自动化防回归新增规则

| 触发 | 要求 |
|---|---|
| 手工发现 P0 缺陷 | 必须新增或扩展自动化候选。 |
| release smoke 发现但底层 suite 未发现 | 必须把断言下沉到对应底层 suite family。 |
| redaction leak 未被 redaction check 捕获 | 必须扩展 redaction check 候选;scanner schema 后移。 |
| non-core dependency 越界未被 dependency check 捕获 | 必须扩展 dependency boundary check 候选;graph schema 后移。 |
| artifact/report static pass 或 pairing 漏检 | 必须扩展 report-generation-audit 候选。 |
| duplicate / idempotency / UoW / job no truth repair 缺陷复发 | 必须补 recovery / replay / fault injection 用例候选。 |
| source-missing stop 被绕过 | 必须补 source guard / design gate 候选,并回 owning design source。 |
| P1/P2 residual 升级为 P0 | 必须先回写范围、用例、数据、环境、suite 和 gate,再新增自动化。 |

### 11. source gap / evidence 后移表

| 后移项 | 后移 owner | Step 11 处理 | 是否阻塞 Step 11 |
|---|---|---|---|
| artifact/report JSON 字段、case schema、assertion item key | Step 13 | 只要求证据类型和方向。 | 否 |
| evidence ID、retention、review status、archive path | Step 13 / Step 12 / `06` | 不定义正式 EV 或归档规则。 | 否 |
| 进入/退出准则、release veto、acceptance verdict | Step 12 / `06-验收标准.md` | 只写缺陷分级和复验规则。 | 否 |
| CI YAML、script implementation、required checks | Step 9 / `07` / implementation plan | 只引用 suite/check family。 | 否 |
| 新增 TC / DS / suite / environment / profile | owning Step 6~9 | Step 11 只写触发条件,不直接新增。 | 否 |
| marker/source/stored surface/checkpoint/report source 缺失 | owning design source | 记录 S 或 design blocker;不得私补。 | 是,若实际复验需要该 source 才能判定。 |
| 缺陷系统字段、审批角色、排期 workflow | project process / implementation plan | 只要求记录和接受人方向。 | 否 |

### 12. Step 11 completed stop-review

| 检查项 | 结果 |
|---|---|
| 是否完成 Step 11 R11.1~R11.2 | pass |
| 是否输出缺陷分级表 | pass |
| 是否输出 S 级阻断判定表 | pass |
| 是否输出修复后复验矩阵 | pass |
| 是否输出风险接受规则 | pass |
| 是否输出缺陷关闭证据清单 | pass |
| 是否输出自动化防回归新增规则 | pass |
| 是否明确 evidence / artifact / report schema、进入/退出准则、验收裁决后移 | pass |
| 是否未新增 TC、DS、环境、suite、config key、marker source、port、mapper、state、schema 或 phase boundary | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

### 13. Step 12 进入门禁

| 门禁项 | 裁决 |
|---|---|
| Step 11 是否可作为 `05-测试方案.md` §11 装配输入 | pass |
| Step 12 当前是否允许开始 | wait_user_confirm |
| Step 12 首个模块 | `R12.1 entry / exit criteria:先思考` |
| Step 12 允许主题 | 测试进入准则、退出准则、阻断缺陷为 0、P0 suite / evidence / redaction / dependency / report audit 与风险接受状态如何成为可判定门禁的思考。 |
| Step 12 禁止主题 | 正式 `05-测试方案.md`、evidence schema、artifact/report JSON 字段、验收标准、实施计划、implementation code。 |

next_allowed_action: Step 11 completed;等待用户确认后进入 Step 12 `R12.1 entry / exit criteria:先思考`;只允许思考进入准则、退出准则、P0 blocking suite、缺陷状态、风险接受、证据方向、redaction/dependency/report audit 和 R12.2 写入边界;不得直接修改正式 `05-测试方案.md`;不得定义正式 evidence schema、artifact/report JSON 字段、验收标准、实施计划或 implementation code。
