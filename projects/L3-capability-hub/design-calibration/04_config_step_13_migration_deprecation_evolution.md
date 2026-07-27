# L3-capability-hub 04 配置设计 Step 13：配置迁移、废弃与演进

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 13
> 回填章节: `projects/L3-capability-hub/04-配置设计.md` §13
> 创建日期: 2026-07-25
> 当前模式: full-restart / continuous execution
> 状态: `04_step_13_completed_continuous_execution`

---

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 13 `定义配置迁移、废弃与演进` |
| 输入基线 | Step 7 schema/item inventory；Steps 5/8/9/10 source/security/activation/change；formal 03 typed compatibility |
| current released config baseline | none；formal 04尚未创建，目标实现仓也尚未建立 |
| current migration item | `0`；不得把README、旧05/06或restart前设计词汇当作legacy key |
| active schema | initial design candidate only：strict `runtime.schemaVersion = 1` |
| formal 04 | not created；only Step 15 may assemble |
| 03 影响 | `无回写`；future schema/type change按触发条件受控回开 |
| 上游 blocker | 0 |

## 2. 本步目标、输出与限制

本 Step 固定当前初始配置基线的演进规则，并防止后续实现、测试或运维人员把严格 schema 弱化为兼容性猜测。必须明确：

1. 当前没有已发布旧配置，因此没有真实迁移、兼容窗口、deprecation warning、使用量或移除记录。
2. 普通 artifact 值变更与配置 schema 变更不是同一件事。
3. 新增、重命名、拆分、合并、类型/单位/默认/必填/来源/profile/variant变化必须回到对应配置 Steps；影响typed root/builder/Port/error/flow时先回 formal 03。
4. strict parser不能隐式接受alias、未知字段、旧env名或“latest” schema；兼容窗口只有在双版本行为被正式设计、实现和验证后才成立。
5. 敏感material演进只迁移opaque ref和provider registration，不复制、记录或回滚raw secret。
6. 未来移除旧配置必须证明artifact、env、binary、rollback、test、acceptance和operations承接均已完成。

本 Step 不发布schema、不增加V2、不定义迁移脚本、release日期、binary兼容表、deployment wave或真实使用量。状态名只用于配置设计演进台账，不是Rust enum、runtime API或已实现warning surface。

## 3. 本步输入

| 输入 | 已确认事实 | 演进约束 |
|---|---|---|
| Step 7 | 18 modules、27 rows、strict unknown/duplicate rejection、schema v1 | 当前schema identity不能被alias或free-form extension绕过 |
| Step 5 | constants < JSON < 21-leaf bounded env；invalid env no fallback | future env rename必须单独定义冲突，不能让old/new互相fallback |
| Step 8 | ref-only、provider-to-constructor、rotation/fix-forward | no raw secret migration or secret-derived arbitrary digest |
| Step 9 | one parse/validation path、startup frozen root | migration output must be a fresh immutable artifact；no in-process conversion |
| Step 10 | complete artifact change、safe audit、eligible rollback | migration and rollback artifacts remain separate reviewed candidates |
| Step 11 | invalid/missing/unsupported fail-fast；no LKG/hot reload | unsupported old schema rejects unless explicit parser support exists |
| Step 12 | exact 05/06/07/09 ownership | future migration cases/gates/tasks/runbook belong downstream |
| formal 03 §13 | `CapabilityConfigSchemaVersion::V1` and fixed typed compatibility | adding typed version/field/variant requires 03 review/writeback |

## 4. SOP 五问回答

| SOP 问题 | L3-capability-hub 回答 |
|---|---|
| 是否存在旧配置需要迁移？ | 否。formal 04尚未创建、实现仓尚未建立，也没有已发布Capability Hub runtime config artifact/schema。README、旧formal 05/06和restart前provider/cost/runtime说法是historical material，不是legacy configuration。 |
| 新配置如何引入？ | 先分类为artifact value、raw schema或typed contract变化。value变化走Step 10完整artifact变更；raw schema变化受控回开Steps 5~13；typed root/builder/adapter/Port/error/flow变化先回formal 03，再重走04相关Steps。不得实施先加key后补设计。 |
| 旧配置如何废弃？ | 只适用于未来已经正式发布的配置。必须记录exact old identity、replacement/no-replacement理由、parser行为、source/env冲突、安全投影、兼容窗口、rollback边界、下游承接和移除条件。当前没有可标deprecated的key。 |
| 是否需要兼容窗口？ | 当前不适用。未来重命名/拆分/合并/schema升级若需窗口，必须先设计binary×schema支持矩阵和old/new冲突规则；安全红线、raw secret、unsupported dynamic control不提供“暂时接受”窗口。 |
| 何时允许移除旧配置？ | 只有正式窗口结束、所有active/rollback artifacts和env injections不再引用、支持旧schema的binary退出目标环境、05/06证据与门禁完成、07/09交付更新、敏感material安全处置、无03/04缺口后才可移除。 |

