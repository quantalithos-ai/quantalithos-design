# Step 9. 定义配置加载、校验与生效机制

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 9
> 书写规范: `standards/document/配置设计书写规范.md` §5.9
> 回填章节: `04-配置设计.md` §9 配置加载、校验与生效机制
> 创建日期: 2026-06-25
> 当前状态: `R9.4 开工与必读文档:再写入` completed_wait_user_confirm_to_R10.1
> 当前门禁: 等待确认进入 Step 10 `R10.1 开工与必读文档:先思考`

---

## 0. Step 9 边界

Step 9 在 Step 7 配置项清单和 Step 8 敏感配置基础上,只讨论配置如何被加载、如何被严格解析、如何做类型 / 范围 / 交叉字段校验、如何装配为 validated runtime config,以及校验失败后如何 fail-fast。

当前 Step 只允许讨论:

- 配置在什么时机加载。
- 普通来源如何按 Step 5 规则合并。
- JSON 如何 parse、type validate、range validate 和 cross-field validate。
- 哪些配置组需要交叉字段校验。
- 如何从 parsed config 组装 runtime config、store registry、adapter registry、boundary params 和 runner params。
- 校验失败后如何处理,是否允许 fallback。
- 每个配置域加载校验完成后是否停审。

本 Step 不定义:

- 具体 Rust loader / validator / builder 函数签名。
- 真实 secret provider API、产品级 DB / bus / external GRC schema。
- hot reload 或 runtime reload contract。P0 中 `reload` / `hot` 一律 unsupported,配置变化通过 restart 或 new job run 生效。
- 配置变更审批、审计和回滚流程,这些由 Step 10 定义。
- 失效模式矩阵和告警切口,这些由 Step 11 定义。

---

## R9.1 开工与必读文档:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R9.2 |
| 本模块目标 | 思考 Step 9 的开工边界、必读文档、Step 7 / Step 8 / Step 9 交界、L1-governance 框架参考、watch / redline 和 R9.2 写入计划。 |
| 本模块允许 | 只记录输入基线、必读文档、加载 / 校验 / 生效讨论框架、表格列约束、watch / redline、03 影响判定和 R9.2 写入计划。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写最终加载流程、最终校验流程、最终装配流程、具体 Rust loader / validator / builder 代码、测试用例、验收门禁、实施计划或代码。 |
| 恢复依据 | Step 8 已完成并推进为 `R8.4 completed_wait_user_confirm_to_R9.1`;用户已确认进入 Step 9 R9.1。 |

### 2. Step 9 开工边界思考

| 边界项 | R9.1 裁决 |
|---|---|
| Step 9 定位 | 从 Step 7 / Step 8 已收口的配置项与敏感配置,进入加载、解析、校验、装配和生效边界,不能把这些机制散落在实施计划里。 |
| 直接输入 | Step 7 配置项清单、Step 8 敏感配置、Step 5 来源优先级、Step 6 profile 矩阵、Step 14 runtime builder 绑定顺序、SOP Step 9、书写规范 §5.9。 |
| 输出粒度 | 后续应先写加载时机、校验层次、装配目标、失败策略和停审记录,再进入 Step 10 变更审计。 |
| 加载边界 | 只纳入 startup / job-run-start / entry-local / test harness 的正式加载入口,不得把 hot / reload 当作 P0 正式能力。 |
| 校验边界 | 只纳入 parse / type / range / cross-field / sensitive / forbidden body 校验,不能把校验逻辑藏到业务函数里。 |
| 生效边界 | 只纳入 runtime builder 和 frozen run-local params,不能让 job input 或 entry-local 覆盖 startup invariant。 |
| 对 03 的影响 | 若 Step 9 需要新增 loader / validator / builder / error / DTO / trait / port / flow,必须回 `03-详细设计.md` 或暂停。 |

### 3. 必读文档思考

