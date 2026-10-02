# 03 Step 7：逐模块定义 Trait / Port / Adapter 契约

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

当前00/01/02，前序Step的问题、诊断、取舍及未闭合资格；详细设计SOP Step7、书写规范对应章节、通则/中间产物/闭环标准；Governance对应Step适用契约组织。不继承其业务truth或运行证据。

## 3. SOP问题回答

1. 哪些模块需要定义 trait / port？

答：application唯一定义required trait；contracts纯词汇/domain纯guard不定义I/O port。

2. 哪些模块负责实现这些 trait / port？

答：infra PG/SDK/fake实现，api/worker/Web禁止直port；nativeasync采用泛型P，不构造dyn async trait。

3. 当前模块的哪些 capability、对象能力、处理流或状态转换需要 repository、outbox、projection、external client、gateway 或 adapter 接缝？

答：七U mutation/read/replay/snapshot/projection/durablework与8ownerformal接口；0outbox/event、不新增Billing/Archive。

4. 每个 trait / port 承接 Step 6 的哪个对象能力或字段 / 状态来源？

答：逐traitcapability表回指Step6实体方法、context/result/fence/source fields。

5. repository、outbox、projection、external client 的函数签名是什么？

答：独立trait块列get/save/append/bykey/scan/permission/probe，事务associatedTx同一authority。

6. 每个 trait 函数的参数类型、返回类型、错误类型是什么？

答：每函数参数/结果/有限PortError/ExternalPortError/Optionmissing明确，不用泛型JSON。

7. 每个读取函数是否提供后续 DTO 构造、flow、state matrix 或 projection stale 所需的完整读取面？

答：读完整Versionedentity、原完整typedresult、snapshotstate+material、projectionstate+safeviews，不只ref。

8. 每个写入函数的 expected_version、UnitOfWork、幂等、append-only record 或 sidecar truth 口径是否闭合？

答：ExpectedMustNotExist/Exact、sameTx、unique(operationscopekey)/appendonly与originalresult保存配对。

9. 哪些依赖只能通过 trait 访问，不能直接跨层调用？

答：SDK/PG/currentauthority只经application-ownedport；domain/entries不直infra。

10. 当前模块的 trait / port 完成后是否通过停审？

答：每trait完成后查字段/方法/tx/fakeparity；缺exactowner转换只对应positiveblocked。

11. 所有模块完成后,跨模块接缝是否存在重复 port、反向依赖、读取面缺失或写入面 version 来源缺失？

答：共同MarketPorts约束同Tx，只有一个OperationStore/ScopeResolver，fullpage/read错误与writeversion闭口。

## 4. 当前文档问题诊断

Step6已定义稳定carriers，Step7不能只有family-level store宣言。SDK generic read/call不能证明Marketplace owneroperationsupport；Gov GetGateDecision通用Query也不能证明exactapplication/basis/currentapproved绑定。PG/fake必须同UoW，不依赖fake private map补读取。

## 5. 改动前后对比

| 项 | 前 | 后 |
|---|---|---|
| 契约深度 | 前序概念骨架 | 本Step按模块/对象/入口独立展开，类型、来源与失败边界可追溯 |
| 外部资格 | retained pending | 不因文档深化变为ready；受影响positive仍blocked |

## 6. 设计取舍

采用application-owned typedports+same associatedTx+generic依赖注入；拒绝entry直DB、owner直接Cargo、nativeasync dyn、万能JSONRepository、生产fakefallback。Clock/ID位于已planned unit_of_work.rs，具体实现runtime builder，无新增member。

## 7. 结构化中间产物

### Port索引与模块内停审

完整trait/二级carrier：[typed ports](03_ddd_step_07_typed_ports.md)；runner/gate/support及JobCheckpoint签名：[application callables](03_ddd_step_07_application_callables.md)。

