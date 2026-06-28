# Step 3. 抽取测试对象与测试切口

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 3
> 回填章节: `05-测试方案.md` §3 测试对象与测试切口
> 创建日期: 2026-06-27
> 当前模式: full-restart / step3-test-objects-cuts
> 当前状态: in_progress
> 当前模块: `R3.12 P0 切口停审与跨切口审计:再写入`
> 当前门禁: `R3.12` completed_wait_user_confirm_to_R4.1;等待确认进入 Step 4 `R4.1 测试策略与分层:先思考`

---

## 0. Step 2 handoff

Step 2 已确认当前 `05-测试方案.md` 的测试目标、范围、非范围和优先级边界:

- P0 用于证明方法资产定义、正式化版本、受控消费、变化追溯、一致性保护、证据线索、七实现单元、public protocol、state / consistency / error / config / observability 最小验证入口成立。
- P1 只验证 durable / real-like adapter、resolver、publisher、handoff、外部摘要和跨仓协作接缝不改变 P0 truth 语义。
- P2 保留 production-like、容量、硬 SLO、多区域、多租户、MethodPlugin / MethodConfiguration、marketplace、高级 ViewProfile / AIPolicy、标准映射深化等演进方向。
- 下游能力只测本仓拥有的 ref / summary / event / handoff / adapter seam,不测试相邻仓完整内部状态机、产品 UI、正文存储、交易履约或真实运维闭环。
- Step 3 不得生成 TC 编号、fixture、测试数据、环境矩阵、CI suite、evidence schema、正式验收标准或实施计划。

Step 3 的任务是把 Step 2 的范围分层和 `03/04` 的正式设计输入转成“测试对象与测试切口”。它回答“哪些对象必须被验证、每个对象从哪个设计真相源来、验证入口是什么、风险是什么、推荐层级是什么”。它不是用例矩阵,也不是自动化门禁。

---

## R3.1 开工与必读文档:先思考

### 1. 当前模块目标

`R3.1` 只思考 Step 3 的开工边界、必读文档、Step 2 handoff、L1-governance Step 3 框架参考、测试对象 / 测试切口 / 用例矩阵边界和 `R3.2` 写入边界。

当前模块不写完整测试对象清单、测试切口总表、设计真相源矩阵、P0 切口停审记录、跨切口审计表、TC 编号、fixture、测试数据、环境、CI 门禁、evidence schema、验收标准或实施计划。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R3.2 |
| 用户确认 | 已确认从 Step 2 completed 推进到 Step 3 `R3.1`。 |
| 当前允许 | 思考 Step 3 开工边界、必读文档、Step 2 handoff、L1-governance Step 3 框架参考、测试对象 / 测试切口 / 用例矩阵边界和 R3.2 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写完整测试对象清单、测试切口矩阵、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。 |

### 2. Step 3 启动前必须承接

| 输入 | 必须承接的内容 | 禁止继承 / 禁止提前 |
|---|---|---|
| `project_execution_ledger.md` | 当前恢复点为 Step 3 `R3.1`;每次用户确认只推进一个当前模块。 | 跳过 R3.1/R3.2 直接写完整测试对象与切口总表。 |
| `05_test_plan_calibration_flow.md` | Step 1 / Step 2 completed;Step 3 waiting_user_confirm_to_R3.1;Step 4+ blocked。 | 将 Step 4~13 的策略、用例、数据、环境、门禁和 evidence 提前写入。 |
| `05_test_plan_step_01_input_boundary.md` | 正式输入边界、旧材料隔离和不得补 schema / port / evidence / phase 的规则。 | 从旧 `05/06/07` 恢复旧测试对象、旧 TC / EV 或旧 outbox/gateway 假设。 |
| `05_test_plan_step_02_scope.md` | P0/P1/P2 范围、非范围、下游接缝和进入 Step 3 条件。 | 把 P1/P2 产品化能力提升为 P0 测试对象。 |
| `测试方案讨论流程_SOP.md` Step 3 | Step 3 必须输出测试对象与切口总表、P0 切口停审记录和跨切口设计来源审计表。 | 用技术层级表替代设计真相源回指。 |
| `测试方案书写规范.md` §5.3 / §3 | 正式 §3 必须列测试对象、来源章节、测试切口、风险和推荐测试层级。 | 只写模块泛名或不写来源章节。 |
| `设计文档讨论中间产物规范.md` | 先思考后写入、单模块推进、未来 Step 不提前落盘、单次写入批次不是最终长度上限。 | 一次性写完 Step 3 全部切口和 Step 6 用例。 |
| `设计真相源闭环与可落码性标准.md` | 测试对象和切口不得补对象、DTO、port、mapper、marker、state、config key、evidence schema 或 phase boundary。 | 用测试 helper / fake private map 填正式来源缺口。 |
| `00-需求文档.md` | 核心能力、FR-ML、BR-ML、NFR-ML、数据归属和验收方向。 | 改写需求或把外围增强变成 P0。 |
| `01-架构设计.md` | Definition vs Use、职责边界、数据所有权、依赖裁剪、正文禁入和下游接缝。 | 把相邻仓内部状态机或产品 UI 纳入本仓对象。 |
| `02-概要设计.md` | 八个主要组成部分、关键对象、接口骨架、处理流、状态、异常和配置影响。 | 把概要对象轮廓直接扩成 TC。 |
| `03-详细设计.md` | 七实现单元、对象、port、protocol、flow、state、transaction、error、idempotency、config、observability 和 §15 test cuts。 | 新增未闭合对象、状态、mapper 或 marker 来源。 |
| `03_ddd_step_16_test_cut.md` | module / protocol / state / consistency / error / config / observability 最小验证入口。 | 直接复制为完整 TC / evidence 矩阵。 |
| `04-配置设计.md` | P0 profile candidate、source priority、validation、secret/redaction、adapter availability、failure/degradation 和 downstream handoff。 | 写具体 env key、topic、URL、secret provider 或 deployment command。 |
| L1-governance Step 3 | 参考“目标 -> 输入 -> SOP 问题回答 -> 诊断 -> 取舍 -> 结构化中间产物 -> 回填草稿 -> 待确认 -> 进入下一步条件”的框架。 | 复制 governance 对象、协议数量、VF、case、证据或门禁。 |

### 3. SOP Step 3 十问思考边界

| SOP 问题 | R3.1 思考边界 | 后续落点 |
|---|---|---|
| 哪些 domain object / value object / policy 必须单测? | 先按 `03` 对象契约和 Step 2 P0 范围识别对象族,不在 R3.1 写完整对象清单。 | R3.3/R3.4 开始抽对象族。 |
| 哪些 application service 必须做 service test? | 先按 Command / Query / Consumer / Outbound / Job flow family 识别 service test 分类。 | 后续模块写 service 切口。 |
| 哪些 repository / adapter / worker 必须做集成测试? | 先按 repository、UoW、resolver、publisher、handoff、runtime builder、worker/job runner 识别候选类型。 | 后续模块写 integration / fake parity 切口。 |
| 哪些 Command / Query / Event / Job 必须做协议和流程测试? | public protocol family 全部需要入口,但 R3.1 不列完整协议逐项表。 | 后续按 protocol family 写切口总表。 |
| 哪些状态机、事务、一致性、幂等和恢复行为必须单列切口? | 先按 `03` §9~§12 和 §15 的 state / consistency / recovery cuts 分组。 | 后续模块写状态和一致性切口。 |
| 哪些字段缺失、DTO 构造失败或引用混同必须作为负向测试切口? | 先确认负向切口必须来自正式 schema / flow / error source。 | 后续模块写负向切口清单。 |
| 哪些状态名必须以详细设计正式 enum variant 为准? | 先确认状态名来源只能是 `03` state matrix。 | 后续写状态切口时逐项回指。 |
| 每个测试切口回指哪个设计真相源? | 先固定所有切口必须回 `03/04` 具体章节或中间产物。 | R3.2 以后形成来源列。 |
| 哪些 P0 设计契约还没有测试切口承接? | R3.1 只定义后续审计方法,不提前判断无缺口。 | Step 3 末尾跨切口审计。 |
| 每个 P0 测试切口是否通过停审? | R3.1 只定义停审维度。 | Step 3 后续每个切口完成后停审。 |

### 4. L1-governance Step 3 框架参考思考

L1-governance Step 3 的价值在组织框架,不是领域内容。L3-method-library 采用其“范围输入 -> 对象抽取 -> 协议 / flow / state / consistency / config / observability 切口 -> 负向风险 -> P0 停审 -> 跨切口审计 -> 回填草稿”的形态。

| L1-governance 框架点 | L3 采用方式 |
|---|---|
| Step 状态先声明 | L3 Step 3 文件先记录当前模块、门禁和 Step 2 handoff。 |
| 输入基线紧贴 Step 2 和 `03/04` | L3 以 Step 2 范围、`03` §5~§15、`03_ddd_step_16_test_cut.md`、`04` §12 为直接输入。 |
| SOP 问题逐项回答 | L3 后续按对象、service、repository/adapter、protocol、state、consistency、negative cuts 分批回答。 |
| 结构化表分层 | L3 后续分测试对象总表、设计真相源表、P0 停审表、跨切口审计表、负向切口清单。 |
| 不生成 TC / fixture / evidence | L3 Step 3 只到切口,Step 6 / Step 7 / Step 13 再展开用例、数据和证据。 |
| 停审后再进入 Step 4 | L3 Step 3 完成后必须暂停,用户确认后才进入测试策略与分层。 |

### 5. 测试对象 / 测试切口 / 用例矩阵边界思考

| 概念 | Step 3 允许 | Step 3 禁止 |
|---|---|---|
| 测试对象 | 可写模块、对象族、protocol family、flow family、state family、repository/adapter family、config / observability boundary。 | 写具体 TC、测试步骤、fixture、数据集、脚本命令。 |
| 测试切口 | 可写验证入口、风险、推荐测试层级、设计真相源、后续用例要求。 | 写完整断言序列、用例 ID、证据 ID、artifact path。 |
| 用例矩阵 | 只允许说明“后续 Step 6 展开”。 | 在 Step 3 生成正向 / 负向 / 边界 / 并发用例矩阵。 |
| 测试数据 | 只允许标记后续需要数据前置。 | 写 fixture JSON、seed、builder、清理策略。 |
| 自动化 / evidence | 只允许标记后续交 Step 9 / Step 13。 | 写 CI suite、report path、artifact schema、EV 编号。 |
| 验收 / 实施 | 只允许标记后续交新版 `06/07`。 | 写 gate、veto、phase、commit boundary、required_checks。 |

### 6. Step 3 初步分批思考

| 模块 | 主题 | 初判边界 |
|---|---|---|
| R3.1/R3.2 | 开工与必读文档 | 写 Step 3 必读文档、输入基线、Step 2 handoff、框架参考、分批计划。 |
| R3.3/R3.4 | 测试对象抽取口径 | 按 module / object / service / port-adapter / protocol / state / config / observability 建对象抽取规则。 |
| R3.5/R3.6 | P0 测试对象候选 | 写 P0 对象族候选,但不生成 TC。 |
| R3.7/R3.8 | 测试切口候选与设计真相源 | 写切口候选、来源章节、风险、推荐层级和后续用例要求。 |
| R3.9/R3.10 | 负向切口、P1/P2 切口与非范围保护 | 写字段缺失、DTO 构造失败、引用混同、状态漂移、P1/P2 seam 和非范围不入 P0。 |
| R3.11/R3.12 | P0 切口停审与跨切口审计 | 写停审表、孤儿契约 / 重复切口 / phase 越界审计、Step 4 进入条件。 |

### 7. R3.2 写入边界思考

`R3.2 开工与必读文档:再写入` 只应把 R3.1 的开工思考落成可恢复台账,不得进入完整测试对象与测试切口总表:

1. 写 Step 3 必读文档表与读取状态。
2. 写 Step 2 handoff 承接表。
3. 写 Step 3 输入基线与旧材料处理规则。
4. 写 SOP 十问写入口径。
5. 写 L1-governance Step 3 框架参考边界。
6. 写测试对象 / 测试切口 / 用例矩阵边界表。
7. 写 Step 3 分批计划。
8. 写 `R3.3 测试对象抽取口径:先思考` 进入门禁。

