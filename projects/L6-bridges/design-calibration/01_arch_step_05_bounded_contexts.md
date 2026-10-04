# L6-bridges 01 Step 5：限界上下文与子域划分

> full-restart；done / pass；正式01不写。

## 1. 状态与 Step 内计划

开工：Step4 pass；已读Step3/4、00§7/9~12、平台附录既有定位、SOP Step5、规范§4.6。先搭单元骨架，再逐个问题/诊断/取舍、语义卡/摘录、自检停审；六单元全部通过后跨单元审计。停审只为当前agent设计自检，不冒称用户或owner签署。

| 单元 | 候选讨论范围 | 思考 | 写入 | 自检停审 | gate_status / 下一动作 |
|---|---|---|---|---|---|
| U1 | 受权绑定与映射 | done | done | done | pass / U1_self_review_complete |
| U2 | 入站交接 | done | done | done | pass / U2_self_review_complete |
| U3 | 安全外显与交付 | done | done | done | pass / U3_self_review_complete |
| U4 | 交互责任交接 | done | done | done | pass / U4_self_review_complete |
| U5 | 连续性与恢复支撑 | done | done | done | pass / U5_self_review_complete |
| U6 | 安全读取与追溯支撑 | done | done | done | pass / U6_self_review_complete |

## 2. 输入与共同语言前提

00五能力是需求关系，不能直接推出五微服务。独立Bridges局部限界上下文承载共同binding generation、operation/effect与结果分层语言；内部按不同状态主语设语义单元，而非设六个独立truth服务。两端实体、授权、材料、平台truth始终为外部owner。adapter是反腐转换边界，不是新的业务领域。

## 3. SOP逐项问题回答

| 问题 | 当前回答 / 审查入口 |
|---|---|
| 内部有哪些子域/上下文？ | 在一个本地Bridges上下文内按U1~U6顺序辨明语义，具体分类/边界逐卡收束。 |
| 哪些是核心？ | 以受权关系、入站/出站/责任交接是否构成本仓特有协作语义判断，不以模块名或FR数量判断。 |
| 哪些是支撑？ | 位置/去重/恢复及安全观察支撑多个核心路径，P0保护不等可后置的外围。 |
| 哪些只是影子？ | 能力摘要、owner/basis/material ref及局部只读view；relation自身是受权局部truth，不能把两端实体带入。 |
| 映射关系是什么？ | binding约束受众/目标/动作，协议语义依附关系，连续性和追溯支撑整个局部上下文；最终关系图在六卡后装配。 |
| 为什么不能混写？ | 关系、owner交接、外部效果、action及位置/观察有不同状态主语和authority；可共享一个BC，不能共用一个全局“成功”状态。 |
| 每单元职责/非职责/语言/影子？ | 逐卡§7.1~7.6先思考再结构化，保能力/引用/禁止与验证入口。 |
| 单元是否停审？ | 以§1逐行自检结果为准，未到达单元不提前pass。 |
| 跨单元是否冲突？ | 六卡后审计ownership、角色kind、重复对象、词汇/阶段与来源，发现缺口回对应卡。 |

## 4. 当前材料诊断

Step3/4仓级边界未决定内部语义组织。五能力若直接拆服务会把共享去重/撤销/rate-limit后置；平台分类若成四truth域会重复授权和安全规则。当前只定义语义结构，不写对象字段/DDL/函数或部署。

## 5. 历史差异入口

旧01§3.1~3.3的shared core/per-platform adapter仅为历史候选。独立逐卡结论完成后再对照旧§5语义划分，不以旧目录/组件推导当前子域。

## 6. 取舍与复杂度

采用一个局部BC、按状态主语逐单元校准；未采用五能力=五服务、平台=业务上下文或全域canonical消息。复杂度重，六卡分12批思考/结构化，汇总另批；不因单次规模压缩mapping、协议、恢复或验证边界。架构schema以语义维度/约束表达，最终字段/DTO留02/03正式闭合。

## 7. 逐单元校准

### 7.1 U1思考