| Port | 对象能力 | 定义 / 实现 | callable数 |
|---|---|---|---|
| UnitOfWork | Operation/context/acceptedentity/audit/fullresult/work同原子边界 | application / infra/postgres/unit_of_work + fake staged UoW | 8 |
| ClockPort | lease/localrecord timing，不决定owner validity | application / infra/runtime_builder | 1 |
| IdGeneratorPort | 全部localfactory IDs/ref生成；ownerref不生成 | application / infra/runtime_builder/fake ID | 23 |
| MarketStorePort | U1～5与Recovery实体完整typedread/save/append | application / infra/postgres/market_store + infra/fake/local_store | 48 |
| OperationStorePort | 上下文single authority、operationscopekey、完整typed原结果 | application / infra/postgres/operation_store + stagedfake | 11 |
| AuditStorePort | MarketAuditRecord append-only与安全history读取 | application / infra/postgres/audit_store+fake | 5 |
| WorkStorePort | 原durable responsibility/fence/permission/recovery读取 | application / infra/postgres/work_store+fake | 10 |
| SnapshotStorePort | QualifiedReferenceSnapshot完整state+body pair | application / infra/postgres/snapshot_store+fake | 4 |
| ProjectionStorePort | ReadProjection状态与safeviews、truth plan、catalogscope搜索 | application / infra/postgres/projection_store/catalog_search+fake | 9 |
| ScopeResolverPort | 全部entry与replay/read的currentactor/scope/disclosure | application / infra/sdk/scope_resolver | 1 |
| SourceOwnerPort | U1 sourceimmutablebinding/currenteligibility与U7snapshot | application / infra/sdk/source_owner | 3 |
| PublisherAuthorityPort | 人类publisher/org与发布/维护权限；Identity AI≠human认证 | application / infra/sdk/publisher_authority | 6 |
| MaterialAuthorityPort | 签名/扫描/SBOM仅引用，不审核 | application / infra/sdk/material_authority | 1 |
| GovernancePort | formalreview handoff/approved决定与unknownprobe | application / infra/sdk/governance | 4 |
| ReceiverPort | 当前接收能力/获取材料化owner结果与原intentprobe | application / infra/sdk/receiver | 4 |
| NoticeChannelPort | 正式通知target/channel/receipt边界 | application / infra/sdk/notice_channel | 5 |
| ObservationPort | safeauditproducer/redaction/admission与原intent对账 | application / infra/sdk/observation | 3 |

### owner adapter资格与证据边界

| 接缝 | 当前正式输入已见 | exact缺口 / 拒绝行为 |
|---|---|---|
| Source | Method formalversion/consumption；Hub read-onlyecosystem；Images supplyformal；Artifact材料 | MP-UP001，展示五类不canonicalownerkind；版本/摘要/可见/资格export与SDKmapping不齐blocked |
| Governance | GetGateDecision/DecisionSummaryView | MP-UP002/SRC010：申请/sourceversion/material/publisher/scope/currentapproved exactmapping未证明；scan/signature/ACK不补 |
| Publisher/Scope | CoreActorContext与IdentityAI formal范围 | MP-UP003，人类/org/auth formalowner缺口；角色hint/publiclabel不authority |
| Material | Artifact formalrefs/immutable与材料边界 | MP-UP004，签名/扫描/SBOMkind/适用authority未闭合；不伪造passed |
| Receiver | owner材料化意向与接口候选 | MP-UP005，formal原intent/结果/probe，缺probe Unknown waiting/manualbasis；无installed/paid |
| Notice/Disposition | local处置与knownimpact需求 | MP-UP007，正式channel/target/receipt/authority；Confirmed不等送达 |
| Observation | 正式producer/安全audit边界 | MP-UP008及affectedproducer；localfact不externalreceipt/evidence |
| SDK | siblingclient已导出ServiceClient read/call | 仅通用编译路径核验，不是具体operation/schema兼容证据，所有exactmapping按上表挂起 |

每条SDKadapter只能声明planned转换；从本地candidate→formalowner输入、正式输出→本地typedcarrier的exact字段/ownerclass/operation绑定尚未关闭时返回ContractBlocked，不臆造ServiceCapabilityCall值、契约ID、run/evidence。Core/SDK实际导出被只读检索，其他owner禁止直接Cargo。

### 读取/保存与边界审计

14carrier都get/save或append配对；qualificationfailure有typedimmutable sidecar，notice scope在内部计划或typedintent字段承接；Corecontext ref有append/load。operationkey唯一(scope,operation,key)且fullresult/get，不使用当前projection重建。内部ScanPage含compoundcursor/upper，publicPage使用Corepage唯一请求源，mapping保持current可见交集。MarketPorts统一associatedTx，application不依赖infra。

复杂度：重trait与sharedhelper拆附录；每trait独立capability与停审，本Step主控只索引/跨审。SQLschema留Step11，错误恢复/幂等/config具体绑定后续12～14，不把未closedowner宣称ready。


## 8. 候选正式草稿

候选§5/6：application唯一portowner，infra PG/SDK/fake实现，完整typedtraits从附录摘录，API/Worker只facade；副作用/UoW/error/missing/read面保留。没有新增ownertruth/activeevent，不装配正式03。

## 9. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01及受影响Hub/Images/Obs/SDK资格仍pending/blocked；本地候选不冒充owner确认。Billing/支付/订阅/分成/跨境均future/blocker，Archive无active lane。

## 10. 自检与下一门禁

内部停审：17traits、146declared port callables、get/save/append/bykey/fullresult/permission/plan读取面已审查；外部qualifiedconversion仍blocked。进入Step8，仅文档，不实现、不提交。
