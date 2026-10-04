# L6-bridges 03 Step10：独立状态机与转换矩阵

## 1. 当前状态与开工记录

2026-10-03；`full-restart / single-agent-serial`。用户已授权完成全部Step10，并明确同意先最小修订Step6~9。十三项repair及最终函数回指复查已通过，只关闭本地设计断口；外部正式资格仍open/未建立。当前B0/G0/M01~M21/F/X全部完成，Step10设计静态停审、用户审查waiting；S10-LOCAL-001仍open，下一Step准入blocked。精确恢复点见§9，完成批次逐项登记，不把设计pass写成外部成功或readiness。

恢复顺序：项目台账 -> 03 flow -> Step9/repair -> Step6~8 -> SOP10全文/书写§5.9。实际补读四技术phase/member卡、全部状态enum/finite result目录、02 Step9允许表及Step9测试索引。Governance Step10只借主语筛选、逐机停审及跨审组织；不借其truth、错误占位、outbox或结果。七专项正式合同沿既有来源登记按受影响部分核验，不冒称全部上游重读。

[开工范围基线](03_ddd_step_10_scope_baseline.json)：110原Bridges逐文件SHA-256、其他4678文件聚合；明确sorted walk与`path + NUL + sha256 + LF`recipe。只允许原03 flow/项目台账变化及当步新增文件；正式00~03、前序Step/repair、上游/standards/其他dirty保护。不实现代码、配置/SDK绑定，不编译或运行项目测试，不建implementation ledger/boundary，不stage或commit。

BR-UP-001~009=open、010=reference_only；Workspace原WS-UP/WS-LOCAL与Observability十二affected保持；平台SDK/OAuth/API Key/KMS/router及四平台真实安装not_selected/not_established。尤其Observability正式03§7.4静态producer map没有Bridges，不以本地规则/默认audit-only解除BR-UP-006。

## 2. 输入与本步边界

| 输入 | 当前用途 / 真相上限 |
|---|---|
| 正式02§9 / `02_hld_step_09_state_transitions.md` | 十七局部主语与允许边；小写历史概念映射到Step6 exact enum；构造不算状态迁移 |
| Step6 shared / Domain / Application / Infra / Entry | 唯一enum、字段、factory/成员、hydration与技术phase；不改其正式签名 |
| Step7 ports/support/callables/adapter | exact typed读取、资格、注入、CAS/claim、finite错误及正式外部requirements |
| Step8二十协议 / Step9十九flow与共享UoW | 触发输入、阶段A/B/C/D、结果先读/回放、副作用、current与private边界 |
| repair§6最终审查 | 十三项本地闭口，缺外部compatible来源仍NotEstablished；J03先B实际close后独立C取stage coverage |
| SOP10 / 书写§5.9 | 筛主语 -> 分族 -> 逐机状态/ASCII/矩阵/非法/停审 -> 跨审；完成即用户停审 |

## 3. SOP问题回答与诊断

| SOP问项 | 当前回答 / 诊断与取舍 |
|---|---|
| 1~2 候选与排除 | 十七原durable局部机、四个已存在技术phase进入；有限result/qualification另表穷尽消费。ref/Slot/DTO/cache/lock/counter及外部truth不硬造迁移。 |
| 3~4 正式机与状态族 | §4六族；既有projection/report只有只读slice/返回result，无独立truth/刷新机；不得增GlobalState。 |
| 5~6 归属/状态 | §5逐机回指Step6卡；状态exact enum、factory初值与hydrate分开，旧小写只作概念对照。 |
| 7 触发 | Step6具名成员加Step9明确flow；技术phase只Entry/Infra宿主触发，不倒置Application依赖；Query纯读。 |
| 8 typed条件/副作用 | 每机列actual完整read/expected、资格字段与原阶段；纯candidate与actual durable commit分开；§6只共用纪律，不能替单机guard。 |
| 9 非法与audit | 已有ContractViolation/BridgePortError，不借Governance错误占位；零修改拒绝不新写audit。实际安全拒绝状态变化也必须原UoW/audit。 |
| 10 单机停审 | 状态/边/函数/字段/非法/副作用/planned测试逐机检查后登记；失败不能进入下一机或预填pass。 |
| 11 跨审 | 同名Accepted/Completed/Resolved等分阶段；constructor不算边；reserved与不可达正向分开；再核原十一planned路径和后续状态名。 |

诊断：02允许表展开含六项“无记录”构造，不能把它们塞进enum。Step6已具名三轴/双轴guard及unknown恢复，但摘要图不足表明原结果优先、事务实际提交与typed coverage。采用独立矩阵，拒绝全局ACK->Turn->delivery->evidence成功链。技术phase保留真实责任与未决集合，source连接状态不代表平台全局水位；结果分类有限分支映射而非新增global生命周期。

