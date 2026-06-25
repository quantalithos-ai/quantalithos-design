# Step 2. 明确配置设计目标、范围和非范围

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 2
> 书写规范: `standards/document/配置设计书写规范.md`
> 回填章节: `04-配置设计.md` §2 本次配置设计目标与范围
> 创建日期: 2026-06-24
> 当前状态: `R2.10 Step 2 final output 与 closing gate:再写入` completed_wait_user_confirm_to_R3.1
> 当前门禁: 等待确认进入 Step 3 `R3.1 开工与必读文档:先思考`

---

## 0. Step 2 边界

Step 2 只明确本轮配置设计的目标、范围、非范围、P0 / P1 / P2 配置口径和无配置路径是否成立。

当前 Step 不定义具体配置项、key、默认值、profile merge order、JSON demo、secret schema、加载函数、校验规则、热更新策略、部署命令、测试用例、验收门禁、实施 phase / commit boundary 或代码。

---

## R2.1 开工与必读文档:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 思考 Step 2 的开工边界、必读文档、输入承接、L1-governance 框架参考方式、范围讨论入口和 R2.2 写入计划。 |
| 本模块允许 | 创建 Step 2 中间产物文件;写入 Step 2 边界、必读文档思考、范围 / 非范围讨论入口和 R2.2 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写配置目标正式表、范围正式表、P0/P1/P2 正式口径、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | Step 1 已完成 final output 和 R2.1 进入门禁;项目台账允许进入 Step 2 `R2.1`。 |

### 2. Step 2 开工边界思考

| 边界项 | R2.1 裁决 |
|---|---|
| Step 2 定位 | 从 Step 1 的输入边界进入配置目标、范围、非范围和无配置路径判定。 |
| 直接输入 | Step 1 final output、配置 SOP Step 2、正式 `00/01/02/03`、`03` §13 / §16、L1-governance Step 2 框架参考。 |
| 旧下游文档 | 旧 `05/06/07` 仍只作为方向输入,不得反向定义配置范围、测试、验收或实施。 |
| 无配置路径 | 需要在 Step 2 正式判定;R2.1 只记录判断入口,不提前写最终结论。 |
| P0 / P1 / P2 口径 | 需要在 Step 2 正式收敛;R2.1 只确认必须讨论。 |
| 对 03 的影响 | 若范围讨论要求新增 runtime config carrier、adapter constructor、trait / port、error、DTO 或 flow,必须回 `03-详细设计.md`。 |
| 下游边界 | Step 2 不替代 Step 3~15、`05/06/07` 或运维文档。 |

### 3. 必读文档思考

| 必读文档 | 读取用途 | R2.2 用法 |
|---|---|---|
| `project_execution_ledger.md` | 确认 Step 1 已完成,当前允许进入 Step 2 R2.1。 | 写入 Step 2 开工恢复依据。 |
| `04_config_calibration_flow.md` | 确认 Step 2 文件、主题和执行纪律。 | 写入 Step 2 当前状态和 next_allowed_action。 |
| `04_config_step_01_upstream_boundary.md` | 继承 Step 1 final output、Step 2 可接收输入和 R2.1 门禁。 | 写入 Step 2 输入基线。 |
| `配置设计讨论流程_SOP.md` Step 2 | 固定本步目标、输入、输出、应问问题和进入下一步条件。 | 写入 Step 2 目标 / 禁止范围 / SOP 问题入口。 |
| `配置设计书写规范.md` | 固定正式 04 §2 写法、无配置说明规则和回写 03 要求。 | 写入后续回填边界。 |
| `设计文档讨论中间产物规范.md` | 固定逐模块、先思考后写入和台账恢复纪律。 | 约束 R2.1 -> R2.2。 |
| `设计真相源闭环与可落码性标准.md` | 固定缺 schema / port / mapper / config / evidence 时的暂停规则。 | 写入 Step 2 影响判定框架。 |
| `00-需求文档.md` | 提供仓定位、目标、非目标、相邻仓职责和依赖裁剪。 | 支撑配置目标与非范围来源。 |
| `01-架构设计.md` | 提供横切配置与变更控制、外围增强隔离和风险挂起口径。 | 支撑禁止配置绕过架构边界。 |
| `02-概要设计.md` §11 | 提供配置影响轮廓、禁止配置化边界和 03 / 04 分工。 | 支撑范围 / 非范围候选。 |
| `03-详细设计.md` §13 / §16 | 提供 config binding、runtime builder、adapter binding、forbidden configurable boundary 和 downstream owner。 | 支撑 Step 2 范围候选和 03 回写判断。 |
| L1-governance Step 2 | 提供表格深度、结构化收口方式和门禁表达。 | 只参考框架,不复制 governance 领域事实。 |

### 4. Step 2 输入承接思考

| 输入族 | 可进入 Step 2 的内容 | 不得进入 Step 2 的内容 |
|---|---|---|
| Step 1 final output | 权威输入边界、旧材料隔离、SOP 五问、03 影响判定框架。 | 具体配置项、key、默认值、secret、topic、URL、JSON demo。 |
| 需求 / 架构 | 方法资产定义 truth、Definition vs Use、相邻仓非职责、配置不得绕过核心边界。 | 新需求、新架构方案、部署命令、产品选择。 |
| 概要配置影响 | 受配置影响的 entry、adapter、read material、job、publisher、handoff、diagnostics 和禁止配置化边界。 | 把配置开关用于改变 truth owner、状态机、事务或 P0/P1 范围。 |
| 详细设计配置绑定 | runtime assembly、storage/source/resolver/publisher/handoff、target registry、query/read policy、retry/job、diagnostics。 | 新增 object / trait / port / DTO / mapper / marker / evidence schema。 |
| 旧 `05/06/07` | 测试环境、验收环境、实施承接方向提醒。 | 旧 TC、AC、phase、commit boundary、PostgreSQL、object storage、fake bus 等当前正式结论。 |

### 5. Step 2 候选讨论轴思考

| 讨论轴 | R2.2 后续写入入口 |
|---|---|
| 配置设计目标 | 本轮 04 应把详细设计中的 config binding 转成配置控制面、范围、来源、加载、敏感性、失效和下游承接。 |
| 本轮覆盖范围 | runtime assembly、adapter binding、external binding、query/read policy、retry/job、diagnostics/redaction 等候选范围。 |
| 非范围 | 部署命令、产品选型、测试 case、验收 gate、implementation phase、runbook、代码契约新增。 |
| P0 / P1 / P2 口径 | 先区分最小可运行 / fake / disabled 控制面、产品化配置和长期增强配置。 |
| 无配置路径 | 基于 `03` §13 是否存在配置绑定点进行判定,但结论留给后续正式模块。 |
| 残余风险 | 产品未选型、旧下游未重启、范围扩展和配置触发 03 回写风险。 |

### 6. L1-governance 框架参考思考

| 参考项 | 可借鉴 | 不可复制 |
|---|---|---|
| Step 状态表 | 当前 Step、状态、输入基线、输出文件、停审方式。 | governance 的具体配置域和产品判断。 |
| SOP 问题回答 | 按 SOP 五问组织 P0 / P1 / P2、部署运维、实施计划和残余风险。 | governance 的 runtime / store / GRC 事实。 |
| 结构化中间产物 | 目标表、覆盖范围表、P0/P1/P2 表、非范围表、无配置路径判定、风险表、03 影响判定。 | 直接复用 governance 的配置项示例。 |
| 收口方式 | Step 2 最终进入 Step 3 的条件要可审查。 | 一次性跳过本仓自己的逐模块讨论。 |

### 7. R2.2 写入计划思考

`R2.2 开工与必读文档:再写入` 应把 R2.1 思考落成可恢复记录:

1. 写 Step 2 当前模块目标和允许 / 禁止范围。
2. 写 Step 2 输入基线表。
3. 写必读文档清单。
4. 写 Step 2 候选讨论轴。
5. 写 L1-governance 框架参考规则。
6. 写对 `03-详细设计.md` 的影响判定框架。
7. 写 `R2.3 SOP 问题回答与范围候选:先思考` 进入门禁。
8. 不写正式范围结论、P0/P1/P2 正式表、无配置路径最终判定或配置项清单。

