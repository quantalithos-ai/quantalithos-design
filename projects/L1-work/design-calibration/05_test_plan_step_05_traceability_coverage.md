# Step 5. 建立需求追溯与覆盖矩阵

> 本步建立需求、规则、验收方向、设计依据、测试场景、后续用例 ID 和证据 ID 之间的追溯关系。本步只定义覆盖矩阵和编号骨架,不展开完整测试步骤、fixture、执行命令或验收裁决。

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| Step | 5 |
| 状态 | 已完成 |
| 回填章节 | `projects/L1-work/05-测试方案.md` §5 需求追溯与覆盖矩阵 |
| 生成日期 | 2026-06-04 |

## 2. 本步输入

| 输入 | 用途 |
|---|---|
| `00-需求文档.md` §7 / §9 / §10 / §14 / §16 | 核心闭环 C-1~C-5、FR-WORK、BR-WORK、AC-WORK 和需求追溯矩阵 |
| `02-概要设计.md` §5~§11 | 主要组成部分、对象、接口、处理流、状态、异常和配置影响 |
| `03-详细设计.md` §5~§15 | 模块、对象、协议、flow、状态、事务、错误、幂等、配置、观测和最小验证清单 |
| `04-配置设计.md` §6~§12 | profile、配置项、敏感配置、加载校验、失效策略和测试承接 |
| `05_test_plan_step_03_test_objects_cuts.md` | P0 测试对象与测试切口 |
| `05_test_plan_step_04_strategy_layers.md` | 测试策略与分层 |
| `测试方案讨论流程_SOP.md` Step 5 | 本步问题、期望产物和进入下一步条件 |
| `测试方案书写规范.md` §5.5 | 覆盖矩阵格式和未覆盖项规则 |

## 3. SOP 问题回答

### 3.1 每个 P0 需求对应哪些设计章节?

| P0 需求 | 设计依据 | 主要测试对象 |
|---|---|---|
| `FR-WORK-001` 项目工作主语成立 | `02` §5 / §6 / §7 / §8 / §9,`03` §6 / §7 / §8 / §9 / §10 / §15 | `Project`、`Backlog`、project command / query、trace / audit / outbox |
| `FR-WORK-002` 项目内成员承担表达 | `02` §5 / §6 / §7 / §8 / §9,`03` §6 / §7 / §8 / §9 / §11 / §15 | `ProjectMember`、`MemberCapabilitySnapshot`、member command、identity resolver |
| `FR-WORK-003` 正式工作全集收束 | `02` §5 / §6 / §7 / §8 / §10,`03` §6 / §7 / §8 / §9 / §11 / §15 | `Backlog`、`WorkItem`、formal work policy、boundary reject |
| `FR-WORK-004` 正式工作拆分与升级边界 | `02` §6 / §7 / §8 / §9 / §10,`03` §6 / §7 / §8 / §9 / §12 / §15 | `ChildWorkItem`、`PromoteResult`、promote commands、runtime promote consumer |
| `FR-WORK-005` 正式工作依赖与阻塞表达 | `02` §5 / §6 / §7 / §8 / §9,`03` §6 / §7 / §8 / §9 / §10 / §15 | `WorkDependency`、`WorkBlocker`、dependency / blocker commands、audit / evidence refs |
| `FR-WORK-006` Iteration 承诺子集形成 | `02` §5 / §6 / §7 / §8 / §9,`03` §6 / §7 / §8 / §9 / §10 / §15 | `Iteration`、`IterationCommitment`、iteration commands、process timebox ref |
| `FR-WORK-007` 项目工作事实消费与追溯 | `02` §5 / §6 / §7 / §8 / §10,`03` §6 / §7 / §8 / §11 / §14 / §15 | query views、projection state、trace records、audit、outbox events |
| `FR-WORK-008` 项目工作事实维护与对账 | `02` §5 / §7 / §8 / §10 / §11,`03` §7 / §8 / §10 / §11 / §14 / §15,`04` §11 / §12 | projection rebuild、reference refresh、reconciliation、handoff / archive jobs、reports |

