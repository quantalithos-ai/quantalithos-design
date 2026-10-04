# L6-bridges 01 Step 15：ADR 与需求追溯

> full-restart；done / pass；正式01不写。

## 1. 状态与 Step 内计划

开工：Step1~14 pass；已读架构SOP Step15、规范§4.16/§4.17、00 Step16主矩阵/验收覆盖、风险与专项owner状态。先按U1~U6停审长期架构决定，再建立需求/约束/风险到架构结果的矩阵，最后审计孤儿与新增结论；不在矩阵或ADR索引中创造新需求、接口、产品或实现事实。

| 单元/审计面 | 思考 | 写入 | 停审/自检 | gate_status / 下一动作 |
|---|---|---|---|---|
| U1 受权绑定与映射 | done | done | pass | pass / U1_trace_stopped |
| U2 入站交接 | done | done | pass | pass / U2_trace_stopped |
| U3 安全外显与交付 | done | done | pass | pass / U3_trace_stopped |
| U4 交互责任 | done | done | pass | pass / U4_trace_stopped |
| U5 连续性与恢复支撑 | done | done | pass | pass / U5_trace_stopped |
| U6 安全读取与追溯支撑 | done | done | pass | pass / U6_trace_stopped |
| 跨ADR/需求追溯审计 | done | done | pass | pass / allow_step_16 |

## 2. 输入与追溯范围

正式00提供G-BR-001~005、C-BR-1~5、US-BR-001~011、FR-BR-001~016、BR-BR-001~024、DR-BR-001~020、NFR-BR-001~016、IF-BR-001~011、DEP-BR-001~010、AC-BR-001~038和VETO-BR-001~006既有编号。本步只把这些既有结论连接到Step1~14架构结果；范围表中的`001~003`表示包含端点的既有编号，不创建新ID。

## 3. SOP逐项问题回答

| 问题 | 当前回答 |
|---|---|
| 哪些决定值得ADR？ | 局部BC/truth边界、typed adapter和资格、显式binding/mapping、owner交接、阶段/effect、治理外显、交互责任、连续性/gap、body-free/secret和safe view等长期结构决定。 |
| 每项来源是什么？ | 每项ADR同时回指对应U单元停审、Step章节、00需求/约束和风险/取舍；未闭合BR-UP只作为边界来源，不升格为决定。 |
| 有无无来源设计？ | 跨审逐项检查；仅把前文已确认的职责、依赖、数据、通信、机制、取舍和横切结论纳入。 |
| 有无未承接核心需求？ | FR/NFR/BR/DR/AC按范围全量覆盖；缺owner/平台资格仍在追溯中标为条件/挂起，不冒称正向闭合。 |
| 哪些必须长期追溯？ | truth不迁移、显式授权、结果不互证、body-free、unknown/gap、query no-write、逐安装能力资格和未选产品边界。 |
| 每个决定是否停审？ | U1~U6分别核对长期性、来源、与Step8~14一致性和无新增结论；跨单元再审职责/依赖/数据/通信/横切。 |

## 4. 架构单元决定停审记录

| 单元 | 长期决定 | 来源链 | 停审结论 |
|---|---|---|---|
| U1 | 本仓只拥有binding/mapping局部关系；typed target、installation、kind、generation、basis/ref分离；平台/owner实体不迁移 | 00 C1/FR001~003/BR001~005/DR001~006；Step3/5/7/8/10/11/12/14 | pass；无隐式身份、权限或target替换 |
| U2 | 验证、入口ACK、owner交接、accepted/ref、变化/线程和材料缺口分离；不存raw body或创建Turn | 00 C2/FR004~006/BR006~009/DR007~008/NFR003~004；Step5/7/8/9/12/14 | pass；Conversation owner/阶段边界未被重写 |
| U3 | 外显前治理/visibility预检；intent/attempt/receipt/stable effect分离；附件和敏感Gate只引用获准材料 | 00 C3/FR007~009/BR010~013/DR009~011/NFR005~007；Step5/8/9/10/12/14 | pass；内部commit不等平台送达，unknown不盲重发 |
| U4 | 平台交互验证、human/AI责任ref和owner action二次核验分离；callback不批准Gate或调用Tools | 00 C4/FR010~011/BR014~016/DR012~013/NFR008~009；Step3/5/7/9/12/14 | pass；签名/按钮/管理员角色不自授权 |
| U5 | operation/effect namespace、cursor/epoch/comparator/gap、lane/限流预算和同effect恢复独立；未知保留 | 00 C5/FR012~016/BR017~024/DR014~016/NFR010~014；Step5/7/8/9/10/12/13/14 | pass；query不维护，不能越gap完成 |
| U6 | body-free安全读取/追溯/handoff只消费局部ref和安全阶段；consumer disposition/evidence不归本仓 | 00全局DR017~020/NFR015~016/AC032~038；Step3/5/8/9/10/12/14 | pass；Observability原affected和真实接受不被伪造 |

