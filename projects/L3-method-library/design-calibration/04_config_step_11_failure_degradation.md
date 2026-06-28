# Step 11. 定义失效模式与降级 / fail-fast 策略

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 11
> 回填章节: `04-配置设计.md` §11 失效模式与降级 / fail-fast 策略
> 当前状态: `R11.20 Step 11 最终停审与 Step 12 切换:再写入` completed_wait_user_confirm_to_R12.1;等待用户确认进入 Step 12 `R12.1 开工与必读文档:先思考`

---

## 0. Step 11 边界

Step 11 在 Step 5 来源优先级、Step 7 配置项清单、Step 8 敏感配置、Step 9 加载 / 校验 / 生效机制和 Step 10 配置变更 / 审计 / 回滚完成候选闭合之后,定义配置缺失、错误、不可达、过期、漂移时系统如何失效、拒绝、降级、延迟或告警。

本 Step 只回答:

- 必填配置缺失、类型错误、范围错误、交叉字段错误时如何处理。
- 高优先级非法来源是否允许 fallback。
- 敏感配置、raw secret、raw body、full sensitive ref、redaction unsafe 时如何 fail-closed。
- 外部依赖不可用、adapter unavailable、publisher/target unavailable 与非法配置如何区分。
- startup、job-run-start、entry-local、test harness 和 runtime adapter call 各自的失效策略。
- 失效模式是否告警、写哪些 safe diagnostic / issue / marker,以及后续测试切口。

本 Step 不定义:

- 具体告警平台、SLO、pager、dashboard、runbook、部署产品或运维命令。
- 具体 secret provider / KMS / Vault / cloud credential API。
- remote config center、admin override、runtime hot reload、live mutation 或 online last-known-good。
- retry/backoff 的精确时间参数、scheduler 实现、DLQ 产品或 durable adapter 产品。
- 新的 DTO、port、mapper、repository、persistence schema、config key、test case ID 或 evidence schema。

## R11.1 开工与必读文档:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R11.2 |
| 本模块目标 | 思考 Step 11 的开工边界、必读文档、输入基线、SOP 输出门禁、watch / redline、03 影响判定和 R11.2 写入计划。 |
| 本模块允许 | 写开工边界思考、必读文档思考、输入基线思考、输出框架思考、watch / redline、03 影响预判和 R11.2 计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写最终失效模式表;不一次性写 Step 11 全量内容;不进入测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | Step 10 R10.20 已完成收口候选,并明确等待用户确认进入 Step 11 R11.1。 |

### 2. Step 11 开工边界思考

| 边界项 | 思考结论 |
|---|---|
| 当前定位 | 把 Step 5 / 7 / 8 / 9 / 10 的配置来源、配置项、敏感性、生效方式、变更回滚候选转成失效模式和系统行为候选。 |
| 处理范围 | 缺配置、错配置、敏感配置不可读、配置中心不可达或不适用、配置漂移 / 过期、外部依赖不可用、rollback failed。 |
| 策略词表 | 使用 fail-fast、fail-closed、degraded、delayed、failed marker、rejected、test fail-fast、no activation。 |
| last-known-good | 当前 P0 不支持 online last-known-good/live switch;只允许 previous validated digest restart、new run、entry rerun、test rerun。 |
| config center | 当前 P0 无 remote config center/admin override;不可达场景只能作为 future/watch,不能写成运行依赖。 |
| degraded 边界 | degraded 只用于运行期依赖 / read material / optional surface,不能把 invalid config 降级为成功启动。 |
| truth 边界 | 失效策略不得修复 truth、改写 stored report、改写 stored replay surface 或改变 marker source。 |
| 对 03 的影响 | 若需要新增 error DTO、state、port、mapper、availability marker、persistence 或 recovery surface,必须回 `03` owning Step。 |

### 3. 必读文档思考

| 必读文档 | 读取目的 | Step 11 使用方式 |
|---|---|---|
| `project_execution_ledger.md` | 确认当前恢复点和用户确认门禁。 | 写入当前 R11.1 恢复依据。 |
| `04_config_calibration_flow.md` | 确认 Step 11 状态、执行纪律和正式文档装配边界。 | 同步 Step 11 当前状态和 next_allowed_action。 |
| `配置设计讨论流程_SOP.md` Step 11 | 固定目标、输入、输出、问题清单和进入下一步条件。 | R11.2 起按 SOP 形成失效模式候选。 |
| `配置设计书写规范.md` §4.9 / §5.11 / §11 | 固定策略词表和失效模式表列。 | 使用 `失效模式 / 影响 / 系统行为 / 是否告警 / 测试切口`。 |
| `04_config_step_05_sources_priority_conflicts.md` | 提供来源优先级、冲突处理、高优先级非法值不 fallback。 | 失效模式必须继承 no silent fallback。 |
| `04_config_step_07_config_items.md` | 提供配置项、必填性、作用域、敏感级别和 failure hint。 | 逐配置域形成缺失 / 错误 / 不可用处理。 |
| `04_config_step_08_sensitive_secrets.md` | 提供 raw secret 禁入、opaque ref、redacted digest、禁输和敏感 profile 限制。 | 形成 fail-closed 与禁止输出规则。 |
| `04_config_step_09_loading_validation_activation.md` | 提供 startup、job-run-start、entry-local、test harness、unsupported reload/hot。 | 按生效方式区分失效策略。 |
| `04_config_step_10_change_audit_rollback.md` | 提供 rollback、audit、cross-change audit 和 Step 11 handoff。 | 继承 previous validated/new run/rerun/no activation。 |
| `projects/L3-method-library/03-详细设计.md` | 提供 runtime builder、adapter availability、safe error、config binding、observability 和 redline。 | 不自行补 DTO/port/mapper/marker/config。 |
| L1-governance Step 11 | 提供框架深度参考。 | 只参考结构,不复制治理仓领域事实。 |

### 4. 输入基线思考

| 输入来源 | Step 11 接收内容 | 不得接收 |
|---|---|---|
| Step 5 来源优先级 | defaults/file/env/entry-local/job input/test fixture 的优先级和冲突处理。 | 不得允许高优先级非法值 silent fallback。 |
| Step 7 配置项 | 配置项作用域、必填性、敏感级别、加载时机和 failure hint。 | 不得新增未确认配置项、默认值、key 或 env 名。 |
| Step 8 敏感配置 | opaque refs、redacted digest、禁止 raw secret/body/full ref。 | 不得定义 secret provider schema 或输出敏感正文。 |
| Step 9 加载生效 | startup restart、job-run-start new run、entry-local rerun、test harness rerun、unsupported reload/hot。 | 不得写 runtime hot reload / config center success path。 |
| Step 10 变更回滚 | previous validated digest、new run、entry rerun、test rerun、no activation、safe audit。 | 不得用 rollback 改写 truth/report/replay。 |
| 正式 `03` | safe error、availability / degraded 口径、runtime builder、adapter binding、observability redline。 | 不得补正式 DTO、port、marker、mapper 或 persistence。 |

### 5. SOP Step 11 输出框架思考

| 输出 | 思考方向 |
|---|---|
| 失效模式表 | 必须覆盖缺配置、错配置、敏感配置不可读 / 禁止、config center 不适用 / future、漂移 / 过期、adapter unavailable、rollback failed。 |
| 系统行为 | 用 fail-fast、fail-closed、reject current run/entry、test fail-fast、degraded、delayed、failed marker、no activation 表达。 |
| 告警规则 | 只写是否告警、推荐级别和 safe 字段方向,不写具体平台或阈值。 |
| 测试切口 | 只写可测试场景候选,不写 TC ID、fixture schema、evidence schema。 |
| 按配置域策略表 | 后续可按 runtime、stores、resolvers、inbound、outbox、jobs、handoff、externalGrc、redaction、boundary、idempotency、projection/reference、clock/id、test/replay 分组。 |
| 生效方式矩阵 | 后续可按 startup、job-run-start、entry-local、test harness、runtime adapter call、critical rejected 分组。 |
| 停审记录 | 每类失效完成后停审:高风险无 silent fallback、敏感无泄露、invalid config 不 degraded、Step 11 未新增 03 缺口。 |

### 6. Watch / redline 带入思考

| 项 | 类型 | Step 11 处理 |
|---|---|---|
| config center | watch_only | 当前 P0 不依赖,不可达不影响 runtime;若未来引入,必须回 `03` / 架构。 |
| admin override | watch_only | 不写 live override、emergency override 或在线修复。 |
| hot reload / live mutation | redline | unsupported config 必须 reject / fail-fast,不能写成 success path。 |
| online last-known-good | redline for P0 | 不支持 live switch;只允许 previous validated restart/new run/rerun。 |
| high-priority invalid fallback | redline | env/entry/job 等高优先级值非法时不得 fallback 低优先级。 |
| raw secret / raw body / full sensitive ref | redline | errors/logs/reports/evidence 只能 safe refs / digest / issue refs。 |
| invalid config degraded | redline | invalid config 不能 degraded 成可运行成功;startup fail-fast or scoped reject。 |
| truth/report/replay repair | redline | failure handling 不得修复 truth、改写 stored report 或 replay surface。 |
| fake fallback in production-like | redline | required dependency unavailable 不能 fallback fake。 |

### 7. 对 03 的影响判定框架

| Step 11 结论类型 | 是否影响 03 | 处理 |
|---|---|---|
| 只把既有配置候选映射到 fail-fast / fail-closed / reject / degraded / delayed / failed marker | 否 | 可留在 04 Step 11。 |
| 只定义告警 safe 字段和测试切口方向 | 否 | 可留在 04 Step 11。 |
| 发现需要新增 error DTO、availability marker、degraded marker、port、mapper、repository 或 persistence | 是 | 暂停并回 `03` owning Step。 |
| 发现需要具体 config center、secret provider、runtime hot reload、online last-known-good | 是且越界 | 当前 P0 不闭口,记录 watch/blocker。 |
| 发现测试/evidence/schema 需求 | 否,但越过 Step 11 | 交后续 `05-测试方案.md` 或 Step 12 承接。 |

### 8. R11.2 写入计划

| R11.2 拟写内容 | 写入边界 |
|---|---|
| 开工记录 | 固化 Step 11 当前恢复点、目标、允许和禁止范围。 |
| 必读文档记录 | 固化 SOP、书写规范、Step 5/7/8/9/10、正式 `03` 和 L1-governance 框架参考。 |
| 输入基线记录 | 固化 Step 11 可接收 / 不得接收内容。 |
| SOP 输出门禁 | 固化失效模式表、按配置域策略表、生效方式矩阵、告警规则、测试切口和停审记录候选方向。 |
| watch / redline | 固化 config center、admin override、hot reload、last-known-good、raw secret、invalid degraded、truth repair 等红线。 |
| 03 影响判定 | 固化无回写、待回写和越界判断。 |
| R11.3 入口 | 进入 SOP 问题回答与策略词表候选:先思考。 |

### 9. R11.1 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做开工思考 | pass | 未写最终失效模式表。 |
| 是否读取 Step 11 SOP / 书写规范 | pass | 已提取目标、输入、输出、问题和表格列。 |
| 是否承接 Step 5 / 7 / 8 / 9 / 10 | pass | 来源、配置项、敏感性、生效机制和 rollback handoff 均已纳入。 |
| 是否保留 watch / redline | pass | config center、admin override、hot reload、last-known-good、raw secret、truth repair 均未放开。 |
| 是否保留 03 回写门禁 | pass | 新增 DTO/port/marker/mapper/persistence 仍需回 `03`。 |
| 是否可进入 R11.2 | pass | 等待用户确认后进入开工与必读文档再写入。 |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.2 开工与必读文档:再写入`;只允许把 R11.1 的开工边界、必读文档、输入基线、SOP 输出门禁、watch / redline、03 影响判定和 R11.3 入口写成可恢复记录;不得创建正式 `04-配置设计.md`;不得写最终失效模式表、测试方案、验收标准、实施计划或代码。

## R11.2 开工与必读文档:再写入

### 1. 当前模块状态记录

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R11.3 |
| 本模块目标 | 将 R11.1 的开工思考固化为可恢复、可审查、可继续执行的 Step 11 开工记录。 |
| 本模块已写入 | 开工记录、必读文档记录、输入基线记录、SOP 输出门禁记录、watch / redline 记录、03 影响判定记录、R11.3 入口和停审记录。 |
| 本模块未写入 | 未写最终失效模式表;未写逐配置域策略表;未写测试方案、验收标准、实施计划或代码。 |
| 当前恢复口径 | 用户已确认从 R11.1 进入 R11.2;R11.2 完成后等待用户确认进入 R11.3。 |

### 2. 开工记录

| 记录项 | 固化内容 |
|---|---|
| Step 定位 | Step 11 负责把 Step 5 / 7 / 8 / 9 / 10 的候选结论转成配置失效、拒绝、降级、延迟、告警和测试切口的设计候选。 |
| 讨论前提 | 当前没有正式 `04-配置设计.md`;正式文档只能在 Step 15 装配。 |
| 主要输入 | 来源优先级、配置项清单、敏感配置、加载校验生效机制、变更审计回滚、正式 `03` 的 runtime / adapter / safe error / observability 口径。 |
| 主要输出 | 后续模块将形成失效模式表、策略词表、按配置域策略、生效方式矩阵、告警口径、测试切口和 03 影响判定。 |
| 当前禁止 | 不把 invalid config 写成 degraded success;不引入 runtime hot reload、remote config center、admin override 或 online last-known-good success path。 |

### 3. 必读文档记录

| 必读文档 | 已固化用途 | 读取门禁 |
|---|---|---|
| `project_execution_ledger.md` | 确认当前文档、当前 Step、当前模块、恢复顺序和用户确认门禁。 | 后续每次继续必须先读。 |
| `04_config_calibration_flow.md` | 确认 Step 11 状态、Step 12 以后仍 pending、正式 `04` 不得提前创建。 | R11.2 完成后同步到 R11.3 等待确认。 |
| `04_config_step_11_failure_degradation.md` | 承载 Step 11 全部中间产物和恢复记录。 | 后续模块只在本文件继续追加。 |
| `standards/document/配置设计讨论流程_SOP.md` Step 11 | 固定 Step 11 的问题回答、输出表和进入下一步条件。 | R11.3 起按 SOP 问题逐项回答。 |
| `standards/document/配置设计书写规范.md` §4.9 / §5.11 / §11 | 固定策略词表和失效模式表列。 | 后续失效模式表必须使用规范列。 |
| Step 5 / 7 / 8 / 9 / 10 中间产物 | 提供来源、配置项、敏感性、生效方式、变更与回滚输入。 | 不得跳过上游候选自造策略。 |
| `projects/L3-method-library/03-详细设计.md` | 提供 runtime builder、adapter availability、safe error、redaction、observability 和红线。 | 新增 DTO / port / mapper / marker / persistence 必须回 `03`。 |
| L1-governance Step 11 | 只作为框架深度参考。 | 不得复制 governance 领域事实。 |

### 4. 输入基线记录

| 输入域 | Step 11 可接收内容 | Step 11 不得接收内容 |
|---|---|---|
| 来源优先级 | 高优先级非法值拒绝、冲突记录、no silent fallback。 | 不得把 env / entry / job 的非法值降级到低优先级默认值。 |
| 配置项清单 | 必填性、作用域、加载时机、敏感级别、failure hint。 | 不得新增未确认 key、默认值、env 名或 profile。 |
| 敏感配置 | opaque ref、redacted digest、safe diagnostic、禁止 raw secret。 | 不得在 error/log/report/evidence 输出 raw secret、raw body、full sensitive ref。 |
| 加载 / 校验 / 生效 | startup、job-run-start、entry-local、test harness、unsupported reload/hot 的生效边界。 | 不得把 runtime hot reload、live mutation 写成 P0 成功路径。 |
| 变更 / 审计 / 回滚 | previous validated digest restart、new run、entry rerun、test rerun、no activation。 | 不得通过 rollback 修复 truth、stored report、stored replay 或业务状态。 |
| 正式详细设计 | safe error、adapter unavailable、degraded marker、body-free、query no-write、transaction boundary。 | 不得在 04 中私自补对象、端口、mapper、schema 或 marker 来源。 |

### 5. SOP 输出门禁记录

| 输出门禁 | R11.2 固化要求 |
|---|---|
| 失效模式表 | 后续必须使用 `失效模式 / 影响 / 系统行为 / 是否告警 / 测试切口` 列;R11.2 不写最终表。 |
| 策略词表 | 后续只能使用已定义语义的 fail-fast、fail-closed、degraded、delayed、failed marker、rejected、test fail-fast、no activation 等策略词。 |
| 按配置域策略 | 后续至少按 runtime、stores、resolvers、inbound、outbox、jobs、handoff、externalGrc、redaction、boundary、idempotency、projection/reference、clock/id、test/replay 分组判断。 |
| 生效方式矩阵 | 后续必须区分 startup、job-run-start、entry-local、test harness、runtime adapter call 和 critical rejected。 |
| 告警规则 | 只写是否告警、推荐级别、safe 字段方向;不写具体平台、SLO、pager、dashboard 或运维命令。 |
| 测试切口 | 只写场景候选;不写 TC ID、fixture schema、evidence schema。 |
| 停审记录 | 每个后续模块都要检查 silent fallback、敏感泄露、invalid degraded、03 私补和 Step 越界。 |

### 6. Watch / redline 记录

| 项 | 当前记录 | 后续处理 |
|---|---|---|
| remote config center | P0 不依赖,不可达不构成当前 runtime failure success path。 | 仅可作为 future/watch;若引入必须回架构 / `03`。 |
| admin override | 当前不支持 live override 或 emergency override。 | 不得写成配置变更或失效恢复路径。 |
| hot reload / live mutation | 当前为 redline。 | unsupported request 必须 reject / fail-fast,不能成功生效。 |
| online last-known-good | 当前 P0 redline。 | 只允许 previous validated digest restart、新 run、entry rerun、test rerun。 |
| high-priority invalid fallback | redline。 | 高优先级非法值必须拒绝当前 activation/run/entry/test。 |
| raw secret / raw body / full sensitive ref | redline。 | 任何失败、告警、报告、证据只允许 safe ref / digest / issue ref。 |
| invalid config degraded | redline。 | invalid config 不得 degraded 成可运行成功。 |
| truth/report/replay repair | redline。 | failure handling 不得修复 truth、stored report、stored replay。 |
| fake fallback in production-like | redline。 | required dependency unavailable 不得 fallback fake。 |

### 7. 03 影响判定记录

| 判定项 | R11.2 结论 | 处理 |
|---|---|---|
| 仅映射现有配置到 fail-fast / fail-closed / rejected / no activation | 不影响 03 | 可留在 04 Step 11。 |
| 仅定义告警 safe 字段方向和测试切口候选 | 不影响 03 | 可留在 04 Step 11,后续由 `05/06/07` 承接。 |
| 需要新增 error DTO、port、mapper、repository、schema、availability marker 或 degraded marker 来源 | 影响 03 | 暂停 Step 11 具体结论并回 `03` owning Step。 |
| 需要 config center、secret provider、runtime hot reload、online last-known-good 的正式能力 | 影响 03 且当前越界 | 不在本 Step 闭口;记录 watch/blocker。 |
| 需要测试 evidence schema 或 acceptance gate | 不回写 03,但越过本模块 | 交 Step 12 或后续 `05/06/07`。 |

### 8. R11.3 入口记录

| 下一模块 | 入口条件 | 允许内容 | 禁止内容 |
|---|---|---|---|
| R11.3 SOP 问题回答与策略词表候选:先思考 | 用户确认进入 R11.3。 | 思考 SOP Step 11 问题回答、策略词表定义、策略适用边界和策略误用红线。 | 不写最终失效模式表;不进入 R11.4;不创建正式 `04-配置设计.md`;不写测试方案、验收标准、实施计划或代码。 |

### 9. R11.2 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只固化 R11.1 开工思考 | pass | 已写成可恢复记录,未扩写最终失效模式。 |
| 是否保持先思考 -> 再写入分离 | pass | R11.2 只做再写入,R11.3 仍待确认。 |
| 是否同步必读文档与输入基线 | pass | 已固化 SOP、书写规范、上游 Step、正式 `03` 和 L1-governance 参考口径。 |
| 是否保留失效策略红线 | pass | silent fallback、raw secret、invalid degraded、hot reload、online last-known-good 均未放开。 |
| 是否包含 03 影响判定 | pass | 新增对象 / port / mapper / marker / schema 仍需回 `03`。 |
| 是否可进入 R11.3 | pass | 等待用户确认后进入 SOP 问题回答与策略词表候选:先思考。 |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.3 SOP 问题回答与策略词表候选:先思考`;只允许思考 SOP Step 11 问题回答、策略词表定义、策略适用边界和策略误用红线;不得创建正式 `04-配置设计.md`;不得写最终失效模式表、测试方案、验收标准、实施计划或代码。

## R11.3 SOP 问题回答与策略词表候选:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R11.4 |
| 本模块目标 | 围绕 SOP Step 11 五个问题形成候选回答方向,并思考本仓可用策略词、禁用策略词和误用红线。 |
| 本模块允许 | 思考必填缺失、类型 / 范围 / 交叉字段错误、secret / provider 不可用、config center 不可达、漂移 / 过期的候选处理;思考策略词边界。 |
| 本模块禁止 | 不写最终失效模式表;不写逐配置域最终策略;不创建正式 `04-配置设计.md`;不写测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R11.2 已完成开工与必读文档再写入,并明确等待用户确认进入 R11.3。 |

### 2. SOP 五问候选回答思考

| SOP 问题 | 候选回答方向 | 需要后续 R11.4 固化的重点 |
|---|---|---|
| 必填配置缺失时系统如何处理? | startup required 缺失倾向 `fail-fast`;job-run-start required 缺失倾向 `rejected`;entry-local required 缺失倾向 current entry rejected;test fixture required 缺失倾向 `test fail-fast`。 | 必须按生效面拆分,不能写成一刀切 startup failure。 |
| 配置类型错误、范围错误、交叉字段错误时如何处理? | strict parse/type/range/cross-field validation issue 只输出 redacted issue ref;startup fail-fast;job-run-start rejected;entry-local rejected;test fail-fast;高优先级非法值不得 fallback。 | 必须继承 Step 5 no silent fallback 与 Step 9 validation issue surface。 |
| secret / KMS / Vault 不可用时如何处理? | P0 不定义真实 secret provider/KMS/Vault;普通配置只允许 opaque ref。若 future provider 进入,required startup dependency fail-fast,job target rejected/failed,query/consumer/job runtime dependency 只按正式 adapter role degraded/delayed/failed。 | 不得写具体 provider 产品/API;不得 fallback fake;不得输出 raw secret/full ref。 |
| config center 不可达时如何处理? | P0 无 remote config center/admin override,因此不可达不是当前 runtime dependency;future 引入需回架构 / `03` 闭口。 | 不得把 config center unavailable 写成当前 P0 可降级成功路径。 |
| 配置漂移或过期如何发现和处理? | 候选检测来源为 redacted config digest、profile ref、activation kind、validation issue ref、job input digest、fixture digest、previous validated digest。startup drift 需重新 validation;job / entry / test drift 只影响新 run / rerun,不改写 stored report/truth/replay。 | 必须区分 previous validated restart 与 online last-known-good;不得用漂移处理修复 truth。 |

### 3. 策略词表候选思考

| 策略词 | 本仓候选语义 | 适用边界 | 不适用 / 禁止 |
|---|---|---|---|
| `fail-fast` | 在 startup / builder / validation / pre-run 阶段阻止继续,不暴露半装配 facade。 | startup config、required store/adapter binding、strict parse/type/range/cross-field、unsupported reload/hot。 | 不用于事后改写 accepted truth、stored report、stored replay。 |
| `fail-closed` | 安全边界不确定时拒绝危险动作,不走宽松默认值。 | raw secret/body、unsafe redaction、production-like fake、static boundary override、full sensitive ref 输出。 | 不用于普通低风险展示缺失的静默成功。 |
| `rejected` | 当前 job run、entry、operation input 在进入正式副作用前被拒绝。 | job-run-start target/scope/batch/replay ref 缺失或非法;entry-local selector 非法。 | 不代表 runtime 全局不可用;不得写已 accepted truth rollback。 |
| `test fail-fast` | test harness / fixture / deterministic fake 输入不闭合时直接测试失败。 | fixture 缺失、fixed clock/id 非法、raw replay body、fixture 污染 production-like。 | 不写成生产 runtime fallback。 |
| `degraded` | 保持有限 read/job/adapter surface,并显式暴露正式 degraded/unavailable marker。 | query read material unavailable/stale、optional runtime dependency、formal resolver / adapter degraded branch。 | invalid config、raw secret、unsupported reload、required startup binding 不得 degraded 成成功。 |
| `delayed` | worker / job 因临时依赖不可用延迟处理或等待重试。 | inbound consumer resolver unavailable、job runner temporary dependency unavailable。 | invalid config、unsupported event version、raw body 不得 delayed 成无限等待。 |
| `failed marker` | outbox / handoff / reference / report 等运行期动作失败后写正式失败标记或报告。 | publisher unavailable、handoff target failed、reference refresh failed、operations job partial failure。 | 不得作为 command accepted truth rollback 或 query repair。 |
| `no activation` | 候选配置未通过 validation,不生效、不替换当前已验证 baseline。 | invalid new config、unvalidated rollback target、critical rejected attempt。 | 不等同 online last-known-good;不允许 live switch。 |
| `last-known-good` | 规范词存在,但本仓 P0 仅允许 previous validated digest 作为 restart / new run / rerun 输入。 | Step 10 rollback 后重新启动、new job run、entry rerun、test rerun。 | 不支持 hot reload/live runtime LKG。 |
| `default-fallback` | 仅可用于 Step 7 已确认的非敏感、非关键、低风险 safe default。 | 未指定 profile 可 default、disabled optional target 可缺失。 | 高优先级非法值、required store/adapter、secret/ref、redaction、安全边界不得 fallback。 |
| `reject-new-value` | 规范词主要适合热更新非法值;本仓 P0 无 hot update。 | 可作为 future/watch 或 Step 10 no activation 的解释性近义。 | 不得写成 runtime hot reload contract。 |

