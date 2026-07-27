# Step 8. 用户故事

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 8
> 回填章节: `00-需求文档.md` §8 用户故事
> 生成日期: 2026-07-06
> 当前状态: `completed_stop_review`
> 粒度参考: `projects/L1-governance/design-calibration/00_req_step_08_user_stories.md`
> 当前约束: 本步只把 Step 5 的角色目标映射到 Step 7 的核心能力节点;不得写功能需求、接口名、事件名、DTO、数据字段、业务规则、验收条件、NFR、实现组件或实施阶段。

---

## 0. 当前 Step 状态

| 项 | 记录 |
|---|---|
| 文档 | `projects/L3-capability-hub/00-需求文档.md` |
| Step | Step 8 用户故事 |
| 当前入口 | `Step 8 已完成,等待是否进入 Step 9` |
| gate_status | pass |
| next_allowed_action | `wait_user_review_to_step_09` |
| 正式文档写入 | blocked: 当前只写 Step 8 中间产物,不修改正式 `00-需求文档.md` |
| 当前策略 | 从头开始;每完成一个 Step 停审;不自动跨 Step |

### 0.1 Step 内计划

| 序号 | 动作 | 状态 | 结果 |
|---|---|---|---|
| 1 | 回读项目台账、需求 flow、Step 1~7 | done | 确认用户已同意进入 Step 8,且不得自动进入 Step 9 或正式文档装配。 |
| 2 | 读取需求 SOP Step 8 和书写规范 4.8 | done | 确认本章必须输出按能力节点组织的用户故事、外围增强故事、边界外故事裁剪、故事映射和能力级停审结论。 |
| 3 | 读取 `L1-governance`、`L3-method-library`、`L0-sdk` 的 Step 8 参考粒度 | done | 对齐 Step 结构、讨论深度和停审方式,不复制其它领域故事。 |
| 4 | 读取 README、旧 `00` 和 restart 前 Step 8 文件 | done | 识别旧故事污染:runtime、Provider Contract、allow / deny 执行、成本记账、Policy 30s 刷新、Given / When / Then 和过早标记 completed。 |
| 5 | 按 C-CH-1~C-CH-5 逐节点回答 SOP 问题 | done | 确认每个核心能力节点有哪些角色目标支撑,哪些故事只是外围增强或边界外候选。 |
| 6 | 诊断旧故事与当前边界冲突 | done | 将旧 `US-001~US-005`、README 线索和 restart 前 Step 8 状态全部降级为 historical material 或重裁输入。 |
| 7 | 做设计取舍 | done | 采用“核心能力节点 + 角色目标”的故事组织方式,不采用旧用例 / 接口 / 验收卡片。 |
| 8 | 形成结构化中间产物和回填草稿 | done | 为正式 §8 提供可回填候选,但不写入正式文档。 |
| 9 | 做跨能力故事审计和 OQ 承接 | done | 将 governance seam、method relation、SDK exposure、allow / deny 归属等 OQ 带到后续 Step。 |
| 10 | 做 blocker 判定并停审 | done | 未发现阻塞 Step 8 的上游 blocker;等待用户确认是否进入 Step 9。 |

---

## 1. 本步目标

围绕 Step 7 已收敛的核心能力闭环,把 Step 5 的角色目标转成需求层用户故事。当前故事必须先服务 capability identity、capability registry、adapter descriptor、governance seam、method relation 和 SDK exposure boundary 的成立,而不是回到旧 README 和旧 `00` 的功能 / 接口 / 验收卡片。

本步不写:

- 功能需求
- 业务规则
- 数据归属
- 接口清单
- 非功能指标
- 验收条件
- 事件 schema
- DTO / 字段
- 实现阶段和模块划分

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_05_users_roles.md` | 已完成 | 固定故事主语只能来自能力接入管理员、能力接入提议者 / 技术负责人、安全 / 接入审查者、审计 / 合规查看者、能力目录浏览者、系统消费方和能力接入维护任务。 |
| `design-calibration/00_req_step_06_consumers_dependencies.md` | 已完成 | 固定系统消费边界、治理接缝、外部 MCP / A2A / API 接入对象和 body-free method relation 边界。 |
| `design-calibration/00_req_step_07_core_capability_loop.md` | 已完成 | 固定 C-CH-1~C-CH-5 五个核心能力节点。 |
| `design-calibration/00_req_step_02_position_boundary.md` | 已完成 | 防止故事越界到 runtime execution、tool execution、governance truth、SDK client、secret / KMS、cost / billing、marketplace 和 LLM routing。 |
| `design-calibration/00_req_step_04_goals_non_goals.md` | 已完成 | 固定本步必须收束 capability identity、registry、adapter descriptor、governance seam、method relation 和 SDK exposure boundary。 |
| `standards/document/需求文档讨论流程_SOP.md` Step 8 | 已读 | 约束本步先围绕核心能力节点收故事,再补外围增强和边界外候选。 |
| `standards/document/需求文档书写规范.md` §4.8 | 已读 | 约束故事表必须使用“用户故事 / 目标类型 / 业务价值 / 与核心能力闭环的关系”。 |
| `standards/document/设计文档讨论中间产物规范.md` | 已读 | 约束本文件必须保留问题回答、诊断、取舍、结构化产物、回填草稿和停审状态。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已读 | 约束本步不提前定义 public DTO、接口动作、字段来源或实现补丁。 |
| `projects/L1-governance/design-calibration/00_req_step_08_user_stories.md` | 已读 | 参考“核心故事 + 外围增强 + 边界外裁剪 + 映射 + 停审”的组织方式。 |
| `projects/L3-method-library/design-calibration/00_req_step_08_user_stories.md` | 已读 | 参考“按能力节点先思考,再汇总故事表”的粒度。 |
| `projects/L0-sdk/design-calibration/00_req_step_08_user_stories.md` | 已读 | 参考“系统消费方抽象化”和“边界外故事排除”的写法。 |
| `projects/L3-capability-hub/README.md` | 已读 | 只作为 MCP / A2A / API 接入中心和治理联动的历史线索。 |
| 旧 `projects/L3-capability-hub/00-需求文档.md` §5 | 已读 | 只抽取外部能力被登记、描述和消费的目标线索,不继承 runtime、Provider Contract、cost 和 30s 刷新故事。 |
| restart 前 `design-calibration/00_req_step_08_user_stories.md` | `pre_restart_historical_material` | 只作为冲突线索;其旧状态、旧引用和旧 OQ 不再作为当前 active baseline。 |

---

## 3. SOP 问题回答

### 3.1 哪些角色目标在支撑本仓的核心能力闭环?

| 核心能力节点 | 支撑它的角色目标 |
|---|---|
| C-CH-1 外部能力能够以稳定身份进入接入语境 | 能力接入提议者 / 技术负责人需要把外部 MCP / A2A / API 能力放入明确接入语境;能力接入管理员需要确认稳定 identity 边界;安全 / 接入审查者需要在正式接入前理解被接入的外部连接主体。 |
| C-CH-2 外部能力能够进入受控注册目录并形成生命周期语义 | 能力接入管理员需要把已识别能力纳入正式目录;能力目录浏览者需要理解哪些能力已经进入正式接入语境;能力接入维护任务需要对账、重建和一致性检查目录事实。 |
| C-CH-3 已注册能力能够拥有可解释的接入描述 | 能力接入提议者 / 技术负责人需要说明接入方式、能力类型和约束摘要;安全 / 接入审查者需要理解外部连接风险和敏感边界;系统消费方需要共享同一 descriptor 语义而不私补 provider runtime、secret 或 quota。 |
| C-CH-4 接入事实能够承接治理结果并保持方法资产关系边界 | 能力接入管理员需要引用正式治理结果或使用约束摘要;安全 / 接入审查者需要区分接入审查意见和 governance approval;能力接入提议者 / 技术负责人需要表达 capability 与 method asset 的 body-free relation;审计 / 合规查看者需要追溯这些关系链路。 |
| C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 | 系统消费方需要按受控边界消费正式接入事实并分清服务端边界与客户端封装;能力目录浏览者需要理解正式可见性和适用边界;能力接入维护任务需要让变化被下游持续感知;审计 / 合规查看者需要追溯正式接入事实为何处于当前语境。 |

### 3.2 哪些角色目标只是外围增强,而不决定闭环是否成立?

| 外围增强目标 | 角色 | 原因 |
|---|---|---|
| 更丰富的管理 UI、批量导入和批量整理 | 能力接入管理员 | 改善管理效率,但不是 capability identity / registry / descriptor 成立的最小条件。 |
| 搜索、过滤、分类和只读浏览体验 | 能力目录浏览者 | 改善发现效率,但不替代正式目录 truth。 |
| 自动发现外部能力候选和半自动导入 | 能力接入提议者 / 技术负责人 | 有助于降低接入成本,但候选发现不能直接形成正式接入事实。 |
| 更丰富的安全摘要、secret reference 提示和审查辅助材料 | 安全 / 接入审查者 | 提升审查效率,但 secret 平台和密钥生命周期仍不归本仓。 |
| 更友好的 SDK / 客户端消费说明和示例语义 | 系统消费方 | 提升 developer experience,但 SDK client 和语言包不归本仓。 |
| 只读生态发现和外部审计材料导出 | 能力目录浏览者、审计 / 合规查看者 | 属于消费 / 协作增强,不决定核心闭环是否成立。 |

### 3.3 哪些看起来像故事,但其实不应进入本仓?

| 看似故事 | 不进入原因 | 正确归属 |
|---|---|---|
| 作为 runtime,我希望直接调用外部 MCP / A2A / API 能力,以便执行任务 | runtime execution / tool execution 不是本仓 truth | `L2-runtime` / `L2-tools` |
| 作为工具执行器,我希望未白名单 MCP 调用立即被拒绝 | allow / deny 执行属于规则、验收和执行边界 | Step 10 / Step 14 审计执行边界 |
| 作为 Owner,我希望保存 Provider API key 并配置 quota / route / cost | secret / KMS、quota、routing、cost 和 provider runtime 都已排除 | 安全基础设施 / future / 非目标 |
| 作为 Governance,我希望本仓执行 approval 并生成 Policy truth | governance approval execution / Policy truth 不归本仓 | `L1-governance` |
| 作为方法资产作者,我希望在本仓编辑方法资产正文 | method asset definition body 不归本仓 | `L3-method-library` |
| 作为 SDK 维护者,我希望本仓生成 Rust / Python / TypeScript client package | SDK client 和语言包不归本仓 | `L0-sdk` |
| 作为 Auditor,我希望看到每次外部调用成本记账 | cost / billing / finance ledger 已排除 | `L4-observability` / finance / future |
| 作为 marketplace 运营者,我希望上架、定价、销售和履约能力商品 | listing / transaction / fulfillment 不归本仓 | `L6-marketplace` |
| 作为平台路由器,我希望按成本和延迟自动选择 provider | LLM routing / provider orchestration 不归本仓 | runtime / future |

### 3.4 每条故事分别支撑闭环中的哪个能力节点?

当前所有核心故事都优先映射到 C-CH-1~C-CH-5;只有少数故事同时支撑两个节点,例如 descriptor 对系统消费的解释能力会同时服务 C-CH-3 与 C-CH-5,审计追溯故事会同时服务 C-CH-4 与 C-CH-5。这里不新增第六个节点,也不把闭环顺序重写成故事顺序。

### 3.5 当前能力节点下的故事是否足以进入功能需求讨论?

是。五个节点都已经由明确角色目标支撑:

- C-CH-1 有提议、管理和审查三类目标。
- C-CH-2 有管理、浏览和维护三类目标。
- C-CH-3 有提议、审查和消费三类目标。
- C-CH-4 有管理、审查、提议和审计四类目标。
- C-CH-5 有消费、浏览、维护和审计四类目标。

因此 Step 9 可以直接按这五个节点归并功能需求,而不需要再从旧故事卡片或旧接口名反推。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 当前处理 |
|---|---|---|---|
| 旧 `00-需求文档.md` §5.1 | 把“注册 / 启停 MCP 白名单”“注册 A2A Node”“配置 Provider Contract”“runtime 查询可用能力”“外部调用成本记账”列为核心用例 | 用例、功能、执行、规则和边界外主题混写,不是按闭环组织的故事 | 只保留“外部能力需要被正式接入、描述和消费”的线索,其余全部后移或排除 |
| 旧 `00-需求文档.md` `US-001` | runtime 查询当前可用 MCP 白名单 | runtime 不是本章角色;“查询”“白名单”属于接口 / 规则 / 执行语境 | 改写为系统消费方按边界消费正式接入事实 |
| 旧 `00-需求文档.md` `US-002` | Owner 注册 Anthropic / OpenAI Provider Contract,API key 加密存储且 active | Provider Contract 固化旧对象;key / quota / route / cost 越界 | 改写为 adapter descriptor 目标故事,secret 和 cost 裁剪 |
| 旧 `00-需求文档.md` `US-003` | Security 阻止未白名单 MCP 被调用 | 是 runtime enforcement、规则和验收候选,不是目标级故事 | 保留安全 / 接入审查目标,allow / deny 归属后移 Step 10 / Step 12 / Step 14 |
| 旧 `00-需求文档.md` `US-004` / `US-005` | Auditor 看每次成本记账;platform 在 Policy 更新后 30s 内刷新白名单 | 成本已被排除;30s 是 NFR / 验收;platform 不是角色 | 改写为治理结果接缝和变化感知故事,成本与时延不进故事表 |
| restart 前 `design-calibration/00_req_step_08_user_stories.md` | 已标为 completed,但 flow / ledger 仍停在 Step 7;引用中混入 `L1-artifact`,且 OQ 编号未接回当前 restart 基线 | 旧文件不能作为当前 active baseline | 原位重写;只保留其可用故事方向作为历史线索 |
| `projects/L3-capability-hub/README.md` | 把白名单、Provider Contract、成本记账、Policy 下发和 LLM routing 并列为核心职责 | README 把接入 truth、执行、secret、cost 和 future 混成同一故事池 | 只保留“外部能力接入中心”线索,其余不进入正式故事表 |

---

## 5. 设计取舍

### 5.1 故事组织方式取舍

| 方案 | 组织方式 | 优点 | 缺点 | 结论 |
|---|---|---|---|---|
| 方案 A | 沿用旧 `US-001~US-005` 卡片 | 迁移快,旧文档完整 | 保留 runtime、Provider Contract、成本、30s、Given / When / Then 等旧污染 | 不采用 |
| 方案 B | 只按 Step 5 角色列普通故事清单 | 角色覆盖直观 | 容易退化成普通愿望池,无法保证故事支撑 C-CH-1~C-CH-5 | 不采用 |
| 方案 C | 按 C-CH-1~C-CH-5 能力节点组织角色目标,再汇总成正式故事表 | 能保持故事与核心闭环对齐,为 Step 9 提供稳定锚点 | 需要额外做跨能力故事审计和外围增强裁剪 | 采用 |
| 方案 D | 只写系统消费 / SDK exposure 故事 | 下游消费主线清晰 | 漏掉 identity、registry、descriptor 和 governance / method seam | 不采用 |

### 5.2 关键议题取舍

| 议题 | 当前结论 | 理由 |
|---|---|---|
| 是否把 runtime / tools / SDK 分别写成故事主体 | 当前不拆,统一保留为“系统消费方” | Step 5 已明确相邻仓不是本章角色;具体拆分后移 Step 12 |
| 是否保留 `Provider Contract` 故事 | 不保留旧名,改写为 adapter descriptor 目标故事 | 旧名天然吸入 secret、quota、cost 和 provider runtime |
| 是否把 QueryCapabilities 一类查询动作写成故事 | 不写接口动作,改写为“系统消费方按边界消费正式接入事实” | Step 8 只写目标级故事,查询形态属于 Step 12 |
| 是否把安全拦截写成故事 | 不写拦截执行,只写接入审查与风险解释目标 | allow / deny 执行属于规则、验收和运行边界 |
| 是否把治理 approval 写成故事 | 不写 approval 执行,只写 governance seam 目标 | governance truth 归 `L1-governance` |
| 是否把 method relation 写成正文编辑故事 | 不写正文编辑,只写 body-free relation 目标 | method asset body 归 `L3-method-library` |
| 是否把 secret reference 提示写成核心故事 | 不写成核心,只保留为外围增强 | secret 平台不归本仓,约束深化留到 Step 10 / 11 / 13 |
| 是否保留成本审计故事 | 不进入正式故事表 | cost / billing 已在 Step 4 / Step 6 排除 |
| `OQ-CH-017` SDK exposure 最小服务端边界是否已进入核心 | 是,但只在故事层部分收敛 | 通过系统消费方故事确认它属于 C-CH-5;接口形态仍后移 Step 12 |

---

## 6. 按能力节点组织的用户故事结论

### 6.1 C-CH-1 外部能力能够以稳定身份进入接入语境

| 项 | 结论 |
|---|---|
| 本节点主角色 | 能力接入提议者 / 技术负责人、能力接入管理员、安全 / 接入审查者 |
| 进入正式故事表的目标 | 把外部 MCP / A2A / API 能力放入明确接入语境;确认 stable identity 边界;在正式接入前理解被接入的外部连接主体。 |
| 不进入本节点的内容 | A2A 实际握手协议、匿名注册校验算法、provider key 管理、runtime allowlist 执行、外部 URL 探活和签名验证细节。 |
| 节点停审结论 | 当前已形成身份前置故事,能支撑 Step 9 继续收敛 identity / naming / registration 相关功能需求。 |

### 6.2 C-CH-2 外部能力能够进入受控注册目录并形成生命周期语义

| 项 | 结论 |
|---|---|
| 本节点主角色 | 能力接入管理员、能力目录浏览者、能力接入维护任务 |
| 进入正式故事表的目标 | 把已识别能力纳入正式目录;让浏览者理解哪些能力已进入正式接入语境;让后台维护可以对账、重建和做一致性检查。 |
| 不进入本节点的内容 | 数据库表、启停 API、状态机字段、投影缓存、marketplace listing、控制台页面或目录卡片布局。 |
| 节点停审结论 | 当前故事已经覆盖目录建立、目录理解和目录维护,且没有把执行配置或交易目录混入本节点。 |

### 6.3 C-CH-3 已注册能力能够拥有可解释的接入描述

| 项 | 结论 |
|---|---|
| 本节点主角色 | 能力接入提议者 / 技术负责人、安全 / 接入审查者、系统消费方 |
| 进入正式故事表的目标 | 说明接入方式、能力类型和约束摘要;让安全审查围绕可解释事实展开;让消费方共享同一 descriptor 语义。 |
| 不进入本节点的内容 | API key 托管、quota、cost、provider runtime、failover、retry、client SDK、secret platform 或 provider 原始产品模型。 |
| 节点停审结论 | 当前故事已把旧 `Provider Contract` 重裁为 descriptor 目标,足以进入 Step 9 / Step 11 / Step 12 的后续讨论。 |

### 6.4 C-CH-4 接入事实能够承接治理结果并保持方法资产关系边界

| 项 | 结论 |
|---|---|
| 本节点主角色 | 能力接入管理员、安全 / 接入审查者、能力接入提议者 / 技术负责人、审计 / 合规查看者 |
| 进入正式故事表的目标 | 引用正式治理结果或使用约束摘要;区分接入审查与 governance approval;表达 capability 与 method asset 的 body-free relation;追溯治理引用与方法关系链路。 |
| 不进入本节点的内容 | approval execution、Policy truth、AIIA / SoA 正文、Method Content / TaskDefinition / AIPolicyDef 正文和治理 cache。 |
| 节点停审结论 | 当前故事已守住 governance seam、method relation 和审计追溯三条线,不会把本仓写成治理仓或方法正文仓。 |

### 6.5 C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化

| 项 | 结论 |
|---|---|
| 本节点主角色 | 系统消费方、能力目录浏览者、能力接入维护任务、审计 / 合规查看者 |
| 进入正式故事表的目标 | 按受控边界消费正式接入事实;区分服务端正式能力边界与客户端封装便利层;理解正式可见性和适用边界;让变化可被下游持续感知并可追溯。 |
| 不进入本节点的内容 | QueryCapabilities API 名、事件 payload、SDK package、runtime loop、tool invocation、cache / projection / subscription 实现。 |
| 节点停审结论 | 当前故事已部分收敛 `OQ-CH-017`,确认 SDK exposure 属于核心能力,但接口形态和消费 surface 留待 Step 12 闭合。 |

---

## 7. 结构化中间产物

### 7.1 核心闭环故事表

| 编号 | 用户故事 | 目标类型 | 业务价值 | 与核心能力闭环的关系 |
|---|---|---|---|---|
| US-CH-001 | 作为能力接入提议者 / 技术负责人,我希望把一个外部 MCP / A2A / API 能力放入明确的接入语境,以便平台可以讨论同一个能力主体而不是散落的 URL、provider 名或运行配置。 | 核心闭环 | 让外部能力先以可讨论、可引用的主体出现,避免后续 registry 和 descriptor 围绕临时配置补 truth。 | 支撑 C-CH-1 外部能力能够以稳定身份进入接入语境 |
| US-CH-002 | 作为能力接入管理员,我希望确认外部能力的稳定身份边界,以便后续注册、治理引用、方法关系和下游消费都围绕同一个 capability identity 协作。 | 核心闭环 | 为注册目录、治理接缝和消费表达提供长期锚点。 | 支撑 C-CH-1 外部能力能够以稳定身份进入接入语境 |
| US-CH-003 | 作为安全 / 接入审查者,我希望在能力身份进入正式接入语境前理解它代表的外部连接主体,以便高风险外部能力不会通过模糊名称或临时配置绕过审查。 | 核心闭环 | 将安全审查前置到身份语境,但不执行治理审批或 runtime 拦截。 | 支撑 C-CH-1 外部能力能够以稳定身份进入接入语境 |
| US-CH-004 | 作为能力接入管理员,我希望把已识别的外部能力纳入受控注册目录,以便能力接入事实从提议语境进入可管理、可查看和可维护的正式目录。 | 核心闭环 | 让外部能力不再停留在个人配置、工具清单或 runtime 私有白名单中。 | 支撑 C-CH-2 外部能力能够进入受控注册目录并形成生命周期语义 |
| US-CH-005 | 作为能力目录浏览者,我希望理解哪些外部能力已经处于正式接入目录中,以便在选择或引用能力前知道自己面对的是平台认可的接入事实。 | 核心闭环 | 让目录具有可理解的只读入口,但不把浏览体验或 marketplace listing 写成核心能力。 | 支撑 C-CH-2 外部能力能够进入受控注册目录并形成生命周期语义 |
| US-CH-006 | 作为能力接入维护任务,我希望识别注册目录中需要对账、重建或一致性检查的能力接入事实,以便目录维护不创造新的业务结论但能保护目录可用。 | 核心闭环 | 让 registry 维护有目标来源,同时避免后台任务变成业务 truth owner。 | 支撑 C-CH-2 外部能力能够进入受控注册目录并形成生命周期语义 |
| US-CH-007 | 作为能力接入提议者 / 技术负责人,我希望说明外部能力的接入方式、能力类型和约束摘要,以便审查者和消费方可以理解该能力怎样被接入而不是只看到 provider 名称。 | 核心闭环 | 将旧 `Provider Contract` 重裁为目标级 adapter descriptor 语境。 | 支撑 C-CH-3 已注册能力能够拥有可解释的接入描述 |
| US-CH-008 | 作为安全 / 接入审查者,我希望基于接入描述理解外部连接风险、敏感边界和约束摘要,以便接入审查可以围绕可解释事实展开。 | 核心闭环 | 支撑接入安全解释,但不托管 secret、不执行 provider 调用、不定义 KMS / Vault。 | 支撑 C-CH-3 已注册能力能够拥有可解释的接入描述 |
| US-CH-009 | 作为系统消费方,我希望获得足够解释外部能力接入边界的描述,以便运行、工具或客户端封装语境不会自行补造 provider runtime、secret 或 quota 语义。 | 核心闭环 | 让下游消费同一接入描述,避免 access 与 execution 混写。 | 支撑 C-CH-3 已注册能力能够拥有可解释的接入描述;C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 |
| US-CH-010 | 作为能力接入管理员,我希望能力接入事实能够引用正式治理结果或使用约束摘要,以便正式可见 / 可用语境不由目录状态或本地白名单自行决定。 | 核心闭环 | 保护 governance seam,防止 capability whitelist 反向成为 Policy truth。 | 支撑 C-CH-4 接入事实能够承接治理结果并保持方法资产关系边界 |
| US-CH-011 | 作为安全 / 接入审查者,我希望区分接入审查意见、本仓接入事实和治理批准结论,以便安全判断可以被追溯但不会替代 governance approval。 | 核心闭环 | 明确本仓承接治理结果而不执行审批。 | 支撑 C-CH-4 接入事实能够承接治理结果并保持方法资产关系边界 |
| US-CH-012 | 作为能力接入提议者 / 技术负责人,我希望说明外部能力与方法资产之间的适用关系,以便方法资产可以引用能力边界而不把方法正文保存到能力仓。 | 核心闭环 | 建立 body-free method relation 的角色目标来源。 | 支撑 C-CH-4 接入事实能够承接治理结果并保持方法资产关系边界 |
| US-CH-013 | 作为审计 / 合规查看者,我希望追溯能力身份、注册目录、接入描述、治理引用和方法资产关系之间的链路,以便解释外部能力为何处于当前接入语境。 | 核心闭环 | 让接入事实可解释、可追溯,但不接管 observability 物理日志。 | 支撑 C-CH-4 接入事实能够承接治理结果并保持方法资产关系边界;C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 |
| US-CH-014 | 作为系统消费方,我希望按受控边界消费正式能力接入事实,以便 runtime、tools 或 SDK 语境围绕同一 truth 协作而不是各自保存外部能力配置。 | 核心闭环 | 支撑 execution-side consumption 和 SDK exposure 的服务端边界,但不实现 SDK client 或 runtime loop。 | 支撑 C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 |
| US-CH-015 | 作为能力目录浏览者,我希望看到正式能力接入事实的可见性和适用边界,以便只读理解能力目录时不会把未治理、未描述或仅草稿能力当成正式能力。 | 核心闭环 | 让只读消费和目录理解服务正式接入语境,不扩张为 marketplace listing。 | 支撑 C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 |
| US-CH-016 | 作为能力接入维护任务,我希望让能力身份、目录、描述和治理 / 方法关系变化可以被下游持续感知,以便接入事实变化不会停留在仓内静态记录中。 | 核心闭环 | 支撑变化协作和派生维护,但不定义事件 payload、projection 或缓存实现。 | 支撑 C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 |
| US-CH-017 | 作为系统消费方,我希望区分服务端正式能力边界与客户端封装便利层,以便 SDK、runtime 或 tools 不会把自身包装逻辑反写成本仓 truth。 | 核心闭环 | 让 `SDK exposure boundary` 以服务端语义成立,避免客户端层反向定义 capability-hub。 | 支撑 C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 |

### 7.2 外围增强故事表

| 编号 | 用户故事 | 目标类型 | 业务价值 | 与核心能力闭环的关系 |
|---|---|---|---|---|
| US-CH-E01 | 作为能力接入管理员,我希望通过更丰富的管理入口批量整理外部能力,以便降低大规模能力接入维护成本。 | 外围增强 | 提升管理效率,但不决定 identity / registry / descriptor 是否成立。 | 支撑外围增强:管理 UI / 批量导入 |
| US-CH-E02 | 作为能力目录浏览者,我希望通过搜索、过滤和分类更快发现合适的外部能力,以便在复杂目录中减少误选。 | 外围增强 | 提升目录可发现性,但不替代正式注册和治理接缝。 | 支撑外围增强:搜索 / 浏览体验 |
| US-CH-E03 | 作为能力接入提议者 / 技术负责人,我希望系统能辅助发现外部 MCP / A2A / API 能力候选,以便减少手工录入和描述成本。 | 外围增强 | 自动发现有助于接入效率,但候选发现不能直接形成正式接入 truth。 | 支撑外围增强:自动发现 / 候选导入 |
| US-CH-E04 | 作为安全 / 接入审查者,我希望接入描述能够包含更丰富的安全摘要和 secret reference 提示,以便安全审查更高效。 | 外围增强 | 增强审查材料,但 secret 平台和密钥生命周期不归本仓。 | 支撑外围增强:安全摘要 / secret reference 约束深化 |
| US-CH-E05 | 作为系统消费方,我希望获得更友好的能力消费语义说明,以便客户端封装和自动化消费更容易保持与服务端能力边界一致。 | 外围增强 | 提升 SDK developer experience,但 SDK client 和语言包不归本仓。 | 支撑外围增强:SDK developer experience |
| US-CH-E06 | 作为能力目录浏览者,我希望只读了解哪些能力具备生态可发现线索,以便后续产品入口可以展示能力可发现性。 | 外围增强 | 支持只读发现,但不进入 marketplace listing、交易、定价或履约。 | 支撑外围增强:只读生态发现 |
| US-CH-E07 | 作为审计 / 合规查看者,我希望导出能力接入事实摘要用于外部审计协作,以便审计材料可复用同一接入 truth。 | 外围增强 | 提升审计协作效率,但不拥有 audit log store 或外部 GRC truth。 | 支撑外围增强:审计友好输出 |

### 7.3 边界外故事候选排除表

| 候选故事 | 排除原因 | 正确落点 / 后续处理 |
|---|---|---|
| 作为 runtime,我希望调用外部 MCP / A2A / API 能力,以便执行任务。 | runtime / tools execution 是非目标;本仓不执行外部调用。 | `L2-runtime` / `L2-tools` |
| 作为工具执行器,我希望未白名单 MCP 调用立即被拒绝,以便阻止越权外连。 | 拦截执行和调用拒绝属于执行边界;规则 / 验收可后续审计,但故事主体不归本仓。 | Step 10 / Step 14 审计执行边界 |
| 作为 Owner,我希望保存 Provider API key 并配置 quota / route / cost,以便直接使用模型 provider。 | secret / KMS、quota、routing、cost 和 provider runtime 均已排除。 | secret reference 可后续 Step 10 / Step 11 / Step 13 审计;其他排除 |
| 作为 Auditor,我希望看到每次外部调用成本记账,以便核算模型 / API 成本。 | cost / billing / finance ledger 是非目标;每次调用属于 execution / observability 语境。 | `L4-observability`、finance / billing 或 future |
| 作为 Governance,我希望本仓执行 approval 并生成 Policy truth,以便能力白名单自动生效。 | governance approval execution / Policy truth 不归本仓。 | `L1-governance`;本仓只承接结果接缝 |
| 作为方法资产作者,我希望在本仓编辑方法资产正文,以便能力和方法绑定。 | method asset definition body 不归本仓。 | `L3-method-library`;本仓只保留 body-free relation |
| 作为 SDK 维护者,我希望本仓生成 Rust / Python / TypeScript client package,以便直接调用能力。 | SDK client 和语言包不归本仓。 | `L0-sdk`;本仓只提供服务端 exposure boundary |
| 作为 marketplace 运营者,我希望上架、定价、销售和履约能力商品,以便形成生态交易。 | marketplace listing / transaction / fulfillment 是非目标。 | `L6-marketplace`;本仓最多只读提供可发现线索 |
| 作为平台路由器,我希望按成本和延迟选择 LLM provider,以便自动优化调用。 | LLM routing / provider orchestration 是非目标或 future。 | runtime / provider orchestration future |

### 7.4 故事与闭环映射结论

| 核心能力节点 | 对应故事 |
|---|---|
| C-CH-1 外部能力能够以稳定身份进入接入语境 | US-CH-001;US-CH-002;US-CH-003 |
| C-CH-2 外部能力能够进入受控注册目录并形成生命周期语义 | US-CH-004;US-CH-005;US-CH-006 |
| C-CH-3 已注册能力能够拥有可解释的接入描述 | US-CH-007;US-CH-008;US-CH-009 |
| C-CH-4 接入事实能够承接治理结果并保持方法资产关系边界 | US-CH-010;US-CH-011;US-CH-012;US-CH-013 |
| C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 | US-CH-009;US-CH-013;US-CH-014;US-CH-015;US-CH-016;US-CH-017 |
| 外围增强 | US-CH-E01;US-CH-E02;US-CH-E03;US-CH-E04;US-CH-E05;US-CH-E06;US-CH-E07 |

### 7.5 跨能力故事审计

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否存在孤儿故事 | 无 | 每条核心故事都映射到 C-CH-1~C-CH-5 至少一个节点。 |
| 是否存在重复故事 | 无 | 身份、注册目录、接入描述、治理 / 方法接缝和消费表达分别服务不同角色目标。 |
| 是否存在跨能力串线故事 | 已控制 | US-CH-009、US-CH-013 同时支撑两个节点,映射列已明确双重关系,未新增能力节点。 |
| 外围增强是否压过核心故事 | 否 | 外围增强单独成表,不进入核心闭环完成条件。 |
| 边界外故事是否进入正式故事表 | 否 | runtime execution、secret / KMS、cost、marketplace、governance approval、method body、SDK client 和 LLM routing 均已排除。 |
| 是否把角色说明当成故事 | 否 | 正式故事全部采用目标级句式,不重复 Step 5 角色表。 |
| 是否把旧接口名和旧验收条件带回故事表 | 否 | 未保留 QueryCapabilities、RegisterProvider、Given / When / Then、30s、100% 或 P95。 |

### 7.6 能力级故事停审结论

| 能力节点 | 停审结果 | 说明 |
|---|---|---|
| C-CH-1 | pass | 身份前置故事已覆盖提议、管理和审查三类目标,可进入 Step 9。 |
| C-CH-2 | pass | 目录故事已覆盖正式纳入、只读理解和后台维护,可进入 Step 9。 |
| C-CH-3 | pass | descriptor 故事已覆盖提议、审查和消费三类目标,可进入 Step 9。 |
| C-CH-4 | pass | governance seam 与 method relation 故事已覆盖管理、审查、提议和审计目标,可进入 Step 9。 |
| C-CH-5 | pass | 消费与变化感知故事已覆盖系统消费、浏览、维护和审计目标,可进入 Step 9。 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §8。当前不得直接写入正式文档。

```md
## 8. 用户故事

