# L2-runtime 04 配置设计 Step 5：来源、优先级与冲突处理

> 创建日期：2026-08-17
> 状态：`done`
> 当前模块：`sources / precedence / conflict`
> 回填位置：正式 `04-配置设计.md` 第 5 章

## 1. Step 开工确认

| 检查 | 结论 |
|---|---|
| 当前恢复点 | Step 5；Step 1~4 已通过 |
| 输入 | one-document P0、12 domains、startup-only、static-derived/forbidden rules |
| 本步输出 | source classes、precedence、selector、conflict、12-domain source matrix |
| 禁止 | 不定义部署路径/CLI syntax；不开放 arbitrary leaf env override |

## 2. SOP 问题回答

### 2.1 来源和优先级是什么

P0 的配置内容只有一份 selected strict JSON。外部 source selector 先选择该 document，entry-profile assertion 再与 document 内值比对；二者都不是 leaf override。static-derived values 在 typed assembly 阶段补齐，但任何同义外部 key 都被拒绝，因而也不存在“static 被高优先级覆盖”。

```text
[entry-supplied source selector]
              |
              v
 [one strict JSON document] ----> [document entry_profile]
              |                              ^
              |                              |
              +---- [optional entry assertion; equality only]
              |
              v
 [strict parse + exact validation]
              |
              v
 [add static-derived typed values]
              |
              v
 [one RuntimeConfigSnapshot]
```

### 2.2 同名配置多处出现如何处理

- 同一 JSON object duplicate key：解析失败，禁止 last-key-wins。
- 多个 content document：P0 不支持 merge；entry 必须只选择一个 source。
- assertion 与 document 值不一致：`CrossFieldConflict`，拒绝启动。
- static-derived 同义 external key：`ForbiddenKey`，不得比较/覆盖。
- request/job input 与 snapshot limit：不是同名配置；只能收窄，超界拒绝 operation。

### 2.3 必填项缺失是否阻断启动

153 个 exposed leaf 全部 required，任何一个 leaf 缺失都阻断 candidate assembly 和 startup publication。nullable 字段必须显式写为 JSON `null`；delegation disabled 时的 bound 字段必须显式写为 `0`；slot/job 即使为 `Disabled` 或 `Blocked` 也必须保留各自完整的 exact shape。assembler 不得因条件为 false、negative posture 或旧文档惯例而补字段、补默认值或把 omission 转换为 `None`。

### 2.4 配置中心或密钥系统不可用如何处理

P0 不消费 config center/KMS/Vault，也不含 credential field。若 selected JSON source 不可读，返回 `SourceUnavailable` 并 fail-fast；不得从另一文件、环境变量或历史 snapshot 静默恢复。具体部署 rollback 可恢复上一份 reviewed document 后重启，但不属于单次 loader fallback。

### 2.5 哪些来源不能覆盖敏感配置

Runtime config 不接受 raw secret、credential ref、provider endpoint/route、DSN、token、cert 或 key。opaque contract/schema/redaction/blocker refs 只能来自 selected JSON，并接受 owner/type/shape/redaction 校验；selector、assertion、fixture 或 operation input 均不能覆盖这些 refs。

## 3. 来源类别

| ID | 来源 | 作用 | 内容能力 | 优先级/关系 | 不可用/冲突 |
|---|---|---|---|---|---|
| SRC-01 | entry-supplied config source selector | 选择一个 config document | locator identity only；值不得进入 snapshot/log | selection before load | missing/ambiguous -> SourceUnavailable |
| SRC-02 | selected strict JSON | 唯一外部配置内容 | CFG-01~12 exposed leaves | sole content authority | unreadable/malformed -> fail-fast |
| SRC-03 | optional entry-profile assertion | 防止错误进程加载错误 profile | one `api/worker/jobs/test_fake` value | equality check only | mismatch -> CrossFieldConflict |
| SRC-04 | static-derived design values | 构造 fixed policy/slot/job identity/retry | Step 4 §5 exact mapping | not overrideable | external alias -> ForbiddenKey |
| SRC-05 | isolated TestFake fixture source | 向 TestFake composition 提供 strict JSON + finite fake realization | test-only source/body-free fake refs | replaces SRC-01/02 only in CI TestFake | any other profile/env -> FakeBindingForbidden |
| SRC-06 | command/query/event/job input | 当前 operation 请求与收窄参数 | typed protocol field only | not a config source | expansion/conflict -> operation reject |

## 4. 稳定 selector 名称与边界

配置设计只固定逻辑 selector identity，实际 CLI flag、文件发现路径和进程注入方式由 09 绑定。

| selector identity | 建议 env binding | 类型 | 作用 | 禁止输出 |
|---|---|---|---|---|
| `runtime_config_source` | `QUANTALITHOS_RUNTIME_CONFIG_SOURCE` | opaque locator string | 选择一个 document | locator raw value/path；只记录 redacted source fingerprint |
| `runtime_entry_profile_assertion` | `QUANTALITHOS_RUNTIME_ENTRY_PROFILE` | closed enum | 必须等于 `profile.entry_profile` | 无特殊秘密；审计仅记录 enum |

未知 `QUANTALITHOS_RUNTIME__*` leaf override、旧 alias env、object/list JSON env 和 arbitrary admin override 均返回 `UnknownEnvironmentVariable`。环境变量名称映射不是配置内容 API；部署可选择其他载体，但必须映射到上述两个逻辑 selector 并保留相同冲突语义。

## 5. 来源优先级和冲突规则

