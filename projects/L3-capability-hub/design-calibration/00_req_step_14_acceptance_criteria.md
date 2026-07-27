# 00 Step 14 · 验收标准

> 所属文档: `00-需求文档.md`
> Step: Step 14
> 目标章节: 正式文档 §14 `验收标准`
> 当前状态: completed_stop_review
> 当前约束: 本步只把 Step 7 核心能力闭环、Step 9 功能需求、Step 10 规则边界、Step 11 数据归属和 Step 13 非功能要求收口为需求层验收条件;不得写测试步骤、接口调用、测试脚本、CI、监控实现、测试数据准备、真实证据、验收签署或实施计划。

---

## 1. Step 状态

| 字段 | 值 |
|---|---|
| step | Step 14 |
| status | completed_stop_review |
| gate_status | pass_for_step_14_only |
| previous_step | Step 13 `非功能需求` |
| next_allowed_action | wait_user_review_to_step_15 |
| formal_section | `00-需求文档.md` §14 |
| formal_write_status | not_written |
| blocker_status | no_upstream_blocker_for_step_14 |

---

## 2. Step 内计划

| 序号 | 动作 | 状态 | 输出 |
|---|---|---|---|
| 1 | 回读项目台账、需求 flow、Step 7 / 9 / 10 / 11 / 12 / 13 | done | 确认用户已同意进入 Step 14,且不得跳到 Step 15 或正式文档装配。 |
| 2 | 读取需求 SOP Step 14 和书写规范 4.14 | done | 确认验收类别固定为核心能力闭环、功能能力、规则 / 边界、数据归属、非功能验收五类,并必须列一票否决项。 |
| 3 | 读取讨论中间产物规范和真相源闭环标准 | done | 确认本步要保留问题回答、诊断、取舍、结构化产物、回填草稿和停审门禁,且验收项必须可追溯到已确认来源。 |
| 4 | 读取上游参考 Step 14 | done | 参考 `L1-governance`、`L3-method-library`、`L0-sdk` 的验收粒度和一票否决组织方式,不复制其它领域内容。 |
| 5 | 审计旧 `00-需求文档.md` §11 验收口径 | done | 识别旧 Given-When-Then、`QueryCapabilities`、Policy 30s、KMS / Vault、CostRecord、白名单执行和旧量化指标污染。 |
| 6 | 按 C-CH-1~C-CH-5 回答 SOP 问题 | done | 形成能力级验收判断和跨能力否决方向。 |
| 7 | 按五类验收类别收敛验收项 | done | 形成 `AC-CH-001~037` 验收标准表。 |
| 8 | 收敛一票否决项 | done | 形成 `VF-CH-001~013` 一票否决项,只覆盖核心闭环断裂、边界打穿和质量底线失效。 |
| 9 | 做验收项与功能 / 规则 / 数据 / 非功能映射 | done | 确认无孤儿验收项、无未承接核心功能、无未承接硬规则。 |
| 10 | 形成回填草稿、自检与停审 | done | 为正式 §14 提供可回填候选,但不写入正式文档。 |

---

## 3. 本步输入与读取结论

### 3.1 前序 Step 输入

| 来源 | 已确认结论 | 对 Step 14 的影响 |
|---|---|---|
| Step 7 | 核心能力闭环为 C-CH-1 稳定身份、C-CH-2 注册目录、C-CH-3 adapter descriptor、C-CH-4 governance seam / method relation、C-CH-5 formal exposure / 受控消费。 | 验收必须先证明五个能力节点共同成立,不能以旧接口或旧对象替代闭环。 |
| Step 9 | 功能需求为 `FR-CH-001~016`,外围增强为 `FR-CH-E01~E07`。 | 功能能力验收必须覆盖所有核心 FR;外围增强只验“不阻塞核心闭环且不改变 truth 边界”。 |
| Step 10 | 业务规则为 `BR-CH-001~037` 与 `BR-CH-E001`,覆盖不变量、禁止行为、显式变化、边界约束、治理约束和审计约束。 | 规则 / 边界验收必须证明 execution、secret、cost、governance truth、method body、SDK client、marketplace、observability 等边界没有回流。 |
| Step 11 | 本仓真相数据限定为 capability access truth;快照、引用和禁止保存正文边界已明确。 | 数据归属验收必须证明 truth、snapshot、ref、forbidden body 分层成立。 |
| Step 12 | 接口与依赖已收敛为能力级接口面和依赖边界;`L0-core` 是唯一编译期依赖候选,其余为事件协作、运行期或消费边界。 | 验收不得写 API / event / DTO;但需要确认消费视图、变化协作和依赖裁剪没有反向造 truth。 |
| Step 13 | 非功能需求为 `NFR-CH-001~020`,按性能、可用性、安全、审计 / 可追溯、幂等 / 一致性、可观测性六类组织。 | 非功能验收使用需求层判断口径,不继承旧 P95、30s、SLA、100% cost、grep 等硬指标。 |

### 3.2 规范输入

