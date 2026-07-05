# Step 5. 定义配置来源、优先级与冲突处理

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 5
> 回填章节: `04-配置设计.md` §5 配置来源、优先级与冲突处理

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 5 定义配置来源、优先级与冲突处理 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 3 配置控制面;Step 4 配置分类与禁止配置化边界;详细设计 Step 14 配置引用与外部依赖绑定 |
| 输出文件 | `projects/L1-artifact/design-calibration/04_config_step_05_sources_priority_conflicts.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 6 |

## 2. 本步目标

本 Step 在 Step 3 控制面和 Step 4 分类边界基础上,定义 `L1-artifact` 的配置从哪些来源进入系统、不同来源如何覆盖、哪些来源只能提供 ref 或 selector、同名冲突和非法值如何处理、不同生效时机下采用什么 fail-fast / reject 策略。

本 Step 只回答:

- 普通配置来源的正式优先级。
- secret ref、entry-local parameter、job-local typed input、test fixture 在来源链中的位置。
- 同名 key、重复 key、alias key、高优先级非法值、必填项缺失、feature enablement 与 target 缺失冲突如何处理。
- 每个配置域允许哪些来源,禁止哪些来源。
- 哪些来源可以选择 profile / config source,但不能覆盖全局冻结配置。
- P0 是否支持 config center、admin override、runtime hot override。
- 来源不可用时是 startup fail-fast、当前 entry reject、当前 job reject,还是降级为 disabled / unavailable surface。

本 Step 不定义具体 key 名、JSON schema、环境变量名、secret provider API、配置文件目录结构、部署命令、远程配置产品、CLI flag 名或完整环境矩阵。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_03_control_plane.md` | 已完成 | 提供配置来源链预览、配置入口和逐配置域控制面 |
| `04_config_step_04_categories_boundaries.md` | 已完成 | 提供 startup / job-run-start / entry-local / test fixture 分类边界和禁止配置化项 |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | 提供 config section、代码绑定点、外部依赖绑定和禁止配置化边界 |
| `03_ddd_step_15_observability_audit.md` | 已完成 | 提供 config validation、redaction 和安全输出约束 |
| `03_ddd_step_16_test_cuts.md` | 已完成 | 提供 fake runtime、fixture、deterministic override 和测试 profile 切口 |
| `03-详细设计.md` §13 / §15 / §17 | 已完成 | 提供 runtime config、external binding、观测与风险约束 |
| `02_hld_step_11_configuration_impact.md` | 已完成 | 提供配置影响轮廓和上游禁止覆盖边界 |
| `L1-governance` `04_config_step_05_sources_priority_conflicts.md` | 已参考 | 提供 Step 5 粒度框架,本文件按 Artifact 语义重写 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 普通配置来源优先级是什么? | P0 普通配置来源固定为 `code defaults < config file < environment variables`。Step 6 若采用多文件或 profile 分层,也只是在“config file”这一普通来源内部展开,不改变三层主优先级。 |
| secret / credential / target 配置是否进入普通优先级链? | 不作为独立高优先级层。普通来源只能提供 secret ref、credential ref、target ref、adapter ref、topic binding ref 或其他 body-free selector / ref。raw secret material、raw password、raw token、certificate body、SQL body、external payload body 不进入普通来源链。 |
| entry-local parameter 和 job-local typed input 的位置是什么? | 不参与全局普通来源覆盖。它们只能在 Step 4 已允许的 entry-local 或 job-run-start 边界内,选择当前 profile / config source / output root / job scope / current target,或为当前 job 提供局部 runner 参数。它们不得覆盖全局冻结后的 truth store、state invariant、topic schema、idempotency invariant 或 forbidden boundary。 |
| test fixture / deterministic override 如何定位? | 只在 local / CI / deterministic test harness 中生效。它可以覆盖 test profile 下的 fake adapter、fixture source、fixed clock / id sequence,但不能进入 production-like profile,也不能伪装成 production secret / target。 |
| 同名配置多处出现如何处理? | 高优先级覆盖低优先级。若高优先级值存在但类型、格式、范围或 cross-field 校验非法,必须按当前生效时机 fail-fast 或 reject,不得静默回退低优先级。 |
| 单个来源内部重复 key 或 alias key 如何处理? | 视为配置歧义。单个 config file 内重复 key、同一语义出现两个 alias key、同一 env 语义存在多套变量名都触发 fail-fast。 |
| P0 是否支持 config center、admin override、runtime hot override? | 不支持。若 profile 或入口声明启用这些来源,视为 unsupported source,在 startup 或当前 entry 直接失败。 |
| 每个配置域是否都有唯一允许来源和不可用策略? | 已完成。见 §8.4 逐配置域来源矩阵。 |
| 所有来源规则完成后是否有 secret 被普通来源 raw 覆盖、entry-local 越权或 fixture 污染 production-like? | 已审计,未发现。普通来源只承载 refs / selectors / validated ordinary values;entry-local 只作用于当前 entry / job;fixture 只限 test harness。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 3 来源链图 | 只表达来源类型和覆盖方向预览,未固定正式优先级 | 本 Step 固定普通来源优先级与特殊来源边界 |
| Step 4 分类边界 | 已区分 startup / job-run-start / entry-local,但未说明不同来源如何在这些窗口生效 | 本 Step 增加 freeze / selection / reject 规则 |
| Step 14 配置引用表 | 已列 config section 到代码绑定,但未定义来源冲突和 unsupported source | 本 Step 给每个配置域补上允许来源和冲突处理 |
| Secret / sensitive 约束 | Step 4 只定义禁止 raw secret 输出 | 本 Step 明确普通来源只提供 ref,不提供 raw material |
| Test fixture | Step 4 只把 fixture 归入测试类别 | 本 Step 明确 fixture 不能进入 production-like profile,也不参与普通来源覆盖链 |
| 远程配置 / admin override | 上游未闭口为 P0 能力 | 本 Step 固定为 unsupported source,避免实现侧私加动态覆盖能力 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 普通来源优先级 | 仅有预览链 | 固定为 `defaults < file < env` | 为 Step 6 / 7 / 9 提供唯一覆盖基线 |
| Secret / target 来源 | 只说“敏感配置单独收口” | 明确普通来源只提供 ref / selector,不提供 raw material | 避免配置链突破 body-free / redaction 边界 |
| Entry-local / job-local | 只按类别定义 | 明确不覆盖全局冻结配置,只影响当前 entry / 当前 job | 防止 CLI / API / job body 越权 |
| 高优先级非法值 | 未定义是否 fallback | 一律 fail-fast 或 reject,不得回退低优先级 | 防止错误 env / entry 值被静默吞掉 |
| Unsupported source | 未正式裁定 | config center / admin override / hot override 在 P0 一律 unsupported | 保持与 `03` runtime contract 一致 |
| 逐配置域来源矩阵 | Step 3 / 4 只列控制面和类别 | 本 Step 增加逐域允许来源、禁止来源、优先级和不可用策略 | 为 Step 7~11 逐域展开提供基线 |

