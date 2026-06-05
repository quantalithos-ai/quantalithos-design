# Step 11. 配置影响轮廓

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 11
> 回填章节: `02-概要设计.md` §11 配置影响轮廓
> 生成日期: 2026-06-03
> 状态: 已完成

---

## 1. 本步目标

识别 `L1-work` 概要层结构中哪些主要组成部分、入口、adapter、job、worker 或外部接缝会受配置影响,并明确哪些边界禁止配置化。

本步不定义配置项清单、默认值、JSON 示例、环境变量名、密钥名称、完整 `RuntimeConfig` 字段或配置加载实现。

---

## 2. 配置影响轮廓表

| 主要部分 / 接缝 | 是否受配置影响 | 配置影响类型 | 交给详细设计展开 |
|---|---|---|---|
| Work 同步入口 / Command intake | 是 | 幂等保留期、请求大小上限、入口限流、metadata 校验策略 | command boundary config、idempotency config、validation config |
| Work 查询入口 | 是 | 读取超时、projection fallback、stale marker 返回策略、分页上限 | query config、read consistency config |
| Work 异步输入消费 | 是 | consumer 启停、批量大小、dedup 保留期、source allow-list | event consumer config、dedup config、source adapter config |
| Work 后台维护与派生 | 是 | job 调度、并发、重建窗口、失败重试、运行超时 | job config、scheduler config、retry policy |
| Work 真相存储承载 | 间接受配置影响 | 连接、事务超时、容量保护、迁移策略 | storage adapter config;不得改变 truth schema 语义 |
| 派生视图 / 对账承载 | 是 | projection backend、索引刷新、对账范围、重建隔离 | projection config、reconciliation config |
| 外部能力接缝 | 是 | identity / method / conversation / process / governance / artifact / runtime adapter endpoint、超时、降级 | adapter config、circuit breaker config |
| 事件协作 / outbox 发布 | 是 | publish batch、重试、dead letter、handoff topic mapping | outbox publisher config、bus adapter config |
| 追溯 / archive / observability 交接 | 是 | 交接目标、批量、保留、失败挂起策略 | handoff config、retention config |
| Derived consumption support | 是 | 投影启停、重建策略、stale 阈值、外围增强开关 | derived feature config;不得反写真相 |
| Local reference / snapshot support | 是 | 快照刷新间隔、过期阈值、来源优先级、旧快照保留 | reference refresh config |
| Domain model / policy | 只能通过注入参数间接受影响 | 策略参数可由 application 装配,但不可改变不变量 | policy parameter contract;禁止 domain 直接读配置 |

---

## 3. 禁止配置化边界表

| 禁止配置化边界 | 原因 | 若需改变应回到哪里 |
|---|---|---|
| Work truth 归属 | 配置不能把 Project / WorkItem / Iteration truth 转给 process、workspace、runtime 或 artifact | 需求 / 架构 / 概要边界重审 |
| 外部正文排除 | 配置不能允许保存 conversation、artifact、ImplementationPlan、runtime progress 等正文 | 数据归属与详细对象契约重审 |
| formalize / promote 显式边界 | 配置不能让 event 直接创建 WorkItem / child WorkItem | 概要 Step 7 / Step 8 回退 |
| ProjectMember / GlobalMember 分层 | 配置不能让 Work 接管 identity 生命周期 | 架构依赖和数据归属重审 |
| 状态机红线 | 配置不能允许 query、projection rebuild、process event 等迁移核心 truth 状态 | 概要 Step 9 回退 |
| 审计链与追溯要求 | 配置不能关闭核心变化 audit / trace | 横切关注点和验收重审 |
| 事务一致性 | 配置不能让 Project、Backlog、WorkItem、Iteration 形成部分真相 | 详细设计事务契约重审 |
| 安全 / 可见门禁 | 配置不能绕过 ActorContext、ProjectMember 可见边界或高风险治理前置 | 安全设计 / governance 协作重审 |
| 派生不反写 | 配置不能让 projection、board、reconciliation 修业务 truth | 概要 Step 5 / Step 10 回退 |
| 编译期依赖纪律 | 配置不能把 `L0-bus` 或其他 L1 / L2 / L3 仓变成 package dependency | 架构依赖裁剪重审 |

---

## 4. 配置影响轮廓图

```text
+====================== configuration impact =======================+
| RuntimeConfig / adapter config / job config                        |
|        |                                                           |
|        +--> inbound / query / event / job / adapter boundaries      |
|        +--> storage / projection / outbox / handoff adapters        |
|        +--> retry / timeout / batching / retention / stale policy   |
|                                                                    |
| Domain truth / invariants / state red lines / audit requirements    |
|        ^                                                           |
|        | configuration may inject parameters, but cannot redefine   |
+==================================================================+
```

关键说明:

- 配置主要作用于入口、adapter、job、运行承载、外部接缝和技术策略。
- Domain object、policy、状态机和审计链不得直接读取配置。
- 配置可以调整参数和启停外围能力,不能改变 truth 归属、正文排除、promote、派生不反写或依赖类型。
- 图不表达配置加载实现、JSON 示例、环境变量、密钥系统或部署挂载。

---

## 5. 交给详细设计展开的配置实现契约

| 方向 | 详细设计需要继续展开 |
|---|---|
| `RuntimeConfig` / config root | 根对象命名、加载来源、profile 合并、校验边界 |
| `ConfigLoader` / `ConfigValidator` | 加载顺序、错误分类、敏感值处理、启动失败口径 |
| Adapter config | identity、method、conversation、process、governance、artifact、runtime、bus、archive、observability 接缝配置 |
| Job config | projection rebuild、reference refresh、reconciliation、outbox publish、trace handoff、archive handoff 的调度和重试策略 |
| Idempotency / dedup config | key 保留、冲突处理、event dedup 保留和清理 |
| Projection / query config | stale 行为、fallback、索引刷新、读取超时和分页上限 |
| Config error | 配置缺失、非法、越界和禁止配置化违规的错误分类 |
| Runtime builder injection | application service、adapter、repository、job runner 如何接收已验证配置 |

---

## 6. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §11 “配置影响轮廓”引用本文件 §2 的配置影响轮廓表。
- §11 摘录 §3 的禁止配置化边界表。
- §11 保留 §4 图和 §5 详细设计承接方向。
- 配置项清单、默认值、文件格式和示例必须留给 `04-配置设计.md`。

---

## 7. 进入下一步条件

- 已明确哪些概要层结构受配置影响。
- 已明确 domain invariant、状态机红线、审计链、事务一致性、安全门禁和依赖类型禁止配置化。
- 已明确配置实现契约交给 `03-详细设计.md` 和 `04-配置设计.md` 继续展开。
- 未写配置项清单、默认值、JSON 示例、环境变量或密钥名称。
- 可以进入 Step 12 “详细设计承接清单”。
