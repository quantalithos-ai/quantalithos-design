# Step 5. 定义配置来源、优先级与冲突处理

> 本文件是 `projects/L0-bus/04-配置设计.md` 的 Step 5 中间产物。
> 本步定义配置来源覆盖链、冲突处理和不可用策略。
> 本步不定义完整配置项清单,不定义环境矩阵,不写 JSON 示例,不回写 `03-详细设计.md`。

---

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 5
- 回填章节：`projects/L0-bus/04-配置设计.md` §5 配置来源、优先级与冲突处理

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_03_control_plane_overview.md` | 已确认 P0 来源链为 code defaults、JSON config file、environment overrides、secret refs / connection refs,CLI args 只作 job 局部输入 | 固定来源类别和覆盖方向 |
| `04_config_step_04_classification_boundaries.md` | 已确认配置分类、P0 冷更新、禁止配置化项和调试配置边界 | 判断哪些来源可以覆盖哪些类别,哪些必须 fail-fast |
| `03-详细设计.md` §13 | 已确认 `ConfigLoader`、`ConfigValidator`、`RuntimeBuilder` 和禁止配置化边界 | 确认本步只定义配置设计规则,不改变代码契约 |
| `03_ddd_step_14_config_dependencies.md` | 已确认 secret ref、connection ref、in-memory default path 和 config error 方向 | 决定 raw secret 与敏感引用的处理方式 |

已确认结论:

```text
P0 普通配置来源覆盖顺序为:
code defaults < JSON config file < environment variables

