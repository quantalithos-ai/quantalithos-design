# Step 2. 明确测试目标、范围和非范围

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 2
> 回填章节: `05-测试方案.md` §2 本次测试目标与范围
> 创建日期: 2026-06-27
> 当前模式: full-restart / step2-scope
> 当前状态: completed
> 当前模块: `R2.12 回填草稿与 Step 2 stop-review:再写入`
> 当前门禁: `R2.12` completed_wait_user_confirm_to_R3.1;Step 2 completed;等待确认进入 Step 3 `R3.1 开工与必读文档:先思考`

---

## 0. Step 1 handoff

Step 1 已确认当前 `05-测试方案.md` 的正向输入边界:

- 当前 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 是正式上游。
- `design-calibration/03_ddd_step_16_test_cut.md` 是详细设计级最小测试切口输入。
- 旧 `05-测试方案.md`、旧 `06-验收标准.md`、旧 `07-实施计划.md` 只作 historical / old direction input,不得反向定义当前测试范围、用例、evidence、验收门禁或实施边界。
- 当前无阻塞 Step 2 的输入缺口。

Step 2 的任务不是抽取完整测试对象、写用例矩阵或定义 evidence schema,而是回答“本轮测试要证明什么、覆盖什么、不覆盖什么”,并把 P0 / P1 / P2 与非范围边界先收稳。

---

## R2.1 开工与必读文档:先思考

### 1. 当前模块目标

`R2.1` 只思考 Step 2 的开工边界、必读文档、Step 1 handoff、L1-governance Step 2 框架参考、旧材料隔离、测试目标 / 范围 / 非范围分批计划和 `R2.2` 写入边界。

当前模块不写完整测试目标表、范围 / 非范围表、P0 / P1 / P2 结论表、下游接缝表、一票否决关联表或正式 `05-测试方案.md` §2 正文。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 Step 2 开工边界、必读文档、输入分工、L1-governance 框架参考、旧材料隔离、分批计划和 R2.2 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写 Step 2 正式结构化结论、完整测试目标表、范围 / 非范围表、测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或 implementation code。 |

### 2. Step 2 启动前必须承接

| 输入 | 必须承接的内容 | 禁止继承 / 禁止提前 |
|---|---|---|
| `project_execution_ledger.md` | 当前恢复点为 Step 2 `R2.1`;每次用户确认只推进一个当前模块。 | 跳过 R2.1/R2.2 直接写完整范围结论。 |
| `05_test_plan_calibration_flow.md` | Step 1 completed;Step 2 waiting_user_confirm;Step 3+ blocked。 | 把 Step 3~14 的测试对象、用例、数据、环境、门禁和 evidence 提前写入。 |
| `05_test_plan_step_01_input_boundary.md` | 正式输入边界、旧材料隔离、不再回答清单、必须回答清单和进入 Step 2 条件。 | 重新打开 Step 1 讨论或从旧 `05/06/07` 补范围。 |
| `测试方案讨论流程_SOP.md` Step 2 | Step 2 必须回答 P0 主链、P1/P2、下游接缝、非范围残余风险、一票否决相关项。 | 用一张大表同时替代 Step 2~Step 14。 |
| `测试方案书写规范.md` | 正式 §2 只写收口后的目标与范围,并标注校准来源。 | 在正式 `05` 中新增未确认范围、TC、EV 或 gate。 |
| `设计文档讨论中间产物规范.md` | 三层台账、先思考后写入、单模块推进、单次写入批次不是文件长度上限。 | 靠对话记忆继续或为了 300 行压缩范围完整性。 |
| `设计真相源闭环与可落码性标准.md` | 范围结论不得补 schema、port、state、mapper、marker source、config key、evidence schema 或 phase boundary。 | 用测试范围替设计缺口背书。 |
| `00-需求文档.md` | 目标 / 非目标、核心能力闭环、FR-ML、BR-ML、NFR-ML、数据归属、接口依赖和需求层验收方向。 | 改写需求编号、验收语义或把外围增强升级为核心前置。 |
| `01-架构设计.md` | Definition vs Use、职责边界、依赖裁剪、数据所有权、一致性、正文禁入和外围隔离。 | 重新裁定架构方案、源码依赖或真实产品。 |
| `02-概要设计.md` | 八个组成部分、对象轮廓、接口骨架、处理流、状态、异常和配置影响。 | 把概要对象轮廓直接当完整用例矩阵。 |
| `03-详细设计.md` | 七实现单元、对象、port、protocol、flow、state、transaction、error、idempotency、config、observability 和 §15 test cuts。 | 在 Step 2 写 full TC、fixture 或 evidence artifact schema。 |
| `03_ddd_step_16_test_cut.md` | module / protocol / state / consistency / error / config / observability 最小验证入口。 | 把最小验证入口直接扩成正式 TC 编号。 |
| `04-配置设计.md` | P0 profile 候选、P1/P2 profile 方向、source priority、fail-fast、sensitive / redaction、adapter availability 和下游承接。 | 写具体测试数据路径、CI job、deployment command 或 production runbook。 |
| L1-governance Step 2 | 参考 Step 2 的组织框架、表格深度、取舍与停审方式。 | 复制 governance 领域对象、case、VF、evidence 或范围事实。 |

### 3. SOP Step 2 五问思考边界

| SOP 问题 | R2.1 思考边界 | 后续落点 |
|---|---|---|
| P0 必须通过哪些测试才能证明主链成立? | 先围绕方法资产统一定义与识别、正式化与版本语义、受控消费、变化追溯与消费一致性保护、证据线索承接建立候选证明轴。 | R2.3/R2.4 收测试目标;R2.5/R2.6 收 P0 范围。 |
| P1/P2 是否只做边界验证或延后? | 先按外围包 / 方法集、marketplace 生态、advanced policy/view profile、标准映射、durable/real-like adapter、production-like profile 区分候选层级。 | R2.7/R2.8 收 P1/P2。 |
| 哪些下游能力只测接缝,不测对方完整实现? | 先按 process、identity、governance、runtime、member-images、artifact/archive、capability-hub、marketplace、UI/console、observability 等相邻边界建接缝候选。 | R2.7/R2.8 收下游接缝边界。 |
| 哪些非范围有残余风险? | 先保留真实产品、生产容量、完整跨仓端到端、高级外围增强、旧 MethodContent 兼容、真实 secret provider / broker 等风险候选。 | R2.9/R2.10 收非范围和残余风险。 |
| 哪些范围项是一票否决相关? | 先从需求 §14、BR-ML、NFR-ML 和 `03` 红线中识别候选,不在 R2.1 固化 veto 表。 | R2.9/R2.10 形成关联草稿;新版 `06` 后续裁决。 |

### 4. L1-governance Step 2 框架参考思考

L1-governance Step 2 的价值在组织框架,不是领域内容。L3-method-library 采用其“目标 -> 输入 -> SOP 五问 -> 当前文档诊断 -> 改动前后对比 -> 测试设计取舍 -> 结构化中间产物 -> 回填草稿 -> 待确认 -> 进入下一步条件”的形态。

| L1-governance 框架点 | L3 采用方式 |
|---|---|
| 先声明本 Step 只回答范围问题 | L3 Step 2 只收测试目标、范围、非范围和优先级,不写 Step 3~14 细节。 |
| 输入表引用 `00/01/02/03/04` 和 Step 1 | L3 同样明确每个上游输入对范围的用途,并保留旧 `05/06/07` 降级。 |
| SOP 五问逐项回答 | L3 先按五问分批讨论,避免一口气生成大表。 |
| 当前文档问题诊断 | L3 需要诊断旧 `05` 的 MethodContent / publish / snapshot / outbox 范围污染。 |
| 结构化产物分多张表 | L3 后续应拆测试目标、范围 / 非范围、P0/P1/P2、下游接缝、残余风险和验收关联。 |
| 待确认和进入下一步条件 | L3 Step 2 完成后必须暂停,用户确认后才进入 Step 3。 |

### 5. 旧材料隔离思考

| 旧材料 / 旧口径 | R2.1 处理 |
|---|---|
| 旧 `P0 方法定义发布同步闭环` | 不作为新版 P0 范围;新版 P0 必须从当前核心能力闭环和 `03` 七实现单元推导。 |
| 旧 `MethodContent`、7 类 subtype、draft / publish / snapshot / fingerprint | 不作为测试目标或范围项。 |
| 旧 outbox relay / delivery / PostgreSQL / gateway / HTTP header | 不作为当前自动化、环境或范围前置。 |
| 旧 TC / EV / P0 / P1 编号 | 全部作废;新版编号后续 Step 6 / Step 13 重新生成。 |
| 旧 `06/07` 验收和实施范围 | 只作方向提醒,不得定义当前 Step 2 的验收门禁或实施 boundary。 |

### 6. Step 2 初步分批思考

| 模块 | 主题 | 初判边界 |
|---|---|---|
| R2.1/R2.2 | 开工与必读文档 | 写必读文档、输入基线、Step 1 handoff、L1 框架参考和分批计划。 |
| R2.3/R2.4 | 测试目标与优先级口径 | 思考并写入“本轮测试要证明什么”和 P0/P1/P2 定义口径。 |
| R2.5/R2.6 | P0 范围候选 | 围绕核心能力闭环、七实现单元、协议族、状态、一致性、配置和观测红线收 P0。 |
| R2.7/R2.8 | P1/P2 与下游接缝 | 区分 real-like / durable / production-like / peripheral enhancement,并收只测接缝边界。 |
| R2.9/R2.10 | 非范围、残余风险和验收关联 | 收非范围、残余风险归属、一票否决候选和回写条件。 |
| R2.11/R2.12 | 回填草稿与 Step 2 stop-review | 形成正式 §2 回填草稿边界、待确认事项和进入 Step 3 条件。 |

### 7. R2.2 写入边界思考

`R2.2 开工与必读文档:再写入` 只应把 R2.1 的开工思考落成可恢复台账,不得写完整 Step 2 结论:

1. 写 Step 2 必读文档表与读取状态。
2. 写 Step 1 handoff 承接表。
3. 写 Step 2 输入基线与旧材料处理规则。
4. 写 SOP 五问初步回答的写入口径。
5. 写 L1-governance Step 2 框架参考边界。
6. 写 Step 2 分批计划。
7. 写 `R2.3 测试目标与优先级口径:先思考` 进入门禁。

