# L5-chat 03 · Step 1 概要设计输入边界

> Step 状态：`done`
> gate_status：`pass`
> 本步主题：确认详细设计可承接的正式 00～02 结论、必须继续展开的客户端实现契约和上游输入缺口。
> 生成依据：`standards/document/详细设计讨论流程_SOP.md` §5 Step 1；`standards/document/详细设计书写规范.md` §2～§3。
> 适用模式：`regression-review + single-agent-serial`；2026-10-01承接修复后00/01/02重审。前轮full-restart记录与旧正式03仅为historical_material。

## 1. Step 内计划

| 子阶段 | 产物 | 状态 | 门禁 |
|---|---|---|---|
| 恢复上游与详细设计门禁 | 正式 00～02、02 Step 12～14、台账和 SOP | `done` | 正式 02 停审且输入无相互矛盾 |
| 逐问确认上游承接 | 上游关系映射、不再回答/必须回答 | `done` | 不越权重定义需求、架构、概要或 owner truth |
| 检查输入充分性 | 结构成熟度与 blocker | `done` | 将缺口显式登记，不把 pending 写成契约 |
| 诊断历史污染风险 | 改动前后对比 | `done` | 只识别风险，不继承旧结论 |
| 回填、自检和门禁 | §1/§17 回填草稿 | `done` | 满足 Step 2 输入要求；未闭合项可受控保留 |

## 2. SOP 问题回答

### 2.1 当前详细设计直接承接哪些结论？

承接已停审的 `00-需求文档.md`、`01-架构设计.md` 和 `02-概要设计.md`。其中 02 是直接设计输入，固定了 Desktop-first 客户端职责、七个组成部分、实现主体和分层、Chat-local 对象轮廓、Query/Command/Inbound/Outbound/Operations 接口类别、关键流程、状态轴、异常与配置影响，以及明确的详细设计承接清单。

依赖侧仅承接正式owner/SDK已明确边界。Conversation/Turn/Participant、Project/Member、ProcessInstance/Activity/Token/Gateway、Gate/Decision、Artifact、Workspace、Runtime与Observability truth分别归正式owner；业务只经SDK。Process为L1-process，整体/阶段/节点投影是只读正式输入；绑定owner与公司目录provider尚待确认。L6-bridges为边界参考，不输入未停审设计。

### 2.2 概要设计代码主体框架是否足够稳定？

02 的逻辑主体足够进入详细设计；其后置的语言/framework/native shell和文件布局应由 Step 3/4收敛，而不是作为禁止设计的理由。2026-09-29纠正：Step3按已认可方案选择React/TypeScript + Tauri 2，Step4给出计划package/文件树；这仍不表示SDK/host资格已验证。

### 2.3 关键对象、接口骨架、处理流和状态机是否足够继续展开？

概要粒度足以列出 Step 2 的覆盖范围并登记 exact contract 缺口。对象字段、完整函数签名、SDK DTO/event/result/ref schema、错误、幂等 key、cursor/resume 方法、平台宿主绑定和 store serialization 仍未闭合。它们不能作为已确定实现契约继续向下补造。

### 2.4 哪些轮廓必须补清，哪些缺口阻塞？

需要继续明确页面/view model/store/reducer、SDK消费和结果/恢复的客户端契约。SDK/owner exact surface与安全能力不能由Chat补造；客户端载体/package/目录是详细设计责任，可按授权收敛。Web/Mobile不扩大V1范围；宿主权限、durable存储、通知和兼容资格保持局部开放。

### 2.5 哪些上游结论不可重定义？

- 00 的产品目标、核心能力闭环、用户需求、验收方向、数据归属和边界。
- 01 的系统上下文、架构单元、SDK-only方向、owner truth分工与ADR；载体后置状态由Step3实现选型承接，不冻结为永久候选。
- 02 的七个主要组成部分、对象/接口/流程/状态主语与配置影响。需要改变这些主语时，必须回退 02 对应 calibration，而不是在 03 偷换。
- SDK 和各 owner 的授权、身份、scope/visibility、业务状态、协议、事件/结果、Artifact 正文和 Workspace projection。

## 3. 上游关系映射

