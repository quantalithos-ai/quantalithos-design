# 03 Step 3：收稳编码规范、语言 / runtime、仓库约束

## 1. Step状态

开工确认：2026-10-01；full-restart / single-agent；授权仅Step1～4。当前 completed / selfcheck_done，gate_status=pass（仅本Step设计产物）。输出：03_ddd_step_03_coding_constraints.md；未来回填正式§3，当前不得修改正式03。已读通用规范、详细SOP当前Step、书写规范对应章节和前序输入。

### Step内计划

| 单元 | 产物位置 | 状态 |
|---|---|---|
| P1读取输入 | §2 | done |
| P2问题回答 | §3 | done |
| P3诊断 | §4 | done |
| P4取舍与前后比较 | §5/6 | done |
| P5结构化 | §7 | done |
| P6复杂度判断 | §7末 | done |
| P7回填草稿 | §8 | done |
| P8自检与停审 | §10 | done |

## 2. 本步输入

前序：[Step2](03_ddd_step_02_scope.md)§3/4/6/7/9、[Step1](03_ddd_step_01_input_boundary.md)。规范：详细SOP Step3、书写规范5.3、[Rust编码](../../../standards/coding/rust.md)源码/rustdoc/命名/格式、[Vue](../../../standards/coding/vue.md)与[TS](../../../standards/coding/typescript.md)必要规则、[实施规范](../../../standards/document/实施计划书写规范.md)§4.9/项目级git配置、闭环§2.2.2/5.1；全局compile/runtime裁剪。
只读reality check：Core/SDK根与contracts/client manifests、SDKclient导出、Core actor/metadata；/home/aris/Projects目录确认marketplace目标仓当前不存在。不创建仓库，不改git配置。

## 3. SOP问题回答

1. 本仓使用什么语言、runtime、框架和主要依赖？

答：正式01/02已选Rust API/Worker、Vue/TS Web、PostgreSQL局部承载。参考Identity现有正式Rust外层约束，本地选择edition2024/MSRV1.93、Tokio1、Axum0.8、SQLx0.8 direct SQL（无额外ORM），Serde1/thiserror2，PG17作为planned验证基线；Web选Vue3 Composition API、TS5、Vite7、VueRouter4/vue-i18n11、Node22.12+。这是设计兼容线，不是已安装/锁定/测试的包版本。精确patch及security/peer compatibility必须在获授权实施前锁文件核验，不伪造lock；生产values仍由04。检索先PG元数据参数化查询与pg_trgm辅助，不以英文FTS证明中文质量；细节由对应index/bindingStep展开。

2. Rust编码规范中哪些内容会影响结构体、错误、trait、async、测试和注释？

答：类型/variant UpperCamelCase，函数/module/file snake_case；Cargo命名按目录专项规范。typed值对象/enum表达不变量和optional，domain同步纯逻辑；application拥有异步port，runtime/SQL/HTTP仅外层。错误用有限typed分层，不用String万能成功/错误；可选thiserror只派生显示，不定义approval/安全披露。测试按功能风险命名并使用与durable相同port语义。Rust规范现行可读内容不包含完整trait/async/错误章节，不把本仓约束假称规范原文；上述边界另来源正式01/02及详细/闭环规范。

3. 是否必须遵守rustdoc风格注释？struct、字段、enum、enum variant、函数分别如何注释？

答：必须。公开crate/module用//!；struct与每字段、enum与每variant（含载荷）、trait/方法/function都用英文///。说明用途、来源/optional/单位、guard/状态效果、side effect、Errors与必要panic/示例。字段注释不能只重复字段名；variant不能省略；DB/owner调用前短注释需指出边界与失败责任。设计中文说明不复制成源码中文注释。

4. 实施者开始前必须阅读哪些提交规范和git config用户要求？

答：必须读实施规范§4.9/项目级git配置、未来正式07§3/提交章节、目标仓更严格规则和合格历史提交。实现仓英文type(scope):subject、英文按子功能分组body/文件改动量、固定Co-Authored-By footer及空行，精确message用git commit -F；design仓中文例外不能迁移到实现。项目级user.name=quantalithos-labs、user.email=quantalithos.ai@gmail.com，不用--global。当前目标仓不存在所以不能宣称其配置已满足；本轮未授权commit也不配置git。

5. 哪些安全、鉴权、网关或外部边界不应在本仓实现？

答：登录/session/token/凭证/密钥truth、人类组织验证、全局authpolicy、网关、Gov裁决、scan/signatureauthority不属本仓。API仍必须验证可信入口上下文并调用formalScope/Publisher requiredport，不能因“不做auth”免校验。缺resolver拒绝positive/安全不可用，无本地mock登录生产fallback。

6. 本仓是否依赖已经实现的Quantalithos仓库？

