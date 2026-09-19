# Step 7. 定义接口、事件与跨仓同步验收

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 7  
> 回填章节：`06-验收标准.md` §7 接口、事件与跨仓同步验收

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 7 接口、事件与跨仓同步验收 |
| 当前状态 | `done / pass / self_reviewed` |
| 输入基线 | 全局依赖规则；正式 00 §12；01 §8/§10；03 §6～§8；05 ADAPTER/ARCH/协议 TC |
| 输出文件 | `design-calibration/06_acceptance_step_07_interfaces_events_sync.md` |
| 逐项范围 | 5 Command、16 Query、1 conditional consumer、0 Outbound Event、0 Operations Job |
| 实际结果 | 全部 `not_evaluated` |
| 下一动作 | 只允许进入 Step 8 |

## 2. 本步计划与目标

本步先校准 compile/runtime/event 依赖类型，再对 22 个正式协议逐项执行协议名、输入/结果语义、读写边界、TC/EV/report、下游未就绪姿态和停审，最后把 Event/Job absence 与跨仓范围做总审计。

## 3. 本步输入

| 输入 | 本步用途 |
|---|---|
| 全局依赖规则 §2/§4 | compile/runtime/event 分类与 L5-console 总依赖边界 |
| `00` §12 | 13 core 产品接口、14 dependency、可选 SDK notification、0 业务事件/后台任务 |
| `01` §8/§10 | SDK-only、owner runtime、SDK-wrapped optional event、通信红线 |
| `03` §6～§8 | 精确 Port/protocol 名、5+16+1/0/0、函数 flow 与 side effect |
| `04` | adapter binding、invalidation false、profile isolation |
| `05` §6/§9/§13 | 协议 TC、suite、future EV 与 report path |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 P0 Command/Query 如何验收？ | 见 §8.2/§8.3；逐协议检查正式输入/结果 union、guard、side effect、TC/EV/report。 |
| Event 如何证明？ | Console 当前无 outbound business event；唯一 conditional inbound `ConsumeSdkInvalidationHint` 当前只能 disabled/pending-contract zero-write。future enabled 才需 exact envelope/order/dedup/scope positive。 |
| Job 如何证明？ | 当前 0 Operations Job；以 protocol/export/file/dependency graph 和无 scheduler/worker/repair unit 证明 absence。 |
| 跨仓同步成功标准？ | 对 runtime query/command 是安全、typed、owner-partitioned SDK/adapter seam；对 optional event 是收到后仅失效/重查；不要求或生成跨仓事务。 |
| 下游未就绪如何验？ | mandatory seam fail-closed；optional seam disabled；owner facet read-only/partial/blocked；不调用、不伪造 positive。 |
| 依赖类型？ | official shared types/SDK 为 compile；L1～L4 owner 为 runtime；状态提示仅经 SDK 的 conditional event；未停审 L5/L6 是 future runtime link。 |
| 证据为何不要求源码依赖？ | runtime/event 边界验 Port/adapter/contract/behavior；只有 compile 依赖验 package/export graph。 |
| 是否逐项回指正式协议与 evidence？ | 是，22/22 见 §8.3；Event/Job absence 另有静态门禁。 |
| 下游未就绪的 pass/fail/conditional？ | 未启用且诚实安全 posture 可满足当前边界；baseline enabled 后缺 contract-derived positive 为 fail/blocked，不得有条件伪通过。 |
| 是否逐项停审与跨接口审计？ | 是，见 §8.5/§8.6。 |

## 5. 当前文档问题诊断

| 旧问题 | 本步处理 |
|---|---|
| 旧 OpenWorkspace/OpenPanel 等不是当前协议 | 全部替换为 5 Command、16 Query、1 consumer |
| API response/DB trace 当跨仓证据 | 改用 Port/adapter TC、call ledger、package/dependency graph、fixed-run report |
| 未区分 compile/runtime/event | 按全局规则逐依赖分类 |
| 把 SDK hint 当业务同步/投影 | 当前 disabled；future 只单调收紧并重查 |
| 未证明 0 Event/Job | 增加 explicit absence gates |

## 6. 改动前后对比

| 项 | 旧 | 新 |
|---|---|---|
| 协议 | 页面动作名 | 03 正式 5+16+1 |
| 跨仓 | 泛化 API/DB | compile package、runtime Port、event via SDK |
| 事件 | 模糊刷新/同步 | conditional consumer；0 outbound event |
| 后台 | 未说明 | 0 job/worker/scheduler/repair |
| 未就绪 | 缺口模糊 | fail-closed/disabled/read-only/partial/blocked |

## 7. 验收裁决取舍

