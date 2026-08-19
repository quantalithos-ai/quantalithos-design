# L2-runtime 04 配置设计 Step 7：配置项、Typed Mapping 与 JSON 总索引

> 创建日期：2026-08-17
> 状态：`done`
> 当前模块：`field_inventory / typed_mapping / strict_json`
> 回填位置：正式 `04-配置设计.md` 第 7 章

## 1. Step 开工确认

| 检查 | 结论 |
|---|---|
| 当前恢复点 | Step 7；Step 1~6 已通过 |
| 当前输入 | 12 exact domains、one-document source、no-leaf-env、4x4 profile gate、03 typed carriers |
| 重启纪律 | 旧 Step 7 主文件及四个旧 annex 已删除；不继承旧 alias/default/limits |
| 写入顺序 | main index -> core policies -> safety policies -> slots/jobs -> module demos -> complete demo -> cross audit |
| 禁止 | 不进入 Step 8；不写正式 04；不把示例值写成默认/容量/性能事实 |

## 2. 外部格式与命名

- Runtime input 只接受 UTF-8 strict JSON；不接受 JSONC/YAML/TOML/HCL/CUE。
- 顶层必须且只能包含 12 个 snake_case key：`profile`、`scope`、`context`、`working_memory`、`model_decision`、`action_guard`、`delegation`、`checkpoint_recovery`、`handoff_projection`、`idempotency`、`adapter_slots`、`jobs`。
- 每个 object 是 closed object；unknown、duplicate、case variant、alias、extra/missing key 均拒绝。
- nullable field 必须显式写 `null`，不得靠 omission 表达；所有 exposed leaf 均无 code content default。
- enum literal 使用本文 exact snake_case；parser 不做大小写、连字符、缩写或旧名兼容。
- slot/job identity 由 exact object key 派生；object 内不得重复 `slot` 或 `operation`。
- project-local key 不加 `l2_runtime` 前缀。系统聚合映射若未来需要，必须在 09/聚合 owner 单独设计。

## 3. 默认值与示例值规则

| 概念 | 本文规则 |
|---|---|
| external leaf default | `none (required)`；conditional nullable 也必须显式写值或 `null` |
| static-derived field | 不在 JSON；assembler 按 Step 4 exact rule 构造 |
| module demo number | parser/shape example only；不是默认、容量、性能、SLA、production threshold |
| module demo ref | `example-only` placeholder；不是 formal owner ref、credential、evidence 或 qualification |
| Blocked example | 可使用正式 blocker ID；只说明负向姿态，不证明实现存在 |
| Candidate example | 只用于 schema/cross-field 测试；不等于 `Ready` 或 operational |

## 4. Root 到 Typed Carrier 的唯一映射

| JSON root | parse/assembly target | static-derived companion | 03 owner |
|---|---|---|---|
| `profile` | schema + `RuntimeProfile.kind` + validator environment context | none | `RuntimeConfigSnapshot`/`RuntimeProfileKind` |
| `scope` | `RuntimeProfile.scope` + version | child/read rule | `RuntimeScopeProfile` |
| `context` | `RuntimeProfile.context` + version | ordering | `ContextCompositionProfile` |
| `working_memory` | `RuntimeProfile.working_memory` + version | none | `WorkingMemoryProfile` |
| `model_decision` | `RuntimeProfile.model_decision` + version | none | `ModelDecisionProfile` |
| `action_guard` | `RuntimeProfile.action_guard` + version | five guards/isolation/unknown/freshness unknown | `ActionGuardProfile` |
| `delegation` | `RuntimeProfile.delegation` + version | none | `DelegationProfile` |
| `checkpoint_recovery` | `RuntimeProfile.checkpoint_recovery` + version | stable source/unknown posture | `CheckpointRecoveryProfile` |
| `handoff_projection` | `RuntimeProfile.handoff_projection` + version | eligibility/freshness unknown | `HandoffProjectionProfile` |
| `idempotency` | `RuntimeProfile.idempotency` + version | cleanup cannot erase uniqueness | `IdempotencyProfile` |
| `adapter_slots` | exact `AdapterSlotConfigSet` | slot enum from key | `AdapterSlotConfigSet` |
| `jobs` | exact `JobControlSet` | operation/retry from key | `JobControlSet` |

## 5. 字段 inventory 计数

