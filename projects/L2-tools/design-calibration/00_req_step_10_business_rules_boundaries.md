# L2-tools 需求 Step 10:业务规则与边界约束

> Step 状态: completed_stop_review
> 当前模式: full-restart
> 正式回填目标: `00-需求文档.md` §10
> 本步原则: 用需求层硬规则保护 Step 2 边界、Step 7 闭环和 Step 9 功能不串线;不写字段、状态机编码、数据库约束、事务、接口签名、事件 schema、异常码或实现校验逻辑。

---

## 1. Step 状态与 Step 内计划

### 1.1 Step 状态

| 字段 | 值 |
|---|---|
| step | Step 10 |
| status | `completed_stop_review` |
| gate_status | `pass` |
| previous_step | Step 9 `功能需求` |
| current_module | `business_rules_boundaries:completed` |
| next_allowed_action | 读取需求 SOP Step 11 与需求规范 §4.11,只创建 `00_req_step_11_data_ownership.md`。 |
| formal_write_status | `not_written` |
| blocker_status | `L2T-UP-001~009` 不阻塞需求级规则收敛;未闭口 owner、taxonomy、mapping、receipt、producer、route 和 shared schema 继续保持不可定稿。 |

### 1.2 本步目标

围绕 `C-L2T-1~5` 逐节点回答必须始终成立的不变量、必须禁止的行为、必须显式发生的变化、不可打穿的相邻 owner 边界,以及必须附带的治理、审计和正式引用条件。每条规则必须保护至少一项 Step 9 功能或 Step 2 边界目标。

### 1.3 Step 内计划

| 序号 | 动作 | 状态 | 输出 / 门禁 |
|---:|---|---|---|
| 1 | 恢复 ledger / flow 与 Step 2 / 7 / 9 | done | 只允许 Step 10,正式 `00` 仍不可写。 |
| 2 | 读取 SOP Step 10、规范 §4.10 和参考产物 | done | 固定六类规则与四列正式表。 |
| 3 | C-L2T-1 先思考再写规则 | done | identity / definition / evolution truth 与库存边界闭合。 |
| 4 | C-L2T-2 先思考再写规则 | done | binding relation 与 Hub / authorization 边界闭合。 |
| 5 | C-L2T-3 先思考再写规则 | done | canonical invocation 与 Runtime / carrier 边界闭合。 |
| 6 | C-L2T-4 先思考再写规则 | done | execution requirement、authorization、isolation 和 execution truth 边界闭合。 |
| 7 | C-L2T-5 先思考再写规则 | done | normalized outcome、audit、safe handoff 与外部真相边界闭合。 |
| 8 | 收敛外围增强共同规则 | done | 外围能力不得反写 truth 或成为核心前置。 |
| 9 | 完成 FR 映射、规则类型和跨能力审计 | done | 无孤儿规则、无核心 FR 规则缺口。 |
| 10 | Historical material 审计、blocker 判定、自检并停审 | done | 允许进入 Step 11,正式 `00` 仍不写。 |

---

## 2. 本步输入