### 8. R3.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 Step 3 开工边界和必读文档 | pass |
| 是否承接 Step 2 completed handoff | pass |
| 是否参考 L1-governance 框架但不复制领域语义 | pass |
| 是否区分测试对象、测试切口和用例矩阵 | pass |
| 是否形成 Step 3 分批计划 | pass |
| 是否形成 R3.2 写入边界 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写完整测试对象清单、测试切口矩阵、用例、数据、环境、门禁、evidence、验收或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.2 开工与必读文档:再写入`;只允许写入 Step 3 必读文档表、读取状态、Step 2 handoff 承接、输入基线、旧材料处理规则、SOP 十问写入口径、L1-governance Step 3 框架参考边界、测试对象 / 测试切口 / 用例矩阵边界、Step 3 分批计划和 `R3.3` 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写完整测试对象清单、测试切口矩阵、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。

---

## R3.2 开工与必读文档:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R3.3 |
| 用户确认 | 已确认从 `R3.1` 推进到 `R3.2`。 |
| 本模块写入范围 | Step 3 必读文档表、读取状态、Step 2 handoff 承接、输入基线、旧材料处理规则、SOP 十问写入口径、L1-governance Step 3 框架参考边界、测试对象 / 测试切口 / 用例矩阵边界、Step 3 分批计划和 `R3.3` 进入门禁。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、完整测试对象清单、测试切口矩阵、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划和 implementation code。 |

### 2. 必读文档表与读取状态

| 文档 | 读取状态 | Step 3 用途 | 当前裁决 |
|---|---|---|---|
| `project_execution_ledger.md` | 已读取并承接 | 确认当前恢复点、当前模块和 next_allowed_action。 | 当前只推进 `R3.2`。 |
| `05_test_plan_calibration_flow.md` | 已读取并承接 | 确认 Step 1 / Step 2 completed、Step 3 in_progress、Step 4+ blocked。 | `R3.2` 完成后只能等待 `R3.3`。 |
| `05_test_plan_step_01_input_boundary.md` | 已读取并承接 | 固定正式输入边界、旧材料隔离和不得补缺口规则。 | Step 1 不重开。 |
| `05_test_plan_step_02_scope.md` | 已读取并承接 | 固定 P0/P1/P2、下游接缝、非范围和进入 Step 3 条件。 | Step 2 不重开。 |
| `05_test_plan_step_03_test_objects_cuts.md` | 已创建并更新 | 记录 Step 3 R3.1/R3.2 的思考、写入和停审。 | 当前文件是唯一允许写入的 Step 文件。 |
| `standards/document/测试方案讨论流程_SOP.md` | 已读取 Step 3 | 固定 Step 3 目标、输入、输出、十问、停审和进入下一步条件。 | Step 3 只抽测试对象与测试切口。 |
| `standards/document/测试方案书写规范.md` | 已读取 §5.3 / §3 入口 | 固定正式 §3 必须输出测试对象、来源章节、测试切口、风险和推荐测试层级。 | 正式 `05` 仍留到 Step 15 装配。 |
| `standards/document/设计文档讨论中间产物规范.md` | 已读取通用纪律 | 固定逐 Step、先思考后写入、单模块推进和批次规则。 | 本轮只写 R3.2。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已列入必读 | 防止测试对象 / 切口补 schema、port、mapper、state、config、evidence 或 phase 缺口。 | 后续发现缺口回 owning source。 |
| `00-需求文档.md` | 已读取关键章节 | 提供 FR-ML、BR-ML、NFR-ML、核心能力、数据归属和验收方向。 | 作为对象抽取的需求筛选器。 |
| `01-架构设计.md` | 已读取关键章节 | 提供 Definition vs Use、职责边界、数据所有权、依赖裁剪和正文禁入。 | 防止相邻仓内部对象误入本仓切口。 |
| `02-概要设计.md` | 已读取关键章节 | 提供八个主要组成部分、关键对象、接口骨架、处理流、状态、异常和配置影响。 | 作为对象族和切口类别的概要入口。 |
| `03-详细设计.md` | 已读取关键章节 | 提供七实现单元、对象、port、protocol、flow、state、transaction、error、idempotency、config、observability 和 §15 test cuts。 | 是 Step 3 的直接测试对象来源。 |
| `03_ddd_step_16_test_cut.md` | 已读取关键章节 | 提供 module / protocol / state / consistency / error / config / observability 最小验证入口。 | 作为切口抽取下限,不直接生成 TC。 |
| `04-配置设计.md` | 已读取关键章节 | 提供 profile、source priority、validation、secret/redaction、adapter availability、failure/degradation 和 downstream handoff。 | 作为配置 / 依赖 / redaction 切口输入。 |
| L1-governance Step 3 | 已读取并对照 | 参考 Step 3 的组织框架、表格深度、停审和审计方式。 | framework reference only。 |

### 3. Step 2 handoff 承接

| Step 2 结论 | Step 3 承接方式 | 当前状态 |
|---|---|---|
| P0 覆盖核心闭环和红线 | Step 3 以 P0 范围为测试对象抽取主筛选器。 | pass |
| P1/P2 不阻塞 P0 | Step 3 不把 real-like / production-like / 外围增强对象写成 P0 必测对象。 | pass |
| 下游只测接缝 | Step 3 只抽本仓拥有的 ref / summary / event / handoff / adapter seam。 | pass |
| 非范围和残余风险已记录 | Step 3 不恢复旧 MethodContent、publish、snapshot、outbox、PostgreSQL、gateway 或完整 E2E。 | pass |
| 缺口回写规则已固定 | Step 3 若发现 schema / port / mapper / marker / state / config / evidence / phase 缺口,回 owning source。 | pass |

### 4. 输入基线与旧材料处理规则

| 类别 | 当前口径 |
|---|---|
| 需求基线 | `FR-ML-001~009`、`BR-ML-001~022`、`NFR-ML-001~016`、核心能力闭环、数据归属、接口依赖和验收方向只作为测试对象筛选来源。 |
| 架构基线 | Definition vs Use、职责边界、依赖裁剪、数据所有权、下游接缝、正文禁入和外围增强隔离用于排除越界对象。 |
| 概要基线 | 八个主要组成部分、关键对象族、接口骨架、处理流、状态、异常和配置影响用于建立测试对象抽取分类。 |
| 详细设计基线 | 七实现单元、对象 / port / protocol / flow / state / persistence / error / idempotency / config / observability / test cuts 是直接来源。 |
| 配置基线 | P0 profile candidate、fail-fast、source priority、secret/redaction、adapter availability、degraded / unavailable 和 downstream handoff 进入配置 / 依赖切口。 |
| 旧正式 `05` | historical material;旧 MethodContent / publish / snapshot / fingerprint / outbox / PostgreSQL / gateway / TC / EV 不继承。 |
| 旧 `06/07` | old direction input;不得定义当前测试对象、切口、evidence、phase、commit boundary 或 implementation ledger。 |

### 5. SOP 十问写入口径

| SOP 问题 | R3.2 固定的写入口径 | 后续模块 |
|---|---|---|
| 哪些 domain object / value object / policy 必须单测? | 先按对象族和 policy family 定抽取规则,再写 P0 对象候选。 | R3.3~R3.6 |
| 哪些 application service 必须做 service test? | 按 Command / Query / Consumer / Outbound / Job flow family 抽 service test 入口。 | R3.3~R3.8 |
| 哪些 repository / adapter / worker 必须做集成测试? | 按 repository、UoW、resolver、publisher、handoff、runtime builder、worker/job runner 建候选类型。 | R3.5~R3.8 |
| 哪些 Command / Query / Event / Job 必须做协议和流程测试? | public protocol family 必须有切口入口,但具体用例留 Step 6。 | R3.7/R3.8 |
| 哪些状态机、事务、一致性、幂等和恢复行为必须单列切口? | 从 `03` §9~§12 与 §15 抽取状态 / consistency / recovery 切口族。 | R3.7/R3.8 |
| 哪些字段缺失、DTO 构造失败或引用混同必须作为负向测试切口? | 只从正式 schema / flow / error / source 中抽负向入口。 | R3.9/R3.10 |
| 哪些状态名必须以详细设计正式 enum variant 为准? | 状态切口必须回指 `03` state matrix,不得使用旧口语状态。 | R3.7~R3.10 |
| 每个测试切口回指哪个设计真相源? | 每个切口必须有 `03/04` 具体章节或 calibration source。 | R3.7/R3.8 |
| 哪些 P0 设计契约还没有测试切口承接? | Step 3 末尾通过跨切口审计判断,当前不提前声称全覆盖。 | R3.11/R3.12 |
| 每个 P0 测试切口是否通过停审? | 每个 P0 切口完成后检查来源、风险、层级和后续用例可落地性。 | R3.11/R3.12 |

### 6. L1-governance Step 3 框架参考边界

| 参考点 | L3 采用 | L3 禁止 |
|---|---|---|
| Step 状态和目标先行 | 采用:先写当前模块、门禁和 Step 2 handoff。 | 不复制 Governance truth center 描述。 |
| 输入表紧贴 Step 2 与 `03/04` | 采用:把 P0/P1/P2、§15 test cuts、配置承接列为直接输入。 | 不复制 Governance 对象、协议数量或 VF。 |
| SOP 问题逐项回答 | 采用:按十问拆模块,逐步形成对象和切口。 | 不一次性生成 Step 6 用例或 Step 13 evidence。 |
| 结构化产物分表 | 采用:对象总表、切口真相源表、停审表、跨切口审计表、负向切口清单分开写。 | 不用单张大表混写对象、用例、数据和证据。 |
| 完成后停审 | 采用:Step 3 完成后暂停,确认后再进入 Step 4。 | 不自动进入测试策略与分层。 |

### 7. 测试对象 / 测试切口 / 用例矩阵边界

| 概念 | Step 3 当前边界 | 后续承接 |
|---|---|---|
| 测试对象 | 记录要验证的模块、对象族、protocol family、flow family、state family、repository/adapter family、config / observability boundary。 | Step 4 确定测试层级;Step 6 设计用例。 |
| 测试切口 | 记录验证入口、风险、推荐层级、设计真相源和后续用例要求。 | Step 5 做追溯;Step 6 展开 case;Step 13 接 evidence。 |
| 用例矩阵 | 本 Step 不生成。 | Step 6 按测试切口逐个设计正向、负向、边界、并发和恢复用例。 |
| 测试数据 | 本 Step 不生成 fixture。 | Step 7 设计数据集、builder、seed 和清理方式。 |
| 环境 / 自动化 | 本 Step 不写环境矩阵和 CI suite。 | Step 8 / Step 9 分别承接。 |
| evidence / 验收 / 实施 | 本 Step 不写 EV、artifact schema、veto、phase 或 commit。 | Step 13、新版 `06`、新版 `07` 分别承接。 |

### 8. Step 3 分批计划

| 模块 | 主题 | 输出边界 |
|---|---|---|
| R3.3/R3.4 | 测试对象抽取口径 | 写 module / object / service / port-adapter / protocol / state / config / observability 的抽取规则和排除规则。 |
| R3.5/R3.6 | P0 测试对象候选 | 写 P0 对象族候选、来源、纳入理由和与 Step 6 的边界。 |
| R3.7/R3.8 | 测试切口候选与设计真相源 | 写切口候选、设计真相源、风险、推荐层级和后续用例要求。 |
| R3.9/R3.10 | 负向切口、P1/P2 切口与非范围保护 | 写字段缺失、DTO 构造失败、引用混同、状态漂移、P1/P2 seam 和非范围保护。 |
| R3.11/R3.12 | P0 切口停审与跨切口审计 | 写 P0 切口停审、孤儿契约 / 重复切口 / phase 越界审计、正式 §3 回填草稿候选和 Step 4 进入条件。 |

### 9. R3.3 进入门禁

`R3.3 测试对象抽取口径:先思考` 只允许思考 Step 3 的测试对象抽取规则:

1. 思考如何从 module / object / service / port-adapter / protocol / state / config / observability 抽取测试对象。
2. 思考哪些内容只能作为切口、用例或数据,不能作为测试对象。
3. 思考 P0/P1/P2 与非范围对对象抽取的筛选规则。
4. 思考 R3.4 写入边界。
5. 禁止修改正式 `05-测试方案.md`。
6. 禁止写 P0 测试对象完整候选表、测试切口矩阵、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准或实施计划。

### 10. R3.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 Step 3 必读文档表与读取状态 | pass |
| 是否写入 Step 2 handoff 承接 | pass |
| 是否写入输入基线和旧材料处理规则 | pass |
| 是否写入 SOP 十问写入口径 | pass |
| 是否写入 L1-governance Step 3 框架参考边界 | pass |
| 是否写入测试对象 / 测试切口 / 用例矩阵边界 | pass |
| 是否写入 Step 3 分批计划和 R3.3 进入门禁 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写完整测试对象清单、测试切口矩阵、用例、数据、环境、门禁、evidence、验收或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.3 测试对象抽取口径:先思考`;只允许思考测试对象抽取规则、对象 / 切口 / 用例 / 数据边界、P0/P1/P2 与非范围筛选规则和 R3.4 写入边界;不得直接修改正式 `05-测试方案.md`;不得写 P0 测试对象完整候选表、测试切口矩阵、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。

---

## R3.3 测试对象抽取口径:先思考

### 1. 当前模块目标

`R3.3` 只思考测试对象应如何从当前正式 `00/01/02/03/04` 与 `03_ddd_step_16_test_cut.md` 抽取,并为 `R3.4` 写入抽取规则做准备。当前模块不写 P0 测试对象完整候选表,不写测试切口矩阵,不生成 TC 编号、fixture、CI suite、evidence schema、验收门禁或实施边界。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R3.4 |
| 用户确认 | 已确认从 `R3.2` 推进到 `R3.3`。 |
| 当前允许 | 思考测试对象定义、抽取轴、对象 / 切口 / 用例 / 数据边界、P0/P1/P2 筛选规则、非范围排除规则、缺口回写条件和 R3.4 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写 P0 测试对象完整候选表、测试切口矩阵、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。 |

### 2. 抽取来源思考

测试对象不是从实现便利、旧测试名称或下游愿望池抽取,而是从正式设计中已经闭口的 owner、contract、protocol、flow、state、config 和 observability 红线抽取。

| 来源 | R3.3 使用方式 | 当前判断 |
|---|---|---|
| Step 2 P0/P1/P2 范围 | 作为抽取优先级筛选器。 | P0 先覆盖核心闭环和红线;P1/P2 只保留接缝或演进方向。 |
| `03-详细设计.md` §4~§5 | 提供七实现单元和模块 owner。 | 可作为 module-level 对象抽取轴,但不能只写模块泛名。 |
| `03-详细设计.md` §6~§8 | 提供 object / port / protocol family。 | 可抽 domain object、DTO shell、application service、repository / adapter 和 public protocol family。 |
| `03-详细设计.md` §9~§13 | 提供 flow、state、persistence、error、idempotency、reentry。 | 可抽状态 / 一致性 / 恢复类测试对象,但不能在 Step 3 写完整用例。 |
| `03-详细设计.md` §14~§15 与 Step 16 | 提供 observability、redaction、最小测试切口。 | 可抽 redaction / audit / metric / no-synthetic-marker 类对象边界。 |
| `04-配置设计.md` | 提供 profile、source priority、validation、adapter availability、failure/degradation 和 downstream handoff。 | 可抽配置 / 依赖 / profile 边界对象,但不写具体 config key、env、topic、URL。 |
| L1-governance Step 3 | 提供组织框架和表格深度。 | 只参考“对象 -> 切口 -> 来源 -> 停审 -> 审计”的框架,不复制 governance 领域事实。 |

