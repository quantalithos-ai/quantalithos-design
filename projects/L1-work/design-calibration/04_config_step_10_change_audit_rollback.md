# Step 10. 定义配置变更、审计与回滚

> 本文件是 `projects/L1-work/04-配置设计.md` 的 Step 10 中间产物。
> 本步定义 L1-work 配置如何变更、评审、审计和回滚。
> 本步不引入配置中心、admin override、核心热更新或具体工单系统,不创建正式 `04-配置设计.md`。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 10
- 回填章节: `projects/L1-work/04-配置设计.md` §10 配置变更、审计与回滚

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_07_config_items.md` | P0 28 个配置项、默认值、来源、作用域、生效方式和失败策略 | 固定变更类型和风险级别 |
| `04_config_step_08_sensitive_secrets.md` | ref-only sensitive、raw secret 禁止、审计只记录 ref 级行为 | 固定敏感配置变更审计和回滚边界 |
| `04_config_step_09_load_validate_apply.md` | startup / job-run-start / static invariant 生效机制,P0 无 reload / hot update | 固定变更生效方式和回滚方式 |
| `04_config_step_06_profiles_matrix.md` | local-dev、ci-test、integration-like、operations-replay、P1/P2 profile 边界 | 固定不同 profile 的评审和审计强度 |
| `04_config_step_05_sources_priority_conflicts.md` | file / env 覆盖、高优先级非法值 fail-fast、config center / admin override 不进 P0 | 固定变更入口和冲突处理 |

已确认结论:

```text
P0 配置变更只通过代码默认值变更、JSON config file 变更、environment override 变更和 entry local args 变更表达。
核心 runtime graph 配置变更通过冷重启生效;job-run-start 配置变更只影响新 job run。
P0 不支持在线 reload、hot update、config center 或 admin override。
审计记录只保存配置来源、profile、key、版本 / digest、redacted ref 和结果,不保存 raw secret 或 raw payload。
```

## 3. SOP 问题回答

### 3.1 哪些配置可以由谁变更?

| 配置范围 | 可变更方 | 允许变更入口 | 不允许 |
|---|---|---|---|
| code defaults | 代码维护者 | 设计 / 实施变更后进入代码提交 | 运行时直接修改 |
| JSON config file | 本地开发者、CI 维护者、集成环境维护者、运维执行方 | 文件变更 + 重新启动或新 job run | 写入 raw secret、关闭禁止配置化边界 |
| environment overrides | CI / run 环境维护者、运维执行方 | env key 变更 + 重新启动或新 job run | 非法高优先级值回退低优先级 |
| entry local args | 入口调用者、job operator、测试执行者 | 当前入口 / 当前 job run 参数 | 覆盖全局禁止项或持久化为 runtime config |
| ref-only sensitive | 集成环境维护者、运维执行方 | 更新 `CredentialRef`、`SecretRef`、`EndpointRef`、`TargetRef` | 提交 secret material、raw token、raw body |
| static invariant / 禁止配置化边界 | 无普通变更方 | 只能回到 00 / 01 / 02 / 03 设计重校准 | 作为普通配置开关 |

### 3.2 哪些配置变更需要评审?

| 变更类别 | 是否需要评审 | 评审重点 |
|---|---|---|
| local-dev 默认配置微调 | 轻量评审 | 是否影响默认可验证路径 |
| ci-test 配置变更 | 必须评审 | 是否影响 deterministic fixture、redaction gate 和报告路径 |
| integration-like configured adapter ref 变更 | 必须评审 | 是否仍只保存 ref、是否能 fail-fast、是否有 fake marker 区分 |
| operations-replay 配置变更 | 必须评审 | 是否保持 idempotency、run-scoped evidence 和 no-write truth |
| idempotency retention / retry / timeout 变更 | 必须评审 | 是否满足 Step 9 cross-field validation |
| boundary / page / body limit 变更 | 必须评审 | 是否不会绕过 command / query / visibility / metadata 门禁 |
| feature flag 变更 | 必须评审 | 是否只影响派生或外围能力,不改变 truth path |
| ref-only sensitive 变更 | 必须评审 | 是否不含 material、审计是否 redacted |
| 禁止配置化边界变更 | 不是配置评审 | 必须回到对应设计文档重校准 |

### 3.3 变更如何生效?

| 变更范围 | 生效方式 | 说明 |
|---|---|---|
| startup 配置 | 冷重启 | 重启后重新执行 `WorkRuntimeConfig::load_and_validate(...)` 和 `WorkRuntimeBuilder` |
| job-run-start 配置 | 新 job run 生效 | 已开始的 job run 不重新读取配置 |
| entry local args | 当前入口 / job run 生效 | 不写回 JSON config file 或 runtime config |
| code defaults | 新版本构建 / 部署后生效 | 必须通过代码评审和设计门禁 |
| reload / hot update | 不支持 | 请求应被拒绝,保留当前 runtime config |
| static invariant | 不生效 | 配置命中即 reject |

### 3.4 变更如何记录审计?

审计只记录可复核的配置事实,不记录敏感材料。

必须记录:

- profile。
- config source kind: defaults / file / env / entry local args。
- config version 或 file digest。
- changed key list。
- env override key list,不记录 env value。
- redacted ref id 和 ref type。
- validation outcome: accepted / rejected / unsupported / failed。
- 生效方式: startup / job-run-start / entry-local / rejected。
- 触发的 fail-fast / fail-closed / unresolved / failed marker。

禁止记录:

- raw secret、raw token、password、private key。
- raw DSN credential segment。
- raw payload、source body、runtime reasoning body、artifact body。
- 完整 env value 或 credential material。

### 3.5 变更失败或效果异常如何回滚?

| 场景 | 回滚方式 |
|---|---|
| startup config validation fail | runtime 不启动;修正配置或恢复上一版 JSON / env 后重新启动 |
| env override 非法 | 删除或修正 env override,重新启动;不得回退低优先级继续运行 |
| configured adapter ref 缺失 / 不可解析 | 恢复上一版 ref 或修正 provider 绑定;不得自动切 fake success |
| job-run-start 参数非法 | 当前 job 失败;修正参数后新建 job run;已完成 run 不重写 |
| job 运行中配置效果异常 | 停止后续 run,保留 run report,使用上一版配置发起新 run;不得修改已提交 truth |
| publisher / handoff 配置导致下游失败 | 修复配置后重试 outbox / handoff job;truth 不回滚 |
| feature 变更导致 query / projection 异常 | 冷重启恢复上一版 feature 配置;projection 可重建,truth 不回滚 |
| forbidden boundary 配置被提交 | 拒绝配置,撤销该变更,回设计文档重新评审 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| `04_config_step_09_load_validate_apply.md` | 已定义加载和生效机制,但未定义变更评审、审计、回滚 | 本步补变更治理表 |
| `04_config_step_08_sensitive_secrets.md` | 已定义审计 ref 级行为,但未落到配置变更记录 | 本步定义 redacted 审计字段和禁止记录 |
| `04_config_step_06_profiles_matrix.md` | 已定义 profile,但未定义各 profile 的变更评审强度 | 本步按 local / CI / integration / replay 区分 |
| 正式 `04-配置设计.md` | 本 Step 撰写时尚未存在 §10;当前已回填正式 §10 | 本步提供回填来源 |
| 后续 `05/06/07` | 本 Step 撰写时尚未承接配置变更、回滚和审计门禁;当前已由正式 `05/06/07` 承接 | 历史风险已关闭 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 变更入口 | 已有来源优先级,但未说明谁能变更 | 明确 defaults / JSON / env / entry args / ref-only sensitive 的变更方 | 支撑操作和审计 |
| 评审规则 | 未定义 | 高风险配置变更必须评审,禁止项回设计文档 | 防止配置绕过设计边界 |
| 生效方式 | Step 9 已定义 startup / job-run-start | 将变更行为映射到冷重启、新 job run、entry-local 和 reject | 让回滚可执行 |
| 审计记录 | Step 8 有敏感输出边界 | 定义必须记录和禁止记录字段 | 防止泄露和不可追溯 |
| 回滚 | 未定义 | 明确恢复上一版配置、新 job run、重试 outbox / handoff、truth 不回滚 | 防止把配置故障变成业务 truth 修改 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: P0 使用文件 / env / entry args 变更,冷重启或新 job run 生效 | 简单、可审计、与 Step 9 一致 | 不支持在线变更 | 采用 |
| 方案 B: P0 引入 config center 和 admin override | 运维能力完整 | 需要权限、审计、回滚、一致性和安全专项 | 不采用 |
| 方案 C: 配置失败时自动回退上一版继续运行 | 可用性看似更高 | 隐藏错误,与高优先级非法 fail-fast 冲突 | 不采用 |
| 方案 D: 下游 publish / handoff 配置异常时回滚 truth | 表面上保持同步结果一致 | 破坏 accepted truth 与 outbox 后置动作边界 | 不采用 |

推荐方案 A。

原因:

- P0 的配置变更应服务默认可验证路径和 CI / integration / replay 验证,不承担生产动态配置系统职责。
- 冷重启和新 job run 能把配置版本与 runtime / report / job outcome 绑定清楚。
- 失败时保留证据并恢复配置,不修改已提交 truth,符合 Work truth ownership 和 outbox / handoff 后置语义。

## 7. 结构化中间产物

### 7.1 配置变更表

| 变更类型 | 发起方 | 评审要求 | 生效方式 | 审计记录 | 回滚方式 |
|---|---|---|---|---|---|
| code defaults 变更 | 代码维护者 | 设计 / 代码评审;需确认不改变禁止配置化边界 | 新版本构建 / 部署后启动生效 | commit、变更 key、默认值来源、validation outcome | 回滚代码提交或恢复上一版本 |
| JSON config file 变更 | 本地开发者、CI 维护者、集成环境维护者、运维执行方 | local-dev 轻量评审;CI / integration / replay 必须评审 | startup 冷重启或新 job run | file path、file digest、profile、changed key list、validation outcome | 恢复上一版文件并重新启动或新建 job run |
| environment override 变更 | CI / run 环境维护者、运维执行方 | 必须评审高风险 key;低风险 local override 可轻量评审 | startup 冷重启或新 job run | env key list、source kind、profile、validation outcome;不记录 value | 删除 / 修正 env 后重新启动或新建 job run |
| entry local args 变更 | 入口调用者、job operator、测试执行者 | job / replay / diagnostic 需要 run 级确认 | 当前入口或当前 job run | arg key、run id、job scope、validation outcome;敏感 ref redacted | 修正参数后重新调用或新建 job run |
| ref-only sensitive 变更 | 集成环境维护者、运维执行方 | 必须评审;确认无 raw secret / raw token / raw payload | startup 冷重启或新 job run | ref type、redacted ref id、adapter kind、validation outcome | 恢复上一版 ref 或修正 provider 绑定 |
| idempotency / retry / timeout 变更 | CI 维护者、集成环境维护者、运维执行方 | 必须评审 cross-field validation 和测试影响 | startup 或 job-run-start | changed key、old / new config digest、validation outcome | 恢复上一版配置;重新启动或新建 job run |
| feature flag 变更 | 代码维护者、集成环境维护者 | 必须评审;确认只影响派生 / 外围能力 | startup 冷重启 | feature key、profile、route / service enablement outcome | 恢复上一版 feature 配置并冷重启 |
| forbidden boundary 命中 | 无普通发起方 | 不进入配置评审;回设计文档重校准 | 不生效,reject | rejected key、boundary category、sanitized reason | 撤销配置变更;完成设计重校准后再议 |
| reload / hot update 请求 | 无 P0 发起方 | P0 unsupported | 不生效,reject | request source、profile、unsupported reason | 保留当前 runtime config |

### 7.2 审计字段表

| 审计字段 | 是否必须 | 说明 |
|---|---|---|
| `profile` | 是 | local-dev / ci-test / integration-like / operations-replay / future profile |
| `source_kind` | 是 | defaults / file / env / entry-local |
| `config_version_or_digest` | 是 | 文件 digest、build version 或 run-scoped config digest |
| `changed_key_list` | 是 | 只记录 key,不记录 secret value |
| `validation_outcome` | 是 | accepted / rejected / unsupported / failed |
| `effective_mode` | 是 | startup / job-run-start / entry-local / rejected |
| `redacted_ref` | 条件必填 | sensitive ref 变更时记录 ref type 和 redacted id |
| `run_id` | 条件必填 | job / replay / entry-local 变更时记录 |
| `rollback_source` | 条件必填 | 回滚时记录恢复到的 config digest 或 version |
| raw secret / raw token / raw payload | 禁止 | 不得进入审计、日志、错误、报告或 artifact |

### 7.3 回滚规则表

| 回滚对象 | 回滚动作 | 不回滚内容 |
|---|---|---|
| startup 配置 | 恢复上一版 JSON / env / defaults 后冷重启 | 已提交 Work truth、已写 audit / outbox |
| job-run-start 配置 | 使用上一版配置创建新 job run | 已完成 job report、已提交 truth |
| entry local args | 修正参数后重新调用 | 旧 run 的审计和失败结果 |
| ref-only sensitive | 恢复上一版 ref 或修正外部 provider | credential material 不能写入配置 |
| publisher / handoff 配置 | 修复配置后重试 outbox / handoff job | accepted truth 不因发布失败回滚 |
| feature config | 恢复 feature 配置并冷重启,必要时重建 projection | truth 不因派生异常回滚 |
| forbidden boundary | 撤销配置,回设计文档重校准 | 不允许临时放行 |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 配置变更只通过 defaults / JSON / env / entry local args 表达,不引入 config center / admin override | 否 | 配置治理规则,无代码契约变化 | 无 | 无回写 |
| startup 配置冷重启生效,job-run-start 配置只影响新 job run | 否 | 生效策略,与 Step 9 一致 | 无 | 无回写 |
| 配置审计只记录 source、digest、key、redacted ref 和 outcome,不记录 material | 否 | 审计字段规则,不改变正式 DTO / event schema | 无 | 无回写 |
| 配置回滚恢复配置版本或发起新 job run,不得修改已提交 Work truth | 否 | 配置回滚规则,与 truth / outbox 边界一致 | 无 | 无回写 |

说明:

```text
本步没有新增 WorkRuntimeConfig 字段、ConfigAuditRecord DTO、admin override API、runtime reload API 或 hot-update 函数流。
如果后续需要实现持久化 config audit object 或远程配置变更 API,必须先回写 03 详细设计。
```

## 9. 回填草稿

正式 `04-配置设计.md` §10 建议采用以下结构:

```text
10. 配置变更、审计与回滚
  10.1 配置变更表
  10.2 配置变更评审规则
  10.3 审计字段表
  10.4 回滚规则表
  10.5 对 03-详细设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §10.1 | `design-calibration/04_config_step_10_change_audit_rollback.md` §7.1 |
