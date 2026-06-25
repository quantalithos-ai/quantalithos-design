# Step 1. 确认配置输入边界

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 1
> 书写规范: `standards/document/配置设计书写规范.md`
> 回填章节: `04-配置设计.md` §1 与上游文档的关系声明
> 创建日期: 2026-06-24
> 当前状态: `R1.8 Step 1 输出边界与 Step 2 入口:再写入` completed_wait_user_confirm_to_step2
> 当前门禁: 等待确认进入 Step 2 `R2.1 开工与必读文档:先思考`

---

## 0. Step 1 边界

Step 1 只确认 L3-method-library 配置设计依赖的需求、架构、概要、详细设计和下游方向输入是否足够,并明确哪些配置线索可以作为正式配置设计输入。

当前 Step 不定义配置项清单、默认值、环境矩阵、secret 存储方式、加载函数、校验规则、热更新策略、部署命令、产品选型、测试用例、验收门禁、实施 phase / commit boundary 或代码。

---

## R1.1 开工与必读文档:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认 `03-详细设计.md` Step 19 completed,进入 `04-配置设计.md` full-restart 开工。 |
| 本模块目标 | 思考 04 full-restart 的开工边界、必读文档、旧材料隔离、Step 1 输入边界和 R1.2 写入计划。 |
| 本模块允许范围 | 创建 04 flow 和 Step 1 开工记录;读取 `00/01/02/03`、配置 SOP / 书写规范 / 中间产物规范 / 可落码性标准、L1-governance 04 框架参考。 |
| 本模块禁止范围 | 不创建正式 `04-配置设计.md`;不写配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划、phase / commit boundary、implementation ledger、CI command、acceptance gate 或 implementation code。 |

### 2. 开工边界思考

| 边界项 | R1.1 裁决 |
|---|---|
| 04 定位 | 配置控制面设计,连接详细设计、环境差异、测试矩阵、验收门禁、实施计划和运维落地。 |
| 正式文档状态 | `04-配置设计.md` 当前不存在;本轮必须先生成 calibration flow 和 Step 中间产物,正式 04 留到 Step 15 装配。 |
| 直接输入 | 当前 formal `00/01/02/03`,尤其 `03` §13 config binding、§16 handoff、§17 risk/open questions。 |
| 旧下游文档 | `05/06/07` 是旧 / 待重启方向输入,不得覆盖当前 `03` 或定义配置真相源。 |
| 无配置路径 | 当前 `02` §11 和 `03` §13 显示存在多个配置影响点,但是否进入完整配置项展开由 Step 2 正式判定。 |
| 反向校准 | 04 若发现需要改变 runtime config、builder、adapter constructor、trait / port、error、flow 或 DTO,必须回写 03 或阻塞待确认。 |
| 下游边界 | 04 不替代 05/06/07/09,不写测试用例、验收阈值、实施 boundary、部署命令或 runbook。 |

### 3. 必读文档思考

| 文档 | 读取用途 | R1.2 用法 |
|---|---|---|
| `project_execution_ledger.md` | 确认 03 completed、04 waiting_user_confirm_to_start_04。 | 作为项目级恢复点来源。 |
| `03_ddd_calibration_flow.md` | 确认 03 Step 19 completed、04 开工门禁。 | 作为文档切换依据。 |
| `配置设计讨论流程_SOP.md` | 固定 Step 1~15 顺序、Step 1 问题和无配置路径。 | 写入 04 flow 和 Step 1 模块计划。 |
| `配置设计书写规范.md` | 固定 15 章主链、校准来源、无配置说明规则和配置项表最小列。 | 作为后续正式 04 装配边界。 |
| `设计文档讨论中间产物规范.md` | 固定三层台账、写入前检查、先思考后写入、回填门禁。 | 约束 R1.1 -> R1.2。 |
| `设计真相源闭环与可落码性标准.md` | 防止配置补 schema / port / mapper / evidence / phase。 | 作为影响 03 判定和 blocker 规则。 |
| `00-需求文档.md` | 提取配置相关需求、非功能、安全、依赖与验收红线。 | Step 1 输入映射来源。 |
| `01-架构设计.md` | 提取架构红线、依赖裁剪、外部协作和横切关注点。 | Step 1 输入映射来源。 |
| `02-概要设计.md` §11 | 提取配置影响轮廓和禁止配置化边界。 | Step 1 / Step 2 的配置输入来源。 |
| `03-详细设计.md` §13 / §16 / §17 | 提取 config binding、runtime builder、adapter availability、downstream owner、风险和待确认事项。 | Step 1 直接输入。 |
| `03_ddd_step_14_config_dependencies.md` | 字段级配置绑定来源。 | 后续 Step 3~11 追溯来源。 |
| `05-测试方案.md` / `06-验收标准.md` / `07-实施计划.md` | 旧 / 待重启方向输入。 | 标记为不能覆盖当前 `03/04`。 |
| L1-governance 04 flow / Step 1 | 框架深度参考。 | 只参考结构,不复制配置项。 |

### 4. 初始输入边界思考

| 输入族 | 初始判断 | 后续处理 |
|---|---|---|
| runtime profile / assembly | `03` §13 定义 runtime profile、feature slot、entry readiness。 | Step 2 判断范围;Step 3 建控制面。 |
| storage / repository adapter | `03` §13 定义 fake/durable store choice、pool/connection handle 由 04 闭口。 | Step 3 / 7 定义配置域和配置项。 |
| source / resolver adapter | `03` §13 定义 resolver adapter safe outcome。 | Step 3 / 7 / 11 继续。 |
| inbound consumer binding | `02` §11 与 `03` §13 显示受 source profile、transport、schema / version、dedup 影响。 | Step 3 / 5 / 7 继续。 |
| publisher / handoff target | `03` §13 定义 publisher binding、handoff binding、target registry。 | Step 3 / 7 / 11 继续。 |
| query / read material | `02` §11 与 `03` §13 显示 page/body limit、freshness threshold、availability source binding。 | Step 3 / 7 / 9 / 11 继续。 |
| replay / retry / job parameters | `03` §13 定义 retention TTL、retry numeric policy、lease duration、job runner slot。 | Step 3 / 7 / 9 / 11 继续。 |
| observability / redaction | `03` §13~§15 定义 safe binding diagnostic、redacted config issue 和 body-free redline。 | Step 8 / 9 / 12 继续。 |
| durable product choices | `03` §17 标记 durable store、broker、metrics、DLQ、真实 adapter 未选型。 | 进入风险 / 待确认或 product-neutral 配置口径。 |

### 5. 旧材料隔离思考

| 材料 | 裁决 |
|---|---|
| `04-配置设计.md` | 当前不存在,不得假设历史配置结论。 |
| 旧 `05-测试方案.md` | 含旧 MethodContent / publish / snapshot / outbox 主线,只能作方向输入。 |
| 旧 `06-验收标准.md` | 含旧 P0 MethodContent 验收口径,只能作方向输入。 |
| 旧 `07-实施计划.md` | 不作为 phase / commit / config key 真相源。 |
| L1-governance 04 | 只参考 flow / 表格 / 门禁深度。 |

### 6. R1.2 写入计划思考

`R1.2 开工与必读文档:再写入` 应把本模块思考落成可恢复记录:

1. 写 Step 1 的正式状态表和输入基线。
2. 写必读文档读取清单。
3. 写配置输入边界和旧材料隔离规则。
4. 写 Step 1 目标、允许 / 禁止范围。
5. 写“对 03 的影响判定”框架。
6. 写 `R1.3 SOP 问题回答与输入映射:先思考` 进入门禁。
7. 不创建正式 `04-配置设计.md`,不写配置项清单或 JSON demo。

### 7. R1.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否确认项目级台账允许进入 04 | pass |
| 是否读取配置 SOP / 书写规范 / 中间产物规范 | pass |
| 是否确认正式 `04-配置设计.md` 当前不存在 | pass |
| 是否确认正式 `03-详细设计.md` completed | pass |
| 是否形成 04 flow 和 Step 1 开工边界 | pass |
| 是否形成 R1.2 写入计划 | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写配置项、JSON demo、secret schema、测试 / 验收 / 实施或代码 | pass |

