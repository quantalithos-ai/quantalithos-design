# Step 5. 定义配置来源、优先级与冲突处理

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 5
> 书写规范: `standards/document/配置设计书写规范.md`
> 回填章节: `04-配置设计.md` §5 配置来源、优先级与冲突处理
> 创建日期: 2026-06-25
> 当前状态: `R5.10 来源优先级停审与跨来源冲突审计:再写入` completed_wait_user_confirm_to_R6.1
> 当前门禁: 等待确认进入 Step 6 `R6.1 开工与必读文档:先思考`

---

## 0. Step 5 边界

Step 5 在 Step 3 的配置来源链、配置控制面、配置域和 Step 4 的配置分类、更新时机、禁止配置化边界基础上,讨论配置来源覆盖链、来源优先级、冲突处理、不可用策略、按配置域组织的来源覆盖边界、来源优先级停审和跨来源冲突审计框架。

当前 Step 不定义具体配置项、key、默认值、profile merge order、环境变量名、配置文件格式、JSON demo、secret provider、secret 名称、loader 函数、validator schema、部署命令、测试用例、验收门禁、实施计划或代码。

---

## R5.1 开工与必读文档:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 思考 Step 5 的开工边界、必读文档、Step 3 / Step 4 输入承接、SOP 产出要求、来源与优先级讨论轴、冲突处理讨论轴、watch 项承接、对 `03-详细设计.md` 的影响判定框架和 R5.2 写入计划。 |
| 本模块允许 | 创建并写入 Step 5 中间产物的开工思考;只记录必读文档、输入基线、讨论轴、停审框架、03 影响判定和 R5.2 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写最终配置来源优先级表、最终冲突处理表、按配置域来源覆盖 final 表、配置项清单、key、默认值、profile merge order、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | Step 4 已关闭为 `R4.10 分类边界审计:再写入 completed_wait_user_confirm_to_R5.1`;用户已确认进入 R5.1。 |

### 2. Step 5 开工边界思考

| 边界项 | R5.1 裁决 |
|---|---|
| Step 5 定位 | 从“有哪些来源 / 哪些类别”进入“来源之间如何覆盖、冲突如何判定、不可用时如何处理”。 |
| 直接输入 | Step 3 final candidate output、Step 4 closing gate、SOP Step 5、书写规范 §5.5、正式 `00/01/02/03`、L1-governance Step 5 框架参考。 |
| 输出粒度 | 先建立来源优先级和冲突处理讨论框架,不提前写最终来源表和配置域覆盖表。 |
| 配置项边界 | Step 5 只能定义来源规则,不能把规则下沉成具体配置项、key、env var、JSON schema 或 secret ref 名称。 |
| watch 承接 | `inbound source binding` 继续 `pass_with_watch`;`config center / admin override` 继续 `watch_only`,不得在 R5.1 写成 P0 来源。 |
| 对 03 的影响 | 若来源优先级需要新增 runtime config carrier、builder 参数、adapter constructor、trait / port、DTO、mapper、marker、state、flow、loader / validator contract 或 hot reload / admin override contract,必须回 `03-详细设计.md`。 |
| 下游边界 | Step 5 不替代 Step 6 profile 矩阵、Step 7 配置项清单、Step 8 secret 管理、Step 9 加载校验、Step 10 变更审计、Step 11 失效策略或 `05/06/07`。 |

### 3. 必读文档思考

| 必读文档 | 读取用途 | R5.2 用法 |
|---|---|---|
| `project_execution_ledger.md` | 确认当前允许进入 Step 5 R5.1。 | 写入 Step 5 当前恢复依据。 |
| `04_config_calibration_flow.md` | 确认 Step 5 主题、状态表和执行纪律。 | 写入 Step 5 当前状态和 next_allowed_action。 |
| `04_config_step_03_control_plane.md` | 承接配置来源链、装配入口、读取边界、配置域和 watch 项。 | 写入来源规则输入基线。 |
| `04_config_step_04_categories_boundaries.md` | 承接九类配置类别、更新时机、禁止配置化项、分类审计和 Step 5 进入门禁。 | 写入分类与来源优先级的衔接规则。 |
| `配置设计讨论流程_SOP.md` Step 5 | 固定本步目标、输入、输出、八个问题、停审和进入下一步条件。 | 写入 Step 5 产出要求和讨论问题入口。 |
| `配置设计书写规范.md` §5.5 | 固定来源优先级表和冲突处理表的正式写法。 | 写入来源表 / 冲突表的列约束。 |
| `设计文档讨论中间产物规范.md` | 固定逐模块、先思考后写入和台账恢复纪律。 | 约束 R5.1 -> R5.2。 |
| `设计真相源闭环与可落码性标准.md` | 固定缺 schema / port / mapper / config / evidence 时必须暂停。 | 写入 03 影响判定和 blocker 触发规则。 |
| `00-需求文档.md` | 提供 Definition vs Use、P0/P1、相邻仓非职责和正文排除边界。 | 支撑来源规则不得扩大本仓职责。 |
| `01-架构设计.md` | 提供数据所有权、依赖方向、外围不前置和配置变更控制边界。 | 支撑来源规则不得越过架构不变量。 |
| `02-概要设计.md` §11 | 提供配置影响轮廓和禁止配置化边界。 | 支撑来源不可覆盖 forbidden boundary。 |
| `03-详细设计.md` §13 / §16 | 提供 config binding、runtime builder、adapter availability、external dependency 和 downstream handoff owner。 | 支撑来源优先级、不可用策略和 03 影响判定。 |
| L1-governance Step 5 | 提供来源优先级、冲突处理、按域覆盖、停审和跨来源审计的框架深度。 | 只参考结构,不复制 governance 领域事实、来源值或配置域结论。 |

### 4. Step 3 / Step 4 输入承接思考

| 输入 | Step 5 接收方式 | 不得接收 |
|---|---|---|
| Step 3 来源链 | 接收 `code defaults -> config file -> environment variables -> secret refs -> test fixture / controlled override -> config center / admin override` 作为来源讨论池。 | 不把该链直接当最终优先级;R5.3 起才逐步判定。 |
| Step 3 装配入口 | 接收 `load raw config -> validate family -> resolve slots -> assemble ports -> entry precheck` 作为冲突和不可用策略落点。 | 不写 loader 函数、validator schema 或 builder 签名。 |
| Step 3 读取边界 | 接收 infra raw config、application typed setting、entry readiness、contracts/domain no config。 | 不允许 application/domain/contracts 读取 raw file/env/secret。 |
| Step 3 配置域 | 接收 runtime profile、repository/material store、external source/resolver、inbound source watch、publisher/handoff target、query/read material policy、operations job runner、safe diagnostics/redaction、downstream handoff。 | 不把配置域直接展开为配置项清单。 |
| Step 4 配置类别 | 接收 static design boundary、startup、job-run-start、entry-local、technical knobs、sensitive ref、diagnostic、test fixture、feature/peripheral enablement。 | 不写最终来源优先级表。 |
| Step 4 更新时机 | 接收 design-time、startup / cold update、job-run-start、entry-local、hot runtime update watch。 | 不承诺 P0 core hot runtime update。 |
| Step 4 禁止配置化项 | 接收 Definition vs Use、truth owner、state transition、query no-write、job no-truth-repair、body-free、stored replay、transaction boundary、marker source、public schema、P0/P1 隔离。 | 不允许任何来源覆盖这些 static boundary。 |
| Step 4 watch | inbound source binding 保持 pass_with_watch;config center / admin override 保持 watch_only。 | 不把 watch 项关闭为 final pass。 |

### 5. SOP Step 5 产出和问题思考

| SOP 要求 | R5.2 处理方式 |
|---|---|
| 配置来源优先级表 | 先写来源类型、优先级讨论轴、适用配置类型、冲突和不可用问题入口;不写 final table。 |
| 冲突处理表 | 先建立冲突场景池:同名多来源、高优先级非法、重复 key、alias key、必填缺失、secret raw、forbidden boundary override、fixture 污染 production-like。 |
| 按配置域组织的来源覆盖表 | 先建立逐域来源覆盖讨论入口,后续 R5.5/R5.6 再落成候选表。 |
| 来源优先级停审记录 | R5.7/R5.8 执行逐来源 / 逐域停审。 |
| 跨来源冲突审计表 | R5.9/R5.10 审计 secret 覆盖、同名冲突、环境来源漂移、不可用策略不一致、watch 项污染和 03 回写缺口。 |
| 八个 SOP 问题 | R5.2 先落成问题入口和候选讨论轴,R5.3 起逐项收敛。 |

### 6. 来源与优先级讨论轴思考

| 讨论轴 | R5.2 后续写入入口 |
|---|---|
| 普通来源链 | code defaults、config file、environment variables 的覆盖方向和非法值处理。 |
| secret / credential refs | 普通来源是否只承载 ref,raw secret 是否永远不进入普通配置链。 |
| entry-local parameters | entry-local 是否只选择当前 entry / job 的 source/profile/scope,不得覆盖全局配置和禁止项。 |
| test fixture / deterministic override | fixture 是否只在 local / CI test harness 生效,不得进入 production-like profile。 |
| config center / admin override | 当前只保留为 watch_only / P1/P2 candidate,不得写成 P0 来源、热更新或 live override。 |
| required missing | startup 必填、job-run-start 必填和 entry-local 必填缺失分别如何阻断。 |
| unavailable source | config file 不可读、secret resolver unavailable、external source unavailable、adapter unavailable、fixture missing 如何映射。 |
| forbidden override | 任一来源试图改 truth owner、state transition、query no-write、stored replay、transaction boundary、marker source、body-free 或 public schema 时如何拒绝。 |
| per-domain coverage | 每个配置域必须写允许来源、禁止来源、优先级和不可用策略。 |

### 7. 冲突处理讨论轴思考

| 冲突类型 | 当前思考 | 后续模块 |
|---|---|---|
| 同一语义出现在多个普通来源 | 需要确定高优先级覆盖低优先级,以及非法高优先级值是否 fail-fast。 | R5.3 / R5.4 |
| 单个配置文件重复 key | 需要判定为歧义而非任选其一。 | R5.3 / R5.4 |
| alias key / legacy key | 需要判定是否允许兼容,若允许必须有明确去重规则;否则 fail-fast。 | R5.3 / R5.4 |
| secret raw value | 需要固定普通 file/env/entry-local 不承载 raw secret、token、password、private key、certificate body。 | R5.3 / R5.4;Step 8 |
| feature disabled target missing | 需要区分 disabled optional target 与 enabled required target。 | R5.5 / R5.6 |
| test fixture 覆盖生产配置 | 需要固定 production-like profile 不接受 test fixture。 | R5.5 / R5.6;Step 6 |
| config center / admin override P0 污染 | 需要固定 watch_only,若启用则回 `03` / 架构闭口。 | R5.9 / R5.10 |
| watch 项冲突 | inbound source binding 不得借来源优先级补 formal binding;缺 contract 时回 `03`。 | R5.7 / R5.10 |

### 8. 对 03 的影响判定框架

| Step 5 结论类型 | 是否影响 03 | 处理规则 |
|---|---|---|
| 只在 04 中说明既有来源类型的覆盖顺序、冲突处理和不可用策略 | 通常否 | 记录为 `无回写`,后续 Step 7/9 继续核对。 |
| 只声明普通来源不能覆盖 secret raw value 或 forbidden boundary | 否 | 留在 04 安全 / 来源规则,Step 8 承接。 |
| 声明 config center / admin override 进入 P0、支持动态生效、支持 live override 或热更新 | 是 | 暂停并回 `03` runtime loader / audit / rollback / config contract。 |
| 来源规则需要新增 config carrier、builder 参数、adapter constructor、trait / port、DTO、mapper、marker、state、flow、loader / validator contract | 是 | 暂停并回 `03-详细设计.md` owning Step。 |
| 用来源优先级覆盖 truth owner、state transition、query no-write、stored replay、transaction boundary、marker source、body-free rule、public schema 或 P0/P1 隔离 | 是且越界 | 立即暂停,不得在 04 内补口。 |
| 旧 `05/06/07` 与当前来源规则冲突 | 否 | 旧下游继续作为 direction input,不得覆盖当前 03/04。 |

### 9. R5.2 写入计划思考

`R5.2 开工与必读文档:再写入` 应把 R5.1 思考落成可恢复记录:

1. 写 Step 5 当前模块目标和允许 / 禁止范围。
2. 写 Step 5 输入基线表。
3. 写必读文档清单。
4. 写 SOP Step 5 产出要求和问题入口。
5. 写来源与优先级讨论轴。
6. 写冲突处理讨论轴。
7. 写对 `03-详细设计.md` 的影响判定框架。
8. 写 `R5.3 SOP 问题回答与来源规则候选:先思考` 进入门禁。
9. 不写最终来源优先级表、最终冲突处理表、按配置域来源覆盖 final 表、配置项清单、JSON demo、secret schema、测试、验收、实施或代码。