### 3.2 每个 P0 需求至少有哪些测试场景?

每个 P0 功能需求至少有一个正向场景、一个关键反向 / 边界场景和一个证据场景。场景 ID 在本步只作为覆盖追踪锚点,完整步骤留给 Step 6。

| P0 需求 | 最小测试场景 |
|---|---|
| `FR-WORK-001` | 显式创建 Project + Backlog;查询引用项目工作事实;拒绝隐式创建;归档 / 关闭状态可追溯 |
| `FR-WORK-002` | 显式 AssignProjectMember;capability snapshot unresolved / failed;拒绝接管 identity 生命周期;责任变化可追溯 |
| `FR-WORK-003` | 创建正式 WorkItem;拒绝 conversation suggestion / runtime step / process activity 直写 Backlog;Backlog maintenance lock 行为 |
| `FR-WORK-004` | 创建 child WorkItem;runtime promote requested 形成 pending promote;review accepted / rejected;拒绝保存 ImplementationPlan / runtime 正文 |
| `FR-WORK-005` | link dependency、open / resolve blocker、cycle reject、completion / unblock evidence refs 和 audit |
| `FR-WORK-006` | open iteration、commit formal work scope、update commitment、close / cancel;拒绝非 formal work 和 process 隐式改变 |
| `FR-WORK-007` | 8 个 Query hit / missing / not visible / degraded;trace page;projection stale / failed surface;query no-write |
| `FR-WORK-008` | projection rebuild no-write、reference refresh unresolved / failed、reconciliation read-only report、outbox / handoff failed marker |

### 3.3 哪些场景必须自动化?

P0 需求、P0 一票否决边界、协议 contract、状态机、幂等 / 事务、配置红线和观测字段边界必须自动化。人工审核只允许作为证据复核补充,不得替代自动化。

| 场景类别 | 自动化要求 | 说明 |
|---|---|---|
| FR-WORK-001~008 P0 功能 | 是 | 后续 Step 6 分配 P0 用例 |
| BR-WORK-001~027 规则 / 边界 | 是 | 可按规则族合并覆盖,但不得空缺 |
| AC-WORK-001~023 核心 / 功能 / 规则 / 数据归属验收 | 是 | 必须有测试证据 ID |
| AC-WORK-024 性能判断口径 | 待 Step 10 | 当前只保留专项候选,不写硬阈值 |
| AC-WORK-025~029 可用性 / 安全 / 审计 / 幂等 / 可观测 | 是,部分在 Step 10 专项细化 | P0 负向和证据边界必须自动化 |
| FR-WORK-E01~E05 外围增强 | 否,当前挂起 | 不进入 P0 硬覆盖矩阵 |

### 3.4 每个场景的证据如何编号?

证据 ID 使用 `EV-WORK-<族>-<三位序号>`。用例 ID 使用 `TC-WORK-<族>-<三位序号>`。本步只锁定编号族,Step 6 再展开具体用例步骤。

| 编号族 | 用途 | 示例 |
|---|---|---|
| `CORE` | 核心能力闭环 smoke 和项目主链证据 | `TC-WORK-CORE-001` / `EV-WORK-CORE-001` |
| `MEMBER` | 项目内成员承担与 identity 边界 | `TC-WORK-MEMBER-001` / `EV-WORK-MEMBER-001` |
| `FORMAL` | Backlog、WorkItem、child WorkItem 和正式工作边界 | `TC-WORK-FORMAL-001` / `EV-WORK-FORMAL-001` |
| `PROMOTE` | promote / runtime / artifact 边界 | `TC-WORK-PROMOTE-001` / `EV-WORK-PROMOTE-001` |
| `DEP` | dependency / blocker / evidence | `TC-WORK-DEP-001` / `EV-WORK-DEP-001` |
| `ITER` | Iteration / commitment | `TC-WORK-ITER-001` / `EV-WORK-ITER-001` |
| `QUERY` | query / projection / trace / no-write | `TC-WORK-QUERY-001` / `EV-WORK-QUERY-001` |
| `OPS` | projection rebuild、reference refresh、reconciliation、handoff、outbox jobs | `TC-WORK-OPS-001` / `EV-WORK-OPS-001` |
| `CFG` | configuration profile、loader、validator、sensitive / redaction | `TC-WORK-CFG-001` / `EV-WORK-CFG-001` |
| `NFR` | 非功能专项和可观测性 / 安全 / 幂等专项 | `TC-WORK-NFR-001` / `EV-WORK-NFR-001` |

