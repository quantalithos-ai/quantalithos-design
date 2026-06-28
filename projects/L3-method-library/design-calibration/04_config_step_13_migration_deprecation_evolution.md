# Step 13. 定义配置迁移、废弃与演进

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 13
> 书写规范: `standards/document/配置设计书写规范.md` §5.13
> 回填章节: `04-配置设计.md` §13 配置迁移、废弃与演进
> 创建日期: 2026-06-26
> 当前状态: `R13.10 Step 13 最终收口判断:再写入` completed_wait_user_confirm_to_R14.1
> 当前门禁: 等待确认进入 Step 14 `R14.1 开工与必读文档:先思考`

---

## 0. Step 13 边界

Step 13 在 Step 7 配置项清单、Step 10 变更 / 审计 / 回滚和 Step 12 下游承接闭合后,定义当前配置设计如何处理配置新增、重命名、废弃、迁移和移除。

当前 Step 只定义配置演进策略和迁移 / 废弃表候选,不创建正式 `04-配置设计.md`,不修改 Step 7~12 已确认的配置项语义,不从旧 `05/06/07` 反向迁移旧配置,不写实施 phase、commit boundary、部署命令、测试 evidence schema 或验收 gate。

---

## R13.1 开工与必读文档:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R13.2 |
| 本模块目标 | 思考 Step 13 的开工边界、必读文档、输入基线、SOP 输出门禁、旧材料处理、03 影响预判和 R13.2 写入计划。 |
| 本模块允许 | 创建并写入 Step 13 中间产物的开工思考;只记录迁移 / 废弃 / 演进讨论框架、必读文档、输入接收方式、旧材料污染防护和下一模块计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不直接写正式 §13;不新增未在 Step 7~12 出现的配置项;不迁移旧 MethodContent / publish / snapshot / outbox 口径;不写 phase、commit boundary、部署命令、测试 evidence schema 或验收 gate。 |
| 恢复依据 | Step 12 已关闭为 `R12.22 Step 12 最终下游承接候选收口判断:再写入 completed_wait_user_confirm_to_R13.1`;用户已确认进入 R13.1。 |

### 2. Step 13 开工边界思考

| 边界项 | R13.1 裁决 |
|---|---|
| Step 13 定位 | 对配置设计自身的演进策略收口,回答未来配置新增、重命名、废弃、迁移、移除如何被允许和留痕。 |
| 直接输入 | Step 7 配置项清单、Step 10 变更 / 审计 / 回滚、Step 12 下游承接、正式 `03` §13 / §16 / §17、配置设计 SOP Step 13、书写规范 §5.13。 |
| 输出粒度 | 后续应形成迁移与废弃表、当前无迁移项 / 有条件迁移项判断、兼容窗口规则、移除条件、03 影响判定和停审记录。 |
| 当前默认判断 | 当前 `04-配置设计.md` 尚未正式装配,不存在已发布的当前版配置契约;因此 Step 13 需要优先验证“当前无正式旧配置迁移项”是否成立。 |
| 旧材料边界 | 旧 `05/06/07` 和旧主线可作为污染风险线索,不得当作已发布配置契约或迁移来源。 |
| 新配置边界 | 新增配置项不能在 Step 13 私自发明;若需要新增,必须回 Step 7~11 或 Step 14 标风险 / 待确认。 |
| 废弃边界 | 废弃只针对已在本轮配置设计确认、且存在未来替代 / 移除语义的配置项;不得删除未装配的候选记录来制造“废弃”。 |
| 对 03 的影响 | 若迁移 / 废弃要求改变 runtime config carrier、builder、adapter constructor、port、mapper、DTO、state、flow 或 error,必须回 `03`。 |

### 3. 必读文档思考

| 必读文档 | 读取用途 | R13.2 用法 |
|---|---|---|
| `project_execution_ledger.md` | 确认当前允许进入 Step 13 R13.1。 | 写入 Step 13 当前恢复依据。 |
| `04_config_calibration_flow.md` | 确认 Step 12 已 completed,Step 13 处于等待开工状态,正式 `04` 仍不得装配。 | 同步 Step 13 当前状态和 next_allowed_action。 |
| `04_config_step_07_config_items.md` | 提供当前候选配置项清单、配置域、key / default / required / source / scope / activation / failure 语义。 | 判断是否存在可被迁移、重命名、废弃或移除的当前配置项。 |
| `04_config_step_08_sensitive_secrets.md` | 提供敏感配置、secret ref、redaction、禁输和 profile 污染红线。 | 判断敏感配置演进是否需要额外兼容窗口或禁止迁移 raw secret。 |
| `04_config_step_09_loading_validation_activation.md` | 提供加载、校验、生效和 unsupported reload / hot boundary。 | 判断迁移是否只能在 startup / new run / rerun 生效。 |
| `04_config_step_10_change_audit_rollback.md` | 提供变更审计、rollback、previous validated config 和 safe digest。 | 判断配置迁移 / 废弃需要哪些审计和 rollback 输入。 |
| `04_config_step_11_failure_degradation.md` | 提供迁移失败、缺配置、错配置、敏感泄露、adapter unavailable 等失效处理边界。 | 判断废弃 / 迁移失败是否 fail-fast、fail-closed 或回到 previous validated config。 |
| `04_config_step_12_downstream_handoff.md` | 提供 `05/06/07/09` 承接边界和下游不得重复定义表。 | 防止 Step 13 把测试、验收、实施或运维细节写回配置设计。 |
| `配置设计讨论流程_SOP.md` Step 13 | 固定本步目标、输入、五问、输出表和执行约束。 | R13.2 写入开工记录,R13.3 起按五问展开。 |
| `配置设计书写规范.md` §5.13 | 固定 `旧配置 / 新配置 / 状态 / 兼容窗口 / 迁移策略 / 移除条件` 表。 | 作为后续迁移与废弃表的格式门禁。 |
| `设计文档讨论中间产物规范.md` | 固定逐模块、先思考后写入和台账恢复纪律。 | 约束 R13.1 -> R13.2。 |
| `设计真相源闭环与可落码性标准.md` | 固定缺 config / schema / port / phase / evidence 时必须暂停。 | 作为 03 影响和 blocker 判定依据。 |
| 正式 `00/01/02/03` | 提供本轮配置设计上游真相源、旧主线隔离和 runtime config boundary。 | 防止把旧 MethodContent / publish / snapshot / outbox 迁移成当前配置演进项。 |
| 旧 `05/06/07` | 只作为旧材料污染风险线索。 | 不从旧测试、验收或实施计划反推旧配置。 |
| L1-governance Step 13 | 提供迁移 / 废弃表、兼容窗口、停审和审计框架深度。 | 只参考结构,不复制 governance 配置项或迁移事实。 |

### 4. 输入基线思考

| 输入来源 | Step 13 接收方式 | 不得接收 |
|---|---|---|
| Step 7 配置项清单 | 接收已确认配置项作为可能的新增 / 重命名 / 废弃 / 移除讨论对象。 | 不新增配置项,不改 key/default/source/profile/secret/failure strategy。 |
| Step 8 敏感配置 | 接收 raw secret 禁入、opaque ref、redacted digest 和 no-output 规则。 | 不写真实 secret rotation、provider migration 或 credential body。 |
| Step 9 加载校验生效 | 接收 startup / new run / entry rerun / test rerun 等生效方式。 | 不引入 hot reload、config center 或 admin override。 |
| Step 10 变更审计回滚 | 接收 change audit、rollback 和 previous validated config 语义。 | 不写审批系统、rollback CLI、deployment command 或 report schema。 |
| Step 11 失效模式 | 接收 invalid migration、missing old/new config、unsafe secret、rollback failed 等失败处理方向。 | 不把迁移失败写成 degraded success 或 silent fallback。 |
| Step 12 下游承接 | 接收下游 owner 边界和不重复定义约束。 | 不替 `05/06/07/09` 写迁移测试、验收 gate、实施 boundary 或运维 runbook。 |
| 旧材料 | 只接收污染风险和禁止迁移提示。 | 不把旧配置、旧 TC、旧 phase、旧命令或旧 evidence 当作当前迁移来源。 |

### 5. SOP 五问展开框架思考

| SOP 问题 | 后续讨论方向 |
|---|---|
| 是否存在旧配置需要迁移? | 先判断当前正式 `04` 尚不存在,是否可声明“当前无已发布旧配置迁移项”;再列旧材料不得迁移。 |
| 新配置如何引入? | 只能通过 Step 7~11 重新走配置设计小循环,不能在 Step 13 直接新增。 |
| 旧配置如何废弃? | 若未来配置项废弃,必须有替代项、状态、兼容窗口、迁移策略和移除条件。 |
| 是否需要兼容窗口? | 当前无已发布旧配置时可写“不适用”;未来新增 / 重命名 / 废弃必须给兼容窗口或明确 no-compat reason。 |
| 何时允许移除旧配置? | 未来只有在下游测试 / 验收 / 实施 / 运维承接完成、旧来源无效化且 rollback 口径明确后才允许。 |

### 6. 03 影响预判

| Step 13 结论类型 | 是否影响 03 | 处理规则 |
|---|---|---|
| 声明当前无已发布旧配置迁移项 | 否 | 留在 `04`,不回写 `03`。 |
| 定义配置演进必须回 Step 7~11 重走小循环 | 否 | 这是配置设计流程规则,不改变 runtime contract。 |
| 定义未来废弃需兼容窗口、迁移策略和移除条件 | 否 | 只要不改变 builder / adapter / port,留在 `04`。 |
| 迁移要求运行期同时支持旧 / 新 config carrier 或 adapter constructor | 是 | 回 `03` runtime config / builder / adapter owning Step。 |
| 迁移要求 hot reload、remote config center、admin override 或 live LKG switch | 是且越界 | 暂停并回架构 / `03`,当前 P0 不接收。 |
| 迁移要求下游生成 TC、gate、phase、deployment command 或 runbook | 否,但不属 Step 13 | 下游 `05/06/07/09` owner 承接,不得在本 Step 补口。 |

### 7. R13.2 写入计划

| R13.2 拟写内容 | 写入边界 |
|---|---|
| Step 13 开工记录 | 固化 R13.1 的开工边界、当前恢复依据和执行方式。 |
| 必读文档记录 | 写入 Step 7~12、SOP、书写规范、正式 `00/01/02/03` 和旧材料的读取用途。 |
| 输入基线记录 | 写清每类输入如何进入迁移 / 废弃 / 演进讨论。 |
| SOP 五问展开框架 | 固化 R13.3 起要回答的五问,不提前写最终迁移表。 |
| 03 影响判定记录 | 写明当前无回写、条件式回写和越界项。 |
| R13.3 入口 | 进入 SOP 五问回答与迁移候选:先思考。 |

