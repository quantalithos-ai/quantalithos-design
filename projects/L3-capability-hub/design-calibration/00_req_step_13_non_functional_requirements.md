# 00 Step 13 · 非功能需求

> 所属文档: `00-需求文档.md`
> Step: Step 13
> 目标章节: 正式文档 §13 `非功能需求`
> 当前状态: completed_stop_review
> 当前约束: 本步只把 Step 7 核心能力闭环、Step 10 规则、Step 11 数据归属和 Step 12 接口依赖转成需求层质量约束;不得写缓存参数、数据库优化、重试算法、监控平台配置、日志字段、SLO 仪表盘、加密实现、测试用例、验收签署或实施计划。

---

## 1. Step 状态

| 字段 | 值 |
|---|---|
| step | Step 13 |
| status | completed_stop_review |
| gate_status | pass_for_step_13_only |
| previous_step | Step 12 `接口与依赖` |
| next_allowed_action | wait_user_review_to_step_14 |
| formal_section | `00-需求文档.md` §13 |
| formal_write_status | not_written |
| blocker_status | no_upstream_blocker_for_step_13 |

---

## 2. Step 内计划

| 序号 | 动作 | 状态 | 输出 |
|---|---|---|---|
| 1 | 回读项目台账、需求 flow、Step 1~12 | done | 确认用户已同意进入 Step 13,且不得跳到 Step 14 或正式文档装配。 |
| 2 | 读取需求 SOP Step 13 和书写规范 4.13 | done | 确认本步必须按性能、可用性、安全、审计 / 可追溯、幂等 / 一致性、可观测性六类检查,每项要求必须有判断口径。 |
| 3 | 读取讨论中间产物规范和真相源闭环标准 | done | 确认本步需要保留问题回答、诊断、取舍、结构化产物、回填草稿和停审门禁,并防止非功能要求制造多真相源。 |
| 4 | 读取上游参考 Step 13 | done | 参考 `L1-governance`、`L3-method-library`、`L0-sdk` 的六类 NFR 组织方式,不复制其它领域指标。 |
| 5 | 读取旧 `00-需求文档.md` 非功能指标和相关旧验收口径 | done | 识别旧指标污染:`QueryCapabilities P95 < 50ms`、`Policy < 30s`、明文 key `0`、成本覆盖 `100%`、SLA、白名单拦截等混写。 |
| 6 | 按 C-CH-1~C-CH-5 回答 SOP 问题 | done | 形成能力级质量约束和全仓质量约束。 |
| 7 | 按六类非功能类别做适用性判断 | done | 确认六类均适用,其中安全、审计 / 可追溯、幂等 / 一致性为强适用。 |
| 8 | 做设计取舍 | done | 采用“需求层判断口径 + 旧指标候选化 / 冲突化”方式,不采用旧 P95 / 30s / cost / KMS 硬指标。 |
| 9 | 形成结构化 NFR 表、能力 / 功能 / 规则映射、Step 14 承接方向和回填草稿 | done | 为正式 §13 提供可回填候选,但不写入正式文档。 |
| 10 | 自检与停审 | done | 无阻塞 Step 13 的上游 blocker;等待用户确认是否进入 Step 14。 |

---

## 3. 本步输入与读取结论

### 3.1 前序 Step 输入

| 来源 | 已确认结论 | 对 Step 13 的影响 |
|---|---|---|
| Step 2 | 本仓是外部 MCP / A2A / API capability identity、capability registry 与 adapter descriptor 的能力接入真相仓。 | 非功能要求必须围绕 capability access truth 成立,不能转成执行、secret、cost、marketplace 或 SDK client 的质量要求。 |
| Step 4 | 当前目标包含 capability identity、registry、adapter descriptor、governance seam、method relation、SDK exposure boundary;非目标排除 runtime/tools execution、provider runtime、method body、governance truth、SDK client、secret/KMS、cost/billing、marketplace、LLM routing。 | 安全、可用性和一致性要求必须继续保护这些边界,不能把非目标以 NFR 形式写回来。 |
| Step 6 | `L0-core` 是唯一编译期依赖;`L0-bus` 是事件协作;外部 MCP / A2A / API 是运行期外部能力来源;`L1-governance` 是结果接缝;`L2-runtime` / `L2-tools` / `L0-sdk` 是消费边界。 | 可用性和可观测性要求要区分编译期前置、运行期外部输入、事件协作延迟和下游消费延迟。 |
| Step 7 | 核心能力节点为 C-CH-1 稳定身份、C-CH-2 注册目录、C-CH-3 接入描述、C-CH-4 治理 / 方法关系接缝、C-CH-5 受控消费表达与变化感知。 | 每项能力级 NFR 必须能回指这五个节点之一;全仓 NFR 必须明确标为全局质量约束。 |
| Step 9 | 功能需求为 `FR-CH-001~016` 与外围增强 `FR-CH-E01~E07`。 | NFR 不能新增孤儿功能,只能保护已确认功能或边界。 |
| Step 10 | 规则为 `BR-CH-001~037` 与 `BR-CH-E001`,覆盖不变量、禁止行为、显式变化、边界约束、治理约束和审计约束。 | 安全、追溯、一致性和可观测性要求必须承接这些规则,不得重开规则定义。 |
| Step 11 | 数据归属已分为真相数据、快照数据、引用数据、禁止保存正文;本仓真相限定为外部能力接入事实。 | 安全 NFR 必须保护禁止正文边界;一致性 NFR 必须保护真相 / 快照 / 引用分层。 |
| Step 12 | 接口类型限定为查询、变更、事件输出、事件输入、后台任务;依赖类型限定为定义来源、治理结论、下游消费、外部能力依赖。 | 性能、可用性和可观测性要求只能落在能力级接口面,不得写协议、事件 schema、缓存、重试或实现调用链。 |

