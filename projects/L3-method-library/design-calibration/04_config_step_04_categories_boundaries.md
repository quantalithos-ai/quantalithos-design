# Step 4. 定义配置分类与禁止配置化边界

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 4
> 书写规范: `standards/document/配置设计书写规范.md`
> 回填章节: `04-配置设计.md` §4 配置分类与禁止配置化边界
> 创建日期: 2026-06-25
> 当前状态: `R4.10 分类边界审计:再写入` completed_wait_user_confirm_to_R5.1
> 当前门禁: 等待确认进入 Step 5 `R5.1 开工与必读文档:先思考`

---

## 0. Step 4 边界

Step 4 在 Step 3 的配置控制面、配置域、watch 项和 closing gate 基础上,定义配置类别、更新时机边界、禁止配置化项、按配置域组织的分类边界、分类边界停审和跨分类 / 禁止项审计框架。

当前 Step 不定义具体配置项、key、默认值、profile merge order、JSON demo、secret provider、secret 名称、loader 函数、validator schema、热更新实现、部署命令、测试用例、验收门禁、实施计划或代码。

---

## R4.1 开工与必读文档:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 思考 Step 4 的开工边界、必读文档、Step 3 输入承接、SOP 产出要求、分类讨论轴、禁止配置化边界入口、watch 项承接和 R4.2 写入计划。 |
| 本模块允许 | 创建 Step 4 中间产物文件;写入开工边界、必读文档、Step 3 输入承接、分类讨论轴、禁止配置化边界入口和 R4.2 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写配置分类 final 表、禁止配置化 final 表、配置项清单、key、默认值、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | Step 3 已关闭为 `completed_wait_user_confirm_to_R4.1`;closing gate = pass_with_watch;用户已确认进入 R4.1。 |

### 2. Step 4 开工边界思考

| 边界项 | R4.1 裁决 |
|---|---|
| Step 4 定位 | 从 Step 3 的控制面和配置域进入配置类别、更新时机和禁止配置化边界。 |
| 直接输入 | Step 3 final candidate output、SOP Step 4、书写规范 §5.4、正式 `00/01/02/03`、`02` §11、`03` §13、L1-governance Step 4 框架参考。 |
| 输出粒度 | 先讨论分类类别、热 / 冷更新边界、禁止配置化项和逐配置域分类边界,不进入配置项清单。 |
| watch 承接 | `inbound event binding / inbound source binding` 保持 pass_with_watch;`config center / admin override` 保持 watch_only。 |
| 对 03 的影响 | 若分类结论要求新增 hot reload、runtime reload contract、config field、builder 参数、adapter constructor、trait / port、DTO、error、mapper、marker、state 或 flow,必须回 `03-详细设计.md`。 |
| 下游边界 | Step 4 不替代 Step 5~15、`05/06/07` 或运维文档。 |

### 3. 必读文档思考

| 必读文档 | 读取用途 | R4.2 用法 |
|---|---|---|
| `project_execution_ledger.md` | 确认当前允许进入 Step 4 R4.1。 | 写入 Step 4 当前恢复依据。 |
| `04_config_calibration_flow.md` | 确认 Step 4 主题、状态表和执行纪律。 | 写入 Step 4 当前状态和 next_allowed_action。 |
| `04_config_step_03_control_plane.md` | 继承 Step 3 final candidate output、watch 项、closing gate 和 Step 4 进入门禁。 | 写入 Step 4 输入基线。 |
| `配置设计讨论流程_SOP.md` Step 4 | 固定本步目标、输入、输出、九个问题、执行约束和进入下一步条件。 | 写入 Step 4 产出要求和讨论问题入口。 |
| `配置设计书写规范.md` §5.4 | 固定分类表和禁止配置化项表的正式写法。 | 写入分类与禁止边界的写法约束。 |
| `设计文档讨论中间产物规范.md` | 固定逐模块、先思考后写入和台账恢复纪律。 | 约束 R4.1 -> R4.2。 |
| `设计真相源闭环与可落码性标准.md` | 固定缺 schema / port / mapper / config / evidence 时必须暂停。 | 写入 03 影响判定框架。 |
| `00-需求文档.md` | 提供 Definition vs Use、正文排除、P0/P1 和外围增强边界。 | 支撑禁止配置化项不能越过需求红线。 |
| `01-架构设计.md` | 提供数据所有权、依赖方向、外围不前置和配置变更不得绕过核心边界。 | 支撑禁止配置化项回指架构红线。 |
| `02-概要设计.md` §11 | 提供配置影响轮廓和禁止配置化边界。 | 支撑分类和禁止项候选。 |
| `03-详细设计.md` §13 | 提供配置职责、读取边界、reference families、runtime builder 和 forbidden configurable boundary。 | 支撑分类、更新时机和 03 影响判定。 |
| L1-governance Step 4 | 提供配置分类、更新时机、禁止项和停审表达框架。 | 只参考结构,不复制 governance 领域事实。 |

### 4. Step 3 输入承接思考

| Step 3 输入 | Step 4 接收方式 | 不得接收 |
|---|---|---|
| 来源链候选 | 接收为分类讨论背景,用于区分 source / secret / test / admin override 所属类别。 | 不定最终优先级或冲突规则。 |
| 装配入口 | 接收 load raw -> validate -> resolve -> assemble -> precheck 作为更新时机判断依据。 | 不写 loader 函数、schema 或 reload 实现。 |
| 读取边界 | 接收 infra raw config、application typed setting、entry readiness、contracts/domain no config。 | 不允许 application/domain/contracts 读取 raw config。 |
| 控制面 / 配置域 | 按每个配置域判断适用类别、不适用类别和禁止项。 | 不直接生成配置项清单。 |
| pass_with_watch | inbound source binding 继续追踪。 | 不把 watch 标成 final pass。 |
| watch_only | config center / admin override 继续作为 P1/P2 候选。 | 不写成 P0 来源或热更新能力。 |
| Step 3 03 影响判定 | 继续执行“新增契约即回 03”。 | 不在 04 私补 runtime contract。 |

### 5. SOP Step 4 产出和问题思考

| SOP 要求 | R4.2 处理方式 |
|---|---|
| 配置分类表 | 先形成分类候选和分类轴,不写配置项示例值。 |
| 禁止配置化项表 | 先列禁止项来源池和变更流程框架,每项后续必须回指 `00/01/02/03`。 |
| 按配置域组织的分类边界表 | 先建立逐域映射入口,后续 R4.5/R4.6 再落成候选表。 |
| 分类边界停审记录 | R4.7/R4.8 执行逐域停审。 |
| 跨分类 / 禁止项审计表 | R4.9/R4.10 审计分类冲突、禁止项遗漏、P1/P2 污染 P0 和 watch 项。 |
| 九个 SOP 问题 | R4.2 先落成问题入口和候选讨论轴,R4.3 起逐项收敛。 |

### 6. 分类讨论轴思考

| 讨论轴 | R4.2 后续写入入口 |
|---|---|
| 配置类别 | startup runtime config、job-run-start config、entry-local parameters、technical knobs、sensitive ref config、diagnostic / redaction config、test fixture / deterministic config、feature / peripheral enablement、static design boundary。 |
| 更新时机 | design-time only、startup / cold update、job-run-start freeze、entry-local、hot runtime update watch。 |
| 热更新边界 | 当前 P0 不应承诺核心 hot update;若需要 hot reload / dynamic adapter replacement,必须回 `03`。 |
| 禁止配置化项 | Definition vs Use、truth owner、state transition、query no-write、job no-truth-repair、body-free、stored replay、transaction boundary、marker source、public schema、P0/P1 隔离。 |
| 变更流程 | 禁止项改变必须回需求 / 架构 / 概要 / 详细设计,不能只改配置文档或 env/profile。 |
| 配置域映射 | 每个 Step 3 配置域都要标适用类别、不适用类别、禁止项和原因。 |
| watch 项 | inbound binding 和 config center / admin override 必须保留追踪状态。 |

### 7. 对 03 的影响判定框架

| Step 4 结论类型 | 是否影响 03 | 处理规则 |
|---|---|---|
| 只把 `03` §13 既有 config reference families 归入配置类别 | 否 | 记录为 `无回写`。 |
| 只声明某类配置 cold update / job-run-start / entry-local 生效 | 通常否 | 留在 04 Step 4 / Step 9 / Step 11 继续收敛。 |
| 声明 P0 支持核心 hot reload、dynamic adapter replacement 或 config center live override | 是 | 标记 `阻塞待确认`,回 `03` runtime builder / recovery / audit owning Step。 |
| 需要新增 runtime config carrier、builder 参数、adapter constructor、trait / port、DTO、error、mapper、marker、state 或 flow | 是 | 暂停并回 `03-详细设计.md`。 |
| 试图用配置改变 truth owner、state transition、query no-write、stored replay、transaction boundary、marker source、body-free rule 或 public schema | 是且越界 | 立即暂停,不得在 04 内补口。 |
| 旧 `05/06/07` 与当前 Step 4 输入冲突 | 否 | 旧下游继续降级为 direction input。 |

### 8. R4.2 写入计划思考

`R4.2 开工与必读文档:再写入` 应把 R4.1 思考落成可恢复记录:

1. 写 Step 4 当前模块目标和允许 / 禁止范围。
2. 写 Step 4 输入基线表。
3. 写必读文档清单。
4. 写 SOP Step 4 产出要求和问题入口。
5. 写分类讨论轴。
6. 写对 `03-详细设计.md` 的影响判定框架。
7. 写 `R4.3 SOP 问题回答与分类候选:先思考` 进入门禁。
8. 不写配置分类 final 表、禁止配置化 final 表、配置项清单、JSON demo、secret schema、测试、验收、实施或代码。