### 3.5 哪些需求暂未覆盖,原因是什么?

P0 功能需求 `FR-WORK-001`~`FR-WORK-008`、核心业务规则 `BR-WORK-001`~`BR-WORK-027` 和验收方向 `AC-WORK-001`~`AC-WORK-029` 均已进入覆盖矩阵或专项承接。未进入 P0 硬覆盖的只有外围增强功能。

| 项 | 覆盖状态 | 原因 | 后续处理 |
|---|---|---|---|
| `FR-WORK-E01` 高级看板与多视图消费 | 暂不覆盖 P0 | 外围增强,不阻塞核心闭环 | Step 14 风险 / 后续专项 |
| `FR-WORK-E02` 自动化维护建议 | 暂不覆盖 P0 | 外围增强,不替代正式规则 | Step 14 风险 / 后续专项 |
| `FR-WORK-E03` 容量趋势与负载风险提示 | 暂不覆盖 P0 | 旧性能 / 容量数字未升级为硬阈值 | Step 10 / Step 14 |
| `FR-WORK-E04` 项目内工具能力调整协同 | 暂不覆盖 P0 | 依赖治理 / 方法定义后续闭环 | Step 14 风险 / 后续专项 |
| `FR-WORK-E05` 跨项目依赖理解 | 暂不覆盖 P0 | 跨项目分析为外围增强 | Step 14 风险 / 后续专项 |

## 4. 当前文档问题诊断

| 文档 / 位置 | 当前问题 | 本步处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 旧用例编号和旧追溯关系无法覆盖新版 FR / BR / AC | 本步重建追溯矩阵,旧用例不作为正式证据 |
| Step 3 / Step 4 | 已有测试对象和分层,但还没有回指需求、规则和验收 | 本步建立 FR / BR / AC 到场景、用例族和证据族的映射 |
| `00-需求文档.md` §16 | 已有需求追溯矩阵,但不是测试覆盖矩阵 | 本步把需求追溯转译为测试覆盖 |
| `03-详细设计.md` §15 | 已有最小验证清单,但没有 evidence ID | 本步分配 evidence 编号族 |
| `04-配置设计.md` §12 | 已有配置测试切口,但未进入测试覆盖矩阵 | 本步将配置 profile / loader / sensitive / failure 纳入 `CFG` 覆盖族 |

## 5. 改动前后对比

| 维度 | Step 4 后 | Step 5 收敛后 |
|---|---|---|
| 需求追溯 | 有测试对象和层级,但未映射 FR / BR / AC | P0 FR、规则族、AC 均映射到场景、用例族和证据族 |
| 编号 | 尚未定义用例 / 证据编号族 | 定义 `TC-WORK-*` / `EV-WORK-*` 编号族,不展开步骤 |
| 自动化范围 | 只知道 P0 分层阻断 | 明确 P0 功能、规则、核心验收、配置红线和观测边界必须自动化 |
| 未覆盖项 | 未集中记录 | 外围增强 `FR-WORK-E01`~`E05` 明确挂起,不进入 P0 硬覆盖 |
| 上游影响 | 无 | 仍无;本步只做测试覆盖映射 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 为每个 FR / BR / AC 单独设计完全独立用例 | 追溯粒度细 | 用例爆炸,大量场景重复 | 不采用 |
| 方案 B: 只按 FR-WORK-001~008 建矩阵,BR / AC 由说明覆盖 | 简洁 | 规则和验收可能静默漏测 | 不采用 |
| 方案 C: 以 FR 为主矩阵,规则和 AC 建族级补充矩阵,用例 / 证据 ID 允许多对多复用 | 覆盖闭合且避免重复 | Step 6 需要继续把族级场景拆成可执行用例 | 采用 |
| 方案 D: 把外围增强也纳入 P0 硬覆盖 | 覆盖更广 | 违背需求和配置设计的 P0/P1/P2 裁剪 | 不采用 |

