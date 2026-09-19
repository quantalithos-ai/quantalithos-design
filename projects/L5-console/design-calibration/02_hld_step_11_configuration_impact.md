## Step 11. 配置影响轮廓

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 11
- 回填章节：正式 `02-概要设计.md` §11「配置影响轮廓」

#### 1.1 Step 内计划

- [x] 读取 Step 4～10 与正式 01 横切约束
- [x] 识别主要组成部分、入口、adapter、state carrier、diagnostic 和 a11y 的配置影响
- [x] 区分直接受配置、间接受配置、不适用和禁止配置化
- [x] 建立配置影响轮廓表和禁止配置化边界表
- [x] 明确交给 03 的实现契约方向和交给 04 的填写/校验说明边界
- [x] 审计无配置项、默认值、JSON、环境变量、secret 名或 constructor 参数提前进入

### 2. 本步输入

- `design-calibration/02_hld_step_04_code_subject_framework.md`
- `design-calibration/02_hld_step_05_components_boundary.md`
- `design-calibration/02_hld_step_07_api_interface_skeleton.md`
- `design-calibration/02_hld_step_08_processing_flows.md`
- `design-calibration/02_hld_step_09_state_machine.md`
- `design-calibration/02_hld_step_10_exceptions_boundaries.md`
- `projects/L5-console/01-架构设计.md` §13
- `standards/document/概要设计书写规范.md` §4.11

### 3. SOP 问题回答

1. **哪些结构会受到配置影响？**

   运行期 owner/SDK adapter 选择与 endpoint/profile 引用、主题是否具备正式 activation 描述、可选 invalidation/diagnostic 接缝、客户端状态 carrier 的保留介质/范围、布局与有限偏好、query 并发/分页/timeout/retry 的技术上限、a11y 支持/播报策略和安全链接允许目标可能受配置影响。配置只能在正式 contract 和安全上限内选择/收紧。

2. **哪些模块只能间接受配置影响？**

   `AccessContext`、`DisclosureGuard`、`SourceStatusAxes`、`CompletionGuard`、`UnknownReplayGuard`、`TopicVisibility`、`OwnerActivationGuard` 和状态机不能直接读取配置。它们只接收经过 runtime composition 验证的依赖或 policy input，且配置不能改变不变量。

3. **哪些边界禁止配置化？**

   owner truth/归属、SDK-only、actor/scope/visibility/资格来源、最小披露、query no-write、receipt/result/unknown 分层、unknown 不重放、正式结果终态、forbidden-body 零进入、多轴状态保真、局部故障隔离、a11y 语义等价、无 BFF/worker/projection/outbox、未停审产品不作为 truth 等全部禁止由配置放宽。

4. **03 应继续定义哪些配置实现契约？**

   需要定义 runtime composition、typed config、loader/validator、owner adapter registry、state carrier policy、cache invalidation policy、diagnostic/a11y adapter 注入、safe-link allowlist policy、技术 timeout/budget 的 authority 绑定、配置错误 fail-closed 和清理/刷新行为。名称仅是承接方向，不在本步定义字段全集。

5. **哪些内容属于 04？**

   配置项清单、默认值、取值约束、环境变量/文件路径、profile、secret reference、示例、覆盖顺序、启动/热更新/回滚说明属于 04；当前不写。

### 4. 当前文档问题诊断

