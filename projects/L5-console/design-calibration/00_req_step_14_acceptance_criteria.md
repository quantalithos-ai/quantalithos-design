# Step 14 · 验收标准

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 14 · 验收标准 |
| 输出文件 | `design-calibration/00_req_step_14_acceptance_criteria.md` |
| 当前模式 | `full-restart + single-agent-serial` |
| 已读取规范 | yes，需求 SOP Step 14、书写规范 §4.14 与通用规范 |
| 已读取前序输入 | yes，Step 7 闭环、Step 9 功能、Step 10 规则、Step 11 数据、Step 13 NFR |
| 模块骨架 | done：五类验收 / 六节点停审 / 一票否决 / 追溯审计 |
| 进入条件 | `pass`，Step 13 已完成 |

## 2. Step 内计划

| 计划项 | 状态 | 产物 / 门禁 |
|---|---|---|
| 按 C1~C6 形成核心闭环验收 | done | 见 §7.1 |
| 覆盖全部核心与外围功能能力 | done | 见 §7.2 |
| 覆盖规则/边界、数据归属和禁止正文 | done | 见 §7.3~§7.4 |
| 覆盖六类 NFR 与可访问性专项 | done | 见 §7.5 |
| 列出整体一票否决项并限定范围 | done | 见 §7.6 |
| 完成能力级停审、跨能力追溯与遗漏审计 | done | 见 §7.7~§7.8 |
| 形成正式回填草稿、自检和三层门禁 | done | 见 §9、§11~§12 |

## 3. 本步输入

| 输入 | 本步使用方式 |
|---|---|
| Step 7 | 验收先证明六个能力节点成立，再证明整体可信管理闭环；箭头不被改写为测试顺序。 |
| Step 9 | `FR-CON-001~018` 和 `FR-CON-E01~E03` 必须全部有功能能力验收；未开放能力以安全 blocked/read-only 条件验收。 |
| Step 10 | 规则/边界验收检查 truth owner、SDK/正式边界、Policy/Gate、结果分层、局部降级和禁止隐式变化。 |
| Step 11 | 数据验收检查 client truth、owner snapshot、external ref 和 forbidden body 四类归属及生命周期语义。 |
| Step 13 | NFR 验收采用行为判断口径；旧 P95、首屏、99.9%、38/8 数量不作为目标。 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些条件满足后核心闭环成立？ | C1~C6 均能按其适用范围确认语境、资格、来源保真的读取、受控意图/正式结果、管理主题和保守降级/可访问恢复；每一节点没有越过 owner truth。 |
| 哪些功能满足后需求算完成？ | 每项核心功能有可判断的外部结果和失败上限；C5 尚未开放的 owner command 以明确的 read-only/blocked 姿态通过，不把未集成当完成。外围功能可保持 pending。 |
| 哪些规则/边界必须满足？ | 不得本地授权、直连数据库、复制规则或正文、绕过 Policy/Gate、以 UI 推导治理/合规/readiness、将 query 反写或 unknown 自动重放；跨 owner 状态不能伪装统一 truth。 |
| 哪些数据边界必须满足？ | Console 自有 truth 仅为客户端交互事实；owner 结果仅安全 snapshot/ref；credential、受限/原始正文、证明材料和敏感诊断不得进入 Console 生命周期。 |
| 哪些 NFR 必须达标？ | 安全 fail-closed、局部故障隔离、结果/来源可追溯、语义一致、诊断可观察且不改变业务、所有适用核心路径具备可访问等价路径；数值目标待 authority 不影响行为底线。 |
| 哪些失败属于一票否决？ | 任何会泄露或制造业务 truth、放宽权限、伪造正式成功/治理结论、保存 forbidden body、无依据重放副作用，或使适用核心管理目标无法通过辅助技术完成的情形。一般性能数字、外围缺口和未开放正向 contract 不自动构成一票否决。 |

## 5. 当前材料与旧文档问题诊断

