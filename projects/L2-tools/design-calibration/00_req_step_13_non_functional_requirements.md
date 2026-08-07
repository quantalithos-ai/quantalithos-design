# L2-tools 需求 Step 13:非功能需求

> 所属文档:`00-需求文档.md`
> 当前模式:full-restart
> 当前状态:completed_stop_review
> 正式回填状态:not_written
> 本步只收敛需求层质量约束,不定义缓存、重试、数据库、监控平台、日志字段、SLO 仪表盘、加密实现、测试步骤或实施证据。

---

## 1. Step 状态与 Step 内计划

### 1.1 Step 状态

| 字段 | 值 |
|---|---|
| step | Step 13 |
| status | `completed_stop_review` |
| gate_status | `pass` |
| previous_step | Step 12 `接口与依赖` |
| current_module | `non_functional_requirements:completed` |
| next_allowed_action | 读取需求 SOP Step 14 与需求规范 §4.14,只创建 `00_req_step_14_acceptance_criteria.md`。 |
| formal_section | `00-需求文档.md` §13 |
| formal_write_status | `not_written` |
| blocker_status | `L2T-UP-001~009` 不阻塞需求级质量约束;其 owner、taxonomy、mapping、receipt、route、schema、client 和 readiness 仍不可伪称闭口。 |

### 1.2 本步目标

把 `C-L2T-1~5`、核心规则、数据归属和能力接口所要求的质量底线收敛为可判断的需求。六类非功能要求均须适用,且每一项只能保护已经成立的能力或边界,不得借质量目标引入新的工具库存、运行编排、外部 registry、隔离执行 truth、观察存储或 SDK client。

### 1.3 Step 内计划

| 序号 | 动作 | 状态 | 完成门禁 |
|---:|---|---|---|
| 1 | 恢复 ledger / flow 并确认只允许 Step 13 | done | 正式 `00` 仍不可写,未来 Step 未提前创建。 |
| 2 | 读取 SOP Step 13、规范 §4.13 和前序 Step | done | 六类框架、输入与边界明确。 |
| 3 | 逐节点回答能力级质量问题 | done | `C-L2T-1~5` 均有质量约束且无能力串线。 |
| 4 | 单独收敛全仓质量约束 | done | 不把全局约束伪装成局部要求。 |
| 5 | 逐类形成要求和判断口径 | done | 19 条 NFR 均可判断且没有空口号。 |
| 6 | 映射 FR / BR / DR / IB / DB 与 Step 14 承接方向 | done | 无孤儿 NFR,不虚构验收结果。 |
| 7 | 后置审计 historical material | done | 旧 `100%`、`99.9%`、事件名和库存指标不继承。 |
| 8 | Blocker、自检和停审 | done | 允许创建 Step 14,正式 `00` 仍不写。 |
| 9 | Step 17 依赖术语受控回退复核 | done | 输入摘要和 `L2T-UP-008/009` 承接已区分当前依赖、pending / future 记录与具体 schema / client seam 开放状态;NFR 编号和内容不变。 |

---

## 2. 本步输入

### 2.1 输入与读取结论

| 输入 | 读取结论 | 本步约束 |
|---|---|---|
| `00_req_step_07_core_capability_loop.md` | 五节点依次保护稳定合同、受控外部关联、规范调用、执行前置 / 隔离交接、outcome / audit / safe handoff。 | 每项能力级 NFR 必须回指节点;全仓约束不得硬塞到单一节点。 |
| `00_req_step_10_business_rules_boundaries.md` | 42 条核心规则和 1 条外围规则固定单一 truth、fail-closed、不可旁路、正文红线和不得反写。 | NFR 只提升质量判断,不重开规则或定义校验算法。 |
| `00_req_step_11_data_ownership.md` | 34 项数据已分为 truth、snapshot、ref、forbidden body;消费时点快照与既有事实不可原地改写。 | 安全、一致性、追溯和可观测要求必须保持四类数据分层。 |
| `00_req_step_12_interfaces_dependencies.md` | 19 个核心 IB、4 个外围 IB 与 8 条 DB 已明确能力面和边界记录状态:`DB-L2T-001~002`、`DB-L2T-004~007` 为当前依赖,`DB-L2T-003` pending,`DB-L2T-008` future / excluded。 | 不把接口面改写为协议、字段、event、topic、route 或物理依赖;不把具体 schema / route / client seam 的开放状态误写成仓际依赖候选。 |
| 需求 SOP Step 13 / 需求规范 §4.13 | 性能、可用性、安全、审计 / 可追溯、幂等 / 一致性、可观测性六类逐项判断。 | 每条要求采用判断句且有判断口径;不能量化时不得伪造数字。 |
| 已完成项目 Step 13 | 参考 capability-hub、governance、artifact 的能力级 / 全局约束和历史指标候选化粒度。 | 只参考组织方式,不复制其它领域指标或事实。 |

