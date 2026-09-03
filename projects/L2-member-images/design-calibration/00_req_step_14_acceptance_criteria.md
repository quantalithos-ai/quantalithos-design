# Step 14. 验收标准

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `cross_node_acceptance_audit` | pass | AC-MI-001~030 已按 C-MI-1~5 完成能力级停审并覆盖闭环、功能、规则 / 边界、数据归属和非功能五类;VETO-MI-001~007 可回指明确来源,跨能力无遗漏 / 重复 / 无来源验收 | 进入 Step 15 风险与待确认事项 | `00_req_step_07_core_capability_loop.md`;`00_req_step_09_functional_requirements.md`;`00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`;`00_req_step_12_interfaces_dependencies.md`;`00_req_step_13_non_functional_requirements.md` |

### 1.1 Step 内计划

- [x] 读取项目 ledger、00 flow、需求 SOP Step 14 和书写规范 §4.14。
- [x] 固定五类验收类别和一票否决项适用边界。
- [x] 按 C-MI-1 -> C-MI-5 逐节点覆盖 capability、F、BR、D、IF / DEP 和 NFR 来源。
- [x] 每个节点同时形成 positive、negative 和 dependency-failure 判断口径并停审。
- [x] 对 pending positive seam 只设计 conservative gap / fail-closed 验收,不伪造 integration readiness。
- [x] 单列跨链、依赖类型、全局质量和外围降级验收。
- [x] 将只会造成一般缺陷或外围缺口的情况排除出一票否决项。
- [x] 后置审计旧 9/9、100%、固定工具 / 架构、容器启动和报告完成口径。
- [x] 完成验收来源覆盖、重复、遗漏、veto 过宽和实现泄漏审计。
- [x] 形成正式 00 §14 回填草稿并更新 flow / ledger。

## 2. 本步输入

| 输入 | 本步承接 |
|---|---|
| Step 7 | C-MI-1~5 的能力成立条件和逻辑顺序 |
| Step 9 | F-MI-001~015 核心功能;F-MI-E01~E05 外围功能 |
| Step 10 | BR-MI-001~025 核心规则;BR-MI-E01~E03 外围规则 |
| Step 11 | D-MI-001~030 核心数据;D-MI-E01~E04 外围数据 |
| Step 12 | IF-MI-001~014、DEP-MI-001~016 和 seam 类型上限 |
| Step 13 | NFR-MI-001~022 的能力级与全局质量判断口径 |
| pending register | MI-UP / Q 只允许形成受影响范围和保守验收上限 |

## 3. SOP 问题回答

1. 核心能力闭环怎样算成立?

   回答:C-MI-1~5 必须依次具备可判断结果,从正式 mapping 来源、完整 pinned 装配、确定 input snapshot / attempt、digest / provenance / eligibility 到 availability / pinned entry 连续可追;任一节点缺失都不能把整个闭环判为通过。

2. 功能能力怎样算完成?

   回答:F-MI-001~015 的外部可见正向行为、负向结果和依赖失效语义全部可判断,并由 IF-MI-001~014 的能力面承接。未闭口 exact seam 只要求明确 unavailable / pending / gap,不要求当前出现正向集成结果。

3. 规则 / 边界怎样算没有串线?

   回答:BR-MI-001~025 的唯一来源、pinned、no-fallback、no-live-state、no-fake-candidate、gate fail-closed、availability / handoff 分层全部成立;DEP 类型与 compile/runtime/event/ref/adapter/fake seam 不混写。

4. 数据归属怎样算正确?

   回答:D-MI-001~030 始终使用真相、快照、引用、禁止保存正文四类;本仓派生判断归本仓 truth,外部语义、live、backend、Artifact 和 observed body 不进入本仓领域正文。物理构建包含不转移语义 owner。

5. 非功能怎样算达标?

   回答:NFR-MI-001~022 的离散判断口径全部成立:已有事实查询不触发重操作,依赖失效不改写 truth,安全红线不越界,全链可追,重复变化不覆盖,关键状态和 gap 可稳定区分。当前没有伪造数值目标。