CLI args 不是全局普通配置来源,只作为 operations job 局部输入或指定 config source 的入口参数。
secret refs / connection refs 不参与普通覆盖链;普通来源只能提供引用,不能提供 raw secret。
config center 和 admin override 不进入 P0,仅作为 P1/P2 演进能力。
```

---

## 3. SOP 问题回答

### 3.1 code default、file、env、secret、config center、admin override 的优先级是什么?

P0 普通配置只定义三层优先级：code defaults、JSON config file、environment variables。CLI args 只用于选择 config source 或为单次 operations job 提供局部参数,不作为全局配置覆盖层。

| 来源 | 优先级 | 适用配置 | 冲突处理 | 不可用时策略 |
|---|---|---|---|---|
| code defaults | 1,最低 | in-memory store / backend / publisher、ref-only security boundary、保守 retry 默认、deterministic test fallback | 被更高优先级普通来源覆盖 | 默认值必须可构造;不可构造是实现错误 |
| JSON config file | 2 | P0 启动配置、运行参数、adapter profile、policy ref、secret ref、connection ref | 覆盖 defaults;同一文件重复 key 或等价别名 fail-fast | 文件未提供时可使用 defaults;指定文件不可读 / 解析失败 fail-fast |
| environment variables | 3,最高普通来源 | profile、路径、启用项、CI / local override、有限 diagnostic override | 覆盖 file 和 defaults;非法值 fail-fast,不回退 | 缺失时继续使用低优先级;存在但非法 fail-fast |
| CLI args | 局部入口参数 | config file path、operations job run id、job profile、dry-run / diagnostic | 不作为全局配置覆盖层;局部参数非法则该命令 fail-fast | 缺失时使用已加载配置或命令默认 |
| secret refs / connection refs | 不参与普通优先级 | 敏感引用、credential ref、connection ref、future backend / publisher credential ref | 普通来源只能提供引用,不能提供 raw secret | ref 格式非法 fail-fast;解析不可用时 fail-closed |
| config center | P1/P2 | future remote config provider | 当前不参与 P0 冲突处理 | 当前不可用不影响 P0 |
| admin override | P1/P2 | future audited emergency override | 当前不参与 P0 冲突处理 | 当前不可用不影响 P0 |

### 3.2 同名配置多处出现时如何冲突处理?

普通配置同名出现在不同优先级来源时,高优先级覆盖低优先级。但该覆盖只在值合法、类型正确、没有违反禁止配置化边界时成立。

处理规则：

- 不同优先级普通来源定义同一 key：高优先级覆盖低优先级。
- 同一来源内重复 key：fail-fast。
- 同一来源内出现等价别名 key：fail-fast。
- 高优先级值类型错误：fail-fast,不得回退低优先级。
- 高优先级值违反禁止配置化边界：fail-fast,不得回退低优先级。
- 高优先级值引用不存在路径或非法 profile：fail-fast。
- P0 配置中启用 config center 或 admin override：fail-fast 或 unsupported profile。

### 3.3 必填项缺失时是否阻断启动?

是否阻断取决于配置类别和是否有安全默认值。

| 缺失类型 | 处理 |
|---|---|
| 有安全默认值的 P0 default path 配置缺失 | 使用 code defaults,再执行 validator 校验 |
| `RuntimeConfig` 必需结构缺失且无默认值 | 阻断启动 |
| production adapter profile 所需 connection ref / secret ref 缺失 | 阻断该 adapter 启动;不得自动降级到 in-memory 并伪装成功 |
| P0 in-memory profile 未提供 secret ref | 不阻断,因为该 profile 不需要真实 secret |
| outbox source / backend / publisher / projection profile 与依赖字段不匹配 | 阻断启动或 job 启动 |
| operations job 局部参数缺失 | 阻断该 job,不影响其他 runtime |

关键原则：缺失值不能被静默解释为“禁用安全门禁”或“切回 in-memory”。凡是会影响安全、审计、truth、adapter 语义或 job cursor 的必填项缺失,必须 fail-fast。

### 3.4 配置中心或密钥系统不可用时如何处理?

P0 不依赖 config center,因此 config center 不可用不影响 P0。

P0 对 secret 的要求是“只保存引用,不保存明文”。如果某个 adapter 需要解析 secret ref 或 connection ref：

- ref 格式非法：配置加载 / 校验阶段 fail-fast。
- ref 所指 provider 不可用：adapter 启动 fail-closed。
- 不允许自动回退到 raw secret。
- 不允许自动启用不需要 secret 的 adapter profile 来伪装成功,除非该 profile 是显式配置的目标 profile。

P1/P2 如果引入 config center、remote reload、KMS / Vault 或 admin override,必须单独设计权限、审计、回滚、不可用策略和 reload 一致性。

### 3.5 哪些来源不能覆盖敏感配置?

| 来源 | 能否覆盖敏感配置 | 规则 |
|---|---|---|
| code defaults | 否 | 不能包含 raw secret;只能包含 ref-only 默认策略 |
| JSON config file | 只能提供 ref | 可以提供 `SecretRef` / `ConnectionRef`,不能写 raw secret |
| environment variables | 只能提供 ref 或 profile | 不能提供 raw secret;不能关闭 redaction |
| CLI args | 只能提供 job 局部 ref / profile | 不能提供 raw secret;不能关闭 secret 校验 |
| config center / admin override | P0 不适用 | 后续若引入,也必须只提供 ref 或受审计的 provider binding |

敏感配置的真实值不得出现在普通配置文件、环境变量、CLI、日志、错误返回、审计正文、测试报告或 design-calibration 中。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `04_config_step_03_control_plane_overview.md` | 只有来源链图,未定义覆盖优先级和冲突处理 | 实现者可能自行决定 file / env / CLI 谁覆盖谁 |
| `04_config_step_04_classification_boundaries.md` | 已定义冷更新和禁止项,但未说明冲突时如何处理 | 禁止项可能被高优先级来源覆盖 |
| `03-详细设计.md` §13 | 已定义 `ConfigLoader` / `ConfigValidator`,但不写来源规则 | 需要由 04 明确来源优先级,避免实现脑补 |
| 当前旧 `05/06` | 未按来源冲突、非法 env、secret ref 不可用设计测试和验收 | 后续测试验收需要承接本步 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 普通来源优先级 | 只有来源链方向 | `code defaults < JSON config file < environment variables` | 让 loader / validator / 测试可判定 |
| CLI args | 容易被理解为全局最高优先级 | 限定为 config source selector 或 operations job 局部参数 | 避免命令行绕过全局配置和安全边界 |
| secret ref | 只说不保存 raw secret | 明确 secret refs / connection refs 不参与普通覆盖链 | 防止 file / env / CLI 写入 raw secret |
| 高优先级非法值 | 未定义是否回退 | fail-fast,不得回退低优先级 | 防止错误配置被静默掩盖 |
| config center / admin override | 未进入 P0 来源链 | 明确 P1/P2,当前 unsupported | 避免 P0 变成远程配置系统 |

---

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：env 最高普通优先级 | 适合 CI / local / staging override,实现简单 | 需要严格校验防止非法 env 回退 | 采用 |
| 方案 B：CLI flags 作为全局最高优先级 | 便于一次性覆盖 | 容易绕过 config file、env 和安全审计;不同 binary 语义漂移 | 不采用,只允许 job 局部输入 |
| 方案 C：高优先级非法值回退低优先级 | 可用性高 | 隐藏错误,测试和验收不可判定 | 不采用 |
| 方案 D：P0 引入 config center / admin override | 长期治理完整 | 需要权限、审计、reload、回滚和一致性专项,超出 P0 | 不采用 |

推荐方案：方案 A 的普通来源链 + CLI 局部输入限制。

原因：

- JSON 文件适合表达完整 profile,env 适合 CI / local 覆盖。
- CLI flags 对 operations job 有价值,但不应成为全局覆盖层。
- fail-fast 比静默回退更符合配置可审计和验收可判定的目标。

---

## 7. 结构化中间产物

### 7.1 配置来源优先级表

| 来源 | 优先级 | 适用配置 | 冲突处理 | 不可用时策略 |
|---|---|---|---|---|
| code defaults | 1,最低 | in-memory default path、ref-only security boundary、保守 retry 默认 | 被更高普通来源覆盖 | 默认值必须可构造 |
| JSON config file | 2 | 启动配置、运行参数、adapter profile、policy ref、secret ref、connection ref | 覆盖 defaults;同文件重复 key fail-fast | 未指定可用 defaults;指定文件不可读 / 解析失败 fail-fast |
| environment variables | 3,最高普通来源 | CI / local override、profile override、路径 override、有限 diagnostic override | 覆盖 file / defaults;非法值 fail-fast | 缺失则使用低优先级;存在但非法 fail-fast |
| CLI args | 局部入口参数 | config file path、operations job run id、job profile、dry-run / diagnostic | 不覆盖全局配置;局部非法 fail-fast | 缺失则使用已加载配置或命令默认 |
| secret refs / connection refs | 不参与普通优先级 | sensitive reference、credential ref、connection ref | 普通来源只能提供引用,不能提供 raw secret | ref 格式非法 fail-fast;解析不可用 fail-closed |
| config center | P1/P2 | future remote config source | P0 中启用视为 unsupported profile | 当前不可用不影响 P0 |
| admin override | P1/P2 | future audited override | P0 中启用视为 unsupported profile | 当前不可用不影响 P0 |

### 7.2 冲突处理表

| 冲突场景 | 处理规则 | 是否阻断启动 / 操作 |
|---|---|---|
| 同一 key 出现在不同普通来源 | 高优先级覆盖低优先级 | 否,除非高优先级值非法 |
| 同一 JSON config file 内重复 key | 视为配置文件错误 | 是 |
| 同一来源出现两个等价别名 key | 视为歧义配置 | 是 |
| 高优先级值类型错误 | fail-fast,不回退低优先级 | 是 |
| 高优先级 profile 不支持当前 P0 | fail-fast | 是 |
| 高优先级路径不存在或不可访问 | fail-fast,不回退低优先级 | 是 |
| 必填配置无默认值且所有来源缺失 | fail-fast | 是 |
| 有默认值的 P0 default path 配置未显式设置 | 使用 defaults,再执行 validator 校验 | 取决于校验结果 |
| 普通配置源提供 raw secret | 拒绝配置 | 是 |
| 普通配置源提供 secret ref / connection ref | 允许作为引用 | ref 格式非法阻断;解析不可用 fail-closed |
| 配置试图关闭 forbidden boundary | 拒绝配置,进入设计变更流程 | 是 |
| P0 配置启用 config center / admin override | unsupported profile | 是 |
| CLI args 试图覆盖全局禁止项 | 拒绝命令 | 是 |

### 7.3 来源到配置类别映射

| 配置类别 | 允许来源 | 禁止来源 / 禁止内容 |
|---|---|---|
| 启动配置 | defaults、JSON file、env | P0 config center / admin override |
| 运行参数配置 | defaults、JSON file、env、job 局部 CLI | CLI 全局覆盖、运行中热更新 |
| 策略引用配置 | JSON file、env | 覆盖领域不变量或 forbidden boundary |
| 敏感引用配置 | JSON file / env 中的 secret ref 或 connection ref | raw secret in defaults / file / env / CLI |
| 外部接缝配置 | defaults、JSON file、env | adapter 私自读取未校验配置源 |
| 测试 / fixture 配置 | defaults、JSON file、env、测试 fixture | 测试便利项作为生产默认值 |
| 诊断 / 调试配置 | defaults、JSON file、env、job 局部 CLI | 关闭 redaction、validator、audit、forbidden boundary |
| P1/P2 扩展配置 | 后续 config center / admin override 专项 | 进入 P0 正式配置项 |

### 7.4 来源优先级图

```text
ordinary config values

