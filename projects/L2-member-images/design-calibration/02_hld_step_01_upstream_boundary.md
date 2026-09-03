# L2-member-images 02 概要 Step 1: 确认上游输入边界

> 创建日期: 2026-08-23
> 状态: `completed_stop_review`
> 当前模式: `full-restart`
> 回填位置: 正式 `02-概要设计.md` 第 1 章；仅为第 2、3 章提供前置输入
> 当前限制: 未读取、删除或修改旧正式 `02-概要设计.md`；未创建 Step 2~14 文件

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 用户授权 | 2026-08-23 用户明确“我同意 现在进入02”；授权解除正式 01 的文档切换门禁，不等于批准 Step 2、正式 02、03、实现或 commit |
| 当前恢复来源 | `project_execution_ledger.md`、正式 00 / 01、`01_architecture_calibration_flow.md`、`01_arch_step_16_formal_document_assembly.md` |
| 规范输入 | 概要设计 SOP、概要设计书写规范、设计文档通则、中间产物规范、真相源闭环标准、全局依赖裁剪规则 |
| 专项复核 | Runtime、Tools、Method Library、Artifact、Sandbox、Core 当前正式链 / 台账；`L2-member` / `L2-member-service` 最新正式状态；Governance 概要粒度参考 |
| 本步目标 | 确认哪些需求 / 架构结论足以支撑后续概要设计，哪些只能维持 pending、blocked、future 或 gap |
| 本步禁止 | 重定义需求 / 架构；读取旧正式 02；命名代码主体、对象、接口、处理流或状态机；补 exact schema、产品、数字或 readiness |
| 用户门禁 | 本 Step 完成后立即停审；未经再次明确确认，不进入 Step 2 |

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `upstream_boundary` | `pass_stop_review` | 上游关系、Stable / pending / blocked 分层、不再回答 / 必须回答清单均已闭合；开放 exact seam 未被伪关闭，也未提前进入结构设计 | 等待用户确认；确认后先重读 ledger、02 flow 与本文件，再创建 Step 2 | 正式 `00-需求文档.md`;正式 `01-架构设计.md`;概要设计 SOP / 书写规范;专项上游正式链与台账 |

## 2. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| 需求输入确认 | `done` | 五节点能力、核心需求命名空间、owner / data / seam / negative boundary | `pass` |
| 架构输入确认 | `done` | BC / LS、运行角色、责任层、数据一致性、交互、机制与演进上限 | `pass` |
| 专项上游与 sibling 状态刷新 | `done` | Current formal / pending / implementation-not-authority 状态快照 | `pass` |
| 输入稳定性与正向上限分层 | `done` | Stable / pending / blocked / future 映射 | `pass` |
| 上游关系映射 | `done` | 来源 -> 承接内容 -> 后续概要展开方向 | `pass` |
| 不再回答 / 必须回答清单 | `done` | Step 1 固定输出 | `pass` |
| 回填草稿与门禁 | `done_stop_review` | 正式第 1 章候选输入；Step 2 前置条件 | `pass_stop_review` |

## 3. 本步输入与读取结论

