# L4-observability 04-配置设计 Step 13：定义配置迁移、废弃与演进

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 13
> 回填章节：`04-配置设计.md` §13
> 当前模式：`full-restart_after_current_M3`
> 本步边界：定义首版配置身份、未来新增/重命名/废弃/移除、schema/digest/store/binding migration和
> historical obligation退役规则；不执行迁移、不创建产品DDL/脚本/commit/run/evidence

## 1. Step状态

| 项 | 当前值 |
|---|---|
| 当前文档 | `04-配置设计.md`，formal仍冻结 |
| 当前Step | Step13 `定义配置迁移、废弃与演进` |
| 当前模块 | `schema-field-digest-store-binding-evolution` |
| 输出文件 | `projects/L4-observability/design-calibration/04_config_step_13_migration_deprecation_evolution.md` |
| 前序门禁 | Step12 current full rewrite `pass`；用户已授权连续完成M4 |
| 写入状态 | `completed_current_full_rewrite` |
| gate_status | `pass_consumed_by_step_14` |
| gate_reason | 五个SOP问题、首版无迁移事实、演进状态、普通兼容窗口、五类migration、retirement、12 affected与formal草稿闭合 |
| 新上游blocker | `none` |
| inherited affected | 12项保持开放；迁移不能作为关闭手段 |
| implementation readiness | `blocked`；migration plan是future contract，真实产品/scan/script/evidence不存在 |
| next_allowed_action | `continue_to_current_step_14_under_continuous_M4_authorization` |

### 1.1 执行记录

| 动作 | 结论 | 状态 |
|---|---|---|
| 读取SOP/规范 | 五问、六列表、无迁移也须说明 | done |
| 读取Step05/07 | current canonical field无alias，old key均historical | done |
| 读取Step10/11 | migration/retirement是blocked class，有cold lifecycle与failure gate | done |
| 读取formal `03` §12/§13 | digest dual-read/switch-write、old binding pinning、snapshot/history规则 | done |
| 后置审计旧Step13/formal §13 | 旧profile/product/schema全部隔离 | done |
| 建立migration/evolution矩阵 | 普通field与durable interpretation分层 | done |
| affected与truthfulness复核 | `0/12`关闭，无脚本/结果/commit伪造 | done |

## 2. SOP五问回答

### 2.1 是否存在旧配置需要迁移？

当前没有已发布、已实现、已部署或被durable material引用的current `04` schema，因此**当前无已生效配置迁移项**。
旧formal `04`、README和pre-M3 Step中的`observability.*` key、`local-dev/ci-test/operations-replay` profile、CLI
precedence、report path、archive/signal字段、fake adapter mode和历史数值都不是published contract。它们被标记为
`historical_rejected`，不能获得alias、compatibility window或migration status。

这不表示未来没有migration。Formal `03`已经存在durable digest、snapshot、outbox、intent、plan、report和historical
binding解释规则；一旦current schema实现并产生durable material，相关变化必须走本Step定义的migration class。

### 2.2 新配置如何引入？

| Gate | 新配置必须提供 | 不满足时 |
|---|---|---|
| motivation/owner | current requirement/architecture/DDD/operations issue与唯一owner | 不进入schema |
| code impact | 是否新增field/enum/reader/builder/error/port/state/store/flow | 有影响先回写formal `03` |
| field contract | canonical path、type、default-or-required、source、scope、activation、sensitivity、failure、consumer | design blocked |
| compatibility | additive/rename/semantic/migration class与old reader requirement | 不允许实现猜测 |
| downstream | `05/06/07/09`测试、gate、boundary、runbook输入 | 不允许release |
| truth/security | no raw body/source write/evidence fabrication/non-core dependency | violation VETO，不能risk accept |

新字段默认没有alias，current loader只接受一个canonical name。Future compatibility只有在正式文档明确window、winner、
identity和ambiguity行为后才生效。

### 2.3 旧配置如何废弃？

已发布field的废弃需先标`deprecated_read_only`：new candidate仍可读取old name，但normalized candidate只形成canonical
semantic field；operator signal只输出safe field ID和deprecation category，不输出raw value/path。若old+new同时出现，默认
reject ambiguous，而非new-wins/old-wins；只有formal migration明确单一winner且identity/provenance可证明时才可例外。

Deprecated不能改变requiredness、safety、truth、state、UoW或history interpretation。Migration window期间必须保留old reader、
negative ambiguity tests、release note和operations inventory。