## 4. 状态主语筛选与状态族

| 候选主语 / exact来源 | 进入方式 | 状态族 / 理由 |
|---|---|---|
| BridgeInstallation、ExternalBinding / Step6 Domain state | M01/M02独立机 | local business truth：只配置及经授权relation；不授owner/platformtruth |
| ExternalIdentityMapping、ExternalLocationMapping、ExternalMessageMapping / 三state | M03~05独立机 | source/reference：授权relation的两端/原版本历史，不是外部实体truth |
| InboundHandoffRecord、DeliveryIntent、DeliveryAttempt、ExternalActionBinding、CallbackHandoffRecord | M06/M08~11独立机 | local business/effect责任：原op/effect/one-use接管、已知结果与未知分别保真 |
| SafePresentationPlan / PresentationState | M07独立机 | read/visibility：不可变含义外显计划的消费资格，非内部内容truth |
| StreamCursor、GapRecord、DispatchLane、RecoveryRecord | M13~16独立机 | source/reference与local continuity：位置/覆盖/限流/恢复各归原主语 |
| DedupRecord / DedupState | M12独立机 | idempotency/stored replay：原键/op结果引用与保留责任，不授再次执行 |
| SafeHandoffRecord / SafeHandoffState | M17独立机 | handoff propagation：实际canonical材料/原consumer op；没有通用outbox |
| RuntimeExecutionState、JobInvocationState、PlatformSourceSession、WorkerSchedulingBatch | M18~21独立机 | runtime/adapter/entry technical：进程/调用/来源/批次本地phase；非business state |
| OwnerResultKind、ConsumerResultKind、PlatformReceipt及KnownPlatformBusinessResultKind、ProbeOutcome | F有限消费 | 外部权威result分类，不拥有其truth或创建本地“平台状态机” |
| LocalCommitKind/Disposition、LocalCasDisposition、StoredResultReuseDecision、MutationObservationRequirement | F有限消费 | 原driver/资格单次返回或计划分支，不能任意推进enum |
| SafeViewDisposition、ViewFreshnessKind、BridgeReadResult、SafeStageObservation/Slice、SafeLocalBusinessState | F有限消费/投影穷尽 | projection/read/report：纯读取既有truth；无refresh/history/stale sidecar |
| ProtocolAckAction/Disposition、ConsumeDisposition、JobResultDisposition、ApiEntryDisposition、WorkerItemDisposition | F有限消费 | 单次entry结果；虽有Pending/Dispatched字样，无独立truth或对应transition成员 |
| BridgeCommandResult、StoredResultPayload、PreparedResultPayload、IngressVerificationResult、BridgeQualificationOutcome、RuntimeAvailability | F有限消费 | 返回/资格结果，不造生命周期；完整typed载荷及known/unknown上限 |
| SafeAuditRecord、CommittedLocalMutationRef、PlatformReceipt、SafeOriginalResultRef | 排除独立机，保F/read来源 | immutable actual历史/proof；创建/append或读取不等“转成功” |
| PreparedLocalChange/Plan/seed、ExistingLocalSnapshot、DTO/Input/metadata/wrapper | 排除独立机 | 结构化载荷/穷尽selector：按原19变更/11snapshot验证，不含独立lifecycle |
| QualificationSlot及全部具名Slot、ParentLocationRefSlot、OwnerRequiredDigestRefSlot、GapRangeBounds、OpaqueStreamPositionSlot | 排除独立机；F/单机guard有限消费 | Missing/Established/Stale/Unknown表达资格或材料，不能自己claim/authorize/推进position |
| 所有Ref/ID/Locator/Meaning/expected/revision/fence、secret/provider/key用途 | 排除独立机 | 值/opaque关联；不得解析opaque ref、external_id自建GlobalMember、secret shape授权 |
| PlatformKind/source mode/family、action/change/target/actor/account/location kind、namespace/scope/stage/order/filter | 排除独立机；原selector表消费 | 分类维度非状态；平台HTTP/Socket/Polling/Gateway正式mode各独立seam，不跨模式复用验证 |
| Budget/rate bound/clock/window/cancel/index、SQL锁/缓存/SDK内部状态/UI、GlobalState候选 | 排除独立机 | 有限资源/实现细节；不新增owner/平台truth或全局成功机；无新对象 |