## 5. 需求追溯矩阵：目标、能力与功能

| 需求来源 | 需求结论 / 约束 | 架构承接结果 | 承接位置 | 说明 |
|---|---|---|---|---|
| G-BR-001 | 只拥有桥接局部状态，不拥有内部或平台truth | 单一Bridges局部BC、U1~U6 truth/ref/forbidden分类 | §4/§5/§9；Step3/5/8 | 局部relation/effect/cursor可持有，但两端实体、正文和owner结果仍回指来源。 |
| G-BR-002 | 主体、目标、内容和操作必须有显式授权 | binding generation、typed mapping、治理预检、owner action handoff | §3/§4/§6/§10；Step2/3/5/9/12 | 认证/安装不替内部basis，缺资格保持blocked。 |
| G-BR-003 | inbound/outbound区分来源、接纳、效果和消费结果 | 阶段结果分离、owner/platform/consumer独立ref和unknown | §8/§10；Step8/9 | ACK、owner accepted、Turn、receipt、consumer disposition不互证。 |
| G-BR-004 | 四平台差异必须独立表达 | typed adapter、逐installation capability/version gate和P0主线 | §6/§11/§14；Step5/10/11/13 | 不宣称平台等价或四平台正向通过。 |
| G-BR-005 | 失败恢复与安全交接可解释 | namespace幂等、cursor/gap、body-free审计、manual/indeterminate | §9/§10/§13/§15；Step8/9/12/14 | 无probe/material/consumer资格不伪造恢复或证据。 |
| C-BR-1 / FR-BR-001~003 | 受权配置、binding生命周期与typed主体/位置映射 | U1配置/relation/mapping局部truth、generation和撤销门禁 | §4/§6/§8/§16；Step5/7/8/10 | 逐ID承接00主矩阵；不自动创建GlobalMember/Conversation。 |
| C-BR-2 / FR-BR-004~006 | 可信来源、Conversation正式交接和变化/线程差异 | U2 adapter验证、owner handoff、source version、gap/quarantine | §4/§5/§8/§10/§16；Step4/5/8/9 | 只承接已有AppendFact/ManifestExternalFact语义，不新造提交方法。 |
| C-BR-3 / FR-BR-007~009 | 安全外显、附件引用、intent/attempt/receipt | U3治理/材料预检与stable effect、平台结果分层 | §3/§8/§10/§11/§16；Step5/8/9/10 | 内部commit不等外部送达，敏感/附件缺准入不发送。 |
| C-BR-4 / FR-BR-010~011 | callback验证与正式owner动作责任 | U4 verified interaction、owner二次核验、one-use/expiry | §4/§8/§10/§16；Step3/5/9/12 | callback不直接批准Decision或执行Runtime/Tools。 |
| C-BR-5 / FR-BR-012~016 | 去重/cursor、顺序限流、回放/审计和no-write读取 | U5/U6连续性、恢复、safe view和handoff局部边界 | §8/§9/§10/§13/§15/§16；Step8/9/10/12/14 | 实现合同和真实consumer资格仍在后续文档/上游确认。 |

## 6. 需求追溯矩阵：规则、数据、质量与验收