| 输入文件 | 本步读取重点 | 对 Step 14 的约束 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 14 | 验收必须把目标、核心能力闭环、功能、规则、数据和 NFR 收口成可判断验收条件。 | 验收项必须能回指能力节点、功能需求、规则、数据归属或 NFR。 |
| `需求文档书写规范.md` 4.14 | 验收类别固定为五类;验收项写“验什么”,验收条件写“怎样算通过”。 | 不得写测试脚本、测试步骤、QA 工具、CI、监控实现、测试数据准备或接口调用步骤。 |
| `设计文档讨论中间产物规范.md` | Step 文件必须独立保留问题回答、诊断、取舍、结构化产物、回填草稿和停审状态。 | 不得直接生成正式 §14,也不得省略中间产物。 |
| `设计真相源闭环与可落码性标准.md` | 验收必须保护唯一 truth source,不得让消费视图、派生视图或相邻仓正文替代本仓 truth。 | 一票否决项必须覆盖 truth owner 失效、多真相源和边界打穿。 |

### 3.3 上游参考输入

| 参考文件 | 使用方式 | 结论 |
|---|---|---|
| `projects/L1-governance/design-calibration/00_req_step_14_acceptance_criteria.md` | 参考“先 SOP 问题回答,再五类验收表,再一票否决和映射”的结构。 | 本仓也采用需求层验收条件,不写测试步骤或证据路径。 |
| `projects/L3-method-library/design-calibration/00_req_step_14_acceptance_criteria.md` | 参考“能力节点级停审、外围增强不阻塞核心、旧材料差异审计”的粒度。 | capability-hub 的外围增强也不得作为核心闭环通过前置。 |
| `projects/L0-sdk/design-calibration/00_req_step_14_acceptance_criteria.md` | 参考“客户端 / 服务端 truth 分层、一票否决保护上游 truth”的写法。 | 本仓的服务端 exposure boundary 可以被 SDK 消费,但 SDK client 不能回流成 truth。 |

### 3.4 目标旧验收输入

| 旧材料 | 可保留线索 | 不可继承口径 |
|---|---|---|
| 旧 `00` §11.1 功能验收 | 外部能力接入、descriptor、治理变化、下游消费和安全审查需要可判断。 | `RegisterMcpServer`、`RegisterProvider`、`QueryCapabilities`、Given-When-Then、runtime 调用拒绝、CostRecord 生成、事件发出不进入需求验收。 |
| 旧 `00` §11.2 非功能验收 | 安全、性能、延迟、审计方向需要后续质量验收。 | `明文 key grep 0`、`未白名单拦截率 100%`、`QueryCapabilities P95 < 50ms`、`Policy refresh < 30s`、`成本覆盖 100%` 不作为当前硬验收。 |
| 旧 `00` §11.3 主功能完成口径 | 旧文档试图给出完成口径。 | “白名单 / KMS / 审计成立”“成本记账链可用”“测试通过”混入边界外能力、实现方式和测试执行。 |

---

## 4. SOP 问题回答

### 4.1 哪些条件满足后,核心能力闭环算成立?

核心能力闭环验收必须证明 `L3-capability-hub` 不是 runtime execution gateway、tool execution gateway、governance approval store、method body store、SDK client、marketplace listing、secret / KMS 平台、cost ledger 或 observability store,而是一处外部 MCP / A2A / API capability access truth owner。

| 闭环节点 | 验收判断 |
|---|---|
| C-CH-1 稳定身份 | 外部能力能够形成稳定 capability identity,且 identity 不由 URL、provider 名、tool config、runtime config、SDK client 或 marketplace listing 替代。 |
| C-CH-2 注册目录 | 已识别能力能够进入受控 registry,并形成可解释的可见性和生命周期语义,而不是 allowlist、runtime 状态、cache 或 marketplace listing。 |
| C-CH-3 接入描述 | 已注册能力能够拥有 adapter descriptor、风险 / 约束摘要和必要引用边界,且不保存 secret 正文、不承接 provider runtime、quota、route、cost、failover 或 retry truth。 |
| C-CH-4 治理 / 方法关系接缝 | 接入事实能够引用治理结果并保持接入审查职责分离,同时与 method asset 建立 body-free relation,但不生成 approval / Policy truth,不保存 method body。 |
| C-CH-5 受控消费表达 | formal exposure、正式可见性、受控消费视图和变化感知来源于本仓正式接入事实,下游 runtime / tools / SDK / 产品入口不能反写本仓 truth。 |

### 4.2 哪些功能能力满足后,本次需求算完成?

本次需求通过的功能能力条件是 `FR-CH-001~016` 全部能够以需求层可判断方式成立。`FR-CH-E01~E07` 是外围增强,不作为核心需求通过前置;若后续实现这些增强,它们必须遵守核心 truth 边界和 forbidden body 规则。

| 功能范围 | 验收判断 |
|---|---|
| FR-CH-001~003 | 外部能力接入语境、稳定身份和身份风险解释成立,并保持与认证、runtime 配置、provider runtime、marketplace 和 governance approval 分离。 |
| FR-CH-004~006 | registry 纳入 / 退出、可见性 / 生命周期语义和维护一致性成立,且维护、搜索、派生或对账不得创造正式接入 truth。 |
| FR-CH-007~009 | adapter descriptor、风险 / 约束摘要和描述边界消费支撑成立,且 descriptor 不退化为 secret store、Provider Contract、provider runtime 或 quota / cost / failover contract。 |
| FR-CH-010~013 | governance seam、接入审查职责区分、body-free method relation 和接入事实追溯成立,且不迁入 governance truth 或 method body。 |
| FR-CH-014~016 | formal exposure、正式可见性、受控消费视图和变化协作成立,且消费方、SDK 或事件协作不能反向定义本仓 truth。 |

### 4.3 哪些规则 / 边界被满足后,才算没有串线?

