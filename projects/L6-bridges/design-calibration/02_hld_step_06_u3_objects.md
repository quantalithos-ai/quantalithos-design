# L6-bridges 02 Step6 U3：安全外显与交付对象附录

## 模块状态

done / pass；当前U3先骨架/思考后写入并停审；输入Step5 U3、01同名单元，规范4.6。完整Step门禁见主文件。

## 筛选与对象骨架

### SafePresentationPlan

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | U3 安全外显与交付 |
| 对象类型 | 局部安全外显规划实体 |
| 主要责任 | 记录获准projection选择与safe材料资格，不保存payload |
| 功能来源 | U3-C1；Step5同名候选 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| plan_ref | PresentationPlanRef | 本地plan identity |
| source_ref_version | CommittedSourceVersionRef | owner已提交source及精确版本 |
| binding_context | AuthorizedMappingContextRef | target/generation与受众 |
| projection_ref | AllowedProjectionRefSlot | blocked可缺；qualified/degraded必有owner/Governance获准材料/版本，仅safe ref |
| disclosure_basis | DisclosureQualificationRefSlot | blocked可缺；qualified/degraded必须有各存在性/提示/入口/action资格及expiry |
| attachment_grants | AttachmentGrantRefSetSlot | 明确none/获准集合/缺必要资格；qualified时必要/可省略依据必齐，非文件/公开URL |
| presentation_kind | QualifiedPresentationKind | full permitted内容或获准无动作降级，不含敏感审批正文 |
| capability_ref | CapabilitySnapshotRef | 逐安装方向/method/presentation支持 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| qualified | 当前完整外显资格 |
| degraded | owner明确获准无敏感/无动作的安全降级 |
| blocked | 任一必要依据缺失 |
| stale | 原材料/当前关系不再适用 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| assert_current(CurrentPresentationQualification qualification) | 派发前重核，不更换原source/projection |
| invalidate(PresentationInvalidationBasisRef basis) | 旧plan失效不改义 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| prepare(CommittedSourceVersionRef source, DisclosureQualificationRef basis, AuthorizedMappingContextRef target) | 生成ref-only plan，瞬时payload另由private seam |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 责任边界 | 不保存消息/审批/附件正文或私有URL；缺正式入口不造按钮；新projection需新plan。 |
| 材料与深度 | 安全ref需来源/版本/可见性/失效合同；不落raw body/secret/敏感材料；完整schema/签名/DDL到03 |


### DeliveryIntent

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | U3 安全外显与交付 |
| 对象类型 | 局部逻辑effect聚合 |
| 主要责任 | 固定一次外部逻辑操作含义，attempt不得变义 |
| 功能来源 | U3-C2~C3；Step5同名候选 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| intent_ref | DeliveryIntentRef | 本仓intent identity |
| effect_ref | DeliveryEffectRef | 稳定逻辑效果键，不被retry更换 |
| operation_ref | BridgeOperationRef | producer/management原operation |
| source_projection | StableSourceProjectionRef | 精确source/version/projection/version |
| target_context | ImmutableDeliveryTargetRef | installation/location/thread、binding generation |
| operation_kind | ExternalDeliveryKind | send/edit/delete/reply或明确unsupported |
| plan_ref | PresentationPlanRef | 原获准安全plan |
| lane_ref | DispatchLaneRef | 局部顺序/lane，非全局顺序 |
| retry_basis | RetryEligibilityRefSlot | 已知无效果+当前资格+窗口/预算，不由timeout推导 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| planned | effect已局部固化未外呼 |
| dispatching | 有当前claim并可能外呼 |
| retry_wait | 原effect已具受限重试资格与等待下界 |
| platform_accepted | 真实平台业务接受，不等送达/已读 |
| known_rejected | 确定终态业务拒绝 |
| indeterminate | 可能已有效果，无自动重发 |
| blocked | 当前资格或材料失效 |
| unsupported | 无明确能力或合法降级 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| claim(DispatchEligibilityRef qualification, FencedClaimRef claim) | 仅原effect与lane通过可派发 |
| apply_receipt(PlatformReceiptRef receipt) | 已知结果finalize并形成回链 |
| mark_unknown(AttemptRef attempt, SafeReasonCode reason) | 保同effect未知 |
| schedule_retry(NoEffectBasisRef basis, RetryBudgetRef budget) | 只具全部guard才进入等待 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_plan(PresentationPlanRef plan, StableEffectIdentity effect, ImmutableDeliveryTargetRef target) | 固定不可变语义，重复同键不造新effect |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 责任边界 | 不在同effect换target/payload/source版本；已知accepted只finalize，unknown不盲retry。 |
| 材料与深度 | 安全ref需来源/版本/可见性/失效合同；不落raw body/secret/敏感材料；完整schema/签名/DDL到03 |