### 3.2 规范输入

| 输入文件 | 本步读取重点 | 对 Step 13 的约束 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 13 | 先判断能力级 NFR 和全局 NFR,再按六类检查,并确保能被 Step 14 验收承接。 | 不能机械列模板项;不能把全局质量约束硬塞进单个能力节点。 |
| `需求文档书写规范.md` 4.13 | 表格固定为“非功能类别 / 要求 / 判断口径 / 目标值”;六类最小枚举为性能、可用性、安全、审计 / 可追溯、幂等 / 一致性、可观测性。 | 每项要求必须是判断句,且判断口径不得留空。 |
| `设计文档讨论中间产物规范.md` | Step 文件必须保留问题回答、诊断、取舍、结构化产物、回填草稿和停审状态。 | 本文件必须可作为 Step 14 验收和 Step 16 追溯输入。 |
| `设计真相源闭环与可落码性标准.md` | 设计真相源必须唯一,继续任务必须从 ledger / flow / Step 文件恢复。 | NFR 不得制造多真相源;旧对话和旧正式文档指标不得直接成为当前正式目标。 |

### 3.3 上游参考输入

| 参考文件 | 使用方式 | 结论 |
|---|---|---|
| `projects/L1-governance/design-calibration/00_req_step_13_non_functional_requirements.md` | 参考“旧 P95 / SLA 候选化”和“核心 truth 不被外部输入篡改”的写法。 | capability-hub 也不直接继承旧硬指标,旧 `50ms / 30s / 99.9%` 只能作为候选或历史冲突。 |
| `projects/L3-method-library/design-calibration/00_req_step_13_non_functional_requirements.md` | 参考“性能不成为主链瓶颈、外围增强失效不拖垮核心、观测材料不替代 truth”的写法。 | 本仓 NFR 应保护正式接入事实,不规定缓存、outbox、trace_id、fingerprint 等实现。 |
| `projects/L0-sdk/design-calibration/00_req_step_13_non_functional_requirements.md` | 参考“候选量化目标后移测试方案,需求层先给判断口径”的写法。 | SDK exposure 相关 NFR 只能保护服务端能力边界,不定义 SDK client 或多语言包指标。 |

### 3.4 目标旧材料输入

| 旧材料 | 可保留线索 | 不可继承口径 |
|---|---|---|
| 旧 `00` §7.1 非功能指标 | 安全、追溯、可用性和性能需要被需求层考虑。 | 未白名单拦截率 `100%`、明文 key `0`、`QueryCapabilities P95 < 50ms`、`Policy < 30s`、成本覆盖 `100%`、SLA `99.9%` 均不能直接作为当前硬指标。 |
| 旧 `00` §11.2 非功能验收 | 旧文档试图用量化门禁表达安全和审计目标。 | 验收门禁提前混入非功能章节,且多项属于 execution、cost、KMS、Policy truth。 |
| 旧 README 安全 / 治理联动 | 外部能力接入需要安全边界、治理接缝和审计友好性。 | 白名单执行、KMS/Vault 托管、成本记账和 Policy 下发刷新不归本仓。 |
| 旧 `01/02/03` 横切关注点 | QueryCapabilities 高频路径、provider contract 安全、审计 / cost 输出提示了质量风险。 | cache、worker、projection、KMS adapter、CostRecord、provider failover 等实现 / 边界外内容不进入需求 NFR。 |

---

## 4. SOP 问题回答

### 4.1 哪些非功能要求能回指具体核心能力节点?

| 核心能力节点 | 能力级质量约束 |
|---|---|
| C-CH-1 稳定身份 | capability identity 的建立、查询、引用和变更必须保持单一正式语义;重复输入不得制造重复身份;身份风险解释必须可追溯且不泄露外部敏感正文。 |
| C-CH-2 注册目录 | registry 读取和生命周期语义不应成为下游主链阻塞点;目录维护、搜索和派生摘要不得成为 truth 写源;外围搜索 / 浏览失效不能使正式目录 truth 丢失。 |
| C-CH-3 接入描述 | adapter descriptor 必须在可解释、安全和一致的边界内被读取和变更;descriptor 不得保存 secret 正文或 provider runtime truth;外部能力来源不可用时必须保持接入状态可解释。 |
| C-CH-4 治理 / 方法关系接缝 | governance seam 与 method relation 必须可追溯、body-free、不可伪造;治理结果延迟或 method ref 不可解析时不得编造正式可用结论。 |
| C-CH-5 受控消费表达 | formal exposure、正式可见性、受控消费视图和变化感知必须保持与本仓接入事实一致;下游 runtime/tools/SDK 不可用或消费延迟不得反写本仓 truth。 |