| 必读输入 | 当前状态 | 本步提取结果 | 不得推导 |
|---|---|---|---|
| 正式 `00-需求文档.md` | 本项目需求校准完成并已通过文档切换门禁 | C-MI-1~5、F / BR / D / IF / DEP / NFR / AC / VETO、MI-UP / Q 与 full-restart 边界 | 代码结构、接口 schema、实现或验收已发生 |
| 正式 `01-架构设计.md` | Step 16 完成并经用户确认进入 02 | BC-MI-01~05、LS-MI-01~04、运行角色、责任层、六类 seam、data / consistency / interaction / mechanism / risk | BC 到 service / module / DB 的一一映射，或 exact transport / product |
| ADR-0005 | accepted / scoped | 构建期预装、nightly、Role mapping owner、production pin 与禁 `latest` | 固定 Role / 工具清单、镜像数量、CI / registry 产品、时延或 readiness |
| Runtime / Tools 正式 00~07 与台账 | 正式设计链已停审；实施仍不构成本仓输入事实 | Runtime loop、live memory / checkpoint、Tools contract / execution 等排除边界；未来只消费正式静态 component ref | 已存在本仓可用 release、联调、构建或 compatibility evidence |
| Method Library 正式 00~07 与台账 | Role / method owner 设计基线；当前 implementation blocker 与本仓设计输入分层独立 | RoleDefinition、method / role 资产关系及 mapping owner 方向 | Exact body-free consumer surface、实现 readiness 或本地 mapping copy |
| Artifact 正式 00~07 与台账 | Artifact owner 设计基线 | Artifact / version / lineage / baseline owner 与正式 ref / gap 分层 | Image handoff schema 已闭口、formal ref 已签发或 Artifact truth 可由本仓创建 |
| Core / Bus 当前正式边界 | Shared contract / event authority | 仅正式 Core shared contract 可 compile；Bus 只保留 conditional inbound 方向 | Image-specific shared schema、event family / payload、outbound event 已获授权 |
| Sandbox 正式 00~07 与台账 | Sandbox owner 边界；当前状态不构成本仓 readiness | Sandbox policy / backend / execution 外置，hardened base 仅 future ref 候选 | Current hardened-base capability、isolation 或构建资格已成立 |
| `L2-member` 正式 00 / 01 与最新台账 | 正式 01 已 `stop_review` | Image truth 外置；未来由 images 侧以 runtime / ref 消费 pinned member component release；不形成反向 package dependency | Release shape、manifest / version、compatibility、handoff / confirmation 或 readiness 已闭口 |
| `L2-member-service` 正式 00 与最新台账 | 正式 00 可作需求级输入；01 仍在 Step 16 装配前 | 本仓向其提供 pinned image entry / gap；它拥有 host / container lifecycle | Exact manifest / variant / ref、resolve / launch / confirmation 正向合同已闭口 |
| Governance 当前正式概要链 | Pattern reference only | 责任层、truth / projection、owner / adapter 分离与实现粒度表达 | Governance 模块、approval / policy truth 或其对象 / 接口可复制到本仓 |

状态刷新结论：正式 01 装配时 `L2-member` 尚未停审；截至本 Step，它已完成正式 01 停审。该变化加强了 owner / supply 方向的一致性，但其文档明确保留 exact release shape / compatibility / confirmation gap，因此不会自动关闭 `MI-UP-002`，也不要求回开本仓正式 01。`L2-member-service` 仍未完成正式 01 停审，其架构内容继续只作 pending input。

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 当前概要设计要承接哪些需求结论？ | 承接本仓是成员镜像资产与构建产物供给 truth owner；C-MI-1~5 的 definition / pinned assembly / candidate / provenance and eligibility / availability and entry 能力链；F-MI-001~015、BR-MI-001~025、D-MI-001~030、IF-MI-001~014、DEP-MI-001~016、NFR-MI-001~022、AC-MI-001~030、VETO-MI-001~007 及 MI-UP / Q 的正向上限。外围 F-MI-E01~E05 只作为 conditional / future，不进入核心分母。 |
| 2. 当前概要设计要承接哪些架构结论？ | 承接 BC-MI-01~04 的分阶段本地 decision、BC-MI-05 与 LS-MI-01~04 的 body-free shadow / derived 支撑；同步入口、条件型入站、后台处理、正式状态和派生读取的运行角色；向内责任层、六类 seam、truth / snapshot / ref / forbidden body、local decision strong consistency / cross-owner bounded eventual consistency、即时判断 / 后台交接分离和产品中立机制。 |
| 3. 哪些结论已经足够稳定？ | 仓定位、相邻 owner、static / live 红线、Role mapping 唯一来源、必要输入与 production entry pinned、candidate / eligibility / availability 分别成立、append / supersede history、external body-free、projection 不反写、compile 仅正式 Core、conditional inbound only / no outbound、gap / fail-closed 与 product-neutral adapter 均稳定，可作为 Step 2 的范围判断输入。 |
| 4. 哪些仍未收稳，不能直接往下展开？ | MI-UP-001~007 的 exact consumer / component / mapping / Core / event / seed / Artifact contracts，MI-UP-008 hardened base scope，MI-UP-009 outbound authority，Q-MI-001~004 的 variant scope / platform / product / gate inventory，以及所有字段、DTO、route、topic、product、database、language、capacity / retention 数字和真实 evidence 均未收稳。 |
| 5. 哪些边界决定概要不该展开到哪里？ | 不拥有 Role / member / runtime / tools / capability / adapter / Artifact / container / Sandbox / governance / observability / marketplace truth；不保存 secret、live memory、checkpoint、workspace live content 或 observed body；不把 consumption 变 compile；不把 adapter / event / registry / Artifact / consumer outcome 变 local positive state；不写完整 schema、DDL、实现、配置值、部署、测试、验收或实施事实。 |