### 9. R4.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按台账从 Step 3 进入 Step 4 | pass |
| 是否只推进 R4.1 一个模块 | pass |
| 是否创建 Step 4 中间产物文件 | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写配置分类 final 表、禁止配置化 final 表或配置项清单 | pass |
| 是否未写 JSON demo、secret schema、测试、验收、实施或代码 | pass |
| 是否形成 R4.2 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.2 开工与必读文档:再写入`;只允许把 R4.1 思考落成 Step 4 当前模块目标、输入基线、必读文档清单、SOP 产出要求、分类讨论轴、03 影响判定框架和 R4.3 进入门禁;不得创建正式 `04-配置设计.md`;不得写配置分类 final 表、禁止配置化 final 表、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码;不得把 watch 项当作已无条件关闭。

---

## R4.2 开工与必读文档:再写入

### 1. 当前模块目标

`R4.2` 将 `R4.1` 的开工思考落成 Step 4 可恢复记录。当前模块只固定 Step 4 输入基线、必读文档、SOP 产出要求、分类讨论轴、对 `03-详细设计.md` 的影响判定框架和 `R4.3` 进入门禁。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块允许 | 写入 Step 4 当前模块目标、输入基线、必读文档清单、SOP 产出要求、分类讨论轴、03 影响判定框架和下一模块门禁。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写配置分类 final 表、禁止配置化 final 表、配置项清单、key、默认值、profile merge order、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |
| 当前恢复依据 | R4.1 已完成 Step 4 开工边界、必读文档、Step 3 输入承接、SOP 产出要求、分类讨论轴、03 影响判定框架和 R4.2 写入计划。 |

### 2. Step 4 输入基线

| 输入 | 当前定位 | Step 4 用法 | 禁止用法 |
|---|---|---|---|
| Step 3 final candidate output | 直接输入 | 接收来源链、装配入口、读取边界、控制面、配置域、watch 项和 Step 4 进入门禁。 | 不把控制面直接升级为配置项清单。 |
| `00-需求文档.md` | 正式上游 | 提供 Definition vs Use、正文排除、P0/P1 和外围增强边界。 | 不新增需求、不扩大本仓 truth owner。 |
| `01-架构设计.md` | 正式上游 | 提供数据所有权、依赖方向、外围不前置和配置变更不得绕过核心边界。 | 不用配置改变架构主线或依赖边界。 |
| `02-概要设计.md` §11 | 正式上游 | 提供配置影响轮廓、禁止配置化边界和回退路径。 | 不把概要影响点直接写成 key、secret、topic 或 schema。 |
| `03-详细设计.md` §13 | 直接输入 | 提供配置职责、读取边界、reference families、runtime builder、external dependency binding 和 forbidden configurable boundary。 | 不新增 object、trait / port、DTO、mapper、marker、state、error 或 flow。 |
| 旧 `05/06/07` | old_direction_input | 只提醒后续测试、验收、实施承接方向。 | 不反向定义配置类别、配置项、TC、AC、phase 或 commit boundary。 |
| L1-governance Step 4 | framework_reference | 参考配置分类、更新时机、禁止项、停审和跨分类审计的结构深度。 | 不复制 governance 领域事实或禁止项名称。 |

### 3. 必读文档清单

| 必读文档 | 读取状态 | 本 Step 用途 |
|---|---|---|
| `projects/L3-method-library/design-calibration/project_execution_ledger.md` | pass | 确认当前模块、gate_status 和 next_allowed_action。 |
| `projects/L3-method-library/design-calibration/04_config_calibration_flow.md` | pass | 确认 Step 4 主题、状态表、执行纪律和 Step 文件路径。 |
| `projects/L3-method-library/design-calibration/04_config_step_03_control_plane.md` | pass | 承接 Step 3 final candidate output、watch 项、closing gate 和 Step 4 进入门禁。 |
| `standards/document/配置设计讨论流程_SOP.md` Step 4 | pass | 固定 Step 4 目标、输入、输出、九个问题、执行约束和进入下一步条件。 |
| `standards/document/配置设计书写规范.md` §5.4 | pass | 固定正式 04 §4 的配置分类表和禁止配置化项表写法。 |
| `standards/document/设计文档讨论中间产物规范.md` | pass | 固定逐模块、先思考后写入、台账同步和不得批量越过模块的纪律。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | pass | 固定缺 schema / port / mapper / config / evidence 时必须暂停回设计。 |
| `projects/L3-method-library/00-需求文档.md` | pass | 提供禁止配置化项不得越过需求边界的依据。 |
| `projects/L3-method-library/01-架构设计.md` | pass | 提供禁止配置化项回指架构红线的依据。 |
| `projects/L3-method-library/02-概要设计.md` | pass | 提供配置影响轮廓、禁止配置化边界和详细设计承接口径。 |
| `projects/L3-method-library/03-详细设计.md` | pass | 提供 config binding、runtime builder、adapter availability、external dependency 和 forbidden boundary。 |
| `projects/L1-governance/design-calibration/04_config_step_04_categories_boundaries.md` | pass | 只参考 Step 4 框架深度、更新时机表和停审表达。 |

### 4. SOP Step 4 产出要求

| 产出 | 当前写入规则 | 后续模块 |
|---|---|---|
| 配置分类表 | 按类别、说明、示例类型、热更新口径、主要风险组织;R4.2 不写 final 表。 | R4.3 / R4.4 |
| 禁止配置化项表 | 每项必须写原因和变更流程,并回指需求 / 架构 / 概要 / 详细设计红线。 | R4.5 / R4.6 |
| 按配置域组织的分类边界表 | 每个 Step 3 配置域都要有适用类别、不适用类别、禁止项和原因。 | R4.5 / R4.6 |
| 分类边界停审记录 | 每个配置域检查类别适用、热 / 冷更新边界、禁止项和 03 影响。 | R4.7 / R4.8 |
| 跨分类 / 禁止项审计表 | 审计分类不一致、禁止项遗漏、P1/P2 污染 P0、watch 项误关闭和 03 影响缺口。 | R4.9 / R4.10 |

### 5. SOP Step 4 问题入口

| SOP 问题 | 当前入口 | R4.3 处理方式 |
|---|---|---|
| 当前系统有哪些启动配置、运行时配置、策略配置、敏感配置、调试配置? | Step 3 控制面、`02` §11 配置影响轮廓、`03` §13 reference families。 | 形成配置类别候选,不写 key 或默认值。 |
| 哪些配置允许热更新? | `03` §13 未定义 hot reload / rollback / audit contract。 | 形成 P0 不承诺核心 hot update 的候选判断。 |
| 哪些配置只能冷更新或启动读取? | `03` §13.6 runtime builder 五阶段。 | 形成 startup / cold update 候选。 |
| 哪些安全、审计、事务、一致性或领域规则禁止配置化? | `02` §11.2 和 `03` §13.7 forbidden configurable boundary。 | 形成禁止项候选池。 |
| 禁止配置化项如需改变应走什么流程? | `00/01/02/03` 回退规则和真相源闭环标准。 | 形成变更流程候选。 |
| 每个配置域下哪些配置类别适用,哪些类别明确不适用? | Step 3 配置域 final candidate output。 | 逐域形成分类映射候选。 |
| 每个禁止配置化项是否回指架构红线或详细设计不变量? | `01` 数据所有权 / 依赖方向;`03` §13.7。 | 后续禁止项表必须写回指。 |
| 每个配置域分类边界完成后是否通过停审? | SOP 分类边界停审要求。 | R4.7/R4.8 执行。 |
| 是否存在分类不一致或禁止项遗漏? | SOP 跨分类 / 禁止项审计要求。 | R4.9/R4.10 执行。 |

### 6. 分类讨论轴

| 讨论轴 | 当前边界 | 依据 |
|---|---|---|
| static design boundary | 不是配置项,只声明不可被配置覆盖的设计不变量。 | `02` §11.2;`03` §13.7 |
| startup runtime config | runtime 构造前读取并冻结的 profile、adapter、target、redaction、availability 等配置。 | `03` §13.6 |
| job-run-start config | 每次 job run 开始时冻结的 batch、retry、lease、scope、report target 等执行参数。 | `02` §11.1 Operations Job;`03` §13.3 |
| entry-local parameters | 只影响当前入口 / 当前请求 / 当前 job 的 source selector、profile selector 或 diagnostic selection。 | `02` §11.1 entry;`03` §13.2 |
| policy-like technical knobs | retry、retention、timeout、page/body limit 等技术参数,不等同 domain policy。 | `03` §13.3 |
| sensitive ref config | secret ref、endpoint ref、credential ref 等引用型配置,raw secret 不进入配置正文。 | `02` §11.1 external summary;`03` §13.6 |
| diagnostic / redaction config | safe config issue、redaction deny/allow、safe diagnostic source。 | `03` §13.3;§14 |
| test fixture / deterministic config | fake、in-memory、fixed clock、fixture source 等 local / CI 控制。 | Step 3 P0 fake baseline |
| feature / peripheral enablement | 外围 publication、handoff、package/discovery/export 等能力启停。 | `00` P0/P1;`02` peripheral boundary |
| hot runtime update watch | 当前不承诺 P0 hot reload;如需动态生效必须回 03。 | `03` §13 未闭 reload contract |

### 7. 对 03 的影响判定框架

| Step 4 结论类型 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理规则 |
|---|---|---|---|---|
| 只把 `03` §13 既有 binding 点归入配置类别 | 否 | 04 分类 | 不适用 | 记录 `无回写`。 |
| 只声明 startup / job-run-start / entry-local 生效边界 | 通常否 | 04 生效时机说明 | 不适用 | 留给 Step 9 / Step 11 继续收敛。 |
| 声明 P0 支持核心 hot reload 或 dynamic adapter replacement | 是 | runtime contract / recovery / audit 新增 | `03` §13 / §12 / §14 | 阻塞待确认。 |
| 需要新增 config carrier、builder 参数、adapter constructor、trait / port、DTO、error、mapper、marker、state 或 flow | 是 | 代码契约新增 | `03` owning Step | 暂停并回 `03`。 |
| 用配置改变 truth owner、state transition、query no-write、stored replay、transaction boundary、marker source、body-free rule 或 public schema | 是且越界 | forbidden boundary 破坏 | `03` §13 / owning Step | 立即暂停。 |
| 旧 `05/06/07` 与当前 Step 4 输入冲突 | 否 | 下游旧材料冲突 | 不适用 | 旧下游只作 direction input。 |

固定记录格式:

| 配置分类结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 待 R4.3 起逐项填写 | 待判定 | 待判定 | 待判定 | 待判定 |

### 8. R4.3 进入门禁

`R4.3 SOP 问题回答与分类候选:先思考` 只能在以下条件满足后进入:

| 门禁项 | 结果 |
|---|---|
| Step 4 输入基线已固定 | pass |
| 必读文档清单已写入 | pass |
| SOP Step 4 产出要求已写入 | pass |
| SOP Step 4 问题入口已写入 | pass |
| 分类讨论轴已写入 | pass |
| 对 `03-详细设计.md` 的影响判定框架已写入 | pass |
| watch 项仍保持追踪状态 | pass |
| 未创建正式 `04-配置设计.md`,未写配置分类 final 表、禁止配置化 final 表、配置项、JSON、secret、测试、验收、实施或代码 | pass |

### 9. R4.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R4.2 一个模块 | pass |
| 是否把 R4.1 思考落成结构化记录 | pass |
| 是否未写配置分类 final 表或禁止配置化 final 表 | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写配置项、JSON demo、secret schema、测试、验收、实施或代码 | pass |
| 是否形成 R4.3 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.3 SOP 问题回答与分类候选:先思考`;只允许围绕 SOP Step 4 九问形成配置类别候选、更新时机候选、热更新边界候选、禁止配置化项候选、变更流程候选、配置域分类候选、03 影响预判和 R4.4 写入计划;不得创建正式 `04-配置设计.md`;不得写配置分类 final 表、禁止配置化 final 表、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码;不得把 watch 项当作已无条件关闭。

