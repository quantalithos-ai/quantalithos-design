# 02 Step 4：代码主体框架总览

## 1. Step状态

开工：用户已确认01并授权全部02；Step 4 completed，formal未装配。仅当前agent。

Step内计划：P1读取输入 → P2逐题回答 → P3诊断 → P4前后比较 → P5取舍 → P6结构化 → P7回填草稿 → P8自检/停审。P1～P8已分批完成。

模块门禁：本Step独立收束后才允许下一Step。

## 2. 本步输入

当前正式00§9～16、01§6～17；本Step对应SOP与书写规范。前一Step的问题回答/诊断/取舍/待确认事项：02_hld_step_03_constraints.md。旧02未作为推导依据。

## 3. SOP问题回答

1. 架构层已经收稳的模块，分别应落到哪些代码主体骨架上？

答：U1→SourceResponsibilityService，U2→PublicationReviewService，U3→CatalogVersionService，U4→DistributionService，U5→WithdrawalNoticeService，U6→AuditRecoveryService，U7→ReferenceReadService。

2. 哪些主体属于 Inbound / Operations，哪些属于 Application Services？

答：Inbound为MarketCommandEntry/MarketQueryEntry/MarketWorkerEntry；Web是消费端；七Service为application编排，不把鉴权或业务规则放UI。

3. 哪些主体属于 Domain Model，哪些属于 Ports / Persistence / Projection / Outbox？

答：Domain是publisher/application/listing/version/distribution/withdrawal/notice及policy；内侧ports表达local UoW/ref resolver/owner能力，外侧SDK与Postgres adapters承载。

4. 哪些名称必须在概要设计层先点名，否则详细设计会重新发明主语？

答：七Service、统一OperationContext、受理事务边界、typed result保存读取、source/Gov/receiver ports和projection identity必须点名，避免03发明万能MarketManager。

5. 哪些内容已经是代码目录、文件路径或框架实现，不应在本步展开？

答：不写crate/module目录、HTTP路由、schema、ORM类与索引DDL；Rust/Vue/PG只有已确认方向，具体库后移03。

## 4. 当前文档问题诊断

01§6七单元不可等同七进程；01§8内侧消费能力必须与外侧adapter区分，避免Domain依赖SDK/数据库。01§9完整原结果要求独立save/get主体，不能只存receipt。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 主体 | 01 U1～7架构责任 | 七Service+三Entry+typed ports/adapters | 03可承接主语 |
| 层级 | 外部能力消费 | 内側required port/外側SDK明确分开 | 核心不依赖owner实现 |
| reliability | 架构原结果与任务承诺 | Operation/Work/Audit save-get主体 | 防receipt-only恢复 |

## 6. 设计取舍

采用模块化领域+明确application ports的向内依赖；拒绝七微服务/万能service/repository直接SQL改状态。端口是能力契约不是领域对象；事件outbox当前不建。

## 7. 结构化中间产物

#### 架构模块到代码主体映射图

```text
L6-marketplace (one ownership boundary)
+-- U1 Source / Publisher -> SourceResponsibilityService + source policies
+-- U2 Application / Review -> PublicationReviewService + fixed basis
+-- U3 Listing / Version -> CatalogVersionService + market disposition
+-- U4 Distribution -> DistributionService + intent / relation / attempt
+-- U5 Withdrawal / Notice -> WithdrawalNoticeService + known impact
+-- U6 Audit / Recovery -> AuditRecoveryService + atomic responsibility
+-- U7 Reference / Read -> ReferenceReadService + qualified shadow / index
```

- U是语义责任而非七个进程、crate或owner资产副本。
- U3/U4/U5共享市场版本序列化边界；U6承接每次变化，不负责替外部裁决。
- Web/API/Worker可分别交付；CLI若后续接入只复用同API契约。

#### 实现分层视图

```text
Vue / TypeScript Web      Future publishing CLI
          |                       |
          +---- Market API -------+
                    |
    MarketCommandEntry / MarketQueryEntry
    MarketWorkerEntry (durable work)
                    |
      Application Services (U1 ... U7)
                    |
     Domain Objects + Local Policies
                    |
       Required Ports (inside-owned)
          ^                     ^
          |                     |
Postgres Adapter       SDK Owner Adapters
local truth / result    formal runtime owners
task / snapshot / index
```

- 请求箭头向下仅表达入口到内侧；adapter向上表示实现内侧port，不表示Domain依赖adapter。
- Domain不读取运行配置、不调用SDK/SQL；application组装已核验typed输入和UoW。
- 本地图是代码主体关系，不是网络时序、部署目录或完整函数链。

| 项 | 说明 |
|---|---|
| 业务轴 | 七U的responsibility，不按UI页面/SQL表/外部owner服务重新划分 |
| 承载轴 | Rust API同步受理/只读，Rust Worker推进耐久任务；Vue/TS Web展示/发意图，locale不影响ref/状态 |
| 入口主体 | MarketCommandEntry/MarketQueryEntry/MarketWorkerEntry；统一authority及metadata，没有“后台免审核” |
| 核心主体 | 七Service+对应Domain/policy；command与query分开，读取不生成写任务 |
| 内側持久port | MarketStorePort、OperationStorePort、AuditStorePort、WorkStorePort、SnapshotStorePort、ProjectionStorePort；typed save/get/append/read，不万能JSON存储 |
| 外部required port | SourceOwnerPort、PublisherAuthorityPort、MaterialAuthorityPort、GovernancePort、ScopeResolverPort、ReceiverPort、NoticeChannelPort、ObservationPort |
| adapter主体 | SdkSourceAdapter/SdkGovernanceAdapter等按正式支持接入；PostgresMarketAdapter承载局部UoW；未闭合者返回ContractBlocked，不回退私有接口 |
| 当前不用的主体 | Billing writer、Archive exporter/restore receiver、asset body store、market event producer/outbox均不建立 |
| 后续技术选择 | 03选择HTTP/ORM/driver及Postgres检索实现并验证中文与分页，不添加独立搜索/缓存产品为首期硬前置 |

复杂度：主体分层轴与业务轴正交，两个必备图足够；对象由Step5 capability发现后Step6独立正式化。

## 8. 回填草稿

正式§4仅摘录本文件§7及已pass部分附录，不带问题/诊断/历史审计；不新增结论。

## 9. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01沿01保留，仅受影响正向lane blocked；不是owner已确认或已发送请求。

## 10. 进入下一步条件

P1～P8均完成；内部stop_review/pass。两图ASCII、无目录树/完整签名；outbox未凭空启用，当前技术遵01。 外部资格不关闭，允许进入Step 5。
