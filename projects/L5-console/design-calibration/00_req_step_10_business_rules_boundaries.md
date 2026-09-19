# Step 10 · 业务规则与边界约束

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 10 · 业务规则与边界约束 |
| 输出文件 | `design-calibration/00_req_step_10_business_rules_boundaries.md` |
| 当前模式 | `full-restart + single-agent-serial` |
| 已读取规范 | yes，需求 SOP Step 10、书写规范 §4.10 与通用规范 |
| 已读取前序输入 | yes，Step 2 边界、Step 7 闭环、Step 9 功能需求 |
| 模块骨架 | done：逐能力规则 / 四类核心规则 / 治理审计扩展 / 功能映射 / 冲突审计 |
| 进入条件 | `pass`，Step 9 已完成 |

## 2. Step 内计划

| 计划项 | 状态 | 产物 / 门禁 |
|---|---|---|
| 按 C1~C6 识别不变量、禁止行为、显式变化和边界约束 | done | 见 §7.1~§7.6 |
| 按需补充治理和审计约束 | done | C4/C5，见 §7.4~§7.5 |
| 每条规则挂到功能或仓边界 | done | 见各规则表与 §7.7 |
| 排除接口、字段、实现校验和数据表细节 | done | 见 §5、§11 |
| 完成逐能力停审和跨能力冲突审计 | done | 见 §7.7~§7.8 |
| 形成正式回填草稿、自检和三层门禁 | done | 见 §9、§11~§12 |

## 3. 本步输入

| 输入 | 本步使用方式 |
|---|---|
| Step 2 | 将 Console 只拥有客户端体验/受控前端状态、不得拥有 owner truth 的边界转为硬约束。 |
| Step 7 | 规则按六个闭环节点组织，避免成为无挂载的全局口号。 |
| Step 9 | 每条规则必须保护至少一项功能；上游 pending 对应功能保持条件化和 fail-closed。 |
| 正式 owner 边界 | identity/work/process/governance/artifact/workspace/member/method/capability/observability/archive/sandbox 决定各自 truth，SDK/正式服务是访问边界。 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些不变量必须始终成立？ | 所有受保护读取/意图都有可判别正式语境；可见性/资格来自 owner；视图保留来源与状态；草稿/receipt/结果分层；各业务域 truth 不迁入 Console；降级不得夸大确定性。 |
| 哪些行为必须禁止？ | 本地授权、直连数据库、复制服务端规则、query 反写、自动重放未知命令、从 UI/缓存/颜色/阈值推导审批/合规/audit/readiness，以及生成/篡改 owner truth。 |
| 哪些变化必须显式发生？ | scope 转换、资格失效、草稿提交、owner 结果变化、缓存/视图降级和恢复都必须可见；不能由导航、刷新、toast 或客户端缓存隐式宣称。 |
| 哪些边界不能打穿？ | Console/SDK/各正式 owner、治理/证据、Workspace/项目、Observability、Capability、Archive、Sandbox 的真相和执行边界。 |
| 哪些操作需要治理、审计或引用条件？ | owner 定义的高风险管理意图必须满足正式 Policy/Gate/资格；正式要求可追溯的操作需保留 owner receipt/result/evidence/audit refs，但 Console 不产生这些本体。 |
| 是否存在孤儿规则？ | 否；所有规则都回指至少一项 `FR-CON-*` 或明确的仓级边界，外围规则只保护相应外围功能。 |
| 规则是否足以阻止串仓、越界或隐式变化？ | 是；逐节点规则与跨能力优先关系覆盖访问、读取、命令、主题、降级和恢复。 |

## 5. 当前材料与旧文档问题诊断

| 材料 | 问题 | 处理 |
|---|---|---|
| 旧本地 RBAC/按钮权限 | 把 UI 配置当授权规则 | 明确客户端只可收紧，正式 owner 决定访问与动作资格 |
| 旧固定控制项、指标和阈值 | 无 authority，可能形成客户端裁决 | 禁止硬编码数量/阈值来推导治理、合规、健康或 readiness |
| 旧 Provider Contract / ConsoleWorkspace | 把 capability/workspace 聚合升级为 Console truth | 作为历史污染排除，状态与引用继续归 owner |
| 旧请求成功反馈 | HTTP/toast/cache 刷新可冒充业务成功 | 强制草稿、submitted/accepted、pending、confirmed/rejected/unknown 分层 |
| 旧统一失败策略 | 局部上游故障可能污染全页面或显示空 | 规则要求分 owner 降级、空与缺失分离、未知保守处理 |