### 8. R2.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 Step 2 开工边界和必读文档 | pass |
| 是否承接 Step 1 completed handoff | pass |
| 是否参考 L1-governance 框架但不复制领域语义 | pass |
| 是否形成 Step 2 分批计划 | pass |
| 是否形成 R2.2 写入边界 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写完整测试目标表、范围 / 非范围表、用例、数据、环境、门禁、evidence、验收或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.2 开工与必读文档:再写入`;只允许写入 Step 2 必读文档表、读取状态、Step 1 handoff 承接、输入基线、旧材料处理规则、SOP 五问写入口径、L1-governance Step 2 框架参考边界、Step 2 分批计划和 `R2.3` 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写 Step 2 正式结构化结论、完整测试目标表、范围 / 非范围表、测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或 implementation code。

---

## R2.2 开工与必读文档:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R2.3 |
| 用户确认 | 已确认从 `R2.1` 推进到 `R2.2`。 |
| 本模块写入范围 | Step 2 必读文档表、读取状态、Step 1 handoff 承接、输入基线、旧材料处理规则、SOP 五问写入口径、L1-governance Step 2 框架参考边界、Step 2 分批计划和 `R2.3` 进入门禁。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、Step 2 正式结构化结论、完整测试目标表、范围 / 非范围表、测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划和 implementation code。 |

### 2. 必读文档表与读取状态

| 文档 | 读取状态 | Step 2 用途 | 当前裁决 |
|---|---|---|---|
| `project_execution_ledger.md` | 已读取并承接 | 确认当前恢复点、当前模块和 next_allowed_action。 | 当前只推进 `R2.2`。 |
| `05_test_plan_calibration_flow.md` | 已读取并承接 | 确认 Step 1 completed、Step 2 in_progress、Step 3+ blocked。 | `R2.2` 完成后只能等待 `R2.3`。 |
| `05_test_plan_step_01_input_boundary.md` | 已读取并承接 | 固定正式输入边界、旧材料隔离、不再回答清单和进入 Step 2 条件。 | Step 1 不重开。 |
| `05_test_plan_step_02_scope.md` | 已读取并更新 | 记录 Step 2 R2.1/R2.2 的思考、写入和停审。 | 当前文件是唯一允许写入的 Step 文件。 |
| `standards/document/测试方案讨论流程_SOP.md` | 已读取 Step 2 | 固定 Step 2 目标、输入、输出、五问和进入下一步条件。 | Step 2 只收目标、范围、非范围和优先级。 |
| `standards/document/测试方案书写规范.md` | 已读取关键规则 | 固定正式 `05` §2 回填位置、校准来源和不得新增未确认结论。 | 正式 `05` 仍留到 Step 15 装配。 |
| `standards/document/设计文档讨论中间产物规范.md` | 已读取关键规则 | 固定三层台账、先思考后写入、单模块推进和写入批次规则。 | 本轮只写一个模块。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已列入必读 | 防止范围结论补 schema、port、state、mapper、marker、config、evidence 或 phase 缺口。 | 后续遇到缺口回 owning source。 |
| `00-需求文档.md` | 已读取关键章节 | 提供目标 / 非目标、核心能力闭环、FR-ML、BR-ML、NFR-ML、数据归属、接口依赖和验收方向。 | 是 Step 2 范围来源。 |
| `01-架构设计.md` | 已读取关键章节 | 提供 Definition vs Use、职责边界、依赖裁剪、数据所有权和横切红线。 | 是非范围和接缝边界来源。 |
| `02-概要设计.md` | 已读取关键章节 | 提供八组件、对象轮廓、接口骨架、处理流、状态、异常和配置影响。 | 是后续范围分组来源。 |
| `03-详细设计.md` | 已读取关键章节 | 提供七实现单元、protocol family、flow、state、persistence、error、idempotency、config、observability 和 §15 test cuts。 | 是 P0 最小验证范围来源。 |
| `03_ddd_step_16_test_cut.md` | 已读取关键章节 | 提供 module / protocol / state / consistency / error / config / observability 最小验证入口。 | 后续 Step 2 只定优先级,不生成 TC。 |
| `04-配置设计.md` | 已读取关键章节 | 提供 P0 profile 候选、P1/P2 profile 方向、fail-fast、redaction、adapter availability 和下游承接输入。 | 后续范围表需区分 P0/P1/P2。 |
| L1-governance Step 2 | 已读取并对照 | 参考 Step 2 的结构、表格深度、取舍和停审。 | framework reference only。 |

### 3. Step 1 handoff 承接

| Step 1 结论 | Step 2 承接方式 | 当前状态 |
|---|---|---|
| `00/01/02/03/04` 是正式输入 | Step 2 的目标、范围和非范围均从当前正式上游推导。 | pass |
| `03_ddd_step_16_test_cut.md` 是最小测试切口输入 | Step 2 只把其收束为范围优先级,不直接生成 TC。 | pass |
| 旧 `05/06/07` 降级 | 旧材料只进入污染诊断和方向提醒。 | pass |
| `05` 不补设计缺口 | 范围讨论发现缺口时回 `03/04` owning source。 | pass |
| 当前无阻塞 Step 2 的输入缺口 | 可以继续讨论测试目标与范围。 | pass |

### 4. 输入基线与旧材料处理规则

| 类别 | 当前口径 |
|---|---|
| 需求范围基线 | `FR-ML-001~009`、`FR-ML-E-*`、`BR-ML-001~022`、`BR-ML-E-001`、`NFR-ML-001~016`、数据归属、接口依赖和需求 §14 验收方向。 |
| 架构范围基线 | Definition vs Use、核心 / 外围隔离、源码依赖裁剪、正文禁入、外部摘要 / 引用、异步协作和后台收敛边界。 |
| 概要范围基线 | 八个主要组成部分、关键对象族、接口类别、关键处理流、状态族、异常族和配置影响轮廓。 |
| 详细设计范围基线 | 七实现单元、Command / Query / Inbound / Outbound / Job、state matrix、UoW、stored replay、query no-write、job no truth repair、safe error、config、observability 和 test cuts。 |
| 配置范围基线 | `local-dev`、`ci-test`、`integration-like`、`operations-replay` 为 P0 candidate;`staging-like`、`production-like` 为 P1/P2 direction。 |
| 旧正式 `05` | historical material;旧 MethodContent / publish / snapshot / outbox / PostgreSQL / gateway / TC / EV 不继承。 |
| 旧 `06/07` | old direction input;不得定义当前 acceptance gate、phase、commit、required_checks 或 implementation ledger。 |

### 5. SOP 五问写入口径

| SOP 问题 | R2.2 固定的写入口径 | 后续模块 |
|---|---|---|
| P0 必须通过哪些测试才能证明主链成立? | 围绕方法资产定义 truth、正式版本、受控消费、变化追溯、消费一致性保护、证据线索和 `03` 最小验证入口收束。 | R2.3~R2.6 |
| P1/P2 是否只做边界验证或延后? | 外围增强、真实产品、production-like、复杂策略、生态发现和标准映射先作为 P1/P2 或残余风险候选,不得阻塞 P0。 | R2.7/R2.8 |
| 哪些下游能力只测接缝? | process、identity、governance、runtime、member-images、artifact/archive、capability-hub、marketplace、UI/console、observability 只测 ref / summary / event / handoff / adapter seam。 | R2.7/R2.8 |
| 哪些非范围有残余风险? | 真实 DB/bus/secret provider、生产容量、完整跨仓 E2E、高级外围增强、旧模型兼容等必须进入残余风险或后续触发条件。 | R2.9/R2.10 |
| 哪些范围项是一票否决相关? | 先映射需求 §14、BR-ML、NFR-ML、`03` 红线和 `04` 配置红线;正式 veto 裁决留给新版 `06`。 | R2.9/R2.10 |

### 6. L1-governance Step 2 框架参考边界

| 参考点 | L3 采用 | L3 禁止 |
|---|---|---|
| 本步目标短文 | 采用:先说明本 Step 只回答范围问题。 | 不复制 Governance truth center 叙述。 |
| 本步输入表 | 采用:列 Step 1、`00/01/02/03/04` 和 Step 16 test cut 用途。 | 不复制 C-GOV、VF-GOV、Governance 协议数量。 |
| SOP 五问回答 | 采用:逐问分批写,再形成结构化产物。 | 不一次性写全 Step 3~14。 |
| 文档问题诊断 | 采用:诊断旧 `05/06/07` 与当前设计的冲突。 | 不把旧内容合并进新版范围。 |
| 测试设计取舍 | 采用:记录 P0 vs P1/P2、接缝 vs 完整集成、真实产品 vs fake/controlled seam。 | 不提前定义 CI job、evidence ID 或验收门禁。 |
| 结构化中间产物 | 采用:目标表、范围表、优先级口径、接缝表、非范围风险表和验收关联表分开写。 | 不用单张大表压缩所有判断。 |

### 7. Step 2 分批计划

| 模块 | 主题 | 输出边界 |
|---|---|---|
| R2.3/R2.4 | 测试目标与优先级口径 | 写“本轮测试要证明什么”、P0/P1/P2 定义、目标候选和不进入范围的提醒。 |
| R2.5/R2.6 | P0 范围候选 | 写 P0 范围候选,覆盖核心能力闭环、七实现单元、协议族、状态、一致性、配置和观测红线。 |
| R2.7/R2.8 | P1/P2 与下游接缝 | 写 P1/P2 口径、只测接缝的下游能力和真实产品 / durable-like / production-like 边界。 |
| R2.9/R2.10 | 非范围、残余风险和验收关联 | 写非范围、残余风险归属、一票否决候选和上游回写条件。 |
| R2.11/R2.12 | 回填草稿与 Step 2 stop-review | 写正式 §2 回填草稿边界、待确认事项、进入 Step 3 条件和 Step 2 stop-review。 |

### 8. R2.3 进入门禁

`R2.3 测试目标与优先级口径:先思考` 只允许思考 Step 2 的测试目标和 P0/P1/P2 优先级口径:

1. 思考“本轮测试要证明什么”。
2. 思考 P0 / P1 / P2 的分层定义。
3. 思考哪些目标只作为候选,不能立即写成范围结论。
4. 思考 R2.4 写入边界。
5. 禁止修改正式 `05-测试方案.md`。
6. 禁止写完整范围 / 非范围表、P0 全量范围、下游接缝表、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准或实施计划。

### 9. R2.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 Step 2 必读文档表与读取状态 | pass |
| 是否写入 Step 1 handoff 承接 | pass |
| 是否写入输入基线和旧材料处理规则 | pass |
| 是否写入 SOP 五问写入口径 | pass |
| 是否写入 L1-governance Step 2 框架参考边界 | pass |
| 是否写入 Step 2 分批计划和 R2.3 进入门禁 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写完整测试目标表、范围 / 非范围表、用例、数据、环境、门禁、evidence、验收或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.3 测试目标与优先级口径:先思考`;只允许思考“本轮测试要证明什么”、P0/P1/P2 分层定义、候选目标边界和 R2.4 写入边界;不得直接修改正式 `05-测试方案.md`;不得写完整范围 / 非范围表、P0 全量范围、下游接缝表、测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或 implementation code。

---

## R2.3 测试目标与优先级口径:先思考

### 1. 当前模块目标

`R2.3` 只思考 Step 2 的测试目标和 P0 / P1 / P2 优先级口径,为 `R2.4` 写入做准备。当前模块不把候选证明轴写成最终测试目标表,不写完整范围 / 非范围表,不进入 P0 全量范围、下游接缝、用例、数据、环境、自动化、evidence 或验收裁决。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考本轮测试要证明什么、P0 / P1 / P2 分层定义、哪些目标只作为候选和 R2.4 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写完整测试目标表、范围 / 非范围表、P0 全量范围、下游接缝表、测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或 implementation code。 |

### 2. 本轮测试要证明什么:思考

本轮测试目标应围绕 `00` 的核心能力闭环、`01` 的架构硬边界、`03` 的最小测试切口和 `04` 的配置 profile 分层收敛。当前只能形成候选证明轴,不能在 R2.3 直接写正式目标表。

| 候选证明轴 | 来源 | R2.3 思考 |
|---|---|---|
| 方法资产定义 truth 独立成立 | `00` §4 / §7 / §9;`01` §2 / §3 | 测试必须证明方法资产定义、身份、目录和适用语境不依赖散落文档、下游私有模型、流程实例、成员状态、治理执行或 UI 渲染。 |
| 正式版本与显式变化成立 | `00` FR-ML-003~004、BR-ML-004、BR-ML-009~010;`01` 架构目标和不可变约束 | 测试必须证明正式化、正式 / 非正式区分、版本稳定和版本语义变化为显式事实,不能由读取、引用、同步或运行时使用隐式触发。 |
| 下游按边界受控消费成立 | `00` FR-ML-005~006、BR-ML-003、BR-ML-005~008、BR-ML-012~018;`01` Definition vs Use | 测试必须证明 process、identity、runtime、member-images 等下游只消费正式方法语义、ref、summary 或 material,不创建、修改或替代定义 truth。 |
| 变化追溯与消费一致性保护成立 | `00` FR-ML-007~009、BR-ML-020~022、NFR-ML-009~016 | 测试必须证明正式化、版本变化、消费影响变化和证据线索具备可追溯锚点,且重复读取 / 维护不会制造第二 truth。 |
| 详细设计契约可执行验证 | `03` §15 test cuts | 测试必须证明七实现单元、Command / Query / Inbound / Outbound / Job、状态、UoW、stored replay、错误恢复、配置和观测红线可被最小验证。 |
| 配置与 profile 不破坏主链 | `04` §6 / §11 / §12 | 测试必须证明 P0 profile candidate 支撑本地、CI、controlled seam 和 operations replay,同时 staging-like / production-like 不阻塞 P0。 |

