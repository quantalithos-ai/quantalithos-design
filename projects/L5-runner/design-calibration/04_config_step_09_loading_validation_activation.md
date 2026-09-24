# Step 9. 定义配置加载、校验与生效机制

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 9
> 回填章节：`04-配置设计.md` §9
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_09_loading_validation_activation.md`
> 输入：Step 5、Step 7～8、03 builder/port/flow/error/observability
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与收口回答

| 项 | 当前值 |
|---|---|
| current_document | `04-配置设计.md` |
| current_step | Step 9 |
| current_module | `loading:parse_validate_assemble_activate` |
| gate_status | `pass_for_step_10` |
| gate_reason | source snapshot、strict parse、type/range/ref/forbidden/cross-field 校验、逐域装配、生效和安全 issue surface 已闭合；无 03 待回写。 |
| formal_04_write_allowed | `false_until_step_15` |
| next_allowed_action | 创建并完成 `04_config_step_10_change_audit_rollback.md` |

| SOP 问题 | 收口回答 |
|---|---|
| 何时加载？ | 每个 bootstrap/new assembly 前加载完整文档并冻结 immutable snapshot；Job policy 在 reserve/claim 前从 snapshot + 正式 run-local input 取更严格值并冻结；test fixture 仅 test assembly。 |
| 如何 parse/type validate？ | source snapshot 后执行 strict UTF-8 JSON object parse；duplicate/unknown/alias/comment/trailing content 拒绝；再执行 exact type、closed enum、positive finite、ref lexical/family 和 sensitive/forbidden 校验。 |
| 哪些 cross-field？ | profile/provider family、store completeness、unique slots、feature prerequisites、archive pair、numeric cap、idempotency horizons、retry/no-replay、redaction/diagnostic、fixture isolation 等。 |
| 如何生效？ | startup/new assembly、job-run-start、entry-start、test-startup；P0 没有 hot/reload/build-time runtime config。Validated snapshot 经 builder 装配 stores→adapters→clock/id/digest→typed policies→facade/entry/worker/operations。 |
| 失败如何处理？ | startup 失败不暴露 facade；Job policy失败拒绝当前 Job；entry selector失败拒绝入口；test fixture失败使测试装配 fail-fast。高优先级/新文档非法不得回退旧/default。 |

## 2. 加载与校验流程

```text
[static schema / forbidden declarations / safe optional defaults]
                         +
       [one selected external strict JSON document]
                         |
                         v
        [source bytes snapshot + source correlation ref]
                         |
                         v
 [strict JSON parse: duplicate/unknown/alias/comment rejection]
                         |
                         v
 [module/type/enum/positive finite/opaque-ref lexical checks]
                         |
                         v
    [sensitive + forbidden body/invariant override checks]
                         |
                         v
 [profile/slot/feature/horizon/retry/cap cross-field checks]
                         |
                         v
       [immutable validated config snapshot + config_ref]
                         |
                         v
 [stores/UoW -> adapter registry -> clock/id/digest -> policies]
                         |
                         v
       [RunnerRuntimeConfig + builder capability markers]
                         |
                         v
 [facade + entry/worker/operations exposed only when locally safe]
