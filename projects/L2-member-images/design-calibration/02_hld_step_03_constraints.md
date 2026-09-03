# L2-member-images 02 概要 Step 3: 收稳约束条件

> 创建日期: 2026-08-23
> 状态: `completed_stop_review`
> 当前模式: `full-restart`
> 回填位置: 正式 `02-概要设计.md` 第 3 章
> 当前限制: 未读取、删除或修改旧正式 `02-概要设计.md`；未创建 Step 4~14 文件

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 用户授权 | 用户以“同意”明确通过 Step 2 审阅门；本次只授权执行 Step 3 |
| 恢复顺序 | 已重读 `project_execution_ledger.md`、`02_hld_calibration_flow.md`、`02_hld_step_02_goals_scope.md`，并反查 Step 1 |
| 规范输入 | 已重读概要设计 SOP Step 3、书写规范“约束条件”章节，并参考 Runtime / Governance 已完成 Step 3 的表达粒度 |
| 直接输入 | Step 1 的输入分层与“不再回答 / 必须回答”，Step 2 的九类结构目标、范围、非范围和概要深度，正式 00 / 01 的 hard constraints、owner、data、dependency、interaction、recovery 与 cross-cutting 结论 |
| Sibling 刷新 | `L2-member` 当前 02 进行中；`L2-member-service` 当前 02 已到 Step 7 allowed。只承接双方已停审正式 01 的 owner / direction，进行中内容仍为 pending |
| 本步目标 | 只提炼会直接约束后续代码主体、主要组成部分、对象、接口、处理流、状态、异常、配置影响和 03 handoff 的硬约束 |
| 本步禁止 | 复述架构全文；命名具体代码主体、对象、接口、处理流或状态；写产品、协议字段、数据库 / 部署限制、实现策略或泛化工程口号；读取旧正式 02 |
| 用户门禁 | 本 Step 完成后立即停审；未经再次明确确认，不进入 Step 4 |

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `constraints` | `pass_stop_review` | 结构性硬约束、来源、作用面、pending / future 权限上限及概要层次边界已收口；每条约束均能指导至少一个后续 Step，且未提前命名结构 | 等待用户确认；确认后重读三层台账与本文件，再读取 SOP Step 4 / 书写规范“代码主体框架”章节并创建 Step 4 | `02_hld_step_01_upstream_boundary.md`;`02_hld_step_02_goals_scope.md`;正式 `00-需求文档.md`;正式 `01-架构设计.md`;概要设计 SOP / 书写规范 |

## 2. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| 输入与授权恢复 | `done` | Step 1 / 2、正式 00 / 01、规范和 sibling 状态复核 | `pass` |
| SOP 问题回答 | `done` | 五个必答问题逐项回答 | `pass` |
| 约束筛选 | `done` | 可进入 / 必须排除标准 | `pass` |
| 硬约束收口 | `done` | 固定三列表及来源映射 | `pass` |
| 后续作用审计 | `done` | Step 4~12 作用矩阵、MI-UP / Q 权限矩阵 | `pass` |
| 回填草稿与门禁 | `done_stop_review` | 正式第 3 章候选输入；Step 4 前置条件 | `pass_stop_review` |

## 3. 本步输入

