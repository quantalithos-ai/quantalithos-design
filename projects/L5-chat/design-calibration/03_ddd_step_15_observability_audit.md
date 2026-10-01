# L5-chat 03 · Step 15 可观测性、低敏诊断与审计边界

## 1. Step 状态

> done；pass_with_upstream_blockers；2026-10-01。SOP Step15、书写规范5.14；回填正式03 §14。
> 本项目不拥有Observability backend或业务audit；以下埋点是planned切口，默认disabled，没有日志/指标/报告生成事实。

### 1.1 Step内计划

| 批次 | 内容 | 状态 |
|---|---|---|
| 15-A | 日志/诊断字段allowlist及现有schema核对 | done |
| 15-B | 指标需求与未绑定transport分离 | done |
| 15-C | owner审计、trace、用户支持交付与redaction | done |

复杂度：采用现有DiagnosticContext/DiagnosticPort，无另建telemetry backend/store。调用链已有Step9诊断三flow独立图，本Step只增加分类/禁止字段，不重复图。

## 2. 本步输入

正式01安全横切/02诊断边界、Step6 DiagnosticContext/HandoffView、Step7 DiagnosticPort/SDK binding、Step8/9两诊断意图和EmitDiagnosticHandoff、Step12错误/13unknown/14diagnosticMode；Governance Step15的日志/指标/审计分离与字段禁止粒度。其truth trace/outbox/history不能移入Chat。

## 3. SOP问题回答

| 问题 | 回答 |
|---|---|
| 1. 哪些flow必须审计 | owner业务提交与审批审计由对应owner经正式SDK处理；Chat不写审计。用户support只低敏交付，不替代业务audit。 |
| 2. 哪些异常需定位 | capability缺失、source gap/恢复、local失败/清理失败等映射允许category/reason；不自动收集正文或发送异常。 |
| 3. 哪些路径需要指标 | 查询/派发反馈/消费/恢复/图布局/清理/配置/host等有未来指标需求，当前DiagnosticPort不能传数值，自动metrics未绑定，明确blocked。 |
| 4. 字段是什么 | 正式交付仅DiagnosticContext六字段，返回HandoffView四字段；无raw ref/token/stack/日志包。日志/指标期望不能偷偷加字段。 |
| 5. 留给运维什么 | sink/backend、告警、采样/留存/SLO、生产指标及数值阈值；Chat不实现采集backend，不设计未确认接口。 |

## 4. 当前文档问题诊断

| 位置 | 问题 | 本步收口 |
|---|---|---|
| Step6 DiagnosticContext.userRequested=true | 自动埋点与schema不兼容 | 本轮无自动telemetry；所有正式交付须显式支持操作 |
| Step7 SDK diagnostic blocked | 可能以console/file/server直连补sink | 缺sink disabled/blocked，不旁路 |
| Step9诊断accepted | receipt可能被误称观测证据 | accepted只正式sink接收，非report/evidence/verdict |
| Process/运行/commit/test摘要展示 | 容易把可见摘要当真实验收材料 | safe ref可导航正式owner，不能在Chat认证报告 |

## 5. 改动前后对比

| 项 | 改前 | 改后 | 原因 |
|---|---|---|---|
| log/metrics | 容易照搬后端埋点表 | 现有低敏schema、blocked扩展明确区分 | 不新增未定义transport |
| trace | UI动作容易自造trace关联 | 如SDK正式提供safe ref则只用于正式链路；诊断不传 | 不解析opaque trace或造owner审计 |
| 错误 | 原SDK message可能外泄 | category/reason finite | 最小披露 |
| 交付 | accepted可能等于结果已审计 | receipt仅接收，unknown不重送 | 证据边界 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 显式用户支持+既有六字段allowlist | 安全且可实现本地negative | 缺自动性能指标 | 当前采用；正向sink仍blocked |
| 自接第三方telemetry/console dump | 易定位 | 绕SDK/泄露secret或隐藏关系 | 不采用 |
| 自建Chat audit/report | 看似统一 | 夺owner/Observability truth | 不采用 |
| 扩展诊断schema传计数/耗时 | 可做性能监控 | 尚无正式sink合同/敏感预算 | reserved/blocked，另行校准后才能采用 |