### 10. R5.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按台账从 Step 4 进入 Step 5 | pass |
| 是否只推进 R5.1 一个模块 | pass |
| 是否创建 Step 5 中间产物文件 | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写最终来源优先级表、最终冲突处理表或按配置域来源覆盖 final 表 | pass |
| 是否未写配置项、key、默认值、profile merge order、JSON demo、secret schema、测试、验收、实施或代码 | pass |
| 是否保留 inbound source binding 和 config center / admin override watch 状态 | pass |
| 是否形成 R5.2 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.2 开工与必读文档:再写入`;只允许把 R5.1 思考落成 Step 5 当前模块目标、输入基线、必读文档清单、SOP 产出要求、来源与优先级讨论轴、冲突处理讨论轴、03 影响判定框架和 R5.3 进入门禁;不得创建正式 `04-配置设计.md`;不得写最终来源优先级表、最终冲突处理表、按配置域来源覆盖 final 表、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码;不得把 watch 项当作已无条件关闭。

---

## R5.2 开工与必读文档:再写入

### 1. 当前模块目标

`R5.2` 将 `R5.1` 的开工思考落成 Step 5 可恢复记录。当前模块只固定 Step 5 输入基线、必读文档、SOP 产出要求、来源与优先级讨论轴、冲突处理讨论轴、对 `03-详细设计.md` 的影响判定框架和 `R5.3` 进入门禁。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块允许 | 写入 Step 5 当前模块目标、输入基线、必读文档清单、SOP 产出要求、来源与优先级讨论轴、冲突处理讨论轴、03 影响判定框架和下一模块门禁。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写最终来源优先级表、最终冲突处理表、按配置域来源覆盖 final 表、配置项清单、key、默认值、profile merge order、环境变量名、配置文件格式、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |
| 当前恢复依据 | R5.1 已完成 Step 5 开工边界、必读文档、Step 3 / Step 4 输入承接、SOP 产出要求、来源与优先级讨论轴、冲突处理讨论轴、03 影响判定框架和 R5.2 写入计划。 |

### 2. Step 5 输入基线

| 输入 | 当前定位 | Step 5 用法 | 禁止用法 |
|---|---|---|---|
| Step 3 final candidate output | 直接输入 | 接收来源链、装配入口、读取边界、配置域和 watch 项。 | 不把 Step 3 来源链直接写成最终优先级。 |
| Step 4 closing gate | 直接输入 | 接收九类配置类别、更新时机、禁止配置化项、watch 状态和 Step 5 进入门禁。 | 不把 Step 4 分类边界直接扩展成配置项清单。 |
| `00-需求文档.md` | 正式上游 | 提供 Definition vs Use、P0/P1、相邻仓非职责和正文排除边界。 | 不用来源优先级扩大本仓 truth owner 或恢复旧主线。 |
| `01-架构设计.md` | 正式上游 | 提供数据所有权、依赖方向、外围不前置和配置变更控制边界。 | 不用 file/env/admin override 改变架构依赖和数据所有权。 |
| `02-概要设计.md` §11 | 正式上游 | 提供配置影响轮廓、禁止配置化边界和 03 / 04 分工。 | 不把概要影响点直接写成 key、env var、secret 名或 JSON schema。 |
| `03-详细设计.md` §13 / §16 | 直接输入 | 提供 config binding、runtime builder、adapter availability、external dependency、handoff owner 和 forbidden boundary。 | 不新增 runtime config carrier、builder 参数、adapter constructor、trait / port、DTO、mapper、marker、state、flow 或 evidence schema。 |
| 旧 `05/06/07` | old_direction_input | 只提醒后续测试、验收、实施承接方向。 | 不反向定义来源优先级、TC、AC、phase、commit boundary 或 evidence 口径。 |
| L1-governance Step 5 | framework_reference | 参考来源优先级、冲突处理、按域覆盖、停审和跨来源审计的结构深度。 | 不复制 governance 领域事实、来源值、配置域结论或 P0/P1 裁决。 |

### 3. 必读文档清单

| 必读文档 | 读取状态 | 本 Step 用途 |
|---|---|---|
| `projects/L3-method-library/design-calibration/project_execution_ledger.md` | pass | 确认当前模块、gate_status 和 next_allowed_action。 |
| `projects/L3-method-library/design-calibration/04_config_calibration_flow.md` | pass | 确认 Step 5 主题、状态表、执行纪律和 Step 文件路径。 |
| `projects/L3-method-library/design-calibration/04_config_step_03_control_plane.md` | pass | 承接 Step 3 来源链、装配入口、读取边界、配置域和 watch 项。 |
| `projects/L3-method-library/design-calibration/04_config_step_04_categories_boundaries.md` | pass | 承接 Step 4 配置类别、更新时机、禁止配置化项、watch 状态和 Step 5 进入门禁。 |
| `standards/document/配置设计讨论流程_SOP.md` Step 5 | pass | 固定 Step 5 目标、输入、输出、八个问题、执行约束和进入下一步条件。 |
| `standards/document/配置设计书写规范.md` §5.5 | pass | 固定正式 04 §5 的来源优先级表和冲突处理表写法。 |
| `standards/document/设计文档讨论中间产物规范.md` | pass | 固定逐模块、先思考后写入、台账同步和不得批量越过模块的纪律。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | pass | 固定缺 schema / port / mapper / config / evidence 时必须暂停回设计。 |
| `projects/L3-method-library/00-需求文档.md` | pass | 提供来源规则不得越过需求边界的依据。 |
| `projects/L3-method-library/01-架构设计.md` | pass | 提供来源规则不得改变架构不变量和依赖方向的依据。 |
| `projects/L3-method-library/02-概要设计.md` | pass | 提供配置影响轮廓、禁止配置化边界和配置设计承接说明。 |
| `projects/L3-method-library/03-详细设计.md` | pass | 提供 config binding、runtime builder、adapter availability、external dependency 和 forbidden boundary。 |
| `projects/L1-governance/design-calibration/04_config_step_05_sources_priority_conflicts.md` | pass | 只参考 Step 5 框架深度、表格组织和停审表达。 |

### 4. SOP Step 5 产出要求

| 产出 | 当前写入规则 | 后续模块 |
|---|---|---|
| 配置来源优先级表 | 需要覆盖来源、优先级、适用配置、冲突处理、不可用时策略;R5.2 不写 final 表。 | R5.3 / R5.4 |
| 冲突处理表 | 需要覆盖冲突场景、处理规则、是否阻断启动 / 操作;R5.2 只写讨论入口。 | R5.3 / R5.4 |
| 按配置域组织的来源覆盖表 | 每个配置域都要写允许来源、禁止来源、优先级和不可用策略;R5.2 不写 final 表。 | R5.5 / R5.6 |
| 来源优先级停审记录 | 每个来源 / 配置域检查优先级唯一、冲突可判定、不可用策略明确。 | R5.7 / R5.8 |
| 跨来源冲突审计表 | 审计 secret 覆盖、同名冲突、环境来源漂移、不可用策略不一致、P0/P1 污染、watch 项误关闭和 03 回写缺口。 | R5.9 / R5.10 |

### 5. SOP Step 5 问题入口

| SOP 问题 | 当前入口 | R5.3 处理方式 |
|---|---|---|
| code default、file、env、secret、config center、admin override 的优先级是什么? | Step 3 来源链和 Step 4 分类边界。 | 形成来源优先级候选,不写配置项 key 或 env var。 |
| 同名配置多处出现时如何冲突处理? | Step 3 raw load / validate / assemble 入口和书写规范 §5.5。 | 形成同名、多来源、重复 key、alias key 和高优先级非法值候选规则。 |
| 必填项缺失时是否阻断启动? | Step 4 更新时机: startup、job-run-start、entry-local。 | 区分 startup fail-fast、job rejected、entry rejected 的候选规则。 |
| 配置中心或密钥系统不可用时如何处理? | Step 4 watch_only 与 sensitive ref config。 | 固定 P0 config center / admin override 不进入来源 final;secret raw 不进入普通来源链。 |
| 哪些来源不能覆盖敏感配置? | Step 4 sensitive ref config 和禁止配置化边界。 | 形成 ordinary file/env/entry-local 不承载 raw secret 的候选规则。 |
| 每个配置域适用哪些来源,哪些来源禁止覆盖? | Step 3 配置域 final candidate output。 | R5.5/R5.6 逐域形成来源覆盖候选表。 |
| 每个配置域来源优先级完成后是否通过停审? | SOP 来源优先级停审要求。 | R5.7/R5.8 执行。 |
| 所有来源规则完成后是否存在 secret 被普通来源覆盖、同名配置冲突或不可用策略不一致? | SOP 跨来源冲突审计要求。 | R5.9/R5.10 执行。 |

### 6. 来源与优先级讨论轴

| 讨论轴 | 当前边界 | 依据 |
|---|---|---|
| code defaults | 可作为最低层 deterministic baseline 候选,但必须通过 validator,不得绕过 forbidden boundary。 | Step 3 来源链;`03` runtime builder |
| config file | 可作为普通配置来源候选,用于 startup / job-run-start / profile 相关配置。 | Step 3 来源链;书写规范 §5.5 |
| environment variables | 可作为普通配置覆盖来源候选,但非法值是否 fail-fast 需在 R5.3/R5.4 裁决。 | Step 3 来源链;SOP Step 5 |
| secret / credential refs | 只能先作为 ref 来源候选,raw secret / credential material 不进入普通来源链。 | Step 4 sensitive ref config;Step 8 下游 owner |
| entry-local parameters | 只影响当前 entry / job 的 selector、scope 或 run-local input,不得覆盖全局禁止项。 | Step 4 entry-local parameters |
| test fixture / deterministic override | 只允许在 local / CI test harness 讨论,不得污染 production-like profile。 | Step 4 test fixture category |
| config center | 当前为 watch_only / P1/P2 candidate,不得写成 P0 source final 或 hot update。 | Step 3 / Step 4 watch |
| admin override | 当前为 watch_only / P1/P2 candidate,不得写成 live override 或核心语义覆盖。 | Step 3 / Step 4 watch |
| forbidden boundary | 不接受任何来源覆盖。 | `00/01/02/03`;Step 4 禁止配置化项 |

### 7. 冲突处理讨论轴

| 冲突场景 | 当前边界 | R5.3 处理方式 |
|---|---|---|
| 同一语义多来源出现 | 需要判定覆盖顺序和非法值策略。 | 形成候选规则。 |
| 高优先级值存在但非法 | 需要判定是否 fail-fast,避免静默回退低优先级。 | 形成候选规则。 |
| config file 重复 key | 需要判定为歧义还是允许后写覆盖。 | 形成候选规则。 |
| alias key / legacy key 并存 | 需要判定是否允许兼容,以及冲突时是否 fail-fast。 | 形成候选规则。 |
| startup 必填项缺失 | 需要判定是否阻断 startup。 | 按更新时机形成候选规则。 |
| job-run-start 必填项缺失 | 需要判定是否 rejected 当前 job。 | 按更新时机形成候选规则。 |
| entry-local 必填项缺失 | 需要判定是否 rejected 当前 entry / job。 | 按更新时机形成候选规则。 |
| ordinary source 提供 raw secret | 必须作为安全冲突候选处理,不得进入 Step 5 final 普通来源。 | 与 Step 8 衔接。 |
| ordinary source 试图覆盖 forbidden boundary | 必须拒绝,不得变成来源优先级问题。 | 回指 Step 4 禁止项。 |
| config center / admin override 试图进入 P0 | 必须保持 watch_only 或回 `03` / 架构补口。 | R5.9/R5.10 审计。 |

### 8. 对 03 的影响判定框架

| Step 5 结论类型 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理规则 |
|---|---|---|---|---|
| 只说明既有来源类型的覆盖顺序、冲突处理和不可用策略 | 通常否 | 04 来源语义 | 不适用 | 记录 `无回写`。 |
| 普通来源不得承载 raw secret 或 forbidden body | 否 | 04 安全配置语义 | 不适用 | Step 8 继续展开。 |
| entry-local 不覆盖全局配置和禁止项 | 否 | 04 来源边界 | 不适用 | Step 7 / Step 9 继续核对。 |
| test fixture 仅 local / CI 生效 | 否 | 04 profile 语义 | 不适用 | Step 6 继续核对。 |
| config center / admin override 进入 P0、动态生效或 live override | 是 | runtime loader / audit / rollback / config contract | `03` §13 owning Step | 阻塞待确认。 |
| 新增 config carrier、builder 参数、adapter constructor、trait / port、DTO、mapper、marker、state、flow、loader / validator contract | 是 | 代码契约变更 | `03` owning Step | 暂停并回写 03。 |
| 来源优先级覆盖 truth owner、state transition、query no-write、stored replay、transaction boundary、marker source、body-free rule、public schema 或 P0/P1 隔离 | 是且越界 | forbidden boundary violation | `03` §13 / owning Step | 立即暂停。 |

### 9. R5.3 进入门禁

Step 5 `R5.3 SOP 问题回答与来源规则候选:先思考` 只能在以下条件满足后进入:

| 门禁项 | 结果 |
|---|---|
| Step 5 输入基线已写入 | pass |
| 必读文档清单已写入 | pass |
| SOP Step 5 产出要求已写入 | pass |
| SOP Step 5 问题入口已写入 | pass |
| 来源与优先级讨论轴已写入 | pass |
| 冲突处理讨论轴已写入 | pass |
| 对 `03-详细设计.md` 的影响判定框架已写入 | pass |
| watch 项仍保持追踪状态 | pass |
| 未创建正式 `04-配置设计.md` | pass |
| 未写最终来源优先级表、最终冲突处理表、按配置域来源覆盖 final 表、配置项、JSON、secret、测试、验收、实施或代码 | pass |

### 10. R5.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R5.2 一个模块 | pass |
| 是否把 R5.1 思考落成可恢复记录 | pass |
| 是否未写最终来源优先级表、最终冲突处理表或按配置域来源覆盖 final 表 | pass |
| 是否保留 inbound source binding 和 config center / admin override watch 状态 | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写配置项、key、默认值、profile merge order、JSON demo、secret schema、测试、验收、实施或代码 | pass |
| 是否形成 R5.3 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.3 SOP 问题回答与来源规则候选:先思考`;只允许围绕 SOP Step 5 八问形成来源优先级候选、冲突处理候选、必填缺失候选、secret / config center 不可用候选、敏感配置覆盖边界候选、逐配置域来源覆盖候选、03 影响预判和 R5.4 写入计划;不得创建正式 `04-配置设计.md`;不得写最终来源优先级表、最终冲突处理表、按配置域来源覆盖 final 表、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码;不得把 watch 项当作已无条件关闭。

---

## R5.3 SOP 问题回答与来源规则候选:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 围绕 SOP Step 5 八问形成来源优先级、冲突处理、必填缺失、secret / config center 不可用、敏感配置覆盖边界、逐配置域来源覆盖、03 影响预判和 R5.4 写入计划的候选思考。 |
| 本模块允许 | 写 SOP 八问候选回答、来源优先级候选、冲突处理候选、不可用策略候选、敏感覆盖边界候选、逐配置域来源覆盖候选、03 影响预判和 R5.4 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不把候选升级为最终来源优先级表、最终冲突处理表或按配置域来源覆盖 final 表;不写配置项 key、默认值、profile merge order、环境变量名、配置文件格式、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |
| 当前恢复依据 | R5.2 已完成 Step 5 输入基线、必读文档、SOP 产出要求、SOP 问题入口、来源与优先级讨论轴、冲突处理讨论轴、03 影响判定框架和 R5.3 进入门禁。 |

### 2. SOP 八问候选回答思考

| SOP 问题 | 候选回答 | 当前状态 | R5.4 写入注意 |
|---|---|---|---|
| code default、file、env、secret、config center、admin override 的优先级是什么? | 普通来源候选倾向为 `code defaults < config file < environment variables`;secret 只作为 ref / resolver 边界,不进入普通 raw value 覆盖链;entry-local 与 test fixture 分域生效;config center / admin override 保持 watch_only。 | candidate | 写成候选,不得标 final;不得写 key、env 名或 config center 产品。 |
| 同名配置多处出现时如何冲突处理? | 多普通来源同一语义可按优先级覆盖;同一文件重复 key、alias 并存、高优先级非法值应作为歧义或校验失败候选。 | candidate | 明确“非法高优先级值不应静默回退”仍为候选,待 R5.4 写入。 |
| 必填项缺失时是否阻断启动? | startup 必填缺失倾向 startup fail-fast;job-run-start 必填缺失倾向拒绝当前 job;entry-local 必填缺失倾向拒绝当前 entry / job。 | candidate | 不写具体必填配置项。 |
| 配置中心或密钥系统不可用时如何处理? | P0 config center / admin override 候选为 unsupported / watch_only;secret raw material 不进入普通来源链;secret ref 解析真实 provider 的细节交 Step 8 / Step 9。 | candidate_watch | 若要求 P0 remote config 或 live override,必须回 `03`。 |
| 哪些来源不能覆盖敏感配置? | config file、env、entry-local、admin override 都不得承载 raw secret / credential body / token / private key / certificate body;普通来源只能承载 safe ref 候选。 | candidate | R5.4 写候选边界,Step 8 再展开 secret 管理。 |
| 每个配置域适用哪些来源,哪些来源禁止覆盖? | 按 Step 3 配置域逐域映射 ordinary source、entry-local、test fixture、secret ref、watch source 和 forbidden boundary。 | candidate | R5.3 只思考,R5.5/R5.6 再落成逐域候选表。 |
| 每个配置域来源优先级完成后是否通过停审? | 停审维度候选为优先级唯一、冲突可判定、不可用策略明确、watch 未误关闭、03 影响无缺口。 | candidate | R5.7/R5.8 执行。 |
| 所有来源规则完成后是否存在 secret 被普通来源覆盖、同名配置冲突或不可用策略不一致? | 跨来源审计候选覆盖 secret raw 泄露、alias 歧义、环境来源漂移、fixture 污染 production-like、config center / admin override 污染 P0 和 03 回写缺口。 | candidate | R5.9/R5.10 执行。 |

