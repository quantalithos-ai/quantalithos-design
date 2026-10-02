# 01 Step05 · 限界上下文与子域划分

## 1. 开工确认与Step内计划

模式full-restart；当前agent单独执行；前序Step已停审。已读取架构SOP本Step、架构书写规范对应章节和通用规范适用规则。输入：Step03/04、00 C1～5及五能力附录。输出为当前文件；正式回填仍待Step16。

计划：输入恢复→问题回答→诊断→取舍→结构化→复杂度/历史差异审计→回填草稿→自检/停审。前四项进入本批，后四项pending；未来Step不预建。

| gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|
| pass | 前序停审及用户01授权，只许可当前Step | 完成当前单元思考后才写结构化 | Step03/04、00 C1～5及五能力附录 |

## 2. SOP问题回答

整体单元骨架先确定：U1来源与publisher责任，U2发布申请/审核交接，U3目录与市场版本，U4受控分发，U5撤回与通知，U6审计与恢复，U7本地引用/读取投影。U2～5承载市场核心过程；U1/U6为支撑；U7只为稳定消费，不成为第八资产库。统一语言先固定：source version≠market version；review handoff≠Decision；distribution receipt≠installation；notice attempt≠delivery；local audit≠observation admission。各单元下文逐个小循环停审，不写对象字段或代码目录。

## 3. 输入诊断

00五能力是能力来源而非必须五个服务；U3既拥有taxonomy又有派生搜索，必须拆清truth与shadow。旧Package/Commercialization不是当前合法核心单元，合规缺口保留而不建包/金融对象。

## 4. 设计取舍

采用同一市场限界边界内七语义单元，核心共用市场不变量但不复制状态主语；不采用每asset type一套市场子系统，因会重复review/withdrawal语义。也不把U7快照建成核心资格truth。先逐U1～7思考/写入/自检，再跨单元审计。

### U1 来源与发布责任 小循环

问题/依据：C1 FR101～103/BR101～104要求关联责任及immutable来源，主体资质外置；为何单独？同一publisher可负责多个listing，责任失效影响多个申请。

诊断：不能把相邻单元或owner主语并入本单元。取舍：采用下述责任边界，不采用影子结构直接写核心truth。思考done后回填：

U1为支撑子域。责任：publisher relation、来源/材料核验过程及申请前基线。非职责：Identity、人类认证/组织资质、scan/signature生产和asset正文。对象主语：责任关系、来源核验语境、材料引用；状态主语仅本地责任/核验过程，verified是外部依据可适用而非本地自证。消费U7来源安全摘要，供U2固定依据、U4当前复核；不拥有owner版本/digest/visibility。

回填草稿：正式章节摘录上述责任、边界和状态主语。自检：来源可回指、非职责不被吸收、projection非truth、无接口字段或表结构；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1和本单元依据。

### U2 发布与审核交接 问题、诊断与取舍

问题/依据：C2 FR201～203固定申请及有效批准要求；如何不成为审批系统？只管理申请/交接/适用状态，Decision归Gov。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U2 发布与审核交接 结构化、回填与停审

U2核心子域。对象主语：发布申请、固定申请基线、review handoff；本地进展可区分草拟/提交/待交接/已交接/结果待核验/终止，approval/outcome永远外部。提交基线不能就地修订，换source/material/scope建立新审查语境；有效批准+全绑定复核后显式请求U3上架。Gov拒绝与本地contract blocked分别表达；扫描和ACK不能转approved。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U3 目录与市场版本 问题、诊断与取舍

问题/依据：C3及FR203要求listing、version选择与scope搜索；怎样区分目录truth和读取shadow？listing/分类/市场metadata本地拥有，search交U7。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U3 目录与市场版本 结构化、回填与停审

U3核心子域。对象主语：listing、市场版本、分类/标签关系；市场版本不可变绑定owner source version。状态主语分别为listing可展示/受限、市场version待上架/上架/限制/撤回；只是架构语义，不定义最终enum。U2提供申请+正式依据，U5提供处置；查询不迁移，来源恢复不自动复活。多个listing/版本不按label合并；metadata只能市场描述+owner允许摘要，不保存定义正文。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U4 受控分发 问题、诊断与取舍

