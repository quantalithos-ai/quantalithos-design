# L6-bridges 01 Step 9：关键交互与通信方式

> full-restart；done / pass；正式01不写。

## 1. 状态与 Step 内计划

开工：Step4、Step6、Step8 pass；已读架构SOP Step9、规范§4.10，以及Step4系统上下文、Step6运行承载、Step8数据边界。先回答通信方式问题，再按U1~U6逐个定义同步、异步、后台、补偿和失败降级，单元停审后做跨交互审计；不写API路径、事件名、DTO、schema、时序或具体技术选型。

| 单元 | 思考 | 写入 | 交互方式停审 | gate_status / 下一动作 |
|---|---|---|---|---|
| U1 受权绑定与映射 | done | done | done | pass / U1_interaction_stopped |
| U2 入站交接 | done | done | done | pass / U2_interaction_stopped |
| U3 安全外显与交付 | done | done | done | pass / U3_interaction_stopped |
| U4 交互责任 | done | done | done | pass / U4_interaction_stopped |
| U5 连续性与恢复支撑 | done | done | done | pass / U5_interaction_stopped |
| U6 安全读取与追溯支撑 | done | done | done | pass / U6_interaction_stopped |

## 2. 输入与范围

| 输入 | 本步承接 | 不重新定义 |
|---|---|---|
| Step4 系统上下文 | Conversation、Identity、Governance、Artifact、Workspace、Observability、四平台、secret seam、Bus 的正式边界 | 不新增上下文、入口或owner |
| Step6 容器/部署 | 入口承接、外部连接、后台推进、局部存储和观察交接的运行角色 | 不把运行单元写成协议或代码模块 |
| Step8 数据/一致性 | 本地relation/mapping/cursor/intent/receipt/handoff truth，owner/platform/ref 的最终一致与unknown | 不改写数据归属、事务实现或表结构 |
| 00需求与平台附录 | inbound/outbound/callback/recovery 的阶段分离、来源资格、限流/版本/secret红线 | 不把公开来源当已安装能力，不承诺四平台等价 |

本步只回答“正式边界上的关键交互适合哪类通信方式，以及未达成时如何解释”。同步请求/响应、异步事件/回调、后台任务/延后承接是架构类别，不是已选择的HTTP、SDK、消息中间件或平台产品。

## 3. SOP逐项问题回答

| 问题 | 回答 |
|---|---|
| 哪些交互值得进入本章？ | 受权绑定管理、平台来源接收、owner事实交接、安全外显投递、交互动作责任交接、恢复/对账和安全观察交接；它们分别有不同的结果owner和失败语义。 |
| 哪些适合同步？ | 需要在当前正式边界即时判断资格、验证、读取或明确拒绝的请求；同步返回只证明该边界的阶段结果，不证明另一owner的事实。 |
| 哪些适合异步？ | 外部来源、owner结果、平台效果观察和观察消费者状态变化；它们是已成立或待消费的事实传播，不应伪装成当前调用闭环。 |
| 哪些适合后台任务？ | 限流等待、延后投递、材料重解析、cursor/gap对账、局部视图重建和受权恢复；它们不应让同步入口提前宣称完成。 |
| 哪些必须经过正式边界？ | 平台与adapter、Bridges与Conversation/Identity/Governance/Artifact/Workspace/Observability、secret/private seam、Bus和恢复维护入口；禁止读写相邻owner内部存储。 |
| 关键失效如何降级？ | 缺授权/材料/能力时fail-closed或blocked；owner/platform结果未知时保留indeterminate；缺可比位置进入gap；只在同一operation/effect和有权威依据时对账，不换target或新造正文。 |
| 哪些口径最易误入协议细节？ | 传输ACK、owner accepted、platform accepted、外部receipt、consumer disposition；每一项都只表示自己的阶段，不以状态标签替代协议或业务事实。 |
| 每单元是否逐项停审？ | 是。每单元均有场景表、方式判断表和停审结论，审查数据所有权、正式边界、失败降级和协议下沉四项。 |
| 完成后如何审计？ | 检查同步/异步冲突、直接穿透、时序/接口/schema下沉、unknown/gap/限流覆盖、secret/body泄露和后续02/03/04承接缺口。 |

## 4. 当前材料诊断与取舍

