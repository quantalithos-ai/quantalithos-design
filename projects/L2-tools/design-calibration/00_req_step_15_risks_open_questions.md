# L2-tools 需求 Step 15:风险与待确认事项

> Step 状态: completed_stop_review
> 当前模式: full-restart
> 正式回填目标: `00-需求文档.md` §15
> 本步原则: 只显式收纳尚未关闭的风险和会影响后续结构成立的待确认问题;不补写功能、目标或规则,不在风险表中设计最终方案,不把普通 TODO、未来优化或开放 blocker 润色成确定结论。

---

## 1. Step 状态与 Step 内计划

### 1.1 Step 状态

| 字段 | 值 |
|---|---|
| step | Step 15 |
| status | `completed_stop_review` |
| gate_status | `pass` |
| previous_step | Step 14 `验收标准` |
| current_module | `risks_open_questions:completed` |
| next_allowed_action | 读取 Step 7~15、需求 SOP Step 16 与需求规范 §4.16,只创建 `00_req_step_16_traceability_matrix.md`。 |
| formal_write_status | `not_written` |
| blocker_status | `L2T-UP-001~009` 全部保持开放;不阻塞 Step 16 和需求装配,但阻塞对应后续 owner / schema / mapping / route / client / measurement / readiness 定稿。 |

### 1.2 本步目标

把 Step 1~14 暴露但未闭口的风险与待确认事项分别收纳,说明其影响范围和当前如何受约束 / 挂起,防止后续 `01~07` 或实现 agent 为填补空白而私造 authority、协议、事件、证据或测试结论。

本步不把已由 FR / BR / DR / AC / VF 明确的边界重新写成“待确认”。例如“不自授权”“不旁路隔离”“不保存 raw body”“外部 handoff 不反写本地 outcome”均为已确认硬约束,不是开放选择。

### 1.3 Step 内计划

| 序号 | 动作 | 状态 | 输出 / 门禁 |
|---:|---|---|---|
| 1 | 恢复 ledger / flow 与 Step 1~14 | done | 确认只允许 Step 15,正式 `00` 不可写。 |
| 2 | 读取 SOP Step 15、规范 §4.15 和参考项目 | done | 固定两张三列表和第三列写法。 |
| 3 | 汇总开放 blocker、historical conflict 和后续串线风险 | done | 区分硬规则、具体风险、待确认和普通 TODO。 |
| 4 | 收敛 12 项风险 | done | 每项写具体失守后果、影响范围与当前约束,不写最终方案。 |
| 5 | 收敛 8 项待确认事项 | done | 每项确实影响后续协议 / 数据 / 测试 / 联调结构,并有挂起方式。 |
| 6 | 逐条映射 `L2T-UP-001~009` | done | 九项开放状态均有风险 / Q / 后续门禁承接。 |
| 7 | 区分当前不阻塞和后续阻塞 | done | 需求可装配,受影响正向设计 / 测试 / 实施不可伪称 ready。 |
| 8 | Historical material、自检并停审 | done | 无脑补闭口、TODO 或方案泄漏;允许进入 Step 16。 |
| 9 | Step 17 依赖术语受控回退复核 | done | 风险与 Q 已区分当前项目依赖、pending / future 记录和具体 contract / seam 开放状态;R / Q 编号与开放状态不变。 |

---

## 2. 本步输入

### 2.1 输入与读取结论

