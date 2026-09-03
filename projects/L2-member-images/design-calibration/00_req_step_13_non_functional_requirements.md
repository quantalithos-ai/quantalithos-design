# Step 13. 非功能需求

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `cross_node_quality_audit` | pass | NFR-MI-001~022 已按 C-MI-1~5 完成能力级停审,并完成性能、可用性、安全、审计 / 可追溯、幂等 / 一致性、可观测性六类全仓总审;每条要求均有来源、非伪造判断口径和 Step 14 承接主题 | 进入 Step 14 验收标准,从 C-MI-1 开始逐节点收敛 AC | `00_req_step_07_core_capability_loop.md`;`00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`;`00_req_step_12_interfaces_dependencies.md` |

### 1.1 Step 内计划

- [x] 读取项目 ledger、00 flow、需求 SOP Step 13 和书写规范 §4.13。
- [x] 复核 Step 4 目标、Step 7 能力节点、Step 10 规则、Step 11 数据归属和 Step 12 接口 / 依赖。
- [x] 固定性能、可用性、安全、审计 / 可追溯、幂等 / 一致性、可观测性六类最小检查框架。
- [x] 按 C-MI-1 -> C-MI-5 形成能力级质量要求并逐节点停审。
- [x] 单独形成全仓质量约束,不将其硬塞进单一能力节点。
- [x] 为不能量化的要求给出可判定口径,不私造目标值。
- [x] 为每条 NFR 固定能力 / 目标来源和 Step 14 验收承接主题。
- [x] 后置审计旧正式文档中的 SLA、比例、耗时、架构矩阵、保留时长和工具产品污染。
- [x] 完成六类覆盖、重复、冲突、owner、pending 与 readiness 审计。
- [x] 形成正式 00 §13 回填草稿并更新 flow / ledger。

## 2. 本步输入

| 输入 | 本步承接 |
|---|---|
| Step 4 | G-MI-001~007 的可判断目标和 current / conditional / future 范围 |
| Step 7 | C-MI-1~5 的能力成立条件及固定停审顺序 |
| Step 10 | no fallback、pin、fail-closed、truth 分层和变化不可覆盖规则 |
| Step 11 | truth / snapshot / ref / forbidden body 分类及生命周期口径 |
| Step 12 | IF-MI-001~014、DEP-MI-001~016 及 compile/runtime/event/ref/adapter/fake seam 上限 |
| pending register | 未闭口 exact contract 只允许形成 conservative judgment,不得支撑 positive readiness |
| historical material | 旧 README、旧正式 00/01/02/03/05/06 只用于后置污染审计 |

## 3. SOP 问题回答

1. 哪些质量要求能回指具体能力节点?

   回答:NFR-MI-001~003 回指 C-MI-1,NFR-MI-004~006 回指 C-MI-2,NFR-MI-007~009 回指 C-MI-3,NFR-MI-010~012 回指 C-MI-4,NFR-MI-013~016 回指 C-MI-5。它们分别约束来源判断、静态装配、构建 attempt、provenance / eligibility 和供给入口的局部质量。

2. 哪些要求覆盖全仓?

   回答:NFR-MI-017~022 分别形成六类全局质量约束,覆盖从 definition 到 availability / handoff 的完整镜像供给链,不归属于某一个局部节点。

3. 本仓必须满足哪些性能要求?

   回答:已有定义、基线、状态、availability 和 pinned entry 的查询 / 判断不得依赖触发构建、实例化或获取外部正文,本仓的意图收束与状态判断也不得成为 L2 主链的主要阻塞点。当前没有经测量和 authority 确认的时延、吞吐、构建耗时或镜像大小基线,因此不写伪目标值。

4. 本仓必须满足哪些可用性要求?

   回答:外部 mapping、builder、registry、Artifact、member-service 或条件 event lane 失效时,本仓既有 truth 和可判定状态不得被改写;受影响的新变化 fail closed。外围增强失效不得取消 nightly 语义和核心镜像资产链。

5. 本仓必须满足哪些安全要求?

   回答:装配和供给不得保存 secret、live memory、checkpoint、workspace live content 或外部语义 / evidence 正文;生产入口不得使用 `latest` 或其他可漂移引用;正式适用门禁不得绕过。具体 evidence kind 和产品仍由正式 authority 决定。

