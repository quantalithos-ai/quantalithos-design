# 00 Step 12 · 接口与依赖

> 所属文档: `00-需求文档.md`
> Step: Step 12
> 目标章节: 正式文档 §12 `接口与依赖`
> 当前状态: completed_stop_review
> 当前约束: 本步只说明能力级接口面和外部依赖边界;不得写 API 路径、HTTP / gRPC / RPC 方法签名、DTO / JSON / proto、事件 schema、字段名、handler / service / repository / outbox、重试 / fallback / relay / transaction 或实现调用链。

---

## 1. Step 状态

| 字段 | 值 |
|---|---|
| step | Step 12 |
| status | completed_stop_review |
| gate_status | pass_for_step_12_only |
| previous_step | Step 11 `数据需求与数据归属` |
| next_allowed_action | wait_user_review_to_step_13 |
| formal_section | `00-需求文档.md` §12 |
| formal_write_status | not_written |
| blocker_status | no_upstream_blocker_for_step_12 |

---

## 2. Step 内计划

| 序号 | 动作 | 状态 | 输出 |
|---|---|---|---|
| 1 | 回读项目台账、需求 flow、Step 6 / Step 9 / Step 10 / Step 11 | done | 确认用户已同意进入 Step 12,且不得跳到 Step 13 或正式文档装配。 |
| 2 | 读取需求 SOP Step 12 和书写规范 4.12 | done | 确认接口类型、依赖类型和输出表结构,并确认不得写协议 / DTO / 事件 schema。 |
| 3 | 读取全局依赖裁剪规则 | done | 确认只有编译期依赖可落 package dependency,运行期和事件协作不得写成源码依赖。 |
| 4 | 读取上游参考 Step 12 | done | 参考 `L1-governance`、`L3-method-library`、`L0-sdk` 的能力级接口与依赖组织方式,不复制其它仓领域内容。 |
| 5 | 按 C-CH-1~C-CH-5 梳理能力级接口面 | done | 形成变更、查询、事件输出、事件输入和后台任务候选。 |
| 6 | 承接 Step 6 裁剪结果梳理外部依赖边界 | done | 形成 `L0-core`、`L0-bus`、外部 MCP / A2A / API、`L1-governance`、`L2-runtime`、`L2-tools`、`L0-sdk`、`L3-method-library` 等边界。 |
| 7 | 诊断旧接口与依赖章节冲突 | done | 将 policy 更新、KMS / Vault、QueryCapabilities、provider lookup、cost events、SLA 和降级策略从当前 Step 12 主线中裁剪。 |
| 8 | 做设计取舍 | done | 采用“核心能力节点 -> 能力级接口 -> 外部依赖边界 -> FR / BR 映射”方式,不采用旧上下游接口表。 |
| 9 | 形成结构化接口 / 依赖表和能力级停审 | done | 为正式 §12 提供可回填候选,但不写入正式文档。 |
| 10 | 自检与停审 | done | 无阻塞 Step 12 的上游 blocker;等待用户确认是否进入 Step 13。 |

---

## 3. 本步输入与读取结论

### 3.1 前序 Step 输入

| 来源 | 已确认结论 | 对 Step 12 的影响 |
|---|---|---|
| Step 6 | `L0-core` 是唯一编译期依赖;`L0-bus` 是事件协作主干;外部 MCP / A2A / API 是运行期外部系统集成边界;`L1-governance` 是运行期 / 事件协作接缝;`L2-runtime`、`L2-tools`、`L0-sdk` 是运行期消费边界;`L3-method-library` 只保留 body-free relation。 | Step 12 必须承接依赖类型判断,不得把运行期或事件协作写成 package dependency。 |
| Step 9 | 功能需求为 `FR-CH-001~016` 与 `FR-CH-E01~E07`。 | 每个接口 / 依赖边界必须回指功能需求或外围增强功能。 |
| Step 10 | 规则 `BR-CH-001~037` 与 `BR-CH-E001` 已钉住 identity、registry、descriptor、governance seam、method relation、formal exposure 和边界红线。 | 接口不能打穿 execution、secret、governance truth、method body、SDK client、marketplace、observability 等边界。 |
| Step 11 | 本仓 truth 是外部能力接入事实;外部正文只可作为快照或引用;secret、runtime execution、governance truth、method body、SDK client、marketplace、cost、observability 正文禁止保存。 | 接口只能传递接入事实、引用、快照和安全摘要,不得让正文回流。 |

### 3.2 规范输入

| 输入文件 | 本步读取重点 | 对 Step 12 的约束 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 12 | 先判断能力边界属于哪类接口类型,再判断依赖边界属于哪类依赖类型;能力边界必须能回指能力节点和功能需求。 | 不得重抄 Step 6 仓依赖表,不得画调用链或事件传播链。 |
| `需求文档书写规范.md` 4.12 | 接口类型固定为查询接口、变更接口、事件输出、事件输入、后台任务接口;依赖类型固定为定义来源依赖、治理结论依赖、下游消费依赖、外部能力依赖。 | 表格必须使用固定枚举和固定列。 |
| `全局项目依赖关系与裁剪规则.md` | 编译期、运行期、事件协作依赖的判定和禁止写法。 | 运行期依赖和事件协作依赖不得写成 Cargo path dependency。 |
| `设计真相源闭环与可落码性标准.md` | 接口边界必须服务 truth owner 闭环,不得制造多真相源。 | formal exposure、governance seam、method relation 只能表达边界,不能接管相邻仓 truth。 |

### 3.3 上游参考输入