---

## 3. SOP 问题回答

### 3.1 能力级与全局质量约束如何划分

| 范围 | 质量约束结论 |
|---|---|
| `C-L2T-1` | 身份 / 定义读取和演进不得成为不可解释瓶颈;同一工具合同保持单一正式语义;关键变化可追溯;实现、库存或外部身份不得反向定义合同。 |
| `C-L2T-2` | Binding 判断在 Hub 延迟或关系失效时保持可解释;不得复制 Hub truth 或形成第二 registry / allowlist;关系变化与缺口可观察。 |
| `C-L2T-3` | 不同调用方和 carrier 消费同一 canonical invocation 语义;合同外正文和 secret 不入 truth;受理、拒绝与无执行语境可追溯。 |
| `C-L2T-4` | governed 场景在 owner / source / 结论不明时 fail closed;sandbox-required 场景不可旁路;外部不可用时不得伪造裁决、执行或 handoff truth。 |
| `C-L2T-5` | normalized outcome、工具域审计与外部交接分层;外部 delivery / observation 失败不改写本地终态;敏感正文不进入审计或交接。 |
| 全仓 | 外围增强和异步协作不得阻塞或重写核心 truth;所有外部 source、snapshot、ref 和缺口保持 owner 可辨;没有当前 authority 的硬指标只保留为待确认。 |

### 3.2 六类要求的适用性

| 非功能类别 | 适用性 | 判断 |
|---|---|---|
| 性能 | 适用 | 合同读取、前置判断、outcome 消费位于 Runtime 行动协作主链,但当前没有可验证的数值基线。 |
| 可用性 | 强适用 | Hub、authorization、Sandbox、Bus、Observability 与 SDK 具有不同降级边界,必须避免故障反写本地 truth。 |
| 安全 | 强适用 | 工具调用接近外部行动、授权与隔离边界,正文 / secret 泄露、自授权和隔离旁路均属硬失败。 |
| 审计 / 可追溯 | 强适用 | 工具身份、调用、执行来源、outcome 和 handoff 分属多个 owner,必须可解释回链。 |
| 幂等 / 一致性 | 强适用 | 稳定合同、invocation-bound snapshot 和终态必须保持单一语义且不可被后到材料原地改写。 |
| 可观测性 | 适用 | 关键状态、边界异常和外部缺口需要可发现,但 Observability store 不归本仓。 |

### 3.3 哪些要求可以量化

当前没有经正式上游、实测容量或已签署 SLO 支持的延迟、可用率和覆盖率数字。需求层先固定“主链不形成不可解释瓶颈”“外围失败不阻塞核心”“所有适用路径均遵守硬边界”等判断口径;后续测试方案只能在正式接口和测量基线成立后设置候选量化目标,不得把历史 `100% / 99.9%` 或旧接口指标追认为当前事实。

---

## 4. 当前文档问题诊断

旧正式链以旧接口、旧事件、库存与未经授权的覆盖率 / SLA / 时延数字表达质量,既无法支撑当前五节点,也会吸收 Runtime、Sandbox、Bus 与 Observability 的外部质量 truth。Step 12 回退新增 `IB-L2T-019` 后,还必须区分“同步判断位于主链”和“已形成状态可从读侧识别”两种来源关系。

---

## 5. 改动前后对比

| 维度 | 改动前 | 当前校准后 |
|---|---|---|
| 质量范围 | 旧接口性能、事件覆盖率、外部 SLA 与库存构建混杂 | 六类 NFR 只保护当前五节点、全仓边界及已确认数据 / 接口能力。 |
| 判断口径 | 使用无 authority 的 `0 / 100% / 99.9% / 99.95%` 与时延数字 | 无正式测量基线时使用可判断的行为口径,不伪造硬指标。 |
| 接口来源 | 同步 authorization 消费 seam 缺失 | `NFR-L2T-001` 来源包含 `IB-L2T-019`;`NFR-L2T-017` 保持读侧状态识别来源,不包含 `IB-L2T-019`。 |