6. 本仓必须满足哪些审计 / 可追溯要求?

   回答:definition -> revision -> intent -> attempt -> provenance -> eligibility -> availability -> handoff 的关键事实和变化必须可沿来源链追溯,rollback / retire 不得删除历史,但本仓不因此拥有外部审计 backend 或外部正文。

7. 本仓必须满足哪些幂等 / 一致性要求?

   回答:重复校准、重复意图、retry、重新评估和 rollback 不得覆盖既有事实或形成矛盾的当前语义;变化应复用既有效果或形成可关联的新 revision / attempt / evaluation / transition。

8. 本仓必须满足哪些可观测性要求?

   回答:平台必须能稳定判断 missing / stale / conflict、blocked / failed / pending / unknown、eligibility 和 handoff gap 等领域结果,并区分本仓状态与外部依赖状态;本仓只提供安全领域状态 / trace material,不拥有 observability backend。

9. 哪些要求可以量化?

   回答:当前 authority 只能对语义完整性、禁止行为、状态可区分性、引用稳定性和历史不覆盖做离散判断。没有已核验 measurement baseline 支撑成功率、P95、固定耗时、容量、镜像大小、架构数量或 retention 数字;这些若在后续获得正式基线,应经需求变更重新校准,不能在本步猜测。

10. Step 14 如何承接?

    回答:每个能力节点的 NFR 由同节点 positive / negative / dependency-failure 验收切口承接;全局 NFR 由跨链追溯、边界 veto、重复变化和外围降级切口承接。Step 14 才创建正式 AC 编号,本步不提前伪造 AC。

## 4. 当前文档问题诊断

| 旧质量口径 | 问题 | 当前处置 |
|---|---|---|
| `9/9`、`100%` nightly / publish / launch | 固定 Role 集合和未发生的成功率事实 | 删除数字;要求每个当前正式 mapping 缺口可解释,不声明构建或启动成功 |
| `99.9%` method / registry 可用性 | 无测量窗口、owner 和证据 | 删除 SLA;改为依赖失效时既有 truth 保持、受影响变化 fail closed |
| P95、固定构建耗时、固定镜像大小 | 无 workload、测量边界和 baseline | 不继承;只保留不得成为主链阻塞点的判断口径 |
| `amd64 + arm64` 完整率 | 多架构仍为 Q-MI-002 外围增强 | 不进入当前质量分母 |
| Critical=0、BOM / 签名 100% | evidence kind 与门禁优先级 Q-MI-004 未闭口 | 改为正式适用门禁不可绕过且缺失 / 失败 fail closed |
| IPC compatibility 100% | member component shape / compatibility owner MI-UP-002 pending | 不建立 compatibility report 或 readiness;只要求 pin / gap 可判定 |
| Trivy / Grype / cosign / buildx | 将产品选型误写成需求质量口径 | 产品绑定后移 04;需求只写 adapter-neutral outcome |
| 固定 retention / archive 年限 | 无正式治理 authority | 只要求历史不可被变化覆盖;时长 pending |

## 5. 改动前后对比

| 维度 | 旧口径 | 当前口径 |
|---|---|---|
| 性能 | 未证实的时延 / 构建预算 | 主链不阻塞的离散判断;数字等待 measurement baseline |
| 可用性 | 外部系统 SLA 和全成功率 | 依赖失效上限、既有 truth 保持和新变化 fail-closed |
| 安全 | 固定扫描 / 签名 / BOM 产品链 | 禁止正文、pinned ref 和正式适用 gate 不可绕过 |
| 审计 | 工具 report / retention 数字 | 镜像域事实链完整可追,外部正文和 backend owner 不转移 |
| 一致性 | 模糊的成功率 / compatibility 覆盖 | revision / attempt / evaluation / transition 不覆盖和不矛盾 |
| 可观测性 | 日志 / CI / dashboard 倾向 | 领域状态和 gap 可稳定判断,backend 外置 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 继承旧量化指标 | 看似直接可验收 | 无 authority、baseline 或已发生证据,会伪造 readiness | 不采用 |
| 六类在每个能力节点机械各写一条 | 表面完整 | 产生大量无关或重复要求,并把全局约束误塞入局部 | 不采用 |
| 能力级重点约束 + 六类全仓总审 | 保留局部可验收性并覆盖跨链质量 | Step 14 需分别设计局部和跨链切口 | 采用 |

## 7. 结构化中间产物

### 7.1 六类适用性结论

