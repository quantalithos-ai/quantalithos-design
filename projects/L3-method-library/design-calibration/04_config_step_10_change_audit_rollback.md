# Step 10. 定义配置变更、审计与回滚

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 10
> 书写规范: `standards/document/配置设计书写规范.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 可落码性标准: `standards/document/设计真相源闭环与可落码性标准.md`
> 回填章节: `04-配置设计.md` §10 配置变更、审计与回滚
> 创建日期: 2026-06-25
> 当前模式: full-restart
> 当前状态: `R10.20 Step 10 总体收口与进入 Step 11 判断:再写入` completed_wait_user_confirm_to_R11.1;等待用户确认进入 Step 11 `R11.1 开工与必读文档:先思考`

---

## 0. Step 10 边界

Step 10 在 Step 7 配置项清单、Step 8 敏感配置和 Step 9 加载 / 校验 / 生效机制收口之后,只讨论配置如何变更、谁可以发起或批准变更、如何留下安全审计记录、如何判定回滚,以及哪些变更必须停审或回写 `03-详细设计.md`。

当前 Step 只允许讨论:

- 哪些配置族允许变更,哪些变更必须被评审或拒绝。
- 哪些 actor / reviewer 可以发起、批准或执行变更。
- 变更如何在 startup、job-run-start、entry-local 和 test harness 范围内生效。
- 变更失败、效果异常、敏感配置轮换、目标失效、选择器冲突、redaction 放松等情况下如何回滚或拒绝。
- 审计记录允许携带哪些 safe metadata,禁止携带哪些 raw secret / raw config / full sensitive ref / body。
- Step 7 / Step 8 / Step 9 / Step 11 / `03-详细设计.md` 的回指和影响判定。

本 Step 不定义:

- 具体审批产品、工单系统、值班系统或审计产品。
- 具体 secret provider / KMS / Vault / cloud secret manager 产品。
- runtime hot reload、remote config center、admin override 或 live mutation contract。
- 配置失效模式和降级矩阵,这些由 Step 11 定义。

---

## R10.1 开工与必读文档:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.2 |
| 本模块目标 | 固化 Step 10 的开工边界、必读文档、输入基线、watch / redline、03 影响判定和 R10.2 写入计划。 |
| 本模块允许 | 只记录 Step 10 的开工记录、必读文档、输入基线、产出门禁、watch / redline、03 影响判定和下一模块计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写最终变更流程、最终审计流程、最终回滚流程、审核细节、审计代码、回滚代码、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | Step 9 已完成并推进为 `R9.4 completed_wait_user_confirm_to_R10.1`;用户已确认继续进入 Step 10。 |

### 2. Step 10 开工边界思考

| 边界项 | R10.1 裁决 |
|---|---|
| Step 10 定位 | 从 Step 7 / Step 8 / Step 9 已收口的配置项、敏感配置和加载机制,进入配置变更、审计与回滚边界,不能把治理责任散落在实现计划里。 |
| 直接输入 | Step 7 配置项清单、Step 8 敏感配置、Step 9 加载 / 校验 / 生效机制、Step 11 失效模式框架、SOP Step 10、书写规范、L1-governance Step 10 框架参考。 |
| 输出粒度 | 后续应先写开工记录、必读文档、变更 actor / review level 框架、审计记录框架、回滚矩阵和 03 影响判定,再进入具体变更表与审计表。 |
| 变更边界 | 只纳入仍可在 P0 配置层变更的配置族;不得把 truth owner、state transition、query no-write、job no-truth-repair、body-free、stored replay、transaction boundary、marker source 或 public schema 变成配置开关。 |
| 审计边界 | 审计记录只能保留 safe ref / digest / issue / actor / reason / rollback refs,不能记录 raw config、raw secret、full sensitive ref、endpoint body、target body 或 report body。 |
| 回滚边界 | 只讨论配置变更和运行输入的 rollback,不能把 rollback 用来改写 truth、accepted result 或 stored report。 |
| 对 03 的影响 | 若 Step 10 需要新增 change-request / audit / rollback object、port、DTO、mapper、flow 或 loader contract,必须回 `03-详细设计.md` 或暂停。 |

### 3. 必读文档思考

| 必读文档 | 读取用途 | R10.2 用法 |
|---|---|---|
| `project_execution_ledger.md` | 确认当前恢复点和用户确认门禁。 | 写入 Step 10 当前恢复依据。 |
| `04_config_calibration_flow.md` | 确认 Step 10 主题、状态表和执行纪律。 | 同步 Step 10 当前状态和 next_allowed_action。 |
| `04_config_step_07_config_items.md` | 提供可变更配置项、来源、作用域、敏感级别和失败策略。 | 识别哪些配置族属于可变更边界。 |
| `04_config_step_08_sensitive_secrets.md` | 提供 opaque ref、raw secret 禁入和 restart / new job run 口径。 | 识别敏感配置变更与轮换边界。 |
| `04_config_step_09_loading_validation_activation.md` | 提供 startup / job-run-start / entry-local / test harness 和 unsupported reload 口径。 | 识别哪些变更可在何种生效方式下执行。 |
| `03_ddd_step_15_observability_audit.md` | 提供 config validation / audit 的安全输出边界。 | 识别审计记录能携带什么 safe metadata。 |
| `03_ddd_step_12_errors_recovery.md` | 提供 invalid config、adapter unavailable、degraded / rejected marker 的恢复方向。 | 识别回滚、拒绝和 fail-fast 口径。 |
| `03_ddd_step_17_implementation_handoff.md` | 提供实施前的 boundary / gate / handoff 语义。 | 识别后续实施台账需要哪些 change gate 输入。 |
| `配置设计讨论流程_SOP.md` Step 10 | 固定本步目标、输入、输出和问题清单。 | R10.2 起按问题形成变更 / 审计 / 回滚候选。 |
| `设计文档讨论中间产物规范.md` | 固定中间产物和台账同步纪律。 | 约束 R10.1 -> R10.2。 |
| `设计真相源闭环与可落码性标准.md` | 固定缺 schema / port / mapper / config / evidence 时必须暂停。 | 作为 03 影响和 blocker 判定依据。 |
| `00-需求文档.md` / `01-架构设计.md` / `02-概要设计.md` / `03-详细设计.md` | 提供上游边界、依赖方向、配置影响轮廓和 runtime binding 输入。 | 只承接,不反向定义变更 contract。 |
| L1-governance Step 10 | 提供配置变更 / 审计 / 回滚章节的框架深度。 | 只参考结构,不复制治理仓事实。 |

### 4. Step 7 -> Step 8 -> Step 9 -> Step 10 输入基线思考

| 输入来源 | Step 10 接收方式 | 不得接收 |
|---|---|---|
| Step 7 配置项清单 | 接收字段类型、来源、作用域、敏感级别和失败策略,作为可变更对象候选。 | 不把配置项直接变成代码分支或 runtime 私有规则。 |
| Step 8 敏感配置 | 接收 opaque ref、raw secret 禁入和 restart / new job run 口径。 | 不把 raw secret material 送入变更审计正文。 |
| Step 9 加载 / 校验 / 生效 | 接收 startup / job-run-start / entry-local / test harness 的生效边界。 | 不把 hot / reload 写成 P0 正式能力。 |
| Step 11 失效模式框架 | 接收 rollback / fail-fast / degraded / rejected 的未来承接方向。 | 不在 Step 10 先写 Step 11 的最终失效矩阵。 |
| 正式 `03` | 接收已有 runtime builder、adapter availability、config binding、observability / audit / recovery 输入。 | 不自行新增 change-request / audit / rollback schema、port 或 DTO。 |
| 旧材料 | 只作为下游方向或污染审计对象。 | 不反向生成审批系统、工单系统、AC、commit boundary 或 evidence schema。 |

### 5. SOP Step 10 产出与问题框架思考

| SOP 产出 | R10 后续整理方式 |
|---|---|
| 变更 actor 与 review level 框架 | 先说明哪些角色可以发起、批准或执行配置变更,再进入具体表格。 |
| 配置变更表 | 逐配置族列出可变更性、review level、生效方式、审计字段和 rollback 路径。 |
| 变更到 Step 7 / Step 8 / Step 9 / Step 11 的回指表 | 说明每类变更如何回指已收口配置项、敏感配置、加载机制和失效模式。 |
| 审计记录规则 | 说明 change request、actor、reason、digest、validation、rollback refs 和 safe diagnostic refs 的边界。 |
| 回滚规则矩阵 | 说明 startup / job-run-start / entry-local / test harness / rejected critical change 的回滚方式。 |
| 敏感配置变更附加规则 | 说明 secret / redaction / target / route / replay root 的变更和轮换约束。 |
| 配置变更停审记录 | 每个配置域完成后停审,确认没有未评审或未记录 rollback 的高风险变更。 |
| 跨变更审计 / 回滚审计表 | 审计 reload/hot、fallback、raw secret、半装配暴露和 rollback rewrite 缺口。 |

### 6. Watch / redline 带入思考

| 项 | 当前状态 | Step 10 处理 |
|---|---|---|
| config center | watch_only | 不进入 P0 变更链;若未来要正式化,必须回 `03` / 架构。 |
| admin override | watch_only | 不写 live override / operator override / rollback contract。 |
| hot runtime update | redline | P0 一律不支持,出现即 reject。 |
| reload contract | redline | 仅作为未来版本方向,不得在本轮留半实现。 |
| raw secret / raw config / full sensitive ref | redline | 不得在 change / audit / rollback / issue 中出现。 |
| truth owner / state transition override | redline | 不得作为配置变更项。 |
| stored report / accepted result rewrite | redline | rollback 不得改写既有 truth 或 report。 |
| half-assembled facade | redline | 只能在 Ready 后暴露 facade。 |

### 7. 对 03 的影响判定框架

| Step 10 结论类型 | 是否影响 03 | 处理规则 |
|---|---|---|
| 只定义配置变更、审计、回滚的开工边界和 safe metadata 口径 | 否 | 留在 04,后续写入正式变更 / 审计 / 回滚章节。 |
| 只定义 startup / job-run-start / entry-local / test harness 的配置变更边界 | 否 | 承接 Step 9 / Step 11,无回写。 |
| 只定义审计记录字段的 safe 范围,不新增对象形状 | 否 | 承接 `03` 既有 observability / audit 输入。 |
| 需要新增 change-request / audit / rollback object、port、DTO、mapper 或 flow | 是 | 暂停并回 `03` owning Step。 |
| 需要新增 config center / admin override / hot reload / live mutation contract | 是 | 暂停并回 `03` / 架构。 |
| 让变更或回滚改变 truth owner、state transition、query no-write、job no-truth-repair、body-free、stored replay、transaction boundary、marker source、public schema / P0-P1 隔离 | 是且越界 | 立即拒绝,不得在 04 内补口。 |

### 8. R10.2 写入计划

| R10.2 拟写内容 | 写入边界 |
|---|---|
| 变更 actor 与 review level 框架 | 记录 operator / release automation / job runner / entry caller / test harness / design change 的角色边界。 |
| 配置变更表 | 记录可变更配置族、review level、生效方式、审计字段和 rollback 路径。 |
| Step 7 / Step 8 / Step 9 / Step 11 回指表 | 记录每类变更如何回指配置项、敏感配置、加载机制和失效模式。 |
| 审计记录规则 | 记录 change request、actor、reason、digest、validation、rollback refs 和 safe diagnostic refs。 |
| 回滚规则矩阵 | 记录 startup / job-run-start / entry-local / test harness / rejected critical change 的回滚方式。 |
| 敏感配置变更附加规则 | 记录 secret / redaction / target / route / replay root 的变更与轮换约束。 |
| 停审记录 | 记录每个配置域完成后的停审结果和残留缺口。 |
| 跨变更审计 / 回滚审计表 | 记录 reload/hot、fallback、raw secret、半装配暴露和 rollback rewrite 的审计结论。 |
| 03 影响判定记录 | 记录何时无回写、何时必须暂停回 `03`。 |

### 9. R10.1 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只写开工与必读文档思考 | pass | 未写最终变更流程、审计流程或回滚流程。 |
| 是否承接 Step 7 / Step 8 / Step 9 / Step 11 | pass | 已记录可变更对象、敏感配置、生效方式和失效模式承接。 |
| 是否保留 watch / redline | pass | config center / admin override / hot / reload / raw secret / truth override / report rewrite 均已记录。 |
| 是否保留 03 回写门禁 | pass | 新增 change-request / audit / rollback object、port、DTO、mapper、flow 仍需回 `03`。 |
| 是否可进入 R10.2 | pass | 等待用户确认后进入 `R10.2 开工与必读文档:再写入`。 |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.2 开工与必读文档:再写入`;只允许把 R10.1 思考固化为开工记录、输入基线、必读文档、SOP 输出门禁、watch / redline、03 影响判定和 R10.2 入口;不得创建正式 `04-配置设计.md`;不得写最终变更流程、最终审计流程、最终回滚流程、审计 / 回滚代码、测试方案、验收标准、实施计划或代码。

## R10.2 开工与必读文档:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.3 |
| 本模块目标 | 将 R10.1 的 Step 10 开工思考固化为可恢复记录,并建立 R10.3 的讨论入口。 |
| 本模块允许 | 写入开工记录、必读文档记录、输入基线记录、SOP 输出门禁、watch / redline、03 影响判定和下一模块入口。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写最终配置变更表、最终审计规则、最终回滚矩阵、最终停审记录、审计 / 回滚代码、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R10.1 已完成开工边界、必读文档、输入基线、watch / redline 和 03 影响判定思考;用户已确认继续进入 R10.2。 |

### 2. 开工记录

| 记录项 | 写入结论 |
|---|---|
| 当前 Step | Step 10 定义配置变更、审计与回滚。 |
| 当前讨论目标 | 只围绕配置变更、评审、审计、回滚和 03 影响判定建立后续讨论框架。 |
| 当前输入边界 | 以 Step 7 配置项、Step 8 敏感配置、Step 9 加载 / 校验 / 生效机制、Step 11 失效模式承接方向和正式 `03-详细设计.md` 为输入。 |
| 当前输出边界 | 后续输出必须可回指配置项、敏感性、生效机制和失效策略,且不得引入未在 `03` 闭合的 schema / port / mapper / flow。 |
| 当前停止条件 | 命中 remote config center、admin live override、runtime hot reload、secret provider API、change-request object、audit object、rollback object 或其他 `03` 未闭口契约时暂停。 |

### 3. 必读文档记录

| 必读文档 | 本 Step 使用方式 |
|---|---|
| `project_execution_ledger.md` | 作为当前恢复点和 next_allowed_action 的唯一台账来源。 |
| `04_config_calibration_flow.md` | 作为 Step 10 状态和文档级执行纪律来源。 |
| `04_config_step_07_config_items.md` | 提供可变更配置族候选、配置项属性、来源、作用域、敏感级别和失败策略。 |
| `04_config_step_08_sensitive_secrets.md` | 提供 opaque ref、raw secret 禁入、轮换、禁止输出和敏感变更审计边界。 |
| `04_config_step_09_loading_validation_activation.md` | 提供 startup、job-run-start、entry-local、test harness 与 unsupported reload / hot 口径。 |
| `03_ddd_step_12_errors_recovery.md` | 提供 invalid config、adapter unavailable、reject / degraded / rollback 方向。 |
| `03_ddd_step_14_config_dependencies.md` | 提供 runtime config binding、adapter binding 和 external dependency 的详细设计来源。 |
| `03_ddd_step_15_observability_audit.md` | 提供 log / metric / trace / audit 的 safe refs-only 和 redaction 约束。 |
| `03_ddd_step_17_implementation_handoff.md` | 提供后续实现门禁、不得实现侧发明 config / evidence / boundary 的承接纪律。 |
| `配置设计讨论流程_SOP.md` Step 10 | 固定配置变更、审计与回滚的问题清单、表格形态和停审要求。 |
| `配置设计书写规范.md` | 固定正式 04 的章节结构、表格列名和配置变更表达规范。 |
| `设计文档讨论中间产物规范.md` | 固定先思考后写入、状态台账、单模块推进和批次写入纪律。 |
| `设计真相源闭环与可落码性标准.md` | 固定缺 schema / port / mapper / config / evidence 时必须回真相源闭口。 |
| L1-governance Step 10 | 只参考框架深度、表格组织和停审粒度,不复制 governance 领域事实。 |

### 4. 输入基线记录

| 输入基线 | Step 10 接收结论 | 红线 |
|---|---|---|
| Step 7 配置项清单 | 后续只从已识别配置族中讨论变更控制,并保留字段类型、来源、作用域、敏感级别和失败策略回指。 | 不新增最终 key、默认值、环境变量名或正式配置 demo。 |
| Step 8 敏感配置 | 后续所有 sensitive / secret / target / route / replay root 变更只记录 opaque ref / redacted digest / safe issue ref。 | 不记录 raw secret、raw credential、full sensitive ref、endpoint body 或 route credential。 |
| Step 9 生效机制 | 后续变更生效只能落在 startup restart、job-run-start new run、entry-local rerun、test harness rerun 或 rejected。 | 不把 hot reload、runtime reload、remote config center 或 live override 写成 P0 能力。 |
| Step 11 失效模式方向 | 后续只预留 fail-fast、reject、degraded、rollback 和 no activation 承接点。 | 不提前写 Step 11 的最终失效矩阵。 |
| 正式 `03-详细设计.md` | 后续只能承接已有 runtime builder、adapter availability、config binding、error recovery、observability / audit。 | 不在 04 私自补 object、port、DTO、mapper、state、flow 或 persistence 语义。 |

### 5. SOP 输出门禁记录

| 后续输出 | R10.2 门禁 |
|---|---|
| 变更 actor 与 review level | R10.3 起先讨论角色和评审层级候选,不得直接落成最终表。 |
| 配置变更表 | 必须逐配置族回指 Step 7 / 8 / 9 / 11,且每行都有发起方、评审、生效、审计、回滚。 |
| 审计记录规则 | 只能定义 safe metadata、digest、issue ref、rollback ref 和 diagnostic ref,不得包含正文、secret 或 raw config。 |
| 回滚规则矩阵 | 必须按 activation kind 区分 startup、job-run-start、entry-local、test harness、rejected critical change。 |
| 敏感配置变更附加规则 | 必须单独审查 secret / redaction / target / route / replay root,且只能使用 opaque ref / redacted digest。 |
| 配置变更停审记录 | 每类变更完成后必须检查权限、评审、审计、回滚、失败处理和敏感性。 |
| 跨变更审计 / 回滚审计表 | 所有规则完成后必须检查高风险无评审、无审计、无回滚、敏感泄露和具体产品假设。 |

### 6. Watch / redline 记录

| 项 | Step 10 固化口径 |
|---|---|
| config center | watch_only;本轮不定义 remote source、merge order、auth、audit 或 rollback。 |
| admin override | watch_only;本轮不定义 live operator override 或在线覆盖。 |
| hot runtime update / reload contract | redline;P0 不支持,任何请求均进入 rejected / design-change 路径。 |
| raw secret / raw config / full sensitive ref | redline;不得进入 change、audit、rollback、issue、log 或 report。 |
| truth owner / state transition / query no-write / job no-truth-repair | redline;不得被配置变更或回滚改变。 |
| body-free / stored replay / transaction boundary / marker source / public schema | redline;不得由配置变更绕过或重写。 |
| previous invalid config | redline;不得作为 rollback target。rollback target 必须是 previous validated / approved ref 或 digest。 |

### 7. 对 03 的影响判定写入

| 判定项 | 当前结论 | 后续处理 |
|---|---|---|
| 只定义配置变更治理、审计 safe metadata 和回滚决策框架 | 不影响 `03` | 可留在 04 Step 10。 |
| 只复用 Step 9 已闭口的 startup / job-run-start / entry-local / test harness 生效方式 | 不影响 `03` | 可留在 04 Step 10。 |
| 需要新增 change-request / audit / rollback object、port、DTO、mapper、flow 或 persistence surface | 影响 `03` | 立即暂停并回详细设计 owning Step。 |
| 需要新增 config center、admin override、runtime hot reload、live mutation、secret provider API | 影响 `03` / 架构 | 立即暂停,不得在 04 内补口。 |
| 让配置变更改变 truth owner、state transition、query no-write、job no-truth-repair、stored replay、transaction boundary、marker source、public schema 或 P0/P1 隔离 | 越界 | 直接拒绝,不得作为配置设计结论。 |