## 5. 当前文档问题诊断

| 当前材料现象 | 风险 | 本 Step 处置 |
|---|---|---|
| 正式 00 / 01 已形成完整业务与架构命名空间，但尚无新版概要校准链 | 若直接写正式 02，容易从架构语义跳到对象 / API，遗漏代码主体框架门禁 | 新建 02 flow，只开放 Step 1；正式 02 写门保持关闭 |
| 旧正式 02 仍存在 | 旧对象、状态、产品、数字或完成口径可能污染 full-restart | 本 Step 不读取、不诊断内容；待 Step 1~13 全部确认后的后置历史审计门禁再处理 |
| 正式 01 中 sibling 状态快照已被 `L2-member` 新停审状态超越 | 可能误报 sibling 仍全部未停审，或反向误报 exact contract 已闭口 | 记录新的 formal status；只升级 owner / supply 方向可信度，MI-UP-002 保持 pending |
| `L2-member-service` 架构已完成 Step 1~15 但尚未正式装配 / 停审 | 进行中结论可能被当成 exact consumer authority | 只承接正式 00 的需求级消费方向；01 内容仅产生 pending |
| Method Library 等上游存在 implementation blocker 或实际执行状态 | 设计 owner 边界可能与 implementation readiness 混写 | 只承接正式设计 authority；任何实现、commit、test、evidence 或 readiness 不进入概要输入 |
| MI-UP / Q 覆盖多个阶段 | 为追求“概要完整”可能私造 port payload、gate kind、产品或 positive path | 稳定语义与 exact positive expansion 分层；后者保持 blocked / pending / future |
| BC / LS 与运行角色已经命名 | 容易在 Step 1 机械创建同名代码模块、服务或表 | 本 Step 明确不做映射；Step 4 才判断代码主体框架，且必须允许多对多 / 同置 |

## 6. 改动前后对比

| 维度 | Step 1 前 | Step 1 后 |
|---|---|---|
| 文档门禁 | 项目 ledger 仍停在正式 01 `stop_review`，02 被 `blocked_by_01` | 用户确认已登记；02 flow 建立并停在 Step 1 `pass_stop_review` |
| 上游状态 | 正式 01 的 sibling 快照显示 Member / Member Service 架构均未停审 | Member 正式 01 可作稳定方向输入；Member Service 01 仍 pending；exact contracts 均未伪关闭 |
| 输入分层 | 需求、架构、upstream、sibling 和 implementation status 尚未形成 02 专用分层 | Stable 语义、pending authority、blocked positive expansion、future / excluded 已区分 |
| 概要主语 | 只有“后续 02 继续设计”的泛化方向 | 已明确后续必须回答的结构问题，但未命名代码主体、对象、接口、流或状态机 |
| 历史材料 | 旧正式 02 存在污染风险 | 保持未读 historical_material；后置审计前不获得 authority |
| 事实边界 | 容易把文档完成或上游实施状态误读为系统 ready | 明确所有 design pass 只表示文档门禁，无实现 / integration / evidence / readiness 推导 |

## 7. 设计取舍

| 方案 | 优点 | 缺点 / 风险 | 结论 |
|---|---|---|---|
| A. 只读取本仓正式 00 / 01，直接进入范围讨论 | 输入集中 | 会遗漏 sibling 最新状态和 exact contract 漂移 | 不采用 |
| B. 以正式 00 / 01 为直接基线，并刷新专项 owner / sibling 台账后分层 | 既保持直接 authority，又能准确识别 stable / pending / blocked | 需要保留更多显式 gap | 采用 |
| C. 把 sibling 进行中架构或单方 exact shape 当作已闭口 | 可以快速写正向接口 | 违反并行窗口门禁，形成单方合同与伪 readiness | 不采用 |
| D. 先读旧正式 02，复用其对象 / API / 状态名 | 起稿快 | 旧稿会在 Step 4~9 前预设答案，破坏 full-restart | 不采用 |
| E. 因 exact seam 未闭口而整体阻塞概要设计 | 避免碰到不确定接口 | 会阻塞稳定 local semantics、negative / gap 与 product-neutral 结构下沉 | 不采用；只阻塞受影响 positive expansion |

## 8. 结构化中间产物

### 8.1 上游关系映射表

