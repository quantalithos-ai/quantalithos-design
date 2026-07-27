# 00 Step 15 · 风险与待确认事项

> 所属文档: `00-需求文档.md`
> Step: Step 15
> 目标章节: 正式文档 §15 `风险与待确认事项`
> 当前状态: completed_stop_review
> 当前约束: 本步只显式收纳尚未关闭的风险和待确认问题;不得补写前文章节遗漏功能、临时新增目标 / 规则 / 验收项、继续做设计方案选择、把普通 TODO 或未来优化包装成风险、写实现方案或测试方案。

---

## 1. Step 状态

| 字段 | 值 |
|---|---|
| step | Step 15 |
| status | completed_stop_review |
| gate_status | pass_for_step_15_only |
| previous_step | Step 14 `验收标准` |
| next_allowed_action | wait_user_review_to_step_16 |
| formal_section | `00-需求文档.md` §15 |
| formal_write_status | not_written |
| blocker_status | no_upstream_blocker_for_step_15 |

---

## 2. Step 内计划

| 序号 | 动作 | 状态 | 输出 |
|---|---|---|---|
| 1 | 回读项目台账、需求 flow、Step 1~14 | done | 确认用户已同意进入 Step 15,且不得跳到 Step 16 或正式文档装配。 |
| 2 | 读取需求 SOP Step 15 和书写规范 4.15 | done | 确认风险与待确认事项必须拆成两张表,且第三列分别写当前处理口径和当前状态。 |
| 3 | 读取讨论中间产物规范和真相源闭环标准 | done | 确认本步需要保留问题回答、诊断、取舍、结构化产物、回填草稿和停审门禁。 |
| 4 | 读取上游参考 Step 15 | done | 参考 `L1-governance`、`L3-method-library`、`L0-sdk` 的风险 / 待确认组织方式,不复制其它领域内容。 |
| 5 | 审计旧 `00-需求文档.md` §12 风险章节 | done | 识别旧白名单刷新、KMS / Vault、cost accounting、runtime 绕过、LLM routing、A2A 认证和成本粒度等旧风险口径。 |
| 6 | 汇总前序 Step 中仍需挂起的 OQ / historical conflict | done | 区分已被 Step 10~14 收口的事项与仍需后续文档细化的事项。 |
| 7 | 回答 SOP 问题并做风险分组 | done | 形成结构风险、边界回流风险、旧口径回流风险、后续设计细化风险。 |
| 8 | 收敛风险清单和待确认事项表 | done | 形成当前正式 Step 15 中间产物。 |
| 9 | 形成当前不阻塞项 / 后续阻塞项和回填草稿 | done | 为正式 §15 提供可回填候选,但不写入正式文档。 |
| 10 | 自检与停审 | done | 无阻塞 Step 15 的上游 blocker;等待用户确认是否进入 Step 16。 |

---

## 3. 本步输入与读取结论

### 3.1 前序 Step 输入

| 来源 | 已确认结论 | 对 Step 15 的影响 |
|---|---|---|
| Step 1~4 | 旧 README、旧 `00~06` 降级为 historical material;目标限定为 capability access truth、identity / registry、adapter descriptor、governance seam、method relation、SDK exposure boundary。 | 风险要重点防止旧 Provider Contract、CostRecord、QueryCapabilities、KMS / Vault、marketplace、LLM routing 回流。 |
| Step 5 | 本仓不形成正式权限矩阵;角色围绕管理、提议、审查、审计查看、目录浏览、系统消费和维护。 | “是否需要权限矩阵”和“只读角色是否细分”只影响后续权限 / 管理设计,不阻塞需求追溯。 |
| Step 6 | `L0-core` 是唯一编译期依赖候选;`L0-bus` 是事件协作;governance、runtime、tools、SDK、method-library、marketplace、observability、secret、finance 均不能写成源码拥有关系。 | 风险要保护依赖裁剪不被后续实现或设计反向破坏。 |
| Step 7 | 核心闭环为 C-CH-1~C-CH-5;外围增强和边界外能力已明确。 | 待确认事项不能把已排除的 runtime / cost / marketplace / LLM routing 写回核心闭环。 |
| Step 9 | 核心功能 `FR-CH-001~016` 已闭合;外围增强 `FR-CH-E01~E07` 不作为核心通过前置。 | 风险要关注外围增强误升核心和边界外功能回流。 |
| Step 10 | `BR-CH-001~037` 与 `BR-CH-E001` 已钉住不变量、禁止行为、显式变化、边界约束、治理约束和审计约束。 | 已闭合的规则不再列为待确认;只列后续设计若打穿规则会产生的风险。 |
| Step 11 | 数据归属按真相、快照、引用、禁止保存正文四类收束。 | 风险要防止 snapshot/ref/观测材料/执行材料成为第二真相源。 |
| Step 12 | 接口与依赖只到能力级边界,不写协议、DTO、event schema 或 port。 | API、event、DTO、状态和存储细节属于后续文档待细化,当前不阻塞 Step 16。 |
| Step 13 | NFR 使用判断口径,旧 P95、30s、SLA、cost、grep 等不作为硬指标。 | 性能 / 延迟 / 可观测指标只作为后续测试和容量阶段候选。 |
| Step 14 | `AC-CH-001~037` 与 `VF-CH-001~013` 已收束验收与一票否决。 | 一票否决项不再写成待确认,但要作为后续发生即阻塞的风险边界。 |

