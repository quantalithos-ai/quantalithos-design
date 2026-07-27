# 00 Step 10 · 业务规则与边界约束

> 所属文档: `00-需求文档.md`
> Step: Step 10
> 目标章节: 正式文档 §10 `业务规则与边界约束`
> 当前状态: completed_stop_review
> 当前约束: 本步只把 Step 2 边界、Step 7 核心闭环和 Step 9 功能需求钉成需求层硬规则;不得写状态机编码、数据库约束、事务边界、接口签名、事件 schema、handler / service / repository 校验逻辑、具体异常码、字段归属矩阵、NFR、验收或实施计划。

---

## 1. Step 状态

| 字段 | 值 |
|---|---|
| step | Step 10 |
| status | completed_stop_review |
| gate_status | pass_for_step_10_only |
| previous_step | Step 9 `功能需求` |
| next_allowed_action | wait_user_review_to_step_11 |
| formal_section | `00-需求文档.md` §10 |
| formal_write_status | not_written |
| blocker_status | no_upstream_blocker_for_step_10 |

---

## 2. Step 内计划

| 序号 | 动作 | 状态 | 输出 |
|---|---|---|---|
| 1 | 回读项目台账、需求 flow、Step 7 / Step 9 | done | 确认用户已同意进入 Step 10,且不得跳到 Step 11 或正式文档装配。 |
| 2 | 读取需求 SOP Step 10 和书写规范 4.10 | done | 确认必须输出规则编号、规则类型、规则内容、约束对象、功能映射和能力级规则停审。 |
| 3 | 读取 Step 2 / Step 4 / Step 6 上游边界输入 | done | 确认规则必须守住 capability identity、registry、descriptor、governance seam、method relation、SDK exposure 与依赖裁剪边界。 |
| 4 | 读取参考项目 Step 10 粒度 | done | 参考 `L1-governance`、`L1-artifact`、`L3-method-library`、`L0-sdk` 的规则组织方式,不复制其它领域规则。 |
| 5 | 读取目标旧 `00` 规则章节和历史主线 | done | 识别旧规则污染: allowlist 执行、A2A 匿名注册、Provider key 加密、Policy 30s 刷新、成本 / 审计事件、shared_rules 混写。 |
| 6 | 按 C-CH-1~C-CH-5 回答 SOP 问题 | done | 形成不变量、禁止行为、显式变化、边界约束、治理约束和审计约束。 |
| 7 | 诊断旧规则与当前边界冲突 | done | 将旧 BR-001~BR-006 重裁为保留、后置或排除。 |
| 8 | 做设计取舍 | done | 采用“核心能力节点 -> 规则类型 -> 功能映射”方式,不采用旧白名单 / Query / secret / cost 规则清单。 |
| 9 | 形成结构化规则表、映射表、停审结论和回填草稿 | done | 为正式 §10 提供可回填候选,但不写入正式文档。 |
| 10 | 做跨能力规则审计与 blocker 判定 | done | 无阻塞 Step 10 的上游 blocker;等待用户确认是否进入 Step 11。 |

---

## 3. 本步输入与读取结论

### 3.1 前序 Step 输入

| 来源 | 已确认结论 | 对 Step 10 的影响 |
|---|---|---|
| Step 2 | 本仓是外部 MCP / A2A / API capability identity、capability registry 与 adapter descriptor 的能力接入真相仓;不是 runtime / tools execution、secret / KMS、cost / billing、marketplace、governance approval 或 SDK client 仓。 | 规则必须优先保护 capability access truth,并把 execution、secret、cost、transaction、approval 和 client 边界写成红线。 |
| Step 4 | 当前目标是建立 capability identity、registry、adapter descriptor、governance seam、method relation、SDK exposure boundary 的正式需求;非目标已排除 execution、provider runtime、method body、governance truth、SDK client、secret / KMS、cost / billing、marketplace、LLM routing。 | 规则不得把非目标换一种说法写回核心闭环。 |
| Step 6 | `L0-core` 是唯一编译期依赖;`L0-bus` 是事件协作主干;`L1-governance` 是结果接缝;`L2-runtime` / `L2-tools` / `L0-sdk` 是消费边界;`L3-method-library` 只保留 body-free relation;其余为运行期或外部边界。 | 规则必须保护“本仓只表达接入事实,不接管相邻仓真相”。 |
| Step 7 | 核心能力节点为 C-CH-1 稳定身份、C-CH-2 受控注册目录、C-CH-3 可解释接入描述、C-CH-4 治理 / 方法关系接缝、C-CH-5 受控消费表达与变化感知。 | Step 10 必须按这五个节点组织规则,再做跨能力审计。 |
| Step 9 | 功能需求已收束为 FR-CH-001~FR-CH-016 和 FR-CH-E01~FR-CH-E07,并明确 `US-CH-017` 进入 `FR-CH-014 受控消费表达`。 | 每条规则必须保护至少一个功能或边界目标,不能出现孤儿规则。 |

### 3.2 规范输入

| 输入文件 | 本步读取重点 | 对 Step 10 的约束 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 10 | 规则必须围绕能力节点展开,优先收敛不变量、禁止行为、显式变化、边界约束,治理 / 审计按需补充。 | 不得写无功能来源的规则;无法挂载的项只能进入 OQ / 风险。 |
| `需求文档书写规范.md` 4.10 | 业务规则表固定列为“规则编号 / 规则类型 / 规则内容 / 约束对象”;规则类型固定为不变量、禁止行为、显式变化、边界约束,治理 / 审计可扩展。 | 不得写状态机编码、数据库约束、事务、接口签名、事件 schema 或实现校验。 |
| `设计文档讨论中间产物规范.md` | Step 文件必须保留问题回答、诊断、取舍、结构化产物、回填草稿和停审状态。 | 本文件必须可作为 Step 11 数据归属、Step 12 接口边界和 Step 16 追溯矩阵输入。 |

### 3.3 上游参考输入

