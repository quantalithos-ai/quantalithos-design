# Step 8. 定义敏感配置与密钥管理

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 8
> 正式回填：`04-配置设计.md` §8
> 状态：`completed / pass_with_upstream_blockers / stop_review`（连续授权下进入 Step 9）

## 1. Step 状态与输入

| 项 | 结论 |
|---|---|
| 当前 Step | Step 8：敏感配置与密钥管理 |
| 输入 | Step 5 来源优先级、Step 6 profile 矩阵、Step 7 P0 配置项、03 §13/§14 观测和禁止输出边界 |
| 输出 | 敏感配置表、secret 处理、读取/轮换/审计规则、统一禁止输出、profile 处理和停审审计 |
| 本步限制 | 不选择 KMS/secret manager/provider、算法、证书、真实 endpoint/DSN、密钥材料或轮换命令；不开放 hot reload |
| 术语 | `internal` 是内部运行配置；`sensitive` 是 ref/locator/target 等不能出现在日志的配置；`secret` 是真实秘密材料，永不作为普通配置项 |
| 下一动作 | 更新 flow/台账后进入 Step 9 |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些配置是 `sensitive` 或 `secret`？ | Step 7 的 binding/registry/target/route/store/receiver/source/codec/cursor/sink refs 均按暴露风险归为 `sensitive`；redaction profile 与 profile/config identity 属 `internal` 但为安全关键。password、private key、raw token、certificate body、DSN、raw endpoint credential、provider response 和外部材料正文属于 `secret`/受保护材料，不能进入普通配置。 |
| 敏感配置如何存储，是否允许明文？ | strict JSON/ENV 只存 opaque ref 或 finite non-secret enum；不存 raw secret、raw endpoint credential、DSN 或材料正文。解析后的 secret material 只能在 infra/adapter 私有边界短暂使用，不进入 `ArchiveRuntimeBindings`、domain、application、API、worker、日志、错误、report、audit、trace 或 artifact。 |
| 如何轮换？ | P0 不支持 hot reload。startup binding 通过新 opaque ref + 新 assembly/restart 生效；job-run-start 的 target/replay/receiver ref 通过新 job run 固化。旧 operation/effect 继续使用 pinned binding/config identity，不因轮换重建；轮换影响未决 intent 时保持 blocked/unknown，等待正式 probe/reconcile。未来 provider 原地轮换需另行回写 03/04。 |
| 读取和变更是否审计？ | 读取只记录 safe category/slot/profile/issue ref，不记录完整 locator 或材料。变更记录 actor category、config domain、profile、old/new redacted identity 或 digest ref、revision、validation result 和 activation posture；不记录 value、secret、endpoint、payload。具体审计落点由 Step 10 承接。 |
| 日志、错误、审计如何防泄露？ | 采用 allow-list + default deny；只允许有限 module/slot/category/posture/safe issue ref。禁止 raw config、secret、credential、selector、scope、owner/ref、location、digest/key、provider response、body、stack、SQL/HTTP 内容和 free-text reason。redaction 在序列化前执行，失败丢弃信号或输出无关联 suppression 计数。 |
| 每个敏感配置是否回指 Step 7、Step 5、Step 9、Step 10？ | 是。下表按 Step 7 配置域归组，来源统一承接 `DECL < JSON < ENV`；读取由 Step 9 的 `infra/config.rs`/builder 边界承接；变更和轮换由 Step 10 承接。 |

## 3. 当前材料问题诊断与取舍

| 发现 | 风险 | 本步裁定 |
|---|---|---|
| 旧 README/旧 05/06 提到具体存储、凭据或产品 | 会把历史供应商假设写进配置/密钥方案 | 仅作 historical pollution；不复制产品、路径、DSN 或保留期 |
| Step 7 的 `ref-only/restricted/none` 不是规范级别 | 下游可能把 ref 当安全材料或把 none 误解为 public | 本步统一为 `internal`/`sensitive`；真实 secret 不列为普通 key |
| 03 已有 telemetry denylist | 配置项可能通过错误/日志泄露 | 以 03 allow-list/default-deny 作为跨域硬边界，配置只能收紧不能放宽 |
| owner/source/receiver/storage refs 未闭合 | 可能以 endpoint 或 credential 字符串填空 | 只保留 typed opaque ref；未解析或合同缺失→Blocked/Unknown/Unavailable |
| rotation / reload 未定义 | 旧 operation 可能漂移到新 binding | P0 仅新 assembly/job-run-start；不提供 hot reload/LKG |

