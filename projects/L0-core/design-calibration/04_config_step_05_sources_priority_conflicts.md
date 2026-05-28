# Step 5. 定义配置来源、优先级与冲突处理

> 本文件是 `projects/L0-core/04-配置设计.md` 的 Step 5 中间产物。
> 本步定义配置来源覆盖顺序、冲突处理和不可用策略。
> 本步不定义完整配置项清单,不定义环境矩阵,不新增 `CoreRuntimeConfig` 字段,不改变 `03-详细设计.md` 中的代码契约。

---

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 5
- 回填章节：`projects/L0-core/04-配置设计.md` §5 配置来源、优先级与冲突处理

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 3 配置来源链 | code defaults -> project config file -> environment variables -> CLI flags -> `CoreRuntimeConfig` | 固定 P0 普通配置覆盖顺序 |
| Step 4 配置分类 | 启动配置、运行时装配配置、策略配置、敏感配置、调试配置、演进配置 | 判断不同类别是否允许覆盖、如何冲突 |
| `03-详细设计.md` §13 | 7 个 runtime config 输入和外部依赖绑定表 | 确认来源优先级只影响配置值,不改变代码契约 |
| `01-架构设计.md` §13 | 配置与变更控制不能绕开核心真相或边界 | 确认冲突处理不能绕过架构红线 |

已确认结论:

```text
P0 普通配置来源覆盖顺序为:
code defaults < project config file < environment variables < CLI flags

secret refs 不参与普通覆盖链;普通配置源只能提供 secret 引用,不能提供 raw secret。
config center 和 admin override 属于 P2,本轮不参与 P0 覆盖链。
```

---

## 3. SOP 问题回答

1. code default、file、env、secret、config center、admin override 的优先级是什么?

   回答：P0 普通配置优先级从低到高是 code defaults、project config file、environment variables、CLI flags。secret refs 不作为普通覆盖来源,只作为敏感引用值进入 adapter-local sensitive binding。config center 和 admin override 属于 P2,当前不参与 P0 优先级。若未来引入,必须重新设计审计、回滚、权限和热更新边界。

2. 同名配置多处出现时如何冲突处理?

   回答：普通配置同名出现时,按更高优先级来源覆盖低优先级来源;如果两个来源同级重复定义同一 key,应 fail fast 并报告重复来源。高优先级值如果类型错误、路径非法或违反禁止配置化边界,不能回退到低优先级值继续运行,必须 fail fast。敏感配置不得由普通文件中的 raw secret 覆盖,只能写 secret ref。

3. 必填项缺失时是否阻断启动?

   回答：P0 必填项缺失或解析失败时阻断启动 / 作业启动。对于有 code defaults 的 root path,缺失来源不算缺失,但默认路径必须通过校验。对于无默认值的 adapter-local sensitive binding 或未来真实 publisher credential,缺失时应 fail fast 或按 profile 明确禁用对应真实 adapter,不能隐式降级为成功。

4. 配置中心或密钥系统不可用时如何处理?

   回答：P0 不依赖配置中心,因此配置中心不可用不影响 P0。P0 也不直接读取 KMS / Vault raw secret;如果某个 adapter-local sensitive binding 需要解析 secret ref,解析不可用时对该 adapter fail fast 或 fail closed,不得自动放行。P2 引入 config center、KMS / Vault 或 admin override 时,必须单独定义不可用策略、审计和回滚。

5. 哪些来源不能覆盖敏感配置?

   回答：project config file、environment variables、CLI flags 不能提供 raw secret 来覆盖敏感配置;它们最多提供 secret ref、credential ref 或禁用真实 adapter 的 profile 值。code defaults 不能包含 raw secret。普通 file/env/flag 也不能覆盖 secret material 的真实值、不能关闭 secret 脱敏、不能关闭敏感配置审计。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `04-配置设计.md` §5 | 尚未存在来源优先级与冲突处理 | 实施者会自行决定 env、file、CLI flag 谁覆盖谁 |
