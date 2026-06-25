# Step 7. 定义配置项清单

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 7
> 书写规范: `standards/document/配置设计书写规范.md` §5.7
> 回填章节: `04-配置设计.md` §7 配置项清单
> 创建日期: 2026-06-25
> 当前状态: `R7.12 diagnostics / redaction / downstream handoff family 细化:再写入` completed_wait_user_confirm_to_R8.1
> 当前门禁: 等待确认进入 Step 8 `R8.1 开工与必读文档:先思考`

---

## 0. Step 7 边界

Step 7 在 Step 3 控制面、Step 4 分类与禁止配置化边界、Step 5 来源优先级和 Step 6 环境 / profile 矩阵基础上,把 P0 runtime 必需配置整理为可实现、可校验、可测试、可验收承接的配置项清单。

当前 Step 将讨论配置项总表、按配置域组织的配置项批次、模块级 JSON demo、每个 demo 下方的配置项说明表、完整配置 demo、配置项停审记录和跨配置项闭环审计。

R7.1 只记录开工思考和必读文档基线,不定义最终配置项清单、key、默认值、环境变量名、JSON demo、secret schema、加载校验、测试方案、验收标准、实施计划或代码。

---

## R7.1 开工与必读文档:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 思考 Step 7 的开工边界、必读文档、Step 3~6 输入基线、SOP Step 7 产出要求、watch / redline 带入、对 `03-详细设计.md` 的影响判定框架和 R7.2 写入计划。 |
| 本模块允许 | 创建并写入 Step 7 中间产物的开工思考;只记录输入基线、必读文档、配置项讨论框架、表格列约束、watch / redline、03 影响判定和 R7.2 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写最终配置项清单、具体 key、默认值、环境变量名、模块 JSON demo、完整配置 demo、secret provider schema、测试用例、验收门禁、实施计划或代码。 |
| 恢复依据 | Step 6 已关闭为 `R6.16 Step 6 最终停审与进入 Step 7:再写入 completed_wait_user_confirm_to_R7.1`;用户已确认进入 R7.1。 |

### 2. Step 7 开工边界思考

| 边界项 | R7.1 裁决 |
|---|---|
| Step 7 定位 | 从 profile / source / boundary 讨论进入字段级配置项清单,但必须先从控制面和配置域收拢,不能直接散列 key。 |
| 直接输入 | Step 3 控制面、Step 4 分类与禁止配置化边界、Step 5 来源优先级、Step 6 profile 矩阵、SOP Step 7、书写规范 §5.7、正式 `00/01/02/03`。 |
| 输出粒度 | 后续应逐配置域讨论配置项,再写总表、域批次表、模块 JSON demo、逐项说明表、完整 demo 和审计表。 |
| 配置项边界 | 只纳入 P0 runtime 必需、可被 loader / builder / adapter / entry / job 消费且有正式来源和失败策略的配置项。 |
| 非配置项边界 | truth owner、state transition、query no-write、job no-truth-repair、body-free、stored replay、transaction boundary、marker source、public schema、P0/P1 隔离不是配置项。 |
| P1/P2 边界 | staging-like、production-like、真实 secret provider、真实 endpoint / bus / report target、config center、admin override 只能作为 direction / watch,不得混入 P0 清单。 |
| 示例边界 | JSON demo 必须服务于已确认配置项,不能用 demo 代替表格;JSONC 注释只能作为文档说明,实际运行配置仍必须去注释。 |
| 对 03 的影响 | 若 Step 7 需要新增 runtime config carrier、builder 参数、adapter constructor、trait / port、DTO、mapper、marker、state、flow 或 loader contract,必须回 `03-详细设计.md` 或暂停。 |

### 3. 必读文档思考

| 必读文档 | 读取用途 | R7.2 用法 |
|---|---|---|
| `project_execution_ledger.md` | 确认当前允许进入 Step 7 R7.1。 | 写入 Step 7 当前恢复依据。 |
| `04_config_calibration_flow.md` | 确认 Step 7 主题、状态表和执行纪律。 | 同步 Step 7 当前状态和 next_allowed_action。 |
| `04_config_step_03_control_plane.md` | 承接配置控制面、配置域、runtime binding surfaces 和 watch 项。 | 形成配置项候选来源池,但不直接定 key。 |
| `04_config_step_04_categories_boundaries.md` | 承接 startup、job-run-start、entry-local、test fixture、sensitive ref、forbidden boundary。 | 判定每个配置项的类别、作用域和不得配置化边界。 |
| `04_config_step_05_sources_priority_conflicts.md` | 承接 ordinary source chain、secret ref、entry-local、fixture、watch_only 和来源冲突。 | 判定每个配置项的来源、覆盖规则和失败策略。 |
| `04_config_step_06_environment_profiles_matrix.md` | 承接 local / CI / integration / operations / staging / production profile 和 P0/P1/P2 隔离。 | 判定每个配置项适用 profile 与环境差异。 |
| `配置设计讨论流程_SOP.md` Step 7 | 固定本步目标、输入、输出、十二个问题和期望表格。 | R7.2 写入开工记录,R7.3 起逐问题讨论。 |
| `配置设计书写规范.md` §5.7 | 固定配置项表格列、模块 JSON demo、逐项说明表和完整 demo 约束。 | 作为后续配置项清单的格式门禁。 |
| `设计文档讨论中间产物规范.md` | 固定逐模块、先思考后写入和台账恢复纪律。 | 约束 R7.1 -> R7.2。 |
| `设计真相源闭环与可落码性标准.md` | 固定缺 schema / port / mapper / config / evidence 时必须暂停。 | 作为 03 影响和 blocker 判定依据。 |
| `00-需求文档.md` | 提供 Definition vs Use、P0/P1、非功能、安全、正文排除和依赖裁剪。 | 防止配置项扩大本仓职责。 |
| `01-架构设计.md` | 提供依赖方向、数据所有权、外围不前置、配置变更控制边界。 | 防止配置项引入 sibling dependency 或真实产品前置。 |
| `02-概要设计.md` §11 | 提供配置影响轮廓和禁止配置化边界。 | 核对配置项是否越过概要红线。 |
| `03-详细设计.md` §13 / §16 / §17 | 提供 runtime config binding、builder、adapter availability、external dependency、handoff owner 和风险。 | 判定配置项是否已有正式消费面。 |
| L1-governance Step 7 | 提供配置项总表、域批次表、模块 demo、完整 demo、停审和审计框架深度。 | 只参考结构,不复制 governance 配置项、字段、默认值或 profile 裁决。 |

### 4. Step 3~6 输入基线思考

| 输入来源 | Step 7 接收方式 | 不得接收 |
|---|---|---|
| Step 3 控制面 | 接收配置域、runtime binding surfaces、adapter availability、entry / job local input 和 watch 项作为配置项候选池。 | 不把控制面名称直接当配置 key,不重复项目名前缀堆叠。 |
| Step 4 分类边界 | 接收 startup、job-run-start、entry-local、test fixture、sensitive ref 和 forbidden boundary。 | 不把 forbidden boundary 写成可配置开关。 |
| Step 5 来源优先级 | 接收 `code defaults < config file < environment variables`、secret ref、fixture、entry-local、watch_only。 | 不把 config center / admin override 写入 P0 来源链。 |
| Step 6 profile 矩阵 | 接收 `local-dev`、`ci-test`、`integration-like`、`operations-replay` P0 candidate 和 staging / production P1/P2 direction。 | 不把 P1/P2 production-like 细节变成当前 P0 required config。 |
| 正式 `03` §13 | 接收已有 runtime builder、adapter availability、config binding 和 external dependency seams。 | 不自行新增 builder 字段、adapter constructor 或 port。 |
| 旧 `05/06/07` | 只作为下游方向输入。 | 不反向定义配置项、key、fixture、AC、commit boundary 或 evidence schema。 |

### 5. SOP Step 7 产出与问题框架思考

| SOP 产出 | R7 后续处理方式 |
|---|---|
| 配置项清单 | 按规范列出配置项、类型、默认值、必填、来源、作用域、生效方式、敏感级别、失败策略、关联模块。 |
| 按配置域组织的配置项批次表 | 按功能边界拆分,避免 `storage`、`common`、`misc`、`runtime` 等泛化桶混写。 |
| 模块级 JSON demo | 每个模块 demo 只展示已确认配置项,并在下方给逐项说明表。 |
| 每个模块 demo 下方的配置项作用说明表 | 解释类型、示例值、作用、约束 / 校验和失败策略。 |
| 完整配置 demo | 章节末尾汇总;若需要注释使用 JSONC,并说明运行时 JSON 必须去注释。 |
| 配置项停审记录 | 每个配置域完成后停审,确认无重复、无泛化混写、无必填缺失败策略。 |
| 跨配置项闭环审计表 | 审计 Step 3/4/5/6 回指、敏感级别、03 影响、watch 项、P0/P1 隔离和旧材料回流。 |

### 6. Watch / redline 带入思考

| 项 | 当前状态 | Step 7 处理 |
|---|---|---|
| inbound source binding | pass_with_watch | 若出现 source binding 配置项,必须复核 formal carrier / adapter constructor / protocol 是否已闭合;缺口回 `03`。 |
| config center | watch_only | 不进入 P0 配置项清单;不写 remote config、hot reload、live override 或 rollback contract。 |
| admin override | watch_only | 不进入 P0 配置项清单;不写 operator override、权限模型或审计 schema。 |
| true secret provider schema | not_defined / P1-P2 direction | Step 7 不写 provider schema;Step 8 或 `03` 再闭口。 |
| true endpoint / bus / report target schema | not_defined / P1-P2 direction | 不锁 URL、topic、bucket、产品或 credential body。 |
| old MethodContent / publish / snapshot / outbox | redline | 不作为当前 P0 配置项来源。 |
| forbidden boundary | redline | 任何配置项不得改变 truth owner、state transition、query no-write、job no-truth-repair、body-free、stored replay、transaction boundary、marker source、public schema 或 P0/P1 隔离。 |

### 7. 对 03 的影响判定框架

| Step 7 结论类型 | 是否影响 03 | 处理规则 |
|---|---|---|
| 只把已存在的 runtime config / builder / adapter availability 输入整理成配置项 | 通常否 | 记录为 `无回写`,后续 Step 9 校验加载时再复核。 |
| 明确配置项默认值、必填性、来源、作用域、生效方式和失败策略 | 通常否 | 只要不新增 runtime contract,留在 `04`。 |
| 将 P0 fake / disabled / controlled seam 表达为配置项 | 视已有 `03` 消费面而定 | 已有消费面则记录;缺正式消费面则回 `03`。 |
| 需要新增 config struct 字段、typed ref、builder 参数、adapter constructor、port 或 mapper | 是 | 暂停并回 `03` owning Step。 |
| 需要把 secret provider、config center、admin override、hot reload 或 production product 纳入 P0 | 是 | 暂停,需 `03` / 架构闭口。 |
| 配置项试图改变 forbidden boundary | 是且越界 | 立即暂停,不得在 04 内补口。 |

### 8. R7.2 写入计划

| R7.2 拟写内容 | 写入边界 |
|---|---|
| Step 7 开工记录 | 把 R7.1 思考固化为开工记录、输入基线和必读文档记录。 |
| SOP / 规范输出门禁 | 写明配置项总表、域批次表、模块 JSON demo、完整 demo、停审和审计表的后续产物要求。 |
| Step 3~6 承接记录 | 写清每类输入如何进入配置项候选池。 |
| watch / redline 记录 | 固定 inbound source binding、config center / admin override、secret provider、endpoint / bus / report target 和 forbidden boundary。 |
| 03 影响判定记录 | 写清何时无回写、何时必须暂停回 `03`。 |
| R7.3 入口 | 只推进到 SOP 问题回答与配置项候选:先思考,不提前写最终清单。 |

