# Step 11. 定义失效模式与降级 / fail-fast 策略

> 本文件是 `projects/L1-work/04-配置设计.md` 的 Step 11 中间产物。
> 本步定义配置缺失、错误、不可达、过期、漂移时系统如何表现。
> 本步不新增 `WorkRuntimeConfig` 字段,不新增错误枚举,不引入 last-known-good 自动回退或在线配置中心。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 11
- 回填章节: `projects/L1-work/04-配置设计.md` §11 失效模式与降级 / fail-fast 策略

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | 普通来源优先级、非法高优先级 fail-fast、config center / admin override 不进 P0 | 固定缺失、冲突和非法覆盖失败策略 |
| `04_config_step_07_config_items.md` | P0 28 个配置项、默认值、失败策略和 adapter 条件必填 | 固定失效模式覆盖范围 |
| `04_config_step_08_sensitive_secrets.md` | ref-only sensitive、raw secret 禁止、provider 不可用 fail-closed / unresolved | 固定敏感配置不可读策略 |
| `04_config_step_09_load_validate_apply.md` | parse、type validation、cross-field validation、startup / job-run-start 生效 | 固定失效发生时机 |
| `04_config_step_10_change_audit_rollback.md` | 配置变更审计和回滚规则 | 固定失败后的恢复方式 |

已确认结论:

```text
L1-work P0 配置失效优先 fail-fast 或 fail-closed。
高风险配置失败不得 silent fallback,不得自动切换 fake success。
P0 不依赖 config center、admin override、KMS 或 Vault;这些来源在 P0 中出现应视为 unsupported 或越界。
last-known-good 只作为人工恢复上一版配置的目标,不是运行时自动吞错机制。
degraded 只允许用于派生、外部引用、handoff 或 outbox 支撑面,不得用于 truth、metadata、idempotency、visibility、audit / outbox 成立边界。
```

## 3. SOP 问题回答

### 3.1 必填配置缺失时系统如何处理?

P0 默认路径下,Step 7 的 28 个配置项都有 code defaults,因此“未显式配置”不等于缺失失败。loader 应使用 defaults 并继续执行 type / cross-field / forbidden boundary validation。

必须阻断的缺失包括:

- 指定了 JSON config file,但文件不存在、不可读或解析失败。
- configured adapter 需要 endpoint / credential / target ref,但配置缺失。
- entry local args 指定当前 job 必需的 run id、scope 或 replay input,但缺失。
- env override 存在但为空值或不合法。
- 未来新增无默认值配置项,但未通过 03 / 04 明确必填和失败口径。

### 3.2 配置类型错误、范围错误、交叉字段错误时如何处理?

在 `WorkRuntimeBuilder` 装配前或 job-run-start 前 fail-fast,不得回退低优先级来源继续运行。

必须 fail-fast 的错误包括:

- enum 字符串不支持。
- duration、byte size、page limit、batch size、parallelism、retry、timeout 非法。
- `idempotency.reserved_record_max_age > idempotency.command_retention`。
- retry policy 的 `max_delay < base_delay` 或 attempt / delay 越界。
- `features.advanced_search_enabled=true`,但没有 P0 search contract / backend。
- 配置试图关闭 metadata、idempotency、visibility、audit / outbox、external body exclusion 或 query no-write。

### 3.3 secret / KMS / Vault 不可用时如何处理?

P0 不直接读取 KMS / Vault,也不允许普通配置保存 secret material。

ref-only sensitive 的失败口径:

| 场景 | 处理 |
|---|---|
| ref 字段格式非法 | startup 或 job-run-start fail-fast |
| configured adapter 所需 ref 缺失 | startup fail-fast |
| provider / resolver 启动时不可用 | adapter fail-closed,不得自动切 fake |
| resolver 调用阶段来源不可解析 | 按对应 flow 写 explicit unresolved / failed marker,或 command reject |
| 普通配置出现 raw secret / raw token / raw payload | startup fail-fast,sanitized error |

### 3.4 config center 不可达时如何处理?

P0 不支持 config center 或 admin override。处理规则:

- 未配置 config center: 不影响 P0。
- P0 配置中出现 config center / admin override source: unsupported profile,fail-fast。
- 未来 P1/P2 若引入 config center,必须新增在线配置、审计、权限、last-known-good 和回滚专项设计。

### 3.5 配置漂移或过期如何发现和处理?

P0 不做在线热更新和自动漂移修复。漂移发现依赖:

- config file digest / source summary。
- startup validation outcome。
- env override key list。
- job run receipt / report。
- CI config tests。
- review / release gate。

发现漂移后:

- 已运行 runtime 不热更新。
- 已开始 job run 不重读配置。
- 按 Step 10 恢复上一版 JSON / env / ref 或修正参数后冷重启 / 新建 job run。
- 已提交 Work truth 不回滚。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | 已定义来源冲突,但未集中列失效模式 | 本步汇总缺失、错配、非法高优先级和 unsupported source |
| `04_config_step_07_config_items.md` | 每项有失败策略,但测试 / 验收无法按统一表引用 | 本步形成统一失效模式表 |
| `04_config_step_08_sensitive_secrets.md` | 已定义 raw secret 禁止和 provider 失败口径 | 本步映射到 fail-fast / fail-closed / unresolved |
| `04_config_step_09_load_validate_apply.md` | 已定义加载校验链 | 本步定义各阶段失败后的系统行为 |
| `04_config_step_10_change_audit_rollback.md` | 已定义恢复上一版配置和新 job run | 本步作为配置失效后的恢复动作入口 |
| 正式 `04-配置设计.md` | 本 Step 撰写时尚未存在 §11;当前已回填正式 §11 | 本步提供回填来源 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 缺失配置 | 分散在来源和配置项清单 | 区分 defaults 可补齐、显式来源缺失、configured ref 缺失和 job args 缺失 | 防止缺失被误解为关闭安全门禁 |
| 错配置 | 已有 fail-fast 原则 | 细化类型、范围、交叉字段、feature 和 forbidden boundary | 让测试切口可落地 |
| 敏感 ref 不可读 | Step 8 已定义 | 映射为 ref shape fail-fast、provider fail-closed、resolver unresolved / failed marker | 防止 raw secret 或 fake success 降级 |
| config center | 已标为 P1/P2 | 明确 P0 出现即 unsupported fail-fast | 防止实现侧预支远程配置 |
| 漂移 / 过期 | Step 10 有回滚 | 补发现方式和处理方式 | 支撑测试、验收和实施承接 |
| degraded | 只有零散 marker | 明确只适用于派生 / 支撑面,不得用于 truth 边界 | 防止高风险 silent fallback |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 高风险配置失败 fail-fast / fail-closed | 行为确定,测试和验收可判定 | 可用性不如自动回退 | 采用 |
| 方案 B: 高优先级非法自动回退低优先级 | 看似提升可用性 | 掩盖错误配置,破坏审计和验收 | 不采用 |
| 方案 C: P0 引入 last-known-good 自动恢复 | 适合在线配置中心 | 当前无 reload / config center / runtime state 契约 | 不采用 |
| 方案 D: 广泛 degraded 继续运行 | 可减少中断 | 容易绕过 truth、idempotency、visibility 和 audit 边界 | 不采用 |

推荐方案 A。

原因:

- L1-work 是 Work truth center,配置失败不能让系统产生不可追溯或伪成功的 truth。
- P0 当前没有在线配置系统,last-known-good 自动恢复会新增状态存储、审计和回滚契约。
- outbox、projection、handoff、external unresolved 等支撑面可以留下 marker,但不能修改已提交 truth。

## 7. 结构化中间产物

### 7.1 配置失败决策图

#### 配置失效处理图: L1-work 配置失败决策

```text
[config source / override / ref / adapter failure]
        |
        v
[parse / type / range / cross-field error?]
        |
        +--> yes --> [fail-fast before runtime build or job run]
        |
        v
[forbidden boundary or raw secret hit?]
        |
        +--> yes --> [fail-fast with sanitized error]
        |
        v
[configured adapter ref missing or provider unavailable?]
        |
        +--> yes --> [fail-fast or fail-closed; never fake success]
        |
        v
[external resolver cannot resolve source?]
        |
        +--> yes --> [explicit unresolved / failed marker or command reject]
        |
        v
[outbox / handoff / projection support failure?]
        |
        +--> yes --> [failed / pending / stale marker; truth not rolled back]
        |
        v
[config drift detected?]
        |
        +--> yes --> [restore config source and restart / new job run]
```

关键说明:

- 配置 parse / type / cross-field 失败必须发生在 runtime builder 或 job run 前。
- high-priority invalid value 不得回退低优先级。
- configured adapter 不得自动降级 fake 并伪装成功。
- degraded / failed / stale marker 只属于支撑面,不得改变 Work truth。

