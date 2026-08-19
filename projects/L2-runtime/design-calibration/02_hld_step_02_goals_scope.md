# L2-runtime 02 概要 Step 2: 设计目标与当前范围

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `02-概要设计.md` 第 2 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 1 上游映射、不再回答 / 必须回答清单，正式 00 / 01 的能力与架构边界 |
| 目标 | 明确本轮概要设计需要收敛的结构、交付给 03 的结果和当前不进入范围的内容 |
| 禁止 | 功能需求复述、对象 / 接口提前定名、完整字段 / 函数 / schema、实施任务与排期 |

## 1. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 最主要要说清哪些结构？ | 八架构语境到主要组成部分 / 实现分层的映射；Runtime-owned truth / state / policy / projection / ref / history 对象骨架；Command / Query / Event / Job / port seam；七类关键处理流；运行与反馈状态机。 |
| 停在什么深度足以进入 03？ | 每个关键对象有类型化字段骨架、状态集合、成员 / 工厂函数骨架和禁止事项；每个接口有方向、输入 / 输出类型骨架和失败语义；每个 flow 有职责 / 关键函数数据流；每个 state 有合法 / 禁止迁移。完整 schema、实现和文件布局留给 03。 |
| 哪些属于范围？ | Runtime local semantics、local persistence responsibility、ports / adapters、safe projection / handoff、blocked / gap / unknown 分支，以及上游 pending seam 的 contract candidate 轮廓。 |
| 哪些相关但不进入？ | 外部 owner body / truth / backend、具体产品 / provider / language / framework / DB / queue / protocol、下游 UI / member lifecycle、完整公共 schema、配置 key / value 和测试证据。 |
| 哪些留给详细设计？ | 正式 type / trait / DTO 定义、完整函数签名与行为、文件布局、transaction / UoW、serialization、API / event schema、repository 实现、adapter implementation、错误映射、并发 / retry 算法。 |

## 2. 设计目标表

| 目标 | 说明 | 交付给详细设计的结果 |
|---|---|---|
| 收稳代码主体框架 | 将八架构语境转译成业务主要组成部分、inbound / application / domain / ports / persistence / projection 等实现分层 | 主要组成部分到实现单元的稳定映射和允许依赖方向 |
| 收稳关键对象轮廓 | 从 capability 和数据 owner 发现 Runtime truth / state / policy / ref / projection / history 对象 | 关键对象卡片、类型化字段骨架、状态集合、函数骨架、禁止事项 |
| 收稳接口骨架 | 识别 Runtime Command / Query / Inbound Event / Outbound Event / Job 以及外部 owner ports | 接口分类、输入 / 输出类型主语、失败 / degraded / blocked 语义和 contract status |
| 收稳关键处理流 | 覆盖 run 受理 / 推进、composition、model turn、action / delegation、feedback、checkpoint / recovery、outcome / handoff | 可展开为函数级详细设计的 flow 边界、关键步骤和 failure branch |
| 收稳状态模型 | 区分 run、decision、action、delegation、checkpoint / recovery、projection / handoff 状态和传播规则 | 状态 enum 候选、迁移矩阵、guard 与禁止迁移来源 |
| 收稳异常与边界轮廓 | 把 source missing、stale、conflict、unavailable、unknown side effect、late / duplicate、gap 映射到主体 | 异常分类、owner / retry / fail-closed 责任和 03 错误模型输入 |
| 收稳配置影响而不预支配置事实 | 识别 budget、availability、source precedence、adapter enablement、recovery / handoff behavior 的影响面 | 配置候选类别、禁止配置化红线和 04 承接提示 |
| 收稳 03 承接与 blocker | 明确哪些对象 / interface / flow / state 能进入详细设计，哪些必须 blocked | 可审计的详细设计承接清单、回退条件和上游依赖 |

## 3. 非范围表

| 非范围 | 留给哪一层 |
|---|---|
| 需求目标、用户故事、功能 / 规则和验收重新定义 | `00-需求文档.md` |
| 系统上下文、限界上下文、owner、依赖方向、技术路径重新取舍 | `01-架构设计.md` |
| Tools execution、capability registry、Method body、Governance truth、Sandbox isolation、Observability backend、Artifact / Evidence body | 对应相邻仓正式设计 |
| provider secret / route / quota / cost / billing 与 durable memory body / index / retention | provider / memory owner 正式设计 |
| 完整 struct / enum / trait / DTO、字段全集、函数实现、错误映射 | `03-详细设计.md` |
| 数据库表 / DDL、transaction / UoW、serialization、index、outbox 物理实现 | `03-详细设计.md` |
| HTTP / gRPC / UDS / event topic / payload 完整 schema | `03-详细设计.md` 与 owner contract |
| 配置 key、类型、默认值、来源优先级和动态生效 | `04-配置设计.md`；当前只识别影响轮廓 |
| 测试用例、测试环境、执行结果、report / evidence | `05-测试方案.md` 与真实执行阶段 |
| 验收 verdict、签署、readiness | `06-验收标准.md` 与真实验收流程 |
| 实现语言 / 框架、crate / package、文件目录、commit boundary、部署资源 | `03` / `07` / 实施仓；必须有正式 authority |
| member-service / images / marketplace / product UI 和下游消费实现 | 对应下游仓 / 产品层 |

## 4. 当前阶段设计深度口径

- 概要设计的最小完整单位是“主要组成部分 -> capability -> object / interface / flow / state -> failure / blocker -> 03 handoff”。
- 对象允许写稳定名称、类型类别、关键字段名称与类型、状态集合、成员 / 工厂函数名称和参数 / 返回类型骨架；不写完整 schema 或函数实现。
- 接口允许写分类、稳定操作名、输入 / 输出主类型和失败语义；owner contract pending 时必须标 `candidate / blocked`，不能固化公共协议。
- 处理流允许写参与主体、关键函数 / 数据主语、提交点和失败 / compensation posture；不写详细调用链和事务算法。
- 状态机允许写 state enum 候选、触发、guard、合法 / 禁止迁移和 late / duplicate / unknown 处理；不写持久化实现。
- 实现语言当前仍 `not_selected`；本轮使用语言中立的类型骨架，不以 Rust / Python 语法冒充技术决定。

## 5. 取舍与历史差异

选择“足以把语义结构交给 03、但不替 03 写完整合同”的深度，避免两种失真：只写模块说明会让详细设计重新发明对象 / flow / state；提前写完整 struct / API / transaction 又会在上游 seam 未闭口时伪造 contract。旧 02 以 ExecutionInstance / WorkItem / promote 为主要范围，当前改为五核心 Runtime 能力和三个支撑 / 投影语境，并把旧主语保留为 historical material。

## 6. 回填草稿

正式第 2 章回填第 2 节设计目标表、第 3 节非范围表和第 4 节设计深度口径。诊断与取舍留在 calibration；本章不画图、不列功能需求，也不提前列对象 / API 名。

## 7. 自检与门禁

| 检查 | 结果 |
|---|---|
| 目标是概要结构目标而非功能清单 | pass |
| 每个目标有明确 03 交付 | pass |
| 非范围均有明确 owner / 文档层 | pass |
| 深度覆盖对象 / 接口 / flow / state 骨架且未进入详细实现 | pass |
| pending seam 与语言未选择状态保留 | pass |
| 未提前创建 Step 3 文件或修改正式 02 | pass |

```text
gate_status = pass
next_allowed_action = create_02_hld_step_03_constraints
formal_02_write_allowed = false
future_step_files_allowed = false_until_step_03_start
```