### 4.2 哪些非功能要求覆盖全仓,不能强行归入某个能力节点?

| 全局质量约束 | 判断口径 |
|---|---|
| 本仓不得通过性能优化、降级策略或观测材料改变 capability access truth。 | 任何快照、缓存、索引、导出、观测或消费结果都不得反向定义 identity、registry、descriptor、seam、relation 或 exposure。 |
| 本仓不得越权保存相邻仓正文和外部正文。 | Step 11 的禁止保存正文边界必须在所有 NFR 中持续成立。 |
| 外围增强失效不得拖垮核心闭环。 | 管理 UI、搜索、自动发现、生态发现、审计导出和 SDK 说明增强失效时,核心接入事实仍应保持可判断。 |
| 旧硬指标不得在缺少当前正式基线时成为验收目标。 | 旧 P95、30s、100%、SLA 等只保留为候选 / historical conflict,后续架构、测试或验收阶段必须重新裁剪。 |

### 4.3 这个仓必须满足哪些性能要求?

性能要求只针对 capability access truth 的关键读取、变更和受控消费表达,不针对 runtime execution、tool invocation、provider 调用、SDK client、marketplace、cost ledger 或 observability store。

| 性能关注点 | 判断口径 |
|---|---|
| 基础接入事实读取 | identity、registry、descriptor、seam、relation 和 formal exposure 的基础读取不应成为 runtime / tools / SDK 等下游消费主链的不可解释瓶颈。 |
| 关键真相变更 | identity、registry、descriptor、seam、relation 和 exposure 的变更必须优先保证一致性、追溯和边界正确性,不得为追求低延迟牺牲 truth 完整性。 |
| 派生 / 外围能力 | 搜索、导出、审计友好摘要、只读生态发现和 SDK 说明增强不得阻塞核心接入事实的基础读取与正式变更。 |

旧 `QueryCapabilities P95 < 50ms` 不能直接继承,因为旧接口名绑定 runtime 高频查询和 allow / deny 结果,当前已重裁为 formal exposure / 受控消费视图能力面。若后续确需量化,必须在 Step 14 或后续测试方案中基于正式接口边界重新定义测量对象。

### 4.4 这个仓必须满足哪些可用性要求?

| 可用性关注点 | 判断口径 |
|---|---|
| 核心闭环可用 | 外围增强失效时,C-CH-1~C-CH-5 的核心接入事实仍应保持可判断、可读取或可解释等待。 |
| 上游 / 外部输入延迟 | governance result、method asset ref、外部 MCP / A2A / API 来源、secret ref 或 observability ref 延迟时,本仓不得伪造正式接入结论。 |
| 事件协作延迟 | `L0-bus` 或下游变化感知延迟时,本仓正式接入事实不得丢失或被反向改写。 |
| 下游消费失效 | `L2-runtime`、`L2-tools`、`L0-sdk` 或产品入口不可用时,本仓不能把消费失败、缓存命中或客户端封装状态写成 capability truth。 |

旧 SLA `>= 99.9%` 不能直接继承,因为它没有绑定当前六类能力面,也未区分核心闭环、外围增强、事件协作和下游消费边界。

### 4.5 这个仓必须满足哪些安全要求?

| 安全关注点 | 判断口径 |
|---|---|
| 禁止正文 | 本仓不得保存 provider API key / secret 正文、KMS / Vault truth、runtime/tools execution 正文、governance approval / Policy / shared_rules 正文、method body、SDK client、marketplace listing / transaction、cost ledger、observability log / trace / metric / audit store 正文。 |
| 安全摘要 | descriptor risk / constraint summary 和 secret handling safe summary 只能表达允许摘要或引用,不得成为 secret 平台、provider runtime 或 governance policy。 |
| 正式可见性 | 正式 exposure 或受控消费视图不得绕过需要的 governance seam,也不得把未描述、未治理、草稿或外部候选能力伪装成正式能力。 |
| 职责分离 | access review fact、风险解释和治理结果引用必须区分,接入审查意见不得替代 `L1-governance` 的 approval / Policy truth。 |

旧“明文 key 落盘次数 0”方向可以保留为禁止正文边界,但不能写成 KMS/Vault 实现或 grep 测试;本仓的需求层安全目标是“不保存 secret 正文,只允许 ref / safe summary”。

### 4.6 这个仓必须满足哪些审计 / 可追溯要求?