| §10.2 | `design-calibration/04_config_step_10_change_audit_rollback.md` §3.2 |
| §10.3 | `design-calibration/04_config_step_10_change_audit_rollback.md` §7.2 |
| §10.4 | `design-calibration/04_config_step_10_change_audit_rollback.md` §7.3 |
| §10.5 | `design-calibration/04_config_step_10_change_audit_rollback.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 11 的待确认事项。

后续 Step 必须继续收口:

- Step 11 定义配置缺失、错误、ref 不可达、unsupported profile、配置漂移和过期时的系统行为。
- Step 12 把配置变更审计、回滚、unsupported hot update 和 raw secret 拒绝纳入测试 / 验收 / 实施承接。
- P1/P2 若引入 config center、admin override 或在线 reload,必须新增专项设计,不得复用本 P0 表作为已支持结论。

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置变更表已形成 | 通过 | §7.1 |
| 评审要求已形成 | 通过 | §3.2 |
| 生效方式已形成 | 通过 | §3.3 |
| 审计字段和禁止记录已形成 | 通过 | §3.4 / §7.2 |
| 回滚规则已形成 | 通过 | §3.5 / §7.3 |
| 对 03 影响已有判定 | 通过 | §8 当前无回写 |
| 可以进入 Step 11 | 通过 | 下一步定义失效模式与降级 / fail-fast 策略 |