推荐方案 C。

原因:

- `FR-WORK-001`~`008` 已经在需求文档中绑定核心闭环、BR、数据归属和 AC,适合作为主覆盖轴。
- `BR-WORK-001`~`027` 和 `AC-WORK-001`~`029` 需要显式可见,但不需要为每条规则制造完全独立的重复用例。
- Step 5 的职责是覆盖追溯,不是完整用例设计;具体步骤、输入和断言留给 Step 6。

## 7. 结构化中间产物

### 7.1 P0 功能需求覆盖矩阵

| 需求 / 规则 ID | 设计依据 | 测试场景 | 用例 ID | 自动化 | 证据 ID | 覆盖状态 |
|---|---|---|---|---|---|---|
| `FR-WORK-001`;`BR-WORK-001/012/025/026`;`AC-WORK-001/006/014/016/018/019` | `02` §5~§9;`03` §6~§10 / §15 | Project 显式创建、引用、生命周期、trace / audit / outbox;隐式创建拒绝 | `TC-WORK-CORE-001`~`TC-WORK-CORE-004` | 是 | `EV-WORK-CORE-001`~`EV-WORK-CORE-004` | 已覆盖 |
| `FR-WORK-002`;`BR-WORK-002/013/017/025/026`;`AC-WORK-002/007/014/016/017/018` | `02` §5~§9;`03` §6~§9 / §11 / §15 | ProjectMember 显式承担、capability snapshot、identity 边界、责任状态变化 | `TC-WORK-MEMBER-001`~`TC-WORK-MEMBER-004` | 是 | `EV-WORK-MEMBER-001`~`EV-WORK-MEMBER-004` | 已覆盖 |
| `FR-WORK-003`;`BR-WORK-003/007/008/009/010/014/026`;`AC-WORK-003/008/014/015/016/020` | `02` §5~§10;`03` §6~§11 / §15 | Backlog / WorkItem 正式全集、边界外输入拒绝、maintenance lock、forbidden body absent | `TC-WORK-FORMAL-001`~`TC-WORK-FORMAL-005` | 是 | `EV-WORK-FORMAL-001`~`EV-WORK-FORMAL-005` | 已覆盖 |
| `FR-WORK-004`;`BR-WORK-004/008/015/022/023/025/026`;`AC-WORK-003/009/015/016/017/020` | `02` §6~§10;`03` §6~§9 / §12 / §15 | child WorkItem、runtime promote intake、review accept / reject、ImplementationPlan / runtime 正文拒绝 | `TC-WORK-PROMOTE-001`~`TC-WORK-PROMOTE-005` | 是 | `EV-WORK-PROMOTE-001`~`EV-WORK-PROMOTE-005` | 已覆盖 |
| `FR-WORK-005`;`BR-WORK-003/014/026/027`;`AC-WORK-010/019/020/027/028` | `02` §5~§9;`03` §6~§10 / §15 | dependency link、cycle reject、blocker open / resolve、evidence refs、audit / trace | `TC-WORK-DEP-001`~`TC-WORK-DEP-005` | 是 | `EV-WORK-DEP-001`~`EV-WORK-DEP-005` | 已覆盖 |
| `FR-WORK-006`;`BR-WORK-005/016/020/026`;`AC-WORK-004/011/014/016/017/020` | `02` §5~§9;`03` §6~§10 / §15 | Iteration open、commit formal scope、update commitment、close / cancel、process ref boundary | `TC-WORK-ITER-001`~`TC-WORK-ITER-005` | 是 | `EV-WORK-ITER-001`~`EV-WORK-ITER-005` | 已覆盖 |
| `FR-WORK-007`;`BR-WORK-006/011/017~024/026`;`AC-WORK-005/012/017/019/021/022/023/027` | `02` §5~§10;`03` §6~§8 / §11 / §14 / §15 | 8 Query、authorized read、not visible / degraded、trace page、projection stale / failed、query no-write | `TC-WORK-QUERY-001`~`TC-WORK-QUERY-008` | 是 | `EV-WORK-QUERY-001`~`EV-WORK-QUERY-008` | 已覆盖 |
| `FR-WORK-008`;`BR-WORK-006/011/027`;`AC-WORK-013/015/019/021/025/029` | `02` §7 / §8 / §10 / §11;`03` §7 / §8 / §10 / §11 / §14 / §15;`04` §11 / §12 | projection rebuild no-write、reference refresh marker、reconciliation read-only report、outbox / handoff failed marker | `TC-WORK-OPS-001`~`TC-WORK-OPS-006` | 是 | `EV-WORK-OPS-001`~`EV-WORK-OPS-006` | 已覆盖 |

