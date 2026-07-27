# 00 Step 11 · 数据需求与数据归属

> 所属文档: `00-需求文档.md`
> Step: Step 11
> 目标章节: 正式文档 §11 `数据需求与数据归属`
> 当前状态: completed_stop_review
> 当前约束: 本步只判断数据项属于 `真相数据`、`快照数据`、`引用数据`、`禁止保存正文` 四类;不得写字段清单、表结构、索引、缓存、outbox / projection / rebuild、repository / service / port、DDL、保留期、归档实现或接口 schema。

---

## 1. Step 状态

| 字段 | 值 |
|---|---|
| step | Step 11 |
| status | completed_stop_review |
| gate_status | pass_for_step_11_only |
| previous_step | Step 10 `业务规则与边界约束` |
| next_allowed_action | wait_user_review_to_step_12 |
| formal_section | `00-需求文档.md` §11 |
| formal_write_status | not_written |
| blocker_status | no_upstream_blocker_for_step_11 |

---

## 2. Step 内计划

| 序号 | 动作 | 状态 | 输出 |
|---|---|---|---|
| 1 | 回读项目台账、需求 flow、Step 9 / Step 10 | done | 确认用户已同意进入 Step 11,且不得跳到 Step 12 或正式文档装配。 |
| 2 | 读取需求 SOP Step 11 和书写规范 4.11 | done | 确认数据类型只能使用 `真相数据`、`快照数据`、`引用数据`、`禁止保存正文`。 |
| 3 | 读取上游参考 Step 11 | done | 参考 `L1-governance`、`L3-method-library`、`L0-sdk` 的数据归属粒度,不复制其它仓数据项。 |
| 4 | 按 C-CH-1~C-CH-5 梳理真相数据候选 | done | 形成 identity、registry、descriptor、governance seam、method relation、formal exposure 的本仓真相数据候选。 |
| 5 | 按上游 truth 梳理快照数据候选 | done | 形成治理结果摘要、secret 安全摘要、消费视图、搜索 / 导出摘要、外部候选摘要等快照数据候选。 |
| 6 | 梳理引用数据候选 | done | 形成 governance result ref、method asset ref、secret ref、external source ref、observability ref、SDK boundary ref 等引用数据候选。 |
| 7 | 梳理禁止保存正文 | done | 覆盖 secret、governance truth、method body、execution、provider runtime、SDK client、marketplace、cost、observability 等正文红线。 |
| 8 | 诊断旧数据章节和历史材料冲突 | done | 将 `CapabilityDecision`、`CostRecord`、`ProviderContract`、`Policy / shared_rules`、KMS / Vault 等旧项重裁。 |
| 9 | 做设计取舍 | done | 采用“核心能力节点 -> 四类数据 -> 功能 / 规则映射”的方式,不采用旧实体 / 生命周期 / ER 图。 |
| 10 | 形成结构化数据归属表、映射表、能力级停审和回填草稿 | done | 为正式 §11 提供可回填候选,但不写入正式文档。 |
| 11 | 自检与停审 | done | 无阻塞 Step 11 的上游 blocker;等待用户确认是否进入 Step 12。 |

---

## 3. 本步输入与读取结论

### 3.1 前序 Step 输入

| 来源 | 已确认结论 | 对 Step 11 的影响 |
|---|---|---|
| Step 2 | 本仓是外部 MCP / A2A / API capability identity、capability registry 与 adapter descriptor 的能力接入真相仓。 | 真相数据必须围绕能力接入事实,不能围绕执行、成本、密钥或交易。 |
| Step 4 | 当前目标是闭合 capability identity、registry、adapter descriptor、governance seam、method relation、SDK exposure boundary;非目标包括 runtime/tools execution、method body、governance truth、SDK client、secret/KMS、cost/billing、marketplace、LLM routing。 | 数据归属必须把非目标转成引用、快照或禁止保存正文。 |
| Step 6 | `L0-core` 是唯一内部编译期依赖候选;`L1-governance` 是结果接缝;`L3-method-library` 只保留 body-free relation;`L0-sdk` 是 exposure 边界消费方。 | 数据项不得把运行期、事件协作或消费边界误写成本仓数据 truth。 |
| Step 7 | 核心能力节点为 C-CH-1 稳定身份、C-CH-2 受控注册目录、C-CH-3 可解释接入描述、C-CH-4 治理 / 方法关系接缝、C-CH-5 受控消费表达与变化感知。 | 数据归属按五个能力节点组织,再做跨能力审计。 |
| Step 9 | 功能需求已收束为 `FR-CH-001~016` 与 `FR-CH-E01~E07`。 | 每类核心数据项必须能回指至少一个功能需求或明确边界规则。 |
| Step 10 | 规则已收束为 `BR-CH-001~037` 与 `BR-CH-E001`,并钉住 execution、secret、governance truth、method body、SDK client、marketplace、observability 等边界。 | Step 11 必须把这些规则转成数据归属红线,不能重新打开规则讨论。 |

### 3.2 规范输入

