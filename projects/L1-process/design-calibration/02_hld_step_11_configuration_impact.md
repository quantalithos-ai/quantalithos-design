# Step 11. 配置影响轮廓

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 11
> 回填章节: `02-概要设计.md` §11 配置影响轮廓
> 生成日期: 2026-06-05
> 状态: 已完成

---

## 1. 本步目标

识别 `L1-process` 概要层结构中哪些主要组成部分、入口、adapter、job、worker 或外部接缝会受配置影响,并明确哪些边界禁止配置化。

本步不定义配置项清单、默认值、JSON 示例、环境变量名、密钥名称、完整 `RuntimeConfig` 字段、adapter constructor 参数或配置加载实现。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_04_code_subject_framework.md` | 已完成 | 提供同步入口、异步入口、后台任务、外部接缝和技术承载骨架 |
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供主要组成部分和边界 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供 command / query / consumer / job surface |
| `02_hld_step_08_processing_flows.md` | 已完成 | 提供配置可能影响的处理流 |
| `02_hld_step_09_state_machine.md` | 已完成 | 提供禁止配置化的状态机红线 |
| `02_hld_step_10_exceptions_boundaries.md` | 已完成 | 提供配置不能绕过的异常和边界场景 |
| `01_arch_step_12_cross_cutting_concerns.md` | 已完成 | 提供配置与变更控制横切约束 |

---

## 3. 配置影响轮廓表

| 主要部分 / 接缝 | 是否受配置影响 | 配置影响类型 | 交给详细设计展开 |
|---|---|---|---|
| Process command intake | 是 | 幂等保留期、请求大小上限、入口限流、metadata 校验策略、actor context 注入 | command boundary config、idempotency config、validation config |
| Process query intake | 是 | 读取超时、分页上限、projection fallback、stale / degraded 返回策略、可见性 adapter 超时 | query config、read consistency config、visibility config |
| Inbound event consumer | 是 | consumer 启停、批量大小、dedup 保留期、source allow-list、schema version 兼容策略 | event consumer config、dedup config、source adapter config |
| Runtime shape management | 间接受配置影响 | method-library adapter endpoint / timeout / circuit breaker、shape sync job 节奏 | method source adapter config、shape sync config |
| Profile adoption management | 间接受配置影响 | 高风险 tailoring 的 policy 参数、治理依据 adapter 超时、采用入口限流 | policy parameter contract、governance seam config |
| Process execution management | 间接受配置影响 | progression command 限流、expected position 校验开关只能影响严格度默认,不能改变迁移红线 | progression validation config;状态机红线不可配置化 |
| Gate coordination | 间接受配置影响 | governance decision adapter、waiting expiry 扫描节奏、resume evidence 解析超时 | governance seam config、waiting maintenance config |
| Checkpoint and recovery | 是 | checkpoint 保留窗口、recovery maintenance 调度、恢复尝试重试窗口、失败挂起策略 | recovery config、retention config、maintenance job config |
| Process timing and rhythm | 是 | timebox binding refresh 间隔、外部 work context adapter 超时、stage maintenance 扫描范围 | timing config、work context seam config |
| External context mirror support | 是 | method / work / identity / governance / artifact / runtime / conversation 快照刷新间隔、stale 阈值、来源 allow-list | reference refresh config、snapshot adapter config |
| Derived maintenance and reconciliation | 是 | projection 启停、重建窗口、并发、对账范围、报告保留和失败阈值 | projection config、reconciliation config、report config |
| Process outbox publication | 是 | publish batch、重试、dead letter、下游 topic mapping、publication timeout | outbox publisher config、bus adapter config |
| Trace / observability / archive handoff | 是 | handoff 目标、批量、保留、失败挂起、交接超时和 adapter 降级 | handoff config、observability / archive adapter config |
| Process truth storage adapter | 间接受配置影响 | 连接、事务超时、容量保护、迁移策略、隔离实现参数 | storage adapter config;不得改变 truth schema 语义 |
| Domain object / domain policy | 只能通过注入参数间接受影响 | policy 参数可由 application 装配,但 domain 不直接读配置 | policy parameter contract;禁止配置重定义 invariant |
| Runtime assembly / job runner | 是 | adapter wiring、worker 并发、job 调度、启动失败策略、健康检查 | runtime builder config、scheduler config、config validation contract |

---

## 4. 禁止配置化边界表

| 禁止配置化边界 | 原因 | 若需改变应回到哪里 |
|---|---|---|
| Process truth 归属 | 配置不能把 Process truth 交给 method-library、work、governance、runtime、workspace 或 observability | 需求 / 架构 / 概要边界重审 |
| 外部正文排除 | 配置不能允许保存 method definition body、WorkItem 正文、decision 正文、artifact 正文、runtime log、conversation body、archive package | 数据归属和详细对象契约重审 |
| 唯一编译期依赖纪律 | 配置不能把 `L0-bus` 或其他 L1 / L2 / L3 / L4 仓变成 package dependency | 架构依赖裁剪重审 |
| profile adoption / tailoring 显式边界 | 配置不能让 method definition change 自动切换 profile 或移除强制 gate | 概要 Step 7 / Step 8 / Step 9 回退 |
| ProcessInstance 显式变化 | 配置不能让 query、projection、workspace view 或 inbound event 隐式启动、完成、取消或恢复实例 | 概要 Step 8 / Step 9 回退 |
| Activity feedback 正式绑定边界 | 配置不能让 runtime feedback event 直接完成 Activity 或保存 runtime 正文 | 概要 Step 8 / Step 10 回退 |
| waiting gate / governance decision 边界 | 配置不能让 governance event 后台静默恢复 gate,也不能让 Process 自造 decision truth | 概要 Step 8 / Step 9 / Step 10 回退 |
| recovery 不分叉 | 配置不能允许 checkpoint / recovery 生成第二份 ProcessInstance 或覆盖 checkpoint truth | 需求规则、概要状态机和详细恢复契约重审 |
| 状态机红线 | 配置不能允许终态普通回到 Running、Retired 普通恢复 Active、Published 伪装 Pending | 概要 Step 9 回退 |
| 审计链与追溯要求 | 配置不能关闭核心变化 trace / audit / outbox intent | 横切关注点、验收和详细事务契约重审 |
| 派生不反写 | 配置不能让 projection、timeline、summary、reconciliation 或 report 修业务 truth | 概要 Step 5 / Step 10 回退 |
| 安全 / 可见门禁 | 配置不能绕过 actor context、项目语境、过程承担、visibility 或治理依据 | 安全设计 / identity / conversation / governance 协作重审 |
| outbox / handoff 不决定 truth | 配置不能让下游 publish / handoff ack 成为主真相成立前置,也不能让失败回滚 truth | 概要 Step 8 / Step 10 回退 |

---

## 5. 配置影响轮廓图

#### 配置影响轮廓图

```text
+====================== Process configuration impact ==============+
| RuntimeConfig / adapter config / job config                       |
|        |                                                          |
|        +--> command / query / event / job boundaries              |
|        +--> method / work / identity / governance / runtime seams |
|        +--> storage / projection / outbox / handoff adapters      |
|        +--> retry / timeout / batching / retention / stale policy |
|                                                                   |
| Domain truth / invariants / state red lines / audit requirements  |
|        ^                                                          |
|        | configuration may inject parameters, but cannot redefine |
+==================================================================+
```

关键说明:

- 配置主要作用于入口、adapter、job、运行承载、外部接缝、派生维护和技术策略。
- Domain object、状态机红线、truth 归属、正文排除、recovery 不分叉和审计链不得被配置重定义。
- 配置可以调整超时、批量、保留、刷新、重试、调度和外围能力启停,不能改变同步 / 异步 / 后台分工或让维护面反写真相。
- 图不表达配置加载实现、JSON 示例、环境变量、密钥系统、部署挂载或完整 config 类型。

---

## 6. 交给详细设计展开的配置实现契约

| 方向 | 详细设计需要继续展开 |
|---|---|
| `RuntimeConfig` / config root | 根对象命名、加载来源、profile 合并、配置注入边界 |
| `ConfigLoader` / `ConfigValidator` | 加载顺序、错误分类、敏感值处理、启动失败和越界配置拒绝口径 |
| Command / query boundary config | idempotency、metadata validation、pagination、stale / degraded view、visibility timeout |
| Event consumer / dedup config | source allow-list、schema version、dedup 保留、乱序处理、consumer 启停 |
| Adapter config | method-library、work、identity、governance、artifact、runtime、conversation、bus、observability、archive 接缝配置 |
| Job config | shape sync、snapshot refresh、projection rebuild、reconciliation、outbox publish、recovery maintenance、trace handoff、archive handoff 的调度和重试策略 |
| Storage / projection config | storage adapter 参数、事务超时、projection backend、索引刷新、报告保留 |
| Policy parameter config | tailoring risk、waiting expiry、recovery window、retention 等参数如何注入 policy,以及哪些参数越界应拒绝 |
| Config error | 配置缺失、非法、越界、禁止配置化违规和 adapter wiring 失败的错误分类 |
| Runtime builder injection | application service、adapter、repository、publisher、consumer、job runner 如何接收已验证配置 |

---

## 7. 当前文档问题诊断

| 旧 `02-概要设计.md` 内容 | 问题 | 本轮处理 |
|---|---|---|
| 配置线索与运行 / 监控 / 性能混写 | 容易把配置项清单提前写入概要设计 | 本步只写配置影响轮廓和禁止边界 |
| 没有显式禁止配置化边界 | 后续可能用配置绕过正文排除、状态机红线或 recovery 不分叉 | 补禁止配置化边界表 |
| 外部 adapter 配置可能被误解成编译期依赖 | 会打破唯一上游 `L0-core` 纪律 | 明确 adapter config 只影响运行时接缝 |
| projection / handoff 配置可能被误解成业务策略 | 会让派生或交接反写真相 | 明确它们只影响消费、传播和交接可见性 |

---

## 8. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §11 “配置影响轮廓”引用本文件 §3 的配置影响轮廓表。
- §11 摘录 §4 的禁止配置化边界表。
- §11 保留 §5 的配置影响轮廓图和 §6 的详细设计承接方向。
- 配置项清单、默认值、文件格式、环境变量、密钥名称和示例必须留给 `04-配置设计.md`。

---

## 9. 进入下一步条件

- 已明确哪些概要层结构受配置影响。
- 已明确 domain invariant、状态机红线、审计链、事务一致性、安全门禁、依赖类型和跨仓 truth 边界禁止配置化。
- 已明确配置实现契约交给 `03-详细设计.md` 和 `04-配置设计.md` 继续展开。
- 未写配置项清单、默认值、JSON 示例、环境变量或密钥名称。
- 可以进入 Step 12 “详细设计承接清单”。
