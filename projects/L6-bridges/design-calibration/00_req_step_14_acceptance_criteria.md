# L6-bridges 00 Step 14：验收标准

> 状态：done / pass；回填00 §14；full-restart；38AC/6VETO设计自检完成。

## 1. 状态与 Step 内计划

开工确认：恢复台账/flow，已读需求SOP Step14、书写规范§4.14及前序Step7五卡/9/10/11/12/13；六通用标准的阅读见项目台账§4及Step13开工记录。进入条件pass。按C1~5串行处理五类验收、否决来源和小循环停审，最后全局与跨节点审计；没有测试运行授权。

| 顺序 | 单元 | 问题/诊断/取舍 | 结构化/回填 | 自检 | gate_status / 下一动作 |
|---|---|---|---|---|---|
| 1 | C-BR-1 | done | done | done | pass / next_group |
| 2 | C-BR-2 | done | done | done | pass / next_group |
| 3 | C-BR-3 | done | done | done | pass / next_group |
| 4 | C-BR-4 | done | done | done | pass / next_group |
| 5 | C-BR-5 | done | done | done | pass / next_group |
| 6 | 全局验收/一票否决/跨能力审计 | done | done | done | pass / next_step |

## 2. 输入

五卡故事目标/语义/切口、16FR、24BR、20DR、11IF、16NFR以及G001~005。条目只验证前序已校准要求，不新增功能、测试脚本、外部账号或实现环境。

## 3. SOP 逐项问题回答

### 3.1 C-BR-1

| 问题 | 当前回答 |
|---|---|
| 当前节点及闭环成立条件？ | C1：平台安装资格与内部actor/target/direction/action依据分别成立，配置、关系、版本与撤销可解释；未满足则waiting/blocked不执行。 |
| 功能如何通过？ | FR001配置及secret准入不默认激活；FR002建立/暂停/撤销受权关系；FR003按installation+kind+binding定位identity/channel/message/thread，不自动建内部实体。 |
| 规则/边界如何通过？ | BR001~005及共享017/021保护owner、授权、主体kind、版本与凭证；external ID不决定GlobalMember或权限。 |
| 数据如何通过？ | DR001~006分别是局部truth、能力snapshot或正式ref；snapshot不是当前授权，opaque ref不是secret正文。 |
| 非功能如何通过？ | NFR001/002的受权准入和版本竞争判断均成立，其他共享审计/脱敏由全局和C5承接。 |
| 哪些是整体否决？ | 自动创建GlobalMember、无basis外呼、raw secret持久化、静默替换target或继续使用撤销关系，会破坏核心边界。 |
| 映射与遗漏如何检查？ | 分一核心、三功能、一规则、一数据、一质量条件；逐一回指FR001~003/BR001~005/DR001~006/NFR001~002，不把三平台未安装算整体否决。 |
| 当前核心功能/硬规则有遗漏吗？ | 配置、关系生命周期与定位各自验收，BR001~005均有映射；共享追溯/材料约束交C5及全局，不另造owner。 |
| 一票否决回指什么？ | 自动建身份回指BR003；未授权外呼回指BR002；secret落盘回指BR005/021；撤销/换目标回指BR004。 |

### 3.2 C-BR-2

| 问题 | 当前回答 |
|---|---|
| 当前节点？ | C2，可解释入站交接。 |
| 闭环何时成立？ | 平台来源验证、binding、可消费材料和Conversation正式target mode成立，返回独立ACK及owner accepted/ref或明确拒绝/待定/未知。 |
| 功能怎样通过？ | FR004可信验证/回环保护及接管边界；FR005正式AppendFact/ManifestExternalFact与actor/material条件；FR006原mapping/source version的变化/线程差异。 |
| 规则怎样通过？ | BR006~009保护可信source、阶段、材料、变化；BR017/018共享去重/位置约束不被ACK绕过。 |
| 数据怎样通过？ | DR007局部验证/ACK/交接记录与DR008正式owner结果ref分开；复用DR003/005/010/014/015，不保存raw body。 |
| 质量怎样通过？ | NFR003协议时限与可靠接管条件、NFR004operation和位置一致性成立，不自造统一ACK数字。 |
| 哪些整体否决？ | ACK冒称内部提交、保存raw body补恢复、来源marker未验证、unknown换ID重交、外部delete抹内部truth。 |
| 验收回指哪些项？ | 以FR004~006为功能轴，附C2闭环/BR006~009/DR007~008/NFR003~004，共享数据与保护有显式ref。 |
| 核心功能/硬规则遗漏？ | 入站、结果、变化三主题均独立承接，edit/delete和thread不因平台不支持而省略失败条件。 |
| 否决来源？ | 阶段BR007；材料BR008/021；来源BR006；unknown BR019；truth删除BR001/009。 |