| Batch | 域 | exposed leaf count | static-derived count | Annex |
|---|---|---:|---:|---|
| A | profile/scope/context/working_memory/model_decision | 24 | 3 | `04_config_step_07_items_core_policies.md` |
| B | action_guard/delegation/checkpoint_recovery/handoff_projection/idempotency | 22 | 9 | `04_config_step_07_items_safety_policies.md` |
| C | 13 adapter slots | 65 | 13 slot identities | `04_config_step_07_items_slots_jobs.md` |
| D | 7 jobs | 42 | 14 operation/retry values | `04_config_step_07_items_slots_jobs.md` |
| Total | 12 roots | 153 | 39 | closed inventory |

`leaf count` 以每个 exact slot/job object 的重复字段分别计数；它是 schema coverage 计数，不是功能规模、实现量或测试结果。

## 6. Annex 与写入门禁

| Annex | 内容 | 当前状态 | 下一动作 |
|---|---|---|---|
| core policies | CFG-01~05 逐字段 | `done` | closed |
| safety policies | CFG-06~10 逐字段 | `done` | closed |
| slots/jobs | CFG-11~12 exact entries | `done` | closed |
| policy demos A | CFG-01~05 strict JSON + item explanations | `done` | closed |
| policy demos B | CFG-06~10 strict JSON + item explanations | `done` | closed |
| slot/job demos | CFG-11~12 strict JSON + item explanations | `done` | closed |
| complete demo | one complete strict JSON example | `done` | closed |

## 7. Type mapping rules

| JSON kind | Rust-facing mapping | 拒绝条件 |
|---|---|---|
| enum string | exact finite enum variant | unknown/case/alias/empty |
| typed ref string | typed ref parser + owner/kind/version checks at validation | raw path/URI/credential/unknown owner kind/malformed |
| blocker ref string | `BlockerRef` | unknown shape/empty/body text |
| schema string | `SchemaVersion` | unsupported/empty/mismatch |
| nonnegative integer | corresponding count/depth/duration wrapper | negative/fraction/overflow |
| positive integer | corresponding count/weight/page/lease wrapper | zero/negative/fraction/overflow |
| unique enum/ref array | `Vec<T>`/`NonEmptyVec<T>` according to field rule | duplicate/unknown/invalid empty/order instability |
| nullable scalar/ref | `Option<T>` | omission or wrong type |

Arrays preserve JSON order only where semantic order is declared. Set-like arrays are canonicalized by enum/ref canonical order before source fingerprint calculation; duplicate elements reject rather than deduplicate silently.

## 8. Global cross-field gates

| Gate | Must hold | Failure |
|---|---|---|
| X-01 | `profile.environment_class` x `entry_profile` is allowed by Step 6 | CrossFieldConflict |
| X-02 | `scope.allowed_entry_authorities` nonempty subset of profile default and includes required internal authority | CrossFieldConflict |
| X-03 | context per-source weight null or <= total; compaction trigger < memory max | CrossFieldConflict |
| X-04 | model Candidate implies complete four-dimensional bounds + semantic schema ref | MissingRequired/CrossFieldConflict |
| X-05 | delegation disabled => all child limits zero; enabled => all positive and ChildRuntime not Disabled | CrossFieldConflict |
| X-06 | recovery resume/restart implies CheckpointCommit Candidate and no unresolved CP blocker | CrossFieldConflict/Blocked posture |
| X-07 | slot requirement/activation/ref/blocker tuple follows exact state table | SlotMismatch/CrossFieldConflict |
| X-08 | Api/Worker all jobs Disabled; Jobs/TestFake follow allowed job matrix | CrossFieldConflict |
| X-09 | job activation/blocker tuple and per-job retry constraints hold | CrossFieldConflict |
| X-10 | no NC-L2R-001~030 key/value/alias or raw secret material appears | ForbiddenKey/SecretMaterialDetected |

## 9. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---:|---|---|---|
| 153 exposed leaves map to existing exact carriers | 否 | serialization mapping | 03 §13 | 无回写 |
| static-derived fields remain in typed snapshot | 否 | assembler rule | 03 §13 fields retained | 无回写 |
| nullable semantic/slot refs map existing `Option` | 否 | external representation | 03 §13 | 无回写 |
| job retry/operation omitted and derived | 否 | forbid external override | 03 §13.4 exact mapping | 无回写 |

## 10. 配置域停审记录

