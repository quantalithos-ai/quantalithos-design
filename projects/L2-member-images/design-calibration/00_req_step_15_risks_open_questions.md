# Step 15. 风险与待确认事项

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `risk_open_question_audit` | pass | R-MI-001~010 风险、MI-UP-001~009 上游条件和 Q-MI-001~004 待决策问题已分层;每项均有影响范围与当前处理 / 挂起口径,未把 unresolved 项写成已闭合结论 | 进入 Step 16 需求追溯矩阵 | `00_req_step_01_upstream_relation.md`;`00_req_step_04_goals_non_goals.md`;`00_req_step_06_consumers_dependencies.md`;`00_req_step_12_interfaces_dependencies.md`;`00_req_step_14_acceptance_criteria.md`;`project_execution_ledger.md` |

### 1.1 Step 内计划

- [x] 读取项目 ledger、00 flow、需求 SOP Step 15 和书写规范 §4.15。
- [x] 汇总 Step 1~14 中未完全关闭的边界、依赖、数据、接口、质量和验收问题。
- [x] 固定“风险 / 上游 blocker 或条件 / 待决策问题 / future enhancement”分类口径。
- [x] 为每条风险写明影响范围和当前如何约束,不写最终解决方案。
- [x] 原样核对 MI-UP-001~009,不因进入正式需求而降格或伪关闭。
- [x] 原样核对 Q-MI-001~004,写明当前挂起方式而非空泛“未定”。
- [x] 区分不阻塞正式 00 的设计不确定性与持续阻塞 positive contract / readiness 的条件。
- [x] 后置审计旧开放题、实现 TODO、产品选择和 historical 数字污染。
- [x] 完成重复、漏项、伪结论和临时新增需求审计。
- [x] 形成正式 00 §15 回填草稿并更新 flow / ledger。

## 2. 本步输入

| 输入 | 本步承接 |
|---|---|
| Step 1 | authority / pending sibling / historical material 分层及 MI-UP / Q 注册入口 |
| Step 2~6 | 仓边界、目标范围、用户 / consumer 和依赖失效上限 |
| Step 7~13 | 五节点能力链及功能、规则、数据、接口、质量中的 unresolved 影响 |
| Step 14 | AC 的 conservative positive 上限和 VETO 红线 |
| project ledger | 当前 blocker 状态、文档切换纪律和禁止 readiness 事实 |
| draft/05 | 原始 MI-UP-001~009、Q-MI-001~004 编号,只作一致性核对 |

## 3. SOP 问题回答

1. 当前还有哪些尚未关闭的风险?

   回答:主要风险不是“实现尚未开始”,而是后续设计中重新出现第二 mapping / Artifact truth、mutable / live 输入、adapter success 冒充 domain outcome、gate 绕过、supply / consumer 串线、依赖类型误写、旧指标回流和外围范围膨胀。R-MI-001~010 对这些风险逐项设定当前约束。

2. 风险影响哪一层需求结构?

   回答:风险覆盖定位与依赖(§2/6)、功能和规则(§9/10)、数据与接口(§11/12)、质量与验收(§13/14)。每条风险只回指已存在的结论,不在本步新增功能、规则或对象。

3. 当前有哪些待确认事项?

   回答:MI-UP-001~009 是已知外部 authority / exact contract 条件,Q-MI-001~004 是范围、模型、产品绑定或 evidence kind 决策。前者阻塞受影响 positive seam,后者按 future / 后续文档 / conditional gate 挂起。

4. 哪些待确认项影响前文是否成立?

   回答:没有一项改变本仓 owner、五节点能力语义、fail-closed、pinned、no-body 或 availability 分层的当前结论;MI-UP-001~007 会阻塞相应正向合同与集成验收,MI-UP-008/009 和 Q-MI-001~003 不进入核心完成分母,Q-MI-004 阻塞具体 evidence 种类的正向资格判断。

