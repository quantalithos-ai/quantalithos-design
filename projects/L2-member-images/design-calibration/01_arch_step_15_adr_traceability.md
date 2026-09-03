# Step 15. ADR 与需求追溯

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `adr_traceability` | pass | 12 条需求承接关系覆盖正式 00 全部命名空间,8 项长期架构决策逐项回指需求、已停审架构单元、取舍和风险;反向覆盖与跨 ADR 审计无孤儿或新增结论 | 进入 Step 16 正式文档装配;此时才允许读取旧正式 01 作 historical pollution audit | `01_arch_step_01_requirement_baseline.md`~`01_arch_step_14_risks_open_questions.md`;`../00-需求文档.md`;`../../../architecture/adr/0005-member-image-per-role.md` |

### 1.1 Step 内计划

- [x] 读取 ledger、01 flow、Step 1~14、正式 00 全部需求命名空间、ADR-0005、架构 SOP Step 15 与书写规范 §4.16~4.17。
- [x] 以能力节点和跨节点约束组织追溯,不做章节目录对照。
- [x] 将需求结论、具体架构结果、正式落点和成立理由逐行连接。
- [x] 对 P / G / NG / HR / C / US / F / BR / D / IF / DEP / NFR / AC / VETO / R / MI-UP / Q 执行反向覆盖。
- [x] 识别只具产品 / 实现意义或仍 pending 的事项,排除出 ADR 索引。
- [x] 将 ADR-0005 的可继承决定与固定 Role、工具、数字、CI / registry 污染分开。
- [x] 为 7 项已收稳的项目内长期决定分配稳定索引编号,不创建或声称仓外 ADR 文件。
- [x] 逐决策检查需求 / 约束 / 风险来源、架构单元、取舍和无新增结论。
- [x] 审计孤儿核心需求、孤儿架构判断、取舍缺来源、普通实现选择和 pending 升格。

## 2. 本步输入

| 输入 | 本步承接 |
|---|---|
| 正式 00 §2~6 | P-MI-001~009、G-MI-001~007、NG-MI-001~015、HR-MI-001~005 与依赖边界 |
| 正式 00 §7~14 | C-MI-1~5、US / F / BR / D / IF / DEP / NFR / AC / VETO 全量需求链 |
| 正式 00 §15 | R-MI-001~010、MI-UP-001~009、Q-MI-001~004 |
| ADR-0005 | 构建期预装、nightly、一 Role 一镜像方向、mapping owner、pinned 与生产禁 `latest`;其余内容需污染裁剪 |
| Step 1~14 | AG / IC、BC / LS、运行承载、依赖、数据、IX、TM、XC、ED / ET、AR 与方案取舍 |
| 架构书写规范 | 正式 §16 需求追溯矩阵与 §17 ADR 索引的固定结构 |

## 3. SOP 问题回答

1. 哪些架构决定需要长期沉淀?

   回答:ADR-0005 的预构建 / nightly / mapping owner / pin 主线,以及独立镜像域与 staged decisions、向内防腐与依赖裁剪、immutable identity / provenance / fail-closed gate、image / Artifact / consumer 状态分层、history / projection 分离、同步判断 / 后台承接、语义边界与部署形态分离七项项目内决定具有长期影响。

2. 每个决定有什么需求、约束或风险来源?

   回答:§7.6 将每项决定回指正式 00 的 P / G / BR / D / IF / DEP / NFR / AC / VETO / R,以及 Step 2 的 IC、Step 5 的 BC、Step 10~14 的取舍 / 风险。不存在仅凭技术偏好进入索引的决定。

3. 是否存在没有需求来源的架构设计?

   回答:未发现。AG / IC、BC / LS、运行承载、依赖、数据、IX、TM、XC、ED / ET 和 AR 均可回指正式需求或 accepted ADR;产品、协议、存储、schema、部署数量和 full event sourcing 等未收稳事项未被升格。

4. 是否存在没有架构承接的核心需求或关键约束?

   回答:未发现孤儿核心需求。C-MI-1~5 及其 US / F / BR / D / IF / NFR / AC 由 BC-MI-01~05、IX-MI-01~06、TM / XC 和正式 §4~15 承接;DEP、VETO、风险和开放条件也有独立映射。Positive exact contract 仍有 trace gap,但已显式挂在 MI-UP / Q,不是被“已覆盖”掩盖。

