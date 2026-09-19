# Step 17. 详细设计到实施计划的承接清单

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 17  
> 一致性规范：`standards/document/设计文档讨论中间产物规范.md` §5.10  
> 回填章节：未来正式 `03-详细设计.md` §16  
> 粒度参考：`projects/L1-governance/design-calibration/03_ddd_step_17_implementation_handoff.md`  
> 状态：`done / pass / self_reviewed`

## 1. 目标与边界

本 Step 把 Step 1～16 的实现契约整理为未来 `07-实施计划.md` 可引用的承接输入，并从 Step 5 开始预审字段、协议、Query response、状态、命名和 phase boundary。它不是实现开工许可，也不写 phase、任务、commit boundary、排期、TC/EV 编号、实现仓文件或提交记录。

Console 是 TypeScript 浏览器客户端，拥有交互状态而非 Domain aggregate。通用复核表中的 `Domain 对象` 在本项目适配为“client-owned object / formal-derived safe view”；Outbound Event、Operations Job、DB/repository/UoW/projection/outbox 明确不适用，不能为满足模板而新增。

## 2. 输入与批次

| 输入 | 状态 | 承接用途 |
|---|---|---|
| 正式 `00/01/02` | formal stop review | 用户行为、架构红线、五部分骨架和 03 回退规则 |
| Step 1～4 | done | 上游、范围、TypeScript/runtime、planned repo/file layout |
| Step 5～7 | done | 十模块、对象字段/状态、narrow ports/adapters |
| Step 8～10 | done | 5 Command、16 Query、1 conditional consumer、flows、状态矩阵 |
| Step 11～15 | done | carrier/一致性、错误、并发、配置绑定、diagnostics/audit boundary |
| Step 16 | done | 最小测试切口和 Step 5～15 首轮覆盖审计 |
| TypeScript/目录/实施计划规范 | read | 编码、布局、下游承接与 phase/commit boundary 边界 |

| 批次 | 内容 | 状态 |
|---|---|---|
| 17.1 | SOP 回答、真相源和实施承接/阅读清单 | done |
| 17.2 | 字段、Command/Consumer 构造、Query response、public carrier 闭环 | done |
| 17.3 | 状态、phase boundary、命名和冲突修正 | done |
| 17.4 | 正反例、未进入实施项、回填和门禁 | done |

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 哪些契约足以进入实施计划？ | fail-closed 的模块/对象/port/protocol/flow/state/carrier/error/concurrency/binding/diagnostic/test skeleton 可被 `07` 引用；positive production adapter、owner command/consumer activation 因 formal contracts pending，不可排入可交付实现边界。 |
| 实施者需先读什么？ | 正式 `00～03`、03 Step 1～19、未来正式 `04/05/06/07`、TypeScript/目录/实施计划/真相闭环规范、目标实现仓规范与历史（仓建立后）。 |
| 提交、git config、编码和注释是否列入？ | 已列：TypeScript 规范替代 Rust 规范；导出符号 JSDoc；git identity 当前为 `quantalithos-labs <quantalithos.ai@gmail.com>`；实现仓 commit 使用英文，但目标仓更严格规范仍待仓建立后确认。本轮不提交。 |
| 字段是否能回指来源/构造？ | 客户端关键对象组已由 Step 6 §16.3～16.4 回指 local input、formal observation、mapper 或 factory；本 Step §8 复核。exact owner DTO 字段未闭口，因此相关 positive construction 明确 blocked，而非“通过”。 |
| Command/Event/Job 能否构造目标？ | 4 个 local/orchestration Command 的客户端对象闭合；delegated submit 的 local shell 闭合、owner DTO blocked；consumer candidate envelope blocked for activation；Outbound Event/Job 不适用。见 §9。 |
| Query response/view/page/marker 是否闭合？ | 16 Query 的 client request/response union、safe view/ref 和 empty/blocked/unavailable/unknown 口径闭合；owner exact DTO/page cursor 不闭合且不由 Console定义。见 §10。 |
| 状态名是否一致？ | Step 6/10/16 一致；未来 `05/06/07` 必须逐字引用，旧 `03/05/06` 状态不得复用。见 §12。 |
| phase/commit boundary 是否越界？ | 当前不定义 phase/commit；正式 `07` 必须按每个 boundary 做整体审计，且不能把 blocked positive adapter/consumer 或未来 evidence 提前使用。见 §13。 |
| 哪些旧名/别名有风险？ | 旧 `ConsoleWorkspace/PanelState/UnifiedSummaryCard/WorkspacePreference`、Rust/API/DB/projection/Provider 主线全部禁用；当前正式名以 Step 5～10 为准。见 §14。 |
| 哪些内容不能实施？ | exact owner contracts、安全字段与资格、idempotency/reconciliation/cancel boundary、invalidation、state medium、diagnostic/host/framework/browser/a11y/quantitative authority、正式 `04～07` 和目标仓均未闭合。 |
| `07` 如何引用而不复制？ | 按 boundary 引用正式 03 章节及 Step 文件，用作 required reads、allowed scope、暂停条件和验证门禁；不得复制 schema/状态矩阵形成第二真相。 |
| 是否给 07 提供足够审计输入？ | 对 fail-closed skeleton 是；§7～15 给出真相源、字段/协议/Query/状态/命名/phase 输入。positive production implementation 仍由显式 blocker 阻断。 |

