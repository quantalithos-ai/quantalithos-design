# L6-bridges 02 Step6 U5：连续性与恢复支撑对象附录

## 模块状态

done / pass；当前U5先骨架/思考后写入并停审；输入Step5 U5、01同名单元，规范4.6。完整Step门禁见主文件。

## 筛选与对象骨架

### DedupRecord

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | U5 连续性与恢复支撑 |
| 对象类型 | 局部连续性记录 |
| 主要责任 | 隔离namespace/scope的同义操作与原结果 |
| 功能来源 | U5-C1；Step5同名候选 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| dedup_ref | DedupRecordRef | 局部记录identity |
| namespace_scope | DedupNamespaceScope | management/inbound/outbound/callback/recovery/handoff及安装/内部获准scope |
| idempotency_key | QualifiedIdempotencyKey | 命令取CommandMetadata，不重复顶层key |
| semantic_identity | BodyFreeOperationMeaningRef | kind/target/source/projection/generation/版本的安全结构身份；不hash body |
| operation_effect | OriginalOperationEffectRef | 原operation/effect稳定关联 |
| result_ref | SafeOriginalResultRefSlot | 当前可读取资格才复用 |
| retention_window | QualifiedRetentionWindowRef | 保留/去重/replay资格来源，失效不重执行 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| reserved | 原operation在本地接管 |
| result_recorded | 有原已知局部/owner结果ref |
| indeterminate | 原effect未知 |
| expired | 窗口不再允许自动复用/重放；不是新执行许可 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| match_meaning(BodyFreeOperationMeaningRef meaning) | 同key变义conflict，不覆盖原行 |
| attach_result(SafeOriginalResultRef result) | 只关联真实原结果 |
| expire(RetentionExpiryBasisRef basis) | 保留受限disposition，禁止默认重执行 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| reserve(DedupNamespaceScope namespace, QualifiedIdempotencyKey key, BodyFreeOperationMeaningRef meaning) | 按namespace与scope唯一原子接管 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 责任边界 | 不用source timestamp/message ID作跨流key；不得把raw正文hash当安全幂等摘要。 |
| 材料与深度 | 安全ref需来源/版本/可见性/失效合同；不落raw body/secret/敏感材料；完整schema/签名/DDL到03 |


### StreamCursor

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | U5 连续性与恢复支撑 |
| 对象类型 | 局部可比位置对象 |
| 主要责任 | 分别追踪protocol/owner/delivery流，不宣称全局水位 |
| 功能来源 | U5-C2；Step5同名候选 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| cursor_ref | StreamCursorRef | 局部stream tracker |
| namespace_stream | CursorNamespaceStream | 安装/受权scope与protocol/owner/delivery种类 |
| epoch | QualifiedStreamEpoch | session或source epoch，跨epoch不可比较 |
| position | OpaqueStreamPositionSlot | 初始化未推进可缺；来源定义opaque位置，不由ID或timestamp代替 |
| comparator_ref | AuthoritativeComparatorRefSlot | incomparable/blocked可缺；ready/advance前必须明确source comparator/version资格 |
| coverage_ref | ContinuityCoverageRefSlot | 可推进范围与权威依据；缺口未覆盖不越过 |
| revision | CursorRevision | 并发CAS与position更新隔离 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| ready | 相同stream/epoch且比较资格有效 |
| incomparable | 无法按权威规则比较，保原位置和gap |
| blocked | scope/来源/窗口无资格 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| advance(ComparablePositionRef candidate, ContinuityCoverageRef coverage, ExpectedCursorRevision expected) | 只推进已覆盖可比位置 |
| mark_incomparable(StreamEpochChangeRef epoch) | 不拼接session历史 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| initialize(CursorNamespaceStream stream, QualifiedStreamEpoch epoch, AuthoritativeComparatorRefSlot comparator) | 只建立tracker；比较器缺失则incomparable，不声称已处理 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 责任边界 | ACK不能推进owner/delivery位置；event_id/Snowflake/ts不自动作cursor。 |
| 材料与深度 | 安全ref需来源/版本/可见性/失效合同；不落raw body/secret/敏感材料；完整schema/签名/DDL到03 |


### GapRecord

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | U5 连续性与恢复支撑 |
| 对象类型 | 局部缺口实体 |
| 主要责任 | 保留不连续/不可比范围直到权威coverage或manual disposition |
| 功能来源 | U5-C2 / C4；Step5同名候选 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| gap_ref | GapRef | 局部缺口identity |
| cursor_ref | StreamCursorRef | 明确所属stream/epoch |
| range_ref | QualifiedGapRangeRef | 安全位置边界；不可比时显式未知范围 |
| reason | SafeGapReason | 有限原因，不保存缺失raw消息 |
| coverage_ref | AuthoritativeCoverageRefSlot | 实际覆盖依据，非count/timeout |
| recovery_ref | RecoveryRecordRefSlot | 受权恢复计划与结果 |
| window_basis | RecoveryWindowRef | 查询/回放可行范围 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| open | 缺口可见，阻无依据推进 |
| probing | 受权获取同流coverage |
| closed | 权威coverage完整覆盖原缺口 |
| manual | 来源/窗口缺失，不自动闭合 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| begin_probe(RecoveryQualificationRef qualification) | 有scope/window/comparator才能对账 |
| close(AuthoritativeCoverageRef coverage) | 核range/epoch完整覆盖 |
| require_manual(SafeReasonCode reason) | 不伪造完整恢复 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| detect(StreamCursorRef cursor, QualifiedGapRangeRef range, SafeGapReason reason) | 局部缺口记录，不复制源消息 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 责任边界 | 不由队列空/count/重连成功关闭gap，不跨epoch续水位。 |
| 材料与深度 | 安全ref需来源/版本/可见性/失效合同；不落raw body/secret/敏感材料；完整schema/签名/DDL到03 |


