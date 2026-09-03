# L2-member-images 02 概要 Step 2: 明确本仓设计目标与当前范围

> 创建日期: 2026-08-23
> 状态: `completed_stop_review`
> 当前模式: `full-restart`
> 回填位置: 正式 `02-概要设计.md` 第 2 章
> 当前限制: 未读取、删除或修改旧正式 `02-概要设计.md`；未创建 Step 3~14 文件

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 用户授权 | 用户以“同意”“继续”明确通过 Step 1 审阅门；本次只授权执行 Step 2 |
| 恢复顺序 | 已重读 `project_execution_ledger.md`、`02_hld_calibration_flow.md`、`02_hld_step_01_upstream_boundary.md` |
| 规范输入 | 已重读概要设计 SOP Step 2、书写规范“本次设计目标与范围”及 Runtime / Governance 已完成 Step 2 粒度参考 |
| 本步输入 | Step 1 上游关系映射、不再回答 / 必须回答清单、Stable / pending / blocked 分层，以及正式 00 / 01 的 current core / conditional / excluded 边界 |
| 本步目标 | 明确本轮概要设计必须收稳哪些结构、停在何种深度、交给 03 什么，以及哪些内容不进入当前概要范围 |
| 本步禁止 | 重写需求 / 架构；命名具体代码主体、对象、接口、处理流或状态；写完整字段 / 函数 / schema / DDL / 时序；读取旧正式 02 |
| 用户门禁 | 本 Step 完成后立即停审；未经再次明确确认，不进入 Step 3 |

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `goals_scope` | `pass_stop_review` | 结构目标、当前范围、非范围、概要深度、03 交付和 pending seam 权限上限均已收口；未提前拆结构或写实现契约 | 等待用户确认；确认后重读三层台账与本文件，再创建 Step 3 | `02_hld_step_01_upstream_boundary.md`;正式 `00-需求文档.md`;正式 `01-架构设计.md`;概要设计 SOP / 书写规范 |

## 2. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| Step 1 输入承接 | `done` | 不再回答 / 必须回答、输入稳定性与 blocked positive expansion | `pass` |
| Sibling 状态刷新 | `done` | Member / Member Service 已停审架构方向与 exact contract gap 分层 | `pass` |
| 结构目标收口 | `done` | 设计目标表、03 交付结果与文档级验证方式 | `pass` |
| 当前范围分层 | `done` | Current core / blocked-aware / conditional / excluded | `pass` |
| 非范围收口 | `done` | 每项明确归属层及不进入原因 | `pass` |
| 设计深度收口 | `done` | 代码主体、对象、接口、流、状态、异常、配置与 handoff 的允许 / 禁止深度 | `pass` |
| 回填草稿与门禁 | `done_stop_review` | 正式第 2 章候选输入；Step 3 前置条件 | `pass_stop_review` |

## 3. 本步输入与状态刷新

| 输入 | Step 1 状态 | Step 2 承接 | 当前限制 |
|---|---|---|---|
| `stable_local_requirement` | C-MI-1~5 与核心 F / BR / D / IF / DEP / NFR / AC / VETO 可直接承接 | 用于判断哪些结构轮廓必须进入本概要 | 不把功能项逐条重写成设计目标 |
| `stable_local_architecture` | BC-MI-01~05、LS-MI-01~04、运行角色、责任层、数据 / 一致性 / 交互 / 机制稳定 | 用于确定结构目标与深度，不用于机械命名代码主体 | 不重开架构边界、取舍或部署决定 |
| `stable_invariant` | Owner、pin、static / live、staged decisions、body-free、history、fail-closed、truth / projection 稳定 | 作为全部结构目标的范围红线 | 正式约束表由 Step 3 独立收口 |
| `pending_exact_authority` | MI-UP-001~007 | 纳入 neutral seam、contract status、negative / gap-aware 结构范围 | 不纳入 exact positive DTO / protocol / success contract |
| `future_or_absent_authority` | MI-UP-008/009 | 只保留风险 / 演进触发说明 | 不进入 current code / object / interface / flow / state 分母 |
| `pending_formal_decision` | Q-MI-001~004 | 只保留 product-neutral / authority-driven 边界 | 不形成 active variant dimension、产品或 gate inventory |
| `implementation_status_not_input` | 任何实现 / 测试 / evidence / readiness | 完全不作为概要正向范围依据 | 设计 pass 只验证文档结构 |