### 8. R10.2 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只固化 R10.1 开工思考 | pass | 未写最终配置变更表、最终审计规则或最终回滚矩阵。 |
| 是否同步必读文档和输入基线 | pass | 已记录 Step 7 / 8 / 9 / 11、正式 `03`、SOP、书写规范和闭环标准。 |
| 是否保持 watch / redline | pass | config center、admin override、hot reload、raw secret、truth override、stored replay rewrite 均未放开。 |
| 是否保留 03 回写门禁 | pass | 新增 schema / port / mapper / flow 等均要求暂停回 `03`。 |
| 是否可进入 R10.3 | pass | 等待用户确认后进入 SOP 问题回答与变更 / 审计 / 回滚候选思考。 |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.3 SOP 问题回答与变更 / 审计 / 回滚候选:先思考`;只允许围绕 Step 10 SOP 问题框架思考 actor / review level、配置变更表、审计记录规则、回滚矩阵、敏感配置变更附加规则、停审记录、跨变更审计和 03 影响预判;不得创建正式 `04-配置设计.md`;不得写最终变更表、最终审计规则、最终回滚矩阵、测试方案、验收标准、实施计划或代码。

## R10.3 SOP 问题回答与变更 / 审计 / 回滚候选:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.4 |
| 本模块目标 | 围绕 SOP Step 10 八问形成配置变更、评审、审计、回滚和停审的候选思考,为 R10.4 再写入做准备。 |
| 本模块允许 | 写 SOP 问题候选回答、actor / review 候选、配置族变更候选、审计字段候选、回滚路径候选、敏感变更候选、03 影响预判和 R10.4 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不把候选升级为最终变更表、最终审计规则或最终回滚矩阵;不写测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R10.2 已完成 Step 10 开工记录、必读文档、输入基线、SOP 输出门禁、watch / redline 和 03 影响判定写入;用户已确认进入 R10.3。 |

### 2. SOP 八问候选回答思考

| SOP 问题 | 候选回答方向 | 当前状态 | R10.4 写入注意 |
|---|---|---|---|
| 哪些配置可以由谁变更? | startup 配置由 operator / release automation 变更;job-run-start 输入由 authorized job runner 变更;entry-local selector 由 entry caller 提交;test fixture 由 test harness 提交;critical boundary 只能走 design change。 | candidate | 不引入具体工单系统、权限产品或值班系统。 |
| 哪些配置变更需要评审? | store refs、resolver refs、publisher/topic bindings、handoff/external target、externalGrc enablement、retention、redaction、安全诊断、fixture/replay root 等高风险族需要评审;低风险数值收窄可轻量评审。 | candidate | R10.4 只写配置设计层级,不写企业审批流程。 |
| 变更如何生效? | 只承接 Step 9 已冻结的 startup restart、job-run-start new run、entry-local rerun、test harness rerun 和 rejected critical change。 | candidate | reload / hot / remote config center 不进入成功生效路径。 |
| 变更如何记录审计? | 只记录 change request / actor / reason / config section / profile / activation kind / old-new redacted digest / validation issue / rollback ref / safe diagnostic ref。 | candidate | 不记录 raw config、raw secret、full sensitive ref、endpoint、route、body 或 report body。 |
| 变更失败或效果异常如何回滚? | startup 回 previous validated config digest 并 restart;job-run-start 以 previous input 启动 new run;entry-local 由 caller 使用 previous selector 重试;test harness 回 previous fixture 后 rerun;critical rejected 不激活。 | candidate | rollback 不改写 truth、accepted result、stored replay surface 或 stored report。 |
| 每个可变更配置项是否回指 Step 7 / 8 / 9 / 11? | 每个配置族候选必须回指 Step 7 配置项、Step 8 敏感性、Step 9 生效机制和 Step 11 失效策略承接点。 | candidate | R10.4 写入时需要显式列回指列。 |
| 每类配置变更完成后是否通过停审? | 每类变更需要检查权限、评审、审计、回滚、失败处理、敏感输出和 03 影响。 | candidate | R10.3 不关闭最终停审,R10.4 只写候选停审框架。 |
| 所有变更规则完成后是否存在缺口? | 跨变更审计要检查高风险无评审、无审计、无回滚、敏感泄露、reload/hot 漏入、具体产品假设和回滚改写历史。 | candidate | 最终 unresolved 冲突必须停在 Step 10,不得进入 Step 11。 |

### 3. Actor / review level 候选思考

| 候选 actor / level | 可讨论范围 | 禁止范围 | 审计候选 |
|---|---|---|---|
| operator | startup config artifact、profile、store / adapter / target refs 的提交或 rollback。 | 绕过 validator、直接改 truth、注入 raw secret。 | actor ref、reason ref、old/new config digest。 |
| release automation | 应用已评审 config artifact、运行 validation、记录 digest。 | 自动批准 high / critical 变更。 | release run ref、validation result、issue ref。 |
| authorized job runner | 提交 run-local batch、target、scope、replay root 等输入。 | 覆盖 startup invariant 或全局配置。 | job run ref、input digest、target digest。 |
| entry caller | 提交 current entry selector、dry-run selector 或 request source selector。 | 持久化覆盖全局 config 或绕过 facade。 | entry ref、selector digest、rejection issue。 |
| test harness | 加载 fixture、fixed clock/id、fake adapter seed。 | 将 fixture / fake 引入 staging-like 或 production-like。 | test run ref、fixture digest、profile。 |
| design change | 承接 hot reload、secret provider、admin override、truth boundary 这类 critical 扩展。 | 在 P0 runtime 直接生效。 | design baseline ref、review record。 |

| review level 候选 | 适用方向 | 处理方式 |
|---|---|---|
| low | 数值型 batch / timeout / page limit 收窄,entry-local selector。 | 可由 automation / caller 执行,仍需审计。 |
| medium | local / CI / integration-like profile、fake / controlled adapter refs、test fixture refs。 | 需要 reviewer 或 release approval ref,且 validation pass。 |
| high | durable store refs、resolver / publisher refs、topic / target refs、externalGrc、retention、redaction、replay root。 | 必须评审、审计、rollback plan;失败不得 fallback fake。 |
| critical | raw secret、raw body、redaction 不安全放松、hot/reload、truth invariant override、query write override。 | P0 reject 或要求正式设计变更。 |

### 4. 配置族变更候选池思考

| 配置族候选 | 变更候选方向 | 生效候选 | 风险候选 |
|---|---|---|---|
| runtime profile / strict validation | profile selector、strict validation、adapter mode 裁剪。 | startup / entry-local selector | fake 进入 production-like、strict validation 放松。 |
| stores | logical store kind / config ref / completeness。 | startup | durable ref、store slot 变更、previous invalid rollback。 |
| external resolvers | family、mode、adapter ref、availability disposition。 | startup / test harness | controlled/real ref 泄露、fallback fake。 |
| inbound consumers | namespace、version、dedup retention。 | startup | unsupported version、retention 与 replay window 冲突。 |
| outbox publisher / transport topic | publisher adapter、topic-neutral binding、batch。 | startup / job-run-start batch | route ref 泄露、missing enabled topic。 |
| jobs | enabled kind、batch、timeout、retry、checkpoint / replay root。 | startup / job-run-start | job input 覆盖 startup invariant、stored report 被改写。 |
| handoff / archive | target set、target selector、retry / archive direction。 | startup / job-run-start | target credential / package body 泄露。 |
| externalGrc | enablement、adapter ref、target ref、export batch。 | startup / job-run-start | disabled -> enabled 缺评审、external body 泄露。 |
| redaction / diagnostics | deny field refs、diagnostic prefix、high-cardinality guard。 | startup | redaction 放松、high-cardinality 开启。 |
| boundary / idempotency / retention | page/body/time limit、idempotency / result retention。 | startup / job-run-start narrowing | widening 无评审、duplicate replay 语义变化。 |
| projection / reference defaults | stale threshold、rebuild / refresh batch、safe diagnostic ref。 | startup / job-run-start | job repair truth、marker source 被配置覆盖。 |
| clock/id/test fixtures | fixed clock/id refs、fixture refs、replay artifact root。 | startup / test harness / job-run-start replay | fixture 泄露到 production-like、raw historical body。 |

### 5. 审计与回滚候选思考

| 候选主题 | 思考结论 | R10.4 写入边界 |
|---|---|---|
| 审计记录粒度 | 用产品中立 safe refs 和 digest 记录变更事实,不绑定具体工单系统。 | 可写字段族,不写产品 API。 |
| old/new 记录 | startup 记录 redacted config digest;敏感 refs 记录 redacted ref digest;job / entry 记录 input / selector digest。 | 不写完整 diff 或 full ref。 |
| validation 记录 | rejected / failed_validation 必须有 validation issue ref。 | issue ref 不含 raw invalid value。 |
| rollback target | 只能指向 previous validated / approved config、previous valid run input、previous selector 或 previous fixture。 | previous invalid config 不可作为 rollback。 |
| immutable surfaces | stored report、accepted result、stored replay surface、truth record 不因 rollback 被改写。 | 只能 new run / rerun / restart。 |
| critical reject | raw secret、hot reload、truth override、query write、redaction unsafe relax 不激活。 | 记录 rejected issue,需要时进入 design change。 |

### 6. 敏感配置变更附加候选思考

| 敏感族 | 变更候选 | 审计候选 | 禁止候选 |
|---|---|---|---|
| store / adapter refs | new approved opaque ref + restart。 | slot / family / old-new redacted digest。 | DSN、endpoint、credential、full ref。 |
| topic / target / route refs | new route / target ref + restart 或 new job run。 | changed key digest、target digest、coverage validation。 | raw topic、route credential、target credential。 |
| external body / package / report target | only body-free target refs。 | target digest、job run ref、marker refs。 | package body、external response body、report body。 |
| replay artifact root | new de-identified root per run。 | run id、root digest、de-identification marker。 | raw historical body。 |
| redaction deny / diagnostics | new deny list / prefix + restart。 | added/removed digest、reason、validation result。 | matched raw values、高风险放松无评审。 |
| future secret provider | deferred;只有 `03` 正式契约后才可进入。 | provider ref digest only。 | secret material、provider response body。 |

### 7. 对 03 的影响预判

| 候选结论类型 | 当前预判 | 处理方式 |
|---|---|---|
| 使用 product-neutral refs 表达变更审计 | 不影响 `03` | 可留在 04 Step 10。 |
| 按 Step 9 activation kind 定义 rollback | 不影响 `03` | 可留在 04 Step 10。 |
| 记录 redacted digest / safe issue ref / safe diagnostic ref | 不影响 `03` | 承接 Step 8 / `03` observability。 |
| 引入正式 `ConfigChangeAudit` object、rollback object、change-request DTO 或 port | 影响 `03` | 暂停并回详细设计 owning Step。 |
| 支持 remote config center、admin override、hot reload、last-known-good live switch、real secret provider rotation API | 影响 `03` / 架构 | 暂停,不得在 R10.4 私补。 |
| 允许配置或回滚改变 truth、state、query no-write、job no-truth-repair、body-free、stored replay、transaction boundary、marker source 或 public schema | 越界 | 拒绝作为配置候选。 |

### 8. R10.4 写入计划

| R10.4 拟写内容 | 写入边界 |
|---|---|
| SOP 八问候选回答记录 | 将 R10.3 的候选回答固化为可恢复记录,仍不写正式 04。 |
| actor / review level 候选表 | 写 actor、允许范围、禁止范围和审计候选。 |
| 配置族变更候选表 | 写配置族、变更方向、生效方式、风险和回指要求。 |
| 审计字段候选表 | 写 safe metadata 字段族和禁止字段。 |
| 回滚路径候选表 | 按 startup、job-run-start、entry-local、test harness、critical reject 写候选路径。 |
| 敏感变更附加候选表 | 写 store / adapter / route / target / replay / redaction / secret provider 的附加规则。 |
| 03 影响判定 | 写无回写、需回写和越界拒绝三类。 |
| R10.5 入口 | 进入配置变更表细化的下一轮“先思考”,不得自动跳到最终停审。 |

### 9. R10.3 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做“先思考” | pass | 未写最终配置变更表、最终审计规则或最终回滚矩阵。 |
| 是否回指 Step 7 / 8 / 9 / 11 | pass | 候选配置族、敏感边界、生效方式和失效承接均已记录。 |
| 是否保持 product-neutral | pass | 未假定具体工单、审批、KMS、Vault、secret provider 或 observability 产品。 |
| 是否保持 redline | pass | hot/reload、raw secret、truth override、stored report rewrite、marker source override 均未放开。 |
| 是否可进入 R10.4 | pass | 等待用户确认后进入 `R10.4 SOP 问题回答与变更 / 审计 / 回滚候选:再写入`。 |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.4 SOP 问题回答与变更 / 审计 / 回滚候选:再写入`;只允许把 R10.3 的 SOP 问题候选回答、actor / review level、配置族变更候选、审计字段候选、回滚路径候选、敏感变更附加候选和 03 影响预判写成可恢复记录;不得创建正式 `04-配置设计.md`;不得写最终配置变更表、最终审计规则、最终回滚矩阵、测试方案、验收标准、实施计划或代码。

## R10.4 SOP 问题回答与变更 / 审计 / 回滚候选:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.5 |
| 本模块目标 | 将 R10.3 的 SOP 八问、actor / review、配置族变更、审计、回滚、敏感变更和 03 影响预判固化为候选记录。 |
| 本模块允许 | 写入候选记录、候选裁决、R10.5 入口和停审记录。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写最终配置变更表、最终审计规则、最终回滚矩阵、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R10.3 已完成 SOP 八问和候选思考;用户已确认进入 R10.4。 |

### 2. SOP 八问候选回答记录

| SOP 问题 | 候选回答记录 | 后续细化位置 |
|---|---|---|
| 哪些配置可以由谁变更? | startup config 由 operator / release automation 变更;job-run-start 由 authorized job runner 提交;entry-local selector 由 entry caller 提交;test fixture 由 test harness 提交;critical boundary 只走 design change。 | R10.5 actor / config family table。 |
| 哪些配置变更需要评审? | high / critical 变更必须评审;medium 变更需要 reviewer 或 release approval ref;low 变更仍需审计。 | R10.5 review level table。 |
| 变更如何生效? | 只允许 startup restart、job-run-start new run、entry-local rerun、test harness rerun 或 rejected critical change。 | R10.5 activation column。 |
| 变更如何记录审计? | 使用 product-neutral refs、redacted digest、validation issue ref、rollback ref 和 safe diagnostic ref。 | R10.7 audit rule module。 |
| 变更失败或效果异常如何回滚? | startup 回 previous validated config;job-run-start 开 new run;entry-local caller rerun;test harness rerun;critical rejected 不激活。 | R10.8 rollback rule module。 |
| 是否回指 Step 7 / 8 / 9 / 11? | 每个配置族必须回指配置项、敏感性、生效机制和失效策略承接。 | R10.5 config family table。 |
| 每类配置变更是否通过停审? | 后续逐类检查权限、评审、审计、回滚、失败处理、敏感性和 03 影响。 | R10.9 stop-review module。 |
| 是否存在高风险缺口? | 跨变更审计必须检查无评审、无审计、无回滚、敏感泄露、reload/hot 漏入和产品假设。 | R10.10 cross-change audit module。 |

### 3. Actor / review level 候选记录

| Actor / level | 候选权限 | 候选禁止项 | 候选审计 |
|---|---|---|---|
| operator | 提交 startup config artifact、profile、store / adapter / target ref 变更。 | 绕过 validator、直接改 truth、注入 raw secret。 | actor ref、reason ref、old/new config digest。 |
| release automation | 应用已评审 config artifact、执行 validation、记录 digest。 | 自动批准 high / critical 变更。 | release run ref、validation result、issue ref。 |
| authorized job runner | 提交 run-local batch、target、scope、replay root。 | 覆盖 startup invariant 或全局 config。 | job run ref、input digest、target digest。 |
| entry caller | 提交 current entry selector、dry-run selector、request source selector。 | 持久化覆盖全局 config 或绕过 facade。 | entry ref、selector digest、rejection issue。 |
| test harness | 加载 fixture、fixed clock/id、fake adapter seed。 | 将 fixture / fake 引入 staging-like 或 production-like。 | test run ref、fixture digest、profile。 |
| design change | 承接 hot reload、secret provider、admin override、truth boundary 扩展。 | 在 P0 runtime 直接生效。 | design baseline ref、review record。 |

| Review level | 候选适用范围 | 候选处理 |
|---|---|---|
| low | 数值型 batch / timeout / page limit 收窄、entry-local selector。 | automation / caller 可执行,但必须记录审计。 |
| medium | local / CI / integration-like profile、fake / controlled adapter refs、test fixture refs。 | 需要 reviewer 或 release approval ref,validation 必须通过。 |
| high | durable store refs、resolver / publisher refs、topic / target refs、externalGrc、retention、redaction、replay root。 | 必须评审、审计、rollback plan;失败不得 fallback fake。 |
| critical | raw secret、raw body、redaction unsafe relax、hot/reload、truth invariant override、query write override。 | P0 reject 或进入正式设计变更。 |

### 4. 配置族变更候选记录

| 配置族 | 候选变更方向 | 候选生效方式 | Step 回指 | 候选风险 |
|---|---|---|---|---|
| runtime profile / strict validation | profile selector、strict validation、adapter mode 裁剪。 | startup / entry-local selector | Step 7 runtime;Step 9 startup / entry-local;Step 11 invalid profile。 | fake 进入 production-like、strict validation 放松。 |
| stores | logical store kind / config ref / completeness。 | startup | Step 7 stores;Step 8 sensitive refs;Step 9 startup。 | durable ref 泄露、previous invalid rollback。 |
| external resolvers | family、mode、adapter ref、availability disposition。 | startup / test harness | Step 7 resolver;Step 8 adapter ref;Step 9 startup / fixture。 | controlled/real ref 泄露、fallback fake。 |
| inbound consumers | namespace、version、dedup retention。 | startup | Step 7 inbound;Step 9 startup;Step 11 unsupported version。 | retention 与 replay window 冲突。 |
| outbox publisher / transport topic | publisher adapter、topic-neutral binding、batch。 | startup / job-run-start batch | Step 7 publisher;Step 8 topic refs;Step 9 startup / job-run-start。 | route ref 泄露、missing enabled topic。 |
| jobs | enabled kind、batch、timeout、retry、checkpoint / replay root。 | startup / job-run-start | Step 7 jobs;Step 8 replay root;Step 9 job-run-start。 | job input 覆盖 startup invariant、stored report 被改写。 |
| handoff / archive | target set、target selector、retry / archive direction。 | startup / job-run-start | Step 7 handoff;Step 8 target refs;Step 11 target failure。 | target credential / package body 泄露。 |
| externalGrc | enablement、adapter ref、target ref、export batch。 | startup / job-run-start | Step 7 externalGrc;Step 8 target refs;Step 11 export failure。 | disabled -> enabled 缺评审、external body 泄露。 |
| redaction / diagnostics | deny field refs、diagnostic prefix、high-cardinality guard。 | startup | Step 7 diagnostics;Step 8 internal safety-critical;Step 9 startup。 | redaction 放松、high-cardinality 开启。 |
| boundary / idempotency / retention | page/body/time limit、idempotency / result retention。 | startup / job-run-start narrowing | Step 7 boundary;Step 9 validation;Step 11 retention failure。 | widening 无评审、duplicate replay 语义变化。 |
| projection / reference defaults | stale threshold、rebuild / refresh batch、safe diagnostic ref。 | startup / job-run-start | Step 7 projection/reference;Step 9 startup / job-run-start。 | job repair truth、marker source 被配置覆盖。 |
| clock/id/test fixtures | fixed clock/id refs、fixture refs、replay artifact root。 | startup / test harness / job-run-start replay | Step 7 clock/fixture;Step 8 replay root;Step 9 test harness。 | fixture 泄露到 production-like、raw historical body。 |

### 5. 审计字段候选记录

| 字段族候选 | 候选必填性 | 允许内容 | 禁止内容 |
|---|---|---|---|
| `change_request_ref` / `actor_ref` / `reason_ref` | high / critical 必填;low 可由 release run ref 替代 | 产品中立 safe refs。 | 工单正文、审批正文、secret。 |
| `config_section` / `profile_ref` / `activation_kind` | 必填 | 配置族、profile、startup / job-run-start / entry-local / test harness / rejected。 | hot / reload 作为成功 activation。 |
| `old_config_digest` / `new_config_digest` | startup 候选必填 | redacted canonical digest。 | 完整配置文件、raw config。 |
| `old_ref_digest` / `new_ref_digest` | sensitive ref 变更候选必填 | redacted ref digest。 | full sensitive ref、endpoint、route credential。 |
| `validation_result` / `validation_issue_ref` | 必填;rejected 时 issue ref 必填 | accepted / rejected / failed_validation 和 safe issue ref。 | raw invalid value、raw adapter error。 |
| `rollback_ref` | high 变更候选必填 | previous approved config/input/fixture ref 或 rollback run ref。 | rollback script body、secret、truth rewrite。 |
| `safe_diagnostic_ref` | 可选 | safe diagnostic marker/ref。 | stack trace with secrets、HTTP body、SQL text。 |

### 6. 回滚路径候选记录

| 生效方式 | 成功候选 | 失败候选 | 回滚候选 | 禁止回滚 |
|---|---|---|---|---|
| startup | validation pass、runtime builder Ready、facade exposed。 | validation reject、builder Failed、required adapter missing。 | restore previous validated config digest and restart。 | runtime hot patch、跳过 validator、fallback invalid value。 |
| job-run-start | job input validation pass、run context frozen。 | invalid target/scope/batch/replay root。 | start new job with previous valid input。 | mutate stored report、改写 idempotency result。 |
| entry-local | selector validation pass。 | invalid selector / source / profile。 | reject current entry;caller rerun with previous selector。 | write selector into global config。 |
| test harness | fixture validation pass、fake runtime assembled。 | invalid fixture/ref/time/id seed。 | restore previous fixture ref and rerun test。 | fixture leak into production-like。 |
| rejected critical change | validation rejects before activation。 | raw secret、raw body、hot/reload、truth override。 | no runtime rollback;record rejected issue;design change if needed。 | activate under emergency flag。 |

### 7. 敏感配置变更附加候选记录

| 敏感族 | 读取 / 变更候选 | 审计候选 | 禁止输出 |
|---|---|---|---|
| store / adapter refs | new approved opaque ref + restart。 | slot/family、old-new redacted digest、profile。 | DSN、endpoint、credential、full ref。 |
| topic / route refs | new route map + restart。 | changed key digest、coverage validation。 | raw topic、route credential。 |
| handoff / external target refs | new target ref + restart 或 new job run。 | target digest、job run ref、marker refs。 | target credential、package body、external response body。 |
| replay artifact root | new de-identified root per run。 | run id、root digest、de-identification marker。 | raw historical body、raw artifact。 |
| redaction / diagnostics | new deny list or prefix + restart。 | added/removed digest、reason、validation result。 | matched raw values、secret/body excerpt。 |
| future secret provider | deferred until `03` has formal contract。 | provider ref digest only。 | secret material、provider response body。 |

### 8. 对 03 的影响判定记录

| 候选结论 | 是否影响 03 | 处理状态 |
|---|---|---|
| 使用 product-neutral refs、redacted digest、safe issue ref 和 safe diagnostic ref 表达配置变更审计 | 否 | 可留在 04 Step 10 候选。 |
| 按 Step 9 activation kind 定义 restart / new run / rerun / reject rollback | 否 | 可留在 04 Step 10 候选。 |
| 高风险配置必须评审、审计和 rollback plan | 否 | 配置治理规则,不新增 runtime contract。 |
| 新增正式 change-request object、audit object、rollback object、DTO、port、mapper、flow 或 persistence surface | 是 | 暂停并回 `03` owning Step。 |
| 引入 remote config center、admin override、hot reload、last-known-good live switch 或 real secret provider rotation API | 是 | 暂停并回 `03` / 架构。 |
| 配置或回滚改变 truth owner、state transition、query no-write、job no-truth-repair、body-free、stored replay、transaction boundary、marker source、public schema 或 P0/P1 隔离 | 是且越界 | 拒绝作为配置候选。 |

### 9. R10.5 入口

| 下一模块 | 允许范围 | 禁止范围 |
|---|---|---|
| `R10.5 配置变更表细化:先思考` | 围绕配置族变更表的最终列结构、分组顺序、review level 映射、activation 映射、audit field 映射、rollback 映射和 Step 7/8/9/11 回指做先思考。 | 不创建正式 `04-配置设计.md`;不写最终配置变更表、最终审计规则、最终回滚矩阵、测试方案、验收标准、实施计划或代码。 |