问题/依据：C4 FR401～403要求资格、意图、attempt、receiver结果分开；为什么不叫Install？receiver拥有执行。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U4 受控分发 结构化、回填与停审

U4核心子域。对象主语：获取意图、分发关系、交付attempt、receiver结果引用；状态主语是局部受理/待交付/已交接/结果已确认/失败/unknown/取消竞争，非installed/paid。使用U1/U3当前资格与exact version，外部receiver有正式合同后才派发；unknown保留原意图对账。窄entitlement仅外部资格快照，当前无transaction写主体。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U5 撤回与通知 问题、诊断与取舍

问题/依据：C5 FR501/502要求撤回先停新分发，影响只已知关系；是否能自动卸载？不具receiver执行ownership。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U5 撤回与通知 结构化、回填与停审

U5核心子域。对象主语：撤回/限制处置、已知影响集合、通知计划/attempt/结果引用。处置状态与通知状态分离；U3/U4共同守禁新获取，影响枚举包括已知relation及unknown交接，不声称全安装用户。通知计划/尝试/ACK/送达/unknown独立，送达依据owner；不会卸载、不改源资格/Decision。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U6 审计与恢复 问题、诊断与取舍

问题/依据：C5 FR503/504及G02要求局部追溯和有依据恢复；哪些是truth？市场自己的accepted变化/意图/恢复记录，不是Observability账本。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U6 审计与恢复 结构化、回填与停审

U6支撑子域。对象主语：局部安全审计、交接意图/attempt、恢复语境/结果；状态主语为局部操作/交接pending/failed/unknown，不成为外部observed/archived。围绕U1～5保留body-free来源与结果，运行日志只是诊断；恢复仅既有意图推进、局部shadow重建，不改owner/历史或自动重上架。Archive未active。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U7 引用与读取投影 问题、诊断与取舍

问题/依据：C1/C3/C4/C5读取需要何本地结构？owner qualified快照、目录搜索、进展、资格/receiver/影响/审计摘要；为何非核心子域？都不独立拥有外部事实。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U7 引用与读取投影 结构化、回填与停审

U7本地索引/投影/引用。只持有body-free owner来源/材料/Gov/资格/receiver/notice/audit引用、qualified快照和已提交U1～6事实的派生读取。状态主语仅freshness/rebuild/gap，不批准/上架/分发。对外scope由正式resolver，不能反解析opaque ref；projection不反写truth，重建来源不是旧projection。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

## 5. 结构化中间产物

### 正式§6子域划分与统一语言

| 名称 | 类型 | 作用 | 与其他部分的关系 |
|---|---|---|---|
| U1 来源与发布责任 | 支撑子域 | 承载市场责任关联和引用核验过程 | 向U2/U4供可解释来源语境，不创造authority。 |
| U2 发布与审核交接 | 核心子域 | 承载固定申请及正式审核交接过程 | 承接U1，向U3提供申请及有效决定引用。 |
| U3 目录与市场版本 | 核心子域 | 承载listing、分类与market version处置 | 消费U2/U5；支撑U4 exact选择。 |
| U4 受控分发 | 核心子域 | 承载市场获取关系与receiver交接 | 依附U3/U1当前资格，供U5已知影响。 |
| U5 撤回与通知 | 核心子域 | 承载禁新获取处置及已知影响通知责任 | 约束U3/U4，不依赖通知送达才处置。 |
| U6 审计与恢复 | 支撑子域 | 承载市场安全追溯及局部恢复语境 | 围绕U1～5，不拥有外部审计/归档。 |
| U7 引用与读取投影 | 本地索引 / 投影 / 引用 | 承载body-free影子与可重建读取 | 派生自U1～6及qualified owner来源，不反写。 |

#### 上下文关系图

```text
Core:     [U2 Publication] --> [U3 Catalog/version] --> [U4 Distribution]
                                     ^                         |
                                     | constraint              | known relations
                               [U5 Withdrawal/notice] <--------+
Support: [U1 Source/publisher] supports U2/U4
         [U6 Audit/recovery]   supports U1/U2/U3/U4/U5
Shadow:  [U7 References/projections] derives from U1..U6
```

