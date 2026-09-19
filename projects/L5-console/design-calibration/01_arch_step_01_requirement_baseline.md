# Step 1 · 确认需求基线

> 对应正式文档章节：`01-架构设计.md` §1、§3、§16  
> 当前状态：`done`  
> 当前模式：`full-restart + single-agent-serial`  
> 本步结论：已停审的 `00-需求文档.md` 是 `01` 的唯一需求基线；旧 `01` 只作历史污染诊断。

## 1. Step 开工确认与 Step 内计划

| 项目 | 记录 |
|---|---|
| 前序门禁 | 正式 `00-需求文档.md` 已完成 Step 17，状态 `formal_stop_review`。 |
| 架构规范 | `架构设计讨论流程_SOP.md` 与 `架构设计书写规范.md` 已完整读取。 |
| 本步允许写入 | 仅本文件与 `01_architecture_calibration_flow.md`、项目台账；不写正式 `01`。 |
| 历史材料 | 旧 `01-架构设计.md`、旧 README、旧 `02/03/05/06` 仅作 `historical_material`。 |

| 计划项 | 状态 | 产物 |
|---|---|---|
| 读取正式 `00`、需求 calibration、全局依赖和架构规范 | done | §2 |
| 回答架构基线问题 | done | §3 |
| 诊断旧 `01` 的反向约束和污染 | done | §4 |
| 形成改动前后对比与设计取舍 | done | §5~§6 |
| 输出架构需求基线、硬约束、风险和回指入口 | done | §7 |
| 判断复杂度与是否拆分 | done | §8 |
| 形成正式 `01` §1/§3/§16 回填草稿 | done | §9 |
| 自检、三层门禁和停审 | done | §10~§11 |

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `projects/L5-console/00-需求文档.md` | `formal / stop_review` | 唯一需求基线；只提炼架构约束，不重写需求正文。 |
| `design-calibration/00_req_step_07_core_capability_loop.md` | done | 确认六个能力节点及成立依赖。 |
| `design-calibration/00_req_step_09_functional_requirements.md` | done | 确认功能能力如何转译为架构承接面。 |
| `design-calibration/00_req_step_10_business_rules_boundaries.md` | done | 提炼 truth、访问、结果、降级和 a11y 红线。 |
| `design-calibration/00_req_step_11_data_ownership.md` | done | 提炼 Console truth、owner-safe snapshot/ref、forbidden body。 |
| `design-calibration/00_req_step_12_interfaces_dependencies.md` | done | 提炼 SDK/正式服务边界和依赖类型候选。 |
| `design-calibration/00_req_step_13_non_functional_requirements.md` | done | 提炼架构层安全、局部隔离、可追溯、幂等、可访问约束。 |
| `design-calibration/00_req_step_14_acceptance_criteria.md` | done | 提炼能力级验收与 `VETO-CON-*` 一票否决边界。 |
| `design-calibration/00_req_step_15_risks_open_questions.md` | done | 携带 `RISK-CON-*` 与 `CON-Q-*`，不把 pending 写成架构事实。 |
| `design-calibration/00_req_step_16_traceability_matrix.md` | done | 提供需求 ID 到功能、规则、数据、接口、NFR、验收的回指。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | read | 为后续 Step 7 区分 compile/runtime/event 依赖。 |
| 旧 `01-架构设计.md` | historical | 仅审计固定数字、技术栈、服务端聚合和越界真相。 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 当前架构设计依赖哪些需求结论？ | 依赖 Console 的仓定位与边界、`C-CON-1~6` 核心能力闭环、`FR-CON-001~018` 核心功能、`BR-CON-001~033` 边界规则、`DR-CON-001~030` 数据归属、`IF/DEP-CON-*` 能力/依赖边界、`NFR-CON-001~021` 质量约束、`AC-*` 与 `VETO-CON-*` 验收红线。 |
| 哪些需求结论已稳定？ | Console 只拥有客户端交互事实；所有业务 truth 归正式 owner；SDK/正式服务是唯一业务访问边界；未知、撤销、冲突和部分结果采用保守姿态；正式结果与 transport 状态分层；核心能力与追溯编号已冻结。 |
| 哪些结论仍待确认？ | owner exact query/command/result/ref 与 activation、scope 层级/切换、visibility/资格披露、safe-field 与 freshness/coverage 合同、unknown reconciliation/幂等、Workspace/Method/Capability/Observability/Archive/Sandbox 正向接缝、客户端生命周期、性能/兼容/诊断 authority 仍是 pending。 |
| 哪些需求直接影响系统边界？ | `NG-CON-*`、`BR-CON-020~027`、`VETO-CON-001/002/004/005/007` 直接阻止 Console 变成业务 truth、治理裁决、证据仓或执行平台。 |
| 哪些需求直接影响数据所有权？ | `DR-CON-001~030` 将本地交互 truth、owner-safe snapshot、外部 ref、forbidden body 分开；`BR-CON-009~012` 与 `BR-CON-020~027` 禁止第二 truth。 |
| 哪些需求直接影响依赖方向？ | `DEP-CON-001~014` 和 `NFR-CON-007` 要求 `L0-core/L0-sdk` 作为正式访问边界，owner 以运行期能力消费；可选状态通知不能变成内部 bus 私有依赖。 |
| 哪些需求直接影响一致性和交互？ | `BR-CON-013~019`、`NFR-CON-013~018` 和 `FR-CON-008~009` 要求草稿/receipt/pending/confirmed/rejected/unknown 分层，未知结果先回查且不无依据重放。 |
| `01` 能否修改 `00` 需求结论？ | 不能。架构只把已停审需求转译成结构约束；发现需求缺口时必须在风险/待确认中挂起，不在架构层补造新需求。 |