职责是解释“哪一安装、哪一外部主体/位置，凭哪一当前依据，允许哪一内部target和方向/action”。配置/关系/映射有各自版本，安装scope与内部basis不能合并；mapping定位需platform/server-or-installation/kind/opaque locator、binding generation、internal typed ref及其scope/版本依据。identity mapping必须区分human account、AI GlobalMember引用与Integration来源，不自动生成人或AI身份。能力快照仅为来源/版本明确的安全摘要；secret只保opaque provider ref。

诊断：显示名、mention、裸external_id或“默认频道”会串绑；用relation代替授权会绕撤销。采用受权typed relation和显式变更，不采用自动发现即绑定、裸ID全局唯一或默认tenant。测试切口需跨installation/kind同ID、撤销与旧generation、管理同键变义及禁止secret材料；依据00 FR001~003/BR001~005/017、AC001~007。

#### U1结构化语义卡

| 切口 | 已收束语义 |
|---|---|
| 分类/职责 | 核心子域；拥有配置版本、受权external-binding relation、identity/channel/message/thread映射关系，不拥有basis或两端实体。 |
| 统一语言/对象角色 | configuration revision、installation、binding generation、external kind、typed target；配置版本与relation版本不互代。 |
| mapping语义schema下限 | locator按platform/server或installation/external kind/opaque位置隔离；relation同时锚定binding generation、internal typed target及scope/owner版本依据。message/thread映射从显式管理或已知owner/平台结果建立，不凭内容或时间猜测。 |
| 主体关系 | human account只回链正式human责任ref；AI账号只回链获准GlobalMember；Integration仅可信来源。channel/DM/topic/thread的kind不能折叠。 |
| 变化/失败 | configured不等active；active须安装/config/basis同时有效；suspended/revoked阻新操作及旧排队；CAS/同键变义冲突，不改历史效果或默换target。 |
| 影子/引用 | 能力snapshot有来源/版本且不证明可用；basis/ref和secret/provider ref不含正文；view只能解释当前局部关系。 |
| 验证/材料 | 跨安装/主体kind/方向/action、撤销竞争、管理幂等、secret失效切口回链AC001~007/037/038；仅ref/版本/有限reason可交接，无token/raw安装材料。 |

U1摘录：relation是本仓局部truth而非授权truth，受权版本与typed scope保证映射可解释；正向basis/secret资格仍BR-UP-002/003/007/008。自检停审pass：分类非投影，所有维度源自00，不造身份/owner、API/DDL或部署；允许U2思考。

### 7.2 U2思考

入站的主语是“已验证受权的外部operation如何交给正式owner”，不是本地Turn。adapter瞬时验证原始来源，转换为带installation/binding generation/原消息关系、变化kind/版本、可信source marker、target mode与安全材料ref的交接语义。Conversation AppendFact分支明确Integration、BridgeMapped和required digest；ManifestExternalFact分支只显化ref，不写平台body。编辑/删除回链原映射，外部delete不能物理删除内部truth；线程kind不支持则unsupported/经允许degraded，不默换频道。

诊断：平台ACK deadline与正文不能durable使“先ACK后后台补”并不天然可靠；只有正式可恢复safe ref已成立或owner已接纳才可声称接管。采用ACK/verification/owner disposition分层与source隔离，不采用ACK=Turn或raw inbox正文。测试切口：伪造/重放/回环、同key变义、target mode缺失、digest mismatch、变化缺映射和owner提交unknown；依据FR004~006、AC008~014/037/038。

#### U2结构化语义卡

| 切口 | 已收束语义 |
|---|---|
| 分类/职责 | 核心子域；拥有验证/来源/ACK/owner交接disposition，不拥有Conversation/Turn或平台消息truth。 |
| 语言/对象角色 | inbound operation、verified source、safe material ref、target mode、owner result ref；ACK仅transport阶段。 |
| 协议语义结构 | 经verified来源与U1关系定位原message/thread和operation/change kind、可解释source版本；交接显式target mode/Integration actor/BridgeMapped/digest约束或外部显化ref。不新增SDK API或复制上游DTO。 |
| 状态guard | verified须平台认证及当前binding；owner_handoff须材料/actor/target合同；accepted/rejected仅据owner正式结果，pending≠Turn；提交未知为indeterminate，同operation对账。 |
| 差异/回环 | edit/delete/thread回链原映射/版本；marker只信验证来源与本仓发送关系，用户自报bridged marker无权；缺映射/不可比留quarantine/gap。 |
| 影子/引用 | accepted fact/manifestation ref、safe source/material ref均归owner；raw event/body仅瞬时，不能进durable inbox、错误或digest证据。 |
| 验证/材料 | AC008~014的验签、模式/actor/kind/digest、重复冲突、线程变化、unknown切口；审计只source/operation/result安全ref和有限disposition，不记录body。 |