| 输入 | 已读取结论 | 本步约束 |
|---|---|---|
| `00_req_step_02_position_boundary.md` | 本仓只拥有工具调用语义合同 truth,不拥有 Runtime、Hub、authorization、Sandbox、Observability、SDK 或库存 truth。 | 边界规则必须把相邻 owner 红线写实,不能只写“职责清晰”。 |
| `00_req_step_07_core_capability_loop.md` | 五节点及纯本地、capability-bound、governed、sandbox-required、无执行和 handoff 降级路径已固定。 | 规则按节点组织,条件路径不得被改写为每次调用必经的运行时链。 |
| `00_req_step_09_functional_requirements.md` | `FR-L2T-001~017` 与 `FR-L2T-E01~E06` 已停审。 | 每条规则必须映射 FR;每项核心 FR 必须有规则保护。 |
| 需求 SOP Step 10 | 规则类型默认使用不变量、禁止行为、显式变化、边界约束,按需补治理 / 审计约束。 | 节点停审后做跨能力重复、冲突、遗漏和挂载审计。 |
| 需求规范 §4.10 | 正式表固定为规则编号、规则类型、规则内容、约束对象。 | 不把 FR 映射并入正式固定表;在独立追溯表记录。 |
| 上游正式文档与 blocker 台账 | 外部 truth owner 已清晰,但 authorization、Sandbox、Observability、Core / SDK 接缝仍有开放缺口。 | 可固定 fail-closed 与不伪造规则,不得定协议、字段或 route。 |
| 已完成项目 Step 10 | Governance 展示规则类型与约束对象完整度;Method Library 展示外围规则和 FR 映射方式。 | 采用完整粒度,不复制其它领域规则。 |
| README 与旧正式链 | 旧 allowlist、具体工具、MCP、Sandbox、事件、历史 / replay 和 extras 混写。 | 独立规则形成后再做 historical material 审计。 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些不变量必须始终成立? | 稳定 identity 与 definition 锚定、显式 bound / unbound、canonical invocation 单一语义、授权与执行要求分层、result / error / audit 本地 truth 及 safe handoff 分层必须始终成立。 |
| 哪些行为必须禁止? | 禁止以查询 / 索引反写真相、复制 Hub / Sandbox / Bus / Observability 正文、self-authorization、隔离旁路、伪造 execution / handoff 事实和敏感正文外发。 |
| 哪些变化必须显式发生? | 身份 / 定义演进、binding 建立与失效、调用受理 / 拒绝、合同语义变化、审计缺口和外部 handoff 降级都必须显式。 |
| 哪些边界不能打穿? | Runtime orchestration、Hub registry、effective authorization、Sandbox execution、Bus delivery、Observability store、SDK client、provider control 和具体库存的 truth owner 边界。 |
| 哪些操作必须附带治理、审计或引用条件? | Governed 调用必须承接正式 authorization 引用 / 摘要;执行交接与归一化必须保留可信来源;工具域关键变化必须可追溯;外发必须最小化和脱敏。 |
| 规则能否回指 FR 或边界? | 是。核心规则均映射 `FR-L2T-001~017`;外围共同规则映射 `FR-L2T-E01~E06`。 |
| 是否有无法挂载的候选规则? | “文档不得伪造 commit / 测试 / signoff”属于校准流程纪律,不作为产品业务规则;未验证外部事实不得进入工具域 truth 则保留为业务规则。 |
| 是否足以阻止串仓或隐式变化? | 是。五节点各有不变量、禁止或边界规则,关键变化和治理 / 审计前置也已覆盖。 |

---

## 4. 当前文档问题诊断

### 4.1 C-L2T-1 身份、定义与演进规则

| 项 | 结论 |
|---|---|
| 保护的 FR | `FR-L2T-001~003`。 |
| 必须钉住 | Identity 不退化为名称 / 实现 / 库存 / 外部 identity;definition 唯一锚定且完整;建立、调整和退役显式可追溯。 |
| 必须禁止 | 查询、搜索、索引、导出和兼容检查反写真相;具体库存、provider / SDK / secret / 源码成为合同 truth。 |
| 取舍 | 不写 identity 字段、版本号算法、兼容等级、状态枚举或持久化唯一约束。 |

### 4.2 C-L2T-2 外部能力关联规则

| 项 | 结论 |
|---|---|
| 保护的 FR | `FR-L2T-004~006`。 |
| 必须钉住 | Bound / unbound 显式;binding 同时锚定本地工具和 Hub 正式引用;本仓只拥有 body-free relation。 |
| 必须禁止 | Hub 可见 / exposure / applicability 被当作 authorization;失效时继续调用或回退本地 registry / allowlist;维护任务补造 Hub truth。 |
| 取舍 | 不写 capability ref 字段、Hub API、刷新频率、cache 或 binding 状态机。 |

### 4.3 C-L2T-3 规范调用规则

| 项 | 结论 |
|---|---|
| 保护的 FR | `FR-L2T-007~009`。 |
| 必须钉住 | Invocation 锚定正式 identity / definition;调用方和 carrier 消费同一调用、结果和错误语义;受理 / 拒绝在执行前显式。 |
| 必须禁止 | 调用方私有 schema 补造合同;执行前拒绝伪造 Sandbox 事实;Runtime planning / orchestration / recovery 进入本仓。 |
| 取舍 | 不写请求字段、API path、命令、运行时流程或 retry 算法。 |

### 4.4 C-L2T-4 执行前置与隔离交接规则