## 4. 当前材料与旧文档问题诊断

| 诊断项 | 旧材料表现 | 当前处理 |
|---|---|---|
| Console 定位 | 旧文档把 Console 写成组织治理“中心”并暗示跨域聚合真相。 | 采用 `00` 的产品边界：Console 是客户端管理入口和安全呈现层，不是治理、观测或业务真相中心。 |
| 固定控制/指标 | 旧文档写死 `38` 个控制项、`8` 个指标和首屏/P95/SLA 数字。 | 全部降级为历史污染；架构只承接无 authority 的行为边界，量化项留待正式 authority。 |
| 权限语义 | 旧文档以按钮消失、前端角色和 policy-aware guard 暗示本地授权。 | 架构前提改为正式 visibility/资格/Policy/Gate 输入，客户端只能收紧。 |
| 数据聚合 | 旧文档把多域卡片、审计、evidence、readiness 组合为 Console 自有结论。 | 仅保留 owner-safe snapshot/ref 和分域状态；不形成跨域 truth、verdict 或 readiness。 |
| 技术方案 | 旧文档预设 SPA、React/Svelte、图表库、adapter、widget registry 等实现选择。 | 不作为需求或本步架构前提；待后续架构机制讨论，若未达到架构层影响则后移。 |
| 结果语义 | 旧文档允许页面刷新、toast 或 transport 成功看似完成。 | 固定采用 owner 正式结果才表示业务完成；unknown 不自动重放。 |
| 正式文档关系 | 旧文档直接从历史正文推导后续设计。 | 以新版 `00` 和本轮 `01_arch_step_*` 为唯一新真相；旧文档只做污染审计。 |

## 5. 改动前后对比

| 维度 | 历史处理 | 本轮架构基线处理 | 变化理由 |
|---|---|---|---|
| 基线来源 | 旧 `01`、README、页面清单混合使用。 | 只承接已停审 `00` 与需求校准文件。 | 防止历史结论反向约束架构。 |
| 架构主语 | 页面、面板、Provider Contract、技术栈。 | 边界、架构责任、上下文、运行承载、依赖角色和数据关系。 | 对齐架构规范，避免滑入概要/详细设计。 |
| 真相边界 | Console 被写成跨域聚合与治理中心。 | Console 只拥有交互 truth，owner 保有业务/治理/证据 truth。 | 保持单一真相和正式 owner。 |
| 依赖表达 | 运行期能力、事件协作和实现库容易混写。 | 后续按 compile/runtime/event 分类裁剪；SDK 是正式访问边界。 | 防止反向依赖和私有总线穿透。 |
| 未决事项 | 可能被正文润色成“已支持”。 | 统一携带到架构风险/待确认，未闭口面维持 blocked/read-only/partial。 | 保持事实诚实和可继续设计。 |

## 6. 设计取舍