| 审计 / 可追溯关注点 | 判断口径 |
|---|---|
| 关键 truth 变化 | capability identity、registry、descriptor、governance seam、method relation、formal exposure 和 consumer impact 的关键变化必须可追溯。 |
| 接缝关系 | governance result ref、method asset ref、external source ref、secret ref、runtime/tools/SDK consumer ref 等引用关系必须能说明来源、范围和当前关系状态。 |
| 派生与维护输出 | 搜索、导出、对账、重建、审计友好摘要和变化协作输出必须能说明来源、范围和结果,不得静默改变正式接入事实。 |
| 当前语境解释 | 审计 / 合规查看者应能解释外部能力为何处于当前身份、目录、描述、治理接缝、方法关系和 exposure 语境。 |

旧审计 / cost event 线索不能继承为本仓拥有 observability store 或 cost ledger。本仓只要求 capability access truth 的关键变化和关系链路可追溯。

### 4.7 这个仓必须满足哪些幂等 / 一致性要求?

| 幂等 / 一致性关注点 | 判断口径 |
|---|---|
| 单一正式语义 | 同一 capability identity、registry fact、descriptor、governance seam、method relation 和 formal exposure 不得在本仓与消费方之间出现第二真相。 |
| 重复输入 | 重复的接入提议、候选发现输入、governance 结果线索、消费影响反馈或维护任务不得制造重复正式身份、重复注册事实或分叉 exposure。 |
| 显式变化 | identity、registry、descriptor、seam、relation、exposure 和 consumer impact 的影响性变化必须显式发生,不能被查询、导出、索引、维护或消费动作隐式产生。 |
| 派生一致性 | 快照、消费视图、搜索结果、导出摘要和事件协作可以滞后,但必须能解释来源、滞后或失效状态,不能替代正式 truth。 |

### 4.8 这个仓必须满足哪些可观测性要求?

| 可观测性关注点 | 判断口径 |
|---|---|
| 核心状态与变化 | identity、registry、descriptor、governance seam、method relation、formal exposure 的关键状态和关键变化必须能被平台稳定观察。 |
| 边界异常 | secret 正文进入、method body 进入、governance truth 回流、consumer 反写 truth、runtime execution 回写、marketplace listing 回流、cost ledger 回流等异常必须可发现。 |
| 依赖与消费状态 | governance 结果延迟、method ref 不可解析、外部来源不可解释、事件协作延迟、下游消费失败、维护 / 对账失败等状态必须可识别。 |
| 观测边界 | 可观测材料只能用于观察和追溯,不得替代 capability access truth,也不得保存 Step 11 禁止保存正文。 |

### 4.9 哪些要求能量化,哪些只能给出判断口径?

| 类型 | 当前口径 |
|---|---|
| 当前正式判断口径 | 核心闭环不因外围增强失效而整体不可用;禁止正文边界成立;关键接入事实变化可追溯;重复输入不制造重复 truth;消费方不反写本仓 truth;边界异常可观察。 |
| 后续候选量化 | formal exposure 基础读取延迟、关键变化感知延迟、维护 / 对账完成时长、审计友好导出准备时长、下游消费滞后窗口。 |
| 当前不定死 | `QueryCapabilities P95 < 50ms`;`Policy refresh < 30s`;SLA `>= 99.9%`;明文 key grep `0`;成本覆盖 `100%`;未白名单调用拦截率 `100%`。 |

---

## 5. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | Step 13 处理 |
|---|---|---|---|
| 旧 `00` §7.1 非功能指标表 | 安全、延迟、可观测性、可用性混合;写 `QueryCapabilities P95 < 50ms`、`Policy < 30s`、成本覆盖、白名单拦截、明文 key。 | 指标绑定旧接口、执行拦截、KMS、cost 和 runtime 高频路径,未经过当前 Step 7~12 裁剪。 | 全部降级为 historical material 或候选目标,不直接继承。 |
| 旧 `00` §11.2 非功能验收 | 将非功能指标提前写成验收门禁。 | Step 13 与 Step 14 边界混淆,且多项验收对象不归本仓。 | 本步只写 NFR 判断口径;Step 14 再承接可验收项。 |
| 旧 `QueryCapabilities` 主线 | P95 指标围绕 runtime 查询 allow/deny。 | 当前已改写为 formal exposure / 受控消费视图;allow/deny 执行不归本仓。 | 不继承接口名和指标;后续若需要,基于正式消费视图重新定义。 |
| 旧 `Policy refresh < 30s` | governance policy 更新后 30s 刷新白名单。 | 本仓不拥有 Policy truth,也不执行白名单刷新。 | 改写为 governance seam 延迟可解释、不得伪造正式结论。 |
| 旧 `明文 key 0` / KMS | 以 KMS/Vault 和 grep 测试表达安全。 | 本仓不做 KMS/Vault 平台,测试方式也不属于需求层。 | 改写为禁止保存 secret 正文、只允许 ref / safe summary。 |
| 旧 `成本记账覆盖率 100%` | 以外部调用 cost event 表达可观测性。 | 成本 / billing / finance ledger 和每次外部调用执行不归本仓。 | 排除为 historical conflict;不进入 NFR。 |
| 旧 SLA | 写 `>= 99.9%`。 | 未区分核心 / 外围 / 下游 / 事件协作,也无当前稳定来源。 | 改写为核心闭环可用性判断口径。 |

---