### 3.3 C-BR-3

| 问题 | 当前回答 |
|---|---|
| 当前节点？ | C3，安全外显与交付。 |
| 闭环何时成立？ | committed来源、当前受众/展示依据和受权目标成立，外部效果形成独立receipt或明确blocked/unknown。 |
| 功能怎样通过？ | FR007安全材料/敏感Gate降级；FR008入出站附件引用/传播；FR009稳定intent/attempt及平台业务receipt。 |
| 规则怎样通过？ | BR010~013和共享019/021保护当前授权、安全外显、附件及效果连续；不能换target/projection消除旧unknown。 |
| 数据怎样通过？ | DR009是局部尝试观察，DR010/011是owner材料/附件ref；DR003映射与DR005依据共用，不复制正文。 |
| 质量怎样通过？ | NFR005~007要求依赖失效隔离、敏感/附件授权及效果一致性，platform_accepted不等已读。 |
| 哪些整体否决？ | 内部commit冒称外部送达、敏感正文外发、永久公开附件fallback、unknown盲重试/改target、混淆平台truth归属。 |
| 验收映射？ | 以FR007~009各自功能验收，加本节点闭环/BR010~013/DR009~011/NFR005~007；附件共享入站路径不漏。 |
| 核心功能/硬规则遗漏？ | 存在性、提示/入口、按钮action分别有依据；必要附件不可用阻塞和可省略条件都有承接。 |
| 否决来源？ | BR010/011外显；BR012传播；BR013阶段/effect；BR019未知；BR001/021所有权/材料。 |

### 3.4 C-BR-4

| 问题 | 当前回答 |
|---|---|
| 当前节点？ | C4，受控交互责任。 |
| 闭环何时成立？ | 平台交互验证、绑定、actor及当前owner动作资格成立，交接owner并返回独立结果；不满足则invalid/expired/replayed/blocked或unknown。 |
| 功能怎样通过？ | FR010验证并绑定installation、actor/source message/target/action/expiry；FR011只交接正式owner命令，不本地决定Gate。 |
| 规则怎样通过？ | BR014~016保护责任/时效/重放和owner；共享006/017/019/021保护来源、幂等、未知及私有材料。 |
| 数据怎样通过？ | DR012只保安全验证/one-use记录，DR013是owner action/Decision ref，复用DR003/005/009，不保存context/token/审批内容。 |
| 质量怎样通过？ | NFR003 interaction时限及NFR008/009责任和单次效果一致，延迟响应不续长token或默认批准。 |
| 哪些整体否决？ | 回调本地批准Gate、签名/低敏感当action权限、callbackACK冒称Decision、context/token泄露、unknown新ID重交。 |
| 验收映射？ | FR010/011各一功能，加C4闭环、BR014~016、DR012/013及NFR003/008/009。 |
| 核心功能/硬规则遗漏？ | 当前owner状态变化、读取旧结果资格、重复/撤销/到期均纳入，不把正向动作资格与展示许可合并。 |
| 否决来源？ | BR011/014权限；BR015 owner；BR016阶段；BR019未知；BR021私有材料。 |

### 3.5 C-BR-5

