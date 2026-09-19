## Step 1. 确认概要设计输入边界

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 1
- 回填章节：`详细设计书写规范` §5.1 与上游文档的关系声明、§5.17 风险与待确认事项
- 当前模块：`upstream-boundary`
- Step 门禁：`pass / self_reviewed`

#### 1.1 Step 内计划

- [x] 读取输入和前序结论：已读取正式 `00/01/02`、`02` Step 12～14、详细设计 SOP/书写规范、中间产物规范、真相源闭环标准、目录组织规范、TypeScript/Rust 编码规则、专项上游必要台账和旧 `03` 污染审计材料。
- [x] SOP 问题回答：已逐项回答本步五个问题。
- [x] 当前材料 / 旧文档诊断：已点名旧正式 `03` 的职责、对象、存储和技术选型污染。
- [x] 设计取舍：已比较沿用旧 `03`、重建校准工作台和直接一次性改写三种方案。
- [x] 结构化中间产物：已形成上游关系映射、承接白名单、边界图和缺口风险表。
- [x] 复杂度判断 / 是否拆模块或附录：本步仅需一份边界产物；对象/port/协议等重契约不在本步展开，分别留给 Step 5～10。
- [x] 回填草稿：已形成可映射到正式 §1 和 §17 的草稿；正式文档仍不可写。
- [x] 自检与进入下一步条件：已通过 Step / 文档 / 项目级自检；允许进入 Step 2。

### 2. 本步输入

| 输入 | 已确认内容 | 本步用途 |
|---|---|---|
| `projects/L5-console/00-需求文档.md` | C-CON-1～6、FR/BR/DR/IF/DEP/NFR/AC/VETO、`CON-Q-034～047` | 确认详细设计不可重写的行为、安全、可访问性和事实边界。 |
| `projects/L5-console/01-架构设计.md` | 浏览器/辅助技术入口、客户端边界、owner 分区、SDK-only、局部降级、无 BFF/worker/业务 DB/projection | 确认实现契约必须服从的依赖方向、数据所有权和运行边界。 |
| `projects/L5-console/02-概要设计.md` §4～§12 | 五个主要组成部分、关键对象、Command/Query/optional Consumer seam、九组处理流、客户端状态和详细设计承接清单 | 作为详细设计的直接真相源和主语白名单。 |
| `projects/L5-console/design-calibration/02_hld_step_12_detail_design_handoff.md` | 03 展开方向、禁止事项、回退规则和 pending 传递 | 约束本步只确认承接，不在 03 静默改名或新增主语。 |
| `projects/L5-console/design-calibration/02_hld_step_13_risks_open_questions.md` | `CON-Q-034～047`、16 项风险、阻塞范围 | 建立输入不足风险和下游阻塞清单。 |
| `projects/L5-console/design-calibration/02_hld_step_14_formal_document_assembly.md` | 正式 02 已装配、对象/接口/流程/状态/历史污染审计通过 | 确认可进入 03 校准，但 02 仍停审。 |
| `standards/document/详细设计讨论流程_SOP.md` | Step 1～19、模块主轴、逐 Step 产物和门禁 | 定义本步问题、输出和完成条件。 |
| `standards/document/详细设计书写规范.md` | 18 章主链、实现契约、模块文件布局、闭环审计 | 定义正式 §1/§17 的回填形态。 |
| `standards/document/设计文档讨论中间产物规范.md` | 十段式 Step 文件和三层台账恢复门禁 | 定义本文件结构与状态真实性要求。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 字段、DTO、状态、metadata、ref、phase boundary 的唯一来源原则 | 防止本步把未闭口类型写成实现事实。 |
| `standards/document/子项目目录与代码文件组织规范.md` | 实现仓默认 `/home/aris/Projects/quantalithos-<project>`；Rust 布局规则 | 作为 Step 3/4 的后续输入，本步只登记，不提前决定目录。 |
| `/home/aris/Projects/quantalithos-sdk/packages/typescript/package.json`、`tsconfig.json` | 当前官方 `@quantalithos/sdk` 为 private ESM TypeScript package，ES2022/NodeNext/strict/declaration | 作为 SDK 消费事实线索；不证明 Console owner contract 已闭口。 |
| 旧 `projects/L5-console/03-详细设计.md`、README、`draft/`、`L1-workspace/draft/` | 旧工作台对象、服务端持久化、框架和固定数字等历史材料 | 只做污染审计，不作为结论来源。 |