### DeliveryAttempt

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | U3 安全外显与交付 |
| 对象类型 | 局部投递尝试实体 |
| 主要责任 | 追加一次可能外呼的claim/fence与有限结果 |
| 功能来源 | U3-C2~C3；Step5同名候选 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| attempt_ref | AttemptRef | 唯一尝试identity |
| intent_effect | DeliveryIntentEffectRef | 原intent/effect |
| claim_ref | FencedClaimRef | 本地claim/lease/fence，不保证取消已发请求 |
| qualification_ref | DispatchEligibilityRef | 调用时current basis/secret/capability/lane |
| attempt_window | AuthorizedAttemptWindowRef | 预算/等待下界与合法调用窗口 |
| result_ref | PlatformBusinessResultRefSlot | 安全已知结果或未知分类，无raw响应 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| claimed | 局部准备，尚未证明外呼 |
| in_flight | 可能已有请求离开private adapter |
| known_accepted | 存在权威业务结果 |
| known_rejected | 确定业务拒绝，retry仍需无效果basis |
| indeterminate | 请求可能生效，无已知结果 |
| not_dispatched | 可证明请求未发出；不由lease过期推定 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| begin_io(FencedClaimRef claim, DispatchEligibilityRef qualification) | 网络前重核；资格失效不进入IO |
| record_result(PlatformBusinessResultRef result) | 保持结果来源与有限reason |
| mark_unknown(SafeReasonCode reason) | 崩溃/timeout保未知 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| claim_for(DeliveryIntentRef intent, FencedClaimRef claim, DispatchEligibilityRef qualification) | 追加attempt，不更换effect |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 责任边界 | attempt不承载payload，不以HTTP status/lease失效判断delivered或无效果。 |
| 材料与深度 | 安全ref需来源/版本/可见性/失效合同；不落raw body/secret/敏感材料；完整schema/签名/DDL到03 |


### PlatformReceipt

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | U3 安全外显与交付 |
| 对象类型 | 不可变局部安全结果记录 |
| 主要责任 | 记录已知平台业务响应的来源和locator，不复制平台truth |
| 功能来源 | U3-C2~C3；Step5同名候选 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| receipt_ref | PlatformReceiptRef | 局部receipt identity |
| attempt_effect | AttemptEffectRef | 严格回原attempt/effect |
| result_kind | KnownPlatformBusinessResultKind | 业务accepted或known_rejected，不含统一delivered |
| external_locator | VerifiedExternalMessageLocatorSlot | 仅已知结果可解释的message定位 |
| authority_basis | PlatformResultAuthorityRef | 逐adapter/method来源及验证资格 |
| no_effect_basis | NoEffectBasisRefSlot | 仅真实已知无副作用依据允许retry |
| safe_reason | SafeReasonCode | 有限分类，不存raw error string/body |

#### 状态集合

| 状态 | 作用 |
|---|---|
| 不适用 | 不可变结果/历史或只读projection；不构造独立生命周期 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| matches_effect(DeliveryEffectRef effect) | 只检查来源关联，不查询/维护平台 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_known(AttemptEffectRef attempt, PlatformResultAuthorityRef authority, KnownPlatformBusinessResultKind kind) | 仅adapter确证known结果；unknown不用receipt |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 责任边界 | 不可变；不表示用户送达/已读，不从HTTP成功造accepted，不记录响应正文。 |
| 材料与深度 | 安全ref需来源/版本/可见性/失效合同；不落raw body/secret/敏感材料；完整schema/签名/DDL到03 |


## 模块停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| 候选处理 | pass | 4个对象独立成节；guard/ref/切片/port排除依据见主文件当前模块 |
| 功能/字段/行为闭环 | pass | 每卡回指capability；关键字段typed；参数TypeName parameter，无返回实现签名 |
| 状态与责任 | pass | lifecycle只属局部主语；immutable记录/projection标不适用；owner/platform truth只引用 |
| 反查 | pass | Step8使用当前对象；Step9按状态适用性筛选；新增对象必须回本Step |
| 缺口 | preserved | support carrier完整合同留03；BR-UP不关闭，未建立实现资格 |