5. 哪些内容不进入 ADR 索引?

   回答:Builder / registry / evidence 产品、schema、语言、数据库、queue、scanner / signer、具体 gate inventory、per-stage services、full event sourcing、outbound events、restricted / multi-arch / hardened base 等 pending / conditional 事项不进入。固定 Role 枚举、工具清单和无 authority 数字也不从 ADR-0005 继承。

6. 每个关键决定是否完成停审?

   回答:8 项均通过长期性、正式来源、已停审架构单元 / 跨单元审计、取舍来源和无新增结论检查。这里的 `pass` 只表示决策索引与追溯完整,不表示对应实现存在。

## 4. 当前材料问题诊断

| 候选表达 | 问题 | 当前处理 |
|---|---|---|
| “00 第 7 章 -> 01 第 6 章” | 只是目录对照,没有具体承接关系 | 使用能力节点 + 需求 ID + 架构结果 + 成立理由 |
| 每条 F 单独复制一行所有关联 ID | 表极长且重复正式 00 内部追溯 | 按 C-MI-1~5 分组,再用命名空间反向覆盖审计 |
| 所有 TM-MI-001~010 都各建 ADR | 把机制清单当 ADR | 聚合为 7 个长期结构决定 |
| 直接把 ADR-0005 全文视为 authority | 含固定 Role、工具、性能、CI / registry 旧污染 | 只索引正式 00 已核验的锁定范围 |
| 为项目内决定创建仓外 ADR 占位 | 超出本项目写入范围且伪造文件状态 | 仅使用 `ADR-MI-*` 项目内稳定索引编号 |
| Pending exact seam 进入 ADR | 未形成稳定决定 | 保留在 §15 风险 / 待确认和 §16 漏项表 |
| 追溯矩阵全部写“已覆盖” | 掩盖 exact contract 与量化缺口 | 主矩阵写已成立映射,漏项表写 unresolved trace |

## 5. 改动前后对比

| 维度 | 装饰性索引 / 追溯 | 当前结论 |
|---|---|---|
| 主轴 | 章节号、文件名、技术词 | 需求结论 -> 架构结果 -> 正式落点 -> 成立理由 |
| 粒度 | 每 ID 一行或大类“全覆盖” | 五核心节点 + 跨节点 / 外围 / 风险,反向校验全集 |
| ADR | ADR 文件清单 | 关键长期决定及所解决问题 |
| Existing ADR | 全文继承 | 只继承经正式 00 核验的 scoped decision |
| Project decisions | 无编号或伪外部文件 | 项目内稳定 `ADR-MI-*` 索引,无文件 claim |
| Gaps | 隐藏为 pending | Exact seam、scope / product、量化和 historical audit 显式 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 逐个列出正式 00 的所有 ID | 最细 | 大量重复,难看出架构承接主线 | 不采用 |
| 只列 C-MI-1~5 | 简洁 | DEP / NFR / VETO / enhancement / risk 会成为孤儿 | 不采用 |
| 节点级主矩阵 + 命名空间反向覆盖 + gap 表 | 可读且可证明全集 | 需要三张互补表 | 采用 |
| 仅索引 existing ADR-0005 | 不新增编号 | 七项长期架构决定缺少稳定索引 | 不采用 |
| 为每个机制或 future 选项建 ADR | 看似完整 | 普通选择与未定事项误入 | 不采用 |
| 1 个 existing ADR + 7 个 project-local decision indexes | 兼顾既有 authority 与本项目长期决定 | 后续若另建 ADR 文件需再校准索引 | 采用 |

## 7. 结构化中间产物

### 7.1 需求追溯矩阵

