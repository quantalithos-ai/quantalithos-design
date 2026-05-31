# Step 11. 定义失效模式与降级 / fail-fast 策略

> 本文件是 `projects/L0-sdk/04-配置设计.md` 的 Step 11 中间产物。
> 本步定义配置缺失、错误、不可达、过期、漂移时系统如何表现。
> 本步不新增错误枚举、不新增恢复 API、不改变 `03-详细设计.md` 中的 runtime builder、adapter、port、audit、event 或 job 契约。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 11
- 回填章节：`projects/L0-sdk/04-配置设计.md` §11 失效模式与降级 / fail-fast 策略

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 5 来源优先级 | 高优先级非法不回退;CLI / job args 只作局部输入 | 定义缺失、冲突和非法覆盖策略 |
| Step 7 配置项清单 | 11 个配置组、默认值、敏感级别、失败策略 | 定义配置组失效行为 |
| Step 8 敏感配置 | P0 无 secret material;只允许 sensitive reference | 定义 secret / KMS / Vault 不可用边界 |
| Step 9 生效机制 | 启动加载,parse / type / sensitive / cross-field validate,无 reload / hot update | 固定 fail-fast 与生效时机 |
| Step 10 变更回滚 | 回滚通过恢复来源并重跑 | 定义失效后的恢复入口 |
| `03-详细设计.md` §12 / §13 / §14 | 已定义 `BoundaryViolation`、`Dependency`、stale、pending、failed、skipped、outbox pending 等口径 | 避免本步重写代码契约 |

已确认结论:

```text
P0 配置解析、类型校验、交叉字段校验、安全边界校验失败时必须 fail-fast 或 fail-closed。
高风险失败不得 silent fallback。
P0 不依赖 config center、KMS 或 Vault;这些不可用不影响 P0 主线。
P0 不实现 last-known-good 自动回退,也不实现 reload / hot update。
source、boundary、runner、outbox、projection 的运行期失败承接详细设计既有 stale / pending / failed / skipped / Dependency 语义。
```

## 3. SOP 问题回答

1. 必填配置缺失时系统如何处理?

   回答：外部 JSON 中大部分字段不是必填,因为 code defaults 可以构造 P0 默认路径;但最终 `ValidatedSdkRuntimeConfig` 中必须有有效值。未显式配置时使用 defaults 并继续校验。显式指定的 config file 缺失、不可读,或显式 env / CLI selector 为空、非法时 fail-fast。future 无默认值字段缺失也必须 fail-fast。

2. 配置类型错误、范围错误、交叉字段错误时如何处理?

   回答：在进入 `SdkRuntimeBuilder` 前阻断。未知 key、重复 key、非法 enum、非法 bool、非法 array、非法 path、非法 ref、unsupported language target、root 混用、artifact / report 层级错误、policy 降级、fake marker 缺失、job run id 禁用都必须 fail-fast。高优先级非法值不得回退低优先级。

3. secret / KMS / Vault 不可用时如何处理?

   回答：P0 不直接读取 KMS / Vault,也没有 secret material 配置项,因此 KMS / Vault 不可用不影响 local-dev、ci-test、integration-test 和 candidate-validation 主线。P1/P2 若引入 secret ref、credential ref 或 provider binding,ref 格式非法、不可解析、权限不足或 provider 不可用时,对应 adapter fail-fast 或 fail-closed。不得用 raw secret 作为降级方案。

4. config center 不可达时如何处理?

   回答：config center、remote config 和 admin override 不属于 P0 来源链。P0 配置中出现这些来源或启用开关时,按 unsupported / 越界配置 fail-fast。未来如引入 config center,必须单独设计 last-known-good、审计、回滚和不可达策略。

5. 配置漂移或过期如何发现和处理?

   回答：P0 不做在线漂移检测。漂移通过版本化配置 review、CI diff、启动日志、job receipt、config fingerprint、来源摘要和 report 发现。已经运行的 job 不热更新;下一次启动重新读取并校验。发现漂移后按 Step 10 恢复来源并重跑。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| Step 5 来源优先级 | 已定义非法高优先级不回退 | 需要展开到缺失、重复、未知 key 和 unsupported 来源 |