| 状态族 | 独立机 / 有限载荷 | 所属模块 | 停审顺序 |
|---|---|---|---|
| local business truth | M01/02/06/08~11 | Domain U1~4 | 按M编号而非跨对象统一推进 |
| source/reference continuity | M03~05/13~16 | Domain U1/U5 | 同上，gap覆盖与stage覆盖独立 |
| read/visibility | M07；F中的四Query slice | Domain U3 / Application只读 | M07；F，不造projection机 |
| projection/report maintenance | 无独立机；view/job summary/result | Application/Contracts | F有限消费，无report/run/artifact |
| handoff propagation | M17 | Domain U6 / 原SafeObservationPort | M17，不叫outbox或producer准入truth |
| idempotency/stored replay/job result | M12；F中的immutable结果及job返回 | Domain U5 / Application/Contracts | M12；F，不覆盖旧stage proof |
| runtime/adapter/entry technical | M18~21；F中的entry finite结果 | Infra/Jobs/Worker/API | M18 -> M19 -> M20 -> M21 -> F |

## 5. 逐机批次计划

| 批次 | 主语 / 所属模块 | enum | 主要触发flow | 思考 | 写入 | 自检 / 停审 |
|---|---|---|---|---|---|---|
| B0 | 开工与范围 | 不适用 | 不适用 | done | done | pass_structure_only |
| G0 | 筛选/分族/共用约束 | 原finite类型 | 全部十九flow | done | done | pass_design |
| M01 | BridgeInstallation / U1 Domain | BridgeInstallationState | C01/J05/Q01 | done | done | pass_design_static |
| M02 | ExternalBinding / U1 Domain | ExternalBindingState | C02/J05/跨U/Q01 | done | done | pass_design_static |
| M03 | ExternalIdentityMapping / U1 Domain | IdentityMappingState | C03/J05/Q01 | done | done | pass_design_static |
| M04 | ExternalLocationMapping / U1 Domain | LocationMappingState | C03/J05/Q01 | done | done | pass_design_static |
| M05 | ExternalMessageMapping / U1 Domain | MessageMappingState | C03/E01/J01/J05/Q01 | done | done | pass_design_static |
| M06 | InboundHandoffRecord / U2 Domain | InboundHandoffState | E01/J02/Q02 | done | done | pass_design_static |
| M07 | SafePresentationPlan / U3 Domain | PresentationState | C04/E02/J01/J05/Q02 | done | done | pass_design_static |
| M08 | DeliveryIntent / U3 Domain | DeliveryIntentState | C04/E02/J01/J02/Q02 | done | done | pass_design_static |
| M09 | DeliveryAttempt / U3 Domain | DeliveryAttemptState | J01/J02/Q02 | done | done | pass_design_static |
| M10 | ExternalActionBinding / U4 Domain | ExternalActionState | C05/E03/J05/Q02 | done | done | pass_design_static |
| M11 | CallbackHandoffRecord / U4 Domain | CallbackHandoffState | E03/J02/Q02 | done | done | pass_design_static |
| M12 | DedupRecord / U5 Domain | DedupState | C/E/J/J05 expiry/原result回放/Q03 | done | done | pass_design_static_after_authorized_repair，外部current保持 |
| M13 | StreamCursor / U5 Domain | StreamCursorState | E01/J01/J03/J05/Q03 | done | done | pass_design_static |
| M14 | GapRecord / U5 Domain | GapState | E01/C06/J03/Q03 | done | done | pass_design_static |
| M15 | DispatchLane / U5 Domain | DispatchLaneState | C04/E02/J01/J02/J05/Q03 | done | done | pass_design_static |
| M16 | RecoveryRecord / U5 Domain | RecoveryState | C06/J02/J03/Q03 | done | done | pass_design_static_fail_closed |
| M17 | SafeHandoffRecord / U6 Domain | SafeHandoffState | 条件O01/J04/E04/J02/J05/Q04 | done | done | pass_design_static_fail_closed |
| M18 | RuntimeExecutionState / Infra runtime | RuntimeExecutionPhase | runtime宿主装配/退出 | done | done | pass_design_static_fail_closed |
| M19 | JobInvocationState / Jobs | JobInvocationPhase | 五J外层有界调用 | done | done | pass_design_static_fail_closed |
| M20 | PlatformSourceSession / Worker | SourceSessionPhase | E01/E03 owning source | done | done | pass_design_static_fail_closed |
| M21 | WorkerSchedulingBatch / Worker | WorkerBatchPhase | 五J原candidate顺序调度 | done | done | pass_design_static_fail_closed |
| F | 单次result/qualification/disposition有限消费 | 原enum，不增机 | 全部十九flow/entry | done | done | pass_design_static_fail_closed |
| X | 跨机命名/trigger/phase/错误/副作用/测试及范围 | 全部 | 独立结论后历史冲突扫描 | done | done | pass_fail_closed_external_gates_open；S10-LOCAL-001仍open |

每机先读取原卡/flow -> 回答问题/诊断/取舍 -> 状态与guard结构 -> ASCII/矩阵/非法/副作用/测试草稿 -> 本机审查，过后才进入下一机；只在实际到达时创建附录。批次不代表实施boundary、run或signoff。