| 议题 | 裁决 |
|---|---|
| 是否固定 HTTP route/topic/job 名 | 否；03 未定义，06 不发明 |
| 是否把 UI route 当 protocol route | 否；host navigation 不是正式业务接口 |
| 是否要求 owner 仓完整实现来通过 P0 safety | 否；只验 Console seam；enabled positive 需 exact approved contract |
| Query 结果能否被调用方自动安装 | 协议 Query 本身零写；安装是独立、重检 scope/correlation 的本地操作 |
| consumer observed 是否当前 required | 否，当前正式上限 disabled/pending-contract；enabled 后才 required |
| diagnostics 是否 outbound event | 否；是 optional side path，不是业务 event/audit/evidence |

## 8. 结构化中间产物

### 8.1 跨仓依赖类型与验收方式

| 关联方 | 依赖类型 | Console 协作方式 | 验收方式 | 未就绪姿态 |
|---|---|---|---|---|
| `L0-core` / official shared contracts | compile | 安全 ref/error/context types（按实际 package baseline） | package/export/dependency graph、contract compile | baseline 缺失阻断 compile gate |
| `L0-sdk` | compile + runtime | official client/public types + narrow adapters | package version、Port parity、safe mapping、typed errors | mandatory fail-closed；不得绕过 |
| identity/member/work/process/governance/artifact/workspace/method/capability/observability/archive/sandbox | runtime | owner query/conditional command/result/ref 经 SDK/formal boundary | controlled seam + enabled selected contract evidence | per facet read-only/partial/blocked |
| SDK formal state hint | conditional event | `ConsumeSdkInvalidationHint` | current disabled zero-write；future envelope/scope/monotonic TC | disabled/pending-contract |
| other L5/L6 | future runtime link/ref | formal deep-link/ref only | 双方停审后 selected contract | disabled/pending |
| `L0-bus` | event backbone, not direct dependency | 只能由 SDK 封装 | absence of direct import/bus/cursor/replay | direct usage fails architecture gate |

### 8.2 接口 / 事件 / 同步验收表

| Gate ID | 接口 / 协作 | 类型 | 通过条件 | 失败条件 | Future 证据 |
|---|---|---|---|---|---|
| `IFG-CON-001` | 5 Command family | local command + conditional runtime | 每个 Command 的 guard/result/side effect 与 §8.3 一致；唯一 owner write 只在 enabled submit | 任一多写、越权、phase 提升、unknown replay 或缺协议 | UNIT/FLOW/CONTRACT/INTEGRATION/ARCH |
| `IFG-CON-002` | 16 Query family | local query + runtime read | 每个 Query value/empty/blocked/unavailable/unknown 保真；owner/carrier writes=0 | Query 写入、修复、泄露或消平状态 | FLOW/CONTRACT/SECURITY/ARCH |
| `IFG-CON-003` | conditional invalidation | event via SDK | 当前 disabled/pending-contract zero-write；future enabled 时 exact contract/source/scope 且只单调收紧 | 直连 bus、猜 envelope、写 cursor/receipt/owner、恢复 freshness | FLOW/CONTRACT/INTEGRATION/ARCH |
| `IFG-CON-004` | Outbound Event absence | N/A | registry/file/dependency/call graph 均为 0；diagnostic 非 event | 出现 event publisher/outbox/topic schema 或 UI state 事件化 | ARCH/RELEASE |
| `IFG-CON-005` | Operations Job absence | N/A | registry/file/dependency graph 为 0；用户显式 recovery 不是 job | worker/scheduler/repair/replay/DLQ/job report 单元出现 | ARCH/RELEASE |
| `IFG-CON-006` | cross-owner composition | runtime | owner partitions 独立，canonical aggregation，不要求共享事务；failure 局部 | sibling source dependency、全源成功假设、跨 owner atom/readiness | FLOW/INTEGRATION/SECURITY |
| `IFG-CON-007` | formal/host binding | compile/runtime composition | profile/slot/ref 严格；availability 观察；mandatory fail-closed/optional disabled | binding/config/package 存在即宣称 bound/active，fake 跨 profile | CONTRACT/INTEGRATION/RELEASE |

### 8.3 逐协议闭环矩阵

共同 fixed report 入口为 `reports/runs/<run_id>/evidence-index.md`；EV 简写均指相应 `EV-*-001` instance。

