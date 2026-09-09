# Step 14. 正式装配

## 1. Step 状态与计划

- 模式：full-restart / single-agent-serial；输入门禁 pass；思考记录、结构化、回填、自检 done。
- gate_status=pass；gate_reason=正式02装配及静态审查完成；next_allowed_action=formal_stop_review；formal_fill_allowed=closed_after_assembly。
- source_files：Step 1~13；概要规范；项目台账；02 flow；概要SOP对应Step与概要规范对应章节。
- 写入前检查：本项目/本文档授权有效；无正式正文污染；分批规模不限制最终完整性。

### Step 内计划

1. 已读取三层台账、前序及规范。
2. 问题回答、诊断、取舍见§3~6。
3. 先全链源审计与必要回源修正，再§1~5、§6逐对象、§7~10逐模块、§11~14装配；最后静态检查/逐章引用/术语/停审记录；每批可100~300行但不限制最终长度
4. 结构化后后置历史审计；从§7摘录回填。
5. 自检通过后更新flow，不把上游pending改为闭合。

## 2. 本步输入

Step 1~13；概要规范；00 FR-WS-001~010/BR-WS-001~012；01 §6/8/9/10/13/15。前步的问题回答、诊断、取舍、待确认均承接，具体依赖见flow §3。

## 3. SOP 问题回答

1. Step1~13分别支撑正式§1~13，§14列实际参考材料；对象、模块、接口、flow、状态按各自组织轴装配。
2. Step5模块诊断、Step6恢复补审、各Step自检与历史审计不进入正式正文；正式章节必须保留具体校准来源及延伸阅读。
3. 统一CP1~7、16对象、14入口和版本/安全轴术语；步骤编号不是正式小节编号。
4. WS-UP-001~008/006-S继续作为受影响路径blocker，不润色成可调用外部合同。
5. 不补完整schema/trait/DDL/运行参数，不把概要文档长度压成摘要。
6. 实际参考为本项目00/01、已登记上游专题、规范及governance/artifact概要粒度；只列用过材料。

## 4. 当前文档问题诊断

装配前发现Step5物理顺序与执行顺序不同、CP1操作记录表述易误解由CP5业务owner统一写。需要先回源机械整理/澄清；不能把过程段落直接搬进正式文档。

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 尚无本Step正式校准；01只有架构约束 | 本Step将已核验边界转为正式装配，不补上游schema |

## 6. 设计取舍

采用按章节分批摘录已自检结构表/对象卡/flow/state；正式正文不带诊断过程。前置审计发现的问题回源修正后才装配对应章节，不在正式正文补新结论。

## 7. 结构化中间产物

### 7.1 装配映射与当前门禁

| 正式章节 | 校准来源 | 回填内容 |
|---|---|---|
| §1~4 | Step1~4 | 上游关系、范围、约束、主体映射与分层图 |
| §5 | Step5 | 七CP职责/capability/代码主体/对象线索/接缝，剔除诊断和停审 |
| §6 | Step6 | 候选筛选、16对象独立卡、字段类型排除说明；剔除恢复依据与自检 |
| §7 | Step7 | 分类上下文、逐CP接口表及不适用入口说明 |
| §8 | Step8 | 通用约束、14独立处理流、CP2/4内部协作说明 |
| §9 | Step9 | 状态主语/集合/允许禁止/图与传播；剔除审计 |
| §10 | Step10 | 28关键异常及处理部分，不搬风险台账 |
| §11 | Step11 | 配置影响、不变量与03/04分工 |
| §12 | Step12 | 稳定输入、展开深度和回退规则 |
| §13 | Step13 | 风险、待确认及受影响路径上限 |
| §14 | 本Step参考表及flow输入登记 | 实际使用参考与用途 |

当前formal_fill_allowed=false，先执行装配前源审计；仅修本项目校准材料。没有正式02时不能声称已停审。

### 7.2 装配前源审计结果

