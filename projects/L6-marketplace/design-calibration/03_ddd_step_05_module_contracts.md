# 03 Step 5：定义模块实现契约主轴

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

当前00/01/02，前序Step的问题、诊断、取舍及未闭合资格；详细设计SOP Step5、书写规范对应章节、通则/中间产物/闭环标准；Governance对应Step适用契约组织。不继承其业务truth或运行证据。

## 3. SOP问题回答

1. 本仓详细设计应该拆成哪些实现模块？

答：六Rust member与Web为七个技术模块；七U为正交业务责任，不拆成七微服务。

2. 每个模块对应概要设计中的哪个主要组成部分或代码主体？

答：contracts协议/domain局部truth/application七Service/infra PG+SDK/api同步入口/worker12Job/web展示与意图；承接02§4/5/7。

3. 每个模块对外暴露什么？

答：逐模块卡列typed公共面；入口不能暴露DB、domain mutation或approval。

4. 每个模块允许依赖哪些模块，禁止依赖哪些模块？

答：向内单向依赖；domain只用contracts纯词汇，不引入Core/SDK/runtime；Core metadata的独立context/protocol子模块不被domain import。

5. 哪些对象、trait、handler、repository应归属于哪个模块？

答：协议/公共值contracts；实体/策略domain；ports/usecases application；PG/SDK/fakes infra；handlers api；scheduler worker；视图交互web，逐路径以Step4为准。

## 4. 当前文档问题诊断

Step4提供文件归属而未给模块暴露/禁止面；照搬Governance的jobs/outbox会违反本仓0event与12内部Job边界。contracts中Core wrapper不可泄漏至纯domain依赖面，必须区分词汇与入口上下文。

## 5. 改动前后对比

| 项 | 前 | 后 |
|---|---|---|
| 契约深度 | 前序概念骨架 | 本Step按模块/对象/入口独立展开，类型、来源与失败边界可追溯 |
| 外部资格 | retained pending | 不因文档深化变为ready；受影响positive仍blocked |

## 6. 设计取舍

采用技术模块主轴+七U交叉映射；不采用七U七crate/微服务，也不照搬Governance jobs成员。仅按层总表而无独立模块卡不足以校验暴露面，故每模块单独审查。

## 7. 结构化中间产物

### 模块总览

| 模块 | 实现单元 | 责任 | 暴露 | 允许依赖 |
|---|---|---|---|---|
| contracts | crates/contracts / planned | 本地共享词汇、21C/16Q/12J及完整安全结果/视图 | DTO/ref/state/view/error | Core contracts仅context/protocol子模块 |
| domain | crates/domain / planned | 局部truth、引用组合、纯guard、状态迁移 | 实体/immutable record/policy；状态引用contracts唯一定义 | contracts::value_objects/states/errors |
| application | crates/application / planned | 七Service及49用例、scope/replay/UoW/必要durable work | 三Entry/facade、usecase、required ports、runner | contracts/domain/Core |
| infra | crates/infra / planned | PG typed存储、SDK外部转换、runtime/fake | adapter/config/runtime builder | contracts/domain/application/Core/SDK |
| api | crates/api / planned | HTTP解析、可信actor/meta注入、安全错误映射 | 37个同步入口handler/routes | contracts/application/infra/Core/Axum |
| worker | crates/worker / planned | 12内部Job调度、shutdown、lease，不做业务决策 | scheduler/job_dispatch/shutdown | contracts/application/infra/Core/Tokio |
| web | apps/web / planned | 目录/发布/分发/撤回/publisher/审计恢复展示与意图 | typed API client/pages/composables/locales | HTTP contracts镜像、Vue/TS |

### 模块依赖ASCII图

```text
web --HTTP--> api --call--> application --pure call--> domain
               |                 |                     |
           assembly         required ports         type-only
               v                 ^                     v
             infra --implements-+                    contracts
               |                                       |
        PG / SDK adapters                  context/protocol -> Core
worker --call--> application
  | assembly
  +-----------> infra
```