### 3. 测试对象定义思考

一个内容只有同时满足以下条件,才适合作为 Step 3 的“测试对象”:

| 判断项 | 成立条件 | 不成立时处理 |
|---|---|---|
| 有正式 owner | 能回指模块、对象、protocol、flow、state、port、config 或 observability owner。 | 不能作为测试对象;转为待确认或回 owning source。 |
| 有可验证契约 | 存在正式字段 / 状态 / 协议 / flow / error / marker / config 边界。 | 不用测试 helper 或 fake 补口;标为设计缺口。 |
| 有失败风险 | 失败会破坏 P0 核心闭环、边界、可追溯、一致性、安全或可观测红线。 | 若只是不影响核心语义的便利检查,降为 P1/P2 或非范围。 |
| 可映射测试层 | 后续能落到 unit、service、repository / adapter fake、entry / runner、config 或 observability check。 | 不在 Step 3 强行纳入;交 Step 4 判断或保留风险。 |
| 不等同于 case/data/evidence | 当前只表达被验证对象或对象族,不是具体断言序列、fixture 或 artifact。 | 拆给 Step 6 / Step 7 / Step 13。 |

### 4. 抽取轴思考

R3.4 应采用“多轴交叉抽取”,而不是只按技术层级或旧主流程列对象。

| 抽取轴 | 允许形成的对象类别 | R3.3 取舍 |
|---|---|---|
| module axis | 七实现单元所代表的 owner 边界。 | 可作为一级分组,但每个 module 必须继续落到契约或风险,不能只写 crate 名。 |
| object / policy axis | truth object、value object、typed ref、marker、state carrier、policy、guard、domain error。 | 适合作为 domain / contract 单测对象来源。 |
| service / flow axis | Command / Query / Consumer / Outbound / Job orchestration family。 | 适合作为 service / runner 测试对象来源,但不在本 Step 展开具体 case。 |
| port / adapter axis | repository、UoW、material store、resolver、publisher、handoff、runtime builder、clock / id / fake adapter。 | 适合作为 fake parity / integration-like 对象来源,但不能固定具体产品。 |
| protocol axis | Command、Query、Inbound、Outbound、Operations Job public shell、result、report、safe error surface。 | 适合作为 contract / entry 测试对象来源,必须 body-free。 |
| state / consistency axis | state family、legal / illegal transition、transaction boundary、stored replay、idempotency、checkpoint、query no-write。 | 适合作为跨层测试对象来源,状态名必须来自 `03` 正式矩阵。 |
| config / dependency axis | profile、source priority、validation、adapter availability、forbidden configurable boundary。 | 适合作为配置对象来源,但不写 env/key/topic/URL。 |
| observability / redaction axis | log、metric、trace、audit、report、handoff、safe diagnostic、redaction marker。 | 适合作为红线对象来源,只验证 safe refs / markers / categories。 |

### 5. 对象 / 切口 / 用例 / 数据边界思考

R3.3 的关键取舍是先把“被验证对象”稳定下来,再在后续模块把对象转成切口。对象、切口、用例和数据不能混写。

| 概念 | Step 3 对象抽取阶段的处理 | 不应提前写入 |
|---|---|---|
| 测试对象 | 被验证的模块 owner、对象族、protocol family、flow family、state family、port / adapter boundary、config / observability boundary。 | 断言步骤、输入输出样例、fixture、case ID。 |
| 测试切口 | 后续 R3.7/R3.8 才把对象转成“验证入口 + 风险 + 推荐层级 + 来源”。 | 在 R3.3/R3.4 写完整切口矩阵。 |
| 测试用例 | Step 6 按已确认切口展开 positive / negative / boundary / concurrency / recovery。 | 在对象抽取阶段写 case matrix。 |
| 测试数据 | Step 7 设计 fixture / builder / seed / cleanup。 | 在 Step 3 写 JSON、seed、path 或 fake state。 |
| evidence / CI | Step 9 / Step 13 设计 suite、artifact、report、证据归档。 | 在 Step 3 写 EV、report path、artifact schema、CI command。 |

### 6. P0/P1/P2 筛选规则思考

测试对象分级应先服从 Step 2 的范围分层,再服从 `03/04` 的正式契约来源。

| 层级 | 抽取规则 | 不得纳入方式 |
|---|---|---|
| P0 | 直接证明方法资产定义 truth、正式版本、受控消费、变化追溯、一致性保护、证据线索、七实现单元、protocol / state / consistency / error / config / observability 红线成立。 | 不把真实 DB / bus / secret provider / production-like / 完整跨仓 E2E 作为 P0 前置。 |
| P1 | 证明 durable / real-like adapter、resolver、publisher、handoff、外部摘要和跨仓接缝不改变 P0 truth 语义。 | 不把真实产品或 sibling 仓完整内部状态机写成当前 P0 测试对象。 |
| P2 | 记录 production-like、容量、硬 SLO、多区域、多租户、外围增强、高级策略、marketplace、标准映射深化等演进验证方向。 | 不在当前 Step 3 把长期增强写成必测对象或 release gate。 |
| 非范围 | 旧 MethodContent、publish、snapshot、fingerprint、old outbox、PostgreSQL、gateway、旧 TC / EV、产品 UI、交易履约、真实运维闭环。 | 不以旧名称、旧对象或旧 case 作为当前对象抽取来源。 |

### 7. 缺口回写思考

如果对象抽取时发现“应该测,但没有正式来源”,不能在测试方案里私补。

| 缺口类型 | 暂停条件 | 回写方向 |
|---|---|---|
| object / field 缺口 | 对象、字段、typed ref、marker、state carrier 来源不闭合。 | 回 `03` Step 6 或对应正式章节。 |
| port / adapter 缺口 | repository、mapper、resolver、publisher、handoff、runtime builder 没有正式 port。 | 回 `03` Step 7 / Step 11 / Step 14。 |
| protocol / surface 缺口 | Command、Query、Event、Job、safe error、report shell 不闭合。 | 回 `03` Step 8 / Step 12。 |
| flow / state 缺口 | accepted/rejected/duplicate/no-write、state transition、reentry 来源不一致。 | 回 `03` Step 9 / Step 10 / Step 13。 |
| config / marker 缺口 | config key、profile、availability/degraded/redaction marker 来源不明确。 | 回 `04` 或 `03` owning Step。 |
| evidence / artifact 缺口 | 需要证据 schema、report path、artifact 字段才能表达对象。 | 后移 Step 13;不得在 R3.3/R3.4 补。 |

### 8. R3.4 写入边界思考

`R3.4 测试对象抽取口径:再写入` 应把 R3.3 的思考固化为规则,仍不能进入完整对象候选表。

1. 写测试对象定义规则。
2. 写抽取来源与抽取轴表。
3. 写对象 / 切口 / 用例 / 数据 / evidence 边界表。
4. 写 P0/P1/P2 与非范围筛选规则。
5. 写缺口回写规则。
6. 写 `R3.5 P0 测试对象候选:先思考` 进入门禁。
7. 禁止写 P0 测试对象完整候选表、测试切口矩阵、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或正式 `05-测试方案.md`。

### 9. R3.3 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考测试对象抽取口径 | pass |
| 是否反查 Step 2、正式 `03/04` 和 Step 16 最小测试切口 | pass |
| 是否区分测试对象、测试切口、用例、数据、evidence | pass |
| 是否形成 P0/P1/P2 与非范围筛选规则 | pass |
| 是否形成缺口回写规则 | pass |
| 是否形成 R3.4 写入边界 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写 P0 测试对象完整候选表、测试切口矩阵、用例、数据、环境、门禁、evidence、验收或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.4 测试对象抽取口径:再写入`;只允许写入测试对象定义规则、抽取来源与抽取轴表、对象 / 切口 / 用例 / 数据 / evidence 边界、P0/P1/P2 与非范围筛选规则、缺口回写规则和 `R3.5` 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写 P0 测试对象完整候选表、测试切口矩阵、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。

---

## R3.4 测试对象抽取口径:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R3.5 |
| 用户确认 | 已确认从 `R3.3` 推进到 `R3.4`。 |
| 本模块写入范围 | 测试对象定义规则、抽取来源与抽取轴表、对象 / 切口 / 用例 / 数据 / evidence 边界、P0/P1/P2 与非范围筛选规则、缺口回写规则和 `R3.5` 进入门禁。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、P0 测试对象完整候选表、测试切口矩阵、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划和 implementation code。 |

### 2. 测试对象定义规则

Step 3 的测试对象是“必须被验证的设计契约承载体或契约边界”,不是测试用例、fixture、证据或实现文件。对象抽取必须满足下表全部条件。

| 规则 | 必须满足 | 不满足时处理 |
|---|---|---|
| owner 明确 | 能回指正式模块、对象、protocol、flow、state、port、config 或 observability owner。 | 不纳入对象候选;记录为待确认或回 owning source。 |
| 来源正式 | 来源来自当前 `00/01/02/03/04`、`03_ddd_step_16_test_cut.md` 或已确认 Step 1/2 中间产物。 | 旧 `05/06/07`、旧 MethodContent 或实现便利不能作为正向来源。 |
| 契约可验证 | 存在可验证的字段、状态、协议、flow、错误、marker、config 或红线。 | 缺正式 source 时暂停并回写,不得用测试 helper 补。 |
| 风险具体 | 失败会破坏核心能力、边界、追溯、一致性、安全、配置或观测红线。 | 若只是低风险实现便利,降级为 P1/P2 方向或非范围风险。 |
| 后续可承接 | 可在后续 Step 4~13 落到层级、覆盖、用例、数据、环境、自动化或 evidence。 | 若当前无法承接,保留待确认,不强行写成对象。 |

### 3. 抽取来源与抽取轴表

| 抽取来源 | 抽取轴 | 可形成的测试对象类型 | 写入限制 |
|---|---|---|---|
| `03` §4~§5 七实现单元与模块契约 | module axis | `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 的 owner 边界。 | 不能只写模块泛名;后续必须落到契约、风险和来源。 |
| `03` §6 object contracts | object / policy axis | truth object、value object、typed ref、marker、state carrier、policy、guard、domain error。 | 不新增字段、state、marker 或 mapper。 |
| `03` §7~§8 protocol / port | protocol / port axis | Command、Query、Inbound、Outbound、Operations Job shell、repository、UoW、resolver、publisher、handoff。 | 不写具体 TC、route、topic、URL、product 或 fake 私有 map。 |
| `03` §9~§13 flow / state / consistency | service / state / consistency axis | Command / Query / Consumer / Outbound / Job flow family、state family、transaction、stored replay、idempotency、checkpoint。 | 不写完整 case matrix;状态名必须使用正式设计。 |
| `03` §14~§15 与 Step 16 | observability / redaction axis | log、metric、trace、audit、report、handoff、safe diagnostic、redaction marker、最小测试切口入口。 | 不写 metric backend、artifact schema、report path 或 evidence ID。 |
| `04-配置设计.md` | config / dependency axis | profile、source priority、validation、adapter availability、forbidden configurable boundary、failure/degradation。 | 不写具体 config key、env、topic、URL、secret value 或部署命令。 |
| Step 2 scope | priority axis | P0/P1/P2 与非范围筛选结果。 | 不把范围表直接当对象表;对象仍必须回指正式设计契约。 |

### 4. 对象 / 切口 / 用例 / 数据 / Evidence 边界

| 类别 | 当前 Step 3 处理方式 | 后续承接 |
|---|---|---|
| 测试对象 | 记录被验证对象或对象族,例如 module owner、object family、protocol family、flow family、state family、port / adapter boundary、config / observability boundary。 | R3.5/R3.6 写 P0 对象候选。 |
| 测试切口 | 记录验证入口、风险、推荐层级、设计真相源和后续用例要求。 | R3.7/R3.8、R3.9/R3.10 逐步写入。 |
| 测试用例 | 当前不生成。 | Step 6 按切口展开 positive / negative / boundary / concurrency / recovery。 |
| 测试数据 | 当前不生成 fixture、seed、builder 或 cleanup。 | Step 7 设计数据集、构造方式和隔离清理。 |
| 环境 / 自动化 | 当前不写 profile matrix、suite、CI command 或 gate。 | Step 8 / Step 9 承接。 |
| evidence / 验收 / 实施 | 当前不写 EV、artifact schema、report path、veto、phase 或 commit boundary。 | Step 13、新版 `06`、新版 `07` 分别承接。 |

### 5. P0/P1/P2 与非范围筛选规则

| 层级 | 纳入测试对象的条件 | 当前禁止 |
|---|---|---|
| P0 | 直接证明方法资产定义 truth、正式版本、受控消费、变化追溯、一致性保护、证据线索、七实现单元、protocol / state / consistency / error / config / observability 红线成立。 | 把真实 DB / bus / search / object storage / secret provider / production-like / 完整跨仓 E2E 作为 P0 前置。 |
| P1 | 证明 durable / real-like adapter、resolver、publisher、handoff、外部摘要和跨仓接缝不改变 P0 truth 语义。 | 把真实产品或 sibling 仓完整内部状态机写成当前 P0 测试对象。 |
| P2 | 记录 production-like、容量、硬 SLO、多区域、多租户、外围增强、高级策略、marketplace、标准映射深化等演进验证方向。 | 在当前 Step 3 写成必测对象、验收门禁或实施承诺。 |
| 非范围 | 只作为污染风险、残余风险或后续触发条件记录。 | 用旧 MethodContent、publish、snapshot、fingerprint、old outbox、PostgreSQL、gateway、旧 TC / EV、产品 UI、交易履约或真实运维闭环抽当前对象。 |

### 6. 缺口回写规则

