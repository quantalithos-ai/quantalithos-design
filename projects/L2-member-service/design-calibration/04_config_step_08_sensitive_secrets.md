# Step 8：定义敏感配置与密钥管理

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 8
> 回填章节：未来正式 `04-配置设计.md` §8“敏感配置与密钥管理”
> 参考粒度：`projects/L1-governance/design-calibration/04_config_step_08_sensitive_secrets.md`
> 执行模式：full-restart；不写入任何 raw secret、token、密码、证书或外部正文

## 1. Step 状态

| 项目 | 记录 |
|---|---|
| 当前文档 | `04-配置设计.md`（正式文件尚未创建） |
| 当前 Step | Step 8 敏感配置与密钥管理 |
| 当前模块 | `sensitive_secrets` |
| Step 状态 | `completed / pass_with_upstream_blockers` |
| 输入基线 | Step 5 来源优先级、Step 7 配置项、`03` redaction / forbidden-body、L1-governance Step 8 |
| 正式 `04` 写入 | `false`；仅 Step 15 装配 |
| 实现 / 测试 / 证据 | `false`；只定义处理规则，不声称 provider、rotation 或 audit backend 已存在 |
| commit | `false` |

### 1.1 Step 内计划

- [x] 为所有 opaque credential / endpoint / target / replay ref 划分敏感级别。
- [x] 区分普通配置中的 ref、受控 provider 中的 secret material 和 forbidden body。
- [x] 定义存储、读取、轮换、审计、日志、错误、trace、report 和 artifact 的禁止输出规则。
- [x] 定义 local/CI/integration/replay/future production profile 的敏感处理差异。
- [x] 完成敏感配置停审、跨域泄露审计、`03` 影响判定和 §8 回填草稿。

## 2. 本步目标与边界

本 Step 只定义敏感配置的语义、引用和安全处理，不选择具体 KMS/Vault/secret manager，不定义部署挂载命令、证书安装、IAM policy、rotation API 或 provider health contract。真实秘密材料永远不进入本仓普通 JSON、环境变量、domain、contracts、日志、错误、审计正文、trace、report 或 artifact。

敏感级别遵循配置设计规范：`public`、`internal`、`sensitive`、`secret`。本仓的 opaque ref（例如 credential ref、endpoint ref、destination ref、DSN ref）属于 `sensitive`；ref 所指向的真实密码、token、private key、证书私钥和 secret body 属于 `secret`，只由未来批准的安全设施受控提供。

## 3. SOP 问题回答

| 问题 | 本仓结论 |
|---|---|
| 哪些配置敏感？ | `member_binding.binding_ref`、`images_binding.binding_ref`、`runtime_session_binding.binding_ref`、`sandbox_binding.binding_ref`、`registration_session.launch_credential_ref`、`publication.target_ref`、`handoff_feedback.target_ref`、`deterministic_fixture.source_ref` / replay source ref 以及未来 durable store / provider ref 均为 `sensitive`；carrier 仅有 availability marker，不定义 sensitive ref。 |
| 敏感配置如何存储？ | 配置只保存 opaque ref 和脱敏 label；provider 的真实材料不落盘到本仓，不复制到 domain 或 application。P0 使用 fake/placeholder/disabled ref。 |
| 是否允许明文？ | `secret` 级别一律不允许在普通 JSON、env、命令行、日志、错误、审计、trace、report、artifact 或 source control 明文出现。 |
| 如何轮换？ | P0 只支持变更 opaque ref 后重启或新 job run；不支持在线 secret material reload。真实 provider 轮换由后续运维 / ADR 定义，并要求审计和可撤销。 |
| 读取与变更是否审计？ | 记录脱敏的配置身份、ref 类别、变更 actor / reason / result；不记录 ref body、secret body 或 endpoint。provider exact audit sink 仍 pending。 |
| provider 不可用怎么办？ | 启用的 credential / target 无法解析时 fail-closed 或 blocked；禁用的外围目标可以保持 disabled；不得静默使用旧 raw secret 或低优先级 raw value。 |

## 4. 当前材料诊断

| 位置 | 问题 | 本 Step 修正 |
|---|---|---|
| 旧 README / `05/06` | 可能直接写 DSN、token、容器 credential 或 endpoint | 降级为历史污染；正文只写 ref 类别 |
| Step 7 | 已列 ref，但没有统一读取和输出边界 | 建立敏感配置总表、禁止输出矩阵和轮换规则 |
| 并行 sibling | launch credential、policy 和 endpoint owner 未闭合 | 只保存 opaque ref，owner / provider 保持 pending |
| observability | 错误、metric、trace 可能携带 ref 或 body | deny-by-default，字段类和 label allowlist 均由安全域收紧 |

## 5. 设计取舍