箭头注明调用/装配/编译差异；application不编译依赖infra，domain只import纯词汇子模块。没有api↔worker依赖、Bus lane、jobs成员。Core与SDK根path沿Step4，不把九owner目录变成Cargo path。

### contracts 独立模块卡

| 项 | 契约 |
|---|---|
| 对应概要 | 02§4/5/7；本地共享词汇、21C/16Q/12J及完整安全结果/视图 |
| 主要责任 | 本地共享词汇、21C/16Q/12J及完整安全结果/视图 |
| 对外暴露 | DTO/ref/state/view/error |
| 允许依赖 | Core contracts仅context/protocol子模块 |
| 禁止依赖 | domain/application/infra/api/worker/SDK/SQL |
| 文件与主体 | value_objects/states=context-free；context/worker_protocol=Core wrappers |

| planned文件 | 主体 | 责任 |
|---|---|---|
| `crates/contracts/Cargo.toml` | marketplace-contracts package与限定依赖 | member workspace=true，不照抄root相对path |
| `crates/contracts/src/lib.rs` | 导出type-only协议模块，不组装runtime | type-only协议；唯一来源，no domain/SDK/SQLruntime |
| `crates/contracts/src/value_objects.rs` | 本地typed ID/ref/revision/cursor等纯词汇；不可冒称owner导出 | type-only协议；唯一来源，no domain/SDK/SQLruntime |
| `crates/contracts/src/states.rs` | 本地carrier state词汇单一来源；无迁移或外部approval定义 | type-only协议；唯一来源，no domain/SDK/SQLruntime |
| `crates/contracts/src/context.rs` | 引用Core actor/metadata的入口与worker wrapper形状，不重复key/trace | type-only协议；唯一来源，no domain/SDK/SQLruntime |
| `crates/contracts/src/worker_protocol.rs` | 12内部Job请求/完整逐itemreport/有限结果与错误 | type-only协议；唯一来源，no domain/SDK/SQLruntime |
| `crates/contracts/src/errors.rs` | 安全public error/disposition词汇，不回传raw SDK/DB错误 | type-only协议；唯一来源，no domain/SDK/SQLruntime |
| `crates/contracts/src/source_responsibility.rs` | U1 Command/Query/Result/View协议；不持有领域对象或owner正文 | type-only协议；唯一来源，no domain/SDK/SQLruntime |
| `crates/contracts/src/publication_review.rs` | U2 Command/Query/Result/View协议；不持有领域对象或owner正文 | type-only协议；唯一来源，no domain/SDK/SQLruntime |
| `crates/contracts/src/catalog_version.rs` | U3 Command/Query/Result/View协议；不持有领域对象或owner正文 | type-only协议；唯一来源，no domain/SDK/SQLruntime |
| `crates/contracts/src/distribution.rs` | U4 Command/Query/Result/View协议；不持有领域对象或owner正文 | type-only协议；唯一来源，no domain/SDK/SQLruntime |
| `crates/contracts/src/withdrawal_notice.rs` | U5 Command/Query/Result/View协议；不持有领域对象或owner正文 | type-only协议；唯一来源，no domain/SDK/SQLruntime |
| `crates/contracts/src/audit_recovery.rs` | U6 Command/Query/Result/View协议；不持有领域对象或owner正文 | type-only协议；唯一来源，no domain/SDK/SQLruntime |
| `crates/contracts/src/reference_read.rs` | U7 Command/Query/Result/View协议；不持有领域对象或owner正文 | type-only协议；唯一来源，no domain/SDK/SQLruntime |

capability先按本地共享词汇、21C/16Q/12J及完整安全结果/视图划分；对象schema由Step6闭口，Port由Step7闭口，协议/flow由Step8/9闭口。当前模块不能把本地结果当外部approval/installed/delivered/Obs evidence。错误以本层安全有限分类映射，不透传SQL/SDK/rawbody。

测试切口：字段decode、错误安全化、完整result roundtrip。本模块停审：职责、暴露、禁止方向与Step4路径可追溯；外部positive资格未关闭。

### domain 独立模块卡

