# 02 Step 5：主要组成部分、职责与边界

## 1. Step状态

开工：用户已确认01并授权全部02；Step 5 completed，formal未装配。仅当前agent。

Step内计划：P1读取输入 → P2逐题回答 → P3诊断 → P4前后比较 → P5取舍 → P6结构化 → P7回填草稿 → P8自检/停审。P1～P8已分批完成。

模块门禁：U1→U2→U3→U4→U5→U6→U7逐部分小循环，前一部分pass才允许下一部分。

## 2. 本步输入

当前正式00§9～16、01§6～17；本Step对应SOP与书写规范。前一Step的问题回答/诊断/取舍/待确认事项：02_hld_step_04_code_subject_framework.md。旧02未作为推导依据。

## 3. SOP问题回答

1. 当前概要设计层面，本仓应被划分为哪些主要组成部分？

答：保留01的U1～7，不按页面或owner重切；每部分作为内部模块而非服务。

2. 每个主要组成部分分别承担什么职责？

答：U1资格责任、U2申请handoff、U3目录版本、U4分发、U5撤回通知、U6审计恢复、U7引用读取。

3. 每个主要组成部分明确不承担什么职责？

答：不承担各source/body/Gov/Identity/receiver/finance/Archive truth；边界逐部分在附录明列。

4. 每个主要组成部分需要完成哪些功能 / capability？

答：各部分从16FR推capability，先功能再对象，不从表名或UI卡片反推领域。

5. 每个功能需要哪些输入、输出、状态影响、外部协作或后续 Step 承接？

答：附录功能表列输入/输出/局部状态副作用及Step6～9，positive external能力始终conditional。

6. 每个主要组成部分包含哪些代码主体 / 模块？

答：沿Step4七Service，分别绑定内側持久port/owner port、query主体与worker task。

7. 这些代码主体 / 模块在本部分中只需要说明到什么粒度？

答：只到主体类型/责任/后续展开，不写字段/函数/schema/目录。

8. 哪些内容虽然相关，但必须由相邻部分或边界外能力承担？

答：U3拥有市场version；U2只有matched Gov ref；U4receiver交付语义归外部；U7不给任何领域写权。

9. 哪些职责如果不写清，后续最容易让概要设计滑进实现层或让不同部分串线？

答：最危险为本地review批准、U3 ownerversion复制、U4 installed、U5已送达、U6删除历史、U7索引授权。

10. 每个主要组成部分分别包含哪些对象发现线索？

答：按truth/state、policy、view、reference、audit/history六维逐部分列候选。

11. 这些线索分别属于 truth / state / policy / projection / reference / audit / history 哪个维度？

答：业务状态在U1～6对象；快照/投影维护在U7；纯ref与command DTO后续协议，audit唯一U6。

12. 哪些候选对象必须进入 Step 6 独立成节展开？

答：所有独立聚合/实体/policy/reference/view候选进入Step6独立卡片；纯字段与port明确排除。

13. 哪些名称只是 API / repository / port / trigger / DTO / 字段类型，不应在 Step 6 被误写成领域对象？

答：Service/Entry/Port/Repository/Adapter/CommandDTO/ID标量不是领域对象；枚举作为其唯一carrier卡片中的状态字段展开不重复建对象。

14. 当前组成部分完成后,功能、候选对象、接缝和禁止事项是否通过停审？

答：每部分先问题/诊断/取舍、后功能/发现/回填/自检，前一pass再下一个，实际附录落盘为证。

15. 所有组成部分完成后,是否存在重复对象、职责重叠、候选对象遗漏或后续展开位置冲突？

答：全七部分后检查audit只U6、marketversion只U3、sourcebinding只U1、投影只U7，无重复writer/漏capability。

## 4. 当前文档问题诊断

01§6只有语义责任不能替代功能发现；Step4 ports不是领域对象，U7名称易被误写为真相中心。00§11每类数据需唯一owner，不能七部分各造AuditTrail。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 功能发现 | 架构仅语义责任 | 七部分功能/代码/六维候选/接缝逐个落盘 | 避免从对象反推功能 |
| shared记录 | 各部分可能自造audit | U6唯一，其他关联 | 不复制truth |
| U7 | 引用读取笼统 | 只有shadow/read维护 | 防止projection授权 |

## 6. 设计取舍

采用七部分模块小循环；共用安全audit/operation/work由U6唯一管理，sourcebinding由U1唯一定义，U7snapshot/projection不复制domain。拒绝按五展示类型建五套独立生命周期。