| 需求来源 | 需求结论 / 约束 | 架构承接结果 | 承接位置 | 说明 |
|---|---|---|---|---|
| `TR-MI-001`;正式 00 §2~4:`P-MI-001~009`,`G-MI-001~007`,`NG-MI-001~015` | 本仓必须是独立 image asset / supply truth owner,且不得吞并 Role、member、runtime / tools、live state、Artifact、container、Sandbox、governance、observability、product / infra truth | AG-MI-001~008、IC-MI-001~011、职责 do / consume / coordinate / forbid、系统上下文与边界红线 | 正式 01 §2~5、§8、§15 | 需求定位被转译为 owner、系统边界和依赖红线,不是复述非目标清单。 |
| `TR-MI-002`;正式 00:`C-MI-1`,`US-MI-001~003`,`F-MI-001~003`,`BR-MI-001~005`,`D-MI-001~005`,`IF-MI-001/002`,`NFR-MI-001~003`,`AC-MI-001~005` | Variant / persona definition 必须回指唯一正式 mapping source,异常显式且 trace body-free | BC-MI-01 / 05、LS-MI-01、IX-MI-01、TM-MI-001/006/007、source fail-closed | 正式 01 §6、§8~11、§13 | Core definition truth 与 mapping source shadow 分离,同时承接来源、数据、交互和质量要求。 |
| `TR-MI-003`;正式 00:`C-MI-2`,`US-MI-004~006`,`F-MI-004~006`,`BR-MI-006~010`,`D-MI-006~012`,`IF-MI-003/004`,`NFR-MI-004~006`,`AC-MI-006~010` | Member / runtime / tools / extras / base / seed 必须形成完整 pinned static baseline,与 live state 分离并保留 derivation / revision history | BC-MI-01 / 05、LS-MI-02、TM-MI-002/006、XC-MI-001/003/009 | 正式 01 §4、§6、§8~11、§13 | Assembly 只拥有 pin / placement / derivation,物理装配不转移 component / seed owner。 |
| `TR-MI-004`;正式 00:`C-MI-3`,`US-MI-007~009`,`F-MI-007~009`,`BR-MI-011~015`,`D-MI-013~018`,`IF-MI-005~008`,`NFR-MI-007~009`,`AC-MI-011~015` | Nightly / 获准输入必须形成受控 intent、immutable attempt snapshot 与 candidate / failure / unknown 分层 | BC-MI-02 / 05、LS-MI-03、IX-MI-02、TM-MI-002/003/008/009、conditional inbound event | 正式 01 §6~11、§13 | Adapter / event outcome 只作为输入,本地 candidate decision 与后台长时工作分别成立。 |
| `TR-MI-005`;正式 00:`C-MI-4`,`US-MI-010~012`,`F-MI-010~012`,`BR-MI-016~020`,`D-MI-019~025`,`IF-MI-009~011`,`NFR-MI-010~012`,`AC-MI-016~020` | Candidate digest / provenance 必须连续,applicable gate fail closed,image eligibility 与 Artifact handoff 分层 | BC-MI-03 / 05、LS-MI-03/04、IX-MI-03、TM-MI-003~006/009/010、XC-MI-002/003 | 正式 01 §6、§8~11、§13、§15 | 本仓基于正式 ref / safe conclusion 形成 eligibility,不拥有 evidence / policy / Artifact truth。 |
| `TR-MI-006`;正式 00:`C-MI-5`,`US-MI-013~015`,`F-MI-013~015`,`BR-MI-021~025`,`D-MI-026~030`,`IF-MI-012~014`,`NFR-MI-013~016`,`AC-MI-021~025` | 只有 eligible pinned version 可进入 availability;publish / replace / rollback / retire 显式,entry / handoff / consumer gap 分层 | BC-MI-04 / 05、LS-MI-04、IX-MI-04~06、TM-MI-003/004/006/008~010 | 正式 01 §6、§8~11、§13、§15 | Local supply decision 与 Artifact / Member Service / container state 分域,入口 resolve 不承诺实例已运行。 |
| `TR-MI-007`;正式 00 §6/12:`DEP-MI-001~016`,`AC-MI-027`,`VETO-MI-007` | 跨仓关系必须按 compile / runtime / event / ref / adapter / fake 分类,消费不自动成为源码或 source dependency | 五类依赖角色、Core compile 白名单、跨仓裁剪三表、向内 port / adapter 与禁止依赖表 | 正式 01 §5、§7~10、§13 | 需求 seam 被转译为具体依赖方向和 anti-corruption boundary,同时保留 pending active edge。 |
| `TR-MI-008`;正式 00 §13/14:`NFR-MI-017~022`,`AC-MI-026~029`,`VETO-MI-001~007` | 五节点必须连续可追;安全、可用、性能、审计、一致性、可观测与否决条件跨主线成立 | TM-MI-001~010、XC-MI-001~010、局部强一致 / 跨 owner 有界最终一致、safe domain observability | 正式 01 §9~15 | 全局质量被提升为作用于多个 BC / interaction 的结构约束,没有伪造数值或测试结果。 |
| `TR-MI-009`;正式 00 外围:`US-MI-E01~E05`,`F-MI-E01~E05`,`BR-MI-E01~E03`,`D-MI-E01~E04`,`IF-MI-E01~E03`,`AC-MI-030` | Multi-arch、restricted、fast rebuild、hardened base 与 usage summary 不进入 current core,启用仍受核心边界 | 条件型范围扩展车道、ET-MI-006~008、truth / projection / owner 不变量 | 正式 01 §3、§14、§15 | 架构承接方式是明确挂起和进入条件,不是将 enhancement 宣称为 planned / ready。 |
| `TR-MI-010`;正式 00 §15:`R-MI-001~010`,`MI-UP-001~009`,`Q-MI-001~004` | 风险与 owner-controlled open conditions 必须显式,受影响 positive lane 不得脑补 | R / AR 风险表、待确认表、owner / closure evidence 与推进上限 | 正式 01 §14~16 | 未关闭项被保留为正式 gap,而不是用产品中立语义掩盖 positive contract 缺失。 |
| `TR-MI-011`;正式 00 §5/8 与 `HR-MI-001~005` | 维护、构建 / 发布、安全、审计和恢复角色需要可解释的领域结果,但不获得外部 truth owner | IX-MI-01~06、safe domain conclusions、projection / gap query、同步判断与后台承接 | 正式 01 §2、§5、§7、§10、§13 | Human role 的需要落到可见的 decision / trace / gap,不会把用户角色画成领域 owner。 |
| `TR-MI-012`;accepted `ADR-0005` + 正式 00 §1/7/9/12 | Role 运行环境在构建期预装;nightly 保留;Role -> variant mapping 归 Method Library;production entry pinned 且禁 `latest` | BC-MI-01/02、ADR-driven nightly intent、immutable pin、Method source boundary、条件演进车道 | 正式 01 §1~3、§6、§10~11、§14、§17 | 只承接 accepted ADR 经正式 00 核验的决定,不承接固定 Role / 工具 / 时延 / 大小 / CI / registry 内容。 |