next_allowed_action: 等待用户确认后进入 Step 1 `R1.2 开工与必读文档:再写入`;只允许把 R1.1 思考落成 Step 1 的开工记录、输入文档清单、边界规则、影响判定框架和 R1.3 进入门禁;不得直接写正式 `04-配置设计.md`、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。

---

## R1.2 开工与必读文档:再写入

### 1. 当前模块目标

`R1.2` 将 `R1.1` 的开工思考落成可恢复记录。当前模块只固定 Step 1 的状态、输入基线、必读文档清单、配置输入边界、旧材料隔离规则、对 `03-详细设计.md` 的影响判定框架和 `R1.3` 进入门禁。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块允许 | 写入 Step 1 开工记录、输入文档清单、边界规则、影响判定框架和下一模块门禁。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划、部署命令、phase / commit boundary 或代码。 |
| 当前恢复依据 | 项目台账指向 `04-配置设计.md` Step 1 `R1.1` 已完成,用户已确认继续。 |

### 2. Step 1 输入基线

| 输入族 | 当前定位 | Step 1 用法 | 禁止用法 |
|---|---|---|---|
| `00-需求文档.md` | 正式上游 | 提供仓定位、非功能、安全、依赖裁剪、数据边界和验收红线。 | 不重新定义需求目标或验收标准。 |
| `01-架构设计.md` | 正式上游 | 提供架构边界、依赖方向、外部协作、数据所有权和横切关注点。 | 不通过配置绕过架构不变量。 |
| `02-概要设计.md` | 正式上游 | 提供八个主要组成部分、处理流、状态、异常和配置影响轮廓。 | 不把旧概要外的对象或流程塞回配置设计。 |
| `03-详细设计.md` | 直接输入 | 提供 §13 config binding、runtime builder、adapter availability、§16 handoff 和 §17 downstream pending。 | 不在 04 中静默补 struct、enum、trait、DTO、flow、state、mapper、port 或 evidence schema。 |
| `03_ddd_step_14_config_dependencies.md` | 解释性直接输入 | 提供配置引用与外部依赖绑定的字段级讨论来源。 | 若与正式 `03` 冲突,以正式 `03` 为准并记录待确认。 |
| 旧 `05/06/07` | old_direction_input | 只识别测试环境、验收环境、实施承接方向。 | 不反向定义配置项、默认值、TC、AC、phase 或 commit boundary。 |
| L1-governance 04 | framework_reference | 只参考配置设计 flow、表格深度、门禁表达和分批纪律。 | 不复制 governance 领域事实、配置项或产品选择。 |

### 3. 必读文档清单

| 必读文档 | 读取状态 | 本 Step 用途 |
|---|---|---|
| `projects/L3-method-library/design-calibration/project_execution_ledger.md` | pass | 确认当前文档、当前 Step、当前模块和单模块推进规则。 |
| `projects/L3-method-library/design-calibration/04_config_calibration_flow.md` | pass | 确认 04 full-restart 当前状态、Step 表和 next_allowed_action。 |
| `projects/L3-method-library/design-calibration/04_config_step_01_upstream_boundary.md` | pass | 承接 R1.1 思考并写入 R1.2。 |
| `standards/document/配置设计讨论流程_SOP.md` | pass | 固定 Step 1 目标、输入、输出、应问问题和进入下一步条件。 |
| `standards/document/配置设计书写规范.md` | pass | 固定正式 04 主链、上游/下游边界、无配置说明和校准来源规则。 |
| `standards/document/设计文档讨论中间产物规范.md` | pass | 固定三层台账、上下文恢复、先思考后写入和分批写作纪律。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | required_for_next | R1.3 起用于判断 config / schema / port / evidence 缺口是否必须暂停。 |
| `projects/L3-method-library/00-需求文档.md` | required_for_next | R1.3 起抽取配置相关需求、非功能、安全和依赖边界。 |
| `projects/L3-method-library/01-架构设计.md` | required_for_next | R1.3 起抽取配置相关架构边界和外部协作红线。 |
| `projects/L3-method-library/02-概要设计.md` | required_for_next | R1.3 起抽取配置影响轮廓和禁止配置化候选。 |
| `projects/L3-method-library/03-详细设计.md` | pass | 当前已读取 §13、§16、§17 的配置 / handoff / risk 入口。 |

### 4. 配置输入边界

| 配置输入族 | 可进入 Step 1 的内容 | 留给后续 Step |
|---|---|---|
| runtime assembly | runtime profile、feature slot、entry readiness、validated slot、runtime availability。 | Step 3 控制面、Step 7 配置项、Step 9 加载校验。 |
| adapter / external dependency | storage/source/resolver/publisher/handoff/target registry 的 binding 和 availability。 | Step 4 分类边界、Step 5 来源优先级、Step 11 失效策略。 |
| query / read policy handle | page/body limit、freshness threshold、availability source binding。 | Step 7 配置项和 Step 11 degraded / fail-fast。 |
| replay / retry / job parameter | retention TTL、retry numeric policy、lease duration、job runner slot。 | Step 6 profile 矩阵、Step 7 配置项、Step 10 变更审计。 |
| diagnostics / redaction | safe config issue、adapter availability marker、runtime unavailable marker。 | Step 8 sensitive / secret、Step 12 downstream handoff。 |
| production product choice | durable store、broker、metrics、DLQ、真实 adapter 选择。 | Step 14 风险 / 待确认或后续运维 / adapter owner。 |

### 5. 不再由 Step 1 回答的问题

| 问题 | 去向 |
|---|---|
| 具体 config key、env var、JSON 字段、默认值和 profile merge order 是什么 | Step 7 / Step 5 / Step 6。 |
| secret source、credential、TLS、endpoint、topic、URL 如何命名和保存 | Step 8 / Step 7。 |
| 配置如何加载、校验、热更新、冷更新和生效 | Step 9。 |
| 配置变更如何审计、回滚和留痕 | Step 10。 |
| 配置缺失、错误、不可达、漂移时如何失效 | Step 11。 |
| 哪些测试用例、验收门禁、实施 phase 或 commit boundary 覆盖配置 | Step 12 只做承接;正式闭口交 05/06/07。 |

### 6. 对 03 的影响判定框架

| 配置结论类型 | 是否影响 `03-详细设计.md` | 处理状态规则 |
|---|---|---|
| 只明确来源、优先级、profile、默认值、敏感级别、失效策略 | 通常不影响 03 | 记录为 `无回写`。 |
| 改变 runtime config、runtime builder、adapter constructor、entry precheck 或 port bundle | 影响 03 | 记录为 `待回写` 或 `阻塞待确认`。 |
| 改变 trait / port、DTO、public surface、state transition、transaction boundary、marker source、stored replay 或 body-free rule | 影响 03 且越过 04 权限 | 必须暂停,回 owning Step / 正式 03 闭口。 |
| 发现 `03` 只说交给 `04` 但没有正式 carrier / source / mapper | 影响 03 | 不用配置补口;记录 blocker。 |

固定记录格式:

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 待 R1.3 起逐项填写 | 待判定 | 待判定 | 待判定 | 待判定 |

### 7. R1.3 进入门禁

`R1.3 SOP 问题回答与输入映射:先思考` 只能在以下条件满足后进入:

| 门禁项 | 结果 |
|---|---|
| 已确认 Step 1 当前只做输入边界,不写正式 04 正文 | pass |
| 已固定必读文档清单和旧材料隔离规则 | pass |
| 已固定配置输入族和后续 Step 去向 | pass |
| 已固定对 03 的影响判定框架 | pass |
| 已确认不写配置项清单、JSON demo、secret schema、测试 / 验收 / 实施或代码 | pass |