## 4. 当前问题诊断与取舍

| 位置 | 问题 | 本 Step 处理 |
|---|---|---|
| 旧正式 `03` | 历史 Rust 服务端/DB/projection/旧对象主线，不能移交实现 | Step 19 整体重建，不局部修补 |
| 旧正式 `05/06` | 可能引用旧对象/状态/指标/evidence | 后续 full-restart；当前不作为测试/验收真相 |
| 目标实现仓 | `/home/aris/Projects/quantalithos-console` 尚不存在 | 阻塞代码开工，不阻塞设计装配 |
| owner contracts | Step 8 只能闭合 safe client shell | exact positive adapter/command/consumer boundary 标 blocked |
| 通用复核模板 | 默认 Domain/Event/Job/repository 语义 | 适配为 client object/view；不适用项明示，不引入服务端主语 |
| 正式 `04/07` | 当前不存在 | 配置填写与 phase/commit boundary 不由本 Step预写 |

取舍：正式 03 将是阅读入口，但字段级 truth 继续位于 calibration Step；`07` 通过索引引用而不是复制。未闭口项不能使用“fake 先过”进入 production boundary；fake 只允许验证安全 union/parity，并且不得生成 readiness。

## 5. 实施承接关系

```text
formal 00 -> formal 01 -> formal 02
                      -> DDD Step 1..18
                      -> Step 19 formal 03
                      -> formal 04 -> formal 05 -> formal 06 -> formal 07
                      -> target repo (currently not_created)
```

- Step 17 只提供 `07` 输入，不代表可开工。
- 正式实现移交需要 `03/04/05/06/07` 全部完成，且 `07` 对每个 phase/commit boundary 完成交付前闭环审计。
- 任何需要 exact owner schema、framework、storage 或量化阈值的 boundary 都必须等对应 authority，不能由实现者自行补齐。

## 6. 实施承接清单

| 承接项 | 已定义位置 | 实施者 / `07` 如何使用 |
|---|---|---|
| 上游与非范围 | Step 1/2；正式 00/01/02 | 固定 SDK-only、client truth、owner truth 和禁止依赖；禁止扩域 |
| TypeScript/runtime/依赖 | Step 3/4/14 | 确认目标仓、package/build authority 后建立 package；保留 framework pending，不引入 sibling private source |
| 十模块与文件轴 | Step 5；Step 4 | 将 boundary 映射到 `entry/access/navigation/views/intent/features/recovery/adapters/state/diagnostics`，不重命名成旧模块 |
| 客户端对象/字段/状态 | Step 6 | 按对象 factory/readonly union/字段来源落码；缺 formal source 时停在 blocked |
| Port/Adapter | Step 7 | consumer-owned narrow interfaces、fake/formal parity、取消/unknown/redaction；不得泛化成全能 SDK port |
| Protocol | Step 8 | 5 Command、16 Query、conditional consumer；Event/Job N/A；owner exact surface 未到不得激活 |
| Function flow | Step 9 | 按调用/副作用顺序实现；Query no-write；唯一 owner write 是 submit；formal call 与 local install 分离 |
| State machine | Step 10 | 使用唯一正式状态名和 formal-only positive recovery；本地仅收紧 |
| Carrier/consistency | Step 11 | scoped session-volatile、whole-record replace、single-writer；不引入 DB/repository/CAS 假设 |
| Error/recovery | Step 12 | typed errors、partial isolation、explicit recovery、unknown/no replay、forbidden body zero-entry |
| Concurrency/idempotency | Step 13 | correlation guard、single-flight、canonical partition order；owner key/digest/window 等待正式合同 |
| Config/dependency binding | Step 14 | 未来 `04` 只绑定 narrow ports；配置不得改变安全和状态不变量 |
| Diagnostics/audit | Step 15 | optional body-free diagnostics；sink failure isolated；无 Console formal audit/evidence |
| Test cuts | Step 16 | 未来 `05/07` 映射到 test/commit gate；不得把 planned cut 写成执行结果 |