| 输入 | 当前状态 | 本步用法 | 不获得的权限 |
|---|---|---|---|
| 正式 `00-需求文档.md` | `stable_requirement_baseline` | 承接 owner、static / live、pin、五节点能力、失败与否决红线 | 不重写需求，不把 AC / VETO 当实现或验收事实 |
| 正式 `01-架构设计.md` | `stable_architecture_baseline` | 承接 IC-MI-001~011、XC-MI-001~010、ADR-MI-001~007、数据 / 依赖 / 交互 / 恢复边界 | 不把 BC / LS、运行角色或责任层机械映射成代码 / 部署结构 |
| Step 1 | `completed_user_confirmed` | 承接 stable / pending / blocked / future 分层与后续必答清单 | 不直接继承其约束线索为本步结论 |
| Step 2 | `completed_user_confirmed_for_step_03` | 承接 current core / blocked-aware / conditional / excluded 范围及可落码骨架深度 | 不提前命名后续主体、对象、接口、流或状态 |
| Owner 正式链 | `owner_boundary_stable_exact_contract_pending` | 只确认 Role / mapping、component、seed、Artifact、Sandbox、runtime / tools / consumer 等 owner 边界 | 不复制正文，不声明 release、schema、handoff、confirmation 或 compatibility ready |
| Sibling 正式 01 | `formal_direction_stable` | 稳定 member component supply 方向和 Member Service pinned entry consumer / container owner 方向 | 进行中 02 不形成双方合同；MI-UP-001/002 不关闭 |
| MI-UP-001~009、Q-MI-001~004 | `open` | 决定 neutral、negative、gap、blocked、future 的结构上限 | 不形成 exact positive contract、active future scope 或 readiness |
| 旧正式 `02-概要设计.md` | `historical_material_unread` | 本 Step 不使用 | 名称、对象、接口、状态、产品、数字和完成结论均无 authority |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 哪些约束会直接影响本仓对象、接口、处理流或状态机设计？ | Local truth 单一 owner、external truth body-free、static / live 隔离、necessary pin、definition / candidate / eligibility / availability 分别成立、provenance 与 applicable gate、Artifact / consumer / container 分域、六类 seam、conditional inbound event、即时判断 / 长时工作分离、fail-closed、历史不覆盖、projection 只读、pending 权限上限和概要层次边界。 |
| 2. 哪些约束来自需求，哪些来自架构或全局设计？ | 正式 00 提供职责、业务规则、数据禁区、依赖、NFR 和否决红线；正式 01 把它们收稳为 IC / XC / ADR、owner / data / consistency / interaction / recovery；全局标准提供 truth 闭环、依赖分类、边界裁剪与不得伪造证据纪律。本 Step 只做结构性转译。 |
| 3. 哪些边界不先写清最容易串仓或串层？ | Role mapping 与 image definition、component / seed ref 与正文、镜像静态资产与 live state、external adapter outcome 与 candidate、candidate / eligibility / availability、image eligibility 与 Artifact formalization、pinned entry 与 launch / container health、BC / LS 与物理模块，以及接口骨架与 exact schema 最易混写。 |
| 4. 哪些只是泛化工程原则，不应进入本章？ | “高内聚低耦合”“代码清晰”“易扩展”等口号，具体语言 / framework / database / queue / registry / builder / scanner / signer 选择，性能数字、部署拓扑、索引、事务、retry 算法、配置键、测试覆盖率与运维流程均不进入。 |
| 5. 每条约束是否能指导后续设计判断？ | 是。§8.3 逐族映射 Step 4~12；无法决定归属、边界、字段允许性、接口权限、流停止条件、状态合法性、恢复方式或配置红线的内容已被排除。 |

## 5. 当前文档问题诊断

本 Step 不读取旧正式 02，因此以下诊断只针对已获 authority 的当前输入如何向概要层转译，不对旧 02 正文作内容判断。

| 当前输入现象 | 后续风险 | 本 Step 处置 |
|---|---|---|
| 正式 01 已有 IC、XC、ADR、BC / LS、责任层和运行角色 | 全量复制会把第 3 章写成架构设计第二版，机械命名又会锁死代码 / 部署结构 | 只保留能改变 Step 4~12 判断的结构约束；BC / LS 继续只作语义输入 |
| 本仓同时承接 definition、build、qualification 与 supply | 容易压成一个 `ready` pipeline 或单一生命周期 | 明确每个 local decision context 分别成立，跨 owner handoff 另行表达 |
| 镜像物理内容会装入 runtime / tools / member / seed | 容易把“装入”误写成语义 owner 转移，或把 live state 写进静态 truth | 以 pinned ref / safe snapshot 承接，正文与 live state 均禁止进入本地语义 truth |
| Registry、builder、evidence、Artifact、consumer 都参与主线 | 容易用外部 acceptance / presence / callback 直接推进本地 positive state | 外部结果只作为受控输入，本地 decision 与 external handoff 分层 |
| Exact contracts 大量 pending，但 owner / direction 已稳定 | 容易在接口章节伪造 positive DTO，也可能因 pending 而丢掉所有保守路径 | 允许 neutral seam 与 negative / gap-aware 骨架，阻塞 exact positive expansion |
| Sibling 正式 01 已停审，进行中 02 已推进 | 容易把并行讨论内容误当双方闭合合同 | 只承接正式 01；进行中 02 仅用于确认 pending 仍在，不获得 authority |
| 规范允许概要层写类型骨架 | 若不设边界，后续会提前写完整 schema / protocol / storage | 本 Step 把语言中立、关键轮廓和完整 contract 后移写成显式约束 |
| 设计 pass 与系统 ready 使用相似正向词汇 | 容易把文档门禁误写成实现、测试、evidence 或 release 事实 | 本 Step 全程只声明 design status；真实交付事实不在 02 authority 内 |