| 域 | Leaf completeness | Typed mapping | Source/sensitivity/failure | Cross-field | 结论 |
|---|---|---|---|---|---|
| CFG-01 profile | 3/3 | exact | closed | environment x entry | pass |
| CFG-02 scope | 2/2 + 2 derived | exact | closed | profile subset | pass |
| CFG-03 context | 7/7 + 1 derived | exact | closed | weight/freshness/omission | pass |
| CFG-04 working_memory | 4/4 | exact | closed | trigger < max | pass |
| CFG-05 model_decision | 8/8 | exact | closed | Candidate four dimensions/ref | pass |
| CFG-06 action_guard | 3/3 + 4 derived | exact | closed | guards/effect/freshness | pass |
| CFG-07 delegation | 7/7 | exact | closed | disabled-zero/enabled-positive/child bound | pass |
| CFG-08 checkpoint_recovery | 2/2 + 2 derived | exact | closed | mode/checkpoint/blocker | pass |
| CFG-09 handoff_projection | 4/4 + 2 derived | exact | closed | page/freshness/redaction/slot | pass |
| CFG-10 idempotency | 6/6 + invariant | exact | closed | retention/digest/window qualification | pass |
| CFG-11 adapter_slots | 65/65 + 13 identities | exact | closed | 13 tuple + policy/profile dependencies | pass |
| CFG-12 jobs | 42/42 + 14 operation/retry | exact | closed | 7 tuple + slot/profile/page/lease | pass |

## 11. 跨配置项闭环审计

| Audit | Result | Notes |
|---|---|---|
| root count | pass | complete document exactly 12 roots |
| slot count/shape | pass | exactly 13; each exactly 5 leaves |
| job count/shape | pass | exactly 7; each exactly 6 leaves |
| strict JSON | pass | 5 core + 5 safety + 2 slot/job snippets and complete document parsed with local `jq` |
| duplicate owner | pass | no limits/secrets/observability/provider shadow roots |
| old alias | pass | no current ToolAction/SandboxHandoff/Handoff alias or old carrier |
| static invariant exposure | pass | fixed guards/scope/recovery/handoff/job retry excluded from JSON |
| source consistency | pass | all content leaves selected JSON only; no leaf env override |
| default provenance | pass | all leaves none(required); example values explicitly non-normative |
| sensitive boundary | pass | typed refs only; no raw secret/provider setting key |
| profile/fake | pass | local Api example negative; jobs Disabled; no fake/readiness |
| blocker truth | pass | blocker refs retain negative posture only |
| 03 impact | pass | every leaf maps existing typed carrier; no pending writeback |

## 12. 当前问题诊断与改动前后

| Dimension | Historical Step 7 | Rebuilt Step 7 |
|---|---|---|
| field ownership | second policy/limits carriers | `RuntimeProfile` + exact slot/job sets only |
| numeric defaults | inherited 25/50/60/300/... as defaults | none(required); numbers example-only |
| slots | ToolAction/SandboxHandoff/Handoff aliases | canonical 13 including materializer/invocation/submission |
| requirement | third `blocked_until_contract` value | Required/Optional + activation/blocker tuple |
| jobs | operation/retry externally selectable | key-derived operation/retry |
| safety | fixed booleans/literals exposed | static-derived and forbidden external keys |
| JSON | compact demos with missing slot leaves | exact closed objects and parse-checked complete fixture |

## 13. 对 03 的影响判定汇总

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---:|---|---|---|
| exact policy/slot/job carriers and value vocab | 是 | pre-Step-7 typed closure | 03 §6.8/§13；Step 6/14 | 已回写 |
| 153 exposed leaves and strict JSON representation | 否 | 04 serialization/source contract | 不适用 | 无回写 |
| 39 derived identities/safety values | 否 | assembly of existing fields | 03 §13 existing fields | 无回写 |
| startup-only publication/no leaf env | 否 | 04 lifecycle/source restriction | 不适用 | 无回写 |

## 14. 回填草稿与 Step 门禁

正式 §7 必须按下列顺序装配：格式/命名/default 规则 -> root/typed mapping -> 153-leaf summary -> CFG-01~10 field tables -> 13-slot table/tuple -> 7-job table/static retry -> 12 module strict JSON -> complete strict JSON -> cross-field gates。可以把逐字段详表回指 annex，但正式正文不能省略外部 leaf inventory、slot/job exact shape 或 complete fixture。

```text
step_07 = done
current_module = cross_item_audit
gate_status = pass
gate_reason = 153_leaf_exact_schema_and_all_json_audits_pass
next_allowed_action = delete_and_rebuild_step_08_sensitive_secrets
future_step_allowed = false
formal_04_write_allowed = false
commit_required = false
```