| 需求来源 | 需求结论 / 约束 | 架构承接结果 | 承接位置 | 说明 |
|---|---|---|---|---|
| BR-BR-001~005 | truth/身份/授权/配置/secret边界 | U1 typed binding、owner basis/ref、撤销和禁止材料 | §3/§4/§6/§9/§15；Step3/5/8/12/14 | 每条规则均回指C1和VETO材料/身份边界。 |
| BR-BR-006~009 | 入站来源、ACK、owner接纳、变化和线程差异 | U2阶段分离、source marker、mapping/gap和owner ref | §8/§10/§15；Step5/8/9/14 | 不把入口确认改成内部提交或正文truth。 |
| BR-BR-010~013 | 外显、敏感Gate、附件和平台效果连续性 | U3治理预检、safe material、stable effect/receipt | §3/§8/§10/§13/§15；Step5/9/12/14 | 外部失败隔离内部truth，unknown保留。 |
| BR-BR-014~016 | callback来源、责任、时效、one-use和owner动作 | U4 verified interaction与owner action handoff | §4/§8/§10/§15；Step5/9/12/14 | 签名、低敏感或管理员身份不自授权。 |
| BR-BR-017~024 | 幂等/位置/unknown/恢复/观察/读取/窗口/预算 | U5/U6 namespace、cursor/gap、safe view、body-free handoff | §8/§9/§10/§13/§15；Step8/9/12/14 | 不以默认retry、全局水位、query repair或日志evidence补足。 |
| DR-BR-001~006 | 配置/relation/mapping/能力snapshot/basis/secret仅局部或引用 | U1 truth/snapshot/reference/forbidden分类 | §9；Step5/8 | 不把snapshot或ref写成认证/授权/平台实体truth。 |
| DR-BR-007~008 | 入站局部验证/ACK/交接与owner结果ref分离 | U2 body-free source/disposition | §9/§10；Step5/8/9 | raw event/body不落durable。 |
| DR-BR-009~011 | 局部delivery记录与source/material/Artifact ref | U3 intent/attempt/receipt和安全材料边界 | §9/§10；Step5/8/9 | 不拥有平台message/read receipt或附件正文。 |
| DR-BR-012~013 | callback验证局部记录与owner action/Decision ref | U4 private seam和owner结果引用 | §9/§10；Step5/8/9 | 不保存审批正文/context/token。 |
| DR-BR-014~016 | cursor/dedup/recovery/handoff局部状态 | U5/U6 continuity和safe handoff | §8/§9/§13；Step5/8/9/12 | source/basis/consumer/evidence仍由owner持有。 |
| DR-BR-017~020 | 全局禁止正文、凭证、私有回调和敏感材料 | 全出口body-free/secret/visibility约束 | §3/§9/§10/§13/§15；Step2/8/9/12/14 | durable、log、trace、handoff、report、evidence无例外。 |
| NFR-BR-001~004 | 绑定资格、来源验证、时限、操作/位置一致性 | U1/U2 capability gate、同步收缩、阶段和cursor分离 | §6/§8/§10/§13；Step8/9/12 | 不设无来源数字，按版本/合同判断。 |
| NFR-BR-005~009 | 外部隔离、材料/效果安全、责任与单次效果 | U3/U4治理预检、stable effect、one-use、unknown | §8/§10/§13/§15；Step9/12 | 平台接受不等已读/Decision，延迟不自动批准。 |
| NFR-BR-010~014 | 限流/预算、恢复、追溯、窗口与no-write观察 | U5/U6 background/recovery/gap/safe view | §8/§9/§10/§13/§14；Step9/12/13 | 不承诺自动恢复时长、无限保留或真实观察完成。 |
| NFR-BR-015~016 | 全仓材料安全与真实阶段表达 | U6 body-free evidence seam、阶段结果不互证 | §3/§9/§10/§13/§15；Step8/9/12/14 | 不伪造账号、token、run、test、receipt、evidence、verdict或ready。 |
| AC-BR-001~007 | C1闭环、配置/生命周期/映射/局部truth/资格条件 | U1单元停审和P0主线 | §4/§5/§8/§15；Step5/8/14/15 | 仅定义成立条件，未报告运行验收通过。 |
| AC-BR-008~014 | C2来源、交接、变化、阶段和可恢复条件 | U2单元停审和owner handoff边界 | §4/§8/§10/§15；Step5/8/9/14/15 | 缺safe ref/actor合同则blocked。 |
| AC-BR-015~021 | C3安全外显、附件、效果和外部隔离 | U3单元停审和stable effect | §3/§8/§10/§15；Step5/8/9/12/14/15 | receipt不是送达/已读，敏感正文不外显。 |
| AC-BR-022~027 | C4验证、责任、owner动作和单次效果 | U4单元停审和二次核验 | §4/§8/§10/§15；Step5/9/12/14/15 | 不由callback本地裁决。 |
| AC-BR-028~036 | C5恢复、去重、cursor、限流、审计与读取 | U5/U6停审和连续性/safe view | §8/§9/§10/§13/§15；Step8/9/12/14/15 | 不以重放、日志或query伪造恢复/evidence。 |
| AC-BR-037~038 / VETO-BR-001~006 | 全局材料、阶段真实性和核心否决 | 跨单元安全审计、不可接受债务和风险门禁 | §3/§9/§13/§15；Step2/8/9/12/13/14/15 | 全局条件与否决只复用已有来源，不新增验收或运行事实。 |

