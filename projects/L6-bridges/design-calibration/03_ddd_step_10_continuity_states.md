# L6-bridges 03 Step10：去重、位置、缺口、顺序与恢复

共用E0~E4/U/测试简称见[主文件§6](03_ddd_step_10_state_matrix.md#6-共用转换错误与副作用契约)。五机独立，不能合offset/retry表；opaque平台position只正式comparator消费，不宣外部全局水位。

## M12 / DedupRecord

### 问题、诊断与取舍

归属U5 Domain `continuity/dedup_record.rs`；enum=`DedupState`。全字段/签名回指[Step6 DedupRecord](03_ddd_step_06_domain_contracts.md#deduprecord)，Step9共享§4及C/E/J关联、Q03。原key/typed meaning/original/result与保留窗口独立；Missing result Slot不能当Fresh，过期不能删key重执行。采用immutable stored proof + 原mutable业务record推进，不覆写A结果。

### 状态集合

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| Reserved | 原op原子接管，真实结果Slot可尚Missing | 否 | match_meaning/attach_result/mark_unknown；有正式expiry才expire |
| ResultRecorded | 原actual stored结果已关联，可能只是local A proof | 否 | current受权复用；有正式expiry才expire；不授业务成功 |
| Indeterminate | 原跨边界效果未知 | 否 | 权威原结果attach_result；有正式expiry才expire，unknown仍保留 |
| Expired | 复用窗口到期且受限tombstone保留 | 是 | 受权历史/原unknown责任；零新execute |

### ASCII转换图

```text
[reserve] -> Reserved --actual result--> ResultRecorded
               |                            ^
           unknown                          | actual original result
               v                            |
          Indeterminate --------------------+
  Reserved / ResultRecorded / Indeterminate --qualified expiry--> Expired
```

expiry三边是原Domain合同；受权repair新增ConfigQualificationPort.qualify_dedup_expiry及J05 Dedup分支，设计取得/触发闭合；外部批准retention/Policy资格未建立仍零调用，不用timer填造authority。

### 字段guard与构造

| 标签 | typed字段 / 唯一来源 |
|---|---|
| KM | Continuity.find_dedup/get_dedup完整9字段 + SafeTrace.find_result_for_key/get_result；六namespace_scope与QualifiedIdempotencyKey/BodyFreeOperationMeaningRef/original同scope/recipe/version；同key变义Conflict，不加trace/time/body hash |
| KR | actual已提交SafeOriginalResultRef与原result_id/key/meaning/op/kind/scope/store proof一致；actual current read只负责披露，不由Domain签发；local expected原row |
| KU | 原跨边界真实unknown，Reserved原op/effect保留、finite reason/local；ResultRecorded local A proof不能被重解释为业务known或覆写 |
| KE | ConfigQualificationPort.qualify_dedup_expiry(record,read,job,now,control)实际Qualified的RetentionExpiryBasisRef；当前Maintenance/批准retention/Policy/actor/scope、原row/key/meaning/op/result/window完整，原window已到期而proof有效，input expected=actual local；proof缺失零U，unknown保存责任不消除 |

`DedupRecord.reserve` @ 原C/E/J U七参固定Reserved/local1/result Missing；same-tx semantic/effect unique接管，key存在只actual winner。首A stored proof由actual commit后同key读取，即使Slot Missing也不Fresh；只KR实际存在后可attach_result。`match_meaning`任意state纯核，Expired仍拒绝再次执行。

### 转换矩阵

| From | To | 触发成员 / flow | 字段guard | 候选副作用 / 提交组 | 非法错误 |
|---|---|---|---|---|---|
| Reserved | ResultRecorded | `DedupRecord.attach_result` @ C/E/J已取得原actual结果的后续阶段 | KM/KR/local expected | result SlotEstablished/local next；U原subject+dedup | E0/E1/E2/E3 |
| Reserved | Indeterminate | `DedupRecord.mark_unknown` @ E01/E03/J01/J04 | KM/KU/local | 保原op/effect；U关联unknown | E0/E1/E2 |
| Indeterminate | ResultRecorded | `DedupRecord.attach_result` @ J02/E04原known finalize | KM/KR权威原结果/local | known关联，零第二效果 | E0/E1/E2/E3 |
| Reserved | Expired | `DedupRecord.expire` @ J05 Dedup分支 | KE/current/input expected | 仅state/local next，目标Present+独立Job dedup/seed/audit/正式条件规则同U；保tombstone | E0/E1/E2/E3 |
| ResultRecorded | Expired | `DedupRecord.expire` @ J05 Dedup分支 | KE/current/input expected | 同上，不改immutable result | E0/E1/E2/E3 |
| Indeterminate | Expired | `DedupRecord.expire` @ J05 Dedup分支 | KE/current/input expected且unknown不能丢 | 同上，原effect责任不因expiry清除 | E0/E1/E2/E3 |

### 非法与副作用

| 非法请求 | 精确处置 / audit |
|---|---|
| Expired复活/删除后同key重跑，ResultRecorded覆换payload或回Reserved/Indeterminate | E0/E3；零修改/audit/execute；业务unknown保在原record，不要求非法dedup边 |
| same key异meaning/op、Missing Slot当Fresh、body hash代注册recipe | E0/E1/E2/E4、PE::Conflict/NotEstablished；零new effect/hidden winner输出 |
| job.basis/TTL/clock/retention shape直接KE；J05缺expiry proof仍执行 | PE::NotEstablished/InvalidInput；保原state，不捏造expiry proof；原selector新增Dedup仅候选不是authority |

具体U：Continuity.stage_dedup首建Absent/更新Present与该C/E/J实际subject全CAS、原immutable seed/SafeAudit/正式条件handoff同tx；J05 expiry目标只Present，独立Job reservation/meaning/op不可覆盖目标key/meaning/op/result/window。seal按Step6 Plan明确维护关联核目标expire与完整两个CAS/unique集；commit未知只原Job mutation权威读，零再apply/业务IO。不是phase reserved；未建立KE仍零U。planned D逐6边及expiry三qualified场景/not-due/终态；C六namespace/两key分离/meaning/op/Expired不重跑；Lunique/KR actual proof/CAS/expiry unknown；R结果current隐藏且Query零维护；P无正文派生；J/S十一snapshot/九body族及无authority拒绝。均未执行。

### 单机停审

| 审查项 | 结论 | 依据 / 修正 |
|---|---|---|
| enum/状态/允许边/函数/guard/副作用/planned测试 | pass_design_static_after_authorized_repair | 4状态/6合同边匹配enum/02/原成员；KE取得port/J05 flow/target-vs-job CAS与来源消费重审见expiry repair；不关闭外部current资格或宣告运行可用 |

## M13 / StreamCursor

### 问题、诊断与取舍

归属U5 Domain `continuity/stream_cursor.rs`；enum=`StreamCursorState`。全字段/签名回指[Step6 StreamCursor](03_ddd_step_06_domain_contracts.md#streamcursor)，E01 Continuity/J03/J05/Q03；J01结果属于Delivery阶段，但当前无自动cursor写。Protocol/Owner/Delivery三stage各自namespace_stream/epoch，平台ts/sequence/update offset不能当通用可比较水位。采用正式comparator及已实际提交本阶段coverage，source coverage只关gap，不能推进stage。

### 状态集合

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| Ready | 当前comparator/原epoch可消费，不等已有可推进position | 否 | advance/mark_incomparable/lose_comparator/block |
| Incomparable | 缺比较资格或epoch变化，保旧position | 否 | block；同旧epoch完整资格requalify_same_epoch |
| Blocked | scope/source/window欠资格 | 否 | 同原epoch完整资格requalify_same_epoch；不越gap |

### ASCII转换图

```text
[initialize] -> Ready --After + committed stage coverage--> Ready
                 |  ^
       epoch/    |  | same-epoch requalification (no advance)
       comparator v |
              Incomparable --block--> Blocked
                 ^                       |
                 +-------- same epoch ---+--> Ready
```

新epoch只explicit initialize新tracker；mark_incomparable保旧epoch/position，绝不拼接新session历史。

### 字段guard与构造

| 标签 | typed字段 / 实际来源 |
|---|---|
| SA | Continuity.get_cursor/read_snapshot及完整关联gap/stage/预算，原9字段；ComparablePositionRef base等原position，同namespace_stream(stage/source/scope/installation)/epoch，PositionComparisonKind::After；AuthoritativeRecoveryPort.qualify_stage_coverage(cursor,snapshot,comparator,read,job,control)所得ContinuityCoverageRef五字段、全closed_gaps与range实际覆盖，ExpectedCursorRevision和ExpectedLocalRevision原读分别匹配 |
| SI | E01 qualified notice六字段中的Established StreamEpochChangeRef或J05 actual QualificationMaintenanceBasisRef；原source/epoch/current范围匹配，Missing next/change不造epoch事件 |
| SB | 原Maintenance读/current scope/source/window + actual维护basis、finite reason/local；没有正式basis零mutation |
| SQ | J03/J05原same epoch QualifiedStreamEpoch/AuthoritativeComparatorRef/ContinuityCoverageRef、双expected/actual now；来源/current/stage预算完整，不从gap-close候选取得coverage |

`StreamCursor.initialize` @ E01合法Protocol notice八参：真实epoch、position Uninitialized/coverage Missing、CursorRevision1/local1；comparator Established -> Ready，否则Incomparable；Continuity.stage_cursor Absent、cursor_expected=None。Ready初始Uninitialized不证明有任何业务完成。新epoch不把旧cursor.revision当新基线。

### 转换矩阵

| From | To | 触发成员 / flow | 字段guard | 候选副作用 / 提交组 | 非法错误 |
|---|---|---|---|---|---|
| Ready | Ready | `StreamCursor.advance` @ J03 C | SA After/actual完整stage coverage、双expected | position/coverage及cursor/local checked next；独立U cursor | E0/E1/E2/E3 |
| Ready | Incomparable | `StreamCursor.mark_incomparable` / `StreamCursor.lose_comparator` @ E01/J03/J05合法维护 | SI/source范围、local expected | comparator Stale/Missing、保旧position/epoch；必要gap同U | E0/E1/E2 |
| Ready | Blocked | `StreamCursor.block` @ J03/J05 | SB正式basis/local | local next，保旧position/coverage事实 | E0/E1/E2 |
| Incomparable | Blocked | `StreamCursor.block` @ J03/J05 | SB/local | 同上 | E0/E1/E2 |
| Incomparable | Ready | `StreamCursor.requalify_same_epoch` @ J03/J05 | SQ全部same epoch/双expected/now | 建立资格、双revision按原卡；不advance position | E0/E1/E2/E3 |
| Blocked | Ready | `StreamCursor.requalify_same_epoch` @ J03/J05 | SQ，不拼新epoch/丢unknown gap | 同上 | E0/E1/E2/E3 |

### 同态、非法与副作用

`advance` Equal纯no-op：不增任何revision、无U/audit；Before E0拒绝。After须SA全部已处理和闭gap依据，vector缺页/超budget/未覆盖不能以部分集合推进。Opaque position绝不整数排序；两轴CAS不能互代。requalify不代表advance。

| 非法请求 | 精确处置 / audit |
|---|---|
| cross-stage/source/epoch/base，Protocol ACK代Owner/Delivery coverage、source history空页代全覆盖 | E1/E2/E3或PE::NotEstablished/Unavailable；零写/新audit |
| E01 notice/J01 receipt自动advance、B未commit的gap-close候选代stage proof | E3；当前E01明确zero advance，J01无cursor stage，J03 C从B实际commit后新snapshot取得SA |
| comparator失效后仍比较、cancel/session resume/租约到期跳水位 | E2/E3；保旧position/unknown gap，current不靠Query修复 |

具体U：E01 initialize/mark_incomparable与具名gap合法候选同notice U；J03 A probe/B actual gap/recovery处置后再新committed读取得SA，C cursor双CAS独立U，C失败不能撤销B，C unknown只原mutation查询不重新advance；J05 SQ仅资格恢复零advance。Continuity.stage_cursor双轴+原key/seed/audit/正式条件handoff，gap不同subject expected各原读。Q03隐藏private position/token。planned D逐6边/Equal/Before；C三stage/cross-epoch/base/全coverage；L双CAS/A-B-C unknown；B来源mode/opaque positions；J预算/full页；R safe读取无写。

### 单机停审

| 审查项 | 结论 | 依据 / 修正 |
|---|---|---|
| enum/状态/边/函数/guard/副作用/planned测试 | pass_design_static | 3状态/6边匹配enum/02/原成员；六参stage coverage取得、SA独立C actual读、SI/SB/SQ/双轴/Equal/Before/U/测试已核；当前E01/J01零隐式advance，source完整性资格未解除，无reserved |

## M14 / GapRecord

### 问题、诊断与取舍

归属U5 Domain `continuity/gap_record.rs`；enum=`GapState`。全字段/签名回指[Step6 GapRecord](03_ddd_step_06_domain_contracts.md#gaprecord)，E01/C06/J03/Q03。disconnect/epoch变更的source消息不是完整覆盖；采用原gap/range/window/op责任，Unknown范围只有source明确原gap完整性证明才Closed，不以empty page/count/poll offset判断。Gap close与stage cursor advance分离。

### 状态集合

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| Open | 原缺口未全覆盖 | 否 | attach_recovery同态/begin_probe/require_manual |
| Probing | 原range受权只读查询接管 | 否 | close/retain_uncovered/require_manual |
| Closed | 原同epoch/range权威全覆盖已记 | 是 | 只读known覆盖；不再probe/close |
| Manual | 缺source/window/comparator，停自动处理 | 否 | attach_recovery同态；显式授权原range后begin_probe |

### ASCII转换图

```text
[detect] -> Open --qualified begin_probe--> Probing --complete coverage--> Closed
              ^                             |   |
              +-------- uncovered ----------+   | manual
              +-------- manual ----------------> Manual
                                               --explicit authorize--> Probing
```

只完整覆盖可终态；Closed不等Owner/Delivery阶段连续性。

### 字段guard与构造

| 标签 | typed字段 / 唯一来源 |
|---|---|
| GP | Continuity.get_gap/get_recovery/get_cursor及完整10字段/read_basis；原gap_ref/cursor_ref/operation_ref/range_ref(stream/epoch/bounds/basis)/reason/coverage_ref/recovery_ref/window_basis；J03 AuthoritativeRecovery.qualify核same gap/tracking op/window/budget/source/comparator，recovery_ref须Established实际已提交，Manual需actual显式新维护授权 |
| GC | AuthoritativeRecovery.probe_gap的actual AuthoritativeProbeResultRef.outcome()为ProbeOutcome::Coverage(AuthoritativeCoverageRef)，assert_covers同gap/range，comparator正式可比且完整contains；Unknown bounds要求source明确完整性证明；local expected原actual Probing |
| GU | actual权威probe仍有未覆盖子范围；原AuthoritativeProbeResultRef保持原range/epoch，不能把partial当GC；或source/window/comparator欠缺finite Manual原因 |
| GA | C06 qualify_request actual RecoveryAuthorizationRef与原subject/op一致；原gap Open/Manual、local expected、Missing或same recovery ref；新RecoveryRecord与attach_recovery同U |

`GapRecord.detect` @ E01合法Protocol notice八参固定Open/local1/coverage Missing；actual QualifiedGapRangeRef明确Known或Unknown，window/recovery可Missing但不授probe；same source/recipe/notice meaning齐才能Absent stage_gap。缺qualified range原basis/notice门禁零durable，只host保责任。

### 转换矩阵

| From | To | 触发成员 / flow | 字段guard | 候选副作用 / 提交组 | 非法错误 |
|---|---|---|---|---|---|
| Open | Probing | `GapRecord.begin_probe` @ J03 A | GP/recovery current/local | window/recovery原关联、local next；同U recovery Probing | E0/E1/E2/E3 |
| Probing | Closed | `GapRecord.close` @ J03 B | GC complete authoritative/local | coverage Established/local next；同U recovery Resolved | E0/E1/E2/E3 |
| Open | Manual | `GapRecord.require_manual` @ J03 | GU真实缺口/local | finite原因、原range保留；U gap/recovery各合法边 | E0/E1/E2 |
| Probing | Manual | `GapRecord.require_manual` @ J03 B | GU未知/不可判/local | 同上，不清除未覆盖责任 | E0/E1/E2 |
| Probing | Open | `GapRecord.retain_uncovered` @ J03 B | GU actual同range partial probe/local | 原range保留，局部覆盖不伪Closed | E0/E1/E2/E3 |
| Manual | Probing | `GapRecord.begin_probe` @ C06受权后J03 A | GP actual显式授权+原range/source/window齐 | 同U原recovery Probing，不换gap/op | E0/E1/E2/E3 |

### 同态、非法与副作用

`attach_recovery` @ C06仅Open/Manual同态四参GA：Missing -> Established原recovery；同ref零变化，异ref Conflict；不产生Probing/coverage。必须gap Present + 新recovery Absent同U，不能gap独立挂未提交ref。J03不mint RecoveryRecord。

| 非法请求 | 精确处置 / audit |
|---|---|
| Open/Manual直接Closed、Closed重新probe/close，跨gap/range/epoch或partial coverage | E0/E2/E3；零修改/audit/虚假完整性 |
| Unknown range靠count/empty page/超时关闭，缺window/source/comparator仍probe | PE::NotEstablished/Unavailable或E2/E3；保Open/Manual/原unknown，零raw replay |
| Probing/Closed attach_recovery、异ref替换、gap-close候选直接cursor advance | E0/E3/PE::Conflict；只C06原关联；B actual后独立C取stage coverage |

具体U：E01 gap与合法cursor notice候选同U；C06 gap/recovery原关联同U；J03 A双Probing actual提交后才readonly probe，B gap close/retain/manual及Recovery自身合法边、原dedup/seed/audit/正式条件handoff全CAS；B unknown只原mutation恢复，不能第二probe。Closed/Resolved重入零第二close/probe，但可按原J03受限C新actual stage coverage推进cursor；C失败不撤回B。planned D逐6边/GA同态；CUnknown/partial/cross-epoch/full stage区分；L A/B/C及双subject unique/CAS；B source完整性而非HTTP成功；J预算/窗口；R Q03不修gap/token不出。

### 单机停审

| 审查项 | 结论 | 依据 / 修正 |
|---|---|---|
| enum/状态/边/函数/guard/副作用/planned测试 | pass_design_static | 4状态/6边匹配enum/02/原成员；GA同U、GP/GC/GU/Unknown完整性、B actual/C独立stage及Closed重入/U/测试已核，无reserved；source/comparator实际资格未解除 |

## M15 / DispatchLane

### 问题、诊断与取舍

归属U5 Domain `continuity/dispatch_lane.rs`；enum=`DispatchLaneState`。全字段/签名回指[Step6 DispatchLane](03_ddd_step_06_domain_contracts.md#dispatchlane)，C04/E02/J01/J02/J05/Q03。局部顺序/依赖、本地claim、全适用rate向量及budget不能等同；释放local claim不证明请求未发，Unknown必须unresolved_head阻后续。采用qualified scope唯一lane及shared driver原子全scope协调，不用每intent私建lane或单进程mutex声称global保证。

### 状态集合

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| Ready | 候选可核资格，不等所有实际下界已经到 | 否 | claim/apply_bounds/block；claim前再核全部guard |
| Held | 原claim持有，可能已IO | 否 | release/apply_bounds/block；不可第二claim |
| Cooldown | 至少一适用下界未到或等待处置 | 否 | finish_cooldown全资格/block；预算不重置 |
| Blocked | 资格/依赖/window或unknown head阻塞 | 否 | restore_ready原scope与权威resolved head；不盲放行 |

### ASCII转换图

```text
[for_scope] -> Ready --claim--> Held --known release--> Ready
                 |               |
                 +--all bounds---+--> Cooldown --all reached--> Ready
                 +-----block-----+------block------> Blocked
                                                   --qualified original head--> Ready
```

Held.release(Unknown)去Blocked并保unresolved_head，不去Ready；图不能代替下表的两种Held->Blockedguard。

### 字段guard与构造

| 标签 | typed字段 / 唯一来源 |
|---|---|
| LC | Lane.get/read_snapshot完整10字段、head/active attempt/dependency及all pages，Lane.read_shared_bounds + Platform.qualify_rate_bounds全Global/Method/Resource/Bucket current向量；Presentation.qualify_dispatch的DispatchEligibilityRef、retry_budget/order_scope/dependency/method/window相符，所有bound取max且actual now满足，unresolved_head None/无旧未处置claim，lane/local expected原读分别匹配 |
| LF | Lane.reserve_claim actual same lane/intent/attempt FencedClaimRef、actor/source/expiry/fence，unique rate reservation同driver；claim_fence原Missing，依赖必须原known create/root定位，不靠Delivered口语 |
| LB | actual QualifiedRateLimitBoundSet与原same scope全部适用bounds合并不缩短；Held须同原claim LocalAttemptDispositionRef，Unknown保head；Ready不用伪release；local/lane双expected |
| LR | LocalAttemptDispositionRef.kind()为LocalAttemptDispositionKind::KnownFinal或NoIo的actual原attempt来源，same claim + 完整current依赖，无未决head才释放Ready；Unknown或dependency未立release去Blocked并保原head |
| LX | block的actual QualificationMaintenanceBasisRef/finite reason/window/current欠缺；finish_cooldown必须LC/全部max下界/now、无head/旧claim；restore_ready如有head需同attempt/effect AuthoritativeProbeResultRef known/no-effect且Application已先actual finalize，Unknown/Unavailable不清 |

`DispatchLane.for_scope` @ C04/E02九参fixedReady/LaneRevision1/local1、claim Missing/head None；actual LanePreparationQualification完整scope/dependency/bounds/budget/rate_basis；Lane.find_for_scope唯一existing先取，否则insert_for_scope固定两轴Absent同plan/intent/effect U。Ready factory不免claim前now/rate核验；J01只已提交lane，不隐式首建。

### 转换矩阵

| From | To | 触发成员 / flow | 字段guard | 候选副作用 / 提交组 | 非法错误 |
|---|---|---|---|---|---|
| Ready | Held | `DispatchLane.claim` @ J01 A | LC/LF + 双expected/now | claim/fence建立、lane/local next；同U intent/attempt | E0/E1/E2/E3 |
| Held | Ready | `DispatchLane.release` @ J01 C/J02 | LR known/noIO、原claim/无head、双expected | 仅clear本地claim/双revision；零no-effect推断 | E0/E1/E2/E3 |
| Held | Cooldown | `DispatchLane.apply_bounds` @ J01 C/J02 | LB + actual原release处置/双expected | 合并全bounds、clear claim按原卡；Unknown仍保head | E0/E1/E2/E3 |
| Ready | Cooldown | `DispatchLane.apply_bounds` @ J01 | LB全scope向量/双expected | rate_bounds合并不缩短、双revision；不重置budget | E0/E1/E2 |
| Ready | Blocked | `DispatchLane.block` @ J01/J05 | LX actual维护basis/双expected | 保原scope/window/head，双revision | E0/E1/E2 |
| Held | Blocked | `DispatchLane.block` / `DispatchLane.release` @ J01/J02/J05合法分支 | block=LX保claim；release=LR Unknown/依赖未立且实际处置 | block保旧claim/unknown；release只清local claim且保unresolved_head | E0/E1/E2/E3 |
| Cooldown | Blocked | `DispatchLane.block` @ J01/J05 | LX当前欠缺/双expected | 原bounds/budget/head保留 | E0/E1/E2 |
| Cooldown | Ready | `DispatchLane.finish_cooldown` @ J01/J05 | LC/LX全bounds到期、无head/未处置claim/双expected/now | 双revision；不清未知、不授权send | E0/E1/E2/E3 |
| Blocked | Ready | `DispatchLane.restore_ready` @ J02/J05 | LX + LC实际current，head若有先actual权威finalize | 原scope恢复、合格head处理/双revision；不产生retry权 | E0/E1/E2/E3 |

### 非法与副作用

| 非法请求 | 精确处置 / audit |
|---|---|
| Held/Cooldown/Blocked再claim、lease expired自动NoIo/Ready、unknown head跳过/替新target | E0/E2/E3；零第二attempt/IO，旧effect权威只读恢复 |
| 只resource bound不看global/bucket、配置缩短Retry-After，等待/新请求/lease重置budget | E2/E3/PE::NotEstablished；全部max下界与原窗口不变 |
| lane CAS1当首建Absent、部分scope/page当完整shared、单进程claim冒持久全局协调 | E0/E1/PE::Conflict/Unavailable/NotEstablished；零部分U |

具体U：首建insert_for_scope与plan/intent/effect全Absent；A Lane.reserve_claim+lane Held/intent Dispatching/attempt Claimed及原key/seed/audit同U；C/J02 actual disposition/全bounds与attempt/intent/receipt同全expected U，lane双轴stage，未知不释放head；J05不probe/finalize未知头，仅实际已finalized权威来源可LX。same-driver shared rate reservation不能被actor/SDK隐式retry绕过。四adapter全适用下界：Slack method/workspace/app/channel；Mattermost server/method/resource；Telegram bot/global/chat/resource/retry_after；Discord bucket/major resource/global/Retry-After，具体registry/provider未核定时fail-closed，不在此填数字。planned D逐9边/LR双分支；Cunknown head/依赖/不重置预算；L双CAS/unique共享reservation/commit未知；B四平台全部bounds/并发；J/W有界select，R无private rate token。

### 单机停审

| 审查项 | 结论 | 依据 / 修正 |
|---|---|---|
| enum/状态/边/函数/guard/副作用/planned测试 | pass_design_static | 4状态/9边匹配enum/02/原成员；LC/LF/LB/LR/LX与Held->Blocked两个actual分支、双Absent/双CAS/shared全bounds/预算不重置/U/测试已核，无reserved；driver/平台registry尚未建立不提升global guarantee |

## M16 / RecoveryRecord

### 问题、诊断与取舍

归属U5 Domain `continuity/recovery_record.rs`；enum=`RecoveryState`。全字段/签名回指[Step6 RecoveryRecord](03_ddd_step_06_domain_contracts.md#recoveryrecord)，C06/J02/J03/Q03。恢复请求授权不是权威结果/重发权；采用原五类subject及同op/effect/range只读probe、合法局部finalize。Resolved仅本次qualified结果落库，不等外部再次送达、所有gap闭合或readiness。

### 状态集合

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| Requested | 原subject/op显式恢复请求 | 否 | begin_probe/block/require_manual；零同步probe |
| Probing | 当前权威只读阶段接管 | 否 | resolve/block/require_manual；无create/send/approve |
| Resolved | 原qualified结果/完整coverage/有限retry资格已落 | 是 | 当前可见历史/原结果复用；零自动IO |
| Blocked | scope/basis失效 | 否 | 显式授权重新建立后begin_probe |
| Manual | 来源/窗口/结果不可判，保责任 | 否 | 显式原subject授权齐后begin_probe |

### ASCII转换图

```text
[request] -> Requested --qualified--> Probing --known/full coverage--> Resolved
                |  |                    |  |
              block manual           block manual
                v  v                    v  v
             Blocked                  Manual
                +------explicit authorize-------> Probing
```

“qualified”始终原subject/op；原local commit proof不变成owner/platform/consumer成功。

### 字段guard与构造

| 标签 | typed字段 / 唯一来源 |
|---|---|
| RQ | Continuity.get_recovery/find_recovery + 完整original subject snapshot，原10字段original_subject/operation_effect/authorization_basis/qualification_ref/probe_result/resolution_kind/safe_reason；AuthoritativeRecovery.qualify/assert_original same op/scope/source/window/budget，Manual/Blocked实际显式授权重新建立，local expected原行 |
| RK | actual AuthoritativeProbeResultRef同subject/original/authority；Owner/Action/Consumer必须正式已知非Pending/Indeterminate，Platform完整KnownPlatformBusinessResult及同次bounds/原receipt；FinalizeOnly只能known业务结果，关联subject必要actual合法finalize且完整U |
| RR | Intent限定：ProbeOutcome::NoEffect真实NoEffectBasisRef + tx外Presentation.qualify_retry取得完整RetryEligibilityRef五源；SameEffectRetryEligible只记资格，不能给Inbound/Callback/Handoff伪造Delivery presentation/window |
| RG | Gap限定：J03实际AuthoritativeCoverageRef完整原range/source/epoch，gap.close与本resolve同U，GapCovered；不是stage advance proof |
| RB | actual QualificationMaintenanceBasisRef + finite current失效reason/local；source/window/comparator/known缺失只Manual/保original；local-only commit probe不Resolved |

`RecoveryRecord.request` @ C06八参fixedRequested/local1、qualification/probe Missing、resolution Unresolved、formal RecoveryAuthorizationRef及原subject/op已存在；unique same subject/op，stage_recovery Absent。Gap请求与Gap.attach_recovery Present同U；其他subject只关联不新造业务对象。C06零probe/IO。

### 转换矩阵

| From | To | 触发成员 / flow | 字段guard | 候选副作用 / 提交组 | 非法错误 |
|---|---|---|---|---|---|
| Requested | Probing | `RecoveryRecord.begin_probe` @ J02/J03 A | RQ全current/local | qualification Established/local next；U recovery/Gap各合法边 | E0/E1/E2/E3 |
| Requested | Blocked | `RecoveryRecord.block` @ J02/J03 | RB实际失效basis/local | 保original、finite reason/local next | E0/E1/E2 |
| Probing | Blocked | `RecoveryRecord.block` @ J02/J03 B | RB/local | 不Resolved/不新effect | E0/E1/E2 |
| Probing | Resolved | `RecoveryRecord.resolve` @ J02/J03 B | RK FinalizeOnly 或 RR SameEffectRetryEligible 或 RG GapCovered；各typed参数exclusive、local | actual probe/result+resolution/local next；关联known-only U | E0/E1/E2/E3 |
| Requested | Manual | `RecoveryRecord.require_manual` @ J02/J03 | 来源/window欠缺/finite reason/local | resolution_kind Manual；保unknown | E0/E1/E2 |
| Probing | Manual | `RecoveryRecord.require_manual` @ J02/J03 B | actualUnknown/Unavailable/partial不可判/local | 同上，不能清head/gap | E0/E1/E2 |
| Manual | Probing | `RecoveryRecord.begin_probe` @ C06显式授权后J02/J03 A | RQ actual完整重新授权，同subject/op | qualification重建，原effect/range不换 | E0/E1/E2/E3 |
| Blocked | Probing | `RecoveryRecord.begin_probe` @ C06显式授权后J02/J03 A | RQ同上，不借旧失效current | 同上 | E0/E1/E2/E3 |

### 非法与副作用

| 非法请求 | 精确处置 / audit |
|---|---|
| Requested/Manual/Blocked直接Resolved、Resolved复活，Unresolved/Manual/Unknown/Unavailable当resolve参数 | E0/E2/E3；零修改/audit、保原op责任 |
| local commit Committed/NotFound提升RK，选latest mutation/扫描log找原op，Gap走J02 | PE::InvalidInput/NotEstablished/Unavailable；只unique exact unresolved阶段locator，Gap仅J03 |
| consumer/inbound NoEffect塞Delivery RetryEligibility、callback重新approve，sameeffectretry自动send | E1/E2/E3；RR只Intent，其他subject当前保Manual/known-only；不得制造混种ref |

具体U：J02/J03 A actual recovery Probing提交后只readonly；J02 Local先locate_local_unknown得到唯一原mutation再probe_local_commit，结果仅LocalCommitDisposition，缺/多locator不猜，无业务known来源则Manual。foreign known B完整原subject/attempt/intent/lane/receipt/合格mapping或callback/handoff及recovery全CAS；consumer A/B还须逐阶段正式NonRecursive规则覆盖全subjects，handoff=None。J03 B gap/recovery关联，C stage cursor独立。原stored A seed不覆写，original/effect不换，known结果优先不可discard；正式readonly不提供complete receipt/bounds只Unknown/Unavailable。planned D逐8边及三Resolved分支；Csource/subject/op/noeffect/late known；L全expected/local locator/commit未知；A维护actor与window；P probe secret短借/body-free结果；J有界预算；R不冒恢复report/evidence。

### 单机停审

| 审查项 | 结论 | 依据 / 修正 |
|---|---|---|
| enum/状态/边/函数/guard/副作用/planned测试 | pass_design_static_fail_closed | 5状态/8迁移与Step6 exact enum/member、C06/J02/J03回指一致；三类Resolved仅由各自typed权威结果成立。local-only probe、timeout、NotFound、ACK/lease、Unknown/Unavailable均不能越过Manual/Blocked；S10外部资格仍open。 |

### M16 停审补充：Resolved 三分支与 local probe 责任表

`RecoveryRecord.resolve` 的 `kind` 不是 caller 可选标签，而是由 `AuthoritativeProbeResultRef` 的实际 `ProbeOutcome`、原subject/op/effect、authority/window/current 和同一次 local UoW 共同决定。下表是完整正向出口；不满足任一列就不得调用 `resolve`。

| `SafeRecoveryResolutionKind` | 允许的 `ProbeOutcome` | 必须另外存在的 actual 事实 | 允许的后续语义 | 明确禁止 |
|---|---|---|---|---|
| `FinalizeOnly` | `Owner`、`Action`、`Platform` 或 `Consumer` 的同原subject/op已知结果 | 对应原attempt/intent/callback/inbound/handoff/mapping 的完整关联、必要 `LocalCommitDisposition`/immutable receipt、全部 CAS 与安全审计在同一 UoW；平台结果须带同次 bounds 或原 immutable receipt | 只把原记录的 known 结果落为局部历史；不创建新effect、不重交、不宣称 Turn/Delivery | `LocalCommitDisposition::Committed` 单独当 owner/platform/consumer 成功；`KnownPlatformBusinessResultKind` 缺 locator/authority/bounds；Pending/Indeterminate 当 known |
| `SameEffectRetryEligible` | 仅 `NoEffect(NoEffectBasisRef)` | 仅 `Intent` 原subject；tx 外由 `PresentationQualificationPort::qualify_retry` 取得完整 `RetryEligibilityRef`（no-effect、原预算、presentation、window、not-before 五源），原effect/current/CAS均一致 | 只记录同effect重试资格；后续若要 retry 仍须 `DeliveryIntent::schedule_retry(retry, actual_local, now)`，本机不发送 | `NoIoProofRef`、rollback、NotFound、timeout、lease expiry、取消、缺 current 或把资格塞给 Inbound/Callback/Handoff |
| `GapCovered` | 仅 `Coverage(AuthoritativeCoverageRef)` | 仅 J03；coverage 覆盖同 stream/epoch 的原 gap 全 range，`GapRecord.close` 与本次 `RecoveryRecord.resolve` 同 UoW、双 CAS 及正式 comparator/source basis 完整 | 只终结该 RecoveryRecord 并关闭该 gap；stage/cursor 仍须随后独立取得 committed stage coverage | partial/空页/Unknown range、Protocol/Owner/Delivery ACK、B 阶段未提交 candidate、把单 gap 当 whole-stream recovered |

`LocalCommitDisposition::{Committed,RolledBack,Indeterminate}` 是本地 driver 观察，不是 `ProbeOutcome` 的替代物：

- `Committed` 只能证明同一个 local mutation 已提交；它可作为 `FinalizeOnly` 所需关联的一项实际材料，但不能单独使 Recovery `Resolved`。
- `RolledBack` 只能证明该 local mutation 未提交；不能推出 foreign no-effect，保持原责任并转 `Manual` 或合法 `Blocked`。
- `Indeterminate` 保留原 mutation/op，停止新的 apply/retry/probe 组合；只能由正式同原subject/op 的只读 authority 继续，不能制造新的 `RecoveryRecord`。

因此 J02/J03 的顺序固定为：

```text
actual Recovery row + local expected
        |
        +-- exact unresolved mutation locator (若适用)
        |       +-- probe_local_commit -> LocalCommitDisposition
        |       |       \-- 仅 local 事实，不产生 Resolved
        |       |
        |       +-- formal AuthoritativeRecoveryPort probe_original/probe_gap
        |               -> AuthoritativeProbeResultRef
        |                       +-- known -> FinalizeOnly
        |                       +-- NoEffect + Intent retry qualification -> SameEffectRetryEligible
        |                       +-- full Coverage (J03) -> GapCovered
        |                       +-- Unknown/Unavailable/Pending -> Manual/Blocked
        |
        +-- actual resolve CAS + original associations + audit -> commit
```

J02 不输出 `GapCovered`；J03 不把 `GapCovered` 当 cursor advance。Query 只读既有行，不启动 probe、修 stale 或写 audit/dedup。该补充不关闭 `BR-UP-001/003/006/008/009`，也不把设计静态通过当作平台或运行证据。
