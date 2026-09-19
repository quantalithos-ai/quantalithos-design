# Step 3. 抽取测试对象与测试切口

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 3
> 回填章节：`05-测试方案.md` §3
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_03_test_objects_cuts.md`
> 状态：`done / pass / self_reviewed`

## 1. 目标与输入

从正式 02～04 和 03 Step 16 抽取可独立审查的 P0 测试对象/切口，固定每个切口的设计真相源、风险、推荐层级和 positive blocker。本 Step 只确定“测什么”，不提前写 TC、数据、suite 或 evidence 结果。

| 输入 | 用途 |
|---|---|
| Step 2 范围 | P0/P1/P2 与 VETO 边界 |
| 03 §5～§15 | 模块、对象/Port、协议、flow、state、consistency、error、concurrency、binding、diagnostic 与 test cuts |
| `03_ddd_step_16_test_slices.md` | 十模块、5+16+1 与横切切口底稿 |
| 04 §5～§12 | 配置 source/schema/security/load/change/failure 测试输入 |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些对象/纯规则必须 unit test？ | typed ref、AccessContext/guard、TopicVisibility、SourceStatusAxes、Draft/Request、TopicActivation、Degradation/Recovery、state scope、DiagnosticContext、配置 parser/validator。 |
| 哪些编排必须 flow/service test？ | 5 Command、8 Core Query、8 Topic Query、conditional consumer disabled、context switch、submit/reconcile、recovery action、late-result guard。 |
| 哪些 adapter 必须 integration/contract test？ | formal/fake parity、safe mapper、registry availability、owner partition failure、carrier、host/a11y、diagnostic sink、runtime builder。 |
| Event/Job 如何处理？ | Console Outbound Event=0、Operations Job=0；用 architecture/static cut 防止实现漂移，不能套模板新增 worker/outbox。 |
| 哪些状态/一致性/恢复必须单列？ | 11 个状态主语、exact-scope whole record、Query no-write、formal/local non-atomic、single writer、single-flight、ambiguous/no replay、race conservative。 |
| 哪些字段/DTO 负向切口必需？ | empty/duplicate opaque ref、owner/source/context mismatch、forbidden body、unknown key/type、missing required profile、malformed safe material、phase 越界。 |
| 是否有 P0 孤儿设计契约？ | 无；十模块、22 个 protocol instance、state/error/concurrency/config/diagnostic/a11y/static absence 均有切口。Positive formal facets 保留 blocker，不以假 DTO 填洞。 |

## 3. 测试对象与切口总表

| Cut ID | 测试对象 | 设计真相源 | 核心切口 | 风险 | 推荐层级 |
|---|---|---|---|---|---|
| `CUT-CON-ENTRY` | `entry` / `ConsoleSessionShell` | 03 §5.1、§9、§13 | bootstrap、replacement、host failure、closed terminal | state/load/host 被误当 readiness | unit + composition |
| `CUT-CON-ACCESS` | `access` objects/guards | 03 §5.2、Step 6/7 | formal-only positive、tightening、same-source、minimum disclosure | 本地授权与对象存在泄露 | unit + contract |
| `CUT-CON-NAV` | navigation objects/ports | 03 §5.3、§8～§9 | guarded select、direct link、history/cleanup、host reentry | route/menu 充当 permission | unit + flow |
| `CUT-CON-VIEW` | view/ref/source axes | 03 §5.4、§7～§11 | safe mapping、五轴独立、formal empty、filter-after-map、Query no-write | 第二 truth、状态压平、正文泄露 | unit + contract + flow |
| `CUT-CON-INTENT` | draft/request/result | 03 §5.5、§7～§12 | lifecycle、qualification、single submit、receipt/result/unknown/reconcile | UI 成功冒充业务完成、重复副作用 | unit + flow |
| `CUT-CON-TOPIC` | descriptors/activation/8 pages | 03 §5.6、§7.4、§8.4 | owner set/order、six-facet activation、partition isolation、strict empty | 跨域 truth/readiness、局部故障扩散 | parameterized flow |
| `CUT-CON-RECOVERY` | degradation/recovery | 03 §5.7、§11～§12 | subject ceiling、immutable plan、one action、stale rejection | retry-all、隐式恢复、命令 replay | unit + flow |
| `CUT-CON-ADAPTER` | SDK/formal adapters | 03 §5.8、§7、§11 | narrow surface、safe mapper、formal/fake parity、registry fail-closed | private transport/正文/错误越界 | contract + controlled integration |
| `CUT-CON-STATE` | scoped carrier | 03 §5.9、§10、§12 | whole-record、exact scope、replace/invalidate/clear、ambiguous reload | owner truth 持久化、scope 迁移、重复 submit | contract + failure injection |
| `CUT-CON-DIAG` | diagnostic facade | 03 §5.10、§14 | whitelist、redaction、low-cardinality、sink isolation、not audit | 敏感泄露或诊断改变业务 | unit + sink fake + static |
| `CUT-CON-A11Y` | semantic regions/actions/focus | 03 §5.7、§9、§14 | visual/keyboard/AT same guard/action、focus/announce fallback | 第二交互路径或核心目标不可达 | semantic model + host fake |
| `CUT-CON-COMMAND` | 5 Commands | 03 §7.2、§8.2 | per-command input/phase/side effect/error/cancel | flow 顺序和唯一写边界漂移 | flow contract |
| `CUT-CON-QUERY` | 8 Core + 8 Topic Queries | 03 §7.3～§8.4 | union surface、no-write、formal empty、partial isolation | read 修复/安装/写入 truth | query flow + port spies |
| `CUT-CON-CONSUMER` | `ConsumeSdkInvalidationHint` | 03 §7.5、§8.5、§12 | current disabled zero-write；future body/scope/monotonic gate | 无合同 event 被当 truth | fake + future contract |
| `CUT-CON-STATE-MATRIX` | 11 state subjects | 03 §9、Step 10 | legal tightening、illegal elevation、formal-only recovery、terminal | 旧状态名/phase shortcut | table-driven unit |
| `CUT-CON-CONSISTENCY` | concurrency/idempotency | 03 §10、§12 | non-atomic install、single writer、late drop、single-flight、races | lost update、duplicate side effect、old overwrite | deterministic scheduler + spies |
| `CUT-CON-ERROR` | typed error/recovery mapping | 03 §11 | construction→port→protocol→page mapping、redaction、ceiling | raw Error/HTTP/body 泄露、generic retry | table-driven + presentation |
| `CUT-CON-CONFIG` | four config fields/control plane | 04 §5～§13 | strict parse/type/cross-field/security/profile/startup/change/rollback | implicit fake、secret、config-as-authority | unit + composition + release simulation |
| `CUT-CON-ARCH` | dependency and absent surfaces | 03 §3～§5、§7.5、§15 | SDK-only、no DB/repo/private bus/BFF/worker/event/job | 历史服务端污染回流 | architecture/static check |

## 4. 协议覆盖清单

### 4.1 Command

| Protocol | 必测正向上限 | 必测负向 / phase 边界 | Cut |
|---|---|---|---|
| `RequestAccessContextSwitch` | formal observation→old-scope cleanup→shell replace | mismatch/revoked/cancel/host failure；route 不构造 context | ENTRY/ACCESS/COMMAND |
| `SaveClientPreference` | typed patch→whole-record replace | authority field/scope mismatch/ambiguous carrier；不改 formal state | STATE/COMMAND |
| `DiscardDraftIntent` | nonterminal→discarded，零 owner call | submitted/discarded 非法，save failure 不声称完成 | INTENT/COMMAND |
| `SubmitControlledIntent` | contract fixture 到达后 qualified input 恰好一次 submit | missing surface 零 submit；double action；ambiguous→unknown；no replay | INTENT/COMMAND/CONSISTENCY |
| `ApplyRecoveryAction` | allowed action 精确一个 narrow branch | stale/mismatch/blocked/retry-command/double trigger；a11y failure isolated | RECOVERY/A11Y/COMMAND |

### 4.2 Core Query

| Protocol | 必测 union/来源 | 禁止副作用 |
|---|---|---|
| `ResolveAccessContext` | formal lifecycle/refs；invalid/cancel conservative | 不安装 context |
| `GetNavigationVisibility` | exact topic/context posture；restricted/unknown/unavailable | 不写 navigation，不用 route fallback |
| `QueryOwnerView` | safe material→axes/snapshot/model；formal empty | 不写 cache/carrier，不修复 owner |
| `GetSourceStatus` | 五轴独立与 mismatch/malformed | 不聚合 health/readiness |
| `GetSafeLink` | typed target ref；no-link/revoked/unknown | 不返回 URL，不导航 |
| `GetRequestPresentation` | exact scoped record；missing/corrupt/unavailable | 不隐式 reconcile/submit |
| `ReconcileRequestResult` | formal pending/confirmed/rejected/unknown | 不 submit、不自动安装/replay |
| `GetTopicActivation` | capability+mode+six facets+context | package/flag/page 不 active |

### 4.3 Topic Query

| Protocol | Owner partitions | 专项禁止 |
|---|---|---|
| `QueryMemberManagementTopic` | identity/member-service | lifecycle/role/body 推导 |
| `QueryProjectWorkspaceTopic` | work/process/workspace | projection/cursor/rebuild/project readiness |
| `QueryMethodAssetTopic` | method-library/artifact | body、publish/approval action |
| `QueryGovernanceControlTopic` | governance/artifact | verdict/approval/Gate decision/evidence body |
| `QueryObservabilityTopic` | observability | threshold verdict/audit truth/readiness |
| `QueryCapabilityHubTopic` | capability-hub | registration/readiness |
| `QueryArchiveTopic` | archive | archive/restore execution truth |
| `QuerySandboxTopic` | sandbox | run/start/cleanup/runtime readiness |

所有 Topic Query 共享 canonical owner order、completion-order independence、partition-local failure、strict empty 和 zero-write 断言。

## 5. 状态与一致性切口

| 主语 | 正式状态/规则 | 最小负向断言 |
|---|---|---|
| context | `unresolved/verified/restricted/expired/revoked/conflict/unknown` | route/carrier/render/cache 不恢复 verified |
| qualification/visibility | positive 可本地收紧 | menu/role/flag/page 不产生 qualified/visible |
| navigation | empty/guarded selected/restricted | hidden/unknown 不 selected；context cleanup 后旧 entry 不复现 |
| source/ref | freshness/coverage/availability/consistency/reference validity 独立 | timer/cache/DOM 不 fresh/current；不压成 health |
| draft | editing/invalid/reviewable/submitted/discarded | submitted/discarded 不编辑/复活；reviewable≠authorized |
| request/result | submitted/accepted/pending/confirmed/rejected/unknown | receipt/toast/2xx/cache 不 terminal；unknown no replay |
| activation | pending/read-only/partial/active/blocked | 缺 capability/context/facet 不 active；config 不抬升 |
| degradation/recovery | degradation→immutable plan→one action→new observation | timer/action completion 不 recovered；stale plan blocked |
| carrier | missing/loaded/unknown-to-caller | scope mismatch 不迁移；load 不恢复 formal positive |
| shell | bootstrapping/presentable/restricted/closed | state load 不 presentable；closed terminal |
| a11y/diagnostic | same semantic action；emitted/disabled/failed | host/sink outcome 不改变业务 state/result |

| 一致性风险 | 必测断言 |
|---|---|
| formal call vs local install | 非原子；install failure 不反向补偿 owner、不重发 command |
| same-scope mutation | single writer 顺序 whole-record；不宣称 CAS/multi-tab |
| context switch vs late result | 捕获 refs，安装前重检，旧结果丢弃 |
| owner fan-out | 正/逆完成序产生同 canonical page |
| multi-channel submit | shared action key/single-flight，至多一次 submit |
| cancel/timeout | 未 dispatch→cancelled；可能 dispatch→unknown |
| reconciliation overlap | older pending 不覆盖 newer terminal |
| invalidation race | 无 ordering proof 时保持 stale/unknown，不用 local clock |

## 6. 配置切口

| 子切口 | 必测内容 | 禁止结论 |
|---|---|---|
| strict document | malformed/comment/trailing/duplicate/unknown/alias reject | parser 成功不等 runtime ready |
| required/default | profile missing fail-fast；optional=`[]/false/false` | 不隐式 `local-fake` |
| type/ref/cross-field | enum/boolean/array/slot/ref、duplicate `(profile,slot)`、profile mismatch | 不 coercion、不 fallback |
| forbidden material | endpoint/URL/secret/body/owner/private/static key reject/no echo | 不存 raw rejection input |
| profile isolation | fake only local；`*-pending` 不等 ready | 不用 profile 名通过 release |
| builder/dependency | validation before builder；mandatory/optional posture 分离 | 不暴露 partial protected runtime |
| optional paths | invalidation false；diagnostic false或受控 local fake；failure isolated | 不用 flag 激活 capability |
| state/change/rollback | session-volatile；whole document/revalidation/new runtime/previous artifact | 无 hot patch/online LKG |

## 7. P0 切口停审记录

| Cut | 来源明确 | 风险具体 | 层级合理 | Positive blocker 保真 | 结论 |
|---|---|---|---|---|---|
| ENTRY/ACCESS/NAV | yes | context/authorization/cleanup | unit+flow | host/formal positive conditional | pass |
| VIEW/QUERY | yes | no-write/source/body | unit+contract+spy | owner safe material conditional | pass |
| INTENT/COMMAND | yes | side effect/phase/replay | unit+flow | owner submit positive blocked by exact contract | pass |
| TOPIC | yes | partition/activation/truth | parameterized flow | per-owner positive conditional | pass |
| RECOVERY/A11Y | yes | retry/semantic equivalence | unit+semantic+host fake | concrete compatibility blocked | pass |
| ADAPTER/ERROR | yes | private/raw/failure mapping | contract+integration | formal adapter selected tests blocked | pass |
| STATE/CONSISTENCY | yes | scope/atomicity/race | contract+scheduler | durability/multi-tab excluded | pass |
| DIAG | yes | leak/recursion/audit confusion | unit+sink+static | production sink blocked | pass |
| CONSUMER | yes | event truth/order | fake+future contract | observed branch blocked | pass |
| CONFIG | yes | implicit fake/secret/authority | unit+composition | production positive blocked | pass |
| ARCH | yes | forbidden runtime units/deps | static | none | pass |

## 8. 跨切口设计来源审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 十模块是否均有入口 | pass | 10/10 |
| 5 Command / 16 Query 是否逐名覆盖 | pass | 5/5、16/16 |
| conditional consumer 当前姿态是否覆盖 | pass | disabled zero-write；positive blocked |
| Event/Job N/A 是否受保护 | pass | static absence cut |
| 状态/一致性/error/config/diagnostic/a11y 是否覆盖 | pass | 独立 cuts |
| 是否有重复 truth 或孤儿 P0 | pass | 无；交叉 cut 表达不同风险轴 |
| 是否使用旧对象/状态/协议名 | pass | 无旧 Workspace/Panel/QuickAction flow |
| 是否把 blocked fixture 写成 executable positive | pass | no |

## 9. 上游影响、回填与门禁

| 结论 | 是否影响上游 | 状态 |
|---|---|---|
| 19 个 cut 均来自现有设计 | 否 | 无回写 |
| 未发现孤儿 P0 契约 | 否 | pass |
| runner/scripts 尚未成为 cut 事实 | 否 | Step 9 再判定 03 layout 回写 |
| future 字段/状态无法构造时 | 可能 | 停止并回 03，不在 fixture 发明 |

正式 §3 应回填 cut 总表、协议/状态/配置覆盖和 blocked posture；过程停审表保留本文件。

Step 3 `done / pass / self_reviewed`；P0 切口逐组停审和跨切口审计通过，允许进入 Step 4。
