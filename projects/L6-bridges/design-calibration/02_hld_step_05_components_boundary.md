# L6-bridges 02 Step 5：主要组成部分、职责与边界

## 1. Step 状态与内计划

done / pass；full-restart / single-agent-serial；回填正式§5。开工：三层门禁已核；通用规范与当前SOP/书写规范已读取；Step4；01六单元；SOP5/规范4.5已核对；前序思考/结构/自检pass。未来Step未创建。

| 计划项 | 状态 |
|---|---|
| 前序读取 | done |
| 问题/诊断/取舍 | done / 六部分串行 |
| 结构化/复杂度 | done / 六部分及跨审 |
| 草稿/自检 | done / pass |

## 2. 本步输入

Step4；01六单元；SOP5/规范4.5；前序校准文件的回答/诊断/取舍/待确认；项目/flow；通则/中间产物/真相源适用纪律。历史02/README后置扫描。

## 3. SOP 问题回答

总体回答：六部分沿01 U1~U6，不按平台/实现层切业务；每部分先审功能的输入、输出、副作用和来源，再确定代码主体与五维候选池。对象不因是port/API/DTO而成立；候选到Step6筛选，字段/函数此Step禁止。下列逐部分记录覆盖问题1~14，全部完成后回答问题15的跨审。

### U1 思考

配置资格、关系授权、三mapping定位必须分离；message mapping的建立依据只能是受权管理或已知owner/平台结果，不允许任意external ID认领内部事实。

回答/取舍：本部分功能由01同名单元与00对应FR承接，外部authority只引用。候选BridgeInstallation、ExternalBinding、ExternalIdentityMapping、ExternalLocationMapping、ExternalMessageMapping各有下面capability来源；BindingQualificationPort、MappingRepository、InstallationRepository留Step7，CurrentBindingGuard / MappingSourceGuard与AuthorizedBasisRef / ActorTargetRef / PlatformLocator拟仅字段/不变量，Step6明确理由。思考done；允许当前部分结构写入。

### U2 思考

必须先分平台来源、当前内部资格和owner交接三段。安全material无资格时拒绝/blocked，不能为可恢复性写正文。缺原mapping变化隔离，不冒充create。

回答/取舍：本部分功能由01同名单元与00对应FR承接，外部authority只引用。候选InboundHandoffRecord各有下面capability来源；PlatformIngressPort、ConversationHandoffPort、InboundRepository留Step7，IngressAuthorityGuard / SourceIsolationGuard与SafeSourceRef / BridgeTargetMode / ActorRef拟仅字段/不变量，Step6明确理由。思考done；允许当前部分结构写入。

### U3 思考

plan、effect、attempt和receipt是不同主语；Gate降级是获准的存在性/安全提示/入口能力选择，不是把审批正文截短。投递payload只私有瞬时重建，原plan失效不能在同effect换材料。

回答/取舍：本部分功能由01同名单元与00对应FR承接，外部authority只引用。候选SafePresentationPlan、DeliveryIntent、DeliveryAttempt、PlatformReceipt各有下面capability来源；PresentationQualificationPort、PlatformDeliveryPort、DeliveryRepository留Step7，PresentationGuard / DispatchEligibilityGuard与CommittedSourceRef / AllowedProjectionRef / AttachmentGrantRef拟仅字段/不变量，Step6明确理由。思考done；允许当前部分结构写入。

### U4 思考

签名只能验证来源；action binding必须把actor责任和target/owner revision绑牢。one-use在局部原子claim后不可复活；owner未知只按原operation查结果，不重新approve。

回答/取舍：本部分功能由01同名单元与00对应FR承接，外部authority只引用。候选ExternalActionBinding、CallbackHandoffRecord各有下面capability来源；CallbackVerificationPort、ActorResponsibilityPort、OwnerActionPort、CallbackRepository留Step7，CallbackResponsibilityGuard / OneUseGuard与OwnerActionRef / ActorResponsibilityRef / SourceIntentRef拟仅字段/不变量，Step6明确理由。思考done；允许当前部分结构写入。

### U5 思考

dedup、stream位置、gap、lane和recovery不能合一个offset表：authority与状态触发不同。恢复job只编排原记录的qualified probe/finalize，缺ref/window/coverage则保持人工出口。

回答/取舍：本部分功能由01同名单元与00对应FR承接，外部authority只引用。候选DedupRecord、StreamCursor、GapRecord、DispatchLane、RecoveryRecord各有下面capability来源；ContinuityRepository、AuthoritativeRecoveryPort、LaneRepository留Step7，SameMeaningGuard / ComparableCursorGuard / RetryEligibilityGuard与NamespaceRef / ComparatorRef / CoverageRef / NoEffectBasisRef拟仅字段/不变量，Step6明确理由。思考done；允许当前部分结构写入。

