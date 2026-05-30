# L0-bus 04 配置设计 Step 8: 敏感配置与密钥管理

> 本文件是 `projects/L0-bus/04-配置设计.md` 的 Step 8 中间产物。
> 本步单独收稳 secret、credential、DSN、token、cert 等敏感配置的存储、读取、轮换、审计和禁止输出规则。
> 本步不创建正式 `04-配置设计.md`,不写任何密钥明文示例。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 8 |
| 主题 | 定义敏感配置与密钥管理 |
| 状态 | 已确认 |
| 正式回填位置 | `04-配置设计.md` §8 |
| 是否修改正式 `04-配置设计.md` | 否 |
| 是否必须判定对 `03-详细设计.md` 的影响 | 是 |

---

## 2. 本步输入

| 输入 | 关键结论 | 本步使用方式 |
|---|---|---|
| `04_config_step_07_config_items.md` | `store.connection_ref`、`transport_backend.secret_ref`、`publisher.secret_ref` 是 `sensitive-ref`;`security_boundary.secret_policy = ref_only` | 确定敏感配置项和固定 policy |
| `04_config_step_05_sources_priority_conflicts.md` | secret / connection ref 不参与普通覆盖链;普通来源最多提供引用 | 确定 file / env / CLI 的输入限制 |
| `04_config_step_04_classification_boundaries.md` | 敏感引用配置冷更新;禁止通过配置绕过安全边界 | 确定热更新和禁止配置化边界 |
| `03-详细设计.md` §13 / §14 / §15 | 配置边界、redaction 规则和测试切口已定义 | 确定审计、日志、测试承接 |
| `03_ddd_step_14_config_dependencies.md` §7.4 / §7.5 | `ConfigError::SecretReferenceInvalid` 和禁止配置化校验表已定义 | 确定校验失败口径 |

---

## 3. SOP 问题回答

### 3.1 哪些配置是 sensitive 或 secret?

L0-bus P0 不接收密钥明文,只接收引用。敏感配置分为三类:

| 类别 | 配置项 | 说明 |
|---|---|---|
| connection reference | `store.connection_ref` | 外部 store 连接引用;P0 `in_memory` 为空 |
| secret reference | `transport_backend.secret_ref` | 外部 transport backend 凭证引用;P0 `in_memory` 为空 |
| secret reference | `publisher.secret_ref` | 外部 publisher 凭证引用;P0 `in_memory_sink` 为空 |
| security policy | `security_boundary.secret_policy` | 固定为 `ref_only`,用于拒绝明文密钥输入 |
| diagnostic boundary | `security_boundary.redaction_policy` | 固定为 `required`,用于约束日志、错误、审计、报告输出 |

以下内容不是合法配置项:

- 密钥明文。
- DSN 明文。
- token 明文。
- certificate private key 明文。
- 可反推出密钥或 credential 的 backend private detail。

### 3.2 敏感配置如何存储,是否允许明文?

敏感配置只允许存储引用,不允许存储明文。

| 位置 | 允许内容 | 禁止内容 |
|---|---|---|
| JSON config file | `SecretRef` / `ConnectionRef` 字符串引用 | 密钥、DSN、token、private key 的明文 |
| environment variables | 引用值或 profile 名称 | 密钥明文 |
| CLI args | operations job 局部引用或 profile | 密钥明文 |
| `RuntimeConfig` / `ValidatedRuntimeConfig` | 引用类型或已校验引用 | 密钥 material |
| logs / metrics / audit / reports | 脱敏后的引用摘要、hash、类型和错误分类 | 完整引用值、明文、可反推细节 |

### 3.3 敏感配置如何轮换?

P0 采用冷更新轮换:

```text
secret provider updates material behind ref
  -> config keeps the same ref or changes to a new ref
  -> process restarts or job restarts
  -> ConfigLoader parses ref
  -> ConfigValidator validates ref shape and policy
  -> RuntimeBuilder constructs adapter with ref
```

如果外部 provider 在不改变 ref 的情况下完成密钥 material 轮换,L0-bus 不需要感知 material,只需要在下一次 adapter 解析时使用该 ref。P0 不做热更新,不在运行中替换 adapter secret。

### 3.4 读取和变更是否需要审计?

需要。审计口径如下:

| 行为 | 审计要求 | 不得记录 |
|---|---|---|
| 配置加载 | 记录配置来源、profile 分类、敏感引用字段是否存在、校验结果 | 完整引用值和密钥明文 |
| 配置校验失败 | 记录错误类型、字段路径、失败原因分类 | 完整引用值和密钥明文 |
| adapter 构造 | 记录 adapter kind、引用摘要和构造结果 | 真实 credential material |
| operations job 使用引用 | 记录 job id、操作类型、引用摘要和结果 | 完整引用值和密钥明文 |
| 密钥轮换 | 由外部 secret provider / 运维系统记录 material 轮换;L0-bus 只记录 ref 变更或重启装配 | material 前后值 |

### 3.5 日志、错误返回、审计中如何避免泄露?

采用统一 redaction 规则:

- 错误返回只暴露字段路径和错误分类,不暴露完整引用值。
- 日志只记录 ref 类型和短摘要,例如 `secret_ref:<sha256-prefix>`。
- 指标 label 不允许包含完整 ref、record id、payload digest 全量或 credential 相关值。
- 审计记录只保存引用摘要、actor、操作、结果、trace id。
- 测试报告和 `reports/` 产物必须经过 redaction check。
- `security_boundary.redaction_policy` 必须为 `required`;任何试图关闭 redaction 的配置都 fail-closed。

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| Step 7 已列敏感引用,但未单独说明存储和轮换 | `sensitive-ref` 只是配置项级标注 | 实施者可能把引用和 material 混淆 | 本步明确只存引用,material 由外部 provider 管理 |
| 日志 / 错误 / 审计输出规则需要独立收稳 | `03` §14 有 redaction 规则,但配置文档还未承接 | 配置失败时可能泄露敏感字段 | 本步定义禁止输出规则和 redaction 摘要 |
| 轮换方式未与 P0 冷更新口径对齐 | Step 4 已说敏感引用冷更新,但未说明流程 | 可能误以为需要热更新 secret | 本步明确 P0 只做冷更新或 job restart |
| 失败策略需要和 `ConfigError` 对齐 | `SecretReferenceInvalid` 已存在,但配置文档未落地 | loader / validator 测试无明确断言 | 本步明确形态错误、缺失、试图写入明文均 fail-fast / fail-closed |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 敏感配置表达 | 只在配置项表中标记 `sensitive-ref` | 单独列出敏感配置表、存储方式、轮换方式和审计要求 | 防止实现误把敏感值当普通字符串 |
| 轮换口径 | 只知道 P0 冷更新 | 明确 provider 轮换 material,L0-bus 只持有 ref,重启或 job restart 生效 | 避免引入 P0 不需要的热更新机制 |
| 输出安全 | 依赖 `03` redaction 规则 | 配置文档中显式规定日志、错误、审计、报告禁止输出内容 | 测试和验收可直接引用 |
| 失败策略 | 散落在 Step 5 / Step 7 | 汇总到敏感配置失败策略 | 便于 validator 测试 |

---

## 6. 配置设计取舍

### 6.1 是否允许测试环境使用密钥明文

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 测试也只允许 fake ref | 规则一致,不会培养错误实现习惯 | 测试需要提供 fake resolver | 采用 |
| B. 测试环境允许明文 | 写测试简单 | 容易把明文路径带入生产实现 | 不采用 |
| C. 仅 CI 允许明文 | 局部方便 | 规则分裂,redaction 测试更复杂 | 不采用 |

结论: 所有环境均只允许 ref。测试使用 fake ref 和 fake resolver。

### 6.2 是否在 L0-bus 内部解析真实密钥 material

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. L0-bus 只持有 ref,adapter constructor 按受控 provider 解析 | 符合最小持有原则 | 需要 provider adapter | 采用 |
| B. `ConfigLoader` 直接解析 material | 简化 adapter | loader 持有敏感 material,泄露面变大 | 不采用 |
| C. application service 解析 material | 灵活 | 破坏 ports and adapters 边界 | 不采用 |

结论: `ConfigLoader` 和 `ConfigValidator` 校验引用形态与 policy,不保存 material。真实解析只发生在受控 adapter/provider 边界。

### 6.3 轮换是否支持热更新

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. P0 冷更新 / job restart | 简单,可验证,与 runtime graph 构造一致 | 轮换需要重启入口 | 采用 |
| B. P0 支持热更新 | 运行不中断 | 需要 adapter reload、并发切换和审计补偿,超出 P0 | 不采用 |
| C. 只对部分 secret 热更新 | 折中 | 规则复杂,容易出现不一致 | 不采用 |

