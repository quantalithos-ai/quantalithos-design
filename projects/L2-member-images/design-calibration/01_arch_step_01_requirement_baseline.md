# Step 1. 确认需求基线

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `requirement_baseline` | pass | 正式 00 已停审;五节点能力、owner 红线、四类数据、六类 seam 与开放条件足以约束架构推导 | 进入 Step 2 架构目标与约束 | `../00-需求文档.md`;`00_req_step_16_traceability_matrix.md`;`00_req_step_15_risks_open_questions.md`;accepted ADR / owner baselines |

### 1.1 Step 内计划

- [x] 读取项目 ledger、01 flow、架构 SOP Step 1 与书写规范相关章节。
- [x] 以正式 `00-需求文档.md` 为本仓唯一直接需求基线。
- [x] 核对 accepted ADR、全局依赖规则和当前 owner 正式输入。
- [x] 按 C-MI-1~5 提炼影响边界、数据、依赖和一致性的稳定结论。
- [x] 将 MI-UP-001~009、Q-MI-001~004 原样带入开放条件,不伪关闭。
- [x] 区分 core、conditional、future 和 excluded 范围。
- [x] 形成需求基线、架构硬约束和未关闭风险三类结构化产物。
- [x] 后置诊断 draft / README 候选线索;旧正式 01 留到 Step 16 污染审计。
- [x] 完成 owner、live-state、依赖类型和 readiness 自检。

## 2. 本步输入

| 输入 | Authority / 状态 | 本步承接 |
|---|---|---|
| `../00-需求文档.md` | 本仓正式需求基线;`calibration-complete / review-pending` | 定位、C-MI-1~5、F / BR / D / DEP / NFR / AC / VETO、开放条件 |
| `00_req_step_16_traceability_matrix.md` | 需求主矩阵已通过 | 检查进入架构的能力无孤儿 |
| `00_req_step_15_risks_open_questions.md` | 风险与开放条件已分层 | 保留 R-MI-001~010、MI-UP-001~009、Q-MI-001~004 |
| `architecture/adr/0005-member-image-per-role.md` | accepted ADR | 构建期预装、nightly、一 Role 一镜像、方法库映射、pinned、禁 `latest` |
| Runtime / Tools 正式 00~07 | 正式停审基线 | 排除 runtime loop / tool execution;只消费未来正式 pinned component ref |
| Method Library 正式 00~07 | owner 基线 | RoleDefinition 与 Role -> image variant 来源归其所有;exact surface pending |
| Artifact 正式 00~07 | owner 基线 | Artifact fact / version / lineage / baseline 与消费引用边界;image handoff pending |
| Sandbox 正式 00~07 | owner 基线 | 隔离 policy / backend / execution 不归本仓;hardened base future-only |
| Member / Member Service 当前正式链与台账 | 同窗口输入 | 只固定供给 / 消费方向;未停审架构内容仍为 pending |
| Core 当前正式链与台账 | shared contract authority | 未发现 image-specific shared schema;MI-UP-004 保持开放 |
| `../draft/` 与旧 README | non-normative / historical | 只作候选线索和污染诊断 |
| 旧正式 `../01-架构设计.md` | historical material | 本步不读取;Step 16 独立结论形成后才审计 |

## 3. SOP 问题回答

1. 当前架构设计依赖哪些需求结论?

   回答:依赖本仓是成员镜像资产与构建产物供给层、C-MI-1~5 五节点能力必须闭合、静态输入必须 pinned 且与 live state 分离、候选必须绑定 digest / provenance、适用 gate 必须 fail closed、availability 与下游消费状态必须分层,以及相邻 truth 只能以 ref / snapshot / safe conclusion 进入。

2. 哪些结论已经稳定?

   回答:仓级定位和禁止职责、五节点逻辑前置、Role mapping owner、镜像域数据 owner、nightly 与生产禁 `latest`、四类数据边界、六类依赖分类、adapter outcome 不等于 domain outcome、历史不得原地覆盖均已稳定。

