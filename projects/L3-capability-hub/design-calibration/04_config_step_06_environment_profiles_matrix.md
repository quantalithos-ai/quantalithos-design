# L3-capability-hub 04 配置设计 Step 6：环境、部署 profile 与配置矩阵

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 6
> 回填章节: `projects/L3-capability-hub/04-配置设计.md` §6
> 创建日期: 2026-07-25
> 当前模式: full-restart / continuous execution
> 状态: `04_step_06_completed_continuous_execution`

---

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 6 `定义环境、部署 profile 与配置矩阵` |
| 输入基线 | 04 Step 1~5；formal 03 §13.12；DDD Step 14 §14.6、§118、§130~§131 |
| 本步产物 | profile matrix、environment mapping、四态 binding matrix、activation predicate、下游承接和冲突审计 |
| 当前结论 | completed；唯一 runtime profile 集合为 `Local / Integration / Deployment` |
| 03 影响 | `无回写`；没有新增 profile enum、binding variant、field、Port、flow 或 error |
| 上游 blocker | 0 |

## 2. 本步目标、输出与限制

本 Step 将环境用途映射到已存在的 runtime profile，并固定每种 profile 对 local authority、external Port、Worker source、clock、ID、compatibility、diagnostics 和 entry 的允许 binding。环境名称不能扩展代码 enum，也不能改变业务 truth、protocol、state、transaction 或责任边界。

本步必须闭合：

1. `Local / Integration / Deployment` 的 exact allowed binding matrix。
2. local development、CI、integration-like、operations replay、staging-like、production-like 的用途映射。
3. `Configured / DeterministicFake / Disabled / Missing` 的 profile-specific 构造、激活和失败行为。
4. sensitive ref 在各环境的处理边界，不写 raw secret 或真实产品。
5. 哪些差异交给 05/06/07/09，哪些差异不属于本轮 P0。

本步不定义具体 key、默认数值、JSON 示例、环境变量名、真实数据库/消息/secret/observability 产品、部署命令、证书安装或容量 sizing。具体配置项留 Step 7，密钥留 Step 8，加载留 Step 9，运维值留后续文档。

## 3. 本步输入

| 输入 | 用途 | 权威边界 |
|---|---|---|
| `04_config_step_03_control_plane.md` | control plane 和 binding owner | 不新增 profile 控制面 |
| `04_config_step_04_categories_boundaries.md` | startup-only、fixture 和 peripheral 分类 | 不把环境差异变成 hot reload |
| `04_config_step_05_sources_priority_conflicts.md` | `parser constants < JSON < bounded env`、ref-only、fixture lane | 不改变来源优先级 |
| `03_ddd_step_14_config_external_binding.md` §14.6 | exact profile compatibility matrix | 该矩阵优先于后文非 canonical 简写 |
| `03-详细设计.md` §13.12 | formal profile handoff、P0/P1/P2 product boundary | 不重新定义 `CapabilityRuntimeProfileKind` |
| formal `00/01/02` | deployment boundary、dependency crop、security/body exclusion | 环境不能引入被排除的 owner |
| old `05/06` | historical environment/test direction only | 不继承旧产品、旧阈值、旧 evidence 或 signoff |

## 4. SOP 问题回答

| SOP 问题 | L3-capability-hub 回答 |
|---|---|
| local / CI / test / staging / prod 是否适用？ | 环境用途均可记录，但 runtime profile 只允许 `Local`、`Integration`、`Deployment`。本轮 P0 必须覆盖 local development、CI deterministic tests、integration-like seam 和 operations replay；staging-like/production-like 只记录为 Deployment 方向与后续产品绑定，不声称已可运行。 |
| 每个环境配置来源是什么？ | 所有环境遵守 Step 5 的 source lanes。Local 可使用 explicit fixture；CI 使用 test file + bounded CI env + fixture；integration/replay 使用 JSON + bounded env + typed refs；Deployment 使用 deployment-owned JSON/env + symbolic sensitive refs。没有环境可以重读 raw config 或使用 admin override。 |
| 每个环境依赖哪些外部服务？ | Local/CI 可使用 parity-complete deterministic fake 或 explicit Disabled；Integration 可使用 Configured、Fake 或 Disabled；Deployment 只能 Configured 或 Disabled，enabled surface 的 concrete binding 必须完整。具体产品未选择，不将目录存在当作连通事实。 |
| 敏感配置如何处理？ | Local/CI 只使用 fake/fixture ref；Integration 使用 product-neutral credential/endpoint/destination ref；Deployment 只允许受控 secret-provider ref。所有环境都禁止 raw secret、raw body、raw endpoint credential 和外部正文进入 root、日志、error 或 evidence。 |
| 哪些环境差异影响测试和验收？ | CI 证明 typed contract、fake parity、deterministic failure；Integration 证明 configured/fake/disabled/missing 选择、family/schema/topic 和 unavailable mapping；Replay 证明 Job/report/reentry/duplicate/no-repair；Deployment-oriented gates由 05/06/07 继承，但当前不伪造真实外部执行结果。 |