| 来源文档 | Authority / 输入状态 | 承接内容 | 本文继续展开什么 |
|---|---|---|---|
| `00-需求文档.md` | Direct / stable | 仓定位、五节点能力、核心功能 / 规则 / 数据 / interface / dependency / NFR / AC / VETO、非目标与开放条件 | 把已收稳需求转译为可实现结构骨架，不重写用户故事、功能愿望或验收结论 |
| `01-架构设计.md` | Direct / stable | BC / LS、运行承载角色、责任层、六类 seam、数据所有权、一致性、交互、机制、演进、风险和 ADR | 把架构语义下沉为代码主体、主要组成部分、对象 / 接口 / 流程 / 状态轮廓，但不机械映射架构单元 |
| `00_req_step_01~17`、`01_arch_step_01~16` | Trace source / stable | 正式 00 / 01 的形成过程、取舍、风险和审计来源 | 按需反查结论依据，不把讨论过程或 gate pass 当业务 / 实现状态 |
| 概要设计 SOP / 书写规范与启动标准 | Normative / stable | Step 1~14、固定 14 章、truth / dependency / evidence / historical / pending 纪律 | 约束概要设计粒度、来源和门禁，不生成领域 schema |
| ADR-0005 | Accepted / scoped stable | Build-time preinstall、nightly、mapping owner、pinned production entry、禁 `latest` | 作为后续结构不变量；不展开旧 Role / tool / product / metric 内容 |
| Runtime / Tools 正式 00~07 | Owner boundary / stable | Runtime live truth 与 Tools execution / capability truth 外置；静态 component 只以正式 pin / ref 消费 | 后续只设计本仓承接边界和 gap，不复制运行 / 工具对象或声称 release ready |
| Method Library 正式 00~07 | Owner boundary stable; exact surface pending | RoleDefinition、method / role 资产关系与 Role -> variant mapping owner | 后续保留 body-free runtime / ref seam；MI-UP-003 关闭前不写 positive exact adapter |
| Artifact 正式 00~07 | Owner boundary stable; image handoff pending | Artifact / version / lineage / baseline truth 与 consumable ref / gap 边界 | 后续分开 image eligibility 与 Artifact handoff；MI-UP-007 关闭前不写 formal ref success |
| Core / Bus 当前正式边界 | Conditional input | 正式 Core shared contract compile authority；conditional inbound event direction | 后续只引用已认定 shared contract，并为未知 event 保留 fail-closed；MI-UP-004/005/009 不闭口 |
| Sandbox 正式 00~07 | Owner boundary stable; hardened base future | Sandbox policy / backend / execution 外置 | MI-UP-008 获 scope 前不进入 current code / object / interface / flow denominator |
| `L2-member` 正式 00 / 01 与台账 | Sibling formal direction; exact release pending | Image truth 外置与未来 pinned member component release 方向 | 可把 supply boundary 作为稳定约束；MI-UP-002 继续阻塞 exact shape / compatibility positive expansion |
| `L2-member-service` 正式 00 与台账 | Sibling requirement stable; architecture pending | Pinned entry consumer 方向与 host / container owner | 只保留 consumer boundary / contract gap；MI-UP-001 关闭前不写 positive resolve / confirmation contract |
| Governance 当前正式概要链 | Pattern reference only | Responsibility layers、truth / projection、owner / adapter 分离粒度 | 参考分层表达，不复制治理领域模块、对象或接口 |

### 8.2 Stable / pending / blocked 输入分层