### 8. R13.1 stop-review

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只写开工与必读文档思考 | pass | 未写最终迁移 / 废弃表。 |
| 是否确认 Step 13 边界 | pass | 已明确只处理配置演进,不写正式 04 或下游文档。 |
| 是否隔离旧材料污染 | pass | 旧 `05/06/07`、旧 MethodContent / publish / snapshot / outbox 不作为迁移来源。 |
| 是否避免新增配置项 | pass | 明确新增配置必须回 Step 7~11。 |
| 是否保留 03 回写门禁 | pass | runtime carrier、builder、adapter、port、mapper、DTO、state、flow、error 变化回 `03`。 |
| 是否可进入 R13.2 | pass | 等待用户确认后进入 Step 13 `R13.2 开工与必读文档:再写入`。 |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.2 开工与必读文档:再写入`;只允许把 R13.1 的开工边界、必读文档、输入基线、SOP 五问展开框架、旧材料处理、03 影响预判和 R13.3 入口写成可恢复记录;不得创建正式 `04-配置设计.md`;不得直接写正式 §13;不得写最终迁移 / 废弃表;不得新增未在 Step 7~12 出现的配置项;不得写实施 phase、commit boundary、部署命令、测试 evidence schema 或验收 gate。

---

## R13.2 开工与必读文档:再写入

### 1. 当前模块状态记录

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R13.3 |
| 本模块目标 | 将 R13.1 的开工边界、必读文档、输入基线、SOP 五问展开框架、旧材料处理、03 影响预判和 R13.3 入口写成可恢复记录。 |
| 本模块已写入 | Step 13 开工记录、必读文档记录、输入基线记录、SOP 五问展开框架、03 影响判定记录和 R13.3 入口。 |
| 本模块未写入 | 未创建正式 `04-配置设计.md`;未写最终迁移 / 废弃表;未新增配置项;未写下游测试、验收、实施或运维细节。 |
| 当前恢复口径 | 用户已确认从 R13.1 进入 R13.2;R13.2 完成后等待用户确认进入 R13.3。 |

### 2. Step 13 开工记录

| 开工项 | R13.2 记录 |
|---|---|
| 当前 Step | Step 13 定义配置迁移、废弃与演进。 |
| 当前目标 | 定义当前配置设计如何处理配置新增、重命名、废弃、迁移和移除,并为正式 §13 的迁移与废弃表提供候选输入。 |
| 执行方式 | 继续按“先思考 -> 再写入”逐模块推进;每次用户确认只推进一个当前模块。 |
| 当前核心判断 | 正式 `04-配置设计.md` 尚未装配,因此当前不存在已发布的本轮正式配置契约;Step 13 需优先验证“当前无正式旧配置迁移项”是否成立。 |
| 主要输入 | Step 7 配置项清单、Step 8 敏感配置、Step 9 加载 / 校验 / 生效、Step 10 变更 / 审计 / 回滚、Step 11 失效模式、Step 12 下游承接和正式 `03` §13 / §16 / §17。 |
| 当前不做 | 不直接写最终迁移 / 废弃表,不新增配置项,不把旧 `05/06/07` 或旧 MethodContent / publish / snapshot / outbox 迁入当前配置。 |

### 3. 必读文档记录

| 必读文档 | Step 13 用途 | 读取结论 |
|---|---|---|
| `project_execution_ledger.md` | 确认当前恢复点和用户确认门禁。 | 当前允许从 R13.1 推进到 R13.2,并在 R13.2 后等待 R13.3。 |
| `04_config_calibration_flow.md` | 确认 Step 13 当前状态和正式 `04` 装配边界。 | Step 12 已 completed;Step 13 当前 in_progress;正式 `04` 仍不得创建。 |
| `04_config_step_07_config_items.md` | 提供配置项清单和配置项身份。 | 后续判断是否存在可迁移 / 废弃对象,但不得新增或改写配置项。 |
| `04_config_step_08_sensitive_secrets.md` | 提供敏感配置和 secret 边界。 | 后续敏感配置演进只能使用 safe ref / digest,不得迁移 raw secret。 |
| `04_config_step_09_loading_validation_activation.md` | 提供加载、校验和生效方式。 | 后续迁移只能绑定 startup / new run / rerun 等已确认生效边界。 |
| `04_config_step_10_change_audit_rollback.md` | 提供变更审计、rollback 和 previous validated config。 | 后续迁移 / 废弃必须保留审计、rollback 和 safe digest。 |
| `04_config_step_11_failure_degradation.md` | 提供失败策略和 safe output。 | 迁移失败不得变成 silent fallback 或 degraded success。 |
| `04_config_step_12_downstream_handoff.md` | 提供下游 owner 边界和不重复定义表。 | 迁移测试、验收、实施、运维细节后移 `05/06/07/09`。 |
| `配置设计讨论流程_SOP.md` Step 13 | 固定 Step 13 的五问、输出和执行约束。 | R13.3 起按五问展开;暂无迁移时也必须说明“当前无迁移项”。 |
| `配置设计书写规范.md` §5.13 | 固定迁移与废弃表列。 | 后续表格必须使用 `旧配置 / 新配置 / 状态 / 兼容窗口 / 迁移策略 / 移除条件`。 |
| `设计文档讨论中间产物规范.md` | 固定逐模块和台账恢复纪律。 | R13 每个模块完成后同步 flow 与项目台账。 |
| `设计真相源闭环与可落码性标准.md` | 固定缺 schema / port / config / phase / evidence 时的暂停规则。 | 若迁移要求新增运行期 contract,必须回 `03` 或阻塞。 |
| 正式 `00/01/02/03` | 提供上游真相源、旧主线隔离和 runtime config boundary。 | 禁止把旧主线或旧下游材料当作已发布配置迁移来源。 |
| 旧 `05/06/07` | 识别旧材料污染风险。 | 不反向定义当前配置、迁移项、验收门禁或实施边界。 |
| L1-governance Step 13 | 提供框架深度参考。 | 只参考迁移 / 废弃表、兼容窗口、停审和审计结构。 |

### 4. 输入基线记录

| 输入来源 | Step 13 接收方式 | 不得接收 |
|---|---|---|
| Step 7 配置项清单 | 接收已确认配置项作为迁移、重命名、废弃或移除讨论对象。 | 不新增配置项,不改 key、default、source、profile、secret 或 failure strategy。 |
| Step 8 敏感配置 | 接收 opaque ref、redacted digest、no-output 和 profile 污染红线。 | 不写 raw secret、真实 provider migration、credential body 或 rotation command。 |
| Step 9 加载校验生效 | 接收 startup / new run / entry rerun / test rerun 的生效边界。 | 不引入 hot reload、config center、admin override 或 live mutation。 |
| Step 10 变更审计回滚 | 接收 change audit、rollback、previous validated config 和 safe digest。 | 不写审批系统、rollback CLI、deployment command 或 report schema。 |
| Step 11 失效模式 | 接收 invalid migration、missing config、unsafe secret、rollback failed 等失败方向。 | 不允许 silent fallback、fake fallback in production-like 或 degraded success。 |
| Step 12 下游承接 | 接收 `05/06/07/09` owner 边界和不重复定义约束。 | 不写 TC、acceptance gate、phase、commit boundary、deployment command 或 runbook。 |
| 正式 `03` §13 / §16 / §17 | 接收 config binding、runtime builder、implementation handoff 和风险边界。 | 不通过 Step 13 新增 builder field、adapter constructor、port、mapper、DTO、state、flow 或 error。 |
| 旧材料 | 只接收污染风险和禁止迁移提示。 | 不把旧配置、旧 TC、旧 phase、旧命令或旧 evidence 当作当前迁移来源。 |

### 5. SOP 五问展开框架记录

| SOP 问题 | R13.3 起处理方式 |
|---|---|
| 是否存在旧配置需要迁移? | 先判断本轮正式 `04` 尚未装配,当前是否无已发布旧配置迁移项;再列旧材料不得迁移。 |
| 新配置如何引入? | 新配置必须回 Step 7~11 重新走配置设计小循环,必要时在 Step 14 标待确认;不得在 Step 13 直接新增。 |
| 旧配置如何废弃? | 未来若废弃配置项,必须给替代项或 no-replacement reason、状态、兼容窗口、迁移策略和移除条件。 |
| 是否需要兼容窗口? | 当前无已发布旧配置时可标不适用;未来新增 / 重命名 / 废弃必须给兼容窗口或明确无兼容原因。 |
| 何时允许移除旧配置? | 只有下游承接完成、旧来源无效化、rollback 口径明确且没有 03 / 04 owner 缺口时才允许。 |

### 6. 03 影响判定记录

| Step 13 结论类型 | 是否影响 03 | 影响类型 | 处理状态 |
|---|---|---|---|
| 声明当前无已发布旧配置迁移项 | 否 | 无 | 留在 `04`;无回写。 |
| 定义新配置必须回 Step 7~11 重走小循环 | 否 | 流程约束 | 留在 `04`;无回写。 |
| 定义未来废弃必须有兼容窗口、迁移策略和移除条件 | 否 | 配置演进规则 | 留在 `04`;无回写。 |
| 迁移要求运行期同时支持旧 / 新 config carrier、builder 参数或 adapter constructor | 是 | runtime config / builder / adapter contract | 回 `03` owning Step。 |
| 迁移要求 hot reload、remote config center、admin override 或 live LKG switch | 是且越界 | architecture / runtime behavior | 当前 P0 不接收,需回架构 / `03`。 |
| 迁移要求下游生成 TC、gate、phase、deployment command 或 runbook | 否,但不属 Step 13 | 下游 owner 内容 | 后移 `05/06/07/09`,不得在本 Step 补口。 |

### 7. R13.3 入口记录

| 下一模块 | 入口条件 | 允许内容 | 禁止内容 |
|---|---|---|---|
| R13.3 SOP 五问回答与迁移候选:先思考 | 用户确认进入 R13.3。 | 思考 Step 13 五问回答、当前无已发布旧配置迁移项候选、未来新增 / 废弃规则候选、兼容窗口和移除条件候选、03 影响预判和 R13.4 写入计划。 | 不创建正式 `04-配置设计.md`;不直接写正式 §13;不把候选表标 final;不新增未在 Step 7~12 出现的配置项;不写实施 phase、commit boundary、部署命令、测试 evidence schema 或验收 gate。 |

### 8. R13.2 stop-review

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只固化 R13.1 开工思考 | pass | 未写最终迁移 / 废弃表。 |
| 是否完整记录必读文档和输入基线 | pass | 已覆盖 Step 7~12、正式 `03`、SOP、书写规范、标准和旧材料。 |
| 是否保留旧材料污染隔离 | pass | 旧 `05/06/07` 和旧 MethodContent / publish / snapshot / outbox 不作为迁移来源。 |
| 是否避免新增配置项 | pass | 新配置必须回 Step 7~11 或 Step 14。 |
| 是否保留 03 回写门禁 | pass | runtime carrier、builder、adapter、port、mapper、DTO、state、flow、error 变化回 `03`。 |
| 是否可进入 R13.3 | pass | 等待用户确认后进入 Step 13 `R13.3 SOP 五问回答与迁移候选:先思考`。 |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.3 SOP 五问回答与迁移候选:先思考`;只允许思考 Step 13 五问回答、当前无已发布旧配置迁移项候选、未来新增 / 废弃规则候选、兼容窗口和移除条件候选、03 影响预判和 R13.4 写入计划;不得创建正式 `04-配置设计.md`;不得直接写正式 §13;不得把候选表标 final;不得新增未在 Step 7~12 出现的配置项;不得写实施 phase、commit boundary、部署命令、测试 evidence schema 或验收 gate。

---

## R13.3 SOP 五问回答与迁移候选:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R13.4 |
| 本模块目标 | 围绕 SOP Step 13 五问形成迁移、废弃、兼容窗口、移除条件和未来演进的候选思考,并为 R13.4 再写入准备。 |
| 本模块允许 | 思考五问候选回答、当前无已发布旧配置迁移项候选、旧材料污染隔离、未来新增 / 废弃规则候选、兼容窗口和移除条件候选、03 影响预判和 R13.4 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不直接写正式 §13;不把迁移与废弃表标记为 final;不新增未在 Step 7~12 出现的配置项;不写测试 TC、验收 gate、实施 phase、commit boundary、部署命令、runbook 或 evidence schema。 |
| 恢复依据 | R13.2 已固化 Step 13 开工记录、必读文档、输入基线、SOP 五问展开框架、03 影响判定和 R13.3 入口;用户已确认进入 R13.3。 |

### 2. SOP 五问候选回答思考

| SOP 问题 | 候选回答 | R13.4 写入注意 |
|---|---|---|
| 是否存在旧配置需要迁移? | 候选判断为“当前无已发布旧配置迁移项”。理由是正式 `04-配置设计.md` 尚未装配,本轮也没有已发布的 L3-method-library runtime config schema 或 config version baseline;Step 7~12 仍是中间产物候选输入,不是已发布旧配置。 | R13.4 可写成可恢复候选记录;不得把旧 `05/06/07` 或旧 MethodContent / publish / snapshot / outbox 当作旧配置迁移对象。 |
| 新配置如何引入? | 新配置必须先回配置设计 owner 小循环:动机来源 -> 03 影响判定 -> Step 7 配置项身份 / 类型 / 默认 / 必填 / 来源 / 作用域 -> Step 8 敏感级别 -> Step 9 加载校验生效 -> Step 10 变更审计回滚 -> Step 11 失效策略 -> Step 12 下游承接 -> Step 13 演进状态。 | 不允许实施侧先加 key 再补文档;若改变 runtime builder、adapter constructor、port、mapper、DTO、state、flow 或 error,必须先回 `03`。 |
| 旧配置如何废弃? | 只对已经发布的正式配置项适用。废弃候选必须包含替代项或 no-replacement reason、状态、兼容窗口、loader 行为、safe warning / issue、审计记录、敏感 redaction 和移除条件。 | 当前不废弃 Step 7~12 候选项;候选项如果被剔除,属于 Step 15 装配前的候选收口,不是正式废弃。 |
| 是否需要兼容窗口? | 当前无已发布旧配置,兼容窗口候选为“不适用”。未来对已发布 key 的重命名 / 替换 / 拆分 / 合并必须定义窗口或说明 no-compat reason。安全红线和静态不变量不提供兼容成功窗口。 | R13.4 应区分“普通已发布配置可有窗口”和“raw secret/body、static boundary override、P0 hot/reload/config center/admin override 等只 reject”。 |
| 何时允许移除旧配置? | 候选移除条件为:旧配置已标 deprecated 或 rejected、兼容窗口结束、所有 profile/source artifact 不再使用旧 key、下游 `05/06/07/09` 承接完成、rollback 不依赖旧 key、safe audit / digest 可追溯且删除不改变 `03` 契约。 | 不写具体 release 日期、发布批次、迁移脚本或自动化工具;这些后移 `07/09` 或 future 设计。 |

### 3. 当前无已发布旧配置迁移项候选思考