### 3.1 Sibling 状态刷新

Step 1 完成后，`L2-member-service` 正式 `01-架构设计.md` 已完成并获用户确认进入 02；其当前 02 正在推进。正式 01 可稳定承接以下方向：Member Service 消费 pinned instantiable supply、不得直接解析 Role -> image mapping、exact handoff 或 ref 不可验证时 host assembly / launch blocked、container lifecycle 与 host truth 仍归 Member Service。

该状态变化不关闭 `MI-UP-001`：Member Service 正式 01 及最新台账仍将 exact pinned image ref / manifest / digest / verification / provenance / confirmation contract 记为 `Q-MS-003` / `MSVC-UP-003` pending。本仓与对端当前只有相互一致的 owner、方向和 fail-closed 上限，没有双方 exact contract。`L2-member` 正式 01 同样只稳定 pinned member component release 方向，`MI-UP-002` 的 shape / compatibility 继续 pending。

因此不回写已停审 Step 1 的历史快照；本 Step 把新的 formal status 作为范围输入记录，并在 flow / ledger 中更新 current sibling 状态。

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 本次概要设计最主要要把哪些结构说清？ | 说清架构语义如何下沉为代码主体框架与主要组成部分；各部分的职责 / 非职责 / inward seam；本地 truth、external shadow / ref / gap、history 与 projection 的关键对象轮廓；Command / Query / conditional inbound Event / Operations Job 和 adapter / ref 接口骨架；关键处理流、局部状态机、异常、配置影响及 03 承接。 |
| 2. 停在什么深度才足以进入详细设计？ | 停在“可落码骨架层”：后续 Step 可点名稳定代码主体 / 组成部分 / 对象 / 接口 / 流 / 状态；对象含关键字段及类型骨架、状态和函数骨架，接口含输入输出主语与失败语义，流含参与责任和关键数据流，状态含合法 / 禁止迁移。完整 schema、实现、物理存储、事务 / retry 算法和文件布局留给 03。 |
| 3. 哪些内容属于本次概要设计范围？ | C-MI-1~5 current core 的结构承接，BC-MI-01~05 / LS-MI-01~04 的非机械实现映射，正式状态 / derived read 分离，六类 seam，local decision / background handoff，negative / blocked / gap / unknown 分支，异常与恢复轮廓、配置影响和详细设计 handoff。 |
| 4. 哪些内容相关但当前不进入范围？ | 相邻 owner truth / body / lifecycle，MI-UP-008/009 与 F-MI-E01~E05 active structure，Q-MI-001~004 active detail，具体产品 / provider / language / framework / DB / queue / protocol / topology / capacity numbers，以及 marketplace / product / UI / observability backend。 |
| 5. 哪些内容留给详细设计？ | 完整 type / trait / DTO / event schema、字段全集、函数签名与实现、serialization、repository / transaction / UoW、idempotency / concurrency / retry 算法、错误码 / mapping、adapter 实现与 fake parity 的 exact contract、物理目录与 persistence 细节。 |

## 5. 当前文档问题诊断