| 输入层 | 内容 | 当前可承接程度 | 对后续 Step 的权限 |
|---|---|---|---|
| `stable_local_requirement` | C-MI-1~5、F-MI-001~015、核心 BR / D / IF / DEP / NFR / AC / VETO | 可直接承接 | Step 2 可据此判断概要目标 / 范围；后续只能逐 Step 下沉 |
| `stable_local_architecture` | BC-MI-01~05、LS-MI-01~04、责任层、运行角色、data / consistency / interaction / mechanism | 可直接承接 | 允许形成结构候选；禁止 BC / LS 到代码或部署的一一映射 |
| `stable_invariant` | Mapping unique owner、static / live split、necessary pin、no `latest`、staged decisions、body-free、history、fail-closed、truth / projection | 可直接承接 | 作为后续对象、接口、流、状态和配置的共同红线 |
| `stable_dependency_boundary` | Compile 仅正式 Core；runtime / event / ref / adapter / fake 权限上限；conditional inbound only / no outbound | 可直接承接 | 允许设计 inward boundary 和 negative / gap；不授予 exact carrier / package 权限 |
| `pending_exact_authority` | MI-UP-001~007 | 只能承接 owner、方向、neutral seam 与 gap | 禁止 exact DTO / schema / route / ref mint / positive contract；受影响项见 §8.3 |
| `future_or_absent_authority` | MI-UP-008/009 | 不进入 current positive scope | Hardened base 与 outbound event 不进入当前概要分母 |
| `pending_formal_decision` | Q-MI-001~004 | 只能保留 conditional / product-neutral / authority-driven 边界 | 禁止预设 restricted / multi-arch dimension、产品或 gate inventory |
| `pending_sibling_architecture` | `L2-member-service` 正式 01 尚未停审 | 只承接正式 00 的需求级方向 | 架构内容不得关闭 MI-UP-001 或形成双方 exact contract |
| `implementation_status_not_input` | 上游实现、commit、run、test、evidence、readiness 或 blocker 状态 | 不作为本概要 positive fact | 只能提醒不要把设计 authority 与 implementation readiness 混写 |

### 8.3 Pending 条件与 blocked positive expansion

| ID | 当前输入状态 | 当前 blocked 的正向展开 | 仍可设计的保守边界 |
|---|---|---|---|
| `MI-UP-001` | Member Service exact consumer contract pending；其正式 01 未停审 | Exact manifest / variant / ref、resolve / confirmation success | Pinned entry supply direction、unavailable / contract-gap、container owner 外置 |
| `MI-UP-002` | Member 正式 01 已停审，但 release shape / compatibility owner 仍 pending | Member component exact carrier、compatibility report / readiness | Formal pinned release ref 方向、missing / incompatible / unresolved 时 assembly blocked |
| `MI-UP-003` | Mapping owner stable，exact body-free query / snapshot surface pending | Positive mapping query / adapter contract | Runtime + ref、source identity / validity、no fallback、missing / stale / conflict |
| `MI-UP-004` | Image-specific Core schema pending | Active image-specific compile contract | 只用已正式认定 Core contract；其余保持仓内私有语义且不冒充 shared schema |
| `MI-UP-005` | Inbound event authority / family / schema pending | Positive event consumer、event-derived accepted intent | Nightly current；unknown event rejected / unavailable；arrival 不等于 candidate |
| `MI-UP-006` | Seed semantic owner与 exact template ref / placement contract pending | Complete seed-positive baseline 与 owner-specific adapter | Owner-neutral pinned ref / placement；semantic body 外置；缺失时 baseline incomplete |
| `MI-UP-007` | Artifact image handoff / formal consumer ref pending | Handoff success、formal Artifact ref / version / lineage | Candidate handoff attempt、image eligibility 与 Artifact gap 分层 |
| `MI-UP-008` | Hardened base authority / scope absent | Current hardened-base input、derivation或 qualification | Future-only 记录；Sandbox truth 始终外置 |
| `MI-UP-009` | Outbound build / publish event authority absent | 任何 current event output、notification success | Availability history与本地 entry 不依赖 outbound notification |
| `Q-MI-001` | Restricted / read-only variant scope pending | Current restricted dimension / Role enumeration | Conditional scope；不改写 Role / governance truth |
| `Q-MI-002` | Multi-architecture scope / identity baseline pending | Current architecture dimension、枚举、完成率 | 单一受控 current dimension与平台中立边界 |
| `Q-MI-003` | Builder / registry / evidence product authority pending | 产品、供应商、部署与配置绑定 | Product-neutral adapter / port boundary；具体绑定后移正式 04 |
| `Q-MI-004` | Applicable evidence kind / gate priority pending | BOM / scan / signature 当前清单、顺序或 pass claim | Authority-driven applicable gate 不可绕过；missing / unknown fail closed |

上述 blocked 只限制受影响 positive expansion，不阻塞 Step 2 对 product-neutral、local-truth、negative / gap-aware 概要范围进行判断。任何 owner 文档、sample DTO、fake、POC、digest 或单方草案都不能自动改变这些状态。

### 8.4 本文不再回答