## 6. 改动前后对比与设计取舍

| 主题 | 旧口径 | 当前规则取舍 |
|---|---|---|
| 授权 | 前端角色/路由/按钮 | 正式 visibility/Policy/Gate 为上限；客户端只能更保守 |
| 读取 | 聚合结果即页面 truth | 来源与多轴状态不可丢；query 不产生业务写入 |
| 命令 | 请求成功即完成 | 只有 owner 正式结果可声明业务完成；unknown 不重放 |
| 跨域 | 页面统一绿色/健康 | 分 owner 解释，不合成无 authority 的单一结论 |
| 高风险动作 | 通用确认即可 | 正式资格/治理前置不可被确认框替代；确认框仅防误操作 |
| 规则粒度 | 技术校验和实现建议 | 只写外部可验证的不变量、禁止、显式变化和边界 |

## 7. 结构化中间产物

### 7.1 `C-CON-1` 规则

| 规则编号 | 规则类型 | 规则内容 | 约束对象 | 保护功能 |
|---|---|---|---|---|
| `BR-CON-001` | 不变量 | 每个受保护视图与提交意图都必须绑定当前可判别的正式 actor/scope 语境；无法判别时不得继续暴露或提交。 | 访问语境 | `FR-CON-001~002` |
| `BR-CON-002` | 禁止行为 | Console 不得签发 credential、定义正式身份/角色/scope，或从本地会话和偏好推导持续授权。 | Console / identity 边界 | `FR-CON-001~002` |
| `BR-CON-003` | 显式变化 | 正式范围转换、会话到期、撤销或语境冲突必须在后续读取/动作前显式生效并可被用户感知。 | 语境变化 | `FR-CON-001~002` |
| `BR-CON-004` | 边界约束 | 客户端 session 壳只承载交互连续性；身份、认证与正式 scope truth 始终归相应 owner。 | 会话壳 / identity | `FR-CON-001~002` |

能力级规则停审：四类核心规则均覆盖；无身份字段、token 机制或实现校验；可阻止无语境访问和隐式 scope 漂移，`pass_to_data`。

### 7.2 `C-CON-2` 规则

| 规则编号 | 规则类型 | 规则内容 | 约束对象 | 保护功能 |
|---|---|---|---|---|
| `BR-CON-005` | 不变量 | 入口可发现性和动作姿态不得比正式 visibility/资格结果更宽；客户端安全条件可以进一步收紧。 | 导航与动作资格 | `FR-CON-003~004` |
| `BR-CON-006` | 禁止行为 | 菜单、route、按钮可见性、feature flag、客户端角色字符串或缓存命中不得充当授权证明。 | 客户端 UI 状态 | `FR-CON-003~004` |
| `BR-CON-007` | 显式变化 | 可见性或动作资格的撤销、过期、冲突和 unknown 必须重新呈现，不得沿用先前允许姿态。 | 资格状态变化 | `FR-CON-003~004` |
| `BR-CON-008` | 边界约束 | restricted/unknown 的解释不得超出 owner 允许的披露粒度，也不得泄露受限对象是否存在。 | 权限原因呈现 | `FR-CON-003~004` |

能力级规则停审：入口与动作资格均受正式决定限制，最小披露与撤销生效清楚；没有复制 RBAC 或策略表达，`pass_to_data`。

### 7.3 `C-CON-3` 规则

