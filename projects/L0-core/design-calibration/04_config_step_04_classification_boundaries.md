# Step 4. 定义配置分类与禁止配置化边界

> 本文件是 `projects/L0-core/04-配置设计.md` 的 Step 4 中间产物。
> 本步定义 L0-core 的配置类别,并明确哪些安全、审计、事务、一致性和领域规则禁止配置化。
> 本步不定义来源优先级,不列完整配置项清单,不新增 `CoreRuntimeConfig` 字段,不改变 `03-详细设计.md` 中的代码契约。

---

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 4
- 回填章节：`projects/L0-core/04-配置设计.md` §4 配置分类与边界

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 3 配置控制面 | 配置来源链、runtime 装配入口、控制面总表、模块读取边界 | 把控制面归入配置类别 |
| `01-架构设计.md` §13 | 安全、审计、可观测、韧性、配置与变更控制等横切约束 | 提炼禁止配置化边界 |
| `02-概要设计.md` §4 | 契约真相、Definition / Use 分离、P0/P1 分离、published 不可原地修改等约束 | 固定领域不变量禁止配置化 |
| `03-详细设计.md` §3 / §10 | Domain 不依赖基础设施、外部 I/O 走 port、truth / audit / outbox 原子边界等实现约束 | 固定事务、一致性和安全红线禁止配置化 |

已确认结论:

```text
L0-core P0 没有在线 runtime container,因此 P0 配置默认不热更新。
配置分类用于组织后续配置项清单,不代表新增代码字段。
领域不变量、架构红线、审计链、事务一致性和数据所有权不得通过配置绕过。
```

---

## 3. SOP 问题回答

1. 当前系统有哪些启动配置、运行时配置、策略配置、敏感配置、调试配置?

   回答：启动配置包括配置文件路径、contract source root、release snapshot root、projection root、audit root、outbox root、idempotency root 等启动时装配所需配置。运行时装配配置包括 reference resolver、gate / blob adapter、event publisher boundary、toolchain runner boundary、clock / id / unit of work binding。策略配置包括 fail fast / fail closed 口径、reference resolver 允许边界、runner fake / real-like 模式等,但策略配置不得覆盖领域不变量。敏感配置在 P0 中只保留 secret ref / adapter-local sensitive binding 边界,raw secret 不进入普通配置。调试配置只允许控制本地日志级别、fake adapter、dry-run 类诊断行为,不得改变业务真相和发布结果。

2. 哪些配置允许热更新?

   回答：P0 不支持热更新。L0-core 当前没有在线 runtime container,CLI / job runtime 都按启动或作业启动时读取配置。将来 P2 可以讨论在线配置中心、admin override 或热更新,但必须独立设计校验、审计、回滚和不变量保护,不能直接继承 P0 配置项。

3. 哪些配置只能冷更新或启动读取?

   回答：所有 P0 配置均按冷更新或启动读取处理,包括各类 root path、reference resolver 配置、gate / blob adapter binding、event publisher boundary、toolchain runner binding、clock / id / unit of work binding、fake / real-like adapter 模式和日志 / 诊断配置。配置变化需要重新启动 CLI / job 或重新运行对应作业。

4. 哪些安全、审计、事务、一致性或领域规则禁止配置化?

   回答：契约范围判断、Definition / Use 分离、published 不可原地修改、publish 必须经过 approved gate、fingerprint 必须由 canonical 内容生成、发布成功必须写 audit 与 outbox、truth / audit / outbox 原子边界、audit 不得静默失败、outbox 与 truth 同事务、snapshot asset 与 metadata fingerprint 匹配、idempotency payload fingerprint 校验、外部正文不得吸收、凭据正文不得保存、gate / reference / blob 失败不得默认放行、L0-bus runtime 不由本仓实现,都禁止配置化。

5. 禁止配置化项如需改变应走什么流程?

   回答：禁止配置化项不能通过 env、config file、CLI flag 或 secret ref 直接改变。如需改变,必须回到对应上游设计层：需求边界变更回到 `00-需求文档.md`,架构边界变更回到 `01-架构设计.md`,对象 / trait / 事务 / 错误契约变更回到 `03-详细设计.md`,跨仓职责变更需要 ADR 或架构评审。配置设计只能记录风险或待确认事项,不能把它写成普通配置项。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `04-配置设计.md` §4 | 尚未存在配置分类和禁止配置化边界 | 后续配置项清单容易把领域规则误写成开关 |