| 判断轴 | 当前观察 | 候选结论 |
|---|---|---|
| 正式配置文档 | `projects/L3-method-library/04-配置设计.md` 当前不存在,正式文档只能 Step 15 装配。 | 没有已发布正式 `04` 作为旧配置基线。 |
| 当前 runtime config schema | Step 7~12 提供配置域、候选 family、加载 / 审计 / 失效 / 下游承接,但尚未装配为正式 schema。 | 没有已发布 runtime config schema 需要迁移。 |
| 旧 `05/06/07` | 旧测试、验收、实施材料只作方向输入,且含旧 MethodContent / publish / snapshot / outbox 污染风险。 | 不作为旧配置迁移来源。 |
| 旧正向主线术语 | MethodContent、publish、snapshot、outbox 等旧口径可能与当前 `03/04` owner 边界冲突。 | 只能进入污染风险记录,不得变成 alias / deprecated key。 |
| Step 7~12 候选项 | 仍是本轮中间产物,尚未发布。 | 候选项调整不是正式迁移 / 废弃。 |

候选表述:

```text
当前无已发布旧配置迁移项。原因是本轮正式 04 尚未装配,也没有已发布 L3-method-library runtime config schema;旧 05/06/07 和旧主线术语不作为迁移对象。
```

### 4. 新增配置引入规则候选思考

| 引入检查 | 候选规则 | 不满足时 |
|---|---|---|
| 动机来源 | 必须指向正式 `00/01/02/03`、已确认配置 Step 缺口、下游承接缺口或 Step 14 风险。 | 只记风险 / 待确认,不得进入实施。 |
| 03 影响 | 检查是否改变 runtime config carrier、builder、adapter constructor、port、mapper、DTO、state、flow、error 或 marker source。 | 命中则先回 `03` owning Step。 |
| 配置项身份 | 必须回 Step 7 补类型、默认值、必填、来源、作用域、生效方式、敏感级别、失败策略和关联模块。 | 未补齐不得成为正式配置项。 |
| 敏感与输出 | 必须回 Step 8 标 public/internal/sensitive/secret,并确认 no raw secret/body、redacted digest 和 safe issue/ref。 | 未标注不得启用。 |
| 加载与生效 | 必须回 Step 9 补 parse/type/range/cross-field/sensitive validation 和 startup/job-run-start/entry-local/test 生效方式。 | 未闭合不得落 loader。 |
| 变更与回滚 | 必须回 Step 10 补 actor/review/audit、previous validated digest、rollback 边界和不支持 hot reload 的口径。 | 无审计 / rollback 口径不得 release。 |
| 失效模式 | 必须回 Step 11 补 fail-fast/fail-closed/rejected/degraded/delayed/failed marker 语义。 | 不得 silent fallback。 |
| 下游承接 | 必须回 Step 12 给 `05/06/07/09` 输入和不得重复定义边界。 | 下游未承接不得进入实施计划。 |

### 5. 废弃、兼容窗口与移除条件候选思考

| 阶段 | 候选状态 | Loader / validator 候选行为 | 退出条件候选 |
|---|---|---|---|
| 宣告废弃 | `deprecated` | 可接受旧 key,但必须生成 redacted deprecation issue / warning;不得 silent fallback。 | 新旧 key 行为、优先级和安全输出已测试 / 审查。 |
| 兼容窗口 | `deprecated` | old -> new 映射只能按正式优先级工作;old key 不得覆盖更高优先级 new key。 | 旧 key 使用量 / artifact scan / 下游承接显示可退出。 |
| 强制迁移 | `rejected` | old key 从 warning 升级为 validation reject。 | 所有 profile/source 已迁移,rollback 不依赖 old key。 |
| 移除 | `removed` | old key 作为 unknown / removed field reject。 | release note、safe audit、downstream update 和 03 影响检查完成。 |

禁止提供兼容成功窗口的候选:

| 配置 / 行为 | 候选处理 | 原因 |
|---|---|---|
| raw secret / raw body / full sensitive value | 永远 reject | 违反 Step 8 安全红线。 |
| static boundary override | 永远 reject | 配置不得改变 truth owner、state transition、query no-write、outbox source 或 idempotency / replay 不变量。 |
| P0 hot reload / reload key | reject / design-change-required | Step 9~11 已明确 P0 unsupported。 |
| config center / admin override / live override | reject / future design-change-required | 当前无 source priority、audit、rollback、availability contract。 |
| production-like fake / test fixture fallback | reject | 违反 profile isolation。 |
| query repair / write switch | reject | 违反 query no-write。 |
| truth / report / replay rewrite switch | reject | 违反 stored truth、report 和 replay source 边界。 |

### 6. 未来演进候选队列思考

| 演进候选 | 当前状态候选 | 进入条件候选 | 需要回补 |
|---|---|---|---|
| staging-like / production-like profile 实接 | P1/P2 direction | 真实依赖、secret provider 和运维门禁成为目标。 | Step 6 profile、Step 7 item、Step 8 secret、Step 9 validation、Step 12 downstream。 |
| durable store / material product refs | P1/P2 direction | 产品型 store 进入范围。 | product-neutral ref schema、availability、backup/restore、rollback、secret handling;必要时回 `03` adapter constructor。 |
| real publisher / handoff target binding | P1/P2 direction | 真实 transport / target 成为发布或交付目标。 | route / target ref、credential ref、availability、failure marker、ops runbook。 |
| future secret provider | design-change-required if runtime-owned | 需要 adapter 内部解析真实 secret provider。 | provider ref schema、adapter constructor、rotation、health failure、redaction audit;影响 `03` 时先回写。 |
| remote config center | design-change-required | 需要远程配置、中心化回滚或审计。 | source priority、auth、availability、rollback、last-known-good、admin override 边界。 |
| admin override / operator override | design-change-required | 必须有正式 actor/capability/audit/scope 模型。 | 权限、审计、conflict handling、rollback、redaction。 |
| runtime hot reload / online LKG | design-change-required | 需要 zero-downtime config update。 | reload lifecycle、adapter swap、partial failure、LKG storage、digest、query/worker impact。 |
| product observability / alert thresholds | P1/P2 operations | 真实运行 SLO / pager / dashboard 确定。 | 运维 owner、threshold config、alert routing、safe label、runbook。 |

### 7. 03 影响预判

| Step 13 候选结论 | 是否影响 03 | 预判处理 |
|---|---|---|
| 当前无已发布旧配置迁移项 | 否 | 配置版本状态记录,留在 `04`。 |
| 旧 `05/06/07` 和旧主线术语不作为迁移对象 | 否 | 历史材料处理规则,留在 `04` / Step 14 风险。 |
| 新配置必须先回 Step 7~12 完成配置闭合 | 否 | 配置治理规则,不改变 runtime contract。 |
| 废弃 / 移除必须有状态、窗口、safe warning / issue、审计和移除条件 | 通常否 | 若使用现有 validation issue / safe diagnostic surface,留在 `04`。 |
| 迁移需要 loader 同时支持 old/new carrier、alias mapping、public warning DTO 或新 issue schema | 可能是 | 若现有 `03` 未定义对应 surface,先回 `03`。 |
| future secret provider、config center、admin override、hot reload、online LKG | 是且当前越界 | 当前只进 future evolution / Step 14 风险,不得在 P0 实施。 |
| 迁移 evidence、release gate、deployment/runbook 自动化 | 不由 03 处理 | 后移 `05/06/07/09`,Step 13 只给输入方向。 |

### 8. R13.4 写入计划

| R13.4 拟写内容 | 写入边界 |
|---|---|
| SOP 五问候选回答记录 | 固化五问候选回答,不把表标 final。 |
| 当前无迁移项候选记录 | 写清正式 `04` 缺失、runtime schema 未发布、旧材料不可迁移。 |
| 新配置引入规则候选 | 写成回 Step 7~12 / 必要时回 `03` 的流程规则。 |
| 废弃 / 兼容 / 移除候选 | 写状态、loader 行为、窗口、移除条件和禁止兼容项候选。 |
| 未来演进候选 | 汇总 P1/P2 / design-change-required 项,避免污染 P0。 |
| 03 影响预判记录 | 明确当前无回写,以及触发回 `03` 的条件。 |
| R13.5 入口 | 进入迁移与废弃表结构规划:先思考,仍不得创建正式 `04`。 |

