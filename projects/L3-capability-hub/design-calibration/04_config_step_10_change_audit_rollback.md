# L3-capability-hub 04 配置设计 Step 10: 配置变更、审计与回滚

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 10
> 对应书写规范: `standards/document/配置设计书写规范.md` §5.10
> 回填章节: `projects/L3-capability-hub/04-配置设计.md` §10
> 创建日期: 2026-07-25
> 当前模式: full-restart / continuous execution
> 状态: `04_step_10_completed_step_11_pending_continuous_execution`
> 正式文档状态: 本 Step 不创建或修改正式 `04-配置设计.md`;正式装配留 Step 15

---

## 1. Step 开工确认与批次计划

| 项目 | 内容 |
|---|---|
| 当前文档 | `04-配置设计.md` |
| 当前 Step | Step 10 `定义配置变更、审计与回滚` |
| 上游 Step gate | Step 9 已关闭 single strict source、V0~V8 validation、18/18 modules、27/27 canonical rows、whole-graph cross-field、provider resolution、Stage 0~7、three entry barriers、owned-prefix disposal 和 startup-only lifetime |
| 直接上游 | `04_config_step_07_config_items.md`、`04_config_step_08_sensitive_secrets.md`、`04_config_step_09_loading_validation_activation.md`、正式 `03-详细设计.md` §13~§14、`03_ddd_step_15_observability_audit.md` |
| 本步目标 | 定义配置 artifact 如何提案、评审、验证、restart 生效、审计和回滚，并按配置族闭合权限、敏感性、失败与回指 |
| 本步非目标 | 不定义具体工单/审批/审计产品；不引入 config center、admin override、hot reload、live mutation、secret provider API；不新增 Rust object/Port/DTO/error/flow/state |
| 当前 blocker | `0`；具体 release control plane、provider 和部署切换设施未选定，但不阻塞产品中立 change contract |

本 Step 分批写入，完成一批后保留停审记录；每批只承接已完成 Step 7~9 的配置语义，不反向创造新的配置项或代码契约。

| 批次 | 写入内容 | 完成门禁 | 状态 |
|---|---|---|---|
| `10.0` | 开工输入、变更边界、actor、review level、artifact identity、audit safe-field contract | startup-only、无 live override、无 raw secret、变更主体可追溯 | completed_stop_review |
| `10.1` | 18 模块/27 rows 配置族变更分类与逐族变更表 | 每类有发起方、评审、生效、审计、回滚、Step 7/8/9/11 回指 | completed_stop_review |
| `10.2` | 敏感 ref/TLS/fixture/route/provider 轮换、审计 ownership 与禁止输出 | provider-read 与 config-change 分离；secret/body/full ref=0 | completed_stop_review |
| `10.3` | proposal -> validation -> restart activation -> cutover/rollback 状态链和回滚矩阵 | 新进程完整通过 V0~V8/Stage 0~7/barrier；旧 artifact 不被覆盖 | completed_stop_review |
| `10.4` | 变更停审、跨变更审计、03 impact、回填草稿、待确认和完成 gate | high-risk review/audit/rollback 全闭；03 回写=0；允许 Step 11 | completed_stop_review |

## 2. 本步目标、输出与边界

### 2.1 必须闭合

1. 哪些配置族允许变更，谁可以提出、评审、执行和回滚。
2. 变更风险等级与评审要求，尤其是 profile、authority、external Port、route、TLS、credential、diagnostic 和 fixture。
3. 变更 artifact 的身份、基线、候选、完整性、scope、profile、entry 和审计关联。
4. 变更只通过新进程 startup validation/assembly/activation 生效的顺序；禁止在线局部替换。
5. 变更失败、activation 失败、provider rotation 失败、cutover 不确定和效果异常的回滚行为。
6. 审计字段的最小安全集合、字段来源、owner、保留边界和禁止材料。
7. 每个配置族对 Step 7 配置项、Step 8 敏感性、Step 9 生效、未来 Step 11 失效策略的回指。

### 2.2 变更与配置的边界

| 类别 | 是否属于本 Step 的配置变更 | 处理口径 |
|---|---|---|
| 18 个 JSON 顶层模块、bounded env leaf、selected file | 是 | 形成新的完整 startup artifact；不能局部热改 |
| provider-side secret material 原地轮换 | 不是 Hub JSON 内容变更，但影响配置 activation | 由 provider owner 审计；Hub 更新 ref/version 后完整 restart |
| API caller page/input、Worker delivery、Jobs request bytes | 否 | 属于请求/传输输入，不是配置变更；不能覆盖 frozen root |
| entry-local override、CLI `--set`、JSON pointer patch | 否 | unsupported；拒绝，不建立第二配置语言 |
| runtime/tools execution、marketplace listing、governance approval、method body | 否 | forbidden responsibility；回对应 owner，不得配置化 |
| truth/state/transaction/idempotency/capture/visibility invariant | 否 | design invariant；需要受控 reopen，不是 config change |
| config center/admin/hot reload/live graph swap | 否（当前 P0） | rejected/controlled reopen；Step 9 没有相应 reader、Port、rollback contract |

## 3. 本步输入与读取结论

| 输入 | 本步采用结论 | 本步不继承 |
|---|---|---|
| Step 7 config catalog | 18 modules、27/27 rows、file-only registries、21 bounded env leaves、explicit required、exact bounds | 旧配置 aliases、implicit defaults、generic settings |
| Step 8 sensitive/secrets | public/internal/sensitive/secret 四级、ref-only、provider-to-constructor、restart rotation、禁止输出 | raw secret、full locator、specific KMS/Vault product |
| Step 9 load/activation | one strict document、constants < JSON < env、V0~V8、Stage 0~7、three barriers、no hot reload | partial in-place patch、last-known-good inside same process、entry reread |
| formal `03` §13 | immutable root、single authority、27/9/6/10 inventories、existing error/audit boundaries | 新 change/audit/rollback Rust object或Port |
| formal `03` §14 / DDD Step 15 | Off/Redacted、value-free diagnostic、observer non-cancelling、audit owner separation | audit backend、真实 event/evidence/run |
| L1 governance Step 10 | 参考 actor/review/change/audit/rollback 表格粒度 | governance approval/outbox/retention 领域事实 |

## 4. SOP 问题回答

| SOP 问题 | L3-capability-hub 裁决 |
|---|---|
| 1. 哪些配置可以由谁变更？ | 只有 release/config control plane 中被授权的 operator、release automation、security/config owner、test harness 或 deployment provider owner 可提出/执行其职责范围内的 artifact；application、domain、contracts、API handler、Worker consumer 和 Jobs handler 不直接读取或变更配置。 |
| 2. 哪些变更需要评审？ | 所有 startup artifact 都需至少完成自动 schema/profile validation；authority、external Port、route、endpoint、credential/TLS、profile、diagnostic mode、fixture reachability和任何 widening 变更需 medium/high review。raw secret、redaction 放松、Deployment fake、hot reload、truth override 直接 reject 或走设计 reopen。 |
| 3. 变更如何生效？ | 生成完整候选 artifact，运行 Step 9 的 strict parse、V0~V8、Stage 0~7 和 selected-entry barrier；只有新进程完整通过后，外部 release owner 才能执行切换。当前进程的 frozen root 不改变。 |
| 4. 变更如何记录审计？ | 记录 change/actor/reason/review refs、baseline/candidate safe digest、profile/entry、changed path classes、validation/activation/cutover result、rollback ref 和 safe diagnostic issue refs。不得记录 raw document、secret、full sensitive ref、endpoint、provider response或body。 |
| 5. 失败或效果异常如何回滚？ | 候选校验/assembly/barrier 失败时不切换，保留当前已批准 artifact；若切换后由 owner 判定效果异常，恢复 previous validated artifact 并启动新进程。禁止在运行进程内局部回滚、改写 Hub truth、重放 Jobs 或伪造成功。 |
| 6. 是否回指 Step 7/8/9/11？ | 是。本 Step 的逐族变更矩阵分别给出 catalog row/module、sensitivity/secret rule、activation kind和 Step 11 failure/degradation handoff；Step 11 尚未写入最终失效矩阵，不在本 Step伪造其测试切口。 |
| 7. 每类变更是否停审？ | 按 root/profile、local authority、technical policy/entry、external/source/route、material/security、diagnostics 六组停审；每组检查权限、review、audit、activation、rollback、failure和敏感输出。 |
| 8. 是否存在高风险无评审/无审计/无回滚？ | 本 Step completion gate 要求 `0`。若变更 package 缺 review ref、safe baseline/candidate identity、validation result 或 valid rollback target，则不得进入 activation。 |