| 参考文件 | 使用方式 | 结论 |
|---|---|---|
| `projects/L1-governance/design-calibration/00_req_step_10_business_rules_boundaries.md` | 参考“规则类型 + 约束对象 + FR 映射 + 能力级停审”结构 | 采用同样的规则收束形态,但不继承治理域规则内容。 |
| `projects/L3-method-library/design-calibration/00_req_step_10_business_rules_boundaries.md` | 参考“整体模块思考 + 边界红线 + 旧材料差异审计”表达方式 | 采用同样的差异审计与边界红线组织方式。 |
| `projects/L0-sdk/design-calibration/00_req_step_10_rules_boundary_constraints.md` | 参考“禁止把客户端 / 外围能力反向写成本仓 truth”的写法 | 命名与其它项目不同,但内容有效;该命名差异不构成 blocker。 |
| `projects/L1-artifact/design-calibration/00_req_step_10_business_rules_boundaries.md` | 参考粒度与停审密度 | 只借用收口粒度,不借用 artifact 域边界口径。 |

### 3.4 目标旧规则输入

| 旧规则 / 旧主线 | 可保留线索 | 不可继承口径 |
|---|---|---|
| BR-001 `MCP Server 不在 allowlist -> 拒绝调用` | 外部能力正式可见 / 可用语境需要有明确边界。 | allow / deny 执行属于 runtime / tools execution,不能作为本仓业务规则结果。 |
| BR-002 `A2A Node 匿名注册 -> 拒绝` | 能力身份和接入审查需要清楚身份风险解释。 | “匿名注册拒绝”是协议 / 认证 / 接口层动作,不能直接作为需求规则正文。 |
| BR-003 `Provider key 未加密 -> 拒绝持久化` | descriptor 可能需要 secret reference 和禁止保存正文。 | key 加密、KMS / Vault 集成和密钥托管不归本仓。 |
| BR-004 `Policy 更新影响白名单 -> 30s 内刷新` | governance 结果变化需要进入 capability 变化协作与感知。 | 30s 是 NFR / 验收;白名单刷新是执行 / 缓存协作,不是需求规则主语。 |
| BR-005 `外部调用成功/失败 -> 发成本/审计事件` | 能力接入事实需要可追溯输出。 | 成本 / 调用日志 / observability store 不归本仓。 |
| BR-006 `shared_rules 禁止某能力 -> 项目级 allow 不得放开` | 本仓不得让局部可见性表达替代 governance policy truth。 | shared_rules / Policy truth 归 `L1-governance`,本仓只承接 seam。 |

---

## 4. SOP 问题回答

### 4.1 当前正在讨论哪个核心能力节点?

本步按以下顺序讨论并停审规则:

1. C-CH-1 外部能力能够以稳定身份进入接入语境。
2. C-CH-2 外部能力能够进入受控注册目录并形成生命周期语义。
3. C-CH-3 已注册能力能够拥有可解释的接入描述。
4. C-CH-4 接入事实能够承接治理结果并保持方法资产关系边界。
5. C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化。

该顺序是规则收束顺序,不是实现顺序、接口调用顺序、数据库状态机顺序或事件传播顺序。

### 4.2 哪些不变量必须始终成立?

| 不变量 | 保护目的 |
|---|---|
| capability identity 必须是稳定的正式接入主体,不能退化为 URL、provider 名、tool config、runtime config 或 marketplace listing。 | 保护 C-CH-1 稳定身份成立。 |
| registry 中的正式接入事实必须锚定稳定 capability identity,不能先有目录条目再倒推身份。 | 保护 C-CH-1 / C-CH-2。 |
| 注册目录必须显式区分草稿、未描述、未治理、正式可见等接入语境,不能退化为单一 allowlist 或 availability bit。 | 保护 C-CH-2 / C-CH-5。 |
| adapter descriptor 必须表达接入方式、能力类型和边界约束,但不得变成 provider runtime、quota / route / cost contract 或 secret 正文容器。 | 保护 C-CH-3。 |
| 接入风险与约束摘要只能表达 descriptor 相关的风险和约束,不能替代 governance policy 或 approval truth。 | 保护 C-CH-3 / C-CH-4。 |
| governance seam 只能承接正式治理结果引用或允许的安全摘要,不能在本仓生成 approval / Policy truth。 | 保护 C-CH-4。 |
| capability-method relation 必须是 body-free relation,不能把 method body 或 definition source truth 迁入本仓。 | 保护 C-CH-4。 |
| 正式消费表达必须来源于 identity、registry、descriptor、governance seam 和 method relation 的正式接入事实,不能由消费方或派生视图反向定义。 | 保护 C-CH-5。 |
| 派生索引、搜索结果、导出、变化协作和对账结果只能消费接入事实,不能成为新的业务真相写源。 | 保护 C-CH-2 / C-CH-5。 |

### 4.3 哪些行为必须禁止?

| 禁止行为 | 禁止原因 |
|---|---|
| 查询、浏览、导出、消费或变化协作不得隐式创建、合并、拆分或更正 capability identity。 | 防止消费面反向成为 identity 写源。 |
| 维护任务、索引重建、目录对账或派生刷新不得创造新的正式接入结论。 | 防止后台任务成为 registry truth owner。 |
| 不得把 runtime / tools execution、allow / deny 拦截、外部调用结果或 provider invocation result 写成本仓真相。 | execution 不归本仓。 |
| 不得把 API key、secret 正文、KMS / Vault、quota、route、cost、failover、retry 或 provider runtime 写成本仓真相。 | secret / provider runtime / cost 不归本仓。 |
| 不得把 governance approval、Policy effective fact、shared_rules 生效 truth 或白名单刷新语义写成本仓真相。 | governance truth 不归本仓。 |
| 不得把 Method Content、TaskDefinition、AIPolicyDef、ProcessTemplateDef 或其它方法正文复制到 capability-hub。 | method body 不归本仓。 |
| 不得把 SDK client、多语言 package、客户端便利封装或调用 SDK 的包装结果写成本仓正式能力边界。 | SDK client 不归本仓。 |
| 不得把 marketplace listing、交易、定价、履约或镜像注册写成 registry truth。 | marketplace transaction 不归本仓。 |
| 不得用 observability log、trace、cost ledger 或 audit store 替代 capability 接入事实追溯。 | 物理观测不等于 capability access truth。 |
| 接入审查意见不得替代 governance approval,也不得被误写成 Policy truth。 | 审查与治理职责必须分离。 |

### 4.4 哪些状态变化必须显式发生,不能隐式发生?