答：Core/SDK目标目录和源码存在；本轮只检索manifest及必要exports，不宣称其全实现/构建/验收通过。businessowner实际状态按正式文档/ledger裁剪，不以目录存在推ready。

7. 这些依赖中哪些是已确认的编译期依赖？

答：全局矩阵及当前01/02仅Core/SDK。本仓直接需要core-contracts与sdk-client；sdk-contracts只在adapter需要显式请求/结果型时直接声明。SDK自身有bus-contracts等传递依赖，不授权本仓直接依赖Bus/各owner。

8. 依赖仓库在/home/aris/Projects下是否存在？

答：Core与SDK都存在；真实member是Core crates/contracts、SDK crates/client与crates/contracts，package分别core-contracts、sdk-client、sdk-contracts。marketplace目标目录当前不存在。owner仓存在与否不是path资格判断。

9. 对已确认的编译期依赖，当前是否采用本地path dependency？中期是否记录private git tag/rev方案？

答：采用真实sibling member路径，root workspace.dependencies相对根引用，member用workspace=true。中期privategit必须正式URL+固定tag/rev及compatibility后切换；当前无tag/rev事实，不写虚构commit、不以公共crates.io作为前置。

10. 哪些关系只是运行期依赖或事件协作依赖，不能写成Cargo path dependency？

答：九owner经formalSDK/requiredadapter接缝；它们无直接Cargo依赖。当前没有activecanonicalevent，因此不创建busclient/outbox/consumer；candidate关系仅正式schema资格后重开。PG属于基础设施driver，不是owner源码导入。

## 4. 当前文档问题诊断

当前02§3 HC-MP-17和§12留HTTP/driver检索选择给03，故本Step必须给出具体planned兼容线而不是“用Rust即可”。Core真实CommandMetadata.request已承载optional idempotency_key/trace/request/time，不能再复制顶层key；optional key的写入口缺失处理待协议Step固定。SDK现有ServiceClient::read/call是泛化正式facade，不证明市场资产/Gov/receiver的consumerprofile支持。SDK传递Bus不等本仓新增事件。目标仓未建，无manifest/lock/config/compile事实；当前实施规范较旧遵循清单中的中文commit/Claude口径更具体且现行规则冲突，应按现行实施规范英文/Codex，不迁移旧清单。

## 5. 改动前后对比

| 项 | 之前 | 本Step结论 | 原因 |
|---|---|---|---|
| 技术细节 | Rust/Vue/PG方向 | planned兼容线+依赖落点 | 影响源码形态必须收稳 |
| 编译依赖 | Core/SDK仓级名称 | 真实package/member、root相对path | 不凭空import |
| SDK支持 | genericread/call可检索 | owneroperation qualification另挂起 | export不等支持 |
| metadata | Core复用轮廓 | 可检索路径与单authority | 不重复key/trace |
| 提交 | designdirty且未授权 | 当前不提交，未来实施规则明列 | 不污染git或工作区 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| Tokio/Axum/SQLx direct SQL + PG | 贴近Rust正式边界，事务写集可显式审查 | migration/query需严格typed测试 | 采用planned兼容线，不声称运行通过 |
| 全局引入ORM/独立搜索/Redis与queue | 有成熟产品能力 | 无当前吞吐证据，扩大运行依赖且弱化原子写集 | 首期不采用；profile证明需要再受控ADR |
| Vue3 SPA通过本地API，API/Worker经官方SDK访问owners | 展示/意图与truth清楚隔离 | 需后续typed协议、loading/unknown映射 | 采用；不造TSowner绕行 |
| React/Next/Fastify或ownerCargo/privateRPC | draft曾讨论，局部开发容易 | 违反formalRust/Vue/依赖边界 | 不采用 |

## 7. 结构化中间产物

### 编码规范承接表

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| [Rust规范](../../../standards/coding/rust.md)§源码语言/rustdoc/G.NAM.01/P.FMT.01 | 英文源码/测试名/注释，公开struct/字段/enum/每variant/trait/function文档；rustfmt | 对象/DTO/port代码片段必须可直接转为英文Rust；计划rustfmt.toml |
| [目录规范](../../../standards/document/子项目目录与代码文件组织规范.md)§2～8 | 短role目录，packagehyphen/crateunderscore，无层级命名 | Step4统一marketplace slug；专项工程命名优先于Rust规范一般建议 |
| [详细书写规范](../../../standards/document/详细设计书写规范.md)§3/5.3/5.4 | contract不凭空、public文档、入口/port职责明确 | Domain纯同步、async在applicationport与外侧，不先写完整签名 |
| [闭环标准](../../../standards/document/设计真相源闭环与可落码性标准.md)§2.2.2/5.1～5.3 | sharedtype可检索、metadata单authority、完整原结果读取 | 不定义本地ActorContext/CommandMetadata/QueryMetadata副本 |
| [Vue规范](../../../standards/coding/vue.md)A/B/E | CompositionAPI/scriptsetup、组件多词、typedprops、key、单向数据与副作用清理 | Web页面/组件/composable边界，不能用组件状态作后台truth |
| [TS规范](../../../standards/coding/typescript.md)§1/2/5 | 英文描述性命名、UTF8、导出文档、typed边界避免any | Webclient/protocol映射必须runtime校验，不仅as断言 |
| [现行实施规范](../../../standards/document/实施计划书写规范.md)§4.9/项目级Git配置 | 实现英文type(scope):subject、子功能body/文件量、Codexfooter；项目级用户 | 未来实施前必读07/目标规则/合格历史；当前不提交/不配置 |