### U6 思考

局部mutation审计、实际handoff与safe read是不同对象；view没有生命周期，不重写producer事实。只在真实canonical事件存在时交接，平台错误raw string也必须转有限reason。

回答/取舍：本部分功能由01同名单元与00对应FR承接，外部authority只引用。候选SafeAuditRecord、SafeHandoffRecord、BridgeLocalView各有下面capability来源；SafeObservationPort、SafeReadQualificationPort、SafeTraceRepository留Step7，BodyFreeMaterialGuard / CurrentReadGuard与ProducerAdmissionRef / ConsumerResultRef / ReadBasisRef拟仅字段/不变量，Step6明确理由。思考done；允许当前部分结构写入。

## 4. 当前文档问题诊断

只沿Inbound/Outbound两个方向无法承载显式授权、one-use、gap与安全读取的独立owner。相反，每个shared ref都升对象会产生本仓伪truth。以功能驱动候选筛选，权威basis/material只做引用。

## 5. 改动前后对比

| 框架线索 | 当前细化 | 暂不展开 |
|---|---|---|
| 六Application主轴 | 每部分capability/主体/候选/接缝/非职责 | 对象字段、函数、完整协议 |
| 四adapter | 同port有限语义、差异资格保持可见 | 平台SDK/raw响应对象不升Domain |

## 6. 设计取舍

沿六U串行停审，唯一局部对象owner；guard与safe ref先列候选并注明筛选，不用总表压缩单部分。平台seam按01§11与00来源资格复核，SDK/OAuth/API Key/KMS/router仍not_selected。复杂度按六小节分批，交互仅一总图，局部不补图因接缝可由表清楚表达。

## 7. 结构化中间产物

### U1 受权绑定与映射

#### 本部分职责

受权绑定与映射只拥有下表局部功能的状态与关系，不扩大01所有权。

#### 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| U1-C1 安装配置接纳 | 受权config、能力与opaque secret引用 | 配置revision与局部资格 | 仅本地配置，不激活平台或内部权限 | §6 BridgeInstallation；§7管理入口；§8配置流 |
| U1-C2 显式关系管理 | namespace、typed target、方向/action、正式basis | active/suspended/revoked relation与generation | 改变本仓relation，不创建owner实体 | §6 ExternalBinding；§7/8管理；§9 relation |
| U1-C3 三类映射 | actor/location/source的正式定位和当前relation | identity/location/message受权mapping | 拒绝裸ID/别名串绑；已知owner/平台结果回链 | §6三mapping；§7/8映射；§9映射 |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| BindingApplication | Application编排主体 | 承接本部分capability；不拥有owner truth | §7入口所属服务；§8对应处理流；完整类/函数留03 |
| MappingApplication | Application编排主体 | 承接本部分capability；不拥有owner truth | §7入口所属服务；§8对应处理流；完整类/函数留03 |
| BridgeInstallation | 候选局部对象 | 承载capability局部状态/关系或安全引用 | Step6独立筛选；§6同名对象；状态适用者§9 |
| ExternalBinding | 候选局部对象 | 承载capability局部状态/关系或安全引用 | Step6独立筛选；§6同名对象；状态适用者§9 |
| ExternalIdentityMapping | 候选局部对象 | 承载capability局部状态/关系或安全引用 | Step6独立筛选；§6同名对象；状态适用者§9 |
| ExternalLocationMapping | 候选局部对象 | 承载capability局部状态/关系或安全引用 | Step6独立筛选；§6同名对象；状态适用者§9 |
| ExternalMessageMapping | 候选局部对象 | 承载capability局部状态/关系或安全引用 | Step6独立筛选；§6同名对象；状态适用者§9 |
| BindingQualificationPort | 抽象边界 | 受权读取/写入或owner/adapter交接 | §7本地port需求；方法完全绑定留03 |
| MappingRepository | 抽象边界 | 受权读取/写入或owner/adapter交接 | §7本地port需求；方法完全绑定留03 |
| InstallationRepository | 抽象边界 | 受权读取/写入或owner/adapter交接 | §7本地port需求；方法完全绑定留03 |

#### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | BridgeInstallation、ExternalBinding、ExternalIdentityMapping、ExternalLocationMapping、ExternalMessageMapping | 各自独立成节；projection/immutable记录另作状态适用性判断 |
| Policy / Invariant | CurrentBindingGuard / MappingSourceGuard | 判断仅为上述对象guard或需要独立对象，不能伪造owner policy |
| Projection / Read model | BindingSafeView字段类型 | 若仅BridgeLocalView的切片字段，明确不独立的理由 |
| Reference / Boundary | AuthorizedBasisRef / ActorTargetRef / PlatformLocator | typed字段引用，来源/authority/失效闭口留03；port留Step7 |
| Audit / History | 变更安全材料交U6 | 唯一SafeAuditRecord owner=U6，原result/attempt等不重复建history |

#### 本部分不承担什么

不注册外部账号，不创建GlobalMember/Conversation/Workspace，不把OAuth或管理员身份当内部授权。

#### 与其他部分的接缝

供U2~U4当前关系与generation；U5提供管理去重，U6记录安全变更。owner负责资格，secret provider负责私有解析。

#### 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能与候选来源 | pass | 每候选可回capability；正式定义/筛选由Step6完成 |
| 接缝与唯一owner | pass | shared guard/ref不迁移truth；audit唯一U6 |
| 禁止事项及层级 | pass | 无字段/函数/完整协议，无平台/owner成功声明 |
| 上游缺口 | preserved | BR-UP原状态不关闭；正向资格不成立则blocked |


### U2 入站交接

#### 本部分职责

入站交接只拥有下表局部功能的状态与关系，不扩大01所有权。

#### 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| U2-C1 来源验证与协议应答 | 平台私有原始输入与入口资格 | 瞬时verified转换、独立protocol ACK | 不得持久化raw inbox；无安全接管不承诺回放 | §6 InboundHandoffRecord；§7入站consumer；§8入站 |
| U2-C2 owner交接 | current mapping、source marker、target mode、actor、qualified material/digest | owner accepted/rejected/pending/unknown result ref | 只交Conversation；trusted例外不绕active/scope/visibility | §7 ConversationHandoffPort；§8交接；§9记录 |
| U2-C3 变化与回环隔离 | edit/delete/thread、原source/version/mapping、已知self-send关系 | accepted change、unsupported、quarantine或gap | 不将delete变物理内部删除；不信自报marker | §6记录与U1消息mapping；§8变化分支 |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| InboundApplication | Application编排主体 | 承接本部分capability；不拥有owner truth | §7入口所属服务；§8对应处理流；完整类/函数留03 |
| InboundHandoffRecord | 候选局部对象 | 承载capability局部状态/关系或安全引用 | Step6独立筛选；§6同名对象；状态适用者§9 |
| PlatformIngressPort | 抽象边界 | 受权读取/写入或owner/adapter交接 | §7本地port需求；方法完全绑定留03 |
| ConversationHandoffPort | 抽象边界 | 受权读取/写入或owner/adapter交接 | §7本地port需求；方法完全绑定留03 |
| InboundRepository | 抽象边界 | 受权读取/写入或owner/adapter交接 | §7本地port需求；方法完全绑定留03 |

#### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | InboundHandoffRecord | 各自独立成节；projection/immutable记录另作状态适用性判断 |
| Policy / Invariant | IngressAuthorityGuard / SourceIsolationGuard | 判断仅为上述对象guard或需要独立对象，不能伪造owner policy |
| Projection / Read model | InboundStageView字段类型 | 若仅BridgeLocalView的切片字段，明确不独立的理由 |
| Reference / Boundary | SafeSourceRef / BridgeTargetMode / ActorRef | typed字段引用，来源/authority/失效闭口留03；port留Step7 |
| Audit / History | verified/disposition安全记录交U6 | 唯一SafeAuditRecord owner=U6，原result/attempt等不重复建history |

#### 本部分不承担什么

不创建Turn、不缓存消息/附件正文、不由显示名识别回环、不声称ACK已提交。

#### 与其他部分的接缝

读U1映射；用U5去重/位置/gap；由Conversation确认实际接纳，U6只追溯局部阶段。

#### 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能与候选来源 | pass | 每候选可回capability；正式定义/筛选由Step6完成 |
| 接缝与唯一owner | pass | shared guard/ref不迁移truth；audit唯一U6 |
| 禁止事项及层级 | pass | 无字段/函数/完整协议，无平台/owner成功声明 |
| 上游缺口 | preserved | BR-UP原状态不关闭；正向资格不成立则blocked |


### U3 安全外显与交付

#### 本部分职责

安全外显与交付只拥有下表局部功能的状态与关系，不扩大01所有权。