code defaults
  < JSON config file
  < environment variables

local command / operations job
  +-- may select config source
  +-- may pass job-local parameters
  +-- must not override forbidden boundaries

secret / connection material
  +-- ordinary sources provide refs only
  +-- raw secret is never an allowed config value
```

关键说明：

- 普通配置值有明确覆盖顺序。
- CLI 不是全局最高优先级,避免不同 binary 出现不同配置语义。
- secret / connection material 只通过 reference 表达,不进入普通覆盖链。
- config center / admin override 不进入 P0。

---

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 定义 `code defaults < JSON config file < environment variables` 的普通来源优先级 | 否 | 配置设计规则 | 无 | 无回写 |
| CLI args 仅作为 config source selector 或 operations job 局部输入 | 否 | 来源边界规则,不改变 handler / job 签名 | 无 | 无回写 |
| secret refs / connection refs 不参与普通覆盖链,raw secret 不进入普通来源 | 否 | 安全配置规则 | 无 | 无回写 |
| config center / admin override 属于 P1/P2,不进入 P0 | 否 | 范围裁剪 | 无 | 无回写 |
| 高优先级非法值 fail-fast,不回退低优先级 | 否 | 配置加载失败策略 | 无 | 无回写 |

说明：

- 本步没有新增 `RuntimeConfig` 字段、`ConfigError` 枚举值或 adapter constructor 参数。
- Step 9 会继续展开配置加载、校验和生效机制;如届时发现错误模型不足,再进入详细设计回写清单。

---

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §5。

````md
## 5. 配置来源、优先级与冲突处理

> 校准来源：
> - `design-calibration/04_config_step_05_sources_priority_conflicts.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“配置来源优先级表”“冲突处理表”“来源到配置类别映射”和“对详细设计的影响判定”小节，了解本章规则如何收敛。

