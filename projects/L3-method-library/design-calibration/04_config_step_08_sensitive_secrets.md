# Step 8. 定义敏感配置与密钥管理

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 8
> 书写规范: `standards/document/配置设计书写规范.md` §5.8
> 回填章节: `04-配置设计.md` §8 敏感配置与密钥管理
> 创建日期: 2026-06-25
> 当前状态: `R8.4 SOP 问题回答与敏感配置候选:再写入` completed_wait_user_confirm_to_R9.1
> 当前门禁: 等待确认进入 Step 9 `R9.1 开工与必读文档:先思考`

---

## 0. Step 8 边界

Step 8 在 Step 7 已确认的配置项清单基础上,单独收稳 secret、credential、DSN、token、cert 等敏感配置的存储、读取、轮换和审计边界。

当前 Step 只允许讨论敏感配置如何被识别、如何回指 Step 7 配置项、如何被普通来源隔离、如何在日志 / 错误 / 审计 / report / trace 中避免泄露,以及在不同 profile 中如何保持 opaque ref / safe marker 处理。

本 Step 不允许写:

- 具体 secret provider / KMS / Vault / cloud secret manager 产品。
- 具体 endpoint URL、DSN、token、password、private key、certificate body、bus credential、archive package body、external GRC credential 或外部系统响应正文。
- 具体部署挂载、证书安装、权限申请、值班流程或生产密钥轮换 runbook。
- runtime hot reload。P0 敏感配置变化仍按 restart 或 new job run 生效。

---

## R8.1 开工与必读文档:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 本模块目标 | 思考 Step 8 的开工边界、必读文档、Step 7 / Step 8 交界、L1-governance 框架参考、watch / redline 和 R8.2 写入计划。 |
| 本模块允许 | 只记录输入基线、必读文档、敏感配置讨论框架、表格列约束、watch / redline、03 影响判定和 R8.2 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写敏感配置表本体、具体 secret provider 产品、具体 token/password/private key/cert/DSN/body、轮换 runbook、测试用例、验收门禁、实施计划或代码。 |
| 恢复依据 | Step 7 已完成并推进为 `R7.12 completed_wait_user_confirm_to_R8.1`;用户已确认进入 Step 8 R8.1。 |

### 2. Step 8 开工边界思考

| 边界项 | R8.1 裁决 |
|---|---|
| Step 8 定位 | 从 Step 7 配置项中分离出敏感配置和密钥管理边界,不能把敏感配置混写进普通配置项表。 |
| 直接输入 | Step 7 配置项清单、Step 5 来源优先级、Step 6 profile 矩阵、`00/01/02/03` 安全红线、SOP Step 8、书写规范 §5.8。 |
| 输出粒度 | 后续应先写敏感配置表、禁止输出规则、停审记录和跨敏感配置泄露风险审计表,再继续 Step 9。 |
| 敏感配置边界 | 只纳入 P0 runtime 必需、可被 loader / builder / adapter / entry / job 消费且有正式来源和失败策略的敏感配置项。 |
| 非敏感边界 | 普通阈值、一般 profile label、纯内部 debug switch 仍按 Step 7 清单处理,不升格为敏感配置。 |
| P1/P2 边界 | production secret provider、credential resolver、真实 KMS / Vault 只作为方向,不得混入本 Step 的 final 结论。 |
| 对 03 的影响 | 若 Step 8 需要新增 secret provider schema、credential ref carrier、adapter constructor、port、DTO、mapper、state 或 flow,必须回 `03-详细设计.md` 或暂停。 |

### 3. 必读文档思考

| 必读文档 | 读取用途 | R8.2 用法 |
|---|---|---|
| `project_execution_ledger.md` | 确认当前允许进入 Step 8 R8.1。 | 写入 Step 8 当前恢复依据。 |
| `04_config_calibration_flow.md` | 确认 Step 8 主题、状态表和执行纪律。 | 同步 Step 8 当前状态和 next_allowed_action。 |
| `04_config_step_07_config_items.md` | 承接 Step 7 配置项清单和敏感候选字段。 | 识别哪些 Step 7 项应进入敏感配置表。 |
| `04_config_step_05_sources_priority_conflicts.md` | 承接 ordinary source chain、secret ref、fixture、entry-local、watch_only 和来源冲突。 | 判定敏感配置的来源、覆盖规则和失败策略。 |
| `04_config_step_06_environment_profiles_matrix.md` | 承接 local / CI / integration / operations / staging / production profile 和 P0/P1/P2 隔离。 | 判定敏感配置在不同 profile 中的处理方式。 |
| `配置设计讨论流程_SOP.md` Step 8 | 固定本步目标、输入、输出和问题清单。 | R8.2 写入开工记录,R8.3 起逐问题讨论。 |
| `配置设计书写规范.md` §5.8 | 固定敏感配置表和禁止输出规则。 | 作为后续敏感配置章节的格式门禁。 |
| `设计文档讨论中间产物规范.md` | 固定中间产物和台账同步纪律。 | 约束 R8.1 -> R8.2。 |
| `设计真相源闭环与可落码性标准.md` | 固定缺 schema / port / mapper / config / evidence 时必须暂停。 | 作为 03 影响和 blocker 判定依据。 |
| `00-需求文档.md` | 提供安全、正文排除、相邻仓边界和 secret 不入正文的红线。 | 防止敏感配置越过本仓职责。 |
| `01-架构设计.md` | 提供数据所有权、外部正文不入仓和配置边界控制。 | 防止敏感配置引入 sibling dependency 或真实产品前置。 |
| `02-概要设计.md` §11 | 提供配置影响轮廓和禁止配置化边界。 | 核对敏感配置是否越过概要红线。 |
| `03-详细设计.md` §13 / §14 / §16 / §17 | 提供 runtime config binding、forbidden body、redaction、handoff owner 和风险。 | 判定敏感配置是否已有正式消费面。 |
| L1-governance Step 8 | 提供敏感配置章节框架深度。 | 只参考结构,不复制治理仓 secret 细节。 |

