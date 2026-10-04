# L6-bridges 00 Step 12：接口与依赖

> 状态：done / pass；回填00 §12；full-restart。

## 1. 状态与 Step 内计划

开工确认：六标准、台账/flow、Step6/9/11及五卡、需求SOP Step12/书写规范§4.12已读；进入条件pass。按C1~5归并11能力接口，再核对10依赖边界和同步/异步资格。不写API、DTO或port。

| 单元 | 思考 | 写入/审查 |
|---|---|---|
| C1管理接入 | done | done / pass |
| C2可信来源与owner交接 | done | done / pass |
| C3已提交来源与交付 | done | done / pass |
| C4交互与责任动作 | done | done / pass |
| C5等待/恢复/审计/读取 | done | done / pass |

## 2. 输入

Step6三裁剪表/图与seam；16FR；20DR；Conversation已有bridge输入但安全材料ref和结果对账面待兼容核验；平台公共资料不证明adapter已绑定。

## 3. SOP 逐项问题回答

Step17 preflight补审：此前本节合并成段落，现逐项核验既有11接口/10依赖；不改变§7能力边界或类型，不冒称原稿已逐项。

| 问题 | 已校准回答 |
|---|---|
| 当前哪个能力节点？ | C1管理、C2可信入站、C3committed来源/交付、C4交互/动作、C5续交/恢复/安全交接/读取，按既有顺序。 |
| 对外提供哪些接口？ | IF001受权管理；002/003来源/对话交接；004/005committed消费/外部交付；006/007交互/动作；008~011受控续交、恢复、审计、安全读取。 |
| 消费哪些能力输入？ | Core/SDK契约，Conversation/Identity/Governance/Artifact/Workspace的正式source/ref/basis，secret resolver、四平台、条件Bus及Observability接收合同。 |
| 同步与异步怎样区分？ | 管理/协议验证可即时返回，owner结果/外部效果/consumer接受可异步或unknown；query为只读，不能一次success替代全部结果。 |
| 哪些输入，哪些输出？ | 平台来源、已提交source、当前basis/material/secret资格为输入；局部结果、owner交接/动作、安全平台表达及body-free审计handoff为输出，owner结果仍ref。 |
| 核心与外围如何判定？ | 11接口均保护五核心节点，UI美化/批量配置候选不生成当前接口，缺owner合同不新增泛用提交/认证能力。 |
| 哪些来自三类全局依赖？ | Core/选定SDK包为compile candidate；领域/平台/secret为runtime；采用Bus的正式source/consumer为event。webhook事件输入类型不自动成为Bus关系。 |
| 分别服务哪些FR？ | IF001->001~003；002->004/006；003->005；004->007/009；005->007~009；006->010；007->011；008->012/013；009->012/014；010->015；011->016。 |
| 有无无功能来源接口？ | 无；§7.1每项明示FR，未选provider不作为新接口owner或认证中心。 |
| 有无外部协作未被依赖承接？ | 既有FR协作有Step6及DEP001~010承接；human责任/安全材料/owner result/probe具体合同尚未闭合是BR-UP，不伪装可调用provider。 |

## 4. 诊断

旧00 §10.1以固定Python/TS SDK、RPC/stream/query服务和SLA表达依赖，不能证明能力合同或可部署资格；Identity mapping context不能被扩读为human认证，draft的Workspace授权owner候选与正式只读边界冲突。本Step不填缺失provider名字，不把Governance当统一认证中心。

后置差异：旧§10.1的固定SDK/RPC/SLA后移或废弃为未选seam；旧§10内部/外部消费主题保留但按能力接口与compile/runtime/event分类。没有从旧方法名/表字段反推新接口，正式§12不新增API/DTO/port。

## 5. 前后对比

具体SDK方法 -> 能力级输入输出；服务清单 -> 依赖语义；单次响应=最终成功 -> 同步确认/异步owner与平台结果分开。

## 6. 取舍与复杂度

采用两规范表与一交互姿态表；11接口均来自FR，10边界保Step6compile/runtime/event判断。不采用伪造事件名、API签名或包依赖。单文件分批足够；图只引用Step6，不新造时序图。

## 7. 结构化中间产物

### 7.1 对外能力接口

| 接口类型 | 名称 | 说明 | 所属能力层级 |
|---|---|---|---|
| 变更接口 | IF-BR-001 受权接入与关系管理 | C1配置、绑定与映射的显式受权变更；FR-BR-001~003 | 核心闭环能力 |
| 事件输入 | IF-BR-002 可信外部协作来源 | C2接收平台来源并解释消息变化；FR-BR-004、006 | 核心闭环能力 |
| 变更接口 | IF-BR-003 合规入站owner交接 | C2把已获准来源交接正式对话边界并保独立结果；FR-BR-005 | 核心闭环能力 |
| 事件输入 | IF-BR-004 已提交协作来源消费 | C3只消费committed且可外显的正式变化；FR-BR-007、009 | 核心闭环能力 |
| 变更接口 | IF-BR-005 受权外部交付 | C3组织允许表达、附件引用与投递局部结果；FR-BR-007~009 | 核心闭环能力 |
| 事件输入 | IF-BR-006 可信平台交互来源 | C4消费并验证受绑定交互；FR-BR-010 | 核心闭环能力 |
| 变更接口 | IF-BR-007 已验证动作责任交接 | C4将允许动作交给owner，不形成私有审批；FR-BR-011 | 核心闭环能力 |
| 后台任务接口 | IF-BR-008 受控等待与续交 | C5仅在已证明可继续的情况下受序/限流约束续交；FR-BR-012、013 | 核心闭环能力 |
| 变更接口 | IF-BR-009 受权恢复与对账 | C5按正式来源和basis修局部状态；FR-BR-012、014 | 核心闭环能力 |
| 事件输出 | IF-BR-010 安全审计材料交接 | C5提供body-free可追溯输出并区分consumer结果；FR-BR-015 | 核心闭环能力 |
| 查询接口 | IF-BR-011 局部状态安全读取 | C5查询授权范围的接入、映射、交付和恢复状态；FR-BR-016 | 核心闭环能力 |