### 7.2 需求命名空间反向覆盖

| 需求命名空间 | 正式范围 | 主承接行 | 反向检查结论 |
|---|---|---|---|
| Problem / goal / non-goal | P-MI-001~009;G-MI-001~007;NG-MI-001~015 | TR-MI-001;TR-MI-007~010 | 无孤儿;边界外事项未被架构化。 |
| Human roles | HR-MI-001~005 | TR-MI-011 | 无孤儿;角色需要由 interaction / trace 承接,不转为 owner。 |
| Core capability | C-MI-1~5 | TR-MI-002~006 | 无孤儿;分别映射 BC-MI-01~04,BC-MI-05 跨节点支撑。 |
| Core user stories / functions | US-MI-001~015;F-MI-001~015 | TR-MI-002~006 | 无孤儿;每组三项对应一个能力节点。 |
| Core business rules | BR-MI-001~025 | TR-MI-002~006 | 无孤儿;每节点五条规则转译为 owner / invariant / change / audit。 |
| Core data | D-MI-001~030 | TR-MI-002~006;TR-MI-008 | 无孤儿;truth / snapshot / ref / forbidden body 均有架构归属。 |
| Core interfaces | IF-MI-001~014 | TR-MI-002~006 | 无孤儿;只映射能力交互类别,不私造 protocol / schema。 |
| Dependencies | DEP-MI-001~016 | TR-MI-007;TR-MI-009/010 | 无孤儿;future / pending edge 保持非 active。 |
| Node NFR / AC | NFR-MI-001~016;AC-MI-001~025 | TR-MI-002~006 | 无孤儿;每节点同时有结构质量与失败上限。 |
| Global NFR / AC / VETO | NFR-MI-017~022;AC-MI-026~030;VETO-MI-001~007 | TR-MI-008/009 | 无孤儿;`pass` 是设计判断,不是验收执行。 |
| Enhancement US / F / BR / D / IF | US-MI-E01~E05;F-MI-E01~E05;BR-MI-E01~E03;D-MI-E01~E04;IF-MI-E01~E03 | TR-MI-009 | 无孤儿;全部 conditional / future,不进核心分母。 |
| Risks / upstream / questions | R-MI-001~010;MI-UP-001~009;Q-MI-001~004 | TR-MI-010 | 无孤儿;仍在正式 §15 / §16 作为 open / gap。 |
| Accepted ADR constraints | ADR-0005 scoped locks | TR-MI-012 | 无污染继承;只有正式 00 已核验部分进入。 |