### 8. R1.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按项目台账和 flow 恢复当前模块 | pass |
| 是否只推进一个模块 | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未提前写配置项、默认值、secret、JSON demo、测试、验收、实施或代码 | pass |
| 是否将 `R1.1` 思考落成可恢复记录 | pass |
| 是否形成 `R1.3` 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 1 `R1.3 SOP 问题回答与输入映射:先思考`;只允许围绕配置 SOP Step 1 的 5 个问题建立上游输入映射、配置设计必须回答的问题清单、不再回答的问题清单和初步缺口判断;不得直接写正式 `04-配置设计.md`、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。

---

## R1.3 SOP 问题回答与输入映射:先思考

### 1. 当前模块目标

`R1.3` 只思考配置 SOP Step 1 的五个问题如何落成输入映射。当前模块不写正式 `04-配置设计.md`,不定义配置项、key、默认值、profile merge、secret 来源、endpoint、topic、测试用例、验收门禁或实施边界。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块允许 | 围绕 SOP 五问形成候选回答、候选输入映射、必须回答 / 不再回答的问题清单、初步缺口判断和 R1.4 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不把候选配置域写成正式配置项;不写 JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |
| 框架参考 | 已补读 L1-governance 04 flow 和 Step 1;只采用其“输入 -> SOP 五问 -> 映射 -> 影响判定 -> 下一步门禁”结构,不复制 governance 配置事实。 |

### 2. SOP 五问候选回答思考

| SOP 问题 | 候选回答方向 | R1.4 写入策略 |
|---|---|---|
| 当前配置设计要承接哪些需求、非功能、安全和环境差异? | 承接方法资产定义 truth、Definition vs Use、下游按边界消费、外围增强不阻塞核心闭环、外部正文禁止入仓、追溯 / 审计 / 可观测和配置变更不得绕过核心边界。环境差异先只落为“需要后续 Step 6 定义 profile / 矩阵”,不得提前命名环境。 | 写成“需求 / 架构输入映射”,不写具体环境名和配置项。 |
| 详细设计中哪些配置引用、runtime builder、adapter 或外部依赖需要进入配置设计? | 直接承接 `03` §13 的 runtime assembly、storage/source/publisher/handoff adapter、target registry、query/read policy、replay/retry/job handles、diagnostics;承接 §16 对 `04` 的下游 ownership。 | 写成“详细设计配置入口候选表”,每项只到 binding family / downstream owner。 |
| 哪些测试和验收场景依赖配置矩阵? | 需求 §14 和详细设计 §15 指向核心查询 / 消费、fake/durable parity、config validation、adapter availability、no raw body/no secret/redaction 等测试验收方向;旧 `05/06` 只能作为方向输入。 | 写“测试 / 验收方向输入”,不定义 TC、AC、coverage、evidence schema。 |
| 哪些内容不应在配置设计中重新定义? | 不重新定义 00 需求目标、01 架构边界、02 主要组成 / 状态 / 异常红线、03 object / trait / port / DTO / flow / state / transaction / idempotency / marker source。 | 写“不再回答的问题清单”,并回指对应上游。 |
| 当前上游是否存在会阻塞配置设计的缺口? | 当前无阻塞 Step 1 / Step 2 的输入缺口;但生产 durable store、broker、metrics、DLQ、真实 adapter、profile/key/secret/product 选择仍是后续 `04` 待收敛或待确认项。若后续发现需新增 carrier / port / mapper / schema,必须回 03。 | 写“初步缺口判断”,区分不阻塞 Step 2 与后续风险。 |

### 3. 候选上游输入映射思考

| 来源 | 可作为 04 输入的候选 | 不得推导出的内容 |
|---|---|---|
| `00-需求文档.md` | 依赖裁剪、NFR、安全、可用性、审计 / 追溯、验收方向、外部正文和下游运行 truth 排除。 | 不推导 config key、runtime config struct、测试 case、产品选型。 |
| `01-架构设计.md` | 系统上下文、部署承载角色、依赖方向、数据所有权、横切配置与变更控制、外围增强隔离。 | 不推导 DB / bus / cache / metric / scheduler 产品或部署命令。 |
| `02-概要设计.md` §11 | 配置影响轮廓、禁止配置化边界、03 / 04 分工。 | 不推导 JSON 示例、ConfigError enum、adapter constructor 参数。 |
| `03-详细设计.md` §13 | config reference families、config ownership/read boundary、external binding、runtime builder、forbidden configurable boundary。 | 不推导具体 env/profile/secret/topic/URL、产品绑定或实施 commit。 |
| `03-详细设计.md` §15~§16 | config validation、adapter availability、redaction、no synthetic marker、downstream handoff ownership。 | 不推导 TC ID、acceptance gate、implementation boundary 或 evidence schema。 |
| 旧 `05/06/07` | 测试 / 验收 / 实施方向输入,提醒后续需重启或复核。 | 不作为当前配置真相源。 |

### 4. 配置设计必须回答的问题思考

R1.4 应把“必须回答的问题”写成清单,但当前先按问题族收敛:

| 问题族 | 必须回答的内容 | 后续 Step |
|---|---|---|
| 控制面与范围 | 哪些配置控制面存在,哪些为 P0 / P1 / P2,哪些不适用。 | Step 2 / Step 3 |
| 禁止配置化 | 哪些 truth owner、state、schema、transaction、marker、body-free、P0/P1 边界不可被配置改变。 | Step 4 |
| 来源与优先级 | raw config 来源、profile、env/file/config-service/secret ref 的覆盖和冲突规则。 | Step 5 |
| 环境矩阵 | test/staging/production-like 等环境或 profile 是否存在,差异如何表达。 | Step 6 |
| 配置项与敏感配置 | 每个配置项的类型、默认值、必填性、作用域、生效方式、敏感级别、失败策略。 | Step 7 / Step 8 |
| 加载、校验、失效 | runtime builder 如何加载、校验、注入、阻断、降级和暴露 safe issue。 | Step 9 / Step 11 |
| 下游承接 | 05/06/07/09 如何承接配置矩阵、测试方向、验收门禁、实施与运维输入。 | Step 12 |

### 5. 配置设计不再回答的问题思考

| 不再回答的问题 | 正式来源 / 去向 |
|---|---|
| L3-method-library 是否拥有方法资产定义 truth | `00/01/02/03` 已收稳。 |
| Definition vs Use、外部正文禁止入仓和下游运行 truth 排除是否成立 | `00/01/02/03` 已收稳。 |
| 对象字段、trait/port、DTO、flow、状态、持久化、错误和幂等契约是什么 | `03-详细设计.md`。 |
| 是否允许 query repair、job 修 core truth、stored replay 关闭或 marker 合成 | 上游已禁止;04 不重新裁决。 |
| 测试 case、验收通过标准、implementation phase / commit boundary 如何命名 | 后续 `05/06/07`。 |
| 部署命令、运维 runbook、监控面板和产品安装步骤 | 运维 / 部署文档或实施计划后续承接。 |

### 6. 初步缺口判断思考

| 缺口候选 | 是否阻塞 Step 2 | 当前处理 |
|---|---|---|
| 正式 `04-配置设计.md` 不存在 | 否 | 本轮目标就是生成它;继续 Step 1~15。 |
| 旧 `05/06/07` 未按新版 `03/04` 重启 | 否 | 标为方向输入;不得反向定义配置。 |
| 生产 durable store、broker、metrics、DLQ、真实 adapter 未选型 | 否 | 后续按 product-neutral / fake / disabled / 待确认处理。 |
| 具体 config key、default、profile、secret、topic、URL 未定义 | 否 | 这是后续 04 的职责,不得由 03 或实现侧补。 |
| 后续配置结论需要新增 runtime carrier、adapter constructor、port、mapper、error 或 public surface | 可能阻塞 | 一旦出现,回 `03-详细设计.md` owning Step 闭口。 |

### 7. R1.4 写入计划思考

`R1.4 SOP 问题回答与输入映射:再写入` 应把 R1.3 候选思考落成可恢复结构:

1. 写正式的 SOP 五问回答表。
2. 写上游输入映射表。
3. 写“配置设计必须回答的问题”清单。
4. 写“配置设计不再回答的问题”清单。
5. 写初步缺口 / blocker 判断表。
6. 写对 `03-详细设计.md` 的影响判定。
7. 写 `R1.5 当前文档问题诊断:先思考` 进入门禁。