| 显式变化 | 原因 |
|---|---|
| capability identity 的建立、合并、拆分、退役或正式更正必须显式发生。 | 否则后续 registry / descriptor / seam 无法追溯。 |
| registry 条目的纳入、退出、可见性变化和生命周期语义变化必须显式发生。 | 防止目录状态被 runtime 或浏览结果静默改变。 |
| adapter descriptor 的建立、替换和约束摘要变化必须显式发生。 | 防止消费方围绕不同 descriptor 私补真相。 |
| 接入审查意见、风险解释和 governance seam 的挂接 / 替换 / 失效必须显式发生。 | 防止职责混写和接缝来源不可追溯。 |
| capability-method relation 的建立、变更和移除必须显式发生。 | 防止 method relation 由正文同步或消费推导静默生成。 |
| 正式消费表达、正式可见性和服务端 exposure boundary 的变化必须显式发生。 | 防止 SDK / runtime / tools 私自重定义正式能力。 |
| 变化协作、导出、对账和维护结果必须显式说明来源、范围和结果。 | 防止派生结果静默改变正式接入事实。 |

### 4.5 哪些边界不能被打穿?

| 边界 | 不能被打穿的内容 |
|---|---|
| capability-hub / runtime-tools | 本仓不拥有 runtime / tools execution、allow / deny enforcement、外部调用结果或运行状态 truth。 |
| capability-hub / governance | 本仓不拥有 governance approval、Policy truth、shared_rules truth 或治理缓存。 |
| capability-hub / method-library | 本仓不拥有 method body、definition source truth 或方法正文版本。 |
| capability-hub / SDK | 本仓不拥有 SDK client、language package 或客户端 convenience truth。 |
| capability-hub / provider-secret-cost | 本仓不拥有 secret 平台、KMS / Vault、provider runtime、quota / route / cost / billing truth。 |
| capability-hub / marketplace | 本仓不拥有 listing、交易、定价、履约或生态运营真相。 |
| capability-hub / observability | 本仓事实可以被审计,但本仓不拥有 audit log store、trace、metrics、cost ledger 或 alert stream truth。 |

### 4.6 哪些操作必须附带治理、审计或引用条件?

| 条件类型 | 操作 / 变化 | 需求层要求 |
|---|---|---|
| 治理约束 | 正式可见 / 可用语境依赖治理结论时 | 必须挂接正式 governance 结果引用或允许的结果摘要,不得只凭本地目录状态决定。 |
| 治理约束 | 高风险 descriptor、正式 exposure boundary 变化或需要限制能力使用范围的变化 | 必须保留接入审查与 governance seam 的职责分离,不得绕过 `L1-governance`。 |
| 引用约束 | method relation、governance seam、secret reference、外部能力来源说明 | 必须以 ref / safe summary / body-free relation 方式表达,不得保存正文或接管上游 truth。 |
| 审计约束 | identity、registry、descriptor、governance seam、method relation、正式消费表达的关键变化 | 必须形成可追溯记录。 |
| 审计约束 | 导出、搜索、对账、维护和变化协作输出 | 必须能说明来源、范围和结果,不得静默改变正式结论。 |

### 4.7 当前规则分别保护哪些功能需求?

规则覆盖五条功能主线:

1. `FR-CH-001~003` 由稳定身份不变量、禁止隐式建身和身份显式变化规则保护。
2. `FR-CH-004~006` 由 registry 锚定 identity、目录语义不可退化、维护不创造新结论和显式目录变化规则保护。
3. `FR-CH-007~009` 由 descriptor 真相边界、secret / provider runtime 排除、风险摘要不替代 governance 和 descriptor 显式变化规则保护。
4. `FR-CH-010~013` 由 governance seam 不生成 approval truth、审查与治理职责分离、method body-free relation 和 seam / relation 显式变化规则保护。
5. `FR-CH-014~016` 由正式消费表达来源固定、消费方不得反写、SDK / marketplace / observability / execution 边界以及变化协作显式可追溯规则保护。

### 4.8 是否存在无法回指功能需求或边界目标的规则?

不存在。所有核心规则都至少回指一个 `FR-CH-*` 或 Step 2 / Step 4 已确认的边界目标。外围增强只保留一条总规则,用于防止增强能力改变核心真相边界。

### 4.9 当前能力节点的规则是否足以阻止串仓、越界或隐式变化?

是。当前规则已经覆盖:

- identity / registry / descriptor / seam / relation / exposure 的需求层不变量
- execution、secret、cost、governance truth、method body、SDK client、marketplace、observability 的边界红线
- identity、registry、descriptor、seam、relation、exposure、协作输出的显式变化要求
- 正式可见 / 可用依赖治理结果时的治理与审计约束

因此 Step 11 可以围绕这些规则继续收敛数据归属,而不需要在 Step 10 再写接口、字段或实现机制。

---

## 5. 当前文档问题诊断

| 诊断对象 | 当前表现 | 问题 | Step 10 处理 |
|---|---|---|---|
| 旧规则表 BR-001~BR-006 | allowlist 拒绝、A2A 匿名注册、Provider key 加密、Policy 30s 刷新、调用成功 / 失败审计事件、shared_rules 覆盖。 | 接口动作、执行、secret、NFR、observability 与 governance truth 混写。 | 重裁为需求层不变量、禁止行为、显式变化和边界约束;NFR 与执行机制后移。 |
| 旧 `F-006 Policy 消费与白名单刷新` 主线 | 把 capability-hub 写成 policy-update 动态白名单承接者。 | 容易把 governance truth 与 runtime whitelist 执行压进本仓。 | 保留 seam 和变化协作线索,排除刷新时延与执行语义。 |
| 旧 `Provider Contract` 主线 | 把 key / quota / route / cost / KMS 与 descriptor 合并。 | descriptor truth 与 provider runtime / secret / cost truth 混写。 | 只保留 descriptor 与风险 / 约束摘要;secret / provider runtime / cost 写成边界红线。 |
| 旧 `QueryCapabilities` 主线 | 把 runtime 查询面、allow / deny 结果和可用能力表达混在一起。 | 把消费接口、执行语义和正式能力表达混为一体。 | 只保留正式消费表达和正式可见性规则;接口和查询面后移 Step 12。 |
| 旧 `Audit / Cost` 主线 | 调用成功 / 失败与成本记账并列。 | observability 与 finance truth 混写成 capability-hub 规则。 | 只保留 capability access truth 的可追溯约束;成本和物理观测排除。 |
| 旧 README / 旧 00 | 多处使用“白名单”“Provider Contract”“policy-update 30s”“marketplace metadata”。 | 历史材料会把规则拉回执行、secret、cost 和 marketplace 方向。 | 统一降级为 historical material,仅保留冲突线索。 |

