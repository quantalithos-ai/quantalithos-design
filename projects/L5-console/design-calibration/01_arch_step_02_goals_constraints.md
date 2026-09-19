# 01 架构 Step 2：架构目标与约束

> 对应正式章节：`01-架构设计.md` §2、§3  
> 当前模式：`full-restart + single-agent-serial`  
> 本步状态：`completed / stop_review`  
> 正式 `01` 写入：`false_until_step_16`

## 1. Step 状态与 Step 内计划

前序 Step 1 已通过门禁。本步只把已停审的 `00-需求文档.md` 和 Step 1 基线转译为架构层的结构目标、不可变约束、当前阶段取舍和架构非目标；不展开职责边界、上下文图、容器、依赖图、数据协议或技术选型。

| 计划项 | 状态 | 产物 / 门禁 |
|---|---|---|
| 读取 Step 1、正式 `00` §4/§7/§10/§14/§15 与上游架构约束 | done | §2 |
| 回答 Step 2 的目标、约束、取舍、量化和非目标问题 | done | §3 |
| 诊断旧正式文档、README 和 draft 的污染 | done | §4 |
| 比较候选架构路径并作取舍 | done | §5 |
| 形成结构化目标、约束、取舍和非目标 | done | §6 |
| 判断复杂度和是否需要拆分 | done | §7 |
| 形成正式 §2/§3 回填草稿 | done | §8 |
| 保留 pending、完成自检和三层门禁 | done | §9~§10 |

本步不拆附录或模块。目标与约束必须先作为仓级结构前提收稳，具体架构单元将在 Step 3~15 逐步展开。

## 2. 本步输入

| 输入 | 用法 |
|---|---|
| `01_arch_step_01_requirement_baseline.md` | 承接六个核心能力、Console 真相边界、SDK-only、forbidden-body、fail-closed、unknown 不重放和后移风险。 |
| `00-需求文档.md` §4、§7、§10、§14、§15 | 承接 `G-CON-*`、`C-CON-1~6`、`BR-CON-*`、`NFR-CON-*`、`AC-*`、`VETO-CON-*`、`RISK-CON-*`、`CON-Q-*`。 |
| `product/产品矩阵.md`、`product/最终目的.md`、`architecture/仓库拆分方案.md` | 仅承接 Console 在 L5 产品/分发层的产品位置和与 Chat 等产品的分工背景。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 承接 L0-core/L0-sdk 入口和 L1~L4 owner 的运行期消费方向；不在本步展开依赖分类表。 |
| 架构 SOP Step 2、架构书写规范 §4.2/§4.3 | 约束本步分别回答“必须成立什么”“绝不能碰什么”“当前有意识收缩什么”“本文明确不展开什么”。 |
| 旧 `01-架构设计.md`、README、`draft/` | 只做历史污染诊断，不提供新版架构真相。 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 这个仓在架构层面要确保什么成立？ | 要确保管理者能够在可信 actor/scope 语境下进入 Console，依据正式 visibility/资格理解入口和动作上限，经正式 SDK/服务边界消费带来源和多轴状态的 owner-safe 结果，区分草稿、请求经历和 owner 正式结果，并在多 owner 部分失败、过期、冲突、未知及辅助技术路径下保持保守、可恢复且不误导的客户端闭环。 |
| 哪些约束是不可变的？ | Console 不拥有或重定义任何外部业务、治理、制品、workspace、能力、观测、归档或 sandbox truth；业务读取和受控意图只能经 SDK/正式服务边界；正式 visibility/资格/Policy/Gate 优先且客户端只能收紧；owner/source/freshness/coverage/availability/consistency 不能被压平；transport/receipt/accepted 不等于 confirmed；unknown 不得无依据重放；forbidden body 不进入本地或诊断生命周期。 |
| 哪些约束是当前阶段可以接受的取舍？ | exact owner surface、safe-field、scope 层级、reconciliation、正向 activation、性能/可用率/兼容数字和诊断 envelope 尚未闭口时，保留能力级架构接缝；相关主题采用分 owner 的 `pending/blocked/read-only/partial` 上限，不以旧协议、mock、统一聚合或固定阈值补齐。 |
| 哪些目标可以明确判断，甚至量化？ | 当前可判断的是结构结果而非数值：受保护路径是否绑定可判别语境、客户端是否不放宽正式决定、结果是否保持多轴来源语义、unknown 是否挂起、单 owner 故障是否局部隔离、forbidden body 是否零进入、适用核心路径是否有等价可访问路径。没有当前 authority 时不写首屏、P95、SLA、可用率、控制项数量或指标数量。 |
| 哪些相关事项不是本仓架构当前要解决的问题？ | 身份签发/认证、授权和治理裁决、外部 owner 的领域模型与存储、服务端跨域投影、内部事件重放、Archive/Sandbox 执行、证据/报告生成、相邻产品主流程、具体框架/API path/DTO/数据库/源码目录、实现和测试证据均不属于本步架构主线。 |