### 4. 策略误用红线思考

| 误用场景 | 为什么危险 | 候选处理 |
|---|---|---|
| invalid config 写成 degraded | 会让错误配置绕过 validation 并进入 runtime。 | startup fail-fast / scoped reject / test fail-fast。 |
| 高优先级非法 source fallback 低优先级 | 会掩盖 env、entry-local、job input 的真实错误。 | fail-fast 或 reject current run/entry。 |
| raw secret / raw body 出现在 issue/log/report | 会造成安全泄露并污染 evidence。 | fail-closed,仅输出 redacted digest / issue ref / safe diagnostic ref。 |
| required adapter unavailable fallback fake | 会破坏 profile 隔离和 fake/durable parity。 | production-like / integration-like required path fail-fast 或正式 unavailable surface。 |
| query degraded 顺手 repair write | 会违反 query no-write 和 truth owner。 | query 只返回 formal degraded/unavailable surface。 |
| publisher/handoff failure rollback truth | 会把 transport failure 误当业务 truth failure。 | 写 failed marker/report,truth unchanged。 |
| online last-known-good live switch | 会绕开当前无 reload/hot contract 的边界。 | 只允许 previous validated restart/new run/rerun。 |
| config center unavailable 当前化 | 会凭空引入 P0 运行依赖。 | P0 标记 not applicable / future watch。 |

### 5. L3-method-library 专属候选收敛思考

| 配置域 | 候选策略重点 | 需要避免 |
|---|---|---|
| runtime / entry readiness | profile selector、strict validation、runtime builder assembly 必须 fail-fast 或 entry rejected。 | 半装配 facade、hot reload、config center dependency。 |
| repository / material store | required store missing / incompatible profile fail-fast;runtime read material unavailable 只走正式 degraded/unavailable。 | selected store missing 时 fallback 到不匹配 store。 |
| external source / resolver | required source/ref missing fail-fast 或 operation rejected;runtime resolver unavailable 依 `03` flow degraded/delayed/failed。 | raw external body、raw adapter response、marker synthesis。 |
| inbound source | required transport/idempotency channel missing fail-fast;runtime unsupported / unavailable source safe rejected/delayed。 | raw payload allowlist、command emulation、truth repair。 |
| publisher / handoff | enabled target missing fail-fast / job rejected;runtime unavailable target failed marker/report。 | delivery proves truth、publish failure rollback truth。 |
| query / read policy | optional read surface stale/unavailable 可 degraded;query no-write 必须保持。 | read-time repair、hidden write、fake private fallback source。 |
| operations job | required job input missing rejected;runner dependency unavailable failed/suspended/report issue。 | job config 改 core truth、lease-as-truth、hot change during run。 |
| diagnostics / redaction | unsafe redaction fail-closed;diagnostic sink unavailable 只输出 safe issue/degraded reporting。 | raw output、admin hot relax、unsafe high-cardinality labels。 |

### 6. 对 03 的影响预判

| 候选结论 | 是否影响 03 | 处理 |
|---|---|---|
| 采用 existing validation issue refs、safe diagnostics、adapter availability / degraded surface | 否 | 留在 Step 11 继续细化。 |
| 把 `last-known-good` 限定为 previous validated restart/new run/rerun | 否 | 承接 Step 10,不新增 runtime reload contract。 |
| P0 不引入 config center/admin override/secret provider 产品 | 否 | 作为 watch/redline 保留。 |
| 需要新增 degraded marker、availability marker、error DTO、port、mapper、repository 或 schema | 是 | 暂停并回 `03` owning Step。 |
| 需要支持 hot reload、online LKG、secret provider runtime resolution 或 admin override | 是且越界 | 不在 Step 11 自行补口。 |

### 7. R11.4 写入计划

| R11.4 拟写内容 | 写入边界 |
|---|---|
| SOP 五问回答记录 | 把 R11.3 的五问候选回答写成可恢复记录。 |
| 策略词表记录 | 固化本仓策略词、适用范围、不适用范围和禁用误用。 |
| L3 专属策略候选 | 固化 runtime、stores、resolver、inbound、publisher/handoff、query、jobs、diagnostics/redaction 的策略方向。 |
| 03 影响判定 | 固化当前无回写、触发回写和越界项。 |
| R11.5 入口 | 进入失效模式表结构与分组:先思考。 |

### 8. R11.3 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做 SOP 问题与策略词表先思考 | pass | 未写最终失效模式表。 |
| 是否说明 fail-fast / fail-closed / last-known-good / degraded | pass | 已定义本仓候选语义和不适用边界。 |
| 是否保留 no silent fallback | pass | 高优先级非法 source 仍 fail-fast / reject。 |
| 是否保护敏感信息 | pass | raw secret/body/full sensitive ref 仍 fail-closed。 |
| 是否避免 03 私补 | pass | 新增 marker / DTO / port / mapper / schema 仍需回 `03`。 |
| 是否可进入 R11.4 | pass | 等待用户确认后进入 SOP 问题回答与策略词表候选:再写入。 |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.4 SOP 问题回答与策略词表候选:再写入`;只允许把 R11.3 的 SOP 五问候选回答、策略词表候选、策略误用红线、L3 专属策略方向和 03 影响预判写成可恢复记录;不得创建正式 `04-配置设计.md`;不得写最终失效模式表、测试方案、验收标准、实施计划或代码。

## R11.4 SOP 问题回答与策略词表候选:再写入

### 1. 当前模块状态记录

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R11.5 |
| 本模块目标 | 将 R11.3 的 SOP 五问候选回答、策略词表、误用红线、L3 专属策略方向和 03 影响预判固化为可恢复记录。 |
| 本模块已写入 | SOP 五问回答记录、策略词表记录、策略误用红线记录、L3 专属策略方向记录、03 影响判定记录、R11.5 入口和停审记录。 |
| 本模块未写入 | 未写最终失效模式表;未写逐行失效模式;未写测试方案、验收标准、实施计划或代码。 |
| 当前恢复口径 | 用户已确认从 R11.3 进入 R11.4;R11.4 完成后等待用户确认进入 R11.5。 |

### 2. SOP 五问回答记录

| SOP 问题 | 本仓回答记录 | 后续表格承接 |
|---|---|---|
| 必填配置缺失时系统如何处理? | startup required 缺失为 `fail-fast`;job-run-start required 缺失为 current run `rejected`;entry-local required 缺失为 current entry rejected;test fixture required 缺失为 `test fail-fast`。 | R11.5 起按 activation surface 拆分失效模式表分组。 |
| 配置类型错误、范围错误、交叉字段错误时如何处理? | strict parse/type/range/cross-field validation 产生 redacted validation issue;startup fail-fast;job-run-start rejected;entry-local rejected;test fail-fast;高优先级非法值不得 fallback 到低优先级。 | 失效模式表必须覆盖 parse、type、range、cross-field、source conflict、high-priority invalid。 |
| secret / KMS / Vault 不可用时如何处理? | P0 不定义真实 secret provider/KMS/Vault;普通配置只允许 opaque ref。future provider 若进入,required startup dependency fail-fast,job target rejected/failed,query/consumer/job runtime dependency 按正式 adapter role degraded/delayed/failed。 | 表格只记录 P0 opaque ref 与 future provider watch,不写产品/API。 |
| config center 不可达时如何处理? | P0 无 remote config center/admin override,因此不可达不是当前 runtime dependency;future 引入需回架构 / `03` 闭口。 | 表格中标记 config center unavailable 为 not_applicable / future_watch,不得写当前降级成功路径。 |
| 配置漂移或过期如何发现和处理? | 通过 redacted config digest、profile ref、activation kind、validation issue ref、job input digest、fixture digest、previous validated digest 检测。startup drift 需重新 validation;job / entry / test drift 只影响 new run / rerun,不得改写 stored report/truth/replay。 | 表格必须区分 previous validated restart 与 online last-known-good redline。 |

### 3. 策略词表记录

| 策略词 | 本仓语义 | 适用范围 | 不适用 / 禁止 |
|---|---|---|---|
| `fail-fast` | validation / build / pre-run 阶段立即阻断,不暴露半装配 facade。 | startup config、required store/adapter binding、strict parse/type/range/cross-field、unsupported reload/hot。 | 不用于事后改写 accepted truth、stored report、stored replay。 |
| `fail-closed` | 安全边界不明确时拒绝危险动作,不使用宽松默认值。 | raw secret/body、unsafe redaction、production-like fake、static boundary override、full sensitive ref 输出。 | 不用于普通低风险展示缺失的静默成功。 |
| `rejected` | 当前 job run、entry 或 operation input 在正式副作用前被拒绝。 | job-run-start target/scope/batch/replay ref 缺失或非法;entry-local selector 非法。 | 不代表 runtime 全局不可用;不得写 accepted truth rollback。 |
| `test fail-fast` | test harness / fixture / deterministic fake 输入不闭合时直接失败。 | fixture 缺失、fixed clock/id 非法、raw replay body、fixture 污染 production-like。 | 不写成生产 runtime fallback。 |
| `degraded` | 保持有限 read/job/adapter surface,并显式暴露正式 degraded/unavailable marker。 | query read material unavailable/stale、optional runtime dependency、formal resolver / adapter degraded branch。 | invalid config、raw secret、unsupported reload、required startup binding 不得 degraded 成成功。 |
| `delayed` | worker / job 因临时依赖不可用延迟处理或等待重试。 | inbound consumer resolver unavailable、job runner temporary dependency unavailable。 | invalid config、unsupported event version、raw body 不得 delayed 成无限等待。 |
| `failed marker` | outbox / handoff / reference / report 等运行期动作失败后写正式失败标记或报告。 | publisher unavailable、handoff target failed、reference refresh failed、operations job partial failure。 | 不得作为 command accepted truth rollback 或 query repair。 |
| `no activation` | 候选配置未通过 validation,不生效、不替换当前已验证 baseline。 | invalid new config、unvalidated rollback target、critical rejected attempt。 | 不等同 online last-known-good;不允许 live switch。 |
| `last-known-good` | P0 只允许 previous validated digest 作为 restart / new run / rerun 输入。 | Step 10 rollback 后重新启动、new job run、entry rerun、test rerun。 | 不支持 hot reload/live runtime LKG。 |
| `default-fallback` | 仅可用于 Step 7 已确认的非敏感、非关键、低风险 safe default。 | 未指定 profile 可 default、disabled optional target 可缺失。 | 高优先级非法值、required store/adapter、secret/ref、redaction、安全边界不得 fallback。 |
| `reject-new-value` | 规范词主要适合热更新非法值;本仓 P0 无 hot update。 | 可作为 future/watch 或 Step 10 no activation 的解释性近义。 | 不得写成 runtime hot reload contract。 |

### 4. 策略误用红线记录

| 误用场景 | 正式处理 | 后续检查点 |
|---|---|---|
| invalid config 写成 degraded | startup fail-fast / scoped reject / test fail-fast。 | 失效模式表不得出现 invalid config -> degraded success。 |
| 高优先级非法 source fallback 低优先级 | fail-fast 或 reject current run/entry。 | 每个来源冲突行必须声明 no silent fallback。 |
| raw secret / raw body 出现在 issue/log/report | fail-closed,仅输出 redacted digest / issue ref / safe diagnostic ref。 | 告警字段和测试切口不得包含 raw value。 |
| required adapter unavailable fallback fake | production-like / integration-like required path fail-fast 或正式 unavailable surface。 | profile 相关行必须检查 fake/durable parity。 |
| query degraded 顺手 repair write | query 只返回 formal degraded/unavailable surface。 | query/read failure 行必须标注 no-write。 |
| publisher/handoff failure rollback truth | 写 failed marker/report,truth unchanged。 | outbound/handoff 行必须标注 truth unchanged。 |
| online last-known-good live switch | 只允许 previous validated restart/new run/rerun。 | `last-known-good` 只可作为禁用/限制项出现。 |
| config center unavailable 当前化 | P0 标记 not applicable / future watch。 | 不得把 config center 写成当前 P0 dependency。 |

### 5. L3 专属策略方向记录

| 配置域 | 策略方向 | 禁止方向 |
|---|---|---|
| runtime / entry readiness | profile selector、strict validation、runtime builder assembly fail-fast 或 entry rejected。 | 半装配 facade、hot reload、config center dependency。 |
| repository / material store | required store missing / incompatible profile fail-fast;runtime read material unavailable 走正式 degraded/unavailable。 | selected store missing 时 fallback 到不匹配 store。 |
| external source / resolver | required source/ref missing fail-fast 或 operation rejected;runtime resolver unavailable 依 `03` flow degraded/delayed/failed。 | raw external body、raw adapter response、marker synthesis。 |
| inbound source | required transport/idempotency channel missing fail-fast;runtime unsupported / unavailable source safe rejected/delayed。 | raw payload allowlist、command emulation、truth repair。 |
| publisher / handoff | enabled target missing fail-fast / job rejected;runtime unavailable target failed marker/report。 | delivery proves truth、publish failure rollback truth。 |
| query / read policy | optional read surface stale/unavailable 可 degraded;query no-write 必须保持。 | read-time repair、hidden write、fake private fallback source。 |
| operations job | required job input missing rejected;runner dependency unavailable failed/suspended/report issue。 | job config 改 core truth、lease-as-truth、hot change during run。 |
| diagnostics / redaction | unsafe redaction fail-closed;diagnostic sink unavailable 只输出 safe issue/degraded reporting。 | raw output、admin hot relax、unsafe high-cardinality labels。 |

### 6. 03 影响判定记录

| 结论 | 是否影响 03 | 处理 |
|---|---|---|
| 使用 existing validation issue refs、safe diagnostics、adapter availability / degraded surface | 否 | 留在 Step 11 后续模块细化。 |
| 将 `last-known-good` 限定为 previous validated restart/new run/rerun | 否 | 承接 Step 10,不新增 runtime reload contract。 |
| P0 不引入 config center/admin override/secret provider 产品 | 否 | 作为 watch/redline 保留。 |
| 需要新增 degraded marker、availability marker、error DTO、port、mapper、repository 或 schema | 是 | 暂停并回 `03` owning Step。 |
| 需要支持 hot reload、online LKG、secret provider runtime resolution 或 admin override | 是且越界 | 不在 Step 11 自行补口。 |

### 7. R11.5 入口记录

| 下一模块 | 入口条件 | 允许内容 | 禁止内容 |
|---|---|---|---|
| R11.5 失效模式表结构与分组:先思考 | 用户确认进入 R11.5。 | 思考失效模式表的分组顺序、行覆盖范围、列含义、告警/测试切口粒度和 stop-review 维度。 | 不写最终逐行失效模式表;不进入 R11.6;不创建正式 `04-配置设计.md`;不写测试方案、验收标准、实施计划或代码。 |

### 8. R11.4 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只固化 R11.3 候选思考 | pass | 未写最终失效模式表。 |
| 是否覆盖 SOP 五问 | pass | 必填缺失、错误配置、secret/provider、config center、漂移/过期均有记录。 |
| 是否固化策略词边界 | pass | fail-fast、fail-closed、degraded、last-known-good、default-fallback 等均已定义适用 / 禁止范围。 |
| 是否保留安全与 no fallback 红线 | pass | raw secret、invalid degraded、高优先级非法 fallback、fake fallback 均保持禁止。 |
| 是否包含 L3 专属策略方向 | pass | runtime、store、resolver、inbound、publisher/handoff、query、job、diagnostics 均已覆盖。 |
| 是否可进入 R11.5 | pass | 等待用户确认后进入失效模式表结构与分组:先思考。 |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.5 失效模式表结构与分组:先思考`;只允许思考失效模式表的分组顺序、行覆盖范围、列含义、告警/测试切口粒度和 stop-review 维度;不得创建正式 `04-配置设计.md`;不得写最终逐行失效模式表、测试方案、验收标准、实施计划或代码。

## R11.5 失效模式表结构与分组:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R11.6 |
| 本模块目标 | 思考 Step 11 最终失效模式表的结构、分组顺序、列语义、行覆盖范围、告警 / 测试切口粒度和停审维度。 |
| 本模块允许 | 思考失效模式表分组、候选行范围、辅助表类型、列解释、告警字段安全边界、测试切口表达和 stop-review 维度。 |
| 本模块禁止 | 不写最终逐行失效模式表;不把候选行直接标为正式结论;不创建正式 `04-配置设计.md`;不写测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R11.4 已固化 SOP 五问回答、策略词表、误用红线、L3 专属策略方向和 03 影响判定,并等待用户确认进入 R11.5。 |

### 2. 失效模式表主列语义思考

| 主列 | 思考定义 | 写法约束 |
|---|---|---|
| 失效模式 | 描述可识别、可触发、可测试的配置失败场景。 | 不写抽象大类如“配置失败”;应能映射到 source / validation / activation / dependency / drift。 |
| 影响 | 描述失败对 runtime、entry、job、query、consumer、outbox、handoff、diagnostic 或 test harness 的影响。 | 不写用户故事或运营描述;只写系统可观测影响。 |
| 系统行为 | 写 fail-fast、fail-closed、rejected、test fail-fast、degraded、delayed、failed marker、no activation 等已定义策略。 | 每行只能使用已在 R11.4 固化的策略词;不得写 silent fallback。 |
| 是否告警 | 写 yes / no / aggregate / security / test-only 等候选级别。 | 不写具体平台、SLO、pager、dashboard、runbook 或阈值。 |
| 测试切口 | 写后续 `05-测试方案.md` 可承接的场景名和预期方向。 | 不写 TC ID、fixture schema、evidence schema 或实现命令。 |

### 3. 主表分组顺序思考

| 顺序 | 分组 | 覆盖意图 | 是否应进入最终逐行表 |
|---|---|---|---|
| 1 | source / merge / conflict failure | 覆盖 missing source、unreadable file、invalid high-priority source、duplicate key、legacy alias conflict。 | yes_candidate |
| 2 | parse / type / enum / range failure | 覆盖 strict parser、unknown field、invalid enum/type/range、timestamp / duration / numeric bound。 | yes_candidate |
| 3 | cross-field / profile compatibility failure | 覆盖 store completeness、resolver family coverage、topic completeness、retention consistency、batch/page compatibility、profile vs fake/durable。 | yes_candidate |
| 4 | sensitive / redaction / forbidden body failure | 覆盖 raw secret、raw body、full sensitive ref、unsafe redaction、high-cardinality label、secret provider watch。 | yes_candidate |
| 5 | activation surface failure | 按 startup、job-run-start、entry-local、test harness、unsupported reload/hot 区分 failure behavior。 | yes_candidate |
| 6 | required dependency unavailable | 覆盖 required startup adapter/store/source/target unavailable 与 fake fallback 禁止。 | yes_candidate |
| 7 | runtime optional dependency unavailable | 覆盖 query/read degraded、resolver unavailable、consumer delayed、publisher failed、handoff failed、diagnostic sink unavailable。 | yes_candidate |
| 8 | drift / stale / rollback target failure | 覆盖 config digest drift、stale validated input、unvalidated rollback target、new run / rerun boundary。 | yes_candidate |
| 9 | future / not-applicable watch failures | 覆盖 config center unavailable、admin override unavailable、future secret provider unavailable。 | yes_candidate_as_watch |
| 10 | invariant override / private fallback attempt | 覆盖 truth owner、state transition、query no-write、stored replay、marker source、body-free、P0/P1 isolation override。 | yes_candidate_as_fail_closed |

### 4. 辅助表结构思考

| 辅助表 | 目的 | 候选列 | R11.5 判断 |
|---|---|---|---|
| 按配置域组织的失败策略表 | 避免主失效模式表只按技术失败分类而漏掉 L3 配置域。 | 配置域 / 典型失败 / 策略 / public-worker-job surface / 禁止动作。 | should_include |
| 生效方式到失效策略矩阵 | 确保 startup、job-run-start、entry-local、test harness、runtime adapter call 的行为不混写。 | 生效方式 / 检测点 / 策略 / safe diagnostic / recovery。 | should_include |
| 告警规则表 | 固定哪些失败需要告警、用哪些 safe 字段表达。 | 场景 / 是否告警 / 推荐级别 / safe 字段 / 禁止字段。 | should_include |
| 测试切口表 | 给 Step 12 / `05` 下游承接足够输入,但不越界成 TC。 | 测试切口 / 覆盖内容 / 预期。 | should_include |
| 配置失效模式停审记录 | 对每组 failure 做 no fallback、no leak、no 03 private supplement 检查。 | 失效类型 / 审查项 / 结论 / 缺口或修正。 | should_include |
| 跨失效策略审计表 | 横向审查所有策略是否互相冲突。 | 审计项 / 结论 / 缺口或修正。 | should_include |

### 5. 行覆盖范围思考

| 覆盖类别 | 必须覆盖的候选行 | 不应写成 |
|---|---|---|
| 缺配置 | required field missing、required source missing、enabled target missing、fixture missing。 | 泛化为“缺配置 -> fail-fast”一行。 |
| 错配置 | parse failed、unknown section / field、invalid enum/type/range、duplicate key、alias conflict。 | 让 parser 默认覆盖或忽略。 |
| 跨字段错误 | retention conflict、batch/page conflict、topic completeness missing、profile fake/durable conflict、redaction deny list empty。 | 写成普通 range error 后不说明 cross-field 影响。 |
| 敏感错误 | raw secret、raw body、full sensitive ref output、unsafe redaction、future provider unavailable。 | 输出 raw value 或具体 provider API。 |
| 不可达 | required adapter/store/source unavailable、optional dependency unavailable、publisher/handoff unavailable。 | 把所有 unavailable 一律 startup fail-fast。 |
| 过期 / 漂移 | config digest mismatch、unvalidated rollback target、stale job input / fixture / replay root。 | 在线 LKG 或 live repair。 |
| 越界能力 | hot reload、config center、admin override、secret provider product、invariant override。 | 当前 P0 success path。 |
| 运行期降级 | query degraded、consumer delayed、job failed marker、diagnostic sink degraded. | invalid config degraded success。 |

### 6. 告警与安全字段粒度思考

| 告警粒度 | 思考结论 | 禁止内容 |
|---|---|---|
| startup validation rejected | 应为告警候选,字段只含 source kind、profile、section、validation issue ref、redacted digest。 | raw config、env value、secret、full sensitive ref。 |
| security / fail-closed | 应为 security / error 级候选,字段只含 forbidden class、section、issue ref。 | raw secret、raw body、matched raw value。 |
| job / entry rejected | scheduled/ops job 应 warn/error 候选,local entry 可 warn/debug 候选。 | raw job body、raw target、local sensitive path。 |
| query / read degraded | 聚合告警候选,字段含 query kind、material kind、degraded marker ref。 | read body、private fallback source、raw repository error。 |
| publisher / handoff failed | warn/error 候选,字段含 target digest、marker/report ref、retryable class。 | payload body、transport credential、external response body。 |
| test harness failure | test failure,一般不作为 ops alert。 | fixture body、raw replay artifact。 |

### 7. 测试切口粒度思考

| 测试切口类型 | 表达粒度 | 不写内容 |
|---|---|---|
| validation unit cut | 写缺失、类型、范围、cross-field、sensitive reject 的场景名和预期策略。 | 不写测试文件名、测试函数名、fixture JSON schema。 |
| activation cut | 写 startup failed、job rejected、entry rejected、test fail-fast 的行为预期。 | 不写 CLI 命令或实现细节。 |
| no fallback cut | 写 invalid high-priority source 不回退、required missing 不 fallback fake。 | 不写具体 env var 名。 |
| safe output cut | 写 validation issue / alert / report 只含 safe refs。 | 不写 evidence schema 或 artifact path。 |
| no side-effect cut | 写 query degraded no-write、publisher failure truth unchanged。 | 不写 repository implementation checks。 |
| future watch cut | 写 config center/admin override/hot reload unsupported reject。 | 不写未来产品配置。 |

### 8. Stop-review 维度思考

| 停审维度 | 问题 | 通过条件 |
|---|---|---|
| no silent fallback | 是否存在高优先级非法值、required 缺失、secret 错误被 fallback? | 所有高风险失败均 fail-fast / fail-closed / rejected。 |
| invalid not degraded | 是否把 invalid config 写成 degraded success? | degraded 只用于 runtime optional dependency / read material。 |
| no sensitive leak | 是否有 raw secret/body/full sensitive ref 进入 error/log/report/test cut? | 只使用 redacted digest、issue ref、safe diagnostic ref。 |
| no truth repair | failure handling 是否改写 truth、stored report、stored replay? | 只写 marker/report/no activation,不修 truth。 |
| no private schema | 是否新增 marker、DTO、port、mapper、schema、config key? | 命中则暂停并回 `03` / owning Step。 |
| profile isolation | fake / fixture 是否进入 integration-like / production-like required path? | production-like / integration-like selected required adapter 不 fallback fake。 |
| Step boundary | 是否写入测试方案、验收、实施或正式文档? | R11.5 不写正式 `04`,不写 TC / AC / commit boundary。 |

### 9. 对 03 的影响预判

| R11.5 结构结论 | 是否影响 03 | 处理 |
|---|---|---|
| 只定义失效模式表分组、列语义、辅助表类型、告警字段方向和测试切口粒度 | 否 | 留在 Step 11。 |
| 只将 unavailable / degraded 映射到 `03` 已有 adapter availability / degraded surface | 否 | 后续逐行表必须回指 `03` 来源。 |
| 发现某行需要新的 formal marker / issue / port / mapper / schema | 是 | 不在 04 私补,暂停并回 `03`。 |
| 发现某行需要具体 config center / secret provider / hot reload / online LKG capability | 是且越界 | 记录 watch / blocker,不写 P0 success path。 |

### 10. R11.6 写入计划

| R11.6 拟写内容 | 写入边界 |
|---|---|
| 主列语义记录 | 固化失效模式 / 影响 / 系统行为 / 是否告警 / 测试切口的写法。 |
| 主表分组记录 | 固化 source、validation、cross-field、sensitive、activation、dependency、runtime degraded、drift/watch/invariant 的分组顺序。 |
| 辅助表结构记录 | 固化配置域策略表、生效方式矩阵、告警规则表、测试切口表、停审记录和跨策略审计表。 |
| 行覆盖范围记录 | 固化缺配置、错配置、跨字段、敏感、不可达、过期/漂移、越界能力、运行期降级覆盖清单。 |
| R11.7 入口 | 进入失效模式表候选逐行整理:先思考。 |