| 必读文档 | 读取用途 | R9.2 用法 |
|---|---|---|
| `project_execution_ledger.md` | 确认当前允许进入 Step 9 R9.1。 | 写入 Step 9 当前恢复依据。 |
| `04_config_calibration_flow.md` | 确认 Step 9 主题、状态表和执行纪律。 | 同步 Step 9 当前状态和 next_allowed_action。 |
| `04_config_step_07_config_items.md` | 承接 Step 7 的配置项、默认值、来源、敏感级别和失败策略。 | 识别哪些配置项需要加载时机和校验规则。 |
| `04_config_step_08_sensitive_secrets.md` | 承接 Step 8 的 opaque ref、raw secret 禁入和 restart / new job run 口径。 | 识别敏感配置在加载链中的校验与禁输边界。 |
| `04_config_step_05_sources_priority_conflicts.md` | 承接 ordinary source chain、secret ref、entry-local、fixture、watch_only 和来源冲突。 | 判定 source merge / fallback / fail-fast 口径。 |
| `04_config_step_06_environment_profiles_matrix.md` | 承接 local-dev / ci-test / integration-like / operations-replay 的 profile 差异。 | 判定不同 profile 的加载时机和可用能力。 |
| `03_ddd_step_14_config_dependencies.md` | 承接 runtime builder / config binding / external dependency 的正式输入顺序。 | 约束 loader -> validator -> builder 的装配顺序。 |
| `03_ddd_step_12_errors_recovery.md` | 承接 invalid config、adapter unavailable、degraded / rejected marker 的错误方向。 | 约束校验失败后输出何种 issue / marker。 |
| `配置设计讨论流程_SOP.md` Step 9 | 固定本步目标、输入、输出和问题清单。 | R9.2 起把开工思考写成可恢复记录。 |
| `配置设计书写规范.md` §5.9 | 固定加载 / 校验 / 生效章节的图表和表格门禁。 | 作为后续 Step 9 的格式门禁。 |
| `设计文档讨论中间产物规范.md` | 固定中间产物和台账同步纪律。 | 约束 R9.1 -> R9.2。 |
| `设计真相源闭环与可落码性标准.md` | 固定缺 schema / port / mapper / config / evidence 时必须暂停。 | 作为 03 影响和 blocker 判定依据。 |
| `00-需求文档.md` / `01-架构设计.md` / `02-概要设计.md` / `03-详细设计.md` | 提供上游边界、依赖方向、配置影响轮廓和 runtime binding 输入。 | 只承接,不反向定义 loader contract。 |
| L1-governance Step 9 | 提供加载 / 校验 / 装配章节框架深度。 | 只参考结构,不复制治理仓事实。 |

### 4. Step 7 -> Step 8 -> Step 9 输入基线思考

| 输入来源 | Step 9 接收方式 | 不得接收 |
|---|---|---|
| Step 7 配置项清单 | 接收字段类型、默认值、来源、作用域、敏感级别和失败策略作为加载 / 校验对象。 | 不把配置项直接变成代码参数或 loader 私有规则。 |
| Step 8 敏感配置 | 接收 opaque ref、raw secret 禁入和 restart / new job run 口径。 | 不把 raw secret material 送入运行时解析。 |
| Step 5 来源优先级 | 接收 defaults < file < env < entry-local / job input 的普通来源链。 | 不把 config center / admin override 写成 P0 source truth。 |
| Step 6 profile 矩阵 | 接收 local-dev / ci-test / integration-like / operations-replay 的 profile 差异。 | 不把 staging-like / production-like 细节在 P0 中闭口成事实。 |
| Step 14 runtime builder | 接收 loader -> validator -> builder -> facade 的正式装配顺序。 | 不自行改造 builder 责任边界。 |
| Step 12 error recovery | 接收 invalid config、adapter unavailable、degraded / rejected marker 方向。 | 不把校验失败吞成 fallback success。 |

### 5. SOP Step 9 产出与问题框架思考

| SOP 产出 | R9 后续处理方式 |
|---|---|
| 配置加载流程图 | 先说明加载时机、合并顺序、解析顺序和装配链,再进入校验细节。 |
| 配置加载校验表 | 逐配置组列出加载时机、校验方式、生效方式和失败策略。 |
| 按配置域组织的加载 / 校验 / 生效表 | 按 runtime / stores / resolvers / consumers / jobs / handoff / projection / reference / test 等域拆分。 |
| Cross-field validation matrix | 列出 profile、topic、retention、batch、target、secret、fixture 等交叉校验规则。 |
| 生效方式矩阵 | 明确 startup / job-run-start / entry-local / test harness / unsupported reload / hot。 |
| Runtime builder assemble target table | 说明 validated config 如何进入 `GovernanceRuntimeConfig`、registry、params 和 facade。 |
| Config validation issue surface | 说明 parse / type / range / cross-field / forbidden secret / unsupported reload 的 issue 形态。 |
| 加载校验停审记录 | 每个配置域完成后停审,确认无未校验必填项和无回写缺口。 |
| 跨加载校验审计表 | 审计 reload/hot、fallback、raw secret、半装配暴露和 runtime builder 回写缺口。 |

### 6. Watch / redline 带入思考

| 项 | 当前状态 | Step 9 处理 |
|---|---|---|
| config center | watch_only | 不进入 P0 加载链;若未来要正式化,必须回 `03` / 架构。 |
| admin override | watch_only | 不写 live override / operator override / rollback contract。 |
| hot runtime update | redline | P0 一律不支持,出现即 reject。 |
| reload contract | redline | 仅作为未来版本方向,不得在本轮留半实现。 |
| raw secret / raw body | redline | 不得在 parse / validate / report / issue 中出现。 |
| job input 覆盖 startup invariant | redline | 只允许 run-local frozen params,不得越过 startup validation。 |
| runtime builder 半装配暴露 facade | redline | 只能在 Ready 后暴露 facade。 |

### 7. 对 03 的影响判定框架

