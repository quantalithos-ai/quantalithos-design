# Step 11. 定义失效模式与降级 / fail-fast 策略

> 本文件是 `projects/L0-core/04-配置设计.md` 的 Step 11 中间产物。
> 本步定义配置缺失、错误、不可达、过期、漂移时系统如何表现。
> 本步不新增错误枚举、不新增恢复 API、不改变 `03-详细设计.md` 中的外部依赖、runtime builder、port、audit 或 job 契约。

---

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 11
- 回填章节：`projects/L0-core/04-配置设计.md` §11 失效模式与降级 / fail-fast 策略

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 5 来源优先级 | defaults < file < env < CLI flags;高优先级非法不回退 | 定义缺失、冲突、非法覆盖的失败策略 |
| Step 7 配置项清单 | 7 个正式 P0 配置项;外部非必填但 runtime 必需 | 定义每类配置项失效行为 |
| Step 8 敏感配置 | P0 无 secret 正式项;raw secret 禁止进入普通来源 | 定义 secret / KMS / Vault 不可用的 P0 / P1 边界 |
| Step 9 生效机制 | CLI / job 启动加载;parse、type validate、cross-field validate;无 hot reload | 固定 fail-fast 与生效时机 |
| Step 10 变更回滚 | 回滚通过恢复上一版来源并重跑 | 定义失效后的人工恢复路径 |
| `03-详细设计.md` §13 | 外部依赖绑定表已有 fail fast / fail closed / pending / failed / job failed 口径 | 避免 04 重新定义代码契约 |

已确认结论:

```text
P0 配置失效优先 fail fast 或 fail closed。
高风险配置失败不得 silent fallback。
P0 不依赖 config center、KMS 或 Vault;这些不可用不影响当前 P0 主线。
P0 不支持 last-known-good 自动回退和 hot reload。
配置漂移主要通过启动校验、config fingerprint、来源摘要、CI / review 和 job receipt 发现。
```

---

## 3. SOP 问题回答

1. 必填配置缺失时系统如何处理?

   回答：7 个 P0 正式配置项从外部来源角度不是必填,因为都有默认值;但装配出的 `CoreRuntimeConfig` 必须包含有效值。未显式配置时使用 defaults 并继续校验。若显式指定的 config file 缺失、不可读,或显式提供的 env / CLI flag 为空值、非法值,必须 fail fast。若未来新增无默认值的配置项,缺失时必须 fail fast,不得伪造默认值。

2. 配置类型错误、范围错误、交叉字段错误时如何处理?

   回答：在 `assemble CoreRuntimeConfig` 前阻断。类型错误、路径不可规范化、root 间混用、profile 范围不允许、reference resolver 允许 fail-open、普通来源包含 raw secret、配置项试图绕过 gate / audit / fingerprint / idempotency 时都必须 fail fast。高优先级配置非法不得回退到低优先级配置继续运行。

3. secret / KMS / Vault 不可用时如何处理?

   回答：P0 没有 secret 级正式配置项,也不直接读取 KMS / Vault,因此 KMS / Vault 不可用不应影响 P0 本地和 CI 主线。P1/P2 若引入 secret ref、credential ref、KMS 或 Vault,secret ref 缺失、格式非法、不可解析或权限不足时,对应 adapter 必须 fail fast 或 fail closed。任何情况下都不得把 raw secret 写入普通来源作为降级方案。

4. config center 不可达时如何处理?

   回答：config center 属于 P2,不参与 P0 配置来源链。P0 配置中出现 config center 或 admin override 来源时,应作为未知或越界配置 fail fast。未来如果引入 config center,必须单独设计不可达策略、last-known-good、审计和回滚;这些不能由本轮 04 隐式定义。

5. 配置漂移或过期如何发现和处理?

   回答：P0 不做在线漂移检测。漂移发现依赖版本化配置 review、CI 检查、启动时 config fingerprint / 来源摘要、job receipt、测试报告和运行日志。启动后配置来源变化不会影响已经运行中的 job;下一次 CLI / job 启动会重新读取并校验。发现漂移后,按 Step 10 恢复上一版来源并重跑。projection stale 不是配置漂移本身,但错误 projection root 可能导致 stale / rebuild,需要走 projection 恢复流程。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `04-配置设计.md` §11 | 尚未存在失效模式与降级策略章节 | 测试和验收无法判断失败时应该阻断、关闭、重试还是降级 |