| 非功能类别 | 适用性 | 本仓重点 |
|---|---|---|
| 性能 | 适用 | 定义 / 状态 / 入口查询不触发重操作,意图 / 状态判断不成为主链阻塞;当前不设无依据数字 |
| 可用性 | 适用 | 外部依赖和外围增强失效不改写既有 truth;受影响变化保守停止 |
| 安全 | 高度适用 | 镜像是运行入口资产,必须禁止 secret / live state / 外部正文、mutable production ref 和 gate bypass |
| 审计 / 可追溯 | 高度适用 | definition 到 handoff 的来源、变化和 gap 必须可追溯 |
| 幂等 / 一致性 | 高度适用 | revision、attempt、evaluation、availability transition 不得覆盖或形成矛盾语义 |
| 可观测性 | 适用 | 关键状态、阻塞 owner 和 gap 可稳定判断,但 observability backend 外置 |

### 7.2 C-MI-1 受控定义质量要求

| ID | 非功能类别 | 要求 | 判断口径 / 目标值 | 来源 | Step 14 承接主题 |
|---|---|---|---|---|---|
| `NFR-MI-001` | 性能 | 已有 variant / persona 定义和 mapping 来源结论的读取不得成为定义校准与下游镜像解析的主链阻塞点。 | 读取本仓已有事实不要求触发构建、registry 访问或 member-service 实例化;外部来源暂不可达时返回明确状态,不得无限等待。当前无数值 baseline。 | C-MI-1;G-MI-002/007;IF-MI-001/002 | 已有定义读取与来源不可达的判断切口 |
| `NFR-MI-002` | 可用性 | Mapping exact seam 或来源暂不可用时,既有镜像域定义仍应可追溯,新建 / 修订不得以 stale 或默认 mapping 冒充 resolved。 | 能区分既有本仓 truth 与本次来源校验结果;来源 missing / stale / conflict / unavailable 时受影响变化 fail closed。 | C-MI-1;BR-MI-001~005;DEP-MI-001 | 来源失效时的既有读取和负向校准切口 |
| `NFR-MI-003` | 审计 / 可追溯 | 镜像定义、mapping 消费快照 / ref 及有效性结论的建立和变化必须可回指正式来源与判断语境。 | 任一当前或历史结论均能关联其定义、来源 ref / snapshot 和变化语境;不要求保存 RoleDefinition 或 mapping 正文。 | C-MI-1;D-MI-001~005;BR-MI-004/005 | 定义来源链与 forbidden body 切口 |

C-MI-1 停审:三条要求覆盖定义读取性能、来源失效可用性和来源追溯;未把 method mapping truth、exact contract 或固定时延纳入本仓。`gate_status = pass`。

### 7.3 C-MI-2 装配与派生基线质量要求

| ID | 非功能类别 | 要求 | 判断口径 / 目标值 | 来源 | Step 14 承接主题 |
|---|---|---|---|---|---|
| `NFR-MI-004` | 安全 | 静态装配不得承接 secret、live memory、checkpoint、workspace live content 或外部 component / seed 语义正文。 | 基线只包含获准的 pinned component / extras / template refs 与 placement 语境;任一 forbidden body 出现即不形成有效基线。 | C-MI-2;BR-MI-006~010;D-MI-009~012 | 完整装配与 live / sensitive body veto 切口 |
| `NFR-MI-005` | 审计 / 可追溯 | 每个装配基线、variant revision 和 derivation 必须能追溯全部必要 pinned 输入及其来源关系。 | 任一 revision 均可回指 predecessor / base、差异依据、component / extras / seed refs 和 placement 语境;外部正文 owner 不转移。 | C-MI-2;D-MI-006~010;IF-MI-003/004 | revision / derivation 完整来源链切口 |
| `NFR-MI-006` | 幂等 / 一致性 | 重复校准不得产生相互冲突的装配基线;输入或派生依据变化必须形成显式新 revision,不得原地改写既有 revision。 | 相同已接受语境不会形成两份语义冲突的当前基线;任何有效变化均保留旧 revision 并形成可关联的新事实。 | C-MI-2;BR-MI-006/009;D-MI-006~008 | 重复校准、输入变化与历史不覆盖切口 |

C-MI-2 停审:三条要求覆盖静态输入安全、装配来源追溯和 revision 一致性;未把物理 component / template 包含误写为语义 owner 转移。`gate_status = pass`。

### 7.4 C-MI-3 构建候选质量要求