| 参考文件 | 使用方式 | 结论 |
|---|---|---|
| `projects/L1-governance/design-calibration/00_req_step_12_interfaces_dependencies.md` | 参考能力级接口 / 依赖写法和“协议名后移”的约束。 | 本仓也只写能力级接口面,不写 event 名、Command 名或存储依赖。 |
| `projects/L3-method-library/design-calibration/00_req_step_12_interfaces_dependencies.md` | 参考 body-free relation、下游消费和事件协作边界写法。 | method relation 在本仓只写 relation 能力面,不写 method 正文同步。 |
| `projects/L0-sdk/design-calibration/00_req_step_12_interfaces_dependencies.md` | 参考 SDK 只消费服务端正式边界、不拥有服务端 truth 的写法。 | 本仓提供服务端 exposure boundary;SDK client 和 language package 不归本仓。 |

### 3.4 目标旧材料输入

| 旧材料 | 可保留线索 | 不可继承口径 |
|---|---|---|
| `quantalithos-core` / `quantalithos-bus` | core / bus 是当前主链线索。 | 不能沿用 proto、SLA、backlog / replay 等实现或 NFR 表达。 |
| governance(policy.updated / shared_rules) | 正式可见 / 可用语境需要 governance 结果接缝。 | 不继承事件名、Policy truth、shared_rules truth、30s 刷新或白名单语义。 |
| KMS / Vault | descriptor 涉及 secret reference 和安全边界。 | KMS / Vault 不进入当前接口主线;不得写密钥托管接口。 |
| runtime / tools(QueryCapabilities / provider lookup) | 下游需要消费正式能力接入事实。 | 不继承接口名、allow / deny 结果、provider lookup 或运行查询语义。 |
| marketplace(注册能力元数据) | 只读生态发现可作为外围增强。 | listing、交易、定价、履约和 marketplace registry truth 不归本仓。 |
| observability(审计 / cost events) | 接入事实可审计,审计友好导出可作为外围增强。 | 不写 audit store、cost events、trace、metrics 或物理观测依赖。 |

---

## 4. SOP 问题回答

### 4.1 当前正在讨论哪个核心能力节点?

本步按以下能力节点逐个收敛接口与依赖:

1. C-CH-1 外部能力能够以稳定身份进入接入语境。
2. C-CH-2 外部能力能够进入受控注册目录并形成生命周期语义。
3. C-CH-3 已注册能力能够拥有可解释的接入描述。
4. C-CH-4 接入事实能够承接治理结果并保持方法资产关系边界。
5. C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化。

该顺序是需求能力边界收束顺序,不是接口调用顺序、事件传播顺序、数据流、开发阶段或部署顺序。

### 4.2 本仓对外提供哪些能力级接口?

| 能力节点 | 对外能力级接口 |
|---|---|
| C-CH-1 稳定身份 | 外部能力接入语境建立与调整;capability identity 查询与引用;接入身份风险解释与审查事实维护。 |
| C-CH-2 注册目录 | 注册目录纳入 / 退出与生命周期变更;注册目录可见性与正式接入事实读取;目录维护与一致性对账。 |
| C-CH-3 接入描述 | adapter descriptor 建立与替换;接入描述、风险和约束摘要读取;descriptor 变化可感知输出。 |
| C-CH-4 治理 / 方法关系接缝 | governance seam 挂接 / 替换 / 失效;governance seam 与接入审查边界读取;capability-method body-free relation 建立 / 变更 / 移除;接入事实追溯读取。 |
| C-CH-5 受控消费表达 | formal exposure boundary 变更;正式可见性 / 适用边界读取;受控消费视图读取;能力接入事实变化可感知输出;审计友好摘要导出。 |

### 4.3 本仓消费哪些能力级输入?

| 输入面 | 来源 | 说明 |
|---|---|---|
| 共享契约 / 引用基线 | `L0-core` | 支撑 capability identity、registry、引用和跨仓一致性表达。 |
| 事件协作通道 | `L0-bus` | 支撑 capability 接入事实变化被相邻仓持续感知。 |
| 外部能力来源 | 外部 MCP / A2A / API | 作为 identity、registry 和 adapter descriptor 的接入对象来源。 |
| governance 结果输入 | `L1-governance` | 作为正式可见 / 可用语境的 governance result ref 或允许摘要来源。 |
| method asset 来源引用 | `L3-method-library` | 作为 body-free method relation 的外部定义来源引用,不消费 method 正文。 |
| secret reference 来源 | 外部 secret / KMS / Vault 边界候选 | 只允许 secret ref 或安全摘要,不消费 secret 正文或密钥平台 truth。 |
| 下游消费反馈 | `L2-runtime`、`L2-tools`、`L0-sdk` | 只作为消费影响摘要或反馈线索,不接管执行、工具调用或 SDK client truth。 |
| 审计 / 观测引用 | `L4-observability` 等横切系统候选 | 只作为审计引用或安全摘要,不拥有 audit store、trace、metric 或 cost ledger。 |

### 4.4 哪些是同步能力边界,哪些是异步能力边界?

| 边界类型 | 能力边界 | 说明 |
|---|---|---|
| 同步能力边界 | identity / registry / descriptor / seam / relation / exposure 的变更入口 | 需要在业务语境中立即判断是否允许形成正式接入事实变化。 |
| 同步能力边界 | identity、registry、descriptor、seam、relation、formal exposure 和追溯读取 | 需要稳定读取当前正式接入事实和允许的摘要 / 引用。 |
| 后台任务边界 | registry maintenance / reconciliation、派生摘要整理、审计友好导出准备 | 以维护或后台任务体现,但不得创造新的业务接入结论。 |
| 异步能力边界 | capability access fact 变化输出 | identity、registry、descriptor、seam、relation、formal exposure 等关键变化发生后,下游应能持续感知。 |
| 异步能力边界 | governance result、下游消费影响、候选发现等输入 | 外部变化可作为输入线索,但不得隐式改写本仓正式接入事实。 |