| 项 | 契约 |
|---|---|
| 对应概要 | 02§4/5/7；局部truth、引用组合、纯guard、状态迁移 |
| 主要责任 | 局部truth、引用组合、纯guard、状态迁移 |
| 对外暴露 | 实体/immutable record/policy；状态引用contracts唯一定义 |
| 允许依赖 | contracts::value_objects/states/errors |
| 禁止依赖 | Core/SDK/application/infra/SQL/HTTP/Tokio；contracts context |
| 文件与主体 | 43对象按七U拆文件；view为contracts映射，不入domain Core |

| planned文件 | 主体 | 责任 |
|---|---|---|
| `crates/domain/Cargo.toml` | marketplace-domain package与限定依赖 | member workspace=true，不照抄root相对path |
| `crates/domain/src/lib.rs` | 导出同步领域aggregate/record/policy | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/source_binding.rs` | re-export contracts SourceBinding/MaterialReference；SourceVerification与来源guard | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/publisher_relation.rs` | PublisherRelation/SourceGatePolicy；release当前资格失效 | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/publication_basis.rs` | immutable PublicationBasis与固定basis不变量 | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/publication_application.rs` | PublicationApplication draftspec/factory/提交固定basis | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/review_handoff.rs` | ReviewHandoff/GovernanceDecisionBinding/ReviewBindingPolicy，不产生approval | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/marketplace_listing.rs` | MarketplaceListing局部metadata，不复制资产正文 | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/market_version.rs` | MarketVersion/VersionAdmissionPolicy与Staged/Listed/Restricted/Withdrawn | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/category.rs` | Category与目录分类不变量，不作owner资产kind | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/distribution_intent.rs` | DistributionIntent/AcquisitionGatePolicy；本地受理/取消 | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/distribution_attempt.rs` | DistributionAttempt/ReceiverOutcomeBinding；attempt效果独立于取消 | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/distribution_relation.rs` | DistributionRelation市场分发关系，不等installed | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/withdrawal_impact.rs` | WithdrawalDisposition/ImpactRecord/WithdrawalImpactPolicy与knownscope | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/notice_intent.rs` | NoticeIntent/NoticeOutcomeBinding；Confirmed不等read/delivered | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/operation_record.rs` | OperationContext/OperationRecord；StoredOperationResult re-export contracts immutable result | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/market_audit_record.rs` | append-only MarketAuditRecord，不等Obsreceipt | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/deferred_work.rs` | DeferredWork状态/claim/fence规则，不含schedulerI/O | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/recovery_intent.rs` | RecoveryIntent/ObservationOutcomeBinding/RecoveryPolicy | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/qualified_reference_snapshot.rs` | TypedOwnerReference/QualifiedReferenceSnapshot本体+state/ReadBoundaryPolicy | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/read_projection.rs` | ReadProjection/QualifiedReadContext，派生身份/typed rebuild规则 | 纯同步构造/guard/transition/rehydrate，无I/O或config |

capability先按局部truth、引用组合、纯guard、状态迁移划分；对象schema由Step6闭口，Port由Step7闭口，协议/flow由Step8/9闭口。当前模块不能把本地结果当外部approval/installed/delivered/Obs evidence。错误以本层安全有限分类映射，不透传SQL/SDK/rawbody。

测试切口：state所有pair；owner正文拒绝；guard无I/O。本模块停审：职责、暴露、禁止方向与Step4路径可追溯；外部positive资格未关闭。

### application 独立模块卡

| 项 | 契约 |
|---|---|
| 对应概要 | 02§4/5/7；七Service及49用例、scope/replay/UoW/必要durable work |
| 主要责任 | 七Service及49用例、scope/replay/UoW/必要durable work |
| 对外暴露 | 三Entry/facade、usecase、required ports、runner |
| 允许依赖 | contracts/domain/Core |
| 禁止依赖 | infra/api/worker/直接SDK/PG/HTTP |
| 文件与主体 | entries/command_runner/job_runner/read_facade、ports与七模块 |

| planned文件 | 主体 | 责任 |
|---|---|---|
| `crates/application/Cargo.toml` | marketplace-application package与限定依赖 | member workspace=true，不照抄root相对path |
| `crates/application/src/lib.rs` | 导出三Entry、七Service编排与port，不调用具体SDK/SQL | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/entries.rs` | MarketCommandEntry/MarketQueryEntry/MarketWorkerEntry typed dispatch | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/operation_context.rs` | Core上下文到本地OperationContext转换与唯一authority核验 | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/command_runner.rs` | command共同受理/原结果/同UoW写集调用顺序 | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/job_runner.rs` | 内部Job claim/fence/逐itemreport/原结果编排 | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/read_facade.rs` | Query currentvisibility/disclosure与no-write | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/intent_fingerprint.rs` | 版本化canonical intent；不重算OwnerAssetDigest | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/mod.rs` | 导出内侧ownedtraits | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/market_store.rs` | MarketStorePort typed mutable/immutable save/get/bykey | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/operation_store.rs` | OperationStorePort reserve/fullresult/load/conflict | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/audit_store.rs` | AuditStorePort append/typed safe read | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/work_store.rs` | WorkStorePort claim/fence/permission/durable responsibility | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/snapshot_store.rs` | SnapshotStorePort typed material+state save/get | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/projection_store.rs` | ProjectionStorePort identity/cursor/shadow/typed views | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/source_owner.rs` | SourceOwnerPort正式immutable source required能力 | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/publisher_authority.rs` | PublisherAuthorityPort主体/关系资格required能力 | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/material_authority.rs` | MaterialAuthorityPort签名/扫描引用适用与有效性 | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/governance.rs` | GovernancePort正式decision/fullbinding/probe required能力 | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/scope_resolver.rs` | ScopeResolverPort trustedref→scope/disclosure | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/receiver.rs` | ReceiverPort原intent/outcome/probe required能力 | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/notice_channel.rs` | NoticeChannelPort正式target/channel/outcome/probe | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/observation.rs` | ObservationPort producer资格/receipt/probe | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/unit_of_work.rs` | MarketUow/transactionrunner typedcommit/failure责任 | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/errors.rs` | application有限错误与安全拒绝/unknown/blocked映射 | 内侧ownedcallable，完整签名等获授权Step5～7校准 |