### 3. 来源优先级候选思考

| 来源类型 | 优先级候选 | 适用范围候选 | 风险 / 约束 |
|---|---|---|---|
| code defaults | 普通来源最低候选 | deterministic local / CI baseline、disabled optional feature default、safe local default。 | default 也必须经过 validator;不得绕过 forbidden boundary。 |
| config file | 普通来源中层候选 | startup runtime config、job defaults、adapter binding refs、safe diagnostics selector。 | file 格式和 key 不在 R5.3 定义;重复 key 候选为 fail-fast。 |
| environment variables | 普通来源最高候选 | profile selector、config path selector、CI override、有限 runtime ref override。 | env 值存在但非法倾向 fail-fast,不得 silent fallback。 |
| secret / credential refs | ref 来源候选,不与 raw ordinary value 同链 | credential ref、endpoint ref、target ref、handoff destination ref。 | raw secret 不进入 ordinary source chain;Step 8 定义敏感配置细节。 |
| entry-local parameters | 当前 entry / job 局部候选 | profile/source/scope/target selector、run-local job input、diagnostic selector。 | 不覆盖全局配置、不覆盖禁止配置化项。 |
| test fixture / deterministic override | test harness 局部候选 | fake adapter output、in-memory seed、fixed clock/id、fixture refs。 | 不进入 production-like profile;fixture 缺失应 test fail-fast。 |
| config center | watch_only / P1-P2 候选 | 远期 remote config source 讨论项。 | P0 不启用;启用需 `03` runtime / audit / rollback contract。 |
| admin override | watch_only / P1-P2 候选 | 远期 audited operator override 讨论项。 | P0 不启用;不得 live override core semantics。 |
| static design boundary | 无来源覆盖 | truth owner、state transition、query no-write、body-free、stored replay、transaction boundary、marker source、public schema、P0/P1 隔离。 | 不是配置项;任何来源覆盖都应视为越界。 |

### 4. 冲突处理候选思考

| 冲突场景 | 候选处理 | 当前依据 | 风险 |
|---|---|---|---|
| 同一语义出现在不同普通来源 | 高优先级覆盖低优先级候选。 | SOP Step 5;书写规范 §5.5;Step 3 来源链。 | 不能让非法高优先级值回退低优先级。 |
| 高优先级值存在但类型 / 格式 / 范围非法 | fail-fast 候选。 | `03` runtime builder / validation gate。 | 如果后续要 fallback,必须明确安全条件和 validator contract。 |
| config file 内重复 key | 配置歧义 fail-fast 候选。 | 书写规范冲突处理要求。 | 不得依赖 parser 后写覆盖的隐式行为。 |
| alias key / legacy key 并存 | fail-fast 或显式迁移规则候选。 | 旧材料隔离规则;Step 13 迁移 owner。 | 不得让旧主线 key 复活。 |
| startup 必填缺失 | startup fail-fast 候选。 | Step 4 startup / cold update;`03` entry precheck。 | 不写具体 key。 |
| job-run-start 必填缺失 | 当前 job rejected 候选。 | Step 4 job-run-start freeze;`03` job protocol。 | 不影响已成立 truth。 |
| entry-local 必填缺失 | 当前 entry / job rejected 候选。 | Step 4 entry-local parameters。 | 不把 entry-local 提升为全局配置。 |
| ordinary source 提供 raw secret | reject config 候选。 | Step 4 sensitive ref;安全红线。 | Step 8 继续闭合 secret 细节。 |
| ordinary source 覆盖 forbidden boundary | design violation / reject 候选。 | Step 4 禁止配置化项。 | 不能作为普通优先级冲突处理。 |
| config center / admin override 出现在 P0 | unsupported / watch_only 候选。 | Step 3 / Step 4 watch。 | 若用户要求启用,回 `03` / 架构。 |

### 5. 不可用策略候选思考

| 不可用场景 | 候选策略 | 不写入内容 |
|---|---|---|
| config file 缺失 | 未指定时使用 defaults 候选;已指定但不可读 / 解析失败时 fail-fast 候选。 | 不写路径、文件格式或 CLI flag。 |
| environment variable 缺失 | 缺失时使用低优先级候选;存在但非法时 fail-fast 候选。 | 不写 env var 名。 |
| secret ref 缺失 / 非法 | 对需要 secret ref 的功能 fail-fast 或 job rejected 候选。 | 不写 secret provider API。 |
| secret resolver unavailable | 真实解析交 Step 8 / Step 9;P0 fake / ref-only 不伪造 production success。 | 不写 resolver 产品。 |
| optional target disabled | 缺失可接受候选。 | 不写具体 target key。 |
| enabled target 缺失 | startup fail-fast 或 job rejected 候选。 | 不写目标 registry schema。 |
| test fixture missing | test fail-fast 候选。 | 不写测试用例或 fixture 文件。 |
| config center unavailable | P0 unsupported 候选。 | 不写 fallback 到 remote config。 |
| admin override unavailable | P0 unsupported 候选。 | 不写 operator 权限或审计 schema。 |

### 6. 敏感配置覆盖边界候选思考

| 来源 | 是否允许承载 raw secret 候选 | 允许承载内容候选 | 禁止内容候选 |
|---|---|---|---|
| code defaults | 否 | safe local marker、disabled optional feature default。 | secret、token、password、private key、certificate body。 |
| config file | 否 | secret ref、credential ref、endpoint ref、destination ref。 | raw credential、raw endpoint credential、certificate body、external payload body。 |
| environment variables | 否 | ref selector、profile selector、config path selector。 | raw secret、raw token、private key、certificate body。 |
| entry-local parameters | 否 | current entry selector、job target ref、diagnostic selector。 | global secret override、raw credential、forbidden body allowlist。 |
| test fixture | 仅 test fake material marker 候选 | deterministic fake ref、fake material marker。 | production secret、真实 credential、生产 endpoint credential。 |
| config center / admin override | P0 否 | P1/P2 watch-only ref / override candidate。 | P0 raw secret、P0 live core override。 |

### 7. 逐配置域来源覆盖候选入口

| 配置域 | 候选关注点 | R5.5/R5.6 处理 |
|---|---|---|
| runtime profile | 普通来源、entry-local selector、test fixture 和 watch source 是否分层。 | 写允许来源、禁止来源、优先级和不可用策略候选。 |
| repository/material store | store adapter ref 能否由 ordinary source 选择,是否禁止 query-time override。 | 写来源覆盖候选。 |
| external source/resolver | secret ref、endpoint ref、source allowlist 和 unavailable mapping。 | 写来源覆盖候选,敏感细节交 Step 8。 |
| inbound source watch | inbound source binding 是否只有 pass_with_watch,不得私补 formal carrier。 | 写 watch 候选;若需契约回 `03`。 |
| publisher/handoff target | target ref、destination ref、publisher enablement 和 unavailable strategy。 | 写来源覆盖候选。 |
| query/read material policy | page/body/freshness/availability handle 来源和 query no-write 红线。 | 写来源覆盖候选。 |
| operations job runner | batch/retry/lease/scope/report target 来源和 job-run-start freeze。 | 写来源覆盖候选。 |
| safe diagnostics/redaction | safe selector、redaction profile、raw output 禁止。 | 写来源覆盖候选,敏感细节交 Step 8/9。 |
| downstream handoff | 05/06/07 承接配置矩阵、门禁和实施输入,不反向定义来源。 | 写下游承接候选。 |
| config center / admin override | 只作为 P1/P2 watch,不进入 P0 final。 | R5.9/R5.10 审计。 |

### 8. 对 03 的影响预判

| 候选结论 | 是否影响 03 | 处理 |
|---|---|---|
| 普通来源候选为 `code defaults < config file < environment variables` | 否 | 04 来源语义候选。 |
| secret raw material 不进入普通来源链 | 否 | Step 8 继续展开。 |
| entry-local 不覆盖全局配置和禁止项 | 否 | 04 来源边界候选。 |
| test fixture 仅 local / CI 生效 | 否 | Step 6 profile 矩阵继续核对。 |
| config center / admin override 保持 watch_only | 否,暂不回写 | 后续若要求 P0 runtime 契约,回 `03`。 |
| inbound source binding 继续 pass_with_watch | 否,暂不回写 | 后续若需要 formal carrier / adapter constructor,回 `03`。 |
| 需要新增 config carrier、builder 参数、adapter constructor、trait / port、DTO、mapper、marker、state、flow、loader / validator contract | 是 | 暂停并回 `03` owning Step。 |
| 任一来源覆盖 forbidden boundary | 是且越界 | 立即暂停。 |

### 9. R5.4 写入计划思考

`R5.4 SOP 问题回答与来源规则候选:再写入` 应把 R5.3 思考落成可恢复记录:

1. 写当前模块目标和允许 / 禁止范围。
2. 写 SOP 八问候选回答表。
3. 写来源优先级候选表。
4. 写冲突处理候选表。
5. 写不可用策略候选表。
6. 写敏感配置覆盖边界候选表。
7. 写逐配置域来源覆盖候选入口。
8. 写对 `03-详细设计.md` 的影响预判。
9. 写 `R5.5 来源优先级与冲突来源池:先思考` 进入门禁。
10. 不写最终来源优先级表、最终冲突处理表、按配置域来源覆盖 final 表、配置项清单、JSON demo、secret schema、测试、验收、实施或代码。

