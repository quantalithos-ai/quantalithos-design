# Step 8. 定义敏感配置与密钥管理

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 8
> 回填章节：`04-配置设计.md` §8 敏感配置与密钥管理
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_08_sensitive_secrets.md`
> 状态：`completed / pass_with_upstream_and_design_blockers / stop_review`
> 日期：2026-09-03

## 1. Step 状态

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 8：定义敏感配置与密钥管理 |
| 输入 | Step 5 来源规则、Step 6 profile、Step 7 配置项、`03 §13/§14` body-free / redaction 边界 |
| 输出 | 敏感级别归一、敏感配置表、读取图、profile 处理、禁止输出规则、轮换审计和跨敏感项审计 |
| 当前状态 | 已完成；允许进入 Step 9 |
| P0 规则 | 普通 JSON / env 只能携带 opaque ref；真实 secret 不进入 `Member*ConfigRef`、application、domain、contracts、日志、错误、审计或 report |
| 热更新 | P0 不支持 sensitive hot reload；startup ref 通过受控变更 + restart，job ref 通过新 job-run 生效 |
| 持续 blocker | `L2M-UP-001/002/003/004/005/006/007/008`、`L2M-DDD-001~007`、`scope_supersede_gap` 继续开放 |

## 2. 本步目标与执行边界

本 Step 将 Step 7 的 `sensitive` ref 与规范的 `secret` 材料分离，明确存储、读取、轮换、审计和禁止输出。敏感配置只描述 adapter / Store slot 的引用，不取得相邻 owner 的凭据真相，也不改变任何业务事实。

本 Step 不选择 Vault、KMS、云密钥服务、文件挂载、证书格式或具体 endpoint；这些由 owner / 技术 authority 和未来 09 运维材料承接。本 Step 不定义 raw secret 示例，不实现 provider，不新增 secret Port 或代码字段。

## 3. SOP 问题回答

| 问题 | L2-member 结论 |
|---|---|
| 哪些是 `sensitive`？ | `stores.*_ref`、`consumer.source_ref`、`projection.rebuild_target_ref`、八个 `resolvers.*_ref`、六个 `handoff.*_ref` 等 opaque refs 属 `sensitive`；它们可能揭示存储、拓扑、目标或凭据关联。 |
| 哪些是 `secret`？ | 真实 password、private key、raw token、certificate/private material、raw DSN credential、外部 endpoint credential 或 provider 返回的秘密材料属于 `secret`；Step 7 不允许它们成为普通配置项。 |
| 如何存储、是否允许明文？ | `sensitive` 只以受控 opaque ref 形式进入 JSON / allowlisted env；`secret` 只能由未来 approved provider 在 adapter 内部读取，不能明文进入普通文件、env、代码、文档、artifact 或日志。 |
| 如何轮换？ | startup ref 轮换为新 ref + 受控配置变更 + restart；job-run-start ref 在下一次 invocation 使用；provider 内部 secret rotation 需重新校验 adapter availability。P0 不做自动 hot reload。 |
| 读取和变更是否审计？ | 必须审计。只记录 slot、profile、来源类别、旧 / 新 redacted fingerprint、变更原因、验证结果和生效方式，不记录完整 ref 或 secret material。 |
| 如何避免日志 / 错误泄露？ | 仅输出有限 slot、safe issue kind、redacted diagnostic ref 和 one-way fingerprint；禁止 raw config、完整 opaque ref、secret、endpoint、route、外部正文、stack trace 和自由文本 provider error。 |
| 是否存在 raw secret fallback？ | 不存在。provider 不可达时按 slot criticality fail-fast 或 blocked，不退回普通 file / env 的 raw 值，也不把 fake 当成功。 |
| 是否影响 03？ | 当前不影响。只细化既有 ref 的安全处理；若 future provider 要新增 Port、constructor、carrier 或 error，必须先回开 03。 |

## 4. 敏感级别归一

| 级别 | 本项目含义 | 可否进入普通配置 | 处理要求 |
|---|---|---:|---|
| `public` | 不揭示安全、拓扑或 owner 信息的公开 label | 是 | 仍须通过 schema / provenance 校验 |
| `internal` | 内部运行姿态、bounded class、redaction policy、logical registry | 是 | 不对外暴露；高风险变更需审计 |
| `sensitive` | opaque Store / adapter / target / resolver ref 或拓扑关联 | 仅 ref 形式 | 不记录完整值；来源、读取和变更必须审计 |
| `secret` | 真实凭据、密钥、token、证书私密材料或 provider 返回值 | 否 | 只在受控 provider / adapter 内短暂使用；禁止进入本仓持久化和观测面 |

`redaction` deny list 属 `internal` 但为安全关键不变量；不能被 debug、profile、admin override 或环境变量关闭。`technical.*_ref` 在当前示例中是内部 selector；若实际绑定含 credential，则按 `sensitive` / `secret` 规则升级处理。

## 5. 敏感配置读取图

#### 敏感配置读取图：L2-member opaque ref 到 adapter

```text
[JSON / allowlisted env]
        |
        v