依赖的前序 Step：

```text
无。Step 1 是 L5-console 03 full-restart 的起点；正式 00/01/02 的停审结论是进入条件，不能被本步重开。
```

### 3. SOP 问题回答

#### 3.1 当前详细设计直接承接概要设计中的哪些结论？

直接承接 `02-概要设计.md` 已收稳的五个主要组成部分和四层实现框架：

1. 访问语境与导航：`AccessContext`、`NavigationState`、`DisclosureGuard`、资格/披露收紧边界。
2. 来源保真视图：`OwnerViewSnapshot`、`SourceStatusAxes`、`OwnerViewModel`、`ReferenceSet`、`QueryNoWriteGuard`。
3. 受控意图与结果：`DraftIntent`、`RequestPresentation`、`ResultReference`、`CompletionGuard`、`UnknownReplayGuard`。
4. 管理主题组织：`TopicVisibility`、`TopicActivationState`、`TopicViewModel`、`OwnerActivationGuard`、`SafeLinkReference`，以及八类 owner 主题的条件化 seam。
5. 韧性与可访问交互：`DegradationState`、`RecoveryPlan`、`AccessibilityState`、`DiagnosticContext`、恢复与等价辅助路径。

同时承接 `02` §7 的 Command、Query、可选 SDK invalidation Consumer 分类，§8 的语境 bootstrap、owner-safe query、草稿/偏好、受控提交、正式回查、主题组合、失效提示、恢复/a11y 九组流，§9 的客户端状态机和多轴只读映射，以及 §12 的详细设计回退规则。

本步的“直接承接”表示主语和边界已稳定，并不表示 exact owner schema、字段、函数签名、缓存介质或实现仓已确定。

#### 3.2 概要设计中的代码主体框架是否已经足够稳定？

足够进入详细设计骨架展开，但不足以直接开始实现。`02` 已经稳定：

- 五个主要组成部分没有把 owner domain truth 迁入 Console；
- 四层关系（入口/编排、应用服务、客户端 policy/state、SDK/owner adapter）能解释查询、提交、回查和恢复主线；
- Query no-write、formal result、unknown/fail-closed、owner 局部降级和 a11y 等价语义已成硬边界；
- 03 的主组织轴应是“模块/feature 责任 + 实现契约”，不是旧 `ConsoleWorkspace` 对象全集。

仍未稳定的内容必须在后续 Step 收口：planned TypeScript 文件布局、导出类型、view model 细节、SDK adapter/query/command seam、state carrier lifecycle、缓存失效、错误 envelope、配置绑定和测试切口。其未闭口不阻塞本步进入 Step 2，但会阻塞 Step 5 之后的精确实现契约和未来 Step 19 正式装配。

#### 3.3 概要设计中的关键对象、接口骨架、处理流和状态机是否足够继续展开？

足够作为轮廓输入，需按以下方式下沉：

| `02` 输入 | 已达到的深度 | 03 继续展开 |
|---|---|---|
| 关键对象 | 已有责任、字段类型级轮廓、成员/工厂函数意图和禁止事项 | Step 5/6：模块归属、TypeScript type/interface、构造与转换函数、不可变/只读边界、不变量和安全 ref。 |
| 接口骨架 | 已区分本地 Command、owner 委托 Command、owner-safe Query、可选 invalidation Consumer | Step 7/8：query/command adapter seam、输入/输出 view、错误与 pending carve-out；不发明 owner path/schema。 |
| 处理流 | 已有九组节点与边界 | Step 9：函数级 typed 调用链、取消/失效/局部降级和 no-write 证明。 |
| 状态机 | 已有交互状态、结果状态、多轴映射和禁止提升 | Step 10：客户端 enum/transition guard、carrier 生命周期和状态闭环；不复制 owner 生命周期。 |
| 配置/依赖 | 已有可配置类别和不可配置红线 | Step 14：typed binding；具体键、默认值、填写规则留给 04。 |

