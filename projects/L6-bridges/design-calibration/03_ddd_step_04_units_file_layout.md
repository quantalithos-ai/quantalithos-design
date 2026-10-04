# L6-bridges 03 Step4：实现单元与文件布局

## 1. Step状态、开工确认与内计划

done / self_review_pass / waiting_user；full-restart / single-agent-serial；拟回填正式03§4，当前正式回填false；Step5因授权上限blocked。

| 开工项 | 记录 |
|---|---|
| 三层许可 | 用户授权至Step4；前序自检pass；只当前Step可写 |
| 通用规范 | 通则/中间产物/真相源适用纪律沿Step1已复核；本步前回读前序门禁 |
| SOP/书写 | 详细SOP Step4 / 书写§5.4与ASCII§4.2已读 |
| 输入 | Step2/3全文及Step1未决；正式02§4/7/12、243项support index全文；详细SOP Step4/书写§5.4；目录组织规范全文；core/SDK真实Cargo/export已核，目标实现仓未存在 |
| 模块骨架 | done；四组总骨架/执行计划先建立如下，不提前写未到组结论或未来Step |
| 写入纪律 | 先问题/诊断/取舍，后结构化/复杂度/草稿/自检；历史只后置审计 |

| 内计划 | 状态 | 产物 |
|---|---|---|
| 读取输入/前序 | done | §2 |
| SOP问题回答 | done | §3 / G1~4 |
| 当前材料诊断 | done | §4 / G1~4 |
| 设计取舍 | done | §6 / G1~4 |
| 结构化产物 | done | §7.1~7.4及类型路径附录 |
| 复杂度判断 | done | §7 |
| 历史差异/草稿 | done | §5/8 / 各组草稿 |
| 自检/下一步 | done / self_review_pass；next_step_blocked | §10 |

### 分组执行计划与门禁

| 组 / 执行顺序 | 输入 / 前序依赖 | 问题/诊断/取舍 | 结构化 | 草稿 | 自检 | gate_status | 下一允许动作 / 产物 |
|---|---|---|---|---|---|---|---|
| G1 工程结构 | Step2/3；02§4；目录规范；真实Cargo | done | done | done | done | pass | G1自检pass，允许G2；§7.1已写 |
| G2 业务文件 | G1自检pass；02六U/20对象/20主语/23port与243类型索引 | done | done | done | done | pass | 243名称/22路径/20主语静态反查errors=[]；允许G3；§7.2及附录 |
| G3 外层与入口 | G2自检pass；Step3产品blocked；02平台/owner/private/UoW | done | done | done | done | pass | tree/职责161文件一致、4平台/6owner/7bin/19flow；允许G4 |
| G4 跨组审计 | G1~3自检pass；全部当前路径/命名/覆盖及历史后置 | done | done | done | done / self_review_pass | blocked | 仅因用户授权止于Step4；等待Step5明确授权；§5/7.4/8/10 |

每组都必须先写独立问题回答/诊断/取舍，再结构化/草稿/自检；模块可切换不表示产品ready。Step内待确认统一§9；G4完成后项目/flow门禁因用户授权上限blocked，不创建Step5。

## 2. 本步输入

Step2/3全文及Step1未决；正式02§4/7/12、243项support index全文；详细SOP Step4/书写§5.4；目录组织规范全文；core/SDK真实Cargo/export已核，目标实现仓未存在。前序问题回答、诊断、取舍、待确认均为输入，不只引用最终表。

## 3. SOP问题回答

### G1 问题回答（SOP问题1/2/6~13）

1. 选择workspace多crate，七role为contracts/domain/application/infra/api/worker/jobs。并非因六U而拆crate：已有管理、platform/owner consumer、query和五bounded job入口，以及四重adapter，需编译方向强制纯核心。只选择库边界和入口动作，未选七个部署服务。
2. contracts承接02五类协议/safe词汇；domain承接六U局部对象；application承接02编排主体和23ports；infra承接外层adapter/persistence/private/config/runtime；api/worker/jobs分别承接即时入口、常驻消费、bounded既有subject任务。API与worker计划各一个binary，jobs五动作binary，与库共享可信invocation检查；不新增CLI/ops入口。
3. slug为`bridges`；实现路径计划`/home/aris/Projects/quantalithos-bridges`。member `crates/<role>`、package `bridges-<role>`、lib `bridges_<role>`；binary `bridges-api`/`bridges-worker`或具体job动作snake_case。所有源码类型/函数/path不含L6/六U编号，也不复制quantalithos前缀到package。
4. 目录组织规范全部遵守，没有继承历史实现仓的偏离项，因为目标仓未创建。root Cargo负责workspace/共享依赖，member Cargo继承而不重复错位相对路径。workspace计划resolver3对应Rust2024；core/SDK现有resolver2仅来源事实，不要求本仓机械复制。
5. core path只在workspace根`Cargo.toml`的`[workspace.dependencies]`：`../quantalithos-core/crates/contracts`；contracts继承。已核package/lib分别core-contracts/core_contracts；任何member直接use该包须申明实际dependency，不能只靠传递依赖编译。
6. SDK维持条件compile候选，当前不加Cargo项；实际`crates/client`与`contracts`路径只作资格说明，不引用owner源码。Bus/Observability/六owner/platform/secret/routes仍runtime或event，不能按存在性加path。新增compile边或不同ABI须回01裁剪。
7. 每个计划root/main和adapter有已确认职责，但运行executor/provider不具资格，待Step7/14与04/07才可实现激活。Cargo.lock由未来真实解析生成，不能预写虚构lock/hash；本步只设计目录，不创建任何库/仓或运行命令。具体业务文件和测试发现路径分别G2/G3回答SOP问题3~5，未到组不预写结论。

### G2 问题回答（SOP问题2~5）

1. contracts按协议族拆commands/consumers/events/queries/jobs；safe共享类型按metadata/locator/operation/authority/material/delivery/callback/continuity/traceability/outcome职责拆，不使用common/types。protocol DTO与public传递类型在此，不让query response依赖domain-only类型。
2. domain按binding/inbound/delivery/callback/continuity/traceability六模块，19个局部model各有专属职责文件，states/guards先归所属对象文件，不建generic state或六个独立state manager。第20对象BridgeLocalView是public只读投影载体，唯一类型定义在contracts/views.rs；application从已授权snapshot组装，不另造同名domain/wire副本。三无机仍PlatformReceipt/SafeAuditRecord/BridgeLocalView。
3. application按six commands/four consumers/four queries/five jobs逐入口文件，共19个flow，不新增O01请求入口。O01 safe传播由同UoW的局部mutation材料来源条件生成，另有负责安全材料来源的local_mutation文件，不把每mutation自动套outbox。函数级签名/调用图到授权后的Step7~9。
4. 23port按六U职责文件与private/secret/config/UoW四seam归并，一trait一明确归属而非一port一crate；local snapshot、private carrier和qualification invalidation各有独立明确文件。private上下文/handle不得入contracts公共DTO，也不能因位于Application而被serde/logging派生。
5. 已读取243索引全文；逐名称分配主定义/外部映射责任路径，在本Step类型路径附录审计一次性覆盖。SafePresentationPlan是已计入20对象的同一model，不增造第21对象；core四shared名称只re-export。BridgeTargetMode来自Conversation语义而非新增owner源码compile边，在safe material文件建立显式转换责任，真实qualified binding后续闭口。

### G3 问题回答（SOP问题3~5/10/13）

1. 四平台各单独infra/platform职责文件，只包含本平台来源/定位/ACK/转换/能力/业务result/limit/probe分类；adapter局部状态来自本仓stores，不持平台truth。当前不按SDK/HTTP产品细分大量文件，也不预选Mattermost plugin、Slack TS App或gateway模式。
2. 六owner adapter文件按真实truth边界分开：Conversation、Identity、Governance、Artifact、Workspace、Observability；runtime/event消费经合格client或transport，源码依赖不入Cargo。Config、secret、material、audit、local store和原op commit probe各有具体文件职责，未知provider绑定时blocked而非默认fake/in-memory/明文fallback。
3. API管理/query调用既有Application；platform HTTP ingress/callback即时ACK仅protocol资格。worker常驻消费owner/consumer事件和获准poll/session/platform输入；同installation配置互斥模式，避免API与worker双接管同一流。jobs五bin仅既有subject一次有界任务，worker调度调用同一jobs库，不增通用CLI/replay命令。
4. main与runtime composition只装配已合格port/route/executor/config；没有产品资格或mandatory source时不能启动对应正向支路。选择tree和binary命名不是部署/pin/secret/env值选择，完整bind到Step7/14/04。local_store计划adapter边界，commit_probe必须同原op只读权威证明，不把NotFound/超时当rolled_back。
5. 最小测试发现文件放member/tests；support子目录不被当独立test target，qualified_ports/providers只供测试显式合成分支，不作运行provider或验收证明。此处只文件职责，完整TC/suite/fixture/evidence scripts到Step16及05~07；不创建空scripts/reports/artifacts目录或编造测试结果。

### G4 问题回答（跨组反查与当前授权边界）

1. root/七member/所有src与tests路径在tree和职责表逐文件对照，不能只用对象全集或count表示布局完成。app19入口职责表统一path首列，20对象/20主语/23ports/243索引反查各有独立依据。
2. 仓内依赖图由G1表表达强方向，contracts不依赖domain，private/snapshot不进wire；query view唯一定义。runtime产品branch不使核心默认依赖SDK/DB/HTTP/Bus，未选资格必须block对应root/IO，而不是假称runtime不存在或全项目设计都停止。
3. 命名反查slug/member/package/lib/bin/file/module层级，所有planned路径无L6/quantalithos内部前缀/common/utils。未来新文件拆分要回本Step同步tree/职责/类型索引，尤其05~07报告脚本不能从当前未交付推导永久省略。
4. 本地layout关闭与上游资格关闭分开：BR-UP/Workspace开放项/Observability十二affected保持原状态；核心shared导出只说明可映射，不证明build/bridge compatibility/SDK供应链。图、目录和test-only合成数据都不是artifact/evidence/verdict/signoff。
5. 当前只授权Step1~4。G4自检完成后设置三层gate blocked，下一动作只能等待Step5明确授权；正式03仍historical_material、assembly false。若日后授权Step5，先读其SOP/§5.5、当前Step4及02主体/组成部分，再建立当前Step5骨架，不能本轮提前写。

## 4. 当前材料问题诊断

### G1 诊断

02§4是职责图，不是选定service/crate。把六U映成六crate会让shared的dedup、local UoW、authority与private seam在业务crate之间复制；把所有接口挤进单crate则缺少编译层保护。公共契约不重/单运行入口的单crate条件不成立，workspace更符合已有入口和纯核心要求，但不声明下游已有Rust消费者。