6. 哪些失败是一票否决?

   回答:核心闭环缺失却宣称完成、hardcode / fallback 或 mutable ref、live / secret / external body 入仓、虚假 candidate、provenance / gate 绕过、不合格版本供给、相邻 owner / pending seam / consumer readiness 被本仓伪造等会否决整份需求。外围增强未启用、某个未来产品未选或一个未闭口 positive seam 本身不是 veto;把它伪报为已闭口才是 veto。

## 4. 当前文档问题诊断

| 旧验收口径 | 问题 | 当前处置 |
|---|---|---|
| 9/9 Role nightly build | 固定 Role 集与未发生构建事实 | 改为当前正式 mapping 集合的来源 / gap 可解释,不声明 build passed |
| scan / sign / BOM / Critical 指标 | evidence kind / authority pending | 改为正式适用 gate 不可绕过;具体 positive evidence 不进入当前完成声明 |
| `amd64 + arm64` | 外围 Q-MI-002 被写入核心分母 | 移出核心验收,只验外围未启用不影响核心 |
| member-service 样本启动成功 | 越权验收容器 lifecycle 且 exact contract pending | 只验 pinned entry 或 contract gap;不验 launch / health |
| compatibility report 100% | report owner / contract pending | 只验 component pin、来源与 gap,不自造 report |
| CI / registry / adapter 请求成功 | 将外部动作成功等同 domain outcome | 必须形成本仓 candidate / eligibility / availability 事实才可通过对应语义 |
| 测试命令 / 工具 /脚本 | 将需求验收写成测试方案 | 全部移出;本步只写验收对象和通过条件 |

## 5. 改动前后对比

| 维度 | 旧口径 | 当前口径 |
|---|---|---|
| 验收组织 | 流水线步骤和数字清单 | 五个能力节点 x 五类验收 + 跨链总审 |
| 负向路径 | 主要看成功输出 | missing / stale / blocked / failed / pending / unknown / gap 都可判断 |
| 依赖失败 | retry / backlog 实现动作 | 既有 truth 保持、受影响变化 fail closed、owner 可归因 |
| 边界 | 启动容器 / Artifact / evidence 混入 | 只验本仓 truth 和协作 gap,外部 outcome 不代填 |
| Veto | 一般缺陷与红线混排 | 只保留会使整个需求不应判定通过的边界破坏 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 每个 F / BR / D / IF / NFR 各建一条 AC | 映射直接 | 大量机械重复,验收对象碎片化 | 不采用 |
| 每节点只写一条综合 AC | 简短 | 无法证明五类来源和负向路径均被承接 | 不采用 |
| 每节点五类收口 + 跨链 / veto 总审 | 粒度可判断且覆盖可审计 | 需要单独维护来源矩阵 | 采用 |

## 7. 结构化中间产物

### 7.1 验收类别与状态口径

| 验收类别 | 本仓使用口径 |
|---|---|
| 核心能力闭环验收 | 判断对应 C-MI 节点的进入 / 退出条件和不可替代结果是否成立 |
| 功能能力验收 | 判断 F 的外部可见 positive / negative / dependency-failure 结果是否完整,并由 IF 能力面承接 |
| 规则 / 边界验收 | 判断 BR 不变量、禁止行为、显式变化、owner 和 DEP / seam 边界是否成立 |
| 数据归属验收 | 判断 D 的 truth / snapshot / ref / forbidden body 分类和生命周期是否正确 |
| 非功能验收 | 判断 NFR 的质量底线和可判断口径是否成立 |

状态纪律:本文件定义的是验收条件,不是验收结果。`pass` 只表示需求设计覆盖审计通过,不代表实现、测试、integration、artifact、evidence、signoff 或 readiness 已发生。

### 7.2 C-MI-1 受控定义验收