| 项 | 结论 |
|---|---|
| 保护的 FR | `FR-L2T-010~013`。 |
| 必须钉住 | Execution requirement 不等于 authorization;governed 场景承接正式结论且未知时 fail closed;sandbox-required 不可旁路;execution material 仅为语义来源。 |
| 必须禁止 | Self-approval、宿主静默降级、拥有 Sandbox truth、capture 直接等同 result、宣称未闭口 mapping / receipt / cleanup 已可执行。 |
| 取舍 | `L2T-UP-001~004` 使具体 owner/source matrix、taxonomy 和协议后移,不削弱当前硬规则。 |

### 4.5 C-L2T-5 Outcome、审计与安全交接规则

| 项 | 结论 |
|---|---|
| 保护的 FR | `FR-L2T-014~017`。 |
| 必须钉住 | Outcome 锚定 invocation、definition 和可信来源;成功、失败、拒绝、capture / handoff failure 可区分;本地 truth 先成立;外发最小化。 |
| 必须禁止 | Provider / capture / delivery / observation 替代本地 outcome;正文 / secret 进入 audit 或 handoff;外部失败回滚本地 truth 或驱动 Runtime recovery。 |
| 取舍 | 不定事件名、producer、route、retention、delivery receipt、evidence alias 或测试结果。 |

---

## 5. 改动前后对比

### 5.1 Historical material 后置审计

| 旧规则 / 线索 | 当前处理 |
|---|---|
| `MCP Server 不在 allowlist -> 拒绝` | 不继承 allowlist 或 MCP 特例;改为 binding / authorization 正式前置与不可验证时 fail closed。 |
| `A2A 匿名注册 -> 拒绝` | External registry 和认证不归本仓;身份来源冲突只保留为受控关联失败语境。 |
| `Provider key 未加密 -> 拒绝持久化` | 不继承 provider / KMS 逻辑;本仓规则只禁止 secret / credential 正文进入合同、审计和 handoff。 |
| `Policy 更新后 30s 刷新` | 30s 无 authority 且刷新属实现 / NFR;只保留正式结果引用、陈旧时 fail closed。 |
| `工具成功 / 失败发送三类事件` | 不继承事件名、producer 或 route;只保留本地 truth 先成立和 safe material handoff 分层。 |
| `shared_rules 决定工具 allowlist` | Governance truth 不归本仓;只消费正式 authorization,不建立本地 allowlist。 |
| invocation history / replay store | Runtime / Bus / Observability truth 越界;不进入规则。 |
| Builtin、MCP Client、Role extras、member-images | 具体库存与装配不定义工具合同,继续排除。 |

---

## 6. 设计取舍

### 6.1 规则组织取舍

| 方案 | 问题 | 结论 |
|---|---|---|
| 沿用旧 6 条规则 | 以 allowlist、匿名注册、provider key、30s 刷新和事件发送为主,混入外仓与实现。 | 不采用。 |
| 每个 FR 只配一条同义规则 | 简短,但不能覆盖不变量、禁止、显式变化和 owner 红线。 | 不采用。 |
| 按节点组织六类需求级规则 | 可解释每条规则保护的功能和边界,支持 Step 11 / 14 / 16。 | 采用。 |
| 把流程纪律写成业务规则 | 会把文档质量门禁误当产品行为。 | 不采用;流程纪律保留在 calibration 自检。 |

---

## 7. 结构化中间产物

