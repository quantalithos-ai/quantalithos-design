# L0-bus 04 配置设计 Step 11: 失效模式与降级 / fail-fast 策略

> 本文件是 `projects/L0-bus/04-配置设计.md` 的 Step 11 中间产物。
> 本步定义配置缺失、错误、不可达、过期、漂移时系统如何表现。
> 本步不创建正式 `04-配置设计.md`,不引入 silent fallback。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 11 |
| 主题 | 定义失效模式与降级 / fail-fast 策略 |
| 状态 | 已确认 |
| 正式回填位置 | `04-配置设计.md` §11 |
| 是否修改正式 `04-配置设计.md` | 否 |
| 是否必须判定对 `03-详细设计.md` 的影响 | 是 |

---

## 2. 本步输入

| 输入 | 关键结论 | 本步使用方式 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | 高优先级非法值不回退;config center 不进入 P0 | 确定错误配置和不可达来源的处理 |
| `04_config_step_07_config_items.md` | 配置项默认值、必填、失败策略已定义 | 汇总缺失、类型、范围和交叉字段失败 |
| `04_config_step_08_sensitive_secrets.md` | 敏感引用不可明文,P0 冷更新 | 确定 secret / provider 不可用的行为 |
| `04_config_step_09_load_validate_apply.md` | P0 不支持 reload / hot update;失败不构造 runtime graph | 确定生效失败和旧 graph 保留规则 |
| `04_config_step_10_change_audit_rollback.md` | P0 回滚为恢复配置 + 重启 | 确定 last-known-good 只作为人工恢复配置来源 |

---

## 3. SOP 问题回答

### 3.1 必填配置缺失时系统如何处理?

分三类处理:

| 缺失类型 | 系统行为 |
|---|---|
| 有安全默认值的配置缺失 | 使用 code defaults,再进入完整 validator |
| 运行时必需且无默认值的配置缺失 | fail-fast,不构造 `RuntimeGraph` |
| external kind 所需 ref 缺失 | fail-fast 或 fail-closed,不自动降级到 in-memory |

缺失配置不得 silent fallback。只有配置项明确拥有 code default 时,才能补默认值。

### 3.2 配置类型错误、范围错误、交叉字段错误时如何处理?

| 错误类型 | 系统行为 |
|---|---|
| JSON parse error | 指定配置文件不可用,入口启动失败 |
| env parse error | 高优先级非法值 fail-fast,不回退文件值 |
| unsupported enum | fail-fast |
| integer range error | fail-fast |
| kind/ref mismatch | fail-fast |
| forbidden boundary violation | fail-closed |

所有错误都必须给出字段路径和错误分类,但不得输出敏感值。

### 3.3 secret / KMS / Vault 不可用时如何处理?

P0 不绑定具体 KMS / Vault 产品。对所有 provider 不可用类问题采用统一规则:

- ref 形态非法: `ConfigValidator` fail-fast。
- ref 合法但 provider 不可用: adapter constructor / provider adapter fail-fast。
- 不允许回退到明文密钥。
- 不允许自动切换到不需要 secret 的 profile 来伪装成功。
- 允许操作者回滚到上一份有效 ref 并重启入口。

### 3.4 config center 不可达时如何处理?

P0 不使用 config center,因此:

- config center 不可达不影响 P0 默认路径。
- 如果未来 P1/P2 引入 config center,必须单独定义权限、审计、缓存、last-known-good、漂移检测和回滚。
- 当前任何配置把 config center 声明为 P0 必需来源,都应被视为 unsupported source 并 fail-fast。

### 3.5 配置漂移或过期如何发现和处理?

P0 不做运行中配置漂移自动修复。发现方式和处理方式:

| 漂移 / 过期类型 | 发现方式 | 处理方式 |
|---|---|---|
| 文件内容与期望版本不同 | 启动校验、hash / fingerprint 检查、测试报告 | fail-fast 或人工确认后重启 |
| env override 与文档不一致 | 启动校验和配置摘要 | fail-fast |
| secret ref 过期 | provider adapter 构造失败或 health check 失败 | 修复 provider 或回滚 ref 后重启 |
| running graph 与磁盘配置不同 | P0 不自动感知;可通过配置摘要对比发现 | 下次重启读取;如需立即生效则重启 |
| fixture 漂移 | CI 配置测试和 snapshot 检查 | 测试失败,修复 fixture |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 失败策略散落在 Step 5/7/8/9 | 配置项有局部失败策略,但缺少统一失效模式表 | 测试方案无法系统覆盖 | 本步汇总失效模式 |
| last-known-good 口径容易被误解 | Step 10 提到恢复旧配置,但不是运行时自动回退 | 可能实现 silent fallback | 本步明确 P0 不自动 last-known-good,只支持人工恢复旧配置 |
| degraded 需要边界 | in-memory / fixture 是显式 profile,不是失败后自动降级 | 可能掩盖外部依赖失败 | 本步明确不自动 degrade |
| config center 是未来能力 | 可能被误写成当前来源链 | P0 loader 生命周期被扩大 | 本步明确 P0 不依赖 config center |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 失效模式 | 分散在各 Step | 有统一失效模式表 | 便于测试和验收 |
| fail-fast | 多处提到 | 明确缺失、解析、类型、范围、交叉字段均不回退 | 行为可预测 |
| fail-closed | 主要用于安全边界 | 明确 forbidden boundary、redaction 关闭、安全 policy 放宽均 fail-closed | 防止安全红线被配置绕过 |
| degraded | 未统一 | 只允许显式 profile,不允许失败后自动降级 | 防止伪装成功 |
| last-known-good | 未统一 | 不做运行时自动 LKG;只作为人工回滚旧配置 | 避免 silent fallback |

