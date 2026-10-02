# 01 Step07 · 依赖方向与层间约束

## 1. 开工确认与Step内计划

模式full-restart；当前agent单独执行；前序Step已停审。已读取架构SOP本Step、架构书写规范对应章节和通用规范适用规则。输入：Step05/06、00§6、全局依赖规则§2/4/5/6。输出为当前文件；正式回填仍待Step16。

计划：输入恢复→问题回答→诊断→取舍→结构化→复杂度/历史差异审计→回填草稿→自检/停审。前四项进入本批，后四项pending；未来Step不预建。

| gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|
| pass | 前序停审及用户01授权，只许可当前Step | 完成当前单元思考后才写结构化 | Step05/06、00§6、全局依赖规则§2/4/5/6 |

## 2. SOP问题回答

架构责任层为核心市场语义、编排承接、外部接缝、技术承载。只向内依赖；编排通过自己需要的正式能力边界消费外部，不让SDK/存储/UI决定业务语义。Core/SDK允许compile，但仅正式导出类型/client；owner是runtime且经SDK；条件事件经SDK/Bus，不增加直接Bus包依赖。逐U1～7分别限定读/写能力，运行期不能变成path dependency。

## 3. 输入诊断

旧图core→package/security概念混成目录；SDK声明“有client”也不能证明每type contract支持。共有adapter若暴露所有写权会让查询和维护穿透限制，因此接缝按操作最小能力，而非万能权限对象。

## 4. 设计取舍

采用由内定义消费能力、外部实现的倒置；不采用核心直接依赖HTTP/SDK/SQL或owner源码。不让U7拿U2～5写权；逐单元规则下批停审。

### U1 问题、诊断与取舍

问题/依据：来源和责任核验要依赖什么？C1所需owner/authority/material读取，不能凭Identity作人类认证。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U1 结构化、回填与停审

允许核心来源规则→body-free资格语境；编排通过SDK-owner/source/publisher/material只读接缝。禁止owner正文存储、人类身份造真相、扫描生产/批准写权；MP-UP001/003/004未qualified时fail closed。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U2 问题、诊断与取舍

问题/依据：C2如何申请审核而不获得审批authority？申请交接与Decision读取两能力分离。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U2 结构化、回填与停审

允许编排→申请语义及Gov submission/read接缝，核心不依赖Gov实现。禁止Gov内部表/approve操作、用U7摘要决定approved或直接私有gRPC；outcome/binding缺口停止上架。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U3 问题、诊断与取舍

问题/依据：目录/版本依赖谁？市场上架依据来自U2，处置来自U5，外部source仅读。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U3 结构化、回填与停审

允许U3消费U2依据和U5处置、由编排消费qualified source/visibility；禁止依赖UI/search决定当前状态、并入Method/Hub、查询获得writer。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U4 问题、诊断与取舍

问题/依据：获取须哪些当前能力？source/authority/Gov/market/receiver各有限接口，不叫安装adapter。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U4 结构化、回填与停审

允许编排→分发核心与source/eligibility/receiver交接/对账接缝，按contract给最小能力。禁止安装/finance/Billing写权、receiver内部DB或新意图绕原unknown。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U5 问题、诊断与取舍

问题/依据：撤回依据与通知能否同依赖？处理需source/Gov/actor依据，发送需qualified通道且可延后。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U5 结构化、回填与停审

允许显式处置核心→U3/U4禁新获取规则；编排→影响读取与notice能力。禁止通知ACK决定撤回状态、自动卸载和owner撤销写权；通道故障不能阻塞本地停发。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U6 问题、诊断与取舍

问题/依据：audit/recovery有哪些允许的writer？只市场已授权局部意图和shadow维护，外部audit仅handoff。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U6 结构化、回填与停审

允许编排→安全局部追溯、原意图恢复及Observability接缝；禁止日志sink/audit backend配置定义成功、Archive恢复写权或外部repair。query/history reader与维护writer分开。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U7 问题、诊断与取舍

问题/依据：查询与索引builder能否获得核心writer？不需要；重建只有shadow输出。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U7 结构化、回填与停审

允许只读resolver、局部committed事实/qualified快照及投影承载。禁止U2/U3/U4处置/receiver发出能力，query telemetry不新增业务写，旧projection不是truth来源。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

## 5. 结构化中间产物

### 正式§8架构层依赖

