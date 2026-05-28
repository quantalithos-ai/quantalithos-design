# Step 8. 定义敏感配置与密钥管理

> 本文件是 `projects/L0-core/04-配置设计.md` 的 Step 8 中间产物。
> 本步单独收稳 secret、credential、DSN、token、cert 等敏感配置的存储、读取、轮换和审计边界。
> 本步不新增 P0 secret 字段,不定义真实 KMS / Vault 接入命令,不改变 `03-详细设计.md` 中的代码契约。

---

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 8
- 回填章节：`projects/L0-core/04-配置设计.md` §8 敏感配置与密钥管理

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 7 配置项清单 | P0 正式配置项只有 7 个,均为 internal,无 secret | 确认 P0 无 raw secret 配置项 |
| Step 5 来源优先级 | secret refs 不参与普通覆盖链,raw secret 不进入普通来源 | 固定敏感配置来源边界 |
| Step 6 profile 矩阵 | local / CI 不使用真实 secret;release-like 只允许 secret ref;production-ops 留给运维 | 固定不同 profile 的敏感处理 |
| `00/01/03` 安全边界 | 本仓不得保存凭据正文、token、credential secret,日志 / 审计不得保存原文 | 固定禁止输出规则 |
| 运维密钥管理边界 | KMS / Vault / secret provider 接入属于 P1/P2 或部署运维手册 | 固定本轮非范围 |

已确认结论:

```text
P0 正式配置项无 secret 级配置。
P0 不保存 raw secret,不读取 KMS / Vault raw material。
P1/P2 如需真实凭据,只能通过 secret ref / credential ref / adapter-local binding 表达。
raw secret 不得进入 config file、env、CLI flags、日志、错误返回或审计正文。
```

---

## 3. SOP 问题回答

1. 哪些配置是 sensitive 或 secret?

   回答：本轮 P0 正式配置项没有 `secret` 级配置。`contract_source.root`、`release_snapshot.root`、`projection_index.root`、`audit.root`、`outbox.root`、`idempotency.root` 和 `reference_resolver.config` 是 `internal`。P1/P2 可能出现 `publisher_credential_ref`、`toolchain_credential_ref`、`reference_resolver_credential_ref`、`secret_provider_config_ref`、`kms_vault_binding_ref` 等 `sensitive` 引用,但它们当前不进入 P0 正式配置项。真实 password、private key、raw token、raw credential 属于 `secret`,不得出现在本仓普通配置中。

2. 敏感配置如何存储,是否允许明文?

   回答：`sensitive` 级配置只允许存储引用,例如 secret ref、credential ref、KMS / Vault path ref 或 adapter-local binding ref。`secret` 级真实材料不允许明文存入 project config file、environment variables、CLI flags、日志、错误返回、审计正文或测试报告。P0 local / CI 使用 fake ref 或禁用真实 adapter;release-like 可使用 ref,但真实材料由外部密钥系统或运维注入。

3. 敏感配置如何轮换?

   回答：P0 无真实 secret 轮换。P1/P2 的 secret ref 轮换由部署与运维手册或安全运维流程负责,配置设计只要求轮换后重新启动相关 CLI / job 或重新执行对应 operation,并保留变更审计。不得通过热更新静默替换 secret,因为 P0 不支持热更新。

4. 读取和变更是否需要审计?

   回答：敏感引用的变更需要审计,审计内容只记录 ref 标识、actor、trace_id、变更原因、时间和受影响 adapter,不得记录 raw secret。读取 secret ref 解析失败应记录脱敏错误和 dependency 名称,不得记录 secret material。P0 正式配置项变更也可进入普通配置变更审计,但不按 secret 审计处理。

5. 日志、错误返回、审计中如何避免泄露?

   回答：日志、错误返回、指标 label、审计正文、测试报告和 outbox event 都不得包含 raw secret、token、private key、credential value 或完整外部系统返回正文。允许记录脱敏 ref、hash、fingerprint、最后四位不可逆标识或 stable redacted marker。错误信息只能说明“secret ref missing / unavailable / invalid”,不能回显值。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `04-配置设计.md` §8 | 尚未存在敏感配置和密钥管理章节 | P1/P2 真实集成时容易把 secret 当普通字符串配置 |