### 10. R10.4 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只固化 R10.3 候选 | pass | 未把候选升级为最终 Step 10 表。 |
| 是否覆盖 SOP 八问 | pass | 已写入八问候选回答记录。 |
| 是否覆盖 actor / review / config family / audit / rollback / sensitive | pass | 已分别写入候选记录。 |
| 是否保持 03 回写门禁 | pass | 新增对象、port、DTO、mapper、flow、hot reload、secret provider 均标记需回 `03`。 |
| 是否可进入 R10.5 | pass | 等待用户确认后进入配置变更表细化先思考。 |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.5 配置变更表细化:先思考`;只允许围绕配置族变更表的列结构、分组顺序、review level 映射、activation 映射、audit field 映射、rollback 映射和 Step 7 / Step 8 / Step 9 / Step 11 回指做先思考;不得创建正式 `04-配置设计.md`;不得写最终配置变更表、最终审计规则、最终回滚矩阵、测试方案、验收标准、实施计划或代码。

## R10.5 配置变更表细化:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.6 |
| 本模块目标 | 思考 Step 10 配置变更表的正式六列如何从 R10.4 候选记录中收敛,并建立 R10.6 写入计划。 |
| 本模块允许 | 思考列结构、分组顺序、review level 映射、activation 映射、audit field 映射、rollback 映射、Step 7 / 8 / 9 / 11 回指和 R10.6 入口。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写最终配置变更表;不写最终审计规则、最终回滚矩阵、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R10.4 已把 SOP 八问和配置族变更候选固化为可恢复记录;用户已确认进入 R10.5。 |

### 2. 正式六列与中间产物辅助列思考

| 表达层 | 列 | 作用 | R10.5 裁决 |
|---|---|---|---|
| 正式 `04` 六列 | 变更类型 | 面向读者说明配置族或变更类别。 | 必须保留,不额外拆成 key / env / default。 |
| 正式 `04` 六列 | 发起方 | 说明 operator、release automation、job runner、entry caller、test harness 或 design change。 | 必须保留,actor 使用产品中立 ref。 |
| 正式 `04` 六列 | 评审要求 | 说明 low / medium / high / critical 和评审 / reject 口径。 | 必须保留,不得写具体工单系统。 |
| 正式 `04` 六列 | 生效方式 | 说明 startup、job-run-start、entry-local、test harness、rejected。 | 必须保留,hot / reload 只能出现为 rejected / unsupported。 |
| 正式 `04` 六列 | 审计记录 | 摘要列出 safe refs / digest / issue / rollback refs。 | 必须保留,不得放 raw config / raw secret / full sensitive ref。 |
| 正式 `04` 六列 | 回滚方式 | 摘要列出 restart / new run / rerun / no activation。 | 必须保留,不得写 stored report / truth rewrite。 |
| 中间产物辅助列 | Step 回指 | 标记 Step 7 / 8 / 9 / 11 来源。 | 只留在 calibration,正式 04 可用简短文字承接,不一定成列。 |
| 中间产物辅助列 | 风险 / redline | 标记敏感泄露、reload/hot、truth override 等风险。 | 只留在 calibration 和停审表,避免正式主表过宽。 |
| 中间产物辅助列 | 03 影响 | 标记是否需要回详细设计。 | 留在本 Step 影响判定表,不混入正式变更表。 |

### 3. 配置变更表分组顺序思考

| 分组顺序 | 配置族 | 排序理由 | R10.6 写入注意 |
|---|---|---|---|
| 1 | runtime profile / strict validation | 所有后续配置的 profile / validation 上下文。 | 先写,但不得允许 profile 放松 P0/P1 隔离。 |
| 2 | stores | runtime builder 与 repository adapter 的基础依赖。 | durable ref 必须 high review,raw DSN 禁止。 |
| 3 | external resolvers | 外部摘要 / 引用读取依赖,与 adapter availability 相关。 | 不允许 fallback fake 破坏 profile 选择。 |
| 4 | inbound consumers | 只承接 body-free inbound fact,但 namespace / version / dedup 是启动配置。 | unsupported version 不通过变更修复 truth。 |
| 5 | outbox publisher / transport topic | 负责 candidate publication / route binding,风险高。 | topic / route 只用 ref / digest。 |
| 6 | jobs | batch / timeout / retry / checkpoint / replay root 的运行输入。 | 区分 startup default 与 job-run-start override。 |
| 7 | handoff / archive | 下游 target / archive target,敏感且 body-free。 | package body / credential 禁入 audit。 |
| 8 | externalGrc | 默认 disabled,enablement / target 需要高风险评审。 | enabled 缺 adapter / target 必须 fail-fast / reject。 |
| 9 | redaction / diagnostics | 安全输出和诊断控制,变更风险高。 | redaction relax 可能 critical reject。 |
| 10 | boundary / idempotency / retention | 影响 page / time / duplicate replay / retention。 | widening / retention 改动要 high review。 |
| 11 | projection / reference defaults | 影响 stale / rebuild / refresh,但不得改变 marker source。 | job no-truth-repair 必须写入风险。 |
| 12 | clock/id/test fixtures | profile 约束强,测试与 operations-replay 相关。 | fixture 不得进入 production-like。 |
| 13 | forbidden / critical attempts | raw secret、hot/reload、truth override 等拒绝项。 | 作为 rejected change type,不作为可生效配置族。 |

### 4. Review level 映射思考

| Review level | 映射规则 | 典型变更族 | R10.6 写入口径 |
|---|---|---|---|
| low | 只收窄数值或 entry-local 当前选择,且不改变全局 invariant。 | batch / timeout / page limit 收窄、entry selector。 | 可由 automation / caller 执行,仍需审计。 |
| medium | 影响 local / CI / integration-like 装配,但不触达 durable product / external target / redaction relax。 | fake / controlled adapter refs、test fixture refs、profile 切换。 | 需要 reviewer / release approval ref。 |
| high | 影响 durable ref、target、route、publisher、externalGrc、retention、replay root 或安全诊断。 | store refs、resolver refs、topic / target refs、externalGrc enablement、retention。 | 必须评审、审计和 rollback plan。 |
| critical | 试图放开安全红线或改变设计不变量。 | raw secret、raw body、hot/reload、truth override、query write、redaction unsafe relax。 | P0 reject 或正式 design change,不激活。 |

### 5. Activation 映射思考

| Activation | 可映射配置 | 失败处理 | 表中写法 |
|---|---|---|---|
| startup | runtime、stores、resolver、consumer、outbox/topic、jobs defaults、handoff targets、externalGrc defaults、redaction、boundary、idempotency、projection/reference、clock/id。 | validation fail-fast;builder Failed;facade 不暴露。 | `startup restart`。 |
| job-run-start | job input scope、batch、target、replay root、允许的 run-local selector。 | job rejected;需要 new run。 | `job-run-start new run`。 |
| entry-local | current entry profile / source / dry-run selector。 | current entry rejected;caller rerun。 | `entry-local rerun`。 |
| test harness | fixture set、fixed clock/id、fake adapter seed。 | test fail-fast;rerun test。 | `test harness rerun`。 |
| rejected | raw secret、hot/reload、truth override、redaction unsafe relax 等 critical attempt。 | no activation;record rejected issue。 | `rejected / no activation`。 |

### 6. Audit field 映射思考

| 变更族 | 审计字段候选 | 禁止字段 |
|---|---|---|
| ordinary startup config | change_request_ref、actor_ref、reason_ref、config_section、profile_ref、old/new config digest、validation_result。 | raw config、env body、free-text secret。 |
| sensitive refs | config_section、profile_ref、old/new ref digest、validation_issue_ref、safe_diagnostic_ref。 | full sensitive ref、endpoint、route credential、DSN。 |
| job-run-start input | job_run_ref、actor/job_runner_ref、input digest、target digest、validation_result、rollback_run_ref。 | raw target credential、raw historical body、report body。 |
| entry-local selector | entry_ref、selector digest、rejection issue ref。 | request body、caller free text、global config mutation。 |
| test harness / fixture | test_run_ref、fixture digest、profile、validation_result。 | raw fixture body、production secret、raw artifact。 |
| rejected critical attempt | actor/source ref when safe、forbidden key class、validation_issue_ref。 | raw invalid value、secret、hot reload payload。 |

### 7. Rollback 映射思考

| 变更类型 | rollback target | rollback action | 禁止动作 |
|---|---|---|---|
| startup config | previous validated / approved config digest。 | restore digest and restart。 | hot patch、skip validator、use invalid fallback。 |
| sensitive ref | previous approved ref digest。 | restore ref and restart or new job。 | reveal full ref、reuse failed raw secret。 |
| job-run-start input | previous valid input digest。 | start new job run。 | mutate stored report、reuse conflicting idempotency key with different digest。 |
| entry-local selector | previous selector digest。 | caller rerun current entry。 | persist selector into global config。 |
| test fixture | previous fixture ref / digest。 | rerun test。 | allow fixture in production-like。 |
| critical rejected | no runtime target because no activation。 | record rejected issue;require design change if needed。 | emergency activation。 |

### 8. Step 回指与停审映射思考

| 回指维度 | 表中最小表达 | 停审检查 |
|---|---|---|
| Step 7 配置项 | 变更类型必须能对应 Step 7 配置族或 excluded critical attempt。 | 无来源配置族不得进入 R10.6。 |
| Step 8 敏感性 | sensitive / secret / internal safety-critical 族必须进入附加审计。 | raw secret / full ref 泄露即停审失败。 |
| Step 9 生效机制 | 每行必须映射 startup、job-run-start、entry-local、test harness 或 rejected。 | hot / reload 成功路径即停审失败。 |
| Step 11 失效策略 | 每行必须预留 fail-fast / reject / new run / rerun / no activation 承接。 | silent fallback 即停审失败。 |
| `03` 影响 | 每行不得新增 object / port / DTO / mapper / flow。 | 需要新增契约则暂停回 `03`。 |

### 9. R10.6 写入计划

| R10.6 拟写内容 | 写入边界 |
|---|---|
| 表结构记录 | 写正式六列和中间产物辅助列的裁决。 |
| 分组顺序记录 | 写 13 个配置族的排序、理由和注意事项。 |
| review level mapping | 写 low / medium / high / critical 映射规则。 |
| activation mapping | 写 startup / job-run-start / entry-local / test harness / rejected 映射规则。 |
| audit field mapping | 写 ordinary / sensitive / job / entry / fixture / rejected 字段族。 |
| rollback mapping | 写 previous digest / new run / rerun / no activation 映射。 |
| Step 回指和停审映射 | 写 Step 7 / 8 / 9 / 11 / 03 的最小回指和停审规则。 |
| R10.7 入口 | 进入配置变更表候选逐行整理的下一模块,不得自动写最终审计规则或回滚矩阵。 |

### 10. R10.5 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做表细化思考 | pass | 未写最终配置变更表。 |
| 是否保留正式六列 | pass | 变更类型、发起方、评审要求、生效方式、审计记录、回滚方式均保留。 |
| 是否避免正式表过宽 | pass | Step 回指、风险和 03 影响作为中间产物辅助,不强行进入正式六列。 |
| 是否映射 Step 7 / 8 / 9 / 11 | pass | 已写配置族、敏感性、生效方式和失效承接映射。 |
| 是否可进入 R10.6 | pass | 等待用户确认后进入配置变更表细化再写入。 |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.6 配置变更表细化:再写入`;只允许把 R10.5 的表结构、分组顺序、review level 映射、activation 映射、audit field 映射、rollback 映射和 Step 回指 / 停审映射写成可恢复记录;不得创建正式 `04-配置设计.md`;不得写最终配置变更表、最终审计规则、最终回滚矩阵、测试方案、验收标准、实施计划或代码。

## R10.6 配置变更表细化:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.7 |
| 本模块目标 | 将 R10.5 关于配置变更表列结构、分组、review、activation、audit、rollback 和 Step 回指的思考固化为可恢复记录。 |
| 本模块允许 | 写入表结构裁决、分组顺序、映射规则、停审映射、R10.7 入口和本模块停审记录。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写最终配置变更表逐行内容;不写最终审计规则、最终回滚矩阵、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R10.5 已完成配置变更表细化先思考;用户已确认进入 R10.6。 |

### 2. 表结构裁决记录

| 表达层 | 裁决 | 说明 |
|---|---|---|
| 正式 `04` 主表 | 保留 SOP 六列。 | `变更类型 / 发起方 / 评审要求 / 生效方式 / 审计记录 / 回滚方式` 是正式章节主表。 |
| 中间产物辅助表 | 保留 Step 回指、风险 / redline、03 影响。 | 用于追踪和停审,不强制进入正式主表,避免正式 §10 过宽。 |
| key / env / default | 不进入 Step 10 主表。 | 这些属于 Step 7 配置项清单或后续正式配置示例,不是变更治理列。 |
| 具体工单字段 | 不进入。 | 只允许 product-neutral refs,不绑定审批或工单产品。 |
| 最终逐行内容 | 本模块不写。 | R10.6 只固化表结构,候选逐行整理从 R10.7 开始。 |

### 3. 分组顺序记录

| 顺序 | 配置族 | 进入 R10.7 的处理口径 |
|---|---|---|
| 1 | runtime profile / strict validation | 先处理 profile / validation,但不得放松 P0/P1 隔离。 |
| 2 | stores | high review;只允许 ref / digest,不得写 DSN 或 credential。 |
| 3 | external resolvers | high 或 medium;不得 fallback fake 破坏 profile 装配。 |
| 4 | inbound consumers | startup;unsupported version 不能通过配置修复 truth。 |
| 5 | outbox publisher / transport topic | high review;topic / route 只表达为 ref / digest。 |
| 6 | jobs | 区分 startup defaults 与 job-run-start run-local input。 |
| 7 | handoff / archive | high review;target / package / archive body 禁入审计。 |
| 8 | externalGrc | enablement 与 target 高风险;默认 disabled 不能被低风险变更绕过。 |
| 9 | redaction / diagnostics | redaction relax 可能 critical reject;diagnostic 只 safe ref。 |
| 10 | boundary / idempotency / retention | widening 或 retention 改动需 high review;duplicate replay 不可被配置关闭。 |
| 11 | projection / reference defaults | 只能影响 numeric handle / defaults,不得改变 marker source 或 job no-truth-repair。 |
| 12 | clock/id/test fixtures | test / replay profile 约束强;fixture 不得进入 production-like。 |
| 13 | forbidden / critical attempts | 作为 rejected change type 处理,不作为可生效配置族。 |

### 4. Review level 映射记录

| Review level | 固化规则 | R10.7 逐行填充要求 |
|---|---|---|
| low | 只允许收窄数值或当前 entry 选择,且不改变全局 invariant。 | 审计仍必填,不得因 low 省略 audit。 |
| medium | 影响 local / CI / integration-like 装配,但不触达 durable target 或 redaction relax。 | 需要 reviewer / release approval ref。 |
| high | 影响 durable ref、target、route、publisher、externalGrc、retention、replay root 或安全诊断。 | 必须写评审、审计和 rollback plan。 |
| critical | 试图放开安全红线或改变设计不变量。 | 写成 rejected / design change,不得激活。 |

### 5. Activation 映射记录

| Activation | 固化规则 | R10.7 逐行填充要求 |
|---|---|---|
| startup | runtime builder 前加载、校验、冻结,失败不暴露 facade。 | 表中写 `startup restart`。 |
| job-run-start | 只影响当前 job run,失败为 job rejected。 | 表中写 `job-run-start new run`。 |
| entry-local | 只影响当前 entry,失败为 current entry rejected。 | 表中写 `entry-local rerun`。 |
| test harness | 只影响 test harness / fake runtime / fixture。 | 表中写 `test harness rerun`。 |
| rejected | critical attempt 不激活。 | 表中写 `rejected / no activation`。 |

### 6. Audit field 映射记录

| 变更类别 | 审计字段族 | 禁止内容 |
|---|---|---|
| ordinary startup config | change_request_ref、actor_ref、reason_ref、config_section、profile_ref、old/new config digest、validation_result。 | raw config、env body、free-text secret。 |
| sensitive refs | config_section、profile_ref、old/new ref digest、validation_issue_ref、safe_diagnostic_ref。 | full sensitive ref、endpoint、route credential、DSN。 |
| job-run-start input | job_run_ref、job_runner_ref、input digest、target digest、validation_result、rollback_run_ref。 | raw target credential、raw historical body、report body。 |
| entry-local selector | entry_ref、selector digest、rejection issue ref。 | request body、caller free text、global config mutation。 |
| test harness / fixture | test_run_ref、fixture digest、profile、validation_result。 | raw fixture body、production secret、raw artifact。 |
| rejected critical attempt | safe actor/source ref、forbidden key class、validation_issue_ref。 | raw invalid value、secret、hot reload payload。 |

### 7. Rollback 映射记录

| 变更类别 | rollback target | rollback action | 禁止动作 |
|---|---|---|---|
| startup config | previous validated / approved config digest。 | restore digest and restart。 | hot patch、skip validator、invalid fallback。 |
| sensitive ref | previous approved ref digest。 | restore ref and restart or new job。 | reveal full ref、reuse failed raw secret。 |
| job-run-start input | previous valid input digest。 | start new job run。 | mutate stored report、rewrite idempotency result。 |
| entry-local selector | previous selector digest。 | caller rerun current entry。 | persist selector into global config。 |
| test fixture | previous fixture ref / digest。 | rerun test。 | allow fixture in production-like。 |
| critical rejected | no runtime target because no activation。 | record rejected issue;require design change if needed。 | emergency activation。 |

### 8. Step 回指 / 停审映射记录

| 回指维度 | R10.6 固化规则 | 停审失败条件 |
|---|---|---|
| Step 7 配置项 | 每个变更类型必须来自 Step 7 配置族或 forbidden / critical attempt。 | 无来源配置族进入逐行表。 |
| Step 8 敏感性 | sensitive / secret / internal safety-critical 必须触发附加审计。 | raw secret、full ref 或 credential 进入审计。 |
| Step 9 生效机制 | 每行必须映射到 startup、job-run-start、entry-local、test harness 或 rejected。 | hot / reload 成功路径出现。 |
| Step 11 失效策略 | 每行必须预留 fail-fast、reject、new run、rerun 或 no activation 承接。 | silent fallback 或不可判定失败处理。 |
| `03` 影响 | 每行不得新增 object / port / DTO / mapper / flow / persistence surface。 | 需要新增契约却未回 `03`。 |

### 9. R10.7 入口

| 下一模块 | 允许范围 | 禁止范围 |
|---|---|---|
| `R10.7 配置变更表候选逐行整理:先思考` | 围绕 13 个配置族逐行思考候选变更类型、发起方、评审要求、生效方式、审计记录、回滚方式和辅助回指 / 风险,为 R10.8 写入候选逐行表做准备。 | 不创建正式 `04-配置设计.md`;不写最终配置变更表;不写最终审计规则、最终回滚矩阵、测试方案、验收标准、实施计划或代码。 |

### 10. R10.6 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只固化 R10.5 思考 | pass | 未写最终逐行配置变更表。 |
| 是否保留正式六列 | pass | 正式主表仍为 SOP 六列。 |
| 是否明确中间产物辅助表 | pass | Step 回指、风险 / redline、03 影响只作为辅助记录。 |
| 是否覆盖 review / activation / audit / rollback 映射 | pass | 四类映射均已固化。 |
| 是否可进入 R10.7 | pass | 等待用户确认后进入配置变更表候选逐行整理先思考。 |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.7 配置变更表候选逐行整理:先思考`;只允许围绕 13 个配置族逐行思考候选变更类型、发起方、评审要求、生效方式、审计记录、回滚方式和辅助回指 / 风险;不得创建正式 `04-配置设计.md`;不得写最终配置变更表、最终审计规则、最终回滚矩阵、测试方案、验收标准、实施计划或代码。

## R10.7 配置变更表候选逐行整理:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.8 |
| 本模块目标 | 围绕 R10.6 固化的 13 个配置族,思考后续候选配置变更表应拆成哪些行,以及每行的 actor / review / activation / audit / rollback / 回指风险。 |
| 本模块允许 | 写候选行拆分思考、逐族候选行、辅助回指 / 风险思考、03 影响预判和 R10.8 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不把候选行升级为最终配置变更表;不写最终审计规则、最终回滚矩阵、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R10.6 已固化表结构、分组顺序、review / activation / audit / rollback 映射和 Step 回指 / 停审映射;用户已确认进入 R10.7。 |

### 2. 候选行拆分原则思考

| 原则 | R10.7 思考结论 | R10.8 写入注意 |
|---|---|---|
| 以变更类型成行 | 行名应表达“哪类配置变更”,而不是列出每个 key。 | 避免把 Step 7 配置项清单重复成 Step 10 表。 |
| 同风险同 activation 可合并 | 相同 actor、review、activation、audit 和 rollback 的相邻配置项可合为一个变更类型。 | 合并后必须仍能回指 Step 7 / 8 / 9。 |
| sensitive ref 单独显式 | store / adapter / route / target / replay 这类 sensitive ref 变更必须有明确行。 | 审计列必须写 redacted digest,不能写 full ref。 |
| critical attempt 单独显式 | raw secret、hot/reload、truth override、redaction unsafe relax 等拒绝项应有 rejected 行。 | 不作为可生效配置族。 |
| job-run-start 与 startup 分开 | 同一配置族若同时有 startup default 和 run-local override,应拆行。 | 防止 job input 被误解为全局覆盖。 |
| fixture/test 与 runtime 分开 | test harness 配置与 runtime/staging/production-like 配置必须分离。 | 防止 fake / fixture 泄露到 production-like。 |

### 3. Startup 配置候选行思考

| 配置族 | 候选变更类型 | 发起方思考 | review 思考 | activation 思考 | audit / rollback 思考 |
|---|---|---|---|---|---|
| runtime profile / strict validation | runtime profile / strict validation change | operator / release automation;entry selector 另行处理 | medium;production-like / unsafe relax 为 critical | startup restart | old/new config digest;previous validated config restart |
| stores | durable store ref / logical store binding change | operator / release automation | high | startup restart | old/new ref digest;restore previous approved store ref |
| external resolvers | resolver family / adapter ref / mode change | operator / release automation | medium to high | startup restart | family + ref digest + availability marker;restore previous adapter ref |
| inbound consumers | inbound namespace / version / dedup retention change | operator / release automation | medium;retention conflict high | startup restart | namespace set digest / version / retention;restore previous config |
| outbox publisher / topic | publisher adapter / topic-neutral route binding change | operator / release automation | high | startup restart | publisher slot / route digest / topic coverage;restore previous route map |
| jobs | job defaults / enabled kind set change | operator / release automation | low to medium;external / handoff jobs high | startup restart | job kind set / default digest;restore previous defaults |
| handoff / archive | handoff target set / archive target set change | operator / release automation | high | startup restart | target digest / marker refs;restore previous target set |
| externalGrc | externalGrc enablement / adapter binding change | operator / release automation | high | startup restart | enabled from/to + adapter digest;restore previous enablement |
| redaction / diagnostics | deny list / diagnostic prefix / high-cardinality guard change | operator / release automation | high;unsafe relax critical | startup restart or rejected | added/removed digest;restore previous deny list |
| boundary / idempotency / retention | boundary limit / retention policy change | operator / release automation | low for narrowing;high for widening / retention | startup restart | limit class / retention digest;restore previous policy |
| projection / reference defaults | projection / reference stale threshold and batch defaults change | operator / release automation | medium | startup restart | job default digest;restore previous defaults |
| clock/id | clock / id generator ref change | operator / release automation | medium;production-like future high | startup restart | clock/id slot + profile;restore previous port ref |

### 4. Run-local / entry-local / test 候选行思考

| 配置族 | 候选变更类型 | 发起方思考 | review 思考 | activation 思考 | audit / rollback 思考 |
|---|---|---|---|---|---|
| jobs | job-run-start batch / timeout / scope override | authorized job runner | low to medium;widening beyond startup max rejected | job-run-start new run | job_run_ref + input digest;new run with previous input |
| handoff / archive | per-run handoff / archive target selection | authorized job runner | high when target sensitive | job-run-start new run | target digest + job run ref;new run with previous target |
| externalGrc | per-run externalGrc target / export batch selection | authorized job runner | high | job-run-start new run | target digest + export marker refs;new run with previous input |
| projection / reference | per-run rebuild / refresh batch narrowing | authorized job runner | low to medium | job-run-start new run | job kind + batch digest;new run with previous input |
| replay / fixture root | operations-replay artifact root selection | authorized job runner / test harness | high for operations replay;medium for test fixture | job-run-start or test harness rerun | root digest + de-identification marker;rerun with previous root |
| runtime entry | entry-local profile / config source selector | entry caller | low unless selector crosses profile boundary | entry-local rerun | entry ref + selector digest;caller rerun previous selector |
| test fixture | test fixture / fixed clock / fixed id seed change | test harness | medium | test harness rerun | test run ref + fixture digest;rerun previous fixture |

### 5. Rejected / critical attempt 候选行思考

| 候选变更类型 | 触发条件 | actor 思考 | review 思考 | activation 思考 | audit / rollback 思考 |
|---|---|---|---|---|---|
| raw secret / raw body config attempt | ordinary config、env、entry、job input 或 fixture 直接提供 secret/body。 | any source | critical reject | rejected / no activation | forbidden key class + validation issue;no rollback target |
| hot reload / runtime reload request | 配置或来源要求 runtime hot / reload 成功路径。 | any source | critical reject / design change | rejected / no activation | unsupported reload issue;requires design change |
| truth / state / query / job invariant override | 配置试图改变 truth owner、state transition、query no-write、job no-truth-repair、stored replay 或 marker source。 | any source | critical reject | rejected / no activation | forbidden boundary issue;no runtime rollback |
| redaction unsafe relax | 移除 deny field、打开 high-cardinality、允许 raw body diagnostic。 | operator / release automation | critical unless future design change | rejected / no activation | redaction unsafe issue;restore unchanged active config |
| fake / fixture in production-like | fixture、fake adapter、fixed id/clock 进入 production-like。 | operator / test harness | critical reject | rejected / no activation | profile violation issue;no runtime rollback |

### 6. 辅助回指 / 风险思考

| 候选行组 | Step 7 回指 | Step 8 回指 | Step 9 回指 | Step 11 承接 | 风险 |
|---|---|---|---|---|---|
| startup runtime / store / resolver / publisher | runtime、stores、resolver、outbox families | store / adapter / route refs sensitive | startup | fail-fast / unavailable | full ref 泄露、fallback fake。 |
| job / handoff / externalGrc run-local | jobs、handoff、externalGrc families | target / replay root sensitive | job-run-start | job rejected / new run | stored report rewrite、target credential 泄露。 |
| redaction / diagnostics | diagnostics / redaction family | internal safety-critical | startup / rejected | fail-fast / no activation | unsafe relax、raw diagnostic。 |
| boundary / retention / idempotency | boundary、idempotency、projection/reference families | mostly internal | startup / job-run-start narrowing | fail-fast / reject | duplicate replay 语义变化。 |
| test / fixture | clockId、testFixtures families | replay root sensitive | test harness / operations-replay | test fail-fast / replay reject | fixture 泄露、raw historical body。 |
| critical attempt | forbidden boundary / excluded watch | secret / raw body forbidden | rejected | no activation | config center / admin override / hot reload 被误写成 P0。 |

### 7. 对 03 的影响预判

| 候选行类型 | 是否影响 03 | 处理 |
|---|---|---|
| 只描述 existing config families 的变更治理、审计和 rollback | 否 | R10.8 可写入候选行记录。 |
| 只使用 Step 9 activation 和 Step 8 safe audit / redaction 规则 | 否 | R10.8 可写入候选行记录。 |
| 需要新增正式 change-request / audit / rollback object 或 port | 是 | 不进入 R10.8,暂停回 `03`。 |
| 需要 config center / admin override / hot reload / secret provider runtime contract | 是 | 不进入 R10.8,暂停回 `03` / 架构。 |
| 候选行允许配置改变 truth / state / query / job / marker / transaction / replay / public schema | 越界 | 删除候选,写为 critical rejected attempt。 |

### 8. R10.8 写入计划

| R10.8 拟写内容 | 写入边界 |
|---|---|
| candidate row table | 把 R10.7 的 startup、run-local、entry-local、test、critical rejected 候选行写成中间产物表。 |
| auxiliary trace table | 写 Step 7 / 8 / 9 / 11 / 03 回指和风险辅助表。 |
| row-level stop-review | 检查每个候选行是否有 actor、review、activation、audit、rollback 和回指。 |
| R10.9 入口 | 进入审计记录规则候选:先思考,不得自动写最终审计规则或最终回滚矩阵。 |

### 9. R10.7 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做逐行候选思考 | pass | 未写最终配置变更表。 |
| 是否覆盖 13 个配置族 | pass | startup、run-local、test 和 critical rejected 均已覆盖。 |
| 是否保留六列映射 | pass | 每个候选行均思考 actor、review、activation、audit 和 rollback。 |
| 是否保留 critical reject | pass | raw secret、hot/reload、truth override、redaction unsafe relax、fake in production-like 均单独列出。 |
| 是否可进入 R10.8 | pass | 等待用户确认后进入配置变更表候选逐行整理再写入。 |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.8 配置变更表候选逐行整理:再写入`;只允许把 R10.7 的 startup、run-local、entry-local、test 和 critical rejected 候选行写成中间产物候选表,并写辅助回指 / 风险和 row-level stop-review;不得创建正式 `04-配置设计.md`;不得写最终配置变更表、最终审计规则、最终回滚矩阵、测试方案、验收标准、实施计划或代码。