## 6. 改动前后对比

| 维度 | Step 3 前 | Step 3 后 |
|---|---|---|
| 不变量 | 分散在正式 00 / 01 的规则、IC、XC、ADR 和 Step 1 / 2 线索中 | 已筛成 23 条可直接指导后续结构判断的硬约束 |
| 作用范围 | 只能泛化地说“后续需守住边界” | 每条约束明确作用于哪些概要结构面，并由作用矩阵反查 |
| Owner / body | Owner 边界稳定但尚未成为概要字段 / seam 判断规则 | External truth 只可 body-free 承接；物理装配不转移语义 owner |
| 主线状态 | Staged decisions 在架构层成立 | 后续禁止单一 ready lifecycle，且 external outcome 不自动推进 local truth |
| Pending seam | 已知 exact contract blocked | 已明确每个 MI-UP / Q 允许与禁止的概要展开上限 |
| 设计层次 | Step 2 只定义总体深度 | 已明确不提前命名结构、不写 exact schema / storage / implementation / product |
| Readiness | 已声明 implementation status 不是输入 | 进一步禁止把 skeleton、fake、文档 pass 或 pending 对端草案写成证据与 readiness |

## 7. 设计取舍

| 方案 | 优点 | 缺点 / 风险 | 结论 |
|---|---|---|---|
| A. 直接复制 IC-MI / XC-MI / ADR-MI | 追溯简单 | 复述架构全文，不能清晰指导概要章节判断 | 不采用 |
| B. 将稳定架构不变量转译为带作用范围的概要硬约束 | 既保留 authority，又能约束后续结构 | 需要维护来源和作用矩阵 | 采用 |
| C. 现在补齐 pending seam 的 DTO / schema / success 状态 | 后续接口看似完整 | 单方造合同，直接产生伪 readiness | 不采用 |
| D. 因 exact seam pending 而完全排除相关结构 | 避免猜测 | 丢失 blocked / unavailable / gap 和保守恢复主线 | 不采用；保留 neutral / negative 轮廓 |
| E. 把 BC / LS / 运行角色直接写成模块与进程约束 | 结构直观 | 机械映射架构语义，预设分布式化和物理承载 | 不采用 |
| F. 约束具体语言、存储、消息、registry 或部署产品 | 实施导向强 | 无正式选择 authority，且越过 02 层次 | 不采用；保持语言与产品中立 |

## 8. 结构化中间产物

### 8.1 约束筛选标准

一条内容只有在能直接回答至少一个后续问题时才进入约束表：某项语义是否属于本仓、某组成部分是否越权、某类数据能否进入关键对象、某类接口是否有权形成 positive decision、某条 flow 在何处必须停止、某个状态迁移是否合法、某种恢复是否覆盖历史、某项配置是否改变 owner / pin / gate / dependency 红线。只描述代码质量、产品偏好、物理承载或运维做法的内容一律排除。

### 8.2 约束条件表