| 问题 | 当前回答 |
|---|---|
| 当前节点？ | C5，失败恢复与安全追溯。 |
| 闭环何时成立？ | 原operation/effect与cursor/gap可定位，恢复有basis/权威来源，局部修复和安全handoff可解释；无来源/probe则blocked/missing_source/indeterminate，不伪造成功。 |
| 功能怎样通过？ | FR012 namespace去重与可比较位置；FR013真实lane/bucket/预算与安全retry；FR014受权同effect回放/对账；FR015安全审计及真实consumer结果；FR016安全no-write读取。 |
| 规则怎样通过？ | BR017~024保护单一effect、位置/覆盖、未知、恢复、材料、交接、读取与留存；不让重建产生新内部或平台效果。 |
| 数据怎样通过？ | DR014/015/016是本仓cursor/dedup/recovery/handoff局部状态，正式source/basis仍ref；禁止DR017~020正文。 |
| 质量怎样通过？ | NFR010~014的有限限流/预算、保守恢复、安全追溯、窗口/位置一致及只读观察成立。 |
| 哪些整体否决？ | unknown盲重试或换目标/effect、越gap complete、query写入、body/secret泄露、local handoff假称consumer接受或证据。 |
| 验收映射？ | 五个FR分别功能条件，再C5闭环、BR017~024、DR014~016及NFR010~014；共享审计覆盖C1~4关键变化。 |
| 核心功能/硬规则遗漏？ | 去重记录过期、窗口/预算未知、epoch变化、ref失效、audit不可用、lease失效和query副作用都有条件，不省略失败保护。 |
| 否决来源？ | BR017~020 effect/位置/unknown；BR021材料；BR022证据；BR023读取；BR024窗口/预算。 |

### 3.6 全局验收与跨能力审计

| 问题 | 当前回答 |
|---|---|
| 当前审查对象？ | 五能力的共同禁止材料、阶段真实性及整体否决；不新增第六能力。 |
| 闭环怎样成立？ | 五节点各有正常/不支持/受限/未知结果和正式来源；受限保护可验收但不冒称四平台正向运行。 |
| 功能怎样覆盖？ | 16FR均有独立功能AC，平台差异通过FR能力条件及官方核验来源判断，不用4/4数字替代。 |
| 规则怎样覆盖？ | 24BR按五节点主保护及共享规则承接；所有权、授权、效果连续和材料禁止破坏构成否决来源。 |
| 数据怎样覆盖？ | DR001~016节点验收；DR017~020统一全局禁止条件，所有出口包括日志/证据均受约束。 |
| 质量怎样覆盖？ | NFR001~014节点条件，NFR015/016另全局材料安全/真实阶段条件，六类均有对应。 |
| 哪些是整体否决？ | owner/平台第二truth与自动身份；无basis操作；正文/secret/敏感泄露；阶段/证据伪造；unknown重试/越gap或query写入；本地审批/直执行。 |
| 来源映射如何表达？ | 每AC对应节点或全局G、既有FR/BR/DR/NFR，矩阵只引用这些ID；VETO单列来源，避免扩大成普通缺陷清单。 |
| 有遗漏或重复吗？ | 功能16项单独验收，核心5项/规则5项/数据5项/质量5项共享观察只定义一次；最后静态检查38AC和五类，语义审查仍由当前agent完成。 |
| VETO是否有来源？ | 六项分别回指BR001/003、002/004/010/014、005/011/012/021、007/013/016/022、017~024、015，不新增需求。 |

## 4. 当前材料问题诊断

### 4.1 C-BR-1

C1和Step13已给可判断准入；“配置页面保存成功”“OAuth grant存在”不是C1成立。没有完整internal human认证/责任合同，不能设计假用户登录后宣布验收通过。仅建立验收条件，当前结果保持not_evaluated；旧00验收数字待独立结构化后扫描。

### 4.2 C-BR-2

Conversation已有bridge输入语义但BR-UP-001仍待兼容核验；不能用假“提交Turn”填验收。DR010的安全材料来源不完整时，可靠接管条件未满足，不因平台ACK需求保存raw事件。采用三独立功能验收和五类别覆盖，未采用收到消息后内部出现文字即算通过；变化无mapping、不可比或不支持须明确安全结果。