| 架构责任层 / 依赖角色 | 允许依赖 | 禁止依赖 | 说明 |
|---|---|---|---|
| 核心市场语义 | 正式共享契约/本地规则 | UI/SDK transport/存储/owner实现 | 规则不能由技术产品反定义。 |
| 编排承接 | 核心语义及内侧需求能力 | owner源码/私有表、外部truth writer | 操作级最小能力，不共享万能依赖对象。 |
| 外部接缝 | 编排定义的消费能力、正式SDK契约 | 核心侵入protocol、绕SDK私有L1 gRPC | 支持状态按exact合同核验。 |
| 技术承载 | 内侧承载要求 | 反定资格/状态/成功或恢复规则 | 数据库/队列/索引不是authority。 |

#### 依赖方向图

```text
[External seam] --> [Orchestration] --> [Core semantics]
[Technical carrier] --> [Orchestration]
```

- 箭头表示允许依赖或边界接入，非调用顺序、源码层名称或运行拓扑。
- 核心不依赖外层；外部消费的能力要求由内侧定义。
- U1～7逐单元最小能力见本Step逐单元停审，U7不获得truth writer。

### 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| L0-core | 市场共享契约 | 依赖方 | 编译期 | 是 | 只正式导出类型，不shadow metadata/ref。 |
| L0-sdk | 市场官方接入 | 依赖方 | 编译期/运行期 | 是 | 嵌入client与运行能力消费分别核验。 |
| L3-method-library | method/role发布 | 依赖方 | 运行期/条件事件 | 是 | 三类资产来源，经SDK，不复制定义。 |
| L3-capability-hub | tool发布 | 依赖方 | 运行期/条件事件 | 是 | formal exposure非listing。 |
| L2-member-images | 镜像供给边界 | 依赖方 | 运行期 | 路径级是 | query/entry资格待绑，0 outbound不猜事件。 |
| L1-governance | 发布审核 | 依赖方 | 运行期/条件事件 | 是 | 正式Decision/outcome及baseline绑定。 |
| L1-artifact | 正式材料/回指 | 依赖方 | 运行期/条件事件 | 是 | 不私读正文/血缘/存储。 |
| L1-identity | AI成员引用 | 依赖方 | 运行期 | 条件 | 非人类publisher验证。 |
| L4-observability | 横切审计 | 协作方 | 运行期/条件事件 | 条件是 | producer准入/脱敏/receipt待核验。 |
| L4-archive | 归档恢复协作 | 协作方 | 运行期候选 | 否 | 无market source/restore合同。 |
| L0-bus | SDK事件底座 | 间接消费者 | 事件协作，经SDK | 条件 | 无direct compile依赖或内部订阅。 |
| L5-console/sync/website、L6-bridges | 产品消费候选 | 潜在被依赖/协作方 | 运行期候选 | 否 | 无正式market consumer绑定。 |

### 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | Core/SDK | 已导出的shared contract/client | 02/03类型归属、07最小package边界 |
| 运行期依赖 | 三资产owner、Gov、Artifact、条件Identity | 正式SDK+操作级owner adapter | 02/03 source/port/error、04绑定、05合同测试 |
| 运行期依赖 | Observability、待定authority/receiver/notice能力 | 仅qualified handoff及安全结果 | 03/04/05/06路径级门禁 |
| 事件协作依赖 | 已授权owner/SDK/Bus | canonical schema才启用，失效提示不默认批准 | 03payload/consumer、05乱序/replay、07条件边界 |

### 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| 市场→业务owner源码/内部DB | runtime变compile、共享truth/事务 | SDK/正式owner消费边界 |
| 下层owner→market源码 | 反向层级和循环 | 独立body-free运行协作合同 |
| 市场→私有L1 gRPC | 绕官方SDK | 等exact client support |
| 市场→direct Bus内部订阅/Images猜outbound | 无消费授权或owner事件 | SDK授权event，Images正式query |
| 市场→本地approval/auth/Billing/install真相 | 越ownership | 正式owner依据或future/blocker |

#### 依赖方向图

```text
L6-marketplace --[compile]--> L0-core
       |       --[compile]--> L0-sdk
       |                         |
       | [runtime via SDK]       +--[event, conditional]--> L0-bus
       +--> L3-method-library / L3-capability-hub / L2-member-images
       +--> L1-governance / L1-artifact / L1-identity (AI only)
       +--> L4-observability (qualified handoff required)
L4-archive / product consumers: future, no active lane
```

- 仅市场相关边，不表示时序；compile才能进入package。
- runtime/event经正式SDK，owner不进入path dependency。
- 事件需canonical合同及SDK支持，Images无outbound候选；Archive不启用。

跨单元审计：无反向依赖，UI不直读DB/owner，U7无核心writer，恢复无owner修复权，runtime未误作compile；adapter/repository不是架构层主语。

## 6. 复杂度判断

逐U1～7已独立停审；三裁剪表及两图补充总体视图，未重复详细接口或目录。

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
