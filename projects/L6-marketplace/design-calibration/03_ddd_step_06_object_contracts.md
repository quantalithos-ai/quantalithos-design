# 03 Step 6：逐模块定义对象实现契约

## 1. Step状态

2026-10-01；full-restart / single-agent；用户授权Step5～10。completed / selfcheck_done，正式03仍historical_material。

### Step内计划

| 单元 | 状态 |
|---|---|
| P1读取输入 | done |
| P2问题回答 | done |
| P3诊断 | done |
| P4取舍 | done |
| P5逐单元结构化 | done |
| P6复杂度与跨单元审计 | done |
| P7候选草稿 | done |
| P8自检与停审 | done |

## 2. 本步输入

当前00/01/02，前序Step的问题、诊断、取舍及未闭合资格；详细设计SOP Step6、书写规范对应章节、通则/中间产物/闭环标准；Governance对应Step适用契约组织。不继承其业务truth或运行证据。

## 3. SOP问题回答

0. 是否已经建立 Step 6 文件骨架、写入批次状态表和模块执行顺序表？若没有,当前批次先补骨架还是先补对象组计划？

答：先建本Step十段主控与shared→U1～U7→支撑/入口顺序；每个附录到达时才创建。

1. 本仓是否需要先收敛跨模块 shared vocabulary、typed ref、public marker 或基础 state enum？

答：先闭口本地typed ids、外部ref边界、状态、read/error/result/page/fence，Core actor/meta只引用已导出类型。

2. 当前模块需要完成哪些功能 / capability？

答：七U能力按Step5，domain纯函数，application承担scope/replay/UoW，infra承载PG/SDK，入口只decode/dispatch。

3. 每个功能需要哪些输入、输出、状态、副作用、外部协作或后续 Step 承接点？

答：每U独立capability表，字段来自candidate→formal port qualified output、本地typed读取、ID/clock或固定派生；不从index猜truth。

4. 每个功能应该由哪些对象承接？哪些属于 truth object、policy / guard、view / report、application helper、adapter state 或 entry object？

答：局部实体、immutable binding、guard、safeview各单独；application Core context记录与runtime配置/entry carrier在本Step闭口。

5. 是否存在功能无人承接、对象没有功能来源、对象职责过大或对象跨越模块边界？

答：诊断Draft缺review、Blocked无summary、revision双authority；用Option、safe read posture及Versioned<T>单authority修正，不删正常生命周期。

6. 对于 `application` / `infra` / `api` / `worker` / `jobs` 等非 core 模块,当前 Step 6 必须正式闭口哪些对象,哪些只能 defer 到后续 Step？defer 的理由和承接 Step 是什么？

答：稳定context/result/job report/runtime availability闭口；SQL具体行codec/配置默认/transport parser实现后续11/14，不推迟稳定载体。

7. 每个模块中最终需要定义哪些 struct / enum / value object / service？

答：43对象加传递基础/输入/record/服务依赖等；各独立Rust字段/签名，不把43当上限。

8. 每个对象需要完成哪些对象级能力？主要责任和不变量是什么？

答：能力→字段→函数→状态在各U附录映射；copy owner ref不拥有ownerbody。

9. 对象为了完成这些能力需要哪些成员变量？每个字段的类型、作用、约束和来源是什么？

答：每字段类型、必填/optional、输入/lookup/system来源和miss行为明列；opaque值只校验边界不解析。

10. 对象需要哪些成员函数？完整签名、参数类型、返回类型和副作用是什么？

答：同步domain方法返回有限DomainError，无I/O；application异步通过已命名port，持久副作用在flow。

11. 哪些函数是工厂函数或静态函数？factory 入参是否覆盖必填字段？若没有覆盖,剩余字段由哪个正式来源提供？

答：factory input覆盖所有非默认字段；state/optional初值与ID/clock已命名；rehydrate只repo内部验证完整行。

12. 哪些状态 enum 需要写变体、允许来源和允许去向？

答：14carrier enum完全承接02，classification/disposition/read marker不硬造新生命周期。

13. 每个 enum variant 的 Rustdoc 注释是什么？带载荷 variant 的载荷类型承载什么语义？

答：全部variant英文Rustdoc遵守已接受Step3及Rust规范；与SOP中文注释示例冲突显式裁定。

14. 当前模块或对象组完成后,模块内停审记录是否已经写明:功能承接、对象来源、字段来源、状态迁移和边界约束？

答：每U写入后停审并记录capability/fields/states/边界；有缺口先修不标pass。

15. 所有模块写完后,对象组字段来源审计表是否已经覆盖高复用字段、truth object、view / report、application helper、adapter state 和 entry object？

答：高复用ref/version/metadata/page/result/fence与实体/view/helpers/runtime各组来源审计。

16. 所有模块写完后,状态闭环审计表是否已经覆盖 domain truth、read / projection、maintenance / publication、entry disposition 等状态族？

答：business/reference/readprojection/reliability分族；runtime/entry分类无独立truth迁移排除。

