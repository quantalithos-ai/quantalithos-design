# L2-tools 需求 Step 14:验收标准

> Step 状态: completed_stop_review
> 当前模式: full-restart
> 正式回填目标: `00-需求文档.md` §14
> 本步原则: 只把已确认核心能力、功能、规则、数据归属和非功能要求转成需求层通过条件与一票否决项;不写测试脚本、测试步骤、接口调用、CI、监控实现、测试数据、真实 evidence、验收签署或实施结果。

---

## 1. Step 状态与 Step 内计划

### 1.1 Step 状态

| 字段 | 值 |
|---|---|
| step | Step 14 |
| status | `completed_stop_review` |
| gate_status | `pass` |
| previous_step | Step 13 `非功能需求` |
| current_module | `acceptance_criteria:completed` |
| next_allowed_action | 读取 Step 1~14、需求 SOP Step 15 与需求规范 §4.15,只创建 `00_req_step_15_risks_open_questions.md`。 |
| formal_write_status | `not_written` |
| blocker_status | 需求级验收条件可收敛;`L2T-UP-001~009` 仍开放,不得因定义验收条件而宣称受影响协议、route、schema、client、量化目标或 readiness 已通过。 |

### 1.2 本步目标

将 `C-L2T-1~5`、`FR-L2T-001~017`、`FR-L2T-E01~E06`、`BR-L2T-001~042`、`BR-L2T-E01`、`DR-L2T-001~034` 和 `NFR-L2T-001~019` 收敛为可判断的需求层验收条件。验收按核心能力闭环、功能能力、规则 / 边界、数据归属、非功能五类组织;一票否决只覆盖核心闭环断裂、truth owner 失效、边界打穿或质量硬底线失守。

本文件中的 `pass` 表示“验收定义覆盖门禁通过”,不是实现、测试或实际验收已经通过。任何 AC / VF 都不得被解释为真实运行证据或签署事实。

### 1.3 Step 内计划

| 序号 | 动作 | 状态 | 输出 / 门禁 |
|---:|---|---|---|
| 1 | 恢复 ledger / flow 与 Step 7 / 9~13 | done | 确认只允许 Step 14,正式 `00` 不可写。 |
| 2 | 读取 SOP Step 14、规范 §4.14 和参考项目 | done | 固定五类验收、一票否决和需求级表达。 |
| 3 | 按 `C-L2T-1~5` 收敛闭环 AC | done | 五个节点各有共同成立条件。 |
| 4 | 为 17 项核心 FR 逐条收敛 AC | done | 无核心 FR 被范围摘要替代。 |
| 5 | 收敛外围增强共同 AC | done | 六项外围不阻塞核心且不反写真相。 |
| 6 | 按六类规则、四类数据和六类 NFR 收敛 AC | done | 规则 / 数据 / 质量底线完整覆盖。 |
| 7 | 收敛 13 项一票否决 | done | 只覆盖核心失效与硬边界破坏,不把一般缺陷升级为整体否决。 |
| 8 | 做来源映射、节点停审和跨能力审计 | done | 无孤儿 AC、无未承接核心 FR / 硬规则 / 数据类别 / NFR。 |
| 9 | Historical material、blocker、自检并停审 | done | 无测试结果或 blocker 伪闭口;允许进入 Step 15。 |
| 10 | Step 17 依赖术语受控回退复核 | done | `VF-L2T-012` 精确区分当前项目依赖、pending / future 记录与具体 contract / seam 开放状态;AC / VF 编号和数量不变。 |

---

## 2. 本步输入

### 2.1 输入与读取结论

| 输入 | 已读取结论 | 本步约束 |
|---|---|---|
| Step 7 | 五个能力节点和六条条件路径已固定。 | 先验收五节点共同成立,同时避免把逻辑闭环误写为每次调用时序。 |
| Step 9 | 17 项核心 FR 与 6 项外围 FR 已固定。 | 17 项核心 FR 各有独立 AC;外围增强用共同 AC 约束不阻塞、不反写。 |
| Step 10 | 42 项核心规则、1 项外围规则和六类规则类型已固定。 | 六类规则各有 AC,关键禁止和 owner 边界同时进入 VF。 |
| Step 11 | 34 项数据已分为 16 truth、7 snapshot、6 ref、5 forbidden body。 | 四类数据各有独立 AC,forbidden body 失守进入 VF。 |
| Step 12 | 能力接口和依赖边界已固定:`DB-L2T-001~002`、`DB-L2T-004~007` 为当前依赖,`DB-L2T-003` pending,`DB-L2T-008` future / excluded;Core schema、Observability route 与 SDK client seam 仍开放。 | 接口 / 依赖进入跨能力审计与 VF,不另造第六类验收,不把开放的具体 contract / seam 宣称为已存在。 |
| Step 13 | 19 项 NFR 按六类收敛,没有获授权硬数字。 | 六类 NFR 各有独立 AC;不把历史百分比、SLA、时延或回放率恢复为验收阈值。 |
| SOP Step 14 / 规范 §4.14 | 验收项写“验什么”,条件写“怎样算通过”,并列一票否决项。 | 不写 Given-When-Then、脚本、工具、数据准备、接口步骤或真实结果。 |
| 上游正式文档与 blocker 台账 | Owner 边界可供需求验收,正向 seam 仍有开放缺口。 | 验“开放时必须如何保守收束”,不验未存在协议已经成功交付。 |

