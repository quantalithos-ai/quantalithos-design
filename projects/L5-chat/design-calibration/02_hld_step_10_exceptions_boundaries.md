# L5-chat 02 · Step 10 异常与边界场景轮廓

> Step 状态：`done`
> gate_status：`pass`
> 本步主题：只收纳会影响主要组成部分、对象、接口、处理流、状态机或跨 owner 边界的关键异常，不展开错误码全集、重试参数、补偿脚本或实现细节。
> 生成依据：`standards/document/概要设计讨论流程_SOP.md` §5 Step 10；`standards/document/概要设计书写规范.md` §4.10。
> 上游输入：`02_hld_step_08_processing_flows.md`、`02_hld_step_09_state_machine.md`、`projects/L5-chat/00-需求文档.md` §10/§13/§15、`projects/L5-chat/01-架构设计.md` §3/§5/§9/§15。

## 1. Step 内计划

| 子阶段 | 产物 | 状态 | 门禁 |
|---|---|---|---|
| 读取处理流/状态 | Step 8 关键流、Step 9 迁移和边界 | `done` | 异常影响对象/流/状态可回指 |
| 场景识别 | SDK/owner、可见性、变化、命令、缓存、平台、可访问性 | `done` | 只保留结构性异常 |
| 影响分析 | 主要组成部分、接口、状态和降级姿态 | `done` | 不写低层异常大全 |
| 图示判断 | 判断是否需要异常影响图 | `done` | 本轮无需额外图，表格足够表达 |
| 回填与审计 | §10 草稿、风险/待确认不混入 | `done` | 完成后 `pass` |

## 2. SOP 问题回答

### 2.1 必须在概要层点名的异常路径

必须点名的路径是：SDK surface 不可用/不兼容、actor/scope/visibility 无法验证、safe material 过期或部分缺失、formal change 重复/乱序/gap/expired/revoked、command receipt/result 缺失或 unknown、治理授权/幂等不完整、Artifact preview 不可用、Workspace safe view 不完整、本地存储/恢复失败、logout/revoke/expiry 清理竞态、平台能力缺失、可访问性能力降级、低敏诊断 sink 不可用和跨端状态语义不一致。这些会改变主流程或状态，不能等到详细设计才首次发现。

### 2.2 哪些边界会改写协作关系？

visibility/scope 撤销会同时影响安全语境、材料镜像、本地投影和平台公告；change gap/expired 会同时影响连续性、view model、resume/requery 和恢复入口；unknown command 会同时影响意图反馈、恢复上下文和重试入口；本地清理失败会影响缓存持有和安全姿态；平台/AT 能力缺失会影响 shell 与等价路径，但不能改变业务状态。

### 2.3 哪些失败不能留到详细设计才发现？

不能留到后续才发现的判断包括：任何无法验证 visibility 仍继续显示；任何把 ACK/连接/cache 当 confirmed/fresh；任何 unknown 自动重放；任何直连 owner/bus；任何将 raw body/credential 写入本地；任何把 owner truth 复制到 Chat store；任何清理失败后继续展示失效材料。错误码、重试次数、退避、补偿和底层异常分类仍留给 03/04/05。

## 3. 当前文档问题诊断

| 旧材料问题 | 影响 | 本步修正 |
|---|---|---|
| 旧文档列出大量 HTTP/stream/组件错误，但没有说明对状态和边界的影响 | 形成错误码清单，遗漏安全姿态 | 只保留会改变主流程/状态/跨部分协作的场景。 |
| 网络断开统一标记失败 | 把 unknown、stale、reconnecting、failed 混为一谈 | 依据副作用 certainty、来源 freshness 和连接阶段分轴处理。 |
| 权限失败只隐藏按钮 | 仍可能从缓存/错误差异泄露对象存在 | visibility 失败时 fail-closed、遮蔽/清理并显式 restricted/blocked。 |
| 预览失败回退 raw 下载 | 绕过 Artifact owner 和 body-free 边界 | 只显示安全 ref/摘要/不可预览原因。 |
| 本地清理异常未单独处理 | 撤销后旧材料继续持有 | 清理失败进入 restricted/needs-action，禁止继续正常显示。 |

