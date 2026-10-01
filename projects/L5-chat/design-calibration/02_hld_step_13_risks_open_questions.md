# L5-chat 02 · Step 13 设计风险与待确认事项

> Step 状态：`done`
> gate_status：`pass`
> 本步主题：区分已经识别、需要保守处理的概要设计风险与尚未形成定论的待确认事项；不把项目任务、上游风险或 TODO 伪装成设计结论。
> 生成依据：`standards/document/概要设计讨论流程_SOP.md` §5 Step 13；`standards/document/概要设计书写规范.md` §4.13。
> 上游输入：Step 4～12 全部中间产物、`projects/L5-chat/00-需求文档.md` §15、`projects/L5-chat/01-架构设计.md` §15、项目台账与 02 flow blocker。

## 1. Step 内计划

| 子阶段 | 产物 | 状态 | 门禁 |
|---|---|---|---|
| 汇总概要结论 | 主体、对象、接口、流、状态、配置影响 | `done` | 风险均能指向已收稳结构 |
| 风险识别 | 影响成立性的设计风险和保守口径 | `done` | 与待确认分开 |
| 待确认识别 | 未形成定论的合同/能力/矩阵问题 | `done` | 不写任务/TODO |
| 影响与挂起姿态 | 部分、对象、接口、流、状态、配置影响 | `done` | 每项有 blocked/pending/conditional 口径 |
| 回填、自检和门禁 | §13 草稿 | `done` | `pass` |

## 2. SOP 问题回答

### 2.1 当前概要设计层已经构成风险的问题

主要风险是：SDK/owner exact surface 未闭合会使结构骨架无法直接进入实现；safe visibility/cursor/resume 不一致会破坏对话、变化和恢复；Governance receipt/idempotency/result 不足会破坏 GateCard 结果门控；Artifact/Workspace safe material contract 不完整会导致正文泄露或跨域 shadow truth；本地持久化/清理能力不明确会扩大敏感持有面；平台/可访问性差异可能造成语义分叉；诊断 handoff 不清会把 UI log 冒充 Observability truth；配置过度自由会绕过安全/结果边界。

### 2.2 哪些仍是待确认事项？

待确认的是 exact SDK query/command/event/ref/change/resume 方法和类型、Conversation visibility/cursor/pagination、Governance receipt/Decision result/幂等、Artifact preview/ref/version、Workspace safe view/export/attention、Identity/Work/Member/Runtime summary 层级、local storage/retention/clear contract、平台/AT 兼容矩阵、诊断 allowlist/envelope、质量数字和证据粒度。它们尚未形成足以写成 Chat 正式实现契约的定论。

### 2.3 哪些问题会误导详细设计？

如果把 candidate UI framework、目录、transport、owner DTO、内部 bus、缓存引擎、性能数字或 fake 结果当定论，03 会被迫构建错误边界；如果把 pending blocker 放进稳定承接清单，实施者会误以为 surface、授权、结果和测试已闭合。因此风险与待确认必须在正式 §13 保留，不能用“后续优化”掩盖。

## 3. 当前文档问题诊断

| 旧材料问题 | 影响 | 本步修正 |
|---|---|---|
| 旧文档把开放问题写成“待补 TODO” | 隐去其对结构成立性的影响 | 分成风险（已有保守口径）和待确认（尚无定论）。 |
| 旧文档使用 ready/integrated/verified 等词描述未闭合能力 | 伪造实施和集成事实 | 所有未闭合 surface 保持 pending/blocked/deferred/unknown。 |
| 旧文档把平台/性能偏好写成风险结论 | 把未验证偏好当设计风险 | 只有会影响结构边界、状态或证据的事项进入本节。 |
| 旧文档把任务/排期混入风险 | 风险表变成项目看板 | 不写 owner 任务、开发排期或责任分派。 |

## 4. 设计风险表