| 材料/位置 | 当前问题 | 修正 |
|---|---|---|
| 旧 02 技术约束 | React/Svelte、组件库、Provider Contract 等可能被当成固定配置/选型 | 全部移出当前结论；只保留实现无关配置影响类别 |
| 旧 permission/feature flag | flag 可能控制权限或管理入口正向能力 | flag 最多收紧/隐藏实验性呈现，不能放宽资格或激活未闭口 surface |
| 旧 dashboard | 固定控制项/指标/阈值可能配置化成为健康/合规结论 | 数量、阈值和 verdict 必须来自正式 owner；Console 不配置规则 |
| 状态 carrier | 生命周期、TTL、跨设备范围未明确 | 识别为配置影响，但精确介质/保留/清理由 03/04 收口 |
| timeout/retry | 旧数字可能无 authority 回流 | 仅识别技术预算类别；无测量 authority 不写具体数值 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置定位 | 框架/Provider/阈值混杂 | runtime composition、adapter、state carrier、technical budgets | 保持概要层和 authority 边界 |
| 权限/激活 | feature flag 可能放开入口 | 配置只能收紧，正式 owner contract 决定 activation | 防止 fail-open/伪集成 |
| 状态/结果 | timeout/cache 可能推动状态 | 配置不改变状态迁移或正式结果 | 防止伪成功和第二 truth |
| 指标/控制 | 固定数量/阈值 | owner 正式定义/引用，未闭口则 pending | 防止 UI 生成合规/健康 |
| a11y | 可选 UI 偏好 | 语义等价不可关闭；具体适配/策略可配置 | 保持核心路径 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：概要层列完整配置项和默认值 | 看似可实施 | 越入 03/04，数字无 authority，易把安全边界变开关 | 不采用 |
| 方案 B：完全不提配置 | 文档短 | 详细设计可能把 adapter/state/a11y/diagnostic 随意硬编码 | 不采用 |
| 方案 C：只写影响类别、禁止配置化红线和下游承接 | 保持边界同时给出落码方向 | 需后续 03/04 继续闭口 | 采用 |

### 7. 结构化中间产物

#### 7.1 配置影响轮廓表

| 主要部分 / 接缝 | 是否受配置影响 | 配置影响类型 | 允许影响的概要范围 | 交给详细设计展开 |
|---|---|---|---|---|
| 访问语境入口与 session shell | 间接受影响 | profile、external endpoint、session/state carrier policy | 选择正式语境 provider/adapter、会话壳承载方式；失败必须 fail-closed | runtime composition、provider injection、失效/清理策略 |
| `AccessContext` / `DisclosureGuard` | 否（规则不可配置） | 不适用 | 只能接收正式 context/visibility 结果和验证后的依赖 | guard 输入契约；禁止读取自由配置放宽披露 |
| 导航、布局、筛选与有限偏好 | 是 | feature policy、client preference、layout policy | 影响顺序、布局、默认筛选和可选提示；只能在正式 visibility 内收紧 | typed preference、版本/迁移、清理与冲突策略 |
| `SdkAccessPort` / owner adapters | 是 | external endpoint、profile、adapter registry、timeout | 选择正式 SDK/owner adapter 和技术调用预算；不得切换到 DB/private bus | adapter config、validation、error mapping、authority binding |
| owner-safe Query 编排 | 间接受影响 | timeout、concurrency/budget、page limit、cache policy | 有界 fan-out、技术分页/取消/缓存；不改变 owner 状态语义或 coverage | query policy、cache invalidation、cancellation、budget enforcement |
| `SourceStatusAxes` / safe-field mapping | 否（语义不可配置） | 不适用 | 状态轴、safe-field 和 redaction 必须来自正式合同 | per-owner mapper contract；缺失时 fail-closed/partial |
| 草稿与 request presentation carrier | 是 | store root/medium、retention/cleanup policy、session/device scope | 影响本地交互状态保存和清理；不改变 owner truth/结果 | state carrier abstraction、retention/cleanup、migration |
| `SubmissionEligibilityGuard` / `CompletionGuard` / `UnknownReplayGuard` | 否（规则不可配置） | 不适用 | 资格、正式终态、unknown 重放红线固定 | 依赖注入与测试切口，不允许 flag 绕过 |
| `OwnerCommandPort` / `ResultReconciliationPort` | 是（仅接缝） | external endpoint、profile、timeout、retry policy | 选择正式 command/reconciliation adapter；retry 仅在 owner 幂等依据内 | adapter config、metadata/idempotency propagation、unknown mapping |
| 管理主题 registry / route grouping | 间接受影响 | feature policy、topic registration、safe-link policy | 可隐藏/分组/收紧已正式激活主题；不得激活未闭口 surface | registry composition、activation authority validation、route mapping |
| `TopicActivationState` / `TopicVisibility` | 否（状态不可配置） | 不适用 | 只能由正式 contract/visibility 结果更新 | owner activation mapper；配置不得提升状态 |
| 可选 SDK invalidation consumer | 是 | feature policy、external endpoint、subscription profile | 只有正式 envelope 合同存在时启用；无则显式 Query fallback | consumer adapter、source validation、duplicate/order handling |
| safe-link / 外围产品 link | 是（条件化） | safe-link allowlist policy、external endpoint | 只允许正式、安全、可撤销 link/ref；未停审 L5/L6 保持 pending | link validator、target registry、revocation/invalidation |
| diagnostic sink | 是（条件化） | external endpoint、feature policy、redaction profile、retention policy | 可关闭输出或收紧字段；sink 失败不改业务，forbidden body 永不允许 | typed diagnostic envelope、redaction validator、sink isolation |
| accessibility adapter / presentation policy | 是（细节） | accessibility profile、announcement/focus policy、locale | 影响呈现/焦点/播报方式；不得关闭等价目标或改变资格/结果 | focus/announcement adapters、semantic mapping、support matrix binding |
| local performance/availability budgets | 间接受影响 | timeout、concurrency、batch/page size、retry | 仅在正式 authority/测量边界内约束技术行为；不能成为业务阈值/verdict | budget source、validation、instrumentation/test linkage |
| Outbound Event / Operations Job | 不适用 | 不适用 | 当前不存在 Console-owned event/job | 若未来需求新增必须回退 01/02，不通过配置创建 |