### 7.1 业务规则表

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| `BR-L2T-001` | 不变量 | 工具身份必须作为稳定的本地正式主体存在,不得退化为显示名、实现名、builtin 名、provider 名或 capability identity。 | 工具身份 |
| `BR-L2T-002` | 不变量 | 每份正式工具定义必须锚定唯一稳定工具身份,不得存在脱离身份成立或由调用方临时补全的正式定义。 | 工具身份 / 定义 |
| `BR-L2T-003` | 不变量 | 正式工具定义必须足以一致解释工具目的、调用约束、结果 / 错误语义和固有执行边界,不得依赖某个实现或调用方私有解释才能成立。 | 工具定义 |
| `BR-L2T-004` | 边界约束 | 工具固有风险声明和执行要求只能表达合同边界,不得成为 effective authorization、approval 或 allow / deny truth。 | 定义 / authorization 边界 |
| `BR-L2T-005` | 显式变化 | 工具身份的正式建立、更正和退役必须显式发生并可追溯,不得由实现替换、导入或读取隐式触发。 | 工具身份生命周期 |
| `BR-L2T-006` | 显式变化 | 工具定义变化、兼容影响和退役影响必须显式表达,不得静默改变既有引用与调用含义。 | 工具定义演进 |
| `BR-L2T-007` | 禁止行为 | 查询、搜索、索引、导出、兼容检查或维护任务不得创建或反写工具身份与定义 truth。 | 读取 / 派生 / 维护行为 |
| `BR-L2T-008` | 边界约束 | 具体工具库存、实现源码、SDK 包装、provider runtime、secret 和产品装配不得成为工具身份或定义 truth。 | 合同 / 产品与实现边界 |
| `BR-L2T-009` | 不变量 | 每个工具必须显式区分 capability-bound 与正式声明无需外部能力关联的语境,不得依靠空值、名称或默认行为推断。 | 外部能力关联分类 |
| `BR-L2T-010` | 不变量 | Capability binding 必须同时锚定本地稳定工具身份和上游正式 capability 引用。 | Tool-capability binding |
| `BR-L2T-011` | 边界约束 | `L2-tools` 只拥有 body-free binding relation,不拥有 capability identity、registry、descriptor、formal exposure 或 applicability truth。 | Tools / Capability Hub 边界 |
| `BR-L2T-012` | 治理约束 | Capability 可见性、formal exposure 或 applicability 不得被解释为 invocation authorization。 | Binding / authorization 边界 |
| `BR-L2T-013` | 禁止行为 | Binding 缺失、陈旧、冲突或不可验证时不得继续受影响的调用,也不得回退到本地 capability registry、allowlist 或字符串匹配。 | Binding 有效性 |
| `BR-L2T-014` | 显式变化 | Binding 的建立、替换、失效、重新验证和已知缺口必须显式发生并可追溯。 | Binding 生命周期 |
| `BR-L2T-015` | 禁止行为 | Binding 对账、索引和一致性任务不得创造、修正或替代上游 capability truth。 | Binding 维护行为 |
| `BR-L2T-016` | 不变量 | 每次 canonical invocation 必须锚定正式工具身份及其适用定义语境。 | Canonical invocation |
| `BR-L2T-017` | 不变量 | 不同调用方和 direct、adapter、sandbox 等承载方式必须消费同一调用、结果和错误语义。 | 调用方 / 承载语义 |
| `BR-L2T-018` | 边界约束 | 调用方只能在正式工具合同内表达调用目标和语境,不得以本地配置、私有 schema 或承载约定补造工具语义。 | 调用消费边界 |
| `BR-L2T-019` | 显式变化 | 调用受理、执行前拒绝和等待外部前置必须在真实执行前显式形成,不得依靠后续执行材料反推。 | 调用受理 / 无执行语境 |
| `BR-L2T-020` | 禁止行为 | 执行前拒绝或等待不得补造 Sandbox run、capture、failure 或任何已执行事实。 | 无执行终态 |
| `BR-L2T-021` | 显式变化 | 工具定义与 canonical invocation 语义的演进必须保持一致,差异和消费影响不得隐式进入调用主线。 | 定义 / 调用演进 |
| `BR-L2T-022` | 边界约束 | Action choice、agent loop、LLM planning、orchestration、retry / recovery 和 checkpoint truth 不属于本仓。 | Tools / Runtime 边界 |
| `BR-L2T-023` | 边界约束 | `L2-tools` 的执行要求判断不产生 authorization truth,只能说明调用还需承接哪些正式前置。 | 执行要求 / authorization 边界 |
| `BR-L2T-024` | 治理约束 | Governed 调用只能承接正式 authorization owner 提供的结果引用或允许的安全摘要。 | Governed 调用前置 |
| `BR-L2T-025` | 禁止行为 | Authorization 来源、有效性或结论缺失、冲突、陈旧或不可验证时必须 fail closed,不得由本仓自我批准。 | Authorization 消费 |
| `BR-L2T-026` | 禁止行为 | Sandbox-required 调用不得静默降级为宿主直跑、调用方本地执行或不满足正式隔离边界的承载。 | 隔离执行前置 |
| `BR-L2T-027` | 不变量 | 执行承载方式变化不得改变正式工具调用、结果或错误语义。 | 承载 / 工具语义边界 |
| `BR-L2T-028` | 边界约束 | `L2-tools` 不拥有 Sandbox environment、run、capture、failure、control、handoff、cleanup 或 recovery truth。 | Tools / Sandbox 边界 |
| `BR-L2T-029` | 审计约束 | 执行交接、返回执行材料、来源引用和已知缺口必须可回链,不得由无来源摘要替代。 | Execution handoff 追溯 |
| `BR-L2T-030` | 不变量 | Sandbox capture / failure 只能作为工具语义归一化来源,不能直接冒充 normalized result / error;转换必须保留来源和已知缺口。 | Execution material 消费 |
| `BR-L2T-031` | 边界约束 | 未闭口的 adapter mapping、receipt、dead-letter、investigation feedback 或 cleanup release 不得被声明为已存在或可执行。 | Sandbox 协作缺口 |
| `BR-L2T-032` | 不变量 | Normalized result / error 必须锚定 canonical invocation、正式定义语境和适用的可信来源。 | 工具语义 outcome |
| `BR-L2T-033` | 不变量 | 执行成功、工具失败、执行前拒绝、capture failure 和外部 handoff failure 必须保持可区分语义。 | 工具终态 / 外部失败分层 |
| `BR-L2T-034` | 边界约束 | Provider response、Sandbox capture、Bus delivery fact 或 Observability projection 均不得替代本地工具语义 outcome。 | 本地 / 外部 truth 边界 |
| `BR-L2T-035` | 不变量 | 本地 normalized outcome 与 Tool-domain audit 必须独立成立;外部 handoff 失败不得回滚或改写它们。 | Outcome / audit / handoff |
| `BR-L2T-036` | 审计约束 | Tool-domain audit 必须能够回链工具身份、定义语境、invocation、outcome 和适用来源引用。 | 工具域审计 |
| `BR-L2T-037` | 显式变化 | 工具域审计事实及其已知缺口不得被静默覆盖;审计追溯不得扩张为 observation store、delivery history 或 recovery truth。 | 审计变化与边界 |
| `BR-L2T-038` | 不变量 | 外部安全交接只能使用最小必要、body-free、已脱敏且可关联的材料。 | Safe handoff material |
| `BR-L2T-039` | 禁止行为 | Secret、credential、raw prompt、raw capture、provider body 和高敏完整引用不得进入 audit、Bus 或 Observability 交接材料;合同归一化只能产出符合 `BR-L2T-038` 的安全材料,不得使 raw body 获准外发。 | 敏感正文边界 |
| `BR-L2T-040` | 显式变化 | Bus / Observability 交接的准备、提交、降级和已知缺口必须显式表达,但不得驱动 Runtime retry / recovery。 | 外部交接状态 |
| `BR-L2T-041` | 边界约束 | Delivery、observation、query、diagnostic 或导出结果不得反写工具身份、定义、invocation、result、error 或 audit truth。 | 消费 / 观察 / 传递边界 |
| `BR-L2T-042` | 禁止行为 | 未经正式来源验证或尚未成立的实现、执行、交接、证据与验收事实不得作为工具域 truth 或审计事实进入本仓。 | 外部事实可信性 |
| `BR-L2T-E01` | 边界约束 | 搜索、批量维护、派生索引、诊断摘要、客户端说明和管理入口等外围增强只能消费核心 truth,不得反写核心 truth、扩张相邻 owner 或成为核心闭环成立前置。 | 外围增强能力 |