| 协议 | 正式契约 / side effect | 主要 TC | EV / 主要 suite | 下游未就绪与裁决 |
|---|---|---|---|---|
| `RequestAccessContextSwitch` | formal resolve→清旧 scope→替换 shell；owner write=0 | `TC-CTX-002～004` | FLOW/INTEGRATION；module-flow | mandatory context 不可得→restricted/blocked；安全失败则不通过 |
| `SaveClientPreference` | exact scope whole-record local replace；owner write=0 | `TC-INTENT-001～002`,`TC-STATE-002～004` | FLOW/CONTRACT/SECURITY | carrier unavailable→blocked/minimal；不得影响权限 |
| `DiscardDraftIntent` | nonterminal→discarded + local replace；owner call=0 | `TC-INTENT-003～004` | UNIT/FLOW | carrier failure保真；terminal transition 失败→P0 fail |
| `SubmitControlledIntent` | qualified exact contract；唯一 `OwnerCommandPort.submit`≤1 | `TC-INTENT-005～010`,`TC-CONSISTENCY-004～006` | FLOW/CONTRACT/INTEGRATION；port/concurrency | contract 未启用→no-call blocked；enabled 缺 positive/失败→fail |
| `ApplyRecoveryAction` | current plan 下恰好一个 narrow action；无 job/loop | `TC-RECOVERY-003～005`,`TC-CONSISTENCY-005` | FLOW/INTEGRATION | action seam missing→blocked/exit；不得 generic retry |
| `ResolveAccessContext` | formal context observation；Query write=0 | `TC-CTX-001/003`,`TC-VIEW-009` | FLOW/SECURITY/ARCH | unavailable→保守，不本地构造 context |
| `GetNavigationVisibility` | formal visibility/qualification；write=0 | `TC-NAV-001/004`,`TC-VIEW-009` | FLOW/SECURITY | contract missing→blocked，不用 route/menu fallback |
| `QueryOwnerView` | safe map→snapshot/model；write=0 | `TC-VIEW-001～003/009`,`TC-ADAPTER-003` | FLOW/CONTRACT/SECURITY | owner surface unavailable→blocked/unavailable；不 cache repair |
| `GetSourceStatus` | 独立 axes；write=0 | `TC-VIEW-004/009` | UNIT/FLOW | malformed→unknown；不压为 health/readiness |
| `GetSafeLink` | formal typed link revalidation；write=0 | `TC-VIEW-005/009` | CONTRACT/FLOW | no-link empty；revoked/not-visible blocked；无 URL fallback |
| `GetRequestPresentation` | exact scoped local record read；write=0 | `TC-VIEW-006/009` | FLOW/CONTRACT | missing→local empty；不隐式 reconcile/submit |
| `ReconcileRequestResult` | formal result read；write/submit=0 | `TC-VIEW-007/009`,`TC-INTENT-011` | FLOW/CONTRACT | surface absent→blocked；timeout→unknown；no replay |
| `GetTopicActivation` | capability+mode+six facets+context；write=0 | `TC-VIEW-008/009`,`TC-TOPIC-012` | UNIT/FLOW/SECURITY | missing facet→pending/blocked；flag/package 不 active |
| `QueryMemberManagementTopic` | identity/member partitions；write=0 | `TC-TOPIC-001～004`,`TC-SEC-005` | FLOW/INTEGRATION/SECURITY | positive `CON-Q-034/037`；安全 read-only/partial 可验 |
| `QueryProjectWorkspaceTopic` | work/process/workspace partitions；write=0 | `TC-TOPIC-001～003/005` | FLOW/INTEGRATION | positive `CON-Q-039`；无 projection/readiness |
| `QueryMethodAssetTopic` | method/artifact refs；write=0 | `TC-TOPIC-001～003/006` | FLOW/CONTRACT/SECURITY | positive `CON-Q-040`；无 command 时 read-only |
| `QueryGovernanceControlTopic` | governance/artifact status/ref；write=0 | `TC-TOPIC-001～003/007` | FLOW/INTEGRATION/SECURITY | exact positive blocked；无 verdict/evidence body |
| `QueryObservabilityTopic` | audit/metric/report safe refs；write=0 | `TC-TOPIC-001～003/008` | FLOW/INTEGRATION/SECURITY | positive `CON-Q-042`；无 threshold/readiness |
| `QueryCapabilityHubTopic` | capability safe axes/refs；write=0 | `TC-TOPIC-001～003/009` | FLOW/INTEGRATION/SECURITY | positive `CON-Q-041`；pending/blocked 合法 |
| `QueryArchiveTopic` | archive safe axes/refs；write=0 | `TC-TOPIC-001～003/010` | FLOW/INTEGRATION/SECURITY | positive `CON-Q-043`；无 archive/restore execution |
| `QuerySandboxTopic` | sandbox safe axes/refs；write=0 | `TC-TOPIC-001～003/011` | FLOW/INTEGRATION/SECURITY | positive `CON-Q-043`；无 run/start/cleanup |
| `ConsumeSdkInvalidationHint` | current disabled; future validate→body-free marker→monotonic invalidation | `TC-ADAPTER-005～006`,`TC-CONSISTENCY-008` | FLOW/CONTRACT/INTEGRATION | 当前 disabled pass only；enabled positive blocked by `CON-Q-034/038/044` |