- 箭头仅表达消费/支撑/约束，非调用顺序或独立服务。
- U7只持影子结构，不拥有asset/Gov/资格/receiver truth；U3 taxonomy仍是本地truth。
- U1/U6支持多个核心单元，其余关系在表中说明，不按七单元强拆微服务。

| 统一语言 | 正式含义 | 不等于 |
|---|---|---|
| Source version | owner不可变版本 | Market version、latest |
| Market version | listing下固定来源的市场上架主语 | owner资产正式化 |
| Review handoff | 市场向Gov交接的局部过程 | Approval/Decision |
| Distribution | 市场获取关系与交接过程 | receiver安装/激活 |
| Publisher relation | 市场责任关联 | 人类身份/组织资质/授权truth |
| Notice attempt | 本地尝试事实 | delivered/read/remediated |
| Local audit | 市场安全变化追溯 | 外部准入或验收evidence |
| Qualified reference | 正式owner/SDK合同支持且符合绑定的ref | 可读字符串或fake数据 |

### 对象与状态责任交接表

以下为逐单元已收束语义，不预造owner enum；状态主语/迁移保护必须由02/03细化为可落码契约，不能留给实现自由推断。

| 单元 / 对象主语 | 局部状态与迁移边界 | 外部依据 / SDK-owner接缝 | 不允许迁移或推断 |
|---|---|---|---|
| U1 publisher relation、来源核验语境、材料引用 | 建立/核验缺口/依据适用/失效；变更重核验并保留原依据 | 正式主体/组织/scope、来源immutable ref/version/digest/visibility、材料authority | 自认证主体、自产材料结论或覆盖已提交基线 |
| U2 申请基线、review handoff | 申请准备→固定提交→待交接/已交接/结果未知/已有正式决定引用；终止保留历史；修订新依据 | Governance接收、正式outcome与application/source/material/scope绑定、失效/核对 | 本地approved；ACK或超时上架；就地换版本 |
| U3 listing、market version、分类/标签关系 | listing展示/受限主语与version待上架/上架/限制/撤回主语分离；有据显式处置；重新上架需新有效依据 | U2申请/正式批准、owner当前来源、U5处置依据 | query推进；source恢复自动复活；silent latest |
| U4 获取意图、relation、attempt、本地结果映射 | 局部受理→待交付→已交接→匹配结果确认/失败/unknown；取消保留竞争结果；unknown原意图核对 | 当前资格/exact版本、typed receiver/consumer/scope/outcome/probe | accepted/ACK→installed/paid；新intent盲重试；取消自动回滚外部 |
| U5 撤回/限制、已知影响、通知计划/attempt | 处置提交即约束新获取；已知/unknown影响稳定枚举、迟到增补；通知pending/attempt/正式结果/failed/unknown独立 | 正式处置authority、U4关系、通道/receiver/receipt | 等通知再撤回；ACK→送达；全安装覆盖；自动卸载 |
| U6 安全审计、交接意图/attempt、恢复语境/结果 | accepted安全变化追加；外部交接pending/failed/unknown/有据结果；恢复推进原意图或追加局部处理 | 本地事务/完整原结果、Observability准入/脱敏/receipt，Archive当前无lane | logs→业务审计；local audit→外部完成；删改历史/反写owner |
| U7 引用、qualified快照、读取投影 | freshness/gap/stale/rebuilding/degraded；只能从committed facts及正式owner snapshot重建 | 最小scope resolver、source版本/摘要/资格、各局部事实 | 从旧projection重造truth；投影自证授权或批准 |

### 后续可落码承接表

| 切口 | 已确定边界 | 后续必须闭合的设计输出 |
|---|---|---|
| 模块及对象 | U1～7语义责任及对象主语唯一，非七微服务 | 02职责到代码主体；03对象/迁移表、前置及错误结果 |
| SDK / owner adapter | 每type/operation最小能力；unsupported/fake/pending不等supported | 02/03来源类型、资格、输入绑定、结果/错误/probe映射；缺owner不得补造 |
| 索引投影 | body-free、scope交集、无业务写、有源重建 | 03查询/计数/提示/历史一致范围、freshness/generation/重建输入和失效；04承载 |
| 幂等与事务 | operation/scope/key/canonical intent、原完整结果、局部原子审计及待交接责任 | 03原结果save/get、冲突、事务失败、claim/fence及撤回竞争；不跨owner事务 |
| 配置 | 绑定/预算/locale可配置，业务gate不可绕 | 02/04配置责任、缺失/非法/变更影响；无来源数字保持待确认 |
| 测试与证据 | CUT-MP-1～7区分文档/原型/fake/真实owner/signoff | 05按状态与合同资格设计；06独立证据判定；当前无run或成果 |