| Step 7 配置项清单 | P0 正式项均为 internal,但未单独说明 secret 规则 | 读者可能误以为无需敏感配置章节 |
| Step 5 来源优先级 | 已规定 raw secret 不进普通来源 | 需要在本步扩展为存储、读取、轮换、审计和输出规则 |
| `03-详细设计.md` §14 | 日志、指标、审计不得保存原始正文、凭据、token 或外部系统返回全文 | 需要在 04 中映射到配置与 secret 输出边界 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| P0 secret 口径 | 只说 P0 配置项是 internal | 明确 P0 无 secret 级正式配置项 | 防止过度设计 KMS / Vault 为 P0 前置 |
| P1/P2 secret 边界 | 散落在前序 Step | 统一为 secret ref / credential ref / adapter-local binding | 为真实集成留下安全边界 |
| 明文规则 | 只说 raw secret 不进普通来源 | 扩展到 config file、env、CLI flags、日志、错误、审计、测试报告和 event | 防止泄露路径不完整 |
| 轮换规则 | 未定义 | P1/P2 轮换由运维承接,P0 不热更新 | 避免把 secret rotation 写成当前代码前置 |
| 03 回写 | 未判断 | 本步不新增 secret 字段或 adapter constructor 参数 | 无需回写 03 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：P0 直接设计 KMS / Vault 配置 | 真实部署能力完整 | 超出当前 P0,会新增 secret provider 字段和运维前置 | 不采用 |
| 方案 B：P0 明确无 secret 正式项,P1/P2 只保留 secret ref 边界 | 不阻塞本地 / CI 主线,同时守住安全规则 | 真实生产接入需后续设计 | 采用 |
| 方案 C：允许 env / CLI flag 传 raw token | 实现简单 | 极易泄露,也违反本仓不保存凭据正文边界 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 敏感配置表

| 配置项 | 敏感级别 | 存储方式 | 是否可明文 | 轮换方式 | 审计要求 |
|---|---|---|---|---|---|
| `contract_source.root` 等 6 个 root 配置 | internal | 普通内部配置 | 可明文写内部配置,不对外公开 | 变更后重启 CLI / job | 普通配置变更审计 |
| `reference_resolver.config` | internal | 普通内部配置 | 可明文写内部配置,不得包含 raw credential | 变更后重启 CLI / job | 普通配置变更审计;引用失败脱敏记录 |
| future `publisher_credential_ref` | sensitive | secret ref / credential ref | 不可写 raw secret | 运维轮换 ref,重启相关 job / relay | 必须审计 ref 变化,不得记录 secret |
| future `toolchain_credential_ref` | sensitive | secret ref / credential ref | 不可写 raw secret | 运维轮换 ref,重跑相关 job | 必须审计 ref 变化和失败原因 |
| future `reference_resolver_credential_ref` | sensitive | secret ref / credential ref | 不可写 raw secret | 运维轮换 ref,重启相关入口 | 必须审计 ref 变化;解析失败 fail closed |
| future `secret_provider_config_ref` | sensitive | 外部 secret provider 引用 | 不可写 provider secret | 部署运维手册定义 | 必须审计 provider ref 变化 |
| raw password / private key / raw token / raw credential | secret | 不允许进入 L0-core 普通配置 | 否 | 由外部密钥系统处理 | 不得进入本仓审计正文 |

### 7.2 禁止输出规则