3. 哪些结论仍待确认?

   回答:MI-UP-001~009 与 Q-MI-001~004 仍开放。它们分别限制 exact consumer / producer contract、shared schema、event lane、component / seed refs、Artifact handoff、hardened base、outbound events 及外围范围和具体 evidence / product 选择。

4. 哪些需求直接影响架构边界?

   回答:C-MI-1~5 要求本仓内部能分别承载受控定义、装配基线、构建候选、资格判定和供给入口责任;NG-MI-001~015 要求这些责任不能吞并 Role、member、runtime、tools、Artifact、container、Sandbox、governance、observability 或基础设施产品 truth。

5. 哪些需求直接影响数据所有权?

   回答:镜像定义与来源 binding、assembly revision、build intent / attempt / snapshot / outcome、provenance binding、image eligibility、availability transition 与 pinned entry 是本仓 truth;上游目录摘要是 snapshot;外部对象只保留 ref;相邻正文、live state、secret、container / observed state 禁止保存。

6. 哪些需求直接影响依赖方向或一致性策略?

   回答:只有正式 Core shared contract 可成为 compile dependency;其余关系必须按 runtime / event / ref / adapter / fake 分类。单一写入语境内维护镜像域不变量,外部来源与适配器结果采用带来源状态的保守协调;unknown、stale 或 gap 不得升级为 positive truth。

## 4. 当前材料问题诊断

| 候选材料口径 | 问题 | 当前处理 |
|---|---|---|
| draft 的九个实现导向组件 | 容易把架构责任直接固化为服务 / 模块数量 | 只作线索;Step 5 从需求重新推导语义上下文 |
| “CI 构建、扫描、签名、推送”流水线 | 把产品和具体 evidence kind 写成领域架构 | 只保留 intent、attempt、outcome、applicable gate 和 adapter 边界 |
| member-service 按 Role 直接解析 mapping | 形成第二 mapping 消费路径 | 下游只消费本仓未来 pinned entry;exact contract 继续 MI-UP-001 |
| 镜像发布即 Artifact 已发布 | 混写 image eligibility / availability 与 Artifact truth | 分层表达;MI-UP-007 关闭前无正式 Artifact ref 声明 |
| registry push 成功即镜像可用 | adapter success 冒充 domain eligibility / availability | adapter outcome 仅作受控输入,资格和供给由本仓判定 |
| seed 含“默认 memory / workspace” | 易把模板 / 初始材料误写为 live state | 只允许 pinned template ref、placement 与静态安全结论 |
| 固定 Role 数、架构枚举、时延、大小、保留天数 | 缺少当前 authority / measurement baseline | 不进入架构硬事实;范围或量化继续开放 |
| 旧正式 01 | full-restart 下存在污染风险 | 此时不读取;Step 16 后置审计并从空骨架重建 |

## 5. 改动前后对比

| 维度 | 旧 / 候选口径 | 当前基线 | 原因 |
|---|---|---|---|
| 架构主线 | 按 CI / registry / scanner 等实现步骤拆分 | 按五个镜像域责任阶段推导 | 保持技术与产品中立 |
| Mapping | 本地表或下游直接查询 | 方法库唯一 truth;本仓保留来源 binding / validation | 防止第二真相 |
| 装配 | 复制组件和模板正文 | pinned ref + placement + immutable snapshot | 物理装配不转移语义 owner |
| 构建结果 | success / failure 二分 | candidate / failed / blocked / unknown 分层 | 防止不确定结果被报可用 |
| 资格与制品 | 镜像门禁等于 Artifact 发布 | image eligibility 与 Artifact handoff 分层 | 保持双域 owner 唯一 |
| 供给与运行 | publish 等于容器可启动 | local availability / entry / handoff / consumer truth 分层 | 不拥有 container lifecycle |
| 依赖 | 消费关系推导源码依赖 | 六类 seam 逐项分类 | 执行全局裁剪规则 |
| 开放项 | 以 TODO 或默认产品补齐 | pending / blocker / conditional / future 显式 | 不伪造 readiness |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 直接按 draft 九模块进入架构 | 结构现成 | 过早实现化,可能重复 owner 并预设部署 | 不采用 |
| 以 registry 中存在的镜像作为供给 truth | 查询简单 | mutable tag、adapter 与领域事实混写 | 不采用 |
| 以五节点能力链推导语义责任,外部系统均显式设 seam | 可追溯到正式 00,便于 fail-closed | 需要后续逐步收敛上下文与通信 | 采用 |
| 因 exact contracts 未闭口而停止全部架构设计 | 最保守 | 稳定 owner / fail-closed 边界无法先行落定 | 不采用;只阻塞受影响 positive lane |
| Step 1 同时选择 builder / registry / evidence 产品 | 可快速形成部署图 | 超出需求基线并侵入 Step 10 / 配置设计 | 不采用 |