## 7. ADR索引

| ADR编号 | 架构决策 | 解决的问题 | 关联主线 | 说明 |
|---|---|---|---|---|
| ADR-BR-001 | 以单一Bridges局部BC承载U1~U6，不拆成平台业务真相服务 | 防止平台差异和支撑状态复制成多套业务truth | 职责边界/限界上下文/备选取舍 | 长期决定本仓组织方式；不是进程或代码目录选择。 |
| ADR-BR-002 | 本仓只拥有配置、relation/mapping、局部阶段/效果/连续性状态 | 防止迁移Conversation、Identity、Governance、Artifact、Workspace或平台truth | 数据所有权/依赖/真相边界 | 影响所有后续对象和跨仓交接，需长期单独理解。 |
| ADR-BR-003 | 外部协议必须通过typed per-platform adapter反腐接缝 | 防止平台私有语义穿透核心，保持差异可解释 | 系统上下文/依赖/技术机制 | 具体SDK/API未选，但adapter边界本身是稳定架构决定。 |
| ADR-BR-004 | 绑定和mapping以installation、kind、typed target、generation和basis/ref隔离 | 防止裸external ID、显示名或同名位置串绑和隐式授权 | U1/安全边界/配置变更 | 决定身份、位置和变化映射的长期语义。 |
| ADR-BR-005 | 入站采用验证、ACK、owner handoff、accepted/ref、变化/gap分阶段承接 | 防止平台接收确认被误报为内部事实或Turn | U2/关键交互/Conversation边界 | 长期约束入站协议与失败解释，不是接口目录。 |
| ADR-BR-006 | 外显前必须重核当前治理/visibility/material，intent/attempt/receipt与stable effect分离 | 防止内部commit、低敏感或平台返回被误作外部送达/已读 | U3/数据一致性/安全交互 | 同时保护敏感外显、附件和未知效果。 |
| ADR-BR-007 | callback验证、责任ref和owner action二次核验分离 | 防止签名、按钮、管理员角色或Integration来源直接批准动作 | U4/治理依赖/执行边界 | 约束所有交互责任入口，不选择具体回调协议。 |
| ADR-BR-008 | 幂等按namespace隔离，effect identity固定，attempt不产生新effect | 防止重复、冲突和超时重试造成多次业务效果 | U5/阶段真实性/恢复 | 影响入站、外显、callback和恢复全主线。 |
| ADR-BR-009 | cursor必须绑定stream/epoch/comparator，gap只有权威覆盖才关闭 | 防止跨session、裸ID或时间戳误报完整位置 | U5/一致性/平台差异 | 这是长期连续性原则，不是队列或数据库选型。 |
| ADR-BR-010 | unknown、blocked、gap、manual是正式结果；恢复只在同effect和权威依据下进行 | 防止盲重试、换target或重建正文掩盖未知 | U3/U5/演进/风险 | 决定系统在外部不确定性下的保守性格。 |
| ADR-BR-011 | 全部durable和证据出口采用body-free、opaque secret ref和安全材料白名单 | 防止消息/附件/敏感Gate/凭证/私有URL泄露 | U2/U3/U4/U6/横切安全 | 影响存储、日志、观察、handoff和恢复，不是脱敏库选择。 |
| ADR-BR-012 | safe view/query no-write，consumer disposition与本地handoff分离 | 防止读取触发维护，并把本地trace冒称真实evidence | U6/Observability/横切审计 | 长期约束所有只读和观察交接面。 |
| ADR-BR-013 | 采用同步资格 + 异步事实 + 后台承接的混合通信主线 | 防止全同步伪完成或全异步缺少即时安全拒绝 | U1~U6/关键交互/备选取舍 | 通信类别决定边界语义，不指定HTTP、Bus或队列产品。 |
| ADR-BR-014 | 平台、secret、owner和观察能力以逐安装/逐合同资格激活，不预选产品或默认provider | 防止公开协议、配置接受或SDK默认行为变成运行ready | 技术机制/风险/演进 | 未选产品不是缺失的实现事实，而是需真实合同核验的边界。 |

## 8. ADR逐项停审与跨审