旧 `01-架构设计.md` 将 webhook、队列、SDK 和内部模块混成通信结论，容易把传输确认当业务完成，也没有区分入站owner接纳、外部送达和观察消费。若按四个平台各画一套链路，会重复U1授权、U5连续性和U6安全材料规则；若把所有操作做成同步调用，又无法表达平台回调、限流和未知效果。当前采用“边界场景表 + 通信方式判断表 + 单元停审”的结构：同步只收口即时资格/读取，异步传播正式阶段变化，后台承接延后工作，补偿仅在原operation/effect和权威依据下修正本仓局部状态。

不采用以下口径：

- 不以平台ACK、HTTP成功或callback响应代替Conversation接纳、Gate/Decision、外部送达或Observability消费。
- 不以后台任务的排队或领取代替完成，不以超时/lease失效证明外部无效果。
- 不用直接共享owner数据库、跨单元裸cursor、自动换target或复制原消息正文来补偿通信失败。

## 5. 统一通信和失败边界

| 阶段结果 | 可由当前交互证明 | 不可由当前交互证明 | 失败姿态 |
|---|---|---|---|
| transport/入口确认 | 来源已到达某一受控边界，或验证结果可表达 | owner已接纳、内部Turn已提交、平台已送达 | 明确拒绝、待处理或保留可恢复ref；无安全接管则不声称可靠接收 |
| owner handoff / accepted | owner边界返回的正式交接结果 | 平台ACK、Bridges本地disposition或消息映射本身 | accepted/rejected/pending/unknown分开；unknown按原operation对账 |
| platform effect / receipt | 平台返回的已知业务结果和外部locator（若有） | 内部source提交、用户已读、consumer接受 | known rejection、indeterminate和已知成功分开；未知不盲重发 |
| consumer handoff | 观察消费者真实返回的接受/拒绝/未知 | 本仓trace、attempt或handoff准备 | 强制准入不足限制相应操作，有限安全backlog等待，不伪造evidence |
| recovery/rebuild | 本仓局部mapping/cursor/disposition被有权威依据修正 | owner/platform truth被重建或正文被恢复 | gap/blocked/missing_source/manual保留，查询不触发副作用 |

## 6. 简化交互示意图

#### 简化交互示意图: 通信类别与阶段边界

```text
 +-------------------+      async source / effect      +----------------------+
 | External platform | <-----------------------------> | typed adapter seam   |
 +-------------------+                                 +----------+-----------+
                                                                  |
                                       qualification / handoff    |
                                                                  v
 +-------------------+     owner result / source facts +----------------------+
 | Internal owners   | <-----------------------------> | Bridges local state  |
 | Conversation etc. |                                 | relation/effect      |
 +-------------------+                                 +----+------------+----+
                                                            |            |
                                     background reconcile   |            | safe handoff
                                                            v            v
                                                     +----------+  +--------------+
                                                     | U5/U6    |  | Observability|
                                                     | recovery |  | consumer     |
                                                     +----------+  +--------------+
```

图示说明：

- 图只标出边界类别，不表示具体协议、事件名、调用顺序或部署拓扑。
- 同步资格/读取不会替代异步owner或平台结果；后台恢复只能回写Bridges局部状态。
- 外部平台与内部owner均通过正式adapter/handoff边界接入，禁止直接共享存储。

## 7. 逐架构单元交互校准

### 7.1 U1 受权绑定与映射

#### 思考、诊断与取舍

U1的同步交互只用于绑定管理、当前资格和映射状态的即时判断；安装、basis、secret或能力发生变化时，变化本身由异步边界传播，不能由一次管理读取永久证明。能力/映射刷新和撤销竞争需要后台承接，但后台不能把旧generation静默改成新target。若来源版本不可比、权限被撤销或同键语义冲突，补偿只能停止相应排队操作并等待权威重建，不回写平台或owner真相。

旧材料把“配置成功”当作“已安装且可用”，并以显示名或裸external ID刷新映射；这会把管理同步结果误当授权事实。当前采用安装scope、binding generation、typed target和basis/version作为边界判据，所有平台与owner变化都经adapter或正式引用边界进入。

#### 关键交互场景表

