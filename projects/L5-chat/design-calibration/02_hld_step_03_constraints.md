# L5-chat 02 · Step 3 约束条件

> Step 状态：`done`
> gate_status：`pass`
> 本步主题：提炼会直接影响概要设计代码主体、对象、接口、处理流、状态机和配置影响判断的结构性硬约束。
> 生成依据：`standards/document/概要设计讨论流程_SOP.md` §5 Step 3；`standards/document/概要设计书写规范.md` §4.3。
> 上游输入：`02_hld_step_01_upstream_boundary.md`、`02_hld_step_02_scope.md`、`projects/L5-chat/00-需求文档.md`、`projects/L5-chat/01-架构设计.md`。

## 1. Step 内计划

| 子阶段 | 产物 | 状态 | 门禁 |
|---|---|---|---|
| 读取输入 | Step 1/2、00/01 的边界、范围、数据和状态结论 | `done` | 输入已通过前序门禁 |
| 回答 SOP 问题 | 逐项识别结构约束来源及影响 | `done` | 每条约束均可指导后续章节 |
| 历史材料诊断 | 旧 UI/协议/缓存/成功语义造成的越界风险 | `done` | 未将工程偏好写成硬约束 |
| 设计取舍 | 以 owner boundary、SDK-only、结果门控、fail-closed 为不可变底线 | `done` | 与 01 一致 |
| 结构化产物 | 约束条件表、按章节影响映射、禁止配置化边界线索 | `done` | 可回填 §3 |
| 复杂度判断 | 本步不画约束网络图 | `done` | 规范 §4.3 禁止图示 |
| 回填草稿 | §3 回填草稿 | `done` | 未新增架构结论 |
| 自检与门禁 | 约束有效性、非泛化性和三层门禁 | `done` | `pass`，允许创建 Step 4 |

## 2. SOP 问题回答

### 2.1 哪些约束会直接影响对象、接口、处理流或状态机？

会直接影响的约束集中在七类：唯一 SDK 接入；owner truth 与 Chat-local truth 分离；安全语境和可见性 fail-closed；正式结果门控与 unknown 不重放；formal change/resume 和 reducer 幂等；受限本地持久化与敏感材料清理；平台 shell 不改变业务语义。它们决定后续必须有 adapter、来源元数据、结果姿态、恢复上下文、清理边界和平台能力状态等结构主语。

### 2.2 哪些约束来自需求，哪些来自架构/全局设计？

- 需求侧约束：四节点闭环、group/channel/dm/thread 入口、Turn 显化、草稿/发送/GateCard/Artifact/摘要/恢复、可访问性和客户端安全目标。
- 架构侧约束：L0-sdk 唯一业务 seam、owner truth 归属、客户端运行承载分工、依赖方向、正式 change/resume、结果门控、禁止直连 bus/私有 API/共享 DB、受限本地状态和 Desktop-first 边界。
- 全局规范侧约束：旧文档只作历史材料、逐 Step 中间产物、三层门禁、未闭合合同不得伪装为 ready、正式文档必须保留具体校准来源。

### 2.3 哪些边界不先写清会最容易串到相邻仓或详细设计？

最容易越界的边界是：把 Conversation/Turn/Gate/Artifact/Workspace/Runtime 的对象复制进 Chat store；把 SDK/transport/event ACK 当业务成功；把内部 bus cursor 当 Chat 状态；把本地缓存当权限或当前 truth；把 UI presence 当 Identity/Member/Runtime 状态；把平台通知/窗口状态当命令结果；把低敏诊断日志当 Observability truth；把配置开关当授权或状态机规则。

### 2.4 哪些只是泛化工程原则，不进入本章？

不把“代码要高质量”“要模块化”“要性能好”“要可测试”“使用某状态库”“使用某 UI 框架”等泛化口号写成概要硬约束。只有能直接改变本仓对象、接口、处理流、状态或边界判断的规则才进入本步。

## 3. 当前文档问题诊断

| 旧材料问题 | 对结构的影响 | 本步修正 |
|---|---|---|
| 旧文档把 React/Svelte/Tauri/RN 等技术偏好写成约束 | 使代码主体先被框架决定，且掩盖共享语义边界 | 只保留 Desktop-first 与 shared core/shell 分离；具体载体候选化。 |
| 旧文档把 AG-UI/SSE/WebSocket 事件当正式输入 | 使事件 reducer 依赖未授权协议和内部 delivery | 只允许 SDK formal change/event/resume 能力进入接口与流程。 |
| 旧文档把“消息发送成功”与 ACK/流式结束等同 | 使状态机缺少 pending/unknown 和结果门控 | 强制区分 local intent、transport、receipt/result/change 和 confirmed。 |
| 旧文档将缓存/离线模式写成业务能力 | 可能延长授权、离线审批或形成第二真相 | 只允许受限展示缓存、草稿、恢复提示和清理。 |
| 旧文档将所有跨域卡片压成统一对象 | 会混淆 owner truth、来源和可见性 | 后续对象按 Chat-local projection/ref/result 与 owner source 分开。 |