| ID | 验收类别 | 验收项 | 验收条件 | 主要来源 |
|---|---|---|---|---|
| `AC-MI-001` | 核心能力闭环验收 | 受控镜像定义节点成立 | 每个进入本仓语境的 variant / persona 镜像身份均有唯一正式 mapping 来源或明确 gap;来源异常不能进入 C-MI-2。 | C-MI-1;G-MI-002/007 |
| `AC-MI-002` | 功能能力验收 | 定义承接、来源判定与追溯能力 | F-MI-001~003 的定义、accepted / missing / stale / conflict / unavailable 和 body-free 追溯结果均可由 IF-MI-001/002 表达;MI-UP-003 未闭口时不产生伪 accepted。 | F-MI-001~003;IF-MI-001/002 |
| `AC-MI-003` | 规则 / 边界验收 | Mapping 唯一来源与 no-fallback | 本仓不枚举 Role、不编辑 / 复制 mapping truth,也不以 hardcode、缓存默认值或 `latest` 补齐异常来源;变化形成新判断语境。 | BR-MI-001~005;DEP-MI-001/002 |
| `AC-MI-004` | 数据归属验收 | 定义 truth 与 mapping 外部数据分层 | D-MI-001/002 是本仓 truth,D-MI-003 是快照,D-MI-004 是 ref,D-MI-005 正文禁止入仓;四者生命周期不互相替代。 | D-MI-001~005 |
| `AC-MI-005` | 非功能验收 | 定义读取、来源失效与追溯质量 | 既有定义读取不触发构建 / 实例化;来源失效时既有 truth 可追且变化 fail closed;当前 / 历史结论均能关联来源而不保存正文。 | NFR-MI-001~003 |

C-MI-1 停审:功能、硬规则、四类数据、接口和三条 NFR 均有 AC 承接;positive mapping adapter 仍受 MI-UP-003 限制。`gate_status = pass`。

### 7.3 C-MI-2 装配与派生基线验收

| ID | 验收类别 | 验收项 | 验收条件 | 主要来源 |
|---|---|---|---|---|
| `AC-MI-006` | 核心能力闭环验收 | 完整 pinned 静态基线节点成立 | 一个 revision 只有在 member / runtime / tools / extras / base / seed 必要输入均来源可验证、pinned 且 static-input-safe 时才可进入 C-MI-3;否则明确 blocked / pending。 | C-MI-2;G-MI-003/007 |
| `AC-MI-007` | 功能能力验收 | 装配、live-state 判定与 derivation 能力 | F-MI-004~006 的完整基线 / incomplete、static-safe / rejected、new revision / unchanged / blocked 结果均可由 IF-MI-003/004 表达,历史可追。 | F-MI-004~006;IF-MI-003/004 |
| `AC-MI-008` | 规则 / 边界验收 | Pin、静态输入和外部 owner 红线 | 不允许 mutable ref、猜测版本、live / secret body 或复制外部正文补齐基线;component / tool / seed / Artifact truth 保持外置,revision 不原地覆盖。 | BR-MI-006~010;DEP-MI-003~006 |
| `AC-MI-009` | 数据归属验收 | Baseline / revision / derivation 与输入 ref 分层 | D-MI-006~008 作为本仓 truth,D-MI-009/010 作为外部 ref,D-MI-011/012 作为 forbidden body;物理装配不转移语义 owner。 | D-MI-006~012 |
| `AC-MI-010` | 非功能验收 | 装配安全、追溯和重复校准质量 | Forbidden body 出现即不形成有效基线;revision 可回指全部 pin / placement / derivation;重复校准不形成冲突基线,变化保留旧 revision。 | NFR-MI-004~006 |

C-MI-2 停审:完整 pin、静态 / live 红线、派生历史、ref owner 和重复校准均有 AC 承接;MI-UP-002/006 只允许 conservative gap。`gate_status = pass`。

### 7.4 C-MI-3 构建候选验收