| 缺口类型 | 暂停条件 | 回写方向 | Step 3 处理 |
|---|---|---|---|
| object / field | 对象、字段、typed ref、marker、state carrier 来源不闭合。 | 回 `03` Step 6 或正式 §6。 | 不写成对象候选。 |
| port / adapter | repository、mapper、resolver、publisher、handoff、runtime builder 缺正式 port。 | 回 `03` Step 7 / Step 11 / Step 14。 | 不用 fake private map 补。 |
| protocol / surface | Command、Query、Event、Job、safe error、report shell 不闭合。 | 回 `03` Step 8 / Step 12。 | 不生成 case 或 evidence。 |
| flow / state | accepted/rejected/duplicate/no-write、state transition、reentry 来源冲突。 | 回 `03` Step 9 / Step 10 / Step 13。 | 不自行二选一。 |
| config / marker | config key、profile、availability/degraded/redaction marker 来源不明确。 | 回 `04` 或 `03` owning Step。 | 不用配置或字符串合成 marker。 |
| evidence / artifact | 需要 artifact 字段、report path 或 evidence schema 才能表达对象。 | 后移 Step 13。 | 当前只记录后续承接需要,不补 schema。 |

### 7. R3.5 进入门禁

`R3.5 P0 测试对象候选:先思考` 只允许思考 P0 测试对象候选如何按本模块规则收敛:

1. 允许思考 P0 对象候选族,包括 module、object / policy、service / flow、port / adapter、protocol、state / consistency、config / observability。
2. 允许思考每个候选族的正式来源、纳入理由、风险和后续 Step 6 边界。
3. 禁止写 P0 测试对象完整候选表。
4. 禁止写测试切口矩阵、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或正式 `05-测试方案.md`。

### 8. R3.4 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入测试对象定义规则 | pass |
| 是否写入抽取来源与抽取轴表 | pass |
| 是否写入对象 / 切口 / 用例 / 数据 / evidence 边界 | pass |
| 是否写入 P0/P1/P2 与非范围筛选规则 | pass |
| 是否写入缺口回写规则 | pass |
| 是否写入 R3.5 进入门禁 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写 P0 测试对象完整候选表、测试切口矩阵、用例、数据、环境、门禁、evidence、验收或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.5 P0 测试对象候选:先思考`;只允许思考 P0 测试对象候选族、正式来源、纳入理由、风险和后续 Step 6 边界;不得直接修改正式 `05-测试方案.md`;不得写 P0 测试对象完整候选表、测试切口矩阵、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。

---

## R3.5 P0 测试对象候选:先思考

### 1. 当前模块目标

`R3.5` 只思考 P0 测试对象候选族如何从 R3.4 的抽取规则继续收敛。当前模块不写 P0 测试对象完整候选表,不写测试切口矩阵,也不生成用例、数据、环境、自动化、evidence、验收或实施内容。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R3.6 |
| 用户确认 | 已确认从 `R3.4` 推进到 `R3.5`。 |
| 当前允许 | 思考 P0 测试对象候选族、正式来源、纳入理由、风险、后续 Step 6 边界和 R3.6 写入范围。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写 P0 测试对象完整候选表、测试切口矩阵、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。 |

### 2. P0 候选族来源判断

P0 对象候选族必须覆盖 Step 2 已收稳的五类 P0 范围族,同时反查 `03` 的七实现单元、Step 16 最小验证入口和 `04` 配置红线。R3.5 只形成候选族思考,不在本模块写最终表。

| P0 范围族 | 需要形成的对象候选方向 | R3.5 判断 |
|---|---|---|
| core truth / definition | 方法资产定义 truth、正式版本、受控消费、关系、摘要、来源边界相关对象族。 | 必须纳入 P0 候选族,否则无法证明 L3-method-library 的核心仓定位。 |
| public protocol | Command、Query、Inbound、Outbound、Operations Job public shell 与 safe surface。 | 必须纳入 P0 候选族,但具体协议用例留 Step 6。 |
| state and consistency | state family、transaction、version、stored replay、idempotency、query no-write、job no truth repair。 | 必须纳入 P0 候选族,状态名和 replay 来源必须来自 `03`。 |
| config and dependency | P0 profile candidate、validation、source priority、adapter availability、degraded / failed handoff。 | 必须纳入 P0 候选族,但不写具体 key、env、topic、URL。 |
| redaction and observability | raw body / secret 禁出、safe diagnostic、audit refs-only、low-cardinality metric、report / handoff safe output。 | 必须纳入 P0 候选族,但不定义 metric schema、artifact 或 evidence。 |

### 3. 候选族分组思考

P0 对象候选应按“设计契约承载体”分组,不是按旧主流程或实现文件名罗列。当前只允许形成候选族,后续 R3.6 再写结构化候选表。

| 候选族 | 主要来源 | 纳入理由思考 | 后续 Step 6 边界 |
|---|---|---|---|
| module owner boundary | `03` §4~§5;Step 16 source map | 七实现单元是测试对象归属和层级选择的起点。 | Step 6 不按模块泛名写 case,必须落到对象 / protocol / flow。 |
| object / policy family | `03` §6;`03` §9~§12 | truth object、value object、typed ref、marker、policy、guard 是核心语义和状态成立基础。 | Step 6 再拆具体 invariant、合法 / 非法输入和 policy reject。 |
| protocol family | `03` §7~§8;Step 16 protocol cuts | public shell 是外部消费和安全输出边界。 | Step 6 再拆 Command / Query / Inbound / Outbound / Job 的用例批次。 |
| application flow family | `03` §8~§13 | accepted/rejected/duplicate/no-write/partial/failed 决定副作用顺序和重入安全。 | Step 6 再拆正向、负向、重复、并发和恢复用例。 |
| port / adapter boundary | `03` §7;`03` §10~§13;`04` §11 | repository、UoW、resolver、publisher、handoff、runtime builder 决定一致性和 failure mapping。 | Step 6/7 再决定 fake / fixture / data 前置,不在 R3.5 补 port。 |
| config / dependency boundary | `04` §5~§12;`03` §13 | profile、source priority、validation、availability、forbidden configurable boundary 会影响启动和运行安全。 | Step 8/9 再写环境和自动化门禁,当前只识别对象族。 |
| observability / redaction boundary | `03` §14~§15;`04` §8 / §11 / §12 | raw body、secret、unsafe diagnostic、synthetic marker 泄露会破坏安全和证据可信度。 | Step 10/13 再承接专项测试和证据归档。 |

### 4. 纳入 / 排除取舍思考

| 判断 | 纳入 P0 候选族 | 排除或降级 |
|---|---|---|
| 是否直接证明核心闭环 | 是,进入 P0 候选族。 | 否,最多进入 P1/P2 或残余风险。 |
| 是否有正式设计来源 | 是,可作为候选族来源。 | 否,暂停回 owning source,不在测试方案补口。 |
| 是否只是产品化接缝 | 只在不改变 P0 truth 语义时作为边界候选。 | 真实产品闭环、vendor 行为、production-like 前置降级。 |
| 是否会泄露 body / secret / raw config | 作为红线对象候选纳入。 | 不通过写 raw fixture 或 evidence 示例来证明。 |
| 是否来自旧 `05/06/07` 或旧 MethodContent | 不纳入。 | 仅作为污染风险或非范围提醒。 |

### 5. R3.6 写入边界思考

`R3.6 P0 测试对象候选:再写入` 应把 R3.5 的候选族思考固化为 P0 测试对象候选表,但仍不能写测试切口矩阵或用例矩阵。

1. 写 P0 测试对象候选表,每行应包含对象候选族、正式来源、纳入理由、P0 风险、推荐后续承接。
2. 写 P0 候选与非范围 / P1/P2 的边界说明。
3. 写 P0 候选缺口检查,发现 source 不闭合则标 blocker,不得补口。
4. 写 `R3.7 测试切口候选与设计真相源:先思考` 进入门禁。
5. 禁止写测试切口矩阵、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或正式 `05-测试方案.md`。

### 6. R3.5 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 P0 测试对象候选族 | pass |
| 是否覆盖 Step 2 P0 五类范围族 | pass |
| 是否反查 `03` 七实现单元、Step 16 和 `04` 配置 / 失效红线 | pass |
| 是否区分 P0 纳入、P1/P2 降级和非范围污染 | pass |
| 是否形成 R3.6 写入边界 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写 P0 测试对象完整候选表、测试切口矩阵、用例、数据、环境、门禁、evidence、验收或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.6 P0 测试对象候选:再写入`;只允许写入 P0 测试对象候选表、正式来源、纳入理由、P0 风险、推荐后续承接、P0/P1/P2 / 非范围边界说明、候选缺口检查和 `R3.7` 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写测试切口矩阵、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。

---

## R3.6 P0 测试对象候选:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R3.7 |
| 用户确认 | 已确认从 `R3.5` 推进到 `R3.6`。 |
| 本模块写入范围 | P0 测试对象候选表、正式来源、纳入理由、P0 风险、推荐后续承接、P0/P1/P2 / 非范围边界说明、候选缺口检查和 `R3.7` 进入门禁。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、测试切口矩阵、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划和 implementation code。 |

### 2. P0 测试对象候选表

本表只形成 P0 测试对象候选族,不是最终测试切口矩阵,也不是 Step 6 用例矩阵。每个候选族后续必须在 R3.7/R3.8 转成至少一个设计真相源明确的测试切口。

| P0 测试对象候选族 | 正式来源 | 纳入理由 | P0 风险 | 推荐后续承接 |
|---|---|---|---|---|
| 七实现单元 owner boundary | `03` §4~§5;`03_ddd_step_16_test_cut.md` source map | `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 是对象、协议、flow、adapter 和 runner 的归属边界。 | 模块职责混淆会导致测试只按技术层泛写,无法证明 owner、依赖方向和 forbidden responsibility。 | R3.7/R3.8 转 module / boundary 切口;Step 4 确定分层。 |
| core truth / definition object family | `03` §6;Step 2 P0 core truth / definition;`03` §9~§12 | 方法资产定义、正式版本、受控消费、关系、摘要、来源边界是本仓核心 truth 语义。 | truth owner、typed ref、状态来源或不变量缺失会破坏方法资产定义和正式版本成立。 | R3.7/R3.8 转 domain object / invariant / state 切口;Step 6 再拆用例。 |
| object / policy / guard family | `03` §6;`03` §10~§12 | value object、policy、guard、domain error、body-free guard 是 P0 规则和拒绝路径基础。 | policy reject 漏测、非法状态通过、raw body 入对象会破坏边界和安全。 | R3.7/R3.8 转 object / policy 切口;Step 6 覆盖 positive / negative。 |
| public protocol family | `03` §7~§8;Step 16 protocol cuts | Command、Query、Inbound、Outbound、Operations Job 的 public shell、safe result、report 和 error surface 是外部消费契约。 | DTO 缺字段、safe surface 不闭合、raw body/secret 泄露会造成跨仓消费错误。 | R3.7/R3.8 转 protocol 切口;Step 6 再按协议族展开。 |
| application flow family | `03` §8~§13;Step 16 flow cuts | accepted/rejected/duplicate/no-write/partial/failed 分支决定副作用顺序、重入和 safe recovery。 | accepted 边界错、duplicate 重跑、Query 写入、Job 修 core truth 会破坏一致性。 | R3.7/R3.8 转 service flow / orchestration 切口;Step 6 设计流程用例。 |
| port / adapter / repository boundary | `03` §7;`03` §10~§13;`04` §11 | repository、UoW、material store、resolver、publisher、handoff、runtime builder 是一致性和 failure mapping 的执行边界。 | fake 私有来源、adapter 伪成功、version / transaction 语义漂移会隐藏设计缺口。 | R3.7/R3.8 转 repository / adapter 切口;Step 7/8 再承接数据和环境。 |
| state / consistency / replay family | `03` §9~§13;Step 16 state / consistency cuts | state family、transaction、stored replay、idempotency、checkpoint、query no-write、job no truth repair 是 P0 重入与一致性证明轴。 | 状态名漂移、checkpoint 当 version、stored surface missing 后重算会导致不可审计结果。 | R3.7/R3.8 转 state / consistency 切口;Step 6 覆盖合法 / 非法 / race。 |
| config / dependency boundary | `04` §5~§12;`03` §13;Step 2 config and dependency | P0 profile candidate、source priority、validation、adapter availability、forbidden configurable boundary 影响启动、装配和运行安全。 | invalid config silent fallback、production-like fake、marker synthesis、hot reload 会破坏 truth 语义。 | R3.7/R3.8 转 config / dependency 切口;Step 8/9 承接环境和自动化。 |
| observability / redaction boundary | `03` §14~§15;`04` §8 / §11 / §12;Step 2 redaction and observability | log、metric、trace、audit、report、handoff、safe diagnostic、redaction marker 必须 body-free、safe-only。 | raw body、secret、raw config、unsafe diagnostic、high-cardinality label 进入输出会破坏安全和证据可信度。 | R3.7/R3.8 转 observability / redaction 切口;Step 10/13 承接专项和证据。 |

### 3. P0 / P1 / P2 / 非范围边界说明

| 边界 | 当前处理 |
|---|---|
| P0 候选表的职责 | 只列当前必须被验证的对象候选族,用于后续测试切口生成。 |
| P1 接缝 | durable / real-like adapter、resolver、publisher、handoff、外部摘要和跨仓协作只在不改变 P0 truth 语义时作为接缝方向,不阻塞 P0。 |
| P2 演进 | production-like、容量、硬 SLO、多区域、多租户、MethodPlugin / MethodConfiguration、marketplace、高级 ViewProfile / AIPolicy、标准映射深化只记录为未来方向。 |
| 非范围污染 | 旧 MethodContent、publish、snapshot、fingerprint、old outbox、PostgreSQL、gateway、旧 TC / EV、产品 UI、交易履约和真实运维闭环不得进入当前 P0 对象候选。 |
| 下游仓边界 | process、identity、governance、runtime、member-images、artifact/archive、capability-hub、marketplace、UI/console、observability 只测本仓拥有的 ref / summary / event / handoff / adapter seam。 |

### 4. P0 候选缺口检查

| 检查项 | 结论 | 处理 |
|---|---|---|
| 候选族是否均有正式来源 | pass | 当前候选族均可回指 `03`、`04`、Step 2 或 Step 16。 |
| 是否存在旧材料正向来源 | pass | 未使用旧 `05/06/07`、旧 MethodContent、publish、snapshot、fingerprint、old outbox 作为候选来源。 |
| 是否新增 schema / port / mapper / state / config key | pass | 本模块只列候选族,未新增正式契约。 |
| 是否提前写测试切口矩阵 | pass | 切口留给 R3.7/R3.8。 |
| 是否提前写用例 / 数据 / 环境 / evidence | pass | 后移 Step 6 / 7 / 8 / 9 / 13。 |
| 是否发现阻塞 R3.6 的 source 缺口 | pass_with_watch | 当前候选族层面未发现 blocker;后续 R3.7/R3.8 若细化切口时发现 source 不闭合,必须回 owning source。 |

### 5. R3.7 进入门禁

`R3.7 测试切口候选与设计真相源:先思考` 只允许思考如何把 R3.6 的 P0 对象候选族转成测试切口候选:

1. 允许思考每个候选族应形成哪些测试切口类别。
2. 允许思考每个切口应回指哪个设计真相源。
3. 允许思考风险、推荐测试层级和后续用例要求。
4. 禁止写最终测试切口矩阵。
5. 禁止写用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或正式 `05-测试方案.md`。

### 6. R3.6 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 P0 测试对象候选表 | pass |
| 是否每行包含正式来源、纳入理由、P0 风险和推荐后续承接 | pass |
| 是否写入 P0/P1/P2 / 非范围边界说明 | pass |
| 是否写入候选缺口检查 | pass |
| 是否写入 R3.7 进入门禁 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写测试切口矩阵、用例、数据、环境、门禁、evidence、验收或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.7 测试切口候选与设计真相源:先思考`;只允许思考 P0 对象候选族到测试切口候选的映射、设计真相源、风险、推荐测试层级和后续用例要求;不得直接修改正式 `05-测试方案.md`;不得写最终测试切口矩阵、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。

