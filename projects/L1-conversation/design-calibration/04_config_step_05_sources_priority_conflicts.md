# Step 5. 定义配置来源、优先级与冲突处理

> 本文件是 `projects/L1-conversation/04-配置设计.md` 的 Step 5 中间产物。
> 本步定义配置来源覆盖链、冲突处理和不可用策略。
> 本步不定义完整配置项清单,不定义环境矩阵,不写 JSON 示例,不回写 `03-详细设计.md`。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 5
- 回填章节: `projects/L1-conversation/04-配置设计.md` §5 配置来源、优先级与冲突处理

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_03_control_plane_overview.md` | 已确认 P0 来源链、runtime builder 装配入口和模块读取边界 | 固定来源类别和普通覆盖方向 |
| `04_config_step_04_classification_boundaries.md` | 已确认配置分类、P0 冷更新和禁止配置化项 | 判断哪些来源可以覆盖哪些类别,哪些冲突必须 fail-fast |
| `03-详细设计.md` §13 | 已确认 `infra`、`api`、`worker`、`jobs` 的配置读取边界 | 确认本步只定义配置规则,不改变代码契约 |
| `03-详细设计.md` §14.4 | 已确认日志、指标、审计、diagnostic 和 trace attribute 禁止字段 | 确认 raw secret、forbidden body 和 private profile 不得经配置进入证据 |

已确认结论:

```text
P0 普通配置来源覆盖顺序为:
code defaults < JSON config file < environment variables