旧规范布局示例里`crates/<name>_domain`不能覆盖同章填写规则及目录规范的`crates/<role>`。同样，规范Cargo示例只有一层`../`，必须依据声明文件位置核实，不放到`crates/contracts/Cargo.toml`后仍沿用相对根路径。SDK传递Bus/core/app/infra不能在纯contracts默许引入；产品blocked必须显式挡住运行root。

### G2 诊断

对象全集不能直接代替文件布局：six commands等handler、repository snapshots、私有handle、shared metadata、public view都不等于领域聚合。若所有243项放types.rs会混同raw/private与wire类型、scope授权与载体存在、public DTO与domain实体；若领域BridgeLocalView直接进入response又要求contracts不依赖domain，会产生反向编译边或同名副本。本组以唯一public view定义和显式转换职责解决，未改变02对象/状态/接口语义。

243表含SafePresentationPlan及core shared名称，不表示243个新增本地类型。分配路径只关闭工程归属，不证明每个ref已获authority、fields/variant/serde已定义或external binding已可调用。Repository/LocalCommitDisposition的读写/提交未知合同仍Step7/11必须闭口，不用文件存在宣布driver ready。

### G3 诊断

平台同名channel/message/thread/timestamp语义不等价，统一外层SDK或一套generic receipt会抹scope/epoch/ACK/business差异；但按未选产品扩Go plugin/Python bot/TS node会重开语言/ABI边界。入口必须能调用同一Application，又需区分private即时协议应答与safe可靠接管，不能以durable body inbox协调。storage文件还需明确原op提交证明责任，driver产品缺失保持blocked，不能用进程内结果代替崩溃后权威读取。

observability的safe local record、producer准入、transport ACK、consumer disposition和evidence所有者彼此不同。runtime/observer helper不能成为全局producer或默认每mutation发outbox。测试fake限定编排输入，不填账号/token/安装/成功报告；文件布局与证据架构层必须分开。

### G4 诊断

“目录完成”容易被误当实现仓已存在或schemas已经全部关闭；`done`还可能错误解除Step5/正式装配权限。本组必须分别记录Step工作完成、组内自检pass、用户上限blocked、产品/owner资格pending。正式03与README须保持未写；02仅此前状态元信息校正，不能顺手改结论或其他owner文档。

首次tree审计工具只认首列路径，未读protocol职责表第三列的19flow，因此报告漏责任；实际责任已写，现把该表机械调整为path首列，不变接口/语义。修正后161tree/161责任文件、19flows、4platform/6owner/7bin核对errors=[]；是静态设计检查，不是Cargo/平台测试。

## 5. 改动前后及历史差异

| 历史位置 / 旧口径 | 本步独立结论 | 处理 / 回填影响 |
|---|---|---|
| 旧03§3.2五部分、§3.3单src/application五service | 不用作当前布局 | 七技术role/六业务model模块/19入口逐文件；不把旧BridgeRequest/BridgeDelivery真相带回 |
| 旧03§3.3 types/config/projection/ops及泛化repo/publisher | 不继承空泛层、第二public view或通用producer | safe carriers按职责、view唯一、23port与明确store/commit proof、conditional O01 |
| 旧03PayloadEnvelope、timeout/replay/resync/repair命名主线 | 删除为本轮来源 | 当前private瞬时材料、same op/effect权威恢复与unknown/manual，不建body inbox或无限replay |
| READMEpyproject/poetry/pnpm、Python+TS、MM plugin预选、common/bridged_turn | 不继承产品/ABI/owner镜像 | Rust计划与四产品中立adapter；若后续跨语言进程必要先回01/02裁剪 |
| 历史README“敏感Gate打开Chat”默认入口与KMS/OAuthfallback | 不进入文件/配置默认 | fixed qualified route、opaque secret、current外显资格；L5-chat未停审正文不能正式输入 |

G4结构化结论落盘后才核读旧03§3.1~3.3/文件映射及README目录。旧文件只historical_material，未修改；Step3技术栈差异沿其§5，不重新选平台产品。

## 6. 设计取舍

### G1 取舍与写入许可

采用七技术role workspace：对外safe契约单库，纯domain与编排独立，重infra由统一composition绑定，三入口role复用编排。代价是manifest/member协调与多crate审计；价值是依赖方向可检查。worker常驻，jobs只一次受限任务，二者不定义重复用例。六U作为domain模块/职责追溯而不是package名字或六微服务。

本地compile只确认core actor/metadata，SDK条件位于infra且启用须核closure；planned root/main不代表runtime binding成立。只给已确认工程职责文件，不列未选SQL驱动/SDK版本特定文件、不建空scripts/reports/artifacts树。G1已自检pass。

### G2 取舍与写入许可

采用“协议族safe contract + 六U局部model + 一入口一flow文件 + 职责port组”的文件布局；BridgeLocalView单一public类型，private carrier只Application可受限构造/消费，infra实现读取/验证，不建第二套public metadata或foreign owner类型。仅SafePresentationPlan保持domain归属；其概要在C04使用处不授予contracts反向依赖。

类型路径附录逐项列243名称和责任文件，后续Step6/7/8在同路径展开schema/方法/source绑定。路径选择不能作为已定义类型证据；若后续capability展开确需拆文件，本Step与类型路径必须同步复审，不能实现者自由迁移。G2已自检pass。

### G3 取舍与写入许可

采用四平台独立反腐文件、六owner runtime适配文件、产品中立store/commit proof与private/config/runtime责任文件；采用API即时入口、worker常驻入口、jobs有界入口。强制复用19Application流程，四平台差异不侵入Domain，secret和private内容不经过通用wire/error/logging。测试support限制在tests树，无生产fallback。

现在只写已确认责任路径与测试发现文件；不填SDK版本/endpoint/DB表/KMS实例、不默认server/executor。不要求当前创建真实运行脚本；后续05/06/07若将gate/report/check脚本列交付，必须回本Step追加明确脚本路径并遵守目录规范，不能留下空目录。G3已自检pass。

### G4 取舍与写入许可

采用G1~3完整责任树作为Step4组织结论，补跨组命名/主语/port/载体/依赖/安全与授权审计；然后独立后置核读历史布局差异，不将旧五部分和generic ops/projection带回。当前phase只允许G4审计/草稿/停点同步，不定义Step5模块capability/对象卡或未来接口/配置。

Step4各组自检pass不替用户授权；最终三层next_allowed_action必须为等待用户明确授权03 Step5。保留成本是当前不能交实现者创建可运行仓库，但职责路径、文件覆盖和未关闭合同均可审查，无实现者自由取舍空间。

## 7. 结构化中间产物与复杂度

复杂度计划：四组分别闭口，G2承接全集并使用单独类型路径附录避免243名称掩盖主布局；每次只当前组落文。文件树必须与逐文件职责、映射和Cargo方向反查；本步不定义完整对象卡/DTO/trait函数/DDL。

### 7.1 G1 工程结构

#### 布局形态决策

目标实现仓计划遵守[目录规范](../../../standards/document/子项目目录与代码文件组织规范.md)全部适用目录/package/crate/binary/file规则。**以下均为design-only计划，不是已创建文件或实施boundary skeleton。**

| 候选布局 | 是否采用 | 判断依据 | 影响 |
|---|---|---|---|
| 单crate模块分层架构 | 否 | 当前已有多类入口、四平台/owner/private重infra、纯核心强约束；仅module/review不足以审查产品依赖反向穿透 | 不使用旧单src与common布局；不因“一个BC”强制单crate |
| workspace多crate架构 | 是 | 编译边界保护core、统一safe contracts、API/worker/bounded jobs共享编排；不假定已有下游crate消费者 | 七role，六U映为业务模块；manifest与测试发现按member，不决定部署拓扑 |

#### 实现单元总表

| 实现单元 | 类型 | 职责 | 对应概要设计章节 |
|---|---|---|---|
| contracts | library | 20主语协议、safe ref/locator/disposition、view/page/config引用与有限公开error | 02§7/12；只carrier，不拥有authority |
| domain | library | 19局部model/17机guard；第20只读载体BridgeLocalView归contracts；receipt/audit/view无独立机 | 02§5/6/9/10 |
| application | library | 19入口编排、23port、metadata检查、私有瞬时carrier与local mutation/result边界 | 02§4/7/8/10 |
| infra | library | 四平台与owner反腐、safe stores/commit probe、qualified材料/secret/config、runtime装配 | 02§7.8/10/11/13 |
| api | library + binary | 可信管理/query、平台HTTP ingress/callback即时ACK；仅dispatch/application，不选HTTP产品 | 02§7 C01~06/Q01~04/E01/E03 |
| worker | library + binary | 常驻owner/consumer/event消费及获准platform session/poll入口；受限job调度 | 02§7 E01~04/J01~05；平台模式不能双接管 |
| jobs | library + 五binary | 五已有subject一次有界invocation；可信context/原op校验后调用Application | 02§7 J01~05；无新request/通用replay命令 |

#### 目录 / Package / Crate / Binary映射

| 实现单元目录 | 类型 | Cargo package | Rust crate / binary | 职责 | 是否对外暴露 |
|---|---|---|---|---|---|
| `crates/contracts` | lib | bridges-contracts | bridges_contracts | safe协议契约 | 可被正式consumer引用；未宣已发布 |
| `crates/domain` | lib | bridges-domain | bridges_domain | 同步局部对象/guard | 仓内，非owner API |
| `crates/application` | lib | bridges-application | bridges_application | port与编排 | 仓内及本仓infra，非外部调用协议 |
| `crates/infra` | lib | bridges-infra | bridges_infra | adapter/config/runtime | 只供入口装配，无产品默认化 |
| `crates/api` | lib + bin | bridges-api | bridges_api / bridges-api | 即时入口 | binary入口受后续runtime资格阻塞 |
| `crates/worker` | lib + bin | bridges-worker | bridges_worker / bridges-worker | 常驻consumer与受限调度 | binary入口受后续runtime资格阻塞 |
| `crates/jobs` | lib + bins | bridges-jobs | bridges_jobs；dispatch_queued_delivery / reconcile_bridge_operation / reconcile_stream_gap / retry_safe_handoff / refresh_bridge_qualification | 五bounded task入口 | 只显式既有subject/trusted invocation，不授通用运维权限 |

七个lib与七个bin是代码组织计划，不表示七个常驻部署实例。jobs的bin具体路径见G3；不建立cli/ops/config/observability额外member。

#### 文件布局树: workspace根与member边界