---

## R3.7 测试切口候选与设计真相源:先思考

### 1. 当前模块目标

`R3.7` 只思考如何把 R3.6 的 P0 测试对象候选族转成测试切口候选方向,并确认每类候选切口应回指哪些设计真相源。当前模块不写最终测试切口矩阵,不写 TC 编号、用例步骤、fixture、环境矩阵、CI suite、evidence schema、验收标准或实施计划。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R3.8 |
| 用户确认 | 已确认从 `R3.6` 推进到 `R3.7`。 |
| 当前允许 | 思考 P0 对象候选族到测试切口候选方向的映射、设计真相源选择规则、风险判断、推荐测试层级倾向、后续 Step 6 用例承接要求和 R3.8 写入范围。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写最终测试切口矩阵、TC 编号、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。 |

### 2. 对象候选族到切口候选方向的映射思考

R3.7 的映射不是把每个对象族直接变成一个测试用例,而是先找出它需要哪些验证入口。一个 P0 对象族可能对应多个切口方向;一个切口方向也可能同时覆盖对象、protocol、flow、state、config 或 observability 的交叉风险。最终矩阵留给 R3.8 写入。

| R3.6 P0 对象候选族 | 候选切口方向思考 | 主要风险思考 |
|---|---|---|
| 七实现单元 owner boundary | 需要形成 module owner / dependency direction / forbidden responsibility 切口方向。 | 只按 crate 泛名测试会漏掉 owner 边界、跨层依赖和职责漂移。 |
| core truth / definition object family | 需要形成 truth invariant / formal version / typed ref / summary source / relation boundary 切口方向。 | truth object 不变量或来源不明会使正式版本、受控消费和追溯无法证明。 |
| object / policy / guard family | 需要形成 policy accept/reject、body-free guard、domain error、marker source 和非法输入切口方向。 | guard 漏测会允许 raw body、非法状态或未授权规则进入核心对象。 |
| public protocol family | 需要形成 Command、Query、Inbound、Outbound、Operations Job public shell 与 safe surface 切口方向。 | public DTO / result / report / error 缺字段或泄露 raw body 会破坏外部消费契约。 |
| application flow family | 需要形成 accepted / rejected / duplicate / no-write / partial / failed orchestration 切口方向。 | 副作用顺序错、duplicate 重跑、Query 写入或 Job 修 truth 会破坏一致性。 |
| port / adapter / repository boundary | 需要形成 repository / UoW / resolver / publisher / handoff / runtime builder seam 切口方向。 | fake 私有来源、adapter 伪成功、transaction / version 漂移会隐藏设计缺口。 |
| state / consistency / replay family | 需要形成合法 / 非法状态转换、stored replay、idempotency、checkpoint、commit unknown、race 切口方向。 | 状态名漂移、stored surface missing 后重算、checkpoint 当 version 会破坏审计性。 |
| config / dependency boundary | 需要形成 profile、validation、source priority、adapter availability、forbidden configurable boundary 切口方向。 | invalid config silent fallback、config 补 marker/schema、hot reload 改 truth 会越界。 |
| observability / redaction boundary | 需要形成 no raw body、no secret、low-cardinality metric、audit refs-only、safe diagnostic source 切口方向。 | raw body / secret / raw config 或 synthetic marker 进入观测和证据会破坏安全可信度。 |

### 3. 设计真相源选择规则思考

每个候选切口必须回到能定义“对象、字段、状态、协议、flow、port、config 或红线”的 owning source。Step 3 不允许用测试便利、旧 TC、实现推断或 fake 行为替代设计真相源。

| 切口方向 | 优先真相源 | 不能作为真相源 |
|---|---|---|
| module owner / dependency | `03` §4~§5;`03_ddd_step_16_test_cut.md` R16.6 | crate 文件名、旧模块图、实现目录便利。 |
| object / invariant / guard | `03` §6;`03` §10~§12 | 测试 helper、fixture 字段、旧 MethodContent。 |
| protocol / public shell | `03` §7~§8;Step 16 R16.8 / R16.10 | 旧 route/topic、transport adapter、历史 `05` TC。 |
| flow / orchestration | `03` §9;`03` §11~§13;Step 16 R16.8~R16.14 | happy path 代码、fake runtime 私有 map、log 顺序。 |
| state / replay / idempotency | `03` §10~§13;Step 16 R16.12 / R16.14 | 口语状态名、DB unique error、checkpoint 字符串推断。 |
| config / dependency | `04` §5~§12;`03` §14;Step 16 R16.16 | 具体 env/key/topic/URL、部署脚本、operator 习惯。 |
| observability / redaction | `03` §15;`04` §8 / §11 / §12;Step 16 R16.16 | metric backend、dashboard、raw report body、人工检查。 |

### 4. 风险与推荐层级思考

推荐测试层级应跟风险位置匹配,不能为了让表格整齐而把所有 P0 都写成 unit 或 integration。R3.8 写入时需要用“切口方向 -> 风险 -> 推荐层级”表达最小可验证入口,而不是提前承诺 suite、命令或 evidence。

| 风险位置 | 推荐层级倾向 | R3.7 判断 |
|---|---|---|
| 字段 / 不变量 / policy / guard | unit / contract-level | 适合证明对象构造、拒绝、body-free redline 和 domain error。 |
| public DTO / response / report shell | contract / API mapping | 适合证明 safe surface、required field、public error 和 body-free 输出。 |
| Command / Query / Consumer / Job flow | service / runner-level | 适合证明 UoW 顺序、duplicate no-rerun、Query no-write、partial / failed branch。 |
| repository / adapter / resolver / publisher / handoff seam | fake integration / adapter parity direction | 适合证明 failure mapping、availability summary、transaction / version 语义和不补来源。 |
| state / idempotency / concurrency | service + fake persistence | 适合证明合法/非法转换、stored replay、commit unknown、race 和 checkpoint resume。 |
| config / dependency | config validation / runtime builder check | 适合证明 fail-fast、profile isolation、forbidden configurable boundary 和 redaction。 |
| observability / audit / report | observability / redaction check | 适合证明 no raw body、no secret、low-cardinality、audit refs-only 和 safe diagnostic source。 |

### 5. 后续 Step 6 用例承接思考

R3.7/R3.8 只给 Step 6 提供“后续用例要求”,不直接写用例矩阵。每个候选切口进入 R3.8 时至少要说明后续 Step 6 需要覆盖哪类 case,并把数据、环境、自动化和 evidence 分别交给 Step 7、Step 8、Step 9、Step 13。

| 后续承接项 | R3.7 思考要求 | 不在本模块写入 |
|---|---|---|
| Step 6 用例矩阵 | 标记需要 positive / negative / boundary / duplicate / concurrency / recovery / partial / no-write 的哪类方向。 | TC 编号、断言序列、输入输出样例。 |
| Step 7 测试数据 | 标记是否需要 stable typed ref、fake store、resolver summary、availability marker 或 redacted artifact 前置。 | fixture JSON、seed、builder、cleanup。 |
| Step 8 环境配置 | 标记是否依赖 `local-dev`、`ci-test`、`integration-like`、`operations-replay` 等 profile 方向。 | 具体 key、env、secret provider、topic、URL。 |
| Step 9 自动化门禁 | 标记未来 suite 需要覆盖的切口族。 | CI command、suite 名、阻断级别。 |
| Step 13 evidence | 标记未来证据必须证明 safe output / no-write / replay / redaction。 | EV 编号、artifact path、JSON schema、report body。 |

### 6. R3.8 写入边界思考

`R3.8 测试切口候选与设计真相源:再写入` 应把 R3.7 的思考固化为“候选切口表”,但仍不能写 Step 6 用例矩阵或最终 TC。R3.8 应控制在测试对象、来源章节、候选切口、风险、推荐测试层级和后续用例要求六类信息内。

1. 写 P0 测试切口候选表,每行回指 R3.6 对象候选族和正式设计真相源。
2. 写每类候选切口覆盖字段 / 状态 / 协议 / 错误的方向,但不写断言步骤。
3. 写风险和推荐测试层级,用于 Step 4 分层承接。
4. 写后续 Step 6 用例要求,但不生成 TC 编号或 case matrix。
5. 写 source 缺口检查;若某个切口缺正式来源,标 blocker 并回 owning source。
6. 禁止写测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或正式 `05-测试方案.md`。