---

## 6. 设计取舍

### 6.1 C-L2T-1 稳定身份与完整定义

| 议题 | 结论 |
|---|---|
| 性能 / 可用性 | 基础合同建立、读取和显式演进不被搜索、diff、批量维护、管理入口等外围增强阻塞。 |
| 安全 / 一致性 | 实现、库存、SDK 包装、provider 或外部 capability identity 不能成为本地合同 truth;重复输入不制造分叉身份。 |
| 追溯 / 观察 | 关键变化、兼容影响和退役必须可追溯、可观察,但不规定审计物理存储。 |
| 取舍 | 不继承旧 schema 覆盖率 `100%`;当前验收对象是“正式定义完整且边界成立”,不是某旧字段集。 |

### 6.2 C-L2T-2 受控外部能力关联

| 议题 | 结论 |
|---|---|
| 可用性 | Hub source 延迟或引用不可验证时,保留关系缺口并阻止猜测,不静默回退到本地 registry。 |
| 安全 / 一致性 | 本仓只拥有 body-free relation 与自身校验事实,不复制 identity / descriptor / exposure / applicability truth。 |
| 追溯 / 观察 | Binding 建立、替换、陈旧、冲突、失效和不可验证状态必须可解释。 |
| 取舍 | 不把 capability exposure 等同 authorization,也不把外部 MCP“全部经过某旧 allowlist”写成质量指标。 |

### 6.3 C-L2T-3 规范调用语义

| 议题 | 结论 |
|---|---|
| 性能 | 正式合同读取、调用锚定和受理 / 拒绝判断不应成为行动主链的不可解释瓶颈。 |
| 安全 | 只接纳合同内归一化语义;raw caller / transport body、合同外输入和 secret 不进入 invocation truth。 |
| 一致性 | Direct、adapter、sandbox carrier 和不同调用方不得形成第二调用合同或终态语义。 |
| 追溯 / 观察 | 调用与 identity / definition、受理 / 拒绝事实及 Runtime refs 的关系可解释。 |

### 6.4 C-L2T-4 执行前置与条件化隔离交接

| 议题 | 结论 |
|---|---|
| 可用性 | 正式 authorization 或 Sandbox 能力不可用时,受影响路径进入可解释拒绝 / 无执行 / 缺口语境,不得默认放行。 |
| 安全 | L2 不自我授权;sandbox-required 不宿主直跑;raw policy、allowlist、taxonomy、run 或 capture 正文不入仓。 |
| 一致性 | 消费时点的正式来源摘要 / ref 与判断事实绑定,后到变化不得原地重写既有判断。 |
| 取舍 | `L2T-UP-001~004` 阻止 owner matrix、taxonomy、mapping、receipt 和 cleanup 协议定稿,但不削弱 fail-closed / 不可旁路要求。 |

### 6.5 C-L2T-5 Outcome、审计与安全交接

| 议题 | 结论 |
|---|---|
| 性能 / 可用性 | Bus / Observability / SDK 或外围摘要不可用不得阻塞 normalized outcome 与 Tool-domain audit 成立。 |
| 安全 | Raw capture、provider response、secret、credential、prompt、Bus history、Observability store 或 evidence 正文不得进入 result、audit 或 handoff。 |
| 一致性 / 追溯 | Outcome 与 execution source 绑定;handoff 尝试 / 降级单独成事实;外部状态不得替代或改写本地终态。 |
| 观察 | outcome、owner fault、handoff gap 可识别;可观测材料不成为工具 truth 或 Runtime recovery 指令。 |
| 取舍 | `L2T-UP-004~007` 使 receipt、producer、source、route 和 readiness 保持开放;需求只固定 safe-material 和 degradation 边界。 |

---

### 6.6 Step 16 回退审计取舍