## 7. 实施前置阅读清单

| 文档 | 阅读目的 |
|---|---|
| `projects/L5-console/00-需求文档.md`～`03-详细设计.md` | 获取行为、架构、概要与 Step 19 后的正式实现入口 |
| `projects/L5-console/design-calibration/03_ddd_step_01*`～`03_ddd_step_19*` | 获取字段、port、protocol、flow、状态、carrier、错误、测试和审查细节 |
| 未来正式 `04/05/06/07` | 获取配置填写、完整测试、验收和 phase/commit boundary；未完成前不得开工 |
| `standards/coding/typescript.md` | 命名、ESM、JSDoc、readonly、具名导出、严格类型和测试代码规则 |
| `standards/document/子项目目录与代码文件组织规范.md` | 实现仓、文件、测试、artifact/report/script 目录边界 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 字段/DTO/状态/phase boundary 与交付前审计规则 |
| `standards/document/实施计划书写规范.md` 与 SOP | `07` 的阶段、commit boundary、门禁、台账和暂停纪律 |
| `projects/README.md` §1.1 及目标仓规范/历史 | 确认 `/home/aris/Projects/quantalithos-console`、提交语言与更严格规则；目标仓建立后再核实 |

实施前需再次核实项目级 `git config user.name/user.email`；本设计仓当前读数为 `quantalithos-labs` / `quantalithos.ai@gmail.com`，不等于尚不存在目标仓已配置。TypeScript 实现的 identifier、JSDoc、普通注释和测试名使用英文；实现仓 commit subject/body 使用英文并服从目标仓更严格规范。用户未要求，本轮不提交。

## 8. 真相源表与字段闭环

### 8.1 真相源表

| 设计事实 | 真相源 | 章节 / Step | 后续消费者 | 冲突处理 |
|---|---|---|---|---|
| 模块/文件职责 | Step 4/5 | planned layout；module axis | 正式 03、07、目标仓 | 不增删/重命名模块；先回设计 |
| client object/字段/状态 union | Step 6 | 各对象卡；§16 审计 | Step 7～10、05/06/07、代码 | Step 6 为字段级来源；不得在 DTO/测试补字段 |
| port/adapter/error/cancel | Step 7 | 十模块 port 契约 | Step 8/9、04/05/07、代码 | consumer-owned narrow port 优先；不得以 adapter 实现改接口 |
| application-local protocol | Step 8 | 5+16+1 inventory/schema | Step 9/16、正式 03、代码 | Step 8 为 public surface；exact owner DTO 另属 owner contract |
| 调用/副作用顺序 | Step 9 | 逐 flow | Step 11～13/16、代码 | 冲突回 Step 9，不由代码调整边界 |
| 客户端正式状态名 | Step 6 + Step 10 | union + matrices | 05/06/07、代码 | Step 10 转换矩阵与 Step 6 值需同时一致 |
| carrier/一致性 | Step 11 | scoped carrier | 04/05/07、代码 | 不引入 repository/DB/CAS；变更回 Step 7/11 |
| error/recovery/concurrency | Step 12/13 | taxonomy/matrices | 05/06/07、代码 | unknown/no replay/single-writer 不得实现侧放宽 |
| config/diagnostic binding | Step 14/15 | typed binding/whitelist | 04/05/07、代码 | 配置只选择/收紧，不得改变 truth/security |
| 最小测试切口 | Step 16 | §§6～15 | 05/06/07 | 不把 planned cut 当通过结果 |