### 7. R3.7 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考测试切口候选与设计真相源 | pass |
| 是否从 R3.6 P0 对象候选族推导候选切口方向 | pass |
| 是否明确真相源选择规则 | pass |
| 是否形成风险与推荐层级思考 | pass |
| 是否说明后续 Step 6 用例承接但未写用例 | pass |
| 是否形成 R3.8 写入边界 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写最终测试切口矩阵、用例、数据、环境、门禁、evidence、验收或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.8 测试切口候选与设计真相源:再写入`;只允许写入 P0 测试切口候选表、设计真相源、覆盖字段 / 状态 / 协议 / 错误方向、P0 风险、推荐测试层级、后续用例要求、source 缺口检查和 `R3.9` 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写 TC 编号、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。

---

## R3.8 测试切口候选与设计真相源:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R3.9 |
| 用户确认 | 已确认从 `R3.7` 推进到 `R3.8`。 |
| 本模块写入范围 | P0 测试切口候选表、设计真相源、覆盖字段 / 状态 / 协议 / 错误方向、P0 风险、推荐测试层级、后续用例要求、source 缺口检查和 `R3.9` 进入门禁。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、TC 编号、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划和 implementation code。 |

### 2. P0 测试切口候选表

本表是 Step 3 的 P0 切口候选写入,用于后续 Step 4 分层、Step 5 追溯、Step 6 用例矩阵和 Step 13 evidence 归档承接。它不是最终 TC 表,不含用例编号、fixture、CI suite、artifact path 或验收门禁。

| P0 测试对象候选族 | 候选测试切口 | 设计真相源 | 覆盖字段 / 状态 / 协议 / 错误方向 | P0 风险 | 推荐测试层级 | 后续用例要求 |
|---|---|---|---|---|---|---|
| 七实现单元 owner boundary | module owner / dependency direction cut | `03` §4~§5;Step 16 R16.6 | 覆盖 `contracts/domain/application/infra/api/worker/jobs` owner、依赖方向和 forbidden responsibility。 | 模块职责漂移会让测试只按技术层泛写,无法发现 owner 越界。 | unit + static / contract review candidate | Step 6 需按 owner 边界拆正向职责和 forbidden responsibility 负向场景。 |
| core truth / definition object family | truth invariant and formal version cut | `03` §6;`03` §9~§12;Step 2 P0 core truth | 覆盖 truth object、formal version、typed ref、summary source、relation boundary 和 state owner。 | 核心 truth 不变量缺口会破坏方法资产定义、正式版本和受控消费。 | domain unit / contract-level | Step 6 需覆盖构造成功、非法输入拒绝、状态来源和 summary source 不混同。 |
| object / policy / guard family | policy guard and body-free boundary cut | `03` §6;`03` §10~§12;Step 16 R16.16 | 覆盖 policy accept/reject、domain error、body-free guard、marker/source 不合成。 | raw body、非法状态或未授权规则进入对象会破坏安全边界。 | domain unit / service guard | Step 6 需覆盖 positive、negative、boundary 和 safe rejection surface。 |
| public protocol family | public shell and safe surface cut | `03` §7~§8;Step 16 R16.8 / R16.10 | 覆盖 Command、Query、Inbound、Outbound、Operations Job shell、result、report、safe error。 | public DTO 缺字段或输出 raw body/secret 会破坏跨仓消费契约。 | contract / API mapping | Step 6 需按协议族覆盖 accepted/visible、rejected/not-visible、failed/degraded safe surface。 |
| application flow family | command accepted / rejected / duplicate orchestration cut | `03` §8~§13;Step 16 R16.8 / R16.14 / R16.16 | 覆盖 accepted 副作用顺序、rejected no accepted truth、duplicate no-rerun、stored replay。 | duplicate 重跑或 rejected 写 accepted audit 会破坏一致性和审计可信度。 | service + fake persistence | Step 6 需覆盖正向 accepted、domain rejected、same-key duplicate、stored surface missing 方向。 |
| application flow family | query no-write and degraded surface cut | `03` §8~§13;Step 16 R16.8 / R16.16 | 覆盖 Query visible/empty/not-visible/degraded/partial、no truth/audit/event/repair write。 | Query 写入或自行修 material 会破坏读写边界和 source 可信度。 | service / query contract | Step 6 需覆盖 visible、empty、not-visible、degraded、partial 和 no-write 断言方向。 |
| application flow family | inbound / outbound / operations job flow cut | `03` §8~§13;Step 16 R16.10 / R16.14 | 覆盖 consumer idempotent intake、outbound candidate / publisher failure、operations job report / no truth repair。 | consumer 重入、publisher 失败回滚 truth 或 job 修 core truth 会破坏后台边界。 | runner / service with fake adapters | Step 6 需覆盖 consumer replay、publisher delayed/failed、job partial/report 和 no truth repair。 |
| port / adapter / repository boundary | repository / UoW transaction cut | `03` §7;`03` §10~§13;Step 16 R16.14 | 覆盖 repository contract、UoW atomicity、rollback、version/checkpoint 区分。 | transaction 语义漂移会让 accepted truth、stored replay 和 report 不可审计。 | fake integration / repository contract | Step 6 需覆盖 successful commit、rollback、conflict、commit unknown 和 checkpoint resume 方向。 |
| port / adapter / repository boundary | resolver / publisher / handoff seam cut | `03` §7;`03` §12~§15;`04` §11~§12 | 覆盖 resolver summary、availability/degraded marker、publisher/handoff failure mapping、safe issue。 | adapter 伪成功或私补 marker/source 会隐藏正式设计缺口。 | adapter seam / fake parity direction | Step 6 需覆盖 available、unavailable、degraded、failed marker 和 no synthetic source。 |
| state / consistency / replay family | state machine legal / illegal transition cut | `03` §10;Step 16 R16.12 | 覆盖正式 state family、legal transition、illegal transition、safe error、no side-effect。 | 使用旧状态名或非法转换通过会破坏状态矩阵可信度。 | domain unit + service state | Step 6 需按正式状态族覆盖主线合法、边界合法、非法转换和 no side-effect。 |
| state / consistency / replay family | idempotency / replay / concurrency cut | `03` §11~§13;Step 16 R16.14 | 覆盖 same/different digest、in-flight、stored result/receipt/report replay、race、commit unknown。 | 重跑 mutation、从 current truth 重建 public surface 或忽略 race 会破坏幂等。 | service + fake persistence | Step 6 需覆盖 duplicate replay、digest conflict、in-flight、race 和 stored surface missing。 |
| config / dependency boundary | config validation and profile isolation cut | `04` §5~§12;`03` §14;Step 16 R16.16 | 覆盖 P0 profile candidate、source priority、startup / job-run-start validation、fail-fast。 | invalid config silent fallback 或 P1/P2 production-like 前置会污染 P0。 | config validation / runtime builder | Step 6/8 需承接 valid baseline、missing required ref、invalid source priority、profile isolation。 |
| config / dependency boundary | forbidden configurable boundary cut | `04` §7~§12;Step 16 R16.16 | 覆盖 config 不得改变 truth owner、state transition、query no-write、stored replay、schema/marker source。 | 用 config/feature flag 放宽状态或补 marker 会绕过设计真相源。 | config redline / service guard | Step 6/8 需覆盖 forbidden override、hot reload unsupported 和 source missing design stop。 |
| observability / redaction boundary | no raw body / no secret / safe diagnostic cut | `03` §15;`04` §8 / §11 / §12;Step 16 R16.16 | 覆盖 log、metric、trace、audit、report、handoff 的 body-free、secret-free、safe diagnostic source。 | raw body、secret、raw config 或 unsafe diagnostic 进入输出会破坏安全和证据可信度。 | observability / redaction check | Step 6/10/13 需覆盖 redaction、safe refs、no raw payload、safe error/report output。 |
| observability / redaction boundary | low-cardinality metric / audit refs-only cut | `03` §15;Step 16 R16.16 | 覆盖 metric label family/kind/state/result/category、audit refs-only、query no-write observation。 | 高基数 label、raw ref 或 audit body 泄露会破坏观测与审计边界。 | observability / audit check | Step 6/10/13 需覆盖 metric label 裁剪、audit refs-only、query observation no-write。 |

### 3. source 缺口检查

| 检查项 | 结论 | 处理 |
|---|---|---|
| 每个候选切口是否有正式设计真相源 | pass | 当前候选均回指 `03`、`04`、Step 2 或 Step 16。 |
| 是否用旧 `05/06/07`、旧 MethodContent 或实现便利定义切口 | pass | 旧材料仅作污染风险,未作为正向 source。 |
| 是否新增 schema / port / mapper / state / marker source / config key | pass | 本模块只引用已有 source family,未补新契约。 |
| 是否提前生成 TC 编号、fixture、环境、CI 或 evidence | pass | 已全部后移 Step 6 / 7 / 8 / 9 / 13。 |
| 是否存在需要暂停的 source blocker | pass_with_watch | 当前候选层面未发现 blocker;R3.9/R3.10 细化负向 / P1/P2 / 非范围时若发现缺正式来源,必须回 owning source。 |

### 4. R3.9 进入门禁

`R3.9 负向切口、P1/P2 切口与非范围保护:先思考` 只允许思考负向测试切口、P1/P2 接缝切口和非范围保护:

1. 允许思考字段缺失、DTO 构造失败、引用混同、状态漂移、source / marker missing、config redline 和 observability 泄露等负向切口方向。
2. 允许思考 P1 durable / real-like adapter、resolver、publisher、handoff、外部摘要和跨仓接缝如何降级承接。
3. 允许思考 P2 production-like、容量、多区域、多租户、marketplace、高级策略和标准映射深化如何保持非阻塞。
4. 允许思考旧 MethodContent、publish、snapshot、fingerprint、old outbox、PostgreSQL、gateway、旧 TC / EV 的污染防护。
5. 禁止写最终负向切口表、P1/P2 切口表、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或正式 `05-测试方案.md`。

### 5. R3.8 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 P0 测试切口候选表 | pass |
| 是否每个候选切口有设计真相源 | pass |
| 是否写入覆盖字段 / 状态 / 协议 / 错误方向 | pass |
| 是否写入 P0 风险、推荐测试层级和后续用例要求 | pass |
| 是否写入 source 缺口检查 | pass |
| 是否写入 R3.9 进入门禁 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写 TC 编号、用例、数据、环境、门禁、evidence、验收或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.9 负向切口、P1/P2 切口与非范围保护:先思考`;只允许思考负向切口、P1/P2 接缝切口、非范围保护、旧材料污染防护、R3.10 写入边界;不得直接修改正式 `05-测试方案.md`;不得写最终负向切口表、P1/P2 切口表、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。

---

## R3.9 负向切口、P1/P2 切口与非范围保护:先思考

### 1. 当前模块目标

`R3.9` 只思考 R3.8 已形成的 P0 切口候选之外,哪些负向风险、P1/P2 接缝方向和非范围污染需要在 Step 3 留出保护性切口。当前模块不写最终负向切口表、P1/P2 切口表、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准或实施计划。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R3.10 |
| 用户确认 | 已确认从 `R3.8` 推进到 `R3.9`。 |
| 当前允许 | 思考负向切口方向、P1/P2 接缝切口方向、非范围保护、旧材料污染防护、source 缺口回写规则和 R3.10 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写最终负向切口表、P1/P2 切口表、TC 编号、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。 |

### 2. 负向切口方向思考

负向切口不是 Step 6 用例,而是 Step 3 必须先保留的风险验证入口。R3.10 写入时应从正式 schema、protocol、flow、state、error、config、observability source 中提取负向方向,不得从测试便利或旧 TC 反推。

| 负向风险族 | 思考方向 | 必须回指的正式来源 |
|---|---|---|
| 字段缺失 / DTO 构造失败 | public shell required field、safe error surface、body-free 输出缺失时必须可验证。 | `03` §7~§8;Step 16 R16.8 / R16.10 |
| 引用混同 / source mismatch | typed ref、owner ref、summary source、visibility / availability / marker source 不得混用。 | `03` §6~§13;Step 16 R16.12 / R16.14 / R16.16 |
| 非法状态 / 状态名漂移 | 状态切口必须使用正式 state family,非法转换要验证 no side-effect。 | `03` §10;Step 16 R16.12 |
| replay / idempotency 失败 | duplicate、stored surface missing、different digest、commit unknown 不得重跑或重建 public surface。 | `03` §11~§13;Step 16 R16.14 / R16.16 |
| Query 写入 / material repair | Query degraded、stale、not-visible、partial 时不得写 truth/audit/event/job/repair。 | `03` §8~§13;Step 16 R16.8 / R16.16 |
| adapter unavailable / marker missing | unavailable、degraded、failed marker 只能复制正式 adapter / mapper / resolver output。 | `03` §7;`04` §11~§12;Step 16 R16.16 |
| config redline violation | config 不得改变 truth owner、state transition、stored replay、schema 或 marker source。 | `04` §7~§12;Step 16 R16.16 |
| observability leakage | raw body、secret、raw config、high-cardinality label、unsafe diagnostic 不得进入输出。 | `03` §15;`04` §8 / §11 / §12 |

### 3. P1/P2 接缝切口方向思考

P1/P2 不能反向抬升为 P0 release 前置。R3.10 应只把它们写成接缝或演进方向,并说明“不改变 P0 truth 语义”的保护口径。

| 层级 | 接缝 / 演进方向 | R3.9 取舍 |
|---|---|---|
| P1 durable / real-like adapter | durable store、real-like repository、resolver、publisher、handoff target、external summary seam。 | 可形成 adapter seam / fake-durable parity 候选,但不要求真实产品闭环证明 P0 truth。 |
| P1 cross-repo collaboration | process、identity、governance、runtime、member-images、artifact/archive、capability-hub、marketplace 的 ref / summary / event / handoff seam。 | 只测本仓拥有的 ref、summary、event、handoff、adapter seam,不测 sibling 仓内部状态机。 |
| P1 controlled unavailable / degraded | controlled dependency unavailable、degraded marker、failed marker、safe diagnostic。 | 可作为接缝失败语义候选,但 marker 来源必须正式闭合。 |
| P2 production-like | production-like、容量、硬 SLO、多区域、多租户、真实 secret provider、observability backend。 | 只保留专项 / 运维 / 后续 ADR 方向,不进入当前 P0 切口。 |
| P2 peripheral capability | MethodPlugin / MethodConfiguration、marketplace、高级 ViewProfile / AIPolicy、标准映射深化。 | 只作为外围增强 watch,若进入核心必须回需求 / 架构 / `03` 重新闭口。 |
| P2 runtime control plane | config center、admin override、hot reload、online last-known-good。 | 当前 unsupported / watch-only;不得写成 success path 或当前测试前置。 |

### 4. 非范围与旧材料污染防护思考

非范围保护需要在 Step 3 明确“不能测什么、为什么不能测、如果以后要测去哪里闭口”。它不是简单删除旧内容,而是给后续 Step 14 / Step 15 留污染审计入口。

| 污染 / 越界来源 | 防护思考 | 后续处理 |
|---|---|---|
| 旧 MethodContent / draft / publish / retire / supersede | 不进入当前对象、协议、flow、state 或测试切口。 | 只作为 historical pollution 审计项。 |
| 旧 snapshot / fingerprint / outbox relay / Gateway / PostgreSQL | 不作为当前 source、adapter、event、evidence 或 CI gate 来源。 | 若未来需要,回 owning source 重新设计。 |
| 旧 TC / EV / evidence path | 不继承编号、artifact path、suite、report 或验收口径。 | Step 13 / Step 15 做编号与 evidence 污染审计。 |
| 完整跨仓 E2E / 产品 UI / 交易履约 | 不进入本仓 P0,本仓只测自己拥有的 seam。 | 后续跨仓集成或 sibling owner 承接。 |
| 真实运维闭环 / dashboard / alert / pager / SLO | 不进入 Step 3 测试对象和切口。 | Step 10 / 运维文档 / 新版 `06` 视正式来源承接。 |
| raw body / secret / provider response | 不进入 fixture、report、audit、trace、metric 或 evidence 预期。 | Step 7 / Step 13 必须继续保持 redaction 输入。 |

### 5. source 缺口与暂停规则思考

R3.9/R3.10 细化负向和接缝时更容易遇到 source 缺口。若缺口命中正式 schema、port、mapper、state、marker source、config key、evidence schema 或 phase boundary,测试方案不能自行补。

| 缺口类型 | 暂停条件 | 回写方向 |
|---|---|---|
| negative public surface 缺口 | safe error / rejection / degraded / unavailable public shell 没有正式字段或值域。 | 回 `03` §8 / §12。 |
| marker source 缺口 | redaction、degraded、unavailable、failed、diagnostic marker 无正式来源。 | 回 `03` §7 / §12 / §15 或 `04` §11。 |
| adapter seam 缺口 | resolver、publisher、handoff、durable store 只在测试中存在,没有正式 port。 | 回 `03` §7 / §11 / §14。 |
| state / replay 缺口 | stored replay、checkpoint、commit unknown、race 结果没有正式承载。 | 回 `03` §10~§13。 |
| config / profile 缺口 | 需要新增 config key、profile、hot reload、secret provider 或 admin override 才能测试。 | 回 `04` 或架构 / `03` owning source。 |
| evidence / phase 缺口 | 需要 artifact schema、suite、commit boundary 才能表达切口。 | 后移 Step 9 / Step 13 / 新版 `07`,不得在 R3.9 补。 |