## 7. 结构化中间产物

### 7.1 需求基线结论

| ID | 稳定需求结论 | 架构承接 |
|---|---|---|
| `RB-MI-001` | 本仓是成员镜像资产层与构建产物供给层的唯一镜像域 owner | 内部责任必须覆盖定义到入口,不得退化为 CI 脚本或 registry 索引 |
| `RB-MI-002` | RoleDefinition 与 Role -> variant mapping truth 归 Method Library | 本仓只形成 mapping source binding、snapshot 和 validation conclusion |
| `RB-MI-003` | Variant / persona 装配由 pinned member / runtime / tools / extras / base / seed 静态输入组成 | 架构必须隔离装配 truth、外部 refs 与物理 materialization |
| `RB-MI-004` | Template / seed / build input 与 secret / live memory / checkpoint / workspace live content 必须分离 | 任何架构单元均不得提供 live-state ingress 或持久化边界 |
| `RB-MI-005` | Nightly 是当前构建意图来源;其他变化 / event 需 authority | 架构保留 trigger normalization 与 pending event seam,不声称 event ready |
| `RB-MI-006` | 每个 attempt 必须绑定唯一 intent、variant revision 和 immutable input snapshot | 架构必须能区分交接、执行 outcome 和 domain candidate formation |
| `RB-MI-007` | Candidate digest / provenance 必须回指全部正式来源;适用 gate fail closed | 架构必须分开 provenance binding、gate input 和 image eligibility |
| `RB-MI-008` | Artifact fact / version / lineage / baseline 不归本仓 | 只消费正式 Artifact ref;image-specific handoff gap 显式 |
| `RB-MI-009` | Availability、publish / replace / rollback / retire 与 pinned entry 归本仓 | 供给历史不得依赖 mutable selector 或被下游状态反写 |
| `RB-MI-010` | Member Service 只应消费可验证 pinned entry | 本仓提供供给边界,不拥有 container 创建、健康或升级决定 |
| `RB-MI-011` | 仅正式 Core shared contract 可形成 compile dependency | 每条跨仓关系必须标注 compile / runtime / event / ref / adapter / fake |
| `RB-MI-012` | 多架构、收缩 variant、hardened base、usage summary 为 conditional / future | 不进入当前核心架构完成分母 |

### 7.2 架构硬约束结论

| ID | 硬约束 | 主要影响章节 |
|---|---|---|
| `HC-MI-001` | 不拥有 Role / mapping、member、runtime loop、tool execution / capability registry 或 adapter truth | §4~6、§8~10 |
| `HC-MI-002` | 不拥有 live memory / checkpoint、container lifecycle、Sandbox、governance、observability、marketplace 或 product truth | §4~6、§8~10、§13 |
| `HC-MI-003` | 不拥有 Artifact 通用 version / lineage / baseline;image 状态不得冒充 Artifact 状态 | §8~10 |
| `HC-MI-004` | 所有必要静态输入必须 verified、pinned、complete;生产禁止 `latest` 和 mutable selector | §3、§8~10、§13 |
| `HC-MI-005` | Secret 和任何 runtime live / observed body 都不得进入 definition、snapshot、candidate 或 supply | §4、§9、§13 |
| `HC-MI-006` | Adapter acceptance / push / lookup success 不等于 candidate、eligibility、availability 或 consumption success | §7~10、§12~13 |
| `HC-MI-007` | Missing / stale / conflict / unverifiable / unknown / gap 必须 fail closed,不得 fallback | §8~10、§13 |
| `HC-MI-008` | Revision、attempt、eligibility 与 availability 变化必须显式并保留历史,不得原地覆盖 | §6、§9~10、§13 |
| `HC-MI-009` | 非 Core 关系不得自动形成源码依赖;fake 只能提供设计 / 测试切口 | §7~8、§10 |
| `HC-MI-010` | 未闭口 authority 只能形成 pending / blocked / unavailable / gap,不得形成 positive readiness | 全文,重点 §10、§14~17 |