- 不再回答本仓是否是成员镜像资产与构建产物供给 truth owner，也不再把它解释成 CI、registry 或 Member Service 的附属脚本。
- 不再回答 Role / mapping、member、runtime、tools、Artifact、container、Sandbox、governance、observability、marketplace 和产品 truth 分别归谁。
- 不再回答模板 / seed / pinned component / build output 与 secret / live memory / checkpoint / workspace live content / observed body 的静态与运行态边界。
- 不再回答 production entry 是否必须 immutable pinned、是否允许 `latest` / mutable selector / guessed version。
- 不再回答 candidate、eligibility、availability、Artifact handoff 与 consumer / container state 是否需要分别成立。
- 不再回答 external body 是否可以直接进入 core、projection / registry / fake 是否可以反写真相。
- 不再回答跨仓 consumption 是否自动形成 compile dependency；compile / runtime / event / ref / adapter / fake 的权限上限沿用正式 01。
- 不再回答当前是否有 outbound image event、真实 build / digest / evidence / release / acceptance 或 readiness；答案均为未获 authority 或未发生声明。
- 不再回答 builder、registry、scanner、signer、database、queue、language、framework、deployment 产品和量化 SLA / SLO；它们不是 Step 1 上游定论。

### 8.5 本文必须回答

- 已收稳的需求能力与架构语义应如何映射为可实现的代码主体框架，同时避免把 BC / LS 机械映射成 service、module 或 database。
- 主要组成部分如何划分，各部分承担什么、不承担什么，以及 internal truth、external seam、derived read 与 technical carrier 如何保持向内依赖。
- 哪些关键对象轮廓足以承载本仓 truth、受控外部影子、历史与 gap；哪些相邻 owner 对象只能以 ref / snapshot / safe conclusion 出现。
- Command、Query、conditional inbound Event、Operations Job 与 external adapter / ref 边界需要哪些接口骨架；pending exact contract 如何显式 fail closed。
- 哪些关键处理需要独立流程轮廓，入口、application coordination、local decision、persistence / port、projection / handoff 之间怎样分责。
- 哪些本地 decision context 需要状态集合与迁移，如何避免把 staged decisions 和 external owner state 压成单一 lifecycle。
- Missing / stale / conflict / failed / unknown / unavailable / gap、duplicate、late result、invalid ref、projection lag 等异常应落在哪个责任部分并如何保守恢复。
- 哪些结构受配置影响，哪些 owner、pin、gate、history、body-free、dependency 和 state redline 禁止配置化。
- 哪些对象、接口、流程、状态、错误、持久化、adapter parity、配置契约和测试切口必须交给正式 03 继续展开。
- 在 MI-UP / Q 未关闭时，哪些只允许 local / negative / gap-aware 结构，哪些 positive contract 必须继续 blocked。

### 8.6 本步识别但暂不进入范围

| 暂不进入范围 | 原因 | 后续门禁 |
|---|---|---|
| 当前概要设计的正式目标、非范围与深度 | Step 1 只提供输入，不能替代 Step 2 | Step 2 独立收口 |
| 约束正式清单及对结构的逐项影响 | Step 1 只识别线索 | Step 3 独立收口 |
| 代码主体、目录、crate / module / service / database / process 名称 | 尚未完成目标、范围与约束 | Step 4 才允许讨论代码主体框架；物理细节继续 deferred |
| 对象名、字段 / 类型 /函数骨架 | Step 6 尚未到达 | Step 5 先发现候选，Step 6 再收稳轮廓 |
| API / Command / Query / Event / Job 名称和输入输出 | Exact seams 多数 pending，且 Step 7 尚未到达 | Step 7 只收骨架；完整 schema 留 03 |
| 处理流、函数数据流、状态集合与迁移 | Step 8 / 9 尚未到达 | 必须分别讨论，不压成单 pipeline |
| 完整 DTO / JSON / proto / event schema、DDL、transaction、repository contract、实现代码 | 属于详细设计或实现 | 正式 03 / 07 之后，且受 owner authority 控制 |
| 配置 key / default / secret source、产品 / 供应商 / topology / resource | 属于 04 或 implementation decision；Q-MI-003 pending | Step 11 只识别影响，正式 04 再设计 |
| 测试用例、evidence、验收结果、commit / batch / run / digest / report / signoff / readiness | 尚未进入 05~07，更没有执行事实 | 后续正式文档只能先设计计划，不得伪造结果 |
| Restricted、multi-arch、hardened base、outbound event 等 active 能力 | Scope / authority 未闭口 | Q-MI-001/002、MI-UP-008/009 正式关闭并重开受影响 Step 后 |
| 旧正式 `02-概要设计.md` 的内容 | Full-restart 后置污染审计尚未开放 | Step 1~13 已确认后，Step 14 才可只读审计并删除重建 |