规则 / 边界验收重点不是证明某个 API 或 handler 拦截成功,而是证明本仓的需求边界没有被旧白名单、Policy cache、Provider Contract、CostRecord、QueryCapabilities、KMS / Vault 或 marketplace 口径打穿。

| 规则组 | 验收判断 |
|---|---|
| 不变量 | identity、registry、descriptor、governance seam、method relation、formal exposure 和派生输出的不变量成立。 |
| 禁止行为 | 查询、浏览、导出、消费、维护、索引、事件协作和下游反馈不得隐式创建、修改或替代本仓 truth。 |
| 显式变化 | identity、registry、descriptor、seam、relation、exposure 和维护 / 协作输出的影响性变化必须显式发生。 |
| 边界约束 | execution、secret / provider runtime / cost、governance truth、method body、SDK client、marketplace、observability 边界不被打穿。 |
| 治理 / 审计约束 | 正式可见 / 可用依赖治理结论时必须有 governance seam;关键变化和派生输出必须可追溯且不静默改变 truth。 |

### 4.4 哪些数据边界被满足后,才算数据归属正确?

| 数据类型 | 验收判断 |
|---|---|
| 真相数据 | 外部能力接入语境、capability identity、registry entry、visibility / lifecycle semantics、adapter descriptor、descriptor risk / constraint summary、governance seam relation、access review responsibility separation fact、capability-method body-free relation、traceability record、formal exposure boundary、formal visibility / applicability fact、consumer impact fact 由 capability-hub 拥有。 |
| 快照数据 | governance safe summary、secret safe summary、controlled consumer view、search / browse / export summary、candidate discovery summary、downstream impact summary 和 observability / audit safe summary 只能作为派生或允许摘要,不得成为 truth 写源。 |
| 引用数据 | external source、governance result、method asset、secret、runtime / tools consumer、SDK exposure consumer、observability / audit、external standard 和 marketplace ecosystem object 只保存引用关系,不拥有正文或外部生命周期。 |
| 禁止保存正文 | secret、KMS / Vault、execution、provider runtime、cost / billing、governance approval / Policy / shared_rules、method body、SDK client、marketplace listing / transaction、observability store、production request / response、LLM routing 等正文不得进入本仓生命周期。 |

### 4.5 哪些非功能要求被满足后,才算质量达标?

| 非功能类别 | 验收判断 |
|---|---|
| 性能 | 基础读取、正式变更和受控消费视图不被搜索、导出、审计友好摘要、生态发现或 SDK 说明增强阻塞;性能取舍不得牺牲 truth 完整性。 |
| 可用性 | 外围增强、外部输入、事件协作或下游消费失效时,核心接入事实仍可判断或可解释等待,不得伪造正式结论。 |
| 安全 | 禁止正文、安全摘要 / ref 边界、正式可见性与治理接缝、审查 / governance 职责分离成立。 |
| 审计 / 可追溯 | identity、registry、descriptor、governance seam、method relation、formal exposure、consumer impact 和关键引用关系可解释。 |
| 幂等 / 一致性 | 重复提议、候选发现、governance 线索、消费影响反馈或维护任务不得制造重复 truth 或分叉 exposure。 |
| 可观测性 | 核心状态、关键变化、边界异常、依赖延迟、消费失败和维护失败可识别,但观测材料不替代 capability access truth。 |

### 4.6 哪些失败情形属于一票否决?

一票否决只用于整体不应判定为通过的情况:核心能力节点断裂、truth owner 失效、相邻仓正文回流、消费面反写真相、关键变化不可追溯、重复输入造成分叉、未正式能力被暴露、依赖裁剪被破坏或旧验收口径被作为新版主线。一般展示体验不足、外围增强未完成、后续指标未定稿、测试脚本未编写不属于本 Step 一票否决。

---

## 5. 当前文档问题诊断

| 诊断对象 | 当前表现 | 问题 | Step 14 处理 |
|---|---|---|---|
| 旧 `00` §11.1 功能验收 | 使用 Given-When-Then、接口名和执行方式。 | 混入测试步骤、接口调用和旧对象。 | 重写为需求层验收项,不继承接口名或执行步骤。 |
| 旧 `RegisterMcpServer` / allowlist | 注册 MCP Server 后 state=active,未注册 server 调用被拒绝。 | 把 registry、运行执行和 allow / deny enforcement 混写。 | 重裁为 identity / registry / formal exposure 成立和 execution 边界不得回流。 |
| 旧 `RegisterProvider` / KMS | API key 加密存储、KMS / Vault 集成。 | 把 adapter descriptor 与 secret 平台、provider runtime 混写。 | 只验 descriptor 和 secret ref / safe summary 边界成立。 |
| 旧 `QueryCapabilities` | 查询返回 allow / deny 结果,并绑定 P95。 | 旧查询视图会反向定义 capability truth 和 execution decision。 | 重裁为 formal exposure / controlled consumer view,不得成为 truth 写源。 |
| 旧 Policy 30s 刷新 | governance.policy.updated 后 30s 查询结果更新。 | 本仓不拥有 Policy truth 或白名单刷新执行。 | 只验 governance seam 可追溯、延迟可解释、不得伪造正式结论。 |
| 旧 CostRecord / 成本覆盖 | provider 调用成功后生成 CostRecord 和事件。 | cost / billing / finance ledger 与 execution 不归本仓。 | 作为 historical conflict 排除。 |
| 旧安全 / 性能 / 审计指标 | 明文 key 0、未白名单拦截 100%、P95 < 50ms、成本覆盖 100%。 | 多项绑定边界外对象或测试方式,缺少当前正式能力面。 | 不作为 Step 14 硬验收;保留为后续测试 / 风险阶段候选线索。 |