### 11. R11.5 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做结构与分组先思考 | pass | 未写最终逐行失效模式表。 |
| 是否使用规范列 | pass | 主表列保持 `失效模式 / 影响 / 系统行为 / 是否告警 / 测试切口`。 |
| 是否参考 L1-governance 框架而非复制领域事实 | pass | 仅采用辅助表结构与审查深度。 |
| 是否覆盖 SOP 必需范围 | pass | 缺配置、错配置、不可达、过期、漂移、敏感、config center watch 均纳入覆盖类别。 |
| 是否保留 03 回写门禁 | pass | 新增 marker / DTO / port / schema 仍需回 `03`。 |
| 是否可进入 R11.6 | pass | 等待用户确认后进入失效模式表结构与分组:再写入。 |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.6 失效模式表结构与分组:再写入`;只允许把 R11.5 的主列语义、主表分组、辅助表结构、行覆盖范围、告警/测试切口粒度、stop-review 维度和 03 影响预判写成可恢复记录;不得创建正式 `04-配置设计.md`;不得写最终逐行失效模式表、测试方案、验收标准、实施计划或代码。

## R11.6 失效模式表结构与分组:再写入

### 1. 当前模块状态记录

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R11.7 |
| 本模块目标 | 将 R11.5 的失效模式表结构、分组、列语义、辅助表结构、行覆盖范围、告警 / 测试粒度和 stop-review 维度固化为可恢复记录。 |
| 本模块已写入 | 主列语义记录、主表分组记录、辅助表结构记录、行覆盖范围记录、告警与安全字段粒度记录、测试切口粒度记录、停审维度记录和 03 影响判定记录。 |
| 本模块未写入 | 未写最终逐行失效模式表;未写最终配置域策略表;未写测试方案、验收标准、实施计划或代码。 |
| 当前恢复口径 | 用户已确认从 R11.5 进入 R11.6;R11.6 完成后等待用户确认进入 R11.7。 |

### 2. 主列语义记录

| 主列 | 固化定义 | 写法约束 |
|---|---|---|
| 失效模式 | 可识别、可触发、可测试的配置失败场景。 | 不写抽象大类;必须能映射到 source / validation / activation / dependency / drift。 |
| 影响 | 失败对 runtime、entry、job、query、consumer、outbox、handoff、diagnostic 或 test harness 的系统影响。 | 不写运营叙述;只写系统可观测影响。 |
| 系统行为 | 使用 fail-fast、fail-closed、rejected、test fail-fast、degraded、delayed、failed marker、no activation 等已定义策略。 | 不得写 silent fallback;不得使用未定义策略词。 |
| 是否告警 | 使用 yes / no / aggregate / security / test-only 等候选级别。 | 不写具体平台、SLO、pager、dashboard、runbook 或阈值。 |
| 测试切口 | 写后续 `05-测试方案.md` 可承接的场景名和预期方向。 | 不写 TC ID、fixture schema、evidence schema 或实现命令。 |

### 3. 主表分组记录

| 顺序 | 分组 | 覆盖意图 | 进入后续逐行表 |
|---|---|---|---|
| 1 | source / merge / conflict failure | missing source、unreadable file、invalid high-priority source、duplicate key、legacy alias conflict。 | yes |
| 2 | parse / type / enum / range failure | strict parser、unknown field、invalid enum/type/range、timestamp / duration / numeric bound。 | yes |
| 3 | cross-field / profile compatibility failure | store completeness、resolver family coverage、topic completeness、retention consistency、batch/page compatibility、profile vs fake/durable。 | yes |
| 4 | sensitive / redaction / forbidden body failure | raw secret、raw body、full sensitive ref、unsafe redaction、high-cardinality label、secret provider watch。 | yes |
| 5 | activation surface failure | startup、job-run-start、entry-local、test harness、unsupported reload/hot 各自 failure behavior。 | yes |
| 6 | required dependency unavailable | required startup adapter/store/source/target unavailable 与 fake fallback 禁止。 | yes |
| 7 | runtime optional dependency unavailable | query/read degraded、resolver unavailable、consumer delayed、publisher failed、handoff failed、diagnostic sink unavailable。 | yes |
| 8 | drift / stale / rollback target failure | config digest drift、stale validated input、unvalidated rollback target、new run / rerun boundary。 | yes |
| 9 | future / not-applicable watch failures | config center unavailable、admin override unavailable、future secret provider unavailable。 | yes_as_watch |
| 10 | invariant override / private fallback attempt | truth owner、state transition、query no-write、stored replay、marker source、body-free、P0/P1 isolation override。 | yes_as_fail_closed |

### 4. 辅助表结构记录

| 辅助表 | 目的 | 固化列 | 处理 |
|---|---|---|---|
| 按配置域组织的失败策略表 | 防止主表只按技术失败分类而漏掉 L3 配置域。 | 配置域 / 典型失败 / 策略 / public-worker-job surface / 禁止动作。 | include |
| 生效方式到失效策略矩阵 | 防止 startup、job-run-start、entry-local、test harness、runtime adapter call 混写。 | 生效方式 / 检测点 / 策略 / safe diagnostic / recovery。 | include |
| 告警规则表 | 固定哪些失败告警、使用哪些 safe 字段。 | 场景 / 是否告警 / 推荐级别 / safe 字段 / 禁止字段。 | include |
| 测试切口表 | 为 Step 12 / `05` 提供场景输入,但不越界成 TC。 | 测试切口 / 覆盖内容 / 预期。 | include |
| 配置失效模式停审记录 | 对每组 failure 检查 no fallback、no leak、no private supplement。 | 失效类型 / 审查项 / 结论 / 缺口或修正。 | include |
| 跨失效策略审计表 | 横向审查策略是否互相冲突。 | 审计项 / 结论 / 缺口或修正。 | include |

### 5. 行覆盖范围记录

| 覆盖类别 | 必须覆盖的后续候选行 | 禁止简化 |
|---|---|---|
| 缺配置 | required field missing、required source missing、enabled target missing、fixture missing。 | 不得泛化为“缺配置 -> fail-fast”一行。 |
| 错配置 | parse failed、unknown section / field、invalid enum/type/range、duplicate key、alias conflict。 | 不得依赖 parser 默认覆盖或忽略。 |
| 跨字段错误 | retention conflict、batch/page conflict、topic completeness missing、profile fake/durable conflict、redaction deny list empty。 | 不得压成普通 range error 后丢失 cross-field 影响。 |
| 敏感错误 | raw secret、raw body、full sensitive ref output、unsafe redaction、future provider unavailable。 | 不得输出 raw value 或具体 provider API。 |
| 不可达 | required adapter/store/source unavailable、optional dependency unavailable、publisher/handoff unavailable。 | 不得把所有 unavailable 一律 startup fail-fast。 |
| 过期 / 漂移 | config digest mismatch、unvalidated rollback target、stale job input / fixture / replay root。 | 不得写在线 LKG 或 live repair。 |
| 越界能力 | hot reload、config center、admin override、secret provider product、invariant override。 | 不得写成当前 P0 success path。 |
| 运行期降级 | query degraded、consumer delayed、job failed marker、diagnostic sink degraded。 | 不得把 invalid config degraded 成 success。 |

### 6. 告警与安全字段粒度记录

| 告警场景 | 告警粒度 | 允许字段 | 禁止字段 |
|---|---|---|---|
| startup validation rejected | yes/error | source kind、profile、section、validation issue ref、redacted digest。 | raw config、env value、secret、full sensitive ref。 |
| security / fail-closed | security/error | forbidden class、section、issue ref。 | raw secret、raw body、matched raw value。 |
| job / entry rejected | warn/error for scheduled/ops;warn/debug for local entry | job kind、entry kind、selector class、issue ref。 | raw job body、raw target、local sensitive path。 |
| query / read degraded | aggregate/warn | query kind、material kind、degraded marker ref。 | read body、private fallback source、raw repository error。 |
| publisher / handoff failed | warn/error | target digest、marker/report ref、retryable class。 | payload body、transport credential、external response body。 |
| test harness failure | test-only | fixture ref digest、profile、issue ref。 | fixture body、raw replay artifact。 |

### 7. 测试切口粒度记录

| 测试切口类型 | 表达粒度 | 禁止内容 |
|---|---|---|
| validation unit cut | 缺失、类型、范围、cross-field、sensitive reject 的场景名和预期策略。 | 测试文件名、测试函数名、fixture JSON schema。 |
| activation cut | startup failed、job rejected、entry rejected、test fail-fast 的行为预期。 | CLI 命令或实现细节。 |
| no fallback cut | invalid high-priority source 不回退、required missing 不 fallback fake。 | 具体 env var 名。 |
| safe output cut | validation issue / alert / report 只含 safe refs。 | evidence schema 或 artifact path。 |
| no side-effect cut | query degraded no-write、publisher failure truth unchanged。 | repository implementation checks。 |
| future watch cut | config center/admin override/hot reload unsupported reject。 | 未来产品配置。 |

### 8. Stop-review 维度记录

| 停审维度 | 检查问题 | 通过条件 |
|---|---|---|
| no silent fallback | 高优先级非法值、required 缺失、secret 错误是否被 fallback。 | 高风险失败均 fail-fast / fail-closed / rejected。 |
| invalid not degraded | invalid config 是否被写成 degraded success。 | degraded 只用于 runtime optional dependency / read material。 |
| no sensitive leak | raw secret/body/full sensitive ref 是否进入 error/log/report/test cut。 | 只使用 redacted digest、issue ref、safe diagnostic ref。 |
| no truth repair | failure handling 是否改写 truth、stored report、stored replay。 | 只写 marker/report/no activation,不修 truth。 |
| no private schema | 是否新增 marker、DTO、port、mapper、schema、config key。 | 命中则暂停并回 `03` / owning Step。 |
| profile isolation | fake / fixture 是否进入 integration-like / production-like required path。 | production-like / integration-like selected required adapter 不 fallback fake。 |
| Step boundary | 是否写入测试方案、验收、实施或正式文档。 | R11.6 不写正式 `04`,不写 TC / AC / commit boundary。 |

### 9. 03 影响判定记录

| 结构结论 | 是否影响 03 | 处理 |
|---|---|---|
| 只定义失效模式表分组、列语义、辅助表类型、告警字段方向和测试切口粒度 | 否 | 留在 Step 11。 |
| unavailable / degraded 仅映射到 `03` 已有 adapter availability / degraded surface | 否 | 后续逐行表必须回指 `03` 来源。 |
| 后续某行需要新的 formal marker / issue / port / mapper / schema | 是 | 不在 04 私补,暂停并回 `03`。 |
| 后续某行需要具体 config center / secret provider / hot reload / online LKG capability | 是且越界 | 记录 watch / blocker,不写 P0 success path。 |

### 10. R11.7 入口记录

| 下一模块 | 入口条件 | 允许内容 | 禁止内容 |
|---|---|---|---|
| R11.7 失效模式表候选逐行整理:先思考 | 用户确认进入 R11.7。 | 按 R11.6 分组思考主失效模式表的候选逐行内容、覆盖边界和可能的缺口。 | 不写最终逐行表;不进入 R11.8;不创建正式 `04-配置设计.md`;不写测试方案、验收标准、实施计划或代码。 |

### 11. R11.6 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只固化 R11.5 结构思考 | pass | 未写最终逐行失效模式表。 |
| 是否保持规范主列 | pass | 主表列固定为 `失效模式 / 影响 / 系统行为 / 是否告警 / 测试切口`。 |
| 是否明确辅助表 | pass | 配置域策略、生效方式矩阵、告警规则、测试切口、停审、跨策略审计均已保留。 |
| 是否保留安全字段边界 | pass | 告警和测试切口禁止 raw config、raw body、secret、full sensitive ref。 |
| 是否包含 03 回写门禁 | pass | 新 formal marker / port / mapper / schema 仍需回 `03`。 |
| 是否可进入 R11.7 | pass | 等待用户确认后进入失效模式表候选逐行整理:先思考。 |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.7 失效模式表候选逐行整理:先思考`;只允许按 R11.6 分组思考主失效模式表的候选逐行内容、覆盖边界和可能缺口;不得创建正式 `04-配置设计.md`;不得写最终逐行失效模式表、测试方案、验收标准、实施计划或代码。

## R11.7 失效模式表候选逐行整理:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R11.8 |
| 本模块目标 | 按 R11.6 分组思考主失效模式表的候选逐行内容、覆盖边界、系统行为、告警方向、测试切口方向和可能缺口。 |
| 本模块允许 | 形成 candidate 行池、行级覆盖判断、合并 / 拆分判断、03 回写风险预判和 R11.8 写入计划。 |
| 本模块禁止 | 不把候选行标为 final;不创建正式 `04-配置设计.md`;不写测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R11.6 已固化主列语义、分组顺序、辅助表结构和 stop-review 维度,并等待用户确认进入 R11.7。 |

### 2. source / merge / conflict failure 候选行思考

| 候选失效模式 | 候选影响 | 候选系统行为 | 告警方向 | 测试切口方向 | 思考状态 |
|---|---|---|---|---|---|
| required config source missing | startup / job / entry / test 输入不闭合。 | startup fail-fast / run rejected / entry rejected / test fail-fast,按 activation surface 拆分。 | yes for startup / ops;test-only for fixture。 | missing required source by activation surface。 | candidate_keep_split |
| specified config file unreadable | 已声明配置文件无法读取,不能 silent fallback。 | fail-fast with redacted issue ref。 | yes/error。 | unreadable configured file does not fallback defaults。 | candidate |
| config file absent but not explicitly selected | 未指定配置文件时可走已确认 safe default。 | default-fallback only if Step 7 safe default exists。 | no / info。 | unspecified file uses safe defaults only。 | candidate_needs_safe_default_check |
| high-priority env / entry / job value invalid | 高优先级来源覆盖意图存在但值非法。 | fail-fast / rejected;不得 fallback lower priority。 | yes/error。 | invalid high-priority value no fallback。 | candidate |
| duplicate key in same source | 配置语义不确定。 | fail-fast。 | yes/error。 | duplicate key rejected。 | candidate |
| alias / legacy key conflict | 旧口径可能污染新 full-restart 设计。 | fail-fast or Step 13 migration owner。 | yes/error if active。 | alias conflict rejected unless migration rule exists。 | candidate_with_step13_handoff |
| ordinary source contains raw secret | 普通来源承载 secret material。 | fail-closed / validation reject。 | security/error。 | raw secret in file/env rejected。 | candidate |
| test fixture enters production-like / integration-like required path | profile 隔离和 fake/durable parity 被破坏。 | fail-closed / profile validation reject。 | security/error。 | fixture contamination rejected。 | candidate |
| config center / admin override appears as P0 source | P0 运行依赖被凭空引入。 | unsupported / design blocker, no activation。 | yes/error if attempted。 | remote/admin source rejected in P0。 | candidate_watch |
| forbidden boundary override from any source | 配置试图改 truth owner、state、query no-write、stored replay、marker source 等。 | fail-closed / design violation。 | security/error。 | forbidden invariant key rejected。 | candidate |

### 3. parse / type / enum / range failure 候选行思考

| 候选失效模式 | 候选影响 | 候选系统行为 | 告警方向 | 测试切口方向 | 思考状态 |
|---|---|---|---|---|---|
| strict JSON parse failed | loader 无法构造可信 config。 | startup fail-fast / scoped reject by activation。 | yes/error。 | invalid JSON rejected with issue ref。 | candidate |
| JSONC comment / trailing comma in real config | 正式 runtime config 非 strict JSON。 | fail-fast。 | yes/error。 | JSONC accepted only in docs, not runtime config。 | candidate |
| unknown top-level section | 拼写错误或越界配置。 | fail-fast unless future-reserved by explicit schema。 | yes/error。 | unknown section rejected。 | candidate |
| unknown nested field | 拼写错误或未闭口 key。 | fail-fast unless future-reserved by explicit schema。 | yes/error。 | unknown nested field rejected。 | candidate |
| invalid enum / kind | profile、adapter mode、job kind、event version 等无法执行。 | fail-fast / rejected by activation。 | yes/error。 | bad enum rejected。 | candidate |
| invalid primitive type | typed config 无法组装。 | fail-fast / rejected。 | yes/error。 | string vs int/bool/list mismatch。 | candidate |
| invalid numeric range | timeout、batch、page、retention、limit 不安全。 | fail-fast / job rejected。 | yes/error for startup and ops。 | out-of-range limit rejected。 | candidate |
| invalid timestamp / fixed clock | deterministic fixture 或 replay 不可重现。 | test fail-fast / replay job rejected。 | test-only or warn。 | malformed fixed clock rejected。 | candidate |
| invalid ref shape | opaque refs、target refs、route refs、store refs 不合法。 | fail-fast / rejected。 | yes/error。 | malformed ref rejected without raw ref output。 | candidate |

### 4. cross-field / profile compatibility failure 候选行思考

| 候选失效模式 | 候选影响 | 候选系统行为 | 告警方向 | 测试切口方向 | 思考状态 |
|---|---|---|---|---|---|
| profile vs adapter mode incompatible | fake / controlled / durable profile 不匹配。 | fail-fast / fail-closed。 | yes/error。 | production-like fake rejected;integration-like controlled required respected。 | candidate |
| logical store completeness missing | truth / projection / reference / outbox / idempotency store 不闭合。 | startup fail-fast。 | yes/error。 | missing required logical store fails builder。 | candidate |
| resolver family coverage missing / duplicate | required resolver family 不可判定或重复。 | startup fail-fast。 | yes/error。 | missing or duplicate resolver family rejected。 | candidate |
| inbound enabled without namespaces / supported version | worker consumer registry 不闭合。 | startup fail-fast;runtime unsupported version rejected。 | yes/error。 | enabled consumer missing namespace rejected。 | candidate |
| outbox enabled topic route missing | enabled outbound feature 无 route。 | startup fail-fast。 | yes/error。 | missing enabled topic binding rejected。 | candidate |
| externalGrc enabled without adapter / target | export 能力半启用。 | startup fail-fast / job rejected。 | yes/error。 | externalGrc enabled missing target rejected。 | candidate |
| retention / replay window conflict | duplicate replay、report replay 或 redelivery 不可靠。 | startup fail-fast。 | yes/error。 | retention shorter than replay window rejected。 | candidate |
| batch > page / boundary limit | job / outbox / projection / reference 批次越界。 | startup fail-fast / job rejected。 | yes/error。 | batch exceeds page cap rejected。 | candidate |
| redaction deny list empty | 输出保护失效。 | fail-closed / startup fail-fast。 | security/error。 | empty deny list rejected。 | candidate |
| operations-replay missing de-identified root | replay 可能读取 raw historical body 或不可重现。 | replay job rejected。 | yes/warn or security if raw。 | replay root missing or raw rejected。 | candidate |

### 5. sensitive / redaction / forbidden body failure 候选行思考

| 候选失效模式 | 候选影响 | 候选系统行为 | 告警方向 | 测试切口方向 | 思考状态 |
|---|---|---|---|---|---|
| raw secret material in ordinary config | secret 泄露风险。 | fail-closed / validation reject。 | security/error。 | raw password/token/private key rejected。 | candidate |
| raw body / external body in config or output | body-free 边界被破坏。 | fail-closed。 | security/error。 | raw body rejected from config/output。 | candidate |
| full sensitive ref emitted in log/error/report | route / target / store / replay ref 泄露。 | fail-closed or redaction issue;no raw output。 | security/error。 | full ref never appears in issue/log/report。 | candidate |
| high-cardinality labels enabled in P0 | observability 可能泄露或爆炸。 | fail-closed / startup fail-fast。 | security/error。 | high-cardinality true rejected。 | candidate |
| unsafe redaction relaxation | redaction 被放宽。 | fail-closed / no activation。 | security/error。 | unsafe redaction relax rejected。 | candidate |
| future secret provider unavailable | future credential provider 不可用。 | fail-fast / rejected / failed marker by profile, no fake fallback。 | yes/error。 | provider unavailable cannot fallback fake。 | candidate_watch |
| adapter returns raw external error body | raw upstream body 可能污染 issue/report。 | map to redacted failure ref only。 | yes/warn。 | raw adapter error body redacted。 | candidate |

### 6. activation surface failure 候选行思考

| 候选失效模式 | 候选影响 | 候选系统行为 | 告警方向 | 测试切口方向 | 思考状态 |
|---|---|---|---|---|---|
| startup validation failed | runtime builder 不可信。 | builder Failed;no facade。 | yes/error。 | startup invalid config exposes no facade。 | candidate |
| runtime builder partial assembly | facade 可能半可用。 | fail-fast;no API / worker / jobs facade。 | yes/error。 | partial builder no service exposed。 | candidate |
| job-run-start input invalid | 当前 job run 不闭合。 | job rejected before formal side effect。 | yes/warn for ops。 | invalid job input rejected。 | candidate |
| entry-local selector invalid | 当前 entry 请求越界或不闭合。 | current entry rejected。 | warn/debug or yes by profile。 | invalid entry selector rejected。 | candidate |
| test harness fixture invalid | 测试不可重现或污染 profile。 | test fail-fast。 | test-only。 | invalid fixture fails test harness。 | candidate |
| reload / hot config present | P0 unsupported 能力被请求。 | rejected / design blocker / no activation。 | yes/error。 | reload/hot key rejected。 | candidate |

### 7. required dependency unavailable 候选行思考

| 候选失效模式 | 候选影响 | 候选系统行为 | 告警方向 | 测试切口方向 | 思考状态 |
|---|---|---|---|---|---|
| required store adapter unavailable at startup | truth / material / idempotency store 不可装配。 | startup fail-fast。 | yes/error。 | required store unavailable fails builder。 | candidate |
| required external resolver adapter unavailable at startup | required source / resolver 无法验证。 | startup fail-fast or operation rejected if scoped。 | yes/error。 | required resolver unavailable no fake fallback。 | candidate |
| required publisher / handoff target missing at startup | enabled outbound / handoff 半装配。 | startup fail-fast。 | yes/error。 | enabled publisher target missing rejected。 | candidate |
| required clock / id generator missing | mutation id/time 无来源。 | startup fail-fast or command/job rejected before mutation。 | yes/error。 | missing clock/id blocks mutation path。 | candidate |
| production-like selects fake adapter | profile 隔离破坏。 | fail-closed / startup fail-fast。 | security/error。 | fake in production-like rejected。 | candidate |
| integration-like controlled adapter selected but unavailable | required controlled dependency 不可用。 | startup fail-fast if required;otherwise formal unavailable surface。 | yes/error。 | controlled adapter unavailable follows role。 | candidate_needs_role_split |

### 8. runtime optional dependency unavailable 候选行思考

| 候选失效模式 | 候选影响 | 候选系统行为 | 告警方向 | 测试切口方向 | 思考状态 |
|---|---|---|---|---|---|
| optional read material unavailable | query 无法完整读取派生材料。 | query degraded / unavailable;no write。 | aggregate/warn。 | query degraded no repository write。 | candidate |
| external resolver unavailable during query | read surface 无法完整解析外部引用。 | query degraded/unavailable by formal mapper。 | aggregate/warn。 | resolver query unavailable returns degraded surface。 | candidate |
| external resolver unavailable during consumer | inbound 处理无法安全完成。 | delayed / failed by flow;no snapshot/stale fake。 | yes/warn。 | consumer resolver unavailable delayed。 | candidate |
| publisher unavailable during outbox job | outbound event 未发布。 | failed marker / retryable report;truth unchanged。 | yes/warn/error。 | publisher failure no truth rollback。 | candidate |
| handoff/export target unavailable | handoff/export 无法交付。 | job failed / partial / marker;truth unchanged。 | yes/warn/error。 | handoff target unavailable writes safe marker。 | candidate |
| diagnostic sink unavailable | safe diagnostic 输出不完整。 | degraded reporting / safe issue;no raw fallback。 | aggregate/warn。 | diagnostic sink unavailable no raw output。 | candidate |
| optional externalGrc disabled | 外部导出不执行。 | disabled / job rejected;core truth unaffected。 | no/info。 | externalGrc disabled does not block core。 | candidate |

### 9. drift / stale / rollback target failure 候选行思考

| 候选失效模式 | 候选影响 | 候选系统行为 | 告警方向 | 测试切口方向 | 思考状态 |
|---|---|---|---|---|---|
| config digest drift from expected artifact | runtime 与审计 baseline 不一致。 | startup fail-fast or release gate block。 | yes/error。 | digest mismatch blocks startup/release。 | candidate |
| previous rollback target not validated | 回滚可能引入坏配置。 | rollback rejected / no activation。 | yes/error。 | unvalidated rollback target rejected。 | candidate |
| stale job input after config change | old run 不应被 silently rewritten。 | only new run uses new validated input;stored report unchanged。 | no / audit。 | old job report unchanged after config change。 | candidate |
| stale entry selector | current entry selector 过期或非法。 | current entry rejected;rerun with valid selector。 | warn/debug。 | stale selector rejected。 | candidate |
| stale / raw replay artifact root | replay 不可重现或泄露。 | replay job rejected。 | yes/security if raw。 | stale/raw replay root rejected。 | candidate |
| online last-known-good requested | 无 runtime reload contract。 | unsupported / no activation;restart only。 | yes/error。 | online LKG rejected;previous validated restart allowed。 | candidate |

### 10. future / watch 与 invariant override 候选行思考

