# L2-tools 01 架构设计 Step 15: ADR 与需求追溯

> 创建日期: 2026-08-04
> 状态: completed
> 当前模式: full-restart
> 执行模式: single_agent_serial
> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 15
> 正式文档回填位置: `01-架构设计.md` 第 16~17 章

---

## 1. 本步输入与目标

### 1.1 本步目标

把 Step 1~14 已停审的长期架构决定与正式需求、硬约束、风险和取舍来源显式连接,形成需求追溯矩阵、追溯缺口表、ADR 候选索引、逐决定停审和跨表审计。本步只做映射与索引,不新增设计结论,不继承旧 ADR,不伪造 ADR 编号、文件、评审状态、实现或验证事实。

### 1.2 输入与读取结论

| 输入 | 读取结论 | 本步约束 |
|---|---|---|
| 正式 `00-需求文档.md` §16 | 17 项核心 FR、6 项外围 FR 及 IB/DB/NFR/AC/VF 已完成需求内部追溯。 | 架构追溯可分组,但必须覆盖全部范围且保留开放 blocker。 |
| Step 1~4 | 正式 00 是直接基线;目标、硬约束、职责与 current/pending/future 上下文已停审。 | ADR 和追溯不能使用旧 README / 旧正式 01 作为 authority。 |
| Step 5~9 | 14 个架构单元、运行承载、依赖、数据和 16 个交互场景均已停审。 | 每个长期决定必须回指这些已停审单元或跨单元审计。 |
| Step 10~13 | 机制、路径取舍、横切约束和演进触发已停审。 | ADR 候选须为长期结构决定,不得把产品 / 协议 / 指标或未定事项升格。 |
| Step 14 | `AR-L2T-001~009`、`Q-L2T-001~008`、`L2T-UP-001~009` 保持开放。 | 追溯完整不等于风险 resolved;缺口必须进漏项表。 |
| 架构 SOP Step 15 / 书写规范 4.16/4.17 | 需求矩阵与 ADR 索引均固定五列;要求决定停审和跨 ADR / 追溯审计。 | 不写章节摘要、文件清单、技术清单或主观来源。 |
| 已完成项目 Step 15 | 使用 ADR 候选 + 分组追溯 + 缺口 + 停审 + 跨表审计。 | 只参考粒度,不复制业务决定或编号。 |

### 1.3 Step 内计划

| 模块 | 状态 | 产物 | 门禁 |
|---|---|---|---|
| 恢复与标准读取 | done | §1 | 当前只允许 Step 15。 |
| ADR 候选先思考 | done | §2.1、§3.1 | 仅长期架构根决定。 |
| ADR 候选再写入 | done | §4.1 | 九项编号均为 `未建立`。 |
| 需求追溯先思考 | done | §2.2、§3.2 | 以需求结论组映射具体承接。 |
| 需求追溯再写入 | done | §4.2 | 核心、外围、依赖、NFR、验收、风险全覆盖。 |
| 漏项检查 | done | §4.3 | 开放 seam 与 ADR 载体不伪闭口。 |
| 决定停审 | done | §4.4 | 九项均有来源 / 单元 / 长期性。 |
| 跨表审计 | done | §4.5~4.6 | 无孤儿、误入或新增结论。 |

---

## 2. SOP 问题回答

### 2.1 哪些决定需要沉淀为 ADR

需要长期单独理解的决定共有九类:独立工具行动语义 truth center;五核心语境与支撑 / 影子写权分离;正式承接与 compile/runtime/event 依赖裁剪;truth/snapshot/ref/forbidden-body 与消费时点;canonical invocation/result/error;authorization 消费与 Sandbox execution 分权 / fail-closed;local-truth-first 与 A4/A5 两类 handoff;同步 / 异步 / 后台和逻辑承载分离;safe-material 四项门禁与外围只读隔离。它们会长期约束 `02~07` 和任何实现,不是局部机制清单。

### 2.2 每项决定对应哪些来源

每项决定至少回指正式 00 的定位、FR / BR / DR / DB / NFR / VF 之一,Step 1 的 `HC-L2T-*` 或 Step 14 的 `AR-L2T-*`,以及 Step 5/7/8/9/12 的已停审单元 / 跨单元审计。具体映射见 ADR 索引、追溯矩阵和决定停审表。