| Step 9 结论类型 | 是否影响 03 | 处理规则 |
|---|---|---|
| 只定义加载时机、严格 JSON、类型 / 范围 / 交叉字段校验和 fail-fast | 否 | 留在 04,后续写入正式加载章节。 |
| 只定义 startup / job-run-start / entry-local / test harness / unsupported reload | 否 | 承接 Step 4 / Step 6 / Step 7 / Step 8,无回写。 |
| 只定义 runtime config、registry、boundary params 和 runner params 的装配顺序 | 否 | 承接 `03` runtime builder 既有输入。 |
| 需要新增 loader / validator / builder 函数签名、DTO、error enum、trait / port 或 flow | 是 | 暂停并回 `03` owning Step。 |
| 需要新增 secret provider / config center / admin override / hot reload contract | 是 | 暂停并回 `03` / 架构。 |
| 让 job input 或 entry-local 改变 startup invariant / truth owner / state transition / query no-write / job no-truth-repair / body-free / stored replay / transaction boundary / marker source / public schema / P0-P1 隔离 | 是且越界 | 立即拒绝,不得在 04 内补口。 |

### 8. R9.2 写入计划

| R9.2 拟写内容 | 写入边界 |
|---|---|
| Step 9 开工记录 | 把 R9.1 思考固化为开工记录、输入基线和必读文档记录。 |
| SOP / 规范输出门禁 | 写明加载流程图、加载校验表、按配置域组织的加载 / 校验 / 生效表的后续产物要求。 |
| Step 7~8 承接记录 | 写清配置项、敏感配置和来源优先级如何进入加载链。 |
| watch / redline 记录 | 固定 config center、admin override、hot / reload、raw secret、job input override 和半装配 facade 禁区。 |
| 03 影响判定记录 | 写清何时无回写、何时必须暂停回 `03`。 |
| R9.3 入口 | 只推进到 SOP 问题回答与加载机制候选:先思考,不提前写最终加载流程。 |

### 9. R9.1 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只写开工与必读文档思考 | pass | 未写最终加载流程、校验实现或装配代码。 |
| 是否承接 Step 7 / Step 8 / Step 5 / Step 6 / Step 14 | pass | 已记录输入基线与来源约束。 |
| 是否保留 watch / redline | pass | config center / admin override / hot / reload / raw secret / half-assembled facade 均已记录。 |
| 是否保留 03 回写门禁 | pass | 新增 loader / validator / builder / error / DTO / port / flow 仍需回 `03`。 |
| 是否可进入 R9.2 | pass | 等待用户确认后进入 `R9.2 开工与必读文档:再写入`。 |

next_allowed_action: 等待用户确认后进入 Step 9 `R9.2 开工与必读文档:再写入`;只允许把 R9.1 思考固化为开工记录、输入基线、必读文档、SOP 输出门禁、watch / redline、03 影响判定和 R9.3 入口;不得创建正式 `04-配置设计.md`;不得写最终加载流程、最终校验流程、最终装配流程、runtime builder 代码、测试方案、验收标准、实施计划或代码。

## R9.2 开工与必读文档:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R9.3 |
| 本模块目标 | 将 R9.1 的开工思考固化为 Step 9 的执行入口、必读文档清单、输入基线、产出门禁、watch / redline、03 影响判定和 R9.3 入口。 |
| 本模块允许 | 写入开工记录、必读文档记录、Step 7~8 承接、SOP / 规范输出门禁、watch / redline、03 影响判定和下一模块门禁。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写最终加载流程、最终校验流程、最终装配流程、runtime builder 代码、测试用例、验收门禁、实施计划或代码。 |
| 恢复依据 | R9.1 已完成开工与必读文档思考,用户已确认继续进入 R9.2。 |

### 2. Step 9 开工记录

| 开工项 | R9.2 记录 |
|---|---|
| 当前 Step | Step 9 定义配置加载、校验与生效机制。 |
| 当前目标 | 把 Step 7 / Step 8 已收口的配置项与敏感配置,转成可执行的加载、解析、校验、装配和生效机制。 |
| 执行方式 | 继续按“先思考 -> 再写入”逐模块推进;每次用户确认只推进一个当前模块。 |
| 首要输入 | Step 7 配置项清单、Step 8 敏感配置、Step 5 来源优先级、Step 6 profile 矩阵、Step 14 runtime builder 绑定顺序和正式 `03` 配置绑定。 |
| 首要产出 | 后续生成配置加载流程图、配置加载校验表、按配置域组织的加载 / 校验 / 生效表、Cross-field validation matrix、Runtime builder assemble target table、Config validation issue surface、停审记录和跨加载校验审计表。 |
| 当前不做 | 不在 R9.2 写最终加载流程,不写校验实现,不写装配代码,不写测试 / 验收 / 实施计划正文。 |

### 3. 必读文档记录