| 交互场景 | 交互边界 | 交互目的 | 边界说明 |
|---|---|---|---|
| 受权绑定管理与当前资格判断 | 绑定管理入口与U1局部关系边界 | 即时判断配置、安装、basis、secret引用和目标是否足以接受变更 | 这是正式状态判断，不是平台安装流程或内部权限表操作。 |
| 安装、授权或能力变化传播 | 平台/owner/secret seam与U1边界 | 将已知变化带入相应installation和binding generation | 这是事实变化传播，不应由一次同步查询伪装为永久有效。 |
| 映射和能力安全摘要刷新 | U1与正式外部查询/引用边界 | 延后收敛版本、kind、scope和能力摘要 | 允许后台承接，但摘要不升级为平台或owner truth。 |
| 撤销与generation冲突收口 | U1局部恢复边界 | 停止旧代际的待执行操作并形成可追溯局部结果 | 补偿只修本地关系、队列门禁或gap，不换target、不重写历史效果。 |

#### 通信方式判断表

| 交互场景 | 推荐通信方式 | 不宜采用的方式 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 受权绑定管理与当前资格判断 | 同步请求 / 响应类交互 | 不宜只排后台任务后立即报告激活 | 明确拒绝或waiting/blocked，不把配置接受写成平台可用 | 需要即时返回局部资格和缺失依据。 |
| 安装、授权或能力变化传播 | 异步事件 / 回调类交互 | 不宜以同步长调用作为唯一事实入口 | 变化缺失或版本不可比时保留stale/gap并暂停受影响操作 | 变化由相应owner/平台边界产生，本仓只消费安全摘要。 |
| 映射和能力安全摘要刷新 | 后台任务 / 延后承接类交互 | 不宜由读取请求隐式刷新或阻塞所有主路径 | 无权威来源则保持旧摘要并标记waiting，不猜显示名/裸ID | 延后刷新不改变关系授权本身。 |
| 撤销与generation冲突收口 | 后台任务 / 延后承接类交互 | 不宜同步强行覆盖旧关系或切换target | 立即阻新派发，冲突隔离，等待显式新basis或人工对账 | 补偿的对象是U1局部门禁和关系状态。 |

#### U1交互方式停审

| 检查项 | 结论 |
|---|---|
| 与数据所有权一致 | 同步只读/写局部relation；异步输入是owner/platform变化；后台不写外部truth。 |
| 正式边界 | 所有安装、能力、secret和basis均经正式seam；无平台SDK或内部表穿透核心。 |
| 失败降级 | 缺basis、版本、secret或comparator时waiting/blocked/gap；撤销不被重试或fallback掩盖。 |
| 协议粒度 | 未写平台接口、事件名、字段、时序或SDK选择。 |

停审结论：`pass`。U1通信方式与binding generation、局部强一致和外部最终一致相容；允许进入U2，不把能力快照当授权truth。

### 7.2 U2 入站交接

#### 思考、诊断与取舍

外部消息或变化抵达是异步来源；平台要求的入口确认可以同步收口，但只能说明验证/接收阶段，不说明Conversation接纳或内部Turn提交。经验证的source交给正式owner时，若owner合同提供即时结果，可在同步边界返回accepted/rejected/pending；若结果稍后成立，则以异步结果传播表达，二者均不改变本仓不拥有Turn/body的边界。材料解析、变化补齐、线程差异和gap对账必须后台承接，补偿始终回到原operation、mapping和source version。

旧材料以“收到即写入本地消息”或“ACK后后台补正文”解决时限，无法证明可恢复接管，也会把transport结果变成业务事实。当前只保留验证后的安全source/material ref、target mode和owner result ref；缺ref、actor、digest或映射时拒绝、隔离或indeterminate。

#### 关键交互场景表

| 交互场景 | 交互边界 | 交互目的 | 边界说明 |
|---|---|---|---|
| 外部来源验证与入口确认 | 平台adapter与U2入站边界 | 判断来源是否可被本仓受理，并返回该阶段的明确结果 | 入口确认不是内部提交，也不拥有平台消息正文。 |
| 已验证来源的owner事实交接 | U2与Conversation正式交接边界 | 将允许的source ref、target mode和责任语义交给owner | 交互目的为owner接纳或拒绝，不是Bridges创建Turn。 |
| owner结果或变化回送 | Conversation owner与U2边界 | 传播正式accepted/ref、拒绝、待定或未知 | 结果归owner；本仓只保存安全引用和局部disposition。 |
| 变化、线程或材料缺口对账 | U2与后台恢复/正式查询边界 | 延后处理edit/delete/thread差异、gap和可重解析材料 | 补偿不得缓存正文、默换普通消息或删除内部truth。 |

#### 通信方式判断表