| 输入文件 | 本步读取重点 | 对 Step 11 的约束 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 11 | 先回答哪些数据由本仓拥有真相、哪些只是快照、哪些只是引用、哪些正文禁止保存,再写结构化产物。 | 不得先沿用旧实体清单,再事后套数据类型。 |
| `需求文档书写规范.md` 4.11 | 数据归属表固定列为“数据项 / 数据类型 / 归属说明 / 生命周期口径”;数据类型固定为四类。 | 不得写字段、表、索引、事务、缓存、outbox、projection、repo、port、DDL。 |
| `设计真相源闭环与可落码性标准.md` | 需求层必须明确 truth owner,防止多真相源和相邻仓正文回流。 | 本步用数据归属保护后续架构 / 详细设计可落码。 |
| `设计文档讨论中间产物规范.md` | Step 文件必须保留问题回答、诊断、取舍、结构化产物、回填草稿和停审状态。 | 本文件必须可作为 Step 12 接口、Step 14 验收和 Step 16 追溯输入。 |

### 3.3 上游参考输入

| 参考文件 | 使用方式 | 结论 |
|---|---|---|
| `projects/L1-governance/design-calibration/00_req_step_11_data_ownership.md` | 参考“真相 / 快照 / 引用 / 禁止保存正文 + 规则映射 + 生命周期口径”结构。 | governance approval、Policy、shared_rules 和治理结论正文不归 capability-hub。 |
| `projects/L3-method-library/design-calibration/00_req_step_11_data_ownership.md` | 参考 body-free relation 与 method body 禁止保存正文的写法。 | method asset 正文、TaskDefinition、AIPolicyDef、ProcessTemplateDef 不得进入 capability-hub。 |
| `projects/L0-sdk/design-calibration/00_req_step_11_data_requirements_ownership.md` | 参考 SDK client / package 与服务端 exposure 边界分离的写法。 | 本仓可拥有服务端 formal exposure truth,但不拥有 SDK client 或 language package truth。 |

### 3.4 目标旧材料输入

| 旧材料 | 可保留线索 | 不可继承口径 |
|---|---|---|
| `MCPServer` / `A2ANode` 聚合根 | MCP / A2A 类外部能力需要身份、注册目录和 descriptor。 | 不继承旧对象名、生命周期枚举、匿名注册拒绝或 allowlist 执行语义。 |
| `ProviderContract` | 外部 API / provider 能力需要可解释接入描述。 | 不继承 API key、quota、route、failover、cost 或 provider runtime truth。 |
| `CapabilityDecision` 查询结果视图 | 下游需要稳定消费正式能力事实。 | 不作为本仓真相数据;只能作为由正式接入事实派生的快照 / 视图线索。 |
| `CostRecord` append-only | 外部调用可能有成本审计诉求。 | cost / billing / finance ledger 不归本仓,不得进入本仓真相数据。 |
| `Policy / shared_rules` | 正式可见 / 可用语境需要 governance 结果接缝。 | Policy truth、shared_rules truth、approval truth 不归本仓。 |
| `KMS / Vault` / provider key | descriptor 涉及敏感边界提示和 secret reference。 | secret 平台、密钥正文、加密托管和 KMS truth 不归本仓。 |
| active registry entries 热存 / retired 冷存 | registry 生命周期需要需求层语义。 | 不继承热存、冷存、保留期、归档策略或删除策略。 |

---

## 4. SOP 问题回答

### 4.1 哪些数据由本仓拥有真相?

`L3-capability-hub` 拥有“外部能力接入事实”的正式真相,包括能力接入语境、稳定身份、注册目录事实、adapter descriptor、接入风险与约束摘要、接入审查事实、governance seam 关系、capability-method body-free relation、正式可见 / formal exposure boundary 和能力接入变化追溯。

这些真相数据的共同特点是:它们描述外部能力如何以正式能力接入事实进入平台,而不是描述外部调用如何执行、治理如何批准、方法资产正文是什么、SDK 如何封装、市场如何交易或成本如何记账。

### 4.2 哪些数据只是快照?

快照数据只服务稳定消费、审查解释、导出或浏览,不能成为新的业务真相写源。当前快照数据包括 governance 结果安全摘要、secret 安全摘要、下游消费影响摘要、搜索 / 浏览 / 导出摘要、目录派生视图、外部候选发现摘要、只读生态发现摘要和审计友好输出摘要。

快照可以来自本仓正式接入事实的派生,也可以来自上游正式 truth 的允许摘要。无论来源如何,快照都不得反向改写 capability identity、registry、descriptor、governance seam、method relation 或 formal exposure。

### 4.3 哪些数据只是引用?

引用数据只保存对外部对象的引用关系,不拥有正文 truth。当前引用包括外部能力来源引用、governance result / policy result 引用、method asset 引用、secret 引用、SDK exposure 消费边界引用、runtime / tools 消费方引用、observability / audit 引用、外部标准 / 协议 / 文档引用和 marketplace 只读生态对象引用。

引用数据可以帮助追溯“本仓事实依赖或关联了谁”,但不能把被引用对象的正文、生命周期或执行状态迁入本仓。

### 4.4 哪些内容绝不能保存正文?

