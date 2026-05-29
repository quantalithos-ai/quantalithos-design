# Step 18. 风险与待确认事项

## 1. Step 状态

- 状态：[x] 已确认
- 所属文档：`projects/L0-bus/03-详细设计.md`
- 本步目标：收口详细设计阶段仍未关闭、会影响实现或实施交付的风险与待确认事项。
- 本步不直接修改正式 `03-详细设计.md`，只形成中间产物。
- 本步不重新讨论已经在 Step 1~17 中收敛的推荐方案，只记录仍需要实施前处理或后续确认的事项。

---

## 2. 本步输入

| 输入 | 关键结论 | 本步使用方式 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 18 | 必须输出风险表和待确认事项表 | 约束本文件结构 |
| `standards/document/详细设计书写规范.md` §5.17 | 不确定项必须显式记录；阻塞实现的事项必须标注阻塞范围 | 约束正式文档回填 |
| Step 1 `03_ddd_step_01_upstream_boundary.md` | 概要设计 §13 风险不得在前序 Step 写死 | 作为风险来源 |
| Step 2 `03_ddd_step_02_scope.md` | 生产 adapter、完整配置说明、运维部署、UI / SDK 等不进入本轮详细设计 | 判断哪些不是 P0 阻塞 |
| Step 3 `03_ddd_step_03_coding_runtime_constraints.md` | 目标实现仓、git config、源码语言、`core-contracts` 依赖需要实施前确认 | 形成实施风险 |
| Step 4~8 | crate、模块、port、协议、job、event 大部分已有推荐方案 | 区分已关闭决策和仍未关闭问题 |
| Step 9~13 | 处理流、状态、事务、错误、幂等已有 P0 口径，但 durable adapter 会带来后续风险 | 形成实现和演进风险 |
| Step 14 `03_ddd_step_14_config_dependencies.md` | 配置绑定点已定义，完整 `04-配置设计.md` 尚未存在 | 形成文档承接风险 |
| Step 15~16 | 可观测性和测试切口已定义，但完整测试 / 报告策略应由 `05-测试方案.md` 承接 | 形成测试承接风险 |
| Step 17 `03_ddd_step_17_implementation_handoff.md` | 正式 `03` 尚未 Step 19 重建，`07` 尚未创建 | 形成实施交付风险 |

---

## 3. SOP 问题回答

### 3.1 哪些问题仍可能影响代码实现？

仍会影响实现的问题分三类：

| 类型 | 问题 | 影响 |
|---|---|---|
| 正式文档收口 | Step 19 尚未重建正式 `03-详细设计.md` | 实现者不能直接按旧 `03` 开工 |
| 前置文档承接 | L0-bus 尚无 `04-配置设计.md`，当前只有 Step 14 配置绑定点 | config loader、runtime profile、JSON 示例和环境变量名需要后续文档补齐 |
| 实现环境 | `/home/aris/Projects/quantalithos-bus` 目标仓、`core-contracts` 本地 path dependency、git config 需要实施前确认 | 影响建仓、编译和提交 |
| P1 依赖 | production MQ / durable store / transport adapter 未选型 | 不阻塞 P0，但影响后续 adapter 实现 |
| 安全边界 | forbidden body / raw secret / backend private body 不能进入日志、审计、event、projection、evidence | 若测试和实现未强制，会阻塞交付 |
| 测试承接 | 当前 `05-测试方案.md` 可能需要在正式 `03` 重建后复核 | 测试门禁可能与新版详细设计不一致 |

### 3.2 哪些问题会阻塞实现，哪些只影响后续优化？

| 分类 | 事项 | 阻塞范围 |
|---|---|---|
| 阻塞正式实施交付 | Step 19 未完成正式 `03` 重建 | 阻塞把正式详细设计交给实现 agent |
| 阻塞目标仓开工 | 目标仓不存在、`core-contracts` path 不存在、git config 未确认 | 阻塞代码仓初始化和首笔提交 |
| 阻塞发布验收 | redaction / forbidden body 测试不能通过 | 阻塞 P0 验收 |
| 条件阻塞 | `04-配置设计.md` 未创建 | 不阻塞 Step 19；若 `07` 要实现 config loader / runtime profile，则应先补配置文档 |
| 不阻塞 P0 | production MQ / durable store / transport adapter 未选型 | 只影响 P1 生产 adapter |
| 不阻塞 P0 | 告警阈值、dashboard、运维 runbook 未定义 | 留给 observability / 运维文档 |

### 3.3 每个待确认事项需要谁确认？