| 交互场景 | 推荐通信方式 | 不宜采用的方式 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 外部来源验证与入口确认 | 异步事件 / 回调类交互，并在入口边界同步返回阶段结果 | 不宜把同步响应写成owner accepted或Turn已提交 | 验证失败明确拒绝；无法安全接管则保留有限ref或indeterminate，不落raw body | 来源天然由平台变化驱动，确认只是transport阶段。 |
| 已验证来源的owner事实交接 | 同步请求 / 响应类交互（仅在owner合同可即时收口时） | 不宜让平台入口等待不定时后台结果并宣称成功 | owner pending/unknown单独保留；无actor/target/material合同则blocked | 同步边界服务于明确的owner disposition，不创建内部truth。 |
| owner结果或变化回送 | 异步事件 / 回调类交互 | 不宜以本地轮询或入口ACK冒充正式结果 | 结果未到达保持pending/indeterminate，按原operation对账 | 结果传播和来源接收是两个阶段。 |
| 变化、线程或材料缺口对账 | 后台任务 / 延后承接类交互 | 不宜同步补正文、重建缺映射或自动换频道 | gap/quarantine/missing_source保留；仅在权威覆盖后收口 | 后台只修本地映射/位置/交接状态。 |

#### U2交互方式停审

| 检查项 | 结论 |
|---|---|
| 与数据所有权一致 | 原始平台body只瞬时验证；owner结果以ref进入；ACK、accepted和Turn保持分离。 |
| 正式边界 | 平台adapter、Conversation交接和Artifact/material ref均为正式边界；不读写owner内部表。 |
| 失败降级 | 伪造、过期、回环、缺mapping、缺材料、未知结果分别拒绝、隔离、gap或indeterminate。 |
| 协议粒度 | 未列回调名称、payload、响应码、事件schema或时序实现。 |

停审结论：`pass`。U2的同步入口结果、异步owner结果和后台gap处理不互相升级；允许进入U3。

### 7.3 U3 安全外显与交付

#### 思考、诊断与取舍

U3需要同步读取当前binding、visibility、Policy/Gate适用性、允许projection和附件ref，才能决定是否形成delivery intent；真正的平台效果和receipt属于异步结果，限流、延后派发和未知效果对账属于后台任务。补偿必须保持原stable effect identity，只有权威证明无副作用或同effect探测结果允许继续收口；内部已提交不等于外部送达，平台已接受不等于已读。

旧材料把“发送请求返回成功”视为完成，并用跨频道fallback、永久附件链接或新投递掩盖未知效果。当前采用同步准入、异步效果、后台推进和受控对账四段分离；敏感Gate正文、消息/附件body、tokenized URL和secret不进入持久化通信记录或安全观察。获准消息/附件材料仅经正式边界瞬时转换；敏感Gate正文仍禁止外显，私有值只在private seam使用。

#### 关键交互场景表

| 交互场景 | 交互边界 | 交互目的 | 边界说明 |
|---|---|---|---|
| 外显资格与安全材料预检 | U3与Conversation/Governance/Artifact/Identity正式边界 | 即时判断source、目标、visibility、Policy/Gate和材料ref是否允许形成intent | 预检是资格判断，不是平台投递或owner授权替代。 |
| 已获准表达的外部效果观察 | U3与平台adapter边界 | 将外部已知结果和locator回送到局部effect记录 | 平台效果是平台侧观察，不等内部提交、读达或consumer接受。 |
| 限流等待与延后派发 | U3与后台承接/平台能力边界 | 在当前授权、lane、预算和能力有效时推进intent | 不适合当前同步边界即时收口，不应先宣称成功。 |
| 超时、崩溃或未知效果对账 | U3与U5恢复/平台权威查询边界 | 对原effect做已知结果收口或保持indeterminate | 补偿不能新建effect、换target、重发正文或绕过撤销。 |

#### 通信方式判断表

