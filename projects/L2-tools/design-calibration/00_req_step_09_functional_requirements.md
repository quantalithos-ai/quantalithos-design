# L2-tools 需求 Step 9:功能需求

> Step 状态: completed_stop_review
> 当前模式: full-restart
> 正式回填目标: `00-需求文档.md` §9
> 本步原则: 从 Step 7 的能力节点和 Step 8 的用户故事归并能力级功能需求;不按对象、CRUD、API 或 Command 拆分,不写字段、协议、事件、状态机或实现模块。

---

## 1. Step 状态与 Step 内计划

### 1.1 Step 状态

| 字段 | 值 |
|---|---|
| step | Step 9 |
| status | `completed_stop_review` |
| gate_status | `pass` |
| previous_step | Step 8 `用户故事` |
| current_module | `functional_requirements:completed` |
| next_allowed_action | 读取需求 SOP Step 10 与需求规范 §4.10,只创建 `00_req_step_10_business_rules_boundaries.md`。 |
| formal_write_status | `not_written` |
| blocker_status | `L2T-UP-001~009` 不阻塞能力级需求收敛;受影响的协议、来源和 route 仍不得定稿。 |

### 1.2 本步目标

按 `C-L2T-1 -> C-L2T-2 -> C-L2T-3 -> C-L2T-4 -> C-L2T-5` 逐节点把已确认故事归并为系统必须具备的业务能力,明确每项能力的输入、输出、触发和失败语境,并完成节点停审、故事覆盖和跨能力审计。

本步只固定“系统必须具备什么能力”,不回答能力由哪个模块实现、通过什么接口或事件交互、数据有哪些字段、状态如何迁移、指标阈值是多少或测试如何执行。

### 1.3 Step 内计划

| 序号 | 动作 | 状态 | 输出 / 门禁 |
|---:|---|---|---|
| 1 | 恢复 ledger / flow 与 Step 7 / 8 | done | 只允许创建 Step 9,正式 `00` 不可写。 |
| 2 | 读取 SOP Step 9、规范 §4.9 和参考产物 | done | 固定能力级粒度、表结构与停审要求。 |
| 3 | C-L2T-1 先思考再写入 | done | 3 项身份 / 定义能力,故事覆盖通过。 |
| 4 | C-L2T-2 先思考再写入 | done | 3 项外部关联能力,故事覆盖通过。 |
| 5 | C-L2T-3 先思考再写入 | done | 3 项规范调用能力,故事覆盖通过。 |
| 6 | C-L2T-4 先思考再写入 | done | 4 项执行前置 / 交接能力,故事覆盖通过。 |
| 7 | C-L2T-5 先思考再写入 | done | 4 项结果 / 错误 / 审计 / 交接能力,故事覆盖通过。 |
| 8 | 收敛外围增强与排除边界外候选 | done | 6 项外围增强单列;外仓 truth 和具体库存不进入核心表。 |
| 9 | 完成功能依赖、跨节点和 historical material 审计 | done | 条件路径不被误写为运行时调用链。 |
| 10 | 形成正式 §9 回填草稿、自检并停审 | done | 允许进入 Step 10;正式 `00` 仍不写。 |

---

## 2. 本步输入