### 2.3 是否存在没有需求来源的架构设计

没有发现孤儿架构决定。运行角色、状态承载、controlled shadow 和三类通信是需求中 owner、同步前置、外部协作、数据时点和外围隔离约束的结构化承接;它们不是凭实现偏好新增。语言、数据库、协议、event、算法和部署产品未进入决定集。

### 2.4 是否存在没有架构承接的核心需求

没有未承接的核心需求组:`FR-L2T-001~003` 由 A1/S1 承接,`004~006` 由 A2/P2/S2 承接,`007~009` 由 A3/P5 承接,`010~013` 由 A4/P3/P4 承接,`014~017` 由 A5/P4/P6 承接。六项外围由 S2/S3/D1 和受控入口承接,且明确不成为核心前置。开放正向合同仍是追溯缺口,不是需求未被逻辑承接。

### 2.5 哪些取舍和红线必须长期可追溯

必须长期保留独立 owner、不复制外部 truth、canonical semantics、fail-closed、Sandbox 不旁路、capture 不等于 outcome、local-truth-first、forbidden body、安全外发、Core-only compile、pending/future 不升格以及证据驱动演进。这些决定解释了为什么当前不采用单一大上下文、全同步 / 全异步、live-only resolution、独立部署预承诺和旧 registry/executor 主线。

### 2.6 ADR 当前正式状态是什么

当前没有已建立并可引用的 L2-tools 专项 ADR 文件或评审记录。所有候选虽已达到“值得后续单独建立 ADR”的长期性标准,但编号字段统一为 `未建立`;旧 `ADR-0005/ADR-0009` 属于 historical material,不能继承、重号或充当签署。

---

## 3. 诊断与设计取舍

### 3.1 ADR 收敛粒度

若把 Step 10 的十一项机制逐条建立 ADR,会混入机制清单并重复同一根决定;若只建一条“采用分层架构”,又无法长期解释 owner、依赖、数据、交互和安全红线。当前按九个跨章节根决定归并,每条都能独立改变后续设计边界。具体 schema、mapping、route、storage、algorithm 和 metric 尚未收稳,不建立 ADR 占位。

### 3.2 需求追溯粒度

主矩阵按定位、五核心能力、外围、依赖、NFR、验收否决和风险分组,避免复制正式 00 的 23 行内部矩阵,同时保留 ID 全集与架构落点。主矩阵只写已成立的逻辑承接;authorization、Sandbox、Observability、Core、SDK、measurement 和 ADR 载体缺口进入漏项表,防止“完整追溯”被误读为正向合同 ready。

### 3.3 正式章节落点

本 Step 的“承接位置”使用正式 01 固定 18 章编号,而不是 Step 文件编号。ADR 索引负责回答哪些决定值得长期保留,需求追溯负责回答需求为何被当前架构承接,两表不互相复制。Step 16 只允许依据本文件装配第 16/17 章,不能新增 ADR 编号或追溯关系。

---

## 4. 结构化中间产物

### 4.1 ADR 候选索引表