| 必读文档 | Step 9 用途 | 读取结论 |
|---|---|---|
| `project_execution_ledger.md` | 确认当前恢复点和用户确认门禁。 | 当前允许从 R9.1 进入 R9.2。 |
| `04_config_calibration_flow.md` | 确认 Step 9 主题、状态表和执行纪律。 | Step 9 为当前 in-progress Step,正式 `04` 仍不得创建。 |
| `04_config_step_07_config_items.md` | 提供字段级配置项、类型、默认值、来源、作用域和失败策略。 | 作为加载 / 校验对象来源。 |
| `04_config_step_08_sensitive_secrets.md` | 提供 opaque ref、raw secret 禁入和 restart / new job run 口径。 | 作为敏感配置校验对象来源。 |
| `04_config_step_05_sources_priority_conflicts.md` | 提供 ordinary source chain、冲突处理和 fail-fast 规则。 | 作为 source merge 依据。 |
| `04_config_step_06_environment_profiles_matrix.md` | 提供 local-dev / ci-test / integration-like / operations-replay 的 profile 差异。 | 作为加载时机和生效方式依据。 |
| `03_ddd_step_14_config_dependencies.md` | 提供 runtime builder / config binding 的正式输入顺序。 | 作为 loader -> validator -> builder 装配依据。 |
| `03_ddd_step_12_errors_recovery.md` | 提供 invalid config、adapter unavailable、degraded / rejected marker 的错误方向。 | 作为校验失败和 issue surface 依据。 |
| `配置设计讨论流程_SOP.md` Step 9 | 固定本步目标、输入、输出和问题清单。 | R9.3 起按问题形成加载机制候选。 |
| `配置设计书写规范.md` §5.9 | 固定加载 / 校验 / 生效章节的图表和表格门禁。 | 作为后续 Step 9 的格式门禁。 |
| `设计文档讨论中间产物规范.md` | 固定中间产物和台账同步纪律。 | 约束 R9.2 -> R9.3。 |
| `设计真相源闭环与可落码性标准.md` | 固定缺 schema / port / mapper / config / evidence 时必须暂停。 | 作为 03 影响和 blocker 判定依据。 |
| `00-需求文档.md` / `01-架构设计.md` / `02-概要设计.md` / `03-详细设计.md` | 提供上游边界、依赖方向、配置影响轮廓和 runtime binding 输入。 | 只承接,不反向定义 loader contract。 |
| L1-governance Step 9 | 提供加载 / 校验 / 装配章节框架深度。 | 只参考结构,不复制治理仓事实。 |

### 4. Step 7 -> Step 8 -> Step 9 输入基线写入

| 输入来源 | Step 9 接收方式 | 不得接收 |
|---|---|---|
| Step 7 配置项清单 | 接收字段类型、默认值、来源、作用域、敏感级别和失败策略作为加载 / 校验对象。 | 不把配置项直接变成代码参数或 loader 私有规则。 |
| Step 8 敏感配置 | 接收 opaque ref、raw secret 禁入和 restart / new job run 口径。 | 不把 raw secret material 送入运行时解析。 |
| Step 5 来源优先级 | 接收 defaults < file < env < entry-local / job input 的普通来源链。 | 不把 config center / admin override 写成 P0 source truth。 |
| Step 6 profile 矩阵 | 接收 local-dev / ci-test / integration-like / operations-replay 的 profile 差异。 | 不把 staging-like / production-like 细节在 P0 中闭口成事实。 |
| Step 14 runtime builder | 接收 loader -> validator -> builder -> facade 的正式装配顺序。 | 不自行改造 builder 责任边界。 |
| Step 12 error recovery | 接收 invalid config、adapter unavailable、degraded / rejected marker 方向。 | 不把校验失败吞成 fallback success。 |

### 5. SOP Step 9 输出门禁写入

| 输出物 | 写入要求 |
|---|---|
| 配置加载流程图 | 必须说明加载时机、合并顺序、解析顺序和装配链。 |
| 配置加载校验表 | 必须逐配置组列出加载时机、校验方式、生效方式和失败策略。 |
| 按配置域组织的加载 / 校验 / 生效表 | 必须按 runtime / stores / resolvers / consumers / jobs / handoff / projection / reference / test 等域拆分。 |
| Cross-field validation matrix | 必须列出 profile、topic、retention、batch、target、secret、fixture 等交叉校验规则。 |
| 生效方式矩阵 | 必须明确 startup / job-run-start / entry-local / test harness / unsupported reload / hot。 |
| Runtime builder assemble target table | 必须说明 validated config 如何进入 `GovernanceRuntimeConfig`、registry、params 和 facade。 |
| Config validation issue surface | 必须说明 parse / type / range / cross-field / forbidden secret / unsupported reload 的 issue 形态。 |
| 加载校验停审记录 | 每个配置域完成后必须停审,确认无未校验必填项和无回写缺口。 |
| 跨加载校验审计表 | 必须审计 reload/hot、fallback、raw secret、半装配暴露和 runtime builder 回写缺口。 |

### 6. Watch / redline 写入

| 项 | 当前状态 | Step 9 处理 |
|---|---|---|
| config center | watch_only | 不进入 P0 加载链;若未来要正式化,必须回 `03` / 架构。 |
| admin override | watch_only | 不写 live override / operator override / rollback contract。 |
| hot runtime update | redline | P0 一律不支持,出现即 reject。 |
| reload contract | redline | 仅作为未来版本方向,不得在本轮留半实现。 |
| raw secret / raw body | redline | 不得在 parse / validate / report / issue 中出现。 |
| job input 覆盖 startup invariant | redline | 只允许 run-local frozen params,不得越过 startup validation。 |
| runtime builder 半装配暴露 facade | redline | 只能在 Ready 后暴露 facade。 |