---

## R4.3 SOP 问题回答与分类候选:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 围绕 SOP Step 4 九问形成配置类别、更新时机、热更新边界、禁止配置化项、变更流程、配置域分类和 03 影响的候选思考,为 R4.4 写入结构化记录做准备。 |
| 本模块允许 | 写候选思考、依据、取舍方向、watch 处理、03 影响预判和 R4.4 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不把候选升级为配置分类 final 表或禁止配置化 final 表;不写配置项 key、默认值、profile merge order、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |
| 当前恢复依据 | R4.2 已固定 Step 4 输入基线、必读文档、SOP 产出要求、问题入口、分类讨论轴和 03 影响判定框架。 |

### 2. SOP 九问候选思考

| SOP 问题 | 候选回答方向 | 依据 | R4.4 写入注意 |
|---|---|---|---|
| 当前系统有哪些启动配置、运行时配置、策略配置、敏感配置、调试配置? | 候选分类为 static design boundary、startup runtime config、job-run-start config、entry-local parameters、policy-like technical knobs、sensitive ref config、diagnostic / redaction config、test fixture / deterministic config、feature / peripheral enablement。 | Step 3 控制面;`02` §11;`03` §13。 | 只写类别候选,不写具体 key / default。 |
| 哪些配置允许热更新? | 当前 P0 不承诺核心 hot runtime update;只允许 startup、job-run-start 或 entry-local 形式。 | `03` §13 未定义 reload / rollback / audit contract。 | hot update 只能写 watch,不得写能力。 |
| 哪些配置只能冷更新或启动读取? | profile、store、adapter、target、redaction、boundary、runtime availability 等候选为 startup / cold update。 | `03` §13.6 runtime builder。 | 不写具体加载函数或重启命令。 |
| 哪些安全、审计、事务、一致性或领域规则禁止配置化? | 禁止项候选包括 Definition vs Use、truth owner、state transition、query no-write、job no-truth-repair、body-free、stored replay、transaction boundary、marker source、public schema、P0/P1 隔离。 | `02` §11.2;`03` §13.7。 | 必须后续回指上游红线,不得只写口号。 |
| 禁止配置化项如需改变应走什么流程? | 必须回 `00/01/02/03` 对应 truth boundary、架构红线、处理流、状态、事务或协议,再同步 04/05/06/07。 | 真相源闭环标准;`02` §12 回退规则。 | 不允许只通过配置审批或 env/profile 改变。 |
| 每个配置域下哪些配置类别适用,哪些类别明确不适用? | 以 Step 3 配置域为行,映射 startup、job-run-start、entry-local、sensitive、diagnostic、test fixture、feature enablement 和 static design boundary。 | Step 3 final candidate output。 | R4.3 只思考映射候选,R4.5/R4.6 再写逐域表。 |
| 每个禁止配置化项是否回指架构红线或详细设计不变量? | 每个禁止项都必须回指 `00/01/02/03` 至少一处正式来源。 | SOP Step 4 执行约束;书写规范 §5.4。 | R4.4 先写候选来源池,后续表格必须补回指。 |
| 每个配置域分类边界完成后是否通过停审? | 停审维度为类别适用、不适用类别、热 / 冷更新边界、禁止项、watch 和 03 影响。 | SOP 分类边界停审。 | R4.7/R4.8 执行。 |
| 所有分类完成后,是否存在分类不一致或禁止项遗漏? | 审计项包括 P0 hot update、policy-like knob 误当 domain policy、feature flag 改核心语义、test override 进 production-like、watch 项误关闭。 | SOP 跨分类 / 禁止项审计。 | R4.9/R4.10 执行。 |

### 3. 配置类别候选思考

| 配置类别候选 | 当前思考 | 边界 |
|---|---|---|
| static design boundary | 不是配置项,用于声明不可被配置覆盖的设计不变量。 | 不进入 Step 7 配置项清单。 |
| startup runtime config | runtime 构造前读取并冻结的 profile、store、adapter、target、redaction、availability、boundary 类配置。 | 不承诺启动后动态替换。 |
| job-run-start config | 每次 job run 开始时冻结的 batch、retry、lease、scope、report target、target snapshot。 | 不允许 job 运行中改变 mutation semantics。 |
| entry-local parameters | 只影响当前入口 / 当前请求 / 当前 job 的 selector、request-local source 或 diagnostic mode。 | 不覆盖全局 runtime config。 |
| policy-like technical knobs | retry、retention、timeout、page/body limit、dedup window 等技术参数。 | 不等同 domain policy、formalization rule 或 shared rule。 |
| sensitive ref config | secret ref、endpoint ref、credential ref、target credential ref。 | 不保存 raw secret、raw endpoint 或 response body。 |
| diagnostic / redaction config | safe issue、redaction profile、diagnostic selector、metric/log safe output handle。 | 不放宽 forbidden body 或 high-cardinality raw text。 |
| test fixture / deterministic config | fake adapter、in-memory store、fixed clock、sequence id、fixture source。 | 不进入 production-like profile。 |
| feature / peripheral enablement | outbound event candidate、handoff/export、package/discovery 等外围能力启停。 | 不改变 core accepted truth 或 P0 前置。 |

### 4. 更新时机候选思考

| 更新时机候选 | 适用范围 | 当前判断 |
|---|---|---|
| design-time only | truth owner、state matrix、DTO schema、body-free、transaction、stored replay、marker source 等不变量。 | 只能通过正式设计变更。 |
| startup / cold update | profile、store、adapter、target、redaction、boundary limit、runtime availability。 | P0 主链候选默认冷更新。 |
| job-run-start freeze | job batch、retry、lease、scope、report target 和 target availability snapshot。 | 新 job run 冻结,写入 report / receipt 口径后续定义。 |
| entry-local | 当前入口 selector、profile selector、dry-run diagnostic selection。 | 只影响当前 entry,不得写成全局 override。 |
| hot runtime update watch | config center / admin override / dynamic reload。 | 当前仅 watch;如要启用必须回 `03`。 |

### 5. 禁止配置化项候选思考

| 禁止配置化项候选 | 禁止原因 | 来源候选 |
|---|---|---|
| Definition vs Use 分离 | 防止方法定义 truth 被流程实例、runtime context、UI session 或下游消费状态覆盖。 | `00`;`01`;`02` §11.2 |
| 方法资产定义 truth owner | 防止消费仓、治理执行、marketplace 或 UI 反向定义方法资产。 | `01`;`02`;`03` §13.7 |
| state transition / formalization guard | 防止 profile 或 flag 改变正式化、版本、availability、trace、relation 或 peripheral 状态语义。 | `02` §9 / §11.2;`03` state / §13.7 |
| Query no-write | 防止 query 修复 truth、projection、reference、report 或 read material。 | `02` §10 / §11.2;`03` §13.7 |
| Operations Job no-truth-repair | 防止 refresh / recovery / reconciliation 成为隐式 command。 | `02` §10 / §11.2;`03` job flow / §13.7 |
| Inbound only body-free | 防止 inbound 保存 raw payload、artifact body、provider body 或 evidence body。 | `00`;`02` §10 / §11.2;`03` §13.7 |
| Outbound only candidate / handoff no-truth-proof | 防止 publisher delivery、external ack 或 receipt 反向证明 local truth。 | `02` §11.2;`03` §13.4 / §13.7 |
| stored replay / idempotency | 防止 duplicate key 重新运行 mutation 或关闭 stored result source。 | `03` §13.7 |
| transaction boundary / expected version | 防止配置关闭 optimistic concurrency、UoW 或 commit ordering。 | `02` §11.2;`03` §13.7 |
| marker source / mapper closure | 防止 config、fake、route/header、raw error、raw body 合成 marker。 | `03` §13.1 / §13.7 |
| public DTO / event / job schema | 防止配置改变 kind、schema version、field presence 或 marker carrier。 | `03` §13.7 |
| P0 / P1 范围隔离 | 防止外围 package、method set、marketplace discovery 或 admin override 变成 P0 前置。 | `00`;`02` §11.2 |

### 6. 配置域分类候选思考

| Step 3 配置域 | 适用类别候选 | 明确不适用候选 | watch |
|---|---|---|---|
| runtime profile and entry readiness | startup runtime config;entry-local parameters;test fixture / deterministic config。 | static design boundary as config;hot runtime update。 | no |
| repository and material store binding | startup runtime config;sensitive ref config;test fixture / deterministic config。 | transaction boundary config;query repair config。 | no |
| external source and resolver binding | startup runtime config;sensitive ref config;policy-like technical knobs。 | external body config;marker synthesis config。 | no |
| inbound source binding | startup runtime config;sensitive ref config;policy-like technical knobs。 | command emulation config;raw payload config。 | pass_with_watch |
| event publisher and handoff target binding | startup runtime config;sensitive ref config;job-run-start config。 | delivery proves truth config;event schema config。 | no |
| query and read material policy handles | startup runtime config;policy-like technical knobs;entry-local parameters。 | query write / repair config。 | no |
| operations job runner policy | job-run-start config;policy-like technical knobs;diagnostic config。 | core mutation config;truth repair config。 | no |
| safe diagnostics and redaction | startup runtime config;diagnostic / redaction config;sensitive ref config。 | raw secret / raw endpoint / raw body output config。 | no |
| downstream test / acceptance / implementation handoff | diagnostic / redaction config;test fixture / deterministic config;feature / peripheral enablement。 | TC / AC / commit boundary as config。 | no |
| config center / admin override | hot runtime update watch;feature / peripheral enablement watch。 | P0 startup source final;core live override。 | watch_only |

### 7. 对 03 的影响预判

| 候选结论 | 是否影响 03 | 处理状态 |
|---|---|---|
| 配置类别采用 static design boundary / startup / job-run-start / entry-local / technical knobs / sensitive ref / diagnostic / test fixture / feature enablement | 否 | 04 分类候选,可继续。 |
| P0 不承诺核心 hot runtime update | 否 | 与当前 `03` 未定义 reload contract 一致。 |
| hot runtime update 只作为 watch | 否,暂不回写 | 若后续启用,回 `03`。 |
| inbound source binding 继续 pass_with_watch | 否,暂不回写 | 不新增 config carrier / adapter constructor。 |
| config center / admin override 继续 watch_only | 否,暂不回写 | 不承诺 P0 source / dynamic override。 |
| 禁止配置化项后续必须回指 `00/01/02/03` | 否 | 04 写法约束。 |
| 任何新增 runtime reload、builder 参数、adapter constructor、DTO、port、marker 或 flow | 是 | 必须暂停回 `03`。 |