### 4.3 C-BR-3

C3卡和NFR005~007不允许“收到任一2xx即成功”；safe projection owner与路由入口仍缺合同，不能用Chat草稿造链接，不能把附件可省略作为adapter默认值。采用三独立功能条件及平台业务结果判断，未采用“内外消息一致/所有Gate卡片可点击”的假等价。验收只定义边界成立条件，平台成功证据尚不存在。

### 4.4 C-BR-4

C4和NFR008/009只证明平台来源认证的切口，不能代替internal human认证/授权provider，也不能使用Gate卡片颜色证明正式Decision。采用两个功能及五类别验收，未采用任意reaction或按钮直接执行；验证结果和业务命令结果独立。只有owner当前允许的action才有正向资格，其余保持明确不执行。

### 4.5 C-BR-5

C5与NFR010~014不能把“可恢复”理解为所有来源永远可回放；ref、去重窗口和平台probe缺口时必须安全停下。Observability准入未完成不允许本地生成evidence。采用每FR一功能条件及共用五类别，未采用全局timestamp watermark、无限重试、真实receipt占位或query自动repair；恢复accepted只能对应真实局部变化，不能代替owner/平台truth修复。

### 4.6 历史差异审计

| 旧材料位置 | 旧口径 | 当前判断 | 理由 | 回填影响 |
|---|---|---|---|---|
| 旧00 §11.1 | 发消息即生成Turn/回复 | 修改 | Conversation target mode与accepted结果不证明Turn/执行或外部receipt | 用AC008~014、018分阶段条件 |
| 旧00 §11.1 | 低敏感简化审批、高敏感回Chat | 废弃默认权限和路由既成事实 | 展示/action/入口各有正式依据；Chat未停审不能作输入 | 用AC016/023/024，缺合同blocked |
| 旧00 §11.2/11.3 | 4/4、100%恢复与P0通过、文档/测试齐全即主功能完成 | 废弃当前完成声明 | 本轮无运行与实施证据，后续正式文档尚未获准重写 | 38AC仅为条件，当前not_evaluated |
| 旧00 §11.1 | 明文凭证0 | 保留禁止语义 | 不允许将安全要求冒称已运行安全测试结果 | 用全局AC037/038及VETO材料边界 |

采用38项条件与六项核心否决；未采用无来源E2E/成功artifact或把pending provider本身当所有需求不可成文。当前可成文的是保护与失败语义，实际正向资格和证据仍待正式对接。

## 5. 前后对比

| 误读 | 收口方向 | 原因 |
|---|---|---|
| 四平台安装/配置成功即项目验收 | 按各adapter资格与五能力边界判断，支持/拒绝/未知都须准确 | G004与FR的P0语义不表示4/4运行 |
| 列测试动作证明可验收 | 写对象及成立条件，运行证据由后续05/06定义和真实产生 | 本Step是需求验收，不是测试实施 |

## 6. 取舍与复杂度

采用固定三列、五类别、按节点串行的AC；每FR单独功能条件，规则/数据/质量按节点收口，全局禁止与真实性只定义一次。未采用把全部FR压成一个“桥接成功”，也不照搬历史TC/执行报告。预计38项，分六组写入即可，无需另建附录；VETO仅核心边界破坏，不将普通缺陷或未选provider一律设为否决。

## 7. 结构化中间产物

### 7.1 C-BR-1验收