entry local args 不是全局普通配置来源,只作为 config source selector 或单次 job / command 的局部输入。
secret / credential ref 可以作为普通配置值出现,但真实 secret material 和 raw token 不参与普通覆盖链,也不得写入任何普通来源。
config center 和 admin override 不进入 P0,仅作为 P1/P2 演进能力。
```

## 3. SOP 问题回答

### 3.1 code default、file、env、secret、config center、admin override 的优先级是什么?

| 来源 | 优先级 | 适用配置 | 冲突处理 | 不可用时策略 |
|---|---|---|---|---|
| code defaults | 1,最低 | local / CI default path、in-memory store、fake publisher、fake resolver、fake handoff、safe retry、strict redaction | 被更高普通来源覆盖 | 默认值必须可构造;不可构造是实现错误 |
| JSON config file | 2 | 启动配置、运行装配、入口、job、retention、projection、reports、ref-only sensitive config | 覆盖 defaults;同文件重复 key 或等价别名 fail-fast | 未指定文件可用 defaults;指定文件不可读 / 解析失败 fail-fast |
| environment variables | 3,最高普通来源 | profile、路径、CI / local override、endpoint ref、batch、timeout、有限诊断配置 | 覆盖 file 和 defaults;非法值 fail-fast,不回退 | 缺失则使用低优先级;存在但非法 fail-fast |
| entry local args | 局部入口参数 | config path、runtime profile selector、job run id、job scope、dry-run / diagnostic flag | 不作为全局覆盖层;局部参数非法则该入口 fail-fast | 缺失则使用已加载配置或命令默认 |
| secret / credential refs | 引用值可由普通来源提供 | `SecretRef`、`CredentialRef`、endpoint credential ref | 普通来源只能提供引用,不能提供 raw secret | ref 格式非法 fail-fast;引用解析不可用 fail-closed 或 explicit degraded |
| config center | P1/P2 | future remote config provider | P0 中启用视为 unsupported profile | 当前不可用不影响 P0 |
| admin override | P1/P2 | future audited emergency override | P0 中启用视为 unsupported profile | 当前不可用不影响 P0 |

### 3.2 同名配置多处出现时如何冲突处理?

普通配置同名出现在不同优先级来源时,高优先级覆盖低优先级。覆盖只有在高优先级值类型正确、值合法、未违反禁止配置化边界时成立。

处理规则:

- 不同普通来源定义同一 key: 高优先级覆盖低优先级。
- 同一 JSON 文件内重复 key: fail-fast。
- 同一来源内出现等价别名 key: fail-fast。
- 高优先级值类型错误、路径不可达、profile 不支持: fail-fast,不得回退低优先级。
- 高优先级值违反禁止配置化边界: fail-fast,不得回退低优先级。
- P0 配置启用 config center 或 admin override: unsupported profile,fail-fast。
- entry local args 只作用于当前入口或当前 job,不得覆盖全局禁止项。

### 3.3 必填项缺失时是否阻断启动?

| 缺失类型 | 处理 |
|---|---|
| 有安全默认值的 P0 default path 配置缺失 | 使用 code defaults,再执行 validator 校验 |
| `ConversationRuntimeConfig` 必需结构缺失且无默认值 | 阻断启动 |
| production-like adapter profile 所需 endpoint ref / credential ref 缺失 | 阻断该 adapter 或 runtime 启动;不得自动降级成 fake 并伪装成功 |
| P0 in-memory / fake profile 未提供 secret ref | 不阻断,因为该 profile 不需要真实 secret |
| outbox publisher、handoff、resolver、event source profile 与依赖字段不匹配 | 阻断 runtime、worker 或 job 启动 |
| operations job 局部参数缺失 | 阻断该 job,不影响其他 runtime |
| report root 缺失 | 使用 P0 默认 `reports/`;如果指定路径不可写则该 run fail-fast |

关键原则:

```text
缺失值不能被静默解释为“关闭安全门禁”“禁用授权视野”“切换到 fake 成功”或“自动修复 truth”。
```

### 3.4 配置中心或密钥系统不可用时如何处理?

P0 不依赖 config center,因此 config center 不可用不影响 P0。

如果某个 configured adapter 需要解析 secret ref、credential ref 或 endpoint ref:

- ref 格式非法: 配置校验阶段 fail-fast。
- provider 不可用: adapter 启动 fail-closed,或在明确支持 degraded 的 resolver 场景写 unresolved marker。
- 不允许回退到 raw secret。
- 不允许自动切换到 fake adapter 并把结果标记为 production success。
- 不允许把 provider 不可用解释为来源 truth 不存在。

### 3.5 哪些来源不能覆盖敏感配置?

| 来源 | 能否覆盖敏感配置 | 规则 |
|---|---|---|
| code defaults | 否 | 不能包含 raw secret;只能提供 strict redaction 和 ref-only 策略默认 |
| JSON config file | 只能提供 ref | 可以提供 `SecretRef` / `CredentialRef`,不能写 raw secret |
| environment variables | 只能提供 ref 或 profile | 不能提供 raw secret;不能关闭 redaction 或 forbidden body check |
| entry local args | 只能提供局部 ref / profile / run id | 不能提供 raw secret;不能覆盖禁配项 |
| config center / admin override | P0 不适用 | 后续若引入,也必须只提供 ref 或受审计 provider binding |

敏感配置的真实值不得出现在普通配置文件、环境变量、CLI、日志、错误返回、审计正文、测试报告、reports、artifacts 或 design-calibration 中。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `04_config_step_03_control_plane_overview.md` | 只有来源链图,未定义覆盖优先级和冲突处理 | 实现者可能自行决定 file / env / CLI 的覆盖规则 |
| `04_config_step_04_classification_boundaries.md` | 已定义冷更新和禁止项,但未说明冲突时如何处理 | 禁止项可能被高优先级来源覆盖 |
| `03-详细设计.md` §13 | 已定义读取模块,但不写来源优先级 | 需要由 `04` 明确 loader / validator 可执行规则 |
| 当前旧 `05/06` | 未按来源冲突、非法 env、secret ref 不可用设计测试和验收 | 后续测试验收需要承接本步 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 普通来源优先级 | 只有来源链方向 | `code defaults < JSON config file < environment variables` | 让 loader、validator 和测试可判定 |
| entry local args | 容易被理解为全局最高优先级 | 限定为 config source selector 或 job / command 局部输入 | 避免不同入口绕过统一配置语义 |
| secret / credential ref | 只说不保存 raw secret | 明确普通来源只能提供 ref,secret material 不进入覆盖链 | 防止 raw secret 进入文件、env 或 CLI |
| 高优先级非法值 | 未定义是否回退 | fail-fast,不得回退低优先级 | 防止错误配置被静默掩盖 |
| config center / admin override | 未进入 P0 来源链 | 明确 P1/P2,当前 unsupported | 避免 P0 变成远程配置系统 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: env 作为最高普通优先级 | 适合 CI / local / staging override,实现简单 | 需要严格校验防止非法 env 回退 | 采用 |
| 方案 B: entry local args 作为全局最高优先级 | 一次性覆盖方便 | 容易绕过配置文件、env 和安全审计;不同入口语义漂移 | 不采用 |
| 方案 C: 高优先级非法值回退低优先级 | 可用性较高 | 隐藏错误,测试和验收不可判定 | 不采用 |
| 方案 D: P0 引入 config center / admin override | 长期治理完整 | 需要权限、审计、reload、回滚和一致性专项 | 不采用 |

推荐方案: 方案 A 的普通来源链 + entry local args 局部输入限制。

原因:

- JSON 文件适合表达完整 profile,env 适合 CI / local 覆盖。
- entry local args 对 job run 有价值,但不应成为全局覆盖层。
- fail-fast 比静默回退更符合配置可审计和验收可判定的目标。

## 7. 结构化中间产物

### 7.1 配置来源优先级表

| 来源 | 优先级 | 适用配置 | 冲突处理 | 不可用时策略 |
|---|---|---|---|---|
| code defaults | 1,最低 | local / CI default path、in-memory store、fake adapters、safe retry、strict redaction | 被更高普通来源覆盖 | 默认值必须可构造 |
| JSON config file | 2 | 启动、运行装配、入口、job、retention、projection、reports、ref-only sensitive config | 覆盖 defaults;重复 key fail-fast | 未指定可用 defaults;指定文件不可读 / 解析失败 fail-fast |
| environment variables | 3,最高普通来源 | CI / local override、profile、路径、endpoint ref、batch、timeout、有限诊断配置 | 覆盖 file / defaults;非法值 fail-fast | 缺失用低优先级;存在但非法 fail-fast |
| entry local args | 局部入口参数 | config path、runtime profile selector、job run id、job scope、dry-run / diagnostic | 不覆盖全局配置;局部非法 fail-fast | 缺失使用已加载配置或命令默认 |
| secret / credential refs | 引用值可由普通来源提供 | sensitive reference、credential ref、endpoint credential ref | 普通来源只能提供引用,不能提供 raw secret | ref 格式非法 fail-fast;解析不可用 fail-closed 或 explicit degraded |
| config center | P1/P2 | future remote config source | P0 启用视为 unsupported profile | 当前不可用不影响 P0 |
| admin override | P1/P2 | future audited override | P0 启用视为 unsupported profile | 当前不可用不影响 P0 |

### 7.2 冲突处理表

| 冲突场景 | 处理规则 | 是否阻断启动 / 操作 |
|---|---|---|
| 同一 key 出现在不同普通来源 | 高优先级覆盖低优先级 | 否,除非高优先级值非法 |
| 同一 JSON 文件内重复 key | 视为配置文件错误 | 是 |
| 同一来源出现等价别名 key | 视为歧义配置 | 是 |
| 高优先级值类型错误 | fail-fast,不回退低优先级 | 是 |
| 高优先级 profile 不支持当前 P0 | fail-fast | 是 |
| 高优先级路径不存在或不可访问 | fail-fast,不回退低优先级 | 是 |
| 必填配置无默认值且所有来源缺失 | fail-fast | 是 |
| 有默认值的 P0 default path 配置未显式设置 | 使用 defaults,再执行 validator 校验 | 取决于校验结果 |
| 普通配置源提供 raw secret / raw token | 拒绝配置 | 是 |
| 普通配置源提供 secret ref / credential ref | 允许作为引用 | ref 格式非法阻断;解析不可用 fail-closed |
| 配置试图关闭 forbidden boundary、visibility guard 或 redaction | 拒绝配置,进入设计变更流程 | 是 |
| P0 配置启用 config center / admin override | unsupported profile | 是 |
| entry local args 试图覆盖全局禁止项 | 拒绝命令 | 是 |

### 7.3 来源优先级图

#### 配置来源链图: L1-conversation 配置优先级链

```text
ordinary config values