| 当步附录计划 | 到达时创建 / 责任 |
|---|---|
| `03_ddd_step_10_binding_mapping_states.md` | M01；五U1机，逐机追加 |
| `03_ddd_step_10_handoff_states.md` | M06；Inbound、Action、Callback、SafeHandoff；各机实际轮到才追加 |
| `03_ddd_step_10_delivery_states.md` | M07；Plan、Intent、Attempt独立机 |
| `03_ddd_step_10_continuity_states.md` | M12；Dedup、Cursor、Gap、Lane、Recovery |
| `03_ddd_step_10_technical_states.md` | M18；四技术phase及F有限消费表 |

## 6. 共用转换、错误与副作用契约

### 6.1 记法、字段与非法错误

矩阵中的`对象.成员 @ flow`是具名回指，不是新API：全签名以每机链接的Step6原对象卡为准；port全签名在Step7原trait。`CV`只缩写`ContractViolation`、`PE`只缩写`BridgePortError`，不是新增alias/enum。图摘要可省次要边，矩阵是全集；“构造”单表不算enum状态，Domain原机rehydrate只same subject/revision的actual LocalHydrationBasisRef，不任意factory造终态；技术机无rehydrate/store。

| 标签 | 精确错误 / 判据 | 安全处置 |
|---|---|---|
| E0 | `CV::InconsistentFields`：未列state边、expected与loaded不符、重复claim或跨阶段混载荷 | guard失败零字段/revision修改；不返回伪new state |
| E1 | `CV::InvalidValue`：非法值/checked revision溢出；`CV::WrongKind`：kind不匹配 | 不从raw error/free text映射业务成功 |
| E2 | `CV::MissingRequired`：state-required Slot缺失；`CV::OutOfScope`：主体/namespace/action不符；`CV::Expired`：原窗口无效 | current port实际Denied/Stale/NotEstablished/Unavailable与shape错误分开 |
| E3 | `CV::UnknownEffect`：无权威已知/no-IO/no-effect/覆盖却要推进 | 保原op/effect/阶段、零再IO；lease/NotFound/取消不能当证明 |
| E4 | `CV::ForbiddenMaterial`：正文/token/secret/敏感审批或可还原派生进入safe材料 | 拒绝材料，不写日志、audit/证据或error source |

所有矩阵E包含E0（源state错/终态复活）；其余按实际typed predicate采用E1~E4。Application不造新的InvalidStateTransition；pure非法输入有限PE::InvalidInput；权限/来源缺口沿原PE::Denied/NotEstablished/Stale/Unsupported/Unavailable；driver CAS沿PE::Conflict(原BridgeLocalConflict)；越commit/foreign boundary未知只原PE::Indeterminate{original,phase}。不把known业务拒绝换成transport error。每机非法表明确额外红线。

### 6.2 候选、事务、版本与副作用

`U`仅下列内联事务纪律的表格记法，不是新增helper/函数。Domain只纯candidate变化；local truth以actual commit为准。外部资格/secret/private IO在tx外。Existing各用原repo完整versioned read；Absent只真实首建，Present为原loaded local revision；config/generation/cursor/lane轴另核，不以一轴代另一轴。

| 场景 | 持久化与外部副作用上限 |
|---|---|
| U：实际local变化 | Step9原begin -> unique/reserve -> pure -> typed stage全部subjects/dedup -> 原immutable result seed -> 唯一SafeAuditRecord -> 正式条件handoff -> validate/seal -> commit；同一次actual UoW，失败无部分真相 |
| 同key/meaning重入或零变化/Query/guard失败 | actual原result先读并current过滤；不补audit/trace/history/新dedup/IO；非终态只原record合法成员继续，不从stored A local proof推业务终态 |
| A接管、B可能IO、C结果finalize | 各有原mutation，业务original/effect不换。只有actual durable claim后重核current才可能foreign IO；commit unknown不外呼。已知结果优先，后续不覆写A的immutable payload |
| commit/rollback未知 | 保原mutation/original/phase；只原driver权威只读恢复，不能新begin重apply或换ID逃unique；rollback不撤销foreign已发生效果 |
| audit/conditional canonical/O01 | 所有actual local变化有安全audit；OwnerPermitsAuditOnly需正式rule。Mandatory/OptionalQualified须完整canonical/schema/admission/current才same-UoW原handoff；无rule不fallback。NonRecursiveResultOnly须覆盖本阶段全部拟写subjects的正式rule、audit仍必需、handoff=None、零递归O01 |
| 禁止额外写 | 无通用outbox、独立TraceRecord/history、持久view/projection-stale/cache/report/run/evidence/sidecar；本Step不产生实施ledger/boundary或运行材料 |