U2摘录：受权转换先于owner交接且各阶段独立，缺safe材料ref不声称可靠接管。自检停审pass：已有Conversation语义被承接但BR-UP-001/002/003仍open，trusted source例外未绕active/visibility/forbidden body等gate；无新Turn/正文store，允许U3思考。

### 7.3 U3思考

主语是committed source被允许外显后形成的单一外部effect；拥有intent/attempt/receipt而非平台message。intent应稳定关联source/version、target/binding generation、allowed projection version、操作kind与effect identity；attempt只追加尝试与安全观察，派发前核当前binding/visibility/Policy/Gate、secret版本、能力与预算。安全表达不能持久body；需要owner materialization/read ref，缺失blocked，原素材失效不把同effect改为新内容。

敏感Gate正文完全排除；提示、存在性、入口、action各自获准，受控URL未建立时只有获准无动作提示或blocked。附件按Artifact准入/访问/传播ref，必要缺失阻塞，可省略有owner依据；edit/delete只对受权message mapping，不改非映射平台对象。采用intent/attempt/receipt分离且unknown停自动续发；未采用HTTP2xx=送达、lease超时重发、跨频道fallback或永久附件URL。切口为AC015~021/037/038及FR007~009；内部commit不是外部接受，platform_accepted不是已读。

#### U3结构化语义卡

| 切口 | 已收束语义 |
|---|---|
| 分类/职责 | 核心子域；安全表达、intent/attempt/receipt局部效果记录；不拥有平台message或read receipt truth。 |
| 语言/对象角色 | committed source、allowed projection ref/version、stable effect、dispatch attempt、platform observation；projection不是授权owner。 |
| 投递语义schema下限 | intent绑定source/version、target/binding generation、projection version、operation kind与effect；attempt追加回链原intent及claim/fence，receipt仅解析已知安全结果；私有URL/token不落记录。 |
| 状态guard | prepared须获准当前材料/目标；dispatching须当前binding/visibility/适用Policy/Gate、secret、capability及lane/budget；platform_accepted/known_rejected凭平台业务结果，未知为indeterminate，不据HTTP或lease改名。 |
| 展示/附件/变化 | 敏感Gate正文排除；存在性/提示/入口/action独立；附件authorized ref及传播资格，必要缺失阻塞；edit/delete/thread只原映射/明确能力，不默换target。 |
| 引用/恢复 | durable只source/material/projection/Artifact ref；瞬时materialization不足以可靠重试，重新读取失败保持blocked/missing_source；新版本表达须另经授权新intent，不篡改同effect。 |
| 验证/材料 | AC015~021/037/038覆盖当前授权、敏感渲染、附件撤销、业务错误、并发/unknown、同effect恢复；证据只安全effect/attempt/result refs，不含payload。 |

U3摘录：安全表达与投递效果分离，意图固定、尝试追加、已知平台观察独立；BR-UP-001/003/004/007~009不关闭。自检停审pass：未把必要附件/授权作为可选降级，不把lease误作无效果；允许U4思考。

### 7.4 U4思考

主语是已验证interaction到owner动作的责任交接。需安装、actor证明及当前human责任ref、已知source message/intent、target/action/owner版本、expiry/one-use关系共同有效；私有context只用于验证，不自授权限。回调ACK/deferred与owner Decision分开；过期、跨user/target、撤销及篡改拒绝，重复可读取既有结果但仍需当前可见性，unknown不换owner operation。

诊断：签名、低敏感、reaction或管理员角色不等审批basis；仅UI按钮变化不能代表Gate。采用私有验证seam、受权action relation及正式owner二次校验，不采用callback直接批准或延长token默认执行。可信source actor不能冒充human。切口为FR010/011、AC022~027/037/038，token/context/response_url不进durable/日志/证据。