### 9. R7.1 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只写开工与必读文档思考 | pass | 未写最终配置项、key、默认值、env var 或 JSON demo。 |
| 是否承接 Step 3~6 | pass | 已记录控制面、分类边界、来源优先级和 profile 矩阵的接收方式。 |
| 是否保留 watch 项 | pass | inbound source binding 保持 pass_with_watch;config center / admin override 保持 watch_only。 |
| 是否保留 forbidden boundary | pass | 已明确配置项不得改变 truth owner、state transition、query no-write、job no-truth-repair、body-free、stored replay、transaction boundary、marker source、public schema 或 P0/P1 隔离。 |
| 是否直接创建正式 `04-配置设计.md` | pass | 未创建正式 04。 |
| 是否可进入 R7.2 | pass | 等待用户确认后进入 `R7.2 开工与必读文档:再写入`。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.2 开工与必读文档:再写入`;只允许把 R7.1 思考固化为开工记录、输入基线、必读文档、SOP 输出门禁、watch / redline、03 影响判定和 R7.3 入口;不得创建正式 `04-配置设计.md`;不得写最终配置项清单、具体 key、默认值、环境变量名、模块 JSON demo、完整配置 demo、secret provider schema、测试方案、验收标准、实施计划或代码。

---

## R7.2 开工与必读文档:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 将 R7.1 的开工思考固化为 Step 7 的执行入口、必读文档清单、输入基线、产出门禁、watch / redline、03 影响判定和 R7.3 入口。 |
| 本模块允许 | 写入开工记录、必读文档记录、Step 3~6 承接记录、SOP / 规范输出门禁、watch / redline 带入、03 影响判定和下一模块门禁。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写最终配置项清单、具体 key、默认值、环境变量名、模块 JSON demo、完整配置 demo、secret provider schema、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R7.1 已完成开工与必读文档思考,用户已确认进入 R7.2。 |

### 2. Step 7 开工记录

| 开工项 | R7.2 记录 |
|---|---|
| 当前 Step | Step 7 定义配置项清单。 |
| 当前目标 | 把 P0 runtime 必需配置整理成字段级、可实现、可校验、可测试、可验收承接的配置项清单。 |
| 执行方式 | 继续按“先思考 -> 再写入”逐模块推进;每次用户确认只推进一个当前模块。 |
| 首要输入 | Step 3 控制面、Step 4 分类边界、Step 5 来源优先级、Step 6 环境 / profile 矩阵和正式 `03` 配置绑定。 |
| 首要产出 | 后续生成配置项总表、配置域批次表、模块 JSON demo、逐项说明表、完整配置 demo、停审记录和跨项审计表。 |
| 当前不做 | 不在 R7.2 写配置项本体,不提前给 key、默认值、env var 或 demo。 |

### 3. 必读文档记录

| 必读文档 | Step 7 用途 | 读取结论 |
|---|---|---|
| `project_execution_ledger.md` | 确认当前恢复点和用户确认门禁。 | 当前允许从 R7.1 推进到 R7.2,并在 R7.2 后等待 R7.3。 |
| `04_config_calibration_flow.md` | 确认配置设计 Step 状态表和执行纪律。 | Step 7 为当前 in-progress Step,正式 `04` 仍不得创建。 |
| `04_config_step_03_control_plane.md` | 提供配置域和 runtime binding surfaces。 | 作为配置项候选池来源,不是直接 key 列表。 |
| `04_config_step_04_categories_boundaries.md` | 提供配置类别、更新时机和禁止配置化边界。 | 后续每个配置项必须落到合法类别和作用域。 |
| `04_config_step_05_sources_priority_conflicts.md` | 提供来源链、冲突处理和 watch_only 口径。 | 后续每个配置项必须写来源、覆盖规则和失败策略。 |
| `04_config_step_06_environment_profiles_matrix.md` | 提供 P0 profiles 与 P1/P2 direction。 | 后续每个配置项必须说明适用 profile 与环境差异。 |
| `配置设计讨论流程_SOP.md` Step 7 | 固定本 Step 目标、输入、输出和问题清单。 | R7.3 起按问题形成配置项候选,不得跳过停审。 |
| `配置设计书写规范.md` §5.7 | 固定表格列、JSON demo 和完整 demo 要求。 | 后续所有配置项必须具备类型、默认值、必填、来源、作用域、生效方式、敏感级别、失败策略和关联模块。 |
| `设计文档讨论中间产物规范.md` | 固定中间产物和台账同步纪律。 | 本 Step 每个模块写完后同步 flow 与项目台账。 |
| `设计真相源闭环与可落码性标准.md` | 固定缺 schema / port / mapper / config 时的暂停规则。 | 若配置项要求新增正式消费面,必须回 `03` 或阻塞。 |
| 正式 `00/01/02/03` | 提供本轮配置设计的上游真相源。 | 不从旧 `05/06/07` 反向定义配置项。 |
| L1-governance Step 7 | 提供框架深度参考。 | 只参考结构和门禁,不复制领域事实。 |

### 4. Step 3~6 输入基线记录

| 输入基线 | 进入 Step 7 的方式 | R7.3 处理 |
|---|---|---|
| 控制面 / 配置域 | 作为配置项候选分组和关联模块的来源。 | 逐域提出配置项候选,先标 candidate。 |
| 分类与更新时机 | 作为配置项类别、作用域、生效方式和边界裁剪依据。 | 判定 startup / job-run-start / entry-local / fixture / sensitive ref。 |
| 来源优先级 | 作为来源列、覆盖关系和冲突处理依据。 | 普通来源采用既定链路;watch source 不进入 P0 final。 |
| 环境 / profile 矩阵 | 作为 profile 适用性和 P0/P1/P2 分离依据。 | P0 只围绕 local-dev、ci-test、integration-like、operations-replay 候选。 |
| 正式 `03` 配置绑定 | 作为配置项是否已有消费面的判定依据。 | 缺 builder / adapter / port / mapper / loader 契约时暂停。 |
| 旧材料 | 只作为下游方向或污染审计对象。 | 不反向生成 key、默认值、fixture、验收或实施边界。 |

### 5. SOP / 规范输出门禁记录

| 输出物 | 必须满足的门禁 |
|---|---|
| 配置项总表 | 必须包含 `配置项 / 类型 / 默认值 / 是否必填 / 来源 / 作用域 / 生效方式 / 敏感级别 / 失败策略 / 关联模块`。 |
| 配置域批次表 | 必须按功能边界拆分,不得用 `storage`、`common`、`misc`、`runtime` 这类泛化桶混写不同功能。 |
| 模块级 JSON demo | 必须跟已确认配置项一一对应,不得用 demo 代替表格。 |
| demo 下方说明表 | 必须逐项说明作用、类型、示例值、约束 / 校验和失败策略。 |
| 完整配置 demo | 只能在配置项确认后汇总;若用 JSONC 注释,必须声明运行配置需去注释。 |
| 配置项停审记录 | 每个配置域完成后停审,检查重复项、泛化混写、必填缺失败策略、敏感级别未归类和 03 影响未判定。 |
| 跨配置项闭环审计表 | 必须回指 Step 3/4/5/6,并审计 watch 项、P0/P1 隔离、旧材料回流和 03 回写缺口。 |

### 6. Watch / redline 带入记录

| 项 | R7.2 固定口径 |
|---|---|
| inbound source binding | 继续 `pass_with_watch`;若后续需要配置项,必须先确认 formal carrier / adapter constructor / protocol。 |
| config center | 继续 `watch_only`;不得进入 P0 配置项清单或来源链。 |
| admin override | 继续 `watch_only`;不得写 live override、operator override、rollback 或 audit contract。 |
| true secret provider schema | 当前未定义;Step 7 不写 provider schema,Step 8 或 `03` 再闭口。 |
| true endpoint / bus / report target schema | 当前不锁产品、URL、topic、bucket 或 credential body。 |
| old MethodContent / publish / snapshot / outbox | 旧材料红线;不得回流为当前 P0 配置项。 |
| forbidden boundary | 配置项不得改变 truth owner、state transition、query no-write、job no-truth-repair、body-free、stored replay、transaction boundary、marker source、public schema 或 P0/P1 隔离。 |

### 7. 对 03 的影响判定记录

| 判定场景 | R7.2 处理规则 |
|---|---|
| 已有 `03` runtime config / builder / adapter availability 消费面 | 可在 04 写成配置项候选,后续再停审。 |
| 只是补齐默认值、必填性、来源、作用域、生效方式、敏感级别和失败策略 | 通常留在 04,但必须保留 03 回指。 |
| 需要新增 typed ref、config struct 字段、builder 参数、adapter constructor、trait / port、DTO、mapper、marker、state、flow 或 loader contract | 暂停并回 `03` owning Step。 |
| 需要把 remote config、admin override、hot reload、真实 secret provider 或生产产品纳入 P0 | 暂停并回 `03` / 架构闭口。 |
| 配置项试图覆盖静态设计边界 | 立即拒绝,不得在 04 内补口。 |

### 8. R7.3 入口记录

| 下一模块 | 允许内容 | 禁止内容 |
|---|---|---|
| `R7.3 SOP 问题回答与配置项候选:先思考` | 围绕 SOP Step 7 十二问形成配置项候选、配置域候选、模块拆分候选、表格列填充策略、03 影响预判和 R7.4 写入计划。 | 不写最终配置项清单、最终 key、最终默认值、最终 env var、正式 JSON demo、secret schema、测试方案、验收标准、实施计划或代码。 |

### 9. R7.2 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成 R7.1 思考固化 | pass | 已写入开工记录、必读文档、输入基线、输出门禁、watch / redline 和 03 影响判定。 |
| 是否仍未写配置项本体 | pass | 未写最终配置项、key、默认值、env var 或 JSON demo。 |
| 是否同步后续入口 | pass | 下一模块为 R7.3 SOP 问题回答与配置项候选:先思考。 |
| 是否保留正式 04 装配门禁 | pass | 正式 `04-配置设计.md` 仍必须等 Step 15。 |
| 是否可进入 R7.3 | pass | 等待用户确认后进入 `R7.3 SOP 问题回答与配置项候选:先思考`。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.3 SOP 问题回答与配置项候选:先思考`;只允许围绕 SOP Step 7 十二问形成配置项候选、配置域候选、模块拆分候选、表格列填充策略、03 影响预判和 R7.4 写入计划;不得创建正式 `04-配置设计.md`;不得写最终配置项清单、最终 key、最终默认值、最终环境变量名、正式模块 JSON demo、完整配置 demo、secret provider schema、测试方案、验收标准、实施计划或代码。

---

## R7.3 SOP 问题回答与配置项候选:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 围绕 SOP Step 7 十二问形成配置项候选、配置域候选、模块拆分候选、表格列填充策略、03 影响预判和 R7.4 写入计划。 |
| 本模块允许 | 写候选思考、候选池、候选分类、候选表格填充规则、取舍方向、watch 保留、03 影响预判和 R7.4 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不把候选升级为最终配置项清单;不写最终 key、最终默认值、最终环境变量名、正式模块 JSON demo、完整配置 demo、secret provider schema、测试方案、验收标准、实施计划或代码。 |
| 当前恢复依据 | R7.2 已固定 Step 7 开工记录、输入基线、SOP / 规范输出门禁、watch / redline 和 03 影响判定;用户已确认进入 R7.3。 |

### 2. SOP 十二问候选回答思考

| SOP 问题 | 候选回答方向 | 当前状态 | R7.4 写入注意 |
|---|---|---|---|
| 每个 P0 配置项的名称、类型、默认值是什么? | 先按配置域形成 item family 候选,再在后续模块细化名称、类型和默认值。 | candidate | R7.3 不写最终 key / default;R7.4 也只落候选。 |
| 哪些配置项必填? | startup 必需项、enabled target 必需项、job-run-start 必需项和 entry-local 必需项分层判断。 | candidate | 不能把 optional disabled target 写成 required。 |
| 每个配置项从哪里来、作用域是什么? | 普通链为 defaults / file / env;entry-local、job input、fixture、secret ref 分域生效。 | candidate | config center / admin override 不进 P0 source。 |
| 每个配置项如何生效、是否敏感、失败策略是什么? | startup freeze、job-run-start freeze、entry-local only;敏感只标 ref-sensitive 候选;失败按 fail-fast / reject / degraded 候选。 | candidate | 敏感级别最终归一交 Step 8 复核。 |
| 每个配置项关联哪些模块? | 按功能模块而非泛化桶拆分: runtime assembly、repository/material、external source、publisher/handoff、query/read、operations job、diagnostics/redaction、downstream handoff。 | candidate | 避免 `storage` / `common` / `misc` / `runtime` 混装。 |
| 每个模块的 JSON demo 应该如何写? | 先按模块规划 demo 入口,待候选停审后再写示例。 | candidate | 当前不写 JSON body。 |
| 模块拆分是否按功能边界展开? | 候选拆分沿 Step 3 配置域和 Step 4 类别走,不按技术杂项桶走。 | candidate | 后续总表每行必须能回指功能域。 |
| 项目本地配置是否避免重复项目名前缀? | 候选倾向为项目内部配置不重复项目名;系统级聚合场景才说明映射。 | candidate | 不在 R7.3 定最终命名。 |
| 完整配置 demo 是否需要文档注释? | 候选为正式章节可用 JSONC 说明,实际运行 JSON 去注释。 | candidate | 完整 demo 等候选项确认后再写。 |
| 每个配置项是否回指 Step 3/4/5/6? | 每个候选项必须回指控制面、分类、来源规则和 profile。 | candidate | R7.4 写入候选回指规则。 |
| 每个配置域配置项完成后是否通过停审? | 每个域需检查必填性、来源、失败策略、敏感级别、watch 和 03 影响。 | candidate | 后续逐域停审,不在 R7.3 关闭。 |
| 所有配置项完成后是否存在重复项或缺口? | 跨项审计覆盖重复语义、泛化模块、必填缺失败策略、敏感级别未归类、P1/P2 污染和 03 影响未判定。 | candidate | R7.3 只形成审计候选。 |

### 3. 配置域候选池思考

| 配置域候选 | 配置项候选方向 | 适用边界 | 当前判断 |
|---|---|---|---|
| runtime profile and entry readiness | profile identity、entry readiness、feature / adapter availability summary 相关候选。 | startup / entry-local;P0 profile 只覆盖 local-dev、ci-test、integration-like、operations-replay。 | candidate |
| repository and material store binding | repository adapter slot、material store slot、store availability、test fixture store 相关候选。 | startup;test fixture only local / CI。 | candidate |
| external source and resolver binding | source adapter slot、resolver adapter slot、availability branch、safe ref boundary 相关候选。 | startup;entry-local selector where formally allowed。 | candidate |
| inbound source binding | inbound source profile、transport / idempotency channel、body-free validation 相关候选。 | startup;pass_with_watch。 | watch_candidate |
| event publisher and handoff target binding | publisher target、handoff target、target availability、blocked / unavailable branch 相关候选。 | startup / job-run-start。 | candidate |
| query and read material policy handles | page/body limit、freshness threshold、read availability source、entry-local selector 相关候选。 | startup / entry-local;query no-write redline。 | candidate |
| operations job runner policy | batch、retry、lease、checkpoint、report target、run-scoped diagnostic 相关候选。 | job-run-start freeze。 | candidate |
| safe diagnostics and redaction | redaction profile、safe issue reporting、diagnostic sink、runtime unavailable marker 相关候选。 | startup / entry-local diagnostic selector。 | candidate |
| downstream handoff | 配置矩阵、redline、implementation gate 输入和 report root 方向候选。 | downstream owner;不反向定义 TC/AC/commit。 | candidate |
| config center / admin override | remote config source、operator override、live override 方向。 | P1/P2 watch_only;不进 P0 清单。 | excluded_from_P0_candidate |

### 4. 配置项表格列填充策略思考

| 表格列 | 候选填充策略 | 禁止写法 |
|---|---|---|
| 配置项 | 先写稳定语义名候选,后续再决定具体 key。 | 不写临时 key、产品名 key、重复项目前缀。 |
| 类型 | 使用明确类型族候选,例如 enum/ref/bool/int/duration/path-like/safe-text 等。 | 不只写 `string` / `number`。 |
| 默认值 | 区分 has safe default / no default / disabled candidate / profile-derived candidate。 | 不用默认值绕过必填项或 required adapter。 |
| 是否必填 | 按 startup required、enabled required、job-run-start required、entry-local required、optional disabled 区分。 | 不把 P1/P2 direction 写成 P0 必填。 |
| 来源 | 普通链、secret ref、entry-local、job input、fixture 分列候选。 | 不把 config center / admin override 写成 P0 来源。 |
| 作用域 | startup / job-run-start / entry-local / test-only / downstream-owner。 | 不让 entry-local 覆盖全局配置。 |
| 生效方式 | cold startup freeze、job-run-start freeze、current entry only、test harness only。 | 不写核心 hot runtime update。 |
| 敏感级别 | public/internal/sensitive-ref/secret-not-config 候选。 | 不把 raw secret、token、private key、credential body 写成配置项。 |
| 失败策略 | startup fail-fast、job rejected、entry rejected、disabled branch、safe degraded / unavailable。 | 不静默 fallback 非法高优先级值。 |
| 关联模块 | 使用功能域模块名候选。 | 不用 `common` / `misc` / 泛化 `runtime` 承载不同语义。 |

### 5. 模块拆分候选思考