禁止保存正文包括:provider API key / secret 正文、KMS / Vault secret truth、runtime / tools execution、allow / deny enforcement、provider invocation result、provider runtime / quota / route / failover / retry、cost / billing ledger、governance approval / Policy / shared_rules truth、method body、SDK client / language package、marketplace listing / transaction / pricing / fulfillment、observability log / trace / metric / alert / audit store、生产请求 / 响应正文、LLM routing / model selection truth。

这些内容即使在旧文档中出现过,也只能作为 historical material 或边界红线,不得作为本仓数据需求进入正式需求主线。

### 4.5 这些数据在需求层面的生命周期口径是什么?

| 数据类型 | 生命周期口径 |
|---|---|
| 真相数据 | 从能力接入事实正式建立到正式变更、退出或终止,形成完整本仓生命周期。 |
| 快照数据 | 随来源 truth 或本仓正式接入事实变化而更新,不形成独立业务真相生命周期。 |
| 引用数据 | 随引用关系建立、变化或失效而变化,本仓不负责外部正文生命周期。 |
| 禁止保存正文 | 不进入本仓生命周期。 |

### 4.6 当前能力节点的数据需求是否足以进入接口讨论?

是。C-CH-1~C-CH-5 已分别明确本仓拥有的接入事实 truth、可保留的摘要 / 快照、可保存的外部引用和必须排除的正文。Step 12 可以在这些归属基础上讨论接口与依赖,但不得在接口层重新引入 secret 正文、governance truth、method body、runtime execution、SDK client 或 marketplace truth。

---

## 5. 当前文档问题诊断

| 诊断对象 | 当前表现 | 问题 | Step 11 处理 |
|---|---|---|---|
| 旧 `00` §9.1 核心业务实体 | `MCPServer`、`A2ANode`、`ProviderContract`、`CapabilityDecision`、`CostRecord` 并列。 | 把能力接入 truth、查询视图、成本记账和 provider runtime 混在一个实体表。 | 重建为四类数据归属;旧实体名只保留作历史线索。 |
| 旧 `MCPServer` / `A2ANode` 生命周期 | `registered -> active / paused / retired`、`registered -> verified / retired`。 | 提前写状态枚举,且把协议类别当聚合根。 | 改写为 capability identity、registry entry、visibility / lifecycle semantics 的需求层数据。 |
| 旧 `ProviderContract` | provider 配置、key、quota、cost、route 等被隐含合并。 | descriptor、secret、provider runtime、cost 多真相源混写。 | 只保留 adapter descriptor 和安全摘要;secret / runtime / cost 正文禁止保存。 |
| 旧 `CapabilityDecision` | 查询结果视图即时生成,作为数据关系中心。 | 查询视图不应成为 truth;allow / deny 执行也不归本仓。 | 降级为正式接入事实派生快照或 Step 12 接口候选,不得作为真相数据。 |
| 旧 `CostRecord` | append-only 记账记录。 | cost / billing truth 不归 capability-hub。 | 排除为禁止保存正文 / historical conflict,后续只在风险中记录。 |
| 旧 `Policy / shared_rules` 数据关系 | 由 governance 下发后驱动 `CapabilityDecision`。 | governance truth 被写进 capability-hub 数据图。 | 改成 governance result ref / safe summary;approval / Policy / shared_rules 正文禁止保存。 |
| 旧生命周期与归档 | hot / cold / archive / 不删审计历史。 | 属于存储策略和归档实现,不是需求层生命周期。 | 改成四类数据生命周期口径,不写保留期或归档机制。 |

---

## 6. 设计取舍

### 6.1 数据归属骨架取舍

| 方案 | 数据骨架 | 优点 | 缺点 | 当前取舍 |
|---|---|---|---|---|
| 方案 A | 沿用旧实体表 | 迁移快,旧文档名词直观。 | 保留 CostRecord、ProviderContract、Policy、KMS 和状态枚举污染。 | 不采用。 |
| 方案 B | 按四类数据归属重建 | 能直接保护 truth owner,并服务后续接口、验收和追溯。 | 需要后续 01~03 再细化对象、字段和实现。 | 采用。 |
| 方案 C | 只写真相数据 | 篇幅短。 | 无法阻止 secret、governance truth、method body、runtime execution 等正文回流。 | 不采用。 |
| 方案 D | 直接写字段级归属 | 接近落码。 | 违反需求层粒度,会提前锁定设计和存储。 | 不采用。 |

### 6.2 关键数据议题取舍

| 议题 | 当前结论 | 理由 |
|---|---|---|
| governance 结果最小数据 | 正式可见 / 可用依赖治理结论时,本仓必须至少保存 governance result ref;允许摘要只能作为快照补充。 | ref 能守住治理 truth owner;摘要不能替代 formal result。 |
| 接入审查意见 | 本仓可拥有 capability access review fact / risk explanation truth,但不得拥有 governance approval 或 Policy truth。 | 审查意见属于能力接入事实解释;批准结论属于 `L1-governance`。 |
| secret reference | 本仓只保存 secret ref 或允许的安全摘要;secret 正文、KMS / Vault truth 和密钥托管生命周期禁止进入本仓。 | 满足 descriptor 风险解释,同时守住 secret 平台边界。 |
| body-free method relation | 本仓拥有 relation truth,但 method asset 正文和定义版本 truth 仍归 `L3-method-library`。 | relation 是 capability access truth 的一部分;正文不是。 |
| formal exposure boundary | 本仓拥有服务端正式能力边界 truth;SDK client、language package 和客户端 convenience truth 不归本仓。 | Step 9 / Step 10 已明确服务端 boundary 与 SDK client 分层。 |
| `CapabilityDecision` | 不作为真相数据;仅作为由正式接入事实派生的消费快照或接口候选名称。 | 防止查询结果反向定义 capability access truth。 |
| `CostRecord` | 不进入本仓数据需求;成本 / 账单 / finance ledger 正文禁止保存。 | cost/billing 已是 Step 4 非目标和 Step 10 边界红线。 |