| 材料 | 问题 | 当前处理 |
|---|---|---|
| 旧验收表 | 用页面绿色、固定控制项/指标数量、P95 和 SLA 作为通过条件 | 改为能力、来源、状态、边界和可访问性条件；旧数字只在历史污染审计中保留 |
| 旧“成功”判定 | transport/HTTP/toast/刷新即视为完成 | 要求 owner 正式 result/confirmation；accepted/pending/unknown 不等于完成 |
| 旧依赖验收 | 只验证 API 可达或页面渲染 | 验收 query/command 语义、局部降级、最小披露和正式引用，不验证私有 endpoint |
| 旧审计/治理验收 | 页面自行算合规、hash、readiness | 只验收正式 owner 决定/结果/ref 的保真呈现；Console 不产生 verdict |
| 旧可访问性验收 | 单列键盘检查，未覆盖失败路径 | 覆盖语境、资格、读取、草稿、确认、结果、错误和恢复的等价目标 |

## 6. 改动前后对比与设计取舍

| 主题 | 旧口径 | 当前取舍 |
|---|---|---|
| 验收主轴 | 页面/接口是否返回 | 六节点能力与五类约束是否闭合 |
| 未开放能力 | 缺口即隐藏或假设已集成 | 安全 blocked/read-only 是明确可验收姿态，正向 surface 仍 pending |
| 证据 | 命令、报告、baseline、run_id 预填 | 只定义未来应具备的证据类型边界，不伪造任何实现或运行事实 |
| 一票否决 | 一般失败与整体失败混在一起 | 只保留 truth、权限、敏感数据、正式结果和核心可访问性破坏项 |
| 数值 | 无 authority 的固定阈值 | 行为口径先行；数值需后续 owner 明确场景和基线 |

## 7. 结构化中间产物

### 7.1 核心能力闭环验收

| 验收类别 | 验收项 | 验收条件 | 能力 / 功能来源 |
|---|---|---|---|
| 核心能力闭环验收 | `AC-CON-001` 可信会话与访问语境 | 受保护视图和意图均能确认当前正式 actor/scope 语境；语境不可验证、过期、撤销或冲突时不披露受保护内容或放行动作，并提供最小披露的恢复方向。 | `C-CON-1`; `FR-CON-001~002`; `BR-CON-001~004`; `NFR-CON-004`, `007~009` |
| 核心能力闭环验收 | `AC-CON-002` 导航、可见性与动作资格 | 入口和动作姿态不超过正式 visibility/资格结果；restricted/unknown/unavailable 可理解且不泄露对象存在性；路由、菜单、按钮和客户端角色不能放宽正式决定。 | `C-CON-2`; `FR-CON-003~004`; `BR-CON-005~008`; `NFR-CON-007`, `009`, `019~020` |
| 核心能力闭环验收 | `AC-CON-003` owner-safe 查询与视图解释 | 查询结果能保留 owner/source、当前性、coverage、availability、consistency 语境，并区分正式为空、未覆盖、裁剪、过期、部分和不可得；筛选/分页/下钻不改变来源事实。 | `C-CON-3`; `FR-CON-005~006`; `BR-CON-009~012`; `NFR-CON-001~003`, `010`, `013`, `016`, `018` |
| 核心能力闭环验收 | `AC-CON-004` 受控意图与正式结果确认 | 未提交草稿、提交/受理、处理中、正式确认、拒绝和 unknown 可区分；只有 owner 正式结果可声明业务完成；unknown 不被自动重放。 | `C-CON-4`; `FR-CON-007~009`; `BR-CON-013~019`; `NFR-CON-011`, `014~017`, `019~021` |
| 核心能力闭环验收 | `AC-CON-005` 管理主题视图与回链 | 员工、项目/Workspace、方法、治理/evidence、审计/指标、Capability、Archive、Sandbox 八类主题均能在其正式 owner 范围内呈现安全状态和回链；未闭口正向能力明确为 read-only/partial/blocked，不生成第二 truth、verdict 或 readiness。 | `C-CON-5`; `FR-CON-010~015`; `BR-CON-020~027`; `NFR-CON-005~012`, `013`, `016`, `018~020` |
| 核心能力闭环验收 | `AC-CON-006` 保守降级、恢复与可访问交互 | partial/stale/missing/unavailable/conflict/unknown 有可感知区分；可安全重验、重试、回查或退出；键盘、读屏及其他受支持辅助技术能完成所有适用核心目标。 | `C-CON-6`; `FR-CON-016~018`; `BR-CON-028~033`; `NFR-CON-001~002`, `004~006`, `008~009`, `014`, `016~021` |
| 核心能力闭环验收 | `AC-CON-007` 整体闭环与反馈闭合 | 六项节点均达到相应条件，且任一 owner 局部故障不会被错误扩散或掩盖；重新验证/查询能够把失效和恢复反馈回 C1/C2/C3；未开放 command 不影响只读闭环的诚实性。 | `C-CON-1~6`; `FR-CON-001~018`; `BR-CON-001~033`; `NFR-CON-004~021` |