| Step 3 控制面总表 | 已列控制面,但未区分启动、运行时装配、策略、敏感和调试配置 | Step 7 配置项清单缺少分类依据 |
| `01-架构设计.md` §13 | 横切约束是原则表达 | 需要转成“禁止配置化项”表 |
| `03-详细设计.md` §10 | 一致性规则已明确 | 需要防止这些规则被实现成可关闭开关 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置分类 | 只有控制面,没有类别 | 拆成启动配置、运行时装配配置、策略配置、敏感配置、调试配置和演进配置 | 为 Step 7 配置项清单提供分类依据 |
| 热更新口径 | 未明确 | P0 全部启动读取 / 作业启动读取,不支持热更新 | 当前没有在线 runtime container |
| 禁止配置化边界 | 散落在 00/01/02/03 | 集中列出领域、安全、审计、事务、一致性和跨仓职责红线 | 防止配置设计越界 |
| 改变方式 | 未说明 | 必须回到需求、架构、详细设计或 ADR / 架构评审 | 禁止用配置绕过正式设计流程 |
| 03 回写 | 未判断 | 本步只分类和划边界,不改变代码契约 | 无需回写 03 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：把所有策略都做成配置开关 | 灵活 | 容易绕过 gate、audit、fingerprint 和一致性红线 | 不采用 |
| 方案 B：P0 配置只控制 infra wiring 和运行环境差异,领域不变量禁止配置化 | 边界清晰,测试可控,保护契约真相 | 少量策略变化需要走设计变更 | 采用 |
| 方案 C：完全不允许策略配置 | 最保守 | reference resolver、fake / real-like runner、失败策略难以适配测试和环境差异 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 配置分类表

| 配置类别 | 说明 | 示例 | 是否允许热更新 | 主要风险 |
|---|---|---|---|---|
| 启动配置 | runtime 启动或 job 启动时必须确定的基础配置 | config file path、source root、snapshot root、projection root、audit root、outbox root、idempotency root | 否 | 错误路径会导致启动失败或写入错误目录 |
| 运行时装配配置 | 控制 infra ports / adapters 如何装配 | reference resolver、gate / blob adapter、event publisher boundary、toolchain runner binding、clock / id / UoW binding | 否 | 错误绑定会导致 fail closed、job 失败或 outbox pending |
| 策略配置 | 控制非领域不变量的环境差异和失败口径 | fake / real-like runner、reference resolver 边界、fail fast / fail closed 细节 | 否 | 如果越界,会变成绕过门禁或审计的开关 |
| 敏感配置 | 通过引用或 adapter-local binding 使用的敏感输入 | secret ref、publisher credential ref、future KMS / Vault ref | 否 | raw secret 泄露、日志泄露、审计正文污染 |
| 调试配置 | 只用于本地 / CI 诊断,不改变真相语义 | log level、dry-run 输出、fake adapter diagnostic mode | 否 | 被误用于跳过校验或改变发布结果 |
| 演进配置 | P2 后续可能引入的在线治理能力 | config center、admin override、hot reload、tenant / region profile | 待设计 | 未经审计的在线变更可能破坏主线 |

### 7.2 禁止配置化项表

| 禁止配置化项 | 原因 | 如需改变应走什么流程 |
|---|---|---|
| 关闭契约范围判断 | 会让非共享对象进入 L0-core 真相 | 修改 `00-需求文档.md` / `01-架构设计.md` 并评审 |
| 关闭 Definition / Use 分离 | 会把下游运行实例或使用真相写入本仓 | 架构设计变更 + 跨仓职责评审 |
| 允许 published 内容原地修改 | 会破坏 version、fingerprint 和下游消费稳定性 | 详细设计变更,改为新版本 / supersede 流程 |
| 跳过 approved gate 发布 | 会破坏发布门禁和正式依据 | 治理 / 架构评审 + 详细设计回写 |
| 关闭 canonical fingerprint 生成 / 对比 | 会破坏 drift、幂等、snapshot 和事件消费语义 | 详细设计变更 + 兼容性评审 |
| 关闭 audit 写入 | truth 成功但审计缺失会破坏追溯 | 不允许;如需改变审计模型必须回到 03 |
| 关闭 outbox 与 truth 同事务 | 已提交事实可能无法恢复发布 | 不允许;如需改变一致性模型必须回到 03 |
| 关闭 idempotency payload fingerprint 校验 | 同 key 不同 payload 可能被错误复用 | 不允许;回到 03 并重新评估错误模型 |
| gate / reference / blob 失败时默认放行 | 会在依赖不可用时发布不可信契约 | 安全评审 + 详细设计回写 |
| 保存 raw credential / token / secret | 违反数据所有权和安全边界 | 不允许;只能保存 secret ref 或外部引用 |
| 吸收标准、ADR、业务、运行、观测或归档正文 | 会破坏外部正文所有权边界 | 架构变更 + 数据归属评审 |
| 让 L0-core 实现 L0-bus runtime | 破坏 L0-core / L0-bus 边界 | 跨仓架构决策 / ADR |
| 让 SDK 高层重试、认证封装进入 L0-core | 破坏 L0-core / L0-sdk 边界 | 跨仓架构决策 / ADR |