### 3.2 规范输入

| 输入文件 | 本步读取重点 | 对 Step 15 的约束 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 15 | 显式收纳尚未关闭的风险和待确认问题,防止脑补确定性结论。 | 风险和待确认必须拆成两张表。 |
| `需求文档书写规范.md` 4.15 | 风险表第三列写“当前如何约束 / 暂存”;待确认事项第三列写“当前如何挂起”。 | 不得写最终解决方案、实施方案、普通 TODO 或空泛“未定”。 |
| `设计文档讨论中间产物规范.md` | Step 文件必须有问题回答、诊断、取舍、结构化产物、回填草稿和停审状态。 | 本文件是正式 §15 的校准来源,不直接写正式文档。 |
| `设计真相源闭环与可落码性标准.md` | 继续任务必须从 ledger / flow / Step 文件恢复;风险和 blocker 闭口必须落文件。 | 本步必须更新 flow 和 project ledger,并明确是否阻塞下一步。 |

### 3.3 上游参考输入

| 参考文件 | 使用方式 | 结论 |
|---|---|---|
| `projects/L1-governance/design-calibration/00_req_step_15_risks_open_questions.md` | 参考“风险不是功能未实现,而是后续串线风险”的写法。 | capability-hub 也应聚焦 execution、governance truth、method body、observability 等边界回流风险。 |
| `projects/L3-method-library/design-calibration/00_req_step_15_risks_open_questions.md` | 参考“已收口的问题不重复列为待确认,只保留会影响结构成立的问题”的取舍。 | 本仓只保留仍影响后续架构、详细设计、测试或依赖边界的挂起项。 |
| `projects/L0-sdk/design-calibration/00_req_step_15_risks_open_questions.md` | 参考“下游 / 客户端边界和证据口径后移”的写法。 | SDK exposure 的具体 client / package / 验证方式不进入当前需求待确认主链。 |

### 3.4 旧材料输入

| 旧材料 | 可保留风险线索 | 不可继承口径 |
|---|---|---|
| 旧 `00` §12.1 常见风险 | 白名单刷新、key 泄露、cost 不准确、runtime 绕过 hub 都提示边界容易回流。 | 不继承概率 / 影响评分 / 缓解方案,不继承 last-known-good、KMS/Vault 强制、统一计费模型、deny by default。 |
| 旧 `00` §12.2 边缘风险 | MCP / A2A 协议变化、provider failover 复杂、marketplace / runtime 权限交叉提示后续细化风险。 | 不把 provider failover、marketplace transaction、runtime permission execution 写回当前需求主线。 |
| 旧 `00` §12.3 待确认问题 | LLM routing、A2A 认证模型、成本粒度是旧未闭口方向。 | 不继承负责人、截止时间或把 LLM routing / A2A auth / cost accounting 作为当前核心前置。 |

---

## 4. SOP 问题回答

### 4.1 当前还有哪些尚未关闭的风险?

当前风险不是“还没实现某功能”,而是后续 01~07 文档或实现阶段可能重新打穿 Step 1~14 已收束的能力边界和 truth owner。

