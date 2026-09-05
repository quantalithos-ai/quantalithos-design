# Step 7. 定义接口、事件与跨仓同步验收

> 对应 SOP：standards/document/验收标准讨论流程_SOP.md Step 7
> 回填章节：06-验收标准.md §7
> 粒度参考：projects/L1-governance/design-calibration/06_acceptance_step_07_interfaces_events_sync.md

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 7 定义接口、事件与跨仓同步验收 |
| 当前状态 | 已完成；本轮连续授权并保留独立停审记录 |
| 输入基线 | Step 5~6；03 §7~§8、§13；04 §6、§12；05 §6、§9、§13 |
| 输出文件 | projects/L2-member/design-calibration/06_acceptance_step_07_interface_sync_gate.md |

## 2. 本步目标

定义 10 个 Command、16 个 Query、14 个 Consumer、24 个 blocked semantic candidate、5 个 Operations Job 以及跨仓接缝的验收门禁。必须区分 compile、runtime、event、ref、adapter、fake 和 downstream consumption；不得把运行期或事件协作伪装成 package dependency。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| 03 §7 | public protocol、typed carrier、result / receipt / report 和 candidate inventory |
| 03 §8 | Command / Query / Consumer / Job 函数级处理顺序 |
| 03 §13 | resolver / handoff / blocked seam 绑定边界 |
| 04 §6、§12 | profile、slot、availability 和生效姿态 |
| 05 §6、§9、§13 | TC、suite、EV candidate 和 report path |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 Command / Query 如何验收？ | 验证正式 name、typed body、双锚 / metadata、result / view、错误和 no-write / UoW 规则；每项回指 TC、EV candidate 和 suite report。 |
| Consumer 如何证明可消费 / 可重放？ | 先过 source / schema / body / dedup gate，再保存允许的 local fact / safe relation / receipt；duplicate 只回放完整 receipt，unsupported 或 forbidden body 不解析不落库。 |
| Job 如何证明幂等和恢复？ | 有限 selector、per-item relation、partial report、exact report replay 和 unknown fence；Job 不修复 CP01~CP06 source truth。 |
| 跨仓同步成功标准是什么？ | P0 只要求本仓以正式 ref / safe material / attempt / gap / blocked surface 正确协作；不要求相邻仓内部完成。 |
| 下游未就绪如何裁决？ | local / fake / controlled / disabled seam 可证明 P0 语义；real positive 受 blocker 时标 blocked / not_run / residual，不记为 pass。 |
| 依赖类型如何分？ | core-contracts 为唯一 planned compile candidate；Runtime、host、image、Identity、Governance、Tools 等为 runtime/ref/adapter；Bus / feedback 为 event / handoff；fake 仅测试替身。 |
| 每项能否回指正式字段 / 状态？ | 能，协议字段、状态、error 和 callable surface 以 03 为唯一正式来源；本 Step 不增 schema。 |

## 5. 当前文档问题诊断

| 问题 | 处理 |
|---|---|
| 旧 06 没有 Consumer / Job / 24 candidate | 增加完整 finite inventory 和 blocked 语义 |
| 旧文档把 API / event 成功混作外部成功 | 只验 local typed outcome、receipt、report、attempt / gap |
| sibling 未就绪时容易误判 | 通过 dependency type 和 disposition 矩阵明确 blocked / not_run |

## 6. 改动前后对比

| 项 | 旧口径 | 新口径 |
|---|---|---|
| Command / Query | 泛化 API 可用 | 10 / 16 finite typed surface |
| Event | 直接写 publish / delivery | 14 Consumer 接缝；24 candidate 全部 non-materialized |
| Job | “任务完成” | 5 Job local continuation / report replay |
| 跨仓 | 直接源码 / endpoint 假设 | compile / runtime / event / ref / adapter / fake 分类 |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| 是否固定 transport topic / endpoint | 固定 / 保持 transport-neutral | 保持 transport-neutral；只验正式逻辑协议和配置 binding |
| 24 candidate 是否建 event 证据 | 建 / 只验非物化 | 只验 non-materialization，L2M-UP-005 关闭前 zero configuration |
| 外部 unavailable 是否计 P0 失败 | 是 / 按 seam posture 处理 | 按 seam posture；P1 positive blocked 不等于 P0 local fail |