### 8.2 关键字段族闭环表

本项目没有 Domain aggregate；下表审计 client-owned objects 与 formal-derived safe views。完整逐字段来源仍以 Step 6 §16.3～16.4 为准。

| 客户端对象 / view | 字段族与类型 | 字段来源 | 构造入口 | DTO / observation 字段 | 缺失处理 | 测试切口 | 验收证据 |
|---|---|---|---|---|---|---|---|
| `AccessContext` | context/local ref、actor/scope/visibility owner refs、lifecycle union | local ref source + formal context observation | create unresolved/resolved/invalidate/restrict functions | `AccessContextQueryInput/Observation` | restricted/unknown/blocked；不构造 verified | Step 16 access/context | 后续 06 定义，当前无 evidence |
| `OwnerViewSnapshot` / `OwnerViewModel` | owner、source/version、source axes、safe payload/ref | formal safe query material + mapper + local snapshot ref | snapshot/view composer | `OwnerQueryInput/Observation` | explicit empty/blocked/unavailable/unknown；forbidden whole reject | owner view query cut | 后续 06 |
| `DraftIntent` | draft/context/target refs、typed field collection、issues、state | user local input + formal field keys | create/edit/validate/submit/discard | local Command request；owner DTO only after formal mapper | unsafe/missing field reject；owner contract absent blocked | intent/draft cuts | 后续 06 |
| `RequestPresentation` / `ResultReference` | request/context/command/receipt/result refs、phase/state | same submit attempt + formal command/reconciliation observation | create submitted/apply receipt/result/unknown | `SubmitControlledIntent` + owner observation | ambiguous/cancel→unknown；no result→not terminal | submit/reconcile cuts | 后续 06 |
| `TopicActivationState` | topic/owner/mode/capability/facets/posture/reason | static descriptor + formal contract/capability observation | activation mapper/evaluator/tightener | `TopicContractReadInput/Outcome` | pending/blocked；positive posture requires capability | activation exhaustive cut | 后续 06 |
| `TopicPageModel` | route/topic/context/owner views/regions/a11y bindings | validated local page contract + per-owner safe views/status | topic/page composition ports | 8 topic Query responses | preserve per-owner partial/blocked/unavailable/unknown | topic query cuts | 后续 06 |
| `RecoveryPlan` / `AccessibilityState` | subject/plan/action/blocked reason/focus/announcement/channel bindings | degradation + current context/request/draft + page binding | recovery/a11y factories/mappers | `ApplyRecoveryAction` | stale/mismatch/action blocked；host failure isolated | recovery+a11y cuts | 后续 06 |
| `ClientStateRecord` | scope/state refs、navigation/pages/drafts/requests/recoveries/markers | validated Console objects only | record factory + full replace/invalidate/clear | local Commands/caller installation | reject whole record、clear scope、reload on ambiguity | carrier cuts | 后续 06 |
| `DiagnosticContext` | diagnostic ref、phase、safe outcome、optional typed refs、redaction marker | approved candidate fields only | factory→redaction gate→optional sink | none（非业务 protocol） | reject before sink or disabled/failed isolated | diagnostic cuts | 不构成验收 evidence |

字段复核结论：local/client字段可落码；所有 formal-derived positive 字段都有“formal observation 或 blocked”分支。exact owner payload/schema 没有被 Console schema 替代。`验收证据` 当前只能指向未来 06，不能伪造 EV/AC ID。

## 9. Command / Consumer / Event / Job 构造闭环