### Planned技术与实现约束表

以下为设计选择；目标marketplace仓不存在，未创建manifest/lock，未安装或执行兼容测试。patch锁定是实施前阅读/核验门禁，不授权实施者改换框架。

| 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|
| Rust基线 | edition2024、MSRV1.93；Core/SDK根manifest同线，未来需核验所有resolvedcrate MSRV | 六Rustmember、构建工具链 |
| runtime | Tokio1，网络/worker/dbasync；domain无executor/I/O | api/worker/infra，application只表达异步port |
| HTTP | Axum0.8，handler mapping+typeddispatch，不承接domainguard或自己产生approval | api |
| PG访问 | SQLx0.8、PostgreSQL17 planned验证基线；直接参数化SQL，无额外ORM | infra/postgres，后续UoW/migration |
| codec/error | Serde1/serde_json1、thiserror2；DTO受限typed，禁止rawownerbody；JSON序列化不自动等canonicalintent算法 | contracts/domain/application/infra的限定边界 |
| 元数据 | core_contracts::actor::ActorContext；core_contracts::metadata::{CommandMetadata,QueryMetadata,RequestMetadata}已可检索 | contracts/entry/context；key仅commandmeta.request，Jobwrapper后续闭口 |
| localtypederror | 正式domain/application/adapter错误分层；safe publicerror/理由不泄漏secret/body | 后续Step6/8/12；不用SDK错误直接回传UI |
| 当前SDKexport | sdk_client::ClientContext、ServiceClient::read/call及contracts已检索；仅SDKgenericfacade存在 | infra/sdk；perowner consumer/operation binding仍blocked |
| 存储truth | PG仅市场localtruth/result/work/snapshot/projection；sameUoW accepted写集不得异库切割 | infra/application；SDK调用不进跨owner事务 |
| 搜索路线 | PG参数化元数据过滤+escapedsubstring，pg_trgm作为索引辅助；不默认英文FTS承担中文语义、不引入独立search产品 | U3/U7、infra/postgres；Step11/14与04明确query/index/extension权限，05实测中文/pagination |
| Web | Vue3、TS5、Vite7、Router4、vue-i18n11；Node22.12+ plannedbuild基线 | apps/web；无SSR/Next、无财务store/owner直连 |
| Web接入 | Web通过Marketplace APItypedclient，后台owners走SDK；不臆造已发布marketplace npmSDK | Web/API协议后续Step8闭口 |
| 展示locale | defaulten、en/zh；状态/ref/key与locale无关，locale仅国际化资源 | Web；UI不得乐观写approval/installed/delivered |
| 验证工具 | cargo test/doc/fmt/clippy；WebVitest3、VueTestUtils2；Playwright1 E2E planned | 后续Step16/05制定case/gate，无本轮run事实 |
| 鉴权/网关 | 外部owner，不造账号/secret/token；仍要求可信actor与formal scope/publisher resolver | 所有入口；MP-UP-003未关闭不能positive |
| query无写 | scope/visibility交集、结果重放先当前disclosure；query不触发refresh/task | application/infra/Web |
| 不确定效果 | 原intentprobe；known-not-committed才新attempt；取消/withdraw不掩盖late结果 | Worker/U2/U4/U5/U6，后续签名/状态/事务闭口 |
| listener配置 | 原型0.0.0.0:9090不是生产默认，04给profile与入口binding | api runtime；当前不改demo/server |
| unsafe/secret | 默认无unsafe；credentialref而非原值，日志safeallowlist；必要unsafe另设计 | 全Rust/SDK/telemetry |

### 本地多仓依赖约束表（仅compile）

| 依赖仓库 | 全局依赖类型 | 本地默认路径 | 当前引用方式 | 中期引用方式 | 影响的实现单元 |
|---|---|---|---|---|---|
| quantalithos-core | 编译期 | /home/aris/Projects/quantalithos-core | 真实crates/contracts → core-contracts，本地path设计 | privategit固定tag/rev；URL与pin待正式release，不造值 | contracts/application/infra/api/worker按metadata用量 |
| quantalithos-sdk | 编译期 | /home/aris/Projects/quantalithos-sdk | 真实crates/client → sdk-client；必要请求型crates/contracts → sdk-contracts | privategit固定tag/rev，consumercompatibility通过后受控切换 | infra/sdk；入口通过infra wiring，无domain→SDK |