### 8. R1.3 stop-review

| 检查项 | 结果 |
|---|---|
| 是否围绕配置 SOP Step 1 五问展开 | pass |
| 是否只形成候选思考,未写正式 `04-配置设计.md` | pass |
| 是否未定义 config key、JSON、secret、topic、URL、测试用例或实施边界 | pass |
| 是否引用 L1-governance 仅作为框架参考 | pass |
| 是否形成 R1.4 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 1 `R1.4 SOP 问题回答与输入映射:再写入`;只允许把 R1.3 候选思考落成 SOP 五问回答表、上游输入映射表、必须回答 / 不再回答的问题清单、初步缺口判断、对 `03-详细设计.md` 的影响判定和 R1.5 进入门禁;不得直接写正式 `04-配置设计.md`、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。

---

## R1.4 SOP 问题回答与输入映射:再写入

### 1. 当前模块目标

`R1.4` 将 `R1.3` 的候选思考落成 Step 1 可恢复记录。当前模块只写 SOP 五问回答、上游输入映射、配置设计必须回答的问题、不再回答的问题、初步缺口判断、对 `03-详细设计.md` 的影响判定和 `R1.5` 进入门禁。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块允许 | 写入 SOP 五问回答表、上游输入映射表、必须回答 / 不再回答的问题清单、初步缺口判断、影响判定和下一模块门禁。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不定义配置项、key、默认值、profile merge、secret、endpoint、topic、测试用例、验收门禁、实施 boundary 或代码。 |

### 2. SOP 五问回答表

| SOP 问题 | Step 1 回答 | 后续去向 |
|---|---|---|
| 当前配置设计要承接哪些需求、非功能、安全和环境差异? | 承接方法资产定义 truth、Definition vs Use、下游按边界消费、外围增强不阻塞核心闭环、外部正文禁止入仓、追溯 / 审计 / 可观测、配置与变更不得绕过核心边界。环境差异当前只确认需要后续 profile / 矩阵承接,不提前命名环境。 | Step 2 范围;Step 6 环境 / profile 矩阵。 |
| 详细设计中哪些配置引用、runtime builder、adapter 或外部依赖需要进入配置设计? | 直接承接 `03` §13 的 runtime assembly、storage adapter、source / resolver adapter、publisher / handoff binding、target registry、query/read policy handles、replay/retry/job handles、diagnostics 和 forbidden configurable boundary。 | Step 3 控制面;Step 4 禁止配置化;Step 7 配置项;Step 9 加载校验;Step 11 失效策略。 |
| 哪些测试和验收场景依赖配置矩阵? | 核心查询 / 消费、fake/durable parity、config validation、adapter availability、no raw body、no secret、redaction、安全诊断和 runtime blocked/degraded/unavailable 都依赖配置矩阵或配置门禁方向。旧 `05/06` 只作方向输入。 | Step 6 环境矩阵;Step 12 下游承接;正式 TC/AC 交 `05/06`。 |
| 哪些内容不应在配置设计中重新定义? | 不重新定义 00 需求目标、01 架构边界、02 主要组成 / 状态 / 异常红线、03 object / trait / port / DTO / flow / state / persistence / transaction / idempotency / marker source。 | 记录为不再回答的问题清单;若需要改变则回对应上游。 |
| 当前上游是否存在会阻塞配置设计的缺口? | 当前无阻塞 Step 2 的输入缺口。正式 `04` 不存在是本轮目标;旧 `05/06/07` 未重启只影响下游承接;生产 durable store、broker、metrics、DLQ、真实 adapter 和 concrete profile/key/secret/product 选择是后续待收敛项。若后续发现需要新增 runtime carrier、adapter constructor、port、mapper、error 或 public surface,必须回 `03`。 | Step 14 风险 / 待确认;必要时回 `03` owning Step。 |

### 3. 上游输入映射表

| 来源文档 | 配置输入 | 回填章节 |
|---|---|---|
| `00-需求文档.md` | 仓定位、核心闭环、依赖裁剪、NFR、安全、可用性、追溯 / 审计 / 可观测、验收方向、外部正文和下游运行 truth 排除。 | `04` §1 / §2 / §4 / §6 / §12 |
| `01-架构设计.md` | 系统边界、运行承载、依赖方向、数据所有权、横切安全 / 审计 / 韧性 / 配置与变更控制、外围增强隔离。 | `04` §1 / §3 / §4 / §10 / §11 |
| `02-概要设计.md` §11 | 配置影响轮廓、主要部分 / 接缝受配置影响方式、禁止配置化边界、03 / 04 分工。 | `04` §1 / §3 / §4 / §7 / §11 |
| `03-详细设计.md` §13 | config reference families、config ownership/read boundary、external dependency binding、runtime builder and entry binding、forbidden configurable boundary。 | `04` §1 / §3 / §4 / §5 / §7 / §9 / §11 |
| `03-详细设计.md` §15~§16 | config validation、adapter availability、observability redaction、no synthetic marker、downstream ownership、implementation 前不得补 config truth。 | `04` §1 / §8 / §9 / §12 / §14 |
| `03_ddd_step_14_config_dependencies.md` | 详细设计配置绑定点的字段级讨论来源和旧配置主线污染隔离依据。 | `04` §3 / §4 / §7 / §9 / §11 |
| 旧 `05-测试方案.md` / `06-验收标准.md` | 测试环境、验收环境和配置门禁方向输入。 | `04` §6 / §12 / §14 |
| 旧 `07-实施计划.md` | 仅作为后续实施承接提醒。 | 不作为 `04` 配置项或实施 boundary 真相源。 |

### 4. 配置设计必须回答的问题清单

| 问题族 | 必须回答的问题 | 后续 Step |
|---|---|---|
| 配置目标与范围 | 本仓配置设计覆盖哪些控制面、哪些非范围、是否存在无配置路径。 | Step 2 |
| 配置控制面 | runtime、adapter、entry、query/read、retry/job、target registry、diagnostics 等控制面如何组织。 | Step 3 |
| 禁止配置化 | 哪些 truth owner、state transition、schema、transaction、marker、body-free、P0/P1 边界不可被配置改变。 | Step 4 |
| 来源与优先级 | raw config 来源、profile、file/env/config-service/secret ref 的覆盖与冲突规则。 | Step 5 |
| 环境 / profile | test、staging、production-like 或其他 profile 是否存在,差异如何表达。 | Step 6 |
| 配置项与敏感配置 | 每个配置项的类型、默认值、必填性、来源、作用域、生效方式、敏感级别、失败策略和关联模块。 | Step 7 / Step 8 |
| 加载、校验与失效 | runtime builder 如何加载、校验、注入、阻断、降级和暴露 safe issue。 | Step 9 / Step 11 |
| 变更与审计 | 配置变更如何审计、回滚、迁移、废弃和演进。 | Step 10 / Step 13 |
| 下游承接 | 05/06/07/09 如何承接配置矩阵、测试方向、验收门禁、实施和运维输入。 | Step 12 |

### 5. 配置设计不再回答的问题清单

| 不再回答的问题 | 已有来源 / 去向 |
|---|---|
| L3-method-library 是否拥有方法资产定义 truth | `00/01/02/03` 已收稳。 |
| Definition vs Use、外部正文禁止入仓和下游运行 truth 排除是否成立 | `00/01/02/03` 已收稳。 |
| 对象字段、trait/port、DTO、flow、状态、持久化、错误和幂等契约是什么 | `03-详细设计.md`。 |
| 是否允许 query repair、job 修 core truth、stored replay 关闭、marker 合成或 config validation 证明业务 truth | 上游已禁止;04 不重新裁决。 |
| 具体测试 case、验收通过标准、evidence schema、implementation phase / commit boundary 如何命名 | 后续 `05/06/07`。 |
| 部署命令、运维 runbook、监控面板、产品安装步骤和值班流程 | 运维 / 部署文档或实施计划后续承接。 |

### 6. 初步缺口 / blocker 判断

