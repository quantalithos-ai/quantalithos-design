# 04 配置设计 Step 5 · 定义配置来源、优先级与冲突处理

> 子项目: `L1-identity`
> 目标文档: `04-配置设计.md`
> SOP Step: Step 5 定义配置来源、优先级与冲突处理
> 状态: 已写入;等待用户审核

---

## 1. Step 状态

| 项 | 状态 |
|---|---|
| 当前 Step | Step 5 定义配置来源、优先级与冲突处理 |
| 当前状态 | 已写入;等待用户审核 |
| 输入基线 | Step 3 control plane;Step 4 categories / boundaries;新版正式 `03-详细设计.md` §13~§15 |
| 输出文件 | `projects/L1-identity/design-calibration/04_config_step_05_sources_priority_conflicts.md` |
| 停审方式 | 本 Step 完成后暂停,审核通过后进入 Step 6 environment profiles / matrix |

本 Step 定义配置从哪些来源进入 `L1-identity`,不同来源之间如何覆盖、冲突如何处理、不可用时是否 fail-fast,以及哪些来源不得覆盖敏感配置或禁止配置化边界。

本 Step 只回答:

- code defaults、config file、environment variables、secret refs、entry-local parameters、test fixtures、config center 和 admin override 的优先级。
- 同名配置、重复 key、alias key、高优先级非法值、必填项缺失如何处理。
- 每个配置域允许哪些来源,禁止哪些来源。
- secret raw value、external body、static design boundary 是否可以由普通来源覆盖。
- 来源不可用时是 fallback、fail-fast、reject job / entry 还是 degraded。
- 来源规则是否会影响 `03-详细设计.md` 代码契约。