---

## 3. SOP 问题回答

### 3.1 核心能力闭环怎样算成立

| 节点 | 验收判断 |
|---|---|
| `C-L2T-1` | 稳定本地 tool identity、完整正式定义和显式演进共同成立,且身份不由名称、实现、库存、SDK 包装、provider 或 capability identity 替代。 |
| `C-L2T-2` | Capability-bound / unbound 分类、body-free binding、关系校验和缺口追溯成立,且不复制 Hub registry / descriptor / exposure / applicability truth。 |
| `C-L2T-3` | Canonical invocation、合同一致受理 / 拒绝和跨 caller / carrier 单一语义成立,且不吸收 Runtime orchestration 或 raw request 正文。 |
| `C-L2T-4` | 执行要求、正式 authorization 结果消费、fail-closed、条件化承载和 Sandbox truth 分层成立;适用隔离不可旁路。 |
| `C-L2T-5` | Normalized result / error、无执行终态、Tool-domain audit、安全交接与外部降级分层成立;外部失败不改写本地 truth。 |

### 3.2 功能怎样算完成

`FR-L2T-001~017` 必须分别满足 `AC-L2T-006~022`,不能用“五个能力主题基本完成”替代逐条判断。`FR-L2T-E01~E06` 不构成核心通过前置;若提供外围能力,必须满足 `AC-L2T-023` 的只读 / 受控变更、可裁剪和不反写边界。

### 3.3 规则与边界怎样算没有串线

不变量、禁止行为、显式变化、边界约束、治理约束、审计约束六类必须分别成立。特别是 capability visibility 不得成为 authorization、sandbox-required 不得宿主直跑、capture / provider / delivery / observation 不得替代本地 outcome、safe material 必须满足严格合取门禁、外部交接不得驱动 Runtime retry / recovery。

### 3.4 数据归属怎样算正确

L2 自有 truth、消费时点 snapshot、外部 ref 和 forbidden body 四类必须保持 owner 与生命周期分层。Truth ownership 不自动等于长期保存全部内容;但 raw prompt、caller / transport body、raw capture、provider body、secret、Bus history、Observability store 和 evidence 正文无论是否加密或“归一化”都不得进入本仓生命周期。

### 3.5 非功能怎样算达标

性能、可用性、安全、审计 / 可追溯、幂等 / 一致性、可观测性六类都按 Step 13 的判断口径验收。当前只判断核心不受外围或外部交接阻塞、条件依赖保守收束、owner 和正文边界、完整回链、重复输入 / carrier 单义、关键状态 / 缺口可识别;不伪造数字阈值。

### 3.6 哪些失败属于一票否决

核心能力任一节点不能成立、相邻 owner truth 被吸收、自我授权或隔离旁路、raw body 泄漏、虚构执行、outcome 被外部材料替代、本地终态被外部失败反写、关键来源不可追溯、依赖裁剪失效、historical material 或开放 blocker 被伪装为当前事实时,整份需求不应判定为通过。

---

## 4. 当前文档问题诊断

### 4.1 Historical material 问题诊断