| 当前材料现象 | 范围风险 | 本 Step 处置 |
|---|---|---|
| 正式 00 以五节点能力和大量 F / BR / D / IF / NFR / AC 表达 | 若机械搬入 02，会把概要目标写成功能清单或验收第二版 | 只提炼实现结构目标，不重复需求编号明细 |
| 正式 01 已有 BC / LS、运行角色和责任层 | 若直接把名称当代码模块，会在 Step 4 前锁死 service / database 拆分 | 只将其作为映射输入；代码主体由 Step 4 独立判断，允许多对多与同置 |
| Candidate、eligibility、availability 与 external handoff / consumer 状态均已分层 | 若把概要范围写成单一 image lifecycle，会抹去 owner 和 failure 边界 | 将 staged local decisions 与跨 owner gap 分层作为范围必答，不预设单状态机 |
| 两个 sibling 正式 01 均已停审，但 exact 双侧合同仍 pending | 容易把“架构方向一致”升级为接口 ready | Exact positive contract 继续 blocked；只允许 neutral interface skeleton 和 conservative failure |
| 规范要求概要对象 / 接口达到类型骨架深度 | 过浅会让 03 重建主结构，过深会抢占完整 contract | 允许关键字段 / 参数的类型骨架，禁止全集、schema、实现和物理细节 |
| F-MI-E01~E05、MI-UP-008/009、Q-MI-001~004 与核心主线相关 | 易被写成 current feature / module 愿望池 | 只保留 conditional / future trigger 与红线，不进入 current denominator |
| 旧正式 02 仍在工作区 | 读取后可能让旧对象、产品、状态或数字预设范围 | 本 Step 继续不读取；Step 14 后置污染审计前不获 authority |

## 6. 改动前后对比

| 维度 | Step 2 前 | Step 2 后 |
|---|---|---|
| 设计目标 | Step 1 只有“本文必须回答”的问题清单 | 九类结构轮廓已转为设计目标和 03 交付结果 |
| 当前范围 | Stable / pending / blocked 只说明输入权限 | Current core、blocked-aware、conditional / future、excluded 四层范围明确 |
| 深度 | 仅知道不能提前设计具体结构 | 已明确后续 Step 可写的骨架粒度和必须留给 03 的完整契约 |
| Sibling | Member stable，Member Service 架构 pending | 两者架构方向均可稳定承接；MI-UP-001/002 exact contract 均保持 pending |
| 非范围 | Step 1 只列“暂不进入”线索 | 每项明确归属 00 / 01 / 03 / 04 / 05 / 06 / 07 / 相邻 owner / future scope |
| Readiness | Input status 与文档 pass 可能被混读 | 文档验证只检查结构是否收稳，不产生实现、测试、evidence 或 readiness 事实 |

## 7. 设计取舍

| 方案 | 优点 | 缺点 / 风险 | 结论 |
|---|---|---|---|
| A. 只说明各架构语义和术语 | 文档较短 | 03 仍需重新发现代码主体、对象、接口、流与状态 | 不采用 |
| B. 下沉到语言中立的可落码骨架，同时保留 exact contract blocker | 足以支撑 03，又不替 owner 或详细设计造字段 / 协议 | 后续 Step 必须逐项维护 contract status 与 gap | 采用 |
| C. 在 02 直接写完整类型、DTO、repository、transaction 和算法 | 对实现看似直接 | 抢占 03，且会在 MI-UP 未闭口时伪造合同 | 不采用 |
| D. 把 conditional enhancement 一并设计为 current structure | 看似覆盖未来 | 扩大完成分母，预设未获 scope 的对象 / 接口 / 状态 | 不采用 |
| E. 因 external positive seam blocked 而只做 local happy path | 避开未定合同 | 丢失真实 failure / gap，详细设计不可落码 | 不采用；negative / gap-aware skeleton 属 current scope |
| F. 以每个 BC 建一个 service / store | 映射直观 | 违反 BC 语义边界不机械映射物理单元的架构决定 | 不采用；Step 4 重新判断代码主体 |

## 8. 结构化中间产物

### 8.1 当前范围分层

