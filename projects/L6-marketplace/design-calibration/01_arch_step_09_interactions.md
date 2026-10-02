# 01 Step09 · 关键交互与通信方式

## 1. 开工确认与Step内计划

模式full-restart；当前agent单独执行；前序Step已停审。已读取架构SOP本Step、架构书写规范对应章节和通用规范适用规则。输入：Step04/06/08、00 IF/DEP与owner正式消费边界。输出为当前文件；正式回填仍待Step16。

计划：输入恢复→问题回答→诊断→取舍→结构化→复杂度/历史差异审计→回填草稿→自检/停审。前四项进入本批，后四项pending；未来Step不预建。

| gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|
| pass | 前序停审及用户01授权，只许可当前Step | 完成当前单元思考后才写结构化 | Step04/06/08、00 IF/DEP与owner正式消费边界 |

## 2. SOP问题回答

同步用于市场admission/可见查询/显式处置和当前依据判断；外部长时审核/交付/通知/审计及unknown核对由后台延后承接；条件事件只传已成立owner结果或失效线索，需canonical来源授权与SDK支持。每次成功仅当前边界成立：申请已提交不是批准，分发已受理不是receiver成功。没有receiver reconciliation合同不把timeout变重试。查询维护不能混合；观察失败不能回滚撤回或恢复新获取。

## 3. 输入诊断

旧架构用“安装/撤回事件”同时表达市场truth与receiver执行；Images明确0 outbound。Gov query public summary缺approved与market binding，Artifact ref缺市场类型/材料contract，不能据名字发明endpoint。通信原则不写API/topic/DTO或时序。

## 4. 设计取舍

采用同步收口局部判断+后台推进外部交接+条件正式结果送达；不采用同步等待全owner/通知成功，也不采用所有状态由event到达直接推进。逐U1～7交互停审。

### U1 问题、诊断与取舍

问题/依据：源引用/责任/材料核验需立即结果，刷新可后台；source事件能替代资格？不能。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U1 结构化、回填与停审

同步：责任关联admission与source-backed核验/安全缺口读取。后台：qualified refs刷新与失效核对。条件event仅核验触发，不自创source version/scan/publisher verified；source unavailable返回明确缺口，不回落硬编码。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U2 问题、诊断与取舍

问题/依据：申请受理与Gov审核完成应同同步边界吗？不，应独立handoff与binding核验。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U2 结构化、回填与停审

同步：固定申请/终止admission与状态读取。后台：Gov正式申请交接、结果核对及matched批准后显式市场上架处置。条件Gov结果输入与query均须正式consumer合同；ACK/摘要fresh仅交接/可读。unknown保持原申请意图，不二次发起。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U3 问题、诊断与取舍

问题/依据：查询能触发上架或换最新吗？不能；上架属显式change。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U3 结构化、回填与停审

同步：受控market处置、当前可见目录/详情/版本选择。后台：只U7投影维护；条件来源变化提示供核验。scope不能证明时隐藏/降级，stale不静默换exact版本。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U4 问题、诊断与取舍

问题/依据：获取受理、receiver交接、最终结果如何分层？本地意图先成立，外部延后。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U4 结构化、回填与停审

同步：当前资格及获取/取消意图admission、关系读取。后台：qualified receiver交付/原意图probe；派发前重查版本撤回及资格。条件receiver结果须intent/version/consumer/receiver/scope同绑定；unknown不补installed，不盲retry，无probe保持等待。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U5 问题、诊断与取舍

问题/依据：停新发是否能等所有通知？不，外围失败应分离。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U5 结构化、回填与停审

同步：authority有效的撤回/限制及状态读取。后台：稳定已知关系枚举、迟到影响补充、通知交接/核对；条件source/Gov提示走正式映射。通知失败/unknown保留attempt，不卸载、不放行新获取。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U6 问题、诊断与取舍

问题/依据：本地审计与外部材料handoff、恢复是否可由一次调用全成功？不，独立结果。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U6 结构化、回填与停审