---

## 6. 设计取舍

### 6.1 验收骨架取舍

| 方案 | 骨架 | 优点 | 缺点 | 当前取舍 |
|---|---|---|---|---|
| 方案 A | 继承旧 `00` §11 Given-When-Then | 看似可执行。 | 混入接口、执行、测试、KMS、成本和旧指标,与当前边界冲突。 | 不采用。 |
| 方案 B | 按 4.14 五类验收和一票否决重写 | 可追溯 Step 7 / 9 / 10 / 11 / 13,并保护 truth boundary。 | 后续 `05-测试方案.md` 仍需展开测试入口和证据。 | 采用。 |
| 方案 C | 只列一票否决项 | 简短,突出红线。 | 无法覆盖功能、数据和 NFR 的普通通过条件。 | 不采用。 |
| 方案 D | 把 Step 12 接口单独列为第六类验收 | 能强调接口依赖。 | 违反书写规范固定五类结构。 | 不采用;接口依赖只进入映射和跨能力审计。 |

### 6.2 关键议题取舍

| 议题 | 当前结论 | 理由 |
|---|---|---|
| 旧量化指标是否作为一票否决 | 不作为一票否决。 | Step 13 已明确旧 P95、30s、SLA、cost、grep 等只是候选或 historical conflict。 |
| runtime 未白名单调用是否作为本仓验收 | 不验 runtime 拒绝动作;验 formal exposure 不被 execution 替代。 | allow / deny enforcement 不归 capability-hub。 |
| secret 安全如何验收 | 验 secret 正文和 KMS / Vault truth 不入仓,只允许 ref / safe summary。 | 本仓不是 secrets 平台。 |
| governance 如何验收 | 验 governance result seam 和职责分离成立,不验 approval / Policy 生成。 | approval / Policy truth 归 `L1-governance`。 |
| method relation 如何验收 | 验 body-free relation 成立且 method body 不入仓。 | relation 属于本仓 access truth,method body 归 `L3-method-library`。 |
| SDK exposure 如何验收 | 验服务端 formal exposure 和受控消费视图成立,SDK client 不反写 truth。 | SDK client / language package 归 `L0-sdk`。 |
| marketplace / observability 如何验收 | 只验只读摘要 / 审计友好输出不替代本仓 truth。 | listing / transaction / audit store / cost ledger 均非本仓 truth。 |

---

## 7. 结构化中间产物

### 7.1 验收类别结论

| 验收类别 | 对应输入 | 覆盖范围 |
|---|---|---|
| 核心能力闭环验收 | Step 7 | C-CH-1~C-CH-5 是否共同成立。 |
| 功能能力验收 | Step 9 | `FR-CH-001~016` 是否完成;`FR-CH-E01~E07` 是否不阻塞核心并遵守边界。 |
| 规则 / 边界验收 | Step 10 | `BR-CH-001~037` 与 `BR-CH-E001` 是否防止串线、越界和隐式变化。 |
| 数据归属验收 | Step 11 | 真相、快照、引用、禁止保存正文四类边界是否成立。 |
| 非功能验收 | Step 13 | 性能、可用性、安全、审计 / 可追溯、幂等 / 一致性、可观测性判断口径是否成立。 |

### 7.2 验收标准表