## 7. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 高优先级非法值是否回退低优先级 | A. 回退;B. fail-fast / reject | 采用 B。操作者显式提供了高优先级值,非法说明当前意图不可接受 |
| Secret 是否作为 env 的普通值 | A. 允许 raw secret in env/file;B. 普通来源只允许 ref | 采用 B。raw material 留给后续密钥设施和 Step 8 讨论 |
| Entry-local 是否允许覆盖全局 config field | A. 允许;B. 只允许 selector / current-run local fields | 采用 B。startup validate 后的 runtime 冻结不能被入口临时改写 |
| Job input 是否允许覆盖 topic / store / idempotency invariant | A. 允许 job 临时重写;B. 只允许 run-local scope / batch / target / output | 采用 B。typed job request 不是远程配置通道 |
| Remote config / admin override 是否纳入 P0 | A. 支持;B. unsupported | 采用 B。当前 `03` 无远程加载、审计、回滚和热更新契约 |

## 8. 结构化中间产物

### 8.1 配置来源分层表

| 来源层 | 是否普通覆盖层 | 典型内容 | 生效窗口 | 说明 |
|---|---|---|---|---|
| code defaults | 是,最低 | local / CI 默认 profile、in-memory / fake adapter、strict redaction、deterministic safe defaults | startup / test harness | 默认值本身也必须通过校验 |
| config file | 是,中间层 | runtime profile、store / adapter / target refs、boundary limits、job defaults、feature enablement | startup / test harness | Step 6 若拆分多文件,仍视为一个普通来源层 |
| environment variables | 是,最高普通层 | selected profile、selected config source、ordinary scalar override、safe ref override | startup / current entry selector | 存在但非法时 fail-fast / reject |
| secret / credential / target refs | 否,普通层中的值类型 | secret ref、credential ref、handoff target ref、endpoint ref | startup / job-run-start | 不是独立优先级层;只作为 ordinary value 的一种类型 |
| entry-local parameters | 否 | profile selector、config source selector、current output root、dry-run diagnostic selector | 当前 entry | 不覆盖全局冻结配置 |
| job-local typed input | 否 | current scope、batch override、target selector、report root | 当前 job run | 只影响当前 job-run-start |
| test fixture / deterministic override | 否 | fake adapter fixture、fixed clock / id、fixture source、seeded data | test harness | 只在 local / CI / deterministic test profile 生效 |
| config center | 否,P0 unsupported | future remote config source | 不适用 | P1/P2 才可讨论 |
| admin override | 否,P0 unsupported | future audited operator override | 不适用 | P1/P2 才可讨论 |