### 7.3 架构结果反向来源审计

| 架构结果 | 正式来源 | 追溯状态 | 说明 |
|---|---|---|---|
| AG-MI-001~008 / IC-MI-001~011 | P / G / NG、C-MI-1~5、VETO、ADR-0005 | closed_for_architecture | 目标与约束均有需求或 accepted ADR 来源。 |
| BC-MI-01~05 / LS-MI-01~04 | C / F / BR / D 与 owner boundary | closed_for_architecture | 每个语义单元均有能力、数据和非职责来源。 |
| 三类处理角色 / 两类状态承载 | IF / DEP / NFR 与 Step 5 semantic boundaries | closed_for_architecture | 只表达运行职责,未产生实现进程 claim。 |
| 五类依赖角色 / cross-repo crop | DEP-MI-001~016、NG / VETO、全局裁剪规则 | closed_with_pending_edges | 方向与类型成立;MI-UP exact edge 仍不 active。 |
| 数据 owner / consistency / recovery | D-MI-001~030、BR、NFR、AC / VETO | closed_for_architecture | 无跨 owner shared transaction 或第二 truth。 |
| IX-MI-01~06 | IF-MI-001~014、NFR / AC、failure upper bounds | closed_with_pending_contracts | 方式和失败语义成立;protocol / exact contract 不伪造。 |
| TM-MI-001~010 | P / G / BR / D / NFR / VETO + Step 7~9 | closed_for_architecture | 均解决结构问题,不是产品清单。 |
| XC-MI-001~010 | NFR-MI-001~022、AC-MI-026~029、VETO | closed_for_architecture | 横切范围与判断口径可追,无量化伪值。 |
| ED-MI-001~005 / ET-MI-001~009 | NG-MI-013~015、R-MI-003/009/010、MI-UP / Q | closed_as_evolution_constraints | 它们是债务 / trigger 分析,不是 planned implementation。 |
| AR-MI-001~004 | R / VETO 与 Step 5~13 cross-audits | closed_as_open_risks | 是架构风险,不新增需求或任务。 |

### 7.4 追溯缺口表

| 追溯缺口类型 | 对象 / 缺口 | 影响范围 | 当前状态 | 说明 |
|---|---|---|---|---|
| External contract 未闭环 | MI-UP-001~007 对应 mapping / component / seed / Core / event / Artifact / consumer exact seams | BC-MI-01~04、compile / runtime / event / ref / adapter、IX-MI-01~05 | `pending_owner_input`;positive relationship blocked | 架构 port / failure 有来源,但 exact source-to-contract-to-positive-result 链不能主观补齐。 |
| Future / absent authority | MI-UP-008/009 的 hardened base 与 outbound event | Conditional derivation 与 event output | `future_or_absent`;不进入 current graph | 需求只要求挂起 / 禁止当前输出,没有 active architecture relation 可闭环。 |
| Formal decision 未闭环 | Q-MI-001~004 的范围、模型、产品和 gate inventory | Evolution、adapter / config、eligibility | `pending_formal_decision`;current conservative boundary | 这不是遗漏,但相关 positive architecture detail 当前不能进入主矩阵。 |
| Quantitative trace 缺口 | NFR-MI-001/013/017 等 performance / capacity / retention 数值 | XC-MI-004/007/008、后续 04~06 | `no_authoritative_baseline`;只保留离散判断 | 没有 workload / measurement 来源,因此不能构造目标值或 evidence trace。 |
| Historical pollution 审计待执行 | 旧正式 `01-架构设计.md` 尚未进入后置来源比对 | Step 16 正式装配与 R-MI-008 | `deferred_to_step_16`;不得继承 | 只有 Step 15 完成后才允许读取,当前不能提前声称无污染。 |