| Step 5 来源优先级 | 已定义高优先级非法不回退 | 需要展开到缺失、重复、未知来源和非法来源 |
| Step 7 配置项清单 | 已定义配置项失败策略 | 需要收敛成统一失效模式表 |
| Step 8 敏感配置 | 已定义 P0 无 secret 正式项 | 需要明确 KMS / Vault 不可用不是 P0 主线失败 |
| Step 9 生效机制 | 已定义加载校验链 | 需要明确每个阶段失败后的系统行为 |
| Step 10 回滚规则 | 已定义恢复来源并重跑 | 需要作为失效后的恢复动作入口 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 失败口径 | 分散在来源、配置项、加载、回滚步骤 | 汇总为 fail fast / fail closed / pending / job failed / rebuild | 便于测试和验收引用 |
| 缺失配置 | 只知道外部非必填、runtime 必需 | 明确 defaults 可补齐,显式非法或无默认值缺失必须 fail fast | 防止“缺失”和“使用默认值”混淆 |
| config center | 只标为 P2 | 明确 P0 出现 config center 来源属于越界配置 | 防止误把在线配置当当前前置 |
| secret 不可用 | 只说 P0 无 secret | 明确 KMS / Vault 不可用不影响 P0,未来 ref 失败 fail fast / fail closed | 防止用 raw secret 降级 |
| 漂移处理 | 未集中说明 | 通过 fingerprint、来源摘要、CI / review、job receipt 发现;恢复来源并重跑 | 与无 hot reload 保持一致 |
| 03 回写 | 未判断 | 本步不新增错误枚举或恢复 API | 无需回写 03 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：高风险配置失败时全部 fail fast / fail closed | 行为确定,便于测试和验收 | 可用性不如自动回退 | 采用 |
| 方案 B：高优先级非法时自动回退低优先级 | 可用性较高 | 掩盖错误配置,破坏可追溯性 | 不采用 |
| 方案 C：引入 last-known-good 自动恢复 | 适合在线配置中心 | 当前无 config center 和在线 runtime,会新增状态和恢复契约 | 不采用 |
| 方案 D：允许 degraded 模式继续运行 | 某些非核心查询可继续 | L0-core P0 多数配置影响 truth、audit、outbox 或 reference 安全边界 | 仅 projection stale / rebuild 这类派生视图可采用 |

---

## 7. 结构化中间产物

#### 配置失效处理图: L0-core 配置失败决策

```text
[config source or runtime dependency failure]
        |
        v
[is it parse/type/cross-field config error?]
        |
        +--> yes --> [fail fast before runtime build]
        |
        v
[is it reference/gate/blob external read failure?]
        |
        +--> yes --> [fail closed]
        |
        v
[is it outbox publish failure?]
        |
        +--> yes --> [keep pending / mark failed]
        |
        v
[is it projection derivation failure?]
        |
        +--> yes --> [mark stale / rebuild]
        |
        v
[otherwise command/job dependency failure]
        |
        v
[return error / mark job failed]
```

关键说明:

- 本图只表达 P0 配置相关失效处理,不表达在线配置中心。
- 配置解析、类型校验和交叉字段校验失败必须发生在 runtime builder 前。
- `fail closed` 适用于 reference / gate / blob 等不能放行的外部读取边界。
- `pending / failed` 和 `stale / rebuild` 只适用于 outbox 与 projection 等可恢复支撑面。

### 7.1 失效模式表