## 5. 当前问题诊断

| 既有缺口/风险 | 影响 | 本步修正 |
|---|---|---|
| Step 7 有配置项但没有 change authority | 实现/运维可能直接改 JSON 或 env | 以完整 artifact 和授权 actor 分离 proposal/review/apply |
| Step 8 只有 provider 轮换原则 | 无法审计 ref/version 更新与失败回退 | 定义 provider-read 与 config-change 两条 audit lane，轮换以 ref/version + restart 为单位 |
| Step 9 只定义 startup activation | 变更失败后的 cutover/rollback 不清晰 | 定义新进程验证、barrier、保留旧 artifact、失败不切换、异常重启回旧 artifact |
| 记录完整 diff 便于排障 | 会泄露敏感拓扑/ref/secret | 只记录 canonical redacted projection digest、path class、safe issue ref |
| 把 Jobs 请求当成配置 override | 破坏 Jobs frozen journal/request boundary | 明确 request/entry input 不属于 config change，不能覆盖 root |
| 将“回滚”理解为修复业务 truth | 可能改写 immutable record/report/capture | rollback 只替换未来进程的 config artifact，不写 Hub truth |
| 具体工单/审批产品尚未选定 | 文档可能伪造平台字段或审批事实 | 使用 product-neutral refs，未来由 release/operations boundary 绑定 |

## 6. 改动前后对比

| 维度 | Step 10 前 | Step 10 收口 |
|---|---|---|
| 变更主体 | 来源与加载规则已定义，权限未定义 | actor、scope、review level 和执行 owner 分离 |
| 变更单位 | 可能按单 leaf 局部修改 | startup 以完整 artifact 为原子单位；敏感 pair/route group 一起变更 |
| 生效 | startup-only，但无 change cutover | 新进程全量验证/装配/barrier 后由外部 owner 切换 |
| 审计 | safe metadata 原则分散 | 固定 baseline/candidate safe digest、change/actor/review/reason/activation/rollback refs |
| 回滚 | restart-only 但 target 不明 | 只允许 previous validated/approved artifact；invalid candidate 不可回滚目标 |
| secret rotation | provider-to-constructor、restart | provider-read audit 与 config-change audit 分离，pair 原子更新 |
| hot reload | unsupported | 明确任何 live reload/admin override 请求拒绝或 controlled reopen |
| 03 影响 | 可能误加 change/audit object | 不新增代码契约；未来 live mutation 触发受控回开 |

## 7. 配置设计取舍

| 议题 | 候选 | 裁决 |
|---|---|---|
| 变更单位 | 任意 leaf patch；完整 canonical artifact | 完整 artifact。保证 18 modules、ref graph、profile和entry一致性一次校验 |
| 生效 | 进程内热替换；新进程 restart | 新进程 restart。Step 9无atomic graph swap/watcher/rollback API |
| 审计 diff | raw/full diff；safe digest + path class | safe digest + path class。敏感值和拓扑不进入记录 |
| baseline | 当前文件内容；previous validated/approved identity | previous validated/approved identity。当前文件可能未通过校验，不可作为回滚目标 |
| 高风险审批 | 具体审批平台；product-neutral review refs | product-neutral refs。具体平台留 07/09 implementation/operations boundary |
| provider rotation | raw material copy；new ref/version + restart | new ref/version + restart。Hub不接触或记录 material body |
| route/credential pair | 独立 leaf；atomic group | atomic group。避免半套 TLS、半组 outbound route 暴露 |
| abnormal effect | 运行时自动改 truth；外部 owner判定后重启 | 外部 owner判定并以新 artifact restart；Hub不创建 rollback business state |

## 8. 结构化中间产物: change identity、actor 与审计字段

### 8.1 变更 artifact 身份

每次 startup 配置变更都以一个完整、不可变、可重新读取的 artifact 作为提案单位。以下是控制面记录的语义字段，不是 Capability Hub 的 Rust struct、持久化对象或业务事件。

| 语义字段 | 必须表达 | 允许内容 | 禁止内容 |
|---|---|---|---|
| `change_ref` | 一次提案/执行关联 | 外部控制面 opaque ref | 随机假造的已存在 ID、Hub business ID |
| `baseline_ref` | 比较起点 | previous validated/approved artifact ref | 未校验文件、当前进程内 partial root |
| `baseline_safe_digest` | 起点完整性 | canonical redacted projection digest | raw secret/full ref/secret-derived hash |
| `candidate_ref` | 候选 artifact | 外部 artifact ref | 未生成的实现 commit/evidence alias |
| `candidate_safe_digest` | 候选完整性 | canonical redacted projection digest | raw document echo、secret hash |
| `scope` | 影响范围 | profile、selected entry、path classes、binding families | raw path member exposing topology、business truth scope |
| `reason_ref` | 变更原因 | opaque reason ref | 原始 incident/body/secret |
| `actor_ref` | 发起/执行主体 | opaque actor ref | credential/userinfo、whole actor context |
| `review_refs` | 评审关联 | zero or more refs according risk level | fabricated approval/signature |
| `validation_result` | V0~V8 outcome | `not_run / rejected / passed` + safe issue refs | raw parser/provider text、real readiness claim |
| `activation_result` | Stage/barrier outcome | `not_started / failed / ready_for_cutover / cutover_unknown` | claim of actual deployment success |
| `rollback_ref` | rollback association | opaque ref when rollback is initiated | nonexistent rollback evidence |
| `rollback_result` | rollback state | `not_applicable / not_started / rejected / prepared / completed_by_owner` | claim unless actually produced by owner |

`safe_digest` 只对 canonical redacted projection计算：secret material字段被固定省略/marker替换，敏感 ref 是否可纳入 digest 由明确 profile allowlist决定；禁止对 raw token/password/locator/version/private key/certificate body或provider response做 hash 后输出。当前设计不生成任何实际 ref、digest、run、review、rollback 或签名。

### 8.2 Actor 与职责边界

| Actor 类别 | 可发起/执行 | 不可执行 | 最低审计字段 |
|---|---|---|---|
| `operator_ref` | 提交已授权 startup artifact、触发 validation/restart/rollback 请求 | 绕过 validator、修改 domain truth、注入 raw secret、单独批准 critical change | actor/change/reason ref、scope、result |
| `release_automation_ref` | 按已评审 artifact 执行静态检查、启动新进程、记录 activation outcome | 自动批准 high/critical、忽略 failed barrier、替换 baseline | release/change/candidate digest、validation result |
| `security_config_owner_ref` | 评审 credential/TLS/redaction/secret boundary 变更 | 读取或写入 Hub business truth、把 raw material放入 audit | actor/review ref、kind/path class、outcome |
| `provider_owner_ref` | provider-side material read/rotation、提供安全结果分类 | 把 provider response/body写入 Hub config/audit、改变 Port family | provider-side session/locator-safe digest、kind、result class |
| `test_harness_ref` | Local/Integration fixture、deterministic clock/id artifact change | 让 fixture进入 Deployment、伪造 evidence/signoff | test/profile/fixture-safe digest、validation result |
| `operations_owner_ref` | 记录切换/保留/回退执行结果（具体产品未选） | 在运行中局部 patch graph、改写 Hub truth | change/candidate/baseline/activation/rollback outcome |
| `design_owner_ref` | 评审触及设计红线的 controlled reopen | 把设计变更伪装成普通 config artifact | design change/review ref；不宣称运行生效 |

Application/domain/contracts/API/Worker/Jobs 不是 config mutation owner。entry caller 只能提供协议规定的 request bytes/selector，不得成为 startup config writer。