`NFR-L2T-001` 的来源保留 `IB-L2T-019`,因为 governed invocation 执行前同步消费正式 authorization 结果属于调用前置判断,会约束 Runtime 行动协作主链。`NFR-L2T-017` 不把 `IB-L2T-019` 列为来源,因为该项判断口径是已形成关键状态的读侧可识别性,继续由查询、终态、审计与安全变化能力面承接;这一取舍不修改 NFR 正文、FR 范围或后续 AC / VF。

---

## 7. 结构化中间产物

### 7.1 非功能要求表

| 非功能类别 | 要求 | 判断口径 / 目标值 |
|---|---|---|
| 性能 | `NFR-L2T-001` 正式工具合同、binding 状态和调用前置的基础读取与判断不应成为 Runtime 行动协作主链的不可解释瓶颈。 | 在正式测量对象和基线尚未闭口时,以核心能力面可独立完成且不被外围搜索、报表、导出或客户端说明阻塞为通过口径;不伪造延迟数字。 |
| 性能 | `NFR-L2T-002` 调用受理、前置判断、normalized outcome 和工具域审计的形成不得以牺牲合同正确性、fail-closed、隔离不可旁路或 truth 分层换取低延迟。 | 任一性能优化均不得改变 `BR-L2T-016~042` 的硬规则或 Step 11 数据 owner;若性能与正确性冲突,必须保留正确且可解释的拒绝 / 降级。 |
| 性能 | `NFR-L2T-003` 搜索、diff、批量维护、派生索引、诊断摘要、客户端说明、管理入口和外部安全材料交接不得阻塞核心合同、调用和本地终态成立。 | `FR-L2T-E01~E06` 或 Bus / Observability / SDK 消费延迟、失败或未交付时,`C-L2T-1~5` 的适用核心事实仍可成立或可解释收束。 |
| 可用性 | `NFR-L2T-004` 外围增强失效时,五个核心能力节点不得整体失效。 | 外围功能可被排除或降级,但不得使稳定合同、受控关联、canonical invocation、前置判断及 outcome / audit 失去正式语义。 |
| 可用性 | `NFR-L2T-005` Hub、authorization 或 Sandbox 的必要输入缺失、冲突、陈旧、不可验证或不可用时,受影响路径必须保持 truth 不受污染并显式 fail closed、无执行或暴露缺口。 | 不出现猜测 capability truth、默认授权、宿主直跑、伪造 run / capture / receipt 或将“未知”当“允许”;不受影响的本地合同读取仍可成立。 |
| 可用性 | `NFR-L2T-006` Bus、Observability、SDK 或其他下游消费延迟 / 失败不得回滚或改写已成立的本地 result、error 与 Tool-domain audit。 | 本地提交尝试、降级和缺口单独可判断;外部 delivery / observation / client 状态只作 snapshot / ref,不触发本仓 Runtime recovery。 |
| 安全 | `NFR-L2T-007` 本仓不得保存或外发 Step 11 定义的 forbidden body、raw caller / transport body、合同外输入、secret 或 credential。 | `DR-L2T-006`;`DR-L2T-012`;`DR-L2T-018`;`DR-L2T-026`;`DR-L2T-034` 正文不进入合同 truth、snapshot、audit 或 safe handoff;归一化只产生合同允许的最小工具语义。 |
| 安全 | `NFR-L2T-008` 本仓不得自我生成 effective authorization,governed 场景不得在来源 / 结论不可验证时放行,sandbox-required 场景不得绕过正式隔离边界。 | `BR-L2T-023~031` 全部成立;不存在本地 allowlist 裁决、默认 allow、宿主直跑或伪造 Sandbox 事实。 |
| 安全 | `NFR-L2T-009` 本仓不得复制 Hub registry / descriptor / exposure / applicability truth,也不得让 Runtime、Sandbox、Bus、Observability、SDK 或 provider 反写工具合同 truth。 | 外部事实仅以允许的 safe summary / ref 被消费;本地只拥有 relation、消费判断、normalized semantics 和 handoff attempt 等自身 truth。 |
| 安全 | `NFR-L2T-010` 对外安全材料必须最小必要、body-free、已脱敏、可关联且不把外部 route / delivery / observation 状态伪装为本地事实。 | `FR-L2T-017`、`DR-L2T-030~034` 和 `IB-L2T-017~018` 的边界同时成立;无 producer、route、schema 或 evidence 伪造。 |
| 审计 / 可追溯 | `NFR-L2T-011` 工具身份、正式定义及演进、binding 变化、invocation 锚定、受理 / 拒绝、执行来源、normalized outcome 和 Tool-domain audit 的关键关系必须可追溯。 | 对任一已成立工具行动语义,能说明使用哪一正式合同、形成何种本地判断 / 终态及关联哪些允许 source refs;不要求拥有外部正文。 |
| 审计 / 可追溯 | `NFR-L2T-012` 多 owner 协作必须保持故障与事实来源可区分,不得用 capture、delivery audit、observation projection 或 Runtime checkpoint 替代工具域事实。 | Hub、authorization、Sandbox、Runtime、Bus、Observability 的 owner 和 ref 可辨;未知 / 冲突 / 缺口不被抹平。 |
| 审计 / 可追溯 | `NFR-L2T-013` 本地 handoff 准备、提交尝试、降级与缺口以及外部状态摘要必须按发生 / 消费时点留有可解释关联,不得原地覆盖历史解释。 | `DR-L2T-030`;`DR-L2T-031`;`DR-L2T-033` 分层成立;后续尝试、外部变化或重评形成新事实 / snapshot / ref 或显式缺口。 |
| 幂等 / 一致性 | `NFR-L2T-014` 重复的工具合同、binding 或维护输入不得制造重复身份、分叉定义、第二 relation truth 或隐式状态变化。 | 重复输入得到同一正式语义、被识别为冲突或形成显式新变化;查询、索引、对账和外围维护不得成为 truth 写源。 |
| 幂等 / 一致性 | `NFR-L2T-015` 同一正式合同和 invocation 在不同调用方或执行 carrier 下必须保持单一调用、拒绝、result 与 error 语义。 | Direct、adapter、Sandbox、Runtime 或 SDK 消费不形成私有第二合同;执行 / 无执行终态不因 carrier 改名或分叉。 |
| 幂等 / 一致性 | `NFR-L2T-016` Invocation-bound snapshot / ref、执行来源和既有 outcome 必须锚定各自消费时点;后到外部变化、delivery 或 observation 不得原地改写。 | `DR-L2T-016`;`DR-L2T-022`;`DR-L2T-023`;`DR-L2T-025`;`DR-L2T-031~033` 生命周期成立;重评形成新事实或显式缺口,不覆盖既有解释。 |
| 可观测性 | `NFR-L2T-017` 工具合同、binding、invocation、受理 / 拒绝、前置判断、outcome、audit 与 handoff gap 的关键状态和变化必须能在本仓正式能力面被稳定判断。 | 可通过 `IB-L2T-002`;`IB-L2T-006`;`IB-L2T-011`;`IB-L2T-015~016`;`IB-L2T-018` 或安全变化输出判断当前状态与关键变化;不要求 Observability 存储归本仓。 |
| 可观测性 | `NFR-L2T-018` 边界越界、来源缺失 / 冲突、stale binding、隔离旁路企图、forbidden body 进入及多 owner 故障必须可发现且 owner 可辨。 | 异常不被静默降级为成功,也不把观察结果升级为工具 truth;适用时产生可解释拒绝、缺口或工具域审计语境。 |
| 可观测性 | `NFR-L2T-019` 安全材料提交、Bus / Observability 消费延迟及 route / producer readiness 缺口必须可判断,但不得阻塞或重写本地核心事实。 | 在 `L2T-UP-004~007` 未闭口时只声明本地尝试 / 降级 / 缺口可见;不声明外部 delivery、projection 或 readiness 已成立。 |