### 2.4 是否需要兼容窗口？

| Change class | Compatibility window | Why |
|---|---|---|
| 首版historical key/profile | none | 从未成为current published contract |
| additive optional field with explicit safe default | release-bounded, only after formal approval | old candidate可能缺field；identity/version需稳定 |
| required field addition | mandatory staged window | old candidate需migrate before enforcement |
| canonical rename | mandatory dual-name read window or explicit offline migration | 避免silent unknown，同时防双名歧义 |
| enum/token semantic change | design-change + versioned reader | string alias会改变wire/identity语义 |
| digest/schema/store/binding change | obligation-based, not time-only | durable material按old semantics恢复 |
| security redline removal/weakening | forbidden | 不能用window允许unsafe behavior |

Window结束不能只看日期；必须同时满足部署inventory、durable obligation、reader coverage、rollback/restore和真实测试/验收。

### 2.5 何时允许移除旧配置？

旧field/reader/binding/digest/schema只有在以下所有条件为真时可移除：

1. Formal `04`已标deprecated/removed版本和window。
2. Current `05`有old/new/ambiguous/rollback/history tests且真实运行通过。
3. Current `06`对应gate有真实evidence和authorized verdict。
4. Current `07`有独立migration/retirement boundary、rollback/restore与post-check。
5. Deployment inventory证明active candidate不再使用old form。
6. Durable obligation scan对reservation/result/outbox/plan/intent/report/replay/manual/retention为零，或reader仍保留。
7. Prior candidate rollback不再需要old reader，或rollback被正式声明不可用并有forward-repair disposition。
8. Removal不会改变source truth、protocol/state/UoW/no-write或引入non-core dependency。

## 3. Historical material与current identity

| Historical item | Current status | Loader behavior | Migration treatment |
|---|---|---|---|
| old `observability.*` names | `historical_rejected` | unknown/reject | no alias/window |
| old four profiles | `historical_rejected` | enum invalid | no mapping tocurrent class |
| CLI/config center/admin source | `unsupported` | reject | design change required |
| old report/evidence roots | `forbidden_not_a_field` | unknown/reject | cannot migrate toreal evidence identity |
| old archive/signal/log config | `no_current_owner` | unknown/reject | reopen formal design ifneeded |
| old fake/controlled aggregate mode | `historical_rejected` | invalid | per-family formal mode only |
| old numeric defaults | `historical_candidate_only` | no value source | cannot become default/window |

Current v1 config identity is the effective typed semantic candidate, not file path/name/time/run/evidence.Compatibility reader
normalizes accepted old representation intocurrent typed semantics beforeidentity；raw name itself不得进入business state或Job snapshot。

## 4. 演进状态模型

| State | Meaning | Loader / runtime behavior | Allowed transition |
|---|---|---|---|
| `proposed` | 尚未进入formal schema | reject/unknown | -> introduced or rejected after design |
| `introduced` | 正式存在但尚未成为required default path | explicit opt-in/conditional validation | -> active after gates |
| `active` | canonical current contract | normal strict parse/validate | -> deprecated only byformal change |
| `deprecated_read_only` | 仅为compatibility读取old representation | normalize + safe warning；no new emission | -> removed afterall gates |
| `migration_blocked` | durable/history/physical precondition未闭合 | do not switch/retire | -> active/deprecated afterclosure |
| `rejected` | 明确不支持或historical | validation reject | no runtime transition;new proposal required |
| `removed` | window完成且reader合法移除 | unknown/removed reject | no rollback withoutnew design |
| `design_change_required` | 影响formal `03`或redline | no schema reservation | -> proposed only afterupstream writeback |

这些是document lifecycle states，不是Rust enum、business state、metric label或runtime API。

## 5. Current配置迁移与废弃表

| 旧配置 | 新配置 | 状态 | 兼容窗口 | 迁移策略 | 移除条件 |
|---|---|---|---|---|---|
| old formal/README `observability.*` | current Step07 project-local schema | historical_rejected | none | 不迁移；current candidate必须按new schema显式创建 | immediate reject；不建alias |
| `local-dev/ci-test/integration-like/operations-replay` | `LocalTest/IntegrationLike/RuntimeLike` | historical_rejected | none | deployment显式选择formal class；test/replay作为用途lane | old token永不接受 |
| CLI/config-center/admin override | current DECL/JSON/allowlisted ENV | unsupported | none | 若需要则回写reader/priority/lifecycle | current始终reject |
| report/artifact/evidence path config | no current field | forbidden | none | 真实execution assets由`05~07`定义，不由config迁移 | old field reject |
| aggregate fake/store/bus modes | per-family typed binding/mode/catalog | historical_rejected | none | 创建formal exact binding candidate | old token reject |
| current v1 canonical fields | same | active_first_baseline | n/a | 首版实现需exact match | future change followsbelow |