capability先按七Service及49用例、scope/replay/UoW/必要durable work划分；对象schema由Step6闭口，Port由Step7闭口，协议/flow由Step8/9闭口。当前模块不能把本地结果当外部approval/installed/delivered/Obs evidence。错误以本层安全有限分类映射，不透传SQL/SDK/rawbody。

测试切口：全结果replay、事务rollback、unknown probe、Query无写。本模块停审：职责、暴露、禁止方向与Step4路径可追溯；外部positive资格未关闭。

### infra 独立模块卡

| 项 | 契约 |
|---|---|
| 对应概要 | 02§4/5/7；PG typed存储、SDK外部转换、runtime/fake |
| 主要责任 | PG typed存储、SDK外部转换、runtime/fake |
| 对外暴露 | adapter/config/runtime builder |
| 允许依赖 | contracts/domain/application/Core/SDK |
| 禁止依赖 | api/worker；domain guard替代、生产fake fallback |
| 文件与主体 | postgres/sdk/fake/runtime_config/runtime_builder |

| planned文件 | 主体 | 责任 |
|---|---|---|
| `crates/infra/Cargo.toml` | marketplace-infra package与限定依赖 | member workspace=true，不照抄root相对path |
| `crates/infra/src/lib.rs` | 导出显式外层组装，不把fakes作为default | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/runtime_config.rs` | RuntimeConfig/validator形状；exactkey/profile由04 | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/runtime_builder.rs` | API/Worker dependencywiring，缺合同failclosed | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/telemetry.rs` | 脱敏runtime日志/metric/trace，不替业务audit | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/postgres/mod.rs` | PostgresMarketAdapter与连接/transaction映射 | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/postgres/unit_of_work.rs` | SQLx单localtransaction与commit错误映射 | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/postgres/market_store.rs` | 领域对象typed save/get/bykey/CAS映射 | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/postgres/operation_store.rs` | operation唯一性/fullresult typedcodec与读取 | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/postgres/audit_store.rs` | safeaudit append/read映射 | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/postgres/work_store.rs` | 耐久work/claim/fence/permissiontyped保存 | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/postgres/snapshot_store.rs` | qualifiedsnapshot typed本体+state保存/读取 | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/postgres/projection_store.rs` | scopeboundtypedview/shadow/cursor替换 | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/postgres/catalog_search.rs` | 参数化过滤/search/分页索引访问，无owner正文 | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/postgres/row_codec.rs` | DB row到typed载体/rehydrate校验，不万能JSONload | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/sdk/mod.rs` | SdkOwnerAdapters总导出，不公开owner直连 | 仅SDKformalbinding/blocked，禁止privateownerfallback |
| `crates/infra/src/sdk/source_owner_adapter.rs` | SourceOwnerPort→正式SDKoperation逐类型qualification | 仅SDKformalbinding/blocked，禁止privateownerfallback |
| `crates/infra/src/sdk/publisher_authority_adapter.rs` | publisherauthorityslot，owner未明返回blocked | 仅SDKformalbinding/blocked，禁止privateownerfallback |
| `crates/infra/src/sdk/material_authority_adapter.rs` | 材料requiredport→正式SDK支持/blocked | 仅SDKformalbinding/blocked，禁止privateownerfallback |
| `crates/infra/src/sdk/governance_adapter.rs` | approved完整binding与原意图probe；无自裁 | 仅SDKformalbinding/blocked，禁止privateownerfallback |
| `crates/infra/src/sdk/scope_resolver_adapter.rs` | 正式scope/disclosure requiredslot，no localauthfallback | 仅SDKformalbinding/blocked，禁止privateownerfallback |
| `crates/infra/src/sdk/receiver_adapter.rs` | exactversion/intent/effect/probe，缺支持不发 | 仅SDKformalbinding/blocked，禁止privateownerfallback |
| `crates/infra/src/sdk/notice_channel_adapter.rs` | target/channel/outcome/probe，缺支持不造送达 | 仅SDKformalbinding/blocked，禁止privateownerfallback |
| `crates/infra/src/sdk/observation_adapter.rs` | producer/receipt资格与safeaudit交接 | 仅SDKformalbinding/blocked，禁止privateownerfallback |
| `crates/infra/src/fake/mod.rs` | dev/test显式fixture组装，生产不得导出fallback | dev/testonly，语义不得强于真实port |
| `crates/infra/src/fake/local_store.rs` | 所有localport同UoW失败/重放/CAS语义的inmemory实现 | dev/testonly，语义不得强于真实port |
| `crates/infra/src/fake/owner_ports.rs` | typed formalfixture/gap/unknown/lateoutcome场景；非真实owner | dev/testonly，语义不得强于真实port |

