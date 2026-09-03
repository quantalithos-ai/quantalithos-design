# Step 13. 演进路线

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `evolution_path` | pass | 当前核心语义阶段、三类条件型演进车道、5 项可接受结构债务、不可接受债务和 9 类事实触发条件已分层;未写排期、任务拆单或 future readiness | 进入 Step 14 风险与待确认事项 | `01_arch_step_02_goals_constraints.md`;`01_arch_step_06_container_deployment.md`;`01_arch_step_10_technology_choices.md`;`01_arch_step_11_alternatives_tradeoffs.md`;`01_arch_step_12_cross_cutting_concerns.md`;`../00-需求文档.md` |

### 1.1 Step 内计划

- [x] 读取 ledger、01 flow、Step 2 / 6 / 10~12、正式 00 风险 / open register、架构 SOP Step 13 与书写规范 §4.14。
- [x] 定义当前架构主线做到何处才足以进入后续设计,不把它表述为实现 readiness。
- [x] 将 owner contract、规模隔离和外围范围拆成互不自动推进的条件型演进车道。
- [x] 区分可接受结构债务、受阻 positive lane 和永久边界外事项。
- [x] 为每个演进方向写清事实触发条件、首先改变的结构面和保持不变的核心不变量。
- [x] 核对 MI-UP-001~009、Q-MI-001~004 的性质、owner 和关闭方式未被改写。
- [x] 比较并拒绝线性版本路线图、全功能 current、open-item 自动下一阶段和愿望池方案。
- [x] 排除日期、版本号、任务拆单、实现状态、产品承诺、测试结果和 readiness 推导。

## 2. 本步输入

| 输入 | 本步承接 |
|---|---|
| Step 2 | Current / conditional / future 取舍、AG-MI-001~008 与 IC-MI-001~011 |
| Step 6 | 三类处理角色、两类状态承载、当前允许同部署和测量后再拆分 |
| Step 10 | TM-MI-001~010 当前必要机制与产品载体 deferred |
| Step 11 | 独立镜像域控制面主线及被拒绝路径的重开上限 |
| Step 12 | XC-MI-001~010、无量化 baseline 和 compatibility fail-closed |
| 正式 00 §15 | R-MI-001~010、MI-UP-001~009、Q-MI-001~004 的性质与关闭 authority |
| Sibling 当前台账 | `L2-member` / `L2-member-service` 架构均仍在讨论中;只能保持 pending 输入 |

## 3. SOP 问题回答

1. 当前阶段做到哪里才算足够?

   回答:足够指架构语义可进入后续设计:BC-MI-01~05 owner 唯一,definition -> candidate -> eligibility -> availability 单向成立,external shadows 不造 truth,六类 seam 与同步 / 后台边界清楚,失败可保守表达且历史不覆盖。它不表示 exact contract、构建、Artifact ref、consumer integration、产品或运行 readiness 已成立。

2. 第一批必须守住哪些结构?

   回答:必须守住 pinned static assembly、immutable attempt snapshot、candidate / eligibility / availability 分阶段 decision、digest / provenance binding、authority-driven fail-closed gate、local / Artifact / consumer state 分层、product-neutral adapter、truth / projection 分离以及新语境恢复。

3. 哪些能力或约束留到后续阶段演进?

   回答:Exact owner contracts 的 positive lane、测量驱动的承载拆分与量化预算、restricted variant、多架构、快速安全重建、hardened base、usage summary 以及可能的 event / history 机制增强都只能进入各自条件车道。它们不构成一个必须依次执行的统一“下一版本”。

4. 哪些设计债务当前可接受,哪些不可接受?

   回答:语义单元同部署、truth / projection 物理同置、具体产品未选、量化预算暂缺、未采用 full event sourcing 当前可接受,因为它们不改变 owner / decision / history 边界。缺失必要 pin、用 pending seam 伪 positive、吞并相邻 truth、覆盖历史或把 adapter / fake 当兼容证据绝不可作为债务接受。

5. 哪些触发条件会迫使架构调整?

   回答:正式 owner contract 到达、event authority 出现、workload / measurement 显示阶段压力、正式 scope 启用外围 variant / base / usage 能力、正式 gate inventory 或产品绑定确定、出现可审计 replay requirement 等事实会触发对应局部重开。模糊“以后可能需要”不构成触发。

6. 演进时最先改变什么?

   回答:优先改变外部 seam 的 contract / adapter、派生投影或运行承载边界,核心 owner 与 staged decisions 保持稳定。只有正式需求 / ADR 证明核心不变量不再成立时,才允许重开 BC-MI-01~04 的责任划分。

## 4. 当前材料问题诊断