### 9. R13.3 stop-review

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只推进 R13.3 一个模块 | pass | 未进入 R13.4 或后续模块。 |
| 是否保持“先思考” | pass | 只写候选回答、候选规则、预判和写入计划。 |
| 是否避免 final 迁移表 | pass | 未把迁移与废弃表标为 final。 |
| 是否未新增配置项 | pass | 新配置只作为流程规则,未新增 key/default/env/profile。 |
| 是否隔离旧材料污染 | pass | 旧 `05/06/07`、旧 MethodContent / publish / snapshot / outbox 不作为迁移来源。 |
| 是否保留 03 回写门禁 | pass | runtime carrier、builder、adapter、port、mapper、DTO、state、flow、error 或 marker 变化必须回 `03`。 |
| 是否可进入 R13.4 | pass | 等待用户确认后进入 Step 13 `R13.4 SOP 五问回答与迁移候选:再写入`。 |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.4 SOP 五问回答与迁移候选:再写入`;只允许把 R13.3 的五问候选回答、当前无已发布旧配置迁移项候选、新配置引入规则候选、废弃 / 兼容 / 移除条件候选、未来演进候选和 03 影响预判写成可恢复记录;不得创建正式 `04-配置设计.md`;不得直接写正式 §13;不得把迁移与废弃表标 final;不得新增未在 Step 7~12 出现的配置项;不得写实施 phase、commit boundary、部署命令、测试 evidence schema 或验收 gate。

---

## R13.4 SOP 五问回答与迁移候选:再写入

### 1. 当前模块状态记录

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R13.5 |
| 本模块目标 | 将 R13.3 的五问候选回答、当前无已发布旧配置迁移项候选、新配置引入规则候选、废弃 / 兼容 / 移除条件候选、未来演进候选和 03 影响预判写成可恢复记录。 |
| 本模块已写入 | SOP 五问候选回答记录、当前无迁移项候选记录、新配置引入规则候选、废弃 / 兼容 / 移除条件候选、未来演进候选、03 影响判定记录和 R13.5 入口。 |
| 本模块未写入 | 未创建正式 `04-配置设计.md`;未写最终迁移与废弃表;未新增配置项;未写测试 TC、验收 gate、实施 phase、commit boundary、部署命令、runbook 或 evidence schema。 |
| 当前恢复口径 | 用户已确认从 R13.3 进入 R13.4;R13.4 完成后等待用户确认进入 R13.5。 |

### 2. SOP 五问候选回答记录

| SOP 问题 | R13.4 记录 | 后续装配注意 |
|---|---|---|
| 是否存在旧配置需要迁移? | 当前候选判断为“无已发布旧配置迁移项”。正式 `04-配置设计.md` 尚未装配,本轮也没有已发布的 L3-method-library runtime config schema 或 config version baseline。 | R13.5 可规划“无 / 无 / 当前无迁移项 / 不适用 / 说明 / 不适用”的表结构,但仍不得标 final。 |
| 新配置如何引入? | 新配置必须先回配置设计 owner 小循环,覆盖动机来源、03 影响、配置项身份、敏感级别、加载校验、生效、变更审计、rollback、失效策略和下游承接。 | 不允许实施侧先加 key;若改变 runtime builder、adapter constructor、port、mapper、DTO、state、flow、error 或 marker source,先回 `03`。 |
| 旧配置如何废弃? | 只有已发布正式配置项才可进入废弃流程;废弃必须具备替代项或 no-replacement reason、状态、兼容窗口、loader 行为、safe warning / issue、审计、敏感 redaction 和移除条件。 | Step 7~12 候选项在 Step 15 前被剔除不等于废弃,不得伪造 deprecated 记录。 |
| 是否需要兼容窗口? | 当前无已发布旧配置,兼容窗口为不适用。未来对已发布 key 的重命名、替换、拆分或合并必须定义窗口或明确 no-compat reason。 | raw secret/body、static boundary override、P0 hot/reload/config center/admin override 等安全或不变量红线只 reject,不提供兼容成功窗口。 |
| 何时允许移除旧配置? | 旧配置已进入 deprecated/rejected 路径、兼容窗口结束、所有 profile/source artifact 不再使用旧 key、下游 `05/06/07/09` 承接完成、rollback 不依赖旧 key、safe audit / digest 可追溯且不改变 `03` 契约后才允许移除。 | 具体 release 日期、迁移脚本、部署批次或自动化工具不在 Step 13 闭口,后移 `07/09` 或 future 设计。 |

### 3. 当前无已发布旧配置迁移项候选记录

| 判断轴 | R13.4 记录 | 裁决候选 |
|---|---|---|
| 正式配置文档 | `projects/L3-method-library/04-配置设计.md` 当前不存在,正式文档只能 Step 15 装配。 | 不存在已发布正式 `04` 基线。 |
| runtime config schema | Step 7~12 是中间产物,尚未装配为正式 schema。 | 不存在已发布 runtime config schema 迁移对象。 |
| 旧 `05/06/07` | 旧下游材料只作方向输入,且含旧 MethodContent / publish / snapshot / outbox 污染风险。 | 不作为旧配置迁移来源。 |
| 旧正向主线术语 | MethodContent、publish、snapshot、outbox 等旧口径可能与当前 `03/04` owner 边界冲突。 | 只能进入风险 / 污染记录,不得变成 alias 或 deprecated key。 |
| Step 7~12 候选项 | 当前仍是本轮候选中间产物。 | 候选项调整不是正式迁移 / 废弃。 |

R13.5 表结构规划时应保留的候选表述:

```text
当前无已发布旧配置迁移项。原因是本轮正式 04 尚未装配,也没有已发布 L3-method-library runtime config schema;旧 05/06/07 和旧主线术语不作为迁移对象。
```

### 4. 新配置引入规则候选记录

| 引入检查 | R13.4 规则候选 | 不满足时处理 |
|---|---|---|
| 动机来源 | 必须指向正式 `00/01/02/03`、已确认配置 Step 缺口、下游承接缺口或 Step 14 风险。 | 只记风险 / 待确认,不得进入实施。 |
| 03 影响 | 检查是否改变 runtime config carrier、builder、adapter constructor、port、mapper、DTO、state、flow、error 或 marker source。 | 命中则先回 `03` owning Step。 |
| 配置项身份 | 必须回 Step 7 补类型、默认值、必填、来源、作用域、生效方式、敏感级别、失败策略和关联模块。 | 未补齐不得成为正式配置项。 |
| 敏感与输出 | 必须回 Step 8 标 public/internal/sensitive/secret,并确认 no raw secret/body、redacted digest 和 safe issue/ref。 | 未标注不得启用。 |
| 加载与生效 | 必须回 Step 9 补 parse/type/range/cross-field/sensitive validation 和 startup/job-run-start/entry-local/test 生效方式。 | 未闭合不得落 loader。 |
| 变更与回滚 | 必须回 Step 10 补 actor/review/audit、previous validated digest、rollback 边界和不支持 hot reload 的口径。 | 无审计 / rollback 口径不得 release。 |
| 失效模式 | 必须回 Step 11 补 fail-fast/fail-closed/rejected/degraded/delayed/failed marker 语义。 | 不得 silent fallback。 |
| 下游承接 | 必须回 Step 12 给 `05/06/07/09` 输入和不得重复定义边界。 | 下游未承接不得进入实施计划。 |

### 5. 废弃、兼容窗口与移除条件候选记录

| 阶段 | 状态候选 | Loader / validator 行为候选 | 退出条件候选 |
|---|---|---|---|
| 宣告废弃 | `deprecated` | 可接受旧 key,但必须生成 redacted deprecation issue / warning;不得 silent fallback。 | 新旧 key 行为、优先级和安全输出已测试 / 审查。 |
| 兼容窗口 | `deprecated` | old -> new 映射只能按正式优先级工作;old key 不得覆盖更高优先级 new key。 | 旧 key 使用量 / artifact scan / 下游承接显示可退出。 |
| 强制迁移 | `rejected` | old key 从 warning 升级为 validation reject。 | 所有 profile/source 已迁移,rollback 不依赖 old key。 |
| 移除 | `removed` | old key 作为 unknown / removed field reject。 | release note、safe audit、downstream update 和 03 影响检查完成。 |

### 6. 禁止兼容成功窗口候选记录

| 配置 / 行为 | 处理候选 | 原因 |
|---|---|---|
| raw secret / raw body / full sensitive value | 永远 reject | 违反 Step 8 安全红线。 |
| static boundary override | 永远 reject | 配置不得改变 truth owner、state transition、query no-write、outbox source 或 idempotency / replay 不变量。 |
| P0 hot reload / reload key | reject / design-change-required | Step 9~11 已明确 P0 unsupported。 |
| config center / admin override / live override | reject / future design-change-required | 当前无 source priority、audit、rollback、availability contract。 |
| production-like fake / test fixture fallback | reject | 违反 profile isolation。 |
| query repair / write switch | reject | 违反 query no-write。 |
| truth / report / replay rewrite switch | reject | 违反 stored truth、report 和 replay source 边界。 |

### 7. 未来演进候选记录

| 演进候选 | 当前状态候选 | 进入条件候选 | 需要回补 |
|---|---|---|---|
| staging-like / production-like profile 实接 | P1/P2 direction | 真实依赖、secret provider 和运维门禁成为目标。 | Step 6 profile、Step 7 item、Step 8 secret、Step 9 validation、Step 12 downstream。 |
| durable store / material product refs | P1/P2 direction | 产品型 store 进入范围。 | product-neutral ref schema、availability、backup/restore、rollback、secret handling;必要时回 `03` adapter constructor。 |
| real publisher / handoff target binding | P1/P2 direction | 真实 transport / target 成为发布或交付目标。 | route / target ref、credential ref、availability、failure marker、ops runbook。 |
| future secret provider | design-change-required if runtime-owned | 需要 adapter 内部解析真实 secret provider。 | provider ref schema、adapter constructor、rotation、health failure、redaction audit;影响 `03` 时先回写。 |
| remote config center | design-change-required | 需要远程配置、中心化回滚或审计。 | source priority、auth、availability、rollback、last-known-good、admin override 边界。 |
| admin override / operator override | design-change-required | 必须有正式 actor/capability/audit/scope 模型。 | 权限、审计、conflict handling、rollback、redaction。 |
| runtime hot reload / online LKG | design-change-required | 需要 zero-downtime config update。 | reload lifecycle、adapter swap、partial failure、LKG storage、digest、query/worker impact。 |
| product observability / alert thresholds | P1/P2 operations | 真实运行 SLO / pager / dashboard 确定。 | 运维 owner、threshold config、alert routing、safe label、runbook。 |

### 8. 03 影响判定记录

| Step 13 候选结论 | 是否影响 03 | R13.4 处理状态 |
|---|---|---|
| 当前无已发布旧配置迁移项 | 否 | 配置版本状态记录,留在 `04`。 |
| 旧 `05/06/07` 和旧主线术语不作为迁移对象 | 否 | 历史材料处理规则,留在 `04` / Step 14 风险。 |
| 新配置必须先回 Step 7~12 完成配置闭合 | 否 | 配置治理规则,不改变 runtime contract。 |
| 废弃 / 移除必须有状态、窗口、safe warning / issue、审计和移除条件 | 通常否 | 若使用现有 validation issue / safe diagnostic surface,留在 `04`。 |
| 迁移需要 loader 同时支持 old/new carrier、alias mapping、public warning DTO 或新 issue schema | 可能是 | 若现有 `03` 未定义对应 surface,先回 `03`。 |
| future secret provider、config center、admin override、hot reload、online LKG | 是且当前越界 | 当前只进 future evolution / Step 14 风险,不得在 P0 实施。 |
| 迁移 evidence、release gate、deployment/runbook 自动化 | 不由 03 处理 | 后移 `05/06/07/09`,Step 13 只给输入方向。 |

### 9. R13.5 入口记录

| 下一模块 | 入口条件 | 允许内容 | 禁止内容 |
|---|---|---|---|
| R13.5 迁移与废弃表结构规划:先思考 | 用户确认进入 R13.5。 | 思考迁移与废弃表结构、列语义、当前无迁移项行、状态词表、未来演进行候选分组、03 影响预判和 R13.6 写入计划。 | 不创建正式 `04-配置设计.md`;不直接写正式 §13;不把迁移与废弃表标 final;不新增配置项;不写测试 TC、验收 gate、实施 phase、commit boundary、部署命令或 evidence schema。 |

### 10. R13.4 stop-review

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只固化 R13.3 候选思考 | pass | 未进入 R13.5 或后续模块。 |
| 是否保留“再写入”边界 | pass | 已写成可恢复记录,未装配正式 `04`。 |
| 是否避免 final 迁移表 | pass | 只记录候选与后续表结构规划入口。 |
| 是否未新增配置项 | pass | 新配置只作为引入规则,未写 key/default/env/profile。 |
| 是否隔离旧材料污染 | pass | 旧 `05/06/07`、旧 MethodContent / publish / snapshot / outbox 不作为迁移来源。 |
| 是否保留 03 回写门禁 | pass | runtime carrier、builder、adapter、port、mapper、DTO、state、flow、error 或 marker 变化必须回 `03`。 |
| 是否可进入 R13.5 | pass | 等待用户确认后进入 Step 13 `R13.5 迁移与废弃表结构规划:先思考`。 |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.5 迁移与废弃表结构规划:先思考`;只允许思考迁移与废弃表结构、列语义、当前无迁移项行、状态词表、未来演进行候选分组、03 影响预判和 R13.6 写入计划;不得创建正式 `04-配置设计.md`;不得直接写正式 §13;不得把迁移与废弃表标 final;不得新增未在 Step 7~12 出现的配置项;不得写实施 phase、commit boundary、部署命令、测试 evidence schema 或验收 gate。

---

## R13.5 迁移与废弃表结构规划:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R13.6 |
| 本模块目标 | 思考迁移与废弃表结构、列语义、当前无迁移项候选行、状态词表、未来演进行候选分组、03 影响预判和 R13.6 写入计划。 |
| 本模块允许 | 只规划 Step 13 后续迁移与废弃表结构、候选行形态、状态词表、辅助表分组和写入顺序。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不直接写正式 §13;不把迁移与废弃表标 final;不新增配置项;不写测试 TC、验收 gate、实施 phase、commit boundary、部署命令、runbook 或 evidence schema。 |
| 恢复依据 | R13.4 已固化五问候选回答、当前无已发布旧配置迁移项候选、新配置引入规则候选、废弃 / 兼容 / 移除条件候选、未来演进候选、03 影响判定和 R13.5 入口。 |

### 2. 主迁移与废弃表结构思考

| 列 | 列语义候选 | 填写约束 |
|---|---|---|
| 旧配置 | 已发布旧 key / 旧配置组 / 旧配置能力。当前无已发布旧配置时填 `无`。 | 不得填 Step 7~12 未发布候选项;不得填旧 `05/06/07` 草案术语。 |
| 新配置 | 替代 key / 新配置组 / 替代能力。当前无迁移项时填 `无`。 | 不得借此新增未闭合配置项;新增配置必须回 Step 7~12。 |
| 状态 | 当前迁移状态,例如 `当前无迁移项`、`introduced`、`deprecated`、`rejected`、`removed`、`design-change-required`。 | 状态必须来自 Step 13 状态词表,不得用自由文本替代。 |
| 兼容窗口 | 旧配置可被接受的窗口或 `不适用` / `不提供兼容窗口`。 | 新增 / 废弃配置必须说明窗口;安全红线只能 reject。 |
| 迁移策略 | old -> new 映射、reject 规则、warning / issue、下游承接或当前无迁移原因。 | 不写脚本、命令、release train、TC-ID 或 evidence schema。 |
| 移除条件 | 允许 removed / reject / no-longer-support 的条件。当前无迁移项时填 `不适用`。 | 必须包含下游承接、rollback 不依赖旧 key、03 不受影响等候选条件。 |

### 3. 当前无迁移项候选行思考

R13.6 可写入一行候选,但仍不标 final:

| 旧配置 | 新配置 | 状态 | 兼容窗口 | 迁移策略 | 移除条件 |
|---|---|---|---|---|---|
| 无 | 无 | 当前无迁移项 | 不适用 | 当前尚未装配正式 `04-配置设计.md`,也没有已发布 L3-method-library runtime config schema;旧 `05/06/07` 和旧 MethodContent / publish / snapshot / outbox 不作为迁移对象。 | 不适用 |

该候选行的风险点:

| 风险点 | 思考结论 |
|---|---|
| 是否把旧草案误判为旧配置 | 不允许。旧 `05/06/07` 只作为污染风险和下游重启线索。 |
| 是否遗漏已发布 runtime schema | 当前未发现正式已发布 schema;若后续发现,必须回 Step 13 重新规划迁移表。 |
| 是否把 Step 7~12 候选剔除当废弃 | 不允许。正式 `04` 装配前的候选收口不是 published deprecation。 |

### 4. 状态词表结构思考

| 状态 | 含义候选 | Loader / validator 行为候选 | 下游承接候选 |
|---|---|---|---|
| `当前无迁移项` | 首版配置尚未发布旧基线。 | 不适用。 | Step 15 装配时说明无迁移项。 |
| `introduced` | 新配置已设计闭合,进入正式配置但旧版本无对应项。 | 按新 schema parse / validate。 | `05/06/07/09` 引用新配置输入。 |
| `deprecated` | 旧配置仍处兼容窗口。 | 可接受旧 key,但输出 redacted warning / issue;不得 silent fallback。 | 测试 / 验收 / 运维承接 warning 与迁移提示。 |
| `rejected` | 旧配置或不支持能力必须拒绝。 | validation reject / fail-fast / entry rejected / job rejected。 | negative 场景后移 `05/06`,操作提示后移 `09`。 |
| `removed` | 旧配置已过窗口且不可再使用。 | unknown / removed field reject。 | release note / 运维提示后移下游。 |
| `design-change-required` | 需要改变 `03` 或架构契约。 | 不进入 runtime schema。 | 先回 `03` / 架构 / Step 14 风险。 |

状态词表边界:

| 边界 | 思考结论 |
|---|---|
| `deprecated` 不等于 silent fallback | 必须有 warning / issue、审计和移除路径。 |
| `introduced` 不等于 Step 13 新增配置项 | 新配置身份必须先由 Step 7~12 闭合。 |
| `design-change-required` 不等于 P0 允许实现 | 只能作为 future / risk,不得进入当前 P0。 |