| 旧验收线索 | 问题 | 当前处理 |
|---|---|---|
| Given-When-Then、接口名、执行方式 | 混入测试步骤、协议和旧对象。 | 重写为需求层“对象 / 能力 / 边界 + 通过条件”。 |
| Tool schema / 三类事件 / extras / 外部 MCP 覆盖率 `100%` | 依赖旧 inventory、event 和产品装配,无当前 denominator / evidence。 | 不继承;保留定义完整、追溯和外围可裁剪的判断口径。 |
| Sandbox / Hub / Runtime / Observability SLA | 把外部 owner uptime 变成本仓验收。 | 只验依赖失效时 L2 的适用路径 fail-closed / degradation 行为。 |
| Replay / rebuild / recovery `100%` | 吸收 Runtime、Bus、Observability 恢复 truth。 | 排除;只验本地 outcome / audit 不被反写。 |
| `100ms / 200ms / 300ms`、P95 / QPS / `30s` | 绑定旧接口、Policy 和无测量 authority 数字。 | 不作为当前 AC 或 VF。 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 当前校准后 |
|---|---|---|
| 验收表达 | Given-When-Then、接口步骤与旧实现对象混入需求 | 只定义“验什么、怎样算通过”,测试步骤后移。 |
| 覆盖粒度 | 旧覆盖率 / SLA 或少量主题验收替代逐项需求 | 五类 AC 完整承接五节点、17 核心 FR、外围边界、六类规则、四类数据和六类 NFR。 |
| 否决边界 | 一般缺口、开放 seam 与严重边界失守可能混写 | VF 只覆盖核心闭环断裂、owner 失效、越权、正文泄漏和质量硬底线。 |

---

## 6. 设计取舍

### 6.1 验收骨架取舍

| 方案 | 内容 | 结论 |
|---|---|---|
| A | 沿用旧用例和量化门禁 | 不采用:边界、编号和事实 authority 已失效。 |
| B | 五类 AC + 独立 VF + 来源映射 | 采用:完整承接 Step 7 / 9 / 10 / 11 / 13。 |
| C | 只写五个闭环 AC | 不采用:会遗漏 17 项核心功能和规则 / 数据 / NFR 粒度。 |
| D | 把接口 / 依赖设为第六类 AC | 不采用:违反规范固定五类;Step 12 由规则、VF 和跨能力审计承接。 |

### 6.2 一票否决取舍

一票否决不承载外围体验不足、具体指标尚未定稿、测试脚本未写、开放 seam 仍待设计等一般缺口。它只承载“即使其它项成立,仍不能认为本仓需求边界成立”的严重失败。开放 blocker 本身不是否决;伪称 blocker 已闭口、据此允许越界或伪造 readiness 才是严重点。

---

## 7. 结构化中间产物

### 7.1 验收类别结论

| 验收类别 | 输入 | 覆盖范围 |
|---|---|---|
| 核心能力闭环验收 | Step 7 | `C-L2T-1~5` 是否共同成立且条件路径未被误升为固定时序。 |
| 功能能力验收 | Step 9 | 17 项核心 FR 是否逐项成立;6 项外围 FR 是否不阻塞、不扩权。 |
| 规则 / 边界验收 | Step 10 | 六类规则是否保护单一 truth、显式变化、owner 分层和安全红线。 |
| 数据归属验收 | Step 11 | Truth、snapshot、ref、forbidden body 四类是否分层。 |
| 非功能验收 | Step 13 | 六类 NFR 的判断口径是否成立且没有伪造硬数字。 |

### 7.2 验收标准表