### 7. 对 03 的影响判定写入

| Step 9 结论类型 | 是否影响 03 | 处理规则 |
|---|---|---|
| 只定义加载时机、严格 JSON、类型 / 范围 / 交叉字段校验和 fail-fast | 否 | 留在 04,后续写入正式加载章节。 |
| 只定义 startup / job-run-start / entry-local / test harness / unsupported reload | 否 | 承接 Step 4 / Step 6 / Step 7 / Step 8,无回写。 |
| 只定义 runtime config、registry、boundary params 和 runner params 的装配顺序 | 否 | 承接 `03` runtime builder 既有输入。 |
| 需要新增 loader / validator / builder 函数签名、DTO、error enum、trait / port 或 flow | 是 | 暂停并回 `03` owning Step。 |
| 需要新增 secret provider / config center / admin override / hot reload contract | 是 | 暂停并回 `03` / 架构。 |
| 让 job input 或 entry-local 改变 startup invariant / truth owner / state transition / query no-write / job no-truth-repair / body-free / stored replay / transaction boundary / marker source / public schema / P0-P1 隔离 | 是且越界 | 立即拒绝,不得在 04 内补口。 |

### 8. R9.3 入口写入

| 下一模块 | 入口说明 |
|---|---|
| `R9.3 SOP 问题回答与加载机制候选:先思考` | 只允许围绕 Step 9 问题框架逐项回答加载时机、解析顺序、校验层次、装配目标、失败策略和停审记录,不提前写最终加载流程。 |
| 当前不进入 | 任何 loader / validator / builder 函数签名、DTO、error enum、trait / port、实际运行代码。 |
| 回到 03 条件 | 若 R9.3 需要新增 loader / validator / builder contract、error enum、DTO、trait / port 或 flow,必须暂停并回 `03`。 |

### 9. R9.2 停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只写开工与必读文档记录 | pass | 未写最终加载流程、校验实现或装配代码。 |
| 是否承接 Step 7 / Step 8 / Step 5 / Step 6 / Step 14 | pass | 已固化输入基线与来源约束。 |
| 是否保留 watch / redline | pass | config center / admin override / hot / reload / raw secret / half-assembled facade 均已记录。 |
| 是否保留 03 回写门禁 | pass | 新增 loader / validator / builder / error / DTO / port / flow 仍需回 `03`。 |
| 是否可进入 R9.3 | pass | 等待用户确认后进入 `R9.3 SOP 问题回答与加载机制候选:先思考`。 |

next_allowed_action: 等待用户确认后进入 Step 9 `R9.4 开工与必读文档:再写入`;只允许把 R9.3 候选结论固化为加载流程图、配置加载校验表、按配置域组织的加载 / 校验 / 生效表、Cross-field validation matrix、Runtime builder assemble target table、Config validation issue surface、停审记录和跨加载校验审计表;不得创建正式 `04-配置设计.md`;不得写最终加载流程、最终校验流程、最终装配流程、runtime builder 代码、测试方案、验收标准、实施计划或代码。

## R9.4 开工与必读文档:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.1 |
| 本模块目标 | 将 R9.3 的候选结论固化为正式中间产物,完成 Step 9 的加载 / 校验 / 生效收口。 |
| 本模块允许 | 写入配置加载流程图、配置加载校验表、按配置域组织的加载 / 校验 / 生效表、Cross-field validation matrix、Runtime builder assemble target table、Config validation issue surface、详细设计影响判定、停审记录和跨加载校验审计表。 |
| 本模块禁止 | 不创建正式 `04-配置设计.md`;不写 loader / validator / builder 函数签名、DTO、error enum、trait / port 或实际运行代码。 |
| 恢复依据 | R9.3 已完成问题回答与候选冻结,当前进入 R9.4 再写入。 |

### 2. 配置加载流程图

```text
[code defaults]
  -> [strict JSON config file]
  -> [environment variable overrides]
  -> [entry-local selector / job-run-start input where allowed]
  -> [source merge with conflict detection]
  -> [strict JSON parse]
  -> [type / enum / range / ref-shape validation]
  -> [cross-field validation]
  -> [sensitive / forbidden body validation]
  -> [assemble validated config refs]
  -> [runtime config / registry / frozen params]
  -> [builder Ready]
  -> [facade exposure]
```

关键说明:

- `entry-local selector / job-run-start input` 只影响当前入口或当前 run,不是全局覆盖层。
- `strict JSON parse` 不接受 JSONC 注释;JSONC 仅能出现在文档示例。
- `type / enum / range / ref-shape validation` 只校验普通 config 和 refs,不解析 raw secret material。
- `cross-field validation` 必须在 runtime builder 暴露 facade 前完成。
- builder `Ready` 前不得暴露 API / worker / jobs facade。
- P0 不支持 reload / hot path;配置变化通过 restart 或 new job run 生效。

### 3. 配置加载校验表