### 8. R2.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按台账从 Step 1 进入 Step 2 | pass |
| 是否只推进 R2.1 一个模块 | pass |
| 是否创建 Step 2 中间产物文件 | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写配置项、JSON demo、secret schema、测试、验收、实施或代码 | pass |
| 是否形成 R2.2 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.2 开工与必读文档:再写入`;只允许把 R2.1 思考落成 Step 2 当前模块目标、输入基线、必读文档清单、候选讨论轴、L1-governance 框架参考规则、03 影响判定框架和 R2.3 进入门禁;不得创建正式 `04-配置设计.md`;不得写配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。

---

## R2.2 开工与必读文档:再写入

### 1. 当前模块目标

`R2.2` 将 `R2.1` 的开工思考落成 Step 2 可恢复记录。当前模块只固定 Step 2 输入基线、必读文档、候选讨论轴、L1-governance 框架参考规则、对 `03-详细设计.md` 的影响判定框架和 `R2.3` 进入门禁。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块允许 | 写入 Step 2 当前模块目标、输入基线、必读文档清单、候选讨论轴、L1-governance 框架参考规则、03 影响判定框架和下一模块门禁。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写配置目标正式表、范围正式表、P0/P1/P2 正式口径、无配置路径最终判定、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |
| 当前恢复依据 | Step 1 已完成 final output;项目台账和 flow 指向 Step 2 `R2.1` completed,用户确认后进入 `R2.2`。 |

### 2. Step 2 输入基线

| 输入 | 当前定位 | Step 2 用法 | 禁止用法 |
|---|---|---|---|
| Step 1 final output | 直接输入 | 继承权威输入边界、旧材料隔离、SOP 五问和 03 影响判定框架。 | 不把 Step 1 候选配置域升级为正式配置项。 |
| `00-需求文档.md` | 正式上游 | 提供仓目标、非目标、Definition vs Use、相邻仓职责和依赖裁剪。 | 不重新定义需求目标或验收范围。 |
| `01-架构设计.md` | 正式上游 | 提供配置不得绕过核心边界、truth owner、外围增强隔离和风险挂起口径。 | 不新增架构方案、产品选型或部署机制。 |
| `02-概要设计.md` §11 | 正式上游 | 提供配置影响轮廓、禁止配置化边界和 03 / 04 分工。 | 不把概要影响点直接写成 key / JSON / secret。 |
| `03-详细设计.md` §13 / §16 | 直接输入 | 提供 config binding、runtime builder、adapter binding、forbidden configurable boundary 和 downstream owner。 | 不新增 object、trait / port、DTO、mapper、marker、state 或 evidence schema。 |
| 旧 `05/06/07` | old_direction_input | 只提醒后续测试 / 验收 / 实施承接方向。 | 不反向定义配置范围、TC、AC、phase、commit boundary 或产品选择。 |
| L1-governance Step 2 | framework_reference | 参考结构深度、表格组织和停审门禁。 | 不复制 governance 领域配置事实。 |

### 3. 必读文档清单

| 必读文档 | 读取状态 | 本 Step 用途 |
|---|---|---|
| `projects/L3-method-library/design-calibration/project_execution_ledger.md` | pass | 确认 Step 2 当前模块、gate_status 和 next_allowed_action。 |
| `projects/L3-method-library/design-calibration/04_config_calibration_flow.md` | pass | 确认 Step 2 主题、状态表、执行纪律和 Step 文件路径。 |
| `projects/L3-method-library/design-calibration/04_config_step_01_upstream_boundary.md` | pass | 承接 Step 1 final output、Step 2 输入边界和 R2.1 门禁。 |
| `standards/document/配置设计讨论流程_SOP.md` | pass | 固定 Step 2 目标、输入、输出、应问问题、非范围去向和进入下一步条件。 |
| `standards/document/配置设计书写规范.md` | pass | 固定正式 04 §2 写法、无配置说明规则和配置结论回写 03 的要求。 |
| `standards/document/设计文档讨论中间产物规范.md` | pass | 固定逐模块、先思考后写入、台账同步和不得批量越过模块的纪律。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | pass | 固定缺 schema / port / mapper / config / evidence 时必须暂停回设计。 |
| `projects/L3-method-library/00-需求文档.md` | pass | 提供 Step 2 配置目标 / 非范围的需求层依据。 |
| `projects/L3-method-library/01-架构设计.md` | pass | 提供配置与变更控制、外围增强隔离和风险挂起依据。 |
| `projects/L3-method-library/02-概要设计.md` | pass | 提供配置影响轮廓和禁止配置化边界。 |
| `projects/L3-method-library/03-详细设计.md` | pass | 提供 §13 config binding、§16 handoff 和详细设计回写边界。 |
| `projects/L1-governance/design-calibration/04_config_step_02_scope.md` | pass | 只参考 Step 2 范围 / 非范围框架深度。 |

### 4. Step 2 候选讨论轴

| 讨论轴 | 当前入口 | 后续模块 |
|---|---|---|
| 配置设计目标 | 将 `03` 中的 config binding 转成 04 的配置控制面、来源、加载、敏感性、失效和下游承接。 | R2.3 / R2.4 |
| 覆盖范围 | runtime assembly、adapter binding、external binding、query/read policy、retry/job、diagnostics/redaction 等候选范围。 | R2.3 / R2.4 |
| 非范围 | 部署命令、产品选型、测试 case、验收 gate、implementation phase、runbook、代码契约新增。 | R2.7 / R2.8 |
| P0 / P1 / P2 口径 | 区分最小可运行 / fake / disabled 控制面、产品化配置和长期增强配置。 | R2.5 / R2.6 |
| 无配置路径 | 基于 `03` §13 是否存在配置绑定点进行判定。 | R2.5 / R2.6 |
| 残余风险 | 产品未选型、旧下游未重启、范围扩展和配置触发 03 回写风险。 | R2.7 / R2.8 |

### 5. L1-governance 框架参考规则

| 参考项 | 采用规则 |
|---|---|
| Step 状态表达 | 可以借鉴其“当前 Step / 当前状态 / 输入基线 / 输出文件 / 停审方式”的结构。 |
| SOP 问题回答 | 可以借鉴按五问拆解 P0、P1/P2、部署运维、实施计划和残余风险的顺序。 |
| 结构化中间产物 | 可以借鉴目标表、覆盖范围表、P0/P1/P2 表、非范围表、无配置路径判定、风险表、03 影响判定。 |
| 禁止复制内容 | 不复制 governance 的 runtime、store、GRC、产品、环境或具体配置事实。 |
| 本仓优先级 | 若 L1-governance 框架与 L3 正式 `00/01/02/03` 冲突,以 L3 正式文档和当前 Step 1 final output 为准。 |

### 6. 对 03 的影响判定框架

| 配置讨论类型 | 是否影响 03 | 处理规则 |
|---|---|---|
| 只确认配置目标、范围、非范围、P0/P1/P2 层级或无配置路径 | 通常否 | 记录为 `无回写`。 |
| 只明确具体配置项后续归属、来源、优先级、profile、敏感性或失败策略 | 通常否 | 留在后续 04 Step 中继续讨论。 |
| 需要新增 runtime config carrier、adapter constructor 参数、trait / port、DTO、error、mapper、marker 或 flow | 是 | 标记 `阻塞待确认`,回 `03-详细设计.md` owning Step。 |
| 试图用配置改变 truth owner、state transition、query no-write、stored replay、transaction boundary、marker source 或 body-free rule | 是且越界 | 立即暂停,不得在 04 内补口。 |
| 旧 `05/06/07` 与当前 03/04 输入冲突 | 否 | 旧下游继续降级为 direction input,不得反向覆盖当前 03/04。 |

固定记录格式:

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 待 R2.3 起逐项填写 | 待判定 | 待判定 | 待判定 | 待判定 |

### 7. R2.3 进入门禁

`R2.3 SOP 问题回答与范围候选:先思考` 只能在以下条件满足后进入:

| 门禁项 | 结果 |
|---|---|
| Step 2 输入基线已固定 | pass |
| 必读文档清单已写入 | pass |
| 候选讨论轴已写入 | pass |
| L1-governance 框架参考规则已写入 | pass |
| 对 `03-详细设计.md` 的影响判定框架已写入 | pass |
| 未创建正式 `04-配置设计.md`,未写配置项、JSON、secret、测试、验收、实施或代码 | pass |

### 8. R2.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R2.2 一个模块 | pass |
| 是否把 R2.1 思考落成结构化记录 | pass |
| 是否未写正式范围结论、P0/P1/P2 正式表或无配置路径最终判定 | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写配置项、JSON demo、secret schema、测试、验收、实施或代码 | pass |
| 是否形成 R2.3 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.3 SOP 问题回答与范围候选:先思考`;只允许围绕 SOP Step 2 五问形成配置目标候选、范围候选、非范围候选、P0/P1/P2 候选、无配置路径候选、残余风险候选和 R2.4 写入计划;不得创建正式 `04-配置设计.md`;不得写配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。

---

## R2.3 SOP 问题回答与范围候选:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 围绕 SOP Step 2 五问形成配置目标、范围、非范围、P0/P1/P2、无配置路径和残余风险候选,为 R2.4 写入结构化记录做准备。 |
| 本模块允许 | 写候选思考、候选来源、取舍方向、03 影响预判和 R2.4 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不把候选升级为正式结论;不写配置项 key、默认值、profile merge order、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |
| 当前恢复依据 | R2.2 已固定输入基线、必读清单、候选讨论轴、L1-governance 框架参考规则和 03 影响判定框架。 |

### 2. SOP 五问候选思考

| SOP 问题 | 候选回答方向 | 依据 | R2.4 写入注意 |
|---|---|---|---|
| P0 必须定义哪些配置才能运行主链? | 候选 P0 只覆盖能让本仓按 fake / in-memory / disabled / unavailable 语义启动并验证主链的配置控制面:runtime assembly、storage adapter、source / resolver adapter、publisher / handoff target、query/read policy handle、retry/job numeric handle、diagnostics/redaction guard。 | `03` §13 定义 config reference families、runtime builder、adapter availability 和 forbidden configurable boundary。 | 只能写控制面和范围,不能写具体 key、默认值、topic、URL、secret 或产品。 |
| 哪些配置属于 P1 / P2 或后续扩展? | 候选 P1 是 durable / real-like adapter、broker、diagnostic sink、archive / handoff target 和 staging profile;候选 P2 是 multi-region、tenant profile、advanced capacity、vendor-specific adapter 和深度 external integration。 | `03` §16 把 concrete config schema/products 交给 04,把 durable product / broker / metrics / DLQ / runbook choice 标为下游 owner。 | P1/P2 在 R2.4 只能作为范围层级候选,不得变成实施承诺。 |
| 哪些配置细节应留给部署与运维手册? | 候选非范围包括容器挂载、secret provider 操作、证书安装、真实 endpoint 填写、发布命令、环境文件分发、监控面板和值班处置。 | 配置设计书写规范要求配置设计不写部署命令,只定义语义、来源、优先级、校验、失效和审计。 | 非范围必须写明去向,避免静默丢失。 |
| 哪些配置细节应留给实施计划? | 候选非范围包括 phase / commit boundary、实现顺序、CI command、required_checks、adapter 切换批次、证据生成脚本和回退提交策略。 | `03` §16 明确 03/04 不定义 implementation boundary;正式实施只能由 `07` 和 ledger 承接。 | R2.4 不得写实施计划或 gate,只写“交给 07”。 |
| 哪些非范围仍有残余风险? | 候选风险包括生产产品未选型、旧 `05/06/07` 未重启、P1/P2 污染 P0、配置讨论触发 03 新字段 / port / mapper、旧 MethodContent / publish / outbox 主线回流。 | Step 1 旧材料隔离、`03` §13/§16 和 §17 downstream pending。 | 风险只作为 Step 2 候选,后续 R2.7/R2.8 再收口。 |

### 3. 配置目标候选思考

| 目标候选 | 说明 | 下游承接方向 |
|---|---|---|
| 收稳配置控制面 | 把 `03` §13 的 runtime slot、adapter implementation、target binding、profile identity 和 numeric policy value 来源转成 04 可讨论范围。 | Step 3 控制面总览。 |
| 收稳禁止配置化边界 | 保证配置不能改变 truth owner、DTO schema、state transition、query no-write、stored replay、transaction boundary、marker source 或 body-free rule。 | Step 4 分类与禁止配置化边界。 |
| 收稳来源与优先级 | 后续明确 raw config、validated config、secret ref、profile、test fixture 等来源与冲突处理。 | Step 5 来源优先级。 |
| 收稳环境与 profile | 后续重建 dev/test/staging/production-like profile 差异,不继承旧 `05/06/07`。 | Step 6 profile 矩阵。 |
| 收稳加载、校验与失效 | 后续明确 infra/bootstrap raw config 可见性、validated settings、safe issue、runtime availability 和 fail-fast / degraded / unavailable。 | Step 9 / Step 11。 |
| 收稳下游承接 | 给 `05/06/07` 提供配置矩阵、测试切口、验收红线和实施准备输入,但不替它们写 TC、AC 或 commit boundary。 | Step 12 下游承接。 |