## R10.8 配置变更表候选逐行整理:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.9 |
| 本模块目标 | 将 R10.7 的 startup、run-local、entry-local、test 和 critical rejected 候选行写成可恢复的中间产物候选表。 |
| 本模块允许 | 写入候选行表、辅助回指 / 风险表、row-level stop-review、03 影响判定和 R10.9 入口。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不把候选表升级为最终配置变更表;不写最终审计规则、最终回滚矩阵、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R10.7 已完成配置变更表候选逐行整理先思考;用户已确认进入 R10.8。 |

### 2. Startup 配置变更候选行记录

| Candidate ID | 变更类型 | 发起方 | 评审要求 | 生效方式 | 审计记录 | 回滚方式 |
|---|---|---|---|---|---|---|
| C10-START-001 | runtime profile / strict validation change | operator / release automation | medium;production-like 放松或 P0/P1 隔离变更为 critical reject | startup restart | change_request_ref、actor_ref、reason_ref、profile_ref、old/new config digest、validation_result | restore previous validated config digest and restart |
| C10-START-002 | durable store ref / logical store binding change | operator / release automation | high | startup restart | config_section、profile_ref、old/new store ref digest、validation_result、safe_diagnostic_ref | restore previous approved store ref digest and restart |
| C10-START-003 | resolver family / adapter ref / mode change | operator / release automation | medium to high;production-like fake fallback 为 critical reject | startup restart | resolver family、adapter ref digest、availability marker、validation_result | restore previous approved adapter ref digest and restart |
| C10-START-004 | inbound namespace / version / dedup retention change | operator / release automation | medium;retention widening 或 namespace 冲突为 high | startup restart | namespace set digest、version set digest、dedup retention digest、validation_result | restore previous validated inbound config and restart |
| C10-START-005 | publisher adapter / topic-neutral route binding change | operator / release automation | high | startup restart | publisher slot、route map digest、topic coverage marker、validation_result | restore previous route map digest and restart |
| C10-START-006 | job defaults / enabled kind set change | operator / release automation | low to medium;external / handoff job enablement 为 high | startup restart | job kind set digest、default batch / timeout digest、validation_result | restore previous job default digest and restart |
| C10-START-007 | handoff target set / archive target set change | operator / release automation | high | startup restart | target set digest、archive target digest、marker refs、validation_result | restore previous approved target set digest and restart |
| C10-START-008 | externalGrc enablement / adapter binding change | operator / release automation | high | startup restart | enabled from/to、adapter ref digest、target digest、validation_result | restore previous externalGrc enablement and adapter ref digest |
| C10-START-009 | deny list / diagnostic prefix / high-cardinality guard change | operator / release automation | high;unsafe relax 为 critical reject | startup restart or rejected / no activation | added/removed digest、diagnostic prefix digest、validation_issue_ref | restore previous deny list / diagnostic guard digest and restart |
| C10-START-010 | boundary limit / retention policy change | operator / release automation | low for narrowing;high for widening / retention | startup restart | limit class、old/new limit digest、retention policy digest、validation_result | restore previous boundary / retention digest and restart |
| C10-START-011 | projection / reference stale threshold and batch defaults change | operator / release automation | medium;marker source 变更为 critical reject | startup restart | projection / reference default digest、stale threshold digest、validation_result | restore previous projection / reference defaults and restart |
| C10-START-012 | clock / id generator ref change | operator / release automation | medium;production-like fixed fixture 为 critical reject | startup restart | clock slot、id slot、profile_ref、old/new port ref digest、validation_result | restore previous approved clock / id port ref and restart |

### 3. Run-local / entry-local / test 候选行记录

| Candidate ID | 变更类型 | 发起方 | 评审要求 | 生效方式 | 审计记录 | 回滚方式 |
|---|---|---|---|---|---|---|
| C10-RUN-001 | job-run-start batch / timeout / scope override | authorized job runner | low to medium;超过 startup max 或 widening conflict 为 rejected | job-run-start new run | job_run_ref、job_runner_ref、input digest、validation_result、rollback_run_ref | start new job run with previous valid input digest |
| C10-RUN-002 | per-run handoff / archive target selection | authorized job runner | high when target sensitive | job-run-start new run | job_run_ref、target digest、archive target digest、validation_result | start new job run with previous target digest |
| C10-RUN-003 | per-run externalGrc target / export batch selection | authorized job runner | high | job-run-start new run | job_run_ref、externalGrc target digest、export batch digest、marker refs | start new job run with previous validated export input |
| C10-RUN-004 | per-run rebuild / refresh batch narrowing | authorized job runner | low to medium | job-run-start new run | job_run_ref、job kind、batch narrowing digest、validation_result | start new job run with previous batch input |
| C10-RUN-005 | operations-replay artifact root selection | authorized job runner / test harness | high for operations replay;medium for test fixture | job-run-start new run or test harness rerun | replay root digest、de-identification marker、validation_result | rerun with previous approved replay root digest |
| C10-ENTRY-001 | entry-local profile / config source selector | entry caller | low unless selector crosses profile boundary | entry-local rerun | entry_ref、selector digest、rejection issue ref when failed | caller rerun with previous selector digest |
| C10-TEST-001 | test fixture / fixed clock / fixed id seed change | test harness | medium;production-like usage 为 critical reject | test harness rerun | test_run_ref、fixture digest、fixed clock/id seed digest、validation_result | rerun test with previous fixture ref / digest |

### 4. Critical rejected 候选行记录

| Candidate ID | 变更类型 | 发起方 | 评审要求 | 生效方式 | 审计记录 | 回滚方式 |
|---|---|---|---|---|---|---|
| C10-REJECT-001 | raw secret / raw body config attempt | any source | critical reject | rejected / no activation | safe actor/source ref when available、forbidden key class、validation_issue_ref | no runtime target;record rejected issue |
| C10-REJECT-002 | hot reload / runtime reload request | any source | critical reject or future design change | rejected / no activation | unsupported reload issue、source class、safe diagnostic ref | no runtime target;requires design change if future scope |
| C10-REJECT-003 | truth / state / query / job invariant override | any source | critical reject | rejected / no activation | forbidden boundary class、validation_issue_ref、safe source ref | no runtime target;do not mutate truth / state / report |
| C10-REJECT-004 | redaction unsafe relax | operator / release automation | critical unless future design change | rejected / no activation | redaction unsafe issue、removed guard digest、safe diagnostic ref | keep active config unchanged;no runtime rollback |
| C10-REJECT-005 | fake / fixture in production-like | operator / test harness | critical reject | rejected / no activation | profile violation issue、fixture class digest、safe source ref | no runtime target;fix profile / fixture selection |

### 5. 辅助回指 / 风险记录

| 候选行范围 | Step 7 回指 | Step 8 回指 | Step 9 回指 | Step 11 承接 | 03 影响 / 风险 |
|---|---|---|---|---|---|
| C10-START-001 | runtime profile / strict validation | internal safety-critical | startup | fail-fast / no facade exposure | 不改变 P0/P1 隔离;若需 runtime reload 则回 `03`。 |
| C10-START-002 ~ C10-START-005 | stores、external resolvers、inbound、outbox publisher / route | store / adapter / route refs sensitive | startup | fail-fast / adapter unavailable | full ref / credential 不进审计;不得 fallback fake。 |
| C10-START-006 ~ C10-START-008 | jobs、handoff / archive、externalGrc | target / archive / adapter refs sensitive | startup | fail-fast / rejected when missing target | 不得通过配置让 job 修复 truth 或重写 report。 |
| C10-START-009 | redaction / diagnostics | internal safety-critical | startup or rejected | fail-fast / no activation | redaction relax 不得绕过 Step 8 禁止输出。 |
| C10-START-010 ~ C10-START-012 | boundary / idempotency / retention、projection / reference、clock/id | mostly internal;test refs separated | startup | fail-fast / reject | 不得改变 stored replay、marker source 或 production-like clock/id 来源。 |
| C10-RUN-001 ~ C10-RUN-005 | jobs、handoff、externalGrc、projection/reference、operations replay | target / replay root sensitive | job-run-start / test harness | job rejected / new run | rollback 只能 new run;不得改写已存 report 或 replay surface。 |
| C10-ENTRY-001 | runtime entry selector | non-secret unless profile source sensitive | entry-local | current entry rejected / rerun | 不写入全局 config;不得跨 profile 边界。 |
| C10-TEST-001 | test fixture / clock/id | fixture / replay root sensitive | test harness | test fail-fast / rerun | fixture 不得进入 production-like。 |
| C10-REJECT-001 ~ C10-REJECT-005 | forbidden / critical attempts | raw secret / raw body / safety critical | rejected | no activation | 作为拒绝行保留,不得转成可生效配置。 |

### 6. Row-level stop-review 记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 每行是否有变更类型 | pass | C10-START / C10-RUN / C10-ENTRY / C10-TEST / C10-REJECT 均以变更类型成行。 |
| 每行是否有发起方 | pass | startup、run-local、entry-local、test 和 rejected 均记录 actor/source 范围。 |
| 每行是否有评审要求 | pass | low / medium / high / critical reject 均已映射,高风险和 critical 未降级。 |
| 每行是否有生效方式 | pass | 只使用 startup restart、job-run-start new run、entry-local rerun、test harness rerun、rejected / no activation。 |
| 每行是否有审计记录 | pass | 只记录 refs、digests、validation result、safe issue / diagnostic refs。 |
| 每行是否有回滚方式 | pass | rollback 只指向 previous validated / approved digest、new run、rerun 或 no activation。 |
| 每行是否有 Step 回指 | pass | 已通过辅助回指 / 风险表连接 Step 7 / 8 / 9 / 11 和 `03` 风险。 |
| 是否仍为候选表 | pass | 本模块不写最终配置变更表,不进入正式 `04-配置设计.md`。 |

### 7. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 将现有配置族变更整理为 candidate rows,只使用 Step 9 已闭合 activation kind | 否 | none | not_applicable | 无回写 |
| 审计字段只使用 safe refs / digest / issue / diagnostic refs,不新增审计 DTO 或 port | 否 | none | not_applicable | 无回写 |
| rollback 只表达 previous validated digest、new run、rerun 或 no activation | 否 | none | not_applicable | 无回写 |
| 若后续要求正式 change-request / audit / rollback object、port、mapper 或 persistence surface | 是 | object / port / mapper / persistence | `03-详细设计.md` owning Step | 阻塞待确认 |
| 若后续要求 config center、admin override、hot reload 或 live mutation contract | 是 | architecture / runtime flow | `01-架构设计.md` / `03-详细设计.md` owning Step | 阻塞待确认 |

### 8. R10.9 入口

| 下一模块 | 允许范围 | 禁止范围 |
|---|---|---|
| `R10.9 审计记录规则候选:先思考` | 围绕本模块候选行,思考 audit event scope、必填 safe metadata、redacted digest、validation issue、rollback ref、sensitive 变更附加审计和 rejected attempt 审计。 | 不创建正式 `04-配置设计.md`;不写最终审计规则;不写最终回滚矩阵、测试方案、验收标准、实施计划或代码。 |

### 9. R10.8 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只把 R10.7 思考写成候选表 | pass | Startup、run-local、entry-local、test、critical rejected 均已写成中间产物候选行。 |
| 是否保留 SOP 六列 | pass | 每行均包含变更类型、发起方、评审要求、生效方式、审计记录、回滚方式。 |
| 是否覆盖辅助回指 / 风险 | pass | 已单独记录 Step 7 / 8 / 9 / 11 / 03 回指和风险。 |
| 是否完成 row-level stop-review | pass | 每行 actor、review、activation、audit、rollback 和回指均通过候选停审。 |
| 是否避免正式化 | pass | 未写正式 `04-配置设计.md`,未写最终配置变更表、最终审计规则或最终回滚矩阵。 |
| 是否可进入 R10.9 | pass | 等待用户确认后进入审计记录规则候选先思考。 |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.9 审计记录规则候选:先思考`;只允许围绕 R10.8 候选行思考 audit event scope、必填 safe metadata、redacted digest、validation issue、rollback ref、sensitive 变更附加审计和 rejected attempt 审计;不得创建正式 `04-配置设计.md`;不得写最终审计规则、最终回滚矩阵、测试方案、验收标准、实施计划或代码。

## R10.9 审计记录规则候选:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.10 |
| 本模块目标 | 围绕 R10.8 候选行,思考审计记录规则候选应覆盖哪些事件范围、safe metadata、digest、validation issue、rollback ref 和敏感变更附加审计。 |
| 本模块允许 | 写 audit event scope 思考、safe metadata 字段族思考、redacted digest 思考、validation issue 思考、sensitive / rejected 审计思考、03 影响预判和 R10.10 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不把字段族固化为正式 audit DTO / schema / port;不写最终审计规则、最终回滚矩阵、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R10.8 已完成配置变更候选行、辅助回指 / 风险和 row-level stop-review;用户已确认进入 R10.9。 |

### 2. Audit event scope 思考

| Event scope 候选 | 适用候选行 | 记录目的 | R10.10 写入注意 |
|---|---|---|---|
| startup config change audit | C10-START-001 ~ C10-START-012 | 记录 startup 配置变更、校验结果、activation 和 rollback target。 | 只写字段族,不定义正式 audit object。 |
| sensitive ref change audit | C10-START-002、C10-START-003、C10-START-005、C10-START-007、C10-START-008、C10-RUN-002、C10-RUN-003、C10-RUN-005 | 记录 store / adapter / route / target / replay root ref digest 变化。 | 不记录 full sensitive ref、endpoint、credential、route body。 |
| run-local input audit | C10-RUN-001 ~ C10-RUN-005 | 记录 job-run-start frozen input、runner、validation 和 new-run rollback。 | 不把 run-local input 写成全局配置变更。 |
| entry-local selector audit | C10-ENTRY-001 | 记录当前 entry selector、profile/source boundary 和 rejected/rerun。 | 不记录 request body、caller free text 或持久化全局覆盖。 |
| test harness audit | C10-TEST-001 | 记录 fixture、fixed clock/id seed、profile compatibility 和 rerun。 | 明确 production-like 禁用 fixture。 |
| critical rejected attempt audit | C10-REJECT-001 ~ C10-REJECT-005 | 记录 raw secret/body、hot/reload、truth override、redaction unsafe relax、fake in production-like 等拒绝尝试。 | 审计 rejected issue,不创建 rollback target。 |
| rollback decision audit | all non-rejected candidate rows | 记录 previous validated digest、rollback run ref、rerun target 或 no activation。 | R10.9 只思考审计候选;回滚矩阵后续单独写。 |

### 3. Safe metadata 字段族思考

| 字段族候选 | 适用范围 | 允许内容 | 禁止内容 |
|---|---|---|---|
| identity / correlation refs | all audit scopes | change_request_ref、job_run_ref、entry_ref、test_run_ref、safe source ref。 | raw request body、free-text payload、secret material。 |
| actor / reason refs | operator / release automation / job runner / entry caller / test harness | actor_ref、job_runner_ref、reason_ref、approval_ref when available。 | actor free text with secret、chat transcript、ticket body。 |
| config locator | startup / sensitive / rejected | config_section、profile_ref、activation_kind、candidate family。 | raw config section body、env body、file path containing secret。 |
| old/new digest | startup / sensitive / run-local / test | old_config_digest、new_config_digest、old_ref_digest、new_ref_digest、input_digest、fixture_digest。 | full sensitive ref、DSN、endpoint、credential、route topic secret。 |
| validation result | all validated changes | validation_result、validation_issue_ref、safe error code、safe diagnostic_ref。 | raw invalid value、validator stack with secret、external response body。 |
| rollback refs | non-rejected changes | rollback_ref、previous approved digest、rollback_run_ref、previous selector digest。 | rollback script body、raw backup config、truth rewrite instruction。 |
| rejected issue refs | critical rejected attempts | forbidden key class、issue ref、safe source class、no activation marker。 | forbidden raw value、hot reload payload、raw secret/body。 |

### 4. Redacted digest 规则候选思考

| Digest 候选 | 输入范围 | 生成 / 使用思考 | 风险 |
|---|---|---|---|
| `config_digest` | ordinary startup config section after canonicalization | 用于比较 before/after 和 rollback target,只表达 digest。 | 若 digest 生成需要 raw secret,必须拒绝该输入而不是 hash secret。 |
| `ref_digest` | opaque store / adapter / route / target / replay refs | 用于敏感 ref 变更审计,不输出 full ref。 | ref 本身可能包含敏感拓扑,只能输出 digest。 |
| `input_digest` | job-run-start frozen input safe projection | 用于 run-local 变更审计和 new run rollback。 | 不得包含 package body、report body、raw target credential。 |
| `selector_digest` | entry-local profile / source selector safe projection | 用于 caller rerun 与 entry rejected 审计。 | 不得把 selector 持久化为全局配置。 |
| `fixture_digest` | test fixture / fixed clock / fixed id seed safe projection | 用于 test harness rerun。 | fixture 不能进入 production-like 审计成功路径。 |
| `removed_guard_digest` | redaction guard removed/changed set | 用于识别 unsafe relax 尝试。 | 不得输出被 redaction 匹配的 raw value。 |

### 5. Validation issue 与 rejected audit 思考

| Issue 类别 | 触发候选 | 审计候选 | R10.10 写入注意 |
|---|---|---|---|
| parse / type / range / cross-field issue | startup / job / entry / test config invalid | validation_issue_ref、config_section、profile_ref、activation_kind。 | 不写 raw invalid value。 |
| forbidden secret/body issue | C10-REJECT-001 | forbidden key class、safe source ref、validation_issue_ref。 | 不 hash raw secret,不输出 body digest unless formally safe。 |
| unsupported reload / hot issue | C10-REJECT-002 | unsupported reload issue、source class、safe diagnostic_ref。 | 明确 no activation / no rollback target。 |
| invariant override issue | C10-REJECT-003 | forbidden boundary class、validation_issue_ref、safe source ref。 | 不把 override 转成 design shortcut。 |
| redaction unsafe issue | C10-REJECT-004 | removed guard digest、unsafe relax issue、actor / reason refs。 | 不输出 raw denied field values。 |
| fixture profile issue | C10-REJECT-005 | fixture class digest、profile violation issue、safe source ref。 | 不允许 production-like fallback fake。 |

### 6. Sensitive 变更附加审计思考

| Sensitive 族 | 附加审计候选 | 禁止输出 | 回指 |
|---|---|---|---|
| store refs | logical store slot、old/new ref digest、profile、validation_result。 | DSN、credential、URL body、full ref。 | Step 8 sensitive refs;Step 9 startup。 |
| resolver / publisher refs | family / publisher slot、adapter digest、availability marker、route coverage marker。 | endpoint、route credential、transport body、external response body。 | Step 8 adapter/route refs;Step 9 startup。 |
| handoff / archive targets | target digest、archive target digest、marker refs、job run ref when run-local。 | package body、target credential、archive body。 | Step 8 target refs;Step 9 startup/job-run-start。 |
| externalGrc | enablement from/to、adapter digest、target digest、export marker refs。 | external GRC credential、export body、response body。 | Step 8 externalGrc refs;Step 9 startup/job-run-start。 |
| replay artifact root | replay root digest、de-identification marker、run/test ref。 | raw historical body、raw artifact、external payload。 | Step 8 replay refs;Step 9 operations-replay/test harness。 |
| redaction / diagnostics | added/removed guard digest、prefix digest、high-cardinality guard result。 | matched raw values、raw body diagnostic、high-cardinality raw labels。 | Step 8 internal safety-critical;Step 9 startup/rejected。 |

### 7. 对 03 的影响预判

| 审计候选结论 | 是否影响 03 | 处理 |
|---|---|---|
| 只定义审计字段族和禁输边界,不新增 formal audit object / DTO / port | 否 | R10.10 可写入候选记录。 |
| 只使用 Step 8 的 redacted digest / issue ref 和 Step 9 的 activation kind | 否 | R10.10 可写入候选记录。 |
| 要求实现仓持久化正式 ConfigChangeAudit object 或 audit repository | 是 | 暂停并回 `03` object / port / persistence owning Step。 |
| 要求具体工单系统、审批系统、审计产品或 actor 权限模型 | 是 | 暂停并回架构 / 详细设计 / 运维边界。 |
| 要求审计 raw config、raw secret、full sensitive ref、external body 或 package body | 越界 | 删除候选,只保留 rejected issue。 |

### 8. R10.10 写入计划

| R10.10 拟写内容 | 写入边界 |
|---|---|
| audit event scope candidate table | 写 startup、sensitive、run-local、entry-local、test、critical rejected、rollback decision 的候选事件范围。 |
| safe metadata candidate table | 写 identity / actor / config locator / digest / validation / rollback / rejected issue 字段族。 |
| redacted digest candidate table | 写 config/ref/input/selector/fixture/guard digest 的候选规则。 |
| validation issue and rejected audit candidate table | 写 invalid config、forbidden secret/body、unsupported reload、invariant override、redaction unsafe、fixture profile issue。 |
| sensitive audit supplement table | 写 store、resolver、publisher、target、externalGrc、replay、redaction 的附加审计候选。 |
| R10.11 入口 | 进入回滚规则矩阵候选:先思考,不得自动写最终回滚矩阵。 |

### 9. R10.9 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做审计规则候选思考 | pass | 未写最终审计规则或正式 audit schema。 |
| 是否覆盖 R10.8 候选行 | pass | startup、run-local、entry-local、test、critical rejected 和 rollback decision 均已覆盖。 |
| 是否保持 safe metadata | pass | 字段族均限制为 refs、digests、issue refs、safe diagnostic refs。 |
| 是否禁止敏感泄露 | pass | raw secret、full sensitive ref、endpoint、credential、body 均保留为禁止项。 |
| 是否保留 03 回写门禁 | pass | 正式 audit object / DTO / port / persistence 需求仍需回 `03`。 |
| 是否可进入 R10.10 | pass | 等待用户确认后进入审计记录规则候选再写入。 |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.10 审计记录规则候选:再写入`;只允许把 R10.9 的 audit event scope、safe metadata、redacted digest、validation issue、sensitive 变更附加审计和 rejected attempt 审计思考写成候选记录;不得创建正式 `04-配置设计.md`;不得写最终审计规则、最终回滚矩阵、测试方案、验收标准、实施计划或代码。

## R10.10 审计记录规则候选:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.11 |
| 本模块目标 | 将 R10.9 的 audit event scope、safe metadata、redacted digest、validation issue、sensitive 变更附加审计和 rejected attempt 审计思考固化为候选记录。 |
| 本模块允许 | 写入审计事件范围候选、safe metadata 候选、redacted digest 候选、validation issue / rejected audit 候选、sensitive 附加审计候选、03 影响判定和 R10.11 入口。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写最终审计规则;不定义正式 audit DTO / schema / port / persistence;不写最终回滚矩阵、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R10.9 已完成审计记录规则候选先思考;用户已确认进入 R10.10。 |

### 2. Audit event scope 候选记录

| Event scope | 适用候选行 | 候选必填字段族 | 候选禁止字段 | 后续承接 |
|---|---|---|---|---|
| startup config change audit | C10-START-001 ~ C10-START-012 | identity / correlation refs、actor / reason refs、config locator、old/new config digest、validation result、rollback refs。 | raw config、env body、file body、secret material。 | R10.11 按 startup rollback 继续收口。 |
| sensitive ref change audit | C10-START-002、C10-START-003、C10-START-005、C10-START-007、C10-START-008、C10-RUN-002、C10-RUN-003、C10-RUN-005 | actor / reason refs、profile / run ref、old/new ref digest、validation issue ref、safe diagnostic ref。 | full sensitive ref、endpoint、DSN、credential、route body、target body。 | R10.11 只能 rollback 到 previous approved digest。 |
| run-local input audit | C10-RUN-001 ~ C10-RUN-005 | job_run_ref、job_runner_ref、input digest、target digest when applicable、validation_result、rollback_run_ref。 | global config mutation、raw target credential、report body、historical body。 | R10.11 只能通过 new run 回滚。 |
| entry-local selector audit | C10-ENTRY-001 | entry_ref、selector digest、profile/source boundary、validation or rejection issue ref。 | request body、caller free text、persisted global override。 | R10.11 只能 caller rerun。 |
| test harness audit | C10-TEST-001 | test_run_ref、fixture digest、fixed clock/id seed digest、profile_ref、validation_result。 | raw fixture body、production secret、raw artifact。 | R10.11 只能 test rerun。 |
| critical rejected attempt audit | C10-REJECT-001 ~ C10-REJECT-005 | safe source ref、forbidden key / boundary class、validation_issue_ref、no activation marker。 | raw invalid value、raw secret、hot reload payload、override body。 | R10.11 无 runtime rollback target。 |
| rollback decision audit | all non-rejected rows | rollback_ref、previous approved digest、rollback_run_ref / previous selector / fixture digest。 | rollback script body、truth rewrite instruction、stored report mutation。 | R10.11 形成 rollback matrix 候选。 |