| 输入 | 已读取结论 | 本步约束 |
|---|---|---|
| `00_req_step_07_core_capability_loop.md` | 五个能力节点及纯本地、capability-bound、执行前拒绝和 handoff 失败条件路径已固定。 | 功能必须先在节点内归并,不能先列全仓清单再贴标签。 |
| `00_req_step_08_user_stories.md` | 17 条核心故事和 6 条外围故事已停审通过。 | 每条核心故事必须至少有一项核心 FR 承接;外围故事不得成为核心闭环前置。 |
| 需求 SOP Step 9 | 要求逐节点回答输入、输出、触发、失败,并形成优先级、依赖和故事映射。 | 节点完成后先停审,不得按对象或实现动作拆分。 |
| 需求规范 §4.9 | 正式表固定为功能需求、能力类型、说明、核心能力映射、故事映射。 | 正式回填使用固定表结构,编号与名称合并写入“功能需求”列。 |
| 当前上游正式文档 | Hub、Sandbox、Bus、Observability、Core、SDK 的 truth 和消费边界已核对。 | 只写 L2 自有工具语义能力;外部协议缺口保留为 blocker,不得补造。 |
| 已完成项目 Step 9 | Capability Hub 展示逐节点完整停审粒度;Method Library 展示紧凑的能力归并和排除方式。 | 采用完整校准记录,不复制其它领域功能内容。 |
| README 与旧正式链 | 旧 registry、builtin、MCP、Sandbox、事件、extras 和历史存储只是功能线索。 | 独立结论形成后才做差异审计,不继承旧编号、优先级或实现口径。 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 当前讨论哪些核心能力节点? | 严格按 `C-L2T-1~5` 顺序逐节点归并,每个节点完成故事覆盖后停审。 |
| 系统必须提供哪些业务能力? | 共 17 项核心能力:身份 / 定义 3 项,外部关联 3 项,规范调用 3 项,执行前置 / 交接 4 项,结果 / 错误 / 审计 / 安全交接 4 项。 |
| 输入、输出、触发和失败如何表达? | 只使用需求级语义事实与条件,不展开字段、DTO、接口、事件、状态枚举、内部流程或技术组件。 |
| 哪些共同构成闭环核心? | `FR-L2T-001~017` 共同构成闭环;任一节点整体缺失都会使工具调用语义 truth 断裂。 |
| 哪些只是外围增强? | `FR-L2T-E01~E06` 只改善搜索、批量维护、派生索引、诊断摘要、客户端说明和管理体验。 |
| 是否都能回指用户故事? | 是。17 项核心 FR 均回指至少一条核心故事;6 项外围 FR 分别回指对应外围故事。 |
| 是否有故事没有功能承接? | 否。`US-L2T-001~017` 和 `US-L2T-E01~E06` 均有显式承接。 |
| 是否足以进入规则讨论? | 是。每项 FR 都有明确失败语境,可在 Step 10 转化为需求级不变量与禁止行为。 |

---

## 4. 当前文档问题诊断

### 4.1 C-L2T-1 稳定身份与完整定义

| 项 | 结论 |
|---|---|
| 故事输入 | `US-L2T-001~004`。 |
| 能力归并 | 稳定身份建立;正式定义表达与受控读取;定义演进、兼容与追溯。 |
| 拆分理由 | 身份能独立失败;定义完整性和可读性能独立失败;演进可解释性也能独立失败,三者不能合并为笼统“管理工具”。 |
| 排除 | 工具 CRUD、builtin 库存、schema 字段、实现注册表、发布命令和代码包。 |
| 节点判断 | 3 项 FR 共同承接建立、审查、消费和演进目标,足以进入规则讨论。 |

### 4.2 C-L2T-2 受控外部能力关联

| 项 | 结论 |
|---|---|
| 故事输入 | `US-L2T-005~007`。 |
| 能力归并 | 外部能力关联分类;body-free binding relation 建立;binding 校验、失效与变化追溯。 |
| 拆分理由 | bound / unbound 分类、关系建立和关系持续可验证是三个可独立失败的业务能力。 |
| 排除 | Hub registry / descriptor / exposure 正文、本地 capability allowlist、provider route / quota / cost / secret。 |
| 节点判断 | 3 项 FR 同时保护纯本地路径和 capability-bound 路径,不复制外部 capability truth。 |

### 4.3 C-L2T-3 统一规范调用语义

| 项 | 结论 |
|---|---|
| 故事输入 | `US-L2T-004`;`US-L2T-008~010`。 |
| 能力归并 | canonical invocation 语境形成;合同一致的受理与执行前拒绝;跨调用方和承载方式的统一语义。 |
| 拆分理由 | 调用语义形成、受理判断和跨 carrier 一致性分别可失败,但都必须锚定同一正式定义。 |
| 排除 | agent loop、LLM planning、动作选择、Runtime orchestration / retry / recovery / checkpoint、API 和 DTO。 |
| 节点判断 | 3 项 FR 形成调用消费合同,但不吸收 Runtime 主线或执行事实。 |