| 验收类别 | 验收项 | 验收条件 |
|---|---|---|
| 核心能力闭环验收 | AC-BR-001 受权关系成立 | C1的主体、位置、目标、方向/action、安装资格和内部basis分别明确，正常退出为受权局部关系，缺口退出为不执行的waiting/blocked，不能以配置成功冒称激活。 |
| 功能能力验收 | AC-BR-002 配置与secret引用准入 | FR001的platform/installation/capability revision、路由约束和opaque secret ref可核验；未选/失效provider或未知资格不激活，不使用默认token/身份fallback。 |
| 功能能力验收 | AC-BR-003 绑定生命周期 | FR002建立、更新、暂停、撤销均有正式basis和版本；撤销/失效阻止新操作及旧排队派发，旧外部效果保留历史语义。 |
| 功能能力验收 | AC-BR-004 主体/位置映射 | FR003的identity/channel/message/thread在platform+installation+kind+binding generation隔离，typed目标可回链；同名/同external_id不串绑，不自动创建GlobalMember、频道或Conversation。 |
| 规则 / 边界验收 | AC-BR-005 C1边界保护 | BR001~005的owner、双重资格、主体kind、显式变化与secret禁止成立；管理重复按BR017复用结果，冲突/目标替换不放行。 |
| 数据归属验收 | AC-BR-006 C1局部truth与引用 | DR001~003只为本仓配置/relation/mapping；DR004只是带来源/版本能力snapshot；DR005/006只为权限与secret ref，不能冒称认证/裁决或凭证truth。 |
| 非功能验收 | AC-BR-007 受权准入与版本一致性 | NFR001/002的当前资格、secret边界、重复管理语义和撤销竞争均可判断，不使用旧generation绕授权，不宣称当前实测SLA。 |

C1映射自检：FR001->002，FR002->003，FR003->004；共用001/005/006/007；BR001~005、DR001~006、NFR001/002均承接。VETO来源见§3.1，不新增权能。故事、功能、规则、数据、接口IF001和验收已回链。回填摘录为上表；`design_self_review=pass`，仅能力级设计停审，允许C2。

### 7.2 C-BR-2验收

| 验收类别 | 验收项 | 验收条件 |
|---|---|---|
| 核心能力闭环验收 | AC-BR-008 可解释入站交接 | C2从可信受权来源交接正式owner，独立说明ACK、accepted fact/manifestation ref、拒绝/待定/未知；没有safe材料或actor合同则blocked，不声称可靠接管或Turn已存在。 |
| 功能能力验收 | AC-BR-009 可信验证与接管 | FR004依据平台当前验证/时效合同和binding，重复/冲突/伪造/过期来源安全处置；回环只信验证来源及本仓intent/locator关系；可靠接管须安全可恢复ref或owner已接纳，ACK单列。 |
| 功能能力验收 | AC-BR-010 正式对话交接 | FR005显式区分Conversation AppendFact/ManifestExternalFact，Integration actor、BridgeMapped/digest及材料准入按正式合同；actor责任链不被integration来源证明替代；结果未知同identity对账。 |
| 功能能力验收 | AC-BR-011 消息变化与线程差异 | FR006的create/edit/delete指向原映射与可解释source version，缺映射/不可比保gap或隔离；不支持thread/变化明确unsupported或获准degraded，不默换频道/伪装普通消息，不删除内部truth。 |
| 规则 / 边界验收 | AC-BR-012 C2来源及阶段保护 | BR006~009和共享017/018成立；ACK不推进owner complete，source marker不自授权限，digest不赋材料存储/读取权限，duplicate不重造owner效果。 |
| 数据归属验收 | AC-BR-013 入站局部记录与owner ref | DR007与DR008各自归属明确，复用DR003/005/010/014/015；raw event/body不落durable，accepted ref不被本仓metadata伪装成Turn。 |
| 非功能验收 | AC-BR-014 入站时限与一致性 | NFR003/004的当前平台时限、可恢复接管、operation差异、ACK/owner位置隔离均可判断；未核验时限或无来源ref的分支不报告可用。 |

C2映射自检：FR004->009，FR005->010，FR006->011；共用008/012/013/014；BR006~009、DR007/008及共享ref/cursor、NFR003/004已承接，接口IF002/003不另造泛用提交面。回填摘录为上表；`design_self_review=pass`，允许C3。

### 7.3 C-BR-3验收