C1到C5逐组自检：变更与查询分离，接口不复制owner职责；safe状态查询只定义一次供各节点复用。类型名描述能力，不锁传输或实现协议。

### 7.2 外部依赖边界

| 依赖方向 | 依赖类型 | 关联方 | 全局依赖类型 | 说明 | 所属能力层级 |
|---|---|---|---|---|---|
| 输入 | 定义来源依赖 | L0-core / L0-sdk | 编译期候选/运行期 | DEP-BR-001 共享引用与正式客户端兼容；FR-BR-001~016 | 核心闭环能力 |
| 输入/输出 | 外部能力依赖 | L1-conversation | 运行期/事件协作 | DEP-BR-002 受权对话目标、safe材料、正式交接与已提交结果；FR-BR-003~007、009、014 | 核心闭环能力 |
| 输入 | 外部能力依赖 | L1-identity | 运行期/事件协作 | DEP-BR-003 AI身份安全锚点，不提供任意human认证；FR-BR-002、003、010、011 | 核心闭环能力 |
| 输入 | 治理结论依赖 | L1-governance | 运行期/事件协作 | DEP-BR-004 当前Policy/Gate、外显与责任动作依据；FR-BR-002、005、007、010、011、014 | 核心闭环能力 |
| 输入 | 外部能力依赖 | L1-artifact | 运行期/事件协作 | DEP-BR-005 附件准入、授权访问与传播ref；FR-BR-005、008、014 | 核心闭环能力 |
| 输入 | 外部能力依赖 | L1-workspace | 运行期/事件协作 | DEP-BR-006 带owner provenance的只读语境，不代替授权；FR-BR-003、007、016 | 核心闭环能力 |
| 输入 | 外部能力依赖 | 获授权secret resolver（provider未选） | 运行期 | DEP-BR-007 opaque ref版本、有效性与private解析；FR-BR-001、004、009、010、014 | 核心闭环能力 |
| 输入/输出 | 外部能力依赖 | Slack/Mattermost/Telegram/Discord | 运行期 | DEP-BR-008 分安装的平台来源/效果/capability，正文不作本仓truth；FR-BR-001、003、004、006~010、012~014 | 核心闭环能力 |
| 输入/输出 | 外部能力依赖 | L0-bus | 事件协作（条件分支） | DEP-BR-009 已选正式事件输入输出载体，不拥有业务接纳；FR-BR-004、005、007、012、015 | 核心闭环能力 |
| 输出 | 下游消费依赖 | L4-observability | 运行期/事件协作 | DEP-BR-010 安全审计交接与真实disposition；FR-BR-015、016 | 核心闭环能力 |

internal human actor认证/责任依据与safe projection material来源未统一闭合，仍BR-UP-001/002/003。不得用Identity、Governance、Workspace或SDK占位模拟统一provider；缺失的正向路径blocked。条件分支的缺失不授权fallback到其他target或公开材料。

### 7.3 同步/异步姿态

| 能力边界 | 可见姿态 | 不允许的语义 |
|---|---|---|
| 接入管理 | 明确局部变更结果或waiting/blocked | 配置接受冒称平台安装完成 |
| 平台接收/交互验证 | 按平台合同即时或允许的deferred确认 | 协议ACK代替owner结果 |
| owner交接/外部交付 | 结果可同步或异步返回；pending/unknown保持可解释 | 超时自动视失败、内部接受自动视送达 |
| 续交/恢复/审计 | 显式受权后台或管理变更及独立消费结果 | “后台”绕授权/限流或重造effect |
| 安全状态查询 | 只读返回局部状态或denied/unavailable | 查询附带refresh、repair、replay或owner写入 |

跨接口审计：11接口/10依赖均有FR来源，runtime/event与Step6一致；无API、DTO、port名、业务crate依赖或新调用图。

## 8. 回填草稿

正式§12采用§7.1~7.3能力结论；图只延伸阅读Step6裁剪图，不新增协议图。

## 9. 待确认

BR-UP-001~009逐分支仍open；internalhuman主体provider与安全投影owner/读取面不完整，不伪装可调用接口。

## 10. 进入下一步条件

自检：11能力接口、10依赖与姿态表齐全，五组及跨接口审计完成；owner-neutral缺口与三类全局依赖保持一致。允许Step13。

Step17补审自检：十问题逐项、旧§10.1位置和不允许的扩读明确；11IF/10DEP及下游编号/类型/映射未变，正式回填资格仍由Step17三层门禁核验。

```text
gate_status = pass
next_allowed_action = read_step_13_then_quality_constraints
commit_required = false
```