### 5. 未来演进行候选分组思考

| 分组 | 候选行来源 | 表结构处理 |
|---|---|---|
| P1/P2 profile 实接 | staging-like / production-like profile 实接。 | 不进入当前迁移主表 final 行;后续可进入 future evolution table。 |
| durable product refs | durable store / material product refs。 | 作为 future evolution,需回 Step 7~11 和可能的 `03` adapter constructor。 |
| real publisher / handoff | real transport / target binding。 | 作为 future evolution,不得提前写 topic / URL / credential。 |
| secret provider | future secret provider。 | `design-change-required` 候选,涉及 adapter constructor / rotation / health 时回 `03`。 |
| config center / admin override / hot reload / online LKG | 远程配置、操作员覆盖、热更新、在线 LKG。 | `design-change-required`;当前 P0 reject,进入 Step 14 风险。 |
| product observability / alert thresholds | 真实运行 SLO / pager / dashboard 相关配置。 | 运维 P1/P2 方向,不得在 Step 13 写产品或阈值。 |

### 6. 表结构写入顺序思考

| 顺序 | R13.6 拟写结构 | 理由 |
|---|---|---|
| 1 | 主迁移与废弃表列语义记录。 | 先固定列语义,避免后续行含义漂移。 |
| 2 | 当前无迁移项候选行。 | 满足 SOP “暂无迁移也必须说明”。 |
| 3 | 状态词表候选。 | 固定 `introduced/deprecated/rejected/removed/design-change-required` 的语义。 |
| 4 | 禁止兼容成功窗口映射。 | 防止安全红线被写成兼容迁移。 |
| 5 | 未来演进行候选分组。 | 把 P1/P2 / design-change-required 与当前 P0 切开。 |
| 6 | 03 影响判定和 R13.7 入口。 | 保留详细设计回写门禁并进入下一模块。 |

### 7. 03 影响预判

| 表结构结论 | 是否影响 03 | 思考结论 |
|---|---|---|
| 仅规划主迁移表列语义 | 否 | 属于 `04` 表达结构。 |
| 写当前无迁移项候选行 | 否 | 配置版本状态说明,不改变 runtime contract。 |
| 状态词表仅定义文档状态语义 | 否 | 不改变 loader / validator contract。 |
| 要求 runtime 输出新的 public deprecation DTO / warning schema | 可能是 | 若现有 `03` 未定义,必须回 `03`。 |
| future config center / hot reload / secret provider 成功路径 | 是且当前越界 | 只作 future / risk,不得进入 P0。 |

### 8. R13.6 写入计划

| R13.6 拟写内容 | 写入边界 |
|---|---|
| 主表列语义记录 | 固化 `旧配置 / 新配置 / 状态 / 兼容窗口 / 迁移策略 / 移除条件` 的列义。 |
| 当前无迁移项候选行 | 写为候选记录,不标 final。 |
| 状态词表记录 | 写入状态含义、loader 行为候选和下游承接候选。 |
| 未来演进行分组记录 | 写 P1/P2 与 design-change-required 分组,不写产品细节。 |
| 03 影响判定记录 | 写当前无回写和触发回 `03` 条件。 |
| R13.7 入口 | 进入迁移证据 / 下游承接 / 停审规划:先思考。 |

### 9. R13.5 stop-review

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只推进 R13.5 一个模块 | pass | 未进入 R13.6。 |
| 是否保持“先思考” | pass | 只规划结构、列义、候选行和写入计划。 |
| 是否避免 final 迁移表 | pass | 当前无迁移项行仍是候选。 |
| 是否未新增配置项 | pass | 未写 key/default/env/profile。 |
| 是否隔离旧材料污染 | pass | 旧 `05/06/07` 和旧主线术语不作为迁移来源。 |
| 是否保留 03 回写门禁 | pass | 新 public surface、runtime carrier、builder、adapter、port、mapper、DTO、state、flow、error 变化回 `03`。 |
| 是否可进入 R13.6 | pass | 等待用户确认后进入 Step 13 `R13.6 迁移与废弃表结构规划:再写入`。 |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.6 迁移与废弃表结构规划:再写入`;只允许把 R13.5 的主迁移与废弃表列语义、当前无迁移项候选行、状态词表、未来演进行候选分组、03 影响预判和 R13.7 入口写成可恢复记录;不得创建正式 `04-配置设计.md`;不得直接写正式 §13;不得把迁移与废弃表标 final;不得新增未在 Step 7~12 出现的配置项;不得写实施 phase、commit boundary、部署命令、测试 evidence schema 或验收 gate。

---

## R13.6 迁移与废弃表结构规划:再写入

### 1. 当前模块状态记录

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R13.7 |
| 本模块目标 | 将 R13.5 的主迁移与废弃表列语义、当前无迁移项候选行、状态词表、禁止兼容成功窗口、未来演进行候选分组、03 影响预判和 R13.7 入口写成可恢复记录。 |
| 本模块已写入 | 主迁移与废弃表列语义记录、当前无迁移项候选行记录、状态词表记录、禁止兼容成功窗口记录、未来演进行候选分组记录、03 影响判定记录和 R13.7 入口。 |
| 本模块未写入 | 未创建正式 `04-配置设计.md`;未直接写正式 §13;未把迁移与废弃表标 final;未新增配置项;未写测试 TC、验收 gate、实施 phase、commit boundary、部署命令、runbook 或 evidence schema。 |
| 当前恢复口径 | 用户已确认从 R13.5 进入 R13.6;R13.6 完成后等待用户确认进入 R13.7。 |

### 2. 主迁移与废弃表列语义记录

| 列 | R13.6 记录语义 | 填写约束 |
|---|---|---|
| 旧配置 | 已发布旧 key、旧配置组或旧配置能力。当前无已发布旧配置时填 `无`。 | 不得填 Step 7~12 未发布候选项;不得填旧 `05/06/07` 草案术语;不得把旧 MethodContent / publish / snapshot / outbox 当成旧配置。 |
| 新配置 | 替代 key、新配置组或替代能力。当前无迁移项时填 `无`。 | 不得借此新增未闭合配置项;新增配置必须回 Step 7~12,涉及 runtime contract 时先回 `03`。 |
| 状态 | 配置演进状态,必须来自本 Step 状态词表。 | 允许值候选为 `当前无迁移项`、`introduced`、`deprecated`、`rejected`、`removed`、`design-change-required`;不得用自由文本替代状态。 |
| 兼容窗口 | 旧配置可被接受的窗口,或 `不适用` / `不提供兼容窗口`。 | 新增 / 废弃配置必须说明窗口;安全红线和不支持能力只能 reject 或 design-change-required。 |
| 迁移策略 | old -> new 映射、reject 规则、warning / issue、下游承接方向或当前无迁移原因。 | 不写迁移脚本、部署命令、release train、TC-ID、fixture、report 或 evidence schema。 |
| 移除条件 | 允许 removed、reject 或 no-longer-support 的条件。当前无迁移项时填 `不适用`。 | 未来正式移除必须包含下游承接、rollback 不依赖旧 key、safe audit / digest 可追溯和 03 不受影响等条件。 |

### 3. 当前无迁移项候选行记录

| 旧配置 | 新配置 | 状态 | 兼容窗口 | 迁移策略 | 移除条件 |
|---|---|---|---|---|---|
| 无 | 无 | 当前无迁移项 | 不适用 | 当前尚未装配正式 `04-配置设计.md`,也没有已发布 L3-method-library runtime config schema;旧 `05/06/07` 和旧 MethodContent / publish / snapshot / outbox 不作为迁移对象。 | 不适用 |

说明:

| 判断点 | R13.6 记录 |
|---|---|
| 候选性质 | 该行是 Step 13 中间产物候选,不等于正式 §13 final 行;正式写入只能在 Step 15 装配时完成。 |
| 旧材料处理 | 旧 `05/06/07` 只作为污染风险和下游重启线索,不得成为 alias、deprecated key、compat source 或 migration source。 |
| 候选项调整 | Step 7~12 候选在正式 `04` 装配前被剔除,属于候选收口,不是 published deprecation。 |
| 发现旧 schema 时 | 若后续发现已发布 L3-method-library runtime config schema,必须回 Step 13 重新规划迁移表,不得沿用“当前无迁移项”。 |

### 4. 状态词表记录

| 状态 | 含义 | Loader / validator 行为候选 | 下游承接 |
|---|---|---|---|
| `当前无迁移项` | 首版配置尚未发布旧基线,当前没有旧配置迁移对象。 | 不适用。 | Step 15 装配时说明无迁移项。 |
| `introduced` | 新配置已由 Step 7~12 设计闭合并进入正式配置,旧版本无对应项。 | 按新 schema parse / validate。 | `05/06/07/09` 引用新配置输入。 |
| `deprecated` | 已发布旧配置仍处兼容窗口。 | 可接受旧 key,但必须输出 redacted warning / issue;不得 silent fallback。 | 测试、验收、实施、运维承接 warning 与迁移提示。 |
| `rejected` | 旧配置或不支持能力必须拒绝。 | validation reject、fail-fast、entry rejected 或 job rejected。 | negative 场景后移 `05/06`,操作提示后移 `09`。 |
| `removed` | 旧配置已过窗口且不可再使用。 | unknown / removed field reject。 | release note、运维提示和下游清理后移对应文档。 |
| `design-change-required` | 需要改变 `03` 或架构契约,不能作为当前 runtime schema 直接落地。 | 不进入当前 P0 runtime schema。 | 先回 `03`、架构或 Step 14 风险。 |

状态边界:

| 边界 | R13.6 记录 |
|---|---|
| `deprecated` | 不等于 silent fallback;必须有 warning / issue、审计和移除路径。 |
| `introduced` | 不等于 Step 13 直接新增配置项;配置身份必须先由 Step 7~12 闭合。 |
| `design-change-required` | 不等于 P0 允许实现;只能作为 future / risk,不得绕过 `03` 和架构门禁。 |

### 5. 禁止兼容成功窗口记录

| 配置 / 行为 | R13.6 处理 | 原因 |
|---|---|---|
| raw secret / raw body / full sensitive value | 永远 reject | 违反 Step 8 安全红线。 |
| static boundary override | 永远 reject | 配置不得改变 truth owner、state transition、query no-write、outbox source 或 idempotency / replay 不变量。 |
| P0 hot reload / reload key | reject / design-change-required | Step 9~11 已明确 P0 unsupported。 |
| config center / admin override / live override | reject / future design-change-required | 当前无 source priority、audit、rollback、availability contract。 |
| production-like fake / test fixture fallback | reject | 违反 profile isolation。 |
| query repair / write switch | reject | 违反 query no-write。 |
| truth / report / replay rewrite switch | reject | 违反 stored truth、report 和 replay source 边界。 |

### 6. 未来演进行候选分组记录

| 分组 | 候选行来源 | R13.6 处理 |
|---|---|---|
| P1/P2 profile 实接 | staging-like / production-like profile 实接。 | 不进入当前迁移主表 final 行;未来进入配置设计小循环。 |
| durable product refs | durable store / material product refs。 | 作为 future evolution,需回 Step 7~11 和可能的 `03` adapter constructor。 |
| real publisher / handoff | real transport / target binding。 | 作为 future evolution,不得提前写 topic、URL、credential 或 product target。 |
| secret provider | future secret provider。 | `design-change-required` 候选;涉及 adapter constructor、rotation、health 时回 `03`。 |
| config center / admin override / hot reload / online LKG | 远程配置、操作员覆盖、热更新、在线 LKG。 | `design-change-required`;当前 P0 reject,进入 Step 14 风险。 |
| product observability / alert thresholds | 真实运行 SLO、pager、dashboard 相关配置。 | 运维 P1/P2 方向,不得在 Step 13 写产品或阈值。 |

### 7. 03 影响判定记录

| R13.6 结论 | 是否影响 03 | 处理状态 |
|---|---|---|
| 固化主迁移与废弃表列语义 | 否 | 属于 `04` 表达结构,不回写 `03`。 |
| 写当前无迁移项候选行 | 否 | 配置版本状态说明,不改变 runtime contract。 |
| 状态词表仅定义文档状态语义 | 否 | 不改变 loader、validator、DTO、port 或 marker source。 |
| 禁止兼容成功窗口 | 否 | 延续 Step 8~11 安全红线和 failure boundary。 |
| 未来演进行分组 | 当前否 | 只作 future / risk;若进入 runtime carrier、builder、adapter、port、mapper、DTO、state、flow、error 或 public deprecation surface,必须先回 `03`。 |
| migration evidence、release gate、deployment/runbook 自动化 | 否,且不属 Step 13 | 后移 `05/06/07/09`,不得在本 Step 补口。 |

### 8. R13.7 入口记录

| 下一模块 | 入口条件 | 允许内容 | 禁止内容 |
|---|---|---|---|
| R13.7 迁移证据 / 下游承接 / 停审规划:先思考 | 用户确认进入 R13.7。 | 思考当前无迁移项如何在后续正式 §13 被证明、下游 `05/06/07/09` 需要承接哪些迁移 / 废弃方向、哪些内容必须停审或回 `03` / Step 14。 | 不创建正式 `04-配置设计.md`;不直接写正式 §13;不写 TC-ID、fixture、assertion、report、acceptance gate、phase、commit boundary、部署命令或 runbook;不把当前候选表标 final。 |

### 9. R13.6 stop-review

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只推进 R13.6 一个模块 | pass | 未进入 R13.7 内容正文。 |
| 是否保留“再写入”边界 | pass | 只固化 R13.5 已确认结构,未新增配置项。 |
| 是否满足 SOP 暂无迁移说明 | pass | 已写当前无迁移项候选行和说明。 |
| 是否避免 final 迁移表 | pass | 明确候选性质,正式 §13 只能 Step 15 装配。 |
| 是否隔离旧材料污染 | pass | 旧 `05/06/07` 和旧 MethodContent / publish / snapshot / outbox 不作为迁移来源。 |
| 是否保留 03 回写门禁 | pass | runtime carrier、builder、adapter、port、mapper、DTO、state、flow、error 或 public surface 变化必须回 `03`。 |
| 是否可进入 R13.7 | pass | 等待用户确认后进入 Step 13 `R13.7 迁移证据 / 下游承接 / 停审规划:先思考`。 |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.7 迁移证据 / 下游承接 / 停审规划:先思考`;只允许思考当前无迁移项证明方式、下游承接范围、停审 / 回写 `03` 条件和 R13.8 写入计划;不得创建正式 `04-配置设计.md`;不得直接写正式 §13;不得把迁移与废弃表标 final;不得新增未在 Step 7~12 出现的配置项;不得写测试 TC、fixture、assertion、验收 gate、实施 phase、commit boundary、部署命令、runbook 或 evidence schema。