### 4. 范围候选思考

| 范围候选 | 当前思考 | 是否可能影响 03 |
|---|---|---|
| runtime assembly | 应覆盖 runtime profile、entry readiness、adapter slot 和 runtime assembly summary 的配置控制面。 | 通常否;若需要新增 runtime config carrier 字段则是。 |
| storage / repository adapter binding | 应覆盖 fake / in-memory / durable binding 的选择和可用性语义。 | 通常否;若新增 repository port 或 constructor 参数则是。 |
| source / resolver adapter binding | 应覆盖外部来源解析、unrecognized / unavailable / body violation 等 safe outcome 的配置边界。 | 通常否;若新增 resolver summary / marker 来源则是。 |
| publisher / handoff / target binding | 应覆盖 publisher target、handoff target、target registry 和 availability branch 的配置控制面。 | 通常否;若新增 public outcome 字段则是。 |
| query/read policy handles | 应覆盖 page/body limit、freshness threshold handle、availability source binding 等 policy handle。 | 通常否;若用配置改变 query no-write 或 marker source 则越界。 |
| retry / job numeric handles | 应覆盖 retention、retry、lease、batch 等 numeric policy value 的来源和失效策略。 | 通常否;若改变 §12 idempotency/replay 语义则越界。 |
| diagnostics / redaction | 应覆盖 safe config issue、redacted diagnostic、body-free guard 和 forbidden raw value 输出。 | 通常否;若新增 observability schema 则回 `03` 或后续 owner。 |

### 5. 无配置路径候选思考

| 判断项 | 候选判断 | 理由 |
|---|---|---|
| 是否存在配置绑定点 | 候选为是 | `03` §13 已列 runtime assembly、storage adapter、entry exposure、query/read policy、replay/retry、runner/target binding 和 diagnostics。 |
| 是否可直接走无配置说明文档 | 候选为否 | 即使不锁定具体产品,仍需要说明 fake / disabled / unavailable / redaction / runtime readiness 的控制面。 |
| 是否允许跳过 Step 3~13 | 候选为否 | 当前存在多个配置控制面;后续 Step 应继续拆控制面、分类、来源、profile、配置项、secret、加载和失效。 |
| 是否需要保留无配置规则 | 是 | 若后续某个子域确认无配置,仍按 SOP 留痕,不得跳过中间产物。 |

### 6. 03 影响预判

| 候选结论 | 是否影响 03 | 预判理由 | R2.4 处理 |
|---|---|---|---|
| Step 2 只定义配置目标、范围和非范围 | 否 | 属于 04 文档范围收敛,不新增代码契约。 | 写为无回写候选。 |
| 本仓不是无配置项目 | 否 | 依据 `03` 已有配置绑定点判断,不改变 `03`。 | 写为无回写候选。 |
| P0 只覆盖控制面,不锁定具体 key/product | 否 | 承接 `03` §13 / §16 的下游 owner。 | 写为无回写候选。 |
| 后续若发现缺 runtime config carrier / adapter constructor / port / mapper / marker | 是 | 属于详细设计代码契约缺口。 | 标记为阻塞待确认,回 owning Step。 |
| 任何用配置改变 truth/state/query/replay/transaction/marker/body-free rule 的方案 | 是且越界 | 违反 `03` §13.7 forbidden configurable boundary。 | 立即暂停,不得在 04 内补口。 |

### 7. R2.4 写入计划思考

`R2.4 SOP 问题回答与范围候选:再写入` 应将 R2.3 的候选思考落成结构化记录:

1. 写 SOP 五问候选回答表。
2. 写配置设计目标候选表。
3. 写范围候选表。
4. 写非范围候选表及去向。
5. 写 P0 / P1 / P2 候选口径。
6. 写无配置路径候选判定。
7. 写残余风险候选。
8. 写对 `03-详细设计.md` 的影响候选判定。
9. 写 R2.5 进入门禁。
10. 不写具体配置项清单、key、默认值、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。