| 输入 | 已读取结论 | 本步约束 |
|---|---|---|
| Step 1 / project ledger | `L2T-UP-001~009` 的上游位置、状态、影响范围和当前口径已登记。 | 原编号和开放状态必须逐项承接,不得合并后遗漏或改为 resolved。 |
| Step 2~7 | 本仓定位、非目标、依赖裁剪、五节点与条件路径已固定。 | 风险关注后续边界回流,不重开仓定位或把条件路径改成固定调用链。 |
| Step 8~9 | 17 核心故事 / FR 与 6 外围故事 / FR 已闭合。 | 普通功能待实现不是风险;外围不得误升核心前置。 |
| Step 10~12 | 六类规则、四类数据、能力接口和依赖边界已固定:`DB-L2T-001~002`、`DB-L2T-004~007` 为当前依赖,`DB-L2T-003` pending,`DB-L2T-008` future / excluded;具体 schema / route / client seam 仍开放。 | 风险必须保护 owner、forbidden body、当前依赖子集、pending / future 记录、开放 seam 和 material handoff carrier 边界。 |
| Step 13 | 六类 NFR 使用判断口径,旧硬数字全部 historical。 | 量化方式未闭口只影响后续测量,不得伪造当前目标。 |
| Step 14 | 39 项 AC 与 13 项 VF 已定义,但没有真实验收结果。 | 验收定义不是 evidence;一票否决边界不再作为开放问题。 |
| SOP Step 15 / 规范 §4.15 | 风险和待确认分两表;第三列分别写当前约束 / 暂存和当前挂起方式。 | 不写最终解决方案、实施动作、负责人、截止日或空泛“未定”。 |

---

## 3. SOP 问题回答

### 3.1 当前还有哪些尚未关闭的风险

当前风险集中在四类:上游 authority / contract 尚未闭口却被本仓自造;外部 source / handoff / observation truth 被吸收;旧 README / 正式链 / 数字重新回流;后续依赖、测试或实施文档把候选与验收定义伪装成已存在事实。具体 12 项见 §7.1。

### 3.2 风险会影响哪一层需求结构

| 风险层 | 主要影响 |
|---|---|
| Owner / authority 风险 | §2 定位、§6 依赖、§10 规则、§11 数据、§12 接口、§14 验收以及后续 01~07。 |
| Mapping / handoff 风险 | §9 功能、§10 规则、§11 source ref、§12 能力接口、§13 NFR、§14 AC,以及后续 02~07。 |
| Historical / evidence 风险 | §3 基线、§4 目标、§9~14 可落码条目、后续测试 / 验收 / 实施。 |
| Dependency / candidate 风险 | §6 裁剪、§12 DB、§14 VF,以及后续代码组织和联调边界。 |

### 3.3 当前还有哪些待确认事项

只保留会改变后续正式 contract、schema、mapping、route、client 或测量边界的问题,见 §7.2。具体字段、API 名、topic、repository、重试算法、实现任务等尚未设计的普通事项不进入当前 Q 表。

### 3.4 哪些待确认项影响前文结论是否成立

八项 Q 都不推翻当前需求 owner 和硬边界。它们影响的是“后续如何落实”:若未闭口,受影响路径必须继续 fail closed / blocked / candidate;不得反向把当前能力定义、AC 或 safe handoff 需求解释为可执行集成已经成立。

### 3.5 哪些风险当前可接受,哪些会阻塞后续推进

| 阶段 | 当前判断 |
|---|---|
| 完成 Step 15~17 与正式 `00` | 可接受。需求已用 owner 分层、fail-closed、forbidden body、candidate 和显式 blocker 约束不确定性。 |
| 进入 `01-架构设计.md` 讨论 | 用户审查需求后可进入,但必须把九项 blocker 带入架构 flow,不得删除。 |
| 固定 authorization / Sandbox / Observability / Core / SDK 正向 contract | 受对应 Q 和 `L2T-UP-*` 阻塞,闭口前只能定义 adapter / consumer boundary 和保守失败语义。 |
| 宣称测试、验收、联调或 implementation readiness | 受正式方案、测试基线和真实 evidence 阻塞;当前 AC / VF 不是完成证明。 |

---

## 4. 当前文档问题诊断

### 4.1 风险与待确认的边界