## 7. 结构化中间产物

### 7.1 日志/诊断观察切口

“级别”是未来定位严重性建议，**不是当前写log API**。默认没有落盘/console/网络IO；明确用户support时由当前安全状态映射既有DiagnosticContext，再调用唯一DiagnosticPort.send。

| 位置/flow | 定位级别建议 | category/reason字段 | 目的/边界 |
|---|---|---|---|
| SdkCapabilityBinding.require/启动配置失败 | warn | capability/unavailable或unsupported | 说明缺正式能力；不传profile/endpoint/缺失raw键值 |
| Entry/Load*资格拒绝 | info | capability/restricted或source_unknown | 仅获准support语境，不传隐藏对象/人数/目标ref |
| command effect未知 | warn | local_failure/waiting | UI保留attempt探测入口；诊断不传payload/association/result refs |
| CommandResultGate拒绝authority | warn | capability/source_unknown | 只code分类，不上传收到的错误材料 |
| source gap/resume失败 | warn | continuity/stale或unavailable | 不传cursor/订阅topic/被隐藏节点 |
| late query/CAS冲突 | debug建议，当前不自动采集 | local_failure/conflict | 无频繁自动日志；support使用当前状态，不追溯raw回包 |
| revoke/evict failure | warn | local_failure/restricted或unavailable | 遮蔽保持，不声称清理成功；不传正文/磁盘路径 |
| unsafe/unsupported material | warn | capability/unsupported或source_unknown | 不保存不安全样本，不进breadcrumb |
| host/storage probe失败 | info | capability/unavailable或restricted | 不传device id/window title/raw origin |
| 用户support显式动作 | info | 当前上述合法category/reason | userRequested=true，只有current sessionepoch |
| diagnostic交付unknown | warn | 当前HandoffView.reason | 不再次发送以“上报上报失败”，防递归 |

日志allowlist只来自有限安全code；不将ownerref/actorref、session token、queryText、safeText、URL、附件正文、拓扑labels/counts、stack或SDK raw response序列化。sessionEpoch/requestId仅不含身份的局部关联，仍只当前session，不用于跨设备跟踪。

### 7.2 指标需求与绑定限制

| 指标需求 | 类型建议 | 代码切口 | 允许标签建议 | 当前可输出 |
|---|---|---|---|---|
| 当前query完整/partial/unavailable | counter | 20Query返回边界 | 查询族、安全姿态 | 无numeric transport，blocked |
| local CAS conflict/late discard | counter | store/coordinator | 有限模块/code | blocked，不把local ids作label |
| command unknown/probe收敛 | counter | Attempt/CommandResultGate | intent kind/结果姿态 | blocked；不作为业务成功率 |
| source gap/resume姿态 | counter/gauge建议 | continuity/recovery | source类别/ContinuityPhase | blocked；无raw source/cursor |
| 只读图/等价列表渲染预算 | histogram建议 | ReadOnlyProcessRenderer | 受控布局模式 | blocked；不得发送隐藏总节点数 |
| cleanup未确认 | counter | repository evict/guard | ClearReason/local姿态 | blocked；不声称durable删除 |
| host probe姿态 | gauge建议 | PlatformCapabilityAdapter | capability kind/availability | blocked |
| config拒绝 | counter | ConfigLoader | finite invalid分类 | blocked，无配置值 |
| diagnostic交付分类 | counter建议 | DiagnosticHandoffAdapter | category/status | 返回HandoffView，不新增自动指标 |

表中指标不进入ClientConfig或DiagnosticContext，不设计生产数值/labels wire。不允许为实现本表绕过SDK建立telemetry客户端；若未来新增正式metrics port，必须先校准字段、store/allowlist、用户控制、retain和测试，更新03/04后才实现。

### 7.3 审计事件归属