### 8.3 Review level

| Level | 典型配置族 | 最低要求 | 不能采用的捷径 |
|---|---|---|---|
| `low` | 已在 bounds 内的 timeout、page、batch、parallelism 收窄；`Redacted -> Off` 的观测收窄 | 自动完整 validation + actor/reason + safe digest；release owner可执行 | 不得放宽 bounds、引入新 alias或改变 entry/profile |
| `medium` | Local/Integration profile、deterministic fixture、clock/id branch、explicit Disabled、selected entry/policy ref、`Off -> Redacted` | 至少一名独立 review ref + complete validation + rollback target；观测扩展需观测/安全 owner review | 不得把 fake带入 Deployment、将 Missing转Disabled或放宽 Redacted allowlist |
| `high` | local durable store/transport、9 external Port adapter、6 feed/actor、10 route、endpoint、TLS/credential ref、profile widening | owner review + security/dependency review（按影响）+ rollback plan + activation audit | 不得 partial group、auto-discovery、configured-to-fake fallback |
| `critical` | raw secret、redaction relaxation、Deployment fake、truth/state override、hot reload/admin override、codec/digest change、new Port/error/field | 普通 config change 直接拒绝；必须 controlled design reopen | 不得以 review ref或flag绕过 00~03 |

### 8.4 变更 package 完整性门禁

| Gate | 必须存在 | 缺失结果 |
|---|---|---|
| identity | change_ref、candidate_ref、candidate safe digest | reject before validation |
| baseline | previous validated/approved artifact ref + safe digest | reject;不能从任意 current file rollback |
| scope | profile、entry、changed path classes、affected binding families | reject;不能用全局 wildcard代替 |
| source | selected file/env selector lane，且内容仍遵守 Step 5 priority | reject;不能新增 source lane |
| review | required review refs for level | reject;不能由执行者自审 high/critical |
| integrity | complete 18-module document and canonical redacted digest | reject;不能提交 leaf patch或partial document |
| validation | V0~V8 deterministic result and safe issue refs | no activation/cutover |
| activation | Stage 0~7 and selected entry barrier result | no cutover; retain baseline |
| rollback | valid previous artifact and owner/action reference | high-risk package cannot activate |
| sensitivity | no raw secret/body/full sensitive ref in package/audit | security rejection; no redact-and-continue |

## 9. Batch 10.0 停审记录

| Gate | Result |
|---|---|
| change subject restricted to existing config surface | pass; 18 modules/27 rows only |
| startup-only/no live mutation | pass; no reload/admin/config-center lane |
| actor/reviewer/executor separated | pass |
| high-risk and critical classification | pass |
| baseline/candidate identity and rollback target | pass; previous validated/approved only |
| audit safe field contract | pass; raw config/secret/full ref/body=`0` |
| provider-read/config-change audit ownership | pass; separated |
| new Rust declaration/object/Port/error | `0` |
| formal 04 write | `0` |

Batch `10.0` is closed. The next batch may expand the configuration-family change matrix, but may not add a live update path or a new audit persistence owner.

## 10. 配置变更分类规则

### 10.1 Direction-sensitive review

同一字段的风险取决于方向，不能只按 path 固定一个等级。

| Direction | 默认等级变化 | 例子 | 必须额外证明 |
|---|---|---|---|
| safety/capacity narrowing | low 或 medium | Redacted -> Off、减小 page/batch/parallelism、Configured -> Disabled in Local | 不破坏 required local graph；availability impact 已评审 |
| exposure/capacity widening | 至少 medium | Off -> Redacted、增大 timeout/page/batch/parallelism | 仍在 bounds；资源/泄露/非取消语义不变 |
| family/authority/topology change | high | store/adapter/feed/route/endpoint/credential/TLS ref | exact family、rollback target、dependency/security owner review |
| environment promotion | high | Local/Integration artifact 改为 Deployment | durable/system/fake=0/authenticated TLS/complete graph |
| schema/contract/invariant change | critical/reject | schema v2、codec/hash、new Port/source/route、raw/full diagnostics | controlled reopen 00~04；普通 change package不能承载 |

Review level takes the maximum across all changed paths and directions. One low-risk numeric leaf cannot lower a package that also changes a credential, route or profile. An artifact with an unclassified path is rejected rather than assigned `low`.

### 10.2 Change scope classes

| Scope class | Modules / rows | Default level | Atomic unit | Step 11 handoff |
|---|---|---|---|---|
| root identity | `runtime`; rows 1~3 | medium/high/critical by field | complete artifact + selected entry/policy section | missing/mismatch/unsupported schema fail-fast |
| local authority | `localPersistence`, material refs; row 4 | high | binding + selected store/transport/TLS/credential closure | authority/constructor unavailable blocks activation |
| technical primitives | `clock/idGenerator/compatibility`; rows 6~7 | medium or critical | clock and id independent; compatibility whole pair | fixture/profile mismatch fail-fast |
| technical policy | `technicalPolicies`; rows 10,14,21~26 | low/medium | whole selected policy object in complete artifact | invalid/deadline/retry relation fail-fast |
| entry parameters | `entries`; rows 8~17,19~22 | low/medium/high by entry change | selected entry section + policy projections | mismatch/oversize limits handled by exact phase |
| external Port graph | `externalPorts/configuredAdapters`; row 5 | medium/high | all 9 slots total; changed configured family closure | configured unavailable blocks startup; explicit Disabled typed unavailable |
| Worker source graph | Worker entry + `inboundFeeds/trustedActors`; rows 15~17 | medium/high | all 6 slots total; feed+actor pair per configured source | no partial task activation |
| outbound graph | collaboration + `outboundRoutes`; row 18 | high | complete configured collaboration + 10 route closure | no partial route activation |
| physical material | `transports/endpoints/credentialRefs/tlsPolicies` | high | all affected endpoint/credential/TLS tuples in full graph | provider/TLS/constructor failure fail-closed |
| fixtures | `fixtures` + fake/deterministic branch refs | medium; Deployment critical reject | exact fixture + all consumers | wrong schema/kind/parity blocks |
| diagnostics | `diagnostics`; row 27 | low/medium; allowlist change critical | mode only | invalid mode blocks; observer failure non-cancelling |

## 11. 逐配置族变更表

### 11.1 Root、profile、entry 和 source selectors

| 变更类型 / Step 7 path | 发起方 | 评审要求 | 生效方式 | 安全审计最小字段 | 回滚方式 | Step 11 承接 |
|---|---|---|---|---|---|---|
| `runtime.schemaVersion` | design owner only | critical;普通变更拒绝；schema/migration受控 reopen | future version design only | design ref、old/new schema class；无 activation claim | 不适用；v1 process拒绝future artifact | unsupported version fail-fast |
| `runtime.profile` | operator/release automation | medium for Local<->Integration; high for any Deployment direction | complete artifact -> restart -> barrier -> cutover | old/new profile、entry、safe artifact digests、review/validation result | previous validated profile artifact + restart | profile mismatch/fake/TLS gate |
| `runtime.entry` | operator/release automation | high;必须与启动 binary/host purpose一致 | start selected entry process; no in-process switch | old/new entry、artifact digests、static coverage result | previous entry artifact/process restart | entry mismatch blocks before exposure |
| `runtime.entryConfigRef` | operator/release automation | medium if same kind; high if coupled entry change | restart | ref path class、entry kind、safe ref/artifact digest | previous complete artifact | missing/wrong kind/orphan fail-fast |
| `runtime.runtimePolicyConfigRef` | operator/release automation | medium; policy section同时review | restart | policy path class、safe artifact digest、validation result | previous complete artifact | missing/wrong family/deadline invalid |
| bootstrap config-file selector | operator/release automation | same maximum level as target artifact | selects one artifact for a new process | selector source class、candidate ref/digest、result | select previous approved artifact and restart | unreadable/conflict blocks startup |
| expected profile/entry assertions | release automation/operations owner | medium | sampled at startup; assertion only | expected/actual closed enums、result | restore previous assertion bundle or correct candidate | mismatch blocks, no override |
| one of 21 bounded env leaves | operator/release automation | inherit target leaf level; no alias | sampled once before V0~V8 | target path class、source lane、old/new safe effective digest | restore previous approved source bundle + restart | invalid present env blocks; no JSON fallback |