| 候选内容 | 分类 | 取舍理由 |
|---|---|---|
| Authorization owner/source 不清可能导致自授权 | 风险 + 待确认 | 失守后果明确,且 authority 选择影响后续 contract。 |
| “实现 ToolDefinition” | 普通后续工作 | 不是风险或待确认,已经有 FR;后续实施规划处理。 |
| Raw body 不得保存 | 已确认规则 | 不是待确认;只有后续回流 / 泄漏可能性属于风险。 |
| 具体 API、DTO、topic 尚未设计 | 普通后续设计 | 当前不影响需求成立;只有跨仓 authority / carrier 未闭口者进入 Q。 |
| 旧 `100%`、SLA 是否沿用 | 已裁定 historical | 不是开放选择;风险是后续把它们伪装成当前指标。 |
| 外围搜索 / UI 是否首批实现 | 产品 / 实施裁剪 | 不影响核心需求,不进入本章。 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 当前校准后 |
|---|---|---|
| 风险来源 | 旧 README / 正式链、开放 seam、普通 TODO 与已确认规则容易混杂 | 只保留有明确失守后果的 12 项风险,已确认边界不重开。 |
| 待确认范围 | 任意未设计 API / DTO / topic 都可能被列为开放问题 | 只保留会改变后续 authority、contract、schema、mapping、route、client 或测量边界的 8 项。 |
| Blocker 状态 | 可能被需求结论或 AC / VF 隐式关闭 | `L2T-UP-001~009` 逐项承接并保持开放,当前需求可完成但后续正向 readiness 受限。 |

---

## 6. 设计取舍

### 6.1 风险组织取舍

不机械把九个 `L2T-UP-*` 各改写成一条风险。风险表按“失守后果”组织,因此 authorization、Sandbox mapping、Sandbox handoff、Observability、Core、SDK、upstream baseline、historical 回流、owner 吸收、正文泄漏、伪量化和依赖裁剪分别成项;随后 §7.3 再把 blocker 逐条映射回来。

### 6.2 当前处理口径取舍

风险第三列只写当前如何约束:fail closed、保持具体 contract / seam 的 candidate / pending、按 forbidden body 排除、按 historical material 排除、不得声称 readiness 等;不得把已确认仓际依赖关系重新写成 candidate。Q 第三列只写未确认前如何挂起:不定 owner / schema / mapping / route / client / threshold。两处都不写“通过某组件实现”“增加某表 / worker / topic”“负责人何时完成”。

---

## 7. 结构化中间产物

### 7.1 风险清单

