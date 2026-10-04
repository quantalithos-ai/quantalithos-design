# L6-bridges 03 Step3：编码、运行模型与多仓依赖约束

## 1. Step状态、开工确认与内计划

done / pass；full-restart / single-agent-serial；拟回填正式03§3，当前正式回填false。

| 开工项 | 记录 |
|---|---|
| 三层许可 | 用户授权至Step4；前序自检pass；只当前Step可写 |
| 通用规范 | 通则/中间产物/真相源适用纪律沿Step1已复核；本步前回读前序门禁 |
| SOP/书写 | 详细SOP Step3 / 书写§5.3及§4.3已读 |
| 输入 | Step2全文/Step1待确认；正式01§8/11、02§4/7/11/12；Rust源码语言/Rustdoc/命名/格式、目录规范全文、实施§4.9及项目git配置、旧清单R9/R12冲突；core/SDK真实workspace/package/export |
| 模块骨架 | done；具体分组见结构化前复杂度判断，未来Step未创建 |
| 写入纪律 | 先问题/诊断/取舍，后结构化/复杂度/草稿/自检；历史只后置审计 |

| 内计划 | 状态 | 产物 |
|---|---|---|
| 读取输入/前序 | done | §2 |
| SOP问题回答 | done | §3 |
| 当前材料诊断 | done | §4 |
| 设计取舍 | done | §6 |
| 结构化产物 | done | §7 |
| 复杂度判断 | done | §7 |
| 历史差异/草稿 | done | §5/8 |
| 自检/下一步 | done / pass | §10 |

## 2. 本步输入

Step2全文/Step1待确认；正式01§8/11、02§4/7/11/12；Rust源码语言/Rustdoc/命名/格式、目录规范全文、实施§4.9及项目git配置、旧清单R9/R12冲突；core/SDK真实workspace/package/export。前序问题回答、诊断、取舍、待确认均为输入，不只引用最终表。

## 3. SOP问题回答

1. 本地计划选择Rust 2024，MSRV `1.93`，默认工具链计划`1.93.0`；依据core/SDK真实workspace与共享类型需求，而非声明01已指定语言。Domain同步纯函数；Application/port采用executor-neutral的`std::future::Future`异步IO模型，具体executor/HTTP/DB/Bus/平台SDK未选且不得默认装配。选择语言不等于平台Rust SDK成熟度或真实build已验证。
2. Rust规范当前明确英文源码、Rustdoc、命名/所有权转换/格式；未完整规定本项目的错误、trait、async和并发方案。typed `Result`、private材料禁止通用Debug/serde、deadline/cancellation/unknown与无隐式retry来自00/01/02安全要求，在本项目约束表单独定责，不伪称通用规范已有全部条款。
3. 设计契约示例按详细书写§4.3使用中文`///`/`//!`说明；实际Rust文件的标识符、普通注释、Rustdoc、测试名与错误说明用英文。struct写对象边界/不变量，字段写含义/来源/约束，enum写有限集合边界，**每个variant**单独写语义及载荷，trait/函数写输入输出、变化/不变、错误/unknown与副作用。实现翻译必须保全契约，不能删注释或variant；设计示例不是可直接复制的英文源码模板。
4. 实施前必须读取实施计划书写§4.9完整commit规则、项目级git配置要求、Rust及目录规范和未来正式07。实现仓英文`type(scope): subject`、body按boundary子功能列文件和改动量、真实换行、footer前空行及实际参与者Codex；设计仓中文例外不能传到实现仓。只在目标项目设user.name/email，不用--global；本轮无提交或git配置修改授权。
5. 不实现内部认证、human账号建立、GlobalMember生命周期、Conversation/Turn、Policy/Gate/Decision、Artifact或Workspace owner真相；不建立通用gateway/动态路由fallback。Bridges验证来源、显式binding依据、current资格及局部结果，再通过正式owner/平台seam；平台管理员/签名/OAuth安装不证明内部操作权限。
6. core/SDK实现仓实际存在；这里只核实manifest和必要exports，没有运行build/test，没有宣告owner-specific兼容。默认Bridges实现路径未存在，不能在设计任务创建。
7. 01已裁剪的编译候选中，现核实`core-contracts`的actor/metadata公开导出，确认其为本仓共享metadata类型的计划编译依赖。SDK仍为条件编译候选：`sdk-client`实际连application/domain/infra，`sdk-contracts`又连bus-contracts，不能当无传递影响的轻客户端或仅metadata包。未核实的owner-specific桥接调用保持BR-UP-007，暂不列为无条件Cargo dependency。
8. 精确已核路径为`/home/aris/Projects/quantalithos-core/crates/contracts`、`/home/aris/Projects/quantalithos-sdk/crates/contracts`和`crates/client`。当前目标`/home/aris/Projects/quantalithos-bridges`未存在。并未为运行期owner关系探索或创建源码依赖。
9. 已确认core依赖默认本地path；路径写在目标workspace根Cargo，member用`workspace = true`。中期private git tag/rev仅迁移候选，未填写URL/tag/rev或发布crates.io前置。SDK只有完整合同/依赖闭包/安全资格通过后才可启用真实path；不能用fake同名共享crate替换缺失仓。
10. Conversation/Identity/Governance/Artifact/Workspace/Observability是runtime或event协作，Bus是条件event协作；四平台、secret resolver/KMS、固定受权路由为外部runtime seam。它们不进本仓Cargo path表，client调用/consumer ACK/event接纳仍要分别闭合，不因本地同级目录存在升级编译依赖。L5-chat继续reference_only。