| 检查 | 结论/处置 |
|---|---|
| Step5模块物理顺序 | 已机械整理为总览→CP1~7；不改变原执行记录 |
| CP1 scope helper命名 | 统一为ScopeService内部解析，不新增公开Resolve API |
| 跨CP操作记录 | 明确共享技术结构，CP1/6各自拥有操作，不把业务授权交CP5 |
| coverage失效 | Step6回填仅SafetyBlocked转Invalidated；DataStale不篡改正式覆盖证明 |
| Step6→8/9对象反查 | 16对象均有已完成流程/状态承接；DTO/ports已排除 |
| 文档与Step状态 | Step13完成不表示正式02已完成，项目文档状态仍in_progress |

### 7.3 实际参考材料

| 参考材料 | 用途 |
|---|---|
| [00-需求文档.md](../00-需求文档.md)、[01-架构设计.md](../01-架构设计.md) | 能力、owner、依赖、一致性及安全约束 |
| [概要设计讨论流程_SOP](../../../standards/document/概要设计讨论流程_SOP.md) | 本概要生成流程、章节与表达深度 |
| [概要设计书写规范](../../../standards/document/概要设计书写规范.md) | 本概要生成流程、章节与表达深度 |
| [设计文档编写通则](../../../standards/document/设计文档编写通则.md) | 三层门禁、逐部分校准与正式装配纪律 |
| [设计文档讨论中间产物规范](../../../standards/document/设计文档讨论中间产物规范.md) | 三层门禁、逐部分校准与正式装配纪律 |
| [设计真相源闭环与可落码性标准](../../../standards/document/设计真相源闭环与可落码性标准.md) | resolver、字段/状态、重建与证据来源 |
| [全局项目依赖关系与裁剪规则](../../../standards/document/全局项目依赖关系与裁剪规则.md) | 依赖分类与§4.1 workspace→archive串行 |
| [L0-core 正式02](../../L0-core/02-概要设计.md)、[L0-core 正式03](../../L0-core/03-详细设计.md) | 共享契约与符号authority |
| [L0-bus 正式02](../../L0-bus/02-概要设计.md)、[L0-bus 正式03](../../L0-bus/03-详细设计.md) | 事件传递与replay preparation边界 |
| [L0-sdk 正式02](../../L0-sdk/02-概要设计.md)、[L0-sdk 正式03](../../L0-sdk/03-详细设计.md) | 服务消费与客户端缓存隔离 |
| [L1-identity 正式02](../../L1-identity/02-概要设计.md)、[L1-identity 正式03](../../L1-identity/03-详细设计.md) | Personal身份锚与正式范围解析 |
| [L1-conversation 正式02](../../L1-conversation/02-概要设计.md)、[L1-conversation 正式03](../../L1-conversation/03-详细设计.md) | 对话truth与安全摘要/引用 |
| [L1-work 正式02](../../L1-work/02-概要设计.md)、[L1-work 正式03](../../L1-work/03-详细设计.md) | Project/ProjectMember owner及scope关系 |
| [L1-process 正式02](../../L1-process/02-概要设计.md)、[L1-process 正式03](../../L1-process/03-详细设计.md) | 过程truth与只读供给 |
| [L1-governance 正式02](../../L1-governance/02-概要设计.md)、[L1-governance 正式03](../../L1-governance/03-详细设计.md) | 治理决定owner、正式读取及对象/接口粒度 |
| [L1-artifact 正式02](../../L1-artifact/02-概要设计.md)、[L1-artifact 正式03](../../L1-artifact/03-详细设计.md) | 制品truth、safe引用与对象/配置粒度 |
| [L2-runtime 正式02](../../L2-runtime/02-概要设计.md)、[L2-runtime 项目台账](../../L2-runtime/design-calibration/project_execution_ledger.md) | runtime execution truth排除 |
| [L2-tools 正式02](../../L2-tools/02-概要设计.md)、[L2-tools 项目台账](../../L2-tools/design-calibration/project_execution_ledger.md) | tools execution truth排除 |
| [L2-member 正式02](../../L2-member/02-概要设计.md)、[L2-member 项目台账](../../L2-member/design-calibration/project_execution_ledger.md) | member执行边界与非项目主语缺口 |
| [L2-member-service 正式02](../../L2-member-service/02-概要设计.md)、[L2-member-service 项目台账](../../L2-member-service/design-calibration/project_execution_ledger.md) | registry/session接受truth排除 |
| [L2-member-images 正式02](../../L2-member-images/02-概要设计.md)、[L2-member-images 项目台账](../../L2-member-images/design-calibration/project_execution_ledger.md) | 静态资产与live workspace隔离、MI-UP-006 |
| [L1-governance概要校准](../../L1-governance/design-calibration/02_hld_calibration_flow.md)、[L1-artifact概要校准](../../L1-artifact/design-calibration/02_hld_calibration_flow.md) | 对象/接口/流/状态/配置影响粒度参考，不继承其业务职责 |