| 风险 | 影响范围 | 当前处理口径 |
|---|---|---|
| `R-L2T-001` Authorization owner、source matrix 或高风险 taxonomy 未闭口时,后续若由 L2 自补裁决,会把执行要求升级为 self-authorization。 | §2、§6、§9~14;后续 01~05 / 07 | 当前按“只声明工具风险 / 执行要求,只消费正式结果,未知即 fail closed”约束;不把任何本地摘要、Hub visibility 或 Sandbox policy 引用当 allow / deny truth。 |
| `R-L2T-002` ToolInvocation 到 Sandbox generic chain 及 capture / failure 到工具 outcome 的 mapping 未闭口,后续若凭旧对象或字段猜测,会形成不可追溯或多义结果。 | §9~14;后续 02 / 03 / 05 / 06 | 当前只保留 L2 adapter responsibility、正式 source ref 和映射失败语义;mapping 未定稿前不得声称正向执行合同可落码。 |
| `R-L2T-003` Sandbox receipt、dead-letter、investigation feedback 或 cleanup release 未闭口,若被伪称已存在,会制造虚假 handoff / delivery / cleanup truth。 | §10~14;后续 02~07 | 当前按开放 handoff 边界处理;只记录本地交接语境与已知缺口,不写 receipt、route、DLQ、feedback 或 release 已可执行。 |
| `R-L2T-004` Observability Tools producer / source / route 未闭口,若 L2 私造 event / enum / schema,会形成第二 observation truth 或把 safe material 当已交付事实。 | §6、§10~14;后续 01~07 | `DB-L2T-007` 已是当前事件协作依赖;当前只要求安全材料与本地提交尝试 / 降级可判断,不得把未闭口的 producer、source、route、projection 或 readiness 宣称为现有事实。 |
| `R-L2T-005` Observability 正式链状态冲突及上游 workspace 未冻结,若被表述为 immutable / implementation-ready baseline,会让后续设计建立在未经确认的输入状态上。 | §1、§6、§12~15;后续所有正式文档 | 当前只称 current workspace input,保留 `upstream_status_conflict` 和 `uncommitted_upstream_input`;不引用虚构 commit baseline 或完成状态。 |
| `R-L2T-006` Core 尚无 Tools-specific shared schema,后续若直接假定或在 L2 复制共享 ID / error / trace / envelope,会形成跨仓双 contract。 | §6、§11~14;后续 01~03 / 05 / 07 | `DB-L2T-001` 已是当前编译期依赖;当前只引用正式适用的共享类别,Tools-specific schema / contract authority 未确认前不得写 Core 已提供该具体合同。 |
| `R-L2T-007` SDK 尚无 Tools-specific client seam,后续若由客户端包装反向定义服务端工具合同,会造成层级循环和多语言语义分叉。 | §6、§8~9、§11~15;后续 SDK 联调 | `DB-L2T-008` 是 future / excluded 边界记录,不是当前依赖;客户端说明仅为外围增强,不承诺 client、method、language package、coverage 或正向联调已成立。 |
| `R-L2T-008` README 与旧 `00~06` 的 Python / Rust 形态、builtin / MCP / extras、local registry / allowlist、事件 / 错误 / replay / SLA 若回流,会重新建立与当前 owner 边界冲突的需求链。 | 全文;后续 01~07 | 当前全部按 historical material 处理;后续只允许从当前正式 `00` 和对应 calibration 追溯,不得用旧正式链自证。 |
| `R-L2T-009` 后续文档若把 Runtime、Hub、authorization、Sandbox、Bus、Observability、SDK、provider 或 inventory owner 合入 L2,会把工具语义仓膨胀为运行编排 / registry / execution / store / client。 | §2、§4、§6~15;后续 01~07 | 当前按 Step 2 非职责、Step 10 边界、Step 11 数据分层和 VF 共同约束;相邻本体只允许正式 ref / safe summary 或明确禁止正文。 |
| `R-L2T-010` Raw prompt / request / capture / provider body、secret 或 evidence 可能借“归一化、审计、加密、诊断、交接”名义回流,导致敏感正文泄漏与 truth 污染。 | §10~14;后续 01~06 | 当前按 forbidden body 无条件排除;外发必须同时满足 `minimal necessary + body-free + redacted + correlated`,任一不满足即不得交接。 |
| `R-L2T-011` 无正式 inventory、负载、测量对象或 evidence authority 时,旧百分比 / SLA / 时延 / replay 指标若被恢复,会制造无法辩护的测试与验收承诺。 | §3、§4、§13~15;后续 01 / 05~07 | 当前只保留 Step 13 判断口径和 Step 14 条件定义;任何数字、测试结果、run、evidence alias 或签署均不得被表述为当前事实。 |
| `R-L2T-012` Core Tools-specific schema、Observability producer / route / readiness、SDK tools-specific client seam 等开放 contract 若被无依据写成现有事实,或 pending / future 记录被升格为当前依赖,或 material handoff 被当作第四种依赖 / sibling path dependency,会破坏全局裁剪并让实现边界反向定义需求。 | §6、§12、§14~15;后续 01~03 / 07 | 当前项目依赖子集固定为 `DB-L2T-001~002`、`DB-L2T-004~007`;`DB-L2T-003` 保持 pending,`DB-L2T-008` 保持 future / excluded;material handoff 只能附着 Sandbox runtime 或 Bus / Observability event carrier。 |

### 7.2 待确认事项

