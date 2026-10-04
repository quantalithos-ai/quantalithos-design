# L6-bridges 03 Step5：模块实现契约主轴

## 1. Step状态、开工确认与内计划

done / pass_design_self_review / waiting_user；full-restart / single-agent-serial；2026-10-02启动、2026-10-03完成。用户仅新增授权Step5，当前完成并停审；Step6未授权。拟回填正式03§5的模块主轴；当前不装配正式03。

| 开工项 | 记录 |
|---|---|
| 授权 | 用户“同意，先完成step5”；不是全部03、Step6或实施许可 |
| 恢复 | 项目台账 -> 03 flow -> Step1~4及类型路径附录；前序设计自检pass |
| 当前SOP/规范 | 详细SOP Step5、详细书写§3/4/5.5、中间产物开工/三层恢复/模块小循环已复核 |
| 输入资格 | 当前00/01/02、Step1~4；Governance仅框架参照；旧03/README仅后置冲突扫描 |
| 骨架 | 本文件先建立G0、七模块及G8骨架；未来Step文件未创建 |
| 修改范围 | 只本Step、03 flow、项目台账；既有正式文档/前序校准/其他dirty文件不改 |
| 事实边界 | 不创建实现仓、实施台账/boundary、代码、配置值、项目测试、证据或commit |

| 单元 / 串行次序 | 问题/诊断/取舍 | 结构化 | 草稿 | 自检 | 下一许可 |
|---|---|---|---|---|---|
| G0 共用主轴与依赖 | done | done | done | pass | 只M1 |
| M1 contracts | done | done | done | pass | 只M2 |
| M2 domain | done | done | done | pass | 只M3 |
| M3 application | done | done | done | pass | 只M4 |
| M4 infra | done | done | done | pass | 只M5 |
| M5 api | done | done | done | pass | 只M6 |
| M6 jobs | done | done | done | pass | 只M7 |
| M7 worker | done | done | done | pass | 只G8跨审 |
| G8 跨模块审计与停审 | done | done | done | pass | 等用户审查Step5；Step6未授权 |

每模块先完成§3/4/6，才写其§7结构化、§8草稿与§10自检；不先写全部结论后补诊断。jobs先于worker是允许`worker -> jobs`复用边的设计阅读次序，不是实施phase。

## 2. 本步输入

| 来源 | 本轮实际读取 | 本Step承接 / 资格 |
|---|---|---|
| [当前01](../01-架构设计.md)、[当前02](../02-概要设计.md) | 01§8/9/11；02§4/5/12/13相关范围；跨审补定位§5.5/6.14/11.2 | 一个BC/六U、局部truth、入口/层/owner/产品seam、回环与六namespace；不重开架构或概要 |
| [Step1](03_ddd_step_01_upstream_boundary.md)、[Step2](03_ddd_step_02_scope.md)、[Step3](03_ddd_step_03_coding_runtime_constraints.md) | 全文与待确认 | BR-UP、全集/非范围、Rust2024/MSRV1.93/1.93.0计划、Future模型与真实shared exports |
| [Step4](03_ddd_step_04_units_file_layout.md)、[类型归属附录](03_ddd_step_04_support_type_file_index.md) | 全文；当前恢复再次定位逐文件/入口/port表 | 七role/161计划文件、20对象/20主语/23port/19flow/17机、243名称22路径；不等完整schema |
| [Governance Step5](../../L1-governance/design-calibration/03_ddd_step_05_module_contracts.md) | 全文378行；本轮再次定位§7 | 借用总览、模块职责、文件/代码主体、归属预告、业务映射、测试切口和跨审框架；不照搬其对象/依赖/产品 |
| [SDK03](../../L0-sdk/03-详细设计.md) | §7.3；真实Cargo/export核验沿Step3登记 | metadata单一真相、trusted context、Query无写；泛型client不是已存在Bridges专用callable |
| [Conversation03](../../L1-conversation/03-详细设计.md) | §7.4及相邻返回面 | target_mode/ActorRef、AppendFact的Integration/BridgeMapped/required digest规则；不自造submitTurn |
| [Identity01](../../L1-identity/01-架构设计.md)、[实施台账](../../L1-identity/design-calibration/implementation_execution_ledger.md) | §4/4.1、台账当前状态与头部 | AI身份锚点不是human认证/权限；来源commit-08-c/ready_for_design_gate不是Bridges资格 |
| [Governance03](../../L1-governance/03-详细设计.md) | §7.1/7.2 | 已存在Decision/Vote与只读协议；未证明其提供本仓current disclosure/actor/action兼容 |
| [Artifact03](../../L1-artifact/03-详细设计.md)、[实施台账](../../L1-artifact/design-calibration/implementation_execution_ledger.md) | §7~9、台账当前状态与头部 | authorized材料/附件引用需求不能由protocol总表推自动准入；来源commit-01-a状态不转移 |
| [Workspace03](../../L1-workspace/03-详细设计.md)、[项目台账](../../L1-workspace/design-calibration/project_execution_ledger.md) | §1~3、台账现状与开放项 | 条件safe read/export/provenance；不拥有频道/授权，WS原状态不关闭 |
| [Observability03](../../L4-observability/03-详细设计.md)、[实施台账](../../L4-observability/design-calibration/implementation_execution_ledger.md) | §1/2、台账当前状态/事实/恢复区 | body-free producer/admission/result边界；来源pre_implementation_blocked/wait_design不升级 |
| [详细SOP](../../../standards/document/详细设计讨论流程_SOP.md)、[详细书写](../../../standards/document/详细设计书写规范.md) | Step5；书写§3.1~3.3/4.1~4.2/5.5 | 本Step固定模块主轴；完整模块对象/trait/函数由Step6/7顺序闭口 |
| [中间产物](../../../standards/document/设计文档讨论中间产物规范.md)、[通则](../../../standards/document/设计文档编写通则.md)、[真相源](../../../standards/document/设计真相源闭环与可落码性标准.md)、[全局依赖](../../../standards/document/全局项目依赖关系与裁剪规则.md) | 中间产物§3.1~3.5.1/4；通则§1.4~1.7；真相源§2.1/2.2/2.6~2.8.4/2.12/2.14/3.7适用范围；依赖全文 | 三层恢复、模块小循环、authority/幂等/query/材料闭环、Layer5裁剪 |

七专项首次00~07阅读资格沿00/02登记；以上明确本轮复核范围，不冒称再次全文重读。平台依据沿00的PS-01~14和当前01§11.3；本Step没有新网络、账号、installation或版本pin核验。Governance Step6~10此前只读框架/模板/示例/审计相关段落，不能据此声称它们全文已读或本Step已执行。

## 3. SOP问题回答

### G0 共用主轴

1. 模块主轴固定七个技术role，直接承接Step4；六U是跨role业务职责轴，不能据20对象生成20模块或六个服务。
2. 每模块应有职责、allowed/forbidden compile边、文件/代码主体、capability输入输出与副作用、归属预告、错误/测试切口；仅列名称不足以承接Step6。
3. 共用public词汇归contracts，局部guard归domain，23port/内部载体/19编排归application，产品和owner反腐归infra，入口分api/jobs/worker；公开传递类型不能依赖domain或private carrier。
4. 依赖图只画已认可计划compile方向；runtime/event另表说明。core四个actor/metadata名称唯一重导出，SDK不在默认compile图。
5. 本Step逐主语回答“在哪里实现、负责什么、拒绝什么、下一步哪里闭口”，不提前回答完整字段、签名、DTO、调用链或状态矩阵。

### M1 contracts

1. 负责六U共同使用的safe协议及传递词汇：C01~06/E01~04/Q01~04/J01~05、条件O01；不是业务授权或模型仓。
2. 公开四个core重导出、typed locator/basis/operation/effect/cursor/disposition、view/page/config引用、有限protocol error。第20对象BridgeLocalView只能在views.rs定义；SafePresentationPlan只能被safe ref指向，不能把domain model放wire。
3. 只允许core-contracts计划compile依赖；protocol公共类型不能引用domain/application/internal snapshots或五private handles，更不能暴露SDK/平台token。
4. public transitive type、state-required Slot与safe metadata必须有唯一主定义；243项索引是使用面，不包括未来所有request/result/page/carrier，后续Step6/8须双向反查。
5. 本模块只负责protocol/data shape拒绝与有限外部错误表达；current authority、foreign business result和retry资格由Application/port消费正式来源，不能由DTO constructor授予。

### M2 domain

1. 负责六U的19个局部model及17个stateful主语，truth仅是配置/relation/mapping、记录、intent/attempt/receipt、dedup/cursor/lane/recovery和safe audit/handoff，不扩大到owner或平台实体。
2. 局部model及其factory/transition/invariant归model责任文件；BridgeLocalView归contracts，PlatformReceipt/SafeAuditRecord只不可变记录，不造独立机。
3. 允许contracts与纯语言能力；禁止Application/repository/private handle/infra/executor/平台SDK/owner源码。所有guard消费显式合格safe依据，不现场查询外部。
4. 三mapping须同时保护两端kind/installation/正式basis/generation/version/方向/action；DeliveryIntent须保护不可变target/effect与C04/E02共同语义唯一要求；callback claimed不能借lease失效复活。
5. domain保证局部合法转换，不证明cross-owner提交或platform送达；whole-store唯一/CAS、current authority复核和原op probe由Application+port+infra承接，不能仅靠domain对象“返回成功”闭口。

### M3 application

1. 负责C6/E4/Q4/J5共19入口编排、23port、qualified local mutation/result与内部safe snapshot；O01只条件材料来源，不是第20请求入口。
2. Command/Consumer/Job使用可信context、显式metadata、获准namespace/key与current basis；Query只当前safe read qualification和local slice，不reserve/dedup/audit/refresh/probe/repair。
3. 公开仓内用例facade与port定义；五private contexts/handles、九repository snapshots、QualifiedLocalMutationPlan/QualificationInvalidationPlan/IngressVerificationResult是Application内部或受限seam载体，不是public wire。
4. 外部IO与本地UoW必须分段；LocalCommitDisposition未知保indeterminate，只按原op权威读取收束。C04/E02共享semantic effect唯一，J01只既有intent；unknown不给新effect/key/target；重复结果仍当前受权读取。
5. canonical/admission和safe mutation唯一材料源由local_mutation负责；mandatory未合格先阻对应mutation/IO，不能改audit-only。current binding/material/action/secret/read资格来自port，Application不创owner权限或平台事实。

### M4 infra

1. 负责实现Application port需求并与真实来源做反腐转换：四平台/六owner、事件边界、local safe store/commit proof、private材料/secret、config qualification和runtime装配。
2. 四adapter按installation/version/direction/method支持或拒绝，不宣平台等价；负责private source验证/ACK、locator变化/thread/附件、known business result与rate/probe映射，current内部资格仍由正式owner提供。
3. 六owner adapter只消费正式safe query/command/event/result，缺Bridges兼容保持blocked；Identity非human认证、Workspace非统一权限、Observability非此仓evidence emitter。
4. repository adapter实现local唯一/CAS/UoW与原op结果读面；提交ACK lost要真实driver权威证明，不能用fake、NotFound或lease恢复成rollback。网络IO不加入本地事务。
5. composition/loader/validator明确required seam与模式互斥、固定受权route/private provider；未选SDK/OAuth/API Key/KMS/HTTP/executor/DB/Bus分支不激活，测试fake不生产fallback。

### M5 api

1. 负责C01~06管理、Q01~04只读，以及当前配置允许的E01/E03 HTTP ingress/callback；五文件职责沿Step4，不新增业务handler真相或HTTP产品。
2. trusted内部actor由受信宿主注入，平台body/headers/签名只在private source验证接缝使用，不变成internal ActorContext/管理员/审批者。
3. Command/Query dispatch调用Application；private平台入口经合格infra验证并调用同一Application E01/E03，独立执行ProtocolAckPlan，不宣可靠接管/Turn/owner action成功。
4. API只依赖contracts/application/infra；禁止直接domain/repository业务调用或依赖worker/jobs；C04/C06不得同步发送/重放以伪造HTTP success。
5. safe response/current可见ref与finite error映射在entry完成；query handler不能加audit、幂等reserve、refresh或platform/owner probe。ACK期限/失败/可靠接管条件后续Step8/9明确，不用raw durable inbox补可靠性。

### M6 jobs

1. 负责五个既有J主语一次有界invocation，library供worker与五bin共用；不是五新业务flow或泛化运维授权层。
2. invocation验证TrustedJobContext/JobContinuityMetadata、当前scope和original subject/op关联；真实job_run_id由受信调用方按正式协议提供，本Step不创造run。
3. J01只对既有intent受限dispatch；J02只原op权威probe/finalize/资格收束，不自行重send；J03只同stream/epoch qualified gap；J04只同canonical/op；J05只既有subject/current来源维护。
4. jobs依赖contracts/application/infra，不依赖api/worker/domain业务操作或直接repo；worker可以调用jobs library，bin与worker必须复用同一invocation责任。
5. job结果输出为safe bounded result、stage/ref/finite reason；取消/失败不等no-effect，预算/limit/mandatory/unknown保护仍由Application复核。scheduler或operator不能把运行权限当外部业务授权。

### M7 worker

1. 负责常驻E02 committed source/E04 consumer disposition、当前配置允许的E01/E03 poll/session接入与既有subject bounded job调度；不是新业务truth或独立恢复引擎。
2. library/main/consumers/platform_sessions/scheduling五文件沿Step4；Application复核producer/source/marker/namespace/资格、独立ACK/result；worker只分派，不自行取owner结果或移动cursor。
3. 允许contracts/application/infra/jobs；jobs仅library复用，禁止api、domain/repository直接业务操作或反向让jobs/core依赖worker。
4. 当前installation/source stream的HTTP/poll/session模式须按qualified配置唯一接管；platform sequence/session只在正式epoch/resume资格内，reconnect/invalid session保gap，不造覆盖或zero cursor。
5. scheduling只取得Application已定义的合格existing subject候选并调用同jobs库；claim/fence/current basis/budget仍由Application重核。shutdown/timeout/lease过期不证明external no-effect，不重新生成op或复活callback claim。

### G8 跨模块审计

1. 反查七module与六U、20对象/20协议主语/23port/19入口/17状态主语，以及243既有名称归属，确认无新增truth、双定义或孤儿责任。
2. 反查16仓内+1core compile边、唯一public view、四core重导出、5private/9snapshot/3其他内部载体，以及四平台/六owner适配的读取/输出/失败/后续闭口位置。
3. 模块主轴完成不等字段/签名/DTO/flow/state完整闭口；Step6~10必须沿本Step责任继续，非core稳定载体不能全部机械defer，公开传递类型不能依赖domain/private。
4. 对current qualification/Policy/Gate/显式binding、source/ACK阶段、原op未知、同effect唯一、cursor/limit/附件/敏感降级/secret/mandatory/query/no-body逐面审计，真实资格缺口保BR-UP。
5. 对正式输入、前序、其他dirty文件做只读hash复核，检查三层恢复状态、future文件不存在、修改仅三文件，最终冻结Step5等待用户；不提交或伪造测试/证据。

