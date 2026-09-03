# Step 12. 横切关注点

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `cross_cutting_concerns` | pass | 六类横切要求均已落到具体主线、判断口径和保护目标;BC-MI-01~05 逐单元适用性、逐项停审和跨项审计均无 unresolved 冲突 | 进入 Step 13 演进路线 | `01_arch_step_02_goals_constraints.md`;`01_arch_step_06_container_deployment.md`;`01_arch_step_08_data_ownership_consistency.md`;`01_arch_step_09_interactions_communication.md`;`01_arch_step_10_technology_choices.md`;`01_arch_step_11_alternatives_tradeoffs.md` |

### 1.1 Step 内计划

- [x] 读取 ledger、01 flow、Step 2 / 5~11、正式 00 NFR / VETO、架构 SOP Step 12 与书写规范 §4.13。
- [x] 从本仓边界、数据、一致性、交互和机制中筛选真正跨主线的横切要求。
- [x] 为每项要求写清作用范围、架构约束、保护目标和可审查判断口径。
- [x] 按 BC-MI-01~05 判断安全、审计、可观测、韧性、性能 / 容量和配置适用性。
- [x] 对每项横切约束执行适用性、可判断性和实现下沉停审。
- [x] 审计模板化空话、配置绕行、owner 冲突、数据 / 通信冲突和兼容性伪闭口。
- [x] 排除监控产品、告警阈值、密钥操作、压测脚本、运行手册和量化 SLA / SLO。
- [x] 核对 MI-UP-001~009、Q-MI-001~004 及 measurement baseline 均未被横切要求默认关闭。

## 2. 本步输入

| 输入 | 本步承接 |
|---|---|
| Step 2 | AG-MI-001~008、IC-MI-001~011、离散可判断口径和无量化 baseline 边界 |
| Step 5~7 | BC-MI-01~05、运行承载、向内依赖与六类跨仓 seam |
| Step 8 | Truth / ref / snapshot / projection、局部强一致、跨 owner 有界最终一致和 history-preserving recovery |
| Step 9 | 同步即时判断、后台延后承接、conditional inbound event 和 explicit failure upper bound |
| Step 10~11 | TM-MI-001~010 与采用的独立镜像域控制面主线 |
| 正式 00 | NFR-MI-001~022、AC-MI-001~030、VETO-MI-001~007 |
| MI-UP / Q | Exact contract、event、Artifact handoff、gate inventory、产品和平台范围上限 |

## 3. SOP 问题回答

1. 安全边界如何处理?

   回答:所有外部输入必须通过正式 ref / snapshot / safe conclusion / adapter 边界进入;secret、live memory、checkpoint、workspace live content 以及外部 semantic / evidence / Artifact / container body 不得进入镜像域 truth 或静态构建输入。Production entry 必须 immutable pinned,正式 applicable gate 不得被配置、adapter success 或 unknown 绕过。

2. 可观测性需要覆盖哪些正式对象和关键链路?

   回答:必须能从 safe domain conclusion 区分 definition / revision、intent / snapshot / attempt / candidate、provenance / eligibility、availability / entry / handoff,并定位当前 stage、local / external owner、blocking reason、gap 和 projection freshness;不要求复制 external log、job、report 或 observed body。

3. 可用性和韧性需要守住什么底线?

   回答:外部 source、builder、registry、evidence、Artifact 或 consumer seam 失败不得伪造 positive state,也不得反写已成立的本地 truth / history。可恢复失败必须保持 rejected / pending / failed / blocked / unknown / unavailable / gap,并通过新 revision、attempt、evaluation 或 availability transition 恢复。

4. 性能预算是否需要给出口径?

   回答:需要结构口径但当前不能给数值。已有 truth / entry 的读取与即时领域判断不得触发 build、container instantiation 或 external body 获取;长时构建、gate 和 handoff 使用后台延后承接;各阶段等待与积压必须可分辨,量化预算等待正式 workload / measurement baseline。