### 7.2 失效模式表

| 失效模式 | 影响 | 系统行为 | 是否告警 | 测试切口 |
|---|---|---|---|---|
| 未提供外部配置且 defaults 可构造 | 使用默认可验证路径 | 继续 parse / validate / builder | 否 | default config startup |
| 指定 config file 缺失 / 不可读 | 配置来源不可确认 | startup fail-fast | 是 | missing config file |
| config file JSON 格式错误 | 无法解析配置 | startup fail-fast | 是 | malformed config file |
| 同一 JSON 文件重复 key / 等价别名 | 配置歧义 | startup fail-fast | 是 | duplicate config key |
| env override 类型错误 / 空值 | 高优先级非法 | startup fail-fast,不回退 | 是 | invalid env override |
| entry local args 非法 | 当前入口 / job 参数不可信 | 当前入口 / job fail-fast | 是 | invalid job args |
| unsupported profile / config center / admin override | P0 范围越界 | startup fail-fast | 是 | unsupported config source |
| enum / duration / size / bool / retry 类型非法 | typed config 不可信 | startup 或 job-run-start fail-fast | 是 | type validation failure |
| idempotency retention 交叉校验失败 | duplicate / conflict window 不可信 | startup fail-fast | 是 | idempotency retention invalid |
| retry / timeout / batch 交叉校验失败 | job / outbox 重试不可判定 | startup 或 job-run-start fail-fast | 是 | retry policy invalid |
| `advanced_search_enabled=true` 但 search 未闭合 | query route 能力虚构 | startup fail-fast | 是 | advanced search unsupported |
| 配置试图关闭 truth / metadata / idempotency / visibility / audit / outbox | 核心边界被绕过 | startup fail-fast,进入设计变更流程 | 是 | forbidden boundary switch |
| ref-only sensitive 字段格式非法 | adapter 绑定不可信 | startup fail-fast | 是 | invalid sensitive ref |
| configured adapter ref 缺失 | 真实接缝不可装配 | startup fail-fast | 是 | missing adapter ref |
| secret / credential provider 启动不可用 | adapter 无法安全获得 material | fail-closed,不得 fake success | 是 | provider unavailable |
| resolver 调用阶段来源不可解析 | 外部 truth 不可确认 | command reject 或 unresolved / failed marker | 是 | resolver unresolved |
| raw secret / raw token / raw payload 出现在配置 | 安全边界破坏 | startup fail-fast,sanitized error | 是 | raw secret rejection |
| fake adapter 缺少 fake marker | fixture 被误认为 configured success | startup fail-fast 或测试门禁失败 | 是 | fake marker required |
| outbox publisher 配置正确但发布失败 | 下游事件未发布 | 标记 failed / pending,允许重试;truth 不回滚 | 是 | outbox publish failed |
| handoff target 调用失败 | trace / archive 未交接 | 写 handoff failed marker;truth 不回滚 | 是 | handoff failed marker |
| projection rebuild / replace 失败 | 派生视图 stale / rebuilding | 标记 stale / rebuilding,不写 truth | 是 | projection stale marker |
| operations-replay 配置与历史 baseline 不匹配 | replay 结果不可复核 | 当前 replay job fail-fast | 是 | replay config mismatch |
| 配置 source digest 与预期不一致 | 可能运行错误配置 | CI / release-like / replay gate fail | 是 | config digest mismatch |
| 运行中配置文件或 env 变化 | 配置漂移 | 当前 runtime / job 不热更新;下一次启动重新校验 | 视 profile 而定 | no hot reload drift |
| P1/P2 secret provider 不可用 | 真实接缝凭据不可解析 | P0 不受影响;P1/P2 fail-fast / fail-closed | 是 | secret provider unavailable |

### 7.3 处理策略定义表

| 策略 | 含义 | P0 适用范围 | 禁止误用 |
|---|---|---|---|
| fail-fast | 在 startup、entry 或 job-run-start 阶段阻断 | parse、type、range、cross-field、unsupported source、forbidden boundary、raw secret | 不得自动回退低优先级 |
| fail-closed | 外部 ref / provider 不可确认时按不允许处理 | configured adapter、secret / credential provider、安全读取边界 | 不得默认放行 |
| unresolved / failed marker | 明确记录外部来源、handoff 或 resolver 失败 | external resolver、handoff、evidence / process source | 不得伪造成 accepted truth |
| pending / failed | 记录发布或后置动作待恢复 | outbox publish | 不得回滚已提交 truth |
| stale / rebuilding | 派生视图不可用或重建中 | projection / derived views | 不得反写真相 |
| last-known-good | 自动使用上一版已知配置继续运行 | P0 不适用;只允许人工恢复上一版配置后重启 | 不得作为 silent fallback |
| degraded | 继续提供受限派生能力 | query projection stale、external degraded view | 不得用于 truth、idempotency、visibility、audit / outbox 成立边界 |