| 候选演进表达 | 问题 | 当前处理 |
|---|---|---|
| “P0/P1/P2”或季度路线图 | 项目排期,不是结构演进 | 改为 current + condition-triggered lanes |
| “先做 MVP,以后补安全 / 审计” | 把不可变横切约束降为债务 | 安全、追溯、fail-closed 从 current 起成立 |
| 所有 MI-UP 关闭后进入下一阶段 | 把独立 owner 条件耦合成总门禁 | 每个 seam 独立重开,未受影响主线不联动 |
| 每阶段部署成独立 microservice | 缺 workload / isolation 依据 | 语义边界稳定,部署只在测量触发后拆分 |
| Restricted / multi-arch / hardened base 自动排入 future | 把 conditional scope 写成承诺 | 只有正式 scope + owner 输入才进入对应车道 |
| Outbound events / full event sourcing 作为自然终态 | MI-UP-009 与 replay requirement 都未成立 | 仅保留需重新决策的触发条件 |
| Exact seam pending 作为“可接受债务” | 会掩盖 positive integration blocker | 单列不可接受债务 / 受阻 lane |
| Supply usage summary 绑定 Q-MI-003 | 与正式 00 编号冲突 | Usage 保持 F-MI-E05 / R-MI-010 future;Q-MI-003 只管 backend 产品绑定 |

## 5. 改动前后对比

| 维度 | 路线图式候选 | 当前演进结论 |
|---|---|---|
| 阶段 | 版本 / 日期 / 功能包 | 架构主线成立状态与条件车道 |
| Current | 必须所有外部系统联通 | 核心语义可闭合,受阻 positive lane 明确 fail closed |
| Debt | 所有未做事项混作技术债 | 只接受不打穿不变量的结构简化 |
| Pending | 自动变成下一阶段任务 | 保持 owner-controlled blocker / question |
| Scale | 预设 microservices / queue | 正式 workload / isolation measurement 触发 |
| Feature | Future 愿望池 | 正式 scope / authority 逐项触发 |
| Core change | 随产品与合同变化 | 先改 seam / adapter / carrier,核心 owner 稳定 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 单一路线:核心 -> event -> multi-arch -> microservices | 易读 | 把独立条件伪造成必然顺序 | 不采用 |
| 将所有能力纳入 current 以避免 future debt | 表面完整 | 无 authority 且会扩大核心分母 | 不采用 |
| 只写“按需演进” | 简短 | 没有触发事实和结构落点 | 不采用 |
| Current invariant foundation + 三类条件车道 | 保持核心稳定且每次变化可归责 | 需要持续维护 trigger / open register | 采用 |
| 将 exact contract gap 记为可接受技术债 | 允许文档看似闭合 | 会伪造 positive integration 上限 | 不采用 |
| 预先选择最终部署 / event / storage 形态 | 可减少后续选择 | 当前无 workload、event authority 或 replay requirement | 不采用 |

## 7. 结构化中间产物

### 7.1 演进路线

| 阶段 | 当前目标 / 范围 | 当前可接受债务 | 后续演进项 | 触发条件 | 说明 |
|---|---|---|---|---|---|
| 当前核心语义阶段 | 让 BC-MI-01~05、staged decisions、六类 seam、truth / projection、同步 / 后台承接、fail-closed 与 history semantics 成立;单一受控运行架构维度,nightly 为 current intent 语义 | 语义单元与处理角色可同部署;正式 / 派生状态可物理同置;具体产品和量化预算 deferred | 不自动承诺任何下一项;受阻 positive seam 仅返回 gap / unavailable | 当前需求、ADR-0005 和 owner 边界持续成立 | “成立”只指架构结论可供后续设计,不指实现或 integration ready。 |
| Owner-contract 激活车道 | 在不改写领域结果的前提下,逐一将已获正式 authority 的 mapping、component / seed、Core、event input、Artifact 或 consumer seam 从 gap 转为可设计 positive contract | 其他未闭口 seam 继续 blocked;nightly 不等待 event lane | Exact contract、adapter parity、compatibility decision 与对应 recovery 细化 | MI-UP-001~007 任一获得正式 owner 输入并完成双方校准 | 每条 seam 独立激活;一个 owner 关闭不能推导其他 seam ready。 |
| 测量驱动承载演进车道 | 在核心语义不变时,按实际等待、吞吐、故障隔离、恢复或 projection 压力调整处理角色和状态承载 | 未触发前允许同部署 / 同物理存储;不预设服务数或 queue | 后台处理 / conditional intake / projection 独立承载,量化预算与恢复上限 | 正式 workload、measurement baseline 或 isolation evidence 证明当前承载不满足 XC-MI-004~008 | 先改 carrier / deployment,不机械拆 BC 或引入 full event sourcing。 |
| 条件型范围扩展车道 | 对获准的 restricted variant、多架构、快速安全重建、hardened base 或 usage summary 逐项扩展模型 / projection | 未启用能力不进入核心分母;无通用“全部支持”承诺 | 对应 variant dimension、derivation input、受控 rebuild 或 read-only projection | Q-MI-001/002 正式裁定;MI-UP-008 与 base authority 闭口;F-MI-E03/E05 获正式 scope / source | 各增强相互独立,且始终受 pin、gate、history 与 owner 红线约束。 |