## 4. 当前材料与旧文档问题诊断

| 历史材料表现 | 越界或污染 | 本步处置 |
|---|---|---|
| 旧 `01` 把 Console 写成组织治理“中心”，并以跨域聚合、审计回放、哈希验证和页面状态表达治理能力。 | 把消费面升级为治理/审计真相，混淆 owner 与客户端责任。 | 仅保留“统一管理入口”的产品背景；目标改为 owner-partitioned、安全呈现和回链。 |
| 旧 `01` 写死 SoA `38` 项、核心指标 `8` 个、首屏/P95/SLA/可用率数字。 | 无当前 authority 的历史数字被误当架构目标。 | 统一降级为历史污染；本步只保留行为级质量底线。 |
| 旧 `01` 预设 React/Svelte、图表库、widget registry、query adapter、shared permission/audit core 等方案。 | 技术或概要/详细设计内容反向约束架构目标。 | 不作为目标、约束或事实；后续只在技术选型 Step 讨论架构影响。 |
| 旧材料以按钮隐藏、前端角色、缓存命中或 policy-aware guard 表达权限。 | 暗示本地 RBAC 或 UI 状态可以授予资格。 | 约束改为正式 visibility/资格/Policy/Gate 输入，客户端只能收紧，unknown fail-closed。 |
| draft 以页面族、命令状态和组件分层预演 Console 结构。 | 可作为粒度参考，但尚未经过正式 owner contract 审计。 | 只借鉴边界表达；不继承模块名、状态枚举、协议或 ready 结论。 |

## 5. 改动前后对比与设计取舍

### 5.1 改动前后对比

| 维度 | 历史口径 | 本步架构口径 | 变化理由 |
|---|---|---|---|
| 目标单位 | 页面、看板、固定指标和“治理中心” | 客户端边界、正式语境、来源保真、结果分层和韧性结构 | 目标必须是架构必须确保成立的结构结果，而不是功能清单。 |
| 权限主语 | 前端角色、按钮和 guard | owner visibility/资格/Policy/Gate；客户端只能收紧 | 防止 UI 状态升级为授权真相。 |
| 查询主语 | Console 聚合多域并给出整体状态 | 各 owner 独立来源和多轴姿态，联合视图不生成 verdict/readiness | 保持单一 truth、局部降级和可追溯。 |
| 结果主语 | HTTP、toast、刷新或乐观状态 | owner 正式 result；unknown 先回查或挂起 | 防止重复副作用和虚假完成。 |
| 未闭口合同 | 通过旧协议、占位或统一模型补齐 | 维持能力级接缝和 `pending/blocked/read-only` | 不把 pending 写成 integrated/ready。 |

### 5.2 候选方案取舍

| 方案 | 优点 | 代价 / 风险 | 结论 |
|---|---|---|---|
| A. 在旧 `01` 上增量修补 | 表面改动少。 | 会继续携带固定数字、技术栈、聚合 truth 和本地权限语义，来源无法证明。 | 不采用。 |
| B. 以页面族为核心建立统一聚合架构 | 页面映射直观。 | 容易把跨 owner 状态压成单一健康/合规/readiness，并产生第二真相。 | 不采用。 |
| C. 以客户端交互边界为核心、按 owner 分域消费管理面 | 能同时守住 SDK-only、来源状态、局部降级和产品价值。 | 需要接受多 owner 非原子、正向能力按合同逐面开放。 | 采用。 |
| D. 现在直接闭口所有 owner exact contract | 表面上更容易进入实现。 | 越过 pending，易伪造字段、路径、错误或 activation。 | 不采用；保留架构级接缝。 |
| E. 以内部事件订阅作为失效和结果主链 | 反馈可能更快。 | 会引入私有 bus、cursor/replay/projection 责任，超出 Console truth。 | 不采用为核心前提；只接受 SDK 正式封装的可选提示，缺失时显式 requery/reconciliation。 |