| 验收类别 | ID | 验收项 | 验收条件 |
|---|---|---|---|
| 核心能力闭环验收 | `AC-L2T-001` | 稳定工具身份与完整定义成立 | 稳定本地 tool identity、完整正式定义、受控读取和显式演进共同成立;名称、实现、库存、SDK 包装、provider 或 capability identity 不得替代本地合同 truth。 |
| 核心能力闭环验收 | `AC-L2T-002` | 受控外部能力关联成立 | Capability-bound / unbound 分类、body-free binding、关系校验和缺口追溯共同成立;Hub truth 只以正式 ref / safe summary 被消费,不在 L2 形成第二 registry。 |
| 核心能力闭环验收 | `AC-L2T-003` | 统一 canonical invocation 成立 | 正式定义能够形成唯一 canonical invocation、显式受理 / 执行前拒绝和跨 caller / carrier 一致终态语义;raw request 与 Runtime orchestration 不进入本地合同 truth。 |
| 核心能力闭环验收 | `AC-L2T-004` | 执行前置与条件化隔离交接成立 | 工具执行要求、正式 authorization 结果消费、fail-closed、承载要求和 Sandbox 交接 / source ref 分层成立;不自我授权、不旁路隔离、不拥有执行 truth。 |
| 核心能力闭环验收 | `AC-L2T-005` | Outcome、工具域审计与安全交接成立 | 成功、工具失败、执行前拒绝、执行材料失败和外部 handoff degradation 可区分;normalized outcome、Tool-domain audit 与 safe handoff 各自成立,外部失败不改写本地终态。 |
| 功能能力验收 | `AC-L2T-006` | 稳定工具身份建立能力 | `FR-L2T-001` 成立:正式工具能以稳定本地身份进入合同语境,身份不依赖显示名、具体实现、inventory 或外部 capability identity。 |
| 功能能力验收 | `AC-L2T-007` | 正式工具定义表达与读取能力 | `FR-L2T-002` 成立:正式定义完整、可解释、锚定稳定身份并可受控读取,调用方无需私有配置或模型补全其语义。 |
| 功能能力验收 | `AC-L2T-008` | 定义演进、兼容与追溯能力 | `FR-L2T-003` 成立:调整、更正、兼容影响和退役显式发生,新旧语义及既有引用影响可解释,实现替换不得静默改写定义。 |
| 功能能力验收 | `AC-L2T-009` | 外部能力关联分类能力 | `FR-L2T-004` 成立:每个工具明确为 capability-bound 或正式 unbound,不由空值、名称、默认行为或一刀切前置推断。 |
| 功能能力验收 | `AC-L2T-010` | 受控 capability binding 能力 | `FR-L2T-005` 成立:本地稳定工具身份与上游正式 capability ref 之间形成 body-free relation,不复制 descriptor、exposure、applicability 或 provider 正文。 |
| 功能能力验收 | `AC-L2T-011` | Binding 校验、失效与追溯能力 | `FR-L2T-006` 成立:binding 的可验证、stale、冲突、失效和不可验证语境可识别,本地变化与缺口显式,维护行为不补造上游 truth。 |
| 功能能力验收 | `AC-L2T-012` | Canonical invocation 语境形成能力 | `FR-L2T-007` 成立:正式定义引用、合同内目标和安全调用语境收敛为唯一规范调用语义,raw caller / transport body 不因归一化成为 truth。 |
| 功能能力验收 | `AC-L2T-013` | 合同一致受理与执行前拒绝能力 | `FR-L2T-008` 成立:调用在真实执行前形成显式受理、拒绝或等待前置语义;不可解释输入、失效定义或未满足前置不得静默进入执行。 |
| 功能能力验收 | `AC-L2T-014` | 跨调用方与承载方式一致能力 | `FR-L2T-009` 成立:不同 caller 及 direct、adapter、sandbox carrier 消费同一调用、结果和错误语义,承载方式不形成第二合同。 |
| 功能能力验收 | `AC-L2T-015` | 执行要求判断能力 | `FR-L2T-010` 成立:基于正式定义、invocation 和适用 binding 形成工具域执行要求,并明确该判断不等于 effective authorization。 |
| 功能能力验收 | `AC-L2T-016` | 正式 authorization 消费与 fail-closed 能力 | `FR-L2T-011` 成立:governed 调用只消费正式 owner 的结果 ref / safe summary;来源、有效性或结论缺失、冲突、stale 或不可验证时保守拒绝。 |
| 功能能力验收 | `AC-L2T-017` | 条件化承载与隔离不可旁路能力 | `FR-L2T-012` 成立:前置满足后形成适用 carrier 要求;sandbox-required 不得宿主直跑或静默降级,carrier 改变不改变工具合同。 |
| 功能能力验收 | `AC-L2T-018` | Sandbox 交接与执行材料消费能力 | `FR-L2T-013` 成立:规范 invocation 可被交接并消费正式 execution source ref;L2 不拥有 environment、run、capture、failure、receipt、cleanup 或 recovery truth。 |
| 功能能力验收 | `AC-L2T-019` | Normalized tool result 能力 | `FR-L2T-014` 成立:canonical invocation 与可信成功 execution material 形成唯一 normalized result;capture、provider response、delivery 或 projection 不得直接冒充结果。 |
| 功能能力验收 | `AC-L2T-020` | Normalized error 与无执行终态能力 | `FR-L2T-015` 成立:工具失败、执行前拒绝、execution failure、capture failure 和 handoff degradation 保持可区分;无执行终态不得虚构 run / capture。 |
| 功能能力验收 | `AC-L2T-021` | Tool-domain audit 追溯能力 | `FR-L2T-016` 成立:identity、definition、invocation、outcome 和适用 source refs 可回链;审计不扩张为 observation store、delivery history、replay 或 evidence store。 |
| 功能能力验收 | `AC-L2T-022` | 安全外部交接与降级能力 | `FR-L2T-017` 成立:只从已成立本地 truth 形成最小必要、body-free、已脱敏且可关联材料;本地提交尝试 / 降级显式,外部失败不回滚本地 outcome / audit。 |
| 功能能力验收 | `AC-L2T-023` | 外围增强不阻塞且不反写核心 | `FR-L2T-E01~E06` 未提供时不影响 `FR-L2T-001~017` 通过;若提供搜索 / diff、批量维护、派生索引、诊断摘要、客户端说明或管理入口,只能消费核心 truth,不得扩张 owner、固定 SDK / UI / API 或成为核心前置。 |
| 规则 / 边界验收 | `AC-L2T-024` | 核心不变量成立 | Step 10 的不变量全部成立:稳定 identity、定义锚定、bound / unbound 与 binding 双锚点、canonical invocation、carrier 一致、carrier 不改变语义、capture 不冒充 outcome、终态分层、local truth first 和 safe material 合取门禁均无例外。 |
| 规则 / 边界验收 | `AC-L2T-025` | 禁止行为未发生 | Step 10 的禁止行为全部成立:读取 / 派生不写 truth、binding 缺口不旁路、无执行不造 run、未知 authorization 不放行、隔离不降级、raw / secret 正文不交接、未成立事实不入 truth。 |
| 规则 / 边界验收 | `AC-L2T-026` | 影响性变化显式成立 | Identity / definition / binding、调用受理、定义与 invocation 演进、audit 缺口及 handoff 尝试 / 降级的影响性变化均显式发生并可追溯,不得由读取、执行材料或外部状态反推 / 静默覆盖。 |
| 规则 / 边界验收 | `AC-L2T-027` | 相邻 owner 与消费边界成立 | Runtime orchestration、Hub registry、authorization truth、Sandbox execution、Bus delivery、Observability store、SDK client、provider / inventory 正文均保持外部;未闭口 mapping / receipt / route 不被伪称存在,外围增强不反写。 |
| 规则 / 边界验收 | `AC-L2T-028` | 治理约束成立 | Capability visibility / exposure / applicability 不被解释为 invocation authorization;governed 调用只承接正式 authorization owner 结果,本仓风险 / 执行要求声明不产生 approval 或 allow / deny truth。 |
| 规则 / 边界验收 | `AC-L2T-029` | 审计约束成立 | Execution handoff、返回材料、source refs 与已知缺口可回链;Tool-domain audit 可回链 identity、definition、invocation、outcome 和适用来源,且不复制外部正文。 |
| 数据归属验收 | `AC-L2T-030` | L2 自有真相归属正确 | `DR-L2T-001~003`;`DR-L2T-007~009`;`DR-L2T-013~015`;`DR-L2T-019~021`;`DR-L2T-027~030` 的 L2 合同、关系、消费判断、outcome、audit 与 handoff attempt truth 归属明确,不混入外部本体。 |
| 数据归属验收 | `AC-L2T-031` | 快照数据不成为第二 truth | `DR-L2T-004`;`DR-L2T-010`;`DR-L2T-016`;`DR-L2T-022~023`;`DR-L2T-031~032` 仅按消费时点解释外部语境或派生结果;后到变化形成新快照 / 缺口,不原地改写真相。 |
| 数据归属验收 | `AC-L2T-032` | 引用数据不接管外部生命周期 | `DR-L2T-005`;`DR-L2T-011`;`DR-L2T-017`;`DR-L2T-024~025`;`DR-L2T-033` 只保存正式引用关系,不拥有共享契约候选、Hub、Runtime、authorization、Sandbox、Bus 或 Observability 正文和生命周期。 |
| 数据归属验收 | `AC-L2T-033` | Forbidden body 边界成立 | `DR-L2T-006`;`DR-L2T-012`;`DR-L2T-018`;`DR-L2T-026`;`DR-L2T-034` 的实现 / inventory、Hub / provider、raw request / prompt、policy / Sandbox、raw capture / delivery / observation / evidence 正文不进入本仓;归一化或加密不改变禁止结论。 |
| 非功能验收 | `AC-L2T-034` | 性能判断口径成立 | `NFR-L2T-001~003` 成立:核心读取 / 判断、invocation 与本地终态不被外围或外部 handoff 阻塞,且不以速度牺牲正确性、安全、fail-closed 或追溯;当前不声称数字阈值通过。 |
| 非功能验收 | `AC-L2T-035` | 可用性判断口径成立 | `NFR-L2T-004~006` 成立:外围失效不拖垮核心,条件前置缺失只让适用路径保守收束,下游 / 外部协作失败不回滚或反写本地 truth。 |
| 非功能验收 | `AC-L2T-036` | 安全判断口径成立 | `NFR-L2T-007~010` 成立:forbidden body 不保存 / 外发,相邻 owner 不被吸收,不自授权、不旁路隔离,派生 / 消费不反写真相,safe material 同时满足四项门禁。 |
| 非功能验收 | `AC-L2T-037` | 审计 / 可追溯判断口径成立 | `NFR-L2T-011~013` 成立:合同到 outcome / audit / handoff 的关键链可解释,真实执行与无执行事实分层,变化、重评、尝试和缺口不静默覆盖。 |
| 非功能验收 | `AC-L2T-038` | 幂等 / 一致性判断口径成立 | `NFR-L2T-014~016` 成立:重复输入不制造重复 identity / definition / binding,caller / carrier 不分叉调用或终态,invocation-bound snapshot / ref 与 outcome source 不被后到材料原地改写。 |
| 非功能验收 | `AC-L2T-039` | 可观测性判断口径成立 | `NFR-L2T-017~019` 成立:关键状态、边界异常、多 owner 故障和 handoff gap 可识别,但 observation 不替代 truth、不保存正文、不驱动恢复;不声称 producer / route readiness。 |