### 8. R2.3 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R2.3 一个模块 | pass |
| 是否围绕 SOP Step 2 五问形成候选思考 | pass |
| 是否未把候选升级为正式范围结论 | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写配置项、JSON demo、secret schema、测试、验收、实施或代码 | pass |
| 是否形成 R2.4 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.4 SOP 问题回答与范围候选:再写入`;只允许把 R2.3 候选思考落成 SOP 五问候选回答、配置目标候选、范围候选、非范围候选、P0/P1/P2 候选、无配置路径候选、残余风险候选、03 影响候选判定和 R2.5 进入门禁;不得创建正式 `04-配置设计.md`;不得写配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。

---

## R2.4 SOP 问题回答与范围候选:再写入

### 1. 当前模块目标

`R2.4` 将 `R2.3` 的候选思考落成 Step 2 可恢复的结构化候选记录。当前模块仍然只形成候选,不把目标、范围、非范围、P0/P1/P2 或无配置路径升级为最终正式结论。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块允许 | 写入 SOP 五问候选回答、配置目标候选、范围候选、非范围候选、P0/P1/P2 候选、无配置路径候选、残余风险候选、03 影响候选判定和下一模块门禁。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写配置项 key、默认值、profile merge order、JSON demo、secret schema、测试方案、验收标准、实施计划或代码;不锁定具体产品。 |
| 当前恢复依据 | R2.3 已形成候选思考,且未发现阻塞 R2.4 的 03 回写缺口。 |

### 2. SOP 五问候选回答

| SOP 问题 | 候选回答 | 候选状态 |
|---|---|---|
| P0 必须定义哪些配置才能运行主链? | P0 候选只覆盖主链能启动、fake / in-memory / disabled / unavailable 能被表达、entry 能做 readiness precheck、adapter slot 能被装配、safe config issue 能被报告的配置控制面。候选范围包括 runtime assembly、storage / repository adapter binding、source / resolver adapter binding、publisher / handoff / target binding、query/read policy handle、retry/job numeric handle、diagnostics / redaction guard。 | 待 R2.5/R2.6 收口。 |
| 哪些配置属于 P1 / P2 或后续扩展? | P1 候选覆盖 durable / real-like adapter、broker、diagnostic sink、archive / handoff target、staging profile 和外部集成 fake-to-real 切换。P2 候选覆盖 multi-region、tenant profile、advanced capacity、vendor-specific adapter、复杂策略变体和深度 external integration。 | 待 R2.5/R2.6 分层。 |
| 哪些配置细节应留给部署与运维手册? | 容器挂载、secret provider 操作、证书安装、真实 endpoint 填写、发布命令、环境文件分发、监控面板、告警规则和值班处置留给部署与运维手册。 | 待 R2.7/R2.8 写入非范围去向。 |
| 哪些配置细节应留给实施计划? | phase / commit boundary、实现顺序、CI command、required_checks、adapter 切换批次、证据生成脚本、回退提交策略和 implementation ledger 交给 `07-实施计划.md`。 | 待 R2.7/R2.8 写入非范围去向。 |
| 哪些非范围仍有残余风险? | 生产产品未选型、旧 `05/06/07` 未重启、P1/P2 污染 P0、配置讨论触发 03 新字段 / port / mapper、旧 MethodContent / publish / outbox 主线回流,都需要后续风险表承接。 | 待 R2.7/R2.8 收口。 |

### 3. 配置设计目标候选

| 目标候选 | 说明 | 交付给下游的候选结果 |
|---|---|---|
| 收稳配置控制面 | 将 `03` §13 的 runtime slot、adapter implementation、target binding、profile identity 和 numeric policy value 来源转成 04 的配置讨论范围。 | Step 3 配置控制面总览。 |
| 收稳禁止配置化边界 | 明确配置不得改变 truth owner、DTO schema、state transition、query no-write、stored replay、transaction boundary、marker source 或 body-free rule。 | Step 4 配置分类与禁止配置化边界。 |
| 收稳配置来源与冲突处理 | 后续明确 raw config、validated config、secret ref、profile、test fixture 等来源和冲突处理规则。 | Step 5 来源、优先级与冲突处理。 |
| 收稳环境与 profile 差异 | 后续重建 dev / test / staging / production-like profile 差异,不继承旧 `05/06/07`。 | Step 6 环境、部署 profile 与配置矩阵。 |
| 收稳配置项表达 | 后续只在已有 03 binding 和 Step 3~6 范围内形成配置项清单。 | Step 7 配置项清单。 |
| 收稳敏感配置与安全输出 | 后续明确 secret、endpoint、DSN、token、cert 等敏感材料的引用和禁止输出边界。 | Step 8 敏感配置与密钥管理。 |
| 收稳加载、校验和失效 | 后续明确 infra/bootstrap raw config 可见性、validated settings、safe issue、runtime availability、fail-fast、degraded 和 unavailable。 | Step 9 / Step 11。 |
| 收稳下游承接 | 给 `05/06/07` 提供配置矩阵、测试切口、验收红线和实施准备输入,但不替它们写 TC、AC 或 commit boundary。 | Step 12 下游承接。 |

### 4. 范围候选表

| 范围候选 | 必须覆盖的候选内容 | 后续 Step | 03 影响候选 |
|---|---|---|---|
| runtime assembly | runtime profile、entry readiness、adapter slot、runtime assembly summary。 | Step 3 / 6 / 7 / 9 / 11 | 无回写候选;若新增 carrier 字段则阻塞回 03。 |
| storage / repository adapter binding | fake / in-memory / durable binding、pool/connection handle、adapter availability。 | Step 3 / 5 / 7 / 9 / 11 | 无回写候选;不得改变 logical store。 |
| source / resolver adapter binding | 外部来源解析、recognized / unrecognized / unavailable / body violation safe outcome。 | Step 3 / 7 / 8 / 11 | 无回写候选;不得私造 marker。 |
| publisher / handoff / target binding | publisher target、handoff target、target registry、availability branch。 | Step 3 / 6 / 7 / 11 | 无回写候选;不得改变 outcome semantics。 |
| query/read policy handle | page/body limit、freshness threshold handle、availability source binding。 | Step 3 / 4 / 7 / 9 / 11 | 无回写候选;不得配置开启 query write。 |
| retry / job numeric handle | retention、retry、lease、batch 等 numeric policy value 的来源和失效策略。 | Step 3 / 5 / 7 / 9 / 11 | 无回写候选;不得改变 stored replay / checkpoint semantics。 |
| diagnostics / redaction | safe config issue、redacted diagnostic、body-free guard、forbidden raw value 输出。 | Step 4 / 7 / 8 / 9 / 12 | 无回写候选;若新增 schema 则回 owning source。 |
| downstream handoff | `05/06/07` 如何引用配置矩阵、配置红线和实施输入。 | Step 12 | 无回写候选;不得替下游写 TC / AC / phase。 |

### 5. 非范围候选表

| 非范围候选 | 留给哪一层 / 哪份文档 | 残余风险候选 |
|---|---|---|
| 需求目标、业务规则和验收目标重写 | `00-需求文档.md` / `06-验收标准.md` | 若配置讨论反向改需求,必须暂停回上游。 |
| 架构方案、产品选型和 ADR 裁决 | `01-架构设计.md` / ADR / `07-实施计划.md` | 产品未锁定会影响后续默认值、secret 类型和验收 evidence。 |
| 对象、trait、DTO、flow、state、error、mapper、marker 和 runtime builder 签名新增 | `03-详细设计.md` | 若配置项需要新增代码契约,必须回写 03。 |
| 完整测试矩阵、测试数据、自动化脚本和 evidence 路径 | `05-测试方案.md` | 旧测试方案未重启会污染配置矩阵。 |
| acceptance gate、release veto、coverage threshold 和验收报告口径 | `06-验收标准.md` | 旧验收标准未重启会误用旧 P0 / MethodContent。 |
| phase / commit boundary、required_reads、allowed_scope、required_checks 和 implementation ledger | `07-实施计划.md` | 实施 agent 可能越过配置真相源自行补口。 |
| 容器编排、挂载、secret provider 操作、证书安装、发布命令和 runbook | 部署与运维手册 | 真实环境操作缺口后续仍需 ops 文档承接。 |
| vendor-specific capacity、multi-region、tenant profile 和高级策略变体 | 后续版本 / ADR / 运维 | P2 若提前进入 P0 会扩大范围。 |

### 6. P0 / P1 / P2 候选口径

| 等级 | 候选口径 | 候选示例类型 | 本轮处理 |
|---|---|---|---|
| P0 | 支撑 fake / in-memory / disabled / unavailable 主链、contract / service / integration test、safe config issue 和 body-free guard 的最小控制面。 | runtime mode、adapter slot、fake / in-memory store binding、disabled external target、safe diagnostics、redaction guard、basic numeric handle。 | Step 2 先作为候选;R2.5/R2.6 再收口。 |
| P1 | 支撑 staging / real-like adapter、durable store、real-like broker、diagnostic sink、archive / handoff target 和外部集成迁移的产品化控制面。 | durable store ref、broker endpoint ref、diagnostic sink ref、archive target ref、external adapter target ref。 | 本轮定义控制面和待确认项,不锁定具体产品。 |
| P2 | 支撑生产优化、多区域、多租户、复杂容量、vendor-specific 深度集成和高级策略变体的长期增强控制面。 | tenant profile、regional endpoint、capacity knobs、vendor-specific schema、advanced policy toggles。 | 只记录非范围 / 演进触发,不进入 P0 配置项。 |

### 7. 无配置路径候选判定

| 判断项 | 候选判定 | 依据 |
|---|---|---|
| 是否存在 runtime / adapter 配置绑定点 | 是 | `03` §13 已列 runtime assembly、storage adapter、entry exposure、query/read policy、replay/retry、runner/target binding 和 diagnostics。 |
| 是否可以直接声明本仓无配置 | 否 | 即使不锁定产品,仍需说明 fake / disabled / unavailable / redaction / runtime readiness 控制面。 |
| 是否允许跳过 Step 3~13 | 否 | 当前存在多个配置控制面,后续仍需拆分类、来源、profile、配置项、secret、加载、变更和失效。 |
| 是否需要保留无配置留痕规则 | 是 | 若后续某个子域确认无配置,仍按 SOP 留痕,不得跳过中间产物或正式说明。 |

候选结论: L3-method-library 当前不走整体无配置说明文档路径。该结论仍为候选,待 R2.5/R2.6 收口。

### 8. 残余风险候选

| 风险候选 | 影响 | 当前处理候选 |
|---|---|---|
| durable store / broker / metrics / DLQ / external target 产品未锁定 | 影响 Step 7 / Step 8 / Step 11 / 验收 evidence。 | Step 2 只定义 product-neutral 控制面;具体产品后续待确认。 |
| 旧 `05/06/07` 未按当前 `03/04` 重启 | 影响测试矩阵、验收门禁和实施边界。 | 继续标为 old_direction_input,不得反向覆盖 04。 |
| P1/P2 配置污染 P0 | 扩大本轮范围并冲击实施计划。 | R2.5/R2.6 明确 P0/P1/P2 分层。 |
| 配置讨论触发新 03 契约 | 影响可落码性和实现边界。 | 一旦出现 runtime config carrier、constructor、port、mapper、marker 等缺口,暂停回 03。 |
| 旧 MethodContent / publish / snapshot / outbox 主线回流 | 污染当前方法资产定义 truth。 | 继续按 Step 1 旧材料隔离处理。 |

### 9. 对 03 的影响候选判定

| 配置候选结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| Step 2 只定义配置目标、范围、非范围和层级候选 | 否 | 04 范围收敛 | 不适用 | 无回写候选 |
| 本仓不走整体无配置路径 | 否 | 根据 `03` §13 已有 binding 判断 | 不适用 | 无回写候选 |
| P0 候选只覆盖控制面,不锁定 key / default / product | 否 | 承接 `03` §13 / §16 下游 owner | 不适用 | 无回写候选 |
| P1/P2 候选作为产品化 / 长期增强,不进入 P0 | 否 | 范围分层 | 不适用 | 无回写候选 |
| 后续具体配置项需要新增 runtime config carrier、adapter constructor 参数、trait / port、DTO、error、mapper、marker 或 flow | 是 | 代码契约变更 | `03` owning Step | 阻塞待确认 |
| 用配置改变 truth owner、state transition、query no-write、stored replay、transaction boundary、marker source 或 body-free rule | 是且越界 | 违反 forbidden configurable boundary | `03` §13.7 | 立即暂停 |

### 10. R2.5 进入门禁

`R2.5 P0/P1/P2 与无配置路径收口:先思考` 只能在以下条件满足后进入:

| 门禁项 | 结果 |
|---|---|
| SOP 五问候选回答已写入 | pass |
| 配置设计目标候选已写入 | pass |
| 范围 / 非范围候选已写入 | pass |
| P0 / P1 / P2 候选口径已写入 | pass |
| 无配置路径候选判定已写入 | pass |
| 残余风险候选已写入 | pass |
| 对 `03-详细设计.md` 的影响候选判定已写入 | pass |
| 未创建正式 `04-配置设计.md`,未写配置项、JSON、secret、测试、验收、实施或代码 | pass |

### 11. R2.4 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R2.4 一个模块 | pass |
| 是否把 R2.3 候选思考落成结构化候选记录 | pass |
| 是否未把候选升级为最终正式结论 | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写配置项、JSON demo、secret schema、测试、验收、实施或代码 | pass |
| 是否形成 R2.5 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.5 P0/P1/P2 与无配置路径收口:先思考`;只允许围绕 R2.4 候选记录思考 P0/P1/P2 分层、无配置路径最终候选、范围收敛风险和 R2.6 写入计划;不得创建正式 `04-配置设计.md`;不得写配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。

---

## R2.5 P0/P1/P2 与无配置路径收口:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 思考如何把 R2.4 的 P0/P1/P2 候选、无配置路径候选和范围风险收敛成可写入记录。 |
| 本模块允许 | 写 P0/P1/P2 分层判断、无配置路径判断、范围收敛风险、03 影响预判和 R2.6 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写配置项 key、默认值、profile merge order、JSON demo、secret schema、测试方案、验收标准、实施计划或代码;不锁定具体产品。 |
| 当前恢复依据 | R2.4 已写入 SOP 五问候选回答、目标 / 范围 / 非范围候选、P0/P1/P2 候选、无配置路径候选、残余风险候选和 03 影响候选判定。 |

### 2. P0 分层收口思考

P0 的收口标准不应是“生产可用”或“产品已选型”,而应是本仓主链在当前 `03-详细设计.md` 约束下能被装配、能表达 adapter availability、能暴露 safe config issue、能保持 fake / in-memory / disabled / unavailable 语义,并且不改变任何业务真相或 public schema。

| P0 判断维度 | 收口思考 | 禁止越界 |
|---|---|---|
| 主链装配 | runtime assembly、entry readiness、adapter slot 和 runtime summary 属于 P0 控制面。 | 不写具体 key / default / profile merge order。 |
| fake / in-memory baseline | 本地和测试可运行需要 fake / in-memory binding 和 disabled external target 的正式配置语义。 | 不把 fake fixture 当 truth source 或 marker source。 |
| safe failure | config invalid、adapter disabled/degraded/unavailable 必须能生成 safe issue / availability surface。 | 不把 raw config / raw adapter error 暴露为 public marker。 |
| forbidden boundary | P0 必须包含禁止配置化红线,否则后续配置项容易绕过 03。 | 不允许配置改变 truth、state、query no-write、stored replay、transaction 或 body-free rule。 |
| downstream readiness | P0 只给 05/06/07 输入,不替它们生成 TC、AC 或 commit boundary。 | 不把 cargo check / unit test 写成正式 evidence schema。 |

### 3. P1/P2 分层收口思考

P1 和 P2 的差异不是“是否重要”,而是是否需要具体产品、真实环境、容量/区域/租户策略或长期演进才能稳定。R2.6 应把这些能力留在控制面和待确认项,避免提前挤入 P0。

| 等级 | 收口思考 | 处理边界 |
|---|---|---|
| P1 | durable / real-like adapter、broker、diagnostic sink、archive / handoff target、staging profile 和外部集成 fake-to-real 切换可以作为本轮控制面,但不锁定产品。 | 后续 Step 7~14 可记录 product-neutral ref / 待确认项。 |
| P2 | multi-region、tenant profile、advanced capacity、vendor-specific adapter、复杂策略变体和深度 external integration 属于长期增强。 | Step 2 只记录非范围 / 演进触发,不得进入 P0 配置项。 |
| 边界风险 | 如果 P1/P2 被写成 P0,会迫使 `04` 提前定义产品、secret、endpoint、验收 evidence 和实施 boundary。 | R2.6 必须明确 P1/P2 不阻塞 P0 主链。 |

