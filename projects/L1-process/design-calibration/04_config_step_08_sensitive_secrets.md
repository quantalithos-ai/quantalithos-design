# Step 8. 定义敏感配置与密钥管理

> 本文件是 `projects/L1-process/04-配置设计.md` 的 Step 8 中间产物。
> 本步单独收稳 secret、credential、endpoint、destination、topic 和 forbidden output 的处理规则。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 8
- 回填章节: `projects/L1-process/04-配置设计.md` §8 敏感配置与密钥管理

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 7 配置项清单 | 找出 sensitive / secret 相关配置 | external / outbox / handoff adapter ref 为 ref-only sensitive |
| `03_ddd_step_14_config_external_binding.md` helper types | 确定 ref 类型 | `ExternalEndpointRef`、`CredentialRef`、`HandoffDestinationRef` 不保存 raw secret |
| `03_ddd_step_15_observability_audit.md` | 确定禁止输出 | raw secret、token、credential、external body、archive / observability body 不得进入日志 / 报告 |
| Step 4 禁止配置化边界 | 确定安全红线 | redaction 不得配置关闭 |

## 3. SOP 问题回答

### 3.1 哪些配置是 sensitive 或 secret?

L1-process P0 不允许 raw secret 配置项。以下配置属于 `ref-only sensitive`:

- `external.*.endpoint_ref`
- `external.*.credential_ref`
- `outbox.publisher.endpoint_ref`
- `outbox.publisher.credential_ref`
- `handoff.trace_target.destination_ref`
- `handoff.trace_target.credential_ref`
- `handoff.archive_target.destination_ref`
- `handoff.archive_target.credential_ref`

这些字段只保存引用,不保存真实 token、password、private key、certificate、DSN 或 provider response body。

### 3.2 敏感配置如何存储,是否允许明文?

普通 JSON / env 可保存 ref 字符串,不可保存 raw secret。真实 secret material 由 P1/P2 secret provider 或部署环境管理,不进入本配置文档示例、日志、错误、audit、report、artifact 或 handoff payload。

### 3.3 敏感配置如何轮换?

P0 不定义真实 secret 轮换机制。ref 变更属于冷更新,必须重新加载配置并完整 validation。P1/P2 若接入 secret provider,轮换规则进入部署与运维手册,且不得改变 `04` 的 raw secret 禁止边界。

### 3.4 读取和变更是否需要审计?

ref 变更必须进入配置变更审计,审计中只记录 key、old ref hash / redacted ref、new ref hash / redacted ref、actor / operator、trace context、validation result 和生效方式。不得记录 raw secret。

### 3.5 日志、错误返回、审计中如何避免泄露?

- 日志中只允许输出 redacted ref 或 hash。
- error surface 只允许输出 config key、error kind 和 redacted source,不得输出配置原值。
- audit 中只保存 ref、hash、actor、trace 和 validation result。
- report / artifacts 需要 redaction scan。
- forbidden body / raw secret 一旦发现,配置加载或 report check 必须 fail-fast。

## 4. 结构化中间产物

### 4.1 敏感配置表