### 8. R4.4 写入计划思考

`R4.4 SOP 问题回答与分类候选:再写入` 应把 R4.3 思考落成可恢复记录:

1. 写当前模块目标和允许 / 禁止范围。
2. 写 SOP 九问候选回答表。
3. 写配置类别候选表。
4. 写更新时机候选表。
5. 写禁止配置化项候选表。
6. 写配置域分类候选表。
7. 写对 `03-详细设计.md` 的影响预判。
8. 写 `R4.5 配置分类与禁止项来源池:先思考` 进入门禁。
9. 不写配置分类 final 表、禁止配置化 final 表、配置项清单、JSON demo、secret schema、测试、验收、实施或代码。

### 9. R4.3 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R4.3 一个模块 | pass |
| 是否围绕 SOP Step 4 九问形成候选思考 | pass |
| 是否未把候选升级为配置分类 final 表或禁止配置化 final 表 | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写配置项、JSON demo、secret schema、测试、验收、实施或代码 | pass |
| 是否保持 watch 项追踪 | pass |
| 是否形成 R4.4 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.4 SOP 问题回答与分类候选:再写入`;只允许把 R4.3 思考落成 SOP 九问候选回答、配置类别候选、更新时机候选、禁止配置化项候选、配置域分类候选、03 影响预判和 R4.5 进入门禁;不得创建正式 `04-配置设计.md`;不得写配置分类 final 表、禁止配置化 final 表、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码;不得把 watch 项当作已无条件关闭。

---

## R4.4 SOP 问题回答与分类候选:再写入

### 1. 当前模块目标

`R4.4` 将 `R4.3` 的分类候选思考落成 Step 4 可恢复记录。当前模块只固定 SOP 九问候选回答、配置类别候选、更新时机候选、禁止配置化项候选、配置域分类候选、对 `03-详细设计.md` 的影响预判和 `R4.5` 进入门禁。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块允许 | 写入 SOP 九问候选回答、配置类别候选、更新时机候选、禁止配置化项候选、配置域分类候选、03 影响预判和下一模块门禁。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写配置分类 final 表、禁止配置化 final 表、配置项清单、key、默认值、profile merge order、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |
| 当前恢复依据 | R4.3 已完成 SOP 九问、配置类别、更新时机、禁止项、配置域分类和 03 影响预判的候选思考。 |

### 2. SOP 九问候选回答

| SOP 问题 | 候选回答 | 当前状态 | 后续收敛点 |
|---|---|---|---|
| 当前系统有哪些启动配置、运行时配置、策略配置、敏感配置、调试配置? | 候选分类为 static design boundary、startup runtime config、job-run-start config、entry-local parameters、policy-like technical knobs、sensitive ref config、diagnostic / redaction config、test fixture / deterministic config、feature / peripheral enablement。 | candidate | R4.5/R4.6 校准来源池和类别定义。 |
| 哪些配置允许热更新? | 当前 P0 不承诺核心 hot runtime update;hot runtime update 只保留 watch。 | candidate_watch | 若后续启用,必须回 `03`。 |
| 哪些配置只能冷更新或启动读取? | profile、store、adapter、target、redaction、boundary、runtime availability 等候选为 startup / cold update。 | candidate | Step 9 / Step 11 再处理加载和失效。 |
| 哪些安全、审计、事务、一致性或领域规则禁止配置化? | Definition vs Use、truth owner、state transition、query no-write、job no-truth-repair、body-free、stored replay、transaction boundary、marker source、public schema、P0/P1 隔离等进入禁止项候选池。 | candidate | R4.5/R4.6 补来源和变更流程。 |
| 禁止配置化项如需改变应走什么流程? | 必须回 `00/01/02/03` 对应正式真相源,再同步 04/05/06/07。 | candidate | R4.6 形成候选表。 |
| 每个配置域下哪些配置类别适用,哪些类别明确不适用? | 以 Step 3 配置域为行映射 startup、job-run-start、entry-local、sensitive、diagnostic、test fixture、feature enablement 和 static design boundary。 | candidate | R4.5/R4.6 细化逐域表。 |
| 每个禁止配置化项是否回指架构红线或详细设计不变量? | 每个禁止项都必须回指 `00/01/02/03` 至少一处正式来源。 | candidate | 后续禁止项表必须保留来源列。 |
| 每个配置域分类边界完成后是否通过停审? | 停审维度为类别适用、不适用类别、热 / 冷更新边界、禁止项、watch 和 03 影响。 | candidate | R4.7/R4.8 执行。 |
| 所有分类完成后,是否存在分类不一致或禁止项遗漏? | 后续审计 P0 hot update、policy-like knob、feature flag、test override、watch 项误关闭等。 | candidate | R4.9/R4.10 执行。 |

### 3. 配置类别候选表

| 配置类别候选 | 说明候选 | 示例类型候选 | 是否允许热更新候选 | 主要风险候选 |
|---|---|---|---|---|
| static design boundary | 非配置项,用于声明不可被配置覆盖的设计不变量。 | truth owner、state transition、query no-write、body-free、public schema。 | 不适用 | 被误写成配置项会绕过正式设计变更。 |
| startup runtime config | runtime 构造前读取并冻结的运行装配配置。 | profile、store、adapter、target、redaction、availability、boundary。 | P0 不允许核心 hot update。 | 启动后替换会破坏 adapter、store、UoW 或 availability 一致性。 |
| job-run-start config | 每次 job run 开始时冻结的执行参数。 | batch、retry、lease、scope、report target、target snapshot。 | 不属于 hot update;只随新 job run 生效。 | job 中途改变会导致 report / receipt 不可复核。 |
| entry-local parameters | 只影响当前入口或当前请求 / job 的本地参数。 | source selector、profile selector、dry-run diagnostic selection。 | 不属于全局 hot update。 | 若覆盖全局 runtime 会绕过 validated config。 |
| policy-like technical knobs | 技术执行策略参数,不等同 domain policy。 | retry、retention、timeout、page/body limit、dedup window。 | startup 或 job-run-start 冻结。 | 误用于改变 formalization rule 或 shared rule。 |
| sensitive ref config | 只保存敏感材料引用。 | secret ref、endpoint ref、credential ref、target credential ref。 | P0 不允许 raw secret hot update。 | raw secret / endpoint 泄露到 config、log、audit 或 report。 |
| diagnostic / redaction config | 控制安全诊断输出和 redaction。 | safe issue、redaction profile、metric/log safe output handle。 | P0 startup 冻结候选。 | 放宽后泄露 forbidden body 或 high-cardinality text。 |
| test fixture / deterministic config | 支撑 local / CI 可复现测试。 | fake adapter、in-memory store、fixed clock、sequence id、fixture source。 | 仅测试 entry 生效。 | 进入 production-like profile 会伪造外部成功。 |
| feature / peripheral enablement | 控制外围能力是否启用。 | outbound candidate、handoff/export、package/discovery enablement。 | P0 startup 冻结候选。 | 若控制核心 accepted path 会改变业务语义。 |

### 4. 更新时机候选表

| 更新时机候选 | 允许内容候选 | 禁止内容候选 | 生效规则候选 |
|---|---|---|---|
| design-time only | truth owner、state matrix、DTO schema、body-free、transaction、stored replay、marker source。 | JSON / env / profile / flag 配置。 | 只能通过正式设计变更和实现提交生效。 |
| startup / cold update | profile、store、adapter、target、redaction、boundary limit、runtime availability。 | 启动后无审计替换核心 adapter / store。 | 重新启动并重新 validate 后生效。 |
| job-run-start freeze | batch、retry、lease、scope、report target、target availability snapshot。 | job 运行中改变 scope 或 mutation semantics。 | 新 job run 冻结,后续写入 report / receipt 口径。 |
| entry-local | selector、request-local source、dry-run diagnostic selection。 | 改写全局 config、truth scope、state transition 或 actor visibility。 | 只对当前 entry 有效。 |
| hot runtime update watch | config center / admin override / dynamic reload 候选。 | store / adapter / topic / redaction / idempotency / truth invariant live change。 | 当前不启用;需未来 `03` reload contract。 |

### 5. 禁止配置化项候选表

| 禁止配置化项候选 | 原因候选 | 来源候选 | 如需改变应走什么流程候选 |
|---|---|---|---|
| Definition vs Use 分离 | 防止方法定义 truth 被流程实例、runtime context、UI session 或下游消费状态覆盖。 | `00`;`01`;`02` §11.2 | 回 `00/01/02` 重审范围和数据所有权。 |
| 方法资产定义 truth owner | 防止消费仓、治理执行、marketplace 或 UI 反向定义方法资产。 | `01`;`02`;`03` §13.7 | 回 `01` 数据所有权和 `03` truth boundary。 |
| state transition / formalization guard | 防止 profile 或 flag 改变正式化、版本、availability、trace、relation 或 peripheral 状态语义。 | `02` §9 / §11.2;`03` state / §13.7 | 回 `02` 状态流和 `03` 状态矩阵 / flow。 |
| Query no-write | 防止 query 修复 truth、projection、reference、report 或 read material。 | `02` §10 / §11.2;`03` §13.7 | 回 `02` query 边界和 `03` function flow。 |
| Operations Job no-truth-repair | 防止 refresh / recovery / reconciliation 成为隐式 command。 | `02` §10 / §11.2;`03` job flow / §13.7 | 回 `02` maintenance 边界和 `03` job flow。 |
| Inbound only body-free | 防止 inbound 保存 raw payload、artifact body、provider body 或 evidence body。 | `00`;`02` §10 / §11.2;`03` §13.7 | 回 `00/02/03` body-free contract。 |
| Outbound only candidate / handoff no-truth-proof | 防止 publisher delivery、external ack 或 receipt 反向证明 local truth。 | `02` §11.2;`03` §13.4 / §13.7 | 回 `03` publication / handoff design。 |
| stored replay / idempotency | 防止 duplicate key 重新运行 mutation 或关闭 stored result source。 | `03` §13.7 | 回 `03` idempotency / recovery contract。 |
| transaction boundary / expected version | 防止配置关闭 optimistic concurrency、UoW 或 commit ordering。 | `02` §11.2;`03` §13.7 | 回 `03` persistence / transaction consistency。 |
| marker source / mapper closure | 防止 config、fake、route/header、raw error、raw body 合成 marker。 | `03` §13.1 / §13.7 | 回 `03` mapper / marker source design。 |
| public DTO / event / job schema | 防止配置改变 kind、schema version、field presence 或 marker carrier。 | `03` §13.7 | 回 `03` protocol contract。 |
| P0 / P1 范围隔离 | 防止外围 package、method set、marketplace discovery 或 admin override 变成 P0 前置。 | `00`;`02` §11.2 | 回 `00` P0/P1 和 `02` component boundary。 |

### 6. 配置域分类候选表

| Step 3 配置域 | 适用类别候选 | 明确不适用候选 | watch |
|---|---|---|---|
| runtime profile and entry readiness | startup runtime config;entry-local parameters;test fixture / deterministic config。 | static design boundary as config;hot runtime update。 | no |
| repository and material store binding | startup runtime config;sensitive ref config;test fixture / deterministic config。 | transaction boundary config;query repair config。 | no |
| external source and resolver binding | startup runtime config;sensitive ref config;policy-like technical knobs。 | external body config;marker synthesis config。 | no |
| inbound source binding | startup runtime config;sensitive ref config;policy-like technical knobs。 | command emulation config;raw payload config。 | pass_with_watch |
| event publisher and handoff target binding | startup runtime config;sensitive ref config;job-run-start config。 | delivery proves truth config;event schema config。 | no |
| query and read material policy handles | startup runtime config;policy-like technical knobs;entry-local parameters。 | query write / repair config。 | no |
| operations job runner policy | job-run-start config;policy-like technical knobs;diagnostic config。 | core mutation config;truth repair config。 | no |
| safe diagnostics and redaction | startup runtime config;diagnostic / redaction config;sensitive ref config。 | raw secret / raw endpoint / raw body output config。 | no |
| downstream test / acceptance / implementation handoff | diagnostic / redaction config;test fixture / deterministic config;feature / peripheral enablement。 | TC / AC / commit boundary as config。 | no |
| config center / admin override | hot runtime update watch;feature / peripheral enablement watch。 | P0 startup source final;core live override。 | watch_only |

### 7. 对 03 的影响预判

| 候选结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 采用九类配置类别候选 | 否 | 04 分类候选 | 不适用 | 可继续 |
| P0 不承诺核心 hot runtime update | 否 | 04 边界说明 | 不适用 | 可继续 |
| hot runtime update 只作为 watch | 否,暂不回写 | watch | 待后续 Step 判定 | 继续追踪 |
| inbound source binding 继续 pass_with_watch | 否,暂不回写 | watch | 待后续 Step 判定 | 继续追踪 |
| config center / admin override 继续 watch_only | 否,暂不回写 | P1/P2 watch | Step 5/10/13 或 `03` | 继续追踪 |
| 禁止项后续必须回指 `00/01/02/03` | 否 | 04 写法约束 | 不适用 | 可继续 |
| 新增 runtime reload、builder 参数、adapter constructor、DTO、port、marker 或 flow | 是 | 代码契约新增 | `03` owning Step | 阻塞待确认 |

### 8. R4.5 进入门禁

`R4.5 配置分类与禁止项来源池:先思考` 只能在以下条件满足后进入:

| 门禁项 | 结果 |
|---|---|
| SOP 九问候选回答已写入 | pass |
| 配置类别候选表已写入 | pass |
| 更新时机候选表已写入 | pass |
| 禁止配置化项候选表已写入 | pass |
| 配置域分类候选表已写入 | pass |
| 对 `03-详细设计.md` 的影响预判已写入 | pass |
| watch 项仍保持追踪状态 | pass |
| 未创建正式 `04-配置设计.md`,未写配置分类 final 表、禁止配置化 final 表、配置项、JSON、secret、测试、验收、实施或代码 | pass |

### 9. R4.4 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R4.4 一个模块 | pass |
| 是否把 R4.3 思考落成结构化候选记录 | pass |
| 是否保留所有结论为 candidate / candidate_watch | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写配置项、JSON demo、secret schema、测试、验收、实施或代码 | pass |
| 是否形成 R4.5 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.5 配置分类与禁止项来源池:先思考`;只允许审查配置类别候选、更新时机候选、禁止配置化项候选和配置域分类候选是否能从 Step 3、`02` §11、`03` §13 与上游红线合法推出,形成来源池裁决候选、watch 处理计划、03 影响预判和 R4.6 写入计划;不得创建正式 `04-配置设计.md`;不得写配置分类 final 表、禁止配置化 final 表、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码;不得把 watch 项当作已无条件关闭。