| ID | 验收类别 | 验收项 | 验收条件 | 主要来源 |
|---|---|---|---|---|
| `AC-MI-011` | 核心能力闭环验收 | 可归责构建候选节点成立 | 有效 nightly / 获准意图关联完整 C-MI-2 revision,每次 attempt 固定 input snapshot,最终形成 candidate 或明确 failed / blocked / unknown;无输出不得进入 C-MI-4。 | C-MI-3;G-MI-004/007 |
| `AC-MI-012` | 功能能力验收 | 意图、快照 / 交接和结果分层能力 | F-MI-007~009 的 accepted / rejected / pending intent、immutable snapshot、attempt 及 candidate / failed / blocked / unknown 可由 IF-MI-005~008 表达;event positive lane 在 MI-UP-005 闭口前保持 unavailable。 | F-MI-007~009;IF-MI-005~008 |
| `AC-MI-013` | 规则 / 边界验收 | Nightly、authority、attempt 与 adapter 边界 | Nightly 语义保留;其他来源须获 authority;attempt 唯一关联 intent / revision / snapshot;请求、事件到达或 adapter success 不等于 candidate,未知输入 fail closed。 | BR-MI-011~015;DEP-MI-007~009 |
| `AC-MI-014` | 数据归属验收 | Build truth、snapshot、refs 与 backend body 分层 | D-MI-013/014 是本仓 truth,D-MI-015 是 attempt 快照,D-MI-016/017 是外部 ref,D-MI-018 backend body 禁止入仓;retry 不改写旧 attempt。 | D-MI-013~018 |
| `AC-MI-015` | 非功能验收 | 依赖降级、retry 和构建状态可观察质量 | Event / scheduler / builder / registry 失效只形成保守结果且不伪造 candidate;重复意图和 retry 保持关联 / 独立 attempt;无需外部 raw log 即可区分领域阶段和阻塞 owner。 | NFR-MI-007~009 |

C-MI-3 停审:nightly、conditional event、input snapshot、attempt / outcome 和 external backend owner 均有 AC 承接;没有真实 candidate 或构建结果声明。`gate_status = pass`。

### 7.5 C-MI-4 Provenance 与 eligibility 验收

| ID | 验收类别 | 验收项 | 验收条件 | 主要来源 |
|---|---|---|---|---|
| `AC-MI-016` | 核心能力闭环验收 | Provenance 与 eligibility 节点成立 | 只有 candidate digest 与完整来源链绑定、所有正式适用 gate 可判定且镜像域资格结果明确时才可进入 C-MI-5;Artifact handoff 独立表达 confirmed / gap。 | C-MI-4;G-MI-005/007 |
| `AC-MI-017` | 功能能力验收 | Provenance、gate 和 Artifact 分层能力 | F-MI-010~012 的 provenance complete / conflict、适用 gate satisfied / blocked / pending、eligibility 与 Artifact gap 可由 IF-MI-009~011 表达;MI-UP-007 期间不宣称 formal ref。 | F-MI-010~012;IF-MI-009~011 |
| `AC-MI-018` | 规则 / 边界验收 | Gate authority、fail-closed 与外部 truth 边界 | 适用 gate 只来自正式 authority;provenance 或适用 evidence 缺失 / 失败 / unknown 时无 positive eligibility;eligibility 不推导 Artifact handoff,evidence / key / Artifact body 不入仓。 | BR-MI-016~020;DEP-MI-010~013 |
| `AC-MI-019` | 数据归属验收 | Provenance / eligibility truth 与外部 snapshot / ref 分层 | D-MI-019/020 是本仓 truth,D-MI-021/022 是安全快照,D-MI-023/024 是正式外部 ref,D-MI-025 正文禁止入仓;不自造 evidence 或 Artifact ref。 | D-MI-019~025 |
| `AC-MI-020` | 非功能验收 | Gate 安全、完整追溯和重评一致性 | 正式适用 gate 不可绕过;digest 可追至 definition / revision / snapshot / attempt / evaluation;重新评估形成新语境,不改写原 provenance 或旧资格。 | NFR-MI-010~012 |

C-MI-4 停审:provenance、适用 gate、资格 / Artifact 分层、数据 owner 和重评历史均有 AC 承接;Q-MI-004 具体 evidence kind 保持 pending。`gate_status = pass`。

### 7.6 C-MI-5 供给与可实例化入口验收