```text
/home/aris/Projects/
|  +-- quantalithos-core/                 # existing external compile source
|  |   +-- crates/contracts/Cargo.toml    # verified core-contracts package
|  +-- quantalithos-sdk/                  # existing conditional candidate only
|  |   +-- crates/client/Cargo.toml       # verified path, not enabled
|  +-- quantalithos-bridges/              # planned, currently absent
|      +-- Cargo.toml                     # workspace and root dependency paths
|      +-- Cargo.lock                     # future generated dependency resolution
|      +-- rust-toolchain.toml            # planned 1.93.0 toolchain
|      +-- rustfmt.toml                   # formatter settings
|      +-- .gitignore                     # build and private/generated exclusions
|      +-- README.md                     # future implementation entry, no claims
|      +-- crates/                       # seven technical roles, not services
|          +-- contracts/Cargo.toml      # bridges-contracts manifest
|          +-- domain/Cargo.toml         # bridges-domain manifest
|          +-- application/Cargo.toml    # bridges-application manifest
|          +-- infra/Cargo.toml          # bridges-infra manifest
|          +-- api/Cargo.toml            # bridges-api lib and binary manifest
|          +-- worker/Cargo.toml         # bridges-worker lib and binary manifest
|          +-- jobs/Cargo.toml           # bridges-jobs lib and five binaries
```

关键说明：

- core/SDK是外部sibling，不是Bridges文件职责；SDK路径存在不代表被启用。
- root/tree是计划；当前不创建仓库/Cargo.lock/配置，不运行Cargo或生成runtime事实。
- 七role共享六U编排，不把业务U编号带进代码或拆为部署服务。
- 具体产品/endpoint/profile/secret provider未绑定，main与adapter实现不可直接激活。

#### workspace根文件职责

| 文件路径（相对计划实现仓） | 所属模块 | 定义内容 | 主要责任 |
|---|---|---|---|
| `Cargo.toml` | workspace | 七member、resolver3、workspace package工具链约束、内部与已确认core依赖 | 相对root计算path；不填未核外部产品或发布版本；不把runtime关系写Cargo |
| `Cargo.lock` | workspace / generated | 未来真实解析的依赖闭包 | 实施门禁生成/审查，不在设计中造hash/下载或解析成功 |
| `rust-toolchain.toml` | workspace | planned channel1.93.0 | 与MSRV1.93一致；实际安装/compatibility到07核验 |
| `rustfmt.toml` | workspace | 4空格及适用stable格式规则 | 不将所有规范建议盲写unstable参数；版本兼容到实现核 |
| `.gitignore` | workspace | build/cache与未来generated artifacts exclusions | 禁止private材料落盘仍是行为禁令，不能以gitignored作为允许持久化理由 |
| `README.md` | workspace | 仓使命/标准/上下游、实际可用入口与后续状态引用 | 按未来正式基线编写；不复制历史Python/TS/GlobalMember映射或报告成功 |
| `crates/contracts/Cargo.toml` | contracts | bridges-contracts/lib manifest、core workspace继承 | 只已核safe shared与wire依赖；禁止domain/infra/SDK/client |
| `crates/domain/Cargo.toml` | domain | bridges-domain/lib manifest | 只contracts及纯语言必要依赖，无application/infra/executor |
| `crates/application/Cargo.toml` | application | bridges-application/lib manifest | contracts/domain；不链接具体provider或入口 |
| `crates/infra/Cargo.toml` | infra | bridges-infra/lib manifest | application/contracts/domain；SDK/第三方产品只有资格核验后追加exact pin |
| `crates/api/Cargo.toml` | api | bridges_api lib + bridges-api bin目标 | application/contracts/infra；实际server依赖待资格，不引worker/jobs用例替代 |
| `crates/worker/Cargo.toml` | worker | bridges_worker lib + bridges-worker bin目标 | application/contracts/infra/jobs；常驻runner不反向被Application依赖 |
| `crates/jobs/Cargo.toml` | jobs | bridges_jobs lib与五bin目标 | application/contracts/infra；五动作不建立独立domain或运行产品 |

#### Cargo依赖位置与方向

| 仓内member | 允许的直接仓内依赖 | 禁止反向 / 约束 |
|---|---|---|
| contracts | 无 | 不依赖domain/application/infra/入口；仅外部core-contracts共享导出 |
| domain | contracts | 同步纯guard，不依赖上层和owner/platform产品 |
| application | contracts、domain | 抽象port与私有carrier定义在此；不能依赖infra/入口 |
| infra | contracts、domain、application | implements ports；产品不可借transitive dependency进入核心 |
| api | contracts、application、infra | 即时协议dispatch，业务guard不另写一份 |
| jobs | contracts、application、infra | 单次invocation公共逻辑；不得依赖worker/api |
| worker | contracts、application、infra、jobs | 常驻调度调用同一bounded job library；无循环 |

| 依赖仓库 | 全局依赖类型 | Cargo.toml位置 | path dependency写法 | 说明 |
|---|---|---|---|---|
| quantalithos-core | 经本步来源核验的计划compile依赖 | workspace根Cargo的workspace.dependencies；contracts member的dependencies继承 | root `core-contracts = { path = "../quantalithos-core/crates/contracts" }`；member `core-contracts = { workspace = true }` | 相对于planned root，不把`../`放member后错指仓内目录；已核真实package/lib与路径；未build |

SDK没有当前Cargo条目，不用“条件候选”偷放默认依赖；资格通过时，root候选真实路径是`../quantalithos-sdk/crates/client`，完整closure反查并记录07前置。运行期owner/Bus/四平台/secret/router无path条目。本仓内部七member依赖也由root的`crates/<role>`登记并由使用者继承；不是跨仓依赖。

G1回填草稿：正式§4先摘录布局决策、七role映射和root/tree/职责/compile方向；不新增产品。G1自检pass：SOP1/2/6~13承接、role/package/lib/bin无层级前缀、core路径相对位置与真实export一致；七role有明确责任而非六微服务。只允许G2，不释放runtime/SDK或实施。

### 7.2 G2 核心业务文件

#### 文件布局树: contracts安全协议与shared词汇

```text
quantalithos-bridges/crates/contracts/
|  +-- src/
|      +-- lib.rs                 # safe public module exports
|      +-- commands.rs            # six management command DTOs
|      +-- consumers.rs           # four safe ingress envelopes and results
|      +-- events.rs              # conditional O01 local disposition event
|      +-- queries.rs             # four strict read-only request DTOs
|      +-- jobs.rs                # five bounded job protocols
|      +-- views.rs               # single public BridgeLocalView carrier
|      +-- config.rs              # safe config and opaque secret references
|      +-- errors.rs              # finite body-free public errors
|      +-- shared/
|          +-- mod.rs             # explicit shared exports
|          +-- metadata.rs        # core re-exports and trusted context carriers
|          +-- locators.rs        # typed external and local object locators
|          +-- operation.rs       # original operation, effect and revisions
|          +-- authority.rs       # safe basis carriers, not authority owner
|          +-- material.rs        # qualified source and material references
|          +-- delivery.rs        # target, effect and business receipt carriers
|          +-- callback.rs        # action source, expiry and result carriers
|          +-- continuity.rs      # scoped cursor, coverage, claim and limits
|          +-- traceability.rs    # canonical admission and safe audit carriers
|          +-- outcomes.rs        # independent ACK and typed dispositions
```

关键说明：

- 只有safe传递类型在contracts；private body/handle/token及repository内部snapshot不在此。
- metadata仅re-export已核core名称；BridgeTargetMode是owner语义转换责任，非新增owner源码编译边。
- events.rs只有有资格O01，字段完整schema和producer资格未关闭，不是无条件outbox。

#### contracts逐文件职责

| 文件路径 | 所属模块 | 定义内容 | 主要责任 |
|---|---|---|---|
| `crates/contracts/src/lib.rs` | contracts | 下列safe模块导出 | 公共surface显式allowlist，不re-exportinfra/private/domain实体 |
| `crates/contracts/src/commands.rs` | commands | C01~06；BindingActionProposal、AuthorizedMappingProposal | 局部命令DTO及typed branch；metadata单一来源，C04/C06不在入口发平台 |
| `crates/contracts/src/consumers.rs` | consumers | E01~04安全envelope/context/consume结果 | 来源/event_id/op/key与ACK分层；无raw内容，入口private数据另经受限carrier |
| `crates/contracts/src/events.rs` | events | O01 BridgeLocalDispositionRecordedEvent | 只已提交canonical/admission材料与safe ref，不广播raw/每mutation自动事件 |
| `crates/contracts/src/queries.rs` | queries | Q01~04查询条件 | page/consistency不许可写入/refresh/probe，禁止敏感存在性泄漏 |
| `crates/contracts/src/jobs.rs` | jobs | J01~05 input/output/result | 既有subject、trusted invocation和原op，不伪造job run或新replay入口 |
| `crates/contracts/src/views.rs` | views | BridgeLocalView及safe stage/page/availability carrier | 第20对象唯一公开定义；无独立机，无domain依赖，无GlobalSuccess |
| `crates/contracts/src/config.rs` | config | InstallationConfigDraft、capability/config revision、route/opaque secret引用 | safe config carrier；不定义secret值、生产env/profile或provider产品 |
| `crates/contracts/src/errors.rs` | errors | 协议族有限错误与安全拒绝分类 | 不传播raw SDK/DB错误/secret；完整variant到Step8/12，不靠String吞unknown |
| `crates/contracts/src/shared/mod.rs` | shared | 十职责词汇模块显式导出 | 不造common/helper词汇或owner truth |
| `crates/contracts/src/shared/metadata.rs` | shared.metadata | core ActorContext/ActorRef/CommandMetadata/QueryMetadata及safe trusted carriers | core四名称re-export，不复制schema；trusted不是任意public构造即得权限 |
| `crates/contracts/src/shared/locators.rs` | shared.locators | platform/installation/account/location/message/内部target/local subject typed ref | locator只定位，不创建GlobalMember/频道/owner实体，不解析ref文本作scope |
| `crates/contracts/src/shared/operation.rs` | shared.operation | 原op/effect、body-free meaning及expected revision/CAS结果ref | 稳定语义身份不由rawbody hash生成；revision与authority分离 |
| `crates/contracts/src/shared/authority.rs` | shared.authority | 显式basis/current qualification/Slot、方向/actor分类/代际 | 只资格carrier，来源/validity到真实port，不能本地签出owner permission |
| `crates/contracts/src/shared/material.rs` | shared.material | source/version/marker/qualified material/Gate与附件safe引用、owner入站结果 | 明确BridgeTargetMode语义转换；不把owner required digest替成rawbody hash |
| `crates/contracts/src/shared/delivery.rs` | shared.delivery | plan/intent/attempt/effect/receipt/target与no-effect/qualification引用 | 保HTTP与business result分开，immutable target/effect，无敏感payload |
| `crates/contracts/src/shared/callback.rs` | shared.callback | source/action/actor关联、one-use/expiry/revision与owner结果 | 安全action载体不携interaction token或默认approve |
| `crates/contracts/src/shared/continuity.rs` | shared.continuity | namespace/key/cursor/epoch/comparator/coverage、claim/lane/retry/rate下界 | protocol/owner/delivery游标独立；lease/NotFound/timeout不证no-effect |
| `crates/contracts/src/shared/traceability.rs` | shared.traceability | 唯一audit/source、canonical/admission/consumer结果ref | 不是evidence/report/signoff，mandatory缺资格阻对应副作用 |
| `crates/contracts/src/shared/outcomes.rs` | shared.outcomes | Command/Read result、CAS/commit disposition、ACK与原结果/有限reason | committed/conflict/rollback须权威证明；commit ACK lost为indeterminate |