### 7.3 未关闭需求风险结论

| 条件 | 影响的架构判断 | 当前上限 | 是否阻塞 Step 2 |
|---|---|---|---|
| `MI-UP-001~003` | consumer entry、member component、method mapping 运行期边界 | 可固定端口语义和失败上限;不可固定 exact contract / positive integration | 否 |
| `MI-UP-004~006` | Core compile contract、build event、component / seed seam | conditional / pending;nightly 与 ref-neutral 结构可先收敛 | 否 |
| `MI-UP-007` | Artifact candidate handoff / formal ref | eligibility 与 handoff 分层;不得声称引用已签发 | 否 |
| `MI-UP-008~009` | hardened base、outbound events | future / absent;不进入 current core | 否 |
| `Q-MI-001~003` | restricted variant、multi-arch、backend 产品 | conditional / future / adapter-neutral | 否 |
| `Q-MI-004` | 具体 evidence kind 与 priority | authority-driven gate mechanism;无具体通过声明 | 否 |
| `R-MI-001~010` | owner 漂移、输入污染、adapter 混写、旧事实回流、范围膨胀 | 后续 Step 持续执行 hard constraint 与 veto | 否;若红线被打破则重开 |

### 7.4 架构问题入口

| 后续 Step | 必须回答的问题 |
|---|---|
| Step 2 | 五节点如何转译为可检验的架构目标、不可变约束和阶段取舍? |
| Step 3~5 | 哪些语义责任由本仓拥有,应形成哪些不重叠的限界上下文? |
| Step 6~7 | 哪些运行 / 构建单元只是部署候选,依赖如何通过 port / adapter 裁剪? |
| Step 8~9 | 本仓 truth、snapshot、ref、adapter outcome 如何保持一致并跨边界交互? |
| Step 10~12 | 哪些机制必须锁定,哪些产品 / schema 必须 deferred,横切红线如何执行? |
| Step 13~15 | conditional / future 如何进入演进,风险、ADR 与需求如何无孤儿追溯? |

## 8. 回填草稿

正式 01 §1 应声明本文只把正式 00、accepted ADR 和当前正式 owner 边界转译为架构结构,不重定义需求或上游 truth。§3 应承接 RB-MI-001~012 与 HC-MI-001~010,再由 Step 2 补充阶段取舍和架构非目标。§16 应以 F-MI-001~015 为主轴映射到后续架构单元、数据 / 依赖 / 交互和风险;外围 F-MI-E01~E05 单列,不进入核心完成分母。

## 9. 待确认事项

- 本 Step 不新增开放编号。
- `MI-UP-001~009` 和 `Q-MI-001~004` 保持正式 00 的性质与关闭 authority。
- Exact schema、状态枚举、API / event 名称、数据库、语言、进程、目录和产品不属于本 Step。
- 旧正式 01 尚未读取,因此本步无任何“继承旧架构”的结论。

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 稳定需求、硬约束和未关闭风险是否分层 | pass |
| 五节点能力是否均产生架构问题入口 | pass |
| owner、四类数据和六类 seam 是否可继续推导 | pass |
| MI-UP-001~009、Q-MI-001~004 是否保留且未伪关闭 | pass |
| 是否未定义模块、部署、schema、状态机或技术产品 | pass |
| 是否未读取 / 继承旧正式 01 | pass |

`gate_status = pass`;允许更新 flow / ledger 后创建 Step 2,不得跳到 Step 3 或修改正式 01。