5. 配置如何管理,哪些配置不应散落?

   回答:会改变 source authority、mapping binding、component / extras / seed pin、build source、applicable gate set、variant derivation、availability 或 adapter compatibility 的配置必须经对应 owner 输入进入版本化语境,不得以部署开关或产品默认值绕过核心判断。产品连接、协议和 exact schema 留在外部 adapter / 后续配置设计,不能散入 BC-MI-01~04 的领域规则。

6. 审计与可追溯性如何保证?

   回答:Definition -> revision -> intent -> attempt -> digest / provenance -> eligibility -> availability -> handoff 必须保持连续引用;所有变化使用 append / supersede / explicit transition 语义,projection 可重建但不得补写 truth。Body-free trace 保存 ref、来源状态和本地结论,不复制外部正文。

7. 哪些横切项与本仓无关,不应机械照抄?

   回答:认证授权体系、密钥轮换制度、网络分区、跨地域容灾、容器健康治理、on-call 手册、观测 backend、日志字段、告警阈值、压测脚本、容量数字、retention 数值和产品兼容矩阵不在当前架构结论内。它们或属于其他 owner,或缺少正式 baseline,或属于后续实现 / 配置 / 运维层。

8. 每个架构单元是否完成横切适用性与停审?

   回答:BC-MI-01~05 已逐项映射六类横切约束;每项均有具体落点和“不应承担”的上限。10 项正式横切要求逐项通过适用原因、判断口径和无实现下沉审计。

## 4. 当前材料问题诊断

| 候选横切表达 | 问题 | 当前处理 |
|---|---|---|
| “安全、高可用、高性能、可观测” | 只有质量标签,没有作用面或判断口径 | 重写为 XC-MI-001~010 的边界约束和保护目标 |
| 固定 scanner / signer / secret store | 产品与 Q-MI-004 未闭口 gate inventory 混入架构 | 只保留 authority-driven gate 与 body-free boundary |
| Prometheus / logs / alert fields | 观测实施方案,且可能复制 external body | 只要求 safe domain stage / owner / gap 可观察 |
| Retry / rollback runbook | 运维步骤替代恢复语义 | 只锁新 attempt / evaluation / transition 与 history-preserving |
| Build duration / image size / SLO 数值 | 无 workload / measurement baseline | 使用结构口径;量化保持 pending |
| Config file / env / feature flag 清单 | 提前下沉 04 或实现层 | 只约束配置 authority、版本语境和不得绕行主线 |
| “兼容所有 runtime / tools / member-service” | MI-UP-001/002/006 未闭口,无法验证 | Exact compatibility 保持 blocked;只固定 pinned input + fail-closed |
| Multi-region / HA / autoscaling | 当前无部署与容量依据 | 不作为当前横切要求;正式触发后重开演进决策 |

## 5. 改动前后对比

| 维度 | 模板化候选 | 当前横切结论 |
|---|---|---|
| 安全 | 工具与制度清单 | 外部输入隔离、forbidden body、immutable entry、gate fail closed |
| 审计 | “记录日志” | 领域链连续、历史不覆盖、body-free source trace |
| 可观测 | Backend / field / dashboard | Stage、owner、gap、transition 和 freshness 的 safe conclusion |
| 韧性 | 重试 / 回滚操作步骤 | 保守状态、新语境恢复、外部失败不反写本地 truth |
| 性能 / 容量 | 未经证据的数值 | 同步读取不承接长时工作、阶段等待可归因、量化 deferred |
| 配置 / 兼容 | 散落开关与产品默认 | Authority-bounded versioned change + adapter isolation + fail closed |
| 停审 | 一次性写“全部适用” | 每项约束与每个架构单元分别检查,再做跨项审计 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按六个标准类别各写一句通用要求 | 简短 | 无本仓落点,无法审查 | 不采用 |
| 把正式 00 的 22 条 NFR 原样复制 | 需求追溯直观 | 重写需求且没有架构提升 | 不采用 |
| 将工具、阈值和操作手册写入横切章 | 实施感强 | 越过 01 粒度和外部 owner | 不采用 |
| 收敛 10 条跨多个结构面的架构约束 | 约束具体,可映射单元与前序决策 | 需要后续文档继续细化实现判断 | 采用 |
| 将兼容性单列并宣称正向支持 | 对消费方直观 | Exact contracts 与 releases 尚未闭口 | 不采用;纳入配置 / 变更边界并保持 fail closed |
| 当前给出量化性能 / 容量目标 | 便于测量 | 无正式 workload / baseline,数字不可信 | 不采用;保留结构判断口径 |

