# L6-bridges 00 Step 9：功能需求

> 状态：done / pass；回填00 §9；full-restart。

## 1. 状态与 Step 内计划

开工确认：六标准、台账/flow、Step7五卡和Step8、需求SOP Step9、书写规范§4.9已读；进入条件pass。依C1~5归并能力，再补输入/输出/触发/失败与平台差异；不按对象CRUD或API拆分。

| 顺序 | 主题思考 | 结构化/回填 | 自检 |
|---|---|---|---|
| C1 | 配置secret、绑定、关系定位done | done | pass |
| C2 | 验证接管、owner交接、消息差异done | done | pass |
| C3 | 外显/敏感、附件、交付效果done | done | pass |
| C4 | 交互验证、责任交接done | done | pass |
| C5 | cursor、限流、安全恢复、审计、读取done | done | pass |

## 2. 输入

Step7五卡§3~7；Step8十一故事；Step5平台附录与Step6seam资格；不继承旧FR编号或具体SDK默认行为。

## 3. SOP 逐项问题回答

| 问题 | 回答 |
|---|---|
| 当前节点与必需能力？ | 按C1三主题、C2三主题、C3三主题、C4两主题、C5五主题编号，共16项。 |
| 输入输出触发失败？ | 从五卡§4~7提取，区分平台协议确认、owner结果、局部效果与handoff；无合同即blocked/unknown。 |
| 核心/外围？ | 16项均保护核心；展示美化/配置批处理候选不入当前FR。 |
| 能否回指故事？ | 每项至少一个故事；恢复/审计不拿“系统角色”伪造新故事。 |
| 故事有无遗漏？ | C3敏感与附件各有独立FR；C4正向责任和抗重放各有承接。 |
| 能否进入规则？ | 主题边界足够，规则要分别约束身份/授权、正文、阶段、差异和恢复。 |

## 4. 诊断

旧FR用“4平台接入”“身份映射”掩盖安装/主体/授权链，P1限流/重放可误成首版不保护；旧功能默认低敏感审批并暗含RPC可用。不能照搬。

## 5. 前后对比

平台列表/CRUD -> 能力主题；四平台一律成功 -> capability-specific支持/降级/unsupported；retry优化 -> 最低安全保护；历史编号全部不作为新追溯链。

## 6. 取舍与复杂度

采用16核心FR、按节点五表、行为语义表与平台差异表。P0要求闭合授权、拒绝/未知和反例，不表示四平台全部正向支持/运行完成；未采用先实现再猜失败语义。语义状态不是最终enum，schema/函数/表/SDKpin仍由02~04收口。多表分批写，不压成接口清单。

## 7. 结构化中间产物

### 7.1 C-BR-1

| 功能需求 | 能力类型 | 说明 | 支撑的核心能力闭环 | 对应的用户故事 |
|---|---|---|---|---|
| FR-BR-001 接入配置与secret引用准入 | 核心闭环能力 | 平台、安装、能力版本及secret引用可验证，不以默认配置激活 | C-BR-1 | US-BR-001 |
| FR-BR-002 显式受权绑定生命周期 | 核心闭环能力 | 主体/目标/方向/动作依据明确，暂停撤销与版本变化可解释 | C-BR-1 | US-BR-001 |
| FR-BR-003 外部主体与位置关系定位 | 核心闭环能力 | identity/channel/message/thread关系按installation隔离并回链内部typed ref | C-BR-1 | US-BR-002 |

停审：来源C1卡；没有自动建身份、channel或权限。

### 7.2 C-BR-2

| 功能需求 | 能力类型 | 说明 | 支撑的核心能力闭环 | 对应的用户故事 |
|---|---|---|---|---|
| FR-BR-004 入站可信验证与受控接管 | 核心闭环能力 | 分平台验证、防重放、来源标记与回环识别，ACK单列 | C-BR-2 | US-BR-003 |
| FR-BR-005 正式对话交接与结果解释 | 核心闭环能力 | 显式承接owner target mode和accepted/ref结果，不本地创建Turn | C-BR-2 | US-BR-003 |
| FR-BR-006 消息变化与线程差异表达 | 核心闭环能力 | create/edit/delete/thread按原映射、版本及capability表达，不伪等价 | C-BR-2 | US-BR-004 |

停审：来源C2卡；FR004的回环识别只信已验证来源与本仓intent/locator关系，不信外部自报marker。

### 7.3 C-BR-3

| 功能需求 | 能力类型 | 说明 | 支撑的核心能力闭环 | 对应的用户故事 |
|---|---|---|---|---|
| FR-BR-007 安全外显与敏感Gate降级 | 核心闭环能力 | 只消费committed且允许外显的材料；敏感提示/存在性也需依据 | C-BR-3 | US-BR-005、US-BR-006 |
| FR-BR-008 附件引用受控交接 | 核心闭环能力 | 入/出站附件均经Artifact准入与传播依据，过期/撤销可解释 | C-BR-3 | US-BR-007 |
| FR-BR-009 稳定投递效果与receipt | 核心闭环能力 | intent/attempt/平台已知结果分开，unknown不称送达 | C-BR-3 | US-BR-005 |