[opaque sensitive ref only]
        |
        v
[infra/config.rs: parse + type / owner / scope validate]
        |
        v
[redacted Member*ConfigRef + provenance + issue ref]
        |
        v
[infra/runtime_builder.rs]
        |
        +--> [Store / resolver / handoff adapter slot]
        +--> [MemberAdapterAvailability / BlockedSeamState]
        |
        v
[application Port]

[approved secret provider] --(adapter-internal lookup)--> [transient secret material]
                                      |
                                      +--> never enters domain / contracts / local truth / audit / log
```

关键说明：

- 普通配置只提供 ref；图不表示任何具体 provider、endpoint、transport 或部署挂载。
- adapter 内部得到的 secret material 不得变成 `MemberRuntimeConfigRef` 字段，不得写入 local Store、typed result、receipt、report、trace 或 metric。
- provider 返回的“可用”只表示 adapter 可以继续做其被授权的 local boundary 操作，不代表 host、Runtime、Bus、owner 或 downstream 成功。
- provider 不可用或 ref owner / scope 不匹配时，保持 fail-fast、`Blocked`、`Waiting`、`Unknown` 或 `NotAvailable`。

## 6. 敏感配置表

| 配置项族 | 敏感级别 | 存储方式 | 是否可明文 | 轮换方式 | 审计要求 |
|---|---|---|---:|---|---|
| `stores.truth_ref` | sensitive；内部 credential 另属 secret | JSON / env 只存 opaque Store ref | 否（不得存 DSN / credential） | 新 ref + restart；provider rotation 后重建 slot | slot、profile、old/new fingerprint、validation result |
| `stores.support_ref` | sensitive | opaque support Store ref | 否 | 新 ref + restart | support slot 变更审计 |
| `stores.projection_ref` | sensitive | opaque projection Store ref | 否 | 新 ref + restart | projection slot、watermark compatibility 检查 |
| `stores.continuation_ref` | sensitive | opaque continuation Store ref | 否 | 新 ref + restart | continuation slot、gap compatibility 检查 |
| `stores.idempotency_ref` | sensitive | opaque idempotency Store ref | 否 | 新 ref + restart | replay / reservation compatibility 审计 |
| `stores.result_ref` | sensitive | opaque typed-result Store ref | 否 | 新 ref + restart | result / receipt / report carrier compatibility 审计 |
| `consumer.source_ref` | sensitive | opaque owner-specific source ref | 否 | 新 ref + restart | source family、scope、schema posture 审计 |
| `projection.rebuild_target_ref` | sensitive | opaque job target ref | 否 | 新 ref + new job-run | target、scope、watermark compatibility 审计 |
| `resolvers.work_ref` / `identity_ref` | sensitive | owner-specific opaque ref | 否 | 新 ref + restart | owner kind、scope、ref fingerprint |
| `resolvers.credential_ref` | sensitive + provider secret behind ref | opaque credential resolver ref | 否 | ref rotation + restart；provider material rotation按 owner规则 | credential slot、权限结果、无 secret 内容 |
| `resolvers.governance_ref` | sensitive | opaque policy safe-result ref | 否 | 新 ref + restart | policy source kind、freshness / validation result |
| `resolvers.runtime_ref` | sensitive | opaque Runtime source ref | 否 | 新 ref + restart | Runtime slot、blocked / availability marker |
| `resolvers.tools_ref` / `method_ref` | sensitive | opaque safe-view ref | 否 | 新 ref + restart | owner kind、safe-view compatibility |
| `resolvers.host_route_ref` | sensitive | opaque host-route ref | 否 | 新 ref + restart | host / route slot、未输出 endpoint |
| `handoff.host_ref` / `runtime_ref` | sensitive | opaque handoff ref | 否 | 新 ref + restart | handoff kind、availability、local marker |
| `handoff.publication_ref` / `observation_ref` | sensitive | opaque local handoff ref | 否 | 新 ref + restart | attempt / gap compatibility；不得生成 event config |
| `handoff.archive_ref` / `external_export_ref` | sensitive | opaque optional target ref | 否 | 新 ref + new job-run or restart | target change、job invocation、failure marker |
| `diagnostics.provenance_visibility` | internal safety-critical | ordinary JSON; fixed safe enum | 可保存枚举 | P0 仅 strict internal；改变需正式审计 | rejected unsafe change + issue ref |
| `diagnostics.redaction_mode` | internal safety-critical | ordinary JSON; fixed `strict` | 可保存枚举 | P0 不允许关闭；需回开设计 | every attempted change audited |
| `diagnostics.metric_label_mode` | internal safety-critical | ordinary JSON; fixed low-cardinality | 可保存枚举 | P0 不允许放宽 | rejected high-cardinality attempt audited |
| any raw password / private key / raw token / certificate private material | secret | approved external provider only | 否 | provider-side rotation; runtime rebind by ref / restart | 只审计 provider ref fingerprint 与结果 |

## 7. Profile 级敏感处理

| Profile | 允许表示 | 禁止项 | 不可用策略 |
|---|---|---|---|
| `local-dev` | fake / in-memory opaque refs、test-only selector | raw secret、真实生产 credential、外部正文 | invalid ref fail-fast；optional slot blocked |
| `ci-test` | deterministic fixture refs、ephemeral fake refs | production secret、真实 endpoint credential、raw fixture body | fixture / provider 缺失使该 test setup fail |
| `integration-like` | owner-approved adapter refs、controlled credential refs | raw credential、默认 fake fallback、foreign body | required owner slot fail-fast；外围 slot blocked / delayed |
| `operations-replay` | de-identified replay root ref、read-only target ref | raw historical body、secret、未知副作用 target | missing ref reject；target failure写 safe report |
| `staging-like` | future approved provider refs、durable refs | test fixture、明文 JSON / env secret | provider / permission failure fail-fast |
| `production-like` | approved provider refs only | ordinary raw secret、fixture、admin override | fail-fast；不使用 fake fallback |

## 8. 禁止输出规则

| 输出面 | 允许 | 禁止 |
|---|---|---|
| structured log | profile、slot kind、source class、safe error kind、redacted issue ref、one-way fingerprint | full ref、raw secret、endpoint、route、credential、provider response、body |
| API / worker / Job error | public / internal error code、safe diagnostic ref | secret、full ref、DSN、header、stack trace、foreign body |
| logical audit | actor / change ref、slot、old/new redacted fingerprint、validation result、生效方式 | raw config、secret、完整 endpoint、provider body、外部 truth |
| trace / span | trace ref、slot kind、有限 outcome、safe diagnostic ref | secret、credential、full ref、request / response body、high-cardinality value |
| metric | finite profile / slot / outcome / error class | ref、endpoint、actor、token、secret、自由文本 |
| typed result / receipt / report | safe marker / issue ref、local disposition、counts | secret、credential、external response、raw config |
| test artifact | 脱敏配置 fingerprint、safe fixture id | raw config file、secret provider response、raw historical body |

任何日志框架、debug flag、panic / exception wrapper 或 report serializer 都不得绕过上述规则。无法证明已脱敏时，宁可省略字段并返回 safe diagnostic ref。

## 9. 读取、轮换与审计承接

| 敏感配置族 | Step 7 回指 | Step 5 来源规则 | Step 9 承接 | Step 10 承接 |
|---|---|---|---|---|
| Store refs | `stores.*_ref` | file / allowlisted env 仅 opaque ref | owner / scope / format validation；required slot fail-fast | startup change review、old/new fingerprint、rollback ref |
| source / resolver refs | `consumer.source_ref`、`resolvers.*_ref` | ref 不能被 raw endpoint 覆盖 | owner-specific validation、availability / blocked seam | per-owner binding audit、new ref restart |
| handoff refs | `handoff.*_ref` | optional ref 缺失不 default-pass | local attempt / gap posture、no external success claim | target change + job-run audit |
| projection target ref | `projection.rebuild_target_ref` | job-run-start ref 不覆盖 startup composition | validate before job invocation | run-scoped change audit |
| secret material | provider boundary, not Step 7 value | no ordinary fallback | adapter-internal resolution、expiry / permission check | provider-side rotation record + safe runtime rebind |
| diagnostics safety config | `diagnostics.*` | ordinary source but strict enum | reject unsafe value | high-risk review and rollback to strict value |

## 10. 敏感配置停审记录

| 配置族 | ref / secret 分离 | 明文禁止 | 轮换可执行 | 输出边界 | 03 影响 | 结论 |
|---|---|---|---|---|---|---|
| Store / result refs | 是 | 是 | restart | redacted fingerprint only | 无 | 通过 |
| resolver / source refs | 是 | 是 | restart | slot / owner kind only | 无 | 通过 |
| handoff / target refs | 是 | 是 | restart / new job | local marker only | 无 | 通过 |
| diagnostics safety settings | 不涉及 secret | safe enum only | controlled restart | strict redaction | 无 | 通过 |
| provider secret material | 是 | 强制禁止 | provider rotation | never emitted | 无 | 通过 |

## 11. 跨敏感配置泄露风险审计表

| 审计项 | 结果 | 缺口 / 修正 |
|---|---|---|
| Step 7 是否含 raw secret | 通过 | 只有 opaque ref / null / enum；未出现秘密材料 |
| 普通 file / env 是否能覆盖 secret | 通过 | provider material 独立；raw 值直接拒绝 |
| ref 是否可能把 endpoint / route body 带入应用 | 通过 | ref 仅 opaque；adapter 内部也只返回 safe outcome |
| logs / errors / audit / reports 是否泄露 | 通过 | 统一 slot + fingerprint + safe issue 规则 |
| test fixture 是否可能泄露生产 credential | 通过 | fixture 与 production-like 隔离；生产检测到 fixture 即拒绝 |
| rotation 是否误改业务 truth | 通过 | 只替换 adapter slot / availability；不修改 local fact、state、replay 或 owner truth |
| provider unavailable 是否 silent fallback | 通过 | critical fail-fast，外围 blocked；不回退 raw / fake |
| `L2M-UP-001/002/006` owner contract 是否被伪造 | 通过 | 只记录 pending ref / blocked posture，不写 credential / endpoint |
| 是否需要新增 secret Port / carrier | 未发现 | 当前只定义安全语义；若未来需要则先回开 03 |

## 12. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---:|---|---|---|
| 普通配置只携带 opaque ref，raw secret 不进入应用 / domain / contracts | 否 | 承接 `03 §13` body-free / config isolation | `03 §13` 已有 | 无回写 |
| provider material 只在 adapter 内部短暂使用 | 否 | 安全边界细化 | `03 §13` / Step 14 已有 | 无回写 |
| sensitive startup ref 采用 restart，job ref 采用 new job-run | 否 | 生效与变更语义 | 不改变 Port / flow | 无回写 |
| redaction / low-cardinality 规则不可关闭 | 否 | 承接 `03 §14` | `03 §14` 已有 | 无回写 |
| 未来 provider 需要新增 Port、constructor、carrier、error 或 secret lifecycle flow | 是 | 代码契约 / owner 变化 | `03 §4～§14` 与 owning Step | 已回写（03 已有回开规则；未来触发器当前未触发） |

当前没有实际“待回写”或“阻塞待确认”项；未来触发器不写入正式配置契约。

## 13. 回填草稿：正式 `04-配置设计.md` §8

> 校准来源：
> - `design-calibration/04_config_step_08_sensitive_secrets.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“敏感配置表”“Profile 级敏感处理”“禁止输出规则”“读取、轮换与审计承接”和“跨敏感配置泄露风险审计表”。