### 4. 无配置路径收口思考

整体无配置路径不成立。原因不是当前已经有具体配置 key,而是 `03` 已经明确存在配置绑定点和 downstream owner:`04` 必须闭口具体 key / secret / endpoint / topic / numeric values / profile merge order。因此 Step 3~13 不能跳过。

| 判断项 | 收口思考 | R2.6 写入方向 |
|---|---|---|
| 是否存在配置绑定点 | 存在。`03` §13 已列 runtime assembly、storage adapter、entry exposure、query/read policy、replay/retry、runner/target binding 和 diagnostics。 | 写为整体无配置路径不成立。 |
| 是否已可定义具体配置项 | 还不可在 Step 2 定义。具体配置项必须等 Step 3~7。 | 写明 Step 2 不写 key/default。 |
| 是否可跳过 Step 3~13 | 不可。后续仍需控制面、分类、来源、profile、配置项、secret、加载、变更和失效。 | 写明 Step 3~13 继续适用。 |
| 子域无配置 | 后续某个子域若无配置,仍需留痕。 | 写入无配置规则保留。 |

### 5. 范围收敛风险思考

| 风险 | 收敛思路 | R2.6 写入注意 |
|---|---|---|
| 配置项提前展开 | Step 2 只能收口范围和层级,不能进入 key/default/schema。 | 明确 Step 7 才写配置项清单。 |
| 产品选择提前锁定 | DB / broker / metric / DLQ / external target 不能在 Step 2 固化。 | 写 product-neutral / 待确认。 |
| P1/P2 污染 P0 | P0 只保主链和 fake / disabled baseline。 | 写 P0 不被生产增强阻塞。 |
| 配置改变 03 语义 | 任何新增 carrier / constructor / port / mapper / marker 都要回 03。 | 保留阻塞待确认规则。 |
| 旧材料回流 | 旧 `05/06/07` 和旧 MethodContent 主线不得反向定义配置。 | 继续标为 old_direction_input。 |

### 6. 03 影响预判

| 收口项 | 是否影响 03 | 预判 |
|---|---|---|
| P0/P1/P2 分层本身 | 否 | 只做配置设计范围分层,不新增代码契约。 |
| 整体无配置路径不成立 | 否 | 根据 `03` §13 已有 binding 判断。 |
| Product-neutral 处理 P1/P2 | 否 | 承接 `03` §16 downstream owner。 |
| 后续要新增 runtime config carrier / adapter constructor / port / mapper / marker | 是 | 必须回 `03` owning Step,不能在 04 内补口。 |
| 用配置改变 forbidden boundary | 是且越界 | 立即暂停。 |

### 7. R2.6 写入计划思考

`R2.6 P0/P1/P2 与无配置路径收口:再写入` 应把 R2.5 思考落成结构化记录:

1. 写 P0 收口口径表。
2. 写 P1/P2 收口口径表。
3. 写整体无配置路径最终候选判定。
4. 写 Step 3~13 继续适用的理由。
5. 写范围收敛风险和处理规则。
6. 写 03 影响候选判定。
7. 写 R2.7 进入门禁。
8. 不写配置项清单、key、默认值、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。

### 8. R2.5 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R2.5 一个模块 | pass |
| 是否围绕 P0/P1/P2 与无配置路径做收口思考 | pass |
| 是否未写配置项、key、默认值或产品选择 | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写测试、验收、实施或代码 | pass |
| 是否形成 R2.6 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.6 P0/P1/P2 与无配置路径收口:再写入`;只允许把 R2.5 思考落成 P0/P1/P2 收口口径、整体无配置路径最终候选判定、Step 3~13 继续适用理由、范围收敛风险、03 影响候选判定和 R2.7 进入门禁;不得创建正式 `04-配置设计.md`;不得写配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。

---

## R2.6 P0/P1/P2 与无配置路径收口:再写入

### 1. 当前模块目标

`R2.6` 将 `R2.5` 的分层与无配置路径思考落成结构化记录。当前模块仍停留在 Step 2 范围层,不进入配置项清单、配置 key、默认值、profile merge order 或产品选择。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块允许 | 写入 P0/P1/P2 收口口径、整体无配置路径最终候选判定、Step 3~13 继续适用理由、范围收敛风险、03 影响候选判定和 R2.7 进入门禁。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写配置项 key、默认值、profile merge order、JSON demo、secret schema、测试方案、验收标准、实施计划或代码;不锁定具体产品。 |
| 当前恢复依据 | R2.5 已完成 P0/P1/P2 分层、整体无配置路径、范围收敛风险和 R2.6 写入计划思考。 |

### 2. P0 收口口径

| P0 维度 | 收口口径 | 后续承接 | 禁止事项 |
|---|---|---|---|
| runtime assembly | P0 必须覆盖 runtime profile、entry readiness、adapter slot 和 runtime assembly summary 的配置控制面。 | Step 3 / 6 / 7 / 9 / 11 | 不写具体 key、默认值或 profile merge order。 |
| fake / in-memory baseline | P0 必须覆盖本地 / 测试可运行的 fake / in-memory binding 和 disabled external target 语义。 | Step 3 / 5 / 6 / 7 | 不把 fake fixture、private map 或 raw string 当 truth / marker source。 |
| safe config issue | P0 必须能表达 invalid config、missing slot、adapter disabled/degraded/unavailable 的 safe issue / availability surface。 | Step 8 / 9 / 11 / 12 | 不把 raw config value、raw adapter error 或 health probe 当 public marker。 |
| forbidden configurable boundary | P0 必须保留配置不得改变 truth、state、query no-write、stored replay、transaction、marker source 和 body-free rule 的红线。 | Step 4 / 9 / 11 / 12 | 不允许用配置开关改变 `03` 语义。 |
| downstream input | P0 只给 `05/06/07` 提供配置矩阵、红线和实施输入。 | Step 12 | 不替下游生成 TC、AC、evidence schema、phase 或 commit boundary。 |

P0 收口候选:本轮配置设计必须覆盖 P0 控制面,但 P0 不等于生产产品化配置,也不要求 Step 2 锁定具体配置项。

### 3. P1 / P2 收口口径

| 等级 | 收口口径 | 本轮处理 | 不阻塞项 |
|---|---|---|---|
| P1 | durable / real-like adapter、broker、diagnostic sink、archive / handoff target、staging profile 和外部集成 fake-to-real 切换属于产品化控制面。 | 本轮可定义控制面、待确认项和 product-neutral ref;具体产品可挂起。 | 不阻塞 P0 fake / in-memory / disabled baseline。 |
| P2 | multi-region、tenant profile、advanced capacity、vendor-specific adapter、复杂策略变体和深度 external integration 属于长期增强。 | Step 2 只记录非范围 / 演进触发;后续 Step 13 / 14 承接。 | 不进入 P0 配置项,不扩大当前主链。 |
| 分层红线 | P1/P2 不能被写成 P0 必需项。 | R2.7/R2.8 在非范围和风险中继续标注。 | 不因为产品未锁定阻塞 Step 2 关闭。 |

### 4. 整体无配置路径最终候选判定

| 判断项 | 判定候选 | 依据 |
|---|---|---|
| 是否存在配置绑定点 | 是 | `03` §13 已定义 runtime assembly、storage adapter、entry exposure、query/read policy、replay/retry、runner/target binding 和 diagnostics。 |
| 是否可以直接声明本仓无配置 | 否 | 即使不锁定产品,仍需说明 fake / disabled / unavailable / redaction / runtime readiness 控制面。 |
| 是否允许跳过 Step 3~13 | 否 | 后续仍需拆控制面、分类、来源、profile、配置项、secret、加载、变更、失效和下游承接。 |
| 是否允许子域无配置 | 允许但必须留痕 | 若后续某个子域确认无配置,仍按 SOP 在对应 Step 留痕,不得静默跳过。 |

最终候选判定: L3-method-library 当前不走整体无配置说明文档路径;Step 3~13 继续适用。

### 5. Step 3~13 继续适用理由

| 后续 Step | 继续适用理由 |
|---|---|
| Step 3 控制面总览 | 当前已有多个 `03` config reference families,需要先形成总览。 |
| Step 4 分类与禁止配置化边界 | P0 必须保护 forbidden configurable boundary,防止配置改变 `03` 语义。 |
| Step 5 来源、优先级与冲突处理 | raw config、validated config、secret ref、profile 和 fixture 来源需要统一规则。 |
| Step 6 环境 / profile 矩阵 | dev/test/staging/production-like 差异需要重建,不能继承旧 `05/06/07`。 |
| Step 7 配置项清单 | 具体配置项只能在控制面、分类、来源和 profile 收口后生成。 |
| Step 8 敏感配置 | secret、endpoint、DSN、token、cert 等必须有引用和禁止输出边界。 |
| Step 9 加载、校验与生效 | `03` 要求 raw config 只在 infra/bootstrap 可见,需要加载校验闭口。 |
| Step 10 变更、审计与回滚 | 配置变更需要留痕和回滚语义,但不能改变业务 truth。 |
| Step 11 失效与降级 | invalid config、missing slot 和 adapter unavailable 需要 fail-fast / degraded / unavailable 策略。 |
| Step 12 下游承接 | `05/06/07` 需要配置矩阵、测试切口、验收红线和实施输入。 |
| Step 13 迁移、废弃与演进 | P1/P2 产品化和长期增强需要演进触发规则。 |

### 6. 范围收敛风险与处理规则

| 风险 | 处理规则 | 当前状态 |
|---|---|---|
| 配置项提前展开 | Step 2 不写 key、default、schema、JSON、secret 或 profile merge order;Step 7 再写配置项清单。 | active guard |
| 产品选择提前锁定 | DB / broker / metric / DLQ / external target 在 Step 2 只写 product-neutral / 待确认。 | active guard |
| P1/P2 污染 P0 | P0 只保主链装配、fake / in-memory / disabled / unavailable baseline 和 safe issue。 | active guard |
| 配置改变 03 语义 | 任何新增 carrier / constructor / port / mapper / marker 或改变 forbidden boundary 的结论必须回 03。 | active guard |
| 旧材料回流 | 旧 `05/06/07` 和旧 MethodContent / publish / snapshot / outbox 主线不得反向定义配置。 | active guard |

### 7. 对 03 的影响候选判定

| 收口结论候选 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0/P1/P2 分层口径 | 否 | 04 范围分层 | 不适用 | 无回写候选 |
| 整体无配置路径不成立 | 否 | 根据 `03` §13 既有 binding 判断 | 不适用 | 无回写候选 |
| Step 3~13 继续适用 | 否 | 配置设计流程适用性判断 | 不适用 | 无回写候选 |
| P1/P2 product-neutral / 待确认处理 | 否 | 承接 `03` §16 downstream owner | 不适用 | 无回写候选 |
| 后续具体配置项需要新增 runtime config carrier、adapter constructor 参数、trait / port、DTO、error、mapper、marker 或 flow | 是 | 代码契约变更 | `03` owning Step | 阻塞待确认 |
| 用配置改变 truth owner、state transition、query no-write、stored replay、transaction boundary、marker source 或 body-free rule | 是且越界 | 违反 `03` §13.7 forbidden configurable boundary | `03` §13 / owning Step | 立即暂停 |

### 8. R2.7 进入门禁

`R2.7 非范围与残余风险收口:先思考` 只能在以下条件满足后进入:

| 门禁项 | 结果 |
|---|---|
| P0 收口口径已写入 | pass |
| P1 / P2 收口口径已写入 | pass |
| 整体无配置路径最终候选判定已写入 | pass |
| Step 3~13 继续适用理由已写入 | pass |
| 范围收敛风险与处理规则已写入 | pass |
| 对 `03-详细设计.md` 的影响候选判定已写入 | pass |
| 未创建正式 `04-配置设计.md`,未写配置项、JSON、secret、测试、验收、实施或代码 | pass |

### 9. R2.6 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R2.6 一个模块 | pass |
| 是否把 R2.5 思考落成结构化收口记录 | pass |
| 是否未写配置项、key、默认值、产品选择或 profile merge order | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写测试、验收、实施或代码 | pass |
| 是否形成 R2.7 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.7 非范围与残余风险收口:先思考`;只允许围绕 R2.4~R2.6 的候选记录思考非范围去向、残余风险收敛、03 回写触发项和 R2.8 写入计划;不得创建正式 `04-配置设计.md`;不得写配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。

