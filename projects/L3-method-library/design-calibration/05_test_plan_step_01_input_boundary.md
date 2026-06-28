# Step 1. 确认测试输入边界

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 1
> 回填章节: `05-测试方案.md` §1 与上游文档的关系声明
> 创建日期: 2026-06-27
> 当前模式: full-restart / step1-input-boundary
> 当前状态: completed
> 当前模块: `R1.6 待确认事项与进入 Step 2 条件:再写入`
> 当前门禁: `R1.6` completed_wait_user_confirm_to_R2.1;Step 1 completed;等待确认进入 Step 2 `R2.1 开工与必读文档:先思考`

---

## 0. 文件重启记录

旧正式 `05-测试方案.md` 曾围绕 P0 MethodContent、publish、snapshot、fingerprint、outbox relay、PostgreSQL、gateway header、旧 API / Event / Job、旧 P1 feature disabled 等口径组织。当前 full-restart 后的 `00/01/02/03/04` 已经替换这些主线,因此旧 `05` 的章节结构、测试目标、测试对象、TC / EV 编号、环境假设和证据路径全部作废。

当前 Step 1 不继承旧 `TG-001`~`TG-007`、旧 7 类 MethodContent、旧 `TC-*`、旧 `EV-*`、旧 outbox / snapshot / fingerprint / relay / replay 测试、旧 PostgreSQL / object storage / gateway / HTTP header 假设。旧内容只能作为 historical pollution 和差异审计输入,不得作为当前 L3-method-library 测试方案正向来源。

当前 Step 1 的唯一正向基线是:

