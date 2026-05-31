# Step 8. 定义敏感配置与密钥管理

> 本文件是 `projects/L0-sdk/04-配置设计.md` 的 Step 8 中间产物。
> 本步单独收稳 secret、credential、DSN、token、cert、endpoint ref 和 boundary ref 的存储、读取、轮换、审计与禁止输出边界。
> 本步不新增 P0 secret 字段,不定义真实 KMS / Vault 接入命令,不改变 `03-详细设计.md` 中的代码契约。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 8
- 回填章节：`projects/L0-sdk/04-配置设计.md` §8 敏感配置与密钥管理

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 7 配置项清单 | `boundaries.formal_api_endpoint_ref`、`boundaries.bus_event_boundary_ref` 标记为 sensitive-ref;P0 未定义真实 credential 字段 | 固定 P0 敏感引用范围 |
| Step 5 来源优先级 | secret / credential refs 不参与普通覆盖链,普通来源不能提供真实秘密材料 | 固定敏感配置来源边界 |
| Step 6 profile 矩阵 | local / CI 不使用真实 secret;staging-like / production-like 只允许 secret / credential refs | 固定不同 profile 的敏感处理 |
| `00-需求文档.md` F-006 / BR-007 | 错误、日志、示例、诊断和报告不得泄露敏感凭据材料 | 固定禁止输出规则 |
| `03-详细设计.md` §13 / §14 | `ConfigValidator` 拒绝 raw secret / token,日志和审计不得保存原始正文 | 固定配置校验与观测边界 |

已确认结论:

```text
P0 正式配置项没有 secret material。
P0 允许 endpoint ref、boundary ref、fake credential ref 这类 sensitive reference。
真实 secret、token、password、private key、credential value 不得进入 JSON config file、env、CLI / job args、日志、错误返回、审计正文、测试报告、reports 或 outbox event。
P1/P2 如果接入真实 credential provider,也只能通过 SecretRef / CredentialRef / adapter-local binding ref 表达。
```

## 3. SOP 问题回答

1. 哪些配置是 sensitive 或 secret?

   回答：`boundaries.formal_api_endpoint_ref`、`boundaries.bus_event_boundary_ref`、future `formal_api_credential_ref`、future `bus_boundary_credential_ref`、future `registry_credential_ref` 和 future `secret_provider_binding_ref` 属于 sensitive reference。真实 password、private key、token、credential value、cert private material 属于 secret material,不属于 L0-sdk 普通配置项。

2. 敏感配置如何存储,是否允许明文?

   回答：sensitive reference 可以作为引用写入 JSON config file 或 env override,但不得包含真实秘密材料。secret material 只能由外部密钥系统、部署环境或 adapter-local secure binding 管理;L0-sdk 配置、状态、日志、报告和事件只保存引用、脱敏标识或不可逆 fingerprint。

3. 敏感配置如何轮换?

   回答：P0 不负责真实 secret rotation。fake credential ref、endpoint ref 或 boundary ref 变更后,需要重新启动 runtime 或重新执行对应 job。P1/P2 的真实 secret rotation 由部署与运维手册承接;配置设计只要求轮换记录 actor、trace_id、ref id、原因、影响范围和时间,不得记录 secret material。

4. 读取和变更是否需要审计?

   回答：sensitive reference 的配置变更必须审计;读取失败、解析失败、ref 不存在和 provider 不可用也要留下脱敏诊断。P0 internal path / root 变更按普通配置审计处理。任何 secret material 读取成功都不得记录值,只记录 provider / dependency kind、ref id 的脱敏形态和结果类别。

5. 日志、错误返回、审计中如何避免泄露?

   回答：日志、错误返回、审计、metric label、测试报告、human-readable report、outbox event 和 validation evidence 都只能出现 redacted ref、dependency kind、error class、trace_id、actor_ref、timestamp 和不可逆 fingerprint。错误文案不得回显配置原值,只能表达 missing / invalid / unavailable / forbidden。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| Step 7 配置项清单 | 已标注 sensitive-ref,但未说明存储、轮换、审计和输出边界 | 实现者可能把 endpoint / credential ref 当普通字符串处理 |