### 7.4 漂移与过期处理表

| 场景 | 发现方式 | 处理方式 |
|---|---|---|
| JSON config 与 review 后版本不一致 | file digest、CI diff、review gate | 阻断 CI / release-like,恢复受控版本 |
| env override 非预期 | source summary、job receipt、启动日志 | 删除 / 修正 env 后冷重启或新建 job run |
| ref-only sensitive 过期 | provider 返回 expired / revoked 或 resolver failed | adapter fail-closed;轮换 ref 后冷重启 / 新 job run |
| operations-replay 使用过期配置 | replay receipt、baseline digest 比对 | 当前 replay fail-fast,恢复匹配配置后重放 |
| 运行中配置文件被修改 | 下一次 startup digest / mtime 变化 | 当前 runtime 不热更新;下一次启动重新校验 |
| outbox / handoff 配置修复后 | failed marker、retry job、operator report | 重试后置动作;不回滚 truth |
| projection 配置修复后 | stale / rebuilding marker | 重建 projection;不反写真相 |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 配置缺失、parse、type、range、cross-field、unsupported source 失败必须 fail-fast | 否 | 配置失败策略,不改变错误模型 | 无 | 无回写 |
| ref-only sensitive 格式非法 fail-fast,provider 不可用 fail-closed 或 unresolved / failed marker | 否 | 敏感配置失败策略,承接 Step 8 / 9 | 无 | 无回写 |
| outbox / handoff / projection 失败只写 failed / pending / stale marker,不回滚 Work truth | 否 | 配置层失败语义,与现有 truth / outbox 边界一致 | 无 | 无回写 |
| P0 不实现 last-known-good、hot reload、config center 降级 | 否 | 范围裁剪,不新增 runtime API | 无 | 无回写 |

说明:

```text
本步没有新增 ConfigError enum、config audit DTO、last-known-good store、runtime reload API 或 adapter trait。
如后续要把 config digest / drift check 变成正式 API、事件或持久化对象,必须先回写 03 详细设计。
```

## 9. 回填草稿

正式 `04-配置设计.md` §11 建议采用以下结构:

```text
11. 失效模式与降级 / fail-fast 策略
  11.1 配置失败决策图
  11.2 失效模式表
  11.3 处理策略定义表
  11.4 配置漂移与过期处理
  11.5 对 03-详细设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §11.1 | `design-calibration/04_config_step_11_failure_modes.md` §7.1 |
| §11.2 | `design-calibration/04_config_step_11_failure_modes.md` §7.2 |
| §11.3 | `design-calibration/04_config_step_11_failure_modes.md` §7.3 |
| §11.4 | `design-calibration/04_config_step_11_failure_modes.md` §7.4 |
| §11.5 | `design-calibration/04_config_step_11_failure_modes.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 12 的待确认事项。

后续 Step 必须继续收口:

- Step 12 把 missing file、invalid env、duplicate key、raw secret、unsupported config center、configured adapter ref missing、resolver unresolved、outbox failed、projection stale、no hot reload drift 等场景承接到测试、验收、实施和运维。
- Step 13 判断未来引入 config center、last-known-good、production-like secret provider 或 durable adapter 时是否需要迁移 / 废弃策略。
- Step 14 汇总 P1/P2 真实外部依赖、config center 和 secret provider 的风险。

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 缺配置处理方式已明确 | 通过 | §3.1 / §7.2 |
| 类型 / 范围 / 交叉字段错误处理已明确 | 通过 | §3.2 / §7.2 |
| secret / provider 不可用处理已明确 | 通过 | §3.3 / §7.2 |
| config center 不可达处理已明确 | 通过 | §3.4 / §7.2 |
| 配置漂移 / 过期处理已明确 | 通过 | §3.5 / §7.4 |
| 对 03 影响已有判定 | 通过 | §8 当前无回写 |
| 可以进入 Step 12 | 通过 | 下一步定义测试、验收、实施与运维承接 |