### 8.2 来源生效与冻结边界表

| 生效窗口 | 可参与来源 | 冻结规则 | 典型失败处理 |
|---|---|---|---|
| startup / cold start | defaults、config file、env、ordinary refs | runtime builder 完成后冻结 | startup fail-fast |
| current entry selection | frozen runtime + entry-local selector | 只影响当前 entry,不改 runtime frozen fields | 当前 entry reject |
| current job-run-start | frozen runtime + job-local typed input + allowed refs | 在 job run 开始时冻结写入 metadata / report context | 当前 job reject / invalid input |
| test harness build | test defaults、test config file、test env、fixture override | 仅在 test runtime 内冻结 | test fail-fast |
| runtime hot override | P0 unsupported | 不存在 | unsupported source |

### 8.3 冲突处理表

| 冲突场景 | 处理规则 | 结果 |
|---|---|---|
| 同一 key 在 defaults / file / env 同时出现 | 高优先级覆盖低优先级 | 继续 |
| 高优先级值存在但类型 / 格式 / 范围非法 | 不回退低优先级 | startup fail-fast / entry reject / job reject |
| 单个 config file 内重复 key | 视为配置歧义 | fail-fast |
| 同一语义出现多个 alias key | 视为配置歧义 | fail-fast |
| env 中同时出现同义旧名 / 新名 | 视为配置歧义,留给 Step 13 定义迁移期规则 | fail-fast |
| startup 必填配置缺失 | 不得启动半配置 runtime | startup fail-fast |
| 当前 entry 必填 selector / parameter 缺失 | 不读取隐式默认覆盖 | 当前 entry reject |
| 当前 job 必填 local input 缺失 | 不启动不完整 job run | 当前 job reject |
| ordinary source 提供 raw secret / password / token / certificate body | 违反敏感配置边界 | fail-fast |
| ordinary source 提供 external payload body / raw response body / forbidden body allowlist | 违反 body-free / security 边界 | fail-fast |
| feature enabled 但缺少必要 target / topic binding / adapter ref | 视为不完整配置 | startup fail-fast 或当前 job reject |
| feature disabled 但提供了可用 target ref | 允许存在但当前不启用 | 继续,后续可记 warning |
| job-local input 试图覆盖 truth store / topic schema / idempotency invariant | 视为越权 | 当前 job reject |
| entry-local selector 试图覆盖全局 frozen field | 视为越权 | 当前 entry reject |
| config center / admin override / hot override in P0 | unsupported source | fail-fast |
| test fixture 出现在 production-like profile | profile 不合法 | fail-fast |
| retention / timeout / batch 之间 cross-field 不成立 | 视为配置不一致 | fail-fast / reject |

### 8.4 按配置域组织的来源覆盖表