| Step 5 来源优先级 | 已规定普通来源只能提供引用 | 需要在本步扩展为禁止明文、轮换和审计规则 |
| Step 6 profile 矩阵 | 已说明 local / CI / staging / production-like 的敏感处理差异 | 需要形成可回填的 profile 敏感配置表 |
| 当前 `04-配置设计.md` | 尚未创建 §8 | 无法给测试、验收和实施提供 secret 泄露门禁 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| P0 secret 口径 | 只在禁止项中说明不能保存真实秘密材料 | 明确 P0 无 secret material 配置,只有 sensitive reference | 防止 KMS / Vault 成为 P0 前置 |
| sensitive reference | 只在 Step 7 标注 | 明确 endpoint ref、boundary ref、credential ref 的存储与审计规则 | 防止 ref 被当成普通字符串输出 |
| 输出边界 | 散落在需求、架构和详细设计 | 汇总日志、错误、审计、报告、metric、event、evidence 的禁止输出规则 | 支撑测试和验收一票否决 |
| 轮换 | 未定义 | P0 ref 变更需重启或重跑;P1/P2 由运维承接 | 避免在配置设计中虚构 hot reload |
| 03 回写 | 未判断 | 不新增 secret provider 或 credential 字段 | 无需回写 03 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：P0 直接设计 KMS / Vault / registry token 配置 | 生产化看似完整 | 会新增字段、provider lifecycle 和运维前置,超出 P0 | 不采用 |
| 方案 B：P0 只允许 sensitive reference,真实 secret material 外部托管 | 不阻塞默认可验证路径,且安全边界清晰 | P1/P2 真实接入需后续专项 | 采用 |
| 方案 C：允许 env 或 CLI 传真实 secret 以便调试 | 本地调试方便 | 违反需求安全边界,极易泄露到 shell history / logs / reports | 不采用 |

推荐方案 B。

原因:

- L0-sdk 是官方客户端接入层,不应成为 secret store。
- P0 主要证明 local / CI / integration / candidate validation 默认可验证路径,不需要真实生产凭据。
- 引用式边界可以支撑后续 production-like 集成,同时不改变当前 `SdkRuntimeConfig` 代码契约。

## 7. 结构化中间产物

### 7.1 敏感配置表

| 配置项 | 敏感级别 | 存储方式 | 是否可明文 | 轮换方式 | 审计要求 |
|---|---|---|---|---|---|
| `boundaries.formal_api_endpoint_ref` | sensitive | endpoint ref | 只能明文保存 ref,不能包含 credential value | ref 变更后重启 runtime 或重跑 job | 记录 actor、trace_id、ref id、原因和影响 adapter |
| `boundaries.bus_event_boundary_ref` | sensitive | boundary ref | 只能明文保存 ref,不能包含 bus credential | ref 变更后重启 runtime 或重跑 job | 记录 actor、trace_id、ref id、原因和影响 adapter |
| `boundaries.fake_endpoint_ref` | internal | fake / fixture endpoint ref | 可明文保存 ref,必须保留 fake marker | ref 变更后重跑验证 | 普通配置审计,记录 fake marker 状态 |
| `policies.credential_protection` | public | policy profile | 可明文保存 profile,不得降级为允许 secret material | 不支持热更新 | 变更需记录并通过 validator |
| future `formal_api_credential_ref` | sensitive | credential ref | 不能保存 credential value | 运维轮换 ref,重启相关入口 | 必须审计 ref 变化和解析失败 |
| future `bus_boundary_credential_ref` | sensitive | credential ref | 不能保存 credential value | 运维轮换 ref,重启相关入口 | 必须审计 ref 变化和解析失败 |
| future `registry_credential_ref` | sensitive | credential ref | 不能保存 token value | 发布专项定义 | 必须审计 ref 变化,不得进入 reports |
| future `secret_provider_binding_ref` | sensitive | provider binding ref | 不能保存 provider secret | 部署与运维手册定义 | 必须审计 provider binding 变化 |
| password / private key / token / credential value / cert private material | secret | 不允许进入 L0-sdk 普通配置 | 否 | 外部密钥系统处理 | 不得进入本仓审计正文 |

### 7.2 禁止输出规则

| 输出位置 | 禁止内容 | 允许内容 |
|---|---|---|
| 日志 | secret material、credential value、token、private key、完整 endpoint credential | redacted ref、dependency kind、error class、trace_id |
| 错误返回 | 配置原值、secret material、provider response body | missing / invalid / unavailable / forbidden 结果码 |
| 审计正文 | secret value、token value、完整外部响应正文 | actor_ref、trace_id、changed_field、redacted ref、reason、timestamp |
| metric label | secret ref 全文、credential value、完整 endpoint | boundary kind、dependency kind、result、error class |
| validation evidence | request / response body、secret、token、credential value | evidence ref、redaction marker、fingerprint、result |
| reports | secret value、真实 credential ref 全文、生产响应正文 | redacted ref、failure category、trace_id |
| outbox event | secret、credential、payload body、生产请求 / 响应正文 | redacted reference、state change、fingerprint |