### 3. P0 / P1 / P2 分层定义思考

优先级应表达“什么是当前必须证明的主链”“什么是接缝验证或 fake-to-real 迁移风险”“什么是生产化、外围增强或长期演进”。当前只思考定义口径,不列完整范围项。

| 优先级 | 候选定义 | 必须避免 |
|---|---|---|
| P0 | 证明 L3-method-library 作为方法资产定义 truth、正式版本、受控消费、追溯和一致性保护来源成立;覆盖 `03` §15 的最小验证入口;使用 `local-dev`、`ci-test`、`integration-like`、`operations-replay` 这类 P0 candidate profile。 | 把真实 DB / bus / secret provider / production-like 环境作为 P0 前置;用旧 MethodContent / publish / snapshot / outbox 范围证明新版主链。 |
| P1 | 证明 durable-like、real-like adapter、staging-like dry-run、外部 resolver / publisher / handoff 接缝不会改变 P0 truth 语义,并能映射 unavailable / degraded / failed。 | 让真实产品、真实 sibling 仓完整实现或 staging-like 成为 P0 truth 成立条件。 |
| P2 | 证明 production-like、容量、SLO、多区域、多租户、复杂外围增强、marketplace 生态、高级 ViewProfile / AIPolicy 变体、深度标准映射或 secret provider 演进不反向定义核心 truth。 | 在当前 `05` Step 2 把愿望池写成已承诺范围或 release gate。 |

### 4. 候选目标边界思考

R2.4 可以写“测试目标与优先级口径”候选,但仍不能写 P0 全量范围。目标候选和范围项必须分开,否则 Step 2 会过早吞并 Step 3~14。

| 候选内容 | R2.4 可写 | R2.4 禁止 |
|---|---|---|
| 本轮测试目标 | 写 5~7 条目标候选,说明要证明核心能力闭环和详细设计可测。 | 写完整测试对象清单、用例矩阵或每个 protocol 的 case。 |
| P0 口径 | 写 P0 的定义、必须覆盖的能力轴和最小验证来源。 | 列 P0 全量范围表或宣称所有 TC / EV 已确定。 |
| P1 口径 | 写接缝验证、fake-to-real parity、durable-like / real-like 风险口径。 | 锁定真实产品、真实部署、staging release gate 或 adapter vendor。 |
| P2 口径 | 写 production-like、容量和外围增强的后续演进定位。 | 把长期增强写成本轮必须实现或必须验收。 |
| 下游能力 | 可以说明下游完整实现不作为本仓目标。 | 展开下游接缝表;该表留给 R2.7/R2.8。 |
| 验收关联 | 可以说明新版 `06` 后续裁决。 | 写 acceptance gate、release veto 或 evidence threshold。 |

### 5. R2.4 写入边界思考

`R2.4 测试目标与优先级口径:再写入` 应把 R2.3 思考固化为可恢复的目标候选与优先级口径,但仍不得完成 Step 2 的范围结论:

1. 写“本轮测试要证明什么”候选表。
2. 写 P0 / P1 / P2 优先级口径表。
3. 写目标候选与后续范围项的边界说明。
4. 写不进入当前范围结论的提醒。
5. 写 `R2.5 P0 范围候选:先思考` 进入门禁。

### 6. R2.3 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考测试目标和优先级口径 | pass |
| 是否围绕核心能力闭环、架构边界、详细设计 test cuts 和配置 profile 分层 | pass |
| 是否区分 P0 / P1 / P2 候选定义 | pass |
| 是否未写完整范围 / 非范围表或 P0 全量范围 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否形成 R2.4 写入边界 | pass |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.4 测试目标与优先级口径:再写入`;只允许写入本轮测试目标候选表、P0/P1/P2 优先级口径表、目标候选与范围项边界说明、不进入当前范围结论的提醒和 `R2.5` 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写完整范围 / 非范围表、P0 全量范围、下游接缝表、测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或 implementation code。

---

## R2.4 测试目标与优先级口径:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R2.5 |
| 用户确认 | 已确认从 `R2.3` 推进到 `R2.4`。 |
| 本模块写入范围 | 本轮测试目标候选表、P0/P1/P2 优先级口径表、目标候选与范围项边界说明、不进入当前范围结论的提醒和 `R2.5` 进入门禁。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、完整范围 / 非范围表、P0 全量范围、下游接缝表、测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划和 implementation code。 |

### 2. 本轮测试目标候选表

| 测试目标候选 | 来源 | 当前证明口径 | 后续落点 |
|---|---|---|---|
| 证明方法资产定义 truth 独立成立 | `00` §4 / §7 / §9;`01` §2 / §3 | 方法资产定义、身份、目录和适用语境必须由本仓正式承载,不得依赖散落文档、下游私有模型、流程实例、成员状态、治理执行或 UI 渲染。 | R2.5/R2.6 P0 范围;Step 3 测试对象;Step 5 覆盖矩阵。 |
| 证明正式版本与显式变化成立 | `FR-ML-003~004`;`BR-ML-004`;`BR-ML-009~010`;`03` state / flow | 正式化、正式 / 非正式区分、版本稳定和版本语义变化必须是显式事实,不得由读取、引用、同步或运行时使用隐式触发。 | R2.5/R2.6;Step 6 用例;Step 10 非功能 / 一致性。 |
| 证明下游按边界受控消费成立 | `FR-ML-005~006`;`BR-ML-003`;`BR-ML-005~008`;`BR-ML-012~018` | 下游只能按 ref、summary、material、event 或 handoff seam 消费正式方法语义,不能创建、修改或替代定义 truth。 | R2.7/R2.8 下游接缝;Step 4 分层;Step 6 场景。 |
| 证明变化追溯与消费一致性保护成立 | `FR-ML-007~009`;`BR-ML-020~022`;`NFR-ML-009~016` | 正式化、版本变化、消费影响变化和证据线索必须具备可追溯锚点,重复读取 / 维护不得制造第二 truth。 | R2.5/R2.6;Step 5 覆盖;Step 13 evidence。 |
| 证明详细设计契约具备最小可验证性 | `03` §15 test cuts | 七实现单元、Command / Query / Inbound / Outbound / Job、状态、UoW、stored replay、错误恢复、配置和观测红线必须有最小验证入口。 | Step 3 测试对象;Step 6 用例;Step 9 自动化。 |
| 证明配置与 profile 不破坏主链 | `04` §6 / §11 / §12 | `local-dev`、`ci-test`、`integration-like`、`operations-replay` 可作为 P0 candidate;`staging-like`、`production-like` 只作 P1/P2 direction,不阻塞 P0。 | Step 8 环境配置;Step 9 门禁;Step 10 专项。 |
| 证明旧材料不会污染新版测试范围 | Step 1;旧 `05/06/07` historical material | 旧 MethodContent、publish、snapshot、fingerprint、outbox、PostgreSQL、gateway、旧 TC / EV 全部不得进入新版目标或范围。 | Step 2 当前红线;Step 14 残余风险;Step 15 装配审计。 |

### 3. P0 / P1 / P2 优先级口径表

| 优先级 | 定义 | 当前必须输出 | 当前不要求 |
|---|---|---|---|
| P0 | 证明 L3-method-library 作为方法资产定义 truth、正式版本、受控消费、追溯和一致性保护来源成立,并覆盖 `03` §15 的最小验证入口。 | 可追溯到 `00/01/02/03/04` 的测试目标、P0 范围候选、最小测试切口、后续 TC / evidence 输入和 P0 profile candidate。 | 不要求真实 DB / bus / secret provider / production-like;不要求完整跨仓 E2E;不继承旧 MethodContent / publish / outbox 主线。 |
| P1 | 证明 durable-like、real-like adapter、staging-like dry-run、外部 resolver / publisher / handoff 接缝不会改变 P0 truth 语义,并能映射 unavailable / degraded / failed。 | 接缝验证方向、fake-to-real parity 风险、integration-like / staging-like 证据候选和 adapter failure mapping 方向。 | 不把真实产品或真实 sibling 仓完整实现设为 P0 前置;不锁定具体 vendor 或部署方案。 |
| P2 | 证明 production-like、容量、SLO、多区域、多租户、复杂外围增强、marketplace 生态、高级 ViewProfile / AIPolicy 变体、深度标准映射或 secret provider 演进不反向定义核心 truth。 | 后续演进触发条件、残余风险归属和生产化验证方向。 | 不在当前 Step 2 写 release gate、运维 runbook、容量阈值、复杂 DSL 或外围增强完成承诺。 |

### 4. 目标候选与范围项边界说明

| 内容 | 本模块定位 | 后续正式落点 |
|---|---|---|
| 测试目标候选 | 表达“本轮测试要证明什么”。 | R2.11/R2.12 回填草稿;正式 `05` §2。 |
| P0/P1/P2 口径 | 表达优先级定义和不让外围能力阻塞 P0 的原则。 | R2.5~R2.10 继续细化;正式 `05` §2。 |
| P0 范围项 | 本模块不列全量。 | R2.5/R2.6。 |
| P1/P2 接缝与外围增强 | 本模块只固定分层口径。 | R2.7/R2.8。 |
| 非范围与残余风险 | 本模块只提示不能混入当前范围结论。 | R2.9/R2.10。 |
| 测试对象、切口、用例、数据、环境、门禁、evidence | 不属于 Step 2 当前模块。 | Step 3~13。 |

### 5. 不进入当前范围结论的提醒

| 项 | 当前处理 |
|---|---|
| 真实 DB / bus / search / object storage / secret provider | 不作为 P0 前置;后续最多进入 P1/P2 或残余风险。 |
| production-like profile、容量、SLO、multi-region、tenant profile | 不进入当前 P0;后续按 P2 / 运维 / 验收方向处理。 |
| 完整跨仓端到端和 sibling 仓内部状态机 | 不作为本仓 P0 证明条件;只测接缝和边界。 |
| MethodPlugin / MethodConfiguration、marketplace、advanced ViewProfile / AIPolicy、标准映射材料 | 外围增强,不得阻塞核心闭环成立。 |
| 旧 MethodContent / publish / snapshot / fingerprint / outbox / PostgreSQL / gateway / 旧 TC / EV | historical pollution,不进入新版目标或范围。 |
| acceptance gate、release veto、coverage threshold、phase、commit boundary | 分别交新版 `06` / `07`,不得在 R2.4 写成结论。 |

### 6. R2.5 进入门禁

`R2.5 P0 范围候选:先思考` 只允许思考 P0 范围候选如何从目标口径继续收敛:

1. 思考 P0 是否应按核心能力闭环、详细设计验证入口和配置 / 观测红线分组。
2. 思考 P0 范围候选应如何避免变成完整测试对象或用例表。
3. 思考 R2.6 写入边界。
4. 禁止修改正式 `05-测试方案.md`。
5. 禁止写下游接缝表、P1/P2 细节、非范围风险表、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准或实施计划。

### 7. R2.4 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入本轮测试目标候选表 | pass |
| 是否写入 P0/P1/P2 优先级口径表 | pass |
| 是否写入目标候选与范围项边界说明 | pass |
| 是否写入不进入当前范围结论的提醒 | pass |
| 是否写入 R2.5 进入门禁 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写完整范围 / 非范围表、P0 全量范围、下游接缝、用例、数据、环境、门禁、evidence、验收或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.5 P0 范围候选:先思考`;只允许思考 P0 范围候选的分组方式、范围候选与测试对象 / 用例的边界和 R2.6 写入边界;不得直接修改正式 `05-测试方案.md`;不得写下游接缝表、P1/P2 细节、非范围风险表、测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或 implementation code。