| 候选失效模式 | 候选影响 | 候选系统行为 | 告警方向 | 测试切口方向 | 思考状态 |
|---|---|---|---|---|---|
| config center unavailable | P0 不依赖 config center。 | not_applicable / future watch;no runtime dependency。 | no unless attempted as P0 source。 | config center key/source rejected in P0。 | candidate_watch |
| admin override unavailable / requested | P0 不支持 live operator override。 | unsupported / no activation / design blocker。 | yes/error if attempted。 | admin override rejected in P0。 | candidate_watch |
| secret provider product requested | P0 未定义 provider schema。 | design blocker;no P0 success path。 | yes/error if attempted。 | provider product config requires design closure。 | candidate_watch |
| truth owner override | 破坏数据所有权。 | fail-closed / design violation。 | security/error。 | truth owner override rejected。 | candidate |
| query write override | 破坏 query no-write。 | fail-closed / design violation。 | security/error。 | query write knob rejected。 | candidate |
| job truth repair override | 破坏 job no-truth-repair。 | fail-closed / design violation。 | security/error。 | job repair config rejected。 | candidate |
| stored replay disable / rewrite | 破坏 replay consistency。 | fail-closed / design violation。 | security/error。 | replay rewrite config rejected。 | candidate |
| marker source synthesis config | marker 来源被配置私造。 | fail-closed / design violation;回 `03`。 | security/error。 | marker synthesis config rejected。 | candidate |
| body-free bypass | raw body 可进入 query/report/handoff。 | fail-closed。 | security/error。 | body-free bypass rejected。 | candidate |
| P0/P1 scope isolation override | P1/P2 能力污染 P0。 | fail-closed / design violation。 | yes/error。 | P0/P1 isolation override rejected。 | candidate |

### 11. 候选行合并 / 拆分思考

| 议题 | 思考结论 | R11.8 写入指引 |
|---|---|---|
| 缺配置是否合并 | 不合并成单行;按 startup/job/entry/test 或 enabled target 拆分。 | 主表至少保留 required source missing、enabled target missing、fixture missing。 |
| 错配置是否合并 | parse/type/range/cross-field 应分开,因为测试切口和系统行为不同。 | R11.8 逐行保留关键错误类型。 |
| unavailable 是否合并 | required startup unavailable 与 runtime optional unavailable 必须分开。 | 分别落入 required dependency 与 runtime optional dependency 两组。 |
| secret provider 与 raw secret 是否合并 | 不合并;raw secret 是当前 fail-closed,provider 是 future/watch 或 profile role。 | R11.8 单独保留。 |
| config center/admin override 是否进入主表 | 进入主表但标 watch/not_applicable,防止后续误写 P0 success path。 | R11.8 写 watch 候选行。 |
| invariant override 是否进入主表 | 进入主表,作为 fail-closed / design violation 候选。 | R11.8 写入 redline 行。 |
| 告警字段是否逐行展开 | 主表只写告警方向;详细 safe/forbidden 字段放辅助告警表。 | R11.8 不写完整告警字段表。 |

### 12. 可能缺口与 03 影响预判

| 可能缺口 | 是否阻塞 R11.7 | 处理 |
|---|---|---|
| 某些 degraded / unavailable marker 的正式来源若未在 `03` 闭合 | 暂不阻塞本模块思考 | R11.8 逐行写成“依 `03` formal surface”;若需要新增 marker,暂停回 `03`。 |
| secret provider future 能力没有正式 schema | 不阻塞 | 保持 watch/not_applicable,不写 P0 success path。 |
| config center/admin override 没有正式 contract | 不阻塞 | 保持 watch/not_applicable,不写 runtime dependency。 |
| 旧 `05/06/07` 仍含旧 MethodContent 口径 | 不阻塞 | 不反向生成 TC/AC/commit;测试切口只写方向。 |
| 告警平台 / SLO / pager 未定义 | 不阻塞 | Step 11 只写告警方向和 safe 字段方向。 |

### 13. R11.8 写入计划

| R11.8 拟写内容 | 写入边界 |
|---|---|
| 候选逐行记录 | 把 R11.7 的候选行池按 R11.6 分组写成主失效模式表候选记录。 |
| 合并 / 拆分记录 | 固化哪些行必须拆分、哪些行可合并到后续辅助表。 |
| 缺口 / 03 影响记录 | 固化需要回 `03` 的条件,但不在 04 私补。 |
| R11.9 入口 | 进入按配置域组织的失败策略表候选:先思考。 |

### 14. R11.7 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做候选逐行先思考 | pass | 所有行均标 candidate / watch / needs split,未标 final。 |
| 是否按 R11.6 分组展开 | pass | source、validation、cross-field、sensitive、activation、dependency、runtime、drift、watch、invariant 均已覆盖。 |
| 是否避免写正式 `04` | pass | 未创建或修改正式 `04-配置设计.md`。 |
| 是否避免测试 / 验收 / 实施越界 | pass | 测试切口仅为方向,未写 TC ID、AC 或 commit。 |
| 是否保留安全红线 | pass | raw secret、raw body、fake fallback、query write、truth repair、marker synthesis 均保持拒绝。 |
| 是否可进入 R11.8 | pass | 等待用户确认后进入失效模式表候选逐行整理:再写入。 |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.8 失效模式表候选逐行整理:再写入`;只允许把 R11.7 的候选行池、覆盖边界、合并 / 拆分判断、缺口与 03 影响预判写成可恢复记录;不得创建正式 `04-配置设计.md`;不得把候选行标为 final;不得写测试方案、验收标准、实施计划或代码。

## R11.8 失效模式表候选逐行整理:再写入

### 1. 当前模块状态记录

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R11.9 |
| 本模块目标 | 将 R11.7 的失效模式候选行池、覆盖边界、合并 / 拆分判断、缺口与 03 影响预判固化为可恢复记录。 |
| 本模块已写入 | 主失效模式候选行记录、覆盖边界记录、合并 / 拆分记录、缺口与 03 影响记录、R11.9 入口和停审记录。 |
| 本模块未写入 | 未标 final;未写正式 `04-配置设计.md`;未写按配置域最终策略表;未写告警字段辅助表;未写测试方案、验收标准、实施计划或代码。 |
| 当前恢复口径 | 用户已确认从 R11.7 进入 R11.8;R11.8 完成后等待用户确认进入 R11.9。 |

### 2. 主失效模式候选行记录

> 本表是 Step 11 中间产物候选池,不是正式 `04-配置设计.md` §11 的最终表。所有行均保持 candidate / watch / needs-check 状态,后续 R11.9 起再按配置域组织策略。

| 分组 | 候选失效模式 | 候选系统行为 | 候选告警 | 候选测试切口 | 状态 |
|---|---|---|---|---|---|
| source / merge / conflict | required config source missing | startup fail-fast / run rejected / entry rejected / test fail-fast,按 activation surface 拆分。 | startup / ops yes;fixture test-only。 | missing required source by activation surface。 | candidate_keep_split |
| source / merge / conflict | specified config file unreadable | fail-fast with redacted issue ref;不得 silent fallback。 | yes/error。 | unreadable selected file does not fallback defaults。 | candidate |
| source / merge / conflict | config file absent but not explicitly selected | 仅在 Step 7 已有 safe default 时允许 default-fallback。 | no/info。 | unspecified file uses safe defaults only。 | candidate_needs_safe_default_check |
| source / merge / conflict | high-priority env / entry / job value invalid | fail-fast / rejected;不得 fallback lower priority。 | yes/error。 | invalid high-priority value no fallback。 | candidate |
| source / merge / conflict | duplicate key in same source | fail-fast。 | yes/error。 | duplicate key rejected。 | candidate |
| source / merge / conflict | alias / legacy key conflict | fail-fast 或交 Step 13 migration owner。 | yes/error if active。 | alias conflict rejected unless migration rule exists。 | candidate_with_step13_handoff |
| source / merge / conflict | ordinary source contains raw secret | fail-closed / validation reject。 | security/error。 | raw secret in ordinary source rejected。 | candidate |
| source / merge / conflict | test fixture enters production-like / integration-like required path | fail-closed / profile validation reject。 | security/error。 | fixture contamination rejected。 | candidate |
| source / merge / conflict | config center / admin override appears as P0 source | unsupported / design blocker / no activation。 | yes/error if attempted。 | remote/admin source rejected in P0。 | candidate_watch |
| source / merge / conflict | forbidden boundary override from any source | fail-closed / design violation。 | security/error。 | forbidden invariant key rejected。 | candidate |
| parse / type / enum / range | strict JSON parse failed | startup fail-fast / scoped reject by activation。 | yes/error。 | invalid JSON rejected with issue ref。 | candidate |
| parse / type / enum / range | JSONC comment / trailing comma in real config | fail-fast。 | yes/error。 | JSONC accepted only in docs, not runtime config。 | candidate |
| parse / type / enum / range | unknown top-level section | fail-fast unless future-reserved by explicit schema。 | yes/error。 | unknown section rejected。 | candidate |
| parse / type / enum / range | unknown nested field | fail-fast unless future-reserved by explicit schema。 | yes/error。 | unknown nested field rejected。 | candidate |
| parse / type / enum / range | invalid enum / kind | fail-fast / rejected by activation。 | yes/error。 | bad enum rejected。 | candidate |
| parse / type / enum / range | invalid primitive type | fail-fast / rejected。 | yes/error。 | string vs int/bool/list mismatch rejected。 | candidate |
| parse / type / enum / range | invalid numeric range | fail-fast / job rejected。 | yes/error for startup and ops。 | out-of-range limit rejected。 | candidate |
| parse / type / enum / range | invalid timestamp / fixed clock | test fail-fast / replay job rejected。 | test-only or warn。 | malformed fixed clock rejected。 | candidate |
| parse / type / enum / range | invalid ref shape | fail-fast / rejected with safe issue ref。 | yes/error。 | malformed ref rejected without raw ref output。 | candidate |
| cross-field / profile compatibility | profile vs adapter mode incompatible | fail-fast / fail-closed。 | yes/error。 | production-like fake rejected;controlled requirement respected。 | candidate |
| cross-field / profile compatibility | logical store completeness missing | startup fail-fast。 | yes/error。 | missing required logical store fails builder。 | candidate |
| cross-field / profile compatibility | resolver family coverage missing / duplicate | startup fail-fast。 | yes/error。 | missing or duplicate resolver family rejected。 | candidate |
| cross-field / profile compatibility | inbound enabled without namespaces / supported version | startup fail-fast;runtime unsupported version rejected。 | yes/error。 | enabled consumer missing namespace rejected。 | candidate |
| cross-field / profile compatibility | outbox enabled topic route missing | startup fail-fast。 | yes/error。 | missing enabled topic binding rejected。 | candidate |
| cross-field / profile compatibility | externalGrc enabled without adapter / target | startup fail-fast / job rejected。 | yes/error。 | externalGrc enabled missing target rejected。 | candidate |
| cross-field / profile compatibility | retention / replay window conflict | startup fail-fast。 | yes/error。 | retention shorter than replay window rejected。 | candidate |
| cross-field / profile compatibility | batch > page / boundary limit | startup fail-fast / job rejected。 | yes/error。 | batch exceeds page cap rejected。 | candidate |
| cross-field / profile compatibility | redaction deny list empty | fail-closed / startup fail-fast。 | security/error。 | empty deny list rejected。 | candidate |
| cross-field / profile compatibility | operations-replay missing de-identified root | replay job rejected。 | yes/warn or security if raw。 | replay root missing or raw rejected。 | candidate |
| sensitive / redaction / forbidden body | raw secret material in ordinary config | fail-closed / validation reject。 | security/error。 | raw password/token/private key rejected。 | candidate |
| sensitive / redaction / forbidden body | raw body / external body in config or output | fail-closed。 | security/error。 | raw body rejected from config/output。 | candidate |
| sensitive / redaction / forbidden body | full sensitive ref emitted in log/error/report | fail-closed or redaction issue;no raw output。 | security/error。 | full ref never appears in issue/log/report。 | candidate |
| sensitive / redaction / forbidden body | high-cardinality labels enabled in P0 | fail-closed / startup fail-fast。 | security/error。 | high-cardinality true rejected。 | candidate |
| sensitive / redaction / forbidden body | unsafe redaction relaxation | fail-closed / no activation。 | security/error。 | unsafe redaction relax rejected。 | candidate |
| sensitive / redaction / forbidden body | future secret provider unavailable | fail-fast / rejected / failed marker by profile;no fake fallback。 | yes/error。 | provider unavailable cannot fallback fake。 | candidate_watch |
| sensitive / redaction / forbidden body | adapter returns raw external error body | map to redacted failure ref only。 | yes/warn。 | raw adapter error body redacted。 | candidate |
| activation surface | startup validation failed | builder Failed;no facade。 | yes/error。 | startup invalid config exposes no facade。 | candidate |
| activation surface | runtime builder partial assembly | fail-fast;no API / worker / jobs facade。 | yes/error。 | partial builder no service exposed。 | candidate |
| activation surface | job-run-start input invalid | job rejected before formal side effect。 | yes/warn for ops。 | invalid job input rejected。 | candidate |
| activation surface | entry-local selector invalid | current entry rejected。 | warn/debug or profile yes。 | invalid entry selector rejected。 | candidate |
| activation surface | test harness fixture invalid | test fail-fast。 | test-only。 | invalid fixture fails test harness。 | candidate |
| activation surface | reload / hot config present | rejected / design blocker / no activation。 | yes/error。 | reload/hot key rejected。 | candidate |
| required dependency unavailable | required store adapter unavailable at startup | startup fail-fast。 | yes/error。 | required store unavailable fails builder。 | candidate |
| required dependency unavailable | required external resolver adapter unavailable at startup | startup fail-fast or operation rejected if scoped。 | yes/error。 | required resolver unavailable no fake fallback。 | candidate |
| required dependency unavailable | required publisher / handoff target missing at startup | startup fail-fast。 | yes/error。 | enabled publisher target missing rejected。 | candidate |
| required dependency unavailable | required clock / id generator missing | startup fail-fast or command/job rejected before mutation。 | yes/error。 | missing clock/id blocks mutation path。 | candidate |
| required dependency unavailable | production-like selects fake adapter | fail-closed / startup fail-fast。 | security/error。 | fake in production-like rejected。 | candidate |
| required dependency unavailable | integration-like controlled adapter selected but unavailable | required -> startup fail-fast;optional -> formal unavailable surface。 | yes/error。 | controlled adapter unavailable follows role。 | candidate_needs_role_split |
| runtime optional dependency unavailable | optional read material unavailable | query degraded / unavailable;no write。 | aggregate/warn。 | query degraded no repository write。 | candidate |
| runtime optional dependency unavailable | external resolver unavailable during query | query degraded/unavailable by formal mapper。 | aggregate/warn。 | resolver query unavailable returns degraded surface。 | candidate |
| runtime optional dependency unavailable | external resolver unavailable during consumer | delayed / failed by flow;no snapshot/stale fake。 | yes/warn。 | consumer resolver unavailable delayed。 | candidate |
| runtime optional dependency unavailable | publisher unavailable during outbox job | failed marker / retryable report;truth unchanged。 | yes/warn/error。 | publisher failure no truth rollback。 | candidate |
| runtime optional dependency unavailable | handoff/export target unavailable | job failed / partial / marker;truth unchanged。 | yes/warn/error。 | handoff target unavailable writes safe marker。 | candidate |
| runtime optional dependency unavailable | diagnostic sink unavailable | degraded reporting / safe issue;no raw fallback。 | aggregate/warn。 | diagnostic sink unavailable no raw output。 | candidate |
| runtime optional dependency unavailable | optional externalGrc disabled | disabled / job rejected;core truth unaffected。 | no/info。 | externalGrc disabled does not block core。 | candidate |
| drift / stale / rollback target | config digest drift from expected artifact | startup fail-fast or release gate block。 | yes/error。 | digest mismatch blocks startup/release。 | candidate |
| drift / stale / rollback target | previous rollback target not validated | rollback rejected / no activation。 | yes/error。 | unvalidated rollback target rejected。 | candidate |
| drift / stale / rollback target | stale job input after config change | only new run uses new validated input;stored report unchanged。 | no/audit。 | old job report unchanged after config change。 | candidate |
| drift / stale / rollback target | stale entry selector | current entry rejected;rerun with valid selector。 | warn/debug。 | stale selector rejected。 | candidate |
| drift / stale / rollback target | stale / raw replay artifact root | replay job rejected。 | yes/security if raw。 | stale/raw replay root rejected。 | candidate |
| drift / stale / rollback target | online last-known-good requested | unsupported / no activation;restart only。 | yes/error。 | online LKG rejected;previous validated restart allowed。 | candidate |
| future / watch and invariant override | config center unavailable | not_applicable / future watch;no runtime dependency。 | no unless attempted as P0 source。 | config center key/source rejected in P0。 | candidate_watch |
| future / watch and invariant override | admin override unavailable / requested | unsupported / no activation / design blocker。 | yes/error if attempted。 | admin override rejected in P0。 | candidate_watch |
| future / watch and invariant override | secret provider product requested | design blocker;no P0 success path。 | yes/error if attempted。 | provider product config requires design closure。 | candidate_watch |
| future / watch and invariant override | truth owner override | fail-closed / design violation。 | security/error。 | truth owner override rejected。 | candidate |
| future / watch and invariant override | query write override | fail-closed / design violation。 | security/error。 | query write knob rejected。 | candidate |
| future / watch and invariant override | job truth repair override | fail-closed / design violation。 | security/error。 | job repair config rejected。 | candidate |
| future / watch and invariant override | stored replay disable / rewrite | fail-closed / design violation。 | security/error。 | replay rewrite config rejected。 | candidate |
| future / watch and invariant override | marker source synthesis config | fail-closed / design violation;回 `03`。 | security/error。 | marker synthesis config rejected。 | candidate |
| future / watch and invariant override | body-free bypass | fail-closed。 | security/error。 | body-free bypass rejected。 | candidate |
| future / watch and invariant override | P0/P1 scope isolation override | fail-closed / design violation。 | yes/error。 | P0/P1 isolation override rejected。 | candidate |

### 3. 覆盖边界记录

| 覆盖边界 | 当前记录 |
|---|---|
| 缺配置 | 已覆盖 required source missing、selected file unreadable、enabled target missing、fixture missing 等候选;后续按 activation surface 与配置域拆分。 |
| 错配置 | 已覆盖 strict parse、unknown section / field、enum、primitive type、range、timestamp、ref shape、cross-field compatibility。 |
| 敏感配置不可读 / 禁止 | 已覆盖 raw secret、raw body、full sensitive ref、高基数 label、unsafe redaction、future secret provider unavailable。 |
| config center 不可达 | 当前 P0 不依赖 config center;只作为 watch/not_applicable,并记录 attempted-as-source 的拒绝切口。 |
| 配置漂移 / 过期 | 已覆盖 digest drift、rollback target not validated、stale job input、stale entry selector、stale/raw replay root、online LKG request。 |
| adapter / dependency unavailable | 已拆成 required startup unavailable 与 runtime optional unavailable,避免把必需依赖错误写成 degraded success。 |
| 禁止配置化边界 | 已覆盖 truth owner、query write、job truth repair、stored replay rewrite、marker synthesis、body-free bypass、P0/P1 isolation override。 |

### 4. 合并 / 拆分记录

| 议题 | 固化判断 | 后续处理 |
|---|---|---|
| 缺配置是否合并 | 不合并成单行。 | R11.9 按 runtime / job / entry / test / enabled target 拆分到配置域策略。 |
| parse / type / range / cross-field 是否合并 | 不合并。 | 主表保留不同测试切口和系统行为,正式装配时可压缩描述但不能丢失判断。 |
| required unavailable 与 optional unavailable 是否合并 | 不合并。 | required 倾向 startup fail-fast / operation rejected;optional 倾向 degraded / delayed / failed marker。 |
| raw secret 与 secret provider unavailable 是否合并 | 不合并。 | raw secret 是当前 fail-closed;secret provider 属 future/watch 或 profile role。 |
| config center / admin override 是否进入候选池 | 保留进入候选池。 | 标 watch/not_applicable,防止后续误写 P0 runtime dependency。 |
| invariant override 是否进入候选池 | 保留进入候选池。 | 作为 fail-closed / design violation 行,后续承接到禁止配置化边界。 |
| 告警字段是否在主表逐行展开 | 暂不展开。 | R11.11 或后续辅助告警记录再列 safe / forbidden 字段方向。 |

### 5. 缺口与 03 影响记录

| 缺口 / 影响 | 当前判定 | 处理口径 |
|---|---|---|
| degraded / unavailable marker 正式来源不足 | 可能影响 `03`。 | R11.8 仅记录“依 `03` formal surface”;若后续行需要新增 marker / mapper / port,暂停并回 `03` owning Step。 |
| secret provider schema 未定义 | 不阻塞 Step 11 候选记录。 | 保持 watch/not_applicable;不得写成 P0 成功路径。 |
| config center / admin override contract 未定义 | 不阻塞 Step 11 候选记录。 | 保持 watch/not_applicable;不得写成 runtime dependency。 |
| old `05/06/07` 旧口径污染 | 不阻塞 Step 11 候选记录。 | 测试切口仅写方向;不得反向生成 TC、AC、commit 或 evidence schema。 |
| 告警平台 / SLO / pager 未定义 | 不阻塞 Step 11 候选记录。 | 只记录告警方向和 safe 字段方向;具体平台留给运维 / 后续文档。 |
| 需要新增 config key / env / profile / product binding | 影响 `04` 后续 Step 或回上游。 | R11.8 不新增 key;若必须新增,回 Step 7 或 Step 13/14 讨论。 |

### 6. R11.9 入口记录

| 下一模块 | 入口条件 | 允许内容 | 禁止内容 |
|---|---|---|---|
| R11.9 按配置域组织的失败策略表候选:先思考 | 用户确认进入 R11.9。 | 思考如何把 R11.8 候选行映射到 runtime、stores、resolvers、inbound、outbox、jobs、handoff、externalGrc、redaction、boundary、idempotency、projection/reference、clock/id、test/replay 等配置域。 | 不写正式 `04-配置设计.md`;不把候选策略标 final;不写测试方案、验收标准、实施计划或代码。 |

### 7. R11.8 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做候选逐行再写入 | pass | 已把 R11.7 候选行池固化为可恢复记录,未标 final。 |
| 是否保留 R11.6 分组 | pass | 九类分组全部保留,并附候选系统行为、告警方向和测试切口方向。 |
| 是否避免正式 `04` 越界 | pass | 未创建或修改正式 `04-配置设计.md`。 |
| 是否避免下游越界 | pass | 未写 TC ID、AC、commit、evidence schema 或代码。 |
| 是否保留高风险红线 | pass | silent fallback、raw secret、raw body、fake fallback、query write、truth repair、marker synthesis 均保持拒绝。 |
| 是否包含 03 影响判定 | pass | 新增 marker / mapper / port / schema 仍需回 `03` owning Step。 |
| 是否可进入 R11.9 | pass | 等待用户确认后进入按配置域组织的失败策略表候选:先思考。 |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.9 按配置域组织的失败策略表候选:先思考`;只允许思考 R11.8 候选行如何映射到各配置域的失败策略表候选;不得创建正式 `04-配置设计.md`;不得把候选策略标为 final;不得写测试方案、验收标准、实施计划或代码。

## R11.9 按配置域组织的失败策略表候选:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R11.10 |
| 本模块目标 | 思考如何把 R11.8 主失效模式候选行映射到 Step 7 / Step 9 已确认的配置域,形成后续 R11.10 可写入的按配置域失败策略候选表。 |
| 本模块允许 | 思考配置域分组、每个配置域的典型失败、候选策略、activation surface、public / worker / job surface、告警方向和 03 影响预判。 |
| 本模块禁止 | 不写正式 `04-配置设计.md`;不把候选策略标 final;不写完整告警字段表;不写测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R11.8 已将主失效模式候选行池写成可恢复记录,并等待用户确认进入 R11.9。 |

### 2. 配置域映射方法思考

| 映射维度 | 思考结论 | R11.10 写入要求 |
|---|---|---|
| 配置域来源 | 以 Step 7 配置项 family 和 Step 9 加载 / 校验 / 生效表为主,不是按 R11.8 的失效类型机械分组。 | R11.10 主表使用配置域作为第一列。 |
| 典型失败来源 | 从 R11.8 的 source、parse/type/range、cross-field、sensitive、activation、dependency、runtime optional、drift/watch/redline 候选中挑选与该域相关的失败。 | 每个域至少覆盖 missing、invalid、cross-field 或 unavailable 中适用项。 |
| 策略表达 | 使用 fail-fast、fail-closed、rejected、degraded、delayed、failed marker、test fail-fast、no activation。 | 不新增未定义策略词。 |
| activation surface | 明确 startup、job-run-start、entry-local、test harness、runtime adapter call 或 unsupported/rejected。 | 不把 startup required failure 写成 runtime degraded。 |
| public / worker / job surface | 只记录 surface 方向,如 no facade、entry rejected、job rejected、query degraded、worker delayed、job failed / partial report。 | 不补 DTO、error enum、marker schema 或 report schema。 |
| 告警方向 | 只记录 yes / security / aggregate / test-only / no-info 的候选方向。 | 详细 safe 字段留给后续告警辅助表。 |
| 03 影响 | 若某域策略需要新增 marker / mapper / port / state / config carrier,必须回 `03`。 | R11.10 写入每域影响判定。 |

### 3. 按配置域失败策略候选思考