这些车道不是项目版本或必经顺序。Owner-contract、承载和范围变化可以分别发生,但每次只重开受影响结构面;未触发的车道继续维持当前 conservative boundary。

### 7.2 当前可接受结构债务

| ID | 结构债务 | 为何当前可接受 | 不可继续接受的事实触发 | 受保护不变量 |
|---|---|---|---|---|
| `ED-MI-001` BC / 处理角色不强制独立部署 | 语义、failure 与 ownership 已分离,当前无 workload 证明物理拆分必要 | 阶段积压、故障传播、恢复或隔离 measurement 超出正式边界 | BC owner、stage result、IX-MI-01~06 |
| `ED-MI-002` Truth 与 projection 不强制物理分库 | 写入 authority、重建方向和禁止反写已明确 | Projection workload / failure 影响 core decision 或恢复 | Truth 唯一、projection 可重建 |
| `ED-MI-003` Builder / registry / evidence 产品未绑定 | TM-MI-009 的 product-neutral adapter 足以先锁语义;Q-MI-003 尚未裁定 | 04 获正式产品 / deployment authority,或 adapter capability 影响领域可满足性 | 产品不得成为 truth owner |
| `ED-MI-004` 暂无量化 latency / throughput / size / retention 预算 | 当前无 workload / measurement baseline,离散结构口径可审查 | 正式 baseline 到达或消费主链出现可测压力 | XC-MI-007/008、不得伪造数值 |
| `ED-MI-005` 只采用 append / supersede history,不采用 full event sourcing | 当前不要求 event log 成为 truth 或全量 replay;MI-UP-005/009 未闭口 | 正式 replay / temporal audit requirement 与稳定 event taxonomy 同时出现 | History 不覆盖、恢复新语境 |

### 7.3 不可包装为债务的 blocker 与红线

| 项目 | 当前性质 | 为什么不是可接受债务 | 当前上限 |
|---|---|---|---|
| MI-UP-001~007 exact owner seams | 受影响 positive contract blocker | 缺 authority 时无法用实现选择偿还 | 只保留 port semantics、gap 与 fail closed |
| MI-UP-008/009 | Future scope / absent authority | 当前没有 core obligation,不能伪排期 | Hardened base 不进核心;无 event output |
| Q-MI-001~004 | 正式待决策 | 选择权不完全属于本仓 | Conditional / adapter-neutral / authority-driven |
| Missing pin / provenance / applicable gate | 核心成立否决项 | 会直接产生不可归责候选或供给 | 无 positive candidate / eligibility / availability |
| External body / live state / second owner | 永久边界红线 | 违反本仓定位,不是阶段简化 | 禁止进入 truth、snapshot 或 build input |
| History overwrite / adapter-as-domain-success | 永久一致性红线 | 破坏审计与 staged decisions | 必须使用新语境并重新判定 |

### 7.4 事实触发条件

| ID | 触发事实 | 首先重开的结构面 | 仍不自动成立 |
|---|---|---|---|
| `ET-MI-001` Method / component / seed owner 发布正式 exact contract | BC-MI-01 source shadow、ref / adapter、baseline validation | Positive mapping / assembly 必须经本仓校准,不因文档存在自动 ready |
| `ET-MI-002` Core 正式接受 image-specific shared contract | Compile 白名单与 inward contract | 其他非 Core relation 不转为 compile dependency |
| `ET-MI-003` Bus / Core 给出正式 inbound build event authority / contract | Conditional async intake、intent authority 与 failure mapping | Nightly 不取消;event arrival 不等于 candidate;无 outbound event |
| `ET-MI-004` Artifact 或 Member Service exact handoff / entry contract 闭口 | BC-MI-03/04 handoff / gap、consumer ref boundary | Artifact ref、launch、confirmation、container health 不自动成功 |
| `ET-MI-005` 正式 workload / measurement / isolation evidence 出现 | 运行承载、projection、performance / recovery budgets | 不机械形成 microservices、queue 或 HA product |
| `ET-MI-006` Q-MI-001/002 获正式范围裁定 | Variant model、derivation 与 entry dimensions | 不改写 Role / governance truth,不绕核心 gate |
| `ET-MI-007` MI-UP-008 与 hardened base authority 闭口 | BC-MI-01 base ref / derivation shadow | 不拥有 Sandbox policy / backend / execution |
| `ET-MI-008` F-MI-E03/E05 获正式 scope、source 与判断口径 | 受控快速重建或只读 usage projection | Rebuild 不绕 gate;projection 不反写 availability |
| `ET-MI-009` 正式 outbound authority 或 replay requirement 出现 | 分别重开 event output 或 history architecture decision | 不自动采用 outbound event、outbox、event sourcing 或具体产品 |