### 4.4 C-L2T-4 执行前置与条件化隔离交接

| 项 | 结论 |
|---|---|
| 故事输入 | `US-L2T-010~013`。 |
| 能力归并 | 执行要求判断;正式 authorization 结果承接;条件化承载与隔离不可旁路;Sandbox 交接和执行材料语义消费。 |
| 拆分理由 | 工具固有要求、外部裁决消费、承载约束和 execution material 解释的 owner / 失败边界不同。 |
| 排除 | 本仓 self-authorization、allow / deny 算法、policy source matrix、Sandbox run / capture / cleanup 管理和宿主降级。 |
| 节点判断 | 4 项 FR 足以固定 fail-closed 和隔离不可旁路方向;`L2T-UP-001~004` 继续阻塞协议定稿。 |

### 4.5 C-L2T-5 Outcome、工具域审计与安全交接

| 项 | 结论 |
|---|---|
| 故事输入 | `US-L2T-012~017`。 |
| 能力归并 | normalized result;normalized error 与无执行终态;Tool-domain audit;安全外部交接与降级显式化。 |
| 拆分理由 | 成功结果、失败 / 拒绝、工具域追溯和外部材料交接具有不同消费目标与失败边界。 |
| 排除 | Sandbox capture 副本、Bus delivery truth、Observability store / projection / retention、事件名 / route、Runtime recovery。 |
| 节点判断 | 4 项 FR 闭合本地工具语义 truth;外部 handoff 失败只形成独立降级,不得改写本地终态。 |

---

## 5. 改动前后对比

### 5.1 Historical material 后置审计

| 旧材料线索 | 当前处理 |
|---|---|
| 旧 `F-001~010` registry / builtin / MCP / sandbox / event / extras 清单 | 不继承编号或范围;仅将“统一合同、受控执行和结果语义”问题线索归并到当前 17 项核心 FR。 |
| `ToolDefinition`、`ToolInvocation`、`ToolResult` 旧字段 | 只保留需求级语义名称;字段、schema、错误码和存储口径后移正式设计。 |
| Python 同进程包与 Rust RPC / HTTP 服务 | 两套技术形态互相冲突,均不能进入功能需求。 |
| Hub allowlist / 本地 registry | 与当前 Hub truth owner 冲突,明确排除。 |
| Sandbox 执行、capture 和 replay | 只保留执行接缝与材料消费能力;run / capture / replay truth 不归本仓。 |
| 三类旧事件和 Observability 写入 | 不继承事件名、producer、schema 或 route;只保留 safe material handoff 能力。 |
| P0 / P1、SLA、100% 和测试 / 验收结论 | 无当前 authority,不进入功能需求或成立证据。 |

---

## 6. 设计取舍

### 6.1 外围增强取舍

外围增强故事均有真实角色价值,因此保留为外围 FR;但它们不能代替正式定义、规范调用或 outcome 成立,也不能作为核心验收通过前置。管理入口和客户端说明只表达消费体验,不承诺 UI、SDK client、API 或语言包。

---

## 7. 结构化中间产物

### 7.1 核心功能需求表