### 7.2 规则族覆盖矩阵

| 规则族 | 包含规则 | 覆盖场景族 | 首选层级 | 自动化 | 覆盖状态 |
|---|---|---|---|---|---|
| 不变量 | `BR-WORK-001`~`006` | Project、ProjectMember、Backlog、WorkItem、Iteration、projection no-write | Unit + Service | 是 | 已覆盖 |
| 禁止行为 | `BR-WORK-007`~`011` | conversation / runtime / process / adjacent repo direct write reject;query / projection / report no-write | Unit + Service + Contract | 是 | 已覆盖 |
| 显式变化 | `BR-WORK-012`~`016` | create / assign / formalize / promote / commit scope 必须走 command 或 consumer intake + review | Service + API contract | 是 | 已覆盖 |
| 相邻仓边界 | `BR-WORK-017`~`024` | identity / conversation / method / process / governance / artifact / runtime / workspace ref-only 和 no body | Contract + Integration + E2E smoke | 是 | 已覆盖 |
| 治理约束 | `BR-WORK-025` | high-risk lifecycle / split / promote / tool capability 只引用正式约束,不绕过 policy | Unit + Service | 是 | 已覆盖 |
| 审计约束 | `BR-WORK-026`~`027` | trace / audit / outbox / report / evidence refs | Service + Integration + Release gate | 是 | 已覆盖 |

### 7.3 验收项覆盖矩阵

| 验收 ID | 覆盖来源 | 测试场景族 | 证据 ID | 覆盖状态 |
|---|---|---|---|---|
| `AC-WORK-001`~`005` | 核心能力闭环 C-1~C-5 | `CORE`、`MEMBER`、`FORMAL`、`ITER`、`QUERY` smoke 和负向 | `EV-WORK-CORE-*`、`EV-WORK-MEMBER-*`、`EV-WORK-FORMAL-*`、`EV-WORK-ITER-*`、`EV-WORK-QUERY-*` | 已覆盖 |
| `AC-WORK-006`~`013` | `FR-WORK-001`~`008` | P0 功能需求覆盖矩阵全部场景族 | `EV-WORK-CORE-*`~`EV-WORK-OPS-*` | 已覆盖 |
| `AC-WORK-014`~`019` | `BR-WORK-001`~`027` | 不变量、禁止行为、显式变化、边界、治理、审计规则族 | `EV-WORK-CORE-*`、`EV-WORK-FORMAL-*`、`EV-WORK-PROMOTE-*`、`EV-WORK-QUERY-*`、`EV-WORK-OPS-*` | 已覆盖 |
| `AC-WORK-020`~`023` | 数据归属和外部正文禁止 | Work truth ownership、external snapshot / ref-only、forbidden body absent | `EV-WORK-FORMAL-*`、`EV-WORK-PROMOTE-*`、`EV-WORK-QUERY-*`、`EV-WORK-CFG-*` | 已覆盖 |
| `AC-WORK-024` | 性能判断口径 | 旧性能候选专项评估,当前不设硬阈值 | `EV-WORK-NFR-001` | 待 Step 10 细化 |
| `AC-WORK-025` | 可用性判断口径 | external unavailable marker、projection stale / failed、core closure unaffected | `EV-WORK-OPS-*`、`EV-WORK-NFR-002` | 已覆盖,Step 10 细化 |
| `AC-WORK-026` | 安全判断口径 | authorization、forbidden body、sensitive output、high-risk policy | `EV-WORK-CFG-*`、`EV-WORK-NFR-003` | 已覆盖,Step 10 细化 |
| `AC-WORK-027` | 审计 / 可追溯判断口径 | trace / audit / evidence refs、blocker / completion / reconciliation explainability | `EV-WORK-DEP-*`、`EV-WORK-QUERY-*`、`EV-WORK-OPS-*` | 已覆盖 |
| `AC-WORK-028` | 幂等 / 一致性判断口径 | duplicate / conflict、version conflict、commit unknown、projection lag explainable | `EV-WORK-NFR-004` | 已覆盖,Step 10 细化 |
| `AC-WORK-029` | 可观测性判断口径 | low-cardinality metric、safe log、maintenance status visible | `EV-WORK-NFR-005` | 已覆盖,Step 10 细化 |