| 配置项 / 配置组 | 加载时机 | 校验方式 | 生效方式 | 失败策略 |
|---|---|---|---|---|
| `runtime.*` | startup;profile selector 可 entry-local | JSON object、enum、bool、known profile、strictValidation | startup 冻结;selector 只影响当前 entry | invalid fail-fast / entry rejected |
| `stores.*` | startup | required groups、known kind、ref shape、logical store completeness | runtime builder store registry | required missing fail-fast |
| `externalResolvers.*` | startup;test fixture before fake runtime | list parse、unique families、known family/mode/disposition、ref shape | adapter registry + resolver port injection | missing family / invalid mode fail-fast |
| `inboundConsumers.*` | startup | bool、namespace list、version enum、dedup retention range | worker consumer registry | invalid fail-fast;unsupported event rejected at runtime |
| `outbox.*` | startup;batch may job-run-start | publisher ref shape、mode/profile compatibility、topic map coverage、batch/range | publisher adapter + publish runner params | missing enabled topic fail-fast;job batch invalid rejected |
| `jobs.*` | startup;batch/timeout may job-run-start | enabled kind enum、positive integer、retention cross-field、parallelism/profile compatibility | jobs registry + frozen job params | startup fail-fast or job rejected |
| `handoff.*` | startup;target may job-run-start | target ref shape、retry ref shape、feature/topic cross-field | adapter registry target set;frozen job target | missing enabled target fail-fast/reject job |
| `externalGrc.*` | startup;target may job-run-start | enabled bool、adapter/target conditional required、batch range | export adapter registration when enabled | enabled missing adapter/target fail-fast/reject job |
| `redaction.*` | startup | deny list non-empty、field refs shape、high-cardinality false in P0 | validator/logging/diagnostic hooks | unsafe config fail-fast |
| `boundary.*` | startup | positive ints / duration seconds / page max | API/query/job guard params | invalid fail-fast |
| `idempotency.*` | startup | integer seconds、retention cross-field、positive age | idempotency/result store cleanup params | invalid fail-fast |
| `projection.*` / `reference.*` | startup;batch may job-run-start | stale threshold positive、batch positive、feature/topic cross-field | query degraded params + rebuild/refresh defaults | invalid fail-fast / job rejected |
| `clockId.*` | startup;fixture before fake runtime | ref shape、profile compatibility | ClockPort / IdGeneratorPort injection | missing fail-fast |
| `testFixtures.*` | test harness / operations-replay job start | fixture ref shape、timestamp parse、de-identified replay root required by profile | fake runtime seed or replay job frozen input | test fail-fast / replay job rejected |

### 4. 按配置域组织的加载 / 校验 / 生效表

| 配置域 | 代表配置组 | parse | type validate | cross-field validate | assemble target | 失败策略 |
|---|---|---|---|---|---|---|
| runtime | `runtime.*` | parse top-level object | profile string、bool、adapter mode enum | profile must allow adapter mode;strictValidation true;no hot/reload flags | `GovernanceRuntimeConfig`、`GovernanceRuntimeBuilderState` | startup fail-fast |
| logical stores | `stores.*` | parse nested store objects | kind enum、configRef string refs | all logical stores present;durable refs not in local/CI unless allowed | store registry and repository adapters | startup fail-fast |
| external resolvers | `externalResolvers.*` | parse list | family / mode / disposition enums、adapter ref | required family coverage;unique family;mode/profile compatibility | resolver adapter states | startup fail-fast |
| inbound consumers | `inboundConsumers.*` | parse object / list | bool、version string、duration seconds | enabled requires namespaces;version must be supported | worker consumer registry | startup fail-fast / runtime reject |
| outbox / topic | `outbox.*` | parse object / map | adapter ref、mode、batch int、retry ref | publisher mode/profile compatibility;enabled event keys complete | publisher adapter and topic route map | startup fail-fast / job rejected |
| jobs | `jobs.*` | parse list / object | job kind enum、integers、retry ref | enabled kinds closed;retention and parallelism valid for profile | job runner registry and params | startup fail-fast / job rejected |
| handoff / externalGrc | `handoff.*`,`externalGrc.*` | parse target refs / flags | target ref、retry ref、bool | enabled target requires adapter/target;disabled skips export | handoff/export adapter registry | startup fail-fast / job rejected |
| redaction / diagnostics | `redaction.*` | parse lists / bools | deny list refs、prefix、安全 bool | deny list non-empty;P0 high-cardinality false | redaction checker / diagnostic refs | startup fail-fast |
| boundary / retention | `boundary.*`,`idempotency.*` | parse values | positive ints、duration seconds | page / batch / retention / replay windows compatible | API/query/job guard params | startup fail-fast |
| projection / reference | `projection.*`,`reference.*` | parse numeric settings | stale threshold、batch size | feature/topic cross-field valid | query defaults and maintenance job params | startup fail-fast / job rejected |
| clock / fixtures | `clockId.*`,`testFixtures.*` | parse refs | ref shape、timestamp | deterministic only for allowed profiles;replay root de-identified | ClockPort / IdGeneratorPort / fake runtime seed | startup fail-fast / replay reject |