### 跨单元审计

| 检查 | 结论 |
|---|---|
| 责任重叠 | U2交接不拥有U3市场处置；U5是处置依据/影响，不建立第二market版本。 |
| 核心/支撑/影子误归类 | U7无业务truth，U1不拥有认证，U6不拥有audit backend。 |
| 重复语言 | source/market/receiver/notice/audit均唯一主语。 |
| 状态与后续承接 | 逐单元已列对象/状态主语；最终enum/transition/schema由02/03收口，不让实现自选。 |
| Contract gap | 正向发布/获取/外部通知/audit继续条件，财务/包/Archive无新增truth。 |

### 可落码交接边界

02/03由U1～7推导领域/应用主体及SDK-owner接缝，不从图反推目录。listing/version/review/distribution分别建状态契约；U7索引重建、U4幂等和U5竞争、U6事务/交接恢复均须有正式来源和测试切口。配置只选绑定/预算，不能切换业务结果；文档/原型/fake均不证明真实集成。

## 6. 复杂度判断

七单元逐项小循环已停审；本Step不写字段/trait/DDL。需要的代码粒度逐项交接02/03，而非用一张全局对象表冒充设计。

## 7. 后置历史差异审计

旧01仅作污染审计，位置/口径见Step01§7；本Step由当前需求与前序独立推导，不继承旧代码组织、数字、安装/支付或自造审核。

## 8. 回填草稿

正式对应章节摘录§5已收束表与边界说明；不复制问题回答/诊断，不新增合同或运行事实。具体回填范围见本Step结构化产物。

## 9. 自检与停审

来源、责任唯一、依赖方向、数据分类、conditional合同、正文排除及本Step层次审查通过；无越界代码/schema/表结构，无新增运行/evidence。计划八项done；问题回答→诊断→取舍→结构化分批形成。

| 单元 | 思考/写入/自检 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| 本Step已列单元 | done/done/done | pass | 已逐项自检与stop_review，外部positive缺口不关闭 | 下一Step；正式装配限Step16 | §1输入及§5结构化产物 |

### 单元执行台账收口

| 单元 | 思考 | 写入 | 自检 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|---|---|
| U1 | done | done | done | pass | 本单元小循环stop_review；外部qualification不关闭 | 本Step跨单元审计；通过后限前序flow许可 | 本Step§1、U1小循环、§5 |
| U2 | done | done | done | pass | 本单元小循环stop_review；外部qualification不关闭 | 本Step跨单元审计；通过后限前序flow许可 | 本Step§1、U2小循环、§5 |
| U3 | done | done | done | pass | 本单元小循环stop_review；外部qualification不关闭 | 本Step跨单元审计；通过后限前序flow许可 | 本Step§1、U3小循环、§5 |
| U4 | done | done | done | pass | 本单元小循环stop_review；外部qualification不关闭 | 本Step跨单元审计；通过后限前序flow许可 | 本Step§1、U4小循环、§5 |
| U5 | done | done | done | pass | 本单元小循环stop_review；外部qualification不关闭 | 本Step跨单元审计；通过后限前序flow许可 | 本Step§1、U5小循环、§5 |
| U6 | done | done | done | pass | 本单元小循环stop_review；外部qualification不关闭 | 本Step跨单元审计；通过后限前序flow许可 | 本Step§1、U6小循环、§5 |
| U7 | done | done | done | pass | 本单元小循环stop_review；外部qualification不关闭 | 本Step跨单元审计；通过后限前序flow许可 | 本Step§1、U7小循环、§5 |

## 10. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01按受影响路径保留；不作为运行通过或风险接受。02及后续正式文档仍未授权。