### 4.5 哪些依赖是输入型,哪些结果是输出型?

| 方向 | 能力边界 |
|---|---|
| 输入型 | `L0-core` 共享契约、外部 MCP / A2A / API 来源、`L1-governance` 结果引用、`L3-method-library` method asset 引用、secret ref、安全摘要、下游消费影响摘要、审计 / 观测引用。 |
| 输出型 | capability identity、registry、adapter descriptor、governance seam relation、method body-free relation、formal exposure boundary、正式可见性、受控消费视图、接入事实追溯、变化感知输出、审计友好摘要。 |
| 双向协作型 | `L0-bus` 事件协作、`L1-governance` 结果接缝与反馈线索、`L2-runtime` / `L2-tools` / `L0-sdk` 消费边界和影响反馈。 |

### 4.6 哪些能力边界属于当前阶段核心闭环,哪些只是外围增强?

| 能力边界 | 能力层级 |
|---|---|
| 外部能力接入语境建立与 identity 稳定识别 | 核心闭环能力 |
| 注册目录纳入 / 退出、可见性和生命周期语义读取 | 核心闭环能力 |
| adapter descriptor 建立、替换和读取 | 核心闭环能力 |
| governance seam 挂接 / 读取与接入审查职责区分 | 核心闭环能力 |
| capability-method body-free relation 建立 / 读取 | 核心闭环能力 |
| formal exposure boundary、正式可见性和受控消费视图 | 核心闭环能力 |
| 关键接入事实变化可感知输出 | 核心闭环能力 |
| 管理入口批量整理、搜索 / 浏览优化、候选自动发现、安全摘要深化、SDK 说明增强、只读生态发现、审计友好导出 | 外围增强能力 |

### 4.7 哪些能力边界来自 Step 6 的编译期 / 运行期 / 事件协作依赖判断?

| Step 6 依赖判断 | Step 12 能力边界 |
|---|---|
| `L0-core` 编译期依赖 | 共享契约和基础引用输入边界。 |
| `L0-bus` 事件协作依赖 | capability access fact 变化输出和外部变化输入边界。 |
| 外部 MCP / A2A / API 运行期依赖 | 外部能力来源、接入对象和 adapter descriptor 输入边界。 |
| `L1-governance` 运行期 / 事件协作接缝 | governance result ref / safe summary 输入、seam relation 变更和读取边界。 |
| `L2-runtime` / `L2-tools` 运行期消费 | formal exposure、受控消费视图和能力变化感知输出边界。 |
| `L0-sdk` 运行期消费 | 服务端 exposure boundary 被 SDK 封装的下游消费边界。 |
| `L3-method-library` 无直接依赖 / relation 边界 | method asset ref 与 body-free relation 能力边界。 |

### 4.8 是否存在功能需求需要外部协作但 Step 6 / Step 12 没有依赖承接?

未发现。`FR-CH-001~016` 均能通过 Step 6 已裁剪关系或本步能力接口面承接:

- `FR-CH-001~003` 由 `L0-core`、外部 MCP / A2A / API 来源和 identity 变更 / 查询面承接。
- `FR-CH-004~006` 由 registry 变更 / 查询 / 后台维护面和 `L0-bus` 变化协作承接。
- `FR-CH-007~009` 由外部能力来源、adapter descriptor 变更 / 查询面和 secret reference 条件边界承接。
- `FR-CH-010~013` 由 `L1-governance` seam、`L3-method-library` relation、traceability 查询和事件协作承接。
- `FR-CH-014~016` 由 formal exposure 查询 / 变更、`L2-runtime` / `L2-tools` / `L0-sdk` 下游消费和 `L0-bus` 变化感知承接。

---

## 5. 当前文档问题诊断

| 诊断对象 | 当前表现 | 问题 | Step 12 处理 |
|---|---|---|---|
| 旧 `00` §10.1 外部系统依赖列表 | `quantalithos-core`、`quantalithos-bus`、governance、KMS / Vault、外部 Provider API、MCP / A2A 与 SLA / 降级策略并列。 | 混合依赖、外部系统、NFR、配置和运行策略。 | 改为能力级外部依赖边界;SLA / 降级策略后移 Step 13 / 架构 / 配置。 |
| 旧 `00` §10.2 上下游接口约定 | `policy.updated`、`shared_rules`、`QueryCapabilities`、`provider lookup`、marketplace 元数据、observability 审计 / cost events。 | 写了事件名、查询名、运行查询和成本 / 观测接口,且打穿 governance / execution / cost 边界。 | 重裁为 governance seam、formal exposure、受控消费视图、审计友好摘要;旧名称只作 historical material。 |
| 旧 KMS / Vault 依赖 | 作为核心外部系统依赖。 | secret 平台和密钥生命周期不归 capability-hub。 | 只保留 secret reference 条件边界;KMS / Vault 不进入当前接口主链。 |
| 旧 runtime / tools 查询面 | 以 `QueryCapabilities / provider lookup` 作为下游接口。 | 接口名绑定旧执行 / 查询语义,容易让查询结果反向成为 truth。 | 改为 formal exposure、受控消费视图和变化感知能力面。 |
| 旧 marketplace / observability 输出 | 作为正式下游接口。 | marketplace listing / transaction 和 audit store / cost events 不归本仓。 | 只保留只读生态发现和审计友好导出为外围增强。 |

---

## 6. 设计取舍

### 6.1 接口与依赖骨架取舍