| 配置域 | 典型失败候选 | 候选策略 | 候选 surface | 思考状态 |
|---|---|---|---|---|
| runtime profile / entry readiness | profile invalid、strict validation disabled、reload / hot requested、builder partial assembly。 | startup fail-fast;reload/hot unsupported no activation;安全相关 fail-closed。 | builder Failed;no API / worker / jobs facade;entry selector invalid => entry rejected。 | candidate |
| stores / logical repositories | required store missing、invalid store ref、logical store completeness missing、production-like fake selected。 | required startup fail-fast;fake production-like fail-closed。 | startup failed;no repository adapter registry exposed。 | candidate |
| external source / resolver binding | required resolver family missing、duplicate family、invalid mode、required adapter unavailable、runtime resolver unavailable。 | config invalid fail-fast;required unavailable fail-fast;runtime unavailable按 role degraded / delayed / rejected。 | command dependency unavailable;query degraded;consumer delayed;job failed where applicable。 | candidate_needs_formal_marker_check |
| inbound consumers | enabled without namespace、unsupported version、dedup retention invalid、body-free validation issue。 | startup fail-fast for config;runtime unsupported event rejected / delayed by formal inbound flow。 | worker not started for invalid config;receipt rejected/delayed by formal surface。 | candidate |
| outbox / publisher | enabled topic route missing、publisher ref invalid、batch invalid、publisher unavailable during outbox job。 | config fail-fast;job-run-start invalid rejected;runtime publish failure failed marker / retryable report。 | publish job rejected / partial / failed report;truth unchanged。 | candidate |
| jobs / operations runner | unknown job kind、batch/page conflict、timeout/range invalid、stale job input、replay root invalid。 | startup fail-fast for default invalid;job-run-start rejected for run-local invalid;stale old run unchanged。 | job rejected before side effect;stored report immutable;new run required。 | candidate |
| handoff / export target | enabled target missing、target ref invalid、handoff unavailable、delivered without safe receipt marker if future surface lacks source。 | startup fail-fast or job rejected for config;runtime target unavailable failed / partial marker。 | handoff/export job failed or partial;core truth unchanged。 | candidate_needs_marker_source_check |
| externalGrc | enabled without adapter/target、target disabled、optional externalGrc disabled。 | enabled missing config fail-fast / job rejected;disabled no-op for core truth。 | export job rejected/failed;commands and core truth unaffected。 | candidate |
| redaction / diagnostics | deny list empty、unsafe relax、full sensitive ref output、high-cardinality label enabled、diagnostic sink unavailable。 | fail-closed / startup fail-fast for unsafe config;diagnostic sink runtime unavailable => degraded reporting with safe issue。 | startup failed, output rejected, or safe degraded diagnostic only。 | candidate |
| forbidden boundary / invariant | truth owner override、query write override、job truth repair override、stored replay rewrite、marker synthesis、body-free bypass、P0/P1 isolation override。 | fail-closed / design violation / no activation。 | validation rejected with safe issue;no facade or current input rejected。 | candidate_redline |
| boundary / limits | page/body/time limit invalid、batch > page、range unsafe、entry-local selector stale。 | startup fail-fast or entry/job rejected by activation surface。 | entry rejected;job rejected;no mutation side effect。 | candidate |
| idempotency / result replay | retention too short、result replay window unsafe、stored replay disable / rewrite requested。 | startup fail-fast;replay rewrite config fail-closed。 | startup failed;duplicate replay semantics unchanged。 | candidate |
| projection / reference read material | stale threshold invalid、batch invalid、optional read material unavailable、reference resolver unavailable during query。 | config invalid fail-fast / job rejected;runtime material unavailable query degraded/unavailable no-write。 | query degraded;maintenance job failed/partial;no material repair from query。 | candidate_needs_formal_marker_check |
| clock / id | clock/id adapter missing、invalid ref shape、fixed clock incompatible with profile。 | startup fail-fast or command/job rejected before mutation;test fail-fast for fixture clock invalid。 | no UoW begins without clock/id;test harness fails before fake runtime seed。 | candidate |
| test fixtures / operations replay | fixture missing、fixture contamination、invalid timestamp、raw/stale replay artifact root。 | test fail-fast;replay job rejected;production-like fixture fail-closed。 | test failure;replay run rejected;no raw body output。 | candidate |
| config center / admin override / future secret provider | P0 source attempted、admin override requested、secret provider product requested/unavailable。 | watch/not_applicable;attempted P0 use unsupported / no activation;future contract requires design closure。 | validation rejected or design blocker;no runtime dependency。 | candidate_watch |

### 4. 配置域合并 / 拆分思考

| 议题 | 思考结论 | 理由 |
|---|---|---|
| stores 与 projection/reference 是否合并 | 不合并。 | stores 是 startup logical adapter completeness;projection/reference 还涉及 runtime query degraded / maintenance job failure。 |
| externalResolvers 与 reference 是否合并 | 不合并。 | resolver 是 adapter / source binding;reference 是 read material / state freshness 与 query degraded。 |
| outbox 与 handoff 是否合并 | 不合并。 | outbox 是 event publication candidate / publisher;handoff/export 是 downstream target / receipt / report surface。 |
| redaction 与 diagnostics 是否合并 | 可在同一配置域内并列。 | 两者都服务 safe output,但 unsafe redaction 是 fail-closed,diagnostic sink unavailable 可 degraded reporting。 |
| boundary 与 forbidden invariant 是否合并 | 不合并。 | boundary limits 是合法 guard 参数;forbidden invariant 是不可配置红线。 |
| idempotency 与 jobs 是否合并 | 不合并。 | jobs 有 run-local failure;idempotency/result replay 是 stored replay consistency redline。 |
| watch 项是否进入配置域表 | 进入但标 watch/not_applicable。 | 用来防止 config center/admin override/secret provider 被后续误写成 P0 success path。 |

### 5. 03 影响预判

| 配置域 / 结论类型 | 是否可能影响 03 | 处理 |
|---|---|---|
| 只把已有 Step 7 配置项映射到 fail-fast / rejected / test fail-fast | 否 | 可留在 04 Step 11 候选。 |
| 只把 Step 9 activation surface 映射到 no facade / job rejected / entry rejected | 否 | 可留在 04 Step 11 候选。 |
| query degraded / consumer delayed / job failed 需要复制正式 marker | 可能 | 若 `03` 已有 marker 来源则复制;若缺失,暂停回 `03`。 |
| handoff/export failed 或 partial surface 需要新 receipt / marker 来源 | 可能 | 不在 04 私补;后续 R11.10 标 `needs_marker_source_check`。 |
| config center、admin override、secret provider、hot reload、online LKG 要成为成功路径 | 是且越界 | 维持 watch/not_applicable;若要启用,回架构 / `03`。 |
| forbidden invariant override 被配置项表达 | 是且越界 | 拒绝作为配置项或成功路径;只能作为 fail-closed design violation。 |

### 6. R11.10 写入计划

| R11.10 拟写内容 | 写入边界 |
|---|---|
| 配置域失败策略候选表 | 把 R11.9 的配置域、典型失败、候选策略、surface、告警方向和状态写成可恢复记录。 |
| 合并 / 拆分记录 | 固化哪些配置域必须分开,哪些可在正式装配时合并表达。 |
| 03 影响记录 | 固化 needs formal marker / mapper / port 的暂停条件。 |
| R11.11 入口 | 进入生效方式到失效策略矩阵候选:先思考。 |

### 7. R11.9 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做按配置域先思考 | pass | 只形成配置域策略候选,未标 final。 |
| 是否承接 R11.8 候选行池 | pass | 每个域均从 R11.8 失效类型池映射而来。 |
| 是否承接 Step 7 / Step 9 / Step 10 | pass | 使用配置项 family、activation surface 和 rollback/no activation 口径。 |
| 是否避免正式 `04` 越界 | pass | 未创建或修改正式 `04-配置设计.md`。 |
| 是否避免下游越界 | pass | 未写 TC ID、AC、commit、evidence schema 或代码。 |
| 是否保留 03 回写门禁 | pass | marker / mapper / port / surface 缺口仍需回 `03`。 |
| 是否可进入 R11.10 | pass | 等待用户确认后进入按配置域组织的失败策略表候选:再写入。 |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.10 按配置域组织的失败策略表候选:再写入`;只允许把 R11.9 的配置域映射、失败策略候选、合并 / 拆分判断、03 影响预判和 R11.11 入口写成可恢复记录;不得创建正式 `04-配置设计.md`;不得把候选策略标为 final;不得写测试方案、验收标准、实施计划或代码。

## R11.10 按配置域组织的失败策略表候选:再写入

### 1. 当前模块状态记录

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R11.11 |
| 本模块目标 | 将 R11.9 的配置域映射、失败策略候选、合并 / 拆分判断、03 影响预判和 R11.11 入口写成可恢复记录。 |
| 本模块已写入 | 配置域失败策略候选表、配置域合并 / 拆分记录、03 影响记录、R11.11 入口和停审记录。 |
| 本模块未写入 | 未标 final;未写正式 `04-配置设计.md`;未写生效方式矩阵正式表;未写告警字段辅助表;未写测试方案、验收标准、实施计划或代码。 |
| 当前恢复口径 | 用户已确认从 R11.9 进入 R11.10;R11.10 完成后等待用户确认进入 R11.11。 |

### 2. 配置域失败策略候选表记录

> 本表是候选策略记录,用于后续 Step 15 装配前继续审查。不得把 `candidate` / `watch` / `needs-check` 行直接视为正式 `04-配置设计.md` §11 结论。

| 配置域 | 典型失败候选 | activation / 检测点 | 候选策略 | 候选 surface | 告警方向 | 状态 / 影响 |
|---|---|---|---|---|---|---|
| runtime profile / entry readiness | profile invalid;strict validation disabled;reload / hot requested;builder partial assembly。 | startup;entry-local;unsupported activation。 | startup fail-fast;reload/hot unsupported no activation;安全相关 fail-closed。 | builder Failed;no API / worker / jobs facade;entry selector invalid => entry rejected。 | yes/error;security for unsafe activation。 | candidate |
| stores / logical repositories | required store missing;invalid store ref;logical store completeness missing;production-like fake selected。 | startup builder assembly。 | required startup fail-fast;fake production-like fail-closed。 | startup failed;no repository adapter registry exposed。 | yes/error;security for fake production-like。 | candidate |
| external source / resolver binding | required resolver family missing;duplicate family;invalid mode;required adapter unavailable;runtime resolver unavailable。 | startup;runtime adapter call;query / consumer / job call。 | config invalid fail-fast;required unavailable fail-fast;runtime unavailable by role degraded / delayed / rejected / failed。 | command dependency unavailable;query degraded;consumer delayed;job failed where formal surface exists。 | yes/error for startup;aggregate/warn for runtime degraded。 | candidate_needs_formal_marker_check |
| inbound consumers | enabled without namespace;unsupported version;dedup retention invalid;body-free validation issue。 | startup;inbound receipt validation。 | config fail-fast;runtime unsupported event rejected / delayed by formal inbound flow。 | worker not started for invalid config;receipt rejected / delayed by formal surface。 | yes/error for config;warn for runtime unsupported。 | candidate |
| outbox / publisher | enabled topic route missing;publisher ref invalid;batch invalid;publisher unavailable during outbox job。 | startup;job-run-start;runtime publisher call。 | config fail-fast;job input rejected;runtime publish failure failed marker / retryable report。 | publish job rejected / partial / failed report;truth unchanged。 | yes/error for missing route;warn/error for runtime failure。 | candidate |
| jobs / operations runner | unknown job kind;batch/page conflict;timeout/range invalid;stale job input;replay root invalid。 | startup;job-run-start;operations replay start。 | startup fail-fast for defaults;job-run-start rejected for run-local invalid;stale old run unchanged。 | job rejected before side effect;stored report immutable;new run required。 | yes/error for invalid config;no/audit for stale old run。 | candidate |
| handoff / export target | enabled target missing;target ref invalid;handoff unavailable;future delivered-without-receipt gap。 | startup;job-run-start;runtime handoff/export call。 | config fail-fast or job rejected;runtime target unavailable failed / partial marker。 | handoff/export job failed or partial;core truth unchanged。 | yes/error for config;warn/error for runtime unavailable。 | candidate_needs_marker_source_check |
| externalGrc | enabled without adapter/target;target disabled;optional externalGrc disabled。 | startup;job-run-start。 | enabled missing config fail-fast / job rejected;disabled no-op for core truth。 | export job rejected/failed if enabled invalid;commands and core truth unaffected when disabled。 | yes/error if enabled invalid;no/info when disabled。 | candidate |
| redaction / diagnostics | deny list empty;unsafe relax;full sensitive ref output;high-cardinality label enabled;diagnostic sink unavailable。 | startup validation;output validation;runtime diagnostic emit。 | unsafe config fail-closed / startup fail-fast;diagnostic sink unavailable => degraded reporting with safe issue。 | startup failed;output rejected;safe degraded diagnostic only。 | security/error for redaction;aggregate/warn for diagnostic sink。 | candidate |
| forbidden boundary / invariant | truth owner override;query write override;job truth repair override;stored replay rewrite;marker synthesis;body-free bypass;P0/P1 isolation override。 | source merge;validation;activation gate。 | fail-closed / design violation / no activation。 | validation rejected with safe issue;no facade or current input rejected。 | security/error。 | candidate_redline |
| boundary / limits | page/body/time limit invalid;batch > page;range unsafe;entry-local selector stale。 | startup;job-run-start;entry-local。 | startup fail-fast or entry/job rejected by activation surface。 | entry rejected;job rejected;no mutation side effect。 | yes/error for startup;warn/debug for entry selector。 | candidate |
| idempotency / result replay | retention too short;result replay window unsafe;stored replay disable / rewrite requested。 | startup validation;forbidden boundary validation。 | startup fail-fast;replay rewrite config fail-closed。 | startup failed;duplicate replay semantics unchanged。 | yes/error;security for rewrite attempt。 | candidate |
| projection / reference read material | stale threshold invalid;batch invalid;optional read material unavailable;reference resolver unavailable during query。 | startup;job-run-start;runtime query / maintenance call。 | config invalid fail-fast / job rejected;runtime material unavailable query degraded/unavailable no-write。 | query degraded;maintenance job failed/partial;no material repair from query。 | yes/error for invalid config;aggregate/warn for query degraded。 | candidate_needs_formal_marker_check |
| clock / id | clock/id adapter missing;invalid ref shape;fixed clock incompatible with profile。 | startup;test harness;mutation precondition。 | startup fail-fast or command/job rejected before mutation;test fail-fast for fixture clock invalid。 | no UoW begins without clock/id;test harness fails before fake runtime seed。 | yes/error for startup;test-only for fixture。 | candidate |
| test fixtures / operations replay | fixture missing;fixture contamination;invalid timestamp;raw/stale replay artifact root。 | test harness;operations-replay job-run-start。 | test fail-fast;replay job rejected;production-like fixture fail-closed。 | test failure;replay run rejected;no raw body output。 | test-only or security/error for contamination/raw root。 | candidate |
| config center / admin override / future secret provider | P0 source attempted;admin override requested;secret provider product requested/unavailable。 | source merge;validation;future adapter binding。 | watch/not_applicable;attempted P0 use unsupported / no activation;future contract requires design closure。 | validation rejected or design blocker;no runtime dependency。 | no unless attempted;yes/error if attempted as P0 source。 | candidate_watch |

### 3. 配置域合并 / 拆分记录

| 议题 | 固化判断 | 后续处理 |
|---|---|---|
| stores 与 projection/reference | 不合并。 | stores 保持 startup logical adapter completeness;projection/reference 保持 runtime query degraded / maintenance job failure 维度。 |
| externalResolvers 与 reference | 不合并。 | resolver 是 adapter / source binding;reference 是 read material / state freshness 与 query degraded。 |
| outbox 与 handoff | 不合并。 | outbox 是 event publication / publisher;handoff/export 是 downstream target / receipt / report surface。 |
| redaction 与 diagnostics | 可在同一配置域并列。 | 正式装配可合写为 safe output family,但必须区分 fail-closed 与 degraded reporting。 |
| boundary 与 forbidden invariant | 不合并。 | boundary limits 是合法 guard 参数;forbidden invariant 是不可配置红线。 |
| idempotency 与 jobs | 不合并。 | jobs 有 run-local failure;idempotency/result replay 是 stored replay consistency 红线。 |
| watch 项是否进入配置域表 | 保留进入候选表。 | 标 watch/not_applicable,防止后续误写 config center/admin override/secret provider P0 success path。 |

### 4. 03 影响记录

| 影响点 | 当前判定 | 处理口径 |
|---|---|---|
| startup fail-fast / entry rejected / job rejected / test fail-fast | 当前不影响 `03`。 | 承接 Step 7 配置项和 Step 9 activation surface,可留在 04 Step 11。 |
| query degraded / consumer delayed / job failed marker | 可能影响 `03`。 | 只能复制正式 marker / mapper / port 输出;若缺失,暂停回 `03`。 |
| handoff/export failed / partial / receipt marker | 可能影响 `03`。 | 不能在 04 私补 receipt、marker、report schema;命中缺口即回 `03`。 |
| diagnostic degraded reporting | 可能影响 `03`。 | 只允许 safe issue / diagnostic ref;若需要新 diagnostic sink contract,回 `03` 或后续 owning source。 |
| config center / admin override / secret provider / hot reload / online LKG | 越过当前 P0。 | 保持 watch/not_applicable;若要成为成功路径,回架构 / `03`。 |
| forbidden invariant override | 越界。 | 只能作为 fail-closed design violation;不得成为可配置项或恢复路径。 |

### 5. R11.11 入口记录

| 下一模块 | 入口条件 | 允许内容 | 禁止内容 |
|---|---|---|---|
| R11.11 生效方式到失效策略矩阵候选:先思考 | 用户确认进入 R11.11。 | 思考 startup、job-run-start、entry-local、test harness、runtime adapter call、unsupported/rejected critical config 各自的检测点、策略、审计 / 观测和恢复方向。 | 不写正式 `04-配置设计.md`;不把候选矩阵标 final;不写测试方案、验收标准、实施计划或代码。 |

### 6. R11.10 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做按配置域再写入 | pass | 已把 R11.9 思考固化为候选表,未标 final。 |
| 是否覆盖主要配置域 | pass | runtime、stores、resolvers、inbound、outbox、jobs、handoff、externalGrc、redaction、boundary、idempotency、projection/reference、clock/id、test/replay、watch 均已覆盖。 |
| 是否区分 config failure 与 runtime dependency failure | pass | startup required failure 不写 degraded;runtime optional failure 才候选 degraded / delayed / failed marker。 |
| 是否避免正式 `04` 越界 | pass | 未创建或修改正式 `04-配置设计.md`。 |
| 是否避免下游越界 | pass | 未写 TC ID、AC、commit、evidence schema 或代码。 |
| 是否保留 03 回写门禁 | pass | formal marker / mapper / port / receipt / report surface 缺口仍需回 `03`。 |
| 是否可进入 R11.11 | pass | 等待用户确认后进入生效方式到失效策略矩阵候选:先思考。 |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.11 生效方式到失效策略矩阵候选:先思考`;只允许思考 startup、job-run-start、entry-local、test harness、runtime adapter call、unsupported/rejected critical config 的检测点、策略、审计 / 观测和恢复方向;不得创建正式 `04-配置设计.md`;不得把候选矩阵标为 final;不得写测试方案、验收标准、实施计划或代码。

## R11.11 生效方式到失效策略矩阵候选:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R11.12 |
| 本模块目标 | 思考 startup、job-run-start、entry-local、test harness、runtime adapter call、unsupported/rejected critical config 各自的失败检测点、策略、审计 / 观测和恢复方向。 |
| 本模块允许 | 形成生效方式矩阵候选、恢复方向候选、审计 / 观测候选、关键误用红线和 03 影响预判。 |
| 本模块禁止 | 不写正式 `04-配置设计.md`;不把候选矩阵标 final;不写告警字段正式表;不写测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R11.10 已将配置域失败策略候选表写成可恢复记录,并等待用户确认进入 R11.11。 |

### 2. 生效方式矩阵建模思考

| 生效方式 | 候选失败检测点 | 候选策略 | 候选审计 / 观测 | 候选恢复方向 | 思考状态 |
|---|---|---|---|---|---|
| static design boundary / forbidden invariant | source merge、schema validation、forbidden key class、attempted invariant override。 | fail-closed / design violation / no activation。 | security config validation issue、forbidden key class、safe issue ref。 | remove invalid config;formal design change only if capability is intentionally introduced。 | candidate_redline |
| startup | source merge、strict JSON parse、type/range/cross-field/sensitive validation、runtime builder assembly。 | fail-fast / fail-closed;builder Failed;no facade。 | config validation rejected log、safe issue ref、profile ref、redacted config digest。 | fix config or restore previous validated digest and restart。 | candidate |
| job-run-start | job metadata/input validation、target/scope/page/batch/replay root validation、enabled job kind check。 | reject current run before side effect。 | job rejected surface、input digest、validation issue ref、job run ref。 | start new run with valid input;old stored report immutable。 | candidate |
| entry-local | config path selector、profile selector、dry-run selector、request source selector validation。 | reject current entry only。 | entry validation issue、entry ref、selector digest、safe reason。 | caller reruns entry with valid selector;no persisted global config change。 | candidate |
| test harness | fixture set、fake adapter seed、fixed clock/id、deterministic id、fixture profile validation。 | test fail-fast;profile contamination fail-closed。 | test failure、fixture digest、profile ref、redacted fixture issue。 | fix fixture / fake seed / clock and rerun test。 | candidate |
| operations-replay job start | replay artifact root、de-identification marker、stale root、raw replay body check。 | replay job rejected;raw root fail-closed。 | replay run ref、root digest、de-identification issue ref。 | provide valid de-identified root and start new replay run。 | candidate |
| runtime adapter call | resolver / publisher / handoff / export / diagnostic / read material call result。 | degraded / delayed / failed marker by formal role;truth unchanged。 | adapter unavailable metric/log/report、formal marker ref、safe issue ref。 | retry/backoff/new job/manual repair only through formal flow。 | candidate_needs_formal_marker_check |
| unsupported reload / hot / online LKG | activation validator or source merge detects reload/hot/live switch config。 | unsupported / rejected / no activation。 | unsupported activation issue ref、activation kind、profile ref。 | remove unsupported config;use restart/new run/rerun,not live mutation。 | candidate_redline |
| repeated rejected attempts | repeated invalid source、same actor/source repeatedly failing validation。 | keep rejection;possible aggregate alert;no auto-relax。 | actor/source safe ref、issue class、count bucket,low-cardinality。 | fix source;do not fallback or disable validation。 | candidate |
| rollback failed | previous validated digest missing/invalid、job previous input invalid、entry previous selector invalid、fixture previous ref invalid。 | rollback rejected / no activation / new run rejected / test fail-fast。 | rollback ref、validation issue ref、attempt outcome、safe diagnostic ref。 | choose another validated target;do not use online LKG or failed value。 | candidate |

### 3. 策略误用红线思考

| 误用 | 为什么错误 | 正确候选口径 |
|---|---|---|
| startup invalid config 写成 degraded | 会暴露半装配 runtime,破坏 builder Ready 边界。 | startup invalid => fail-fast / fail-closed,no facade。 |
| high-priority invalid env fallback file/default | 违反 Step 5 来源优先级和 no silent fallback。 | high-priority invalid => fail-fast / current input rejected。 |
| job-run-start invalid 改写旧 report | 破坏 stored report immutable 和 duplicate replay。 | invalid job input => current run rejected;old report unchanged。 |
| entry-local selector 变成全局配置 | 让 entry-local 越权覆盖 startup invariant。 | current entry rejected;caller rerun with valid selector。 |
| runtime adapter unavailable 回滚 accepted truth | 破坏 truth owner 和 transaction boundary。 | record formal degraded/delayed/failed marker;truth unchanged。 |
| diagnostic sink unavailable 输出 raw fallback | 违反 safe diagnostic 和 body-free。 | degraded reporting with safe issue only。 |
| rollback failed 触发 online last-known-good | 当前 P0 无 live switch contract。 | rollback rejected/no activation;restart/new run/rerun only。 |

### 4. 审计 / 观测候选思考

| 生效方式 | safe 字段候选 | 禁止字段候选 | 告警方向 |
|---|---|---|---|
| startup | config source ref、profile ref、section、validation issue ref、redacted config digest、builder state。 | raw config、secret、full sensitive ref、adapter credential、source body。 | yes/error;security for sensitive / invariant。 |
| job-run-start | job run ref、input digest、target digest、validation issue ref、job kind。 | raw target、raw replay body、report body、credential。 | yes/warn or error by job role。 |
| entry-local | entry ref、selector digest、issue ref、safe reason。 | route raw param、raw selector value if sensitive、request body。 | warn/debug unless security。 |
| test harness | test run ref、fixture digest、profile ref、fixed clock issue class。 | raw fixture body、secret seed、production credential。 | test-only;security if contamination。 |
| runtime adapter call | adapter slot、formal marker ref、safe issue ref、operation kind、low-cardinality outcome。 | raw provider body、stack trace、SQL error body、endpoint credential。 | aggregate/warn/error by role。 |
| unsupported / critical rejected | activation kind、forbidden class、issue ref、profile ref。 | attempted payload、hot config body、raw secret。 | security/error。 |

### 5. 03 影响预判

| 候选结论 | 是否影响 03 | 处理 |
|---|---|---|
| startup / job-run-start / entry-local / test harness 的 invalid => fail-fast / rejected / test fail-fast | 否 | 承接 Step 9 activation matrix,可留在 04 Step 11。 |
| runtime adapter call 使用 degraded / delayed / failed marker | 可能 | 只复制 `03` 已有 formal marker / mapper / surface;若缺失,暂停回 `03`。 |
| rollback failed 需要新的 recovery state 或 object | 可能 | R11.11 只写候选恢复方向;若要 schema / port / state,回 `03` 或后续 owning source。 |
| repeated rejected attempts 需要节流 / alert 机制 | 可能但不在本模块闭口 | 只写 aggregate alert direction;具体机制后移运维 / observability owner。 |
| unsupported reload / hot / online LKG 要改成成功路径 | 是且越界 | 当前保持 rejected/no activation;若要支持,回架构 / `03`。 |

### 6. R11.12 写入计划

| R11.12 拟写内容 | 写入边界 |
|---|---|
| 生效方式矩阵候选表 | 把 R11.11 的检测点、策略、审计 / 观测和恢复方向写成可恢复记录。 |
| 策略误用红线记录 | 固化 startup invalid 不 degraded、job rejected 不改旧 report、runtime failure 不回滚 truth 等红线。 |
| 审计 / 观测候选记录 | 固化 safe / forbidden 字段方向,但不写具体告警平台或 schema。 |
| 03 影响记录 | 固化 marker / recovery state / throttling 等回写条件。 |
| R11.13 入口 | 进入告警规则与安全字段候选:先思考。 |

