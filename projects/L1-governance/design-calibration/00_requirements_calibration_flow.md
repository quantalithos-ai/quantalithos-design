# L1-governance 需求文档校准工作台

> 对应文档: `projects/L1-governance/00-需求文档.md`
> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md`
> 创建日期: 2026-06-06
> 当前目标: 按最新需求 SOP 校准 `L1-governance`,并允许它依赖已经稳定的 `L0-core`、`L0-bus`、`L0-sdk`、`L1-identity`、`L1-conversation`、`L1-work`、`L1-process` 和 `L3-method-library` 结论。

---

## 1. 本轮校准原则

- `L1-governance` 可以依赖已经稳定的 `L0-core`、`L0-bus`、`L0-sdk`、`L1-identity`、`L1-conversation`、`L1-work`、`L1-process` 和 `L3-method-library` 设计结论,不重新定义共享契约、事件协作、SDK 接入、actor / member、对话事实、项目工作事实、过程执行事实或方法定义。
- `L1-governance` 是治理决策与治理控制真相仓,不是 process waiting state 仓、work 项目工作事实仓、artifact 正文仓、conversation 显示仓、identity 成员真相仓、runtime 执行仓、method-library 定义仓、observability 审计存储仓或 workspace 视图仓。
- 旧 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`05-测试方案.md`、`06-验收标准.md` 只能作为旧事实和问题诊断输入,不能直接视为新版需求基线。
- 旧 `domain/governance/README.md` 是重要历史领域输入和不变量线索,但它包含大量详细设计、字段、状态机、RPC 和实现倾向,不能高于新版 SOP 和已完成上游正式文档。
- 旧文档中的 `Rust + PostgreSQL`、Policy DSL 选型、AIIA 自动化、性能数字和覆盖率数字只作为历史候选输入;需求阶段不确认实现技术栈或测试指标。
- 本轮先按 Step 逐个生成中间产物,最后在 Step 17 删除旧 `00-需求文档.md` 并按新文件标准重建正式需求文档。
- 每个 Step 必须独立落盘、独立更新本文状态,不合并 Step。

---

## 2. 稳定上游与可参考对象

| 对象 | 当前状态 | 本轮使用方式 |
|---|---|---|
| `L0-core` | 已完成 `00`~`07` 深度校准 | 作为直接稳定上游,承接共享 ID、ActorRef、TraceContext、Error、CloudEvents、metadata、配置和 evidence 口径 |
| `L0-bus` | 已完成 `00`~`07` 深度校准 | 作为事件协作上游,承接发布、订阅、ack、retry、dead-letter、replay 和报告证据口径 |
| `L0-sdk` | 已完成 `00`~`07` 深度校准 | 作为 L5/L6 与外部调用方访问 governance 能力的默认封装边界输入 |
| `L1-identity` | 已完成深度校准 | 作为 GlobalMember、actor、角色和成员生命周期来源 |
| `L1-conversation` | 已完成 `00`~`07` 深度校准 | 作为 Gate / Policy / review 等治理事实在对话中的显化和可见性边界来源 |
| `L1-work` | 已完成 `00`~`07` 深度校准 | 作为 Project、ProjectMember、Backlog、WorkItem、Iteration 等治理触发或治理约束对象的相邻真相来源 |
| `L1-process` | 已完成 `00`~`07` 深度校准 | 作为 waiting gate、Activity、ProcessInstance 和过程暂停 / 恢复意图的相邻真相来源 |
| `L3-method-library` | 已完成深度校准 | 作为方法、流程、角色、工作产品和 AIPolicyDef 等定义真相来源 |
| `product/最终目的.md` | 产品叙事上游 | 承接关键节点强制人类、可审计、可追溯和 AI 自主性受控的产品动机 |
| `product/六域模型.md` | 领域模型上游 | 承接 Governance 是六域之一、回答“关键决策由谁定”的领域位置 |
| `architecture/仓库拆分方案.md` | 全局分层上游 | 承接 `quantalithos-governance` 在 L1 六域服务层的位置和相邻仓关系 |
| `architecture/架构设计.md` | 全局架构上游 | 承接 governance 与 identity、conversation、work、process、artifact、runtime、workspace 等仓的架构协作位置 |
| `architecture/标准对齐全景图.md` | 标准对齐输入 | 作为 ISO 42001、ISO 9001、ISO 24748-2 等合规语义的全局定位线索 |
| `methodology/standards-discussion/ISO-42001.md` | 方法论 / 标准讨论输入 | 作为 AIMS、Control、AIIA、SoA 和治理体系要求的候选语义输入 |
| `methodology/standards-discussion/ISO-9001.md` | 方法论 / 标准讨论输入 | 作为 Nonconformity、corrective action、PDCA 和管理评审的候选语义输入 |
| `methodology/standards-discussion/ISO-IEC-IEEE-24748-2.md` | 方法论 / 标准讨论输入 | 作为 Decision Gate 与 conformance 的候选语义输入 |
| `domain/governance/README.md` | 旧治理域详细设计 | 作为 Gate、Policy、Control、AIIA、SoA、Nonconformity、Approval、不变量和历史边界线索 |
| 旧 `L1-governance` 文档 | 未按最新 SOP 校准 | 作为旧口径诊断和可迁移事实来源 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 依赖裁剪基线 | 承接总依赖关系,并在 Step 6 / Step 12 裁剪出 `L1-governance` 自己的部分 |

---

## 3. Step 状态表

| Step | 主题 | 状态 | 中间产物 |
|---|---|---|---|
| Step 1 | 与上游文档的关系声明 | 已完成 | `design-calibration/00_req_step_01_upstream_relation.md` |
| Step 2 | 本仓定位与边界 | 已完成 | `design-calibration/00_req_step_02_position_boundary.md` |
| Step 3 | 背景与问题定义 | 已完成 | `design-calibration/00_req_step_03_problem_context.md` |
| Step 4 | 目标与非目标 | 已完成 | `design-calibration/00_req_step_04_goals_non_goals.md` |
| Step 5 | 用户与角色 | 已完成 | `design-calibration/00_req_step_05_users_roles.md` |
| Step 6 | 使用方与依赖 | 已完成 | `design-calibration/00_req_step_06_consumers_dependencies.md` |
| Step 7 | 核心能力闭环 | 已完成 | `design-calibration/00_req_step_07_core_capability_loop.md` |
| Step 8 | 用户故事 | 已完成 | `design-calibration/00_req_step_08_user_stories.md` |
| Step 9 | 功能需求 | 已完成 | `design-calibration/00_req_step_09_functional_requirements.md` |
| Step 10 | 业务规则与边界约束 | 待开始 | `design-calibration/00_req_step_10_business_rules_boundaries.md` |
| Step 11 | 数据需求与数据归属 | 待开始 | `design-calibration/00_req_step_11_data_ownership.md` |
| Step 12 | 接口与依赖 | 待开始 | `design-calibration/00_req_step_12_interfaces_dependencies.md` |
| Step 13 | 非功能需求 | 待开始 | `design-calibration/00_req_step_13_non_functional_requirements.md` |
| Step 14 | 验收标准 | 待开始 | `design-calibration/00_req_step_14_acceptance_criteria.md` |
| Step 15 | 风险与待确认事项 | 待开始 | `design-calibration/00_req_step_15_risks_open_questions.md` |
| Step 16 | 需求追溯矩阵 | 待开始 | `design-calibration/00_req_step_16_traceability_matrix.md` |
| Step 17 | 正式整理为 `00-需求文档.md` | 待开始 | `../00-需求文档.md` |

---

## 4. 当前已收敛的关键决策

| 编号 | 问题 | 本轮结论 |
|---|---|---|
| D-001 | 是否从旧版 `00-需求文档.md` 直接局部修补 | 否。旧文档作为输入,正式文档在 Step 17 删除旧文件后按新文件标准重建。 |
| D-002 | `domain/governance/README.md` 是否作为新版需求权威直接继承 | 否。它是历史领域输入和不变量线索,不高于新版 SOP 与已完成上游正式文档。 |
| D-003 | 旧 `README.md` 的 `Rust + PostgreSQL` 是否进入需求基线 | 否。技术栈和存储实现后移到架构、详细设计和实施计划重新裁剪。 |
| D-004 | `L1-governance` 是否重新定义 core / bus / SDK 共享能力 | 否。只引用已稳定基础契约和事件协作口径。 |
| D-005 | `L1-governance` 是否拥有 process waiting state | 否。Process 拥有 waiting gate / pause context 等过程等待状态;governance 拥有 Gate / Policy / approval / decision truth。 |
| D-006 | `L1-governance` 是否拥有 work 项目工作事实 | 否。Work 拥有 Project / Backlog / WorkItem / Iteration;governance 只引用它们作为治理对象、触发来源或约束对象。 |
| D-007 | `L1-governance` 是否拥有 artifact 正文或 evidence 正文 | 否。Artifact 拥有正文、版本、baseline 和 evidence body;governance 只保存治理结论、适用性、引用和必要摘要。 |
| D-008 | `L1-governance` 是否重新定义 method-library 的定义真相 | 否。Method-library 拥有方法、流程、角色、工作产品和 AIPolicyDef 等定义正文;governance 消费或同步定义,并拥有治理运行 / 执行侧结论。 |
| D-009 | `L1-governance` 的一句话定位 | `L1-governance` 是治理决策与治理控制真相仓,负责把 Gate、Policy、Approval / Decision、Control、AIIA、SoA 和 Nonconformity 收束为可审计、可追溯、可被相邻仓消费的治理事实。 |
| D-010 | Gate 的 Step 2 口径 | Gate 是关键节点治理裁决事实,不是 UI 卡片、流程等待状态或任务状态字段。 |
| D-011 | Policy 的 Step 2 口径 | Policy 是治理策略生效、授权和优先级事实,不是 runtime cache、DSL 引擎或工具白名单本身。 |
| D-012 | AIIA / SoA 的 Step 2 口径 | AIIA / SoA 是治理生命周期、适用性、覆盖和批准结论,不是 artifact 正文或标准方法论正文。 |
| D-013 | Nonconformity 的 Step 2 口径 | Nonconformity 是不符合与纠正闭环事实,不是普通 bug、work blocker 或 observability alert。 |
| D-014 | capability-hub / runtime 边界 | Governance 拥有 Policy 生效和治理授权事实;runtime / capability-hub 拥有缓存、能力注册、工具适配和执行判定事实。 |
| D-015 | Step 3 的问题主线 | 问题主线收敛为“治理事实缺少统一需求收束”,不把 ISO 42001 实现、Gate 六段式、Policy DSL、P95、容量或覆盖率写成背景问题。 |
| D-016 | Step 3 的问题集合 | 核心问题是治理事实未统一、治理结论与相邻仓状态混淆、合规对象正文 / 标准语义 / 治理结论混写。 |
| D-017 | 旧量化指标口径 | `RaiseGate P95`、`DecideGate P95`、`GetApplicablePolicies P95`、Policy 下发时延、`200w Gate / 1000w Policy` 和覆盖率后移到 Step 13 / Step 14 评估。 |
| D-018 | Step 4 的目标口径 | 目标收敛为治理事实边界、Gate / Approval / Decision、Policy 生效与授权、Control / AIIA / SoA 治理结论、Nonconformity 纠正闭环和相邻仓协作边界。 |
| D-019 | Step 4 的非目标口径 | 非目标覆盖 process、work、artifact、conversation、identity、method-library、runtime、member-service、capability-hub、observability、workspace、console、外部 GRC、性能容量指标和详细设计项。 |
| D-020 | Step 4 的后移口径 | Gate 六段式、SoA 38 控制项、Policy DSL、P95、Policy 下发、容量、覆盖率、具体状态机、RPC、事件名、字段和持久化后移后续 Step 或设计阶段。 |
| D-021 | Step 5 的角色口径 | 角色收敛为治理负责人 / 组织管理员、Gate 决策人 / Approver、Policy / Control 责任人、AIIA / SoA 评审人、Nonconformity 处置责任人、审计者 / 合规查看者、项目 / 领域负责人、AI member / 自动化执行者、治理系统 actor 和运维 / 后台任务。 |
| D-022 | Step 5 的权限矩阵口径 | 本步不保留旧权限矩阵,只记录角色与接触场景;Gate 决策、Policy / Control、AIIA / SoA、Nonconformity、审计和维护差异后移故事、功能、规则、数据、接口和验收章节。 |
| D-023 | Step 5 的相邻仓口径 | runtime、process、work、artifact、conversation、identity、method-library、observability、workspace 等不写成角色,后移 Step 6 使用方与依赖和 Step 12 接口与依赖裁剪。 |
| D-024 | Step 6 的编译期依赖口径 | `L1-governance` 的唯一编译期依赖是 `L0-core`;`L0-bus` 是事件协作主干,不得写成业务仓源码依赖。 |
| D-025 | Step 6 的闭环前置口径 | 基础治理事实闭环强前置是 `L0-core`、`L0-bus`、`L1-identity`;process、work、artifact、method-library 是场景前置或定义 / evidence 边界,不全都写成基础强前置。 |
| D-026 | Step 6 的消费方口径 | conversation、workspace、runtime、member-service、capability-hub、observability、archive、SDK 和 console 消费治理事实、Policy、decision、traceability 或只读视图,但不能反向定义 Governance truth。 |
| D-027 | Step 6 的外部系统口径 | 当前阶段无正式外部系统依赖;Policy DSL 引擎、外部 GRC、法律系统、标准原文库、数据库、搜索、审计平台或告警系统后移后续设计 / 非功能 / 验收阶段。 |
| D-028 | Step 7 的核心闭环口径 | 核心闭环收敛为“治理语境与适用对象确定 -> 关键节点治理裁决 -> 治理策略与控制适用 -> AIIA / SoA / Nonconformity 治理闭环 -> 治理事实消费与追溯”。 |
| D-029 | Step 7 的外围增强口径 | Policy DSL、Gate kind 扩展、复杂评审、AIIA 自动草拟、管理评审自动化、外部 GRC、高级报表、容量和性能优化均为外围增强或后续阶段内容。 |
| D-030 | Step 7 的边界外口径 | process waiting state、work 项目事实、artifact / evidence 正文、conversation 显化、identity 生命周期、method definition、runtime 执行、capability registry、observability 存储和 UI 状态均不进入 Governance 核心闭环。 |
| D-031 | Step 8 的故事组织口径 | 用户故事按 C-GOV-1~C-GOV-5 核心闭环组织,不按旧接口名、功能名、事件名或验收用例组织。 |
| D-032 | Step 8 的核心故事口径 | 核心故事覆盖治理语境与适用对象、关键节点治理裁决、治理策略与控制适用、AIIA / SoA / Nonconformity 治理闭环、治理事实消费与追溯。 |
| D-033 | Step 8 的外围故事口径 | 高级治理看板、Policy DSL / 模拟评估、复杂 Gate 编排、AIIA / SoA 自动草拟、外部 GRC / 审计集成、容量 / 性能 / 报告健康度均为外围增强,不决定当前核心闭环成立。 |
| D-034 | Step 8 的边界外故事口径 | process waiting / recovery、work truth、artifact 正文、conversation 显化、identity 生命周期、method definition、runtime enforcement、capability registry、observability 存储、workspace / console UI 不进入 Governance 正式故事表。 |
| D-035 | Step 9 的功能组织口径 | 功能需求按业务能力主题归并,不按对象 CRUD、API、Command、事件、DTO、状态机、数据库表、Policy DSL 或代码模块拆分。 |
| D-036 | Step 9 的核心功能口径 | 核心功能收敛为治理语境、治理输入、正式裁决、自动化边界、Policy、Control、AIIA / SoA、Nonconformity、消费追溯和维护对账十类能力。 |
| D-037 | Step 9 的旧功能处理口径 | `RaiseGate`、`DecideGate`、`GetApplicablePolicies`、`PublishSoA`、`RaiseNonconformity` 等旧接口式功能不直接继承,只作为能力线索后移接口 / 规则 / 验收。 |
| D-038 | Step 9 的外围功能口径 | 高级治理看板、Policy DSL / 模拟评估、复杂 Gate 编排、AIIA / SoA 自动草拟、外部 GRC / 审计集成、容量 / 性能 / 报告健康度均为外围增强功能。 |

---

## 5. 下一步

当前已完成:

```text
Step 1. 与上游文档的关系声明
Step 2. 本仓定位与边界
Step 3. 背景与问题定义
Step 4. 目标与非目标
Step 5. 用户与角色
Step 6. 使用方与依赖
Step 7. 核心能力闭环
Step 8. 用户故事
Step 9. 功能需求
```

下一步:

```text
Step 10. 业务规则与边界约束
```

进入 Step 10 时必须继续遵守:

- 不把旧详细字段、状态机、RPC 和性能数字提前写入需求边界。
- 不把 process / work / artifact / method-library / conversation / identity / runtime / observability / workspace 的真相收进 governance。
- 业务规则必须从 Step 9 功能能力和 Step 2/4 边界收敛而来,不要把旧字段级 schema、状态机、RPC、事件 payload、DTO、repository、adapter 或实施计划直接写成规则。