## 5. 当前问题诊断

| 风险 | 错误做法 | 本 Step 裁决 |
|---|---|---|
| no released baseline | 把旧文档里的provider key当v0 | historical material never becomes alias/migration source |
| strict unknown rejection | 为“兼容”静默忽略新/旧key | unknown remains reject；compatibility requires explicit schema design |
| fixed V1 typed enum | 在04直接宣告V2已支持 | V2 is future controlled reopen, not current state |
| artifact vs schema | endpoint/ref/value变化都叫migration | valid value changes are Step 10 artifact changes |
| source rename | old/new env同时存在时随便选一个 | explicit conflict matrix required；current design supports neither alias |
| secret rotation | 复制旧secret进新artifact | only refs/registrations rotate；raw material remains provider-owned |
| rollback | 用旧schema artifact当universal LKG | target must match current binary and pass full validation/eligibility |
| deprecation warning | 发明新的public issue/API warning | no warning surface authorized；future need may require 03 reopen |

## 6. 改动前后对比

| 维度 | Step 13 前 | Step 13 后 |
|---|---|---|
| current migration status | not stated | zero released legacy items, exact reason recorded |
| change classification | Step 10 covers values/artifacts | value/schema/typed-contract layers explicitly separated |
| compatibility | only exact V1 known | no implicit alias; future dual-version prerequisites fixed |
| deprecation | no rule | future lifecycle and hard stop conditions defined |
| sensitive evolution | rotation exists | no raw migration and unsafe rollback rules tied to lifecycle |
| removal | no proof set | artifact/env/binary/test/acceptance/ops proof set required |

## 7. 配置设计取舍

| 议题 | 候选 | 裁决 |
|---|---|---|
| initial v1 needs v0 migration | fabricate v0；none | none。initial formal baseline is not a migration |
| additive field under v1 | allow unknown-safe optional；schema review | schema review。current parser rejects unknown and values are explicit |
| key rename | same-schema alias；new exact schema | no alias by default；explicit versioned design required |
| old/new conflict | precedence；reject | reject unless future design defines one exact mapping; source precedence does not resolve aliases |
| compatibility warning | public warning；control-plane notice | no new public warning；future control-plane mechanism must be designed and safely projected |
| schema conversion | runtime mutate root；offline/new artifact | only new immutable artifact before startup |
| secret migration | copy value；rotate ref/provider material | rotate ref/provider material only |

## 8. 当前迁移与废弃表

| 旧配置 | 新配置 | 状态 | 兼容窗口 | 迁移策略 | 移除条件 |
|---|---|---|---|---|---|
| 不适用：当前无已发布旧配置 | initial strict schema candidate `runtime.schemaVersion = 1` | `initial_design_baseline`; not released, not migration | 不适用 | Step 15从Steps 1~14装配formal 04；后续07安排实现；不得生成v0 alias | 不适用；不存在旧key/artifact可移除 |

This single row satisfies the required current-state declaration. It does not claim schema v1 has been implemented, deployed or consumed, and it does not create a compatibility promise.

## 9. 变更分类与处理路径

| Change class | Example | Schema version impact | Required design path | Activation/migration behavior |
|---|---|---|---|---|
| documentation-only correction | typo/comment/example formatting with identical strict JSON semantics | none | calibration/formal correction + source audit | no artifact migration |
| valid artifact value change | timeout within bounds、Configured->explicit Disabled、new valid endpoint/ref | none if shape/meaning unchanged | Step 10 review/audit/rollback; sensitive rules where applicable | new complete artifact + fresh process |
| named member replacement | constructorRef/endpointRef/fixtureRef points to another registered same-family member | none if exact family/shape unchanged | Steps 8~10 eligibility/review | new artifact; old artifact remains only if still safe/eligible |
| parser bound tightening/widening | max bytes/count/name grammar changes | schema semantic change | reopen Steps 7/9/11/12/13 and tests/gates | explicit compatibility decision; no silent clamp |
| key/module/field rename | `oldName` -> `newName` | schema change | reopen Steps 5/7~13; 03 if typed name/owner changes | explicit version matrix; old/new conflict reject |
| field add/remove/type/unit/default/required change | new leaf、ms->seconds、optional->required | schema change | reopen Steps 7~13; 03 if typed carrier changes | versioned parser/artifact migration design |
| variant/profile/source change | new binding kind/profile/env leaf/source | architecture/config schema change | reopen 01/03/04 as affected | no current compatibility until approved |
| Port/builder/error/flow change | new constructor arg、Port failure、reload API | typed code-contract change | formal 03 controlled reopen before 04 | implementation blocked until formal sources align |
| fixed codec/digest change | `compatibility.protocolCodec` or `.digest` differs | protocol/integrity compatibility change | architecture + formal 03 + 04 reopen | not a config-only migration knob |
| forbidden responsibility request | runtime execution、listing、approval、method body、provider route/cost、SDK lifecycle | out of scope | reject or restart upstream design | never introduced through migration alias |