### 7. R11.11 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做生效方式矩阵先思考 | pass | 未写 final 矩阵。 |
| 是否承接 Step 9 生效方式 | pass | startup、job-run-start、entry-local、test harness、reload/hot、build-time 边界均已参考。 |
| 是否承接 Step 10 rollback 口径 | pass | restart/new run/rerun/no activation/old report immutable 均已纳入。 |
| 是否区分 invalid config 与 runtime adapter unavailable | pass | invalid config fail-fast/rejected;runtime adapter call 才候选 degraded/delayed/failed。 |
| 是否避免正式 `04` 越界 | pass | 未创建或修改正式 `04-配置设计.md`。 |
| 是否保留 03 回写门禁 | pass | marker / recovery state / object / throttling 机制缺口仍需回 owning design source。 |
| 是否可进入 R11.12 | pass | 等待用户确认后进入生效方式到失效策略矩阵候选:再写入。 |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.12 生效方式到失效策略矩阵候选:再写入`;只允许把 R11.11 的生效方式矩阵候选、策略误用红线、审计 / 观测候选、03 影响预判和 R11.13 入口写成可恢复记录;不得创建正式 `04-配置设计.md`;不得把候选矩阵标为 final;不得写测试方案、验收标准、实施计划或代码。

## R11.12 生效方式到失效策略矩阵候选:再写入

### 1. 当前模块状态记录

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R11.13 |
| 本模块目标 | 将 R11.11 的生效方式矩阵候选、策略误用红线、审计 / 观测候选、03 影响预判和 R11.13 入口写成可恢复记录。 |
| 本模块已写入 | 生效方式矩阵候选表、策略误用红线记录、审计 / 观测候选记录、03 影响记录、R11.13 入口和停审记录。 |
| 本模块未写入 | 未标 final;未写正式 `04-配置设计.md`;未写告警规则正式表;未写测试方案、验收标准、实施计划或代码。 |
| 当前恢复口径 | 用户已确认从 R11.11 进入 R11.12;R11.12 完成后等待用户确认进入 R11.13。 |

### 2. 生效方式矩阵候选表记录

| 生效方式 | 失败检测点候选 | 策略候选 | 审计 / 观测候选 | 恢复方向候选 | 状态 |
|---|---|---|---|---|---|
| static design boundary / forbidden invariant | source merge、schema validation、forbidden key class、attempted invariant override。 | fail-closed / design violation / no activation。 | security config validation issue、forbidden key class、safe issue ref。 | remove invalid config;formal design change only if capability is intentionally introduced。 | candidate_redline |
| startup | source merge、strict JSON parse、type/range/cross-field/sensitive validation、runtime builder assembly。 | fail-fast / fail-closed;builder Failed;no facade。 | config validation rejected log、safe issue ref、profile ref、redacted config digest。 | fix config or restore previous validated digest and restart。 | candidate |
| job-run-start | job metadata/input validation、target/scope/page/batch/replay root validation、enabled job kind check。 | reject current run before side effect。 | job rejected surface、input digest、validation issue ref、job run ref。 | start new run with valid input;old stored report immutable。 | candidate |
| entry-local | config path selector、profile selector、dry-run selector、request source selector validation。 | reject current entry only。 | entry validation issue、entry ref、selector digest、safe reason。 | caller reruns entry with valid selector;no persisted global config change。 | candidate |
| test harness | fixture set、fake adapter seed、fixed clock/id、deterministic id、fixture profile validation。 | test fail-fast;profile contamination fail-closed。 | test failure、fixture digest、profile ref、redacted fixture issue。 | fix fixture / fake seed / clock and rerun test。 | candidate |
| operations-replay job start | replay artifact root、de-identification marker、stale root、raw replay body check。 | replay job rejected;raw root fail-closed。 | replay run ref、root digest、de-identification issue ref。 | provide valid de-identified root and start new replay run。 | candidate |
| runtime adapter call | resolver / publisher / handoff / export / diagnostic / read material call result。 | degraded / delayed / failed marker by formal role;truth unchanged。 | adapter unavailable metric/log/report、formal marker ref、safe issue ref。 | retry/backoff/new job/manual repair only through formal flow。 | candidate_needs_formal_marker_check |
| unsupported reload / hot / online LKG | activation validator or source merge detects reload/hot/live switch config。 | unsupported / rejected / no activation。 | unsupported activation issue ref、activation kind、profile ref。 | remove unsupported config;use restart/new run/rerun,not live mutation。 | candidate_redline |
| repeated rejected attempts | repeated invalid source、same actor/source repeatedly failing validation。 | keep rejection;possible aggregate alert;no auto-relax。 | actor/source safe ref、issue class、count bucket,low-cardinality。 | fix source;do not fallback or disable validation。 | candidate |
| rollback failed | previous validated digest missing/invalid、job previous input invalid、entry previous selector invalid、fixture previous ref invalid。 | rollback rejected / no activation / new run rejected / test fail-fast。 | rollback ref、validation issue ref、attempt outcome、safe diagnostic ref。 | choose another validated target;do not use online LKG or failed value。 | candidate |

### 3. 策略误用红线记录

| 误用 | 固化判断 | 正确候选口径 |
|---|---|---|
| startup invalid config 写成 degraded | 禁止。会暴露半装配 runtime,破坏 builder Ready 边界。 | startup invalid => fail-fast / fail-closed,no facade。 |
| high-priority invalid env fallback file/default | 禁止。违反 Step 5 来源优先级和 no silent fallback。 | high-priority invalid => fail-fast / current input rejected。 |
| job-run-start invalid 改写旧 report | 禁止。破坏 stored report immutable 和 duplicate replay。 | invalid job input => current run rejected;old report unchanged。 |
| entry-local selector 变成全局配置 | 禁止。让 entry-local 越权覆盖 startup invariant。 | current entry rejected;caller rerun with valid selector。 |
| runtime adapter unavailable 回滚 accepted truth | 禁止。破坏 truth owner 和 transaction boundary。 | record formal degraded/delayed/failed marker;truth unchanged。 |
| diagnostic sink unavailable 输出 raw fallback | 禁止。违反 safe diagnostic 和 body-free。 | degraded reporting with safe issue only。 |
| rollback failed 触发 online last-known-good | 禁止。当前 P0 无 live switch contract。 | rollback rejected/no activation;restart/new run/rerun only。 |

### 4. 审计 / 观测候选记录

| 生效方式 | safe 字段候选 | 禁止字段候选 | 告警方向 |
|---|---|---|---|
| startup | config source ref、profile ref、section、validation issue ref、redacted config digest、builder state。 | raw config、secret、full sensitive ref、adapter credential、source body。 | yes/error;security for sensitive / invariant。 |
| job-run-start | job run ref、input digest、target digest、validation issue ref、job kind。 | raw target、raw replay body、report body、credential。 | yes/warn or error by job role。 |
| entry-local | entry ref、selector digest、issue ref、safe reason。 | route raw param、raw selector value if sensitive、request body。 | warn/debug unless security。 |
| test harness | test run ref、fixture digest、profile ref、fixed clock issue class。 | raw fixture body、secret seed、production credential。 | test-only;security if contamination。 |
| runtime adapter call | adapter slot、formal marker ref、safe issue ref、operation kind、low-cardinality outcome。 | raw provider body、stack trace、SQL error body、endpoint credential。 | aggregate/warn/error by role。 |
| unsupported / critical rejected | activation kind、forbidden class、issue ref、profile ref。 | attempted payload、hot config body、raw secret。 | security/error。 |

### 5. 03 影响记录

| 候选结论 | 是否影响 03 | 处理 |
|---|---|---|
| startup / job-run-start / entry-local / test harness 的 invalid => fail-fast / rejected / test fail-fast | 否 | 承接 Step 9 activation matrix,可留在 04 Step 11。 |
| runtime adapter call 使用 degraded / delayed / failed marker | 可能 | 只复制 `03` 已有 formal marker / mapper / surface;若缺失,暂停回 `03`。 |
| rollback failed 需要新的 recovery state 或 object | 可能 | R11.12 只记录恢复方向;若要 schema / port / state,回 `03` 或后续 owning source。 |
| repeated rejected attempts 需要节流 / alert 机制 | 可能但不在本模块闭口 | 只写 aggregate alert direction;具体机制后移运维 / observability owner。 |
| unsupported reload / hot / online LKG 要改成成功路径 | 是且越界 | 当前保持 rejected/no activation;若要支持,回架构 / `03`。 |

### 6. R11.13 入口记录

| 下一模块 | 入口条件 | 允许内容 | 禁止内容 |
|---|---|---|---|
| R11.13 告警规则与安全字段候选:先思考 | 用户确认进入 R11.13。 | 思考不同失效场景是否告警、推荐级别、safe 字段、禁止字段、低基数约束和 03 影响预判。 | 不写正式 `04-配置设计.md`;不写具体告警平台、SLO、pager、dashboard、runbook;不写测试方案、验收标准、实施计划或代码。 |

### 7. R11.12 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做生效方式矩阵再写入 | pass | 已把 R11.11 思考固化为候选记录,未标 final。 |
| 是否覆盖主要生效方式 | pass | static boundary、startup、job-run-start、entry-local、test harness、operations-replay、runtime adapter、unsupported、repeated rejected、rollback failed 均已覆盖。 |
| 是否避免 invalid config degraded | pass | startup / job / entry / test invalid 均为 fail-fast / rejected / test fail-fast,未写 degraded。 |
| 是否保留 safe-only 审计 | pass | 已列 safe 字段与禁止字段,未引入 raw config、secret、body 或 full ref。 |
| 是否避免正式 `04` 越界 | pass | 未创建或修改正式 `04-配置设计.md`。 |
| 是否保留 03 回写门禁 | pass | marker / recovery state / throttling 机制缺口仍需回 owning design source。 |
| 是否可进入 R11.13 | pass | 等待用户确认后进入告警规则与安全字段候选:先思考。 |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.13 告警规则与安全字段候选:先思考`;只允许思考不同失效场景是否告警、推荐级别、safe 字段、禁止字段、低基数约束和 03 影响预判;不得创建正式 `04-配置设计.md`;不得写具体告警平台、SLO、pager、dashboard、runbook;不得写测试方案、验收标准、实施计划或代码。

## R11.13 告警规则与安全字段候选:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R11.14 |
| 本模块目标 | 思考不同配置失效场景是否告警、推荐级别、safe 字段、禁止字段、低基数约束和 03 影响预判。 |
| 本模块允许 | 形成告警规则候选表、安全字段候选、禁止字段候选、低基数约束、聚合/测试-only 判断和 R11.14 写入计划。 |
| 本模块禁止 | 不写正式 `04-配置设计.md`;不写具体告警平台、SLO、pager、dashboard、runbook;不写 metric/log/span schema;不写测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R11.12 已将生效方式矩阵候选写成可恢复记录,并等待用户确认进入 R11.13。 |

### 2. 告警规则建模思考

| 建模维度 | 思考结论 | R11.14 写入要求 |
|---|---|---|
| 是否告警 | 按场景分为 yes、security/error、aggregate/warn、test-only、no/info、optional/debug。 | 不把所有失败都写成 pager,也不把安全失败降为 info。 |
| 推荐级别 | 只写候选级别 error / security-error / warn / aggregate-warn / test-failure / info。 | 不绑定具体平台 severity、SLO 或值班策略。 |
| safe 字段 | 只能使用 config source ref、profile ref、section、validation issue ref、redacted digest、marker ref、report ref、operation family、low-cardinality category。 | 不写 raw value、full ref、payload body、credential、topic、endpoint。 |
| 低基数 | metric label 只能是 family / kind / state / result / category。 | ref、trace id、actor id、free text、diagnostic ref 不能做 metric label。 |
| 聚合 | query degraded、runtime adapter unavailable、repeated rejected attempts 倾向聚合。 | R11.14 标 aggregate candidate。 |
| 测试-only | test fixture invalid 只作为测试失败,除非出现 production-like contamination。 | R11.14 区分 test-only 与 security alert。 |
| 03 影响 | 若需要新增 diagnostic marker、alert object、metric schema 或 sink port,回 owning source。 | R11.14 只写候选字段,不补 schema。 |

### 3. 告警规则候选表思考

| 场景候选 | 是否告警候选 | 推荐级别候选 | safe 字段候选 | 禁止字段候选 | 思考状态 |
|---|---|---|---|---|---|
| startup config validation rejected | yes | error | config source ref、profile ref、section、validation issue ref、redacted config digest、builder state。 | raw config、secret、full sensitive ref、file body。 | candidate |
| runtime builder failed | yes | error | builder state、validated family、adapter slot category、validation issue ref。 | adapter credential、endpoint、raw config。 | candidate |
| high-priority source invalid | yes | error | source kind、section、issue ref、profile ref。 | env value、raw file value、entry/job raw input。 | candidate |
| raw secret / raw body detected | yes | security-error | forbidden class、section、issue ref、source kind、profile ref。 | detected secret、body excerpt、hash of secret as proof。 | candidate_security |
| redaction unsafe config | yes | security-error | redaction rule class、issue ref、profile ref、safe field class。 | matched raw value、sample payload、full sensitive ref。 | candidate_security |
| forbidden invariant override attempt | yes | security-error | forbidden key class、issue ref、activation kind、profile ref。 | attempted payload、raw config body。 | candidate_security |
| job-run-start input invalid | yes for scheduled/ops;optional for local manual | warn/error by job role | job kind、run ref、input digest、validation issue ref。 | job body、raw target、raw replay root。 | candidate |
| entry-local selector invalid | optional | warn/debug | entry kind、selector class、issue ref。 | local path if sensitive、route raw param、request body。 | candidate_optional |
| test fixture invalid | no ops alert;test failure | test-failure | fixture digest、profile ref、test run ref、issue class。 | fixture body、secret seed。 | candidate_test_only |
| production-like fixture contamination | yes | security-error | profile ref、fixture class、issue ref。 | fixture body、credential、raw seed。 | candidate_security |
| query degraded due projection/reference/read material | aggregate | aggregate-warn | query family、material family、surface category、formal marker ref if safe for log。 | subject ref、cursor、body、full diagnostic ref as metric label。 | candidate_needs_marker_check |
| resolver unavailable | yes/aggregate | warn/error by dependency role | resolver family、adapter kind、retryable category、safe diagnostic ref。 | upstream response body、endpoint credential、raw exception。 | candidate_needs_marker_check |
| publisher failed / failed marker | yes | warn/error | outbox ref category、event kind、failure reason ref、report ref。 | event payload body、transport credential、topic secret。 | candidate |
| handoff/export failed | yes | warn/error | target digest、marker ref、job report ref、operation kind。 | package body、export body、receipt body、target credential。 | candidate_needs_marker_check |
| diagnostic sink unavailable | aggregate | aggregate-warn | diagnostic sink category、operation family、safe issue ref。 | raw log fallback、stack trace、provider body。 | candidate |
| config digest drift | yes | error | expected digest、actual digest、profile ref、artifact/source ref。 | full config、raw artifact body。 | candidate |
| rollback target invalid / rollback failed | yes | error | rollback ref、validation issue ref、attempt outcome、profile ref。 | failed config body、rollback script body、secret。 | candidate |
| repeated rejected attempts | aggregate | aggregate-warn/security if forbidden class | issue class、source kind、actor/source category、count bucket。 | actor id、free text、raw source value。 | candidate |
| config center/admin override/hot reload attempted | yes if attempted | error/security by attempted class | activation kind、unsupported source kind、issue ref、profile ref。 | attempted payload、operator override body。 | candidate_watch |
| optional externalGrc disabled | no | info | feature family、disabled state、profile ref。 | target body、credential。 | candidate_no_alert |

### 4. Safe / forbidden 字段归类思考

| 输出位置 | safe 字段候选 | 禁止字段候选 |
|---|---|---|
| structured log | operation family、config section、profile ref、safe issue ref、marker category、redacted digest。 | raw config、secret、credential、token、connection string、raw endpoint/topic。 |
| metric label | family、kind、state、result、category。 | request id、trace id、truth ref、actor id、diagnostic ref、free text、payload digest。 |
| trace/span | trace context ref、operation family、result category、safe marker ref。 | payload body、transport response body、provider body、secret。 |
| audit / operations fact | typed boundary refs、safe reason refs、redaction marker、redacted digest。 | raw config、archive body、external document body、unsafe log body。 |
| diagnostic / report / handoff | safe message/ref、marker category、receipt/outcome ref、report ref。 | raw exception text、secret value、delivery receipt body、package/export body。 |

### 5. 03 影响预判

| 候选结论 | 是否影响 03 | 处理 |
|---|---|---|
| 只定义告警方向、推荐级别候选、safe / forbidden 字段方向 | 否 | 可留在 04 Step 11。 |
| 需要新增具体 metric/log/span 字段 schema | 可能影响 `03` / observability owner | 当前不补;后移或回 `03`。 |
| 需要新增 diagnostic marker、safe issue object、alert object 或 sink port | 是 | 暂停并回 `03` owning Step。 |
| 将 marker ref / diagnostic ref 用作 metric label | 越界 | 拒绝;metric 只能低基数 category。 |
| 需要具体 SLO、pager、dashboard、runbook | 不属本模块 | 留给运维 / 下游文档,不在 04 Step 11 闭口。 |

### 6. R11.14 写入计划

| R11.14 拟写内容 | 写入边界 |
|---|---|
| 告警规则候选表 | 把 R11.13 的场景、是否告警、推荐级别、safe 字段、禁止字段和状态写成可恢复记录。 |
| Safe / forbidden 字段归类 | 固化 log / metric / trace / audit / diagnostic 等输出位置的字段边界。 |
| 低基数约束记录 | 固化 metric label 只能使用 family / kind / state / result / category。 |
| 03 影响记录 | 固化需要回 `03` 的 diagnostic marker / schema / sink port 条件。 |
| R11.15 入口 | 进入测试切口候选:先思考。 |

### 7. R11.13 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做告警规则先思考 | pass | 未写 final 告警表。 |
| 是否避免平台化 | pass | 未写具体告警平台、SLO、pager、dashboard 或 runbook。 |
| 是否保留 safe-only | pass | 所有场景均区分 safe 字段和禁止字段。 |
| 是否保留低基数约束 | pass | metric label 只允许 family/kind/state/result/category。 |
| 是否避免正式 `04` 越界 | pass | 未创建或修改正式 `04-配置设计.md`。 |
| 是否保留 03 回写门禁 | pass | marker / schema / sink port 缺口仍需回 owning design source。 |
| 是否可进入 R11.14 | pass | 等待用户确认后进入告警规则与安全字段候选:再写入。 |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.14 告警规则与安全字段候选:再写入`;只允许把 R11.13 的告警规则候选、安全字段边界、低基数约束、03 影响预判和 R11.15 入口写成可恢复记录;不得创建正式 `04-配置设计.md`;不得写具体告警平台、SLO、pager、dashboard、runbook;不得写测试方案、验收标准、实施计划或代码。

## R11.14 告警规则与安全字段候选:再写入

### 1. 当前模块状态记录

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R11.15 |
| 本模块目标 | 将 R11.13 的告警规则候选、安全字段边界、低基数约束、03 影响预判和 R11.15 入口写成可恢复记录。 |
| 本模块已写入 | 告警规则候选表、Safe / forbidden 字段归类、低基数约束记录、03 影响记录、R11.15 入口和停审记录。 |
| 本模块未写入 | 未标 final;未写正式 `04-配置设计.md`;未写具体告警平台、SLO、pager、dashboard、runbook;未写测试方案、验收标准、实施计划或代码。 |
| 当前恢复口径 | 用户已确认从 R11.13 进入 R11.14;R11.14 完成后等待用户确认进入 R11.15。 |

### 2. 告警规则候选表记录

| 场景候选 | 是否告警候选 | 推荐级别候选 | safe 字段候选 | 禁止字段候选 | 状态 |
|---|---|---|---|---|---|
| startup config validation rejected | yes | error | config source ref、profile ref、section、validation issue ref、redacted config digest、builder state。 | raw config、secret、full sensitive ref、file body。 | candidate |
| runtime builder failed | yes | error | builder state、validated family、adapter slot category、validation issue ref。 | adapter credential、endpoint、raw config。 | candidate |
| high-priority source invalid | yes | error | source kind、section、issue ref、profile ref。 | env value、raw file value、entry/job raw input。 | candidate |
| raw secret / raw body detected | yes | security-error | forbidden class、section、issue ref、source kind、profile ref。 | detected secret、body excerpt、hash of secret as proof。 | candidate_security |
| redaction unsafe config | yes | security-error | redaction rule class、issue ref、profile ref、safe field class。 | matched raw value、sample payload、full sensitive ref。 | candidate_security |
| forbidden invariant override attempt | yes | security-error | forbidden key class、issue ref、activation kind、profile ref。 | attempted payload、raw config body。 | candidate_security |
| job-run-start input invalid | yes for scheduled/ops;optional for local manual | warn/error by job role | job kind、run ref、input digest、validation issue ref。 | job body、raw target、raw replay root。 | candidate |
| entry-local selector invalid | optional | warn/debug | entry kind、selector class、issue ref。 | local path if sensitive、route raw param、request body。 | candidate_optional |
| test fixture invalid | no ops alert;test failure | test-failure | fixture digest、profile ref、test run ref、issue class。 | fixture body、secret seed。 | candidate_test_only |
| production-like fixture contamination | yes | security-error | profile ref、fixture class、issue ref。 | fixture body、credential、raw seed。 | candidate_security |
| query degraded due projection/reference/read material | aggregate | aggregate-warn | query family、material family、surface category、formal marker ref if safe for log。 | subject ref、cursor、body、full diagnostic ref as metric label。 | candidate_needs_marker_check |
| resolver unavailable | yes/aggregate | warn/error by dependency role | resolver family、adapter kind、retryable category、safe diagnostic ref。 | upstream response body、endpoint credential、raw exception。 | candidate_needs_marker_check |
| publisher failed / failed marker | yes | warn/error | outbox ref category、event kind、failure reason ref、report ref。 | event payload body、transport credential、topic secret。 | candidate |
| handoff/export failed | yes | warn/error | target digest、marker ref、job report ref、operation kind。 | package body、export body、receipt body、target credential。 | candidate_needs_marker_check |
| diagnostic sink unavailable | aggregate | aggregate-warn | diagnostic sink category、operation family、safe issue ref。 | raw log fallback、stack trace、provider body。 | candidate |
| config digest drift | yes | error | expected digest、actual digest、profile ref、artifact/source ref。 | full config、raw artifact body。 | candidate |
| rollback target invalid / rollback failed | yes | error | rollback ref、validation issue ref、attempt outcome、profile ref。 | failed config body、rollback script body、secret。 | candidate |
| repeated rejected attempts | aggregate | aggregate-warn/security if forbidden class | issue class、source kind、actor/source category、count bucket。 | actor id、free text、raw source value。 | candidate |
| config center/admin override/hot reload attempted | yes if attempted | error/security by attempted class | activation kind、unsupported source kind、issue ref、profile ref。 | attempted payload、operator override body。 | candidate_watch |
| optional externalGrc disabled | no | info | feature family、disabled state、profile ref。 | target body、credential。 | candidate_no_alert |

### 3. Safe / forbidden 字段归类记录

| 输出位置 | safe 字段候选 | 禁止字段候选 |
|---|---|---|
| structured log | operation family、config section、profile ref、safe issue ref、marker category、redacted digest。 | raw config、secret、credential、token、connection string、raw endpoint/topic。 |
| metric label | family、kind、state、result、category。 | request id、trace id、truth ref、actor id、diagnostic ref、free text、payload digest。 |
| trace/span | trace context ref、operation family、result category、safe marker ref。 | payload body、transport response body、provider body、secret。 |
| audit / operations fact | typed boundary refs、safe reason refs、redaction marker、redacted digest。 | raw config、archive body、external document body、unsafe log body。 |
| diagnostic / report / handoff | safe message/ref、marker category、receipt/outcome ref、report ref。 | raw exception text、secret value、delivery receipt body、package/export body。 |

### 4. 低基数约束记录

| 位置 | 固化约束 | 说明 |
|---|---|---|
| metric label | 只能使用 family / kind / state / result / category。 | 任何 ref、id、free text、diagnostic ref、marker ref 都不得成为 metric label。 |
| structured log | 可记录 formal safe ref / issue ref / digest,但必须经过 redaction。 | log 可以比 metric 承载更具体的 safe ref,但不得含 raw body/secret。 |
| trace/span | 只串联 trace context 和 safe correlation refs。 | 不承载 payload body、provider response body 或 secret。 |
| audit / operations fact | 只记录 typed refs、safe reason、redacted digest 和 formal report/outcome refs。 | 不作为 truth repair 或 recovery source。 |

### 5. 03 影响记录

| 候选结论 | 是否影响 03 | 处理 |
|---|---|---|
| 只定义告警方向、推荐级别候选、safe / forbidden 字段方向 | 否 | 可留在 04 Step 11。 |
| 需要新增具体 metric/log/span 字段 schema | 可能影响 `03` / observability owner | 当前不补;后移或回 `03`。 |
| 需要新增 diagnostic marker、safe issue object、alert object 或 sink port | 是 | 暂停并回 `03` owning Step。 |
| 将 marker ref / diagnostic ref 用作 metric label | 越界 | 拒绝;metric 只能低基数 category。 |
| 需要具体 SLO、pager、dashboard、runbook | 不属本模块 | 留给运维 / 下游文档,不在 04 Step 11 闭口。 |

### 6. R11.15 入口记录

| 下一模块 | 入口条件 | 允许内容 | 禁止内容 |
|---|---|---|---|
| R11.15 测试切口候选:先思考 | 用户确认进入 R11.15。 | 思考配置失效模式的测试切口候选,覆盖 strict JSON、缺必填、invalid source no fallback、raw secret/redaction、forbidden boundary、runtime degraded no-write、publisher/handoff no truth rollback、rollback target validation 等方向。 | 不写正式 `04-配置设计.md`;不写 TC ID、fixture schema、evidence schema、验收门禁、实施计划或代码。 |

### 7. R11.14 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做告警规则再写入 | pass | 已把 R11.13 思考固化为候选记录,未标 final。 |
| 是否避免平台化 | pass | 未写具体告警平台、SLO、pager、dashboard 或 runbook。 |
| 是否保留 safe-only | pass | 告警表和字段归类均列出禁止字段。 |
| 是否保留低基数约束 | pass | metric label 只允许 family/kind/state/result/category。 |
| 是否避免正式 `04` 越界 | pass | 未创建或修改正式 `04-配置设计.md`。 |
| 是否保留 03 回写门禁 | pass | marker / schema / sink port 缺口仍需回 owning design source。 |
| 是否可进入 R11.15 | pass | 等待用户确认后进入测试切口候选:先思考。 |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.15 测试切口候选:先思考`;只允许思考配置失效模式的测试切口候选;不得创建正式 `04-配置设计.md`;不得写 TC ID、fixture schema、evidence schema、验收门禁、实施计划或代码。