| 缺口候选 | 是否阻塞 Step 2 | 当前处理 |
|---|---|---|
| 正式 `04-配置设计.md` 不存在 | 否 | 本轮目标就是生成它;继续 Step 1~15。 |
| 旧 `05/06/07` 未按新版 `03/04` 重启 | 否 | 标为方向输入;不得反向定义配置。 |
| 生产 durable store、broker、metrics、DLQ、真实 adapter 未选型 | 否 | 后续按 product-neutral / fake / disabled / 待确认处理。 |
| 具体 config key、default、profile、secret、topic、URL 未定义 | 否 | 这是后续 04 的职责;不得由 03 或实现侧补。 |
| 后续配置结论需要新增 runtime carrier、adapter constructor、port、mapper、error 或 public surface | 可能阻塞 | 一旦出现,回 `03-详细设计.md` owning Step 闭口。 |
| 当前 Step 1 输入不足以进入 Step 2 | 否 | 输入文档、边界和初步缺口已足够支持 Step 2 讨论范围。 |

### 7. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| `04` 从当前 `00/01/02/03` 生成,旧 `05/06/07` 只作方向输入 | 否 | 权威输入确认 | 不适用 | 无回写 |
| `04` 必须承接 `03` §13 config reference families 和 runtime builder boundary | 否 | 配置设计输入确认 | 不适用 | 无回写 |
| `04` 不得修改 truth owner、state、DTO、transaction、marker、stored replay 或 body-free rule | 否 | 禁止配置化确认 | 不适用 | 无回写 |
| 后续若需要新增 runtime config carrier、adapter constructor 参数、port、mapper、error 或 public surface | 是 | 代码契约变更 | `03` owning Step / §4~§13 | 阻塞待确认 |
| 生产产品未选型保持 product-neutral / fake / disabled / unavailable 口径 | 否 | 产品中立配置口径 | 不适用 | 无回写 |

### 8. R1.5 进入门禁

`R1.5 当前文档问题诊断:先思考` 只能在以下条件满足后进入:

| 门禁项 | 结果 |
|---|---|
| SOP 五问已落成可恢复回答 | pass |
| 上游输入映射已形成 | pass |
| 必须回答 / 不再回答的问题边界已形成 | pass |
| 初步缺口判断已形成,且无阻塞 Step 2 的输入缺口 | pass |
| 对 `03-详细设计.md` 的影响判定已形成 | pass |
| 未创建正式 `04-配置设计.md`,未写配置项、JSON、secret、测试、验收、实施或代码 | pass |

### 9. R1.4 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R1.4 一个模块 | pass |
| 是否把 R1.3 候选思考落成结构化记录 | pass |
| 是否未把候选配置域升级为正式配置项 | pass |
| 是否未定义 key/default/profile/secret/topic/URL | pass |
| 是否形成 R1.5 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 1 `R1.5 当前文档问题诊断:先思考`;只允许诊断当前 `04-配置设计.md` 缺失、Step 1 中间产物状态、旧 `05/06/07` 方向输入风险、03/04 分工风险和 R1.6 写入计划;不得直接写正式 `04-配置设计.md`、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。

---

## R1.5 当前文档问题诊断:先思考

### 1. 当前模块目标

`R1.5` 只诊断当前 `04-配置设计.md` 开工前的问题状态,并为 `R1.6` 形成写入计划。当前模块不把诊断结论升级为正式配置项,不创建正式 `04-配置设计.md`,也不重写旧 `05/06/07`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块允许 | 诊断正式 `04-配置设计.md` 缺失、Step 1 中间产物状态、旧 `05/06/07` 方向输入风险、03/04 分工风险和 R1.6 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写配置项清单、key、默认值、profile merge、JSON demo、secret schema、测试方案、验收标准、实施计划、phase / commit boundary 或代码。 |
| 恢复依据 | 项目台账和 04 flow 均指向 R1.4 completed,用户确认后进入 R1.5。 |

### 2. 当前文档状态诊断候选

| 诊断项 | 当前观察 | R1.6 写入策略 |
|---|---|---|
| 正式 `04-配置设计.md` | 当前不存在。 | 写为目标文档缺失,但不是 blocker;正式装配必须留到 Step 15。 |
| 04 flow | `04_config_calibration_flow.md` 已创建,Step 1 in_progress。 | 写为本轮唯一配置设计流程入口。 |
| Step 1 中间产物 | R1.1~R1.4 已记录开工、必读文档、SOP 五问、输入映射和影响判定。 | 写为可继续进入 R1.6 / R1.7 的中间产物状态。 |
| 项目级台账 | 当前指向 04 full-restart 和单模块推进规则。 | 写为恢复顺序和防遗忘机制已启用。 |
| 旧 `05/06/07` | 仍包含旧 MethodContent / P0 / publish / snapshot / outbox / fingerprint / PostgreSQL / object storage / fake bus 等旧方向。 | 写为 old_direction_input,只供下游方向诊断,不得反向定义 `04`。 |
| L1-governance 04 | 可参考 flow、表格和门禁深度。 | 写为 framework_reference,不得复制 governance 领域事实。 |

### 3. 旧下游材料风险思考

| 材料 | 风险 | 当前处理口径 |
|---|---|---|
| `05-测试方案.md` | 旧测试方案围绕旧 P0 MethodContent、publish、snapshot、outbox、fingerprint 和旧 evidence 组织,会污染新版配置测试矩阵。 | 只作为“后续测试需要环境 / fixture / fake adapter 方向”的提醒,不得定义当前配置项或 TC。 |
| `06-验收标准.md` | 旧验收标准围绕旧 P0 主链、event + snapshot、outbox、fake downstream 和旧 veto 组织。 | 只作为“后续验收要承接配置门禁”的方向输入,不得定义当前 AC。 |
| `07-实施计划.md` | 旧实施计划含旧 phase、commit boundary、PostgreSQL/object storage/fake bus、git config 和 implementation gate。 | 不作为配置 key、产品选择、phase、commit boundary 或 active implementation ledger。 |
| 旧配置环境表 | 旧 `05/07` 中的 local-dev、CI、staging-like、PostgreSQL、object storage、fake bus 可提示后续 Step 6/12 风险。 | 只能进入“待重新确认的环境 / 依赖方向”,不得直接落为正式环境矩阵。 |

### 4. 03 / 04 分工风险思考

| 分工点 | `03-详细设计.md` 已闭口内容 | `04-配置设计.md` 可继续内容 | 风险处理 |
|---|---|---|---|
| 配置职责 | 配置只绑定 runtime slot、adapter implementation、target binding、profile identity 和 numeric policy value 来源。 | 定义具体 key、profile、secret、endpoint、topic、默认值、校验和失效策略。 | 不得用配置改变 truth owner、state、DTO、transaction、stored replay、marker 或 body-free rule。 |
| runtime builder | `03` 定义 runtime builder / entry binding 边界。 | 定义 raw config 来源、validated slot、entry precheck 和 safe issue 的配置侧表达。 | 若需要新增 builder carrier 或 constructor 参数,回 `03`。 |
| adapter binding | `03` 定义 storage/source/resolver/publisher/handoff/target registry 的 binding family。 | 定义 adapter slot、product-neutral / fake / unavailable / disabled 配置口径。 | 若需要新增 port、mapper、availability marker,回 `03`。 |
| 下游承接 | `03` §16 指明 `04` 负责 concrete config schema and products。 | 只承接配置设计,不直接写测试 / 验收 / 实施结论。 | 05/06/07 必须后续重启,不能被 04 代写。 |

### 5. 初步问题分类思考

| 问题 | 分类 | 是否阻塞 Step 2 | 说明 |
|---|---|---|---|
| 正式 `04-配置设计.md` 不存在 | target_absent | 否 | 本轮 Step 1~15 的目标就是生成正式 04。 |
| 旧 `05/06/07` 未重启 | downstream_stale | 否 | 只阻塞下游正式承接,不阻塞 04 Step 2 讨论范围。 |
| 旧 `05/06/07` 含旧主线名词 | contamination_risk | 否 | 需要 R1.6 明确隔离规则。 |
| 生产 durable store / broker / metrics / DLQ / adapter 产品未选型 | downstream_pending | 否 | 后续可采用 product-neutral / fake / disabled / unavailable / 待确认口径。 |
| `04` 后续需要新增 schema / port / mapper / marker / state / evidence 字段 | formal_gap_risk | 可能 | 一旦出现必须回 owning design source,不得由配置设计或实现侧私补。 |