## 6. 设计取舍

### 6.1 非功能骨架取舍

| 方案 | 内容 | 优点 | 缺点 | 当前取舍 |
|---|---|---|---|---|
| 方案 A | 原样继承旧 P95 / 30s / 100% / SLA 指标 | 看起来可量化。 | 旧指标绑定越界对象和旧接口,会误导后续验收和实现。 | 不采用。 |
| 方案 B | 按六类 NFR 重写,旧指标作为候选 / 冲突线索 | 对齐规范,能承接 Step 7~12,不伪造硬指标。 | 后续 Step 14 / 05 测试方案还需继续细化目标值。 | 采用。 |
| 方案 C | 只写安全和追溯 | 突出本仓关键风险。 | 漏掉性能、可用性、一致性和可观测性,不能满足 4.13 六类检查。 | 不采用。 |
| 方案 D | 直接写缓存、outbox、projection、监控指标和重试降级 | 接近实现。 | 违反需求层粒度,提前进入架构 / 详细设计 / 配置。 | 不采用。 |

### 6.2 关键指标取舍

| 议题 | 当前结论 | 理由 |
|---|---|---|
| 是否保留 `QueryCapabilities P95 < 50ms` | 不作为正式 NFR;只作为后续候选量化线索。 | `QueryCapabilities` 旧名绑定 runtime allow/deny 查询,当前已重裁为 formal exposure 和受控消费视图。 |
| 是否保留 `Policy refresh < 30s` | 不作为正式 NFR。 | 本仓不拥有 Policy truth 或白名单刷新;只要求 governance seam 延迟可解释。 |
| 是否保留明文 key `0` | 需求层保留“禁止保存 secret 正文”,不写 grep / KMS 实现。 | 本仓只可保存 secret ref 或安全摘要,不是 secrets 平台。 |
| 是否保留成本覆盖 `100%` | 不进入正式 NFR。 | cost / billing 是非目标,每次外部调用也属于 execution / observability 语境。 |
| 是否保留 SLA `99.9%` | 不作为当前需求硬指标。 | 当前更重要的是核心闭环与外围增强、外部输入和下游消费失效分层。 |
| 是否把观测要求写成指标名 / dashboard | 不写。 | Step 13 只写“哪些状态和异常可被观察”,具体指标和仪表盘后移。 |

---

## 7. 结构化中间产物

### 7.1 非功能类别适用性结论

| 非功能类别 | 适用性 | 说明 |
|---|---|---|
| 性能 | 适用 | 本仓基础读取、正式变更和受控消费表达会被 runtime/tools/SDK 等下游使用,不应成为不可解释瓶颈。 |
| 可用性 | 适用 | 核心能力闭环必须与外围增强、外部输入延迟、事件协作延迟和下游消费失效分层。 |
| 安全 | 强适用 | 本仓接触外部能力、secret reference、治理接缝和方法关系,必须防止正文回流和职责混写。 |
| 审计 / 可追溯 | 强适用 | capability access truth 必须解释身份、目录、描述、治理引用、方法关系和 exposure 为何成立。 |
| 幂等 / 一致性 | 强适用 | 多下游消费同一正式接入事实,重复输入和派生输出不得制造第二 truth。 |
| 可观测性 | 适用 | 平台需要观察关键变化、边界异常、依赖延迟、消费状态和维护结果。 |

### 7.2 非功能需求结论