5. 哪些风险可接受,哪些阻塞后续?

   回答:在 R-MI-001~010 的当前约束和 VETO-MI-001~007 持续成立时,这些风险不阻塞 Step 16 与正式 00 装配。MI-UP-001~007 持续阻塞受影响 exact adapter / positive integration / readiness;任何风险若实际打破 owner、pin、no-body、fail-closed 或历史不覆盖,必须重开对应 Step,不能带病判定通过。

## 4. 当前文档问题诊断

| 旧开放项 / 风险写法 | 问题 | 当前处置 |
|---|---|---|
| “后续补查询 / CI / dashboard” | 普通 TODO 或实现项,不是风险 | 不进入 §15 |
| “多架构最小集是否 amd64/arm64” | 选项被旧实现预设 | 保留 Q-MI-002,当前按外围增强挂起且不预设枚举 |
| “用哪个 scanner / signer / registry” | 产品选择与需求结论混写 | 保留 Q-MI-003,后移 04,需求保持 adapter-neutral |
| “BOM / scan / sign 必须完成” | 未区分 generic gate 与具体 evidence authority | Q-MI-004 只挂具体 kind / priority;applicable gate fail-closed 已闭合 |
| “通知 member-service” | 把 exact contract / outbound event 当开放实现题 | 拆为 MI-UP-001 与 MI-UP-009,当前无 positive consume / event claim |
| “上游可能变化” | 过于空泛 | 具体化为 exact contract 漂移和 ref / owner 不一致风险 |
| “实现未开始” | 已知项目状态,不是需求风险 | 只留在 ledger,不进入风险表 |

## 5. 改动前后对比

| 维度 | 旧口径 | 当前口径 |
|---|---|---|
| 风险 | TODO、技术复杂度、未来变化混排 | 只记录可能破坏已收敛需求边界的具体风险 |
| 上游缺口 | 与开放问题混写 | MI-UP 独立保留 known blocker / condition 身份 |
| 待确认 | 只写“待定” | Q 项写明当前范围放置和不可推导结论 |
| Future | 可能被误计入核心完成 | 明确不进当前分母,正式启用需重新校准 |
| 关闭口径 | 作者自行补结论 | 只有正式 owner / authority 结论才能改变挂起状态 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 将 MI-UP / Q 全部并入风险表 | 表少 | 丢失 known blocker 与 decision question 的性质 | 不采用 |
| 只保留规范要求的两张表,不维护 closure authority | 正式正文简短 | 后续容易把 pending 默认为已解决 | 不采用 |
| 正式风险 / 待确认两表 + 校准层 blocker closure 表 | 符合正文结构且恢复点清晰 | 中间产物多一张审计表 | 采用 |

## 7. 结构化中间产物

### 7.1 分类口径

| 分类 | 判断标准 | 当前用途 |
|---|---|---|
| 风险 `R-MI-*` | 尚未必然发生,但若发生会破坏既有需求结论或后续可落码性 | 写影响范围与当前约束,不写最终方案 |
| 上游条件 `MI-UP-*` | 已知 authority / exact contract 缺失或 future relation | 明确受阻 positive lane、当前保守语义和 closure authority |
| 待决策问题 `Q-MI-*` | 需要正式范围 / owner / policy 决策才能确定 | 明确当前挂起位置,不强行选择 |
| 外围增强 `*-E*` | 已有方向但不属于当前核心闭环 | 只在正式重开 / 启用后进入对应主链 |

### 7.2 风险清单