### 6. R1.6 写入计划思考

`R1.6 当前文档问题诊断:再写入` 应把 R1.5 思考落成可恢复记录:

1. 写当前正式文档状态诊断表。
2. 写 Step 1 中间产物状态表。
3. 写旧 `05/06/07` 方向输入风险表。
4. 写 03 / 04 分工风险表。
5. 写当前是否阻塞 Step 2 的判断。
6. 写 `R1.7 Step 1 输出边界与 Step 2 入口:先思考` 进入门禁。
7. 继续禁止创建正式 `04-配置设计.md`,禁止写配置项清单、JSON demo、secret schema、测试、验收、实施或代码。

### 7. R1.5 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R1.5 一个模块 | pass |
| 是否仅做当前文档问题诊断思考 | pass |
| 是否确认正式 `04-配置设计.md` 仍不应在 Step 1 创建 | pass |
| 是否隔离旧 `05/06/07` 为方向输入 | pass |
| 是否确认 03 / 04 分工和回写风险 | pass |
| 是否形成 R1.6 写入计划 | pass |
| 是否未写配置项、key、默认值、profile、secret、测试、验收、实施或代码 | pass |

next_allowed_action: 等待用户确认后进入 Step 1 `R1.6 当前文档问题诊断:再写入`;只允许把 R1.5 思考落成当前正式文档状态诊断表、Step 1 中间产物状态表、旧 `05/06/07` 方向输入风险表、03/04 分工风险表、是否阻塞 Step 2 的判断和 R1.7 进入门禁;不得直接写正式 `04-配置设计.md`、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。

---

## R1.6 当前文档问题诊断:再写入

### 1. 当前模块目标

`R1.6` 将 `R1.5` 的诊断思考落成 Step 1 可恢复记录。当前模块只固定正式 04 缺失状态、Step 1 中间产物状态、旧下游材料风险、03/04 分工风险、Step 2 是否可进入和 `R1.7` 进入门禁。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块允许 | 写入当前正式文档状态诊断表、Step 1 中间产物状态表、旧 `05/06/07` 风险表、03/04 分工风险表、是否阻塞 Step 2 的判断和下一模块门禁。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写配置项清单、key、默认值、profile merge、JSON demo、secret schema、测试方案、验收标准、实施计划、phase / commit boundary 或代码。 |

### 2. 当前正式文档状态诊断表

| 对象 | 当前状态 | 诊断结论 | 后续处理 |
|---|---|---|---|
| `projects/L3-method-library/04-配置设计.md` | 不存在 | 不是异常,而是本轮 full-restart 的目标输出。 | 继续 Step 1~14 中间产物;Step 15 才装配正式文档。 |
| 04 calibration flow | 已创建 | 可作为 04 讨论流程、恢复点和 Step 状态入口。 | 后续每个模块推进后同步更新。 |
| Step 1 中间产物 | 已创建并完成 R1.1~R1.6 | 输入边界、SOP 五问、文档问题诊断已可恢复。 | 下一步补 Step 1 输出边界和 Step 2 入口。 |
| 正式 `00/01/02/03` | 已完成并作为上游 | 可支撑 04 Step 2 讨论范围。 | 后续按需逐 Step 回读具体章节。 |
| 旧 `05/06/07` | 未重启 | 不是 04 真相源,只能作为方向输入和污染风险提醒。 | 后续 `05/06/07` 需按新版 03/04 重新启动。 |

### 3. Step 1 中间产物状态表

| 模块 | 状态 | 已闭口内容 | 未闭口内容 |
|---|---|---|---|
| R1.1 开工与必读文档:先思考 | completed | 04 full-restart 开工边界、必读文档、旧材料隔离和 R1.2 写入计划。 | 无。 |
| R1.2 开工与必读文档:再写入 | completed | Step 1 输入基线、必读文档清单、配置输入边界、03 影响判定框架和 R1.3 门禁。 | 无。 |
| R1.3 SOP 问题回答与输入映射:先思考 | completed | SOP 五问候选回答、上游输入映射、必须回答 / 不再回答问题和缺口判断。 | 无。 |
| R1.4 SOP 问题回答与输入映射:再写入 | completed | SOP 五问正式回答表、输入映射表、问题清单、初步缺口和对 03 影响判定。 | 无。 |
| R1.5 当前文档问题诊断:先思考 | completed | 正式 04 缺失、旧下游材料风险、03/04 分工风险和 R1.6 写入计划。 | 无。 |
| R1.6 当前文档问题诊断:再写入 | completed_wait_user_confirm | 当前诊断已结构化写入。 | 需用户确认后进入 R1.7。 |

### 4. 旧 `05/06/07` 方向输入风险表

| 文档 | 可用方向输入 | 污染风险 | 当前裁决 |
|---|---|---|---|
| `05-测试方案.md` | 测试环境、fake adapter、配置矩阵和 evidence 方向提醒。 | 旧 P0 MethodContent、publish、snapshot、outbox、fingerprint、旧 TC / EV 可能污染新版配置设计。 | old_direction_input;不得反向定义配置项、fixture、TC 或 evidence schema。 |
| `06-验收标准.md` | 验收环境、配置门禁、redline 和 veto 方向提醒。 | 旧 P0 主链、event + snapshot、outbox、fake downstream 和旧 AC/VETO 可能污染新版验收承接。 | old_direction_input;不得反向定义当前 AC、验收阈值或配置通过标准。 |
| `07-实施计划.md` | 实施承接、运行依赖、git / gate / phase 方向提醒。 | 旧 phase / commit boundary、PostgreSQL、object storage、fake bus、旧 gate 会误导当前 04。 | old_direction_input;不得作为 active implementation plan、配置 key 或产品选择依据。 |
| 旧环境 / 依赖表 | local-dev、CI、staging-like、DB / bus / storage 这类类别提醒。 | 旧名称容易被直接复制为正式 profile 或产品绑定。 | 仅作为 Step 6 / Step 12 待重新确认的候选方向。 |

### 5. 03 / 04 分工风险表

| 风险点 | 03 已固定内容 | 04 可做内容 | 必须暂停的情况 |
|---|---|---|---|
| 配置改变语义 | 配置不得改变 truth owner、public DTO schema、state transition、query no-write、stored replay、transaction boundary、marker source 或 body-free rule。 | 定义 raw config、profile、secret、endpoint、topic、numeric values、加载校验和失效策略。 | 任何配置结论试图改变对象、port、DTO、flow、state、transaction、marker 或 replay source。 |
| runtime builder 承载不足 | 03 只定义 runtime builder / entry binding 边界和 validated config 可见性。 | 定义具体 key、profile、validated slot、safe issue 和 entry precheck 配置口径。 | 发现需要新增 runtime carrier、constructor 参数或 public surface。 |
| adapter / target binding 不足 | 03 定义 storage/source/resolver/publisher/handoff/target registry 的 binding family。 | 定义 fake/durable/disabled/unavailable/product-neutral 的配置侧表达。 | 发现需要新增 adapter port、mapper、availability marker 或 target registry schema。 |
| 下游承接越界 | 03 §16 只把 concrete config schema and products 交给 04。 | 04 只提供配置设计和下游输入。 | 04 直接写测试 case、acceptance gate、implementation boundary、CI command 或 runbook。 |

### 6. 是否阻塞 Step 2 的判断