| 规则编号 | 规则类型 | 规则内容 | 约束对象 | 保护功能 |
|---|---|---|---|---|
| `BR-CON-009` | 不变量 | owner-safe 结果必须保留足以解释的 source、freshness、coverage、availability、consistency 语境；缺失语境不得默认完整、当前或一致。 | 查询视图 | `FR-CON-005~006` |
| `BR-CON-010` | 禁止行为 | 查询、筛选、排序、分页、下钻和客户端聚合不得隐式创建、改变或补造任何业务、治理、审计、能力或运行 truth。 | 只读交互 | `FR-CON-005~006` |
| `BR-CON-011` | 显式变化 | 正式为空、未覆盖、被裁剪、过期、不可用、冲突与未知必须以不同语义显式呈现；任一变化不得通过显示旧值而被隐去。 | 视图状态变化 | `FR-CON-005~006` |
| `BR-CON-012` | 边界约束 | 所有业务读取必须经 SDK 或正式服务边界；不得直连数据库、读取服务内部存储或以 Console 自建聚合服务替代 owner。 | Console / SDK / owner 边界 | `FR-CON-005~006`, `FR-CON-010~015` |

能力级规则停审：来源保真、query no-write、状态区分和访问边界闭合；没有接口 path、DTO、缓存实现或数据库设计，`pass_to_data`。

### 7.4 `C-CON-4` 规则

| 规则编号 | 规则类型 | 规则内容 | 约束对象 | 保护功能 |
|---|---|---|---|---|
| `BR-CON-013` | 不变量 | 本地草稿、客户端校验、提交/受理 receipt、处理中和 owner 正式结果必须保持可区分；只有 owner 正式确认可表示业务完成。 | 意图与结果语义 | `FR-CON-007~009` |
| `BR-CON-014` | 禁止行为 | HTTP/SDK 返回成功、toast、乐观更新、缓存失效或页面刷新不得被表述为 owner 已完成业务变化。 | 客户端反馈 | `FR-CON-008~009` |
| `BR-CON-015` | 禁止行为 | 对响应中断或结果 unknown 的潜在副作用请求不得无正式幂等或 reconciliation 依据自动重放。 | 未知结果请求 | `FR-CON-009` |
| `BR-CON-016` | 显式变化 | 草稿变为已提交、请求变为正式确认/拒绝，或语境/资格在提交前发生变化，都必须显式发生并重新呈现。 | 草稿与请求状态 | `FR-CON-007~009` |
| `BR-CON-017` | 边界约束 | Console 只拥有意图草稿和请求交互状态；业务副作用、领域校验、幂等决定与最终结果归正式 owner。 | Console / command owner 边界 | `FR-CON-007~009`, `FR-CON-010~015` |
| `BR-CON-018` | 治理约束 | owner 认定需要 Policy/Gate/审批或其他治理前置的动作，Console 只能在正式前置结果允许时提交；客户端确认不得绕过或替代该决定。 | 受治理动作 | `FR-CON-004`, `FR-CON-008` |
| `BR-CON-019` | 审计约束 | 对 owner 正式要求可追溯的管理请求，Console 必须保留并展示正式提供的 receipt/result/audit/evidence 引用，不得自制引用或把客户端诊断冒充审计记录。 | 可追溯管理请求 | `FR-CON-008~009` |

能力级规则停审：草稿、传输、受理与正式结果严格分层，高风险治理/审计引用不由客户端伪造，unknown 重放被禁止；无状态机实现、接口协议或异常码，`pass_to_data`。

### 7.5 `C-CON-5` 规则