---

## 6. 设计取舍

### 6.1 规则骨架取舍

| 方案 | 规则骨架 | 优点 | 缺点 | 当前取舍 |
|---|---|---|---|---|
| 方案 A | 沿用旧 BR-001~BR-006 | 迁移快,旧文档命名直观。 | 保留 allowlist 执行、key 加密、30s 刷新、调用审计和 shared_rules 真相混写。 | 不采用。 |
| 方案 B | 按不变量 / 禁止行为 / 显式变化 / 边界约束 / 治理约束 / 审计约束重写 | 能把 capability access truth 与相邻仓边界稳定钉住,并直接服务 Step 11 / Step 12 / Step 14。 | 需要后续 Step 再闭合数据、接口和验收。 | 采用。 |
| 方案 C | 只写 registry / descriptor 两类规则 | 篇幅短,聚焦对象少。 | 会漏掉治理 seam、method relation、服务端 exposure boundary 和变化协作。 | 不采用。 |
| 方案 D | 直接写接口校验和状态流转 | 贴近实现落地。 | 越过需求层,会把 Step 10 写成概要 / 详细设计。 | 不采用。 |

### 6.2 关键议题取舍

| 议题 | 当前结论 | 理由 |
|---|---|---|
| allow / deny / 白名单最终语义归属 | 不作为 capability-hub 执行规则;只保留“正式可见 / 可用边界不得由本地 allowlist 私自定义”的规则。 | allow / deny 执行属于 runtime / tools;本仓只表达 access truth。 |
| secret reference 是否进入规则层 | 进入,但只作为“允许 ref / 摘要,禁止正文 / KMS truth”的硬规则。 | Step 10 应钉住禁止保存正文,具体数据归属留给 Step 11。 |
| governance seam 最小引用内容 | 在规则层只要求“正式结果引用或允许摘要必须存在且可追溯”,不先锁字段。 | 避免 Step 10 提前进入数据 / 接口层。 |
| method relation 是否只允许 body-free ref | 是,在 Step 10 作为硬规则成立。 | 这是本仓与 `L3-method-library` 边界的核心红线。 |
| SDK exposure 最小服务端边界 | 只写“服务端正式能力边界与客户端 convenience truth 必须分离”的规则。 | Step 10 保护边界,Step 12 再闭合接口 surface。 |
| marketplace 只读发现 | 只保留“外围增强不得改变核心真相边界”的规则,listing / transaction 继续排除。 | 防止只读发现重新膨胀成 marketplace truth。 |
| provider API / LLM provider API / provider runtime 区分 | 规则层只认“外部能力接入语义”与“provider runtime truth”分层,不先细分字段。 | Step 10 先钉边界,细分数据归属后移。 |

---

## 7. 结构化中间产物