---

## R2.5 P0 范围候选:先思考

### 1. 当前模块目标

`R2.5` 只思考 P0 范围候选的分组方式、候选范围与后续测试对象 / 用例的边界,以及 `R2.6` 写入边界。当前模块不把 P0 候选固化为正式范围表,不写测试对象清单、测试切口、TC、fixture、环境矩阵、自动化门禁、evidence schema、验收标准或实施计划。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 P0 范围候选分组、P0 范围候选与 Step 3 / Step 6 的边界、旧材料污染排除和 R2.6 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写最终 P0 范围表、P1/P2 细节、下游接缝表、非范围风险表、测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或 implementation code。 |

### 2. P0 范围候选分组方式思考

P0 范围候选应从 R2.4 的测试目标继续收束,但不能直接展开成 Step 3 的测试对象或 Step 6 的用例矩阵。更稳妥的分组方式是按“能力闭环 -> 详细设计最小验证入口 -> 配置 / 观测红线”的三层组织,确保每个候选都能回指正式上游,同时给后续 Step 留出展开空间。

| 候选分组轴 | 来源 | R2.5 思考 |
|---|---|---|
| 核心能力闭环 | `00` §7 / §9 / §14;R2.4 测试目标 | P0 首先要证明方法资产统一定义与识别、正式版本、受控消费、变化追溯和消费一致性保护成立。该层回答“本轮必须证明什么”,不回答“用哪些对象和用例证明”。 |
| 需求 / 规则 / 数据归属红线 | `00` FR-ML-001~009、BR-ML-001~022、NFR-ML-009~016、数据归属 | P0 应覆盖定义 truth、Definition vs Use、正式化显式变化、消费影响变化、证据线索和禁止保存外部正文等红线。该层适合在 R2.6 写成范围候选,不在 R2.5 写断言细节。 |
| 详细设计验证入口 | `03` §15;`03_ddd_step_16_test_cut.md` | P0 要承接七实现单元、Command / Query / Inbound / Outbound / Job、状态、一致性、错误恢复、配置和观测的最小验证入口。该层只能说明候选覆盖轴,完整对象和 test cut 留给 Step 3。 |
| 配置 profile 与 fail-fast 红线 | `04` §6 / §9 / §11 / §12 | P0 可包含 `local-dev`、`ci-test`、`integration-like`、`operations-replay` 这些 candidate profile 的范围候选,但不写具体配置项、fixture 路径或 CI 命令。 |
| 观测 / redaction / body-free 红线 | `03` §14 / §15;`04` §8 / §11 | P0 应包含 no raw body、no secret、no synthetic marker、query no-write、duplicate no-rerun、post-commit failure no rollback 等红线候选。具体 assertion 和 evidence 留给 Step 6 / Step 13。 |
| 旧材料污染阻断 | Step 1;R2.4;旧 `05/06/07` | P0 需要显式排除旧 MethodContent、publish、snapshot、fingerprint、outbox、PostgreSQL、gateway 和旧 TC / EV。该项在 R2.6 可写成范围约束,不是独立测试对象。 |

### 3. P0 候选不应如何分组

P0 范围不能为了显得完整而按旧文档、代码目录、数据库产品或下游系统完整 E2E 来分组。否则会把当前测试方案重新带回旧方向,或提前侵入 Step 3~13。

| 不采用的分组 | 原因 | 后续处理 |
|---|---|---|
| 按旧 MethodContent / publish / snapshot / outbox 分组 | 旧主线已被 Step 1 和 R2.4 降级为 historical pollution。 | R2.6 只写排除规则,不继承旧范围。 |
| 按真实 DB / bus / secret provider / object storage 分组 | 产品未锁定,且真实产品不是 P0 truth 成立前置。 | 后续进入 P1/P2、接缝验证或残余风险。 |
| 按下游仓完整实现分组 | process、identity、runtime、member-images 等不是本仓 truth owner。 | R2.7/R2.8 只测边界接缝。 |
| 按正式 `03` 的每个对象逐项分组 | 会把 Step 3 测试对象提前写入 Step 2。 | Step 3 再抽取测试对象与切口。 |
| 按 TC / EV / CI suite 分组 | 会跳过 Step 5 / Step 6 / Step 9 / Step 13。 | 后续按 SOP 逐步生成。 |
| 按验收 veto / release gate 分组 | 新版 `06` 尚未重启,Step 2 不能裁决验收门禁。 | R2.9/R2.10 只保留一票否决候选关联。 |

### 4. P0 候选与后续 Step 的边界思考

R2.6 可以写“P0 范围候选”,但必须避免写成可执行测试方案。范围候选只回答是否纳入 P0 证明面,不写测试对象、用例、数据、环境、自动化或证据。

| 内容 | R2.6 可写到 P0 候选 | 必须留到后续 |
|---|---|---|
| 核心能力闭环 | 写入 P0 覆盖方法资产定义 truth、正式版本、受控消费、追溯和一致性保护。 | Step 3 再抽测试对象;Step 6 再写用例。 |
| 需求 / 规则红线 | 写入 P0 覆盖 FR / BR / NFR 的核心红线方向。 | Step 5 再做覆盖矩阵;Step 12 / `06` 再裁决准入退出。 |
| 详细设计最小验证入口 | 写入 P0 覆盖模块、协议族、状态、一致性、错误、配置、观测的候选轴。 | Step 3 写测试对象与切口;Step 6 写场景与 case。 |
| 配置 profile | 写入 P0 candidate profile 范围,并说明不要求 staging-like / production-like。 | Step 8 写环境配置矩阵;Step 9 写自动化门禁。 |
| 观测与 redaction | 写入 P0 必须保护 body-free、safe marker、no secret、query no-write 等方向。 | Step 6 写断言;Step 13 写 evidence / report artifact。 |
| 旧材料排除 | 写入 P0 不继承旧 MethodContent / publish / outbox / old TC。 | Step 14 写残余风险;Step 15 做装配审计。 |

### 5. R2.6 写入边界思考

`R2.6 P0 范围候选:再写入` 应把 R2.5 的思考固化为“候选范围”,但仍不能完成 Step 2 全部范围结论:

1. 写 P0 范围候选分组表。
2. 写每组候选的正式来源、P0 纳入理由和后续落点。
3. 写 P0 候选排除规则,特别是旧材料、真实产品、完整下游 E2E、TC / EV / CI / evidence / gate。
4. 写 P0 候选与 Step 3 / Step 6 / Step 8 / Step 13 的边界。
5. 写 `R2.7 P1/P2 与下游接缝:先思考` 进入门禁。
6. 禁止修改正式 `05-测试方案.md`。
7. 禁止写 P1/P2 细节、下游接缝表、非范围风险表、测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准或实施计划。

### 6. R2.5 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 P0 范围候选分组方式 | pass |
| 是否区分范围候选与测试对象 / 用例 | pass |
| 是否承接 R2.4 测试目标与 P0/P1/P2 口径 | pass |
| 是否隔离旧 MethodContent / publish / snapshot / outbox / old TC 污染 | pass |
| 是否形成 R2.6 写入边界 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写 P1/P2 细节、下游接缝、非范围风险、测试对象、测试切口、用例、数据、环境、门禁、evidence、验收或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.6 P0 范围候选:再写入`;只允许写入 P0 范围候选分组表、正式来源、P0 纳入理由、候选排除规则、与后续 Step 的边界和 `R2.7` 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写 P1/P2 细节、下游接缝表、非范围风险表、测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或 implementation code。

---

## R2.6 P0 范围候选:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R2.7 |
| 用户确认 | 已确认从 `R2.5` 推进到 `R2.6`。 |
| 本模块写入范围 | P0 范围候选分组表、正式来源、P0 纳入理由、候选排除规则、与后续 Step 的边界和 `R2.7` 进入门禁。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、P1/P2 细节、下游接缝表、非范围风险表、测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划和 implementation code。 |

### 2. P0 范围候选分组表

| P0 范围候选 | 正式来源 | P0 纳入理由 | 后续落点 |
|---|---|---|---|
| 方法资产统一定义与识别成立 | `00` §7 / §9 / §14;FR-ML-001~002;BR-ML-001~003 | 这是本仓作为方法资产定义真相源的入口。若不能证明定义、身份、目录和适用语境由本仓稳定承载,后续版本、消费和追溯均无基础。 | Step 3 抽测试对象;Step 5 覆盖矩阵;Step 6 用例。 |
| 正式化、正式版本边界与显式变化成立 | FR-ML-003~004;BR-ML-004、BR-ML-007、BR-ML-009~010;`03` state / flow | P0 必须证明正式 / 非正式区分、正式版本稳定和版本语义变化均为显式事实,不得由读取、引用、同步或运行时使用隐式触发。 | Step 3 状态 / flow 候选;Step 6 正向与负向场景;Step 10 一致性专项。 |
| 受控消费与 Definition vs Use 边界成立 | FR-ML-005~006;BR-ML-003、BR-ML-005~008、BR-ML-012~018;`01` 职责边界 | 下游只能按正式 ref、summary、material、event 或 handoff seam 消费方法资产语义,不能创建、修改或替代定义 truth。 | R2.7/R2.8 接缝边界;Step 4 测试分层;Step 6 场景。 |
| 变化追溯、消费影响与证据线索承接成立 | FR-ML-007~009;BR-ML-011、BR-ML-020~022;NFR-ML-009~016 | 方法资产正式化、版本语义变化、消费影响变化和证据线索必须可追溯,重复读取或维护不得制造第二 truth。 | Step 5 追溯覆盖;Step 6 场景;Step 13 evidence 归档。 |
| 详细设计最小验证入口被 P0 承接 | `03` §15;`03_ddd_step_16_test_cut.md` | P0 范围必须覆盖模块、协议族、状态、一致性 / 幂等、错误恢复、配置和观测红线这些最小验证入口,否则无法证明详细设计闭环可执行。 | Step 3 抽取测试对象与切口;Step 6 形成用例矩阵。 |
| 配置 profile 与 fail-fast / fail-closed 红线被 P0 承接 | `04` §6 / §9 / §11 / §12 | `local-dev`、`ci-test`、`integration-like`、`operations-replay` 是 P0 candidate profile;invalid config、unsafe redaction、fixture 污染和 forbidden boundary override 必须能被阻断。 | Step 8 环境配置矩阵;Step 9 自动化门禁;Step 10 专项验证。 |
| body-free、redaction、no synthetic marker、query no-write 等横切红线被 P0 承接 | `03` §14 / §15;`04` §8 / §11 | P0 必须证明 raw body、secret、full sensitive ref 不进入 public surface / log / audit / report,marker 不被测试或实现合成,query 不 repair / 不写 truth。 | Step 6 断言方向;Step 9 suite 候选;Step 13 证据归档。 |
| 旧材料污染不进入新版 P0 | Step 1;R2.4;旧 `05/06/07` historical material | 旧 MethodContent、publish、snapshot、fingerprint、outbox、PostgreSQL、gateway、旧 TC / EV 与当前 `00~04` 不一致,必须被显式排除。 | Step 14 残余风险;Step 15 装配审计。 |

### 3. P0 候选排除规则

| 排除项 | 当前裁决 | 原因 |
|---|---|---|
| 旧 MethodContent / publish / snapshot / fingerprint / outbox 主线 | 排除出新版 P0 | 已被 Step 1 定位为 historical pollution,不能作为当前测试真相源。 |
| 真实 DB / bus / search / object storage / secret provider 产品闭环 | 不作为 P0 前置 | `04` 只给 P0 candidate profile 和 controlled seam,真实产品不证明方法资产 definition truth。 |
| 完整跨仓 E2E 与 sibling 仓内部状态机 | 不作为本仓 P0 前置 | 本仓只证明 Definition vs Use 和消费边界,不拥有 process / identity / runtime / member-images 的内部真相。 |
| staging-like / production-like profile | 不作为当前 P0 必过 | `04` 明确其为 P1/P2 direction,不阻塞当前 P0。 |
| TC / EV / suite / CI 命令 / artifact schema / report schema | 不在 R2.6 定义 | 分别属于 Step 6、Step 9、Step 13,不得在范围候选阶段提前补口。 |
| acceptance gate / release veto / phase / commit boundary | 不在 R2.6 定义 | 分别属于新版 `06-验收标准.md` 和 `07-实施计划.md`。 |

### 4. P0 候选与后续 Step 边界

| 后续 Step | R2.6 交付给它的输入 | R2.6 不替它完成 |
|---|---|---|
| Step 3 测试对象与切口 | P0 候选必须覆盖的能力轴、设计轴和红线轴。 | 不抽具体对象、字段、状态、协议或 test cut。 |
| Step 4 测试策略与分层 | P0 必须和 P1/P2、接缝验证、产品化验证分层。 | 不写测试层级、suite 或执行位置。 |
| Step 5 覆盖矩阵 | P0 候选的需求、规则、NFR 和设计来源。 | 不生成 traceability matrix、TC ID 或 evidence ID。 |
| Step 6 用例矩阵 | P0 候选必须能导出正向、负向、边界和红线场景。 | 不写步骤、fixture、断言或 expected result。 |
| Step 8 环境配置矩阵 | P0 candidate profile 来源和配置红线。 | 不写具体 env、config key、fixture path 或 product binding。 |
| Step 13 证据归档 | P0 候选需要后续可留证。 | 不写 artifact / report schema 或 evidence index。 |
| Step 14 / Step 15 | 旧材料污染排除与装配审计输入。 | 不写残余风险表和正式 `05` 正文。 |

### 5. R2.7 进入门禁

`R2.7 P1/P2 与下游接缝:先思考` 只允许思考 P1/P2 口径和下游接缝边界:

1. 思考 P1/P2 如何承接 durable-like、real-like、staging-like、production-like 和外围增强,且不阻塞 P0。
2. 思考哪些下游能力只测 ref / summary / event / handoff / adapter seam,不测试对方完整实现。
3. 思考 P1/P2 与下游接缝如何避免变成非范围风险表或测试对象表。
4. 思考 `R2.8` 写入边界。
5. 禁止修改正式 `05-测试方案.md`。
6. 禁止写非范围风险表、测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准或实施计划。

### 6. R2.6 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 P0 范围候选分组表 | pass |
| 是否为每组候选写入正式来源、P0 纳入理由和后续落点 | pass |
| 是否写入 P0 候选排除规则 | pass |
| 是否写入 P0 候选与后续 Step 边界 | pass |
| 是否写入 R2.7 进入门禁 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写 P1/P2 细节、下游接缝表、非范围风险表、测试对象、测试切口、用例、数据、环境、门禁、evidence、验收或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.7 P1/P2 与下游接缝:先思考`;只允许思考 P1/P2 口径、下游接缝边界、接缝与测试对象 / 非范围风险的边界和 R2.8 写入边界;不得直接修改正式 `05-测试方案.md`;不得写非范围风险表、测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或 implementation code。