---

## R4.5 配置分类与禁止项来源池:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 审查配置类别候选、更新时机候选、禁止配置化项候选和配置域分类候选能否从 Step 3、`02` §11、`03` §13 与上游红线合法推出,形成来源池裁决候选、watch 处理计划、03 影响预判和 R4.6 写入计划。 |
| 本模块允许 | 写来源池候选思考、来源合法性、watch 处理、03 影响预判和 R4.6 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不把来源池候选升级为配置分类 final 表、禁止配置化 final 表、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |
| 当前恢复依据 | R4.4 已完成 SOP 九问候选回答、配置类别候选、更新时机候选、禁止配置化项候选、配置域分类候选和 03 影响预判。 |

### 2. 配置类别来源池候选

| 配置类别候选 | 来源池候选 | 合法推出理由 | R4.6 写入倾向 |
|---|---|---|---|
| static design boundary | `00` 需求边界;`01` 架构红线;`02` 禁止配置化边界;`03` forbidden configurable boundary。 | 这些不是配置项,而是明确声明哪些内容不能配置化。 | pass_candidate |
| startup runtime config | `03` §13.6 runtime builder;`02` §11 配置影响轮廓;Step 3 控制面中的 runtime assembly / storage / adapter / target / redaction。 | 都是 runtime 构造前读取并冻结的装配类配置。 | pass_candidate |
| job-run-start config | `02` §11 Operations Job;`03` job-run-start/runner binding;Step 3 operations job runner policy。 | job 执行参数在新 job run 开始前冻结,符合已有运行契约。 | pass_candidate |
| entry-local parameters | `03` §13.2 读取边界;`02` §11 entry / command / query 影响轮廓。 | 只影响当前入口或当前请求 / job,不需要新增全局 runtime 契约。 | pass_candidate |
| policy-like technical knobs | `03` §13.3 replay / retry / query/read policy / diagnostics handles;`02` §11.1 technical knobs。 | 这是技术参数候选,不是 domain policy truth。 | pass_candidate |
| sensitive ref config | `02` 外部摘要与引用影响轮廓;`03` §13.6 secret ref / endpoint ref / adapter binding。 | 敏感材料以引用形式进入配置,raw secret 不入正文。 | pass_candidate |
| diagnostic / redaction config | `02` 安全 / 审计 / trace 轮廓;`03` §13.3 / §14 diagnostics。 | 安全诊断与 redaction 直接由已有 safe output 边界支撑。 | pass_candidate |
| test fixture / deterministic config | Step 3 P0 fake / in-memory / disabled / unavailable baseline;`03` fake adapter / runtime builder。 | 这类配置只服务测试和 deterministic profile,不会改变正式 truth。 | pass_candidate |
| feature / peripheral enablement | `00` P0/P1 范围;`02` 外围 package / method set / collaboration boundary;`03` peripheral enablement / publication / handoff。 | 外围启停是现有范围中的候选分层,但不能前置为 core truth。 | pass_candidate |

### 3. 更新时机来源池候选

| 更新时机候选 | 来源池候选 | 合法推出理由 | R4.6 写入倾向 |
|---|---|---|---|
| design-time only | `00/01/02/03` truth boundary、state matrix、DTO / schema / transaction / replay / marker source 约束。 | 这些边界只能通过正式设计变更和实现提交生效。 | pass_candidate |
| startup / cold update | `03` §13.6 load / validate / resolve / assemble / precheck;Step 3 startup config 候选。 | runtime 构造前验证并冻结,符合已有 builder 语义。 | pass_candidate |
| job-run-start freeze | `02` Operations Job、`03` job runner / report / retry 句段。 | 新 job run 进入时冻结 batch / retry / scope / report 语义。 | pass_candidate |
| entry-local | `03` §13.2 entry read boundary;`02` entry-local 影响轮廓。 | 只影响当前 entry,不需要新增全局配置契约。 | pass_candidate |
| hot runtime update watch | `03` §13 未闭 reload contract;Step 3 watch_only / pass_with_watch。 | 现阶段只能作为 watch,不能写成正式能力。 | watch_only |

### 4. 禁止配置化项来源池候选

| 禁止配置化项候选 | 来源池候选 | 合法推出理由 | R4.6 写入倾向 |
|---|---|---|---|
| Definition vs Use 分离 | `00` 正文排除与范围边界;`01` 数据所有权;`02` §11.2;`03` §13.7。 | 属于定义 / 使用的核心边界,不能由配置改变。 | pass_candidate |
| 方法资产定义 truth owner | `01` 数据所有权与依赖方向;`02` 方法资产定义 truth owner;`03` forbidden configurable boundary。 | 这是当前仓的 truth owner,必须稳定。 | pass_candidate |
| state transition / formalization guard | `02` 状态 / 迁移;`03` 状态矩阵和 guard。 | profile 或 flag 不能改写正式状态语义。 | pass_candidate |
| Query no-write | `02` query 边界;`03` query flow / persistence / job no-write。 | query 只能读取派生材料,不能写 truth。 | pass_candidate |
| Operations Job no-truth-repair | `02` job 不修 truth;`03` job flow / degraded / recovery contract。 | 后台维护只能修派生材料和进度,不能修 truth。 | pass_candidate |
| Inbound only body-free | `00` 外部正文排除;`02` inbound body-free;`03` inbound protocol / envelope / body-free validation。 | inbound 只能承接 body-free summary/ref。 | pass_candidate |
| Outbound only candidate / handoff no-truth-proof | `02` candidate / handoff 区分;`03` publisher / handoff / target binding。 | delivery / receipt 不等于 truth proof。 | pass_candidate |
| stored replay / idempotency | `03` stored replay / duplicate replay / idempotency contract。 | 不能用配置关闭 replay 或让重复请求重跑 mutation。 | pass_candidate |
| transaction boundary / expected version | `02` 事务一致性;`03` persistence / transaction consistency。 | 不能靠配置绕过并发控制。 | pass_candidate |
| marker source / mapper closure | `03` marker / mapper / config / evidence 缺口暂停规则。 | marker 只能来自正式 summary / mapper / state,不能合成。 | pass_candidate |
| public DTO / event / job schema | `03` contract / protocol schema。 | public surface 不是普通配置。 | pass_candidate |
| P0 / P1 范围隔离 | `00` P0/P1;`02` peripheral / pipeline boundary。 | 外围能力不能因配置进入 core 前置。 | pass_candidate |