## 9. 回填草稿

以下只作为未来正式第 1 章的候选输入，不在本 Step 写入正式 `02-概要设计.md`。

### 9.1 关系声明候选

本文在已停审的 `00-需求文档.md` 与 `01-架构设计.md` 基础上，继续把成员镜像资产与构建产物供给边界下沉为可实现的主要结构。本文不重新定义本仓职责、相邻 owner、BC / LS、数据所有权、依赖方向或架构取舍，也不把任何设计门禁写成实现、集成、测试或 readiness 事实。

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `00-需求文档.md` | 五节点能力、核心需求 / 规则 / 数据 / 接口 / 质量 / 验收边界和开放条件 | 可实现结构、关键轮廓与详细设计承接 |
| `01-架构设计.md` | BC / LS、运行角色、责任层、六类 seam、数据一致性、交互、机制、风险与 ADR | 代码主体、主要组成部分、对象、接口、流程、状态、异常与配置影响轮廓 |
| ADR-0005、全局设计 / 依赖标准 | Build-time / nightly / mapping owner / pin / no-latest 与 truth / dependency / evidence 纪律 | 作为后续结构不可绕过的上游约束 |
| 专项 owner 正式链与 sibling 最新台账 | Role / component / Artifact / Sandbox / consumer owner 边界及 current exact gaps | 只形成正式 ref / snapshot / safe conclusion / neutral seam / gap；未闭口部分保持 blocked |

### 9.2 第 2 / 3 章前置输入

- 第 2 章只能从 §8.4、§8.5、§8.6 继续收口当前概要目标、范围、非范围与深度，不能直接复制为结论。
- 第 3 章只能从 Stable invariant、dependency boundary、MI-UP / Q 正向上限中筛选结构约束，不能在 Step 1 提前形成完整约束表。
- 正式第 1 章不画图；来源映射表承担承接判断，短文只收束层次边界。

## 10. 待确认事项

| 待确认项 | 当前判断 | 状态 |
|---|---|---|
| 本 Step 是否足以进入 Step 2 | Stable local semantics、owner / dependency / data / interaction redline 足以讨论目标与范围；exact positive seams 可保守挂起 | `pass_stop_review`，等待用户确认 |
| `L2-member` 正式 01 停审是否关闭 MI-UP-002 | 否；只加强 supply / owner 方向，文档自身仍声明 release shape / compatibility / confirmation pending | `keep_open` |
| `L2-member-service` Step 15 pass 是否可关闭 MI-UP-001 | 否；正式 01 尚未装配 / 停审，且双方 exact consumer contract 仍待共同校准 | `keep_open` |
| 上游 implementation 状态是否成为本概要输入 | 否；只承接 current formal design authority，implementation blocker / pass 不证明本仓可集成 | `excluded_as_readiness` |
| 是否现在读取或复用旧正式 02 | 否；当前只记录 historical 存在性，Step 14 后置审计前保持未读 | `deferred_historical_audit` |

本 Step 不新增新的业务待决策 ID，也不关闭 `MI-UP-001~009`、`Q-MI-001~004`。其中 exact positive lanes 继续按 §8.3 blocked；这不阻塞 Step 2 的 product-neutral、fail-closed 范围讨论。

## 11. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 已明确概要设计承接哪些需求结论 | `pass` |
| 已明确概要设计承接哪些架构结论 | `pass` |
| 已区分 Stable、pending、blocked、future 与 implementation-not-input | `pass` |
| 已明确本文不再回答什么、必须回答什么 | `pass` |
| 已识别但未提前收口 Step 2 范围与 Step 3 约束 | `pass` |
| 未命名代码主体、对象、接口、处理流或状态机 | `pass` |
| 未读取 / 修改旧正式 02，未创建 future Step 文件 | `pass` |
| MI-UP-001~009、Q-MI-001~004 是否完整保留 | `pass` |

`gate_status = pass_stop_review`。Step 1 内容足以支撑 Step 2“明确本仓设计目标与当前范围”，但当前必须停审。下一次只有在用户明确确认后，才允许按恢复顺序重读 ledger、02 flow 与本文件，读取 SOP Step 2 / 书写规范对应章节并创建 `02_hld_step_02_goals_scope.md`；不得同时进入 Step 3、正式 02 或 commit。