| 输出位置 | 禁止内容 | 允许内容 |
|---|---|---|
| 日志 | raw secret、raw token、private key、credential value、完整外部系统响应 | redacted ref、dependency name、error code、trace_id |
| 错误返回 | 配置原值、secret material、完整路径中的敏感片段 | `secret_ref_missing`、`secret_ref_unavailable`、`invalid_secret_ref` |
| 审计正文 | raw secret、token、credential、外部正文全文 | ref id、actor_ref、trace_id、changed_field、reason、timestamp |
| 指标 label | secret ref 全文、credential value、文件系统敏感路径 | dependency kind、result、error class |
| 测试报告 | fake secret 原值、fixture secret、真实 ref 全文 | redacted fixture id、failure category |
| outbox event | secret、credential、外部正文 | redacted reference、fingerprint、state change |

### 7.3 profile 敏感配置处理表

| profile | 敏感配置处理 |
|---|---|
| local-dev | 不使用真实 secret;可使用 fake ref 或禁用真实 adapter |
| ci-test | 不使用真实 secret;fixture ref 必须不可解析为真实 secret |
| release-like | 可使用 secret ref / credential ref;raw secret 不进入普通配置 |
| operations-replay | 只使用脱敏历史引用;不得回放 raw secret |
| staging-integration | P1/P2;真实 secret material 由部署与运维手册承接 |
| production-ops | P1/P2;真实 secret material 由安全运维注入和轮换 |

---

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 正式配置项无 secret 级配置 | 否 | 配置敏感级别说明 | 无 | 无回写 |
| P1/P2 使用 secret ref / credential ref 表达敏感引用 | 否 | 安全边界说明 | 无 | 无回写 |
| 不新增 secret provider、publisher credential、toolchain credential 字段 | 否 | 避免新增代码契约 | 无 | 无回写 |
| 若未来将 secret provider / credential ref 做成正式配置项 | 是 | runtime config / adapter contract 变化 | `03-详细设计.md` §13 或 adapter 契约章节 | 待回写 |

说明:

- 本步没有新增 `CoreRuntimeConfig` 字段、adapter constructor 参数、trait 方法或错误枚举。
- 本步最后一行是后续门禁: 若真实 secret provider 进入正式配置项,必须先回写 03。

---

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §8。

````md
## 8. 敏感配置与密钥管理

> 校准来源：
> - `design-calibration/04_config_step_08_sensitive_secrets.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“敏感配置表”“禁止输出规则”“profile 敏感配置处理表”和“对详细设计的影响判定”小节，了解本章密钥边界如何收敛。

本轮 P0 正式配置项没有 `secret` 级配置。`contract_source.root`、`release_snapshot.root`、`projection_index.root`、`audit.root`、`outbox.root`、`idempotency.root` 和 `reference_resolver.config` 均按 `internal` 级配置处理,可以出现在内部配置文件中,但不得对外公开。

P1/P2 真实集成可能需要 publisher credential、toolchain credential、reference resolver credential 或 secret provider binding。这些内容只能以 secret ref / credential ref / adapter-local binding 形式出现,不得把 raw password、private key、raw token 或 raw credential 写入普通配置文件、环境变量、CLI flag、日志、错误返回、审计正文、测试报告或 outbox event。

敏感引用的变更必须审计 ref 标识、actor、trace_id、原因、时间和受影响 adapter,不得审计 raw secret。读取或解析失败时,错误信息只能返回脱敏原因,并按 fail fast 或 fail closed 处理。
````

---

## 10. 待确认事项

- 是否接受 P0 正式配置项无 `secret` 级配置。
- 是否接受 P1/P2 真实凭据只通过 secret ref / credential ref / adapter-local binding 表达。
- 是否接受 raw secret 不得进入 config file、env、CLI flags、日志、错误、审计、测试报告和 outbox event。
- 是否接受未来若新增 secret provider 或 credential ref 正式字段,必须先回写 `03-详细设计.md`。

---

## 11. 进入下一步条件

- [x] 用户确认 P0 无 secret 正式配置项。
- [x] 用户确认敏感配置表和禁止输出规则。
- [x] 用户确认 P1/P2 secret ref 边界。
- [x] 用户确认本步无需回写 `03-详细设计.md`。
- [x] Step 8 状态从 `[~]` 更新为 `[x]`。