---

## R13.7 迁移证据 / 下游承接 / 停审规划:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R13.8 |
| 本模块目标 | 思考当前无迁移项的证明口径、后续下游承接范围、停审 / 回写 `03` 条件和 R13.8 写入计划。 |
| 本模块允许 | 只规划证明来源、不可用证明、下游 owner 承接方向、停审检查项、03 影响预判和下一模块写入结构。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不直接写正式 §13;不把迁移与废弃表标 final;不写 TC-ID、fixture、assertion、report、acceptance gate、phase、commit boundary、部署命令、runbook 或 evidence schema。 |
| 恢复依据 | R13.6 已固化主迁移与废弃表列语义、当前无迁移项候选行、状态词表、禁止兼容成功窗口、未来演进行候选分组、03 影响判定和 R13.7 入口。 |

### 2. 当前无迁移项证明口径思考

R13.7 里的“证据”只指设计讨论中的证明口径,不是测试方案的 run artifact、fixture、assertion 或 evidence schema。

| 证明对象 | 可用证明来源候选 | R13.8 写入注意 |
|---|---|---|
| 正式 `04` 尚未发布 | `projects/L3-method-library/04-配置设计.md` 当前不存在,且 flow 仍要求 Step 15 才能装配正式 `04`。 | 可作为当前无已发布配置基线的主要证明。 |
| 无已发布 runtime config schema | Step 7~12 仍是中间产物候选;当前没有正式 runtime config version baseline 或已发布 schema 文档。 | 写成“当前未发现已发布 schema”,不得写成永久事实。 |
| 旧 `05/06/07` 不可作为旧配置 | 项目台账和 Step 12/13 已将旧下游材料定位为 old_direction_input / 污染风险。 | 必须明确旧 MethodContent / publish / snapshot / outbox 不成为 alias、deprecated key 或 compat source。 |
| Step 7~12 候选项不是 published config | 正式 `04` 未装配前,候选项被调整或剔除只属于候选收口。 | 不得把候选剔除写成 removed / deprecated。 |
| 当前主表无迁移项行成立 | R13.6 已形成 `无 / 无 / 当前无迁移项 / 不适用 / 说明 / 不适用` 候选行。 | R13.8 只能固化证明口径,仍不得标 final。 |

### 3. 不可用证明与误用防线思考

| 不可用来源 | 禁止原因 | 处理口径 |
|---|---|---|
| 旧 `05-测试方案.md` 的 TC、fixture、evidence 片段 | 旧下游材料不是当前配置真相源。 | 只能作为污染风险,不得作为“旧配置已发布”的证据。 |
| 旧 `06-验收标准.md` 的门禁或 release 语句 | 旧验收标准可能绑定旧主线,且当前 `06` 尚未重启。 | 不得反向定义配置迁移状态。 |
| 旧 `07-实施计划.md` 的 phase / commit 边界 | 旧实施计划不是当前 config schema 来源。 | 不得作为迁移窗口、移除条件或 implementation boundary。 |
| 实现仓代码或临时脚本 | Step 13 是设计源闭合,不能由实现状态反推配置契约。 | 若实现需要旧 / 新兼容,必须回 `04` / `03`。 |
| agent 记忆或未落文档讨论 | 不可恢复、不可审计。 | 必须写入中间产物或正式文档后才可作为设计输入。 |
| 自造 run-scoped evidence schema | 属 `05` 测试方案 owner,Step 13 不定义。 | 后移 `05`,当前只写证明方向。 |

### 4. 下游承接范围思考

| 下游文档 | Step 13 可提供的迁移 / 废弃输入候选 | Step 13 禁止越界 |
|---|---|---|
| `05-测试方案.md` | 当前无迁移项证明口径、未来 deprecated / rejected / removed 的测试主题方向、旧材料污染防护输入。 | 不写 TC-ID、suite、fixture、assertion item、run artifact 或 evidence schema。 |
| `06-验收标准.md` | 无 silent fallback、无 raw secret/body、无未说明删除、旧配置 reject / deprecated 必须 safe output 的验收方向。 | 不写 acceptance gate 编号、通过阈值、release 裁决或签署流程。 |
| `07-实施计划.md` | 未来实施前必须读取迁移表、确认无自行 alias、无私补 old/new carrier、发现 design-change-required 必须回设计。 | 不写 phase、commit boundary、allowed_scope、required_checks 或 implementation ledger。 |
| `09-部署与运维手册.md` | 未来废弃 / 移除的运维提示方向、profile/source artifact 清理方向、rollback 不依赖旧 key 的运行说明方向。 | 不写部署命令、产品选型、SLO、pager、dashboard、真实 endpoint 或 runbook。 |

承接边界候选:

| 边界 | 思考结论 |
|---|---|
| 下游只能引用 `04` 的迁移 / 废弃状态 | 不得反向新增配置 key、默认值、来源优先级、兼容窗口或移除条件。 |
| 下游发现需要测试或验收旧 key | 先回 Step 13 判定是否存在 published old config;不得在 `05/06` 自行新增 deprecated key。 |
| 下游发现需要实现兼容 alias | 先回 Step 7~11 和 `03` 判断 loader / builder / DTO / issue surface 是否闭合。 |
| 下游发现需要运维命令或产品绑定 | 后移 `09` owner;若需要新配置项或 secret provider,回 `04` / `03`。 |

### 5. 停审与回写条件思考

| 条件 | 候选处理 |
|---|---|
| 后续发现已发布 L3-method-library config schema / config version baseline | 停审,回 Step 13 重新建立迁移与废弃表,不得沿用“当前无迁移项”。 |
| 后续发现旧 `05/06/07` 中存在已被正式发布的配置契约 | 停审,先确认权威来源;若属正式旧配置,回 Step 13 重开迁移行。 |
| 新配置引入需要 runtime builder、adapter constructor、port、mapper、DTO、state、flow、error 或 marker source | 停审并回 `03` owning Step。 |
| 迁移需要 loader 同时接受 old/new key、alias mapping 或 public deprecation issue schema | 先回 Step 7~11 和 `03`;当前 Step 13 不自行补实现口。 |
| 下游要求 TC、gate、phase、commit boundary、deployment command 或 runbook | 不回 `03`,但停留在下游 owner;Step 13 只提供输入方向。 |
| future config center / admin override / hot reload / online LKG 被要求进入当前 P0 | 停审,进入 Step 14 风险或回架构 / `03`,不得纳入当前配置迁移表。 |

### 6. Step 13 收口候选条件思考

| 收口条件 | 当前思考 |
|---|---|
| SOP 五问已回答 | R13.4 已形成五问候选回答,R13.6 已转成主表结构候选。 |
| 暂无迁移已说明 | R13.6 已写当前无迁移项候选行,R13.7 补证明口径。 |
| 新增 / 废弃规则已限定 | 新配置必须回 Step 7~12,影响 runtime contract 时回 `03`;废弃必须有状态、窗口、策略和移除条件。 |
| 下游承接边界清楚 | Step 12 已定义 `05/06/07/09` owner,R13.7 只补迁移 / 废弃相关输入方向。 |
| 03 影响门禁保留 | 当前无迁移项不回写 `03`;任何 runtime contract、public surface、marker source 变化均回 `03`。 |
| 未写正式 `04` | 正式文档仍只能 Step 15 装配。 |

### 7. 03 影响预判

| R13.7 候选结论 | 是否影响 03 | 预判处理 |
|---|---|---|
| 当前无迁移项证明口径 | 否 | 属于 `04` 配置版本说明。 |
| 下游承接迁移 / 废弃输入方向 | 否 | 留在 `04`,后续 `05/06/07/09` 细化。 |
| 停审条件和回 owner 规则 | 否 | 流程门禁,不改变 runtime contract。 |
| loader old/new alias、deprecation issue schema、compat version marker | 可能是 | 若需要正式行为或 public surface,先回 `03`。 |
| hot reload、config center、admin override、online LKG | 是且当前越界 | 只进 Step 14 风险 / future evolution,不得进入 P0。 |

### 8. R13.8 写入计划

| R13.8 拟写内容 | 写入边界 |
|---|---|
| 当前模块状态记录 | 固化 R13.7 的思考状态和未写入范围。 |
| 当前无迁移项证明口径记录 | 写可用证明来源和候选性质,不生成测试 evidence schema。 |
| 不可用证明与误用防线记录 | 写旧材料、实现状态、agent 记忆和自造 evidence 的禁止口径。 |
| 下游承接范围记录 | 写 `05/06/07/09` 迁移 / 废弃输入方向,不写下游正文。 |
| 停审与回写条件记录 | 写发现旧 schema、需要 runtime contract 或下游越界时的处理。 |
| 03 影响判定记录 | 写当前无回写和触发回 `03` 条件。 |
| R13.9 入口 | 进入 Step 13 最终收口判断:先思考。 |