## 6. 结构化中间产物

### 6.1 业务背景与结构性驱动力

Console 值得单独做架构设计，不是因为它需要更多后台页面，而是因为它是 L5 产品/分发层中唯一把多个正式 owner 的管理查询和受控意图转译为统一人类体验的边界。它必须同时处理可信访问语境、最小披露、来源与状态解释、请求结果不确定性、局部故障和辅助技术等跨页面结构问题；这些问题不能由任一业务 owner 或单个页面自行解决。

| 结构性驱动力 | 对架构的直接影响 |
|---|---|
| 多个正式 owner 的管理能力需要一个组织入口 | 采用 owner-partitioned 消费边界；不得建立跨域业务真相中心。 |
| 语境、可见性和资格可能撤销、过期或冲突 | 受保护路径必须先受正式语境约束；不可验证时 fail-closed。 |
| 查询结果的时效、覆盖和一致性不同 | 视图必须保留来源和多轴状态，不能以联合卡片生成统一当前性。 |
| 管理命令可能受理后异步完成或结果未知 | 草稿、receipt、pending、confirmed、rejected、unknown 必须结构分离；未知不自动重放。 |
| owner 合同成熟度不同 | 页面能力按 owner 独立开放；合同未闭口时保持 read-only/partial/blocked。 |
| 客户端需要导航、筛选、草稿和恢复连续性 | 这些交互事实归 Console，但不能成为授权、业务优先级或 owner result。 |
| 失败与辅助技术路径是产品语义的一部分 | 壳、错误、焦点和恢复必须允许局部隔离、保守遮蔽和等价非指针路径。 |

### 6.2 架构目标表

| ID | 架构目标 | 说明 | 主要来源 |
|---|---|---|---|
| `AG-CON-001` | 承载独立的 Console 客户端交互真相边界 | 否则导航、会话壳、筛选/布局、草稿和请求呈现会散落到业务 owner，或反过来侵入业务真相。 | `G-CON-001`; `DR-CON-001/005/009/013~014/025~027`; `C-CON-1/4/6` |
| `AG-CON-002` | 支撑正式 actor/scope/visibility/资格约束下的管理入口 | 否则页面发现、动作姿态和受保护内容会在客户端状态失效后继续放行。 | `G-CON-001/002`; `BR-CON-001~008`; `NFR-CON-004/007/009` |
| `AG-CON-003` | 保持 owner-safe 查询的来源、多轴状态和安全回链 | 否则空、未覆盖、过期、不可用或冲突会被误读为完整、当前或一致的业务事实。 | `G-CON-003`; `BR-CON-009~012/020~022`; `DR-CON-009~012/017~024` |
| `AG-CON-004` | 分离客户端意图、请求经历与 owner 正式结果 | 否则 accepted、transport success、toast 或刷新会冒充业务完成，未知副作用可能被重复提交。 | `G-CON-004`; `BR-CON-013~019`; `NFR-CON-011/014` |
| `AG-CON-005` | 以 owner 分域方式承载八类管理主题的可裁剪消费面 | 否则 Console 只能成为无价值的通用壳，或通过跨域聚合制造成员、治理、审计、能力和运行的第二真相。 | `G-CON-005`; `FR-CON-010~015`; `BR-CON-020~027` |
| `AG-CON-006` | 支撑局部故障隔离、保守恢复和可访问等价路径 | 否则一个 owner 的故障会错误扩散，或用户在 partial/stale/unknown/撤销状态下无法安全恢复。 | `G-CON-006`; `FR-CON-016~018`; `NFR-CON-005/018~021`; `VETO-CON-006/007` |
| `AG-CON-007` | 允许在外部合同逐步闭口时保持可替换、可追溯的架构接缝 | 否则 exact contract、激活状态和量化 authority 未定时会被迫写成实现事实，阻断诚实演进。 | `G-CON-007`; `RISK-CON-001~012`; `CON-Q-034~047` |

### 6.3 不可变约束表