| 风险类型 | 当前判断 |
|---|---|
| 旧 Provider Contract / KMS / key 管理口径回流 | 高风险。会把 adapter descriptor 写成 secret 平台、provider runtime 或密钥托管边界。 |
| 旧 QueryCapabilities / allow-deny / 白名单刷新口径回流 | 高风险。会把 formal exposure 和受控消费视图写成 runtime execution decision 或 governance policy cache。 |
| CostRecord / cost accounting / finance 粒度口径回流 | 高风险。会把 cost / billing / finance ledger 正文写回 capability-hub truth。 |
| runtime / tools / SDK / product 消费面反写真相 | 高风险。会让 consumer view、SDK wrapper、runtime cache 或 tool config 反向定义 identity、registry、descriptor 或 exposure。 |
| governance approval / Policy / shared_rules truth 与本仓 seam 混写 | 高风险。会让 capability-hub 越权生成或保存 governance truth。 |
| method relation 过强,导致 method body 或 definition source truth 进入本仓 | 高风险。会破坏 `L3-method-library` truth owner。 |
| marketplace / observability / audit / ecosystem 输出被误升为核心 truth | 中高风险。会让只读发现、审计摘要或观测材料替代 registry / exposure。 |
| 旧性能数字、SLA、grep、拦截率和成本覆盖率被直接作为测试或验收硬指标 | 中风险。会让后续测试和验收伪量化。 |
| 外部 MCP / A2A / API 协议细节、认证方式、DTO、event schema 或状态机被需求层提前锁死 | 中风险。会让需求文档越界承担详细设计职责。 |
| 外围增强未完成被误判为核心闭环未通过 | 中风险。会让管理 UI、搜索、候选发现、SDK 说明、只读生态发现或审计导出压过核心接入 truth。 |

### 4.2 这些风险会影响哪一层需求结构?

| 风险类型 | 主要影响范围 |
|---|---|
| Provider Contract / KMS / key 管理回流 | §2 定位与边界、§7 核心能力闭环、§9 功能需求、§10 规则、§11 数据归属、§13 非功能、§14 验收 |
| QueryCapabilities / allow-deny / 白名单刷新回流 | §7 核心能力闭环、§9 功能需求、§10 规则、§12 接口与依赖、§13 非功能、§14 验收 |
| CostRecord / cost accounting 回流 | §4 目标 / 非目标、§9 功能需求、§10 规则、§11 数据归属、§13 非功能、§14 验收 |
| 消费面反写真相 | §6 使用方与依赖、§7 核心能力闭环、§10 规则、§11 数据归属、§12 接口与依赖、§14 验收 |
| governance truth 与 seam 混写 | §2 边界、§6 使用方与依赖、§10 规则、§11 数据归属、§12 接口与依赖、§14 验收 |
| method relation 与 method body 混写 | §4 目标 / 非目标、§6 使用方与依赖、§10 规则、§11 数据归属、§12 接口与依赖、§14 验收 |
| marketplace / observability / audit 输出误升 truth | §7 核心能力闭环、§9 功能需求、§10 规则、§11 数据归属、§12 接口、§13 非功能、§14 验收 |
| 旧硬指标伪量化 | §13 非功能、§14 验收、后续 `05-测试方案.md` / `06-验收标准.md` |
| 协议 / DTO / 状态机提前锁死 | §12 接口与依赖、后续 `01`~`03`、`04`、`07` |
| 外围增强误阻塞核心 | §7 核心能力闭环、§8 用户故事、§9 功能需求、§13 非功能、§14 验收 |

### 4.3 当前还有哪些待确认事项?

待确认事项只保留会影响后续正式设计、测试或实施边界的问题。已经由 Step 10~14 明确收口的事项,不重复列为待确认。

当前仍需挂起的问题集中在后续设计层:

1. governance seam 的最小承载形态和延迟窗口。
2. method relation 是否需要能力类型 / 方法资产适用性摘要。
3. adapter descriptor 是否需要在设计层区分普通 API、LLM provider API、MCP、A2A 与 provider runtime 边界。
4. secret reference / safe summary 的最小内容。
5. SDK exposure 的服务端边界与 `L0-sdk` client / package 的交接方式。
6. marketplace、console、observability、finance、KMS / Vault 是否仅保留外围 / 外部接缝,以及是否需要后续正式接口或配置边界。
7. formal exposure / 受控消费视图、governance seam 变化感知和观测 surface 的量化或 schema 是否后续升级为测试目标。
8. 具体 API / Command / Query / Event、DTO、状态机、存储、配置、测试证据格式和 implementation boundary 如何在后续文档闭合。

### 4.4 哪些待确认项会影响前文结论是否成立?

这些待确认项不会推翻当前需求结论,但会影响后续文档如何细化:

| 待确认类型 | 对前文结论的影响 |
|---|---|
| governance seam 最小承载 | 不影响“governance truth 不归本仓”原则;影响 §11 数据字段、§12 接口、后续架构 / 详细设计。 |
| method relation 摘要强度 | 不影响 body-free relation 原则;影响 §11 数据归属细化和后续 relation schema。 |
| adapter descriptor 分类 | 不影响 descriptor 是核心能力;影响后续对象、接口、配置和测试矩阵如何拆分协议 / provider 类别。 |
| secret safe summary | 不影响 secret 正文禁止入仓;影响 descriptor 风险摘要字段、配置和安全测试边界。 |
| SDK exposure 交接方式 | 不影响本仓拥有服务端 formal exposure;影响 `L0-sdk` 消费、SDK 文档和下游验证边界。 |
| marketplace / console / observability / finance / KMS 外围接缝 | 不影响这些不是当前 truth owner;影响后续是否需要只读接口、配置或事件协作边界。 |
| 非功能量化和观测 surface | 不影响 Step 13 判断口径;影响后续测试方案、验收标准和可观测性设计。 |
| API / DTO / state / storage / evidence / boundary | 不影响需求层能力和边界;影响 01~07 可落码闭环。 |

### 4.5 哪些风险当前阶段可接受,哪些会阻塞后续推进?

| 分类 | 风险 / 待确认项 | 当前判断 |
|---|---|---|
| 当前可接受 | API / Command / Query / Event 名称、DTO、状态机、存储、配置、测试证据格式、implementation boundary 未定 | 属于后续 01~07 职责,不阻塞需求文档进入 Step 16。 |
| 当前可接受 | formal exposure 延迟、governance seam 感知窗口、观测指标、性能数值未量化 | 已作为候选目标暂存,不阻塞需求追溯矩阵。 |
| 当前可接受 | marketplace、console、observability、finance、KMS / Vault 只保留候选接缝或外围增强 | 已按边界外 / 外围增强 / 外部基础设施处理,不阻塞核心闭环。 |
| 当前可接受 | LLM provider API 与 provider runtime 的分类细节未最终展开 | 当前只按外部 API / provider runtime 边界处理,细分后移。 |
| 后续若发生则阻塞 | 本仓保存 secret、KMS / Vault、runtime / tools execution、provider runtime、cost、governance truth、method body、SDK client、marketplace transaction、observability store 或 production payload 正文 | 命中 Step 11 禁止保存正文和 Step 14 一票否决。 |
| 后续若发生则阻塞 | consumer view、QueryCapabilities、SDK wrapper、runtime cache、导出、搜索或维护任务反向定义 identity、registry、descriptor、seam、relation 或 exposure | 命中 truth owner 失效和消费面反写真相。 |
| 后续若发生则阻塞 | `L0-core` 之外的内部仓被写成编译期 dependency | 命中全局依赖裁剪规则和 Step 14 一票否决。 |
| 后续若发生则阻塞 | 草稿、候选、未描述、未治理能力被当作正式可见 / 可消费能力暴露 | 命中 formal exposure 安全边界。 |
| 后续若发生则阻塞 | 旧 `QueryCapabilities`、Policy 30s、白名单拦截、KMS、CostRecord、SLA 作为新版需求主线回流 | 命中 historical material 冲突回流。 |

---

## 5. 当前文档问题诊断

| 诊断对象 | 当前表现 | 问题 | Step 15 处理 |
|---|---|---|---|
| 旧 `00` §12 风险表 | 用概率、影响、缓解组织白名单刷新、key 泄露、cost、runtime 绕过。 | 写成实现 / 运行风险管理,且对象多数已被裁剪为边界外或 historical conflict。 | 改写为需求结构风险和当前处理口径。 |
| 旧待确认事项 | LLM routing、A2A 节点认证、成本粒度带负责人和截止时间。 | 混入实现 / 组织管理信息,且 LLM routing、auth、cost 不是当前核心主线。 | 降级为边界外 / 后续设计挂起项,不写负责人或截止时间。 |
| 前序 Step OQ 表 | 大量 pending 项已被 Step 10~14 收口。 | 原样汇总会把已决事项重新变成未定。 | 只保留后续设计仍需细化的口径。 |
| 旧性能 / 安全指标 | P95、30s、SLA、grep、拦截率、cost coverage 多次出现。 | 容易在测试方案中未经裁剪直接变硬门禁。 | 作为候选量化风险暂存,后续测试方案重新定义测量对象。 |
| 旧 `01/02/03/05/06` | 已写对象、service、repository、projection、KMS adapter、cost worker、验收签署等。 | 下游设计可能反向锁死需求边界。 | 继续作为 historical material,不得直接继承。 |