---

## 6. 配置设计取舍

### 6.1 是否使用 last-known-good 自动回退

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. P0 不自动回退,失败即失败 | 行为显式,测试简单 | 可用性较保守 | 采用 |
| B. 自动回退上一份已知可用配置 | 可用性更好 | 容易隐藏高优先级错误,需要缓存和审计 | 不采用 |
| C. 仅对低风险项自动回退 | 局部灵活 | 规则复杂 | 不采用 |

结论: P0 不做自动 last-known-good。旧配置只能作为人工回滚输入,且回滚后仍需重新校验。

### 6.2 是否自动降级到 in-memory

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 不自动降级 | 不伪装成功,符合交付事实 | 外部依赖失败时入口不可用 | 采用 |
| B. 外部失败自动降级到 in-memory | 可用性看似更好 | 会丢失真实 delivery / store 语义 | 不采用 |
| C. 仅 local 自动降级 | 本地方便 | 环境行为不一致 | 不采用 |

结论: in-memory 是显式 profile,不是失败降级策略。

### 6.3 config center 是否纳入 P0 失效模式

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. P0 不纳入,只说明 unsupported | 符合当前来源链 | 后续生产治理需另写 | 采用 |
| B. P0 纳入并设计缓存 | 生产感更强 | 超出 P0,改变 loader 生命周期 | 不采用 |
| C. 只写占位字段 | 看似预留 | 容易被实现误用 | 不采用 |

结论: config center 不进入 P0。未来引入时必须重开配置设计。

---

## 7. 结构化中间产物

### 7.1 失效模式表

| 失效模式 | 影响 | 系统行为 | 是否告警 | 测试切口 |
|---|---|---|---|---|
| 未指定配置文件且 defaults 可覆盖 | 使用默认可验证路径 | 使用 code defaults 后继续 validator | 否,记录配置摘要即可 | config default path test |
| 指定配置文件不存在 | 入口无法确认配置来源 | fail-fast,启动失败 | 是 | config file missing test |
| JSON 解析失败 | 无法形成 `RuntimeConfig` | fail-fast,启动失败 | 是 | invalid JSON test |
| env override 类型错误 | 高优先级值非法 | fail-fast,不回退 JSON/file/default | 是 | env parse error test |
| 必填 root 配置组缺失且无默认值 | `ValidatedRuntimeConfig` 不完整 | fail-fast | 是 | missing required group test |
| enum 值不支持 | adapter / policy 不可构造 | fail-fast | 是 | unsupported enum test |
| batch / timeout 范围错误 | worker/job/API 行为不可控 | fail-fast | 是 | range validation test |
| kind/ref mismatch | 外部 adapter 缺少引用或本地 profile 带敏感引用 | fail-fast | 是 | cross-field validation test |
| security policy 被放宽 | 安全边界被破坏 | fail-closed | 是 | forbidden boundary test |
| redaction policy 被关闭 | 输出可能泄露敏感信息 | fail-closed | 是 | redaction config test |
| secret / connection ref 形态非法 | provider 无法解析 | fail-fast | 是 | secret ref shape test |
| provider 不可用 | external adapter 不可构造 | fail-fast,不得自动切回 in-memory | 是 | fake provider unavailable test |
| config center 声明为 P0 source | 来源链超出 P0 | unsupported source,fail-fast | 是 | unsupported source test |
| runtime reload 请求 | P0 不支持运行时替换配置 | 拒绝请求,保留旧 graph | 是,记录 unsupported reload | reload rejection test |
| hot update 单 key 请求 | P0 不支持局部热更新 | 拒绝请求,保留旧 graph | 是,记录 unsupported hot update | hot update rejection test |
| 文件变更但入口未重启 | 运行中配置不变 | 不自动感知;下次重启读取 | 否,可在诊断中显示配置摘要 | startup-only behavior test |
| fixture 漂移 | CI 结果不稳定 | 测试失败,修复 fixture | 是,CI report | fixture snapshot test |
| reports / artifacts 泄露敏感值 | 安全验收失败 | redaction check 失败 | 是 | redaction report test |