### 7.3 配置分类到后续章节映射

| 配置类别 | 后续展开章节 | 说明 |
|---|---|---|
| 启动配置 | §5 / §6 / §7 / §9 | 定义来源优先级、profile、配置项和加载校验 |
| 运行时装配配置 | §7 / §9 / §11 | 定义 adapter 绑定、校验和失败策略 |
| 策略配置 | §4 / §7 / §11 | 只允许控制非领域不变量的环境差异 |
| 敏感配置 | §8 / §10 / §11 | 单独定义存储、读取、审计和失效策略 |
| 调试配置 | §6 / §7 / §12 | 只进入 local / CI profile 和测试承接 |
| 演进配置 | §13 / §14 | 作为迁移演进和待确认事项 |

---

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 配置均按启动读取 / 作业启动读取处理,不引入热更新 | 否 | 配置生效策略说明 | 无 | 无回写 |
| 配置分类不新增 `CoreRuntimeConfig` 字段 | 否 | 无代码契约变化 | 无 | 无回写 |
| 禁止配置化项均承接 00/01/02/03 既有红线 | 否 | 已有约束汇总 | 无 | 无回写 |
| 若后续要让某个禁止项变成配置开关 | 是 | 需求 / 架构 / 详细设计契约变化 | 待具体事项确定 | 阻塞待确认 |

说明:

- 本步自身无需回写 `03-详细设计.md`。
- 最后一行是规则性门禁: 只有未来试图把禁止项配置化时,才触发阻塞和回写。

---

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §4。

````md
## 4. 配置分类与边界

> 校准来源：
> - `design-calibration/04_config_step_04_classification_boundaries.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“配置分类表”“禁止配置化项表”“对详细设计的影响判定”和“待确认事项”小节，了解本章边界如何收敛。

L0-core 的 P0 配置默认按启动读取或作业启动读取处理。当前没有在线 runtime container,因此本轮不支持热更新。配置分类只用于组织配置控制面,不代表新增 `CoreRuntimeConfig` 字段。

本轮配置分为启动配置、运行时装配配置、策略配置、敏感配置、调试配置和演进配置。启动配置和运行时装配配置支撑 CLI / job runtime 正常启动;策略配置只允许控制环境差异和非领域不变量;敏感配置必须通过 secret ref 或 adapter-local binding 处理;调试配置只服务 local / CI 诊断;演进配置进入后续迁移和待确认事项。

配置不得绕过契约范围判断、Definition / Use 分离、已发布内容不可原地修改、approved gate、canonical fingerprint、audit、outbox、idempotency、外部正文所有权、凭据正文保护以及 L0-core / L0-bus / L0-sdk 职责边界。
````

---

## 10. 待确认事项

- 是否接受 P0 不支持热更新,所有 P0 配置均按启动读取或作业启动读取处理。
- 是否接受策略配置只能控制环境差异和失败口径,不得覆盖领域不变量。
- 是否接受“禁止配置化项”只能通过需求、架构、详细设计或 ADR / 架构评审改变。

---

## 11. 进入下一步条件

- [x] 用户确认配置分类表。
- [x] 用户确认禁止配置化项表。
- [x] 用户确认 P0 不支持热更新。
- [x] 用户确认本步无需回写 `03-详细设计.md`。
- [x] Step 4 状态从 `[~]` 更新为 `[x]`。