#### 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| U3-C1 安全外显规划 | 已提交source/version、当前scope/basis、Gate和附件资格 | 获准projection plan或blocked | 敏感审批正文不进入plan/payload；提示/链接/action各需basis | §6 SafePresentationPlan；§7/8prepare；§9plan |
| U3-C2 effect固化与派发 | 获准plan、immutable target、operation kind和effect | intent、追加attempt及已知receipt | 外呼前重核generation/资格/secret/lane；UoW不包网络 | §6 intent/attempt/receipt；§7/8派发；§9 |
| U3-C3 变化与失败结果 | 原message/thread关系、逐安装能力、平台权威业务结果 | accepted/rejected/retry_wait/indeterminate/unsupported | 不默换目标；HTTP成功不是delivered/read；未知不盲重试 | §7adapter；§8变化/恢复；§9delivery |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| PresentationApplication | Application编排主体 | 承接本部分capability；不拥有owner truth | §7入口所属服务；§8对应处理流；完整类/函数留03 |
| DeliveryApplication | Application编排主体 | 承接本部分capability；不拥有owner truth | §7入口所属服务；§8对应处理流；完整类/函数留03 |
| SafePresentationPlan | 候选局部对象 | 承载capability局部状态/关系或安全引用 | Step6独立筛选；§6同名对象；状态适用者§9 |
| DeliveryIntent | 候选局部对象 | 承载capability局部状态/关系或安全引用 | Step6独立筛选；§6同名对象；状态适用者§9 |
| DeliveryAttempt | 候选局部对象 | 承载capability局部状态/关系或安全引用 | Step6独立筛选；§6同名对象；状态适用者§9 |
| PlatformReceipt | 候选局部对象 | 承载capability局部状态/关系或安全引用 | Step6独立筛选；§6同名对象；状态适用者§9 |
| PresentationQualificationPort | 抽象边界 | 受权读取/写入或owner/adapter交接 | §7本地port需求；方法完全绑定留03 |
| PlatformDeliveryPort | 抽象边界 | 受权读取/写入或owner/adapter交接 | §7本地port需求；方法完全绑定留03 |
| DeliveryRepository | 抽象边界 | 受权读取/写入或owner/adapter交接 | §7本地port需求；方法完全绑定留03 |

#### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | SafePresentationPlan、DeliveryIntent、DeliveryAttempt、PlatformReceipt | 各自独立成节；projection/immutable记录另作状态适用性判断 |
| Policy / Invariant | PresentationGuard / DispatchEligibilityGuard | 判断仅为上述对象guard或需要独立对象，不能伪造owner policy |
| Projection / Read model | DeliveryStageView字段类型 | 若仅BridgeLocalView的切片字段，明确不独立的理由 |
| Reference / Boundary | CommittedSourceRef / AllowedProjectionRef / AttachmentGrantRef | typed字段引用，来源/authority/失效闭口留03；port留Step7 |
| Audit / History | effect/attempt/receipt安全材料交U6 | 唯一SafeAuditRecord owner=U6，原result/attempt等不重复建history |

#### 本部分不承担什么

不拥有外部消息truth、Decision或Artifact；不保存payload、附件和私有URL；不以source提交证明送达。

#### 与其他部分的接缝

U1提供target/generation，Governance/Artifact/可选Workspace提供资格；U5提供lane/预算/恢复，U4仅消费有资格action来源，U6接受安全阶段。

#### 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能与候选来源 | pass | 每候选可回capability；正式定义/筛选由Step6完成 |
| 接缝与唯一owner | pass | shared guard/ref不迁移truth；audit唯一U6 |
| 禁止事项及层级 | pass | 无字段/函数/完整协议，无平台/owner成功声明 |
| 上游缺口 | preserved | BR-UP原状态不关闭；正向资格不成立则blocked |


### U4 交互责任交接

#### 本部分职责

交互责任交接只拥有下表局部功能的状态与关系，不扩大01所有权。