| 待确认事项 | 影响章节 | 当前状态 |
|---|---|---|
| `Q-L2T-001` Governed tool invocation 的正式 authorization owner、source matrix 和高风险 taxonomy 由哪些正式 authority 提供。 | §6、§9~14;后续 01~05 / 07 | 当前保持待确认,不指定 owner 优先级或 taxonomy;所有受影响路径按正式来源不可验证即 fail closed 挂起。 |
| `Q-L2T-002` Authorization result 进入 L2 时允许的 ref / safe summary 边界,以及消费时点 freshness、冲突与重评语义。 | §10~14;后续 02~05 | 当前只确认 L2 拥有来源可验证性和消费前置判断,不拥有 decision truth;具体承载与有效性字段不在需求层定稿。 |
| `Q-L2T-003` Canonical ToolInvocation 与 Sandbox generic execution chain、capture / failure 和 normalized result / error 之间的正式 mapping authority。 | §9~14;后续 02 / 03 / 05 / 06 | 当前按 L2 后续消费 adapter 边界挂起;mapping 未闭口时不得声明 execution path 或结果转换可执行。 |
| `Q-L2T-004` Sandbox handoff receipt、dead-letter、investigation feedback、cleanup release 与本地缺口之间的正式 seam。 | §10~15;后续 02~07 | 当前只保留本地 handoff 语境、source ref 和缺口,不命名 receipt / route / 状态或承诺 cleanup 闭环。 |
| `Q-L2T-005` Tools safe material 的 Observability producer / source family、route,以及当前正式链和 workspace baseline 何时具备可引用 readiness。 | §1、§6、§10~15;后续 01~07 | `DB-L2T-007` 当前事件协作依赖保持不变;producer / source / route / readiness 继续待确认,上游仅称 current workspace input,不定 enum、event、schema、topic、route、projection 或 immutable baseline。 |
| `Q-L2T-006` Core 对 Tools shared contract 的正式 authority 与最小共享类别边界。 | §6、§11~15;后续 01~03 / 05 / 07 | 当前只保留 actor / metadata / error / trace / envelope 等类别候选,不定 Tools-specific 类型、字段或 package ownership。 |
| `Q-L2T-007` Tools 服务端合同与 `L0-sdk` tools-specific client seam、语言包装和联调时点如何分层。 | §6、§8~9、§11~15;后续 SDK 设计 / 联调 | `DB-L2T-008` 保持 future / excluded,不进入当前依赖;tools-specific client seam 继续待确认,客户端说明保持外围增强,不承诺现成 client 或 coverage。 |
| `Q-L2T-008` 哪些 NFR 判断口径需要在正式接口、负载模型和 evidence authority 成立后升级为量化测试 / 验收目标。 | §13~15;后续 01 / 05~07 | 当前不固定 P95 / P99 / QPS / SLA / 时延 / 百分比 / 回放率,也不指定 evidence alias;缺乏 authority 时继续使用可判断口径。 |

### 7.3 上游 blocker 逐条承接

| Blocker | 风险承接 | 待确认承接 | 当前是否阻塞需求完成 | 后续阻塞点 |
|---|---|---|---|---|
| `L2T-UP-001` | `R-L2T-001` | `Q-L2T-001~002` | 否 | Authorization owner / decision consumption contract。 |
| `L2T-UP-002` | `R-L2T-001` | `Q-L2T-001~002` | 否 | Source matrix、taxonomy、测试分类。 |
| `L2T-UP-003` | `R-L2T-002` | `Q-L2T-003` | 否 | Sandbox adapter mapping、结果转换与对应测试。 |
| `L2T-UP-004` | `R-L2T-003` | `Q-L2T-004` | 否 | Receipt / DLQ / feedback / cleanup 正向协议与实施边界。 |
| `L2T-UP-005` | `R-L2T-004` | `Q-L2T-005` | 否 | Observability producer / source / route 与正向联调。 |
| `L2T-UP-006` | `R-L2T-005` | `Q-L2T-005` | 否 | Upstream readiness / evidence 声明。 |
| `L2T-UP-007` | `R-L2T-005` | `Q-L2T-005` | 否 | Immutable baseline、commit / source attribution。 |
| `L2T-UP-008` | `R-L2T-006`;`R-L2T-012` | `Q-L2T-006` | 否 | Shared schema / package authority 与跨仓字段定稿。 |
| `L2T-UP-009` | `R-L2T-007`;`R-L2T-012` | `Q-L2T-007` | 否 | SDK client contract 与正向联调。 |

### 7.4 当前不阻塞项与后续阻塞项