| ADR组 | 停审结论 |
|---|---|
| ADR-BR-001~004（U1） | 均有00目标/FR/BR/DR来源，回指Step5/7/8/10/12；未把owner授权truth或产品选择写入决定。pass。 |
| ADR-BR-005（U2） | 有C2、Conversation正式语义、Step8/9和BR-UP-001边界来源；只保阶段分离，不新增提交接口。pass。 |
| ADR-BR-006（U3） | 有C3、Governance/Artifact依赖、Step8/9/12及BR-UP-003/004；未把安全投影当owner。pass。 |
| ADR-BR-007（U4） | 有C4、Identity/Governance责任边界、Step3/9/12及BR-UP-002/003；未授本仓Decision。pass。 |
| ADR-BR-008~010（U5） | 有C5、Step8/9/10/13/14及BR-UP-009；未将unknown或恢复假设写成平台事实。pass。 |
| ADR-BR-011~012（U6） | 有DR017~020、NFR015/016、Step8/9/12/14及BR-UP-006；未伪造Observability接受/evidence。pass。 |
| ADR-BR-013~014（跨单元） | 有Step9/10/11/12/13/14和全局未选状态；只记录通信/资格机制，不锁产品。pass。 |

## 9. 漏项检查与跨追溯审计

| 审计面 | 结果 |
|---|---|
| 孤儿架构决定 | 未发现；14项ADR均回指停审单元/跨审与正式需求、约束或风险。 |
| 孤儿核心需求 | G-BR-001~005、C-BR-1~5、FR-BR-001~016均在矩阵中有架构承接；BR-UP缺口只影响资格，不被遗漏或伪关闭。 |
| FR/NFR/BR/DR/AC覆盖 | FR001~016、NFR001~016、BR001~024、DR001~020、AC001~038和VETO001~006按范围逐组覆盖；全局DR017~020、NFR015/016、AC037/038复用明确。 |
| 无来源架构判断 | 未发现；职责、系统、上下文、依赖、数据、通信、机制、取舍、横切、演进和风险均回指Step/00来源。 |
| 普通实现误入ADR | 未发现；没有把SDK、库、函数、表、队列、部署、阈值或配置脚本列为ADR。 |
| 取舍来源 | P0~P5回指Step2/10/11/12及约束/风险；未把愿望池或边界外事项当正式路径。 |
| 跨单元冲突 | U1授权/mapping、U2 owner handoff、U3 effect、U4 action、U5 cursor/recovery、U6 safe observation无重复truth、反向依赖或通信升级。 |
| 未确认项处理 | BR-UP-001~009仍open，BR-UP-010仍reference_only；只在Step14风险/待确认和本矩阵条件说明中出现，不被ADR或正式定论吸收。 |
| 事实安全 | 无账号、token、实现仓、commit、run、投递、测试、artifact、report、evidence、verdict、signoff或readiness伪造。 |

## 10. 追溯范围说明、回填与门禁

本步采用“核心需求/能力、规则/数据/质量/验收、ADR索引”三组追溯粒度：主矩阵解释来源到架构结果的原因，范围行只用于覆盖既有ID，不把章节目录当映射。未闭合的owner/平台/consumer合同留在Step14和对应BR-UP状态，不强行补入架构决定；普通实现选择留给02~04。正式 `01-架构设计.md §16~17` 计划摘录第5~9节的压缩版，详细覆盖表留校准延伸阅读。

来源：`00_req_step_16_traceability_matrix.md`、`00_req_step_14_acceptance_criteria.md`、`01_arch_step_01_requirements_baseline.md`、`01_arch_step_05_bounded_contexts.md`、`01_arch_step_07_dependencies.md`、`01_arch_step_08_data_consistency.md`、`01_arch_step_09_interactions.md`、`01_arch_step_10_technology_seams.md`、`01_arch_step_11_alternatives.md`、`01_arch_step_12_cross_cutting.md`、`01_arch_step_13_evolution.md`、`01_arch_step_14_risks_pending.md`、架构SOP Step15、架构设计书写规范§4.16/§4.17。

自检结论：U1~U6和跨单元ADR均停审；FR/NFR/边界/数据/验收范围可追溯；未发现孤儿或新增未确认结论。当前agent设计自检通过。

`gate_status=pass`；`gate_reason=adr_and_full_traceability_audit_passed`；`next_allowed_action=read_step_16_then_create`；`formal_backfill_allowed=after_step_16_three_level_gate`；`commit_required=false`。