### 7.1 规则编号结论

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| BR-CH-001 | 不变量 | capability identity 必须作为稳定的正式接入主体存在,不能退化为 URL、provider 名、tool config、runtime config 或 marketplace listing。 | capability identity |
| BR-CH-002 | 不变量 | registry 中的正式接入事实必须锚定稳定 capability identity,不得先有目录条目再倒推身份。 | capability registry |
| BR-CH-003 | 不变量 | 注册目录必须显式区分草稿、未描述、未治理和正式可见等接入语境,不得退化为单一 allowlist 或 availability bit。 | registry visibility / lifecycle |
| BR-CH-004 | 不变量 | adapter descriptor 必须表达接入方式、能力类型和边界约束,不得变成 provider runtime、quota / route / cost contract 或 secret 正文容器。 | adapter descriptor |
| BR-CH-005 | 不变量 | 接入风险与约束摘要只能表达 descriptor 相关的风险和约束,不得替代 governance policy、approval truth 或执行拦截结论。 | descriptor risk / constraint summary |
| BR-CH-006 | 不变量 | governance seam 只能承接正式治理结果引用或允许的结果摘要,不得在本仓生成 approval / Policy truth。 | governance seam |
| BR-CH-007 | 不变量 | capability-method relation 必须是 body-free relation,不得把 method body、definition source truth 或正文版本迁入本仓。 | capability-method relation |
| BR-CH-008 | 不变量 | 正式消费表达必须来源于 identity、registry、descriptor、governance seam 和 method relation 的正式接入事实,不得由消费方、导出结果或派生视图反向定义。 | formal exposure boundary |
| BR-CH-009 | 不变量 | 派生索引、搜索结果、导出、变化协作和对账结果只能消费正式接入事实,不得成为新的业务真相写源。 | derived views / maintenance outputs |
| BR-CH-010 | 禁止行为 | 查询、浏览、导出、消费或变化协作不得隐式创建、合并、拆分或更正 capability identity。 | identity-related read / consume actions |
| BR-CH-011 | 禁止行为 | 维护任务、索引重建、目录对账或派生刷新不得创造新的正式接入结论。 | registry maintenance |
| BR-CH-012 | 禁止行为 | 不得把 runtime / tools execution、allow / deny 拦截、外部调用结果或 provider invocation result 写成本仓真相。 | execution boundary |
| BR-CH-013 | 禁止行为 | 不得把 API key、secret 正文、KMS / Vault、quota、route、cost、failover、retry 或 provider runtime 写成本仓真相。 | provider secret / runtime / cost |
| BR-CH-014 | 禁止行为 | 不得把 governance approval、Policy effective fact、shared_rules 生效 truth 或白名单刷新语义写成本仓真相。 | governance truth boundary |
| BR-CH-015 | 禁止行为 | 不得把 Method Content、TaskDefinition、AIPolicyDef、ProcessTemplateDef 或其它方法正文复制到 capability-hub。 | method body boundary |
| BR-CH-016 | 禁止行为 | 不得把 SDK client、多语言 package、客户端便利封装或调用 SDK 的包装结果写成本仓正式能力边界。 | SDK client boundary |
| BR-CH-017 | 禁止行为 | 不得把 marketplace listing、交易、定价、履约或镜像注册写成 registry truth。 | marketplace boundary |
| BR-CH-018 | 禁止行为 | 不得用 observability log、trace、cost ledger 或 audit store 替代 capability 接入事实追溯。 | observability / finance boundary |
| BR-CH-019 | 禁止行为 | 接入审查意见不得替代 governance approval,也不得被误写成 Policy truth。 | access review / governance responsibility |
| BR-CH-020 | 显式变化 | capability identity 的建立、合并、拆分、退役或正式更正必须显式发生。 | capability identity lifecycle |
| BR-CH-021 | 显式变化 | registry 条目的纳入、退出、可见性变化和生命周期语义变化必须显式发生。 | registry lifecycle |
| BR-CH-022 | 显式变化 | adapter descriptor 的建立、替换和约束摘要变化必须显式发生。 | descriptor evolution |
| BR-CH-023 | 显式变化 | 接入审查意见、风险解释和 governance seam 的挂接、替换、失效必须显式发生。 | access review / governance seam |
| BR-CH-024 | 显式变化 | capability-method relation 的建立、变更和移除必须显式发生。 | capability-method relation lifecycle |
| BR-CH-025 | 显式变化 | 正式消费表达、正式可见性和服务端 exposure boundary 的变化必须显式发生。 | formal exposure / visibility |
| BR-CH-026 | 显式变化 | 变化协作、导出、对账和维护结果必须显式说明来源、范围和结果。 | maintenance / collaboration outputs |
| BR-CH-027 | 边界约束 | capability-hub 不拥有 runtime / tools execution、allow / deny enforcement、外部调用结果或运行状态 truth。 | capability-hub / runtime-tools 边界 |
| BR-CH-028 | 边界约束 | capability-hub 不拥有 governance approval、Policy truth、shared_rules truth 或治理缓存。 | capability-hub / governance 边界 |
| BR-CH-029 | 边界约束 | capability-hub 不拥有 method body、definition source truth 或方法正文版本。 | capability-hub / method-library 边界 |
| BR-CH-030 | 边界约束 | capability-hub 不拥有 SDK client、language package 或客户端 convenience truth。 | capability-hub / SDK 边界 |
| BR-CH-031 | 边界约束 | capability-hub 不拥有 secret 平台、KMS / Vault、provider runtime、quota / route / cost / billing truth。 | capability-hub / provider-secret-cost 边界 |
| BR-CH-032 | 边界约束 | capability-hub 不拥有 listing、交易、定价、履约或生态运营真相。 | capability-hub / marketplace 边界 |
| BR-CH-033 | 边界约束 | capability-hub 事实可以被审计,但 capability-hub 不拥有 audit log store、trace、metrics、cost ledger 或 alert stream truth。 | capability-hub / observability 边界 |
| BR-CH-034 | 治理约束 | 正式可见 / 可用语境依赖治理结论时,必须挂接正式 governance 结果引用或允许的结果摘要,不得只凭本地目录状态决定。 | formal visibility / use governance precondition |
| BR-CH-035 | 治理约束 | 高风险 descriptor、正式 exposure boundary 变化或需要限制能力使用范围的变化,必须保留接入审查与 governance seam 的职责分离,不得绕过 `L1-governance`。 | high-risk access changes |
| BR-CH-036 | 审计约束 | identity、registry、descriptor、governance seam、method relation、正式消费表达的关键变化必须形成可追溯记录。 | capability access audit |
| BR-CH-037 | 审计约束 | 导出、搜索、对账、维护和变化协作输出必须能说明来源、范围和结果,不得静默改变正式结论。 | derived / exported outputs audit |
| BR-CH-E001 | 边界约束 | 管理入口、搜索优化、候选自动发现、安全摘要深化、SDK 说明增强、只读生态发现和审计导出作为外围增强时,不得改变 capability identity、registry、descriptor、governance seam、method relation 与 formal exposure 的核心真相边界。 | peripheral enhancement boundary |

### 7.2 规则类型结论

| 规则类型 | 规则编号 |
|---|---|
| 不变量 | BR-CH-001;BR-CH-002;BR-CH-003;BR-CH-004;BR-CH-005;BR-CH-006;BR-CH-007;BR-CH-008;BR-CH-009 |
| 禁止行为 | BR-CH-010;BR-CH-011;BR-CH-012;BR-CH-013;BR-CH-014;BR-CH-015;BR-CH-016;BR-CH-017;BR-CH-018;BR-CH-019 |
| 显式变化 | BR-CH-020;BR-CH-021;BR-CH-022;BR-CH-023;BR-CH-024;BR-CH-025;BR-CH-026 |
| 边界约束 | BR-CH-027;BR-CH-028;BR-CH-029;BR-CH-030;BR-CH-031;BR-CH-032;BR-CH-033;BR-CH-E001 |
| 治理约束 | BR-CH-034;BR-CH-035 |
| 审计约束 | BR-CH-036;BR-CH-037 |

### 7.3 规则内容结论

本步规则内容收敛为四条主线:

1. capability access truth 不被污染:
   capability identity、registry、descriptor、governance seam、method relation 和 formal exposure 都必须保持本仓自己的需求层真相边界。
2. execution、secret、governance truth、method body、SDK client、marketplace 和 observability 不被接管:
   这些主题只能作为边界或引用对象进入本仓,不能进入本仓真相层。
3. 正式接入变化必须显式发生:
   identity、registry、descriptor、seam、relation、formal exposure 和维护输出都不能隐式变化。
4. 正式可见 / 可用必须可治理、可追溯:
   一旦能力进入正式消费语境,其治理接缝、职责分离和追溯要求必须成立。

### 7.4 约束对象结论