### 7.3 一票否决项

| ID | 一票否决项 | 否决原因 |
|---|---|---|
| `VF-L2T-001` | `C-L2T-1~5` 任一核心能力节点无法成立,或条件路径被误写为每次调用必须经过的固定外仓时序。 | 本仓失去完整工具调用语义契约真相定位。 |
| `VF-L2T-002` | 工具 identity / definition 被显示名、实现、builtin / inventory、provider、capability identity、SDK wrapper、调用方私有 schema 或派生视图替代。 | 稳定本地合同失效并形成多真相源。 |
| `VF-L2T-003` | Binding 复制 Hub registry / descriptor / exposure / applicability 正文,回退本地 registry / allowlist / 字符串猜测,或把 capability visibility 当 authorization。 | Hub / Tools / authorization owner 边界失效。 |
| `VF-L2T-004` | 不同 caller / carrier 形成第二 invocation / result / error 合同,raw request 成为 truth,或 L2 吸收 agent loop、planning、orchestration、retry / recovery / checkpoint。 | Canonical invocation 与 Runtime 边界失效。 |
| `VF-L2T-005` | L2 自我授权、来源不可验证仍放行、sandbox-required 宿主直跑或隔离要求被静默降级。 | 治理与隔离安全底线失效。 |
| `VF-L2T-006` | 执行前拒绝 / 等待被记录为已执行,或虚构 Sandbox run、capture、receipt、dead-letter、cleanup、producer、route 或 delivery fact。 | 未成立外部事实被伪造,真实执行与无执行分层失效。 |
| `VF-L2T-007` | Raw capture、provider response、Sandbox failure、Bus delivery、Observability projection 或 Runtime checkpoint 直接替代 normalized result / error / ToolAuditEntry。 | 本地 outcome / audit truth owner 失效。 |
| `VF-L2T-008` | Secret、credential、raw prompt、raw caller / transport body、raw capture、provider body、高敏完整引用或 evidence 正文进入 truth / audit / handoff,或安全材料未同时满足四项合取门禁。 | Forbidden body 与安全交接底线失效。 |
| `VF-L2T-009` | Bus / Observability / SDK / Runtime 消费失败能够回滚、覆盖或重新裁决本地 outcome / audit,或驱动 L2 执行 Runtime retry / recovery。 | Local truth first 与消费边界失效。 |
| `VF-L2T-010` | L2 拥有或合并 Runtime orchestration、Hub registry、authorization decision、Sandbox execution、Bus delivery、Observability store、SDK client、provider control、具体库存 / 装配 / marketplace truth。 | 仓定位和相邻 owner 边界被打穿。 |
| `VF-L2T-011` | Identity / definition / binding / invocation / 前置判断 / execution source / outcome / audit / handoff 的关键来源、变化或缺口不可追溯,或后到材料原地改写既有事实。 | 审计、消费时点锚定和一致性底线失效。 |
| `VF-L2T-012` | Core Tools-specific shared schema、Observability producer / source / route / readiness 或 SDK tools-specific client seam 等开放 contract 被无依据写成现有事实,`DB-L2T-003` pending 或 `DB-L2T-008` future / excluded 被升格为当前依赖,运行期 / 事件依赖被写成 sibling path dependency,或 material handoff 被创建为第四种依赖类型。 | 全局依赖裁剪和开放 seam 状态失效。 |
| `VF-L2T-013` | 旧 API / event / error、builtin / MCP Client / extras 主线、百分比 / SLA / 时延 / replay 指标、测试结果 / evidence / 签署或 `L2T-UP-001~009` 闭口状态被伪装为当前事实。 | Historical material、blocker 和事实可信性门禁失效。 |