### 5. Cross-field validation matrix

| Cross-field rule | Inputs | Validation | Failure |
|---|---|---|---|
| profile vs adapter mode | `runtime.profile`,`runtime.adapterMode` | `production-like` rejects fake/test;`integration-like` may use controlled | startup fail-fast |
| logical store completeness | `stores.truth/projection/reference/outbox/idempotency` | all required store refs present and valid | startup fail-fast |
| resolver family coverage | `externalResolvers.families[]` | required P0 families present exactly once | startup fail-fast |
| consumer enabled requires namespaces | `inboundConsumers.enabled`,`namespaces[]` | enabled => non-empty namespace set and supported version | startup fail-fast |
| topic completeness | `outbox.transportTopicBindings`,`enabled outbound features` | every enabled topic-neutral key has a route ref | startup fail-fast |
| external GRC enablement | `externalGrc.enabled`,`adapterRef`,`targetRef` | enabled => adapterRef+targetRef;disabled => export job disabled | startup fail-fast / job rejected |
| retention consistency | idempotency / job / event / report retention | retention must cover retry / redelivery / replay window | startup fail-fast |
| batch and page limits | `jobs.defaultBatchSize`,`outbox.publishBatchSize`,`projection.rebuildBatchSize`,`reference.refreshBatchSize`,`boundary.maxPageLimit` | batch <= maxPageLimit unless job input explicitly lower | startup fail-fast / job rejected |
| redaction safety | `redaction.denyFieldRefs`,`allowHighCardinalityLabels` | deny list non-empty and P0 high-cardinality false | startup fail-fast |
| replay profile | `runtime.profile`,`testFixtures.replayArtifactRootRef` | operations-replay requires de-identified replay root ref | job rejected |
| no config invariant override | any config source | cannot set truth/state/query/outbox/idempotency invariant flags | config reject |

### 6. 生效方式矩阵

| 生效方式 | 本项目 P0 口径 | 适用配置 | 失败处理 |
|---|---|---|---|
| static design boundary | 不是配置项 | truth ownership、state matrix、query no-write、outbox source、duplicate replay、external GRC no-truth | 出现即 reject |
| startup | runtime builder 前加载并冻结 | runtime、stores、resolver、consumer、outbox/topic、jobs defaults、handoff targets、redaction、boundary、idempotency、projection/reference defaults、clock/id | invalid => builder `Failed` |
| job-run-start | job run 开始时冻结 | job input scope、batch、target、replay root、current run page/cursor where allowed | invalid => job rejected |
| entry-local | 只影响当前入口选择 | profile selector、config source selector、job request source、dry-run selector | invalid => current entry rejected |
| test harness | fake runtime / fixture load 前生效 | fixture set、fixed clock、deterministic id、fake adapter seed | invalid => test fail-fast |
| reload | P0 unsupported | 无 | presence of reload config => reject |
| hot | P0 unsupported | 无 | presence of hot config => reject |
| build-time | 不作为 runtime config | Rust workspace / feature dependency discipline | 由 implementation gate 处理 |

### 7. Runtime builder assemble target table

| Validated config group | Assemble target | Exposed to | Not exposed to |
|---|---|---|---|
| `runtime.*` | `GovernanceRuntimeConfig`、`GovernanceRuntimeBuilderState` | infra runtime builder | domain / public contracts |
| `stores.*` | store registry、repository adapters、UoW manager | application via repository ports | raw store config / product DSN |
| `externalResolvers.*` | resolver adapter states、source resolver ports | application source resolver port | sibling repo body |
| `inboundConsumers.*` | worker consumer registry、dedup params | worker entry / idempotency repo | domain truth object |
| `outbox.*` | publisher adapter、topic route map、outbox job defaults | outbox publisher service / job | event schema mutation |
| `jobs.*` | job runner registry、default runner params | jobs entry / facade | repository direct access |
| `handoff.*` | trace / archive target sets、handoff adapter registry | handoff job service | package body / synthesized refs |
| `externalGrc.*` | optional export adapter、optional export target、job availability | export job service | core command acceptance |
| `redaction.*` | redaction checker、diagnostic ref generator | infra/api/worker/jobs observability hooks | raw matched values |
| `boundary.*` | API/query/page guard params | api/query/jobs entry validators | domain state machine |
| `idempotency.*` | idempotency/result retention params | idempotency/result store | command metadata requirement |
| `projection.*` / `reference.*` | query freshness params、maintenance job defaults | query service/jobs | truth mutation |
| `clockId.*` | separate ClockPort and IdGeneratorPort refs | application services via ports | ad hoc synthesized refs |
| `testFixtures.*` | fake runtime seeds and replay frozen input | tests / operations replay runner | production-like runtime |

### 8. Config validation issue surface