| ID | 验收类别 | 验收项 | 验收条件 | 主要来源 |
|---|---|---|---|---|
| `AC-MI-021` | 核心能力闭环验收 | 显式供给与 pinned 入口节点成立 | 只有满足当前供给条件的 pinned digest / ref 才进入 availability;publish / replace / rollback / retire 显式且历史保留;入口或 conservative gap 可被下游语境读取。 | C-MI-5;G-MI-006/007 |
| `AC-MI-022` | 功能能力验收 | Availability、entry 和 handoff gap 能力 | F-MI-013~015 的供给变化、pinned entry / unavailable / contract-gap 以及 local supply / handoff / consumer gap 分层可由 IF-MI-012~014 表达;不声明容器启动或通知成功。 | F-MI-013~015;IF-MI-012~014 |
| `AC-MI-023` | 规则 / 边界验收 | Eligible pin、显式变化和 consumer owner 边界 | 禁止 `latest` / mutable selector;不合格或 ref 不可验证版本不得供给;变化不覆盖历史;容器 lifecycle / observed truth 外置,无 authority 时无 outbound event 或 positive consumer claim。 | BR-MI-021~025;DEP-MI-009/012/014 |
| `AC-MI-024` | 数据归属验收 | Availability / entry / gap truth 与 consumer 外部数据分层 | D-MI-026~028 是本仓 truth,D-MI-029 是获准安全快照,D-MI-030 正文禁止入仓,并只复用 D-MI-016/024 refs;下游结果不反写 availability。 | D-MI-016/024/026~030 |
| `AC-MI-025` | 非功能验收 | 入口解析、依赖降级、供给追溯和一致性 | 入口解析不等待容器 / consumer;registry / Artifact / member-service 失效产生 gap 而不改写 truth;变化可追且重复请求不形成矛盾 availability。 | NFR-MI-013~016 |

C-MI-5 停审:availability、pinned entry、rollback / retire、handoff gap、consumer owner 和四条 NFR 均有 AC 承接;MI-UP-001/007/009 阻塞受影响 positive integration,不阻塞 conservative semantics 验收。`gate_status = pass`。

### 7.7 跨能力与外围验收

| ID | 验收类别 | 验收项 | 验收条件 | 主要来源 |
|---|---|---|---|---|
| `AC-MI-026` | 核心能力闭环验收 | 五节点端到端镜像资产供给链 | C-MI-1~5 按逻辑前置连续成立;任一 pinned entry 可反查 definition -> revision -> intent -> attempt -> digest / provenance -> eligibility -> availability,任一断点有保守结果。 | C-MI-1~5;G-MI-001~007 |
| `AC-MI-027` | 规则 / 边界验收 | 仓际 owner 与依赖 seam 不串线 | Compile/runtime/event/ref/adapter/fake 分类与 Step 6 / 12 一致;消费关系不自动变源码依赖;fake / adapter success 不证明 readiness;当前无 event output。 | BR-MI-001~025;DEP-MI-001~016 |
| `AC-MI-028` | 数据归属验收 | 全仓四类数据与 body-free 边界 | D-MI-001~030 无重复 truth / owner 冲突;所有 secret、live、external semantic、backend、Artifact、container / observed body 均被排除,派生判断仍归本仓 truth。 | D-MI-001~030;NFR-MI-019 |
| `AC-MI-029` | 非功能验收 | 全链性能、可用性、安全、追溯、一致性与可观察性 | NFR-MI-017~022 的判断口径全部成立;无旧 SLA / P95 / 构建结果数字回流,关键状态与 owner 可区分,历史不覆盖。 | NFR-MI-017~022 |
| `AC-MI-030` | 规则 / 边界验收 | 外围增强不污染核心分母 | F-MI-E01~E05 未启用 / 失效不影响 C-MI-1~5;启用时受 BR-MI-E01~E03 和四类数据边界约束,不得绕核心 gate 或改写相邻 truth。 | F-MI-E01~E05;BR-MI-E01~E03;D-MI-E01~E04;IF-MI-E01~E03;DEP-MI-015/016 |

跨能力停审:五节点闭环、全部依赖 seam、四类数据、六类质量和外围降级均有独立 AC;未将外围能力或 pending positive seam 纳入当前完成分母。`gate_status = pass`。