| 来源文档 | 已收敛承接内容 | 本文允许继续展开 | 不允许在 03 重定义 |
|---|---|---|---|
| `projects/L5-chat/00-需求文档.md` | 产品入口、Desktop-first、能力闭环、故事/功能/规则、数据归属、质量边界、验收方向 | 将功能映射到客户端模块/实现单元和 local state seam | 需求目标、owner truth、验收谓词 |
| `projects/L5-chat/01-架构设计.md` | shared semantic core + shell、SDK-only、七个架构单元与后置载体决策 | Step3选择实现载体、Step4定义文件布局，保持原机制/范围 | ADR、数据所有权、通信方向和owner truth |
| `projects/L5-chat/02-概要设计.md` | 主体框架、组成部分、对象/接口类别、流程、状态轴、错误和配置影响 | 实现单元、模块契约、精确 Chat-local schema/函数/错误/生命周期 | 概要主语增删改、owner protocol 或状态真相 |
| `02-概要设计.md` v1.1.0-chapter-reviewed §5～12 | 六新增项目/流程/关系/目录对象和ClientConsumptionContext；五标签、八Query、两局部入口、来源分立reducer/恢复 | 在既有协作/安全/材料/连续性/平台/本地模块内展开typed对象/组件/导航，保留概要32个独立对象及同名接口 | 不从原型/Work/Runtime补流程、不推join，不将目录/关系可见提升目标权限 |
| `projects/L1-process/01-架构设计.md`、`02-概要设计.md` | Process truth/只读派生与Work/Governance/Runtime分界 | 所需projection/版本/节点关联SDK adapter mapping及blocked路径 | 正向投影/DTO/事件合同未确认不能定义为已有API |
| `draft/prototype/原型停审记录.md`、`原型信息架构记录.md`、`原型恢复与可访问性记录.md` | 项目详情五标签、整体→阶段→节点、双向群聊、目录、并行结构与等价路径的体验核对 | 作为页面/组件/局部交互输入，必须与正式02一致 | 演示坐标/数据/交互不构成schema、实现、AT或验收证据 |
| `projects/L0-sdk/00～07` | 唯一业务接入边界及已正式定义的 typed capability | adapter 对正式 surface 的映射，前提是 exact surface 已存在 | SDK 内部实现、bus/transport private contract、猜造 DTO |
| `L1-conversation/00～07`、`L1-identity/00～07`、`L1-work/00～07`、`L1-governance/00～07`、`L1-artifact/00～07`、`L1-workspace/00～07`、`L2-member/00～07`、`L2-runtime/00～07`、`L4-observability/00～07` | 各自 truth owner、可供消费的已正式能力和安全边界 | Chat consumer mapping、safe presentation、缺口/降级映射 | 对方 truth、内部数据结构或未闭合 consumer API |
| `projects/L6-bridges/` | 仅并行兄弟边界参考 | 确认不含外部平台映射/credential/body | 任何未停审 Bridges 设计 |

## 4. 代码主体成熟度与差异诊断

| 维度 | 02 当前成熟度 | 03 允许动作 | 缺口/风险 |
|---|---|---|---|
| 逻辑模块与职责 | 已稳定主体和责任边界 | 在不变更主语下映射实现单元 | 需技术/编码形态约束 |
| 领域对象 truth | owner 分工稳定；Chat-local 候选对象已列 | 后续只定义 Chat-local view/local state contract | owner DTO/ref 未全部 exact |
| 接口与流程 | 能力类别、P0及项目/流程/目录读取、consumer/恢复骨架稳定 | 定义adapter前核验SDK正式能力；Chat内部类型不冒充wire contract | CHAT-UP001～009、WS-UP001～008 |
| 客户端状态 | 多轴语义与合法/禁止迁移已稳定于概要级 | 后续展开 Chat-local state 的存储和 reducer contract | 不得映射 ACK/cache 为 confirmed |
| 技术/平台 | 架构机制固定，载体后置 | Step3按授权收敛React/TS + Tauri 2 | 具体host/存储资格仍开放 |
| 文件布局 | 概要不应规定具体目录 | Step4定义可直接用于未来建仓的计划树 | 计划不代表仓/文件已创建 |

### 改动前后对比

| 维度 | 旧材料风险（仅诊断） | 当前基线与处理 |
|---|---|---|
| UI 与 SDK 职责 | 旧 03 可能把服务端/Rust 处理或 UI 混写 | 00～02 明确 Chat 是展示与受控交互客户端，SDK 提供唯一业务 seam |
| 技术决定 | README/旧文档可能把历史框架变成决定 | 01保留候选；03 Step3按用户已认可方向选择React/TS+Tauri2用于设计，host/兼容验证仍待确认 |
| 领域 truth | 旧对象和协议可能在 Chat 重新定义 | 各 owner 持有 truth；Chat 只定义局部展示/交互状态 |
| 事件与结果 | transport ACK/推送/普通receipt误作确认 | 只有正式result/change或合同明确具业务确认含义receipt经gate支持confirmed；resume只影响连续性 |

## 5. 设计取舍