---

## R2.7 非范围与残余风险收口:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 思考 R2.4~R2.6 中非范围候选的去向、残余风险的收敛方式、03 回写触发项和 R2.8 写入计划。 |
| 本模块允许 | 写非范围去向思考、风险收敛思考、03 回写触发项、下游承接边界和 R2.8 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写配置项 key、默认值、profile merge order、JSON demo、secret schema、测试方案、验收标准、实施计划或代码;不锁定具体产品。 |
| 当前恢复依据 | R2.6 已完成 P0/P1/P2 收口、整体无配置路径最终候选判定和 Step 3~13 继续适用理由。 |

### 2. 非范围去向思考

非范围不能只写“不是本章内容”。每个非范围都必须有 owner / 文档去向,否则后续 agent 会把空白处当作可自行补口。R2.8 应把非范围按上游、详细设计、测试、验收、实施、运维和后续版本分组。

| 非范围族 | 去向思考 | 防误用要求 |
|---|---|---|
| 需求 / 验收目标重写 | 回 `00-需求文档.md` 或后续 `06-验收标准.md`。 | 04 不反向增加需求或验收目标。 |
| 架构方案 / 产品选型 | 回 `01-架构设计.md`、ADR、`07-实施计划.md` 或运维。 | 04 不锁定 DB、broker、metric、DLQ、external target 产品。 |
| 代码契约新增 | 回 `03-详细设计.md` owning Step。 | 04 不静默新增 object、trait、DTO、mapper、marker、runtime builder 字段。 |
| 测试矩阵 / evidence schema | 回 `05-测试方案.md`。 | 04 只提供配置红线和矩阵输入,不写 TC / fixture / artifact schema。 |
| 验收门禁 | 回 `06-验收标准.md`。 | 04 不写 release veto、coverage threshold 或 acceptance report。 |
| 实施边界 / ledger | 回 `07-实施计划.md`。 | 04 不写 phase、commit boundary、allowed_scope、required_checks。 |
| 部署运行操作 | 回部署与运维手册。 | 04 不写命令、挂载、证书安装、secret provider 操作。 |
| P2 增强 | 回后续版本 / ADR / 运维。 | 不进入 P0 配置项或当前主链。 |

### 3. 残余风险收敛思考

R2.8 应将风险分成三类:不阻塞 Step 2 的下游待办、会阻塞后续 Step 的待确认、必须立即回 03 的设计缺口。这样可以防止把所有风险混成“以后再说”。

| 风险族 | 收敛类型 | 思考 |
|---|---|---|
| 产品未选型 | 下游待办 / 后续 Step 待确认 | 不阻塞 Step 2,但会影响 Step 7/8/11 的具体配置项、secret 类型和失效策略。 |
| 旧 `05/06/07` 未重启 | 下游待办 | 不阻塞 Step 2,但必须在 Step 12 和后续文档重启时显式承接。 |
| P1/P2 污染 P0 | 当前 Step 风险 | R2.8 要把 P0 不被生产增强阻塞写清。 |
| 配置项触发 03 契约新增 | 立即回 03 | 任何 carrier / constructor / port / mapper / marker / flow 缺口不能由 04 补。 |
| 旧 MethodContent / publish / snapshot / outbox 回流 | 当前 Step 风险 | 继续沿用 Step 1 历史材料隔离。 |
| 部署命令混入配置设计 | 当前 Step 风险 | 运维步骤只进入部署与运维手册。 |

### 4. 03 回写触发项思考

R2.8 应明确以下触发项一旦出现,本 Step 不能继续把结论写成正式 04 范围:

| 触发项 | 为什么回 03 |
|---|---|
| 新增 runtime config carrier 字段 | 改变 runtime builder / infra binding 的代码契约。 |
| 新增 adapter constructor 参数 | 改变 adapter 装配签名。 |
| 新增 trait / port / repository / mapper 方法 | 改变 application / infra 边界。 |
| 新增 public DTO / event / job 字段 | 改变协议面。 |
| 新增 marker source 或 fallback marker | 改变 marker closure。 |
| 允许 query write / read-time repair | 改变 query no-write 和 transaction boundary。 |
| 用 config 合成 truth / state / replay / marker | 违反 forbidden configurable boundary。 |

### 5. 下游承接边界思考

Step 2 的下游承接只能说明“交给谁”和“后续必须处理什么”,不能替下游生成正式内容。

| 下游 | Step 2 可交付 | Step 2 不交付 |
|---|---|---|
| Step 3~13 | 范围、分层、非范围、风险和 03 回写触发规则。 | 具体配置项和 schema。 |
| `05-测试方案.md` | 配置红线、P0/P1/P2 矩阵输入、fake/durable parity 风险。 | TC ID、fixture、evidence artifact schema。 |
| `06-验收标准.md` | 配置验收红线输入。 | release gate、coverage threshold、验收报告模板。 |
| `07-实施计划.md` | 配置准备和 implementation gate 输入候选。 | phase、commit boundary、required_checks、ledger。 |
| 运维手册 | 需要部署运维承接的操作族。 | 实际部署命令、secret provider 操作、证书安装。 |

### 6. R2.8 写入计划思考

`R2.8 非范围与残余风险收口:再写入` 应把 R2.7 思考落成结构化记录:

1. 写非范围去向表。
2. 写残余风险收敛表。
3. 写 03 回写触发项表。
4. 写下游承接边界表。
5. 写 R2.9 Step 2 final output / closing gate 进入门禁。
6. 不写配置项清单、key、默认值、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。