- 当前 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`。
- 当前 `03_ddd_step_16_test_cut.md` 中的详细设计级最小测试切口。
- 当前 `04_config_step_12_downstream_handoff.md` 与正式 `04-配置设计.md` §12 的测试承接输入。
- 测试方案 SOP、测试方案书写规范、中间产物规范和可落码性标准。
- L1-governance 的 `05_test_plan_*` 只作为框架参考,不得复制领域事实。

---

## R1.1 开工与必读文档:先思考

### 1. 当前模块目标

`R1.1` 只思考 `05-测试方案.md` full-restart 的开工边界、必读文档、权威输入、旧材料隔离、L1-governance 框架参考和 `R1.2` 写入边界。当前模块不写正式 `05-测试方案.md` §1 正文,不定义测试目标、测试范围、测试对象、TC 编号、fixture、CI gate、evidence schema、验收裁决或实施边界。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考开工边界、必读文档、权威输入、旧材料处理、SOP 五问初步方向、L1-governance 框架参考和 R1.2 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写完整 Step 1 结构化中间产物;进入 Step 2;写测试目标 / 范围 / 用例 / 数据 / 环境 / 自动化 / evidence / 验收 / 实施。 |

### 2. Step 1 启动前必须承接

| 输入 | 必须承接的内容 | 禁止继承 / 禁止提前 |
|---|---|---|
| `project_execution_ledger.md` | 当前恢复点、`04` completed、允许创建 / 更新 `05` flow 和 Step 1 开工记录。 | 跳过 Step 1 直接重写正式 `05`。 |
| `05_test_plan_calibration_flow.md` | 当前 05 full-restart 目标、权威输入、Step 状态和恢复门禁。 | 把 future Step 批量标记完成。 |
| `00-需求文档.md` | FR-ML、BR-ML、NFR-ML、验收方向、数据归属和接口依赖。 | 改写需求编号、目标、非目标或验收语义。 |
| `01-架构设计.md` | Definition vs Use、职责边界、依赖方向、数据所有权、横切红线。 | 重新选择架构方案或产品依赖。 |
| `02-概要设计.md` | 八个组成部分、代码主体框架、关键对象、接口骨架、处理流、状态和配置影响。 | 恢复旧 MethodContent / P0 / outbox 主线。 |
| `03-详细设计.md` | 七实现单元、对象、port、protocol、flow、state、transaction、error、idempotency、config、observability、test cut。 | 在测试方案中补 schema、port、state、marker 或 mapper。 |
| `03_ddd_step_16_test_cut.md` | module / protocol / state / consistency / error / config / observability 最小验证入口。 | 把最小切口直接当成完整 TC / evidence 矩阵。 |
| `04-配置设计.md` | profile、source priority、validation、secret/redaction、adapter availability、failure/degradation、downstream handoff。 | 从旧测试环境反向定义 config key、profile 或 evidence。 |
| 旧 `05-测试方案.md` | historical pollution 诊断。 | 继承旧 TC、EV、MethodContent、publish、snapshot、outbox、PostgreSQL、gateway 假设。 |
| 旧 `06/07` | old direction input。 | 提前写 acceptance gate、release veto、phase、commit boundary、required_checks。 |
| L1-governance `05_test_plan_*` | 框架、表格、停审深度和 Step 主链参考。 | 复制 governance 领域对象、case、evidence 或 gate。 |

### 3. SOP Step 1 五问初步思考

| SOP 问题 | R1.1 初步回答 | 后续落点 |
|---|---|---|
| 当前测试方案要承接哪些需求、规则和非功能目标? | 承接 `FR-ML-001~009`、`FR-ML-E-*`、`BR-ML-001~022`、`BR-ML-E-001`、`NFR-ML-001~016`、数据归属、接口依赖和需求层验收方向。 | R1.2/R1.3 写输入映射;Step 2 写目标范围;Step 5 写覆盖矩阵。 |
| 哪些概要 / 详细设计章节直接影响测试对象? | `02` 的八组件、代码主体、对象、接口、流、状态、异常、配置影响;`03` 的七实现单元、对象 / port / protocol / flow / state / transaction / error / idempotency / config / observability / test cuts。 | Step 1 输入映射;Step 3 测试对象与切口。 |
| 哪些验收项需要测试方案提供证据? | 需求 §14 的核心能力、功能能力、规则边界、数据归属、接口依赖和非功能验收方向都需要后续 evidence;正式 `06` 尚未重启,所以当前只定义证据供给边界,不做验收裁决。 | Step 5 覆盖矩阵;Step 13 evidence;后续 `06` 裁决。 |
| 哪些内容不应在测试方案中重新定义? | 不重新定义需求、架构、对象字段、DTO、port、repository、flow、state、error、config key、adapter product、evidence artifact schema、acceptance gate、phase 或 commit boundary。 | Step 1 不再回答清单;全程门禁。 |
| 当前上游是否存在会阻塞测试设计的缺口? | 不阻塞 Step 2。`00~04` 与 `03_ddd_step_16_test_cut.md` 足够启动测试方案重启。旧 `05/06/07` 未重启是预期下游状态,不是 Step 1 blocker。若后续 case/evidence 发现 schema/source 缺口,再回 owning design source。 | R1.2 写入初判;后续 Step 逐步复核。 |

### 4. 旧材料隔离思考

| 旧内容 | 当前处理 |
|---|---|
| 旧 `P0 方法定义发布同步闭环` | 不继承;当前主线为方法资产定义、正式化版本、受控消费、追溯一致性、关系分发、外部摘要、维护收敛、外围组织边界。 |
| 旧 7 类 `MethodContent` | 不继承;当前对象以 `03` Step 6 和正式 §6 为准。 |
| 旧 publish / draft / snapshot / fingerprint / outbox | 不继承;当前用正式 protocol / flow / transaction / event candidate / report boundary 重新展开。 |
| 旧 PostgreSQL / object storage / gateway / HTTP header | 不继承;具体产品、transport、部署和 implementation gate 后移。 |
| 旧 TC / EV 编号 | 全部作废;新版 TC / EV 必须在当前 Step 6 / Step 13 重新生成。 |
| 旧 `06/07` 验收和实施材料 | 只作方向提醒;不得作为当前 evidence、gate、phase 或 commit 来源。 |

### 5. L1-governance 框架参考思考

L1-governance 的价值在测试方案组织深度,不是领域语义。L3-method-library 只参考其 `flow -> Step 1 输入边界 -> Step 2 范围 -> Step 3 切口 -> Step 6 用例 -> Step 13 evidence -> Step 15 正式装配` 的结构,以及每个 Step 内“问题回答、诊断、取舍、结构化中间产物、回填草稿、待确认、停审”的表达方式。

| L1-governance 框架点 | L3 采用方式 |
|---|---|
| 旧 05/06 只作历史诊断 | L3 同样隔离旧 MethodContent 测试方案和旧验收 / 实施口径。 |
| `03_ddd_step_16_test_cuts` 是直接输入 | L3 使用 `03_ddd_step_16_test_cut.md` 作为 Step 3 / Step 6 关键输入。 |
| 配置设计进入测试环境与门禁 | L3 使用正式 `04-配置设计.md` §6~§12 作为 Step 8~10 / Step 12~13 输入。 |
| Step 1 不直接生成正式 05 | L3 Step 1 只收输入边界和 §1 回填草稿,正式装配留给 Step 15。 |
| 每个 P0 切口后续必须可留证 | L3 后续 Step 5 / Step 13 必须把需求、设计、TC 和 evidence 串起来。 |

### 6. R1.2 写入边界思考

`R1.2` 只应把 R1.1 的开工思考落成可恢复台账,不得进入完整 Step 1 结构化结论或正式 `05` 正文:

1. 写 Step 1 必读文档表与读取状态。
2. 写权威输入基线和历史材料处理规则。
3. 写 SOP 五问初步回答。
4. 写当前文档问题诊断范围,只诊断旧 `05` 与当前 `00~04` 的权威冲突。
5. 写 `R1.3 输入边界结构化中间产物:先思考` 进入门禁。

### 7. R1.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否确认旧 `05-测试方案.md` 不作为当前真相源 | pass |
| 是否只思考开工、必读文档、权威输入、旧材料隔离和 R1.2 写入边界 | pass |
| 是否参考 L1-governance 框架但不复制领域语义 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写测试目标 / 范围 / 用例 / evidence / CI / 验收 / 实施 | pass |
| 是否形成 R1.2 写入边界 | pass |

next_allowed_action: 等待用户确认后进入 Step 1 `R1.2 开工与必读文档:再写入`;只允许写入 Step 1 必读文档表、输入基线、旧材料处理规则、SOP 五问初步回答、当前文档问题诊断范围和 `R1.3` 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写测试目标、范围、对象、切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或 implementation code。

---

## R1.2 开工与必读文档:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R1.1` 推进到 `R1.2`。 |
| 本模块写入范围 | Step 1 必读文档表、输入基线、旧材料处理规则、SOP 五问初步回答、当前文档问题诊断范围和 `R1.3` 进入门禁。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、测试目标、测试范围、测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划和 implementation code。 |

### 2. 必读文档表与读取状态