### 5. 配置域分类来源池候选

| Step 3 配置域 | 来源池候选 | 合法推出理由 | watch |
|---|---|---|---|
| runtime profile and entry readiness | `03` runtime assembly / entry precheck;`02` 配置影响轮廓。 | 直接承接 startup / entry-local 生效边界。 | no |
| repository and material store binding | `03` storage / repository adapter binding;`02` store root / read material availability。 | 这是 runtime 绑定点,适用 startup config。 | no |
| external source and resolver binding | `03` source / resolver adapter binding;`02` external summary / source allowlist。 | 敏感 ref 和 adapter kind 都有正式承接。 | no |
| inbound source binding | `03` inbound protocol / idempotency channel;`02` inbound consumer 轮廓。 | 可推出配置影响,但 formal binding 仍缺更强闭口。 | pass_with_watch |
| event publisher and handoff target binding | `03` publisher / handoff / target binding;`02` outbound event / collaboration boundary。 | 启停外围协作通道有正式入口。 | no |
| query and read material policy handles | `03` query/read policy handles;`02` query / projection / read material。 | 只是在既有读边界上做参数化。 | no |
| operations job runner policy | `03` job runner policy;`02` Operations Job。 | 批量、重试、lease 和 report 都属于现有 job 轴。 | no |
| safe diagnostics and redaction | `03` diagnostics / redaction;`02` safe diagnostic policy。 | 安全输出和 redaction 已是明确横切边界。 | no |
| downstream test / acceptance / implementation handoff | `03` downstream handoff;`02` test / acceptance / implementation 切口。 | 这里只把下游交接承接为配置语义。 | no |
| config center / admin override | `03` hot runtime update watch;`00/01/02` 配置与变更控制红线。 | 书写规范允许来源,但当前 `03` 没闭 dynamic runtime contract。 | watch_only |

### 6. watch 处理计划候选

| watch 项 | 当前状态 | 处理计划候选 | 是否阻塞 R4.6 |
|---|---|---|---|
| inbound source binding | pass_with_watch | 保留为配置域候选,在 Step 4 后续收敛中继续校验是否需要 formal binding / config carrier;若新增契约则回 `03`。 | 不阻塞 |
| config center / admin override | watch_only | 只作为 P1/P2 候选来源和 hot runtime update watch;不得进入 P0 final。 | 不阻塞 |

### 7. 对 03 的影响预判

| 候选结论 | 是否影响 03 | 处理状态 |
|---|---|---|
| 配置类别来源池来自 `00/01/02/03` 既有边界 | 否 | 04 来源合法性说明,可继续。 |
| 更新时机来源池来自 `03` runtime builder / job-run-start / entry-local | 否 | 04 时机候选,可继续。 |
| 禁止配置化项来源池来自 `00/01/02/03` 红线 | 否 | 04 禁止项候选,可继续。 |
| inbound source binding 仍保留 watch | 否,暂不回写 | 后续若需要正式 config carrier,回 `03`。 |
| config center / admin override 仍保留 watch_only | 否,暂不回写 | 后续若要求 runtime 契约,回 `03` / 架构。 |
| 若后续来源池需要新增 runtime reload、builder 参数、adapter constructor、DTO、port、marker 或 flow | 是 | 必须暂停回 `03`。 |

### 8. R4.6 写入计划思考

`R4.6 配置分类与禁止项来源池:再写入` 应把 R4.5 思考落成可恢复记录:

1. 写当前模块目标和允许 / 禁止范围。
2. 写配置类别来源池候选表。
3. 写更新时机来源池候选表。
4. 写禁止配置化项来源池候选表。
5. 写配置域分类来源池候选表。
6. 写 watch 处理计划。
7. 写对 `03-详细设计.md` 的影响预判。
8. 写 `R4.7 分类边界停审:先思考` 进入门禁。
9. 不写配置分类 final 表、禁止配置化 final 表、配置项清单、JSON demo、secret schema、测试、验收、实施或代码。

### 9. R4.5 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R4.5 一个模块 | pass |
| 是否审查来源池是否合法推出 | pass |
| 是否保留 watch 项状态而未关闭 | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写配置分类 final 表、禁止配置化 final 表或配置项清单 | pass |
| 是否未写 JSON demo、secret schema、测试、验收、实施或代码 | pass |
| 是否形成 R4.6 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.7 分类边界停审:先思考`;只允许把 R4.6 已确认的来源池落成分类边界停审判断、逐配置域适用 / 不适用 / 禁止项 / watch 记录、03 影响预判和 R4.8 写入计划;不得创建正式 `04-配置设计.md`;不得写配置分类 final 表、禁止配置化 final 表、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码;不得把 watch 项当作已无条件关闭.

---

## R4.6 配置分类与禁止项来源池:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 将 R4.5 的来源池候选落成可恢复记录,固定配置类别、更新时机、禁止配置化项和配置域分类的来源池确认、watch 处理计划确认、03 影响预判和 R4.7 进入门禁。 |
| 本模块允许 | 写来源池确认记录、watch 处理计划确认、03 影响预判和 R4.7 进入门禁。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不把来源池确认升级为配置分类 final 表、禁止配置化 final 表、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |
| 当前恢复依据 | R4.5 已完成来源池候选、watch 候选和 03 影响候选;R4.6 只负责把这些候选固定为可恢复记录。 |

### 2. 配置类别来源池确认

| 配置类别候选 | 来源池确认 | 写入理由 | R4.7 状态 |
|---|---|---|---|
| static design boundary | `00` 需求边界;`01` 架构红线;`02` 禁止配置化边界;`03` forbidden configurable boundary。 | 这是不可被配置覆盖的设计不变量,适合作为分类的顶层边界。 | confirmed_candidate |
| startup runtime config | `03` §13.6 runtime builder;`02` §11 配置影响轮廓;Step 3 控制面中的 runtime assembly / storage / adapter / target / redaction。 | 这些配置在 runtime 构造前读取并冻结,符合启动装配类配置的定义。 | confirmed_candidate |
| job-run-start config | `02` §11 Operations Job;`03` job-run-start / runner binding;Step 3 operations job runner policy。 | job 运行参数在新 run 开始前冻结,不应在 run 中途改写。 | confirmed_candidate |
| entry-local parameters | `03` §13.2 读取边界;`02` §11 entry / command / query 影响轮廓。 | 只影响当前入口或当前请求 / job,不需要升级为全局 runtime 契约。 | confirmed_candidate |
| policy-like technical knobs | `03` §13.3 replay / retry / query / read policy / diagnostics handles;`02` §11.1 technical knobs。 | 属于技术参数,不是 domain policy truth。 | confirmed_candidate |
| sensitive ref config | `02` 外部摘要与引用影响轮廓;`03` §13.6 secret ref / endpoint ref / adapter binding。 | 敏感材料以引用形式进入配置,raw secret 不进入正文。 | confirmed_candidate |
| diagnostic / redaction config | `02` 安全 / 审计 / trace 轮廓;`03` §13.3 / §14 diagnostics。 | 安全输出和 redaction 已经是独立横切边界。 | confirmed_candidate |
| test fixture / deterministic config | Step 3 P0 fake / in-memory / disabled / unavailable baseline;`03` fake adapter / runtime builder。 | 这类配置只服务测试和 deterministic profile,不会改变正式 truth。 | confirmed_candidate |
| feature / peripheral enablement | `00` P0/P1 范围;`02` 外围 package / method set / collaboration boundary;`03` peripheral enablement / publication / handoff。 | 外围启停可以配置化,但不能前置为 core truth。 | confirmed_candidate |

### 3. 更新时机来源池确认

| 更新时机候选 | 来源池确认 | 写入理由 | R4.7 状态 |
|---|---|---|---|
| design-time only | `00/01/02/03` truth boundary、state matrix、DTO / schema、transaction / replay / marker source 约束。 | 这些边界只能通过正式设计变更和实现提交生效。 | confirmed_candidate |
| startup / cold update | `03` §13.6 load / validate / resolve / assemble / precheck;Step 3 startup config 候选。 | runtime 构造前验证并冻结,符合 builder 语义。 | confirmed_candidate |
| job-run-start freeze | `02` Operations Job、`03` job runner / report / retry 句段。 | 新 job run 进入时冻结 batch / retry / scope / report 语义。 | confirmed_candidate |
| entry-local | `03` §13.2 entry read boundary;`02` entry-local 影响轮廓。 | 只影响当前 entry,不需要新增全局配置契约。 | confirmed_candidate |
| hot runtime update watch | `03` §13 未闭 reload contract;Step 3 watch_only / pass_with_watch。 | 现阶段只能作为 watch,不能写成正式能力。 | watch_only |

### 4. 禁止配置化项来源池确认

| 禁止配置化项候选 | 来源池确认 | 写入理由 | R4.7 状态 |
|---|---|---|---|
| Definition vs Use 分离 | `00` 正文排除与范围边界;`01` 数据所有权;`02` §11.2;`03` §13.7。 | 属于定义 / 使用的核心边界,不能由配置改变。 | confirmed_candidate |
| 方法资产定义 truth owner | `01` 数据所有权与依赖方向;`02` 方法资产定义 truth owner;`03` forbidden configurable boundary。 | 这是当前仓的 truth owner,必须稳定。 | confirmed_candidate |
| state transition / formalization guard | `02` 状态 / 迁移;`03` 状态矩阵和 guard。 | profile 或 flag 不能改写正式状态语义。 | confirmed_candidate |
| Query no-write | `02` query 边界;`03` query flow / persistence / job no-write。 | query 只能读取派生材料,不能写 truth。 | confirmed_candidate |
| Operations Job no-truth-repair | `02` job 不修 truth;`03` job flow / degraded / recovery contract。 | 后台维护只能修派生材料和进度,不能修 truth。 | confirmed_candidate |
| Inbound only body-free | `00` 外部正文排除;`02` inbound body-free;`03` inbound protocol / envelope / body-free validation。 | inbound 只能承接 body-free summary / ref。 | confirmed_candidate |
| Outbound only candidate / handoff no-truth-proof | `02` candidate / handoff 区分;`03` publisher / handoff / target binding。 | delivery / receipt 不等于 truth proof。 | confirmed_candidate |
| stored replay / idempotency | `03` stored replay / duplicate replay / idempotency contract。 | 不能用配置关闭 replay 或让重复请求重跑 mutation。 | confirmed_candidate |
| transaction boundary / expected version | `02` 事务一致性;`03` persistence / transaction consistency。 | 不能靠配置绕过并发控制。 | confirmed_candidate |
| marker source / mapper closure | `03` marker / mapper / config / evidence 缺口暂停规则。 | marker 只能来自正式 summary / mapper / state,不能合成。 | confirmed_candidate |
| public DTO / event / job schema | `03` contract / protocol schema。 | public surface 不是普通配置。 | confirmed_candidate |
| P0 / P1 范围隔离 | `00` P0/P1;`02` peripheral / pipeline boundary。 | 外围能力不能因配置进入 core 前置。 | confirmed_candidate |

### 5. 配置域分类来源池确认

| Step 3 配置域 | 来源池确认 | 写入理由 | watch |
|---|---|---|---|
| runtime profile and entry readiness | `03` runtime assembly / entry precheck;`02` 配置影响轮廓。 | 直接承接 startup / entry-local 生效边界。 | no |
| repository and material store binding | `03` storage / repository adapter binding;`02` store root / read material availability。 | 这是 runtime 绑定点,适用 startup config。 | no |
| external source and resolver binding | `03` source / resolver adapter binding;`02` external summary / source allowlist。 | 敏感 ref 和 adapter kind 都有正式承接。 | no |
| inbound source binding | `03` inbound protocol / idempotency channel;`02` inbound consumer 轮廓。 | 可推出配置影响,但 formal binding 仍缺更强闭口。 | pass_with_watch |
| event publisher and handoff target binding | `03` publisher / handoff / target binding;`02` outbound event / collaboration boundary。 | 启停外围协作通道有正式入口。 | no |
| query and read material policy handles | `03` query / read policy handles;`02` query / projection / read material。 | 只是在既有读边界上做参数化。 | no |
| operations job runner policy | `03` job runner policy;`02` Operations Job。 | 批量、重试、lease 和 report 都属于现有 job 轴。 | no |
| safe diagnostics and redaction | `03` diagnostics / redaction;`02` safe diagnostic policy。 | 安全输出和 redaction 已是明确横切边界。 | no |
| downstream test / acceptance / implementation handoff | `03` downstream handoff;`02` test / acceptance / implementation 切口。 | 这里只把下游交接承接为配置语义。 | no |
| config center / admin override | `03` hot runtime update watch;`00/01/02` 配置与变更控制红线。 | 书写规范允许来源,但当前 `03` 没闭 dynamic runtime contract。 | watch_only |

### 6. watch 处理计划确认

| watch 项 | 当前状态 | 处理计划确认 | 是否阻塞 R4.7 |
|---|---|---|---|
| inbound source binding | pass_with_watch | 保留为配置域候选,后续 Step 4 收敛时继续校验是否需要 formal binding / config carrier;若新增契约则回 `03`。 | 不阻塞 |
| config center / admin override | watch_only | 只作为 P1/P2 候选来源和 hot runtime update watch;不得进入 P0 final。 | 不阻塞 |

### 7. 对 03 的影响预判

| 候选结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 配置类别来源池来自 `00/01/02/03` 既有边界 | 否 | 04 分类来源说明 | 不适用 | 已确认 |
| 更新时机来源池来自 `03` runtime builder / job-run-start / entry-local | 否 | 04 时机说明 | 不适用 | 已确认 |
| 禁止配置化项来源池来自 `00/01/02/03` 红线 | 否 | 04 禁止项说明 | 不适用 | 已确认 |
| inbound source binding 仍保留 watch | 否,暂不回写 | watch | 待后续 Step 判定 | 已确认 |
| config center / admin override 仍保留 watch_only | 否,暂不回写 | P1/P2 watch | 后续 Step 5/10/13 或 `03` | 已确认 |
| 若后续来源池需要新增 runtime reload、builder 参数、adapter constructor、DTO、port、marker 或 flow | 是 | 代码契约新增 | `03` owning Step | 阻塞待确认 |

### 8. R4.7 写入计划

`R4.7 分类边界停审:先思考` 应把 R4.6 的来源池确认落成分类边界可恢复记录:

1. 写当前模块目标和允许 / 禁止范围。
2. 写分类边界停审的判断轴。
3. 写逐配置域的适用类别 / 不适用类别 / 禁止项 / watch 结论。
4. 写分类边界停审记录。
5. 写对 `03-详细设计.md` 的影响判定。
6. 写 R4.8 写入计划。
7. 不写配置分类 final 表、禁止配置化 final 表、配置项清单、JSON demo、secret schema、测试、验收、实施或代码。

### 9. R4.6 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R4.6 一个模块 | pass |
| 是否把 R4.5 来源池候选固定为可恢复记录 | pass |
| 是否保留 watch 项追踪状态 | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写配置分类 final 表、禁止配置化 final 表或配置项清单 | pass |
| 是否未写 JSON demo、secret schema、测试、验收、实施或代码 | pass |
| 是否形成 R4.7 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.8 分类边界停审:再写入`;只允许把 R4.7 的停审判断落成分类边界停审记录、03 影响判定和 R4.9 写入计划;不得创建正式 `04-配置设计.md`;不得写配置分类 final 表、禁止配置化 final 表、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码;不得把 watch 项当作已无条件关闭.