| 验收类别 | ID | 验收项 | 验收条件 |
|---|---|---|---|
| 核心能力闭环验收 | AC-CH-001 | 稳定外部能力身份成立 | 外部 MCP / A2A / API 能力能够形成稳定 capability identity,并能被 registry、descriptor、governance seam、method relation 和 exposure 持续引用;identity 不由 URL、provider 名、tool config、runtime config、SDK client 或 marketplace listing 替代。 |
| 核心能力闭环验收 | AC-CH-002 | 受控注册目录成立 | 已识别外部能力能够进入受控 registry,并具备可解释的可见性和生命周期语义;registry 不退化为 allowlist、availability bit、runtime cache、执行状态表或 marketplace listing。 |
| 核心能力闭环验收 | AC-CH-003 | 可解释接入描述成立 | 已注册能力能够拥有 adapter descriptor、descriptor risk / constraint summary 和必要 ref / safe summary;descriptor 不保存 secret 正文,也不承接 provider runtime、quota、route、cost、failover 或 retry truth。 |
| 核心能力闭环验收 | AC-CH-004 | 治理 / 方法关系接缝成立 | capability access fact 能承接正式 governance result ref 或允许摘要,并能表达接入审查职责分离和 capability-method body-free relation;本仓不生成 approval / Policy truth,不保存 method body。 |
| 核心能力闭环验收 | AC-CH-005 | 受控消费表达与变化感知成立 | formal exposure boundary、formal visibility、controlled consumer view 和 capability change / consumer impact fact 来源于本仓正式接入事实;runtime、tools、SDK、产品入口、事件协作或导出结果不能反向定义 truth。 |
| 功能能力验收 | AC-CH-006 | 外部能力接入语境能力 | `FR-CH-001` 成立:外部能力能够从散落 URL、provider 名、工具配置或运行配置中抽离出来,形成可讨论、可识别和可后续接入的业务语境。 |
| 功能能力验收 | AC-CH-007 | 能力身份稳定识别能力 | `FR-CH-002` 成立:能力身份能够支撑注册、描述、治理引用、方法关系和下游消费围绕同一 capability identity 协作。 |
| 功能能力验收 | AC-CH-008 | 接入身份风险解释能力 | `FR-CH-003` 成立:身份层风险解释和接入审查语境可被表达,但不替代治理批准、认证系统或 runtime 拦截结论。 |
| 功能能力验收 | AC-CH-009 | 注册目录管理能力 | `FR-CH-004` 成立:已识别能力能够进入或退出受控 registry,registry 成为正式接入事实管理语境而非运行白名单或市场元数据。 |
| 功能能力验收 | AC-CH-010 | 目录可见性与生命周期能力 | `FR-CH-005` 成立:人类和系统能够理解能力在 registry 中的草稿、未描述、未治理、正式可见、退出等接入语境。 |
| 功能能力验收 | AC-CH-011 | 目录维护与一致性保护能力 | `FR-CH-006` 成立:维护、派生、对账和重建只能保护 registry 与正式接入事实一致,不得创造新业务接入结论。 |
| 功能能力验收 | AC-CH-012 | adapter descriptor 表达能力 | `FR-CH-007` 成立:已注册能力能够拥有表达接入方式、能力类型和使用边界的 descriptor,且旧 Provider Contract 被裁剪为接入描述语义。 |
| 功能能力验收 | AC-CH-013 | 接入风险与约束摘要能力 | `FR-CH-008` 成立:descriptor 可携带可被审查和消费理解的风险、约束和敏感边界摘要,但不保存 secret 正文、不实现 KMS / Vault、不替代 governance policy。 |
| 功能能力验收 | AC-CH-014 | 描述边界消费支撑能力 | `FR-CH-009` 成立:下游能围绕同一 descriptor 理解能力边界,不能自行补造 provider runtime、secret、quota、request / response protocol truth。 |
| 功能能力验收 | AC-CH-015 | 治理结果接缝承接能力 | `FR-CH-010` 成立:正式可见 / 可用语境能引用或承接治理结果,不由目录状态、本地白名单或 capability-hub 私有结论自行决定。 |
| 功能能力验收 | AC-CH-016 | 接入审查与治理职责区分能力 | `FR-CH-011` 成立:接入审查意见、本仓接入事实和 `L1-governance` approval / Policy truth 能明确分层。 |
| 功能能力验收 | AC-CH-017 | method asset body-free relation 能力 | `FR-CH-012` 成立:capability 与 method asset 的适用关系能够表达,且只以不保存方法正文的方式成立。 |
| 功能能力验收 | AC-CH-018 | 接入事实追溯能力 | `FR-CH-013` 成立:身份、registry、descriptor、governance seam 和 method relation 之间的链路能够解释外部能力为何处于当前接入语境。 |
| 功能能力验收 | AC-CH-019 | 受控消费表达能力 | `FR-CH-014` 成立:runtime、tools、SDK 或产品入口能按服务端正式边界消费能力接入事实,消费方不能反写本仓 truth。 |
| 功能能力验收 | AC-CH-020 | 正式可见性表达能力 | `FR-CH-015` 成立:正式接入事实能够以可理解的可见性和适用边界呈现,草稿、未治理、未描述和候选能力不会被误当正式能力。 |
| 功能能力验收 | AC-CH-021 | 能力变化协作与感知能力 | `FR-CH-016` 成立:identity、registry、descriptor、governance seam、method relation 和 exposure 的关键变化能被下游持续感知,且变化输出不反向成为 truth。 |
| 功能能力验收 | AC-CH-022 | 外围增强不阻塞核心闭环 | `FR-CH-E01~E07` 未完成时不影响 `FR-CH-001~016` 通过;若实现管理入口、搜索、候选发现、安全摘要深化、SDK 说明、只读生态发现或审计导出,必须遵守核心 truth 边界。 |
| 规则 / 边界验收 | AC-CH-023 | 核心不变量成立 | `BR-CH-001~009` 成立:identity、registry、descriptor、governance seam、method relation、formal exposure 和派生输出的不变量清楚,旧 URL/provider/config/allowlist/cache 等不能替代正式语义。 |
| 规则 / 边界验收 | AC-CH-024 | 禁止行为被阻断 | `BR-CH-010~019` 成立:查询、浏览、导出、消费、维护、索引、事件协作、下游反馈、execution、secret、cost、governance truth、method body、SDK client、marketplace 和 observability 均不得越界写入。 |
| 规则 / 边界验收 | AC-CH-025 | 显式变化成立 | `BR-CH-020~026` 成立:identity、registry、descriptor、access review / governance seam、method relation、formal exposure 和维护 / 协作输出的影响性变化必须显式发生并可说明来源、范围和结果。 |
| 规则 / 边界验收 | AC-CH-026 | 相邻仓边界成立 | `BR-CH-027~033` 成立:runtime / tools、governance、method-library、SDK、provider-secret-cost、marketplace、observability 边界不被打穿。 |
| 规则 / 边界验收 | AC-CH-027 | 治理和审计约束成立 | `BR-CH-034~037` 成立:正式可见 / 可用依赖治理结论时有正式 seam;高风险 descriptor 和 exposure 变化保持职责分离;关键变化和派生输出可追溯。 |
| 规则 / 边界验收 | AC-CH-028 | 外围增强边界成立 | `BR-CH-E001` 成立:管理入口、搜索、候选自动发现、安全摘要深化、SDK 说明、只读生态发现和审计导出不得改变 identity、registry、descriptor、seam、relation 或 exposure 的核心 truth 边界。 |
| 数据归属验收 | AC-CH-029 | capability access truth 归属正确 | Step 11 真相数据归属成立:接入语境、identity、registry、descriptor、governance seam、method relation、traceability、formal exposure、visibility / applicability 和 consumer impact 由 capability-hub 拥有。 |
| 数据归属验收 | AC-CH-030 | 快照数据不成第二真相源 | governance safe summary、secret safe summary、controlled consumer view、search / browse / export summary、candidate summary、downstream impact summary 和 observability / audit summary 只服务解释、消费或导出,不形成独立业务真相生命周期。 |
| 数据归属验收 | AC-CH-031 | 引用数据不接管正文 | external capability source、governance result、method asset、secret、runtime / tools consumer、SDK exposure consumer、observability / audit、external standard 和 marketplace ecosystem object 只作为 ref,不迁入正文、生命周期或执行状态。 |
| 数据归属验收 | AC-CH-032 | 禁止保存正文边界成立 | provider secret、KMS / Vault、runtime / tools execution、provider runtime、cost / billing、governance approval / Policy / shared_rules、method body、SDK client、marketplace listing / transaction、observability store、production request / response、LLM routing 正文不得进入本仓。 |
| 非功能验收 | AC-CH-033 | 性能判断口径成立 | `NFR-CH-001~003` 成立:基础读取、正式变更和受控消费表达不被外围增强阻塞;性能取舍不得牺牲 truth 完整性;旧 P95 不作为当前硬验收。 |
| 非功能验收 | AC-CH-034 | 可用性判断口径成立 | `NFR-CH-004~006` 成立:外围增强、外部输入、事件协作或下游消费失效时,核心接入事实不丢失、不被反写,且不伪造正式结论。 |
| 非功能验收 | AC-CH-035 | 安全判断口径成立 | `NFR-CH-007~010` 成立:禁止正文、safe summary / ref、正式可见性与治理接缝、access review / governance 职责分离成立。 |
| 非功能验收 | AC-CH-036 | 审计 / 追溯与一致性判断口径成立 | `NFR-CH-011~017` 成立:关键变化、引用关系、派生输出可解释;重复输入不制造重复 truth;派生视图可滞后但不得替代正式 truth;消费方不得产生第二 truth。 |
| 非功能验收 | AC-CH-037 | 可观测性判断口径成立 | `NFR-CH-018~020` 成立:核心状态、关键变化、边界异常、依赖延迟、消费失败和维护失败可识别;观测材料不得替代 capability access truth 或保存禁止正文。 |