17. 哪些 object / field / state / helper 明确由 Step 7+ 承接？Step 7 承接清单是否已经逐项命名 port、repository、resolver、protocol 或 flow 闭口点？

答：Step7明确typedstore/get/save/context/fullresult/owner资格/clock/id等承接，Step8/9不能猜字段。

## 4. 当前文档问题诊断

当前02对象卡有HLD伪签名和若干只点名支撑类型。Draft的review_ref不可强制存在，Blocked source无safe_summary，revision不能对象与Versioned双存。domain不能直接携带Core；以本地typed context record ref指向application-owned唯一Core记录，禁止从字符串复制identity或metadata，新增typed load/save面随Step7闭口。

## 5. 改动前后对比

| 项 | 前 | 后 |
|---|---|---|
| 契约深度 | 前序概念骨架 | 本Step按模块/对象/入口独立展开，类型、来源与失败边界可追溯 |
| 外部资格 | retained pending | 不因文档深化变为ready；受影响positive仍blocked |

## 6. 设计取舍

采用shared词汇→逐U功能与对象卡→non-core稳定carrier→跨组审计；拒绝直接把HLD字段表扩写成DTO或将所有稳定helper延期。外部ref采用本地body-free transport wrapper但不声明上游Rustexport/consumer支持，缺exact转换仍blocked。

## 7. 结构化中间产物

2026-10-02 Step11回修：七U所有43对象的validated `rehydrate(Row)`作为domain crate公共codec；Row合法公开导出，infra不能调用crate-private函数或绕校验构造。mutable save的实体revision只是DB同一列镜像；完整规则见[Step11§7.3](03_ddd_step_11_persistence_transactions.md)。此改动不增对象/业务入口/状态或owner资格。

### Step6批次与模块执行顺序

| 批次 | 责任模块 / 范围 | 输入 | 输出 | 状态 |
|---|---|---|---|---|
| 6.0 | contracts shared refs/state | Step5+02§6/9 | shared_types附录 | done / shared输入与结果已闭口 |
| 6.1 | U1 source_responsibility | 对应capability / 02对象卡 | part_u1 | done |
| 6.2 | U2 publication_review | 对应capability / 02对象卡 | part_u2 | done |
| 6.3 | U3 catalog_version | 对应capability / 02对象卡 | part_u3 | done |
| 6.4 | U4 distribution | 对应capability / 02对象卡 | part_u4 | done |
| 6.5 | U5 withdrawal_notice | 对应capability / 02对象卡 | part_u5 | done |
| 6.6 | U6 audit_recovery | 对应capability / 02对象卡 | part_u6 | done |
| 6.7 | U7 reference_read | 对应capability / 02对象卡 | part_u7 | done |
| 6.8 | application/infra/api/worker/web稳定carrier | 前述字段与entry责任 | runtime_helpers | done |
| 6.9 | 字段/状态/传递类型审计 | 全部附录 | 本Step§7/10 | done |

### non-core闭口决策

application Core ContextRecord、runner/facade依赖与replay/report carrier当前闭口；infra config/adapter资格载体当前闭口，具体config默认与rowcodec Step11/14；api/worker可信entry泛型wrapper当前闭口，49route/Job selector Step8；webtypedmirror与异步readsurface当前闭口，页面组件实现不在本轮。不存在jobs模块。

### 独立对象附录索引与审计

| U | 附录 | 对象数 | 审查 |
|---|---|---|---|
| U1 | [来源/发布责任](03_ddd_step_06_part_u1.md) | 6 | 独立卡与完整Row，capability/field/factory/method/state已停审；owner positive资格未关闭 |
| U2 | [申请/正式审核交接](03_ddd_step_06_part_u2.md) | 6 | 独立卡与完整Row，capability/field/factory/method/state已停审；owner positive资格未关闭 |
| U3 | [目录/市场版本](03_ddd_step_06_part_u3.md) | 5 | 独立卡与完整Row，capability/field/factory/method/state已停审；owner positive资格未关闭 |
| U4 | [受控分发](03_ddd_step_06_part_u4.md) | 6 | 独立卡与完整Row，capability/field/factory/method/state已停审；owner positive资格未关闭 |
| U5 | [撤回/影响/通知](03_ddd_step_06_part_u5.md) | 6 | 独立卡与完整Row，capability/field/factory/method/state已停审；owner positive资格未关闭 |
| U6 | [审计/恢复](03_ddd_step_06_part_u6.md) | 9 | 独立卡与完整Row，capability/field/factory/method/state已停审；owner positive资格未关闭 |
| U7 | [引用/snapshot/索引](03_ddd_step_06_part_u7.md) | 5 | 独立卡与完整Row，capability/field/factory/method/state已停审；owner positive资格未关闭 |

共享词汇：[shared types](03_ddd_step_06_shared_types.md)；稳定辅助：[runtime helpers](03_ddd_step_06_runtime_helpers.md)。body-free immutable组合放contracts，domain原文件负责re-export与纯guard；contracts不依赖domain。需要entity的内侧输入放domain或使用safe Snapshot映射，不把entity放public DTO。