| 文档 | 读取状态 | Step 1 用途 | 当前裁决 |
|---|---|---|---|
| `project_execution_ledger.md` | 已读取并承接 | 确认项目恢复点、当前文档、当前 Step、当前模块和下一动作。 | 当前只推进 `05` Step 1 `R1.2`。 |
| `05_test_plan_calibration_flow.md` | 已创建并读取 | 确认 05 full-restart 目标、权威输入、Step 状态表和执行纪律。 | Step 2~15 保持 blocked。 |
| `05_test_plan_step_01_input_boundary.md` | 已读取并更新 | 记录 Step 1 R1.1/R1.2 的思考、写入和停审。 | 当前文件是唯一允许写入的 Step 文件。 |
| `standards/document/测试方案讨论流程_SOP.md` | 已读取关键规则 | 固定 Step 1 目标、输入、输出、五问和进入下一步条件。 | Step 1 只确认输入边界,不写测试范围。 |
| `standards/document/测试方案书写规范.md` | 已读取关键规则 | 固定正式 `05` 15 章主链、校准来源、TC / EV 和 artifacts / reports 规则。 | 正式 `05` 等 Step 15 装配。 |
| `standards/document/设计文档讨论中间产物规范.md` | 已读取关键规则 | 固定三层台账、先思考后写入、单模块推进、写入批次和恢复门禁。 | 本轮只写一个模块。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已列入必读 | 防止测试方案补 schema、port、state、mapper、config、evidence 或 phase 缺口。 | 后续遇到缺口必须回 owning design source。 |
| `00-需求文档.md` | 已读取关键章节 | 提供 FR-ML、BR-ML、NFR-ML、数据归属、接口依赖和验收方向。 | 是测试方案正式上游。 |
| `01-架构设计.md` | 已读取关键章节 | 提供 Definition vs Use、职责边界、依赖方向、数据所有权和横切红线。 | 是测试方案正式上游。 |
| `02-概要设计.md` | 已读取关键章节 | 提供八组件、代码主体框架、对象轮廓、接口骨架、处理流、状态和配置影响。 | 是测试对象抽取输入。 |
| `03-详细设计.md` | 已读取关键章节 | 提供七实现单元、对象、port、protocol、flow、state、persistence、error、idempotency、config、observability 和 test cuts。 | 是测试对象和用例断言直接输入。 |
| `03_ddd_step_16_test_cut.md` | 已读取关键章节 | 提供详细设计级 module / protocol / state / consistency / error / config / observability 最小验证入口。 | 后续 Step 3 / Step 6 重点承接。 |
| `04-配置设计.md` | 已读取关键章节 | 提供 profile、source priority、validation、secret/redaction、adapter availability、failure/degradation 和 downstream handoff。 | 后续 Step 8~13 重点承接。 |
| 旧 `05-测试方案.md` | 已读取开头并诊断 | 识别旧 P0 MethodContent、publish、snapshot、outbox、PostgreSQL、gateway 等污染。 | historical material,不得作为当前测试真相源。 |
| L1-governance `05_test_plan_*` | 已读取 flow / Step 1 | 参考测试方案 flow、Step 1 表格深度和停审方式。 | framework reference only。 |

### 3. 输入基线

| 输入类别 | 正式来源 | Step 1 当前口径 |
|---|---|---|
| 需求输入 | `00-需求文档.md` | 承接 FR-ML、BR-ML、NFR-ML、数据归属、接口依赖和需求层验收方向;不重新定义需求语义。 |
| 架构输入 | `01-架构设计.md` | 承接职责边界、Definition vs Use、依赖方向、数据所有权、一致性和横切红线;不重新选择架构。 |
| 概要输入 | `02-概要设计.md` | 承接八组件、代码主体、关键对象、接口骨架、处理流、状态、异常和配置影响;不恢复旧概要主线。 |
| 详细设计输入 | `03-详细设计.md` | 承接对象、DTO、port、protocol、flow、state、transaction、error、idempotency、config、observability 和 test cut;不补设计缺口。 |
| 最小测试切口输入 | `03_ddd_step_16_test_cut.md` | 作为后续测试对象、测试切口和用例设计的直接输入;不等同完整测试方案。 |
| 配置测试输入 | `04-配置设计.md` | 承接 profile、config validation、secret/redaction、adapter availability、failure/degradation、downstream handoff;不新增 config key。 |
| 验收方向输入 | `00` §14 和旧 `06` 方向 | `05` 先定义 evidence 供给面,正式验收裁决后续由新版 `06` 完成。 |
| 框架参考输入 | L1-governance 05 flow / Step 文件 | 只参考结构、表格和停审深度,不复制领域事实。 |

### 4. 历史材料处理规则

| 历史材料 | 当前问题 | 处理规则 |
|---|---|---|
| 旧 `05-测试方案.md` | 仍以 P0 MethodContent、publish、snapshot、fingerprint、outbox relay、PostgreSQL、gateway header 等旧主线组织。 | 只用于污染诊断;不得继承旧章节、目标、范围、TC、EV、环境或证据路径。 |
| 旧 `06-验收标准.md` | 仍可能围绕旧 MethodContent 验收口径。 | 只作验收方向提醒;不得定义当前 acceptance gate、release veto、evidence threshold。 |
| 旧 `07-实施计划.md` | 旧 phase / commit / CI / implementation plan 可能与当前 `03/04` 不一致。 | 不作为测试执行顺序、自动化 gate、commit boundary 或 implementation ledger 来源。 |
| 旧 `03_ddd_step_16_test_cut.md` 的历史污染段 | 旧 MethodContent / P0 / snapshot / outbox 测试切口已在当前 Step 16 重启中隔离。 | 当前只承接本轮 Step 16 已重写后的最小验证入口。 |
| 旧 L3 对象名 / 状态名 / event 名 | 与当前 `03` 七实现单元和协议族不一致。 | 后续测试断言必须使用当前正式对象、字段、状态、协议和错误名。 |

### 5. SOP 五问初步回答

| SOP 问题 | 当前回答 | 后续处理 |
|---|---|---|
| 当前测试方案要承接哪些需求、规则和非功能目标? | 承接 `FR-ML-001~009`、`FR-ML-E-*`、`BR-ML-001~022`、`BR-ML-E-001`、`NFR-ML-001~016`、数据归属、接口依赖和需求 §14 验收方向。 | Step 2 转成测试目标 / 范围;Step 5 转成覆盖矩阵。 |
| 哪些概要 / 详细设计章节直接影响测试对象? | `02` 的八组件、代码主体、关键对象、接口骨架、处理流、状态、异常和配置影响;`03` 的七实现单元、对象、port、protocol、flow、state、persistence、error、idempotency、config、observability 和 test cuts。 | Step 3 抽取测试对象与切口;Step 6 设计用例矩阵。 |
| 哪些验收项需要测试方案提供证据? | 需求 §14 的核心能力、功能能力、规则边界、数据归属、接口依赖、非功能验收方向,以及 `03/04` 的 no raw body、no synthetic marker、query no-write、stored replay、config fail-fast、redaction safe-only 等红线。 | Step 5 映射 TC / EV 候选;Step 13 定义 evidence 归档;新版 `06` 裁决。 |
| 哪些内容不应在测试方案中重新定义? | 不重新定义需求、架构、对象字段、DTO、port、repository、flow、state、error、config key、adapter product、evidence artifact schema、acceptance gate、phase、commit boundary 或 implementation ledger。 | 写入 Step 1 不再回答清单;后续每 Step 复核。 |
| 当前上游是否存在会阻塞测试设计的缺口? | 不阻塞 Step 2。当前 `00~04` 与 `03_ddd_step_16_test_cut.md` 足够启动测试方案。旧 `05/06/07` 未重启是预期状态。 | 若后续 case/evidence 发现 schema/source 缺口,记录待确认并回 owning design source。 |