### 3. Safe metadata 候选记录

| 字段族 | 候选字段 | 必填性候选 | 允许内容 | 禁止内容 |
|---|---|---|---|---|
| identity / correlation refs | `change_request_ref`、`job_run_ref`、`entry_ref`、`test_run_ref`、`safe_source_ref` | 按 event scope 必填 | product-neutral typed ref 或 safe source class。 | raw request body、source payload、secret material。 |
| actor / reason refs | `actor_ref`、`job_runner_ref`、`reason_ref`、`approval_ref` | startup high / sensitive / rejected 必填;low 可按 available | actor / reason / approval 的安全引用。 | actor free text、ticket body、chat transcript、secret-containing reason。 |
| config locator | `config_section`、`profile_ref`、`activation_kind`、`candidate_family` | startup / rejected 必填 | section name、profile ref、activation enum、candidate family。 | raw config section body、env dump、secret-bearing path。 |
| digest fields | `old_config_digest`、`new_config_digest`、`old_ref_digest`、`new_ref_digest`、`input_digest`、`selector_digest`、`fixture_digest` | 变更前后比较或 rollback 需要时必填 | redacted canonical digest only。 | full ref、DSN、endpoint、credential、route topic secret。 |
| validation fields | `validation_result`、`validation_issue_ref`、`safe_error_code`、`safe_diagnostic_ref` | validation/rejected 必填 | safe validation outcome、issue ref、diagnostic ref。 | raw invalid value、validator stack with secret、external response body。 |
| rollback fields | `rollback_ref`、`previous_approved_digest`、`rollback_run_ref`、`previous_selector_digest` | non-rejected high / sensitive 必填 | previous validated / approved digest 或 new-run/rerun ref。 | rollback script body、raw backup config、truth rewrite instruction。 |
| rejected issue fields | `forbidden_key_class`、`forbidden_boundary_class`、`no_activation_marker` | rejected 必填 | safe class / marker / issue ref。 | forbidden raw value、hot reload payload、raw secret/body。 |

### 4. Redacted digest 候选记录

| Digest | 候选输入 | 候选生成口径 | 使用位置 | 禁止项 |
|---|---|---|---|---|
| `config_digest` | ordinary startup config safe projection | canonicalize safe projection,then digest | startup before/after audit、rollback target | 不 hash raw secret;raw secret 输入直接 rejected。 |
| `ref_digest` | opaque store / adapter / route / target / replay refs | digest opaque ref value or approved safe projection | sensitive ref change audit | 不输出 full ref、endpoint、credential。 |
| `input_digest` | job-run-start frozen input safe projection | digest run-local allowed fields only | run-local input audit、new-run rollback | 不包含 report body、package body、raw target credential。 |
| `selector_digest` | entry-local selector safe projection | digest current entry selector only | entry-local audit、caller rerun | 不持久化为全局 config。 |
| `fixture_digest` | test fixture / fixed clock / fixed id seed safe projection | digest fixture ref / deterministic seed safe projection | test harness audit、test rerun | fixture 不得进入 production-like。 |
| `removed_guard_digest` | redaction guard added/removed safe field refs | digest guard ref set only | redaction unsafe relax audit | 不输出 matched raw value 或 raw body diagnostic。 |

### 5. Validation issue / rejected audit 候选记录

| Issue 类别 | 触发条件 | 候选审计 | 激活口径 | 备注 |
|---|---|---|---|---|
| parse / type / range / cross-field issue | startup / job / entry / test config 校验失败 | validation_issue_ref、config_section、profile_ref、activation_kind、safe_diagnostic_ref。 | no activation or rejected current scope | 不写 raw invalid value。 |
| forbidden secret / body issue | config/env/entry/job/fixture 直接提供 secret 或 body | forbidden key class、safe source ref、validation_issue_ref、no activation marker。 | rejected / no activation | 不 hash raw secret,不输出 body digest。 |
| unsupported reload / hot issue | 出现 reload / hot runtime success path | unsupported reload issue、source class、safe_diagnostic_ref。 | rejected / no activation | future 支持必须回 `03` / 架构。 |
| invariant override issue | 配置试图改变 truth / state / query / job / marker / transaction / replay / public schema | forbidden boundary class、validation_issue_ref、safe source ref。 | rejected / no activation | 不转成 design shortcut。 |
| redaction unsafe issue | 放松 deny list、允许 raw diagnostic 或 high-cardinality unsafe label | removed_guard_digest、unsafe relax issue、actor_ref、reason_ref。 | rejected / no activation unless future design | 不输出被匹配 raw value。 |
| fixture profile issue | fake / fixture / fixed clock/id 进入 production-like | fixture class digest、profile violation issue、safe source ref。 | rejected / no activation | 不允许 fallback fake。 |

### 6. Sensitive 变更附加审计候选记录

| Sensitive 族 | 附加审计字段 | 必须禁止输出 | 回指 | 停审关注 |
|---|---|---|---|---|
| store refs | logical store slot、old/new ref digest、profile_ref、validation_result。 | DSN、credential、URL body、full ref。 | Step 8 sensitive refs;Step 9 startup。 | durable ref 变更必须 high review + rollback digest。 |
| resolver / publisher refs | resolver family / publisher slot、adapter digest、availability marker、route coverage marker。 | endpoint、route credential、transport body、external response body。 | Step 8 adapter/route refs;Step 9 startup。 | production-like fake fallback 必须 rejected。 |
| handoff / archive targets | target digest、archive target digest、marker refs、job_run_ref when run-local。 | package body、target credential、archive body。 | Step 8 target refs;Step 9 startup/job-run-start。 | rollback 不能改写 package/report。 |
| externalGrc | enablement from/to、adapter digest、target digest、export marker refs。 | external GRC credential、export body、response body。 | Step 8 externalGrc refs;Step 9 startup/job-run-start。 | enabled 缺 adapter/target 必须 fail-fast/reject。 |
| replay artifact root | replay root digest、de-identification marker、run/test ref。 | raw historical body、raw artifact、external payload。 | Step 8 replay refs;Step 9 operations-replay/test harness。 | raw replay body 不得进入 audit。 |
| redaction / diagnostics | added/removed guard digest、prefix digest、high-cardinality guard result。 | matched raw values、raw body diagnostic、high-cardinality raw labels。 | Step 8 internal safety-critical;Step 9 startup/rejected。 | unsafe relax 必须 critical rejected。 |

### 7. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 审计规则候选只定义字段族、event scope 和禁止输出边界 | 否 | none | not_applicable | 无回写 |
| 审计候选只使用 Step 8 redacted digest / issue ref 与 Step 9 activation kind | 否 | none | not_applicable | 无回写 |
| 候选审计不新增正式 audit object、DTO、repository、port 或 persistence surface | 否 | none | not_applicable | 无回写 |
| 若后续要求正式 ConfigChangeAudit object / audit repository / persistence schema | 是 | object / port / persistence | `03-详细设计.md` owning Step | 阻塞待确认 |
| 若后续要求具体工单系统、审批系统、审计产品或 actor 权限模型 | 是 | architecture / operations boundary | `01-架构设计.md` / `03-详细设计.md` owning Step | 阻塞待确认 |
| 若后续要求记录 raw config、raw secret、full sensitive ref、external body 或 package body | 是且越界 | security / redaction boundary | not_applicable | 阻塞待确认 |

### 8. R10.11 入口

| 下一模块 | 允许范围 | 禁止范围 |
|---|---|---|
| `R10.11 回滚规则矩阵候选:先思考` | 围绕 R10.8 变更候选行和 R10.10 审计候选,思考 startup、sensitive ref、job-run-start、entry-local、test harness、critical rejected 的 rollback target、rollback action、audit refs 和禁止动作。 | 不创建正式 `04-配置设计.md`;不写最终回滚矩阵;不写测试方案、验收标准、实施计划或代码。 |

### 9. R10.10 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只固化 R10.9 审计候选思考 | pass | 未写最终审计规则或正式 audit schema。 |
| 是否覆盖全部 audit event scope | pass | startup、sensitive、run-local、entry-local、test、critical rejected、rollback decision 均已覆盖。 |
| 是否保持 safe metadata | pass | 字段族只允许 refs、digests、issue refs、safe diagnostic refs。 |
| 是否保留敏感禁输 | pass | raw secret、full sensitive ref、endpoint、credential、body 均为禁止输出。 |
| 是否完成 03 影响判定 | pass | 正式 audit object / port / persistence 需求被标记为阻塞待确认。 |
| 是否可进入 R10.11 | pass | 等待用户确认后进入回滚规则矩阵候选先思考。 |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.11 回滚规则矩阵候选:先思考`;只允许围绕 R10.8 变更候选行和 R10.10 审计候选思考 startup、sensitive ref、job-run-start、entry-local、test harness、critical rejected 的 rollback target、rollback action、audit refs 和禁止动作;不得创建正式 `04-配置设计.md`;不得写最终回滚矩阵、测试方案、验收标准、实施计划或代码。

## R10.11 回滚规则矩阵候选:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.12 |
| 本模块目标 | 围绕 R10.8 变更候选行和 R10.10 审计候选,思考不同 activation / change family 的 rollback target、rollback action、audit refs 和禁止动作。 |
| 本模块允许 | 写 rollback target 思考、startup / sensitive / run-local / entry-local / test / critical rejected 回滚候选、禁止动作、03 影响预判和 R10.12 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不把候选升级为最终回滚矩阵;不写测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R10.10 已完成审计记录规则候选写入;用户已确认进入 R10.11。 |

### 2. Rollback target 总原则思考

| 原则 | R10.11 思考结论 | R10.12 写入注意 |
|---|---|---|
| rollback target 必须已验证 | 只能指向 previous validated / approved config digest、approved sensitive ref digest、previous valid run input、previous selector 或 fixture digest。 | 不允许 previous invalid config、raw backup、未校验 ref 成为 rollback target。 |
| rollback 不改写 truth | rollback 只恢复配置输入或重新发起 run / entry / test,不得修改 domain truth、stored report、accepted result、stored replay surface。 | 所有 rollback action 都要写禁止 truth/report rewrite。 |
| rollback 不绕过 validator | 恢复旧 digest 后仍按 Step 9 路径重新校验和激活。 | 不允许 skip validator、hot patch 或 emergency activation。 |
| rollback 审计必须可追踪 | 每个 rollback 都要有 rollback_ref / previous approved digest / rollback_run_ref / validation issue ref。 | 与 R10.10 审计候选回指。 |
| rejected 无 runtime rollback | critical rejected attempt 没有激活,只记录 issue,需要时进入 design change。 | 不创建假 rollback target。 |

### 3. Startup rollback 候选思考

| 变更范围 | rollback target 候选 | rollback action 候选 | audit refs 候选 | 禁止动作 |
|---|---|---|---|---|
| runtime profile / strict validation | previous validated runtime profile / config digest | restore digest and restart;re-run startup validation | change_request_ref、old/new config digest、rollback_ref、validation_result | hot patch、P0/P1 isolation relax、skip strict validation |
| stores / resolvers / publisher / route | previous approved store / adapter / route ref digest | restore approved ref digest and restart runtime builder | old/new ref digest、availability marker、rollback_ref | reveal full ref、fallback fake in production-like、raw credential reuse |
| inbound namespace / version / retention | previous validated namespace / version / retention digest | restore config digest and restart consumers | namespace digest、version digest、retention digest、rollback_ref | rewrite consumed event truth、mutate dedup history |
| jobs defaults / enabled kind set | previous validated job default digest | restore defaults and restart job registry | job kind set digest、default digest、rollback_ref | mutate already stored job report、change past run result |
| handoff / archive / externalGrc defaults | previous approved target / adapter / enablement digest | restore target set or disabled state and restart | target digest、enablement digest、marker refs、rollback_ref | rewrite delivered package/report、expose target credential |
| redaction / diagnostics | previous approved deny list / diagnostic guard digest | restore guard digest and restart diagnostics | added/removed digest、safe diagnostic ref、rollback_ref | output matched raw value、enable high-cardinality unsafe labels |
| boundary / idempotency / retention | previous validated limit / retention digest | restore digest and restart guards | limit class、retention digest、rollback_ref | alter stored replay result、drop retention to hide conflict |
| projection / reference / clock / id | previous validated defaults / port ref digest | restore defaults / port refs and restart | default digest、clock/id slot digest、rollback_ref | change marker source、use fixed clock/id in production-like |

### 4. Run-local / entry-local / test rollback 候选思考

| 变更范围 | rollback target 候选 | rollback action 候选 | audit refs 候选 | 禁止动作 |
|---|---|---|---|---|
| job-run-start batch / timeout / scope | previous valid input digest | start new job run with previous input | job_run_ref、input_digest、rollback_run_ref | mutate active run input、reuse conflicting idempotency key with different digest |
| per-run handoff / archive target | previous approved run target digest | start new job run with previous target | target digest、job_run_ref、rollback_run_ref | edit stored handoff report、retract delivered package by config rollback |
| per-run externalGrc target / batch | previous validated export input digest | start new export job run | externalGrc target digest、export marker refs、rollback_run_ref | rewrite export report、output external response body |
| rebuild / refresh batch narrowing | previous valid batch input digest | start new maintenance job run | job kind、batch digest、rollback_run_ref | repair truth through job config、change marker source |
| operations-replay artifact root | previous approved replay root digest | rerun replay job or test harness with previous root | replay root digest、de-identification marker、rollback_run_ref | load raw historical body、mutate stored replay surface |
| entry-local selector | previous selector digest | caller reruns current entry with previous selector | entry_ref、selector_digest、validation_issue_ref | persist selector into global config、cross profile boundary |
| test fixture / fixed seed | previous fixture ref / digest | rerun test harness with previous fixture | test_run_ref、fixture_digest、profile_ref | allow fixture in production-like、use production secret in test fixture |

### 5. Critical rejected rollback 候选思考

| Rejected 范围 | rollback target 思考 | action 思考 | audit refs 思考 | 禁止动作 |
|---|---|---|---|---|
| raw secret / raw body config attempt | none;no activation | record rejected issue and keep active config unchanged | forbidden key class、validation_issue_ref、safe source ref | hash raw secret as rollback target、activate secret under emergency |
| hot reload / runtime reload request | none;unsupported | reject request;future support requires design change | unsupported reload issue、safe diagnostic_ref | live patch runtime、last-known-good switch without `03` contract |
| truth / state / query / job invariant override | none;forbidden boundary | reject request;record design boundary issue | forbidden boundary class、validation_issue_ref | mutate truth/state/report through rollback |
| redaction unsafe relax | active previous config remains effective | reject unsafe change;keep active guard | removed_guard_digest、unsafe relax issue、actor_ref | expose raw body diagnostic、remove deny guard silently |
| fake / fixture in production-like | none;profile violation | reject profile/fixture selection | fixture class digest、profile violation issue | fallback fake in production-like、seed fixed id/clock |

### 6. Rollback failure 与再失败思考

| 场景 | 思考结论 | Step 11 承接 |
|---|---|---|
| previous digest 缺失 | 当前 Step 10 应标记 rollback plan incomplete,不能把变更视为可通过高风险评审。 | Step 11 定义 fail-fast / blocked change。 |
| previous digest 校验失败 | 不允许用 invalid previous digest 激活;需要继续保持 current active config 或 reject change。 | Step 11 定义 rollback failed / no activation。 |
| restart 后 adapter unavailable | rollback 已恢复 config,但 adapter 不可用应由 Step 11 处理 unavailable / fail-fast。 | Step 11 定义 dependency unavailable。 |
| new run rollback 失败 | 不改写旧 run/report;记录 rollback_run_ref failure,由后续 job retry / recovery 处理。 | Step 11 定义 job rejected / failed rollback run。 |
| rejected attempt 重复出现 | 继续记录 rejected issue,不得因重复而自动放开。 | Step 11 定义 repeated invalid config handling。 |

### 7. 对 03 的影响预判

| 回滚候选结论 | 是否影响 03 | 处理 |
|---|---|---|
| 只定义 previous validated digest / new run / rerun / no activation 的运维配置回滚口径 | 否 | R10.12 可写入候选记录。 |
| rollback 不新增 runtime hot reload、last-known-good live switch 或 audit persistence object | 否 | R10.12 可写入候选记录。 |
| 需要 runtime live rollback / hot patch / last-known-good config switch | 是 | 暂停并回 `03` runtime builder / error recovery owning Step。 |
| 需要 rollback repository、audit persistence schema 或 config snapshot object | 是 | 暂停并回 `03` object / port / persistence owning Step。 |
| rollback 要求改写 truth、stored report、accepted result 或 stored replay surface | 越界 | 删除候选并写为 forbidden rejected attempt。 |

### 8. R10.12 写入计划

| R10.12 拟写内容 | 写入边界 |
|---|---|
| rollback target candidate table | 写 previous validated / approved digest、new run、rerun、no activation 的候选目标。 |
| startup rollback candidate matrix | 写 startup 各配置族的 target、action、audit refs、禁止动作。 |
| run-local / entry-local / test rollback candidate matrix | 写 job-run-start、entry-local、test harness 的回滚候选。 |
| critical rejected rollback candidate matrix | 写 raw secret、hot/reload、truth override、redaction unsafe、fixture production-like 的 no activation 口径。 |
| rollback failure candidate table | 写 previous digest missing、validation failed、adapter unavailable、new run failed、repeated rejected 的承接方向。 |
| R10.13 入口 | 进入敏感配置变更附加规则候选:先思考,不得自动写最终敏感变更规则。 |

### 9. R10.11 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做回滚矩阵候选思考 | pass | 未写最终回滚矩阵。 |
| 是否覆盖主要 activation | pass | startup、job-run-start、entry-local、test harness、rejected 均已覆盖。 |
| 是否保持 rollback 不改写 truth/report | pass | 每组都保留 forbidden rewrite 约束。 |
| 是否保留审计回指 | pass | rollback_ref、previous digest、rollback_run_ref、validation issue 均已思考。 |
| 是否保留 03 回写门禁 | pass | runtime live rollback、snapshot object、persistence schema 仍需回 `03`。 |
| 是否可进入 R10.12 | pass | 等待用户确认后进入回滚规则矩阵候选再写入。 |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.12 回滚规则矩阵候选:再写入`;只允许把 R10.11 的 rollback target、startup / sensitive / run-local / entry-local / test / critical rejected 回滚候选、rollback failure 和 03 影响预判写成候选记录;不得创建正式 `04-配置设计.md`;不得写最终回滚矩阵、测试方案、验收标准、实施计划或代码。

## R10.12 回滚规则矩阵候选:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.13 |
| 本模块目标 | 将 R10.11 的 rollback target、startup / sensitive / run-local / entry-local / test / critical rejected 回滚候选、rollback failure 和 03 影响预判固化为候选记录。 |
| 本模块允许 | 写入 rollback target 候选表、startup rollback 候选矩阵、run-local / entry-local / test rollback 候选矩阵、critical rejected rollback 候选矩阵、rollback failure 候选表、03 影响判定和 R10.13 入口。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不把候选升级为最终回滚矩阵;不写测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R10.11 已完成回滚规则矩阵候选先思考;用户已确认进入 R10.12。 |

### 2. Rollback target 候选记录

| Rollback target | 适用范围 | 候选要求 | 禁止目标 |
|---|---|---|---|
| previous validated config digest | startup ordinary config | 必须来自已通过 Step 9 parse / type / cross-field / profile validation 的配置摘要。 | previous invalid config、raw backup config、未校验文件。 |
| previous approved sensitive ref digest | store / resolver / publisher / route / target / replay root | 必须是 previous approved opaque ref digest,且不暴露 full ref。 | raw secret、DSN、endpoint、credential、full sensitive ref。 |
| previous valid job input digest | job-run-start run-local input | 必须是上一份合法 frozen input digest,通过 current job validator。 | active run mutation、conflicting idempotency key 不同 digest。 |
| previous selector digest | entry-local selector | 只用于当前 caller rerun,不写入全局配置。 | global config override、跨 profile selector。 |
| previous fixture ref / digest | test harness | 只用于 test harness rerun,且 profile 必须允许 fixture。 | production-like fixture、production secret、raw artifact。 |
| no activation marker | critical rejected attempt | 用于记录拒绝和无 runtime rollback target。 | emergency activation、fake rollback target。 |

### 3. Startup rollback 候选矩阵

| 变更范围 | rollback target | rollback action | audit refs | 禁止动作 |
|---|---|---|---|---|
| runtime profile / strict validation | previous validated runtime profile / config digest | restore digest and restart;re-run startup validation | change_request_ref、old/new config digest、rollback_ref、validation_result | hot patch、P0/P1 isolation relax、skip strict validation |
| stores / resolvers / publisher / route | previous approved store / adapter / route ref digest | restore approved ref digest and restart runtime builder | old/new ref digest、availability marker、rollback_ref | reveal full ref、fallback fake in production-like、raw credential reuse |
| inbound namespace / version / retention | previous validated namespace / version / retention digest | restore config digest and restart consumers | namespace digest、version digest、retention digest、rollback_ref | rewrite consumed event truth、mutate dedup history |
| jobs defaults / enabled kind set | previous validated job default digest | restore defaults and restart job registry | job kind set digest、default digest、rollback_ref | mutate stored job report、change past run result |
| handoff / archive / externalGrc defaults | previous approved target / adapter / enablement digest | restore target set or disabled state and restart | target digest、enablement digest、marker refs、rollback_ref | rewrite delivered package/report、expose target credential |
| redaction / diagnostics | previous approved deny list / diagnostic guard digest | restore guard digest and restart diagnostics | added/removed digest、safe diagnostic ref、rollback_ref | output matched raw value、enable unsafe high-cardinality labels |
| boundary / idempotency / retention | previous validated limit / retention digest | restore digest and restart guards | limit class、retention digest、rollback_ref | alter stored replay result、drop retention to hide conflict |
| projection / reference / clock / id | previous validated defaults / port ref digest | restore defaults / port refs and restart | default digest、clock/id slot digest、rollback_ref | change marker source、use fixed clock/id in production-like |

### 4. Run-local / entry-local / test rollback 候选矩阵

| 变更范围 | rollback target | rollback action | audit refs | 禁止动作 |
|---|---|---|---|---|
| job-run-start batch / timeout / scope | previous valid input digest | start new job run with previous input | job_run_ref、input_digest、rollback_run_ref | mutate active run input、reuse conflicting idempotency key with different digest |
| per-run handoff / archive target | previous approved run target digest | start new job run with previous target | target digest、job_run_ref、rollback_run_ref | edit stored handoff report、retract delivered package by config rollback |
| per-run externalGrc target / batch | previous validated export input digest | start new export job run | externalGrc target digest、export marker refs、rollback_run_ref | rewrite export report、output external response body |
| rebuild / refresh batch narrowing | previous valid batch input digest | start new maintenance job run | job kind、batch digest、rollback_run_ref | repair truth through job config、change marker source |
| operations-replay artifact root | previous approved replay root digest | rerun replay job or test harness with previous root | replay root digest、de-identification marker、rollback_run_ref | load raw historical body、mutate stored replay surface |
| entry-local selector | previous selector digest | caller reruns current entry with previous selector | entry_ref、selector_digest、validation_issue_ref | persist selector into global config、cross profile boundary |
| test fixture / fixed seed | previous fixture ref / digest | rerun test harness with previous fixture | test_run_ref、fixture_digest、profile_ref | allow fixture in production-like、use production secret in test fixture |

### 5. Critical rejected rollback 候选矩阵