### 7.2 非功能要求来源与能力映射

| NFR | 能力节点 / 全仓目标 | 主要 FR | 主要规则 / 数据 / 接口来源 |
|---|---|---|---|
| `NFR-L2T-001` | `C-L2T-1~5` | `FR-L2T-001~002`;`FR-L2T-006~017` | `IB-L2T-002`;`IB-L2T-006`;`IB-L2T-009~016`;`IB-L2T-018~019` |
| `NFR-L2T-002` | `C-L2T-3~5` | `FR-L2T-007~017` | `BR-L2T-016~042`;`DR-L2T-013~034` |
| `NFR-L2T-003` | 全仓核心 / 外围分层 | `FR-L2T-001~017`;`FR-L2T-E01~E06` | `BR-L2T-E01`;`IB-L2T-E01~E04`;`DB-L2T-006~008` |
| `NFR-L2T-004` | `C-L2T-1~5` | `FR-L2T-001~017`;`FR-L2T-E01~E06` | Step 7 核心 / 外围分层;`BR-L2T-E01` |
| `NFR-L2T-005` | `C-L2T-2`;`C-L2T-4` | `FR-L2T-004~006`;`FR-L2T-010~013` | `BR-L2T-009~015`;`BR-L2T-023~031`;`DB-L2T-002~004` |
| `NFR-L2T-006` | `C-L2T-5` | `FR-L2T-014~017` | `BR-L2T-032~042`;`DR-L2T-027~034`;`DB-L2T-006~008` |
| `NFR-L2T-007` | 全仓正文红线 | `FR-L2T-001~017`;`FR-L2T-E04~E06` | `BR-L2T-008`;`BR-L2T-018`;`BR-L2T-034`;`BR-L2T-039~042`;`DR-L2T-006`;`DR-L2T-012`;`DR-L2T-018`;`DR-L2T-026`;`DR-L2T-034` |
| `NFR-L2T-008` | `C-L2T-4` | `FR-L2T-010~013` | `BR-L2T-023~031`;`DR-L2T-019~026`;`DB-L2T-003~004` |
| `NFR-L2T-009` | `C-L2T-2~5`;全仓 owner 边界 | `FR-L2T-004~017`;`FR-L2T-E01~E06` | `BR-L2T-008~015`;`BR-L2T-022`;`BR-L2T-028`;`BR-L2T-032~042`;`BR-L2T-E01`;`DB-L2T-002~008` |
| `NFR-L2T-010` | `C-L2T-5` | `FR-L2T-017` | `BR-L2T-038~042`;`DR-L2T-030~034`;`IB-L2T-017~018` |
| `NFR-L2T-011` | `C-L2T-1~5` | `FR-L2T-001~017` | `BR-L2T-005~007`;`BR-L2T-013~015`;`BR-L2T-016~022`;`BR-L2T-032~042`;`IB-L2T-002~004`;`IB-L2T-006~018` |
| `NFR-L2T-012` | `C-L2T-2~5` | `FR-L2T-005~017` | `DR-L2T-010~012`;`DR-L2T-017`;`DR-L2T-022~026`;`DR-L2T-031~034`;`DB-L2T-002~007` |
| `NFR-L2T-013` | `C-L2T-5` | `FR-L2T-017` | `BR-L2T-038~042`;`DR-L2T-030`;`DR-L2T-031`;`DR-L2T-033`;`IB-L2T-017~018` |
| `NFR-L2T-014` | `C-L2T-1`;`C-L2T-2` | `FR-L2T-001~006`;`FR-L2T-E01~E03`;`FR-L2T-E06` | `BR-L2T-001~015`;`DR-L2T-001~012`;`IB-L2T-001~008` |
| `NFR-L2T-015` | `C-L2T-3~5` | `FR-L2T-007~015` | `BR-L2T-016~036`;`DR-L2T-013~028`;`IB-L2T-009~015` |
| `NFR-L2T-016` | `C-L2T-3~5` | `FR-L2T-007~017` | `DR-L2T-016`;`DR-L2T-022`;`DR-L2T-023`;`DR-L2T-025`;`DR-L2T-031~033`;`BR-L2T-022`;`BR-L2T-025`;`BR-L2T-030`;`BR-L2T-036`;`BR-L2T-040~042` |
| `NFR-L2T-017` | `C-L2T-1~5` | `FR-L2T-001~017` | `IB-L2T-002`;`IB-L2T-004`;`IB-L2T-006`;`IB-L2T-008`;`IB-L2T-010~011`;`IB-L2T-015~018` |
| `NFR-L2T-018` | `C-L2T-2~5` | `FR-L2T-006`;`FR-L2T-008`;`FR-L2T-011~017` | `BR-L2T-013~015`;`BR-L2T-018`;`BR-L2T-023~042`;`DR-L2T-009`;`DR-L2T-014`;`DR-L2T-020`;`DR-L2T-026`;`DR-L2T-028~034` |
| `NFR-L2T-019` | `C-L2T-5`;全仓外部协作 | `FR-L2T-017` | `BR-L2T-038~042`;`DR-L2T-030`;`DR-L2T-031`;`DR-L2T-033`;`DB-L2T-006~007` |