## 7. 结构化中间产物

### 7.1 横切类别与适用性结论

| 横切类别 | 本仓适用性 | 判断口径 | 明确排除 |
|---|---|---|---|
| 安全边界 | 适用;贯穿外部输入、装配、gate、entry 和 adapter | 无 forbidden body、mutable production ref、gate bypass 或 external direct write | 认证系统、密钥生命周期制度、网络安全手册 |
| 审计与可追溯 | 适用;贯穿五节点 truth、transition、handoff 和 gap | Entry / failure 可沿本仓关系回链,历史不覆盖,外部 body 不复制 | 外部审计 backend、report archive、retention 数值 |
| 可观测性 | 适用;贯穿三类运行角色、状态承载和六条交互 | Safe domain state、owner、blocking reason、gap 和 freshness 可区分 | Monitoring / logging 产品、dashboard、alert 配置 |
| 韧性 / 恢复能力 | 适用;贯穿外部失效、后台承接、rollback 和 projection | 无伪成功 / 反写;恢复形成新语境;projection 可重建 | On-call 流程、脚本、跨地域灾备方案 |
| 性能 / 容量约束 | 适用但当前仅结构口径 | 即时读取不启动长时工作;阶段等待可归因;量化有 authority 前保持 pending | SLA / SLO、吞吐 / 时延 / 大小数字、autoscaling 配置 |
| 配置与变更控制 | 适用;贯穿 authority、pin、gate、adapter 和 supply transition | 关键变化有 owner、版本语境和显式判断;配置不能绕过领域规则 | 配置键、文件格式、环境变量、产品 compatibility matrix |

### 7.2 横切关注点约束

