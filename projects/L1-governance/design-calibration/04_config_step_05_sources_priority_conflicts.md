# Step 5. 定义配置来源、优先级与冲突处理

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 5
> 回填章节: `04-配置设计.md` §5 配置来源、优先级与冲突处理

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 5 定义配置来源、优先级与冲突处理 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 3 配置来源链;Step 4 配置分类;详细设计 Step 14 配置引用表 |
| 输出文件 | `projects/L1-governance/design-calibration/04_config_step_05_sources_priority_conflicts.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 6 |

## 2. 本步目标

本 Step 定义配置从哪些来源进入 `L1-governance`,不同来源之间如何覆盖、冲突如何处理、不可用时是否 fail-fast,以及哪些来源不得覆盖敏感配置或禁止配置化边界。

本 Step 只回答:

- code defaults、config file、environment variables、secret refs、test fixtures、entry-local parameters、config center 和 admin override 的优先级。
- 同名配置、重复 key、别名 key、高优先级非法值、必填项缺失如何处理。
- 每个配置域允许哪些来源,禁止哪些来源。
- secret raw value、external body、forbidden boundary 是否可以由普通来源覆盖。
- 来源不可用时是 fallback、fail-fast、reject job 还是 degraded。

本 Step 不定义具体 key 名、JSON schema、环境变量名、默认数值、secret provider API、环境 profile 矩阵、加载函数实现、部署命令或产品选型。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_03_control_plane.md` | 已完成 | 提供来源链预览和配置域 / 功能模块 |
| `04_config_step_04_categories_boundaries.md` | 已完成 | 提供配置类别、更新时机、禁止配置化项和 P0 无 hot update 口径 |
| `03_ddd_step_14_config_external_binding.md` §8~§14 | 已完成 | 提供配置引用表、config section、代码绑定和 runtime builder 顺序 |
| `03-详细设计.md` §13 | 已完成 | 提供配置引用与外部依赖绑定正式入口 |
| `02-概要设计.md` §11 | 已完成 | 提供配置影响轮廓和禁止配置化边界 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| code default、file、env、secret、config center、admin override 的优先级是什么? | P0 普通配置优先级固定为 `code defaults < config file < environment variables`。secret raw material 不进入普通优先级链,普通来源只能提供 secret / credential / endpoint / destination ref。entry-local parameters 不覆盖全局配置,只选择 config source、profile 或当前 job / entry 局部输入。test fixture / deterministic override 只在 local / CI test harness 生效。config center 和 admin override 属 P1/P2,在 P0 中声明启用即 fail-fast unsupported source。 |
| 同名配置多处出现时如何冲突处理? | 不同普通来源同名 key 由高优先级覆盖低优先级。高优先级值只要存在但类型、格式、范围或 cross-field 校验非法,必须 fail-fast,不得回退低优先级。单个 config file 内重复 key 或同一语义使用 alias key 视为歧义,fail-fast。 |
| 必填项缺失时是否阻断启动? | startup runtime 必填项缺失阻断 startup。job-run-start 必填项缺失拒绝 job 并返回 job invalid input / rejected report。entry-local 必填项缺失拒绝当前入口。可选外围 target 缺失时,若对应 feature disabled 则允许;若 feature enabled 则 fail-fast 或 reject job。 |
| 配置中心或密钥系统不可用时如何处理? | P0 不启用 config center。secret provider 的真实解析属于 P1/P2;P0 只校验 ref 形态。若某 profile 声明必须解析真实 secret / credential 但 resolver 不可用,对应 startup / job 应 fail-fast 或 rejected,不得 fallback fake success。 |
| 哪些来源不能覆盖敏感配置? | config file、env 和 entry-local 都不能提供 raw secret、raw token、password、private key、certificate body、raw endpoint credential、SQL body、external payload body 或 forbidden body allowlist。env 可以提供 ref 字符串,但不能提供 raw secret material。test fixture 只能提供 deterministic fake ref / fake material marker,不得伪装 production secret。 |
| 每个配置域适用哪些来源,哪些来源禁止覆盖? | 本 Step §8.3 按配置域列出允许来源、禁止来源、优先级和不可用策略。truth / state / transaction / visibility / outbox source / duplicate replay 等 static design boundary 不接受任何配置来源覆盖。 |
| 每个配置域来源优先级完成后是否通过停审? | 已通过。所有配置域都有唯一来源优先级、冲突处理和不可用策略;未发现 secret raw value 被普通来源覆盖。 |
| 所有来源规则完成后,是否存在 secret 被普通来源覆盖、同名配置冲突或不可用策略不一致? | 已完成跨来源审计。普通来源只承载 refs;高优先级非法值 fail-fast;P0 不使用 config center / admin override;test fixture 不进入 production-like profile;entry-local 不覆盖全局配置。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 3 来源链图 | 只表达覆盖方向预览,未定义正式优先级 | 本 Step 固定普通配置优先级和 entry-local / secret / fixture 的边界 |
| Step 4 配置类别 | 已定义 startup / job-run-start / entry-local,但未定义来源覆盖 | 本 Step 将来源规则映射到配置类别和配置域 |
| `03_ddd_step_14` 配置引用表 | 只列默认口径和读取模块 | 本 Step 定义这些 section 的来源和冲突策略 |
| sensitive / secret | Step 4 只说 raw secret 禁止 | 本 Step 明确普通 file / env / entry-local 均只能提供 ref |
| config center / admin override | 上游未作为 P0 能力 | 本 Step 固定 P0 unsupported,避免实现侧私加远程配置 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 来源优先级 | `code defaults -> config file -> env -> secret refs -> test override` 只是预览 | 普通配置固定为 `code defaults < config file < env`;secret / fixture / entry-local 分离 | 防止 secret / local args 被误当成普通覆盖层 |
| 高优先级非法值 | 未定义是否 fallback | fail-fast,不得回退低优先级 | 避免错误 env 被静默忽略 |
| config file 重复 key | 未定义 | 重复 key / alias key fail-fast | 避免配置歧义 |
| secret 来源 | 只说 raw secret 禁止 | 普通来源只能提供 ref,raw material 不进入 P0 config | 支撑 Step 8 密钥管理 |
| entry-local | 只在 Step 4 分类 | 不覆盖全局配置,只影响当前 entry / job | 防止 CLI / local args 越权 |
| config center / admin override | 未正式纳入 P0 | P0 unsupported;声明启用即 fail-fast | 防止远程动态配置绕过审计 |