capability先按PG typed存储、SDK外部转换、runtime/fake划分；对象schema由Step6闭口，Port由Step7闭口，协议/flow由Step8/9闭口。当前模块不能把本地结果当外部approval/installed/delivered/Obs evidence。错误以本层安全有限分类映射，不透传SQL/SDK/rawbody。

测试切口：fake/PG parity、SDK contract gating、redaction。本模块停审：职责、暴露、禁止方向与Step4路径可追溯；外部positive资格未关闭。

### api 独立模块卡

| 项 | 契约 |
|---|---|
| 对应概要 | 02§4/5/7；HTTP解析、可信actor/meta注入、安全错误映射 |
| 主要责任 | HTTP解析、可信actor/meta注入、安全错误映射 |
| 对外暴露 | 37个同步入口handler/routes |
| 允许依赖 | contracts/application/infra/Core/Axum |
| 禁止依赖 | domain/store/UoW/worker/直接owner |
| 文件与主体 | routes/trusted_context/response_mapping/seven handlers |

| planned文件 | 主体 | 责任 |
|---|---|---|
| `crates/api/Cargo.toml` | marketplace-api package与限定依赖 | member workspace=true，不照抄root相对path |
| `crates/api/src/main.rs` | marketplace-api进程启动与关闭，读取配置/组装 | entry mapping/currentcontext，不执行domainguard或任意Job |
| `crates/api/src/routes.rs` | 获准publicCommand/Queryroute注册，不公开12Job | entry mapping/currentcontext，不执行domainguard或任意Job |
| `crates/api/src/trusted_context.rs` | trusted入口上下文校验/构造，caller不能自填qualified | entry mapping/currentcontext，不执行domainguard或任意Job |
| `crates/api/src/response_mapping.rs` | typedresult/error→safe HTTPdisposition，结果种类不混 | entry mapping/currentcontext，不执行domainguard或任意Job |
| `crates/api/src/handlers/source_responsibility.rs` | U1入口DTOdecode/currentcontext/dispatch，no domaintruth | entry mapping/currentcontext，不执行domainguard或任意Job |
| `crates/api/src/handlers/publication_review.rs` | U2入口DTOdecode/currentcontext/dispatch，no domaintruth | entry mapping/currentcontext，不执行domainguard或任意Job |
| `crates/api/src/handlers/catalog_version.rs` | U3入口DTOdecode/currentcontext/dispatch，no domaintruth | entry mapping/currentcontext，不执行domainguard或任意Job |
| `crates/api/src/handlers/distribution.rs` | U4入口DTOdecode/currentcontext/dispatch，no domaintruth | entry mapping/currentcontext，不执行domainguard或任意Job |
| `crates/api/src/handlers/withdrawal_notice.rs` | U5入口DTOdecode/currentcontext/dispatch，no domaintruth | entry mapping/currentcontext，不执行domainguard或任意Job |
| `crates/api/src/handlers/audit_recovery.rs` | U6入口DTOdecode/currentcontext/dispatch，no domaintruth | entry mapping/currentcontext，不执行domainguard或任意Job |
| `crates/api/src/handlers/reference_read.rs` | U7入口DTOdecode/currentcontext/dispatch，no domaintruth | entry mapping/currentcontext，不执行domainguard或任意Job |
| `crates/api/src/handlers/mod.rs` | 导出获准handlers | entry mapping/currentcontext，不执行domainguard或任意Job |