#### C1~C6 能力级停审

| 节点 | 停审结论 | 未通过时的边界 |
|---|---|---|
| C1 | 语境、失效和最小披露条件均可判断，`pass` | 任何受保护内容/动作在语境 unknown 时均不得进入后续验收 |
| C2 | 入口与资格只反映正式决定，`pass` | 不能以 UI 可见性代替资格；正向动作保持 blocked |
| C3 | 来源和多轴状态保真，`pass` | 无法解释来源/coverage 时只能 partial/unknown |
| C4 | 草稿、受理、正式结果和 unknown 分层，`pass` | 无正式 result/ref 不得判定业务完成 |
| C5 | 八主题均有 owner-safe 消费面，`pass_with_positive_surfaces_pending` | 单个 owner 合同缺失只阻塞其正向面，不得伪造 ready |
| C6 | 降级、恢复、a11y 全路径覆盖，`pass` | 任一适用核心目标无等价恢复/辅助路径即阻断整体闭环 |

### 7.2 功能能力验收

| 验收类别 | 验收项 | 验收条件 | 功能来源 |
|---|---|---|---|
| 功能能力验收 | `AC-FR-001` 访问语境能力 | `FR-CON-001~002` 的语境锚定、显式转换与失效保护均可观察；不可验证时内容和动作安全收紧。 | `FR-CON-001~002`; `US-CON-001~003` |
| 功能能力验收 | `AC-FR-002` 入口与资格能力 | `FR-CON-003~004` 的入口发现、动作姿态和安全原因表达均来自正式 visibility/资格结果，不由本地角色或开关放宽。 | `FR-CON-003~004`; `US-CON-004~006` |
| 功能能力验收 | `AC-FR-003` 查询与探索能力 | `FR-CON-005~006` 的 owner-safe 读取、筛选、排序、分页、摘要和安全下钻均保留来源/状态并区分空与缺失。 | `FR-CON-005~006`; `US-CON-007~009` |
| 功能能力验收 | `AC-FR-004` 草稿与结果能力 | `FR-CON-007~009` 的本地草稿、提交前复核、条件化提交、结果分层和 unknown 回查均不把 transport/UI 状态表述为业务完成。 | `FR-CON-007~009`; `US-CON-010~012` |
| 功能能力验收 | `AC-FR-005` 员工管理消费面 | `FR-CON-010` 仅呈现 identity/member-service 正式摘要、引用和开放入口；owner surface 缺失时保持只读/partial/blocked。 | `FR-CON-010`; `US-CON-013` |
| 功能能力验收 | `AC-FR-006` 项目与 Workspace 监督面 | `FR-CON-011` 能分 owner 呈现项目、工作、过程与 Workspace 安全结果及 coverage/回链；不得生成进度或 Workspace truth。 | `FR-CON-011`; `US-CON-014` |
| 功能能力验收 | `AC-FR-007` 方法资产消费面 | `FR-CON-012` 能浏览正式方法目录/版本并区分本地草稿；未开放提交能力明确 blocked，不把草稿当正式版本。 | `FR-CON-012`; `US-CON-015` |
| 功能能力验收 | `AC-FR-008` 治理与 evidence 审阅面 | `FR-CON-013` 能呈现 Governance/SoA/AIIA/Control/Gate 正式状态、决定和 Artifact evidence refs；不可见/不一致时不生成 verdict。 | `FR-CON-013`; `US-CON-016` |
| 功能能力验收 | `AC-FR-009` 审计与指标审阅面 | `FR-CON-014` 能呈现 Observability 正式审计、指标定义/结果、coverage/freshness 和获准入口；不固定控制项/指标数量或阈值。 | `FR-CON-014`; `US-CON-017` |
| 功能能力验收 | `AC-FR-010` Capability/Archive/Sandbox 管理面 | `FR-CON-015` 将三类 owner 状态轴、引用和入口分开呈现；不可用时局部降级，不组合 readiness 或执行结论。 | `FR-CON-015`; `US-CON-018~020` |
| 功能能力验收 | `AC-FR-011` 降级与恢复能力 | `FR-CON-016~017` 能区分非理想状态并提供与问题匹配的重试、重验、回查、退出或草稿保持；无安全路径时明确停止。 | `FR-CON-016~017`; `US-CON-021~022` |
| 功能能力验收 | `AC-FR-012` 可访问管理路径 | `FR-CON-018` 的页面结构、状态、确认、错误和恢复对键盘、读屏和其他辅助技术可感知、可操作并与视觉目标等价。 | `FR-CON-018`; `US-CON-023` |
| 功能能力验收 | `AC-FR-013` 外围增强条件 | `FR-CON-E01~E03` 仅在相应正式合同具备时启用；偏好不改权限，趋势不伪造可比性，批量逐项结果不冒充整体成功。 | `FR-CON-E01~E03`; `US-CON-E01~E05` |