| 约束 | 作用范围 | 当前要求 |
|---|---|---|
| `HLC-MI-001` 上游结论只承接、不重写 | 代码主体框架、组成部分、职责、全部轮廓 | 后续结构只下沉已停审正式 00 / 01；不得重新定义需求、owner、BC / LS、数据归属、依赖方向或 ADR 取舍。 |
| `HLC-MI-002` 架构语义不得机械映射物理主体 | 代码主体框架、组成部分、技术承载 | BC-MI-01~05、LS-MI-01~04、责任层和运行角色只提供职责与边界线索；不得预设一对一 service、module、process、database 或 deployment。 |
| `HLC-MI-003` Local truth 与写入权限保持单一 owner | 组成部分、关键对象、接口、处理流、状态 | Definition / revision、intent / attempt / candidate、eligibility、availability 与本地 handoff / gap 只能由相应本仓正式判断形成；入口、adapter、projection、registry 或 consumer 不得直写。 |
| `HLC-MI-004` External truth 只以 body-free 形式向内承接 | 组成部分、对象字段、接口输入、处理流 | Role / mapping、component / seed、policy / evidence、Artifact、consumer 等外部事实只允许正式 ref、safe snapshot、safe conclusion、neutral outcome 或 gap；不得复制外部 semantic / backend body。 |
| `HLC-MI-005` 静态资产、模板、seed 与 live state 严格分离 | 对象、接口、构建输入、状态与异常 | Secret、live memory、checkpoint、workspace live content、runtime / container health 和 observed state 不得进入 definition、baseline、snapshot、candidate、entry 或 projection；缺失不得靠 live fallback 补齐。 |
| `HLC-MI-006` Necessary input 必须完整、immutable、pinned | Definition / revision 轮廓、构建输入、接口 guard、处理流 | 必要 mapping source、component、extras、base、template / seed 与 production entry 均须可验证 pin；禁止 `latest`、mutable selector、guessed version、默认补齐或 partial positive。 |
| `HLC-MI-007` 分阶段事实分别成立 | 对象、接口、处理流、状态机 | Resolved definition / revision、accepted intent、attempt、candidate、eligibility、availability、Artifact handoff 与 consumer / container state 不得压成单一 `ready` 或由前一阶段自动推导后一阶段。 |
| `HLC-MI-008` 外部执行或存储结果不等于领域成功 | Adapter seam、候选形成流、状态与异常 | Scheduler / builder handoff、job success、registry push / presence、callback 或 transport ACK 只能成为可验证输入；candidate、digest、eligibility、availability 必须由本仓规则独立判断。 |
| `HLC-MI-009` Digest、provenance 与 applicable gate 不可拆散或默认通过 | Candidate / qualification 轮廓、接口 guard、处理流、状态 | Digest 必须绑定完整 input / execution / output provenance；applicable gate 由正式 authority 决定，missing / failed / conflict / unknown / unverifiable 时不得形成 positive eligibility。 |
| `HLC-MI-010` Image、Artifact、consumer 与 container 真相分域 | Supply / handoff 组成部分、接口输出、处理流、状态 | Image eligibility / availability 不等于 Artifact formalization、consumer confirmation、launch、container health 或 product readiness；本仓只提供 immutable pinned entry 或显式 gap。 |
| `HLC-MI-011` 六类依赖必须显式分类 | 代码主体框架、组成部分接缝、接口骨架 | Compile 仅允许正式认定的 Core shared contract；runtime / event / ref / adapter / fake 各守权限上限，物理装配、消费、协作或同部署不自动形成源码依赖。 |
| `HLC-MI-012` External carrier 必须经向内边界转译 | 组成部分、接口、处理流 | External DTO / SDK / event / registry / evidence / storage 产品语义不得进入核心判断；边界只能转成已验证的本仓语义、保守结论或 gap，fake 只用于后续测试切口。 |
| `HLC-MI-013` Event 当前仅为 conditional inbound seam | 接口分类、处理流、状态传播 | `MI-UP-005` 关闭前 event lane 为 unavailable / rejected；即使关闭，arrival 也须先验证 authority 才能形成 local intent。当前无 outbound event authority，任何 availability 变化都不得被写成已发布事件。 |
| `HLC-MI-014` 即时本地判断与长时工作分离 | 接口分类、处理流、状态与恢复 | 同步路径只承诺读取或 local accept / reject / transition；build、gate、Artifact handoff、snapshot refresh、projection rebuild 等由延后承接，accepted 不等于 completed。 |
| `HLC-MI-015` 不可验证路径 fail closed，外围故障按 lane 隔离 | 接口失败、处理流、状态、异常 | Missing / stale / conflict / failed / blocked / unknown / unavailable / gap 不得降级为 positive；只冻结受影响的新 decision lane，不回写或删除已成立 history。 |
| `HLC-MI-016` 历史不可覆盖，恢复形成新语境 | Revision / attempt / evaluation / availability 轮廓、状态与恢复 | Retry、rebuild、replace、rollback、retire 或外部恢复必须追加新 revision / attempt / evaluation / transition，或显式 supersede；不得覆写旧 digest、来源、判断和 availability history。 |
| `HLC-MI-017` Late、duplicate、conflict 与 unknown 不得逆写 | 接口输入、处理流、状态与异常 | 后到、重复、冲突或归属不明的 external outcome / confirmation 必须先关联原判断语境；只能 ignored、linked、blocked 或形成新判断输入，不得覆盖较新 truth 或推断成功。 |
| `HLC-MI-018` Projection 与维护读取只读、可重建且显式 freshness | 派生组成部分、查询接口、处理流、异常 | Trace、history view、gap / maintenance summary 只从正式 truth 和受控影子派生；允许 stale / rebuilding / unavailable，不得反写核心状态或成为第二 truth。 |
| `HLC-MI-019` 配置不得改变 owner 或核心红线 | 配置影响、接口 guard、状态与恢复 | 配置可影响 source selection、adapter binding、后台承载和受控策略参数，但不得启用 forbidden body、mutable pin、gate bypass、fail-open、history overwrite、projection writeback、owner takeover 或非 Core compile dependency。 |
| `HLC-MI-020` Pending exact contract 只产生 neutral / negative / gap 边界 | 组成部分接缝、对象、接口、处理流、状态、03 handoff | `MI-UP-001~007` 未闭口时可表达 owner、方向、contract status、neutral carrier 类别与 blocked / unavailable / gap；不得写 exact positive DTO、schema、route、ref mint、compatibility、confirmation 或 success contract。 |
| `HLC-MI-021` Future / conditional scope 不进入 current structure denominator | 代码主体、组成部分、对象、接口、处理流、状态、配置 | `MI-UP-008/009`、`Q-MI-001~004` 只保留 trigger、保持不变量和重开条件；未获 authority 前不得创建 active hardened-base / outbound-event / restricted / multi-arch / product / gate-inventory 结构。 |
| `HLC-MI-022` 概要设计停在语言中立的可落码骨架 | 全部 Step 4~12 输出 | 允许稳定类型类别、职责、关键字段 / 参数类型骨架、接口主语、流与迁移轮廓；禁止完整 schema、protocol、function、DDL、transaction、algorithm、目录、产品与部署设计。 |
| `HLC-MI-023` 设计产物不构成交付或 readiness 证据 | 全部状态、风险、03 handoff 与后续文档引用 | Skeleton、fake、sample、文档 pass、对端进行中草案均不得写成 implemented、integrated、tested、published、accepted 或 ready，也不得伪造 run、digest、report、evidence、verdict 或 signoff。 |