本 Step 不定义具体配置项清单、默认值、JSON / TOML schema、环境变量名、secret provider API、profile 矩阵、加载函数、部署命令、产品选型、测试编号或正式配置文件样例。

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_03_control_plane.md` | 已审核通过 | 提供来源链预览、配置控制面和配置域 |
| `04_config_step_04_categories_boundaries.md` | 已审核通过 | 提供配置类别、更新时机、禁止配置化项和 P0 无 hot update 口径 |
| `03-详细设计.md` §13 | 已完成 | 提供配置 ownership、runtime builder、external binding 和 forbidden configuration boundary |
| `03-详细设计.md` §14~§15 | 已完成 | 提供 observability / redaction 和 config/runtime/adapter 测试切口 |
| `03_ddd_step_14_config_external_binding.md` | 已完成并已审核 | 提供 config section、代码绑定和 runtime builder 顺序 |
| 旧 `04_config_step_05_sources_priority_conflicts.md` | 历史诊断输入 | 只用于识别旧名和旧来源口径;不得作为本 Step 真相源 |
| `L1-governance` Step 5 calibration | 参考样式 | 只参考粒度和表格组织,不复用 governance 业务对象 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| code default、file、env、secret、config center、admin override 的优先级是什么? | P0 普通配置优先级固定为 `code defaults < config file < environment variables`。secret raw material 不进入普通优先级链;普通来源只能提供 secret / credential / endpoint / destination ref。entry-local parameters 不覆盖全局配置,只选择当前 entry / job 的局部输入。test fixture / deterministic override 只在 test-scoped profile 和 test harness 中生效。config center 和 admin override 不作为 P0 正式来源,声明启用即 fail-fast unsupported source。 |
| 同名配置多处出现时如何冲突处理? | 不同普通来源同名配置由高优先级覆盖低优先级。高优先级值只要存在但类型、格式、范围或 cross-field 校验非法,必须 fail-fast,不得回退低优先级。单个 config file 内重复 key 或同一语义使用 alias key 视为歧义,fail-fast。 |
| 必填项缺失时是否阻断启动? | startup runtime 必填项缺失阻断 startup。job-run-start 必填项缺失拒绝当前 job run 并返回 safe invalid input / rejected report surface。entry-local 必填参数缺失拒绝当前入口。可选外围 target 缺失时,若对应 feature / adapter 显式 disabled 则允许;若 enabled 则 fail-fast 或 reject job。 |
| 配置中心或密钥系统不可用时如何处理? | P0 不启用 config center。secret provider 的真实解析属于 Step 8 / P1+ 产品绑定;P0 只定义 ref-only 语义和解析边界。若某 profile 声明必须解析真实 secret / credential 但 resolver 不可用,对应 startup / job 应 fail-fast 或 rejected,不得 fallback fake success。 |
| 哪些来源不能覆盖敏感配置? | config file、env、entry-local 和 test fixture 都不能提供 raw secret、raw token、password、private key、certificate body、raw endpoint credential、SQL body、external payload body 或 forbidden body allowlist。普通来源可以提供 ref 字符串,但不能提供 raw secret material。 |
| 每个配置域适用哪些来源,哪些来源禁止覆盖? | 本 Step §7.3 按 Step 3 配置域列出允许来源、禁止来源、优先级和不可用策略。truth / state / transaction / visibility / outbox source / stored replay 等 static design boundary 不接受任何配置来源覆盖。 |
| 每个配置域来源优先级完成后是否通过停审? | 已通过。所有配置域都有唯一来源优先级、冲突处理和不可用策略;未发现 secret raw value 被普通来源覆盖。 |
| 所有来源规则完成后,是否存在 secret 被普通来源覆盖、同名配置冲突或不可用策略不一致? | 已完成跨来源审计。普通来源只承载 refs;高优先级非法值 fail-fast;P0 不使用 config center / admin override;test fixture 不进入 production-like profile;entry-local 不覆盖全局配置。 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 3 来源链图 | 只表达覆盖方向预览,未定义正式优先级 | 本 Step 固定普通配置优先级,并把 secret / entry-local / fixture 从全局覆盖链中分离 |
| Step 4 配置类别 | 已定义 startup / job-run-start / entry-local,但未定义来源覆盖 | 本 Step 将来源规则映射到配置类别和配置域 |
| 新版 `03` §13 | 只定义 config ownership 和 builder order,不定义 `04` 的来源冲突规则 | 本 Step 补齐配置来源语义,不新增代码契约 |
| sensitive / secret | Step 4 只说 raw secret 禁止 | 本 Step 明确普通 file / env / entry-local 均只能提供 ref |
| config center / admin override | 上游未作为 P0 能力 | 本 Step 固定 P0 unsupported,避免实现侧私加远程配置 |
| 旧 Step 5 calibration | 混入旧 external decision、旧 profile 口径和旧对象名 | 本 Step 全量替换为新版 `03` 术语和 Step 3/4 边界 |

## 5. 改动前后对比

| 项 | 改动前 | 本步后 | 原因 |
|---|---|---|---|
| 来源优先级 | `code defaults -> config file -> env -> secret refs -> test override` 只是预览 | 普通配置固定为 `code defaults < config file < env`;secret / fixture / entry-local 分离 | 防止 secret / local args 被误当成普通覆盖层 |
| 高优先级非法值 | 未定义是否 fallback | fail-fast,不得回退低优先级 | 避免错误 env 被静默忽略 |
| config file 重复 key | 未定义 | 重复 key / alias key fail-fast | 避免配置歧义 |
| secret 来源 | 只说 raw secret 禁止 | 普通来源只能提供 ref,raw material 不进入 P0 config | 支撑 Step 8 密钥管理 |
| entry-local | 只在 Step 4 分类 | 不覆盖全局配置,只影响当前 entry / job | 防止 CLI / local args 越权 |
| config center / admin override | 未正式纳入 P0 | P0 unsupported;声明启用即 fail-fast | 防止远程动态配置绕过审计 |

## 6. 配置设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| env 非法值是否回退 file/default | A. 回退;B. fail-fast | 采用 B。高优先级值出现但非法说明操作者意图不可信 |
| secret 是否进入普通来源链 | A. 允许 raw secret in file/env;B. 普通来源只允许 ref | 采用 B。raw secret 留给 Step 8 安全设施,不进普通配置 |
| entry-local 是否覆盖全局配置 | A. 可覆盖;B. 只影响当前入口 / job | 采用 B。避免 entry 绕过 startup validation |
| config center 是否作为 P0 | A. 支持;B. unsupported | 采用 B。当前 `03` 没有远程配置加载 / rollback / audit contract |
| test fixture 是否高于 env | A. 全局高优先级;B. 只在 test harness 范围内生效 | 采用 B。防止 production-like profile 继承测试 override |
| static design boundary 是否加入优先级数字 | A. 作为最高优先级来源;B. 明确为非来源 | 采用 B。设计不变量不能被 overlay 模型表达 |

## 7. 结构化中间产物

### 7.1 配置来源优先级表

| 来源 | 优先级 | 适用配置 | 冲突处理 | 不可用时策略 |
|---|---:|---|---|---|
| static design boundary | 非运行时来源 | truth ownership、state matrix、query no-write、job no-truth-repair、stored replay、body-free / secret-free boundary | 不参与覆盖,任何运行时来源不得覆盖 | 不适用;如需改变必须正式设计变更 |
| code defaults | 1,最低普通来源 | P0 safe defaults、fake/disabled adapter default mode、strict redaction、in-memory / product-neutral default marker | 被 config file / env 覆盖 | 默认值本身必须通过 validator;缺失即设计缺口 |
| config file | 2 | startup runtime config、store / adapter refs、topic-neutral route refs、boundary limits、job defaults、peripheral enablement | 覆盖 code defaults;重复 key / alias key fail-fast | 文件缺失按 profile 判定;指定但不可读 / 解析失败 fail-fast |
| environment variables | 3,最高普通来源 | profile selector、config path、有限 runtime refs、CI override、safe diagnostic selector | 覆盖 file / defaults;存在但非法 fail-fast,不得 fallback | 缺失则使用低优先级;存在但非法 fail-fast |
| secret / credential refs | ref 值遵守普通来源优先级;raw material 不进入普通优先级 | credential ref、endpoint ref、handoff destination ref、audit sink ref、future durable DSN ref | ref 冲突按 ordinary source 优先级;raw value 一律拒绝 | ref 格式非法 fail-fast;真实解析不可用按 profile / adapter 策略 fail-fast 或 rejected |
| entry-local parameters | 局部,不参与全局优先级 | route/binding selector、actor context marker、request digest、job request source、run id、page cursor、dry-run diagnostic selector | 只影响当前 entry;不得覆盖全局禁止项或 startup runtime binding | 缺失必填 entry 参数则拒绝当前 entry / job |
| test fixture / deterministic override | 仅 test-scoped profile / harness | fake adapter output、in-memory seed、fixed clock / id sequence、fixture refs | 只在 test profile 生效;不得覆盖 production-like | fixture 缺失则 test fail-fast |
| config center | P1/P2 候选;P0 unsupported | future remote config source | P0 启用视为 unsupported | P0 fail-fast unsupported source |
| admin override | P1/P2 候选;P0 unsupported | future audited operator override | P0 启用视为 unsupported | P0 fail-fast unsupported source |

### 7.2 冲突处理表

| 冲突场景 | 处理规则 | 是否阻断启动 / 操作 |
|---|---|---|
| 同一 key 出现在不同普通来源 | 高优先级覆盖低优先级 | 否,除非高优先级值非法 |
| 高优先级值类型 / 格式 / 范围非法 | fail-fast,不得回退低优先级 | 是 |
| config file 内重复 key | 视为配置歧义 | 是 |
| 同一语义出现多个 alias key | 视为配置歧义 | 是 |
| 必填 startup config 缺失 | startup fail-fast | 是 |
| 必填 job-run-start config 缺失 | job rejected / invalid input report | 阻断当前 job |
| 必填 entry-local 参数缺失 | 当前 entry rejected | 阻断当前入口 |
| optional adapter / feature disabled 且 target config 缺失 | 允许缺失 | 否 |
| optional adapter / feature enabled 但 target / topic / adapter ref 缺失 | fail-fast 或 job rejected | 是 |
| ordinary source 提供 raw secret / token / password | reject config | 是 |
| ordinary source 提供 external body / forbidden body allowlist | reject config / design violation | 是 |
| env 试图关闭 forbidden boundary | reject config | 是 |
| config center / admin override in P0 | unsupported source | 是 |
| test fixture in production-like profile | reject profile | 是 |
| transport topic binding 缺少 enabled event key | startup fail-fast | 是 |
| idempotency retention 小于 redelivery / retry / commit unknown window | cross-field validation fail-fast | 是 |
| entry-local 试图覆盖 startup store / adapter / redline | reject entry parameter | 阻断当前入口 |

### 7.3 按配置域组织的来源覆盖表

| 配置域 | 允许来源 | 禁止来源 | 优先级 | 不可用策略 |
|---|---|---|---|---|
| profile selector | defaults、config file、env、entry-local selector | raw secret、config center P0、admin override P0 | entry-local selector only for current entry;otherwise env > file > default | invalid profile fail-fast |
| runtime config shell / assembly validation | generated validated refs、config file digest、env selected source summary | raw config body in application / domain / contracts | validator generated after ordinary sources resolve | validation issue blocks startup |
| adapter availability registry | defaults、config file、env refs、test fixture in test profile | production fake override、entry-local global override | env > file > default;fixture test only | missing required adapter fail-fast;optional disabled must be explicit |
| core truth store binding | defaults、config file、env ref、future secret ref for durable | hot update、test fixture in production-like | env > file > default | missing selected store fail-fast |
| append-only / trace / audit store binding | defaults、config file、env ref、future secret ref | disable audit source、raw body source | env > file > default | unavailable store fail-fast or compensation only where formally allowed |
| projection/read store binding | defaults、config file、env ref | query-time override | env > file > default | missing selected store fail-fast;query may return degraded only through formal surface |
| reference/report store binding | defaults、config file、env ref | external body source、auto-repair source | env > file > default | missing selected store fail-fast |
| outbox store / payload marker binding | defaults、config file、env ref | publisher current-truth override | env > file > default | missing selected store fail-fast |
| idempotency/result/report replay store | defaults、config file、env ref | disable replay source | env > file > default | missing selected store fail-fast |
| trusted actor context input | entry-local request metadata、Gateway trusted context | config file actor、env actor、fixture actor in production-like | current request context only | missing required actor context rejects current entry |
| operation metadata / request digest input | entry-local metadata、protocol envelope | config file digest override、env digest override | current request / envelope only | missing idempotency / digest rejects current write entry |
| role/capability source resolver | defaults、config file、env refs、secret refs、test fixture | non-core Cargo dependency、raw source body | env > file > default;fixture test only | unavailable -> rejected / delayed / degraded according to flow |
| work source resolver / career consumer | defaults、config file、env refs、test fixture for test | ProjectMember truth source、command emulation source | env > file > default;fixture test only | unsupported schema rejected / dead-lettered |
| memory/archive resolver and handoff | defaults、config file、env refs、secret refs、job target where allowed | memory content source、archive package body | job target where allowed > env > file > default | unavailable target -> failed marker / report |
| governance basis resolver | defaults、config file、env refs、secret refs、test fixture | guard bypass source、governance policy body | env > file > default;fixture test only | unavailable basis fail-closed for guarded action |
| artifact/evidence ref resolver | defaults、config file、env refs、secret refs、test fixture | artifact/evidence body source | env > file > default;fixture test only | unavailable -> rejected / delayed / degraded per flow |
| bus publisher adapter | defaults、config file、env refs、secret refs、test fixture publisher | raw bus secret、event schema source | env > file > default;fixture test only | unavailable -> outbox retry / failed marker |
| topic-neutral route binding | defaults、config file、env ref | changing event kind / schema | env > file > default | missing enabled topic fail-fast |
| operations job runner binding | defaults、config file、env、job input for run-local scope | hot change during job、core mutation override | job input / metadata for run-local > env > file > default where allowed | invalid job config rejected |
| trace handoff adapter | defaults、config file、env refs、secret refs、job input target where allowed | observability ledger body、delivered shortcut | job target where allowed > env > file > default | unavailable target -> failed marker / report |
| propagation retry adapter | defaults、config file、env、job input | terminal reopen source | job input > env > file > default where allowed | invalid retry input rejected;terminal guard holds |
| redaction/safe diagnostics | defaults、config file、env safe selector | hot relax、raw body allowlist | env > file > default | invalid / unsafe rule fail-fast |
| deterministic clock/id | defaults、config file、env、test fixture | handler-generated id source、production-like fake override | env > file > default;fixture test only | unavailable before mutation -> fail-fast / reject |
| fixture source | test config file、test env、fixture registry | production-like source | fixture > test env > test file > default inside test harness | fixture missing -> test fail-fast |

### 7.4 来源优先级停审记录

| 配置域 / 来源 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| ordinary sources | 覆盖顺序是否唯一 | 通过 | `defaults < file < env` |
| entry-local | 是否覆盖全局配置 | 通过 | 只影响当前 entry / job |
| secret refs | raw secret 是否进入普通来源 | 通过 | 普通来源只给 ref |
| test fixture | 是否污染 production-like | 通过 | 仅 test-scoped profile / harness |
| config center / admin override | P0 是否启用 | 通过 | P0 unsupported |
| store binding | missing selected store 策略 | 通过 | startup fail-fast |
| publisher / topic | enabled event topic 是否闭合 | 通过 | missing topic fail-fast |
| job config | job-run-start 是否冻结 | 通过 | 写入 report / stored replay |
| redaction | 是否允许 hot relax | 通过 | 不允许;invalid fail-fast |
| forbidden boundary | 是否可由任何来源覆盖 | 通过 | 不可覆盖 |

### 7.5 跨来源冲突审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| secret 是否会被 ordinary file / env raw value 覆盖 | 无 | 只允许 ref |
| 高优先级非法值是否可能 fallback | 无 | 一律 fail-fast |
| config file 内重复 key 是否可判定 | 可判定 | fail-fast |
| entry-local 是否可绕过 startup validation | 不可 | 只影响当前 entry;不覆盖禁止项 |
| config center / admin override 是否混入 P0 | 无 | P0 unsupported |
| test fixture 是否进入 production-like | 无 | profile validation reject |
| 同一行为是否多来源语义不一致 | 无 | 每个域已写优先级 |
| static design boundary 是否被来源覆盖 | 无 | 明确为非运行时来源 |
| 是否需要回写 `03` | 未发现 | 当前只定义配置来源语义,不新增代码契约 |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 `03` | 影响类型 | `03` 回写位置 | 处理状态 |
|---|---|---|---|---|
| 普通配置来源优先级为 `code defaults < config file < environment variables` | 否 | 配置来源语义 | 不适用 | 无回写 |
| entry-local parameters 不覆盖全局配置,只影响当前 entry / job | 否 | 配置来源边界 | 不适用 | 无回写 |
| secret raw material 不进入普通配置链,普通来源只能提供 ref | 否 | 安全配置语义 | 不适用 | 无回写 |
| P0 不支持 config center / admin override | 否 | 范围裁剪 | 不适用 | 无回写 |
| high-priority invalid value fail-fast,不得 fallback | 否 | 加载冲突语义 | 不适用 | 无回写 |
| 若后续需要远程配置中心、admin override 或 hot reload | 是 | runtime loader / validator / audit / rollback contract | `03` §13 / runtime assembly / config binding | 阻塞待确认 |

## 9. 回填草稿

正式 `04-配置设计.md` §5 可回填:

```md
## 5. 配置来源、优先级与冲突处理

