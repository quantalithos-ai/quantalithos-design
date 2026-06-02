# Step 11. 定义失效模式与降级 / fail-fast 策略

> 本文件是 `projects/L1-conversation/04-配置设计.md` 的 Step 11 中间产物。
> 本步定义配置缺失、错误、不可达、过期、漂移和 forbidden boundary 命中时系统如何表现。
> 本步不写测试用例全集,不新增错误枚举,不回写 `03-详细设计.md`。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 11
- 回填章节: `projects/L1-conversation/04-配置设计.md` §11 失效模式与降级 / fail-fast 策略

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | 来源优先级、冲突处理和缺失策略 | 固定 fail-fast / fallback 规则 |
| `04_config_step_07_config_items.md` | 配置项清单和失败策略 | 生成失效模式表 |
| `04_config_step_08_sensitive_secrets.md` | secret / credential ref 和禁止输出规则 | 固定 sensitive failure 处理 |
| `04_config_step_09_load_validate_apply.md` | loader / validator / runtime builder 生效机制 | 固定 parse / type / cross-field 失败处理 |
| `04_config_step_10_change_audit_rollback.md` | 变更、审计和回滚 | 固定漂移、失败变更和回滚行为 |

已确认结论:

```text
高风险配置失败不得 silent fallback。
P0 配置失败优先 fail-fast / fail-closed;只有已经由领域或 adapter 明确允许的外部不可用场景,才可以表达为 unresolved、retry pending、failed、stale 或 diagnostic marker。
配置失败不得伪装成功,不得自动切换 fake adapter,不得回滚已提交 Conversation truth。
```

## 3. SOP 问题回答

### 3.1 必填配置缺失时系统如何处理?

无安全默认值的必填配置缺失必须 fail-fast。configured adapter 缺少 credential ref、operations job 缺少 run id、reports path 指定但不可写,都不得静默回退。

### 3.2 配置类型错误、范围错误、交叉字段错误时如何处理?

类型错误、范围错误、重复 key、unknown key、unsupported profile 和 cross-field validation failure 都必须 fail-fast,并输出脱敏 config validation report。

### 3.3 secret / KMS / Vault 不可用时如何处理?

P0 不依赖 KMS / Vault 产品。configured adapter 需要解析 credential ref 时,ref 格式非法 fail-fast,provider 不可用 fail-closed;resolver 场景可在明确允许时输出 unresolved / degraded marker,但不得伪造来源 truth。

### 3.4 config center 不可达时如何处理?

P0 不支持 config center。配置中启用 config center、admin override、remote config 或 hot reload 视为 unsupported profile,fail-fast。若 P1/P2 后续引入,需单独设计。

### 3.5 配置漂移或过期如何发现和处理?

配置漂移通过 config validation report、run id、config version、source summary、profile summary 和 audit trace 发现。发现漂移后不自动修复 truth,只拒绝新配置、停止受影响入口、恢复上一份已知可用配置或输出 diagnostic marker。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| Step 5~10 | 已定义单点失败策略,但未集中成失效模式表 | 测试和验收无法直接引用 |
| `03-详细设计.md` | 已有外部不可用的 unresolved / failed / retry 语义 | 需要区分配置失败与运行期外部失败 |
| 当前旧 `05/06` | 未按新版配置失败模式重写 | 后续测试验收需要承接本步 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 缺失配置 | 分散在配置项清单 | 集中说明有默认值与无默认值的处理差异 | 便于测试 |
| 错配置 | 分散在 loader 规则 | 明确类型、范围、重复 key、cross-field 一律 fail-fast | 避免 silent fallback |
| secret 不可用 | 只说明 ref 边界 | 明确非法 ref fail-fast,provider 不可用 fail-closed / degraded marker | 支撑安全门禁 |
| 配置漂移 | 未集中说明 | 通过 validation report、run id、audit trace 发现,不自动修复 truth | 防止配置漂移污染事实 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 高风险失败 fail-fast / fail-closed | 行为可测试,安全边界清楚 | 可用性低于 silent fallback | 采用 |
| 方案 B: 错配置回退默认值 | 启动成功率高 | 掩盖错误,可能启用 fake 或弱安全 | 不采用 |
| 方案 C: 外部依赖不可用全部 fail-fast | 简单 | 会破坏 resolver unresolved、outbox retry 和 projection stale 既有语义 | 不采用 |
| 方案 D: 允许自动修复配置漂移 | 看似智能 | 可能覆盖 truth 或隐藏变更责任 | 不采用 |

推荐方案 A,并保留领域已定义的 degraded marker。

原因:

- 配置失败和运行期外部失败是两类问题。前者必须阻断或拒绝;后者可按领域语义表达 unresolved、retry pending、failed 或 stale。
- P0 的验收需要可判定,不能依赖 silent fallback。

## 7. 结构化中间产物

### 7.1 失效模式表