### 7.8 一票否决项

| ID | 一票否决项 | 明确来源 |
|---|---|---|
| `VETO-MI-001` | C-MI-1~5 任一核心节点没有可判断结果,却将镜像资产供给闭环或正式 00 判定为完成。 | G-MI-001~007;C-MI-1~5;AC-MI-026 |
| `VETO-MI-002` | 以本地 Role 枚举、hardcode / fallback、`latest` / mutable ref 或猜测版本补齐 mapping、装配或生产入口。 | BR-MI-001/002/006/008/021;NFR-MI-019 |
| `VETO-MI-003` | Secret、live memory、checkpoint、workspace live content 或外部语义 / evidence / Artifact / container / observed body 进入本仓领域 truth 或构建输入。 | BR-MI-004/007/010/020/023;D-MI-005/011/012/018/025/030 |
| `VETO-MI-004` | 在意图无 authority、输入不完整、builder / registry 结果未确认、failed / blocked / unknown 时生成或宣称 candidate digest / ref。 | BR-MI-011~015;NFR-MI-007~009 |
| `VETO-MI-005` | Provenance 不完整、正式适用 gate 缺失 / 失败 / unknown 或 Artifact handoff 未成立时,绕过分层并宣称 positive eligibility / formal ref。 | BR-MI-016~020;NFR-MI-010~012 |
| `VETO-MI-006` | 将不合格 / 不可验证版本进入 availability,原地改写 publish / rollback / retire 历史,或把 local supply 等同通知、下游确认、容器启动 / 健康。 | BR-MI-021~025;NFR-MI-014~016 |
| `VETO-MI-007` | 复制或改写相邻 owner truth,私造 compile dependency / event output / exact schema,或把 pending、adapter / fake 结果写成 integration readiness、测试 / 验收通过事实。 | NG-MI-001~015;DEP-MI-001~016;MI-UP-001~009 |

以下不是一票否决项:外围增强未启用、多架构范围未裁定、产品 adapter 未选、量化性能 baseline 缺失、未闭口 positive seam 当前只能返回 gap。它们必须保持 pending / future / blocked,但不能被用来宣称 corresponding positive readiness。

### 7.9 正式验收标准表

正式 00 使用 §7.2~7.7 的 AC-MI-001~030,删除“主要来源”列后按书写规范固定为:

| 验收类别 | 验收项 | 验收条件 |
|---|---|---|
| 核心能力闭环验收 | AC-MI-001/006/011/016/021 五节点分别成立 | 每个节点满足本节对应进入 / 退出条件,受阻时不越过前置节点。 |
| 功能能力验收 | AC-MI-002/007/012/017/022 核心功能结果完整 | F-MI-001~015 的 positive / negative / dependency-failure 语义和 IF-MI-001~014 能力面均被承接。 |
| 规则 / 边界验收 | AC-MI-003/008/013/018/023/027/030 边界成立 | BR-MI-001~025、DEP-MI-001~016 及外围规则不串线,无 fallback、owner 转移或 seam 类型伪造。 |
| 数据归属验收 | AC-MI-004/009/014/019/024/028 四类数据正确 | D-MI-001~030 与外围数据按 truth / snapshot / ref / forbidden body 分层,无第二 truth。 |
| 非功能验收 | AC-MI-005/010/015/020/025/029 质量底线成立 | NFR-MI-001~022 的判断口径全部成立,无无来源数字或 readiness 声明。 |
| 核心能力闭环验收 | AC-MI-026 端到端链连续 | 任一入口可反查完整来源链,任一断点形成明确保守结果。 |

正式正文必须保留 AC-MI-001~030 的逐项表,本节汇总表只说明固定类别结构,不能替代逐项验收条件。

### 7.10 来源覆盖与跨能力审计