U副作用以每机列出的具体repo/完整expected集合为准；跨owner/平台/consumer不在local事务内。Query四入口仅既有snapshot + CurrentReadQualification + LocalViewProjector过滤，不启动恢复/刷新或修改state。技术phase纯进程本地，无独立U/audit；其触发的Application实际mutation仍原U。

### 6.3 planned测试与停审判据

复用Step9§7.5十一原planned路径简称A/C/R/D/B/L/P/S/I/W/J；[完整路径索引](03_ddd_step_09_processing_flows.md#75-唯一planned测试target索引)是测试计划，不创建/执行文件或宣称结果。每机：合法边逐行、非法补集/终态、wrong kind/namespace/required/expired/CAS/溢出、unknown及current失效反例；pure D、same-UoW L及所属flow/entry切口分开。未来05/06/07只能沿exact enum名称，不用“送达/审批成功/恢复完成”等替代标签；不创建TC/EV或验收signoff。

G0/逐机停审记录：筛选/分族覆盖原enum目录；十七durable + 四已有technical，与23ports/19callable/20协议边界一致；无新增机/variant/port。所有原允许边已逐机展开，F有限载荷分支闭口；M01~M21/F各自静态停审后才进入X。当前X亦完成，整体结论见§7/9；M12三expiry positive及外部门禁保留。

## 7. 跨状态机审计与后续交接

### 7.1 X问题、诊断、取舍与exact回指

问题：逐机pass不能证明跨机同名、触发surface和副作用一致。诊断发现M17的O01/E04 factory/claim、J05 resume、错误variant和planned Worker target回指漂移；技术机被套Domain hydration，M21 CompletedLocal被错误限定无unknown，并漏写同态/收齐的另一个原触发；两处struct被写成enum variant，M01迁移成员数误写6。只修当前Step10附录的展开，不新增源enum/member/port或回改Step6~9，S10-LOCAL-001保open；修后重新单机核对再做X静态复跑。

表内D=Step6 Domain独立对象卡及shared exact enum，I=Step6 Infra，E=Step6 Entry；技术phase须同时消费Step7 Entry的精确owned覆盖。flow代码只回指Step9十九已有callable/条件O01及宿主，并非新增API。17 durable机81个enum label、123条distinct允许状态对；四技术机20个label、27条状态对。Ready->Ready是cursor After的实际revision变化；Dispatching->Dispatching是batch原有继续/返回分支，不把纯no-op算新增边。02允许表四行“无记录”展开为六个构造目标，均排除迁移计数。

| 机 / 对象 | exact enum | 状态数 | 状态对数 | 原卡 / 主要trigger | planned切口 |
|---|---|---:|---:|---|---|
| M01 BridgeInstallation | BridgeInstallationState | 5 | 12 | D；C01/J05 | D/A/L/P/R |
| M02 ExternalBinding | ExternalBindingState | 5 | 9 | D；C02/J05 | D/A/C/L/R |
| M03 ExternalIdentityMapping | IdentityMappingState | 3 | 3 | D；C03 invalidate/J05 revoke | D/A/C/L/R |
| M04 ExternalLocationMapping | LocationMappingState | 3 | 3 | D；C03 invalidate/J05 revoke | D/A/B/C/L/R |
| M05 ExternalMessageMapping | MessageMappingState | 3 | 3 | D；C03 tombstone/J05 invalidate；E01/J01只known首建回链 | D/A/C/B/L/P/R |
| M06 InboundHandoffRecord | InboundHandoffState | 7 | 10 | D；E01/J02 | D/A/C/L/B/I/W/P |
| M07 SafePresentationPlan | PresentationState | 4 | 4 | D；C04/E02构造，J01/J05维护 | D/A/P/C/L/R |
| M08 DeliveryIntent | DeliveryIntentState | 8 | 14 | D；C04/E02构造，J01/J02 | D/C/L/B/A/P/J/R |
| M09 DeliveryAttempt | DeliveryAttemptState | 6 | 9 | D；J01 A/B/C/D及J02 | D/L/C/B/P/J/R |
| M10 ExternalActionBinding | ExternalActionState | 4 | 3 | D；C05构造，E03 one-use/J05维护 | D/A/C/L/B/P/I/W |
| M11 CallbackHandoffRecord | CallbackHandoffState | 7 | 8 | D；E03/J02 | D/A/C/L/B/I/W/P/R |
| M12 DedupRecord | DedupState | 4 | 6 | D；原C/E/J；受权新增Config资格取得/J05 expiry，外部current仍须建立 | D/C/L/R/P/J/S |
| M13 StreamCursor | StreamCursorState | 3 | 6 | D；E01 notice，J03 C/J05 | D/C/L/B/J/R |
| M14 GapRecord | GapState | 4 | 6 | D；E01构造/C06关联/J03 | D/C/L/B/J/R |
| M15 DispatchLane | DispatchLaneState | 4 | 9 | D；C04/E02构造/J01/J02/J05 | D/C/L/B/J/W/R |
| M16 RecoveryRecord | RecoveryState | 5 | 8 | D；C06/J02/J03 | D/C/L/A/P/J/R |
| M17 SafeHandoffRecord | SafeHandoffState | 6 | 10 | D；O01只条件构造/J04 R-A-B；E04/J02只结果/J05只block | D/A/C/R/B/L/P/S/W/J |
| M18 RuntimeExecutionState | RuntimeExecutionPhase | 5 | 4 | I；required宿主begin/shutdown/stop | A/C/L/P/I/W/J |
| M19 JobInvocationState | JobInvocationPhase | 5 | 5 | E及Step7；五J外层dispatch/return/cancel | A/C/L/I/W/J |
| M20 PlatformSourceSession | SourceSessionPhase | 5 | 10 | E及Step7；E01/E03 source host实际connect/disconnect/stop | B/C/I/P/W/J |
| M21 WorkerSchedulingBatch | WorkerBatchPhase | 5 | 8 | E及Step7；owned take/return/stop，非stream水位 | A/C/L/I/W/J |

每条durable边都有所属Domain具名member；120条有当前Step9触发要求，M12另三条expiry只有已定义member、没有正式取得/flow，不能报无孤儿positive或SOP下一Step准入通过。四technical机仅宿主phase；不得要求Application倒置依赖Infra/Jobs/Worker或添加repository。

### 7.2 跨机命名、非法边与副作用审计

| 审计项 | 结论 / exact消费规则 | 缺口 / 本步修正 |
|---|---|---|
| enum大小写/状态数/允许对 | 21个enum按Step6逐variant；durable允许对与02 slash展开逐项相等，构造排除 | 不增label/GlobalState；技术8个batch状态对不等8次调用，两个同态/收齐触发均回原member |
| trigger归属 | C01~06/Q01~04/E01~04/J01~05和条件O01各守原surface；Q全部zero-write | M17首建仅O01条件附着，J04唯一claim通路，E04/J02 result-only，J05对M17仅block；M12 expiry三边受权修补取得/J05消费 |
| Accepted/Rejected | M06/M11 Owner*为同op owner结果；M08 PlatformAccepted为effect；M09 Known*为attempt；M17 Consumer*为consumer | transport ACK/2xx不映known，四方不得替代；consumer accepted不是evidence/verdict/signoff |
| Completed/Resolved/Closed | M19 CompletedLocal无未决；M21同名仅batch收齐且原unresolved保留；M16 Resolved只RK/RR/RG；M14 Closed只原gap coverage | local commit单独不Resolved；GapCovered与stage advance分开；batch完成不证明平台全量完成/无未知 |
| Active/Qualified/Dispatching | 安装/绑定/mapping/plan的current与runtime/source phase各自限定；三个Dispatching主体有各自claim/effect/material | state标签不授下一IO；原required/current/fence/window/rate/secret都要实际重核 |
| Blocked/Manual/Indeterminate | M07/M11 Blocked是终态；其他Blocked只原机具名恢复；M12 expired仍保原unknown；M16 Manual不是Gap Manual | M17 Blocked须NoEffect才resume，带旧claim迟到known保责任/人工出口，不发明known finalize出边；零跨机通用reset |
| 非法补集/终态复活 | 各机未列state对拒绝，CV E0~4有限；pure guard失败所有字段/revision零变化 | 不借duplicate/TTL/reconnect/取消/lease/NotFound造NoIo/NoEffect；Action Claimed永久one-use不释放 |
| reserved/可达性 | 所有101个label都在原factory/guard的结构可达图内；没有新phase-reserved state/transition | 结构可达不等current可执行；M12 expiry设计缺口需当前repair重审，外部current proof仍不可由状态图取得 |
| 有限错误与载荷 | CV八variant、PE十variant沿原卡；finite Known/Probe/LocalCommit/qualification按技术F消费 | 去除不存在的PE ForbiddenMaterial，改原InvalidInput(CV ForbiddenMaterial)；两struct用outcome()/kind()读取原enum |
| current/expected/版本 | 原完整versioned read及read-set；local CAS与config/generation/cursor/lane轴独立；首建Absent不伪Present1 | Step10不造DDL/新port/driver guarantee；scope与stage覆盖、qualified声明与actual提交分别校验 |
| UoW/commit未知 | pure candidate不durable；unique/claim/stage/immutable seed/audit/正式条件handoff同U；original及phase保留 | actual durable claim/phase commit先IO，commit unknown零外呼/new apply；rollback不能撤销foreign效果 |
| audit/条件O01/非递归 | actual business mutation才原safe audit；Mandatory/OptionalQualified具完整canonical/admission；AuditOnly须正式rule | M17 lifecycle每阶段正式NonRecursiveResultOnly覆盖全部拟写subjects，audit必需/handoff=None，缺rule不fallback；无通用outbox/history/sidecar |
| query/read/projection | Q01~04 resolver-first/current裁剪既有snapshot，F的View/Stage/Freshness只是返回surface | 不用Q发probe/repair/维护stale/clock-ID/dedup/audit；hidden stage/ref/count不输出、不伪0 |
| secret/private/外部owner | private owning材料只tx外短借；safe载荷仅正式ref/有限reason，禁止raw及可还原正文/token/secret/敏感审批 | external_id零GlobalMember创建；zero Conversation/Turn/Gate/Decision/Artifact/Workspace/platform truth；SDK/OAuth/API Key/KMS/router未选未核不执行 |
| planned测试/后续命名 | A/C/R/D/B/L/P/S/I/W/J全归原Step9§7.5；单机合法/非法/unknown/current/NoIo/NoEffect及U/entry分开 | 删虚构worker_boundary_tests，沿consumer_dispatch_tests；后续05/06/07只能exact enum+stage，不把设计pass写成TC/EV结果 |

### 7.3 外部正式输入复核与历史后置差异

本次受影响范围实际补读：SDK正式03§3.3、Conversation正式03§7.4、Identity正式01§3与03§7.1、Governance正式03§9及校准Step10§14~19组织/跨审、Artifact正式03§7~9、Workspace正式03§9、Observability正式03§7.4及本项目repair§1~5。既有七专项/必要台账来源沿项目台账与Step1，不冒称本次全部00~07重读，也没有新的网络、SDK pin或平台安装核验。Governance只借组织/跨审粒度，其outbox、错误占位、report/trace/state不作为Bridges输入。

| 当前正式边界 | 本步消费上限 / blocker |
|---|---|
| SDK actor/metadata/credential ref及query no-write | SDK不负责gateway鉴权/token parsing；Bridges的adapter/secret/入口资格不能借SDK形状放行，BR-UP-007保持 |
| Conversation mapped payload/source/actor/digest | AppendFact原Integration/BridgeMapped责任、target_mode、Required digest与禁正文guard保留；Bridges不从平台ACK/identity映射自造accepted/Turn，BR-UP-001保持 |
| Identity稳定成员/账号与Governance actor/Gate | external account只是授权relation端点；actor/current责任及二次Policy/Gate不可省；M10/M11不拥有Decision，BR-UP-002/003保持 |
| Artifact引用与Workspace coverage/visibility | 附件只authorized grant/ref，不自动evidence/公开正文；Workspace Ready/Completed/Complete不授Bridges当前披露或stage coverage，BR-UP-004/005保持 |
| Observability producer static map | 九operation static map与SourceAudit四family均无Bridges，不借其他producer标签、不因本地audit规则解除admission；BR-UP-006保持 |
| 四平台source/SDK/secret/rate/probe | 独立adapter/local phase不拥有平台truth；BR-UP-007/008/009、not_selected/not_established及原Workspace/Observability未决原状态保持；L5-chat BR-UP-010 reference_only |

独立结论后才读历史README全文及旧正式03§7.7、§8.2~8.4、§11等定点段落；二者始终historical_material，未授输入/写权限。

| 历史内容 | 冲突 / 当前处置 |
|---|---|
| README Python/TypeScript平台SDK、OAuth优先/API Key fallback/KMS及external_id↔GlobalMember布局 | 不继承产品选择、代码布局或默认身份链；沿原七role/adapter/config/secret seam及授权mapping，不修改历史文件 |
| README简化GateCard/打开Chat审批、所有bot操作进observability | 明确无敏感/无action降级与authorized route；不默认L5-chat入口资格或every-mutation producer准入，未建立保持blocked |
| 旧03统一BridgeRequested->Mapped->Delivered->Acked/Failed/TimedOut/Replaying | 拒绝跨owner/platform/ACK的全局成功机；当前17 durable+4 technical独立，不继承Delivered/统一IntegrationStatus |
| 旧03 timeout/duplicate进入ReplayRequest/ResyncTicket/RepairEntry与恢复history | 不因timeout/duplicate重发或产生新report/evidence/history；只原op/effect权威结果、NoEffect/current/预算及具名恢复出口 |

### 7.4 原停止条件与受权续接

原X停审时S10-LOCAL-001为open；最新用户确认并授权必要repair及剩余03。[expiry repair](03_ddd_step_10_expiry_repair.md)已闭合具名取得/J05消费/目标与Job两key/CAS及Plan关联，重审后S10-LOCAL-001=closed_design_contract。17+4机/101label/150允许对不变，M12三expiry有正式设计触发；外部current不足仍零U/调用，全部BR-UP仍open/reference_only，不产生readiness。

当前只完成Step10并停审；Step11准入仍blocked。用户确认后还须明确本地repair授权及重审通过，才能另行决定Step11进入权限。届时下一阅读为当前M12/原RetentionExpiryBasisRef、Step6~9取得/允许入口与当前retention owning合同；真正授权Step11后才读SOP11/书写§5.10、原repository/UoW/完整expected/commit未知与正式02持久化边界。现在不读取或创建Step11，不写正式03、实施台账/boundary、代码或运行材料，不stage/commit。

## 8. 草稿与复杂度

本步主文件承担筛选/分族/计划/共用规则/跨审；五附录逐机完整草稿是未来正式03§9来源。只产生local合同，不新增truth对象、state variant、public协议/port/代码文件；函数全签名沿原对象卡可回指，后续Step11~16只在另获授权后读取。不一次性预填全部done。

## 9. 当前门禁

```text
current_document = 03
current_step = 10
current_module = expiry_repair_complete
document_status = in_progress
step_status = done
step10_design_self_review = pass_fail_closed_external_gates_open
step10_user_confirmation = explicit_repair_then_remaining_03
step10_positive_contract_review = pass_local_design_external_gates_open
step10_next_step_entry_review = pass
gate_status = pass
gate_reason = local_expiry_contract_reaudit_pass_external_gates_open
next_allowed_action = enter_step11
targeted_repair_allowed = false
calibration_write_allowed = false
formal_document_write_allowed = false
step10_allowed = false
step11_allowed = false
implementation_write_allowed = false
implementation_ledger_allowed = false
test_execution_allowed = false
commit_required = false
```

## 10. 实际静态检查与过程记录

B0：110原Bridges逐文件与其他4678文件当前hash已在首次Step10写入前捕获，recipe明确；只创建本步骨架/基线与同步三层，未报单机或整体pass。repair最终347调用/212distinct、26Markdown的1164表/587块/62链接均是修订阶段checkpoint，不能继承为本Step审计结果。

2026-10-03续接：磁盘主矩阵已完成M01~M21/F、恢复到X，但flow门禁块与项目台账仍残留M16。先指出并仅同步三层恢复元信息到X，不改前序合同或继承整体pass。回读SOP10全文、书写§5.9、恢复/写入前门禁、真相源§2.1/§3.5.5~6和全局§4.1；当前步骤仅跨审。只读续接checkpoint为4795文件（Bridges117、其他4678），用于核对本次写入范围，不能替代本Step开工基线或长期恢复台账。

X实际静态检查：只读Node内存扫描八Markdown（主文件+五附录+flow/台账）118表/25围栏块/27本地链接及anchor，列数/围栏/链接/尾空白errors=[]。按原Rust-facing文本声明核21个exact enum、81 durable+20 technical label、123+27状态对、所属对象member和状态集合；02四constructor行展开六目标排除，允许对差异/重复/结构不可达/undefined error variant/struct当enum均0。检查只验证设计文本/图结构，不是compiler、borrow checker或guard自动证明；三expiry边仍local positive blocked，不能由结构可达宣可运行。M17 trigger归属/逐阶段非递归/known priority与M21 owned return及unresolved还做了独立人工对照，未运行项目测试。

范围实际核对：开工110 Bridges原文件只有flow/台账两个允许hash变更，其他108保护文件changed=[]/missing=[]；其他4678文件按原recipe聚合与基线同摘要。续接checkpoint至X写后仅七个已存在文件变化：本主文件、binding_mapping/continuity/handoff/technical四附录、03 flow和项目台账；added=[]/missing=[]。delivery附录/Step10 JSON/前序repair/正式00~03/README/draft/上游/standards/其他dirty均未变；Step11~19/implementation ledger/boundary文件0。git diff --check -- projects/L6-bridges/实际通过，cached为空，未stage/commit。

过程限制：首次ancestor查找未发现适用AGENTS；宽只读搜索触及无关workdoc权限拒绝，后续收窄到精确项目/来源；一次错误文件glob未匹配、几次广rg输出截断均未写入，必需段落改精确文件/范围补读，不声称读未返回全文。初次edge scanner仅按合法label过滤，为避免漏报，正式复跑改逐From/To表检验所有行、所属object card及有限错误，并将constructor行数4与展开目标6分开。它是有限文本scanner，不能替代Rust类型/借用或正式平台兼容检查。

封存：B0/G0/M01~M21/F/X均done，只指本Step设计展开/静态自检；user_confirmation=waiting。S10-LOCAL-001、BR-UP-001~009、Workspace/Observability原未决、产品not_selected/not_established仍保留，SOP下一Step准入blocked；只等待用户确认及必要最小repair另行授权，不进入Step11、正式03或实施，不需提交。