| 模块候选 | 主要承载 | 拆分理由 | R7.4 注意 |
|---|---|---|---|
| runtime-assembly | profile、entry readiness、adapter availability summary。 | 对应 runtime builder 和 entry precheck。 | 不重复项目名前缀。 |
| repository-material | repository / material store adapter 与 availability。 | 区分 truth store binding 和 query/read policy。 | 不写 transaction boundary config。 |
| external-source | external source / resolver adapter、safe ref、unavailable branch。 | 区分 source binding 与 publisher/handoff target。 | inbound source binding 保留 watch。 |
| publication-handoff | publisher target、handoff target、blocked/unavailable branch。 | delivery / handoff 不证明 local truth。 | 不写 receipt 反证 truth。 |
| query-read-policy | page/body/freshness/read availability policy。 | query 只读,不得 repair。 | 不写 query write knob。 |
| operations-job | batch/retry/lease/checkpoint/report target。 | job-run-start freeze,不修 core truth。 | 不写 stored replay disable knob。 |
| diagnostics-redaction | redaction profile、safe diagnostic、redacted artifact direction。 | 安全输出和敏感边界集中停审。 | raw body / raw secret redline。 |
| downstream-handoff | 测试 / 验收 / 实施承接输入。 | 只给后续文档承接,不反向定义下游。 | 不写 TC/AC/evidence schema。 |

### 6. JSON demo 策略候选思考

| demo 层级 | 候选处理 | 当前不写 |
|---|---|---|
| 模块级 demo | 每个功能模块各自给最小示例,下方接逐项说明表。 | 不写具体 JSON body。 |
| 完整配置 demo | 在配置项候选完成、去重和停审后再汇总。 | 不写完整配置样例。 |
| JSONC 注释 | 文档中可用注释解释,但必须说明运行时 JSON 去注释。 | 不把 JSONC 变成 runtime 能力。 |
| profile demo | 只在后续按 profile 差异说明,不复制 Step 6 profile 矩阵。 | 不写部署命令或 runbook。 |

### 7. watch / redline 候选处理思考

| 项 | R7.3 判断 | R7.4 写入倾向 |
|---|---|---|
| inbound source binding | 可以保留配置项候选方向,但必须标 `pass_with_watch`。 | 写入 watch_candidate,不关闭。 |
| config center | 不进入 P0 配置项候选。 | 写入 excluded_from_P0 / watch_only。 |
| admin override | 不进入 P0 配置项候选。 | 写入 excluded_from_P0 / watch_only。 |
| true secret provider schema | Step 7 不写 provider schema。 | 标 Step 8 / 03 owner。 |
| true endpoint / bus / report target schema | 不锁 URL、topic、bucket、产品或 credential body。 | 只写 ref direction。 |
| forbidden boundary | 不得被任何配置项覆盖。 | 每个候选项都需审计。 |
| old material | 旧 MethodContent / publish / snapshot / outbox 不回流。 | 写入跨项审计项。 |

### 8. 对 03 的影响预判

| 候选结论 | 是否影响 03 | 当前处理 |
|---|---|---|
| 仅按 Step 3~6 既有控制面整理 item family | 否 | 继续 R7.4。 |
| 给已有 `03` config binding 补 04 表格列 | 通常否 | 保留回指。 |
| inbound source binding 需要正式 carrier / adapter constructor / protocol | 是 | 保持 watch;后续若命中则暂停回 `03`。 |
| config center / admin override 要进入 P0 | 是 | 暂停回 `03` / 架构。 |
| secret provider / credential resolver schema 要在 P0 闭口 | 可能是 | Step 8 或回 `03`,R7.3 不补。 |
| runtime profile enum / typed ref / config struct 新字段必须新增 | 是 | 暂停回 `03` owning Step。 |
| 配置项改变 truth / state / query / job / replay / marker / public schema | 是且越界 | 立即拒绝。 |

### 9. R7.4 写入计划

`R7.4 SOP 问题回答与配置项候选:再写入` 应把 R7.3 思考落成可恢复记录:

1. 写当前模块目标和允许 / 禁止范围。
2. 写 SOP 十二问候选回答表。
3. 写配置域候选池。
4. 写配置项表格列填充策略。
5. 写模块拆分候选。
6. 写 JSON demo 策略候选。
7. 写 watch / redline 候选处理。
8. 写 03 影响预判。
9. 写 `R7.5 配置域 item family 候选展开:先思考` 入口。
10. 不写最终配置项清单、最终 key、最终默认值、最终 env var、正式 JSON demo、secret schema、测试、验收、实施或代码。

### 10. R7.3 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只推进 R7.3 一个模块 | pass | 未自动进入 R7.4。 |
| 是否围绕 SOP 十二问形成候选思考 | pass | 已覆盖名称/类型/默认值、必填、来源/作用域、生效/敏感/失败、关联模块、JSON demo、回指和停审审计。 |
| 是否形成配置域候选池 | pass | 已按 Step 3 配置域形成 item family 候选方向。 |
| 是否避免最终配置项清单 | pass | 未写最终 key、默认值、env var 或正式 JSON demo。 |
| 是否保留 watch 项 | pass | inbound source binding 保持 pass_with_watch;config center / admin override 保持 watch_only。 |
| 是否形成 R7.4 写入计划 | pass | 下一模块为 `R7.4 SOP 问题回答与配置项候选:再写入`。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.4 SOP 问题回答与配置项候选:再写入`;只允许把 R7.3 思考落成 SOP 十二问候选回答、配置域候选池、配置项表格列填充策略、模块拆分候选、JSON demo 策略候选、watch / redline 候选处理、03 影响预判和 R7.5 入口;不得创建正式 `04-配置设计.md`;不得写最终配置项清单、最终 key、最终默认值、最终环境变量名、正式模块 JSON demo、完整配置 demo、secret provider schema、测试方案、验收标准、实施计划或代码。

---

## R7.4 SOP 问题回答与配置项候选:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 将 R7.3 的 SOP 十二问、配置域候选池、表格列填充策略、模块拆分、JSON demo 策略、watch / redline 和 03 影响预判固化为可恢复记录。 |
| 本模块允许 | 写入候选回答、候选池、表格列策略、模块拆分候选、JSON demo 策略、watch / redline 候选处理、03 影响预判和 R7.5 入口。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写最终配置项清单、最终 key、最终默认值、最终环境变量名、正式模块 JSON demo、完整配置 demo、secret provider schema、测试方案、验收标准、实施计划或代码。 |
| 当前恢复依据 | R7.3 已完成 SOP 十二问候选思考和 R7.4 写入计划,用户已确认进入 R7.4。 |

### 2. SOP 十二问候选回答记录

| SOP 问题 | R7.4 候选记录 | 当前状态 | 后续去向 |
|---|---|---|---|
| 每个 P0 配置项的名称、类型、默认值是什么? | 先按配置域形成 item family 候选,再逐 family 细化语义名、类型族和默认值策略。 | candidate | R7.5 / R7.6 |
| 哪些配置项必填? | 按 startup required、enabled target required、job-run-start required、entry-local required、optional disabled 分层。 | candidate | R7.5 / R7.8 |
| 每个配置项从哪里来、作用域是什么? | 普通链为 defaults / file / env;entry-local、job input、fixture、secret ref 必须分域生效。 | candidate | R7.5 / R7.8 |
| 每个配置项如何生效、是否敏感、失败策略是什么? | 生效方式按 startup freeze、job-run-start freeze、entry-local only、test harness only;敏感先标 ref-sensitive / secret-not-config;失败策略先候选化。 | candidate | R7.5 / Step 8 / Step 9 |
| 每个配置项关联哪些模块? | 关联模块必须按功能域写,不能把不同功能揉进 `common`、`misc`、泛化 `runtime`。 | candidate | R7.5 / R7.10 |
| 每个模块的 JSON demo 应该如何写? | 模块 demo 等候选项停审后再写;demo 下方必须有逐项说明表。 | deferred_candidate | R7.9+ |
| 模块拆分是否按功能边界展开? | 采用 runtime-assembly、repository-material、external-source、publication-handoff、query-read-policy、operations-job、diagnostics-redaction、downstream-handoff 的候选拆分。 | candidate | R7.5 / R7.10 |
| 项目本地配置是否避免重复项目名前缀? | 候选为项目内部配置避免重复项目名前缀;若系统级聚合需要 `<project_key>.<module>.<setting>` 映射,后续单独说明。 | candidate | R7.7+ |
| 完整配置 demo 是否需要文档注释? | 候选为正式文档可用 JSONC 注释说明,实际运行 JSON 必须去注释。 | deferred_candidate | R7.9+ |
| 每个配置项是否回指 Step 3/4/5/6? | 每个候选项都必须回指控制面、分类 / 更新时机、来源规则和 profile。 | candidate | R7.5+ |
| 每个配置域配置项完成后是否通过停审? | 每个配置域必须检查必填性、来源、失败策略、敏感级别、watch 和 03 影响。 | candidate | R7.8+ |
| 所有配置项完成后是否存在重复项或缺口? | 跨项审计覆盖重复语义、泛化模块、必填缺失败策略、敏感级别未归类、P1/P2 污染和 03 影响未判定。 | candidate | R7.11+ |

### 3. 配置域候选池记录

| 配置域候选 | item family 候选方向 | 适用边界 | 当前处理 |
|---|---|---|---|
| runtime profile and entry readiness | profile identity、entry readiness、feature / adapter availability summary。 | startup / entry-local;P0 profile 限 local-dev、ci-test、integration-like、operations-replay。 | candidate |
| repository and material store binding | repository adapter slot、material store slot、store availability、test fixture store。 | startup;test fixture only local / CI。 | candidate |
| external source and resolver binding | source adapter slot、resolver adapter slot、availability branch、safe ref boundary。 | startup;entry-local selector only if formally allowed。 | candidate |
| inbound source binding | inbound source profile、transport / idempotency channel、body-free validation。 | startup;`pass_with_watch`。 | watch_candidate |
| event publisher and handoff target binding | publisher target、handoff target、target availability、blocked / unavailable branch。 | startup / job-run-start。 | candidate |
| query and read material policy handles | page/body limit、freshness threshold、read availability source、entry-local selector。 | startup / entry-local;query no-write redline。 | candidate |
| operations job runner policy | batch、retry、lease、checkpoint、report target、run-scoped diagnostic。 | job-run-start freeze。 | candidate |
| safe diagnostics and redaction | redaction profile、safe issue reporting、diagnostic sink、runtime unavailable marker。 | startup / entry-local diagnostic selector。 | candidate |
| downstream handoff | configuration matrix、redline、implementation gate 输入和 report root 方向。 | downstream owner;不反向定义 TC / AC / commit。 | candidate |
| config center / admin override | remote config source、operator override、live override 方向。 | P1/P2 watch_only;不进 P0 清单。 | excluded_from_P0 |

### 4. 配置项表格列填充策略记录

| 表格列 | R7.4 候选策略 | 后续检查 |
|---|---|---|
| 配置项 | 先写稳定语义名候选,不在本模块决定最终 key。 | 名称不得重复项目名前缀或产品名。 |
| 类型 | 使用 enum/ref/bool/int/duration/path-like/safe-text 等明确类型族。 | 不允许只写 `string` / `number`。 |
| 默认值 | 区分 safe default、no default、disabled candidate、profile-derived candidate。 | 默认值不得绕过 required adapter / target。 |
| 是否必填 | 按 startup、enabled target、job-run-start、entry-local、optional disabled 分层。 | P1/P2 direction 不得变成 P0 required。 |
| 来源 | 普通链、secret ref、entry-local、job input、fixture 分域表达。 | config center / admin override 不进入 P0。 |
| 作用域 | startup、job-run-start、entry-local、test-only、downstream-owner。 | entry-local 不覆盖全局配置。 |
| 生效方式 | cold startup freeze、job-run-start freeze、current entry only、test harness only。 | 不写核心 hot runtime update。 |
| 敏感级别 | public / internal / sensitive-ref / secret-not-config 候选。 | raw secret / token / credential body 不作为配置项。 |
| 失败策略 | startup fail-fast、job rejected、entry rejected、disabled branch、safe degraded / unavailable。 | 非法高优先级值不得 silent fallback。 |
| 关联模块 | 使用功能域模块名候选。 | 禁止泛化桶混写。 |

### 5. 模块拆分候选记录

| 模块候选 | 主要承载 | 拆分理由 | 当前状态 |
|---|---|---|---|
| runtime-assembly | profile、entry readiness、adapter availability summary。 | 对应 runtime builder 和 entry precheck。 | candidate |
| repository-material | repository / material store adapter 与 availability。 | 区分 truth store binding 和 query/read policy。 | candidate |
| external-source | external source / resolver adapter、safe ref、unavailable branch。 | 区分 source / resolver 与 publisher / handoff target。 | candidate_with_watch |
| publication-handoff | publisher target、handoff target、blocked / unavailable branch。 | delivery / handoff 不证明 local truth。 | candidate |
| query-read-policy | page / body / freshness / read availability policy。 | query 只读,不得 repair。 | candidate |
| operations-job | batch / retry / lease / checkpoint / report target。 | job-run-start freeze,不修 core truth。 | candidate |
| diagnostics-redaction | redaction profile、safe diagnostic、redacted artifact direction。 | 安全输出和敏感边界集中停审。 | candidate |
| downstream-handoff | 测试 / 验收 / 实施承接输入。 | 只给后续文档承接,不反向定义下游。 | candidate |

### 6. JSON demo 策略候选记录

| demo 层级 | R7.4 候选策略 | 当前状态 |
|---|---|---|
| 模块级 demo | 每个功能模块后续各自给最小示例,并紧跟逐项说明表。 | deferred |
| 完整配置 demo | 配置项候选完成、去重和停审后再汇总。 | deferred |
| JSONC 注释 | 正式文档可用 JSONC 解释,但必须声明运行 JSON 去注释。 | candidate |
| profile demo | 只按 profile 差异解释配置组合,不复制 Step 6 profile 矩阵。 | deferred |

### 7. watch / redline 候选处理记录

| 项 | R7.4 固定处理 | 后续触发 |
|---|---|---|
| inbound source binding | 保持 `pass_with_watch`;可以进入 item family 候选,但不得关闭为 final pass。 | 若需要 formal carrier / adapter constructor / protocol,回 `03`。 |
| config center | 保持 `watch_only`;不进入 P0 配置项候选。 | 若要求 P0 remote config,回 `03` / 架构。 |
| admin override | 保持 `watch_only`;不进入 P0 配置项候选。 | 若要求 live override / rollback / audit contract,回 `03`。 |
| true secret provider schema | Step 7 不写 provider schema。 | Step 8 或 `03`。 |
| true endpoint / bus / report target schema | 不锁 URL、topic、bucket、产品或 credential body。 | Step 8 / Step 13 / 后续运维。 |
| forbidden boundary | 任一配置项不得覆盖 truth owner、state transition、query no-write、job no-truth-repair、body-free、stored replay、transaction boundary、marker source、public schema 或 P0/P1 隔离。 | 命中即拒绝。 |
| old material | 旧 MethodContent / publish / snapshot / outbox 不回流。 | R7 跨项审计继续检查。 |

### 8. 对 03 的影响预判记录

| 候选结论 | 是否影响 03 | R7.4 处理 |
|---|---|---|
| 按 Step 3~6 既有控制面整理 item family | 否 | 可进入 R7.5 展开。 |
| 给已有 `03` config binding 补 04 表格列 | 通常否 | 保留正式回指。 |
| inbound source binding 需要正式 carrier / adapter constructor / protocol | 是 | 继续 watch,命中时暂停回 `03`。 |
| config center / admin override 要进入 P0 | 是 | 暂停回 `03` / 架构。 |
| secret provider / credential resolver schema 要在 P0 闭口 | 可能是 | Step 8 或回 `03`,R7.4 不补。 |
| runtime profile enum / typed ref / config struct 新字段必须新增 | 是 | 暂停回 `03` owning Step。 |
| 配置项改变 truth / state / query / job / replay / marker / public schema | 是且越界 | 立即拒绝。 |

### 9. R7.5 入口记录

| 下一模块 | 允许内容 | 禁止内容 |
|---|---|---|
| `R7.5 配置域 item family 候选展开:先思考` | 围绕 R7.4 的配置域候选池,逐域思考 item family、表格列候选、模块归属、来源 / profile 回指、watch / redline 和 03 影响预判。 | 不写最终配置项清单、最终 key、最终默认值、最终环境变量名、正式 JSON demo、完整配置 demo、secret provider schema、测试方案、验收标准、实施计划或代码。 |

### 10. R7.4 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只推进 R7.4 一个模块 | pass | 未自动进入 R7.5。 |
| 是否把 R7.3 思考落成可恢复记录 | pass | 已写 SOP 十二问、配置域候选池、表格列策略、模块拆分、JSON demo 策略、watch / redline 和 03 影响预判。 |
| 是否仍停留在候选层 | pass | 未写最终配置项清单、最终 key、默认值、env var 或正式 JSON demo。 |
| 是否保留 watch 项 | pass | inbound source binding 保持 pass_with_watch;config center / admin override 保持 watch_only。 |
| 是否形成 R7.5 入口 | pass | 下一模块为 `R7.5 配置域 item family 候选展开:先思考`。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.5 配置域 item family 候选展开:先思考`;只允许围绕 R7.4 的配置域候选池逐域思考 item family、表格列候选、模块归属、来源 / profile 回指、watch / redline 和 03 影响预判;不得创建正式 `04-配置设计.md`;不得写最终配置项清单、最终 key、最终默认值、最终环境变量名、正式模块 JSON demo、完整配置 demo、secret provider schema、测试方案、验收标准、实施计划或代码。