## 4. 当前材料问题诊断

### G0 诊断

Step4闭合了路径，不等于模块capability闭合；243名称索引也不是schema全集。Governance的七模块形态可以参照，但其truth aggregate、outbox、通用report和worker/jobs互禁不能移入本仓。Bridges已有worker复用jobs库、即时平台ACK、多种同op未知与五private载体，必须在本模块主轴保留。

当前风险是把“定义了qualification ref”误写成获得授权、把infra对象写成可用provider、把模块测试责任当真实测试。模块主轴必须同时固定positive branch责任与blocked/unknown保护责任，未闭合来源不得由模块自己签出依据。

### M1 诊断

Step4已给safe文件职责，尚未证明任何carrier字段/serde/构造闭环。尤其trusted context名称、AllowedProjectionRef、ProducerAdmissionRef和NoEffectBasisRef都不是可随输入声明的证明。contracts不能为完整DTO导入domain的SafePresentationPlan，也不能用一个GlobalSuccess抹掉protocol ACK、local commit、owner accepted、platform receipt与consumer disposition。

### M2 诊断

若照Governance为每个对象外加policy/outbox/entity层，会为Bridges创造未授权truth与重复文件。若只列19model名，忽略basis、独立阶段、同effect未知、六namespace与coverage，Step6将无法从能力推导完整对象。纯domain guard也不能证明输入ref真实有效，不能替代IO前current qualification。

### M3 诊断

Step4入口文件不是完整service签名；Application名和23port只表达本仓需求，不证明SDK/owner存在同名方法。用通用execute/replay或command直接调用平台会隐藏prepare/dispatch切口与原op未知。内部snapshot若只标为“后续port再设计”，会漏掉Step6必须推导的稳定result/read/private lifetime载体；但现在也不能越过Step6写字段。

Query通过通用LocalMutation/UoW helper或业务审计将破坏no-write。safe材料若每handler自己生成会重复producer并可能绕mandatory admission；应由唯一local_mutation编排责任承接实际提交，不把private body的hash当幂等meaning。

### M4 诊断

有slack.rs等文件和官方资料不证明installation真实配置或具体SDK重试/日志安全；raw SDK/DB/transport error、私有URL/token与callback context仍可能从adapter返回值、Debug、日志和evidence泄漏。需要在外层固定错误清洗/private生命周期及capability拒绝位置，不把“后续产品选择”当安全豁免。

六owner的formal设计元信息/实施台账不提供统一authorizer、bridge专用material/result/probe callable。infra可以组合来源读取，不能创造跨ownerpermission或用conditional Workspace强制所有流程等待它；平台probe也非一律可用，无权威同op结果则unknown/manual。

### M5 诊断

把平台HTTP body反序列化成public Command或将验签headers当可信内部actor，会绕过explicit binding/current责任。即时ACK可能早于可靠safe接管及owner结果，不能复用command accepted或平台receipt表示它。API错误包装还可能重新输出已由infra清洗掉的raw error/body；handler必须仅使用有限safe面。

### M6 诊断

五bin名字只能定位入口，不能证明受信continuity metadata、current scope、原op或bounded执行已闭口。若worker/bin各写一套retry/recovery会产生同effect竞争与不同取消语义；若job报告默认为successful或从lease到期生成新operation，会伪造platform/owner结果。J04名称包含retry也不授权重复交接或补canonical/admission。

### M7 诊断

常驻worker易把transport redelivery、protocol ACK、local接管和owner/consumer accepted合成一个offset或success；也易用session sequence推业务位置或在reconnect时无依据清gap。调度若直接scan/write local_store或复刻jobs业务，会绕当前资格与claim/fence，在崩溃/lease窗口制造新效果。worker不能把来源未合格的raw envelope转成durable dead-letter正文。

### G8 诊断

七模块设计自检pass仍需跨审；单模块不会发现public/domain重复、entry/library循环、port无实现责任或future Step被提前写。既有索引数量曾在G0/M1计数字样草拟时误写，已按原表/Node分组复数纠正；最终审计必须从正式/前序来源反查，不以本文自己重复的数字证明完整。

旧03五部分/载荷truth/timeout retry与README预选技术/SDK/KMS/OAuthfallback/Chat入口已在独立模块结论后定点扫描；不恢复historical材料资格。后续schema/card/签名缺失是按Step顺序待执行，不宣本Step整体可移交代码或四平台ready。

## 5. 改动前后及历史差异

| 来源位置 / 历史口径 | 本Step独立结论 | 差异理由 / 回填影响 |
|---|---|---|
| 旧03§3.2/3.3五部分、单src/intake_service等 | 七技术role + 六U横向能力，沿当前Step4布局 | 不复制旧模块/对象/目录；正式§5按七module，20现有对象另闭口 |
| 旧03§7.6 payload/endpoint匹配即可Dispatch、权限/审批“不需要” | 所有受保护外部操作受current binding/Policy/Gate/material/action资格 | source/签名/安装不替业务授权；adapter/entry不能绕Application |
| 旧03§7.10/7.11 timeout/duplicate -> retry/replay | 各阶段unknown保持原op，权威probe/known finalize/no-effect资格/manual分开 | timeout/lease/NotFound不证明无效果；重试资格到正式port证明 |
| 旧03§9.1 PayloadEnvelope写模型、统一append-only“证据链” | local safe refs/model/audit/conditional handoff，private瞬时不durable | 不拥有payload truth/evidence；raw/可还原派生/rawbody hash/secret不出seam |
| README仓定位/平台/依赖及安全：Python/TS、各SDK、KMS、OAuth优先/API Key fallback | Rust计划及core已核共享；SDK/platform/provider/config/secret产品均须后核 | 旧选择不能预选产品；required seam不足阻分支，禁止明文或fake fallback |
| README Turn=Message、GlobalMember=Bot/User、固定“打开Chat”提示、所有Bot行为进Observability | typed relation/ref及独立ACK/owner/平台/consumer阶段；AI非human认证；固定受权route；conditional安全producer | 不移owner/platform truth，不消费Chat未停审URL，不绕canonical/admission或造evidence |
| 当前Step4的文件/主语/归属（不是历史） | 继续保留；新增capability、对象组/port/error/test责任与后续闭口位置 | 前序hash不变；不重开概要或把路径计划当实施文件 |
| Governance Step5框架 | 采用七module总览/职责/文件/业务映射/测试与审计组织法 | 不继承Governance真相对象/outbox/依赖互禁；Bridges保worker -> jobs库复用 |

后置只读范围：旧03§3.1~3.3/7.6/7.10~7.11/9.1及README仓定位/平台/核心映射/依赖/纪律/安全；前序Step1/4已有冲突沿原记录。本轮未重读旧03全文或修改旧03/README，不以旧结论驱动模块写作。

## 6. 设计取舍

### G0 取舍与写入许可

采用Step4七role + 六U交叉矩阵、逐模块capability/归属/后续闭口表，保留准确单向`worker -> jobs`库复用。未采用直接复制Governance全表（会引入不属于Bridges的truth/producer和依赖限制）；未采用一次列20对象就宣布模块完成（无法审查private、runtime、entry和repository责任）。

共用依赖和public/private边界必须先全局收敛，因为影响所有模块；后续模块分别论证自身能力，不在G0先完成它们的全部结论。项目/flow/Step5许可一致；本单元问题/诊断/取舍done，只开放G0结构化、草稿和自检；正式与未来Step仍false。

### M1 取舍与写入许可

采用safe public vocabulary和五类protocol responsibility分离、唯一BridgeLocalView、core仅重导出的布局；将private/snapshot明确排除。未采用公开domain实体或把private传输对象包装成通用Envelope（会产生反向依赖与持久化泄漏）；未采用复制core metadata以“统一字段”（会造成双真相）。

M1问题/诊断/取舍done；只允许当前模块结构化、草稿、自检。Step6对象card/enum、Step8完整DTO/serde到对应授权后定义，当前不能把待闭口字段当已实现。

### M2 取舍与写入许可

采用19model文件内归属guard/state/factory、contracts单一public view和局部truth上限；不新增通用Policy或platform Message/Conversation/GlobalMember实体。未采用domain调用owner/repository做“完整验证”（破坏纯核心与事务边界）；未采用为receipt/audit/view套通用生命周期（会伪造业务状态）。

M2问题/诊断/取舍done，只开放domain责任/能力预告及自检；完整对象方法/状态enum与合法转换分别到Step6/10，不由本Step先定义。

### M3 取舍与写入许可

采用19独立编排文件 + 23按业务职责分组port + 共享local_mutation/qualification_invalidation/result_mapping责任；Application定义稳定内部载体和private边界，infra只提供实现。未采用每U一个泛化service替代逐入口责任（难反查副作用）；未采用把private/raw材料放持久化inbox或command retry自动重交（违反材料和same-op边界）。

M3问题/诊断/取舍done；允许当前模块能力/对象组闭口责任预告，不写完整flow/signature/schema。后续Step6须对这些非core稳定carrier作闭口/defer决策，不能机械将其全部推迟到Step7；真实owner缺口仍BR-UP。

### M4 取舍与写入许可

采用四平台独立adapter、六owner正式边界、product-neutral存储/private/config/runtime责任；runtime构建先核required seam，error/private材料在源adapter内受限转换。未采用平台通用Message/万能probe或全四平台默认兼容（抹平权限/ACK/变化/恢复差异）；未采用空凭证、明文secret、test fake或默认SDK retry让未核产品可启动（会绕过qualification和效果保护）。

M4问题/诊断/取舍done，只开放责任映射/能力/后续闭口要求。真实method/version/installation/产品pin到Step7/14按受影响分支核验；不伪造token、运行、API成功或provider readiness。

### M5 取舍与写入许可

采用管理/query/public协议dispatch与private平台验证入口分离，同E01/E03复用Application和独立ACK。未采用HTTP handler直接发平台/批Gate/补Turn（绕过domain/authority/事务切口）；未采用memory/raw inbox或HTTP 200证明可靠接管（违反材料与阶段事实边界）。

M5问题/诊断/取舍done；只开放模块责任/对象组/测试预告，handler签名/协议deadline/完整route到Step7/8/9/14，当前未选server或路由产品。

### M6 取舍与写入许可

采用一份invocation library和五具体动作bin，job业务仍归Application同名J用例；无新CLI/无限replay/通用force操作。未采用每bin直接操作repository/platform SDK（绕current qualification和same-op保护）；未采用job-run权限自动映射管理员/审批者（身份与操作授权不同来源）。

M6问题/诊断/取舍done；只开放runner/载体闭口责任预告，完整input/result/callable/调用链到Step6~9，current qualification/claim/预算证明到Step11~14，不实际启动job。

### M7 取舍与写入许可

采用source/mode分派 + Application同一E入口 + jobs同一invocation库，runtime只负责bounded host/shutdown；不建立第二dedup/recovery/cursor writer。未采用直接操作repo/lease到期重发或重连默认为补齐（缺current authority、结果与coverage证明）；未采用套Governance worker/jobs互禁（与Bridges已认可单向复用冲突）。

M7问题/诊断/取舍done，只开放本模块责任/稳定载体闭口预告；source binding、eligible读取面、typed dispatch与cancellation完整合同分别到Step7/8/9/11~14，不启动worker。

### G8 取舍与写入许可

采用“逐module自检 + 跨主语/依赖/来源/安全/范围只读审计 + 三层停审”闭口Step5；本步完成的是可反查的职责主轴，不是提前完成schema或解除真实上游资格。未采用把所有未来Step写进一个大模块文件来宣布03完成；未采用因上游blocked删掉P0安全/拒绝/恢复责任。

G8问题/诊断/取舍done；只允许归属/后续闭口摘要、历史差异和实际静态审计记录。未经用户下一授权，不读写执行Step6内容、不装配正式03、不创建实施台账/boundary、代码、项目测试或commit。

## 7. 结构化中间产物与复杂度

### 7.1 G0 模块主轴、业务映射与依赖

所有代码路径相对计划实现仓`/home/aris/Projects/quantalithos-bridges`；只是责任计划，当前未创建仓或源码。七role已经Step4收稳，本Step不增加member或改变部署拓扑。

#### 模块总览

| 模块 | 所属实现单元 | 职责 | 对外暴露 | 依赖对象 |
|---|---|---|---|---|
| `contracts` | `crates/contracts` / bridges-contracts | 安全协议与跨模块共享词汇 | DTO/ref/view/config引用/有限错误；core重导出 | core-contracts |
| `domain` | `crates/domain` / bridges-domain | 19局部model与17状态主语的不变量 | 局部model/guard；不对外提供owner API | contracts |
| `application` | `crates/application` / bridges-application | 19入口编排、23port与本地提交/结果边界 | 编排facade/ports；内部snapshot/private载体不属wire | contracts、domain |
| `infra` | `crates/infra` / bridges-infra | 四平台、六owner、存储、private/config/secret/runtime适配 | 合格adapter与composition；非默认可用provider | contracts、domain、application |
| `api` | `crates/api` / bridges-api | 可信管理/query及即时平台HTTP入口 | C01~06/Q01~04 dispatch、条件E01/E03/ACK入口 | contracts、application、infra |
| `jobs` | `crates/jobs` / bridges-jobs | 五既有subject单次有界invocation | 供bin/worker的invocation facade；五具体动作bin | contracts、application、infra |
| `worker` | `crates/worker` / bridges-worker | 常驻事件、合格poll/session与受限调度 | E02/E04、条件E01/E03 dispatch；调用jobs库 | contracts、application、infra、jobs |

#### 模块依赖图: Bridges计划compile主轴

```text
contracts --------------------> core-contracts
domain -----------------------> contracts
application ------------------+--> contracts
                              +--> domain
infra ------------------------+--> contracts
                              +--> domain
                              +--> application
api --------------------------+--> contracts
                              +--> application
                              +--> infra
jobs -------------------------+--> contracts
                              +--> application
                              +--> infra
worker -----------------------+--> contracts
                              +--> application
                              +--> infra
                              +--> jobs
```

图后说明：箭头`A -> B`只表示A允许直接依赖B，不表示处理流、网络调用、事件传播或实施次序；每条直接仓内边与Step4一致。`infra`实现application的port，而application不依赖infra；entry通过infra composition获得application，不直接操作repository或domain。worker只依赖jobs **library**，jobs不得反向依赖worker/api，worker不得运行或复刻jobs binary业务逻辑。

core是已核共享actor/metadata的计划compile依赖，不引core-domain/infra。workspace根只有`core-contracts = { path = "../quantalithos-core/crates/contracts" }`，contracts member继承；其他模块从contracts使用唯一重导出，不为同一metadata引SDK。具体wire/crypto/executor/HTTP/DB产品仍未选；图不声称已build。