| ID | 非功能类别 | 要求 | 判断口径 / 目标值 | 来源 | Step 14 承接主题 |
|---|---|---|---|---|---|
| `NFR-MI-007` | 可用性 | 条件 event lane 或 scheduler / builder / registry 失效时,nightly 构建语义和既有构建事实不得被取消或伪改,受影响 attempt 必须形成保守结果。 | 能区分 event lane pending 与 nightly intent;外部依赖失效只产生 rejected / blocked / failed / unknown 等适用结果,不得形成虚假 candidate。 | C-MI-3;BR-MI-011~015;DEP-MI-007~009 | nightly / event 分离和依赖失败结果切口 |
| `NFR-MI-008` | 幂等 / 一致性 | 重复构建意图或 retry 不得覆盖原 intent / attempt,也不得把多次外部交接混成一次成功事实。 | 同一业务意图保持单一可关联语义;每次实际尝试形成独立 attempt 与 outcome,已有 candidate / failure 历史不被重写。 | C-MI-3;D-MI-013~015;BR-MI-012~014 | duplicate intent、retry 与多 attempt 关联切口 |
| `NFR-MI-009` | 可观测性 | Build intent、input snapshot、attempt 和 candidate / failed / blocked / unknown 结果必须可被稳定区分。 | 不依赖读取外部 job / log 正文即可判断当前处于本仓哪个领域阶段、是否已有候选以及阻塞属于本仓还是外部 seam。 | C-MI-3;D-MI-013~018;IF-MI-005~008 | 构建状态分层和外部 backend body 排除切口 |

C-MI-3 停审:三条要求覆盖依赖降级、重复 attempt 和结果可观察性;未将请求送达、adapter success 或 job 存在伪装为 candidate readiness。`gate_status = pass`。

### 7.5 C-MI-4 Provenance 与 eligibility 质量要求

| ID | 非功能类别 | 要求 | 判断口径 / 目标值 | 来源 | Step 14 承接主题 |
|---|---|---|---|---|---|
| `NFR-MI-010` | 安全 | 正式适用 gate 的结论缺失、失败、冲突或 unknown 时,镜像 eligibility 必须 fail closed,且不得以未获 authority 的 evidence kind 补齐。 | 只有适用性和安全结论均有正式来源时才可形成对应正向资格;Q-MI-004 未闭口部分保持 pending / blocked,不存在 gate bypass。 | C-MI-4;BR-MI-017~020;D-MI-020~025 | applicable gate 正负向资格和证据正文 veto 切口 |
| `NFR-MI-011` | 审计 / 可追溯 | 每个 candidate digest 的 provenance 必须完整回指镜像定义、装配 revision、构建输入快照、attempt 及适用资格判断来源。 | 从任一 digest 可沿本仓关系追至 definition -> revision -> snapshot -> attempt -> gate evaluation,并区分 Artifact handoff ref / gap;不得以 report 名称替代来源链。 | C-MI-4;D-MI-019~024;IF-MI-009~011 | digest 全链 provenance 与 Artifact gap 切口 |
| `NFR-MI-012` | 幂等 / 一致性 | 同一 digest 的原始 provenance binding 不得因重新评估或外部 Artifact 状态变化被改写;新资格语境必须形成新结论。 | 原始输入和来源绑定保持不变;policy / evidence / handoff 变化形成可关联的新 evaluation 或 gap,旧 eligibility 语境仍可追溯。 | C-MI-4;BR-MI-016~020;D-MI-019~024 | reevaluation、external change 与历史资格保留切口 |

C-MI-4 停审:三条要求覆盖 gate fail-closed、完整 provenance 和资格重评一致性;未伪造 BOM / scan / signature、Artifact formal ref 或 positive handoff。`gate_status = pass`。

### 7.6 C-MI-5 供给与可实例化入口质量要求