### 7.5 ADR 索引

| ADR 编号 | 架构决策 | 解决的问题 | 关联主线 | 说明 |
|---|---|---|---|---|
| `ADR-0005` | Role 运行环境采用构建期预装与 nightly 形成镜像,Role -> variant mapping 归 Method Library,production version pinned 且禁 `latest` | 避免启动时动态装配、mapping hardcode 和 mutable production entry | 需求基线 / 定义与装配 / build intent / supply identity | Existing accepted ADR;只索引正式 00 已核验的锁定范围,固定 Role、工具、数字和产品不继承。 |
| `ADR-MI-001` | 以独立镜像域控制面拥有 definition / candidate / eligibility / availability truth,四阶段 decision 分别成立 | 防止 CI / registry / Artifact / consumer 共同拼接单一 ready 状态 | 职责 / BC / 数据一致性 / 方案主线 | 决定本仓为何独立以及核心 failure / owner 结构,长期影响全部后续设计。 |
| `ADR-MI-002` | 外部 truth 只经 ref / snapshot / safe conclusion / product-neutral adapter 向内承接,compile 仅正式 Core shared contract | 防止外部 body / SDK / package dependency 反向统治镜像域 | 系统边界 / 依赖方向 / 数据 / 横切安全 | 同时保护 owner、依赖裁剪和产品可替换性,不是单接口实现偏好。 |
| `ADR-MI-003` | Necessary assembly 与 attempt input immutable pinned,candidate digest 绑定完整 provenance,applicable gate authority-driven fail closed | 防止输入漂移、无来源 digest 和未知 gate 被默认通过 | Assembly / candidate identity / eligibility / security | 定义 candidate 与 eligible image 成立的长期身份和资格条件。 |
| `ADR-MI-004` | Image eligibility / availability、Artifact formalization、consumer / container state 分域,本仓只供给 pinned entry 或 gap | 防止镜像 ready 冒充 Artifact、launch、confirmation 或 live health | Data owner / supply / handoff / consumer boundary | 下游合同演进时仍必须保持三域状态独立,值得单独长期保留。 |
| `ADR-MI-005` | Revision / attempt / evaluation / availability 采用 append / supersede / explicit transition history,truth 与 projection 分离 | 防止恢复覆盖历史或只读视图成为第二写源 | Consistency / recovery / trace / derived views | 只锁 history semantics,不预选 event sourcing、outbox 或 storage。 |
| `ADR-MI-006` | 本地即时领域判断与长时 build / gate / handoff 后台承接分离;event 仅 conditional inbound,当前无 outbound authority | 防止同步 accepted 伪装完成或 event carrier 成为 truth | Deployment roles / interaction / availability / event boundary | 决定关键通信性格,不等于选择 queue、scheduler 或 transport。 |
| `ADR-MI-007` | BC 保持语义边界且不机械映射服务 / 数据库,当前允许同部署,仅由正式 workload / isolation measurement 驱动拆分 | 防止无依据分布式化和后续反向以部署定义 domain | BC / deployment / dependency / evolution | 长期保护语义与 carrier 分离,同时留下有条件扩展路径。 |

`ADR-MI-001~007` 是本文内的稳定架构决策索引编号。它们不声明 `architecture/adr/` 下已有对应文件,也不表示 commit、implementation、review signoff 或 runtime evidence 已存在。

### 7.6 ADR 来源、架构单元与取舍追溯