| 输入契约 | 目标客户端对象 / side effect | 必填字段是否齐全 | 派生字段来源 | 不得混同 | 缺失时行为 | 关联 flow |
|---|---|---|---|---|---|---|
| `RequestAccessContextSwitch` | next `AccessContext`、clean record、shell | client shell 齐；positive context 依赖 formal observation | context resolver | target local ref ≠ actor/scope/credential | restricted/blocked，保留/收紧旧 shell | context switch flow |
| `SaveClientPreference` | next `ClientStateRecord` | 是（仅 typed patch） | current scoped record + immutable replace | preference ≠ visibility/qualification/readiness | reject unsafe/scope mismatch/unavailable | preference flow |
| `DiscardDraftIntent` | discarded `DraftIntent` + record | 是 | existing draft transition | reason key ≠ owner reason/evidence | invalid transition/replace failure | discard flow |
| `SubmitControlledIntent` | local request presentation + one owner delegate | client shell 齐；owner DTO **否，blocked** | exact formal input mapper/idempotency authority 尚待 owner | operation/request ref ≠ owner request/idempotency key | submit 前 `missing-formal-surface`；可能 dispatch 后 unknown | submit flow |
| `ApplyRecoveryAction` | `RecoveryPresentation` + one narrow action | 是，按 plan/action branch | recovery guard + selected port + a11y mapper | retry-command ≠ generic retry；plan ≠ recovery proof | blocked/unknown；无第二 action | recovery flow |
| `ConsumeSdkInvalidationHint` | body-free marker + local tighten | candidate shape 有；active envelope/id/order/dedup **否** | formal SDK contract 未来提供 | contractRef/invalidationRef ≠ event id/cursor | 当前 disabled/pending-contract；零写入 | invalidation flow |
| Outbound Event | N/A | N/A | Console 无业务 truth | diagnostic ≠ event | 不创建 event/outbox | N/A |
| Operations Job | N/A | N/A | recovery 是用户显式 action | timer/requery ≠ job | 不创建 worker/scheduler/report/DLQ | N/A |

结论：4 个 local/orchestration Command 可实现 fail-closed client path；delegated submit 只可实现到“缺 formal contract 则阻断”的安全路径，不能排入 positive production integration。consumer 只可实现 disabled posture，激活必须回改 Step 7/8/9/13。

## 10. Query response / view 闭环

| Query family | Response / View | 关键字段来源 | empty / not-visible / degraded 口径 | public ref/page 规则 | 测试覆盖 |
|---|---|---|---|---|---|
| `ResolveAccessContext` | `QuerySurface<AccessContextObservation>` | formal context adapter | protected context blocked；transport unavailable/unknown；无猜测 empty | local operation/session/context correlation；formal owner refs opaque | Step 16 §8 |
| `GetNavigationVisibility` | `QuerySurface<TopicVisibility>` | formal visibility/qualification | restricted/disabled 是 value posture；missing contract blocked | topic/context exact match；route 不授权 | Step 16 §8 |
| `QueryOwnerView` | `QuerySurface<OwnerViewModel>` | formal safe material→snapshot/axes/view | formal empty only；disclosure blocked；owner unavailable/unknown preserved | `ClientPageWindow` local-only；无 owner cursor/repository key | Step 16 §8 |
| `GetSourceStatus` | `QuerySurface<SourceStatusAxes>` | validated snapshot/formal axes | local snapshot missing→empty；scope mismatch blocked；malformed unknown | axes independent；不输出 readiness | Step 16 §8 |
| `GetSafeLink` | `QuerySurface<SafeLinkReference>` | formal revalidation | formal no-link empty；revoked/not-visible blocked；unavailable/unknown | typed target ref only，无 URL | Step 16 §8 |
| `GetRequestPresentation` | `QuerySurface<RequestPresentation>` | scoped carrier exact ref | local missing empty；scope/corrupt blocked/unavailable | local request ref，不冒充 owner not-found | Step 16 §8 |
| `ReconcileRequestResult` | `QuerySurface<ResultReference>` | formal reconciliation | no surface blocked；unavailable/unknown preserved | formal result ref；零 submit/replay | Step 16 §8 |
| `GetTopicActivation` | `QuerySurface<TopicActivationState>` | formal capability/six facets | pending/blocked 可作为 value；malformed/unavailable conservative | topic/owner membership explicit | Step 16 §8 |
| 8 × `Query*Topic` | `QuerySurface<TopicPageModel>` | descriptor + activation + per-owner safe view + page/a11y composition | all formal empty 才 empty；任一 partial/blocked/unavailable/unknown 保留 | canonical owner order；client window only；无跨 owner cursor | Step 16 §9 |

16 个 Query request/response client schema 闭合，但 production positive fields 依赖 formal owner adapter。Console 没有 read model repository/projection/cursor id；因此规范模板中的 repository key 明确 N/A，而不是缺失后由实现者补一个。

## 11. Public protocol 传递类型闭环