| 范围层 | 纳入内容 | 本轮展开上限 | 不表示 |
|---|---|---|---|
| `current_core_structure` | C-MI-1~5，BC-MI-01~05 / LS-MI-01~04，正式 truth / derived read、同步 / 后台角色与六类 seam | 完成代码主体、组成部分、对象、接口、流、状态、异常、配置影响与 03 handoff 骨架 | 实现、部署、build、digest、evidence、test 或 readiness 已存在 |
| `current_blocked_aware_structure` | MI-UP-001~007 影响的 source / component / event / seed / Artifact / consumer 边界 | Neutral boundary、contract status、negative / unavailable / gap / fail-closed 与 reopen trigger | Exact positive DTO、protocol、adapter、ref 或 success path ready |
| `conditional_future_reference` | F-MI-E01~E05、MI-UP-008/009、Q-MI-001~004 | 只记录影响面、保持不变量、触发后需重开哪些 Step | Active capability、代码主体、对象、接口、flow、state、配置或完成分母 |
| `excluded_external_truth` | Role / member / runtime / tools / Artifact / container / Sandbox / governance / observability / product truth 与 forbidden body | 只以正式 ref / snapshot / safe conclusion / gap 出现在边界轮廓 | 本仓拥有正文、生命周期或写入 authority |
| `excluded_delivery_fact` | 实现仓、commit、run、artifact digest、report、evidence、测试、verdict、signoff、readiness | 不进入 02 任何正向结论 | 文档 gate 可替代系统 evidence |

### 8.2 设计目标表

| 目标 | 说明 | 交付给详细设计的结果 |
|---|---|---|
| 收稳代码主体框架 | 将架构语义、责任层和运行角色映射为可实现主体，同时明确 BC / LS 不与物理单元一一对应 | 稳定的代码主体类别、职责、允许依赖方向和后续物理细化边界 |
| 收稳主要组成部分 | 明确业务主要部分、每部分 capability、职责 / 非职责、包含的代码主体候选和彼此接缝 | 可按主要部分继续展开的实现合同边界与跨部分依赖 |
| 收稳关键对象轮廓 | 从本地 truth、受控影子 / ref、history、gap 与 derived read 中筛选关键对象，不复制 external body | 对象类型、责任、关键字段及类型骨架、状态、函数骨架和禁止事项 |
| 收稳接口骨架 | 区分 Command、Query、conditional inbound Event、Operations Job 与 external ref / adapter seam，并携带 contract status | 稳定操作主语、输入输出类型骨架、写入 / 读取来源、失败语义及 blocked contract 标记 |
| 收稳关键处理流 | 说明重要工作如何经过入口、application coordination、local decision、persistence / port、projection / handoff | 可继续展开为函数 / transaction 设计的主路径、decision point、failure branch 与 owner handoff |
| 收稳局部状态与传播 | 为各本地 decision context 分别收稳状态集合、guard、合法 / 禁止迁移和跨 owner gap，不建立单一 ready lifecycle | 状态类型、迁移矩阵输入、late / duplicate / unknown 处理和 projection 传播边界 |
| 收稳异常与恢复轮廓 | 把 missing / stale / conflict / failed / blocked / unknown / unavailable / gap 与 history-preserving recovery 落到责任部分 | 错误模型、恢复前提、不可重试红线和补偿 / 新语境设计输入 |
| 收稳配置影响轮廓 | 识别哪些部分 / seam 受配置影响，哪些 owner、pin、gate、history、body-free 与 state redline 禁止配置化 | 03 的配置 contract 候选与 04 的配置项设计输入，不预设 key / value / product |
| 收稳详细设计承接和开放条件 | 汇总已收稳主体与 MI-UP / Q 影响，说明哪些可进入 03、哪些必须等待 owner / scope | 逐项可审计的 03 handoff、blocked / conditional 标记和设计重开条件 |

### 8.3 目标验证表