### 4. Step 7 -> Step 8 输入基线思考

| 输入来源 | Step 8 接收方式 | 不得接收 |
|---|---|---|
| Step 7 配置项清单 | 接收 `sensitive-ref`、`ref-sensitive`、endpoint/target/route/replay refs 作为敏感候选池。 | 不把普通阈值、纯 label、debug switch 直接升级为 secret。 |
| Step 5 来源优先级 | 接收 ordinary sources 只能承载 refs,raw secret 不进普通链。 | 不把 config center / admin override 写成 P0 source truth。 |
| Step 6 profile 矩阵 | 接收 local/CI fake ref、integration-like credential ref、production-like secret provider ref 的方向。 | 不把 production secret provider 细节当成已闭口事实。 |
| 正式 `03` §13 / §14 | 接收 config binding、forbidden body、redaction / observability redline。 | 不自行新增 secret provider schema、mapper 或 port。 |
| 旧材料 | 只作为下游方向或污染审计对象。 | 不反向生成 secret key、rotate policy、fixture、AC、commit boundary 或 evidence schema。 |

### 5. SOP Step 8 产出与问题框架思考

| SOP 产出 | R8 后续处理方式 |
|---|---|
| 敏感配置表 | 按规范列出配置项、敏感级别、存储方式、是否可明文、轮换方式、审计要求。 |
| 禁止输出规则 | 明确 raw secret、credential body、token、private key、cert body、endpoint / route / report body 在 log / error / audit / trace / report 中的禁止边界。 |
| 敏感配置停审记录 | 每个敏感项完成后停审,检查存储、读取、轮换、审计和禁止输出是否闭合。 |
| 跨敏感配置泄露风险审计表 | 审计 raw secret 入文档、普通配置误归类、日志泄露、错误返回泄露、轮换缺口和审计缺口。 |

### 6. Watch / redline 带入思考

| 项 | 当前状态 | Step 8 处理 |
|---|---|---|
| inbound source binding | pass_with_watch | 若后续敏感配置涉及 source binding,必须复核 formal carrier / adapter constructor / protocol 是否已闭合;缺口回 `03`。 |
| config center | watch_only | 不进入 Step 8 的敏感配置表;不写 remote config、hot reload、live override 或 rollback contract。 |
| admin override | watch_only | 不进入 Step 8 的敏感配置表;不写 operator override、权限模型或审计 schema。 |
| true secret provider schema | not_defined / P1-P2 direction | Step 8 不写 provider schema;后续 Step 9 / `03` 再闭口。 |
| true endpoint / bus / report target schema | not_defined / P1-P2 direction | 不锁 URL、topic、bucket、产品或 credential body。 |
| old MethodContent / publish / snapshot / outbox | redline | 不作为当前敏感配置来源。 |
| forbidden boundary | redline | 任何配置项不得改变 truth owner、state transition、query no-write、job no-truth-repair、body-free、stored replay、transaction boundary、marker source、public schema 或 P0/P1 隔离。 |

### 7. 对 03 的影响判定框架

| Step 8 结论类型 | 是否影响 03 | 处理规则 |
|---|---|---|
| 只把已存在的 sensitive ref / secret ref 整理成敏感配置表 | 通常否 | 记录为 `无回写`,后续 Step 9 校验加载时再复核。 |
| 明确敏感配置存储、明文禁止、轮换、审计和禁止输出规则 | 通常否 | 只要不新增 runtime contract,留在 `04`。 |
| 需要新增 secret provider schema、credential ref carrier、adapter constructor、port 或 mapper | 是 | 暂停并回 `03` owning Step。 |
| 需要把 remote secret provider、config center、admin override、hot reload 或 production product 纳入 P0 | 是 | 暂停,需 `03` / 架构闭口。 |
| 敏感配置试图改变 forbidden boundary | 是且越界 | 立即拒绝,不得在 04 内补口。 |

### 8. R8.2 写入计划

| 写入项 | 写入边界 |
|---|---|
| Step 8 开工记录 | 把 R8.1 思考固化为开工记录、输入基线和必读文档记录。 |
| 敏感配置 / 密钥管理输出门禁 | 写明敏感配置表、禁止输出规则、停审和审计表的后续产物要求。 |
| Step 7 -> Step 8 承接记录 | 写清哪些 Step 7 配置项被归入敏感配置。 |
| watch / redline 记录 | 固定 config center / admin override、secret provider、endpoint / bus / report target 和 forbidden boundary。 |
| 03 影响判定记录 | 写清何时无回写、何时必须暂停回 `03`。 |
| R8.3 入口 | 只推进到 SOP 问题回答与敏感配置候选:先思考,不提前写最终敏感配置表。 |