---

## R2.7 P1/P2 与下游接缝:先思考

### 1. 当前模块目标

`R2.7` 只思考 P1/P2 口径、下游接缝边界、接缝与测试对象 / 非范围风险的边界,以及 `R2.8` 写入边界。当前模块不把 P1/P2 固化为最终范围表,不写正式下游接缝表,不写非范围风险表,不抽测试对象 / 测试切口,不生成用例、数据、环境、门禁、evidence、验收或实施内容。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 P1/P2 如何不阻塞 P0、哪些下游能力只测接缝、接缝与测试对象 / 非范围风险的边界和 R2.8 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写最终 P1/P2 范围表、正式下游接缝表、非范围风险表、测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或 implementation code。 |

### 2. P1/P2 口径思考

P1/P2 的核心作用不是扩大当前 P0,而是把“真实产品、真实相邻仓、生产化和外围增强”的验证责任从 P0 主链中隔离出来。P1 应偏向 controlled seam / fake-to-real parity,P2 应偏向 production-like、容量、复杂外围增强和长期演进。

| 优先级 | R2.7 思考口径 | 不应做成 |
|---|---|---|
| P1 | 验证 durable-like / real-like adapter、staging-like dry-run、controlled resolver / publisher / handoff / report target 接缝不会改变 P0 truth 语义,并能稳定映射 unavailable / degraded / failed / delayed。 | P0 必过条件、真实产品闭环、完整跨仓 E2E、vendor-specific 适配承诺。 |
| P2 | 保留 production-like、容量 / SLO、多区域、多租户、真实 secret provider、config center、admin override、marketplace 生态、advanced ViewProfile / AIPolicy、标准映射深化和复杂外围增强。 | 当前测试方案的硬范围、release gate、运维 runbook、具体产品选择或实施 phase。 |
| P1/P2 共同原则 | 只验证“不反向定义核心 truth、不破坏 P0 语义、不泄露 raw body / secret、不绕过正式 marker / source”。 | 通过 P1/P2 补对象字段、port、mapper、config key、evidence schema 或验收裁决。 |

### 3. 下游接缝边界思考

下游接缝应围绕 `00/01` 已确认的 Definition vs Use、运行期 / 事件协作和摘要 / 引用边界展开。当前只思考接缝类别,不写正式接缝表。

| 下游 / 外部类别 | 只测接缝的方向 | 不测试的方向 |
|---|---|---|
| 核心消费方 | process、identity、runtime、member-images 只验证正式 ref、summary、material、event 或 handoff seam 可消费且不拥有定义 truth。 | 流程实例状态、成员生命周期、runtime 执行上下文、image build / runtime 内部状态机。 |
| 条件型依据 / 回报方 | governance 结论、下游消费影响回报只验证正式摘要 / ref / marker 可被本仓承接,不让外部状态成为 truth。 | governance Gate 执行、policy enforce、下游完整回报协议、对账算法。 |
| 外围消费方 | artifact/archive、marketplace、console / SDK 只验证引用、摘要、入口候选或分发语义边界。 | artifact 正文 / archive 生命周期、marketplace 交易履约、UI 渲染与交互状态。 |
| 外部能力 / 产品接缝 | capability-hub、durable store、bus、resolver、publisher、handoff target 只验证 adapter seam、availability / degradation mapping 和 no fake fallback。 | 外部能力注册裁决、真实产品 SLA、vendor schema、credential rotation、物理运维。 |

### 4. 接缝与测试对象 / 非范围风险的边界思考

R2.8 可以写 P1/P2 与下游接缝的范围口径,但仍不能进入 Step 3 的测试对象或 R2.9 的非范围残余风险。接缝讨论只回答“本仓测到哪里为止”。

| 内容 | R2.8 可写 | 必须留到后续 |
|---|---|---|
| P1/P2 范围口径 | 写 P1/P2 的定位、纳入方向和不阻塞 P0 的原则。 | 不写 suite、CI、fixture、真实产品清单或 release gate。 |
| 下游接缝边界 | 写哪些能力只测 ref / summary / event / handoff / adapter seam,以及不测对方完整实现。 | 不抽具体测试对象、字段、状态、协议或 case。 |
| 产品 / adapter 接缝 | 写 durable-like、real-like、staging-like、production-like 的候选验证方向。 | 不锁定 DB、bus、secret provider、object storage、observability backend 或 vendor。 |
| 外围增强 | 写 MethodPlugin / MethodConfiguration、marketplace、advanced ViewProfile / AIPolicy、标准映射等不阻塞 P0。 | 不写外围增强用例矩阵、验收阈值或实施计划。 |
| 残余风险 | 只提示相关风险会交 R2.9/R2.10 收口。 | 不在 R2.8 写完整非范围风险表。 |

### 5. R2.8 写入边界思考

`R2.8 P1/P2 与下游接缝:再写入` 应把 R2.7 的思考固化为可恢复的范围口径,但仍不能完成 Step 2 的非范围 / 残余风险结论:

1. 写 P1/P2 口径表,说明 P1/P2 如何不阻塞 P0。
2. 写下游接缝边界候选表,说明只测 ref / summary / event / handoff / adapter seam。
3. 写不测试对方完整实现、真实产品闭环、UI / artifact / marketplace 正文的边界。
4. 写 P1/P2 / 接缝与 Step 3、Step 6、Step 8、Step 10、R2.9/R2.10 的边界。
5. 写 `R2.9 非范围、残余风险和验收关联:先思考` 进入门禁。
6. 禁止修改正式 `05-测试方案.md`。
7. 禁止写非范围风险表、测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准或实施计划。