| 事件/事实 | Chat触发/呈现位置 | 本地可持字段 | 正式审计消费者/owner |
|---|---|---|---|
| Conversation/Turn业务提交 | SubmitConversationIntent/正式result反馈 | attempt安全refs/结果姿态，非audit record | Conversation正式owner |
| Gate/Decision审批 | GateCard/SubmitGovernanceIntent | safe Gate摘要、capability、formal result refs | Governance正式owner |
| Project/Work/Process变化 | 项目五tab/分层图/节点detail | qualifiedsafe projection/provenance/freshness | Work/Process各owner |
| Artifact/Evidence/commit/test材料 | safe reference/preview | allowlisted摘要/ref，不认证真实性/验收 | Artifact/对应证据owner |
| Member/Runtime摘要 | 节点/成员安全section | 正式safe摘要 | Identity/Member/Runtime owner |
| Workspace跨域safe read | 摘要/attention界面 | safe view/marker | Workspace只读模型，不创各域truth |
| 用户诊断支持 | Client*Requested/EmitDiagnosticHandoff | DiagnosticContext/HandoffView | 正式SDK低敏sink；CHAT-UP007未闭合 |
| visibility/清理 | 消费与CacheLifecycleRecord | local遮蔽/delete姿态 | 仅本地事实，不伪owner审计/后端删除证据 |

Chat不新增AuditPort、outbox、event bus publish、trace repository或report generator业务流程。Backend业务审计正确性不由UI按钮、ACK、日志或截图证明。

### 7.4 显式交付字段与调用闭环

| 输入字段 | 来源/检查 |
|---|---|
| requestId | LocalIdentityPort新diagnostic id，单次显式动作 |
| sessionEpoch | 当前trustedcomposition epoch，与session/currentfence匹配 |
| category | capability/continuity/local_failure有限分类 |
| reason | SafeReasonCode，无法安全映射则拒绝，不透传raw string |
| userRequested | literaltrue，React mount/background/reconnect不能伪造 |
| platform | 当前validatedPlatformKind，无device fingerprint |

调用：DiagnosticContextFactory.create→diagnosticMode判断→SdkCapabilityBinding.require(diagnostic)→DiagnosticPort.send(input,session)→DiagnosticHandoffViewFactory→currentcontext复核→safe输出。
disabled不调用send；缺bound返回blocked；accepted须正式diagnostic_receipt且只接收姿态；unknown不自动重送；失去current session不显示旧结果。错误不影响业务结果与visibility。

### 7.5 redaction、安全与证据检查

| 检查切口 | 验证目标（planned） |
|---|---|
| extra-field严格拒绝 | text/query/ownerref/token/URL/stack字段不能送sink |
| disabled零IO | 启动、mount、错误、重连均不会自动发diagnostic |
| current epoch/actor切换 | 旧支持结果不显示、不重送到新session |
| sink fake receipt | 不能确认真实diagnostic业务/acceptance；与真实数据隔离 |
| 图/list/AT隐藏 | 辅助标签/breadcrumb不泄露隐藏关系、人员计数 |
| 日志/指标artifact扫描 | 未来05要求raw body/secret不进入console、文件、截图及测试artifact；当前未运行 |
| accepted/unknown语义 | receipt不等report/evidence/readiness，unknown无重发 |
| backend排除 | 无内部bus、观测backend写入或审计认证逻辑 |

## 8. 回填草稿

正式03 §14采用§7日志定位/指标blocked/owner审计/显式低敏交付/redaction。传输只引用已定义DiagnosticContext/Port/HandoffView；不把指标意图写成已支持的schema。

## 9. 待确认事项

CHAT-UP007正式sink/低敏receipt/redaction和未来metrics能力继续blocked；具体采样、阈值、后端、retention由04/运维与owner确认。诊断缺失不能阻止安全本地UI，但正向交付不可用。

## 10. 进入下一步条件

所有观测字段可回指既有schema，自动telemetry缺口明确不实现，审计truth无越权，所有失败无虚假success。进入Step16测试切口；无log/run/test/evidence结果。