| 横切关注点 | 作用范围 | 约束要求 | 保护目标 | 说明 |
|---|---|---|---|---|
| `XC-MI-001` 外部输入与正文隔离 | BC-MI-01~05 的 source、ref、snapshot、adapter 与 build input | 外部能力只能经正式 seam 提供获准 ref / safe snapshot / conclusion;secret、live 与 external semantic / backend body 不得进入 truth 或静态输入 | 保护镜像域 owner、静态 / live 边界和依赖方向 | 跨定义、构建、资格、供给和支撑上下文,不是单接口过滤规则。 |
| `XC-MI-002` Immutable supply 与 gate 安全 | Assembly pin、candidate identity、eligibility、availability / entry | Production entry 禁 mutable selector;provenance 不完整或 applicable gate missing / failed / conflict / unknown 时不得形成 positive eligibility / availability | 保护输出身份、供应链资格和下游入口不被绕过 | 具体 gate kind / signer / registry 未固定,不影响 fail-closed 机制成立。 |
| `XC-MI-003` 端到端领域追溯 | Definition -> revision -> intent -> attempt -> provenance -> eligibility -> availability -> handoff | 每个关键判断和 transition 必须回指来源语境;旧 revision / attempt / evaluation / availability 不得原地覆盖 | 保护责任归因、rollback 解释和边界争议审查 | 这是领域关系约束,不是“多打日志”。 |
| `XC-MI-004` Safe domain 可观测 | 三类处理角色、正式 / 派生状态承载、IX-MI-01~06 | 无需读取 raw job / log / report body即可区分 stage、result、local / external owner、blocking reason、gap 和 projection freshness | 保护主线是否成立及失败位置的可见性 | Observability backend 与字段方案属于外部 / 后续设计。 |
| `XC-MI-005` 保守失败与显式恢复 | Source 校准、build、gate、handoff、supply transition 和 projection refresh | 失败保持 rejected / pending / failed / blocked / unknown / unavailable / gap;恢复只能通过新 revision / attempt / evaluation / transition 或 projection rebuild | 保护失败不被伪装完成且历史持续可解释 | 不规定 retry 次数、回放工具或人工操作步骤。 |
| `XC-MI-006` 核心与外围故障隔离 | Nightly 主线、conditional event、external adapters、Artifact / consumer gaps、derived views | 外围增强或外部 seam 失效不得取消核心语义、反写既有 truth 或扩大为全局 positive / negative 结论;只冻结受影响 lane | 保护核心 truth / history 的可用性与局部降级能力 | 这不是多副本 / HA 承诺,也不表示外部 seam ready。 |
| `XC-MI-007` 即时判断与长时工作隔离 | Definition / baseline query、availability transition、entry resolve 对 build / gate / handoff | 已有事实读取和即时领域判断不得触发 build、container instantiation 或 external body fetch;长时工作必须后台承接且 accepted 不等于 completed | 保护消费主链不被构建时延绑架 | 当前无数值 latency budget,但结构性阻塞可判断。 |
| `XC-MI-008` 阶段容量与等待可归因 | Intent、attempt、evaluation、handoff、projection backlog 和运行承载 | 不同阶段的等待、失败和积压必须保持可分辨;不得因同部署而压成单一 pipeline status;是否拆分承载须由正式 workload / measurement 触发 | 保护容量问题可定位并允许后续按依据演进 | 不预设 worker 数、queue、autoscaling 或服务拆分。 |
| `XC-MI-009` Authority-bounded 配置变更 | Mapping / component / extras / seed source、build source、gate set、variant derivation、supply decision | 任何改变核心判断的配置必须来自正式 owner,绑定明确语境并形成新 revision / evaluation / transition;部署开关和默认值不得改写 truth | 保护架构主线不被配置旁路 | 具体配置项和载体留给 04,approval truth 仍外置。 |
| `XC-MI-010` 外部合同与产品兼容隔离 | Core compile contract、runtime / event / ref / adapter / fake seams | Exact contract / release / product capability 未闭口时必须 fail closed 或形成 gap;adapter / fake parity 不得证明生产兼容或 readiness,产品替换不得改变领域结果语义 | 保护跨仓裁剪、产品中立与兼容结论真实性 | MI-UP-001~009 未关闭;本项不是正向 compatibility claim。 |

### 7.3 判断口径

| 类别 | pass 判断 | fail / blocker 判断 | 当前数值状态 |
|---|---|---|---|
| 安全 | 只经正式 seam;无 forbidden body / mutable entry / gate bypass | 直接写 core、复制 body、猜 pin、unknown-as-pass | 不需要虚构数值 |
| 审计 | 关键事实 / transition 可连续回链且旧语境保留 | 链断裂、原地覆盖、projection 补写 truth | Retention 数值 pending |
| 可观测 | Stage、结果、owner、gap、freshness 可由 safe conclusion 区分 | 只能依赖 raw backend body 或单一 success 布尔值 | Alert / metric baseline pending |
| 韧性 | 外部失败局部挂起,恢复使用新语境,既有 truth 不反写 | 失败伪成功、全局串线、删除历史恢复 | RTO / RPO 不在当前 authority 内 |
| 性能 / 容量 | 已有读取不启动长时工作,等待按 stage 可归因 | 同步请求承接 build / gate / instantiation 或积压不可定位 | Latency / throughput / size baseline pending |
| 配置 / 变更 | 关键变更有 owner、版本语境、显式 decision | 配置默认绕过 owner / gate / history 或宣称未验证兼容 | Exact config / compatibility evidence pending |