#### 非compile协作与装配资格

| 边界 | 类别 | 接入模块 / 不进入compile图的原因 | 当前限制 |
|---|---|---|---|
| 六owner、private material与secret provider | runtime | infra正式adapter；不链接owner源码/私表 | BR-UP-001~007/009；ref存在不等当前资格 |
| 四平台 | runtime | infra逐installation adapter；api/worker只负责模式入口 | BR-UP-007/008/009；不声明4/4或实例可用 |
| Bus/已获准owner event/consumer disposition | event | infra/events/transport，worker分派 | transport ACK不替owner/consumer accepted；无bus-contracts默认Cargo边 |
| sdk-client | conditional compile candidate + runtime | 仅核到泛型client/传递依赖；非当前默认dependency | 需要owner方法兼容、metadata/private/重试/日志/closure复核，后续Step7/14 |
| route、OAuth/API Key/KMS、storage/cache/executor | config/secret/runtime seam | infra配置与装配；不属于domain/DTO授权 | not_selected/not_established；拒绝缺必需配置，不自动fallback |
| L5-chat | reference_only | 无正式输入或compile/runtime主链 | 未停审内容/URL/路由不可用，不增加等待Chat强前置 |

#### 六U到模块映射

| 业务轴 | contracts | domain | application | infra | api / jobs / worker |
|---|---|---|---|---|---|
| U1 binding/mapping | config、三locator/basis/代际、C01~03 | 五binding model | C01~03、J05及Binding/Mapping/Installation ports | config/secret、owner basis、local_store | api管理；jobs J05；worker受限维护触发 |
| U2 inbound | E01/source/marker/ACK/owner-result refs | InboundHandoffRecord | E01与qualification/owner handoff | platform/private/Conversation/Artifact/event | api HTTP或worker poll/session二选模式 |
| U3 delivery | C04/E02/J01、projection/effect/attempt/result refs | plan/intent/attempt/receipt | C04/E02共同准备、J01受限dispatch | platform/Governance/Artifact/local_store | api准备；worker来源；jobs J01 |
| U4 callback | C05/E03/action/source/one-use/owner-result refs | action binding/callback handoff | C05/E03与current责任/原owner op | platform/Identity/Governance/private | api绑定及HTTP，或worker合格session |
| U5 continuity | C06/J02/J03、六namespace/key/cursor/lane/recovery refs | dedup/cursor/gap/lane/recovery | C06请求、J02/J03及跨U唯一/顺序/结果读取 | local_store/commit_probe/权威owner或platform查询 | api只请求；jobs恢复；worker有界调度 |
| U6 safe trace/read | E04/O01/J04/Q01~04与唯一BridgeLocalView | audit/handoff；无view副本 | 条件local_mutation、E04/J04、四只读flow | Observability/conditional Workspace/safe audit/local_store | api query；worker E04；jobs J04 |

#### 后续模块统一下限与复杂度

每模块保留职责、文件/代码主体、capability、归属、port/adapter、关键调用责任、错误归属和测试切口八类结构；后三类此步只固定owner及闭口Step，不提前给签名/variant/case。已固定20对象/20主语/23port/19flow/17机不增删；新增实现support类型若必要，应由后续Step6推导，不受243索引数量上限约束。

复杂度：七技术模块各一独立小循环；G0用一个精确compile图、runtime/event裁剪表和六U矩阵，避免为每U重复技术层。现阶段无独立附录必要；243逐类型定位继续复用Step4附录，不另复制台账。对象/port/protocol/flow/state五类细节按Step6~10依次闭口。

### 7.2 M1 contracts模块

#### 7.2.1 模块职责

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/contracts` / bridges-contracts / bridges_contracts |
| 对应概要部分 | 02§4技术contract、§5六U、§7五类20主语、§12类型承接 |
| 主要责任 | public安全carrier、共用词汇和有限protocol错误；只定位/传递，不能授authority |
| 对外暴露 | safe DTO/ref/marker/page/view/config引用、core metadata重导出；不输出domain实体 |
| 允许依赖 | core-contracts已核共享exports；仓内无其他role依赖 |
| 禁止依赖 | domain/application/infra/api/worker/jobs；owner/SDK/平台/provider源码，private handles/internal snapshots |

#### 7.2.2 文件与代码主体映射

| 文件路径 | 代码主体 | 类型 | 责任 |
|---|---|---|---|
| `crates/contracts/src/lib.rs`、`crates/contracts/src/shared/mod.rs` | public导出allowlist | module surface | 不重导出domain/private/adapter；后续新增传递type须反查 |
| `crates/contracts/src/commands.rs` | C01~06、BindingActionProposal、AuthorizedMappingProposal | command DTO | local mutation意图/metadata/result；C04只prepare，C06只请求维护 |
| `crates/contracts/src/consumers.rs` | E01~04 safe envelope/context/result | consumer DTO | 来源/operation与ACK/result独立；private context不入wire |
| `crates/contracts/src/events.rs` | BridgeLocalDispositionRecordedEvent / O01 | conditional event | 只已提交qualified mutation的canonical安全材料，不是新请求或普发outbox |
| `crates/contracts/src/queries.rs` | Q01~04/query条件 | query DTO | authorized scope/page/consistency；无maintenance/probe开关 |
| `crates/contracts/src/jobs.rs` | J01~05 input/output/result | job DTO | existing subject、原op、trusted invocation；无伪run或通用replay |
| `crates/contracts/src/views.rs` | BridgeLocalView、safe slice/page/availability | public read carrier | 唯一定义第20对象；owner未可见则不透露ref/count；无独立机 |
| `crates/contracts/src/config.rs`、`crates/contracts/src/errors.rs` | 安全config引用、公开有限错误 | carrier / error | 不含secret值/产品实例/原始错误；错误完整variants后续闭口 |
| `crates/contracts/src/shared/metadata.rs` | ActorContext/ActorRef/CommandMetadata/QueryMetadata及trusted carriers | re-export / carrier | 不复制四core类型，可信来源不靠请求体自声明 |
| `crates/contracts/src/shared/locators.rs`、`crates/contracts/src/shared/authority.rs` | account/location/message/target、basis/generation/qualification Slots | typed vocabulary | kind/installation/方向/action显式；locator/ref不自行创建或授权 |
| `crates/contracts/src/shared/operation.rs`、`crates/contracts/src/shared/outcomes.rs` | original op/effect/expected revision、CAS/commit/ACK/result | typed vocabulary | body-free meaning不由rawbody hash生成；阶段不合并 |
| `crates/contracts/src/shared/material.rs` | qualified source/material/marker/attachment、BridgeTargetMode | typed vocabulary / semantic mapping | owner语义明确映射，required digest不等rawbody hash；不定义正文 |
| `crates/contracts/src/shared/delivery.rs`、`crates/contracts/src/shared/callback.rs` | effect/receipt/no-effect、action/one-use/owner result | typed vocabulary | 不把HTTP成功、签名或token存在提升业务结果/许可 |
| `crates/contracts/src/shared/continuity.rs`、`crates/contracts/src/shared/traceability.rs` | scoped key/position/coverage/lane、admission/canonical/disposition | typed vocabulary | 独立阶段cursor、同op恢复、安全handoff；不产生evidence |

#### 7.2.3 Capability与对象映射

| capability | 输入 | 输出 | 状态 / 副作用 | 协作边界 | 后续Step承接 |
|---|---|---|---|---|---|
| 安全公共词汇 | owner/platform正式定位与safe来源约束 | typed ref/Slot/marker/finite reason | 无IO/authority mutation | 所有模块共用；不能解析opaque ref推scope | Step6字段/值域/来源与public传递闭包 |
| C/E/J协议承载 | 显式metadata、原subject/op、safe envelope | request/result/独立ACK与业务disposition | DTO无send/commit/accept副作用 | entry解码 -> application复核；O01另受资格 | Step8完整schema/构造/serde/error |
| 安全Query/view/page | 获准read scope与已有stage slice | BridgeLocalView/typed page/marker | 无写/audit/dedup/refresh/probe | application safe read；资格不足denied/degraded | Step6 view carrier；Step8读协议 |
| 条件O01外传载体 | 已提交local mutation与canonical/admission refs | body-free disposition event | 仅data shape；不自行生成producer材料 | Application唯一材料源、infra传输 | Step8协议；Step11/15提交/交接资格 |
| config引用边界 | InstallationConfigDraft/opaque secret/route/capability refs | 安全配置carrier | 无secret resolve/激活 | infra loader/validator/qualification | Step6稳定载体；Step14/04绑定/值 |

| 对象组 | 承接功能 | 类别 / 对象能力 | 不承接 / 禁止 | 后续闭口 |
|---|---|---|---|---|
| core四重导出 | trusted actor与metadata | external shared，复用真实schema | 不复制schema，不使hint成为权限 | Step6使用约束，Step8入口构造 |
| 十shared词汇组 | locator/authority/operation/material/delivery/callback/continuity/trace/outcome | safe carrier，保持kind、来源、阶段和缺失姿态 | 不签发owner basis、不读取外部正文 | Step6逐type/enum/Slot；Step7读取来源 |
| BridgeLocalView及view/page/marker | U6安全只读 | public read载体，允许stale/degraded/denied且禁止存在性泄漏 | 不新增domain副本或状态机 | Step6稳定载体；Step8完整page/response |
| C/E/Q/J/O public协议 | 20主语协议 | DTO族，每族完整request/result传递类型 | 不引private handles/internal snapshots/domain实体 | Step8逐协议族；必要stable carrier Step6 |
| InstallationConfigDraft/opaque secret/route引用 | U1配置 | safe配置载体，不含secret值 | 不默认SDK/OAuth/KMS/route产品或安装ready | Step6字段；Step14资格，04值 |
| public错误/有限reason | 所有拒绝/blocked/unknown出口 | protocol classification，安全返回面 | raw error/details/token/敏感body不传播 | Step8/12有限variant与mapping |

#### 7.2.4 对象实现契约归属预告

上述type在本模块唯一public定义；完整struct/enum/value object卡由Step6推导、协议完整DTO由Step8补齐。只读反查Step4分组表，243索引中contracts负责225个既有名称（含四core重导出），Application17个、Domain1个；后两组不能顺手公开。计数是既有索引责任，不是当前完整public schema数量；任何public传递类型都须有唯一定义和来源反查。

#### 7.2.5 Trait / Port / Adapter责任预告

本模块不定义repository/owner/platform port，不实现adapter。trusted input、authority/qualified refs、original result/coverage等来源契约均由application定义读取port、infra绑定真实来源；public DTO不可引用该port的internal snapshot或private context。

#### 7.2.6 模块内关键调用责任

公开carrier构造/输入shape验证、core metadata复用和safe序列化拒绝由此模块承载；业务current qualification到Application。具体factory、method与Rustdoc到Step6/8；不在本Step写泛化`validate`签名或未核验owner callable。未来source代码英文，设计Rustdoc中文，沿Step3适用场景。

#### 7.2.7 模块错误归属预告

| 触发边界 | 返回给谁 | retry语义 | 映射 / 后续 |
|---|---|---|---|
| 协议shape/version/required metadata/private穿透 | api/worker/jobs/application | 输入错误不产生业务retry许可 | errors.rs及shared/outcomes.rs；Step8/12定类型/variant |
| 外层finite reason/disposition输出 | 正式consumer | unknown/blocked为阶段结果，不改写accepted | Application/entry映射到public有限面；Step12 |

#### 7.2.8 模块测试切口预告

| 切口 | 覆盖责任 | 验证内容 | 计划入口 / 后续 |
|---|---|---|---|
| public shape/传递闭包 | DTO、metadata、view、config、error | core单一来源、typed kind/Slot/marker、ACK分层、拒private/raw派生 | `crates/contracts/tests/protocol_surface_tests.rs`；Step16/05，不执行 |

复杂度：文件表按协议与词汇职责分组，不重抄243逐名索引；五capability/六对象组足以区分carrier与authority。完整card/enum不能被本表替代。

### 7.3 M2 domain模块

#### 7.3.1 模块职责

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/domain` / bridges-domain / bridges_domain |
| 对应概要部分 | 02§5/6六U与20对象（本模块19）、§9的17机/三无机、§10异常保护 |
| 主要责任 | 局部model、同步factory/guard/transition；检查显式输入符合本地不变量，不自行产生authority |
| 对外暴露 | 19local model及其state/guard供Application；内部领域类型不作为public wire |
| 允许依赖 | contracts；纯语言必要能力，具体额外依赖须后续核验 |
| 禁止依赖 | application/infra/api/worker/jobs、repository/config/executor/DB/HTTP/SDK/owner/private材料 |

#### 7.3.2 文件与代码主体映射

| 文件路径 | 代码主体 | 类型 | 责任 |
|---|---|---|---|
| `crates/domain/src/lib.rs` | 六业务module显式exports | module surface | 仅纯local model；不导出platform/client |
| `crates/domain/src/binding/bridge_installation.rs` | BridgeInstallation | local model | 配置revision/qualification，不拥有平台安装truth |
| `crates/domain/src/binding/external_binding.rs` | ExternalBinding | relation model | 显式basis/范围/方向/action/generation、撤销/expiry |
| `crates/domain/src/binding/external_identity_mapping.rs` | ExternalIdentityMapping | mapping model | account -> 正式actor/kind/basis，不创建GlobalMember |
| `crates/domain/src/binding/external_location_mapping.rs` | ExternalLocationMapping | mapping model | channel/DM/topic/thread两端、parent与受权target，不猜默认频道 |
| `crates/domain/src/binding/external_message_mapping.rs` | ExternalMessageMapping | mapping model | known owner/platform结果、source版本/marker与原消息变化关系 |
| `crates/domain/src/inbound/inbound_handoff_record.rs` | InboundHandoffRecord | handoff model | 验证/ACK/安全接管/owner结果各自记录，无durable body inbox |
| `crates/domain/src/delivery/safe_presentation_plan.rs` | SafePresentationPlan | local plan | qualified projection/Gate降级/attachment refs；不是正文DTO |
| `crates/domain/src/delivery/delivery_intent.rs` | DeliveryIntent | local intent | immutable source/target/effect；共同semantic uniqueness义务 |
| `crates/domain/src/delivery/delivery_attempt.rs` | DeliveryAttempt | attempt model | 原effect、claim/fence/window、current basis和known/unknown |
| `crates/domain/src/delivery/platform_receipt.rs` | PlatformReceipt | immutable record | 权威known business result，不是HTTP ACK/读回执truth，无独立机 |
| `crates/domain/src/callback/external_action_binding.rs` | ExternalActionBinding | action relation | source message/intent、actor/target/action/owner revision/expiry/one-use |
| `crates/domain/src/callback/callback_handoff_record.rs` | CallbackHandoffRecord | handoff model | verified/current responsibility、claimed与原owner op/结果分离；不复活claim |
| `crates/domain/src/continuity/dedup_record.rs` | DedupRecord | local continuity | 六namespace的body-free meaning与原safe result；同键变义不执行 |
| `crates/domain/src/continuity/stream_cursor.rs` | StreamCursor | local cursor | scope/stream/epoch/comparator/coverage；protocol/owner/effect位置独立 |
| `crates/domain/src/continuity/gap_record.rs` | GapRecord | gap model | qualified范围/coverage与manual姿态，不靠时间推关闭 |
| `crates/domain/src/continuity/dispatch_lane.rs` | DispatchLane | local order/limit | order scope/fence、共享bucket下界与bounded预算；不保证平台全局顺序 |
| `crates/domain/src/continuity/recovery_record.rs` | RecoveryRecord | same-op model | 权威结果/probe/no-effect/window；unknown不产生新effect |
| `crates/domain/src/traceability/safe_audit_record.rs` | SafeAuditRecord | immutable safe record | 一次local mutation唯一producer材料；不是evidence，无独立机 |
| `crates/domain/src/traceability/safe_handoff_record.rs` | SafeHandoffRecord | safe handoff model | canonical/admission与consumer pending/accepted/unknown独立 |