| 交互场景 | 推荐通信方式 | 不宜采用的方式 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 外显资格与安全材料预检 | 同步请求 / 响应类交互 | 不宜排队后默认形成intent或把旧快照当当前授权 | 缺任何必要basis/material/capability则blocked或拒绝 | 需要当前边界即时作出可解释资格判断。 |
| 已获准表达的外部效果观察 | 异步事件 / 回调类交互 | 不宜把内部提交同步返回当平台效果 | known result、known rejection、indeterminate分开；未知不改名成功/失败 | 外部效果由平台边界异步观察。 |
| 限流等待与延后派发 | 后台任务 / 延后承接类交互 | 不宜让同步入口等待不确定的外部预算 | 按平台真实等待下界、授权和预算挂起；超预算转manual | 后台推进服务于原intent，不产生新业务语义。 |
| 超时、崩溃或未知效果对账 | 后台任务 / 延后承接类交互 | 不宜盲重试、换target或用lease失效证明无效果 | 仅权威probe/同effect结果可finalize；否则indeterminate/manual | 补偿只修改本地attempt/receipt/gap。 |

#### U3交互方式停审

| 检查项 | 结论 |
|---|---|
| 与数据所有权一致 | intent/attempt/known receipt为本仓局部truth；source、projection、Artifact和治理依据为ref。 |
| 正式边界 | 派发前经owner/治理/材料边界，平台效果经adapter；不以平台消息查询替代授权。 |
| 失败降级 | 材料/授权缺失blocked；限流延后；unknown保留；敏感内容不以低敏感或永久链接降级。 |
| 协议粒度 | 未写平台发送接口、业务响应格式、附件上传步骤或重试参数。 |

停审结论：`pass`。U3同步准入、异步效果和后台恢复严格分层；允许进入U4。

### 7.4 U4 交互责任

#### 思考、诊断与取舍

U4的入口验证和平台响应可以同步完成，但只能证明interaction在当前安装、actor、source、target、action和有效期下通过边界检查。正式Gate/Decision或其他owner动作结果由owner交接和异步回送形成；过期、重放、跨主体或撤销后的交互只能拒绝或回显既有可见结果。后台负责失效交互清理、重复对账和unknown处理，不延长私有token、不直接批准动作。

旧材料把签名、按钮或管理员身份等同审批权限，还把callback响应或deferred标志当Decision。当前将验证、责任和owner action三者分离，private context、response URL、interaction token只在私有seam瞬时使用。

#### 关键交互场景表

| 交互场景 | 交互边界 | 交互目的 | 边界说明 |
|---|---|---|---|
| 交互来源验证与阶段响应 | 平台interaction入口与U4边界 | 即时判断签名/时效/绑定和重放状态，并返回该阶段结果 | 验证结果不等内部action获准，也不拥有Gate/Decision。 |
| 受权动作的owner责任交接 | U4与Governance/正式动作owner边界 | 将已验证的actor、target、action和当前依据交给owner | U4不执行Runtime/Tools、不写Decision。 |
| owner动作结果回送 | owner边界与U4/外显边界 | 传播正式accepted/rejected/pending/unknown结果 | 平台响应或本地handoff不替代owner结果。 |
| 过期、重放和unknown交互对账 | U4与后台恢复/只读边界 | 收口局部验证状态并按当前可见性解释既有结果 | 不延长token、不换actor/target、不生成第二次效果。 |

#### 通信方式判断表

| 交互场景 | 推荐通信方式 | 不宜采用的方式 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 交互来源验证与阶段响应 | 同步请求 / 响应类交互 | 不宜先接受后异步决定是否验证 | invalid/expired/replayed/cross-target明确拒绝；缺验证材料不执行 | 平台需要即时得到入口阶段结果，但不含owner决定。 |
| 受权动作的owner责任交接 | 异步事件 / 回调类交互 | 不宜回调入口直接批准或同步假定Decision | owner未确认保持pending/unknown；资格失效则blocked | 动作责任属于owner，U4只传递绑定关系。 |
| owner动作结果回送 | 异步事件 / 回调类交互 | 不宜以deferred/本地ACK代替正式结果 | 仅记录真实结果ref；unknown按原interaction对账 | 结果传播和平台响应时间窗是不同边界。 |
| 过期、重放和unknown交互对账 | 后台任务 / 延后承接类交互 | 不宜在查询时隐式修复或延长私有上下文 | 保持拒绝/indeterminate，必要时人工对账；只修局部验证状态 | 补偿不产生owner action。 |

#### U4交互方式停审

| 检查项 | 结论 |
|---|---|
| 与数据所有权一致 | U4只拥有验证/重放记录，owner action/Gate/Decision为引用；平台响应不升级为owner结果。 |
| 正式边界 | 私有验证seam、Identity AI锚点、待确认的正式human责任owner ref和Governance action边界分离；不调用内部执行能力。 |
| 失败降级 | invalid/expired/replayed/cross-target拒绝；owner unknown保留；只读遵当前可见性。 |
| 协议粒度 | 未写签名头、token字段、响应URL、按钮命令或动作API。 |