| 风险 | 影响范围 | 当前处理口径 |
|---|---|---|
| `R-MI-001` 后续文档若重新枚举 Role、复制 mapping 或增加第二解析路径,镜像定义可能与方法资产 truth 漂移。 | §2、§6、C-MI-1、§9~14 | 当前按唯一正式 mapping 来源、no-fallback 和 body-free snapshot / ref 约束;违反即触发 VETO-MI-002/007 并重开受影响 Step。 |
| `R-MI-002` Component / seed 输入若以 mutable ref、猜测版本或 live body 补齐,同一 revision 可能不可复现并泄露运行状态。 | C-MI-2、§9~11、§13/14 | 当前只允许完整 pinned 静态 ref / placement;secret / live / external body 保持禁止,未知输入 fail closed。 |
| `R-MI-003` Sibling 或上游 exact contract 在并行窗口继续变化,可能使当前能力 seam 与最终 consumer / producer shape 不一致。 | §1、§6、§9、§12、§14/16 | 当前保持 MI-UP-001~007 显式 blocker;只收口产品中立语义和 conservative gap,不声明 positive integration。 |
| `R-MI-004` Scheduler / builder / registry / event adapter 的请求或返回若被等同 domain outcome,可能形成不存在的 candidate。 | C-MI-3、§9~14 | 当前分离 intent / snapshot / attempt / outcome,adapter success 与 event arrival 不构成 candidate;failed / blocked / unknown 不补造输出。 |
| `R-MI-005` Evidence kind、gate authority 或 Artifact handoff 未闭口时若被本地默认,可能绕过资格门禁或产生 Artifact 第二 truth。 | C-MI-4、§10~14 | 当前只承接正式适用 gate / safe conclusion,缺失即 fail closed;eligibility 与 Artifact handoff 分层,不自造 ref / report。 |
| `R-MI-006` Availability、entry、handoff 和 consumer / container 状态若被混写,可能导致错误发布、回滚或 readiness 声明。 | C-MI-5、§9~14 | 当前维持 local supply / handoff / consumer 三层和显式 availability 历史;外部结果不反写本仓 truth。 |
| `R-MI-007` Runtime、event、ref、adapter 或 fake seam 若在后续设计中被误写为 compile / source dependency,会造成仓耦合和 owner 反转。 | §6、§12、§14、后续 01~07 | 当前以 DEP-MI-001~016 双层分类为唯一需求基线;消费不推导源码依赖,fake 不进入 production readiness。 |
| `R-MI-008` 旧 README / 00~06 的固定 Role 数、SLA、工具、状态机和测试结果可能在后续正式文档中回流。 | 全文、后续 01~07 | 当前继续按 historical_material 处理;每个后续文档必须后置污染审计,无 authority 数字 / 产品不得继承。 |
| `R-MI-009` 当前缺少 workload 与 measurement baseline,若提前承诺时延、成功率、构建耗时或 retention,可能形成不可证实合同。 | §4、§13~15、后续 04~06 | 当前只使用离散判断口径;量化值不进入正式 00,获得正式 baseline 后须走需求变更而非静默补写。 |
| `R-MI-010` 多架构、收缩 variant、快速重建、加固 base 或使用分析若提前进入核心分母,会扩大当前闭环并引入相邻 truth。 | §4、§7~14 | 当前全部按外围增强处理;未正式启用时不影响核心,启用时仍不得绕 BR-MI-001~025。 |

### 7.3 风险推进上限

| 风险组 | 对正式 00 / Step 16 | 对 positive contract / 后续 readiness | 边界破坏时 |
|---|---|---|---|
| R-MI-001/002/004~008 | 在当前约束成立时不阻塞 | 对应 owner / seam 未闭口部分仍不得声明 ready | 重开受影响 Step,不得以风险已登记代替修正 |
| R-MI-003 | 不阻塞产品中立需求语义 | MI-UP-001~007 持续阻塞相应 exact integration | 等正式 owner 输入后重新校准映射 |
| R-MI-009 | 不阻塞离散质量需求 | 阻塞无 baseline 的数字型承诺 | 只有正式 measurement authority 可触发变更 |
| R-MI-010 | 不阻塞当前核心 | 外围未启用即无 positive readiness | 正式启用需重开 scope / requirement |

### 7.4 上游条件与关闭 authority 审计

