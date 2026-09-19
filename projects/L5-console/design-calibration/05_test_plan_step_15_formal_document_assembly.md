# Step 15. 整理正式测试方案文档

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 15
> 回填范围：完整 `05-测试方案.md`
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md` §5.10
> 状态：`done / pass / self_reviewed / formal_stop_review`

## 1. 目标、输入与写入门禁

本 Step 在 Step 1～14 全部 `done / pass / self_reviewed` 后，先完成跨文档一致性复核，再允许 full-restart 重建正式 05。旧正式 05 的 ConsoleWorkspace/Panel/service/repository/projection/event-chain、旧 TC、固定阈值和模糊报告路径只用于污染审计，正文不得增量继承。

| 门禁 | 结论 |
|---|---|
| 项目级 | 用户已授权完成全部 05；禁止进入 06、实现、测试执行或提交 |
| 文档级 | Step 1～14 已通过；只允许 full-restart 装配恰好 §1～§15 |
| Step 级 | 本文件先于正式重建创建；跨文档十项复核通过；正式装配后再次完成全文审计 |
| 事实边界 | 目标仓不存在；不得填写 run/artifact/report/evidence instance/verdict/signoff/readiness |

## 2. 真相源表

| 设计事实 | 真相源 | 后续测试/验收消费者 | 冲突处理 |
|---|---|---|---|
| 六核心能力、18 FR、33 BR、30 DR、13 IF、14 DEP、21 NFR、AC/VETO | 正式 00 §7～§16 | 05 §2/5/6/10/12～14；新版 06 | 00 优先；05 只转译为验证合同 |
| SDK-only、owner truth、数据/通信/降级边界 | 正式 01 §4～§15 | ARCH/SEC/ADAPTER/TOPIC tests | 01 优先；禁止私有旁路和第二 truth |
| 五组成部分、对象/接口/flow/state/异常骨架 | 正式 02 §5～§13 | cut、层级与场景设计 | 03 精化，不得被 05 重定义 |
| 十模块、对象/Port、5 Command、16 Query、1 consumer、0 Event/Job | 正式 03 §5～§8 | 96 TC、suite、static gate | 03 优先；命名漂移必须回写而非测试自造 |
| 状态、carrier、一致性、错误、并发、诊断 | 正式 03 §9～§15 | STATE/CONSISTENCY/RECOVERY/DIAG TC | formal positive recovery only；Query no-write |
| 四配置项、三 profile、source/default/startup/failure | 正式 04 §5～§14 | CONFIG、环境与 release checks | 04 优先；不新增 key/profile/阈值 |
| suite/gate/artifact/report/evidence contract | 05 Step 9/13 | 正式 05 §9/13；新版 06/07 | 仅 planned；无执行事实 |

## 3. 字段闭环表

| 对象 | 关键字段 | 类型/来源 | 构造入口 | 缺失/不安全处理 | 测试覆盖 | Future EV |
|---|---|---|---|---|---|---|
| `AccessContext` | context/lifecycle/actorScope/visibility | local context ref + formal refs | context resolver/factories | unresolved/restricted/unknown；不得猜 actor/scope | CTX/NAV/SEC | UNIT/FLOW/SECURITY |
| `OwnerViewSnapshot/Model` | owner/source/status/payload/references/context | formal safe mapper | owner query→safe map→compose | whole reject/blocked/unavailable/unknown | VIEW/ADAPTER/TOPIC | FLOW/CONTRACT/SECURITY |
| `DraftIntent` | draftRef/context/fields/state | client safe input | draft factory/transitions | invalid/blocked；terminal 不复活 | INTENT/STATE | UNIT/FLOW |
| `RequestPresentation/ResultReference` | request/command/receipt/result/phase | owner-safe observation + local refs | submit/reconcile mapper | unknown/no replay；missing surface blocked | INTENT/VIEW/CONSISTENCY | FLOW/CONTRACT/INTEGRATION |
| `TopicPageModel` | descriptor/partitions/regions/actions/posture | per-owner safe views + local semantic map | canonical topic composition | partition-local blocked/partial；strict empty | TOPIC/A11Y/SEC | FLOW/INTEGRATION/ACCESSIBILITY |
| `RecoveryPlan` | subject/axes/actions/context/request refs | non-normal axes + current refs | deterministic plan factory | stale/mismatch/action not allowed→blocked | RECOVERY/STATE/A11Y | UNIT/FLOW/ACCESSIBILITY |
| `ClientStateRecord` | exact scope + context/navigation/pages/drafts/requests/recoveries/a11y/markers | local safe objects only | whole-record factory/replace | whole reject/clear/minimal/reload | STATE/CONSISTENCY/CONFIG | UNIT/CONTRACT/INTEGRATION |
| `DiagnosticContext` | phase/outcome/safe refs/redaction | approved enums/refs | factory→redaction gate | reject/no echo；sink failure isolated | DIAG/SEC | UNIT/SECURITY/INTEGRATION |
| `ConsoleClientBindingConfig` | profile/bindings/invalidation/diagnostics | defaults + one strict JSON document | loader/validator/builder | whole reject/fail-fast/disabled | CONFIG | UNIT/CONTRACT/SECURITY/RELEASE |

## 4. DTO / Consumer 到对象构造闭环表

Console 无 Outbound Event 和 Operations Job；不适用列明确为 0，不创建空模板。

| 输入协议 | 目标对象/输出 | 必填来源 | 不得混同 | 缺失行为 | TC |
|---|---|---|---|---|---|
| `RequestAccessContextSwitch` | `ConsoleSessionShell/AccessContext` | metadata/current/target ref + formal context observation | route/session≠actor/scope | blocked/restricted；旧 scope cleanup 保守 | CTX-001～005 |
| `SaveClientPreference` | `ClientStateRecord` | metadata/exact scope/typed patch | preference≠authority/truth | forbidden/scope mismatch→zero replace | INTENT-001～002 |
| `DiscardDraftIntent` | discarded `DraftIntent` | metadata/nonterminal draft/reason key | reason key≠owner reason/evidence | invalid terminal transition blocked | INTENT-003～004 |
| `SubmitControlledIntent` | `RequestPresentation` | current context/reviewable draft/command/qualification/exact contract | correlation≠owner idempotency；receipt≠result | contract missing→no submit；ambiguous→unknown | INTENT-005～010 |
| `ApplyRecoveryAction` | `RecoveryPresentation` | current plan/action/context/optional request | action completion≠recovered | stale/mismatch/unsupported blocked | RECOVERY-002～005 |
| `ConsumeSdkInvalidationHint` | `InvalidationMarker`（future） | body-free formal envelope/scope/order/dedup | hint≠owner truth/event store | 当前 disabled/pending-contract、zero-write | ADAPTER-005～006 |

## 5. 状态闭环表

| 状态主语 | 正式状态/轴 | 产生/恢复 | 禁止迁移 | TC / Future EV |
|---|---|---|---|---|
| context | unresolved/verified/restricted/expired/revoked/conflict/unknown | formal resolve/revalidate/invalidate | route/cache/render→verified | CTX/STATE；UNIT/FLOW |
| qualification/visibility | qualified/restricted/not-qualified/unknown/unavailable；visible/restricted/disabled/unknown/unavailable | formal observation；local only tightens | role/menu/flag→positive | NAV/SEC；FLOW/SECURITY |
| navigation | empty/guarded selected/restricted | guarded local action + cleanup | host navigate→visibility | NAV/STATE；FLOW/A11Y |
| source/ref axes | freshness/coverage/availability/consistency/ref validity | formal safe material/new query | timer/cache→fresh/current；统一 health | VIEW/TOPIC；UNIT/FLOW |
| draft | editing/invalid/reviewable/submitted/discarded | local validate/submit/discard | terminal edit/revive；reviewable→authorized | INTENT/STATE；UNIT/FLOW |
| request/result | submitted/accepted/pending/confirmed/rejected/unknown | formal receipt/result/reconcile | toast/2xx→terminal；unknown replay | INTENT/CONSISTENCY；FLOW |
| activation | pending/read-only/partial/active/blocked | capability+mode+six facets+context | flag/package/page→active | VIEW/TOPIC；UNIT/FLOW |
| degradation/recovery | axes→degradation→plan→one action→new observation | explicit action + formal observation | timer/action completion→recovered | RECOVERY/A11Y；FLOW/ACCESSIBILITY |
| carrier | missing/loaded/replaced/invalidated/cleared/ambiguous | exact-scope whole operations/reload | implicit migration/CAS assumptions | STATE/CONSISTENCY；CONTRACT/INTEGRATION |
| shell | bootstrapping/presentable/restricted/closed | validated page/context/cleanup | load→presentable；closed reopen | CTX/STATE；UNIT/FLOW |
| a11y/diagnostic | semantic status；emitted/disabled/failed | shared action binding/safe emission | 改业务结果/权限/recovery allowance | A11Y/DIAG；ACCESSIBILITY/SECURITY |

## 6. Query Response / View 闭环表

| Query | Response/View | 来源与 empty/degraded 口径 | Public ref 规则 | TC |
|---|---|---|---|---|
| `ResolveAccessContext` | `QuerySurface<AccessContextObservation>` | formal lifecycle；不安装 | local correlation 非 actor/scope | CTX-001/003/004 |
| `GetNavigationVisibility` | `QuerySurface<TopicVisibility>` | formal posture；无 route fallback | decision/reason safe refs only | NAV-001～004 |
| `QueryOwnerView` | `QuerySurface<OwnerViewModel>` | safe map before filter；empty only formal | owner/source/version/query refs body-free | VIEW-001～003/009 |
| `GetSourceStatus` | `QuerySurface<SourceStatusAxes>` | axes 独立；mismatch blocked | version time 不替代 owner version | VIEW-004 |
| `GetSafeLink` | `QuerySurface<SafeLinkReference>` | revoked/not-visible blocked；no-link empty | typed target ref，无 raw URL/navigation | VIEW-005 |
| `GetRequestPresentation` | `QuerySurface<RequestPresentation>` | exact local record；missing local empty | request/context correlation exact | VIEW-006 |
| `ReconcileRequestResult` | `QuerySurface<ResultReference>` | formal only；cancel/transport unknown | result/reconcile ref safe only | VIEW-007/INTENT-011 |
| `GetTopicActivation` | `QuerySurface<TopicActivationState>` | five posture；missing facets pending/blocked | capability/activation refs不等 readiness | VIEW-008/TOPIC-012 |
| 八个 `Query*Topic` | `QuerySurface<TopicPageModel>` | canonical owner partitions；strict all-formal-empty | 分 owner refs/status，不合成 truth | TOPIC-001～012 |

所有 16 Query 共用 `TC-VIEW-009` 的 zero-write ledger：owner command 和 carrier write 均为 0。

## 7. Phase / Side-effect Boundary 闭环表

| Boundary | 包含 | 排除 | 测试 | 验收承接 |
|---|---|---|---|---|
| local interaction | navigation/filter/draft/preference/a11y | owner truth/authorization/readiness | NAV/INTENT/STATE/A11Y | AC-DR-001；AC-NFR-005/007 |
| formal read | owner-safe query/result/revalidation | local repair、Query write、unified truth | VIEW/TOPIC/ADAPTER | AC-CON-003/005；VETO-001/005/007 |
| controlled submit | exact qualification/contract + one `OwnerCommandPort.submit` | implicit idempotency/replay/terminal guess | INTENT/CONSISTENCY | AC-CON-004；VETO-002/003 |
| formal/local non-atomic | safe observation + separate carrier replace | distributed transaction/owner compensation | INTENT-010；STATE-004 | AC-NFR-005 |
| recovery | one explicit subject-specific action | retry-all/hidden loop/action-complete=recovered | RECOVERY/CONSISTENCY | AC-CON-006；VETO-003/006 |
| diagnostics/evidence | optional body-free diagnostic；run-bound test evidence | audit/evidence owner body、sink receipt truth | DIAG/SEC/ARCH/report audit | AC-NFR-004/006；VETO-004 |

## 8. Public Protocol 传递类型闭环表

| Surface | 外层 DTO/union | 关键传递类型 | 正式归属 | 缺失/duplicate/retry | 依赖边界 | TC |
|---|---|---|---|---|---|---|
| operation metadata | `ConsoleOperationMetadata` | local operation/session/context refs | 03 Step 8/shared | missing blocked；非 owner idempotency | application-local | CTX/VIEW/INTENT |
| local Command | `LocalCommandOutcome<T>` | applied/blocked/cancelled | 03 Step 8 | no hidden retry | module→consumer-owned Port | INTENT/RECOVERY |
| Query | `QuerySurface<T>` | value/empty/blocked/unavailable/unknown | 03 Step 8 | empty不由异常/空数组猜；repeat read no-write | adapter→SDK/formal | VIEW/TOPIC |
| owner material | `OwnerSafeQueryMaterial` | SourceReference/Axes/SafePayload/Refs | views/adapters | malformed whole reject | no raw owner DTO/body | VIEW/ADAPTER |
| owner command result | `OwnerCommandObservation` | receipt/result/ambiguous | intent/adapters | duplicate semantics pending；ambiguous no replay | only `OwnerCommandPort.submit` writes | INTENT/CONSISTENCY |
| invalidation | `SdkInvalidationObservation` | source/scope/time/reason ref | adapters/state | duplicate/order pending；disabled now | no private bus/cursor/store | ADAPTER/ARCH |
| state carrier | `ClientStateRecord` + `StateScopeBinding` | exact-scope whole record | state | mismatch zero mutation；ambiguous reload | session-volatile only | STATE/CONFIG |
| diagnostic | `DiagnosticContext` | phase/outcome/safe refs/redaction | diagnostics | failure isolated/no recursive retry | not audit/evidence | DIAG/SEC |

## 9. 命名一致性表

| 类型 | 正式名称 | 禁用旧名/含混名 | 装配规则 |
|---|---|---|---|
| 模块 | entry/access/navigation/views/intent/features/recovery/adapters/state/diagnostics | workspace/panel/service/repository/projection | 正式 §3～§6 只使用十模块 |
| 协议 | 5 个正式 Command、16 个正式 Query、`ConsumeSdkInvalidationHint` | OpenWorkspace/OpenPanel/TriggerQuickAction | 用例逐名或按正式 family 引用 |
| 状态 | verified/restricted/...；accepted/pending/confirmed/rejected/unknown | success/completed/healthy/ready | 只用正式 discriminant/axis |
| 写边界 | `OwnerCommandPort.submit` | generic API write/dispatch success | 唯一 owner write |
| 配置 | 四个 exact keys；三个 exact profiles | dev/test/staging profile、Provider Contract | 环境角色与 profile 分离 |
| 证据 | `EV-CAND-*-001` candidate；future `EV-*-001` family | 手写 EV passed、latest report | instance 必须 fixed-run artifact/report/digest |

## 10. 冲突与修正表

| 冲突 ID | 位置 | 类型 | 修正 | 状态 |
|---|---|---|---|---|
| `ISSUE-CON-05-001` | Step 5/6 | candidate 名可能误读为已有 evidence | 统一改为 `EV-CAND-*-001`；Step 13 单独定义 future `EV-*` family | 已修正 |
| `ISSUE-CON-05-002` | Step 9 | config/architecture suite 未显式列 TC/release check | 补 `TC-CONFIG-001～011`、`TC-ARCH-001～004` 与四个 release check 映射 | 已修正 |
| `ISSUE-CON-05-003` | 03 Step 4 | `§7.9` 重复 | 依赖绑定表改为 §7.10 | 已修正 |
| `ISSUE-CON-05-004` | 正式 03 §4 | planned test paths 只在 §15 摘要 | 增加 §4.4 scripts/artifact/report planned boundary | 已修正 |
| `ISSUE-CON-05-005` | Step 10 | 专项另造 candidate family | 归并到正式八个 `EV-CAND-*` family | 已修正 |
| `ISSUE-CON-05-006` | 旧正式 05 | workspace/panel/provider/framework/固定阈值污染 | full-restart，不继承任何旧正文或编号 | 已关闭；正式正文只保留抽象历史污染结论 |

## 11. 正反例

正确：`TC-INTENT-008` 控制 dispatch 边界；possible dispatch 后只断言 `unknown`、`OwnerCommandPort.submit` 不自动重发，并把未来证据绑定固定 run 的 FLOW family。

错误：收到 2xx/toast 后断言 command completed，再自动重试一次并把截图手写成 `EV-FLOW-001 passed`。错误原因是 phase 越界、重复副作用和静态造证据。

正确：`TC-TOPIC-002` 注入单 owner unavailable，同时保留 sibling safe result，并逐 partition 呈现，不生成全局 health/readiness。

错误：任何一个 owner 成功就把 Governance/Workspace/Capability/Archive/Sandbox 页面标为 normal。错误原因是局部失败被掩盖且 Console 推导 owner truth。

正确：`TC-CONFIG-005` 验证 `production-pending` 仍为 pending/fail-closed；profile、四项 config 与 run report 都不能独立证明 readiness。

错误：因 profile 名含 production 且 release script 退出 0，就直接写 signoff。错误原因是配置姿态、测试结果和验收裁决三层混同。

## 12. 正式装配计划与预审结论

| 批次 | 章节 | 来源 | 预审 |
|---|---|---|---|
| 15.1 | §1～§4 | Step 1～4 | pass |
| 15.2 | §5～§6 | Step 5～6 | pass；保留 96 TC 全集或精确展开入口 |
| 15.3 | §7～§10 | Step 7～10 | pass |
| 15.4 | §11～§14 | Step 11～14 | pass |
| 15.5 | §15 + 全文静态审计 | 全部 Step/标准 | pass |

正式文档必须恰好包含 §1～§15，每章开头有具体 calibration 来源和延伸阅读；正文不得含 SOP 问答、旧材料诊断、过程停审表或执行结论。96 个 TC 保留稳定 ID、前置/操作/断言/姿态，blocked positive 不压平。完成后执行章节、来源、TC 唯一性、5+16+1、Query no-write、配置/profile、EV/run-bound、历史污染和 `git diff --check` 审计。

跨文档复核结论：`pass / formal_05_full_restart_allowed`。正式 05 已完成 full-restart 重建并进入停审。

## 13. 正式装配结果与最终审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 章节主链 | pass | 一级编号章节恰好 §1～§15，名称与测试方案书写规范一致 |
| calibration 追溯 | pass | 15/15 章节均引用具体 Step 文件并给出延伸阅读 |
| 用例完整性 | pass | 96 个唯一 `TC-<FAMILY>-<NNN>`；§6 保留前置/操作、断言和姿态 |
| 协议 / side effect | pass | 5 Command、16 Query、1 conditional consumer、0 Event、0 Job；Query write=0；唯一 owner write=`OwnerCommandPort.submit` |
| 模块 / 状态 | pass | 十模块；exact-scope、whole-record、session-volatile；ambiguous→unknown/no replay |
| 配置 | pass | 恰好四项 exact keys、三个 exact profiles；环境角色未写成 profile |
| suite / path | pass | gate/check/report 与 artifact/report roots 全部为 `planned / not_created`；禁止 `latest` |
| evidence | pass | 八个 `EV-CAND-*` 与八个 future `EV-*-001` 分离；instance 必须 run/suite/artifact/report/digest 绑定 |
| blocker | pass | `CON-Q-034～047`、formal positive、observed invalidation、durability、browser/AT、diagnostic、量化与相邻产品均保持 blocked/conditional/residual |
| 历史污染 | pass | 正式正文未继承旧对象、provider/服务端模型、旧 TC、固定控制项数量、框架或阈值；具体旧对象名称不留在正文 |
| 执行事实 | pass | 无实现仓、测试执行、run、artifact、report、evidence instance、coverage、verdict、signoff 或 readiness 声明 |
| Markdown / whitespace | pass | `git diff --check -- projects/L5-console` 无输出 |

最终结论：Step 15 `done / pass / self_reviewed / formal_stop_review`。正式 05 写入关闭；不得进入 06，等待用户明确授权。