---

## 7. 结构化中间产物

### 7.1 数据归属表

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| 外部能力接入语境 | 真相数据 | 外部能力接入语境由 capability-hub 拥有正式真相。 | 随外部能力进入接入讨论、正式变化或终止而变化。 |
| capability identity | 真相数据 | capability identity 由 capability-hub 拥有正式真相。 | 从正式建立到合并、拆分、更正、退役或终止,形成完整本仓生命周期。 |
| identity 风险解释与接入审查事实 | 真相数据 | identity 层风险解释和 capability access review fact 由 capability-hub 拥有正式真相。 | 随接入审查、风险解释变化或失效而显式变化。 |
| capability registry entry | 真相数据 | capability registry entry 由 capability-hub 拥有正式接入事实真相。 | 随注册纳入、退出或正式更正而变化。 |
| registry visibility / lifecycle semantics | 真相数据 | registry 可见性和生命周期语义由 capability-hub 拥有正式真相。 | 随草稿、未描述、未治理、正式可见或退出语境变化而显式变化。 |
| registry maintenance / reconciliation record | 真相数据 | 目录维护、对账和一致性保护结果由 capability-hub 拥有维护事实真相。 | 随维护、对账或一致性检查形成,不得替代业务接入结论。 |
| adapter descriptor | 真相数据 | adapter descriptor 由 capability-hub 拥有正式接入描述真相。 | 随描述建立、替换、退役或约束变化而显式变化。 |
| descriptor risk / constraint summary | 真相数据 | descriptor 相关风险和约束摘要由 capability-hub 拥有正式解释真相。 | 随 descriptor、风险解释或约束语境变化而显式变化。 |
| governance seam relation | 真相数据 | capability 与治理结果之间的 seam relation 由 capability-hub 拥有关系真相。 | 随治理结果引用挂接、替换、失效或移除而变化。 |
| capability access review responsibility separation fact | 真相数据 | 接入审查意见与 governance approval 的职责区分事实由 capability-hub 拥有正式真相。 | 随接入审查语境、治理接缝或职责说明变化而显式变化。 |
| capability-method body-free relation | 真相数据 | capability 与 method asset 的 body-free relation 由 capability-hub 拥有关系真相。 | 随关系建立、变更、失效或移除而显式变化。 |
| capability access traceability record | 真相数据 | 能力身份、注册目录、descriptor、governance seam 和 method relation 的接入事实追溯由 capability-hub 拥有正式真相。 | 随关键接入事实变化形成,用于解释当前接入语境。 |
| formal exposure boundary | 真相数据 | 服务端正式能力暴露边界由 capability-hub 拥有正式真相。 | 随正式消费表达、适用边界或服务端可见性变化而显式变化。 |
| formal visibility / applicability fact | 真相数据 | 正式可见性和适用边界事实由 capability-hub 拥有正式真相。 | 随正式可见、不可见、适用范围或生命周期语境变化而显式变化。 |
| capability change / consumer impact fact | 真相数据 | 能力接入变化和消费影响说明由 capability-hub 拥有正式接入变化真相。 | 随影响 identity、registry、descriptor、seam、relation 或 exposure 的变化形成。 |
| governance result safe summary | 快照数据 | governance result 正式真相不属于 capability-hub,但本仓可为稳定消费保留允许的安全摘要。 | 随 `L1-governance` 正式真相变化而更新,不形成独立治理生命周期。 |
| secret handling safe summary | 快照数据 | secret 正式真相不属于 capability-hub,但本仓可保留不含 secret 正文的安全摘要。 | 随 secret 引用语境或外部 secret 平台允许摘要变化而更新,不形成 secret 生命周期。 |
| directory search / browse summary | 快照数据 | 搜索和浏览摘要由正式接入事实派生,不拥有独立业务真相。 | 随 capability-hub 正式接入事实变化而更新。 |
| exported capability access summary | 快照数据 | 审计友好导出摘要由正式接入事实派生,不拥有独立业务真相。 | 随导出来源范围和正式接入事实变化而更新。 |
| controlled consumer view / CapabilityDecision-style summary | 快照数据 | 受控消费视图或旧 `CapabilityDecision` 类结果由正式接入事实派生,不得成为 truth。 | 随正式接入事实、governance seam 和 formal exposure 变化而更新。 |
| downstream consumption impact summary | 快照数据 | 下游消费影响正文不属于 capability-hub,但本仓可保留必要影响摘要。 | 随下游正式反馈或本仓接入事实变化而更新,不形成下游运行生命周期。 |
| external capability candidate discovery summary | 快照数据 | 外部候选发现结果不是正式接入 truth,本仓只可保留候选摘要。 | 随候选发现语境变化而更新,正式接入前不形成 registry truth。 |
| read-only ecosystem discovery summary | 快照数据 | 生态发现摘要不属于 marketplace truth,本仓只可保留只读发现摘要。 | 随只读发现语境变化而更新,不形成 listing、交易或履约生命周期。 |
| observability / audit safe summary | 快照数据 | observability 正式存储不属于 capability-hub,但本仓可保留审计协作所需安全摘要。 | 随观测来源或接入事实变化而更新,不形成观测存储生命周期。 |
| external capability source ref | 引用数据 | 本仓只保存对外部 MCP / A2A / API 来源对象的引用关系,不拥有外部对象正文真相。 | 随引用关系建立、变化或失效而变化,本仓不负责外部来源正文生命周期。 |
| governance result / policy result ref | 引用数据 | 本仓只保存对 governance result 或 policy result 的引用关系,不拥有治理正文真相。 | 随引用关系建立、替换或失效而变化,本仓不负责治理正文生命周期。 |
| method asset ref | 引用数据 | 本仓只保存对 method asset 的引用关系,不拥有方法资产正文真相。 | 随 relation 建立、变化或失效而变化,本仓不负责 method 正文生命周期。 |
| secret ref | 引用数据 | 本仓只保存对外部 secret 对象的引用关系,不拥有 secret 正文真相。 | 随引用关系建立、变化或失效而变化,本仓不负责 secret 生命周期。 |
| runtime / tools consumer ref | 引用数据 | 本仓只保存对 runtime / tools 消费方或消费语境的引用关系,不拥有执行正文真相。 | 随消费关系建立、变化或失效而变化,本仓不负责执行生命周期。 |
| SDK exposure consumer ref | 引用数据 | 本仓只保存对 SDK 消费边界或版本语境的引用关系,不拥有 SDK client 正文真相。 | 随引用关系建立、变化或失效而变化,本仓不负责 SDK client 生命周期。 |
| observability / audit ref | 引用数据 | 本仓只保存对观测、审计或外部证据位置的引用关系,不拥有观测正文真相。 | 随引用关系建立、变化或失效而变化,本仓不负责观测正文生命周期。 |
| external standard / protocol / document ref | 引用数据 | 本仓只保存对外部标准、协议或文档的引用关系,不拥有外部正文真相。 | 随引用关系建立、变化或失效而变化,本仓不负责外部正文生命周期。 |
| marketplace ecosystem object ref | 引用数据 | 本仓只保存只读生态对象引用,不拥有 listing、交易、定价或履约正文真相。 | 随引用关系建立、变化或失效而变化,本仓不负责 marketplace 生命周期。 |
| provider API key / secret 正文 | 禁止保存正文 | provider API key、token、password、private key 和 secret 正文不属于 capability-hub 真相范围,本仓不得保存其正文。 | 不进入本仓生命周期。 |
| KMS / Vault / secret platform truth | 禁止保存正文 | KMS / Vault 和 secret 平台正文不属于 capability-hub 真相范围,本仓不得保存其正文。 | 不进入本仓生命周期。 |
| runtime / tools execution 正文 | 禁止保存正文 | runtime loop、tools execution、allow / deny enforcement 和外部调用结果不属于 capability-hub 真相范围。 | 不进入本仓生命周期。 |
| provider runtime / quota / route / failover / retry 正文 | 禁止保存正文 | provider runtime、quota、route、failover、retry 和 invocation truth 不属于 capability-hub 真相范围。 | 不进入本仓生命周期。 |
| cost / billing / finance ledger 正文 | 禁止保存正文 | CostRecord、billing、finance ledger 和成本记账正文不属于 capability-hub 真相范围。 | 不进入本仓生命周期。 |
| governance approval / Policy / shared_rules 正文 | 禁止保存正文 | governance approval、Policy effective fact 和 shared_rules truth 不属于 capability-hub 真相范围。 | 不进入本仓生命周期。 |
| method body / definition source truth 正文 | 禁止保存正文 | Method Content、TaskDefinition、AIPolicyDef、ProcessTemplateDef 和方法定义正文不属于 capability-hub 真相范围。 | 不进入本仓生命周期。 |
| SDK client / language package / convenience wrapper 正文 | 禁止保存正文 | SDK client、多语言 package 和客户端便利封装正文不属于 capability-hub 真相范围。 | 不进入本仓生命周期。 |
| marketplace listing / transaction / pricing / fulfillment 正文 | 禁止保存正文 | marketplace listing、交易、定价、履约和生态运营正文不属于 capability-hub 真相范围。 | 不进入本仓生命周期。 |
| observability log / trace / metric / alert / audit store 正文 | 禁止保存正文 | 观测日志、trace、metric、alert、audit store 和 cost ledger 正文不属于 capability-hub 真相范围。 | 不进入本仓生命周期。 |
| production request / response 正文 | 禁止保存正文 | 外部能力生产请求、响应和 payload 正文不属于 capability-hub 真相范围。 | 不进入本仓生命周期。 |
| LLM routing / model selection truth 正文 | 禁止保存正文 | LLM routing、model selection 和 provider orchestration truth 不属于 capability-hub 真相范围。 | 不进入本仓生命周期。 |