#### 3.4 哪些内容仍停留在概要设计轮廓，进入详细设计前必须补清？

- 模块和 planned 文件路径如何对应浏览器 entry、feature、adapter、view model、state carrier、diagnostic 与测试 seam；
- TypeScript 导出类型和安全 ref/view model 的确切归属，尤其是 `SourceStatusAxes`、`RequestPresentation`、`TopicVisibility` 等支撑 carrier；
- `@quantalithos/sdk` 的消费面与 owner-safe mapper 如何隔离，exact query/command/result/ref 未闭口时的最小 adapter surface；
- local command 与 owner command 的 request/receipt/result/unknown 映射、显式 reconciliation 触发和缓存失效触发；
- 客户端状态承载的生命周期、清理、scope 绑定、并发失效和介质选择；
- safe-field/redaction、diagnostic envelope、a11y/browser support matrix、性能/负载 authority 和测试证据边界；
- 目标实现仓尚不存在，因此不能把 planned 文件写成当前代码事实。

上述项目将在 Step 2～4 建立范围、编码/runtime 和 planned 布局边界；具体对象/port/protocol/flow/state 契约留给后续授权的 Step 5～10。

#### 3.5 哪些需求或架构结论会影响详细设计，但不能在详细设计中重新定义？

需求层不可重定义：C-CON-1～6 的外部行为、FR/BR/DR/IF/DEP/NFR/AC/VETO、最小披露、forbidden-body、unknown 不重放、a11y 语义等价和未确认量化项。架构层不可重定义：Console 是 Layer 5 浏览器产品/分发客户端、owner truth 分区、所有业务访问经 SDK/正式边界、无数据库/BFF/worker/owner projection/private bus、局部故障隔离和未停审项目只作 pending link/ref。概要层不可重定义：五个主要组成部分、`02` 对象/接口/流/状态主语、主题 activation 的 pending 上限和 §12 回退规则。

详细设计可以把这些结论翻译成 TypeScript 模块、view model、adapter、guard、state carrier 和测试切口，但不能改变其所有权、资格、结果或状态语义。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧正式 `03-详细设计.md` 文档头部和 §1 | 仍声称遵循旧“15 节结构”，关联旧 `02` v0.1.0，作者/日期/评审/接受状态为历史草案元数据 | 与当前 18 章详细设计规范、`02` formal stop_review 和本轮 full-restart 冲突。 |
| 旧正式 §1～§5 | 将 `ConsoleWorkspace`、`PanelState`、`CrossPanelContext`、`UnifiedSummaryCard`、`PermissionHint` 等写成工作台/统一摘要真相，并安排 repo/projection/publisher/shell | 把交互状态升级为 Console truth，违反当前 owner truth、无 DB/projection/outbox/BFF 边界。 |
| 旧正式 §3～§4、目录树 | 采用 `src/api`、Rust service/repository/projection 目录和固定服务端模块 | 架构未选择 Rust 服务或 Cargo 布局；不能作为当前实现仓事实或技术选型。 |
| 旧正式 §6～§9 | 使用完整 Rust struct、数据库写模型、事件/存储/一致性语义，且把 source domain 结果聚合为统一工作台对象 | 复制服务端规则、生成第二真相并混同 owner 状态与客户端呈现。 |
| 旧正式 §10～§15 | 固定 API、存储、错误码、指标/控制项和实现测试口径 | 无当前 authority；会污染后续 SDK seam、配置、NFR 和测试设计。 |
| README / 本仓 `draft/` / `L1-workspace/draft/` | 含 React/Vue/Svelte/Tailwind、Provider Contract、页面/组件和固定数量等候选内容 | 只能用于术语/粒度审计，不能直接决定 framework、组件、route、package 或指标。 |