capability先按HTTP解析、可信actor/meta注入、安全错误映射划分；对象schema由Step6闭口，Port由Step7闭口，协议/flow由Step8/9闭口。当前模块不能把本地结果当外部approval/installed/delivered/Obs evidence。错误以本层安全有限分类映射，不透传SQL/SDK/rawbody。

测试切口：missing key、actor spoof、scope、HTTP mapping。本模块停审：职责、暴露、禁止方向与Step4路径可追溯；外部positive资格未关闭。

### worker 独立模块卡

| 项 | 契约 |
|---|---|
| 对应概要 | 02§4/5/7；12内部Job调度、shutdown、lease，不做业务决策 |
| 主要责任 | 12内部Job调度、shutdown、lease，不做业务决策 |
| 对外暴露 | scheduler/job_dispatch/shutdown |
| 允许依赖 | contracts/application/infra/Core/Tokio |
| 禁止依赖 | api/domain/store直写、outbox/bus consumer |
| 文件与主体 | scheduler只触发application内部Job，不新增jobs crate |

| planned文件 | 主体 | 责任 |
|---|---|---|
| `crates/worker/Cargo.toml` | marketplace-worker package与限定依赖 | member workspace=true，不照抄root相对path |
| `crates/worker/src/main.rs` | marketplace-worker常驻进程，配置/组装/关停 | bounded常驻任务，不以leaseexpiry/关停判未提交 |
| `crates/worker/src/scheduler.rs` | 有界claim/并发/lease/fence调度，不直接改domain | bounded常驻任务，不以leaseexpiry/关停判未提交 |
| `crates/worker/src/job_dispatch.rs` | 12内部jobrequest到MarketWorkerEntry，report处理 | bounded常驻任务，不以leaseexpiry/关停判未提交 |
| `crates/worker/src/shutdown.rs` | inflight许可/取消/unknown责任保留，不将关停当未发 | bounded常驻任务，不以leaseexpiry/关停判未提交 |