### 7.3 六类覆盖与能力停审

| 节点 | 主要 NFR | 停审结论 |
|---|---|---|
| `C-L2T-1` | `NFR-L2T-001~004`;`NFR-L2T-007`;`NFR-L2T-011`;`NFR-L2T-014`;`NFR-L2T-017` | pass:合同的性能、外围隔离、正文红线、追溯、一致性和可观察性均有口径。 |
| `C-L2T-2` | `NFR-L2T-001`;`NFR-L2T-004~005`;`NFR-L2T-007`;`NFR-L2T-009`;`NFR-L2T-011~012`;`NFR-L2T-014`;`NFR-L2T-017~018` | pass:Hub 不可用、truth 不复制和 binding 缺口可见均成立;约束保持显式。 |
| `C-L2T-3` | `NFR-L2T-001~004`;`NFR-L2T-007`;`NFR-L2T-009`;`NFR-L2T-011~012`;`NFR-L2T-015~018` | pass:调用语义不分叉、raw body 禁止和锚定可追溯均成立。 |
| `C-L2T-4` | `NFR-L2T-001~002`;`NFR-L2T-004~005`;`NFR-L2T-007~009`;`NFR-L2T-011~012`;`NFR-L2T-015~018` | pass:fail-closed / 不可旁路明确;约束为 `L2T-UP-001~004` 继续开放。 |
| `C-L2T-5` | `NFR-L2T-001~004`;`NFR-L2T-006~007`;`NFR-L2T-009~013`;`NFR-L2T-015~019` | pass:outcome / audit / handoff 分层明确;约束为 `L2T-UP-004~007` 继续开放。 |
| 全仓 | 六类均覆盖 | pass:没有把旧 SLA、历史覆盖率或外部 readiness 写成当前质量事实。 |