| 验收类别 | 验收项 | 验收条件 |
|---|---|---|
| 核心能力闭环验收 | AC-BR-015 安全外显与交付 | C3的committed来源、当前可见/外显basis、目标及允许材料成立，正常退出为独立已知receipt，缺口/未知为blocked/indeterminate；内部commit不自动形成外部成功。 |
| 功能能力验收 | AC-BR-016 安全外显与Gate降级 | FR007派发前重核当前binding/visibility/Policy/Gate；敏感正文不进payload，存在性、提示、受控入口、action分别获准；低敏感不默认有按钮，入口未建立不造URL。 |
| 功能能力验收 | AC-BR-017 附件引用交接 | FR008入/出站附件经Artifact正式准入、访问及传播ref；撤销/过期不可消费，必要附件缺失阻塞，省略有owner许可；不持久化文件或替换永久公开URL。 |
| 功能能力验收 | AC-BR-018 intent/attempt/receipt | FR009来源/目标/binding/projection/operation/effect稳定，每attempt回指原intent；解析平台业务结果而非只看HTTP；platform_accepted不等已读，崩溃/lease失效/超时为未知直至权威对账。 |
| 规则 / 边界验收 | AC-BR-019 C3展示与效果保护 | BR010~013及共享019/021成立；未提交或不可外显source不发送，不静默改target/材料版本，不编辑/删除非mapping外部对象，不以unsupported伪装新普通消息。 |
| 数据归属验收 | AC-BR-020 交付记录与材料ref | DR009仅为局部效果记录，DR010/011仅为正式source/安全材料/附件ref，复用DR003/005/006；不拥有平台消息truth、读达或正文副本。 |
| 非功能验收 | AC-BR-021 外部隔离与安全一致性 | NFR005~007的外部失效隔离、安全投影/附件、effect continuity均满足判断口径；外部不可用不改内部truth，unknown不被改名成功或盲重试。 |

C3映射自检：FR007->016，FR008->017，FR009->018；共用015/019/020/021；BR010~013、DR009~011与NFR005~007已承接。IF004/005与共享附件来源一致，receipt不越owner；回填摘录为上表。`design_self_review=pass`，允许C4。

### 7.4 C-BR-4验收

| 验收类别 | 验收项 | 验收条件 |
|---|---|---|
| 核心能力闭环验收 | AC-BR-022 受控交互责任 | C4从可信平台交互绑定责任、target/action及当前owner资格后交接正式动作，结果/ACK分离；验证或资格不足不执行，unknown不默认成功。 |
| 功能能力验收 | AC-BR-023 回调验证与动作绑定 | FR010的installation、actor、source message/intent、target/action/owner version、expiry一致；伪造/context篡改/跨user或target/撤销/过期拒绝，同interaction重放不生成新效果；回显受当前读取资格限制。 |
| 功能能力验收 | AC-BR-024 正式动作责任交接 | FR011由owner二次核验并决定正式Gate/Decision；低敏感、reaction、签名或管理员身份不默认授权；不直调Runtime/Tools，HTTP/deferred只为平台协议结果，unknown保原identity。 |
| 规则 / 边界验收 | AC-BR-025 C4责任及owner保护 | BR014~016及共享006/017/019/021成立；来源认证、internal责任、当前action三者不互替，私有URL/context/token只在private seam，不本地维护Decision。 |
| 数据归属验收 | AC-BR-026 验证记录与owner动作ref | DR012只为adapter-local验证/重放，DR013为owner结果ref，复用DR003/005/009；不保存审批正文、私有context、response_url或interaction token，不把按钮状态当truth。 |
| 非功能验收 | AC-BR-027 交互时限与单次效果 | NFR003的interaction分支及NFR008/009成立；deferred期限不延长token/自动批准，重复/unknown/owner状态变化不产生额外效果，读取旧结果也遵当前可见资格。 |

C4映射自检：FR010->023，FR011->024；共用022/025/026/027；BR014~016、DR012/013、NFR003/008/009及IF006/007均承接。owner动作未被本仓批准替代；回填摘录为上表。`design_self_review=pass`，允许C5。