## 7. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| env 非法值是否回退 file/default | A. 回退;B. fail-fast | 采用 B。高优先级值出现但非法说明操作者意图不可信 |
| secret 是否进入普通来源链 | A. 允许 raw secret in file/env;B. 普通来源只允许 ref | 采用 B。raw secret 留给后续安全设施,不进普通配置 |
| entry-local 是否覆盖全局配置 | A. 可覆盖;B. 只影响当前入口 / job | 采用 B。避免 CLI 绕过 startup validation |
| config center 是否作为 P0 | A. 支持;B. unsupported | 采用 B。当前 `03` 没有远程配置加载 / 回滚 contract |
| test fixture 是否高于 env | A. 全局高优先级;B. 只在 test harness 范围内生效 | 采用 B。防止 production-like profile 继承测试 override |

## 8. 结构化中间产物

### 8.1 配置来源优先级表

| 来源 | 优先级 | 适用配置 | 冲突处理 | 不可用时策略 |
|---|---|---|---|---|
| code defaults | 1,最低普通来源 | P0 local / CI 可构造默认值、fake adapter、in-memory store、safe boundary、strict redaction | 被 config file / env 覆盖 | 默认值本身必须通过 validator |
| config file | 2 | startup runtime config、store / adapter refs、topic map、boundary、retention、job defaults、feature peripheral enablement | 覆盖 code defaults;重复 key / alias key fail-fast | 未指定则使用 defaults;指定但不可读 / 解析失败则 fail-fast |
| environment variables | 3,最高普通来源 | profile selector、config path、有限 runtime refs、CI override、safe diagnostics selector | 覆盖 file / defaults;存在但非法 fail-fast,不得 fallback | 缺失则使用低优先级;存在但非法 fail-fast |
| secret / credential refs | 引用值可由普通来源提供;raw material 不进入普通优先级 | credential ref、endpoint ref、handoff destination ref、external export target ref | ref 冲突按普通来源优先级;raw value 一律拒绝 | ref 格式非法 fail-fast;真实解析不可用按 profile / adapter 策略 fail-fast 或 rejected |
| entry-local parameters | 局部,不参与全局优先级 | config source selector、profile selector、job request source、artifact/report output root、dry-run diagnostic selector | 只影响当前 entry;不得覆盖全局禁止项 | 缺失必填 entry 参数则拒绝当前 entry / job |
| test fixture / deterministic override | 仅 local / CI test harness | fake adapter output、in-memory seed、fixed clock / id sequence、fixture refs | 只在 test profile 生效;不得覆盖 production-like | fixture 缺失则 test fail-fast |
| config center | P1/P2, P0 unsupported | future remote config source | P0 启用视为 unsupported | P0 fail-fast unsupported source |
| admin override | P1/P2, P0 unsupported | future audited operator override | P0 启用视为 unsupported | P0 fail-fast unsupported source |

### 8.2 冲突处理表