## 7. 结构化中间产物

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| U1 来源与发布责任 | 核验来源与材料、绑定/解除publisher责任 | SourceResponsibilityService / SourceGatePolicy | 认证/Identity/签名扫描生产/资产正文 |
| U2 发布与审核交接 | 建立草稿、固定提交、终止申请、审核交接与匹配决定 | PublicationReviewService / ReviewBindingPolicy | Governance approval/投票/策略裁决 |
| U3 目录与市场版本 | 建立listing、维护市场metadata/分类、登记与上架版本、范围发现/exact选择 | CatalogVersionService / VersionAdmissionPolicy | Method目录/Registry/源版本/资产内容/资格truth |
| U4 受控分发 | 当前获取资格、受理/取消意图、交付与原意图结果对账 | DistributionService / AcquisitionGatePolicy | 安装激活/付款订阅/receiver commit truth |
| U5 撤回与通知 | 有据限制/撤回、已知影响枚举/增量、通知计划/交接/对账 | WithdrawalNoticeService / WithdrawalImpactPolicy | 外部全局撤销/全安装扫描/卸载/自造送达 |
| U6 审计与恢复 | 局部原子追溯、完整原结果重放、外部审计交接、原意图受控恢复 | AuditRecoveryService / RecoveryPolicy | Obs准入truth/Archive包/改owner/删历史/新intent盲重发 |
| U7 引用与读取投影 | qualified引用快照刷新、resolver-first读取、目录/进度/影响投影重建 | ReferenceReadService / ReadBoundaryPolicy | business truth写入/从index授权/opaque解析/财务truth |

#### 各部分交互总图

```text
[U1 Source / Publisher] --> [U2 Fixed Application / Review] --> [U3 Listing / Version]
        |                               |                           |
        +---------- current basis ------+---------------------> [U4 Distribution]
                                                                    |
[U5 Withdrawal / Notice] <---------- known / late / unknown ----------+
        |
        +--- disposition via U3 (same local version serialization)

[U1 ... U5 changes] --same local UoW--> [U6 Audit / Result / Durable Work]
[committed U1 ... U6 + qualified owner snapshots] --> [U7 Read / Reference]
[U7] -- scoped read only --> [Web / API query]
```

- 箭头是本地责任/材料交接，不是跨owner事务。
- U2只交付匹配决定引用，U3显式处置；U5通过U3唯一version writer停新发。
- U6局部audit与外部Obs准入分离；U7不得反写。

### 可发布内容展示分类

展示分类不是上游schema枚举或市场资产正文；五类复用同一listing/application/review/version/distribution/withdrawal流程，差异仅通过qualified owner adapter和formalreceiver合同表达。

| 展示分类候选 | 正文/正式版本owner | 市场只保存 | 当前准入边界 |
|---|---|---|---|
| 方法资产 Method asset | L3-method-library | qualified immutable ref/version/digest/visibility、市场metadata | 正式方法类型/consumer材料与SDK映射按MP-UP-001核验 |
| 过程模板 ProcessTemplate | L3-method-library | qualified sourcebinding与listing/marketversion | 不复制流程正文，不把市场上架等同模板正式化 |
| 角色定义 RoleDefinition | L3-method-library | 正式角色来源组合/安全摘要 | 不由Identity Role summary或GlobalMember反造Role正文 |
| 能力组件 Capability | L3-capability-hub | Registry/Descriptor/Exposure正式safe refs与visibility来源 | registry存在或scan结果不是marketapproval，formalexposure/current资格仍需匹配 |
| Member Image | L2-member-images | pinned image/entry/provenance/eligibility正式ref与摘要 | 不造image内容/Artifact lineage/launchtruth；consumer未qualified不可声称可安装，0outbound |

桥接包、联合资产包、MK2包及任意Artifact正文不会因原型标签或全局产品愿景成为第六类可发布truth；需要正式owner/类型/版本/摘要/资格与受控范围变更，MP-SRC-013保留。

### 功能与发现结果

#### U1 来源与发布责任

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 来源资格核验 | owner正式type/ref/version/digest/visibility/eligibility | SourceBinding/SourceVerification Qualified或安全Blocked | 本地核验过程，缺合同不positive | §6～9；FR-MP-101；CUT-MP-1 |
| 发布责任建立/解除 | 正式主体/组织/scope/authority | PublisherRelation Bound/Released | 仅局部关系；currentauth另复核 | §6～9；FR-MP-102；CUT-MP-1 |
| 材料适用核验 | 签名/扫描/SBOM formal材料ref+kind/validity | MaterialReference或safe gap | 不产签名/扫描结果/approval | §6～9；FR-MP-103；CUT-MP-1 |