### DispatchLane

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | U5 连续性与恢复支撑 |
| 对象类型 | 局部顺序/限流控制对象 |
| 主要责任 | 控制获准target lane与多级平台等待下界 |
| 功能来源 | U5-C3；Step5同名候选 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| lane_ref | DispatchLaneRef | 安装/目标/方法/major-resource作用域 |
| order_scope | QualifiedLaneOrderScope | 只保证被授权mapping内局部顺序 |
| head_dependency | DeliveryDependencyRefSlot | edit/delete/reply依赖已知create/thread locator |
| claim_fence | FencedClaimRefSlot | 单个本地派发资格 |
| rate_bounds | QualifiedRateLimitBoundSet | bucket/method/channel/global等待下界向量，动态来源 |
| retry_budget | RetryBudgetRef | 受权预算与窗口，值到04 |
| revision | LaneRevision | CAS，不以lease过期推无效果 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| ready | 当前lane可候选派发 |
| held | 已有本地claim，不保证平台未生效 |
| cooldown | 至少等待全部有效下界 |
| blocked | 依据/窗口/dependency不成立 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| claim(DeliveryIntentRef intent, DispatchEligibilityRef qualification, ExpectedLaneRevision expected) | 核局部顺序/预算/当前关系 |
| apply_bound(PlatformRateLimitBasisRef basis) | 聚合下界不缩短 |
| release(LocalAttemptDispositionRef disposition) | 仅释放本地claim，不判外部无效果 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| for_scope(QualifiedLaneOrderScope scope, RateLimitQualificationRef rate_basis) | 声明受限顺序，不造全局exactly-once |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 责任边界 | SDK不自行retry；queue/lease/fence不抹外部未知；配置不能缩短平台等待。 |
| 材料与深度 | 安全ref需来源/版本/可见性/失效合同；不落raw body/secret/敏感材料；完整schema/签名/DDL到03 |


### RecoveryRecord

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | U5 连续性与恢复支撑 |
| 对象类型 | 局部受权恢复记录 |
| 主要责任 | 记录原operation/effect的probe/coverage和finalize-only计划 |
| 功能来源 | U5-C4；Step5同名候选 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| recovery_ref | RecoveryRecordRef | 局部恢复identity |
| original_subject | OriginalRecoverableSubjectRef | inbound/callback/intent/gap/handoff中已存在对象 |
| operation_effect | OriginalOperationEffectRef | 不得生成新效果补未知 |
| qualification_ref | RecoveryQualificationRefSlot | requested/blocked可缺；probing前当前scope/basis、权威probe与窗口/预算必齐 |
| probe_result | AuthoritativeProbeResultRefSlot | actual结果或明确unavailable/unknown |
| resolution_kind | SafeRecoveryResolutionKind | finalize_only / same_effect_retry_eligible / gap_covered / manual |
| safe_reason | SafeReasonCode | 有限结果，不保存原raw响应 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| requested | 显式受权恢复请求 |
| probing | 同subject权威查询，网络外局部UoW |
| resolved | 局部对账结果已记录，不等新的平台送达 |
| blocked | 当前资格不满足 |
| manual | 缺源/不可判，停止自动操作 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| begin_probe(RecoveryQualificationRef qualification) | 不调用create/approve等业务mutation |
| resolve(AuthoritativeProbeResultRef result, SafeRecoveryResolutionKind kind) | 只对原subject finalize或发受限同effect资格 |
| require_manual(SafeReasonCode reason) | 保原unknown/gap |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| request(OriginalRecoverableSubjectRef subject, RecoveryAuthorizationRef basis, OriginalOperationEffectRef operation) | 维护入口，不由query创建 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 责任边界 | known成功不外呼，unknown无权威结果不重发；不修owner/平台truth。 |
| 材料与深度 | 安全ref需来源/版本/可见性/失效合同；不落raw body/secret/敏感材料；完整schema/签名/DDL到03 |


## 模块停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| 候选处理 | pass | 5个对象独立成节；guard/ref/切片/port排除依据见主文件当前模块 |
| 功能/字段/行为闭环 | pass | 每卡回指capability；关键字段typed；参数TypeName parameter，无返回实现签名 |
| 状态与责任 | pass | lifecycle只属局部主语；immutable记录/projection标不适用；owner/platform truth只引用 |
| 反查 | pass | Step8使用当前对象；Step9按状态适用性筛选；新增对象必须回本Step |
| 缺口 | preserved | support carrier完整合同留03；BR-UP不关闭，未建立实现资格 |