| ID | 非功能类别 | 要求 | 判断口径 / 目标值 | 来源 | Step 14 承接主题 |
|---|---|---|---|---|---|
| `NFR-MI-013` | 性能 | 已有 availability、variant 和 pinned entry 的解析不得依赖实际创建容器或等待下游消费确认。 | 在本仓已有 truth / ref 语境内即可返回入口或 conservative gap;外部 registry 暂不可验证时返回 unresolved / unavailable,不得等待实例化完成。当前无数值 baseline。 | C-MI-5;G-MI-006/007;IF-MI-013/014 | 入口查询与下游不可达切口 |
| `NFR-MI-014` | 可用性 | Registry、Artifact 或 member-service 不可用时,既有 supply availability 不得被外部状态反写;不满足资格或 ref 可验证条件的新入口不得发布。 | local supply、handoff 和 consumer confirmation 三层可分别判断;外部 seam 失效产生 gap / unavailable,不伪造发布、消费或回滚结果。 | C-MI-5;BR-MI-021~025;D-MI-026~030 | 外部依赖失效下的三层状态和发布 veto 切口 |
| `NFR-MI-015` | 审计 / 可追溯 | Publish / replace / rollback / retire 和 handoff attempt 必须能回指对应 eligible digest、pinned ref 与前序 availability 语境。 | 任一变化可追到发起语境、目标 binding 和前序状态;rollback / retire 保留被替代历史,consumer gap 独立留痕。 | C-MI-5;D-MI-024/026~029;IF-MI-012~014 | availability transition、rollback 和 handoff 历史切口 |
| `NFR-MI-016` | 幂等 / 一致性 | 重复供给变化请求不得形成互相矛盾的当前 availability;入口 binding 必须与其被声明的 availability 和 pinned digest / ref 一致。 | 同一供给语境不会同时表达相互冲突的 available / retired 结果;重复变化复用既有效果或形成可关联的新 transition,不覆盖历史。 | C-MI-5;BR-MI-021~025;D-MI-026~028 | duplicate transition 与 entry / availability 一致性切口 |

C-MI-5 停审:四条要求覆盖入口解析、依赖降级、供给变化追溯和当前语义一致性;未把容器生命周期、consumer success 或 outbound event 纳入本仓。`gate_status = pass`。

### 7.7 全局质量约束

| ID | 非功能类别 | 要求 | 判断口径 / 目标值 | 来源 | Step 14 承接主题 |
|---|---|---|---|---|---|
| `NFR-MI-017` | 性能 | 本仓对已有镜像域事实的查询、校准判断和状态解析不得成为 L2 镜像消费主链的主要阻塞点。 | 本仓已有 definition / revision / attempt / eligibility / availability 结论的读取不要求同步执行构建、实例化或获取外部正文;依赖等待可被明确归因。量化目标等待正式 workload 与 measurement baseline。 | G-MI-001~007;C-MI-1~5 | 跨节点已有事实读取与阻塞归因切口 |
| `NFR-MI-018` | 可用性 | 外围增强、条件 event lane 或非前置外部能力失效不得使核心镜像 truth、nightly 语义和既有供给历史整体不可用。 | F-MI-E01~E05 任一未启用 / 失效时,C-MI-1~5 的核心语义仍成立;受影响 positive seam 明确 pending / blocked / unavailable,不得默认成功。 | G-MI-004/007;BR-MI-E01~E03;DEP-MI-015/016 | 外围降级与核心闭环保持切口 |
| `NFR-MI-019` | 安全 | 本仓不得越权持有 secret、runtime live state、外部语义 / evidence / Artifact 正文或相邻 owner 的控制真相;生产供给不得使用 mutable ref,正式适用 gate 不得绕过。 | D-MI-005/011/012/018/025/030 与 D-MI-E04 均不进入本仓领域正文;入口为 pinned digest / ref 且不使用 `latest`;owner 与 gate veto 全部成立。 | G-MI-001/003/005/006;NG-MI-001~012;ADR-0005 | forbidden body、owner、mutable ref 与 gate bypass 总 veto |
| `NFR-MI-020` | 审计 / 可追溯 | Definition -> revision -> intent -> attempt -> provenance -> eligibility -> availability -> handoff 的关键事实和显式变化必须形成连续可追溯链。 | 任一供给入口可反向追至正式来源和构建语境;任一失败 / rollback / retire / gap 可定位发生节点且历史未被覆盖;外部正文不作为链完整性的替代。 | G-MI-002~007;D-MI-001~030 | 从入口反查来源、从失败定位节点的跨链切口 |
| `NFR-MI-021` | 幂等 / 一致性 | 跨节点重复校准、重复意图、retry、重新评估和供给回滚不得制造第二套 truth 或改写既有事实。 | 每次重复动作可判定为复用既有效果或形成关联的新 revision / attempt / evaluation / transition;当前定义、资格和供给语义不存在互相矛盾的并列结论。 | G-MI-001/007;BR-MI-004/009/014/019/022/025 | 全链重复动作、历史保留和当前语义唯一切口 |
| `NFR-MI-022` | 可观测性 | 本仓关键状态、变化、阻塞 owner 和 gap 必须能以安全领域结论被稳定观察,不得依赖伪造外部成功或拥有 observability backend。 | 至少能区分 missing / stale / conflict、blocked / failed / pending / unknown、eligibility、availability 和 handoff gap,并区分 local truth 与 external status;不保存外部 raw log / observed body。 | G-MI-007;D-MI-018/028~030;IF-MI-001~014 | 全链状态枚举语义、owner 归因和 observed body veto 切口 |