### 9.1 Artifact value change is not schema migration

A valid v1 artifact may select different legal values, refs or existing closed branches without creating a new schema. It must still be a complete immutable document, pass V0~V8 and Stage 0~7, satisfy profile/cardinality/security constraints and enter through a fresh selected entry process. The previous artifact is not edited in place.

### 9.2 Schema migration is not runtime reload

Any future converter produces a separate candidate artifact before the target process starts. The process does not read an old root, mutate fields and expose a partially converted graph. A converter, if later selected, must itself have deterministic input/output schema identities, reject ambiguity, suppress sensitive values and be owned/tested outside business flows.

## 10. Future version introduction gate

Before any schema version beyond v1 can be declared supported, all rows below must be closed in formal design. They are prerequisites, not current implementation claims.

| Gate | Required future decision | Current status |
|---|---|---|
| version identity | exact integer/literal and parser dispatch; never `latest` | only v1 defined |
| typed representation | whether formal 03 config version/type/root changes | not designed; controlled reopen required |
| binary × schema matrix | exact read support per binary/release, including rollback target | not selected |
| old/new mapping | each key/type/unit/default/variant mapping and information-loss rule | none |
| conflict | both versions/aliases/env names present, duplicate semantics and precedence | reject by current design |
| sensitive material | ref/provider registration migration without raw value exposure | current ref-only invariant applies |
| conversion | deterministic tool/library owner, failure, safe diagnostics and idempotence | not selected |
| validation | old input, converted candidate and target all validated under exact schemas | future 05 obligation |
| rollout/rollback | artifact/binary pairing, fresh process, eligibility and cutover unknown handling | future 07/09 obligation |
| removal | inventory/evidence/acceptance/operations proof set | no old version exists |

Adding a new raw-only version may still require formal 03 changes because the current typed schema version is closed to `V1`. No downstream document may decide this is “parser-private” without an exact impact review.

## 11. Future deprecation lifecycle

The labels below are editorial lifecycle states, not runtime enums.

| Lifecycle | Formal meaning | Parser/source behavior | Required record | Exit gate |
|---|---|---|---|---|
| `proposed` | change requested but not authoritative | current schema unchanged | motivation、impact、owner、reopen scope | Steps 3~13 design closure |
| `supported` | exact formal schema accepted | strict exact behavior | version/support matrix and tests planned | replacement formally introduced |
| `deprecated` | old identity accepted only within explicit window | only exact designed old parser/source path; no silent alias | window、replacement、safe control-plane notice/audit | usage/artifact/env/binary/rollback closure proven |
| `rejected` | old identity no longer accepted | deterministic validation failure | fixed safe issue category/record if existing surface permits | all target environments no longer require old support |
| `removed` | implementation/schema definition deleted | old identity remains unknown/unsupported and rejects | release/design history only | post-removal regression and acceptance gate complete |

Current counts: `proposed=0`, `deprecated=0`, `rejected legacy=0`, `removed legacy=0`. The initial v1 candidate is not yet a released `supported` implementation fact.

### 11.1 No-compatibility redlines

| Requested legacy behavior | Required action | Reason |
|---|---|---|
| raw token/password/DSN/key/certificate/trust/provider response in config | reject immediately | violates secret boundary |
| embedded credential in endpoint or raw body extension | reject immediately | violates closed material schema |
| unknown key silently ignored | reject | strict schema and typo detection |
| static/domain invariant override | reject/design restart | config cannot alter truth/state/idempotency/query boundary |
| Deployment fake/inMemory/deterministic fixture fallback | reject | profile isolation |
| configured adapter -> fake/disabled/plaintext fallback | reject | operator intent and security |
| config center/admin/watch/hot reload/online LKG key | reject/design restart | unsupported control plane |
| runtime/tools execution、marketplace、approval、method body、provider route/cost、SDK delivery key | reject/upstream scope review | forbidden Hub responsibility |