### 8.3 约束到后续 Step 的作用矩阵

| 约束族 | Step 4 / 5 主体与组成 | Step 6 对象 | Step 7 接口 | Step 8 流 | Step 9 状态 | Step 10~12 异常 / 配置 / handoff |
|---|---|---|---|---|---|---|
| 上游与层次 `001~002,022` | 防止架构单元机械物理化 | 只到关键类型骨架 | 不写 exact protocol | 只写责任与数据流轮廓 | 只写合法性轮廓 | 完整实现合同转交 03 |
| Owner / body / static `003~005` | 区分 local owner、external seam、derived read | 判断 truth / ref / snapshot / forbidden field | 限制输入与写权限 | 外部输入只能经边界转译 | External state 不成为 local state | 明确越界错误与 body-free 恢复 |
| Pin / staged decisions `006~010` | 分开 definition、build、qualification、supply 责任 | 不构造单一 ready object | 每类操作只推进本地有权判断 | 每个阶段有独立 guard / stop | 不建立跨 owner 单生命周期 | Missing pin / provenance / handoff 分层 |
| Dependency / interaction `011~014` | 保持向内依赖与 carrier 中立 | External DTO 不污染对象 | Command / Query / conditional Event / Job 分开 | 即时与长时路径分开 | Accepted / completed 分开 | Pending transport 不造 positive contract |
| Failure / history / projection `015~018` | 识别恢复与派生责任边界 | 保留 source / history / freshness 线索 | Late / duplicate / unknown 可表达 | 明确 fail-closed 与新语境恢复 | 禁止逆写和覆盖 | 形成异常、重建和恢复输入 |
| Config / pending / evidence `019~023` | 不因产品或 future scope 扩张主体 | 不造 pending external body | 不造 exact success schema | Gap 是正式分支，不是临时注释 | Pending / blocked 显式 | 03 / 04 承接带 blocker，不写 readiness |

### 8.4 来源映射