| 风险 | 影响 | 当前处理口径 |
|---|---|---|
| `R-02-001 SDK surface drift`：L0-sdk exact query/command/event/ref/change/resume/error/redaction surface 与 Chat 场景未逐项闭合 | 所有 adapter、接口、处理流、状态和 03 实现 | 只固定能力级 adapter/结果姿态；具体方法、DTO、schema 未闭合时 blocked/deferred；不私造协议。 |
| `R-02-002 Conversation continuity contract`：visibility、cursor、分页、change identity、resume 语义不一致 | group/channel/dm/thread、Turn、变化、重连、恢复 | 维持 stale/gap/requery/blocked/unknown；不按时间戳、连接或缓存推断连续。 |
| `R-02-003 Governance result authority`：Gate/Decision receipt、幂等、授权语境、结果/change 未闭合 | GateCard、confirmed/rejected/unknown、审计回链 | 受控入口和只读显示；没有正式 authority 就保持 pending/unknown/read-only，不本地确认。 |
| `R-02-004 Artifact safe material boundary`：ref/summary/preview/visibility/version contract 不完整 | Artifact card、预览、缓存、正文持有 | 只使用 body-free ref/summary/preview-unavailable；禁止 raw body/未授权下载。 |
| `R-02-005 Workspace safe view gap`：safe view/export/attention/freshness/cursor coverage 不闭合 | Workspace/inbox/跨项目摘要、恢复 | 不重建 projection/attention/export；区域保持 partial/stale/blocked。 |
| `R-02-006 Cross-owner summary ambiguity`：Identity/Work/Member/Runtime 摘要层级和来源未逐项对齐 | 成员卡、项目进度、运行状态和责任解释 | 按 owner 分域展示来源/freshness；不拼统一生命周期、完成或授权结论。 |
| `R-02-007 Local persistence/security contract`：平台存储、留存、清理、撤销和跨端边界未闭合 | LocalProjectionEntry、DraftStore、Recovery、logout/revoke/expiry | 只持有最小安全材料；visibility 不明/清理失败则 restricted/needs-action；不宣称已清除或离线成功。 |
| `R-02-008 Platform semantic divergence`：Desktop/Web/Mobile/AT 能力差异未形成正式矩阵 | shell、通知、深链、存储、焦点、公告和恢复 | Desktop-first；shared semantic core；局部缺失用 unavailable/needs-action，不改变业务状态。 |
| `R-02-009 Diagnostic boundary drift`：低敏 handoff、correlation/ref、sink 隔离未闭合 | 诊断、支持、恢复解释和 Observability 交接 | optional/blocked/deferred；只记录低敏类别和安全 ref，不把 UI log 当 evidence/audit。 |
| `R-02-010 Configuration escape`：配置/feature flag 可能绕过 visibility、result gate、redaction、unknown、清理 | 所有主线和安全边界 | 配置只选择已允许 profile；核心 invariant/状态机/owner boundary 不可配置化。 |
| `R-02-011 Scope creep into owner/service`：实现压力可能使 Chat 变成跨域聚合、BFF、Runtime/Tools 或观测后端 | 依赖方向、部署边界、数据 ownership | 保持 SDK-only、owner-safe、local-only；缺能力就 blocked/deferred，不在 Chat 补系统。 |
| `R-02-012 Evidence/readiness confusion`：fake、静态文档或 adapter 设计被误作集成/测试/验收证据 | 03～07、实施和用户判断 | 明确“设计骨架≠实现/运行/测试/验收/readiness”；证据留给 05/06/07。 |

## 5. 待确认事项表