---

## 6. 设计取舍

### 6.1 风险与待确认骨架取舍

| 方案 | 优点 | 缺点 | 当前取舍 |
|---|---|---|---|
| 方案 A: 原样汇总 Step 1~14 所有 OQ | 信息完整。 | 大量事项已被后续 Step 吸收,会制造伪不确定。 | 不采用。 |
| 方案 B: 只保留仍影响后续设计、测试、验收或实施边界的风险和待确认事项 | 高信号,符合 Step 15 目标。 | 需要显式判断哪些问题已收口。 | 采用。 |
| 方案 C: 不写待确认事项,直接进入追溯矩阵 | 文档简洁。 | 会掩盖后续设计仍需闭口的 API / schema / evidence / boundary 细节。 | 不采用。 |
| 方案 D: 在本步解决所有待确认事项 | 看似完整。 | 违反 Step 15 职责,会越界进入架构、详细设计、配置、测试或实施计划。 | 不采用。 |

### 6.2 关键挂起项取舍

| 议题 | 当前口径 | 理由 |
|---|---|---|
| governance seam 最小引用 | 继续作为后续设计待确认,当前只保留正式 ref 或允许 safe summary 的需求口径。 | Step 10~14 已闭合职责分离和 truth owner,字段形态后移。 |
| method relation 摘要强度 | 继续作为后续设计待确认,当前只保留 body-free relation 和 method asset ref / allowed summary。 | 防止 Step 15 把 relation 写成 method body 同步。 |
| adapter descriptor 分类 | 继续作为后续设计待确认,当前只按外部 MCP / A2A / API 和 provider runtime 边界处理。 | 需求层已确认 descriptor 是核心能力,具体分类后移。 |
| secret safe summary | 继续作为后续设计待确认,当前只钉住 secret 正文和 KMS / Vault truth 不入仓。 | 字段级安全摘要属于 01~03 / 04 / 05。 |
| SDK exposure | 当前已确认是服务端 formal exposure,SDK client / package 不归本仓;具体交接后移。 | 防止 SDK client 回流,同时给后续接口设计留空间。 |
| marketplace / console / observability / finance / KMS | 当前按外围增强、候选消费方、外部基础设施或边界外处理。 | 这些不是当前核心 truth 前置。 |
| 旧硬指标 | 当前只保留候选量化线索,不作为需求硬指标或一票否决。 | Step 13 / 14 已明确不继承。 |
| API / DTO / state / storage / evidence / implementation boundary | 当前全部后移后续正式文档。 | Step 15 不做方案选择。 |

---

## 7. 结构化中间产物

### 7.1 风险清单