### 9. R8.1 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只写开工与必读文档思考 | pass | 未写敏感配置表本体、secret provider 产品或轮换 runbook。 |
| 是否承接 Step 7 / Step 5 / Step 6 | pass | 已记录配置项、来源优先级和 profile 矩阵的接收方式。 |
| 是否保留 watch 项 | pass | inbound source binding 保持 pass_with_watch;config center / admin override 保持 watch_only。 |
| 是否保留 forbidden boundary | pass | 已明确敏感配置不得改变 truth owner、state transition、query no-write、job no-truth-repair、body-free、stored replay、transaction boundary、marker source、public schema 或 P0/P1 隔离。 |
| 是否可进入 R8.2 | pass | 等待用户确认后进入 `R8.2 开工与必读文档:再写入`。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.2 开工与必读文档:再写入`;只允许把 R8.1 思考固化为开工记录、输入基线、必读文档、SOP 输出门禁、watch / redline、03 影响判定和 R8.3 入口;不得创建正式 `04-配置设计.md`;不得写最终敏感配置表、具体 secret provider 产品、最终 key、默认值、环境变量名、正式 JSON demo、完整配置 demo、测试方案、验收标准、实施计划或代码。

## R8.2 开工与必读文档:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R8.3 |
| 本模块目标 | 将 R8.1 中已确认的敏感配置边界、必读文档和 watch / redline 记录固化为可恢复开工台账,并为 R8.3 问题回答提供正式入口。 |
| 本模块允许 | 写入开工记录、必读文档记录、Step 7 / Step 8 承接、SOP 输出门禁、watch / redline、03 影响判定和 R8.3 入口。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写最终敏感配置表、具体 secret provider 产品、最终 key、默认值、环境变量名、正式 JSON demo、完整配置 demo、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R8.1 已完成并获得继续确认;当前进入 R8.2 再写入。 |

### 2. Step 8 开工记录

| 开工项 | R8.2 记录 |
|---|---|
| 当前 Step | Step 8 定义敏感配置与密钥管理。 |
| 当前目标 | 把 secret / credential / DSN / token / cert 的存储、读取、轮换、审计和禁止输出边界写成可恢复的中间产物。 |
| 执行方式 | 先写入开工记录和必读文档,再进入 R8.3 的 SOP 问题回答与候选收敛。 |
| 首要输入 | Step 7 配置项清单、Step 5 来源优先级、Step 6 profile 矩阵、`00/01/02/03` 安全红线、SOP Step 8、配置设计书写规范 §5.8、设计文档讨论中间产物规范。 |
| 首要产出 | R8.2 开工记录、R8.3 入口、watch / redline 写入、03 影响判定写入。 |
| 当前不做 | 不创建正式 `04-配置设计.md`;不写 secret provider schema;不写真实 secret;不写轮换 runbook;不写测试 / 验收 / 实施计划正文。 |

### 3. 必读文档记录

| 必读文档 | R8.2 用法 |
|---|---|
| `project_execution_ledger.md` | 校准当前 Step 8 恢复点和 next_allowed_action。 |
| `04_config_calibration_flow.md` | 校准 Step 8 当前状态和当前模块排布。 |
| `04_config_step_07_config_items.md` | 承接 Step 7 配置项清单和敏感候选字段。 |
| `04_config_step_05_sources_priority_conflicts.md` | 承接 ordinary source chain、secret ref、fixture、entry-local、watch_only 和来源冲突。 |
| `04_config_step_06_environment_profiles_matrix.md` | 承接 local / CI / integration / operations / staging / production profile 和 P0/P1/P2 隔离。 |
| `配置设计讨论流程_SOP.md` Step 8 | 固定本步目标、输入、输出和问题清单。 |
| `配置设计书写规范.md` §5.8 | 固定敏感配置章节的写法和禁止输出要求。 |
| `设计文档讨论中间产物规范.md` | 固定中间产物、台账同步和暂停条件。 |
| `设计真相源闭环与可落码性标准.md` | 固定缺 schema / port / mapper / evidence 时必须暂停。 |
| `00-需求文档.md` / `01-架构设计.md` / `02-概要设计.md` / `03-详细设计.md` | 继续作为安全边界、正文排除和可观测性红线。 |
| `L1-governance` Step 8 | 只参考结构和门禁深度,不复制治理仓事实。 |

### 4. Step 7 -> Step 8 输入基线写入

| 输入来源 | Step 8 接收方式 | 不得接收 |
|---|---|---|
| Step 7 配置项清单 | 接收 `sensitive-ref`、`ref-sensitive`、endpoint/target/route/replay refs 作为敏感候选池。 | 不把普通阈值、纯 label、debug switch 直接升级为 secret。 |
| Step 5 来源优先级 | 接收 ordinary sources 只能承载 refs,raw secret 不进普通链。 | 不把 config center / admin override 写成 P0 source truth。 |
| Step 6 profile 矩阵 | 接收 local/CI fake ref、integration-like credential ref、production-like secret provider ref 的方向。 | 不把 production secret provider 细节当成已闭口事实。 |
| 正式 `03` §13 / §14 | 接收 config binding、forbidden body、redaction / observability redline。 | 不自行新增 secret provider schema、mapper 或 port。 |
| 旧材料 | 只作为下游方向或污染审计对象。 | 不反向生成 secret key、rotate policy、fixture、AC、commit boundary 或 evidence schema。 |

### 5. SOP Step 8 输出门禁写入

| 输出物 | 写入要求 |
|---|---|
| 开工记录 | 必须固化 Step 8 当前恢复点、目标、执行方式和首要输入。 |
| 必读文档记录 | 必须把 `project_execution_ledger.md`、flow、Step 7 / 5 / 6、SOP、书写规范和中间产物规范写入可恢复记录。 |
| 输入基线 | 必须明确 Step 7 / Step 5 / Step 6 / 03 如何进入 Step 8,不得混入旧实现假设。 |
| watch / redline 记录 | 必须继续记录 config center、admin override、secret provider、endpoint / bus / report target 和 forbidden boundary。 |
| 03 影响判定 | 必须写清什么情况无回写,什么情况必须暂停回 `03`。 |
| R8.3 入口 | 只推进到 SOP 问题回答与敏感配置候选:先思考,不提前写最终敏感配置表。 |

### 6. Watch / redline 写入

| 项 | 当前状态 | Step 8 处理 |
|---|---|---|
| inbound source binding | pass_with_watch | 后续若涉及 source binding,必须复核 formal carrier / adapter constructor / protocol 是否已闭口;缺口回 `03`。 |
| config center | watch_only | 不进入 Step 8 的敏感配置表;不写 remote config、hot reload、live override 或 rollback contract。 |
| admin override | watch_only | 不进入 Step 8 的敏感配置表;不写 operator override、权限模型或审计 schema。 |
| true secret provider schema | not_defined / P1-P2 direction | Step 8 不写 provider schema;后续 Step 9 / `03` 再闭口。 |
| true endpoint / bus / report target schema | not_defined / P1-P2 direction | 不锁 URL、topic、bucket、产品或 credential body。 |
| old MethodContent / publish / snapshot / outbox | redline | 不作为当前敏感配置来源。 |
| forbidden boundary | redline | 任何配置项不得改变 truth owner、state transition、query no-write、job no-truth-repair、body-free、stored replay、transaction boundary、marker source、public schema 或 P0/P1 隔离。 |

### 7. 对 03 的影响判定写入

| Step 8 结论类型 | 是否影响 03 | 处理规则 |
|---|---|---|
| 只把已存在的 sensitive ref / secret ref 整理成敏感配置表 | 通常否 | 记录为 `无回写`,后续 Step 9 校验加载时再复核。 |
| 明确敏感配置存储、明文禁止、轮换、审计和禁止输出规则 | 通常否 | 只要不新增 runtime contract,留在 `04`。 |
| 需要新增 secret provider schema、credential ref carrier、adapter constructor、port 或 mapper | 是 | 暂停并回 `03` owning Step。 |
| 需要把 remote secret provider、config center、admin override、hot reload 或 production product 纳入 P0 | 是 | 暂停,需 `03` / 架构闭口。 |
| 敏感配置试图改变 forbidden boundary | 是且越界 | 立即拒绝,不得在 04 内补口。 |

### 8. R8.3 入口写入

| 下一模块 | 入口说明 |
|---|---|
| `R8.3 SOP 问题回答与敏感配置候选:先思考` | 只允许围绕 SOP Step 8 问题框架逐项回答敏感配置候选、敏感级别归一、禁止输出规则、读取 / 轮换 / 审计承接、watch / redline 和 03 影响判定,不提前写最终敏感配置表。 |
| 当前不进入 | 任何 secret provider schema、真实 secret material、轮换 runbook、测试 / 验收 / 实施计划正文。 |
| 回到 03 条件 | 若 R8.3 需要新增 secret provider schema、credential ref carrier、adapter constructor、port、DTO、mapper、state、flow 或 loader contract,必须暂停并回 `03`。 |

### 9. R8.2 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只写开工与必读文档记录 | pass | 未写最终敏感配置表、secret provider 产品或运行态轮换正文。 |
| 是否承接 Step 7 / Step 5 / Step 6 | pass | 已固化输入基线与来源约束。 |
| 是否保留 watch / redline | pass | config center / admin override / secret provider / endpoint / bus / report target / forbidden boundary 均已记录。 |
| 是否保留 03 回写门禁 | pass | 新增 provider schema / carrier / port / mapper / state / flow 仍需回 `03`。 |
| 是否可进入 R8.3 | pass | 等待用户确认后进入 `R8.3 SOP 问题回答与敏感配置候选:先思考`。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.3 SOP 问题回答与敏感配置候选:先思考`;只允许围绕 SOP Step 8 问题框架逐项回答敏感配置候选、敏感级别归一、禁止输出规则、读取 / 轮换 / 审计承接、watch / redline 和 03 影响判定;不得创建正式 `04-配置设计.md`;不得写最终敏感配置表、具体 secret provider 产品、最终 key、默认值、环境变量名、正式 JSON demo、完整配置 demo、测试方案、验收标准、实施计划或代码。