结论: P0 不做敏感配置热更新。热更新可作为 P1/P2 单独设计。

---

## 7. 结构化中间产物

### 7.1 敏感配置表

| 配置项 | 敏感级别 | 存储方式 | 是否可明文 | 轮换方式 | 审计要求 |
|---|---|---|---|---|---|
| `store.connection_ref` | `sensitive-ref` | JSON / env 中保存 `ConnectionRef`;`ValidatedRuntimeConfig` 中保存已校验引用 | 否 | provider 侧轮换 material;L0-bus 重启或 job restart 后使用 ref | 记录字段路径、ref 类型、短摘要、校验结果 |
| `transport_backend.secret_ref` | `sensitive-ref` | JSON / env 中保存 `SecretRef`;adapter constructor 只接收 ref | 否 | provider 侧轮换 material;backend adapter 重建后生效 | 记录 backend kind、ref 类型、短摘要、构造结果 |
| `publisher.secret_ref` | `sensitive-ref` | JSON / env 中保存 `SecretRef`;publisher adapter 只接收 ref | 否 | provider 侧轮换 material;publisher adapter 重建后生效 | 记录 publisher kind、ref 类型、短摘要、构造结果 |
| `security_boundary.secret_policy` | internal security policy | code defaults / JSON / env 中固定为 `ref_only` | 不适用 | 改变该 policy 必须重新设计,不能通过配置放宽 | 记录 policy 值是否符合固定口径 |
| `security_boundary.redaction_policy` | internal security policy | code defaults / JSON / env 中固定为 `required` | 不适用 | 改变该 policy 必须重新设计,不能通过配置放宽 | 记录 redaction policy 是否启用 |

### 7.2 禁止输出规则

| 输出位置 | 允许输出 | 禁止输出 | 失败 / 门禁策略 |
|---|---|---|---|
| log | 字段路径、错误分类、短摘要、trace id | 完整引用值、密钥明文、credential material、backend private detail | redaction check 失败则测试失败 |
| error response | 稳定错误码、字段路径、错误分类 | 完整引用值、密钥明文、provider 返回正文 | API / job 返回前必须脱敏 |
| audit | actor、操作、结果、短摘要、trace id | 密钥明文、完整 DSN、token、private key、provider 私有响应 | 审计写入前执行 redaction |
| metric label | 模块、错误分类、adapter kind | 完整 ref、record id、payload digest 全量、credential 相关值 | 指标注册或测试中拒绝 |
| reports / artifacts | 通过 redaction 的摘要和失败分类 | 可恢复密钥的信息、完整引用值、provider body | `scripts/checks/check_redaction.sh` 必须覆盖 |

### 7.3 敏感引用流转图

```text
JSON file / env / job local args
  -> SecretRef / ConnectionRef only
  -> ConfigLoader parses references
  -> ConfigValidator checks shape and security policy
  -> ValidatedRuntimeConfig keeps references
  -> RuntimeBuilder passes references to adapter constructors
  -> provider adapter resolves material behind boundary
  -> logs / audit / reports receive redacted summary only
```

图后说明:

- `ConfigLoader` 不读取或保存真实密钥 material。
- `ConfigValidator` 只校验引用形态、来源边界和固定安全 policy。
- `RuntimeBuilder` 只把引用交给 adapter constructor。
- 真实 material 不进入 domain、application、event、projection、audit、report。

### 7.4 敏感配置失败策略表

| 场景 | 检测位置 | 错误口径 | 策略 |
|---|---|---|---|
| 配置文件中出现密钥明文形态 | `ConfigValidator` | `SecretReferenceInvalid` 或 boundary violation | fail-closed,启动失败 |
| `kind=external` 但缺少 ref | `ConfigValidator` | `MissingRequiredConfig` / `SecretReferenceInvalid` | fail-fast,启动失败 |
| ref 格式非法 | `ConfigValidator` | `SecretReferenceInvalid` | fail-fast,启动失败 |
| provider 不可用 | adapter constructor / provider adapter | dependency unavailable | fail-fast;不得回退到不需要 secret 的 profile |
| 日志或报告泄露敏感值 | redaction check | redaction violation | 测试 / 验收失败 |
| 配置试图关闭 redaction | `ConfigValidator` | forbidden boundary | fail-closed,启动失败 |

