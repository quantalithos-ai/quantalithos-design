# Step 1. 确认测试输入边界

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 1
> 回填章节: `05-测试方案.md` §1 与上游文档的关系声明

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 1 确认测试输入边界 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | 新版 `00/01/02/03/04`;旧 `05/06` 仅作历史诊断和方向输入 |
| 输出文件 | `projects/L1-artifact/design-calibration/05_test_plan_step_01_input_boundary.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 2 |

## 2. 本步目标

确认 `L1-artifact` 测试方案依赖的需求、架构、概要、详细设计、配置设计和验收方向输入是否足够,并明确哪些输入可以作为正式测试设计真相源。

本 Step 只回答:

- 当前测试方案要承接哪些需求、规则、非功能和验收红线。
- 哪些概要 / 详细设计章节直接影响测试对象、测试切口和测试层级。
- 哪些配置设计结论必须直接进入测试方案。
- 旧 `05/06` 当前能提供什么,又不能提供什么。
- 当前上游是否存在会阻塞 Step 2 的输入缺口。

本 Step 不定义测试范围优先级、完整用例矩阵、TC 编号、测试数据、环境配置明细、自动化脚本、evidence 编号、验收 veto 裁决或实施排期。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `00-需求文档.md` | 新版正式文档 | 抽取 `FR-ART-001~020`、`BR-ART-001~025`、`NFR-ART-CAP-001~027`、`NFR-ART-GLOB-001~012`、第 14 章五类验收和一票否决项 |
| `01-架构设计.md` | 新版正式文档 | 抽取 truth ownership、依赖裁剪、数据所有权、一致性策略、消费者只读边界和横切约束 |
| `02-概要设计.md` | 新版正式文档 | 抽取 5 类接口、关键处理流、8 组状态机和 11 章配置影响轮廓 |
| `03-详细设计.md` | 新版正式文档 | 抽取 7 模块、16 Command、13 Query、6 Inbound Consumer、8 Outbound Event、6 Operations Job、状态 / 事务 / 错误 / 幂等 / 观测 / 最小测试切口 |
| `03_ddd_step_16_test_cuts.md` | 已完成详细设计中间产物 | 作为最小测试切口、高风险验收点和脚本契约的直接输入 |
| `04-配置设计.md` | 新版正式文档 | 抽取 4 个 P0 profile、strict JSON、source priority、redaction、builder fail-fast、degraded / no-write、rollback / digest、operations replay |
| `05-测试方案.md` | 旧 / 待重建草案 | 只作为历史诊断输入,不得覆盖新版 `00`~`04` |
| `06-验收标准.md` | 旧 / 待重建草案 | 只作为验收方向输入,正式 evidence / veto 需后续重建 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 当前测试方案要承接哪些需求、规则和非功能目标? | 承接 `00` 的五个核心能力主轴:制品事实承载、制品版本化、制品血缘关联、制品基线冻结、制品事实可消费表达,并覆盖 `FR-ART-001~020`、`BR-ART-001~025`、`NFR-ART-CAP-001~027`、`NFR-ART-GLOB-001~012`、第 14 章五类验收和一票否决项。测试必须证明 Artifact fact / version / lineage / baseline / consumption backref 形成可审计闭环,且外部正文、消费副本、相邻仓状态、运行材料和派生视图都不能替代正式 truth。 |
| 哪些概要 / 详细设计章节直接影响测试对象? | `02` 的 5 类接口骨架、10 个主要组成部分、关键处理流、8 组状态机和配置影响轮廓直接决定测试对象抽取。`03` 的 Step 5~16 是测试方案直接来源:7 个模块、对象契约、trait / port / adapter、16 个 Command、13 个 Query、6 个 Inbound Consumer、8 个 Outbound Event、6 个 Operations Job、worker-only relay publication facade、状态矩阵、事务一致性、错误恢复、幂等并发、配置绑定、观测审计和最小测试切口。 |
| 哪些配置设计结论必须进入测试方案? | `04` 已正式固定 4 个 P0 profile:`local-dev`、`ci-test`、`integration-like`、`operations-replay`;测试方案必须直接承接 strict JSON、`defaults < file < env` source priority、entry-local / current-job run 局部输入、redaction no-output、runtime builder fail-fast、query degraded no-write、rollback / digest、operations replay 和 unsupported feature reject。`05` 不得重定义这些配置语义。 |
| 哪些验收项需要测试方案提供证据? | `00` 第 14 章要求测试方案为五类验收提供 evidence:核心能力闭环、功能能力、规则 / 边界、数据归属、非功能;并为一票否决项提供反证面。至少需要覆盖:Artifact 不等于 ArtifactVersion、历史版本稳定可追溯、lineage 不能由 trace / event / tool result 补造、baseline freeze 不漂移、下游消费必须回指正式 truth、query no-write、consumer 不写核心 truth、job 不修复核心 truth、redaction 不输出 raw secret / raw body、依赖降级不伪造 truth。 |
| 哪些内容不应在测试方案中重新定义? | 不重新定义 `00` 中的需求语义、`01` 的架构方案、`02/03` 的对象字段 / DTO / port / flow / state / transaction / error / idempotency、`04` 的 profile / source priority / sensitive/no-output / runtime builder contract,也不替代 `06-验收标准.md` 做最终裁决,不替代 `07-实施计划.md` 写开发排期。 |
| 当前上游是否存在会阻塞测试设计的缺口? | 不阻塞 Step 2。正式 `00/01/02/03/04` 与 `03_ddd_step_16_test_cuts.md` 已足够启动测试目标与范围设计。旧 `05/06` 虽然过时,但它们本来就只应作为历史输入。durable DB / real bus / secret provider / production-like profile 未锁定也不阻塞 P0 测试设计,当前应按 fake / controlled / replay-backed / product-neutral seam 处理。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| `05-测试方案.md` | 旧草稿按旧主线场景组织,只覆盖 create / publish / adopt / freeze 等少量测试面,没有承接新版 `03` 的完整协议盘点、模块分层和 test cuts | 标记为历史诊断输入,后续 Step 15 重建正式 `05` |
| `06-验收标准.md` | 旧验收证据和 veto 口径早于新版 `03/04`,不能直接约束新版测试方案 | Step 1 只读取验收方向,不采用旧 evidence / veto 口径 |
| `03-详细设计.md` | 已给出最小测试切口和实现契约,但还未形成正式测试范围、分层、用例矩阵、数据和证据体系 | 由 `05` Step 2~14 展开 |
| `04-配置设计.md` | 已正式定义 profile、source priority、redaction、builder 和 fail-fast,但这些测试门禁尚未体现在旧 `05` 中 | 本轮 `05` 必须直接承接 `04` §6~§12 |
| 产品与环境选型 | durable store / bus / secret provider / production-like profile 尚未进入 P0 正式基线 | 不阻塞输入边界;测试方案按 fake / controlled / replay-backed / product-neutral seam 推进 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 测试方案入口 | 旧 `05` 容易被误当成当前测试基线 | 建立 `05_test_plan_calibration_flow.md` 和 Step 1 输入边界 | 符合测试 SOP 中间产物先行 |
| 上游真相源 | 旧 `05/06` 与新版 `00`~`04` 容易混读 | 明确新版 `00`~`04` 和 `03_ddd_step_16_test_cuts.md` 为正式输入 | 防止旧口径覆盖新版设计 |
| 测试对象来源 | 旧草稿主要按少量业务场景组织 | 确认测试对象必须从 `02/03/04` 的接口、状态、配置和 test cuts 抽取 | 保证测试可回指正式契约 |
| 配置测试来源 | 旧测试环境表可能直接进入测试方案 | 确认配置测试只以新版 `04` 为来源 | 避免旧环境术语覆盖正式配置语义 |
| 验收证据 | 旧 `06` 可能被误当成当前 veto 口径 | 判定 `05` 先定义 evidence 产出面,`06` 后续消费并裁决 | 维持 `05` 与 `06` 的职责边界 |

## 7. 测试设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否直接重写正式 `05` | A. 直接重写;B. 先走 `05_test_plan_*` 中间产物 | 采用 B。SOP 要求中间产物先行,正式文档 Step 15 装配 |
| 是否继承旧 `05` 用例和场景编号 | A. 直接继承;B. 只作为历史诊断 | 采用 B。旧草稿与新版协议清单、状态和配置口径不一致 |
| 是否让测试方案补设计缺口 | A. 在测试方案中补 DTO / state / port / profile;B. 记录待确认并回写上游 | 采用 B。测试方案只验证正式设计,不能成为新的设计真相源 |
| 是否等待新版 `06` 完成后再写 `05` | A. 等待;B. 先以 `00` 第 14 章和 `04` §12 推进 evidence 输入 | 采用 B。`05` 负责给出测试与 evidence 面,`06` 负责裁决 |
| 是否要求真实外部产品才能开始测试设计 | A. 必须有真实 DB / bus / secret provider;B. 先按 fake / controlled / replay-backed seam 推进 P0 | 采用 B。产品未锁定不阻塞 P0 测试设计 |

## 8. 结构化中间产物

### 8.1 上游输入映射表

| 来源文档 | 测试输入 | 回填章节 |
|---|---|---|
| `00-需求文档.md` | `FR-ART-001~020`、`BR-ART-001~025`、`NFR-ART-CAP-001~027`、`NFR-ART-GLOB-001~012`、五类验收和一票否决项 | `05` §1 / §2 / §5 / §10 / §12 / §13 / §14 |
| `01-架构设计.md` | truth ownership、依赖裁剪、数据所有权、一致性策略、消费者只读边界、派生不反写、横切红线 | `05` §1 / §2 / §3 / §4 / §10 / §14 |
| `02-概要设计.md` | 10 个主要组成部分、5 类接口、关键处理流、8 组状态机、配置影响轮廓 | `05` §1 / §3 / §4 / §6 / §8 |
| `03-详细设计.md` | 7 模块、16 Command、13 Query、6 Consumer、8 Event、6 Job、worker-only relay facade、状态 / 事务 / 错误 / 幂等 / 配置 / 观测契约 | `05` §1 / §3 / §4 / §6 / §7 / §9 / §10 / §11 |
| `03_ddd_step_16_test_cuts.md` | 最小测试切口、高风险验收点、测试映射和脚本契约 | `05` §3 / §4 / §6 / §9 / §10 |
| `04-配置设计.md` | 4 个 P0 profile、source priority、strict JSON、sensitive/no-output、builder fail-fast、degraded/no-write、rollback / digest、operations replay | `05` §1 / §7 / §8 / §9 / §10 / §12 / §13 |
| 旧 `05-测试方案.md` | 旧场景、旧测试分层、旧环境方向 | 历史诊断;不直接回填 |
| 旧 `06-验收标准.md` | 旧验收关注方向和 evidence 消费方向 | `05` §1 / §12 / §13 / §14 的方向输入 |

### 8.2 测试方案不再回答的问题清单

- 不重新定义 `FR-ART`、`BR-ART`、`NFR-ART`、五类验收或一票否决语义。
- 不重新选择架构方案、依赖方向、truth ownership、数据归属或产品路线。
- 不重新定义 `03` 中的对象字段、DTO、enum、state、port、repository、adapter、flow、transaction、idempotency、error 或 observability schema。
- 不重新定义 `04` 中的 profile、source priority、strict JSON、sensitive/no-output、activation kind 或 runtime builder contract。
- 不用测试方案补缺失 schema、version 来源、id generator、payload source、visibility / freshness 规则或配置字段。
- 不做 `06` 的最终验收裁决,不做 `07` 的实施 boundary 和 commit 排期。
- 不写部署命令、运维 runbook、告警值班或生产变更流程。

### 8.3 测试方案必须回答的问题清单

- 哪些正式需求、规则、非功能和配置红线需要测试覆盖。
- 哪些测试目标、范围和非范围进入 P0 / P1 / P2。
- 每个模块、协议族、状态机、一致性规则和配置门禁对应哪些测试对象与测试切口。
- 每类问题应在哪一层发现:contract、domain unit、application service、fake adapter、handler、worker、job runner、integration-like、replay、release gate。
- `FR/BR/NFR/VF` 与 test cuts、cases、evidence 如何建立可追溯矩阵。
- 如何验证 Artifact fact / version / lineage / baseline / consumption backref 的正式闭环,以及 no-write、no-truth-repair、duplicate replay、redaction no-output、degraded no-fallback 等红线。
- 测试数据、环境、profile、自动化门禁和 evidence 产出如何组织。
- 哪些 evidence 将交给 `06-验收标准.md` 消费,哪些残余风险需要显式保留。

### 8.4 初始测试输入候选表

| 测试输入候选 | 来源 | 当前状态 | 后续处理 |
|---|---|---|---|
| 五个核心能力主轴 | `00` | 正式输入 | Step 2 定目标;Step 5 建追溯 |
| `FR-ART-001~020` / `BR-ART-001~025` | `00` | 正式输入 | Step 5 / Step 6 / Step 13 映射覆盖与 evidence |
| `NFR-ART-CAP-001~027` / `NFR-ART-GLOB-001~012` | `00` | 正式输入 | Step 4 / Step 10 / Step 14 展开 |
| 10 个组成部分、5 类接口、8 组状态机 | `02` | 正式输入 | Step 3 / Step 4 / Step 6 展开 |
| 7 模块 | `03` Step 5 | 正式输入 | Step 3 抽测试对象;Step 4 分层 |
| 16 Command / 13 Query / 6 Consumer / 8 Event / 6 Job | `03` Step 8 / 9 | 正式输入 | Step 3 / Step 6 设计矩阵 |
| worker-only relay publication facade | `03` Step 8 / 9 / 16 | 正式输入 | Step 3 / Step 6 / Step 9 作为 worker 维护测试切口 |
| 状态矩阵、duplicate replay、commit unknown、partial failure | `03` Step 10~13 | 正式输入 | Step 6 / Step 10 / Step 11 展开 |
| 4 个 P0 profile、redaction、builder fail-fast、operations replay | `04` | 正式输入 | Step 8 / Step 9 / Step 10 / Step 12 展开 |
| 旧 create/publish/freeze 场景 | 旧 `05` | 历史输入 | 只作风险提示,不得直接继承用例编号 |

### 8.5 初始 evidence 消费边界表

| evidence 消费方 | 需要的输入 | 当前边界 |
|---|---|---|
| `06-验收标准.md` | 测试证据、门禁结果、残余风险 | 只消费 `05` 输出,不得反向定义测试范围 |
| `07-实施计划.md` | 测试门禁、证据套件、设计闭口前置检查 | 只承接 `05` 中明确的 gate 和 suite |
| `09-部署与运维手册.md` | replay / rollback / config / alert 相关测试与演练 evidence | 只承接 `04/05` 已收稳的运维测试输入 |

## 9. 对上游设计的影响判定

| 测试输入结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 旧 `05/06` 不能作为当前测试真相源 | 否 | 下游文档权威级别 | 无需回写 `00`~`04` |
| `03_ddd_step_16_test_cuts.md` 是 `05` 的直接来源之一 | 否 | 测试输入确认 | 无需回写 |
| `04` 的 profile / source priority / redaction / fail-fast 必须直接承接 | 否 | 测试输入确认 | 无需回写 |
| 产品未锁定不阻塞 P0 测试设计 | 否 | 测试接缝策略 | 按 fake / controlled / replay-backed 处理 |
| 后续若发现某个 `FR/BR/NFR/VF` 无法落到稳定测试对象、断言或 evidence | 是 | 设计可验证性缺口 | 记录待确认并回写对应 `00/03/04` |
| 后续若发现 `03` 的协议 / 状态 / flow 与 `04` 的配置门禁无法稳定组合验证 | 是 | 跨文档一致性缺口 | 回写 `03/04` 对应章节 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_01_input_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”“对上游设计的影响判定”和“待确认事项”小节,了解测试方案输入边界如何从新版 `00/01/02/03/04` 收敛。

正式 `05-测试方案.md` §1 应回填:

- 本测试方案承接新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md` 和 `04-配置设计.md`。
- `03-详细设计.md` 与 `design-calibration/03_ddd_step_16_test_cuts.md` 是测试对象、测试切口和高风险验证主轴的直接来源。
- `04-配置设计.md` 是 profile、source priority、strict JSON、redaction、builder fail-fast、degraded/no-write 和 operations replay 测试的直接来源。
- 旧 `05-测试方案.md` 和旧 `06-验收标准.md` 只作为历史诊断和方向输入,不得覆盖新版 `00`~`04`。
- 测试方案不重新定义需求、架构、对象、DTO、port、state、flow、config 或最终验收裁决,只定义如何验证这些正式契约。
- 当前没有阻塞进入 Step 2 的输入缺口。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 旧 `05-测试方案.md` 何时被正式替换 | 影响读者是否误读旧口径 | Step 15 统一装配正式 `05` |
| 新版 `06-验收标准.md` 尚未重建 | evidence / veto 需要后续消费新版 `05` | `05` 先定义 evidence 产出面,`06` 后续裁决 |
| durable store / real bus / secret provider / production-like profile 是否进入路线 | 影响 P1/P2 测试范围和环境矩阵 | 当前不阻塞 P0,后续作为待确认或 future direction |
| 后续用例和 evidence 矩阵规模较大 | Step 6 / 13 可能需要多批写入 | 按测试切口和证据面分批写入 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 输入文档清单明确 | 通过 | 见 §3 / §8.1 |
| 测试方案边界明确 | 通过 | 见 §8.2 / §8.3 |
| 上游阻塞缺口已判断 | 通过 | 无阻塞 Step 2 的输入缺口 |
| `03/04` 的直接输入地位已明确 | 通过 | `03` + Step 16 + `04` 为直接测试输入 |
| 旧 `05/06` 地位已明确 | 通过 | 历史诊断和方向输入,不作为真相源 |
| 可进入 Step 2 | 通过 | 下一步明确测试目标、范围和非范围 |