### 7.5 C-BR-5验收

| 验收类别 | 验收项 | 验收条件 |
|---|---|---|
| 核心能力闭环验收 | AC-BR-028 失败恢复与安全追溯 | C5能定位原operation/effect、位置/缺口与basis，受权修局部状态并真实说明恢复/交接；来源/probe缺失保持blocked/missing_source/indeterminate，不以再发一次抹除未知。 |
| 功能能力验收 | AC-BR-029 去重/cursor/gap | FR012的management/inbound/callback/outbound/recovery-handoff namespace独立，同键同义复用、变义冲突；cursor仅在可比stream/epoch推进，protocol/owner/effect位置分离，gap关闭有权威覆盖依据。 |
| 功能能力验收 | AC-BR-030 顺序/限流/安全retry | FR013按已定义lane和平台真实bucket/header受序、Retry-After下界及预算约束；只有无副作用证明和当前依据才重试；超预算/未知停止自动派发，不默改目标或打破顺序。 |
| 功能能力验收 | AC-BR-031 受控回放/对账 | FR014有显式recovery basis、原source/effect和权威query/probe/baseline才续交；missing/expired/revoked ref不生成替代正文，dedup窗口不明/过期不自动重放；重建仅修本仓mapping/cursor，不产生新内部/外部效果。 |
| 功能能力验收 | AC-BR-032 安全审计交接 | FR015覆盖binding、交接、attempt/receipt、callback、未知/gap/恢复及handoff的安全ref/版本/有限reason；本地intent/attempt与真实consumer disposition分离；接收不可用有获准预算，强制准入不足限制相应操作。 |
| 功能能力验收 | AC-BR-033 局部安全读取 | FR016按当前scope/visibility只读body-free状态，denied/unavailable可解释；读取不刷新source、修mapping、推进cursor或触发replay，维护为单独受权变更。 |
| 规则 / 边界验收 | AC-BR-034 C5效果及恢复保护 | BR017~024全部成立；timeout/lease失效不是无效果证明，恢复不绕撤销/当前授权，gap/重放有来源和覆盖，查询不反写真相，审计不复制正文/凭证或伪造接受。 |
| 数据归属验收 | AC-BR-035 恢复与位置局部truth | DR014~016只为本仓位置、去重、恢复及handoff记录；结果/source/basis/secret仍正式ref，不拥有Bus/owner/平台完整性或Observability证据裁决，禁止材料由全局AC037覆盖。 |
| 非功能验收 | AC-BR-036 有限预算与可追溯恢复 | NFR010~014全部有判断依据：真实限流/预算、未知保守恢复、安全关键变化追溯、位置/去重窗口一致、no-write观察；未知预算不默认为无限，不宣称恢复时长或真实证据通过。 |

C5映射自检：FR012->029、013->030、014->031、015->032、016->033；共用028/034/035/036；BR017~024、DR014~016、NFR010~014及IF008~011全覆盖。回填摘录为上表；`design_self_review=pass`，五能力均完成需求小循环设计停审，允许全局与跨能力审计。

### 7.6 全局验收

| 验收类别 | 验收项 | 验收条件 |
|---|---|---|
| 数据归属验收 | AC-BR-037 全局禁止材料 | DR017~020在全部durable、观测、handoff/report/evidence出口被排除；raw消息/附件/内部正文、credential/私有callback/带凭证URL、敏感审批正文及未获准存在性不保存，不用可还原正文的派生材料规避边界。 |
| 非功能验收 | AC-BR-038 全局安全与真实阶段 | NFR015/016的材料白名单、低基数安全观察及配置/ACK/owner接受/平台receipt/consumer结果分别成立；不得捏造账号、token、run、test、receipt、artifact、evidence、verdict、signoff或ready，缺证据保持not_evaluated。 |

### 7.7 一票否决项