| 约束族 | 需求来源 | 架构 / 全局来源 | 转译边界 |
|---|---|---|---|
| `001~005` 上游、owner、body、static / live | C-MI-1~5、BR / D / VETO 的职责与数据红线 | IC-MI-001~005、XC-MI-001、ADR-MI-001/002/007、BC / LS 与数据归属 | 只保留会影响结构归属和字段允许性的部分 |
| `006~010` Pin、staged truth、provenance、分域 | Pinned baseline、构建 / 资格 / 供给需求与否决条件 | IC-MI-006~008、XC-MI-002/003/005/007/008、ADR-MI-003/004 | 不转写完整对象、gate 清单或 success schema |
| `011~014` Dependency、carrier、event、interaction | IF / DEP 与同步 / 后台能力边界 | IC-MI-010/011、XC-MI-006/010、ADR-MI-002/006、全局依赖裁剪规则 | 不把关系转成 package、route、topic 或 deployment |
| `015~018` Failure、history、recovery、projection | NFR / AC / VETO 的保守失败、追溯与可见性 | IC-MI-008/009、XC-MI-003~006、ADR-MI-005 | 不预设 retry 算法、存储和观测 backend |
| `019~023` Config、pending、scope、层次、evidence | 开放条件、非目标与验收真实性边界 | IC-MI-011、XC-MI-009/010、Q-MI / MI-UP、设计真相源与文档规范 | 只控制后续写作权限，不伪造实现事实 |

### 8.5 Pending / future 权限矩阵

| ID | 当前允许进入后续概要 Step | 当前禁止进入后续概要 Step |
|---|---|---|
| `MI-UP-001` | Pinned entry supply direction、consumer contract gap、unavailable / unverifiable | Exact manifest / variant / ref、resolve / confirmation success |
| `MI-UP-002` | Formal pinned member component release ref 方向、missing / incompatible gap | Exact carrier、shape、compatibility report / readiness |
| `MI-UP-003` | Mapping owner / source identity / validity、no fallback、missing / stale / conflict | Exact positive mapping query / snapshot / adapter contract |
| `MI-UP-004` | 已正式认定 Core shared contract 与仓内私有语义 | Image-specific active shared schema 或本地 shadow Core contract |
| `MI-UP-005` | Nightly、conditional event unavailable / rejected、source verification redline | Positive event family / schema / accepted intent from arrival |
| `MI-UP-006` | Owner-neutral pinned template ref / placement、baseline incomplete | Owner-specific seed body / adapter 与 complete positive baseline |
| `MI-UP-007` | Candidate handoff attempt、image eligibility / Artifact gap 分层 | Formal Artifact ref / version / lineage mint 与 handoff success |
| `MI-UP-008` | Future trigger、Sandbox owner / static-live 红线 | Current hardened-base input、derivation、qualification |
| `MI-UP-009` | Current absence 与 availability history 独立性 | Outbound build / publish event、delivery / observation success |
| `Q-MI-001` | Conditional trigger、不改变 Role / governance truth | Active restricted / read-only variant dimension 或 Role 清单 |
| `Q-MI-002` | 单一受控 current dimension、平台中立 | Active multi-architecture identity、枚举、完成率 |
| `Q-MI-003` | Product-neutral adapter / carrier 影响类别 | Builder / registry / evidence 产品、供应商、部署或 compatibility 结论 |
| `Q-MI-004` | Authority-driven applicable gate、missing / unknown fail closed | BOM / scan / signature 当前 inventory、priority、pass / evidence claim |

一个 seam 或决策关闭只解除该项受影响的设计上限，不推导其他 MI-UP / Q、实现、集成、测试或 readiness 同时成立。关闭后必须以正式 owner 输入重开受影响 Step，并完成双侧或多侧校准；不得在原表中静默替换 placeholder。

### 8.6 排除项

| 排除内容 | 不进入原因 | 正确承接位置 |
|---|---|---|
| 代码清晰、高内聚、低耦合、可维护、可扩展等口号 | 不能改变任何具体结构判断 | 通用工程规范，不作为本章领域约束 |
| Rust / Go / Python、framework、crate / package / directory | 无 language / implementation authority，且过早物理化 | 03 / 07 与实现仓正式决定 |
| Database、index、transaction、queue、cache、object storage、registry layout | 属于物理与详细设计 | 03；配置项由 04 承接 |
| HTTP / gRPC / UDS / JSON / proto / event family、route、topic、payload | Exact contract 未闭口且属于接口详细设计 | 03 与正式 owner contract |
| Retry / idempotency / concurrency / timeout 算法与 key 格式 | 本 Step 只锁 fail-closed、history 和判断语境 | 03 详细设计 |
| SLA / SLO、时延、吞吐、容量、大小、保留期与资源数字 | 无 workload / measurement baseline | 后续正式非功能变更、05 / 06 / 07 |
| Deployment topology、microservice、worker、HA、multi-region、autoscaling | 架构只允许 evidence-driven 演进 | 未来正式架构变更与 07 |
| Config key、default、precedence、secret source、profile | 本 Step 只锁不可配置化红线 | 04 配置设计 |
| Test case、fixture、fake 实现、report、evidence alias、verdict | 不是概要结构约束，也尚无执行事实 | 05 / 06 / 07 与真实实施流程 |