| Rejected 范围 | rollback target | action | audit refs | 禁止动作 |
|---|---|---|---|---|
| raw secret / raw body config attempt | none;no activation | record rejected issue and keep active config unchanged | forbidden key class、validation_issue_ref、safe source ref | hash raw secret as rollback target、activate secret under emergency |
| hot reload / runtime reload request | none;unsupported | reject request;future support requires design change | unsupported reload issue、safe diagnostic_ref | live patch runtime、last-known-good switch without `03` contract |
| truth / state / query / job invariant override | none;forbidden boundary | reject request;record design boundary issue | forbidden boundary class、validation_issue_ref | mutate truth/state/report through rollback |
| redaction unsafe relax | active previous config remains effective | reject unsafe change;keep active guard | removed_guard_digest、unsafe relax issue、actor_ref | expose raw body diagnostic、remove deny guard silently |
| fake / fixture in production-like | none;profile violation | reject profile/fixture selection | fixture class digest、profile violation issue | fallback fake in production-like、seed fixed id/clock |

### 6. Rollback failure 候选记录

| 场景 | 候选处理 | 审计候选 | Step 11 承接 |
|---|---|---|---|
| previous digest 缺失 | rollback plan incomplete;高风险变更不得通过。 | missing rollback target issue、change_request_ref、actor_ref。 | fail-fast / blocked change。 |
| previous digest 校验失败 | 不激活 invalid previous digest;保持 current active config 或 reject change。 | rollback validation issue、previous digest ref、safe diagnostic_ref。 | rollback failed / no activation。 |
| restart 后 adapter unavailable | config rollback 已执行,dependency unavailable 交由失效策略处理。 | rollback_ref、availability marker、safe diagnostic_ref。 | dependency unavailable / fail-fast。 |
| new run rollback 失败 | 不改写旧 run/report;记录 rollback run failure。 | rollback_run_ref、job_run_ref、validation_issue_ref。 | job rejected / failed rollback run。 |
| rejected attempt 重复出现 | 继续 rejected;不得自动放开。 | repeated forbidden issue、safe source ref、forbidden class。 | repeated invalid config handling。 |

### 7. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 回滚候选只使用 previous validated digest、approved ref digest、new run、rerun、no activation | 否 | none | not_applicable | 无回写 |
| 回滚动作不改写 truth、stored report、accepted result 或 stored replay surface | 否 | none | not_applicable | 无回写 |
| 回滚候选不新增 runtime live rollback、hot patch、last-known-good switch 或 persistence object | 否 | none | not_applicable | 无回写 |
| 若后续要求 runtime live rollback / last-known-good config switch | 是 | runtime builder / error recovery | `03-详细设计.md` owning Step | 阻塞待确认 |
| 若后续要求 rollback repository、audit persistence schema 或 config snapshot object | 是 | object / port / persistence | `03-详细设计.md` owning Step | 阻塞待确认 |
| 若后续要求通过 rollback 改写 truth、stored report、accepted result 或 stored replay surface | 是且越界 | state / persistence invariant | not_applicable | 阻塞待确认 |

### 8. R10.13 入口

| 下一模块 | 允许范围 | 禁止范围 |
|---|---|---|
| `R10.13 敏感配置变更附加规则候选:先思考` | 围绕 store / adapter / route / target / replay root / redaction 等 sensitive 族,思考读取、轮换、审计、rollback、禁输和 critical reject 的附加规则。 | 不创建正式 `04-配置设计.md`;不写最终敏感变更规则;不写测试方案、验收标准、实施计划或代码。 |

### 9. R10.12 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只固化 R10.11 回滚候选思考 | pass | 未写最终回滚矩阵。 |
| 是否覆盖 rollback target | pass | previous validated config、approved sensitive ref、valid job input、selector、fixture、no activation 均已覆盖。 |
| 是否覆盖 activation family | pass | startup、job-run-start、entry-local、test harness、critical rejected 均已覆盖。 |
| 是否保留 forbidden rewrite | pass | truth、stored report、accepted result、stored replay surface 均不可被 rollback 改写。 |
| 是否保留 rollback failure 承接 | pass | previous digest 缺失、校验失败、adapter unavailable、new run failed、重复 rejected 均已记录。 |
| 是否可进入 R10.13 | pass | 等待用户确认后进入敏感配置变更附加规则候选先思考。 |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.13 敏感配置变更附加规则候选:先思考`;只允许围绕 store / adapter / route / target / replay root / redaction 等 sensitive 族思考读取、轮换、审计、rollback、禁输和 critical reject 的附加规则;不得创建正式 `04-配置设计.md`;不得写最终敏感变更规则、测试方案、验收标准、实施计划或代码。

## R10.13 敏感配置变更附加规则候选:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.14 |
| 本模块目标 | 围绕 Step 8 sensitive / secret 边界、R10.10 审计候选和 R10.12 rollback 候选,思考敏感配置变更的附加规则。 |
| 本模块允许 | 写 sensitive family 附加规则思考、读取 / 轮换 / 审计 / rollback / 禁输 / critical reject 思考、profile 限制、03 影响预判和 R10.14 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写最终敏感变更规则;不定义 secret provider schema / port / mapper / adapter constructor;不写真实 secret、轮换 runbook、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R10.12 已完成回滚规则矩阵候选写入;用户已确认进入 R10.13。 |

### 2. 敏感变更总原则思考

| 原则 | R10.13 思考结论 | R10.14 写入注意 |
|---|---|---|
| 普通配置只承载 opaque ref | store / adapter / route / target / replay root 只能通过 ref / digest 表达。 | 不允许 raw secret、DSN、endpoint credential、body 进入配置或审计。 |
| 变更必须经高风险审计 | sensitive ref 变更默认 high review;redaction unsafe relax 和 production-like fake 为 critical reject。 | 写入时区分 high review 和 critical rejected。 |
| 轮换不走 hot reload | P0 只能 restart、new job run、entry rerun 或 test rerun。 | 不写 secret provider hot rotation 或 zero-downtime reload。 |
| rollback 只回 previous approved digest | 回滚目标必须是 previous approved sensitive ref digest 或 previous valid run/test input。 | 不以 raw backup、failed ref、provider response 作为 rollback target。 |
| 禁输覆盖所有输出面 | log、error、audit、trace、metric、report、artifact 均不能输出 full ref / raw body。 | 与 Step 8 禁止输出规则和 R10.10 审计候选回指。 |

### 3. Sensitive family 附加规则思考

| Sensitive family | 读取 / 变更思考 | 审计思考 | rollback 思考 | critical reject 思考 |
|---|---|---|---|---|
| store refs | startup 只读取 opaque store ref;durable ref 变更 high review。 | logical store slot、old/new ref digest、profile、validation_result。 | restore previous approved store ref digest and restart。 | raw DSN / credential / URL body rejected。 |
| resolver / adapter refs | startup 校验 family coverage、mode/profile compatibility、availability marker。 | resolver family、adapter digest、availability marker、safe diagnostic_ref。 | restore previous approved adapter ref digest and restart。 | production-like fake fallback、endpoint credential rejected。 |
| publisher / route refs | startup 校验 publisher availability、topic-neutral key coverage、route binding digest。 | publisher slot、route digest、topic coverage marker、validation_result。 | restore previous route map digest and restart。 | raw topic secret、bus credential、payload body rejected。 |
| handoff / archive targets | startup target set 或 job-run-start target selection 均只用 target ref。 | target digest、archive digest、job_run_ref when run-local、marker refs。 | startup restore target set;run-local start new job with previous target。 | package body、target credential、archive body rejected。 |
| externalGrc refs | enablement / adapter / target 均 high review;enabled 必须 adapter+target。 | enabled from/to、adapter digest、target digest、export marker refs。 | restore previous disabled/enabled+ref digest or start new export run。 | external credential、export body、response body rejected。 |
| replay artifact root | 只允许 de-identified replay root ref;operations-replay / test harness 生效。 | replay root digest、de-identification marker、run/test ref。 | rerun replay job or test with previous approved root。 | raw historical body、raw artifact、external payload rejected。 |
| redaction / diagnostics | deny list / prefix / high-cardinality guard 变更必须 safety review。 | added/removed guard digest、prefix digest、unsafe relax issue。 | restore previous deny list / diagnostic guard digest and restart。 | deny list empty、raw body diagnostic、unsafe high-cardinality rejected。 |
| future raw secret provider refs | 当前仅作为 future direction,不进入 P0 schema。 | provider ref digest only if future `03` closes contract。 | provider-side rotation 需 future design;当前不写。 | provider material、API response、hot rotation contract rejected。 |

### 4. Profile 附加限制思考

| Profile | 允许敏感输入 | 禁止敏感输入 | 失败处理思考 |
|---|---|---|---|
| local-dev | fake refs、in-memory store refs、fake target refs。 | raw secret、real endpoint credential、external body。 | invalid ref fail-fast;missing optional fake target only when feature disabled。 |
| ci-test | deterministic fixture refs、fake store/adapter refs、fixed clock/id refs。 | production secret、real target credential、raw fixture body in config。 | fixture missing test fail-fast。 |
| integration-like | controlled / real-like adapter refs、credential refs、endpoint refs、target refs。 | raw credential material、sibling body、fake fallback after controlled adapter selected。 | unavailable -> degraded / delayed / failed marker by adapter role。 |
| operations-replay | replay artifact root refs、historical de-identified refs、controlled target refs。 | raw historical body、raw secret、raw external payload。 | missing replay ref rejected;failed target enters safe job report refs。 |
| production-like | future approved provider refs only when `03` closes contract;current P0 keeps opaque refs only. | ordinary raw secret、fake override、test fixture、raw endpoint/body。 | provider unavailable / ref invalid fail-fast;no fake fallback。 |

### 5. 禁输与 critical reject 思考

| 输出面 / 尝试 | 允许候选 | 禁止 / reject 候选 |
|---|---|---|
| structured log / trace | operation name、adapter slot、profile、safe diagnostic ref、redacted issue ref。 | full sensitive ref、secret material、endpoint、route、credential、external response body。 |
| error response | public/internal error code、validation_issue_ref、safe message。 | secret、full target ref、full route ref、raw body、adapter error body。 |
| audit record | actor ref、change request ref、config section、old/new digest、reason ref、validation result。 | raw config、raw secret、full sensitive ref、external body。 |
| metric labels | low-cardinality outcome、adapter slot、profile、error class。 | full ref、endpoint、route、actor free text、unapproved external body digest。 |
| job report / generated artifacts | marker refs、failed refs、safe issue refs、counts、redacted evidence indexes。 | full credential、package body、external GRC response body、raw config with secrets。 |
| critical attempts | validation_issue_ref、forbidden key/boundary class、no activation marker。 | emergency activation、hash raw secret as evidence、hot reload payload retention。 |

### 6. 对 03 的影响预判

| 敏感变更候选结论 | 是否影响 03 | 处理 |
|---|---|---|
| 只定义 sensitive ref 的变更治理、审计、rollback、禁输和 critical reject | 否 | R10.14 可写入候选记录。 |
| 只沿用 Step 8 opaque ref / redacted digest 和 Step 9 restart / new run / rerun | 否 | R10.14 可写入候选记录。 |
| 需要新增 secret provider schema、credential carrier、adapter constructor、port、mapper、loader contract | 是 | 暂停并回 `03` config / adapter owning Step。 |
| 需要 hot reload、zero-downtime secret rotation、admin override、config center | 是 | 暂停并回 `01/03` owning Step。 |
| 需要输出 raw secret、full sensitive ref、external body、package body 或 raw replay body | 越界 | 删除候选,只保留 rejected issue。 |

### 7. R10.14 写入计划

| R10.14 拟写内容 | 写入边界 |
|---|---|
| sensitive change principle table | 写 opaque ref、high review、no hot reload、previous approved digest、禁输总原则。 |
| sensitive family supplement table | 写 store、resolver、publisher/route、handoff/archive、externalGrc、replay root、redaction、future provider 的附加规则候选。 |
| profile restriction table | 写 local-dev、ci-test、integration-like、operations-replay、production-like 的敏感输入限制候选。 |
| forbidden output / critical reject table | 写 log/error/audit/trace/metric/report/artifact 的禁输和 critical reject 候选。 |
| 03 impact table | 写无回写、待回写和越界候选。 |
| R10.15 入口 | 进入配置变更停审记录候选:先思考,不得自动写最终停审。 |

### 8. R10.13 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做敏感变更附加规则思考 | pass | 未写最终敏感变更规则。 |
| 是否覆盖主要 sensitive family | pass | store、resolver、publisher/route、target、externalGrc、replay、redaction、future provider 均已覆盖。 |
| 是否保持 raw secret 禁入 | pass | raw secret、full ref、credential、body 均作为禁止项。 |
| 是否保留无 hot reload | pass | sensitive 轮换仍为 restart / new run / rerun 或 rejected。 |
| 是否保留 03 回写门禁 | pass | secret provider schema、hot reload、admin override、config center 均需回 `03` / 架构。 |
| 是否可进入 R10.14 | pass | 等待用户确认后进入敏感配置变更附加规则候选再写入。 |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.14 敏感配置变更附加规则候选:再写入`;只允许把 R10.13 的 sensitive family 附加规则、profile 限制、禁输 / critical reject 和 03 影响预判写成候选记录;不得创建正式 `04-配置设计.md`;不得写最终敏感变更规则、测试方案、验收标准、实施计划或代码。

## R10.14 敏感配置变更附加规则候选:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.15 |
| 本模块目标 | 将 R10.13 的 sensitive family 附加规则、profile 限制、禁输 / critical reject 和 03 影响预判固化为候选记录。 |
| 本模块允许 | 写入敏感变更总原则候选、sensitive family 附加规则候选、profile 限制候选、禁输 / critical reject 候选、03 影响判定和 R10.15 入口。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写最终敏感变更规则;不定义 secret provider schema / port / mapper / adapter constructor;不写真实 secret、轮换 runbook、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R10.13 已完成敏感配置变更附加规则候选先思考;用户已确认进入 R10.14。 |

### 2. 敏感变更总原则候选记录

| 原则 | 候选规则 | 审计 / rollback 承接 | 禁止项 |
|---|---|---|---|
| ordinary config only carries opaque refs | store / adapter / route / target / replay root 只能通过 opaque ref、safe class、redacted digest 表达。 | old/new ref digest、profile_ref、validation_result、rollback_ref。 | raw secret、DSN、endpoint credential、raw body、full sensitive ref。 |
| sensitive changes require high-risk review | sensitive ref 变更默认 high review;redaction unsafe relax、production-like fake、raw secret/body 为 critical reject。 | actor_ref、reason_ref、approval_ref when available、validation_issue_ref。 | low review 直接放行 sensitive ref、silent relax。 |
| no hot reload for sensitive rotation | P0 只允许 startup restart、job-run-start new run、entry rerun、test rerun 或 rejected / no activation。 | activation_kind、rollback_run_ref、previous approved digest。 | hot reload、zero-downtime secret rotation、runtime live mutation。 |
| rollback only to previous approved digest | sensitive rollback 只能回 previous approved ref digest 或 previous valid run/test input digest。 | rollback_ref、previous_approved_digest、validation_result。 | raw backup、failed ref、provider response、invalid previous digest。 |
| forbidden output spans all surfaces | log、error、audit、trace、metric、job report、artifact 都只能输出 safe refs / digests / issue refs。 | safe_diagnostic_ref、validation_issue_ref、redacted evidence index。 | full ref、credential、external body、package body、raw replay body。 |

### 3. Sensitive family 附加规则候选记录

| Sensitive family | 读取 / 变更规则候选 | 审计候选 | rollback 候选 | critical reject 候选 |
|---|---|---|---|---|
| store refs | startup 只读取 opaque store ref;durable ref 变更 high review。 | logical store slot、old/new ref digest、profile、validation_result。 | restore previous approved store ref digest and restart。 | raw DSN / credential / URL body rejected。 |
| resolver / adapter refs | startup 校验 family coverage、mode/profile compatibility、availability marker。 | resolver family、adapter digest、availability marker、safe_diagnostic_ref。 | restore previous approved adapter ref digest and restart。 | production-like fake fallback、endpoint credential rejected。 |
| publisher / route refs | startup 校验 publisher availability、topic-neutral key coverage、route binding digest。 | publisher slot、route digest、topic coverage marker、validation_result。 | restore previous route map digest and restart。 | raw topic secret、bus credential、payload body rejected。 |
| handoff / archive targets | startup target set 或 job-run-start target selection 均只用 target ref。 | target digest、archive digest、job_run_ref when run-local、marker refs。 | startup restore target set;run-local start new job with previous target。 | package body、target credential、archive body rejected。 |
| externalGrc refs | enablement / adapter / target 均 high review;enabled 必须 adapter+target。 | enabled from/to、adapter digest、target digest、export marker refs。 | restore previous disabled/enabled+ref digest or start new export run。 | external credential、export body、response body rejected。 |
| replay artifact root | 只允许 de-identified replay root ref;operations-replay / test harness 生效。 | replay root digest、de-identification marker、run/test ref。 | rerun replay job or test with previous approved root。 | raw historical body、raw artifact、external payload rejected。 |
| redaction / diagnostics | deny list / prefix / high-cardinality guard 变更必须 safety review。 | added/removed guard digest、prefix digest、unsafe relax issue。 | restore previous deny list / diagnostic guard digest and restart。 | deny list empty、raw body diagnostic、unsafe high-cardinality rejected。 |
| future raw secret provider refs | 当前仅作为 future direction,不进入 P0 schema。 | provider ref digest only if future `03` closes contract。 | provider-side rotation 需 future design;当前不写。 | provider material、API response、hot rotation contract rejected。 |

### 4. Profile 限制候选记录

| Profile | 允许敏感输入候选 | 禁止敏感输入候选 | 失败处理候选 |
|---|---|---|---|
| local-dev | fake refs、in-memory store refs、fake target refs。 | raw secret、real endpoint credential、external body。 | invalid ref fail-fast;missing optional fake target only when feature disabled。 |
| ci-test | deterministic fixture refs、fake store/adapter refs、fixed clock/id refs。 | production secret、real target credential、raw fixture body in config。 | fixture missing test fail-fast。 |
| integration-like | controlled / real-like adapter refs、credential refs、endpoint refs、target refs。 | raw credential material、sibling body、fake fallback after controlled adapter selected。 | unavailable -> degraded / delayed / failed marker by adapter role。 |
| operations-replay | replay artifact root refs、historical de-identified refs、controlled target refs。 | raw historical body、raw secret、raw external payload。 | missing replay ref rejected;failed target enters safe job report refs。 |
| production-like | future approved provider refs only when `03` closes contract;current P0 keeps opaque refs only。 | ordinary raw secret、fake override、test fixture、raw endpoint/body。 | provider unavailable / ref invalid fail-fast;no fake fallback。 |

### 5. 禁输 / critical reject 候选记录

| 输出面 / 尝试 | 允许候选 | 禁止 / reject 候选 |
|---|---|---|
| structured log / trace | operation name、adapter slot、profile、safe diagnostic ref、redacted issue ref。 | full sensitive ref、secret material、endpoint、route、credential、external response body。 |
| error response | public/internal error code、validation_issue_ref、safe message。 | secret、full target ref、full route ref、raw body、adapter error body。 |
| audit record | actor ref、change request ref、config section、old/new digest、reason ref、validation result。 | raw config、raw secret、full sensitive ref、external body。 |
| metric labels | low-cardinality outcome、adapter slot、profile、error class。 | full ref、endpoint、route、actor free text、unapproved external body digest。 |
| job report / generated artifacts | marker refs、failed refs、safe issue refs、counts、redacted evidence indexes。 | full credential、package body、external GRC response body、raw config with secrets。 |
| critical attempts | validation_issue_ref、forbidden key/boundary class、no activation marker。 | emergency activation、hash raw secret as evidence、hot reload payload retention。 |

### 6. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 只定义 sensitive ref 的变更治理、审计、rollback、禁输和 critical reject | 否 | none | not_applicable | 无回写 |
| 只沿用 Step 8 opaque ref / redacted digest 和 Step 9 restart / new run / rerun | 否 | none | not_applicable | 无回写 |
| 不新增 secret provider schema、credential carrier、adapter constructor、port、mapper、loader contract | 否 | none | not_applicable | 无回写 |
| 若后续要求 secret provider schema、credential carrier、adapter constructor、port、mapper、loader contract | 是 | runtime config / adapter contract | `03-详细设计.md` owning Step | 阻塞待确认 |
| 若后续要求 hot reload、zero-downtime secret rotation、admin override、config center | 是 | architecture / runtime flow | `01-架构设计.md` / `03-详细设计.md` owning Step | 阻塞待确认 |
| 若后续要求输出 raw secret、full sensitive ref、external body、package body 或 raw replay body | 是且越界 | security / redaction boundary | not_applicable | 阻塞待确认 |

### 7. R10.15 入口

| 下一模块 | 允许范围 | 禁止范围 |
|---|---|---|
| `R10.15 配置变更停审记录候选:先思考` | 围绕 R10.8~R10.14 的变更、审计、rollback、敏感附加规则,思考按配置族 / 变更类型如何停审权限、评审、审计、rollback、失败处理、敏感性和 03 影响。 | 不创建正式 `04-配置设计.md`;不写最终停审记录;不写跨变更最终审计、测试方案、验收标准、实施计划或代码。 |