| 否决项 | 整体不应判定通过的条件 | 明确来源 |
|---|---|---|
| VETO-BR-001 真相及身份越界 | 将内部owner或平台事实归本仓，外部delete抹内部truth，或external_id自动创建GlobalMember | G001；BR001/003/009；AC004/011/020 |
| VETO-BR-002 未授权操作 | 未证明平台安装和内部当前basis即放行，绕撤销/跨主体或目标操作，低敏感/签名默认获准action | G002；BR002/004/010/011/014/016；AC003/016/023 |
| VETO-BR-003 材料/凭证泄露 | durable或日志/证据保存禁止body/secret/私有callback/敏感审批，敏感Gate正文外显或附件非法公开传播 | G002/005；BR005/011/012/021；DR017~020；AC017/037/038 |
| VETO-BR-004 阶段或证据伪造 | ACK冒称owner提交，内部commit冒称外部送达，callback响应冒称Decision，本地handoff冒称consumer接受，伪造运行/验收/证据/signoff/readiness | G003/005；BR007/013/016/022；AC008/018/024/032/038 |
| VETO-BR-005 效果/位置或读取破坏 | unknown/timeout/lease失效后盲重试或换identity/target，越gap虚报complete，无有效窗口自动重放，query触发维护写入/效果 | G003/005；BR017~020/023/024；AC029~031/033/034 |
| VETO-BR-006 私有审批/直接执行 | 本仓批准Gate、写Decision或从外部回调直接执行Runtime/Tools而不经owner正式动作 | G001/002；BR015；AC022/024/025 |

六项仅针对核心不变量破坏；平台暂未支持、provider未选或一般展示缺陷不是新增VETO。blocked/unsupported不能冒称正向通过，发布资格另需实际正式合同及真实材料。

### 7.8 能力级停审与跨能力审计

| 节点 | 条件与来源覆盖 | 设计停审 |
|---|---|---|
| C1 | AC001~007；FR001~003、BR001~005、DR001~006、NFR001/002、IF001 | pass；非用户/owner签署 |
| C2 | AC008~014；FR004~006、BR006~009、DR007/008及共享refs/cursor、NFR003/004、IF002/003 | pass；非运行通过 |
| C3 | AC015~021；FR007~009、BR010~013、DR009~011、NFR005~007、IF004/005 | pass；非投递成功 |
| C4 | AC022~027；FR010/011、BR014~016、DR012/013、NFR003/008/009、IF006/007 | pass；非Decision提交 |
| C5 | AC028~036；FR012~016、BR017~024、DR014~016、NFR010~014、IF008~011 | pass；非consumer/evidence接受 |
| 全局 | AC037/038；DR017~020、NFR015/016及共享BR001/021/022 | pass；禁止材料与真实阶段不重复定义 |

跨能力审计：五类别、38AC、6VETO均有来源，全部16FR至少一独立功能条件；24规则和20数据/16质量项均有条件承接。共享附件/幂等/审计由唯一主节点定义并保护相关节点；无重复owner、无孤儿验收、无新增功能/字段/运行证据。Step16将用FR主矩阵再次检查所有映射。

## 8. 回填草稿

正式§14.1采用§7.1~7.6的38条件，§14.2采用§7.7的六VETO及限定说明；§7.8作为延伸阅读。所有条件当前为需求判断，不写测试步骤、实测通过或能力级过程记录。

## 9. 待确认事项

BR-UP-001~009仍open；正向受影响条件当前not_evaluated/blocked。明确unsupported是能力结果，不可以假装该平台正向能力已验收；保护性条件成立也不解锁发布/运行readiness。

## 10. 进入下一步条件

自检：五节点验收及小循环设计停审完成；38AC五类别、6VETO来源及跨能力审计齐全；只读静态编号检查得到16唯一NFR/38唯一AC，非项目测试。允许Step15，正式装配仍等待Step16/17。

```text
gate_status = pass
gate_reason = five_capability_acceptance_and_cross_review_complete
current_module = completed
next_allowed_action = read_step_15_and_upstream_ledgers
source_files = Step7/9/10/11/12/13
formal_backfill_allowed = after_step_17_three_level_gate
commit_required = false
```