#### 文件布局树: 六业务模块的局部model

```text
quantalithos-bridges/crates/domain/
|  +-- src/
|      +-- lib.rs                         # pure local model exports
|      +-- binding/
|      |   +-- mod.rs                     # authorized binding model boundary
|      |   +-- bridge_installation.rs     # config revision and qualification
|      |   +-- external_binding.rs        # explicit authorized relation
|      |   +-- external_identity_mapping.rs # account to qualified actor relation
|      |   +-- external_location_mapping.rs # channel and internal target relation
|      |   +-- external_message_mapping.rs  # known message and source result links
|      +-- inbound/
|      |   +-- mod.rs                     # inbound handoff model boundary
|      |   +-- inbound_handoff_record.rs  # ACK and owner result, no body inbox
|      +-- delivery/
|      |   +-- mod.rs                     # safe presentation and delivery models
|      |   +-- safe_presentation_plan.rs  # qualified safe projection references
|      |   +-- delivery_intent.rs         # immutable target and semantic effect
|      |   +-- delivery_attempt.rs        # fenced attempt and unknown windows
|      |   +-- platform_receipt.rs        # known business result, no lifecycle
|      +-- callback/
|      |   +-- mod.rs                     # external action responsibility models
|      |   +-- external_action_binding.rs # action source, actor and expiry binding
|      |   +-- callback_handoff_record.rs # one-use claim and owner disposition
|      +-- continuity/
|      |   +-- mod.rs                     # local continuity models
|      |   +-- dedup_record.rs            # scoped key and original safe result
|      |   +-- stream_cursor.rs           # qualified stream epoch and position
|      |   +-- gap_record.rs              # gap range, coverage and manual outlet
|      |   +-- dispatch_lane.rs           # order, shared limit bounds and fencing
|      |   +-- recovery_record.rs         # original operation reconciliation
|      +-- traceability/
|          +-- mod.rs                     # safe local trace models
|          +-- safe_audit_record.rs       # immutable body-free mutation record
|          +-- safe_handoff_record.rs     # admitted material and consumer state
```

关键说明：

- 共19个model文件；第20对象BridgeLocalView唯一归contracts/views.rs，不复制domain类型。
- 17stateful主语的enum/guard归所属model；PlatformReceipt、SafeAuditRecord无独立状态机。
- 每U模块只是组织轴，无owner实体、raw store、executor或网络IO。

#### 20对象逐文件职责与唯一性

| 文件路径 | 所属模块 | 定义内容 | 主要责任 |
|---|---|---|---|
| `crates/domain/src/binding/bridge_installation.rs` | binding | BridgeInstallation | adapter-local配置revision/资格，非平台安装truth |
| `crates/domain/src/binding/external_binding.rs` | binding | ExternalBinding | 经授权relation、generation/撤销/expiry，不授新权限 |
| `crates/domain/src/binding/external_identity_mapping.rs` | binding | ExternalIdentityMapping | typed external account -> qualified actor；external_id不造GlobalMember |
| `crates/domain/src/binding/external_location_mapping.rs` | binding | ExternalLocationMapping | 显式两端locator/target/parent，禁止频道推权限 |
| `crates/domain/src/binding/external_message_mapping.rs` | binding | ExternalMessageMapping | known owner/platform结果与version/marker/edit-delete关联，不建Message/Turn副本 |
| `crates/domain/src/inbound/inbound_handoff_record.rs` | inbound | InboundHandoffRecord | safe接管/owner阶段分栏，不durable保存body |
| `crates/domain/src/delivery/safe_presentation_plan.rs` | delivery | SafePresentationPlan | safe projection/Gate降级/attachment basis，private内容不入对象 |
| `crates/domain/src/delivery/delivery_intent.rs` | delivery | DeliveryIntent | immutable source/target/effect、C04/E02 shared semantic uniqueness |
| `crates/domain/src/delivery/delivery_attempt.rs` | delivery | DeliveryAttempt | append attempt、qualified claim/window/current basis、unknown |
| `crates/domain/src/delivery/platform_receipt.rs` | delivery | PlatformReceipt | 有权威business result的不可变record；HTTP ACK不是receipt，无独立机 |
| `crates/domain/src/callback/external_action_binding.rs` | callback | ExternalActionBinding | source/action/actor/owner revision/expiry/one-use绑定 |
| `crates/domain/src/callback/callback_handoff_record.rs` | callback | CallbackHandoffRecord | claimed不复活，原owner op/结果与ACK分栏 |
| `crates/domain/src/continuity/dedup_record.rs` | continuity | DedupRecord | 六namespace、同key语义冲突、原safe result与窗口 |
| `crates/domain/src/continuity/stream_cursor.rs` | continuity | StreamCursor | scope/stream/epoch/comparator/coverage与独立阶段 |
| `crates/domain/src/continuity/gap_record.rs` | continuity | GapRecord | qualified范围/coverage、无法安全恢复则manual |
| `crates/domain/src/continuity/dispatch_lane.rs` | continuity | DispatchLane | 局部顺序/fence，多lane共享bucket下界与bounded retry |
| `crates/domain/src/continuity/recovery_record.rs` | continuity | RecoveryRecord | 同op/effect权威probe/已知结果收束，unknown不新发 |
| `crates/domain/src/traceability/safe_audit_record.rs` | traceability | SafeAuditRecord | 唯一mutation来源与body-free材料，无独立机，不是evidence |
| `crates/domain/src/traceability/safe_handoff_record.rs` | traceability | SafeHandoffRecord | 既有canonical/admission与consumer accepted/pending/unknown分开 |
| `crates/contracts/src/views.rs` | views / traceability projection | BridgeLocalView | public安全只读slice，qualified scope/page/availability，无独立机 |
| `crates/domain/src/lib.rs` | domain | 六model模块显式export | 只contracts/纯本地类型，不暴露provider/runtime |
| `crates/domain/src/binding/mod.rs` | binding | 本组五model export | 不并成通用mapping string/entity |
| `crates/domain/src/inbound/mod.rs` | inbound | InboundHandoffRecord export | 只局部safe handoff |
| `crates/domain/src/delivery/mod.rs` | delivery | 四delivery model export | 分开plan/intent/attempt/receipt |
| `crates/domain/src/callback/mod.rs` | callback | 两callback model export | 来源验证/业务责任/原结果不混同 |
| `crates/domain/src/continuity/mod.rs` | continuity | 五continuity model export | 原op与coverage/lane guard分工 |
| `crates/domain/src/traceability/mod.rs` | traceability | audit/handoff export | public view已在contracts；不造evidence model |

#### 文件布局树: application逐入口编排与抽象ports

```text
quantalithos-bridges/crates/application/
|  +-- src/
|      +-- lib.rs                          # application and port exports
|      +-- metadata_validation.rs          # shared metadata and safe bounds
|      +-- local_mutation.rs               # local UoW and conditional canonical source
|      +-- qualification_invalidation.rs   # J05 cross-subject invalidation plan
|      +-- private_material.rs             # non-wire transient contexts and handles
|      +-- result_mapping.rs               # domain snapshots to safe DTOs
|      +-- commands/
|      |   +-- mod.rs                      # six command flows
|      |   +-- configure_bridge_installation.rs
|      |   +-- manage_external_binding.rs
|      |   +-- maintain_external_mapping.rs
|      |   +-- prepare_external_delivery.rs
|      |   +-- bind_external_action.rs
|      |   +-- request_bridge_recovery.rs
|      +-- consumers/
|      |   +-- mod.rs                      # four consumer flows
|      |   +-- platform_input_received.rs
|      |   +-- committed_source_available.rs
|      |   +-- platform_callback_received.rs
|      |   +-- safe_handoff_disposition.rs
|      +-- queries/
|      |   +-- mod.rs                      # four strict read-only flows
|      |   +-- get_binding_mapping_view.rs
|      |   +-- get_bridge_operation_view.rs
|      |   +-- get_continuity_view.rs
|      |   +-- get_safe_handoff_view.rs
|      +-- jobs/
|      |   +-- mod.rs                      # five bounded job flows
|      |   +-- dispatch_queued_delivery.rs
|      |   +-- reconcile_bridge_operation.rs
|      |   +-- reconcile_stream_gap.rs
|      |   +-- retry_safe_handoff.rs
|      |   +-- refresh_bridge_qualification.rs
|      +-- ports/
|          +-- mod.rs                      # 23 local port requirements
|          +-- binding.rs                  # binding authority and local repositories
|          +-- inbound.rs                  # private ingress and owner handoff
|          +-- delivery.rs                 # qualified presentation and platform effect
|          +-- callback.rs                 # verification, responsibility, owner action
|          +-- continuity.rs               # cursor, lane and authoritative recovery
|          +-- traceability.rs             # read qualification and safe observation
|          +-- private_material.rs         # qualified instantaneous material port
|          +-- secret.rs                   # opaque private secret resolution port
|          +-- config_qualification.rs     # config, capability and route qualification
|          +-- local_uow.rs                # local commit and indeterminate disposition
|          +-- local_snapshots.rs          # internal repository return carriers
```

关键说明：

- 19入口各有文件，Command/Consumer/Query/Job的文件名对应下表动作，不增加API或通用success。
- O01归events DTO与local_mutation条件材料源，不增第20请求flow或独立producer。
- ports是Bridges本地需求，缺owner/provider callable时blocked；private carrier与snapshot不转为wire类型。

#### 20协议主语与19编排文件