| 功能需求 | 能力类型 | 说明 | 支撑的核心能力闭环 | 对应的用户故事 |
|---|---|---|---|---|
| `FR-L2T-001` 稳定工具身份建立 | 核心闭环能力 | 系统必须让正式工具以不依赖显示名、具体实现、库存或外部 capability identity 的稳定本地身份成立,为定义、调用和追溯提供唯一语义锚点。 | `C-L2T-1` | `US-L2T-001`;`US-L2T-004` |
| `FR-L2T-002` 正式工具定义表达与受控读取 | 核心闭环能力 | 系统必须围绕稳定身份表达完整、可解释且可被受控消费的正式工具定义,使维护者、审查者和调用方理解同一合同。 | `C-L2T-1` | `US-L2T-001`;`US-L2T-003`;`US-L2T-004` |
| `FR-L2T-003` 定义演进、兼容与追溯 | 核心闭环能力 | 系统必须让工具调整、兼容影响和退役显式可解释,使新旧语义与既有引用不会因实现变化而静默漂移。 | `C-L2T-1` | `US-L2T-002`;`US-L2T-009` |
| `FR-L2T-004` 外部能力关联分类 | 核心闭环能力 | 系统必须显式区分 capability-bound 工具与正式声明无需外部关联的工具,避免以含糊字符串或一刀切前置推断关联。 | `C-L2T-2` | `US-L2T-005` |
| `FR-L2T-005` 受控 capability binding 建立 | 核心闭环能力 | 系统必须在稳定本地工具身份与外部正式 capability 引用之间建立 body-free 关联关系,且不复制外部定义、暴露或适用性正文。 | `C-L2T-2` | `US-L2T-005`;`US-L2T-006` |
| `FR-L2T-006` Binding 校验、失效与变化追溯 | 核心闭环能力 | 系统必须识别 binding 的可验证、陈旧、失效、冲突或不可验证语境,并显式表达本地关系变化而不补造外部 truth。 | `C-L2T-2` | `US-L2T-006`;`US-L2T-007` |
| `FR-L2T-007` Canonical invocation 语境形成 | 核心闭环能力 | 系统必须把正式定义引用、合同内调用目标和安全调用语境收敛为唯一规范工具调用语义,供不同调用方一致消费。 | `C-L2T-3` | `US-L2T-004`;`US-L2T-008` |
| `FR-L2T-008` 合同一致的调用受理与执行前拒绝 | 核心闭环能力 | 系统必须依据正式工具合同形成显式受理或无执行拒绝语义,不得让不可解释输入、失效定义或未满足前置静默进入执行。 | `C-L2T-3` | `US-L2T-008`;`US-L2T-012` |
| `FR-L2T-009` 跨调用方与承载方式统一调用语义 | 核心闭环能力 | 系统必须让调用方和执行协作方承接同一调用及终态语义,不得因 direct、adapter 或隔离承载方式产生第二套工具合同。 | `C-L2T-3` | `US-L2T-009`;`US-L2T-010` |
| `FR-L2T-010` 执行要求判断 | 核心闭环能力 | 系统必须基于正式定义、规范调用和适用关联形成工具域执行要求判断,并明确其不等同于 effective authorization。 | `C-L2T-4` | `US-L2T-003`;`US-L2T-011` |
| `FR-L2T-011` 正式 authorization 结果承接与 fail-closed | 核心闭环能力 | 系统必须承接正式外部 authorization 结果的安全引用或摘要;来源、有效性或结论缺失、冲突、陈旧或不可验证时必须保守拒绝。 | `C-L2T-4` | `US-L2T-011`;`US-L2T-012` |
| `FR-L2T-012` 条件化执行承载与隔离不可旁路 | 核心闭环能力 | 系统必须在前置成立后表达适用的执行承载要求;需要隔离时不得宿主直跑或静默降级,承载变化不得改变工具合同。 | `C-L2T-4` | `US-L2T-010`;`US-L2T-011`;`US-L2T-013` |
| `FR-L2T-013` Sandbox 交接与执行材料语义消费 | 核心闭环能力 | 系统必须把规范调用交接到正式隔离执行边界并消费可信执行材料引用,以支持工具语义解释而不拥有 run、capture、failure、handoff 或 cleanup truth。 | `C-L2T-4` | `US-L2T-010`;`US-L2T-013` |
| `FR-L2T-014` Normalized tool result 形成 | 核心闭环能力 | 系统必须把规范调用与可信执行材料解释为唯一工具语义成功结果,不得直接把 capture、provider response、传递记录或观察投影当成本地结果。 | `C-L2T-5` | `US-L2T-013`;`US-L2T-014` |
| `FR-L2T-015` Normalized error 与无执行终态形成 | 核心闭环能力 | 系统必须形成可区分的工具失败、执行前拒绝、执行材料失败和交接降级语义,使未执行行动不会被伪装为真实执行。 | `C-L2T-5` | `US-L2T-012`;`US-L2T-014`;`US-L2T-016` |
| `FR-L2T-016` Tool-domain audit 追溯 | 核心闭环能力 | 系统必须让工具身份、正式定义、规范调用、结果或错误与来源引用形成工具域可追溯事实,同时不扩张为观察存储。 | `C-L2T-5` | `US-L2T-015`;`US-L2T-016` |
| `FR-L2T-017` 安全外部交接与降级显式化 | 核心闭环能力 | 系统必须从已成立的本地 truth 形成去正文、脱敏、可关联的安全材料,并把外部交接失败作为独立降级显式化而不回滚或改写本地终态。 | `C-L2T-5` | `US-L2T-016`;`US-L2T-017` |