| 失效模式 | 影响 | 系统行为 | 是否告警 | 测试切口 |
|---|---|---|---|---|
| 未提供外部配置且有 defaults | 使用默认 root / resolver config | 继续进入 parse / validate / cross-field validate | 否 | default config startup test |
| 显式 config file 路径缺失或不可读 | 无法确定配置来源 | fail fast | 是,启动 / CI 失败即可见 | missing config file test |
| config file 存在但格式错误 | 配置无法解析 | fail fast | 是 | malformed file test |
| 同级重复 key 或等价别名 key | 配置歧义 | fail fast | 是 | duplicate key test |
| 环境变量或 CLI flag 值为空 / 类型错误 | 高优先级非法 | fail fast,不回退低优先级 | 是 | invalid env / flag test |
| 未知 P0 配置 key | 可能拼写错误或越界配置 | project config / CLI flag fail fast;无关 env 可忽略,`CORE_` 前缀未知应 fail fast | 是 | unknown key test |
| root path 为空、不可规范化或越界 | 文件型 store 不可信 | fail fast | 是 | invalid path test |
| root path 权限不足 | store 不可用 | fail fast | 是 | permission denied test |
| source root 与 snapshot root 相同 | truth input 与发布输出混用 | fail fast | 是 | cross-field root collision test |
| audit / outbox / idempotency root 混用 | 追溯、发布和幂等状态污染 | fail fast | 是 | state root isolation test |
| projection root 与 truth / state root 混用 | 派生视图污染真相或状态 | fail fast | 是 | projection isolation test |
| reference resolver config 非法 | 引用解析边界不可信 | fail fast | 是 | invalid resolver config test |
| reference resolver 运行时读取失败 | 无法确认引用有效性 | fail closed | 是 | reference unavailable test |
| 普通来源包含 raw secret | 安全边界破坏 | fail fast,拒绝配置 | 是 | raw secret rejection test |
| future secret ref 格式非法或不可解析 | 真实 adapter 凭据不可用 | adapter fail fast / fail closed | 是 | secret ref failure test(P1/P2) |
| KMS / Vault 不可用 | P0 不依赖;P1/P2 secret 解析不可用 | P0 不受影响;P1/P2 fail fast / fail closed | 是,仅 P1/P2 | secret provider unavailable test(P1/P2) |
| config center 不可达 | P0 不依赖 | P0 不受影响;P0 出现该来源应 fail fast | 是,若被配置 | unsupported config center test |
| 试图配置关闭 gate / audit / fingerprint / idempotency | 绕过架构红线 | fail fast + 设计变更流程 | 是 | forbidden switch test |
| 配置来源在 job 运行中变更 | 运行中配置漂移 | 当前 job 不热更新;下一次启动重新读取 | 视 profile 而定 | no hot reload test |
| config fingerprint 与预期不一致 | 可能运行了错误配置 | fail fast 或阻断 release-like / replay 入口 | 是 | expected fingerprint mismatch test |
| outbox publish 失败 | 事件未发布 | 保留 pending / mark failed,允许 relay 重试 | 是 | outbox publish failure test |
| projection rebuild 失败 | 查询视图不新鲜 | 标记 stale / rebuilding,不修改 truth | 是 | projection stale test |
| audit append 失败 | 追溯链不完整 | 不得静默成功;command / job 失败或事务回滚 | 是 | audit append failure test |

### 7.2 处理策略定义表

| 策略 | 含义 | P0 适用范围 | 禁止误用 |
|---|---|---|---|
| fail fast | 在启动、作业启动或命令提交前后立即失败,不继续执行 | 配置 parse / type / cross-field、root 不可用、raw secret、禁止配置化项 | 不得在高优先级非法时回退低优先级 |
| fail closed | 外部读取不可确认时按“不允许 / 不通过”处理 | reference / gate / blob 等安全或门禁读取 | 不得默认放行 |
| pending / failed | 记录待恢复状态,由后台重试或人工处理 | outbox publish / relay | 不得当作 truth 已失败回滚 |
| stale / rebuild | 派生视图失效,需要重建 | projection index | 不得污染 truth 或发布基线 |
| job failed | 后台 job 失败并保留可重跑线索 | toolchain runner、snapshot derive、fingerprint recalc | 不得回滚已经成立的 truth |
| last-known-good | 使用上一版已知可用配置继续服务 | 当前 P0 不适用 | 不得在 P0 隐式实现 |
| degraded | 降级继续提供部分能力 | P0 仅限派生视图类能力,如 projection stale | 不得用于 truth、audit、outbox、gate、fingerprint、idempotency |