## 6. Future普通字段演进矩阵

| Evolution ID | Change | Required strategy | Compatibility behavior | Stop rule |
|---|---|---|---|---|
| `CFG-EVO-01` | additive optional field | explicit safe default + identity versioning + downstream tests | old candidate normalized withdeclared default | default无owner则blocked |
| `CFG-EVO-02` | additive required field | introduced optional window -> inventory migrate -> active required | old candidate accepted onlyduringwindow | no inventory/evidence => cannot enforce |
| `CFG-EVO-03` | canonical rename | versioned dual-name reader + ambiguity reject + canonical emission | one old or one new accepted；both reject default | no silent alias/last wins |
| `CFG-EVO-04` | field split/merge | explicit transform with losslessness proof | old semantic projection must beunique | implementation cannot infer |
| `CFG-EVO-05` | enum/token add | code owner addsfinite variant first | old reader unaffected；new token rejected byold binary | rolling compatibility required |
| `CFG-EVO-06` | enum/token rename/remove | versioned reader and durable occurrence scan | no case-fold/string alias | upstream protocol/type review |
| `CFG-EVO-07` | default/range change | classifysemantic change;new candidate only | old snapshot retainsold value | no SLO/provider default shortcut |
| `CFG-EVO-08` | source allowance change | updateStep05 precedence/identity/audit/tests | no hidden newreader | admin/hot source reopens`03` |
| `CFG-EVO-09` | sensitivity classification change | security review/no-output/rotation update | stricter classification mayrequiremigration | cannot downgrade toordinary silently |
| `CFG-EVO-10` | profile/mode change | updateformal enum/gates/lanes | no environment-name mapping | RuntimeLike safety unchanged |

## 7. Durable interpretation migration classes

### 7.1 Common sequence

```text
[design + physical capability approved]
  -> [old reader / old binding resolution remains available]
  -> [new reader / new binding introduced and validated]
  -> [dual-read or dual-resolution, write remains old]
  -> [inventory + durable obligation scan + recovery drill]
  -> [switch-write / switch-new-admission to new semantics]
  -> [old work continues exact old semantics]
  -> [zero-obligation + rollback/restore review]
  -> [retire old write path]
  -> [retire old reader / resolver only after final gate]
```

At no point may implementation rewrite old digest、snapshot、outbox payload、intent/token、plan、result、report或source truth
to make the migration appear complete.

### 7.2 Migration matrix

| Migration ID | Subject | Dual phase | Switch condition | Old obligation | Retirement condition |
|---|---|---|---|---|---|
| `CFG-MIG-01` | digest profile | dual-read old+new;write-old initially | canonical corpus + all writer/reader tests + formal approval | reservation/result/outbox/plan/intent/report digest refs | zero old refs orold reader retained |
| `CFG-MIG-02` | required schema revision | compatible reader/adapter descriptor | DDL/schema capability + backup/restore + app compatibility | all rows/snapshots/cursors/history usingold revision | inventory zero/compatible reader androllback disposition |
| `CFG-MIG-03` | store destination/product | dual-write is not assumed;explicit migration/cutover design required | copy/verify/atomic cutover/recovery plan in`07` | everylogical store/UoW/index/outbox/claim/history relation | post-cutover consistency + old restore/retention gate |
| `CFG-MIG-04` | external effect binding/destination | dual-resolution byexact binding ref;new work pinsnew ref | destination/idempotency/probe capability approved | Pending/Failed/Unknown outbox and active intents/preparations/tokens | no active/ambiguous/replay/manual/retention obligations |
| `CFG-MIG-05` | credential rotation | same ref onlyifdestination+namespace unchanged and old token resolvable | new material validated, overlap proven | old in-flight/external probe/finalize | overlap obligations zero;material retired without ref rewrite |
| `CFG-MIG-06` | entry transport/schedule binding | old process drainsold registration;new process usesnew binding | exclusive host ownership and total registration | accepted callbacks/durable work underold generation | old admission closed/drained;durable history remains resolvable |