| Step 7 配置项清单 | 已定义字段失败策略 | 需要汇总成统一失效模式表 |
| Step 8 敏感配置 | 已定义 P0 无 secret material | 需要明确 KMS / Vault 不可用不是 P0 主线失败 |
| Step 9 生效机制 | 已定义加载校验链和无热更新 | 需要明确失败时如何阻断或进入既有状态 |
| Step 10 回滚规则 | 已定义恢复来源并重跑 | 需要作为配置失效后的恢复入口 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 失败口径 | 分散在来源、配置项、加载、回滚步骤 | 汇总为 fail-fast / fail-closed / pending / failed / stale / skipped / unsupported | 便于测试和验收引用 |
| 缺失配置 | 只知道 defaults 可补齐 | 明确显式缺失和 future 无默认值缺失必须 fail-fast | 防止把缺失误当降级 |
| secret provider | 只说 P0 不保存 secret | 明确 KMS / Vault 不可用不影响 P0,未来 ref 失败 fail-fast / fail-closed | 防止用 raw secret 降级 |
| config center | 只列 P1/P2 | 明确 P0 出现 remote config / admin override 是 unsupported | 防止提前引入在线配置 |
| 漂移处理 | 只在变更回滚提到 | 通过 fingerprint、来源摘要、CI / review、job receipt、report 发现 | 支撑后续测试和验收 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：高风险配置失败全部 fail-fast / fail-closed | 行为确定,测试验收可判定 | 可用性不如自动回退 | 采用 |
| 方案 B：非法高优先级值自动回退低优先级 | 可用性较高 | 掩盖错误配置,破坏可追溯性 | 不采用 |
| 方案 C：引入 last-known-good 自动恢复 | 适合在线配置中心 | 当前无 config center / hot reload,会新增状态契约 | 不采用 |
| 方案 D：广泛 degraded 继续运行 | 本地开发友好 | 会让 source、boundary、policy、candidate gate 语义不可信 | 只允许派生视图或支撑面使用有限 degraded |

推荐方案 A。

原因:

- SDK 配置错误往往会影响 source truth、boundary 调用、候选包、证据链或安全下限,不能静默放行。
- P0 的目标是默认可验证路径,不是在线可用性最大化。
- detailed design 已有 stale、pending、failed、skipped 等支撑面语义,不需要在配置设计里新增恢复 API。

## 7. 结构化中间产物

#### 配置失效处理图: L0-sdk 配置失败决策

```text
[config source / configured dependency failure]
        |
        v
[parse / type / cross-field config error?]
        |
        +--> yes --> [fail-fast before SdkRuntimeBuilder]
        |
        v
[secret or boundary safety cannot be verified?]
        |
        +--> yes --> [fail-closed / BoundaryViolation]
        |
        v
[source snapshot unavailable?]
        |
        +--> yes --> [Dependency / stale / pending]
        |
        v
[runner or validation target failed?]
        |
        +--> yes --> [job failed / evidence failed or skipped]
        |
        v
[outbox or projection support failed?]
        |
        +--> yes --> [outbox pending / projection stale]
```

关键说明:

- 本图只表达 P0 配置相关失效处理,不表达在线配置中心。
- 配置解析、类型校验和交叉字段校验失败必须发生在 builder 前。
- `fail-closed` 适用于 ref、安全门禁和 boundary policy 无法确认的场景。
- `stale`、`pending`、`failed`、`skipped` 只承接已有 SDK 运行期语义,不新增状态机。

### 7.1 失效模式表