### 7.2 规则类型结论

| 规则类型 | 规则编号 |
|---|---|
| 不变量 | `BR-L2T-001~003`;`BR-L2T-009~010`;`BR-L2T-016~017`;`BR-L2T-027`;`BR-L2T-030`;`BR-L2T-032~033`;`BR-L2T-035`;`BR-L2T-038` |
| 禁止行为 | `BR-L2T-007`;`BR-L2T-013`;`BR-L2T-015`;`BR-L2T-020`;`BR-L2T-025~026`;`BR-L2T-039`;`BR-L2T-042` |
| 显式变化 | `BR-L2T-005~006`;`BR-L2T-014`;`BR-L2T-019`;`BR-L2T-021`;`BR-L2T-037`;`BR-L2T-040` |
| 边界约束 | `BR-L2T-004`;`BR-L2T-008`;`BR-L2T-011`;`BR-L2T-018`;`BR-L2T-022~023`;`BR-L2T-028`;`BR-L2T-031`;`BR-L2T-034`;`BR-L2T-041`;`BR-L2T-E01` |
| 治理约束 | `BR-L2T-012`;`BR-L2T-024` |
| 审计约束 | `BR-L2T-029`;`BR-L2T-036` |

### 7.3 规则与功能需求映射

| 功能需求 | 主要规则 | 映射说明 |
|---|---|---|
| `FR-L2T-001` | `BR-L2T-001`;`BR-L2T-005` | 保护稳定本地 identity 及其显式生命周期。 |
| `FR-L2T-002` | `BR-L2T-002~004`;`BR-L2T-007`;`BR-L2T-008` | 保护定义锚定、完整性、风险边界和只读消费。 |
| `FR-L2T-003` | `BR-L2T-005~007`;`BR-L2T-021` | 保护身份 / 定义变化显式且与调用语义一致。 |
| `FR-L2T-004` | `BR-L2T-009`;`BR-L2T-012` | 保护 bound / unbound 分类与 authorization 分层。 |
| `FR-L2T-005` | `BR-L2T-010~012`;`BR-L2T-014` | 保护 body-free binding、双锚点和显式变化。 |
| `FR-L2T-006` | `BR-L2T-013~015` | 保护失效处理和维护任务不补造外部 truth。 |
| `FR-L2T-007` | `BR-L2T-016`;`BR-L2T-018` | 保护 invocation 的正式合同锚点。 |
| `FR-L2T-008` | `BR-L2T-018~020` | 保护受理 / 拒绝显式且不伪造执行。 |
| `FR-L2T-009` | `BR-L2T-017`;`BR-L2T-021`;`BR-L2T-022`;`BR-L2T-027` | 保护跨调用方 / carrier 一致性及 Runtime 边界。 |
| `FR-L2T-010` | `BR-L2T-003`;`BR-L2T-004`;`BR-L2T-023` | 保护执行要求可解释且不产生授权。 |
| `FR-L2T-011` | `BR-L2T-024`;`BR-L2T-025` | 保护正式外部裁决消费和 fail-closed。 |
| `FR-L2T-012` | `BR-L2T-023`;`BR-L2T-025~027` | 保护条件化承载和隔离不可旁路。 |
| `FR-L2T-013` | `BR-L2T-028~031` | 保护 Sandbox truth 独立、材料可回链和开放缺口显式。 |
| `FR-L2T-014` | `BR-L2T-030`;`BR-L2T-032`;`BR-L2T-034` | 保护可信来源到唯一 normalized result 的语义边界。 |
| `FR-L2T-015` | `BR-L2T-019`;`BR-L2T-020`;`BR-L2T-025`;`BR-L2T-032~034` | 保护无执行、失败和外部降级可区分。 |
| `FR-L2T-016` | `BR-L2T-035~037`;`BR-L2T-039`;`BR-L2T-042` | 保护工具域审计独立、可追溯和可信。 |
| `FR-L2T-017` | `BR-L2T-035`;`BR-L2T-038~042` | 保护最小安全交接、降级分层和不反写真相。 |
| `FR-L2T-E01~E06` | `BR-L2T-007`;`BR-L2T-041`;`BR-L2T-E01` | 保护外围增强只读、可裁剪且不成为第二 truth。 |