### 7.2 数据类型结论

| 数据类型 | 数据项 |
|---|---|
| 真相数据 | 外部能力接入语境;capability identity;identity 风险解释与接入审查事实;capability registry entry;registry visibility / lifecycle semantics;registry maintenance / reconciliation record;adapter descriptor;descriptor risk / constraint summary;governance seam relation;capability access review responsibility separation fact;capability-method body-free relation;capability access traceability record;formal exposure boundary;formal visibility / applicability fact;capability change / consumer impact fact |
| 快照数据 | governance result safe summary;secret handling safe summary;directory search / browse summary;exported capability access summary;controlled consumer view / CapabilityDecision-style summary;downstream consumption impact summary;external capability candidate discovery summary;read-only ecosystem discovery summary;observability / audit safe summary |
| 引用数据 | external capability source ref;governance result / policy result ref;method asset ref;secret ref;runtime / tools consumer ref;SDK exposure consumer ref;observability / audit ref;external standard / protocol / document ref;marketplace ecosystem object ref |
| 禁止保存正文 | provider API key / secret 正文;KMS / Vault / secret platform truth;runtime / tools execution 正文;provider runtime / quota / route / failover / retry 正文;cost / billing / finance ledger 正文;governance approval / Policy / shared_rules 正文;method body / definition source truth 正文;SDK client / language package / convenience wrapper 正文;marketplace listing / transaction / pricing / fulfillment 正文;observability log / trace / metric / alert / audit store 正文;production request / response 正文;LLM routing / model selection truth 正文 |