#### 7.2 禁止配置化边界表

| 禁止配置化边界 | 原因 | 若需改变应回到哪里 |
|---|---|---|
| Console 与各 owner 的 truth 归属 | 单一真相源根边界 | 正式 00/01 和 owner 架构，不得由部署配置改变 |
| 所有业务访问经 `L0-sdk`/正式服务边界 | 防止 DB/repository/private bus/BFF 旁路 | 正式架构/ADR 评审，不能用 endpoint 配置绕过 |
| actor/scope/visibility/资格来自正式 owner | 防止本地授权和对象存在性泄露 | owner contract 与正式 00/01 |
| unknown/expired/revoked/conflict fail-closed | 防止旧权限或不确定状态放行 | 正式需求/架构/状态机 |
| Query no-write | 防止读取推进业务或 projection | 正式需求/概要处理流 |
| source/freshness/coverage/availability/consistency 独立保真 | 防止统一健康/合规/readiness | 正式 00/01/02 与 owner contract |
| draft/request/receipt/result/unknown 分层 | 防止 UI/transport 成功冒充完成 | 正式 00/01/02 状态机 |
| unknown 无正式 reconciliation/幂等依据不重放 | 防止重复副作用 | owner contract + 正式状态/恢复设计 |
| forbidden-body 零进入 | 防止敏感正文经正常/错误/诊断/导出旁路 | 正式安全/数据边界；配置只能进一步收紧 |
| owner 局部故障隔离 | 防止全局错误扩散或成功掩盖失败 | 正式架构/处理流/异常设计 |
| a11y 与视觉共享语义、结果和恢复上限 | 防止辅助路径变成第二业务/资格路径 | 正式需求/NFR/详细设计测试 |
| 未停审 L5/L6 只作 pending link/ref | 防止私有状态成为本仓 truth | 全局依赖规则和相邻项目正式停审结论 |
| 无 Console BFF/worker/projection/outbox/business DB | 防止配置创建未设计运行单元和第二 truth | 正式 01/02；需架构回退而非开关 |
| 没有 authority 的性能/SLA/控制项/指标数字 | 防止配置值伪装验收、合规或 readiness | 正式测量 authority、后续 00/05/06 校准 |

#### 7.3 配置影响轮廓图取舍

本步不画配置影响轮廓图。配置影响对象已在 §7.1 按主要部分/接缝逐行呈现；再画图会重复 Step 4 实现分层视图，或误导为已确定 ConfigLoader、文件、环境变量、secret store、热更新和部署挂载。表格更适合表达“直接/间接/不适用”和禁止配置化边界。

#### 7.4 03 详细设计承接的配置实现契约方向

