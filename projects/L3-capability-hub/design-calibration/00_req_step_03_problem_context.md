# Step 3. 背景与问题定义

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 3
> 回填章节: `00-需求文档.md` §3 背景与问题定义
> 生成日期: 2026-07-06
> 当前状态: `completed_stop_review`
> 粒度参考: `projects/L1-governance/design-calibration/00_req_step_03_problem_context.md`

---

## 0. 当前 Step 状态

| 项 | 记录 |
|---|---|
| 文档 | `projects/L3-capability-hub/00-需求文档.md` |
| Step | Step 3 背景与问题定义 |
| 当前入口 | `Step 3 已完成,等待是否进入 Step 4` |
| gate_status | pass |
| next_allowed_action | `wait_user_review_to_step_04` |
| 正式文档写入 | blocked: 当前只写 Step 3 中间产物,不修改正式 `00-需求文档.md` |
| 当前策略 | 从头开始;每完成一个 Step 停审;不自动跨 Step |

### 0.1 Step 内计划

| 序号 | 动作 | 状态 | 结果 |
|---|---|---|---|
| 1 | 回读项目台账、需求 flow、Step 1 和 Step 2 | done | 确认当前只允许进入 Step 3,不得跳到 Step 4 或正式文档。 |
| 2 | 读取需求 SOP Step 3 和书写规范 4.3 | done | 确认本章只写业务背景、现状与问题、业务问题 / 技术问题。 |
| 3 | 读取旧 README、旧 `00/01/02/03/05/06` 的背景和问题线索 | done | 识别旧问题层混入 ProviderContract、QueryCapabilities、secret、cost、marketplace、指标和验收门禁。 |
| 4 | 读取 `六域模型`、`标准对齐全景图` 和相邻仓问题层 | done | 确认 capability-hub 是横切能力之一,且 method-library、governance、SDK 均不能被本仓问题层反向接管。 |
| 5 | 回答 Step 3 四个 SOP 问题 | done | 形成业务背景、主要问题、量化处理和业务 / 技术问题分类。 |
| 6 | 诊断旧材料中的问题定义污染 | done | 将旧功能名、旧对象名、旧指标和旧基础设施依赖压回后续 Step 审计。 |
| 7 | 形成结构化背景短文字、问题表和二分表 | done | 生成正式 §3 可回填候选。 |
| 8 | 判定 blocker 并停审 | done | 未发现阻塞 Step 3 的上游 blocker,等待用户确认是否进入 Step 4。 |

---

## 1. 本步目标

说明为什么 `L3-capability-hub` 值得在当前阶段单独校准:Quantalithos 已把 capability-hub 置于六域之外的横切能力层,用于承接外部 MCP / A2A / API 能力接入语境。随着 runtime、tools、governance、method-library、SDK 和生态入口都会引用外部能力,平台需要一套干净的问题定义,解释为什么外部能力正式接入事实不能继续散落在执行层、本地配置、局部白名单、客户端封装或 listing 语境里。

本步只写背景与问题,不写:

- 目标与非目标
- 核心能力闭环
- 用户故事
- 功能需求
- 业务规则
- 数据归属
- 接口设计
- 非功能指标

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_01_upstream_relation.md` | 已完成 | 固定上游来源,确认问题层只能围绕“能力注册 / 外部 MCP / A2A / API 集成中心”主题收束。 |
| `design-calibration/00_req_step_02_position_boundary.md` | 已完成 | 固定本仓是 capability identity、capability registry 与 adapter descriptor 的能力接入真相仓。 |
| `standards/document/需求文档讨论流程_SOP.md` | 已读 | 约束 Step 3 只回答业务背景、主要痛点 / 机会点、量化处理和业务 / 技术问题分类。 |
| `standards/document/需求文档书写规范.md` | 已读 | 约束正式 §3 必须输出背景短文字、问题表和二分表。 |
| `standards/document/设计文档讨论中间产物规范.md` | 已读 | 约束 Step 文件必须记录计划、诊断、取舍、结构化产物和停审门禁。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已读 | 约束 Step 3 不把方案、对象、字段、接口和实现组织写成问题定义。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已读 | 提供 `L3-capability-hub` 在 L3 方法能力层中的横切集成背景。 |
| `product/六域模型.md` | 已读 | 固定 capability-hub 是六域之外的四条横切能力之一,为 runtime / process / governance 等提供外部能力接入语境。 |
| `architecture/标准对齐全景图.md` | 已读 | 固定 capability-hub 主要对齐 MCP、A2A 和 42001 A.10 第三方治理,提供产品 / 标准背景。 |
| `projects/L3-capability-hub/README.md` | 已读 | 作为旧仓背景材料和历史问题线索输入。 |
| 旧 `projects/L3-capability-hub/00-需求文档.md` | 已读 | 作为旧问题定义和伪量化污染诊断输入。 |
| 旧 `projects/L3-capability-hub/01-架构设计.md` ~ `06-验收标准.md` | 已读 | 作为旧架构 / 概要 / 测试 / 验收反向污染问题层的样本输入。 |
| `projects/L3-method-library/00-需求文档.md` | 已读 | 固定方法资产定义问题不归本仓。 |
| `projects/L1-governance/00-需求文档.md` | 已读 | 固定 governance approval / policy effective fact 问题不归本仓。 |
| `projects/L0-sdk/00-需求文档.md` | 已读 | 固定 SDK client / package / 三语言接入问题不归本仓。 |
| `projects/L1-governance/design-calibration/00_req_step_03_problem_context.md` | 已读 | 仅作为 Step 3 粒度和组织方式参考,不作为领域来源。 |

---

## 3. SOP 问题回答

### 3.1 当前业务背景是什么？

在 Quantalithos 的六域 + 横切能力结构中,`L3-capability-hub` 被定义为承接外部 MCP、A2A 和 API 集成的横切能力。随着 runtime、tools、governance、method-library、SDK 和生态入口都需要引用外部能力,平台需要先在需求层讲清这些外部能力为什么要有统一的正式接入语境,而不是继续让各侧在本地配置、局部定义、策略结果或只读目录中各自维护一份外部能力语义。

当前值得讨论 capability-hub,不是因为要先实现某个 provider 接口,而是因为外部能力的种类、协议和消费侧都在增长。如果问题层不先收束,后续架构、详细设计、测试和实施计划都会沿用旧“能力池”叙事,把能力接入 truth 和 execution、governance、SDK、marketplace、secret、cost 等相邻语境继续混写。

### 3.2 当前的主要痛点或机会点是什么？

主要痛点不是“缺少某个调用接口”,而是外部能力正式接入语义没有独立的需求层收束:

- 外部能力身份、注册和接入描述容易散落到 runtime / tools 的本地配置里。
- 相邻仓会用自己的语境表达外部能力:method-library 会引用能力语义,governance 会输出策略结论,SDK 会暴露客户端能力,marketplace 会展示可发现目录。
- 旧项目材料又把 ProviderContract、白名单、secret、cost、metadata、policy refresh、runtime 调用和 listing 统一塞进“能力池”叙事,导致问题层一开始就不干净。

机会点则是:当前 Step 1 和 Step 2 已经先把来源和边界收紧,现在可以把 capability-hub 的问题主线从“缺什么功能”改成“为什么外部能力正式接入语义需要单独成立”,为后续目标、能力闭环和功能裁剪建立干净前提。

### 3.3 这些问题能否量化？

当前不能可靠量化为运行时指标。旧文档中的 `QueryCapabilities P95 < 50ms`、`policy refresh < 30s`、明文 key 落盘次数 `0`、成本覆盖率 `100%`、MCP / provider 数量上限等,更适合后续非功能、测试或验收阶段判断,不应在 Step 3 伪装成问题量化。

本步采用“当前表现 + 影响范围 / 后果”的方式表达问题:

| 问题 | 当前表现 | 影响范围 / 后果 |
|---|---|---|
| 外部能力正式接入语义缺少统一需求收束 | 旧材料同时把 MCP、A2A、provider、白名单、secret、成本、policy、marketplace 和 runtime 调用写入 capability-hub 叙事。 | 后续需求会把能力身份、注册目录、接入描述、执行状态、治理裁决和交易展示混成一套 truth,形成多真相源。 |
| Access 与 execution / definition / governance / client 容易混写 | runtime / tools 消费外部能力接入事实,method-library 定义方法资产,governance 拥有 approval / Policy truth,SDK 封装客户端接入;旧材料多次把这些语境合成一个“统一能力入口”。 | 架构、详细设计和测试会反复在执行仓、方法库、治理仓、SDK 和 capability-hub 之间选边,实现侧容易私补字段、状态或接口。 |
| 旧问题定义把方案、对象、指标和基础设施写进背景层 | 旧 `00~06` 已提前写出 ProviderContract、QueryCapabilities、CostRecord、KMS/Vault、P95、30s、测试用例和验收门禁。 | 如果直接继承,后续 Step 会被旧对象和旧指标牵引,无法按当前标准重新裁剪核心能力、数据归属、接口和验收。 |

### 3.4 哪些是业务问题,哪些是技术问题？

| 类型 | 内容 |
|---|---|
| 业务问题 | 平台缺少对“哪些外部能力以什么身份被正式接入、如何被稳定识别和描述、相邻系统如何理解这些接入事实”的统一需求语言;用户、管理员、运行系统和生态入口难以稳定判断外部能力是否处于正式接入语境。 |
| 技术问题 | 如果能力接入事实不独立收束,后续设计与实现会在 runtime execution、tool execution、method asset、governance approval / Policy truth、SDK client、secret store、cost accounting 和 marketplace listing 之间反复串线,产生多真相源和不可落码边界。 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 当前处理 |
|---|---|---|---|
| `README.md` | 用“能力池”描述 MCP / A2A / provider / 白名单 / 成本记账 / Policy 消费 | 问题层把正式接入语义和 secret、cost、execution、listing 混在一起 | 只保留“外部能力不能散落在各侧本地管理”这一背景线索 |
| 旧 `00-需求文档.md` §2 | 业务背景中直接并列 provider key / quota / cost / whitelist / Policy 下发 | 背景层过早带入后续功能、规则和依赖 | 改写为“外部能力正式接入语义缺少统一需求收束” |
| 旧 `00-需求文档.md` §2.2 / §2.3 / §2.4 | 把 README 骨架、MCP/A2A、provider 合同、Policy 下发、审计和成本覆盖率写成痛点与量化依据 | 问题层混有目标、NFR、测试和验收指标 | 旧数字和对象后移到 Step 13 / Step 14 候选审计 |
| 旧 `01-架构设计.md` §1 | 用 provider key、quota、cost、Policy 刷新、QueryCapabilities 高频路径定义驱动力 | 架构和能力名反向污染需求问题层 | 只保留“外部能力不应由 runtime / tools 直接持有”这一背景提醒 |
| 旧 `02-概要设计.md` §2 | 把 registry / contract / decision / cost / distribution 五段主线直接写成问题收束 | 问题层被旧子域和旧主线命名锁死 | 当前不继承五段主线命名,后续 Step 7 再重新命名和裁剪 |
| 旧 `03/05/06` | 详细设计、测试和验收已提前固定旧对象、旧指标和旧门禁 | 下游文件反向定义了 Step 3 应关注的问题 | 仅作 historical material,不反向支配当前问题层 |
| `六域模型` / `标准对齐全景图` | 提供 capability-hub 是横切能力、对齐 MCP / A2A / A.10 第三方治理的背景 | 若直接照搬,仍可能把“第三方治理”误扩张成 governance truth 或安全平台 | 只作为产品与标准背景,不直接生成对象或方案 |

---

## 5. 改动前后对比

| 项 | restart 前活跃口径 | 当前 Step 3 口径 | 原因 |
|---|---|---|---|
| 背景主线 | 平台要安全、可审计、可计费地使用外部能力 | 平台缺少统一的外部能力正式接入语义 | 先解释 capability-hub 为什么成立,而不是先写安全 / 成本 / 审计目标 |
| 问题表达 | ProviderContract、白名单、secret、cost、Policy refresh、marketplace metadata 并列为痛点 | 收敛为 3 个核心问题:接入语义未统一、相邻语境混写、旧问题层被方案和指标污染 | 避免 Step 3 写成功能表或对象表 |
| 量化处理 | 直接写 P95、30s、覆盖率、零明文落盘 | 当前不采用伪量化,改为“当前表现 + 影响范围 / 后果” | 旧数字没有当前正式测量或验收来源 |
| 业务 / 技术分类 | 技术问题直接写成 registry / directory / provider / cost / whitelist + Policy 联动 | 业务问题聚焦统一接入语言;技术问题聚焦多真相与不可落码边界 | 更符合 4.3 规范和 Step 2 边界 |

---

## 6. 设计取舍

| 方案 | 表达方式 | 优点 | 缺点 | 结论 |
|---|---|---|---|---|
| 方案 A | 问题是 runtime / tools 还不能安全调用外部能力 | 贴近旧文档,容易理解 | 容易把 capability-hub 问题层写成执行控制面或调用网关 | 不采用为主线 |
| 方案 B | 问题是外部能力正式接入语义缺少统一需求收束 | 与 Step 2 定位一致,能保护 access truth 与 execution / governance / SDK 分离 | 需要后续 Step 再展开目标和能力闭环 | 采用 |
| 方案 C | 问题是 provider key、成本、Policy refresh、QueryCapabilities 等能力未实现 | 旧材料内容多,显得“具体” | 已经进入目标、功能、NFR 和验收,且多处越界 | 不采用 |
| 方案 D | 问题是 marketplace 需要能力 listing / metadata | 能解释生态入口 | 会把 listing / transaction truth 过早拉入本仓 | 不采用 |

### 6.1 是否保留旧量化指标

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 在 Step 3 保留 `P95`、`30s`、覆盖率、零明文落盘、容量上限 | 看起来量化,但会把 NFR / 测试 / 验收目标伪装成问题定义 |
| 方案 B | Step 3 不使用旧数字,后续 Step 13 / Step 14 再判断是否保留 | 问题定义更干净,避免伪量化和旧功能名绑架后文 |

推荐方案 B。原因是当前没有来自正式基线的测量来源,旧数字最多只能作为后续候选输入。

### 6.2 是否把 secret / cost / marketplace 作为问题主线

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 继续把 secret、cost、marketplace metadata 作为 capability-hub 为什么值得做的核心问题 | 会把 Step 3 重新拖回旧能力池叙事 |
| 方案 B | 只把它们记录为旧问题层的污染源或后续候选接缝 | 能先保护 capability access truth 主线,再由后续 Step 裁定是否保留最小必要面 |

推荐方案 B。原因是 Step 2 已经把 secret / cost / listing 排出仓级定位,Step 3 不应再把它们升回问题主线。

---

## 7. 结构化中间产物

### 7.1 业务背景结论

在 Quantalithos 的六域 + 横切能力结构中,`L3-capability-hub` 承担外部 MCP、A2A 和 API 集成的横切接入语境。随着 runtime、tools、governance、method-library、SDK 和生态入口都需要引用外部能力,平台需要先在需求层明确这些能力为什么要有统一的正式接入语境,避免各侧继续在本地配置、局部定义、策略结果或只读目录中各自维护一份外部能力语义。

### 7.2 现状与问题结论

| 问题编号 | 问题 | 当前表现 | 影响范围 / 后果 |
|---|---|---|---|
| `P-CH-001` | 外部能力正式接入语义缺少统一需求收束 | 旧材料同时把 MCP、A2A、provider、白名单、secret、成本、policy、marketplace 和 runtime 调用写入 capability-hub 叙事。 | 后续需求会把能力身份、注册目录、接入描述、执行状态、治理裁决和交易展示混成一套 truth,形成多真相源。 |
| `P-CH-002` | Access 与 execution / definition / governance / client 容易混写 | runtime / tools 消费外部能力接入事实,method-library 定义方法资产,governance 拥有 approval / Policy truth,SDK 封装客户端接入;旧材料多次把这些语境合成一个“统一能力入口”。 | 架构、详细设计和测试会反复在执行仓、方法库、治理仓、SDK 和 capability-hub 之间选边,实现侧容易私补字段、状态或接口。 |
| `P-CH-003` | 旧问题定义把方案、对象、指标和基础设施写进背景层 | 旧 `00~06` 已提前写出 ProviderContract、QueryCapabilities、CostRecord、KMS/Vault、P95、30s、测试用例和验收门禁。 | 如果直接继承,后续 Step 会被旧对象和旧指标牵引,无法按当前标准重新裁剪核心能力、数据归属、接口和验收。 |

### 7.3 问题分类结论

| 类型 | 内容 |
|---|---|
| 业务问题 | 平台缺少对“哪些外部能力以什么身份被正式接入、如何被稳定识别和描述、相邻系统如何理解这些接入事实”的统一需求语言;用户、管理员、运行系统和生态入口难以稳定判断外部能力是否处于正式接入语境。 |
| 技术问题 | 如果能力接入事实不独立收束,后续设计与实现会在 runtime execution、tool execution、method asset、governance approval / Policy truth、SDK client、secret store、cost accounting 和 marketplace listing 之间反复串线,产生多真相源和不可落码边界。 |

---

## 8. 回填草稿

以下内容供 Step 17 组装正式 `00-需求文档.md` 时回填到 §3:

```md
## 3. 背景与问题定义