| 编号 | 非功能类别 | 要求 | 判断口径 / 目标值 |
|---|---|---|---|
| NFR-CH-001 | 性能 | capability identity、registry、adapter descriptor、governance seam、method relation 和 formal exposure 的基础读取不应成为下游主链消费的不可解释瓶颈。 | 后续验收应能判断基础读取 / 受控消费视图不会被搜索、导出、审计友好摘要、生态发现或 SDK 说明增强阻塞;当前不固定旧 P95。 |
| NFR-CH-002 | 性能 | 关键接入事实变更必须优先保证一致性、追溯和边界正确性,不得为追求低延迟牺牲 truth 完整性。 | 若性能与 truth 完整性冲突,以 identity、registry、descriptor、seam、relation、exposure 的正式语义正确为优先。 |
| NFR-CH-003 | 性能 | 派生摘要、搜索、浏览、审计友好导出和维护输出不得阻塞核心接入事实的基础读取与正式变更。 | 外围输出延迟时,核心闭环仍可判断;派生输出不得成为正式写源。 |
| NFR-CH-004 | 可用性 | 外围增强能力失效时,C-CH-1~C-CH-5 核心能力闭环仍应保持可判断。 | 管理 UI、搜索 / 过滤、自动发现、安全摘要深化、SDK 说明增强、只读生态发现、审计导出失效不应让核心 truth 不可解释。 |
| NFR-CH-005 | 可用性 | 外部输入或上游结果延迟时,本仓不得伪造正式接入结论。 | governance result、method asset ref、外部 MCP / A2A / API 来源、secret ref 或 observability ref 不可用时,对应能力应等待、失败或降级解释,不得生成假 approval、假 method relation 或假 descriptor。 |
| NFR-CH-006 | 可用性 | 事件协作或下游消费延迟不得导致本仓正式接入事实丢失或被反写。 | `L0-bus`、runtime、tools、SDK 或产品入口不可用时,本仓 truth 保持;消费延迟只能影响消费状态或变化感知,不能改变 truth。 |
| NFR-CH-007 | 安全 | 本仓不得保存 Step 11 已禁止的外部正文、相邻仓正文或执行正文。 | provider secret、KMS/Vault truth、runtime/tools execution、governance approval / Policy / shared_rules、method body、SDK client、marketplace、cost、observability 正文均不得进入本仓。 |
| NFR-CH-008 | 安全 | descriptor risk / constraint summary、secret handling safe summary 和 governance safe summary 不得替代被引用系统的正式 truth。 | 摘要必须保持 safe summary 或 ref 语义;不能变成 secret 平台、provider runtime、Policy truth、method body 或 cost ledger。 |
| NFR-CH-009 | 安全 | formal exposure 和受控消费视图不得绕过必要治理接缝,也不得把草稿、未描述、未治理或外部候选能力暴露为正式能力。 | 正式可见 / 可用语境依赖治理结论时必须能回指 governance seam;未满足条件时只能表现为不可正式消费、待治理或可解释降级。 |
| NFR-CH-010 | 安全 | 接入审查意见、风险解释和 governance approval 必须保持职责分离。 | access review fact 可被追溯,但不得替代 `L1-governance` approval、Policy effective fact 或 shared_rules truth。 |
| NFR-CH-011 | 审计 / 可追溯 | capability identity、registry、adapter descriptor、governance seam、method relation、formal exposure 和 consumer impact 的关键变化必须可追溯。 | 后续验收应能解释关键变化的来源、范围、影响对象和当前结果;本步不规定 audit log schema。 |
| NFR-CH-012 | 审计 / 可追溯 | 本仓与 governance、method-library、external source、secret、runtime/tools/SDK 和 observability 的引用关系必须可解释。 | ref / safe summary / body-free relation 必须能说明引用对象、引用语境和本仓不拥有正文的边界。 |
| NFR-CH-013 | 审计 / 可追溯 | 搜索、导出、维护、对账、派生摘要和变化协作输出必须能说明来源、范围和结果。 | 派生输出不得静默改变正式接入事实;审计友好输出只解释 capability access truth,不成为观测或 GRC truth。 |
| NFR-CH-014 | 幂等 / 一致性 | capability identity 和 registry fact 在平台范围内必须保持单一正式语义。 | 重复提议、候选发现或消费反馈不得制造重复身份、重复注册事实或无法解释的身份分叉。 |
| NFR-CH-015 | 幂等 / 一致性 | descriptor、governance seam、method relation、formal exposure 和正式可见性变化必须显式发生。 | 查询、浏览、导出、索引重建、事件输入或下游消费不得隐式创建、合并、替换或更正这些 truth。 |
| NFR-CH-016 | 幂等 / 一致性 | 快照、派生视图、受控消费视图和变化感知输出可以滞后,但必须与正式接入事实保持可解释一致。 | 滞后、缺失或失效状态必须可解释;派生结果不得替代 identity、registry、descriptor、seam、relation 或 exposure truth。 |
| NFR-CH-017 | 幂等 / 一致性 | runtime、tools、SDK 和产品入口必须消费同一服务端 formal exposure 语义,不得各自反写能力边界。 | 下游消费差异不能产生第二 capability truth;SDK client / runtime cache / tool config 不得成为本仓正式边界来源。 |
| NFR-CH-018 | 可观测性 | 核心接入事实状态、关键变化和边界异常必须能被平台稳定观察。 | identity、registry、descriptor、seam、relation、exposure 变化,以及 secret 正文回流、method body 回流、governance truth 回流、consumer 反写等异常应可识别。 |
| NFR-CH-019 | 可观测性 | 外部输入、事件协作、下游消费和维护任务的延迟或失败必须可识别。 | 应能区分 governance 延迟、method ref 不可解析、外部来源不可解释、bus 协作延迟、消费失败、对账 / 重建失败等状态。 |
| NFR-CH-020 | 可观测性 | 可观测材料不得替代 capability access truth,也不得保存禁止正文。 | log、metric、trace、audit ref、diagnostic 或 telemetry 只能作为观察 / 追溯材料,不能成为 truth store 或正文存储。 |

### 7.3 非功能与能力节点映射结论