### 7.2 能力级输入、输出、触发与失败语境

| 功能需求 | 能力级输入 | 能力级输出 | 触发条件 | 必须显式的失败语境 |
|---|---|---|---|---|
| `FR-L2T-001` | 正式工具维护语境与身份来源 | 可稳定引用的本地 tool identity | 新工具进入正式合同语境或身份需校准 | 来源冲突、身份歧义、以名称 / 实现 / 外部 identity 猜测身份 |
| `FR-L2T-002` | 稳定身份与工具语义定义 | 可被一致理解和受控读取的正式合同 | 定义建立、审查或消费 | 定义不完整、语义冲突、owner 或正文边界不清 |
| `FR-L2T-003` | 正式定义变更、退役或兼容评估语境 | 显式演进结论、兼容影响与追溯语境 | 正式合同发生或拟发生变化 | 静默破坏、旧新语义不可区分、既有引用影响不可解释 |
| `FR-L2T-004` | 正式工具定义与外部关联声明 | capability-bound 或明确 unbound 的分类结论 | 定义建立、变化或调用前适用性检查 | 关联要求含糊、所有工具被强制绑定、以字符串猜测 |
| `FR-L2T-005` | 稳定工具身份与 Hub 正式引用 / controlled safe view | L2 自有 body-free binding relation | capability-bound 工具建立或替换关联 | 外部引用不存在、不正式、与工具定义不一致或要求复制正文 |
| `FR-L2T-006` | Binding、本地关系语境与外部变化线索 | 可用、stale、失效、冲突或不可验证的显式结论 | 定期维护、外部变化或调用前校验 | 无法验证仍继续调用、回退本地 registry、把缓存当 authority |
| `FR-L2T-007` | 正式定义引用、调用方安全语境与合同内目标 | canonical `ToolInvocation` 语义事实 | 调用方请求表达工具行动 | 工具无法解析、合同锚点缺失、语境不可安全表达 |
| `FR-L2T-008` | Canonical invocation 与正式定义约束 | 显式受理或 no-execution rejection | 规范调用进入合同校验语境 | 输入不可解释、定义不适用、关联或合同前置不成立 |
| `FR-L2T-009` | 正式调用合同与受理 / 终态语义 | 跨调用方和 carrier 一致的消费语义 | 新调用方或承载方式接入、合同演进 | 调用方、adapter 或 carrier 自建第二套请求 / 结果 / 错误语义 |
| `FR-L2T-010` | Invocation、正式定义、适用 binding 与风险声明 | 工具域执行要求结论 | 调用受理后进入执行前置判断 | 要求缺失、冲突或无法安全判断;误把要求当授权 |
| `FR-L2T-011` | 正式 authorization 结果引用或安全摘要 | 前置满足或保守拒绝结论 | Governed 调用进入执行前检查 | owner、来源、有效性或结论冲突、陈旧、缺失或不可验证 |
| `FR-L2T-012` | 已满足前置与工具域承载要求 | direct / adapter / sandbox-required 等需求级承载结论 | 调用满足适用授权和执行前置 | 所需承载不可用、限制无法落实、隔离要求被宿主降级 |
| `FR-L2T-013` | Canonical invocation、正式交接语境和执行材料引用 | 可供工具结果归一化的可信来源语境 | sandbox-required 调用交接或执行材料返回 | adapter mapping、capture、failure、handoff 或来源引用缺失 / 冲突 |
| `FR-L2T-014` | Invocation 与可信成功执行材料 | 唯一 normalized tool result | 真实执行形成可解释成功材料 | capture 不完整、来源冲突、无法完成工具语义映射 |
| `FR-L2T-015` | 拒绝、工具失败、执行失败或交接失败语境 | 可区分的 normalized error / no-execution outcome / handoff degradation | 调用未成功形成结果或在执行前收束 | transport、Sandbox 或观察失败被冒充工具失败;虚构 run / capture |
| `FR-L2T-016` | Identity、definition、invocation、outcome 与可信来源引用 | `ToolAuditEntry` 工具域语义事实 | 合同变化、调用受理或终态形成 | 关键来源不可回链、正文 / secret 越界、审计变成观察存储 |
| `FR-L2T-017` | 已成立本地 truth 与安全材料约束 | Body-free / redacted safe material 与独立交接状态 | 外部事件或观察协作需要工具域材料 | route 不存在、交接失败、材料不可安全表达;失败反写本地结果 |