`runtime.entry` does not dynamically convert an API process into Worker or Jobs. The selected artifact, binary/host invocation and entry assertion must agree before Stage 0. A rollback to another entry is a fresh process activation, not a state transition inside Capability Hub.

### 11.2 Local authority、clock、ID 和 compatibility

| 变更类型 / path | 发起方 | 评审要求 | 生效方式 | 审计最小字段 | 回滚方式 | Step 11 承接 |
|---|---|---|---|---|---|---|
| `localPersistence.binding.kind` | operator/release automation | high; persistence owner review; Deployment must remain durable | complete restart; one new `A` | old/new kind、profile、artifact digest、constructor result class | previous binding artifact; old process/authority lifecycle由operations owner管理 | constructor/authority inability blocks; no fallback |
| durable `storeRef` / store member | operator/release automation | high; transaction/CAS/cursor/commit-resolution capability review | Stage 1 new authority then full barrier | store path class、constructor family、safe ref digest、validation/activation | previous complete store/transport/material closure + restart | Missing/wrong family/provider/constructor failure |
| store `constructorRef` | implementation/release owner | high; registered family/capability proof | restart | family、constructor registration class、safe artifact digest | previous registered constructor artifact | unregistered/semantic incapability blocks |
| `clock.kind/fixtureRef` | operator/test harness | medium Local/Integration; Deployment fake critical reject | restart | profile、kind、fixture class/digest、validation | previous clock branch artifact | wrong kind/schema/profile blocks |
| `idGenerator.kind/fixtureRef` | operator/test harness | medium Local/Integration; Deployment fake critical reject | restart | profile、kind、fixture class/digest、validation | previous ID branch artifact | wrong kind/schema/profile blocks |
| `compatibility.protocolCodec/digest` | design owner only | critical; fixed pair cannot be ordinary change | new schema/design/migration only | design baseline ref; no config activation claim | v1 artifact remains; alternate rejected | compatibility fail-fast |

Switching local persistence products cannot migrate Hub data by configuration. Data migration, schema deployment and old authority retirement are implementation/operations responsibilities and must be closed before activation; config review cannot claim they occurred.

### 11.3 Technical policy and entry parameters

| 变更类型 / path group | 发起方 | Review direction | 生效方式 | Audit safe fields | 回滚 | Step 11 handoff |
|---|---|---|---|---|---|---|
| API/Worker phase timeout | operator/release automation | narrowing low; widening medium | restart; selected entry receives frozen copy | policy class、old/new bounded value or value class、entry、validation | previous policy artifact | invalid/deadline relation blocks; timeout remains non-cancelling |
| Jobs run timeout | operator/release automation | medium both directions due drain window | restart | policy class、bounded old/new value、validation | previous policy artifact | invalid relation blocks; timeout cannot terminalize unknown work |
| external/local/commit timeout | operator/release automation | medium; persistence/external owner review when widening | restart | phase class、old/new bounded value、review/result | previous policy artifact | no mutation retry from observation timeout |
| `externalRetry` | operator/release automation | medium; attempts increase requires external-effect review | restart | policy kind、attempt/delay class、validation | previous policy artifact | only existing eligible typed failures; otherwise one attempt |
| `contentionRetry` | operator/release automation | medium; attempts increase requires transaction owner review | restart | policy kind、attempt/delay class、validation | previous policy artifact | rollback+reload+fresh UoW still mandatory |
| `commitObservationRetry` | operator/release automation | medium; transaction owner review | restart | observation policy class、validation | previous policy artifact | repeats observation only; unknown remains unknown |
| `jobsRunnerRetry` | operator/release automation | medium; application reentry owner review | restart | policy kind、attempt/delay class、validation | previous policy artifact | durable proof only; entry auto-retry=0 |
| internal scan/planning/fetch/page/body limits | operator/release automation | narrowing low unless availability impact; widening medium | restart | limit class、old/new bounded value、entry、validation | previous artifact | invalid/oversize/relation fail at exact gate |
| Worker parallelism | operator/release automation | medium both directions due resource/drain impact | restart | old/new value、profile、validation/activation | previous artifact | one global gate; no sixfold multiplication |
| selected `entries.<name>.kind` | coupled with runtime entry owner | high | fresh selected process | entry kind、safe artifact digest、coverage result | previous entry artifact | mismatch blocks |

Audit may record public numeric values where the release policy permits; a safer implementation may record value classes or safe digests. It must not reinterpret configured attempts as proof that a retry occurred or succeeded.

### 11.4 Nine external Port slots and configured adapters

| Change | Actor | Review | Activation | Safe audit | Rollback | Step 11 handoff |
|---|---|---|---|---|---|---|
| Configured <-> Disabled | operator/release automation | medium Local/Integration; high Deployment or business-critical dependency | complete restart; Disabled exact Port must construct | Port family、old/new branch、profile、reason/review | previous complete artifact; never infer branch from runtime failure | Disabled call returns NotConfigured; configured failure blocks activation |
| Configured <-> DeterministicFake | operator/test harness | medium Local/Integration; Deployment critical reject | restart with exact fixture parity | Port family、old/new branch、fixture safe digest、profile | previous artifact | fake wrong kind/parity blocks; no fallback |
| adapterRef change within Configured | operator/release automation | high; exact dependency owner review | Stage 4 constructor + full barrier | Port family、constructor family、old/new safe ref/artifact digest、result | previous adapter/material closure + restart | provider/constructor failure blocks whole graph |
| `configuredAdapters.<name>.family` | design/release owner | high if ref corrected within closed family; cross-family attempt reject | restart | consuming Port family、declared family、validation | previous exact-family artifact | mismatch fails V5 |
| `constructorRef` | implementation/release owner | high; typed/body-free/callable parity proof | restart | family、registration class、activation result | previous constructor artifact | unregistered/incapable blocks |
| transportRef | operator/release automation | high; topology/security review | restart | Port family、transport kind、safe ref digest | previous material graph | wrong kind/unavailable blocks |

All nine slots remain present in every artifact. A package cannot delete a slot, add a tenth Port, merge families or use a generic adapter. Runtime failure after activation cannot rewrite the selected branch; it is handled by the existing typed failure/outcome and Step 11 policy.

### 11.5 Worker six-source graph

| Change | Actor | Review | Activation | Safe audit | Rollback | Step 11 handoff |
|---|---|---|---|---|---|---|
| source Configured/Fake/Disabled branch | operator/release automation/test harness | medium Local/Integration; high Deployment; fake Deployment reject | restart; all enabled tasks parked before release | source family、branch、profile、validation/activation | previous six-slot artifact | Missing blocks; Disabled no runner; configured failure blocks all |
| feedRef / inboundFeed constructor/transport | operator/release automation | high; source/dependency owner review | Stage 6 driver construction, then all-task barrier | source family、feed/transport class、safe digests | previous feed/material closure | no topic-derived identity or partial source start |
| trustedActorRef / actorRefs / refinement | security/config owner + release owner | high | matcher construction then all-task barrier | source family、actor-set digest/count、refinement class、result | previous actor matcher artifact | no feed-as-authority; mismatch blocks |
| source family/kind/schema/logical event | design owner only | critical; ordinary config reject | controlled reopen of protocol/flow | design ref only | current closed six-source artifact remains | unknown/seventh source rejected |

Feed and trusted-actor changes are independent authorities but one configured source requires both to validate and construct. Rollback restores the entire source pair and full six-slot artifact, not only whichever half failed.

### 11.6 Collaboration and ten outbound routes