| 判断项 | 结论 |
|---|---|
| 是否缺正式 `04-配置设计.md` 而阻塞 Step 2 | 否。正式 04 缺失是本轮目标,不是 Step 2 blocker。 |
| 是否因旧 `05/06/07` 未重启而阻塞 Step 2 | 否。旧下游只作方向输入,不反向定义 Step 2 范围。 |
| 是否因生产产品未选型而阻塞 Step 2 | 否。产品选择可在后续 Step 7 / Step 14 用 product-neutral、fake、disabled、unavailable 或待确认处理。 |
| 是否存在必须先回写 `03-详细设计.md` 的 blocker | 当前 Step 1 未发现。后续若需要新增 schema / port / mapper / marker / state / evidence 字段,再暂停回 03。 |
| Step 2 是否可以进入 | 可以。需先完成 R1.7 对 Step 1 输出边界和 Step 2 入口的最后确认。 |

### 7. R1.7 进入门禁

`R1.7 Step 1 输出边界与 Step 2 入口:先思考` 只能在以下条件满足后进入:

| 门禁项 | 结果 |
|---|---|
| 当前正式文档状态已诊断 | pass |
| Step 1 中间产物状态已诊断 | pass |
| 旧 `05/06/07` 风险已隔离 | pass |
| 03 / 04 分工风险已固定 | pass |
| 已判断当前不阻塞 Step 2 | pass |
| 未创建正式 `04-配置设计.md`,未写配置项、JSON、secret、测试、验收、实施或代码 | pass |

### 8. R1.6 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R1.6 一个模块 | pass |
| 是否把 R1.5 思考落成结构化记录 | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未定义配置项、key、默认值、profile、secret、测试、验收、实施或代码 | pass |
| 是否形成 R1.7 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 1 `R1.7 Step 1 输出边界与 Step 2 入口:先思考`;只允许思考 Step 1 最终输出、Step 2 可接收输入、Step 1 是否可关闭、Step 2 开工必读文档和 R1.8 写入计划;不得直接写正式 `04-配置设计.md`、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。

---

## R1.7 Step 1 输出边界与 Step 2 入口:先思考

### 1. 当前模块目标

`R1.7` 只思考 Step 1 是否已经具备收口条件,以及 Step 2 可以接收哪些输入。当前模块不关闭 Step 1,不创建 Step 2 文件,不创建正式 `04-配置设计.md`,也不定义配置目标、范围、配置项或环境矩阵。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块允许 | 思考 Step 1 最终输出、Step 2 可接收输入、Step 1 是否可关闭、Step 2 开工必读文档和 R1.8 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不创建 `04_config_step_02_scope.md`;不写配置目标 / 范围正文、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |

### 2. Step 1 最终输出候选思考

| 输出候选 | 是否应成为 Step 1 输出 | 理由 | R1.8 写入方式 |
|---|---|---|---|
| 上游输入边界 | 是 | Step 1 已确认 `00/01/02/03` 是正式输入,旧 `05/06/07` 只作方向输入。 | 写成 Step 1 final output 表。 |
| SOP 五问回答 | 是 | 已明确 04 承接哪些需求 / 架构 / 详细设计配置入口,以及哪些不重新回答。 | 写成 Step 1 final output 表。 |
| 当前文档问题诊断 | 是 | 已确认正式 04 缺失不阻塞 Step 2,旧下游材料风险已隔离。 | 写成 Step 1 final output 表。 |
| 对 03 的影响判定框架 | 是 | 后续 04 若改变 runtime carrier / adapter constructor / port / mapper 等,必须回 03。 | 写入 Step 2 继承约束。 |
| 具体配置项 / key / default | 否 | 属于 Step 7,不是 Step 1。 | R1.8 继续禁止。 |
| 具体 profile / 环境矩阵 | 否 | 属于 Step 6,Step 1 只确认后续需要讨论。 | R1.8 继续禁止。 |
| 测试 / 验收 / 实施门禁 | 否 | 属于 05/06/07 或 Step 12 承接,不是 Step 1。 | R1.8 继续禁止。 |

### 3. Step 2 可接收输入思考

| 输入 | Step 2 可接收内容 | Step 2 不可接收内容 |
|---|---|---|
| Step 1 上游输入边界 | `00/01/02/03` 的配置相关来源和旧材料隔离规则。 | 旧 `05/06/07` 的配置项、TC、AC、phase 或 commit boundary。 |
| SOP 五问回答 | 配置设计必须回答 / 不再回答的问题族。 | 具体配置 key、默认值、secret、endpoint、topic 或 JSON。 |
| 03 §13 / §16 | runtime assembly、adapter binding、target binding、query/read policy、retry/job、diagnostics 和 concrete config schema owner。 | 新增对象字段、port、mapper、state、public surface 或 evidence schema。 |
| 当前文档问题诊断 | 正式 04 缺失、旧下游污染风险和产品未选型不阻塞 Step 2。 | 直接装配正式 04 或跳到 Step 7。 |
| 03 影响判定框架 | Step 2 讨论范围 / 非范围时必须识别是否触发回写 03。 | 用配置范围裁决补 03 缺失的 schema / port / mapper。 |

### 4. Step 1 是否可关闭思考

| 关闭条件 | 当前判断 | 说明 |
|---|---|---|
| 是否完成必读文档和开工边界 | 是 | R1.1 / R1.2 已闭口。 |
| 是否完成 SOP 五问与输入映射 | 是 | R1.3 / R1.4 已闭口。 |
| 是否完成当前文档问题诊断 | 是 | R1.5 / R1.6 已闭口。 |
| 是否存在阻塞 Step 2 的输入缺口 | 否 | 当前缺正式 04、旧 05/06/07 未重启和产品未选型均不阻塞 Step 2。 |
| 是否仍需写 Step 1 final output / Step 2 entry | 是 | R1.8 需要把本次思考落成最终收口表。 |
| Step 1 是否现在直接关闭 | 否 | 需要用户确认后由 R1.8 写入 final output,再关闭 Step 1。 |

### 5. Step 2 开工必读文档思考

| 必读文档 | Step 2 读取目的 |
|---|---|
| `project_execution_ledger.md` | 确认当前仍在 04 full-restart,并且 Step 1 已完成 / Step 2 可开工。 |
| `04_config_calibration_flow.md` | 确认 Step 2 的主题、产物文件和门禁。 |
| `04_config_step_01_upstream_boundary.md` | 继承 Step 1 final output、旧材料隔离和 03 影响判定框架。 |
| `standards/document/配置设计讨论流程_SOP.md` | 固定 Step 2 应讨论目标、范围、非范围和无配置路径。 |
| `standards/document/配置设计书写规范.md` | 固定正式 04 §2 的范围 / 非范围写法和不得提前写配置项的边界。 |
| `standards/document/设计文档讨论中间产物规范.md` | 固定 Step 2 先思考后写入、台账同步和单模块推进。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 判断范围讨论是否触发 schema / port / mapper / config / evidence 缺口。 |
| `00-需求文档.md` / `01-架构设计.md` / `02-概要设计.md` / `03-详细设计.md` | 为 Step 2 的配置目标、范围和非范围提供正式上游依据。 |
| L1-governance 04 Step 2 | 只参考范围 / 非范围框架深度,不复制 governance 领域事实。 |

### 6. R1.8 写入计划思考

`R1.8 Step 1 输出边界与 Step 2 入口:再写入` 应把 R1.7 思考落成 Step 1 最终收口记录:

1. 写 Step 1 final output 表。
2. 写 Step 2 可接收输入表。
3. 写 Step 1 closing gate 判定。
4. 写 Step 2 开工必读文档清单。
5. 写 Step 2 第一模块 `R2.1 开工与必读文档:先思考` 的进入门禁。
6. 将 Step 1 标记为 completed_wait_user_confirm_to_step2。
7. 仍不得创建正式 `04-配置设计.md` 或 Step 2 文件;Step 2 文件只能在 R2.1 开始时创建。

### 7. R1.7 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R1.7 一个模块 | pass |
| 是否只思考 Step 1 输出边界与 Step 2 入口 | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未创建 Step 2 文件 | pass |
| 是否未写配置目标、范围、配置项、key、secret、测试、验收、实施或代码 | pass |
| 是否形成 R1.8 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 1 `R1.8 Step 1 输出边界与 Step 2 入口:再写入`;只允许把 R1.7 思考落成 Step 1 final output 表、Step 2 可接收输入表、Step 1 closing gate、Step 2 开工必读文档清单和 R2.1 进入门禁;不得创建正式 `04-配置设计.md`、不得创建 `04_config_step_02_scope.md`、不得写配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。