## 5. 当前问题诊断

| 位置 | 当前缺口或冲突 | 本步处置 |
|---|---|---|
| runtime profile 命名 | 环境名容易被误写成新的 Rust enum | 固定三种 canonical profile，环境名只作用途标签 |
| DDD 后部简写 | 某些后部交接表把 Integration 简写为 durable-only | 以 exact §14.6、formal §13.12 为权威；标记为 non-canonical shorthand，不改 03 |
| CI / replay | 不能直接对应一个 profile | CI 映射 `Local` 或 `Integration`，replay 映射 `Integration`，由 test/run purpose 再细分 |
| Deployment | “所有 external 都必须启用”会错误扩大责任 | Deployment 允许显式 `Disabled`；只要求 enabled surface 是 Configured、local authority durable、complete predicate 成立 |
| fake semantics | fake 可能被当作生产 readiness | fake 只证明 typed parity/determinism，不证明真实连通、delivery、evidence 或签署 |
| missing vs disabled | 两者都可能被称为“不可用” | Missing 阻断 graph；Disabled 是显式完整 binding，调用才产生 `NotConfigured` |
| product readiness | 参考材料列出目录/产品方向 | 目录存在不等于 contract、配置、连通或部署 readiness；保留为 prerequisite |

## 6. 改动前后对比

| 维度 | 本步前 | 本步后 | 目的 |
|---|---|---|---|
| profile 集合 | Local/Integration/Deployment 方向已存在但未展开 | exact surface matrix 和 activation predicate 固定 | 让 Step 7/05/06 可直接引用 |
| 环境命名 | local/CI/staging/prod 混用 | 环境用途与 runtime profile 分层 | 不新增 enum 或隐式 profile |
| Deployment | fake ban 已有但缺完整 predicate | durable + configured/explicit-disabled + 27/9/entry complete | 防止 partial exposure |
| Integration | 后文存在 durable-only 简写 | exact matrix 允许 InMemory 或 Durable，均需 parity | 消除非 canonical 冲突 |
| 四态 binding | 分散在 builder 段落 | profile × surface × outcome 矩阵 | 区分 Missing、Disabled 和 runtime unavailable |
| 测试/验收 | 只有方向 | profile-specific handoff contract | 不伪造测试/验收事实 |

## 7. 配置设计取舍

| 议题 | 候选 | 裁决与原因 |
|---|---|---|
| profile 数量 | A. 每个环境一个 profile；B. 三个 canonical runtime profiles | 采用 B。环境用途不应扩展 Rust enum 或产生重复 validation。 |
| CI profile | A. 新增 CI enum；B. 映射 Local/Integration | 采用 B。CI 是执行目的，不是 binding kind。 |
| Integration persistence | A. durable-only；B. InMemory 或 Durable，要求 parity | 采用 B，以 exact §14.6 为准；后文简写记为 historical shorthand。 |
| Deployment external slot | A. 所有 slot Configured；B. Configured 或 explicit Disabled | 采用 B。Disabled 是合法 concrete Port，不代表假成功。 |
| fake fallback | A. 依赖不可用自动 fake；B. 仅 explicit profile binding | 采用 B。Missing/Unavailable 都不能隐式切换。 |
| staging/production | A. 当前宣称可部署；B. 只记录 Deployment handoff | 采用 B。产品、secret provider 和真实 endpoint 未锁定。 |

## 8. 结构化中间产物

### 8.1 Canonical runtime profile matrix