停审：来源C3卡；FR008是共享附件边界，C2入站复用而不定义第二正文owner。

### 7.4 C-BR-4

| 功能需求 | 能力类型 | 说明 | 支撑的核心能力闭环 | 对应的用户故事 |
|---|---|---|---|---|
| FR-BR-010 交互验证与受权动作绑定 | 核心闭环能力 | 安装、actor、来源消息、target/action、时效与单次语义共同有效 | C-BR-4 | US-BR-009 |
| FR-BR-011 正式动作责任交接 | 核心闭环能力 | 操作仅交接owner，由owner决定Gate/Decision，回调ACK独立 | C-BR-4 | US-BR-008、US-BR-009 |

停审：来源C4卡；低敏感、signed callback和管理员不构成默认审批资格。

### 7.5 C-BR-5

| 功能需求 | 能力类型 | 说明 | 支撑的核心能力闭环 | 对应的用户故事 |
|---|---|---|---|---|
| FR-BR-012 去重、cursor与gap解释 | 核心闭环能力 | 各namespace复用结果/隔离冲突，位置不可跨流比较或越gap complete | C-BR-5 | US-BR-010 |
| FR-BR-013 顺序、限流与安全retry | 核心闭环能力 | lane/bucket、服务限流与无副作用重试证明明确 | C-BR-5 | US-BR-010 |
| FR-BR-014 受控回放与人工对账 | 核心闭环能力 | 只修局部状态，同effect恢复；缺正式来源/probe保留未知 | C-BR-5 | US-BR-010 |
| FR-BR-015 安全审计材料交接 | 核心闭环能力 | 只交body-free材料并区分本地attempt和真实consumer接受 | C-BR-5 | US-BR-011 |
| FR-BR-016 局部状态安全读取 | 核心闭环能力 | 按读取资格解释binding/mapping/cursor/receipt，不附带写入或恢复 | C-BR-5 | US-BR-011 |

停审：来源C5卡；FR012/013保护C2~4，不因主节点C5而延后到可选版本。16项为P0语义边界与最低验证要求，不是4/4真实运行承诺；外围增强无当前FR编号。

### 7.6 输入、输出、触发与失败

| FR | 输入 | 输出 | 触发 / 必要依赖 | 失败结果 |
|---|---|---|---|---|
| FR-BR-001 | 平台安装/能力版本、route、opaque secret refs | validated或waiting/blocked配置版本 | 显式配置；provider/capability依据 | 未选provider、过期secret或未知schema不激活 |
| FR-BR-002 | basis/ref/version、主体目标方向action、期望generation | active/suspended/revoked或waiting/blocked关系 | 显式管理；FR001、owning authorization | 缺授权/冲突拒绝；撤销后排队操作不外呼 |
| FR-BR-003 | installation、external locator/kind、内部typed ref、binding basis | 受权mapping/ref与失效状态 | 显式绑定或owner结果；FR002 | tenant/kind/目标不符隔离，不自动建身份 |
| FR-BR-004 | 瞬时raw请求、verified来源、operation identity | 安全接管/拒绝、ACK结果、可信source marker | 平台事件；FR001~003/012 | bad signature、过期、回环、冲突隔离；不可恢复材料不冒称接管 |
| FR-BR-005 | binding、safe材料ref、target mode、owner依据 | owner结果及accepted fact/manifestation ref | 授权入站；FR004/012 | 材料/actor合同缺失blocked；提交未知indeterminate |
| FR-BR-006 | 原消息mapping、变化operation/version、thread capability | 获准变化或unsupported/degraded/gap | 消息变化；FR003/005/012 | 不可比/缺映射隔离；外部delete不抹内部truth |
| FR-BR-007 | committed ref/version、外显依据与安全projection ref | 允许平台表达或无动作/blocked | 内部已提交变化；FR002/003、owner外显依据 | 敏感内容不进入payload；入口未建立不造URL |
| FR-BR-008 | authorized Artifact/ref、传播/访问依据 | 外部attachment/link ref或expired/unavailable/blocked | 入/出站附件；Artifact准入和FR007传播资格 | 必要附件缺失阻塞；可省略须显式允许 |
| FR-BR-009 | source/target/binding/projection版本与effect identity | intent、attempt、known receipt或indeterminate | 允许外显；FR007/008/012/013 | timeout/崩溃不盲发，HTTP2xx仍解析平台业务结果 |
| FR-BR-010 | verified interaction、message relation、actor/action/expiry | verified或invalid/expired/replayed/blocked | 外部交互；FR003/009/012 | 篡改/跨target/撤销拒绝，不泄露历史结果 |
| FR-BR-011 | 当前owner状态、责任/Policy/Gate依据、bound action | owner result/ref与独立transport响应 | 已验证动作；FR010 | 无action资格blocked；owner未知不新ID重交 |
| FR-BR-012 | namespace/stream/epoch、identity、position/comparator、既有结果 | duplicate/conflict/disposition、cursor/gap | 所有副作用及回放 | 无comparator保不可比；gap未证明覆盖不关闭 |
| FR-BR-013 | 有序lane、平台bucket/header、attempt结果与retry预算 | eligible/retry_wait/blocked/indeterminate | 派发/恢复；FR009/012 | 超预算停止；unknown不是retryable失败证明 |
| FR-BR-014 | 原ref/effect/cursor、recovery basis、权威query/baseline | reconciled/blocked/missing_source/indeterminate | 显式恢复；FR012/013、来源/平台能力 | 不可重解析/无probe保未知；不改内部或平台truth |
| FR-BR-015 | 安全ref/版本/有限reason与handoff identity | 本地handoff状态及真实consumer结果 | 局部操作；Observability接收合同 | 不可用保受限安全backlog；强制审计不足阻止操作 |
| FR-BR-016 | 当前read qualification与局部ref/scope | body-free状态或denied/unavailable | 授权查询；不含维护动作 | 读取不更新mapping/cursor/source，不默认回显raw材料 |