#### U4结构化语义卡

| 切口 | 已收束语义 |
|---|---|
| 分类/职责 | 核心子域；拥有验证/重放/责任交接记录，只引用owner action/Gate/Decision结果。 |
| 语言/schema下限 | verified interaction、bound action、one-use operation；关系锚定installation、external证明/当前human ref、source message/intent、target/action/owner version、expiry，不保存私有context。 |
| 状态guard | verified须平台认证及当前relation/action依据；invalid/expired/replayed/blocked不交接；owner_handoff结果由owner二次核验，unknown同identity对账。 |
| 时间/私有seam | 平台响应窗口独立；ACK/deferred不证明Decision，token到期不续长；旧结果按当前可见性返回，不能重用失效response URL。 |
| 非职责/验证 | 不批准/写Decision/调用Tools；AC022~027反例含伪造、跨user/target、撤销、重复/unknown和读取拒绝；仅安全关系/结果ref交接，无审批正文或callback token。 |

U4摘录：平台验证、内部责任与owner action资格三者独立；BR-UP-002/003/007/008保持open。自检停审pass：未让Integration例外替human责任或低敏感默许action，允许U5思考。

### 7.5 U5思考

支撑所有mutation的单一operation/effect连续性，去重和位置不是新的业务事实。management/inbound/callback/outbound/recovery-handoff有独立namespace；同key同语义复用当前获准读取的原result，变义conflict/quarantine。cursor包含source namespace/stream/epoch/opaque position及正式comparator；protocol接收、owner disposition、delivery effect位置独立，时间戳/裸ID非完整水位，gap关闭需权威覆盖。

lane以安装/受权target或mapping序列和操作依赖建立，edit/delete先有已知create locator；只有lane内序，不承诺全平台总序。平台bucket动态真实，预算未知/耗尽停相应自动操作；retry_wait需已知无副作用依据、当前授权且等待下界/预算有效，unknown走原effect probe/manual。恢复只修局部mapping/cursor/记录，不能重建body或owner/平台truth。诊断：去重过期、lease失效、SDK自动retry均不能证明无效果。采用受权恢复与已知结果finalize-only，不采用default_retry或从时间推gap关闭；AC028~031/034~036/037/038为切口。

#### U5结构化语义卡

| 切口 | 已收束语义 |
|---|---|
| 分类/职责 | 支撑子域且P0；拥有operation去重/effect关联、分角色cursor/gap、lane等待/恢复局部记录，贯穿U1~U4，不是可后置模块。 |
| 幂等schema下限 | key必须namespace+installation/受权scope+稳定operation identity及语义版本；canonical语义与result ref用于同义/冲突判定，attempt不改effect。最终编码/digest权威在03闭合，不能存body或把raw digest入观测。 |
| cursor/顺序下限 | source/stream/epoch/position/comparator与protocol/owner/effect角色分开；无正式comparator不可比，无coverage不能complete；mapping lane内create->edit/delete及同effect串行，不默认全序。 |
| 限流/retry下限 | Slack method/workspace/channel、MM实例、Telegram per-bot及retry_after、Discord bucket/majorresource/global分别核验；等待下界不可缩短。已知无效果+授权+预算才retry_wait，否则indeterminate/manual。 |
| recovery guard | 原source/effect/basis和权威query/probe/baseline有效才对账；known_success仅finalize局部，不再外呼；missing/ref失效/去重窗口不明保持blocked/missing_source。claim/fence只防本地并发，不消除外部未知。 |
| 验证/证据 | AC028~031/034~036及共享AC037/038覆盖key冲突/过期、跨epoch、gap、429/预算、lease/crash/unknown、manual/rebuild不反写；仅有限reason/ref/位置摘要材料。 |

U5摘录：稳定operation、独立cursor及有权威证明的恢复保护全部副作用；BR-UP-009和相关owner/platform合同不关闭。自检停审pass：支撑不等可选，query不触发恢复，未知无证明不发；允许U6思考。

### 7.6 U6思考