| 契约方向 | 03 应回答 | 当前不得预设 |
|---|---|---|
| runtime composition | 如何把验证后的配置注入入口、service、port、adapter 和 state carrier | 框架、容器、constructor 完整参数 |
| typed config / validation | 如何区分缺失、非法、冲突、未知和无 authority 值并 fail-closed | 字段全集、默认值、JSON/env 名 |
| owner adapter registry | 如何绑定正式 owner/SDK surface、activation authority 和 error mapper | 固定 Provider Contract、未核验 endpoint |
| state carrier policy | 草稿/偏好/request/view cache 的介质、范围、清理、迁移和冲突 | 跨设备保证、TTL 数字、特定存储产品 |
| cache/invalidation | 如何绑定 context/visibility/version/source 并执行撤销/失效 | cache 命中=current、私有 event cursor |
| command/reconciliation policy | metadata/idempotency/unknown 映射和 retry gate | 本地生成幂等、自动重放、owner 终态枚举全集 |
| safe-link/diagnostic/a11y adapters | link 验证、redaction、sink 隔离、焦点/播报语义 | 未停审产品 URL、raw diagnostic body、支持矩阵假结论 |
| technical budgets | timeout/concurrency/page/batch/retry 如何绑定 authority、观测和测试 | 旧 SLA/P95/固定数字作为默认值 |

#### 7.5 04 配置设计承接边界

04 才说明经 03 收稳的配置项如何填写、校验和使用，包括配置路径/来源、默认值/必填性、合法范围、profile、secret reference、覆盖顺序、启动/刷新/回滚和示例。当前 Step 不声明这些配置已存在，也不创建正式 `04-配置设计.md`。

#### 7.6 配置影响一致性审计

| 审计项 | 结论 |
|---|---|
| 主语来源 | 所有受配置影响项均来自 Step 4～10 的主体/接缝，无新增 BFF/worker/store/product framework。 |
| 权限与激活 | 配置只能收紧或选择正式 adapter，不能生成 visibility/资格、提升 activation 或绕过 Policy/Gate。 |
| 状态与结果 | 配置不能推动 Context/Request/Result/Topic 状态迁移，也不能把 timeout/cache/toast 变成正式结果。 |
| 数据安全 | forbidden-body、safe-field、redaction 和诊断安全不可被配置放宽。 |
| 量化 | timeout/concurrency/page/retry 仅作为影响类别；无 authority 数字、阈值或 SLA 进入。 |
| 下游边界 | 03 收口实现契约，04 说明具体项；当前不提前创建文件或字段。 |

### 8. 回填草稿

正式 §11 回填配置影响轮廓表、禁止配置化边界表、03 配置实现契约方向表和 04 承接说明；保留“不画图原因”。正式正文不加入配置项清单、默认值、JSON/YAML、环境变量、文件路径、secret 名称、constructor 参数、加载代码或部署/热更新流程。

### 9. 待确认事项

- 客户端 state carrier 介质、保留/清理、跨会话/设备、迁移和冲突仍待 03/04；当前只确认交互 truth 上限。
- owner adapter exact surface、activation authority、safe-field/error/reconciliation 合同待 owner/SDK；不能用配置补齐。
- diagnostic envelope/sink、safe-link target、invalidation subscription 和 a11y 支持矩阵待正式 authority；当前均条件化。
- 性能、可用率、timeout/concurrency/page/retry 数字待场景、环境、窗口、责任和证据 authority；旧值不得继承。
- 技术框架、组件库、配置系统和 secret store 尚未选定；不影响本步结构结论。

### 10. 进入下一步条件与三层门禁

- 已识别主要部分/接缝的配置影响类型、允许范围和 03 承接方向。
- owner truth、安全、权限、状态、结果、幂等、forbidden-body、局部降级、a11y 和运行单元红线均显式禁止配置化。
- 未写配置项清单、默认值、JSON、环境变量、路径、secret 名、完整配置类型或加载实现。
- 受配置影响主语全部来自已收稳 Step 4～10，没有新增结构主语。

| 门禁 | 结论 | 证据 |
|---|---|---|
| Step / 模块级 | `pass` | 配置影响表、禁止配置化表、图取舍、03/04 承接和一致性审计完成。 |
| 文档级 | `pass` | 配置未改写对象、接口、流程、状态或异常边界；未越入 03/04 细节。 |
| 项目级 | `pass` | 允许进入 Step 12 详细设计承接；正式 `02` 仍锁定至 Step 14，持续 blocker 原样传递。 |
