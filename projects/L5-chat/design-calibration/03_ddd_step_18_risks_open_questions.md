# L5-chat 03 · Step 18 风险与待确认事项

## 1. Step 状态

> done；pass_with_upstream_blockers；2026-10-01。SOP Step18、书写规范5.17；回填正式03 §17。
> 只收口影响/确认方/未确认处理，不将required能力升级为SDK已有合同。

### 1.1 Step内计划

| 批次 | 内容 | 状态 |
|---|---|---|
| 18-A | CHAT-UP/WS-UP及当前正式00～02开放项 | done |
| 18-B | 本地设计closed与integration/后续waiting分层 | done |
| 18-C | 风险、待确认、解除条件与装配门禁 | done |

复杂度按来源/consumer影响整理表；无新增schema/state/phase。分层表已足以表达阻塞范围，不额外画风险树。

## 2. 本步输入

Step1～17、project_execution_ledger/03flow、正式00 §15/16与01 §15～17；重读L1-workspace当前台账 §4 WS-UP001～008（其正式00～07已停审，不代表外部合同已关闭）；Governance Step18风险分层和未确认处理框架。L6-bridges仍仅并行边界参考，未停审设计不作输入。

## 3. SOP问题回答

| 问题 | 回答 |
|---|---|
| 1. 哪些影响实现 | SDK exact publicexports/query/command/result/change/resume、Processsafeprojection、关系/目录provider、host/storage资格、生产config/quality和正式04～07。 |
| 2. 什么阻塞/什么优化 | 正向业务/安全存储/nativeintegration由对应blocker阻塞；整个实施开工须07与逐boundary门禁。Mobile/自动metrics/持久化扩展reserved，不能偷进V1。 |
| 3. 谁确认 | SDK及正式owner确认业务合同；产品/架构确认provider/覆盖；host维护方确认DesktopIPC/兼容；04/05/06/07维护者确认配置/测试/证据/移交。 |
| 4. 未确认怎么做 | safe blocked/unavailable/partial/unknown，不私连API/bus，不重建truth、不以原型/fake/ACK补正向成功，发现local缺口回前序原文件修复。 |

## 4. 当前文档问题诊断

| 位置 | 风险 | 收口 |
|---|---|---|
| 台账/旧正式03 | 旧03仍historical，不能正式移交 | Step19从当前已校准来源原位装配，装配后停止 |
| SDK source/package | 真实仓存在但只有genericunknown+runtimewiring骨架 | 保持CHAT-UP001～009正向blocked |
| 00 OPEN014/§16 | Process来源和AC编号与01/02有缺口 | owner方向按当前01/02明确，缺口不隐瞒；00本轮不改 |
| Workspace已完成07 | 可能误把其上游全ready | 继承WS-UP，消费safecontract需单独正式证明 |
| planned脚本/metrics | 设计可能被误当运行证据 | 只contract/CUT，没有run/results/readiness |

## 5. 改动前后对比

| 项 | 改前 | 改后 | 原因 |
|---|---|---|---|
| blockers | 局部重复/泛称pending | 来源、影响、确认与解除条件明确 | 方便后续逐binding恢复 |
| 设计关闭 | carrier/语言/layout可能继续误列open | localclosed与外部blocked分开 | 不掩盖真缺口也不造假blocker |
| downstream | 容易提前跳实施 | formal03后停审；04～07逐文档授权 | 保持文档顺序 |
| 多端/durable | 可能当V1已经可用 | Desktop-first、memoryOnly硬约束；扩展reserved | 无未验证承诺 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| local设计收稳、外部集成明确阻塞 | 可审查当前客户端契约 | 尚不可声明完整可实施 | 采用 |
| 把所有外部项当本地代码待办 | 可以立即写adapter | 实现者须猜owner/API/permission | 不采用 |
| 以fake/原型当闭口证据 | 可快速展示 | 无真实业务资格/幂等/清理证据 | 不采用 |

## 7. 结构化中间产物

### 7.1 上游风险与阻塞范围