六组`mod.rs`沿Step4只负责各组model exports；没有新的policy.rs/errors.rs/平台实体文件。第20对象BridgeLocalView唯一public定义见contracts/views.rs，不在本表重复定义。

#### 7.3.3 Capability与对象映射

| capability | 输入 | 输出 | 状态 / 副作用 | 协作边界 | 后续Step承接 |
|---|---|---|---|---|---|
| 局部安装/显式relation/typed mapping成立 | 合格config/current basis、两端locator、generation/revision | 五binding model的合法局部变化 | local state only；无身份/频道创建 | qualification来自port，store CAS/唯一由外层执行 | Step6对象/Slot；Step10状态；Step11/13CAS |
| 入站安全阶段成立 | verified source/marker/qualified material/原owner结果 | InboundHandoffRecord阶段 | protocol ACK不推进owner accepted | Application验证来源与owner handoff，正文在private seam | Step6/10；Step9交接 |
| 安全准备与效果/尝试/已知结果分离 | committed source、allowed projection/attachment/current target | plan/intent/attempt/receipt | effect不可改义；known/unknown显式 | 同effect唯一和外部业务结果由repo/platform提供 | Step6/10；Step11/13唯一 |
| action责任与one-use成立 | source/actor/action/owner revision/expiry及正式result | action binding/callback record | claimed不因timeout重新授权；无Decision mutation | current责任/owner action来自port | Step6/10；Step9/13one-use |
| 原op连续性/局部顺序成立 | scoped key/meaning、comparable position/coverage、limit/no-effect basis | dedup/cursor/gap/lane/recovery | 不能比较即gap；下界不缩短；unknown不续发 | authority来自repo/owner/platform，不靠lease/NotFound推断 | Step6/10；Step11~13 |
| safe mutation与conditional handoff成立 | committed mutation、安全allowlist、canonical/admission/result refs | audit/handoff | 无body/rawbody hash/secret；mandatory缺失阻对应副作用 | Application唯一producer、Observability正式consumer | Step6/10；Step11/15 |

| 对象 | 承接功能 | 对象类别 / 能力 | 不承接 / 禁止 |
|---|---|---|---|
| BridgeInstallation | 安装配置 | adapter-local model，revision与资格分离 | 不证明真实installation/scope支持 |
| ExternalBinding | 受权关系 | relation，generation/撤销/expiry guard | 不授owner/platform权限 |
| ExternalIdentityMapping | account映射 | typed relation，kind/basis guard | external_id不建GlobalMember/human认证 |
| ExternalLocationMapping | channel/DM/topic/thread映射 | typed relation，两端/parent guard | 不取得内部Conversation或平台channel truth |
| ExternalMessageMapping | message/change关联 | safe关系，原结果/source版本/marker guard | 不保存Message/Turn/body镜像，不猜edit/delete目标 |
| InboundHandoffRecord | inbound阶段 | record，ACK/owner/result独立guard | ACK不等Turn，不能保存raw输入 |
| SafePresentationPlan | safe外显 | plan，projection/disclosure/attachment guard | 不自行判低敏感或恢复正文 |
| DeliveryIntent | 逻辑效果 | intent，immutable target/effect guard | C04/E02不能各发一个effect |
| DeliveryAttempt | 尝试 | attempt，fence/window/unknown guard | 重试不建新effect，过期claim不证no-effect |
| PlatformReceipt | 平台业务结果 | immutable record，known result关联 | HTTP 2xx不自动构造，无独立机 |
| ExternalActionBinding | action关系 | relation，actor/target/version/expiry guard | source签名不替action许可 |
| CallbackHandoffRecord | callback接管 | record，one-use/原owner结果guard | claimed不可复活，不拥有Gate/Decision |
| DedupRecord | namespace幂等 | record，同义复用/变义冲突guard | 窗口过期不自动执行，不能hash raw body |
| StreamCursor | 分阶段位置 | cursor，scope/epoch/comparator guard | source version/key/timestamp非通用cursor |
| GapRecord | 缺口 | record，coverage/manual guard | 非权威覆盖不关闭，不能raw replay |
| DispatchLane | 顺序/限流 | lane，order/limit/budget/fence guard | 不缩平台等待，不用独立lane逃全局bucket |
| RecoveryRecord | 原op恢复 | record，same-op/known/proof/manual guard | timeout/lease/NotFound不推无效果，不换target |
| SafeAuditRecord | 安全局部审计 | immutable record，唯一mutation材料 | 不造evidence/report，Query不创建，无独立机 |
| SafeHandoffRecord | 安全交接 | record，canonical/admission/result guard | producer/transport ACK不等consumer accepted |

#### 7.3.4 对象实现契约归属预告

19model、其必要value object/state/guard的完整card在Step6按上述能力推导；state trigger/非法边在Step10，store全局唯一与CAS在Step11/13。类型可构造、domain guard通过只是局部合法，不构成current owner资格或外部结果证明；Application必须复核调用时效。

#### 7.3.5 Trait / Port / Adapter责任预告

本模块不定义repository或外部port，无IO trait；23port归Application。不得在guard中直接resolve secret/material、调用owner、更新DB、发平台请求。public summary/result与domain model之间由Application result_mapping负责显式转换。

#### 7.3.6 模块内关键调用责任

factory/local transition/invariant error归对应model文件，不建额外通用Manager。已知结果须与原op/effect/target/generation关联；cursor只接受可比同stream/epoch位置；receipt/audit只安全record形成。具体typed方法与variant到Step6/10，Application调用顺序到Step9。

#### 7.3.7 模块错误归属预告

| 触发边界 | 返回给谁 | retry语义 | 映射 / 后续 |
|---|---|---|---|
| locator/kind/basis/代际/immutable effect/非法转换 | Application | 错误不授权retry；conflict需正式重审 | model同置guard错误 -> Application -> finite public；Step6/12 |
| unknown/no-comparator/无coverage/缺资格 | Application | 不以empty/default/timeout转成功或无效果 | 是保守阶段或拒绝，不吞作通用Internal；Step10/12 |

#### 7.3.8 模块测试切口预告

| 切口 | 覆盖责任 | 验证内容 | 计划入口 / 后续 |
|---|---|---|---|
| pure local guards | 19model/17stateful subjects | 两端定位/代际、effect不改义、one-use不可复活、cursor不可比、下界/unknown/安全record | `crates/domain/tests/local_guards_tests.rs`；Step16/05，不运行 |

复杂度：每个既有对象独立责任行，六capability横向定位；这是归属预告，不把多个对象合并成Step6对象card。无new truth/对象/状态主语或独立机。

### 7.4 M3 application模块