| 方案 | 优点 | 代价 | 结论 |
|---|---|---|---|
| A. 在旧 `01` 上增量修补 | 表面改动少。 | 历史真相、固定数字和实现化结构会继续渗入，无法证明新架构来源。 | 不采用。 |
| B. 以新版 `00` 为唯一基线，从 Step 1 逐步重建 `01` | 需求到架构链条可追溯，能在每步保留 pending 和门禁。 | 需要重新收敛全部架构章节。 | 采用。 |
| C. 在 Step 1 直接闭口 owner 合同和技术机制 | 正文看似完整。 | 越过需求 pending 和后续架构 Step，容易伪造集成或选型事实。 | 不采用。 |
| D. 只承接六个核心能力，不逐项回指规则/数据/验收 | 文字更短。 | 后续依赖方向、数据所有权和 ADR 无法审计。 | 不采用；采用能力 + 规则/数据/依赖/验收双层回指。 |

## 7. 结构化中间产物

### 7.1 架构需求基线清单

| 基线项 | 需求来源 | 对架构的直接影响 |
|---|---|---|
| 可信会话与访问语境（`C-CON-1`） | `G-CON-001`; `FR-CON-001~002`; `BR-CON-001~004` | 必须把正式 actor/scope 作为外部语境输入；客户端 session 壳不能成为身份或授权 truth。 |
| 导航、可见性与动作资格（`C-CON-2`） | `G-CON-002`; `FR-CON-003~004`; `BR-CON-005~008` | 架构需隔离入口呈现与正式资格决定，不能由 UI 或缓存承担授权。 |
| owner-safe 查询与视图解释（`C-CON-3`） | `G-CON-003`; `FR-CON-005~006`; `BR-CON-009~012` | 需要正式 owner 访问接缝、来源状态保留和分域局部降级，不得建立聚合 truth。 |
| 受控意图与正式结果（`C-CON-4`） | `G-CON-004`; `FR-CON-007~009`; `BR-CON-013~019` | 需要把本地草稿/交互呈现与正式 command/result/reconciliation 边界分开，unknown 必须可挂起。 |
| 八类管理主题消费面（`C-CON-5`） | `G-CON-005`; `FR-CON-010~015`; `BR-CON-020~027` | 主题必须按 owner 分域接入；员工、项目/Workspace、方法、治理/evidence、审计/指标、Capability、Archive、Sandbox 不得合成单一真相。 |
| 保守降级、恢复与可访问交互（`C-CON-6`） | `G-CON-006`; `FR-CON-016~018`; `BR-CON-028~033` | 运行承载、交互和横切架构必须允许局部失败隔离、重验/回查/退出和等价辅助技术路径。 |
| Console 自有数据边界 | `DR-CON-001~030`; `AC-DR-001~005` | 只拥有交互 truth；owner-safe snapshot/ref 有生命周期上限；forbidden body 禁止进入任何本地或诊断旁路。 |
| 访问与依赖边界 | `IF/DEP-CON-*`; `NFR-CON-007`; `VETO-CON-001` | 业务能力只能经 `L0-sdk`/正式服务边界消费；跨仓依赖类型必须在 Step 7 裁剪。 |
| 质量与事实边界 | `NFR-CON-001~021`; `AC-NFR-001~007`; `VETO-CON-002~007` | 架构需显式保护 fail-closed、结果分层、局部隔离、审计可追溯、幂等和 a11y；无 authority 数字不得被架构发明。 |

### 7.2 架构硬约束清单