| 方案 | 骨架 | 优点 | 缺点 | 当前取舍 |
|---|---|---|---|---|
| 方案 A | 沿用旧上下游接口表 | 迁移快,旧材料覆盖面广。 | 保留 policy 事件名、KMS、QueryCapabilities、provider lookup、cost events 等越界项。 | 不采用。 |
| 方案 B | 按能力节点重建接口面和依赖边界 | 能直接承接 Step 6 / 9 / 10 / 11,并防止协议和实现提前固化。 | 需要后续 01~03 再拆具体协议。 | 采用。 |
| 方案 C | 只写 registry 查询和 descriptor 查询 | 篇幅短。 | 漏掉 identity、governance seam、method relation、formal exposure 和变化感知。 | 不采用。 |
| 方案 D | 直接写 API / event / Command 名 | 接近落码。 | 违反需求层粒度,会提前锁定协议和实现。 | 不采用。 |

### 6.2 关键议题取舍

| 议题 | 当前结论 | 理由 |
|---|---|---|
| formal exposure boundary 的接口面 | 需求层表达为查询接口 + 变更接口 + 事件输出能力面;具体查询、订阅或事件协议后移。 | Step 12 要闭合能力边界,不锁定协议形式。 |
| governance 结果接缝 | 表达为治理结论依赖、事件输入 / 变更接口和查询接口,至少需要 governance result ref。 | Step 11 已确定 safe summary 不能替代 formal ref。 |
| secret reference | 表达为条件型外部能力输入边界,不进入核心接口主链;只允许 ref / safe summary。 | secret 正文和 KMS / Vault truth 禁止进入本仓。 |
| method relation | 表达为 body-free relation 变更 / 查询接口和 `L3-method-library` 定义来源依赖边界。 | 本仓拥有 relation truth,不拥有 method body。 |
| runtime / tools 消费 | 表达为 formal exposure 和受控消费视图的下游消费依赖。 | 本仓不执行 runtime/tools,也不定义 allow / deny enforcement。 |
| SDK exposure | 表达为服务端能力边界被 SDK 消费,不表达 SDK client 或 language package。 | SDK client truth 归 `L0-sdk`。 |
| marketplace / observability | 只作为外围增强输出或引用边界。 | listing / transaction、audit store、cost ledger 不归本仓。 |

---

## 7. 结构化中间产物

### 7.1 按能力节点组织的接口与依赖结论

| 核心能力节点 | 对外接口面 | 外部输入 / 输出依赖边界 | 停审要点 |
|---|---|---|---|
| C-CH-1 稳定身份 | 接入语境与 identity 变更;identity 查询与引用;身份风险解释维护。 | 输入: `L0-core` 共享契约、外部 MCP / A2A / API 来源。输出: identity 引用和风险解释给后续 registry / descriptor / seam 消费。 | 未写认证接口、A2A 节点拒绝动作或 URL / provider 名反向定义 identity。 |
| C-CH-2 注册目录 | registry 纳入 / 退出;目录可见性和生命周期读取;目录维护与一致性对账。 | 输入: capability identity。输出: 目录事实、可见性语义和 registry 变化感知给 runtime / tools / SDK。 | 未写 allowlist、availability bit、marketplace listing 或 runtime 状态。 |
| C-CH-3 接入描述 | adapter descriptor 建立 / 替换;descriptor 和风险 / 约束摘要读取;descriptor 变化输出。 | 输入: 外部 MCP / A2A / API 来源、secret ref 条件边界。输出: 可解释接入描述给审查、消费和 formal exposure。 | 未写 Provider Contract、KMS 接口、quota / route / cost / failover 或 provider runtime。 |
| C-CH-4 治理 / 方法关系接缝 | governance seam 挂接 / 替换 / 失效;seam 与接入审查边界读取;body-free method relation 变更 / 查询;接入事实追溯读取。 | 输入: `L1-governance` result ref / safe summary、`L3-method-library` method asset ref。输出: seam / relation / traceability 给 formal exposure 和审计协作。 | 未写 governance approval、Policy truth、method body 或 method definition 同步。 |
| C-CH-5 受控消费表达 | formal exposure boundary 变更;正式可见性 / 适用边界读取;受控消费视图读取;能力变化感知输出;审计友好摘要导出。 | 输出: `L2-runtime`、`L2-tools`、`L0-sdk` 下游消费,`L0-bus` 事件协作,候选输出给 console / marketplace / observability。输入: 下游消费影响摘要。 | 未写 QueryCapabilities、provider lookup、SDK client、observability store、cost events 或 execution 结果。 |

### 7.2 对外能力接口表