| 失效模式 | 影响 | 系统行为 | 是否告警 | 测试切口 |
|---|---|---|---|---|
| 未提供外部配置且 defaults 可构造 | 使用 P0 default path | 继续 parse / validate / builder | 否 | default config startup |
| 指定 config file 缺失 / 不可读 | 配置来源不可确认 | fail-fast | 是 | missing config file |
| JSON 格式错误或重复 key | 配置不可解析或歧义 | fail-fast | 是 | malformed / duplicate config |
| 未知 P0 配置 key | 可能拼写错误或越界配置 | fail-fast | 是 | unknown config key |
| env 值类型错误或非法 | 高优先级非法 | fail-fast,不回退 | 是 | invalid env override |
| CLI / job selector 非法 | 启动入口不可确认 | fail-fast | 是 | invalid CLI selector |
| path / root 为空、不可规范化或不可写 | store / artifact / report 不可用 | fail-fast | 是 | invalid path / permission |
| root 混用或 report root 层级错误 | truth / state / report 边界污染 | fail-fast | 是 | cross-field root collision |
| contracts path 指向错误 crate | SDK 可能复制上游 truth | fail-fast 或暂停实现 | 是 | invalid contracts path |
| source snapshot 不可读 | derived view 无法刷新 | 返回 `Dependency` 或标记 stale / pending | 是 | source unavailable |
| formal / bus boundary ref 非法 | 外部边界不可信 | fail-closed | 是 | invalid boundary ref |
| fake marker 缺失 | fake 可能伪装 production | fail-fast / `BoundaryViolation` | 是 | fake marker required |
| runner profile 不支持 | candidate job 无法执行 | fail-fast | 是 | invalid runner profile |
| runner 执行失败 | evidence 无法通过 | job failed; evidence failed / skipped | 是 | runner failure |
| language target 缺 Rust / Python / TypeScript | P0 三语言 candidate 不成立 | fail-fast | 是 | language set missing |
| artifact / report root 不可写 | evidence / report 无法归档 | fail-fast 或 job failed | 是 | artifact root failure |
| outbox publish 失败 | event 未发布 | 保留 pending / failed,允许 replay | 是 | outbox publish failure |
| projection rebuild 失败 | query view 不新鲜 | 标记 stale / rebuilding;不写 truth | 是 | projection stale |
| policy 降级或关闭 gate | 安全 / compatibility 红线被绕过 | fail-fast + 设计变更流程 | 是 | forbidden policy switch |
| 普通来源包含 raw secret | 安全边界破坏 | fail-fast | 是 | raw secret rejection |
| future secret ref 不可解析 | 真实 adapter 凭据不可用 | fail-fast / fail-closed | 是 | secret ref failure(P1/P2) |
| KMS / Vault 不可用 | P0 不依赖;P1/P2 凭据不可用 | P0 不受影响;P1/P2 fail-fast / fail-closed | 是,仅 P1/P2 | secret provider unavailable |
| config center / remote config 不可达 | P0 不依赖 | P0 不受影响;若启用则 unsupported / fail-fast | 是,若被配置 | unsupported config center |
| 配置运行中变化 | 当前 job 配置漂移 | 当前运行不热更新;下一次启动重新校验 | 视 profile 而定 | no hot reload |
| config fingerprint 不符合预期 | 可能运行错误配置 | release-like / candidate 阻断;local 提示 | 是 | fingerprint mismatch |

### 7.2 处理策略定义表

| 策略 | 含义 | P0 适用范围 | 禁止误用 |
|---|---|---|---|
| fail-fast | 在启动、job 启动或提交前阻断 | parse、type、cross-field、path、language、policy、raw secret、unsupported source | 不得在高优先级非法时回退低优先级 |
| fail-closed | 无法确认安全或引用有效性时按不允许处理 | formal / bus boundary ref、future credential ref、安全门禁 | 不得默认放行 |
| pending / failed | 记录待恢复状态或失败状态 | outbox publish、boundary / source pending、candidate job 失败 | 不得宣称成功 |
| stale / rebuild | 派生视图不新鲜,需要重建 | derived view、projection、freshness view | 不得反写真相 |
| evidence failed / skipped | 验证没有通过或未执行 | smoke / docs / boundary / compatibility runner | 不得支撑 `Stable` |
| last-known-good | 使用上一版已知可用配置继续服务 | 当前 P0 不适用 | 不得在 P0 隐式实现 |
| degraded | 降级继续提供部分只读能力 | 仅限 query 返回 stale marker 等派生视图能力 | 不得用于 source truth、boundary safety、policy gate、secret |

### 7.3 漂移与过期处理表

