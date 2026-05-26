# Step 2. 明确本轮实现范围和非范围

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 2
- 回填章节：`03-详细设计.md` §2 本次详细设计目标与范围

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 1 上游边界 | 已确认 `03` 直接承接 `00` / `01` / `02` 与概要设计 §11 / §12 |
| `02-概要设计.md` §2 | 已明确概要设计目标、非范围和设计深度口径 |
| `02-概要设计.md` §11 | 已明确详细设计承接清单 |
| `02-概要设计.md` §12 | 已明确风险与待确认事项 |
| `00-需求文档.md` §3.1.1 | 已明确 P0 最小闭环和 P1 后置边界 |

已确认结论：

```text
本轮详细设计优先覆盖 P0 方法定义发布、版本治理、下游同步、查询解析和恢复运维闭环。
P1 MethodPlugin / MethodConfiguration 只保留边界、对象位置和后续承接提示,不作为 P0 实现前置。
```

依赖的前序 Step：

```text
Step 1 已确认详细设计输入边界。
```

---

## 3. SOP 问题回答

1. 本轮详细设计必须覆盖哪些模块？

   回答：必须覆盖 P0 发布同步闭环相关模块，包括 inbound command / query / operations 入口、application services、domain model / policies、ports、persistence / projection / outbound adapters。具体业务范围覆盖方法定义生命周期与发布治理、方法定义真相与规则、关系校验与边界保护、定义同步与快照供给、查询解析与审计追溯、基线初始化与恢复运维。

2. 本轮必须定义哪些对象、接口、事件、job 和状态机？

   回答：必须定义 `MethodContent`、7 类 P0 definition subtype、生命周期 / 版本 / fingerprint / reference 等 value object、audit / outbox / snapshot / projection 对象；必须定义 P0 Command、关键 Query、Outbound Event、Operations Job 和可选 Gate Consumer 的协议契约；必须定义 `MethodContentLifecycle` 与 `OutboxEventStatus` 状态机。

3. 哪些能力属于 P1 / 后续阶段，不应在本轮展开？

   回答：`MethodPlugin`、`MethodConfiguration`、plugin dependency DAG、variability application、marketplace package distribution、work 直接消费 `TaskDefinition` 作为 WorkItem 模板、复杂 ViewProfile 优先级 / preset / override 均不进入本轮 P0 详细设计主线。

4. 哪些内容属于测试方案、实施计划、配置设计或运维手册？

   回答：测试矩阵、测试数据和验收证据属于 `05-测试方案.md` / `06-验收标准.md`；开发批次、任务拆分、提交顺序和阅读清单属于 `07-实施计划.md`；部署参数、运行手册、批量 job 运维审批和告警细节属于配置设计或运维手册。

5. 实现者拿到本文后，应能完成哪些代码范围？

   回答：实现者应能完成 P0 crate / module / file tree、P0 struct / enum / value object、service / policy / trait / repository / adapter 契约、P0 command/query/event/job schema、逐接口函数级处理流、状态转换矩阵、持久化事务一致性、错误模型、并发幂等、可观测性和最小测试切口。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `03-详细设计.md` §2 | 尚未按 P0 / P1 明确本轮实现范围 | 详细设计可能把 P1 能力写成 P0 实现前置 |
| `03-详细设计.md` 全文 | 旧详细设计可能按对象和能力堆叠,没有先划定本轮实现边界 | 后续模块实现契约容易膨胀 |
| `02-概要设计.md` §11 | 承接清单覆盖面较广,需要在 03 Step 2 中转为本轮范围 | 03 可能不知道哪些“继续展开”是 P0 必须展开,哪些只是后续提示 |
| `02-概要设计.md` §12 | P1、work、ViewProfile、snapshot schema 等待确认项需要在 03 入口挂起 | 未挂起会造成详细设计越界 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 范围表达 | 只知道 03 要承接 02 的所有实现契约 | 明确本轮 03 主线是 P0 方法定义发布同步闭环 | 防止详细设计过宽 |
| P1 表达 | P1 对象在概要设计中有位置,但容易被误读为本轮完整实现 | P1 仅保留边界、对象位置和风险提示,不展开完整协议 / 算法 / 处理流 | 保持 P0 / P1 分离 |
| 下游 work | `TaskDefinition` 是否供 work 直接消费仍待确认 | 本轮只确认 process 为 P0 下游,work 直接消费挂起 | 避免提前固化 L1-work 边界 |
| ViewProfile | 已确认服务端解析,但复杂优先级未确认 | P0 只写 role + object_kind + scope 与受控未匹配返回 | 避免把 UI 产品语义写死 |
| 实施内容 | 可能混入测试方案、实施计划和运维细节 | 本轮只写代码实现契约,其他内容回到对应文档 | 保持详细设计边界 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 本轮详细设计覆盖 P0 + P1 全量能力 | 一次性完整 | 范围过大,会拖慢 P0 发布同步闭环,且 P1 仍有未确认项 | 不采用 |
| 本轮只写 P0 最小闭环,完全不提 P1 | P0 边界很清楚 | 后续实现者可能不知道 P1 对象为何在概要设计出现 | 不采用 |
| 本轮完整展开 P0,对 P1 只保留边界和后续承接提示 | 既能支撑首批实现,又不丢失后续演进位置 | 需要在每个相关章节持续标注 P1 不阻塞 P0 | 采用 |