## 4. 敏感级别和存储规则

| 敏感级别 | 本仓示例 | 普通 JSON/ENV | infra 内部处理 | 日志/错误/report/audit/trace |
|---|---|---|---|---|
| `internal` | `profile.name`、schema/config revision、redaction profile identity、预算 | 允许（仍需 strict schema） | 转 validated typed value/ref | 仅有限 enum/category；不输出 raw document |
| `sensitive` | store/source/owner/receiver/storage/integrity/codec/cursor/sink/binding registry refs | 只允许 opaque ref；不允许 full locator when output risk exists | 解析为 body-free binding identity；必要材料私有调用 | 不输出完整 ref、endpoint、target、scope、selector、key/digest |
| `secret` | password、private key、raw token、credential、certificate/DSN body、provider response | 禁止 | 由未来受控 provider/adapter 私有解析；P0 不定义 provider | 永不输出、序列化、持久化或复制 |
| protected material | source/export/artifact/workspace/observability body、receiver payload | 禁止 | 只接收 owner-approved ref/material seam；不放 config | 不输出正文、body、raw response 或 hidden values |

`secret` 与 `protected material` 不是可配置的成功开关，也不能以 hash/digest 绕过禁止输出；可关联的 ref/hash 仍按敏感数据处理。

## 5. Step 7 敏感配置映射表

| Step 7 配置域 / 配置项 | 敏感级别 | 存储方式 | 是否可明文 | 轮换方式（P0） | 加载/变更审计要求 |
|---|---|---|---|---|---|
| `profile.name` / `schema_revision` / `config_revision` | internal | strict JSON/allow-listed ENV；typed revision | 仅字段值可作为有限 enum/ref；不输出整文件 | new config revision + new assembly | 记录 profile/category/revision posture；不记录 raw file |
| `assembly.*_registry_ref` | sensitive | opaque exact registry ref | 否（不进 log/error） | new ref + new assembly；old work pinned | 记录 slot/surface category 和 redacted issue ref |
| `stores.local_store_binding_ref` / `context_source_binding_ref` / `worker_control_binding_ref` | sensitive | opaque adapter/store ref | 否；不接受 DSN/credential body | new binding + restart/new assembly | 记录 assembly result/slot；不记录 backend response |
| `sources.*.export_binding_ref` | sensitive | per-`SourceClass` opaque ref | 否；不记录 owner/selector/body | new source binding + new job run | 记录 source class/posture；不记录 source identity/fence/body |
| `authority_visibility.authority_binding_ref` / `visibility_binding_ref` | sensitive | opaque exact slot ref | 否 | new assembly；旧 operation 不漂移 | 记录 slot/category/blocked posture；不记录 allow/deny payload |
| `authority_visibility.redaction_profile_ref` | internal/sensitive | validated redaction identity | 不可用 raw denylist value 输出 | new assembly；不允许 unsafe relax | 记录 policy revision/validation result；禁止 matched value |
| `integrity_compatibility.*_binding_ref` / `target_registry_ref` | sensitive | capability/target ref only | 否；不携 algorithm/key/digest | new target binding + job-run-start | 记录 target category/posture；不记录 schema/digest/key |
| `storage_lifecycle.archive_storage_binding_ref` | sensitive | storage target/binding ref | 否；不携 location/credential | new assembly/job run；未决 effect不重构 | 记录 target kind/posture；不记录 location/effect key |
| `storage_lifecycle.governance_decision_binding_ref` / `retention_schedule_ref` / `result_retention_decision_ref` | sensitive | formal decision/schedule ref | 否；不携 policy/hold/delete/risk body | new decision/schedule ref；需 owner formal decision | 记录 decision category/revision posture；不解释决定正文 |
| `restore_receivers.owner_binding_registry_ref` / `receiver_schema_registry_ref` | sensitive | per-owner opaque registry/schema ref | 否；不携 receiver endpoint/payload | new owner mapping + new plan/job revision | 记录 target kind/posture；不输出 owner/receiver identity |
| `inbound.consumer_binding_registry_ref` / `trust_schema_registry_ref` | sensitive | finite family/schema/trust ref | 否；不携 topic/credential/body | new assembly；未知 family quarantine | 记录 family/schema category；不输出 envelope/body/topic |
| `operation_cursor.*codec_ref` / `repository_cursor_mapping_ref` | sensitive | opaque codec/mapping ref | 否；不记录 private cursor/key | new assembly; old operation/cursor remains pinned | 记录 operation/query posture；不记录 key/digest/cursor |
| `observability.runtime_sink_binding_ref` / `audit_material_handoff_ref` | sensitive | safe sink/material ref | 否；不携 endpoint/secret/body | new assembly; sink failure only degraded/drop | 记录 safe sink posture；不创建 backend/evidence truth |
| `budgets.*` | internal | typed positive value in strict JSON/ENV | 可作为 bounded category；不输出 request/body | startup or job-run-start new budget | 记录 budget class/validation result；不记录 payload/body |