### 9. R13.7 stop-review

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只推进 R13.7 一个模块 | pass | 未进入 R13.8。 |
| 是否保持“先思考” | pass | 只写证明、承接、停审和写入计划候选。 |
| 是否未创建正式 `04` | pass | 正式 `04-配置设计.md` 仍只能 Step 15 装配。 |
| 是否避免测试 / 验收 / 实施 / 运维正文越界 | pass | 未写 TC、fixture、assertion、gate、phase、commit、命令或 runbook。 |
| 是否未新增配置项 | pass | 未新增 key/default/profile/source/secret/failure strategy。 |
| 是否保留 03 回写门禁 | pass | runtime contract、public surface、marker source 变化必须回 `03`。 |
| 是否可进入 R13.8 | pass | 等待用户确认后进入 Step 13 `R13.8 迁移证据 / 下游承接 / 停审规划:再写入`。 |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.8 迁移证据 / 下游承接 / 停审规划:再写入`;只允许把 R13.7 的当前无迁移项证明口径、不可用证明与误用防线、下游承接范围、停审与回写条件、03 影响预判和 R13.9 入口写成可恢复记录;不得创建正式 `04-配置设计.md`;不得直接写正式 §13;不得把迁移与废弃表标 final;不得新增未在 Step 7~12 出现的配置项;不得写测试 TC、fixture、assertion、验收 gate、实施 phase、commit boundary、部署命令、runbook 或 evidence schema。

---

## R13.8 迁移证据 / 下游承接 / 停审规划:再写入

### 1. 当前模块状态记录

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R13.9 |
| 本模块目标 | 将 R13.7 的当前无迁移项证明口径、不可用证明与误用防线、下游承接范围、停审与回写条件、03 影响预判和 R13.9 入口写成可恢复记录。 |
| 本模块已写入 | 当前无迁移项证明口径记录、不可用证明与误用防线记录、下游承接范围记录、停审与回写条件记录、Step 13 收口候选条件、03 影响判定记录和 R13.9 入口。 |
| 本模块未写入 | 未创建正式 `04-配置设计.md`;未直接写正式 §13;未把迁移与废弃表标 final;未写 TC-ID、fixture、assertion、report、验收 gate、实施 phase、commit boundary、部署命令、runbook 或 evidence schema。 |
| 当前恢复口径 | 用户已确认从 R13.7 进入 R13.8;R13.8 完成后等待用户确认进入 R13.9。 |

### 2. 当前无迁移项证明口径记录

R13.8 中的“证明口径”只用于设计讨论和正式 §13 装配时的说明,不等于 `05-测试方案.md` 的 run-scoped evidence、fixture、assertion 或 report schema。

| 证明对象 | 可用证明来源 | R13.8 记录 |
|---|---|---|
| 正式 `04` 尚未发布 | `projects/L3-method-library/04-配置设计.md` 当前不存在,且 flow 要求 Step 15 才能装配正式 `04`。 | 当前没有已发布正式 `04` 可作为旧配置基线。 |
| 无已发布 runtime config schema | Step 7~12 仍是中间产物候选;当前未发现正式 runtime config version baseline 或已发布 schema 文档。 | 当前只能声明“未发现已发布 schema”,不能写成永久事实。 |
| 旧 `05/06/07` 不可作为旧配置 | 项目台账和 Step 12/13 已将旧下游材料定位为 old_direction_input / 污染风险。 | 旧 MethodContent / publish / snapshot / outbox 不成为 alias、deprecated key、compat source 或 migration source。 |
| Step 7~12 候选项不是 published config | 正式 `04` 未装配前,候选项调整或剔除属于候选收口。 | 不得把候选剔除写成 `removed`、`deprecated` 或 `rejected` 的已发布配置迁移事件。 |
| 当前主表无迁移项行成立 | R13.6 已形成 `无 / 无 / 当前无迁移项 / 不适用 / 说明 / 不适用` 候选行。 | 可作为 Step 15 装配正式 §13 的候选输入,但现在仍不标 final。 |

### 3. 不可用证明与误用防线记录

| 不可用来源 | 禁止原因 | R13.8 处理口径 |
|---|---|---|
| 旧 `05-测试方案.md` 的 TC、fixture、evidence 片段 | 旧下游材料不是当前配置真相源。 | 只能作为污染风险线索,不得作为旧配置已发布的证明。 |
| 旧 `06-验收标准.md` 的门禁或 release 语句 | 旧验收标准可能绑定旧主线,且当前 `06` 尚未重启。 | 不得反向定义配置迁移状态、兼容窗口或移除条件。 |
| 旧 `07-实施计划.md` 的 phase / commit 边界 | 旧实施计划不是当前 config schema 来源。 | 不得作为迁移窗口、移除条件、implementation boundary 或 source of truth。 |
| 实现仓代码或临时脚本 | Step 13 是设计源闭合,不能由实现状态反推配置契约。 | 若实现需要 old/new 兼容,必须回 `04` / `03`。 |
| agent 记忆或未落文档讨论 | 不可恢复、不可审计。 | 必须写入中间产物或正式文档后才可作为设计输入。 |
| 自造 run-scoped evidence schema | 属 `05-测试方案.md` owner,Step 13 不定义。 | 后移 `05`;当前只写证明方向和下游承接边界。 |

### 4. 下游承接范围记录

| 下游文档 | Step 13 可提供的迁移 / 废弃输入 | Step 13 禁止越界 |
|---|---|---|
| `05-测试方案.md` | 当前无迁移项证明口径、未来 deprecated / rejected / removed 的测试主题方向、旧材料污染防护输入。 | 不写 TC-ID、suite、fixture、assertion item、run artifact、report 或 evidence schema。 |
| `06-验收标准.md` | no silent fallback、no raw secret/body、no unexplained deletion、旧配置 reject / deprecated 必须 safe output 的验收方向。 | 不写 acceptance gate 编号、通过阈值、release 裁决或签署流程。 |
| `07-实施计划.md` | 未来实施前必须读取迁移表、确认无自行 alias、无私补 old/new carrier、发现 design-change-required 必须回设计。 | 不写 phase、commit boundary、allowed_scope、required_checks 或 implementation ledger。 |
| `09-部署与运维手册.md` | 未来废弃 / 移除的运维提示方向、profile/source artifact 清理方向、rollback 不依赖旧 key 的运行说明方向。 | 不写部署命令、产品选型、SLO、pager、dashboard、真实 endpoint 或 runbook。 |

下游承接边界:

| 边界 | R13.8 记录 |
|---|---|
| 下游只能引用 `04` 的迁移 / 废弃状态 | 不得反向新增配置 key、默认值、来源优先级、兼容窗口或移除条件。 |
| 下游发现需要测试或验收旧 key | 先回 Step 13 判定是否存在 published old config;不得在 `05/06` 自行新增 deprecated key。 |
| 下游发现需要实现兼容 alias | 先回 Step 7~11 和 `03` 判断 loader、builder、DTO、issue surface 是否闭合。 |
| 下游发现需要运维命令或产品绑定 | 后移 `09` owner;若需要新配置项或 secret provider,回 `04` / `03`。 |

### 5. 停审与回写条件记录

| 条件 | R13.8 处理 |
|---|---|
| 后续发现已发布 L3-method-library config schema / config version baseline | 停审,回 Step 13 重新建立迁移与废弃表,不得沿用“当前无迁移项”。 |
| 后续发现旧 `05/06/07` 中存在已被正式发布的配置契约 | 停审,先确认权威来源;若属正式旧配置,回 Step 13 重开迁移行。 |
| 新配置引入需要 runtime builder、adapter constructor、port、mapper、DTO、state、flow、error 或 marker source | 停审并回 `03` owning Step。 |
| 迁移需要 loader 同时接受 old/new key、alias mapping 或 public deprecation issue schema | 先回 Step 7~11 和 `03`;当前 Step 13 不自行补实现口。 |
| 下游要求 TC、gate、phase、commit boundary、deployment command 或 runbook | 不回 `03`,但停留在下游 owner;Step 13 只提供输入方向。 |
| future config center / admin override / hot reload / online LKG 被要求进入当前 P0 | 停审,进入 Step 14 风险或回架构 / `03`,不得纳入当前配置迁移表。 |

### 6. Step 13 收口候选条件记录

| 收口条件 | R13.8 记录 |
|---|---|
| SOP 五问已回答 | R13.4 已形成五问候选回答,R13.6 已转成主表结构候选。 |
| 暂无迁移已说明 | R13.6 已写当前无迁移项候选行,R13.8 已固化证明口径。 |
| 新增 / 废弃规则已限定 | 新配置必须回 Step 7~12,影响 runtime contract 时回 `03`;废弃必须有状态、窗口、策略和移除条件。 |
| 下游承接边界清楚 | Step 12 已定义 `05/06/07/09` owner,R13.8 只补迁移 / 废弃相关输入方向。 |
| 03 影响门禁保留 | 当前无迁移项不回写 `03`;任何 runtime contract、public surface、marker source 变化均回 `03`。 |
| 未写正式 `04` | 正式文档仍只能 Step 15 装配。 |

### 7. 03 影响判定记录

| R13.8 结论 | 是否影响 03 | 处理状态 |
|---|---|---|
| 当前无迁移项证明口径 | 否 | 属于 `04` 配置版本说明,不回写 `03`。 |
| 下游承接迁移 / 废弃输入方向 | 否 | 留在 `04`,后续 `05/06/07/09` 细化。 |
| 停审条件和回 owner 规则 | 否 | 流程门禁,不改变 runtime contract。 |
| loader old/new alias、deprecation issue schema、compat version marker | 可能是 | 若需要正式行为或 public surface,先回 `03`。 |
| hot reload、config center、admin override、online LKG | 是且当前越界 | 只进 Step 14 风险 / future evolution,不得进入 P0。 |

### 8. R13.9 入口记录

| 下一模块 | 入口条件 | 允许内容 | 禁止内容 |
|---|---|---|---|
| R13.9 Step 13 最终收口判断:先思考 | 用户确认进入 R13.9。 | 思考 Step 13 是否满足 SOP 五问、迁移与废弃表结构、当前无迁移项说明、状态词表、下游承接、停审条件、03 影响判定和进入 Step 14 的条件。 | 不创建正式 `04-配置设计.md`;不直接写正式 §13;不把候选表标 final;不写 TC-ID、fixture、assertion、验收 gate、phase、commit boundary、部署命令、runbook 或 evidence schema。 |

### 9. R13.8 stop-review

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只推进 R13.8 一个模块 | pass | 未进入 R13.9。 |
| 是否保留“再写入”边界 | pass | 只固化 R13.7 已确认思考。 |
| 是否未创建正式 `04` | pass | 正式 `04-配置设计.md` 仍只能 Step 15 装配。 |
| 是否避免测试 / 验收 / 实施 / 运维正文越界 | pass | 未写 TC、fixture、assertion、gate、phase、commit、命令、runbook 或 evidence schema。 |
| 是否未新增配置项 | pass | 未新增 key/default/profile/source/secret/failure strategy。 |
| 是否保留 03 回写门禁 | pass | runtime contract、public surface、marker source 变化必须回 `03`。 |
| 是否可进入 R13.9 | pass | 等待用户确认后进入 Step 13 `R13.9 Step 13 最终收口判断:先思考`。 |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.9 Step 13 最终收口判断:先思考`;只允许思考 Step 13 是否满足 SOP 五问、迁移与废弃表结构、当前无迁移项说明、状态词表、下游承接、停审条件、03 影响判定和进入 Step 14 的条件;不得创建正式 `04-配置设计.md`;不得直接写正式 §13;不得把迁移与废弃表标 final;不得新增未在 Step 7~12 出现的配置项;不得写测试 TC、fixture、assertion、验收 gate、实施 phase、commit boundary、部署命令、runbook 或 evidence schema。

---

## R13.9 Step 13 最终收口判断:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R13.10 |
| 本模块目标 | 思考 Step 13 是否满足 SOP 五问、迁移与废弃表结构、当前无迁移项说明、状态词表、下游承接、停审条件、03 影响判定和进入 Step 14 的条件。 |
| 本模块允许 | 只做 Step 13 最终收口判断候选、结构完整性检查、风险 / 待确认转入 Step 14 候选、03 影响预判和 R13.10 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不直接写正式 §13;不把迁移与废弃表标 final;不新增配置项;不写 TC-ID、fixture、assertion、验收 gate、实施 phase、commit boundary、部署命令、runbook 或 evidence schema。 |
| 恢复依据 | R13.8 已固化当前无迁移项证明口径、不可用证明与误用防线、下游承接范围、停审与回写条件、03 影响判定和 R13.9 入口。 |

### 2. SOP 五问满足度思考

| SOP 问题 | 当前候选回答来源 | 收口判断候选 |
|---|---|---|
| 是否存在旧配置需要迁移? | R13.4 当前无已发布旧配置迁移项候选;R13.6 当前无迁移项候选行;R13.8 证明口径。 | pass_candidate。当前无已发布正式 `04` 和 runtime config schema,旧 `05/06/07` 不作为迁移来源。 |
| 新配置如何引入? | R13.4 新配置引入规则候选。 | pass_candidate。新配置必须回 Step 7~12,影响 runtime contract 时先回 `03`。 |
| 旧配置如何废弃? | R13.4 废弃 / 兼容 / 移除候选;R13.6 状态词表。 | pass_candidate。只对已发布正式配置适用,必须有状态、窗口、策略、safe warning / issue 和移除条件。 |
| 是否需要兼容窗口? | R13.4 兼容窗口候选;R13.6 禁止兼容成功窗口。 | pass_candidate。当前无迁移项为不适用;未来新增 / 废弃必须说明窗口或 no-compat reason。 |
| 何时允许移除旧配置? | R13.4 移除条件候选;R13.8 停审与回写条件。 | pass_candidate。须满足下游承接、rollback 不依赖旧 key、safe audit / digest、03 不受影响等条件。 |

### 3. 结构完整性收口思考

| 结构项 | 当前来源 | 收口判断候选 |
|---|---|---|
| 主迁移与废弃表列语义 | R13.6 `旧配置 / 新配置 / 状态 / 兼容窗口 / 迁移策略 / 移除条件` 列义。 | complete_candidate。满足 SOP / 书写规范表结构。 |
| 当前无迁移项候选行 | R13.6 当前无迁移项候选行。 | complete_candidate。满足“暂无迁移也必须说明”。 |
| 状态词表 | R13.6 `当前无迁移项`、`introduced`、`deprecated`、`rejected`、`removed`、`design-change-required`。 | complete_candidate。足以支撑配置新增、废弃、拒绝、移除和设计变更区分。 |
| 禁止兼容成功窗口 | R13.6 raw secret、static boundary override、hot reload、config center、admin override 等拒绝 / design-change-required。 | complete_candidate。防止安全红线被写成兼容迁移。 |
| 未来演进分组 | R13.6 P1/P2 profile、durable refs、real publisher、secret provider、config center、observability 等分组。 | complete_candidate。足以转入 Step 14 风险 / 待确认。 |
| 证明与下游承接 | R13.8 证明口径、不可用证明、下游承接范围、停审条件。 | complete_candidate。足以支撑 Step 15 正式 §13 候选装配。 |

### 4. Step 14 转入候选思考