### 7.3 外围增强功能需求表

| 功能需求 | 能力类型 | 说明 | 支撑的核心能力闭环 | 对应的用户故事 |
|---|---|---|---|---|
| `FR-L2T-E01` 工具契约搜索、浏览与比较 | 外围增强能力 | 系统可以提供只读搜索、浏览和差异理解语境,但其结果不得反写正式合同。 | 外围增强:契约搜索 / 浏览 / diff | `US-L2T-E01` |
| `FR-L2T-E02` 批量维护与兼容提示 | 外围增强能力 | 系统可以辅助批量维护和兼容影响识别,但不能替代逐项正式演进结论。 | 外围增强:批量维护 / 兼容提示 | `US-L2T-E02` |
| `FR-L2T-E03` 派生索引与一致性报告 | 外围增强能力 | 系统可以维护可重建的派生索引和一致性报告,但不得把快照或报告升级为 truth。 | 外围增强:派生索引 / 一致性检查 | `US-L2T-E03` |
| `FR-L2T-E04` 只读诊断与审计摘要 | 外围增强能力 | 系统可以提供更友好的只读诊断和审计摘要,但不拥有观察存储或恢复编排。 | 外围增强:只读诊断 / 审计摘要 | `US-L2T-E04` |
| `FR-L2T-E05` 客户端消费说明 | 外围增强能力 | 系统可以提供与正式合同一致的消费说明和示例语义,但不实现 SDK client 或语言包。 | 外围增强:客户端消费说明 | `US-L2T-E05` |
| `FR-L2T-E06` 契约管理入口 | 外围增强能力 | 系统可以提供更高效的管理入口,但不在需求阶段固定 UI、CRUD、API 或部署形态。 | 外围增强:管理入口 | `US-L2T-E06` |

### 7.4 能力级功能停审

| 节点 | 核心功能承接 | 核心故事承接 | 停审结论 |
|---|---|---|---|
| `C-L2T-1` | `FR-L2T-001`;`FR-L2T-002`;`FR-L2T-003` | `US-L2T-001`;`US-L2T-002`;`US-L2T-003`;`US-L2T-004`;`US-L2T-009` | pass:身份、完整定义、受控读取和演进均有独立能力承接。 |
| `C-L2T-2` | `FR-L2T-004`;`FR-L2T-005`;`FR-L2T-006` | `US-L2T-005`;`US-L2T-006`;`US-L2T-007` | pass:分类、关系建立和持续校验闭合,未复制 Hub truth。 |
| `C-L2T-3` | `FR-L2T-007`;`FR-L2T-008`;`FR-L2T-009` | `US-L2T-004`;`US-L2T-008`;`US-L2T-009`;`US-L2T-010`;`US-L2T-012` | pass:调用形成、受理 / 拒绝和跨 carrier 一致性闭合,未吸收 Runtime。 |
| `C-L2T-4` | `FR-L2T-010`;`FR-L2T-011`;`FR-L2T-012`;`FR-L2T-013` | `US-L2T-003`;`US-L2T-010`;`US-L2T-011`;`US-L2T-012`;`US-L2T-013` | pass:`L2T-UP-001~004` 约束保持开放,不阻塞需求级能力。 |
| `C-L2T-5` | `FR-L2T-014`;`FR-L2T-015`;`FR-L2T-016`;`FR-L2T-017` | `US-L2T-012`;`US-L2T-013`;`US-L2T-014`;`US-L2T-015`;`US-L2T-016`;`US-L2T-017` | pass:`L2T-UP-004~007` 约束保持开放,不伪造交接 route 或 readiness。 |