| 议题 | 方案 | 采用结论 |
|---|---|---|
| 配置保存秘密 | 保存 raw value / 只保存 opaque ref | 只保存 opaque ref |
| provider 读取时机 | handler 随时读取 / infra 启动解析后注入受控 handle | P0 由 `infra/config.rs` 校验 ref，builder 注入 typed seam；domain/application 不接触 body |
| secret 轮换 | hot reload / ref 变更后重启或新 run | P0 采用后者；hot reload 需回写 `03` |
| ref 是否可进日志 | 全量打印 / 仅类别和脱敏摘要 | 仅类别、稳定 hash/摘要（算法待实施确认），不打印 ref 原文或 body |
| provider 不可用 | 静默 fallback / fail-closed 或 blocked | 高风险目标采用 fail-closed；可选外围保持 disabled/degraded |

## 6. 敏感配置总表

| 配置项 | 敏感级别 | 存储方式 | 是否可明文 | 轮换方式 | 审计要求 | provider / owner 状态 |
|---|---|---|---|---|---|---|
| `member_binding.binding_ref` | sensitive | opaque ref in validated config | ref 可在受控配置中存在；body 否 | ref 变更 + restart | 记录类别、actor、结果，不记 body | Member 合同 pending |
| `images_binding.binding_ref` | sensitive | opaque ref | body 否 | ref 变更 + restart | 同上 | Images 合同 pending |
| `runtime_session_binding.binding_ref` | sensitive | opaque ref | body 否 | ref 变更 + restart | 同上 | Runtime 合同 pending |
| `sandbox_binding.binding_ref` | sensitive | opaque ref | body 否 | ref 变更 + restart | 同上 | Sandbox policy/backend pending |
| `registration_session.launch_credential_ref` | sensitive | opaque credential ref | raw credential 否 | provider rotation + ref update；P0 restart | 需 credential access / rotation audit | owner pending (`MSVC-UP-006`) |
| `publication.target_ref` | sensitive | opaque destination ref | endpoint secret 否 | ref 变更 + restart | target change audit | Core/Bus route pending |
| `handoff_feedback.target_ref` | sensitive | opaque destination ref | endpoint / token 否 | ref 变更 + restart | handoff target audit | feedback owner pending |
| `deterministic_fixture.source_ref` | sensitive | redacted fixture / replay ref | fixture body 否 | ci-test test-entry 或 operations-replay run replacement | test / replay audit | 仅 `ci-test` / `operations-replay` |
| replay state / report refs | sensitive | opaque historical ref | historical body 否 | new replay run | run-scoped audit | operations-replay only |
| future store / observability / provider refs | sensitive | approved provider ref | secret material 否 | provider-specific, future | ADR + operations audit | P1/P2 pending |

## 7. Profile 敏感处理矩阵

| Profile | 允许的敏感输入 | 禁止输入 | 读取 / 轮换 | 不可用策略 |
|---|---|---|---|---|
| `local-dev` | fake ref、placeholder ref、缺省 disabled | raw secret、真实 token、真实 DSN body | builder 只接 ref；修改后重启 | disabled / blocked |
| `ci-test` | deterministic fixture ref、fake credential ref | secrets in CI env、raw history/body | 每 run 隔离；不得写日志 | test setup fail-fast |
| `integration-like` | controlled credential / endpoint / destination ref | raw material、未审计 provider | ref 在 startup 绑定；不支持 hot rotate | enabled target fail-closed |
| `operations-replay` | 脱敏 state/outbox/report ref、fake target ref | raw historical body、生产 credential | run-start 冻结 | job rejected / blocked |
| `staging-like` | future approved provider ref | 普通 JSON 中 raw secret | future provider rotation | P1 blocked until provider contract |
| `production-like` | approved provider ref only | raw secret in file/env/CLI/log | future audited rotation | fail-closed |

## 8. 禁止输出与访问规则

| 表面 | 允许输出 | 禁止输出 |
|---|---|---|
| 配置文件 / env | profile、ref 类别、opaque ref（按安全存放规则） | password、token、private key、certificate body、DSN body |
| domain / contracts | safe ref、redacted marker、availability | credential body、endpoint secret、外部正文 |
| 日志 / metric | profile、operation kind、disposition、safe issue code | ref 原文、secret、URL query、header、body、高基数 id |
| error / API response | body-free code、safe reason、correlation ref | secret、stack 含 body、provider response body |
| history / audit | ref 类别、脱敏摘要、actor、reason、结果 | secret material、外部正文、manifest、credential body |
| trace / report / artifact | redacted config identity、字段类别、run-scoped ref | raw config snapshot、secret、完整 endpoint 或历史 body |

访问者只能得到最小权限的 typed handle 或 safe summary；本仓不定义 provider 权限模型。任何无法确认 redaction 的路径都按 fail-closed 处理。

## 9. 读取、轮换和撤销规则

```text
[opaque ref from validated config]
          -> [infra controlled resolver / provider seam]
          -> [typed handle or unavailable]
          -> [adapter invocation]
          -> [redacted result / blocked]
```

- `infra/config.rs` 只验证 ref 格式、profile 允许性和 forbidden-body；不把 provider body 放入 `ValidatedMemberServiceConfig` 的公共载体。
- `infra/runtime_builder.rs` 只向 adapter 注入 typed handle、availability 或 placeholder；`domain`、`contracts`、application 和 job report 不读取 body。
- P0 轮换路径是提交新 opaque ref、重新验证并 restart；in-flight run 不被热替换。
- ref 撤销或 provider 不可用时，新的高风险 launch、Sandbox bind、publication/handoff 使用 fail-closed；已有 local history 不被删除或改写。
- 轮换、撤销和读取失败只记录脱敏 issue code 与 correlation，不记录 secret 或 provider response。