## 8. 结构化中间产物

### 8.1 Command 验收矩阵（10）

| 验收项 | 正式 Command | 通过条件 | 失败条件 | TC / EV candidate | 依赖类型 |
|---|---|---|---|---|---|
| IF-CMD-001 | AdmitMemberStartup | 双锚、startup context、credential ref gate；local admission 或保守 blocked 有完整 result | 错主语、credential body、host accepted 伪装 | TC-L2M-CMD-001；EV-CAND-L2M-CMD-001 | ref + runtime |
| IF-CMD-002 | EstablishMemberPresence | admission 与双锚匹配，单一 active presence，successor / duplicate 可判定 | 第二 active、错 scope、状态压平 | TC-L2M-CMD-002；EV-CAND-L2M-CMD-002 | local |
| IF-CMD-003 | TransitionMemberPresence | expected MemberStoreVersion、合法 target、CAS conflict 保守 | 直写 state、旧 target 覆盖新值 | TC-L2M-CMD-003；EV-CAND-L2M-CMD-003 | local |
| IF-CMD-004 | PrepareHostCollaboration | safe kind / purpose 形成 local material / attempt；host unavailable 为 blocked | 声称 registration / session / health | TC-L2M-CMD-004；EV-CAND-L2M-CMD-004 | runtime + adapter |
| IF-CMD-005 | EstablishSubscriptionScope | verified source / body-free scope、规则 ref 和 freshness 可回链 | unknown policy 扩权、正文复制 | TC-L2M-CMD-005；EV-CAND-L2M-CMD-005 | ref + runtime |
| IF-CMD-006 | ReplaceSubscriptionScope | helper 完整时 supersede；当前 gap 返回 blocked / wait_design | Store save 模拟 transition | TC-L2M-CMD-006；EV-CAND-L2M-CMD-006 | local + design blocker |
| IF-CMD-007 | SubmitScreenedFactToRuntime | screened ref、boundary ref、local attempt / blocked result；不造 Runtime run | raw body、positive Runtime admission 伪装 | TC-L2M-CMD-007；EV-CAND-L2M-CMD-007 | runtime + ref |
| IF-CMD-008 | LinkRuntimeAdmissionResult | matching attempt + formal result ref 形成 local link / waiting | 改 Runtime truth、wrong correlation 接受 | TC-L2M-CMD-008；EV-CAND-L2M-CMD-008 | runtime + event |
| IF-CMD-009 | ResolveExternalContext | owner-specific ref、purpose / scope、safe snapshot / neutral resolution / gap | generic resolver、authorization / health truth | TC-L2M-CMD-009；EV-CAND-L2M-CMD-009 | ref + adapter |
| IF-CMD-010 | RequestExternalContextRefresh | existing relation、finite request、blocked / duplicate exact replay | 无 helper 时直接写 pending / source | TC-L2M-CMD-010；EV-CAND-L2M-CMD-010 | adapter + design blocker |

### 8.2 Query 验收矩阵（16）