## R4.7 分类边界停审:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 将 R4.6 已确认的来源池逐配置域落成停审判断,确认适用类别、不适用类别、禁止项和 watch 是否仍合法,形成 Step 4 的分类边界停审记录和 R4.8 写入计划。 |
| 本模块允许 | 审查配置域边界,写停审判断、03 影响预判和 R4.8 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写配置分类 final 表、禁止配置化 final 表、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |
| 当前恢复依据 | R4.6 已完成来源池确认和 watch 处理确认;R4.7 只负责把来源池转成边界停审结论。 |

### 2. 分类边界停审判断轴

| 判断轴 | R4.7 裁决 |
|---|---|
| 配置类别适用性 | 只要来源池仍能合法推出该配置类别,且不把 design boundary 伪装成配置项,即可继续沿用。 |
| 更新时机合法性 | startup / job-run-start / entry-local / watch 的边界不能跨越为核心 hot runtime update。 |
| 禁止配置化稳定性 | `00/01/02/03` 已列禁止项继续视为 static boundary,不得经配置绕开。 |
| watch 项处理 | inbound source binding 保持 pass_with_watch;config center / admin override 保持 watch_only。 |
| 03 影响判定 | 若没有新增 runtime config/builder/port/DTO/marker/flow,则不回写 `03`。 |

### 3. 逐配置域停审

| 配置域 | 适用类别结论 | 不适用类别结论 | 禁止项结论 | watch | 03 影响判定 | 停审结果 |
|---|---|---|---|---|---|---|
| runtime profile and entry readiness | startup runtime config;entry-local parameters;test fixture / deterministic config | static design boundary as config;hot runtime update | 不得改变 truth / state / schema / transaction / marker | no | 无回写 | pass |
| repository and material store binding | startup runtime config;sensitive ref config;test fixture / deterministic config | transaction boundary config;query repair config | 不得改写 store truth 或 expected version 语义 | no | 无回写 | pass |
| external source and resolver binding | startup runtime config;sensitive ref config;policy-like technical knobs | external body config;marker synthesis config | 不得从 raw body / error 合成 marker | no | 无回写 | pass |
| inbound source binding | startup runtime config;sensitive ref config;policy-like technical knobs | command emulation config;raw payload config | 不得把 inbound 变成 truth repair 或 raw body 承载 | pass_with_watch | 暂不回写 | pass_with_watch |
| event publisher and handoff target binding | startup runtime config;sensitive ref config;job-run-start config | delivery proves truth config;event schema config | 不得让 receipt / delivery 反证本地 truth | no | 无回写 | pass |
| query and read material policy handles | startup runtime config;policy-like technical knobs;entry-local parameters | query write / repair config | 不得将 query 变成写路径 | no | 无回写 | pass |
| operations job runner policy | job-run-start config;policy-like technical knobs;diagnostic config | core mutation config;truth repair config | 不得让 job 直接修 truth | no | 无回写 | pass |
| safe diagnostics and redaction | startup runtime config;diagnostic / redaction config;sensitive ref config | raw secret / raw endpoint / raw body output config | 不得放宽 forbidden body 或高危明文输出 | no | 无回写 | pass |
| downstream test / acceptance / implementation handoff | diagnostic / redaction config;test fixture / deterministic config;feature / peripheral enablement | TC / AC / commit boundary as config | 不得把测试门禁当成正式配置真相源 | no | 无回写 | pass |
| config center / admin override | hot runtime update watch;feature / peripheral enablement watch | P0 startup source final;core live override | 不得进入 P0 final 或改 core semantics | watch_only | 暂不回写 | watch_only |

### 4. 分类边界停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 配置类别边界 | pass | R4.6 确认的九类来源池仍可从上游边界合法推出。 |
| 更新时机边界 | pass | P0 维持 startup / job-run-start / entry-local / watch,未引入核心 hot runtime update。 |
| 禁止配置化边界 | pass | `00/01/02/03` 的禁止项仍为 static boundary,不得被配置绕开。 |
| watch 项 | pass_with_watch / watch_only | inbound source binding 继续追踪,config center / admin override 继续 watch_only。 |
| 03 回写 | 无回写 | 本轮未新增 runtime config、builder、port、DTO、marker 或 flow。 |

### 5. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 九类配置类别继续成立 | 否 | 04 分类停审 | 不适用 | 无回写 |
| P0 仍不承诺核心 hot runtime update | 否 | 04 边界说明 | 不适用 | 无回写 |
| inbound source binding 继续 pass_with_watch | 否,暂不回写 | watch | 待后续 Step 判定 | 已确认 |
| config center / admin override 继续 watch_only | 否,暂不回写 | watch | 待后续 Step 判定 | 已确认 |
| 若后续需要 formal binding / dynamic override / hot reload | 是 | runtime contract / builder / flow 新增 | `03` owning Step | 阻塞待确认 |

### 6. R4.8 写入计划

`R4.8 分类边界停审:再写入` 应把 R4.7 的停审判断落成可恢复记录:

1. 写当前模块目标和允许 / 禁止范围。
2. 写分类边界停审的判断轴。
3. 写逐配置域的适用类别 / 不适用类别 / 禁止项 / watch 结论。
4. 写分类边界停审记录。
5. 写对 `03-详细设计.md` 的影响判定。
6. 写 R4.9 进入门禁。
7. 不写配置分类 final 表、禁止配置化 final 表、配置项清单、JSON demo、secret schema、测试、验收、实施或代码。

