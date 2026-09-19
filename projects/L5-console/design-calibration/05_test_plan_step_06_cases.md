# Step 6. 设计测试场景与用例矩阵

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 6
> 回填章节：`05-测试方案.md` §6
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_06_cases.md`
> 状态：`done / pass / self_reviewed`

## 1. 目标与事实边界

本 Step 把 Step 5 的追溯矩阵按 19 个 cut 落成稳定、可触发、可断言的 TC 合同。每个 P0 TC 都给出前置、操作、预期与精确断言；positive owner contract 缺失的用例保留 `blocked-positive`，并由对应 fail-closed 用例证明当前安全姿态。

本文件没有测试实现、fixture 文件、runner、suite、run_id、artifact、report 或执行结果。`EV-CAND-*` 仍是 future candidate bundle 槽，`planned`/`pass` 只描述设计审查，不描述测试 verdict；正式 `EV-*` family 由 Step 13 定义且仍需真实固定 run 才能实例化。

## 2. 输入与统一执行纪律

| 输入 | 用途 |
|---|---|
| Step 5 | TC 候选族、需求/AC/VETO 与 future EV 映射 |
| 03 §5～§8 | 十模块、对象/Port、5 Command、16 Query、consumer |
| 03 §9～§12 | 正式状态、carrier、一致性、错误、并发、replay 边界 |
| 03 §13～§15 | 配置绑定、diagnostic/a11y、最小切口 |
| 04 §5～§12 | 四项配置、三 profile、strict/zero-secret/startup-only/failure |

统一规则：

- 所有异步 fake 都记录 port call ledger、输入 safe shape、取消点与返回顺序；不记录 forbidden body。
- 所有 Query 共用 `query_no_write_invariant`：`OwnerCommandPort.submit`、carrier `replace/invalidate/clear` 调用均为 0。
- 除 `SubmitControlledIntent` 外所有 Command 的 owner-write 调用为 0；该 Command 每个 action key 至多调用一次。
- `QuerySurface`、`LocalCommandOutcome`、`RequestPresentation`、正式状态与 `ConsolePortErrorKind` 逐字采用 03。
- future EV 只有在真实 suite artifact/report 生成后才可实例化；本 Step 只绑定 bundle 槽。

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| P0 正向主线如何执行？ | 纯规则用 factory/table；flow 用 deterministic fake Ports；composition 用可控 owner partition/host/carrier/sink；formal positive fixture 缺失时只执行 blocked/no-call 主线。 |
| 关键反向/边界如何触发？ | 通过 missing/mismatched ref、失效 context、forbidden field/body、malformed safe material、carrier/host/sink failure、完成顺序反转、cancel dispatch boundary 与 unknown outcome 注入。 |
| 非法状态如何断言？ | 返回 `invalid-state-combination` 或 `consistency-defect`，状态不变，禁止的 port 调用计数为 0；formal-derived positive 只能由新 formal observation 产生。 |
| “事务回滚”如何适配 Console？ | 本仓无 DB/UoW；验证 formal side effect 与 local replace 非原子：local failure 不补偿 owner、不重发；carrier uncertain completion 必须 reload。 |
| 恢复如何复现？ | 用 expired/stale/unavailable/unknown、stale plan、missing reconciliation、host failure 与 carrier ambiguity；只允许 subject-specific action。 |
| 是否提前写后续 phase？ | 否。receipt 不提前写 confirmed，action completion 不提前写 recovered，profile validation 不提前写 ready，EV 槽不提前写 passed。 |
| 每个 cut 是否有正向和负向？ | 19/19 均有当前可执行的安全主线和关键负向；受阻 formal positive 另列 blocker。 |

## 4. 用例批次与场景总览

| 批次 | Cut | TC 范围 | 场景类型 | Future EV | 停审 |
|---|---|---|---|---|---|
| 6.1 | ENTRY/ACCESS/NAV | `TC-CTX-001～005`;`TC-NAV-001～004` | 正向、失效、cleanup、late result | UNIT/FLOW/SECURITY | pass |
| 6.2 | VIEW/QUERY | `TC-VIEW-001～009` | value/empty/blocked/error、axes、no-write | UNIT/FLOW/CONTRACT | pass |
| 6.3 | INTENT/COMMAND | `TC-INTENT-001～011` | draft、5 Command、phase、unknown/no replay | UNIT/FLOW/CONTRACT | pass_with_positive_blocker |
| 6.4 | TOPIC | `TC-TOPIC-001～012` | activation、八 Query、partial/empty/order | FLOW/INTEGRATION | pass_with_positive_blockers |
| 6.5 | RECOVERY/ERROR/A11Y | `TC-RECOVERY-001～005`;`TC-A11Y-001～004` | typed errors、one-action、semantic equivalence | FLOW/ACCESSIBILITY | pass_with_compatibility_blocker |
| 6.6 | ADAPTER/CONSUMER | `TC-ADAPTER-001～006` | parity、mapping、availability、disabled invalidation | CONTRACT/INTEGRATION | pass_with_observed_branch_blocked |
| 6.7 | STATE/STATE-MATRIX | `TC-STATE-001～008` | exact scope、whole record、11 subjects | UNIT/FLOW | pass |
| 6.8 | CONSISTENCY | `TC-CONSISTENCY-001～008` | writer/order/single-flight/cancel/race | FLOW/INTEGRATION | pass |
| 6.9 | DIAG/SEC | `TC-DIAG-001～004`;`TC-SEC-001～005` | whitelist/redaction/minimum disclosure/VETO | UNIT/SECURITY | pass |
| 6.10 | CONFIG | `TC-CONFIG-001～011` | schema/profile/builder/change/rollback | UNIT/INTEGRATION/SECURITY | pass |
| 6.11 | ARCH | `TC-ARCH-001～004` | SDK-only、0 Event/Job、唯一 write | ARCH/RELEASE | pass |

## 5. ENTRY / ACCESS / NAV 用例

| TC | 场景 / 前置 | 输入 / 操作 | 预期与断言 | 自动化 | EV |
|---|---|---|---|---|---|
| `TC-CTX-001` | unresolved context；formal resolver 返回每个 lifecycle fixture | 执行 `ResolveAccessContext` | `QuerySurface` 保留 `verified/restricted/expired/revoked/conflict/unknown`；不安装、不写 carrier | required | `EV-CAND-FLOW-001` |
| `TC-CTX-002` | current shell 与新 formal `verified/restricted` observation | 执行 `RequestAccessContextSwitch` | 旧 scope cleanup→shell/context replace→host present；owner write=0；host failure 不撤销 cleanup | required | `EV-CAND-FLOW-001` |
| `TC-CTX-003` | context missing/mismatch/revoked/cancel | 执行 context switch 或受保护 flow | outcome `blocked/cancelled`，shell 为 restricted/minimal；受保护披露、submit、旧 ref 复用均为 0 | required | `EV-CAND-SECURITY-001` |
| `TC-CTX-004` | context A query 未完成，随后切到 B | 反序完成 A/B observation 并尝试安装 | A 结果因 captured refs 不 current 被丢弃；B scope 不被污染 | required | `EV-CAND-INTEGRATION-001` |
| `TC-CTX-005` | shell 为 `closed` 或只有 carrier loaded | 尝试 reopen/present | `closed` 不重开；carrier load 不产生 `verified/presentable`；返回 typed block | required | `EV-CAND-UNIT-001` |
| `TC-NAV-001` | exact topic/context formal posture fixtures | 执行 `GetNavigationVisibility` | visible/restricted/disabled/unknown/unavailable 保真；route/menu 无 fallback；Query no-write | required | `EV-CAND-FLOW-001` |
| `TC-NAV-002` | guarded visible entry 与 safe route binding | visual/keyboard/direct-entry 分别选择 | 共用 guard，形成同一 selected semantic action；host navigate 不抬升 visibility | required | `EV-CAND-ACCESSIBILITY-001` |
| `TC-NAV-003` | selected/history 已存在，context 或 visibility 收紧 | apply cleanup / re-entry | sensitive selection/history 清空或 restricted；后退/直接 URL 不恢复旧 entry | required | `EV-CAND-FLOW-001` |
| `TC-NAV-004` | role string、flag、menu/button、cache hit 各单独存在 | 尝试选择/显示受限入口 | 均不能生成 `visible/qualified`；解释保持 minimum disclosure | required | `EV-CAND-SECURITY-001` |

## 6. VIEW / QUERY 用例

| TC | 场景 / 前置 | 输入 / 操作 | 预期与断言 | 自动化 | EV |
|---|---|---|---|---|---|
| `TC-VIEW-001` | owner-safe material 含完整正式 refs/axes | 执行 `QueryOwnerView` | 先 safe map 后 filter/window；`OwnerViewModel.owner` 与 source 保真；Query no-write | required | `EV-CAND-FLOW-001` |
| `TC-VIEW-002` | formal empty、blocked、unavailable、unknown 四组 fixture | 执行 `QueryOwnerView` | 四种 `QuerySurface` 不互换；empty 只来自 formal empty；旧 value 不伪装新 value | required | `EV-CAND-CONTRACT-001` |
| `TC-VIEW-003` | material 含 raw/hidden/credential/evidence body 或字段重复 | 执行 mapper/query | 整份受影响材料拒绝为 `forbidden-body/malformed-safe-material`；零 state/diagnostic body | required | `EV-CAND-SECURITY-001` |
| `TC-VIEW-004` | freshness/coverage/availability/consistency/ref-validity 笛卡尔样本 | 执行 `GetSourceStatus` | 各轴独立原样映射；不生成 health/compliance/readiness；mismatch blocked | required | `EV-CAND-UNIT-001` |
| `TC-VIEW-005` | current/revoked/not-visible/no-link target refs | 执行 `GetSafeLink` | current 返回 typed `SafeLinkReference`；其余 empty/blocked/unavailable/unknown；无 URL、无导航 | required | `EV-CAND-CONTRACT-001` |
| `TC-VIEW-006` | exact/missing/mismatch/corrupt local request record | 执行 `GetRequestPresentation` | exact 返回 body-free value；missing=local empty；mismatch/corrupt 不 reconcile/submit | required | `EV-CAND-FLOW-001` |
| `TC-VIEW-007` | pending/confirmed/rejected/unknown formal result fixtures | 执行 `ReconcileRequestResult` | 结果 ref/state 保真；surface missing→blocked；cancel/transport→unknown；submit=0 | required | `EV-CAND-FLOW-001` |
| `TC-VIEW-008` | capability、mode、six facets、context 组合 fixture | 执行 `GetTopicActivation` | 只产生 `pending/read-only/partial/active/blocked`；active 需全部正式前置；package/flag/page 不授权 | required | `EV-CAND-UNIT-001` |
| `TC-VIEW-009` | recording spies 包围 8 Core + 8 Topic Query | 逐一执行所有 value/empty/error 分支 | 16/16 Query 的 owner command 与 carrier write ledger 均为 0；diagnostic failure 不改返回 | required | `EV-CAND-FLOW-001` |

## 7. INTENT / COMMAND 用例

| TC | 场景 / 前置 | 输入 / 操作 | 预期与断言 | 自动化 | EV / 姿态 |
|---|---|---|---|---|---|
| `TC-INTENT-001` | exact-scope record 与 typed preference patch | 执行 `SaveClientPreference` | whole-record replace；相同 patch 可 unchanged；formal state/visibility/activation 不变，owner write=0 | required | `EV-CAND-FLOW-001` |
| `TC-INTENT-002` | patch 含 authority/readiness/raw body 或 scope mismatch | 保存偏好 | `forbidden-body/state-scope-mismatch`；carrier replace=0；无 coercion/partial merge | required | `EV-CAND-SECURITY-001` |
| `TC-INTENT-003` | draft 为 editing/invalid/reviewable/submitted/discarded | edit/validate/discard/submit 参数化迁移 | 合法边使用正式状态；terminal 不编辑/复活；reviewable 不等 qualified/authorized | required | `EV-CAND-UNIT-001` |
| `TC-INTENT-004` | nonterminal draft + controlled reason key | 执行 `DiscardDraftIntent` | draft→`discarded` 且 whole replace；owner calls=0；carrier failure不声称保存 | required | `EV-CAND-FLOW-001` |
| `TC-INTENT-005` | reviewable/current/qualified，但 exact mapper/contract ref 缺失 | 执行 `SubmitControlledIntent` | `blocked/missing-formal-surface`；`OwnerCommandPort.submit`=0；draft 不变为业务完成 | required | `EV-CAND-CONTRACT-001` |
| `TC-INTENT-006` | future exact formal fixture、同源 context/command/qualification | 执行一次 submit | 恰好一次 `OwnerCommandPort.submit`；映射 body-free request presentation | conditional | `EV-CAND-CONTRACT-001`;`blocked-positive: CON-Q-034/038` |
| `TC-INTENT-007` | owner observation 分别 receipt/pending/confirmed/rejected | 映射 submit/reconcile observation | phase 精确为 accepted/pending/confirmed/rejected；receipt/2xx/toast 不提前 confirmed | required with controlled formal-shaped seam | `EV-CAND-FLOW-001` |
| `TC-INTENT-008` | cancel before proven dispatch / cancel-timeout after possible dispatch | 执行 submit | 前者 blocked/cancelled；后者 `unknown` + `ambiguous-outcome`；自动 replay=0 | required | `EV-CAND-FLOW-001` |
| `TC-INTENT-009` | 同 action key 从 visual/keyboard/AT 同时触发 | 并发 submit | shared single-flight 使 submit≤1；其余入口 blocked/同一 pending presentation | required | `EV-CAND-INTEGRATION-001` |
| `TC-INTENT-010` | formal observation 已返回，carrier replace failed/ambiguous | 完成 submit continuation | 保留安全 observation并暴露 local failure；reload/reconcile 可用；submit 不重发 | required | `EV-CAND-INTEGRATION-001` |
| `TC-INTENT-011` | unknown request，reconciliation unavailable/available | 执行 `ReconcileRequestResult` | unavailable 保持 unknown/wait/exit；available 只按 formal result 更新；owner submit=0 | required | `EV-CAND-FLOW-001` |

## 8. TOPIC 用例

| TC | 场景 / 前置 | 输入 / 操作 | 预期与断言 | 自动化 | EV / 姿态 |
|---|---|---|---|---|---|
| `TC-TOPIC-001` | descriptor owner set + activation fixtures | 对每个 topic 执行参数化 composer | 输出始终按 `TopicDescriptor.ownerKeys` canonical order；完成顺序不影响 page | required | `EV-CAND-INTEGRATION-001` |
| `TC-TOPIC-002` | 一个 partition unavailable/conflict，siblings value/empty | 执行 topic query | 失败只标记对应 partition；不取消/覆盖 sibling，其他成功不掩盖失败 | required | `EV-CAND-INTEGRATION-001` |
| `TC-TOPIC-003` | all formal empty / one blocked / one unknown / one partial | 组合 page | 仅 all-formal-empty 且无非理想分支时 `QuerySurface.empty`；其余保留非空 posture | required | `EV-CAND-FLOW-001` |
| `TC-TOPIC-004` | identity/member-service safe/blocked fixtures | `QueryMemberManagementTopic` | 两 partition 保真；无 lifecycle/role/body 推导；positive owner value conditional | required safety | `EV-CAND-FLOW-001`; positive `CON-Q-034/037` |
| `TC-TOPIC-005` | work/process/workspace mixed completion | `QueryProjectWorkspaceTopic` | 三 partition + coverage 保真；无 projection/cursor/rebuild/project readiness | required safety | `EV-CAND-INTEGRATION-001`; positive `CON-Q-039` |
| `TC-TOPIC-006` | method-library/artifact safe refs + missing command | `QueryMethodAssetTopic` | read-only/partial page；local draft 不成 version；不自造 publish/approval | required safety | `EV-CAND-FLOW-001`; positive `CON-Q-040` |
| `TC-TOPIC-007` | governance/artifact status/ref + missing/conflict | `QueryGovernanceControlTopic` | safe status/ref；无 verdict/approval/Gate decision/evidence body；冲突显式 | required safety | `EV-CAND-SECURITY-001`; positive `CON-Q-034/037` |
| `TC-TOPIC-008` | observability safe metric/audit/report refs + no thresholds | `QueryObservabilityTopic` | read-only、axes 保真；无 threshold verdict、audit/evidence body、readiness | required safety | `EV-CAND-SECURITY-001`; positive `CON-Q-042` |
| `TC-TOPIC-009` | capability formal/missing facets | `QueryCapabilityHubTopic` | pending/blocked/read-only 保真；无 registration 或 capability readiness | required safety | `EV-CAND-FLOW-001`; positive `CON-Q-041` |
| `TC-TOPIC-010` | archive safe refs / contract missing | `QueryArchiveTopic` | pending/blocked safe page；无 archive/restore command、package body、recovery truth | required safety | `EV-CAND-FLOW-001`; positive `CON-Q-043` |
| `TC-TOPIC-011` | sandbox safe refs / contract missing | `QuerySandboxTopic` | pending/blocked safe page；无 run/start/cleanup 或 runtime readiness | required safety | `EV-CAND-FLOW-001`; positive `CON-Q-043` |
| `TC-TOPIC-012` | package/adapter/config flag/page exists，但 capability/six facets/context 不全 | evaluate/compose any topic | 不得 `active`；不得合成 normal/compliant/ready；Query/local write=0 | required | `EV-CAND-SECURITY-001` |

## 9. RECOVERY / ERROR / A11Y 用例

| TC | 场景 / 前置 | 输入 / 操作 | 预期与断言 | 自动化 | EV |
|---|---|---|---|---|---|
| `TC-RECOVERY-001` | 每个 `ConsolePortErrorKind` 与 subject fixture | error→protocol→page mapping | typed kind 映射 blocked/unavailable/unknown/cancelled 及批准 message key；无 raw text/status/body/stack | required | `EV-CAND-SECURITY-001` |
| `TC-RECOVERY-002` | non-normal axes 与 normal axes | create degradation/plan | non-normal 形成同 subject immutable plan；normal 不造 degradation；allowed/blocked actions 确定 | required | `EV-CAND-UNIT-001` |
| `TC-RECOVERY-003` | current plan/action/context/request match | `ApplyRecoveryAction` 参数化 requery/revalidate/reconcile/keep-draft/exit | 恰好调用一个 narrow branch；action completion 不等 recovered，只有新 observation 更新 | required | `EV-CAND-FLOW-001` |
| `TC-RECOVERY-004` | stale/mismatch/blocked plan、`retry-command`、double trigger | 执行 recovery | `blocked/invalid-state-combination`；所有 action port 为 0 或至多首个一次；无 retry-all/loop | required | `EV-CAND-FLOW-001` |
| `TC-RECOVERY-005` | host/focus/announce failure 或 no safe path | 完成 recovery presentation | 业务 observation/result 不变；提供 alternate channel/exit 或明确停止；diagnostic 可失败而隔离 | required | `EV-CAND-INTEGRATION-001` |
| `TC-A11Y-001` | C1～C6 代表路径的 visual/keyboard/AT bindings | 逐通道激活同一 semantic action | 同 action key、guard、input、outcome、recovery ceiling；无第二授权路径 | required | `EV-CAND-ACCESSIBILITY-001` |
| `TC-A11Y-002` | visible status/error/result/degradation fixtures | 渲染 semantic model | 每种语义有 name/text/state，不只靠颜色/位置/动画/toast；动态变化有 safe announcement | required | `EV-CAND-ACCESSIBILITY-001` |
| `TC-A11Y-003` | focus target absent/host unavailable/announcement failed | 触发 view/error/recovery transition | fallback 可到达且不绕过 guard；业务 state/result 不改变；无死路 | required | `EV-CAND-ACCESSIBILITY-001` |
| `TC-A11Y-004` | future browser/AT authority matrix | selected compatibility run | 仅指定组合到达后执行；当前不生成兼容 verdict | conditional | `EV-CAND-ACCESSIBILITY-001`;`blocked: CON-Q-046` |

## 10. ADAPTER / CONDITIONAL CONSUMER 用例

| TC | 场景 / 前置 | 输入 / 操作 | 预期与断言 | 自动化 | EV / 姿态 |
|---|---|---|---|---|---|
| `TC-ADAPTER-001` | 每个 narrow Port 的 success/error/cancel/unknown fixture | 对 fake 与 formal-shaped adapter 做 parity contract | 输入/union/error/cancel 分支等价；fake 不默认 ref 有效、不直接 confirmed | required | `EV-CAND-CONTRACT-001` |
| `TC-ADAPTER-002` | raw SDK error/HTTP/status/body/stack fixture | adapter classify | 仅 body-free `ConsolePortError` 越界；业务模块不解析 string/status/private exception | required | `EV-CAND-SECURITY-001` |
| `TC-ADAPTER-003` | owner material 含 safe/unsafe/malformed field | safe mapper | safe material 构造 typed object；unsafe/malformed whole reject，不 salvage、不 echo | required | `EV-CAND-CONTRACT-001` |
| `TC-ADAPTER-004` | registry slot absent/failed/partial | build/call formal facets | mandatory facet fail-closed；optional facet disabled/failed；一个 owner failure 不污染其他 binding | required | `EV-CAND-INTEGRATION-001` |
| `TC-ADAPTER-005` | `SdkInvalidationPort.observe` 返回 disabled/pending-contract | 执行 `ConsumeSdkInvalidationHint` | outcome `disabled`；carrier writes=0、receipt/cursor/event store=0；explicit Query 主链不变 | required | `EV-CAND-FLOW-001` |
| `TC-ADAPTER-006` | future valid/malformed/scope-mismatch/duplicate invalidation envelopes | observed/apply contract | valid 只收紧 exact scope；duplicate 等价；body/order 不可证则 blocked；当前不得执行为 passed | conditional | `EV-CAND-CONTRACT-001`;`blocked: CON-Q-034/038/044` |

## 11. STATE / STATE-MATRIX 用例

| TC | 场景 / 前置 | 输入 / 操作 | 预期与断言 | 自动化 | EV |
|---|---|---|---|---|---|
| `TC-STATE-001` | valid/duplicate/malformed/forbidden `ClientStateRecord` | carrier load | 全对象验证后 loaded；malformed/forbidden 整体拒绝，绝不 partial salvage | required | `EV-CAND-CONTRACT-001` |
| `TC-STATE-002` | exact/mismatched `(sessionRef, contextRef?)` | load/replace/invalidate/clear | 仅 exact scope operation；mismatch→`state-scope-mismatch`；无 implicit migration | required | `EV-CAND-CONTRACT-001` |
| `TC-STATE-003` | loaded record 与 typed patch/marker | replace/invalidate/clear | immutable whole-record；duplicate invalidation 等价/更保守；clear→missing | required | `EV-CAND-FLOW-001` |
| `TC-STATE-004` | carrier replace completion ambiguous | save then reload | caller 不假定旧/新；mandatory reload；owner command 不重发 | required | `EV-CAND-INTEGRATION-001` |
| `TC-STATE-005` | context/qualification/visibility/navigation/source fixtures | 枚举合法 tightening 与非法 elevation | route/cache/render/timer/carrier 不产生 verified/qualified/visible/fresh/current；新 formal observation 才恢复 | required | `EV-CAND-UNIT-001` |
| `TC-STATE-006` | all Draft/Request/Result variants | 枚举合法/非法 transition | terminal draft 不复活；receipt≠confirmed；unknown no replay；非法→typed error、state unchanged | required | `EV-CAND-UNIT-001` |
| `TC-STATE-007` | activation/degradation/recovery variants | 枚举 mode×facet×context 与 plan transitions | active 全前置；local only tightens；timer/action completion 不 recovered；stale plan blocked | required | `EV-CAND-UNIT-001` |
| `TC-STATE-008` | carrier/shell/a11y/diagnostic variants | 枚举 disposition | load 不 presentable；closed terminal；host/sink outcome 不改 business state；emission 无持久 lifecycle | required | `EV-CAND-UNIT-001` |

## 12. CONSISTENCY / CONCURRENCY 用例

| TC | 场景 / 前置 | 输入 / 操作 | 预期与断言 | 自动化 | EV |
|---|---|---|---|---|---|
| `TC-CONSISTENCY-001` | 同 scope 两个 local mutation | deterministic serial coordinator 反复交错 | single writer 顺序 whole-record，无定义范围内 lost update；不声称 CAS/multi-tab | required | `EV-CAND-INTEGRATION-001` |
| `TC-CONSISTENCY-002` | context switch 与 late Query | query capture A、switch B、complete A | A install rejected；B page/state 不污染；Query 本身 no-write | required | `EV-CAND-INTEGRATION-001` |
| `TC-CONSISTENCY-003` | owner fan-out 不同 completion orders | 对八 topic 重放正/逆序 | canonical output/partition posture 相同；局部 failure 归位 | required | `EV-CAND-INTEGRATION-001` |
| `TC-CONSISTENCY-004` | visual/keyboard/AT 同 action 并发 | simultaneous controlled submit | shared single-flight；`OwnerCommandPort.submit`≤1 | required | `EV-CAND-INTEGRATION-001` |
| `TC-CONSISTENCY-005` | cancel/timeout before vs after possible dispatch | delegated submit | before→cancelled/blocked；after→unknown；replay=0 | required | `EV-CAND-FLOW-001` |
| `TC-CONSISTENCY-006` | local save unknown after formal submit | reload/reconcile | 不补偿 owner、不重复 submit；formal/local 非原子姿态显式 | required | `EV-CAND-INTEGRATION-001` |
| `TC-CONSISTENCY-007` | newer terminal 与 older pending reconcile 反序完成 | install results | older pending 不覆盖 terminal；context/request/result correlation 必须一致 | required | `EV-CAND-FLOW-001` |
| `TC-CONSISTENCY-008` | invalidation/query race 无 formal order proof | 反序 hint/query | 保持 stale/unknown/conservative；local clock/LWW 不恢复 freshness | required | `EV-CAND-INTEGRATION-001` |

## 13. DIAGNOSTIC / SECURITY 用例

| TC | 场景 / 前置 | 输入 / 操作 | 预期与断言 | 自动化 | EV |
|---|---|---|---|---|---|
| `TC-DIAG-001` | typed safe candidate | factory→gate→availability→sink | 只含批准 refs/enums/low-cardinality marker；enabled→emitted，sink 只收到 validated context | required | `EV-CAND-UNIT-001` |
| `TC-DIAG-002` | arbitrary metadata、URL、free text、body、secret、stack/full ref | emit candidate | factory/gate→failed `forbidden-body`；sink=0；拒绝内容不回显/保留 | required | `EV-CAND-SECURITY-001` |
| `TC-DIAG-003` | sink disabled/failed/cancelled | emit around successful/failed business flows | diagnostic outcome 分离；业务 Query/Command/recovery 结果逐字相同；无 retry/requery/replay | required | `EV-CAND-INTEGRATION-001` |
| `TC-DIAG-004` | sink itself fails | observe call ledger | failure path不再次 emit；无递归；sink receipt/emitted 不成 audit/evidence/readiness | required | `EV-CAND-SECURITY-001` |
| `TC-SEC-001` | invalid context/visibility/qualification | 访问所有保护 page/action | 零受保护内容、对象存在性与 owner submit；minimum disclosure | required | `EV-CAND-SECURITY-001` |
| `TC-SEC-002` | forbidden body 注入 mapper/state/error/diagnostic/config | 穿越所有 boundary | whole reject、零存储/输出/报告引用；safe issue 不 echo | required | `EV-CAND-SECURITY-001` |
| `TC-SEC-003` | transport/toast/receipt/cache/diagnostic success | 尝试映射业务 terminal | 均不能 confirmed/rejected/active/verdict/readiness；只有 formal observation 可正向 | required | `EV-CAND-SECURITY-001` |
| `TC-SEC-004` | route/role/flag/config/local count/threshold | 尝试授权或推导结论 | visibility/qualification/Policy/Gate 不被绕过；无审批/合规/audit/capability/archive/run/readiness 结论 | required | `EV-CAND-SECURITY-001` |
| `TC-SEC-005` | 每个 owner 单独 fail/stale/conflict/unknown，其他 owner success | topic composition | 对应局部姿态始终可见且不扩散/掩盖；触发 VETO-CON-007 guard | required | `EV-CAND-INTEGRATION-001` |

## 14. CONFIG 用例

| TC | 场景 / 前置 | 输入 / 操作 | 预期与断言 | 自动化 | EV |
|---|---|---|---|---|---|
| `TC-CONFIG-001` | valid minimal strict JSON | parse/validate | `runtime.profile` required；省略 optional 得 `[]/false/false`；仅四个 P0 key | required | `EV-CAND-UNIT-001` |
| `TC-CONFIG-002` | profile missing、bad enum/type、unknown/duplicate key、alias、comment/trailing comma | parse/validate | whole-document reject/fail-fast；无 coercion、implicit `local-fake` 或 silent fallback | required | `EV-CAND-UNIT-001` |
| `TC-CONFIG-003` | endpoint/URL/secret/body/private method/static authority key | validate | `forbidden-body/unsafe-field` safe issue；raw input 不进入 error/log/diagnostic/state | required | `EV-CAND-SECURITY-001` |
| `TC-CONFIG-004` | duplicate `(profile,slot)`、binding profile mismatch、bad ref | cross-field validate | whole document reject；无 partial binding | required | `EV-CAND-UNIT-001` |
| `TC-CONFIG-005` | `local-fake/integration-pending/production-pending` fixtures | build composition | local fake 仅 local；pending profiles 保持 pending/fail-closed；profile 名不代表 ready | required | `EV-CAND-INTEGRATION-001` |
| `TC-CONFIG-006` | mandatory binding absent/failed | startup builder | no partially protected runtime exposed；fail-fast/fail-closed with safe issue | required | `EV-CAND-INTEGRATION-001` |
| `TC-CONFIG-007` | optional invalidation false/true缺合同/failure | startup/use runtime | false→disabled；true 无合同不得激活 observed path；failure 不改 explicit Query 主链 | required | `EV-CAND-INTEGRATION-001` |
| `TC-CONFIG-008` | diagnostics false/local fake true/production-pending true/sink fail | startup/emit | false disabled；only approved binding may enable；failure isolated、body-free、no recursion | required | `EV-CAND-INTEGRATION-001` |
| `TC-CONFIG-009` | all profiles + state carrier | observe/load | P0 始终 session-volatile；config/load 不生成 durable/cross-session/current/confirmed | required | `EV-CAND-CONTRACT-001` |
| `TC-CONFIG-010` | running runtime receives external doc change | simulate change | startup-only：当前 runtime 不 hot patch；新 whole doc 经完整 revalidation/new runtime | required | `EV-CAND-INTEGRATION-001` |
| `TC-CONFIG-011` | previous approved artifact + invalid current/legacy key | rollback/migration simulation | previous whole doc 重新验证才可选；无 online LKG/hot leaf rollback；legacy/removed key reject | required | `EV-CAND-RELEASE-001` |

## 15. ARCHITECTURE / ABSENCE 用例

| TC | 场景 / 前置 | 输入 / 操作 | 预期与断言 | 自动化 | EV |
|---|---|---|---|---|---|
| `TC-ARCH-001` | future source/dependency graph | scan imports/packages/runtime bindings | 业务读取/命令只经 SDK/formal narrow Ports；无 owner source/private sibling import | required | `EV-CAND-ARCH-001` |
| `TC-ARCH-002` | future file/export graph | scan forbidden units | 无 DB/repository/UoW/outbox/projection/BFF/private bus/worker/scheduler/DLQ/admin server surface | required | `EV-CAND-ARCH-001` |
| `TC-ARCH-003` | protocol/export registry | count protocol families | exactly 5 Command、16 Query、1 conditional consumer、0 Outbound Event、0 Operations Job | required | `EV-CAND-ARCH-001` |
| `TC-ARCH-004` | call graph + recording Ports | scan/execute representative flows | 唯一 owner write=`OwnerCommandPort.submit`；Query owner/local write=0；diagnostic not business event | required | `EV-CAND-ARCH-001` |

## 16. 设计契约断言矩阵

| TC 范围 | 设计契约 | 核心正式断言 | 关键负向 | Future EV |
|---|---|---|---|---|
| CTX/NAV | 03 §5.1～§5.3、§8.2～§9 | context lifecycle、TopicVisibility、shell/navigation | local authority、old-scope reuse | UNIT/FLOW/SECURITY |
| VIEW | 03 §5.4、§7.3～§8.4、§10 | QuerySurface、SourceStatusAxes、safe refs、zero-write | empty conflation、body、write repair | UNIT/FLOW/CONTRACT |
| INTENT | 03 §5.5、§7.2、§8.2、§9～§12 | DraftIntent、RequestPresentation、5 Command、single submit | receipt→confirmed、unknown replay、owner compensation | UNIT/FLOW/CONTRACT |
| TOPIC | 03 §5.6、§7.4、§8.4 | eight public Queries、canonical partitions、strict empty | truth/readiness、failure spread/masking | FLOW/INTEGRATION |
| RECOVERY/A11Y | 03 §5.7、§9、§11～§14 | typed error、immutable plan、one action、same semantic action | retry-all、visual-only pass | FLOW/ACCESSIBILITY |
| ADAPTER | 03 §5.8、§6～§8、§11 | narrow Ports、ConsolePortError、fake/formal parity | private/raw surface、fake optimism | CONTRACT/SECURITY |
| STATE/CONSISTENCY | 03 §5.9、§9～§12 | whole-record/exact-scope、single writer/flight、late drop | implicit migration/CAS/replay/LWW | UNIT/FLOW/INTEGRATION |
| DIAG/SEC | 03 §5.10、§11、§14 | whitelist/redaction/isolation、minimum disclosure | audit/evidence/body/authority confusion | SECURITY |
| CONFIG | 03 §13；04 §5～§12 | four-item schema、profiles、startup/failure | implicit fake、secret、config authority/hot patch | UNIT/INTEGRATION/SECURITY |
| ARCH | 03 §3～§5、§7.5、§15 | SDK-only、5+16+1、0 Event/Job、single owner-write port | service-side pollution | ARCH |

## 17. 单 Cut 停审记录

| Cut | 正向/安全主线 | 负向/边界 | 前置可构造 | 断言具体 | EV 唯一 bundle | 结论 |
|---|---|---|---|---|---|---|
| ENTRY/ACCESS/NAV | yes | yes | yes | yes | yes | pass |
| VIEW/QUERY | yes | yes | yes | yes | yes | pass_with_positive_owner_fixtures_conditional |
| INTENT/COMMAND | local/fail-closed yes | yes | yes | yes | yes | pass_with_submit_positive_blocked |
| TOPIC | safety/composition yes | yes | yes | yes | yes | pass_with_owner_positive_blocked |
| RECOVERY/ERROR | yes | yes | yes | yes | yes | pass |
| ADAPTER | fake/formal-shaped yes | yes | yes | yes | yes | pass_with_formal_positive_blocked |
| STATE/STATE-MATRIX | yes | yes | yes | yes | yes | pass |
| CONSISTENCY | yes | yes | yes | yes | yes | pass |
| DIAG | disabled/fake yes | yes | yes | yes | yes | pass_with_production_sink_blocked |
| A11Y | semantic yes | yes | yes | yes | yes | pass_with_compatibility_blocked |
| CONFIG | safe profile/failure yes | yes | yes | yes | yes | pass_with_production_positive_blocked |
| CONSUMER | disabled yes | yes | yes | yes | yes | pass_with_observed_branch_blocked |
| ARCH | negative/absence yes | yes | future graph | yes | yes | pass_planned |

## 18. 跨用例断言 / Phase 审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| TC ID 唯一且三位序号稳定 | pass | 96 个 TC，无重复；family 按责任切分 |
| 19/19 cut 是否有用例 | pass | §4、§17 |
| 5 Command 是否逐名覆盖 | pass | context switch、save preference、discard、submit、recovery |
| 8 Core + 8 Topic Query 是否逐名覆盖 | pass | VIEW 001～009、TOPIC 004～011 |
| conditional consumer / 0 Event / 0 Job | pass | ADAPTER 005～006、ARCH 002～003 |
| 11 状态主语合法/非法/formal-only recovery | pass | STATE 005～008 + per-flow TC |
| Query no-write / 唯一 owner write | pass | VIEW-009、ARCH-004 |
| formal/local 非原子与 unknown no replay | pass | INTENT-008～011、CONSISTENCY-005～007 |
| VETO 1～7 是否均有负向触发 | pass | ARCH/SEC/INTENT/A11Y/TOPIC families |
| 是否只测 happy path | pass | 每族都有 invalid/mismatch/failure/cancel/race 或 absence |
| 状态/错误命名是否来自 03 | pass | 无旧 Panel/Workspace/QuickAction 或自造 error code |
| 是否将 receipt/action/profile/sink 提前解释为完成/恢复/ready/evidence | pass | 显式禁止 phase 越界 |
| positive blocker 是否保真 | pass | conditional TC 均列 `CON-Q-*`，不记 pass |
| EV 是否伪造成证据 | pass | 仅引用 Step 5 `EV-CAND-*` `planned_slot_only` bundle |

## 19. 上游影响、后续承接与正式回填

| 结论 | 处理 |
|---|---|
| 96 个 TC 可从正式 03/04 推导 | 无需修改业务/配置语义 |
| 数据前置尚未命名 | Step 7 定义 fixture/builder/data-set、隔离与清理 |
| suite/gate/check/report 尚未定义 | Step 9 定 planned automation boundary，并受控回写 03 layout |
| formal positive、compatibility、quantitative 用例受阻 | Step 8/10/14 保持 blocked/residual |
| Step 7 若无法构造正式字段 | 停止相应 positive case，回查 03；不得在 fixture 发明 schema |

正式 §6 应回填场景/批次表、全部 TC 矩阵、设计契约断言矩阵和 blocker posture；单 cut 审查与详细过程可保留本文件。

> 校准来源：`design-calibration/05_test_plan_step_06_cases.md`
>
> 延伸阅读：建议继续阅读本文件的“ENTRY / ACCESS / NAV 用例”“VIEW / QUERY 用例”“INTENT / COMMAND 用例”“TOPIC 用例”“RECOVERY / ERROR / A11Y 用例”“STATE / STATE-MATRIX 用例”“CONFIG 用例”和“跨用例断言 / Phase 审计”。

| 进入 Step 7 条件 | 结论 |
|---|---|
| P0 safety 用例可触发、可断言、可绑定 future EV | pass |
| 每个 cut 已停审 | pass |
| phase/命名/side-effect 无冲突 | pass |
| blocked positive 不伪装可执行通过 | pass |
| 可进入 Step 7 | pass |

Step 6 `done / pass / self_reviewed`；未运行测试，未生成任何 artifact/report/evidence/verdict/readiness。