## 10. 敏感配置停审记录

| 配置域 | 存储 / 读取 | 轮换 / 撤销 | 输出禁止 | 结论 |
|---|---|---|---|---|
| member / images / runtime / sandbox binding | opaque ref、typed seam | cold restart；owner pending | body / manifest / policy body 禁止 | 通过（上游 blocker 保留） |
| launch credential | sensitive ref，provider body 外置 | audited future rotation；P0 ref+restart | raw credential 禁止 | 通过（owner pending） |
| publication / handoff target | sensitive destination ref | ref+restart | endpoint secret / receipt body 禁止 | 通过（Core/Bus pending） |
| deterministic fixture / replay | redacted ref；仅 `ci-test` / `operations-replay` | run-scoped replacement | historical body 禁止；`local-dev` / `integration-like` 不启用该配置域 | 通过 |
| future provider refs | sensitive ref | ADR/运维承接 | raw secret 禁止 | 通过（future） |

## 11. 跨敏感配置泄露风险审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| raw secret 是否进入 JSON/env/CLI | 否 | validator reject；示例只使用 null / opaque ref |
| ref 是否进入 domain/application | 仅 typed safe ref / handle | 不传 provider body |
| 日志、错误、trace、report 是否可能带 secret | 不允许 | deny-by-default；失败按 fail-closed |
| deterministic fixture 是否可读取 production secret 或进入非允许 profile | 不允许 | `ci-test` / `operations-replay` guard + test-only ref；`local-dev` / `integration-like` 直接拒绝该配置域 |
| 普通来源是否能覆盖敏感 material | 不允许 | 只接受 opaque ref；raw value reject |
| rotation 是否支持无审计 hot swap | 不允许 | P0 restart/new run；future 先回写 `03` |
| provider / owner 未闭合是否被伪装 ready | 否 | pending / blocked / unavailable |
| 是否需要新增 `03` secret trait / DTO | 当前不需要 | future provider API 才触发回写 |

## 12. 对 `03-详细设计.md` 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 只在配置中保存 opaque ref，raw material 外置 | 否 | 承接既有 redaction / ref boundary | 不适用 | 无回写 |
| provider 不可用时 blocked / fail-closed | 否 | 承接既有 adapter / error disposition | 不适用 | 无回写 |
| P0 ref 轮换通过 restart / new job run | 否 | 既有冷生效边界 | 不适用 | 无回写 |
| future secret provider API、online rotation、credential health 或新 handle 类型 | 是 | Port / adapter / builder / error / flow 变更 | `03` §5、§7、§12~§15 | future design-change-required；当前不进入 P0 |

## 13. 回填草稿：正式 `04-配置设计.md` §8

> 校准来源：
> - `design-calibration/04_config_step_08_sensitive_secrets.md`
>
> 延伸阅读：
> - 建议阅读“敏感配置总表”“Profile 敏感处理矩阵”“禁止输出与访问规则”“读取、轮换和撤销规则”“停审记录”和“跨敏感配置泄露风险审计表”。

正式 §8 应写入敏感级别、opaque ref 规则、profile 处理、禁止输出、读取链、轮换 / 撤销边界和审计要求。不得写 raw secret 或具体 provider API，不得把 provider、launch credential、policy 或 endpoint owner 伪装成已闭合。

## 14. 待确认事项

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| launch credential owner 与签发 / 撤销接口 | 影响 `registration_session.launch_credential_ref` | opaque ref + fail-closed，`MSVC-UP-006` pending |
| Sandbox policy / credential ref owner | 影响 Sandbox binding | placeholder / blocked；不解析 body |
| secret provider 和 rotation audit backend | 影响 P1/P2 | 不进入 P0；由 ADR / 运维文档承接 |
| ref canonicalization / stable digest 算法 | 影响测试和审计关联 | 只定义脱敏语义，算法留实施门禁 |

## 15. 自检与停审结论

| 检查项 | 结果 | 说明 |
|---|---|---|
| 所有 sensitive 配置已回指 Step 7 | pass | 总表覆盖 binding、target、fixture、replay refs |
| raw secret / body 未进入正文或示例 | pass | 仅 opaque ref、null、placeholder |
| profile、读取、轮换、审计和禁止输出已明确 | pass | §7~§9 |
| provider / owner blocker 未伪装 ready | pass_with_upstream_blockers | pending / blocked / future |
| `03` 影响已判定 | pass | 当前无回写 |
| 正式正文未提前创建 | pass | 仅形成回填草稿 |
| 下一步条件 | pass_with_upstream_blockers | 允许进入 Step 9 加载、校验与生效 |

```text
step_08_status = completed / pass_with_upstream_blockers
step_08_gate = pass_with_upstream_blockers
formal_04_write_allowed = false
next_allowed_action = enter_step_09_loading_validation_activation
implementation_allowed = false
test_execution_allowed = false
commit_allowed = false
```