---

## R7.5 配置域 item family 候选展开:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 在 R7.4 的配置域候选池基础上,先按配置域思考 item family 的候选边界、后续表格列、模块归属、来源 / profile 回指、watch / redline 和 `03-详细设计.md` 影响预判。 |
| 本模块允许 | 只写 item family 候选思考、分组策略、表格列准备、后续 R7.6 写入计划和停审记录。 |
| 本模块禁止 | 不写最终配置项清单、最终配置 key、默认值、环境变量名、正式 JSON demo、完整配置 demo、secret provider schema、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | 用户已确认从 R7.4 进入 R7.5;R7.4 已完成 SOP 十二问和配置域候选池记录。 |

### 2. 展开原则思考

| 原则 | R7.5 思考 |
|---|---|
| 先 family 后 item | R7.5 只把配置域拆成 item family,避免直接写字段级配置项导致 key / default 过早冻结。 |
| 先消费面后来源 | 每个 family 必须能回指 runtime builder、adapter availability、entry precheck、job runner、query surface 或 handoff 消费面。 |
| 先 P0 后 P1/P2 | `local-dev`、`ci-test`、`integration-like`、`operations-replay` 优先;staging-like / production-like 只作为方向和 watch。 |
| 先 body-free 后 secret | 当前只判断 secret ref family 是否存在,不展开 provider schema、credential body 或真实 secret resolver。 |
| 先 redline 后便利性 | 任何 family 若试图改变 truth owner、state transition、query no-write、job no-truth-repair、stored replay、transaction boundary、marker source、public schema 或 P0/P1 隔离,直接排除。 |
| 先 03 回指后 04 表格 | 若 family 需要新增 formal carrier / config struct / adapter constructor / port / DTO / mapper,必须先回 `03` 或停审,不能在 04 私补。 |

### 3. 配置域 item family 候选思考

| 配置域 | item family 候选 | 候选理由 | 归属模块 | 处理状态 |
|---|---|---|---|---|
| runtime profile and entry readiness | profile identity family;entry readiness policy family;adapter availability summary family;feature / peripheral enablement family | 启动时必须知道当前 profile、哪些外围可用、哪些入口可放行,但不应把业务规则变成配置。 | runtime-assembly | candidate |
| repository / material store | repository adapter slot family;material store slot family;store availability family;test fixture store family | 需要区分 truth repository、read material、fixture 与 unavailable 分支,并保持 P0 无真实外部产品前置。 | repository-material | candidate |
| external source / resolver | source adapter slot family;resolver adapter slot family;source availability branch family;safe source ref family | 承接外部来源、解析器和 unavailable / unrecognized 分支,但不定义真实 provider schema。 | external-source | candidate |
| inbound source binding | inbound source profile family;transport binding family;idempotency channel family;body-free validation family | Step 3 标记为 `pass_with_watch`;可作为候选,但后续若需要 formal carrier 或协议字段必须回 `03`。 | external-source | watch_candidate |
| event publisher / handoff target | publisher target family;handoff target family;target availability family;blocked / unavailable branch family | 需要支撑 publish / handoff 的可用性、目标 ref 和 fail-fast / degraded 分支,但不锁真实 topic / endpoint。 | publication-handoff | candidate |
| query / read policy | page limit family;body limit family;freshness threshold family;read availability source family;entry-local read selector family | Query 需要安全分页、body-free、freshness 和 read availability,但不得允许 query 写 truth 或绕开 visibility / marker 来源。 | query-read-policy | candidate |
| operations job runner | batch size family;retry policy family;lease / checkpoint family;report target family;run-scoped diagnostic family | Operations job 需要可控批量、重试、checkpoint 和报告方向,但不得配置化 truth repair 或跨越正式 job scope。 | operations-job | candidate |
| diagnostics / redaction | redaction profile family;safe diagnostic sink family;safe issue reporting family;redacted artifact family | 配置需要承接 safe message、redaction 和 artifact 输出,但不能泄漏 body、secret 或 raw material。 | diagnostics-redaction | candidate |
| downstream handoff | configuration handoff matrix family;implementation gate input family;report root direction family;handoff notes family | Step 12 需要把已确认配置项交给测试、验收、实施和运维,但不提前写后续计划正文。 | downstream-handoff | candidate |
| config center / admin override | remote config source family;operator override family;live override family | Step 5 已判定为 `watch_only`;当前不进入 P0 item family,只保留未来观察项。 | excluded / future-watch | excluded_from_P0 |

### 4. 表格列候选思考

| 后续列 | R7.5 预处理方式 | R7.6 前限制 |
|---|---|---|
| 配置项 | 先以 family 名称占位,后续 R7.6 再决定是否拆到 item 粒度。 | 不写最终 key。 |
| 类型 | 只思考需要 scalar / enum-like / ref / list / object-like 哪类表达。 | 不定义正式类型名。 |
| 默认值 | 只判断是否允许 code default 或必须显式配置。 | 不写默认值字面量。 |
| 是否必填 | 只判断 profile / entry / job 级别必填方向。 | 不写最终 required 矩阵。 |
| 来源 | 回指 Step 5 source chain、secret ref、entry-local、fixture 或 watch_only。 | 不写环境变量名。 |
| 作用域 | 区分 startup、job-run-start、entry-local、test fixture、diagnostic / handoff。 | 不新增 profile enum。 |
| 生效方式 | 初步区分 startup-only、run-start-only、entry-local-only、test-only。 | 不写热更新或 live override。 |
| 敏感级别 | 只标记 secret-ref / safe-ref / non-sensitive 方向。 | 不写 credential schema。 |
| 失败策略 | 初步区分 fail-fast、unavailable、blocked、degraded、test-only fail。 | 不新增错误 DTO。 |
| 关联模块 | 绑定 runtime、repository、external、query、job、diagnostics、handoff。 | 不写代码包路径或实施 commit。 |

### 5. family 到后续模块分工思考

| 后续模块 | 承接 family | 输出边界 |
|---|---|---|
| R7.6 再写入 | 写入本轮 family 候选表、表格列候选和分工记录。 | 仍不写最终 item 清单。 |
| R7.7 / R7.8 | runtime / repository / external source family 细化。 | 逐域讨论是否能成为正式配置项。 |
| R7.9 / R7.10 | publisher / query / job family 细化。 | 保持 query no-write 和 job no-truth-repair 红线。 |
| R7.11 / R7.12 | diagnostics / handoff / excluded watch family 细化。 | 不提前写 Step 8 secret schema 或 Step 12 handoff 正文。 |
| R7 后段 | 总表、域批次表、模块 JSON demo、完整 demo、停审和审计。 | 必须基于已确认 item,不能从 family 直接生成正式文档。 |

### 6. watch / redline 思考

| watch / redline | R7.5 处理 | R7.6 写入要求 |
|---|---|---|
| inbound source binding | 保持 `pass_with_watch`;可列 family,不得关闭为 final pass。 | 写明命中 formal carrier / adapter constructor / protocol 时回 `03`。 |
| config center / admin override | 保持 `watch_only`;不进入 P0 item family。 | 写入 excluded / future-watch,不得混入 source chain。 |
| secret provider schema | 只保留 secret ref family 方向。 | 不写 provider 字段、credential body 或 resolver contract。 |
| true endpoint / bus / report target | 只保留 target ref / availability / blocked family。 | 不锁真实 URL、topic、bucket、产品名或 credential。 |
| query no-write | query policy family 只能影响 read limits / availability / freshness。 | 不写任何允许 query 写 truth 的配置。 |
| job no-truth-repair | operations job family 只能控制 runner / retry / checkpoint / report。 | 不写 truth repair 或跨 scope 修复开关。 |
| marker source | diagnostics / read policy 不得合成 marker 来源。 | 若需要新 marker source,暂停回 `03`。 |
| P0/P1 隔离 | P0 只服务 local / CI / integration / replay。 | staging / production 只写 direction / watch。 |

### 7. 对 03 的影响预判

| 预判项 | 是否影响 03 | 处理 |
|---|---|---|
| family 仅回指已有 runtime builder / adapter availability / handoff owner | 否 | 可在 R7.6 写候选记录。 |
| family 需要新增正式 config struct 字段、typed ref、adapter constructor 参数 | 是 | 暂停并回 `03` owning step。 |
| family 需要新增 secret provider / credential resolver schema | 可能是 | 当前延后到 Step 8 或回 `03`;R7 不私补。 |
| family 需要新增 query / job / handoff public DTO 字段 | 是 | 暂停回 `03`,不得在 04 表格中发明。 |
| family 只是说明 source chain、profile 适用性和失败策略 | 通常否 | 作为 04 配置项表格候选。 |

### 8. R7.6 写入计划

| 写入项 | 计划内容 | 禁止内容 |
|---|---|---|
| family 候选表 | 按配置域写入 item family、候选理由、归属模块和处理状态。 | 不写最终 item key。 |
| 表格列候选 | 写入后续配置项表格列的填充策略。 | 不写默认值、env var 或正式类型。 |
| 模块分工 | 写入 R7 后续模块如何细化 family。 | 不提前完成后续模块。 |
| watch / redline | 写入 pass_with_watch、watch_only、excluded_from_P0 和暂停条件。 | 不把 watch 项升级为 P0。 |
| 03 影响 | 写入需要回 `03` 的触发条件。 | 不在 04 私补 schema / port / mapper / DTO。 |