停审结论：`pass`。U4同步验证、异步责任交接和后台对账没有把平台交互当审批；允许进入U5。

### 7.5 U5 连续性与恢复支撑

#### 思考、诊断与取舍

U5的同步交互只允许有明确授权、范围和权威查询依据的状态判断或维护请求；平台/owner结果变化仍通过异步传播进入。retry、限流等待、cursor/gap重建和recovery-handoff由后台任务承接。补偿必须在原namespace、operation、effect、stream/epoch和比较器仍可解释时执行；窗口过期、epoch不可比、lease崩溃或外部结果未知时保持indeterminate/manual，不以再次发送抹平未知。

旧材料把统一重试库、时间戳或HTTP结果当作全平台连续性，甚至用查询触发修复。当前把protocol、owner、effect位置分开，U5只修本仓局部状态，不推进未覆盖cursor或改外部事实。

#### 关键交互场景表

| 交互场景 | 交互边界 | 交互目的 | 边界说明 |
|---|---|---|---|
| 有权威依据的状态探测与维护判断 | U5与平台/owner正式查询边界 | 即时判断某一原operation/effect/gap是否已有可用结果 | 只读探测需显式范围和资格，不是全局刷新或自动修复。 |
| owner/platform结果变化传播 | 外部owner/平台与U5边界 | 将已知结果、位置或能力变化带入对应namespace | session/epoch和平台流不能跨流或跨安装混用。 |
| 限流等待、重试和位置重建 | U5与后台承接边界 | 在授权、比较器、预算和顺序成立时延后推进 | 任务领取、lease或队列状态不等外部效果完成。 |
| gap/unknown/recovery-handoff对账 | U5与恢复维护者/正式查询边界 | 用权威覆盖、同effect结果或人工决定收口本地缺口 | 无依据保持gap/blocked/manual，不生成替代正文或新effect。 |

#### 通信方式判断表

| 交互场景 | 推荐通信方式 | 不宜采用的方式 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 有权威依据的状态探测与维护判断 | 同步请求 / 响应类交互 | 不宜由普通读取隐式触发恢复或把缓存当权威 | 无scope、probe或结果依据返回unavailable/indeterminate，不推进状态 | 同步只用于边界内明确状态判断。 |
| owner/platform结果变化传播 | 异步事件 / 回调类交互 | 不宜以本地时间、全局cursor或共享ACK代替来源 | 缺正式comparator/epoch进入gap；结果未知保留 | 变化的权威仍在owner/platform。 |
| 限流等待、重试和位置重建 | 后台任务 / 延后承接类交互 | 不宜在同步入口阻塞或按统一常量重试 | 遵平台真实等待下界和预算；未知/超预算转manual | 后台任务只处理本仓已知的continuity guard。 |
| gap/unknown/recovery-handoff对账 | 后台任务 / 延后承接类交互 | 不宜盲发、跨namespace重放或自动关闭gap | 只在覆盖依据成立时finalize；否则blocked/gap/manual | 补偿不反写owner/platform truth。 |

#### U5交互方式停审

| 检查项 | 结论 |
|---|---|
| 与数据所有权一致 | U5拥有去重、cursor、gap、预算和局部恢复记录；operation/effect结果仍归相应owner/platform。 |
| 正式边界 | probe、owner结果、平台能力和恢复维护入口均有正式资格；不把总线ACK或时间戳当业务水位。 |
| 失败降级 | 不可比、窗口过期、lease失效、崩溃和unknown均保守停留；只有权威依据才收口。 |
| 协议粒度 | 未写比较器编码、队列实现、重试库、锁或具体限流参数。 |

停审结论：`pass`。U5后台补偿不把未知变成失败或成功，也不越权推进owner/platform事实；允许进入U6。

### 7.6 U6 安全读取与追溯支撑

#### 思考、诊断与取舍

U6的安全读取需要同步返回当前scope/visibility下的body-free局部状态，但不刷新source、修mapping、推进cursor或触发replay。安全handoff和consumer disposition属于异步边界；局部view重建、有限backlog和观察缺口由后台承接。若consumer未知、准入失效或保留窗口不足，补偿只能限制相应操作、保留handoff/gap并等待正式状态，不制造evidence/report/verdict。