#### 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| U4-C1 绑定受权action | 安全展示来源、installation、actor责任、target/action及expiry | 局部action binding | 无正式action入口则只提示或blocked，不造按钮/URL | §6 ExternalActionBinding；§7/8绑定；§9 |
| U4-C2 callback验证与交接 | 平台认证、瞬时私有context、current binding、one-use和owner状态 | verified/rejected/blocked及owner operation ref | ACK/defer独立，owner二次核验；一次消费与交接恢复分离 | §6 CallbackHandoffRecord；§7/8callback；§9 |
| U4-C3 重复与未知对账 | 原operation/result ref、当前读取资格与窗口 | 原结果安全回显或indeterminate/manual | 跨target/actor、过期、重放拒绝；未知不生成新审批 | §7/8callback recovery；§9 |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| CallbackApplication | Application编排主体 | 承接本部分capability；不拥有owner truth | §7入口所属服务；§8对应处理流；完整类/函数留03 |
| ExternalActionBinding | 候选局部对象 | 承载capability局部状态/关系或安全引用 | Step6独立筛选；§6同名对象；状态适用者§9 |
| CallbackHandoffRecord | 候选局部对象 | 承载capability局部状态/关系或安全引用 | Step6独立筛选；§6同名对象；状态适用者§9 |
| CallbackVerificationPort | 抽象边界 | 受权读取/写入或owner/adapter交接 | §7本地port需求；方法完全绑定留03 |
| ActorResponsibilityPort | 抽象边界 | 受权读取/写入或owner/adapter交接 | §7本地port需求；方法完全绑定留03 |
| OwnerActionPort | 抽象边界 | 受权读取/写入或owner/adapter交接 | §7本地port需求；方法完全绑定留03 |
| CallbackRepository | 抽象边界 | 受权读取/写入或owner/adapter交接 | §7本地port需求；方法完全绑定留03 |

#### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | ExternalActionBinding、CallbackHandoffRecord | 各自独立成节；projection/immutable记录另作状态适用性判断 |
| Policy / Invariant | CallbackResponsibilityGuard / OneUseGuard | 判断仅为上述对象guard或需要独立对象，不能伪造owner policy |
| Projection / Read model | CallbackStageView字段类型 | 若仅BridgeLocalView的切片字段，明确不独立的理由 |
| Reference / Boundary | OwnerActionRef / ActorResponsibilityRef / SourceIntentRef | typed字段引用，来源/authority/失效闭口留03；port留Step7 |
| Audit / History | 验证reason/owner result交U6 | 唯一SafeAuditRecord owner=U6，原result/attempt等不重复建history |

#### 本部分不承担什么

不批准Gate/Decision，不执行Tools/Runtime，不记录token/context/response URL/敏感审批。

#### 与其他部分的接缝

U1定位actor/target，U3提供已获准展示与action来源；Governance/其他owner执行业务动作；U5one-use/重放保护，U6安全追溯。

#### 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能与候选来源 | pass | 每候选可回capability；正式定义/筛选由Step6完成 |
| 接缝与唯一owner | pass | shared guard/ref不迁移truth；audit唯一U6 |
| 禁止事项及层级 | pass | 无字段/函数/完整协议，无平台/owner成功声明 |
| 上游缺口 | preserved | BR-UP原状态不关闭；正向资格不成立则blocked |


### U5 连续性与恢复支撑

#### 本部分职责

连续性与恢复支撑只拥有下表局部功能的状态与关系，不扩大01所有权。

#### 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| U5-C1 scope幂等 | management/inbound/outbound/callback/handoff等namespace与稳定语义key | original result / conflict / expired disposition | 变义不复用；不存raw body或其hash；窗口失效限制自动执行 | §6 DedupRecord；§7/8所有mutation；§9 |
| U5-C2 位置与gap | stream/epoch/position、正式comparator/coverage | 可比推进或gap/不可比 | protocol/owner/delivery位置分开；不从时间/ID猜水位 | §6 StreamCursor/GapRecord；§7/8cursor；§9 |
| U5-C3 lane与受限重试 | 目标顺序、bucket/major-resource/global等待下界、无效果证明与预算 | claim/fence、retry_wait或manual/blocked | lease失效不证明无效果；SDK内部默认retry禁止 | §6 DispatchLane；§7/8派发/恢复；§9 |
| U5-C4 权威对账 | 原operation/effect及当前basis、probe/coverage资格 | finalize-only、明确同effect可重试或manual/gap | 不得换effect、修owner truth或已知成功再外呼 | §6 RecoveryRecord；§7/8jobs；§9 |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| ContinuityApplication | Application编排主体 | 承接本部分capability；不拥有owner truth | §7入口所属服务；§8对应处理流；完整类/函数留03 |
| RecoveryJob | Application编排主体 | 承接本部分capability；不拥有owner truth | §7入口所属服务；§8对应处理流；完整类/函数留03 |
| DedupRecord | 候选局部对象 | 承载capability局部状态/关系或安全引用 | Step6独立筛选；§6同名对象；状态适用者§9 |
| StreamCursor | 候选局部对象 | 承载capability局部状态/关系或安全引用 | Step6独立筛选；§6同名对象；状态适用者§9 |
| GapRecord | 候选局部对象 | 承载capability局部状态/关系或安全引用 | Step6独立筛选；§6同名对象；状态适用者§9 |
| DispatchLane | 候选局部对象 | 承载capability局部状态/关系或安全引用 | Step6独立筛选；§6同名对象；状态适用者§9 |
| RecoveryRecord | 候选局部对象 | 承载capability局部状态/关系或安全引用 | Step6独立筛选；§6同名对象；状态适用者§9 |
| ContinuityRepository | 抽象边界 | 受权读取/写入或owner/adapter交接 | §7本地port需求；方法完全绑定留03 |
| AuthoritativeRecoveryPort | 抽象边界 | 受权读取/写入或owner/adapter交接 | §7本地port需求；方法完全绑定留03 |
| LaneRepository | 抽象边界 | 受权读取/写入或owner/adapter交接 | §7本地port需求；方法完全绑定留03 |

#### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | DedupRecord、StreamCursor、GapRecord、DispatchLane、RecoveryRecord | 各自独立成节；projection/immutable记录另作状态适用性判断 |
| Policy / Invariant | SameMeaningGuard / ComparableCursorGuard / RetryEligibilityGuard | 判断仅为上述对象guard或需要独立对象，不能伪造owner policy |
| Projection / Read model | ContinuityView字段类型 | 若仅BridgeLocalView的切片字段，明确不独立的理由 |
| Reference / Boundary | NamespaceRef / ComparatorRef / CoverageRef / NoEffectBasisRef | typed字段引用，来源/authority/失效闭口留03；port留Step7 |
| Audit / History | 恢复/位置摘要交U6 | 唯一SafeAuditRecord owner=U6，原result/attempt等不重复建history |

#### 本部分不承担什么

不承诺exactly-once或全局顺序，不做无界自动重试，不持久化raw replay事件。

#### 与其他部分的接缝

为U1~U4提供局部连续性，不替它们做业务授权；权威结果来自对应owner/adapter，恢复交接材料交U6。

#### 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能与候选来源 | pass | 每候选可回capability；正式定义/筛选由Step6完成 |
| 接缝与唯一owner | pass | shared guard/ref不迁移truth；audit唯一U6 |
| 禁止事项及层级 | pass | 无字段/函数/完整协议，无平台/owner成功声明 |
| 上游缺口 | preserved | BR-UP原状态不关闭；正向资格不成立则blocked |


### U6 安全读取与追溯支撑

#### 本部分职责

安全读取与追溯支撑只拥有下表局部功能的状态与关系，不扩大01所有权。

#### 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| U6-C1 mutation安全追溯 | U1~U5既有受权mutation、原operation及有限阶段reason | body-free局部audit记录 | 同局部UoW只写安全事实，不宣称evidence | §6 SafeAuditRecord；§8各mutation |
| U6-C2 consumer材料交接 | 具有canonical schema的安全producer材料和准入basis | handoff intent / consumer disposition ref | 拒绝不造accepted；unknown单列，无payload合同不造outbox | §6 SafeHandoffRecord；§7event/job；§8/9 |
| U6-C3 安全查询 | 既有局部view、当前subject/scope/visibility | qualified/degraded/denied/unavailable view | 无写audit/repair/replay/刷新；隐藏count/ref，不以空值冒充拒绝 | §6 BridgeLocalView；§7query；§8 |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| SafeReadApplication | Application编排主体 | 承接本部分capability；不拥有owner truth | §7入口所属服务；§8对应处理流；完整类/函数留03 |
| SafeHandoffApplication | Application编排主体 | 承接本部分capability；不拥有owner truth | §7入口所属服务；§8对应处理流；完整类/函数留03 |
| SafeAuditRecord | 候选局部对象 | 承载capability局部状态/关系或安全引用 | Step6独立筛选；§6同名对象；状态适用者§9 |
| SafeHandoffRecord | 候选局部对象 | 承载capability局部状态/关系或安全引用 | Step6独立筛选；§6同名对象；状态适用者§9 |
| BridgeLocalView | 候选局部对象 | 承载capability局部状态/关系或安全引用 | Step6独立筛选；§6同名对象；状态适用者§9 |
| SafeObservationPort | 抽象边界 | 受权读取/写入或owner/adapter交接 | §7本地port需求；方法完全绑定留03 |
| SafeReadQualificationPort | 抽象边界 | 受权读取/写入或owner/adapter交接 | §7本地port需求；方法完全绑定留03 |
| SafeTraceRepository | 抽象边界 | 受权读取/写入或owner/adapter交接 | §7本地port需求；方法完全绑定留03 |

#### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | SafeAuditRecord、SafeHandoffRecord、BridgeLocalView | 各自独立成节；projection/immutable记录另作状态适用性判断 |
| Policy / Invariant | BodyFreeMaterialGuard / CurrentReadGuard | 判断仅为上述对象guard或需要独立对象，不能伪造owner policy |
| Projection / Read model | BridgeLocalView独立projection | 独立成节 |
| Reference / Boundary | ProducerAdmissionRef / ConsumerResultRef / ReadBasisRef | typed字段引用，来源/authority/失效闭口留03；port留Step7 |
| Audit / History | SafeAuditRecord本地历史；不升级为evidence | 唯一SafeAuditRecord owner=U6，原result/attempt等不重复建history |

#### 本部分不承担什么

不生成报告、EV、verdict、signoff，不收raw消息/secret/敏感审批，不让query隐式写审计。

#### 与其他部分的接缝

只消费U1~U5的安全阶段；Observability决定准入/consumer结果/evidence，正式读取owner负责资格；不向Chat借未停审设计。

#### 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能与候选来源 | pass | 每候选可回capability；正式定义/筛选由Step6完成 |
| 接缝与唯一owner | pass | shared guard/ref不迁移truth；audit唯一U6 |
| 禁止事项及层级 | pass | 无字段/函数/完整协议，无平台/owner成功声明 |
| 上游缺口 | preserved | BR-UP原状态不关闭；正向资格不成立则blocked |


### 跨组成部分闭环审计

#### 组成部分总表

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| U1 受权绑定与映射 | 安装配置接纳；显式关系管理；三类映射 | BindingApplication、MappingApplication、BridgeInstallation、ExternalBinding、ExternalIdentityMapping、ExternalLocationMapping、ExternalMessageMapping | 不注册外部账号，不创建GlobalMember/Conversation/Workspace，不把OAuth或管理员身份当内部授权。 |
| U2 入站交接 | 来源验证与协议应答；owner交接；变化与回环隔离 | InboundApplication、InboundHandoffRecord | 不创建Turn、不缓存消息/附件正文、不由显示名识别回环、不声称ACK已提交。 |
| U3 安全外显与交付 | 安全外显规划；effect固化与派发；变化与失败结果 | PresentationApplication、DeliveryApplication、SafePresentationPlan、DeliveryIntent、DeliveryAttempt、PlatformReceipt | 不拥有外部消息truth、Decision或Artifact；不保存payload、附件和私有URL；不以source提交证明送达。 |
| U4 交互责任交接 | 绑定受权action；callback验证与交接；重复与未知对账 | CallbackApplication、ExternalActionBinding、CallbackHandoffRecord | 不批准Gate/Decision，不执行Tools/Runtime，不记录token/context/response URL/敏感审批。 |
| U5 连续性与恢复支撑 | scope幂等；位置与gap；lane与受限重试；权威对账 | ContinuityApplication、RecoveryJob、DedupRecord、StreamCursor、GapRecord、DispatchLane、RecoveryRecord | 不承诺exactly-once或全局顺序，不做无界自动重试，不持久化raw replay事件。 |
| U6 安全读取与追溯支撑 | mutation安全追溯；consumer材料交接；安全查询 | SafeReadApplication、SafeHandoffApplication、SafeAuditRecord、SafeHandoffRecord、BridgeLocalView | 不生成报告、EV、verdict、signoff，不收raw消息/secret/敏感审批，不让query隐式写审计。 |

#### 对象发现维度表