| Binding surface | `Local` | `Integration` | `Deployment` | Activation implication |
|---|---|---|---|---|
| schema/profile/entry | `V1` + one selected entry | same | same | mismatch blocks Stage 0 |
| local persistence authority | `InMemory` or `Durable` with full parity | `InMemory` or `Durable` with full parity | `Durable` only | one authority `A`, 27 local/base Ports required |
| nine external Port slots | `Configured` / `DeterministicFake` / `Disabled` | same | `Configured` / `Disabled`; fake forbidden | all nine concrete slots required |
| six Worker source slots | `Configured` / `DeterministicFake` / `Disabled` | same | `Configured` / `Disabled`; fake forbidden | each slot resolved or explicitly Disabled |
| ten outbound routes | configured collaboration section, fake equivalent or whole Port Disabled | same | configured routes or whole Port Disabled | if Port Configured, 10/10 routes required |
| clock | `System` or `Deterministic` | `System` or `Deterministic` | `System` only | no application/domain fallback |
| ID generator | `System` or `Deterministic` | `System` or `Deterministic` | `System` only | no handler-generated substitute |
| compatibility | fixed `StableSurfaceV1 + Sha256V1` | same | same | not a runtime selector |
| diagnostics | `Off` or `Redacted` | `Off` or `Redacted` | `Off` or `Redacted` | allowlist remains Step 15-owned |
| selected entry parameters | exact API/Worker/Jobs variant | exact matching variant | exact matching variant | mixed entry or missing params blocks |

### 8.2 Environment-purpose mapping

| Environment purpose | Canonical profile mapping | Source lane | Allowed dependency shape | Sensitive handling | What it can prove |
|---|---|---|---|---|---|
| local development | `Local` | defaults + optional JSON + bounded env + explicit fixture | InMemory/Durable; Fake/Configured/Disabled | fake refs or absent; no raw secret | local typed behavior and manual exploration |
| CI deterministic test | `Local` or `Integration` according to seam under test | test JSON + bounded CI env + fixture | parity fake; controlled Configured only when declared; Disabled | fixture refs only | deterministic contract, domain, application and failure branches |
| integration-like | `Integration` | JSON + bounded env + typed refs | Configured/Fake/Disabled; no implicit fallback | credential/endpoint/destination refs only | adapter seam, family/schema, unavailable and post-commit mapping |
| operations replay | `Integration` | replay JSON + bounded env + typed Job input | replay state/refs + Fake/Configured/Disabled | historical refs; no raw body/secret | replay, duplicate, journal/report, no truth repair |
| staging-like | `Deployment` direction | deployment JSON + bounded env + sensitive refs | durable local authority; Configured or explicit Disabled | secret-provider refs only | future deployment gate, not current evidence |
| production-like | `Deployment` direction | deployment/operations-owned material | durable + Configured/Disabled, fake=0 | secret-provider refs only | future operational readiness gate, not claimed now |

Environment mapping is descriptive. It does not create a fourth binding state or permit a CI/replay input to modify the validated root after startup.

### 8.3 Four-state binding matrix

| Binding state | Profile eligibility | Graph cardinality | Startup result | Invocation result | Fallback |
|---|---|---|---|---|---|
| `Configured` | all profiles where surface is allowed | concrete required slot | constructor/probe must satisfy exact family contract | typed observation/outcome/failure | none |
| `DeterministicFake` | Local/Integration only | same concrete slot cardinality | fixture and parity validation required | same typed boundary; no real external fact | never automatic |
| `Disabled` | external Port/source surfaces where allowed | external Port remains concrete; Worker slot is explicit no-runner | graph can be complete if disabled is permitted | `NotConfigured` or no source invocation; no success | never Fake/Missing conversion |
| `Missing` | none | graph incomplete | `InfraError::RuntimeAssembly` / blocking validation | no invocation identity | never Disabled/Fake/other entry |

### 8.4 Complete activation predicates

```text
complete(profile, entry) =
    validated_schema_and_profile
 && exactly_one_selected_entry
 && profile_binding_matrix_passes
 && one_local_authority
 && local_base_ports_27_of_27
 && external_ports_9_of_9
 && selected_entry_parameters_match
 && worker_slots_resolved_or_explicit_disabled
 && configured_outbound_group_is_10_of_10
 && technical_and_diagnostic_policy_valid
 && selected_entry_factory_complete
 && one_nonclone_handoff
 && entry_runtime_ownership_complete
```

Profile-specific hard predicates:

| Profile | Additional predicate | Failure behavior |
|---|---|---|
| `Local` | deterministic bindings are explicit and parity-complete; no required local Port omitted | startup blocks on shape/parity failure |
| `Integration` | each Fake/Configured/Disabled choice is explicit; no source family substitution | startup blocks on missing/wrong-family material |
| `Deployment` | local authority is Durable; fake count is zero; every enabled external/source slot is Configured; Disabled slots are explicit | startup blocks before exposure; no fake fallback |

The predicate is startup-local, not persisted state. A false predicate cannot start an API listener, source task, Jobs runtime, or application invocation. An explicit Disabled binding can satisfy graph completeness only for a surface whose contract permits Disabled; it never satisfies a required local authority or missing entry parameter.

### 8.5 Sensitive configuration by environment

| Profile/environment | Allowed sensitive representation | Forbidden material | Downstream handoff |
|---|---|---|---|
| Local/local-dev | fake fixture ref, symbolic non-secret ref | raw token/password/key/cert/DSN/body | 05 redaction and fixture cases |
| Local/CI | deterministic fixture ref and bounded test selector | production credential, raw secret, raw external body | 05 deterministic data and 06 P0 gate |
| Integration/integration-like | symbolic credential/endpoint/feed/route/destination ref | secret value in JSON/env/log/error | 05 seam failure; 07 environment prerequisite |
| Integration/operations-replay | replay/state/report refs and fake/controlled refs | raw historical body/secret/evidence package | 05/06 replay gates |
| Deployment/staging-like | approved secret-provider ref and non-secret binding metadata | raw secret or unapproved product value | 07 binding prerequisite; no current readiness claim |
| Deployment/production-like | same ref-only rule, concrete product choice external to this Step | raw secret/body and fake material | operations runbook / ADR, not this design fact |

### 8.6 Test, acceptance and implementation handoff matrix

| Profile/environment | 05 test-plan input | 06 acceptance input | 07 implementation input | Not proven |
|---|---|---|---|---|
| Local/local-dev | smoke, typed mapper, local failure checks | no production acceptance | local bootstrap fixture boundary | deployment readiness |
| Local/CI | deterministic contract, fake parity, redaction, duplicate/no-write | P0 automated gate candidates | repeatable test config and fixture seed contract | real external connectivity |
| Integration/integration-like | configured/fake/disabled/missing, family/schema, timeout/unavailable, route completeness | integration seam gate candidates | adapter/ref prerequisite and no Cargo leakage | production endpoint success |
| Integration/operations-replay | Job journal/report/reentry, duplicate replay, partial failure, no truth repair | recovery/report gate candidates | replay fixture and run-input boundary | real delivery/evidence/signoff |
| Deployment/staging-like | future real-like binding tests | P1 candidate only | product/secret/provider prerequisites | current implementation or test result |
| Deployment/production-like | future operational validation | release/operations gate after implementation | deployment runbook and change control | all real readiness facts until executed |

### 8.7 Profile停审记录

| Review item | Result | Evidence in design | Correction / boundary |
|---|---|---|---|
| canonical profile count | pass | 3 exact profiles | environment labels do not add enum |
| Local surface | pass | InMemory/Durable + Fake/Configured/Disabled | parity required |
| Integration surface | pass | InMemory/Durable + Fake/Configured/Disabled | later durable-only shorthand rejected as non-canonical |
| Deployment surface | pass | Durable + Configured/Disabled, fake=0 | explicit Disabled remains concrete unavailable |
| Missing vs Disabled | pass | four-state matrix | Missing blocks, Disabled may complete optional slot |
| environment source lanes | pass | Step 5 lanes reused | no per-environment dynamic source |
| sensitive handling | pass | ref-only all environments | raw material reserved for Step 8 boundary |
| downstream handoff | pass | 05/06/07 rows | no test/acceptance/implementation fact claimed |

### 8.8 Historical and conflict audit

| Material / statement | Classification | Current disposition |
|---|---|---|
| DDD §14.6 exact Local/Integration/Deployment matrix | active canonical | use as profile authority |
| formal 03 §13.12 profile table | active canonical | use as formal handoff |
| later prose saying Integration must be durable | non-canonical shorthand / historical diagnostic | do not inherit; exact matrix permits InMemory or Durable with parity |
| old 05/06 staging/production claims | historical material | use only to identify downstream questions |
| repository/product directory existence | implementation prerequisite only | no readiness or configured binding inferred |

