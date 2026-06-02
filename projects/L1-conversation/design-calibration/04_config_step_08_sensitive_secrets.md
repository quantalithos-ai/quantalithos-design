# Step 8. 定义敏感配置与密钥管理

> 本文件是 `projects/L1-conversation/04-配置设计.md` 的 Step 8 中间产物。
> 本步单独收稳 secret、credential、endpoint credential 和 forbidden material 的存储、读取、轮换和审计边界。
> 本步不写 raw secret 示例,不定义具体 KMS / Vault 产品字段,不回写 `03-详细设计.md`。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 8
- 回填章节: `projects/L1-conversation/04-配置设计.md` §8 敏感配置与密钥管理

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_07_config_items.md` | 已列 `CredentialRef`、`SecretRef`、redaction policy 和 forbidden material 规则 | 作为敏感配置清单来源 |
| `04_config_step_04_classification_boundaries.md` | 已确认 raw secret、forbidden body 和 fake success 禁止配置化 | 固定禁止项 |
| `04_config_step_05_sources_priority_conflicts.md` | 已确认普通来源只能提供 ref,secret material 不进入普通覆盖链 | 固定来源与冲突规则 |
| `04_config_step_06_profiles_matrix.md` | 已确认 local / CI 使用 fake ref,staging / production 由运维注入 material | 固定 profile 差异 |
| `03-详细设计.md` §14.4 | 观测字段禁止表 | 固定日志、指标、审计、diagnostic 和 trace attribute 输出边界 |

已确认结论:

```text
P0 配置文件、env、entry args、logs、reports、artifacts、audit 和 diagnostics 中都不得出现 raw secret、raw token、forbidden body 或来源正文。
配置只能保存 `CredentialRef` / `SecretRef` / endpoint ref 等引用。
真实 secret material 的解析、轮换和授权属于 P1/P2 secret provider 或部署运维手册,不进入当前 04 字段全集。
```

## 3. SOP 问题回答

### 3.1 哪些配置是 sensitive 或 secret?

| 配置项 | 敏感级别 | 原因 |
|---|---|---|
| `outbox.publisher.credential_ref` | sensitive-ref | 指向 event publisher 凭据,但不包含真实 secret |
| `resolver.actor.credential_ref` | sensitive-ref | 指向 actor resolver 凭据 |
| `resolver.external_fact_sources.credential_ref` | sensitive-ref | 指向外部事实 resolver 凭据 |
| `handoff.trace.credential_ref` | sensitive-ref | 指向 trace handoff 凭据 |
| `handoff.archive.credential_ref` | sensitive-ref | 指向 archive handoff 凭据 |
| raw secret / raw token / private key material | forbidden | 不允许成为配置项、日志、报告或证据 |
| source body / runtime reasoning body / bridge message body / artifact body | forbidden | 属于 forbidden body,不得通过配置或诊断输出进入本仓 |

### 3.2 敏感配置如何存储,是否允许明文?

敏感引用可以以 ref 字符串形式出现在 JSON config file、environment variables 或 entry local args 中。真实 secret material 不允许以明文出现在任何普通配置来源中。

| 存储位置 | 是否允许敏感 ref | 是否允许 raw secret | 说明 |
|---|---|---|---|
| JSON config file | 是 | 否 | 只能保存 `CredentialRef` / `SecretRef` |
| environment variables | 是 | 否 | 只能保存 ref 或 profile,不能保存 raw token |
| entry local args | 有限 | 否 | 只允许 job 局部 ref 或 run id |
| logs / errors | 否,最多 masked ref | 否 | 不输出 raw ref 全量和 secret material |
| reports / artifacts | 仅允许 masked ref 或 safe diagnostic ref | 否 | 证据不能泄露 credential |
| audit / trace attributes | 仅允许 safe subject ref / credential class | 否 | 不输出 credential value |

### 3.3 敏感配置如何轮换?

P0 不实现在线热轮换。轮换通过更换 credential ref 并冷更新 runtime 或重新启动 job 完成。

| 轮换场景 | P0 处理 | P1/P2 承接 |
|---|---|---|
| fake ref 轮换 | local / CI 重新加载配置 | 无 |
| configured ref 更换 | 修改 JSON / env ref,重启 runtime 或 job | 运维手册定义 rollout / rollback |
| secret material 轮换 | 不由 04 直接处理 | secret provider / KMS / Vault 专项 |
| provider 不可用 | adapter fail-closed 或 resolver degraded marker | 运维告警与恢复 |

### 3.4 读取和变更是否需要审计?

P0 只要求配置加载、校验失败、credential ref 缺失、provider 不可用和 redaction violation 有可诊断 evidence。真实 provider 读取审计属于 P1/P2 运维承接。

### 3.5 日志、错误返回、审计中如何避免泄露?

| 输出位置 | 允许输出 | 禁止输出 |
|---|---|---|
| log | operation、state、error code、masked ref、safe diagnostic ref | raw secret、raw token、source body、runtime body |
| error response | stable error code、missing ref class、safe reason code | credential value、HTTP body、private profile |
| audit / evidence | subject ref、actor ref、trace ref、credential class、result ref | raw credential、unredacted trace payload |
| reports / artifacts | run id、config validation result、masked ref、redaction check summary | secret material、forbidden body、raw payload |
| diagnostic | safe summary、supporting refs、stable error code | debug dump、request / response body、private profile |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| Step 7 配置项清单 | 已列 credential ref,但未单独说明存储、轮换和审计 | 实现者可能把 ref 当普通 string 或把 raw secret 写入 env |
| `03-详细设计.md` §14.4 | 已列观测字段禁止表,但不是配置章节 | 需要转译为配置输出规则 |
| `04-配置设计.md` | 尚无敏感配置章节 | 后续测试验收缺少安全门禁输入 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| credential ref | 只作为配置字段出现 | 明确为 sensitive-ref,可存 ref 不可存 raw secret | 防止明文泄露 |
| secret material | 未单独说明 | 明确不进入普通配置来源 | 保持配置与密钥管理边界 |
| 轮换 | 未说明 | P0 冷更新,P1/P2 交给 secret provider / 运维 | 避免虚构在线轮换机制 |
| 输出防护 | 散落在详细设计观测字段禁止表 | 形成日志、错误、审计、报告和 diagnostic 禁止输出表 | 方便测试验收引用 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: JSON / env 允许直接写 raw secret | 简单 | 高泄露风险,不符合安全红线 | 不采用 |
| 方案 B: JSON / env 只允许 ref,真实 material 由 provider / 运维处理 | 安全边界清楚,可测试 | P1/P2 还需补 secret provider 细节 | 采用 |
| 方案 C: P0 支持在线 secret rotation | 运维灵活 | 需要 provider、reload、audit 和回滚专项 | 不采用 |

推荐方案 B。

原因:

- Conversation 不应拥有 secret material,也不应把 secret 写入配置、证据或诊断。
- P0 当前需要的是 ref 边界和泄露防护,不是完整 KMS / Vault 产品接入。
- 冷更新足以支撑 local、CI、integration-like 和 operations-replay。

## 7. 结构化中间产物

### 7.1 敏感配置表

| 配置项 | 敏感级别 | 存储方式 | 是否可明文 | 轮换方式 | 审计要求 |
|---|---|---|---|---|---|
| `outbox.publisher.credential_ref` | sensitive-ref | JSON / env 中保存 ref | 否 | 更换 ref 后冷更新 | 记录缺失、非法、不可用和 masked ref class |
| `resolver.actor.credential_ref` | sensitive-ref | JSON / env 中保存 ref | 否 | 更换 ref 后冷更新 | 记录缺失、非法、不可用和 resolver kind |
| `resolver.external_fact_sources.credential_ref` | sensitive-ref | JSON / env 中保存 ref | 否 | 更换 ref 后冷更新 | 记录缺失、非法、不可用和 source class |
| `handoff.trace.credential_ref` | sensitive-ref | JSON / env 中保存 ref | 否 | 更换 ref 后冷更新 | 记录缺失、非法、不可用和 handoff kind |
| `handoff.archive.credential_ref` | sensitive-ref | JSON / env 中保存 ref | 否 | 更换 ref 后冷更新 | 记录缺失、非法、不可用和 handoff kind |
| raw secret / raw token / private key | forbidden | 不允许存储 | 否 | 不适用 | 命中即 redaction violation / config rejection |
| forbidden body | forbidden | 不允许存储 | 否 | 不适用 | 命中即 boundary violation evidence |

### 7.2 禁止输出规则

| 输出材料 | 必须执行的规则 |
|---|---|
| config validation report | 只输出配置项路径、错误类型和 masked ref class |
| logs | 不输出 raw secret、raw token、source body、runtime body、artifact body |
| errors | 不返回 credential value、HTTP response body 或 private profile |
| audit / evidence | 只保留 subject ref、actor ref、trace ref、state、result 和 reason code |
| reports / artifacts | 不保存 raw payload、raw credential、forbidden body 或 debug dump |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 敏感配置只允许保存 `CredentialRef` / `SecretRef`,不保存 raw secret | 否 | 与 `03` §14.4 安全输出边界一致 | 无 | 无回写 |
| P0 不实现在线 secret rotation | 否 | 范围裁剪 | 无 | 无回写 |
| provider 不可用时 adapter fail-closed 或 resolver degraded marker | 否 | 与 `03` 外部依赖绑定降级策略一致 | 无 | 无回写 |
| 日志、错误、审计、reports、artifacts 不输出 secret material 或 forbidden body | 否 | 配置输出规则 | 无 | 无回写 |

## 9. 回填草稿

正式 `04-配置设计.md` §8 建议采用以下结构:

```text
8. 敏感配置与密钥管理
  8.1 敏感配置表
  8.2 存储与明文禁止
  8.3 轮换与不可用策略
  8.4 禁止输出规则
  8.5 对 03-详细设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §8.1 | `design-calibration/04_config_step_08_sensitive_secrets.md` §7.1 |
| §8.2 | `design-calibration/04_config_step_08_sensitive_secrets.md` §3.2 |
| §8.3 | `design-calibration/04_config_step_08_sensitive_secrets.md` §3.3 / §3.4 |
| §8.4 | `design-calibration/04_config_step_08_sensitive_secrets.md` §7.2 |
| §8.5 | `design-calibration/04_config_step_08_sensitive_secrets.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 9 的待确认事项。

后续 Step 必须继续收口:

- Step 9 需要明确 ConfigValidator 如何拒绝 raw secret、非法 ref 和 forbidden body。
- Step 11 需要明确 provider 不可用、ref 缺失和 redaction violation 的失败策略。
- `05/06` 需要将 raw secret / forbidden body 泄露设为一票否决。

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 敏感配置表已形成 | 通过 | §7.1 |
| raw secret 明文禁止已明确 | 通过 | §3.2 |
| 轮换口径已明确 | 通过 | §3.3 |
| 输出防泄露规则已明确 | 通过 | §7.2 |
| 可以进入 Step 9 | 通过 | 下一步定义配置加载、校验与生效机制 |
