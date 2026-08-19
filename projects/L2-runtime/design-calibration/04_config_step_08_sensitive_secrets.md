# L2-runtime 04 配置设计 Step 8：敏感配置与密钥边界

> 创建日期：2026-08-17
> 状态：`done`
> 当前模块：`sensitive_refs / raw_secret_boundary`
> 回填位置：正式 `04-配置设计.md` 第 8 章

## 1. Step 开工确认与 SOP 回答

| 问题 | 结论 |
|---|---|
| 哪些是 sensitive/secret | typed contract/capability/redaction/blocker refs 与 source locator 是 sensitive；Runtime schema 中 secret leaf 数为 0 |
| 如何存储 | sensitive typed refs 可存 snapshot；source locator/raw document/raw env 不存；raw secret 不允许进入 Runtime |
| 是否允许明文 | ordinary JSON 中允许 typed opaque ref string；不允许 raw credential/secret/provider route；日志审计不允许完整 sensitive ref |
| 如何轮换 | Runtime P0 startup-only；owner/deployment 更新外部 binding/document，重新验证并重启；不做 in-process secret rotation |
| 是否审计 | 记录 safe fingerprint/category/version/change disposition；不记录 raw value/path/body |
| 如何避免泄漏 | parser/config error、log、metric、event、report、handoff、test fixture 全部使用 typed category/fingerprint/safe reason |

## 2. 敏感级别

| Level | Runtime meaning | 可以出现的位置 | 禁止位置 |
|---|---|---|---|
| `public` | schema/profile version、closed enum name、field path | JSON/snapshot/log/audit/error | 无额外限制，但仍不得冒充 readiness |
| `internal` | count/weight/duration/activation/requirement/environment class | JSON/snapshot；redacted audit summary | public error/body-free external material unless needed and allowed |
| `sensitive` | typed owner/contract/schema/redaction/blocker/capability ref、source locator identity | selected JSON or loader context；typed snapshot only for declared fields | broad log/error/metric/event/report/handoff full value |
| `secret` | password/private key/raw token/cert material/DSN/authorization header/provider credential | nowhere in Runtime JSON/snapshot/documentation example | all Runtime surfaces |

`sensitive` 不等于 credential。Runtime 接受的 ref 必须是 body-free identity，不得把 secret value 编码进 ref string/query/fragment/display text。

## 3. Step 7 反向索引

| 配置项/输入 | Level | Snapshot | Log/audit representation | 失败 |
|---|---|---:|---|---|
| `model_decision.logical_selection.allowed_capability_class_refs[]` | sensitive | typed refs | count + canonical fingerprints only | malformed/unsafe owner -> fail-fast |
| `model_decision.semantic_schema_ref` | sensitive | optional typed ref | present flag + fingerprint + schema category | malformed/Candidate missing -> fail-fast |
| `handoff_projection.redaction_policy_ref` | sensitive | typed ref | fingerprint + version category | malformed/incompatible -> fail-fast/block |
| `adapter_slots.*.contract_ref` | sensitive | optional typed ref | slot + present + fingerprint | malformed/tuple/owner mismatch -> fail-fast |
| `adapter_slots.*.blocker_ref` | sensitive | optional typed ref | slot + blocker ID/category if allow-listed | malformed/body text -> fail-fast |
| `jobs.*.blocker_ref` | sensitive | optional typed ref | job + blocker ID/category if allow-listed | malformed/tuple conflict -> fail-fast |
| `runtime_config_source` selector value | sensitive | no | redacted source fingerprint only | missing/ambiguous/unreadable -> fail-fast |
| raw selected document bytes | sensitive operational input | no after assembly | never | parser-local only; error category only |
| entry profile assertion | internal | no | enum allowed | conflict -> fail-fast |
| all numeric/enums/versions | public/internal | yes | safe field path + old/new digest, not necessarily raw old/new values | type/range/conflict |

There is no `credential_ref`, `secret_ref`, `provider_endpoint`, `route`, `dsn`, `token`, `cert`, `key` or generic extension leaf in the 153-leaf schema。