### 10. R5.3 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R5.3 一个模块 | pass |
| 是否只形成候选思考而未写 final 表 | pass |
| 是否覆盖 SOP Step 5 八问 | pass |
| 是否保留 inbound source binding pass_with_watch | pass |
| 是否保留 config center / admin override watch_only | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写配置项、key、默认值、profile merge order、JSON demo、secret schema、测试、验收、实施或代码 | pass |
| 是否形成 R5.4 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.4 SOP 问题回答与来源规则候选:再写入`;只允许把 R5.3 思考落成 SOP 八问候选回答、来源优先级候选、冲突处理候选、不可用策略候选、敏感配置覆盖边界候选、逐配置域来源覆盖候选入口、03 影响预判和 R5.5 进入门禁;不得创建正式 `04-配置设计.md`;不得写最终来源优先级表、最终冲突处理表、按配置域来源覆盖 final 表、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码;不得把 watch 项当作已无条件关闭。

---

## R5.4 SOP 问题回答与来源规则候选:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 将 R5.3 的来源规则候选思考落成 Step 5 可恢复记录,固定 SOP 八问候选回答、来源优先级候选、冲突处理候选、不可用策略候选、敏感配置覆盖边界候选、逐配置域来源覆盖候选入口、03 影响预判和 R5.5 进入门禁。 |
| 本模块允许 | 写 SOP 八问候选回答、来源优先级候选、冲突处理候选、不可用策略候选、敏感配置覆盖边界候选、逐配置域来源覆盖候选入口、03 影响预判和下一模块门禁。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不把候选升级为最终来源优先级表、最终冲突处理表或按配置域来源覆盖 final 表;不写配置项 key、默认值、profile merge order、环境变量名、配置文件格式、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |
| 当前恢复依据 | R5.3 已完成 SOP 八问、来源优先级、冲突处理、不可用策略、敏感配置覆盖边界、逐配置域来源覆盖入口和 03 影响预判的候选思考。 |

### 2. SOP 八问候选回答

| SOP 问题 | 候选回答 | 当前状态 | 后续处理 |
|---|---|---|---|
| code default、file、env、secret、config center、admin override 的优先级是什么? | 普通来源候选为 `code defaults < config file < environment variables`;secret 只作为 ref / resolver 边界,不进入普通 raw value 覆盖链;entry-local 与 test fixture 分域生效;config center / admin override 保持 watch_only。 | candidate | R5.5/R5.6 审查来源池合法性,R5.7/R5.8 停审。 |
| 同名配置多处出现时如何冲突处理? | 多普通来源同一语义按优先级覆盖候选;同一文件重复 key、alias 并存、高优先级非法值作为歧义或校验失败候选。 | candidate | R5.5/R5.6 细化冲突来源池。 |
| 必填项缺失时是否阻断启动? | startup 必填缺失倾向 startup fail-fast;job-run-start 必填缺失倾向拒绝当前 job;entry-local 必填缺失倾向拒绝当前 entry / job。 | candidate | Step 7/9 才能绑定具体配置项与 validator。 |
| 配置中心或密钥系统不可用时如何处理? | P0 config center / admin override 候选为 unsupported / watch_only;secret raw material 不进入普通来源链;secret ref 解析真实 provider 的细节交 Step 8 / Step 9。 | candidate_watch | 若要求 P0 remote config 或 live override,必须回 `03`。 |
| 哪些来源不能覆盖敏感配置? | config file、env、entry-local、admin override 都不得承载 raw secret / credential body / token / private key / certificate body;普通来源只能承载 safe ref 候选。 | candidate | Step 8 展开敏感配置和密钥管理。 |
| 每个配置域适用哪些来源,哪些来源禁止覆盖? | 按 Step 3 配置域逐域映射 ordinary source、entry-local、test fixture、secret ref、watch source 和 forbidden boundary。 | candidate | R5.5/R5.6 落成逐域来源覆盖候选表。 |
| 每个配置域来源优先级完成后是否通过停审? | 停审维度候选为优先级唯一、冲突可判定、不可用策略明确、watch 未误关闭、03 影响无缺口。 | candidate | R5.7/R5.8 执行。 |
| 所有来源规则完成后是否存在 secret 被普通来源覆盖、同名配置冲突或不可用策略不一致? | 跨来源审计候选覆盖 secret raw 泄露、alias 歧义、环境来源漂移、fixture 污染 production-like、config center / admin override 污染 P0 和 03 回写缺口。 | candidate | R5.9/R5.10 执行。 |

### 3. 来源优先级候选

| 来源类型 | 优先级候选 | 适用范围候选 | 风险 / 约束 |
|---|---|---|---|
| code defaults | 普通来源最低候选 | deterministic local / CI baseline、disabled optional feature default、safe local default。 | default 也必须经过 validator;不得绕过 forbidden boundary。 |
| config file | 普通来源中层候选 | startup runtime config、job defaults、adapter binding refs、safe diagnostics selector。 | file 格式和 key 不在 R5.4 定义;重复 key 候选为 fail-fast。 |
| environment variables | 普通来源最高候选 | profile selector、config path selector、CI override、有限 runtime ref override。 | env 值存在但非法倾向 fail-fast,不得 silent fallback。 |
| secret / credential refs | ref 来源候选,不与 raw ordinary value 同链 | credential ref、endpoint ref、target ref、handoff destination ref。 | raw secret 不进入 ordinary source chain;Step 8 定义敏感配置细节。 |
| entry-local parameters | 当前 entry / job 局部候选 | profile / source / scope / target selector、run-local job input、diagnostic selector。 | 不覆盖全局配置、不覆盖禁止配置化项。 |
| test fixture / deterministic override | test harness 局部候选 | fake adapter output、in-memory seed、fixed clock / id、fixture refs。 | 不进入 production-like profile;fixture 缺失应 test fail-fast。 |
| config center | watch_only / P1-P2 候选 | 远期 remote config source 讨论项。 | P0 不启用;启用需 `03` runtime / audit / rollback contract。 |
| admin override | watch_only / P1-P2 候选 | 远期 audited operator override 讨论项。 | P0 不启用;不得 live override core semantics。 |
| static design boundary | 无来源覆盖 | truth owner、state transition、query no-write、body-free、stored replay、transaction boundary、marker source、public schema、P0/P1 隔离。 | 不是配置项;任何来源覆盖都应视为越界。 |

### 4. 冲突处理候选

| 冲突场景 | 候选处理 | 当前依据 | 风险 |
|---|---|---|---|
| 同一语义出现在不同普通来源 | 高优先级覆盖低优先级候选。 | SOP Step 5;书写规范 §5.5;Step 3 来源链。 | 不能让非法高优先级值回退低优先级。 |
| 高优先级值存在但类型 / 格式 / 范围非法 | fail-fast 候选。 | `03` runtime builder / validation gate。 | 如果后续要 fallback,必须明确安全条件和 validator contract。 |
| config file 内重复 key | 配置歧义 fail-fast 候选。 | 书写规范冲突处理要求。 | 不得依赖 parser 后写覆盖的隐式行为。 |
| alias key / legacy key 并存 | fail-fast 或显式迁移规则候选。 | 旧材料隔离规则;Step 13 迁移 owner。 | 不得让旧主线 key 复活。 |
| startup 必填缺失 | startup fail-fast 候选。 | Step 4 startup / cold update;`03` entry precheck。 | 不写具体 key。 |
| job-run-start 必填缺失 | 当前 job rejected 候选。 | Step 4 job-run-start freeze;`03` job protocol。 | 不影响已成立 truth。 |
| entry-local 必填缺失 | 当前 entry / job rejected 候选。 | Step 4 entry-local parameters。 | 不把 entry-local 提升为全局配置。 |
| ordinary source 提供 raw secret | reject config 候选。 | Step 4 sensitive ref;安全红线。 | Step 8 继续闭合 secret 细节。 |
| ordinary source 覆盖 forbidden boundary | design violation / reject 候选。 | Step 4 禁止配置化项。 | 不能作为普通优先级冲突处理。 |
| config center / admin override 出现在 P0 | unsupported / watch_only 候选。 | Step 3 / Step 4 watch。 | 若用户要求启用,回 `03` / 架构。 |

### 5. 不可用策略候选

| 不可用场景 | 候选策略 | 不写入内容 |
|---|---|---|
| config file 缺失 | 未指定时使用 defaults 候选;已指定但不可读 / 解析失败时 fail-fast 候选。 | 不写路径、文件格式或 CLI flag。 |
| environment variable 缺失 | 缺失时使用低优先级候选;存在但非法时 fail-fast 候选。 | 不写 env var 名。 |
| secret ref 缺失 / 非法 | 对需要 secret ref 的功能 fail-fast 或 job rejected 候选。 | 不写 secret provider API。 |
| secret resolver unavailable | 真实解析交 Step 8 / Step 9;P0 fake / ref-only 不伪造 production success。 | 不写 resolver 产品。 |
| optional target disabled | 缺失可接受候选。 | 不写具体 target key。 |
| enabled target 缺失 | startup fail-fast 或 job rejected 候选。 | 不写目标 registry schema。 |
| test fixture missing | test fail-fast 候选。 | 不写测试用例或 fixture 文件。 |
| config center unavailable | P0 unsupported 候选。 | 不写 fallback 到 remote config。 |
| admin override unavailable | P0 unsupported 候选。 | 不写 operator 权限或审计 schema。 |

### 6. 敏感配置覆盖边界候选

| 来源 | 是否允许承载 raw secret 候选 | 允许承载内容候选 | 禁止内容候选 |
|---|---|---|---|
| code defaults | 否 | safe local marker、disabled optional feature default。 | secret、token、password、private key、certificate body。 |
| config file | 否 | secret ref、credential ref、endpoint ref、destination ref。 | raw credential、raw endpoint credential、certificate body、external payload body。 |
| environment variables | 否 | ref selector、profile selector、config path selector。 | raw secret、raw token、private key、certificate body。 |
| entry-local parameters | 否 | current entry selector、job target ref、diagnostic selector。 | global secret override、raw credential、forbidden body allowlist。 |
| test fixture | 仅 test fake material marker 候选 | deterministic fake ref、fake material marker。 | production secret、真实 credential、生产 endpoint credential。 |
| config center / admin override | P0 否 | P1/P2 watch-only ref / override candidate。 | P0 raw secret、P0 live core override。 |

### 7. 逐配置域来源覆盖候选入口

| 配置域 | 候选关注点 | R5.5/R5.6 处理 |
|---|---|---|
| runtime profile | 普通来源、entry-local selector、test fixture 和 watch source 是否分层。 | 写允许来源、禁止来源、优先级和不可用策略候选。 |
| repository/material store | store adapter ref 能否由 ordinary source 选择,是否禁止 query-time override。 | 写来源覆盖候选。 |
| external source/resolver | secret ref、endpoint ref、source allowlist 和 unavailable mapping。 | 写来源覆盖候选,敏感细节交 Step 8。 |
| inbound source watch | inbound source binding 是否只有 pass_with_watch,不得私补 formal carrier。 | 写 watch 候选;若需契约回 `03`。 |
| publisher/handoff target | target ref、destination ref、publisher enablement 和 unavailable strategy。 | 写来源覆盖候选。 |
| query/read material policy | page/body/freshness/availability handle 来源和 query no-write 红线。 | 写来源覆盖候选。 |
| operations job runner | batch/retry/lease/scope/report target 来源和 job-run-start freeze。 | 写来源覆盖候选。 |
| safe diagnostics/redaction | safe selector、redaction profile、raw output 禁止。 | 写来源覆盖候选,敏感细节交 Step 8/9。 |
| downstream handoff | 05/06/07 承接配置矩阵、门禁和实施输入,不反向定义来源。 | 写下游承接候选。 |
| config center / admin override | 只作为 P1/P2 watch,不进入 P0 final。 | R5.9/R5.10 审计。 |

### 8. 对 03 的影响预判

| 候选结论 | 是否影响 03 | 处理 |
|---|---|---|
| 普通来源候选为 `code defaults < config file < environment variables` | 否 | 04 来源语义候选。 |
| secret raw material 不进入普通来源链 | 否 | Step 8 继续展开。 |
| entry-local 不覆盖全局配置和禁止项 | 否 | 04 来源边界候选。 |
| test fixture 仅 local / CI 生效 | 否 | Step 6 profile 矩阵继续核对。 |
| config center / admin override 保持 watch_only | 否,暂不回写 | 后续若要求 P0 runtime 契约,回 `03`。 |
| inbound source binding 继续 pass_with_watch | 否,暂不回写 | 后续若需要 formal carrier / adapter constructor,回 `03`。 |
| 需要新增 config carrier、builder 参数、adapter constructor、trait / port、DTO、mapper、marker、state、flow、loader / validator contract | 是 | 暂停并回 `03` owning Step。 |
| 任一来源覆盖 forbidden boundary | 是且越界 | 立即暂停。 |

### 9. R5.5 进入门禁

Step 5 `R5.5 来源优先级与冲突来源池:先思考` 只能在以下条件满足后进入:

| 门禁项 | 结果 |
|---|---|
| SOP 八问候选回答已写入 | pass |
| 来源优先级候选已写入 | pass |
| 冲突处理候选已写入 | pass |
| 不可用策略候选已写入 | pass |
| 敏感配置覆盖边界候选已写入 | pass |
| 逐配置域来源覆盖候选入口已写入 | pass |
| 对 `03-详细设计.md` 的影响预判已写入 | pass |
| watch 项仍保持追踪状态 | pass |
| 未创建正式 `04-配置设计.md` | pass |
| 未写最终来源优先级表、最终冲突处理表、按配置域来源覆盖 final 表、配置项、JSON、secret、测试、验收、实施或代码 | pass |

### 10. R5.4 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R5.4 一个模块 | pass |
| 是否把 R5.3 候选思考落成可恢复记录 | pass |
| 是否未把候选升级为 final 表 | pass |
| 是否保留 inbound source binding pass_with_watch | pass |
| 是否保留 config center / admin override watch_only | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写配置项、key、默认值、profile merge order、JSON demo、secret schema、测试、验收、实施或代码 | pass |
| 是否形成 R5.5 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.5 来源优先级与冲突来源池:先思考`;只允许审查来源优先级候选、冲突处理候选、不可用策略候选、敏感配置覆盖边界候选和逐配置域来源覆盖候选能否从 Step 3、Step 4、`02` §11、`03` §13 与上游红线合法推出,形成来源池裁决候选、watch 处理计划、03 影响预判和 R5.6 写入计划;不得创建正式 `04-配置设计.md`;不得写最终来源优先级表、最终冲突处理表、按配置域来源覆盖 final 表、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码;不得把 watch 项当作已无条件关闭。

---

## R5.5 来源优先级与冲突来源池:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 审查来源优先级候选、冲突处理候选、不可用策略候选、敏感配置覆盖边界候选和逐配置域来源覆盖候选能否从 Step 3、Step 4、`02` §11、`03` §13 与上游红线合法推出,形成来源池裁决候选、watch 处理计划、03 影响预判和 R5.6 写入计划。 |
| 本模块允许 | 写来源池裁决候选、冲突来源池候选、watch 处理计划候选、03 影响预判和 R5.6 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写最终来源优先级表、最终冲突处理表、按配置域来源覆盖 final 表、配置项清单、key、默认值、profile merge order、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |
| 当前恢复依据 | R5.4 已完成 SOP 八问候选回答、来源优先级候选、冲突处理候选、不可用策略候选、敏感配置覆盖边界候选、逐配置域来源覆盖候选入口、03 影响预判和 R5.5 进入门禁。 |

### 2. 来源池裁决候选

| 候选来源池 | 合法推出依据 | 当前裁决 | R5.6 写入倾向 |
|---|---|---|---|
| ordinary source pool | Step 3 来源链 + Step 4 startup / job-run-start / entry-local 类别 + `02` §11 配置影响轮廓 + `03` §13 runtime builder。 | pass_candidate | 仅承认 code defaults、config file、environment variables 这条普通覆盖链。 |
| secret ref pool | Step 4 sensitive ref config + `03` config ownership / read boundary + `03` forbidden configurable boundary。 | pass_candidate | 只承认 secret / credential / endpoint / destination 的 ref 边界,不承认 raw material。 |
| entry-local selector pool | Step 4 entry-local parameters + `03` entry precheck。 | pass_candidate | 仅影响当前 entry / job / profile selector。 |
| test fixture / deterministic pool | Step 4 test fixture / deterministic config + `02` 测试方向输入 + `03` 测试切口。 | candidate | 仅限 local / CI harness;不得污染 production-like profile。 |
| config center pool | Step 3 / Step 4 watch_only + hot runtime update watch。 | watch_only | 保持 P1/P2 讨论项,不得进入 P0 final。 |
| admin override pool | Step 3 / Step 4 watch_only + hot runtime update watch。 | watch_only | 保持 P1/P2 讨论项,不得进入 P0 live override。 |
| forbidden boundary exclusion | `00/01/02/03` 上游红线 + Step 4 禁止配置化项。 | exclude | 不是来源池;任何来源覆盖都视为越界。 |

### 3. 冲突来源池候选

| 冲突来源池 | 典型冲突 | 当前裁决 | R5.6 写入倾向 |
|---|---|---|---|
| ordinary vs ordinary | defaults / file / env 对同一语义重复出现。 | candidate | 倾向高优先级覆盖低优先级;非法高优先级值不静默回退。 |
| ordinary vs raw secret | file/env/entry-local 试图承载 raw secret。 | candidate_reject | 直接拒绝,不当作普通覆盖冲突。 |
| ordinary vs forbidden boundary | 任一来源试图改变 truth owner、state transition、query no-write、body-free、stored replay、transaction boundary、marker source、public schema 或 P0/P1 隔离。 | reject | 立即标设计越界。 |
| config center / admin override vs P0 | 远程配置或管理端覆盖核心语义。 | watch_only / reject | 保持 watch,若要求 P0 live override,回 `03`。 |
| test fixture vs production-like | fixture 混入 production-like profile。 | reject_profile | 不进入 production-like 语义。 |
| missing required source | startup / job-run-start / entry-local 必填缺失。 | candidate_fail_fast | 由更新时机决定 fail-fast / rejected。 |
| source unavailable | config file 不可读、secret resolver unavailable、disabled optional target missing、fixture missing。 | candidate_unavailable | 按来源类型分别 fail-fast、job rejected 或 unsupported。 |

### 4. watch 处理计划候选

| watch 项 | 当前状态 | 处理计划候选 | 是否阻塞 R5.6 |
|---|---|---|---|
| inbound source binding / inbound source watch | pass_with_watch | 继续追踪,不得借来源优先级补 formal binding;若后续需要正式 carrier / adapter constructor / port,回 `03`。 | 不阻塞 |
| config center | watch_only | 继续保持 P1/P2 watch,不写进 P0 final;若要求 live override,回 `03`。 | 不阻塞 |
| admin override | watch_only | 继续保持 P1/P2 watch,不写进 P0 final;若要求 live override,回 `03`。 | 不阻塞 |

### 5. 03 影响预判