## 4. 异常与边界场景表

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| `L0-sdk` 不可用或 capability 未暴露 | SDK 接缝、协作体验语境、受控协作意图 | 相关入口 blocked/unavailable/read-only；不 fallback 到私有 API、内部 bus 或共享 DB。 |
| SDK/owner contract 版本不兼容 | SDK adapter、owner-safe 材料镜像、变化连续性 | 保持 blocked/deferred/stale；不按旧 DTO/事件猜测字段。 |
| Actor/session 过期或无法验证 | 安全语境与导航、平台 shell | route 转 expired/restricted，清理受影响本地材料；不继续展示受保护内容。 |
| Scope/visibility 结果 unknown | `VisibilityGuard`、`AccessPosture`、`SafeMaterialSnapshot` | fail-closed；restricted/blocked/unavailable；不从缓存、空列表、名称或错误差异推断。 |
| 正式 revoke/logout/scope change 到达 | 安全语境、材料镜像、本地投影、平台公告 | 先遮蔽/清理受影响材料和选择；route/缓存转 restricted/cleared/needs-action。 |
| Conversation surface query partial/empty/timeout | 协作体验语境、材料镜像、连续性 | 显示 loading/partial/stale/unavailable；不把空列表当无对象、不补造 Turn。 |
| Turn/变化重复到达 | 变化与恢复连续性、ChangeReducer | 以 source/revision/event identity 去重；保留 `duplicate`，不二次渲染或推进状态。 |
| Turn/变化乱序到达 | 变化与恢复连续性 | 进入 out_of_order/stale，等待 formal requery/resume；不按墙上时间排序。 |
| Change gap/cursor expired | 变化与恢复连续性、ResumeCoordinator | 进入 gap/resuming/requery；暂停把后续变化当连续，不能直订 bus 或自造 replay。 |
| Formal change source 不明或 schema 未确认 | SDK change adapter | blocked/unknown；不解析未知字段、不将其写入 projection。 |
| Command transport ACK 但没有 receipt/result | 受控协作意图、结果门控、恢复 | submitted/pending/unknown；通过 probe/query/wait/user decision 收敛，不自动重放。 |
| Command formal result rejected | 受控协作意图 | rejected + safe reason；不把拒绝误写 failed 或自动重试。 |
| Command formal failure 可确定无副作用 | 受控协作意图 | failed；是否新 attempt 由 capability/guard 和用户动作决定。 |
| Command 副作用未知 | 受控协作意图、恢复连续性 | unknown；禁止同副作用自动再发，允许正式 probe/query。 |
| Governance Gate 能见但 capability/授权语境缺失 | GateCard、受控协作意图、安全语境 | read-only/blocked；不以角色名、按钮或历史结果授予审批资格。 |
| Governance receipt/idempotency/result 缺失 | GateCard、CommandResultGate、诊断 | pending/unknown；不生成 Decision，不把 transport 结果当批准。 |
| Artifact ref 可见但 preview unavailable | owner-safe 材料镜像、ArtifactPanel | 显示 safe ref/summary/不可预览原因；不读取 raw body、不回退未授权下载。 |
| Artifact visibility/version 不一致 | owner-safe 材料镜像、本地投影 | restricted/stale/cleared；等待正式 preview/ref 重新验证。 |
| Workspace safe view/export 不完整 | owner-safe 材料镜像、协作体验语境 | partial/stale/blocked；不自行拼 Inbox/attention/projection。 |
| Member/Runtime summary 来源不明 | owner-safe 材料镜像、协作体验语境 | 显示最小安全摘要或 unavailable；不推断身份、宿主健康、执行 outcome。 |
| Local storage 读失败 | 本地展示与恢复投影、平台接缝 | 内存最小态或重新 query；显示 recovery/unavailable；不影响 owner 结果。 |
| Local storage 写失败 | 本地展示与恢复投影 | 保留内存 draft/selection（若安全），标记未持久化；不把写入失败当业务失败。 |
| Cache clear/eviction 部分失败 | 本地投影、安全语境、平台安全边界 | restricted/needs-action；禁止继续展示受影响材料，详细清理重试留给 03/04。 |
| Desktop 重启后 route/cache 可恢复但 visibility 未验证 | 变化与恢复连续性、安全语境、本地投影 | 先 stale/restricted/needs-validation；正式 query/resume 后再收敛。 |
| 平台窗口/通知/文件选择能力缺失 | 平台体验与可访问性 | unavailable/needs-action，提供共享语义的替代路径；不改变业务状态。 |
| 屏幕阅读/键盘/焦点能力部分缺失 | 平台体验与可访问性 | 保留等价语义和状态文本；局部能力 unavailable；不另造业务状态。 |
| 低敏诊断/handoff sink 不可用 | 诊断接缝、平台体验 | 本地安全提示仍可用；不影响业务结果、授权、缓存清理或恢复上限。 |
| 跨端 shell 对同一正式结果给出不同语义 | 共享语义 core、平台接缝 | 以 shared state/view model 为准；平台差异只能表达 capability/unavailable/needs-action。 |
| 未知错误/未知事件进入 reducer | ChangeReducer、材料镜像、恢复 | 保持 unknown/blocked，不写入 owner-like 状态；等待正式 schema/contract。 |