## R8.3 SOP 问题回答与敏感配置候选:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R8.4 |
| 本模块目标 | 把 Step 8 的 SOP 问题逐项回答成候选结论,锁定敏感配置分类、存储 / 轮换 / 审计 / 禁止输出边界,并为 R8.4 的再写入提供入口。 |
| 本模块允许 | 只做问题回答、候选分类、边界收敛、03 影响判定和 R8.4 入口。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写真实 secret;不引入 secret provider schema / port / mapper / loader contract;不写轮换 runbook、测试用例、验收门禁或实施计划正文。 |
| 恢复依据 | R8.2 已完成开工记录、必读文档、输入基线和 watch / redline;用户已确认继续进入 R8.3。 |

### 2. SOP 问题回答

| 问题 | 候选回答 |
|---|---|
| 哪些配置是 sensitive 或 secret? | `stores.*.configRef` durable refs、`externalResolvers.families[].adapterRef`、`outbox.publisher.adapterRef`、`outbox.transportTopicBindings`、`handoff.traceTargets[]` / `handoff.archiveTargets[]`、`externalGrc.adapterRef` / `targetRef`、`testFixtures.replayArtifactRootRef`、`redaction.*` 中的安全关键项属于 sensitive; raw password / private key / token / cert body / DSN / raw credential 属于 secret; redaction deny list / safe diagnostic prefix / allowHighCardinalityLabels 属于 internal safety-critical。 |
| 敏感配置如何存储,是否允许明文? | 普通 JSON / env / entry-local 只允许 opaque refs; raw secret 不进入普通配置、文档示例、log、error、audit、trace、report。 |
| 敏感配置如何轮换? | P0 继续采用 restart 或 new job run,不做 hot reload; future secret provider 轮换只在 provider 边界内完成,不进入 runtime truth。 |
| 读取和变更是否需要审计? | 需要;记录 actor / request / scope / old-new redacted digest / reason / validation result / 生效方式,但不记录 raw secret。 |
| 日志、错误返回、审计中如何避免泄露? | 只输出 safe diagnostic ref、redacted digest、issue ref、adapter slot、profile、validation code;不得输出 full sensitive ref、secret material、endpoint、route、credential body、external body。 |
| 每个敏感配置是否回指 Step 7 配置项、来源规则和加载 / 变更机制? | 是;每项必须回指 Step 7、Step 5、Step 9、Step 10;若需要新 loader / builder / adapter contract,停在 03。 |
| 每个敏感配置完成后是否通过停审? | 是;每个 family 完成后停审存储、明文禁止、轮换、审计、禁止输出和 03 影响。 |
| 所有敏感配置完成后,是否存在 raw secret 入文档、普通配置误归类、日志泄露或轮换审计缺口? | 当前候选池无实际 raw secret;剩余只需在 R8.4 核对是否存在误归类、输出泄露、轮换缺口或审计缺口。 |