| 目标组 | 文档级验证方式 |
|---|---|
| 代码主体 / 主要组成部分 | Step 4 / 5 的映射和职责表可双向追溯正式 01，且无 BC -> service / database 机械映射 |
| 对象 / 接口 | Step 6 / 7 每个正式骨架有 owner、所属部分、边界和 contract status；external body 与 pending exact schema 未进入 |
| 处理流 / 状态 | Step 8 / 9 覆盖 current core 的关键判断与 failure branch，staged decisions 和 external gaps 未压成单 lifecycle |
| 异常 / 配置 | Step 10 / 11 能定位责任、恢复与禁止配置化边界，不写 error code 全集或 config key / value |
| 03 承接 / 风险 | Step 12 / 13 能反查所有正式骨架与 MI-UP-001~009、Q-MI-001~004，无 orphan 或伪 closure |

以上验证只判断概要设计文档是否把结构讲清，不是测试、验收、实现或 readiness 验证。

### 8.4 非范围表

| 非范围 | 留给哪一层 |
|---|---|
| 需求目标、用户故事、功能优先级、业务规则与验收条件的重新定义 | `00-需求文档.md`；这些已由需求层收稳，概要只承接，不重写 |
| 系统上下文、BC / LS 划分、owner、依赖方向、数据所有权、技术机制与方案取舍的重开 | `01-架构设计.md`；只有新 authority 或冲突才按变更门禁回开 |
| Role / mapping、member、runtime loop、tools execution / capability、Artifact、container / host、Sandbox、governance、observability、marketplace / product truth | 对应相邻仓；本仓只设计正式 ref / snapshot / safe conclusion / gap 的消费边界 |
| Secret、live memory、checkpoint、workspace live content、observed / external semantic / backend body | 对应运行、安全和相邻 owner；这些内容禁止进入本仓静态 truth 或 build input，不是待实现项 |
| 完整对象字段全集、完整 enum / value object / trait / DTO 定义与 serialization | `03-详细设计.md`；02 只收关键字段与类型骨架 |
| 完整函数签名 / 实现、伪代码、调用链、transaction / UoW、repository、concurrency / idempotency / retry 算法 | `03-详细设计.md`；02 只收函数和处理流骨架 |
| HTTP / gRPC / UDS / event / JSON / proto 等完整协议、route / topic、payload 与 error schema | `03-详细设计.md` 和正式 owner contract；MI-UP 未闭口时 exact positive schema blocked |
| Database / index / migration / outbox / cache / queue / object storage / registry layout 等物理设计 | `03-详细设计.md` / 实施层；架构当前也未选定产品或物理拓扑 |
| 配置 key、类型、默认值、来源优先级、secret source、profile、动态加载与示例 | `04-配置设计.md`；02 Step 11 只识别影响轮廓和禁止配置化边界 |
| 测试矩阵、fixture、fake 实现、环境、命令、报告与执行结果 | `05-测试方案.md` / 实施阶段；02 只给 03 测试切口输入 |
| 验收 gate、evidence alias、verdict、signoff 与实际 readiness | `06-验收标准.md` / 真实验收流程；设计门禁不替代系统证据 |
| 实现语言 / framework、目录 / crate / package、commit / batch、CI / deployment / rollout / operations | `07-实施计划.md`、目标实现仓与运维层；当前不实现、不排期、不提交 |
| Builder / registry / scanner / signer / evidence backend 的具体产品与兼容矩阵 | Q-MI-003 对应的后续正式 authority、03 / 04 / 07；当前保持 product-neutral |
| 固定 Role / variant / architecture / gate kind 清单和 SLA / SLO、时延、吞吐、大小、容量、保留期数字 | Role / scope / policy owner与需求变更流程；当前无 authority / measurement baseline |
| Restricted / multi-arch / fast rebuild / hardened base / usage summary 的 active 结构 | Future scope；F-MI-E01~E05、Q-MI-001/002、MI-UP-008 正式启用后重开受影响 Step |
| Outbound build / publish event、full event sourcing / replay / outbox 的 active 结构 | MI-UP-009 与正式 replay requirement / architecture decision；当前无 outbound authority |
| 旧正式 `02-概要设计.md` 的名称、对象、状态、产品、数字和完成结论 | Step 14 后置 historical pollution audit；在此之前不是设计输入，审计后仍须由新版 Step 1~13 独立来源支撑 |