### 6. 当前文档问题诊断范围

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `05-测试方案.md` §1~§6 | 使用旧 P0 MethodContent 发布同步闭环、7 类 MethodContent、snapshot、fingerprint、outbox、PostgreSQL、gateway header 等口径。 | 标记为 historical material;Step 15 前不修改正式 `05`。 |
| 旧 `05-测试方案.md` TC / EV | 旧 TC / EV 编号与当前 `00~04`、`03` protocol family、Step 16 test cuts 不一致。 | 新版 TC / EV 后续在 Step 6 / Step 13 重新生成。 |
| 旧 `06-验收标准.md` | 可能继续消费旧测试方案 evidence 和旧 P0 验收口径。 | 当前只作方向输入;新版 `06` 必须等待新版 `05` 完成。 |
| 旧 `07-实施计划.md` | 可能包含旧 phase、commit、CI、evidence 或 implementation gate。 | 当前不读取为测试真相源;新版 `07` 等 `05/06` 完成后重启。 |
| 正式 `03/04` | 已提供测试切口和配置承接,但尚未形成完整测试方案、TC、fixture、evidence 和 CI gate。 | 正是 `05` Step 2~15 的工作范围。 |

### 7. R1.3 进入门禁

`R1.3 输入边界结构化中间产物:先思考` 只允许思考 Step 1 的结构化中间产物如何组织:

1. 思考上游输入映射表。
2. 思考不再回答的问题清单。
3. 思考测试方案必须回答的问题清单。
4. 思考对上游设计的影响判定。
5. 思考正式 `05` §1 回填草稿边界。
6. 禁止写正式 `05-测试方案.md`。
7. 禁止进入 Step 2 测试目标、范围和非范围。

### 8. R1.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入必读文档表与读取状态 | pass |
| 是否写入输入基线和历史材料处理规则 | pass |
| 是否写入 SOP 五问初步回答 | pass |
| 是否写入当前文档问题诊断范围 | pass |
| 是否写入 R1.3 进入门禁 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写测试目标 / 范围 / 切口 / 用例 / evidence / 验收 / 实施 | pass |

next_allowed_action: 等待用户确认后进入 Step 1 `R1.3 输入边界结构化中间产物:先思考`;只允许思考上游输入映射表、不再回答的问题清单、测试方案必须回答的问题清单、对上游设计的影响判定和正式 `05` §1 回填草稿边界;不得直接修改正式 `05-测试方案.md`;不得进入 Step 2;不得写测试目标、范围、对象、切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或 implementation code。

---

## R1.3 输入边界结构化中间产物:先思考

### 1. 当前模块目标

`R1.3` 只思考 Step 1 的结构化中间产物应如何组织,为 `R1.4` 写入做准备。当前模块不把候选表当作最终 Step 1 结论,不写正式 `05-测试方案.md`,不进入 Step 2 的测试目标、范围和非范围。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考上游输入映射表、不再回答的问题清单、测试方案必须回答的问题清单、对上游设计的影响判定、正式 `05` §1 回填草稿边界和 R1.4 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;进入 Step 2;写测试目标、范围、对象、切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或 implementation code。 |

### 2. 上游输入映射表思考

Step 1 的上游输入映射表应解决“哪些正式文档给测试方案提供什么输入”。它必须聚焦输入边界,不提前展开测试目标、切口或用例。

| 来源 | 应进入映射表的输入 | 当前思考 |
|---|---|---|
| `00-需求文档.md` | FR-ML、BR-ML、NFR-ML、数据归属、接口依赖、验收方向。 | 映射到正式 `05` §1 / §2 / §5 / §10 / §12 / §13,但 R1.4 只写输入用途,不写覆盖矩阵。 |
| `01-架构设计.md` | Definition vs Use、职责边界、依赖裁剪、数据所有权、一致性、横切红线。 | 映射到测试边界和后续非功能 / 红线输入,不重新裁定架构。 |
| `02-概要设计.md` | 八组件、代码主体、对象轮廓、接口骨架、处理流、状态、异常、配置影响。 | 映射到后续 Step 3 / Step 4 / Step 6 输入,但 R1.4 不抽测试对象。 |
| `03-详细设计.md` | 七实现单元、对象、port、protocol、flow、state、persistence、error、idempotency、config、observability、test cuts。 | 作为测试对象、断言和最小验证入口的直接来源。 |
| `03_ddd_step_16_test_cut.md` | module / protocol / state / consistency / error / config / observability 最小测试切口。 | 明确为 Step 3 / Step 6 直接输入,但不直接生成 TC。 |
| `04-配置设计.md` | profile、source priority、validation、secret/redaction、adapter availability、failure/degradation、downstream handoff。 | 映射到 Step 8~13 输入,但不在 Step 1 写具体配置测试。 |
| 旧 `05/06/07` | 污染诊断与方向提醒。 | 明确不是正式测试真相源,不得进入输入映射表的权威来源列。 |

### 3. 不再回答的问题清单思考

不再回答清单应把测试方案的边界锁住,防止后续 Step 用测试设计补需求、架构、详细设计或配置缺口。

| 问题类别 | R1.4 应写入的边界 |
|---|---|
| 需求与架构 | 不重新定义仓定位、目标、非目标、FR / BR / NFR、数据归属、职责边界、依赖方向或 Definition vs Use。 |
| 详细设计契约 | 不重新定义对象字段、DTO、port、mapper、repository、protocol shell、flow、state、transaction、error、idempotency 或 marker source。 |
| 配置契约 | 不新增 config key、default、profile、secret source、adapter product、topic、URL、reload / hot update 或 runtime builder 签名。 |
| 测试下游职责 | 不在 Step 1 定义 TC 编号、fixture、用例优先级、coverage、CI job、artifacts、reports 或 evidence schema。 |
| 验收与实施 | 不定义 acceptance gate、release veto、coverage threshold、phase、commit boundary、required_checks、implementation ledger 或 handoff gate。 |
| 旧材料 | 不继承旧 MethodContent、publish、snapshot、fingerprint、outbox、PostgreSQL、gateway、旧 TC / EV。 |