`CFG-MIG-03`不能假定generic dual-write，因为formal UoW/cursor/history/outbox语义可能无法跨产品原子保持。Physical
strategy必须由current `07`独立boundary或approved spike证明；能力不足则migration保持blocked，不改domain/application。

## 8. Deprecation window与ambiguity规则

| Scenario | Winner / normalization | Identity | Result |
|---|---|---|---|
| only canonical new name | parse new -> current typed field | current semantic identity | accept ifvalid |
| only approved deprecated old name duringwindow | parse old -> exact current typed field | same semantic versioned identity rules | accept + safe warning |
| old+new both present | none bydefault | no candidate identity | reject ambiguous |
| multiple old aliases | none | no identity | reject ambiguous |
| old representation lossy/ambiguous | none | no identity | migration_blocked/reject |
| old name afterwindow | none | no identity | removed/unknown reject |
| old field carriesraw secret/body | none regardlesswindow | no identity | security VETO |

Compatibility warning只能包含canonical field ID、deprecated category、window version和safe issue ref；不得含raw value、
path、env name、locator、secret、endpoint或full binding ref。

## 9. Historical obligation与retirement gate

| Obligation class | Scan subject | Nonzero disposition | Zero proof limitation |
|---|---|---|---|
| active config candidates | protected/approved/deployed candidate inventory | keep old reader/source mapping | one environment zero不代表global zero |
| idempotency/result | nonexpired reservation/result withold digest/schema | keep reader/store | retention expiry alone需确认no unresolved |
| outbox publication | Pending/Failed/Unknown/dead-letter recovery | keep exact binding/encoder/reader | Published count不覆盖corrupt/manual |
| Job plan/claim/report | nonterminal/replay/manual Job snapshots | keep config/digest/store/binding readers | terminal report存在不等于all items closed |
| external intent/preparation | active/ambiguous/probe/manual tokens | keep exact target/credential overlap | health available不等于obligation zero |
| rollback candidates | protected prior candidates eligible forrollback | keepold schema/source readers | rollback policy可声明no rollback但需authority |
| retention/legal hold | active technical/business guards | keep material/readers | time window不能overridehold |

Scan result必须由future authoritative inventory producer生成；本Step没有运行scan，也没有真实zero result。

## 10. Affected migration guard

| Affected ID | Migration risk | Guard before closure | Current状态 |
|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | 用migration schema反向创造canonical payload | no I05 migration/alias;slot remains off | open_upstream_internal |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | broad old/new producer aliases掩盖缺失binding | exact approved mapping only | open_upstream_internal |
| `R06.6-F2-H13-UPSTREAM` | replay migration生成H13 record/result | J06 remains Blocked/manual | open_controlled |
| `R06-F-AFFECT-UOW-01` | store migration破坏same-UoW/save order | physical plan must proveformal atomic semantics | inherited_affected |
| `S08-RECOVERY-CLASS-OWNER-01` | old/new error token alias改变retry class | typed owner mapping required;unknown fail closed | inherited_affected |
| `R07-EXTERNAL-PHASE-LINK-01` | new target断开old intent/result link | dual-resolution exact old binding | inherited_affected |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | cutover重置token/budget/accounting | old attempt frozen;probe/manual | inherited_affected |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | migration后从current truth重建missing event | forbidden;old snapshot remains immutable | inherited_affected |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | cutover把unknown当old failure/new retry | probe old result;no ack success | inherited_affected |
| `S08-JOB-REPORT-REF-OWNER-01` | migration重新mint report ref | owner-backed relation only;no rewrite | inherited_affected |
| `S08-M1-SECONDARY-TYPE-OWNER-01` | temporary compatibility alias成为second owner | canonical owner + versioned reader only | inherited_affected |
| `03-RPR-S09-PER-FLOW` | generic migration suite替代affected flow audit | each touched flow/boundary re-audited | inherited_affected |

Migration关闭`0/12`。任何migration evidence也不能替代上游schema/owner或implementation boundary audit。

## 11. Cross-migration audit