| 验收项 | 正式 Query | 通过条件 | 失败条件 | TC / EV candidate |
|---|---|---|---|---|
| IF-QRY-001 | GetMemberPresence | safe presence surface，missing / not-ready 可判定，无写 | Query 创建 successor / audit | TC-L2M-QRY-001；EV-CAND-L2M-QRY-001 |
| IF-QRY-002 | GetHostCollaborationPosture | local posture / attempt page，不声称 host health | host call 或 health success | TC-L2M-QRY-002；EV-CAND-L2M-QRY-002 |
| IF-QRY-003 | GetCurrentSubscriptionScope | current / superseded / no basis 安全可见 | 读取 policy body、扩权或写入 | TC-L2M-QRY-003；EV-CAND-L2M-QRY-003 |
| IF-QRY-004 | GetScreeningDisposition | exact four-state / unknown surface | 重跑 inspection、默认 pass | TC-L2M-QRY-004；EV-CAND-L2M-QRY-004 |
| IF-QRY-005 | GetRuntimeMediationPosture | decision / attempt / unknown 分层 | 变更 Runtime outcome | TC-L2M-QRY-005；EV-CAND-L2M-QRY-005 |
| IF-QRY-006 | GetRuntimeMaterialReception | body-free reception view | 读取 Runtime outcome body | TC-L2M-QRY-006；EV-CAND-L2M-QRY-006 |
| IF-QRY-007 | GetOutboundDecision | decision 与 material / delivery 分离 | 从 current truth 临时重算 | TC-L2M-QRY-007；EV-CAND-L2M-QRY-007 |
| IF-QRY-008 | GetPublicationPosture | local attempt / gap page | 伪装 delivery ack | TC-L2M-QRY-008；EV-CAND-L2M-QRY-008 |
| IF-QRY-009 | GetInteractionTrace | append-only trace page / gap | Query 追加 trace 或修复 predecessor | TC-L2M-QRY-009；EV-CAND-L2M-QRY-009 |
| IF-QRY-010 | ListInteractionGaps | finite gap page / empty | 自动 reconcile / close gap | TC-L2M-QRY-010；EV-CAND-L2M-QRY-010 |
| IF-QRY-011 | GetObservationPosture | local posture / unknown | 声称 observed / evidence | TC-L2M-QRY-011；EV-CAND-L2M-QRY-011 |
| IF-QRY-012 | GetExternalContextResolution | neutral body-free view、stale / unavailable | Query refresh / resolver call | TC-L2M-QRY-012；EV-CAND-L2M-QRY-012 |
| IF-QRY-013 | ListExternalContextGaps | exact gap page / empty | 读取任意 source 或写修复 | TC-L2M-QRY-013；EV-CAND-L2M-QRY-013 |
| IF-QRY-014 | GetMemberSummary | committed summary、freshness / stale 可见 | rebuild source 或反写 | TC-L2M-QRY-014；EV-CAND-L2M-QRY-014 |
| IF-QRY-015 | GetCapabilityOutlet | safe ref / visibility、non-authorizing | registry / grant / invocation readiness | TC-L2M-QRY-015；EV-CAND-L2M-QRY-015 |
| IF-QRY-016 | GetMemberDiagnostics | redacted diagnostic、无 secret / body | 写 audit、泄露 stack / body | TC-L2M-QRY-016；EV-CAND-L2M-QRY-016 |

### 8.3 Consumer 验收矩阵（14）