全局停审:六类最小框架均有适用要求和判断口径;性能数字明确等待正式 baseline,其余均可通过离散状态、禁止行为、链完整性和历史不覆盖判断。全局要求未被伪装为单一节点局部约束。`gate_status = pass`。

### 7.8 正式非功能需求表

| 非功能类别 | 要求 | 判断口径 / 目标值 |
|---|---|---|
| 性能 | `NFR-MI-001` 已有 variant / persona 定义和 mapping 来源结论的读取不得成为定义校准与下游镜像解析的主链阻塞点。 | 本仓已有事实读取不触发构建、registry 访问或实例化;来源不可达时返回明确状态。当前无数值 baseline。 |
| 可用性 | `NFR-MI-002` Mapping exact seam 或来源不可用时,既有镜像域定义仍可追溯,新建 / 修订不得以 stale 或默认 mapping 冒充 resolved。 | 既有 truth 与本次来源判断可区分;missing / stale / conflict / unavailable 时受影响变化 fail closed。 |
| 审计 / 可追溯 | `NFR-MI-003` 镜像定义、mapping 快照 / ref 及有效性结论必须可回指正式来源和判断语境。 | 当前与历史结论均可关联来源,且不保存 RoleDefinition / mapping 正文。 |
| 安全 | `NFR-MI-004` 静态装配不得承接 secret、live memory、checkpoint、workspace live content 或外部语义正文。 | 只允许获准 pinned refs / templates 与 placement 语境;forbidden body 出现即不形成有效基线。 |
| 审计 / 可追溯 | `NFR-MI-005` 每个装配基线、variant revision 和 derivation 必须可追溯全部必要 pinned 输入及来源关系。 | revision 可回指 predecessor / base、差异依据、component / extras / seed refs 和 placement 语境。 |
| 幂等 / 一致性 | `NFR-MI-006` 重复校准不得产生冲突基线;输入或派生依据变化必须形成新 revision。 | 相同语境无冲突当前基线;变化保留旧 revision,不得原地改写。 |
| 可用性 | `NFR-MI-007` 条件 event lane 或构建外部依赖失效时,nightly 语义和既有事实不得被伪改。 | event / nightly 可区分;失效只形成适用的 rejected / blocked / failed / unknown,不形成虚假 candidate。 |
| 幂等 / 一致性 | `NFR-MI-008` 重复构建意图或 retry 不得覆盖原 intent / attempt 或混写多次结果。 | 同一意图保持关联;每次实际尝试形成独立 attempt / outcome,历史不重写。 |
| 可观测性 | `NFR-MI-009` Intent、snapshot、attempt 和 candidate / failed / blocked / unknown 必须可稳定区分。 | 无需读取外部 job / log 正文即可判断领域阶段、结果与阻塞 owner。 |
| 安全 | `NFR-MI-010` 正式适用 gate 缺失、失败、冲突或 unknown 时,eligibility 必须 fail closed。 | 只有正式适用来源齐备才形成对应正向资格;未确权 evidence kind 保持 pending / blocked,不得绕过。 |
| 审计 / 可追溯 | `NFR-MI-011` Candidate digest 的 provenance 必须回指定义、revision、input snapshot、attempt 和适用判断来源。 | 任一 digest 可沿本仓关系追至完整来源链并区分 Artifact handoff gap。 |
| 幂等 / 一致性 | `NFR-MI-012` 同一 digest 的原始 provenance 不得因重新评估或外部 Artifact 状态变化被改写。 | 新语境形成新 evaluation / gap,旧来源绑定和 eligibility 语境仍可追溯。 |
| 性能 | `NFR-MI-013` 已有 availability、variant 和 pinned entry 的解析不得依赖容器创建或下游消费确认。 | 基于本仓 truth / ref 返回入口或 conservative gap;registry 不可验证时明确 unresolved / unavailable。当前无数值 baseline。 |
| 可用性 | `NFR-MI-014` Registry、Artifact 或 member-service 不可用时,既有 availability 不得被反写,不合格的新入口不得发布。 | Local supply、handoff、consumer confirmation 分层判断;外部失效只产生 gap / unavailable。 |
| 审计 / 可追溯 | `NFR-MI-015` Publish / replace / rollback / retire 和 handoff attempt 必须回指 eligible digest、pinned ref 与前序 availability。 | 变化可追至发起语境和前序状态;rollback / retire 保留历史。 |
| 幂等 / 一致性 | `NFR-MI-016` 重复供给变化不得形成矛盾 availability;入口 binding 必须与 availability 和 pinned ref 一致。 | 相同语境无冲突结果;重复变化复用既有效果或形成关联 transition。 |
| 性能 | `NFR-MI-017` 已有镜像域事实的查询、校准判断和状态解析不得成为 L2 镜像消费主链的主要阻塞点。 | 已有事实读取不执行构建、实例化或获取外部正文;等待可归因。量化目标等待正式 baseline。 |
| 可用性 | `NFR-MI-018` 外围增强、条件 event lane 或非前置外部能力失效不得使核心 truth、nightly 语义和既有供给历史整体不可用。 | 外围未启用 / 失效时核心语义仍成立;受影响 seam 明确 pending / blocked / unavailable。 |
| 安全 | `NFR-MI-019` 本仓不得持有相邻 owner 的敏感 / live / external body truth;生产供给不得使用 mutable ref,适用 gate 不得绕过。 | 所有 forbidden body 均不进入领域正文;入口 pinned 且禁 `latest`;owner 与 gate veto 成立。 |
| 审计 / 可追溯 | `NFR-MI-020` Definition 到 handoff 的关键事实和变化必须形成连续可追溯链。 | 任一入口可反查来源,任一失败 / rollback / retire / gap 可定位节点,历史不覆盖。 |
| 幂等 / 一致性 | `NFR-MI-021` 跨节点重复动作不得制造第二套 truth 或改写既有事实。 | 重复动作复用既有效果或形成关联的新事实;当前定义、资格和供给语义不矛盾。 |
| 可观测性 | `NFR-MI-022` 关键状态、变化、阻塞 owner 和 gap 必须以安全领域结论被稳定观察。 | 可区分各类 source / build / eligibility / availability / handoff 状态和 local / external owner;不保存 raw observed body。 |