### 7. R4.7 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R4.7 一个模块 | pass |
| 是否把 R4.6 来源池转成停审判断 | pass |
| 是否保留 watch 项追踪状态 | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写配置分类 final 表、禁止配置化 final 表或配置项清单 | pass |
| 是否未写 JSON demo、secret schema、测试、验收、实施或代码 | pass |
| 是否形成 R4.8 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.8 分类边界停审:再写入`;只允许把 R4.7 的停审判断落成分类边界停审记录、03 影响判定和 R4.9 写入计划;不得创建正式 `04-配置设计.md`;不得写配置分类 final 表、禁止配置化 final 表、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码;不得把 watch 项当作已无条件关闭.

## R4.8 分类边界停审:再写入

### 1. 当前模块目标

`R4.8` 将 `R4.7` 的停审判断落成 Step 4 可恢复记录。当前模块只固定分类边界停审记录、对 `03-详细设计.md` 的影响判定和 `R4.9` 进入门禁。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块允许 | 写入分类边界停审记录、03 影响判定和下一模块门禁。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写配置分类 final 表、禁止配置化 final 表、配置项清单、key、默认值、profile merge order、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |
| 当前恢复依据 | R4.7 已完成逐配置域停审和 watch 裁决;R4.8 只负责把停审结论固定为可恢复记录。 |

### 2. 分类边界停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 配置类别边界 | pass | 九类来源池仍能从 `00/01/02/03` 合法推出,未出现新类别或伪配置项。 |
| 更新时机边界 | pass | 仅保留 design-time、startup / cold update、job-run-start、entry-local 和 watch,未打开核心 hot runtime update。 |
| 禁止配置化边界 | pass | `00/01/02/03` 的禁止项仍保持 static boundary,不得经配置绕开。 |
| watch 项 | pass_with_watch / watch_only | inbound source binding 继续追踪;config center / admin override 继续 watch_only。 |
| 03 回写 | 无回写 | 本轮未新增 runtime config、builder、port、DTO、marker 或 flow。 |

### 3. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 九类配置类别继续成立 | 否 | 04 停审结论 | 不适用 | 无回写 |
| P0 仍不承诺核心 hot runtime update | 否 | 04 边界说明 | 不适用 | 无回写 |
| inbound source binding 继续 pass_with_watch | 否,暂不回写 | watch | 待后续 Step 判定 | 已确认 |
| config center / admin override 继续 watch_only | 否,暂不回写 | watch | 待后续 Step 判定 | 已确认 |
| 若后续出现 formal binding / dynamic override / hot reload | 是 | runtime contract / builder / flow 新增 | `03` owning Step | 阻塞待确认 |

### 4. R4.9 写入计划

`R4.9 分类边界审计:先思考` 应把 R4.8 的停审记录落成审计准备记录:

1. 写当前模块目标和允许 / 禁止范围。
2. 写分类边界停审记录。
3. 写对 `03-详细设计.md` 的影响判定。
4. 写跨分类 / 禁止项审计准备点。
5. 写 R4.9 进入门禁。
6. 不写配置分类 final 表、禁止配置化 final 表、配置项清单、JSON demo、secret schema、测试、验收、实施或代码。

### 5. R4.8 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R4.8 一个模块 | pass |
| 是否把 R4.7 停审判断落成可恢复记录 | pass |
| 是否保留 watch 项追踪状态 | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写配置分类 final 表、禁止配置化 final 表或配置项清单 | pass |
| 是否未写 JSON demo、secret schema、测试、验收、实施或代码 | pass |
| 是否形成 R4.9 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.9 分类边界审计:先思考`;只允许把 R4.8 的停审记录落成跨分类 / 禁止项审计准备点、03 影响审计和 R4.10 写入计划;不得创建正式 `04-配置设计.md`;不得写配置分类 final 表、禁止配置化 final 表、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码;不得把 watch 项当作已无条件关闭.

## R4.9 分类边界审计:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 基于 R4.8 的停审记录,审查配置类别、更新时机、禁止配置化项和 watch 是否存在跨分类冲突、遗漏或污染,形成 Step 4 的审计准备记录和 R4.10 写入计划。 |
| 本模块允许 | 写跨分类审计判断、watch 审计、03 影响审计和 R4.10 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写配置分类 final 表、禁止配置化 final 表、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |
| 当前恢复依据 | R4.8 已完成停审记录和影响判定;R4.9 只负责审计准备。 |

### 2. 跨分类审计判断轴

| 判断轴 | R4.9 裁决 |
|---|---|
| 配置类别互斥性 | 九类配置来源池仍保持互斥语义,没有把 static design boundary 误降级为普通配置项。 |
| 更新时机隔离 | design-time / startup / job-run-start / entry-local / watch 仍保持分层,没有把 core hot runtime update 伪装成已闭口能力。 |
| 禁止项稳定性 | `00/01/02/03` 的禁止配置化项没有被任何配置域穿透。 |
| watch 污染 | inbound source binding 仍为 pass_with_watch,config center / admin override 仍为 watch_only。 |
| 03 影响审计 | 本轮未引入新 runtime config、builder、port、DTO、marker 或 flow,因此不回写 `03`。 |

### 3. 逐项审计准备

| 审计项 | 结论 | 说明 |
|---|---|---|
| 配置类别重叠 | pass | 九类来源池没有互相覆盖的定义冲突。 |
| 更新时机越界 | pass | P0 仍不承诺核心 hot runtime update。 |
| 禁止项遗漏 | pass | 需求 / 架构 / 概要 / 详细设计的禁止边界已全部承接。 |
| watch 误关闭 | pass_with_watch / watch_only | 两个 watch 项继续保留追踪状态。 |
| 03 回写缺口 | 无回写 | 当前不需要新增 runtime 契约。 |

### 4. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 九类配置类别继续成立 | 否 | 04 审计结论 | 不适用 | 无回写 |
| 更新时机仍停留在 design-time / startup / job-run-start / entry-local / watch | 否 | 04 审计结论 | 不适用 | 无回写 |
| inbound source binding 继续 pass_with_watch | 否,暂不回写 | watch | 待后续 Step 判定 | 已确认 |
| config center / admin override 继续 watch_only | 否,暂不回写 | watch | 待后续 Step 判定 | 已确认 |
| 若后续发现 category overlap、hot reload 或 dynamic override 需要 formal binding | 是 | runtime contract / flow 新增 | `03` owning Step | 阻塞待确认 |

### 5. R4.10 写入计划

`R4.10 分类边界审计:再写入` 应把 R4.9 的审计准备落成 Step 4 可恢复记录:

1. 写当前模块目标和允许 / 禁止范围。
2. 写跨分类审计判断轴。
3. 写逐项审计准备结果。
4. 写对 `03-详细设计.md` 的影响判定。
5. 写 R4.11 进入门禁。
6. 不写配置分类 final 表、禁止配置化 final 表、配置项清单、JSON demo、secret schema、测试、验收、实施或代码。

### 6. R4.9 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R4.9 一个模块 | pass |
| 是否把 R4.8 停审记录转成审计准备 | pass |
| 是否保留 watch 项追踪状态 | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写配置分类 final 表、禁止配置化 final 表或配置项清单 | pass |
| 是否未写 JSON demo、secret schema、测试、验收、实施或代码 | pass |
| 是否形成 R4.10 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.10 分类边界审计:再写入`;只允许把 R4.9 的审计准备落成跨分类审计记录、03 影响审计和 R4.11 写入计划;不得创建正式 `04-配置设计.md`;不得写配置分类 final 表、禁止配置化 final 表、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码;不得把 watch 项当作已无条件关闭.

## R4.10 分类边界审计:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 将 R4.9 的审计准备落成审计记录,固定配置类别、更新时机、禁止配置化项和 watch 的跨分类审计结论,并确认 Step 4 收口与 Step 5 进入门禁。 |
| 本模块允许 | 写跨分类审计记录、03 影响审计和 Step 5 进入门禁。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写配置分类 final 表、禁止配置化 final 表、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |
| 当前恢复依据 | R4.9 已完成跨分类审计准备;R4.10 只负责把准备收口为可恢复记录。 |

### 2. 跨分类审计记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 配置类别互斥性 | pass | 九类来源池仍保持互斥语义,未出现重叠或降级。 |
| 更新时机隔离 | pass | design-time / startup / job-run-start / entry-local / watch 仍保持分层,未打开核心 hot runtime update。 |
| 禁止项稳定性 | pass | `00/01/02/03` 的禁止配置化项未被任何配置域穿透。 |
| watch 污染 | pass_with_watch / watch_only | inbound source binding 继续追踪,config center / admin override 继续 watch_only。 |
| 03 回写 | 无回写 | 本轮未新增 runtime config、builder、port、DTO、marker 或 flow。 |

### 3. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 九类配置类别继续成立 | 否 | 04 审计结论 | 不适用 | 无回写 |
| 更新时机仍停留在 design-time / startup / job-run-start / entry-local / watch | 否 | 04 审计结论 | 不适用 | 无回写 |
| inbound source binding 继续 pass_with_watch | 否,暂不回写 | watch | 待后续 Step 判定 | 已确认 |
| config center / admin override 继续 watch_only | 否,暂不回写 | watch | 待后续 Step 判定 | 已确认 |
| 若后续发现 category overlap、hot reload 或 dynamic override 需要 formal binding | 是 | runtime contract / flow 新增 | `03` owning Step | 阻塞待确认 |

### 4. Step 5 进入门禁

`R5.1 开工与必读文档:先思考` 只能在以下条件满足后进入:

| 门禁项 | 结果 |
|---|---|
| Step 4 跨分类审计记录已写入 | pass |
| Step 4 对详细设计的影响判定已写入 | pass |
| watch 项仍保持追踪状态 | pass |
| 未创建正式 `04-配置设计.md` | pass |
| 未写配置分类 final 表、禁止配置化 final 表、配置项清单、JSON demo、secret schema、测试、验收、实施或代码 | pass |

### 5. R4.10 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R4.10 一个模块 | pass |
| 是否把 R4.9 审计准备落成审计记录 | pass |
| 是否保留 watch 项追踪状态 | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写配置分类 final 表、禁止配置化 final 表或配置项清单 | pass |
| 是否未写 JSON demo、secret schema、测试、验收、实施或代码 | pass |
| 是否形成 Step 5 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.1 开工与必读文档:先思考`;只允许围绕 Step 5 的开工边界、必读文档、输入基线、输出要求和进入门禁做准备;不得创建正式 `04-配置设计.md`;不得写配置分类 final 表、禁止配置化 final 表、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码;不得把 watch 项当作已无条件关闭.