### 7.3 profile 敏感配置处理表

| profile | 敏感配置处理 |
|---|---|
| local-dev | 不使用真实 secret;可使用 fake credential ref 或禁用真实 boundary |
| ci-test | 不使用真实 secret;fixture ref 必须不可解析为真实 secret;报告必须做泄露扫描 |
| integration-test | real-like boundary 只能使用 ref,不能把真实 secret 写入 JSON / env / CLI |
| candidate-validation | package registry token 不进入 P0;smoke/docs/boundary evidence 必须保留 redaction marker |
| staging-like | 允许 secret / credential ref;真实 material 由外部 provider 注入 |
| production-like | 只允许 secret / credential ref;真实 material 由安全运维注入、轮换和审计 |

### 7.4 敏感引用边界图

#### 配置来源链图: L0-sdk 敏感引用边界

```text
JSON config / env / CLI selector
  |
  +-- allowed: EndpointRef / BoundaryRef / CredentialRef
  |
  +-- rejected: secret material / token value / private key
  |
  v
ConfigValidator
  |
  +-- validate ref shape
  +-- reject forbidden material
  +-- preserve redaction marker
  v
SdkRuntimeBuilder
  |
  +-- pass redacted refs to adapters
  +-- never expose secret value to domain / application / reports
```

关键说明:

- 图中表达的是敏感引用边界,不是完整配置加载流程。
- `ConfigValidator` 只校验引用形态和禁止材料,不解析或持有真实 secret。
- `SdkRuntimeBuilder` 只能把 redacted refs 交给 adapter 或外部 provider binding。
- domain、application services、reports 和 outbox event 都不得接触 secret material。

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 无 secret material 配置项,只允许 sensitive reference | 否 | 安全配置规则 | 无 | 无回写 |
| `boundaries.*_ref` 可作为 sensitive reference,但不得包含 credential value | 否 | 配置校验规则,不改变字段结构 | 无 | 无回写 |
| future credential / registry / secret provider 只保留 P1/P2 引用边界 | 否 | 范围裁剪 | 无 | 无回写 |
| 若未来把 credential ref / secret provider binding 做成正式配置项 | 是 | runtime config / adapter contract 变化 | `03-详细设计.md` §13 或 adapter 契约章节 | 待回写 |

说明:

- 本步没有新增 `SdkRuntimeConfig` 字段、adapter constructor 参数、trait 方法、错误枚举或函数流。
- 后续如果真实 secret provider 进入正式 P0 配置项,必须先回写 `03-详细设计.md`。

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §8。

````md
## 8. 敏感配置与密钥管理

> 校准来源：
> - `design-calibration/04_config_step_08_sensitive_secrets.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“敏感配置表”“禁止输出规则”“profile 敏感配置处理表”“敏感引用边界图”和“对详细设计的影响判定”小节，了解本章密钥边界如何从配置项清单收敛。

本轮 P0 正式配置项没有 secret material。P0 允许 endpoint ref、boundary ref、fake credential ref 这类 sensitive reference;真实 password、private key、token、credential value、cert private material 不得进入 JSON config file、env、CLI / job args、日志、错误返回、审计正文、测试报告、reports、validation evidence 或 outbox event。

`boundaries.formal_api_endpoint_ref`、`boundaries.bus_event_boundary_ref` 和 future credential refs 只能保存引用。引用变更必须审计 actor、trace_id、ref id、原因、时间和影响 adapter;读取或解析失败只能输出脱敏错误类别,并按 fail-fast 或 fail-closed 处理。

P1/P2 如果引入真实 credential provider、registry credential 或 secret provider binding,必须先回写详细设计或进入部署运维专项,不能在 P0 配置中临时新增真实 secret 字段。
````

## 10. 待确认事项

- 是否接受 P0 没有 secret material 配置项。
- 是否接受 endpoint ref、boundary ref 和 future credential ref 只能作为 sensitive reference。
- 是否接受真实 secret、token、password、private key、credential value 不得进入配置、日志、错误、审计、报告、evidence 和 outbox event。
- 是否接受未来若新增 credential ref / secret provider binding 正式字段,必须先回写 `03-详细设计.md`。

## 11. 进入下一步条件

- [x] 敏感配置表已覆盖 P0 sensitive reference 和 P1/P2 future refs。
- [x] 禁止输出规则已覆盖日志、错误、审计、指标、报告、evidence 和 event。
- [x] profile 敏感配置处理边界已明确。
- [x] 本步无需回写 `03-详细设计.md`。
- [x] Step 8 状态从 `[~]` 更新为 `[x]`。