历史材料审计结论：保留“客户端交互状态、owner 分区、来源多轴、草稿/结果分层、局部降级、a11y”等可迁移边界表达；废弃服务端真相、数据库/repository/projection、固定技术栈、Provider Contract、固定数字和统一 readiness 口径。

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 详细设计输入 | 旧 `03` 自带对象、Rust 服务端目录和历史 `02` | 只承接当前正式 `00/01/02` 和其 calibration 结论 | 建立单一当前真相源，阻断历史主语回流。 |
| 主组织轴 | 工作台对象全集、写模型/读模型和服务层 | 五个 `02` 主要组成部分对应的 planned client modules | 让实现契约按功能边界展开，不把交互对象升级为 owner truth。 |
| 技术形态 | Rust API/repository/projection 假设 | TypeScript browser client 作为待 Step 3/4 收口的实现候选；框架 pending | 架构未锁框架，官方 SDK 已有 TypeScript 消费事实。 |
| 外部访问 | 旧文隐含 source repo、DB、publisher、service | 仅 `@quantalithos/sdk`/正式服务边界；exact surface pending | 遵守 SDK-only、禁止旁路和 owner 责任边界。 |
| 结果语义 | receipt/toast/transport 与完成混杂 | request presentation、formal result/ref、unknown/blocked 明确分层 | 防止客户端伪造 owner 终态或自动重放。 |
| 文档状态 | 正式 03 可被误读为已设计/可实施 | 正式 03 保持历史材料；本轮仅写 calibration | 遵守 Step 门禁和用户要求的 Step 4 停止点。 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A：沿用旧正式 03，局部修补对象和目录 | 变更表面小 | 会保留 Rust 服务端、数据库、projection、Provider/框架和统一工作台真相污染 | 不采用。 |
| B：以当前 `00/01/02` 为唯一正式输入，按 19 Step 逐步校准，Step 19 才重建正式 03 | 可追溯、可回退、能逐层审计 owner 边界和实现事实 | 需要多轮中间产物，无法立即声称可实施 | 采用。 |
| C：从 `02` 一次性生成完整 TypeScript 详细设计 | 交付速度快 | 容易猜框架、目录、exact contract、state carrier 和错误面，违反逐 Step 门禁 | 不采用。 |
| D：把 owner domain 合同复制到 Console 以获得“完整”契约 | 表面字段完整 | 破坏真相源唯一、SDK-only 和跨仓责任边界 | 不采用。 |

### 7. 结构化中间产物

#### 7.1 上游关系映射表

| 来源文档 / 章节 | 已收稳的承接结论 | 详细设计继续展开 |
|---|---|---|
| `00-需求文档.md` §4/7/9/10～14 | Console 对外目标、六个核心能力、行为规则、数据/接口/NFR/验收/否决项 | 实现模块的输入/输出上限、guard、view model、错误/恢复和测试切口；不重写需求。 |
| `01-架构设计.md` §4～10/13～15 | 浏览器客户端边界、owner 分区、SDK-only、局部降级、无 BFF/DB/worker/projection/private bus | 模块依赖方向、adapter/query/command seam、state carrier 和安全诊断接缝。 |
| `02-概要设计.md` §4～5 | 五个业务主要组成部分和四层实现视图 | planned feature modules、entry、application orchestration、policy/state、adapter 文件分组。 |
| `02-概要设计.md` §6 | 关键对象、guards、refs 和省略项 | Step 5/6 的 TypeScript type/interface、构造、状态和不变量。 |
| `02-概要设计.md` §7 | Command/Query/optional invalidation consumer 分类、八类主题 pending 姿态 | Step 7/8 的 SDK adapter、owner mapper、protocol seam 和错误映射。 |
| `02-概要设计.md` §8 | 语境、Query、draft、submit、reconcile、topic、invalidation、recovery/a11y 九组流 | Step 9 typed 函数流、取消/失效/局部降级与 no-write 约束。 |
| `02-概要设计.md` §9 | Context/visibility/multi-axis/draft/request/topic/degradation/a11y 客户端状态边界 | Step 10 transition guard、carrier 生命周期和状态闭环。 |
| `02-概要设计.md` §10～11 | 异常边界、配置影响和不可配置红线 | 后续错误、配置绑定和外部依赖的实现约束；不在本步展开。 |
| `02-概要设计.md` §12～13 | 03 承接白名单、回退规则、风险、`CON-Q-034～047` | 作为所有后续 Step 的主语白名单和 blocker 传递。 |
| 官方 `@quantalithos/sdk` TS package | private ESM、ES2022/NodeNext、strict、declaration | Step 3/4 的 TypeScript 消费边界事实；不等同 owner exact contract。 |