1. 02逻辑主体是Step3/4的输入，载体和布局由这两步主动收敛；仅实际欠缺的上游合同阻塞对应正向集成。
2. 保留缺少 exact contract 的 Query/Command/change/resume 能力为 `blocked/pending`，不靠包装或 local DTO 伪闭合。
3. 仅允许在 Chat 内拥有导航/选择/草稿/尝试/缓存/展示恢复状态；任何业务 owner 状态都作为 SDK 输入展示。
4. 继续执行 `L6-bridges` 平行兄弟隔离；只把其潜在职责作为排除项。

## 6. 结构化中间产物：边界与 blocker

| 类别 | 当前判断 | 03 的处理规则 |
|---|---|---|
| Chat-local truth | route/context、selection/focus、draft、local intent/attempt、view model、store/reducer、受限缓存、恢复上下文和平台体验 | 可继续定义，但不得影射 owner truth |
| SDK seam | Query/Command/Event/ref/change/resume/auth/error/retry/trace/redaction | 只用正式可读 contract；未闭合保持 blocker |
| 正式 owners | Conversation、Identity、Work、Process、Governance、Artifact、Workspace、Member、Runtime、Observability及待确认正式关系/目录provider | 不复制schema/state/lifecycle；Identity AI员工身份不自动提供全公司人类+AI目录 |
| 外部/平台边界 | Desktop host、Web/Mobile shell、OS capability | 架构候选不能直接变正式绑定 |
| 旧正式文档 | `historical_material` | 不作为实现输入，不复制其目录和技术选择 |

## 7. 回填草稿

本文承接正式00～02并在不改变概要主语下展开客户端契约。载体/编码/布局由Step3/4收敛；owner truth、授权、DTO和SDKprotocol保持唯一上游来源，未闭合exact seam阻塞相应正向集成，不用本地私有协议代替。

## 8. 待确认事项

| ID | 待确认项 | 影响 | 状态 |
|---|---|---|---|
| `CHAT-DDD-003-TECH-001` | Step3收敛React/TypeScript + Tauri 2，Step4定义布局 | 编码/载体设计完成，不代表host验证 | `resolved_for_design` |
| `CHAT-DDD-003-SDK-001` | L0-sdk 对 Chat 场景的 exact Query/Command/change/resume/ref/error surface | Step 7～9、后续协议/处理流 | `inherited_blocker` |
| `CHAT-DDD-003-OWNER-001` | owner safe view、Gate receipt/result、Artifact preview、Workspace view 等 exact contracts | 后续模块/协议契约 | `inherited_blocker` |
| `CHAT-UP-008` | Process整体/阶段投影、Gateway/分支状态、节点关联/版本与SDK change/resume | 流程图、节点详情、reducer/恢复；正向blocked | `inherited_blocker` |
| `CHAT-UP-009` | 绑定owner/解绑/撤销、目录provider/人类AI覆盖/搜索分页及可见性 | 双向入口、目录/成员/DM；各目标独立授权 | `inherited_blocker` |
| `CHAT-BASE-001` | 00新增追溯行引用未定义AC-NFR008～024 | 只引用AC-NFR001～007、NFR001～024与AC-FR011～014，不能互换 | `open` |

### 当前不再回答 / 必须回答（2026-10-01）

- 不再回答：需求/owner/七单元/项目进度归项目详情/只读Process及Gateway与Gate分立等上游决定；不重定正式绑定、目录provider或SDK schema。
- 必须回答：现有模块/布局如何承接七新增对象与同名query/navigation、图/列表/焦点、source-local版本/context代次、optimistic/confirmed/failed/unknown、恢复/清理及planned测试切口；这些由后续被授权的Step依次展开。

## 9. 自检与下一步门禁

- 正式 00～02 与 02 Step 12 均已读取；flow 与台账已恢复并矛盾审查。
- Step 1 未修改正式上游、未写正式 03，也未以 L6-bridges 设计作为输入。
- 已明确直接承接、边界、不再回答、必须回答和输入不足风险。
- 上游 truth 与 Chat-local state 有单一权威来源；所有 pending contract 均标 blocker。
- gate：`pass`，允许创建 Step 2；不代表 SDK/owner integration 或实现 readiness。

## 2026-10-01 重审收口

计划/输入：读取当前台账、03 flow、Step1 SOP/规范5.1、既有Step1与修复后02承接清单/对象/接口；前轮技术资格按设计与集成分层。诊断：缺Process/项目/关系/目录/context以及普通receipt非确认约束；原位更新映射、成熟度、缺口及本文边界。复杂度使用来源表，无图。自检：旧正式03未改，候选载体由Step3收敛，无新SDK DTO；上游编号缺口open。Step1 done，gate pass_with_upstream_blockers，仅允许当前Step2重审；不推进未完成部分/实现/测试/提交。