| 文件路径 | 所属模块 / 正式主语 | 协议责任文件 | 主要责任 / 对应02 |
|---|---|---|---|
| `crates/application/src/commands/configure_bridge_installation.rs` | commands / C01 ConfigureBridgeInstallation | `crates/contracts/src/commands.rs` | BindingApplication配置资格/revision，02§7.2/8.2 |
| `crates/application/src/commands/manage_external_binding.rs` | commands / C02 ManageExternalBinding | `crates/contracts/src/commands.rs` | 显式relation/current basis/generation，无owner mutation |
| `crates/application/src/commands/maintain_external_mapping.rs` | commands / C03 MaintainExternalMapping | `crates/contracts/src/commands.rs` | 三typed mapping与两端正式basis/CAS，非String自动映射 |
| `crates/application/src/commands/prepare_external_delivery.rs` | commands / C04 PrepareExternalDelivery | `crates/contracts/src/commands.rs` | PresentationApplication只准备，C04/E02 shared effect唯一 |
| `crates/application/src/commands/bind_external_action.rs` | commands / C05 BindExternalAction | `crates/contracts/src/commands.rs` | action/source/actor/revision/expiry绑定，不发审批 |
| `crates/application/src/commands/request_bridge_recovery.rs` | commands / C06 RequestBridgeRecovery | `crates/contracts/src/commands.rs` | 原subject/op维护请求，无command内重发 |
| `crates/application/src/consumers/platform_input_received.rs` | consumers / E01 PlatformInputReceivedConsumer | `crates/contracts/src/consumers.rs` | InboundApplication安全接管、owner交接与ACK分层 |
| `crates/application/src/consumers/committed_source_available.rs` | consumers / E02 CommittedSourceAvailableConsumer | `crates/contracts/src/consumers.rs` | qualified committed来源，复用C04准备语义，不直接send |
| `crates/application/src/consumers/platform_callback_received.rs` | consumers / E03 PlatformCallbackReceivedConsumer | `crates/contracts/src/consumers.rs` | CallbackApplication one-use/current责任与原owner action |
| `crates/application/src/consumers/safe_handoff_disposition.rs` | consumers / E04 SafeHandoffDispositionConsumer | `crates/contracts/src/consumers.rs` | SafeHandoffApplication只消费正式consumer disposition |
| `crates/application/src/queries/get_binding_mapping_view.rs` | queries / Q01 GetBindingMappingView | `crates/contracts/src/queries.rs` | 既有config/binding/mapping安全只读，无audit/repair |
| `crates/application/src/queries/get_bridge_operation_view.rs` | queries / Q02 GetBridgeOperationView | `crates/contracts/src/queries.rs` | 局部operation阶段，只读无平台/owner probe |
| `crates/application/src/queries/get_continuity_view.rs` | queries / Q03 GetContinuityView | `crates/contracts/src/queries.rs` | cursor/gap/lane safe slice，无水位推进 |
| `crates/application/src/queries/get_safe_handoff_view.rs` | queries / Q04 GetSafeHandoffView | `crates/contracts/src/queries.rs` | audit/handoff qualified可见slice，不宣证据 |
| `crates/application/src/jobs/dispatch_queued_delivery.rs` | jobs / J01 DispatchQueuedDeliveryJob | `crates/contracts/src/jobs.rs` | DeliveryApplication对既有intent受限IO，网络不包UoW |
| `crates/application/src/jobs/reconcile_bridge_operation.rs` | jobs / J02 ReconcileBridgeOperationJob | `crates/contracts/src/jobs.rs` | RecoveryJob只原op权威probe/finalize，unknown manual |
| `crates/application/src/jobs/reconcile_stream_gap.rs` | jobs / J03 ReconcileStreamGapJob | `crates/contracts/src/jobs.rs` | 同stream/epoch/coverage安全恢复，不raw replay |
| `crates/application/src/jobs/retry_safe_handoff.rs` | jobs / J04 RetrySafeHandoffJob | `crates/contracts/src/jobs.rs` | 同canonical/op受限交接，mandatory admission先验 |
| `crates/application/src/jobs/refresh_bridge_qualification.rs` | jobs / J05 RefreshBridgeQualificationJob | `crates/contracts/src/jobs.rs` | 既有subject维护与所属Application失效处理，无权限创建 |
| `crates/application/src/local_mutation.rs`（条件材料来源，非入口） | local_mutation / non-entry / O01 BridgeLocalDispositionRecordedEvent | `crates/contracts/src/events.rs` | canonical/admission具资格且真实mutation提交后传播，02§7.7 |

#### 23port逐名称归属

| 文件路径 | 所属模块 | 定义内容（固定23port） | 主要责任 |
|---|---|---|---|
| `crates/application/src/ports/binding.rs` | ports.binding | BindingQualificationPort、MappingRepository、InstallationRepository | U1 current授权及受限local mapping/config读取/CAS，非owner callable声明 |
| `crates/application/src/ports/inbound.rs` | ports.inbound | PlatformIngressPort、ConversationHandoffPort、InboundRepository；IngressVerificationResult | private验证/ACK、qualified owner交接、body-free记录；owner方法绑定后续核 |
| `crates/application/src/ports/delivery.rs` | ports.delivery | PresentationQualificationPort、PlatformDeliveryPort、DeliveryRepository | projection/Gate/附件资格、typed effect/receipt/limit、原intent结果与unknown |
| `crates/application/src/ports/callback.rs` | ports.callback | CallbackVerificationPort、ActorResponsibilityPort、OwnerActionPort、CallbackRepository | 来源不是授权；current actor/owner revision/one-use claim与原op交接 |
| `crates/application/src/ports/continuity.rs` | ports.continuity | ContinuityRepository、AuthoritativeRecoveryPort、LaneRepository | semantic uniqueness/cursor/coverage/lane；权威原结果，不借timeout续发 |
| `crates/application/src/ports/traceability.rs` | ports.traceability | SafeObservationPort、SafeReadQualificationPort、SafeTraceRepository | canonical/admission与consumer、query-only读取资格/局部trace，非evidence owner |
| `crates/application/src/ports/private_material.rs` | ports.private_material | PrivateMaterialPort | exact safe ref/version/current资格 -> 瞬时handle，非durable body |
| `crates/application/src/ports/secret.rs` | ports.secret | SecretResolutionPort | opaque ref/version/scoped use -> private handle，provider未选 |
| `crates/application/src/ports/config_qualification.rs` | ports.config_qualification | ConfigQualificationPort | 安装/config/capability/grant/route/secret资格，不创建平台安装 |
| `crates/application/src/ports/local_uow.rs` | ports.local_uow | LocalUnitOfWorkPort | 本地subject/dedup/result/audit与条件handoff同UoW；无网络；提交未知不能当rollback |

#### application其他逐文件职责

| 文件路径 | 所属模块 | 定义内容 | 主要责任 |
|---|---|---|---|
| `crates/application/src/lib.rs` | application | 编排与抽象port模块显式export | 只contracts/domain，外层构造不可反向侵入 |
| `crates/application/src/metadata_validation.rs` | metadata_validation | core metadata required/bounds/source trace检查 | 不重复顶层key，不把type存在作权限，不记录reason raw内容 |
| `crates/application/src/local_mutation.rs` | local_mutation | QualifiedLocalMutationPlan、safe材料来源与UoW编排责任 | 唯一mutation producer，mandatory admission先阻副作用，条件O01不必普发 |
| `crates/application/src/qualification_invalidation.rs` | qualification_invalidation | QualificationInvalidationPlan与相关subject责任分配 | J05使各对象所属Application收束本地失效，不“刷新”出新授权 |
| `crates/application/src/private_material.rs` | private_material | 五private context/handle载体 | 非wire/非durable；受限factory/存活期/清理/Send边界到Step6/7闭口 |
| `crates/application/src/result_mapping.rs` | result_mapping | 已授权domain/snapshot -> contracts result/view显式转换 | 只safe allowlist，不复制domain实体、透传foreign raw字段或造统一success |
| `crates/application/src/commands/mod.rs` | commands | 六command编排导出 | 无通用execute/replay入口 |
| `crates/application/src/consumers/mod.rs` | consumers | 四consumer编排导出 | transport ACK与业务结果分开 |
| `crates/application/src/queries/mod.rs` | queries | 四只读编排导出 | 不导出mutation/probe到查询入口 |
| `crates/application/src/jobs/mod.rs` | jobs | 五bounded job编排导出 | 原subject/op和可信continuity，不创建新effect |
| `crates/application/src/ports/mod.rs` | ports | 23port及内部snapshot导出 | 不以接口名证明foreign方法/qualification已存在 |
| `crates/application/src/ports/local_snapshots.rs` | ports.local_snapshots | 九repository/local safe snapshot返回载体 | Application内部读取面，不进入public协议或包含private正文/owner镜像 |

#### 243类型路径承接

详见[本Step类型路径附录](03_ddd_step_04_support_type_file_index.md)。逐名称只有一个责任路径；四core名称re-export、SafePresentationPlan引用现有model，其余定义/映射/完整字段由后续Step6~8关闭。22个责任文件不等于22新增模块或已可编译schema。新增public page/enum/trait carrier仍须在后续closed loop审计，243是02已有使用索引，不是完整03 schema的数量上限。

G2草稿：正式§4组合三core树、20对象/20主语/23port职责表及243附录入口；public view唯一、不增加对象/接口/机。G2自检pass：243名称逐项完整/唯一，22路径都有已写责任；20协议主语/19入口固定，23port按3+3+3+4+3+3+4归组，无重复trait；20对象含单一public view和19model，17机/三无机不变。只允许G3，不宣布schema/driver/owner branch ready。

### 7.3 G3 外层、入口与测试文件

#### 文件布局树: infra平台、owner与私有边界

```text
quantalithos-bridges/crates/infra/
|  +-- src/
|      +-- lib.rs                     # outer adapter exports for composition
|      +-- platform/
|      |   +-- mod.rs                 # four explicit platform adapters
|      |   +-- slack.rs               # Slack scope, ACK, changes and limits
|      |   +-- mattermost.rs          # server-pinned post and root semantics
|      |   +-- telegram.rs            # bot update, callback and offset semantics
|      |   +-- discord.rs             # interaction or gateway, bucket semantics
|      +-- owners/
|      |   +-- mod.rs                 # qualified runtime owner adapters
|      |   +-- conversation.rs        # owner handoff, source and result binding
|      |   +-- identity.rs            # AI anchor only, not human account creation
|      |   +-- governance.rs          # current policy, disclosure and owner action
|      |   +-- artifact.rs            # qualified attachment and material refs
|      |   +-- workspace.rs           # conditional safe read and provenance
|      |   +-- observability.rs       # producer admission and consumer disposition
|      +-- events/
|      |   +-- mod.rs                 # event transport binding boundary
|      |   +-- transport.rs           # qualified source, ACK and result separation
|      +-- persistence/
|      |   +-- mod.rs                 # local repository adapter exports
|      |   +-- local_store.rs         # safe stores, uniqueness, CAS and local UoW
|      |   +-- commit_probe.rs        # original operation read-only commit proof
|      +-- private_material.rs       # qualified short-lived provider conversion
|      +-- secrets.rs                # opaque ref, rotation and private handles
|      +-- audit.rs                  # body-free output allowlists, no new producer
|      +-- configuration/
|      |   +-- mod.rs                 # safe config loading and qualification
|      |   +-- settings.rs            # adapter/config/secret reference binding types
|      |   +-- load.rs                # structured settings intake, no secret body
|      |   +-- validate.rs            # required seams, bounds and mode exclusions
|      |   +-- qualification.rs       # ConfigQualificationPort binding
|      +-- runtime/
|          +-- mod.rs                 # outer runtime root exports
|          +-- composition.rs        # all required ports, fixed routes and builders
|          +-- execution.rs          # qualified executor, bounded run and shutdown
```

关键说明：