### 6. R2.7 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 P1/P2 口径和下游接缝边界 | pass |
| 是否区分 P1/P2 与 P0 必过范围 | pass |
| 是否区分接缝范围与测试对象 / 用例 | pass |
| 是否未写非范围残余风险表 | pass |
| 是否形成 R2.8 写入边界 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写测试对象、测试切口、用例、数据、环境、门禁、evidence、验收或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.8 P1/P2 与下游接缝:再写入`;只允许写入 P1/P2 口径表、下游接缝边界候选表、不测试对方完整实现 / 真实产品闭环 / UI / artifact / marketplace 正文的边界、P1/P2 / 接缝与后续 Step 的边界和 `R2.9` 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写非范围风险表、测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或 implementation code。

---

## R2.8 P1/P2 与下游接缝:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R2.9 |
| 用户确认 | 已确认从 `R2.7` 推进到 `R2.8`。 |
| 本模块写入范围 | P1/P2 口径表、下游接缝边界候选表、不测试对方完整实现 / 真实产品闭环 / UI / artifact / marketplace 正文的边界、P1/P2 / 接缝与后续 Step 的边界和 `R2.9` 进入门禁。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、非范围风险表、测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划和 implementation code。 |

### 2. P1/P2 口径表

| 优先级 | 范围口径 | 当前纳入方向 | 不作为 |
|---|---|---|---|
| P1 | 接缝验证与 fake-to-real parity。 | durable-like / real-like adapter、staging-like dry-run、controlled resolver / publisher / handoff / report target 的可用性、降级、失败映射和 no fake fallback。 | P0 必过条件、真实产品闭环、完整跨仓 E2E、vendor-specific 适配承诺、release gate。 |
| P2 | 生产化、容量、复杂外围增强和长期演进。 | production-like、容量 / SLO、多区域、多租户、真实 secret provider、config center、admin override、marketplace 生态、advanced ViewProfile / AIPolicy、标准映射深化。 | 当前硬范围、当前验收阈值、运维 runbook、具体产品选择、实施 phase。 |
| P1/P2 共通红线 | 验证外围或接缝不反向定义核心 truth。 | 不破坏 P0 truth 语义、不绕过正式 marker / source、不泄露 raw body / secret、不通过外部状态修复本仓 truth。 | 补对象字段、port、mapper、config key、evidence schema、artifact schema、验收裁决或 phase boundary。 |

### 3. 下游接缝边界候选表

| 下游 / 外部能力 | 本轮只测接缝候选 | 不测试对方完整实现 |
|---|---|---|
| `L1-process` | 正式方法资产 ref / summary / material 能被流程模板和任务语义按边界消费,且 process 不拥有定义 truth。 | ProcessInstance、活动状态、流程编排、执行队列、运行时业务状态。 |
| `L1-identity` | RoleDefinition 等身份相关方法语义可被 identity 按 ref / summary 消费,且成员实际角色状态不反写本仓 truth。 | 成员身份、生命周期、权限、成员实际能力画像和 role assignment 状态机。 |
| `L2-runtime` | runtime 可按正式方法 / 角色 / 模板语义形成执行语境,但不创建或修改方法资产定义。 | runtime 调度、执行上下文内部状态、运行时编排和资源管理。 |
| `L2-member-images` | Role 到 image variant 的定义来源可由本仓提供,member-images 不 hardcode 或替代角色定义。 | image build、image registry、运行时镜像选择和部署策略。 |
| `L1-governance` | 条件型治理结论 / 治理依据引用可作为正式化前置或依据摘要,不迁入治理执行。 | Gate 执行、policy enforce、审批流、治理裁决内部状态。 |
| 下游消费影响回报 | 可承接下游消费影响摘要或 marker,用于一致性保护候选。 | 下游完整回报协议、轮询 / 订阅机制、对账算法和运行状态真相。 |
| `L1-artifact` / archive | WorkProductDefinition 等语义可通过引用 / 摘要边界消费,正文不入仓。 | artifact 正文、证据文件、archive package body、外部文件生命周期。 |
| `L6-marketplace` | 方法资产包或分发语义可作为 marketplace 外围消费来源。 | 定价、订单、购买、结算、安装、商业履约和交易状态。 |
| `L5-console` / `L0-sdk` | 管理入口、读取入口或 SDK 封装只作为体验 / 入口候选。 | UI 渲染、会话状态、组件交互、SDK 产品化体验。 |
| `L3-capability-hub` / 外部能力 | resolver、publisher、handoff、target registry 等只测 adapter seam、availability / degraded / failed marker 和 safe diagnostic。 | 外部能力注册裁决、provider schema、credential rotation、真实产品 SLA、物理运维。 |

### 4. 不测试边界说明

| 边界 | 当前说明 |
|---|---|
| 不测试对方完整实现 | 本仓只验证正式 ref / summary / material / event / handoff / adapter seam 的边界,不验证相邻仓内部状态机和业务生命周期。 |
| 不测试真实产品闭环 | durable store、bus、search、object storage、secret provider、observability backend 和 external provider 不作为当前 P0/P1 固定产品承诺。 |
| 不测试 UI / artifact / marketplace 正文 | UI 会话、artifact / archive 正文、marketplace 交易履约均不是方法资产定义 truth,不得进入本仓测试真相。 |
| 不用接缝补设计缺口 | 接缝测试发现 object / port / mapper / marker / config / evidence schema 缺口时,必须回 owning source,不得用 fixture 或 fake 私补。 |
| 不把 P1/P2 写成非范围风险表 | P1/P2 当前只固定范围口径和接缝边界;完整非范围、残余风险和验收关联留给 R2.9/R2.10。 |

### 5. P1/P2 / 接缝与后续 Step 的边界

| 后续 Step | R2.8 交付给它的输入 | R2.8 不替它完成 |
|---|---|---|
| Step 3 测试对象与切口 | 下游接缝只作为对象抽取的边界提示。 | 不抽具体对象、接口、状态、字段或 test cut。 |
| Step 4 测试策略与分层 | P0 / P1 / P2 的分层原则和接缝验证方向。 | 不写 suite、执行位置、阻断级别或自动化层级。 |
| Step 6 用例矩阵 | 接缝场景只能后续转成可执行 case 候选。 | 不写步骤、前置数据、断言或 expected result。 |
| Step 8 环境配置矩阵 | P1/P2 profile 和 product-neutral seam 的方向。 | 不写 config key、env、fixture path、secret provider 或产品绑定。 |
| Step 10 专项测试 | production-like、容量、SLO、redaction、可用性等候选方向。 | 不写阈值、压测模型、runbook 或产品 SLA。 |
| R2.9/R2.10 | P1/P2 未覆盖项和真实产品 / 完整 E2E 将进入非范围与残余风险讨论。 | 不在 R2.8 直接写风险表或验收关联。 |

### 6. R2.9 进入门禁

`R2.9 非范围、残余风险和验收关联:先思考` 只允许思考 Step 2 的非范围、残余风险和验收关联候选:

1. 思考哪些内容应明确排出本轮范围。
2. 思考非范围对应的残余风险归属,但不在 R2.9 写最终风险表。
3. 思考哪些范围项与需求 §14、BR-ML、NFR-ML 和后续新版 `06` 的一票否决 / 验收裁决有关。
4. 思考 R2.10 写入边界。
5. 禁止修改正式 `05-测试方案.md`。
6. 禁止写测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准或实施计划。

### 7. R2.8 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 P1/P2 口径表 | pass |
| 是否写入下游接缝边界候选表 | pass |
| 是否写入不测试对方完整实现 / 真实产品闭环 / UI / artifact / marketplace 正文的边界 | pass |
| 是否写入 P1/P2 / 接缝与后续 Step 的边界 | pass |
| 是否写入 R2.9 进入门禁 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写非范围风险表、测试对象、测试切口、用例、数据、环境、门禁、evidence、验收或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.9 非范围、残余风险和验收关联:先思考`;只允许思考非范围候选、残余风险归属候选、验收关联候选和 R2.10 写入边界;不得直接修改正式 `05-测试方案.md`;不得写测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。

---

## R2.9 非范围、残余风险和验收关联:先思考

### 1. 当前模块目标

`R2.9` 只思考 Step 2 的非范围候选、残余风险归属候选、验收关联候选和 `R2.10` 写入边界。当前模块不写最终非范围风险表,不裁决新版 `06-验收标准.md`,不写测试对象、测试切口、用例、数据、环境、自动化门禁、evidence schema、正式验收标准或实施计划。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考非范围候选、残余风险归属候选、验收关联候选和 R2.10 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写最终非范围风险表;写测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。 |

### 2. 非范围候选思考

非范围候选应来自 `00` 的非目标 / 风险 / 一票否决、`01` 的职责边界、`04` 的 P1/P2 和 future watch,以及 R2.8 已确认的接缝边界。当前只形成候选族,不写最终表。

| 非范围候选族 | 来源 | R2.9 思考 |
|---|---|---|
| 真实产品闭环 | `04` P1/P2 risk;R2.8 不测试真实产品闭环 | DB、bus、search、object storage、secret provider、observability backend、external provider 不作为当前 P0 / 接缝证明的固定产品承诺。 |
| 生产容量和硬 SLO | `00` NFR 判断口径;`04` production-like direction | 容量、硬 SLO、多区域、多租户和 production-like 运维属于 P2 / 专项 / 运维方向,不能在 Step 2 写成当前 release gate。 |
| 完整跨仓端到端 | `01` Definition vs Use;R2.8 下游接缝 | process、identity、runtime、member-images、governance、artifact、marketplace、console 的完整内部生命周期不属于本仓测试范围。 |
| 外围增强 | `00` FR-ML-E-*;`00` §15 风险 | MethodPlugin / MethodConfiguration、marketplace 生态、高级 ViewProfile / AIPolicy、标准映射深化可作为后续增强,但不得阻塞核心闭环。 |
| 治理 / artifact / marketplace / UI 正文 | `00` 一票否决;`01` 职责边界 | governance 执行、artifact / archive 正文、marketplace 交易履约、UI 会话和渲染正文不得进入本仓测试 truth。 |
| 旧材料兼容 | Step 1;R2.6 P0 排除规则 | 旧 MethodContent、publish、snapshot、fingerprint、outbox、PostgreSQL、gateway、旧 TC / EV 不纳入新版正向范围。 |

### 3. 残余风险归属候选思考

非范围不能只写“不测”,必须说明风险归属。R2.10 可以写归属候选,但不应把它升级成实施计划或验收裁决。

| 风险类别 | 归属候选 | R2.9 思考 |
|---|---|---|
| 产品适配风险 | P1 接缝验证 / adapter owner / 后续 ADR | 真实 durable store、bus、resolver、publisher、handoff target 的产品行为需要后续 product-neutral seam 或真实产品验证。 |
| 生产运维风险 | P2 / 运维 / 后续容量评估 | production-like、容量、SLO、multi-region、tenant profile 不在当前 P0 证明中关闭。 |
| 跨仓真实集成风险 | P1 cross-repo integration / sibling owner | 当前只测接缝,相邻仓真实状态机和权限差异需要后续跨仓集成消化。 |
| 外围增强风险 | P2 / feature owner / 设计 owning source | 外围增强若进入核心前置会破坏 truth 边界,需要后续回需求 / 架构 / `03` 重新闭口。 |
| 安全与泄露风险 | security owner / adapter owner / `04` owner | secret provider、raw body、raw config、unsafe redaction 和 evidence 泄露必须在后续环境、自动化和 evidence 中继续承接。 |
| 旧材料污染风险 | Step 15 装配审计 / downstream maintainers | 旧 `05/06/07` 仍可能误导测试、验收和实施,需要在后续 Step 14/15 继续审计。 |

### 4. 验收关联候选思考

R2.9 只能识别“哪些范围项与验收或一票否决有关”,不能写正式验收标准。新版 `06-验收标准.md` 后续负责裁决 gate、veto、threshold、签署和 release 口径。

| 验收关联候选 | 来源 | R2.9 思考 |
|---|---|---|
| 核心能力闭环 | `00` §14.1 | P0 范围必须支撑方法资产统一定义、正式版本、受控消费、追溯和一致性保护。 |
| 功能能力 | FR-ML-001~009;`00` §14.1 | P0 / Step 5 后续必须能追溯到功能能力验收项,但 R2.9 不生成 TC / evidence。 |
| 规则 / 边界 | BR-ML-001~022;`00` §14.1 / §14.2 | 下游反向拥有定义、外部正文入仓、隐式正式化、运行期依赖写成源码拥有关系等应作为验收关联候选。 |
| 数据归属 | `00` 数据归属验收 | 真相数据归属、快照 / 引用不形成第二真相、禁止保存正文边界需要后续覆盖。 |
| 非功能红线 | NFR-ML-001~016;`04` fail-fast / redaction | 性能判断、可用性、安全、追溯、一致性、观测材料不替代 truth 都是后续验收候选。 |
| 一票否决 | `00` §14.2 | 任一导致 truth owner 不清、版本静默覆盖、下游替代定义、未正式资产被消费、正文入仓、不可追溯、外围增强阻塞核心的情况都应进入 R2.10 候选关联。 |

### 5. R2.10 写入边界思考

`R2.10 非范围、残余风险和验收关联:再写入` 应把 R2.9 的候选思考固化为 Step 2 的结构化中间产物,但仍不得替代后续 `06`:

1. 写非范围候选表。
2. 写残余风险归属候选表。
3. 写验收关联候选表,并明确正式验收裁决留给新版 `06-验收标准.md`。
4. 写发现设计 / 配置 / evidence / phase 缺口时的回写规则。
5. 写 `R2.11 回填草稿与 Step 2 stop-review:先思考` 进入门禁。
6. 禁止修改正式 `05-测试方案.md`。
7. 禁止写测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准或实施计划。