| 非功能要求 | 映射对象 | 说明 |
|---|---|---|
| NFR-CH-001 | C-CH-5;全仓消费边界 | 保护基础读取 / 受控消费视图不拖垮下游主链。 |
| NFR-CH-002 | C-CH-1~C-CH-5 | 保护关键真相变更的一致性和追溯优先。 |
| NFR-CH-003 | C-CH-2;C-CH-5;外围增强 | 保护派生和外围输出不阻塞或反写核心 truth。 |
| NFR-CH-004 | 全仓目标 / 外围增强边界 | 确保外围增强失效不拖垮核心闭环。 |
| NFR-CH-005 | C-CH-3;C-CH-4;全仓依赖边界 | 外部来源、governance 和 method ref 延迟时不伪造结论。 |
| NFR-CH-006 | C-CH-5;全仓下游消费边界 | 事件协作和下游消费延迟不反写本仓 truth。 |
| NFR-CH-007 | 全仓数据归属边界 | 保护 Step 11 禁止保存正文。 |
| NFR-CH-008 | C-CH-3;C-CH-4 | 保护 safe summary / ref 不变成上游 truth。 |
| NFR-CH-009 | C-CH-4;C-CH-5 | 保护正式 exposure 不绕过 governance seam。 |
| NFR-CH-010 | C-CH-1;C-CH-4 | 保护接入审查与治理 approval 职责分离。 |
| NFR-CH-011 | C-CH-1~C-CH-5 | 保护关键变化可追溯。 |
| NFR-CH-012 | C-CH-3;C-CH-4;C-CH-5 | 保护跨仓 ref / safe summary / body-free relation 可解释。 |
| NFR-CH-013 | C-CH-2;C-CH-5;外围增强 | 保护派生、导出、维护和变化协作输出可解释。 |
| NFR-CH-014 | C-CH-1;C-CH-2 | 保护 identity 和 registry 单一正式语义。 |
| NFR-CH-015 | C-CH-3;C-CH-4;C-CH-5 | 保护 descriptor、seam、relation、exposure 显式变化。 |
| NFR-CH-016 | C-CH-2;C-CH-5 | 保护快照 / 派生视图与正式 truth 的可解释一致。 |
| NFR-CH-017 | C-CH-5 | 保护 runtime / tools / SDK / 产品入口消费同一服务端 exposure 语义。 |
| NFR-CH-018 | C-CH-1~C-CH-5 | 保护核心状态、关键变化和边界异常可观察。 |
| NFR-CH-019 | 全仓依赖 / 消费 / 维护边界 | 保护依赖延迟、消费失败和维护失败可识别。 |
| NFR-CH-020 | 全仓 observability 边界 | 保护观测材料不替代 truth,也不保存禁止正文。 |

### 7.4 非功能与功能 / 规则映射结论

| 非功能类别 | 支撑的功能 / 规则 |
|---|---|
| 性能 | FR-CH-014~016;FR-CH-006;FR-CH-E02;FR-CH-E07;BR-CH-008;BR-CH-009;BR-CH-026;BR-CH-037 |
| 可用性 | FR-CH-001~016;BR-CH-009;BR-CH-011;BR-CH-026;BR-CH-034;Step 12 外部依赖边界 |
| 安全 | FR-CH-003;FR-CH-008;FR-CH-010;FR-CH-011;FR-CH-014;BR-CH-012~019;BR-CH-027~035;Step 11 禁止保存正文 |
| 审计 / 可追溯 | FR-CH-013;FR-CH-016;FR-CH-E07;BR-CH-020~026;BR-CH-036;BR-CH-037 |
| 幂等 / 一致性 | FR-CH-001~016;BR-CH-001~011;BR-CH-020~026;Step 11 真相 / 快照 / 引用生命周期 |
| 可观测性 | FR-CH-006;FR-CH-013;FR-CH-016;FR-CH-E07;BR-CH-036;BR-CH-037;Step 12 事件输出 / 后台任务边界 |

### 7.5 判断口径 / 目标值结论

| 类别 | 当前口径 |
|---|---|
| 当前正式目标 | 核心闭环不因外围增强失效而整体不可用;本仓不保存禁止正文;关键接入事实变化可追溯;重复输入不产生重复 truth;正式 exposure 不被下游反写;边界异常和依赖延迟可识别。 |
| 当前候选量化 | formal exposure 基础读取延迟;关键变化感知延迟;维护 / 对账完成时长;审计友好导出准备时长;下游消费滞后窗口。 |
| historical conflict / 不继承 | `QueryCapabilities P95 < 50ms`;`Policy refresh < 30s`;SLA `>= 99.9%`;明文 key grep `0`;成本记账覆盖 `100%`;未白名单调用拦截率 `100%`。 |

### 7.6 Step 14 验收承接方向

| 非功能要求范围 | Step 14 承接方向 |
|---|---|
| NFR-CH-001~003 性能 | 非功能验收应验证核心读取 / 受控消费表达不被外围增强阻塞,并验证一致性优先口径;不直接沿用旧 P95。 |
| NFR-CH-004~006 可用性 | 非功能验收应验证外围增强、外部输入、事件协作和下游消费失效时 truth 不被伪造或反写。 |
| NFR-CH-007~010 安全 | 规则边界 / 数据归属 / 非功能验收应验证禁止正文、safe summary / ref 和 governance 职责分离。 |
| NFR-CH-011~013 审计 / 可追溯 | 非功能验收应验证关键变化、跨仓引用关系和派生 / 维护输出可解释。 |
| NFR-CH-014~017 幂等 / 一致性 | 核心能力 / 规则边界 / 非功能验收应验证单一正式语义、重复输入不分叉、显式变化和消费一致。 |
| NFR-CH-018~020 可观测性 | 非功能验收应验证核心状态、边界异常、依赖延迟和消费 / 维护状态可识别,并验证观测材料不替代 truth。 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §13。正式文档可摘录本文件 §7.1~§7.6 的表格,不重复扩写 SOP 问题回答、文档诊断和设计取舍。