| ID | 已知条件 | 当前受阻范围 | 只有何种输入可改变当前状态 |
|---|---|---|---|
| `MI-UP-001` | member-service exact manifest / variant / ref 消费与 confirmation 合同未闭口 | IF-MI-013/014、positive entry / handoff integration | `L2-member-service` 正式设计链给出与本仓一致的消费合同并完成双方校准 |
| `MI-UP-002` | member component release shape 与 compatibility owner 未闭口 | C-MI-2 component positive binding / compatibility claim | `L2-member` / runtime 正式 owner 明确发布形态和兼容判断归属 |
| `MI-UP-003` | method Role -> variant exact query / snapshot surface 未闭口 | C-MI-1 positive mapping adapter | `L3-method-library` 正式合同明确 body-free 消费面,且不要求源码依赖 |
| `MI-UP-004` | Core image-specific shared schema 未认定 | DEP-MI-002 active compile contract | `L0-core` 正式接受或拒绝共享 contract;本仓不得提前 shadow |
| `MI-UP-005` | 入站构建 event family / schema 未闭口 | IF-MI-006 positive event lane | Bus / Core 正式 authority 给出可验证输入合同;nightly 不依赖该关闭 |
| `MI-UP-006` | Policy / memory / workspace seed 来源 owner 与 exact seam 未闭口 | C-MI-2 seed positive binding / placement contract | 各正式语义 owner 明确 template ref 与 placement 边界;正文仍外置 |
| `MI-UP-007` | Artifact image handoff 条件 / ref schema 未闭口 | IF-MI-011、formal ref / positive handoff | `L1-artifact` 正式合同明确 image candidate handoff 与正式消费引用条件 |
| `MI-UP-008` | Hardened base / Sandbox 消费方向仅为 future | F-MI-E04 / DEP-MI-015 | 外围范围正式启用且 `L4-sandbox` / base authority 给出获准 ref 边界 |
| `MI-UP-009` | 构建 / 发布出站事件无 authority | 所有 event output;当前不存在接口 | Bus / Core 正式授权或明确拒绝 event family;在此之前不得定义输出 |

本表是校准层恢复依据,不是把 closure 承诺成本仓可控制的计划。任何正式 owner 输入出现后仍需重新执行受影响文档校准,不能自动把状态改成 closed / ready。

### 7.5 待确认事项

| 待确认事项 | 影响章节 | 当前状态 |
|---|---|---|
| `MI-UP-001` member-service exact manifest / variant / ref 消费合同 | §6、§9、§12、§14/16 | 当前只确认 pinned 入口供给方向;positive entry / confirmation 保持 blocked,以 unavailable / contract-gap 收口。 |
| `MI-UP-002` member component shape 与 compatibility 判断归属 | §6、§9~14 | 当前只消费正式 release ref;shape / report / readiness 不进入本仓结论。 |
| `MI-UP-003` method mapping exact query / snapshot 消费面 | §6、C-MI-1、§12/14 | 当前只确认 runtime + ref 来源依赖;positive adapter 保持 pending,no-fallback 继续成立。 |
| `MI-UP-004` Core image-specific shared schema 是否成立 | §6、§12、§14/16 | 当前只是 conditional compile candidate;未获认定时不本地 shadow,也不形成 active dependency。 |
| `MI-UP-005` 入站镜像构建 event family / schema | C-MI-3、§12~14 | 当前 event positive lane unavailable;nightly 仍是 current core,未知事件 fail closed。 |
| `MI-UP-006` Policy / memory / workspace seed template 来源 owner | C-MI-2、§10~14 | 当前只承接 pinned template ref / placement;语义正文与 exact contract 保持外置 / pending。 |
| `MI-UP-007` Artifact image handoff 条件与正式消费引用 | C-MI-4/5、§11~14 | 当前只复用正式 `ConsumableArtifactReference` 概念并表达 gap;不自造 ref / version / lineage 或 positive handoff。 |
| `MI-UP-008` 加固基础镜像消费方向 | §4、§7~14 | 当前按 future enhancement 挂起,不进入核心能力或完成分母。 |
| `MI-UP-009` 本仓是否需要构建 / 发布出站事件 | §6、§10、§12/14 | 当前无 event output 能力或数据;authority 出现前不得把 availability 变化写成通知。 |
| `Q-MI-001` 特殊只读 / 收缩 variant 是否进入正式范围 | §4、§7~14 | 当前暂按外围增强处理,不改变 Role / governance truth,不进入核心分母。 |
| `Q-MI-002` 多架构是否成为 variant 模型维度 | §4、§7~14 | 当前暂按外围增强处理,不预设架构枚举或完成率。 |
| `Q-MI-003` Builder / registry / evidence backend 的具体产品绑定 | §4、§12~15、后续 04 | 当前保持 adapter-neutral,产品选择后移 04,不影响领域要求成立。 |
| `Q-MI-004` 正式适用 BOM / scan / signature 等 evidence kind 与 gate priority | C-MI-4、§10~15 | 当前只闭合“正式适用 gate 不可绕过”;具体 kind / priority 保持 authority pending,不伪造 positive evidence。 |