| 约束对象 | 相关规则 |
|---|---|
| capability identity | BR-CH-001;BR-CH-010;BR-CH-020;BR-CH-036 |
| capability registry | BR-CH-002;BR-CH-003;BR-CH-011;BR-CH-021;BR-CH-036 |
| adapter descriptor / risk summary | BR-CH-004;BR-CH-005;BR-CH-013;BR-CH-022;BR-CH-031;BR-CH-035;BR-CH-036 |
| governance seam / access review | BR-CH-006;BR-CH-014;BR-CH-019;BR-CH-023;BR-CH-028;BR-CH-034;BR-CH-035;BR-CH-036 |
| capability-method relation | BR-CH-007;BR-CH-015;BR-CH-024;BR-CH-029;BR-CH-036 |
| formal exposure / visibility | BR-CH-003;BR-CH-008;BR-CH-016;BR-CH-025;BR-CH-030;BR-CH-034;BR-CH-035;BR-CH-036 |
| maintenance / derived outputs | BR-CH-009;BR-CH-011;BR-CH-026;BR-CH-037 |
| execution / runtime-tools boundary | BR-CH-012;BR-CH-027 |
| provider secret / runtime / cost boundary | BR-CH-013;BR-CH-031 |
| marketplace boundary | BR-CH-017;BR-CH-032;BR-CH-E001 |
| observability / finance boundary | BR-CH-018;BR-CH-033;BR-CH-037 |

### 7.5 规则与功能映射结论

| 功能需求 | 主要规则 |
|---|---|
| FR-CH-001 外部能力接入语境建立 | BR-CH-001;BR-CH-010;BR-CH-020 |
| FR-CH-002 能力身份稳定识别 | BR-CH-001;BR-CH-002;BR-CH-020 |
| FR-CH-003 接入身份风险解释 | BR-CH-005;BR-CH-019;BR-CH-023;BR-CH-035 |
| FR-CH-004 能力注册目录管理 | BR-CH-002;BR-CH-021;BR-CH-027 |
| FR-CH-005 目录可见性与生命周期语义 | BR-CH-003;BR-CH-021;BR-CH-034 |
| FR-CH-006 目录维护与一致性保护 | BR-CH-009;BR-CH-011;BR-CH-026;BR-CH-037 |
| FR-CH-007 Adapter descriptor 表达 | BR-CH-004;BR-CH-022;BR-CH-031 |
| FR-CH-008 接入风险与约束摘要 | BR-CH-005;BR-CH-013;BR-CH-022;BR-CH-035 |
| FR-CH-009 描述边界消费支撑 | BR-CH-004;BR-CH-008;BR-CH-012;BR-CH-016;BR-CH-025 |
| FR-CH-010 治理结果接缝承接 | BR-CH-006;BR-CH-014;BR-CH-023;BR-CH-028;BR-CH-034 |
| FR-CH-011 接入审查与治理职责区分 | BR-CH-019;BR-CH-023;BR-CH-035 |
| FR-CH-012 Method asset body-free relation | BR-CH-007;BR-CH-015;BR-CH-024;BR-CH-029 |
| FR-CH-013 接入事实追溯 | BR-CH-009;BR-CH-018;BR-CH-036;BR-CH-037 |
| FR-CH-014 受控消费表达 | BR-CH-008;BR-CH-012;BR-CH-016;BR-CH-025;BR-CH-030;BR-CH-036 |
| FR-CH-015 正式可见性表达 | BR-CH-003;BR-CH-021;BR-CH-025;BR-CH-034 |
| FR-CH-016 能力变化协作与感知 | BR-CH-009;BR-CH-026;BR-CH-036;BR-CH-037 |
| FR-CH-E01~E07 外围增强 | BR-CH-E001 |

### 7.6 能力级规则停审结论

| 核心能力节点 | 规则承接 | 停审结论 |
|---|---|---|
| C-CH-1 稳定身份 | BR-CH-001;BR-CH-002;BR-CH-010;BR-CH-020 | 已钉住 capability identity 不能退化为 URL / provider / runtime config,且身份变化必须显式发生,可进入 Step 11。 |
| C-CH-2 注册目录 | BR-CH-002;BR-CH-003;BR-CH-009;BR-CH-011;BR-CH-021;BR-CH-026 | 已钉住 registry 锚定 identity、目录语义不可退化和维护不创造新结论,可进入 Step 11。 |
| C-CH-3 接入描述 | BR-CH-004;BR-CH-005;BR-CH-013;BR-CH-022;BR-CH-031;BR-CH-035 | 已钉住 descriptor、risk summary 与 secret / provider runtime / governance truth 的边界,可进入 Step 11。 |
| C-CH-4 治理 / 方法关系接缝 | BR-CH-006;BR-CH-007;BR-CH-014;BR-CH-015;BR-CH-019;BR-CH-023;BR-CH-024;BR-CH-028;BR-CH-029;BR-CH-034;BR-CH-035 | 已钉住 governance seam 不生成 approval truth、审查与治理职责分离和 method body-free relation,可进入 Step 11。 |
| C-CH-5 受控消费表达 | BR-CH-003;BR-CH-008;BR-CH-009;BR-CH-012;BR-CH-016;BR-CH-017;BR-CH-018;BR-CH-025;BR-CH-026;BR-CH-030;BR-CH-032;BR-CH-033;BR-CH-036;BR-CH-037 | 已钉住 formal exposure 来源、SDK / marketplace / observability / execution 边界与变化协作追溯要求,可进入 Step 11。 |

### 7.7 跨能力规则审计

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否存在无法回指功能需求的规则 | 无 | 每条核心规则都能映射到 FR-CH-001~016 或明确边界目标。 |
| 是否存在规则重复 | 已控制 | 相近规则分别承担不变量、禁止行为、显式变化、边界约束、治理约束或审计约束。 |
| 是否存在规则冲突 | 无 | “正式可见 / 可用需要 governance seam”与“本仓不拥有 governance truth”是互补关系。 |
| 是否遗漏核心边界 | 未发现 | runtime / tools、governance、method-library、SDK、provider secret / runtime / cost、marketplace、observability 均已覆盖。 |
| 是否把实现机制写成规则 | 未发现 | 未写 API、event payload、DTO、DB 约束、事务、handler、repository、30s 或 P95。 |
| 外围增强是否压过核心规则 | 否 | 外围增强只保留 `BR-CH-E001` 一条总规则,不干扰核心闭环。 |

### 7.8 旧规则重裁映射