当前验收不要求外围增强正向实现；合同未闭口时其安全不启用/blocked 姿态即为需求边界结果。

### 7.3 规则 / 边界验收

| 验收类别 | 验收项 | 验收条件 | 规则来源 |
|---|---|---|---|
| 规则 / 边界验收 | `AC-BR-001` 语境边界 | 受保护内容/意图始终绑定可判别正式语境；Console 不签发 credential、不定义身份/角色/scope，语境变化显式生效。 | `BR-CON-001~004` |
| 规则 / 边界验收 | `AC-BR-002` 资格与导航边界 | 入口/动作不超过正式 visibility/资格；route、菜单、按钮、feature flag、客户端角色和缓存不得授权或放宽；受限原因最小披露。 | `BR-CON-005~008` |
| 规则 / 边界验收 | `AC-BR-003` 查询无写与来源边界 | 查询、筛选、分页、下钻和客户端聚合不创建/改变业务 truth；source/freshness/coverage/availability/consistency 与空/缺失语义不被消平；所有业务读取经 SDK/正式边界。 | `BR-CON-009~012` |
| 规则 / 边界验收 | `AC-BR-004` 意图与结果边界 | 草稿、受理、处理中和 owner 正式结果可区分；HTTP/toast/刷新不代表完成；unknown 不自动重放；治理前置和正式审计/引用不得被客户端确认替代或伪造。 | `BR-CON-013~019` |
| 规则 / 边界验收 | `AC-BR-005` 管理主题 truth 边界 | Console 不拥有任何列明 owner 的业务/治理/证据/workspace/能力/观测/归档/sandbox truth，不以 UI/固定数量/阈值推导结论；Workspace projection、审计生成、能力注册、Archive/Sandbox 执行不迁入。 | `BR-CON-020~027` |
| 规则 / 边界验收 | `AC-BR-006` 降级与可访问边界 | 非理想状态不归一为空/成功/绿色/合规/ready；owner 故障局部隔离；恢复显式更新；辅助技术路径覆盖同一目标，不能以视觉可用抵消。 | `BR-CON-028~033` |
| 规则 / 边界验收 | `AC-BR-007` 外围边界 | 个性化不改权限，趋势只在 owner 声明可比较时成立，批量逐项结果保持可判别；外围合同缺失时不隐式启用。 | `BR-CON-E01~E03` |

### 7.4 数据归属验收