### 7.3 一票否决项

| ID | 一票否决项 | 否决原因 |
|---|---|---|
| VF-CH-001 | C-CH-1~C-CH-5 任一核心能力闭环节点无法成立。 | 本仓失去 capability access truth owner 定位。 |
| VF-CH-002 | capability identity 由 URL、provider 名、tool config、runtime config、SDK client、marketplace listing 或派生视图替代。 | 稳定身份失效,后续 registry / descriptor / seam / exposure 无法追溯。 |
| VF-CH-003 | registry 退化为 allowlist、runtime 状态、cache、marketplace listing 或 provider availability bit。 | 注册目录真相被执行或生态展示污染。 |
| VF-CH-004 | adapter descriptor 保存 secret 正文,或承接 provider runtime、quota、route、cost、failover、retry truth。 | descriptor 边界被 secret / provider runtime / cost 打穿。 |
| VF-CH-005 | capability-hub 生成或保存 governance approval、Policy effective fact、shared_rules truth,或接入审查意见替代 governance approval。 | governance truth 边界失效。 |
| VF-CH-006 | capability-method relation 保存 method body、definition source truth、TaskDefinition、AIPolicyDef、ProcessTemplateDef 或方法正文版本。 | method-library 边界失效。 |
| VF-CH-007 | runtime、tools、SDK、产品入口、查询视图、导出结果、事件协作或维护任务能够反写 identity、registry、descriptor、seam、relation 或 formal exposure truth。 | 消费面 / 派生面反写真相。 |
| VF-CH-008 | 草稿、候选、未描述、未治理或未满足 formal exposure 条件的能力被当作正式可见 / 可消费能力暴露。 | formal exposure 和安全边界失效。 |
| VF-CH-009 | 关键 identity、registry、descriptor、governance seam、method relation、formal exposure 或 consumer impact 变化不可追溯。 | 审计 / 追溯和一致性底线失效。 |
| VF-CH-010 | 重复接入提议、候选发现、governance 线索、消费反馈或维护任务制造重复 identity、重复 registry fact、分叉 descriptor 或分叉 exposure。 | 幂等 / 一致性底线失效。 |
| VF-CH-011 | cost / billing / finance ledger、observability log / trace / metric / audit store、marketplace transaction / listing 或 production request / response 正文进入本仓数据 truth。 | 数据归属边界被打穿。 |
| VF-CH-012 | `L0-core` 不再是唯一编译期依赖候选,把 `L0-bus`、governance、runtime、tools、SDK、method-library、marketplace、observability 或外部 provider 写成源码级拥有关系。 | 全局依赖裁剪规则失效。 |
| VF-CH-013 | 旧 `QueryCapabilities`、Policy 30s、未白名单拦截 100%、明文 key grep、CostRecord 覆盖、SLA 或 KMS / Vault 口径被作为新版需求验收主线。 | historical material 冲突回流,导致验收对象越界。 |