### 9. R7.5 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只推进 R7.5 一个模块 | pass | 未自动进入 R7.6。 |
| 是否保持“先思考” | pass | 只写 family 展开思考和后续写入计划。 |
| 是否未写最终配置项 | pass | 未写最终 key、默认值、env var、正式 JSON demo 或完整 demo。 |
| 是否保留 watch 项 | pass | inbound source binding 保持 `pass_with_watch`;config center / admin override 保持 `watch_only`。 |
| 是否形成 R7.6 入口 | pass | 下一模块为 `R7.6 配置域 item family 候选展开:再写入`。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.6 配置域 item family 候选展开:再写入`;只允许把 R7.5 的配置域 item family 候选、表格列候选、模块分工、watch / redline 和 03 影响预判写成可恢复记录;不得创建正式 `04-配置设计.md`;不得写最终配置项清单、最终 key、最终默认值、最终环境变量名、正式模块 JSON demo、完整配置 demo、secret provider schema、测试方案、验收标准、实施计划或代码。

---

## R7.6 配置域 item family 候选展开:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 将 R7.5 的 item family 候选思考固化为可恢复记录,作为后续逐域配置项细化的输入。 |
| 本模块允许 | 写入配置域 family 候选记录、表格列填充策略、后续模块切片、watch / redline 处理、03 影响预判和 R7.7 入口。 |
| 本模块禁止 | 不写最终配置项清单、最终配置 key、默认值、环境变量名、正式 JSON demo、完整配置 demo、secret provider schema、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | 用户已确认进入 R7.6;R7.5 已完成配置域 item family 候选展开思考。 |

### 2. 固化原则记录

| 原则 | R7.6 固化口径 |
|---|---|
| family 不是 final item | 本节所有 family 均为候选分组,用于后续逐域拆解配置项;不得直接当作最终 key 或最终配置项。 |
| 消费面优先 | 每个 family 后续必须回指 `03` 中已有 runtime builder、adapter availability、entry precheck、job runner、query surface 或 handoff 消费面。 |
| P0 优先 | 当前只为 `local-dev`、`ci-test`、`integration-like`、`operations-replay` 组织 P0 candidate;staging-like / production-like 只保留方向。 |
| redline 优先 | family 不能改变 truth owner、state transition、query no-write、job no-truth-repair、body-free、stored replay、transaction boundary、marker source、public schema 或 P0/P1 隔离。 |
| schema 不私补 | 若 family 需要新增 formal config struct、port、adapter constructor、DTO、mapper、marker 或 schema,必须回 `03` 或暂停。 |

### 3. 配置域 item family 候选记录

| 配置域 | item family 候选 | 主要消费面 | 来源 / profile 回指 | 当前裁决 |
|---|---|---|---|---|
| runtime profile and entry readiness | profile identity family;entry readiness policy family;adapter availability summary family;feature / peripheral enablement family | runtime builder;entry precheck;adapter availability summary | Step 5 ordinary chain;Step 6 P0 profiles | candidate_for_R7.7 |
| repository / material store | repository adapter slot family;material store slot family;store availability family;test fixture store family | repository adapter;material store adapter;fake / fixture runtime | ordinary chain;fixture source;local / CI / integration | candidate_for_R7.7 |
| external source / resolver | source adapter slot family;resolver adapter slot family;source availability branch family;safe source ref family | external resolver port;adapter availability;safe source refs | ordinary chain;secret ref direction;integration-like | candidate_for_R7.7 |
| inbound source binding | inbound source profile family;transport binding family;idempotency channel family;body-free validation family | inbound consumer boundary;body-free validation;dedup surface | Step 3 `pass_with_watch`;Step 5 no config center | watch_candidate |
| event publisher / handoff target | publisher target family;handoff target family;target availability family;blocked / unavailable branch family | publisher adapter;handoff adapter;target registry | ordinary chain;target ref direction;integration / replay | candidate_for_R7.9 |
| query / read policy | page limit family;body limit family;freshness threshold family;read availability source family;entry-local read selector family | query facade;read material surface;entry-local request | ordinary chain;entry-local;P0 profiles | candidate_for_R7.9 |
| operations job runner | batch size family;retry policy family;lease / checkpoint family;report target family;run-scoped diagnostic family | jobs runner;checkpoint;report boundary;diagnostic sink | ordinary chain;job-run-start;operations-replay | candidate_for_R7.9 |
| diagnostics / redaction | redaction profile family;safe diagnostic sink family;safe issue reporting family;redacted artifact family | safe diagnostic;redaction boundary;artifact/report shell | ordinary chain;safe ref;no raw body | candidate_for_R7.11 |
| downstream handoff | configuration handoff matrix family;implementation gate input family;report root direction family;handoff notes family | Step 12 config handoff;future 05/06/07 input | downstream direction only | candidate_for_R7.11 |
| config center / admin override | remote config source family;operator override family;live override family | none in P0 | Step 5 `watch_only` | excluded_from_P0 |

### 4. 配置项表格列填充策略记录

| 后续列 | 当前填充策略 | 禁止事项 |
|---|---|---|
| 配置项 | 后续从 family 拆出语义清晰的候选配置项。 | 不用 family 名称伪装最终 key。 |
| 类型 | 后续只在已有 `03` 消费面支持的类型族内选择。 | 不新增正式 enum / ref / object schema。 |
| 默认值 | 后续区分 code default、no-default required、test fixture default。 | 不在 R7.6 写默认值字面量。 |
| 是否必填 | 后续按 startup、enabled target、job-run-start、entry-local 和 fixture 分层。 | 不写一刀切 required。 |
| 来源 | 后续回指 Step 5 ordinary chain、secret ref、entry-local、fixture 或 watch_only。 | 不写 config center / admin override 为 P0 来源。 |
| 作用域 | 后续绑定 startup、job-run-start、entry-local、test-only、diagnostic 或 handoff。 | 不新增超出 Step 4 的作用域。 |
| 生效方式 | 后续区分 startup-only、run-start-only、entry-local-only、test-only。 | 不写 hot reload / live override。 |
| 敏感级别 | 后续标记 non-sensitive、safe-ref、secret-ref direction。 | 不写 credential body 或 raw secret。 |
| 失败策略 | 后续在 fail-fast、blocked、unavailable、degraded、test-only fail 中选择。 | 不新增 error DTO 或 public marker。 |
| 关联模块 | 后续使用 runtime、repository、external、publisher、query、job、diagnostics、handoff 等模块名。 | 不写代码路径、commit 或 implementation scope。 |

### 5. 后续模块切片记录

| 后续模块 | 处理 family | 模块目标 | 停审要求 |
|---|---|---|---|
| R7.7 / R7.8 | runtime profile and entry readiness;repository / material store;external source / resolver;inbound source binding watch | 思考并写入第一批基础 runtime / storage / external family 是否可拆成正式候选配置项。 | 若需要新增 `03` carrier / adapter constructor / port,暂停。 |
| R7.9 / R7.10 | event publisher / handoff target;query / read policy;operations job runner | 思考并写入 publisher、query、job family 的候选配置项边界。 | 保持 query no-write、job no-truth-repair、handoff 不回滚 truth。 |
| R7.11 / R7.12 | diagnostics / redaction;downstream handoff;config center / admin override excluded watch | 思考并写入 diagnostic / handoff family 与 watch 排除记录。 | 不提前写 Step 8 secret schema 或 Step 12 下游承接正文。 |
| R7 后段 | 配置项总表、域批次表、模块 JSON demo、完整 demo、停审、审计 | 基于已确认候选项形成配置清单草稿。 | 不从未确认 family 直接生成正式 `04`。 |

### 6. watch / redline 固化记录

| 项 | R7.6 裁决 | 后续触发 |
|---|---|---|
| inbound source binding | 保持 `pass_with_watch`;进入 R7.7 第一批讨论但不得 final pass。 | 命中 formal carrier / protocol / adapter constructor 时回 `03`。 |
| config center | 保持 `watch_only`;不进入 P0 family。 | 若要求 P0 remote config,回架构 / `03`。 |
| admin override | 保持 `watch_only`;不进入 P0 family。 | 若要求 live override / rollback / audit contract,回 `03`。 |
| secret provider schema | 不在 R7.6 展开。 | Step 8 或 `03` owning step。 |
| endpoint / topic / URL / product binding | 不在 R7.6 锁定。 | Step 8 / Step 13 / 后续运维承接。 |
| marker source | 不允许由配置项合成 marker。 | 需要新 marker source 时回 `03`。 |
| old material | 旧 MethodContent / publish / snapshot / outbox 不回流。 | 后续每批候选继续审计。 |

### 7. 对 03 的影响预判记录

| 影响类型 | 当前结论 | 处理口径 |
|---|---|---|
| 仅说明已有 config binding 的来源、profile、失败策略 | 不影响 `03` | 可继续 R7.7。 |
| 需要新增 runtime config struct 字段或 typed ref | 影响 `03` | 暂停并回 Step 14 / owning design source。 |
| 需要新增 adapter constructor、port、mapper、DTO 或 public surface | 影响 `03` | R7 不私补。 |
| 需要新增 secret provider / credential resolver schema | 可能影响 `03` | Step 8 再判定;R7.6 不闭口。 |
| 试图配置化 forbidden boundary | 越界 | 直接拒绝,不进入配置项。 |

### 8. R7.7 入口记录

| 下一模块 | 允许内容 | 禁止内容 |
|---|---|---|
| `R7.7 runtime / repository / external source family 细化:先思考` | 围绕 runtime profile、repository / material store、external source / resolver、inbound source binding watch 进行第一批 family 细化思考,判断是否可拆为候选配置项。 | 不写最终配置项清单、最终 key、默认值、环境变量名、正式 JSON demo、完整配置 demo、secret provider schema、测试方案、验收标准、实施计划或代码。 |

### 9. R7.6 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只推进 R7.6 一个模块 | pass | 未自动进入 R7.7。 |
| 是否只固化 R7.5 思考 | pass | 写入 family 候选、列策略、模块切片、watch / redline 和 03 影响记录。 |
| 是否仍未写最终配置项 | pass | 未写最终 key、默认值、env var、JSON demo 或完整配置 demo。 |
| 是否保持 watch / excluded | pass | inbound source binding 仍为 `pass_with_watch`;config center / admin override 仍为 `watch_only` / `excluded_from_P0`。 |
| 是否形成 R7.7 入口 | pass | 下一模块为 `R7.7 runtime / repository / external source family 细化:先思考`。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.7 runtime / repository / external source family 细化:先思考`;只允许围绕 runtime profile、repository / material store、external source / resolver、inbound source binding watch 进行第一批 family 细化思考,判断是否可拆为候选配置项;不得创建正式 `04-配置设计.md`;不得写最终配置项清单、最终 key、最终默认值、最终环境变量名、正式模块 JSON demo、完整配置 demo、secret provider schema、测试方案、验收标准、实施计划或代码。

---

## R7.7 runtime / repository / external source family 细化:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 思考第一批基础 family:runtime profile and entry readiness、repository / material store、external source / resolver、inbound source binding watch 是否可拆为后续候选配置项。 |
| 本模块允许 | 只记录 family 细化思考、候选拆分条件、非候选 / watch 条件、来源 / profile 回指、03 影响预判和 R7.8 写入计划。 |
| 本模块禁止 | 不写最终配置项清单、最终 key、默认值、环境变量名、正式 JSON demo、完整配置 demo、secret provider schema、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | 用户已确认进入 R7.7;R7.6 已固化配置域 item family 候选和第一批 family 切片。 |

### 2. 上游约束思考

| 输入 | 对 R7.7 的约束 |
|---|---|
| `02-概要设计.md` §11 | 配置只影响 entry、store、read material、external、inbound、query、job、publisher / handoff、safe diagnostic 等装配语义,不得翻转 Query no-write、Job 不修 truth、Inbound body-free。 |
| `03-详细设计.md` §13 | `04` 接收具体 key、profile、secret、endpoint、topic、numeric values;不得在 Step 7 改对象、port、protocol、flow、state、persistence、recovery 或 idempotency semantics。 |
| `03` runtime builder | loader -> validate -> resolve slots -> assemble ports -> entry precheck 是既有顺序;R7.7 只能思考配置项如何喂给这些阶段。 |
| Step 5 来源 | 普通链仍是 code defaults / config file / env;secret 只传 ref;fixture 只用于 local / CI;config center / admin override 仍 watch_only。 |
| Step 6 profile | P0 仅围绕 local-dev、ci-test、integration-like、operations-replay;staging-like / production-like 不进入当前 required item。 |

### 3. runtime profile and entry readiness 思考

| family | 可拆候选方向 | 必须回指 | 暂停条件 |
|---|---|---|---|
| profile identity family | 可思考 profile 标识、profile 来源和 profile 合法性校验这一组配置项。 | Step 6 P0 profile 矩阵;Step 5 source chain;`03` runtime builder。 | 若需要新增正式 profile enum / typed ref 且 `03` 未定义,暂停回 `03`。 |
| entry readiness policy family | 可思考 entry precheck 是否需要读取 runtime readiness / adapter availability summary。 | `03` entry precheck;runtime availability marker。 | 若配置项改变 command/query/inbound/job 的可执行语义或绕过 facade,拒绝。 |
| adapter availability summary family | 可思考各 adapter slot 装配后的 availability summary 如何被 entry 复制。 | `03` adapter availability;safe blocked / degraded / unavailable mapping。 | 若配置项直接合成 marker 或把 raw adapter error 作为 public marker,暂停。 |
| feature / peripheral enablement family | 可思考外围能力 disabled / unavailable 的技术装配开关方向。 | `01/02` peripheral 不前置;`03` adapter availability。 | 若开关改变 truth owner、P0/P1 范围或正式业务生命周期,拒绝。 |

### 4. repository / material store 思考

| family | 可拆候选方向 | 必须回指 | 暂停条件 |
|---|---|---|---|
| repository adapter slot family | 可思考 truth repository slot 的选择、enabled / unavailable 和 fake / durable 方向。 | `03` Step 7 repository port;§10 persistence;§13 storage adapter binding。 | 若需要新增 repository method、private index、DDL 或 physical product schema,暂停。 |
| material store slot family | 可思考 read material / projection material store 的 slot 和 availability。 | `03` read / material surface;query no-write;material builder。 | 若配置让 Query 刷新、修复或创建 material,拒绝。 |
| store availability family | 可思考 repository unavailable、material unavailable、degraded 的 safe failure family。 | `03` port / infra unavailable mapping;runtime availability summary。 | 若从 config 字符串、fake map 或 raw error 合成 availability marker,暂停。 |
| test fixture store family | 可思考 local-dev / ci-test 下 fixture store 与 deterministic fake 的来源边界。 | Step 5 fixture source;Step 6 local / CI profile。 | 若 fixture 进入 integration-like / production-like required path 或改变 durable parity,拒绝。 |

### 5. external source / resolver 思考

| family | 可拆候选方向 | 必须回指 | 暂停条件 |
|---|---|---|---|
| source adapter slot family | 可思考 external source adapter slot、disabled / unavailable / degraded 技术装配。 | `03` external adapter;body-free boundary;safe source refs。 | 若需要真实 provider schema、URL、credential body 或 raw response body,延后 Step 8 / Step 13 或回 `03`。 |
| resolver adapter slot family | 可思考 resolver slot 与 resolver availability。 | `03` resolver port / adapter;formal summary / marker source。 | 若 resolver 输出 schema 未闭口而 R7 试图补字段,暂停。 |
| source availability branch family | 可思考 unavailable、unrecognized、blocked 的配置影响方向。 | `03` availability / degraded mapper;safe diagnostic。 | 若配置项改变 acceptance、formalization 或 external summary truth owner,拒绝。 |
| safe source ref family | 可思考 source ref / target ref / summary ref 的安全引用配置方向。 | `02/03` body-free source boundary;no raw body。 | 若配置项要求存 URL、payload、artifact body、secret value 或 provider response,拒绝。 |

### 6. inbound source binding watch 思考

| family | R7.7 处理 | watch 条件 |
|---|---|---|
| inbound source profile family | 可保留为 watch candidate,只讨论 source profile 与 P0 profile 的关系。 | 若需要正式 source profile carrier,回 `03`。 |
| transport binding family | 只作为后续 binding 方向,不写 topic / queue / product / URL。 | 若要求具体 transport schema,延后 Step 8 / Step 13 或回 `03`。 |
| idempotency channel family | 只能思考 dedup / idempotency channel 的配置影响方向。 | 若需要新增 idempotency key schema 或 stored receipt surface,回 `03`。 |
| body-free validation family | 只保留 body-free validation 的启用 / fail-fast 方向。 | 不允许配置绕过 body-free;若要求 raw payload pass-through,直接拒绝。 |

### 7. 第一批候选拆分判定

| 领域 | 可进入 R7.8 写入的内容 | 不能进入 R7.8 的内容 |
|---|---|---|
| runtime | profile 来源、entry readiness、adapter availability summary 的候选配置项方向。 | 最终 profile enum、正式 config struct、entry DTO、router schema。 |
| repository / material | store slot、availability、fixture / fake profile 的候选配置项方向。 | 数据库产品、DDL、SQL、索引、repository 新方法、private map。 |
| external source / resolver | adapter slot、resolver slot、safe source ref、availability branch 的候选方向。 | provider schema、secret body、endpoint、payload / response body、resolver 输出字段补口。 |
| inbound watch | pass_with_watch 的 source / transport / idempotency / body-free 方向。 | final pass、真实 transport schema、raw payload 入仓、config center / admin override。 |

### 8. 对 03 的影响预判