| ADR 编号 | 架构决策 | 解决的问题 | 关联主线 | 说明 |
|---|---|---|---|---|
| 未建立 | 以独立工具行动语义 truth center 作为 `L2-tools` 架构核心 | 防止 identity、definition、invocation、precondition、outcome 分散到 Runtime、Hub、Sandbox、provider 或 client 形成多套工具合同 | 架构目标 / 职责边界 / 备选方案 / 风险 | 回指 `AG-L2T-001~008`、`HC-L2T-001~008`、`A1~A5` 停审;这是本仓存在的根决定。 |
| 未建立 | 采用 `A1~A5` 核心、`S1~S3` 支撑和 `P1~P6` 影子分层写权 | 防止演进、检测、派生或外部 snapshot/ref 反写核心 truth | 限界上下文 / 数据所有权 / 依赖 / 横切配置 | 回指 Step 5/7/8/12 的 14 单元停审;长期决定对象 owner 和正式重入。 |
| 未建立 | 通过正式语义承接边界与 Core-only compile、runtime/event seam 隔离跨仓依赖 | 防止 sibling source/model 耦合、外部模型侵入核心和 material handoff 形成第四依赖类型 | 系统上下文 / 依赖方向 / 技术机制 / 风险 | 回指 `HC-L2T-011~012`、Step 7 跨单元审计、`AR-L2T-005/009`;长期保护全局裁剪。 |
| 未建立 | 采用 truth、snapshot、reference、forbidden body 四层数据及消费时点锚定 | 防止本地存在被误认作本地拥有,或迟到外部材料原地改写既有调用 / 终态 | 数据所有权 / 一致性 / 审计 / 横切安全 | 回指 `DR-L2T-001~034`、`HC-L2T-009~010`、Step 8 停审;长期影响对象、存储和历史解释。 |
| 未建立 | 以 canonical invocation/result/error 维持跨 caller/carrier 单一工具语义 | 防止 direct、adapter、Sandbox、Runtime 或未来 SDK 形成私有请求、结果和错误合同 | 核心语义 / 关键交互 / 技术机制 / 取舍 | 回指 `FR-L2T-007~009/014~015`、`HC-L2T-003/007`、`A3/A5` 停审。 |
| 未建立 | 将执行要求、正式 authorization 消费、Sandbox handoff 与 execution truth 分权并 fail closed | 防止风险声明变成 self-authorization、隔离旁路或 L2 伪造 run/capture/receipt | 职责边界 / 数据 / 关键交互 / 横切安全 / 风险 | 回指 `FR-L2T-010~013`、`HC-L2T-005~006`、`A4/P3/P4` 停审和 `AR-L2T-001~003`。 |
| 未建立 | 采用 local outcome/audit first,并分离 A4 execution handoff 与 A5 post-outcome submission attempt | 防止 Sandbox、Bus、Observability 或 Runtime 状态回滚 / 替代本地终态,或把两类 attempt 合成伪完成 | 数据一致性 / 关键交互 / 韧性 / 审计 | 回指 `FR-L2T-014~017`、`HC-L2T-007~010`、Step 8/9 跨单元审计和 `A5/P6` 停审。 |
| 未建立 | 将同步裁定、异步送达 / 传播、后台派生以及 `R1/R2/R3` 逻辑承载分离 | 防止全异步丢执行前门禁、全同步形成跨 owner 伪事务或后台成为隐式写源 | 容器 / 部署 / 关键交互 / 性能韧性 / 演进 | 回指 `NFR-L2T-001~006`、Step 6/9/12 停审及 Step 11 路径取舍;允许同部署但不混权。 |
| 未建立 | 采用 safe-material 四项合取门禁并隔离外围只读 / 派生消费 | 防止 raw/secret/evidence 正文借审计 / 观测外泄,或搜索、SDK、管理入口反写核心 | 横切安全 / 外围边界 / 演进 / 验收否决 | 回指 `FR-L2T-017/FR-L2T-E01~E06`、`HC-L2T-009`、`VF-L2T-008~010`、`S2/S3` 停审和 `AR-L2T-007`。 |

### 4.2 需求追溯矩阵