| 场景 | 处理 | 是否阻断 |
|---|---|---:|
| zero source selected | no default discovery contract in 04 | 是 |
| more than one source selected | no merge/precedence guessing | 是 |
| duplicate JSON key | reject entire document | 是 |
| unknown root/leaf/slot/job | reject entire document | 是 |
| JSON type/enum/ref mismatch | reject before typed snapshot | 是 |
| assertion absent | trust validated document entry profile | 否 |
| assertion matches document | continue | 否 |
| assertion differs | reject; do not rewrite document | 是 |
| static-derived key appears | `ForbiddenKey` | 是 |
| raw secret/provider key/value shape appears | `SecretMaterialDetected` or `ForbiddenKey` | 是 |
| TestFake fixture outside `ci_contract + test_fake` | `FakeBindingForbidden` | 是 |
| operation limit <= snapshot upper bound | use narrowed operation value | 否 |
| operation limit > snapshot upper bound | reject operation; snapshot unchanged | 当前 operation |
| external slot Blocked | valid negative config; affected path remains Blocked | 否，除非 entry requires positive path |
| external slot Candidate without exact ref/schema | cross-field invalid | 是 |
| new reviewed document invalid during replacement | do not start replacement process | 新启动阻断；旧进程不变 |

## 6. 十二配置域来源矩阵

| 域 | selected JSON | static-derived | assertion/fixture | 禁止来源 | 缺失策略 |
|---|---|---|---|---|---|
| CFG-01 profile | schema/entry/environment | none | entry assertion；CI fixture | leaf env/admin | required missing fail-fast |
| CFG-02 scope | allowed authorities | child/read rules | fixture same schema | request expansion/env | required missing fail-fast |
| CFG-03 context | exposed bounds/policy/freshness | ordering | fixture same schema；operation narrow | raw body/env override | required missing fail-fast |
| CFG-04 working_memory | bounds/stale policy | none | fixture same schema | durable owner/env | required missing fail-fast |
| CFG-05 model_decision | purposes/bounds/nullable schema ref/context policy | none | finite model fake realization external to snapshot | provider settings/env | any missing leaf fail-fast；explicit `null` keeps positive model path blocked |
| CFG-06 action_guard | allowed effect classes/freshness | guards/isolation/unknown | negative fake views | local allow/env | required missing fail-fast |
| CFG-07 delegation | enabled and five always-present bound leaves | none | finite child fake external | request expansion/env | any missing leaf fail-fast；disabled requires all five bounds explicitly `0` |
| CFG-08 checkpoint_recovery | allowed modes | stable/unknown | finite receipt fake external | fence/commit override | required missing fail-fast |
| CFG-09 handoff_projection | page/freshness/redaction ref | eligibility | finite ack fake external | delivery/observed/env | required missing fail-fast |
| CFG-10 idempotency | retentions/digest schema | uniqueness survives cleanup | deterministic stores external | request/env cleanup override | all required |
| CFG-11 adapter_slots | 13 exact objects | slot key identity | fake realization external；TestFake only | endpoint/secret/alias/env | exact set required |
| CFG-12 jobs | 7 exact objects | operation/retry by key | deterministic job fake external | scheduler/cadence/retry env | exact set required |

## 7. Source identity、fingerprint 与禁止输出

| 值 | 可进入 snapshot | 可进入 log/audit | 规则 |
|---|---:|---:|---|
| config schema version | 是 | 是 | public enum/value |
| source fingerprint | validation summary only | 是 | digest of canonical redacted source identity + validated content; no raw locator |
| raw file path/URI/locator | 否 | 否 | deployment-local sensitive material |
| raw JSON/document bytes | 否 | 否 | parser-local only |
| assertion enum | loader context only | 是 | body-free |
| opaque contract/schema/redaction/blocker ref | typed snapshot | redacted digest/category only | no full ref in broad log |
| raw env value | 否 | 否 | never log |

## 8. 停审与跨来源审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 每域有唯一 content source | pass | selected strict JSON only |
| precedence determinism | pass | no leaf merge; assertion equality only |
| duplicate/unknown behavior | pass | reject whole candidate |
| secret override risk | pass | zero raw secret fields and zero leaf env override |
| TestFake isolation | pass | fixture only CI/TestFake |
| operation vs config | pass | request may narrow, never override/expand |
| unavailable fallback | pass | startup fail-fast; no hidden fallback |
| no deployment detail | pass | only logical selectors fixed |

## 9. 当前问题诊断、改动前后与取舍

historical Step 5 采用 `defaults < file < allow-listed leaf env`，使同一 typed snapshot 可能来自大量分散值且留下默认数字污染。当前选择 one-document/no-leaf-override：代价是环境差异需要完整 reviewed document，但换来 source attribution、schema validation、fingerprint、review 和 rollback 的确定性。

## 10. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---:|---|---|---|
| one selected source + assertion equality | 否 | loader/source semantics | 04 专属 | 无回写 |
| no leaf env merge | 否 | source restriction | 04 专属 | 无回写 |
| static-derived values supplement typed snapshot | 否 | existing typed field construction | 03 §13 | 无回写 |
| source fingerprint body-free | 否 | existing validation field semantics | 03 §13.1 | 无回写 |

## 11. 回填草稿与下一门禁

正式 §5 写入 source chain、SRC-01~06、两个逻辑 selector、conflict table、12-domain matrix 和 safe source identity。不得写实际 path、CLI command、leaf env 名或 fallback discovery。

```text
step_05 = done
gate_status = pass
gate_reason = single_content_source_and_conflict_semantics_closed
next_allowed_action = delete_and_rebuild_step_06_profiles_matrix
formal_04_write_allowed = false
commit_required = false
```