正式 §8 应收口为：

1. Store、resolver、source、projection target 和 handoff 的 opaque refs 属 `sensitive`；真实 password、private key、raw token、证书私密材料和 provider 返回值属 `secret`，不进入普通配置。
2. JSON / allowlisted env 只可携带 opaque ref；`infra/config.rs` 校验 ref 的形态、owner、scope 和 profile compatibility，`runtime_builder` 只注入 slot / availability / blocked seam。
3. P0 不支持敏感配置 hot reload；startup ref 使用受控变更 + restart，job ref 使用新 invocation；provider rotation 只重新绑定 adapter，不改变 local truth 或 external owner truth。
4. 日志、错误、审计、trace、metric、receipt、report 和测试 artifact 只允许 safe slot、redacted fingerprint、issue ref 和有限枚举，禁止 raw secret、完整 ref、endpoint、route、外部正文和 provider response。
5. provider 不可用、ref 过期或权限不足时，critical slot fail-fast，外围 slot 保持 `Blocked` / `Waiting` / `NotAvailable`；不得 fallback raw 值或 fake success。

## 14. 待确认事项与 blocker

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| credential / secret provider owner（`L2M-UP-001/006`） | provider、权限、rotation 和 slot criticality | opaque ref；provider 不可用 fail-fast / blocked |
| image / Runtime / Bus / host target ref（`L2M-UP-002~005`） | endpoint / route / release ref 语法和敏感级别 | 不写 full ref、manifest、route 或 credential |
| durable Store product | Store ref 内部凭据和 rotation | product-neutral；只保留 ref |
| redaction backend / deployment mount | 运维读取和审计执行 | 留 09；正文只定义禁止输出 |
| future hot rotation | reload / rollback contract | P0 restart / new job；提出需求则回开 03、Step 9～11 |

## 15. 进入 Step 9 的条件与停审结论

| 门禁 | 结果 | 依据 |
|---|---|---|
| sensitive / secret 分类已归一 | 通过 | §4、§6 |
| ref 与 raw secret 存储边界明确 | 通过 | §5、§6 |
| profile 级处理和不可用策略明确 | 通过 | §7 |
| 日志 / 错误 / 审计 / trace / metric / report 禁止输出明确 | 通过 | §8 |
| 轮换、读取和审计承接明确 | 通过 | §9 |
| 跨敏感项泄露风险审计完成 | 通过 | §10、§11 |
| 对 03 的影响已判定，无当前回写项 | 通过 | §12 |
| 正式 `04` 未提前创建 | 通过 | 遵守 Step 15 后置装配纪律 |

Step 8 完成。下一步允许创建 `04_config_step_09_loading_validation_activation.md`，定义 load、parse、type validate、cross-field validate、builder assembly、expose 和生效时机。

```text
step_08 = completed
gate_status = pass_with_upstream_and_design_blockers / stop_review
next_allowed_action = create_step_09_loading_validation_activation
formal_04_write_allowed = false_until_step_15
implementation_repo_write_allowed = false
test_execution_allowed = false
commit_required = false
```