| 配置域 | 允许来源 | 禁止来源 | 优先级 / 作用范围 | 不可用策略 |
|---|---|---|---|---|
| runtime profile selection | defaults、config file、env、entry-local selector、test fixture in test profile | config center P0、admin override P0、job-local override of global profile semantics | current entry selector > env > file > default,但只选择当前 runtime / entry | invalid / unknown profile fail-fast |
| runtime config identity | validated file/env selection、generated digest / issue refs | raw config body、raw secret body、domain layer read | 由 `infra::config` 在 load 后生成,不参与外部覆盖 | validation issue blocks startup |
| adapter availability registry | defaults、config file、env、test fixture in test profile | production fake injection、entry-local force enable core-missing adapter | env > file > default;fixture only test | required adapter missing -> fail-fast;optional adapter explicit disabled |
| truth store binding | defaults、config file、env-provided store ref | job-local / entry-local store rewrite、hot override | env > file > default | missing selected store -> fail-fast |
| projection store binding | defaults、config file、env ref | query-time store rewrite | env > file > default | required read surface missing -> fail-fast or degraded only if Step 4 marked optional |
| reference / mirror store binding | defaults、config file、env ref | external body source injection | env > file > default | missing selected store -> fail-fast |
| relay store binding | defaults、config file、env ref | publisher current-truth reconstruction override | env > file > default | missing selected store -> fail-fast |
| idempotency / result store binding | defaults、config file、env ref | disable replay override、job-local retention invariant rewrite | env > file > default | missing selected store -> fail-fast |
| boundary limits | defaults、config file、env,少量 entry-local read selector where Step 4 allows | authorization override、visibility override、metadata override | env > file > default;entry-local only for current request-local read constraints | invalid limit -> fail-fast / current entry reject |
| source resolver family binding | defaults、config file、env refs、credential refs、test fixture | raw sibling body import、non-core Cargo dependency injection | env > file > default;fixture only test | unavailable -> delayed / rejected / failed reference per flow |
| inbound consumer binding | defaults、config file、env、test fixture source | command emulation source、raw external body | env > file > default | unsupported schema / missing dedup config -> reject consumer event |
| publisher adapter binding | defaults、config file、env refs、credential refs、test fixture publisher | raw bus secret、event schema override | env > file > default | unavailable -> relay retry / failed marker |
| transport topic binding | defaults、config file、env ordinary binding value | topic change as event semantic rewrite、job-local override | env > file > default | missing binding for enabled event -> fail-fast |
| job runner binding | defaults、config file、env、job-local typed input where allowed | runtime-global mutation by current job | current job local fields > env > file > default within allowed runner fields | invalid runner config -> current job reject |
| projection rebuild binding | defaults、config file、env、job-local scope / batch input | truth repair override | current job local fields > env > file > default | invalid scope -> current job reject |
| reference refresh binding | defaults、config file、env、job-local scope / batch input、resolver refs | external body override | current job local fields > env > file > default | unresolved / unavailable refs -> failed marker / partial report |
| reconciliation binding | defaults、config file、env、job-local scope | truth auto-fix source | current job local fields > env > file > default | report issue only,not truth repair |
| archive handoff binding | defaults、config file、env refs、target refs、job-local current target selector | archive body injection、accepted-truth gating | current target selector > env > file > default where allowed | unavailable target -> failed marker / current job reject if job explicitly requested it |
| observability handoff binding | defaults、config file、env refs、target refs、job-local selector | observability body injection | current target selector > env > file > default where allowed | unavailable target -> failed marker / degraded observability handoff |
| sync handoff binding | defaults、config file、env refs、target refs、job-local selector | private sync truth override | current target selector > env > file > default where allowed | unavailable target -> failed marker / current job reject if explicitly requested |
| redaction / safe output binding | defaults、config file、env safe selector | hot relax、body allowlist、test fixture in production | env > file > default | unsafe rule -> fail-fast |
| clock / id adapter binding | defaults、config file、env、test fixture | handler-generated id source、job-local clock rewrite | env > file > default;fixture only test | unavailable -> fail before mutation |
| test fake profile binding | test defaults、test config file、test env、fixture override | production-like source reuse | fixture > test env > test file > test default inside harness | fixture missing / invalid -> test fail-fast |
| environment profile binding | defaults、config file、env、entry-local profile selector | admin override P0、fixture in production-like | current entry selector > env > file > default | unsupported profile combination -> fail-fast |

### 8.5 来源优先级停审记录

| 配置域 / 来源 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| ordinary sources | 是否存在唯一主优先级 | 通过 | `defaults < file < env` |
| entry-local / job-local | 是否越权覆盖全局 frozen fields | 通过 | 仅允许 selector / current-run local fields |
| sensitive refs | raw material 是否混入 ordinary chain | 通过 | ordinary chain 只承载 ref / ordinary value |
| test fixture | 是否污染 production-like profile | 通过 | fixture 仅 test harness |
| unsupported sources | P0 是否错误启用 remote override | 通过 | config center / admin override / hot override 均 unsupported |
| store / topic / idempotency | job-local 是否误改 invariant | 通过 | invariant 不允许 job-local 覆盖 |
| handoff / publication | feature enabled 缺 target / binding 是否可判定 | 通过 | 缺失即 fail-fast 或 current job reject |
| redaction | 是否允许通过 env 放宽安全边界 | 通过 | unsafe rule reject |
| profile selection | 是否只选择既有闭口组合 | 通过 | 不新增 runtime contract |