### 7.4 按架构单元的横切适用表

| 架构单元 | 安全边界 | 审计 / 追溯 | 可观测性 | 韧性 / 恢复 | 性能 / 容量 | 配置 / 变更 |
|---|---|---|---|---|---|---|
| BC-MI-01 定义与装配基线 | XC-001:只接 body-free mapping / component / seed refs;拒绝 live / secret body | XC-003:definition、revision、derivation 与全部 pins 可回链 | XC-004:accepted / missing / stale / conflict / incomplete / blocked 可区分 | XC-005/006:source failure 不覆盖既有定义,变化 fail closed | XC-007:定义读取不触发 build / external body | XC-009/010:source / pin 变化形成新 revision;exact seams pending |
| BC-MI-02 构建意图与候选 | XC-001/002:validated source + immutable snapshot;adapter success 不等于 candidate | XC-003:intent -> attempt -> outcome / candidate 连续且 retry 不覆盖 | XC-004:pending / failed / blocked / unknown 与 external owner 可定位 | XC-005/006:新 attempt 恢复;event / builder 失效局部挂起 | XC-007/008:后台构建,attempt backlog 独立可辨 | XC-009/010:build source 有 authority;event / component compatibility fail closed |
| BC-MI-03 Provenance 与资格 | XC-001/002:只接 safe conclusions;完整 provenance + applicable gates | XC-003:digest binding、evaluation、gate source 与 Artifact gap 可追 | XC-004:provenance / gate / handoff stage 和 blocker 可辨 | XC-005/006:新 evaluation;gate / Artifact 失败不改 candidate | XC-007/008:gate / handoff 延后承接且等待分层 | XC-009/010:gate set 由 authority;inventory / Artifact contract pending |
| BC-MI-04 供给与实例化入口 | XC-002:pinned eligible entry;registry / consumer success 不替代 local decision | XC-003:publish / replace / rollback / retire 回指 prior availability | XC-004:availability、entry、handoff / consumer gap 可辨 | XC-005/006:新 transition;external failure 不反写既有 availability | XC-007/008:resolve 不等待 container;handoff backlog 独立 | XC-009/010:supply change 显式;consumer exact contract pending |
| BC-MI-05 外部引用与派生维护 | XC-001:shadow 只保存 ref / safe snapshot / conclusion / gap | XC-003:source trace 与 projection provenance 可回链但不造 truth | XC-004:stale / rebuilding / unavailable 和 ref gap 可辨 | XC-005/006:projection 可重建,external outage 不反写 core | XC-007/008:派生刷新不进入同步写路径,积压可定位 | XC-009/010:adapter 绑定外置;产品替换不改变领域语义 |

表中 `XC-001` 等缩写均指 §7.2 对应 `XC-MI-*`。同部署不取消逐单元横切边界;表中 `pass` 也不表示任何进程、存储、产品或外部合同已经实现或验证。

### 7.5 横切关注点逐项停审

| 横切项 | 适用原因明确 | 判断口径可审查 | 无实现 / 手册下沉 | open item 未伪闭口 | gate_status |
|---|---|---|---|---|---|
| XC-MI-001 | pass | pass | pass | pass | pass |
| XC-MI-002 | pass | pass | pass | pass | pass |
| XC-MI-003 | pass | pass | pass | pass | pass |
| XC-MI-004 | pass | pass | pass | pass | pass |
| XC-MI-005 | pass | pass | pass | pass | pass |
| XC-MI-006 | pass | pass | pass | pass | pass |
| XC-MI-007 | pass | pass | pass | pass | pass |
| XC-MI-008 | pass | pass | pass | pass | pass |
| XC-MI-009 | pass | pass | pass | pass | pass |
| XC-MI-010 | pass | pass | pass | pass | pass |