### 3. 候选收口摘要

| 候选族 | 类别 | 存储方式 | 是否可明文 | 轮换方式 | 审计要求 |
|---|---|---|---|---|---|
| durable store refs | sensitive | 普通配置只保存 store ref | 否 | 新 ref + restart | redacted old/new digest, validation result |
| resolver / publisher / route refs | sensitive | 普通配置只保存 adapter / route ref | 否 | 新 ref + restart | slot / family / availability marker |
| handoff / archive target refs | sensitive | 普通配置 / job input 只保存 target ref | 否 | 新 ref + restart or new job run | target digest, run id, marker refs |
| external GRC refs | sensitive | 普通配置只保存 adapter / target ref | 否 | new ref + restart,默认 disabled | enablement change audit |
| replay artifact refs | sensitive | replay config / job input only | 否 | new replay ref per run | de-identification marker |
| redaction safety config | internal safety-critical | 普通配置保存 deny / prefix / bool | 部分可明文,但不得放空 | restart | critical review and validation result |
| raw secret material | secret | 不得进入普通配置 | 否 | provider-side rotation only | provider digest only |

### 4. 当前文档问题诊断

| 位置 | 当前问题 | R8.3 处理 |
|---|---|---|
| 敏感级别分类 | Step 8 已有候选表,但还未把 `sensitive` / `secret` / `internal` 的边界压成 SOP 问题回答。 | 以问题回答形式冻结候选边界,避免普通配置和 secret 混写。 |
| 存储与轮换 | 需要确认普通配置只保留 opaque refs,并继续禁止 hot reload。 | 维持 restart / new job run 口径。 |
| 审计与禁输 | 需要把 log / error / audit / report / trace 的 redaction 口径冻结。 | 只允许 safe diagnostic ref / redacted digest / issue ref。 |
| 03 影响 | 还未出现新的 provider schema / port / mapper / flow。 | 暂不回写 03,只保留 blocker 判定。 |

### 5. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 仅把现有 sensitive ref / secret ref 归类为敏感配置 | 否 | 配置文档收敛 | 不适用 | 无回写 |
| 明确普通配置只保存 opaque refs,raw secret 禁止进入正文 | 否 | 承接 `03` forbidden body | 不适用 | 无回写 |
| 轮换保持 restart / new job run | 否 | 承接 P0 无 hot reload | 不适用 | 无回写 |
| 需要新增 secret provider schema / credential carrier / adapter constructor / port / mapper / loader contract | 是 | runtime contract 扩展 | `03` 对应 Step | 阻塞待确认 |

### 6. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_08_sensitive_secrets.md`
>
> 延伸阅读:
> - 继续阅读本步的 `敏感级别归一规则`、`敏感配置读取图`、`敏感配置表`、`Profile 敏感配置处理表`、`禁止输出规则`、`读取 / 轮换 / 审计承接表`、`敏感配置停审记录` 和 `跨敏感配置泄露风险审计表`,理解候选敏感配置如何从 Step 7 的配置项清单中收口。

正式 `04-配置设计.md` §8 的本次回填草稿应继续承接:

- 敏感级别归一规则。
- 敏感配置读取图。
- 敏感配置表。
- Profile 敏感配置处理表。
- 禁止输出规则。
- 读取 / 轮换 / 审计承接表。
- 错误模式与处理表。
- 敏感配置停审记录。
- 跨敏感配置泄露风险审计表。
- 对详细设计的影响判定。

### 7. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| future secret provider 产品和 API 是否进入 staging/production-like | 影响 adapter constructor、runtime builder、loading validation | P0 不定义;留到后续风险记录 |
| secret rotation 是否需要 zero-downtime reload | 影响 `03` reload contract、rollback、audit | P0 不支持;继续使用 restart / new job run |
| route / target ref 是否需要更细粒度 redaction 格式 | 影响 log/error/report schema | Step 9 / Step 10 再细化 digest 规则 |
| redaction deny list 变更的审批层级 | 影响变更审计 | Step 10 定义 |
| operations-replay artifact root 的脱敏证明格式 | 影响测试 / 验收证据 | Step 12 下游承接 |