### 7.9 来源与 Step 14 承接映射

| 能力 / 范围 | NFR | 直接来源 | Step 14 必须形成的验收切口 |
|---|---|---|---|
| C-MI-1 | NFR-MI-001~003 | G-MI-002/007;BR-MI-001~005;D-MI-001~005;IF-MI-001/002 | 已有定义读取、来源 resolved、missing / stale / conflict / unavailable 和 forbidden body |
| C-MI-2 | NFR-MI-004~006 | G-MI-003;BR-MI-006~010;D-MI-006~012;IF-MI-003/004 | 完整 pin、live-state veto、revision / derivation 来源和重复校准 |
| C-MI-3 | NFR-MI-007~009 | G-MI-004/007;BR-MI-011~015;D-MI-013~018;IF-MI-005~008 | nightly / event 分离、依赖失败、duplicate / retry、多 attempt 和结果分层 |
| C-MI-4 | NFR-MI-010~012 | G-MI-005/007;BR-MI-016~020;D-MI-019~025;IF-MI-009~011 | provenance 完整性、applicable gate fail-closed、reevaluation 与 Artifact gap |
| C-MI-5 | NFR-MI-013~016 | G-MI-006/007;BR-MI-021~025;D-MI-016/024/026~030;IF-MI-012~014 | pinned entry、依赖失效三层状态、availability transition、rollback 和 duplicate change |
| 全局 | NFR-MI-017~022 | G-MI-001~007;NG-MI-001~015;跨节点规则 / 数据 / seam | 跨链追溯、owner / security veto、外围降级、重复动作、状态归因和性能基线缺失边界 |

### 7.10 跨节点与 historical 污染审计