| 待确认 | 影响范围 | 当前挂起口径 |
|---|---|---|
| `CHAT-UP-001` L0-sdk 对 Chat 场景的正式 Query/Command/Event/Ref/Change/Resume/Error/Redaction surface | 全部 adapter、接口、流和状态 | 能力级骨架可继续；exact method/type/schema 未闭合时对应实现 blocked。 |
| `CHAT-UP-002` Conversation scope/visibility、分页、cursor、change identity、resume contract | 入口、Turn、变化、历史、重连和跨端恢复 | stale/gap/requery/unknown；不直订 bus、不生成影子 cursor。 |
| `CHAT-UP-003` Governance actor/authorization context、receipt、幂等和 Decision result/change | GateCard、治理意图、confirmed/unknown | 只读/受控入口；正式 authority 缺失时 pending/unknown。 |
| `CHAT-UP-004` Artifact safe ref/summary/preview、版本和 visibility contract | Artifact card、预览、缓存、平台打开 | body-free ref/summary/unavailable；不保存正文。 |
| `CHAT-UP-005` Workspace safe view/export/attention/freshness/cursor/coverage | Workspace/inbox、跨项目摘要、恢复 | 不重建 projection；partial/stale/blocked。 |
| `CHAT-UP-006` Identity/Work/Member/Runtime safe summary 层级、来源和生命周期映射 | 成员/项目/运行卡片 | 按 owner 分域显示；不推断统一完成/授权。 |
| `CHAT-UP-007` Observability low-sensitivity handoff、correlation/ref、sink contract | 诊断、恢复和支持入口 | optional/blocked/deferred；不直写 backend。 |
| `WS-UP-001~008` Workspace 未闭合专项合同 | workspace query、attention/export、恢复 | 只消费已正式提供的 safe view/export。 |
| Desktop shell 最终载体、安全/存储/通知/深链能力矩阵 | §4/§7/§8/§11/03/04 | Desktop-first，具体 Tauri/其他载体仍 candidate。 |
| Web shared UI 与 Mobile provisional shell 的正式支持范围 | 跨端语义和配置 | 共享 core 先成立；非 Desktop 端不作为 V1 前置。 |
| local safe snapshot、draft、recovery metadata 的留存/清理/跨端同步上限 | §6/§8/§9/§11、隐私 | 最小材料、来源绑定、撤销/过期清理；具体上限 pending。 |
| `CHAT-NF-Q-*`、`CHAT-AC-Q-*` 与 `OPEN-CHAT-*` 的质量数字/兼容/证据 authority | 测试、验收和配置 | 不在概要设计写数字或 readiness。 |

## 6. 当前设计层未闭环项说明

概要设计已经收稳结构骨架，但以下项仍不能宣称闭环：SDK/owner exact contract、平台最终承载、存储与清理实现、低敏诊断 envelope、质量数字、真实测试/证据/验收和实现仓状态。它们不会被本概要设计隐藏；在正式文档中应继续以 `pending`、`blocked`、`deferred`、`stale`、`unavailable`、`unknown` 或 `needs-action` 表达。

## 7. 回填草稿（正式 §13）

> 校准来源：本文件 `§4 设计风险表`、`§5 待确认事项表`、`§6 当前设计层未闭环项说明`。

正式 §13 将把风险和待确认分开列示。风险保留当前保守口径：SDK/owner surface 未闭合时不固化接口；visibility/cursor/resume 不明时 stale/gap/requery/fail-closed；Governance 结果 authority 不明时 pending/unknown/read-only；Artifact/Workspace material 不完整时 body-free/partial/blocked；本地持久化/平台/诊断能力不明时最小持有、unavailable/needs-action；配置不得绕过 invariant；fake/设计材料不等于实现、测试、验收或 readiness。

待确认事项保留 `CHAT-UP-*`、`WS-UP-*`、平台/存储/诊断矩阵和质量/证据 authority，直到正式上游或后续文档闭合；不得在 Chat 内自行补造。

## 8. 自检与门禁

### 8.1 Step 自检