[code defaults]
  < [JSON config file]
  < [environment variables]

[entry local args]
  -> select config source or provide run-local parameters
  -> cannot override forbidden boundaries

[secret / credential material]
  -> ordinary sources provide refs only
  -> raw secret is never an allowed config value
```

关键说明:

- 普通配置值只有三层覆盖顺序。
- entry local args 不是全局最高优先级,只影响当前入口或当前 job。
- secret / credential material 不进入普通覆盖链,普通来源最多提供引用。
- config center / admin override 不进入 P0 覆盖链。

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 定义 `code defaults < JSON config file < environment variables` 的普通来源优先级 | 否 | 配置设计规则 | 无 | 无回写 |
| entry local args 仅作为 config source selector 或入口 / job 局部输入 | 否 | 来源边界规则,不改变 handler / job 签名 | 无 | 无回写 |
| secret / credential material 不进入普通覆盖链,raw secret 不进入普通来源 | 否 | 安全配置规则 | 无 | 无回写 |
| config center / admin override 属于 P1/P2,不进入 P0 | 否 | 范围裁剪 | 无 | 无回写 |
| 高优先级非法值 fail-fast,不回退低优先级 | 否 | 配置加载失败策略 | 无 | 无回写 |

说明:

```text
本步没有新增 `ConversationRuntimeConfig` 字段、`ConfigError` 枚举值或 adapter constructor 参数。
Step 9 会继续展开配置加载、校验和生效机制;如届时发现错误模型不足,再进入详细设计回写清单。
```

## 9. 回填草稿

正式 `04-配置设计.md` §5 建议采用以下结构:

```text
5. 配置来源、优先级与冲突处理
  5.1 配置来源优先级表
  5.2 冲突处理表
  5.3 来源优先级图
  5.4 不可用策略
  5.5 对 03-详细设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §5.1 | `design-calibration/04_config_step_05_sources_priority_conflicts.md` §7.1 |
| §5.2 | `design-calibration/04_config_step_05_sources_priority_conflicts.md` §7.2 |
| §5.3 | `design-calibration/04_config_step_05_sources_priority_conflicts.md` §7.3 |
| §5.4 | `design-calibration/04_config_step_05_sources_priority_conflicts.md` §3.3 / §3.4 / §3.5 |
| §5.5 | `design-calibration/04_config_step_05_sources_priority_conflicts.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 6 的待确认事项。

后续 Step 必须继续收口:

- Step 6 按本步来源链定义 local / CI / staging / prod-like profile。
- Step 7 按来源优先级为每个配置项标注默认值、来源、作用域、生效方式和失败策略。
- Step 8 明确 `SecretRef` / `CredentialRef` 字段形态、轮换和审计要求。
- Step 9 明确 loader 如何检测重复 key、非法 env、unsupported profile 和 raw secret。

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 来源优先级已形成 | 通过 | §7.1 |
| 冲突处理表已形成 | 通过 | §7.2 |
| secret / credential material 处理已形成 | 通过 | §3.5 / §7.3 |
| 对 03 影响已有判定 | 通过 | §8 当前无回写 |
| 可以进入 Step 6 | 通过 | 下一步定义环境、部署 profile 与配置矩阵 |