### 7.4 Step 14 承接方向

| 非功能类别 | Step 14 必须验收的方向 |
|---|---|
| 性能 | 核心能力不被外围能力和外部交接阻塞,且不能以速度牺牲硬边界。 |
| 可用性 | 外部依赖和外围增强失效时,本地 truth 保持不受污染并显式收束 / 降级。 |
| 安全 | forbidden body 不入仓、不外发;不自授权、不旁路隔离、不复制或接受反写 truth。 |
| 审计 / 可追溯 | 身份到 outcome 的关键链、owner 区分与 handoff 历史解释完整。 |
| 幂等 / 一致性 | 重复输入不分叉;carrier 不改变语义;消费时点锚定事实不被原地改写。 |
| 可观测性 | 关键状态、越界异常、多 owner 故障和 handoff gap 可判断且不变成 observation truth。 |

---

### 7.5 Historical material 后置审计

| 旧线索 | 当前处理 |
|---|---|
| Tool schema 覆盖率 `100%` | `historical_material`;旧 schema 和库存范围已失效,不作为当前 NFR 或测试结果。 |
| 危险工具绕过 Sandbox 次数 `0` | 保留“sandbox-required 不可旁路”的硬判断,不继承旧工具分类、样本范围或已测试事实。 |
| ToolInvoked / Completed / Failed 事件覆盖率 `100%` | 旧事件名和覆盖率不继承;重裁为工具域关键事实可追溯与安全材料交接边界。 |
| Governed / restricted 调用留痕率 `100%` 与未获允许调用成功率 `0` | 前者混入无正式 inventory denominator 的覆盖率,后者混入 authorization / Runtime enforcement 结果;只保留 Tool-domain audit、fail-closed 和不可旁路的硬判断,不继承数字或已测试事实。 |
| Role extras 构建成功率 `100%` | 边界外产品装配指标,不进入当前 NFR。 |
| 旧 `99.9% / 99.95%` 依赖 SLA | 无正式来源与测量基线,作为历史材料排除。 |
| 旧 `ValidateToolInvocation / Policy / InvokeTool` 的 `100ms / 200ms / 300ms` 阈值和任何 P95 / P99 / QPS / `30s` 指标 | 绑定旧接口、Policy 判定和实现主线,当前无负载模型、测量对象或正式 authority,不得进入 NFR 或 Step 14 验收。 |
| replay / rebuild `100%` | Runtime / Bus / Observability 恢复能力不归本仓,不进入需求质量目标。 |