- 四adapter都是已确认责任文件，SDK/API/plugin/版本仍未选；不把计划文件描述成已实现能力。
- owners目录不是源码path依赖，client只能消费正式合同，缺bridge binding保持blocked。
- local_store/commit_probe是产品中立责任位置；具体driver、DDL、commit证明合同仍待后续Step关闭。
- secret/material/config/runtime未获资格时不以test fake、空凭证或明文fallback启动正向支路。

#### infra逐文件职责

| 文件路径 | 所属模块 | 定义内容 | 主要责任 |
|---|---|---|---|
| `crates/infra/src/lib.rs` | infra | 外层模块显式export | 只给composition选择，不re-exportprovider/private到Contracts |
| `crates/infra/src/platform/mod.rs` | platform | 四typed PlatformAdapter导出/选择 | 按installation/config资格选择，不泛化平台ID/receipt |
| `crates/infra/src/platform/slack.rs` | platform.slack | SlackPlatformAdapter的private ingress/callback/delivery/probe映射 | HMAC与scope、event_id/ts/thread差异、method/发行类别限流；business result与ACK分开 |
| `crates/infra/src/platform/mattermost.rs` | platform.mattermost | MattermostPlatformAdapter映射 | trusted server/plugin/context、PAT非内部授权；post/root/变化/实例pin和部署限流 |
| `crates/infra/src/platform/telegram.rs` | platform.telegram | TelegramPlatformAdapter映射 | bot范围update、poll/webhook互斥、callback ACK/topic差异；offset非owner提交，retry_after资格 |
| `crates/infra/src/platform/discord.rs` | platform.discord | DiscordPlatformAdapter映射 | HTTP/Gateway互斥、Ed25519/session/intent/token私有期限；bucket/major/global下界和resume gap |
| `crates/infra/src/owners/mod.rs` | owners | 六正式owner适配导出 | 组合消费正式权限/结果，不是新authorizer，不链接owner私表 |
| `crates/infra/src/owners/conversation.rs` | owners.conversation | ConversationHandoff/material/source/result/recovery需求的真实绑定 | BridgeMapped/AppendFact Integration/required digest沿正式合同；提交未知原op查询，不伪造submitTurn |
| `crates/infra/src/owners/identity.rs` | owners.identity | AI身份/责任锚点消费 | 不通过external_id创建GlobalMember或承接human认证；完整scope来源待核 |
| `crates/infra/src/owners/governance.rs` | owners.governance | Binding/Presentation/Actor/OwnerAction qualification所需治理绑定 | Policy/Gate/safe disclosure/current action由owner证明；无默许approve或敏感外显 |
| `crates/infra/src/owners/artifact.rs` | owners.artifact | authorized附件/material ref/propagation/expiry绑定 | 不缓存raw attachment/file URL；缺准入必要材料blocked |
| `crates/infra/src/owners/workspace.rs` | owners.workspace | 条件safe read/export/visibility provenance绑定 | 只选择分支使用；保留WS开放项，不取频道/权限truth |
| `crates/infra/src/owners/observability.rs` | owners.observability | canonical/admission/consumer result/recovery需求绑定 | 十二affected不关闭；缺mandatory先阻IO/mutation，ACK不造accepted/evidence |
| `crates/infra/src/events/mod.rs` | events | event transport adapter export | 无新增producer/接口语义或Bus Cargo依赖 |
| `crates/infra/src/events/transport.rs` | events.transport | 有资格event/source/ACK与安全envelope转换 | Bus/SDK transport产品未选；不存raw body，也不以transport ACK代consumeracceptance |
| `crates/infra/src/persistence/mod.rs` | persistence | local store/commit proof导出 | 不暴露owner表或通用payload repository |
| `crates/infra/src/persistence/local_store.rs` | persistence.local_store | Installation/Mapping/Inbound/Delivery/Callback/Continuity/Lane/SafeTraceRepository与LocalUnitOfWorkPort的driver绑定责任 | 本地truth/ref、安全结果/审计/条件handoff同UoW；namespace/unique effect/CAS，具体schema/DB未选 |
| `crates/infra/src/persistence/commit_probe.rs` | persistence.commit_probe | 对原op LocalCommitDisposition的权威只读probe绑定责任 | 提交ACK lost保indeterminate，不换op重apply；NotFound/回滚推断不能当proof |
| `crates/infra/src/private_material.rs` | private_material | PrivateMaterialPort合格provider读取/转换绑定 | exact source/version/authority、瞬时handle、清理与expiry；不durable缓存，owner未合格blocked |
| `crates/infra/src/secrets.rs` | secrets | SecretResolutionPort provider/ref/version/scope/rotation/revoke绑定 | 最小生命周期private handle；无KMS预选/明文fallback，token/rawerror不出seam |
| `crates/infra/src/audit.rs` | audit | safe log/trace/metric/交接allowlist与finite error清洗 | 不建第二mutation producer，不输出正文/可还原派生/raw body hash；query不写业务audit |
| `crates/infra/src/configuration/mod.rs` | configuration | 配置加载/验证/资格导出 | 只safe配置边界，值与profile到04 |
| `crates/infra/src/configuration/settings.rs` | configuration.settings | runtime adapter/config/opaque ref绑定结构 | 不重复owner权限模型，secret值/安装证据不放settings |
| `crates/infra/src/configuration/load.rs` | configuration.load | structured安全配置读取入口 | 不自行拼token/URL/rawsecret，具体格式/优先级到04/Step14核 |
| `crates/infra/src/configuration/validate.rs` | configuration.validate | 必需seam/pin/route/namespace/lower-bound和模式互斥检查 | 未选产品或required缺失拒绝装配，禁止自动fallback/缩短平台等待 |
| `crates/infra/src/configuration/qualification.rs` | configuration.qualification | ConfigQualificationPort实际binding责任 | 只根据current installation/provider/capability来源给资格，不创建平台安装 |
| `crates/infra/src/runtime/mod.rs` | runtime | 外层composition/execution导出 | 只有入口依赖，不反向流入domain/application |
| `crates/infra/src/runtime/composition.rs` | runtime.composition | port组装、fixed authorized route与合格builder | core已确认，SDK/driver/executor未选先blocked；不能生产装配test fake |
| `crates/infra/src/runtime/execution.rs` | runtime.execution | executor-neutral需求到未来合格executor的bounded run/shutdown映射 | 停等/timeout/cancel不撤销外部op，unknown交原subject恢复；产品资格到Step14 |

#### 文件布局树: 三入口role与五bounded job动作

```text
quantalithos-bridges/crates/
|  +-- api/src/
|  |   +-- lib.rs                 # qualified immediate entry dispatch
|  |   +-- main.rs                # bridges-api composition root, product blocked
|  |   +-- management.rs          # C01-C06 trusted management dispatch
|  |   +-- query.rs               # Q01-Q04 strict read-only dispatch
|  |   +-- platform.rs            # private HTTP ingress and callback ACK
|  +-- worker/src/
|  |   +-- lib.rs                 # resident runner exports
|  |   +-- main.rs                # bridges-worker qualified composition root
|  |   +-- consumers.rs           # qualified E02/E04 event dispatch
|  |   +-- platform_sessions.rs   # configured E01/E03 poll or session dispatch
|  |   +-- scheduling.rs          # bounded existing-subject job scheduling
|  +-- jobs/src/
|      +-- lib.rs                 # shared five bounded invocation entries
|      +-- invocation.rs          # trusted context, scope and original op checks
|      +-- bin/
|          +-- dispatch_queued_delivery.rs      # J01 existing intent only
|          +-- reconcile_bridge_operation.rs   # J02 original operation proof
|          +-- reconcile_stream_gap.rs         # J03 same stream epoch coverage
|          +-- retry_safe_handoff.rs           # J04 same canonical operation
|          +-- refresh_bridge_qualification.rs # J05 existing subject maintenance
```

关键说明：

- main/bin计划命名不表示已选HTTP、executor、部署或scheduler，实际runtime root资格仍blocked。
- platform HTTP与poll/session按installation模式互斥；E01/E03仍是同一Application流程，ACK不证明owner接纳。
- worker调用jobs库的invocation，不重复五用例；不存在新增CLI/无限replay/broadcast操作。

#### 入口逐文件职责

| 文件路径 | 所属模块 | 定义内容 | 主要责任 |
|---|---|---|---|
| `crates/api/src/lib.rs` | api | 管理/query/platform即时dispatch导出 | 不反向被核心依赖，不创建业务对象真相 |
| `crates/api/src/main.rs` | api runtime root | bridges-api合格composition入口 | 具体server/executor未选即不激活；transport来源与内部trusted actor分开 |
| `crates/api/src/management.rs` | api.management | 六command协议解码与Application调用 | trusted ActorContext/metadata、局部结果，不在HTTP handler自己grant/createTurn/send |
| `crates/api/src/query.rs` | api.query | 四query协议解码、safe view响应 | no-write/no audit/dedup/refresh/probe，qualified scope不可由ref文本推断 |
| `crates/api/src/platform.rs` | api.platform | 平台HTTP入站/回调验证接缝与ProtocolAckPlan执行 | 原body只private瞬时交infra验证，来源/安装固定；ACK/可靠接管/owner结果分开，无raw inbox |
| `crates/worker/src/lib.rs` | worker | 常驻consumer/session/scheduling导出 | 仅受限runner，不包含独立领域模型 |
| `crates/worker/src/main.rs` | worker runtime root | bridges-worker合格composition入口 | shutdown/cancel保原op unknown；无缺配置自动选择provider |
| `crates/worker/src/consumers.rs` | worker.consumers | E02 committed source、E04 consumer disposition受信event分派 | qualified producer/envelope/marker，transport ACK不是业务success |
| `crates/worker/src/platform_sessions.rs` | worker.platform_sessions | 当前合格poll/Gateway/session模式E01/E03分派 | installation/scope/epoch资格、互斥配置、gap保守；不把platform session作为身份权限 |
| `crates/worker/src/scheduling.rs` | worker.scheduling | 既有eligible intent/recovery/gap/handoff/qualification subject的有界任务调度 | 调同jobs库，claim/fence/current资格由Application复核；lease到期不自动新效果 |
| `crates/jobs/src/lib.rs` | jobs | 五bounded任务公共invocation入口 | 单次任务API供worker/bin，无新通用维护权限 |
| `crates/jobs/src/invocation.rs` | jobs.invocation | 受信job context/continuity metadata/原subject scope检查 | 不伪造user actor/run、不新建effect；完整函数合同后续闭口 |
| `crates/jobs/src/bin/dispatch_queued_delivery.rs` | jobs.bin | dispatch_queued_delivery入口 / J01 | 仅既有intent的受限dispatch，safe attempt/result与unknown回收 |
| `crates/jobs/src/bin/reconcile_bridge_operation.rs` | jobs.bin | reconcile_bridge_operation入口 / J02 | 原subject/op/effect权威只读probe；无proof则manual |
| `crates/jobs/src/bin/reconcile_stream_gap.rs` | jobs.bin | reconcile_stream_gap入口 / J03 | 同stream/epoch qualified coverage，禁止raw replay/跨流游标推断 |
| `crates/jobs/src/bin/retry_safe_handoff.rs` | jobs.bin | retry_safe_handoff入口 / J04 | 同canonical/op获准重交；consumer unknown不换身份重发 |
| `crates/jobs/src/bin/refresh_bridge_qualification.rs` | jobs.bin | refresh_bridge_qualification入口 / J05 | 既有安装/relation/current来源维护，关联失效，不刷新出权限 |