---

## R1.8 Step 1 输出边界与 Step 2 入口:再写入

### 1. 当前模块目标

`R1.8` 将 `R1.7` 的思考落成 Step 1 最终收口记录。当前模块只固定 Step 1 final output、Step 2 可接收输入、Step 1 closing gate、Step 2 开工必读文档和 R2.1 进入门禁。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_step2 |
| 本模块允许 | 写入 Step 1 final output 表、Step 2 可接收输入表、Step 1 closing gate、Step 2 开工必读文档清单和 R2.1 进入门禁。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不创建 `04_config_step_02_scope.md`;不写配置目标 / 范围正文、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |

### 2. Step 1 final output

| 输出项 | Step 1 最终结论 | 后续承接 |
|---|---|---|
| 权威输入边界 | `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md` 是当前 04 的正式上游。 | Step 2 讨论配置目标、范围和非范围时必须回指这些输入。 |
| 旧材料处理 | 旧 `05/06/07` 只作为 old_direction_input,不得反向定义配置项、测试、验收、实施或产品选择。 | Step 6 / Step 12 可把旧下游材料作为待重启方向提醒。 |
| SOP 五问回答 | 已明确 04 承接需求 / 架构 / 详细设计的配置入口,并明确 04 不重新回答需求、架构、对象、port、DTO、flow、state、测试和实施边界。 | Step 2 继承“必须回答 / 不再回答”的问题族。 |
| 当前文档问题诊断 | 正式 `04-配置设计.md` 当前不存在,这是本轮目标而非 blocker;Step 15 才能装配正式 04。 | Step 2 继续使用中间产物,不得提前创建正式 04。 |
| 03 影响判定框架 | 只影响配置语义、来源、优先级、profile、敏感级别或失败策略的内容留在 04;影响 runtime carrier、adapter constructor、trait / port、error、DTO 或函数流的内容必须回写 03。 | Step 2 起每个 Step 都必须保留对 `03-详细设计.md` 的影响判定。 |
| 当前 blocker 判断 | 当前无阻塞 Step 2 的输入缺口。生产产品未选型、旧下游未重启和正式 04 缺失均不阻塞 Step 2。 | Step 2 可进入;后续若发现 schema / port / mapper / marker / evidence 缺口再暂停回 owning source。 |

### 3. Step 2 可接收输入

| 输入族 | 可接收内容 | 禁止接收内容 |
|---|---|---|
| 上游文档输入 | `00/01/02/03` 中配置目标、范围、禁止配置化、runtime / adapter / external binding 和下游承接入口。 | 旧文档中的 P0 MethodContent、publish、snapshot、outbox、fingerprint 或旧 phase。 |
| Step 1 输出 | 权威输入边界、旧材料隔离、SOP 五问、当前文档诊断和 03 影响判定框架。 | 配置 key、默认值、secret、endpoint、topic、JSON demo 或产品绑定。 |
| `03` §13 / §16 | runtime assembly、adapter binding、target binding、query/read policy、retry/job、diagnostics 和 concrete config schema owner。 | 新增对象字段、trait / port、mapper、state、public surface 或 evidence schema。 |
| 历史方向输入 | 旧 `05/06/07` 中关于测试环境、验收环境和实施承接的风险提醒。 | 直接拿旧 TC、AC、commit boundary、PostgreSQL、object storage、fake bus 作为当前正式结论。 |
| L1-governance 参考 | Step 2 范围 / 非范围表格深度和门禁表达。 | governance 领域事实、配置项或产品选择。 |

### 4. Step 1 closing gate

| 关闭项 | 判定 | 说明 |
|---|---|---|
| 必读文档与开工边界 | pass | R1.1 / R1.2 已完成。 |
| SOP 五问与输入映射 | pass | R1.3 / R1.4 已完成。 |
| 当前文档问题诊断 | pass | R1.5 / R1.6 已完成。 |
| Step 1 输出边界与 Step 2 入口 | pass | R1.7 / R1.8 已完成。 |
| 正式 `04-配置设计.md` 是否提前创建 | pass | 未创建;Step 15 前不得创建。 |
| Step 2 文件是否提前创建 | pass | 未创建;只能在 R2.1 开始时创建。 |
| 是否存在阻塞 Step 2 的设计缺口 | pass | 当前未发现阻塞 Step 2 的缺口。 |

Step 1 结论: `completed_wait_user_confirm_to_step2`。

### 5. Step 2 开工必读文档清单

| 必读文档 | Step 2 读取目的 |
|---|---|
| `projects/L3-method-library/design-calibration/project_execution_ledger.md` | 确认当前 04 full-restart、Step 1 completed 和 R2.1 next_allowed_action。 |
| `projects/L3-method-library/design-calibration/04_config_calibration_flow.md` | 确认 Step 2 主题、产物文件、执行纪律和当前门禁。 |
| `projects/L3-method-library/design-calibration/04_config_step_01_upstream_boundary.md` | 继承 Step 1 final output、旧材料隔离和 03 影响判定框架。 |
| `standards/document/配置设计讨论流程_SOP.md` | 固定 Step 2 的目标、范围、非范围、无配置路径和回填位置。 |
| `standards/document/配置设计书写规范.md` | 固定正式 04 §2 的写法、无配置说明规则和详细设计回写要求。 |
| `standards/document/设计文档讨论中间产物规范.md` | 固定 Step 2 的中间产物、先思考后写入和台账同步纪律。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 固定缺 schema / port / mapper / config / evidence 时的暂停规则。 |
| `projects/L3-method-library/00-需求文档.md` | 提供配置目标与非范围的需求依据。 |
| `projects/L3-method-library/01-架构设计.md` | 提供配置不得绕过架构边界、truth owner 和外围增强隔离的依据。 |
| `projects/L3-method-library/02-概要设计.md` | 提供配置影响轮廓、禁止配置化边界和 03/04 分工依据。 |
| `projects/L3-method-library/03-详细设计.md` | 提供 §13 config binding、§16 handoff、§17 风险和详细设计回写边界。 |
| `projects/L1-governance/design-calibration/04_config_step_02_scope.md` | 仅参考 Step 2 范围 / 非范围框架深度,不得复制领域事实。 |

### 6. R2.1 进入门禁

Step 2 `R2.1 开工与必读文档:先思考` 只能在用户确认后进入。

| 门禁项 | 结果 |
|---|---|
| Step 1 已完成 final output | pass |
| Step 2 可接收输入已固定 | pass |
| Step 1 closing gate 已通过 | pass |
| Step 2 必读文档清单已固定 | pass |
| 正式 `04-配置设计.md` 未创建 | pass |
| `04_config_step_02_scope.md` 未提前创建 | pass |

R2.1 允许范围:

1. 创建 `projects/L3-method-library/design-calibration/04_config_step_02_scope.md`。
2. 写 Step 2 边界、必读文档、开工思考和 R2.2 写入计划。
3. 同步更新 `04_config_calibration_flow.md` 和 `project_execution_ledger.md` 到 Step 2 R2.1。

R2.1 禁止范围:

1. 不创建正式 `04-配置设计.md`。
2. 不写配置项清单、key、默认值、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。
3. 不把旧 `05/06/07` 的 TC、AC、phase、commit boundary 或产品选择写成当前 04 真相源。

### 7. R1.8 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R1.8 一个模块 | pass |
| 是否完成 Step 1 final output | pass |
| 是否明确 Step 2 可接收输入 | pass |
| 是否通过 Step 1 closing gate | pass |
| 是否形成 R2.1 进入门禁 | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未创建 `04_config_step_02_scope.md` | pass |
| 是否未写配置项、JSON、secret、测试、验收、实施或代码 | pass |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.1 开工与必读文档:先思考`;允许创建 `design-calibration/04_config_step_02_scope.md` 并写入 Step 2 开工思考、必读文档、范围 / 非范围讨论入口和 R2.2 写入计划;不得创建正式 `04-配置设计.md`;不得写配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。