### 7.3 数据项与功能 / 规则映射

| 数据项 | 支撑功能 | 支撑规则 |
|---|---|---|
| 外部能力接入语境 | FR-CH-001 | BR-CH-001;BR-CH-020 |
| capability identity | FR-CH-002 | BR-CH-001;BR-CH-002;BR-CH-010;BR-CH-020 |
| identity 风险解释与接入审查事实 | FR-CH-003;FR-CH-011 | BR-CH-005;BR-CH-019;BR-CH-023;BR-CH-035 |
| capability registry entry | FR-CH-004 | BR-CH-002;BR-CH-021 |
| registry visibility / lifecycle semantics | FR-CH-005;FR-CH-015 | BR-CH-003;BR-CH-021;BR-CH-034 |
| registry maintenance / reconciliation record | FR-CH-006;FR-CH-016 | BR-CH-009;BR-CH-011;BR-CH-026;BR-CH-037 |
| adapter descriptor | FR-CH-007;FR-CH-009 | BR-CH-004;BR-CH-022;BR-CH-031 |
| descriptor risk / constraint summary | FR-CH-008 | BR-CH-005;BR-CH-013;BR-CH-022;BR-CH-035 |
| governance seam relation | FR-CH-010 | BR-CH-006;BR-CH-014;BR-CH-023;BR-CH-028;BR-CH-034 |
| capability access review responsibility separation fact | FR-CH-011 | BR-CH-019;BR-CH-023;BR-CH-035 |
| capability-method body-free relation | FR-CH-012 | BR-CH-007;BR-CH-015;BR-CH-024;BR-CH-029 |
| capability access traceability record | FR-CH-013 | BR-CH-018;BR-CH-036;BR-CH-037 |
| formal exposure boundary | FR-CH-014;FR-CH-015 | BR-CH-008;BR-CH-016;BR-CH-025;BR-CH-030;BR-CH-034 |
| formal visibility / applicability fact | FR-CH-015 | BR-CH-003;BR-CH-021;BR-CH-025;BR-CH-034 |
| capability change / consumer impact fact | FR-CH-016 | BR-CH-026;BR-CH-036;BR-CH-037 |
| governance result safe summary / governance result ref | FR-CH-010;FR-CH-015 | BR-CH-006;BR-CH-014;BR-CH-028;BR-CH-034 |
| secret handling safe summary / secret ref | FR-CH-008;FR-CH-E04 | BR-CH-013;BR-CH-031;BR-CH-E001 |
| directory search / browse summary | FR-CH-E02 | BR-CH-009;BR-CH-037;BR-CH-E001 |
| exported capability access summary | FR-CH-E07 | BR-CH-009;BR-CH-037;BR-CH-E001 |
| controlled consumer view / CapabilityDecision-style summary | FR-CH-014;FR-CH-015 | BR-CH-008;BR-CH-012;BR-CH-016;BR-CH-025 |
| downstream consumption impact summary | FR-CH-016 | BR-CH-026;BR-CH-036;BR-CH-037 |
| external capability candidate discovery summary | FR-CH-E03 | BR-CH-009;BR-CH-011;BR-CH-E001 |
| read-only ecosystem discovery summary / marketplace ecosystem object ref | FR-CH-E06 | BR-CH-017;BR-CH-032;BR-CH-E001 |
| external capability source ref / external standard ref | FR-CH-001;FR-CH-007;FR-CH-013 | BR-CH-001;BR-CH-004;BR-CH-036 |
| method asset ref | FR-CH-012;FR-CH-013 | BR-CH-007;BR-CH-015;BR-CH-024;BR-CH-029 |
| runtime / tools consumer ref | FR-CH-014;FR-CH-016 | BR-CH-012;BR-CH-027;BR-CH-036 |
| SDK exposure consumer ref | FR-CH-014;FR-CH-E05 | BR-CH-016;BR-CH-030;BR-CH-E001 |
| observability / audit ref / safe summary | FR-CH-013;FR-CH-E07 | BR-CH-018;BR-CH-033;BR-CH-036;BR-CH-037 |
| 禁止保存正文项 | FR-CH-001~016;FR-CH-E01~E07 | BR-CH-012~BR-CH-018;BR-CH-027~BR-CH-033;BR-CH-E001 |