| 验收项 | Consumer | 通过条件 | 失败条件 | TC / EV candidate | 依赖类型 |
|---|---|---|---|---|---|
| IF-CON-001 | HostFeedbackConsumer | verified source + matching attempt，local feedback / blocked receipt | 写 host lifecycle、错误 correlation 接受 | TC-L2M-CON-001；EV-CAND-L2M-CON-001 | event |
| IF-CON-002 | InboundFactConsumer | body-free descriptor + screening / rejected receipt | raw body 解析后落库 | TC-L2M-CON-002；EV-CAND-L2M-CON-002 | event + runtime |
| IF-CON-003 | RuntimeMaterialConsumer | formal safe material reception / blocked receipt | 复制 Runtime body / outcome | TC-L2M-CON-003；EV-CAND-L2M-CON-003 | event |
| IF-CON-004 | DeliveryFeedbackConsumer | matching publication attempt feedback / gap successor | 声称 delivered / accepted | TC-L2M-CON-004；EV-CAND-L2M-CON-004 | event |
| IF-CON-005 | ObservationFeedbackConsumer | matching observation attempt / local gap | 声称 observed / evidence | TC-L2M-CON-005；EV-CAND-L2M-CON-005 | event |
| IF-CON-006 | SubjectIdentityContextUpdateConsumer | owner-safe ref / neutral resolution | 生成第三执行主语 | TC-L2M-CON-006；EV-CAND-L2M-CON-006 | ref + event |
| IF-CON-007 | PolicyContextUpdateConsumer | safe snapshot / stale / gap | 保存 approval / rule body | TC-L2M-CON-007；EV-CAND-L2M-CON-007 | ref + event |
| IF-CON-008 | RuntimeBoundaryContextUpdateConsumer | formal boundary ref / reject wrong schema | 生成 Runtime state | TC-L2M-CON-008；EV-CAND-L2M-CON-008 | ref + event |
| IF-CON-009 | CapabilityContextUpdateConsumer | capability ref / mirror relation | 建 registry / invocation | TC-L2M-CON-009；EV-CAND-L2M-CON-009 | ref + event |
| IF-CON-010 | HostRouteContextUpdateConsumer | route ref / unavailable resolution | 生成 host health / route truth | TC-L2M-CON-010；EV-CAND-L2M-CON-010 | ref + event |
| IF-CON-011 | RuntimeMaterialReceptionConsumer | committed CP03 reception 后 local continuation | 缺 reception 仍准备 outbound success | TC-L2M-CON-011；EV-CAND-L2M-CON-011 | local fact |
| IF-CON-012 | MemberCommittedFactConsumer | committed fact ref only，trace / gap successor | arbitrary Store scan / source rewrite | TC-L2M-CON-012；EV-CAND-L2M-CON-012 | local fact |
| IF-CON-013 | MemberProjectionUpdateConsumer | fact + version 更新 read model，stale / conflict 显式 | 重建或修 source truth | TC-L2M-CON-013；EV-CAND-L2M-CON-013 | local fact |
| IF-CON-014 | CapabilityOutletSourceUpdateConsumer | CP06 resolution source → outlet posture | 授权 invocation / registry | TC-L2M-CON-014；EV-CAND-L2M-CON-014 | local fact |

### 8.4 24 outbound semantic candidate

| CP | candidate 名称 | 当前唯一验收条件 | planned TC / EV | 当前 disposition |
|---|---|---|---|---|
| CP01 | MemberStartupAdmissionRecorded；MemberPresenceChanged；HostCollaborationAttemptRecorded | 仅记录名称对应 local fact 语义；无 envelope / publisher / outbox / route | TC-L2M-EVT-001/002；EV-CAND-L2M-EVT-001/002 | Blocked(L2M-UP-005) |
| CP02 | MemberSubscriptionScopeChanged；MemberInboundFactRecorded；MemberScreeningDecided | 同上；zero configuration | TC-L2M-EVT-001/002 | Blocked(L2M-UP-005) |
| CP03 | MemberRuntimeDeliveryDecided；MemberRuntimeSubmissionAttemptRecorded；MemberRuntimeResultLinked；MemberRuntimeMaterialReceived | 同上；不将 local fact 当 Event | TC-L2M-EVT-001/002 | Blocked(L2M-UP-005) |
| CP04 | MemberOutboundDecided；MemberOutboundMaterialPrepared；MemberPublicationAttemptRecorded；MemberPublicationGapChanged | 同上；不创建 publication facility | TC-L2M-EVT-001/002 | Blocked(L2M-UP-005) |
| CP05 | MemberInteractionTraceRecorded；MemberInteractionGapChanged；MemberObservationMaterialPrepared；MemberObservationAttemptRecorded | 同上；不创建 observation route | TC-L2M-EVT-001/002 | Blocked(L2M-UP-005) |
| CP06 | MemberExternalContextResolutionChanged；MemberExternalContextGapChanged | 同上；不创建 generic event source | TC-L2M-EVT-001/002 | Blocked(L2M-UP-005) |
| CP07 | MemberSummaryProjectionChanged；MemberCapabilityOutletChanged；MemberDiagnosticViewChanged；MemberProjectionStateChanged | 同上；不创建 projection event / outbox | TC-L2M-EVT-001/002 | Blocked(L2M-UP-005) |