| 事项类型 | 待确认方 |
|---|---|
| 正式 `03` 是否可交付实现 | 详细设计维护者 / 架构负责人 |
| 是否补 `04-配置设计.md` 后再写 `07` | 文档维护者 / 实施计划编写者 |
| production adapter 是否进入下一阶段 | 架构负责人 / 后续实现负责人 |
| HTTP / async runtime / persistence 具体框架 | 实施负责人，在不破坏 port 边界前提下确认 |
| redaction 自动检查是否进入 gate | 测试方案维护者 / 实施负责人 |
| `05-测试方案.md`、`06-验收标准.md` 是否需要按新版 `03` 复核 | 测试与验收文档维护者 |

### 3.4 未确认前实现者应该如何处理？

| 未确认项 | 实现者处理方式 |
|---|---|
| 正式 `03` 尚未重建 | 不按旧 `03` 开工；等待 Step 19，或明确以 Step 1~18 中间产物为临时依据 |
| `04-配置设计.md` 尚未创建 | 只按 Step 14 实现 config struct / loader / validator 的最小接口，不脑补完整 JSON 和环境变量 |
| production adapter 未确认 | 只实现 port、fake / in-memory adapter 和清晰扩展点 |
| 具体框架未确认 | 可以选择实现方案，但必须保持 `domain` 纯粹、`application` 依赖 port、`infra` 承接 adapter |
| redaction gate 未确认 | 先按 Step 15 / Step 16 实现自动检查入口，不能等人工 review 才发现泄漏 |
| 测试方案尚未复核 | 先覆盖 Step 16 最小切口，完整矩阵以后续 `05` 为准 |

---

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| 前序每个 Step 都有“待确认事项”，其中不少已经被后续 Step 采用推荐方案关闭 | 如果全部搬进 §17，会把已关闭决策重新变成风险 | 本步区分“已按当前方案关闭”和“仍未关闭” |
| Step 17 已说明正式 `03` 尚未重建 | 这是当前最关键的交付风险 | 本步明确它阻塞正式实施交付 |
| 配置绑定点已在 Step 14 定义，但 L0-bus 缺少 `04-配置设计.md` | 实施计划可能脑补 JSON、环境变量和部署填写方式 | 本步列为条件阻塞 |
| production adapter / durable store / MQ 未选型 | 容易被误认为 P0 必须做完 | 本步明确不阻塞 P0，只保留 port / adapter |
| redaction 和 forbidden body 是安全边界 | 若不作为风险记录，后续可能只靠人工 review | 本步列为 P0 验收阻塞风险 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 风险来源 | 分散在 Step 1~17 | 汇总为正式 §17 的风险表和待确认事项表 |
| 已关闭决策 | 与未关闭风险混在一起 | 单独列出，不再反复进入风险 |
| 阻塞范围 | 不清楚哪些会阻塞实现 | 标注阻塞正式交付、目标仓开工、P0 验收或只影响 P1 |
| 未确认前处理 | 多数只写推荐方案 | 明确实现者不能脑补，必须按保守口径处理 |
| 与 Step 19 关系 | 只是下一步 | 明确 Step 19 是正式交付实现前的必要收口 |

---

## 6. 设计取舍

### 6.1 是否把所有前序“待确认事项”原样搬进风险表

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：全部搬入 | 看似完整，但会把已关闭决策重新变成风险 | 不采用 |
| 方案 B：只保留仍影响实现或交付的事项，已关闭决策单独登记 | 推荐 |
| 方案 C：只写 Step 17 的未进入实施项 | 会漏掉安全、测试和 adapter 演进风险 | 不采用 |

推荐方案 B。Step 18 应收口风险，而不是制造重复讨论。

### 6.2 是否让 production adapter 未选型阻塞 P0

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：阻塞 P0，等 MQ / DB / transport 全部选型 | 会拖慢核心语义闭环 | 不采用 |
| 方案 B：P0 用 in-memory / fake 默认路径，生产 adapter 作为 P1 | 推荐 |
| 方案 C：删除 adapter 边界 | 后续无法平滑接入生产后端 | 不采用 |

推荐方案 B。它符合 Step 2、Step 4、Step 14 的一致口径。

### 6.3 是否在没有 `04-配置设计.md` 时继续 Step 19

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：阻塞 Step 19，先补完整 `04` | 会打断当前详细设计收口 | 不采用 |
| 方案 B：Step 19 正常整理正式 `03`，但 §17 标记 `04` 为进入 `07` 前的条件事项 | 推荐 |
| 方案 C：在 `03` 中直接写完整配置说明 | 越界到配置文档 | 不采用 |

推荐方案 B。详细设计只定义代码绑定点，配置文档负责完整 JSON、字段说明和部署填写方式。

---

## 7. 结构化中间产物

### 7.1 已按当前方案关闭的前序决策