| 触发点 | 影响判断 | R7.7 处理 |
|---|---|---|
| 只是在 04 中说明已有 binding 的配置来源、作用域和失败策略 | 不影响 `03` | 可进入 R7.8 写入候选记录。 |
| 需要 runtime config struct、adapter constructor 或 typed ref 新字段 | 影响 `03` | R7.8 必须标 blocker,不能私补。 |
| 需要 repository / resolver / inbound 新 port 或新 mapper | 影响 `03` | 暂停回 `03` owning step。 |
| 需要 secret provider、transport product、endpoint / topic / URL schema | 可能影响 `03` 或 Step 8 / Step 13 | R7.7 不闭口,只保留方向。 |
| 任何配置项绕过 body-free、query no-write、job no-truth-repair、marker source | 越界 | 拒绝进入配置项。 |

### 9. R7.8 写入计划

| 写入项 | 计划内容 | 禁止内容 |
|---|---|---|
| runtime family 记录 | 写入 profile identity、entry readiness、adapter availability、feature / peripheral enablement 的候选拆分与限制。 | 不写最终 key、默认值、env var。 |
| repository / material family 记录 | 写入 repository adapter slot、material store slot、store availability、test fixture store 的候选拆分与限制。 | 不写数据库产品、DDL、SQL、index。 |
| external source / resolver 记录 | 写入 source adapter slot、resolver slot、availability branch、safe source ref 的候选拆分与限制。 | 不写 secret provider schema、endpoint、payload body。 |
| inbound watch 记录 | 写入 inbound source binding 仍为 `pass_with_watch` 的候选分支和暂停条件。 | 不把 watch 项升级为 final pass。 |
| 03 影响记录 | 写入 R7.7 判定出的回 `03` 条件。 | 不在 04 私补 schema / port / mapper。 |

### 10. R7.7 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只推进 R7.7 一个模块 | pass | 未自动进入 R7.8。 |
| 是否保持“先思考” | pass | 只写第一批 family 细化思考和 R7.8 写入计划。 |
| 是否未写最终配置项 | pass | 未写最终 key、默认值、env var、JSON demo 或完整 demo。 |
| 是否保持 inbound watch | pass | inbound source binding 仍为 `pass_with_watch`,未关闭为 final pass。 |
| 是否形成 R7.8 入口 | pass | 下一模块为 `R7.8 runtime / repository / external source family 细化:再写入`。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.8 runtime / repository / external source family 细化:再写入`;只允许把 R7.7 的 runtime profile、repository / material store、external source / resolver、inbound source binding watch 的 family 细化思考写成可恢复记录;不得创建正式 `04-配置设计.md`;不得写最终配置项清单、最终 key、最终默认值、最终环境变量名、正式模块 JSON demo、完整配置 demo、secret provider schema、测试方案、验收标准、实施计划或代码。

---

## R7.8 runtime / repository / external source family 细化:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 将 R7.7 的 runtime、repository / material、external source / resolver、inbound source binding watch 的 family 细化思考固化为后续配置项候选输入。 |
| 本模块允许 | 写入第一批 family 的候选拆分记录、限制条件、来源 / profile 回指、watch 裁决、03 影响记录和 R7.9 入口。 |
| 本模块禁止 | 不写最终配置项清单、最终 key、默认值、环境变量名、正式 JSON demo、完整配置 demo、secret provider schema、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | 用户已确认进入 R7.8;R7.7 已完成第一批 family 细化思考和 R7.8 写入计划。 |

### 2. 第一批固化边界

| 边界项 | R7.8 固化口径 |
|---|---|
| 配置项状态 | 本节只形成候选配置项方向,不是最终配置项清单。 |
| key / default | 本节不写最终 key、默认值、环境变量名或完整 JSON demo。 |
| `03` 回指 | 所有候选必须回指已有 runtime builder、adapter availability、repository / material port、external resolver 或 inbound body-free boundary。 |
| forbidden boundary | 配置不得改变 truth owner、state transition、query no-write、job no-truth-repair、body-free、stored replay、transaction boundary、marker source、public schema 或 P0/P1 隔离。 |
| watch 边界 | inbound source binding 继续 `pass_with_watch`;config center / admin override 继续 `watch_only`。 |

### 3. runtime profile and entry readiness family 候选拆分记录

| family | 候选配置项方向 | 来源 / profile 回指 | 当前裁决 | 限制 |
|---|---|---|---|---|
| profile identity family | profile 选择来源、profile 合法性校验、profile 到 P0 runtime 装配分支。 | Step 5 ordinary chain;Step 6 P0 profiles;`03` runtime builder。 | candidate_direction | 不写最终 profile enum / key;若需要正式 typed ref,回 `03`。 |
| entry readiness policy family | entry precheck 读取 runtime readiness 和 adapter availability summary 的方向。 | `03` entry precheck;runtime availability marker;startup / entry-local。 | candidate_direction | 不允许绕过 facade 或改变 command/query/inbound/job 可执行语义。 |
| adapter availability summary family | adapter slot 装配结果如何汇总为 ready / blocked / degraded / unavailable。 | `03` adapter availability;safe blocked / degraded / unavailable mapping。 | candidate_direction | 不允许从 raw adapter error、config 字符串或 fake map 合成 public marker。 |
| feature / peripheral enablement family | 外围能力 disabled / unavailable 的技术装配方向。 | `01/02` peripheral 不前置;`03` adapter availability;Step 6 P0/P1 隔离。 | candidate_with_redline | 不允许开关改变 truth owner、业务生命周期或 P0/P1 范围。 |

### 4. repository / material store family 候选拆分记录

| family | 候选配置项方向 | 来源 / profile 回指 | 当前裁决 | 限制 |
|---|---|---|---|---|
| repository adapter slot family | truth repository slot、fake / durable 方向、repository unavailable 技术分支。 | `03` repository port;§10 persistence;Step 6 local / CI / integration。 | candidate_direction | 不写数据库产品、DDL、SQL、index 或 repository 新方法。 |
| material store slot family | read material / projection material store slot、material availability 分支。 | `03` read material surface;query no-write;material builder。 | candidate_direction | 不允许 query 通过配置刷新、修复或创建 material。 |
| store availability family | repository unavailable、material unavailable、degraded 的 safe failure branch。 | `03` port / infra unavailable mapping;runtime availability summary。 | candidate_direction | 不允许从 raw error 或配置字面量生成 availability marker。 |
| test fixture store family | local-dev / ci-test 的 deterministic fake / fixture store 来源方向。 | Step 5 fixture source;Step 6 local-dev / ci-test。 | candidate_test_only | fixture 不进入 production-like required path,不得破坏 fake / durable parity。 |

### 5. external source / resolver family 候选拆分记录

| family | 候选配置项方向 | 来源 / profile 回指 | 当前裁决 | 限制 |
|---|---|---|---|---|
| source adapter slot family | external source adapter slot、disabled / unavailable / degraded 技术装配。 | `03` external adapter;body-free boundary;integration-like direction。 | candidate_direction | 不写 provider schema、endpoint、credential body 或 raw response body。 |
| resolver adapter slot family | resolver slot、resolver availability、resolver unavailable 分支。 | `03` resolver port / adapter;formal summary / marker source。 | candidate_direction | resolver 输出字段未闭口时不得在 04 私补。 |
| source availability branch family | unavailable、unrecognized、blocked 与 safe diagnostic 的配置影响方向。 | `03` availability / degraded mapper;safe diagnostic boundary。 | candidate_direction | 不允许改变 external summary acceptance 或 formalization truth owner。 |
| safe source ref family | source ref、target ref、summary ref 的 safe binding direction。 | `02/03` body-free source boundary;Step 5 secret ref direction。 | candidate_direction | 不保存 URL、payload、artifact body、secret value 或 provider response。 |

### 6. inbound source binding watch 记录

| family | R7.8 裁决 | 后续处理 |
|---|---|---|
| inbound source profile family | 保持 watch candidate;只记录 source profile 与 P0 profile 的关系方向。 | 若需要正式 source profile carrier,回 `03`。 |
| transport binding family | 保持 watch candidate;只作为 transport binding 方向。 | 不写 topic、queue、product、URL;具体 schema 后移 Step 8 / Step 13 或回 `03`。 |
| idempotency channel family | 保持 watch candidate;只保留 dedup / idempotency channel 的配置影响方向。 | 若需要新增 idempotency key schema 或 stored receipt surface,回 `03`。 |
| body-free validation family | 可作为 required redline direction;配置不得关闭 body-free 校验。 | raw payload pass-through 直接拒绝。 |

### 7. 第一批候选裁决表

| 领域 | 当前裁决 | 进入后续条件 |
|---|---|---|
| runtime | 可继续作为 candidate_direction 进入后续配置项总表候选池。 | R7 后段需补类型、默认值、必填、来源、作用域、生效方式、敏感级别、失败策略和关联模块。 |
| repository / material | 可继续作为 candidate_direction / candidate_test_only 进入候选池。 | 必须保持 repository / material adapter 边界,不得写 physical store schema。 |
| external source / resolver | 可继续作为 candidate_direction 进入候选池。 | secret/provider/endpoint/schema 后移 Step 8 / Step 13 或回 `03`。 |
| inbound source binding | 仅作为 watch_candidate / required redline direction 保留。 | 不能升级为 final pass;缺 formal carrier 时必须回 `03`。 |

### 8. 对 03 的影响记录

| 影响类型 | R7.8 记录 | 处理 |
|---|---|---|
| 说明已有 runtime / adapter / repository / resolver binding 的配置来源和失败策略 | 不影响 `03` | 可进入后续候选池。 |
| 新增 runtime config struct、profile enum、adapter constructor、typed ref | 影响 `03` | 当前不补;后续命中即暂停。 |
| 新增 repository / resolver / inbound port 或 mapper | 影响 `03` | 当前不补;回 owning design source。 |
| secret provider、transport product、endpoint / topic / URL schema | 可能影响 `03` / Step 8 / Step 13 | 当前只保留方向,不闭口。 |
| 绕过 body-free、query no-write、job no-truth-repair 或 marker source | 越界 | 拒绝进入配置项。 |

### 9. R7.9 入口记录

| 下一模块 | 允许内容 | 禁止内容 |
|---|---|---|
| `R7.9 publisher / query / operations job family 细化:先思考` | 围绕 event publisher / handoff target、query / read policy、operations job runner 三组 family 进行候选拆分思考,判断是否可进入后续配置项候选池。 | 不写最终配置项清单、最终 key、默认值、环境变量名、正式 JSON demo、完整配置 demo、secret provider schema、测试方案、验收标准、实施计划或代码。 |

### 10. R7.8 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只推进 R7.8 一个模块 | pass | 未自动进入 R7.9。 |
| 是否只固化 R7.7 思考 | pass | 写入第一批 family 候选拆分、watch 裁决和 03 影响记录。 |
| 是否仍未写最终配置项 | pass | 未写最终 key、默认值、env var、JSON demo 或完整配置 demo。 |
| 是否保持 inbound watch | pass | inbound source binding 仍为 `pass_with_watch`,未关闭为 final pass。 |
| 是否形成 R7.9 入口 | pass | 下一模块为 `R7.9 publisher / query / operations job family 细化:先思考`。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.9 publisher / query / operations job family 细化:先思考`;只允许围绕 event publisher / handoff target、query / read policy、operations job runner 三组 family 进行候选拆分思考,判断是否可进入后续配置项候选池;不得创建正式 `04-配置设计.md`;不得写最终配置项清单、最终 key、最终默认值、最终环境变量名、正式模块 JSON demo、完整配置 demo、secret provider schema、测试方案、验收标准、实施计划或代码。

---

## R7.9 publisher / query / operations job family 细化:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 思考 event publisher / handoff target、query / read policy、operations job runner 三组 family 是否可拆为后续候选配置项。 |
| 本模块允许 | 只记录 family 细化思考、候选拆分条件、非候选 / watch 条件、来源 / profile 回指、03 影响预判和 R7.10 写入计划。 |
| 本模块禁止 | 不写最终配置项清单、最终 key、默认值、环境变量名、正式 JSON demo、完整配置 demo、secret provider schema、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | 用户已确认进入 R7.9;R7.8 已完成第一批 family 候选写入。 |

### 2. 上游约束思考

| 输入 | 对 R7.9 的约束 |
|---|---|
| `02-概要设计.md` §11 / §10 | publish / handoff 只能表达 candidate / outcome / safe diagnostic;query 只读且可返回 read material / availability surface;job 只能维护派生材料,不得修 core truth。 |
| `03-详细设计.md` §13 | `04` 只能接具体 key、profile、secret、endpoint、topic、numeric values;不得在 Step 7 改对象、port、protocol、flow、state、persistence、recovery 或 idempotency semantics。 |
| `03` outbound / handoff | publisher / handoff target、target registry、availability marker、body-free outcome 是既有装配面;R7.9 只能思考配置项如何喂给这些装配面。 |
| `03` query / read | query 使用 formal read resolver / availability / degraded mapper / repository summary / safe diagnostic source;R7.9 不得引入 write knob。 |
| `03` operations job | job 读取 batch / retry / lease / checkpoint / target / report / diagnostic 的 runtime 句柄;R7.9 不得让 job 修 truth。 |
| Step 5 来源 | 普通链仍为 code defaults / config file / env;secret 只传 ref;fixture 只用于 local / CI;watch_only 仍保留。 |

### 3. event publisher / handoff target family 思考

| family | 可拆候选方向 | 必须回指 | 暂停条件 |
|---|---|---|---|
| publisher target family | publisher target、availability、target registry 绑定方向。 | `03` outbound publication / handoff;Step 13 target registry 方向。 | 若需要真实 transport 产品、topic / URL / queue schema,延后 Step 13 或回 `03`。 |
| handoff target family | handoff target、prepared / blocked / unavailable outcome 绑定方向。 | `03` handoff binding / outcome;safe body-free receipt marker。 | 若配置项试图把 delivered 转成 downstream truth,拒绝。 |
| target availability family | target ready / blocked / unavailable / degraded 的技术分支。 | `03` target registry;adapter availability summary。 | 若从 raw transport response 或 config 字符串合成 marker,暂停。 |
| blocked / unavailable branch family | publication / handoff 被阻断时的配置语义。 | `03` publication / handoff failure mapping;safe diagnostic / issue refs。 | 若要求失败后回滚 source truth 或改写 candidate body,拒绝。 |

### 4. query / read policy family 思考