> 校准来源：
> - `design-calibration/00_req_step_03_problem_context.md`
>
> 延伸阅读：
> - 建议继续阅读 `design-calibration/00_req_step_03_problem_context.md` 的“结构化中间产物”“当前文档问题诊断”和“设计取舍”小节,了解本章如何从旧文档中的背景、痛点和边界风险收敛为当前问题主线。

### 3.1 业务背景

在 Quantalithos 的六域 + 横切能力结构中,`L3-capability-hub` 承担外部 MCP、A2A 和 API 集成的横切接入语境。随着 runtime、tools、governance、method-library、SDK 和生态入口都需要引用外部能力,平台需要先在需求层明确这些能力为什么要有统一的正式接入语境,避免各侧继续在本地配置、局部定义、策略结果或只读目录中各自维护一份外部能力语义。

### 3.2 现状与问题

| 问题 | 当前表现 | 影响范围 / 后果 |
|---|---|---|
| 外部能力正式接入语义缺少统一需求收束 | 旧材料同时把 MCP、A2A、provider、白名单、secret、成本、policy、marketplace 和 runtime 调用写入 capability-hub 叙事。 | 后续需求会把能力身份、注册目录、接入描述、执行状态、治理裁决和交易展示混成一套 truth,形成多真相源。 |
| Access 与 execution / definition / governance / client 容易混写 | runtime / tools 消费外部能力接入事实,method-library 定义方法资产,governance 拥有 approval / Policy truth,SDK 封装客户端接入;旧材料多次把这些语境合成一个“统一能力入口”。 | 架构、详细设计和测试会反复在执行仓、方法库、治理仓、SDK 和 capability-hub 之间选边,实现侧容易私补字段、状态或接口。 |
| 旧问题定义把方案、对象、指标和基础设施写进背景层 | 旧 `00~06` 已提前写出 ProviderContract、QueryCapabilities、CostRecord、KMS/Vault、P95、30s、测试用例和验收门禁。 | 如果直接继承,后续 Step 会被旧对象和旧指标牵引,无法按当前标准重新裁剪核心能力、数据归属、接口和验收。 |