代码主体：SourceResponsibilityService编排、SourceGatePolicy守门、内側typed persistence/owner ports承接；不写实现路径。详见[本部分小循环](02_hld_step_05_part_u1.md)的代码主体/六维发现/接缝及停审。

#### U2 发布与审核交接

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 申请草稿/修订/固定提交/终止 | 安全draft候选与U1当前资格 | Draft/Submitted/Terminated，固定PublicationBasis | Submitted不改，submit需review durable责任 | §6～9；FR-MP-201；CUT-MP-2 |
| 审核交接/决定关联/原意图对账 | 原handoff/basis+Govformal接收/决定 | ReviewHandoff进度与matched binding | ACK非approved；unknown先probe | §6～9；FR-MP-202；CUT-MP-2 |

代码主体：PublicationReviewService编排、ReviewBindingPolicy守门、内側typed persistence/owner ports承接；不写实现路径。详见[本部分小循环](02_hld_step_05_part_u2.md)的代码主体/六维发现/接缝及停审。

#### U3 目录与市场版本

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 显式上架 | 固定申请与currentapproved/sourcegate | MarketVersion Listed或拒绝/blocked | 只有本地市场处置，不自审 | §6～9；FR-MP-203；CUT-MP-3 |
| 目录metadata/分类/范围搜索 | 市场标签/分类+currentreadscope+safe来源 | listing/category与可见page/count/suggest | 领域写显式，query/index不变truth | §6～9；FR-MP-301；CUT-MP-3 |
| 来源与版本详情 | exact listing/version与qualifiedsnapshot | safe详情/材料/限制/freshness | 不返回body/伪造评分预览 | §6～9；FR-MP-302；CUT-MP-3 |
| exact版本选择 | 用户指定MarketVersionRef | 明确选择资格/不可用/unknown | 不latestfallback、不创建获取intent | §6～9；FR-MP-303；CUT-MP-3 |

代码主体：CatalogVersionService编排、VersionAdmissionPolicy守门、内側typed persistence/owner ports承接；不写实现路径。详见[本部分小循环](02_hld_step_05_part_u3.md)的代码主体/六维发现/接缝及停审。

#### U4 受控分发

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 当前获取资格读面 | exact版本/source/Gov/当前授权/正式receiver | 资格safeview或blocked/unknown | no-write，无财务entitlementtruth | §6～9；FR-MP-401；CUT-MP-4 |
| 获取受理/取消与分发交接 | 当前gate+exact版本/consumer/receiver/scope | intent/relation/attempt/durable责任 | 与withdraw同版本边界，accepted非installed | §6～9；FR-MP-402；CUT-MP-4 |
| 接收结果匹配/对账 | formal原intent/version/consumer/receiver/scope结果或probe | mappedoutcome/Failed/CommitUnknown | 迟到补impact，unknown不盲retry | §6～9；FR-MP-403；CUT-MP-4 |

代码主体：DistributionService编排、AcquisitionGatePolicy守门、内側typed persistence/owner ports承接；不写实现路径。详见[本部分小循环](02_hld_step_05_part_u4.md)的代码主体/六维发现/接缝及停审。

#### U5 撤回与通知

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 限制/撤回本地版本 | formal处置/失效依据+exact版本 | disposition+Restricted/Withdrawn | 通知失败不复活，停新admission | §6～9；FR-MP-501；CUT-MP-5 |
| 已知影响枚举/增量与通知责任 | known/unknown/late关系+formalchannel/target | Partial/KnownScopeComplete、notice计划/attempt/outcome | 只已知cursor集合，不全安装/自造送达 | §6～9；FR-MP-502；CUT-MP-5 |

代码主体：WithdrawalNoticeService编排、WithdrawalImpactPolicy守门、内側typed persistence/owner ports承接；不写实现路径。详见[本部分小循环](02_hld_step_05_part_u5.md)的代码主体/六维发现/接缝及停审。

#### U6 审计与恢复

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 安全局部审计/完整原结果/外部交接 | accepted局部变化/原operation+qualifiedproducer合同 | audit/result/work及独立ObservationBinding | local原子，externalunknown单独 | §6～9；FR-MP-503；CUT-MP-6 |
| 受控恢复/重放/原意图核对 | formalauthority+typed原目标/probe/重建计划 | RecoveryIntent/report或Blocked | 不改外部truth/旧历史/复活version | §6～9；FR-MP-504；CUT-MP-6 |