旧材料把日志、trace或report路径当作真实审计，并让读取顺手修复或拉取正文。当前只交接安全ref、版本、阶段、有限reason和handoff ref；raw消息/附件、secret、私有URL、敏感审批正文和未获准存在性在所有出口禁止。

#### 关键交互场景表

| 交互场景 | 交互边界 | 交互目的 | 边界说明 |
|---|---|---|---|
| 受权安全读取与局部解释 | U6只读边界与受权调用方/Workspace视图 | 即时返回当前可见的body-free局部状态 | denied、unavailable和空结果要区分；读取不产生维护副作用。 |
| 安全观察材料交接 | U6与Observability正式handoff边界 | 传播可消费的安全ref、阶段和有限reason | 本地handoff不等consumer接受、evidence或verdict。 |
| 局部view/安全handoff backlog重建 | U6与后台承接边界 | 延后重建由本仓truth派生的视图或有限交接索引 | 重建不读取或保存禁止正文，不反写owner truth。 |
| consumer未知、准入或保留缺口对账 | U6与Observability/维护者边界 | 限制受影响操作并等待真实consumer状态或预算 | 补偿只能修handoff/gap/局部view，不伪造接受、报告或ready。 |

#### 通信方式判断表

| 交互场景 | 推荐通信方式 | 不宜采用的方式 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 受权安全读取与局部解释 | 同步请求 / 响应类交互 | 不宜读取时刷新来源、修mapping或触发重放 | scope/visibility不足返回denied/unavailable；不以隐藏count替代 | 读取需要即时且可解释，但保持no-write。 |
| 安全观察材料交接 | 异步事件 / 回调类交互 | 不宜同步返回本地handoff就宣称consumer接受 | consumer pending/unknown保持原阶段，强制准入不足限制相应操作 | 观察消费者有独立生命周期和结果owner。 |
| 局部view/安全handoff backlog重建 | 后台任务 / 延后承接类交互 | 不宜在查询路径隐式重建或保存raw材料 | 只从局部truth重建；缺source/ref进入waiting/blocked | 后台负责可重建projection，不创造业务事实。 |
| consumer未知、准入或保留缺口对账 | 后台任务 / 延后承接类交互 | 不宜用本地trace、报告路径或静态扫描代替真实接受 | 保留unknown/gap，按预算等待或人工处理；不出具evidence/verdict | 补偿保护真实阶段和安全出口。 |

#### U6交互方式停审

| 检查项 | 结论 |
|---|---|
| 与数据所有权一致 | U6拥有body-free局部trace/handoff/view；Observability consumer/evidence/report为外部结果。 |
| 正式边界 | 读取、handoff、Workspace条件分支和Observability接收均有scope/provenance；不共享日志或正文存储。 |
| 失败降级 | denied/unavailable、pending/unknown、gap和准入不足均可见且不升级；强制准入不足限制相应变更。 |
| 协议粒度 | 未写日志字段、指标名、报告格式、消费API或脱敏实现。 |

停审结论：`pass`。U6同步读取、异步观察交接和后台重建保持no-write与body-free边界；六单元逐项完成。

## 8. 跨交互边界审计

### 8.1 同步/异步/后台选择审计

| 审计面 | 结果 |
|---|---|
| 同步结果升级 | 没有把U1资格、U2入口ACK、U4验证响应或U6读取结果升级为owner接纳、Decision、平台效果或consumer接受。 |
| 异步结果伪装 | U2 owner结果、U3平台效果、U4 owner动作和U6 consumer disposition均保留独立阶段；未用本地handoff或transport回调填充另一owner结果。 |
| 后台提前完成 | U1刷新、U2缺口对账、U3限流/未知恢复、U4过期清理、U5 continuity、U6 view/handoff重建均不得由排队/领取宣称完成。 |
| 补偿越权 | 补偿只修改Bridges局部relation/mapping/cursor/intent/attempt/receipt/handoff；不创建Turn、Decision、Artifact、平台消息或Observability证据。 |

### 8.2 正式边界与依赖方向审计

| 审计面 | 结果 |
|---|---|
| 平台边界 | 四平台仅经各自adapter/config/secret seam；不把平台SDK或统一ACK直接放入核心语义。 |
| owner边界 | Conversation、Identity、Governance、Artifact、Workspace、Observability均通过正式交接/ref/query边界；无内部表穿透或共享事务。 |
| 总线边界 | Bus若被选用只传输正式材料，不拥有业务接纳、效果、cursor或consumer truth；transport结果单列。 |
| 反向依赖 | core语义不依赖平台/provider实现；U5/U6支撑不反向决定授权、owner结果或平台能力。 |