| 风险 | 影响范围 | 当前处理口径 |
|---|---|---|
| 旧 Provider Contract、API key、KMS / Vault、quota、route、cost 和 failover 口径在后续设计中再次回流,会把 adapter descriptor 膨胀为 secret 平台、provider runtime 或成本合同。 | 影响 §2、§4、§7、§9、§10、§11、§13、§14 | 当前按 adapter descriptor + secret ref / safe summary 边界处理;secret 正文、KMS / Vault truth、provider runtime、quota / route / cost / failover 均按禁止正文或边界外处理。 |
| 旧 QueryCapabilities、allow / deny、白名单刷新和 runtime provider lookup 在后续接口或测试中回流,会把 formal exposure 写成执行裁决或 policy cache。 | 影响 §7、§9、§10、§11、§12、§13、§14 | 当前按 formal exposure / controlled consumer view 处理;allow / deny enforcement、runtime cache 和 Policy refresh 不进入本仓 truth。 |
| CostRecord、cost accounting、billing、finance 粒度或成本覆盖率在后续文档中回流,会让 capability-hub 变成成本 / 账单事实仓。 | 影响 §4、§9、§10、§11、§13、§14 | 当前按 cost / billing / finance ledger 禁止入仓处理;仅可作为 historical conflict 或外部 / observability 背景暂存。 |
| runtime、tools、SDK、产品入口、查询视图、搜索、导出、对账或维护任务反写真相,会破坏 identity、registry、descriptor、seam、relation 和 exposure 的单一 truth。 | 影响 §6、§7、§10、§11、§12、§14 | 当前按消费面 / 派生面不得成为写源处理;变化协作和消费视图只能来源于正式接入事实。 |
| governance approval、Policy effective fact、shared_rules 或接入审查意见在后续设计中混写,会让 capability-hub 越权生成治理 truth。 | 影响 §2、§6、§9、§10、§11、§12、§14 | 当前按 governance seam relation、正式 result ref / allowed safe summary 和职责分离处理;approval / Policy / shared_rules truth 不进入本仓。 |
| capability-method relation 在后续设计中携带 method body、definition source truth 或方法正文版本,会破坏 `L3-method-library` truth owner。 | 影响 §4、§6、§7、§10、§11、§12、§14 | 当前按 body-free relation 与 method asset ref 处理;method body 和 definition truth 禁止进入本仓。 |
| marketplace listing / transaction、console 管理状态、observability audit store 或审计导出摘要被误升为核心 truth,会让外围增强压过核心接入事实。 | 影响 §6、§7、§8、§9、§10、§11、§12、§14 | 当前按外围增强、只读发现、审计友好摘要或候选消费方处理;listing、交易、UI 状态和观测存储不拥有本仓 truth。 |
| 外部 MCP / A2A / API 协议、A2A 认证模型、LLM provider API 分类或 provider runtime 细节在需求层提前锁死,会把 Step 15 写成详细设计。 | 影响 §7、§9、§10、§11、§12、后续 `01~04` | 当前只保留能力级分类和边界背景;具体协议、认证、DTO、状态机、adapter 和配置后移。 |
| 旧 P95、Policy 30s、SLA、明文 key grep、未白名单拦截率、成本覆盖率被未经裁剪写入测试 / 验收,会造成伪量化和越界验收。 | 影响 §13、§14、后续 `05-测试方案.md` / `06-验收标准.md` | 当前按候选量化线索和 historical conflict 暂存;后续必须基于正式能力面重新定义测量对象。 |
| 外围增强未完成被误判为核心闭环未通过,会使管理 UI、搜索、候选发现、安全摘要深化、SDK 说明、只读生态发现或审计导出阻塞核心需求。 | 影响 §7、§8、§9、§13、§14 | 当前按外围增强不阻塞核心闭环处理;若实现外围增强,必须遵守核心 truth 边界。 |
| 后续 Agent 因需求层未写 API / DTO / 状态机 / 存储 / evidence schema / implementation boundary 而自行补本地口径,会破坏设计真相源闭环。 | 影响 §12、§14、§16、后续 `01~07` | 当前按文档分层暂存:需求只写能力和边界,具体 schema、port、state、config、test evidence 和 boundary 必须在后续正式文档闭口。 |

### 7.2 待确认事项

| 待确认事项 | 影响章节 | 当前状态 |
|---|---|---|
| governance seam 的最小承载形态是 approval ref、policy result ref、scope summary、状态引用还是组合关系。 | §6、§10、§11、§12、§14、后续 `01~03` | 当前按正式 governance result ref 或允许 safe summary 暂存,不迁入 approval / Policy / shared_rules truth。 |
| governance seam 变化感知是否需要正式量化滞后窗口。 | §12、§13、§14、后续 `05~06` | 当前按“延迟可解释且不得伪造 truth”挂起,不继承旧 Policy 30s。 |
| capability-method relation 是否需要能力类型 / method asset 适用性摘要,以及摘要强度如何限定。 | §7、§10、§11、§12、§14、后续 `01~03` | 当前按 body-free relation 和 method asset ref / allowed summary 暂存,不保存 method body。 |
| adapter descriptor 是否需要在后续设计中细分普通外部 API、LLM provider API、MCP、A2A 与 provider runtime 边界。 | §7、§9、§10、§11、§12、后续 `01~04` | 当前按外部 MCP / A2A / API 接入语义和 provider runtime 边界背景挂起,不写字段或 adapter 类型。 |
| secret reference / safe summary 的最小内容是否需要进一步收窄。 | §10、§11、§13、§14、后续 `01~05` | 当前按 secret 正文和 KMS / Vault truth 不入仓处理,字段级安全摘要后移。 |
| SDK exposure 的服务端 formal exposure 与 `L0-sdk` client / package / developer experience 如何交接。 | §6、§7、§9、§12、§14、后续 `01~07` | 当前按服务端 exposure boundary 归本仓、SDK client 归 `L0-sdk` 挂起,不定义 SDK client。 |
| marketplace 是否只保留只读生态发现,还是需要后续正式只读 exposure / ref 边界。 | §6、§8、§9、§10、§11、§12、§14、后续 `01~03` | 当前按外围只读发现候选处理,listing / transaction / pricing / fulfillment 仍为边界外。 |
| `L5-console` 是否需要正式进入管理体验 P0,以及是否需要更细的人类只读角色。 | §5、§6、§8、§9、§12、§14、后续 `01~07` | 当前按外围管理入口和目录浏览体验挂起,不阻塞核心接入 truth。 |
| `L4-observability` 需要消费哪些 capability access 业务状态、变化或异常。 | §6、§11、§12、§13、§14、后续 `01~05` | 当前按可识别和 safe summary / ref 暂存,不定义观测 store、metric、trace 或 audit schema。 |
| finance / billing / provider raw billing 是否完全排除,还是仅保留外部背景引用。 | §4、§6、§10、§11、§13、§14 | 当前按 cost / billing / finance ledger 禁止入仓处理,不进入当前主链。 |
| formal exposure 或 controlled consumer view 是否需要具体读取延迟目标。 | §13、§14、后续 `05~06` | 当前按不成为不可解释瓶颈和不被外围增强阻塞处理,具体阈值后移。 |
| 具体 API / Command / Query / Event、DTO、状态机、存储、配置、测试证据格式和 implementation boundary 如何定义。 | §12、§14、§16、后续 `01~07` | 当前按能力级接口和需求层验收暂存,必须在后续正式文档闭口后才能交付实现。 |