| 检查项 | 结论 |
|---|---|
| 风险与待确认是否分开？ | 是。 |
| 每项风险是否说明影响和当前处理口径？ | 是。 |
| 每项待确认是否说明影响范围和挂起姿态？ | 是。 |
| 是否把任务/TODO/排期混入？ | 否。 |
| 是否把上游风险全文搬入而未说明 Chat 影响？ | 否；只保留会影响概要结构/边界的项。 |
| 是否把 pending/blocked 写成 ready/verified？ | 否。 |
| 是否覆盖 SDK、owner、workspace、platform、storage、diagnostic、quality/evidence？ | 是。 |

### 8.2 进入下一步条件

- 概要设计风险与待确认事项已显式收纳并区分。
- 所有未闭环项都有影响范围和保守/挂起姿态。
- 没有把任务层事项、实现事实、测试结果或 readiness 混入。

### 8.3 门禁结论

`gate_status = pass`。Step 13 已完成，下一动作是创建并执行 `02_hld_step_14_formal_document_assembly.md`；Step 14 只做正式章节重组、术语统一、来源补齐和静态审计，不新增分析结论。

## 2026-10-01 当前逐章复核

计划/输入：Step13 SOP、规范§4.13、当前Step4～12、修复后01风险/ADR及台账blocker。SOP回答：结构骨架已收稳；能力合同、viewer实选与编号authority未闭合。将Chat具体结构风险和exact待确认分别列示，避免把稳定导航/对象重新写为未讨论。

诊断：旧表漏Process/关系/目录/context及上游AC缺口。结构产物/回填为§13两表新增项：

| 风险 | 影响 | 当前口径 |
|---|---|---|
| R-02-013 Process projection误造 | ProcessFlow/NodeDetail、分层renderer、版本/recovery与03 | Process owner已辨明，CHAT-UP008未闭合；只读正式投影，禁止由Work/Runtime/原型补图、推join或混Gate |
| R-02-014 绑定/目录串权 | Link/Directory VM、目标导航、搜索/分页、撤销与恢复 | CHAT-UP009保持blocked；关系与目标各自授权、目录/项目/参与者/在场分立，不从Identity猜完整公司覆盖 |
| R-02-015 迟到和跨source快照误组合 | ClientConsumptionContext、ChangeReducer、图/节点/目录store/cache | 先验证当前context/代次，source-local版本；撤销先隐藏/失效，再删除，旧响应不得复活 |
| R-02-016 上游验收编号缺口 | 需求追溯、planned测试与05/06承接 | CHAT-BASE001 open；不引用不存在的AC-NFR008～024，不在02修复停审00 |

| 待确认 | 影响 | 挂起 |
|---|---|---|
| CHAT-UP-008 / OPEN-CHAT-014：Process整体/阶段投影、授权拓扑/状态版本、Gateway/分支、节点关联与SDK change/resume | ProcessFlow/NodeDetail/renderer、LoadProjectProcessFlow/LoadStageProcessFlow/LoadProcessNodeDetail和恢复 | owner为L1-process；00来源漏项保留，正向projection未确认blocked，不以演示补齐 |
| CHAT-UP-009 / OPEN-CHAT-013/015：正式绑定owner/解除/撤销和公司目录provider、人类/AI覆盖、搜索分页/访问 | 双向群聊入口、Link/Directory VM、成员详情及DM | 产品目标及独立授权骨架已收稳；exact正式关系/provider未确认blocked/unavailable |
| CHAT-BASE-001：00 §16引用未在§14定义的AC-NFR008～024 | 质量追溯与05/06验收映射 | 只采用正式AC-NFR001～007、NFR001～024与AC-FR011～014，缺口open，不将NFR冒充AC |
| 只读viewer正式输入格式/许可/兼容/AT/质量预算 | ReadOnlyProcessRenderer配置及03实现契约 | 成熟库优先候选；bpmn-js viewer须获准BPMN，不生成XML、不声称图库已选型/验证 |

复杂度用表，不画风险图；无TODO/任务/排期。自检未闭合面保持blocked，不把SDK skeleton/原型/静态设计写为集成或readiness。Step13 done gate pass，允许Step14全篇审计；无实现/测试/提交。