### 7.4 能力级数据停审结论

| 核心能力节点 | 数据承接 | 停审结论 |
|---|---|---|
| C-CH-1 稳定身份 | 外部能力接入语境、capability identity、identity 风险解释与接入审查事实、external capability source ref。 | 已明确本仓拥有身份和接入语境 truth,外部来源只做引用,未写字段或认证动作。 |
| C-CH-2 注册目录 | capability registry entry、registry visibility / lifecycle semantics、registry maintenance / reconciliation record、directory search / browse summary。 | 已明确 registry truth 与派生搜索 / 浏览摘要分层,未把 allowlist、marketplace listing 或 runtime 状态写成本仓 truth。 |
| C-CH-3 接入描述 | adapter descriptor、descriptor risk / constraint summary、secret ref、secret handling safe summary、禁止 secret / provider runtime 正文。 | 已明确 descriptor truth 与 secret / provider runtime 边界,未把 KMS / Vault、key 加密、quota、route 或 cost 写成本仓 truth。 |
| C-CH-4 治理 / 方法关系接缝 | governance seam relation、governance result ref / safe summary、capability access review responsibility separation fact、capability-method body-free relation、method asset ref。 | 已明确本仓拥有 seam / relation truth,不拥有 approval / Policy truth 或 method body。 |
| C-CH-5 受控消费表达 | formal exposure boundary、formal visibility / applicability fact、controlled consumer view、capability change / consumer impact fact、runtime / tools consumer ref、SDK exposure consumer ref、observability / audit ref。 | 已明确服务端 formal exposure truth 与 SDK client / runtime execution / observability store 分层,可进入 Step 12。 |

### 7.5 跨能力数据审计

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否明确四类数据 | 通过 | 已覆盖真相数据、快照数据、引用数据、禁止保存正文。 |
| 是否存在多真相源 | 未发现 | capability access truth 归本仓;governance、method-library、runtime/tools、SDK、marketplace、secret、cost、observability 正文均不归本仓。 |
| 是否存在孤儿数据项 | 未发现 | 核心数据项均能回指 `FR-CH-*` 或 `BR-CH-*`。 |
| 是否把接口或实现写成数据归属 | 未发现 | 未写 endpoint、event payload、字段、表结构、索引、cache、outbox、repository、port 或 DDL。 |
| 是否遗漏主要禁止正文 | 未发现 | secret、execution、provider runtime、cost、governance truth、method body、SDK client、marketplace、observability、LLM routing 均被排除。 |
| 是否守住旧材料冲突 | 通过 | `CapabilityDecision` 降为快照;`CostRecord`、`Policy / shared_rules`、KMS / Vault 不进入本仓 truth。 |

### 7.6 旧材料重裁映射

| 旧数据项 / 旧口径 | 当前处理 | 当前数据归属 | 裁剪说明 |
|---|---|---|---|
| `MCPServer` | 重裁为外部能力来源引用、capability identity、registry entry 和 adapter descriptor | 真相数据 + 引用数据 | 不继承旧聚合根名、状态枚举或 allowlist 执行。 |
| `A2ANode` | 重裁为外部能力来源引用、capability identity、registry entry 和 adapter descriptor | 真相数据 + 引用数据 | 不扩张为 A2A runtime 或认证 truth。 |
| `ProviderContract` | 重裁为 adapter descriptor、risk / constraint summary、secret ref | 真相数据 + 引用数据 + 快照数据 | provider runtime、quota、route、failover、cost 和 key 托管排除。 |
| `CapabilityDecision` | 降级为受控消费视图或查询结果快照 | 快照数据 | 不允许查询结果反向定义正式能力 truth。 |
| `CostRecord` | 排除出本仓数据需求 | 禁止保存正文 / historical conflict | cost / billing / finance ledger 不归 capability-hub。 |
| `Policy / shared_rules` | 重裁为 governance result / policy result ref 和 safe summary | 引用数据 + 快照数据 | approval / Policy / shared_rules truth 归 `L1-governance`。 |
| active registry entries 热存 | 重裁为 registry visibility / lifecycle semantics | 真相数据 | 不继承热存策略。 |
| retired servers / providers 冷存 | 重裁为 registry lifecycle 退出语义 | 真相数据 | 不写冷存、archive 或保留期。 |
| provider key encrypted / KMS / Vault | 重裁为 secret ref 与 secret handling safe summary | 引用数据 + 快照数据 + 禁止保存正文 | 本仓不拥有 secret 平台、密钥正文或 KMS truth。 |
| marketplace metadata | 只保留只读生态发现摘要或 marketplace ref | 快照数据 + 引用数据 | listing、交易、定价和履约排除。 |
| audit / cost events | 重裁为 capability access traceability record、observability / audit ref | 真相数据 + 引用数据 + 禁止保存正文 | 本仓拥有接入事实追溯,不拥有物理 audit store 或 cost ledger。 |