#### 7.2 详细设计主语白名单

```text
五个主要组成部分
  ├─ access / navigation
  ├─ owner-safe views
  ├─ controlled intent / result
  ├─ topic composition
  └─ degradation / accessibility

允许的实现主语
  ├─ browser entry / session shell
  ├─ feature module / application orchestration
  ├─ client interaction state / view model
  ├─ disclosure / no-write / completion / recovery guard
  ├─ SDK access / owner query / owner command / reconciliation adapter
  ├─ invalidation adapter（仅正式 SDK surface 激活时）
  └─ safe diagnostic / focus / announcement seam

禁止在 03 中新增
  ├─ owner aggregate、Policy/Gate 决策、业务 repository、数据库、BFF、worker、outbox、projection
  ├─ Console-owned audit/evidence/report/readiness/health truth
  ├─ 未获 authority 的 framework、router、component library、cache product、TTL 或固定阈值
  └─ 未停审 L5/L6 的私有页面、API、事件、状态或指标
```

#### 7.3 详细设计输入缺口与影响矩阵

| 缺口 / blocker | 影响的后续 Step | 当前安全上限 | 未确认前禁止 |
|---|---|---|---|
| `CON-Q-034` owner exact Query/Command/Result/Ref 与 activation | 5～10、14、16 | 能力级 seam；`pending/blocked/read-only/partial` | 发明 path、DTO、错误码或“已集成”。 |
| `CON-Q-035` scope owner、层级、切换、撤销 | 5～10、12～13 | 外部 ref；不可验证 fail-closed | 本地建模 scope hierarchy 或从 URL/role 推导。 |
| `CON-Q-036` visibility/资格/reason/撤销 | 5～10、12、16 | 客户端只收紧、最小披露 | UI/flag/cache 推导 allow。 |
| `CON-Q-037` safe-field/redaction 与五个来源轴 | 5～12、14～16 | 最小 summary/ref，多轴保真 | 存储/日志/诊断/导出 raw 或 hidden body。 |
| `CON-Q-038` unknown reconciliation/幂等 | 7～13、16 | unknown/blocked，不自动 replay | 以 refresh、toast、本地 key 或时间宣布完成。 |
| `CON-Q-039～043` 专项 owner 消费与 activation | 5～10、14～16 | 只读或局部 partial；按 owner 隔离 | 复制 Workspace/method/capability/observability/archive/sandbox truth。 |
| `CON-Q-044` state carrier 介质、保留、清理、跨设备 | 5/6/9/10/11/13/14 | interaction truth；生命周期 pending | 承诺离线、跨设备同步或安全关键持久化。 |
| `CON-Q-045～046` 性能、兼容、a11y、diagnostic authority | 12～16 | 行为级有界口径；不声明验证通过 | 继承旧 SLA/P95/兼容矩阵/诊断 envelope。 |
| `CON-Q-047` 未停审 L5/L6 link/ref | 5/7/8/12/14 | future link/ref pending | 消费相邻项目私有状态或深链合同。 |

#### 7.4 当前交付边界图

```text
正式 00/01/02 + SDK/owner 正式边界
                  │
                  ▼
       ┌────────────────────────┐
       │ 03 详细设计校准边界     │
       │ modules / types / seams │
       │ flow / state / tests    │
       └───────────┬────────────┘
                   │
       ┌───────────┴─────────────┐
       ▼                         ▼
  可在本仓收口的客户端契约       仍需正式 owner/后续文档确认
  navigation/view/draft         exact query/command/result/ref
  recovery/a11y/diagnostic      scope/visibility/safe-field
  adapter boundary              reconciliation/activation/metrics

  任何右侧缺口不得被左侧本地实现、旧文档或 UI 状态填补。
```