## 9. 回填草稿

以下只作为未来正式第 3 章候选输入；正式 `02-概要设计.md` 仍须等 Step 14 装配。

### 9.1 约束边界说明候选

概要设计必须在已停审的需求与架构边界内，把成员镜像资产及供给职责下沉为可落码骨架。若 owner、静态与运行态、pin、分阶段事实、依赖 seam、历史和 pending 权限不先钉住，后续主体、对象、接口、流程与状态就会串入相邻 truth 或提前落到实现层；因此本章只保留能直接改变结构判断的硬约束。

### 9.2 正式表格候选

- 正式第 3 章的固定三列表以 §8.2 为唯一候选；Step 14 可按 owner / truth、static / pin、staged decisions、dependency / interaction、history / recovery、pending / layer 分组，但编号和语义不得改变。
- §8.3~§8.6 属 calibration 审计材料，不整段搬入正式正文；只有为解释某条约束所必需的最小来源或 pending 注记才可回填。
- 正式第 3 章不得命名 Step 4 以后才允许收稳的代码主体、对象、接口、处理流或状态，也不得把 MI-UP / Q 转成 positive contract。

## 10. 待确认事项

| 待确认项 | 当前判断 | 状态 |
|---|---|---|
| 是否把 BC / LS 直接作为模块约束 | 否；它们是语义边界，只能作为 Step 4 映射输入 | `adopted_for_step_03` |
| 是否因镜像承载 component / seed 正文而取得语义 owner | 否；物理 materialization 不转移 owner，本仓只持 pin / ref / binding / safe conclusion | `adopted_for_step_03` |
| 是否允许单一 ready 状态覆盖整条主线 | 否；definition、candidate、eligibility、availability、Artifact、consumer / container 分别成立 | `adopted_for_step_03` |
| 是否允许对 pending seam 命名 neutral / negative 轮廓 | 允许且必要；exact positive schema / success contract 继续 blocked | `adopted_for_step_03` |
| Sibling 进行中 02 是否关闭 MI-UP-001/002 | 否；只能作为 pending 状态刷新，不是双方已停审 exact contract | `keep_open` |
| 是否在本 Step 决定具体主体、对象、接口、流或状态 | 否；本步只锁判断规则，具体结构从 Step 4 串行展开 | `deferred_to_later_steps` |

本 Step 不新增业务待决策 ID，不关闭 `MI-UP-001~009`、`Q-MI-001~004`，也不声明 implementation / integration / test / evidence / acceptance / readiness。当前没有阻塞 Step 4 代码主体框架讨论的新增上游冲突；开放项继续阻塞受影响 positive expansion。

## 11. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 已明确会直接影响后续主体、对象、接口、流、状态的硬约束 | `pass` |
| 每条约束均有具体作用范围与当前要求 | `pass` |
| 已区分需求、架构 / 全局来源与本步转译边界 | `pass` |
| 已覆盖 owner、body、static / live、pin、staged truth、dependency、interaction、history、projection、pending 与层次 | `pass` |
| MI-UP-001~009、Q-MI-001~004 权限上限完整且未伪关闭 | `pass` |
| 未写产品、协议字段、数据库、部署、算法、配置键或泛化工程口号 | `pass` |
| 未命名具体代码主体、对象、接口、处理流或状态 | `pass` |
| 未读取 / 修改旧正式 02，未创建 Step 4~14 文件 | `pass` |

`gate_status = pass_stop_review`。Step 3 内容足以支撑 Step 4“代码主体框架映射”，但当前必须停审。只有用户再次明确确认后，才允许按恢复顺序重读 ledger、02 flow 与本文件，读取概要设计 SOP Step 4 / 书写规范“代码主体框架”章节并创建 `02_hld_step_04_code_subject_framework.md`；不得同时进入 Step 5、正式 02、03 或 commit。
