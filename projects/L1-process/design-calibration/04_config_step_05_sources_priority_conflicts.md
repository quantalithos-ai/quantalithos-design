# Step 5. 定义配置来源、优先级与冲突处理

> 本文件是 `projects/L1-process/04-配置设计.md` 的 Step 5 中间产物。
> 本步定义配置来源覆盖链、冲突处理和不可用策略。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 5
- 回填章节: `projects/L1-process/04-配置设计.md` §5 配置来源、优先级与冲突处理

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 3 配置来源链 | 定义覆盖顺序 | ordinary values 使用 defaults < JSON < env |
| Step 4 配置分类 | 区分普通值、局部参数和敏感引用 | entry args 不覆盖全局配置;secret material 不进入普通覆盖链 |
| `03_ddd_step_14_config_external_binding.md` validation rules | 定义 fail-fast / reject 行为 | 违反 Process boundary 的配置必须 reject |

## 3. SOP 问题回答

### 3.1 code default、file、env、secret、config center、admin override 的优先级是什么?

P0 普通配置值的优先级固定为:

```text
code defaults < JSON config file < environment variables
```

entry local args 只作为 config source selector 或当前入口 / 当前 job 的局部输入,不覆盖全局配置链。secret / credential material 不进入普通覆盖链,普通来源只能提供 ref。

### 3.2 同名配置多处出现时如何冲突处理?

不同普通来源的同名配置由高优先级覆盖低优先级。高优先级值一旦出现但类型、格式或范围非法,必须 fail-fast,不得回退低优先级。JSON 文件内重复 key 或同一语义出现别名 key,视为歧义配置并 fail-fast。

### 3.3 必填项缺失时是否阻断启动?

P0 默认配置必须能构造 fake / in-memory / deterministic path。若配置选择 configured adapter 或 durable adapter,该 adapter 所需 endpoint ref / credential ref / destination ref 缺失时 fail-fast。

### 3.4 配置中心或密钥系统不可用时如何处理?

P0 不启用配置中心。若配置声明 config center 或 admin override,按 unsupported profile fail-fast。secret provider 的真实解析属于 P1/P2;P0 只校验 ref 形态,configured adapter 在运行期解析失败时按 source unavailable / fail-closed / explicit degraded 处理,不得回退 fake success。

### 3.5 哪些来源不能覆盖敏感配置?

普通 JSON / env 只能提供 `CredentialRef`、`ExternalEndpointRef`、`HandoffDestinationRef` 等引用,不能提供 raw secret、raw token、password、private key、certificate body、provider response body 或外部正文。entry local args 也不能覆盖 forbidden boundary 或注入 raw secret。

## 4. 结构化中间产物

### 4.1 来源优先级表

| 来源 | 优先级 | 适用配置 | 冲突处理 | 不可用时策略 |
|---|---|---|---|---|
| code defaults | 1,最低 | local / CI default path、in-memory store、fake adapters、fixed clock、sequence ids、safe retry、strict redaction | 被更高普通来源覆盖 | 默认值必须可构造 |
| JSON config file | 2 | 启动、运行装配、入口、job、idempotency、projection、topic map、ref-only sensitive config | 覆盖 defaults;重复 key fail-fast | 未指定可用 defaults;指定文件不可读 / 解析失败 fail-fast |
| environment variables | 3,最高普通来源 | CI / local override、profile、路径、endpoint ref、batch、timeout、有限诊断配置 | 覆盖 file / defaults;非法值 fail-fast | 缺失用低优先级;存在但非法 fail-fast |
| entry local args | 局部入口参数 | config path、runtime profile selector、job run id、job scope、dry-run / diagnostic | 不覆盖全局配置;局部非法 fail-fast | 缺失使用已加载配置或 job DTO 默认 |
| secret / credential refs | 引用值可由普通来源提供 | credential ref、endpoint ref、handoff destination ref | 普通来源只能提供引用,不能提供 raw secret | ref 格式非法 fail-fast;解析不可用 fail-closed 或 explicit degraded |
| config center | P1/P2 | future remote config source | P0 启用视为 unsupported profile | 当前不可用不影响 P0 |
| admin override | P1/P2 | future audited override | P0 启用视为 unsupported profile | 当前不可用不影响 P0 |

### 4.2 冲突处理表

| 冲突场景 | 处理规则 | 是否阻断启动 / 操作 |
|---|---|---|
| 同一 key 出现在不同普通来源 | 高优先级覆盖低优先级 | 否,除非高优先级值非法 |
| 同一 JSON 文件内重复 key | 视为配置文件错误 | 是 |
| 同一语义出现等价别名 key | 视为歧义配置 | 是 |
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

#### 配置来源链图: L1-process 配置优先级链

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

- 图表达来源优先级,不表达部署命令。
- 高优先级非法值不允许静默回退。
- secret material 不进入普通配置链。

## 5. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 普通来源优先级固定为 defaults < JSON < env | 否 | 配置来源语义 | 无 | 无回写 |
| entry local args 只作局部输入,不覆盖全局配置 | 否 | 配置来源语义 | 无 | 无回写 |
| config center / admin override 后移 P1/P2 | 否 | 范围裁剪 | 无 | 无回写 |

## 6. 回填草稿

`04-配置设计.md` §5 应写明普通配置值使用 `code defaults < JSON config file < environment variables` 的覆盖顺序。entry local args 只用于 config source selector 或 job / entry 局部参数。secret / credential material 不进入普通配置链;普通来源只能提供 ref。高优先级非法值必须 fail-fast,不得回退低优先级。

## 7. 待确认事项

- 无阻塞 Step 6 的待确认事项。
- Step 8 需继续细化 secret / credential ref 管理和禁止输出规则。

## 8. 进入下一步条件

- 来源优先级和冲突处理可判定。
- 必填缺失、非法高优先级值、raw secret 注入均有失败策略。
- 详细设计影响判定为无回写。