| Step 3 来源链图 | 只表达覆盖链方向 | 缺少重复 key、类型错误、缺失项和敏感配置冲突处理 |
| Step 4 敏感配置边界 | 已说明 raw secret 不进入普通配置 | 需要在来源优先级中固化“secret ref 不等于 raw secret” |
| `03-详细设计.md` §13 | 只有 `config source` 抽象 | 需要由 04 具体化来源规则,但不能改变 runtime builder 签名 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 来源优先级 | 只有来源链图,没有正式优先级 | `defaults < file < env < CLI flags` | 让实现、测试和验收可判定 |
| secret 处理 | 只说敏感配置单独处理 | secret refs 不参与普通覆盖链,raw secret 不允许进入普通来源 | 防止配置文件或命令行泄露 secret |
| 冲突处理 | 未定义 | 同级重复 fail fast,高优先级错误不回退 | 防止错误配置被静默掩盖 |
| config center / admin override | 未说明 | 明确为 P2,不参与 P0 | 避免把在线配置能力误写成当前前置 |
| 03 回写 | 未判断 | 本步仅定义来源规则,不改变代码契约 | 无需回写 03 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：CLI flags 最高优先级 | 便于本地、CI 和 job 临时指定路径;符合命令行工具习惯 | 需要避免用 flag 覆盖禁止配置化项 | 采用 |
| 方案 B：project config file 最高优先级 | 配置集中稳定 | 本地 / CI override 困难,作业调试不灵活 | 不采用 |
| 方案 C：高优先级配置错误时回退低优先级 | 可用性较高 | 容易掩盖错误配置,测试和验收不可判定 | 不采用 |
| 方案 D：P0 引入 config center / admin override | 长期能力完整 | 当前没有在线 runtime container,会扩大 P0 范围 | 不采用,列为 P2 |

---

## 7. 结构化中间产物

### 7.1 配置来源优先级表

| 来源 | 优先级 | 适用配置 | 冲突处理 | 不可用时策略 |
|---|---|---|---|---|
| code defaults | 1,最低 | root path 默认值、local fake adapter 默认值、基础日志默认值 | 被更高优先级普通来源覆盖 | 不可用不适用;默认值必须可构造 |
| project config file | 2 | P0 普通启动配置、运行时装配配置、profile 默认值 | 覆盖 defaults;同一文件重复 key fail fast | 文件不存在时可使用 defaults;文件存在但不可读 / 解析失败 fail fast |
| environment variables | 3 | CI / local override、路径 override、profile override、diagnostic override | 覆盖 file 和 defaults;同级重复或非法值 fail fast | 缺失时继续使用低优先级;值存在但非法 fail fast |
| CLI flags | 4,最高普通来源 | 单次命令 / job override、config file path、root path、dry-run / diagnostic | 覆盖 env / file / defaults;非法值 fail fast,不回退 | 缺失时继续使用低优先级;值存在但非法 fail fast |
| secret refs | 不参与普通优先级 | 敏感引用、credential ref、future publisher credential ref | 普通来源只能提供引用,不能覆盖 raw secret | ref 不可解析时 adapter fail fast / fail closed |
| config center | P2 | future online config provider | 当前不参与 P0 冲突处理 | 当前不可用不影响 P0 |
| admin override | P2 | future audited override | 当前不参与 P0 冲突处理 | 当前不可用不影响 P0 |

### 7.2 冲突处理表