#### 文件布局树: member测试发现与测试专用support

```text
quantalithos-bridges/crates/
|  +-- contracts/tests/protocol_surface_tests.rs # safe public type boundaries
|  +-- domain/tests/local_guards_tests.rs        # 20 objects and 17 state guards
|  +-- application/tests/
|  |   +-- authorization_flow_tests.rs          # explicit basis and body-free guards
|  |   +-- continuity_flow_tests.rs             # key, effect, cursor and unknown
|  |   +-- safe_read_tests.rs                   # no-write and visibility boundaries
|  |   +-- support/
|  |       +-- mod.rs                          # test-only support exports
|  |       +-- qualified_ports.rs              # explicit synthetic port outcomes
|  +-- infra/tests/
|  |   +-- platform_boundary_tests.rs          # four platform protocol differences
|  |   +-- local_commit_boundary_tests.rs      # original op commit proof windows
|  |   +-- private_material_boundary_tests.rs  # handle lifetime and leakage boundary
|  |   +-- support/
|  |       +-- mod.rs                          # test-only provider support exports
|  |       +-- qualified_providers.rs          # synthetic provider classifications
|  +-- api/tests/inbound_dispatch_tests.rs     # immediate entry and ACK separation
|  +-- worker/tests/consumer_dispatch_tests.rs # resident source and mode dispatch
|  +-- jobs/tests/job_invocation_tests.rs      # bounded trusted existing-subject input
```

关键说明：

- 测试文件由Cargo member/tests发现；support/mod.rs只被引用，不成为单独test binary。
- fake/provider合成结果必须明确test-only，不构成真实owner权限、账号/token、receipt或送达证据。
- 当前仅计划测试职责，无测试实现/执行/结果；完整TC、fixture、suite、报告/门禁脚本留Step16与05~07。

#### 测试逐文件职责

| 文件路径 | 所属模块 | 定义内容 | 主要责任 |
|---|---|---|---|
| `crates/contracts/tests/protocol_surface_tests.rs` | contracts tests | safe protocol/public传递类型边界检查 | metadata单一来源、private不入wire；具体cases到Step16/05 |
| `crates/domain/tests/local_guards_tests.rs` | domain tests | 局部对象guard/非法状态边检查 | 17机与三无机、known result/ref/current资格，不造外部事实 |
| `crates/application/tests/authorization_flow_tests.rs` | application tests | explicit binding/current basis/敏感外显与one-use切口 | 六U权限/材料保护不因ACK/签名/安装admin绕过 |
| `crates/application/tests/continuity_flow_tests.rs` | application tests | 语义唯一、原op、cursor/coverage/lane/unknown切口 | C04/E02不同namespace同effect、429下界、缺proof不重apply |
| `crates/application/tests/safe_read_tests.rs` | application tests | query visibility/page/degraded/no-write切口 | 无audit/dedup/refresh/probe/count/ref泄漏 |
| `crates/application/tests/support/mod.rs` | test-only support | qualified_ports导出 | 不进入production lib/默认composition |
| `crates/application/tests/support/qualified_ports.rs` | test-only support | 按真实port形状的显式合成outcome/provider脚本 | 不补缺owner合同，不出真实账号/token/commit/proof或验收材料 |
| `crates/infra/tests/platform_boundary_tests.rs` | infra tests | 四平台来源/ACK/change/thread/附件/result/limit边界切口 | 合成协议不声明installation capability或实际送达 |
| `crates/infra/tests/local_commit_boundary_tests.rs` | infra tests | CAS/UoW ACK lost/原op只读proof/唯一结果边界切口 | driver未知不能当rollback；具体DB fixture不预选 |
| `crates/infra/tests/private_material_boundary_tests.rs` | infra tests | secret/material生命周期/SDK logging/rawerror边界切口 | 不用真实敏感body/secret持久夹具；必要合成bytes仅private内存、不写证据 |
| `crates/infra/tests/support/mod.rs` | test-only support | qualified_providers导出 | 与生产provider/runtime隔离 |
| `crates/infra/tests/support/qualified_providers.rs` | test-only support | 明确synthetic分类的private/provider stub | 不提供生产fallback，不能证明真实commit/no-effect/consumeraccepted |
| `crates/api/tests/inbound_dispatch_tests.rs` | api tests | 即时dispatch/trusted context与ACK切口 | 不把private平台headers当内部actor；可靠接管另验 |
| `crates/worker/tests/consumer_dispatch_tests.rs` | worker tests | producer/session/mode互斥与shutdown切口 | 同stream不双接管，取消不证no-effect |
| `crates/jobs/tests/job_invocation_tests.rs` | jobs tests | 五bounded invocations/trusted context/original subject切口 | 不新增subject/op/effect或无限重发；无伪run |

当前七plannedgate/check/report脚本已由05的TEST-03-001在下段/正式§4.4和§15登记完整路径/I-O/失败合同，仍未实现或运行，不建scripts/reports/artifacts占位。05§13负责固定run的localharness schema/安全writer/reader/具体TC-EV链，06负责验收，正式07完成才分boundary。design-calibration设计登记不能充当真实报告/EV。

G3草稿：正式§4拼入infra/entry/tests树与逐文件职责；保留产品未选与test-only区分。G3自检pass：实际只读反查161tree/161责任文件、4平台/6owner/7bin/19flow，errors=[]；tests support只供tests，不进production/runtime，不运行测试。只允许G4。

### 7.4 G4 跨组闭环审计

#### 命名检查

| 检查项 | 通过条件 | 结果 |
|---|---|---|
| 实现仓/slug | planned `/home/aris/Projects/quantalithos-bridges` / bridges | pass计划命名；路径实际未存在，不伪造创建 |
| workspace member | 只七`crates/<role>`；不重复project前缀 | pass；无cli/ops/config/observability空member |
| Cargo package | bridges-contracts/domain/application/infra/api/worker/jobs | pass；无L6、quantalithos内部前缀或core_contracts式目录 |
| Rust library | bridges_contracts/domain/application/infra/api/worker/jobs | pass；imports用underscore，package用hyphen |
| binary | bridges-api、bridges-worker；五具体动作名 | pass；名字表示即时/常驻/有界入口，不造新动作 |
| file/module/type/function | 文件/module snake_case、类型/variant UpperCamelCase、函数snake_case/英文 | pass计划路径；完整函数/variant到后续合同再核 |
| 架构层级泄漏 | planned code路径/包无L0/L1/L6/l0_/l1_等 | pass静态路径检查；设计目录和业务U标号仅文档追溯 |
| 明确职责 | 无generic service/manager/helper/utils/common顶层或空占位 | pass；每树文件均有责任行，未选产品不产生虚构驱动文件 |
| 测试发现 | member/tests顶层测试target、support/mod.rs内模块 | pass计划；没有运行test或生成fixtures/artifact/report |
| Cargo path位置 | core路径来自真实Cargo布局，只在root登记、member继承 | pass；SDK/owner/Bus不默认进入compile图 |

#### 跨组主语与安全一致性

| 审计面 | 当前闭合 | 仍未关闭 / 后续要求 |
|---|---|---|
| BC/U/实现单元 | 一个BC、六业务轴映19model+public view与七role，无新truth owner | Step5模块capability后闭具体职责/公开面，不能把U当六服务 |
| 20对象/17机/三无机 | 每对象唯一路径，BridgeLocalView单一contracts定义；17机按model归属 | Step6/10完整字段/variant/transition；当前没有完整schema或新机 |
| 20协议/19flow | C6/E4/Q4/J5各独立Application文件，O01仅条件event+mutation source | Step8/9全部输入输出/metadata/结果/函数/副作用，ACK与owner/平台/consumer分离 |
| 23port | 3+3+3+4+3+3+4逐名称唯一责任文件 | Step7逐callable、read/write/authority/version/error，缺foreign合同blocked |
| 243既有名称 | 路径附录完整唯一，22文件均有职责，4core重导出/5private/9snapshots/既有model区分 | Step6~8闭fields/value/required-by-state/transitive公开面，243不是未来类型数上限 |
| four adapter | Slack/MM/Telegram/Discord独立映射路径，各ACK/线程/变更/限流差异保留 | BR-UP-007/008及Telegram官网service contract缺口不关；Step7/8/14逐pin/安装/method核 |
| owner/compile | 六owner adapter runtime消费；SDK条件；core仅已核共享exports | 不新增owner/Bus源码依赖、不mirror内部truth、不自动GlobalMember |
| private/config/secret | Application私有载体、infra材料/secret读取/config/runtime职责和public wire隔离 | Step6/7/14/04需闭lifetime/factory/revoke/grant/固定route/pin；无raw日志证据/明文fallback |
| local commit/effect/cursor | store/commit_probe明确责任；shared semantic effect、原op、namespace/epoch/comparator/coverage不合并 | Step9/11~13具体proof/unique/CAS/读取/result/crash；NotFound/timeout/lease不证无效果 |
| safe trace/read | 唯一mutation source，conditional O01，mandatory不足先阻副作用；query只读safe view | BR-UP-006与十二affected原状态，不能audit-only绕mandatory或把record当evidence |
| tests与实现事实 | test-only合成provider、发现路径，无生产fallback或真实测试结果 | Step16/05~07完整方案；不伪artifact/report/run/commit/signoff/readiness |
| 当前授权 | 只四步组织设计；formal03/Step5与实施写权限仍false | 最终等待用户授权Step5；未来脚本/拆文件须回本Step同步反查 |

复杂度结论：四组按思考/结构化/草稿/自检串行，七目录树与逐文件职责完成；243名称独立附录避免主布局淹没，跨组表检查而非新增flow/state图。当前不把全部160余计划文件一次性创建为代码，也不提前细化未来Step。

### Planned脚本与local test-harness承接合同（05必要反校准）

2026-10-04；05已获用户授权，登记TEST-03-001。只增加以下七个planned脚本责任位置和S/P原testtarget内test-only harness DTO职责；不新增Rustsource文件/业务DTO/port/state/DDL，不创建脚本、输出目录、实现台账或boundary。旧161文件统计仍为Step4当时审计，当前具名planned职责新增7；其实现/boundary由正式07完成时登记。

#### 文件布局树: planned测试门禁与报告工具