### 4. 测试方案必须回答的问题清单思考

必须回答清单应说明 `05` 后续 Step 要完成什么,但 R1.4 只写问题类别,不直接给出答案。

| 问题类别 | 后续文档落点 |
|---|---|
| 本轮测试证明什么 | Step 2 测试目标、范围和非范围。 |
| 测哪些对象和切口 | Step 3 测试对象与测试切口。 |
| 风险在哪一层发现 | Step 4 测试策略与分层。 |
| 需求、设计、用例、证据如何追溯 | Step 5 覆盖矩阵。 |
| 每个场景如何执行和断言 | Step 6 用例矩阵。 |
| 数据如何构造 | Step 7 测试数据。 |
| profile / config / adapter 如何进入测试 | Step 8 环境与配置矩阵。 |
| 哪些测试成为自动化和 CI/CD 门禁 | Step 9 自动化与 CI/CD 门禁。 |
| 非功能、错误恢复、红线如何验证 | Step 10 专项测试与非功能验证。 |
| 缺陷如何复验 | Step 11 缺陷管理与复验规则。 |
| 何时允许进入和退出测试 | Step 12 进入 / 退出准则。 |
| evidence 如何归档并交给验收 | Step 13 测试报告与证据归档。 |
| 回归和残余风险如何处理 | Step 14 回归策略与残余风险。 |

### 5. 对上游设计的影响判定思考

Step 1 当前判断不需要回写 `00~04`。但 R1.4 必须把“未来如果发现缺口如何处理”写清楚。

| 发现类型 | 是否影响上游 | 处理思考 |
|---|---|---|
| 旧 `05/06/07` 与当前 `00~04` 冲突 | 否 | 旧下游本来待重启,不回写上游。 |
| 当前输入足够启动 Step 2 | 否 | 记录为 pass,继续 Step 1 收口。 |
| 后续用例发现对象字段 / port / marker source 缺失 | 是 | 回 `03-详细设计.md` owning Step,测试方案不得补口。 |
| 后续配置测试发现 key / profile / secret source 缺失 | 是 | 回 `04-配置设计.md` owning Step;若涉及 runtime carrier,再回 `03`。 |
| 后续 evidence 无法支撑验收裁决 | 可能 | 先在 Step 13 标记,再交新版 `06-验收标准.md` 闭口。 |
| 后续实施需要 phase / commit / ledger | 否,属下游 | 交 `07-实施计划.md`,不得在 `05` Step 1 定义。 |

### 6. 正式 `05` §1 回填草稿边界思考

正式 §1 回填草稿应只说明测试方案承接哪些上游、如何使用、哪些不重新定义。它不能提前写测试目标或范围。

| 回填元素 | R1.4 可写 | R1.4 禁止 |
|---|---|---|
| 校准来源 | `design-calibration/05_test_plan_step_01_input_boundary.md`。 | 写泛化的 `design-calibration` 或 Step 1~15。 |
| 延伸阅读 | 引导读者读 SOP 问题回答、结构化中间产物、对上游设计的影响判定和待确认事项。 | 把问题回答全文搬入正式 §1。 |
| 上游关系声明 | `00~04` 和 `03_ddd_step_16_test_cut.md` 如何提供测试输入。 | 直接定义测试目标、范围、TC、EV。 |
| 旧材料声明 | 旧 `05/06/07` 只作 historical / old direction input。 | 继承旧 TC / EV 或旧测试对象。 |
| 边界声明 | 测试方案不补设计契约、不做验收裁决、不写实施计划。 | 定义 acceptance gate、CI、implementation boundary。 |

### 7. R1.4 写入边界思考

`R1.4 输入边界结构化中间产物:再写入` 应把本模块思考固化为 Step 1 的结构化中间产物,但仍不得完成整个 Step 1:

1. 写上游输入映射表。
2. 写不再回答的问题清单。
3. 写测试方案必须回答的问题清单。
4. 写对上游设计的影响判定。
5. 写正式 `05` §1 回填草稿边界。
6. 写 `R1.5 待确认事项与进入 Step 2 条件:先思考` 进入门禁。

### 8. R1.3 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考结构化中间产物组织 | pass |
| 是否形成上游输入映射表思考 | pass |
| 是否形成不再回答 / 必须回答问题清单思考 | pass |
| 是否形成对上游设计影响判定思考 | pass |
| 是否形成正式 §1 回填草稿边界思考 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未进入 Step 2 或写测试目标 / 范围 / 用例 / evidence / 验收 / 实施 | pass |

next_allowed_action: 等待用户确认后进入 Step 1 `R1.4 输入边界结构化中间产物:再写入`;只允许写入上游输入映射表、不再回答的问题清单、测试方案必须回答的问题清单、对上游设计的影响判定、正式 `05` §1 回填草稿边界和 `R1.5` 进入门禁;不得直接修改正式 `05-测试方案.md`;不得进入 Step 2;不得写测试目标、范围、对象、切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或 implementation code。

---

## R1.4 输入边界结构化中间产物:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R1.3` 推进到 `R1.4`。 |
| 本模块写入范围 | 上游输入映射表、不再回答的问题清单、测试方案必须回答的问题清单、对上游设计的影响判定、正式 `05` §1 回填草稿边界和 `R1.5` 进入门禁。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、Step 2 测试目标 / 范围、测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划和 implementation code。 |

### 2. 上游输入映射表