| ADR | 已停审架构单元 / 审计 | 需求 / 约束来源 | 取舍 / 风险来源 | gate_status |
|---|---|---|---|---|
| ADR-0005 | BC-MI-01/02;IX-MI-02;Step 1 source audit | 正式 00 G-MI-002~004、BR-MI-006/011/021、TR-MI-012 | ADR-0005 §4/6;R-MI-001/002/008 | pass |
| ADR-MI-001 | BC-MI-01~05;Step 5/8/11 cross-audits | P-MI-001/005~008、G-MI-001/004~007、C-MI-1~5 | Step 11 mainline vs declaration / single lifecycle;R-MI-004~006、AR-MI-002 | pass |
| ADR-MI-002 | BC-MI-01~05;Step 7/8 cross-audits | NG-MI-001~012、DEP-MI-001~016、VETO-MI-003/007、IC-MI-001~005/010 | TM-MI-001/009;R-MI-001/003/007、AR-MI-003 | pass |
| ADR-MI-003 | BC-MI-01~04;Step 8/12 audits | G-MI-003~005、BR-MI-006/012/016~018/021、NFR-MI-019/020 | TM-MI-002/004/005;R-MI-002/004/005 | pass |
| ADR-MI-004 | BC-MI-03~05;IX-MI-03~05;Step 8/9 audits | G-MI-006/007、BR-MI-019/021~025、D-MI-024~030、VETO-MI-005/006 | TM-MI-010;R-MI-005/006、MI-UP-001/007/009 | pass |
| ADR-MI-005 | BC-MI-01~05;Step 8/12 audits | BR-MI-003/009/014/019/022/025、NFR-MI-020/021 | TM-MI-006/007;Step 11 reject full ES;AR-MI-003 | pass |
| ADR-MI-006 | All BC interaction audits;Step 6/9/12 | IF-MI-001~014、NFR-MI-001/007/013/017/018、MI-UP-005/009 | TM-MI-008;Step 11 reject event-first / on-demand;R-MI-004/006/009 | pass |
| ADR-MI-007 | BC-MI-01~05;Step 5~7/13 audits | NG-MI-013、NFR-MI-017/022、AC-MI-027/029 | Step 11 reject per-stage services;ED-MI-001/002、AR-MI-001 | pass |

每个 `pass` 只表示决定达到长期索引门禁:值得保留、有正式来源、回指已停审架构结构且无新增结论。它不证明决定已由代码、部署、测试或运行证据实现。

### 7.7 不进入 ADR 索引的事项

| 事项 | 不进入原因 | 正确放置 |
|---|---|---|
| Builder / registry / evidence / scanner / signer / secret store 产品 | Q-MI-003/004 或实现 / 配置层,未形成长期架构决定 | 正式 §15 pending;后续 04 |
| Schema、DTO、route、event family、database、language、queue、cache | 实现载体或 MI-UP exact contract | 后续 02~04;当前 gap |
| Per-stage services / multi-region / autoscaling | 无 workload / isolation measurement | ED-MI-001/002;ET-MI-005 |
| Full event sourcing / outbox | 当前明确不采用,缺 replay requirement / event authority | Step 11 alternative;ED-MI-005 |
| Outbound build / publish event | MI-UP-009 无 authority | 正式 §15 absent authority |
| Restricted / multi-arch / hardened-base / usage-summary choices | Conditional / future scope 尚未裁定 | 正式 §14/15 evolution / open |
| 固定 Role 枚举、工具清单、冷启动 / 镜像大小数字 | ADR-0005 historical content 未被正式 00 继承 | R-MI-008 historical pollution |
| Run、digest、report、evidence、test、verdict、signoff | 系统事实且当前不存在 | 后续 implementation / verification ledger,不得建 ADR |

### 7.8 架构决定逐项停审

| 决定 | 值得长期保留 | 有正式来源 | 回指已停审架构单元 | 无未确认项升格 | 无实现选择污染 | gate_status |
|---|---|---|---|---|---|---|
| ADR-0005 scoped | pass | pass | pass | pass | pass | pass |
| ADR-MI-001 | pass | pass | pass | pass | pass | pass |
| ADR-MI-002 | pass | pass | pass | pass | pass | pass |
| ADR-MI-003 | pass | pass | pass | pass | pass | pass |
| ADR-MI-004 | pass | pass | pass | pass | pass | pass |
| ADR-MI-005 | pass | pass | pass | pass | pass | pass |
| ADR-MI-006 | pass | pass | pass | pass | pass | pass |
| ADR-MI-007 | pass | pass | pass | pass | pass | pass |