| ID | 约束 | 保护边界 / 来源 |
|---|---|---|
| `IC-CON-001` | 不拥有、重定义或裁定 identity/member、project/work/process、governance、artifact/evidence、workspace、method、capability、observability、archive 或 sandbox truth。 | 单一真相与 owner 归属；`NG-CON-001`; `BR-CON-020~027`; `VETO-CON-001/004/005/007`。 |
| `IC-CON-002` | 所有业务读取和受控意图必须经 `L0-sdk` 或正式服务边界；不直连数据库、内部 repository、服务源码、私有 bus 或自建跨域聚合服务。 | 访问与依赖边界；`BR-CON-012`; `NFR-CON-007`; `VETO-CON-001`。 |
| `IC-CON-003` | 不以菜单、route、按钮、feature flag、客户端角色字符串、缓存命中或 UI 状态放宽正式 visibility、资格、Policy 或 Gate 决定。 | 授权与最小披露；`BR-CON-005~008/018`; `NFR-CON-004/009`。 |
| `IC-CON-004` | owner/source、freshness、coverage、availability、consistency 和正式空/缺失/裁剪/未知语义不得被压平、补造或跨 owner 合成为单一 verdict/readiness。 | 查询真相与状态保真；`BR-CON-009~011/020~022`; `NFR-CON-010/013/018`。 |
| `IC-CON-005` | 草稿、提交/受理、处理中、confirmed、rejected 和 unknown 必须可区分；只有 owner 正式结果表示业务完成；unknown 无正式依据不得自动重放。 | 副作用、幂等和结果边界；`BR-CON-013~017`; `NFR-CON-011/014`; `VETO-CON-003`。 |
| `IC-CON-006` | credential、secret、授权/治理证明、raw/hidden payload、外部正文、内部规则、audit/evidence/report/package 等 forbidden body 不得进入 Console 持久、缓存、错误、日志、诊断或导出生命周期。 | 数据最小化；`DR-CON-004/008/012/016/024/030`; `NFR-CON-008`; `VETO-CON-004`。 |
| `IC-CON-007` | actor/scope/visibility/资格无法验证、过期、撤销或冲突时必须保守收紧；单一 owner 的故障、过期和部分结果不得无依据拖垮或被其他成功掩盖。 | fail-closed 与局部隔离；`BR-CON-001/003/007/028~033`; `NFR-CON-004~006`。 |
| `IC-CON-008` | 客户端导航、筛选、布局、草稿、偏好、缓存和诊断只能改变交互呈现，不得改变 owner 数据、资格、治理决定、业务优先级或 readiness。 | 本地交互真相边界；`DR-CON-001/005/009/013/025~027`; `NFR-CON-015~017`。 |
| `IC-CON-009` | 未闭口的 owner exact surface、字段、scope、activation、量化 authority 和外围产品合同不得被架构宣称为 integrated/ready，也不得用 mock 或历史协议补齐。 | 事实诚实与可演进接缝；`RISK-CON-001/007/011/012`; `CON-Q-034~047`。 |

### 6.4 当前阶段可接受取舍表

| 取舍 | 当前口径 | 代价 / 解锁条件 |
|---|---|---|
| owner exact query/command/result/ref 尚未统一 | 仅定义能力级消费接缝和安全上限；各主题按 owner 独立 pending/blocked/read-only。 | 正向页面不能提前承诺；待 `CON-Q-034` 与各 owner activation 闭口。 |
| scope 层级、visibility/资格 reason 和 safe-field 尚未统一 | 只承接外部正式语境、最小披露和客户端收紧原则，不发明共同字段模型。 | 细粒度路由/视图/组件后移；待 `CON-Q-035~037`。 |
| unknown reconciliation/幂等尚未闭口 | 允许保持 unknown、回查或人工重新发起；不把自动重试作为核心能力。 | 用户恢复成本更高；待 `CON-Q-038` 提供正式依据。 |
| 多 owner 状态不作原子联合 | 接受分域、不同步和局部降级，禁止统一健康、合规或 readiness。 | 联合页面需要更强解释；这是保护 truth 的有意识收缩。 |
| SDK 状态通知不是核心前置 | 优先显式 requery/revalidation；只有 SDK 正式封装的提示可作为优化。 | 失效反馈可能较慢；不得因此订阅内部 bus 或维护 cursor/projection。 |
| 本地缓存、草稿、布局和跨会话范围未定 | 只保留有界的客户端交互事实，失效时遮蔽或清理；TTL、跨设备和持久化介质后移。 | 体验连续性暂不承诺；待 `CON-Q-044` 与后续配置设计。 |
| 性能、可用率、浏览器/辅助技术组合和诊断 envelope 无 authority | 先用“有界、可归因、局部隔离、等价可访问”的结构口径，不写数值承诺。 | 数值验收后移；待 `CON-Q-045~046`。 |