| Change | Actor | Review | Activation | Safe audit | Rollback | Step 11 handoff |
|---|---|---|---|---|---|---|
| collaboration branch Configured/Fake/Disabled | operator/release automation/test harness | high for Configured/Deployment; medium fake Local/Integration | Stage 4 complete adapter + exact 10 routes iff configured | branch、profile、10-route coverage result、safe artifact digest | previous complete collaboration artifact | configured route/constructor failure blocks; Disabled typed unavailable |
| one or more routeRefs/route members | operator/release automation | high; event transport owner review | validate all ten and construct complete route graph before barrier | changed route family set、route count=10、safe old/new graph digest | previous complete ten-route closure | no partial route publisher |
| route constructor/transport/endpoint/TLS/credential | operator/release automation + security where applicable | high | exact route constructor inside Stage 4 | event family、material classes、safe digests、activation result | previous complete material closure | no event identity mutation or transport fallback |
| event name/schema/routing key/source/payload/digest/capture/intent | design owner only | critical; config reject | controlled reopen Step 8/13/14 | design ref only | current immutable event contract | forbidden config surface |

Physical route changes cannot alter already persisted event snapshot/capture/stable intent or reconstruct payload from current truth. Config rollback affects future adapter construction only; it does not rewrite local continuity records or claim external delivery.

### 11.7 Physical material and fixtures

| Change | Actor | Review | Activation | Safe audit | Rollback | Step 11 handoff |
|---|---|---|---|---|---|---|
| transport kind/constructor | implementation/release owner | high; all consumer compatibility | restart in owning Stage | kind、consumer family set、registration/result class | previous transport closure | mismatch/unregistered blocks |
| endpoint kind/address | operator/release automation | high; topology/security review | restart; exact constructor scheme gate | endpoint kind、scheme category、address safe digest only | previous endpoint artifact | malformed/unavailable blocks; no clear output |
| credential kind/provider/locator/version refs | security/config + provider/release owners | high | provider resolution at exact constructor, then barrier | credential kind、provider class、ref/version safe digests、result class | previous resolvable credential tuple + restart | unavailable/expired/wrong kind fail-closed |
| TLS disabled/serverAuthenticated/mTLS branch | security/config + release owner | high | complete TLS tuple constructor then barrier | old/new mode、minimum version class、ref-set digest、validation | previous complete TLS tuple + restart | no downgrade; pair mismatch blocks |
| trust bundle | security/provider/release owners | high | stage new ref/version, resolve/construct, barrier | kind、old/new safe version/ref digest、result | previous resolvable trust ref | no one-sided activation |
| client cert/private key pair | security/provider/release owners | high; atomic pair | both refs staged and exact pair constructor passes | mTLS mode、pair-set digest、validation class | previous complete resolvable pair | one-sided/mismatch/expired blocks |
| fixture artifactRef/schema/kind | test harness + release owner | medium Local/Integration; Deployment reject | restart/test process through same constructor/path | profile、fixture kind/schema、safe artifact digest | previous fixture artifact | unreadable/wrong parity blocks; no evidence claim |

### 11.8 Diagnostics

| Change | Actor | Review | Activation | Safe audit | Rollback | Step 11 handoff |
|---|---|---|---|---|---|---|
| `Redacted -> Off` | operator/release automation | low; loss-of-signal impact recorded | restart | old/new mode、reason、validation | previous mode artifact | no business outcome change |
| `Off -> Redacted` | operator/release automation + observability/security reviewer | medium | restart; exact existing allowlist only | old/new mode、review ref、validation/activation | previous Off artifact | sink failure remains non-cancelling |
| raw/full/verbose or editable field allowlist | design owner only | critical; ordinary config reject | controlled reopen DDD Step 15/04 | rejected category/change ref only | no activation; baseline retained | forbidden leakage attempt fail-fast |
| observer backend/product | implementation/design boundary | high/controlled reopen depending type leakage | not selected in this Step | implementation review ref only, no readiness claim | previous approved binding when later designed | observer failure cannot alter business result |

## 12. Canonical 27-row change coverage

| Rows | Change group | Default review | Activation | Coverage |
|---|---|---|---|---:|
| 1~3 | root/schema/profile/entry | medium/high; schema critical | fresh process | `3/3` |
| 4 | local authority | high | Stage 1 + complete restart | `1/1` |
| 5 | external Port slots | medium/high | Stage 4 + complete restart | `1/1` |
| 6~7 | clock/id/compatibility | medium; compatibility critical | Stage 2 + restart | `2/2` |
| 8~10 | API parameters/policy | low/medium | Stage 6 + API barrier | `3/3` |
| 11~17 | Worker parameters/sources | medium/high | Stage 6 + parked-task barrier | `7/7` |
| 18 | ten collaboration routes | high | Stage 4 all-or-nothing | `1/1` |
| 19~22 | Jobs parameters/reentry policy | low/medium | Stage 6 + Jobs barrier | `4/4` |
| 23~26 | runtime technical policy | medium | typed wrappers via restart | `4/4` |
| 27 | diagnostics | low/medium; widening schema critical | restart | `1/1` |
| **Total** | | | | **27/27** |

## 13. Batch 10.1 停审记录

| Gate | Result |
|---|---|
| 18 module families classified | pass |
| 27 canonical rows change-covered | `27/27` |
| each family has actor/review/activation/audit/rollback/failure | pass |
| direction-sensitive risk applied | pass |
| high-risk family without rollback target | `0` |
| request/Jobs input misclassified as config | `0` |
| Deployment fake/fixture acceptance | `0` |
| critical design surface activated as config | `0` |
| new config key/default/code contract | `0` |

Batch `10.1` is closed. Batch `10.2` may now expand sensitive rotation and audit ownership using these exact families; it may not record secret/full sensitive values or claim provider access occurred.

## 14. 敏感配置变更与轮换

### 14.1 Sensitive change groups

| Atomic group | Step 7 paths | Required actors/review | Preparation | Activation | Rollback constraint |
|---|---|---|---|---|---|
| durable authority closure | storeRef + selected store constructor/transport + reachable endpoint/credential/TLS | persistence + security/dependency + release owners | prove one `A` capability and previous/next artifact integrity | Stage 1 then full barrier | restore complete previous closure only if data/product compatibility remains valid |
| configured external adapter | Port branch + adapterRef + constructor/transport + material refs | dependency + security + release owners | validate exact Port family and provider refs | Stage 4 then full barrier | no configured-to-fake/disabled implicit fallback |
| configured Worker source | source branch + feedRef + trustedActorRef + feed/actor/transport/material | source + security + release owners | stage feed and matcher as one source pair | Stage 6 parked task, all-source barrier | restore pair/full six-slot artifact; no half rollback |
| configured collaboration | collaboration branch + adapter + ten routeRefs/routes + material | event transport + security + release owners | stage exact ten-route graph | Stage 4 complete publisher graph | restore all ten routes/material together |
| endpoint/credential/TLS tuple | transport endpointRef/credentialRef/tlsPolicyRef + reachable refs | security/provider + dependency + release owners | stage new ref/version and check exact kinds | exact owning constructor | old tuple legal only while still safe/resolvable |
| mTLS identity | trust bundle + client certificate + private key refs | security/provider + release owners | stage complete compatible set | one constructor attempt | never roll back one member independently |
| trusted actor set | actorRefs + family/refinement | security/source + release owners | review set digest/count and family | matcher before source barrier | previous complete set only; no clear actor audit |
| deterministic fixture | fake branch + fixture kind/schema/artifactRef | test + release owners | de-identification/parity review | same constructor/path in Local/Integration | Deployment never eligible; no evidence claim |

Atomic group means the candidate artifact contains the complete new group and validation considers it together. It does not imply a distributed transaction across external providers, release systems or processes, and this design does not claim such a transaction exists.

### 14.2 Rotation procedure

```text
[approved change proposal + valid baseline]
  -> [provider/dependency owner stages new ref/version/material]
  -> [complete candidate artifact references only the staged set]
  -> [strict V0~V8 validation]
  -> [new-process Stage 0~7;
      exact constructor resolves new material]
  -> [selected entry barrier reports ready-for-cutover]
  -> [external operations owner performs cutover]
  -> [external owner observes outcome and retires old process/material]
```

关键说明:

1. Provider staging and access are audited by the provider/deployment security owner; Capability Hub does not create a durable business audit row for secret access.
2. Candidate config carries only symbolic refs/version metadata. Raw secret/cert/key/trust material is never copied between old and new artifacts.
3. Old process does not reload the provider and is not promised to observe provider-side rotation. New material becomes relevant only to the new constructor graph.
4. “Ready for cutover” proves only that local validation/assembly/barrier predicates passed. It is not evidence of real external service health unless a selected product has an explicitly designed startup probe.
5. Material retirement timing, overlap and deployment topology belong to the operations boundary; old material must not be revoked before the declared rollback decision unless security policy explicitly forbids rollback.

### 14.3 Security-event exception

| Situation | Is previous credential/TLS ref a valid rollback target? | Required response |
|---|---|---|
| ordinary planned rotation, previous set still approved and valid | potentially yes | use complete previous artifact only after owner confirms provider availability and security validity |
| previous credential expired | no | fix forward to another valid approved ref/version or keep candidate unactivated |
| previous credential revoked | no | never restore it; prepare a new approved set |
| suspected compromise/leak | no | security owner controls revocation and new material; config rollback cannot re-enable compromised material |
| certificate/key pair mismatch in candidate | candidate invalid | no cutover; retain current safe baseline if still valid |
| trust bundle rejects required peer after cutover | owner decision | previous bundle only if still approved; otherwise fix forward; no TLS downgrade |
| provider unavailable for both candidate and baseline | neither graph can be newly built | stop activation and hand failure to Step 11/operations; no cached unknown/fake fallback |

Rollback is subordinate to security validity. A rollback plan that names a credential expected to be revoked before the decision window is incomplete and blocks high-risk activation.

### 14.4 Sensitive audit ownership

| Audit lane | Owner | Minimum safe semantics | Never asserted/recorded by this design |
|---|---|---|---|
| provider access/read | provider/deployment security control | actor/session ref、credential kind、locator/version safe digest where policy permits、result class、time | Hub business audit fact、raw provider response、successful access evidence |
| config proposal/review | release/config control plane | change/actor/reason/review refs、profile/entry、path classes、baseline/candidate safe digests、risk level | concrete ticket fields、approval body/signature、raw diff |
| validation | startup owner | schema/profile/entry、safe artifact digest、V0~V8 result、safe issue refs | raw parser text/value、provider material、runtime readiness |
| assembly/activation | runtime/entry startup owner | Stage class、selected entry、complete predicate result、safe failure class | graph contents、endpoint/ref、external health/evidence |
| cutover | deployment/operations owner | change/candidate ref、requested/result class、time | successful production deployment unless actually recorded by owner |
| rollback | release/config + operations owner | rollback ref、from/to safe digests、reason、validation/activation/cutover result | raw previous/current config、secret、truth rewrite |
| rejected forbidden change | security/config owner | actor/change ref、forbidden path class/category、safe issue ref | attempted raw value or its hash |

The tables define future audit contracts only. No audit event, row, backend, ticket, review, deployment, cutover, rollback, run ID, evidence alias or signature is created or claimed in this design work.

### 14.5 Safe audit projection

| Material class | Config-change audit | Runtime validation/activation diagnostic | Forbidden everywhere |
|---|---|---|---|
| public closed enum/profile/entry | exact closed value where allowlisted | exact closed value | free-text expansion |
| public numeric policy | exact bounded value or approved value class/digest | issue category/range class | claim that retry/timeout occurred |
| internal path/registry structure | path class、member count、safe graph digest | closed subject/kind | full raw path with sensitive member identity |
| sensitive store/adapter/feed/route ref | family/slot + approved safe ref or graph digest | family/slot + outcome class | full ref, constructor private code |
| endpoint | kind/scheme category + approved address digest | kind + safe result | clear address、userinfo、query、DNS/IP inventory |
| credential/TLS/provider refs | credential kind、TLS mode、approved set/ref/version digest | expected kind + result class | provider/locator/version clear value、secret-derived hash |
| actor refs | source family、set count/digest | matcher result class | actor values/list |
| fixture | profile、kind/schema、artifact safe digest | kind/schema/result | fixture body or claim of test/evidence |
| raw secret/material/body | none | none | value, fragment, encrypted copy, hash, parser/provider response |

“Approved safe digest” requires an exact canonical projection and key-management policy in the implementation boundary. If that projection is not closed, the field is omitted; implementations must not hash arbitrary raw values as a substitute.

## 15. Batch 10.2 停审记录

| Gate | Result |
|---|---|
| sensitive groups have atomic change units | pass; 8 groups |
| provider-to-constructor rotation preserved | pass |
| provider-read vs config-change audit owner | separated |
| previous revoked/expired/compromised material as rollback | forbidden |
| TLS downgrade/one-sided mTLS rollback | `0` |
| raw secret/body/full sensitive ref audit fields | `0` |
| arbitrary raw-value hash fallback | `0` |
| concrete provider/audit/ticket product assumption | `0` |
| fabricated audit/review/cutover/evidence fact | `0` |

Batch `10.2` is closed. Batch `10.3` may define the restart activation and rollback decision chain; it may not turn cutover status into Hub business truth or claim external deployment capabilities.

## 16. Change, activation and rollback state chain

### 16.1 Product-neutral change chain

```text
Proposed
  -> Classified
  -> Reviewed
  -> CandidateComplete
  -> Validated
  -> Assembled
  -> EntryBarrierReady
  -> CutoverRequested
  -> [CutoverConfirmed | CutoverRejected | CutoverUnknown]

Any pre-cutover failure
  -> CandidateRejected
  -> BaselineRetained

Confirmed cutover + abnormal effect
  -> RollbackOrFixForwardReviewed
  -> [PreviousArtifactValidated | NewFixForwardCandidate]
  -> new-process validation/assembly/barrier again
  -> external owner cutover decision again
```

These labels are control-plane lifecycle semantics, not a new Capability Hub enum or state machine. A concrete release system may use different names but must preserve the predicates and forbidden transitions below.

### 16.2 Transition predicates

| From -> To | Required predicate | Forbidden shortcut |
|---|---|---|
| Proposed -> Classified | all changed paths map to existing Step 7 catalog; maximum review level known | unknown path defaults to low |
| Classified -> Reviewed | required independent review refs exist; critical ordinary config rejected | executor self-approves high risk |
| Reviewed -> CandidateComplete | complete 18-module artifact, baseline/candidate refs and safe digests, valid rollback/fix-forward plan | JSON patch/partial route/TLS pair |
| CandidateComplete -> Validated | Step 9 V0~V8 pass with zero issue | warn-and-continue, invalid env fallback |
| Validated -> Assembled | Stage 0~7 pass; exact provider/constructor branches complete | configured-to-fake/disabled fallback |
| Assembled -> EntryBarrierReady | selected API/Worker/Jobs barrier complete | listener/task/request exposure early |
| EntryBarrierReady -> CutoverRequested | operations owner receives one immutable candidate identity | Hub entry self-promotes globally |
| CutoverRequested -> Confirmed/Rejected/Unknown | external release system establishes a result according to its own contract | infer from first request, log absence or Hub truth |
| Confirmed -> rollback/fix-forward review | abnormal effect has owner/safe reason ref; valid target determined | automatic rollback to revoked/invalid artifact |
| rollback candidate -> new cutover | entire V0~V8/Stage/barrier chain reruns | in-place graph mutation |

### 16.3 Change rejection points

| Rejection phase | Candidate behavior | Baseline behavior | Audit result |
|---|---|---|---|
| scope/classification | not read by runtime | unchanged | rejected path/risk class only |
| review/package completeness | no startup attempted | unchanged | missing review/package class |
| strict parse/V0~V8 | no root/constructor | current running process unchanged | safe issue refs + rejected |
| provider/material/Stage 1~6 | partial prefix disposed | current process/artifact unchanged | stage/family/result class; no raw cause |
| Stage 7/entry barrier | handoff/prefix disposed; listener/task/request not exposed | unchanged | entry/barrier failure class |
| cutover rejected | candidate process closed by operations owner | baseline retained according external deployment contract | cutover rejected |
| cutover unknown | pause further automated transition; resolve actual external state | must not assume baseline or candidate active | unknown result + investigation ref when owner creates one |