### 高复用字段来源审计

| 字段族 | 唯一authority | 来源 / missing | Step7承接 |
|---|---|---|---|
| local refs | IDPort+typedlookup | fresh生成，replay零生成；missing不auto create | get/save/bykey |
| owner ref/version/digest/visibility/eligibility | formalowner/SDK | body-free exact转换；缺口blocked，不复制正文 | Source/Material/Governance ports |
| actor/key/trace/page/consistency | Core记录/临时QueryEnvelope | domain localcontextref；Core字段不双承载；Query no write | Operation context / ScopeResolver |
| revision | PG同一rowcolumn / Versioned | 对象revision只同值镜像；save更新镜像，无第二column | ExpectedMarketRevision/CAS |
| view optional | entity+currentdisclosure | Draft review=None，Blocked summary=None，NotVisible无body | ReadSurface + typedread |
| fence/work/effectintent | WorkStore与原业务意图 | lease不证明notcommit；unknown formalprobe | claim/permission/get_byintent |
| full result/report | MarketResultSurface V1 | 完整原receipt/items/bases/gaps/cursor，kind一致 | save/get完整原值 |
| projection keys/cursor | kind+typedsubject+scope/committedfacts | 非空plan；旧index非truth | state+body成对读取 |

### factory与optional闭环

SourceVerification Pending可binding/outcomeNone；Qualified必须完整binding/material/outcome；Blocked/Invalidated须真实安全结果关联。Application Draft可无basis/review，Submitted两者必有且同application；Terminated保留历史。Review WaitingDecision必须原dispatchoutcome；MatchedDecision有formalbinding但不必approved；Unknown/Failed/ContractBlocked必须安全failure。

MarketVersion Listed必须当前formalapproved fullbinding，Restricted/Withdrawn须disposition；Withdrawn终态。Distribution/Notice Confirmed须matching正式结果，Failed须notcommittedproof，Unknown须原permission/failure，Blocked不得外发。Completed Operation须fullresult，Settled work须fullreport，不以unknown当settled。Qualified Snapshot须本体/version/validity成对，Unavailable不披露旧slice。Fresh Projection只固定cursor完整shadow，currentvisibility另核。

### 状态闭环审计

| 族 | 主语 | 初始 | 承接 |
|---|---|---|---|
| business | Publisher/Application/Version/DistributionIntent | Bound/Draft/Staged/Accepted | Step10，终态不复活 |
| source/reference | Verification/Snapshot | Pending/Qualified | formalinput，Blocked不假Qualified |
| handoff/effect | Review/Attempt/Notice | PendingDispatch/Prepared/Prepared | 原intent、permission、unknown probe |
| knownimpact | ImpactRecord | Partial | fixedcursor本地范围，late再Partial |
| reliability | Operation/Work/Recovery | Reserved/Pending/Requested | UoW/fullresult/fullreport |
| projection | ReadProjection | Stale | 非空typedplan与完整原子publish |
| transient classifiers | ReadSurface/JobItemOutcome/ReplayDisposition/AdapterBindingDisposition/UowMode | 无生命周期 | Step10筛选排除，无新GlobalState |

### Step7承接与复杂度

MarketStore get/save/append/唯一关系；OperationStore context/fullresult/key；Audit append/list；Work claim/permission；Snapshot/Projection state+body；八owner ports与Clock/ID/UoW。SQLDDL、错误恢复/配置默认/测试方案后续11～16，不造运行证据。

43主对象加shared/input/Row/result/helper分9附录，不能以43为类型上限。跨组修正已回对象卡：optional/context/纯词汇依赖/classify返回值。静态传递类型检索发现OwnerAssetDigest缺schema并已补；owner exactconversion仍blocked。



### Step9回修与审查记录

SourceVerification.publisher_ref、NoticeIntent.scope_ref、Category.scope_ref已在完整schema/Row/factory输入承接；QualifiedObservationOutcome回填为outcome_ref/operation_ref/audit_refs/scope_ref，不误用RecoveryRequirements。Immutable组合词汇与StoredOperationResult迁至contracts单authority，原domain只re-export，不让safe public结果泄漏domain-only类型。Versioned.revision为单持久列，显式entity revision只是同列镜像；JobCheckpoint、联合ImpactScanItem、projection manifest无独立新lifecycle。具体受影响schema以Step6 shared_types、Step7 application_callables为准。此次仅文档反向闭环，不变更owner资格/实现状态。

## 8. 候选正式草稿

候选正式§5/6从§7与9附录摘录对象schema/字段/完整函数/来源/禁止项与Step7承接，不复制过程批次、不装配正式03。

## 9. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01及受影响Hub/Images/Obs/SDK资格仍pending/blocked；本地候选不冒充owner确认。Billing/支付/订阅/分成/跨境均future/blocker，Archive无active lane。

## 10. 自检与下一门禁

43独立对象与14enum已核对；共享/工厂/结果/稳定helper字段来源与optional约束审查完成。文档内部停审通过，exactowner转换仍blocked；进入Step7，不装配、不实现、不提交。