| 候选结论 | 是否影响 03 | 处理 |
|---|---|---|
| 只确认 ordinary / secret ref / entry-local / test fixture / watch / forbidden boundary 的来源池边界 | 否 | 记录为 `无回写`。 |
| config center / admin override 保持 watch_only | 否,暂不回写 | 后续若要求 P0 runtime 契约,回 `03`。 |
| inbound source binding 继续 pass_with_watch | 否,暂不回写 | 后续若需要 formal carrier / adapter constructor,回 `03`。 |
| source pool 审查触发 config carrier、builder 参数、adapter constructor、trait / port、DTO、mapper、marker、state、flow、loader / validator contract | 是 | 暂停并回 `03` owning Step。 |
| source pool 审查触发来源覆盖 truth owner、state transition、query no-write、stored replay、transaction boundary、marker source、body-free rule、public schema 或 P0/P1 隔离变更 | 是且越界 | 立即暂停。 |

### 6. R5.6 写入计划

`R5.6 来源优先级与冲突来源池:再写入` 应把 R5.5 思考落成可恢复记录:

1. 写当前模块目标和允许 / 禁止范围。
2. 写来源池裁决候选表。
3. 写冲突来源池候选表。
4. 写 watch 处理计划候选。
5. 写 03 影响预判。
6. 写 `R5.7 来源优先级候选与配置域映射:先思考` 进入门禁。
7. 不写最终来源优先级表、最终冲突处理表、按配置域来源覆盖 final 表、配置项清单、JSON demo、secret schema、测试、验收、实施或代码。

### 7. R5.5 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R5.5 一个模块 | pass |
| 是否只形成来源池裁决候选而未写 final 表 | pass |
| 是否保留 inbound source binding pass_with_watch | pass |
| 是否保留 config center / admin override watch_only | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写配置项、key、默认值、profile merge order、JSON demo、secret schema、测试、验收、实施或代码 | pass |
| 是否形成 R5.6 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.6 来源优先级与冲突来源池:再写入`;只允许把 R5.5 思考落成来源池裁决候选、冲突来源池候选、watch 处理计划候选、03 影响预判和 R5.7 进入门禁;不得创建正式 `04-配置设计.md`;不得写最终来源优先级表、最终冲突处理表、按配置域来源覆盖 final 表、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码;不得把 watch 项当作已无条件关闭。

---

## R5.6 来源优先级与冲突来源池:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 将 R5.5 的来源池裁决候选、冲突来源池候选、watch 处理计划候选、03 影响预判和 R5.6 进入门禁写成 Step 5 可恢复记录。 |
| 本模块允许 | 写来源池裁决候选、冲突来源池候选、watch 处理计划、03 影响预判和 R5.7 进入门禁。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写最终来源优先级表、最终冲突处理表、按配置域来源覆盖 final 表、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |
| 当前恢复依据 | R5.5 已完成来源池裁决候选、冲突来源池候选、watch 处理计划候选和 03 影响预判;等待 R5.6 将其写成 Step 5 可恢复记录。 |

### 2. 来源池裁决写入表

| 候选来源池 | 写入裁决 | 依据 | 备注 |
|---|---|---|---|
| ordinary source pool | 保留为候选可用 | Step 3 来源链 + Step 4 类别 + `02` §11 + `03` §13 | 仅承认 code defaults / config file / environment variables 的普通覆盖链。 |
| secret ref pool | 保留为候选可用 | Step 4 sensitive ref config + `03` forbidden boundary | 只允许 ref / resolver 边界,不允许 raw secret 进入普通链。 |
| entry-local selector pool | 保留为候选可用 | Step 4 entry-local parameters + `03` entry precheck | 只影响当前 entry / job / profile selector。 |
| test fixture / deterministic pool | test-only candidate | Step 4 test fixture + `02` 测试方向输入 | 仅限 local / CI harness;不得污染 production-like profile。 |
| config center pool | watch_only | Step 3 / Step 4 watch_only | 保持 P1/P2 讨论项,不得进入 P0 final。 |
| admin override pool | watch_only | Step 3 / Step 4 watch_only | 保持 P1/P2 讨论项,不得进入 P0 live override。 |
| forbidden boundary exclusion | exclude | `00/01/02/03` 红线 + Step 4 禁止配置化项 | 不是来源池;任何覆盖都视为越界。 |

### 3. 冲突来源池写入表

| 冲突来源池 | 写入裁决 | 依据 | 备注 |
|---|---|---|---|
| ordinary vs ordinary | 高优先级覆盖低优先级;非法高优先级值拒绝 | SOP Step 5;书写规范 §5.5;Step 3 来源链 | 不允许非法值 fallback。 |
| ordinary vs raw secret | 直接拒绝 | Step 4 sensitive ref;Step 8 继续闭合 | raw secret、token、password、private key、certificate body 不能进入普通链。 |
| ordinary vs forbidden boundary | 立即拒绝 | `00/01/02/03` 与 Step 4 禁止配置化项 | 不当作普通优先级冲突处理。 |
| config center / admin override vs P0 | 保持 watch_only 或拒绝 | Step 3 / Step 4 watch | 若要求 P0 live override,必须回 `03`。 |
| test fixture vs production-like | 拒绝 profile | Step 4 test fixture;Step 6 后续矩阵 | 不进入 production-like 语义。 |
| missing required source | fail-fast / rejected | Step 4 更新时机 | 由 startup / job-run-start / entry-local 三类时机决定。 |
| source unavailable | fail-fast / rejected / unsupported | Step 3 来源链 + Step 4 类别 | config file、env、secret resolver、fixture、disabled target 各按各自规则处理。 |

### 4. watch 处理计划写入表

| watch 项 | 写入裁决 | 备注 |
|---|---|---|
| inbound source binding | 继续 pass_with_watch | 缺 formal carrier 时回 `03`;不得借来源优先级补正式 binding。 |
| config center | 继续 watch_only | 保持 P1/P2 讨论项,不写进 P0 final。 |
| admin override | 继续 watch_only | 保持 P1/P2 讨论项,不写进 P0 live override。 |

### 5. 对 03 的影响预判

| 候选结论 | 是否影响 03 | 处理 |
|---|---|---|
| ordinary 来源候选定为 `code defaults < config file < environment variables` | 否 | 04 来源语义收口。 |
| secret raw material 不进入普通来源链 | 否 | Step 8 继续展开。 |
| entry-local 不覆盖全局配置和禁止项 | 否 | 04 来源边界收口。 |
| test fixture 仅 local / CI 生效 | 否 | Step 6 配置矩阵继续核对。 |
| config center / admin override 保持 watch_only | 否,暂不回写 | 后续若要求 P0 runtime 契约,回 `03`。 |
| inbound source binding 继续 pass_with_watch | 否,暂不回写 | 后续若需要 formal carrier / adapter constructor,回 `03`。 |
| 需要新增 config carrier、builder 参数、adapter constructor、trait / port、DTO、mapper、marker、state、flow、loader / validator contract | 是 | 暂停并回 `03` owning Step。 |
| 任一来源覆盖 forbidden boundary | 是且越界 | 立即暂停。 |

### 6. R5.7 进入门禁

Step 5 `R5.7 来源优先级候选与配置域映射:先思考` 只能在以下条件满足后进入:

| 门禁项 | 结果 |
|---|---|
| 来源池裁决写入表已写入 | pass |
| 冲突来源池写入表已写入 | pass |
| watch 处理计划写入表已写入 | pass |
| 对 `03-详细设计.md` 的影响预判已写入 | pass |
| watch 项仍保持追踪状态 | pass |
| 未创建正式 `04-配置设计.md` | pass |
| 未写最终来源优先级表、最终冲突处理表、按配置域来源覆盖 final 表、配置项、JSON、secret、测试、验收、实施或代码 | pass |

### 7. R5.6 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R5.6 一个模块 | pass |
| 是否把 R5.5 候选思考落成可恢复记录 | pass |
| 是否未把候选升级为 final 表 | pass |
| 是否保留 inbound source binding pass_with_watch | pass |
| 是否保留 config center / admin override watch_only | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写配置项、key、默认值、profile merge order、JSON demo、secret schema、测试、验收、实施或代码 | pass |
| 是否形成 R5.7 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.7 来源优先级候选与配置域映射:先思考`;只允许围绕 Step 3 / Step 4 / `02` §11 / `03` §13 与上游红线,把来源池裁决写成配置域映射候选、逐配置域允许 / 禁止来源候选、配置域优先级候选、缺失 / 不可用策略候选、03 影响预判和 R5.8 写入计划;不得创建正式 `04-配置设计.md`;不得写最终来源优先级表、最终冲突处理表、按配置域来源覆盖 final 表、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码;不得把 watch 项当作已无条件关闭。

---

## R5.7 来源优先级候选与配置域映射:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 基于 R5.6 的来源池裁决,思考如何把 ordinary / secret ref / entry-local / test fixture / watch / forbidden boundary 映射到 Step 3 配置域,形成逐配置域允许来源、禁止来源、优先级候选、缺失 / 不可用策略候选、03 影响预判和 R5.8 写入计划。 |
| 本模块允许 | 写配置域映射思考、逐配置域允许 / 禁止来源候选、优先级候选、缺失 / 不可用策略候选、watch / forbidden boundary 保留判断、03 影响预判和 R5.8 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不把候选升级为最终来源优先级表、最终冲突处理表或按配置域来源覆盖 final 表;不写配置项 key、默认值、profile merge order、环境变量名、配置文件格式、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |
| 当前恢复依据 | R5.6 已完成来源池裁决、冲突来源池、watch 处理计划和 03 影响预判;等待 R5.7 将来源池映射到配置域层面的停审前思考。 |

### 2. 映射前提思考

| 前提 | R5.7 判断 | 影响 |
|---|---|---|
| 来源池不是配置项清单 | Step 5 只讨论来源规则,不能提前写具体 key、默认值、env 名或文件格式。 | Step 7 才定义配置项。 |
| 配置域来自 Step 3 | R5.7 只能使用 Step 3 已确认的 runtime profile、repository/material store、external source/resolver、inbound source watch、publisher/handoff target、query/read material policy、operations job runner、safe diagnostics/redaction、downstream handoff 和 config center/admin override watch。 | 不新增配置域。 |
| 分类边界来自 Step 4 | startup、job-run-start、entry-local、sensitive ref、diagnostic、test fixture、feature/peripheral 和 hot runtime update watch 是来源优先级判断的时间边界。 | 不打开核心 hot runtime update。 |
| ordinary chain 只覆盖普通配置语义 | ordinary source pool 候选为 `code defaults < config file < environment variables`。 | 高优先级非法值不 silent fallback。 |
| secret ref 与 raw secret 分离 | ordinary source 可承载 safe ref 候选,不能承载 raw secret、token、private key、certificate body 或 external body。 | Step 8 继续展开敏感配置。 |
| entry-local 是局部选择器 | entry-local 只影响当前 entry / job / selector,不覆盖全局 runtime 或 static boundary。 | Step 6 / Step 9 继续核对 profile 和生效方式。 |
| test fixture 只属测试 harness | fixture / deterministic override 只在 local / CI 语义下讨论。 | production-like profile 必须拒绝 fixture 污染。 |
| watch 不等于正式能力 | inbound source binding 保持 pass_with_watch;config center / admin override 保持 watch_only。 | 不能在 R5.7 关闭 watch。 |
| forbidden boundary 无来源覆盖 | truth owner、state transition、query no-write、job no-truth-repair、body-free、stored replay、transaction boundary、marker source、public schema、P0/P1 隔离不接受任何来源覆盖。 | 试图覆盖即设计越界。 |

### 3. 来源池到配置域映射思考

| 配置域 | ordinary source pool | secret ref pool | entry-local pool | test fixture pool | watch source | R5.7 取舍 |
|---|---|---|---|---|---|---|
| runtime profile and entry readiness | 适用: profile / readiness 选择的普通来源候选。 | 通常不直接适用,只允许 safe ref 间接参与 adapter readiness。 | 适用: 当前 entry profile / selector。 | 适用: local / CI profile。 | config center/admin override 仅 watch。 | 需要在 R5.8 写允许 / 禁止来源候选。 |
| repository and material store binding | 适用: store adapter / material store ref 的普通来源候选。 | 适用: durable future 的 credential / endpoint ref。 | 禁止 query-time override。 | 适用: fake / in-memory test profile。 | 不适用 P0。 | 必须强调 transaction / replay 不可配置。 |
| external source and resolver binding | 适用: adapter kind、source allowlist、timeout 类普通来源候选。 | 适用: endpoint / credential / source ref。 | 只可选择当前请求 / job 的 source selector。 | 适用: fake resolver。 | 不适用 P0。 | 必须保留 body-free 与 marker source 红线。 |
| inbound source binding | 适用但带 watch: source profile / transport binding 候选。 | 适用: inbound credential / endpoint ref 候选。 | 只可影响当前 intake context selector 候选。 | 适用: test event source。 | pass_with_watch。 | 若需要 formal binding / carrier,回 `03`。 |
| publisher and handoff target binding | 适用: target / publisher enablement / destination ref。 | 适用: target credential / destination credential ref。 | 适用: job target selector 候选。 | 适用: fake publisher / handoff adapter。 | 不适用 P0。 | external receipt 不得证明本地 truth。 |
| query and read material policy handles | 适用: page/body/freshness/availability handle 候选。 | 通常不直接适用,除非 read material adapter 需要 endpoint ref。 | 适用: 当前 query scope / selector 候选。 | 适用: test material / fake profile。 | 不适用 P0。 | query no-write 和 read-time repair 禁止。 |
| operations job runner policy | 适用: batch / retry / lease / report target 默认候选。 | 适用: report / target credential ref 候选。 | 适用: run-local job input / scope / target selector。 | 适用: deterministic job harness。 | 不适用 P0。 | job-run-start freeze,运行中不改 semantics。 |
| safe diagnostics and redaction | 适用: safe selector / redaction profile 候选。 | 适用: secret ref 仅作为需要被遮蔽的引用,不输出 raw。 | 适用: 当前 entry diagnostic selector 候选。 | 适用: test diagnostic selector。 | admin override 不得 hot relax。 | invalid / unsafe diagnostic 倾向 fail-fast。 |
| downstream handoff | 适用: downstream handoff 说明和矩阵承接来源。 | 不直接定义 secret 管理。 | 不适用为全局规则。 | 可提醒测试矩阵方向。 | 不适用 P0。 | 只能承接,不得反向定义 TC/AC/commit。 |
| config center / admin override | ordinary chain 不纳入 P0。 | 不承载 P0 raw secret。 | 不覆盖当前 entry 既有规则。 | 不作为 test fixture 替代。 | watch_only。 | R5.8 只能写 watch 候选,不能写正式能力。 |

### 4. 逐配置域允许 / 禁止来源候选思考