## 4. 当前材料问题诊断

01§8是core/SDK候选，不是已选包；02类型名不是SDK现成API。实际core的RequestMetadata持有可选idempotency_key，Bridges写入口须检查required，不另造顶层key；QueryMetadata含page/consistency但不许可query写audit/refresh。core ActorRef/ActorContext是载体，不自动建立trusted actor或external human权限。SDK metadata重导出和泛型client不能证明BridgeTargetMode/AppendFact/Gate callback已经有匹配调用。

三份规范的注释/提交口径存在可定位差异：旧清单R9中英文、R12中文+Claude；详细设计要求中文Rustdoc示例；更新Rust与实施规则要求实际源码/实现commit英文。必须按“设计示例vs实际源码、设计仓vs实现仓”分开，不复制旧清单宽松条款，也不在本轮修改规范源。

多入口与平台IO需要异步边界，但当前没有合格executor/transport/provider选择来源。以Tokio/Axum/SQLx或Python+TS当默认会让实现者绕过BR-UP-007/008/009。明确Future模型和禁止默认装配足以确定文件分层；它不满足实际运行root资格，后续Step7/14和04仍须核验具体产品与取消/提交未知合同。

## 5. 改动前后及历史差异

| 历史位置 / 旧口径 | 本步结论 | 回填影响 |
|---|---|---|
| README仓定位/关键依赖：Python主+TS Slack、sdk-python/TS及四平台预选包 | 不继承；当前Rust核心是本地新计划约束，平台实现产品仍未选 | §3写语言/runtime模型和资格，不宣称这些历史包仍已安装/合格 |
| README安全：KMS与OAuth优先/API Key fallback | 不继承产品和自动fallback | secret/provider/grant/固定target逐seam资格；未选产品不能进入默认路径 |
| README目录：pyproject/poetry/pnpm、common/bridged_turn | 不作为Rust工程输入；Turn不是外部Message镜像 | Step4按当前职责独立布局；不添加Python/TS构建链或内部Turn对象 |
| 旧03§3/7泛化入口/timeout/replay | 不升级已有代码/调用资格 | 原op unknown/有限结果模型来自当前02；本Step不恢复自动retry |

历史只在§7结论落盘后核读README全文及旧03对应索引，未修改两者。旧清单R9/R12作为规范冲突输入，不误报为已修订原规范。

## 6. 设计取舍

采用Rust-only核心和executor-neutral异步IO模型；理由是复用已核shared exports、由类型/依赖隔离不变量、多入口共享编排。暂不引入额外Python/TS进程、通用plugin ABI或并行双语言build链；若后续平台载体只能跨进程且产生新边界，必须先回01/02裁剪，不在adapter内偷扩工程职责。

核心依赖只确认已核core actor/metadata；SDK留在外层条件候选，不能经contracts传递sdk-domain/infra。具体Future的泛型/关联类型/对象安全/Send界限由Step7逐port闭口，不能在实现时随意切成dyn async trait。模型层同步；executor只由外层运行root拥有，取消/timeout不等于无副作用，port返回unknown继续走原op恢复。

未采用“全部技术未定所以由实现者自行选”，也未把产品未选伪装为本地约束缺失。语言、runtime模型、注释和依赖方向是本步已定约束；产品绑定资格是显式blocked支路，后续必须关闭后才启用对应root/IO。具体选型影响这些已定边界时必须回本Step复审。

三层检查：当前Step3问题/诊断/取舍done，允许约束表；正式回填false，Step4尚未创建。

## 7. 结构化中间产物与复杂度