### 3.3 业务问题 vs 技术问题

| 类型 | 内容 |
|---|---|
| 业务问题 | 平台缺少对“哪些外部能力以什么身份被正式接入、如何被稳定识别和描述、相邻系统如何理解这些接入事实”的统一需求语言;用户、管理员、运行系统和生态入口难以稳定判断外部能力是否处于正式接入语境。 |
| 技术问题 | 如果能力接入事实不独立收束,后续设计与实现会在 runtime execution、tool execution、method asset、governance approval / Policy truth、SDK client、secret store、cost accounting 和 marketplace listing 之间反复串线,产生多真相源和不可落码边界。 |
```

---

## 9. 待确认事项

| ID | 待确认事项 | 当前状态 | 是否阻塞 Step 3 | 后续处理 |
|---|---|---|---|---|
| `OQ-CH-010` | 旧材料中的“白名单 / allow-deny”后续是否只保留为治理接缝或策略结果,还是要进入 capability-hub 自有核心能力表达 | pending | 否 | Step 4 / Step 7 / Step 10 |
| `OQ-CH-011` | 旧 `provider` 语境是否需要统一重命名为外部 API adapter / provider adapter,以避免 provider runtime 和 secret 托管混入 | pending | 否 | Step 7 / Step 11 / Step 12 |
| `OQ-CH-012` | secret / cost / audit 线索后续是否完全排除,还是仅保留为 observability / finance 的事件协作背景 | pending | 否 | Step 4 / Step 13 / Step 14 |
| `OQ-CH-013` | marketplace 是否只作为能力可发现性的下游消费语境,不进入 listing / transaction truth | pending | 否 | Step 4 / Step 6 / Step 12 |

---

## 10. Blocker 判定

| Blocker 候选 | 判定 | 理由 | 当前处理 |
|---|---|---|---|
| 旧背景和问题定义严重混入方案、目标、NFR 和验收 | `historical_conflict_not_blocker` | 冲突说明旧材料不能继承,但不阻塞当前重新定义问题层 | 已转为历史差异审计;后续 Step 按当前边界重建 |
| 旧量化指标无当前测量来源 | `not_blocker_for_step_03` | Step 3 可采用当前表现与影响后果表达,不需要伪量化 | 旧指标后移到 Step 13 / Step 14 候选审计 |
| provider / secret / cost / policy 具体归属未最终裁剪 | `not_blocker_for_step_03` | Step 3 只需说明它们在旧问题层混写,具体范围由后续 Step 裁定 | Step 4 / Step 7 / Step 10~14 闭合 |

结论: 未发现阻塞 `00-需求文档.md` Step 3 的上游 blocker。

---

## 11. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 已说明当前业务背景 | pass | 背景围绕外部能力正式接入语境为什么需要单独收束。 |
| 已列出 1~3 个主要问题 | pass | 三个问题分别覆盖接入语义未统一、相邻语境混写、旧问题层污染。 |
| 能量化的问题已处理 | pass | 当前无可靠正式量化来源;旧指标已后置,未伪量化。 |
| 已区分业务问题和技术问题 | pass | 已给出二分表。 |
| 未写目标与非目标 | pass | 未承诺要实现哪些状态或能力。 |
| 未写核心能力 / 功能 / 规则 / 数据 / 接口 / NFR | pass | 仅记录后续落点和历史冲突。 |
| 是否可进入 Step 4 | `blocked_until_user_confirm` | 必须等待用户确认后才能继续。 |