| 决策 | 当前关闭口径 | 来源 |
|---|---|---|
| P0 默认 adapter 范围 | trait + in-memory / fake 默认可验证 adapter | Step 2 / Step 14 |
| `PublicationRejectedEvent` 是否进入协议 | 进入，rejected fact 是可观察接入事实 | Step 2 / Step 8 |
| Query 是否自动 rebuild projection | 不自动 rebuild，返回 consistency marker | Step 8 / Step 10 / Step 11 |
| backend capability 是否新增状态机 | 不新增 truth 状态机，只更新 view / audit / event | Step 2 / Step 10 |
| port trait 放置位置 | 放 `application`，`infra` 实现 | Step 5 / Step 7 |
| `BusStorePort` 是否给 application 直接使用 | 不给 application 暴露，业务 repository 是 application port | Step 7 / Step 11 |
| recovery command 幂等键 | 建议提供 header key，同时用目标唯一约束兜底 | Step 8 / Step 13 |
| Query audit | 只敏感 Query 和失败分支写 access audit | Step 9 / Step 15 |
| retry exhausted 是否自动 DLQ | 不自动；由 `MoveDeliveryToDeadLetter` 控制 | Step 9 / Step 10 |
| metrics 是否包含 record id | 不包含，只用低基数标签 | Step 15 |

### 7.2 风险表

| 风险 | 影响 | 缓解方式 | 负责人 / 待确认方 |
|---|---|---|---|
| 正式 `03-详细设计.md` 尚未 Step 19 重建 | 阻塞正式交付实现 agent；旧 `03` 不能作为实现依据 | 先完成 Step 19，删除旧 `03` 后按新标准重建 | 详细设计维护者 |
| `04-配置设计.md` 尚未存在 | 若 `07` 直接实现 config loader，可能脑补 JSON、环境变量和 profile | Step 19 后优先补配置设计，或在 `07` 中明确只实现 Step 14 绑定点 | 配置文档维护者 / 实施计划编写者 |
| `05-测试方案.md` 和 `06-验收标准.md` 可能未完全按新版 `03` 复核 | 测试门禁和验收标准可能与新详细设计漂移 | 正式 `03` 完成后复核 `05/06`，至少对齐 Step 16 测试切口 | 测试与验收文档维护者 |
| 目标实现仓可能尚未创建或结构未知 | 阻塞 workspace 创建、path dependency 和 git config 检查 | 在 `07` 前确认 `/home/aris/Projects/quantalithos-bus` 状态 | 实施负责人 |
| `core-contracts` 本地 path dependency 不存在或版本漂移 | 阻塞编译，或导致共享契约不一致 | 实施前确认 `/home/aris/Projects/quantalithos-core/crates/contracts` 可用，并记录版本 / commit | 实施负责人 / L0-core 负责人 |
| production MQ / durable store / transport adapter 未选型 | 不阻塞 P0，但会影响生产化和 P1 adapter | P0 只实现 port + in-memory / fake；P1 单独设计生产 adapter | 架构负责人 / 后续实现负责人 |
| 具体 HTTP / async runtime / persistence 框架未固定 | 实施时可能选择破坏模块边界的框架绑定方式 | 允许实现阶段选择，但必须保持 domain 纯粹、application 依赖 port、infra 负责 adapter | 实施负责人 |
| P0 后端 dispatch 在事务内调用是简化口径 | 后续 durable adapter 可能出现外部副作用与 truth 提交不一致 | P0 保持可测；生产 adapter 需要 outbox / dispatch evidence 专项再设计 | 架构负责人 / 后续实现负责人 |
| source ack failure、publisher failure、projection failure 的 evidence 细节不充分 | 恢复排障可能缺少足够材料 | P0 按 Step 11 / 12 / 15 写引用化 evidence；完整 durable evidence 由后续 adapter 扩展 | 实施负责人 |
| forbidden body / raw secret / backend private body 泄漏 | 阻塞安全验收和 P0 交付 | 必须实现 redaction check 和 Step 16 对应测试切口 | 实施负责人 / 测试负责人 |
| `07-实施计划.md` 复制详细设计内容 | 产生两套对象、函数、状态机和协议真相 | `07` 只引用正式 `03` 章节和中间产物，不重写契约 | 实施计划编写者 |
| 实现仓 commit message 或源码注释沿用 design 仓中文口径 | 提交和源码规范不合格 | 实施前检查 git config、英文 commit、英文 rustdoc / 注释 | 实施负责人 |

### 7.3 待确认事项表