| 范围 | 当前状态 | 门禁 |
|---|---|---|
| `00-需求文档.md` Step 16 / 17 | `not_blocked` | 可按已确认边界完成追溯和装配;§15 必须保留 R / Q 与 blocker 开放状态。 |
| `01-架构设计.md` 讨论 | `blocked_by_00_review`,非上游 blocker | 正式 00 完成后仍须用户确认;进入后把 R / Q 全量带入架构 calibration。 |
| Authorization / Sandbox / Observability / Core / SDK 具体正向 contract | `blocked_by_open_contract` | 对应 `Q-L2T-001~007` 闭口或有正式 fail-closed / deferred boundary 前不得声称 ready。 |
| NFR 量化、测试结果与验收签署 | `blocked_by_measurement_and_evidence_authority` | `Q-L2T-008`、后续正式设计和真实运行证据闭口前不得定量或签署。 |

---

### 7.5 Historical material 差异审计

| 旧材料 | 当前风险处理 |
|---|---|
| README / 旧 `00` 的 Python package、builtin、MCP Client、Role extras、member-images | 只保留“需要统一工具合同”的背景线索;具体技术、库存和装配不得回流。 |
| 旧 `01` Python 同进程与旧 `03` Rust RPC / HTTP / DB / replay | 相互冲突且均无当前 authority;技术与部署形态后移,history / replay 不进入需求 truth。 |
| 旧 local registry / allowlist / Policy / capability-hub 查询 | 分别由 Hub 和正式 authorization owner 持有;L2 只保留 binding 与正式结果消费。 |
| 旧 Sandbox API、三类事件、error code、producer / route | 不继承协议名或存在事实;只保留条件交接、outcome 分层、安全材料和缺口。 |
| 旧百分比、SLA、时延、回放 / 恢复与测试 / 验收声明 | 只作为 historical conflict,不构成 NFR、AC、evidence 或签署。 |

---

## 8. 回填草稿

> Step 17 应完整装配 §7.1 的 12 项风险三列表与 §7.2 的 8 项待确认三列表,并保留 §7.4 的短门禁说明。§7.3 blocker 映射与 §7.5 historical diff 作为 calibration 审计依据,不必复制全部过程表。

正式章节不得把第三列改写为解决方案,也不得把 `open / candidate / pending / blocked` 润色为已闭口。风险与待确认必须分表呈现。

---

## 9. 待确认事项

### 9.1 Blocker 判定

`L2T-UP-001~009` 没有新增、合并、解决或降级。它们不阻塞需求层 owner、功能、规则、数据、接口、NFR、验收和追溯矩阵成立,因为当前文档已经给出保守行为和禁止声称;但它们会阻塞相应后续正向 contract、量化目标、测试入口、联调和 implementation readiness。

Step 15 不具备关闭这些 blocker 的 authority。任何后续关闭动作必须引用其正式 owner 产物与可验证状态,不能只在 L2 文档中把状态改为 resolved。

---

## 10. 进入下一步条件

### 10.1 自检

| 检查项 | 结果 |
|---|---|
| 风险与待确认是否拆为两张表 | pass |
| 12 项风险是否具体且有影响范围 / 当前约束 | pass |
| 8 项待确认是否影响结构且有当前挂起方式 | pass |
| `L2T-UP-001~009` 是否逐项承接且保持开放 | pass |
| 是否区分当前需求不阻塞与后续正向阻塞 | pass |
| 是否未把 TODO / 未来优化 / 实施方案写成风险 | pass |
| 是否未在第三列写最终解决方案或空泛“未定” | pass |
| 是否未伪造 commit、run、evidence、测试 / 验收或 readiness | pass |
| 是否区分当前依赖关系与具体 schema / route / client seam 开放状态 | pass |
| 是否未修改正式 `00-需求文档.md` | pass |

### 10.2 模块状态

| 模块 | 状态 | gate_status |
|---|---|---|
| risk_identification | done | pass |
| open_question_separation | done | pass |
| upstream_blocker_mapping | done | pass |
| current_vs_later_blocking_audit | done | pass |

### 10.3 停审结论

```text
step_status = completed_stop_review
gate_status = pass
formal_section_write_allowed = false
next_allowed_action = create 00_req_step_16_traceability_matrix.md
commit_required = false
```