Step 9 guarantees the candidate cannot expose a partial entry before its barrier. It does not define deployment routing, process overlap or cutover atomicity; those are explicit 07/09 prerequisites. `CutoverUnknown` cannot be resolved by querying or mutating Hub business data.

## 17. Rollback matrix

| Scenario | Trigger/owner | Required action | Allowed target | Explicitly forbidden |
|---|---|---|---|---|
| candidate parse/validation fails | startup/release owner | reject candidate; do not start assembly/cutover | current baseline remains | edit-and-continue, lower-source fallback |
| candidate provider/constructor fails | startup/release + dependency/security owner | dispose prefix; reject candidate | current baseline if still running/approved | fake/disabled/inMemory/TLS downgrade |
| candidate entry barrier fails | entry startup owner | close non-exposed candidate graph | baseline retained | expose reduced API/source/job graph |
| cutover rejected | operations owner | stop candidate as external contract requires | baseline retained | claim rollback completed without owner result |
| cutover unknown | operations owner | pause, establish active process externally, then choose reviewed action | only externally confirmed safe artifact | blind second cutover/rollback, infer from business truth |
| post-cutover technical/operational anomaly | operations + config/dependency owner | classify failure; review rollback or fix forward; rerun full chain | previous validated/approved and still compatible artifact, or new candidate | in-place patch, truth/report/capture rewrite |
| credential/TLS compromise/revocation | security/provider owner | revoke unsafe material, prepare new approved set, fix forward | no unsafe previous ref | re-enable compromised/expired/revoked material |
| configured external dependency unavailable | dependency/release owner | Step 11 determines failure handling; config change requires explicit reviewed branch/artifact | previous valid configured artifact or explicitly reviewed Disabled in a new artifact where semantics allow | automatic configured->Disabled/Fake |
| route graph anomaly | event transport/release owner | prepare complete ten-route artifact and restart | previous complete valid graph or complete fix forward | per-route live rollback, payload/source mutation |
| Worker source anomaly | source/security/release owner | prepare complete six-slot artifact; configured source pair remains atomic | previous complete valid source graph | stop only failing source and call it activated unless explicit new Disabled artifact passes review |
| local authority anomaly | persistence/operations/design owners | pause cutover/traffic per operations design; validate data compatibility before any previous authority restart | only previous authority artifact with valid data/schema compatibility | config-only data migration claim or split authority |
| diagnostic anomaly | observability/release owner | prefer reviewed Redacted->Off artifact if signals unsafe; restart | previous safe mode artifact | raw/full/verbose fallback or business cancellation |

### 17.1 Rollback target eligibility

| Eligibility check | Must pass |
|---|---|
| artifact integrity | exact previous candidate ref and safe digest match an immutable approved artifact |
| schema | v1 and current implementation-compatible |
| profile/entry | matches intended new process/binary/host purpose |
| dependency material | all selected refs still registered, resolvable, unexpired, unrevoked and security-approved |
| data compatibility | local authority/schema/state remains compatible; configuration cannot prove or perform migration |
| review | risk-level owner confirms target remains permitted |
| validation/activation | target reruns full V0~V8, Stage 0~7 and selected barrier; prior success is not reused as current proof |

An eligible target is a candidate for a new activation, not an instruction to resurrect an old in-memory graph. The process always rebuilds from the immutable artifact and current external prerequisites.

### 17.2 Rollback does not rewrite business authority

Configuration rollback must not:

- delete or edit capability identity、registry、descriptor、governance/method relation、exposure、trace、impact、reference or derived-material records;
- rewrite idempotency winner/result bytes、Job journal/report、event snapshot/capture/stable intent or UoW resolution;
- reclassify a prior Port outcome、consumer receipt、Job result、handoff or collaboration result;
- repeat a Command/Inbound/Job mutation merely because a process restarted;
- manufacture audit/evidence/acceptance facts from config control-plane records.

Existing persisted authority and replay/reentry rules remain formal `03` owned. A newly activated process reads and operates under those exact contracts.

## 18. Audit and rollback record rules

### 18.1 Minimum record by phase

| Phase | Minimum record semantics | Optional safe fields | Forbidden fields |
|---|---|---|---|
| proposal | change/actor/reason refs、baseline/candidate safe digest、scope/risk | reviewer refs when created | raw diff/document/value |
| review | change ref、reviewer refs、decision class、scope | design/security/dependency category | approval body/signature unless external product owns it |
| validation | candidate safe digest、schema/profile/entry、result、safe issue refs | changed path classes | parser text/offset/raw env/ref |
| assembly/barrier | candidate ref、stage/entry、result class | counts `27/9/6/10` and complete predicate flags | graph/material/endpoint/provider detail |
| cutover | change/candidate ref、external result class、time | deployment target class | invented run/deployment evidence |
| rollback/fix forward | rollback/change refs、from/to safe digests、reason、target eligibility/result | safe failure class | old/new raw config、business truth diff |

### 18.2 Retention and access boundary

This design requires the release/config control plane to retain enough metadata to correlate proposal, review, validation, activation, cutover and rollback. It does not select retention duration, storage product, database schema, access-control product or archive location. Those are 07/09 prerequisites and must preserve:

1. immutable association between change, baseline and candidate identities;
2. append-only outcome history or equivalent tamper-evident control-plane semantics;
3. actor/reviewer separation appropriate to risk level;
4. field-level suppression before any sink receives sensitive values;
5. no conversion of config audit into Hub business audit/evidence/acceptance truth.

If implementation requires a new Capability Hub audit repository, Port, DTO, event or state to satisfy this requirement, implementation must stop and reopen formal `03`; Step 10 does not authorize it.

## 19. Batch 10.3 停审记录

| Gate | Result |
|---|---|
| proposal/review/validation/activation/cutover chain | pass |
| pre-cutover failure retains baseline | pass |
| post-cutover rollback reruns full activation | pass |
| cutover unknown handled without business inference | pass |
| valid rollback target predicates | pass; 7/7 |
| revoked/expired/compromised material rollback | forbidden |
| rollback business truth/report rewrite | `0` |
| partial route/source/TLS group rollback | `0` |
| concrete deployment/audit backend claim | `0` |
| live reload/in-place graph mutation | `0` |

Batch `10.3` is closed. Batch `10.4` may only perform per-change stop review, cross-change/rollback audit, detailed-design impact determination and Step 11 handoff.

## 20. Step 7/8/9/11 回指矩阵

| Change group | Step 7 catalog source | Step 8 sensitivity | Step 9 activation | Step 11 failure handoff |
|---|---|---|---|---|
| root/profile/entry/selectors | §§11、22~24 | public/internal refs; no secret | V0~V8 + selected fresh process | unreadable/missing/mismatch/unsupported/profile failure |
| local authority | §12.1、§19~20 | store/transport/endpoint/credential/TLS sensitive | Stage 1/3 + full barrier | authority/provider/constructor failure, no fallback |
| clock/id/compatibility | §12.2~12.3 | fixture ref sensitive; literals public | Stage 2 | profile/fixture/compatibility failure |
| policy/API/Worker/Jobs scalars | §§13~14 | public/internal numeric | Stage 5/6 + exact entry barrier | invalid/range/deadline and runtime technical effect classification |
| external Ports | §16 | adapter/transport/credential refs sensitive | Stage 4 all 9 slots | Missing vs Disabled vs configured unavailable |
| Worker sources | §17 | feed/actor/fixture/material sensitive | Stage 6 + all parked tasks | no partial activation; source unavailable/disabled |
| collaboration/routes | §16.4、§18 | route/material sensitive | Stage 4 exact 10 routes | configured/disabled/external failure phase separation |
| physical material/provider | §19 | sensitive/secret boundary | exact owning constructor | unavailable/expired/forbidden/TLS mismatch fail-closed |
| fixtures | §19.5 | sensitive test metadata; body outside config | exact fake constructor Local/Integration | missing/wrong kind/parity; Deployment veto |
| diagnostics | §12.3 | mode public; allowlist fixed security contract | startup wrapper + barrier | invalid mode fail-fast; observer failure non-cancelling |