#### 7.4.1 模块职责

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/application` / bridges-application / bridges_application |
| 对应概要部分 | 02§4 Application/Ports、§7本地port需求、§8的19flow、§10/11异常与配置影响 |
| 主要责任 | current qualification、domain调用、local UoW/CAS/结果读取、private瞬时材料边界及受限外部交接编排 |
| 对外暴露 | 仓内19用例facade和23port；internal snapshot/private carrier仅受限seam，不进入public API |
| 允许依赖 | contracts、domain；executor-neutral Future模型 |
| 禁止依赖 | infra/api/worker/jobs、具体DB/HTTP/Bus/executor/SDK/provider；不写owner私表或直接Platform API |

#### 7.4.2 文件与代码主体映射

| 文件路径 | 代码主体 | 类型 | 责任 |
|---|---|---|---|
| `crates/application/src/commands/configure_bridge_installation.rs` | C01 ConfigureBridgeInstallation | use case | config/revision/current安装资格；不激活未核provider |
| `crates/application/src/commands/manage_external_binding.rs` | C02 ManageExternalBinding | use case | 受权relation/generation/撤销关联失效 |
| `crates/application/src/commands/maintain_external_mapping.rs` | C03 MaintainExternalMapping | use case | 三typed mapping、两端basis/current context/CAS |
| `crates/application/src/commands/prepare_external_delivery.rs` | C04 PrepareExternalDelivery | use case | safe plan/intent准备，与E02共享semantic effect唯一，不send |
| `crates/application/src/commands/bind_external_action.rs` | C05 BindExternalAction | use case | source/actor/target/action/owner version/expiry/one-use关系，不approval |
| `crates/application/src/commands/request_bridge_recovery.rs` | C06 RequestBridgeRecovery | use case | 既有subject/原op受权维护请求，不在command重发 |
| `crates/application/src/consumers/platform_input_received.rs` | E01 PlatformInputReceivedConsumer | use case | verified source/marker、safe接管、owner handoff与ACK独立 |
| `crates/application/src/consumers/committed_source_available.rs` | E02 CommittedSourceAvailableConsumer | use case | committed source资格、复用C04准备语义，不直接send |
| `crates/application/src/consumers/platform_callback_received.rs` | E03 PlatformCallbackReceivedConsumer | use case | source验证/current责任、one-use claim与同owner op交接 |
| `crates/application/src/consumers/safe_handoff_disposition.rs` | E04 SafeHandoffDispositionConsumer | use case | 只消费原handoff/canonical相关的正式consumer结果 |
| `crates/application/src/queries/get_binding_mapping_view.rs` | Q01 GetBindingMappingView | read use case | 已有config/relation/mapping安全slice，无repair/audit |
| `crates/application/src/queries/get_bridge_operation_view.rs` | Q02 GetBridgeOperationView | read use case | 独立operation阶段/visibility，不发owner/platform probe |
| `crates/application/src/queries/get_continuity_view.rs` | Q03 GetContinuityView | read use case | cursor/gap/lane/recovery安全slice，不推进位置 |
| `crates/application/src/queries/get_safe_handoff_view.rs` | Q04 GetSafeHandoffView | read use case | safe audit/handoff只读slice，不生成证据或accepted |
| `crates/application/src/jobs/dispatch_queued_delivery.rs` | J01 DispatchQueuedDeliveryJob | use case | 既有intent/current资格/claim/window、受限平台IO与结果回收 |
| `crates/application/src/jobs/reconcile_bridge_operation.rs` | J02 ReconcileBridgeOperationJob | use case | 原subject/op/effect权威probe、known finalize/no-effect资格/manual |
| `crates/application/src/jobs/reconcile_stream_gap.rs` | J03 ReconcileStreamGapJob | use case | 同stream/epoch/comparator/coverage下受权恢复，非raw replay |
| `crates/application/src/jobs/retry_safe_handoff.rs` | J04 RetrySafeHandoffJob | use case | 同canonical/op获准交接，mandatory admission先验 |
| `crates/application/src/jobs/refresh_bridge_qualification.rs` | J05 RefreshBridgeQualificationJob | use case | 既有subject current来源与关联失效，不能刷新出权限 |
| `crates/application/src/local_mutation.rs` | QualifiedLocalMutationPlan / 条件O01源 | internal coordinator | local subject/dedup/result/audit/条件handoff同UoW、唯一安全mutation材料源 |
| `crates/application/src/qualification_invalidation.rs` | QualificationInvalidationPlan | internal coordinator | J05跨subject责任分配，各所属编排收束失效，不换effect/target |
| `crates/application/src/metadata_validation.rs` | metadata/source/current context检查 | validator | core metadata只一套；必需key/安全reason与trace bounded |
| `crates/application/src/result_mapping.rs` | domain/snapshot -> safe public result/view | mapping | current可见性与allowlist；不透传domain/private/foreign rawerror |
| `crates/application/src/private_material.rs` | 五private载体 | non-wire carrier | 受限factory/生命周期/清理、默认无Debug/Serialize/Clone |
| `crates/application/src/ports/local_snapshots.rs` | 九internal snapshot | repository read carrier | 本地safe字段/原结果/读取资格，非owner镜像/public DTO |

`lib.rs`与commands/consumers/queries/jobs/ports的`mod.rs`沿Step4负责明确exports；port责任文件见§7.4.5，不新增通用execute/service/replay对象或第20请求flow。

#### 7.4.3 Capability与对象映射

| capability | 输入 | 输出 | 状态 / 副作用 | 协作边界 | 后续Step承接 |
|---|---|---|---|---|---|
| U1受权配置/relation/mapping | trusted CommandMetadata、提案、current basis/expected revision | body-free局部result/ref | CAS/代际变化与所属关联失效；不建身份/频道 | Binding/Config qualification + Installation/Mapping repo | Step6内部carrier；Step7读取/写port；Step9/11 |
| U2安全接管/owner交接 | PrivateIngressContext、safe envelope、verified source/marker、current mapping/material及已知self-send关系 | 独立ProtocolAckPlan、inbound/owner结果或回环quarantine/gap | scoped dedup、防回环与same-op handoff；自报marker/显示名/前缀非依据，无raw durable | PlatformIngress/PrivateMaterial/ConversationHandoff、Mapping/Inbound repo | Step6/7；Step8/9 inbound |
| U3准备与dispatch分离 | C04/E02合格source/projection/附件；J01既有intent/current资格 | plan/intent或attempt/known receipt/unknown | shared effect唯一、claim/fence/limit；网络不包local UoW | Presentation/PlatformDelivery/Delivery/Lane/Continuity | Step6/7；Step9/11~13 |
| U4 one-use与current责任交接 | private callback/source binding、actor/target/action/owner revision/expiry | verified/claimed/owner result或blocked/unknown | 当前资格、原owner op，一次claim不复活 | CallbackVerification/ActorResponsibility/OwnerAction/Callback repo | Step6/7；Step9/10/13 |
| U5幂等/游标/顺序/原op恢复 | scoped key/meaning/result、original subject/op/effect、comparator/coverage/window/no-effect | duplicate/conflict、gap/known finalize/manual | 独立阶段cursor、共享bucket下界、bounded预算；未知不新发 | Continuity/Lane/AuthoritativeRecovery + local commit proof | Step6/7；Step11~13 |
| U6唯一safe mutation/handoff | QualifiedLocalMutationPlan、canonical/schema/admission与正式disposition | audit/conditional O01/handoff阶段 | mandatory缺资格先阻mutation/IO；ACK非consumer accepted | LocalUnitOfWork/SafeObservation/SafeTrace | Step6/7；Step11/15 |
| U6安全读取 | QueryMetadata、current read qualification、local snapshot/page | BridgeLocalView/finite denied/degraded | 严格无write/audit/dedup/refresh/probe/repair；不泄count/ref | SafeReadQualification与受限repo read | Step6稳定view/snapshot；Step7/8/9 |
| private材料/secret生命周期 | exact safe ref/version/current use资格 | 瞬时受限handle/context | 不入wire/durable/log/evidence，不自动Clone/Debug | PrivateMaterial/SecretResolution；infra provider | Step6载体/factory/lifetime；Step7来源；Step14 |

| 对象组 | 承接功能 | 类别 / 能力 | 不承接 / 禁止 | Step6闭口责任 / 后续 |
|---|---|---|---|---|
| 19用例编排facade | 四入口族与上述业务capability | application service responsibility | 不新建owner实体、Platform SDK或通用replay | 推导其唯一稳定carrier/闭口或defer理由；callable到Step7、flow到Step9 |
| PrivateIngressContext / PrivateCallbackContext | 受验证源及私有入站/交互暂存 | restricted private context | 签名/安装不替内部actor，raw input不能持久 | Step6生命周期/factory/消费/清理；Step7来源与Send边界 |
| PrivateQualifiedPayload | 合格材料瞬时转换 | restricted private payload | 无public serde/通用Debug/日志与缓存 | Step6存活期/派生禁令；Step7 provider契约 |
| TransientQualifiedMaterialHandle | exact source/version/current资格材料读取 | restricted private handle | 不由String/ref自己制造，不跨失效继续复用 | Step6唯一source/factory/lifetime；Step7材料port |
| PrivateSecretHandle | secret引用受权解析 | restricted private handle | 无raw secret fallback/复制/输出 | Step6生命周期/revoke；Step7/14 provider/use资格 |
| InstallationSnapshot / AuthorizedMappingSnapshot | local config/relation/mapping读取 | internal repository snapshot | 不拥有platform/owner basis，不作public DTO | Step6稳定carrier字段/缺失姿态；Step7读取面 |
| InboundSnapshot / DeliverySnapshot / CallbackSnapshot | 原op阶段和结果读取 | internal repository snapshot | 原结果读取不重解析/再IO，不含body | Step6稳定result载体；Step7读取；Step11提交证明 |
| ContinuitySnapshot / LaneSnapshot / SafeHandoffSnapshot / ExistingLocalSnapshot | 既有subject、order/coverage/结果/availability读取 | internal repository snapshot | 不以missing/default推no-effect，不泄不可见ref | Step6稳定载体；Step7 lookup，Step11~13 |
| QualifiedLocalMutationPlan / QualificationInvalidationPlan | mutation唯一源/所属失效编排 | internal plan | 不创建权限、producer或新effect | Step6本地plan字段/来源；Step7/9/11/15 |
| IngressVerificationResult | protocol验证/ACK与safe接管分界 | internal ingress result | 不以ACK声明owner accepted，无private body wire | Step6carrier；Step7/8 inbound/ACK |
| 23port / repo / local UoW | 边界读取/写入/IO需求 | abstract trait responsibility | 本地接口名不证明foreign callable存在 | Step7完整签名/error/来源/read-write；driver Step11 |

#### 7.4.4 对象实现契约归属预告

以上非core组不是全部defer：Step6必须逐组决定哪些稳定载体当步完整闭口、哪些因port/protocol定义延后，并记录理由和明确承接位置。完整trait及service callable到Step7；完整protocol DTO到Step8；不得用future Step名掩盖字段来源缺口。当前只给责任，不提前落card/签名。

#### 7.4.5 Trait / Port / Adapter责任预告

| 定义责任文件 | port / repository名称 | 读取 / 输出责任 | 实现责任与限制 |
|---|---|---|---|
| `crates/application/src/ports/binding.rs` | BindingQualificationPort、MappingRepository、InstallationRepository | current授权/两端basis；local mapping/config读取/CAS | infra/owners与local_store；不自grant或声称SDK同名方法 |
| `crates/application/src/ports/inbound.rs` | PlatformIngressPort、ConversationHandoffPort、InboundRepository | verified source/ACK、qualified same-op owner handoff/known result、safe记录 | infra/platform/private/Conversation/local_store；ACK与owner阶段独立 |
| `crates/application/src/ports/delivery.rs` | PresentationQualificationPort、PlatformDeliveryPort、DeliveryRepository | safe projection/Gate/附件；typed effect/业务结果/限流；既有intent读写 | infra/owners/platform/local_store；HTTP不造receipt，current qualification调用前复核 |
| `crates/application/src/ports/callback.rs` | CallbackVerificationPort、ActorResponsibilityPort、OwnerActionPort、CallbackRepository | private来源、current责任/action、原owner op、one-use/local阶段 | infra/platform/owners/local_store；签名非授权，claimed不可复活 |
| `crates/application/src/ports/continuity.rs` | ContinuityRepository、AuthoritativeRecoveryPort、LaneRepository | 六namespace/key/result/cursor/coverage；原op权威结果/no-effect；共享限流/顺序 | infra/local_store/commit_probe/正式platform-owner probe；missing不证无效果 |
| `crates/application/src/ports/traceability.rs` | SafeObservationPort、SafeReadQualificationPort、SafeTraceRepository | canonical/admission/consumer result、只读资格、safe local audit/handoff/view | infra/Observability/conditional Workspace/local_store；不创建evidence或query副作用 |
| `crates/application/src/ports/private_material.rs` | PrivateMaterialPort | exact source/version/current authority -> transient qualified handle | infra/private_material与正式owner；禁止durable cache |
| `crates/application/src/ports/secret.rs` | SecretResolutionPort | opaque ref/version/scoped use -> private secret handle | infra/secrets；不预选KMS/OAuth或明文fallback |
| `crates/application/src/ports/config_qualification.rs` | ConfigQualificationPort | config/installation/capability/grant/route/secret当前资格 | infra/configuration/qualification；配置接受不等激活 |
| `crates/application/src/ports/local_uow.rs` | LocalUnitOfWorkPort | local write set、CAS/commit disposition及原op结果读取证明需求 | infra/persistence；无网络事务，commit ACK lost不推rollback |

总数23，按3+3+3+4+3+3+4分组；mapping/local state/结果和qualified外部读取必须成对承接，port具体签名由Step7闭口，不在本Step伪造foreign method。

六dedup namespace固定沿02§6.14为`management / inbound / outbound / callback / recovery / handoff`，与installation及内部获准scope共同隔离。C04/E02虽然管理/source入口不同，必须共享同一semantic effect唯一保护；namespace隔离不能变成重复外部效果许可。exact key、body-free meaning版本与结果读面到Step6/7/11~13闭口；不hash raw body、不删过期key重执行。

#### 7.4.6 模块内关键调用责任

metadata_validation管单一core输入约束；19用例各管current qualification/所属domain与port调用；local_mutation管本地提交与条件安全材料源；result_mapping管当前可见safe结果；qualification_invalidation只把既有subject失效交所属用例。具体函数/调用顺序/事务矩阵分别到Step7/9/11，当前不写可执行伪代码。

去重同义结果复用与新的效果申请不是一回事；Application必须从受权原结果读取面返回，不能在duplicate路径重解析private材料、重新评估历史target或发外部IO。未知本地commit、owner handoff、platform效果、consumer交接分别保持原op，不能用一个retry helper统一重发。

#### 7.4.7 模块错误归属预告

| 触发边界 | 返回给谁 | retry语义 | 映射 / 后续 |
|---|---|---|---|
| current basis/read/material/action/mandatory admission缺失或失效 | entry/consumer/jobs | fail-closed；不是低敏感默认许可或audit-only | 所属use case -> finite public；Step7/8/12 |
| same key变义/CAS/claim/effect唯一冲突 | entry/jobs | conflict/quarantine；不换key/target/effect规避 | local repo/domain -> Application；Step11~13 |
| commit/owner/platform/consumer结果未知 | entry/jobs/safe view | 不自动再apply；权威同op probe/manual | original subject/operation保持；Step7/11/12 |
| rate limit/window/预算不成立 | jobs/worker | 不缩下界；retry须known no-effect+current资格+预算 | Lane/Delivery/Recovery责任；Step12/13 |

#### 7.4.8 模块测试切口预告

| 切口 | 覆盖责任 | 验证内容 | 计划入口 / 后续 |
|---|---|---|---|
| current受权与材料保护 | binding/inbound/delivery/callback/local_mutation | 显式basis、敏感Gate/附件失效、one-use、mandatory不足先阻IO | `crates/application/tests/authorization_flow_tests.rs`；Step16/05 |
| continuity/unknown | effect/dedup/cursor/lane/recovery/UoW | C04/E02同effect、ACK lost、原op/coverage、429下界、缺proof不重发 | `crates/application/tests/continuity_flow_tests.rs`；Step16/05 |
| qualified safe read | Q01~04/result_mapping | no-write/audit/dedup/refresh/probe/count-ref泄漏；duplicate受权读取 | `crates/application/tests/safe_read_tests.rs`；Step16/05 |

test-only support沿`crates/application/tests/support/qualified_ports.rs`和`mod.rs`；未来合成结果不证明真实owner授权/提交/no-effect。复杂度：19用例逐文件+23port分组+非core载体责任足以定位所有入口和边界；不把清单等同Step6对象闭口或Step9flow完成。

### 7.5 M4 infra模块

#### 7.5.1 模块职责

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/infra` / bridges-infra / bridges_infra |
| 对应概要部分 | 02§4 Outer Adapters、§7.8端口承接、§10/11/13异常/config/上游资格 |
| 主要责任 | 正式来源到typed安全边界的转换、local driver binding、private材料/secret/config/runtime assembly；不反向定义domain语义 |
| 对外暴露 | 合格adapter/store/configuration/composition；只供entry装配，不把provider/private类型公开到contracts |
| 允许依赖 | contracts、domain、application；外部产品依赖仅后续资格核验后按pin引入 |
| 禁止依赖 | api/worker/jobs；不得依赖owner源码/私表、选用Chat未停审路由、让产品进入core层 |

#### 7.5.2 文件与代码主体映射

| 文件路径 | 代码主体 | 类型 | 责任 |
|---|---|---|---|
| `crates/infra/src/platform/slack.rs` | SlackPlatformAdapter | platform adapter | installation/scope/private验证、locator/ACK/result/limit/probe按Slack差异映射 |
| `crates/infra/src/platform/mattermost.rs` | MattermostPlatformAdapter | platform adapter | instance/version/plugin或受信context、post/root与部署限流，不假设Slack headers |
| `crates/infra/src/platform/telegram.rs` | TelegramPlatformAdapter | platform adapter | bot update/offset、poll/webhook互斥、callback/topic/权限窗口与retry_after资格 |
| `crates/infra/src/platform/discord.rs` | DiscordPlatformAdapter | platform adapter | HTTP/Gateway交互互斥、私有token期限/session/intent/bucket/resume边界 |
| `crates/infra/src/owners/conversation.rs` | 正式Conversation handoff/source/result/recovery绑定 | owner adapter | target_mode/ActorRef/BridgeMapped/required digest，不发明submitTurn |
| `crates/infra/src/owners/identity.rs` | 正式AI identity/责任锚点消费 | owner adapter | external human认证另有owning来源缺口，不创建GlobalMember |
| `crates/infra/src/owners/governance.rs` | current Policy/Gate/disclosure/action读取与交接 | owner adapter | 只formal资格/正式command，不把本地签名/安装当approval许可 |
| `crates/infra/src/owners/artifact.rs` | authorized附件/material引用绑定 | owner adapter | 准入/访问/传播/expiry/revoke；不保存附件/URL/token正文 |
| `crates/infra/src/owners/workspace.rs` | 条件safe read/export/provenance绑定 | owner adapter | 只选用qualified分支；不是频道/权限owner，不引全流程强前置 |
| `crates/infra/src/owners/observability.rs` | canonical/admission/result/recovery正式绑定 | owner adapter | 缺mandatory阻对应IO/mutation，consumer结果不能由transport造 |
| `crates/infra/src/events/transport.rs` | 合格event/source/envelope/ACK转换 | transport adapter | Bus/SDK未选，不接raw durable envelope或增加producer |
| `crates/infra/src/persistence/local_store.rs` | 八local repositories + LocalUnitOfWorkPort binding | driver adapter | 安全local写集/唯一/CAS/原结果读取；无owner表，无raw store |
| `crates/infra/src/persistence/commit_probe.rs` | 原op local commit结果证明绑定 | proof adapter | authoritative read-only disposition，ACK lost不推rollback/no-effect |
| `crates/infra/src/private_material.rs` | PrivateMaterialPort binding | private adapter | exact safe ref/version/current use -> 短生命周期handle，无缓存/通用Debug |
| `crates/infra/src/secrets.rs` | SecretResolutionPort binding | secret adapter | opaque provider/ref/version/scope、rotation/revoke与private handle，无明文fallback |
| `crates/infra/src/audit.rs` | 安全log/metric/trace/交接allowlist | output boundary | raw error/body/可还原派生/rawbody hash禁入；不建第二mutation producer |
| `crates/infra/src/configuration/settings.rs`、`crates/infra/src/configuration/load.rs` | safe settings与structured intake | config boundary | 只ref/资格绑定结构；未选格式/优先级/产品值留Step14/04 |
| `crates/infra/src/configuration/validate.rs`、`crates/infra/src/configuration/qualification.rs` | required seam/mode检查与ConfigQualificationPort binding | validator / adapter | route/current安装/provider/capability与secret独立，缺必需条件拒绝激活 |
| `crates/infra/src/runtime/composition.rs`、`crates/infra/src/runtime/execution.rs` | 合格port装配、bounded run/shutdown | runtime boundary | 宿主选择executor；cancel/timeout不消除外部unknown，production无fake fallback |

`lib.rs`及platform/owners/events/persistence/configuration/runtime的`mod.rs`沿Step4仅显式exports；无新fake生产模块、泛化platform truth或新executor member。

#### 7.5.3 Capability与对象映射