### 8.5 当前阶段设计深度口径

| 设计面 | 本轮概要设计必须达到 | 明确不进入 |
|---|---|---|
| 代码主体框架 | 点名稳定代码主体 / 模块候选的类型、职责、归属、允许依赖与架构映射 | 文件树、crate / package 物理布局、语言 / framework、部署拆分 |
| 主要组成部分 | 明确 capability、职责 / 非职责、内部代码主体候选、对象发现线索和跨部分接缝 | 完整实现合同、资源配置、service / database 一一映射 |
| 关键对象 | 点名对象类型、责任、关键字段名称与类型骨架、状态集合、成员 / 工厂函数及参数 / 返回类型骨架、禁止事项 | 字段全集、serialization、validation 算法、完整实现代码 |
| API / 接口 | 点名分类、稳定操作主语、输入 / 输出类型骨架、主要处理、读写结果、owner 与 contract status | 完整 DTO / payload / route / topic / protocol、错误码全集；pending seam 的 positive schema |
| 关键处理流 | 明确入口、application coordination、domain decision、repository / port / projection / handoff 的责任和关键数据流、主要失败分支 | 逐调用时序、完整伪代码、transaction / retry / concurrency 算法 |
| 状态与传播 | 分别列出本地状态集合、触发、guard、合法 / 禁止迁移、late / duplicate / unknown 与 derived propagation 轮廓 | 单一跨 owner lifecycle、完整状态机实现、持久化编码与外部 owner 状态复制 |
| 异常与恢复 | 覆盖关键错误类别、处理归属、fail-closed、history-preserving recovery 与 reopen condition | 完整 error enum / code / message、运维脚本、补偿执行步骤 |
| 配置影响 | 识别受影响部分 / seam、影响类型、03 / 04 交接和禁止配置化边界 | 配置 key / type / default / source / profile / product 与动态生效实现 |
| 详细设计承接 | 每个正式骨架都能映射到 03 展开项、上游来源、blocker / conditional 状态和测试切口 | 03 正文、实现任务、测试用例、验收 verdict 或 commit boundary |

本轮概要设计的最小完整链为：架构输入 -> 代码主体框架 -> 主要组成部分 -> 关键对象 / 接口 -> 处理流 / 局部状态 -> 异常 / 配置影响 -> 03 handoff / 风险。这里是结构充分性顺序，不是运行时 pipeline、实现排期或单一状态生命周期。

### 8.6 Pending seam 的范围上限

| 条件 | 当前纳入 02 | 当前不得纳入 02 | 关闭后的动作 |
|---|---|---|---|
| MI-UP-001~007 未关闭 | Owner / direction、neutral boundary、contract status、negative / blocked / unavailable / gap 与 local invariant | Exact positive carrier / DTO / schema / ref mint / success / compatibility / confirmation | 必须重开受影响 Step 3~13 并做双方校准，不自动替换 placeholder |
| MI-UP-008/009 未获 authority | Future trigger、保持不变量和 current absence | Hardened-base / outbound-event active主体、对象、接口、流、状态、配置 | 先重开 scope；必要时回开 00 / 01，再重走受影响概要 Step |
| Q-MI-001/002 未裁定 | Conditional scope 及不改变 Role / governance truth 的红线 | Restricted / multi-arch current dimension、枚举和完成率 | 正式裁定后先重开 Step 2，再判断后续影响 |
| Q-MI-003 未裁定 | Product-neutral adapter / carrier 影响类别 | 产品、供应商、部署、registry layout 与兼容结论 | 由正式 authority 决定后重开 Step 11 / 03 / 04 / 07 相关边界 |
| Q-MI-004 未裁定 | Authority-driven applicable gate 与 fail-closed | 当前 BOM / scan / signature 清单、priority、pass / evidence claim | Owner 裁定后重开 Step 3 / 6~13 受影响内容 |