同步：授权恢复意图admission与安全审计/进展读取。后台：原意图对账/安全局部恢复及Observability准入交接；无market Archive active lane。运行telemetry只是诊断，外部not-visible/rejected/unknown不写observed-success。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U7 问题、诊断与取舍

问题/依据：分页查询和rebuild哪些同步？query只读，builder后台且只shadow写。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U7 结构化、回填与停审

同步：正式scope resolver后的有界projection读取；后台：committed truth+qualified owner快照的范围重建/refresh。条件event只失效/刷新提示；重建失败stale/degraded，不在query里修truth或补missing owner正文。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

## 5. 结构化中间产物

### 正式§10关键交互场景

| 交互场景 | 交互边界 | 交互目的 | 边界说明 |
|---|---|---|---|
| 来源/责任/材料核验 | U1与source/publisher/material能力 | 可解释申请前置与当前缺口 | 不生产外部verified/scan/signature。 |
| 发布申请与审核交接 | U2与Gov正式能力 | 固定申请并等待matched决定 | 市场申请≠Gov批准≠上架。 |
| 市场处置及可见目录/选择 | U3/U5与受控入口/U7 | 明确局部状态及exact版本 | 查询不写，分类不造资产定义。 |
| 获取与receiver交付/结果 | U4与资格/source/receiver能力 | 形成关系及原意图结果 | accepted/ACK不等安装/付款。 |
| 撤回影响与通知 | U5与U3/U4/通道能力 | 停新发并追溯已知影响 | 通知结果不决定撤回生效。 |
| 审计交接与局部恢复 | U6与本地处理/Observability | 安全追溯、原意图收敛 | 无Archive/Billing active lane。 |
| 可见读取与派生维护 | U7与committed facts/qualified sources | 范围内有界查询与重建 | projection仅shadow，不补source truth。 |

### 通信方式判断

| 交互场景 | 推荐通信方式 | 不宜采用的方式 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 来源/责任/材料核验 | 同步请求 / 响应类交互；刷新后台延后 | 事件到达/缓存即有效 | pending/不支持/不可见/失效/明确失败 | 本次资格必须可证明。 |
| 发布申请与审核交接 | 受理同步；交接/核对后台；正式结果条件异步 | 等全审核后才回本地受理或ACK直接批准 | 原申请pending/unknown，缺binding不进上架 | Gov自主裁决。 |
| 市场处置及可见目录/选择 | 同步请求 / 响应类交互 | 查询中隐式上架/换最新 | 缺依据拒绝；读取empty/not-visible/stale/degraded | 同步仅当前边界结果。 |
| 获取与receiver交付/结果 | 受理同步；交付/probe后台；结果条件异步 | 同步跨owner事务或unknown盲retry | 原intent对账；不支持probe等待正式人工依据 | intent与external commit分别可查。 |
| 撤回影响与通知 | 处置同步；影响/通知后台；反馈条件异步 | 依赖全部送达才停新发 | 停发已成立，通知pending/failed/unknown | 迟到relation增量纳入影响。 |
| 审计交接与局部恢复 | 受理/查询同步；交接/恢复后台 | 外部audit成功成为撤回前置 | local trace保留，外部准入独立，unknown先核对 | 不声明归档/验收完成。 |
| 可见读取与派生维护 | 查询同步；重建后台 | 查询修truth/索引自授权 | 安全stale/degraded，有源才重建 | scope未知不暴露敏感结果。 |

事件/回调只有canonical schema、authority、binding、SDK support齐备才启用，不能“任意订阅owner所有事件”。Images不属于当前outbound来源。同步返回只承诺局部判断，后台延后不是伪成功，ACK仅transport/接收层含义。本章可选交互图省略：七并列场景不是一条pipeline，矩阵更准确。

跨交互审计：sync/async选择与Step08一致，query/maintenance零核心写，所有外部unknown有原意图核对或等待边界，缺协议不由名字反推。

## 6. 复杂度判断

七单元逐项停审，接口路径、topic、DTO、重试算法仍不属于01；03必须先qualified合同再定义exact协议。

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