P0 普通配置来源按以下顺序覆盖：

```text
code defaults < JSON config file < environment variables
```

CLI args 不作为全局普通配置覆盖层。CLI 只能用于选择 config source,或为单次 operations job 提供 run id、job profile、dry-run / diagnostic 等局部参数。局部参数不得覆盖 forbidden boundary。

高优先级来源覆盖低优先级来源,但高优先级值如果类型错误、路径非法、profile 不支持或违反禁止配置化边界,不得回退到低优先级值继续运行,必须 fail-fast。同一来源内重复 key 或等价别名 key 视为歧义配置,必须阻断启动或作业启动。

`secret refs` 和 `connection refs` 不参与普通覆盖链。普通配置来源最多提供引用,不得提供 raw secret。真实 secret material 不得写入普通配置文件、环境变量、CLI、日志、错误返回、审计正文、测试报告或中间产物。

config center 与 admin override 属于 P1/P2 演进能力,当前不参与 P0 覆盖链。P0 配置中启用这些来源应被视为 unsupported profile。

本章未发现需要回写 `03-详细设计.md` 的配置结论。
````

---

## 10. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| CLI args 是否作为全局最高优先级来源 | A. 是;B. 否,仅作为 config source selector 和 job 局部参数;C. 完全禁用 | 推荐 B | CLI 对 job 有价值,但作为全局覆盖层会绕开统一配置语义 |
| 高优先级非法值是否回退低优先级 | A. 回退;B. fail-fast;C. 仅 local 回退 | 推荐 B | 回退会掩盖错误配置,让测试和验收不可判定 |
| config center 是否进入 P0 | A. 进入;B. 不进入,P1/P2 后续专项;C. 只写占位字段 | 推荐 B | remote config 会改变 loader 生命周期、审计和回滚复杂度 |

---

## 11. 进入下一步条件

- [x] 来源优先级已明确。
- [x] CLI args 与普通配置覆盖链的关系已明确。
- [x] secret refs / connection refs 与普通覆盖链的关系已明确。
- [x] 冲突处理和 fail-fast 规则已明确。
- [x] 本步无需回写 `03-详细设计.md`。
- [x] Step 5 状态从 `[~]` 更新为 `[x]`。