```

关键边界：

- source bytes 只在 loader 最小范围存在；不写 domain/store/log/error/report。
- `config_ref` 是 loader 对已验证 snapshot 的 body-free correlation identity，不是 Release/artifact digest、commit 或 evidence。
- builder `Ready` 只表示本地 composition 可暴露 fail-closed facade；每个 external slot 仍独立报告 readiness。
- positive owner call 必须在业务 flow 当次重新满足 authority/basis/readiness；配置校验不能替代。

## 3. 加载、校验、生效总表

| 配置组 | 加载时机 | parse/type/ref 校验 | cross-field/能力校验 | assemble target | 生效 | 失败 |
|---|---|---|---|---|---|---|
| runtime | bootstrap | exact object/literal/profile enum | profile/provider/source compatibility | `RunnerRuntimeProfileRef` + generated `RunnerInfraConfigRef` | startup/new assembly | whole assembly fail-fast |
| stores | bootstrap | five non-empty opaque refs | profile family、required capabilities、logical separation | `RunnerRuntimeConfig` store refs + store/UoW markers | startup | core不足 builder blocked/failed |
| bindings | bootstrap | array/exact object/closed slot/ref/unique | profile family、formal contract/readiness independent | adapter ref set + per-slot markers | startup | invalid doc reject；unready slot Blocked |
| limits | bootstrap；Job run start | positive finite/full embedded object/policy ref | hard cap、request only tighter、horizon、retry/no-replay | entry/query bounds + frozen Job/idempotency policy | startup/job-run-start | startup fail-fast或Job reject |
| observability | bootstrap | required/nullable ref shape | redaction required、feature/ref pair、provider capability | redaction/diagnostic/handoff/telemetry adapters | startup | redaction fail-closed；optional telemetry degraded |
| determinism | bootstrap/test startup | required refs + nullable fixture | test-only fake、provider family/capability | clock/connectivity/id/digest ports + test fixture | startup/test-startup | mutation/test blocked/fail-fast |
| features | bootstrap | bool/nullable refs | prerequisites、archive pair、never reserved path | request markers + presentation/archive binding | startup | disabled或Blocked；不生成 Ready |
| entry selector | entry start | selector shape/exactly-one source/profile | selects whole document only | current bootstrap context | entry-start | current entry reject |

## 4. Cross-field validation matrix

| Rule ID | 输入 | 规则 | 失败 surface |
|---|---|---|---|
| `RUN-CFG-V-001` | schema/profile | exact schema；profile 四值且显式 | `UnsupportedSchema` / `InvalidProfile` safe issue |
| `RUN-CFG-V-002` | profile + all ref families | test refs仅test；integration/product禁 fake；local-safe禁 success fake | document reject |
| `RUN-CFG-V-003` | five store/cache refs | refs齐全且 logical family不混淆；capability marker分别建立 | invalid ref reject；capability不足 builder blocked |
| `RUN-CFG-V-004` | adapter bindings | closed slots、unique、ref non-empty；不得重复功能域-owned slot | document reject |
| `RUN-CFG-V-005` | config ref/value lexical classes | URL/path/credential/raw body/SDK method/private backend patterns不得作为 ref/body | security reject，无 raw echo |
| `RUN-CFG-V-006` | all numeric limits | positive finite、representable、≤ static hard cap；embedded 十项齐全 | document reject |
| `RUN-CFG-V-007` | request/Job value + startup cap | run-local value只能更严格；不能扩大 cap/关闭 guard | entry/Job reject |
| `RUN-CFG-V-008` | idempotency windows + retry/redelivery/claim/report/commit-unknown horizon | formal horizon未知或window不足不得启用对应 mutation/Consumer/Job | affected capability Blocked；核心可使 assembly blocked |
| `RUN-CFG-V-009` | retry policy | possible-effect timeout、Unknown、commit-unknown不得自动 replay/resend/reclaim | policy reject |
| `RUN-CFG-V-010` | redaction refs | redaction binding/policy required、family compatible、fail-closed | assembly blocked/no visible output |
| `RUN-CFG-V-011` | diagnostic/handoff flags + refs | request=true需对应 ref、profile allowance、formal prerequisite | reject或peripheral Blocked |
| `RUN-CFG-V-012` | archive flag + ref | false→ref null；true→ref required，但不进入 core success | reject/Archive Blocked |
| `RUN-CFG-V-013` | fixture ref + profile | only test-deterministic且显式；fixture body不在 config | document/test assembly reject |
| `RUN-CFG-V-014` | feature/VETO keys | no Consumer positive、outbound event、owner mutation、gate/guard/no-write override | security/design reject |
| `RUN-CFG-V-015` | source/config identity | one document，source immutable during assembly；derived config_ref不可外部填写 | source ambiguity/unknown-field reject |

## 5. Runtime builder 装配与暴露

| 顺序 | 输入 | 产物 | 暴露对象 | 门禁/禁止 |
|---:|---|---|---|---|
| 1 | validated snapshot | profile/config identity + typed policies | infra config only | no raw document handle |
| 2 | store/cache refs | store capability states、UoW/repository/cache implementations | application ports later | core capability不足不继续；不选 private backend |
| 3 | external/platform/observability refs | adapter availability markers | registry | configured不等Enabled/Ready；RUN-UP blocker显式 |
| 4 | clock/id/digest refs | typed providers | application | missing blocks mutation；no ad hoc fallback |
| 5 | typed limits/features | immutable entry/query/job policies | entry/operations | domain/contracts不读 config；flags不改 invariant |
| 6 | all required local guarantees | `RunnerRuntimeConfig` / builder state / facade handle | entry/worker/operations | facade只有本地安全装配后暴露；per-port仍可blocked |
| 7 | entry/Job start | frozen run-local effective policy | current request/run only | no global snapshot mutation |

`application` 只接收 typed ports/policies；`domain` 与 `contracts` 不接收 config handle。`entry`、`worker`、`operations` 可读取 validated snapshot 的边界视图，但不能重新 parse 或绕过 builder。

## 6. Issue surface 与失败映射

| Issue class | 安全字段 | 禁止字段 | 行为 |
|---|---|---|---|
| `SourceUnavailable/Ambiguous` | source ref/class、issue ref | path/body/env dump | bootstrap fail-fast |
| `ParseFailed/DuplicateKey/UnknownField/AliasField` | section/key class、issue ref | raw document/value | reject whole document |
| `MissingRequired/InvalidType/InvalidEnum/InvalidRange` | field path class、expected class、issue ref | sensitive value | reject/affected Job reject |
| `InvalidRef/ForbiddenMaterial` | slot/ref family/forbidden class、issue ref | full ref/detected material | security reject |
| `CrossFieldConflict` | rule ID、safe involved paths、profile/slot class | raw values | reject/Blocked |
| `CapabilityUnproven/ContractBlocked` | slot/capability class/upstream blocker ref | SDK/provider raw error | per-slot/core blocked |
| `UnsupportedReload` | activation class、issue ref | new/old config body | keep current snapshot；reject operation |
| `ConfigAuthorityPending` | policy family、issue ref | guessed number | affected capability blocked |

这些是配置设计的 issue classes，不声明已经存在新的代码 enum。实施若需要改变 03 `InfraError`/`ApplicationError` surface，必须先回写 03，不得在实现中私造 public error contract。

## 7. 生效与 snapshot 一致性

| 生效方式 | 适用 | snapshot 语义 | 失败/回退 |
|---|---|---|---|
| `startup` | runtime/stores/bindings/observability/determinism/features/全局 caps | 生成一个 immutable validated snapshot + builder marker | invalid不替换现有/不暴露新 facade；无 silent fallback |
| `new_assembly` | 任何配置变更/轮换 | 新 source/config identity、新 stores/adapters/markers | 新 assembly失败不篡改旧 truth；是否继续旧实例由外部生命周期决定，不称 LKG自动回滚 |
| `job_run_start` | batch/parallelism/timeout/retry/idempotency/read budget | 从当前 validated snapshot +正式 request取更严格值，写入run basis/ref | invalid拒绝 Job；已运行 Job不改变 |
| `entry_start` | source/profile selector | 只选择完整 document/assembly | selector冲突拒绝入口 |
| `test_startup` | fixture/fake refs | isolated test snapshot | fixture错误 test fail-fast |
| `hot/reload` | none | unsupported | reject；当前 snapshot不变 |
| `static` | invariants | 不在 config | 改变必须走 00～04/03 review |

## 8. 逐域停审与跨加载审计

| 配置域 | required/type/ref | cross-field | assembly/exposure | failure | 结论 |
|---|---|---|---|---|---|
| runtime | closed | schema/profile/source | identity/snapshot | fail-fast | pass |
| stores | five refs | family/capability | store/UoW before facade | blocked/fail-fast | pass with physical blocker |
| bindings | closed/unique | profile/contract | per-slot marker | reject/Blocked | pass with upstream blockers |
| limits | positive/full | caps/horizons/no-replay | typed/frozen policies | reject/Blocked | pass pending authority |
| observability | required/nullable | safety/prerequisites | redaction first | fail-closed | pass with blockers |
| determinism | required/test optional | fake isolation | typed providers | mutation/test blocked | pass |
| features | bool/ref pair | prerequisite/VETO | request marker only | disabled/Blocked | pass |

| 跨加载审计项 | 结论 |
|---|---|
| 未校验 required/type/range/ref | none |
| cross-field/horizon/retry缺口 | none internally；authority gaps显式Blocked |
| invalid external是否fallback | no |
| raw document/secret是否进入snapshot/output | no |
| builder是否半装配暴露facade | no |
| job/entry是否改全局snapshot | no |
| hot/reload是否无rollback | N/A；unsupported |
| configured/enabled/ready是否合并 | no |
| 是否引入未回写03 callable/error | no；issue class明确为设计语义 |

## 9. 03 影响、回填与门禁

| 结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 状态 |
|---|---|---|---|---|
| strict JSON→validated snapshot→existing builder sequence | 否 | loader/config semantics | N/A | 无回写 |
| typed policies/ports only, no domain raw config | 否 | existing dependency rule | N/A | 无回写 |
| issue classes是安全语义，不声明新enum | 否 | error mapping guidance | N/A | 无回写 |
| future online reload/LKG/remote source/new public error/secret port | 是 | builder/lifecycle/port/error/concurrency | 03 Step 6/7/9/12/13/14 | 当前排除，未来重开 |

未来正式 §9 应回填流程图、总表、cross-field、builder、issue surface 和生效矩阵，并明确“validated/assembled 不等 external ready”。

| 待确认事项 | 当前处理 |
|---|---|
| parser/library、duplicate detector、canonical config identity algorithm | 07 implementation decision；本步只定行为，不声称实现 |
| actual source delivery/selector | 07/09 运维承接；不写 env/flag/path |
| numeric authority/contract capability probes | blockers 保留；affected capability不 Ready |

| 进入 Step 10 条件 | 结论 |
|---|---|
| parse/type/range/ref/forbidden/cross-field 完整 | pass |
| 每域装配、生效、失败和暴露边界可判定 | pass with explicit blockers |
| 跨加载无 unresolved 内部冲突 | pass |
| 无当前 `待回写`/`阻塞待确认` 03 影响 | pass |

Step 9 完成，允许进入 Step 10；正式 04 仍不可写，未实现 loader/builder 或执行测试。