### 7.4 分章写入门禁

源审计已完成；项目/flow/本Step允许按上述映射逐章回填正式02。formal_fill_allowed=true_for_reviewed_chapters；未闭合外部合同仅以blocked上限进入风险章；正式正文不得新增设计结论。

### 7.5 正式装配术语/引用规范化

装配静态审查发现对象发现表残留“Step6待筛选”的过程时态。只做表示统一：正式章中的Step6~9转§6~9；候选发现表指向已完成§6筛选，不改变对象集合；模块类型从候选对象写为关键对象；参考材料和上游关系补足实际仓内路径。该批不引入新设计判断。

### 7.6 停审前文档静态检查

检查方式为只读文本脚本与逐段审查，不运行项目测试：14正式章节、14校准来源/延伸阅读、16对象卡/字段表/禁止表、14独立处理流、成对代码围栏与链接目标。正式过程性标题已剔除；Step5候选过程时态已规范化为正式章节引用。

### 7.7 本轮最终自检与停审结论

| 审查面 | 结果 | 完成上限 |
|---|---|---|
| 正式结构与来源 | pass | 14章、逐章校准来源及延伸阅读，参考目标已核验 |
| 组成部分/对象 | pass | 七CP、16独立对象卡；字段/成员/工厂/状态/禁止事项齐全 |
| 接口/处理流 | pass | 2 Command、6 Query、2 Consumer、4 Operations均独立有流；CP2/4内部协作有排除说明 |
| 状态/异常/配置 | pass | 双轴generation、覆盖/意图/响应分离；28异常；配置不可绕过不变量 |
| 依赖及上游 | blocked | WS-UP-001~008/006-S未关闭，owner exact正向路径不能据此交实现 |
| 执行事实 | not_applicable | 未实现、未执行测试、未创建真实baseline/证据/commit |

正式02装配完成并停审。本轮在文档边界暂停，不自动创建03文件；用户此前对03 Step1~10的范围授权保留，但依“每正式文档完成立即停审”规则，下轮明确继续后从03 Step1顺序开始，不能跳到Step5。03最终仍以Step10为授权上限，不装配正式03。

## 8. 回填草稿

正式§1~13按§7.1映射摘录各Step的已收束结论；正式§14只摘录§7.3实际参考材料表，链接按正式文档目录调整。本文的装配诊断、门禁、自检和停审记录不进入正式章节正文。

## 9. 待确认事项

WS-UP-001~008/006-S持续开放；仅允许本地骨架与负向边界收口，受影响正向合同不能交实现。

## 10. 进入下一步条件

正式14章已完整装配并完成静态审查；source/schema与实现就绪未虚假闭合。按用户规则正式02完成立即停审，本轮不进入03。
自检仅为文档静态审查，不是测试执行或上游签署。gate_status=pass；允许进入文档停审。