## 4. 敏感配置读取图：ref-only snapshot 与外部 adapter authority

```text
[selected strict JSON]
        |
        | typed opaque refs only
        v
[parse + ref-shape/owner-kind validation]
        |
        v
[RuntimeConfigSnapshot]
        |
        | contract/schema/redaction identity
        v
[RuntimeBuilder / adapter compatibility]
        |
        +------------------------------+
                                       |
                      [owning adapter/deployment security]
                                       |
                      credential/endpoint/route resolution
                                       |
                                  external owner

raw secret/credential ---------------- X RuntimeConfigSnapshot
```

关键说明：

- Runtime snapshot contains only the upper-left typed identities; the lower-right credential/route resolution is outside Runtime ownership。
- Config validation may check ref syntax/kind/version consistency but cannot resolve a secret or prove the owner is available。
- No fallback copies credential material from env/file into Runtime when adapter resolution fails。
- This is a design boundary, not a claim that an external secret system or adapter implementation exists。

## 5. Storage and source protection

| Material | Ordinary JSON | Snapshot | Process memory | Persistent log/audit | Rule |
|---|---:|---:|---:|---:|---|
| public/internal leaf | yes | yes | typed value | safe summary/digest | normal validation |
| sensitive typed ref | yes | yes | typed ref | fingerprint/category only | no display/raw serialization in generic output |
| source locator | selector only | no | loader-local transient | fingerprint only | zeroize/lifetime implementation-specific; no design claim |
| raw JSON bytes | selected source | no | parser-local transient | never | reject body echo |
| raw secret/credential | no | no | no Runtime-owned buffer | never | `SecretMaterialDetected`/ForbiddenKey |
| external adapter resolved credential | no | no | owned by adapter/security boundary | no Runtime log | not specified/owned here |

04 does not select filesystem permission, encryption, KMS/Vault, zeroization crate, cache TTL, process isolation or memory-lock product. Those require implementation/security/deployment decisions; absence keeps positive qualification blocked rather than permitting raw fallback。

## 6. Detection and rejection rules

| Detection class | Examples | Result | Safe diagnostic |
|---|---|---|---|
| forbidden key | `password`,`token`,`secret`,`private_key`,`credential`,`dsn`,`endpoint`,`route`,`quota`,`cost` or nested variants | reject whole document | `ForbiddenKey { path_category }` without value |
| secret-shaped value in ref field | multiline key/cert/JWT/bearer/URI userinfo/query secret | reject whole document | `SecretMaterialDetected { field_path }` |
| ref embeds raw path/endpoint/route | unapproved scheme/authority/query/fragment | reject | typed ref parse category |
| error echoes source/document/value | parser/validator implementation violation | fail closed; suppress unsafe message | stable error code + correlation only |
| fixture contains production-like secret | CI TestFake violation | test/config fail-fast | fixture ID fingerprint only |
| unknown extension object | vendor/provider map | unknown key reject | path only |

Detection heuristics cannot be the only defense; the primary defense is closed schema + typed-ref parser + no generic map/string sink。

## 7. Rotation, revocation and expiry protocol

Runtime P0 has no online secret or ref rotation API. A change follows this external/startup sequence：

```text
owner/deployment changes formal ref or adapter binding
  -> prepare new strict JSON document if Runtime ref changes
  -> strict parse/type/cross-field/security validation
  -> compare redacted fingerprints and required review scope
  -> start replacement process with new immutable snapshot
  -> stop/retire prior process under deployment procedure
```

| Change | Runtime document action | Runtime behavior before replacement | Failure posture |
|---|---|---|---|
| contract/schema/redaction ref version changes | reviewed document replacement | existing process keeps captured snapshot; no mutation | invalid new document does not start |
| blocker closes | may replace Blocked with Candidate only after formal contract/schema and qualification inputs | old process remains Blocked | missing proof -> candidate rejected |
| blocker appears/reopens | replace Candidate with Blocked before/at controlled restart; owning adapter must also fail closed immediately | any actual adapter unavailability stays negative independent of config | no last-known-positive readiness |
| external credential rotates without Runtime ref change | no Runtime document change | adapter/security owner handles; Runtime receives finite unavailable/unknown as needed | no raw fallback |
| sensitive ref revoked/expired | new operation fails/blocks through adapter/validator | captured ref remains identity, not authority to use revoked secret | Blocked/Unavailable/Unknown |