### 8. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 敏感配置候选边界已回答 | 通过 | 见 SOP 问题回答 |
| 存储、轮换、审计、禁输口径已冻结 | 通过 | 维持 opaque refs + restart / new job run |
| 03 影响判定无新增 contract | 通过 | 当前无回写 |
| 可进入 R8.4 | 通过 | 下一步为 `R8.4 SOP 问题回答与敏感配置候选:再写入` |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.4 SOP 问题回答与敏感配置候选:再写入`;只允许把 R8.3 的 SOP 问题回答和候选收口写成可恢复记录、停审记录、回填草稿和 03 影响判定;不得创建正式 `04-配置设计.md`;不得写最终敏感配置表、具体 secret provider 产品、最终 key、默认值、环境变量名、正式 JSON demo、完整配置 demo、测试方案、验收标准、实施计划或代码。

## R8.4 SOP 问题回答与敏感配置候选:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R9.1 |
| 本模块目标 | 将 R8.3 的候选回答固化为敏感配置正式中间产物,补齐敏感级别归一、读取 / 轮换 / 审计承接、禁止输出、停审记录和 03 影响判定的可恢复写入。 |
| 本模块允许 | 写入敏感级别归一规则、敏感配置读取图、敏感配置表、Profile 敏感配置处理表、禁止输出规则、读取 / 轮换 / 审计承接表、错误模式与处理表、停审记录和跨敏感配置泄露风险审计表。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写 secret provider schema / port / mapper / loader contract;不写真实 secret;不写轮换 runbook、测试用例、验收门禁或实施计划正文。 |
| 恢复依据 | R8.3 已完成问题回答和候选收口;当前进入 R8.4 再写入。 |

### 2. 敏感级别归一规则

| 规范级别 | 本项目含义 | Step 7 标签映射 | 处理要求 |
|---|---|---|---|
| `public` | 可公开、无安全含义的 feature label 或 false/true feature gate。 | `non-sensitive` 中可公开部分。 | 可进入普通配置和文档示例。 |
| `internal` | 内部运行配置、阈值、retry/batch/timeout、redaction field refs 等。 | `non-sensitive`、`security-critical`。 | 可进入内部配置;变更可能需要审计;不得输出 external body。 |
| `sensitive` | 暴露会产生安全、运营、拓扑或审计风险的 refs。 | `sensitive-ref`、`ref-sensitive`、endpoint/target/route/replay refs。 | 普通配置只能保存 opaque ref;日志/错误/report/audit 不得输出 full value。 |
| `secret` | 真实秘密材料,例如 password、private key、raw token、cert body、raw DSN、raw credential。 | Step 7 不允许出现。 | 不得写入普通配置、文档示例、日志、错误、审计、trace、outbox、report。 |

### 3. 敏感配置读取图

```text
[ordinary config sources]
  -> [opaque sensitive refs only]
  -> [config parse / validate]
  -> [redacted config identity + validation issue refs]
  -> [runtime builder]
  -> [adapter registry / store registry]
  -> [application ports]

[future secret provider]
  -> [adapter-internal credential resolution]
  -> [never exposed to application/domain/contracts]