| surface | 外层 DTO | 关键字段 | 传递类型 / 正式归属 | schema 位置 | 缺失 / duplicate / retry 口径 | 依赖边界 | 测试覆盖 |
|---|---|---|---|---|---|---|---|
| local Command | `*Request` + `LocalCommandOutcome<T>` | metadata、client object input | `ConsoleOperationMetadata`/client types；Step 6/8 | Step 8 §§3/5 | blocked/cancelled；local duplicate按状态/equality；无 owner retry | application local；除 submit 外零 owner write | Step 16 §7 |
| delegated Command | `SubmitControlledIntentRequest/Response` | draft/context/command/qualification/contract ref | client shell；owner DTO 正式归属 owner contract | Step 8 §5.4 | no mapper→blocked；ambiguous→unknown；no auto replay | only `OwnerCommandPort` | Step 16 §7 |
| Query | `*Request` + `QuerySurface<T>` | metadata + typed input；value/empty/blocked/unavailable/unknown | client public types；formal value via adapter | Step 8 §§3/6 | repeat read allowed；zero write；no idempotency record | narrow formal read ports | Step 16 §§8～9 |
| conditional consumer | `SdkInvalidationEnvelope` candidate + outcome union | contract/source/invalidation/context refs | candidate client need；formal envelope pending owner/SDK | Step 8 §7 | disabled current；duplicate only monotonic after activation；no retry queue | SDK port only；no bus direct | Step 16 §10 |
| Outbound Event / Job | N/A | N/A | N/A | Step 8 §8 | 不创建 | no bus/worker/scheduler | architecture cuts |
| diagnostics | `DiagnosticContextCandidate`→emission outcome | typed safe refs/enums only | diagnostics module；非业务 protocol | Step 7/15 | emitted/disabled/failed；no recursion/retry | optional sink；no audit owner | Step 16 §14 |

## 12. 状态闭环表

| 状态族 | 正式状态值 / posture | 产生与迁移入口 | 合法迁移摘要 | 禁止迁移 | 测试入口 | 验收引用 |
|---|---|---|---|---|---|---|
| context lifecycle | unresolved/verified/restricted/expired/revoked/conflict/unknown | context factories、formal resolve/invalidate、local restrict | formal observation 可建立/恢复；local only tightens | route/cache/carrier→verified | Step 16 §11 | 后续 06 |
| visibility/qualification | visible/restricted/disabled/unknown/unavailable；qualified/conservative postures | formal mapper + tightening | new formal observation 可重新计算；local 收紧 | UI/menu/flag→visible/qualified | Step 16 §11 | 后续 06 |
| navigation | empty/selected/restricted presentation | select/apply visibility/clear | guarded select、visibility cleanup、explicit clear | hidden/unknown→selected | Step 16 §11 | 后续 06 |
| source axes/ref validity | fresh/stale/expired/unknown；complete/partial/missing/not-covered；available/degraded/unavailable/unknown；coherent/conflict/unknown；current/stale/invalidated/revoked/unknown | safe material mapper/invalidation/new formal snapshot | local toward conservative；new formal material creates current snapshot | timer/cache/render→positive | Step 16 §11 | 后续 06 |
| draft | editing/invalid/reviewable/submitted/discarded | draft functions | edit/validate/submit/discard per matrix | submitted/discarded reopen | Step 16 §11 | 后续 06 |
| request/result | submitted/accepted/pending/confirmed/rejected/unknown | request factory、formal receipt/result/reconciliation、unknown marker | formal observation advances；ambiguity→unknown | receipt/toast→confirmed；unknown auto replay | Step 16 §11 | 后续 06 |
| activation | pending/read-only/partial/active/blocked | formal facet evaluator + local tightener | formal can map all；local can tighten | missing capability/context/facet→active | Step 16 §11 | 后续 06 |
| degradation/recovery | none/degradation；immutable allowed/blocked plan | degradation/recovery factories + formal recovery observation | non-normal→degradation；new formal observation修订；one action | timer/action completion→recovered；generic retry | Step 16 §11 | 后续 06 |
| carrier/shell | missing/loaded/unknown-to-caller；bootstrapping/presentable/restricted/closed | carrier ops；shell create/present/replace/close | exact-scope replace/invalidate/clear；safe present/restrict/close | load→formal positive；closed reopen | Step 16 §11 | 后续 06 |
| a11y/diagnostic | action enabled/disabled/hidden；emitted/disabled/failed | shared semantic mapper/host/sink | channel-equivalent recompute；per-emission result | host/sink result→business state | Step 16 §11/14 | 后续 06；diagnostic非 evidence |