> 校准来源:
> - `design-calibration/00_req_step_08_user_stories.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/00_req_step_08_user_stories.md` 的“按能力节点组织的用户故事结论”“结构化中间产物”和“跨能力故事审计”小节,了解本章故事如何从角色与核心能力闭环收敛而来。

本文采用 `design-calibration/00_req_step_08_user_stories.md` §7 的用户故事结论:核心闭环故事覆盖稳定身份进入接入语境、受控注册目录、可解释接入描述、治理结果与方法资产关系接缝、受控消费表达与变化感知;外围增强故事只保留管理 UI / 批量导入、搜索 / 浏览体验、自动发现、安全摘要 / secret reference 提示、SDK developer experience、只读生态发现和审计友好输出,不作为当前核心闭环成立条件。

正式章节应摘录:

- `design-calibration/00_req_step_08_user_stories.md` §7.1 核心闭环故事表
- `design-calibration/00_req_step_08_user_stories.md` §7.2 外围增强故事表
- `design-calibration/00_req_step_08_user_stories.md` §7.4 故事与闭环映射结论
```

---

## 9. 待确认事项

| ID | 待确认事项 | 当前状态 | 是否阻塞 Step 8 | 后续处理 |
|---|---|---|---|---|
| `OQ-CH-015` | governance seam 的最小引用内容是 approval ref、usage constraint summary,还是更完整的 governance outcome summary。 | pending | 否 | Step 10 / Step 11 / Step 12 处理 |
| `OQ-CH-017` | SDK exposure 的最小服务端边界应以何种正式消费语义表达。 | partial_resolved | 否 | Step 8 已确认它属于 C-CH-5;接口形态后移 Step 12 |
| `OQ-CH-023` | 安全 / 接入审查者与 governance approval 的职责如何在后续 seam 中区分。 | pending | 否 | Step 10 / Step 12 处理 |
| `OQ-CH-006-002` | method relation 是否只允许 body-free ref / relation,以及最小关系语义是什么。 | pending | 否 | Step 10 / Step 11 / Step 12 处理 |
| `OQ-CH-006-004` | 外部 API、LLM provider API 和 provider runtime 的正式区分语义如何写入后续章节。 | pending | 否 | Step 9 / Step 10 / Step 11 / Step 12 处理 |
| `OQ-CH-006-005` | secret reference 是否需要进入 descriptor 的约束摘要,以及进入到什么粒度。 | pending | 否 | Step 10 / Step 11 / Step 13 处理 |
| `OQ-CH-007-005` | allow / deny / 白名单的最终语义归属是 descriptor 约束、治理结果接缝还是消费边界。 | pending | 否 | Step 10 / Step 12 / Step 14 处理 |

---

## 10. Blocker 判定

| Blocker 候选 | 判定 | 理由 | 当前处理 |
|---|---|---|---|
| 旧 `US-001~US-005` 与当前边界冲突 | historical_conflict_not_blocker | 旧故事不能继承,但 Step 5 / Step 7 提供了足够角色和能力锚点重写故事。 | 已改写或排除,后续 Step 9+ 持续审计 |
| restart 前 Step 8 文件状态与引用失真 | historical_conflict_not_blocker | 旧文件已标 completed,但 flow / ledger 未同步;引用中还混入无关参考。 | 已原位重写并恢复到当前 restart 基线 |
| 系统消费方具体拆分未闭合 | not_blocker_for_step_08 | Step 8 可使用抽象系统消费方;具体接口和消费 surface 属于 Step 12。 | Step 9 / Step 12 处理 |
| governance seam 字段未闭合 | not_blocker_for_step_08 | Step 8 只需表达承接治理结果的角色目标;字段和规则后续处理。 | Step 10 / Step 11 / Step 12 处理 |
| method relation 具体数据语义未闭合 | not_blocker_for_step_08 | Step 8 只需确认 body-free relation 目标;具体数据和接口后续处理。 | Step 11 / Step 12 处理 |
| allow / deny 最终归属未闭合 | not_blocker_for_step_08 | Step 8 不应把规则和执行直接写成故事;归属判断属于后续规则 / 接口 / 验收。 | Step 10 / Step 12 / Step 14 处理 |

结论: 未发现阻塞 `00-需求文档.md` Step 8 的上游 blocker。

---

## 11. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 每条核心故事是否有编号 | pass | 使用 `US-CH-001` ~ `US-CH-017`。 |
| 每条故事是否有业务价值和闭环映射 | pass | 核心和外围增强故事均包含目标类型、业务价值和映射列。 |
| 是否区分核心闭环故事与外围增强故事 | pass | §7.1 为核心闭环故事,§7.2 为外围增强故事。 |
| 是否排除边界外故事 | pass | §7.3 排除了 execution、secret、cost、marketplace、governance approval、method body、SDK client 和 routing。 |
| 是否先按能力节点收故事 | pass | §6 先对 C-CH-1~C-CH-5 逐节点收敛,再汇总到 §7 故事表。 |
| 是否把角色说明当故事 | pass | 故事采用角色目标句式,不重复 Step 5 角色表。 |
| 是否把功能名、接口名或事件名写成故事 | pass | 未使用 QueryCapabilities、RegisterProvider、事件名、DTO、handler 或验收动作。 |
| 是否把业务规则、数据归属、NFR 或验收条件写成故事 | pass | 未写 Given / When / Then、30s、100%、P95、字段或状态机。 |
| 能力节点故事是否足以进入 Step 9 | pass | C-CH-1~C-CH-5 均有明确角色目标支撑。 |
| 是否可进入 Step 9 | blocked_until_user_confirm | 必须等待用户确认后才能继续。 |