代码主体：AuditRecoveryService编排、RecoveryPolicy守门、内側typed persistence/owner ports承接；不写实现路径。详见[本部分小循环](02_hld_step_05_part_u6.md)的代码主体/六维发现/接缝及停审。

#### U7 引用与读取投影

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| scope安全读取 | currentactor/disclosure+typed市场facts/safe影子 | QualifiedReadContext与安全view | 所有count/suggest/history同裁剪，no-write | §6～9；FR-MP-301/302；CUT-MP-7 |
| qualified引用刷新 | finiteformal来源/type/consumer/scope | snapshot本体+Qualified/Stale/Unavailable+gap | 只影子，不解除business限制 | §6～9；FR-MP-504；CUT-MP-7 |
| 目录/进度/影响/audit派生重建 | committedfacts+qualifiedsnapshots+非空typedplan/fixedcursor | scopebound ReadProjection安全shadow/report | 不oldindex修truth、不发无schemaevent | §6～9；FR-MP-301/302/504；CUT-MP-7 |

代码主体：ReferenceReadService编排、ReadBoundaryPolicy守门、内側typed persistence/owner ports承接；不写实现路径。详见[本部分小循环](02_hld_step_05_part_u7.md)的代码主体/六维发现/接缝及停审。

| 组成部分 | Truth / State | Policy / Invariant | Projection / Read model | Reference / Boundary | Audit / History | Step 6 必须独立展开 |
|---|---|---|---|---|---|---|
| U1 | PublisherRelation、SourceVerification | SourceGatePolicy | SourceQualificationView | SourceBinding、MaterialReference | U6统一安全audit；责任与核验变化回指 | 独立carrier/policy/binding/view逐卡；纯ID/DTO/Port排除 |
| U2 | PublicationApplication、ReviewHandoff | ReviewBindingPolicy | ApplicationProgressView | PublicationBasis、GovernanceDecisionBinding | U6统一安全audit；申请基线与交接历史 | 独立carrier/policy/binding/view逐卡；纯ID/DTO/Port排除 |
| U3 | MarketplaceListing、MarketVersion、Category | VersionAdmissionPolicy | CatalogReadView | 市场版本→owner版本不可变绑定 | U6统一安全audit；目录及版本处置历史 | 独立carrier/policy/binding/view逐卡；纯ID/DTO/Port排除 |
| U4 | DistributionIntent、DistributionRelation、DistributionAttempt | AcquisitionGatePolicy | DistributionReadView | ReceiverOutcomeBinding | U6统一安全audit；意图/attempt/receiver结果历史 | 独立carrier/policy/binding/view逐卡；纯ID/DTO/Port排除 |
| U5 | WithdrawalDisposition、ImpactRecord、NoticeIntent | WithdrawalImpactPolicy | ImpactNoticeView | NoticeOutcomeBinding | U6统一安全audit；撤回/影响/通知追加历史 | 独立carrier/policy/binding/view逐卡；纯ID/DTO/Port排除 |
| U6 | MarketAuditRecord、OperationRecord、StoredOperationResult、DeferredWork、RecoveryIntent | RecoveryPolicy | AuditRecoveryView | ObservationOutcomeBinding | U6统一安全audit；安全append-only审计本身 | 独立carrier/policy/binding/view逐卡；纯ID/DTO/Port排除 |
| U7 | 无业务truth；仅QualifiedReferenceSnapshot、ReadProjection维护姿态 | ReadBoundaryPolicy | Catalog/Progress/Impact/Audit typed切片 | TypedOwnerReference、QualifiedReadContext | U6统一安全audit；来源cursor与维护报告回指 | 独立carrier/policy/binding/view逐卡；纯ID/DTO/Port排除 |

跨部分审计：16FR均有功能落点；U3唯一marketversion writer、U6唯一audit/result/work、U1唯一sourcebinding、U7唯一派生维护；无五展示类型重复生命周期。复杂度为七部分，七附录已串行pass；Step6不能跳过候选。

## 8. 回填草稿

正式§5仅摘录本文件§7及已pass部分附录，不带问题/诊断/历史审计；不新增结论。

## 9. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01沿01保留，仅受影响正向lane blocked；不是owner已确认或已发送请求。

## 10. 进入下一步条件

P1～P8均完成；内部stop_review/pass。七附录全部pass再跨部分审计；FR无漏项、候选无来源孤儿。 外部资格不关闭，允许进入Step 6。