No step claims actual rotation completed; this is planned behavior only。

## 8. Audit and output allow-list

| Output surface | Allowed | Forbidden |
|---|---|---|
| config validation issue | stable issue code、field path、type category、safe reason | raw value/document/source locator/full sensitive ref |
| startup log | schema/profile/environment、snapshot ref、source fingerprint、issue count、build disposition | raw JSON/path/env/ref/credential/readiness |
| config change audit | change ref、actor category、old/new snapshot refs/digests、changed paths、review refs、disposition | old/new raw values、secret/backend path |
| metric | issue class/count、profile、slot/job category、disposition | ref/path/value/high-cardinality identity |
| runtime event/outbox | snapshot ref/schema and body-free policy versions where contract allows | config body/sensitive ref/secret |
| job/report | snapshot ref、safe reason、blocked slot/job ID | config raw values、evidence alias/readiness |
| test failure | fixture ID、expected/actual safe error code | secret-like fixture content/full document dump |

## 9. Per-sensitive-item stop review

| Item group | Storage defined | Plaintext boundary | Rotation/revocation | Audit/output | Result |
|---|---|---|---|---|---|
| capability/schema/contract refs | yes | typed ref only | restart replacement | fingerprint only | pass |
| redaction policy ref | yes | typed ref only | restart replacement | fingerprint/version | pass |
| blocker refs | yes | allow-listed ID/ref | document replacement | safe ID/category | pass |
| source locator/document bytes | loader-local only | no persistence/output | deployment replacement | fingerprint only | pass |
| raw secret/credential/provider route | absent | forbidden | owning boundary | never | pass |
| TestFake refs | isolated CI only | synthetic non-secret | fixture replacement | fixture fingerprint | pass |

## 10. Cross-sensitive audit

| Audit | Result | Notes |
|---|---|---|
| raw secret in schema/demo | pass | zero leaf; none in JSON blocks |
| generic string/map sink | pass | closed typed refs only |
| source/env leakage | pass | fingerprint/category only |
| log/error/report body leakage | pass | explicit allow-list |
| rotation without reload contract | pass | startup replacement only |
| adapter owner creep | pass | credential/route resolution external |
| fake secret contamination | pass | synthetic non-secret only |
| readiness fabrication | pass | ref/rotation/candidate never readiness |

## 11. 当前问题诊断、改动前后与 03 影响

Historical Step 8 暗示 Runtime config 未来可能承载 generic `credential_ref`。当前设计不建立该字段：13 slot only hold contract/schema/blocker refs; resolved credential remains adapter/deployment-owned。这样避免把“opaque ref”泛化为 secret carrier。

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---:|---|---|---|
| sensitive refs store typed identity only | 否 | output/storage semantics | 03 §13 fields already typed | 无回写 |
| raw secret/provider route zero-field | 否 | existing owner boundary | 03 §1/6/13 | 无回写 |
| startup replacement, no online rotation | 否 | lifecycle restriction | future reopen only | 无回写 |
| error/log use fingerprint/category | 否 | observation/redaction detail | existing body-free rule | 无回写 |

## 12. 回填草稿与下一门禁

正式 §8 写入 sensitivity levels、Step 7 reverse index、ref-only ASCII 图、storage/source matrix、detection table、restart rotation protocol 和 output allow-list。不得选择 secret backend、写 credential field、打印完整 ref 或宣称 rotation/readiness。

```text
step_08 = done
gate_status = pass
gate_reason = zero_secret_carrier_and_sensitive_ref_lifecycle_closed
next_allowed_action = delete_and_rebuild_step_09_loading_validation_activation
formal_04_write_allowed = false
commit_required = false
```