| 配置域 | 允许来源候选 | 禁止来源候选 | 候选理由 |
|---|---|---|---|
| runtime profile and entry readiness | defaults、config file、env、entry-local selector、test fixture in test profile。 | raw secret、config center/admin override P0、hot runtime override、static boundary override。 | runtime 入口可选 profile,但不允许绕过 builder / readiness。 |
| repository and material store binding | defaults、config file、env、secret ref for durable adapter、test fixture in test profile。 | query-time override、transaction boundary override、stored replay disable、production fixture。 | store 绑定是 startup 装配,不是读时动态开关。 |
| external source and resolver binding | defaults、config file、env、secret / endpoint ref、entry-local selector、test fake source。 | raw external body、raw adapter response、marker synthesis config、P0 admin override。 | external 只能以 ref / summary / marker 承接。 |
| inbound source binding | defaults、config file、env、secret ref、test event source。 | command emulation source、raw payload allowlist、inbound truth repair、unclosed formal carrier。 | 当前仍 pass_with_watch。 |
| publisher and handoff target binding | defaults、config file、env、secret / destination ref、job target selector、test fake publisher。 | delivery-proves-truth config、event schema config、raw bus credential。 | 出站失败只能影响 candidate / handoff / report。 |
| query and read material policy handles | defaults、config file、env、entry-local query selector、test material profile。 | query write config、read-time repair config、hidden material write、marker synthesis。 | Query 只读,配置不能打开修复路径。 |
| operations job runner policy | defaults、config file、env、job-run input、secret ref for report target、test deterministic runner。 | core mutation config、truth repair config、hot change during run、scheduler lease as truth。 | Job 只维护派生材料和 report。 |
| safe diagnostics and redaction | defaults、config file、env、entry-local diagnostic selector、test diagnostic profile。 | raw secret output、raw endpoint output、raw body output、admin hot relax。 | safe output 红线必须优先于来源覆盖。 |
| downstream handoff | confirmed Step 1~14 中间产物、正式 00~04、旧 05/06/07 作为 direction input。 | 旧下游反向定义来源、TC/AC/commit boundary 作为配置。 | 只提供后续文档承接输入。 |
| config center / admin override | P1/P2 watch-only candidate。 | P0 startup final source、core live override、raw secret override。 | 当前 `03` 没有 remote config / audit / rollback contract。 |

### 5. 配置域优先级候选思考

| 配置域 | 优先级候选 | 特殊限制 |
|---|---|---|
| runtime profile and entry readiness | entry-local selector for current entry > env > config file > defaults。 | entry-local 不改变全局 runtime,只选择当前入口。 |
| repository and material store binding | env > config file > defaults;test fixture only in test profile。 | selected store 缺失不得 fallback 到不匹配 store。 |
| external source and resolver binding | entry-local source selector where allowed > env > config file > defaults;secret ref 只参与 credential boundary。 | resolver unavailable 不可伪造 success。 |
| inbound source binding | env > config file > defaults;test source only in test harness。 | pass_with_watch,后续若需 formal carrier 回 `03`。 |
| publisher and handoff target binding | job target selector where allowed > env > config file > defaults;secret ref 只承载 credential ref。 | target failure 不回滚 truth。 |
| query and read material policy handles | entry-local query selector where allowed > env > config file > defaults。 | 不允许 query-time store / truth override。 |
| operations job runner policy | job-run input where allowed > env > config file > defaults。 | run start 后冻结;运行中不接受覆盖。 |
| safe diagnostics and redaction | entry-local diagnostic selector where allowed > env > config file > defaults。 | 任何来源不得放宽 raw 输出禁令。 |
| downstream handoff | 当前设计中间产物和正式上游 > old direction input。 | 旧 `05/06/07` 不覆盖当前 04。 |
| config center / admin override | 无 P0 优先级;仅 watch。 | 不进入 final P0 来源链。 |

### 6. 缺失 / 不可用策略候选思考

| 配置域 | 缺失候选策略 | 不可用候选策略 |
|---|---|---|
| runtime profile and entry readiness | 未指定时可走 default;指定但非法则 startup fail-fast。 | runtime readiness 不满足则 entry precheck fail-fast。 |
| repository and material store binding | required selected store missing -> startup fail-fast。 | selected adapter unavailable -> startup fail-fast 或 unavailable runtime surface,后续 Step 11 收敛。 |
| external source and resolver binding | required source / ref missing -> startup fail-fast 或当前 operation rejected。 | resolver unavailable -> rejected / delayed / degraded,以 `03` flow 为准。 |
| inbound source binding | required transport / idempotency channel missing -> startup fail-fast 候选。 | unsupported / unavailable source -> rejected intake 或 safe unavailable,不得 raw body fallback。 |
| publisher and handoff target binding | enabled target missing -> startup fail-fast 或 job rejected;disabled optional target 可缺失。 | unavailable target -> handoff failed / pending / report issue,不回滚 truth。 |
| query and read material policy handles | required read material store missing -> startup fail-fast;optional read surface missing -> degraded / unavailable。 | stale / unavailable -> safe degraded,不得 query repair。 |
| operations job runner policy | required job input missing -> job rejected。 | runner dependency unavailable -> job failed / suspended / report issue,不得修 core truth。 |
| safe diagnostics and redaction | redaction profile missing / unsafe -> startup fail-fast 候选。 | diagnostic sink unavailable -> safe issue / degraded reporting,不得输出 raw。 |
| downstream handoff | 下游文档尚未重启 -> blocked_by_previous_document。 | 不以旧下游补当前配置口径。 |
| config center / admin override | P0 不适用。 | P0 unsupported;若要求启用,回 `03` / 架构。 |

### 7. watch / forbidden boundary 保留思考

| 项 | R5.7 判断 | R5.8 写入要求 |
|---|---|---|
| inbound source binding | 继续 pass_with_watch。 | 写入时必须保留“不得借来源优先级补 formal carrier”。 |
| config center | 继续 watch_only。 | 不写 P0 source,不写产品、动态生效或热更新。 |
| admin override | 继续 watch_only。 | 不写 core live override、operator 权限或 audit schema。 |
| forbidden boundary | 继续 exclude。 | 明确不是来源冲突,而是设计越界。 |
| production-like profile | 拒绝 test fixture 污染。 | Step 6 继续收敛 profile 矩阵。 |
| raw secret / raw body | ordinary source 不承载。 | Step 8 继续展开 secret 和敏感输出。 |

### 8. 对 03 的影响预判

| R5.7 候选结论 | 是否影响 03 | 处理 |
|---|---|---|
| 将来源池映射到既有 Step 3 配置域 | 否 | 04 来源规则候选,不改 `03`。 |
| 按配置域候选优先级仍停留在 ordinary / entry-local / test / secret ref / watch 层 | 否 | Step 7/9 继续核对配置项与加载校验。 |
| inbound source binding 继续 pass_with_watch | 否,暂不回写 | 若后续要求正式 inbound config carrier / adapter constructor,回 `03`。 |
| config center / admin override 继续 watch_only | 否,暂不回写 | 若后续要求 P0 remote config / live override / rollback / audit contract,回 `03`。 |
| 某配置域需要新增 runtime config carrier、builder 参数、adapter constructor、trait / port、DTO、mapper、marker、state、flow、loader / validator contract | 是 | 暂停并回 `03` owning Step。 |
| 某来源覆盖 forbidden boundary | 是且越界 | 立即暂停,不得写入 04 final。 |

### 9. R5.8 写入计划思考

`R5.8 来源优先级候选与配置域映射:再写入` 应把 R5.7 思考落成可恢复记录:

1. 写当前模块目标和允许 / 禁止范围。
2. 写映射前提确认表。
3. 写来源池到配置域映射候选表。
4. 写逐配置域允许 / 禁止来源候选表。
5. 写配置域优先级候选表。
6. 写缺失 / 不可用策略候选表。
7. 写 watch / forbidden boundary 保留记录。
8. 写对 `03-详细设计.md` 的影响预判。
9. 写 `R5.9 来源优先级停审与跨来源冲突审计:先思考` 进入门禁。
10. 不写最终来源优先级表、最终冲突处理表、按配置域来源覆盖 final 表、配置项清单、JSON demo、secret schema、测试、验收、实施或代码。

### 10. R5.7 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R5.7 一个模块 | pass |
| 是否基于 R5.6 来源池裁决而非新增来源池 | pass |
| 是否按 Step 3 配置域逐域思考来源映射 | pass |
| 是否保留 inbound source binding pass_with_watch | pass |
| 是否保留 config center / admin override watch_only | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写配置项、key、默认值、profile merge order、JSON demo、secret schema、测试、验收、实施或代码 | pass |
| 是否形成 R5.8 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.8 来源优先级候选与配置域映射:再写入`;只允许把 R5.7 思考落成映射前提确认、来源池到配置域映射候选、逐配置域允许 / 禁止来源候选、配置域优先级候选、缺失 / 不可用策略候选、watch / forbidden boundary 保留记录、03 影响预判和 R5.9 进入门禁;不得创建正式 `04-配置设计.md`;不得写最终来源优先级表、最终冲突处理表、按配置域来源覆盖 final 表、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码;不得把 watch 项当作已无条件关闭。

---

## R5.8 来源优先级候选与配置域映射:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 将 R5.7 的映射思考落成 Step 5 可恢复记录,固定映射前提确认、来源池到配置域映射候选、逐配置域允许 / 禁止来源候选、配置域优先级候选、缺失 / 不可用策略候选、watch / forbidden boundary 保留记录、03 影响预判和 R5.9 进入门禁。 |
| 本模块允许 | 写映射前提确认、来源池到配置域映射候选、逐配置域允许 / 禁止来源候选、配置域优先级候选、缺失 / 不可用策略候选、watch / forbidden boundary 保留记录、03 影响预判和下一模块门禁。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不把候选升级为最终来源优先级表、最终冲突处理表或按配置域来源覆盖 final 表;不写配置项 key、默认值、profile merge order、环境变量名、配置文件格式、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |
| 当前恢复依据 | R5.7 已完成来源池到配置域映射、逐配置域允许 / 禁止来源、优先级、缺失 / 不可用策略和 watch / forbidden boundary 的候选思考。 |

### 2. 映射前提确认

| 前提 | 写入确认 | 后续承接 |
|---|---|---|
| 来源池不是配置项清单 | confirmed_candidate: Step 5 只定义来源规则,不定义 key、默认值、env 名、文件格式或 secret 名。 | Step 7 定义配置项。 |
| 配置域来自 Step 3 | confirmed_candidate: 本轮只使用已确认配置域,不新增配置域。 | Step 5 停审继续按这些配置域审计。 |
| 分类边界来自 Step 4 | confirmed_candidate: startup、job-run-start、entry-local、sensitive ref、diagnostic、test fixture、feature/peripheral 和 watch 是来源优先级的时间边界。 | Step 6 / Step 9 继续收敛 profile 与生效。 |
| ordinary chain | confirmed_candidate: ordinary source pool 为 `code defaults < config file < environment variables`。 | R5.9 停审优先级唯一性。 |
| secret ref 与 raw secret 分离 | confirmed_candidate: ordinary source 可承载 safe ref 候选,不得承载 raw secret、token、private key、certificate body 或 external body。 | Step 8 展开敏感配置。 |
| entry-local 局部性 | confirmed_candidate: entry-local 只影响当前 entry / job / selector,不得覆盖全局 runtime 或 static boundary。 | Step 6 / Step 9 继续核对。 |
| test fixture 局部性 | confirmed_candidate: fixture / deterministic override 只限 local / CI harness。 | Step 6 profile 矩阵继续核对。 |
| watch 保留 | confirmed_candidate: inbound source binding 保持 pass_with_watch;config center / admin override 保持 watch_only。 | R5.9 / R5.10 审计继续保留。 |
| forbidden boundary | confirmed_candidate: forbidden boundary 不接受任何来源覆盖。 | 覆盖尝试视为设计越界。 |

### 3. 来源池到配置域映射候选

| 配置域 | 来源池映射候选 | 当前状态 |
|---|---|---|
| runtime profile and entry readiness | ordinary source 选择 profile / readiness;entry-local 只选当前 entry;test fixture 只限 test profile;config center/admin override 仅 watch。 | candidate |
| repository and material store binding | ordinary source 选择 store adapter / material store ref;secret ref 只承载 durable credential / endpoint ref;test fixture 只限 fake / in-memory profile。 | candidate |
| external source and resolver binding | ordinary source 选择 adapter kind、source allowlist、timeout 类普通语义;secret ref 承载 endpoint / credential / source ref;entry-local 只选当前 source selector;test fake source 只限测试。 | candidate |
| inbound source binding | ordinary / secret ref / test source 可作候选,但整体仍 pass_with_watch;不得补 formal carrier。 | pass_with_watch_candidate |
| publisher and handoff target binding | ordinary source 选择 target / publisher enablement / destination ref;secret ref 承载 target credential;job target selector 只限当前 job。 | candidate |
| query and read material policy handles | ordinary source 选择 page/body/freshness/availability handle;entry-local query selector 只限当前 query;test material 只限测试。 | candidate |
| operations job runner policy | ordinary source 选择 batch / retry / lease / report target 默认;job-run input 只限当前 run;secret ref 仅承载 report / target credential ref。 | candidate |
| safe diagnostics and redaction | ordinary source 选择 safe selector / redaction profile;entry-local diagnostic selector 只限当前 entry;任何来源不得放宽 raw 输出禁令。 | candidate |
| downstream handoff | 当前正式上游和中间产物作为后续文档承接输入;旧 `05/06/07` 只作 direction input。 | candidate |
| config center / admin override | 仅 P1/P2 watch-only candidate,不进入 P0 ordinary chain。 | watch_only |

### 4. 逐配置域允许 / 禁止来源候选

| 配置域 | 允许来源候选 | 禁止来源候选 |
|---|---|---|
| runtime profile and entry readiness | defaults、config file、env、entry-local selector、test fixture in test profile。 | raw secret、config center/admin override P0、hot runtime override、static boundary override。 |
| repository and material store binding | defaults、config file、env、secret ref for durable adapter、test fixture in test profile。 | query-time override、transaction boundary override、stored replay disable、production fixture。 |
| external source and resolver binding | defaults、config file、env、secret / endpoint ref、entry-local selector、test fake source。 | raw external body、raw adapter response、marker synthesis config、P0 admin override。 |
| inbound source binding | defaults、config file、env、secret ref、test event source。 | command emulation source、raw payload allowlist、inbound truth repair、unclosed formal carrier。 |
| publisher and handoff target binding | defaults、config file、env、secret / destination ref、job target selector、test fake publisher。 | delivery-proves-truth config、event schema config、raw bus credential。 |
| query and read material policy handles | defaults、config file、env、entry-local query selector、test material profile。 | query write config、read-time repair config、hidden material write、marker synthesis。 |
| operations job runner policy | defaults、config file、env、job-run input、secret ref for report target、test deterministic runner。 | core mutation config、truth repair config、hot change during run、scheduler lease as truth。 |
| safe diagnostics and redaction | defaults、config file、env、entry-local diagnostic selector、test diagnostic profile。 | raw secret output、raw endpoint output、raw body output、admin hot relax。 |
| downstream handoff | confirmed Step 1~14 中间产物、正式 00~04、旧 05/06/07 作为 direction input。 | 旧下游反向定义来源、TC/AC/commit boundary 作为配置。 |
| config center / admin override | P1/P2 watch-only candidate。 | P0 startup final source、core live override、raw secret override。 |

### 5. 配置域优先级候选

| 配置域 | 优先级候选 | 约束 |
|---|---|---|
| runtime profile and entry readiness | entry-local selector for current entry > env > config file > defaults。 | entry-local 不改变全局 runtime。 |
| repository and material store binding | env > config file > defaults;test fixture only in test profile。 | selected store 缺失不得 fallback 到不匹配 store。 |
| external source and resolver binding | entry-local source selector where allowed > env > config file > defaults;secret ref 只参与 credential boundary。 | resolver unavailable 不可伪造 success。 |
| inbound source binding | env > config file > defaults;test source only in test harness。 | pass_with_watch,后续若需 formal carrier 回 `03`。 |
| publisher and handoff target binding | job target selector where allowed > env > config file > defaults;secret ref 只承载 credential ref。 | target failure 不回滚 truth。 |
| query and read material policy handles | entry-local query selector where allowed > env > config file > defaults。 | 不允许 query-time store / truth override。 |
| operations job runner policy | job-run input where allowed > env > config file > defaults。 | run start 后冻结。 |
| safe diagnostics and redaction | entry-local diagnostic selector where allowed > env > config file > defaults。 | 任何来源不得放宽 raw 输出禁令。 |
| downstream handoff | 当前设计中间产物和正式上游 > old direction input。 | 旧 `05/06/07` 不覆盖当前 04。 |
| config center / admin override | 无 P0 优先级;仅 watch。 | 不进入 final P0 来源链。 |

### 6. 缺失 / 不可用策略候选

| 配置域 | 缺失策略候选 | 不可用策略候选 |
|---|---|---|
| runtime profile and entry readiness | 未指定可走 default;指定非法则 startup fail-fast。 | runtime readiness 不满足则 entry precheck fail-fast。 |
| repository and material store binding | required selected store missing -> startup fail-fast。 | selected adapter unavailable -> startup fail-fast 或 unavailable runtime surface,后续 Step 11 收敛。 |
| external source and resolver binding | required source / ref missing -> startup fail-fast 或当前 operation rejected。 | resolver unavailable -> rejected / delayed / degraded,以 `03` flow 为准。 |
| inbound source binding | required transport / idempotency channel missing -> startup fail-fast 候选。 | unsupported / unavailable source -> rejected intake 或 safe unavailable,不得 raw body fallback。 |
| publisher and handoff target binding | enabled target missing -> startup fail-fast 或 job rejected;disabled optional target 可缺失。 | unavailable target -> handoff failed / pending / report issue,不回滚 truth。 |
| query and read material policy handles | required read material store missing -> startup fail-fast;optional read surface missing -> degraded / unavailable。 | stale / unavailable -> safe degraded,不得 query repair。 |
| operations job runner policy | required job input missing -> job rejected。 | runner dependency unavailable -> job failed / suspended / report issue,不得修 core truth。 |
| safe diagnostics and redaction | redaction profile missing / unsafe -> startup fail-fast 候选。 | diagnostic sink unavailable -> safe issue / degraded reporting,不得输出 raw。 |
| downstream handoff | 下游文档尚未重启 -> blocked_by_previous_document。 | 不以旧下游补当前配置口径。 |
| config center / admin override | P0 不适用。 | P0 unsupported;若要求启用,回 `03` / 架构。 |

### 7. watch / forbidden boundary 保留记录

| 项 | 写入状态 | 后续要求 |
|---|---|---|
| inbound source binding | pass_with_watch | 不得借来源优先级补 formal carrier;若后续需要正式 binding,回 `03`。 |
| config center | watch_only | 不写 P0 source、产品、动态生效或热更新。 |
| admin override | watch_only | 不写 core live override、operator 权限或 audit schema。 |
| forbidden boundary | exclude | 不是来源冲突,而是设计越界。 |
| production-like profile | reject fixture contamination | Step 6 继续收敛 profile 矩阵。 |
| raw secret / raw body | ordinary source reject | Step 8 继续展开 secret 和敏感输出。 |

### 8. 对 03 的影响预判

| R5.8 候选结论 | 是否影响 03 | 处理 |
|---|---|---|
| 将来源池映射到既有 Step 3 配置域 | 否 | 04 来源规则候选,不改 `03`。 |
| 配置域优先级仍停留在 ordinary / entry-local / test / secret ref / watch 层 | 否 | Step 7/9 继续核对配置项与加载校验。 |
| inbound source binding 继续 pass_with_watch | 否,暂不回写 | 若后续要求正式 inbound config carrier / adapter constructor,回 `03`。 |
| config center / admin override 继续 watch_only | 否,暂不回写 | 若后续要求 P0 remote config / live override / rollback / audit contract,回 `03`。 |
| 某配置域需要新增 runtime config carrier、builder 参数、adapter constructor、trait / port、DTO、mapper、marker、state、flow、loader / validator contract | 是 | 暂停并回 `03` owning Step。 |
| 某来源覆盖 forbidden boundary | 是且越界 | 立即暂停,不得写入 04 final。 |

### 9. R5.9 进入门禁

Step 5 `R5.9 来源优先级停审与跨来源冲突审计:先思考` 只能在以下条件满足后进入:

| 门禁项 | 结果 |
|---|---|
| 映射前提确认已写入 | pass |
| 来源池到配置域映射候选已写入 | pass |
| 逐配置域允许 / 禁止来源候选已写入 | pass |
| 配置域优先级候选已写入 | pass |
| 缺失 / 不可用策略候选已写入 | pass |
| watch / forbidden boundary 保留记录已写入 | pass |
| 对 `03-详细设计.md` 的影响预判已写入 | pass |
| watch 项仍保持追踪状态 | pass |
| 未创建正式 `04-配置设计.md` | pass |
| 未写最终来源优先级表、最终冲突处理表、按配置域来源覆盖 final 表、配置项、JSON、secret、测试、验收、实施或代码 | pass |

### 10. R5.8 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R5.8 一个模块 | pass |
| 是否把 R5.7 思考落成可恢复记录 | pass |
| 是否未把候选升级为 final 表 | pass |
| 是否保留 inbound source binding pass_with_watch | pass |
| 是否保留 config center / admin override watch_only | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写配置项、key、默认值、profile merge order、JSON demo、secret schema、测试、验收、实施或代码 | pass |
| 是否形成 R5.9 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.9 来源优先级停审与跨来源冲突审计:先思考`;只允许基于 R5.8 的逐配置域来源候选,思考来源优先级唯一性、冲突可判定性、不可用策略明确性、secret 覆盖风险、同名 / alias 冲突、环境来源漂移、watch 项误关闭、03 影响缺口和 R5.10 写入计划;不得创建正式 `04-配置设计.md`;不得写最终来源优先级表、最终冲突处理表、按配置域来源覆盖 final 表、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码;不得把 watch 项当作已无条件关闭。