### 6. R2.9 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考非范围候选、残余风险归属候选和验收关联候选 | pass |
| 是否未写最终非范围风险表 | pass |
| 是否未裁决新版 `06-验收标准.md` | pass |
| 是否形成 R2.10 写入边界 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写测试对象、测试切口、用例、数据、环境、门禁、evidence、正式验收标准或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.10 非范围、残余风险和验收关联:再写入`;只允许写入非范围候选表、残余风险归属候选表、验收关联候选表、正式验收裁决留给新版 `06` 的说明、缺口回写规则和 `R2.11` 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。

---

## R2.10 非范围、残余风险和验收关联:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R2.11 |
| 用户确认 | 已确认从 `R2.9` 推进到 `R2.10`。 |
| 本模块写入范围 | 非范围候选表、残余风险归属候选表、验收关联候选表、正式验收裁决留给新版 `06` 的说明、缺口回写规则和 `R2.11` 进入门禁。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划和 implementation code。 |

### 2. 非范围候选表

| 非范围候选 | 排除原因 | 当前处理口径 |
|---|---|---|
| 真实 DB / bus / search / object storage / secret provider / observability backend 产品闭环 | 当前 `04` 只确认 product-neutral profile 和 controlled seam,真实产品不是 P0 truth 成立前置。 | 进入 P1/P2、adapter owner、后续 ADR 或运维验证方向。 |
| production-like、容量、硬 SLO、多区域、多租户 | 当前没有正式容量模型、阈值、生产部署和运维 runbook。 | 进入 P2 / 专项测试 / 运维评估方向,不作为当前 release gate。 |
| 完整跨仓端到端和 sibling 仓内部状态机 | 本仓只证明 Definition vs Use 和接缝边界,不拥有 process / identity / runtime / member-images / governance 等内部真相。 | R2.8 已限定只测 ref / summary / event / handoff / adapter seam;完整 E2E 归后续跨仓集成。 |
| MethodPlugin / MethodConfiguration、marketplace 生态、高级 ViewProfile / AIPolicy、标准映射深化 | `00` 明确为外围增强或待确认方向,不能阻塞核心闭环。 | 进入 P2 / feature owner / owning source 回写方向。 |
| governance 执行、artifact / archive 正文、marketplace 交易履约、UI 会话与渲染正文 | `00` 一票否决和 `01` 职责边界均禁止这些正文进入本仓 truth。 | 只保留摘要 / 引用 / 入口 / 接缝候选,正文与生命周期排出本仓测试范围。 |
| 旧 MethodContent、publish、snapshot、fingerprint、outbox、PostgreSQL、gateway、旧 TC / EV | Step 1 和 R2.6 已判定为 historical pollution。 | 不纳入新版目标、范围、用例、evidence 或验收门禁。 |

### 3. 残余风险归属候选表

| 残余风险 | 当前归属候选 | 后续触发 / 处理 |
|---|---|---|
| 产品适配风险 | P1 接缝验证 / adapter owner / ADR | 引入真实 durable store、bus、resolver、publisher、handoff target 时触发。 |
| 生产运维风险 | P2 / 运维 / 容量评估 | production-like、容量、SLO、multi-region、tenant profile 被要求作为正式验收或发布前置时触发。 |
| 跨仓真实集成风险 | P1 cross-repo integration / sibling owner | 相邻仓真实状态机、权限、运行语义与本仓接缝出现差异时触发。 |
| 外围增强边界风险 | P2 / feature owner / 需求、架构或 `03` owning source | 外围增强要进入核心前置、P0 或正式对象 / port / flow 时触发回写。 |
| 安全与泄露风险 | security owner / adapter owner / `04` owner | secret provider、raw body、raw config、unsafe redaction、未脱敏 evidence 或 report 被要求启用时触发。 |
| 旧材料污染风险 | Step 14 / Step 15 装配审计 / downstream maintainers | 后续 Step、正式 `05`、新版 `06/07` 或实现计划引用旧 TC / EV / outbox / gateway 口径时触发。 |

### 4. 验收关联候选表

| 验收关联候选 | 来源 | Step 2 当前处理 |
|---|---|---|
| 核心能力闭环验收 | `00` §14.1 | P0 范围必须支撑方法资产统一定义、正式版本、受控消费、变化追溯和一致性保护。 |
| 功能能力验收 | FR-ML-001~009;`00` §14.1 | 后续 Step 5 / Step 6 / Step 13 需要追溯到功能能力,当前不生成 TC 或 evidence。 |
| 规则 / 边界验收 | BR-ML-001~022;`00` §14.1 / §14.2 | 下游反向拥有定义、隐式正式化、外部正文入仓、运行期依赖变源码拥有等作为验收关联候选。 |
| 数据归属验收 | `00` 数据归属验收 | 真相数据归属、快照 / 引用不形成第二 truth、禁止保存正文边界需要后续覆盖。 |
| 非功能验收 | NFR-ML-001~016;`04` fail-fast / redaction | 性能判断、可用性、安全、追溯、一致性、可观测和 redaction 红线留给后续测试 / 验收闭合。 |
| 一票否决候选 | `00` §14.2 | truth owner 不清、版本静默覆盖、下游替代定义、未正式资产被消费、正文入仓、不可追溯、外围增强阻塞核心、观测材料替代 truth 均需后续新版 `06` 裁决。 |

### 5. 正式验收裁决边界

| 项 | 当前裁决 |
|---|---|
| 是否在 Step 2 写正式验收标准 | 否。Step 2 只识别验收关联候选。 |
| 是否在 Step 2 写 release gate / veto 阈值 | 否。gate、veto、threshold、签署和 release 裁决属于新版 `06-验收标准.md`。 |
| 是否在 Step 2 写 evidence schema | 否。evidence artifact / report schema 属于 Step 13。 |
| 是否在 Step 2 写实施 phase / commit boundary | 否。phase、commit、required_checks 和 implementation ledger 属于新版 `07-实施计划.md`。 |

### 6. 缺口回写规则

| 发现的缺口 | 回写 / 处理 |
|---|---|
| object / DTO / port / mapper / marker / state / flow 缺口 | 回 `03-详细设计.md` owning Step,不得用测试 fixture 或 fake private map 补口。 |
| config key / profile / source / secret / adapter binding 缺口 | 回 `04-配置设计.md` owning Step,不得在测试方案私写配置真相源。 |
| evidence artifact / report schema 缺口 | 留给 Step 13 或回 evidence owning source,不得在 Step 2 发明 schema。 |
| acceptance gate / veto / threshold 缺口 | 留给新版 `06-验收标准.md`,不得在 Step 2 裁决。 |
| phase / commit boundary / required_checks / implementation ledger 缺口 | 留给新版 `07-实施计划.md`,不得在 Step 2 裁决。 |
| 旧材料污染 | 记录到 Step 14 / Step 15 装配审计,不得继承旧口径。 |

### 7. R2.11 进入门禁

`R2.11 回填草稿与 Step 2 stop-review:先思考` 只允许思考 Step 2 已确认内容如何形成正式 §2 回填草稿:

1. 思考正式 `05-测试方案.md` §2 应包含哪些收口结论。
2. 思考哪些中间产物内容只作校准来源,不进入正式正文。
3. 思考 Step 2 stop-review 检查项和进入 Step 3 条件。
4. 思考 R2.12 写入边界。
5. 禁止修改正式 `05-测试方案.md`。
6. 禁止写测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准或实施计划。

### 8. R2.10 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入非范围候选表 | pass |
| 是否写入残余风险归属候选表 | pass |
| 是否写入验收关联候选表 | pass |
| 是否明确正式验收裁决留给新版 `06` | pass |
| 是否写入缺口回写规则和 R2.11 进入门禁 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写测试对象、测试切口、用例、数据、环境、门禁、evidence、正式验收标准或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.11 回填草稿与 Step 2 stop-review:先思考`;只允许思考正式 §2 回填草稿边界、校准来源取舍、Step 2 stop-review 检查项、进入 Step 3 条件和 R2.12 写入边界;不得直接修改正式 `05-测试方案.md`;不得写测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。

---

## R2.11 回填草稿与 Step 2 stop-review:先思考

### 1. 当前模块目标

`R2.11` 只思考 Step 2 已确认内容如何在中间产物内形成正式 §2 回填草稿,并确认 Step 2 是否具备关闭条件。当前模块不写正式 `05-测试方案.md`,不把范围候选扩展成测试对象 / 测试切口 / 用例矩阵,不裁决 evidence、验收门禁或实施计划。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R2.12 |
| 用户确认 | 已确认从 `R2.10` 推进到 `R2.11`。 |
| 当前允许 | 思考正式 §2 回填草稿边界、校准来源取舍、Step 2 stop-review 检查项、进入 Step 3 条件和 R2.12 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。 |

### 2. 正式 §2 回填草稿边界思考

正式 `05-测试方案.md` §2 应只承载 Step 2 已收口的测试目标与范围结论。它不是 Step 3~14 的提前展开,也不是新版 `06/07` 的替代。

| §2 可回填内容 | 来源 | R2.11 思考 |
|---|---|---|
| 本轮测试目标 | R2.4 测试目标候选;`00` 核心能力闭环;`03` test cuts | 应表达“证明方法资产定义、正式版本、受控消费、变化追溯、一致性保护和证据线索成立”。 |
| P0 / P1 / P2 优先级口径 | R2.4;R2.6;R2.8;R2.10 | 应说明 P0 是核心闭环和红线必测,P1 是真实 / real-like 接缝验证,P2 是生产与外围增强方向。 |
| P0 范围候选 | R2.6 | 可概括 core truth、protocol、state、consistency、query no-write、job no truth repair、config、redaction、observability 等范围族。 |
| P1/P2 与下游接缝 | R2.8 | 可说明 process、identity、governance、runtime、member-images、artifact/archive、capability-hub、marketplace、UI/console、observability 只测接缝。 |
| 非范围与残余风险 | R2.10 | 可写真实产品、production-like、完整跨仓 E2E、高级外围增强和旧材料污染不进入当前 P0,但需进入风险或后续触发。 |
| 验收关联候选 | R2.10 | 只能写“后续 Step 5 / Step 13 / 新版 `06` 需要承接”,不能写正式 gate、veto 阈值或 release 裁决。 |
| 缺口回写规则 | R2.10 | 可简述发现 schema / port / config / evidence / phase 缺口时回 owning source,不在测试方案私补。 |

### 3. 不进入正式 §2 的内容思考

中间产物中保留了大量过程材料。正式 §2 需要短而稳定,避免把讨论过程、待确认口径或后续 Step 内容混入正式正文。

| 不进入正式 §2 的内容 | 保留位置 | 原因 |
|---|---|---|
| R2.1/R2.3/R2.5/R2.7/R2.9 的完整思考过程 | 本文件对应模块 | 这些是推理记录,正式正文只收口结论。 |
| 必读文档读取状态和流程恢复规则 | R2.2;flow;project ledger | 属于执行台账,不是测试目标正文。 |
| 完整测试对象清单和切口拆分 | 后续 Step 3 | Step 2 只确定范围和优先级。 |
| TC 编号、用例断言、fixture、数据集 | 后续 Step 6 / Step 7 | 当前尚未进入用例设计。 |
| 环境拓扑、profile 矩阵、CI job、报告 artifact schema | 后续 Step 8 / Step 9 / Step 13 | 当前不能发明执行和证据 schema。 |
| 正式验收标准、veto、签署和 release gate | 新版 `06-验收标准.md` | Step 2 只能识别验收关联候选。 |
| phase、commit boundary、required_checks、implementation ledger | 新版 `07-实施计划.md` | 实施顺序不属于测试范围章节。 |

### 4. 校准来源取舍思考

正式 §2 的校准来源应指向本 Step 文件,再通过延伸阅读引导读者查看已收口小节。上游 `00`~`04` 是正式输入基线,但 §2 不需要把所有上游章节重复列成正文。

| 来源类型 | §2 使用方式 | R2.11 思考 |
|---|---|---|
| `design-calibration/05_test_plan_step_02_scope.md` | 作为 §2 直接校准来源 | 必须写入正式章节的 `校准来源`。 |
| R2.4 / R2.6 / R2.8 / R2.10 | 延伸阅读重点 | 它们分别承载目标、P0 范围、P1/P2 接缝、非范围风险和验收关联。 |
| Step 1 input boundary | 背景来源 | 只在需要说明旧 `05/06/07` 降级时引用,不重复铺开。 |
| `00/01/02/03/04` | 上游正式基线 | §2 正文可用编号和术语,但不能新增上游未确认结论。 |
| L1-governance Step 2 | framework reference only | 只参考 stop-review 和回填草稿形态,不得迁移 governance 领域事实。 |

### 5. Step 2 stop-review 检查项思考

Step 2 关闭前需要检查的是范围是否已经可支撑 Step 3,而不是检查用例、数据、环境或 evidence 是否已经完成。