### 7. R2.7 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R2.7 一个模块 | pass |
| 是否围绕非范围去向和残余风险做收口思考 | pass |
| 是否明确 03 回写触发项 | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写配置项、JSON demo、secret schema、测试、验收、实施或代码 | pass |
| 是否形成 R2.8 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.8 非范围与残余风险收口:再写入`;只允许把 R2.7 思考落成非范围去向表、残余风险收敛表、03 回写触发项表、下游承接边界表和 R2.9 进入门禁;不得创建正式 `04-配置设计.md`;不得写配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。

---

## R2.8 非范围与残余风险收口:再写入

### 1. 当前模块目标

`R2.8` 将 `R2.7` 的非范围和残余风险思考落成结构化记录,为 Step 2 final output 做准备。当前模块不新增范围,不进入具体配置项。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块允许 | 写入非范围去向表、残余风险收敛表、03 回写触发项表、下游承接边界表和 R2.9 进入门禁。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写配置项 key、默认值、profile merge order、JSON demo、secret schema、测试方案、验收标准、实施计划或代码;不锁定具体产品。 |
| 当前恢复依据 | R2.7 已完成非范围去向、残余风险收敛、03 回写触发项和下游承接边界思考。 |

### 2. 非范围去向表

| 非范围 | 留给哪一层 / 哪份文档 | 防误用规则 |
|---|---|---|
| 需求目标、业务规则和验收目标重写 | `00-需求文档.md` / `06-验收标准.md` | 04 不反向增加需求或验收目标。 |
| 架构方案、产品选型和 ADR 裁决 | `01-架构设计.md` / ADR / `07-实施计划.md` / 运维 | 04 不锁定 DB、broker、metric、DLQ、external target 产品。 |
| 对象、trait、DTO、flow、state、error、mapper、marker 和 runtime builder 签名新增 | `03-详细设计.md` owning Step | 04 不静默新增代码契约。 |
| 完整测试矩阵、测试数据、自动化脚本和 evidence 路径 | `05-测试方案.md` | 04 只提供配置红线和矩阵输入,不写 TC / fixture / artifact schema。 |
| acceptance gate、release veto、coverage threshold 和验收报告口径 | `06-验收标准.md` | 04 不写 release veto、coverage threshold 或 acceptance report。 |
| phase / commit boundary、required_reads、allowed_scope、required_checks 和 implementation ledger | `07-实施计划.md` | 04 不写 phase、commit boundary、allowed_scope 或 required_checks。 |
| 容器编排、挂载、secret provider 操作、证书安装、发布命令和 runbook | 部署与运维手册 | 04 不写命令、挂载、证书安装或 secret provider 操作。 |
| vendor-specific capacity、multi-region、tenant profile 和高级策略变体 | 后续版本 / ADR / 运维 | P2 不进入 P0 配置项或当前主链。 |

### 3. 残余风险收敛表

| 风险 | 收敛类型 | 影响 | 当前处理 |
|---|---|---|---|
| durable store / broker / metrics / DLQ / external target 产品未锁定 | 下游待办 / 后续 Step 待确认 | 影响 Step 7 / Step 8 / Step 11 的具体配置项、secret 类型和失效策略。 | Step 2 只保留 product-neutral 控制面;具体产品后续待确认。 |
| 旧 `05/06/07` 未按当前 `03/04` 重启 | 下游待办 | 影响测试矩阵、验收门禁和实施边界。 | 继续标为 old_direction_input;Step 12 和后续文档重启时显式承接。 |
| P1/P2 配置污染 P0 | 当前 Step 风险 | 扩大本轮范围并冲击后续实施计划。 | P0 只保主链装配、fake / in-memory / disabled / unavailable baseline 和 safe issue。 |
| 配置讨论触发 03 契约新增 | 立即回 03 | 影响可落码性和实现边界。 | 一旦出现 carrier、constructor、port、mapper、marker、flow 缺口,暂停回 03。 |
| 旧 MethodContent / publish / snapshot / outbox 主线回流 | 当前 Step 风险 | 污染当前方法资产定义 truth。 | 继续沿用 Step 1 历史材料隔离。 |
| 部署命令混入配置设计 | 当前 Step 风险 | 混淆配置设计与运维手册职责。 | 部署操作只进入部署与运维手册。 |

### 4. 03 回写触发项表

| 触发项 | 回写原因 | 处理方式 |
|---|---|---|
| 新增 runtime config carrier 字段 | 改变 runtime builder / infra binding 的代码契约。 | 回 `03` owning Step,04 暂停相关结论。 |
| 新增 adapter constructor 参数 | 改变 adapter 装配签名。 | 回 `03` Step 7 / Step 14 相关来源。 |
| 新增 trait / port / repository / mapper 方法 | 改变 application / infra 边界。 | 回 `03` Step 7。 |
| 新增 public DTO / event / job 字段 | 改变协议面。 | 回 `03` Step 8。 |
| 新增 marker source 或 fallback marker | 改变 marker closure。 | 回 `03` owning marker / mapper source。 |
| 允许 query write / read-time repair | 改变 query no-write 和 transaction boundary。 | 回 `03` Step 9 / Step 10,默认禁止。 |
| 用 config 合成 truth / state / replay / marker | 违反 forbidden configurable boundary。 | 立即暂停,不得在 04 内补口。 |

### 5. 下游承接边界表

| 下游 | Step 2 可交付 | Step 2 不交付 |
|---|---|---|
| Step 3~13 | 范围、P0/P1/P2 分层、非范围、风险和 03 回写触发规则。 | 具体配置项、key、默认值、schema 和 secret。 |
| `05-测试方案.md` | 配置红线、P0/P1/P2 矩阵输入、fake/durable parity 风险。 | TC ID、fixture、evidence artifact schema。 |
| `06-验收标准.md` | 配置验收红线输入、禁止 raw config / synthetic marker 的验收方向。 | release gate、coverage threshold、验收报告模板。 |
| `07-实施计划.md` | 配置准备、implementation gate 输入候选、不得自行补 config truth source 的提醒。 | phase、commit boundary、required_checks、ledger。 |
| 部署与运维手册 | 需要部署运维承接的操作族。 | 实际部署命令、secret provider 操作、证书安装。 |

### 6. R2.9 进入门禁

`R2.9 Step 2 final output 与 closing gate:先思考` 只能在以下条件满足后进入:

| 门禁项 | 结果 |
|---|---|
| 非范围去向表已写入 | pass |
| 残余风险收敛表已写入 | pass |
| 03 回写触发项表已写入 | pass |
| 下游承接边界表已写入 | pass |
| 未创建正式 `04-配置设计.md`,未写配置项、JSON、secret、测试、验收、实施或代码 | pass |

### 7. R2.8 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R2.8 一个模块 | pass |
| 是否把 R2.7 思考落成结构化记录 | pass |
| 是否明确非范围去向和风险收敛类型 | pass |
| 是否明确 03 回写触发项 | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写配置项、JSON demo、secret schema、测试、验收、实施或代码 | pass |
| 是否形成 R2.9 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.9 Step 2 final output 与 closing gate:先思考`;只允许思考 Step 2 final output、closing gate、对 03 的最终影响判定和 R2.10 写入计划;不得创建正式 `04-配置设计.md`;不得写配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。

---

## R2.9 Step 2 final output 与 closing gate:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 思考 Step 2 final output、closing gate、对 `03-详细设计.md` 的最终影响判定和 R2.10 写入计划。 |
| 本模块允许 | 写 final output 结构思考、closing gate 条件思考、03 影响判定思考、Step 3 入口思考和 R2.10 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不把 Step 2 标记为 completed;不进入 Step 3;不写配置项 key、默认值、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |
| 当前恢复依据 | R2.1~R2.8 已完成开工、SOP 五问、目标 / 范围 / 非范围、P0/P1/P2、无配置路径、非范围风险和 03 回写触发项候选。 |

### 2. Step 2 final output 结构思考

R2.10 应生成的是 Step 2 的最终中间产物输出,不是正式 `04-配置设计.md`。它应把前序候选收成可供 Step 3 使用的输入包。

| final output 组成 | 思考 |
|---|---|
| 配置设计目标 | 汇总为若干目标:控制面、禁止配置化边界、来源优先级、profile、配置项、敏感配置、加载校验、失效、下游承接。 |
| 本轮范围 | 汇总 runtime assembly、adapter binding、source/resolver、publisher/handoff、query/read policy、retry/job numeric handle、diagnostics/redaction 和 downstream handoff。 |
| P0/P1/P2 口径 | 固定 P0 是主链和 fake / in-memory / disabled baseline;P1 是产品化控制面;P2 是长期增强。 |
| 无配置路径判定 | 固定整体无配置路径不成立,Step 3~13 继续适用。 |
| 非范围和去向 | 保留每个非范围的 owner / 文档去向。 |
| 残余风险 | 分成下游待办、后续 Step 待确认、立即回 03 的设计缺口。 |
| 对 03 的影响 | 当前 Step 2 结论本身无回写;后续如触发代码契约新增则阻塞回 03。 |
| Step 3 入口 | Step 3 只接收控制面总览输入,不得直接写配置项清单。 |

### 3. closing gate 思考

Step 2 的 closing gate 应检查“范围是否收稳”,而不是检查“配置项是否完整”。配置项完整性属于 Step 7。

| gate 项 | 思考 |
|---|---|
| 目标已明确 | Step 2 已能说明配置设计要解决什么。 |
| 范围 / 非范围已明确 | 范围可进入 Step 3,非范围有去向。 |
| P0/P1/P2 已分层 | P0 不被产品化和长期增强阻塞。 |
| 无配置路径已判定 | 整体无配置路径不成立,Step 3~13 继续适用。 |
| 03 影响已判定 | 当前无回写,但回写触发项已列明。 |
| 未越界 | 未写正式 04、配置项、JSON、secret、测试、验收、实施或代码。 |

### 4. 对 03 的最终影响判定思考

| 结论族 | 影响思考 |
|---|---|
| Step 2 目标 / 范围 / 非范围 | 属于 04 范围收敛,不影响 03。 |
| P0/P1/P2 分层 | 属于配置设计层级管理,不影响 03。 |
| 无配置路径不成立 | 根据 `03` §13 已有 binding 判断,不影响 03。 |
| 非范围去向和下游承接 | 属于文档 owner 管理,不影响 03。 |
| 03 回写触发项 | 本身不回写;后续一旦发生具体触发项,必须暂停并回 03 owning Step。 |

### 5. Step 3 入口思考

Step 3 应以 Step 2 final output 为输入,建立配置控制面总览。它不应反向修改 Step 2 的范围,也不应直接跳到配置项清单。

| Step 3 输入 | 思考 |
|---|---|
| 控制面候选 | runtime assembly、storage/source/publisher/handoff/query/retry/diagnostics 等。 |
| P0/P1/P2 分层 | Step 3 应标记控制面的 P0/P1/P2 层级。 |
| 禁止配置化边界 | Step 3 应保留 forbidden configurable boundary,后续 Step 4 展开。 |
| 无配置路径判定 | Step 3~13 继续适用。 |
| 非范围和风险 | Step 3 不吸收非范围,只继承 guard。 |

### 6. R2.10 写入计划思考

`R2.10 Step 2 final output 与 closing gate:再写入` 应把 R2.9 思考落成:

1. Step 2 final output 表。
2. 配置设计目标 final 表。
3. 本轮范围 / 非范围 final 表。
4. P0/P1/P2 final 口径。
5. 无配置路径 final 判定。
6. 对 03 的最终影响判定。
7. closing gate 表。
8. Step 3 进入门禁。
9. 同步 flow / project ledger 到 Step 2 completed_wait_user_confirm_to_R3.1。
10. 不创建正式 `04-配置设计.md`;不进入 Step 3 内容。