| 规则编号 | 规则类型 | 规则内容 | 约束对象 | 保护功能 |
|---|---|---|---|---|
| `BR-CON-020` | 不变量 | C5 每个管理区域必须保留其正式 owner、来源引用和当前能力上限；联合视图不产生新的跨域 truth。 | 管理主题视图 | `FR-CON-010~015` |
| `BR-CON-021` | 禁止行为 | Console 不得拥有、重定义或裁定 identity/member、project/work/process、governance、artifact、workspace、method、capability、observability、archive 或 sandbox truth。 | 全部业务 owner 边界 | `FR-CON-010~015` |
| `BR-CON-022` | 禁止行为 | Console 不得以 UI 状态、固定控制项/指标数量、客户端阈值、颜色、缓存或局部来源结果推导审批、合规、审计、能力、归档、运行或 readiness 结论。 | 管理结论呈现 | `FR-CON-011`, `FR-CON-013~015` |
| `BR-CON-023` | 显式变化 | 每个 owner 区域从 blocked/read-only/partial 变为正向可用，必须以该 owner 当前正式合同和资格为依据；不得由文档计划或前端开关隐式启用。 | 管理能力开放状态 | `FR-CON-010~015` |
| `BR-CON-024` | 边界约束 | Governance/SoA/AIIA/Control/Gate 决定归 governance，evidence/artifact 正文归 artifact；Console 只呈现正式状态和安全引用。 | governance / artifact 边界 | `FR-CON-013` |
| `BR-CON-025` | 边界约束 | Workspace projection/cursor/rebuild、审计与指标生成、能力注册/暴露、Archive 生命周期执行和 Sandbox 隔离执行不得迁入 Console。 | workspace/observability/capability/archive/sandbox 边界 | `FR-CON-011`, `FR-CON-014~015` |
| `BR-CON-026` | 治理约束 | 管理页面不得绕过任何 owner 的 Policy/Gate/visibility；当正式决定未知、冲突、撤销或过期时，对敏感内容和动作采用保守上限。 | C5 全部受保护能力 | `FR-CON-010~015` |
| `BR-CON-027` | 审计约束 | Console 的客户端诊断仅能说明交互/请求经历，不能替代 Observability 审计、Artifact evidence 或 owner 的正式业务历史。 | 诊断与正式证据边界 | `FR-CON-013~015`, `FR-CON-017` |

能力级规则停审：八类主题的 truth、执行、治理与证据边界已钉住；Provider Contract、固定 38 控制项、8 指标和阈值均无继承路径，`pass_to_data`。

### 7.6 `C-CON-6` 规则

| 规则编号 | 规则类型 | 规则内容 | 约束对象 | 保护功能 |
|---|---|---|---|---|
| `BR-CON-028` | 不变量 | 非理想状态必须以文本/语义可判别且不只依赖颜色；无法安全分类时必须标为 unknown 并收紧内容或动作。 | 降级呈现 | `FR-CON-016`, `FR-CON-018` |
| `BR-CON-029` | 禁止行为 | partial、stale、missing、restricted、unavailable、conflict 或 unknown 不得被归一为空、成功、绿色、合规或 ready。 | 状态解释 | `FR-CON-016` |
| `BR-CON-030` | 显式变化 | 重试、重验、回查或来源恢复后的状态必须显式更新；旧状态不能因页面仍可见而继续被当作当前事实。 | 恢复状态变化 | `FR-CON-016~017` |
| `BR-CON-031` | 边界约束 | 一个 owner 的故障或过期只能影响可证明依赖它的区域；不得无依据覆盖其他 owner 状态，也不得用其他 owner 成功掩盖该失败。 | 部分数据与故障隔离 | `FR-CON-010~017` |
| `BR-CON-032` | 不变量 | 可访问交互必须覆盖与视觉路径等价的语境、资格、读取、确认、结果、错误和恢复目标。 | 辅助技术路径 | `FR-CON-018` |
| `BR-CON-033` | 禁止行为 | 不得因视觉路径可用而接受键盘、焦点、读屏播报或非颜色语义路径无法完成同一管理目标。 | 可访问性 | `FR-CON-018` |

能力级规则停审：降级、恢复、故障隔离和 a11y 等价路径均有硬约束；未引入具体组件、ARIA 实现或性能阈值，`pass_to_data`。

### 7.7 外围增强规则

| 规则编号 | 规则类型 | 规则内容 | 约束对象 | 保护功能 |
|---|---|---|---|---|
| `BR-CON-E01` | 边界约束 | 个性化布局和快捷入口只可改变客户端呈现偏好，不得改变 visibility、资格、数据优先级或 owner truth。 | 个性化工作区 | `FR-CON-E01` |
| `BR-CON-E02` | 不变量 | 趋势/比较只在来源正式声明可比较语义和 coverage 时成立；否则必须保持不可比较。 | 趋势与评审 | `FR-CON-E02` |
| `BR-CON-E03` | 禁止行为 | 批量受理或批次摘要不得被解释为每一项正式成功；部分失败必须逐项可判别。 | 批量意图/导出 | `FR-CON-E03` |

外围规则只在对应增强能力未来启用时生效；当前不表示能力 ready。