Q-MI-003 / 004 的正式裁定只触发 adapter / 配置和 gate evaluation 的细化,不会改变 candidate、eligibility 或 availability 的 owner。任何产品、evidence kind 或 priority 仍需在后续文档中按正式 authority 落地。

### 7.5 演进中保持不变的结构

| 不变量 | 所有车道必须保持 |
|---|---|
| Owner | Role / method、component、Artifact、consumer、runtime / tools、Sandbox、governance 与 observability truth 不被本仓吞并 |
| Static / live | 镜像只承接模板、seed 与构建 materialization;secret / live / observed body 永不进入 |
| Identity | Necessary inputs 与 production entry immutable pinned;candidate digest 与 provenance 绑定 |
| Decision | Candidate、eligibility、availability 分别成立;adapter / event / registry outcome 不自动推进 |
| Failure | Unknown / missing / conflict / gap fail closed,只冻结受影响 lane |
| History | Revision / attempt / evaluation / availability 通过 append / supersede / transition 恢复,不覆盖 |
| Dependency | Compile 仅正式 Core shared contract;runtime / event / ref / adapter / fake 不自动升格 |
| Consumer | Pinned entry 不代表 Artifact、notification、confirmation、container lifecycle 或 product readiness |

### 7.6 阶段边界说明

当前阶段不要求所有外部合同和产品都已存在,而要求即使它们缺失,核心语义仍能明确给出 gap 并守住 owner、pin、gate 和历史边界。可接受债务只涉及物理承载、产品载体和无 baseline 的量化,不涉及 positive truth 的成立条件。后续变化由正式 owner、scope 或 measurement 触发,先调整 seam、adapter、projection 或 carrier,而不是把 future 愿望直接加入核心。任何触发都只允许重开受影响校准内容,不能从输入到达推导实现、测试或 readiness 已完成。

### 7.7 演进路线审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| Current 最低边界 | pass | 核心语义成立条件明确,且与实现 readiness 分离。 |
| 债务可接受性 | pass | 5 项债务均有理由、触发事实和受保护不变量。 |
| Blocker / debt 分离 | pass | MI-UP exact seams 和核心 veto 未被包装为技术债。 |
| Trigger 可审查 | pass | 9 类触发均需正式 owner / scope / measurement / requirement。 |
| 演进首改结构 | pass | 外部 seam / carrier / projection 优先,核心 owner 稳定。 |
| 项目管理污染 | pass | 无日期、版本、排期、任务拆单或资源承诺。 |
| Future 愿望池 | pass | 条件增强互相独立,未成为必做路线。 |
| 边界外回流 | pass | Artifact、container、runtime、governance、observability 等 owner 不重开。 |
| Pending / readiness | pass | MI-UP-001~009、Q-MI-001~004 均未关闭或形成 positive claim。 |

## 8. 回填草稿

正式 01 §14 回填 §7.1 演进路线、§7.2 可接受债务、§7.3 blocker / debt 分离、§7.4 触发条件、§7.5 不变量和 §7.6 的 1 段边界说明。正式章必须保留“条件车道不是版本顺序”与“current 成立不等于 implementation / integration readiness”。

## 9. 待确认事项

- 本 Step 不新增 owner-controlled open ID;`ED-MI-*` / `ET-MI-*` 是架构演进分析编号,不是实施任务、外部 commitment 或 closure claim。
- MI-UP-001~007 仅在正式 owner 输入到达并完成受影响校准后才能改变 positive lane 状态。
- MI-UP-008/009 与 Q-MI-001~004 不进入当前核心分母,也不因出现在路线中变成 planned capability。
- F-MI-E03 / E05 继续是外围增强,正式 scope / source 未出现前不进入架构主线。
- `L2-member` / `L2-member-service` 架构尚未停审,其进行中结论不得关闭 MI-UP-001/002。
- Per-stage deployment、full event sourcing、outbox、multi-region、autoscaling、产品和量化预算均未被选择。
- 当前不存在实现仓、commit、run、digest、report、evidence、测试、verdict、signoff 或 readiness 事实。

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 当前核心语义阶段做到何处是否明确 | pass |
| 可接受债务是否有理由、触发条件和不变量 | pass |
| Positive blocker / permanent redline 是否未被债务化 | pass |
| 后续车道是否由正式事实触发且互不自动推进 | pass |
| 是否说明演进首先改变的结构面 | pass |
| 是否无排期、任务拆单、愿望池或 readiness 推导 | pass |

`gate_status = pass`;允许更新 flow / ledger 后创建 Step 14,不得跳到 Step 15 或修改正式 01。