结论：Step 6、Step 10、Step 16 的正式状态名和边界一致。后续 `05/06/07` 尚未重建，因此当前只能判定 detailed-design internal closure `pass`、downstream alignment `pending`。

## 13. Phase / commit boundary 闭环预审

| Phase / commit boundary | 可包含内容 | 明确排除 | 依赖前置 | 不得依赖后续 | 测试范围 | 验收范围 |
|---|---|---|---|---|---|---|
| 待正式 `07` 定义 | 仅可从正式 03 与校准 Step 引用已闭合的 fail-closed client object/port/flow/state；按模块或 vertical slice 分 boundary | 不在 Step 17 预写 phase/commit；不含 blocked production adapter、consumer activation、正式 evidence | Step 19 正式 03；后续正式 04/05/06；目标仓与工具事实 | 未闭口 owner DTO、storage/framework/browser matrix、未来测试/evidence、后续 boundary 才实现的对象 | 由 07 映射 Step 16 与正式 05 | 由 07 映射正式 06，不得伪造 |

正式 `07` 对每个 boundary 必须重新检查：字段/DTO/Query/状态、required ports、formal contract availability、测试与验收引用、是否用了后续 boundary 的结果、适用的可落码经验项，并给出 `pass / not-applicable / blocker`。当前 Step 17 的预审不能替代该门禁。

## 14. 命名一致性与冲突修正

### 14.1 命名一致性表

| 名称类型 | 正式名称 | 禁用旧名 / 口语名 | 旧出现位置 | 修正要求 |
|---|---|---|---|---|
| module axis | `entry/access/navigation/views/intent/features/recovery/adapters/state/diagnostics` | workspace/panel/provider/service/repository/projection/publisher/worker | 旧 03/README/draft | Step 19 不继承；实现只用 Step 5 模块名 |
| session shell | `ConsoleSessionShell` + `presentable/restricted/...` | `ConsoleWorkspace`、workspace ready | 旧 03 | 禁止把 shell 当 workspace/owner/readiness truth |
| view/page | `OwnerViewSnapshot/OwnerViewModel/TopicViewModel/TopicPageModel` | `PanelState`、`UnifiedSummaryCard`、unified healthy view | 旧 03 | 保留 owner partition 和 source axes |
| preference/state | `ClientStateRecord` + typed patch | `WorkspacePreference`、server preference truth | 旧 03 | 仅 client-owned scope/whole-record carrier |
| protocol counts | 5 Command、16 Query、1 conditional consumer、0 Event、0 Job | 旧 RPC/MQ/API 数量与 Provider Contract | 旧 03/README | 正式 03 逐项使用 Step 8 inventory |
| formal result | submitted/accepted/pending/confirmed/rejected/unknown | success/completed/ready from receipt/toast | 历史材料 | 使用 Step 10 状态，不从 UI 推断 |
| activation | pending/read-only/partial/active/blocked | enabled/ready/available 全局布尔 | 历史材料 | `active` 只表示 owner consumption posture |
| persistence | `ClientStateCarrierPort` / session-volatile | DB/repository/table/projection/cache truth | 旧 03 | repository/DB/CAS 术语不得回流 |
| observability | diagnostic emitted/disabled/failed | audit/evidence/report/verdict/readiness | 旧 03/05/06 | diagnostic 不构成正式证明 |

### 14.2 冲突与修正表