Core根和SDK根都为workspace，不将根当单个package。SDK内部bus-contracts是其传递依赖，不在Marketplace声明Bus直接依赖。以上只读检索并非本地依赖已经装配或Cargocheck通过。

### runtime关系裁剪与qualification

| 项目 / authority | 关系 | 本仓表达 | 禁止 |
|---|---|---|---|
| Method/Hub/Images | runtime viaformalSDK | typedSourceOwnerPort与qualifiedimmutableinput | ownerCargo/body复制/Registry/launchtruth |
| Identity | runtimeAI引用 | safeactor/memberref，humanpublisherowner仍缺 | 自造人类组织auth |
| Governance | runtime正式审核消费 | requiredGovadapter及完整binding | scan/signature/ACK代approval、直依其crate |
| Artifact/材料authority | runtime材料ref | 材料类型/版本/摘要/适用资格 | 扫描/签名结论自行生成 |
| receiver/noticeauthority | runtimeeffect/probe/receipt | requiredport、原意图与结果binding | paid/installed/delivered假成功 |
| Observability | conditionalruntimequalified交接 | localAudit独立、producer/receiptpending | localAudit等Obsreceipt/readiness |
| Archive/Billing | future/absent | 记录缺口，不设activeadapter | Cargo依赖、财务writer、归档restore |
| canonicalevent | 当前无active协作 | 仅future重开条件 | consumer/producer/outbox新增 |

### 仓库与提交前置要求

1. 未来在/home/aris/Projects核验真实sibling package/export与正式baseline；缺类型停止受影响实现，不造同名newtype。
2. targetmarketplace目前不存在，故gituser/lock/build状态都是未检查/未创建，不能写passed。
3. 实施者必须读现行实施规范§4.9、07§3/提交规则、目标更严格规则与合格历史；规则冲突回报，不能用旧遵循清单较宽口径。
4. 项目user.name要求quantalithos-labs、user.email要求quantalithos.ai@gmail.com，只允许项目级；这不是本轮gitconfig修改指令。
5. 无用户明确commit授权不gitadd/commit；既有dirty不回滚、不归并。当前无提交需要。

复杂度判断：本Step是限定技术约束与compile reality，按技术/依赖/安全分表，不展开对象schema/SDK完整字段映射。精确符号签名/qualification属于后续获授权Step，不将“未来Step补细化”写为当前外部可用。

## 8. 回填草稿

### 正式§3候选草稿（未装配）

实现设计采用Rust2024/MSRV1.93、Tokio1/Axum0.8/SQLx0.8、PG17 planned验证线，Vue3/TS5/Vite7 SPA通过typedMarketplace API，后台owners仅经正式SDK。技术/规范/compile/runtime约束采用§7表；这些是计划兼容线而非已安装包或已通过测试。Core共享actor/metadata只有一个authority；SDKgenericread/call存在但不证明各owneroperationconsumer支持。Domain同步纯净，SDK/SQL/HTTP放外层。实施前必须读取Rust/Vue/TS/目录/提交规范和未来07门禁，核验精确lock/MSRV、安全兼容、项目git用户与真实exports；当前没有实现或提交许可。

## 9. 待确认事项

沿MP-UP/SRC/Q保留正向缺口；精确patch/lock/security/MSRV compatibility仅planned，实施前必须核验。Node/Web包选择是本地设计，不改draft。生产PGprofile/pg_trgm准入与中文负载Q-MP-01仍须后续binding/测试；技术选型不证明性能。

## 10. 进入下一步条件

| 自检项 | 结果 |
|---|---|
| 十个SOP问题逐项回答，语言/runtime/framework/依赖落点明确 | pass |
| Core/SDK真实member/package/export检索 | pass（只read-only检索，不是构建） |
| 仅compile入path表，SDK传递Bus未扩为直接依赖 | pass |
| 公开字段/每enumvariant/rustdoc与英文源码规则明确 | pass |
| 项目git配置、英文实现commit/更严格规则/不提交明确 | pass |
| 数据库/框架/版本为planned，无lock/性能/readiness虚构 | pass |
| scope/publisher/approval/receiver等qualification无关闭 | pass |
| 无图、无正式03修改、无私有ownerfallback | pass |

Step3本地设计gate pass，内部停审完成；可按授权读取Step3§3/4/6/7/9、Step4 SOP/规范/目录全文，进入Step4。实际patch lock/build/productionqualification仍等待未来实施门禁，不作为当前已完成事实。