| 配置项 | 敏感级别 | 存储方式 | 是否可明文 | 轮换方式 | 审计要求 |
|---|---|---|---|---|---|
| `external.method_library.endpoint_ref` | ref-only sensitive | JSON / env ref | 仅 ref 可明文;raw endpoint secret 禁止 | 冷更新 | 记录 redacted ref / hash |
| `external.method_library.credential_ref` | ref-only sensitive | JSON / env ref | 仅 ref 可明文;raw credential 禁止 | 冷更新 | 记录 redacted ref / hash |
| `external.work.endpoint_ref` | ref-only sensitive | JSON / env ref | 仅 ref 可明文;raw endpoint secret 禁止 | 冷更新 | 记录 redacted ref / hash |
| `external.work.credential_ref` | ref-only sensitive | JSON / env ref | 仅 ref 可明文;raw credential 禁止 | 冷更新 | 记录 redacted ref / hash |
| `external.identity.endpoint_ref` | ref-only sensitive | JSON / env ref | 仅 ref 可明文;raw endpoint secret 禁止 | 冷更新 | 记录 redacted ref / hash |
| `external.identity.credential_ref` | ref-only sensitive | JSON / env ref | 仅 ref 可明文;raw credential 禁止 | 冷更新 | 记录 redacted ref / hash |
| `external.governance.endpoint_ref` | ref-only sensitive | JSON / env ref | 仅 ref 可明文;raw endpoint secret 禁止 | 冷更新 | 记录 redacted ref / hash |
| `external.governance.credential_ref` | ref-only sensitive | JSON / env ref | 仅 ref 可明文;raw credential 禁止 | 冷更新 | 记录 redacted ref / hash |
| `external.artifact.endpoint_ref` | ref-only sensitive | JSON / env ref | 仅 ref 可明文;raw endpoint secret 禁止 | 冷更新 | 记录 redacted ref / hash |
| `external.artifact.credential_ref` | ref-only sensitive | JSON / env ref | 仅 ref 可明文;raw credential 禁止 | 冷更新 | 记录 redacted ref / hash |
| `external.runtime.endpoint_ref` | ref-only sensitive | JSON / env ref | 仅 ref 可明文;raw endpoint secret 禁止 | 冷更新 | 记录 redacted ref / hash |
| `external.runtime.credential_ref` | ref-only sensitive | JSON / env ref | 仅 ref 可明文;raw credential 禁止 | 冷更新 | 记录 redacted ref / hash |
| `external.conversation.endpoint_ref` | ref-only sensitive | JSON / env ref | 仅 ref 可明文;raw endpoint secret 禁止 | 冷更新 | 记录 redacted ref / hash |
| `external.conversation.credential_ref` | ref-only sensitive | JSON / env ref | 仅 ref 可明文;raw credential 禁止 | 冷更新 | 记录 redacted ref / hash |
| `outbox.publisher.endpoint_ref` | ref-only sensitive | JSON / env ref | 仅 ref 可明文;raw bus credential 禁止 | 冷更新 | 记录 redacted ref / hash |
| `outbox.publisher.credential_ref` | ref-only sensitive | JSON / env ref | 仅 ref 可明文;raw credential 禁止 | 冷更新 | 记录 redacted ref / hash |
| `handoff.trace_target.destination_ref` | ref-only sensitive | JSON / env ref | 仅 ref 可明文;raw destination body 禁止 | 冷更新 | 记录 redacted ref / hash |
| `handoff.trace_target.credential_ref` | ref-only sensitive | JSON / env ref | 仅 ref 可明文;raw credential 禁止 | 冷更新 | 记录 redacted ref / hash |
| `handoff.archive_target.destination_ref` | ref-only sensitive | JSON / env ref | 仅 ref 可明文;raw archive target body 禁止 | 冷更新 | 记录 redacted ref / hash |
| `handoff.archive_target.credential_ref` | ref-only sensitive | JSON / env ref | 仅 ref 可明文;raw credential 禁止 | 冷更新 | 记录 redacted ref / hash |
| `outbox.topic_map.*` | internal | JSON / env topic string | topic 可明文;payload body 禁止 | 冷更新 | 记录 changed topic key |

### 4.2 禁止输出规则

| 禁止输出内容 | 禁止位置 | 处理 |
|---|---|---|
| raw secret / password / private key / raw token | config file、env dump、log、audit、error、report、artifact | fail-fast 或 redaction check fail |
| credential provider response body | log、audit、report、handoff payload | reject / redact |
| method definition body | snapshot、outbox、handoff、report | reject;only ref / digest / summary |
| Work truth body | snapshot、outbox、handoff、report | reject;only ref / snapshot summary |
| governance decision body | waiting marker、outbox、handoff、report | reject;only decision ref / marker |
| artifact body | checkpoint / evidence marker、handoff、report | reject;only evidence ref / digest |
| runtime execution log / reasoning body | activity feedback snapshot、trace、handoff、report | reject;only feedback ref / summary |
| conversation body | conversation marker、timeline、handoff、report | reject;only context ref / marker |
| observability ledger body / archive package body | handoff record、audit、report | reject;only receipt / package ref |

## 5. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 不允许 raw secret 配置项,只允许 ref-only sensitive | 否 | 配置安全语义 | 无 | 无回写 |
| redaction 不得配置关闭 | 否 | 承接 03 observability / forbidden field 规则 | 无 | 无回写 |
| secret provider 真实轮换后移 P1/P2 | 否 | 范围裁剪 | 无 | 无回写 |

## 6. 回填草稿

`04-配置设计.md` §8 应说明 L1-process P0 不允许 raw secret 配置项。external / outbox / handoff 中的 endpoint、credential、destination 均为 ref-only sensitive。普通 JSON / env 只能保存 ref,不得保存 raw secret、raw token、password、private key、certificate、DSN 或 provider response body。日志、错误、审计、report 和 artifact 必须 redacted。

## 7. 待确认事项

- 无阻塞 Step 9 的待确认事项。
- P1/P2 secret provider 的真实产品和轮换流程留给部署与运维手册。

## 8. 进入下一步条件

- 敏感配置处理方式明确。
- forbidden output 规则明确。
- 详细设计影响判定为无回写。