---

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 敏感配置只允许 `SecretRef` / `ConnectionRef`,不允许明文 | 否 | 沿用 `03` §13 / Step 14 结论 | 无 | 无回写 |
| P0 不支持敏感配置热更新,采用冷更新 / job restart | 否 | 沿用 Step 4 冷更新边界 | 无 | 无回写 |
| `ConfigLoader` / `ConfigValidator` 不保存真实密钥 material | 否 | 沿用配置集中校验和 adapter 边界 | 无 | 无回写 |
| redaction 必须覆盖日志、错误、审计、reports / artifacts | 否 | 沿用 `03` §14 / §15 redaction 与测试切口 | 无 | 无回写 |
| 如后续要求 L0-bus 内置 KMS provider 或热更新 secret | 是 | 新增 provider adapter / reload 机制 | `03-详细设计.md` §13 / §14 / §17 | 当前不采用 |

本步判定:

```text
Step 8 不要求回写 03-详细设计.md。

理由:
- 本步只细化敏感配置的引用、轮换、审计和输出规则。
- 没有改变 ConfigLoader、ConfigValidator、RuntimeBuilder 函数签名。
- 没有新增 RuntimeConfig root 子配置组。
- 没有引入 P0 热更新或内置 KMS provider。
```

---

## 9. 回填草稿

正式 `04-配置设计.md` §8 应从本文件摘录,不在回填草稿中重复完整表格。

建议回填结构:

```text
## 8. 敏感配置与密钥管理

> 校准来源:
> - `design-calibration/04_config_step_08_sensitive_secrets.md`
>
> 延伸阅读:
> - 建议继续阅读 Step 8 §7.1~§7.4,获取敏感配置表、禁止输出规则、敏感引用流转图和失败策略表。

### 8.1 敏感配置表

摘录 `04_config_step_08_sensitive_secrets.md` §7.1。

### 8.2 禁止输出规则

摘录 `04_config_step_08_sensitive_secrets.md` §7.2。

### 8.3 敏感引用流转图

摘录 `04_config_step_08_sensitive_secrets.md` §7.3。

### 8.4 敏感配置失败策略

摘录 `04_config_step_08_sensitive_secrets.md` §7.4。
```

回填时必须保留以下说明:

- L0-bus P0 只保存敏感引用,不保存密钥 material。
- 测试环境也必须使用 fake ref,不得使用明文密钥路径。
- redaction policy 不能通过配置关闭。
- reports / artifacts 必须接受 redaction check。

---

## 10. 待确认事项

| 待确认项 | 可选方案 | 推荐方案 | 原因 | 当前处理 |
|---|---|---|---|---|
| 测试环境是否允许明文密钥 | A. 不允许,使用 fake ref;B. local 允许;C. CI 允许 | 推荐 A | 规则一致,避免错误实现路径 | 按 A 写入本步 |
| P0 是否支持 secret 热更新 | A. 不支持,冷更新;B. 支持所有敏感配置热更新;C. 只支持 publisher 热更新 | 推荐 A | 与 runtime graph 构造和 P0 可验证路径一致 | 按 A 写入本步 |
| L0-bus 是否内置 KMS provider | A. P0 不内置;B. P0 内置;C. 仅定义 trait | 推荐 A | 当前只需受控 adapter seam,不应提前绑定具体 provider | 按 A 写入本步 |
| 是否允许记录完整 ref | A. 不允许,只记录短摘要;B. 允许完整 ref;C. 按环境区分 | 推荐 A | 完整 ref 可能包含路径、租户或 provider 细节 | 按 A 写入本步 |

本步没有阻塞项。上述待确认项均已选择推荐方案作为当前配置设计口径。

---

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 敏感配置项已明确 | 已满足 | §7.1 覆盖 connection ref、secret ref 和 security policy |
| 存储方式和明文边界已明确 | 已满足 | 只允许引用,不允许明文 |
| 轮换方式已明确 | 已满足 | P0 冷更新 / job restart |
| 审计和禁止输出规则已明确 | 已满足 | §7.2 覆盖日志、错误、审计、metric、reports / artifacts |
| 已判定对 `03-详细设计.md` 的影响 | 已满足 | §8 判定无回写 |

结论: Step 8 可以标记为已确认,并进入 Step 9“定义配置加载、校验与生效机制”。
