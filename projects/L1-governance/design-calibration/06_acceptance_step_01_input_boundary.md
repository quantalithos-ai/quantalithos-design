# Step 1. 确认验收输入边界

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 1
> 回填章节: `06-验收标准.md` §1 与上游文档的关系声明

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 1 确认验收输入边界 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | `00-需求文档.md`;`01-架构设计.md`;`02-概要设计.md`;`03-详细设计.md`;`04-配置设计.md`;`05-测试方案.md`;验收标准 SOP / 书写规范 |
| 输出文件 | `projects/L1-governance/design-calibration/06_acceptance_step_01_input_boundary.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 2 |

## 2. 本步目标

确认新版 `06-验收标准.md` 需要承接哪些需求、设计、测试、配置、证据和交付输入,以及哪些内容不应由验收标准重新定义。

本 Step 只回答:

- 本轮验收依据哪些上游正式文档。
- 哪些测试证据会支撑验收裁决。
- 哪些交付版本、环境、数据和 report path 需要在后续 Step 固定。
- 哪些内容属于测试方案、实施计划或部署运维,不应写进验收标准。
- 当前是否存在阻塞验收标准生成的上游缺口。

本 Step 不定义具体验收项、不固定真实 `run_id`、不填写测试执行结果、不裁决通过 / 有条件通过 / 不通过。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `projects/L1-governance/00-需求文档.md` | 已重建 | 提供 C-GOV、FR-GOV、BR-GOV、AC-GOV、VF-GOV、数据归属和风险边界 |
| `projects/L1-governance/01-架构设计.md` | 已重建 | 提供 Governance truth、依赖方向、数据所有权、一致性分层和架构红线 |
| `projects/L1-governance/02-概要设计.md` | 已重建 | 提供 10 个主要组成部分、对象轮廓、接口骨架、处理流和状态集合 |
| `projects/L1-governance/03-详细设计.md` | 已重建 | 提供对象契约、port / adapter、DTO、flow、状态矩阵、事务一致性、错误恢复、幂等和观测契约 |
| `projects/L1-governance/04-配置设计.md` | 已重建 | 提供 P0 profile、配置来源、strict validation、adapter binding、故障降级和敏感配置边界 |
| `projects/L1-governance/05-测试方案.md` | 已重建 | 提供 TC-GOV、EV-GOV、suite / gate、artifact/report root、证据真实性和回归策略 |
| `standards/document/验收标准讨论流程_SOP.md` | 标准输入 | 提供 Step 1~15 生成顺序和验收项裁决小循环 |
| `standards/document/验收标准书写规范.md` | 标准输入 | 提供正式 `06` 15 章结构和验收闭环规则 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 标准输入 | 约束验收项不得引用不可落码设计或静态伪证据 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本轮验收依据哪些需求和设计? | 依据新版 `00`~`05`。需求以 C-GOV / FR-GOV / BR-GOV / AC-GOV / VF-GOV 为裁决入口;设计以 Governance truth、对象契约、flow、state matrix、事务一致性、配置和观测为可判定契约。 |
| 哪些测试证据会支撑验收裁决? | 由 `05-测试方案.md` §13 固定的 `EV-GOV-*` 证据族、`artifacts/test/<run_id>` raw artifact、`reports/runs/<run_id>` run reports 和 `reports/acceptance/*` 交接 / VETO / 风险接受草案支撑。 |
| 哪些交付版本、环境和数据会成为基线? | 后续 Step 3 必须固定 design commit、implementation commit、core-contracts commit 或等价 source refs、P0 runtime profile、config digest、test run id、artifact root、report root、数据集 / fixture baseline。当前 Step 不填真实值。 |
| 哪些内容属于测试方案或实施计划,不应写进验收标准? | 具体测试用例展开、fixture builder、CI 脚本实现、commit boundary、任务排期、部署 runbook、真实产品选型和生产操作步骤不进入验收标准正文。 |
| 是否存在阻塞验收标准生成的上游缺口? | 不阻塞 Step 1~2。正式裁决所需的真实 `run_id`、送验版本、reports/acceptance 文件和实际证据状态属于 Step 3 及验收执行前置缺口,不能在设计阶段伪造。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| `06-验收标准.md` | 旧正文仍围绕 GovernanceRequest / Gate / Decision / RiskAcceptance 旧主线 | 标记为历史诊断输入;后续 Step 15 应重建正式 15 章结构 |
| `06-验收标准.md` §4~§7 | 旧证据写作使用 API / DB / audit entry / staging 环境式表达 | 后续必须改为 AC / VF / TC / EV / report path / raw artifact 闭环 |
| `06-验收标准.md` §10 | 旧文档已有最终结论占位 | 后续 Step 14 只定义签署口径,不得在设计阶段填写真实结论 |
| `05-测试方案.md` | 已固定证据族和路径,但没有真实执行 run | Step 3 记录为验收基线待固定项 |
| `00`~`04` | 已提供新版 truth boundary 和可落码设计输入 | 作为正式验收输入 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 验收输入 | 旧 `06` 直接引用旧 02/03/05 和旧主线 | 新版 `06` 输入固定为重建后的 `00`~`05` | 防止旧 GovernanceRequest 主线污染新版验收 |
| 证据来源 | API 响应 / DB 记录 / audit entry 这类泛化证据 | `EV-GOV-*` + fixed report path + raw artifact digest | 支撑可复核裁决 |
| 基线口径 | test / staging 泛化环境 | Step 3 后续固定 run_id、profile、config digest、source refs | 防止使用“最新”或未绑定版本的验收 |
| 文档生成 | 直接修改旧 `06` | 先生成 Step 中间产物,Step 15 再装配正式文档 | 保证逐 Step 审查和追溯 |

## 7. 验收裁决取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否直接修旧 `06` | A. 在旧正文上小修;B. 按 SOP 重建 | 采用 B。旧正文主语和证据结构与新版 `00`~`05` 不一致 |
| 是否在 Step 1 固定真实 run_id | A. 固定;B. 只定义后续基线要求 | 采用 B。当前没有执行结果,不得伪造 |
| 是否把测试用例全集写进 `06` | A. 全量粘贴;B. 只引用 TC / EV / report path | 采用 B。`06` 是裁决文档,不是测试方案 |
| 是否把 P1/P2 作为 P0 验收前置 | A. 是;B. 否 | 采用 B。P1/P2 只进入 residual 或后续升级条件 |

## 8. 结构化中间产物

### 8.1 验收输入映射表

| 来源文档 | 验收输入 | 本文如何裁决 |
|---|---|---|
| `00-需求文档.md` | C-GOV-1~5、FR-GOV-001~010、BR-GOV-001~040、AC-GOV-001~031、VF-GOV-001~010、数据归属和外围增强边界 | 转成 P0 功能门禁、架构红线、一票否决项、风险接受和最终裁决口径 |
| `01-架构设计.md` | Governance truth、正文排除、依赖裁剪、跨仓 runtime/event/handoff 协作、一致性分层 | 转成数据边界与架构红线验收、跨仓同步验收和 VETO |
| `02-概要设计.md` | 10 个主要组成部分、关键对象、接口骨架、处理流、状态集合和配置影响 | 转成功能验收项分组、状态 / 一致性验收主题和范围边界 |
| `03-详细设计.md` | 字段级对象契约、trait / port、DTO、function flow、state matrix、transaction、idempotency、error、observability | 作为每条 P0 验收项的设计契约来源,用于判定通过 / 失败条件 |
| `04-配置设计.md` | `local-dev`、`ci-test`、`integration-like`、`operations-replay` profile, strict validation, adapter binding, secret / no-output, degradation | 转成配置、环境、外部依赖和 redaction / degraded 验收门禁 |
| `05-测试方案.md` | `TC-GOV-*`、`EV-GOV-*`、suite / gate、artifact root、report root、evidence index、VETO draft、regression strategy | 作为验收证据来源和验收结论可复核入口 |

### 8.2 验收标准必须回答的问题

| 问题 | 后续 Step |
|---|---|
| 本轮验收裁决哪些 P0 / P1 / P2 范围? | Step 2 |
| 需求、设计、测试、送验版本、环境、数据和证据基线是什么? | Step 3 |
| 什么时候可以开始 / 结束验收? | Step 4 |
| 每个 P0 功能如何判定通过和失败? | Step 5 |
| 哪些数据边界、架构红线和跨仓边界不可破坏? | Step 6~7 |
| 状态机、事务、幂等、并发和恢复如何判定? | Step 8 |
| 性能、安全、可用性、redaction、dependency 和证据真实性如何判定? | Step 9~10 |
| 哪些问题触发一票否决? | Step 11 |
| 缺陷、复验、放行和风险接受如何影响结论? | Step 12~13 |
| 最终通过 / 有条件通过 / 不通过如何签署? | Step 14 |

### 8.3 验收标准不再回答的问题

| 不回答的问题 | 归属 |
|---|---|
| 新增或修改需求目标、用户故事、业务规则 | `00-需求文档.md` |
| 新增或修改架构边界、依赖方向、数据所有权 | `01-架构设计.md` |
| 新增主要组成部分、对象轮廓或主处理流 | `02-概要设计.md` |
| 新增字段、状态、DTO、port、repository、flow 或 error schema | `03-详细设计.md` |
| 新增配置项、profile、env key、adapter binding | `04-配置设计.md` |
| 设计测试用例、fixture、suite、artifact schema、report script | `05-测试方案.md` / 实现仓测试 |
| 拆分实施 commit、安排开发任务、定义提交信息 | `07-实施计划.md` |
| 生产部署、运维告警、容量 runbook、长期归档策略细节 | `09-部署与运维手册.md` |

### 8.4 后续基线待固定项

| 待固定项 | 后续 Step | 当前处理 |
|---|---|---|
| design commit / implementation commit / core-contracts commit | Step 3 | 只列为必须基线,不填假值 |
| `run_id` | Step 3 | 必须固定到 `artifacts/test/<run_id>` 和 `reports/runs/<run_id>` |
| config digest / runtime profile | Step 3 | 必须来自 P0 profile 和 config validation evidence |
| `reports/acceptance/handoff.md` | Step 3 / Step 10 | 若未生成,记录为送验前置缺口 |
| `reports/acceptance/veto-checklist.md` | Step 10 / Step 11 | 必须由真实 evidence 推导,不得静态 passed |
| `reports/acceptance/risk-acceptance.md` | Step 13 / Step 14 | 有条件通过时必须引用 |

## 9. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_01_input_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“验收输入映射表”“验收标准必须回答的问题”和“后续基线待固定项”小节,了解验收标准输入边界如何收敛。

正式 `06-验收标准.md` §1 应回填:

- 新版验收标准承接 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 和 `05-测试方案.md`。
- 旧 `06-验收标准.md` 只作为历史诊断输入,不得继承旧 GovernanceRequest / Gate / Decision / RiskAcceptance 主线。
- 验收标准回答“什么条件下通过 / 有条件通过 / 不通过”,不重新定义需求、设计、测试用例、实施计划或部署运维。
- 后续验收裁决必须同时闭环到设计契约、`TC-GOV-*`、`EV-GOV-*`、fixed report path 和 raw artifact。
- 真实送验版本、`run_id`、config digest、evidence index 和 `reports/acceptance/*` 必须在 Step 3 及后续 Step 固定,不得在设计阶段伪造。

## 10. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 是否在 Step 15 删除并重建旧 `06-验收标准.md` | 影响正式文档装配方式 | 建议重建,避免旧主线残留 |
| 真实送验版本和 `run_id` | 影响 Step 3 基线和最终裁决 | 当前不填;留到验收执行或送验阶段 |
| `reports/acceptance/*` 最终模板是否由实现仓生成 | 影响 Step 10 / Step 13 / Step 14 | 当前只固定入口和禁止静态通过 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 验收输入和边界清楚 | 通过 | `00`~`05` 和标准输入已映射 |
| 旧文档继承策略明确 | 通过 | 旧 `06` 仅作历史诊断输入 |
| 不应由验收标准回答的问题已排除 | 通过 | 见 §8.3 |
| 后续基线待固定项已列出 | 通过 | 见 §8.4 |
| 可进入 Step 2 | 通过 | 下一步明确验收目标与范围;进入前等待用户审查 |