### 7.6 分离与 historical 审计

| 检查项 | 结果 |
|---|---|
| 风险与待确认事项是否分表 | pass |
| MI-UP 是否保持 known condition / blocker 身份 | pass;未降格为普通风险 |
| Q 是否写明当前挂起方式 | pass;无单独“未定 / 后续再看” |
| 每条风险是否具体且有影响范围 / 当前约束 | pass |
| 是否将 TODO、实施状态或未来优化当风险 | no |
| 是否在 Step 15 临时新增目标、功能、规则、数据或接口 | no |
| 是否把本仓不可控 closure 写成实施承诺 | no |
| 是否把 unresolved 项写成 readiness / pass | no |
| 是否存在会阻塞正式 00 语义却未登记的已知问题 | no;positive seam 阻塞已全部显式 |

| historical item | 当前处置 |
|---|---|
| 固定 Auditor Role / 只读镜像方案 | 只保留 Q-MI-001 范围问题,不继承 Role 枚举 / 装配方案 |
| `amd64 + arm64` 最小集 | 只保留 Q-MI-002 模型维度问题,不继承选项答案 |
| GitHub Actions / buildx / Trivy / Grype / cosign | 只保留 Q-MI-003 产品绑定后移,不作为风险解决方案 |
| BOM / scan / sign 固定门禁 | 只保留 Q-MI-004 authority 问题,generic fail-closed 已收敛 |
| member-service notification / launch | 拆分 MI-UP-001/009,不声明 exact consume / outbound event / container success |
| 90 天 / 1 年 retention | 无 authority,不作为待确认项回流;若未来正式提出须走需求变更 |

## 8. 回填草稿

正式 00 §15 使用 §7.2 的三列风险清单和 §7.5 的三列待确认事项表。§7.4 closure authority 仅保留在校准材料,正式正文通过 MI-UP / Q 的“当前状态”表达挂起上限。正文必须明确:这些 unresolved 项不阻塞产品中立、fail-closed 的正式 00 需求语义,但持续阻塞受影响 positive contract、integration、测试执行与 readiness;外部输入出现后必须重新校准,不能自动闭合。

## 9. 本 Step 不产生的新结论

- 不在风险章节新增功能、对象、接口、状态机、schema 或 adapter 产品。
- 不将 MI-UP-001~009 转写为本仓负责解决的实施计划。
- 不将 Q-MI-001~004 预选为 current core。
- 不声明任何 upstream 合同、实现、测试、artifact、evidence、verdict、signoff 或 readiness 已就绪。

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 风险与待确认事项是否明确分表 | pass |
| 每条风险是否有影响范围和当前处理口径 | pass |
| 每条待确认事项是否有影响章节和非空当前状态 | pass |
| MI-UP / Q 是否保持原编号、性质和受阻范围 | pass |
| 是否区分可继续正式 00 与持续阻塞 positive readiness | pass |
| 是否避免脑补确定性、TODO、方案和新需求 | pass |

`gate_status = pass`;允许创建 Step 16,不得跳到 Step 17 或修改正式 00。