### 编码规范承接

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| [Rust规范](../../../standards/coding/rust.md) 源码语言/Rustdoc、G.NAM.01/02、P.FMT.01/02 | 英文实际源码；类型/variant UpperCamelCase、函数/文件snake_case；转换体现所有权；rustfmt配置、4空格 | Step4路径/命名、Step6~8注释与private材料转换；不把格式工具当语义审计 |
| [详细书写](../../../standards/document/详细设计书写规范.md) §4.3/5.3 | 本设计中文Rustdoc；struct/字段/enum/每variant/trait/公开函数均不遗漏 | 后续合同卡保全注释；实施译为英文并逐字段/variant反查，不原样复制中文进源码 |
| [目录规范](../../../standards/document/子项目目录与代码文件组织规范.md) 全文 | `quantalithos-bridges` / slug bridges；member短role、package hyphen、lib underscore；脚本与证据分离 | Step4独立选布局、完整树和职责；不用`L6`/quantalithos内部前缀/空泛utils |
| [实施规范](../../../standards/document/实施计划书写规范.md) §4.9/项目级git配置 | 实施前完整阅读；英文有scope的commit、按boundary分组body、文件改动量、真实空行和Codex footer；本地git身份 | 未来07完整承接；本轮不commit、不stage、不改config、不虚构目标仓规则 |
| [旧清单](../../../standards/子项目遵循规范清单.md) R9/R11/R12 | R9/R12宽松语言/Claude口径不覆盖更新的场景专用规则；新外部依赖exact pin | 不让历史口径变默认；真实sibling Cargo版本字符串不等于本仓已通过pin/supply-chain资格 |
| [01](../01-架构设计.md) §4/8/11、[02](../02-概要设计.md) §7/9/11 | typed seam、current authority、body-free、独立结果、原op恢复、query无写 | 模型/port错误与async取消合同不能削弱已定保护 |
| [全局裁剪规则](../../../standards/document/全局项目依赖关系与裁剪规则.md) §4/4.1/5 | 本项目Layer5窗口；compile/runtime/event不同；本地存在不是新编译边 | Step3只在既有core/SDK候选中核实；任何新增owner/Bus编译依赖回01复裁剪 |

### 语言、runtime与实现约束

| 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|
| 本地语言计划 | Rust2024/MSRV1.93；计划toolchain1.93.0，实施前核安装和完整closure；未运行rustc/cargo或build | 所有未来member；非上游强制Bridges语言事实 |
| 纯核心 | Domain同步方法/状态guard，无executor/HTTP/DB/platform SDK；Contracts只公开safe DTO/ref，不引用Domain对象或infra | Step4核心依赖；Step6对象与state required字段 |
| 异步IO模型 | Application通过Future-based ports await有界IO；executor-neutral；泛型/关联Future/显式boxed Future的选择及Send/borrow界限到Step7逐port定，不直接以dyn async fn接口生成代码 | 23port及19入口；未闭口的签名不交实现者猜 |
| executor/框架资格 | 具体executor、HTTP/Gateway/WS/poll driver、DB/Bus/cache产品均not_selected；Step14/04资格及固定版本通过前运行root不能激活，测试fake不释放产品 | API/worker/jobs composition；不默认Tokio/Axum/SQLx |
| 有限错误/结果 | `Result`使用typed公开错误与局部disposition；owner accepted/Turn/externalreceipt/consumeraccepted分层；raw SDK/DB error只在private边界分类后丢弃 | Step7/8/12；no-effect/rollback/conflict必须权威证明，unknown不是通用Failed |
| cancellation/timeout | 取消await或任务结束只终止本地等待，不撤销owner/平台/DB已发op；保持原operation/effect、claim/fence与提交/投递unknown | J01/J03、ownerhandoff与LocalCommitDisposition；Step9/11~13补crash窗口 |
| bounded runtime | payload大小/瞬时存活、队列并发、wait/重试预算有界；lane/platform bucket下界不得由配置缩短，SDK内隐式重试必须关闭 | U2~U5 adapter与worker；数值/profile到04，模型/guard到03后续 |
| 本地truth/持久化 | 只存授权relation、mapping/cursor/dedup/intent/attempt/receipt与adapter-local safe状态；关联CAS/UoW/unique effect；禁止generic body inbox | Step4store职责，Step11真实driver原op只读commit probe |
| private材料 | 外部正文/附件bytes/敏感approval/callback/secret/rawerror及可重构派生不进durable/log/trace/handoff/evidence；private瞬时句柄不自动derive Debug/Serialize/Clone或通用Display | 入口/private codec/owner material/secret resolver；Send/生命周期到逐port审计 |
| explicit authority | 外部ID不能自动创建GlobalMember；签名/ACK/installation/grant不构成内部授权；Policy/Gate/current binding/visibility由正式owner资格支撑 | U1~U4及所有变更/IO；未成立fail-closed，不扩展网关产品 |
| safe read | Query严格no-write，无dedup/audit刷新、主动probe/repair；shared consistency/page不授权额外行为 | Q01~04/BridgeLocalView/ReadAuthorizationPort/LocalReadPort |
| safe producer | O01只是条件canonical提交阶段；mandatory canonical/admission/budget缺失先阻对应mutation/IO，非mandatory也须owner规则准许audit-only | U6/Step9/11/15；没有generic outbox成功推断 |
| 新依赖pin | 实际选择的registry依赖用exact version与受审lock；sibling path须按未来07记录实际版本/commit/状态和compatible exports，不填写虚构hash | Step14/04/07；core真实transitive serde/thiserror存在不是本仓已经闭包通过 |
| repo/提交纪律 | 目标计划路径尚不存在，未来实施须先查sibling；本轮只设计calibration，user未授权commit；本地git身份只记录规范值 | `commit_required=false`；无账号/token/run/build/投递/证据/签署事实 |