These redlines do not receive a grace period merely because an old document or local artifact once mentioned them.

## 12. Rename、split、merge and environment-source rules

| Evolution shape | Mandatory future rule | Current default if encountered |
|---|---|---|
| one key renamed to one key | exact schema versions、value mapping、both-present conflict、env mapping | reject old/unknown key |
| one key split into many | completeness, default prohibition and information-loss handling | reject; builder cannot guess missing outputs |
| many keys merged | equality/conflict and precedence independent of source precedence | reject ambiguous combination |
| type/unit change | no coercion; explicit conversion bounds/overflow/rounding | reject wrong old type/unit |
| required becomes optional/defaulted | explicit semantic default owner and profile effects | remain required under v1 |
| optional/defaulted becomes required | exact compatibility window and missing behavior | no such v1 transition |
| env leaf renamed | file/new-env/old-env four-way conflict table and sensitive output | old env unsupported; invalid new env rejects |
| module/registry family moves | reachability/family/cycle/cardinality revalidation | old path unknown and rejects |

Source priority only compares sources for one canonical item. It never resolves two names that claim to be the same item; alias conflict requires its own future schema rule.

## 13. Sensitive-reference evolution

| Scenario | Allowed evolution | Forbidden migration |
|---|---|---|
| credential/certificate/trust rotation | new provider registration/ref set, exact constructor resolution, fresh process, old set revoked after external safety procedure | raw value in converter/config/audit/report |
| providerRef/locatorRef rename | future versioned ref mapping and safe audit class; provider owner performs material operation | logging full locator or reading secret to compare/hash |
| compromised/revoked material | fix-forward to a new safe set | rollback to compromised artifact/ref |
| endpoint/TLS relation change | atomic reviewed transport/TLS/credential group | partial TLS downgrade or old/new key-cert mix |
| provider product replacement | controlled product prerequisite and constructor compatibility review | fallback to another provider without explicit artifact |

Configuration migration never proves material was rotated, revoked or deleted. Those are external provider/operations facts and may only be recorded after actual action by their owner.

## 14. Removal readiness checklist

| Proof domain | Required before future removal | Evidence owner |
|---|---|---|
| formal design | replacement/no-replacement, mapping, conflict and exact removal version approved | 03/04 design owner |
| artifacts | all intended active artifacts use target schema; old artifacts identified and dispositioned | release/config owner |
| environment | old file keys/env injections/bootstrap selectors absent from target environments | operations owner |
| binaries | no target process requires old parser/schema; rollback binary/artifact pairs remain valid | implementation/release owner |
| sensitive material | refs/provider registrations safely rotated/revoked according to external policy | security/provider owner |
| test | positive/negative/conversion/conflict/removal regressions planned and actually run when implementation exists | 05/test owner |
| acceptance | exact fixed-run evidence satisfies removal/veto gates | 06 acceptance owner |
| implementation | parser/converter/docs removal assigned to reviewed boundary | 07 implementation owner |
| operations | deployment/rollback/runbook/alert references updated | 09 operations owner |
| observation | safe legacy-use signal, if designed, no longer required; absence is not inferred from missing logs | release/operations owner |

No row is currently claimed complete because there is no legacy item to remove. Future proof must come from real records, not this checklist.

## 15. 下游承接

| Downstream | Future migration responsibility | Must not claim now |
|---|---|---|
| `05` | schema/version mapping cases、old/new conflict、conversion determinism、security、binary/artifact matrix、removal regression | executed migration or evidence |
| `06` | compatibility/removal gate、unsafe fallback veto、fixed-run evidence sufficiency | accepted release/removal/signature |
| `07` | versioned parser/converter implementation boundaries、artifact tooling、tests、pause/rollback | commit/hash/completion |
| `09` | actual artifact inventory、binary pairing、rollout/cutover/rollback、env cleanup、secret rotation、runbook | deployed wave/rollback/rotation record |

## 16. 历史材料与污染隔离

| Historical material | Why it is not legacy config | Disposition |
|---|---|---|
| README provider/MCP/A2A/API shorthand | no exact v1 key/type/source/version/artifact | scope hint only; no alias |
| old formal 05/06 | tests/acceptance text, not runtime artifact authority | T022/T038 historical input only |
| restart-predecessor design terms | superseded design candidates without released schema | do not migrate/deprecate |
| reference-project config keys | different bounded context and owners | granularity reference only |
| JSONC examples | documentation-only and rejected by runtime parser | never an old runtime format |