### 7.4 配置覆盖补充矩阵

| 配置测试输入 | 来源 | 测试场景 | 用例 ID | 自动化 | 证据 ID | 覆盖状态 |
|---|---|---|---|---|---|---|
| P0 profile matrix | `04` §6 | `local-dev`、`ci-test`、`integration-like`、`operations-replay` 加载和差异行为 | `TC-WORK-CFG-001`~`004` | 是 | `EV-WORK-CFG-001`~`004` | 已覆盖 |
| 配置项与 cross-field validation | `04` §7 / §9 | defaults、JSON、env、unknown key、invalid timeout / retry / batch / page / body limit | `TC-WORK-CFG-005`~`009` | 是 | `EV-WORK-CFG-005`~`009` | 已覆盖 |
| 敏感配置与 forbidden output | `04` §8 / §11 | raw secret / raw token / raw payload / source body 不进 config、log、audit、report、artifact | `TC-WORK-CFG-010`~`012` | 是 | `EV-WORK-CFG-010`~`012` | 已覆盖 |
| adapter ref / external unavailable | `04` §11 / §12 | configured adapter ref 缺失、resolver unavailable、publisher / handoff failure marker | `TC-WORK-CFG-013`~`016` | 是 | `EV-WORK-CFG-013`~`016` | 已覆盖 |
| no hot update / unsupported source | `04` §9 / §11 | P0 不支持核心 hot reload / config center,启用 fail-fast | `TC-WORK-CFG-017` | 是 | `EV-WORK-CFG-017` | 已覆盖 |

### 7.5 未覆盖项清单

| 需求 / 规则 ID | 未覆盖原因 | 处理方式 | 风险状态 |
|---|---|---|---|
| `FR-WORK-E01` | 外围增强,不属于当前 P0 核心闭环 | Step 14 记录后续专项 | 非阻塞 |
| `FR-WORK-E02` | 外围增强,且自动建议不得替代正式规则 | Step 14 记录后续专项 | 非阻塞 |
| `FR-WORK-E03` | 容量趋势和旧性能数字需 Step 10 判断 | Step 10 / Step 14 承接 | 非阻塞 |
| `FR-WORK-E04` | 依赖治理 / 方法定义后续闭环 | Step 14 记录后续专项 | 非阻塞 |
| `FR-WORK-E05` | 跨项目依赖为外围分析能力 | Step 14 记录后续专项 | 非阻塞 |

当前没有未覆盖的 P0 功能需求、P0 业务规则或 P0 验收方向。`AC-WORK-024` 的性能判断口径已进入 `NFR` 专项编号族,但是否形成硬阈值必须在 Step 10 再决定。

### 7.6 覆盖流图