## 9. 跨 profile 审计

| 审计项 | 结果 | 固定规则 |
|---|---|---|
| profile enum expansion | 0 | only Local/Integration/Deployment |
| P0 environment coverage | closed | local, CI, integration-like, replay mapped |
| Deployment fake count | 0 | validator blocks any fake |
| Deployment durable authority | required | no InMemory deployment |
| Integration InMemory contradiction | resolved | exact §14.6 wins; parity required |
| Missing-to-Disabled conversion | 0 | explicit Disabled only |
| Missing-to-Fake conversion | 0 | explicit fixture only |
| raw secret/body across profiles | 0 | ref-only / body-free |
| config center/admin profile override | 0 | P0 unsupported |
| profile changes truth/state/protocol | 0 | profile constrains binding only |
| test/fake evidence as production proof | 0 | no such claim |
| 03 writeback gap | 0 | no code-contract delta |

## 10. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| exact profiles remain `Local/Integration/Deployment` | 否 | profile matrix restatement | §13.12、DDD §14.6 | 无回写 |
| CI/replay/staging/prod are environment-purpose mappings | 否 | environment labeling | 04/05/06/07 handoff | 无回写 |
| Integration permits InMemory or Durable with parity | 否 | canonical matrix conflict resolution | DDD §14.6; later shorthand is non-canonical | 无回写 |
| Deployment requires Durable and fake count 0 | 否 | existing profile gate | §13.12、complete predicate | 无回写 |
| explicit Disabled may complete optional external slot | 否 | existing four-state binding | §13.4、§13.12 | 无回写 |
| later product/secret/provider selection | 当前否；触发后是 | conditional code-contract trigger | originating DDD Step 14 and Step 7/8 | 无回写（当前未引入；触发后受控回开） |

The last row is a conditional controlled-reopen trigger, not a current blocker. Current impact audit: `待回写=0`；`阻塞待确认=0`。本步新增 Rust declaration/field/enum/variant/trait/method/callable=`0`，结构体和字段英文 Rustdoc 增量=`0`。

## 11. Formal §6 回填草稿

正式 §6 应包含：

1. canonical `Local / Integration / Deployment` surface matrix；
2. environment-purpose mapping，不新增 profile enum；
3. `Configured / DeterministicFake / Disabled / Missing` matrix；
4. complete activation predicate 和 Deployment hard gate；
5. sensitive ref handling、05/06/07 handoff 和 historical shorthand disposition。

正式 §6 不得把 CI、staging、production 写成已存在的 runtime profile，不得写真实产品、连接成功、测试结果、验收签署或部署 readiness。

## 12. 待确认事项与下一步门禁

| 事项 | 当前状态 | 是否阻塞 Step 7 | 后续处理 |
|---|---|---|---|
| exact JSON modules/keys/defaults | pending by design | no | Step 7 |
| concrete adapter/secret products | unselected | no | Step 7/8/13 controlled binding |
| operations replay artifact shape | pending | no | Step 7 and downstream Step 12 |
| staging/production operational values | deployment-owned | no | Step 7/07/operations handoff |
| implementation repository availability | absent | no current design blocker | 07 prerequisite; do not infer readiness |

进入 Step 7 的门禁：

| Gate | 结果 |
|---|---|
| canonical profile matrix | pass; 3 profiles, 10 surface groups |
| environment-purpose mapping | pass; 6 purposes mapped without enum expansion |
| four-state behavior | pass; Missing/Fake/Disabled/Configured closed |
| Deployment complete predicate | pass; durable + fake=0 + complete graph |
| sensitive handling | pass; ref-only, no raw material |
| downstream handoff | pass; 05/06/07 inputs defined, no execution facts |
| cross-profile unresolved conflict | 0 |
| 03 pending writeback / blocker | 0 / 0 |

```text
document = 04-配置设计.md
step = 6
status = 04_step_06_completed_continuous_execution
canonical_profiles = Local / Integration / Deployment
environment_purposes_mapped = 6
binding_surface_groups = 10
deployment_fake_count = 0
deployment_persistence = DurableOnly
missing_to_fallback_conversion = 0
historical_profile_conflicts = 1_noncanonical_shorthand_dispositioned
detailed_design_writeback = none
unresolved_upstream_blocker = none
next_allowed_action = complete_04_step_07_config_items
commit_required = no
```