| Issue class | Created by | Carries | Must not carry |
|---|---|---|---|
| `ParseFailed` | strict JSON parser | config source ref、redacted location、issue ref | raw file body |
| `UnknownField` | schema validator | module path、field name、issue ref | sibling body |
| `MissingRequired` | schema validator | module path、field name、issue ref | secret |
| `InvalidType` | type validator | module path、expected type、issue ref | raw sensitive value |
| `InvalidEnum` | type validator | module path、allowed class、issue ref | raw sensitive value |
| `InvalidRange` | range validator | module path、range class、issue ref | raw body |
| `CrossFieldConflict` | cross-field validator | involved module paths、rule ref、issue ref | raw values when sensitive |
| `ForbiddenSecretMaterial` | sensitive validator | module path、forbidden class、issue ref | detected material |
| `ForbiddenInvariantOverride` | static boundary validator | forbidden key class、issue ref | attempted payload |
| `UnsupportedSource` | source loader | source kind、profile、issue ref | source body |
| `UnsupportedReload` | activation validator | requested activation kind、issue ref | raw config |

### 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 严格 JSON,JSONC 仅用于文档示例 | 否 | 配置格式规则 | 不适用 | 无回写 |
| source merge -> parse -> type validate -> cross-field validate -> assemble | 否 | 承接 Step 14 builder 顺序 | 不适用 | 无回写 |
| startup / job-run-start / entry-local / test harness / unsupported reload | 否 | ��接 P0 生效方式 | 不适用 | 无回写 |
| builder Ready 前不得暴露 facade | 否 | 承接 `GovernanceRuntimeBuilderState` | 不适用 | 无回写 |
| config validation issue surface 只输出 redacted issue refs | 否 | 承接 Step 8 / observability | 不适用 | 无回写 |
| 若后续要求 runtime reload、last-known-good config、secret provider resolution、product-specific adapter constructor 或 config center | 是 | runtime config / builder / rollback / adapter constructor / error model contract | `03` §13 / Step 14 / Step 12 error recovery | 阻塞待确认 |

### 10. 加载校验停审记录

| 配置域 / 配置组 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| runtime | parse / type / cross-field / activation / 03 impact | 通过 | reload / hot rejected |
| stores | logical store / ref shape / assembly target | 通过 | durable product schema 留 P1/P2 |
| externalResolvers | family coverage / mode profile compatibility | 通过 | production-like fake rejected |
| inboundConsumers | namespace / version / dedup retention | 通过 | unsupported version runtime rejected / dead-letter |
| outbox / topic | topic completeness / feature topic / publisher mode | 通过 | missing enabled topic fail-fast |
| jobs | enabled kind / retention / batch / parallelism | 通过 | external GRC export tied to externalGrc.enabled |
| handoff / externalGrc | target / adapter conditional required | 通过 | disabled external GRC does not block core truth |
| redaction / boundary | deny list / high-cardinality / page / body / time limits | 通过 | unsafe relax fail-fast |
| idempotency / projection / reference | retention / stale / batch / retry cross-field | 通过 | query / job no truth repair preserved |
| clockId / testFixtures | deterministic / profile compatibility | 通过 | production-like fixture rejected |
| sensitive validation | raw secret / body reject and redacted issue refs | 通过 | no raw material in issue surface |

### 11. 跨加载校验审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 未校验必填项 | 未发现 | Step 7 required fields 已覆盖 |
| 类型校验缺口 | 未发现 | enum / int / bool / ref / list / map / timestamp 已覆盖 |
| cross-field 缺口 | 未发现 | profile / topic / feature / retention / target / redaction / batch 已覆盖 |
| hot / reload 无回滚 | 不适用 | P0 rejects reload / hot config |
| 高优先级非法值 fallback | 无 | fail-fast |
| raw secret / body 进入 issue surface | 不允许 | issue only redacted refs |
| runtime builder 半装配暴露 facade | 不允许 | only Ready exposes facade |
| job input 覆盖 startup invariant | 不允许 | job input only run-local frozen params |
| adapter constructor 新参数未回写 `03` | 当前无 | future product / secret provider requires design change |
| 错误模型缺口 | 当前无 | Step 10~12 will detail变更 / 审计 / 回滚 / 失效模式 |

### 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置加载流程已定义 | pass | 严格 JSON + source merge + parse + type / range + cross-field + assembly |
| 生效方式矩阵已冻结 | pass | startup / job-run-start / entry-local / test harness;reload / hot rejected |
| runtime builder 目标已明确 | pass | validated config 可进入 registry / params / facade |
| config validation issue surface 已定义 | pass | 仅输出 redacted issue refs |
| 停审和跨加载审计已完成 | pass | 无 unresolved 冲突 |
| 对 `03` 的影响判定已记录 | pass | 当前无回写;未来 reload / provider / constructor 需回写 |
| 可进入 Step 10 | pass | 下一步定义配置变更、审计与回滚 |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.1 开工与必读文档:先思考`;只允许思考 Step 10 变更、审计与回滚的开工边界、必读文档、Step 9 / Step 10 交界、L1-governance 框架参考、watch / redline 和 R10.2 写入计划;不得创建正式 `04-配置设计.md`;不得写最终变更流程、最终审计流程、最终回滚流程、审计 / 回滚代码、测试方案、验收标准、实施计划或代码。