### 6.5 架构非目标表

| 非目标 | 不展开原因 |
|---|---|
| 不设计认证、credential、身份签发、scope 建模或本地 RBAC | 属于 identity/安全入口和正式 Policy/资格 owner；Console 只消费安全语境。 |
| 不设计 Policy/Gate/审批、合规、审计 verdict 或 readiness 决策引擎 | 属于 governance、observability、capability、archive、sandbox 等正式 owner；页面不得替代决定。 |
| 不承载成员、项目、过程、Workspace projection、方法、能力注册、观测、归档包或 sandbox 执行的服务端真相 | 这些均有独立 owner；Console 只呈现安全快照/引用和受控入口。 |
| 不设计数据库、内部 repository/bus、服务端聚合、projection/cursor/replay/rebuild 或跨域事务 | 会把客户端产品变成隐性后端真相或绕过正式服务边界。 |
| 不设计 Chat、Runner、Sync、Marketplace、Bridges 等相邻产品的主流程或私有状态 | 其他 L5/L6 项目未停审内容仅作 pending 协作候选。 |
| 不在本架构 Step 固定前端框架、图表库、API path、DTO、源码目录、数据库表或配置参数 | 这些属于后续技术、概要、详细和配置设计；本步只收束结构边界。 |
| 不生成或保存 evidence、audit/report/export/archive/sandbox 正文，也不伪造 baseline、测试、run、artifact、verdict、signoff 或 readiness | 正式结果和验证证据必须由 owner/实施阶段提供；当前仅做架构设计。 |

## 7. 复杂度判断

本步有 7 个架构目标、9 条不可变约束、7 项阶段取舍和 7 项非目标，覆盖 6 个核心能力、8 类管理主题、跨 owner 依赖和 14 条风险，但这些内容均属于仓级结构前提。它们可以在一个 Step 文件中审查，不需要拆附录。后续 Step 3~15 再把这些前提按职责、上下文、依赖、数据、通信、横切和 ADR 逐层展开；不在本步提前创建架构单元。

## 8. 正式文档回填草稿（Step 16 才写入）

### 8.1 正式 §2「业务背景与驱动力」

> 校准来源：
> - `design-calibration/01_arch_step_02_goals_constraints.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“结构化中间产物”“设计取舍”和“待确认事项”小节，了解架构目标如何从 `00` 的核心能力、边界规则和 owner pending 收束而来。

Console 是 L5 产品/分发层的组织治理与管理入口。它的架构价值不在于拥有跨域业务事实，而在于把正式 owner 的管理查询和受控意图安全地转译为可导航、可理解、可恢复且可访问的客户端体验。多 owner 的来源、时效、覆盖、一致性和结果确认语义不同，且权限撤销、部分/过期/冲突/未知需要在跨页面保持一致，因此需要独立的客户端边界、来源保真和恢复结构。

| 架构目标 | 说明 |
|---|---|
| 承载独立的 Console 客户端交互真相边界 | 防止导航、草稿、请求呈现或偏好散落到业务 owner，或被误当成业务真相。 |
| 支撑正式 actor/scope/visibility/资格约束下的管理入口 | 防止失效语境或客户端状态继续放行受保护内容和动作。 |
| 保持 owner-safe 查询的来源、多轴状态和安全回链 | 防止缺失、过期、部分或冲突被误读为完整、当前或一致事实。 |
| 分离客户端意图、请求经历与 owner 正式结果 | 防止 transport/accepted/toast 冒充业务完成并触发重复副作用。 |
| 以 owner 分域方式承载八类管理主题的可裁剪消费面 | 防止管理入口退化为空壳，或生成跨域第二真相。 |
| 支撑局部故障隔离、保守恢复和可访问等价路径 | 防止单一 owner 故障扩散，以及失败/撤销状态下用户无法安全操作。 |
| 允许外部合同逐步闭口时保持可替换、可追溯的架构接缝 | 防止 pending 被伪装为 integrated/ready，保持后续设计诚实演进。 |

### 8.2 正式 §3「约束条件」

> 校准来源：
> - `design-calibration/01_arch_step_01_requirement_baseline.md`
> - `design-calibration/01_arch_step_02_goals_constraints.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“不可变约束表”“当前阶段可接受取舍表”和“架构非目标表”。