### 7. R2.9 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R2.9 一个模块 | pass |
| 是否只思考 final output 与 closing gate | pass |
| 是否未把 Step 2 标记 completed | pass |
| 是否未进入 Step 3 | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写配置项、JSON demo、secret schema、测试、验收、实施或代码 | pass |
| 是否形成 R2.10 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.10 Step 2 final output 与 closing gate:再写入`;只允许把 R2.9 思考落成 Step 2 final output、closing gate、对 03 的最终影响判定和 Step 3 进入门禁;不得创建正式 `04-配置设计.md`;不得写配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。

---

## R2.10 Step 2 final output 与 closing gate:再写入

### 1. 当前模块目标

`R2.10` 将 Step 2 的目标、范围、非范围、P0/P1/P2、无配置路径、残余风险和 03 影响判定收成 final output,并关闭 Step 2 到等待用户确认进入 Step 3。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R3.1 |
| 本模块允许 | 写入 Step 2 final output、配置设计目标 final 表、本轮范围 / 非范围 final 表、P0/P1/P2 final 口径、无配置路径 final 判定、对 03 的最终影响判定、closing gate 和 Step 3 进入门禁。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不进入 Step 3 内容;不写配置项 key、默认值、profile merge order、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |
| 当前恢复依据 | R2.9 已完成 final output 与 closing gate 思考。 |

### 2. Step 2 final output

| 输出项 | final output |
|---|---|
| 配置设计目标 | 本轮 04 需要把 `03` §13 / §16 的 config binding、runtime builder、adapter availability、forbidden configurable boundary 和 downstream owner 转成可追溯配置设计。 |
| 本轮范围 | 覆盖 runtime assembly、storage / repository adapter binding、source / resolver adapter binding、publisher / handoff / target binding、query/read policy handle、retry/job numeric handle、diagnostics / redaction 和 downstream handoff。 |
| 本轮非范围 | 不写需求重写、架构产品选择、代码契约新增、测试矩阵、验收门禁、实施边界、部署操作或 P2 长期增强。 |
| P0/P1/P2 口径 | P0 是主链和 fake / in-memory / disabled / unavailable baseline;P1 是产品化控制面;P2 是长期增强。 |
| 无配置路径 | 整体无配置路径不成立;Step 3~13 继续适用。 |
| 残余风险 | 产品未选型、旧 `05/06/07` 未重启、P1/P2 污染 P0、配置触发 03 契约新增、旧主线回流和部署命令混入需要后续承接。 |
| 03 影响 | Step 2 结论本身不需要回写 03;后续若出现代码契约新增或 forbidden boundary 改变,必须暂停回 03。 |
| Step 3 输入 | Step 3 接收控制面范围、P0/P1/P2 分层、无配置路径判定、非范围去向、风险和 03 回写触发规则。 |

### 3. 配置设计目标 final 表

| 目标 | 说明 | 交付给下游的结果 |
|---|---|---|
| 收稳配置控制面 | 把 runtime slot、adapter implementation、target binding、profile identity 和 numeric policy value 来源转成配置控制面。 | Step 3 配置控制面总览。 |
| 收稳禁止配置化边界 | 明确配置不得改变 truth owner、DTO schema、state transition、query no-write、stored replay、transaction boundary、marker source 或 body-free rule。 | Step 4 分类与禁止配置化边界。 |
| 收稳来源与冲突处理 | 后续明确 raw config、validated config、secret ref、profile、test fixture 等来源和冲突处理规则。 | Step 5 来源、优先级与冲突处理。 |
| 收稳环境与 profile | 重建 dev / test / staging / production-like profile 差异,不继承旧 `05/06/07`。 | Step 6 环境与 profile 矩阵。 |
| 收稳配置项表达 | 只在控制面、分类、来源和 profile 收口后形成配置项清单。 | Step 7 配置项清单。 |
| 收稳敏感配置 | 明确 secret、endpoint、DSN、token、cert 等敏感材料引用和禁止输出边界。 | Step 8 敏感配置与密钥管理。 |
| 收稳加载、校验和失效 | 明确 raw config 可见性、validated settings、safe issue、runtime availability、fail-fast、degraded 和 unavailable。 | Step 9 / Step 11。 |
| 收稳下游承接 | 给 `05/06/07` 提供配置矩阵、测试切口、验收红线和实施准备输入。 | Step 12 下游承接。 |

### 4. 本轮范围 final 表

| 范围 | 必须覆盖的内容 | 后续 Step |
|---|---|---|
| runtime assembly | runtime profile、entry readiness、adapter slot、runtime assembly summary。 | Step 3 / 6 / 7 / 9 / 11 |
| storage / repository adapter binding | fake / in-memory / durable binding、pool/connection handle、adapter availability。 | Step 3 / 5 / 7 / 9 / 11 |
| source / resolver adapter binding | 外部来源解析、recognized / unrecognized / unavailable / body violation safe outcome。 | Step 3 / 7 / 8 / 11 |
| publisher / handoff / target binding | publisher target、handoff target、target registry、availability branch。 | Step 3 / 6 / 7 / 11 |
| query/read policy handle | page/body limit、freshness threshold handle、availability source binding。 | Step 3 / 4 / 7 / 9 / 11 |
| retry / job numeric handle | retention、retry、lease、batch 等 numeric policy value 的来源和失效策略。 | Step 3 / 5 / 7 / 9 / 11 |
| diagnostics / redaction | safe config issue、redacted diagnostic、body-free guard、forbidden raw value 输出。 | Step 4 / 7 / 8 / 9 / 12 |
| downstream handoff | `05/06/07` 如何引用配置矩阵、配置红线和实施输入。 | Step 12 |

### 5. 非范围 final 表

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 需求目标、业务规则和验收目标重写 | `00-需求文档.md` / `06-验收标准.md` |
| 架构方案、产品选型和 ADR 裁决 | `01-架构设计.md` / ADR / `07-实施计划.md` / 运维 |
| 对象、trait、DTO、flow、state、error、mapper、marker 和 runtime builder 签名新增 | `03-详细设计.md` owning Step |
| 完整测试矩阵、测试数据、自动化脚本和 evidence 路径 | `05-测试方案.md` |
| acceptance gate、release veto、coverage threshold 和验收报告口径 | `06-验收标准.md` |
| phase / commit boundary、required_reads、allowed_scope、required_checks 和 implementation ledger | `07-实施计划.md` |
| 容器编排、挂载、secret provider 操作、证书安装、发布命令和 runbook | 部署与运维手册 |
| vendor-specific capacity、multi-region、tenant profile 和高级策略变体 | 后续版本 / ADR / 运维 |

### 6. P0 / P1 / P2 final 口径

| 等级 | final 口径 | 本轮处理 |
|---|---|---|
| P0 | 支撑主链装配、fake / in-memory / disabled / unavailable baseline、safe config issue 和 body-free guard 的最小控制面。 | 本轮必须覆盖控制面,但 Step 2 不写具体配置项。 |
| P1 | 支撑 durable / real-like adapter、broker、diagnostic sink、archive / handoff target、staging profile 和外部集成迁移的产品化控制面。 | 本轮可定义控制面和待确认项,不锁定具体产品。 |
| P2 | 支撑 multi-region、tenant profile、advanced capacity、vendor-specific adapter、复杂策略变体和深度 external integration 的长期增强控制面。 | 只记录非范围 / 演进触发,不进入 P0 配置项。 |

### 7. 无配置路径 final 判定

| 判断项 | final 判定 | 依据 |
|---|---|---|
| 是否存在配置绑定点 | 是 | `03` §13 已定义 runtime assembly、storage adapter、entry exposure、query/read policy、replay/retry、runner/target binding 和 diagnostics。 |
| 是否可以直接声明本仓无配置 | 否 | 即使不锁定产品,仍需说明 fake / disabled / unavailable / redaction / runtime readiness 控制面。 |
| 是否允许跳过 Step 3~13 | 否 | 后续仍需拆控制面、分类、来源、profile、配置项、secret、加载、变更、失效和下游承接。 |
| 是否允许子域无配置 | 允许但必须留痕 | 若后续某个子域确认无配置,仍按 SOP 在对应 Step 留痕。 |

### 8. 对 03 的最终影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| Step 2 目标、范围和非范围收口 | 否 | 04 范围收敛 | 不适用 | 无回写 |
| P0/P1/P2 分层口径 | 否 | 04 范围分层 | 不适用 | 无回写 |
| 整体无配置路径不成立 | 否 | 根据 `03` §13 既有 binding 判断 | 不适用 | 无回写 |
| Step 3~13 继续适用 | 否 | 配置设计流程适用性判断 | 不适用 | 无回写 |
| P1/P2 product-neutral / 待确认处理 | 否 | 承接 `03` §16 downstream owner | 不适用 | 无回写 |
| 后续具体配置项需要新增 runtime config carrier、adapter constructor 参数、trait / port、DTO、error、mapper、marker 或 flow | 是 | 代码契约变更 | `03` owning Step | 阻塞待确认 |
| 用配置改变 truth owner、state transition、query no-write、stored replay、transaction boundary、marker source 或 body-free rule | 是且越界 | 违反 `03` §13.7 forbidden configurable boundary | `03` §13 / owning Step | 立即暂停 |

### 9. Step 2 closing gate

| gate 项 | 结果 | 说明 |
|---|---|---|
| 配置设计目标已明确 | pass | 见 §3。 |
| 本轮范围已明确 | pass | 见 §4。 |
| 非范围有明确去向 | pass | 见 §5。 |
| P0/P1/P2 已分层 | pass | 见 §6。 |
| 无配置路径已判定 | pass | 见 §7。 |
| 对 03 的影响已判定 | pass | 见 §8。 |
| 未创建正式 `04-配置设计.md` | pass | 正式 04 必须等 Step 15。 |
| 未写配置项、JSON、secret、测试、验收、实施或代码 | pass | 配置项从 Step 7 开始,测试 / 验收 / 实施交下游文档。 |

Step 2 closing gate: pass。当前 Step 关闭为 `completed_wait_user_confirm_to_R3.1`。

### 10. Step 3 进入门禁

Step 3 `R3.1 开工与必读文档:先思考` 只能在用户确认后进入。

| 门禁项 | 结果 |
|---|---|
| Step 2 final output 已写入 | pass |
| Step 2 closing gate 已通过 | pass |
| Step 3 输入已明确为控制面总览 | pass |
| 正式 `04-配置设计.md` 未创建 | pass |
| 未提前写配置项清单、JSON、secret、测试、验收、实施或代码 | pass |

R3.1 允许范围:

1. 创建 `projects/L3-method-library/design-calibration/04_config_step_03_control_plane.md`。
2. 写 Step 3 开工边界、必读文档、控制面总览讨论入口和 R3.2 写入计划。
3. 同步更新 `04_config_calibration_flow.md` 和 `project_execution_ledger.md` 到 Step 3 R3.1。

R3.1 禁止范围:

1. 不创建正式 `04-配置设计.md`。
2. 不写配置项清单、key、默认值、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。
3. 不把旧 `05/06/07` 的 TC、AC、phase、commit boundary 或产品选择写成当前 04 真相源。

### 11. R2.10 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R2.10 一个模块 | pass |
| 是否完成 Step 2 final output | pass |
| 是否通过 Step 2 closing gate | pass |
| 是否形成 Step 3 R3.1 进入门禁 | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未进入 Step 3 内容 | pass |
| 是否未写配置项、JSON demo、secret schema、测试、验收、实施或代码 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.1 开工与必读文档:先思考`;允许创建 `design-calibration/04_config_step_03_control_plane.md` 并写入 Step 3 开工边界、必读文档、控制面总览讨论入口和 R3.2 写入计划;不得创建正式 `04-配置设计.md`;不得写配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。