### 注释与提交冲突的适用规则

| 场景 | 采用口径 | 不采用的旧口径 / 校验 |
|---|---|---|
| 本仓设计正文/合同示例 | 中文解释与中文Rustdoc，标识符英文 | 不声称示例就是可直接编译源码；字段/variant注释逐项检查 |
| 未来实现Rust源/测试 | 英文标识符、注释、Rustdoc、测试名和错误说明；中文只准有明确用途的业务数据/fixture | R9不作为混用默认；注释翻译不得改状态、材料或错误语义 |
| 未来实现repo commit | 实施§4.9英文`type(scope): subject`及英文body/Codex footer | R12中文+Claude不继承；未来07补全文规则和目标更严格约束 |
| design repo commit | subject/body中文、英文type、固定Codex footer，仅在用户另行明确要求时 | 本次不提交；文档自检pass不等于commit授权 |
| 未来project git config | `user.name=quantalithos-labs`，`user.email=quantalithos.ai@gmail.com`；项目级，无--global | 本轮未执行读取/写入目标config；无已配置断言 |

### 已核共享导出与资格

| 真实来源 | 可承接的类型 / 行为 | 使用边界 / 尚未证明 |
|---|---|---|
| core-contracts `src/lib.rs`/`metadata.rs` | RequestMetadata、CommandMetadata、QueryMetadata、RequestId、TraceId、IdempotencyKey、Timestamp、PageRequest/PageToken/QueryConsistency公开 | 本仓re-export单一metadata；写入需required key，technical key不替semantic effect；reason/external ref/page token不准装raw或credential |
| core-contracts `src/actor.rs` | ActorKind、ActorRef、ActorContext、RequestOrigin公开；Human/AiMember/System/Integration为类型分类 | outer trusted context才可使用；display_name/role hints不是授权依据，不记录未经allowlist的外部昵称/身份正文 |
| sdk-contracts `src/lib.rs` | 重导出core metadata/actor；CommandMetadataExt检查required key；依赖bus-contracts | 暂不为单一helper引整个SDK/Bus closure；本地entry validator复用core字段，不复制metadata或造owner API |
| sdk-client `src/lib.rs` | trusted GatewayHeaders、ClientContext actor/trace/credential_ref/target_profile，泛型facade | 保持条件候选；不是已绑定Conversation/治理桥接client；GatewayHeaders名字不许可把平台headers当trusted内部actor |

### 本地多仓依赖约束

| 依赖仓库 | 全局依赖类型 | 本地默认路径 | 当前引用方式 | 中期引用方式 | 影响的实现单元 |
|---|---|---|---|---|---|
| quantalithos-core | 已裁剪编译候选；本步核实actor/metadata后确认计划编译使用 | `/home/aris/Projects/quantalithos-core`；真实`crates/contracts` | workspace根`core-contracts`本地path；使用member继承，Step4写准确相对路径 | private git固定tag/rev候选；不填值、不默认公共crates.io | contracts重导出；其他member按实际直接使用申明，不依赖core-domain/infra |
| quantalithos-sdk | 已裁剪条件编译候选 + runtime client | `/home/aris/Projects/quantalithos-sdk`；真实`crates/contracts`/`crates/client` | **尚未启用Cargo依赖**；只核路径/exports；逐owner兼容及完整传递闭包过关才可选真实path | 资格成立后private git固定tag/rev候选，未经07不切换 | infra owner/event adapter；不得反向引入core contract层 |