capability先按12内部Job调度、shutdown、lease，不做业务决策划分；对象schema由Step6闭口，Port由Step7闭口，协议/flow由Step8/9闭口。当前模块不能把本地结果当外部approval/installed/delivered/Obs evidence。错误以本层安全有限分类映射，不透传SQL/SDK/rawbody。

测试切口：fence旧worker、断电/unknown、bounded batch。本模块停审：职责、暴露、禁止方向与Step4路径可追溯；外部positive资格未关闭。

### web 独立模块卡

| 项 | 契约 |
|---|---|
| 对应概要 | 02§4/5/7；目录/发布/分发/撤回/publisher/审计恢复展示与意图 |
| 主要责任 | 目录/发布/分发/撤回/publisher/审计恢复展示与意图 |
| 对外暴露 | typed API client/pages/composables/locales |
| 允许依赖 | HTTP contracts镜像、Vue/TS |
| 禁止依赖 | DB/SDK owner直读、business gate/approval、secret持有 |
| 文件与主体 | protocol/runtimevalidation、pages、EN/ZH |

| planned文件 | 主体 | 责任 |
|---|---|---|
| `apps/web/package.json` | marketplace-web依赖/构建与测试入口planned | 展示/意图/typed协议，不是ownertruth |
| `apps/web/tsconfig.json` | strictTS配置，无tsignore兜底 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/vite.config.ts` | SPA构建/devprofile，不继承9090生产默认 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/index.html` | Vue真实应用挂载页，不是本轮HTMLdemo | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/main.ts` | App/router/i18n初始化 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/App.vue` | 应用shell与导航，无truthstore | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/router.ts` | 目录/详情/申请/分发/撤回/审计/publisher/设置视图 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/api/marketplace_client.ts` | typedMarketplaceAPI访问与错误/unknown处理，不直连owners | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/api/protocol.ts` | 正式Step8协议的TS映射，无手造第二schema | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/api/response_validation.ts` | runtimefinitevariant/optional验证，缺少形状安全失败 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/i18n/index.ts` | defaulten/zh切换，仅展示locale | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/i18n/en.json` | 英文展示资源 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/i18n/zh.json` | 中文展示资源 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/components/MarketStatusBadge.vue` | 有限carrier与freshness/disposition分别呈现 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/components/OwnerReferenceSummary.vue` | safeimmutable ref/version/digest/visibility，no body | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/components/LanguageSwitch.vue` | EN/ZH切换不改业务意图 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/components/MarketAsyncState.vue` | loading/empty/rejected/unknown/stale/degraded统一呈现 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/views/MarketCatalogPage.vue` | 分类/filter/search/count在同scope下展示 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/views/MarketListingPage.vue` | listing/versions/selection/eligibility展示与获取意图 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/views/MarketPublicationPage.vue` | safe draft/提交/正式review进度，不显示本地审批按钮 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/views/MarketDistributionPage.vue` | intent/attempt/outcome分轴、取消不假卸载 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/views/MarketWithdrawalPage.vue` | restriction/withdraw/knownimpact/notice分轴 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/views/MarketAuditRecoveryPage.vue` | safeaudit/完整原结果/恢复进度，不冒称ready | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/views/MarketPublisherPage.vue` | relation/source/material资格与gap，no mockverified | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/composables/useMarketQuery.ts` | query加载/取消/失效隔离，不触发后端维护 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/composables/useMarketCommand.ts` | 保存同意图key/完整结果，timeout不换key盲重发 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/tests/marketplace_protocol_tests.ts` | DTOruntimevalidation与safeerror/unknown显示 | 仅计划测试，不代表run/evidence |
| `apps/web/tests/marketplace_locale_tests.ts` | 双语不改变状态/ref/key | 仅计划测试，不代表run/evidence |
| `apps/web/tests/marketplace_workflow_tests.ts` | UI意图/禁用/empty/lateoutcome状态映射 | 仅计划测试，不代表run/evidence |

capability先按目录/发布/分发/撤回/publisher/审计恢复展示与意图划分；对象schema由Step6闭口，Port由Step7闭口，协议/flow由Step8/9闭口。当前模块不能把本地结果当外部approval/installed/delivered/Obs evidence。错误以本层安全有限分类映射，不透传SQL/SDK/rawbody。

测试切口：加载/empty/stale/missing/403；语言不改业务key。本模块停审：职责、暴露、禁止方向与Step4路径可追溯；外部positive资格未关闭。

### 七U到技术模块映射

| U | application模块 | contracts/domain承接 | infra协作 | 入口与UI |
|---|---|---|---|---|
| U1 来源/发布责任 | source_responsibility / 4用例 | 本U对象与typed协议 | typed PG stores + formal SDK adapters；无新owner | api 4 / worker 0；Web只展示/发意图 |
| U2 申请/正式审核交接 | publication_review / 8用例 | 本U对象与typed协议 | typed PG stores + formal SDK adapters；无新owner | api 6 / worker 2；Web只展示/发意图 |
| U3 目录/市场版本 | catalog_version / 10用例 | 本U对象与typed协议 | typed PG stores + formal SDK adapters；无新owner | api 10 / worker 0；Web只展示/发意图 |
| U4 受控分发 | distribution / 7用例 | 本U对象与typed协议 | typed PG stores + formal SDK adapters；无新owner | api 5 / worker 2；Web只展示/发意图 |
| U5 撤回/影响/通知 | withdrawal_notice / 9用例 | 本U对象与typed协议 | typed PG stores + formal SDK adapters；无新owner | api 6 / worker 3；Web只展示/发意图 |
| U6 审计/恢复 | audit_recovery / 7用例 | 本U对象与typed协议 | typed PG stores + formal SDK adapters；无新owner | api 4 / worker 3；Web只展示/发意图 |
| U7 引用/snapshot/索引 | reference_read / 4用例 | 本U对象与typed协议 | typed PG stores + formal SDK adapters；无新owner | api 2 / worker 2；Web只展示/发意图 |

### 归属、闭口与复杂度

DTO/view及state唯一在contracts；domain entity/record/policy、application ports/runners、infra adapters、api handlers、worker scheduler、webclient无重复truth。215planned路径继续使用Step4；重对象/协议/flow需要后续模块附录，本Step七卡可单文件审查。跨模块审计：六Rust+Web主轴与七U正交；不复制Governance的jobs/outbox/Archive；没有未分配handler/repository。



### Step9回修与审查记录

SourceVerification.publisher_ref、NoticeIntent.scope_ref、Category.scope_ref已在完整schema/Row/factory输入承接；QualifiedObservationOutcome回填为outcome_ref/operation_ref/audit_refs/scope_ref，不误用RecoveryRequirements。Immutable组合词汇与StoredOperationResult迁至contracts单authority，原domain只re-export，不让safe public结果泄漏domain-only类型。Versioned.revision为单持久列，显式entity revision只是同列镜像；JobCheckpoint、联合ImpactScanItem、projection manifest无独立新lifecycle。具体受影响schema以Step6 shared_types、Step7 application_callables为准。此次仅文档反向闭环，不变更owner资格/实现状态。

## 8. 候选正式草稿

候选正式§5主轴：contracts/domain/application/infra/api/worker/web；逐模块按职责→路径→capability→对象→Port→关键函数→错误→测试展开。§7卡与七U表为摘录来源；Step6/7随后补对象/接缝，当前不装配。

## 9. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01及受影响Hub/Images/Obs/SDK资格仍pending/blocked；本地候选不冒充owner确认。Billing/支付/订阅/分成/跨境均future/blocker，Archive无active lane。

## 10. 自检与下一门禁

自检完成：七卡与215planned路径一一承接，37同步/12Job=49，无反向依赖或七U新服务。只文档审查，外部资格blocked。内部停审通过，用户授权内进入Step6；Step10结束停止，无需提交commit。