```text
quantalithos-bridges/scripts/
|  +-- gates/
|  |   +-- run-bridge-local.sh
|  |   +-- run-bridge-real-seams.sh
|  |   +-- run-bridge-release.sh
|  +-- checks/
|  |   +-- check-bridge-run-context.sh
|  |   +-- check-bridge-test-evidence.sh
|  +-- reports/
|      +-- build-bridge-test-report.sh
|      +-- build-bridge-acceptance-handoff.sh
```

关键说明：全部planned；脚本不得放reports。gate产生安全机器材料，check只验证，report只读取机器产物再形成可审查初稿；三个角色都不授qualification或裁决。脚本能力/S-P自测、minimal index shell、finalEV pages、human acceptance handoff四成熟度不互证。

| 完整planned路径 | 类型/输入 | 输出/职责 |
|---|---|---|
| `scripts/gates/run-bridge-local.sh` | gate；原十一target的synthetic套件及TOOLS | cargo按11membermanifest/testtarget运行；profile声明expected实例、输出safe context/case/suite/index；不外呼 |
| `scripts/gates/run-bridge-real-seams.sh` | gate；SUITE-REAL与actual B/L/A/C/P/I/W/J | 先actualselected资格/安全sandbox/current注册；任一缺失blocked，绝不fallbackfixture；逐actualcase输出typed安全结果 |
| `scripts/gates/run-bridge-release.sh` | gate；fixed-run complete coverage汇总（非部署/验收裁决） | 只读同run已有synthetic+real-seam实例/contexts；两个check→两个report；少actual实例blocked，无新effect/伪pass |
| `scripts/checks/check-bridge-run-context.sh` | check；immutable context与approved safe profile/manifest/qualification | 校验run/build/config/selection/mode/qualification slot；不读secret值/业务ref，context缺失/漂移拒；零网络或业务mutation |
| `scripts/checks/check-bridge-test-evidence.sh` | check；case/suite/index/safe blobs与本05完整schema | 验证schema/digest/baseline/封闭实例/TC→DS→suite→EV→AC/allowlist与redaction；不造case/result/consumer接受 |
| `scripts/reports/build-bridge-test-report.sh` | report；经两check验证的原case/suite/index | 生成reports/runs/<run_id>/summary.md、evidence/<EV-ID>.json及index.json；不从静态plan造passed |
| `scripts/reports/build-bridge-acceptance-handoff.sh` | report；validated runreport/EV及原00 AC计划映射 | 生成reports/acceptance/<run_id>/handoff.md/json初稿；human/Agent review另reports/review/<run_id>/，不自动verdict/signoff/readiness |

参数合同：全部脚本支持`--run-id`（required，`^br-[0-9]{8}T[0-9]{6}Z-[a-z0-9]{6,12}$`）、`--artifact-root`（省略时仅`artifacts/test/<run_id>`）、`--config-profile`（required，04selector ASCII grammar的批准harnessprofile标记，不是raw config/ref）、`--help`（无运行IO）。重复/未知/缺参数拒，不能eval任意命令。artifact-root即implementationrepo内固定该run根；不同位置/absolute/.. /symlink/错误run拒，不能扩大写入范围。CLI是test-only，不新增production三入口参数。

I/O合同：context.json、case/suite安全JSON、index.json及非JSONtoken-only stdout/stderr在`artifacts/test/<run_id>/`；report到`reports/runs/<run_id>/`和`reports/acceptance/<run_id>/`，review只人审。完整harness schema/digest与文件清单由05§13固定；无latest或<project>层。case writer来自真实runner逐实例，stdout/stderr不inherit：未验证output仅bounded私有内存，每stream64KiB上限；安全allowlist后才写token-only blob，不保存raw SDK/平台错误或compiler自由文案。禁止消息/附件body、token/secret/私有callback/敏感审批及可还原派生，连摘要也不保留。

runner合同：仅调用原11target的membermanifest和Cargo test binary；例如S固定`cargo test --manifest-path crates/contracts/Cargo.toml --test protocol_surface_tests -- --test-threads=1`，其他按原target路径derive，不任意filter/跳过params。S/P testtarget内test-only DTO/writer先验safe字段后输出case artifact；不可导出到production wire/lib。只可用test-only env `BR_TEST_RUN_ID`/`BR_TEST_ARTIFACT_ROOT`/`BR_TEST_CONFIG_PROFILE`/`BR_TEST_MODE`/`BR_TEST_CONTEXT_PATH`传非敏感harness上下文，不能传token或原config值。每suite timeout从批准harnessbudget显式取得，缺失blocked；timeout/scopedcancel保existing safety材料和实际原unknown/对账责任，不retry整个real suite造新effects。

有限退出：0=该工具本次合同通过（非readiness）；1=assertion/check失败；2=参数/schema/path错误；3=blocked资格/coverage/baseline；4=unavailable工具/环境/IO。失败/blocked/unavailable保留已有安全artifact/report与有限failure分类，不能制造替case、伪通过或echo canary/raw error；无法安全建立context时仅有限stderr，不编造context或run实例。每run独占writer，immutablecontext/case输出禁止覆盖，minimalindex到finalindex只受控CAS/atomicrename；报告重复生成须同内容或拒冲突，不覆盖旧run。

状态仍planned/not_run/blocked实际seam；正式07才指定全部planned implementationboundary，implementation/test/stage/commit权限=false。

## 8. 回填草稿

正式03§4以后按“布局形态 -> 七实现单元/目录package/lib/bin -> 七tree -> 对应逐文件职责 -> compile方向/Cargo路径 -> 20对象/20主语/23port与243附录承接 -> 命名/跨组审计”装配。§3沿Step3；§16/17承接本Step产品/schema/source资格和后续范围。

BridgeLocalView唯一归contracts不改变02业务对象/状态归属；19model和public只读载体共同覆盖20对象。正式正文必须保留目标仓未存在、产品not_selected、完整schema/签名仍pending、本轮无实现/测试事实的限定。草稿不新增结论；正式03不写，装配Step19未授权。

## 9. 待确认事项

| 待确认 / 边界 | 当前状态 / 受限范围 | 后续关闭依据 |
|---|---|---|
| 完整module/type/port/protocol/flow/state schema | 工程归属closed，合同schema_pending；不得据目录移交实施 | 授权后Step5~13逐capability/243载体/读取面/原op proof闭口，缺口回02/01 |
| executor/HTTP/poll/Gateway/DB/Bus/cache/平台SDK产品 | not_selected，runtime composition与具体adapter/driver正向分支blocked | Step7/14受正式资料与安装资格核验、04配置值，07真实closure/环境门禁 |
| SDK客户端/传递closure/core实际构建 | core exports verified但未build；SDK条件，不默认Cargo绑定 | Step6~8真实type/callable、Step14版本pin/closure、07真实repo/toolchain检查 |
| secret/OAuth/PAT/API Key/KMS/route | provider/not_established，只有opaque引用和private最小生命周期职责 | Step7/14/04正式grant/scope/rotation/revoke/current basis/SSRF固定target；不可要求用户交明文secret |
| owner/material/Gate/action/read/producer/continuity | BR-UP-001~009=open，010=reference_only；Workspace开放项及十二affected不变 | Step1§7、正式02§13.3、00 Step15原释放依据；不跨项目回写 |
| 测试/证据脚本/实施台账与边界 | 此步仅test file计划，未交付脚本/fixtures/run/artifact/report；无实施ledger | Step16/05~07具体脚本回填本Step；正式07完成才创建planned/blocked/waiting实施台账与全部boundary skeleton |
| 目标实现仓与提交 | planned target未存在；本轮没有mkdir/code/build/test/stage/commit授权 | 未来明确实施授权后按07核验，当前commit_required=false |
| 当前Step5权限 | 未授权，与产品/owner blocker是不同门禁 | 本Step4完成后等待用户明确授权，不以“继续”扩大原到Step4上限 |

## 10. 自检及进入下一步条件

| 自检项 | 结论 | 实际依据 |
|---|---|---|
| 四组顺序/思考门禁 | pass | G1~4骨架先建，各组问题/诊断/取舍后结构化/草稿/自检，前组pass才下组 |
| 必需布局产物 | pass | workspace决策、七unit/package/lib/bin、七tree、逐文件责任、命名与真实core path全部完成 |
| tree与责任反查 | pass | Node只读161tree/161唯一责任文件，19flow/4platform/6owner/7bin，errors=[] |
| 对象/接口/port/类型 | pass | 20对象/20主语/23port/243既有名称，22type责任路径唯一；public view/core/private/内部snapshot区分 |
| 依赖与产品资格 | pass组织边界 | 核心无反向产品依赖，core真实导出，SDK仍条件；运行产品/owner/source缺口仍blocked，不作readiness |
| metadata/secret/body-free/未知/read | pass保留设计保护 | required key单一来源、private生命周期责任、ACK分层、原op commit proof、query无写、mandatory admission |
| 历史/正式文件范围 | pass | 独立结论后历史扫描；旧03/README和00/01/02从Step3恢复的五hash一致；02此前仅状态同步 |
| 链接/表格/围栏/空白 | pass已复查停点 | 七03当前文件（含flow/项目ledger）最终78表/20围栏/30相对链接；结构errors=[]，diff --check通过；三层核心停点字段一致 |
| 上游状态/事实/授权 | pass边界 | BR-UP/Workspace/十二affected未关；未来Step文件0、实施台账/边界0；无代码/项目测试/外部事实/提交 |

过程如实记录：首次243分组草拟漏InboundRecordRef，落盘前补齐；tree审计首列识别限制已通过职责表重排关闭；工具临时store在用户继续消息后失效，phase调用报TypeError，立即读磁盘台账并恢复三层一致，未在不同步状态写G3结论。早期跨父目录探测遇无关权限拒绝、读取输出截断和helper eval错误，相关范围已改用精确路径/分段读取；未在失败中修改其他项目或宣称全文/测试已完成。

```text
current_document = 03
current_step = 4
current_module = step04_complete_waiting_user
document_status = in_progress
step_work_status = done
step_self_review = pass
gate_status = blocked
gate_reason = authorized_stop_at_step04
next_allowed_action = wait_for_user_authorization_of_03_step05
source_files = Step2/Step3/Step4/02_formal/243_type_path_index/current_SOP_and_standards
formal_backfill_allowed = false
formal_document_write_allowed = false
formal_03_assembly_allowed = false
step05_allowed = false
implementation_ledger_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

Step4工作/自检已完成；blocked只表示当前用户授权到此，不表示产品/owner blocker已关闭。后续获明确授权后先读详细SOP Step5/书写§5.5、当前Step4/Step3和正式02§4/5/12及需用owner合同，再建Step5当前骨架。正式03仍historical_material，不装配、不产生正式03停审或签署结论。

停点写入后已只读复查：七文件78表/20围栏/30相对链接，20对象/20主语/23port/243类型及22归属路径，errors=[]；Step1~4 done、Step5~19未授权、三层核心门禁一致，五正式输入hash仍匹配，git diff --check通过。无运行测试或新增实现/外部证据；最后审计记录写入后保持同一停点。