| family | 可拆候选方向 | 必须回指 | 暂停条件 |
|---|---|---|---|
| page limit family | page size / page cap / list bound 的安全分页方向。 | `03` query flow;Step 6 P0 profile;read material surface。 | 若分页配置影响 query no-write 或由此推导 write flow,拒绝。 |
| body limit family | body-free / summary-only / safe-absent 的读取边界方向。 | `02` body-free;`03` read resolver / summary. | 若配置允许 raw body 进入 query surface,直接拒绝。 |
| freshness threshold family | freshness / stale / degraded gating 的阈值方向。 | `03` freshness marker;availability marker。 | 若把 freshness 阈值当 truth、state 或 repair trigger,暂停。 |
| read availability source family | read availability 复制来源与 fallback source 方向。 | `03` read availability / degraded mapper;repository summary。 | 若需新增 hidden source 或 fake private map,回 `03`。 |
| entry-local read selector family | entry-local 选择器和 read context 方向。 | `03` entry context / runtime builder;Step 5 entry-local source。 | 若 selector 改变 query no-write 或绕过 facade,拒绝。 |

### 5. operations job runner family 思考

| family | 可拆候选方向 | 必须回指 | 暂停条件 |
|---|---|---|---|
| batch size family | job batch size、page size、chunk size 的控制方向。 | `03` operations job runner;maintenance / reconciliation flow。 | 若 batch size 被用来改变 truth repair 范围或跨 scope 写 truth,拒绝。 |
| retry policy family | retry 次数、退避、重试分类、replay 方向。 | `03` concurrency / idempotency;runtime / config binding。 | 若 retry policy 改变 stored replay / duplicate semantics,回 `03`。 |
| lease / checkpoint family | lease、checkpoint、resume / stale checkpoint 的运行句柄方向。 | `03` job progress / checkpoint;step 13 concurrency/idempotency。 | 若配置以 lease 替代 truth 或允许绕过 checkpoint,暂停。 |
| report target family | report root、summary target、diagnostic target 方向。 | `03` job report / progress / checkpoint;safe diagnostic。 | 若 report target 写入 raw body 或证据正文,拒绝。 |
| run-scoped diagnostic family | run-scoped safe diagnostic / issue ref 方向。 | `03` safe diagnostic boundary;observability handoff。 | 若配置暴露 raw log body、secret 或完整 trace payload,暂停。 |

### 6. 候选裁决表

| 领域 | 当前裁决 | 进入后续条件 |
|---|---|---|
| publisher / handoff | 可继续作为 candidate_direction 进入候选池。 | 后段需补类型、默认值、必填、来源、作用域、生效方式、敏感级别、失败策略和关联模块。 |
| query / read policy | 可继续作为 candidate_direction 进入候选池。 | 必须保持 query no-write、body-free、stale/degraded surface 语义。 |
| operations job runner | 可继续作为 candidate_direction 进入候选池。 | 必须保持 job no-truth-repair 和 stored replay 语义。 |
| target / read / report diagnostics | 只允许 body-free safe refs / markers。 | 任何 raw body、payload、secret、report body 都拒绝。 |

### 7. 对 03 的影响预判

| 触发点 | 影响判断 | R7.9 处理 |
|---|---|---|
| 仅说明已有 publisher / query / job binding 的配置来源和失败策略 | 不影响 `03` | 可进入 R7.10 写入候选记录。 |
| 需要新 publisher / handoff / query / job config struct 字段或 typed ref | 影响 `03` | R7.10 必须标 blocker,不能私补。 |
| 需要新 port、mapper 或 public DTO 字段 | 影响 `03` | 暂停回 `03` owning step。 |
| 需要 secret provider、transport product、endpoint / topic / URL schema | 可能影响 `03` / Step 8 / Step 13 | R7.9 不闭口,只保留方向。 |
| 任何配置项绕过 query no-write、job no-truth-repair、body-free 或 marker source | 越界 | 拒绝进入配置项。 |

### 8. R7.10 写入计划

| 写入项 | 计划内容 | 禁止内容 |
|---|---|---|
| publisher / handoff 记录 | 写入 publisher target、handoff target、target availability、blocked / unavailable branch 的候选拆分与限制。 | 不写真实 topic / URL / queue schema。 |
| query 记录 | 写入 page limit、body limit、freshness threshold、read availability source、entry-local read selector 的候选拆分与限制。 | 不写 query write knob 或 raw body 入口。 |
| operations job 记录 | 写入 batch、retry、lease / checkpoint、report target、run-scoped diagnostic 的候选拆分与限制。 | 不写 truth repair knob、raw log 或 report body。 |
| 03 影响记录 | 写入 publisher / query / job family 判定出的回 `03` 条件。 | 不在 04 私补 schema / port / mapper。 |

### 9. R7.9 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只推进 R7.9 一个模块 | pass | 未自动进入 R7.10。 |
| 是否保持“先思考” | pass | 只写 publisher / query / operations job family 细化思考和 R7.10 写入计划。 |
| 是否未写最终配置项 | pass | 未写最终 key、默认值、env var、JSON demo 或完整 demo。 |
| 是否保留 query no-write / job no-truth-repair | pass | 未引入写 truth 的配置 knob。 |
| 是否形成 R7.10 入口 | pass | 下一模块为 `R7.10 publisher / query / operations job family 细化:再写入`。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.10 publisher / query / operations job family 细化:再写入`;只允许把 R7.9 的 publisher / handoff、query / read policy、operations job runner family 细化思考写成可恢复记录;不得创建正式 `04-配置设计.md`;不得写最终配置项清单、最终 key、最终默认值、最终环境变量名、正式模块 JSON demo、完整配置 demo、secret provider schema、测试方案、验收标准、实施计划或代码。

---

## R7.10 publisher / query / operations job family 细化:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 将 R7.9 的 publisher / handoff、query / read policy、operations job runner family 细化思考固化为后续配置项候选记录。 |
| 本模块允许 | 写入三组 family 的候选拆分记录、限制条件、来源 / profile 回指、watch / redline 处理、03 影响预判和 R7.11 入口。 |
| 本模块禁止 | 不写最终配置项清单、最终 key、默认值、环境变量名、正式 JSON demo、完整配置 demo、secret provider schema、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | 用户已确认进入 R7.10;R7.9 已完成 publisher / query / job family 细化思考。 |

### 2. 固化总则

| 原则 | R7.10 固化口径 |
|---|---|
| family 不是 final item | 本节所有 family 仍是候选分组,用于后续逐项拆解配置项。 |
| 只记装配语义 | 仅记录 publisher / query / job 的配置如何进入既有装配面,不写运行时语义改写。 |
| 保持红线 | 不允许配置项改变 query no-write、job no-truth-repair、body-free、stored replay、truth owner、state transition 或 marker source。 |
| 03 优先 | 任何需要新增 `03` schema / port / mapper / DTO / typed ref 的点,都必须回 `03` 或停审。 |

### 3. publisher / handoff family 候选拆分记录

| family | 候选配置项方向 | 来源 / profile 回指 | 当前裁决 | 限制 |
|---|---|---|---|---|
| publisher target family | publisher target、target registry、availability binding 的方向。 | `03` outbound publication / handoff;Step 13 target registry。 | candidate_direction | 不写真实 topic / URL / queue schema。 |
| handoff target family | handoff target、prepared / blocked / unavailable outcome 的方向。 | `03` handoff binding / outcome;body-free receipt marker。 | candidate_direction | 不得把 delivered 配置成 downstream truth。 |
| target availability family | target ready / blocked / unavailable / degraded 的技术分支。 | `03` target registry;adapter availability summary。 | candidate_direction | 不得从 raw transport response 或 config 字符串合成 marker。 |
| blocked / unavailable branch family | publication / handoff 被阻断时的配置语义。 | `03` publication / handoff failure mapping;safe diagnostic refs。 | candidate_with_watch | 不得要求失败回滚 source truth 或改写 candidate body。 |

### 4. query / read policy family 候选拆分记录

| family | 候选配置项方向 | 来源 / profile 回指 | 当前裁决 | 限制 |
|---|---|---|---|---|
| page limit family | page size / page cap / list bound 的安全分页方向。 | `03` query flow;Step 6 P0 profile;read material surface。 | candidate_direction | 分页配置不得影响 query no-write。 |
| body limit family | body-free / summary-only / safe-absent 的读取边界方向。 | `02` body-free;`03` read resolver / summary。 | candidate_direction | 不允许 raw body 进入 query surface。 |
| freshness threshold family | freshness / stale / degraded gating 的阈值方向。 | `03` freshness marker;availability marker。 | candidate_direction | 不得把 freshness 阈值当 truth、state 或 repair trigger。 |
| read availability source family | read availability 复制来源与 fallback source 的方向。 | `03` read availability / degraded mapper;repository summary。 | candidate_direction | 不得新增 hidden source 或 fake private map。 |
| entry-local read selector family | entry-local 选择器和 read context 的方向。 | `03` entry context / runtime builder;Step 5 entry-local source。 | candidate_direction | 不得绕过 facade 或改变 query no-write。 |

### 5. operations job runner family 候选拆分记录

| family | 候选配置项方向 | 来源 / profile 回指 | 当前裁决 | 限制 |
|---|---|---|---|---|
| batch size family | job batch size、page size、chunk size 的控制方向。 | `03` operations job runner;maintenance / reconciliation flow。 | candidate_direction | 不得改变 truth repair 范围或跨 scope 写 truth。 |
| retry policy family | retry 次数、退避、重试分类、replay 方向。 | `03` concurrency / idempotency;runtime / config binding。 | candidate_direction | 不得改变 stored replay / duplicate semantics。 |
| lease / checkpoint family | lease、checkpoint、resume / stale checkpoint 的运行句柄方向。 | `03` job progress / checkpoint;step 13 concurrency/idempotency。 | candidate_direction | 不得以 lease 替代 truth 或绕过 checkpoint。 |
| report target family | report root、summary target、diagnostic target 的方向。 | `03` job report / progress / checkpoint;safe diagnostic。 | candidate_direction | 不得写 raw body 或证据正文。 |
| run-scoped diagnostic family | run-scoped safe diagnostic / issue ref 的方向。 | `03` safe diagnostic boundary;observability handoff。 | candidate_direction | 不得暴露 raw log body、secret 或完整 trace payload。 |

### 6. 候选裁决表

| 领域 | 当前裁决 | 进入后续条件 |
|---|---|---|
| publisher / handoff | 可继续作为 candidate_direction 进入候选池。 | 后段补类型、默认值、必填、来源、作用域、生效方式、敏感级别、失败策略和关联模块。 |
| query / read policy | 可继续作为 candidate_direction 进入候选池。 | 必须保持 query no-write、body-free、stale/degraded surface 语义。 |
| operations job runner | 可继续作为 candidate_direction 进入候选池。 | 必须保持 job no-truth-repair 和 stored replay 语义。 |
| target / read / report diagnostics | 只允许 body-free safe refs / markers。 | 任何 raw body、payload、secret、report body 都拒绝。 |

### 7. 对 03 的影响预判

| 触发点 | 影响判断 | R7.10 处理 |
|---|---|---|
| 仅说明已有 publisher / query / job binding 的配置来源和失败策略 | 不影响 `03` | 可进入 R7.11 写入候选记录。 |
| 需要新 publisher / handoff / query / job config struct 字段或 typed ref | 影响 `03` | 当前不补;后续命中即暂停。 |
| 需要新 port、mapper 或 public DTO 字段 | 影响 `03` | 暂停回 `03` owning step。 |
| 需要 secret provider、transport product、endpoint / topic / URL schema | 可能影响 `03` / Step 8 / Step 13 | R7.10 不闭口,只保留方向。 |
| 任何配置项绕过 query no-write、job no-truth-repair、body-free 或 marker source | 越界 | 拒绝进入配置项。 |

### 8. R7.11 写入计划

| 写入项 | 计划内容 | 禁止内容 |
|---|---|---|
| publisher / handoff 记录 | 写入 publisher target、handoff target、target availability、blocked / unavailable branch 的候选拆分与限制。 | 不写真实 topic / URL / queue schema。 |
| query 记录 | 写入 page limit、body limit、freshness threshold、read availability source、entry-local read selector 的候选拆分与限制。 | 不写 query write knob 或 raw body 入口。 |
| operations job 记录 | 写入 batch、retry、lease / checkpoint、report target、run-scoped diagnostic 的候选拆分与限制。 | 不写 truth repair knob、raw log 或 report body。 |
| 03 影响记录 | 写入 publisher / query / job family 判定出的回 `03` 条件。 | 不在 04 私补 schema / port / mapper。 |

### 9. R7.10 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只推进 R7.10 一个模块 | pass | 未自动进入 R7.11。 |
| 是否保持“先思考” | pass | 只写 publisher / query / operations job family 细化思考和 R7.11 写入计划。 |
| 是否未写最终配置项 | pass | 未写最终 key、默认值、env var、JSON demo 或完整 demo。 |
| 是否保留 query no-write / job no-truth-repair | pass | 未引入写 truth 的配置 knob。 |
| 是否形成 R7.11 入口 | pass | 下一模块为 `R7.11 diagnostics / redaction / downstream handoff family 细化:先思考`。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.11 diagnostics / redaction / downstream handoff family 细化:先思考`;只允许把 R7.10 的 publisher / handoff、query / read policy、operations job runner family 细化思考写成可恢复记录;不得创建正式 `04-配置设计.md`;不得写最终配置项清单、最终 key、最终默认值、最终环境变量名、正式模块 JSON demo、完整配置 demo、secret provider schema、测试方案、验收标准、实施计划或代码。

---

## R7.11 diagnostics / redaction / downstream handoff family 细化:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 围绕 diagnostics / redaction、downstream handoff、config center / admin override excluded watch 三组 family 进行候选拆分思考,判断是否可进入后续配置项候选池。 |
| 本模块允许 | 只记录 family 细化思考、候选拆分条件、非候选 / watch 条件、来源 / profile 回指、03 影响预判和 R7.12 写入计划。 |
| 本模块禁止 | 不写最终配置项清单、最终 key、默认值、环境变量名、正式 JSON demo、完整配置 demo、secret provider schema、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | 用户已确认进入 R7.11;R7.10 已完成 publisher / query / job family 细化写入。 |

### 2. 细化原则思考

| 原则 | R7.11 思考 |
|---|---|
| safe output first | diagnostics / redaction 只讨论 safe diagnostic、redaction marker、body-free issue ref 和 artifact/report shell 的配置候选,不写 raw log、raw report body、payload excerpt 或 secret。 |
| handoff is downstream input | downstream handoff 只讨论后续 `05/06/07` 可消费的配置矩阵和门禁输入方向,不反向定义 TC、AC、evidence schema 或 commit boundary。 |
| watch remains watch | config center、admin override、hot reload 和 live override 继续保持 watch_only,不得伪装成 P0 配置项。 |
| Step 8 / 12 不提前 | sensitive secret provider 交 Step 8;测试 / 验收 / 实施承接交 Step 12 及后续正式文档。 |
| 03 source wins | 任何 diagnostic marker、redaction marker、handoff target 或 report ref 若需要新增对象、port、mapper、DTO 或 state,必须回 `03`。 |