```md
## 13. 非功能需求

> 校准来源：
> - `design-calibration/00_req_step_13_non_functional_requirements.md`
>
> 延伸阅读：
> - 建议继续阅读 `design-calibration/00_req_step_13_non_functional_requirements.md` 的“SOP 问题回答”“结构化中间产物”和“Step 14 验收承接方向”小节,了解本章质量约束如何由核心闭环、规则、数据归属和接口依赖收敛而来。

本章按性能、可用性、安全、审计 / 可追溯、幂等 / 一致性、可观测性六类定义 `L3-capability-hub` 的需求层质量约束。旧 `QueryCapabilities P95 < 50ms`、`Policy refresh < 30s`、明文 key grep `0`、成本覆盖 `100%`、未白名单拦截 `100%` 和 SLA `99.9%` 均不作为当前已确认硬指标;这些旧指标只能作为后续架构、测试或验收阶段重新裁剪的候选线索或 historical conflict。

正式非功能需求表应摘录:

- `design-calibration/00_req_step_13_non_functional_requirements.md` §7.1 非功能类别适用性结论。
- `design-calibration/00_req_step_13_non_functional_requirements.md` §7.2 非功能需求结论。
- `design-calibration/00_req_step_13_non_functional_requirements.md` §7.3 非功能与能力节点映射结论。
- `design-calibration/00_req_step_13_non_functional_requirements.md` §7.5 判断口径 / 目标值结论。
```

---

## 9. 待确认事项

| ID | 待确认事项 | 当前状态 | 是否阻塞 Step 13 | 后续处理 |
|---|---|---|---|---|
| `OQ-CH-013-001` | formal exposure 或受控消费视图是否需要在正式需求中保留具体延迟目标。 | pending | 否 | Step 14 先给验收判断口径;后续 05 测试方案 / 07 实施计划若有测量基线再定量。 |
| `OQ-CH-013-002` | governance seam 变化感知是否需要正式量化滞后窗口。 | pending | 否 | Step 14 可先验证“延迟可解释且不伪造 truth”;具体窗口后移。 |
| `OQ-CH-013-003` | secret reference 的安全摘要最小内容是否需要在需求层进一步收窄。 | pending | 否 | Step 14 / 15 可记录风险;字段级内容后移 01~03。 |
| `OQ-CH-013-004` | 可观测性需要输出哪些业务状态给 `L4-observability`。 | pending | 否 | Step 14 只验收可识别;具体观测 surface 后移 01 / 03 / 05。 |

---

## 10. Blocker 判定

| Blocker 候选 | 判定 | 理由 | 当前处理 |
|---|---|---|---|
| 旧非功能指标与当前边界冲突 | historical_conflict_not_blocker | 旧指标绑定旧功能、执行、secret、cost 和 governance truth;Step 7~12 已提供当前重裁基线。 | 记录为 historical material,不继承为当前 NFR。 |
| 具体延迟目标缺失 | not_blocker_for_step_13 | 需求规范允许无法量化时给判断口径;当前没有正式测量基线。 | 以判断口径进入 Step 14,后续测试 / 架构阶段再量化。 |
| observability 具体指标未闭合 | not_blocker_for_step_13 | Step 13 不写监控平台、指标名或 dashboard。 | 后续架构 / 详细设计 / 测试方案闭合。 |
| secret reference 字段未闭合 | not_blocker_for_step_13 | Step 13 只需确认禁止正文和 safe summary / ref 边界。 | 后续 01~03 字段 / 接口设计闭合。 |

结论: 未发现阻塞 `00-需求文档.md` Step 13 的上游 blocker。

---

## 11. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 已按六类 NFR 检查适用性 | pass | 性能、可用性、安全、审计 / 可追溯、幂等 / 一致性、可观测性均已判断并展开。 |
| 每项要求都有判断口径 / 目标值 | pass | 20 条 NFR 均包含可判断口径;不能量化的项未留空。 |
| 未写实现方案 | pass | 未写缓存参数、数据库优化、重试算法、监控配置、日志字段、event schema 或 DTO。 |
| 未继承旧硬指标 | pass | 旧 P95、30s、100%、SLA 等均列为候选 / historical conflict。 |
| 能回指能力节点或全仓目标 | pass | 已提供 NFR 与能力节点映射、功能 / 规则映射和 Step 14 承接方向。 |
| 未制造多真相源 | pass | NFR 继续保护 truth / snapshot / ref / forbidden body 分层。 |
| 是否允许写正式 `00-需求文档.md` §13 | blocked | 正式文档装配必须等 Step 17。 |
| 是否可进入 Step 14 | blocked_until_user_confirm | 必须等待用户确认后才能继续。 |