| 场景 | 发现方式 | 处理方式 |
|---|---|---|
| JSON config file 与 review 后版本不一致 | 版本库 diff、CI check、config fingerprint | 阻断 candidate / CI;恢复受控版本 |
| env / CLI override 非预期 | job receipt、启动日志、来源摘要 | 停止入口,移除 override 后重跑 |
| candidate-validation 使用非预期 config fingerprint | expected fingerprint check、report 比对 | fail-fast,不得标记 verified / stable |
| 运行中配置来源被修改 | 下一次启动 fingerprint 或 mtime 变化 | 当前运行不热更新;下一次启动重新校验 |
| source snapshot 过期 | freshness job、source digest、upstream version ref | 标记 stale / pending,重跑 refresh |
| fake / fixture endpoint 过期 | boundary validation、smoke / docs runner | evidence failed / skipped,不支撑 stable |
| future secret ref 过期 | provider 返回 expired / revoked | adapter fail-fast / fail-closed,轮换 ref 后重启 |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 配置 parse / type / cross-field 失败必须 fail-fast | 否 | 配置设计失败策略 | 无 | 无回写 |
| sensitive reference 或 boundary safety 不可确认时 fail-closed | 否 | 承接 03 boundary / security error 语义 | 无 | 无回写 |
| source / boundary / runner / outbox / projection 失败承接 stale / pending / failed / skipped / Dependency | 否 | 承接 03 既有运行期语义 | 无 | 无回写 |
| P0 不实现 last-known-good、hot reload 或 config center 降级 | 否 | 范围分级 | 无 | 无回写 |
| 如果后续新增 `ConfigError` 细分、config fingerprint API 或 last-known-good store | 是 | error / runtime config / storage contract 变化 | `03-详细设计.md` §13 / §14 / contracts 章节 | 待回写 |

说明:

- 本步只定义配置失效语义和测试切口,不新增 Rust error enum、DTO、trait、repository 或恢复 API。
- `config fingerprint` 在本步作为审计 / 验收摘要概念使用;若要进入正式结构体字段或 API,必须先回写 03。

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §11。

````md
## 11. 失效模式与降级 / fail-fast 策略

> 校准来源：
> - `design-calibration/04_config_step_11_failure_modes.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“配置失效处理图”“失效模式表”“处理策略定义表”“漂移与过期处理表”和“对详细设计的影响判定”小节，了解本章失败策略如何收敛。

P0 配置失效优先采用 fail-fast 或 fail-closed。配置 parse、type validate、cross-field validate、root path 校验、raw secret 检查和禁止配置化项检查失败时,必须在 `SdkRuntimeBuilder` 前阻断。高优先级配置非法时不得回退到低优先级配置继续运行。

boundary ref、future credential ref 或安全门禁不可确认时按 fail-closed 处理。source 不可用进入 `Dependency`、stale 或 pending 语义;runner 失败进入 job failed 或 evidence failed / skipped;outbox publish 失败保留 pending / failed;projection 失败标记 stale / rebuilding。

P0 不依赖 config center、KMS 或 Vault,也不实现 last-known-good、hot reload 或在线降级。配置漂移通过版本化配置、CI / review、启动日志、job receipt、config fingerprint、来源摘要和 report 发现。发现漂移后,按配置变更与回滚规则恢复来源并重新执行 runtime / CLI / job。
````

## 10. 待确认事项

- 是否接受 P0 配置失效优先 fail-fast / fail-closed。
- 是否接受 P0 不实现 last-known-good 自动回退。
- 是否接受 config center / KMS / Vault 不可用不影响 P0 主线。
- 是否接受 config fingerprint 只作为摘要概念,暂不进入 03 代码契约。
- 是否接受本步无需回写 `03-详细设计.md`。

## 11. 进入下一步条件

- [x] 配置失效处理图已明确。
- [x] 失效模式表已覆盖 P0 配置、敏感引用、外部依赖和漂移场景。
- [x] 处理策略定义表和漂移与过期处理表已明确。
- [x] 本步无需回写 `03-详细设计.md`。
- [x] Step 11 状态从 `[~]` 更新为 `[x]`。