### 7.5 功能必要性与依赖结论

| 分类 | 结论 |
|---|---|
| 核心必要性 | `FR-L2T-001~017` 均为当前仓成立所需的核心闭环能力,不使用 P0 / P1 代替能力类型。 |
| 外围必要性 | `FR-L2T-E01~E06` 为外围增强,可以后续裁剪,不得成为核心闭环成立条件。 |
| 逻辑依赖 | C-L2T-1 的身份 / 定义是后续语义锚点;C-L2T-2 只在 capability-bound 路径生效;C-L2T-3 为执行与无执行终态提供 invocation 锚点;C-L2T-4 只在适用执行路径承接前置和执行材料;C-L2T-5 收口结果、错误、审计和 handoff。 |
| 非依赖含义 | 上述依赖不表示每次调用时序、接口调用、事件传播、事务顺序、开发优先级或部署拓扑。 |

### 7.6 核心故事覆盖审计

| 核心故事 | 功能承接 |
|---|---|
| `US-L2T-001` | `FR-L2T-001`;`FR-L2T-002` |
| `US-L2T-002` | `FR-L2T-003` |
| `US-L2T-003` | `FR-L2T-002`;`FR-L2T-010` |
| `US-L2T-004` | `FR-L2T-001`;`FR-L2T-002`;`FR-L2T-007` |
| `US-L2T-005` | `FR-L2T-004`;`FR-L2T-005` |
| `US-L2T-006` | `FR-L2T-005`;`FR-L2T-006` |
| `US-L2T-007` | `FR-L2T-006` |
| `US-L2T-008` | `FR-L2T-007`;`FR-L2T-008` |
| `US-L2T-009` | `FR-L2T-003`;`FR-L2T-009` |
| `US-L2T-010` | `FR-L2T-009`;`FR-L2T-012`;`FR-L2T-013` |
| `US-L2T-011` | `FR-L2T-010`;`FR-L2T-011`;`FR-L2T-012` |
| `US-L2T-012` | `FR-L2T-008`;`FR-L2T-011`;`FR-L2T-015` |
| `US-L2T-013` | `FR-L2T-012`;`FR-L2T-013`;`FR-L2T-014` |
| `US-L2T-014` | `FR-L2T-014`;`FR-L2T-015` |
| `US-L2T-015` | `FR-L2T-016` |
| `US-L2T-016` | `FR-L2T-015`;`FR-L2T-016`;`FR-L2T-017` |
| `US-L2T-017` | `FR-L2T-017` |

### 7.7 边界外功能候选排除表