### 7.8 规则挂载与跨能力审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 功能是否均受至少一条规则保护 | pass | 核心 `FR-CON-001~018` 与外围 `FR-CON-E01~E03` 均有挂载。 |
| 是否存在无法回指功能/边界的孤儿规则 | pass | none。仓级边界规则同时挂到受影响功能。 |
| 四类核心规则是否齐备 | pass | 六节点整体均覆盖；C1~C5 各自齐备，C6 用不变量/禁止/显式变化/边界约束完整覆盖。 |
| 治理/审计约束是否越权 | pass | 只要求尊重/呈现 owner 正式前置与引用，不由 Console 生成决定或记录。 |
| 规则是否重复或冲突 | pass | 相似规则按语境、资格、读取、命令、主题、降级分别约束；无相反许可。 |
| 冲突时优先关系是否清楚 | pass | 正式 owner 决定与最小披露优先；客户端只可进一步收紧；unknown 采用保守上限。 |
| 是否覆盖 historical 污染 | pass | 本地 RBAC、Provider Contract、固定控制/指标/阈值、UI readiness 均被明确禁止。 |

## 8. 复杂度判断

33 条核心规则覆盖六节点，3 条外围规则保护条件化增强。数量来自功能安全边界而非对象字段或接口动作；规则表仍可在单文件审查。后续 Step 11 应将规则所涉及的信息分为 Console truth、客户端 snapshot、external ref 和 forbidden body，不能把本规则表改写成数据字段清单。

## 9. 回填草稿

正式 §10 回填 §7.1~§7.7 的规则表，但可将六个能力小节保持原分组以维持映射。保留“保护功能”列作为规范固定四列之外的追溯增强；正式章前说明规则优先关系，章末保留 §7.8 的精简审计结论。

## 10. 待确认事项

| ID | 待确认事项 | 当前处理口径 | 当前状态 |
|---|---|---|---|
| `CON-Q-019` | 正式 visibility/资格结果可披露哪些 reason 与恢复动作 | 未闭口时采用最小披露、unknown、禁止提交 | `open / blocks_exact_reason_presentation` |
| `CON-Q-020` | 哪些管理动作被 owner 定义为高风险且需要何种 Policy/Gate/审计引用 | Console 不自建动作分类；所有待定动作按正式结果和保守上限处理 | `open / blocks_exact_governed_action_design` |
| `CON-Q-021` | owner 是否提供足以安全回查 unknown 请求的 reconciliation 语义 | 无正式能力时保持 unknown 且禁止自动重放 | `open / blocks_positive_recovery_scope` |

## 11. 自检

| 检查项 | 结果 |
|---|---|
| 是否按六节点逐项形成规则并停审 | pass |
| 每条规则是否有编号、类型、内容、约束对象和功能挂载 | pass |
| 是否覆盖不变量、禁止行为、显式变化、边界约束 | pass |
| 治理与审计约束是否只承接正式决定/引用 | pass |
| 是否足以禁止本地授权、直连 DB、规则复制、query 反写、绕过 Policy/Gate 和 UI 推导 readiness | pass |
| 是否未写状态机、字段校验、接口签名、事件 schema、异常码或实现类 | pass |
| 是否无孤儿、重复、冲突或错误挂载规则 | pass |
| 是否发现阻塞 Step 11 的 blocker | no；未闭口合同可通过数据类型与生命周期的保守口径继续传递 |

## 12. 三层门禁

| 层级 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| Step / 模块级 | `pass` | 六节点规则、四类核心约束、治理/审计扩展与跨能力审计全部通过 | 更新 flow，激活 Step 11 | 本文件；Step 2/7/9；书写规范 §4.10 |
| 文档级 | `pass_to_step_11` | 规则已保护所有功能并钉住 truth、访问、授权、结果与降级边界 | 创建并完成 `00_req_step_11_data_ownership.md` | 本文件；Step 9 |
| 项目级 | `pass_with_open_upstream_pending` | reason、governed action、reconciliation exact 合同 pending，不阻塞需求级数据归属 | 进入 Step 11；正式 00 仍不可写 | 项目台账；需求 flow |