---

## 8. 回填草稿

> Step 17 应将 §7.1 的固定三列表装配到正式 §13,并用短说明声明六类均适用、当前不伪造硬指标。§7.2~7.5 作为追溯与 Step 14 输入保留在 calibration。

正式章节只承载以下收口结论:

1. 六类非功能要求均适用,安全、审计 / 可追溯、幂等 / 一致性为强适用。
2. `NFR-L2T-001~019` 的要求和判断口径。
3. 历史 `0 / 100% / 99.9% / 99.95%`、旧事件 / 留痕覆盖和库存构建指标不构成当前目标或测试结果。

---

## 9. 待确认事项

### 9.1 Blocker 判定

| Blocker | 是否阻塞 Step 13 | 当前质量边界 | 不得声称 |
|---|---|---|---|
| `L2T-UP-001~002` | 否 | `NFR-L2T-005`;`NFR-L2T-008`;`NFR-L2T-018` 固定 fail-closed、自授权禁止和缺口可见。 | owner/source matrix、taxonomy 或优先级已定稿。 |
| `L2T-UP-003~004` | 否 | `NFR-L2T-005`;`NFR-L2T-008`;`NFR-L2T-011`;`NFR-L2T-016`;`NFR-L2T-018~019` 固定不可旁路、来源锚定和交接缺口。 | mapping、receipt、dead-letter、feedback、cleanup release 或 route 已可执行。 |
| `L2T-UP-005~007` | 否 | `NFR-L2T-006`;`NFR-L2T-010`;`NFR-L2T-013`;`NFR-L2T-019` 固定本地 truth 与 safe handoff / degradation 分层。 | Tools producer、source、schema、route、immutable baseline 或 implementation readiness 已成立。 |
| `L2T-UP-008` | 否 | `DB-L2T-001` 保持当前编译期依赖;NFR 只引用正式适用的 shared contract 类别,Tools-specific schema / contract authority 仍为候选并待闭口。 | Core 已有 Tools-specific ID、definition、invocation、result、error 或 event schema。 |
| `L2T-UP-009` | 否 | `DB-L2T-008` 保持 future / excluded 且不进入当前依赖;tools-specific SDK client seam 仍 pending,其失败不阻塞核心。 | Tools-specific SDK client、方法或覆盖率已存在。 |

结论:未发现新增且阻塞 Step 13 的上游 blocker。开放项不得因 NFR 已定义而改写为 resolved 或 implementation-ready。

---

## 10. 进入下一步条件

### 10.1 自检

| 检查项 | 结论 |
|---|---|
| 六类最小枚举是否逐项检查 | pass,六类均适用且共 19 条 NFR。 |
| 每项是否有判断口径 | pass,没有空值或单纯口号。 |
| 能力级 / 全局约束是否分层 | pass,五节点与全仓目标分别映射。 |
| 是否存在孤儿 NFR | 无,均有节点 / 全仓目标及 FR / BR / DR / IB / DB 来源。 |
| 是否进入实现或测试方案 | 无,未定缓存、重试、数据库、日志字段、平台配置、测试步骤或 evidence。 |
| 是否伪造 SLA / 测试结果 | 无,旧数字全部历史化。 |
| 是否误关 blocker | 无,`L2T-UP-001~009` 均保持原状态。 |
| 是否区分当前依赖关系与具体 schema / route / client seam 开放状态 | 是。 |
| 是否提前写 Step 14 或正式文档 | 否。 |

### 10.2 模块状态

| 模块 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status |
|---|---|---|---|---|---|---|---|
| `C-L2T-1` | done | done | done | done | done | done | pass |
| `C-L2T-2` | done | done | done | done | done | done | pass |
| `C-L2T-3` | done | done | done | done | done | done | pass |
| `C-L2T-4` | done | done | done | done | done | done | pass |
| `C-L2T-5` | done | done | done | done | done | done | pass |
| 全仓六类审计 | done | done | done | done | done | done | pass |

### 10.3 停审结论

```text
step_status = completed_stop_review
gate_status = pass
formal_section_write_allowed = false
next_allowed_action = create 00_req_step_14_acceptance_criteria.md only
commit_required = false
```