这里的 `gate_status` 只表示该架构约束的讨论材料达到进入下一 Step 的条件,不表示实现、测试、运维或外部 integration 通过。

### 7.6 跨横切约束审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 模板化空话 | pass | 每项均有本仓作用范围、约束、保护目标和判断口径。 |
| 架构单元适用遗漏 | pass | BC-MI-01~05 均逐类映射,无“全局适用”替代分析。 |
| Owner / 安全冲突 | pass | 外部 truth、secret / live body、gate authority 与 approval 继续外置。 |
| 数据 / 一致性冲突 | pass | 与 Step 8 的局部强一致、有界最终一致和新语境恢复一致。 |
| 通信方式冲突 | pass | 与 Step 9 的同步判断、后台承接和 conditional inbound event 一致。 |
| 配置绕行 | pass | 配置只承接 owner 输入,不得改变 staged decision 或补造 positive state。 |
| 审计追溯缺口 | pass | 五节点链、transition、gap 与 projection 边界均被覆盖。 |
| 兼容性伪闭口 | pass | MI-UP exact contracts 仍 pending;adapter / fake 不证明 readiness。 |
| 产品 / 数值污染 | pass | 无监控、构建、registry、scanner、signer、queue 产品或量化 SLA / SLO。 |
| Pending / readiness | pass | MI-UP-001~009、Q-MI-001~004 全部维持原状态。 |

### 7.7 横切影响说明

这些要求必须进入架构层,因为它们会同时改变多个上下文的输入边界、状态成立条件、交互承接和恢复语义,不能等到单点实现后再补。它们不替代安全制度、观测方案、容量计划、配置清单或运维手册,而是为这些后续材料设定不可绕过的结构上限。当前无 workload、measurement 或 exact compatibility evidence,因此性能与兼容只给出可判断结构和 fail-closed 边界。任何后续产品或部署选择都必须满足这些约束,不能反向改写镜像域 truth。

## 8. 回填草稿

正式 01 §13 回填 §7.1 类别适用性、§7.2 横切约束、§7.4 单元映射、§7.6 审计结论和 §7.7 的 1 段边界说明。正式章不复制 §7.3 的全部过程检查表,但必须写明无量化 baseline、exact compatibility pending 以及 `pass` 不代表实现 readiness。

## 9. 待确认事项

- MI-UP-001/002/003/006/007 继续阻塞受影响 external contract / release compatibility 的正向结论。
- MI-UP-004 关闭前不新增 image-specific Core compile contract。
- MI-UP-005/009 继续使 event 仅为 conditional inbound seam 且无 outbound authority。
- Q-MI-001/002/004 继续限制 variant / platform / gate inventory,不由横切章补定义。
- Q-MI-003 的 builder / registry / evidence backend 产品绑定未决;继续保持 adapter-neutral,不得借横切约束预选产品。Supply usage summary 仍按 F-MI-E05 / R-MI-010 保持 future,不得借可观测性约束扩张为当前能力。
- 性能、容量、retention、RTO / RPO、alert threshold 均无正式 workload / measurement baseline,不得在 01 中量化。
- 本 Step 不新增开放编号,也不声明任何外部 compatibility、implementation 或 operational readiness。

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 六类横切关注点是否均有本仓适用性与判断口径 | pass |
| 10 项约束是否写清作用范围、要求和保护目标 | pass |
| BC-MI-01~05 是否逐单元完成横切适用与停审 | pass |
| 是否无模板空话、实现手册、产品和伪造量化值 | pass |
| 是否与 Step 8 / 9 的数据和通信语义无冲突 | pass |
| 配置、兼容、pending 和 readiness 边界是否完整 | pass |

`gate_status = pass`;允许更新 flow / ledger 后创建 Step 13,不得跳到 Step 14 或修改正式 01。