支撑对局部变化的安全解释及Observability材料交接，不拥有consumer接受/evidence裁决。显式mutation的body-free局部追溯与其受权变化一起成立，拒绝/未知/查询不能伪造accepted trace。handoff intent/attempt和consumer disposition独立，强制准入不满足限制相应操作，有限安全backlog不是无限审计队列。读取仅投影/既有状态与获准ref，不refresh来源、推进cursor、repair或replay；缺资格连隐藏count/存在性也裁剪。

诊断：日志不是业务追溯，字符串report/evidence路径不是实际接受/运行，raw平台error/debug body会泄露。采用白名单安全记录与只读局部view，未采用所有raw日志交给Observability再脱敏、读时自修复或本地产生EV。材料只有允许安全ref/版本、阶段/有限reason及handoff ref，metric仅低基数类别；切口FR015/016、AC032/033/035~038。owner/basis/material引用及local view均是影子结构，不新增领域truth。

#### U6结构化语义卡

| 切口 | 已收束语义 |
|---|---|
| 分类/职责 | 支撑子域且P0；局部追溯/安全handoff记录与读取保护；不拥有audit consumer truth/EV/verdict。 |
| 语言/schema下限 | accepted local change、safe trace ref、handoff identity/attempt、consumer disposition ref、local view；仅获准ref/版本/阶段/有限reason与scope，禁止rawbody/私有URL/敏感存在性。 |
| 阶段/失败 | local prepared/attempt不等consumer accepted；unknown保待对账，接收缺口按获准backlog预算等待，强制准入不足限制对应mutation。 |
| 只读/影子 | body-free view由本仓truth派生，query当前资格核验但不persist/repair；denied/unavailable不同于空；owner/basis/material ref只回链，不自产授权或材料body。 |
| 验证/材料 | AC032/033/035~038：拒绝不造accepted、handoffunknown、producer缺失、no-write、隐藏count/ref安全及所有出口redaction；不填写run/report/EV/signoff事实。 |

U6摘录：安全追溯与只读view解释局部状态，观察接受和证据裁决独立。自检停审pass：BR-UP-006/条件005保留，十二affected不改状态；无日志先收raw方案，允许跨单元汇总审计。

### 7.7 跨单元语义边界审计

| 审计面 | 结果 |
|---|---|
| 分类 | U1~U4是核心协作语义，U5/U6是P0支撑；owner/basis/material/capability只有ref或快照，不被写成外部truth。 |
| operation/effect | U1提供generation，U2/U4消费来源operation，U3拥有logical effect局部记录，U5提供去重/位置保护；无全局“成功”。 |
| actor/授权 | Integration来源、human责任ref、AI身份引用分离；平台签名不替代action basis。 |
| target/mapping | U1拥有typed mapping；U2/U3/U4只消费当前generation；撤销不换target。 |
| 结果 | owner结果、平台receipt、owner action、consumer disposition分别归属；U5只关联。 |
| cursor/gap | U5独占位置/gap/预算/恢复；U2/U3/U4不能推进跨namespace cursor，U6 query不维护。 |
| 材料 | U2/U3/U4只引用获准材料，U6只记录body-free安全关系；无raw body/secret/private callback。 |
| 覆盖 | FR012/013由U5跨U1~U4保护，FR015/016由U6支撑，BR021/023/024全局覆盖；无孤儿项。 |
| 历史冲突 | 旧Bridge Core/Mapping/Gate View/Audit只作候选，未承接BridgedTurn、ExternalGateView或平台truth。 |

最终结构为一个L6-bridges局部限界上下文，内部U1~U6六个语义单元；本Step不决定部署、包、DTO或表。

### 7.8 统一语言与回填草稿

| 术语 | 定义 | 禁止等同 |
|---|---|---|
| binding generation | 受权关系当前变化世代 | 平台安装版本或消息游标 |
| typed mapping | 受权外部定位到内部引用关系 | 外部实体truth或GlobalMember |
| owner handoff | 向正式owner交接安全引用/责任的局部阶段 | Turn/Decision已成立 |
| logical effect | 同一外部副作用的稳定局部身份 | attempt、receipt或已读 |
| cursor/gap | 某来源/处理/效果流位置及缺口 | 全局水位、ACK或回放保证 |
| safe handoff | 仅含获准ref/版本/有限reason的交接 | body、secret或证据本体 |