| 验收类别 | 验收项 | 验收条件 | 数据来源 |
|---|---|---|---|
| 数据归属验收 | `AC-DR-001` Console 自有交互真相 | 会话壳/选择、导航/布局、筛选/分页/下钻意图、未提交草稿、客户端请求呈现、错误/恢复/焦点/播报和明确保存偏好仅表示 Console 交互事实，不被解释为认证、授权或业务 truth。 | `DR-CON-001`, `005`, `009`, `013~014`, `025~026` |
| 数据归属验收 | `AC-DR-002` owner-safe 快照 | actor/scope/visibility/资格、各 owner 管理摘要、正式结果摘要、诊断上下文和外围比较/批量摘要仅在 owner-safe 合同允许时以快照存在，并随 owner/语境/可见性变化更新或撤除，不形成独立生命周期。 | `DR-CON-002`, `006`, `010`, `017~022`, `027~028` |
| 数据归属验收 | `AC-DR-003` 外部引用 | actor/scope、业务对象/版本/lineage、receipt/result/reconciliation、治理决定、artifact/evidence、audit/metric/report、capability/archive/sandbox 和外围导出结果只作为安全引用关系存在，不拥有所指正文生命周期。 | `DR-CON-003`, `007`, `011`, `015`, `023`, `029` |
| 数据归属验收 | `AC-DR-004` forbidden body | credential/secret、身份/授权/Policy/Gate 证明、隐藏/原始载荷、业务/治理/制品/审计/报告/能力注册/归档包/sandbox 正文以及含这些内容的日志、诊断、错误、导出正文不进入 Console 生命周期。 | `DR-CON-004`, `008`, `012`, `016`, `024`, `030` |
| 数据归属验收 | `AC-DR-005` 归属无重复 | 同一正式业务事实不存在同时被 Console 声称为真相、独立快照和可替代 owner 的多重语义；跨 owner 联合视图保留分域来源、coverage 和状态。 | `DR-CON-009~024`; `BR-CON-009~027`; `NFR-CON-013` |

### 7.5 非功能验收

| 验收类别 | 验收项 | 验收条件 | NFR 来源 |
|---|---|---|---|
| 非功能验收 | `AC-NFR-001` 性能与负载隔离 | 本地导航、筛选、草稿、焦点和状态切换不因无关 owner 阻塞；相关查询/回查有可解释进展或局部降级；无界 fan-out、重复自动查询和 unknown 重放不成为默认行为。精确数字待 authority。 | `NFR-CON-001~003` |
| 非功能验收 | `AC-NFR-002` 核心可用性 | 语境不可验证时整体 fail-closed；单 owner 故障只影响可证明依赖区域；未开放能力稳定为 read-only/partial/blocked，其他已授权能力仍有明确姿态。 | `NFR-CON-004~006` |
| 非功能验收 | `AC-NFR-003` 安全与最小披露 | 所有业务访问经 SDK/正式服务边界；不存在本地授权放宽、Policy/Gate 绕过、forbidden body 进入或撤销后继续沿用旧允许姿态。 | `NFR-CON-007~009` |
| 非功能验收 | `AC-NFR-004` 审计与可追溯 | 管理声明可回指正式 source/version/ref；意图结果可区分草稿、receipt、pending、confirmed、rejected、unknown；客户端诊断与正式 audit/evidence 语义分离。 | `NFR-CON-010~012` |
| 非功能验收 | `AC-NFR-005` 幂等与一致性 | owner truth 保持单一；snapshot/view model 不成为第二真相；unknown 不自动重放；草稿/布局/筛选不产生业务副作用；跨 owner 不伪装原子一致。 | `NFR-CON-013~015` |
| 非功能验收 | `AC-NFR-006` 可观测性 | 能安全区分客户端语境、owner 依赖、查询、提交、回查、降级和恢复；诊断 sink 失败不改变业务结果、权限或恢复安全；状态分类与用户语义一致。 | `NFR-CON-016~018` |
| 非功能验收 | `AC-NFR-007` 可访问性等价 | 所有适用 C1~C6 核心路径可通过键盘及受支持辅助技术完成；状态/资格/错误/确认不只靠颜色/位置/瞬时提示；非视觉路径具有同等恢复和安全上限。 | `NFR-CON-019~021` |

### 7.6 一票否决项

以下任一情形发生时，整份 `00` 需求不得判定为通过；它们不是一般缺陷清单，也不替代后续测试方案。