## 5. 关键跨部分边界说明

### 5.1 Visibility 与清理

visibility/scope/revoke 不是普通 query error。它必须沿 `VisibilityGuard → AccessPosture/DisclosurePosture → SafeMaterialSnapshot/LocalProjectionEntry → RouteContext/SelectionState → StatusAnnouncement` 传播，必要时触发 `EvictLocalMaterial`。任何中间步骤失败都不能以旧 cache 或页面状态维持可见。

### 5.2 Unknown 与恢复

unknown 不是 failed，也不是 reconnecting。它表示副作用是否成立无法安全判断；`ResolveUnknownAttempt` 只能使用正式 query/probe/result/change。恢复成功只收敛 continuity/freshness，不直接改变 command result posture。

### 5.3 Gap 与局部页面

gap/expired 只影响受影响 source/context；未受影响的 Chat-local route/selection/draft 可以保留，但对应 owner material 必须标 stale/partial/blocked。不能为保持页面完整而从其他 owner 或旧缓存补齐缺口。

### 5.4 平台能力与业务能力

平台能力缺失只改变输入、通知、存储、深链、窗口或 AT 的可用性；业务 query/command/change 的正式语义仍由 SDK/owner 决定。Platform ACK、后台恢复或通知送达不触发业务状态迁移。

## 6. 异常影响图判断

本步不补异常影响图。异常影响可以由表格和 §5 的四条跨部分传播说明完整表达；补图会重复 Step 8/9 的处理流和状态传播图，并可能引入错误码/重试/补偿细节。若 03 发现某一异常引入新的跨部分主线，应先回退本概要设计补图和边界，而不是在详细设计中暗加。

## 7. 回填草稿（正式 §10）

> 校准来源：本文件 `§4 异常与边界场景表`、`§5 关键跨部分边界说明`。

概要设计必须先点名以下异常与边界：SDK/owner contract 不可用或不兼容、actor/scope/visibility 无法验证、formal change 重复/乱序/gap/expired/revoked、command receipt/result 缺失或 unknown、治理授权/幂等缺失、Artifact preview 不可用、Workspace/Member/Runtime safe material 不完整、本地存储/清理失败、Desktop 重启恢复未验证、平台/辅助技术能力缺失、诊断 sink 不可用和跨端语义不一致。

当前统一口径是：依赖或 contract 缺失时进入 blocked/unavailable/deferred；可见性未知时 fail-closed；变化缺口进入 stale/gap/resume/requery；命令副作用未知时保持 unknown 并禁止自动重放；预览只回退到 safe ref/summary/unavailable；本地清理失败时 restricted/needs-action，不能继续展示失效敏感材料；平台/诊断能力缺失只影响宿主或低敏支路，不改变 owner 结果。错误码、重试/退避、补偿、恢复脚本和实现级异常映射留给 `03-详细设计.md`、`04-配置设计.md` 和后续测试/验收文档。

## 8. 待确认事项

| 待确认 | 影响 | 当前挂起口径 |
|---|---|---|
| SDK/owner 对未知、超时、撤销和 schema 不兼容的正式错误分类 | 状态映射、错误文案和重试/探测 | 只保留安全类别：unknown/blocked/stale/unavailable/needs-action。 |
| visibility/revoke 的传播时序与清理保证 | 缓存清理和页面安全 | 先 fail-closed、遮蔽/清理，具体顺序留给上游/03。 |
| local storage 清理失败是否有宿主级强制删除能力 | 本地安全边界 | 失败时 restricted/needs-action，不宣称已清除。 |
| 平台/AT 降级矩阵 | 等价路径和公告 | 共享语义 core，具体矩阵留给 04/05/06。 |