## R11.15 测试切口候选:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R11.16 |
| 本模块目标 | 思考 Step 11 失效模式、失败策略、告警候选如何转成后续 `05-测试方案.md` 可承接的测试切口候选。 |
| 本模块允许 | 思考测试切口分组、覆盖失效模式、触发面、预期行为、安全输出边界、下游承接方向和 R11.16 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写 TC ID;不写 fixture schema、evidence schema、assertion schema、验收门禁、实施计划或代码。 |
| 恢复依据 | R11.14 已完成告警规则与安全字段候选再写入,并等待用户确认进入 R11.15。 |

### 2. 测试切口建模原则思考

| 原则 | 思考结论 | R11.16 写入要求 |
|---|---|---|
| 切口不是用例编号 | Step 11 只给后续测试方案提供场景入口,不生成 TC-ID。 | R11.16 使用 `测试切口候选` 而不是 `测试用例`。 |
| 按失效模式覆盖 | 测试切口应覆盖缺失、错误、不可达、漂移、敏感泄露、越界配置和运行期 degraded。 | 每行回指一个或多个失效模式候选。 |
| 按生效面覆盖 | startup、job-run-start、entry-local、test harness、runtime adapter call 的预期行为不同。 | 每行标出触发面,避免把所有失败写成 startup fail-fast。 |
| 负向优先 | 配置设计的关键风险来自非法配置被接受、silent fallback、敏感泄露和越界恢复。 | R11.16 优先列 redline negative cuts。 |
| 安全输出优先 | 预期行为必须验证 safe issue/ref/digest,不得要求输出 raw body、secret 或 full sensitive ref。 | 每行写安全输出边界,不写具体 artifact schema。 |
| 不补实现口径 | 若测试切口需要新的 marker、DTO、port、mapper、schema 或 evidence 字段,不能在 Step 11 发明。 | R11.16 标记回 owning design source 或 Step 12 / 05 承接。 |

### 3. 测试切口候选池思考

| 测试切口候选 | 覆盖失效模式 | 触发面 | 预期行为方向 | 安全输出边界 | 状态 |
|---|---|---|---|---|---|
| strict JSON rejects comments/trailing comma | 配置格式错误。 | startup / test harness | 拒绝当前配置装配;无 runtime facade。 | 只返回 validation issue ref,不输出文件正文。 | candidate |
| missing required startup field | 必填配置缺失。 | startup | builder fail-fast;不进入 Ready。 | 输出 section、profile ref、issue ref。 | candidate |
| type/range/cross-field invalid | 类型、范围、交叉字段错误。 | startup / job-run-start / entry-local | startup fail-fast 或 scoped rejected。 | 输出 safe issue class,不输出 raw value。 | candidate |
| high-priority invalid source no fallback | 高优先级非法来源。 | source merge / startup / job-run-start | 不回退低优先级默认值;拒绝当前 activation/run。 | 输出 source kind、section、issue ref。 | candidate_redline |
| forbidden invariant override rejected | 禁止配置化边界被覆盖。 | startup / job-run-start / entry-local | fail-closed 或 rejected;不修改 truth owner / state / marker source。 | 输出 forbidden key class、activation kind、issue ref。 | candidate_redline |
| hot reload / admin override attempt rejected | unsupported live mutation。 | runtime / admin-like attempt | 返回 unsupported / rejected;不生效、不写状态。 | 输出 activation kind、unsupported source kind。 | candidate_watch_redline |
| raw secret or raw body rejected | 敏感配置泄露风险。 | startup / fixture / job input | fail-closed;不写 raw material。 | 输出 forbidden class、profile ref、issue ref。 | candidate_security |
| redaction unsafe profile rejected | redaction 配置不安全。 | startup / test harness | fail-closed;不允许 unsafe report/log/evidence。 | 输出 redaction rule class、safe field class。 | candidate_security |
| production-like fixture contamination | 测试 fixture 污染生产相似 profile。 | test harness / profile validation | fail-closed;fixture 不进入 production-like / integration-like required path。 | 输出 fixture class、profile ref、issue ref。 | candidate_security |
| optional externalGrc disabled core unaffected | 可选外部协作禁用。 | startup / job-run-start | core runtime Ready;相关 export / handoff path disabled 或 rejected。 | 输出 feature family、disabled state。 | candidate_optional |
| enabled externalGrc missing target | 已启用外部协作但目标缺失。 | startup / job-run-start | startup fail-fast 或 job rejected,按作用域区分。 | 输出 target family、issue ref,不输出 endpoint/credential。 | candidate |
| repository / material adapter binding invalid | repository/material adapter 装配错误。 | startup | required binding fail-fast;不 fallback fake。 | 输出 adapter slot category、issue ref。 | candidate_redline |
| runtime resolver unavailable | 运行期 resolver 不可用。 | runtime adapter call / query / consumer | 返回 unavailable / delayed / degraded,不把 unavailable 当配置成功修复。 | 只复制 formal marker / safe diagnostic ref。 | candidate_needs_marker_check |
| query degraded no-write | read material / projection / reference degraded。 | query | 返回 degraded/stale/unavailable surface;不得写 repository。 | 只复制 formal marker,不输出 subject/body/cursor。 | candidate_redline |
| inbound consumer resolver unavailable delayed | inbound 依赖不可用。 | consumer intake | delayed / unavailable receipt;不生成伪 snapshot 或 stale truth。 | 输出 receipt/outcome ref、safe reason。 | candidate |
| publisher failure no truth rollback | publisher / target failure。 | outbound job | 记录 failed marker / publication outcome;不回滚已提交 truth。 | 输出 outbox ref category、event kind、failure reason ref。 | candidate_redline |
| handoff/export failure no truth rollback | handoff target / package failure。 | handoff job | job report failed;不回滚 truth、不输出 package body。 | 输出 target digest、marker ref、report ref。 | candidate_redline |
| rollback target validation required | rollback 目标无效或未验证。 | rollback / restart / rerun | invalid target rejected;no activation。 | 输出 rollback ref、validation issue ref。 | candidate |
| config digest drift blocks activation | digest 漂移。 | startup / artifact validation | block activation / release gate;只比较 redacted digest。 | 输出 expected / actual digest 和 profile ref。 | candidate |
| diagnostic sink unavailable aggregate | diagnostic sink 不可用。 | runtime / startup observation | 记录 aggregate warning;不改业务行为,不落 raw log fallback。 | 输出 sink category、operation family、safe issue ref。 | candidate |
| repeated rejected attempts aggregate | 多次非法尝试。 | source merge / runtime attempt | 聚合告警;不把 actor/id/free text 放 metric label。 | 输出 issue class、source kind、count bucket。 | candidate |
| missing schema / mapper / marker source blocks implementation | 设计闭口缺失。 | implementation gate / design review | 停止实现并回 owning design source。 | 输出缺口位置和 safe message/ref。 | candidate_process |

### 4. 覆盖映射思考

| 上游输入 | 必须被测试切口覆盖的方向 | 当前判断 |
|---|---|---|
| Step 5 来源优先级 | 高优先级非法值 no fallback、冲突处理、source merge safe issue。 | 已有候选,需 R11.16 固化。 |
| Step 7 配置项清单 | runtime、repository/material、resolver/source、publisher/handoff、query/read、diagnostic/redaction、test/replay 的失败策略。 | 已有候选,需按配置域归并。 |
| Step 8 敏感配置 | raw secret/body/full sensitive ref 禁入、redaction unsafe fail-closed、fixture contamination。 | 已有 security 候选。 |
| Step 9 加载 / 校验 / 生效 | startup、job-run-start、entry-local、test harness、unsupported reload/hot 的行为差异。 | 已有触发面候选。 |
| Step 10 变更 / 审计 / 回滚 | previous validated digest、rollback target validation、digest drift、no activation。 | 已有 rollback/digest 候选。 |
| 正式 `03` | query no-write、marker copy-only、body-free、no truth rollback、missing design closure blocks implementation。 | 已有 redline / process 候选。 |

### 5. 不进入本模块的内容思考

| 内容 | 不进入原因 | 后续承接 |
|---|---|---|
| TC-ID 编号 | 属于 `05-测试方案.md`。 | Step 12 / 05 重启后分配。 |
| fixture JSON schema | 属于测试方案或实现测试夹具。 | `05-测试方案.md` / `07-实施计划.md`。 |
| evidence artifact schema | 属于测试方案、验收标准或实施门禁。 | `05/06/07`。 |
| acceptance gate 名称与通过标准 | 属于验收标准。 | `06-验收标准.md`。 |
| commit boundary / implementation ledger | 属于实施计划。 | `07-实施计划.md`。 |
| 告警阈值、SLO、pager、dashboard | 属于运维或下游承接。 | Step 12 只写承接方向。 |

### 6. 03 影响预判

| 候选结论 | 是否影响 03 | 处理 |
|---|---|---|
| 只把 Step 11 失效策略转成测试切口候选 | 否 | 可留在 04 Step 11。 |
| 验证 query no-write、no truth rollback、marker copy-only、body-free | 否 | 这些已来自正式 `03`,测试切口只承接。 |
| 发现某候选缺 formal marker / diagnostic / outcome 来源 | 是 | 不补测试断言;回 `03` owning Step 或在 Step 12 标 blocker。 |
| 需要新增 fixture/evidence/assertion schema | 不直接影响 03,但越过本模块 | 后移 `05-测试方案.md`;Step 11 不闭口。 |
| 需要具体 adapter 产品、provider schema 或平台告警字段 | 越界 | 不进入 04 Step 11。 |

### 7. R11.16 写入计划

| R11.16 拟写内容 | 写入边界 |
|---|---|
| 测试切口候选表 | 把 R11.15 候选池按失效模式、触发面、预期行为和安全输出边界写成可恢复记录。 |
| 覆盖映射记录 | 固化 Step 5 / 7 / 8 / 9 / 10 / 正式 `03` 到测试切口的覆盖关系。 |
| 不进入本模块记录 | 固化 TC-ID、fixture schema、evidence schema、验收门禁、实施计划等后移边界。 |
| 03 影响记录 | 固化测试切口不补 design gap 的判断。 |
| R11.17 入口 | 进入 Step 11 收口与 03 影响判定:先思考。 |

### 8. R11.15 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做测试切口先思考 | pass | 只形成候选池和写入计划,未标 final。 |
| 是否避免 TC-ID / schema 越界 | pass | 未写 TC-ID、fixture schema、evidence schema 或 assertion schema。 |
| 是否覆盖关键失效模式 | pass | 覆盖 strict JSON、缺必填、invalid source no fallback、raw secret、forbidden boundary、runtime degraded、publisher/handoff、rollback/digest。 |
| 是否保持 safe-only | pass | 每个候选都保留安全输出边界。 |
| 是否避免正式 `04` 越界 | pass | 未创建或修改正式 `04-配置设计.md`。 |
| 是否保留 03 回写门禁 | pass | 缺 marker / diagnostic / outcome 来源仍需回 owning design source。 |
| 是否可进入 R11.16 | pass | 等待用户确认后进入测试切口候选:再写入。 |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.16 测试切口候选:再写入`;只允许把 R11.15 的测试切口候选池、覆盖映射、不进入本模块边界、03 影响预判和 R11.17 入口写成可恢复记录;不得创建正式 `04-配置设计.md`;不得写 TC ID、fixture schema、evidence schema、验收门禁、实施计划或代码。

## R11.16 测试切口候选:再写入

### 1. 当前模块状态记录

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R11.17 |
| 本模块目标 | 将 R11.15 的测试切口候选池、覆盖映射、不进入本模块边界、03 影响预判和 R11.17 入口写成可恢复记录。 |
| 本模块已写入 | 测试切口候选表、覆盖映射记录、不进入本模块记录、03 影响记录、R11.17 入口和停审记录。 |
| 本模块未写入 | 未写 TC ID;未写 fixture schema、evidence schema、assertion schema、验收门禁、实施计划或代码;未创建正式 `04-配置设计.md`。 |
| 当前恢复口径 | 用户已确认从 R11.15 进入 R11.16;R11.16 完成后等待用户确认进入 R11.17。 |

### 2. 测试切口候选表记录

| 测试切口候选 | 覆盖失效模式 | 触发面 | 预期行为方向 | 安全输出边界 | 状态 |
|---|---|---|---|---|---|
| strict JSON rejects comments/trailing comma | 配置格式错误。 | startup / test harness | 拒绝当前配置装配;无 runtime facade。 | 只返回 validation issue ref,不输出文件正文。 | candidate |
| missing required startup field | 必填配置缺失。 | startup | builder fail-fast;不进入 Ready。 | 输出 section、profile ref、issue ref。 | candidate |
| type/range/cross-field invalid | 类型、范围、交叉字段错误。 | startup / job-run-start / entry-local | startup fail-fast 或 scoped rejected。 | 输出 safe issue class,不输出 raw value。 | candidate |
| high-priority invalid source no fallback | 高优先级非法来源。 | source merge / startup / job-run-start | 不回退低优先级默认值;拒绝当前 activation/run。 | 输出 source kind、section、issue ref。 | candidate_redline |
| forbidden invariant override rejected | 禁止配置化边界被覆盖。 | startup / job-run-start / entry-local | fail-closed 或 rejected;不修改 truth owner / state / marker source。 | 输出 forbidden key class、activation kind、issue ref。 | candidate_redline |
| hot reload / admin override attempt rejected | unsupported live mutation。 | runtime / admin-like attempt | 返回 unsupported / rejected;不生效、不写状态。 | 输出 activation kind、unsupported source kind。 | candidate_watch_redline |
| raw secret or raw body rejected | 敏感配置泄露风险。 | startup / fixture / job input | fail-closed;不写 raw material。 | 输出 forbidden class、profile ref、issue ref。 | candidate_security |
| redaction unsafe profile rejected | redaction 配置不安全。 | startup / test harness | fail-closed;不允许 unsafe report/log/evidence。 | 输出 redaction rule class、safe field class。 | candidate_security |
| production-like fixture contamination | 测试 fixture 污染生产相似 profile。 | test harness / profile validation | fail-closed;fixture 不进入 production-like / integration-like required path。 | 输出 fixture class、profile ref、issue ref。 | candidate_security |
| optional externalGrc disabled core unaffected | 可选外部协作禁用。 | startup / job-run-start | core runtime Ready;相关 export / handoff path disabled 或 rejected。 | 输出 feature family、disabled state。 | candidate_optional |
| enabled externalGrc missing target | 已启用外部协作但目标缺失。 | startup / job-run-start | startup fail-fast 或 job rejected,按作用域区分。 | 输出 target family、issue ref,不输出 endpoint/credential。 | candidate |
| repository / material adapter binding invalid | repository/material adapter 装配错误。 | startup | required binding fail-fast;不 fallback fake。 | 输出 adapter slot category、issue ref。 | candidate_redline |
| runtime resolver unavailable | 运行期 resolver 不可用。 | runtime adapter call / query / consumer | 返回 unavailable / delayed / degraded,不把 unavailable 当配置成功修复。 | 只复制 formal marker / safe diagnostic ref。 | candidate_needs_marker_check |
| query degraded no-write | read material / projection / reference degraded。 | query | 返回 degraded/stale/unavailable surface;不得写 repository。 | 只复制 formal marker,不输出 subject/body/cursor。 | candidate_redline |
| inbound consumer resolver unavailable delayed | inbound 依赖不可用。 | consumer intake | delayed / unavailable receipt;不生成伪 snapshot 或 stale truth。 | 输出 receipt/outcome ref、safe reason。 | candidate |
| publisher failure no truth rollback | publisher / target failure。 | outbound job | 记录 failed marker / publication outcome;不回滚已提交 truth。 | 输出 outbox ref category、event kind、failure reason ref。 | candidate_redline |
| handoff/export failure no truth rollback | handoff target / package failure。 | handoff job | job report failed;不回滚 truth、不输出 package body。 | 输出 target digest、marker ref、report ref。 | candidate_redline |
| rollback target validation required | rollback 目标无效或未验证。 | rollback / restart / rerun | invalid target rejected;no activation。 | 输出 rollback ref、validation issue ref。 | candidate |
| config digest drift blocks activation | digest 漂移。 | startup / artifact validation | block activation / release gate;只比较 redacted digest。 | 输出 expected / actual digest 和 profile ref。 | candidate |
| diagnostic sink unavailable aggregate | diagnostic sink 不可用。 | runtime / startup observation | 记录 aggregate warning;不改业务行为,不落 raw log fallback。 | 输出 sink category、operation family、safe issue ref。 | candidate |
| repeated rejected attempts aggregate | 多次非法尝试。 | source merge / runtime attempt | 聚合告警;不把 actor/id/free text 放 metric label。 | 输出 issue class、source kind、count bucket。 | candidate |
| missing schema / mapper / marker source blocks implementation | 设计闭口缺失。 | implementation gate / design review | 停止实现并回 owning design source。 | 输出缺口位置和 safe message/ref。 | candidate_process |

### 3. 覆盖映射记录

| 上游输入 | 已覆盖的测试切口方向 | 当前记录 |
|---|---|---|
| Step 5 来源优先级 | high-priority invalid source no fallback;type/range/cross-field invalid;repeated rejected attempts aggregate。 | 覆盖 no silent fallback、source conflict safe issue 和非法高优先级值拒绝。 |
| Step 7 配置项清单 | missing required startup field;repository/material adapter binding invalid;enabled externalGrc missing target;optional externalGrc disabled core unaffected。 | 覆盖配置项必填性、作用域、adapter binding、optional / enabled target 区分。 |
| Step 8 敏感配置 | raw secret or raw body rejected;redaction unsafe profile rejected;production-like fixture contamination。 | 覆盖 raw secret/body 禁入、redaction fail-closed 和 fixture 隔离。 |
| Step 9 加载 / 校验 / 生效 | strict JSON rejects comments/trailing comma;hot reload / admin override attempt rejected;job / entry scoped invalid behavior。 | 覆盖 startup、job-run-start、entry-local、test harness 和 unsupported live mutation。 |
| Step 10 变更 / 审计 / 回滚 | rollback target validation required;config digest drift blocks activation。 | 覆盖 previous validated digest、no activation 和 rollback 目标验证。 |
| 正式 `03` | query degraded no-write;publisher failure no truth rollback;handoff/export failure no truth rollback;missing schema / mapper / marker source blocks implementation。 | 覆盖 query no-write、body-free、marker copy-only、no truth rollback 和 design gap 暂停规则。 |

### 4. 不进入本模块记录

| 内容 | 处理口径 | 后续承接 |
|---|---|---|
| TC-ID 编号 | Step 11 不生成正式测试编号。 | `05-测试方案.md` 重启后分配。 |
| fixture JSON / YAML / file schema | Step 11 不定义测试夹具字段、目录或样例。 | `05-测试方案.md` 或 `07-实施计划.md` 承接。 |
| evidence artifact schema | Step 11 不定义 run artifact、assertion item、report 字段。 | `05/06/07` 按测试与实施门禁闭口。 |
| acceptance gate 名称与通过标准 | Step 11 只保留配置测试切口候选。 | `06-验收标准.md`。 |
| commit boundary / implementation ledger | Step 11 不定义提交分组、allowed scope 或 required checks。 | `07-实施计划.md`。 |
| 告警阈值、SLO、pager、dashboard、runbook | Step 11 不写具体运维实现。 | Step 12 只写下游承接方向,运维文档另行承接。 |

### 5. 03 影响记录

| 候选结论 | 是否影响 03 | 处理 |
|---|---|---|
| 将已定义失效策略转成测试切口候选 | 否 | 本模块只做承接记录。 |
| 验证 query no-write、no truth rollback、marker copy-only、body-free | 否 | 这些约束来自正式 `03`;测试切口不改变设计。 |
| 某切口需要 formal marker / diagnostic / outcome 来源 | 是 | Step 11 不补来源;回 `03` owning Step 或在 Step 12 标 blocker。 |
| 某切口需要 fixture/evidence/assertion schema | 不直接影响 03,但越过本模块 | 后移 `05-测试方案.md`。 |
| 某切口需要具体 adapter 产品、provider schema 或平台告警字段 | 越界 | 不进入 04 Step 11。 |

### 6. R11.17 入口记录

| 下一模块 | 入口条件 | 允许内容 | 禁止内容 |
|---|---|---|---|
| R11.17 Step 11 收口与 03 影响判定:先思考 | 用户确认进入 R11.17。 | 思考 Step 11 的整体收口、失效模式覆盖、配置域覆盖、告警与测试切口覆盖、03 回写 / blocker 判断和进入 Step 12 的条件。 | 不创建正式 `04-配置设计.md`;不装配 Step 11 final 正文;不写测试方案、验收标准、实施计划或代码。 |

### 7. R11.16 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做测试切口再写入 | pass | 已把 R11.15 思考固化为候选记录,未标 final。 |
| 是否避免 TC-ID / schema 越界 | pass | 未写 TC-ID、fixture schema、evidence schema、assertion schema。 |
| 是否覆盖关键失效模式 | pass | 覆盖格式、缺失、错误、高优先级非法、敏感、禁止边界、degraded/no-write、publisher/handoff、rollback/digest。 |
| 是否保持 safe-only | pass | 测试切口只要求 safe issue/ref/digest/marker,不要求 raw body 或 secret。 |
| 是否避免正式 `04` 越界 | pass | 未创建或修改正式 `04-配置设计.md`。 |
| 是否保留 03 回写门禁 | pass | 缺 marker / diagnostic / outcome 来源仍需回 owning design source。 |
| 是否可进入 R11.17 | pass | 等待用户确认后进入 Step 11 收口与 03 影响判定:先思考。 |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.17 Step 11 收口与 03 影响判定:先思考`;只允许思考 Step 11 的整体收口、失效模式覆盖、配置域覆盖、告警与测试切口覆盖、03 回写 / blocker 判断和进入 Step 12 的条件;不得创建正式 `04-配置设计.md`;不得装配 Step 11 final 正文;不得写测试方案、验收标准、实施计划或代码。

## R11.17 Step 11 收口与 03 影响判定:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R11.18 |
| 本模块目标 | 思考 Step 11 是否满足 SOP、书写规范、上游配置输入、详细设计红线和进入 Step 12 的门禁。 |
| 本模块允许 | 思考整体收口、失效模式覆盖、配置域覆盖、告警与测试切口覆盖、03 回写 / blocker 判断、Step 12 入口和 R11.18 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不装配 Step 11 final 正文;不把候选表标 final;不写测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R11.16 已完成测试切口候选再写入,并等待用户确认进入 R11.17。 |

### 2. SOP 收口条件思考

| SOP / 规范条件 | 当前覆盖判断 | R11.18 写入要求 |
|---|---|---|
| 缺配置有处理方式 | 已覆盖 startup required missing、job/entry scoped required missing、test fixture missing。 | 写入为 pass,并说明按触发面区分 fail-fast / rejected / test fail-fast。 |
| 错配置有处理方式 | 已覆盖 strict JSON、type/range/cross-field invalid、high-priority invalid no fallback。 | 写入为 pass,强调高优先级非法值不 fallback。 |
| 敏感配置不可读 / 禁止 raw secret | 已覆盖 raw secret/body detected、redaction unsafe、fixture contamination。 | 写入为 pass,强调 fail-closed 与 safe-only output。 |
| config center 不可达 | 当前 P0 不引入 remote config center/admin override。 | 写入为 pass_with_watch, future 引入必须回 `03` / 架构 / Step 5/9/10。 |
| 配置漂移或过期 | 已覆盖 config digest drift、rollback target validation、previous validated digest restart/new run/rerun。 | 写入为 pass,强调 no activation 和无 online LKG。 |
| 高风险失败不得 silent fallback | 已在失效模式、策略矩阵、测试切口中多次覆盖。 | 写入跨失效审计表的 pass。 |
| 必须说明 fail-fast / fail-closed / degraded | 已定义策略词、配置域策略和生效方式矩阵。 | 写入策略区分:invalid config 不 degraded;runtime dependency 才 degraded/delayed/failed marker。 |

### 3. 配置域覆盖收口思考

| 配置域 | 覆盖判断 | 可能缺口 | R11.18 处理 |
|---|---|---|---|
| runtime / builder / facade | 已覆盖 startup validation rejected、builder failed、unsupported hot reload。 | 无 hard blocker。 | pass |
| repository / material store | 已覆盖 adapter binding invalid、required unavailable、fake production-like forbidden。 | 具体产品 / pool 参数留 Step 7/13 或运维。 | pass |
| source / resolver / inbound | 已覆盖 resolver unavailable、inbound delayed、body-free source boundary。 | formal marker 来源若缺,回 `03`;当前 04 不补。 | pass_with_marker_gate |
| publisher / outbox / target | 已覆盖 target missing、publisher failed、failed marker、no truth rollback。 | 具体 topic/URL/credential 不在 Step 11。 | pass |
| handoff / export | 已覆盖 export failed、target digest、report ref、安全字段。 | package/export body 禁止输出。 | pass |
| query / read material | 已覆盖 degraded/stale/unavailable、query no-write、marker copy-only。 | 缺 marker source 时是 `03` blocker,不是 04 补口。 | pass_with_marker_gate |
| diagnostics / redaction / alert | 已覆盖 safe fields、forbidden fields、low-cardinality labels。 | 具体 metric/log/span schema 与平台不在 Step 11。 | pass |
| test / replay / fixture | 已覆盖 fixture invalid、production-like contamination、test fail-fast。 | TC-ID / fixture schema 后移 `05`。 | pass |
| config center / admin override / hot reload | P0 明确 excluded/watch;attempt rejected。 | future 引入需完整设计闭口。 | pass_with_watch |

### 4. 03 影响判定思考