| ID | 一票否决情形 | 触发的能力/边界 |
|---|---|---|
| `VETO-CON-001` | Console 通过数据库、内部 repository/bus、服务源码旁路或本地聚合规则取得/修改业务事实，或形成 owner truth 的替代投影。 | `BR-CON-010~012`, `BR-CON-021`, `NFR-CON-007`, `NFR-CON-013` |
| `VETO-CON-002` | actor/scope/visibility/资格不可验证、已撤销或冲突时仍披露受保护内容、对象存在性或危险动作入口。 | `BR-CON-001~008`, `NFR-CON-004`, `NFR-CON-009` |
| `VETO-CON-003` | 以 HTTP/SDK 成功、toast、缓存命中、刷新或客户端乐观状态宣称业务已完成，或对 unknown 副作用请求无正式依据自动重放。 | `BR-CON-013~016`, `NFR-CON-011`, `NFR-CON-014` |
| `VETO-CON-004` | credential/secret、隐藏或原始载荷、治理/授权/evidence/audit/report/业务正文等 forbidden body 进入 Console 数据、日志、诊断、错误或导出生命周期。 | `BR-CON-021`, `BR-CON-027~029`, `DR-CON-004`, `008`, `012`, `016`, `024`, `030`, `NFR-CON-008` |
| `VETO-CON-005` | UI 状态、固定控制项/指标数量、客户端阈值或局部结果被用来生成/宣称审批、合规、审计、能力、归档、运行或 readiness 结论。 | `BR-CON-022`, `024~027`, `NFR-CON-010`, `013` |
| `VETO-CON-006` | 任一适用核心管理目标在键盘、读屏或其他受支持辅助技术路径上无法理解、操作或安全恢复，而视觉路径“可用”被用来抵消该缺陷。 | `BR-CON-032~033`, `NFR-CON-019~021` |
| `VETO-CON-007` | 单一 owner 故障被错误扩散为全局事实，或其他 owner 的成功被用来掩盖局部失败、过期、冲突或 unknown。 | `BR-CON-031`, `NFR-CON-005`, `NFR-CON-013`, `NFR-CON-018` |

未闭口的 exact SDK/owner contract、性能数值、兼容矩阵或外围 activation 本身不触发一票否决；若文档或实现把它们伪造为 ready、绕过 blocked 姿态或制造确定性结论，则转化为相应否决项。

### 7.7 能力级与跨能力验收停审

| 节点/范围 | 功能覆盖 | 规则覆盖 | 数据覆盖 | NFR 覆盖 | 一票否决覆盖 | 结论 |
|---|---|---|---|---|---|---|
| `C-CON-1` | `FR-CON-001~002` | `BR-CON-001~004` | `DR-CON-001~004` | `NFR-CON-004`, `007~009`, `016`, `019` | VETO-001/002/004/006 | `pass` |
| `C-CON-2` | `FR-CON-003~004` | `BR-CON-005~008` | `DR-CON-005~008` | `NFR-CON-001`, `007`, `009`, `015~016`, `019~020` | VETO-002/005/006 | `pass` |
| `C-CON-3` | `FR-CON-005~006` | `BR-CON-009~012` | `DR-CON-009~012` | `NFR-CON-001~003`, `005`, `010`, `013`, `016`, `018~020` | VETO-001/004/005/007 | `pass` |
| `C-CON-4` | `FR-CON-007~009` | `BR-CON-013~019` | `DR-CON-013~016` | `NFR-CON-003`, `006~009`, `011`, `014~017`, `019~021` | VETO-002/003/004/005/006 | `pass` |
| `C-CON-5` | `FR-CON-010~015` | `BR-CON-020~027` | `DR-CON-017~024` | `NFR-CON-002~013`, `016`, `018~020` | VETO-001/004/005/007 | `pass_with_positive_surfaces_pending` |
| `C-CON-6` | `FR-CON-016~018` | `BR-CON-028~033` | `DR-CON-025~030` | `NFR-CON-001~002`, `004~006`, `008~009`, `011~012`, `014`, `016~021` | VETO-003/004/006/007 | `pass` |
| 外围增强 | `FR-CON-E01~E03` | `BR-CON-E01~E03` | `DR-CON-026`, `028~030` | `NFR-CON-001~003`, `006`, `008`, `010~015`, `017~018` | 适用时受 VETO-004/005/007 约束 | `pass_conditional` |