### 7.4 验收项与功能 / 规则 / 数据 / 非功能映射

| 范围 | 对应验收项 |
|---|---|
| C-CH-1 稳定身份 | AC-CH-001;AC-CH-006;AC-CH-007;AC-CH-008;AC-CH-023;AC-CH-029;AC-CH-036;VF-CH-001;VF-CH-002 |
| C-CH-2 注册目录 | AC-CH-002;AC-CH-009;AC-CH-010;AC-CH-011;AC-CH-023;AC-CH-025;AC-CH-029;AC-CH-030;VF-CH-001;VF-CH-003;VF-CH-010 |
| C-CH-3 接入描述 | AC-CH-003;AC-CH-012;AC-CH-013;AC-CH-014;AC-CH-023;AC-CH-024;AC-CH-029;AC-CH-031;AC-CH-032;AC-CH-035;VF-CH-001;VF-CH-004 |
| C-CH-4 治理 / 方法关系接缝 | AC-CH-004;AC-CH-015;AC-CH-016;AC-CH-017;AC-CH-018;AC-CH-024;AC-CH-027;AC-CH-029;AC-CH-031;AC-CH-032;AC-CH-036;VF-CH-001;VF-CH-005;VF-CH-006;VF-CH-009 |
| C-CH-5 受控消费表达 | AC-CH-005;AC-CH-019;AC-CH-020;AC-CH-021;AC-CH-022;AC-CH-024;AC-CH-025;AC-CH-026;AC-CH-028;AC-CH-030;AC-CH-031;AC-CH-033;AC-CH-034;AC-CH-036;AC-CH-037;VF-CH-001;VF-CH-007;VF-CH-008;VF-CH-010 |
| `FR-CH-001~016` | AC-CH-006~AC-CH-021 |
| `FR-CH-E01~E07` | AC-CH-022;AC-CH-028 |
| `BR-CH-001~009` | AC-CH-023;VF-CH-002;VF-CH-003;VF-CH-004;VF-CH-005;VF-CH-006;VF-CH-007 |
| `BR-CH-010~019` | AC-CH-024;VF-CH-004;VF-CH-005;VF-CH-006;VF-CH-007;VF-CH-011 |
| `BR-CH-020~026` | AC-CH-025;VF-CH-009;VF-CH-010 |
| `BR-CH-027~033` | AC-CH-026;VF-CH-004;VF-CH-005;VF-CH-006;VF-CH-011;VF-CH-012 |
| `BR-CH-034~037` | AC-CH-027;VF-CH-005;VF-CH-009 |
| Step 11 数据归属 | AC-CH-029~AC-CH-032;VF-CH-004;VF-CH-005;VF-CH-006;VF-CH-011 |
| `NFR-CH-001~003` | AC-CH-033 |
| `NFR-CH-004~006` | AC-CH-034 |
| `NFR-CH-007~010` | AC-CH-035 |
| `NFR-CH-011~017` | AC-CH-036 |
| `NFR-CH-018~020` | AC-CH-037 |
| Step 6 / Step 12 依赖裁剪 | VF-CH-012 |
| 历史材料冲突防回流 | VF-CH-013 |

### 7.5 能力级验收停审结论

| 核心能力节点 | 验收承接 | 停审结论 |
|---|---|---|
| C-CH-1 稳定身份 | 核心闭环、FR-CH-001~003、BR-CH-001/010/020、identity truth、NFR 幂等 / 追溯、一票否决。 | 已覆盖身份成立、身份风险解释、身份边界、重复输入和身份替代风险。 |
| C-CH-2 注册目录 | 核心闭环、FR-CH-004~006、BR-CH-002/003/009/011/021/037、registry truth / summary、可用性与一致性验收。 | 已覆盖 registry 管理、生命周期语义、维护不造 truth、派生摘要边界和 registry 退化风险。 |
| C-CH-3 接入描述 | 核心闭环、FR-CH-007~009、BR-CH-004/005/013/022/031、descriptor truth、secret ref / summary、禁止正文、安全验收。 | 已覆盖 adapter descriptor、风险 / 约束摘要、secret/provider/cost 边界和旧 Provider Contract 回流风险。 |
| C-CH-4 治理 / 方法关系接缝 | 核心闭环、FR-CH-010~013、BR-CH-006/007/014/015/019/023/024/028/029/034~036、seam / relation truth、引用与 forbidden body。 | 已覆盖 governance seam、接入审查职责分离、body-free method relation、traceability 和 approval / method body 回流风险。 |
| C-CH-5 受控消费表达 | 核心闭环、FR-CH-014~016、FR-CH-E01~E07、BR-CH-008/012/016/017/018/025~027/030/032/033/E001、formal exposure truth、controlled consumer view、NFR 性能 / 可用性 / 可观测性。 | 已覆盖 formal exposure、正式可见性、受控消费视图、变化感知、下游不反写和外围增强不阻塞核心。 |