---

## R5.9 来源优先级停审与跨来源冲突审计:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 基于 R5.8 的逐配置域来源候选,思考来源优先级唯一性、冲突可判定性、不可用策略明确性、secret 覆盖风险、同名 / alias 冲突、环境来源漂移、watch 项误关闭、03 影响缺口和 R5.10 写入计划。 |
| 本模块允许 | 写来源优先级停审思考、逐配置域停审候选、跨来源冲突审计候选、watch / forbidden boundary 审计候选、03 影响预判和 R5.10 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不把候选升级为最终来源优先级表、最终冲突处理表或按配置域来源覆盖 final 表;不写配置项 key、默认值、profile merge order、环境变量名、配置文件格式、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |
| 当前恢复依据 | R5.8 已完成映射前提确认、来源池到配置域映射候选、逐配置域允许 / 禁止来源候选、配置域优先级候选、缺失 / 不可用策略候选、watch / forbidden boundary 保留记录和 03 影响预判。 |

### 2. 停审维度思考

| 停审维度 | R5.9 判断问题 | R5.10 写入倾向 |
|---|---|---|
| 优先级是否唯一 | 每个配置域是否只有一条可判定的覆盖链,是否把 entry-local / job input / test fixture / secret ref 与 ordinary chain 混成同一层。 | 写逐域 `priority_unique` 判断。 |
| 冲突是否可判定 | 高优先级非法值、重复 key、alias 并存、raw secret、forbidden boundary override 是否都有明确拒绝或阻断策略。 | 写逐域 `conflict_determinable` 判断。 |
| 不可用策略是否明确 | startup、job-run-start、entry-local、optional disabled target、enabled missing target、resolver unavailable、diagnostic sink unavailable 是否有分支。 | 写逐域 `unavailable_strategy_clear` 判断。 |
| secret 是否被普通来源覆盖 | file/env/entry-local/admin override 是否可能承载 raw credential、token、private key、certificate body 或 external body。 | 写 cross-source audit 的 secret redline。 |
| test fixture 是否污染 production-like | fixture / deterministic override 是否只限 local / CI harness。 | 写 profile contamination audit。 |
| watch 是否误关闭 | inbound source binding 是否仍 pass_with_watch;config center / admin override 是否仍 watch_only。 | 写 watch audit,不标 final pass。 |
| 03 是否出现回写缺口 | 是否新增 runtime config carrier、builder 参数、adapter constructor、trait / port、DTO、mapper、marker、state、flow、loader / validator contract。 | 写 `无回写 / 暂不回写 / 回 03 blocker` 判定。 |
| forbidden boundary 是否被来源覆盖 | truth owner、state transition、query no-write、job no-truth-repair、body-free、stored replay、transaction boundary、marker source、public schema、P0/P1 隔离是否被任何来源触碰。 | 写 `reject / design violation`。 |

### 3. 逐配置域停审候选思考

| 配置域 | 优先级唯一性 | 冲突可判定性 | 不可用策略明确性 | watch / 03 影响 | R5.10 倾向 |
|---|---|---|---|---|---|
| runtime profile and entry readiness | entry-local for current entry > env > file > defaults,链条清楚。 | invalid profile、P0 watch source、static boundary override 可拒绝。 | 未指定 default;指定非法 startup fail-fast。 | 无 03 回写;config center/admin override watch。 | pass_candidate |
| repository and material store binding | env > file > defaults;test fixture only test profile。 | query-time override、transaction override、stored replay disable 可拒绝。 | selected store missing / unavailable 倾向 startup fail-fast。 | 无 03 回写。 | pass_candidate |
| external source and resolver binding | entry-local source selector where allowed > env > file > defaults;secret ref 不参与 raw 覆盖。 | raw external body、raw adapter response、marker synthesis 可拒绝。 | required source missing fail-fast / operation rejected;resolver unavailable 依 `03` flow。 | 无 03 回写。 | pass_candidate |
| inbound source binding | env > file > defaults;test source only test harness。 | command emulation、raw payload allowlist、truth repair 可拒绝。 | transport / idempotency channel missing 倾向 startup fail-fast;unavailable source safe rejected。 | pass_with_watch,不得补 formal carrier。 | pass_with_watch_candidate |
| publisher and handoff target binding | job target selector where allowed > env > file > defaults。 | delivery-proves-truth、event schema config、raw bus credential 可拒绝。 | enabled target missing fail-fast / job rejected;unavailable target handoff failed / report issue。 | 无 03 回写。 | pass_candidate |
| query and read material policy handles | entry-local query selector where allowed > env > file > defaults。 | query write、read-time repair、hidden write、marker synthesis 可拒绝。 | required read material missing fail-fast;optional read surface degraded / unavailable。 | 无 03 回写。 | pass_candidate |
| operations job runner policy | job-run input where allowed > env > file > defaults。 | core mutation、truth repair、hot change during run、lease as truth 可拒绝。 | required job input missing rejected;runner unavailable failed / suspended / report issue。 | 无 03 回写。 | pass_candidate |
| safe diagnostics and redaction | entry-local diagnostic selector where allowed > env > file > defaults。 | raw output、admin hot relax、unsafe redaction 可拒绝。 | missing / unsafe redaction fail-fast;diagnostic sink unavailable safe degraded reporting。 | 无 03 回写。 | pass_candidate |
| downstream handoff | 当前正式上游和中间产物 > old direction input。 | 旧下游反向定义 TC / AC / commit / source 可拒绝。 | 下游未重启 blocked_by_previous_document。 | 无 03 回写。 | pass_candidate |
| config center / admin override | 无 P0 优先级。 | P0 startup final source、core live override、raw secret override 可拒绝。 | P0 unsupported。 | watch_only;若要求 P0 能力回 `03`。 | watch_only |

### 4. 跨来源冲突审计候选思考

| 审计项 | 风险 | R5.9 判断 | R5.10 写入倾向 |
|---|---|---|---|
| ordinary file/env 覆盖 raw secret | raw secret 被当作普通配置值进入 loader / log / DTO。 | reject;ordinary source 只能承载 safe ref 候选。 | pass_with_redline |
| 高优先级非法值 fallback | env 存在但非法时静默回退 file/default。 | reject;非法高优先级值应 fail-fast。 | pass_candidate |
| config file 重复 key | parser 后写覆盖导致语义不确定。 | 倾向 fail-fast,不依赖 parser 隐式行为。 | pass_candidate |
| alias / legacy key 并存 | 旧主线或迁移残留重新激活。 | 倾向 fail-fast 或交 Step 13 迁移规则,当前不兼容旧 key。 | pass_candidate |
| environment source drift | 不同 profile / entry 读取来源不一致且无矩阵解释。 | 交 Step 6 profile 矩阵继续审计;R5.10 记录为 downstream check。 | pass_with_downstream_owner |
| test fixture 进入 production-like | fake / deterministic override 污染生产语义。 | reject profile。 | pass_candidate |
| config center / admin override 进入 P0 | remote / admin 覆盖核心语义或热更新。 | watch_only 或 reject;若要求 P0,回 `03` / 架构。 | watch_only |
| inbound source binding 被来源优先级补口 | 用 config 补 formal carrier / adapter constructor / protocol 缺口。 | reject;保持 pass_with_watch。 | pass_with_watch |
| forbidden boundary override | 配置改 truth owner、state、query no-write、stored replay、transaction、marker、body-free、schema、P0/P1。 | design violation;不作为普通来源冲突处理。 | pass_with_redline |
| unavailable 策略不一致 | 同类 missing 在不同配置域分别 silent fallback / fail-fast。 | 需按 startup / job-run-start / entry-local / optional disabled 统一表达。 | R5.10 写策略审计。 |
| old `05/06/07` 反向定义配置 | 旧测试、验收、实施文档补配置来源或 key。 | reject;旧下游只作 direction input。 | pass_candidate |

### 5. watch 审计候选思考