### 7.3 当前不阻塞项与后续阻塞项

| 类型 | 条目 |
|---|---|
| 当前不阻塞 Step 16 | governance seam 字段未定;method relation 摘要强度未定;descriptor 分类未定;secret safe summary 字段未定;SDK exposure 交接方式未定;marketplace / console / observability 只读边界未定;非功能量化阈值未定;API / DTO / state / storage / evidence / implementation boundary 未定。 |
| 后续一旦发生即阻塞 | 禁止正文进入本仓;consumer view / SDK / runtime / query / export / maintenance 反写真相;`L0-core` 之外的内部仓成为编译期依赖;草稿 / 候选 / 未描述 / 未治理能力被正式暴露;旧 QueryCapabilities / Policy 30s / KMS / CostRecord / SLA 口径回流为新版主线。 |

### 7.4 当前处理口径汇总

| 类别 | 当前口径 |
|---|---|
| 核心 truth | 以 capability identity、registry、adapter descriptor、governance seam relation、body-free method relation、formal exposure 和 change / consumer impact fact 为核心。 |
| 外围增强 | 管理入口、搜索、候选自动发现、安全摘要深化、SDK 说明、只读生态发现、审计友好导出不阻塞核心闭环。 |
| 边界外 | runtime/tools execution、secret/KMS 平台、provider runtime、cost/billing、governance approval / Policy truth、method body、SDK client、marketplace transaction、observability store、LLM routing 不进入当前主链。 |
| 后续设计暂存 | API、DTO、event schema、state、storage、config、test evidence schema、implementation boundary 必须后移 01~07 正式文档闭口。 |
| 旧材料 | README 和旧 `00~06` 只作为 historical material;其术语可作风险线索,不得直接成为新版结论。 |

---

## 8. 旧材料差异审计

### 8.1 可保留为风险方向的旧材料

| 旧方向 | 本轮吸收方式 |
|---|---|
| 白名单刷新不及时 | 收敛为旧 QueryCapabilities / allow-deny / Policy refresh 回流风险;当前不继承白名单刷新执行。 |
| key 管理不当泄露 | 收敛为 secret 正文 / KMS truth 禁止入仓风险;当前不继承 KMS/Vault 强制实现。 |
| cost accounting 不准确 | 收敛为 cost / billing / finance ledger 回流风险;当前不继承统一计费模型或 CostRecord。 |
| runtime 绕过 hub 直连外部能力 | 收敛为 runtime/tools execution 不归本仓和消费面不得反写真相风险。 |
| MCP / A2A 协议变化较快 | 收敛为协议 / DTO / adapter 细节后移风险;当前只写能力级接入语义。 |
| 多 Provider failover 复杂 | 收敛为 provider runtime / failover 边界外风险;当前不做 provider orchestration。 |
| capability marketplace 与 runtime 权限边界交叉 | 收敛为 marketplace 只读发现候选和 runtime execution 边界风险。 |
| LLM routing 未定 | 收敛为边界外 / future 风险;当前不纳入核心闭环。 |
| A2A 节点认证模型未定 | 收敛为外部协议 / 认证细节后移;当前不做认证系统。 |
| 成本记账粒度未定 | 收敛为 finance / billing 外部背景;当前不进入本仓数据 truth。 |