### 7.4 来源与验收映射

| 来源范围 | 验收承接 |
|---|---|
| `C-L2T-1~5` | `AC-L2T-001~005`;`VF-L2T-001` |
| `FR-L2T-001~017` | `AC-L2T-006~022` 一一对应 |
| `FR-L2T-E01~E06` | `AC-L2T-023`;`AC-L2T-027`;`VF-L2T-002`;`VF-L2T-009~010`;`VF-L2T-012~013` |
| Step 10 不变量 | `AC-L2T-024`;`VF-L2T-002~005`;`VF-L2T-007~009` |
| Step 10 禁止行为 | `AC-L2T-025`;`VF-L2T-003~010`;`VF-L2T-013` |
| Step 10 显式变化 | `AC-L2T-026`;`VF-L2T-011` |
| Step 10 边界约束与外围规则 | `AC-L2T-027`;`VF-L2T-002~004`;`VF-L2T-006~010`;`VF-L2T-012~013` |
| Step 10 治理约束 | `AC-L2T-028`;`VF-L2T-003`;`VF-L2T-005` |
| Step 10 审计约束 | `AC-L2T-029`;`VF-L2T-006~008`;`VF-L2T-011` |
| Step 11 truth / snapshot / ref / forbidden body | `AC-L2T-030~033`;`VF-L2T-002~011` |
| `NFR-L2T-001~003` | `AC-L2T-034` |
| `NFR-L2T-004~006` | `AC-L2T-035` |
| `NFR-L2T-007~010` | `AC-L2T-036`;`VF-L2T-003~010` |
| `NFR-L2T-011~013` | `AC-L2T-037`;`VF-L2T-006~008`;`VF-L2T-011` |
| `NFR-L2T-014~016` | `AC-L2T-038`;`VF-L2T-002~004`;`VF-L2T-011` |
| `NFR-L2T-017~019` | `AC-L2T-039`;`VF-L2T-006~010`;`VF-L2T-013` |
| Step 6 / Step 12 依赖裁剪 | `AC-L2T-027`;`VF-L2T-012` |
| Historical material / blocker 可信性 | `VF-L2T-013` |