| 硬约束 | 来源 | 对后续架构 Step 的约束 |
|---|---|---|
| Console 不拥有任何列明业务/治理/证据/Workspace/能力/观测/归档/Sandbox truth。 | `00` §2、`BR-CON-020~027`、`VETO-CON-001/004/005/007` | Step 3/5/8 必须把外部 owner 与本地交互结构分开；不得把跨域聚合当核心子域。 |
| 业务读取和受控意图只能经 SDK 或正式服务边界。 | `00` §1/§6/§12、`BR-CON-012`、`NFR-CON-007` | Step 4/7/9 必须将 owner 作为运行期边界，不得画数据库、私有 bus 或源码依赖。 |
| 正式 visibility/资格/Policy/Gate 决定优先于客户端状态，客户端只能收紧。 | `BR-CON-005~008/018/026` | Step 3/4/7/12 必须保护最小披露和撤销生效。 |
| owner-safe 结果需保留来源与多轴状态；联合视图不生成单一 verdict/readiness。 | `BR-CON-009~012/020~022`; `NFR-CON-010/013/018` | Step 5/8/9/12 必须按 owner 分域和状态边界设计。 |
| 草稿、receipt、pending、confirmed、rejected、unknown 必须分层；unknown 不无依据重放。 | `BR-CON-013~019`; `NFR-CON-011/014` | Step 8/9/12 必须把回查和挂起作为架构语义，不伪装同步完成。 |
| forbidden body 不进入 Console 持久、诊断、错误、导出或快照旁路。 | `DR-CON-004/008/012/016/024/030`; `NFR-CON-008`; `VETO-CON-004` | Step 5/7/8/12 必须明确外部正文与本地影子边界。 |
| 局部 owner 故障必须隔离；语境不可验证时 fail-closed；a11y 路径与视觉目标等价。 | `FR-CON-016~018`; `BR-CON-028~033`; `NFR-CON-004~006/019~021` | Step 6/9/12 必须保留局部降级和恢复结构，不以全局“绿色”掩盖。 |
| 架构文档不得提前决定 DTO/API path/数据库/源码目录/测试用例/部署参数。 | 架构 SOP、架构书写规范、`00` 技术问题边界 | 后续各 Step 只写架构层主语，细节后移到 02/03/04/05/06/07。 |

### 7.3 架构风险与后移事项

| 类别 | 事项 | 影响的架构判断 | 当前处理 |
|---|---|---|---|
| 风险 | owner exact query/command/result/ref 和 activation 未闭口（`RISK-CON-001`）。 | Step 4/7/8/9 的外部接缝、依赖和通信主线。 | 只定义能力级边界；未闭口主题保持 read-only/partial/blocked。 |
| 风险 | scope、visibility、资格、safe-field、freshness/coverage/consistency 合同不一致（`RISK-CON-002~004/014`）。 | Step 3/4/8/12 的边界和状态语义。 | 采用最小披露、fail-closed 和分域状态，不发明共同字段模型。 |
| 风险 | unknown reconciliation/幂等语义未定（`RISK-CON-005`）。 | Step 8/9/12 的数据一致性、交互方式和恢复主线。 | unknown 只可回查或挂起，不自动重放、不声称完成。 |
| 风险 | 多 owner 时效/覆盖/一致性不同，联合视图可能被误读（`RISK-CON-006`）。 | Step 5/8/9/12 的分域结构。 | 保留 owner/source/freshness/coverage/availability/consistency，禁止合成统一健康结论。 |
| 风险 | Workspace、Method、Capability、Observability、Archive、Sandbox 接缝成熟度不同（`RISK-CON-007`）。 | Step 4/7/9/13 的正向范围和演进路线。 | 条件化纳入；合同未闭口只读或 blocked。 |
| 风险 | 客户端草稿/偏好/筛选/请求呈现生命周期未定（`RISK-CON-008`）。 | Step 5/8/12 的本地交互上下文与状态承载。 | 只确认其为 Console truth，不让生命周期细节变成 owner truth。 |
| 后移确认 | SDK 状态通知、诊断 envelope、性能/兼容 authority、其他 L5/L6 deep-link（`CON-Q-044~047` 等）。 | Step 9/12/13/15。 | 作为待确认项保留，不作为当前架构前提。 |

### 7.4 架构回指入口

| 后续架构章节 | 本步必须回指的基线 |
|---|---|
| §1 与上游关系 | 本文件 §2、正式 `00` §1，以及历史材料降级声明。 |
| §3 约束条件 | 本文件 §7.1~§7.3；正式 `00` §2、§10、§11、§14、§15。 |
| §4 职责边界 | `C-CON-1~6`、`BR-CON-020~027`、`DR-CON-*`。 |
| §5 系统上下文 | `IF/DEP-CON-*`、`NFR-CON-007` 和正式 owner 关系。 |
| §6 限界上下文 | 六节点与八类 C5 消费面；本地交互 truth 不得升格为 owner 子域。 |
| §7 容器/部署 | `C-CON-6` 局部降级、SDK/正式服务运行边界和客户端承载事实。 |
| §8 依赖方向 | `DEP-CON-001~014`、全局依赖类型和禁止依赖规则。 |
| §9 数据/一致性 | `DR-CON-001~030`、`BR-CON-009~019`、`NFR-CON-013~015`。 |
| §10 交互/通信 | `FR-CON-008~009/016~017`、`IF-CON-004~005`、`CON-Q-038`。 |
| §11~§13 | `NFR-CON-*`、`AC-NFR-*`、量化 authority pending 和核心演进边界。 |
| §14~§17 | `RISK-CON-*`、`CON-Q-*`、`VETO-CON-*`、架构取舍和长期决策。 |