## 6. Profile 级敏感配置处理

| Profile | 允许的敏感 ref | secret material | 轮换/生效 | 禁止 |
|---|---|---|---|---|
| `local-dev` | test-only binding/fake ref | 不允许真实 secret | new local assembly | raw secret、生产 endpoint、真实 body |
| `ci-test` | deterministic fixture/adapter ref | 不允许真实 secret | per-run isolated test assembly | 把 fixture 当生产证据 |
| `integration-like` | controlled endpoint/credential/target ref | provider 尚未闭合；不写材料 | new assembly/job-run-start | raw credential/endpoint/body |
| `operations-replay` | pinned replay/state/report ref | 只用脱敏材料 ref | new replay run；旧 binding 不漂移 | 用当前配置重建旧 operation、使用 raw history |
| `staging-like` | future approved secret-provider ref | 只在私有 adapter 读取 | new assembly/restart | 普通 JSON/ENV raw secret、fake fallback |
| `production-like` | future approved secret-provider ref | 只在受控私有边界 | new assembly/restart 或正式 rotation procedure（未来） | 未审计 override、raw secret、production fake |

## 7. 读取、轮换、审计和禁止输出流程

#### 敏感配置读取图: L4-archive opaque ref 与私有材料边界

```text
[strict JSON / allow-listed ENV]
          |
          v
[opaque ref + profile + config identity]
          |
          v
[infra/config.rs: parse + sensitivity check + redacted issue]
          |
          v
[runtime_builder: validated binding identity]
          |
          +--> [exact adapter private resolution]
          |          |
          |          +--> [private secret/material use]
          |          |          |
          |          |          +--> [typed outcome only]
          |          |
          |          +--> [no body/secret/ref leakage]
          v
[application/api/worker: typed facade only]
```

关键说明：

- 图只表达 opaque ref、验证、私有解析和 typed outcome，不表达 provider 产品、部署挂载或网络拓扑。
- private resolution 失败不得以空字符串、默认 provider、fake-success 或 raw error fallback 继续；required capability 变为 `Blocked/Unavailable`。
- 旧 operation/effect/plan 使用 pinned config/binding identity；新 ref 不重写旧 intent 或历史。

## 8. 禁止输出规则