| ID/风险 | 影响范围 | 缓解/未确认处理 | 确认方/解除条件 |
|---|---|---|---|
| CHAT-UP-001 SDK正式Chat消费面 | 所有businessadapters | 全部operation blocked；strict typedport不能以unknown方法填实现 | SDK+owner：exactexport/type、actor/source/visibility/redaction/compatibility逐项正式绑定 |
| CHAT-UP-002 Conversation变化/分页/恢复 | group/channel/dm/thread、Turn历史、跨端/离线 | 不订bus；gap/stale/blocked；ordinaryACK不confirmed | Conversation+SDK：scope/parent/page/lineage/changeidentity/cursor/coverage/resume |
| CHAT-UP-003 Governance命令与结果 | GateCard受控审批/探测/retry | 显示safe Gate；无qualified能力禁止派发；unknown只probe | Governance+SDK：actor/Gate/action、no-effectprepare、幂等/result/receipt/probe |
| CHAT-UP-004 Artifact safepreview/ref | 引用/预览/打开/过期 | 无body/自造URL；unavailable/blocked | Artifact+SDK+host：safe引用、visibility/expiry、正式preview/open |
| CHAT-UP-005 Workspace safeview/export | inbox/跨项目摘要/来源freshness | 只明确正式projection，不本地重聚truth | Workspace+SDK：safeview/source/freshness/attention/cursor/export合同及WS-UP相关closure |
| CHAT-UP-006 成员/Work/Runtime摘要 | 项目五tab、node运行/tool/commit/test、安全成员详情 | 分source/owner展示，不推project完成/Member在场/全公司目录 | Identity/Work/Member/Runtime/SDK：各safe summary/refs/currentaccess合同 |
| CHAT-UP-007 低敏诊断 | 用户support/可观测交付 | 默认disabled；无automaticmetrics/backend/日志旁路 | Observability+SDK：low-sensitivitysink/redaction/receipt；扩展metrics另校准 |
| CHAT-UP-008 Process消费面 | 整体→阶段→节点、BPMN并行fork/branches/join | Processowner已明确，projection未确认；blocked，原型/Work/log不能补图 | Process+SDK：safetopology/state/version/parent/nodeassociation/change/resume；00OPEN014后续来源修复 |
| CHAT-UP-009 关系/目录provider | 单群至多一项目/多群、双向入口、不同成员、全公司人员 | 未确认owner/provider保持blocked；逐targetaccess，目录可见不授予DM | Work/Conversation/产品架构/SDK/目录provider：bindingowner/constraints/unbind/revoke、人类AIcoverage/search/page/visibility |

### 7.2 Workspace继承项

| ID | 真实未闭合项 | Chat影响/处理 |
|---|---|---|
| WS-UP-001 | 六L1 owner的workspace-safequery/摘要/version | Workspace摘要正向blocked；不宣称跨owner原子read |
| WS-UP-002 | eventfamily/cursor/replay/rebuild | 无任意offset回放；formal ownerbaseline与接续 |
| WS-UP-003 | visibility owningchain/revoke/时效 | 每source独立access，不把Governance当统一授权中心 |
| WS-UP-004 | attentioninput/dedup/lifecycle | 不从未读Turn/Runtime状态推attention |
| WS-UP-005 | Personal/Project safe refs/queryscope | 缺subject/scope正式surface fail-closed |
| WS-UP-006 | SDK/product/sync/archive read/export | Chat不导出/归档未确认view或猜sync协议 |
| WS-UP-007 | sharedtype/error/event入core | 不复制未确认sharedschema、不扩Cargo |
| WS-UP-008 | personalexecution正式subject | 不由Chat创执行主语/Run |
| WS-UP-006-S | member-images静态seedowner | 非Chat消费范围；不得把liveWorkspace当静态seed，不新增实现需求 |

Workspace台账另有WS-LOCAL项与具体实现前置，仅在正式消费所需合同引用时再核对；本项目不替Workspace关闭其自身blocker。

### 7.3 本地/后续风险与待确认事项