### 8. R10.14 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只固化 R10.13 敏感变更候选思考 | pass | 未写最终敏感变更规则。 |
| 是否覆盖 sensitive family | pass | store、resolver、publisher/route、target、externalGrc、replay、redaction、future provider 均已写入。 |
| 是否覆盖 profile 限制 | pass | local-dev、ci-test、integration-like、operations-replay、production-like 均已写入。 |
| 是否覆盖禁输 / critical reject | pass | log、error、audit、trace、metric、report、artifact 和 critical attempts 均已写入。 |
| 是否保留 03 回写门禁 | pass | secret provider / hot reload / admin override / config center 均未私自闭口。 |
| 是否可进入 R10.15 | pass | 等待用户确认后进入配置变更停审记录候选先思考。 |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.15 配置变更停审记录候选:先思考`;只允许围绕 R10.8~R10.14 的变更、审计、rollback、敏感附加规则思考按配置族 / 变更类型如何停审权限、评审、审计、rollback、失败处理、敏感性和 03 影响;不得创建正式 `04-配置设计.md`;不得写最终停审记录、跨变更最终审计、测试方案、验收标准、实施计划或代码。

## R10.15 配置变更停审记录候选:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.16 |
| 本模块目标 | 围绕 R10.8~R10.14 的变更、审计、rollback、敏感附加规则,思考配置变更停审记录候选。 |
| 本模块允许 | 写停审维度思考、按配置族 / 变更类型的停审候选、失败条件、03 影响预判和 R10.16 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写最终停审记录;不写跨变更最终审计、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R10.14 已完成敏感配置变更附加规则候选写入;用户已确认进入 R10.15。 |

### 2. 停审维度思考

| 停审维度 | R10.15 思考结论 | R10.16 写入注意 |
|---|---|---|
| 权限 / 发起方 | 每类变更必须有明确 actor/source,且不能把 any source 的 critical attempt 转成可执行变更。 | 表中写 actor 是否明确、是否越权。 |
| 评审要求 | high / critical 不能降级;low 只能用于收窄数值或 entry-local 当前选择。 | 表中写 review level 是否匹配风险。 |
| 生效方式 | 只能是 startup restart、job-run-start new run、entry-local rerun、test harness rerun、rejected / no activation。 | hot/reload 成功路径直接停审失败。 |
| 审计记录 | 必须有 safe refs / digests / issue refs;敏感变更必须 old/new digest。 | raw config / secret / full ref 出现即失败。 |
| rollback | 必须有 previous validated / approved digest、new run、rerun 或 no activation。 | 无 rollback plan 的 high risk 变更不得通过。 |
| 失败处理 | invalid config、missing ref、adapter unavailable、rollback failed 必须有 Step 11 承接。 | silent fallback 失败。 |
| 敏感性 | sensitive / internal safety-critical / secret 必须进入附加审计和禁输规则。 | 普通配置误归类 sensitive 或 secret 混写需修正。 |
| 03 影响 | 新增 schema / port / mapper / DTO / runtime flow / persistence 必须回 `03`。 | 不能在 Step 10 私自闭口。 |

### 3. 按配置族停审候选思考

| 配置族 / 变更类型 | 停审重点 | 可能失败条件 | R10.16 写入注意 |
|---|---|---|---|
| runtime profile / strict validation | P0/P1 隔离、strict validation、startup activation、rollback digest。 | 放松 strict validation、跨 profile、hot reload。 | medium/high/critical 区分清楚。 |
| stores | store ref sensitive、high review、old/new digest、previous approved rollback。 | raw DSN、credential、full ref、fallback fake。 | 单独检查 sensitive 禁输。 |
| external resolvers | family coverage、mode/profile compatibility、availability marker。 | missing family、production-like fake、endpoint credential。 | 回指 Step 9 adapter validation。 |
| inbound consumers | namespace / version / dedup retention、unsupported version handling。 | 用配置修复 truth、mutate dedup history。 | failure 承接 Step 11 rejected / fail-fast。 |
| outbox publisher / route | publisher availability、topic-neutral route coverage、route digest。 | raw topic secret、missing enabled route、payload body。 | route sensitive ref 单独审计。 |
| jobs defaults / enabled kind | startup defaults 与 run-local input 分离、stored report immutable。 | job config 修复 truth、改写 past report。 | rollback 只能 restart 或 new run。 |
| handoff / archive / externalGrc | target sensitive、enablement high review、body-free / no package body。 | target credential、package body、export response body。 | failed marker/report 只能 safe refs。 |
| redaction / diagnostics | deny list non-empty、unsafe relax critical reject、safe diagnostic only。 | raw body diagnostic、high-cardinality unsafe label。 | internal safety-critical 停审单独列。 |
| boundary / idempotency / retention | widening / retention high review、stored replay immutable。 | drop retention to hide conflict、alter replay result。 | 需要检查 Step 11 failure 承接。 |
| projection / reference / clock / id | marker source 不变、job no-truth-repair、profile-compatible clock/id。 | fixed clock/id in production-like、change marker source。 | 回指 `03` marker / runtime boundary。 |
| run-local / entry-local / test | current scope only、new run/rerun rollback、fixture isolation。 | persist local selector globally、production fixture。 | 与 startup rows 分开停审。 |
| critical rejected attempts | no activation、issue audit、design change only if future support。 | emergency activation、hash raw secret、silent accept。 | 不能转成可变更配置。 |

### 4. 停审失败条件思考

| 失败条件 | 处理思考 | 后续承接 |
|---|---|---|
| actor / review 缺失 | high / sensitive / critical 变更不得通过。 | R10.16 写入 unresolved / blocked candidate。 |
| audit 字段泄露敏感信息 | 立即失败,保留 rejected issue,修正审计字段。 | R10.16 写入停审失败。 |
| rollback target 缺失或未校验 | high risk 变更不得通过;需要补 previous approved digest。 | Step 11 承接 fail-fast / blocked change。 |
| activation 依赖 hot reload | 失败;P0 不支持 reload/hot。 | 回 `03` / 架构或 rejected。 |
| 需要新增 formal schema / port / mapper | Step 10 不能闭口。 | 回 `03` owning Step。 |
| 修改 truth / report / replay surface | 越界失败。 | critical rejected attempt。 |
| sensitive family 未进附加审计 | 停审失败,补 R10.14 规则或回 Step 8。 | R10.16 写修正方向。 |
| Step 11 失效承接缺失 | 本 Step 只能标记 pending handoff,不能伪造失效矩阵。 | Step 11 继续闭口。 |

### 5. 对 03 的影响预判

| 停审候选结论 | 是否影响 03 | 处理 |
|---|---|---|
| 只检查 R10.8~R10.14 候选是否有 actor/review/activation/audit/rollback/failure/sensitive/03 impact | 否 | R10.16 可写入候选记录。 |
| 停审失败时只标记 blocked / rejected / handoff to Step 11 或 `03` | 否 | R10.16 可写入候选记录。 |
| 停审需要新增正式 approval workflow、audit repository、rollback snapshot object | 是 | 暂停并回 `03` / 架构 owning Step。 |
| 停审试图豁免 redline 或绕过 03 回写 | 越界 | 删除候选,保留 blocker。 |

### 6. R10.16 写入计划

| R10.16 拟写内容 | 写入边界 |
|---|---|
| stop-review dimension table | 写权限、评审、生效、审计、rollback、失败处理、敏感性、03 影响八类停审维度。 |
| per-family stop-review candidate table | 写 runtime、stores、resolvers、inbound、outbox、jobs、handoff/externalGrc、redaction、boundary、projection/reference、run-local/test、critical rejected 的停审候选。 |
| stop-review failure condition table | 写 actor/review 缺失、审计泄露、rollback 缺失、hot reload、schema 缺口、truth/report rewrite、sensitive 缺审计、Step 11 缺承接。 |
| 03 impact table | 写无回写、待回写、越界候选。 |
| R10.17 入口 | 进入跨变更审计 / 回滚审计候选:先思考,不得自动写最终跨变更审计。 |

### 7. R10.15 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做停审候选思考 | pass | 未写最终停审记录。 |
| 是否覆盖停审维度 | pass | 权限、评审、生效、审计、rollback、失败处理、敏感性和 03 影响均已覆盖。 |
| 是否覆盖配置族 | pass | R10.8~R10.14 的主要配置族和 critical attempts 均已纳入。 |
| 是否保留失败条件 | pass | actor/review/audit/rollback/hot reload/schema/truth rewrite/sensitive/Step 11 缺口均已列出。 |
| 是否保留 03 回写门禁 | pass | schema / port / mapper / snapshot / workflow 仍需回 `03` / 架构。 |
| 是否可进入 R10.16 | pass | 等待用户确认后进入配置变更停审记录候选再写入。 |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.16 配置变更停审记录候选:再写入`;只允许把 R10.15 的停审维度、按配置族 / 变更类型停审候选、失败条件和 03 影响预判写成候选记录;不得创建正式 `04-配置设计.md`;不得写最终停审记录、跨变更最终审计、测试方案、验收标准、实施计划或代码。

## R10.16 配置变更停审记录候选:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.17 |
| 本模块目标 | 将 R10.15 的停审维度、按配置族 / 变更类型停审候选、失败条件和 03 影响预判固化为候选记录。 |
| 本模块允许 | 写入配置变更停审维度候选、配置族停审候选、停审失败条件、03 影响判定和 R10.17 入口。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写最终停审记录;不写跨变更最终审计、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R10.15 已完成配置变更停审记录候选先思考;用户已确认进入 R10.16。 |

### 2. 停审维度候选记录

| 审查项 | 通过条件候选 | 失败条件候选 | 修正 / 承接 |
|---|---|---|---|
| 权限 / 发起方 | 变更记录含 actor_ref、change_source_kind、reason_ref;critical attempt 只能记录 rejected。 | actor 缺失、source 不明、critical attempt 被转成 executable change。 | 标记 blocked;补 actor/source 或改为 rejected audit。 |
| 评审要求 | low / medium / high / critical 与配置敏感性和影响面匹配;sensitive 默认 high。 | high / sensitive / critical 降级评审;review_ref 缺失但要求已触发。 | 阻塞变更;回 R10.8 / R10.14 修正 review level。 |
| 生效方式 | 只允许 startup restart、job-run-start new run、entry-local rerun、test harness rerun、rejected / no activation。 | hot reload、runtime live mutation、admin override、config center as success path。 | critical reject;若业务坚持则回架构 / `03` owning Step。 |
| 审计记录 | 只记录 safe refs、redacted digest、validation_issue_ref、rollback_ref、profile_ref。 | raw config、raw secret、full sensitive ref、route / endpoint / package body 泄露。 | 停审失败;修正审计字段并保留 safe issue。 |
| rollback | 高风险变更有 previous approved digest 或可重跑边界;rejected attempt 无需 rollback。 | 无 previous digest、rollback 指向 failed value、回滚要求改写历史结果。 | 标记 rollback_plan_incomplete;Step 11 承接 fail-fast。 |
| 失败处理 | invalid / missing / incompatible / unavailable / rollback failed 均有 Step 11 承接方向。 | silent fallback、fake fallback in production-like、失败后继续使用不明配置。 | 交给 Step 11 完成失效策略,本步保留 handoff。 |
| 敏感性 | sensitive / internal safety-critical / secret ref 进入附加审计、禁输和 high review。 | 敏感配置按 ordinary 处理、secret provider 规则私自闭口。 | 回 Step 8 / R10.14 或 `03` owning Step。 |
| 03 影响 | 不新增 schema / port / mapper / DTO / runtime flow / persistence 时可留在 04。 | 停审依赖新 formal object、approval workflow、audit repository 或 rollback snapshot。 | 暂停并回 `03` / 架构 owning Step。 |

### 3. 按配置族 / 变更类型停审候选记录

| 配置族 / 变更类型 | 审查项 | 结论候选 | 缺口 / 修正 |
|---|---|---|---|
| runtime profile / strict validation | profile 隔离、strict validation、startup activation、rollback digest。 | candidate_pass_if_review_and_digest_present | 放松 strict validation、跨 profile 或 hot reload 时停审失败。 |
| stores | store ref 敏感性、old/new digest、credential 禁输、previous approved rollback。 | candidate_high_review_required | raw DSN / credential / full ref 出现即 critical reject。 |
| external resolvers | resolver family coverage、mode/profile compatibility、availability marker。 | candidate_pass_with_startup_validation | production-like fake fallback、endpoint credential 或 family missing 需阻塞。 |
| inbound consumers | namespace/version/dedup retention、unsupported version handling。 | candidate_pass_if_no_truth_repair | 试图用配置修复 truth 或修改 dedup history 时越界。 |
| outbox publisher / route | publisher availability、topic-neutral route coverage、route digest、payload 禁输。 | candidate_high_review_for_route_change | topic secret、bus credential、payload body 或 missing enabled route 需失败。 |
| jobs defaults / enabled kind | startup defaults 与 run-local input 分离、stored report immutable。 | candidate_pass_with_new_run_boundary | 改写 past report、用 job 配置修复 truth 或修改 replay surface 时失败。 |
| handoff / archive / externalGrc | target sensitive、body-free、adapter+target 同时闭合、safe report refs。 | candidate_high_review_required | package body、target credential、export response body 或 target missing 需失败。 |
| redaction / diagnostics | deny list non-empty、safe diagnostic、high-cardinality guard。 | candidate_internal_safety_review_required | unsafe relax、raw body diagnostic、deny list empty 为 critical reject。 |
| boundary / idempotency / retention | widening / retention 影响、stored replay immutable、conflict 不可隐藏。 | candidate_high_review_required | drop retention to hide conflict 或改变 replay result 时越界。 |
| projection / reference / clock / id | marker source 不变、job no-truth-repair、profile-compatible clock/id。 | candidate_pass_if_marker_contract_unchanged | change marker source、fixed clock/id in production-like 或私补 mapper 需回 `03`。 |
| run-local / entry-local / test harness | current scope only、new run/rerun rollback、fixture isolation。 | candidate_pass_if_not_persisted_globally | local selector 持久化为 startup 配置或 production fixture 需失败。 |
| critical rejected attempts | no activation、safe issue audit、design change only after future support。 | rejected_only | emergency activation、hash raw secret、保留 hot reload payload 需失败。 |

### 4. 停审失败条件候选记录

| 失败条件 | 停审结论 | 缺口 / 修正 | 下游承接 |
|---|---|---|---|
| actor / source 缺失 | blocked | 补 actor_ref / change_source_kind;否则不得通过。 | R10.17 跨变更审计检查。 |
| review level 缺失或降级 | blocked | high / sensitive / critical 需恢复匹配评审。 | R10.17 审计高风险无评审。 |
| audit 泄露敏感内容 | critical_rejected | 删除 raw / full / body 字段,只保留 safe refs / digests。 | Step 11 safe failure;Step 12 测试承接。 |
| rollback target 缺失 | blocked_or_pending_step11 | 补 previous approved digest / rerun boundary;不能把 failed value 作为 rollback。 | Step 11 fail-fast / blocked change。 |
| hot reload / admin override | critical_rejected | 当前 P0 不支持;如要支持需回架构 / `03`。 | blocker 台账。 |
| schema / port / mapper 缺口 | return_to_03 | 不得在 Step 10 自行补口。 | `03-详细设计.md` owning Step。 |
| truth / report / replay rewrite | critical_rejected | 配置不能改写 truth、stored report、stored replay surface。 | 设计红线记录。 |
| sensitive 未纳入附加审计 | blocked | 回 Step 8 / R10.14 补敏感归类和附加审计。 | R10.17 sensitive audit。 |
| Step 11 失效承接缺失 | pending_handoff | 本步只记录 handoff,不伪造失效矩阵。 | Step 11。 |

### 5. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 处理状态 |
|---|---|---|---|
| 停审只检查 actor、review、activation、audit、rollback、failure、sensitivity、03 impact 是否闭合 | 否 | none | 可留在 04 Step 10 候选。 |
| 使用 product-neutral refs、redacted digest、validation_issue_ref、rollback_ref 表达停审 | 否 | none | 可留在 04 Step 10 候选。 |
| 停审失败只标记 blocked、rejected、pending handoff 或 return_to_03 | 否 | none | 可留在 04 Step 10 候选。 |
| 新增 approval workflow、audit repository、rollback snapshot object、runtime live reload flow | 是 | architecture / domain / runtime contract | 暂停并回 `01` / `03` owning Step。 |
| 通过配置豁免 truth owner、state transition、query no-write、stored replay、transaction boundary、marker source、body-free 或 P0/P1 隔离 | 是且越界 | design redline violation | 删除候选并记录 blocker。 |

### 6. R10.17 入口

| 下一模块 | 允许范围 | 禁止范围 |
|---|---|---|
| `R10.17 跨变更审计 / 回滚审计候选:先思考` | 围绕 R10.8~R10.16 的配置变更候选,思考跨变更审计项、rollback 审计项、unresolved 冲突、Step 11 handoff 和 03 回写门禁。 | 不创建正式 `04-配置设计.md`;不写最终跨变更审计表;不进入测试方案、验收标准、实施计划或代码。 |

### 7. R10.16 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只固化 R10.15 候选思考 | pass | 未写最终停审记录。 |
| 是否覆盖停审维度 | pass | 权限、评审、生效、审计、rollback、失败处理、敏感性和 03 影响均已写入。 |
| 是否覆盖配置族 / 变更类型 | pass | runtime、stores、resolvers、inbound、outbox、jobs、handoff、redaction、boundary、projection/reference、run-local/test、critical rejected 均已写入。 |
| 是否覆盖失败条件 | pass | actor/source、review、audit 泄露、rollback、hot reload、schema 缺口、truth/report rewrite、sensitive、Step 11 承接均已写入。 |
| 是否保留 03 回写门禁 | pass | approval workflow、audit repository、rollback snapshot 和 runtime live reload 仍需回 `01` / `03`。 |
| 是否可进入 R10.17 | pass | 等待用户确认后进入跨变更审计 / 回滚审计候选先思考。 |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.17 跨变更审计 / 回滚审计候选:先思考`;只允许围绕 R10.8~R10.16 的配置变更候选思考跨变更审计项、rollback 审计项、unresolved 冲突、Step 11 handoff 和 03 回写门禁;不得创建正式 `04-配置设计.md`;不得写最终跨变更审计表、测试方案、验收标准、实施计划或代码。

## R10.17 跨变更审计 / 回滚审计候选:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.18 |
| 本模块目标 | 围绕 R10.8~R10.16 的配置变更候选,思考跨变更审计项、rollback 审计项、unresolved 冲突、Step 11 handoff 和 03 回写门禁。 |
| 本模块允许 | 写跨变更审计维度思考、回滚审计思考、未闭合冲突思考、Step 11 handoff 思考、03 影响预判和 R10.18 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写最终跨变更审计表;不进入测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R10.16 已完成配置变更停审记录候选写入;用户已确认进入 R10.17。 |

### 2. 跨变更审计维度思考

| 审计维度 | 思考结论 | R10.18 写入注意 |
|---|---|---|
| 高风险是否都有评审 | stores、resolver、outbox route、handoff target、externalGrc、redaction、boundary/idempotency 均必须 high 或 critical;run-local / entry-local 不能绕过高风险评审。 | 写成 cross-change audit row,检查 high-risk 无评审。 |
| 是否都有 safe audit 字段 | 所有变更至少要能落 actor/source、section、profile、activation、digest/issue/ref;敏感族必须 old/new redacted digest。 | 写字段完整性审计,不引入正式 schema。 |
| 是否泄露敏感信息 | log、audit、report、metric、trace、error、artifact 均只允许 safe refs / digest / issue refs。 | 写泄露审计,raw secret/body/full ref 为 critical reject。 |
| 是否假设具体工单系统 | Step 10 只能要求 change_request_ref / actor_ref / reason_ref 这类 product-neutral refs。 | 写 product-neutral 审计,禁止 ticket product 前提。 |
| 是否跨 profile 失控 | local-dev / ci-test / integration-like / operations-replay / production-like 的输入限制不能被普通变更覆盖。 | 写 profile isolation 审计。 |
| 是否出现 config center / hot reload 成功路径 | 当前 P0 不支持 remote config center、admin override、runtime live mutation 或 hot reload rollback。 | 写 unsupported activation 审计。 |
| 是否改变 truth / report / replay | 配置不得改写 truth、stored report、stored replay result、transaction boundary、marker source。 | 写 redline 审计。 |
| 是否回指 Step 7 / 8 / 9 / 11 | 每类变更必须能回到配置项、敏感性、生效机制和失效策略承接点。 | 写回指完整性审计。 |

### 3. 回滚审计思考

| 回滚场景 | 应审计内容 | 失败判定 | Step 11 承接 |
|---|---|---|---|
| startup restart rollback | previous approved digest、new digest、validation result、rollback_ref、restart outcome。 | previous digest 缺失、previous digest 未校验、rollback 依赖 hot patch。 | fail-fast / rollback failed / no facade exposed。 |
| job-run-start rollback | original run input digest、previous valid input digest、new run ref、stored report immutable。 | 改写旧 report、复用冲突 idempotency key、failed target 被当作 rollback。 | job rejected / failed rollback run。 |
| entry-local rerun | entry selector digest、rejection issue、caller retry boundary。 | selector 持久化成全局配置、entry-local 越权覆盖 startup。 | entry rejected / invalid selector。 |
| test harness rerun | fixture digest、profile、test run ref、previous fixture ref。 | fixture 进入 production-like、raw fixture body 进审计。 | test fail-fast / fixture invalid。 |
| sensitive ref rollback | old/new redacted ref digest、previous approved ref、validation issue。 | rollback 到 raw backup、failed ref、provider response 或 full ref。 | sensitive failure / blocked change。 |
| critical rejected attempt | validation_issue_ref、forbidden key class、no activation marker。 | emergency activation、hash raw secret 作为 evidence、保留 hot payload。 | rejected / design change required。 |

### 4. 未闭合冲突思考

| 冲突类型 | 当前思考 | R10.18 写入注意 |
|---|---|---|
| high-risk no review | 若 high / sensitive / critical 行没有 review_ref 或等价 product-neutral approval ref,不能进入最终配置变更表。 | 写 unresolved 或 blocked candidate。 |
| audit missing safe digest | 若变更只记录 section 但没有 old/new digest 或 issue ref,审计不可追溯。 | 写缺口并要求补 digest/ref。 |
| rollback plan incomplete | 若 high-risk 只有 forward activation,没有 previous approved digest / new run / rerun 口径,不能通过。 | 写 rollback audit failed。 |
| Step 11 handoff missing | 若失败条件没有 fail-fast/rejected/degraded/delayed/failed marker 方向,本 Step 只能标记 pending handoff。 | 写 Step 11 handoff required。 |
| schema / port / mapper dependency | 若审计或 rollback 需要正式对象、port、mapper、repository 或 evidence schema,不能在 Step 10 自行发明。 | 写 return_to_03。 |
| legacy 05/06/07 reverse source | 若测试/验收/实施旧文档反向要求新配置项,必须拒绝作为 Step 10 真相源。 | 写 old downstream ignored。 |
| final 04 premature write | 当前仍是中间产物,不能把候选直接升格为正式 `04`。 | 写 assembly deferred to Step 15。 |

### 5. Step 11 handoff 思考

| Handoff 项 | Step 10 当前只负责 | Step 11 后续需要闭合 |
|---|---|---|
| invalid config | 记录 validation_issue_ref、no activation、blocked / rejected。 | fail-fast / fail-closed / rejected 的状态、错误面、恢复路径。 |
| dependency unavailable | 记录 adapter/store/target unavailable 的 safe marker 或 issue ref 候选。 | 不同依赖角色的 unavailable / degraded / delayed 策略。 |
| rollback failed | 记录 rollback_ref、rollback attempt outcome、safe issue。 | rollback failed 的继续运行、暂停、告警、人工介入策略。 |
| repeated rejected attempts | 记录 repeated invalid issue,不得自动放开。 | 重复失败的节流、告警、证据和运维处理。 |
| partial job failure | 记录 new run/report immutable、failed marker。 | job failed / partial / retry / DLQ 的正式失效矩阵。 |
| sensitive leak attempt | 记录 critical rejected issue,不输出 raw material。 | leak prevention 的 fail-fast、evidence redaction 和测试切口。 |

### 6. 对 03 的影响预判

| 审计 / 回滚结论 | 是否影响 03 | 处理 |
|---|---|---|
| 跨变更审计只检查候选表的一致性、红线和回指闭合 | 否 | R10.18 可写入候选记录。 |
| 回滚审计只复用 startup restart、new run、entry rerun、test rerun 和 no activation | 否 | R10.18 可写入候选记录。 |
| Step 11 handoff 只记录待后续闭合,不定义最终失效矩阵 | 否 | R10.18 可写入候选记录。 |
| 要求新增 ConfigChangeAudit object、rollback snapshot repository、approval workflow 或 online last-known-good | 是 | 暂停并回 `03` / 架构 owning Step。 |
| 要求 remote config center、admin override、runtime hot reload 或 live mutation | 是且越界 | 当前 P0 删除候选并记录 blocker。 |

### 7. R10.18 写入计划

| R10.18 拟写内容 | 写入边界 |
|---|---|
| cross-change audit candidate table | 写高风险评审、safe audit、敏感禁输、product-neutral、profile isolation、unsupported activation、redline、回指完整性。 |
| rollback audit candidate table | 写 startup、job-run-start、entry-local、test harness、sensitive ref、critical rejected 的 rollback 审计。 |
| unresolved conflict candidate table | 写 high-risk no review、audit missing digest、rollback incomplete、Step 11 handoff missing、schema/port/mapper dependency 等。 |
| Step 11 handoff table | 写 invalid config、dependency unavailable、rollback failed、repeated rejected、partial job failure、sensitive leak attempt 的 handoff。 |
| 03 impact table | 写无回写、待回写、越界候选。 |
| R10.19 入口 | 进入 Step 10 总体收口与进入 Step 11 判断:先思考,不得自动关闭 Step 10。 |

### 8. R10.17 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做跨变更审计思考 | pass | 未写最终跨变更审计表。 |
| 是否覆盖跨变更审计维度 | pass | 评审、审计字段、敏感泄露、product-neutral、profile、hot reload、redline 和回指均已覆盖。 |
| 是否覆盖 rollback 审计 | pass | startup、job-run-start、entry-local、test、sensitive、critical rejected 均已覆盖。 |
| 是否保留 Step 11 handoff | pass | invalid config、dependency unavailable、rollback failed、repeated rejected、partial job failure、sensitive leak 均保留 handoff。 |
| 是否保留 03 回写门禁 | pass | audit object、rollback repository、approval workflow、online last-known-good、config center/hot reload 均未私自闭口。 |
| 是否可进入 R10.18 | pass | 等待用户确认后进入跨变更审计 / 回滚审计候选再写入。 |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.18 跨变更审计 / 回滚审计候选:再写入`;只允许把 R10.17 的跨变更审计维度、rollback 审计、未闭合冲突、Step 11 handoff 和 03 影响预判写成候选记录;不得创建正式 `04-配置设计.md`;不得写 Step 10 总体收口、测试方案、验收标准、实施计划或代码。

## R10.18 跨变更审计 / 回滚审计候选:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.19 |
| 本模块目标 | 将 R10.17 的跨变更审计维度、rollback 审计、未闭合冲突、Step 11 handoff 和 03 影响预判固化为候选记录。 |
| 本模块允许 | 写入 cross-change audit 候选表、rollback audit 候选表、unresolved conflict 候选表、Step 11 handoff 候选表、03 影响判定和 R10.19 入口。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写 Step 10 总体收口;不进入 Step 11、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R10.17 已完成跨变更审计 / 回滚审计候选先思考;用户已确认进入 R10.18。 |

### 2. Cross-change audit 候选记录