| 需求来源 | 需求结论 / 约束 | 架构承接结果 | 承接位置 | 说明 |
|---|---|---|---|---|
| 正式 00 §2/§4;`C-L2T-1~5`;`AG-L2T-001~008` | L2-tools 是独立工具行动语义契约层,五个核心能力共同构成闭环,相邻 owner 不并入 | 独立 truth center、清晰职责边界、current/conditional/future 上下文和五核心语境 | §2 业务背景;§3 约束;§4 职责;§5 系统上下文;§6 限界上下文 | 将需求定位转译为 owner、系统边界和内部语义结构,而非旧工具库存 / executor 平台。 |
| `FR-L2T-001~003`;`BR-L2T-001~008`;`DR-L2T-001~006` | 稳定 tool identity、formal definition、显式演进 / 兼容影响和受控读取必须围绕同一锚点 | `A1` 拥有 identity/current definition,`S1` 拥有演进历史并经 A1 同一不变量收口;`T1` 承载长期 truth | §6 限界上下文;§7 容器 / 部署;§9 数据;§10 交互 | 结构明确区分当前定义、演进历史、派生读取和实现 / inventory / provider 正文。 |
| `FR-L2T-004~006`;`BR-L2T-009~015`;`DR-L2T-007~012` | Capability-bound/unbound、body-free relation、Hub controlled source 校验和变化追溯必须成立且不复制 Hub truth | `A2/P2/S2` 分权,Hub 仅通过 runtime controlled snapshot/ref 输入;stale/conflict/missing 时 fail closed | §5 系统上下文;§6 限界上下文;§8 依赖;§9 数据;§10 交互 | Binding 是 L2 relation truth,不是 registry、visibility、applicability 或 authorization。 |
| `FR-L2T-007~009`;`BR-L2T-016~022/027`;`DR-L2T-013~018` | Canonical invocation、admission/no-execution 与跨 caller/carrier 单一语义必须在真实执行前成立 | `A3/P5/R1/T2` 承接正式 invocation 与同步受理;raw caller / Runtime orchestration 不入 truth | §4 职责;§6 限界上下文;§7 容器;§9 数据;§10 交互;§11 技术机制 | 调用方和 carrier 只能适配同一合同,不能通过私有 schema 形成第二语义。 |
| `FR-L2T-010~013`;`BR-L2T-023~031`;`DR-L2T-019~026` | 执行要求、正式 authorization 消费、隔离不可旁路、Sandbox handoff/source material 必须分权 | `A4/P3/P4` 条件参与;governed source 不可验证即 fail closed;handoff attempt 不等于 accepted/run/receipt | §4 职责;§5 上下文;§6 限界上下文;§9 数据;§10 交互;§13 横切;§15 风险 | 架构固定逻辑 seam 和保守失败语义,同时保留 `Q-L2T-001~004` 的正向合同缺口。 |
| `FR-L2T-014~017`;`BR-L2T-030~042`;`DR-L2T-027~034` | Normalized result/error/no-execution、Tool-domain audit、安全交接和外部降级必须可区分且可回链 | `A5/P4/P5/P6` 形成 local outcome/audit first;A4/A5 attempt 分离;safe material 四项门禁;外部状态不反写 | §6 限界上下文;§9 数据;§10 交互;§11 技术机制;§13 横切 | Capture/provider response/delivery/observation 只能作为受控 source/status ref,不能替代工具终态。 |
| `FR-L2T-E01~E06`;`BR-L2T-E01`;`AC-L2T-023` | 搜索、diff、批量、派生索引、诊断、客户端说明和管理入口可以增强,但不得反写或阻塞核心 | `S2/S3/R3/D1` 承接可重建只读 / 派生能力,正式变化重入核心;外围按真实需求触发 | §6 限界上下文;§7 容器;§10 交互;§13 横切;§14 演进 | 六项外围均有架构落点,但不被误写为当前必须实施或 SDK client 本体。 |
| `DB-L2T-001~008`;`HC-L2T-011~012`;`VF-L2T-012` | 只有 Core 可为 compile authority;Hub/Sandbox/Runtime 用 runtime seam,Bus/Observability 用 event collaboration;Auth pending、SDK future | `E->F->K` 内部依赖保护、项目裁剪表和三类依赖图;material 不形成第四依赖 | §5 系统上下文;§8 依赖方向;§11 技术机制;§15 风险 | 架构把依赖记录的 current/pending/future 状态转译为可执行裁剪红线。 |
| `NFR-L2T-001~006` | 核心不被外围拖重,必要前置异常 fail closed,下游失败不回滚本地终态 | `R1/R2/R3` 与 local-truth-first、正式重入、可同部署 / 按证据拆分 | §7 容器;§9 数据;§10 交互;§13 横切;§14 演进 | 性能和可用性被转译为结构口径,未伪造数值或实现机制。 |
| `NFR-L2T-007~013` | Forbidden body、不自授权、不复制 truth、安全外发和身份到 handoff 的完整追溯必须成立 | 正式输入边界、P 单元 owner 分离、Tool audit、时点关联和 safe-material 四项门禁 | §8 依赖;§9 数据;§10 交互;§13 横切;§15 风险 | 安全与审计要求横切多个单元,不是日志或安全手册。 |
| `NFR-L2T-014~019` | 重复输入不分叉 truth,caller/carrier 不分叉合同,迟到材料不改写,关键状态 / gap 可判断 | 显式演进 / 幂等 / 新事实机制、消费时点锚定、S2 对账、P3/P4/P6 gap 可见 | §9 数据;§10 交互;§11 技术机制;§13 横切 | 一致性和可观测性由 owner、时点和写权承接,不把 Observability store 拉入本仓。 |
| `AC-L2T-001~039`;`VF-L2T-001~013` | 架构必须支持五节点、功能、规则、数据和 NFR 的可判断验收,13 类红线不得发生 | Step 5/7/8/9/12/15 停审、风险门禁、历史材料审计和跨表孤儿检查 | §3 约束;§13 横切;§15 风险;§16 追溯;§17 ADR | AC/VF 是设计验证来源,不是测试结果、evidence 或签署。 |
| `R-L2T-001~012`;`Q-L2T-001~008`;`AR-L2T-001~009`;`L2T-UP-001~009` | 开放 owner/contract/mapping/route/client/measurement 与历史回流风险必须显式保留 | 风险 / 待确认拆表、blocker 映射、保守 seam、演进触发和追溯缺口 | §12 取舍;§14 演进;§15 风险;§16 追溯 | 逻辑承接闭合不等于问题解决;受影响正向设计继续 blocked / pending / future。 |