| 输出位置 | 允许 | 默认禁止 | 失败处理 |
|---|---|---|---|
| config validation issue | module/field class、slot family、profile、safe issue ref | raw file、raw value、secret、full ref、endpoint/body | 丢弃敏感 detail，返回 redacted typed issue |
| runtime log | finite category/posture、phase、safe issue ref（必要时） | credential、secret、owner/selector/scope、location、digest/key、body | redaction fail→drop/suppression counter |
| metric label | fixed enum：profile class、slot family、error/posture | 任意 ID/ref/key/digest/owner/free text | label validation reject |
| span | operation/channel/phase、typed outcome、trusted trace context | secret/ref/body/endpoint/provider response | omit unsafe attribute；不改变业务结果 |
| Archive durable record | existing body-free refs required by domain history | raw secret、provider response、unapproved body、new generic audit ledger | UoW 失败；不以 telemetry 替代 durable truth |
| report/receipt/API error | safe disposition/error category/issue ref | raw config、secret、endpoint、stack/SQL/HTTP body | map to typed safe error; preserve blocked/unknown distinction |

## 9. 敏感配置停审记录

| 配置组 | 存储方式 | 明文禁止 | 轮换 | 审计 | 结论 |
|---|---|---|---|---|---|
| profile/assembly | typed identity/ref | 通过 | new assembly | safe revision/category | 通过 |
| stores/source/authority/receiver/storage refs | opaque sensitive ref | 通过 | new assembly/job run | slot/source/target posture only | 通过；external contracts remain blocked |
| codec/cursor/telemetry refs | opaque sensitive ref | 通过 | new assembly | no key/cursor/body | 通过；local pending preserved |
| budgets/redaction | typed internal value/ref | 通过 | startup/job-run-start | validation/category only | 通过 |
| real secret/material | 不进入普通 config | 强制禁止 | provider/owner future procedure | no material output | 通过；provider remains pending |

## 10. 跨敏感配置泄露风险审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| raw password/private key/token/DSN/certificate 是否进入正文或 demo | 否 | 只使用 opaque placeholders/refs |
| sensitive ref 是否可能被完整写入日志/error/report/metric/trace | 否 | default deny；只允许 category/safe issue ref |
| secret resolver 是否参与普通来源覆盖 | 否 | 只解析 winner locator，不改变 winner 或 authority |
| local/CI fake 是否可能进入 production-like | 否 | profile isolation + builder rejection |
| ref/hash 是否被用于绕过正文禁止 | 否 | 可关联 ref/hash 仍按 sensitive 处理 |
| rotation 是否通过 hot reload 漂移旧 operation | 否 | P0 new assembly/job-run-start；old work pinned |
| observability 是否成为 secret/body dump | 否 | 继承 03 allow-list/default-deny 与 sink failure 边界 |
| external material 是否被 Archive 保存为 truth | 否 | 仅 owner-approved material/ref；`AR-UP-006/007/008` 持续开放 |

## 11. 对 `03-详细设计.md` 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 普通配置只保存 opaque ref；真实 secret 只在 infra/adapter 私有边界 | 否 | 既有 config/adapter/redaction 边界承接 | 不适用 | 无回写 |
| P0 敏感 ref 变更通过 new assembly/job-run-start，不开放 hot reload/LKG | 否 | 既有生效边界承接 | 不适用 | 无回写 |
| log/error/report/metric/trace default-deny raw secret/body/ref | 否 | 承接 03 §14/Step 15 | 不适用 | 无回写 |
| 未来若引入 secret provider API、rotation callback、hot reload 或新的 error/port/DTO/flow | 是（未来触发） | runtime/adapter/security contract | 03 §4～§15 与对应 calibration Step | 无回写（触发前暂停） |

## 12. 回填草稿与进入下一步条件

正式 §8 应回填敏感级别表、Step 7 配置映射、profile 处理、读取图、禁止输出规则和跨敏感配置审计；不得写真实密钥、provider、endpoint、DSN、算法、证书或轮换命令。

| 条件 | 状态 |
|---|---|
| 每个敏感配置已回指 Step 7 与 Step 5 | 通过 |
| 明文 secret/body 禁止且 profile 差异可判定 | 通过 |
| 读取、轮换、审计和禁止输出可承接 Step 9/10 | 通过 |
| 03 当前无待回写项 | 通过；future provider/hot reload 为触发器 |
| 跨敏感配置泄露审计无 unresolved 冲突 | 通过 |
| 可进入 Step 9 | 通过 |