### 3. diagnostics / redaction family 候选拆分思考

| family | 候选配置项方向 | 来源 / profile 回指 | 当前判断 | 限制 |
|---|---|---|---|---|
| redaction profile family | redaction profile、deny boundary、safe field allowlist / denylist 的方向。 | `03` §14 redaction / sensitive boundary;Step 8 sensitive review。 | candidate_direction | 不写 raw secret、credential、token、raw endpoint 或 raw topic。 |
| safe diagnostic sink family | safe diagnostic sink、safe issue routing、body-free diagnostic target 的方向。 | `03` observability safe diagnostic;Step 6 P0 profile。 | candidate_direction | 不锁具体 log/metric/span/backend 产品或 schema。 |
| safe issue reporting family | validation issue、adapter availability issue、runtime unavailable issue 的安全输出方向。 | `03` error / recovery、observability and adapter availability。 | candidate_direction | 不从 raw exception text、stack trace、SQL error 或 provider body生成 marker。 |
| redacted artifact/report shell family | redacted artifact ref、report root direction、run-scoped safe shell 的方向。 | `03` job report boundary;`00/01/02` body-free artifact boundary。 | candidate_with_watch | 不保存 artifact 正文、evidence body、report body 或 archive package。 |

### 4. downstream handoff family 候选拆分思考

| family | 候选配置项方向 | 来源 / profile 回指 | 当前判断 | 限制 |
|---|---|---|---|---|
| configuration handoff matrix family | 后续 `05/06/07` 可读取的配置域、profile、redline 和 deferred owner 矩阵方向。 | Step 3~6、`03` §13 / §16 handoff。 | candidate_direction | 不替代测试方案、验收标准或实施计划。 |
| implementation gate input family | config redline、fake/durable parity、no-private-fallback、missing source blocker 的门禁输入方向。 | `03` §16 implementation handoff;标准台账门禁。 | candidate_direction | 不写 commit ID、allowed_scope、required_checks 或 evidence run schema。 |
| report root direction family | operations report root、safe diagnostic report root、handoff report root 的配置方向。 | `03` job / report boundary;Step 5 source priority。 | candidate_with_watch | 不写真实 bucket、path product、credential body 或 report schema。 |
| handoff notes family | config unresolved watch、deferred owner、future production adapter direction 的说明方向。 | Step 13 / Step 14 风险与待确认事项。 | candidate_direction | 不把 note 升格为 P0 runtime required item。 |

### 5. excluded watch family 思考

| watch family | 当前裁决 | 进入后续条件 |
|---|---|---|
| config center family | excluded_from_P0 / watch_only。 | 若未来进入 P1/P2,必须先定义 remote source、merge order、auth、audit、rollback 和 failure surface,并回 `03` / 架构闭口。 |
| admin override family | excluded_from_P0 / watch_only。 | 若未来进入 P1/P2,必须先定义权限、审计、scope、回滚和 redaction,不得在 P0 Step 7 写 live override。 |
| hot reload family | excluded_from_P0 / watch_only。 | 若未来需要,必须回 Step 4 / Step 9 / Step 10 定义生效边界、审计和失败策略。 |
| production secret provider family | deferred_to_Step8 / P1-P2 direction。 | Step 8 先定义敏感配置和明文禁止,再决定 provider schema 是否需要回 `03`。 |
| production observability backend family | deferred_direction。 | `03` 只给 safe observability cut;具体产品、dashboard、sampling、retention 后移。 |

### 6. 候选裁决思考

| 领域 | 当前裁决 | 进入后续条件 |
|---|---|---|
| diagnostics / redaction | 可继续作为 candidate_direction 进入候选池。 | 后段必须补类型、默认值、必填、来源、作用域、生效方式、敏感级别、失败策略和关联模块。 |
| downstream handoff | 可作为 downstream-owner candidate 进入候选池。 | 必须保持“只给下游输入,不反向定义下游真相源”。 |
| redacted artifact/report shell | 仅作为 safe ref / root direction 候选。 | 必须保持 body-free,不得包含正文、payload 或 evidence body。 |
| excluded watch | 不进入 P0 final config item。 | 后续只能进入 watch / risk / deferred owner,不能进入 P0 配置项总表。 |

### 7. 对 03 的影响预判

| 触发点 | 影响判断 | R7.11 处理 |
|---|---|---|
| 仅说明已有 safe diagnostic / redaction / handoff binding 的配置来源和失败策略 | 不影响 `03` | 可进入 R7.12 写入候选记录。 |
| 需要新增 diagnostic marker、redaction marker、report ref、handoff target object 或 mapper | 影响 `03` | 当前不补;命中即暂停回 owning Step。 |
| 需要具体 log/metric/span/audit schema、dashboard、sampling、retention | 不属于 Step 7 | 交观测 / 运维 / 后续文档,不在 R7.11 闭口。 |
| 需要 secret provider、credential resolver、raw secret storage schema | 可能影响 Step 8 / `03` | R7.11 不闭口,只保留 deferred owner。 |
| downstream handoff 试图定义 TC / AC / evidence / commit boundary | 越界 | 拒绝进入配置项,后移到 `05/06/07`。 |
| 任何配置项绕过 body-free、marker source、query no-write、job no-truth-repair 或 P0/P1 隔离 | 越界 | 拒绝进入配置项。 |

### 8. R7.12 写入计划

| 写入项 | 计划内容 | 禁止内容 |
|---|---|---|
| diagnostics / redaction 记录 | 写入 redaction profile、safe diagnostic sink、safe issue reporting、redacted artifact/report shell 的候选拆分与限制。 | 不写 raw body、secret、log schema、metric name 或 dashboard。 |
| downstream handoff 记录 | 写入 configuration handoff matrix、implementation gate input、report root direction、handoff notes 的候选拆分与限制。 | 不写 TC、AC、evidence schema、commit boundary 或代码计划。 |
| excluded watch 记录 | 写入 config center、admin override、hot reload、production secret provider、production observability backend 的 excluded / deferred 裁决。 | 不把 watch 项写入 P0 final config。 |
| 03 影响记录 | 写入 diagnostics / redaction / handoff family 判定出的回 `03` 条件。 | 不在 04 私补 marker、mapper、schema、port 或 state。 |

### 9. R7.11 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只推进 R7.11 一个模块 | pass | 未自动进入 R7.12。 |
| 是否保持“先思考” | pass | 只写 diagnostics / redaction / downstream handoff family 细化思考和 R7.12 写入计划。 |
| 是否未写最终配置项 | pass | 未写最终 key、默认值、env var、JSON demo 或完整 demo。 |
| 是否保持 safe / body-free 边界 | pass | 未引入 raw body、secret、raw report、payload excerpt 或 evidence body。 |
| 是否保留 watch 项 | pass | config center、admin override、hot reload 继续 excluded_from_P0 / watch_only。 |
| 是否形成 R7.12 入口 | pass | 下一模块为 `R7.12 diagnostics / redaction / downstream handoff family 细化:再写入`。 |

---

## R7.12 diagnostics / redaction / downstream handoff family 细化:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 将 R7.11 的 diagnostics / redaction、downstream handoff、excluded watch family 细化思考固化为候选配置项记录、影响判定和停审结果。 |
| 本模块允许 | 写入 diagnostics / redaction、downstream handoff、excluded watch family 的候选拆分记录、限制条件、来源 / profile 回指、03 影响判定、停审记录和 Step 8 入口。 |
| 本模块禁止 | 不写最终配置项清单、最终 key、默认值、环境变量名、正式 JSON demo、完整配置 demo、secret provider schema、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R7.11 已完成 diagnostics / redaction、downstream handoff、excluded watch family 细化思考;用户已确认进入 R7.12。 |

### 2. 固化总则

| 原则 | R7.12 固化口径 |
|---|---|
| safe output first | diagnostics / redaction 只记录 safe diagnostic、redaction marker、body-free issue ref 和 redacted artifact/report shell 的候选配置项方向。 |
| downstream handoff only consumes | downstream handoff 只提供给后续 `05/06/07` 的配置矩阵和门禁输入方向,不反向定义测试、验收或实施真相源。 |
| watch remains watch | config center、admin override、hot reload 和 production observability backend 继续保持 watch_only / deferred,不得混入 P0。 |
| Step 8 / 12 不提前 | sensitive secret provider 交 Step 8;测试 / 验收 / 实施承接交 Step 12 及后续正式文档。 |
| 03 source wins | 若任何 diagnostic marker、redaction marker、handoff target 或 report ref 需要新增对象、port、mapper、DTO 或 state,必须回 `03`。 |

### 3. diagnostics / redaction family 记录

| family | 记录的候选配置项方向 | 来源 / profile 回指 | 当前裁决 | 限制 |
|---|---|---|---|---|
| redaction profile family | redaction profile、deny boundary、safe field allowlist / denylist。 | `03` §14 redaction / sensitive boundary;Step 8 sensitive review。 | candidate_direction | 不写 raw secret、credential、token、raw endpoint 或 raw topic。 |
| safe diagnostic sink family | safe diagnostic sink、safe issue routing、body-free diagnostic target。 | `03` observability safe diagnostic;Step 6 P0 profile。 | candidate_direction | 不锁具体 log/metric/span/backend 产品或 schema。 |
| safe issue reporting family | validation issue、adapter availability issue、runtime unavailable issue。 | `03` error / recovery、observability and adapter availability。 | candidate_direction | 不从 raw exception text、stack trace、SQL error 或 provider body 生成 marker。 |
| redacted artifact/report shell family | redacted artifact ref、report root direction、run-scoped safe shell。 | `03` job report boundary;`00/01/02` body-free artifact boundary。 | candidate_with_watch | 不保存 artifact 正文、evidence body、report body 或 archive package。 |

### 4. downstream handoff family 记录

| family | 记录的候选配置项方向 | 来源 / profile 回指 | 当前裁决 | 限制 |
|---|---|---|---|---|
| configuration handoff matrix family | 后续 `05/06/07` 可读取的配置域、profile、redline 和 deferred owner 矩阵。 | Step 3~6、`03` §13 / §16 handoff。 | candidate_direction | 不替代测试方案、验收标准或实施计划。 |
| implementation gate input family | config redline、fake/durable parity、no-private-fallback、missing source blocker。 | `03` §16 implementation handoff;标准台账门禁。 | candidate_direction | 不写 commit ID、allowed_scope、required_checks 或 evidence run schema。 |
| report root direction family | operations report root、safe diagnostic report root、handoff report root。 | `03` job / report boundary;Step 5 source priority。 | candidate_with_watch | 不写真实 bucket、path product、credential body 或 report schema。 |
| handoff notes family | config unresolved watch、deferred owner、future production adapter direction。 | Step 13 / Step 14 风险与待确认事项。 | candidate_direction | 不把 note 升格为 P0 runtime required item。 |

### 5. excluded watch family 记录

| watch family | 当前裁决 | 进入后续条件 |
|---|---|---|
| config center family | excluded_from_P0 / watch_only。 | 若未来进入 P1/P2,必须先定义 remote source、merge order、auth、audit、rollback 和 failure surface,并回 `03` / 架构闭口。 |
| admin override family | excluded_from_P0 / watch_only。 | 若未来进入 P1/P2,必须先定义权限、审计、scope、回滚和 redaction,不得在 P0 Step 7 写 live override。 |
| hot reload family | excluded_from_P0 / watch_only。 | 若未来需要,必须回 Step 4 / Step 9 / Step 10 定义生效边界、审计和失败策略。 |
| production secret provider family | deferred_to_Step8 / P1-P2 direction。 | Step 8 先定义敏感配置和明文禁止,再决定 provider schema 是否需要回 `03`。 |
| production observability backend family | deferred_direction。 | `03` 只给 safe observability cut;具体产品、dashboard、sampling、retention 后移。 |

### 6. 候选裁决表

| 领域 | 当前裁决 | 进入后续条件 |
|---|---|---|
| diagnostics / redaction | 可继续作为 candidate_direction 进入候选池。 | 后段必须补类型、默认值、必填、来源、作用域、生效方式、敏感级别、失败策略和关联模块。 |
| downstream handoff | 可作为 downstream-owner candidate 进入候选池。 | 必须保持“只给下游输入,不反向定义下游真相源”。 |
| redacted artifact/report shell | 仅作为 safe ref / root direction 候选。 | 必须保持 body-free,不得包含正文、payload 或 evidence body。 |
| excluded watch | 不进入 P0 final config item。 | 后续只能进入 watch / risk / deferred owner,不能进入 P0 配置项总表。 |

### 7. 对 03 的影响判定

| 触发点 | 影响判断 | R7.12 处理 |
|---|---|---|
| 仅说明已有 safe diagnostic / redaction / handoff binding 的配置来源和失败策略 | 不影响 `03` | 本轮可收口并进入 Step 8。 |
| 需要新增 diagnostic marker、redaction marker、report ref、handoff target object 或 mapper | 影响 `03` | 当前不补;命中即暂停回 owning Step。 |
| 需要具体 log/metric/span/audit schema、dashboard、sampling、retention | 不属于 Step 7 | 交观测 / 运维 / 后续文档,不在 R7.12 闭口。 |
| 需要 secret provider、credential resolver、raw secret storage schema | 可能影响 Step 8 / `03` | R7.12 不闭口,只保留 deferred owner。 |
| downstream handoff 试图定义 TC / AC / evidence / commit boundary | 越界 | 拒绝进入配置项,后移到 `05/06/07`。 |
| 任何配置项绕过 body-free、marker source、query no-write、job no-truth-repair 或 P0/P1 隔离 | 越界 | 拒绝进入配置项。 |

### 8. R7.12 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只推进 R7.12 一个模块 | pass | 未自动进入 Step 8。 |
| 是否保持“先思考 -> 再写入” | pass | 已把 R7.11 计划落成可恢复记录。 |
| 是否未写最终配置项 | pass | 未写最终 key、默认值、env var、JSON demo 或完整 demo。 |
| 是否保持 safe / body-free 边界 | pass | 未引入 raw body、secret、raw report、payload excerpt 或 evidence body。 |
| 是否保留 watch 项 | pass | config center、admin override、hot reload 继续 excluded_from_P0 / watch_only。 |
| 是否形成 Step 8 入口 | pass | 下一模块为 `R8.1 开工与必读文档:先思考`。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.1 开工与必读文档:先思考`;只允许思考 Step 8 敏感配置与密钥管理的开工边界、必读文档、Step 7 / Step 8 交界、L1-governance 框架参考、watch / redline 和 R8.2 写入计划;不得创建正式 `04-配置设计.md`;不得写最终配置项清单、最终 key、最终默认值、最终环境变量名、正式模块 JSON demo、完整配置 demo、secret provider schema、测试方案、验收标准、实施计划或代码。