| 事项/ID | 当前影响/阻塞范围 | 谁确认 | 未确认处理/解除 |
|---|---|---|---|
| CHAT-BASE-001 | 00 §16引用未定义AC-NFR008～024；需求追溯 | 00维护者后续授权 | 本轮不改00；只引用实际AC-NFR001～007/NFR001～024/AC-FR011～014 |
| OPEN-CHAT001～007/012 | 对应SDK/各owner/诊断面 | 对应CHAT-UP确认方 | 沿CHAT-UP传播，不能重复声明已闭口 |
| OPEN-CHAT008/CHAT-NF-Q001～005/CHAT-AC-Q001～004 | 性能/SLO/工作负载/证据阈值 | 产品/测试/04～06维护者 | 不写历史2s/P95/99.9%/500+承诺；数值quality待正式authority |
| OPEN-CHAT009～011/host | Desktop OS/Web/AT/通知/深链/IPC矩阵 | platform/security与04～06 | hostunknown/unavailable；Webpreview不证明Desktop兼容 |
| storage/OPEN010 | safe locator/partition/serializer/cleanup资格、重启draft政策 | SDK/owner/host/security | memoryOnly=true；无disk草稿/正文/handles；可靠删除前无durablecleared |
| 配置确值/依赖pin | limits/profile/sourcepriority/第三方版本与lock | 04/07 | required缺项blocked；无自动生产默认，当前无安装/构建 |
| automatic telemetry | numeric/logtransport不在DiagnosticContext | Observability/SDK与后续设计 | 当前不启用、不加旁路；显式support仍sixfield |
| 04～07正式链 | configuration/TC/EV/phase/boundary/门禁尚未本轮完成 | 逐文档授权维护者 | formal03完成后停审，不启动代码 |
| 实施仓与git身份 | target仓落位、localSDKdist、项目identity/allowed_scope | 07/实施者 | 此次未创建；未来按门禁核对，不本轮设置git |
| report/acceptance成熟度 | 无真实run/machineartifact/EV | 05/06/07 | 全部planned；不生成空evidence/验收/pass/readiness |
| Mobile/durable/native扩展 | 不属当前V1确定交付 | 产品/平台与未来设计 | reserved；不能futuredependency进入Desktoplocalcore |
| SDK/source后续变更 | 已记录seam可能变化 | SDK/owner/设计维护者 | 正式binding前重读contract，基线变化重审，不照搬旧stub |

### 7.4 已关闭的本地设计项

| ID | 关闭范围 | 不代表 |
|---|---|---|
| CHAT-DDD-003-TECH/CODE | React/TS+Tauri2/npm/Vite方向、TS/Rust分域 | 兼容/build/运行通过 |
| CHAT-DDD-004-LAYOUT | 十module+nativehost和planned文件责任 | 实施仓已存在/代码已创建 |
| CHAT-DDD-006-CARRIER-001 | 本地carrier/fields/factory/Deps/dispatch reservation闭口 | SDK真实type/export/authority已经提供 |
| CHAT-DDD-012-ERROR-001 | dependency_unavailable及五page映射 | transport已接通或临时网络已恢复 |
| CHAT-DDD-016-SCRIPT-001 | planned测试交付脚本职责/参数/路径 | 脚本/真实run/report已生成 |
| local协议/状态/testcoverage | 43protocol/flow、17主体/12enum与CUT覆盖设计完成 | applicationtests已执行、productready或HandoffGate通过 |

### 7.5 未确认前硬门禁

- 正式03可装配本地设计和负向/blocked分支，不把pending外部能力写为正向已提供。
- 真实SDK/owner类型或policy未匹配时，不直连ownerAPI、内部bus、DB；不私造Conversation/Governance/Process/目录truth。
- failed只明确no-effect；unknown只probe/query/wait，不因reconnect/timeout/reservedage重发。
- 失去资格先遮蔽、invalidate、clearrefs；stop/delete失败不能恢复可见性。
- 所有实现、test/run/evidence/commit/acceptance/readiness仍not_started或waiting；07完成前不创建implementationledger/boundaryskeleton。
- 每份正式文档完成停审；本轮授权到03，不进入04，不提交commit。

## 8. 回填草稿

正式03 §17采用§7全部上游/Workspace/本地风险和closed范围；§16承接门禁保持一致。正式正文可列未确认风险，但不能混入建议假接口/猜测provider/API/schema。

## 9. 待确认事项

§7.1～7.3即完整当前待确认清单；解除必须正式合同/authority与设计回填、必要真实后续验证，不能以本Step文字或fixture解除。

## 10. 进入下一步条件

每open/blocked项都有来源、影响、确认方、未确认处理；localclosed与外部blocked分立，无新global设计缺口。允许Step19装配当前本地设计；集成与实施ready仍不成立。