### 6. R3.10 写入边界思考

`R3.10 负向切口、P1/P2 切口与非范围保护:再写入` 应把 R3.9 的思考固化成结构化中间产物,仍不得生成 Step 6 用例矩阵或正式 `05` 正文。

1. 写负向切口候选表,包括负向风险族、候选切口、设计真相源、P0 风险和后续用例要求。
2. 写 P1/P2 接缝 / 演进切口候选表,明确优先级、可测 seam、不得抬升为 P0 的边界。
3. 写非范围保护与旧材料污染防护表。
4. 写 source 缺口检查和回 owning source 规则。
5. 写 `R3.11 P0 切口停审与跨切口审计:先思考` 进入门禁。
6. 禁止写 TC 编号、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或正式 `05-测试方案.md`。

### 7. R3.9 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考负向切口、P1/P2 接缝和非范围保护 | pass |
| 是否承接 R3.8 P0 切口候选但未写用例 | pass |
| 是否明确 P1/P2 不反向抬升为 P0 | pass |
| 是否形成旧材料污染防护思考 | pass |
| 是否形成 source 缺口暂停规则 | pass |
| 是否形成 R3.10 写入边界 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写最终负向切口表、P1/P2 切口表、用例、数据、环境、门禁、evidence、验收或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.10 负向切口、P1/P2 切口与非范围保护:再写入`;只允许写入负向切口候选表、P1/P2 接缝 / 演进切口候选表、非范围保护与旧材料污染防护表、source 缺口检查、R3.11 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写 TC 编号、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。

---

## R3.10 负向切口、P1/P2 切口与非范围保护:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R3.11 |
| 用户确认 | 已确认从 `R3.9` 推进到 `R3.10`。 |
| 本模块写入范围 | 负向切口候选表、P1/P2 接缝 / 演进切口候选表、非范围保护与旧材料污染防护表、source 缺口检查和 `R3.11` 进入门禁。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、TC 编号、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划和 implementation code。 |

### 2. 负向切口候选表

本表只记录负向测试切口候选,用于后续 Step 6 展开具体用例。每个候选均必须回指正式设计 source,不得从旧 TC、实现异常文本、fixture 或 fake 私有状态反推。

| 负向风险族 | 候选负向切口 | 设计真相源 | P0 风险 | 后续用例要求 |
|---|---|---|---|---|
| 字段缺失 / DTO 构造失败 | public shell required field and safe error cut | `03` §7~§8;Step 16 R16.8 / R16.10 | public shell 缺字段或错误面不安全会破坏跨仓消费契约。 | Step 6 覆盖 required field missing、invalid shell、safe rejection / safe error surface。 |
| 引用混同 / source mismatch | typed ref / owner / source mismatch cut | `03` §6~§13;Step 16 R16.12 / R16.14 / R16.16 | typed ref、owner、summary source 或 marker source 混用会破坏 truth 归属。 | Step 6 覆盖 owner mismatch、summary source mismatch、marker source mismatch 和 no private fallback。 |
| 非法状态 / 状态名漂移 | illegal transition and formal state name cut | `03` §10;Step 16 R16.12 | 旧状态名或非法转换通过会破坏状态矩阵和 no side-effect 语义。 | Step 6 按正式 state family 覆盖 illegal transition、safe error、no write / no event。 |
| replay / idempotency 失败 | duplicate / missing stored surface / conflict cut | `03` §11~§13;Step 16 R16.14 / R16.16 | duplicate 重跑、不同 digest 被接受或从 current truth 重建 public surface 会破坏幂等。 | Step 6 覆盖 same digest replay、different digest conflict、stored surface missing、commit unknown。 |
| Query 写入 / material repair | query no-write degraded / partial cut | `03` §8~§13;Step 16 R16.8 / R16.16 | Query 在 degraded、stale、not-visible、partial 分支写 truth/audit/event/job 会越界。 | Step 6 覆盖 visible / not-visible / degraded / partial 下 no truth/audit/event/repair。 |
| adapter unavailable / marker missing | copy-only marker and unavailable seam cut | `03` §7;`04` §11~§12;Step 16 R16.16 | unavailable/degraded/failed marker 私自合成会隐藏正式 source 缺口。 | Step 6 覆盖 adapter unavailable、marker missing、safe diagnostic 和 design stop。 |
| config redline violation | forbidden configurable boundary cut | `04` §7~§12;Step 16 R16.16 | config 改写 truth owner、state transition、stored replay、schema 或 marker source 会绕过设计。 | Step 6/8 覆盖 forbidden override、hot reload unsupported、config cannot repair source。 |
| observability leakage | raw body / secret / high-cardinality leakage cut | `03` §15;`04` §8 / §11 / §12 | raw body、secret、raw config、unsafe diagnostic 或高基数 label 泄露会破坏安全和证据可信度。 | Step 6/10/13 覆盖 no raw payload、no secret、low-cardinality、safe diagnostic refs。 |

### 3. P1/P2 接缝 / 演进切口候选表

P1/P2 只作为接缝或演进验证方向,不得反向定义 P0 truth、P0 release gate、正式 evidence schema 或 implementation boundary。

| 优先级 | 候选接缝 / 演进切口 | 可测 seam | 不得抬升为 P0 的边界 | 后续承接 |
|---|---|---|---|---|
| P1 | durable / real-like repository seam cut | repository adapter slot、UoW parity、version / transaction semantics。 | 不要求真实 DB 产品闭环作为 P0 前置。 | Step 8/9 后续确定环境和 suite 候选。 |
| P1 | real-like resolver / publisher / handoff seam cut | resolver summary、publisher candidate、handoff target、failed marker。 | delivery / external receipt 不证明 local truth。 | Step 6/8/9 承接 controlled seam 和 failure mapping。 |
| P1 | cross-repo ref / summary / event / handoff seam cut | process、identity、governance、runtime 等 sibling 仅验证本仓拥有的 refs / summaries / handoff。 | 不测试相邻仓内部状态机、权限、UI、交易或真实运维。 | 后续跨仓集成或 sibling owner 承接完整 E2E。 |
| P1 | controlled unavailable / degraded seam cut | controlled dependency unavailable、formal degraded/unavailable marker、safe issue。 | 不用 adapter error text、HTTP status 或 topic 拼 marker。 | Step 6 细化 safe degraded / unavailable 用例方向。 |
| P2 | production-like / capacity / SLO direction | future production-like profile、capacity、hard SLO、multi-region、tenant profile。 | 不进入当前 P0 切口、环境前置或验收门禁。 | Step 10 / 运维 / 新版 `06` 后续裁决。 |
| P2 | peripheral method capability direction | MethodPlugin、MethodConfiguration、marketplace、高级 ViewProfile / AIPolicy、标准映射深化。 | 不反向定义当前 core truth、protocol、state 或 config。 | 若进入核心,回需求 / 架构 / `03` owning source。 |
| P2 | runtime control plane direction | config center、admin override、hot reload、online last-known-good。 | 当前 unsupported / watch-only,不得写成 success path。 | 需要时回架构、`03` 和 `04` 重新闭口。 |

### 4. 非范围保护与旧材料污染防护表

| 非范围 / 污染来源 | 当前保护口径 | 后续处理 |
|---|---|---|
| 旧 MethodContent / draft / publish / retire / supersede | 不进入当前对象、protocol、flow、state、case 或 evidence。 | Step 14 / Step 15 做 historical pollution 审计。 |
| 旧 snapshot / fingerprint / outbox relay / Gateway / PostgreSQL | 不作为当前 source、adapter、event、storage、CI 或 evidence 来源。 | 若未来需要,回 owning source 重新设计。 |
| 旧 TC / EV / report path | 不继承编号、suite、artifact path、report 或验收口径。 | Step 13 / Step 15 审计编号和 evidence 污染。 |
| 完整跨仓 E2E / 产品 UI / 交易履约 | 不进入本仓 P0;本仓只测 ref / summary / event / handoff / adapter seam。 | 由跨仓集成计划或 sibling owner 承接。 |
| 真实运维闭环 / dashboard / alert / pager / SLO | 不进入 Step 3 测试对象或测试切口。 | Step 10、运维文档或新版 `06` 在正式 source 闭合后承接。 |
| raw body / secret / provider response | 不进入 fixture、report、audit、trace、metric、diagnostic 或 evidence 预期。 | Step 7 / Step 13 必须继续保持 redaction 和 safe refs。 |

### 5. source 缺口检查

| 检查项 | 结论 | 处理 |
|---|---|---|
| 负向切口是否均有正式 source | pass | 当前候选均回指 `03`、`04` 或 Step 16。 |
| P1/P2 是否被抬升为 P0 前置 | pass | P1/P2 均标记为 seam / direction / watch,不阻塞 P0。 |
| 非范围是否被恢复为当前测试对象 | pass | 旧 MethodContent、旧 TC / EV、真实产品和完整 E2E 均保持隔离。 |
| 是否新增 schema / port / mapper / state / marker source / config key | pass | 本模块只记录候选切口和回写规则,未新增正式契约。 |
| 是否提前写 TC / 数据 / 环境 / 自动化 / evidence | pass | TC 留 Step 6,数据留 Step 7,环境留 Step 8,自动化留 Step 9,evidence 留 Step 13。 |
| 是否发现阻塞 R3.10 的 source 缺口 | pass_with_watch | 当前候选层面未发现 blocker;R3.11/R3.12 停审和跨切口审计若发现孤儿契约或 source 缺口,必须暂停回 owning source。 |

### 6. R3.11 进入门禁

`R3.11 P0 切口停审与跨切口审计:先思考` 只允许思考如何审查 Step 3 已形成的对象候选、P0 切口候选、负向切口、P1/P2 接缝和非范围保护:

1. 允许思考 P0 测试切口停审维度,包括设计来源、风险、推荐层级、后续用例可落地性和 source 缺口。
2. 允许思考跨切口审计维度,包括孤儿 P0 设计契约、重复切口、状态 / 字段命名漂移、phase boundary 越界、旧材料污染和 Step 4 进入条件。
3. 允许思考正式 §3 回填草稿候选边界,但不得写正式 `05-测试方案.md` 正文。
4. 禁止写最终停审表、跨切口审计表、正式 §3 草稿、TC 编号、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或 implementation code。

### 7. R3.10 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入负向切口候选表 | pass |
| 是否写入 P1/P2 接缝 / 演进切口候选表 | pass |
| 是否写入非范围保护与旧材料污染防护表 | pass |
| 是否写入 source 缺口检查 | pass |
| 是否写入 R3.11 进入门禁 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写 TC 编号、用例、数据、环境、门禁、evidence、验收或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.11 P0 切口停审与跨切口审计:先思考`;只允许思考 P0 测试切口停审维度、跨切口审计维度、孤儿契约 / 重复切口 / 命名漂移 / phase 越界 / 旧材料污染、正式 §3 回填草稿候选边界和 R3.12 写入边界;不得直接修改正式 `05-测试方案.md`;不得写最终停审表、跨切口审计表、正式 §3 草稿、TC 编号、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。

---

## R3.11 P0 切口停审与跨切口审计:先思考

### 1. 当前模块目标

`R3.11` 只思考 Step 3 末尾如何对已形成的测试对象候选、P0 切口候选、负向切口、P1/P2 接缝和非范围保护做停审与跨切口审计。当前模块不写最终停审表、跨切口审计表、正式 §3 回填草稿、TC 编号、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准或实施计划。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R3.12 |
| 用户确认 | 已确认从 `R3.10` 推进到 `R3.11`。 |
| 当前允许 | 思考 P0 测试切口停审维度、跨切口审计维度、孤儿契约 / 重复切口 / 命名漂移 / phase 越界 / 旧材料污染、正式 §3 回填草稿候选边界和 R3.12 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写最终停审表、跨切口审计表、正式 §3 草稿、TC 编号、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。 |

### 2. P0 切口停审维度思考

R3.12 写入的 P0 停审表应审查每组切口是否具备后续 Step 4~13 承接条件,而不是判断测试已经执行完成。停审的核心是防止“看似有切口,实际没有 source、风险、层级或后续用例入口”。

| 停审维度 | 思考要点 | 不通过时处理 |
|---|---|---|
| 设计来源明确 | 每个 P0 切口必须回指正式 `03/04` 章节、Step 2 范围或 Step 16 最小切口来源。 | 标记 source gap,回 owning source,不得用测试方案补口。 |
| 风险具体 | 每个切口必须说明失败会破坏的 P0 能力、边界、安全或一致性。 | 拆分风险或降级为 P1/P2 / 残余风险。 |
| 推荐层级合理 | 推荐层级必须贴合风险位置,不能全部写 unit 或 integration。 | 回 R3.8/R3.10 修正层级候选。 |
| 后续用例可落地 | Step 6 能继续展开 positive / negative / boundary / duplicate / recovery / no-write 等用例方向。 | 标记 Step 6 handoff gap,不得提前补 TC。 |
| source 缺口已暴露 | 对象、port、mapper、state、marker、config、evidence 或 phase 缺口必须被看见。 | 暂停并回 owning source 或后移到对应 Step。 |
| 非范围未混入 | 旧材料、真实产品、完整 E2E、production-like 和运维闭环没有混入 P0。 | 标记污染风险并从 P0 切口中移除。 |

### 3. 跨切口审计维度思考

跨切口审计用于发现单个切口表看不出的全局问题。它应覆盖孤儿设计契约、重复切口、命名漂移、phase 越界和旧材料污染,并判断 Step 3 是否具备进入 Step 4 的条件。