### 4.3 漏项检查表

| 追溯缺口类型 | 对象 / 缺口 | 影响范围 | 当前状态 | 说明 |
|---|---|---|---|---|
| 正向 authority 未闭口 | `Q-L2T-001~002`:authorization owner/source/taxonomy/result consumer material | `A4/P3`;`02~05/07` | `open_upstream_boundary/contract` | 逻辑 fail-closed seam 已承接,但不能主观补 owner、字段或 freshness。 |
| 正向 mapping 未闭口 | `Q-L2T-003`:ToolInvocation / Sandbox generic execution / source / outcome mapping | `A4/A5/P4`;`02/03/05/06` | `planned_l2_adapter_boundary` | Adapter responsibility 已承接,具体映射尚未形成正式来源。 |
| 正向 handoff lifecycle 未闭口 | `Q-L2T-004`:Sandbox receipt/feedback/cleanup seam | `A4/P4`;`02~07` | `open_upstream_contract` | 本地 attempt/gap 可追溯,外部 accepted/receipt/cleanup 未闭口。 |
| Event collaboration 未闭口 | `Q-L2T-005`:Observability producer/source/route/workspace readiness | `A5/P6`;`01~07` | `open_integration_boundary` | Safe material 与 local attempt 已承接,positive route / observed / readiness 未成立。 |
| Compile contract authority 未闭口 | `Q-L2T-006`:Core Tools-specific shared contract | `P1`;`01~03/05/07` | `upstream_contract_candidate` | Core-only compile 决定成立,具体 schema/package authority 不成立。 |
| Future consumer contract 未闭口 | `Q-L2T-007`:SDK tools-specific client seam | Future SDK consumer | `downstream_contract_pending/future_excluded` | 服务端语义独立成立,client 不进入当前项目依赖。 |
| 量化追溯未闭口 | `Q-L2T-008`:NFR measurement/evidence authority | `05~07` | `blocked_by_measurement_and_evidence_authority` | 非量化架构口径已承接,量化目标和通过事实不能补写。 |
| ADR 正式载体缺口 | 九项长期架构决定尚无正式 ADR 编号 / 文件 / 评审记录 | §17 ADR 索引;后续长期维护 | `not_established` | 候选已停审但 ADR 记录未建立,因此索引编号只能写 `未建立`。 |
| 追溯未承接 | 正式 00 的核心 / 外围 FR、IB/DB、NFR、AC/VF | 全部架构主线 | 无 | §4.2 及附属审计已覆盖,不存在用“已覆盖”掩盖的孤儿范围。 |
| 架构判断缺来源 | Step 1~14 的九项 ADR 候选与正式章节结果 | 全部长期决定 | 无 | 每项均回指正式需求 ID、硬约束 / 风险及已停审架构单元。 |