| Step 11 结论类型 | 是否需要回写 03 | 思考结论 |
|---|---|---|
| invalid config fail-fast / fail-closed / scoped rejected | 否 | 承接 `03` §13 config binding 和 runtime builder,不改变对象/port/flow。 |
| runtime dependency unavailable -> degraded/delayed/failed marker | 否,但受 `03` marker 来源约束 | 只能复制正式 availability / degraded / outcome marker;缺来源即回 `03`。 |
| query degraded no-write | 否 | 承接 `03` query no-write 和 marker copy-only,不新增 query 写入。 |
| publisher / handoff failure no truth rollback | 否 | 承接 `03` transaction / handoff / publisher outcome,不改变 truth boundary。 |
| safe alert fields / low-cardinality metric label | 否 | 承接 `03` observability redline,不定义具体 schema。 |
| remote config center、admin override、hot reload、online LKG success path | 是且当前越界 | 当前只记录 watch/redline;若 future 引入必须回 `03`、架构和 Step 5/9/10。 |
| 具体 marker / diagnostic / sink port / evidence schema | 是或属下游 | Step 11 不补;回 owning design source 或交 `05/06/07`。 |

### 5. 进入 Step 12 条件思考

| 条件 | 当前判断 | 进入 Step 12 前处理 |
|---|---|---|
| Step 11 失效模式表候选已覆盖 P0 | pass | R11.18 固化收口记录。 |
| 告警规则与安全字段候选已覆盖 | pass | R11.18 写入为下游承接输入。 |
| 测试切口候选已覆盖 | pass | R11.18 写入,后续 Step 12 再映射到 `05/06/07/09`。 |
| 03 hard blocker | none_currently | 只保留 marker/source 缺失时回 `03` 的门禁。 |
| 正式 `04` 装配 | not_allowed_yet | Step 15 才可装配。 |
| 下游文档承接 | ready_for_step12 | Step 12 负责测试、验收、实施与运维承接。 |

### 6. R11.18 写入计划

| R11.18 拟写内容 | 写入边界 |
|---|---|
| SOP 收口条件记录 | 固化缺配置、错配置、敏感配置、config center watch、漂移、silent fallback 和策略词覆盖判断。 |
| 配置域覆盖记录 | 固化 runtime、store、resolver、publisher、handoff、query、diagnostics、fixture、watch 的 pass / pass_with_watch。 |
| 03 影响判定记录 | 固化当前无必须回写 03 的结论,以及 future / marker 缺失的回写门禁。 |
| Step 12 入口记录 | 固化可进入 Step 12 的条件与禁止提前装配正式 `04`。 |
| R11.19 入口 | 进入 Step 11 最终停审与 Step 12 切换:先思考。 |

### 7. R11.17 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做收口先思考 | pass | 未写 final 正文,未创建正式 `04-配置设计.md`。 |
| 是否覆盖 SOP 条件 | pass | 缺失、错误、敏感、config center watch、漂移和 silent fallback 均已检查。 |
| 是否覆盖配置域 | pass | runtime/store/resolver/publisher/handoff/query/diagnostics/fixture/watch 均已检查。 |
| 是否保留 03 回写门禁 | pass | marker/source/schema/port 缺失仍回 owning design source。 |
| 是否避免下游越界 | pass | 未写 TC-ID、acceptance gate、implementation boundary 或 runbook。 |
| 是否可进入 R11.18 | pass | 等待用户确认后进入收口与 03 影响判定:再写入。 |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.18 Step 11 收口与 03 影响判定:再写入`;只允许把 R11.17 的 SOP 收口条件、配置域覆盖、03 影响判定、Step 12 入口条件和 R11.19 入口写成可恢复记录;不得创建正式 `04-配置设计.md`;不得装配 Step 11 final 正文;不得写测试方案、验收标准、实施计划或代码。

## R11.18 Step 11 收口与 03 影响判定:再写入

### 1. 当前模块状态记录

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R11.19 |
| 本模块目标 | 将 R11.17 的 SOP 收口条件、配置域覆盖、03 影响判定、Step 12 入口条件和 R11.19 入口写成可恢复记录。 |
| 本模块已写入 | SOP 收口条件记录、配置域覆盖记录、03 影响判定记录、Step 12 入口条件记录、R11.19 入口和停审记录。 |
| 本模块未写入 | 未创建正式 `04-配置设计.md`;未装配 Step 11 final 正文;未写测试方案、验收标准、实施计划或代码。 |
| 当前恢复口径 | 用户已确认从 R11.17 进入 R11.18;R11.18 完成后等待用户确认进入 R11.19。 |

### 2. SOP 收口条件记录

| SOP / 规范条件 | 覆盖结论 | 收口说明 |
|---|---|---|
| 缺配置有处理方式 | pass | startup required missing -> fail-fast;job-run-start required missing -> run rejected;entry-local required missing -> entry rejected;test fixture missing -> test fail-fast。 |
| 错配置有处理方式 | pass | strict JSON、type/range/cross-field invalid 均拒绝当前 activation/run/entry/test;高优先级非法值不得 fallback 低优先级来源。 |
| 敏感配置不可读 / 禁止 raw secret | pass | raw secret/body、redaction unsafe、fixture contamination 走 fail-closed/security rejection,只输出 safe issue/ref/digest。 |
| config center 不可达 | pass_with_watch | 当前 P0 不引入 remote config center/admin override;future 引入必须回 `03` / 架构 / Step 5/9/10 闭口。 |
| 配置漂移或过期 | pass | config digest drift block activation;rollback target 必须 validated;previous validated digest 只用于 restart/new run/rerun,不支持 online LKG。 |
| 高风险失败不得 silent fallback | pass | invalid config、raw secret、forbidden boundary、fake production-like、high-priority invalid source 均不得 silent fallback。 |
| fail-fast / fail-closed / degraded 已区分 | pass | invalid config 使用 fail-fast/fail-closed/rejected;runtime dependency/read material 才允许 degraded/delayed/failed marker。 |

### 3. 配置域覆盖记录

| 配置域 | 覆盖结论 | 缺口 / 门禁 |
|---|---|---|
| runtime / builder / facade | pass | startup validation rejected、builder failed、unsupported hot reload 均已覆盖;无 hard blocker。 |
| repository / material store | pass | required adapter binding invalid fail-fast;production-like 不允许 fake fallback;具体产品 / pool 参数不在 Step 11。 |
| source / resolver / inbound | pass_with_marker_gate | resolver unavailable、inbound delayed、body-free source boundary 已覆盖;formal marker 来源缺失时回 `03`。 |
| publisher / outbox / target | pass | target missing、publisher failed、failed marker、no truth rollback 已覆盖;topic/URL/credential 不在 Step 11。 |
| handoff / export | pass | export failed、target digest、report ref、安全字段已覆盖;package/export body 禁止输出。 |
| query / read material | pass_with_marker_gate | degraded/stale/unavailable、query no-write、marker copy-only 已覆盖;缺 marker source 时回 `03`。 |
| diagnostics / redaction / alert | pass | safe fields、forbidden fields、low-cardinality labels 已覆盖;具体 metric/log/span schema 与平台不在 Step 11。 |
| test / replay / fixture | pass | fixture invalid、production-like contamination、test fail-fast 已覆盖;TC-ID / fixture schema 后移 `05`。 |
| config center / admin override / hot reload | pass_with_watch | P0 excluded/watch;attempt rejected;future 引入需完整设计闭口。 |

### 4. 03 影响判定记录

| Step 11 结论类型 | 是否需要回写 03 | 处理状态 |
|---|---|---|
| invalid config fail-fast / fail-closed / scoped rejected | 否 | 承接 `03` §13 config binding 和 runtime builder,不改变对象 / port / flow。 |
| runtime dependency unavailable -> degraded/delayed/failed marker | 否,但受 `03` marker 来源约束 | 只能复制正式 availability / degraded / outcome marker;缺来源即回 `03`。 |
| query degraded no-write | 否 | 承接 `03` query no-write 和 marker copy-only,不新增 query 写入。 |
| publisher / handoff failure no truth rollback | 否 | 承接 `03` transaction / handoff / publisher outcome,不改变 truth boundary。 |
| safe alert fields / low-cardinality metric label | 否 | 承接 `03` observability redline,不定义具体 schema。 |
| remote config center、admin override、hot reload、online LKG success path | 是且当前越界 | 当前只记录 watch/redline;future 引入必须回 `03`、架构和 Step 5/9/10。 |
| 具体 marker / diagnostic / sink port / evidence schema | 是或属下游 | Step 11 不补;回 owning design source 或交 `05/06/07`。 |

### 5. Step 12 入口条件记录

| 条件 | 状态 | 说明 |
|---|---|---|
| Step 11 失效模式表候选已覆盖 P0 | pass | 缺失、错误、敏感、config center watch、漂移、runtime dependency、rollback 均有处理方式。 |
| 告警规则与安全字段候选已覆盖 | pass | 已给出是否告警、推荐级别候选、safe 字段和禁止字段。 |
| 测试切口候选已覆盖 | pass | 已形成后续 `05` 可承接的切口候选,未生成 TC-ID / fixture schema。 |
| 03 hard blocker | none_currently | 当前无必须立即回写 `03` 的新增结论;保留 marker/source 缺失时回 `03` 的门禁。 |
| 正式 `04` 装配 | not_allowed_yet | Step 15 才可装配正式 `04-配置设计.md`。 |
| 下游文档承接 | ready_for_step12_after_final_stop_review | R11.19 / R11.20 完成最终停审后,可进入 Step 12。 |

### 6. R11.19 入口记录

| 下一模块 | 入口条件 | 允许内容 | 禁止内容 |
|---|---|---|---|
| R11.19 Step 11 最终停审与 Step 12 切换:先思考 | 用户确认进入 R11.19。 | 思考 Step 11 最终停审、是否可关闭 Step 11、Step 12 开工必读文档、切换门禁、下游承接边界和台账更新方式。 | 不创建正式 `04-配置设计.md`;不直接进入 Step 12 写入;不写测试方案、验收标准、实施计划或代码。 |

### 7. R11.18 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做收口再写入 | pass | 已把 R11.17 思考固化为可恢复记录,未装配正式正文。 |
| 是否覆盖 SOP 条件 | pass | 缺失、错误、敏感、config center watch、漂移、silent fallback 和策略词区分均已记录。 |
| 是否覆盖配置域 | pass | runtime/store/resolver/publisher/handoff/query/diagnostics/fixture/watch 均已记录。 |
| 是否保留 03 回写门禁 | pass | marker/source/schema/port 缺失仍回 owning design source。 |
| 是否避免下游越界 | pass | 未写 TC-ID、fixture/evidence schema、acceptance gate、implementation boundary 或 runbook。 |
| 是否可进入 R11.19 | pass | 等待用户确认后进入最终停审与 Step 12 切换:先思考。 |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.19 Step 11 最终停审与 Step 12 切换:先思考`;只允许思考 Step 11 最终停审、是否可关闭 Step 11、Step 12 开工必读文档、切换门禁、下游承接边界和台账更新方式;不得创建正式 `04-配置设计.md`;不得直接进入 Step 12 写入;不得写测试方案、验收标准、实施计划或代码。

## R11.19 Step 11 最终停审与 Step 12 切换:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R11.20 |
| 本模块目标 | 思考 Step 11 是否可以最终停审,以及如何在不越界写 Step 12 正文的前提下准备切换。 |
| 本模块允许 | 思考 Step 11 最终停审、是否可关闭 Step 11、Step 12 开工必读文档、切换门禁、下游承接边界、台账更新方式和 R11.20 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不直接进入 Step 12 写入;不生成 Step 12 中间产物;不写测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R11.18 已完成 Step 11 收口与 03 影响判定再写入,并等待用户确认进入 R11.19。 |

### 2. Step 11 最终停审思考

| 停审项 | 当前判断 | R11.20 写入要求 |
|---|---|---|
| SOP 输出是否齐全 | pass | 已形成策略词表、失效模式表、配置域策略、生效方式矩阵、告警规则、测试切口和收口记录。 |
| 失效模式是否覆盖 P0 | pass | 缺配置、错配置、敏感配置、config center watch、漂移 / 过期、adapter unavailable、rollback failed 均有候选处理方式。 |
| 高风险失败是否无 silent fallback | pass | high-priority invalid source、raw secret、forbidden boundary、fake production-like、redaction unsafe 均拒绝或 fail-closed。 |
| invalid config 是否避免 degraded success | pass | degraded 只保留给 runtime dependency / read material / optional surface。 |
| safe output 是否闭口 | pass | 告警、日志、trace、audit、diagnostic、report 都只保留 safe ref / digest / marker category。 |
| 03 影响是否已判定 | pass_with_gate | 当前无必须立即回写 03;若后续发现 marker/source/schema/port 缺口,回 owning design source。 |
| 下游越界是否避免 | pass | 未写 TC-ID、fixture/evidence schema、acceptance gate、implementation boundary、runbook。 |

### 3. Step 12 开工必读文档思考

| 必读文档 | 读取目的 | Step 12 使用方式 |
|---|---|---|
| `project_execution_ledger.md` | 确认 Step 11 已最终停审并获得用户确认切换。 | Step 12 每次恢复先读。 |
| `04_config_calibration_flow.md` | 确认 Step 12 当前状态、Step 11 已 completed、正式 `04` 仍不得装配。 | 切换时更新 current Step。 |
| `04_config_step_11_failure_degradation.md` | 提供失效模式、告警规则、测试切口和 03 影响输入。 | Step 12 下游承接表直接引用。 |
| `配置设计讨论流程_SOP.md` Step 12 | 固定 Step 12 目标、输入、问题和输出表。 | 按五问展开下游承接。 |
| `配置设计书写规范.md` §5.12 | 固定下游承接表列和写法边界。 | 使用 `下游文档 / 承接内容 / 本文提供的输入`。 |
| Step 6 / Step 7 / Step 11 中间产物 | 提供环境矩阵、配置项清单和失效模式。 | 识别哪些进入测试、验收、实施、运维。 |
| 正式 `03-详细设计.md` §13~§16 | 提供 config binding、observability、test cut 和 handoff 红线。 | 防止 Step 12 发明下游 schema / gate。 |
| 旧 `05/06/07` | 只作方向输入。 | 不得反向定义配置契约、TC、验收门禁或实施边界。 |

### 4. Step 12 切换门禁思考

| 门禁 | 判断 | 处理 |
|---|---|---|
| Step 11 是否可关闭 | yes_after_R11.20 | R11.20 写入最终停审后,flow 可把 Step 11 标为 completed。 |
| Step 12 文件是否可创建 | yes_after_R11.20_user_confirm | 完成 R11.20 后等待用户确认,再创建 `04_config_step_12_downstream_handoff.md`。 |
| 正式 `04-配置设计.md` 是否可创建 | no | 仍需等 Step 15 装配。 |
| 是否可直接写 Step 12 正文 | no_in_R11.19 | R11.19 只思考切换;R11.20 只写切换记录。 |
| 是否可使用旧 `05/06/07` 定义下游内容 | no | 旧文档只作方向输入,不得反向覆盖当前 `03/04`。 |
| 是否可生成 TC / gate / commit boundary | no | Step 12 只写承接关系;具体内容留 `05/06/07`。 |

### 5. 下游承接边界思考

| 下游文档 / 材料 | Step 12 可承接方向 | Step 12 禁止 |
|---|---|---|
| `05-测试方案.md` | 配置失效模式测试切口、profile / fixture 方向、safe output 验证方向。 | 不写 TC-ID、fixture schema、evidence schema。 |
| `06-验收标准.md` | no silent fallback、fail-closed、safe output、no raw body、no private fallback 等验收红线方向。 | 不写正式 acceptance gate 编号、通过阈值或 release gate 细则。 |
| `07-实施计划.md` | 配置准备、implementation gate input、no-private-fallback、design blocker 回流方向。 | 不写 commit boundary、allowed scope、required checks、实施台账。 |
| `09-部署与运维手册.md` | 部署挂载、secret provider、告警阈值、dashboard/runbook 的归属方向。 | 不写具体部署命令、产品、SLO、pager、dashboard。 |
| 标准 / 规范 | 引用台账、门禁、真相源闭口规则。 | 不新增标准内容。 |

### 6. 台账更新方式思考

| 文件 | R11.20 后应如何更新 | 注意 |
|---|---|---|
| `04_config_step_11_failure_degradation.md` | 写入最终停审、Step 12 切换记录和 next_allowed_action。 | 不创建正式 `04`。 |
| `04_config_calibration_flow.md` | Step 11 标 completed;Step 12 仍待用户确认开工或进入 R12.1。 | 只有 R11.20 完成后才更新为 Step 12 当前恢复点。 |
| `project_execution_ledger.md` | 当前文档仍为 `04-配置设计.md`;当前 Step 切换到 Step 12 开工等待确认。 | 恢复顺序要改读 Step 12 文件,但只有创建后才指向该文件。 |
| `04_config_step_12_downstream_handoff.md` | 不在 R11.19 创建。 | 用户确认进入 Step 12 后再创建。 |

### 7. R11.20 写入计划

| R11.20 拟写内容 | 写入边界 |
|---|---|
| Step 11 最终停审记录 | 固化 SOP 输出齐全、P0 覆盖、no silent fallback、safe output、03 影响和下游越界检查。 |
| Step 12 开工必读文档记录 | 固化 Step 12 需要读取的文档和用途。 |
| Step 12 切换门禁记录 | 固化 Step 11 可关闭、Step 12 可等待开工、正式 `04` 不可创建。 |
| 下游承接边界记录 | 固化 `05/06/07/09` 的承接方向与禁止越界。 |
| 台账更新计划 | 固化 flow / project ledger 下一状态。 |
| R12.1 入口 | 进入 Step 12 开工与必读文档:先思考,但需用户再次确认。 |

### 8. R11.19 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做最终停审先思考 | pass | 未写 Step 12 正文,未创建 Step 12 文件。 |
| 是否判断 Step 11 可关闭 | pass | 判断为 R11.20 写入最终停审后可关闭。 |
| 是否列出 Step 12 必读文档 | pass | 已列台账、flow、Step 11、SOP、书写规范、Step 6/7/11、正式 03、旧 05/06/07。 |
| 是否明确下游承接边界 | pass | 只承接方向,不写 TC/gate/commit/runbook 细节。 |
| 是否避免正式 `04` 越界 | pass | 未创建或修改正式 `04-配置设计.md`。 |
| 是否可进入 R11.20 | pass | 等待用户确认后进入最终停审与 Step 12 切换:再写入。 |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.20 Step 11 最终停审与 Step 12 切换:再写入`;只允许把 R11.19 的最终停审、Step 12 开工必读文档、切换门禁、下游承接边界、台账更新方式和 R12.1 入口写成可恢复记录;不得创建正式 `04-配置设计.md`;不得直接写 Step 12 正文;不得写测试方案、验收标准、实施计划或代码。

## R11.20 Step 11 最终停审与 Step 12 切换:再写入

### 1. 当前模块状态记录

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R12.1 |
| 本模块目标 | 将 R11.19 的最终停审、Step 12 开工必读文档、切换门禁、下游承接边界、台账更新方式和 R12.1 入口写成可恢复记录。 |
| 本模块已写入 | Step 11 最终停审记录、Step 12 开工必读文档记录、Step 12 切换门禁记录、下游承接边界记录、台账更新记录、R12.1 入口和停审记录。 |
| 本模块未写入 | 未创建正式 `04-配置设计.md`;未创建 `04_config_step_12_downstream_handoff.md`;未直接写 Step 12 正文;未写测试方案、验收标准、实施计划或代码。 |
| 当前恢复口径 | 用户已确认从 R11.19 进入 R11.20;R11.20 完成后等待用户确认进入 Step 12 R12.1。 |

### 2. Step 11 最终停审记录

| 停审项 | 结论 | 说明 |
|---|---|---|
| SOP 输出是否齐全 | pass | 已形成策略词表、失效模式表、配置域策略、生效方式矩阵、告警规则、测试切口和收口记录。 |
| 失效模式是否覆盖 P0 | pass | 缺配置、错配置、敏感配置、config center watch、漂移 / 过期、adapter unavailable、rollback failed 均有候选处理方式。 |
| 高风险失败是否无 silent fallback | pass | high-priority invalid source、raw secret、forbidden boundary、fake production-like、redaction unsafe 均拒绝或 fail-closed。 |
| invalid config 是否避免 degraded success | pass | degraded 只保留给 runtime dependency / read material / optional surface。 |
| safe output 是否闭口 | pass | 告警、日志、trace、audit、diagnostic、report 都只保留 safe ref / digest / marker category。 |
| 03 影响是否已判定 | pass_with_gate | 当前无必须立即回写 03;若后续发现 marker/source/schema/port 缺口,回 owning design source。 |
| 下游越界是否避免 | pass | 未写 TC-ID、fixture/evidence schema、acceptance gate、implementation boundary、runbook。 |
| Step 11 是否可关闭 | pass | Step 11 中间产物可作为 Step 12 输入,正式 `04` 仍等 Step 15 装配。 |

### 3. Step 12 开工必读文档记录

| 必读文档 | 读取目的 | Step 12 使用方式 |
|---|---|---|
| `project_execution_ledger.md` | 确认 Step 11 已最终停审并获得用户确认切换。 | Step 12 每次恢复先读。 |
| `04_config_calibration_flow.md` | 确认 Step 12 当前状态、Step 11 已 completed、正式 `04` 仍不得装配。 | R12.1 开工时同步 current Step。 |
| `04_config_step_11_failure_degradation.md` | 提供失效模式、告警规则、测试切口和 03 影响输入。 | Step 12 下游承接表直接引用。 |
| `配置设计讨论流程_SOP.md` Step 12 | 固定 Step 12 目标、输入、问题和输出表。 | 按五问展开下游承接。 |
| `配置设计书写规范.md` §5.12 | 固定下游承接表列和写法边界。 | 使用 `下游文档 / 承接内容 / 本文提供的输入`。 |
| Step 6 / Step 7 / Step 11 中间产物 | 提供环境矩阵、配置项清单和失效模式。 | 识别哪些进入测试、验收、实施、运维。 |
| 正式 `03-详细设计.md` §13~§16 | 提供 config binding、observability、test cut 和 handoff 红线。 | 防止 Step 12 发明下游 schema / gate。 |
| 旧 `05/06/07` | 只作方向输入。 | 不得反向定义配置契约、TC、验收门禁或实施边界。 |

### 4. Step 12 切换门禁记录

| 门禁 | 结论 | 处理 |
|---|---|---|
| Step 11 是否关闭 | yes | R11.20 完成后可在 flow 标记 Step 11 completed。 |
| Step 12 文件是否已创建 | no | 本模块不创建 `04_config_step_12_downstream_handoff.md`;用户确认进入 R12.1 后再创建。 |
| 正式 `04-配置设计.md` 是否可创建 | no | 仍需等 Step 15 装配。 |
| 是否可直接写 Step 12 正文 | no | R11.20 只写切换记录;R12.1 经用户确认后才开始 Step 12。 |
| 是否可使用旧 `05/06/07` 定义下游内容 | no | 旧文档只作方向输入,不得反向覆盖当前 `03/04`。 |
| 是否可生成 TC / gate / commit boundary | no | Step 12 只写承接关系;具体内容留 `05/06/07`。 |

### 5. 下游承接边界记录

| 下游文档 / 材料 | Step 12 可承接方向 | Step 12 禁止 |
|---|---|---|
| `05-测试方案.md` | 配置失效模式测试切口、profile / fixture 方向、safe output 验证方向。 | 不写 TC-ID、fixture schema、evidence schema。 |
| `06-验收标准.md` | no silent fallback、fail-closed、safe output、no raw body、no private fallback 等验收红线方向。 | 不写正式 acceptance gate 编号、通过阈值或 release gate 细则。 |
| `07-实施计划.md` | 配置准备、implementation gate input、no-private-fallback、design blocker 回流方向。 | 不写 commit boundary、allowed scope、required checks、实施台账。 |
| `09-部署与运维手册.md` | 部署挂载、secret provider、告警阈值、dashboard/runbook 的归属方向。 | 不写具体部署命令、产品、SLO、pager、dashboard。 |
| 标准 / 规范 | 引用台账、门禁、真相源闭口规则。 | 不新增标准内容。 |

### 6. 台账更新记录

| 文件 | R11.20 更新方式 | 状态 |
|---|---|---|
| `04_config_step_11_failure_degradation.md` | 写入最终停审、Step 12 切换记录和 next_allowed_action。 | updated_in_this_module |
| `04_config_calibration_flow.md` | Step 11 标 completed;next_allowed_action 等待用户确认进入 Step 12 R12.1。 | update_required_after_this_section |
| `project_execution_ledger.md` | 当前文档仍为 `04-配置设计.md`;当前恢复点等待 Step 12 R12.1。 | update_required_after_this_section |
| `04_config_step_12_downstream_handoff.md` | 本模块不创建。 | wait_user_confirm_to_R12.1 |

### 7. R12.1 入口记录

| 下一模块 | 入口条件 | 允许内容 | 禁止内容 |
|---|---|---|---|
| R12.1 Step 12 开工与必读文档:先思考 | 用户确认进入 Step 12 R12.1。 | 创建 Step 12 中间产物文件,思考 Step 12 开工边界、必读文档、输入基线、SOP 输出门禁、下游承接范围和 R12.2 写入计划。 | 不创建正式 `04-配置设计.md`;不写完整下游承接表;不写 TC-ID、fixture/evidence schema、验收门禁、实施计划或代码。 |

### 8. R11.20 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做最终停审再写入 | pass | 已写入切换记录,未写 Step 12 正文。 |
| 是否关闭 Step 11 | pass | Step 11 可在 flow 标记 completed。 |
| 是否创建 Step 12 文件 | pass | 未创建,等待用户确认 R12.1。 |
| 是否避免正式 `04` 越界 | pass | 未创建或修改正式 `04-配置设计.md`。 |
| 是否避免下游越界 | pass | 未写 TC-ID、fixture/evidence schema、acceptance gate、implementation boundary 或 runbook。 |
| 是否可进入 R12.1 | pass | 等待用户确认后进入 Step 12 开工与必读文档:先思考。 |

next_allowed_action: 等待用户确认后进入 Step 12 `R12.1 开工与必读文档:先思考`;只允许创建 `04_config_step_12_downstream_handoff.md` 并思考 Step 12 开工边界、必读文档、输入基线、SOP 输出门禁、下游承接范围和 R12.2 写入计划;不得创建正式 `04-配置设计.md`;不得写完整下游承接表、TC-ID、fixture/evidence schema、验收门禁、实施计划或代码。