| Audit item | Verdict | Note |
|---|---|---|
| current published migration item exists | no | first current baseline not implemented/deployed |
| historical old keys receive aliases | no | reject;not current contract |
| future field addition/removal haswindow | pass | class-specific,not date-only |
| alias ambiguity deterministic | pass | old+new default reject |
| digest order dual-read before switch-write | pass | formal §13 preserved |
| store migration assumes dual-write | no | explicit physical/UoW proof required |
| external old binding current fallback | no | exact dual-resolution untilzero obligations |
| credential rotation rewritesbinding | no | strict same-ref condition ornew ref |
| retirement relies only ontime/health | no | authoritative obligation scan required |
| rollback candidate can loseold reader early | no | rollback disposition included inretire gate |
| truth/state/UoW can be migration-adjusted | no | formal invariants fixed |
| 12 affected routed | pass_with_open | exact 12, closed 0 |
| real script/scan/evidence fabricated | no | all future/planned/nonexistent |

## 12. 对详细设计的影响判定

| Conclusion | `03` impact | Status / action |
|---|---|---|
| current first baseline and historical rejection | no | config document policy only |
| digest dual-read/switch-write/retire | no | already formal §13;preserved |
| old external binding resolution | no | already formal §12/§13;preserved |
| future ordinary field add/rename/remove | maybe/yes iftyped schema changes | return DDD Step06/14/17/19 andformal §5/§6/§13 |
| store/schema physical migration | no new current code contract yet | `07` plan/spike;backwrite ifnewport/store/state needed |
| remote source/hot reload/admin override | yes | must reopenreader/error/lifecycle/concurrency |
| generic durable migration ledger inL4 | yes | forbidden to invent;return object/store/UoW design |

Current没有待回写的已采用结论；future trigger不能在Step15写成current implemented capability。

## 13. Formal `04` §13回填草稿

```markdown
## 13. 配置迁移、废弃与演进

Current `04`是首个正式配置基线，尚无已发布/已部署current schema，因此当前无生效迁移项。旧formal、README和
pre-M3 key/profile均为historical rejected，不提供alias或兼容窗口。

未来普通字段演进必须明确canonical representation、compatibility window、ambiguity、identity、tests和removal gate。
Digest、schema、store与external binding属于durable migration class：先保留old reader/resolution，再引入new reader，
通过inventory/recovery验证后switch-write/new admission；只有active/ambiguous/replay/manual/retention/rollback obligation
满足退役条件后，才可移除old reader或binding。迁移不得重写old snapshot/outbox/intent/token/plan/result/report或source truth。

<Step15装配current/no-migration表、future evolution与durable migration matrix>
```

## 14. Downstream handoff与open material

| Downstream | Required consumption | Prohibited claim |
|---|---|---|
| Step14 | migration risks/questions/`03` trigger全部汇总 | future plan已关闭 |
| current `05` | compatibility/ambiguity/digest/history/rotation tests | tests run/pass |
| current `06` | premature removal/current fallback/rewrite VETO | acceptance verdict/signoff |
| current `07` | physical migration/spike/inventory/rollback/retire boundaries | implementation commit/scan zero |
| operations | inventory/cutover/restore/retire runbook | design matrix isreal execution |

| Open item | Status | Blocks |
|---|---|---|
| selected physical store/schema migration mechanism | not_selected | durable store migration boundary |
| authoritative obligation inventory/scan | not_implemented | reader/binding retirement |
| target/provider/credential overlap capability | not_established | external/rotation production boundary |
| migration scripts/artifacts/evidence/reviewer | nonexistent/not_run | migration acceptance/release |

## 15. 自检与门禁

| Check | Status |
|---|---|
| SOP五问 | pass |
| required六列表 | pass |
| current no-migration fact | explicit |
| historical keys rejected/no alias | pass |
| ordinary evolution classes | 10 |
| durable migration classes | 6 |
| obligation categories | 7 |
| affected propagation | 12 exact, closed 0 |
| `03` impact | no current writeback;future triggers explicit |
| formal `04` | unmodified |
| scripts/scan/commit/run/evidence | none fabricated |

| Gate | Current status | Next action |
|---|---|---|
| input gate | pass | standards/current Step05/07/10/11/formal `03` read |
| content gate | `pass_consumed_by_step_14` | evolution/window/migration/retirement complete |
| upstream blocker | none_new | affected retained |
| implementation readiness | blocked | physical mechanisms/evidence absent |
| next_allowed_action | `continue_to_current_step_14_under_continuous_M4_authorization` | 汇总risk/open/`03` impact |