| 旧规则 / 旧主线 | 当前处理 | 对应当前规则 / 后续落点 | 裁剪说明 |
|---|---|---|---|
| BR-001 `MCP allowlist 拒绝调用` | 重裁为边界与正式可见性语义 | BR-CH-003;BR-CH-012;BR-CH-027;BR-CH-034 | 不再把执行拦截写成本仓规则结果。 |
| BR-002 `A2A 匿名注册拒绝` | 重裁为身份与审查边界 | BR-CH-001;BR-CH-005;BR-CH-019;BR-CH-020;后续 Step 12 | 不直接写认证动作或接口拒绝。 |
| BR-003 `Provider key 未加密拒绝持久化` | 重裁为禁止保存 secret 正文 | BR-CH-004;BR-CH-013;BR-CH-031;后续 Step 11 | KMS / Vault 与加密机制后移。 |
| BR-004 `Policy 更新 30s 刷新白名单` | 重裁为治理 seam 与变化显式化 | BR-CH-023;BR-CH-026;BR-CH-034;BR-CH-035;后续 Step 13 / 14 | 时延约束后移 NFR / 验收。 |
| BR-005 `调用成功/失败发成本审计事件` | 重裁为 capability access truth 审计约束 | BR-CH-036;BR-CH-037;后续 Step 12 / Step 13 / Step 14 | 调用日志、成本与物理事件流不进入本仓规则表。 |
| BR-006 `shared_rules 禁止某能力,项目级 allow 不得放开` | 重裁为 governance truth 不归本仓 | BR-CH-014;BR-CH-028;BR-CH-034 | 保留“不得本地放开”的 seam 约束,不接管 Policy truth。 |

---

## 8. 回填草稿

> 注意: 以下只是在 Step 17 装配正式文档时可使用的 §10 候选文本。当前不得直接写入正式 `00-需求文档.md`。

### 8.1 业务规则与边界约束

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| BR-CH-001 | 不变量 | capability identity 必须作为稳定的正式接入主体存在,不能退化为 URL、provider 名、tool config、runtime config 或 marketplace listing。 | capability identity |
| BR-CH-002 | 不变量 | registry 中的正式接入事实必须锚定稳定 capability identity,不得先有目录条目再倒推身份。 | capability registry |
| BR-CH-003 | 不变量 | 注册目录必须显式区分草稿、未描述、未治理和正式可见等接入语境,不得退化为单一 allowlist 或 availability bit。 | registry visibility / lifecycle |
| BR-CH-004 | 不变量 | adapter descriptor 必须表达接入方式、能力类型和边界约束,不得变成 provider runtime、quota / route / cost contract 或 secret 正文容器。 | adapter descriptor |
| BR-CH-005 | 不变量 | 接入风险与约束摘要只能表达 descriptor 相关的风险和约束,不得替代 governance policy、approval truth 或执行拦截结论。 | descriptor risk / constraint summary |
| BR-CH-006 | 不变量 | governance seam 只能承接正式治理结果引用或允许的结果摘要,不得在本仓生成 approval / Policy truth。 | governance seam |
| BR-CH-007 | 不变量 | capability-method relation 必须是 body-free relation,不得把 method body、definition source truth 或正文版本迁入本仓。 | capability-method relation |
| BR-CH-008 | 不变量 | 正式消费表达必须来源于 identity、registry、descriptor、governance seam 和 method relation 的正式接入事实,不得由消费方、导出结果或派生视图反向定义。 | formal exposure boundary |
| BR-CH-009 | 不变量 | 派生索引、搜索结果、导出、变化协作和对账结果只能消费正式接入事实,不得成为新的业务真相写源。 | derived views / maintenance outputs |
| BR-CH-010 | 禁止行为 | 查询、浏览、导出、消费或变化协作不得隐式创建、合并、拆分或更正 capability identity。 | identity-related read / consume actions |
| BR-CH-011 | 禁止行为 | 维护任务、索引重建、目录对账或派生刷新不得创造新的正式接入结论。 | registry maintenance |
| BR-CH-012 | 禁止行为 | 不得把 runtime / tools execution、allow / deny 拦截、外部调用结果或 provider invocation result 写成本仓真相。 | execution boundary |
| BR-CH-013 | 禁止行为 | 不得把 API key、secret 正文、KMS / Vault、quota、route、cost、failover、retry 或 provider runtime 写成本仓真相。 | provider secret / runtime / cost |
| BR-CH-014 | 禁止行为 | 不得把 governance approval、Policy effective fact、shared_rules 生效 truth 或白名单刷新语义写成本仓真相。 | governance truth boundary |
| BR-CH-015 | 禁止行为 | 不得把 Method Content、TaskDefinition、AIPolicyDef、ProcessTemplateDef 或其它方法正文复制到 capability-hub。 | method body boundary |
| BR-CH-016 | 禁止行为 | 不得把 SDK client、多语言 package、客户端便利封装或调用 SDK 的包装结果写成本仓正式能力边界。 | SDK client boundary |
| BR-CH-017 | 禁止行为 | 不得把 marketplace listing、交易、定价、履约或镜像注册写成 registry truth。 | marketplace boundary |
| BR-CH-018 | 禁止行为 | 不得用 observability log、trace、cost ledger 或 audit store 替代 capability 接入事实追溯。 | observability / finance boundary |
| BR-CH-019 | 禁止行为 | 接入审查意见不得替代 governance approval,也不得被误写成 Policy truth。 | access review / governance responsibility |
| BR-CH-020 | 显式变化 | capability identity 的建立、合并、拆分、退役或正式更正必须显式发生。 | capability identity lifecycle |
| BR-CH-021 | 显式变化 | registry 条目的纳入、退出、可见性变化和生命周期语义变化必须显式发生。 | registry lifecycle |
| BR-CH-022 | 显式变化 | adapter descriptor 的建立、替换和约束摘要变化必须显式发生。 | descriptor evolution |
| BR-CH-023 | 显式变化 | 接入审查意见、风险解释和 governance seam 的挂接、替换、失效必须显式发生。 | access review / governance seam |
| BR-CH-024 | 显式变化 | capability-method relation 的建立、变更和移除必须显式发生。 | capability-method relation lifecycle |
| BR-CH-025 | 显式变化 | 正式消费表达、正式可见性和服务端 exposure boundary 的变化必须显式发生。 | formal exposure / visibility |
| BR-CH-026 | 显式变化 | 变化协作、导出、对账和维护结果必须显式说明来源、范围和结果。 | maintenance / collaboration outputs |
| BR-CH-027 | 边界约束 | capability-hub 不拥有 runtime / tools execution、allow / deny enforcement、外部调用结果或运行状态 truth。 | capability-hub / runtime-tools 边界 |
| BR-CH-028 | 边界约束 | capability-hub 不拥有 governance approval、Policy truth、shared_rules truth 或治理缓存。 | capability-hub / governance 边界 |
| BR-CH-029 | 边界约束 | capability-hub 不拥有 method body、definition source truth 或方法正文版本。 | capability-hub / method-library 边界 |
| BR-CH-030 | 边界约束 | capability-hub 不拥有 SDK client、language package 或客户端 convenience truth。 | capability-hub / SDK 边界 |
| BR-CH-031 | 边界约束 | capability-hub 不拥有 secret 平台、KMS / Vault、provider runtime、quota / route / cost / billing truth。 | capability-hub / provider-secret-cost 边界 |
| BR-CH-032 | 边界约束 | capability-hub 不拥有 listing、交易、定价、履约或生态运营真相。 | capability-hub / marketplace 边界 |
| BR-CH-033 | 边界约束 | capability-hub 事实可以被审计,但 capability-hub 不拥有 audit log store、trace、metrics、cost ledger 或 alert stream truth。 | capability-hub / observability 边界 |
| BR-CH-034 | 治理约束 | 正式可见 / 可用语境依赖治理结论时,必须挂接正式 governance 结果引用或允许的结果摘要,不得只凭本地目录状态决定。 | formal visibility / use governance precondition |
| BR-CH-035 | 治理约束 | 高风险 descriptor、正式 exposure boundary 变化或需要限制能力使用范围的变化,必须保留接入审查与 governance seam 的职责分离,不得绕过 `L1-governance`。 | high-risk access changes |
| BR-CH-036 | 审计约束 | identity、registry、descriptor、governance seam、method relation、正式消费表达的关键变化必须形成可追溯记录。 | capability access audit |
| BR-CH-037 | 审计约束 | 导出、搜索、对账、维护和变化协作输出必须能说明来源、范围和结果,不得静默改变正式结论。 | derived / exported outputs audit |