| capability | 输入 | 输出 | 状态 / 副作用 | 协作边界 | 后续Step承接 |
|---|---|---|---|---|---|
| 四平台入/出站反腐 | qualified installation/config、private源、受权target/effect | verified source/ACK/known result/limit或finite unsupported/blocked/unknown | 只Application许可下执行平台IO；不改变owner truth | Application platform/callback/delivery/recovery ports | Step7 exact callable/authority，Step8协议，Step14实例/pin |
| 六owner正式合同消费 | trusted context、typed source/target/action/原op | current basis/qualified refs/known result/availability | 正式read或获准owner handoff；无跨仓事务/私表 | 正式owner/conditional Workspace/Observability | Step7双向mapping与缺口，Step14产品绑定 |
| local安全持久化与commit proof | qualified local write set/expected revision、original op | CAS/commit disposition/原safe result/snapshot | 本地原子性/唯一/读取面；不存private材料 | 八repo/LocalUoW/AuthoritativeRecovery需求 | Step7 port，Step11driver证明，Step13幂等 |
| private材料/secret受权读取 | exact safe ref/version/current use/opaque secret | transient handle或安全失效分类 | 瞬时IO，默认无Serialize/Debug/Clone，清理/取消不外泄 | PrivateMaterial/SecretResolution + 正式provider | Step6carrier、Step7lifetime/source、Step14资格 |
| config/route/runtime装配 | 安全settings、required seam与mode/pin/source资格 | qualified composition或明确不装配 | 不默认选产品/双入口，不刷新出authority | ConfigQualification与宿主execution seam | Step6稳定availability carrier决策，Step7/14/04 |
| 外层安全观测输出 | 已合格body-free stage/ref/finite error | 受限log/metric/trace或交接映射 | 不加producer、Query不写业务audit；无证据结论 | Application唯一material source/Observability | Step12有限错误、Step15allowlist |

| 对象组 | 承接功能 | 类别 / 对象能力 | 不承接 / 禁止 | 后续闭口 |
|---|---|---|---|---|
| 四PlatformAdapter | source/ACK/locator/变化/线程/附件/业务结果/限流 | adapter责任，各自capability/current installation拒绝 | 不造统一平台truth、默认全method/probe支持 | Step6判稳定载体；Step7具体adapter合同；Step14pin/installation |
| 六owner adapter | formal qualification/material/source/action/result | runtime反腐，只组合有来源的typed依据 | 不是全域authorizer，不复制owner对象/权限 | Step7双向protocol mapping、BR-UP资格；Step14client |
| local_store/commit_probe | local repo/UoW/结果proof | driver责任，unknown与权威终局分离 | NotFound/超时/fake不构成rollback或no-effect | Step7读写面；Step11隔离/证明；Step13唯一 |
| private material/secret provider binding | 瞬时材料/credential使用 | adapter，exact source/version/scope及revoke | 无raw durable、token/debug/明文fallback | Step6稳定private carrier；Step7/14provider |
| settings/loader/validator/composition/execution | required seam、模式、availability与bounded宿主 | config/runtime责任 | 不把文件存在写成已启动或产品ready | Step6对稳定非core载体作闭口/defer决策；Step7/14/04 |
| audit allowlist | 安全输出错误/阶段 | output boundary，不是truth model | 不造report/evidence/第二producer | Step12/15 |

#### 四平台职责切面（不是已安装支持矩阵）

| 平台 / 文件 | inbound / callback / ACK | mapping / outbound变化 / 附件 | cursor / limit / recovery | 资格缺失处理 |
|---|---|---|---|---|
| Slack / slack.rs | private raw body瞬时HMAC/时间窗验证，Events ACK独立 | workspace installation/account/channel/message/thread；edit/delete/thread/files逐method/scope核 | event_id作来源去重，ts非全局cursor；method/workspace/channel及history/replies发行类别核验 | source/安装/能力未核blocked，不凭签名授内部权限 |
| Mattermost / mattermost.rs | server/plugin/受信context按实例合同，不照抄Slack签名；PAT只external credential | server/team/user/channel/post/root；Blocks/legacy/附件按部署pin | session/event续接与deployment rate配置/响应需核，不承诺完整恢复 | 版本/实例/auth/limit缺口blocked或qualified unsupported |
| Telegram / telegram.rs | polling/webhook只一个有效入口；webhook secret仅private；callback ACK非owner action | bot/account/chat/message/可选forum topic；edit/delete权限窗口、附件有效性独立 | per-bot update/offset非owner commit；retry_after下界；普通delete完整性/TTL不猜 | 官网service contract缺口沿BR-UP-008，源码master不证明cloud部署 |
| Discord / discord.rs | HTTP/Gateway交互互斥；Ed25519或Gateway认证分别核，interaction token/expiry私有 | application/guild或DM/channel/user/message/thread channel；message content intent/权限 | session/sequence仅有效resume内可比；invalid session留gap；Snowflake非跨流水位；bucket/major/global动态下界 | intent/pin/mode/结果权威缺失blocked，timeout不默认为未执行 |

支持/降级/不支持必须有逐installation、direction/action/method/version来源；敏感Gate仅owner-qualified projection/entry/存在性，不是adapter自行降敏。附件只能qualified ref与瞬时读取，不复制body。lane只保护受权scope内顺序；edit/delete依赖已确认原create locator；未知原effect必须同op权威probe/manual，不能为四平台编造统一重发。

#### 六owner职责切面

| owner / 文件 | 本仓需求 | 已有正式语义 / 当前未证明 | 缺口姿态 |
|---|---|---|---|
| Conversation / conversation.rs | ingress/source/target/material/result/change/recovery | BridgeMapped target_mode/ActorRef；AppendFact Integration/kind/required digest已读；Bridges材料与同op结果lookup未证明兼容 | BR-UP-001/009；不把ACK写成Turn，不本地hash平台正文补digest |
| Identity / identity.rs | AI锚点、actor分类/责任引用 | 正式AI身份truth非human认证/permission；commit-08-c是来源状态 | BR-UP-002；human/Integration链缺口fail-closed，不自动GlobalMember |
| Governance / governance.rs | binding/current Policy/Gate、安全外显/敏感降级、责任/action/结果 | 正式Decision/Vote/Query存在；不证明本仓safe disclosure和callback action mapping | BR-UP-003；signature/admin不等许可，不能默认approve或直接Runtime/Tools |
| Artifact / artifact.rs | 附件/材料准入、authorized ref访问/传播/expiry/revoke | formal protocol总表不证明bridge file准入；source台账状态不授权本仓 | BR-UP-004；必要材料blocked，omit须owner许可，无raw缓存 |
| Workspace / workspace.rs | 可选safe read/export/provenance | read model非频道/权限truth；原WS开放项仍在 | BR-UP-005，仅选用分支受阻；不引seed/personal执行为本仓强前置 |
| Observability / observability.rs | producer/canonical/admission/consumer result/同op交接 | body-free/consumer/evidence分离；pre_implementation_blocked/wait_design | BR-UP-006；十二affected原状态不关，mandatory不足先阻对应mutation/IO |

#### 7.5.4 对象实现契约归属预告

infra必要runtime availability/config/adapter classification等稳定carrier须由Step6逐capability决定闭口或defer，不能全数推到产品实现阶段；真实adapter签名/装配port到Step7、产品pin与资格到Step14。当前没有产品已选、source兼容、可用SDK默认行为或实现成功结论。

#### 7.5.5 Trait / Port / Adapter责任预告

四平台承接PlatformIngressPort、CallbackVerificationPort、PlatformDeliveryPort及有权威能力的AuthoritativeRecoveryPort平台分支；不支持的同op probe明确不可用。六owner按上表组合Binding/Presentation/Actor/OwnerAction/ConversationHandoff/SafeObservation/SafeReadQualification/AuthoritativeRecovery需求，human责任owning缺口不能归Identity默认补齐。

local_store承接Installation/Mapping/Inbound/Delivery/Callback/Continuity/Lane/SafeTrace八repo和LocalUnitOfWorkPort；commit_probe承接原op本地提交证明读取。private_material/secrets/configuration分别实现PrivateMaterialPort/SecretResolutionPort/ConfigQualificationPort。所有23需求已有实现责任位置，不等于真实callable/driver证明闭口。

#### 7.5.6 模块内关键调用责任

平台解析/验源/ACK/business result/limit转换、owner语义双向映射、structured config加载/validate、private resolve/cleanup、runtime构建与bounded execution各归上述文件。不得让SDK内置payload logging、error chain或自动retry绕Application claim/limit/no-effect准入；具体typed callable和禁用/替换默认行为到Step7/14核验。

#### 7.5.7 模块错误归属预告

| 触发边界 | 返回给谁 | retry语义 | 映射 / 后续 |
|---|---|---|---|
| provider/auth/version/method/pin/material/secret失效 | Application/composition/entry | required缺失阻分支；不自动换provider/凭证/route | 对应adapter清洗finite分类；Step7/12/14 |
| 外部业务错误/限流/超时/cancel/未知 | Application | 平台下界与业务结果保留；unknown不重send | 平台/owner原始错误不出seam；Step7/12/13 |
| DB/CAS/commit ACK lost/原结果不可见 | Application | 未获权威proof保indeterminate；不认为rollback | local_store/commit_probe；Step11/12 |

#### 7.5.8 模块测试切口预告

| 切口 | 覆盖责任 | 验证内容 | 计划入口 / 后续 |
|---|---|---|---|
| platform/owner反腐 | 四adapter/六owner与configuration/runtime | locator/source/ACK/business error/thread/附件/限流/模式，缺required拒装配 | `crates/infra/tests/platform_boundary_tests.rs`；Step16/05 |
| driver提交证明 | local_store/commit_probe | CAS/unique/原result读面、ACK lost与unknown；缺proof不重apply | `crates/infra/tests/local_commit_boundary_tests.rs`；Step16/05 |
| private材料泄漏 | material/secret/error/audit/config | lifetime/revoke/cleanup与全出口allowlist，Debug/serde/log/evidence无raw | `crates/infra/tests/private_material_boundary_tests.rs`；Step16/05 |

test-only support沿`crates/infra/tests/support/qualified_providers.rs`/`mod.rs`，合成结果不能进production composition或声称真实commit/no-effect/owner权限。复杂度：按四平台/六owner分别保差异表，其余store/private/config/runtime按职责成组；不创建十份新truth对象或将所有平台合成万能接口。

### 7.6 M5 api模块

#### 7.6.1 模块职责

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/api` / bridges-api / bridges_api + bridges-api binary |
| 对应概要部分 | 02§4 Entry、§7的C/Q与条件E01/E03、§8即时dispatch/ACK职责 |
| 主要责任 | 安全协议解码、trusted context注入、Application调用、有限安全response和独立platform ACK |
| 对外暴露 | management/query/platform dispatch、qualified binary entry；不包含独立业务模型 |
| 允许依赖 | contracts、application、infra（只供合格验证/装配） |
| 禁止依赖 | domain直接业务调用、repository adapter直接操作、worker/jobs；任意平台headers/body当内部权限 |

#### 7.6.2 文件与代码主体映射

| 文件路径 | 代码主体 | 类型 | 责任 |
|---|---|---|---|
| `crates/api/src/lib.rs` | 三类dispatch导出 | entry facade | 显式exports，无业务执行快捷入口 |
| `crates/api/src/main.rs` | bridges-api composition入口 | binary root | 合格runtime/server/required seam才可激活；具体产品未选 |
| `crates/api/src/management.rs` | C01~06 handlers | command dispatch | 可信actor/core metadata/safe result；不grant/Turn/send/replay |
| `crates/api/src/query.rs` | Q01~04 handlers | query dispatch | no-write/audit/dedup/refresh/probe，当前获准read scope而非ref文本推权 |
| `crates/api/src/platform.rs` | 合格HTTP E01/E03与ProtocolAckPlan | private ingress dispatch | 固定installation/mode/source，private验证及独立ACK；同Application入口，不durable存raw |

#### 7.6.3 Capability与对象映射

| capability | 输入 | 输出 | 状态 / 副作用 | 协作边界 | 后续Step承接 |
|---|---|---|---|---|---|
| 管理命令接入 | trusted actor/CommandMetadata、安全C request | body-free command result/finite error | handler只dispatch，mutation由Application负责 | C01~06；C04prepare/C06请求不send | Step7handler、Step8C、Step9 |
| authorized query接入 | QueryMetadata/current safe read request | qualified view/page/marker或denied/degraded | handler无业务写/audit/dedup/refresh/probe | Q01~04/Application safe read | Step6稳定entry载体决策，Step7/8/9 |
| private平台HTTP入口/ACK | 当前installation/mode的私有HTTP source/context | ProtocolAckPlan/有限protocol拒绝与独立consume结果 | ACK独立；没有raw inbox或默认可靠接管成功 | infra source验证 -> Application E01/E03 | Step6private/result，Step7验证，Step8deadline，Step9切口 |
| 安全runtime入口 | 合格composition/server/route/provider | 可用或明确不装配入口 | 无server产品默认/route fallback，不新建authority | infra runtime/config，Step14/04 | Step6稳定availability/entry载体决策；Step7/14 |

| 对象组 | 承接功能 | 类别 / 能力 | 不承接 / 禁止 | 后续闭口 |
|---|---|---|---|---|
| management/query handlers | C/Q entry | handler责任，显式可信context/安全映射 | 不持有truth/repo mutation、不重复domain guard | Step6稳定entry disposition决策；Step7callable；Step8协议 |
| platform HTTP dispatch/ACK executor | E01/E03 | restricted entry，private context不进public DTO | 不把ACK/验签写成internal授权/Turn/action accepted | Step6必要private载体；Step7/8/9 |
| main/lib entry assembly | runtime入口 | 合格装配边界，不是业务对象 | 未核server/provider不启动，无fake生产fallback | Step6稳定availability载体决策；Step14/04 |

#### 7.6.4 对象实现契约归属预告

本模块不重复定义Command/Query/view、private handle或业务model；若必要entry disposition/availability carrier是唯一稳定输入输出，Step6须明确现在闭口或延后理由，而非机械全推后。handler函数/response mapping到Step7/8，实际transport产品到Step14；当前无route URL或HTTP实现代码。

#### 7.6.5 Trait / Port / Adapter责任预告

不新增业务port/repository。Entry消费Application facade及infra合格source验证/ACK执行接缝，不直接持有store作为业务调用替代。transport source可验证与current内部ActorContext/授权是两条来源链；trusted宿主和installation选择需后续完整绑定。

#### 7.6.6 模块内关键调用责任

解码/shape检查、trusted context显式传递、public error/view输出归management/query；private入口与ACK计划执行归platform。C04prepare返回不是receipt，C06返回不是replay完成；E01/E03 ACK不能复用owner成功面。具体handler signatures/ACK时限与失败路径按Step7/8/9闭口。

#### 7.6.7 模块错误归属预告

| 触发边界 | 返回给谁 | retry语义 | 映射 / 后续 |
|---|---|---|---|
| public shape/trusted context/visibility/有限business拒绝 | 管理/query consumer | 无handler自动retry/mutation；不可见ref/count不输出 | management/query -> contracts finite error；Step8/12 |
| platform source/ACK期限或入口不可用 | 平台协议方与本仓safe stage | ACK行为与可靠接管分别处理，不造owner accepted | platform/private adapter -> ProtocolAckPlan/finite outcome；Step7/8/9/12 |

#### 7.6.8 模块测试切口预告

| 切口 | 覆盖责任 | 验证内容 | 计划入口 / 后续 |
|---|---|---|---|
| 即时dispatch/ACK/可信来源 | management/query/platform | platform headers不成actor、C04/C06不send、Query无写、ACK不同owner结果/可靠safe接管 | `crates/api/tests/inbound_dispatch_tests.rs`；Step16/05，不运行 |

复杂度：五source责任文件与四entry能力覆盖本模块；不重复19业务flow或另建API真相层，完整协议/handler以后续Step承接。

### 7.7 M6 jobs模块

#### 7.7.1 模块职责

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/jobs` / bridges-jobs / bridges_jobs + 五具体动作binary |
| 对应概要部分 | 02§4 Entry、§7/8 J01~05；U3/U5/U6及U1 current资格维护 |
| 主要责任 | 受信job invocation/continuity scope、既有subject有界分派、safe result/error；业务编排不在runner复制 |
| 对外暴露 | 同一五任务invocation library供worker/bin使用，五动作bin只entry装配 |
| 允许依赖 | contracts、application、infra |
| 禁止依赖 | api/worker反向边、domain/repository直接业务操作、平台/owner SDK快捷调用；无generic replay权限 |