### 7.9 跨 ADR / 需求追溯审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 孤儿核心需求 | pass | C / US / F / BR / D / IF / NFR / AC 全部按五节点承接。 |
| 孤儿跨节点约束 | pass | DEP / global NFR / VETO / risk / open 均有独立行。 |
| 孤儿架构判断 | pass | AG / IC / BC / LS / runtime roles / dependency / data / IX / TM / XC / ED / ET / AR 均有来源。 |
| ADR 长期性 | pass | 8 项均改变 owner、identity、consistency、interaction 或 evolution 主线。 |
| 普通实现选择误入 | pass | 产品、schema、语言、存储、queue、service count 和数字均排除。 |
| 取舍缺来源 | pass | 每项 ADR 回指 Step 10~13 的 mechanism / alternative / debt。 |
| Existing ADR 污染 | pass | ADR-0005 固定 Role / 工具 / 数字 / 产品未继承。 |
| Pending 升格 | pass | MI-UP / Q 只在 gap、风险或 trigger 中,未成为 accepted decision。 |
| 新增未确认结论 | pass | ADR-MI-* 只聚合 Step 1~14 已停审决定。 |
| Readiness / evidence | pass | 无外部 ADR file、implementation、run、artifact、test、verdict 或 signoff claim。 |

### 7.10 决策与追溯边界说明

主追溯矩阵按能力节点和跨节点约束聚合,因为正式 00 已在其 §16 完成更细的 F -> US / BR / D / AC 内部映射;反向覆盖表负责证明聚合没有漏项。ADR 索引只保留会长期改变 owner、身份、一致性、交互或演进路径的决定,不重复主矩阵或机制清单。项目内 `ADR-MI-*` 是稳定决策编号而非仓外文件声明。Exact contract 与量化缺口继续留在漏项 / 风险表,不能为了矩阵整齐而主观补齐。

## 8. 回填草稿

正式 01 §16 回填 §7.1 主追溯矩阵、§7.2 命名空间反向覆盖、§7.3 架构来源审计、§7.4 缺口和 §7.10 中与追溯相关的边界。正式 §17 回填 §7.5 ADR 索引、§7.6 来源 / 架构单元 / 取舍摘要、§7.7 排除边界和 §7.10 中与 ADR 相关的边界。逐项停审和跨审计保留在 calibration,正式章只写结果。

## 9. 待确认事项

- Step 15 不关闭 §7.4 的任何 trace gap;它们继续由 MI-UP-001~009、Q-MI-001~004、R-MI-008/009 管理。
- `ADR-MI-001~007` 是项目内正式架构决策索引,当前不创建 `architecture/adr/` 文件,也不声明外部 review / signoff。
- 若未来创建独立 ADR 文件,编号 / scope / status 必须重新校准,不能从本索引推导文件已存在。
- ADR-0005 只承接正式 00 已核验的 scoped locks,旧固定 Role、工具、数字和产品仍是 historical pollution。
- `L2-member` / `L2-member-service` 进行中架构不能关闭 trace gaps 或改变本步来源映射。
- 本 Step 完成后才允许读取旧正式 01;此前没有 historical content acceptance 结论。
- 当前没有实现仓、commit、run、digest、report、evidence、测试、verdict、signoff 或 readiness 事实。

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 需求来源 -> 架构结果 -> 正式位置 -> 理由是否完整 | pass |
| 正式 00 全部需求命名空间是否无孤儿 | pass |
| 架构结果是否均有正式需求 / ADR / 风险来源 | pass |
| Trace gap 是否显式且未被“已覆盖”掩盖 | pass |
| 8 项 ADR 是否逐项回指单元、来源、取舍与风险 | pass |
| 是否无普通实现选择、pending 升格或新结论 | pass |
| 跨 ADR / 需求追溯审计是否无 unresolved 冲突 | pass |

`gate_status = pass`;允许更新 flow / ledger 后读取旧正式 01 并创建 Step 16。不得先修改正式 01,也不得进入 02。