### 7.3 漂移与过期处理表

| 场景 | 发现方式 | 处理方式 |
|---|---|---|
| project config file 与 review 后版本不一致 | 版本库状态、CI diff、config fingerprint | 阻断 CI / release-like;恢复受控版本 |
| env / CLI override 非预期 | job receipt、启动日志、来源摘要 | 停止当前入口,移除 override 后重跑 |
| release-like 运行的 config fingerprint 非预期 | expected fingerprint check、发布记录比对 | fail fast,不得继续发布 |
| operations-replay 使用过期配置 | replay receipt、配置来源摘要、历史 baseline 比对 | 停止 replay,恢复匹配配置后重放 |
| 运行中配置来源被修改 | 下一次启动 fingerprint 变化或文件 mtime 变化 | 当前运行不热更新;下一次启动重新校验 |
| secret ref 过期(P1/P2) | secret provider 返回过期 / revoked | adapter fail fast / fail closed,轮换 ref 后重启 |

---

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 配置 parse / type / cross-field 失败必须 fail fast | 否 | 配置设计失败策略 | 无 | 无回写 |
| reference / gate / blob 不可确认时 fail closed | 否 | 承接 03 外部依赖策略 | 无 | 无回写 |
| outbox publish 失败保留 pending / failed,projection 失败 stale / rebuild | 否 | 承接 03 支撑面策略 | 无 | 无回写 |
| P0 不实现 last-known-good、hot reload 或 config center 降级 | 否 | 范围分级 | 无 | 无回写 |
| 如果后续要新增 `ConfigError` 细分枚举、config fingerprint 校验 API 或 last-known-good store | 是 | error / runtime config / storage contract 变化 | `03-详细设计.md` §13 / §16 / contracts 章节 | 待回写 |

说明:

- 本步只定义配置失效语义和测试切口,不新增 Rust error enum、DTO、trait、repository 或恢复 API。
- `config fingerprint` 在本步作为审计 / 验收摘要概念使用;若要进入正式结构体字段或 API,必须先回写 03。

---

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §11。

````md
## 11. 失效模式与降级 / fail-fast 策略

> 校准来源：
> - `design-calibration/04_config_step_11_failure_modes.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“失效模式表”“处理策略定义表”“漂移与过期处理表”和“对详细设计的影响判定”小节，了解本章失败策略如何收敛。

P0 配置失效优先采用 fail fast 或 fail closed。配置 parse、type validate、cross-field validate、root path 校验、raw secret 检查和禁止配置化项检查失败时,必须在 runtime builder 前阻断。高优先级配置非法时不得回退到低优先级配置继续运行。

reference / gate / blob 等外部读取不可确认时按 fail closed 处理。outbox publish 失败保留 pending / failed,projection 失败标记 stale / rebuilding,toolchain runner 失败记录 job failed。audit append 失败不得静默成功。

P0 不依赖 config center、KMS 或 Vault,也不实现 last-known-good、hot reload 或在线降级。配置漂移通过版本化配置、CI / review、启动日志、job receipt、config fingerprint 和来源摘要发现。发现漂移后,按配置变更与回滚规则恢复来源并重新执行 CLI / job。
````

---

## 10. 待确认事项

- 是否接受 P0 配置失效优先 fail fast / fail closed。
- 是否接受 P0 不实现 last-known-good 自动回退。
- 是否接受 config center / KMS / Vault 不可用不影响 P0 主线。
- 是否接受 config fingerprint 只作为摘要概念,暂不进入 03 代码契约。
- 是否接受本步无需回写 `03-详细设计.md`。

---

## 11. 进入下一步条件

- [x] 用户确认配置失效处理图。
- [x] 用户确认失效模式表。
- [x] 用户确认处理策略定义表和漂移与过期处理表。
- [x] 用户确认本步无需回写 `03-详细设计.md`。
- [x] Step 11 状态从 `[~]` 更新为 `[x]`。