### 7.7 平台差异需求矩阵

| adapter目标 | 主体/位置定位语义 | 消息/线程/附件要求 | 接入与callback | cursor/限流/恢复要求 |
|---|---|---|---|---|
| Slack | installation/workspace+account/channel/message/thread | edit/delete/thread与附件按scope及pin核验；不能复制正文 | 签名+时效；Events ACK时限独立；OAuth grant不等内部授权 | event_id去重；ts不作完整watermark；method/workspace/channel限流；history/replies发行类别影响回放 |
| Mattermost | server instance+installation/team/user/channel/post/root | 部署版本决定能力；Blocks/legacy各自核验；附件授权不默认继承 | 可信server/plugin或context认证合同；不假设Slack验签；PAT权限最小化 | session/eventid可用性待部署合同；不能假定完整续接；限流按实例配置/响应核验 |
| Telegram | bot安装+account/chat/message/可选topic | 编辑删除权限/窗口、附件链接有效性重核cloud版本；不承诺普通删除通知完整 | polling/webhook互斥；webhooksecret；callback ACK独立于owner动作 | per-bot update/offset隔离；gap不可默认恢复；retry_after与配额/留存待官网复核 |
| Discord | application安装+guild或DM/channel/user/message/thread channel | message content依intent/权限；thread/edit/delete/附件按pin核验 | HTTP Ed25519或认证Gateway交互二选一；3秒初始响应、15分钟follow-up token | session+seq按resume资格；invalid session留gap；bucket/majorresource/global动态限流 |

来源资格见Step5附录。矩阵是adapter必需核验/表达范围，不是已选择SDK、schema或平台支持度报告；全平台共同失败词不能抹平私有协议差异。

### 7.8 协议阶段语义

| 方向 | 阶段/结果 | 禁止等同 |
|---|---|---|
| binding | configured -> waiting/blocked或active -> suspended/revoked | active不证明平台可用或业务已提交 |
| inbound | received -> verified/authorized -> owner_handoff -> accepted/rejected/pending/indeterminate | transport ACK不等owner accepted；accepted fact不自动等Turn |
| outbound | prepared -> dispatching -> platform_accepted/known_rejected/retry_wait/indeterminate，缺前置blocked | internal commit不等external receipt；platform_accepted不等用户已读 |
| callback | verified -> owner_handoff或invalid/expired/replayed/blocked -> owner独立结果 | HTTP/deferred response不等Decision |
| recovery | gap/unknown -> 权威reconcile或blocked/missing_source/indeterminate | lease失效/重启不证明未发生效果 |

这些是需求语义，不是最终enum/schema；02/03必须保留状态主语及转移guard，不能由实现者猜测新成功状态。

## 8. 回填草稿

正式§9采用§7.1~7.8的需求结论；停审过程留calibration，不添加endpoint、方法签名或平台SDK默认值。

## 9. 待确认

所有受影响正向分支按BR-UP保持blocked；不把capability名称或safe ref占位解释为可调用实现。

## 10. 进入下一步条件

自检：16唯一FR覆盖11故事、五节点；每FR有输入输出触发失败；平台差异和阶段不等同；功能主题不按CRUD/API拆。允许Step10。

```text
gate_status = pass
next_allowed_action = read_step_10_then_rules
commit_required = false
```