| 审计项 | 结论候选 | 缺口 / 修正候选 |
|---|---|---|
| high-risk change review coverage | candidate_pass_if_all_high_sensitive_critical_rows_have_review_ref_or_equivalent | stores、resolver、outbox route、handoff target、externalGrc、redaction、boundary/idempotency 若缺评审则 blocked。 |
| safe audit field coverage | candidate_pass_if_actor_source_section_profile_activation_digest_issue_ref_present | 只记录 section 而无 old/new digest 或 issue ref 时 audit_missing_safe_digest。 |
| sensitive non-disclosure | candidate_pass_if_only_safe_refs_redacted_digest_issue_refs_are_recorded | raw secret、raw body、full sensitive ref、endpoint、route credential、package body 均 critical_rejected。 |
| product-neutral change trace | candidate_pass_if_change_request_ref_actor_ref_reason_ref_are_product_neutral | 不得假定具体 ticket / approval product;具体平台只能由下游映射。 |
| profile isolation | candidate_pass_if_profile_specific_inputs_do_not_cross_runtime_profiles | local-dev / ci-test fixture、fake refs、operations replay root 不得进入 production-like。 |
| unsupported activation | rejected_only | remote config center、admin override、runtime hot reload、live mutation 不作为 P0 成功路径。 |
| truth / report / replay redline | rejected_only | 配置不得改写 truth owner、state transition、stored report、stored replay result、transaction boundary、marker source。 |
| Step 7 / 8 / 9 / 11 trace closure | candidate_pass_if_each_change_family_has_upstream_and_handoff_refs | 缺配置项、敏感性、生效机制或失效策略承接时 pending_handoff 或 return_to_owning_step。 |

### 3. Rollback audit 候选记录

| 回滚场景 | 审计字段候选 | 通过条件候选 | 失败 / 修正候选 |
|---|---|---|---|
| startup restart rollback | previous_approved_digest、new_digest、validation_result、rollback_ref、restart_outcome。 | previous digest 已验证,rollback 后重新 parse/type/cross-field validate。 | previous digest missing / invalid、hot patch rollback、跳过 validator 均失败。 |
| job-run-start rollback | original_input_digest、previous_valid_input_digest、new_run_ref、stored_report_ref。 | 启动 new run,旧 report 保持 immutable。 | 改写旧 report、复用冲突 idempotency key、failed target 作为 rollback 均失败。 |
| entry-local rerun | entry_ref、selector_digest、validation_issue_ref、retry_boundary。 | 当前 entry rejected,caller 以 previous selector 重试。 | selector 写入全局配置、越权覆盖 startup config 均失败。 |
| test harness rerun | test_run_ref、fixture_digest、previous_fixture_ref、profile_ref。 | 恢复 previous fixture 并 rerun test。 | fixture 泄漏到 production-like、raw fixture body 进审计均失败。 |
| sensitive ref rollback | old_ref_digest、new_ref_digest、previous_approved_ref_digest、validation_issue_ref。 | 只回 previous approved ref digest 或新 approved ref digest。 | raw backup、failed ref、provider response、full ref 均失败。 |
| critical rejected attempt | validation_issue_ref、forbidden_key_class、no_activation_marker。 | 不激活,只保留 safe rejected issue。 | emergency activation、hash raw secret、保留 hot payload 均失败。 |

### 4. Unresolved conflict 候选记录

| 冲突 | 候选状态 | 修正方向 | 是否阻塞进入 R10.19 |
|---|---|---|---|
| high-risk no review | blocked_if_present | 补 product-neutral review / approval ref 或降级为 rejected attempt。 | 是 |
| audit missing safe digest | blocked_if_present | 补 old/new digest、validation_issue_ref、rollback_ref 或 safe_diagnostic_ref。 | 是 |
| rollback plan incomplete | blocked_if_high_risk | 补 previous approved digest、new run、entry rerun、test rerun 或 no activation。 | 是 |
| Step 11 handoff missing | pending_handoff_if_failure_strategy_not_final | 在 Step 10 只记录 handoff,Step 11 闭合失效矩阵。 | 否,但 R10.19 需确认 handoff 完整 |
| schema / port / mapper dependency | return_to_03_if_needed | 回 `03-详细设计.md` owning Step,不得在 04 自行补 schema。 | 是 |
| old downstream reverse source | ignored_as_truth_source | 旧 05/06/07 只能作方向输入,不得反向定义配置项。 | 否 |
| premature formal 04 assembly | blocked | 正式 `04-配置设计.md` 只能 Step 15 装配。 | 是 |

### 5. Step 11 handoff 候选记录

| Handoff 项 | Step 10 已记录候选 | Step 11 必须闭合 | 禁止在 Step 10 私自闭合 |
|---|---|---|---|
| invalid config | validation_issue_ref、no activation、blocked / rejected。 | fail-fast、fail-closed、rejected 的状态、错误面、恢复路径。 | 不定义最终 error surface / recovery state。 |
| dependency unavailable | adapter/store/target unavailable safe marker 或 issue ref。 | 不同依赖角色的 unavailable、degraded、delayed、failed 策略。 | 不发明 availability marker 来源。 |
| rollback failed | rollback_ref、rollback_attempt_outcome、safe issue。 | rollback failed 后继续运行 / 暂停 / 告警 / 人工介入。 | 不定义 online last-known-good。 |
| repeated rejected attempts | repeated invalid issue、actor/source safe ref。 | 节流、告警、证据保留、运维处理。 | 不自动放开重复失败。 |
| partial job failure | new run/report immutable、failed marker。 | job failed / partial / retry / DLQ 的正式失效矩阵。 | 不改写旧 report。 |
| sensitive leak attempt | critical rejected issue、redacted evidence index。 | leak prevention fail-fast、evidence redaction、测试切口。 | 不输出 raw material。 |

### 6. 对 03 的影响判定

| 候选结论 | 是否影响 03 | 影响类型 | 处理状态 |
|---|---|---|---|
| 跨变更审计只检查 R10.8~R10.16 候选的一致性、红线和回指闭合 | 否 | none | 可留在 04 Step 10 候选。 |
| rollback audit 只复用 startup restart、job new run、entry rerun、test rerun 和 no activation | 否 | none | 可留在 04 Step 10 候选。 |
| Step 11 handoff 只记录待后续闭合,不定义最终失效矩阵 | 否 | none | 可留在 04 Step 10 候选。 |
| 需要 ConfigChangeAudit object、rollback snapshot repository、approval workflow、audit persistence 或 evidence schema | 是 | domain / application / persistence / evidence contract | 暂停并回 `03` 或后续 owning design source。 |
| 需要 remote config center、admin override、runtime hot reload、live mutation 或 online last-known-good | 是且越界 | architecture / runtime redline | 当前 P0 删除候选并记录 blocker。 |

### 7. R10.19 入口

| 下一模块 | 允许范围 | 禁止范围 |
|---|---|---|
| `R10.19 Step 10 总体收口与进入 Step 11 判断:先思考` | 围绕 R10.1~R10.18 检查 Step 10 是否可收口、是否存在 unresolved blocker、Step 11 handoff 是否完整、是否允许进入 Step 11。 | 不创建正式 `04-配置设计.md`;不直接标记 Step 10 completed;不写 Step 11 正文、测试方案、验收标准、实施计划或代码。 |

### 8. R10.18 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只固化 R10.17 候选思考 | pass | 未写 Step 10 总体收口。 |
| 是否覆盖 cross-change audit | pass | 评审、安全审计字段、敏感禁输、product-neutral、profile、unsupported activation、redline、回指完整性均已写入。 |
| 是否覆盖 rollback audit | pass | startup、job-run-start、entry-local、test harness、sensitive ref、critical rejected 均已写入。 |
| 是否覆盖 unresolved conflicts | pass | high-risk no review、audit missing digest、rollback incomplete、Step 11 handoff、schema/port/mapper、old downstream、premature assembly 均已写入。 |
| 是否保留 03 回写门禁 | pass | formal object / repository / workflow / hot reload / config center 均未私自闭口。 |
| 是否可进入 R10.19 | pass | 等待用户确认后进入 Step 10 总体收口与进入 Step 11 判断先思考。 |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.19 Step 10 总体收口与进入 Step 11 判断:先思考`;只允许围绕 R10.1~R10.18 检查 Step 10 是否可收口、是否存在 unresolved blocker、Step 11 handoff 是否完整、是否允许进入 Step 11;不得创建正式 `04-配置设计.md`;不得直接标记 Step 10 completed;不得写 Step 11 正文、测试方案、验收标准、实施计划或代码。

## R10.19 Step 10 总体收口与进入 Step 11 判断:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.20 |
| 本模块目标 | 围绕 R10.1~R10.18 检查 Step 10 是否具备收口条件、是否存在 unresolved blocker、Step 11 handoff 是否完整、是否允许进入 Step 11。 |
| 本模块允许 | 写总体收口判断思考、SOP 产出完整性思考、unresolved blocker 思考、Step 11 handoff 完整性思考、03 影响预判和 R10.20 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不直接标记 Step 10 completed;不写 Step 11 正文、测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R10.18 已完成跨变更审计 / 回滚审计候选写入;用户已确认进入 R10.19。 |

### 2. SOP 产出完整性思考

| SOP 期望产出 | 当前候选来源 | 完整性思考 | R10.20 写入注意 |
|---|---|---|---|
| 配置变更表 | R10.5~R10.8 | 已覆盖 actor、review、activation、audit、rollback 和 Step 回指;R10.8 重点写 startup / run-local / entry-local / test / critical rejected。 | 写 ready_candidate,不得升格最终正式表。 |
| 审计与回滚规则 | R10.9~R10.12 | 已覆盖 audit event scope、safe metadata、redacted digest、validation issue、rollback target 和禁止动作。 | 写 ready_candidate,保留 safe-only 红线。 |
| 配置变更停审记录 | R10.15~R10.16 | 已覆盖权限、评审、生效、审计、rollback、失败处理、敏感性和 03 影响。 | 写 stop-review candidate passed_if_no_new_gap。 |
| 跨变更审计 / 回滚审计表 | R10.17~R10.18 | 已覆盖 high-risk review、safe audit、sensitive non-disclosure、profile isolation、unsupported activation、redline、trace closure 和 rollback audit。 | 写 cross-audit candidate passed_if_no_unresolved_conflict。 |
| Step 11 handoff | R10.11~R10.18 | 已保留 invalid config、dependency unavailable、rollback failed、repeated rejected、partial job failure、sensitive leak attempt 等 handoff。 | 写 handoff complete for Step 11 start,但不定义 Step 11 矩阵。 |
| 对 03 的影响判定 | R10.1~R10.18 每模块 | 已反复标记 formal object / repository / workflow / hot reload / config center 需回 `03` 或越界。 | 写 no_current_03_writeback_candidate,除非用户新增诉求。 |

### 3. 收口条件思考

| 收口条件 | 当前判断 | 依据 | R10.20 写入注意 |
|---|---|---|---|
| 是否覆盖所有 Step 10 SOP 问题 | candidate_pass | R10.3~R10.4 回答八问;R10.5~R10.18 展开表格和审计。 | 写 pass_candidate。 |
| 是否每类变更有 actor/review/activation/audit/rollback | candidate_pass | R10.6/R10.8/R10.16 已按配置族和变更类型覆盖。 | 写 pass_candidate,保留 high-risk review gate。 |
| 是否敏感变更有附加规则 | candidate_pass | R10.13~R10.14 覆盖 sensitive family、profile 限制、禁输 / critical reject。 | 写 pass_candidate。 |
| 是否跨变更无 unresolved 冲突 | candidate_pass_if_no_new_input | R10.18 的 blocked 条件均为条件式,当前未发现必须立即回 `03` 的实际 blocker。 | 写 no_known_unresolved_blocker。 |
| 是否 Step 11 handoff 足够 | candidate_pass_for_handoff | Step 10 已列出 Step 11 必须闭合项,没有在本 Step 私自定义最终失效矩阵。 | 写 ready_to_enter_step11_after_R10.20。 |
| 是否可创建正式 `04` | not_yet | Step 15 才能装配正式文档。 | 写 formal_assembly_deferred。 |

### 4. Unresolved blocker 思考

| Blocker 类别 | 当前是否存在实际 blocker | 判断理由 | 处理 |
|---|---|---|---|
| formal schema / port / mapper 缺口 | 未发现当前 Step 10 必须新增 | 现有候选只使用 product-neutral refs、digest、issue refs 和 handoff,没有定义新正式对象。 | R10.20 写 no_current_return_to_03。 |
| approval workflow / audit repository | 未作为 P0 前提 | 只要求 review_ref / change_request_ref / actor_ref,不指定审批系统或持久化仓储。 | 保持产品中立。 |
| rollback snapshot repository | 未作为 P0 前提 | rollback 使用 previous approved digest / new run / rerun / no activation,不定义 snapshot repo。 | 保持候选。 |
| hot reload / config center / admin override | 作为越界 rejected | R10.16/R10.18 已标记 unsupported / critical rejected。 | 不阻塞进入 Step 11,但不得放入 P0 success path。 |
| Step 11 failure matrix 缺失 | 是后续 Step 责任,不是 Step 10 blocker | Step 10 只需 handoff;SOP Step 11 专门闭合失效模式。 | 允许进入 Step 11 前在 R10.20 明确 handoff。 |
| 旧 05/06/07 反向污染 | 当前已禁止 | flow 和台账均明确旧下游只作方向输入。 | R10.20 写 old downstream ignored。 |

### 5. Step 11 进入判断思考

| 判断项 | 当前思考 | 进入 Step 11 前需要 R10.20 固化 |
|---|---|---|
| Step 11 输入是否够用 | 够用候选。Step 5 来源优先级、Step 7 配置项、Step 8 敏感配置、Step 9 生效机制和 Step 10 变更 / 审计 / rollback 候选均已具备。 | 写 Step 11 input baseline。 |
| Step 11 不应继承什么 | 不继承 hot reload、config center、admin override、truth/report/replay rewrite、raw secret/body 输出。 | 写 forbidden inheritance。 |
| Step 11 必须闭合什么 | invalid config、missing ref、dependency unavailable、rollback failed、repeated rejected、partial job failure、sensitive leak attempt。 | 写 handoff checklist。 |
| Step 11 是否可以改写 Step 10 | 不能反向改写 Step 10 变更表;只能在发现缺口时回 Step 10 或回 `03`。 | 写 reverse-change rule。 |
| 是否可进入 Step 11 | R10.19 候选判断为可进入,但需 R10.20 再写入最终候选门禁。 | 等用户确认 R10.20 后再推进。 |

### 6. 对 03 的影响预判

| 收口判断 | 是否影响 03 | 处理 |
|---|---|---|
| Step 10 仅以候选表和审计门禁收口,不新增实现契约 | 否 | R10.20 可写入。 |
| Step 11 handoff 只作为下一步输入,不定义新 DTO / port / persistence | 否 | R10.20 可写入。 |
| 若用户要求把 change audit / rollback snapshot / approval workflow 作为正式对象 | 是 | 暂停并回 `03` / 架构 owning Step。 |
| 若用户要求 P0 支持 runtime hot reload / config center / admin override | 是且越界 | 删除候选或回架构重开设计。 |

### 7. R10.20 写入计划

| R10.20 拟写内容 | 写入边界 |
|---|---|
| Step 10 closure candidate table | 写 SOP 产出、收口条件、候选结论和是否可进入 Step 11。 |
| unresolved blocker table | 写 no current blocker、conditional blockers、if-triggered handling。 |
| Step 11 input baseline table | 写 Step 5 / 7 / 8 / 9 / 10 对 Step 11 的输入。 |
| Step 11 forbidden inheritance table | 写不得继承 hot reload、config center、admin override、truth/report/replay rewrite、raw secret/body。 |
| 03 impact table | 写当前无回写、条件式回写和越界项。 |
| Step 10 completion gate | 写等待用户确认后进入 Step 11 R11.1,不得自动写 Step 11。 |

### 8. R10.19 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做收口判断思考 | pass | 未直接标记 Step 10 completed。 |
| 是否覆盖 SOP 产出完整性 | pass | 配置变更表、审计与回滚规则、停审记录、跨变更审计 / 回滚审计均已检查。 |
| 是否检查 unresolved blocker | pass | formal schema、workflow、repository、hot reload、Step 11 matrix、旧下游污染均已检查。 |
| 是否保留 Step 11 边界 | pass | 只判断进入条件,未写 Step 11 正文。 |
| 是否保留 03 回写门禁 | pass | formal object / hot reload / config center 等仍保留回写或越界处理。 |
| 是否可进入 R10.20 | pass | 等待用户确认后进入 Step 10 总体收口与进入 Step 11 判断再写入。 |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.20 Step 10 总体收口与进入 Step 11 判断:再写入`;只允许把 R10.19 的 SOP 产出完整性、收口条件、unresolved blocker、Step 11 输入和禁止继承、03 影响预判写成候选记录;不得创建正式 `04-配置设计.md`;不得写 Step 11 正文、测试方案、验收标准、实施计划或代码。

## R10.20 Step 10 总体收口与进入 Step 11 判断:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R11.1 |
| 本模块目标 | 将 R10.19 的 SOP 产出完整性、收口条件、unresolved blocker、Step 11 输入和禁止继承、03 影响预判固化为 Step 10 收口候选记录。 |
| 本模块允许 | 写入 Step 10 closure candidate、unresolved blocker、Step 11 input baseline、Step 11 forbidden inheritance、03 影响判定和 R11.1 入口。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写 Step 11 正文;不进入测试方案、验收标准、实施计划或代码。 |
| 恢复依据 | R10.19 已完成 Step 10 总体收口与进入 Step 11 判断先思考;用户已确认进入 R10.20。 |

### 2. Step 10 closure candidate

| 检查项 | 候选结论 | 依据 | 后续处理 |
|---|---|---|---|
| SOP 问题是否覆盖 | pass_candidate | R10.3~R10.4 回答 Step 10 八问;R10.5~R10.18 展开 actor、review、activation、audit、rollback、停审和跨变更审计。 | 允许作为 Step 15 装配输入。 |
| 配置变更表是否具备 | pass_candidate | R10.5~R10.8 已形成配置族 / 变更类型、发起方、评审、生效、审计、rollback 和 Step 回指候选。 | Step 15 再装配为正式 §10。 |
| 审计与回滚规则是否具备 | pass_candidate | R10.9~R10.12 已形成 safe metadata、redacted digest、validation issue、rollback target、rollback failure 和禁止动作候选。 | Step 11 继续承接 failure behavior。 |
| 停审记录是否具备 | pass_candidate | R10.15~R10.16 已形成权限、评审、生效、审计、rollback、失败处理、敏感性和 03 影响候选。 | 后续不得跳过 high-risk review / safe audit。 |
| 跨变更审计 / 回滚审计是否具备 | pass_candidate | R10.17~R10.18 已形成 high-risk review、safe audit、sensitive non-disclosure、profile isolation、unsupported activation、redline 和 rollback audit 候选。 | 后续 Step 不得反向削弱。 |
| Step 11 handoff 是否具备 | pass_candidate | R10.11~R10.18 已保留 invalid config、dependency unavailable、rollback failed、repeated rejected、partial job failure、sensitive leak attempt。 | 允许进入 Step 11 R11.1。 |
| 正式 `04` 是否可创建 | not_yet | 正式文档只能 Step 15 由 Step 1~14 已确认中间产物装配。 | 继续禁止创建正式 `04-配置设计.md`。 |

### 3. Unresolved blocker table

| Blocker 类别 | 当前状态 | if-triggered handling | 是否阻塞进入 R11.1 |
|---|---|---|---|
| formal schema / port / mapper 缺口 | no_current_blocker | 若后续审计 / rollback 需要正式对象、port、mapper、repository 或 evidence schema,回 `03` / owning design source。 | 否 |
| approval workflow / audit repository | no_current_blocker | 当前只要求 product-neutral refs;若要求具体 workflow / repository,回架构或 `03`。 | 否 |
| rollback snapshot repository | no_current_blocker | 当前只用 previous approved digest、new run、rerun、no activation;若要求 snapshot repo,回 `03`。 | 否 |
| hot reload / config center / admin override | rejected_boundary | 当前 P0 不支持,只作为 critical rejected / future design change。 | 否 |
| Step 11 failure matrix 缺失 | handoff_expected | Step 11 正是用于闭合失效模式与降级 / fail-fast,不是 Step 10 blocker。 | 否 |
| old 05/06/07 reverse source | controlled | 旧下游只能作方向输入,不得反向定义配置项或验收门禁。 | 否 |
| formal `04` premature assembly | blocked_until_step15 | 只能 Step 15 装配正式配置设计。 | 否 |

### 4. Step 11 input baseline

| 输入来源 | Step 11 可接收内容 | Step 11 不得接收 |
|---|---|---|
| Step 5 来源优先级 | defaults/file/env/entry-local/test/run-local 等来源优先级、冲突处理和高优先级非法值处理。 | 不得重写来源优先级或允许 silent fallback。 |
| Step 7 配置项清单 | 配置项、作用域、必填性、敏感级别、加载时机、failure hint。 | 不得新增未确认配置项。 |
| Step 8 敏感配置 | opaque refs、redacted digest、禁输、profile 限制和敏感变更附加审计。 | 不得输出 raw secret、full sensitive ref、external body。 |
| Step 9 加载 / 校验 / 生效 | startup restart、job-run-start new run、entry-local rerun、test harness rerun、unsupported reload/hot。 | 不得把 hot reload / config center 写成 P0 success path。 |
| Step 10 变更 / 审计 / rollback | actor/review/activation/audit/rollback、cross-change audit、rollback audit 和 handoff。 | 不得反向削弱 high-risk review、safe audit 或 rollback boundary。 |
| `03-详细设计.md` | runtime builder、adapter availability、body-free、stored report/replay、marker source、query no-write 等红线。 | 不得通过配置改变 truth owner、state transition、transaction boundary 或 marker source。 |

### 5. Step 11 forbidden inheritance

| 禁止继承项 | 禁止原因 | Step 11 处理方向 |
|---|---|---|
| runtime hot reload / live mutation | Step 9 / Step 10 已明确 unsupported,无 P0 rollback contract。 | invalid / unsupported config must reject or fail-fast。 |
| remote config center / admin override | 当前架构和 `03` 未定义正式契约。 | future design change only。 |
| truth / report / replay rewrite | 配置不得改写 truth、stored report、stored replay result。 | failure must surface safely,not repair truth。 |
| raw secret / raw body / full sensitive ref output | 安全红线。 | errors、logs、reports、evidence only safe refs / digests。 |
| fake fallback in production-like | 违反 profile isolation。 | dependency unavailable must fail-fast/degraded by role,not fake fallback。 |
| last-known-good online switch | 当前只支持 previous validated restart/new run/rerun,不支持 live switch。 | rollback failed and recovery to be modeled explicitly。 |

### 6. 对 03 的影响判定

| 收口结论 | 是否影响 03 | 影响类型 | 处理状态 |
|---|---|---|---|
| Step 10 以候选表和审计门禁收口,不新增实现契约 | 否 | none | 无回写。 |
| Step 11 handoff 作为下一步输入,不定义新 DTO / port / persistence | 否 | none | 无回写。 |
| 继续禁止 hot reload、config center、admin override、truth/report/replay rewrite | 否 | none | 承接既有红线。 |
| 若后续要求 change audit / rollback snapshot / approval workflow 正式对象 | 是 | domain / application / persistence | 回 `03` / 架构 owning Step。 |
| 若后续要求 runtime hot reload、online last-known-good 或 config center | 是且越界 | architecture / runtime | 当前 P0 不接收。 |

### 7. R11.1 入口

| 下一模块 | 允许范围 | 禁止范围 |
|---|---|---|
| `R11.1 开工与必读文档:先思考` | 读取 Step 11 SOP、书写规范、Step 5 / 7 / 8 / 9 / 10 中间产物和正式 `03`;思考失效模式与降级 / fail-fast 的开工边界、输入基线、输出门禁、watch / redline 和 03 影响。 | 不创建正式 `04-配置设计.md`;不跳过 Step 11 开工;不一次性写 Step 11 全量内容;不进入测试方案、验收标准、实施计划或代码。 |

### 8. R10.20 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只固化 R10.19 收口候选 | pass | 未写 Step 11 正文。 |
| 是否完成 Step 10 SOP 产出闭合 | pass | 配置变更表、审计与回滚规则、停审记录、跨变更审计 / 回滚审计均具备候选。 |
| 是否存在当前 unresolved blocker | pass | 未发现必须立即回 `03` 才能进入 Step 11 的实际 blocker。 |
| 是否明确 Step 11 输入与禁止继承 | pass | Step 11 input baseline 与 forbidden inheritance 均已写入。 |
| 是否保留正式 `04` 装配边界 | pass | 正式文档仍延后到 Step 15。 |
| 是否可进入 R11.1 | pass | 等待用户确认后进入 Step 11 开工与必读文档先思考。 |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.1 开工与必读文档:先思考`;只允许读取 Step 11 SOP、书写规范、Step 5 / 7 / 8 / 9 / 10 中间产物和正式 `03`,并思考失效模式与降级 / fail-fast 的开工边界、输入基线、输出门禁、watch / redline 和 03 影响;不得创建正式 `04-配置设计.md`;不得一次性写 Step 11 全量内容、测试方案、验收标准、实施计划或代码。