| 失效模式 | 影响 | 系统行为 | 是否告警 | 测试切口 |
|---|---|---|---|---|
| 指定 JSON 文件不可读 / 不存在 | runtime 或 job 无法构造 | fail-fast,不使用 defaults 伪装成功 | 是 | config_file_missing |
| JSON parse 失败 / 重复 key | 配置语义不确定 | fail-fast | 是 | config_duplicate_key |
| unknown key / 等价别名冲突 | 可能隐藏拼写错误 | fail-fast | 是 | config_unknown_key |
| env override 类型错误 | 高优先级值非法 | fail-fast,不得回退低优先级 | 是 | config_env_type_error |
| unsupported profile | profile 不在 Step 6 矩阵中 | fail-fast | 是 | config_unsupported_profile |
| 必填项无默认值且缺失 | adapter 或 job 无法成立 | fail-fast | 是 | config_missing_required |
| configured adapter 缺 credential ref | publisher / resolver / handoff 无法安全连接 | fail-fast | 是 | config_missing_credential_ref |
| credential ref 格式非法 | secret boundary 失败 | fail-fast | 是 | config_invalid_credential_ref |
| provider 不可用 | configured adapter 无法解析凭据 | fail-closed;resolver 可输出 unresolved marker | 是 | config_secret_provider_unavailable |
| raw secret / raw token 出现在配置源 | 安全红线命中 | reject config,fail-fast | 是,一票否决 | config_raw_secret_rejected |
| forbidden body 出现在配置、报告或诊断 | 数据归属红线命中 | reject / fail-fast,记录 safe evidence | 是,一票否决 | config_forbidden_body_rejected |
| reports / artifacts path 不可写 | 证据无法生成 | job / gate fail-fast | 是 | config_report_path_unwritable |
| reports / artifacts 额外加入项目名层级 | 证据路径不符合规范 | fail-fast | 是 | config_report_path_shape |
| batch / retry / timeout 越界 | job 行为不可控 | fail-fast | 是 | config_job_policy_out_of_range |
| projection rebuild batch 超过 jobs max batch | 交叉字段冲突 | fail-fast | 是 | config_projection_batch_conflict |
| redaction policy 不是 strict | 安全下限被降低 | fail-fast | 是,一票否决 | config_redaction_non_strict |
| fake adapter 标记 production success | evidence 被污染 | fail-fast | 是,一票否决 | config_fake_as_production |
| config center / admin override / hot reload 启用 | P0 unsupported capability | fail-fast / unsupported | 是 | config_unsupported_remote |
| 配置漂移 | 不同入口使用不同配置版本 | 拒绝新配置或停止受影响入口;输出 diagnostic | 是 | config_drift_detected |
| 运行期 publisher 不可达 | outbox 无法发布 | outbox retry pending / failed,truth 不回滚 | 是 | runtime_publisher_unavailable |
| 运行期 resolver 不可达 | 来源快照不可刷新 | unresolved / stale marker,不补造来源正文 | 是 | runtime_resolver_unavailable |
| 运行期 handoff 不可达 | trace / archive 交接失败 | retry pending / failed,truth 不回滚 | 是 | runtime_handoff_unavailable |

### 7.2 fail-fast / degraded 边界表

| 类型 | 策略 | 说明 |
|---|---|---|
| 配置结构错误 | fail-fast | parse、type、duplicate、unknown、unsupported profile |
| 安全红线命中 | fail-fast / 一票否决 | raw secret、forbidden body、non-strict redaction、fake-as-production |
| configured adapter 缺 ref | fail-fast | 配置不完整,不能启动 |
| secret provider 不可用 | fail-closed 或 resolver degraded | 不允许回退 raw secret 或 fake success |
| runtime publisher / handoff 不可用 | retry pending / failed | 已提交 truth 不回滚 |
| runtime resolver 不可用 | unresolved / stale | 不补造来源 truth |
| 配置漂移 | reject / stop affected entry / diagnostic | 不自动修复 truth |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 配置结构、安全和 cross-field 错误 fail-fast / fail-closed | 否 | 配置失败策略细化 | 无 | 无回写 |
| 运行期 publisher / resolver / handoff 不可用沿用 retry / unresolved / failed / stale 语义 | 否 | 与 `03` 运行期失败语义一致 | 无 | 无回写 |
| 配置漂移只输出 diagnostic,不自动修复 truth | 否 | 与 consistency diagnostic-only 口径一致 | 无 | 无回写 |
| raw secret / forbidden body / fake-as-production 设为一票否决输入 | 否 | 安全门禁细化 | 无 | 无回写 |

## 9. 回填草稿

正式 `04-配置设计.md` §11 建议采用以下结构:

```text
11. 失效模式与降级 / fail-fast 策略
  11.1 失效模式表
  11.2 fail-fast / degraded 边界表
  11.3 对 03-详细设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §11.1 | `design-calibration/04_config_step_11_failure_modes.md` §7.1 |
| §11.2 | `design-calibration/04_config_step_11_failure_modes.md` §7.2 |
| §11.3 | `design-calibration/04_config_step_11_failure_modes.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 12 的待确认事项。

后续 Step 必须继续收口:

- Step 12 将本步失效模式交给测试、验收、实施和运维承接。
- `05-测试方案.md` 需要按 §7.1 的测试切口生成配置测试矩阵。
- `06-验收标准.md` 需要将 raw secret、forbidden body、fake-as-production、non-strict redaction 设为一票否决。

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 失效模式表已形成 | 通过 | §7.1 |
| fail-fast / degraded 边界已形成 | 通过 | §7.2 |
| silent fallback 风险已排除 | 通过 | §6 / §7.2 |
| 对 03 影响已有判定 | 通过 | §8 当前无回写 |
| 可以进入 Step 12 | 通过 | 下一步定义测试、验收、实施与运维承接 |