### 8.3 失败、恢复与安全材料审计

| 审计面 | 结果 |
|---|---|
| unknown | timeout、lease失效、崩溃、owner/平台未返回和consumer未确认均保indeterminate/pending，不盲重试或换目标。 |
| gap/incomparable | 缺mapping、跨epoch、缺comparator、变化不可比进入gap/quarantine/manual；无权威覆盖不标complete。 |
| 限流 | 限流等待只由后台承接，遵真实安装/方法/资源/全局能力与预算；不声明一个跨平台常量。 |
| secret/private seam | raw secret、OAuth code、token、私有callback/response URL只在私有接缝瞬时使用，不进入intent/receipt/log/trace/handoff/evidence。 |
| body/敏感Gate | 平台消息、附件正文、敏感审批正文、未获准存在性和可还原派生均不进入durable、观察、证据或恢复材料。 |
| 读取副作用 | U6查询及安全观察读取不refresh、repair、推进cursor、replay或改变owner事实。 |

### 8.4 后续详细设计承接审计

| 需在后续文档闭合 | 本步留下的架构约束 | 未在本步伪造 |
|---|---|---|
| 02概要设计 | 各边界需保持阶段结果分离，并把同步/异步/后台关系转成组件责任轮廓 | 不写接口清单、事件目录或组件实现 |
| 03详细设计 | 需为每个operation/effect/stream/epoch、幂等键、cursor、状态guard和失败映射给出可执行合同 | 不写DTO、schema、函数签名、事务或重试代码 |
| 04配置设计 | 需闭合平台版本、路由、能力、secret引用、预算和环境资格 | 不选择SDK、OAuth、API key、KMS、消息中间件或路由产品 |
| 05/06/07 | 需把各通信边界转成测试切口、证据白名单、验收条件和实施阶段前置 | 不宣称测试、运行、证据、报告、签署或ready |

## 9. 回填草稿与来源

正式 `01-架构设计.md §10` 计划摘录：

- §3 的通信目标和阶段分离；
- §5 的六单元交互边界与简化图；
- §7 的边界类别说明；
- 本文 §7.1~§7.6 各单元场景与方式判断的压缩版；
- 本文 §8 的失败、直接穿透、协议下沉和承接审计。

来源：`01_arch_step_04_system_context.md`、`01_arch_step_06_containers_deployment.md`、`01_arch_step_08_data_consistency.md`、`00-需求文档.md` §9~§14、`00_req_step_05_platform_source_verification.md`、架构SOP Step9、架构设计书写规范§4.10。BR-UP-001~009仍open，BR-UP-010仍reference_only；平台和owner能力未被本步关闭。

## 10. 自检与门禁

| 检查项 | 结果 |
|---|---|
| 场景先于方式 | 已先列正式交互场景，再判断同步/异步/后台和不宜方式。 |
| 六单元覆盖 | U1~U6均有思考、诊断、场景表、方式判断、失败降级和停审记录。 |
| 失败语义 | ACK、owner accepted、platform receipt、consumer disposition、unknown/gap分别表达，无阶段升级。 |
| 边界保护 | 无直接共享存储、反向依赖、自动换target、查询副作用或平台SDK下沉。 |
| 文档粒度 | 无API路径、事件名、DTO、schema、时序、技术产品、实现重试或测试结果。 |
| 安全证据 | 无body、secret、私有callback、敏感审批正文、虚构receipt/evidence/report/verdict/readiness。 |

自检结论：六单元交互方式与Step8数据一致性、Step7依赖方向、Step6运行承载相容；跨交互审计未发现 unresolved 冲突。当前agent设计自检通过。

Step16全文复核：同步图墙线与边界箭头，明确通信记录禁止不等于禁止获准瞬时转换；U4的human责任引用不再误指Identity。依据Step1/5/8/10既有材料与责任分层，BR-UP-002及其余资格缺口仍open，不新增协议或owner。

`gate_status=pass`；`gate_reason=interaction_modes_and_cross_boundary_audit_passed`；`next_allowed_action=read_step_10_then_create`；`formal_backfill_allowed=after_step_16_three_level_gate`；`commit_required=false`。