### 7.5 能力级验收停审

| 节点 | 主要验收承接 | 停审结论 |
|---|---|---|
| `C-L2T-1` | `AC-L2T-001`;`AC-L2T-006~008`;`AC-L2T-024~027`;`AC-L2T-030~034`;`AC-L2T-036~039`;`VF-L2T-001~002`;`VF-L2T-008`;`VF-L2T-010~013` | pass:身份 / 定义、演进、数据、质量和替代风险均覆盖。 |
| `C-L2T-2` | `AC-L2T-002`;`AC-L2T-009~011`;`AC-L2T-024~028`;`AC-L2T-030~039`;`VF-L2T-001`;`VF-L2T-003`;`VF-L2T-005`;`VF-L2T-010~013` | pass:分类、binding、Hub / authorization 分层、失效和重评均覆盖。 |
| `C-L2T-3` | `AC-L2T-003`;`AC-L2T-012~014`;`AC-L2T-024~027`;`AC-L2T-030~039`;`VF-L2T-001~002`;`VF-L2T-004`;`VF-L2T-006~008`;`VF-L2T-010~013` | pass:canonical invocation、受理 / 拒绝、carrier 一致和 raw body 边界均覆盖。 |
| `C-L2T-4` | `AC-L2T-004`;`AC-L2T-015~018`;`AC-L2T-024~029`;`AC-L2T-030~039`;`VF-L2T-001`;`VF-L2T-003`;`VF-L2T-005~008`;`VF-L2T-010~013` | pass:fail-closed、隔离和 execution owner 均覆盖;约束为 `L2T-UP-001~004` 保持开放。 |
| `C-L2T-5` | `AC-L2T-005`;`AC-L2T-019~022`;`AC-L2T-024~027`;`AC-L2T-029~039`;`VF-L2T-001`;`VF-L2T-004`;`VF-L2T-006~013` | pass:outcome / audit / safe handoff / degradation 均覆盖;约束为 `L2T-UP-004~008` 保持开放。 |
| 外围增强 | `AC-L2T-023`;`AC-L2T-027`;`VF-L2T-002`;`VF-L2T-009~010`;`VF-L2T-012~013` | pass:外围不成为核心前置、不新增 truth 或强依赖。 |

### 7.6 跨能力验收审计