| 来源类型 | 核心编号 | AC 承接 | 结果 |
|---|---|---|---|
| 能力节点 | C-MI-1~5 | AC-MI-001/006/011/016/021 + AC-MI-026 | 全覆盖 |
| 功能 | F-MI-001~015 | AC-MI-002/007/012/017/022 | 全覆盖 |
| 规则 | BR-MI-001~025 | AC-MI-003/008/013/018/023 + AC-MI-027 | 全覆盖 |
| 数据 | D-MI-001~030 | AC-MI-004/009/014/019/024 + AC-MI-028 | 全覆盖 |
| 接口 | IF-MI-001~014 | 对应节点功能 AC | 全覆盖 |
| 依赖 | DEP-MI-001~016 | 对应节点规则 AC + AC-MI-027/030 | 全覆盖,含外围 |
| 非功能 | NFR-MI-001~022 | AC-MI-005/010/015/020/025 + AC-MI-029 | 全覆盖 |
| 外围 | F/BR/D/IF-MI-E* | AC-MI-030 | 条件覆盖,不进核心分母 |

| 跨能力检查 | 结果 |
|---|---|
| 是否存在无来源 AC | no |
| 是否存在核心功能 / 硬规则 / 数据边界 / NFR 无 AC | no |
| 是否存在同义重复 AC | no;节点 AC 约束局部,AC-MI-026~030 只约束跨链 |
| 是否覆盖 positive / negative / dependency-failure | pass |
| Pending seam 是否被写成 positive acceptance / readiness | no |
| Veto 是否可回指能力、规则、数据或质量来源 | pass |
| Veto 是否包含一般缺陷或外围未启用 | no |
| 是否写测试步骤、脚本、命令、工具、CI、route 或字段 | no |
| 是否声明真实 test / artifact / evidence / verdict / signoff | no |

## 8. 回填草稿

正式 00 §14 按 C-MI-1~5 分组回填 AC-MI-001~025,再回填 AC-MI-026~030 和 VETO-MI-001~007。正式验收表只保留“验收类别 / 验收项 / 验收条件”三列;来源关系由 §16 追溯矩阵承接。正文必须在表前说明:这是设计需求的可判断条件,不是已执行的测试或验收结果;pending positive seam 当前只能按 conservative gap / fail-closed 验收。

## 9. 待确认事项

| ID | 受影响 AC | 当前验收上限 |
|---|---|---|
| `MI-UP-001` | AC-MI-022~025 | exact entry / confirmation positive lane blocked;只验 pinned 语义、unavailable / contract-gap 和 no-launch-claim |
| `MI-UP-002` | AC-MI-006~010 | component shape / compatibility pending;不验 compatibility report / readiness |
| `MI-UP-003` | AC-MI-001~005 | mapping exact consumer surface pending;不验 positive integration |
| `MI-UP-004` | AC-MI-003/027 | image-specific Core schema pending;只验 no-shadow / conditional compile |
| `MI-UP-005` | AC-MI-012~015/027 | event positive lane unavailable;nightly 与 event fail-closed 可验 |
| `MI-UP-006` | AC-MI-006~010 | seed / policy exact owner pending;ref / placement / no-body 可验 |
| `MI-UP-007` | AC-MI-016~025 | Artifact positive handoff blocked;eligibility / handoff gap 分层可验 |
| `MI-UP-008` | AC-MI-030 | future only |
| `MI-UP-009` | AC-MI-022/023/027 | no outbound event authority;验收其不存在,不验通知 |
| `Q-MI-001~002` | AC-MI-030 | enhancement 未进入核心分母 |
| `Q-MI-003` | 所有 adapter 相关 AC | 不绑定产品;产品选择不属于 00 AC |
| `Q-MI-004` | AC-MI-016~020 | 具体 evidence kind / priority pending;applicable gate fail-closed 可验 |

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| C-MI-1~5 是否逐节点完成五类验收停审 | pass |
| F / BR / D / IF / DEP / NFR 是否全部有 AC 承接 | pass |
| Positive / negative / dependency-failure 是否覆盖 | pass |
| 一票否决项是否明确、可回指且不过宽 | pass |
| Pending / historical / owner / readiness 污染是否受控 | pass |
| 是否只定义验收条件而未伪造验收结果 | pass |

`gate_status = pass`;允许创建 Step 15,不得跳到 Step 16 或修改正式 00。