外围增强能力可在正式文档中保留 `BR-CH-E001` 作为总边界规则,但不得让外围增强改变核心闭环的规则骨架。

---

## 9. 待确认事项

| ID | 待确认事项 | 当前状态 | 是否阻塞 Step 10 | 后续处理 |
|---|---|---|---|---|
| OQ-CH-010-001 | `BR-CH-034` 中 governance 结果的最小可用摘要是否允许只保留 scope summary,还是必须至少有 formal result ref。 | pending | 否 | Step 11 / Step 12 处理。 |
| OQ-CH-010-002 | `BR-CH-023` 的接入审查意见是否需要独立保留正式结论,还是只保留变更痕迹与 seam 输入。 | pending | 否 | Step 11 / Step 12 处理。 |
| OQ-CH-010-003 | `BR-CH-013` / `BR-CH-031` 下 secret reference 在数据层是只读 ref、masked summary 还是 richer constraint snapshot。 | pending | 否 | Step 11 处理。 |
| OQ-CH-010-004 | `BR-CH-024` 的 body-free relation 是否需要固定 relation type 集合,还是允许后续扩展。 | pending | 否 | Step 11 / Step 12 处理。 |
| OQ-CH-010-005 | `BR-CH-025` 的服务端 exposure boundary 在接口层是查询面、订阅面、事件面还是三者组合。 | pending | 否 | Step 12 处理。 |
| OQ-CH-010-006 | `BR-CH-E001` 下只读生态发现是否保留到正式规则表,还是在 Step 17 降为附注。 | pending | 否 | Step 15 / Step 17 处理。 |
| OQ-CH-010-007 | `projects/L0-sdk` Step 10 参考文件命名为 `00_req_step_10_rules_boundary_constraints.md`,是否需要在后续台账统一修正跨项目引用命名。 | pending | 否 | 本项目 ledger 本轮修正;其余项目不在本步处理。 |

---

## 10. Blocker 判定

| Blocker 候选 | 判定 | 理由 | 当前处理 |
|---|---|---|---|
| 旧 BR-001~BR-006 与当前边界冲突 | historical_conflict_not_blocker | 旧规则不能继承,但 Step 2 / Step 7 / Step 9 已提供足够稳定锚点重建规则。 | 已重裁为当前规则或后置处理。 |
| governance seam 最小引用语义未闭合 | not_blocker_for_step_10 | Step 10 只需确认“必须存在正式治理结果引用或允许摘要”的硬规则;字段层后续闭合。 | Step 11 / Step 12 处理。 |
| secret reference 具体数据模型未闭合 | not_blocker_for_step_10 | Step 10 只需确认禁止保存正文与 secret 平台边界;数据归属后续处理。 | Step 11 处理。 |
| SDK exposure 具体 surface 未闭合 | not_blocker_for_step_10 | Step 10 只需确认服务端 exposure boundary 与 client convenience truth 分离;接口后续处理。 | Step 12 处理。 |
| `L0-sdk` Step 10 参考文件命名与预期不一致 | not_blocker_for_step_10 | 仅是跨项目命名差异,内容可正常读取。 | 本项目台账在本轮修正引用路径。 |

结论: 未发现阻塞 `00-需求文档.md` Step 10 的上游 blocker。

---

## 11. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 每条规则都有编号、类型、内容和约束对象 | pass | 使用 `BR-CH-001` ~ `BR-CH-037` 与 `BR-CH-E001`。 |
| 已区分不变量、禁止行为、显式变化、边界约束、治理约束和审计约束 | pass | §7.2 完整覆盖。 |
| 规则能够回指 Step 9 功能需求或边界目标 | pass | §7.5 覆盖 `FR-CH-001~016` 和外围增强总规则。 |
| 未把状态机、接口、字段、事件 schema 或实现校验写成规则 | pass | 未使用 endpoint、payload、DTO、repository、30s、P95 或错误码。 |
| 已保护 capability identity、registry、descriptor、governance seam、method relation、SDK exposure boundary | pass | 核心边界均有规则承接。 |
| execution、secret、cost、marketplace、governance truth、method body、SDK client 未回流为本仓规则主线 | pass | 仅作为边界红线或 historical material。 |
| 已给出旧规则重裁映射 | pass | §7.8 覆盖旧 BR-001~BR-006。 |
| 是否可进入 Step 11 | blocked_until_user_confirm | 必须等待用户确认后才能继续。 |