#### 7.7.2 文件与代码主体映射

| 文件路径 | 代码主体 | 类型 | 责任 |
|---|---|---|---|
| `crates/jobs/src/lib.rs` | 五bounded invocation exports | runner facade | worker/bin共享，不另定义J用例 |
| `crates/jobs/src/invocation.rs` | trusted context/scope/original op检查 | entry validator/dispatcher | 不伪造user actor/run，不换subject/target/effect |
| `crates/jobs/src/bin/dispatch_queued_delivery.rs` | dispatch_queued_delivery / J01 | one-shot binary | 既有intent -> Application受限dispatch；actual run/result不预填 |
| `crates/jobs/src/bin/reconcile_bridge_operation.rs` | reconcile_bridge_operation / J02 | one-shot binary | 原subject/op/effect权威probe/finalize；无proof manual，不自动重send |
| `crates/jobs/src/bin/reconcile_stream_gap.rs` | reconcile_stream_gap / J03 | one-shot binary | 同stream/epoch/comparator/coverage既有gap，不raw replay |
| `crates/jobs/src/bin/retry_safe_handoff.rs` | retry_safe_handoff / J04 | one-shot binary | 同canonical/op/current admission受限交接，不新producer |
| `crates/jobs/src/bin/refresh_bridge_qualification.rs` | refresh_bridge_qualification / J05 | one-shot binary | 既有subject/current来源与所属失效维护，不刷新出权限 |

#### 7.7.3 Capability与对象映射

| capability | 输入 | 输出 | 状态 / 副作用 | 协作边界 | 后续Step承接 |
|---|---|---|---|---|---|
| 受信invocation与bounded dispatch | TrustedJobContext/JobContinuityMetadata、既有subject/operation | 合格分派或finite拒绝，safe job result | runner只dispatch；不授current业务权限/新effect | Application J01~05与infra合格runtime | Step6稳定entry/result载体决策；Step7/8/9 |
| J01既有效果受限投递 | 已有intent/原effect/current target/budget/window | attempt/known receipt或unknown ref | Application执行IO/结果回收；取消不证no-effect | Application Delivery/Platform/Lane/UoW | Step7/9/11~13 |
| J02/J03原op/缺口对账 | 原subject/op或既有gap/current scope | known finalize/qualified retry eligibility或gap/manual | 无proof不重发/跨流推进；不在runner消掉unknown | AuthoritativeRecovery/Continuity/local commit proof | Step7/9/11~13 |
| J04/J05安全交接/资格维护 | 同canonical/op/admission或既有资格subject | safe consumer阶段或所属失效result | mandatory缺失阻IO；维护不新增authority | SafeObservation/SafeTrace/Config/qualification_invalidation | Step7/9/11/14/15 |

| 对象组 | 承接功能 | 类别 / 能力 | 不承接 / 禁止 | 后续闭口 |
|---|---|---|---|---|
| 五runner与invocation facade | 既有J协议接入 | entry责任，scope/current原subject验证 | 不复制domain/UoW/业务flow，不造job-run资格 | Step6稳定entry载体决策；Step7runner签名；Step8协议 |
| public job input/result与continuity metadata | J01~05安全输入输出 | contracts唯一carrier；jobs只消费/映射 | 不在jobs重复定义DTO/report/state或保存private材料 | Step6/8在contracts归属闭口；Step9出入口 |
| bounded execution/取消结果 | 一次调用的availability/error返回 | runtime/entry责任，original op unknown保持 | timeout/lease/shutdown不生成no-effect或成功结果 | Step6必要stable carrier决策；Step7/12/14 |

#### 7.7.4 对象实现契约归属预告

jobs不增加业务truth对象或独立state机。Step6对runner中唯一稳定entry disposition/结果/availability载体显式决策，public schema归contracts、private/internal归Application；不是全部机械defer。完整job DTO到Step8，有界invocation/callable到Step7，事务与unknown到Step9/11~13。

#### 7.7.5 Trait / Port / Adapter责任预告

不新增business port/repository。五bin和worker调用相同library invocation -> Application五J用例；infra只供qualified composition/execution。scheduler/runtime/operator身份不自动成为内部actor/owner action授权，也不能给missing current basis开force分支。

#### 7.7.6 模块内关键调用责任

invocation负责可信调用材料、scope/original operation与bounded入口；各具体bin负责宿主装配和安全输出，不形成第二五J编排。完整参数与函数签名后续Step7，input/result/失败拒绝面到Step8/12，不新定义通用`run_all`/`replay`接口。

#### 7.7.7 模块错误归属预告

| 触发边界 | 返回给谁 | retry语义 | 映射 / 后续 |
|---|---|---|---|
| trusted context/subject/scope/metadata不合格 | bin调用者/worker | 拒绝，无operator默认授权或自动补run | invocation -> finite public job result/error；Step8/12 |
| current资格/预算/window/claim/mandatory失败 | bin调用者/worker | 仅Application返回合格eligibility允许继续；不自行retry | Application -> jobs有限输出；Step7/12/13 |
| timeout/cancel/原op结果未知 | 调用者/safe读取 | 保原subject/op/unknown；同op probe或manual | jobs不改业务disposition；Step9/11/12/14 |

#### 7.7.8 模块测试切口预告

| 切口 | 覆盖责任 | 验证内容 | 计划入口 / 后续 |
|---|---|---|---|
| 五任务有界可信入口 | invocation/lib/五bin | existing subject/metadata/scope、worker同库复用、拒伪actor/run/new effect、取消/unknown不续发 | `crates/jobs/tests/job_invocation_tests.rs`；Step16/05，不执行 |

复杂度：一共同invocation + 五具体bin；capability按分派/投递/原op对账/交接维护分组，不重复Application五flow；无新operations/report truth。

### 7.8 M7 worker模块