---

## 7. 结构化中间产物

### 7.1 本轮详细设计目标表

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| 定义 P0 实现单元 | 把概要设计的业务组成部分和实现分层落到 crate / module / file tree | 实现者知道创建哪些模块和文件 |
| 定义 P0 对象契约 | 展开 `MethodContent`、7 类 P0 subtype、value object、record、DTO、projection | 实现者知道 struct / enum / value object 的字段、函数和注释 |
| 定义 P0 port / adapter 契约 | 展开 repository、unit of work、audit、outbox、gate、blob、event publisher、projection port | 实现者知道 trait 签名、错误类型和依赖方向 |
| 定义 P0 协议契约 | 展开 Command / Query / Event / Job 的请求、响应、JSON 或 proto schema | 实现者知道外部接口和内部协议如何实现 |
| 定义 P0 函数级处理流 | 为关键 Command、Query、Event Consumer、Operations Job 写出函数调用链 | 实现者知道 service / domain / repository / outbox 的调用顺序 |
| 定义 P0 状态与一致性 | 展开 lifecycle、outbox status、事务边界、幂等、并发和错误恢复 | 实现者知道状态迁移、事务边界和异常分支 |
| 定义 P0 最小测试切口 | 从实现契约中抽出 domain、service、repository、API、event、job 的最小验证点 | 实现者知道首批测试覆盖什么 |

### 7.2 本轮范围总表

| 范围项 | 本轮是否展开 | 展开深度 | 备注 |
|---|---|---|---|
| 7 类 P0 MethodContent | 是 | 完整 struct / enum / field / function / validation contract | `Qualification` 等 7 类 |
| MethodContent 发布生命周期 | 是 | 状态枚举、转换矩阵、非法转换错误 | draft / in_review / published / deprecated / retired / superseded |
| 发布治理与 gate ref | 是 | Command schema、service flow、audit / outbox 同事务 | 不实现 governance enforce |
| fingerprint / snapshot / outbox | 是 | value object、event schema、snapshot schema、relay / replay flow | 下游最终一致基础 |
| Query / ResolveViewProfile / Trace / CompareFingerprint | 是 | Query schema、projection / fallback、函数级处理流 | ViewProfile 复杂优先级后置 |
| Operations Job | 是 | seed / replay / rebuild / recalculate 的 input / output 和处理流 | 运维权限门禁细节挂起 |
| P1 MethodPlugin / MethodConfiguration | 边界保留 | 只写对象位置、状态边界、后续章节占位和风险 | 不阻塞 P0 |
| work 直接消费 TaskDefinition | 否 | 进入待确认事项 | 待 `L1-work` 校准 |
| Marketplace package distribution | 否 | 进入非范围 | 属于 L6-marketplace / P1 |

### 7.3 非范围表

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 用户故事、功能需求、验收指标重写 | `00-需求文档.md` |
| 系统上下文、架构选型、跨仓边界重新论证 | `01-架构设计.md` / ADR |
| 业务主要组成部分和代码主体主语重写 | `02-概要设计.md` |
| P1 Plugin dependency DAG / Variability 完整算法 | P1 后续详细设计 |
| Marketplace listing / transaction / install record | `L6-marketplace` |
| `TaskDefinition` 作为 WorkItem 模板的直接消费契约 | `L1-work` 校准后再决定 |
| ViewProfile 默认 deny 的 UI 文案和复杂优先级 | UI / console 校准或 P1 ViewProfile 设计 |
| governance policy enforce 执行与裁决结果 | `L3-governance` / runtime |
| 下游 Use truth 和运行实例 | identity / process / work / artifact / capability-hub |
| 完整测试矩阵和验收证据 | `05-测试方案.md` / `06-验收标准.md` |
| 开发批次、任务拆分、提交计划 | `07-实施计划.md` |
| 部署、告警、运维 runbook | 配置设计 / 运维手册 |