| 事项 | 当前影响 | 需要谁确认 | 未确认前的处理方式 |
|---|---|---|---|
| Step 19 是否完成后再交付实现 agent | 影响实现输入是否正式 | 详细设计维护者 / 架构负责人 | 推荐必须先完成 Step 19；紧急情况下只能注明以 Step 1~18 中间产物为临时依据 |
| 是否在 `07-实施计划.md` 前补 `04-配置设计.md` | 影响 config loader、JSON 示例、环境变量和 profile 实施 | 文档维护者 / 实施计划编写者 | 推荐 Step 19 后补 `04`，至少不能在 `07` 中脑补完整配置 |
| `05-测试方案.md` 是否需要按 Step 16 重校准 | 影响测试门禁完整度 | 测试方案维护者 | 未确认前，实施只保证 Step 16 最小切口 |
| `06-验收标准.md` 是否需要按新版 `03` 重校准 | 影响最终验收是否覆盖新契约 | 验收标准维护者 | 未确认前，验收不得低于 Step 16 和 redaction 安全边界 |
| `/home/aris/Projects/quantalithos-bus` 是否已存在 | 影响实施方式和是否迁移已有代码 | 实施负责人 | 若不存在，由 `07` 明确建仓步骤；若存在，先审查现有结构 |
| `core-contracts` dependency 的 commit / version 如何固定 | 影响可复现构建 | L0-core 负责人 / 实施负责人 | 先使用 sibling path dependency，后续记录 core 当前 commit |
| P1 production adapter 何时设计 | 影响 MQ / durable store / transport 后续接入 | 架构负责人 | P0 不实现生产 adapter，只保留 port |
| 具体 HTTP / async runtime / persistence crate 选择 | 影响实现细节和依赖 | 实施负责人 | 选择必须写入 `07` 或实现说明，并不得破坏 ports and adapters |
| backend dispatch durable outbox 化何时推进 | 影响生产环境一致性 | 架构负责人 / 后续实现负责人 | P0 保持 in-memory 简化；生产化前单独设计 |
| redaction check 脚本是否作为 CI gate 强制执行 | 影响安全验证自动化 | 测试方案维护者 / 实施负责人 | 推荐强制执行；未确认前至少实现脚本入口和最小测试 |

### 7.4 阻塞级别汇总

| 级别 | 事项 | 处理 |
|---|---|---|
| 必须先完成 | Step 19 正式 `03` 重建 | 完成后才能正式交付实现 agent |
| 开工前必须确认 | 目标仓、git config、`core-contracts` path | 写入 `07` 前置检查 |
| P0 验收必须通过 | redaction、forbidden body、Step 16 最小测试切口 | 写入测试 / 验收门禁 |
| 建议在 `07` 前完成 | `04-配置设计.md`、`05/06` 对齐复核 | 避免实施计划脑补配置和测试 |
| 不阻塞 P0 | production adapter、dashboard、告警阈值、长期观测产品 | P1 / 后续专项 |

---

## 8. 回填草稿

正式 `03-详细设计.md` 的 §17 按以下方式回填：

```md
## 17. 风险与待确认事项

### 17.1 已按当前方案关闭的前序决策

从 `design-calibration/03_ddd_step_18_risks_open_questions.md` §7.1 摘录。

### 17.2 风险表

从 `design-calibration/03_ddd_step_18_risks_open_questions.md` §7.2 摘录。

### 17.3 待确认事项表

从 `design-calibration/03_ddd_step_18_risks_open_questions.md` §7.3 摘录。

### 17.4 阻塞级别汇总

从 `design-calibration/03_ddd_step_18_risks_open_questions.md` §7.4 摘录。
```

说明：

- §17 不重开已经在前序 Step 中关闭的设计决策。
- §17 必须明确哪些事项阻塞正式实施交付，哪些只影响 P1 或运维专项。
- Step 19 整理正式文档时，必须保留这些风险和待确认事项，不能把它们改写成默认实现事实。

---

## 9. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| Step 18 是否重新讨论所有前序待确认项 | A. 全部重开；B. 只保留仍未关闭或影响实施的事项；C. 全部删除 | 推荐 B | 避免重复讨论，同时保留真实风险 |
| 是否把缺少 `04-配置设计.md` 作为 Step 19 阻塞项 | A. 阻塞 Step 19；B. 不阻塞 Step 19，但阻塞完整 `07` 之前的配置细节实施；C. 忽略 | 推荐 B | 详细设计可先收口，配置文档后续补齐 |
| production adapter 未选型是否阻塞 P0 | A. 阻塞；B. 不阻塞，P0 用 in-memory / fake；C. 删除 adapter 边界 | 推荐 B | P0 目标是核心语义闭环 |
| 是否允许实现 agent 直接读旧 `03` | A. 允许；B. 不允许；C. 只读旧 `03` 的参考章节 | 推荐 B | 旧 `03` 与新版主线不一致 |
| `05/06` 是否必须在 `07` 前复核 | A. 必须；B. 建议但不阻塞；C. 不需要 | 推荐 A | 测试和验收必须承接新版详细设计 |

---

## 10. 进入下一步条件

```text
所有未关闭事项都有记录、影响范围和未确认前处理方式。
已关闭的前序决策不会被重新误写成风险。
阻塞正式实施交付、开工前检查、P0 验收和 P1 后续事项已经分级。
可以进入 Step 19，整理正式详细设计文档。
```