| 接口类型 | 名称 | 说明 | 所属能力层级 |
|---|---|---|---|
| 变更接口 | 外部能力接入语境与 identity 建立 | 对外体现为正式建立外部能力接入语境和 capability identity 的能力入口。 | 核心闭环能力 |
| 变更接口 | capability identity 显式更正与退役 | 对外体现为显式合并、拆分、更正或退役 capability identity 的能力入口。 | 核心闭环能力 |
| 查询接口 | capability identity 查询与引用 | 对外体现为稳定读取、引用和解释 capability identity 的能力面。 | 核心闭环能力 |
| 变更接口 | 接入身份风险解释与审查事实维护 | 对外体现为维护身份层风险解释和接入审查事实的能力入口,不替代治理批准。 | 核心闭环能力 |
| 变更接口 | registry 纳入、退出与生命周期变更 | 对外体现为让已识别能力进入或退出注册目录,并显式改变目录生命周期语义的能力入口。 | 核心闭环能力 |
| 查询接口 | registry 可见性与正式接入事实读取 | 对外体现为读取目录可见性、可用语境、生命周期语义和正式接入事实的能力面。 | 核心闭环能力 |
| 后台任务接口 | registry 维护与一致性对账 | 对外体现为对目录派生结果、对账结果和一致性保护进行后台维护的能力入口。 | 核心闭环能力 |
| 变更接口 | adapter descriptor 建立与替换 | 对外体现为建立、替换或退役已注册能力接入描述的能力入口。 | 核心闭环能力 |
| 查询接口 | 接入描述与风险 / 约束摘要读取 | 对外体现为读取 adapter descriptor、风险解释和约束摘要的能力面。 | 核心闭环能力 |
| 变更接口 | governance seam 挂接、替换与失效 | 对外体现为将能力接入事实与正式治理结果引用建立、替换或失效的能力入口。 | 核心闭环能力 |
| 查询接口 | governance seam 与接入审查边界读取 | 对外体现为读取治理结果引用、允许摘要和审查 / 治理职责区分的能力面。 | 核心闭环能力 |
| 变更接口 | capability-method body-free relation 变更 | 对外体现为建立、调整或移除 capability 与 method asset 的无正文关系。 | 核心闭环能力 |
| 查询接口 | capability-method relation 与接入事实追溯读取 | 对外体现为读取 capability-method relation 和 capability access traceability 的能力面。 | 核心闭环能力 |
| 变更接口 | formal exposure boundary 变更 | 对外体现为显式调整服务端正式能力暴露边界、正式可见性和适用边界的能力入口。 | 核心闭环能力 |
| 查询接口 | 正式可见性与受控消费视图读取 | 对外体现为 runtime、tools、SDK 或产品入口按边界读取正式能力接入事实的能力面。 | 核心闭环能力 |
| 事件输出 | capability access fact 变化输出 | 对外体现为 identity、registry、descriptor、seam、relation 和 exposure 关键变化可被下游持续感知。 | 核心闭环能力 |
| 事件输入 | governance 结果与消费影响输入 | 对内体现为接收 governance result 变化线索或下游消费影响摘要,但不隐式改写本仓 truth。 | 核心闭环能力 |
| 查询接口 | 目录搜索与浏览摘要读取 | 对外体现为读取由正式接入事实派生的搜索、过滤和浏览摘要。 | 外围增强能力 |
| 事件输入 | 外部能力候选发现输入 | 对内体现为接收外部 MCP / A2A / API 候选发现线索,但候选不能直接形成正式接入 truth。 | 外围增强能力 |
| 查询接口 | SDK / 客户端消费说明读取 | 对外体现为读取服务端 exposure 与客户端封装边界说明,帮助 SDK 保持一致。 | 外围增强能力 |
| 查询接口 | 只读生态发现摘要读取 | 对外体现为向生态入口提供只读可发现线索,不形成 marketplace listing truth。 | 外围增强能力 |
| 后台任务接口 | 审计友好摘要导出准备 | 对外体现为准备 capability access summary 用于审计协作,不拥有 audit store。 | 外围增强能力 |

### 7.3 外部依赖边界表