| watch 项 | 当前状态 | 审计问题 | R5.10 写入倾向 |
|---|---|---|---|
| inbound source binding | pass_with_watch | 是否被写成已闭合 formal binding。 | 保持 pass_with_watch;后续若落配置项需要 formal carrier,回 `03`。 |
| config center | watch_only | 是否被写进 P0 ordinary chain 或热更新能力。 | 保持 watch_only;不写产品 / reload / rollback。 |
| admin override | watch_only | 是否被写成 core live override、operator 权限或审计 schema。 | 保持 watch_only;若要求能力回 `03` / 架构。 |
| hot runtime update | watch_only | 是否绕过 Step 4 startup / job-run / entry-local 边界。 | 保持 watch_only;P0 不承诺核心热更新。 |

### 6. 03 影响缺口预判

| 审计结果类型 | 是否影响 03 | 处理 |
|---|---|---|
| 仅确认 R5.8 的逐域来源候选可停审 | 否 | 写入 04 中间产物,继续 R5.10。 |
| 发现某配置域来源链需要新增具体 config key / env / default | 否,但越过 Step 5 | 推迟到 Step 7,当前不写。 |
| 发现 secret provider / credential resolution 需要 schema | 否,但越过 Step 5 | 推迟到 Step 8 / Step 9。 |
| 发现 profile 差异或 production-like 判定不足 | 否,但需下游 | 推迟到 Step 6 profile 矩阵。 |
| inbound binding 需要正式 carrier / adapter constructor / port | 是 | 暂停并回 `03` owning Step。 |
| config center / admin override 要进入 P0 / hot reload / live override | 是 | 暂停并回 `03` / 架构。 |
| forbidden boundary 被来源覆盖 | 是且越界 | 立即暂停,不得写成 04 final。 |

### 7. R5.10 写入计划思考

`R5.10 来源优先级停审与跨来源冲突审计:再写入` 应把 R5.9 思考落成可恢复记录:

1. 写当前模块目标和允许 / 禁止范围。
2. 写停审维度确认表。
3. 写逐配置域停审候选记录。
4. 写跨来源冲突审计候选表。
5. 写 watch 审计记录。
6. 写 03 影响缺口预判。
7. 写 Step 5 closing gate 和 Step 6 R6.1 进入门禁。
8. 不创建正式 `04-配置设计.md`。
9. 不写最终来源优先级表、最终冲突处理表、按配置域来源覆盖 final 表、配置项清单、JSON demo、secret schema、测试、验收、实施或代码。

### 8. R5.9 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R5.9 一个模块 | pass |
| 是否基于 R5.8 逐域候选做停审思考 | pass |
| 是否覆盖优先级唯一、冲突可判定、不可用策略明确 | pass |
| 是否覆盖 secret / alias / env drift / fixture / watch / forbidden boundary 审计 | pass |
| 是否保留 inbound source binding pass_with_watch | pass |
| 是否保留 config center / admin override watch_only | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未写配置项、key、默认值、profile merge order、JSON demo、secret schema、测试、验收、实施或代码 | pass |
| 是否形成 R5.10 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.10 来源优先级停审与跨来源冲突审计:再写入`;只允许把 R5.9 思考落成停审维度确认、逐配置域停审候选、跨来源冲突审计候选、watch 审计、03 影响缺口预判、Step 5 closing gate 和 Step 6 R6.1 进入门禁;不得创建正式 `04-配置设计.md`;不得写最终来源优先级表、最终冲突处理表、按配置域来源覆盖 final 表、配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码;不得把 watch 项当作已无条件关闭。

---

## R5.10 来源优先级停审与跨来源冲突审计:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 将 R5.9 的停审与跨来源冲突审计思考落成 Step 5 可恢复记录,固定停审维度确认、逐配置域停审候选、跨来源冲突审计候选、watch 审计、03 影响缺口预判、Step 5 closing gate 和 Step 6 R6.1 进入门禁。 |
| 本模块允许 | 写停审维度确认、逐配置域停审候选、跨来源冲突审计候选、watch 审计、03 影响缺口预判、Step 5 closing gate 和下一 Step 进入门禁。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写最终来源优先级表、最终冲突处理表、按配置域来源覆盖 final 表;不写配置项 key、默认值、profile merge order、环境变量名、配置文件格式、JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |
| 当前恢复依据 | R5.9 已完成停审维度思考、逐配置域停审候选思考、跨来源冲突审计候选思考、watch 审计候选、03 影响缺口预判和 R5.10 写入计划。 |

### 2. 停审维度确认

| 停审维度 | 写入确认 | 处理状态 |
|---|---|---|
| 优先级是否唯一 | 每个配置域均保留一条可判定来源链;entry-local / job input / test fixture / secret ref 均被限定在局部或引用边界,未混入 ordinary raw value chain。 | pass_candidate |
| 冲突是否可判定 | 高优先级非法值、重复 key、alias 并存、raw secret、forbidden boundary override 均有拒绝 / fail-fast / 回设计路径。 | pass_candidate |
| 不可用策略是否明确 | startup、job-run-start、entry-local、optional disabled target、enabled missing target、resolver unavailable、diagnostic sink unavailable 均有候选分支。 | pass_candidate |
| secret 是否被普通来源覆盖 | ordinary file/env/entry-local/admin override 不承载 raw credential、token、private key、certificate body 或 external body。 | pass_with_redline |
| test fixture 是否污染 production-like | fixture / deterministic override 只限 local / CI harness;production-like profile 发现 fixture 污染应拒绝。 | pass_candidate |
| watch 是否误关闭 | inbound source binding 仍为 pass_with_watch;config center / admin override 仍为 watch_only。 | pass_with_watch |
| 03 是否出现回写缺口 | 当前来源停审未新增 runtime config carrier、builder 参数、adapter constructor、trait / port、DTO、mapper、marker、state、flow、loader / validator contract。 | no_writeback |
| forbidden boundary 是否被来源覆盖 | truth owner、state transition、query no-write、job no-truth-repair、body-free、stored replay、transaction boundary、marker source、public schema、P0/P1 隔离继续 exclude。 | pass_with_redline |

### 3. 逐配置域停审候选记录

| 配置域 | 优先级唯一性 | 冲突可判定性 | 不可用策略明确性 | 03 影响 | 停审结果 |
|---|---|---|---|---|---|
| runtime profile and entry readiness | entry-local for current entry > env > file > defaults。 | invalid profile、P0 watch source、static boundary override 可拒绝。 | 未指定可 default;指定非法 startup fail-fast。 | 无回写 | pass_candidate |
| repository and material store binding | env > file > defaults;test fixture only test profile。 | query-time override、transaction override、stored replay disable 可拒绝。 | selected store missing / unavailable 倾向 startup fail-fast。 | 无回写 | pass_candidate |
| external source and resolver binding | entry-local source selector where allowed > env > file > defaults;secret ref 不参与 raw 覆盖。 | raw external body、raw adapter response、marker synthesis 可拒绝。 | required source missing fail-fast / operation rejected;resolver unavailable 依 `03` flow。 | 无回写 | pass_candidate |
| inbound source binding | env > file > defaults;test source only test harness。 | command emulation、raw payload allowlist、truth repair 可拒绝。 | transport / idempotency channel missing 倾向 startup fail-fast;unavailable source safe rejected。 | 暂不回写;保留 watch | pass_with_watch |
| publisher and handoff target binding | job target selector where allowed > env > file > defaults。 | delivery-proves-truth、event schema config、raw bus credential 可拒绝。 | enabled target missing fail-fast / job rejected;unavailable target handoff failed / report issue。 | 无回写 | pass_candidate |
| query and read material policy handles | entry-local query selector where allowed > env > file > defaults。 | query write、read-time repair、hidden write、marker synthesis 可拒绝。 | required read material missing fail-fast;optional read surface degraded / unavailable。 | 无回写 | pass_candidate |
| operations job runner policy | job-run input where allowed > env > file > defaults。 | core mutation、truth repair、hot change during run、lease as truth 可拒绝。 | required job input missing rejected;runner unavailable failed / suspended / report issue。 | 无回写 | pass_candidate |
| safe diagnostics and redaction | entry-local diagnostic selector where allowed > env > file > defaults。 | raw output、admin hot relax、unsafe redaction 可拒绝。 | missing / unsafe redaction fail-fast;diagnostic sink unavailable safe degraded reporting。 | 无回写 | pass_candidate |
| downstream handoff | 当前正式上游和中间产物 > old direction input。 | 旧下游反向定义 TC / AC / commit / source 可拒绝。 | 下游未重启 blocked_by_previous_document。 | 无回写 | pass_candidate |
| config center / admin override | 无 P0 优先级。 | P0 startup final source、core live override、raw secret override 可拒绝。 | P0 unsupported。 | 暂不回写;若要求 P0 能力回 `03`。 | watch_only |

### 4. 跨来源冲突审计候选表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| ordinary file/env 覆盖 raw secret | pass_with_redline | ordinary source 只能承载 safe ref 候选;raw secret 交 Step 8。 |
| 高优先级非法值 fallback | pass_candidate | env / entry-local / job input 存在但非法时 fail-fast 或 reject,不得 silent fallback。 |
| config file 重复 key | pass_candidate | 倾向 fail-fast,不得依赖 parser 隐式覆盖。 |
| alias / legacy key 并存 | pass_candidate | 倾向 fail-fast 或交 Step 13 迁移规则;当前不兼容旧 key。 |
| environment source drift | pass_with_downstream_owner | profile / environment 差异交 Step 6 矩阵继续审计。 |
| test fixture 进入 production-like | pass_candidate | reject profile;Step 6 继续固化环境矩阵。 |
| config center / admin override 进入 P0 | watch_only | 不进入 P0 来源链;若要求 P0 remote config / live override,回 `03` / 架构。 |
| inbound source binding 被来源优先级补口 | pass_with_watch | 不得用来源优先级补 formal carrier / adapter constructor / protocol 缺口。 |
| forbidden boundary override | pass_with_redline | 设计越界,不作为普通来源冲突处理。 |
| unavailable 策略不一致 | pass_candidate | 以 startup / job-run-start / entry-local / optional disabled target 分层表达。 |
| old `05/06/07` 反向定义配置 | pass_candidate | 旧下游只作 direction input,不得定义当前 04 来源或 key。 |

### 5. watch 审计记录

| watch 项 | 写入状态 | 审计结论 | 后续要求 |
|---|---|---|---|
| inbound source binding | pass_with_watch | 未被写成已闭合 formal binding。 | 后续若落配置项需要 formal carrier,回 `03`。 |
| config center | watch_only | 未写进 P0 ordinary chain 或热更新能力。 | 不写产品 / reload / rollback。 |
| admin override | watch_only | 未写成 core live override、operator 权限或审计 schema。 | 若要求能力回 `03` / 架构。 |
| hot runtime update | watch_only | 未绕过 Step 4 startup / job-run / entry-local 边界。 | P0 不承诺核心热更新。 |

### 6. 03 影响缺口预判

| 审计结果类型 | 是否影响 03 | 处理 |
|---|---|---|
| R5.8 的逐域来源候选可停审 | 否 | 写入 Step 5 closing gate。 |
| 具体 config key / env / default 需求 | 否,但越过 Step 5 | 推迟到 Step 7。 |
| secret provider / credential resolution schema 需求 | 否,但越过 Step 5 | 推迟到 Step 8 / Step 9。 |
| profile 差异或 production-like 判定不足 | 否,但需下游 | 推迟到 Step 6 profile 矩阵。 |
| inbound binding 需要正式 carrier / adapter constructor / port | 是 | 暂停并回 `03` owning Step。 |
| config center / admin override 要进入 P0 / hot reload / live override | 是 | 暂停并回 `03` / 架构。 |
| forbidden boundary 被来源覆盖 | 是且越界 | 立即暂停,不得写成 04 final。 |

### 7. Step 5 closing gate

| 关闭项 | 结果 | 说明 |
|---|---|---|
| 配置来源优先级候选已覆盖 | pass | ordinary source、secret ref、entry-local、test fixture、watch source 和 forbidden boundary 均已候选化。 |
| 冲突处理候选已覆盖 | pass | ordinary vs ordinary、raw secret、forbidden boundary、watch P0 污染、fixture 污染、missing / unavailable 均有候选处理。 |
| 按配置域组织的来源覆盖候选已覆盖 | pass_with_watch | 每个 Step 3 配置域均已有允许来源、禁止来源、优先级和不可用策略候选;inbound / config center / admin override 保留 watch。 |
| 来源优先级停审已完成 | pass_with_watch | 主配置域为 pass_candidate;inbound source binding 为 pass_with_watch;config center / admin override 为 watch_only。 |
| 跨来源冲突审计已完成 | pass_with_watch | secret、alias、env drift、fixture、watch、forbidden boundary 和旧下游污染均已审计。 |
| 对详细设计的影响判定已完成 | pass_with_watch | 当前无 03 回写;后续若启用 inbound formal carrier 或 P0 remote/admin override,必须回 `03`。 |
| 未越过 Step 5 范围 | pass | 未写配置项、key、env、default、profile matrix、secret schema、loader / validator、测试、验收、实施或代码。 |

Step 5 closing gate: pass_with_watch。当前 Step 关闭为 `completed_wait_user_confirm_to_R6.1`。

### 8. Step 6 R6.1 进入门禁

Step 6 `R6.1 开工与必读文档:先思考` 只能在以下条件满足后进入:

| 门禁项 | 结果 |
|---|---|
| Step 5 来源池裁决已写入 | pass |
| Step 5 逐配置域来源覆盖候选已写入 | pass |
| Step 5 来源优先级停审已写入 | pass_with_watch |
| Step 5 跨来源冲突审计已写入 | pass_with_watch |
| watch 项仍保持追踪状态 | pass |
| 未创建正式 `04-配置设计.md` | pass |
| 未写配置项、key、默认值、profile merge order、JSON demo、secret schema、测试、验收、实施或代码 | pass |

### 9. R5.10 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 R5.10 一个模块 | pass |
| 是否把 R5.9 停审思考落成可恢复记录 | pass |
| 是否完成 Step 5 closing gate | pass_with_watch |
| 是否保留 inbound source binding pass_with_watch | pass |
| 是否保留 config center / admin override watch_only | pass |
| 是否未创建正式 `04-配置设计.md` | pass |
| 是否未创建 Step 6 文件 | pass |
| 是否未写配置项、key、默认值、profile merge order、JSON demo、secret schema、测试、验收、实施或代码 | pass |
| 是否形成 Step 6 R6.1 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.1 开工与必读文档:先思考`;允许创建 `design-calibration/04_config_step_06_environment_profiles_matrix.md` 并写入 Step 6 开工边界、必读文档、Step 5 输入承接、环境 / profile / 矩阵讨论轴、watch 项承接、03 影响判定框架和 R6.2 写入计划;不得创建正式 `04-配置设计.md`;不得写配置项清单、JSON demo、secret schema、测试方案、验收标准、实施计划或代码;不得把 watch 项当作已无条件关闭。