| 冲突场景 | 处理规则 | 是否阻断启动 / 操作 |
|---|---|---|
| 同一 key 出现在不同普通来源 | 高优先级覆盖低优先级 | 否,除非高优先级值非法 |
| 高优先级值类型 / 格式 / 范围非法 | fail-fast,不得回退低优先级 | 是 |
| config file 内重复 key | 视为配置歧义 | 是 |
| 同一语义出现多个 alias key | 视为配置歧义 | 是 |
| 必填 startup config 缺失 | startup fail-fast | 是 |
| 必填 job-run-start config 缺失 | job rejected / invalid input report | 阻断当前 job |
| 必填 entry-local 参数缺失 | 当前 entry / job rejected | 阻断当前入口 |
| feature disabled 且 target config 缺失 | 允许缺失 | 否 |
| feature enabled 但 target / topic / adapter ref 缺失 | fail-fast 或 job rejected | 是 |
| ordinary source 提供 raw secret / token / password | reject config | 是 |
| ordinary source 提供 external body / forbidden body allowlist | reject config / design violation | 是 |
| env 试图关闭 forbidden boundary | reject config | 是 |
| config center / admin override in P0 | unsupported source | 是 |
| test fixture in production-like profile | reject profile | 是 |
| transport topic binding 缺少 enabled event key | startup fail-fast | 是 |
| idempotency retention 小于 redelivery / retry / commit unknown window | cross-field validation fail-fast | 是 |

### 8.3 按配置域组织的来源覆盖表

| 配置域 | 允许来源 | 禁止来源 | 优先级 | 不可用策略 |
|---|---|---|---|---|
| runtime profile selection | defaults、config file、env、entry-local selector | raw secret、config center P0、admin override P0 | entry-local selector > env > file > default for current entry only | invalid profile fail-fast |
| runtime config identity | generated validated ref、config file digest、env selected path | raw config body in domain / contracts | validator generated after load | validation issue blocks startup |
| adapter availability registry | defaults、config file、env refs、test fixture in test profile | production fake override、admin override P0 | env > file > default;fixture only test | missing required adapter fail-fast;disabled optional adapter explicit |
| truth store binding | defaults、config file、env ref、secret ref for durable future | hot update、test fixture in production-like | env > file > default | missing selected store fail-fast |
| projection store binding | defaults、config file、env ref | query-time override | env > file > default | missing selected store fail-fast or query degraded only if optional read surface |
| reference snapshot store binding | defaults、config file、env ref | external body source | env > file > default | missing selected store fail-fast |
| outbox store binding | defaults、config file、env ref | publisher current-truth override | env > file > default | missing selected store fail-fast |
| idempotency / result store binding | defaults、config file、env ref | disable replay source | env > file > default | missing selected store fail-fast |
| boundary limits | defaults、config file、env | entry-local override unless explicitly current request limit | env > file > default | invalid limit fail-fast |
| source resolver family binding | defaults、config file、env refs、secret refs、test fixture | non-core Cargo dependency、raw source body | env > file > default;fixture test only | unavailable -> rejected / delayed / failed reference according to flow |
| inbound consumer binding | defaults、config file、env、test fixture event source | command emulation source、raw external body | env > file > default | unsupported schema rejected / dead-letter |
| publisher adapter binding | defaults、config file、env refs、secret refs、test fixture publisher | raw bus secret、event schema source | env > file > default;fixture test only | unavailable -> outbox retry / failed marker |
| transport topic binding | defaults、config file、env ref | changing event kind / schema | env > file > default | missing enabled topic fail-fast |
| job runner binding | defaults、config file、env、job input for run-local scope | hot change during job | job input / metadata for run-local > env > file > default where allowed | invalid job config rejected |
| projection rebuild binding | defaults、config file、env、job input | truth repair source | job input > env > file > default where allowed | invalid scope rejected |
| reference refresh binding | defaults、config file、env、job input、resolver refs | external body source | job input > env > file > default where allowed | unresolved refs mark failed / partial report |
| reconciliation binding | defaults、config file、env、job input | auto-fix truth source | job input > env > file > default where allowed | report issue,do not repair truth |
| trace handoff target binding | defaults、config file、env refs、secret refs、job input target | observability ledger body | job input target > env > file > default where allowed | unavailable target -> failed marker / report |
| archive handoff binding | defaults、config file、env refs、secret refs、job input target | archive package body | job input target > env > file > default where allowed | unavailable target -> failed marker / report |
| external export binding | defaults disabled、config file、env refs、secret refs、job input target | external status truth source | job input target > env > file > default where allowed | disabled -> job rejected;failure -> failed marker |
| redaction / safe output binding | defaults、config file、env safe selector | hot relax、raw body allowlist | env > file > default | invalid / unsafe rule fail-fast |
| clock / id adapter binding | defaults、config file、env、test fixture | handler-generated id source | env > file > default;fixture test only | unavailable -> fail before mutation |
| test fake profile binding | defaults、test config file、test env、fixture | production-like source | test fixture > test env > test file > default inside test harness | fixture missing -> test fail-fast |
| environment profile binding | defaults、config file、env、entry-local selector | admin override P0、test fixture production | entry-local selector > env > file > default | unsupported profile fail-fast |