## 17. 配置迁移停审与跨演进审计

| Audit item | Result | Gap/correction |
|---|---|---|
| released old configuration exists | no | current migration item count 0 |
| historical text treated as alias | `0` | isolated |
| initial v1 described as implemented/released | `0` | design candidate only |
| value change confused with schema migration | `0` | classification table fixed |
| implicit alias/coercion/unknown ignore | `0` | strict rejection retained |
| compatibility window without binary/schema matrix | `0` | future gate required |
| deprecation warning/API invented | `0` | no runtime surface authorized |
| raw secret migration/output | `0` | refs/provider operations only |
| unsafe material rollback | `0` | fix-forward only |
| hot reload/config center/admin/LKG migration | `0` | design restart required |
| old schema removed without downstream proof | `0` | 10-domain checklist required |
| 03 typed change bypass | `0` | controlled reopen rule fixed |
| fake migration/test/deployment/evidence fact | `0` | future owner only |

## 18. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| current no released migration item | 否 | configuration history fact | 不适用 | 无回写 |
| valid v1 value change uses immutable artifact/restart | 否 | existing configuration lifecycle | formal 03 §13 | 无回写 |
| strict no-alias/no-coercion future policy | 否 | preserves current parser/config boundary | formal 03 §13 | 无回写 |
| future raw-only key/bound/source change with same typed root | review required; may be no | raw schema contract | reopen 04 Steps 5~13 and assess 03 | 当前未引入；受控回开 |
| future V2 typed version/root/variant/builder/constructor/error/flow | 是 | code contract | reopen DDD owning Steps and formal 03 | 当前未引入；受控回开 |
| future config center/admin/hot reload/online LKG | 是且涉及architecture | runtime lifecycle/control plane | reopen 01/03/04 | 当前拒绝；受控回开 |

Current `待回写=0`, `阻塞待确认=0`, `upstream blocker=0`。Rust declaration/struct/field/enum/variant/payload/trait/method/callable delta=`0`; Rustdoc delta=`0`。任何future V2 Rust变更必须为声明、每个struct field、enum variant及payload field、trait/method/callable提供英文 `///`。

## 19. Formal §13 回填草稿

正式 `04-配置设计.md` §13 应装配：

1. current migration table，明确无已发布legacy配置；
2. artifact-value/raw-schema/typed-contract三层分类；
3. future version introduction gate和editorial lifecycle；
4. no-compatibility redlines、rename/split/merge/env conflict rules；
5. sensitive-reference evolution和10-domain removal proof；
6. 05/06/07/09 handoff、historical isolation、cross-evolution audit和03 impact。

正式章节不得写已发布v1、已支持V2、实际兼容窗口、usage count、migration result、secret rotation、deployment wave、test evidence或removal approval。它必须说明当前迁移项为0，但不能省略未来演进规则。

## 20. 待确认事项

| 事项 | 当前影响 | 是否阻塞 Step 14 | 未确认前处理 |
|---|---|---|---|
| first implementation/release version identity beyond design label | affects future support matrix | no | only schema v1 design candidate；no released claim |
| future need for dual-schema parser/converter | would affect03/04/05/07/09 | no | no dual support; old/unknown rejects |
| actual artifact inventory and rolling deployment strategy | operations prerequisite | no | no compatibility/removal claim |
| safe deprecation-use observation mechanism | may require diagnostic contract | no | no invented warning/metric; future controlled reopen |
| concrete secret/provider rotation product | operations/security prerequisite | no | ref-only rules and fix-forward remain |

## 21. Step 13 completion gate

| Completion condition | Result |
|---|---|
| SOP five questions answered | pass |
| current migration item explicitly stated | pass; `0` |
| required migration/deprecation table | pass |
| value/schema/typed change paths | pass |
| future compatibility/version gates | pass `10/10` |
| no-compatibility redlines | pass `8/8` |
| removal proof domains | pass `10/10` |
| historical alias pollution | `0` |
| fabricated release/migration/evidence fact | `0` |
| 03 pending writeback/upstream blocker | `0/0` |
| formal 04 write before Step 15 | `0` |

Step 13 is complete. Next allowed action: read SOP Step 14、writing standard §5.14 and all Steps 1~13 impact/risk/open-item sections；aggregate exact risks, owners, blocking scopes, interim rules and the complete 03 writeback ledger. Step 15 remains blocked if any `待回写` or `阻塞待确认` item exists.