## 4. 结构化约束条件表

| 约束 | 来源 | 直接影响的概要结构 | 说明 |
|---|---|---|---|
| `C-01 SDK-only business seam` | `01` §3.1、§8；`00` §12 | SDK adapter、所有 Query/Command/Event/Resume 接口 | 页面和核心语义不直连 owner 私有 API、内部 bus 或共享 DB；exact surface 未闭合时保持能力级接口。 |
| `C-02 owner truth remains external` | `00` §2/§11；`01` §4/§9 | 对象、view model、store、缓存 | Chat 只能保存局部交互事实和 safe snapshot/ref；不复制 Conversation、Governance、Artifact、Workspace、Runtime 等 truth。 |
| `C-03 visibility and scope fail closed` | `00` BR-CHAT-001~006；`01` IC-CHAT-005 | Route guard、view model、cache entry、操作入口 | actor/scope/visibility 无法验证时只能 restricted/blocked/unavailable；不能从空列表、深链、名称或错误差异推断。 |
| `C-04 business result is owner-gated` | `00` BR-CHAT-014~020；`01` IC-CHAT-003 | Command result、状态机、reducer、通知 | 按钮点击、表单通过、transport/AG-UI ACK、toast、连接恢复或缓存命中都不能生成 confirmed。 |
| `C-05 unknown is non-replayable by default` | `00` BR-CHAT-017；`01` IC-CHAT-007 | CommandAttempt、恢复 job、重试入口 | 副作用未知时只能 query/probe/wait/user decision；禁止自动重放。 |
| `C-06 formal change/resume only` | `00` BR-CHAT-021~026；`01` IC-CHAT-006 | Event adapter、change reducer、resume context | 只消费 SDK 正式 change/event/resume；不猜 topic/offset/墙上时间顺序，不直接订 bus。 |
| `C-07 provenance/freshness retained` | `00` BR-CHAT-007~013、`01` §9 | ViewModelSnapshot、cache、preview/ref | 展示材料必须保留 source、scope/visibility、version/watermark、freshness/coverage；不可解释时 stale/partial/unknown。 |
| `C-08 local state cannot write owner` | `00` BR-CHAT-018、`01` IC-CHAT-003/004 | Store、reducer、local persistence、platform shell | route、selection、draft、cache、optimistic 和平台状态只能影响 Chat-local 体验，不反写 owner truth。 |
| `C-09 body-free and least disclosure` | `00` §11、BR-CHAT-027；`01` IC-CHAT-009 | View model、缓存、诊断、导出、通知、深链 | 外部正文、credential/token/secret、raw log、provider/tool/runtime/bridge body 不进入持有面；只使用 safe summary/ref/preview。 |
| `C-10 idempotent local reduction` | `00` N4、`01` §10/§13 | Change reducer、cache merge、resume/requery | duplicate、乱序、gap、expired、revoked 必须可区分；不能以到达顺序或重复事件推进业务结果。 |
| `C-11 platform shell is semantic-neutral` | `00` BR-CHAT-028；`01` IC-CHAT-010 | 应用壳、platform adapter、通知/深链/存储 | Desktop/Web/Mobile 差异只能影响宿主能力和展示姿态，不改变 owner 权限、状态、结果或恢复上限。 |
| `C-12 bounded recovery and cleanup` | `00` F-CHAT-003/016、BR-CHAT-003/005/025/026；`01` §7/§9 | Cache/Recovery 对象、清理流程、配置影响 | 重启/离线只恢复最小安全材料和草稿；撤销、登出、scope 变化、过期时裁剪/清理；不延长授权。 |
| `C-13 cross-owner composition is display-only` | `00` BR-CHAT-008/010~013；`01` IC-CHAT-004 | View model composer、卡片、摘要页面 | 组合多个 safe view 只为展示和回链，不推断统一授权、完成、生命周期或治理结论。 |
| `C-14 accessibility is shared semantic contract` | `00` G-CHAT-007/NFR；`01` §13 | View model、组件、状态公告、平台 adapter | 键盘、焦点、屏幕阅读和等价路径必须共享状态语义；可访问性层不能另造业务状态。 |
| `C-15 unresolved contracts stay explicit` | `00` G-CHAT-008、`01` IC-CHAT-012 | 所有接口、流程、配置和风险 | exact SDK/owner/platform/diagnostic contract 未闭合时保持 pending/blocked/deferred/unknown，不伪造实现或 readiness。 |
| `C-16 configuration cannot bypass invariants` | `01` §13、§14/§15 | Config impact、adapter、store、状态机 | 配置可以选择已允许的 profile/能力姿态，不能关闭 visibility、redaction、结果门控、幂等、安全清理或 owner 边界。 |
| `C-17 no service-side orchestration in Chat` | `00` NG-CHAT-002~008；`01` §4/§8 | Application intent、Operations、部署边界 | Chat 只编排客户端体验和受控意图，不执行 Runtime/Tools、治理策略、项目推进、Artifact 处理或观测后端。 |
| `C-18 no unbounded local aggregation` | `00` F-CHAT-005/016、`01` §9/§13 | View model、cache、Workspace/summary 页面 | 不把跨域 safe view 无限聚合成新的 Inbox/Workspace/Runtime truth；按正式 view 和范围裁剪。 |