| 来源文档 | 测试输入 | 本 Step 用途 | 后续回填章节 |
|---|---|---|---|
| `00-需求文档.md` | FR-ML、BR-ML、NFR-ML、数据归属、接口依赖、需求 §14 验收方向。 | 固定测试方案要承接的需求、规则、非功能和验收方向。 | `05` §1 / §2 / §5 / §10 / §12 / §13 |
| `01-架构设计.md` | Definition vs Use、职责边界、依赖裁剪、数据所有权、一致性、外部正文禁入和横切红线。 | 固定测试边界、跨仓协作边界和红线输入。 | `05` §1 / §2 / §3 / §4 / §10 / §14 |
| `02-概要设计.md` | 八组件、代码主体框架、关键对象轮廓、接口骨架、处理流、状态、异常和配置影响。 | 作为后续测试对象、测试切口、分层策略和场景设计输入。 | `05` §1 / §3 / §4 / §6 / §8 |
| `03-详细设计.md` | 七实现单元、对象、port、protocol、flow、state、persistence、error、idempotency、config、observability 和 §15 test cuts。 | 作为测试对象、断言、错误预期、状态预期和最小验证入口的直接来源。 | `05` §1 / §3 / §4 / §6 / §7 / §9 / §10 / §11 |
| `03_ddd_step_16_test_cut.md` | module / protocol / state / consistency / error / config / observability 最小测试切口。 | 作为 Step 3 / Step 6 抽取测试切口和用例矩阵的直接输入。 | `05` §3 / §4 / §6 / §9 / §10 |
| `04-配置设计.md` | profile、source priority、validation、secret/redaction、adapter availability、failure/degradation 和 downstream handoff。 | 作为测试环境、配置矩阵、配置红线、失效降级和 evidence 承接输入。 | `05` §1 / §8 / §9 / §10 / §12 / §13 |
| 旧 `05-测试方案.md` | 旧 MethodContent / publish / snapshot / outbox / PostgreSQL / gateway 等污染线索。 | 只作历史诊断,不得作为当前测试 truth source。 | 不直接回填 |
| 旧 `06-验收标准.md` | 旧验收关注方向。 | 只作方向提醒,正式 acceptance gate 后续重启。 | `05` §12 / §13 / §14 的方向输入 |
| 旧 `07-实施计划.md` | 旧 phase / commit / CI / evidence 方向。 | 只作污染风险提醒,不得作为测试执行顺序或 gate 来源。 | 不直接回填 |

### 3. 不再回答的问题清单

| 问题类别 | Step 1 边界 |
|---|---|
| 需求与架构 | 不重新定义仓定位、目标、非目标、FR / BR / NFR、数据归属、职责边界、依赖方向、数据所有权或 Definition vs Use。 |
| 概要结构 | 不重新定义八组件、代码主体框架、主要处理流、状态主线、异常边界或配置影响轮廓。 |
| 详细设计契约 | 不重新定义对象字段、DTO、typed ref、port、mapper、repository、protocol shell、flow、state、transaction、error、idempotency、marker source 或 observability schema。 |
| 配置契约 | 不新增 config key、default、profile、secret source、adapter product、topic、URL、reload / hot update、runtime builder 签名或 deployment command。 |
| 测试方案后续职责 | 不在 Step 1 定义测试目标、范围、测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁或 evidence schema。 |
| 验收与实施 | 不定义 acceptance gate、release veto、coverage threshold、phase、commit boundary、required_checks、implementation ledger 或 handoff gate。 |
| 旧材料 | 不继承旧 MethodContent、publish、snapshot、fingerprint、outbox、PostgreSQL、gateway、旧 TC / EV、旧 P0 / P1 阶段语言。 |

### 4. 测试方案必须回答的问题清单

| 必须回答的问题 | 后续落点 |
|---|---|
| 本轮测试要证明什么、覆盖什么、不覆盖什么。 | Step 2;正式 `05` §2 |
| 哪些模块、对象、协议、状态、事务、一致性、错误、配置和观测红线必须测试。 | Step 3;正式 `05` §3 |
| 每类风险应该在哪个测试层级发现。 | Step 4;正式 `05` §4 |
| FR / BR / NFR、设计契约、测试场景、用例和证据如何追溯。 | Step 5;正式 `05` §5 |
| 每个正向、负向、边界、异常、并发、恢复场景如何执行和断言。 | Step 6;正式 `05` §6 |
| 测试数据如何构造,哪些数据必须 body-free、safe ref、redacted 或 deterministic。 | Step 7;正式 `05` §7 |
| local / CI / integration-like / operations-replay 等 profile 如何进入测试环境和配置矩阵。 | Step 8;正式 `05` §8 |
| 哪些测试进入自动化、CI/CD、nightly、operations replay 或 release precheck。 | Step 9;正式 `05` §9 |
| 性能、可用性、安全、追溯、一致性、可观测性和红线如何专项验证。 | Step 10;正式 `05` §10 |
| 缺陷如何分级、修复后如何复验、何时允许风险接受。 | Step 11;正式 `05` §11 |
| 测试进入准则和退出准则是什么。 | Step 12;正式 `05` §12 |
| 测试报告、run artifacts、human-readable reports 和 acceptance handoff 如何归档。 | Step 13;正式 `05` §13 |
| 回归触发、最小回归、全量回归和残余风险如何处理。 | Step 14;正式 `05` §14 |
| 正式 `05-测试方案.md` 如何由 Step 1~14 装配。 | Step 15;正式 `05` 全文 |

### 5. 对上游设计的影响判定

| 测试输入结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 旧 `05/06/07` 不能作为当前测试 truth source | 否 | 下游文档权威级别 | 无需回写 `00~04`;旧材料隔离。 |
| 当前 `00~04` 与 `03_ddd_step_16_test_cut.md` 足够启动 Step 2 | 否 | 测试 SOP 进入条件 | 无需回写。 |
| 后续若测试切口发现对象字段、DTO、port、mapper、state、marker source 或 error 缺失 | 是 | 详细设计可落码性缺口 | 回 `03-详细设计.md` owning Step,不得由 `05` 补口。 |
| 后续若配置测试发现 config key、profile、secret source、adapter availability 或 failure strategy 缺失 | 是 | 配置设计闭口缺口 | 回 `04-配置设计.md`;若涉及 runtime carrier / port / DTO,再回 `03`。 |
| 后续若 evidence 无法支撑需求 §14 或新版 `06` 裁决 | 可能 | 测试 / 验收证据闭环缺口 | 在 Step 13 标记并交 `06-验收标准.md` 闭口。 |
| 后续若实现需要 phase、commit、required_checks、implementation ledger 或 boundary gate | 否 | 实施计划职责 | 交 `07-实施计划.md`,不得在 `05` Step 1 定义。 |