### 7.6 跨能力验收审计

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否存在无来源验收项 | 无 | `AC-CH-001~037` 均回指能力节点、功能、规则、数据或 NFR。 |
| 是否存在核心功能无验收承接 | 无 | `FR-CH-001~016` 均由 `AC-CH-006~021` 承接。 |
| 是否存在外围增强误升核心前置 | 未发现 | `FR-CH-E01~E07` 仅由 `AC-CH-022` 和 `AC-CH-028` 管住边界。 |
| 是否存在硬规则无验收承接 | 无 | `BR-CH-001~037` 和 `BR-CH-E001` 均有验收承接或一票否决映射。 |
| 是否存在数据边界无验收承接 | 无 | 真相、快照、引用、禁止保存正文均由 `AC-CH-029~032` 承接。 |
| 是否存在关键 NFR 无验收承接 | 无 | `NFR-CH-001~020` 均由 `AC-CH-033~037` 承接。 |
| 一票否决项是否过宽 | 未发现 | 否决项只覆盖核心闭环断裂、truth 替代、正文回流、边界打穿、不可追溯、重复分叉、依赖裁剪失效和旧口径回流。 |
| 是否写入测试步骤或实现细节 | 未发现 | 未写 Given-When-Then、API 调用、测试脚本、CI、监控实现、测试数据准备、真实 evidence alias 或验收签署。 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §14。正式文档可摘录本文件 §7.1~§7.4 的表格,不重复扩写 SOP 问题回答、文档诊断和设计取舍。

```md
## 14. 验收标准

> 校准来源:
> - `design-calibration/00_req_step_14_acceptance_criteria.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”“一票否决项”和“跨能力验收审计”小节,了解本章如何从核心闭环、功能需求、规则边界、数据归属和非功能要求收敛验收条件。

本文采用 `design-calibration/00_req_step_14_acceptance_criteria.md` §7 的验收结论。验收按核心能力闭环、功能能力、规则 / 边界、数据归属和非功能五类组织;一票否决项只覆盖核心闭环断裂、truth owner 失效、正文回流、边界打穿、消费面反写真相、关键变化不可追溯、幂等一致性失效、依赖裁剪失效和旧口径回流。

正式验收章节应摘录:

- `design-calibration/00_req_step_14_acceptance_criteria.md` §7.1 验收类别结论。
- `design-calibration/00_req_step_14_acceptance_criteria.md` §7.2 验收标准表。
- `design-calibration/00_req_step_14_acceptance_criteria.md` §7.3 一票否决项。
- `design-calibration/00_req_step_14_acceptance_criteria.md` §7.4 验收项与功能 / 规则 / 数据 / 非功能映射。

正式 §14 不应写测试脚本、接口调用步骤、CI、监控实现、测试数据准备、真实 evidence alias 或验收签署。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 当前处理 | 推荐 |
|---|---|---|---|
| OQ-CH-014-001 | 是否把旧 `QueryCapabilities P95 < 50ms` 写成需求验收硬指标 | 当前不写,只保留为后续测试 / 架构阶段候选量化线索。 | 推荐不写入 Step 14 硬验收。 |
| OQ-CH-014-002 | 是否把 Policy 30s 刷新写成验收 | 当前不写,仅验 governance seam 延迟可解释且不得伪造结论。 | 推荐不写入 Step 14。 |
| OQ-CH-014-003 | 是否把未白名单调用拦截 100% 写成验收 | 当前不写 runtime 拦截动作,只验 formal exposure 与 execution 分离。 | 推荐不写入 Step 14。 |
| OQ-CH-014-004 | 是否把明文 key grep 0 写成验收 | 当前不写 grep / 测试方式,只验 secret 正文和 KMS / Vault truth 不入仓。 | 推荐后续测试方案再定义检查方式。 |
| OQ-CH-014-005 | 是否把成本记账覆盖 100% 写成验收 | 当前排除为 historical conflict。 | 推荐不进入本项目验收主线。 |

上述事项不阻塞 Step 14,但应作为 Step 15 风险与待确认事项输入。

---

## 10. Blocker 判定

| blocker | 判定 | 说明 |
|---|---|---|
| 上游 blocker | 未发现 | Step 7 / 9 / 10 / 11 / 12 / 13 均已提供 Step 14 所需输入。 |
| 旧文档冲突 | 不阻塞 | 旧 `00` §11 与 README 中的白名单、KMS、CostRecord、QueryCapabilities、Policy 30s、旧量化指标均已记录为 historical conflict,不作为当前基线。 |
| 正式文档写入 | 未执行 | Step 14 只写中间产物;正式 `00-需求文档.md` 必须等 Step 17。 |

---

## 11. 自检与停审

| 检查项 | 状态 | 说明 |
|---|---|---|
| 已按 Step 14 必读输入执行 | pass | 已读取项目台账、需求 flow、前序 Step、规范、参考项目和旧验收口径。 |
| 已按五类验收类别组织 | pass | 核心能力闭环、功能能力、规则 / 边界、数据归属、非功能验收均已覆盖。 |
| 已列一票否决项 | pass | `VF-CH-001~013` 已覆盖严重失效条件。 |
| 验收项可追溯 | pass | `AC-CH-001~037` 均能回指能力、功能、规则、数据或 NFR。 |
| 未写测试步骤 / 实现细节 | pass | 未写 Given-When-Then、接口调用、脚本、CI、监控、测试数据或验收签署。 |
| 是否发现 Step 14 blocker | no | 无阻塞进入 Step 15 的上游 blocker。 |
| 是否允许进入 Step 15 | no | 当前必须停审,等待用户明确确认。 |

当前 Step 14 已完成并停审。下一步只有在用户确认后,才允许进入 Step 15 `风险与待确认事项`。