| 检查项 | 期望结果 | R2.11 思考 |
|---|---|---|
| SOP Step 2 五问是否均已回答 | pass | R2.4/R2.6/R2.8/R2.10 已覆盖 P0、P1/P2、下游接缝、非范围风险和验收关联。 |
| P0 / P1 / P2 是否边界清晰 | pass | P0 证明核心闭环和红线,P1/P2 不阻塞 P0。 |
| 下游接缝是否没有越界 | pass | 本仓只测 ref / summary / event / handoff / adapter seam。 |
| 非范围是否有残余风险归属 | pass | R2.10 已给出产品、运维、跨仓、外围增强、安全和旧材料污染风险归属候选。 |
| 验收关联是否未被提前裁决 | pass | 新版 `06` 才裁决 gate、veto、threshold 和 release。 |
| 是否未发明 schema / port / state / config / evidence / phase | pass | 缺口回写规则已经固定。 |
| 是否未修改正式 `05-测试方案.md` | pass | 本 Step 仍只更新 calibration 文件。 |

### 6. 进入 Step 3 条件思考

Step 3 的任务是抽取测试对象与测试切口。它可以使用 Step 2 的范围和优先级作为筛选器,但不能把 Step 2 直接当作对象清单或用例矩阵。

| 进入条件 | 判断 |
|---|---|
| Step 2 的 P0 范围族已收稳 | 可以支撑 Step 3 抽取 P0 测试对象。 |
| P1/P2 和下游接缝已区分 | 可以避免 Step 3 把相邻仓内部对象误纳入本仓测试对象。 |
| 非范围和残余风险已记录 | 可以避免 Step 3 把真实产品、production-like、完整 E2E 或旧材料污染纳入 P0。 |
| 验收关联已限定为候选 | 可以避免 Step 3 提前写 `06` 的正式裁决。 |
| 当前无阻塞 Step 3 的测试范围缺口 | 可以在 R2.12 完成后等待用户确认进入 Step 3。 |

### 7. R2.12 写入边界思考

`R2.12 回填草稿与 Step 2 stop-review:再写入` 应把 R2.11 的思考固化为 Step 2 的结构化收口,但仍不得写正式 `05-测试方案.md`:

1. 写正式 §2 回填草稿候选,包括校准来源、延伸阅读、测试目标、范围分层、下游接缝、非范围风险和验收关联边界。
2. 写 Step 2 stop-review 表。
3. 写待确认事项和进入 Step 3 条件。
4. 更新 `05_test_plan_calibration_flow.md` 和 `project_execution_ledger.md`,使当前门禁进入 Step 2 completed_wait_user_confirm_to_Step_3。
5. 禁止修改正式 `05-测试方案.md`。
6. 禁止写 Step 3 的测试对象 / 测试切口、Step 6 用例矩阵、Step 13 evidence schema、新版 `06` 验收标准或新版 `07` 实施计划。

### 8. R2.11 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考正式 §2 回填草稿边界 | pass |
| 是否区分正式正文与中间产物过程材料 | pass |
| 是否形成校准来源取舍 | pass |
| 是否形成 Step 2 stop-review 检查项 | pass |
| 是否形成进入 Step 3 条件思考 | pass |
| 是否形成 R2.12 写入边界 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写测试对象、测试切口、用例、数据、环境、门禁、evidence、正式验收标准或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.12 回填草稿与 Step 2 stop-review:再写入`;只允许写入正式 §2 回填草稿候选、Step 2 stop-review 表、待确认事项、进入 Step 3 条件,并更新 flow / project ledger 到 Step 2 completed_wait_user_confirm_to_Step_3;不得直接修改正式 `05-测试方案.md`;不得写测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。

---

## R2.12 回填草稿与 Step 2 stop-review:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R3.1 |
| 用户确认 | 已确认从 `R2.11` 推进到 `R2.12`。 |
| 本模块写入范围 | 正式 §2 回填草稿候选、Step 2 stop-review 表、待确认事项、进入 Step 3 条件,并更新 flow / project ledger 到 Step 2 completed_wait_user_confirm_to_R3.1。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划和 implementation code。 |

### 2. 正式 §2 回填草稿候选

> 校准来源:
> - `design-calibration/05_test_plan_step_02_scope.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的 `R2.4 测试目标与优先级口径:再写入`、`R2.6 P0 范围候选:再写入`、`R2.8 P1/P2 与下游接缝:再写入`、`R2.10 非范围、残余风险和验收关联:再写入`、`R2.12 回填草稿与 Step 2 stop-review:再写入`,了解本章测试目标与范围如何从正式上游收敛。

本轮测试目标是证明 `L3-method-library` 作为方法资产定义与受控消费的真相仓成立。测试范围必须从当前正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 和 `design-calibration/03_ddd_step_16_test_cut.md` 推导,不得从旧 `05/06/07`、旧 MethodContent、旧 publish/snapshot/outbox 或实现侧假设反推。

| 范围层级 | 本轮含义 | 当前范围边界 |
|---|---|---|
| P0 | 证明核心能力闭环和红线成立。 | 覆盖方法资产统一定义、正式化版本、受控消费、变化追溯、一致性保护、证据线索承接、七实现单元、protocol family、state / consistency / error / config / observability 最小验证入口。 |
| P1 | 证明真实或 real-like 接缝不会改变 P0 truth 语义。 | 只验证 durable / real-like adapter、resolver、publisher、handoff、外部摘要和跨仓协作接缝;不要求真实产品闭环成为 P0 前置。 |
| P2 | 证明未来生产化和外围增强不反向定义核心 truth。 | 保留 production-like、容量、硬 SLO、多区域、多租户、MethodPlugin / MethodConfiguration、marketplace、高级 ViewProfile / AIPolicy、标准映射深化等演进方向。 |

P0 范围应至少覆盖以下范围族:

| P0 范围族 | 当前说明 |
|---|---|
| core truth / definition | 方法资产定义、正式版本、生命周期、关系、摘要和来源边界必须按正式对象 / flow 成立。 |
| public protocol | Command、Query、Inbound、Outbound、Operations Job 的公开契约必须能被验证,但具体 TC 编号留给 Step 6。 |
| state and consistency | 状态机、事务、version、stored replay、idempotency、query no-write、job no truth repair 必须纳入后续测试对象和用例设计。 |
| config and dependency | `local-dev`、`ci-test`、`integration-like`、`operations-replay` 等 P0 candidate profile、fail-fast、adapter availability、safe degradation 和 downstream handoff 必须可验证。 |
| redaction and observability | raw body、secret、unsafe diagnostic、raw config、外部正文不得进入 log、audit、trace、report、outbox 或 evidence。 |

下游能力只测本仓拥有的接缝边界。process、identity、governance、runtime、member-images、artifact/archive、capability-hub、marketplace、UI/console、observability 等相邻能力只验证 ref、summary、event、handoff、adapter seam、safe issue 或 degraded marker 的本仓边界,不测试对方完整内部状态机、产品 UI、正文存储、交易履约或真实运维闭环。

非范围必须保留残余风险归属。真实 DB/bus/search/object storage/secret provider/observability backend、production-like、容量、硬 SLO、完整跨仓 E2E、高级外围增强、旧 MethodContent / publish / snapshot / fingerprint / outbox / PostgreSQL / gateway / 旧 TC / EV 均不进入当前 P0。后续若这些能力被要求进入 P0、验收或实施边界,必须回对应 owning source 或在 P1/P2 / ADR / 运维 / 下游文档中闭合。

验收关联在本 Step 只作为候选。核心能力、FR-ML-001~009、BR-ML-001~022、数据归属、NFR-ML-001~016、fail-fast、redaction 和一票否决候选需要被 Step 5 / Step 6 / Step 13 和新版 `06-验收标准.md` 承接;Step 2 不定义正式 gate、veto 阈值、release 裁决、evidence artifact schema 或实施 phase。

### 3. Step 2 stop-review

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否回答 SOP Step 2 五问 | pass | P0、P1/P2、下游接缝、非范围残余风险和验收关联均已在 R2.4/R2.6/R2.8/R2.10/R2.12 收口。 |
| 是否固定 P0 / P1 / P2 口径 | pass | P0 证明核心闭环和红线;P1/P2 不阻塞 P0,只作接缝或演进方向。 |
| 是否明确下游只测接缝 | pass | 相邻仓内部状态机、正文、产品 UI、交易和真实运维闭环均不纳入本仓 P0。 |
| 是否明确非范围和残余风险归属 | pass | 产品适配、生产运维、跨仓集成、外围增强、安全泄露和旧材料污染均已记录归属候选。 |
| 是否未提前裁决验收 | pass | gate、veto、threshold、签署、release 和 evidence 裁决均留给 Step 13 / 新版 `06`。 |
| 是否未发明 schema / port / mapper / state / config / evidence / phase | pass | 缺口回写规则已固定,不得用测试方案补设计真相源。 |
| 是否未修改正式 `05-测试方案.md` | pass | 本 Step 只更新 `design-calibration/05_test_plan_step_02_scope.md`、flow 和项目台账。 |
| 是否具备进入 Step 3 条件 | pass | 范围、优先级、接缝、非范围和风险边界足以支撑测试对象与测试切口抽取。 |

### 4. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| Step 3 抽取测试对象时是否发现某个 P0 范围缺正式对象 / port / marker 来源 | 可能阻塞对应测试切口 | 回 `03-详细设计.md` owning Step,不得在测试对象清单私补。 |
| P1 real-like adapter 是否需要提前进入当前测试执行 | 影响 Step 8 / Step 9 / Step 10 深度 | 当前只作为接缝验证候选,不阻塞 P0。 |
| 新版 `06` 是否把所有一票否决候选升级为正式 veto | 影响 evidence 强度和 release gate | Step 13 先定义证据供给,新版 `06` 后续裁决。 |
| 旧 `05/06/07` 的旧 TC / EV 是否可能在后续装配中混入 | 影响 Step 14 / Step 15 审计 | 后续必须做旧材料污染审计,不得继承旧编号。 |

### 5. 进入 Step 3 条件

| 条件 | 状态 | 说明 |
|---|---|---|
| Step 1 输入边界已关闭 | pass | 正式 `00/01/02/03/04` 和 `03_ddd_step_16_test_cut.md` 是正向输入。 |
| Step 2 测试目标已收口 | pass | 本轮证明方法资产定义、正式化、受控消费、追溯、一致性和证据线索成立。 |
| Step 2 范围分层已收口 | pass | P0/P1/P2 边界明确。 |
| Step 2 下游接缝已收口 | pass | 只测本仓拥有的 ref / summary / event / handoff / adapter seam。 |
| Step 2 非范围和残余风险已记录 | pass | 非范围不再阻塞 Step 3,但保留归属和触发条件。 |
| Step 2 无阻塞 Step 3 的范围缺口 | pass | 可以等待用户确认后进入 Step 3 `R3.1`。 |

### 6. R3.1 进入门禁

`R3.1 开工与必读文档:先思考` 只允许思考 Step 3 的开工边界和必读文档:

1. 思考 Step 3 如何从 Step 2 的 P0/P1/P2 范围抽取测试对象与测试切口。
2. 思考必须读取的正式 `00/01/02/03/04`、`03_ddd_step_16_test_cut.md`、Step 1 / Step 2 中间产物和 L1-governance Step 3 框架参考。
3. 思考测试对象、测试切口、后续用例矩阵之间的边界。
4. 思考 `R3.2 开工与必读文档:再写入` 的写入边界。
5. 禁止修改正式 `05-测试方案.md`。
6. 禁止写完整测试对象清单、测试切口矩阵、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准或实施计划。

### 7. R2.12 final stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入正式 §2 回填草稿候选 | pass |
| 是否写入 Step 2 stop-review 表 | pass |
| 是否写入待确认事项和进入 Step 3 条件 | pass |
| 是否写入 R3.1 进入门禁 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写测试对象、测试切口、用例、数据、环境、门禁、evidence、正式验收标准或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.1 开工与必读文档:先思考`;只允许思考 Step 3 开工边界、必读文档、Step 2 handoff、L1-governance Step 3 框架参考、测试对象 / 测试切口 / 用例矩阵边界和 R3.2 写入边界;不得直接修改正式 `05-测试方案.md`;不得写完整测试对象清单、测试切口矩阵、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。