```

关键说明:

- 普通 config file、env、entry-local 只能给 opaque ref,不能给真实 secret material。
- `infra::config` 只输出 validated refs、digest、redacted validation issues,不输出 raw secret 或 endpoint body。
- `application`、`domain`、`contracts` 不读取 secret provider,也不持有 raw secret。
- future secret provider 只在 adapter 内部解析 credential,解析结果不得写入 Governance truth、outbox、trace、audit 或 report。
- secret provider 不可用时,必须按 profile / adapter 规则 fail-fast、reject job 或返回 failed marker,不得 fallback fake success。

### 4. 敏感配置表

| 配置项 | 敏感级别 | 存储方式 | 是否可明文 | 轮换方式 | 审计要求 |
|---|---|---|---|---|---|
| `stores.truth.configRef` when durable-backed | `sensitive` | 普通配置只保存 `GovernanceStoreConfigRef` | 不可保存 DSN / credential / URL body | 新 store ref + restart;future provider rotation 后重建 adapter | 记录 redacted old/new ref digest、profile、validation result |
| `stores.projection.configRef` when durable-backed | `sensitive` | 普通配置只保存 store ref | 不可保存 DSN / credential / URL body | 新 ref + restart | 记录 redacted ref digest 和 projection store slot |
| `stores.reference.configRef` when durable-backed | `sensitive` | 普通配置只保存 store ref | 不可保存 external body / credential | 新 ref + restart | 记录 redacted ref digest 和 reference store slot |
| `stores.outbox.configRef` when durable-backed | `sensitive` | 普通配置只保存 store ref | 不可保存 DSN / queue credential | 新 ref + restart | 记录 redacted ref digest 和 outbox store slot |
| `stores.idempotency.configRef` when durable-backed | `sensitive` | 普通配置只保存 store ref | 不可保存 DSN / credential | 新 ref + restart | 记录 redacted ref digest 和 duplicate replay retention compatibility |
| `externalResolvers.families[].adapterRef` when endpoint-backed | `sensitive` | 普通配置只保存 resolver adapter ref | 不可保存 endpoint credential、HTTP body 或 sibling response body | 新 adapter ref + restart;job retry sees new runtime only after restart | 记录 resolver family、redacted ref digest、availability marker |
| `outbox.publisher.adapterRef` when transport-backed | `sensitive` | 普通配置只保存 publisher adapter ref | 不可保存 bus credential、route secret 或 publish response body | 新 publisher ref + restart | 记录 publisher slot、redacted ref digest、topic completeness validation |
| `outbox.transportTopicBindings` for real transport | `sensitive` | 普通配置只保存 topic-neutral key 到 route ref 的映射 | 不可保存 credential、raw topic secret 或 payload body | 新 route refs + restart;enabled keys must validate before serving | 记录 changed keys、redacted route digest、enabled event coverage |
| `handoff.traceTargets[]` | `sensitive` | 普通配置 / job input 只保存 `TraceHandoffTargetRef` | 不可保存 observability target credential、ledger body 或 package body | 新 target ref + restart or new job run | 记录 target digest、job run id、handoff marker refs |
| `handoff.archiveTargets[]` | `sensitive` | 普通配置 / job input 只保存 target ref | 不可保存 archive credential、archive package body | 新 target ref + restart or new job run | 记录 target digest、archive marker refs、validation result |
| `externalGrc.adapterRef` | `sensitive` | 普通配置只保存 optional adapter ref | 不可保存 external GRC credential or export body | 新 adapter ref + restart;enabled false disables export | 记录 enabled change、redacted adapter digest、validation result |
| `externalGrc.targetRef` | `sensitive` | 普通配置 / job input 只保存 target ref | 不可保存 external GRC endpoint credential or response body | 新 target ref + restart or new export job | 记录 target digest、job run id、export marker refs |
| `testFixtures.replayArtifactRootRef` | `sensitive` | replay config / job input 只保存脱敏 artifact root ref | 不可保存 raw historical body、raw artifact、external payload | new replay ref per run | 记录 run id、artifact root digest、de-identification marker |
| `redaction.denyFieldRefs[]` | `internal` safety-critical | 普通配置保存 forbidden field refs | 可保存 field refs;不可保存 matched raw values | 新 deny list + restart;Step 10 要求评审 | 记录 added/removed field refs、actor、reason、validation result |
| `redaction.safeDiagnosticRefPrefix` | `internal` | 普通配置保存 prefix | 可明文保存 prefix;不得包含 secret/body | 新 prefix + restart | 记录 prefix digest and collision validation |
| `redaction.allowHighCardinalityLabels` | `internal` safety-critical | 普通配置保存 bool | 可明文保存 bool;P0 必须 false | P0 不允许改为 true;future 改动需正式设计 | rejected attempts must create config validation issue ref |
| future raw secret material | `secret` | 不得存储于普通配置;future 仅由 approved secret provider 承载 | 不可明文 | provider-side rotation;Governance runtime 只重读 ref / restart | 只记录 provider ref digest,不得记录 material |

### 5. Profile 敏感配置处理表

| Profile | 允许的敏感表示 | 禁止项 | 不可用策略 |
|---|---|---|---|
| `local-dev` | fake refs、in-memory store refs、fake target refs。 | raw secret、real endpoint credential、external body。 | invalid ref fail-fast;missing optional fake target only when feature disabled。 |
| `ci-test` | deterministic fixture refs、fake store/adapter refs、fixed clock/id refs。 | production secret、real target credential、raw fixture body in config。 | fixture missing test fail-fast。 |
| `integration-like` | controlled / real-like adapter refs、credential refs、endpoint refs、target refs。 | raw credential material、sibling body、fake fallback after controlled adapter selected。 | unavailable -> degraded / delayed / failed marker according to adapter role。 |
| `operations-replay` | replay artifact root refs、historical de-identified refs、fake or controlled target refs。 | raw historical body、raw secret、raw external payload。 | missing replay ref rejected;failed target enters job report。 |
| `staging-like` | future secret provider refs、durable store refs、transport route refs。 | raw secret in JSON/env;test fixture override。 | provider unavailable fail-fast or job rejected。 |
| `production-like` | future approved secret provider refs only。 | ordinary raw secret、fake override、test fixture、raw endpoint/body。 | provider unavailable fail-fast;no fake fallback。 |

### 6. 禁止输出规则

| 输出面 | 允许输出 | 禁止输出 |
|---|---|---|
| structured log | operation name、adapter slot、profile、safe error code、safe diagnostic ref、redacted config issue ref | full sensitive ref、secret material、endpoint、route、credential、external response body |
| error response | public / internal error code、validation issue ref、safe message | secret、full target ref、full route ref、raw body、adapter error body |
| audit record | actor ref、change request ref、config section、old/new redacted digest、reason ref、validation result | raw config、raw secret、full sensitive ref、external body |
| trace / span | trace context ref、operation ref、adapter slot、safe diagnostic ref | secret、credential、package body、payload body、high-cardinality raw value |
| metric labels | low-cardinality outcome、adapter slot、profile、error class | full ref、endpoint、route、actor free text、external body digest not approved as safe |
| job report | marker refs、failed reference refs、safe issue refs、counts | full secret/target credential、package body、external GRC response body |
| outbox payload | stored public event payload snapshot from accepted truth | config refs that are not part of public payload、secret、credential、adapter route |
| generated artifacts | redacted evidence indexes and safe report refs | raw config files with secrets、secret provider response、external payload body |

### 7. 读取 / 轮换 / 审计承接表

| 敏感配置族 | Step 7 回指 | Step 5 来源规则 | Step 9 加载机制承接 | Step 10 变更审计承接 |
|---|---|---|---|---|
| durable store refs | `stores.*.configRef` | ordinary sources only carry refs | validate ref shape,assemble store registry,fail-fast on required store missing | high-risk startup config change,requires old/new redacted digest |
| resolver adapter refs | `externalResolvers.families[].adapterRef` | refs only;fixture only test | validate family coverage,mode/profile compatibility,availability marker | adapter binding change audit per resolver family |
| publisher / route refs | `outbox.publisher.adapterRef`, `outbox.transportTopicBindings` | refs only;topic completeness required | validate enabled event keys and publisher availability | publisher/topic binding change audit |
| handoff / archive target refs | `handoff.traceTargets[]`, `handoff.archiveTargets[]` | config refs or job input refs | validate target enabled before job;reject missing target | target change and per-run target use audit |
| external GRC refs | `externalGrc.adapterRef`, `externalGrc.targetRef` | defaults disabled;explicit refs only when enabled | enabled requires adapter+target;disabled skips export | external export enablement high-risk audit |
| replay artifact refs | `testFixtures.replayArtifactRootRef` | replay config/job input only | operations-replay requires de-identified root ref | replay run audit with artifact root digest |
| redaction safety config | `redaction.*` | defaults/file/env,high-priority invalid fail-fast | validate deny list not empty and unsafe relax rejected | critical audit;changes require review in Step 10 |
| future raw secret provider refs | no raw Step 7 item;future ref extension only | ordinary source may carry provider ref,not material | requires future `03` contract or adapter-local resolution | provider rotation audit without material |

### 8. 错误模式与处理表

| 场景 | 正式处理 | 不允许的处理 |
|---|---|---|
| ordinary config includes raw secret material | config validation reject | parse as string and continue |
| env contains malformed sensitive ref | fail-fast,do not fallback to lower priority | silently ignore env |
| production-like selects fake resolver/publisher/target | profile validation reject | fallback fake success |
| external GRC enabled but adapter/target missing | startup fail-fast or export job rejected | disable silently |
| route/topic binding missing for enabled event key | startup fail-fast | drop event or ad hoc topic |
| redaction deny list empty | startup fail-fast | allow all fields |
| job input contains raw target credential | job rejected | store in report for adapter |
| replay artifact root points to raw body bundle | job rejected / validation issue | replay raw historical body |
| adapter returns raw external error body | map to redacted failure ref | persist adapter error body |
| future secret provider unavailable | fail-fast / rejected / failed marker by profile | fallback to test fixture in production-like |

### 9. 敏感配置停审记录

| 配置项 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `stores.*.configRef` durable path | 存储方式、明文禁止、轮换、审计、输出 | 通过 | P0 in-memory;durable 产品留 P1/P2 |
| `externalResolvers.families[].adapterRef` | endpoint credential 和 sibling body 是否排除 | 通过 | controlled adapter 不保存 raw response |
| `outbox.publisher.adapterRef` | bus credential 和 publish response 是否排除 | 通过 | publisher failure 只给 redacted failure ref |
| `outbox.transportTopicBindings` | route ref 是否不改变 schema | 通过 | topic-neutral key 不变 |
| `handoff.traceTargets[]` / `handoff.archiveTargets[]` | target credential、package body 是否排除 | 通过 | failed target 只进 failed ref / marker |
| `externalGrc.adapterRef` / `externalGrc.targetRef` | external GRC credential/body 是否排除 | 通过 | default disabled |
| `testFixtures.replayArtifactRootRef` | replay raw body 是否排除 | 通过 | operations-replay 必须脱敏 ref |
| `redaction.denyFieldRefs[]` | deny list 是否安全关键、变更需审计 | 通过 | Step 10 细化评审 |
| raw secret material | 是否进入普通配置 | 通过 | 明确 forbidden |
| log/error/audit/report/trace | 是否禁止输出 sensitive / secret | 通过 | 只允许 redacted digest / issue ref |

### 10. 跨敏感配置泄露风险审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 文档是否包含实际 secret material | 未发现 | 仅使用类别名和 opaque ref 示例 |
| 普通配置是否可保存 raw secret | 不可 | validation reject |
| env 是否可覆盖为 raw credential | 不可 | env 只能提供 ref;malformed fail-fast |
| entry-local 是否可传 raw target credential | 不可 | job/entry rejected |
| test fixture 是否可进入 production-like | 不可 | profile validation reject |
| sensitive ref 是否会进入日志 / 错误 / audit | 不应 | 只允许 redacted digest / issue ref |
| route / target ref 是否误判 public | 已修正 | real transport / target ref 视为 sensitive |
| redaction deny list 是否可能被放空 | 不可 | empty fail-fast |
| future secret provider 是否新增 `03` 契约 | 是,若进入 P0/P1 implementation | 当前记录为未来回写点 |
| 轮换是否需要 hot reload | 否 | P0 restart / new job run |
| external body 是否可能通过 config 入仓 | 不可 | forbidden body validation reject |
| 是否需要回写 `03` | 当前无 | 真实 secret provider / hot reload / product schema 需要未来回写 |

### 11. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| Step 7 非正式标签归并为 `public` / `internal` / `sensitive` / `secret` | 否 | 配置文档术语收敛 | 不适用 | 无回写 |
| 普通 JSON / env / entry-local 只能保存 opaque sensitive refs,不能保存 raw secret material | 否 | 承接 Step 5 / `03` forbidden body 边界 | 不适用 | 无回写 |
| P0 不指定具体 secret provider 产品或 API | 否 | 范围裁剪 | 不适用 | 无回写 |
| 敏感 ref 轮换通过 restart 或 new job run 生效 | 否 | 承接 P0 无 hot update | 不适用 | 无回写 |
| 日志、错误、审计、trace、report 只能输出 redacted digest / issue ref | 否 | 承接 `03` 可观测性安全字段 | 不适用 | 无回写 |
| 若后续要求 adapter 在 runtime builder 中解析真实 secret provider、支持 hot reload、admin override 或产品级 credential schema | 是 | runtime config / adapter constructor / secret loading / audit rollback contract | `03` §13 / Step 14 / object-port-flow 对应 Step | 阻塞待确认 |

### 12. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_08_sensitive_secrets.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“敏感级别归一规则”“敏感配置读取图”“敏感配置表”“Profile 敏感配置处理表”“禁止输出规则”“读取 / 轮换 / 审计承接表”“敏感配置停审记录”和“跨敏感配置泄露风险审计表”小节,理解 secret / credential / route / target / replay refs 如何收口。

正式 `04-配置设计.md` §8 应回填:

- 敏感级别归一规则。
- 敏感配置读取图。
- 敏感配置表。
- Profile 敏感配置处理表。
- 禁止输出规则。
- 读取 / 轮换 / 审计承接表。
- 错误模式与处理表。
- 敏感配置停审记录。
- 跨敏感配置泄露风险审计表。
- 对详细设计的影响判定。

### 13. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 敏感配置候选边界已回答 | 通过 | 见 R8.3 |
| 存储、轮换、审计、禁输口径已冻结 | 通过 | 维持 opaque refs + restart / new job run |
| 03 影响判定无新增 contract | 通过 | 当前无回写 |
| 可进入 Step 9 | 通过 | 下一步定义配置加载、校验与生效机制 |

next_allowed_action: 等待用户确认后进入 Step 9 `R9.1 开工与必读文档:先思考`;只允许围绕 Step 9 的加载、解析、校验、装配和生效边界做先思考,不得创建正式 `04-配置设计.md`;不得写最终加载流程、校验实现、正式 runtime builder 代码、测试方案、验收标准、实施计划或代码。