| 检查项 | 结论 | 说明 |
|---|---|---|
| 无来源 AC / VF | 无 | `AC-L2T-001~039`、`VF-L2T-001~013` 均回指已确认能力、FR、规则、数据、NFR 或依赖 / 历史边界。 |
| 核心 FR 无验收 | 无 | 17 项核心 FR 与 `AC-L2T-006~022` 一一对应。 |
| 外围误升核心前置 | 无 | 6 项外围只由 `AC-L2T-023` 和边界 AC / VF 承接。 |
| 六类规则无承接 | 无 | `AC-L2T-024~029` 分别承接六类规则。 |
| 四类数据无承接 | 无 | `AC-L2T-030~033` 分别承接四类数据。 |
| 六类 NFR 无承接 | 无 | `AC-L2T-034~039` 分别承接六类 NFR。 |
| 一票否决过宽 | 未发现 | 一般外围缺陷、指标待定和开放 seam 本身不构成整体否决。 |
| 测试 / 实现事实泄漏 | 无 | 未写脚本、步骤、API、CI、真实 run / evidence /结果或签署。 |

---

## 8. 回填草稿

> Step 17 应完整装配 §7.1 验收类别、§7.2 的 39 项验收标准表和 §7.3 的 13 项一票否决表。§7.4~7.6 保留为 calibration 追溯,正式正文不得写测试步骤或实际结果。

正式章节必须声明:本章定义需求通过条件,不表示实现或测试已经完成;开放 `L2T-UP-001~009` 不因出现 AC / VF 编号而变为 resolved。

---

## 9. 待确认事项

### 9.1 Blocker 判定

| Blocker | 是否阻塞 Step 14 | 验收约束 | 不得声称 |
|---|---|---|---|
| `L2T-UP-001~002` | 否 | `AC-L2T-016~017`;`AC-L2T-028`;`AC-L2T-035~036`;`AC-L2T-039`;`VF-L2T-005`;`VF-L2T-013` 使未知来源保守收束。 | Authorization owner/source matrix、taxonomy 已存在或已通过。 |
| `L2T-UP-003~004` | 否 | `AC-L2T-018~020`;`AC-L2T-029`;`AC-L2T-035`;`AC-L2T-037~039`;`VF-L2T-006~007`;`VF-L2T-011`;`VF-L2T-013` 使 mapping / receipt 缺口显式。 | Sandbox mapping / receipt / DLQ / feedback / cleanup 可执行或验收通过。 |
| `L2T-UP-005~007` | 否 | `AC-L2T-022`;`AC-L2T-035~037`;`AC-L2T-039`;`VF-L2T-008~009`;`VF-L2T-013` 保护 local truth first。 | Producer / source / route、immutable baseline 或 implementation readiness 已通过。 |
| `L2T-UP-008` | 否 | `AC-L2T-001`;`AC-L2T-003`;`AC-L2T-027`;`AC-L2T-032`;`AC-L2T-038`;`VF-L2T-012~013` 保持 `DB-L2T-001` 当前编译期依赖与 Tools-specific shared schema 候选状态分离。 | Tools-specific shared schema 已存在或 contract 验收通过。 |
| `L2T-UP-009` | 否 | `AC-L2T-023`;`AC-L2T-027`;`AC-L2T-035`;`VF-L2T-009~010`;`VF-L2T-012~013` 保持 `DB-L2T-008` 为 future / excluded 且 tools-specific client seam 待闭口。 | Tools SDK client、方法、语言包或联调已通过。 |

结论:未发现新增上游 blocker。开放项不阻塞需求级验收条件收敛,但任何受影响的后续协议 / 测试 / 正向联调 / implementation readiness 必须继续保持 blocked 或 fail-closed,不得依据本文件声称实际验收通过。

---

## 10. 进入下一步条件

### 10.1 自检

| 检查项 | 结果 |
|---|---|
| 五类验收类别是否完整 | pass |
| 17 项核心 FR 是否各有独立 AC | pass |
| 6 项外围 FR 是否有边界承接且未升核心 | pass |
| 六类规则、四类数据、六类 NFR 是否分别承接 | pass |
| 一票否决是否只覆盖严重失败 | pass |
| 每项 AC / VF 是否可回指前序来源 | pass |
| 是否未写测试步骤、实现细节或真实结果 | pass |
| 是否未伪造数字阈值、evidence、签署或 blocker 闭口 | pass |
| 是否区分当前依赖关系与具体 schema / route / client seam 开放状态 | pass |
| 是否未修改正式 `00-需求文档.md` | pass |

### 10.2 模块状态

| 模块 | 状态 | gate_status |
|---|---|---|
| capability_acceptance | done | pass |
| functional_acceptance | done | pass |
| rule_data_nfr_acceptance | done | pass |
| veto_and_cross_capability_audit | done | pass |

### 10.3 停审结论

```text
step_status = completed_stop_review
gate_status = pass
formal_section_write_allowed = false
next_allowed_action = create 00_req_step_15_risks_open_questions.md
commit_required = false
```