### 7.4 范围边界图

```text
本轮 03-详细设计
|
+-- P0 完整展开
|   |
|   +-- 7 类 MethodContent 定义真相
|   +-- draft / review / publish / retire / supersede
|   +-- fingerprint / version / audit / outbox
|   +-- event / snapshot / replay / rebuild
|   +-- query / trace / ResolveViewProfile / CompareFingerprint
|   +-- state / tx / error / idempotency / test cut
|
+-- P1 只保留边界
|   |
|   +-- MethodPlugin
|   +-- MethodConfiguration
|   +-- dependency DAG / variability
|
+-- 明确不展开
    |
    +-- marketplace 交易和安装
    +-- work 直接消费 TaskDefinition
    +-- 下游 Use truth / runtime instance
    +-- UI 文案和复杂视图优先级
```

关键说明：

- 图中 `P0 完整展开` 是本轮详细设计的代码实现契约主线。
- 图中 `P1 只保留边界` 表示后续可继续设计,但不作为本轮实现前置。
- 图中 `明确不展开` 的内容不得在本轮正式详细设计中被写成代码契约。

---

## 8. 回填草稿

可直接回填到 `03-详细设计.md` 的起草文字：

```md
## 2. 本次详细设计目标与范围

本轮详细设计以 P0 方法定义发布同步闭环为实现主线。本文完整展开 7 类 P0 MethodContent 的对象、接口、事件、job、处理流、状态机、持久化、错误、幂等、可观测性和测试切口。

本文覆盖：

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| 定义 P0 实现单元 | 把概要设计的业务组成部分和实现分层落到 crate / module / file tree | 实现者知道创建哪些模块和文件 |
| 定义 P0 对象契约 | 展开 MethodContent、7 类 P0 subtype、value object、record、DTO、projection | 实现者知道 struct / enum / value object 的字段、函数和注释 |
| 定义 P0 port / adapter 契约 | 展开 repository、unit of work、audit、outbox、gate、blob、event publisher、projection port | 实现者知道 trait 签名、错误类型和依赖方向 |
| 定义 P0 协议契约 | 展开 Command / Query / Event / Job 的请求、响应、JSON 或 proto schema | 实现者知道外部接口和内部协议如何实现 |
| 定义 P0 函数级处理流 | 为关键 Command、Query、Event Consumer、Operations Job 写出函数调用链 | 实现者知道 service / domain / repository / outbox 的调用顺序 |
| 定义 P0 状态与一致性 | 展开 lifecycle、outbox status、事务边界、幂等、并发和错误恢复 | 实现者知道状态迁移、事务边界和异常分支 |

本文不覆盖：

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 用户故事、功能需求、验收指标重写 | 00-需求文档.md |
| 系统上下文、架构选型、跨仓边界重新论证 | 01-架构设计.md / ADR |
| 业务主要组成部分和代码主体主语重写 | 02-概要设计.md |
| P1 Plugin dependency DAG / Variability 完整算法 | P1 后续详细设计 |
| Marketplace listing / transaction / install record | L6-marketplace |
| TaskDefinition 作为 WorkItem 模板的直接消费契约 | L1-work 校准后再决定 |
| ViewProfile 默认 deny 的 UI 文案和复杂优先级 | UI / console 校准或 P1 ViewProfile 设计 |
| governance policy enforce 执行与裁决结果 | L3-governance / runtime |
| 下游 Use truth 和运行实例 | identity / process / work / artifact / capability-hub |
| 完整测试矩阵和验收证据 | 05-测试方案.md / 06-验收标准.md |
| 开发批次、任务拆分、提交计划 | 07-实施计划.md |
| 部署、告警、运维 runbook | 配置设计 / 运维手册 |

P1 MethodPlugin / MethodConfiguration 在本文中只保留边界、对象位置和后续承接提示，不作为 P0 实现前置。
```

---

## 9. 待确认事项

无。

---

## 10. 进入下一步条件

- 本轮 P0 完整展开范围已经确认。
- P1 与跨仓待确认项已经明确挂起。
- 非范围已经能阻止详细设计越界。
- 用户已确认 Step 2,可以进入 Step 3 收稳编码规范、语言 / runtime、仓库约束。