## 5. 按后续章节的约束影响

| 后续章节 | 必须守住的约束 | 不能出现的内容 |
|---|---|---|
| §4 代码主体框架 | C-01、C-02、C-08、C-11、C-17 | 具体目录、owner service 实现、平台壳决定业务状态。 |
| §5 主要组成部分 | C-02、C-09、C-13、C-18 | 用外部 owner 名称替代 Chat 部分，或把卡片/页面直接命名为领域 truth。 |
| §6 关键对象 | C-02、C-03、C-07、C-09、C-12 | 完整 owner DTO、数据库实体、正文缓存、授权对象或 shadow schema。 |
| §7 API/接口 | C-01、C-04、C-05、C-06、C-15 | HTTP path、私有 API、topic/offset、完整 schema、ACK=业务成功。 |
| §8 处理流 | C-01、C-04、C-05、C-06、C-10、C-17 | 直订 bus、自动重放 unknown、完整实现调用链、服务端编排。 |
| §9 状态机 | C-03、C-04、C-05、C-06、C-10、C-12 | 把 transport/local/platform 状态压成 owner 业务状态，或把 UI 展示规则当领域状态。 |
| §10 异常边界 | C-03、C-05、C-07、C-09、C-15 | 错误码全集、补偿脚本、失败时猜测对象存在性。 |
| §11 配置影响 | C-03、C-04、C-09、C-12、C-16 | 用 feature flag 绕过安全/结果门控，或写默认值/密钥/部署参数。 |

## 6. 禁止配置化边界线索

| 禁止配置化边界 | 原因 | 若需改变应回到哪里 |
|---|---|---|
| owner truth、授权、visibility 和 scope 判定 | 配置不能授予业务权限或创建第二 truth | 对应 owner 与 `01-架构设计.md` |
| `confirmed` 的正式结果门控 | 配置不能把 ACK、按钮或缓存提升为业务成功 | `L0-sdk`/owner 合同与本概要 §9 |
| unknown 的非盲重放规则 | 配置不能绕过副作用不确定性 | owner command/query contract 与本概要 §8/§9 |
| change/resume 来源与幂等边界 | 配置不能把内部 bus 或墙上时间变成 formal change | `L0-sdk` 与 conversation owner |
| redaction、body-free 和最小披露 | 配置不能允许敏感正文进入本地持有面 | `L0-sdk`/owner 安全合同和 `04` |
| 登出/撤销/过期清理 | 配置不能延长授权或保留失效材料 | identity/governance/SDK 合同和 `04` |
| 跨端业务状态语义 | 平台配置不能使 Desktop/Web/Mobile 得出不同业务结论 | `01-架构设计.md` 与平台边界 |
| Chat 不执行 Runtime/Tools/治理/观测后端 | feature flag 不能改变仓职责 | 对应专项 owner 和 `01` |

## 7. 设计取舍

本步把“安全/所有权/结果/恢复”写成结构硬约束，把状态库、框架、存储引擎、传输协议和参数偏好留给后续层。这样后续 Step 能够细化到 view model、store、adapter、reducer 和流程，同时不会把实现手段误当边界。约束表故意不包含普通工程质量口号，也不把未闭合的上游合同改写为本地补偿策略。

## 8. 回填草稿（正式 §3）

> 校准来源：本文件 `§4 结构化约束条件表`、`§5 按后续章节的约束影响`、`§6 禁止配置化边界线索`。