| 依赖方向 | 依赖类型 | 关联方 | 全局依赖类型 | 说明 | 所属能力层级 |
|---|---|---|---|---|---|
| 输入 | 定义来源依赖 | `L0-core` | 编译期依赖 | 本仓使用共享契约、基础引用和跨仓一致性基线表达 capability identity、registry 和 ref。 | 核心闭环能力 |
| 输入 / 输出 | 下游消费依赖 | `L0-bus` | 事件协作依赖 | 本仓通过事件协作输出 capability access fact 变化,并可接收外部变化线索。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | 外部 MCP server / MCP ecosystem | 运行期依赖 | MCP 类外部能力作为 identity、registry 和 adapter descriptor 的接入对象来源。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | 外部 A2A node / A2A ecosystem | 运行期依赖 | A2A 类外部能力作为身份风险解释、registry 和 adapter descriptor 的接入对象来源。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | 外部 API / provider API surface | 运行期依赖 | API 类外部能力作为 adapter descriptor 和约束摘要的接入对象来源,不包含 provider runtime。 | 核心闭环能力 |
| 输入 | 治理结论依赖 | `L1-governance` | 运行期依赖 / 事件协作依赖 | 本仓消费 governance result ref 或允许摘要,并维护 governance seam relation;不拥有 approval 或 Policy truth。 | 核心闭环能力 |
| 输入 / 输出 | 定义来源依赖 | `L3-method-library` | 不适用 | 本仓只建立 capability 与 method asset 的 body-free relation,不依赖 method-library 源码或正文。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L2-runtime` | 运行期依赖 | runtime 按 formal exposure 和受控消费视图消费能力接入事实;execution 不回写成本仓 truth。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L2-tools` | 运行期依赖 | tools 按 descriptor 和 formal exposure 消费 MCP / A2A / API 能力接入事实;tool execution 不归本仓。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L0-sdk` | 运行期依赖 | SDK 封装本仓服务端能力边界;SDK client、language package 和 package candidate 不归本仓。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | secret / KMS / Vault 边界候选 | 不适用 | 仅允许 secret ref 或安全摘要作为条件型输入;secret 正文和 secret platform truth 不进入接口主线。 | 外围增强能力 |
| 输出 | 下游消费依赖 | `L5-console` | 运行期依赖 | console 可消费管理入口和目录浏览能力,但 UI 状态不定义 capability truth。 | 外围增强能力 |
| 输出 | 下游消费依赖 | `L6-marketplace` | 运行期依赖 / 事件协作依赖 | marketplace 最多只读消费生态发现摘要或引用;listing、交易和履约不归本仓。 | 外围增强能力 |
| 输出 / 输入 | 下游消费依赖 | `L4-observability` | 事件协作依赖 | observability 可消费审计友好摘要或提供 audit summary ref;本仓不拥有 audit store、trace、metric 或 cost ledger。 | 外围增强能力 |

### 7.4 接口类型结论

| 接口类型 | 本仓使用情况 |
|---|---|
| 查询接口 | identity 查询、registry 读取、descriptor / 风险摘要读取、governance seam 读取、method relation / traceability 读取、formal exposure / 受控消费视图读取、外围搜索 / SDK 说明 / 生态发现读取。 |
| 变更接口 | identity 建立 / 更正 / 退役、registry 生命周期变化、descriptor 建立 / 替换、governance seam 挂接 / 失效、method relation 变化、formal exposure boundary 变化。 |
| 事件输出 | capability access fact 关键变化输出,用于下游持续感知 identity、registry、descriptor、seam、relation 和 exposure 变化。 |
| 事件输入 | governance 结果变化线索、下游消费影响摘要、外部候选发现线索;输入不得隐式改写本仓正式 truth。 |
| 后台任务接口 | registry 维护与一致性对账、审计友好摘要导出准备、派生摘要整理。 |

### 7.5 依赖类型结论

| 依赖类型 | 本仓使用情况 |
|---|---|
| 定义来源依赖 | `L0-core` 提供共享契约和引用基线;`L3-method-library` 作为 method asset ref 的定义来源边界,但不形成直接源码依赖。 |
| 治理结论依赖 | `L1-governance` 提供 governance result ref 或允许摘要,支撑正式可见 / 可用语境的 seam。 |
| 下游消费依赖 | `L0-bus`、`L2-runtime`、`L2-tools`、`L0-sdk` 消费能力接入事实或变化输出;`L5-console`、`L6-marketplace`、`L4-observability` 只作为外围消费。 |
| 外部能力依赖 | 外部 MCP / A2A / API 作为接入对象来源;secret / KMS / Vault 仅作为条件型 secret ref 边界,不成为主线 truth 依赖。 |

### 7.6 能力边界与全局依赖类型映射结论

| 能力边界 | 关联方 | 全局依赖类型 | 约束 |
|---|---|---|---|
| 共享契约与引用基线 | `L0-core` | 编译期依赖 | 唯一允许作为后续 package dependency 候选的内部仓。 |
| 能力变化协作 | `L0-bus` | 事件协作依赖 | 不得写成业务 truth owner 或 Cargo path dependency。 |
| 外部能力来源与接入对象 | 外部 MCP / A2A / API | 运行期依赖 | 本仓只登记、描述和建立接缝,不执行外部调用。 |
| 治理结果接缝 | `L1-governance` | 运行期依赖 / 事件协作依赖 | 本仓只消费 formal result ref 或 safe summary,不拥有 approval / Policy truth。 |
| 方法资产关系 | `L3-method-library` | 不适用 | 只保留 body-free relation,不建立源码依赖、正文复制或定义同步。 |
| 执行侧消费 | `L2-runtime` / `L2-tools` | 运行期依赖 | 下游消费 formal exposure 和 descriptor,execution / tool execution 不回流。 |
| SDK exposure 消费 | `L0-sdk` | 运行期依赖 | SDK 封装服务端边界,SDK client 不归本仓。 |
| 管理 / 生态 / 观测外围消费 | `L5-console` / `L6-marketplace` / `L4-observability` | 运行期依赖 / 事件协作依赖 | 只读或审计友好消费,不得改变核心 truth。 |
| secret reference 条件边界 | secret / KMS / Vault | 不适用 | 只允许 ref / safe summary,secret 正文禁止进入。 |

### 7.7 接口 / 依赖与功能需求映射

| 功能需求 | 对应接口 / 依赖 | 映射说明 |
|---|---|---|
| FR-CH-001 外部能力接入语境建立 | 外部能力接入语境与 identity 建立;外部 MCP / A2A / API 来源输入;`L0-core` 引用基线 | 接入语境需要正式变更入口和外部来源引用。 |
| FR-CH-002 能力身份稳定识别 | capability identity 查询与引用;identity 更正 / 退役;`L0-core` 定义来源依赖 | 稳定身份需要查询与显式变化接口共同成立。 |
| FR-CH-003 接入身份风险解释 | 接入身份风险解释与审查事实维护;外部能力来源输入 | 风险解释通过变更接口和外部来源引用支撑,不替代治理批准。 |
| FR-CH-004 能力注册目录管理 | registry 纳入 / 退出与生命周期变更;registry 可见性读取 | 注册目录管理需要正式变更和读取能力。 |
| FR-CH-005 目录可见性与生命周期语义 | registry 可见性与正式接入事实读取;formal visibility 读取;governance seam 输入 | 正式可见性需要 registry 语义和治理结果接缝。 |
| FR-CH-006 目录维护与一致性保护 | registry 维护与一致性对账;capability access fact 变化输出;`L0-bus` 事件协作 | 维护结果必须能说明来源并被下游感知。 |
| FR-CH-007 Adapter descriptor 表达 | adapter descriptor 建立与替换;外部 MCP / A2A / API 来源输入 | descriptor 需要外部接入对象和正式变更入口。 |
| FR-CH-008 接入风险与约束摘要 | 接入描述与风险 / 约束摘要读取;secret ref 条件边界 | 风险和约束摘要可读,secret 只允许 ref / safe summary。 |
| FR-CH-009 描述边界消费支撑 | descriptor 读取;formal exposure / 受控消费视图读取;runtime / tools 消费边界 | 下游消费同一 descriptor,不得私补 provider runtime truth。 |
| FR-CH-010 治理结果接缝承接 | governance seam 挂接 / 失效;governance result 输入;seam 读取 | 本仓承接治理结果引用,不执行 approval。 |
| FR-CH-011 接入审查与治理职责区分 | 接入审查事实维护;governance seam 与审查边界读取 | 接口面必须区分本仓审查事实和 governance approval。 |
| FR-CH-012 Method asset body-free relation | capability-method relation 变更 / 查询;`L3-method-library` 定义来源边界 | relation 可变更 / 可读,method body 不进入本仓。 |
| FR-CH-013 接入事实追溯 | relation / seam / traceability 读取;capability access fact 变化输出;observability ref 条件边界 | 追溯由本仓 access truth 支撑,不依赖 audit store 替代。 |
| FR-CH-014 受控消费表达 | formal exposure 变更;正式可见性 / 受控消费视图读取;runtime / tools / SDK 下游消费 | 正式能力边界供下游消费,但下游不得反写 truth。 |
| FR-CH-015 正式可见性表达 | formal visibility 读取;registry 可见性读取;governance result 输入 | 正式可见性必须能解释 registry 和治理接缝。 |
| FR-CH-016 能力变化协作与感知 | capability access fact 变化输出;下游消费影响输入;`L0-bus` 事件协作 | 变化感知通过事件协作表达,不写 event schema。 |
| FR-CH-E01 管理入口与批量整理 | 管理 / 批量整理外围入口;registry 后台维护 | 仅作为外围增强,不得改变核心 truth。 |
| FR-CH-E02 目录搜索与浏览优化 | 目录搜索与浏览摘要读取 | 搜索和浏览是派生摘要,不是 truth 写源。 |
| FR-CH-E03 外部能力候选自动发现 | 外部能力候选发现输入 | 候选发现不能直接形成正式接入 truth。 |
| FR-CH-E04 安全摘要与 secret reference 提示深化 | secret ref 条件边界;安全摘要读取 | 只允许 ref / safe summary,不进入 secret 平台。 |
| FR-CH-E05 SDK / 客户端消费说明增强 | SDK / 客户端消费说明读取;`L0-sdk` 下游消费 | 帮助 SDK 保持边界一致,不实现 SDK client。 |
| FR-CH-E06 只读生态发现 | 只读生态发现摘要读取;`L6-marketplace` 外围消费 | 只读发现不形成 listing truth。 |
| FR-CH-E07 审计友好导出 | 审计友好摘要导出准备;observability / audit ref 条件边界 | 导出摘要服务审计协作,不拥有 audit store。 |

### 7.8 能力级接口停审结论

| 核心能力节点 | 接口 / 依赖承接 | 停审结论 |
|---|---|---|
| C-CH-1 稳定身份 | identity 建立 / 更正 / 查询接口;`L0-core`;外部 MCP / A2A / API 来源。 | 已明确身份接口面和来源输入,未写认证协议、拒绝动作或 provider runtime。 |
| C-CH-2 注册目录 | registry 变更 / 查询 / 后台维护接口;`L0-bus`;runtime / tools / SDK 消费边界。 | 已明确目录 truth 与派生维护边界,未写 allowlist、缓存或 marketplace listing。 |
| C-CH-3 接入描述 | descriptor 变更 / 查询接口;外部能力来源;secret ref 条件边界。 | 已明确 descriptor 能力面,未写 KMS 接口、Provider Contract、quota、route、cost 或 failover。 |
| C-CH-4 治理 / 方法关系接缝 | governance seam 变更 / 查询;method relation 变更 / 查询;`L1-governance`;`L3-method-library`;traceability 查询。 | 已明确 seam / relation 接口面,未写 approval、Policy truth、method body 或 method 正文同步。 |
| C-CH-5 受控消费表达 | formal exposure 变更 / 查询;受控消费视图;变化输出;runtime / tools / SDK 下游消费;审计友好导出外围。 | 已明确服务端 exposure 与下游消费边界,未写 QueryCapabilities、SDK client、execution 或 observability store。 |

### 7.9 跨能力接口审计

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否存在没有功能来源的接口边界 | 未发现 | 所有核心和外围接口均映射到 `FR-CH-*`。 |
| 是否存在 Step 6 依赖类型冲突 | 未发现 | `L0-core` 仍是唯一编译期依赖;运行期和事件协作未写成源码依赖。 |
| 是否把旧接口名当正式接口 | 未发现 | `QueryCapabilities`、`provider lookup`、`policy.updated`、cost events 只作为 historical conflict 出现。 |
| 是否泄漏协议或实现细节 | 未发现 | 未写 API 路径、HTTP/gRPC/RPC 签名、DTO、proto、事件 schema、handler、repository、outbox、重试或事务。 |
| 是否遗漏核心边界 | 未发现 | identity、registry、descriptor、governance seam、method relation、formal exposure 均有接口与依赖承接。 |
| 是否让相邻仓正文回流 | 未发现 | governance truth、method body、secret 正文、execution、SDK client、marketplace、observability 正文均未进入接口主线。 |

### 7.10 旧材料重裁映射

| 旧口径 | 当前处理 | 当前接口 / 依赖归属 | 裁剪说明 |
|---|---|---|---|
| `quantalithos-core` proto / ErrorCode / trace | 保留为 `L0-core` 共享契约与引用基线 | 定义来源依赖 / 编译期依赖 | 不写 proto、字段或错误码细节。 |
| `quantalithos-bus` backlog / replay | 保留为 `L0-bus` 事件协作边界 | 下游消费依赖 / 事件协作依赖 | 不写 backlog、replay、outbox 或 relay 实现。 |
| governance `policy.updated` / shared_rules | 重裁为 governance result 输入与 seam relation | 治理结论依赖 | 不继承事件名、Policy truth、shared_rules truth 或 30s 刷新。 |
| KMS / Vault | 重裁为 secret ref 条件边界 | 外部能力依赖 / 条件边界 | 不进入核心接口主线,不保存 secret 正文。 |
| 外部 Provider API | 重裁为外部 API / provider API surface 输入 | 外部能力依赖 | 不继承 provider runtime、failover、route、quota 或 cost。 |
| MCP Server / A2A Nodes | 重裁为外部 MCP / A2A 来源输入 | 外部能力依赖 | 不写白名单、匿名拒绝或执行调用。 |
| runtime / tools `QueryCapabilities` | 重裁为 formal exposure 和受控消费视图读取 | 下游消费依赖 | 不继承旧查询接口名、allow / deny 结果或执行语义。 |
| `provider lookup` | 重裁为 descriptor / formal exposure 消费边界 | 下游消费依赖 | 不让 provider runtime 或 provider lookup 成为本仓 truth。 |
| marketplace 注册能力元数据 | 重裁为只读生态发现摘要 | 外围增强下游消费依赖 | listing、交易、定价、履约排除。 |
| observability 审计 / cost events | 重裁为审计友好摘要和 observability ref | 外围增强下游消费依赖 | audit store、trace、metric、cost ledger 不进入本仓。 |

---

## 8. 回填草稿

> 注意: 以下只是在 Step 17 装配正式文档时可使用的 §12 候选文本。当前不得直接写入正式 `00-需求文档.md`。

### 8.1 接口与依赖

`L3-capability-hub` 的接口与依赖只表达能力级边界。本仓对外提供 capability identity、registry、adapter descriptor、governance seam、capability-method body-free relation、formal exposure boundary、受控消费视图和能力变化感知等能力面;本仓消费 `L0-core` 共享契约、`L0-bus` 事件协作、外部 MCP / A2A / API 来源、`L1-governance` 正式结果引用、`L3-method-library` method asset 引用和下游消费影响摘要。

正式 §12 可摘录本文件 §7.2 对外能力接口表、§7.3 外部依赖边界表、§7.4 接口类型结论、§7.5 依赖类型结论和 §7.6 能力边界与全局依赖类型映射结论。正式文档中不得写 API 路径、方法签名、DTO、proto、事件 schema、字段名、handler、service、repository、outbox、重试、fallback、relay 或 transaction。

---

## 9. 待确认事项

| ID | 待确认事项 | 当前状态 | 是否阻塞 Step 12 | 后续处理 |
|---|---|---|---|---|
| OQ-CH-012-001 | formal exposure boundary 在实现层是查询面、订阅面、事件面还是组合方式。 | resolved_for_requirements | 否 | Step 12 仅定为查询接口 + 变更接口 + 事件输出能力面;具体协议后移 01/02/03。 |
| OQ-CH-012-002 | governance 结果摘要是否可以缺少 formal result ref。 | resolved_by_step_11_and_12 | 否 | 当前要求正式可见 / 可用依赖治理结论时至少有 governance result ref;safe summary 只能补充。 |
| OQ-CH-012-003 | body-free method relation 是否固定 relation type 集合。 | pending_for_later_design | 否 | Step 12 只确认 relation 变更 / 查询能力面;类型集合后移 Step 15 或 03。 |
| OQ-CH-012-004 | secret reference 是否需要正式外部 secret 系统依赖。 | pending_for_step_13_or_15 | 否 | 当前只作为条件型外部能力边界;安全强度和 secret 平台依赖后移非功能 / 风险。 |
| OQ-CH-012-005 | 只读生态发现是否保留到正式需求主文档。 | pending_for_step_15_or_17 | 否 | 当前作为外围增强接口面保留,Step 15 / Step 17 决定是否降为附注。 |
| OQ-CH-012-006 | observability / audit 协作是否进入核心闭环。 | pending_for_step_13_or_14 | 否 | 当前只保留审计友好导出外围增强和引用边界;非功能 / 验收再判断证据要求。 |

---

## 10. Blocker 判定

| Blocker 候选 | 判定 | 理由 | 当前处理 |
|---|---|---|---|
| 旧接口章节与当前边界冲突 | historical_conflict_not_blocker | 旧接口名和外部系统依赖不能继承,但 Step 6 / 9 / 10 / 11 已提供足够锚点重建能力接口。 | 已将旧项重裁为能力接口、依赖边界、外围增强或禁止项。 |
| formal exposure 具体协议未定 | not_blocker_for_step_12 | 需求层只需确认能力面和依赖边界,具体协议属于后续设计。 | 后移 01/02/03。 |
| secret 系统依赖未定 | not_blocker_for_step_12 | Step 12 已确认 secret 只可 ref / safe summary,是否需要正式平台依赖不阻塞接口边界。 | 后移 Step 13 / Step 15。 |
| method relation type 未定 | not_blocker_for_step_12 | Step 12 已确认 relation 能力面,类型集合不是接口章节门禁。 | 后移 Step 15 / 03。 |

结论: 未发现阻塞 `00-需求文档.md` Step 12 的上游 blocker。

---

## 11. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 已明确主要对外能力接口面 | pass | §7.2 覆盖查询、变更、事件输出、事件输入和后台任务。 |
| 已明确外部依赖边界面 | pass | §7.3 覆盖核心主链、条件边界和外围增强消费。 |
| 已使用正式接口类型与依赖类型枚举 | pass | 接口类型使用 4.12.5;依赖类型使用 4.12.6。 |
| 已承接 Step 6 依赖裁剪判断 | pass | `L0-core` 是唯一编译期依赖;运行期 / 事件协作未写成源码依赖。 |
| 未滑入协议层、字段层或实现层 | pass | 未写 API 路径、RPC、DTO、proto、event schema、handler、repository、outbox、重试或事务。 |
| 已区分核心闭环与外围增强 | pass | 核心 `FR-CH-001~016` 与外围 `FR-CH-E01~E07` 均有对应边界。 |
| 旧 policy / Query / KMS / cost / marketplace / observability 口径已重裁 | pass | 旧项仅作为 historical conflict 或外围 / 条件边界出现。 |
| 是否可进入 Step 13 | blocked_until_user_confirm | 必须等待用户确认后才能继续。 |