## 9. 回填草稿

以下只作为未来正式第 2 章的候选输入；正式 `02-概要设计.md` 仍须等 Step 14 装配。

### 9.1 范围短文候选

本次概要设计只收稳进入详细设计所必需的可落码结构骨架：代码主体框架、主要组成部分、关键对象、接口、处理流、局部状态、异常、配置影响和详细设计承接。它覆盖 C-MI-1~5 的 current core 与 pending seam 的 neutral / negative / gap-aware 边界，不把 conditional enhancement、相邻 owner truth、完整实现契约或交付事实写入当前范围。

### 9.2 正式表格候选

- 正式第 2 章的设计目标表以 §8.2 为候选；Step 14 装配时同时依据 §8.3 保留文档级验证口径。
- 正式第 2 章的非范围表以 §8.4 为候选；“留给哪一层”单元格同时承担不进入原因，不能缩写成“以后再看”。
- 当前阶段设计深度以 §8.5 为候选；§8.6 作为 pending / conditional 范围上限，不得转写为 positive contract。
- 本章禁止画图，不重复上游需求或架构表，不提前列出具体代码主体、对象、接口、flow 或 state 名称。

## 10. 待确认事项

| 待确认项 | 当前判断 | 状态 |
|---|---|---|
| 本轮是否下沉到可落码骨架层 | 是；只做架构解释不足以支撑 03，完整实现合同又会越界 | `adopted_for_step_02` |
| Pending exact seam 是否完全排除 | 否；neutral boundary、contract status、negative / gap-aware 骨架属于 current scope，exact positive detail blocked | `adopted_for_step_02` |
| Conditional enhancement 是否建立 inactive 对象 / 接口占位 | 否；只记录 trigger 和保持不变量，避免 current denominator 膨胀 | `adopted_for_step_02` |
| Sibling 正式 01 停审是否关闭 MI-UP-001/002 | 否；只稳定 owner / direction，双方 exact contract 仍由各自台账显式 pending | `keep_open` |
| 是否在本 Step 决定约束清单 | 否；本 Step 只锁目标 / 范围 / 深度，硬约束由 Step 3 独立收口 | `deferred_to_step_03` |

本 Step 不新增业务待决策 ID，不关闭 `MI-UP-001~009`、`Q-MI-001~004`，也不声明 implementation / integration / test / evidence / acceptance / readiness。当前没有阻塞 Step 3 约束讨论的新增上游冲突。

## 11. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 已明确本概要必须收稳哪些结构 | `pass` |
| 已明确 current core、blocked-aware、conditional / future 与 excluded 层 | `pass` |
| 已明确每个设计目标交给 03 的结果和文档级验证方式 | `pass` |
| 已明确概要设计停在可落码骨架层 | `pass` |
| 已明确非范围项及其所属层 / 不进入原因 | `pass` |
| 已保留 MI-UP-001~009、Q-MI-001~004 的范围上限 | `pass` |
| 未命名具体代码主体、对象、接口、处理流或状态 | `pass` |
| 未读取 / 修改旧正式 02，未创建 Step 3~14 文件 | `pass` |

`gate_status = pass_stop_review`。Step 2 内容足以支撑 Step 3“收稳约束条件”，但当前必须停审。只有用户再次明确确认后，才允许按恢复顺序重读 ledger、02 flow、Step 2，读取 SOP Step 3 / 书写规范第 3 章并创建 `02_hld_step_03_constraints.md`；不得同时进入 Step 4、正式 02、03 或 commit。