正式 §3 应完整承接 §6.3~§6.5 三张表：外部 truth 归 owner、业务访问 SDK-only、客户端只可收紧、来源和多轴状态不被压平、正式结果与 transport 分层、unknown 不重放、forbidden body 零进入、局部故障隔离和 a11y 等价是不可变红线；exact 合同、activation、数值 authority 和未停审产品链接则作为当前阶段有意识的架构收缩；认证、治理裁决、外部正文、执行平台、私有总线和实现细节作为本架构非目标。

## 9. 待确认事项

本步不新增需求层待确认项。以下事项继续从 `00` §15 传递到后续架构 Step；它们不能被本文件或正式 §2/§3 润色成已集成事实。

| 待确认项 | 对本步的影响 | 当前口径 |
|---|---|---|
| `CON-Q-034` owner exact query/command/result/ref 与 activation | 限制正向消费面和后续精确依赖 | 只写能力级接缝，未闭口主题保持 pending/blocked/read-only。 |
| `CON-Q-035~037` scope、visibility/资格、safe-field/redaction 与多轴状态合同 | 限制语境、最小披露和 view 细节 | 外部正式语境引用；不可验证时 fail-closed；不发明共同字段。 |
| `CON-Q-038` unknown reconciliation、幂等和重复风险 | 限制命令恢复方式 | 无正式依据则保持 unknown，不自动重放。 |
| `CON-Q-039~043` Workspace、Method、Capability、Observability、Archive、Sandbox 接缝 | 限制 C5 正向开放范围 | 分 owner 条件化消费；未闭口时只读/partial/blocked。 |
| `CON-Q-044` 草稿、偏好、筛选和请求呈现生命周期 | 限制本地状态持久与跨会话语义 | 只确认其为 Console 交互真相，生命周期后移。 |
| `CON-Q-045~046` 性能、可用率、负载、兼容矩阵和诊断 envelope | 限制量化 NFR 与测试切口 | 本步只保留行为级边界，不写数值或兼容事实。 |
| `CON-Q-047` 未停审 L5/L6 的导航、deep-link、诊断和引用合同 | 限制外围协作 | 仅作为 pending 候选，不进入本仓 truth 或主链。 |

## 10. 自检、三层门禁与进入 Step 3 条件

| 检查项 | 结果 | 说明 |
|---|---|---|
| 目标是否写成结构性结果而非功能/页面 | pass | 使用承载、支撑、保持、分离、允许等结构性动词。 |
| 约束是否为可否决的边界红线 | pass | 明确 truth owner、SDK-only、权限收紧、结果分层、forbidden body 和局部隔离。 |
| 取舍与非目标是否分离 | pass | 未闭口但属于潜在范围的事项进入取舍；边界外能力进入非目标。 |
| 是否继承旧数字、Provider Contract、框架或绿色语义 | pass | 均标为历史污染或后移 pending。 |
| 是否越过架构粒度 | pass | 未写 API path、DTO、数据库、源码目录、函数、测试用例、部署参数或实现状态。 |
| 是否保留全部关键 pending 与风险 | pass | `CON-Q-034~047` 和 `RISK-CON-*` 的影响未被抹平。 |
| 是否伪造集成、测试、artifact、verdict、signoff 或 readiness | pass | 没有任何实现或运行事实声明。 |
| 正式 `01` 是否被提前写入 | pass | 本步只创建 calibration；正式 `01-架构设计.md` 未修改。 |

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step / 模块级 | `pass` | 架构目标、不可变约束、阶段取舍和非目标已分层收稳；没有新增需求或技术选型。 | 更新 flow 与项目台账，激活 Step 3。 |
| 文档级 | `pass_to_step_3` | 正式 §2/§3 的回填草稿可追溯，正式 `01` 仍必须等 Step 16 装配。 | 创建并完成 `01_arch_step_03_responsibility_boundary.md`。 |
| 项目级 | `pass_with_open_contracts` | exact owner surface、scope/visibility、safe-field、reconciliation、activation、量化和兼容 authority 仍 pending，但不阻塞职责边界讨论。 | 进入 Step 3；不修改正式 `01`，不进入 `02`。 |

本步 `pass` 只表示设计静态校准通过，不表示实现、测试、集成、用户 signoff 或 readiness 已发生。