### 8.4 下游未就绪裁决表

| 接缝状态 | Baseline 约束 | 合格姿态 | 不合格姿态 | 裁决 |
|---|---|---|---|---|
| mandatory compile dependency 缺失/不兼容 | P0 required | compile gate failed | fallback 到 private/sibling source | 不进入/不通过 |
| mandatory runtime context/guard 缺失 | P0 required | fail-closed/restricted，若准入要求 positive 则 blocked | 继续披露/submit | 安全姿态可证明；实际正向范围不可进入 |
| owner topic positive 未启用 | facet disabled/pending | read-only/partial/blocked + no call | fake/flag 冒充 integrated | 当前 safety 可满足，不贡献 positive |
| owner topic positive enabled | exact authority required | contract-derived positive + safety evidence | 缺 contract/EV 或 only fake | 对应门禁失败 |
| invalidation 未启用 | switch false | disabled + zero-write，explicit Query 保留 | silent observe/private bus/cursor | safety pass / positive N/A |
| invalidation enabled | exact event authority required | valid envelope only monotonic tighten；duplicate safe | order/body/scope 不可证仍 apply | 对应门禁失败 |
| other L5/L6 未停审 | 不进入主链 | link disabled/pending | private state/deep-link required | residual/pending |

### 8.5 接口 / 事件逐项停审记录

| 范围 | 数量 | 正式名/契约 | TC/EV/report | 未就绪裁决 | 设计停审 |
|---|---:|---|---|---|---|
| Command | 5 | 5/5 | 5/5 | clear | pass |
| Core Query | 8 | 8/8 | 8/8 | clear | pass |
| Topic Query | 8 | 8/8 | 8/8 | per-owner conditional | pass |
| conditional consumer | 1 | 1/1 | 1/1 | current disabled / future enabled | pass |
| Outbound Event | 0 | explicit N/A | architecture evidence | absence required | pass |
| Operations Job | 0 | explicit N/A | architecture evidence | absence required | pass |

逐项审查共同确认：协议名来自 03；Query write=0；每个协议有 TC/EV/fixed report；不存在 HTTP path/topic/job name 猜造；当前实际执行结果均为 `not_evaluated`。

### 8.6 跨接口同步门禁审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 协议 inventory 与 03/05 一致 | pass | 5+16+1/0/0 |
| compile/runtime/event 类型误判 | none | L0 bus 不直接依赖 |
| sibling 源码/私有 schema 要求 | none | runtime 只验 narrow seam |
| Query 或 consumer 隐式写入 | none | zero-write gate |
| 唯一 owner write 是否明确 | pass | `OwnerCommandPort.submit` |
| protocol name / phase 漂移 | none | 使用正式 names/unions |
| 下游完整实现误要求 | none | positive 按 enabled facet |
| Event/Job absence 空洞 | none | registry/file/dependency/call graph gate |
| evidence 路径缺失 | contract complete | 实际 reports 不存在，验收未进入 |
| 相邻 L5/L6 污染 | none | pending link only |

## 9. 回填草稿

正式 §7 应呈现依赖类型表、`IFG-CON-001～007` 门禁和逐协议闭环摘要。必须明确 Console 协议清单为 5 Command、16 Query、1 conditional inbound consumer、0 Outbound Event、0 Operations Job；所有 Query write=0，唯一 owner write 为 `OwnerCommandPort.submit`。当前 consumer 只能 disabled/pending-contract，不能把 SDK hint 写成已集成事件流。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| exact SDK/owner protocol/ref/error surface | formal positive | `CON-Q-034～043` blocked |
| invalidation envelope/order/dedup/scope | observed consumer | `CON-Q-034/038/044` blocked |
| actual package/version compatibility | compile/runtime baseline | 送验前固定 |
| L5/L6 link/ref | peripheral | `CON-Q-047` pending |

## 11. 下一步门禁

| 条件 | 结果 |
|---|---|
| 22 个正式协议逐项闭环 | pass |
| 0 Event/Job absence 可检查 | pass |
| 依赖类型与全局规则一致 | pass |
| 未就绪裁决无假 positive | pass |
| 跨接口审计无 unresolved 冲突 | pass |
| 允许进入 Step 8 | yes |
| 允许修改正式 06 | no |