### 8.6 跨来源冲突审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否存在 raw secret 通过 ordinary file / env 注入 | 无 | 只允许 secret / credential ref |
| 高优先级非法值是否会静默回退 | 无 | 一律 fail-fast / reject |
| entry-local / job-local 是否会覆盖 frozen runtime | 无 | 仅影响当前 entry / current job local window |
| test fixture 是否会进入 production-like profile | 无 | profile validation reject |
| config center / admin override 是否被误当 P0 来源 | 无 | P0 unsupported |
| 是否存在同一配置域多套不同优先级语义 | 无 | 逐域矩阵已统一 |
| 是否把 forbidden boundary 当作 ordinary value | 无 | forbidden boundary 不接受任何来源覆盖 |
| 是否需要回写 `03` | 未发现 | 当前只收口来源语义,不新增 runtime loader / builder contract |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 普通来源优先级固定为 `code defaults < config file < environment variables` | 否 | 配置来源语义 | 不适用 | 无回写 |
| secret / credential / target 配置只以 ref / selector 进入普通来源链 | 否 | 安全配置语义 | 不适用 | 无回写 |
| entry-local 和 job-local 只影响当前窗口,不覆盖全局 frozen runtime | 否 | 配置来源边界 | 不适用 | 无回写 |
| P0 不支持 config center / admin override / runtime hot override | 否 | 范围裁剪 | 不适用 | 无回写 |
| 若未来需要 remote config、admin override 或 hot reload | 是 | runtime loader、validator、audit、rollback、builder contract 变更 | `03` §13 / Step 14 | 阻塞待确认 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_05_sources_priority_conflicts.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“配置来源分层表”“来源生效与冻结边界表”“冲突处理表”“按配置域组织的来源覆盖表”“来源优先级停审记录”和“跨来源冲突审计表”小节,了解配置来源规则如何从 Step 3 / Step 4 / Step 14 收敛。

正式 `04-配置设计.md` §5 应回填:

- 配置来源分层表。
- 来源生效与冻结边界表。
- 冲突处理表。
- 按配置域组织的来源覆盖表。
- 来源优先级停审记录。
- 跨来源冲突审计表。
- 对详细设计的影响判定。

回填要求:

- 不得写具体 key 名、env var 名、JSON schema、secret provider API 或部署命令。
- 不得允许高优先级非法值回退低优先级。
- 不得让 ordinary file / env 提供 raw secret、external payload body 或 forbidden body allowlist。
- 不得把 config center / admin override / hot override 写成 P0 能力。
- 不得让 entry-local / job-local 输入覆盖 truth store、state invariant、topic schema、idempotency invariant 或其他禁止配置化边界。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| Step 6 中 profile 是否采用单文件、多文件或 profile layered file | 影响 config file 内部合并,但不影响三层主优先级 | Step 6 闭口 |
| 未来是否需要 remote config / admin override | 影响 runtime loader / audit / rollback | Step 13 / 14 记录演进风险 |
| entry-local / job-local 的正式 transport 形态 | 影响 API / worker / jobs 的输入示例 | Step 7 / 9 定义语义,必要时回写 `03` |
| ordinary value 中哪些 endpoint / route literal 需要进一步 redaction / ref 化 | 影响 Step 8 敏感配置边界 | Step 8 继续细化 |
| disabled feature + configured target 是否输出 warning / audit event | 影响 Step 10 变更审计和 Step 11 失效策略 | Step 10 / 11 再定 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 普通配置来源优先级已明确 | 通过 | `defaults < file < env` |
| 特殊来源边界已明确 | 通过 | refs、entry-local、job-local、fixture、unsupported source 已分离 |
| 冲突处理可判定 | 通过 | 高优先级非法值 fail-fast / reject |
| 每个配置域允许 / 禁止来源已明确 | 通过 | 见 §8.4 |
| 来源优先级已停审 | 通过 | 见 §8.5 |
| 跨来源冲突审计无 unresolved 冲突 | 通过 | 见 §8.6 |
| 对 `03` 的影响判定已记录 | 通过 | 当前无回写 |
| 可进入 Step 6 | 通过 | 下一步定义环境、部署 profile 与配置矩阵 |