| 候选风险 / 待确认项 | 转入理由 | R13.10 写入注意 |
|---|---|---|
| 未发现已发布 runtime config schema 的证明依赖当前仓状态 | 当前只能证明“当前未发现”,未来若发现旧 schema 必须回 Step 13。 | 转 Step 14 风险 / 待确认,不写成永久事实。 |
| 旧 `05/06/07` 污染仍存在 | 旧下游材料仍含旧 MethodContent / publish / snapshot / outbox 方向。 | 转 Step 14 风险,提示后续 `05/06/07` 重启继续隔离。 |
| future secret provider / config center / admin override / hot reload / online LKG | 当前均属 design-change-required / future evolution。 | 转 Step 14 风险,不得作为 P0 配置项。 |
| future durable refs / real publisher / product observability | 属 P1/P2 或运维方向,当前不装入 P0。 | 转 Step 14 待确认,必要时回 Step 7~12 和 `03`。 |
| 若未来迁移需要 public deprecation issue schema | 可能影响 `03` public surface / DTO / marker source。 | 转 Step 14 条件风险,触发时回 `03`。 |

### 5. 进入 Step 14 条件思考

| 条件 | 当前判断 |
|---|---|
| 配置演进策略是否明确 | pass_candidate。新增、废弃、兼容、移除、拒绝、design-change-required 均已有候选规则。 |
| 是否存在未回答的 Step 13 SOP 五问 | no_current_gap_candidate。五问均已由 R13.4 / R13.6 / R13.8 覆盖。 |
| 是否存在必须立即回写 `03` 的当前结论 | no_current_gap_candidate。当前无迁移项和文档状态规则不改变 runtime contract。 |
| 是否仍有风险 / 待确认需要记录 | yes_candidate。旧材料污染、未来演进、可能发现旧 schema 等应进入 Step 14。 |
| 是否可创建正式 `04` | no。正式 `04` 仍只能 Step 15 装配。 |
| 是否可直接进入 Step 14 | R13.10 再写入完成并通过 stop-review 后,可等待用户确认进入 Step 14 R14.1。 |

### 6. 03 影响预判

| Step 13 收口候选结论 | 是否影响 03 | 预判处理 |
|---|---|---|
| 当前无已发布旧配置迁移项 | 否 | 留在 `04` 配置版本说明。 |
| 主迁移与废弃表结构、状态词表和无迁移项行 | 否 | 属于 `04` 文档结构和配置演进规则。 |
| 新配置必须回 Step 7~12,必要时回 `03` | 否 | 流程门禁,不改变 runtime contract。 |
| 未来迁移若需要 old/new carrier、alias mapping、public deprecation issue schema 或 marker source | 可能是 | 触发时回 `03` owning Step。 |
| future secret provider、config center、admin override、hot reload、online LKG | 是且当前越界 | 转 Step 14 风险 / future evolution,不得进入 P0。 |

### 7. R13.10 写入计划

| R13.10 拟写内容 | 写入边界 |
|---|---|
| 当前模块状态记录 | 固化 R13.9 的收口判断思考状态。 |
| SOP 五问满足度记录 | 写五问回答来源和 pass_candidate 判断。 |
| 结构完整性收口记录 | 写主表、无迁移行、状态词表、禁止兼容、未来演进、证明与下游承接的完整性。 |
| Step 14 转入候选记录 | 写风险 / 待确认项进入 Step 14 的候选列表。 |
| 进入 Step 14 条件记录 | 写 R13.10 完成后可等待确认进入 Step 14 R14.1 的条件。 |
| 03 影响判定记录 | 写当前无回写和触发回 `03` 的条件。 |
| Step 13 stop-review | 检查不创建正式 `04`,不写 final §13,不越界写下游。 |

### 8. R13.9 stop-review

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只推进 R13.9 一个模块 | pass | 未进入 R13.10 或 Step 14。 |
| 是否保持“先思考” | pass | 只写收口判断候选和写入计划。 |
| 是否未创建正式 `04` | pass | 正式 `04-配置设计.md` 仍只能 Step 15 装配。 |
| 是否未把候选表标 final | pass | 当前仍是中间产物候选。 |
| 是否未新增配置项 | pass | 未新增 key/default/profile/source/secret/failure strategy。 |
| 是否未写下游正文 | pass | 未写 TC、fixture、assertion、gate、phase、commit、命令、runbook 或 evidence schema。 |
| 是否可进入 R13.10 | pass | 等待用户确认后进入 Step 13 `R13.10 Step 13 最终收口判断:再写入`。 |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.10 Step 13 最终收口判断:再写入`;只允许把 R13.9 的 SOP 五问满足度、结构完整性收口、Step 14 转入候选、进入 Step 14 条件、03 影响预判和 Step 13 stop-review 写成可恢复记录;不得创建正式 `04-配置设计.md`;不得直接写正式 §13;不得把迁移与废弃表标 final;不得新增未在 Step 7~12 出现的配置项;不得写测试 TC、fixture、assertion、验收 gate、实施 phase、commit boundary、部署命令、runbook 或 evidence schema。

---

## R13.10 Step 13 最终收口判断:再写入

### 1. 当前模块状态记录

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R14.1 |
| 本模块目标 | 将 R13.9 的 SOP 五问满足度、结构完整性收口、Step 14 转入候选、进入 Step 14 条件、03 影响预判和 Step 13 stop-review 写成可恢复记录。 |
| 本模块已写入 | SOP 五问满足度记录、结构完整性收口记录、Step 14 转入候选记录、进入 Step 14 条件记录、03 影响判定记录、Step 13 stop-review 和 R14.1 入口。 |
| 本模块未写入 | 未创建正式 `04-配置设计.md`;未直接写正式 §13;未把候选迁移与废弃表标 final;未新增配置项;未写 TC-ID、fixture、assertion、验收 gate、实施 phase、commit boundary、部署命令、runbook 或 evidence schema。 |
| 当前恢复口径 | 用户已确认从 R13.9 进入 R13.10;R13.10 完成后等待用户确认进入 Step 14 R14.1。 |

### 2. SOP 五问满足度记录

| SOP 问题 | 回答来源 | 收口判断 |
|---|---|---|
| 是否存在旧配置需要迁移? | R13.4 当前无已发布旧配置迁移项候选;R13.6 当前无迁移项候选行;R13.8 证明口径。 | pass_candidate。当前无已发布正式 `04` 和 runtime config schema,旧 `05/06/07` 不作为迁移来源。 |
| 新配置如何引入? | R13.4 新配置引入规则候选。 | pass_candidate。新配置必须回 Step 7~12,影响 runtime contract 时先回 `03`。 |
| 旧配置如何废弃? | R13.4 废弃 / 兼容 / 移除候选;R13.6 状态词表。 | pass_candidate。只对已发布正式配置适用,必须有状态、窗口、策略、safe warning / issue 和移除条件。 |
| 是否需要兼容窗口? | R13.4 兼容窗口候选;R13.6 禁止兼容成功窗口。 | pass_candidate。当前无迁移项为不适用;未来新增 / 废弃必须说明窗口或 no-compat reason。 |
| 何时允许移除旧配置? | R13.4 移除条件候选;R13.8 停审与回写条件。 | pass_candidate。须满足下游承接、rollback 不依赖旧 key、safe audit / digest、03 不受影响等条件。 |

### 3. 结构完整性收口记录

| 结构项 | 当前来源 | 收口判断 |
|---|---|---|
| 主迁移与废弃表列语义 | R13.6 `旧配置 / 新配置 / 状态 / 兼容窗口 / 迁移策略 / 移除条件` 列义。 | complete_candidate。满足 SOP / 书写规范表结构。 |
| 当前无迁移项候选行 | R13.6 当前无迁移项候选行。 | complete_candidate。满足“暂无迁移也必须说明”。 |
| 状态词表 | R13.6 `当前无迁移项`、`introduced`、`deprecated`、`rejected`、`removed`、`design-change-required`。 | complete_candidate。足以支撑配置新增、废弃、拒绝、移除和设计变更区分。 |
| 禁止兼容成功窗口 | R13.6 raw secret、static boundary override、hot reload、config center、admin override 等拒绝 / design-change-required。 | complete_candidate。防止安全红线被写成兼容迁移。 |
| 未来演进分组 | R13.6 P1/P2 profile、durable refs、real publisher、secret provider、config center、observability 等分组。 | complete_candidate。足以转入 Step 14 风险 / 待确认。 |
| 证明与下游承接 | R13.8 证明口径、不可用证明、下游承接范围、停审条件。 | complete_candidate。足以支撑 Step 15 正式 §13 候选装配。 |

### 4. Step 14 转入候选记录

| 候选风险 / 待确认项 | 转入理由 | Step 14 处理方向 |
|---|---|---|
| 未发现已发布 runtime config schema 的证明依赖当前仓状态 | 当前只能证明“当前未发现”,未来若发现旧 schema 必须回 Step 13。 | 作为风险 / 待确认项记录,不写成永久事实。 |
| 旧 `05/06/07` 污染仍存在 | 旧下游材料仍含旧 MethodContent / publish / snapshot / outbox 方向。 | 作为旧材料污染风险记录,后续 `05/06/07` 重启继续隔离。 |
| future secret provider / config center / admin override / hot reload / online LKG | 当前均属 design-change-required / future evolution。 | 作为 future / design-change-required 风险,不得进入 P0 配置项。 |
| future durable refs / real publisher / product observability | 属 P1/P2 或运维方向,当前不装入 P0。 | 作为待确认演进项,必要时回 Step 7~12 和 `03`。 |
| 若未来迁移需要 public deprecation issue schema | 可能影响 `03` public surface / DTO / marker source。 | 作为条件风险记录,触发时回 `03`。 |

### 5. 进入 Step 14 条件记录

| 条件 | 当前判断 |
|---|---|
| 配置演进策略是否明确 | pass_candidate。新增、废弃、兼容、移除、拒绝、design-change-required 均已有候选规则。 |
| 是否存在未回答的 Step 13 SOP 五问 | no_current_gap_candidate。五问均已由 R13.4 / R13.6 / R13.8 覆盖。 |
| 是否存在必须立即回写 `03` 的当前结论 | no_current_gap_candidate。当前无迁移项和文档状态规则不改变 runtime contract。 |
| 是否仍有风险 / 待确认需要记录 | yes_candidate。旧材料污染、未来演进、可能发现旧 schema 等进入 Step 14。 |
| 是否可创建正式 `04` | no。正式 `04` 仍只能 Step 15 装配。 |
| 是否可进入 Step 14 | yes_after_user_confirm。R13.10 stop-review 通过后,等待用户确认进入 Step 14 R14.1。 |

### 6. 03 影响判定记录

| Step 13 收口结论 | 是否影响 03 | 处理状态 |
|---|---|---|
| 当前无已发布旧配置迁移项 | 否 | 留在 `04` 配置版本说明。 |
| 主迁移与废弃表结构、状态词表和无迁移项行 | 否 | 属于 `04` 文档结构和配置演进规则。 |
| 新配置必须回 Step 7~12,必要时回 `03` | 否 | 流程门禁,不改变 runtime contract。 |
| 未来迁移若需要 old/new carrier、alias mapping、public deprecation issue schema 或 marker source | 可能是 | 触发时回 `03` owning Step。 |
| future secret provider、config center、admin override、hot reload、online LKG | 是且当前越界 | 转 Step 14 风险 / future evolution,不得进入 P0。 |

### 7. Step 13 stop-review

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否满足 SOP 五问 | pass_candidate | 五问均有来源记录和收口判断。 |
| 是否具备迁移与废弃表候选结构 | pass_candidate | 主表列义、当前无迁移项行、状态词表、禁止兼容窗口均已记录。 |
| 是否说明暂无迁移项 | pass_candidate | R13.6 写入候选行,R13.8 写入证明口径。 |
| 是否隔离旧材料污染 | pass | 旧 `05/06/07` 和旧 MethodContent / publish / snapshot / outbox 不作为迁移来源。 |
| 是否保留 03 回写门禁 | pass | runtime contract、public surface、marker source 变化必须回 `03`。 |
| 是否避免下游正文越界 | pass | 未写 TC、fixture、assertion、gate、phase、commit、命令、runbook 或 evidence schema。 |
| 是否未创建正式 `04` | pass | 正式 `04-配置设计.md` 仍只能 Step 15 装配。 |
| 是否可进入 Step 14 | pass | 等待用户确认后进入 Step 14 `R14.1 开工与必读文档:先思考`。 |

### 8. R14.1 入口记录

| 下一模块 | 入口条件 | 允许内容 | 禁止内容 |
|---|---|---|---|
| Step 14 `R14.1 开工与必读文档:先思考` | 用户确认进入 Step 14。 | 创建 / 更新 `04_config_step_14_risks_open_questions.md`,思考 Step 1~13 的风险、待确认项、03 影响汇总和 R14.2 写入计划。 | 不创建正式 `04-配置设计.md`;不直接写正式 §14;不写测试 TC、fixture、assertion、验收 gate、实施 phase、commit boundary、部署命令、runbook 或 evidence schema。 |

next_allowed_action: 等待用户确认后进入 Step 14 `R14.1 开工与必读文档:先思考`;只允许创建 / 更新 `04_config_step_14_risks_open_questions.md` 并思考 Step 14 开工边界、必读文档、Step 1~13 风险 / 待确认输入、03 影响汇总和 R14.2 写入计划;不得创建正式 `04-配置设计.md`;不得直接写正式 §14;不得写测试 TC、fixture、assertion、验收 gate、实施 phase、commit boundary、部署命令、runbook 或 evidence schema。