## 9. 自检与门禁

### 9.1 Step 自检

| 检查项 | 结论 |
|---|---|
| 是否只列影响主线/状态/跨部分协作的异常？ | 是；未列普通参数校验大全。 |
| 每个场景是否指定承接部分/对象/边界？ | 是。 |
| 是否把异常写成错误码、重试参数或补偿脚本？ | 否。 |
| 是否把风险/待确认混入异常表？ | 否；待确认单列。 |
| 是否覆盖 SDK、owner、visibility、change、command、cache、platform、accessibility、diagnostic？ | 是。 |
| 是否明确 unknown、fail-closed、stale/gap 和清理失败姿态？ | 是。 |
| 是否需要异常影响图？ | 本轮不需要，原因已说明。 |

### 9.2 进入下一步条件

- 关键异常和边界场景已映射到主要组成部分、对象、接口、处理流和状态。
- 没有把低层错误实现或运维脚本提前写入概要设计。
- 依赖缺失、visibility unknown、unknown command、change gap、缓存清理失败和平台降级的安全姿态已固定。

### 9.3 门禁结论

`gate_status = pass`。Step 10 已完成，下一动作是创建并执行 `02_hld_step_11_config_impact.md`；Step 11 只识别配置影响轮廓和禁止配置化边界，不定义配置项、默认值、密钥或部署参数。

## 2026-10-01 当前逐章复核

计划/输入：Step10 SOP、规范§4.10、当前Step8/9及既有§10表。SOP回答：必须点名新增流程版本/绑定/目录/迟到/受限图泄漏与多source故障，否则会改写主线安全口径；错误码/退避/补偿仍留03/04。

诊断/取舍：既有表只覆盖通用异常，新增表逐一映射主要部分/对象及Load*/consumer/恢复姿态。复杂度表足够，§8/9已有跨部分传播，不重复新图。

| 场景 | 归属 | 当前概要口径 |
|---|---|---|
| Process拓扑/阶段关系未提供 | 协作体验语境、ProcessDrilldownCoordinator/ProcessFlowViewModel | LoadProjectProcessFlow/LoadStageProcessFlow blocked；不得由原型、WorkItem或Runtime补图 |
| 拓扑与状态版本不兼容或父图变化 | 变化与恢复、ProcessFlowViewModel/ProjectNavigationState | 局部stale/partial，失效旧stage/node请求和选择，重查Process；不显示伪统一快照 |
| 并行分支状态与汇聚/Gate不同步 | owner-safe材料、ProcessFlowViewModel/CommandResultGate | 分别显示Process分支/Gateway与Governance Gate来源；不推join或审批成功 |
| 项目↔群聊关系缺失、解绑或目标访问拒绝 | 安全导航、ProjectConversationLinkViewModel | 关系/目标独立验证；blocked/restricted，清入口/返回ref；不推项目/群聊不存在 |
| 目录provider/覆盖/分页未确认 | 协作体验、CompanyDirectoryViewModel | blocked/unavailable；不合并身份/项目成员/参与者/presence补公司名单 |
| 搜索/页/节点/项目切换后迟到响应 | 安全导航、ClientConsumptionContext、各VM | 旧代次不应用当前store/cache/公告，正式撤销按受影响scope安全裁剪；不复活cleared材料 |
| 节点关联section失败或引用访问收紧 | 材料镜像、ProcessNodeDetailViewModel | 仅受影响source partial/restricted；其他section独立可见，不从日志猜正式关联 |
| 受限节点/边通过图布局或辅助技术泄漏 | 平台/AT、ReadOnlyProcessRenderer/AccessibilityState | 图与等价列表同样裁剪名称/数量/关系/焦点/公告；不以占位泄漏结构 |
| 离线/跨端恢复旧项目/绑定/阶段 | 恢复与本地投影、ResumeContext/ProjectNavigationState | 恢复前重验关系/target/版本；缺同步合同不自建同步或重放owner命令 |

回填正式§10异常表；自检新场景均能回指§6～9，未混入风险/待确认编号或完整错误码。Step10 done gate pass，进入Step11；无实现/测试/提交。