### 7.2 fail-fast / fail-closed / degraded / last-known-good 规则

| 策略 | 适用场景 | 本项目口径 |
|---|---|---|
| fail-fast | parse、type、range、missing required、unsupported enum、unsupported source | 立即失败,不构造 `RuntimeGraph` |
| fail-closed | security boundary、redaction、forbidden behavior | 拒绝启动或拒绝请求,不得放宽安全边界 |
| degraded | 仅当用户显式选择 in-memory / fixture profile | 不因外部失败自动降级 |
| last-known-good | 人工恢复上一份已知可用配置并重启 | 不做运行时自动回退 |

### 7.3 失效处理流程图

```text
config input
  -> parse / merge
  -> validate
     +-- valid -> build RuntimeGraph
     +-- fail-fast -> stop startup or job invocation
     +-- fail-closed -> stop startup or reject request
     +-- unsupported reload -> keep old RuntimeGraph
  -> audit / diagnostic summary
  -> operator may restore previous config and restart
```

图后说明:

- P0 不存在“校验失败但继续启动”的路径。
- P0 不存在“外部依赖失败后自动切回 in-memory”的路径。
- P0 不存在“运行时自动 last-known-good”的路径。

---

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 配置失效时不构造新的 `RuntimeGraph` | 否 | 沿用 `RuntimeBuilder` 失败口径 | 无 | 无回写 |
| P0 不自动 last-known-good,只支持人工恢复旧配置并重启 | 否 | 配置运维口径细化 | 无 | 无回写 |
| P0 不自动降级到 in-memory | 否 | 配置失败策略细化 | 无 | 无回写 |
| config center 不进入 P0,声明为 P0 source 时 fail-fast | 否 | 来源链细化 | 无 | 无回写 |
| 如未来引入自动 LKG 或 config center cache | 是 | 新增缓存、漂移检测、审计和 reload 机制 | `03-详细设计.md` §13 / §17 | 当前不采用 |

本步判定:

```text
Step 11 不要求回写 03-详细设计.md。

理由:
- 本步只汇总失效模式和失败策略。
- 没有新增配置来源、缓存、自动回退或 reload 机制。
- 没有改变 loader / validator / builder 的函数签名。
```

---

## 9. 回填草稿

正式 `04-配置设计.md` §11 应从本文件摘录,不在回填草稿中重复完整表格。

建议回填结构:

```text
## 11. 失效模式与降级 / fail-fast 策略

> 校准来源:
> - `design-calibration/04_config_step_11_failure_modes.md`
>
> 延伸阅读:
> - 建议继续阅读 Step 11 §7.1~§7.3,获取失效模式表、策略口径和失效处理流程图。

### 11.1 失效模式表

摘录 `04_config_step_11_failure_modes.md` §7.1。

### 11.2 fail-fast / fail-closed / degraded / last-known-good 规则

摘录 `04_config_step_11_failure_modes.md` §7.2。

### 11.3 失效处理流程图

摘录 `04_config_step_11_failure_modes.md` §7.3。
```

回填时必须保留以下说明:

- 高风险失败不得 silent fallback。
- in-memory / fixture 是显式 profile,不是失败降级。
- old config 只能作为人工回滚输入,不是运行时自动 LKG。
- config center 不进入 P0。

---

## 10. 待确认事项

| 待确认项 | 可选方案 | 推荐方案 | 原因 | 当前处理 |
|---|---|---|---|---|
| 是否自动 last-known-good | A. 不自动;B. 自动;C. 低风险项自动 | 推荐 A | 自动 LKG 会隐藏错误并需要缓存审计机制 | 按 A 写入本步 |
| external 失败是否自动 in-memory | A. 不自动;B. 自动;C. local 自动 | 推荐 A | 避免伪装成功和语义丢失 | 按 A 写入本步 |
| config center 是否进入 P0 | A. 不进入;B. 进入;C. 占位 | 推荐 A | P0 来源链已收稳为 defaults / JSON / env / refs | 按 A 写入本步 |
| file on disk changed 是否自动 reload | A. 不自动;B. 自动 reload;C. 提示但不 reload | 推荐 A | P0 不支持 reload | 按 A 写入本步 |

本步没有阻塞项。上述待确认项均已选择推荐方案作为当前配置设计口径。

---

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 配置失效模式已覆盖 | 已满足 | §7.1 覆盖缺失、错配、不可达、漂移、泄露、reload 等 |
| fail-fast / fail-closed / degraded / LKG 口径已明确 | 已满足 | §7.2 定义 |
| 高风险失败不 silent fallback | 已满足 | 多处明确不自动回退和不自动降级 |
| 已判定对 `03-详细设计.md` 的影响 | 已满足 | §8 判定无回写 |

结论: Step 11 可以标记为已确认,并进入 Step 12“定义测试、验收、实施与运维承接”。