| 冲突 ID | 位置 | 类型 | 影响 | 修正 | 状态 |
|---|---|---|---|---|---|
| `CON-DDD-17-001` | 旧正式 03 vs Step 1～16 | 历史主线冲突 | 正式实现入口 | Step 19 全量重建 18 章 | pending Step 19 |
| `CON-DDD-17-002` | 旧正式 05/06 vs 新状态/测试切口 | 下游漂移 | 测试/验收门禁 | 后续依序 full-restart | pending later docs |
| `CON-DDD-17-003` | Step 8 client shell vs owner exact DTO | schema incomplete | positive production adapters/submit | 保持 blocked，等 owner formal contract 后回改 Step 7～9 | open blocker |
| `CON-DDD-17-004` | candidate invalidation envelope vs formal SDK event | activation incomplete | consumer 正向分支 | disabled；等 id/version/order/dedup 后回改 Step 7/8/9/13 | open blocker |
| `CON-DDD-17-005` | target repo/package/framework absent | implementation environment | code start/file reality | 正式 04/07 与目标仓 authority 关闭 | open blocker |
| `CON-DDD-17-006` | formal 03摘要 vs calibration detail | potential reader under-specification | 1:1 implementation | 正式每章保留精确来源与 required-read rule | pending Step 19 |

本次审查未发现 Step 5～16 内部需要立即回改的字段或状态冲突；冲突均是历史污染、下游未重建或已显式 external blocker。

## 15. 正反例

正确：

```md
| Boundary | Required design | Allowed implementation | Blocker |
|---|---|---|---|
| fail-closed owner view seam | Step 6 OwnerViewModel;Step 7 OwnerQueryPort;Step 9 QueryOwnerViewFlow | typed union、safe mapper、blocked/unavailable/unknown 与 fake parity | positive formal mapping waits for exact owner contract |
```

它只引用设计真相、允许安全骨架，并把 production success 显式阻断。

错误：

```md
Implement the console provider and make all dashboards ready.
Use the current SDK unknown payload and add fields when needed.
```

它恢复 Provider/全局 readiness 旧主线，让实现者自行补 schema，并把 SDK package 存在误当合同存在。

## 16. 未进入实施的待确认项

| 项 | 当前状态 | 阻塞范围 | 未确认前处理 |
|---|---|---|---|
| Step 19 正式 03 | historical material 尚未替换 | 正式设计移交 | 完成 Step 18/19；不得按旧 03 开工 |
| 正式 04/05/06/07 | 未启动或旧历史材料 | 配置、验证、验收、phase/commit | 严格按文档顺序重建；当前不预写 |
| 目标实现仓 / package / tooling | repo not_created；选择 pending | 所有代码与测试写入 | 等 07 前置门禁；不创建仓 |
| owner exact contracts 和安全字段 | open/pending | positive query/command/result/link/activation adapter | fail closed；不得用 unknown/private schema |
| owner idempotency/reconciliation/cancel dispatch | open/pending | delegated command/replay | no production submit/replay；unknown only |
| SDK invalidation contract | open/pending | consumer activation | disabled/no-write |
| carrier medium/lifecycle | session-volatile only | configured persistence/cross-session | 不承诺 durability/TTL/migration |
| framework/router/browser/a11y matrix | open/pending | concrete UI/host/compatibility | framework-neutral semantic contracts only |
| diagnostic sink/envelope/metrics vocabulary | open/pending | production diagnostics/operations | disabled optional；无阈值/readiness |
| 未停审 L5/L6 link/ref | pending | peripheral navigation | 不进入本仓 truth或主链 |

## 17. 回填草稿

未来正式 `03-详细设计.md` §16 应说明：实施计划必须引用正式 03 及对应 Step，而非复制字段/schema/状态；fail-closed client skeleton 与 blocked production integration 必须分开；实现者开工前必须读 TypeScript/目录/闭环/实施规范，核实目标仓、工具、git config 和目标仓提交规范；`07` 必须按每个 phase/commit boundary 对正式 `03/05/06/07` 重做整体可落码审计。

## 18. 三层门禁与结论

| 门禁 | 条件 | 结论 |
|---|---|---|
| Step | §5.10 十类产物已适配输出；字段/Command/Query/state/命名/phase 预审可判定 | pass |
| 文档 | 可供 Step 18/19 与未来 07 引用；没有写任务/排期/commit 或伪造 evidence | pass |
| 项目 | blocker 保真；正式 03 仍关闭；实现与提交仍禁止 | pass |

Step 17 `done / pass / self_reviewed`。它证明 fail-closed 详细设计主链可被正式 03 和未来 07 承接，不证明 production integration 或实现 readiness。下一步允许更新 flow/ledger 后进入 Step 18；未创建实现仓、实现台账、boundary skeleton、测试结果、artifact、report、evidence、verdict、signoff 或 commit。