| 功能候选 | 排除原因 | 正确 owner / 处理 |
|---|---|---|
| Agent loop、工具选择、planning、orchestration、retry / recovery / checkpoint | 是行动选择与运行主线,不属于工具合同 truth。 | `L2-runtime`。 |
| Capability / provider registry、descriptor、exposure / applicability 管理 | 外部能力接入 truth 不归本仓。 | `L3-capability-hub` 或正式外部 owner。 |
| Effective authorization、approval、Policy 决策与 allowlist | 本仓只声明工具执行要求并消费正式结论。 | 正式 governance / authorization owner。 |
| 隔离环境、run、capture、failure、handoff、cleanup 管理 | 本仓只消费正式执行材料引用。 | `L4-sandbox`。 |
| Publish、delivery、ack、retry、DLQ、replay 管理 | 传递 truth 不归本仓。 | `L0-bus`。 |
| Log / metric / trace 存储、projection、retention、alert | 工具域审计不等于观察存储。 | `L4-observability`。 |
| 多语言客户端生成与 SDK 方法 | 本仓只提供可消费服务端合同。 | `L0-sdk`。 |
| Builtin、MCP Client、Role extras、member-images、marketplace listing | 具体库存、适配和装配不定义本仓存在性。 | 对应产品 / 适配 / 分发 owner。 |
| Provider endpoint、route、quota、cost 和 secret 管理 | 属于外部接入、运行、安全或财务 truth。 | 对应正式 owner。 |

---

## 8. 回填草稿

> Step 17 应装配 §7.1 和 §7.3 的固定结构表,并保留核心 / 外围分层。当前不得修改正式 `00-需求文档.md`。

正式章节不得装入 §7.2 的详细思考表、historical material、blocker 过程或实现术语;这些内容保留在 calibration 产物供审计。所有核心 FR 必须保留明确的 `C-L2T-*` 和 `US-L2T-*` 映射。

---

## 9. 待确认事项

### 9.1 Blocker 判定

| Blocker | 是否阻塞 Step 9 | 当前约束 |
|---|---|---|
| `L2T-UP-001/002` authorization owner / source / taxonomy | 否 | `FR-L2T-010/011` 只固定执行要求和正式结果消费;不得定稿 owner 矩阵、风险分类或来源优先级。 |
| `L2T-UP-003/004` Sandbox mapping / handoff | 否 | `FR-L2T-012/013/015` 只固定能力和 fail-closed;不得声称字段映射、receipt、dead-letter、cleanup route 已闭合。 |
| `L2T-UP-005~007` Observability / workspace baseline | 否 | `FR-L2T-017` 只固定 safe material 和独立降级;不得私造 producer / source、route、readiness 或 immutable baseline。 |
| `L2T-UP-008` Core tools-specific schema | 否 | 当前只引用共享契约类别候选,不得声称 Core 已提供 Tools-specific schema。 |
| `L2T-UP-009` SDK tools client seam | 否 | `FR-L2T-E05` 仅为说明增强,不得承诺现成 SDK client。 |

结论:未发现 `L2T-UP-001~009` 之外的新上游 blocker;既有 blocker 不阻塞 Step 9,但继续约束 Step 10 / 12 / 15 及后续设计门禁。

---

## 10. 进入下一步条件

### 10.1 自检

| 检查项 | 结果 |
|---|---|
| 是否按五节点先思考再归并,未事后贴标签 | pass |
| 每项核心 FR 是否有编号、能力类型、说明和双重映射 | pass |
| 每项 FR 是否具有能力级输入、输出、触发和失败语境 | pass |
| `US-L2T-001~017` 是否全部被核心 FR 承接 | pass |
| 外围增强是否单列且未压过核心闭环 | pass |
| 是否避免对象 / CRUD / API / Command / 内部函数拆分 | pass |
| 是否未写字段、DTO、事件、状态机、模块、事务或部署形态 | pass |
| 是否排除 Runtime、Hub、authorization、Sandbox、Bus、Observability、SDK 和具体库存 truth | pass |
| 是否未关闭开放 blocker 或伪造协议、实现、测试、evidence / 验收事实 | pass |
| 是否未修改正式 `00-需求文档.md` | pass |

### 10.2 模块状态

| 模块 | 状态 | gate_status |
|---|---|---|
| capability_level_reasoning | done | pass |
| core_functional_requirements | done | pass |
| enhancement_and_exclusion | done | pass |
| story_coverage_and_cross_audit | done | pass |

### 10.3 停审结论

```text
step_status = completed_stop_review
gate_status = pass
formal_section_write_allowed = false
next_allowed_action = create 00_req_step_10_business_rules_boundaries.md
commit_required = false
```