### 7.8 跨能力验收审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 核心能力是否均有闭环验收 | pass | `AC-CON-001~007` 覆盖 C1~C6 和反馈闭合。 |
| 每项核心功能是否有验收承接 | pass | `AC-FR-001~012` 覆盖 `FR-CON-001~018`；C5 未开放面采用 blocked/read-only 条件。 |
| 外围功能是否被误当核心完成 | pass | `AC-FR-013` 明确条件化，不阻塞核心闭环。 |
| 每类硬规则是否有验收 | pass | `AC-BR-001~007` 覆盖核心四类及治理/审计扩展。 |
| 四类数据归属是否有验收 | pass | `AC-DR-001~005` 覆盖 truth/snapshot/ref/forbidden body 与无重复归属。 |
| 六类 NFR 与 a11y 是否有验收 | pass | `AC-NFR-001~007` 覆盖六类默认质量和可访问性专项。 |
| 是否有无来源验收项 | pass | 每项均回指能力、功能、规则、数据或 NFR；无孤儿项。 |
| 一票否决是否过宽 | pass | 仅列会破坏整体 truth/权限/敏感数据/正式结果/核心可访问性的情形；一般缺陷和 pending 不混入。 |
| 是否伪造证据、baseline、run_id、报告或 verdict | pass | 只写验收条件和未来证据边界，不宣称任何执行事实。 |

## 8. 复杂度判断

7 项核心闭环验收、13 项功能验收、7 项规则验收、5 项数据验收、7 项 NFR 验收和 7 项一票否决构成完整追溯骨架。表格数量来自跨章节覆盖，不是测试用例或实现任务；数值目标和正向 owner surface pending 不影响行为级验收闭合。单文件可审查，无需拆分附录。

## 9. 回填草稿

正式 §14 回填 §7.1 的核心闭环验收、§7.2 的功能能力验收、§7.3 的规则/边界验收、§7.4 的数据归属验收、§7.5 的非功能验收和 §7.6 一票否决项。正式正文可压缩 `AC-CON-001~007` 与五类表格的解释，但必须保留验收条件、pending 处理口径和否决项，不写测试步骤、工具、命令或运行结果。

## 10. 待确认事项

| ID | 待确认事项 | 当前处理口径 | 当前状态 |
|---|---|---|---|
| `CON-Q-031` | 数值性能、可用率、负载和兼容矩阵的正式 authority | 当前按行为级条件验收；获得 authority 后再增加场景化目标，不覆盖旧值 | `open / blocks_numeric_acceptance_only` |
| `CON-Q-032` | 各 owner 正向 query/command/result/ref 的 exact 合同与 activation | 未闭口面按 blocked/read-only 验收；不得以文档或 mock 伪造 ready | `open / blocks_positive_surface_acceptance` |
| `CON-Q-033` | 辅助技术/浏览器支持矩阵和诊断安全 envelope | 当前要求所有适用核心目标等价完成，具体组合后移到设计/测试 | `open / blocks_exact_test_matrix` |

## 11. 自检

| 检查项 | 结果 |
|---|---|
| 是否按核心闭环、功能、规则/边界、数据、NFR 五类组织 | pass |
| 每条验收是否有可判断条件而非测试步骤 | pass |
| 是否覆盖六节点、全部核心功能和外围条件 | pass |
| 是否覆盖 truth/权限/结果/forbidden body/降级/a11y 关键边界 | pass |
| 是否列出且限定了一票否决项 | pass |
| 是否允许 blocked/read-only 作为未开放 owner 的诚实结果 | pass |
| 是否未继承旧 P95、首屏、SLA、38/8 固定值 | pass |
| 是否未伪造 baseline、commit、run_id、测试结果、artifact、report、evidence、verdict、signoff 或 readiness | pass |
| 是否发现阻塞 Step 15 的 blocker | no；numeric/exact contract/compatibility pending 进入风险与待确认表 |

## 12. 三层门禁

| 层级 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| Step / 模块级 | `pass` | 五类验收、六节点停审、追溯覆盖和一票否决边界完整 | 更新 flow，激活 Step 15 | 本文件；Step 7/9~13；书写规范 §4.14 |
| 文档级 | `pass_to_step_15` | 所有关键能力、功能、规则、数据与 NFR 均有可判断验收条件 | 创建并完成 `00_req_step_15_risks_open_questions.md` | 本文件；Step 10~13 |
| 项目级 | `pass_with_open_contracts` | exact owner surface、数值目标和兼容矩阵 pending，不阻塞风险收纳 | 进入 Step 15；正式 00 仍不可写 | 项目台账；需求 flow |