| 组成部分 | Truth / State | Policy / Invariant | Projection / Read model | Reference / Boundary | Audit / History | Step 6 必须独立展开 |
|---|---|---|---|---|---|---|
| U1 | BridgeInstallation、ExternalBinding、ExternalIdentityMapping、ExternalLocationMapping、ExternalMessageMapping | CurrentBindingGuard / MappingSourceGuard | BindingSafeView字段类型 | AuthorizedBasisRef / ActorTargetRef / PlatformLocator | 变更安全材料交U6 | BridgeInstallation、ExternalBinding、ExternalIdentityMapping、ExternalLocationMapping、ExternalMessageMapping（逐个筛选） |
| U2 | InboundHandoffRecord | IngressAuthorityGuard / SourceIsolationGuard | InboundStageView字段类型 | SafeSourceRef / BridgeTargetMode / ActorRef | verified/disposition安全记录交U6 | InboundHandoffRecord（逐个筛选） |
| U3 | SafePresentationPlan、DeliveryIntent、DeliveryAttempt、PlatformReceipt | PresentationGuard / DispatchEligibilityGuard | DeliveryStageView字段类型 | CommittedSourceRef / AllowedProjectionRef / AttachmentGrantRef | effect/attempt/receipt安全材料交U6 | SafePresentationPlan、DeliveryIntent、DeliveryAttempt、PlatformReceipt（逐个筛选） |
| U4 | ExternalActionBinding、CallbackHandoffRecord | CallbackResponsibilityGuard / OneUseGuard | CallbackStageView字段类型 | OwnerActionRef / ActorResponsibilityRef / SourceIntentRef | 验证reason/owner result交U6 | ExternalActionBinding、CallbackHandoffRecord（逐个筛选） |
| U5 | DedupRecord、StreamCursor、GapRecord、DispatchLane、RecoveryRecord | SameMeaningGuard / ComparableCursorGuard / RetryEligibilityGuard | ContinuityView字段类型 | NamespaceRef / ComparatorRef / CoverageRef / NoEffectBasisRef | 恢复/位置摘要交U6 | DedupRecord、StreamCursor、GapRecord、DispatchLane、RecoveryRecord（逐个筛选） |
| U6 | SafeAuditRecord、SafeHandoffRecord、BridgeLocalView | BodyFreeMaterialGuard / CurrentReadGuard | BridgeLocalView独立projection | ProducerAdmissionRef / ConsumerResultRef / ReadBasisRef | SafeAuditRecord本地历史；不升级为evidence | SafeAuditRecord、SafeHandoffRecord、BridgeLocalView（逐个筛选） |

#### 各部分交互总图: 六组成部分及authority交接

```text
                  U1 current binding / mappings
                    |          |          |
                    v          v          v
                  U2         U3         U4
             inbound port  delivery   action port
                    |          |          |
                    v          v          v
               Conversation  Platform    Owner
                    ^          ^          ^
                    |          |          |
              +-----+----------+----------+-----+
              | U5 dedup / cursor / lane /     |
              | qualified recovery              |
              +---------------------------------+

             U1..U5 local safe mutation material
                            |
                            v
                   U6 audit / handoff
                            |
                            v
                  Observability admission

                   U6 safe read <- existing view
                     (no repair / no writes)
```

关键说明：

- U1约束目标与generation；U2/U3/U4分别交给owner、平台、action owner，不共用成功状态。
- U5只提供连续性和受限恢复，不授予action或修改owner/platform truth。
- U6交接必须有正式canonical材料与真实consumer结果；局部audit不是evidence，查询无写入。
- 图不表达字段、完整接口、目录或详细时序。

#### 总体边界及跨审

| 检查项 | 结论 | 闭环依据 |
|---|---|---|
| 重复对象 | pass | 20个局部候选各唯一U；SafeAudit仅U6，message mapping仅U1 |
| 功能/候选遗漏 | pass | U1三mapping，U2交接，U3plan/effect/attempt/receipt，U4action/记录，U5五支撑，U6三安全对象覆盖16FR |
| 接缝冲突 | pass | owner basis/material为引用，U5不替业务裁决，U6不替consumer |
| 后续位置 | pass | 应用主体§7/8；对象§6；适用状态§9；port§7；完整类/driver留03 |
| shared候选筛选 | pass | guard/ref/view切片需Step6逐项解释，不默认独立aggregate |
| 平台与产品资格 | preserved | 沿00官方资料及01§11复核；Telegram官网/安装pin与SDK/secret/router缺口仍开放 |

Step6门禁：逐U筛选全部20候选；重对象六附录；正式对象必须独立成节、关键字段typed、函数参数typed。余下guard/ref/view切片及port每类明确归属；之后按同U轴反查§7/8/9，任何新状态对象须先回Step6。无未处置内部冲突，上游pending不转成就绪。


## 8. 回填草稿

正式§5先总表/五维表/交互图，再六部分职责、capability、代码主体/对象线索、非职责和接缝；只回收口内容。停审/跨审过程留calibration，后续位置必须实名可反查。

## 9. 待确认事项

BR-UP-001~009=open；010=reference_only；不关闭上游。

## 10. 进入下一步条件

六部分均先思考后结构并停审；20候选及shared排除线索已列；全部capability有输入/输出/副作用/后续位置，交互图及跨审通过，无字段/完整接口越界。gate_status=pass；gate_reason=component_loops_and_cross_audit_closed；next_allowed_action=step06_object_screening；formal_backfill_allowed=after_step14；commit_required=false。