| 冲突场景 | 处理规则 | 是否阻断启动 / 操作 |
|---|---|---|
| 同一 key 同时出现在不同优先级普通来源 | 高优先级覆盖低优先级 | 否,除非高优先级值非法 |
| 同一 config file 内重复定义同一 key | 视为配置文件错误 | 是 |
| 同一来源出现两个等价别名 key | 视为歧义配置 | 是 |
| 高优先级值类型错误 | fail fast,不回退低优先级 | 是 |
| 高优先级路径不存在或不可访问 | fail fast,不回退低优先级 | 是 |
| 必填配置无默认值且所有来源缺失 | fail fast | 是 |
| 有默认值的 root path 未显式配置 | 使用 defaults,再执行路径校验 | 取决于校验结果 |
| 普通配置源提供 raw secret | 拒绝配置 | 是 |
| 普通配置源提供 secret ref | 允许作为引用,真实解析交给 adapter-local binding | ref 格式非法时阻断;不可解析时 adapter fail fast / fail closed |
| 试图通过配置关闭禁止配置化项 | 拒绝配置,进入设计变更流程 | 是 |
| config center / admin override 出现在 P0 配置 | 拒绝或标为未知字段 | 是 |

### 7.3 来源到配置类别映射

| 配置类别 | 允许来源 | 禁止来源 / 禁止内容 |
|---|---|---|
| 启动配置 | defaults、file、env、CLI flags | config center / admin override 作为 P0 来源 |
| 运行时装配配置 | defaults、file、env、CLI flags | adapter 自行读取全局配置源 |
| 策略配置 | file、env、CLI flags | 覆盖领域不变量或禁止配置化项 |
| 敏感配置 | secret ref、credential ref、adapter-local binding | raw secret in defaults / file / env / CLI flags |
| 调试配置 | defaults、file、env、CLI flags | 跳过 gate、audit、fingerprint、idempotency |
| 演进配置 | P2 config center / admin override | 进入 P0 正式配置项 |

---

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 定义 `defaults < file < env < CLI flags` 的普通来源优先级 | 否 | 配置设计规则 | 无 | 无回写 |
| secret refs 不参与普通覆盖链,raw secret 不进入普通来源 | 否 | 安全配置规则 | 无 | 无回写 |
| config center / admin override 属于 P2,不进入 P0 | 否 | 范围分级 | 无 | 无回写 |
| 高优先级非法值 fail fast,不回退低优先级 | 否 | 配置加载失败策略 | 无 | 无回写 |

说明:

- 本步没有新增 config loader 函数签名、错误枚举、`CoreRuntimeConfig` 字段或 adapter constructor 参数。
- 如果后续详细设计需要把配置来源解析 API 写入 Rust 契约,应在配置设计完成后由详细设计回写清单统一处理。

---

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §5。

````md
## 5. 配置来源、优先级与冲突处理

> 校准来源：
> - `design-calibration/04_config_step_05_sources_priority_conflicts.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“配置来源优先级表”“冲突处理表”“对详细设计的影响判定”和“待确认事项”小节，了解本章规则如何收敛。

P0 普通配置来源按以下顺序覆盖：

```text
code defaults < project config file < environment variables < CLI flags
```

高优先级来源覆盖低优先级来源,但高优先级值如果类型错误、路径非法或违反禁止配置化边界,不得回退到低优先级值继续运行,必须 fail fast。同一来源内重复 key 或等价别名 key 视为歧义配置,必须阻断启动或作业启动。

`secret refs` 不参与普通覆盖链。普通配置来源最多提供 secret ref 或 credential ref,不得提供 raw secret。真实 secret material 由 adapter-local sensitive binding 处理,不可写入普通配置文件、环境变量、CLI flag、日志、错误返回或审计正文。

config center 与 admin override 属于 P2 演进能力,当前不参与 P0 覆盖链。
````

---

## 10. 待确认事项

- 是否接受 `CLI flags` 作为 P0 普通配置的最高优先级来源。
- 是否接受高优先级配置非法时 fail fast,不回退低优先级配置。
- 是否接受 P0 不引入 config center / admin override。
- 是否接受普通来源只能提供 secret ref,不得提供 raw secret。

---

## 11. 进入下一步条件

- [x] 用户确认配置来源优先级。
- [x] 用户确认冲突处理规则。
- [x] 用户确认敏感配置来源边界。
- [x] 用户确认本步无需回写 `03-详细设计.md`。
- [x] Step 5 状态从 `[~]` 更新为 `[x]`。