## 8. 复杂度判断

本步需要同时覆盖 6 个能力节点、8 类管理主题、30 个数据归属项、17 条依赖、21 项 NFR 和 14 条风险，但输出仍是架构前提而非内部对象或实现清单。基线可以在单文件中审查，不需要拆分附录；Step 5、7、8、9、12、15 再按架构单元拆分并逐项停审。

## 9. 回填草稿

### 9.1 正式 §1 回填草稿

新版 `01-架构设计.md` 只承接已停审的 `00-需求文档.md`、本仓需求 calibration、产品/全局架构定位和适用的正式 owner 边界。旧 `01`、README 与旧下游文档只作为 historical material 和污染审计输入，不提供新的架构真相。本文将在架构层把 Console 的客户端交互边界、owner-safe 消费边界和保守恢复语义转译为职责、上下文、运行承载、依赖、数据、一致性、通信和长期决策；不重新定义需求、owner truth 或具体协议。

### 9.2 正式 §3 回填草稿

正式 §3 应承接本文件 §7.2 的不可变红线，并将 §7.3 的未闭口事项区分为当前阶段可接受收缩与架构非目标：exact owner surface、量化 authority 和外围 activation 可暂不闭口，但不得以此放宽 SDK-only、truth owner、forbidden body、fail-closed、unknown 不重放或可访问等价边界。架构不设计认证、治理裁决、业务 truth、外部正文存储或相邻产品主流程。

### 9.3 正式 §16 回填草稿

正式 §16 应以需求 ID/能力节点为最小可审查粒度，说明 `C-CON-1~6`、关键 `FR/BR/DR/IF/DEP/NFR/AC/VETO` 如何落到后续架构章节；未闭口的 `CON-Q-*` 只进入追溯缺口或风险，不伪造架构承接完成。Step 15 再根据最终架构决定补充 ADR 索引，不能在本步预支 ADR 编号或技术决定。

## 10. 待确认事项

本步不新增需求层待确认项。正式 `00` §15 的 `CON-Q-034~047` 继续有效；其中 exact surface、scope/visibility、safe-field、reconciliation 和专项 owner activation 会在后续架构 Step 中按影响范围重复核对，但不能被本步改写为已确认架构事实。

## 11. 自检与三层门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否只承接已停审 `00` | `pass` | 未从旧 `01` 或下游文档吸收新结论。 |
| 是否明确稳定结论与 pending | `pass` | 稳定边界进入 §7.1~§7.2，未决事项进入 §7.3/§10。 |
| 是否完成旧材料污染诊断 | `pass` | 固定数字、Provider Contract、技术栈、聚合 truth、UI 权限和 toast 成功均被降级。 |
| 是否新增需求或技术选型 | `pass` | 本步只提炼架构前提，没有新增 FR/BR/DR/接口或产品选型。 |
| 是否越过架构粒度 | `pass` | 没有 API path、DTO、数据库表、源码目录、函数、测试用例或部署参数。 |
| 是否覆盖追溯入口 | `pass` | §7.4 给出后续章节回指，Step 15 再完成正式矩阵。 |
| 是否需要回退 `00` | `no` | 现有需求基线足以支撑 Step 2；pending 以保守架构上限传递。 |

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step / 模块级 | `pass` | 需求基线、硬约束、风险与后续回指已收稳；未新增需求。 | 关闭 Step 1，激活 Step 2。 |
| 文档级 | `pass_to_step_2` | 架构目标与约束尚未展开，但 Step 1 输出足以支撑下一步。 | 创建并完成 `01_arch_step_02_goals_constraints.md`。 |
| 项目级 | `pass_with_open_contracts` | owner exact surface、scope、safe-field、reconciliation、量化和外围 activation 仍 pending；不阻塞需求级架构基线。 | 更新 flow/ledger 后进入 Step 2；正式 `01` 仍不可写。 |