| 检查项 | 结果 |
|---|---|
| 六类非功能类别是否逐项检查 | pass;每类均适用且至少有能力级与 / 或全局要求 |
| 每条 NFR 是否有能力节点或全仓目标来源 | pass |
| 每条 NFR 是否有非空判断口径 | pass |
| 是否把全局要求硬塞入单一能力节点 | no;NFR-MI-017~022 单列 |
| 是否存在同义重复或局部 / 全局冲突 | no;局部约束具体对象,全局约束跨链不变量 |
| 是否写入缓存、数据库、日志字段、重试算法、监控平台或加密实现 | no |
| 是否伪造 SLA、成功率、P95、构建耗时、镜像大小、架构矩阵或 retention | no |
| 是否固定未获 authority 的 evidence kind / 产品 | no |
| 是否将 adapter / fake success 写成 domain outcome / readiness | no |
| 是否越权拥有 observability、governance、Artifact、container 或 live-state truth | no |
| 是否可由 Step 14 承接 positive / negative / failure 切口 | pass;主题已固定,AC 编号留给 Step 14 |

| historical item | 当前处置 |
|---|---|
| `9/9`、`100%`、`99.9%` | 删除,不得回填正式 00 |
| `P95 < 100ms`、固定构建时间 / 镜像大小 | 删除,等待正式 workload 和 measurement baseline |
| `amd64 + arm64` | 保持 Q-MI-002 外围 pending,不进入当前 NFR |
| Critical=0、BOM / signature 100% | 替换为 applicable gate fail-closed;具体种类 Q-MI-004 pending |
| IPC compatibility 100% | 删除;MI-UP-002 未闭口,只保留 component pin / gap 语义 |
| Trivy / Grype / cosign / buildx | 删除产品绑定;Q-MI-003 后移 04 |
| 固定 retention / archive | 删除时长;只保留历史不覆盖 |

## 8. 回填草稿

正式 00 §13 使用 §7.8 三列固定表,按 C-MI-1~5 分组后单列 NFR-MI-017~022 全局质量约束。正文在表前保留一段量化说明:当前没有获 authority 的 workload、measurement baseline 或已发生实现证据,因此所有数值型 SLA / SLO 均不在本轮需求中伪造;现阶段以离散状态、禁止行为、链完整性和历史不覆盖作为判断口径。

正式章节必须明确:

1. 六类是最小检查框架,不是要求每个能力节点机械平均分配。
2. 能力级要求约束具体节点,全局要求约束端到端链,两者不得互相替代。
3. Fail-closed、pinned、no-body、history-preserving 是当前质量底线,不是 implementation readiness 声明。
4. 未来量化指标必须基于正式 workload、measurement baseline、owner 和变更流程,不能从旧文档回流。

## 9. 待确认事项

| ID | 受影响 NFR | 当前质量上限 |
|---|---|---|
| `MI-UP-001` | NFR-MI-013~016/020/022 | exact member-service entry / confirmation contract pending;只能验供给语义和 conservative gap |
| `MI-UP-002` | NFR-MI-004~006/019 | component shape / compatibility owner pending;不得验 compatibility readiness |
| `MI-UP-003` | NFR-MI-001~003 | exact mapping consumer surface pending;只能验来源分层与 fail-closed |
| `MI-UP-004` | NFR-MI-001/017/019 | Core image schema pending;不得建立 shared-schema 性能或兼容目标 |
| `MI-UP-005` | NFR-MI-007~009/018/022 | event schema pending;只能验 event lane unavailable 与 nightly 独立语义 |
| `MI-UP-006` | NFR-MI-004~006/019 | seed / policy exact owner pending;正文禁止和 ref / snapshot 分层 current |
| `MI-UP-007` | NFR-MI-010~012/014~016/020 | Artifact handoff condition / schema pending;只能验 gap,不得验 positive handoff |
| `MI-UP-008` | NFR-MI-018 | future hardened-base enhancement only |
| `MI-UP-009` | NFR-MI-015/020/022 | 无 outbound event authority;availability 可追溯不等于事件输出 |
| `Q-MI-001~002` | NFR-MI-018 | variant enhancement 不进入当前质量分母 |
| `Q-MI-003` | 所有 adapter 相关要求 | 产品绑定后移 04,不影响 domain judgment |
| `Q-MI-004` | NFR-MI-010~012/019 | evidence kind / priority pending;适用 gate 不可绕过 current |

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| C-MI-1~5 是否按固定顺序完成能力级 NFR 停审 | pass |
| 六类全局质量约束是否单独完成总审 | pass |
| 每条要求是否有来源和判断口径 / 目标值 | pass |
| 无法量化项是否说明 baseline 缺失而非伪造数字 | pass |
| 每条 NFR 是否有 Step 14 承接主题 | pass |
| historical / pending / owner / readiness 污染是否受控 | pass |

`gate_status = pass`;允许创建 Step 14,不得跳到 Step 15 或修改正式 00。