### 8.4 来源优先级停审记录

| 配置域 / 来源 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| ordinary sources | 覆盖顺序是否唯一 | 通过 | `defaults < file < env` |
| entry-local | 是否覆盖全局配置 | 通过 | 只影响当前 entry / job |
| secret refs | raw secret 是否进入普通来源 | 通过 | 普通来源只给 ref |
| test fixture | 是否污染 production-like | 通过 | 仅 test harness |
| config center / admin override | P0 是否启用 | 通过 | P0 unsupported |
| store binding | missing selected store 策略 | 通过 | startup fail-fast |
| publisher / topic | enabled event topic 是否总量闭合 | 通过 | missing topic fail-fast |
| job config | job-run-start 是否冻结 | 通过 | 写入 report / receipt |
| redaction | 是否允许 hot relax | 通过 | 不允许;invalid fail-fast |
| forbidden boundary | 是否可由任何来源覆盖 | 通过 | 不可覆盖 |

### 8.5 跨来源冲突审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| secret 是否会被 ordinary file / env raw value 覆盖 | 无 | 只允许 ref |
| 高优先级非法值是否可能 fallback | 无 | 一律 fail-fast |
| config file 内重复 key 是否可判定 | 可判定 | fail-fast |
| entry-local 是否可绕过 startup validation | 不可 | 只影响当前 entry;不覆盖禁止项 |
| config center / admin override 是否混入 P0 | 无 | P0 unsupported |
| test fixture 是否进入 production-like | 无 | profile validation reject |
| 同一行为是否多来源语义不一致 | 无 | 每个域已写优先级 |
| 是否需要回写 `03` | 未发现 | 当前只定义配置来源语义,不新增代码契约 |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 普通配置来源优先级为 `code defaults < config file < environment variables` | 否 | 配置来源语义 | 不适用 | 无回写 |
| entry-local parameters 不覆盖全局配置,只影响当前 entry / job | 否 | 配置来源边界 | 不适用 | 无回写 |
| secret raw material 不进入普通配置链,普通来源只能提供 ref | 否 | 安全配置语义 | 不适用 | 无回写 |
| P0 不支持 config center / admin override | 否 | 范围裁剪 | 不适用 | 无回写 |
| 若后续需要远程配置中心、admin override 或 hot reload | 是 | runtime loader / validator / audit / rollback contract | `03` §13 / Step 14 | 阻塞待确认 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_05_sources_priority_conflicts.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“配置来源优先级表”“冲突处理表”“按配置域组织的来源覆盖表”“来源优先级停审记录”和“跨来源冲突审计表”小节,了解配置来源和冲突规则如何从 Step 3 / Step 4 收敛。

正式 `04-配置设计.md` §5 应回填:

- 配置来源优先级表。
- 冲突处理表。
- 按配置域组织的来源覆盖表。
- 来源优先级停审记录。
- 跨来源冲突审计表。
- 对详细设计的影响判定。

回填要求:

- 不得写具体 key 名、env var 名、JSON schema、secret provider API 或部署命令。
- 不得允许高优先级非法值 fallback。
- 不得允许 ordinary file / env 提供 raw secret 或 forbidden body。
- 不得把 config center / admin override 写成 P0 能力。
- 不得让 entry-local 参数覆盖全局禁止项或业务不变量。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 正式 config file 格式和 key 命名 | 影响 Step 7 配置项和示例 | Step 7 定义 |
| 环境 profile 如何组合来源 | 影响 local / CI / staging / production-like 矩阵 | Step 6 定义 |
| secret provider 真实读取、轮换和审计 | 影响敏感配置 | Step 8 定义 |
| remote config center / admin override 是否进入 P1/P2 | 影响 runtime loader / audit / rollback | Step 13 / 14 记录演进 |
| entry local args 的正式 flag / env key 是否需要单独 schema | 影响 implementation entrypoints | 若 Step 7/9 需要具体 CLI/env 名,必须回写 `03` 或在 `04` 明确为配置语义 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置来源优先级已明确 | 通过 | 普通来源 `defaults < file < env` |
| 冲突处理可判定 | 通过 | 高优先级非法值 fail-fast |
| 每个配置域允许 / 禁止来源已明确 | 通过 | 见 §8.3 |
| secret 和 forbidden body 覆盖边界已明确 | 通过 | 普通来源只承载 ref |
| 来源优先级已停审 | 通过 | 见 §8.4 |
| 跨来源冲突审计没有 unresolved 冲突 | 通过 | 见 §8.5 |
| 对 `03` 的影响判定已记录 | 通过 | 当前无回写 |
| 可进入 Step 6 | 通过 | 下一步定义环境、部署 profile 与配置矩阵 |