### 6. 正式 `05` §1 回填草稿边界

> 校准来源:
> - `design-calibration/05_test_plan_step_01_input_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 五问初步回答”“上游输入映射表”“不再回答的问题清单”“测试方案必须回答的问题清单”和“对上游设计的影响判定”小节,了解测试方案输入边界如何从当前 `00/01/02/03/04` 收敛。

正式 `05-测试方案.md` §1 后续只应回填以下边界:

- 本测试方案承接当前 full-restart 后的 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md` 和 `04-配置设计.md`。
- `03-详细设计.md` 与 `03_ddd_step_16_test_cut.md` 是测试对象、测试切口和用例断言的直接来源。
- `04-配置设计.md` 是 profile、配置校验、敏感配置、adapter availability、失效降级和配置门禁测试的直接来源。
- 旧 `05-测试方案.md`、旧 `06-验收标准.md` 和旧 `07-实施计划.md` 只作为 historical / old direction input,不得覆盖当前 `00~04`。
- 测试方案不重新定义需求、架构、对象、DTO、port、state、flow、config、验收裁决或实施边界;只定义如何验证这些正式契约。
- 当前没有阻塞进入 Step 2 的输入缺口。

### 7. R1.5 进入门禁

`R1.5 待确认事项与进入 Step 2 条件:先思考` 只允许思考 Step 1 的待确认事项、进入 Step 2 条件、Step 1 完成条件和 R1.6 写入边界:

1. 思考是否存在阻塞 Step 2 的输入缺口。
2. 思考旧 `05/06/07` 后续处理提醒。
3. 思考 Step 1 是否需要正式 §1 回填草稿之外的待确认事项。
4. 思考进入 Step 2 的门禁。
5. 禁止修改正式 `05-测试方案.md`。
6. 禁止进入 Step 2 的测试目标、范围和非范围正文。

### 8. R1.4 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入上游输入映射表 | pass |
| 是否写入不再回答的问题清单 | pass |
| 是否写入测试方案必须回答的问题清单 | pass |
| 是否写入对上游设计的影响判定 | pass |
| 是否写入正式 `05` §1 回填草稿边界 | pass |
| 是否写入 R1.5 进入门禁 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未进入 Step 2 或写测试目标 / 范围 / 用例 / evidence / 验收 / 实施 | pass |

next_allowed_action: 等待用户确认后进入 Step 1 `R1.5 待确认事项与进入 Step 2 条件:先思考`;只允许思考待确认事项、进入 Step 2 条件、Step 1 完成条件和 R1.6 写入边界;不得直接修改正式 `05-测试方案.md`;不得进入 Step 2;不得写测试目标、范围、对象、切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或 implementation code。

---

## R1.5 待确认事项与进入 Step 2 条件:先思考

### 1. 当前模块目标

`R1.5` 只思考 Step 1 收尾所需的待确认事项、进入 Step 2 条件、Step 1 完成条件和 `R1.6` 写入边界。当前模块不写最终 Step 1 完成结论,不修改正式 `05-测试方案.md`,不进入 Step 2 的测试目标、范围和非范围。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考待确认事项、是否存在 Step 2 blocker、Step 1 完成条件、R1.6 写入边界和 Step 2 入口门禁。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;进入 Step 2;写测试目标、范围、对象、切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或 implementation code。 |

### 2. 待确认事项思考

当前 Step 1 的输入边界已经足够进入 Step 2,但仍需要把下列事项作为后续文档提醒写入 R1.6。

| 待确认事项 | 是否阻塞 Step 2 | 当前思考 |
|---|---|---|
| 旧 `05-测试方案.md` 尚未重建 | 否 | 当前就是 05 full-restart;旧正式 05 在 Step 15 前不改。 |
| 新版 `06-验收标准.md` 尚未重启 | 否 | `05` 先定义 evidence 供给面,后续 `06` 做裁决。 |
| 新版 `07-实施计划.md` 尚未重启 | 否 | `05` 不定义 phase / commit / implementation ledger;后续 `07` 承接。 |
| 产品 / adapter / durable store 未全部锁定 | 否 | 测试方案可先按 fake / controlled / unavailable / product-neutral seam 设计;具体产品后移。 |
| Step 6 / Step 13 未来可能发现 evidence schema 或 assertion 字段缺口 | 否,当前未发生 | 若发生,必须回 owning design source 或在 Step 13 明确 schema,不得实现侧补口。 |
| 旧 TC / EV 编号作废 | 否 | 新版编号后续重新生成,不阻塞 Step 2。 |

### 3. 进入 Step 2 条件思考

Step 2 只需要确认输入边界清楚、上游真相源足够、旧材料隔离清楚、测试方案不补设计缺口。当前判断均可满足。

| 条件 | 思考结论 |
|---|---|
| 输入文档清单明确 | 已明确 `00/01/02/03/04`、`03_ddd_step_16_test_cut.md` 和测试 SOP / 书写规范。 |
| 权威顺序明确 | 当前 `00~04` 为正式 truth source;旧 `05/06/07` 只作 historical / old direction input。 |
| 测试方案边界明确 | 不重新定义需求、架构、详细设计、配置、验收裁决或实施计划。 |
| 上游阻塞缺口已判断 | 当前无阻塞 Step 2 的输入缺口。 |
| Step 2 目标可启动 | 可以开始明确测试目标、范围和非范围。 |

### 4. Step 1 完成条件思考

R1.6 应把 Step 1 完成条件写成可审查门禁。建议至少包含:

1. 输入映射表已完成。
2. 不再回答的问题清单已完成。
3. 测试方案必须回答的问题清单已完成。
4. 对上游设计影响判定已完成。
5. 待确认事项已分类,且无阻塞 Step 2 的 blocker。
6. 正式 `05` §1 回填草稿边界已形成,但正式 `05` 未修改。
7. Flow 和项目台账可以推进到 Step 2 `R2.1` 等待确认。

### 5. R1.6 写入边界思考

`R1.6 待确认事项与进入 Step 2 条件:再写入` 应完成 Step 1 收尾,但仍不得写正式 `05` 或进入 Step 2 正文:

1. 写待确认事项表。
2. 写进入 Step 2 条件表。
3. 写 Step 1 完成条件表。
4. 写 Step 1 stop-review。
5. 更新当前 Step 文件的顶部状态为 Step 1 completed_wait_user_confirm_to_R2.1。
6. 同步 `05_test_plan_calibration_flow.md` 和 `project_execution_ledger.md` 到 Step 2 `R2.1` 等待确认。

### 6. R1.5 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 Step 1 待确认事项与进入 Step 2 条件 | pass |
| 是否判断当前无阻塞 Step 2 的输入缺口 | pass |
| 是否形成 Step 1 完成条件思考 | pass |
| 是否形成 R1.6 写入边界 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未进入 Step 2 或写测试目标 / 范围 / 用例 / evidence / 验收 / 实施 | pass |

next_allowed_action: 等待用户确认后进入 Step 1 `R1.6 待确认事项与进入 Step 2 条件:再写入`;只允许写入待确认事项表、进入 Step 2 条件表、Step 1 完成条件表、Step 1 stop-review,并同步 flow / project ledger 到 Step 2 `R2.1` 等待确认;不得直接修改正式 `05-测试方案.md`;不得写 Step 2 测试目标、范围、非范围正文;不得写用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或 implementation code。

---

## R1.6 待确认事项与进入 Step 2 条件:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R2.1 |
| 用户确认 | 已确认从 `R1.5` 推进到 `R1.6`。 |
| 本模块写入范围 | 待确认事项表、进入 Step 2 条件表、Step 1 完成条件表、Step 1 stop-review,并同步 flow / project ledger 到 Step 2 `R2.1` 等待确认。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、Step 2 测试目标 / 范围 / 非范围正文、测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划和 implementation code。 |

### 2. 待确认事项表

| 待确认事项 | 是否阻塞 Step 2 | 当前处理 |
|---|---|---|
| 旧 `05-测试方案.md` 尚未重建 | 否 | 本轮 05 full-restart 正在进行;旧正式 05 在 Step 15 前保持 historical material。 |
| 新版 `06-验收标准.md` 尚未重启 | 否 | `05` 先定义测试场景、证据供给和报告归档;新版 `06` 后续裁决验收门禁。 |
| 新版 `07-实施计划.md` 尚未重启 | 否 | `05` 不定义 phase、commit、required_checks、implementation ledger 或 boundary gate;后续由 `07` 承接。 |
| 产品 / adapter / durable store 未全部锁定 | 否 | 后续测试方案按 fake / controlled / unavailable / product-neutral seam 设计;具体产品选择不阻塞 Step 2。 |
| 后续 Step 6 / Step 13 可能发现 evidence schema 或 assertion 字段缺口 | 否,当前未发生 | 若发生,必须回 owning design source 或在 Step 13 正式闭口,不得由实现侧补口。 |
| 旧 TC / EV 编号作废 | 否 | 新版 TC / EV 后续在 Step 6 / Step 13 重新生成。 |

### 3. 进入 Step 2 条件表

| 条件 | 状态 | 说明 |
|---|---|---|
| 输入文档清单明确 | pass | `00/01/02/03/04`、`03_ddd_step_16_test_cut.md`、测试 SOP / 书写规范和中间产物规范均已列入输入边界。 |
| 权威顺序明确 | pass | 当前 `00~04` 为正式 truth source;旧 `05/06/07` 只作 historical / old direction input。 |
| 测试方案边界明确 | pass | `05` 不重新定义需求、架构、详细设计、配置、验收裁决或实施计划。 |
| 上游阻塞缺口已判断 | pass | 当前无阻塞 Step 2 的输入缺口。 |
| 旧材料处理明确 | pass | 旧 MethodContent / publish / snapshot / outbox / PostgreSQL / gateway / TC / EV 均不得作为当前测试真相源。 |
| Step 2 可启动 | pass | 可进入测试目标、范围和非范围讨论。 |

### 4. Step 1 完成条件表

| 完成条件 | 状态 | 证据位置 |
|---|---|---|
| 已创建 `05_test_plan_calibration_flow.md` | pass | `design-calibration/05_test_plan_calibration_flow.md` |
| 已完成 Step 1 必读文档表与读取状态 | pass | 本文件 `R1.2` |
| 已完成输入基线和历史材料处理规则 | pass | 本文件 `R1.2` |
| 已完成 SOP 五问初步回答 | pass | 本文件 `R1.2` |
| 已完成上游输入映射表 | pass | 本文件 `R1.4` |
| 已完成不再回答的问题清单 | pass | 本文件 `R1.4` |
| 已完成测试方案必须回答的问题清单 | pass | 本文件 `R1.4` |
| 已完成对上游设计的影响判定 | pass | 本文件 `R1.4` |
| 已形成正式 `05` §1 回填草稿边界 | pass | 本文件 `R1.4` |
| 已完成待确认事项和进入 Step 2 条件 | pass | 本文件 `R1.6` |
| 正式 `05-测试方案.md` 未修改 | pass | git diff 检查 |
| 可推进到 Step 2 `R2.1` | pass | flow / project ledger 同步后生效 |

### 5. Step 1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否确认 `00/01/02/03/04` 为当前测试方案正式输入 | pass |
| 是否确认旧 `05/06/07` 不作为当前测试真相源 | pass |
| 是否完成上游输入映射、不再回答、必须回答、影响判定和回填草稿边界 | pass |
| 是否判断当前无阻塞 Step 2 的输入缺口 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写 Step 2 测试目标、范围或非范围正文 | pass |
| 是否未写用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或 implementation code | pass |

Step 1 conclusion: completed_wait_user_confirm_to_R2.1。

next_allowed_action: 等待用户确认后进入 Step 2 `R2.1 开工与必读文档:先思考`;只允许思考 Step 2 的开工边界、必读文档、Step 1 handoff、L1-governance Step 2 框架参考、旧材料隔离、测试目标 / 范围 / 非范围分批计划和 R2.2 写入边界;不得直接修改正式 `05-测试方案.md`;不得写 Step 2 正式结构化结论、完整测试目标表、范围 / 非范围表、测试对象、测试切口、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或 implementation code。