正式§6摘录：U1~U4为核心，U5/U6为P0支撑；外部owner/平台truth只以ref、快照或安全结果进入。关系图仅表达内部依附，不表达运行组件。

### 7.9 语义划分汇总与关系图（装配复核）

Step16复核发现原六卡已有分类、关系和跨审，但汇总图尚未独立落盘；本节只投影§7.1~7.8已确认关系，不新建上下文、对象、接口或部署决定。

| 名称 | 类型 | 作用 | 与其他部分的关系 |
|---|---|---|---|
| U1受权绑定与映射 | 核心子域 | 受权relation、typed mapping与generation的局部语义 | 约束U2~U4的主体、target、方向与action。 |
| U2入站交接 | 核心子域 | 验证来源、入口阶段和owner交接 | 依附U1当前关系，不产生Turn/body truth。 |
| U3安全外显与交付 | 核心子域 | 获准表达及stable effect的局部语义 | 消费U1关系与owner材料，投递阶段独立。 |
| U4交互责任 | 核心子域 | callback验证与owner action责任交接 | 消费U1主体/目标关系和owner当前依据，不依附U2为授权。 |
| U5连续性与恢复支撑 | 支撑子域 | 跨路径去重、位置、预算和局部恢复 | 支撑所有U1~U4 mutation，不只是U3恢复。 |
| U6安全读取与追溯支撑 | 支撑子域 | 跨路径safe view与body-free handoff | 消费全部局部安全状态，不拥有evidence。 |
| 本地ref/snapshot/view | 本地索引/投影/引用 | 稳定消费owner/basis/material/capability的最小安全影子 | 附属于本仓局部语义，不迁移两端正文。 |

#### 上下文关系图: Bridges局部语义

```text
                      +-------------------------+
                      | U1 binding / mapping    |
                      +------------+------------+
                                   | constrains
             +---------------------+---------------------+
             v                     v                     v
+-------------------------+ +-------------------+ +------------------------+
| U2 inbound handoff      | | U3 safe delivery  | | U4 action handoff      |
+------------+------------+ +---------+---------+ +-----------+------------+
             |                       |                       |
             +-----------------------+-----------------------+
                                     | supported by
                     +---------------+---------------+
                     v                               v
        +-------------------------+     +-------------------------+
        | U5 continuity/recovery  |     | U6 safe read/trace      |
        +------------+------------+     +------------+------------+
                     |                               |
                     +---------------+---------------+
                                     v
                     +-------------------------------+
                     | local refs / snapshots / views|
                     +-------------------------------+
```

图后说明：

- U1约束U2/U3/U4；U5/U6跨核心路径支撑，不表示运行时顺序或单元间新增依赖。
- 本地影子只保存获准引用、版本、摘要或派生视图，不成为外部truth。
- 六卡、关系表和跨审保持一致；图不表达字段、代码、存储或部署。

补图后局部审计：所有节点先在分类表定义，U4未依附U2，U5/U6未被限定到一条路径，外部对象仅作为local ref语义出现。表示层修正自检pass；原BR-UP不关闭。

## 8. 回填草稿

章6使用§7.7~7.8的划分、关系、统一语言和本地影子边界；不写字段、数据库、容器、接口或函数。

## 9. 待确认事项

BR-UP-001~009仍open；U1正向basis/secret/capability未获资格，不因本Step有语义卡激活；具体schema/编码必须在02/03/04闭口才可实施。

## 10. 门禁

自检：六单元均有职责/非职责/语言/影子/切口和停审；跨审覆盖operation、actor、target、结果、cursor、材料、依赖，无重叠/孤儿/越权；旧候选只作差异扫描。当前agent设计自检pass。

gate_status=pass；gate_reason=all_six_context_units_stopped_and_cross_audit_passed；next_allowed_action=read_step_06_then_create；source_files=Step3/4/00/platform_annex/owner_contracts/SOP5/规范4.6；formal_backfill_allowed=after_step_16_three_level_gate；commit_required=false。