| 审计维度 | 需要发现的问题 | R3.11 取舍 |
|---|---|---|
| 孤儿 P0 设计契约 | `03` §5~§15 和 `04` §5~§12 中的 P0 契约是否没有任何测试切口承接。 | R3.12 应写审计结论,发现缺口则不能声称 Step 3 completed。 |
| 重复 / 重叠切口 | 同一风险是否被多张表重复表达但 source 或层级不同。 | 保留必要交叉切口,合并无意义重复。 |
| 状态 / 字段命名漂移 | 是否使用旧状态名、旧 DTO 名、旧 MethodContent / publish / snapshot / outbox 名称。 | 命中即污染,不能进入正式 §3 候选。 |
| phase boundary 越界 | 是否提前写了 TC、fixture、环境、CI、evidence、验收或实施边界。 | 越界内容必须移出 Step 3 或后移对应 Step。 |
| P1/P2 抬升 | P1/P2 seam 是否被写成 P0 前置、release gate 或当前 implementation 承诺。 | 降回 seam / direction / watch。 |
| source gap 隐藏 | 是否用 fake、config、error text、log、metric、operator note 或旧材料补 source。 | 标 blocker,回 owning source。 |
| 旧材料污染 | 是否继承旧 `05/06/07` 的 TC、EV、suite、report path、对象或协议。 | 标 historical pollution,后续 Step 15 再审。 |

### 4. 正式 §3 回填草稿候选边界思考

R3.12 可以写“正式 §3 回填草稿候选边界”,但不能写正式 `05-测试方案.md` 正文。正式文档只能在 Step 15 从已确认的 Step 1~14 装配。R3.12 的草稿候选应只说明 §3 将来由哪些已确认中间产物组成。

| §3 候选组成 | 来源 | R3.11 边界 |
|---|---|---|
| 测试对象候选 | R3.6 | 可作为 §3 测试对象表候选来源,但仍需 R3.12 停审确认。 |
| P0 测试切口候选 | R3.8 | 可作为 §3 测试切口总表候选来源,不生成 TC。 |
| 负向切口候选 | R3.10 | 可作为 §3 负向切口补充来源,不写用例步骤。 |
| P1/P2 seam / direction | R3.10 | 可作为 §3 优先级边界说明,不写 P0 gate。 |
| 非范围 / 污染防护 | R3.10 | 可作为 §3 非范围保护说明,不恢复旧材料。 |
| 停审与跨切口审计 | R3.12 | 决定 Step 3 是否可以 completed_wait_user_confirm_to_Step_4。 |

### 5. Step 4 进入条件思考

Step 3 不能因为“已经有很多表”就进入 Step 4。进入 Step 4 的条件应是对象、切口、负向、P1/P2、非范围和审计都可追溯、无 unresolved blocker,且后续分层可以承接。

| 进入条件 | R3.11 判断口径 |
|---|---|
| P0 测试对象都有切口 | R3.6 对象候选必须在 R3.8 / R3.10 至少有一个可追溯切口承接。 |
| 每个 P0 切口已停审 | R3.12 必须给出停审结论,不能留空。 |
| 跨切口审计无 unresolved 冲突 | 孤儿契约、重复切口、命名漂移、phase 越界和旧材料污染不得 unresolved。 |
| Step 4 有足够分层输入 | 每个切口至少有推荐层级候选或分层判断所需风险信息。 |
| 后续 Step 6 / 7 / 8 / 9 / 13 边界清晰 | 用例、数据、环境、自动化、evidence 均未提前写入,但已有承接提示。 |

### 6. R3.12 写入边界思考

`R3.12 P0 切口停审与跨切口审计:再写入` 应把 R3.11 的思考固化为结构化中间产物,并完成 Step 3 stop-review。它仍不能修改正式 `05-测试方案.md`。

1. 写 P0 测试切口停审表,覆盖设计来源、风险、推荐层级、后续用例可落地性和缺口。
2. 写跨切口设计来源审计表,覆盖孤儿契约、重复切口、命名漂移、phase 越界和旧材料污染。
3. 写正式 §3 回填草稿候选边界,只说明后续 Step 15 装配来源。
4. 写 Step 3 completed stop-review 和 Step 4 进入条件。
5. 更新 flow / project ledger 到 Step 3 completed_wait_user_confirm_to_Step_4。
6. 禁止写正式 `05-测试方案.md`、TC 编号、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或 implementation code。

### 7. R3.11 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 P0 切口停审与跨切口审计 | pass |
| 是否形成停审维度 | pass |
| 是否形成跨切口审计维度 | pass |
| 是否明确正式 §3 回填草稿候选边界 | pass |
| 是否形成 Step 4 进入条件思考 | pass |
| 是否形成 R3.12 写入边界 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写最终停审表、跨切口审计表、正式 §3 草稿、TC、用例、数据、环境、门禁、evidence、验收或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.12 P0 切口停审与跨切口审计:再写入`;只允许写入 P0 测试切口停审表、跨切口设计来源审计表、正式 §3 回填草稿候选边界、Step 3 completed stop-review、Step 4 进入条件,并更新 flow / project ledger 到 Step 3 completed_wait_user_confirm_to_Step_4;不得直接修改正式 `05-测试方案.md`;不得写 TC 编号、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。

---

## R3.12 P0 切口停审与跨切口审计:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R4.1 |
| 用户确认 | 已确认从 `R3.11` 推进到 `R3.12`。 |
| 本模块写入范围 | P0 测试切口停审表、跨切口设计来源审计表、正式 §3 回填草稿候选边界、Step 3 completed stop-review、Step 4 进入条件,并更新 flow / project ledger 到 Step 3 completed_wait_user_confirm_to_Step_4。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、TC 编号、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划和 implementation code。 |

### 2. P0 测试切口停审表

本表审查 Step 3 已形成的 P0 切口候选是否具备后续 Step 4~13 承接条件。它不是测试执行结果,也不是 Step 6 用例矩阵。

| P0 测试切口 | 设计来源 | 风险是否具体 | 推荐层级是否可承接 | 后续用例可落地性 | 停审结论 |
|---|---|---|---|---|---|
| module owner / dependency direction cut | `03` §4~§5;Step 16 R16.6 | pass | pass | Step 6 可按 owner boundary / forbidden responsibility 展开。 | pass |
| truth invariant and formal version cut | `03` §6;`03` §9~§12;Step 2 P0 core truth | pass | pass | Step 6 可覆盖构造、非法输入、状态来源和 summary source。 | pass |
| policy guard and body-free boundary cut | `03` §6;`03` §10~§12;Step 16 R16.16 | pass | pass | Step 6 可覆盖 policy accept/reject、safe rejection 和 body-free guard。 | pass |
| public shell and safe surface cut | `03` §7~§8;Step 16 R16.8 / R16.10 | pass | pass | Step 6 可按 Command / Query / Inbound / Outbound / Job 协议族展开。 | pass |
| command accepted / rejected / duplicate orchestration cut | `03` §8~§13;Step 16 R16.8 / R16.14 / R16.16 | pass | pass | Step 6 可覆盖 accepted、rejected、duplicate no-rerun、stored surface missing。 | pass |
| query no-write and degraded surface cut | `03` §8~§13;Step 16 R16.8 / R16.16 | pass | pass | Step 6 可覆盖 visible、empty、not-visible、degraded、partial 和 no-write。 | pass |
| inbound / outbound / operations job flow cut | `03` §8~§13;Step 16 R16.10 / R16.14 | pass | pass | Step 6 可覆盖 consumer replay、publisher failed/delayed、job partial/report/no truth repair。 | pass |
| repository / UoW transaction cut | `03` §7;`03` §10~§13;Step 16 R16.14 | pass | pass | Step 6 可覆盖 commit、rollback、conflict、commit unknown、checkpoint resume。 | pass |
| resolver / publisher / handoff seam cut | `03` §7;`03` §12~§15;`04` §11~§12 | pass | pass | Step 6 可覆盖 available/unavailable/degraded/failed marker 和 no synthetic source。 | pass |
| state machine legal / illegal transition cut | `03` §10;Step 16 R16.12 | pass | pass | Step 6 可按正式 state family 覆盖合法、边界合法、非法转换和 no side-effect。 | pass |
| idempotency / replay / concurrency cut | `03` §11~§13;Step 16 R16.14 | pass | pass | Step 6 可覆盖 duplicate replay、digest conflict、in-flight、race、stored surface missing。 | pass |
| config validation and profile isolation cut | `04` §5~§12;`03` §14;Step 16 R16.16 | pass | pass | Step 6/8 可承接 valid baseline、missing ref、invalid priority、profile isolation。 | pass |
| forbidden configurable boundary cut | `04` §7~§12;Step 16 R16.16 | pass | pass | Step 6/8 可覆盖 forbidden override、hot reload unsupported、source missing design stop。 | pass |
| no raw body / no secret / safe diagnostic cut | `03` §15;`04` §8 / §11 / §12;Step 16 R16.16 | pass | pass | Step 6/10/13 可覆盖 redaction、safe refs、no raw payload、safe report output。 | pass |
| low-cardinality metric / audit refs-only cut | `03` §15;Step 16 R16.16 | pass | pass | Step 6/10/13 可覆盖 metric label 裁剪、audit refs-only、query observation no-write。 | pass |
| negative public shell / source / state / replay / config / observability cuts | R3.10;`03` §6~§15;`04` §7~§12;Step 16 | pass | pass | Step 6 可按负向风险族继续拆 case,不需在 Step 3 写 TC。 | pass |

### 3. 跨切口设计来源审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 测试对象是否均有切口承接 | pass | R3.6 的九类 P0 对象候选已由 R3.8 / R3.10 的 P0 与负向切口承接。 |
| 是否存在孤儿 P0 设计契约 | pass_with_watch | 当前 Step 3 粒度未发现 orphan;Step 5 追溯矩阵需继续逐 FR / BR / NFR 与设计契约核对。 |
| 是否覆盖 Step 16 最小验证清单 | pass | module、protocol、state、consistency、error、config、observability 均有候选切口。 |
| 是否存在重复 / 重叠切口无法区分 | pass | flow、state、consistency、observability 存在必要交叉,但来源和后续承接不同。 |
| 是否存在状态 / 字段命名漂移 | pass | 未恢复旧状态名、旧 DTO、旧 MethodContent / publish / snapshot / outbox 命名作为正向来源。 |
| 是否存在 phase boundary 越界 | pass | 未写 TC 编号、用例矩阵、fixture、环境、CI、evidence、验收或实施边界。 |
| 是否存在 P1/P2 抬升为 P0 | pass | P1/P2 均作为 seam / direction / watch,不阻塞 P0。 |
| 是否用 fake / config / error text / log 补 source | pass | 切口只引用正式 `03/04`、Step 2 或 Step 16,缺口处理回 owning source。 |
| 是否存在旧材料污染 | pass | 旧 `05/06/07`、旧 TC / EV、旧 MethodContent、旧 outbox / PostgreSQL / Gateway 均保持隔离。 |
| 是否具备进入 Step 4 的分层输入 | pass | 每个 P0 切口均已有推荐层级候选和风险说明,足以进入策略与分层讨论。 |

### 4. 正式 §3 回填草稿候选边界

正式 `05-测试方案.md` §3 只能在 Step 15 装配。本节只记录将来 §3 的候选来源边界,不得当作正式正文。

| §3 候选块 | 中间产物来源 | 装配边界 |
|---|---|---|
| §3.1 校准来源与延伸阅读 | R3.2;R3.12 | 引用 Step 3 中间产物和正式 `03/04`,不复制旧 `05/06/07`。 |
| §3.2 测试对象候选 | R3.6 | 装配 P0 测试对象候选族、来源、风险和后续承接。 |
| §3.3 P0 测试切口候选 | R3.8 | 装配测试对象、来源章节、测试切口、风险和推荐测试层级。 |
| §3.4 负向切口与 P1/P2 边界 | R3.10 | 装配负向切口候选、P1/P2 seam、非范围保护。 |
| §3.5 停审与跨切口审计摘要 | R3.12 | 装配停审结论和进入 Step 4 条件,不写用例或 evidence。 |

### 5. Step 4 进入条件

| 条件 | 状态 | 说明 |
|---|---|---|
| Step 3 P0 测试对象候选已收口 | pass | R3.6 已完成九类对象候选。 |
| Step 3 P0 测试切口候选已收口 | pass | R3.8 已完成 P0 切口候选和 source 检查。 |
| Step 3 负向 / P1/P2 / 非范围保护已收口 | pass | R3.10 已完成负向切口、P1/P2 seam 和污染防护。 |
| P0 切口停审已完成 | pass | 本模块已完成 P0 切口停审表。 |
| 跨切口审计无 unresolved blocker | pass | 当前未发现阻塞 Step 4 的 source 缺口。 |
| 未提前写 Step 4+ 内容 | pass | 未写策略分层、追溯矩阵、用例、数据、环境、自动化、evidence、验收或实施内容。 |
| 正式 `05-测试方案.md` 未修改 | pass | 正式正文仍留到 Step 15 装配。 |

### 6. Step 3 completed stop-review

| 检查项 | 结果 |
|---|---|
| 是否完成 Step 3 开工与必读文档 | pass |
| 是否完成测试对象抽取口径 | pass |
| 是否完成 P0 测试对象候选 | pass |
| 是否完成 P0 测试切口候选与设计真相源 | pass |
| 是否完成负向切口、P1/P2 接缝与非范围保护 | pass |
| 是否完成 P0 切口停审与跨切口审计 | pass |
| 是否未发现 unresolved source blocker | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未提前写 TC、用例、数据、环境、自动化、evidence、验收或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.1 测试策略与分层:先思考`;只允许思考 Step 4 开工边界、必读文档、Step 3 handoff、L1-governance Step 4 框架参考、测试层级 / 策略 / 切口承接边界和 R4.2 写入边界;不得直接修改正式 `05-测试方案.md`;不得写追溯矩阵、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。