---

## 8. 回填草稿

> 注意: 以下只是在 Step 17 装配正式文档时可使用的 §11 候选文本。当前不得直接写入正式 `00-需求文档.md`。

### 8.1 数据需求与数据归属

`L3-capability-hub` 的数据真相是“外部能力接入事实 truth”。本仓拥有 capability identity、capability registry、adapter descriptor、governance seam relation、capability-method body-free relation、formal exposure boundary 和接入事实追溯;相邻仓数据只可作为快照或引用进入;secret、runtime execution、governance approval / Policy truth、method body、SDK client、marketplace、cost / billing 和 observability 正文不得保存到本仓。

正式 §11 可摘录本文件 §7.1 数据归属表和 §7.2 数据类型结论。正式文档中不得写字段、表结构、索引、缓存、outbox、projection、保留期、归档策略或实现对象。

---

## 9. 待确认事项

| ID | 待确认事项 | 当前状态 | 是否阻塞 Step 11 | 后续处理 |
|---|---|---|---|---|
| OQ-CH-011-001 | governance 结果摘要是否允许缺少 formal result ref。 | resolved_for_data | 否 | Step 11 结论为正式可见 / 可用依赖治理结论时必须至少有 governance result ref;safe summary 只能补充。Step 12 继续讨论接口表达。 |
| OQ-CH-011-002 | 接入审查意见是否作为本仓真相保存。 | resolved_for_data | 否 | 接入审查事实 / 风险解释属于本仓 truth;governance approval / Policy truth 不属于本仓。 |
| OQ-CH-011-003 | secret reference 是只读 ref、masked summary 还是 richer constraint snapshot。 | resolved_for_data | 否 | 当前采用 secret ref + allowed safe summary;secret 正文和 secret platform truth 禁止保存。是否需要 richer summary 后移 Step 13 / 15。 |
| OQ-CH-011-004 | body-free method relation 是否固定 relation type 集合。 | pending_for_later_design | 否 | Step 11 只确认 relation truth 与 method body 禁止保存;类型集合后移 Step 12 / 03。 |
| OQ-CH-011-005 | formal exposure boundary 的具体接口 surface。 | pending_for_step_12 | 否 | Step 12 讨论查询面、订阅面、事件协作或组合方式。 |
| OQ-CH-011-006 | 只读生态发现是否进入正式 §11。 | pending_for_step_15_or_17 | 否 | 当前作为外围增强快照 / 引用保留,Step 15 / Step 17 决定是否降为附注。 |

---

## 10. Blocker 判定

| Blocker 候选 | 判定 | 理由 | 当前处理 |
|---|---|---|---|
| 旧数据章节与当前边界冲突 | historical_conflict_not_blocker | 旧材料不能继承,但 Step 9 / Step 10 已提供足够锚点重建数据归属。 | 已将旧项重裁为当前四类数据或 historical conflict。 |
| governance seam 最小摘要未完全接口化 | not_blocker_for_step_11 | Step 11 已确认 ref 必须存在且摘要不能替代 truth;接口细节后移。 | Step 12 继续处理。 |
| secret safe summary 粒度未完全确定 | not_blocker_for_step_11 | Step 11 已确认 secret 正文禁止保存,且 secret ref / allowed safe summary 足以支撑需求层归属。 | Step 13 / Step 15 视安全要求继续处理。 |
| body-free relation type 未固定 | not_blocker_for_step_11 | Step 11 只需确认 relation truth 和 method body 边界;类型集合属于接口 / 详细设计。 | Step 12 / 03 处理。 |

结论: 未发现阻塞 `00-需求文档.md` Step 11 的上游 blocker。

---

## 11. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 已明确四类数据 | pass | 使用 `真相数据`、`快照数据`、`引用数据`、`禁止保存正文`。 |
| 每条数据项都有数据类型、归属说明和生命周期口径 | pass | §7.1 完整覆盖。 |
| 数据项能够回指功能需求或业务规则 | pass | §7.3 覆盖 `FR-CH-*` 和 `BR-CH-*`。 |
| 未写字段、表、索引、缓存、outbox、projection、repo、port 或 DDL | pass | 全文保持需求层数据归属。 |
| 已保护 capability identity、registry、descriptor、governance seam、method relation、SDK exposure boundary | pass | 核心数据 truth 均已闭合。 |
| execution、secret、cost、marketplace、governance truth、method body、SDK client 未回流为本仓 truth | pass | 均作为引用、快照或禁止保存正文处理。 |
| 已给出旧数据重裁映射 | pass | §7.6 覆盖旧实体和旧生命周期口径。 |
| 是否可进入 Step 12 | blocked_until_user_confirm | 必须等待用户确认后才能继续。 |