> 校准来源:
> - `design-calibration/04_config_step_05_sources_priority_conflicts.md`

P0 普通配置来源优先级为 `code defaults < config file < environment variables`。secret raw material 不进入普通优先级链;普通来源只能提供 secret / credential / endpoint / destination ref。entry-local parameters 不覆盖全局配置,只影响当前 entry 或 job。test fixture / deterministic override 只在 test-scoped profile 和 test harness 生效。

高优先级配置值一旦存在但类型、格式、范围或 cross-field 校验非法,必须 fail-fast,不得回退低优先级。config file 内重复 key、同一语义 alias key、ordinary source 提供 raw secret / forbidden body、test fixture 进入 production-like profile、entry-local 覆盖 startup store / adapter / redline 均视为配置错误。

P0 不启用 config center 或 admin override。未来如需远程配置中心、operator override 或 hot reload,必须先回写 `03-详细设计.md` 的 runtime loader、audit、rollback 和 last-known-good contract。
```

## 10. 待确认事项

| 编号 | 待确认事项 | 影响 | 当前处理 |
|---|---|---|---|
| ID-CONFIG-Q16 | 正式 config file 格式和 key 命名 | 影响 Step 7 配置项和示例 | Step 7 定义 |
| ID-CONFIG-Q17 | 环境 / profile 如何组合来源 | 影响 test-scoped / production-like 矩阵 | Step 6 定义 |
| ID-CONFIG-Q18 | secret provider 真实读取、轮换和审计 | 影响敏感配置 | Step 8 定义 |
| ID-CONFIG-Q19 | remote config center / admin override 是否进入 P1/P2 | 影响 runtime loader / audit / rollback | Step 13 / 14 记录演进 |
| ID-CONFIG-Q20 | entry-local args 的正式 flag / env key 是否需要单独 schema | 影响 implementation entrypoints | 若 Step 7/9 需要具体 CLI/env 名,必须回写 `03` 或在 `04` 明确为配置语义 |

## 11. 进入下一步条件

- 配置来源优先级已明确。
- 冲突处理可判定。
- 每个配置域允许 / 禁止来源已明确。
- secret 和 forbidden body 覆盖边界已明确。
- 来源优先级已停审。
- 跨来源冲突审计没有 unresolved 冲突。
- 对 `03-详细设计.md` 的影响判定已记录,当前无必须回写项。
- 未提前定义配置 key、env var、默认值、schema、secret provider、profile 矩阵、测试编号或实施 boundary。

下一步进入 Step 6:定义环境、部署 profile 与配置矩阵。