### 4.4 架构决定停审记录

| 决定 | 值得长期保留 | 已回指停审单元 / 审计 | 有正式需求 / 约束 / 风险来源 | 未新增未确认结论 | 停审 |
|---|---|---|---|---|---|
| 独立工具行动语义 truth center | 是 | `A1~A5`;Step 5 跨单元审计 | AG/HC/FR/VF | 是 | pass |
| A/S/P 分层写权 | 是 | 14 单元;Step 5/7/8/12 审计 | HC/DR/NFR/AR | 是 | pass |
| 正式承接与三类依赖裁剪 | 是 | Step 4/7 跨边界审计 | DB/HC/VF/AR | 是 | pass |
| 四层数据与消费时点 | 是 | Step 8 14 单元审计 | DR/NFR/HC/VF | 是 | pass |
| Canonical invocation/result/error | 是 | `A3/A5`;Step 9 审计 | FR/BR/NFR/VF | 是 | pass |
| Authorization/Sandbox 分权与 fail-closed | 是 | `A4/P3/P4`;Step 5/8/9/12 | FR/BR/DR/AR/Q | 是,开放项仍开放 | pass |
| Local-truth-first 与两类 attempt | 是 | `A4/A5/P6`;Step 8/9 审计 | FR/BR/DR/NFR/VF | 是 | pass |
| 同步 / 异步 / 后台与逻辑承载分离 | 是 | `R1/R2/R3`;Step 6/9/12 | IB/NFR/取舍 | 是 | pass |
| Safe material 与外围只读隔离 | 是 | `A5/S2/S3/P6`;Step 12 | FR/BR/NFR/VF/AR | 是 | pass |

### 4.5 需求范围附属审计

| 范围 | 覆盖结论 | 架构承接 |
|---|---|---|
| 核心 FR | `FR-L2T-001~017` 全部覆盖 | 五组分别落到 `A1~A5` 及适用 S/P/R/T/D。 |
| 外围 FR | `FR-L2T-E01~E06` 全部覆盖 | `S2/S3/R3/D1` 只读 / 派生,不成为核心前置。 |
| 接口 | `IB-L2T-001~019`、`IB-L2T-E01~E04` 全部覆盖 | Step 9 的 16 场景及正式读取 / 变化 / 后台能力面承接。 |
| 依赖记录 | `DB-L2T-001~008` 全部覆盖 | Current/pending/future 由 Step 4/7 裁剪,只有 compile/runtime/event。 |
| NFR | `NFR-L2T-001~019` 全部覆盖 | Step 12 六类横切约束和 Step 8/9/10 机制承接。 |
| AC | `AC-L2T-001~039` 全部覆盖 | 作为可判断设计来源进入停审 / 追溯,未声明实际通过。 |
| VF | `VF-L2T-001~013` 全部覆盖 | 硬约束、风险和跨表审计承接,未声明实际测试。 |
| 风险 / 待确认 / blocker | R/Q/AR/UP 全部覆盖 | Step 14 表与 §4.3 缺口表承接,状态未改变。 |

### 4.6 跨 ADR / 需求追溯审计表

| 检查项 | 结果 | 说明 |
|---|---|---|
| 孤儿核心需求 | 无 | 17 项核心 FR 均映射到 A1~A5 及相关结构。 |
| 孤儿外围需求 | 无 | 6 项外围 FR 均映射到只读 / 派生边界。 |
| 孤儿接口 / 依赖 / NFR / AC / VF | 无 | §4.5 全量覆盖,未改写需求内部 authority。 |
| 孤儿架构决定 | 无 | 九项 ADR 候选均有正式来源和已停审单元 / 审计。 |
| ADR 候选缺长期性 | 无 | 每项均跨多个章节并约束后续正式链。 |
| 普通实现选择误入 ADR | 无 | 未写语言、框架、DB、broker、protocol、schema、algorithm 或 metric。 |
| 未收稳事项误入 ADR | 无 | Q1~Q8 只进入缺口表;ADR 只索引已定 owner / 边界 / 机制。 |
| 旧 ADR 编号 / 决定回流 | 无 | 全部编号 `未建立`;旧 ADR-0005/0009 仅 historical material。 |
| 追溯矩阵新增关系 | 无 | 使用正式 00 已有 ID 范围和 Step 1~14 已停审结果。 |
| 取舍缺来源 | 无 | 当前分层、三类通信、controlled shadow、证据触发均有需求 / 风险来源。 |
| Blocker 被追溯闭合 | 无 | 九项 UP 和八项 Q 均保留真实状态与阻塞点。 |
| 实现 / 验证事实泄漏 | 无 | 未写 DTO、API、event、table、commit、run、evidence、测试结果、签署或 readiness。 |