| 约束 | 说明 |
|---|---|
| 业务能力只能经 `L0-sdk` 正式 seam 进入 | 页面、view model、store 和平台 shell 不直连 owner 私有 API、内部 bus 或共享数据库；未闭合 surface 只按能力类别保留。 |
| owner truth 与 Chat-local truth 分离 | Conversation、Turn、Participant、Project、Member、Gate/Decision、Artifact、Workspace、Runtime 和 Observability truth 归各 owner；Chat 只持有 route、selection、draft、attempt、恢复和受限展示材料。 |
| visibility/scope 无法验证时 fail-closed | 不从深链、缓存、空列表、对象名或错误差异推断可见性或存在性；入口和内容转入 restricted/blocked/unavailable。 |
| 业务结果必须由正式 owner receipt/result/change 门控 | 按钮、表单、transport/AG-UI ACK、toast、连接恢复和缓存命中都不能生成 confirmed。 |
| unknown 不得自动重放副作用 | 未知结果只能进入 query/probe/wait/user decision；不能以重试按钮或连接恢复隐式重放。 |
| 变化只消费 SDK formal change/event/resume | reducer 保留来源、版本/水位、幂等和 gap/expired/revoked 语义，不直订内部 bus 或猜 delivery 顺序。 |
| 展示材料必须保留 provenance/freshness 和最小披露 | safe view/ref/summary/preview 只进入允许的 view model/缓存；raw body、credential、raw log 和未脱敏 payload 不进入持有面。 |
| 平台 shell 与业务语义隔离 | Desktop/Web/Mobile 只提供宿主能力；宿主 ACK、通知、深链和窗口生命周期不能改变 owner 权限、结果或恢复上限。 |
| 本地恢复有界且可清理 | 重启/离线只恢复最小安全材料和草稿；撤销、登出、scope 改变或过期时裁剪/清理，不延长授权。 |
| 未闭合合同和配置影响保持显式 | 不伪造 exact API、测试、验收或 readiness；配置不得绕过结果门控、redaction、幂等、安全清理和 owner 边界。 |

## 9. 待确认事项

| 待确认 | 影响 | 当前挂起口径 |
|---|---|---|
| SDK formal change/resume 与 command receipt 的精确一致性语义 | §7～§9 的 adapter、reducer 和状态 | 能力级结构；细节由上游合同和 03 承接。 |
| 本地安全缓存和恢复的正式留存/清理规则 | §6、§8、§9、§11 | 先按最小材料、来源绑定、撤销清理设计。 |
| 平台宿主能力缺失时的等价可访问路径 | §4、§5、§9、§10 | 保持 shared semantic core，局部 `unavailable/needs-action`。 |

## 10. 自检与门禁

### 10.1 Step 自检

| 检查项 | 结论 |
|---|---|
| 每条约束是否能影响对象、接口、处理流、状态或配置判断？ | 是；已列出章节影响映射。 |
| 是否把上游架构全文复述为约束？ | 否；只提取会改变概要结构的硬边界。 |
| 是否把泛化工程原则、框架偏好或无 authority 数字写入？ | 否。 |
| 是否明确禁止配置化边界？ | 是；已列 owner truth、结果门控、unknown、redaction、清理和职责边界。 |
| 是否保留未闭合合同的 blocker 姿态？ | 是；未将 exact SDK/owner surface 写成事实。 |
| 是否提前写完整对象/接口/流程实现？ | 否；仅说明后续章节受哪些约束。 |

### 10.2 进入下一步条件

- 结构性硬约束已形成表格，并能指导后续 §4～§11 判断。
- 需求、架构和全局边界来源已区分；没有把技术偏好或泛化口号当作硬约束。
- 禁止配置化边界已明确，且尚未下沉到配置项、默认值或实现契约。
- 项目级台账、02 flow 和本 Step 文件一致，允许创建并执行 Step 4。

### 10.3 门禁结论

`gate_status = pass`。Step 3 已完成，下一动作是创建并执行 `02_hld_step_04_code_skeleton.md`；后续代码主体映射必须遵守本文件 `C-01~C-18`，特别是 SDK-only、owner truth 分离、结果门控、formal change/resume 和平台语义隔离。

## 2026-10-01 当前逐章复核

计划/输入：读取Step3 SOP/规范§4.3、当前§3和Step3表，承接修复后的Step1/2及01 IC013～015/ADR009～010。

问题回答/诊断：缺Process truth与成员集合分界、上下文迟到隔离；泛化框架偏好不作为硬约束。receipt必须具业务确认含义，通用接收receipt不足。

结构结果：新增约束为五标签/分层只读/并行Gateway与Gate分立、正式绑定独立目标授权、目录/ProjectMember/Participant/Member分立、source-local版本与actor/scope/project/source消费语境隔离；optimistic可撤销，不推进owner。

回填/复杂度：§3表原位增修，表足够，无需约束网络图。自检：每条可映射到§4～12主体、对象、reducer、恢复和禁配边界；合同仍blocked。Step3 done，gate pass；进入Step4；无实现/测试/提交。