### 7.4 能力级规则停审

| 节点 | 规则承接 | 停审结论 |
|---|---|---|
| `C-L2T-1` | `BR-L2T-001~008` | pass:identity、definition、演进、只读行为和库存 / 实现边界均已钉住。 |
| `C-L2T-2` | `BR-L2T-009~015` | pass:binding 分类、关系、Hub / authorization 分层和维护边界均已钉住。 |
| `C-L2T-3` | `BR-L2T-016~022` | pass:canonical invocation、受理 / 拒绝、carrier 一致性和 Runtime 边界均已钉住。 |
| `C-L2T-4` | `BR-L2T-023~031` | pass:authorization、isolation、Sandbox truth 与未闭口协议规则已固定;`L2T-UP-001~004` 约束保持开放。 |
| `C-L2T-5` | `BR-L2T-032~042` | pass:outcome、audit、safe handoff 和外部 truth 边界已固定;`L2T-UP-004~008` 约束保持开放。 |
| 外围增强 | `BR-L2T-007`;`BR-L2T-041`;`BR-L2T-E01` | pass:外围能力不反写、不扩权且不成为核心前置。 |

### 7.5 跨能力规则审计

| 检查项 | 结论 | 说明 |
|---|---|---|
| 孤儿规则 | 无 | 每条规则均保护至少一项 FR 或 Step 2 明确边界。 |
| 核心 FR 无规则承接 | 无 | `FR-L2T-001~017` 全部有主要规则映射。 |
| 外围 FR 无规则承接 | 无 | 6 项外围 FR 共同受只读和外围边界规则保护。 |
| 重复规则 | 无 | 相近规则分别保护不变量、显式变化、禁止行为、治理或 owner 边界。 |
| 规则冲突 | 无 | Fail-closed 只作用于受影响 governed / bound / sandbox-required 路径,不把场景依赖全局化。 |
| 相邻 owner 遗漏 | 未发现 | Runtime、Hub、authorization、Sandbox、Bus、Observability、SDK、provider 与库存均被覆盖。 |
| 实现机制混入 | 无 | 未写字段、状态编码、数据库、事务、API、事件名 / schema、异常码、handler 或 repository。 |
| 流程纪律混入 | 无 | Commit、测试结果、evidence alias 和签署仍由 calibration / 验收纪律约束,未冒充系统业务规则。 |