关键说明：

- 图表达“概要设计已稳定的客户端边界”与“详细设计尚需闭口的 owner/配置/实现契约”之间的分界。
- 图不表达具体 HTTP、路由、组件、SDK 方法名、存储介质或状态实现。
- 最容易误解的边界是：官方 SDK package 存在不等于每个 owner surface 已激活；安全 view/ref 存在不等于 Console 拥有 owner truth。

### 8. 回填草稿

以下内容是未来正式 `03-详细设计.md` §1 与 §17 的回填草稿；本轮不写入正式文件。

#### §1 与上游文档的关系声明（草稿）

本详细设计直接承接正式 `00-需求文档.md`、`01-架构设计.md` 和 `02-概要设计.md`。`00` 提供外部行为、安全、可访问性、否决项和验收方向；`01` 提供浏览器客户端边界、owner truth 分区、SDK-only 依赖方向、局部降级和无旁路架构；`02` 提供五个主要组成部分、客户端对象/guard/ref、Command/Query/optional Consumer 骨架、九组处理流、状态边界和详细设计回退规则。

本文继续展开 planned TypeScript 浏览器客户端的模块、文件、view model、state carrier、SDK/owner adapter、guard、协议 seam、函数流、状态转换、错误恢复、配置绑定、诊断与测试切口。本文不重定义需求目标、架构取舍、owner domain truth、Policy/Gate、数据库、BFF、worker、projection、私有 bus、未闭口 exact contract 或未停审项目私有状态。

#### §17 风险与待确认事项（草稿）

`CON-Q-034～047` 继续保持 `open/pending`。其中 owner exact surface、scope/visibility、safe-field、reconciliation、专项 activation 会阻塞后续精确 adapter/protocol/flow；state carrier 生命周期、diagnostic/a11y/browser authority 和性能/兼容量化会阻塞对应配置、测试和验收闭环。目标实现仓不存在，因此 Step 4 前只能输出 `planned / not_created` 目录；不得将计划文件、package 或 baseline 写成现存事实。

### 9. 待确认事项

- `CON-Q-034～047` 的 owner/SDK 合同、scope、visibility、safe-field、reconciliation、activation、状态介质、诊断/a11y 和量化 authority 仍待各正式 owner 或后续文档闭口。
- 前端 framework、bundler、浏览器支持矩阵和具体缓存/存储介质未由 `01` 正式选定；Step 3 只能记录 pending，不能从旧文档或目录样例推断。
- `@quantalithos/sdk` 的官方 TypeScript package 当前存在，但 Console 应消费的 exact export/query/command/result/ref surface 尚未核验；不得把 SDK package 内部文件当 owner 合同。
- 目标实现仓 `/home/aris/Projects/quantalithos-console` 当前不存在；Step 4 的目录树必须标注 planned，不得创建目录或文件。
- 本步未定义任何完整 schema、函数签名、错误码、存储表、缓存 TTL、重试参数或测试结果；这些需按后续 Step 和用户授权处理。

### 10. 进入下一步条件

- [x] 正式 `00/01/02`、02 Step 12～14 和详细设计规范已列为输入，且直接承接内容可回指。
- [x] 已明确本文不再回答的需求/架构/概要问题，以及 03 必须继续收口的实现契约问题。
- [x] 已完成旧正式 `03`、README、draft 和 Workspace draft 的历史污染审计，未将其技术/对象/存储口径升级为当前真相。
- [x] 已登记会阻塞后续精确设计的输入缺口，并为每项给出安全上限和禁止替代。
- [x] 未修改正式 `03-详细设计.md`，未实现代码、运行测试或伪造实现事实。
- [x] Step / 文档 / 项目级门禁均通过；下一步允许进入 Step 2“明确本轮实现范围和非范围”。