### 8.2 不能继承的旧口径

| 旧口径 | 为什么不能在 Step 15 继承 | 后续处理 |
|---|---|---|
| 风险概率、影响评分、负责人、截止时间 | 4.15 要求风险 / 影响范围 / 当前处理口径,不是项目风险管理表。 | 可由后续项目管理或实施计划另行处理。 |
| last-known-good、lag 告警、deny by default | 属于运行策略、实现或配置。 | 01~05 若需要重新设计。 |
| KMS / Vault 强制 | 本仓不做 secrets 平台。 | 仅保留 secret ref / safe summary 边界。 |
| 统一计费事件模型 | cost / billing 非目标。 | finance / observability future。 |
| LLM routing 内建或独立服务 | LLM routing 是边界外 / future。 | 若未来纳入,必须重启目标 / 边界审计。 |
| A2A 证书 / token / DID 模型 | 属于外部协议 / 认证设计。 | 后续 adapter / config / security 设计判断。 |
| 成本请求级 / token 级 / 分钟级粒度 | finance / billing 语境。 | 当前需求不承接。 |

---

## 9. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §15。正式文档可摘录本文件 §7.1~§7.4 的表格,不重复扩写 SOP 问题回答、文档诊断和设计取舍。

```md
## 15. 风险与待确认事项

> 校准来源:
> - `design-calibration/00_req_step_15_risks_open_questions.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”“旧材料差异审计”和“自检与停审”小节,了解本章如何显式约束仍需挂起的不确定性。

本文采用 `design-calibration/00_req_step_15_risks_open_questions.md` §7 的风险与待确认事项结论。当前没有阻塞需求文档进入追溯矩阵的待确认项;API、DTO、event schema、state、storage、config、test evidence schema、implementation boundary、非功能阈值、外部协议分类和外围接缝均后移对应后续文档。若后续出现 forbidden body 入仓、消费面反写真相、非 `L0-core` 编译期依赖、未正式能力被正式暴露或旧 `QueryCapabilities` / Policy 30s / KMS / CostRecord / SLA 口径回流,则必须回退修正。

正式章节应摘录:

- `design-calibration/00_req_step_15_risks_open_questions.md` §7.1 风险清单。
- `design-calibration/00_req_step_15_risks_open_questions.md` §7.2 待确认事项。
- `design-calibration/00_req_step_15_risks_open_questions.md` §7.3 当前不阻塞项与后续阻塞项。
- `design-calibration/00_req_step_15_risks_open_questions.md` §7.4 当前处理口径汇总。
```

---

## 10. Blocker 判定

| blocker | 判定 | 说明 |
|---|---|---|
| 上游 blocker | 未发现 | Step 1~14 已提供 Step 15 所需风险、待确认和边界输入。 |
| 当前 Step 待确认项 | 不阻塞 Step 16 | 均属于后续 01~07 或 05/06 需要细化的设计 / 测试 / 实施口径,不推翻需求层能力和边界。 |
| 旧文档冲突 | 不阻塞 | 旧风险章节已降级为 historical material,并被重裁为风险方向或排除口径。 |
| 正式文档写入 | 未执行 | Step 15 只写中间产物;正式 `00-需求文档.md` 必须等 Step 17。 |

---

## 11. 自检与停审

| 检查项 | 状态 | 说明 |
|---|---|---|
| 已拆分风险与待确认事项 | pass | 已分别形成风险清单和待确认事项表。 |
| 每条风险都有影响范围和当前处理口径 | pass | 风险第三列均写当前如何约束、暂存或归类,未写最终解决方案。 |
| 每条待确认事项都有影响章节和当前状态 | pass | 待确认事项第三列均写当前如何挂起,未写空泛“未定”。 |
| 未把 TODO 或未来优化写成风险 | pass | 本步只保留影响前文结构成立或后续设计边界的风险 / 待确认事项。 |
| 未写实施方案或测试方案 | pass | 未写 repository、port、handler、event schema、DDL、测试脚本、监控配置或 evidence alias。 |
| 未脑补关闭未确认问题 | pass | governance seam、descriptor 分类、secret summary、SDK exposure、observability surface、阈值和 boundary 均保持挂起。 |
| 是否发现 Step 15 blocker | no | 无阻塞进入 Step 16 的上游 blocker。 |
| 是否允许进入 Step 16 | no | 当前必须停审,等待用户明确确认。 |

当前 Step 15 已完成并停审。下一步只有在用户确认后,才允许进入 Step 16 `需求追溯矩阵`。