#### 7.8.1 模块职责

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/worker` / bridges-worker / bridges_worker + bridges-worker binary |
| 对应概要部分 | 02§4 Entry、§7/8 E01~04与J调度；跨U transport/continuity边界 |
| 主要责任 | qualified常驻source消费、合格platform mode与existing-subject bounded调度；复用Application和jobs，无独立业务语义 |
| 对外暴露 | consumer/platform_session/scheduling runners与qualified main；非owner API |
| 允许依赖 | contracts、application、infra、jobs library |
| 禁止依赖 | api；domain/repository直接业务操作；jobs反向依赖worker；SDK/platform source认证当内部authority |

#### 7.8.2 文件与代码主体映射

| 文件路径 | 代码主体 | 类型 | 责任 |
|---|---|---|---|
| `crates/worker/src/lib.rs` | 三类resident runner exports | entry facade | 无独立model/command/replay入口 |
| `crates/worker/src/main.rs` | bridges-worker composition入口 | binary root | 必需seam合格才启动；shutdown保原op unknown，产品未选 |
| `crates/worker/src/consumers.rs` | E02/E04 qualified dispatch | consumer entry | source/producer/envelope/marker与独立ACK/result交Application；不新建producer |
| `crates/worker/src/platform_sessions.rs` | E01/E03合格poll/Gateway/session入口 | private stream entry | installation/mode/epoch资格、与同源HTTP互斥，raw只瞬时；gap不伪修复 |
| `crates/worker/src/scheduling.rs` | 既有eligible subject bounded调度 | scheduler entry | Application qualified候选 -> jobs library；不直接repo/发平台，不复刻五J用例 |

#### 7.8.3 Capability与对象映射

| capability | 输入 | 输出 | 状态 / 副作用 | 协作边界 | 后续Step承接 |
|---|---|---|---|---|---|
| 合格owner/consumer event intake | qualified producer/source/envelope、safe E02/E04材料 | Application consume结果与独立transport ACK | worker无cursor/业务写；不认为consumer ACK是accepted | infra/events/owners -> Application E02/E04 | Step6稳定entry载体决策；Step7/8/9 |
| private platform poll/session intake | qualified installation/mode/session/epoch与瞬时输入 | Application E01/E03、ProtocolAckPlan或safe unavailable | 唯一source接管；resume不足保gap，无raw durable队列 | infra/platform -> Application；不替actor资格 | Step6private/result；Step7/8/9/14 |
| 既有subject有界调度 | Application合格eligible读取结果、trusted job continuity | 同jobs invocation/safe result | claim/fence/资格仍Application核；无lease驱动新effect | jobs library J01~05；Application repo读取责任 | Step6稳定candidate/disposition决策；Step7读取/callable；Step9/13 |
| resident runtime/shutdown | 合格composition/execution与已有original op | bounded宿主退出/unknown安全状态 | cancel不证no-effect，不重置cursor/claim/one-use | infra execution、Application原subject恢复 | Step6availability carrier决策；Step7/12/14 |

| 对象组 | 承接功能 | 类别 / 能力 | 不承接 / 禁止 | 后续闭口 |
|---|---|---|---|---|
| consumers/platform_sessions runners | E01~04 entry | source/mode验证与typed分派责任 | 不重复Application/dedup/cursor writer或body inbox | Step6稳定entry载体决策；Step7/8dispatch |
| scheduling runner与eligible候选读取 | J01~05 bounded调度 | entry责任；候选资格来源归Application | worker不直接repo、不用候选存在替current资格 | Step6稳定candidate载体来源决策；Step7读取；Step9/13 |
| main/lib resident availability与取消结果 | 常驻装配 | runtime/entry责任，保原op语义 | 未选executor/provider不启动，不造false success | Step6必要stable载体决策；Step7/12/14 |

#### 7.8.4 对象实现契约归属预告

本模块不新增local truth/状态机；public envelope/result归contracts，private/internal/candidate read面归Application，provider/运行模型归infra。若唯一稳定entry/availability载体确有必要，Step6必须明示闭口或defer理由及主定义位置，不机械后推。当前不定义新candidate DTO名、字段或scan签名。

#### 7.8.5 Trait / Port / Adapter责任预告

无独立business port/repository；消费Application E facades与qualified eligible读取责任、jobs invocation库，runtime由infra装配。source选择/producer资格/可信job context必须在正式输入链提供，不从外部ID/display name/session猜权限。只有正式source/coverage合同才能推进对应Application-owned cursor。

#### 7.8.6 模块内关键调用责任

consumers负责E02/E04 envelope/producer分派；platform_sessions负责当前合格mode/session/epoch和E01/E03入口；scheduling调用同jobs库，不重新生成original op/effect或私自retry；main处理bounded宿主停止，不代替Application恢复。后续Step7/8/9闭具体函数/ACK/redelivery/取消，Step11~13闭proof与claim。

#### 7.8.7 模块错误归属预告

| 触发边界 | 返回给谁 | retry语义 | 映射 / 后续 |
|---|---|---|---|
| producer/source/schema/mode/session不合格 | transport方/Application safe stage | 拒绝/保gap；不把raw正文写dead-letter证据 | consumers/platform_sessions -> finite outcome；Step7/8/12 |
| 调度候选/claim/current资格/预算不可用 | jobs调用者/worker有限观测 | 不直接重新入队成新op/effect；由Application合格eligibility决定 | scheduling -> jobs/Application有限结果；Step7/12/13 |
| resident cancel/disconnect/外部阶段未知 | Application原subject与safe view | reconnect不推coverage，shutdown不证no-effect | infra execution/worker -> original op保持；Step9/11/12/14 |

#### 7.8.8 模块测试切口预告

| 切口 | 覆盖责任 | 验证内容 | 计划入口 / 后续 |
|---|---|---|---|
| qualified resident dispatch | consumers/platform_sessions/scheduling/main | producer/schema/ACK分层、同源mode互斥、跨epoch/gap、jobs库复用、cancel/lease不自动重发 | `crates/worker/tests/consumer_dispatch_tests.rs`；Step16/05，不执行 |

复杂度：五source与四resident能力足够，不扩为Bus/平台truth层；worker -> jobs是明确单向compile边与库复用，运行期调用和实施次序不在本图推断。

### 7.9 G8 跨模块归属、闭口责任与审计

#### 全主体归属摘要

| 主体类别 | 唯一主归属 | 输入 / 使用方 | 保持的边界 / 下一闭口 |
|---|---|---|---|
| 20既有业务对象 | 19domain model + contracts/views.rs中的BridgeLocalView | Application编排/安全映射 | 17stateful，receipt/audit/view无独立机；Step6/10，不增删对象 |
| 20协议主语 | contracts C6/E4/Q4/J5/条件O1 | api C/Q及条件E；worker E；jobs J | 19请求入口，不把O01变新command/job或通用outbox；Step8 |
| 19入口业务编排 | application/commands/consumers/queries/jobs逐文件 | api/worker/jobs entry | 不在entry/adapter复刻业务；Step7 callable/Step9flow |
| 23port / 8repository / LocalUoW | Application十port责任文件 | infra实现，Application调用 | interface名不证明owner方法存在；Step7 read/write/result/error、Step11proof |
| 243既有使用名称 | Step4附录22责任路径：contracts225（含4core re-export）/Application17/Domain1 | 后续对象/协议/port传递闭包反查 | 使用索引非schema上限；Step6必须先从capability推导，不机械照表补String |
| 5private / 9snapshots / 3其他internal | Application private_material/local_snapshots/local_mutation/qualification_invalidation/ports.inbound | 受限private port、local repo、内部编排 | 默认无private Debug/Serialize/Clone；snapshot非public DTO；Step6/7/11 |
| 四平台与六owner adapter | infra/platform四文件、owners六文件 | Application23需求的具体来源绑定 | 不迁owner/platformtruth，不自签basis；Step7/14资格缺口保BR-UP |
| local driver与原commit proof | infra/persistence/local_store / commit_probe | LocalUoW/repo/AuthoritativeRecovery需求 | network不包UoW；ACK lost不推rollback；Step7/11~13 |
| config/secret/private/runtime | contracts安全config，Application private carrier，infraprovider/装配 | qualified entry与port消费 | SDK/OAuth/API Key/KMS/router/executor/storage/Bus未选；Step6/7/14及04 |
| error / testing ownership | 每模块§x.7/§x.8责任 | contracts finite输出、test-only support | 不是已定义error variant/TC/执行证据；Step12/16及05/06 |

#### 后续Step承接摘要（不是提前执行）

| 闭口主题 | 本Step固定的责任 | 完整闭口位置 / 不允许留给实现者猜 |
|---|---|---|
| capability到对象与shared vocabulary | 七module各自能力输入/输出/状态/边界；public/private/internal/main definition唯一 | Step6逐module推导全部必要struct/enum/value object/card；typed locator/basis/Slot/expected revision/source-required不许通用String补齐；所有public transitive types反查 |
| 非core稳定对象决策 | Application/private/snapshot/result、infra配置/availability、entry/job disposition与candidate读面有责任 | Step6逐组现在闭口或defer理由；stable唯一carrier不能机械全推Step7；必要新support类型不得改变20业务对象/主语/机 |
| callable / repo / adapter | 23需求定义与infra实现责任、19用例与entry/library复用明确 | Step7完整typed Future/callable、read/write/result/error/version/current authority来源及factory/lifetime；foreign方法逐真实合同双向映射，缺口blocked |
| C/E/Q/J/O协议 | 五族20主语、单一coremetadata、安全carrier和独立ACK/result | Step8完整字段/值域/serde/metadata/key/unknown/denied/view-page-marker/ACK deadline/构造；禁止private正文/secret/敏感材料 |
| 处理流与状态 | 19Application入口、17stateful主语与三无机的owner已固定 | Step9逐入口函数级链与IO/UoW切口；Step10逐状态/合法非法/trigger，源basis与原op副作用明确 |
| persistence/幂等/原op continuity | local mutation唯一源、same effect/C04-E02唯一、六dedup namespace、原result读面 | Step11driver隔离/CAS/唯一/write set/commit-disposition proof；Step12有限错误/known finalize/权威同op probe/manual；Step13meaning/key/claim/fence/current受权原结果/retention |
| cursor/排序/限流/retry | protocol/owner/effect cursor分开、scope/stream/epoch/comparator/coverage；lane及shared bucket保护 | Step7来源read面；Step9/10触发；Step11~13比较/推进/覆盖、等待下界/预算/no-effect/window；timeout/lease/NotFound不授权续发 |
| platform与产品/config/secret | 四平台差异、六owner反腐、required seam/固定受权route/private provider/模式互斥 | Step7 exact method/结果权威与supported/degraded/unsupported；Step14逐version/pin/installation/direction/action/scope/rotation/revoke与SDK默认logging/retry核验；04填实际key/profile/值，未经资格不激活 |
| audit/observation材料 | 一次local mutation唯一安全材料源、conditional canonical/admission/O01、consumer结果独立 | Step11原子提交/handoff result读面；Step15各flow允许字段/禁止材料/mandatory阻断/观测不可代evidence；query无业务audit或mutation |
| 测试切口与实施移交 | 七module已有具体计划测试入口，test-only support不进生产 | Step16最低反例/边界；05具体TC/fixture/suite，06验收，07实施ledger/planned skeleton；本Step不运行/创建任何实施资产 |

正式§5的最终对象闭口摘要须在后续Step6/7实际完成后反映真实结果；当前只明确收口责任，不能把本预告表改名为“全对象已闭口”。Step6获授权后，先读本Step问题/诊断/取舍/未决和对应SOP/书写，再建立当前Step骨架，不直接开始填类型索引。

#### 安全、资格与复杂度交叉检查范围

| 风险面 | 本Step检查落点 | 不能消除的缺口 / 停止条件 |
|---|---|---|
| source/identity/mapping/explicit授权 | contracts carrier、domain两端guard、Applicationcurrent qualification、infraowner/platform验证、entry trusted context | BR-UP-001/002/003/008；external_id不建GlobalMember，signature/install≠permission；缺依据fail-closed |
| outbound/敏感Gate/附件/编辑删除线程 | domain plan/intent/attempt/receipt、Applicationprepare/dispatch、四adapter及Artifact/Governance责任 | BR-UP-003/004/008；无safe disclosure不出正文/存在性/入口，omit必需附件须owner许可；变化须原locator |
| ACK/local commit/owner或Turn/送达/consumer阶段 | contracts outcomes/view、Inbound/Callback/Delivery/SafeHandoff各model及use case | 各阶段不可互替，已提交也非外部送达；BR-UP-001/006/008/009结果权威未核不能造成功 |
| dedup/replay/顺序/限流/未知恢复 | Domaincontinuity、Applicationport/repo/UoW、infra原commit/platform-owner proof、bounded J与worker | BR-UP-009；same-op/effect不改义、key/窗口过期不自动再执行，无comparator/coverage留gap，limit下界不缩 |
| config/secret/material/private | 四modulecarrier/port/provider/装配界限与各entry不泄漏责任 | BR-UP-007/008；产品not_selected/not_established，无secret fallback/raw debug/error/log/证据/可还原派生或rawbody hash |
| canonical/admission/query | Application唯一mutation源，conditional O01、Observability、四Q与safe read | BR-UP-005（仅选用分支）/006；mandatory缺失先阻对应mutation/IO；query不audit/dedup/refresh/probe/repair；safe record不造evidence |

复杂度结论：七module各自八类责任、四平台/六owner独立差异表、19用例/23port归属与一个compile图足以固定Step5主轴；无需新附录、系统上下文图、实施boundary或future Step文件。完整card/签名/协议/flow/state/driver/error/config/测试必须顺序继续，不能把篇幅或名称覆盖当可运行资格。

#### 实际静态审计记录

2026-10-03 / 停审写入前：Node只读检查三当前文件，共65表/28相对链接/8围栏；Step文件十节、七module的56责任小节、20业务对象/20协议主语/19入口/23port、22类型责任文件与225/17/1既有名称分组、127个具体src/test责任路径、17条compile边均反查通过，errors=[]。未来Step文件0，三层核心字段一致；92文件baseline hash全部不变。Git diff --check通过，cached name-only为空，status与开工既有dirty集合一致。

检查对象名/路径、port清单与type责任文件来自Step4及其附录，不用本文自重复的数字当覆盖证明。定性跨审额外核verified来源+已知self-send防回环、六namespace与C04/E02shared effect、current资格/mandatory/query/unknown/private输出/非core载体后续闭口；补明确责任，不改变00/01/02或前序设计结论。

过程偏差：开工Node子进程受sandbox EPERM阻断，按权限流程重跑取得只读baseline；G0 compile边数量和M1索引分组文字曾计错，按原表/Node纠正，图/归属无变化；跨审首个内联审计因JavaScript模板中的backtick转义SyntaxError未执行，修正审计表达后只读重跑通过。没有因此写入其他项目、代码/报告或虚构执行结果。

封存后已实际只读复跑：三文件65表/28相对链接/8围栏、十节/七module56小节及全部主体/port/type责任路径/compile边再次通过，errors=[]；三层Step5 done/设计自检pass/用户waiting/authorized_stop_at_step05与关闭权限一致，future文件0，92基线文件hash不变，Git diff --check通过，cached为空。只回填此审计记录，不重开语义。

这里是设计静态审计，不是Cargo/平台测试、artifact/report/evidence、owner signoff或readiness。

## 8. 回填草稿

| 单元 | 正式03§5草稿责任 | 状态 |
|---|---|---|
| G0 | §7.1的总览、compile图、非compile裁剪和六U矩阵可作为正式§5主轴；不得回填过程状态或声称运行资格 | done |
| M1 | §7.2八类责任可回填正式模块小节；保留public/private分界与后续闭口责任，字段/签名尚待Step6/8 | done |
| M2 | §7.3八类责任及19model逐对象能力可作为正式模块主轴；明确17机/三无机，full card/state另到Step6/10 | done |
| M3 | §7.4八类责任、19编排/23port与private/internal稳定载体责任可回填模块主轴；保留Step6逐组闭口决策要求和原op未知/query不变量 | done |
| M4 | §7.5八类责任与四平台/六owner矩阵可回填模块主轴；保留23port实现责任、required-seam阻断、secret/private/output边界与真实资格后核 | done |
| M5 | §7.6八类责任可回填api小节；保留trusted内部actor/private平台源/独立ACK/Query no-write边界，transport与deadline后核 | done |
| M6 | §7.7八类责任可回填jobs小节；library/bin共享与受信existing-subject bounded invocation保留，不复制业务或声明run/结果 | done |
| M7 | §7.8八类责任可回填worker小节；qualified source/mode、同E入口、jobs库复用和原op/gap/cancel保护保留，不创建新producer/恢复引擎 | done |
| G8 | §7.9全主体归属、Step6~16闭口责任和安全/资格检查可作为正式§5收口来源；当前未定义完整card/trait/DTO/flow/state，正式对象闭口结果必须后续真实完成才回填 | done |

这是calibration草稿入口，不是已装配正式03；对象卡、typed callable、完整DTO和矩阵须依次到达后续Step才能写。

## 9. 待确认事项

| 未决 | 当前状态 / 受影响能力 | 未确认前处理 / 精确释放来源 |
|---|---|---|
| BR-UP-001 | open；Conversation安全material/accepted/change/结果probe兼容 | E01/材料/同op恢复受限；00 Step15§7.3 owning合同，不发明submitTurn或用ACK代accepted |
| BR-UP-002 | open；human/AI/Integration责任及显式binding链 | U1/U4/current read缺来源fail-closed；Identity只AI锚点，不自动GlobalMember |
| BR-UP-003 | open；current Policy/Gate/visibility/disclosure/action资格 | 敏感body/存在性/入口和action不得默认准许；逐owner safe projection/current责任证明 |
| BR-UP-004 | open；附件准入/访问/authorized ref传播/expiry/revoke | 必需材料缺失blocked；omit要owner许可，不缓存正文或私有URL |
| BR-UP-005 | open；仅选用Workspace safe read/export/provenance分支 | WS-UP-001~008/006-S与WS-LOCAL-001~003原状态保留；不引seed/personal执行强前置 |
| BR-UP-006 | open；producer/schema/canonical/admission/result与十二affected | 精确十二项原状态沿02§13.3/00 Step15§7.4，不重造状态机；mandatory缺失先阻对应IO/mutation |
| BR-UP-007 | open；SDK/产品/config/secret/固定受权route兼容 | not_selected/not_established；无默认SDK/OAuth/API Key/KMS/明文/fake fallback；Step7/14资格核验 |
| BR-UP-008 | open；四平台逐installation/version/method/direction能力 | PS-01~14只source登记；Telegram官网service合同仍缺；支持/降级不替安装证据，不宣4/4 |
| BR-UP-009 | open；权威同op result/no-effect/comparator/coverage/window与driver证明 | 保unknown/gap/manual；不换key/effect/target，不以NotFound/lease/timeout重发；Step7/11~13 |
| BR-UP-010 | reference_only；L5-chat并行入口 | 无正式输入边，不依其未停审route或强等Chat；新增正式消费须再裁剪 |
| 后续本地契约 / 实施前置 | 未执行Step6+；实际工具链/build/driver/实现仓未建立 | 本Step只职责收稳，不移交完整代码；后续顺序闭口，再按07授权核实施输入，不造readiness |

BR-UP-001~009仍open；010仍reference_only。缺口详细影响和释放依据唯一入口是[00 Step15](00_req_step_15_risks_open_questions.md)§7.3/7.4及[当前02](../02-概要设计.md)§13.3；本表仅责任索引，不关闭或跨项目回写owner台账。

## 10. 自检及进入下一步条件

| 单元 | 实际设计自检 | 依据 / 下一动作 |
|---|---|---|
| G0 | pass | 对照Step4直接依赖表逐边，16条仓内边+1条core边，无环/反向/SDK/owner/Chat compile边；六U与七role两轴不混同；只允许M1 |
| M1 | pass | C6/E4/Q4/J5/O1均承接；20个src责任路径与Step4一致，core重导出/public view/private分界明确；无schema/authority/product越权；只允许M2 |
| M2 | pass | 19model路径/逐对象责任对照Step4完整；唯一public view在contracts、receipt/audit无独立机；同步guard无IO，无新增owner/platform truth；只允许M3 |
| M3 | pass | 19入口+条件非入口O01、23port、5private/9snapshot/3其他internal载体完整定位；prepare/dispatch、原op未知、current资格、mandatory及query no-write逐项反查；只允许M4 |
| M4 | pass | 四平台/六owner逐边界不等价；八repo+UoW及全部外部port有实现责任；local proof/private/secret/config/runtime/安全error归位，无真实产品/安装/probe支持声明；只允许M5 |
| M5 | pass | 五source职责与C6/Q4/条件E01/E03完整；内部trusted actor/private平台来源、独立ACK/query no-write、C04/C06无send均明确，无domain/repo/worker/jobs业务依赖；只允许M6 |
| M6 | pass | 五J与五bin沿Step4完整，一份invocation库、原subject/op/scope与bounded执行责任明确；jobs不依worker/api、无直接业务IO/新run/effect/通用replay；只允许M7 |
| M7 | pass | 五source/四E与五J调度完整定位；source模式/epoch/ACK分层、qualified候选读取与jobs同库责任明确，无独立cursor/claim/producer写者，取消不证no-effect；只允许G8 |
| G8 | pass | 实际静态审计errors=[]及定性安全/来源/历史差异跨审；全部主体可定位到模块/文件/后续闭口Step，92既有文件不变；只停审等待用户，不进入Step6 |

Step5工作与设计自检pass；用户未审查确认，当前执行上限门禁blocked，不能将其解释为schema/产品/外部资格已ready。所有BR-UP维持§9状态；各模块“只下一模块”是执行过程许可记录，最终以下停审门禁为唯一当前状态。

获用户明确授权Step6后，下一阅读是本Step全文（含问题/诊断/取舍/待确认）、详细SOP Step6、详细书写§5.5对象/enum/capability与非core闭口决策规则、中间产物§3.5.1及02对象/243索引/必要owner字段来源合同；先建立Step6骨架，再按模块推进。当前不提前创建或执行Step6。

```text
current_document = 03
current_step = 5
current_module = step05_complete_waiting_user
step_status = done
step05_design_self_review = pass
step05_user_confirmation = waiting
gate_status = blocked
gate_reason = authorized_stop_at_step05
next_allowed_action = wait_for_user_authorization_of_03_step06
calibration_write_allowed = stop_state_audit_only
formal_document_write_allowed = false
formal_03_assembly_allowed = false
step05_allowed = false
step06_allowed = false
next_document_allowed = false
implementation_ledger_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```