#### 证据流图: L1-work 需求到证据追溯

```text
C-1~C-5 core closure
  -> FR-WORK-001~008
  -> BR-WORK rule families
  -> AC-WORK-001~029
  -> TC-WORK-* scenario families
  -> EV-WORK-* evidence archive
```

关键说明:

- 图表达追溯关系,不表达测试执行顺序。
- 一个 `TC-WORK-*` 可以覆盖多个 FR / BR / AC,但必须在矩阵中可见。
- 外围增强 `FR-WORK-E01`~`E05` 不进入 P0 硬覆盖,但不得从风险清单消失。

## 8. 对上游设计的影响判定

| 测试结论 | 是否影响上游设计 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|
| `FR-WORK-001`~`008`、`BR-WORK-001`~`027`、`AC-WORK-001`~`029` 均有测试覆盖或专项承接 | 否 | 测试追溯映射,无设计契约变化 | 无 | 无回写 |
| 外围增强 `FR-WORK-E01`~`E05` 不进入 P0 硬覆盖,进入未覆盖项 / 后续专项 | 否 | 与需求外围增强口径一致 | 无 | 无回写 |
| `AC-WORK-024` 性能判断口径进入 `NFR` 专项,是否硬阈值留给 Step 10 | 否 | 测试专项承接,不改变验收 | 无 | 无回写 |
| 配置 profile、loader、validator、sensitive output、unsupported hot reload 进入 `CFG` 覆盖族 | 否 | 承接 `04`,不新增配置项 | 无 | 无回写 |

说明:

```text
本步没有改变需求、架构、概要、详细设计或配置设计。
如果 Step 6 将覆盖场景落成用例时发现某个 P0 场景缺少正式对象、字段、状态、错误或配置契约,必须记录为上游待回写或阻塞待确认。
```

## 9. 回填草稿

正式 `05-测试方案.md` §5 建议采用以下结构:

```text
5. 需求追溯与覆盖矩阵
  5.1 覆盖原则与编号族
  5.2 P0 功能需求覆盖矩阵
  5.3 规则族覆盖矩阵
  5.4 验收项覆盖矩阵
  5.5 配置覆盖补充矩阵
  5.6 未覆盖项清单
  5.7 对上游设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §5.1 | `design-calibration/05_test_plan_step_05_traceability_coverage.md` §3.4 / §6 |
| §5.2 | `design-calibration/05_test_plan_step_05_traceability_coverage.md` §7.1 |
| §5.3 | `design-calibration/05_test_plan_step_05_traceability_coverage.md` §7.2 |
| §5.4 | `design-calibration/05_test_plan_step_05_traceability_coverage.md` §7.3 |
| §5.5 | `design-calibration/05_test_plan_step_05_traceability_coverage.md` §7.4 |
| §5.6 | `design-calibration/05_test_plan_step_05_traceability_coverage.md` §7.5 |
| §5.7 | `design-calibration/05_test_plan_step_05_traceability_coverage.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 6 的待确认事项。

后续 Step 必须继续收口:

- Step 6 将本步 `TC-WORK-*` 场景族展开为可执行用例矩阵。
- Step 7 为每个 P0 用例设计 fixture / builder / fake adapter 数据。
- Step 8 / Step 9 把 `CFG` 场景族映射到环境矩阵和自动化门禁。
- Step 10 判断 `AC-WORK-024` 和旧性能候选是否进入专项硬阈值。
- Step 14 记录外围增强未覆盖项和 P1/P2 残余风险。

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 覆盖矩阵无空洞 | 通过 | `FR-WORK-001`~`008` 均已覆盖 |
| 规则和验收不静默消失 | 通过 | 见 §7.2 / §7.3 |
| 未覆盖项已进入清单 | 通过 | 见 §7.5 |
| P0 需求未被“人工确认”替代 | 通过 | P0 场景均标记自动化 |
| 未提前展开完整用例步骤、fixture 或 CI 命令 | 通过 | 留给 Step 6 / 7 / 9 |