### 8.5 Operations Job 验收矩阵（5）

| 验收项 | Job | 通过条件 | 失败条件 | TC / EV candidate |
|---|---|---|---|---|
| IF-JOB-001 | PublicationRelay | finite attempt / gap selector、per-item local report、exact replay | 声称 delivered、盲重试、修 source truth | TC-L2M-JOB-001；EV-CAND-L2M-JOB-001 |
| IF-JOB-002 | ObservationRelay | local observation attempt / gap report | 声称 observed / evidence | TC-L2M-JOB-002；EV-CAND-L2M-JOB-002 |
| IF-JOB-003 | ExternalContextRefresh | owner-specific finite relation、safe resolution / gap | 授权、健康升级或 generic refresh | TC-L2M-JOB-003；EV-CAND-L2M-JOB-003 |
| IF-JOB-004 | MemberProjectionRebuild | committed refs、cursor / watermark、view successor、no source write | 修改 CP01~CP06 source | TC-L2M-JOB-004；EV-CAND-L2M-JOB-004 |
| IF-JOB-005 | GapReconciliation | finite gap + watermark、local freshness / report | 关闭 source gap、blind retry | TC-L2M-JOB-005；EV-CAND-L2M-JOB-005 |

### 8.6 跨仓依赖与下游未就绪裁决

| 依赖 | 全局类型 | 验收方式 | 未就绪姿态 | 禁止误判 |
|---|---|---|---|---|
| L0-core / core-contracts | compile | package / contract compile evidence | compile blocker | 不把其他 sibling 加入 Cargo |
| L2-runtime | runtime + ref + event | typed boundary、safe material、attempt / gap | blocked / waiting / unknown | 不声称 Runtime run / outcome |
| L2-member-service | runtime + adapter | host material / request / liveness / report | blocked | 不声称 registration / session / health |
| L2-member-images | ref / packaging handoff | opaque pinned ref / availability | waiting / not-available | 不声称 build / manifest / compatibility |
| L1-identity / work / governance / tools | runtime + ref | safe resolver result / freshness | blocked / stale / unknown | 不保存 owner truth |
| L0-bus / conversation / artifact / observability | event + handoff + downstream | body-free carrier / local attempt / gap | blocked / unsupported | 不声称 delivery / observed / archive |

### 8.7 接口 / 事件停审与跨接口审计

| 审计项 | 结论 | 修正 |
|---|---|---|
| 10/16/14/24/5 分母完整 | 通过（设计级） | 真实执行仍待 run |
| 正式协议名、状态和 carrier 可回指 03 | 通过 | 不新增 schema |
| 依赖类型未误判 | 通过 | Core-only compile，其他 seam 分类明确 |
| 24 candidate 未物化 | 通过（边界设计） | L2M-UP-005 关闭前保持 zero configuration |
| 下游未就绪处理可裁决 | 通过 | blocked / not_run / residual 不计 P0 pass |
| report / EV 路径固定 | 通过（规划） | 执行时必须有 artifact/report pairing |

## 9. 回填草稿

正式 §7 应保留 Command / Query / Consumer / candidate / Job 的 finite 验收矩阵、依赖类型、下游未就绪规则和跨接口审计结论；不固定 transport endpoint / topic。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| L2M-UP-001~008 exact schema / route | P1 正向接缝 | blocked / selected-run |
| L2M-DDD-003~007 receipt / helper | Consumer / Job 正向 lane | refusal / reserved |
| L2M-UP-005 event family | 24 candidate | zero configuration |

## 11. 进入下一步条件

- [x] 全部 public protocol 和 candidate / Job 分母已覆盖。
- [x] compile / runtime / event / ref / adapter / fake 分类可判定。
- [x] 每项均有正式 TC、EV candidate、report path 和 blocker 处理口径。