本表只记录既有compile候选。core为当前确定的布局计划，不是build成功；SDK仍条件，不进入无条件依赖图。默认实现仓`/home/aris/Projects/quantalithos-bridges`未存在；不创建，不填license/package发布版本或repo origin。

### 非编译依赖与不可用策略

| 关系 | 表达方式 | 不可用时 / 禁止替代 |
|---|---|---|
| Conversation/Identity/Governance | 正式runtime read/command/handoff adapter；消费qualified event | 对应缺资格支路blocked；不复制owner表/类型假装可调用，不自创Turn/GlobalMember/Decision |
| Artifact/Workspace | 条件authorized ref/safe read/export adapter | 必要材料或current visibility不足blocked；不得缓存正文、把旧快照作新授权 |
| Observability/Bus | 有资格producer/consumer/event transport/handoff adapter | canonical/admission缺失按mandatory阻断；ACK不是consumeraccepted，generic Bus receipt不补business schema |
| 四平台 | Slack/Mattermost/Telegram/Discord独立typed协议adapter | 逐版本/installation/direction/method未证实不支持正向执行；stub/fake不是安装/送达证据 |
| OAuth/API Key/KMS/secret resolver/route | 外层config资格、opaque secret ref、短时private读取、固定受权target | 未选/撤销/expiry/grant不匹配则blocked；无raw secret/env正文、无动态fallback |
| Chat及未裁剪执行仓 | reference_only / 间接背景 | 不新增Cargo或固定URL入口，不借平台action直接调用Tools/Runtime |

复杂度：本Step只有一组工程约束，表可逐来源反查，不拆附录。§3禁止图，不画图。语言/runtime模型收稳允许讨论Step4文件职责；所有产品支路仍blocked，完整03 schema/签名和实际可运行前置未关闭。

## 8. 回填草稿

正式§3摘录§7编码承接、语言/runtime约束、共享资格和编译依赖表；§16承接实施前阅读/git规则及剩余资格。必须保留“本地计划选择、executor-neutral模型、具体产品blocked、未运行build”和设计中文/实现英文边界。此草稿不新增接口、选型或提交授权，只供以后Step19装配。

## 9. 待确认事项

| 待确认 | 当前状态 / 限制 | 下一关闭入口 |
|---|---|---|
| 具体executor/transport/storage/Bus/cache产品与工具链安装 | 本地模型已定，产品not_selected；不得运行root默认化，不宣称工具链已安装/验证 | Step7 async/driver合同 -> Step14产品资格 -> 04值/profile -> 07真实环境核验 |
| SDK owner专用调用与传递依赖closure | 条件候选，未启用Cargo；public facade不证明bridge compatibility | Step7/8逐owner binding与全局裁剪反查；Step14固定版本/closure |
| 已确认core path的完整版本/lock供应链与carrier资格 | exports已核；未执行build或确认整个closure/owner行为 | 后续Step6~8逐type绑定，Step14/07真实版本与build门禁 |
| 上游authority/material/continuity/producer | BR-UP-001~009=open；010=reference_only；Workspace原开放项/Observability十二affected不变 | Step1§7/正式02§13.3及00 Step15释放依据；不跨项目回写 |

这些产品/运行前置不伪装成本地Step3自检失败，也不因本步pass变为ready。语言/层分隔变化要回本Step，新增compile边要回01；缺合同不能交实现者自行挑选。

## 10. 自检及进入下一步条件

| 自检项 | 结论 | 依据 |
|---|---|---|
| SOP十问题全部承接 | pass | §3/7；语言与模型已定、产品branch明确不默认启用 |
| Rustdoc/注释/提交冲突 | pass | 设计中文与实现英文分场景；每variant必须注释；实施§4.9/git必读、不修改config |
| 编译/runtime/event分离 | pass | core只计划actor/metadata；SDK条件；不将owner或Bus新增为Cargo path |
| 路径/exports真实性 | pass | 真实core/sdk manifests与export scoped读取；target未存在，不伪造build/repo/hash |
| 私有材料/未知结果/安全边界 | pass | private不derive泄漏、取消不证明no-effect、query无写、mandatory admission保护沿02 |
| 历史与草稿无新事实 | pass | 后置README差异；未沿用Python/TS/KMS/fallback；正式03未回填 |

gate_status=pass；gate_reason=language_runtime_model_and_dependency_constraints_closed；next_allowed_action=read_step04_layout_sources_then_create_current_skeleton；source_files=§2~4/6~9；formal_backfill_allowed=false；commit_required=false。仅允许授权内Step4组织设计，不授权实际Cargo创建或运行。