---

## 8. 回填草稿

> Step 17 应装配 §7.1 的固定四列表及一段规则类型说明。§7.3~7.5 作为追溯依据保留在 calibration,不重复塞入正式规则表。

正式章节应说明:规则按不变量、禁止行为、显式变化、边界约束、治理约束和审计约束收敛,用于保护稳定工具合同、受控 binding、canonical invocation、正式授权 / 隔离前置、normalized outcome / Tool-domain audit / safe handoff 不被相邻 truth 或外围能力反向定义。

---

## 9. 待确认事项

### 9.1 Blocker 判定

| Blocker | 是否阻塞 Step 10 | 规则承接 |
|---|---|---|
| `L2T-UP-001/002` | 否 | `BR-L2T-023~025` 固定分层、正式引用和 fail-closed;不定 owner/source matrix、taxonomy 或优先级。 |
| `L2T-UP-003/004` | 否 | `BR-L2T-026~031` 固定不可旁路、source ref 和不伪造未闭口协议。 |
| `L2T-UP-005~007` | 否 | `BR-L2T-035`;`BR-L2T-038~042` 固定本地 truth 与 safe handoff 分层;不定 producer / route / readiness。 |
| `L2T-UP-008` | 否 | 需求规则不声明 Core 已有 Tools-specific schema。 |
| `L2T-UP-009` | 否 | 外围规则禁止客户端说明扩张为现成 SDK client。 |

结论:未发现新增上游 blocker。开放 blocker 不阻塞 Step 10,但其受影响协议与后续实现 readiness 必须继续保持 blocked / fail-closed。

---

## 10. 进入下一步条件

### 10.1 自检

| 检查项 | 结果 |
|---|---|
| 每条规则是否有编号、类型、内容和约束对象 | pass |
| 核心四类规则及治理 / 审计扩展是否完整 | pass |
| 每条规则是否能回指 FR 或 Step 2 边界 | pass |
| 每项核心和外围 FR 是否有规则承接 | pass |
| 五节点是否逐一完成规则停审 | pass |
| 是否完成重复、冲突、遗漏和挂载审计 | pass |
| 是否未写字段、状态机、数据库、事务、接口、事件、异常码或实现校验 | pass |
| 是否未把上游 blocker 写成已闭口协议 | pass |
| 是否未把文档流程纪律冒充产品业务规则 | pass |
| 是否未修改正式 `00-需求文档.md` | pass |

### 10.2 模块状态

| 模块 | 状态 | gate_status |
|---|---|---|
| capability_rule_reasoning | done | pass |
| formal_business_rules | done | pass |
| fr_mapping_and_node_review | done | pass |
| cross_rule_and_boundary_audit | done | pass |

### 10.3 停审结论

```text
step_status = completed_stop_review
gate_status = pass
formal_section_write_allowed = false
next_allowed_action = create 00_req_step_11_data_ownership.md
commit_required = false
```