### 4.7 决策边界与追溯范围说明

ADR 索引只收已经稳定、会长期改变多章主线且值得单独理解的根决定,所以具体产品、协议、字段、算法和量化目标均不进入。需求追溯采用结论组粒度,但通过明确 ID 范围与附属审计覆盖全部核心、外围、接口、依赖、NFR、AC/VF 和风险。仍缺正式 authority 的关系保留在缺口表,不能为了矩阵完整而补写来源或定论。ADR 候选的 `未建立` 表示记录载体缺失,不是决定未收稳或已有 ADR 草稿。

---

## 5. Historical material 差异审计

| 旧内容 | 当前裁决 |
|---|---|
| 旧 `ADR-0005/ADR-0009` 及其 Python/registry/executor 前提 | Historical material,不继承编号、状态或决定。 |
| Builtin/MCP/extras、provider adapter、数据库、broker、HTTP/RPC 选型 | 局部实现 / 旧定位,不进入 ADR。 |
| 固定 event/error/replay/SLA 与完成度作为追溯来源 | 非当前 authority,不进入主矩阵或 ADR。 |
| 用 README / 旧 02/03/05/06 反向证明当前架构 | 禁止;正式 00 和 Step 1~14 是当前追溯来源。 |
| 用“矩阵已覆盖”声明 mapping/route/client/measurement resolved | 禁止;相应 Q/UP 继续进入漏项表。 |

---

## 6. 回填草稿

正式 01 第 16 章使用 §4.2 固定五列需求追溯矩阵、§4.3 固定五列漏项检查表和 §4.7 的追溯范围说明。第 17 章使用 §4.1 固定五列 ADR 候选索引表和 §4.7 的 ADR 边界说明;所有 ADR 编号保留 `未建立`。§4.4~4.6 是 Step 16 总审计的强制输入,不必全文复制进正式章,但不得丢失其无孤儿、无误入和 blocker 未闭口结论。

---

## 7. 待确认事项

本步无新增 blocker 或待确认事项。§4.3 已完整继承 `Q-L2T-001~008`、`L2T-UP-001~009` 和 ADR 正式载体缺口;它们不阻塞 Step 16 逻辑装配,但受影响的正向 contract、implementation-ready、measurement、evidence 和 ADR 编号仍不得声明成立。

---

## 8. 自检与门禁

| 检查项 | 结果 |
|---|---|
| 九项 ADR 候选是否均满足架构层 / 长期 / 可单独理解 | pass |
| ADR 编号是否全部诚实为 `未建立` | pass |
| 每项决定是否回指停审单元和正式来源 | pass |
| 需求矩阵是否固定五列且说明承接理由 | pass |
| 核心 / 外围 / IB / DB / NFR / AC / VF 是否全量覆盖 | pass |
| 漏项表是否保留 Q/UP 与 ADR 载体缺口 | pass |
| 是否完成决定停审和跨 ADR / 追溯审计 | pass |
| 是否无孤儿需求、孤儿决定、普通实现误入或新增结论 | pass |
| 是否未继承旧 ADR、伪造编号、验证或 readiness | pass |

```text
current_step = Step 15 adr_traceability completed
gate_status = pass
gate_reason = nine durable decisions passed source and unit review, all requirement ranges are traceable, open seams remain explicit gaps, and no orphan, invented ADR or unconfirmed conclusion was found
next_allowed_action = create_and_complete_01_arch_step_16_formal_document_assembly
formal_document_write_allowed = true_after_step_16_prewrite_checks
commit_required = false
```