Step 11 must not weaken any rollback rule. In particular, dependency degradation after activation cannot silently rewrite the configured branch, and configuration drift cannot be repaired by reading a second source or mutating the immutable root.

## 21. 配置变更停审记录

| 配置域 / 变更类型 | 权限/评审 | 审计 | 生效/回滚 | 敏感性/失败 | 结论 |
|---|---|---|---|---|---|
| root/profile/entry/source selector | actor and medium/high/critical direction closed | safe profile/entry/digests | full restart; previous eligible artifact | no entry switch/live override | pass |
| local authority | persistence/release review high | kind/ref safe digest/result | Stage 1/3; data compatibility prerequisite | no fallback/split authority | pass |
| clock/id/compatibility | test/release/design owner split | kind/profile/fixture digest | restart; compatibility ordinary change rejected | Deployment deterministic=0 | pass |
| technical policy/API/Worker/Jobs scalar | direction-sensitive low/medium | bounded value/class + result | restart to frozen copy | no retry/effect claim | pass |
| nine external Ports | dependency/release high where configured | family/branch/ref digest | Stage 4 all-or-nothing | Missing/failure no branch conversion | pass |
| six Worker sources | source/security/release review | family/branch/feed/actor digests | all parked before release; full graph rollback | no half pair/topic identity | pass |
| ten routes/collaboration | event/security/release high | family set/count/graph digest | exact ten graph; complete rollback | no payload/source/delivery truth mutation | pass |
| endpoint/credential/TLS/provider | security/provider/release high | kind/mode/safe set digest/result | exact constructor; valid-target rerun | raw secret=0; revoke/compromise fix-forward | pass |
| fixtures | test/release medium; Deployment reject | kind/schema/artifact safe digest | same path; previous artifact | no evidence/readiness claim | pass |
| diagnostics | narrowing low/widening medium; allowlist critical | mode/review/result | restart | no raw/full/verbose; observer non-cancelling | pass |

## 22. 跨变更审计 / 回滚审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| existing config module without change class | `0`; 18/18 covered | none |
| canonical row without actor/review/activation/rollback | `0`; 27/27 covered | none |
| high-risk change without independent review | `0`; package blocked if missing | none |
| high-risk change without baseline/candidate identity | `0`; completeness gate rejects | none |
| high-risk change without eligible rollback/fix-forward plan | `0`; activation blocked | none |
| critical design surface activated as ordinary config | `0`; reject/reopen only | none |
| live reload/admin/config center/in-place patch | `0` | startup-only retained |
| invalid candidate alters running baseline | `0` | no cutover before barrier |
| previous invalid/unapproved artifact as rollback | `0` | target eligibility required |
| revoked/expired/compromised credential rollback | `0` | fix-forward only |
| configured failure -> fake/disabled/inMemory/TLS downgrade | `0` | explicit new reviewed artifact only where branch legal |
| partial TLS/source/route group activation/rollback | `0` | atomic groups |
| rollback rewrites business truth/report/capture/journal | `0` | config control plane only |
| raw config/diff/secret/full sensitive ref/body in audit | `0` | safe projection only |
| secret-derived arbitrary hash | `0` | omit unless exact safe projection exists |
| provider-read/config-change owner ambiguity | `0` | separate lanes |
| concrete ticket/approval/audit/deployment product assumed | `0` | product-neutral refs |
| fake review/run/cutover/rollback/evidence/signature | `0` | future contract only |
| 03 code-contract writeback gap | `0` | no new object/Port/DTO/error/flow/state |

## 23. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| complete immutable artifact as change unit | 否 | release/config control-plane policy around existing root | formal 03 §13.1/13.9 | 无回写 |
| actor/review/risk and safe audit semantics | 否 | product-neutral process contract; no Hub object/API | formal 03 §14 boundary | 无回写 |
| restart activation and baseline retention | 否 | exact reuse of Step 9 Stage/barrier contract | formal 03 §13.9 | 无回写 |
| sensitive ref/TLS/provider rotation | 否 | ref-only config and exact constructor lifecycle | formal 03 §13.4/13.9 | 无回写 |
| rollback target eligibility and business-truth prohibition | 否 | operational selection; existing persistence/replay authority unchanged | formal 03 §§10~13 | 无回写 |
| future Hub-owned change/audit/rollback object/repository/Port/event | 触发时是 | new code/persistence/protocol contract | reopen DDD Steps 6/7/8/9/11/14 as applicable | 当前未引入；受控回开 |
| future config center/admin/hot reload/live graph swap | 触发时是 | architecture/runtime builder/change state contract | reopen architecture + DDD Step 14 + formal 04 | 当前拒绝；受控回开 |

Current impact: `待回写=0`, `阻塞待确认=0`, `upstream blocker=0`。本 Step 新增 Rust declaration/struct/field/enum/variant/payload/trait/method/callable=`0`，Rustdoc delta=`0`。Future Rust changes remain subject to English `///` on every declaration, struct field, enum variant/payload field, trait/method and callable.

## 24. Formal §10 回填草稿

正式 `04-配置设计.md` §10 应装配：

1. change artifact identity、actor responsibility、direction-sensitive review levels 和 package completeness gate；
2. root/local/policy/entry/external/source/route/material/fixture/diagnostics 逐族变更表；
3. 27/27 canonical row change coverage；
4. sensitive atomic groups、provider-to-constructor rotation、安全事件 exception 和 audit owner separation；
5. product-neutral proposal/review/validation/assembly/barrier/cutover chain；
6. rejection point、rollback matrix、target eligibility 和 no-business-rewrite rules；
7. Step 7/8/9/11 traceability、per-domain stop review、cross-change audit 和 03 no-writeback gate。

正式章节不得把 control-plane lifecycle labels 写成已实现 enum，不得声明真实 review、provider access、artifact digest、cutover、rollback、deployment、test、evidence或signoff。它不得写具体工单/审批/审计产品字段，也不得增加 runtime reload/hot path。

## 25. 待确认事项

| 事项 | 当前状态 | 是否阻塞 Step 11 | 未确认前处理 |
|---|---|---|---|
| concrete artifact store/release/approval/audit product | unselected | no | 07/09 prerequisite；必须保留 product-neutral predicates和safe fields |
| deployment cutover/overlap/unknown-resolution mechanism | unselected | no | 07/09 prerequisite；formal 04不宣称atomic cutover |
| config audit retention/access policy | unselected | no | operations/security prerequisite；不得在Hub业务仓私增repository |
| provider-specific material overlap/revocation procedure | product-dependent | no | provider/operations boundary；security exception优先于rollback |
| durable product data/schema migration procedure | product-dependent | no | implementation/operations prerequisite；config不能执行或证明migration |
| canonical safe config projection/digest implementation | not implemented | no | implementation boundary闭合 exact projection；未闭合时omit敏感digest |

These are downstream implementation/operations prerequisites, not upstream design blockers. Any selected product that cannot satisfy the required predicates triggers a controlled reopen rather than weakening the change contract.

## 26. Step 10 completion gate

| Completion condition | Result |
|---|---|
| actor/reviewer/executor/owner boundaries | pass |
| change classes cover modules/rows | `18/18`, `27/27` |
| high/critical review rules | pass |
| sensitive rotation/audit/output rules | pass |
| restart activation/cutover/rollback chain | pass |
| eligible target and security exception | pass |
| per-domain change stop reviews | pass |
| cross-change/rollback unresolved conflict | `0` |
| raw secret/full ref/body/fake evidence | `0` |
| concrete ticket/audit/deployment product assumption | `0` |
| 03 pending writeback/upstream blocker | `0/0` |
| formal 04 write before Step 15 | `0` |

Step 10 is complete. Next allowed action: read SOP Step 11、writing standard §5.11、Steps 5/7/9/10 and formal 03 failure taxonomy；then define missing/invalid/unreachable/expired/drift/constructor/runtime dependency failure behavior, alert intent and test-cut handoff without silent fallback or fabricated monitoring/test results.
