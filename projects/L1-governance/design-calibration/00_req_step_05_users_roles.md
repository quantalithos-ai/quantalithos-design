# Step 5. 用户与角色

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 5
> 回填章节: `00-需求文档.md` §5 用户与角色
> 生成日期: 2026-06-06

---

## 1. 本步目标

明确谁以什么身份接触 `L1-governance`,并区分人类角色、平台成员角色、系统角色和审计 / 维护类角色。本步只写角色与接触场景,不把仓际依赖写成角色,不写用户故事、接口动作、权限矩阵、DTO、字段、状态机、持久化或实施计划。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_02_position_boundary.md` | Step 2 已完成 | 固定 `L1-governance` 是治理决策与治理控制真相仓,不是 process / work / artifact / conversation / identity / method-library / runtime / observability / UI |
| `design-calibration/00_req_step_04_goals_non_goals.md` | Step 4 已完成 | 固定目标与非目标,防止把相邻仓、运行时执行、审计存储或 UI 状态写成 governance 角色 |
| 旧 `projects/L1-governance/00-需求文档.md` §4 | 旧角色表和权限矩阵 | 提取 Owner / Approver、Auditor、Tech Lead、系统等角色线索,剔除权限矩阵和接口动作 |
| 旧 `projects/L1-governance/00-需求文档.md` §5 / §6 | 旧用例和功能清单 | 只作为 Gate、Policy、AIIA、SoA、Nonconformity 场景线索,不直接生成故事或功能需求 |
| `domain/governance/README.md` | 旧治理域详细设计 | 提取 gate decision maker、policy owner、auditor、system trigger、Nonconformity owner 等历史角色线索,不继承字段、状态机、RPC 和事件名 |
| `methodology/standards-discussion/ISO-42001.md`、`ISO-9001.md`、`ISO-IEC-IEEE-24748-2.md` | 标准讨论输入 | 提取 governance owner、control owner、auditor、management review、Decision Gate approver 等角色语义线索 |
| `projects/L1-identity` 已稳定文档 | 成员与 actor 来源 | 确认 human / AI actor 身份真相不归 governance,本仓只引用 actor / member / role |

---

## 3. SOP 问题回答

### 3.1 本仓有哪些主要角色？

`L1-governance` 的主要角色不是相邻仓名称,而是会直接发起、裁决、维护、查看或被约束于治理事实的身份。当前可收敛为以下角色:

| 角色 | 类型 | 使用场景 |
|---|---|---|
| 治理负责人 / 组织管理员 | 人类管理角色 | 负责治理范围、治理责任、组织级策略和控制基线的业务责任语境 |
| Gate 决策人 / Approver | 人类或授权成员角色 | 在关键节点对 Gate / Approval / Decision 作出正式治理裁决 |
| Policy / Control 责任人 | 人类治理维护角色 | 维护 Policy 生效意图、控制适用性、复核责任和 shared rules 管理语境 |
| AIIA / SoA 评审人 | 人类治理评审角色 | 评审影响评估、适用性声明和控制覆盖结论,不拥有 artifact 正文 |
| Nonconformity 处置责任人 | 人类治理处置角色 | 跟进不符合、纠正、原因分析、复验和闭环责任语境 |
| 审计者 / 合规查看者 | 人类审计角色 | 查看治理事实、裁决依据、策略适用、控制覆盖和纠正闭环轨迹 |
| 项目 / 领域负责人 | 人类业务协作角色 | 在项目、过程、工作或产物语境中请求治理裁决或消费治理结论 |
| AI member / 自动化执行者 | 平台成员角色 | 作为受治理对象被 Policy、Gate 和 autonomy 边界约束;可提出治理输入,但身份和推理真相不归本仓 |
| 治理系统 actor | 系统角色 | 代表平台自动产生治理触发、周期性复核、告警转治理输入或维护性标记 |
| 运维 / 后台任务 | 系统维护角色 | 执行派生重建、对账、报告生成、归档准备或维护类动作,不创造新的业务治理结论 |

`L1-process`、`L1-work`、`L1-artifact`、`L1-conversation`、`L2-runtime`、`L3-method-library`、`L3-capability-hub`、`L4-observability`、`L1-workspace` 和 `L5-console` 不在本步写成角色。它们是 Step 6 / Step 12 要裁剪的使用方、依赖或协作边。

### 3.2 哪些是人类角色,哪些是系统角色？

人类角色包括治理负责人 / 组织管理员、Gate 决策人 / Approver、Policy / Control 责任人、AIIA / SoA 评审人、Nonconformity 处置责任人、审计者 / 合规查看者、项目 / 领域负责人。AI member / 自动化执行者是平台成员角色,在 governance 中主要作为受治理对象或受控输入来源出现,其身份来自 `L1-identity`,推理与执行来自 runtime / member-service。系统角色包括治理系统 actor、运维 / 后台任务。

### 3.3 这些角色分别在什么场景下接触本仓？

| 角色 | 典型接触场景 | 本步边界 |
|---|---|---|
| 治理负责人 / 组织管理员 | 确认治理范围、组织级治理责任、策略和控制基线 | 不写组织权限模型、不写配置 schema |
| Gate 决策人 / Approver | 对关键节点做正式裁决,使相邻仓能消费治理结论 | 不写 Gate 状态机、候选项字段或决策 API |
| Policy / Control 责任人 | 维护策略生效和控制适用的责任语境 | 不写 Policy DSL、控制项字段或 runtime cache |
| AIIA / SoA 评审人 | 对影响评估和适用性声明作治理评审 | 不写 AIIA / SoA 文档正文、artifact 字段或 38 控制项规则 |
| Nonconformity 处置责任人 | 跟进不符合纠正闭环,解释纠正责任和复验语境 | 不写 corrective action 状态机或 work task |
| 审计者 / 合规查看者 | 查看治理结论、裁决依据、策略适用和闭环轨迹 | 不写审计存储、observability 索引或报表格式 |
| 项目 / 领域负责人 | 在项目、过程、工作或产物语境中需要治理裁决或治理约束 | 不把相邻仓 truth 收进 governance |
| AI member / 自动化执行者 | 被治理策略约束,在授权范围内产生受控输入或请求人工裁决 | 不写身份生命周期、runtime 执行或工具调用事实 |
| 治理系统 actor | 将符合条件的系统触发转成治理输入或维护性信号 | 不写事件名、consumer flow 或后台 job |
| 运维 / 后台任务 | 维护派生视图、对账、报告或归档准备 | 不通过维护动作改变业务治理结论 |

### 3.4 是否存在管理、审计或维护类角色？

存在。

管理类角色包括治理负责人 / 组织管理员、Policy / Control 责任人和项目 / 领域负责人。它们负责治理责任、策略适用和业务语境,但不在本步展开具体授权规则。

审计类角色包括审计者 / 合规查看者和 AIIA / SoA 评审人。它们关注治理事实是否可解释、可追溯、可复核,但不拥有 observability 物理日志或 artifact 正文。

维护类角色包括治理系统 actor 和运维 / 后台任务。它们可以执行自动触发、周期检查、派生重建、报告和归档准备,但不能通过维护动作创造或修改应由人类或正式策略裁决的治理结论。

### 3.5 是否需要进一步补权限矩阵？

本步不补正式权限矩阵。原因是 Governance 的角色差异明显,但旧文档中的矩阵已经混入具体操作、规则和接口动作;若在 Step 5 直接写权限矩阵,会提前进入授权设计、业务规则、接口和详细设计。

本步只保留角色和接触场景。后续处理口径:

- 角色与治理能力的使用故事后移 Step 8。
- 能力级功能需求后移 Step 9。
- shared rules、autonomy、Gate 决策、Policy 生效、SoA 覆盖和 Nonconformity 等规则后移 Step 10。
- actor、role、member、scope 和 external ref 的数据归属后移 Step 11。
- 具体接口和相邻仓协作面后移 Step 12。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 旧 `00-需求文档.md` §4.1 | 把 Owner / Approver、Auditor、Tech Lead、各域服务、runtime / capability-hub 都写入目标用户 | 人类角色、系统使用方和相邻仓依赖混写 | Step 5 只写身份角色;相邻仓后移 Step 6 |
| 旧 `00-需求文档.md` §4.2 | 角色权限矩阵列 RaiseGate、DecideGate、ActivatePolicy、PublishSoA、RaiseNonconformity | 这些是功能、规则或接口候选,不适合角色章节定稿 | 本步不保留正式权限矩阵 |
| 旧 `00-需求文档.md` §5 | 用户故事直接写 Owner、runtime、Auditor、治理系统、项目成员 | 可作为角色线索,但用户故事不能进入 Step 5 | 后移 Step 8 重建故事 |
| 旧 `00-需求文档.md` §6 | 功能清单直接绑定 Gate、Approval、Policy、Control、AIIA、SoA、Nonconformity | 可作为能力线索,但不是角色定义 | 后移 Step 7~Step 10 |
| `domain/governance/README.md` | 已有 decision_maker、reviewer、auditor、system trigger、Policy owner 等详细语义 | 层级过深,包含字段、状态机、RPC 和事件名 | 只提取角色类型和场景,不继承实现细节 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 角色范围 | 角色、相邻服务和接口使用方混在同一表 | 人类角色、平台成员角色、系统角色分开;相邻仓后移 | 对齐 Step 5 粒度 |
| 管理角色 | Owner / Admin / Tech Lead 混写 | 治理负责人 / 组织管理员、项目 / 领域负责人、Policy / Control 责任人分层 | 区分治理责任、业务语境和策略维护 |
| 决策角色 | Approver 与 Auditor 权限混在矩阵 | Gate 决策人 / Approver 只作为裁决角色 | 不提前写授权规则 |
| 合规角色 | Auditor 同时承担 SoA / AIIA / Nonconformity | 拆为 AIIA / SoA 评审人、Nonconformity 处置责任人、审计者 / 合规查看者 | 便于后续故事、功能和验收追溯 |
| AI / 系统角色 | “系统”泛称,或 runtime / capability-hub 作为用户 | AI member 作为受治理成员;治理系统 actor 和后台任务作为系统角色 | 不把 runtime truth 和 capability truth 收进 governance |
| 权限表达 | 旧矩阵写具体操作 | 本步不形成权限矩阵,只保留接触场景 | 避免提前进入规则、接口和实现 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧角色表和权限矩阵 | 快,保留旧内容多 | 把功能、规则、接口和相邻仓依赖混进角色章节 | 不采用 |
| 方案 B: 按身份角色和接触场景重建 | 符合 SOP,边界清楚,能承接 Step 6 / Step 8 | 需要后续 Step 再展开依赖、故事、规则和接口 | 采用 |
| 方案 C: 只写 Owner / Approver / Auditor 三类 | 简洁 | 漏掉 Policy / Control、AIIA / SoA、Nonconformity、AI member 和系统维护语境 | 不采用 |
| 方案 D: 把相邻仓都写成系统角色 | 看起来覆盖协作 | 会把仓际依赖误写成角色,Step 6 无法清晰裁剪 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否在 Step 5 写权限矩阵？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 保留旧 RaiseGate / DecideGate / ActivatePolicy 等矩阵 | 会把功能、规则和接口提前写入角色章 |
| 方案 B | 不写正式权限矩阵,只写角色和接触场景 | 粒度更稳,后续 Step 9~Step 12 再展开能力和授权 |

推荐方案 B。原因是当前工作台已明确 Step 5 不提前写权限矩阵,且旧矩阵的操作项属于后续需求和设计内容。

#### 是否把 runtime / capability-hub / process / work 写成系统角色？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写成系统角色 | Step 5 与 Step 6 混杂,容易误认为相邻仓拥有 governance 角色身份 |
| 方案 B | 不写成角色,后移 Step 6 使用方与依赖 | 保持角色章干净,依赖章可按全局裁剪规则处理 |

推荐方案 B。原因是这些对象是相邻仓、消费方或协作方,不是 governance 内部的身份角色。

#### AI member 是否应进入角色表？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 不写 AI member | 角色表更短,但无法表达 autonomy / Policy 对 AI 行为的治理对象关系 |
| 方案 B | 写为平台成员角色和受治理对象,不写身份 / runtime truth | 保留治理场景,同时不侵入 identity / runtime |

推荐方案 B。原因是 Governance 的核心背景之一是 AI 自主性受控,但 AI member 的身份和执行真相必须留在相邻仓。

---

## 7. 结构化中间产物

### 7.1 角色说明表

| 角色 | 类型 | 使用场景 |
|---|---|---|
| 治理负责人 / 组织管理员 | 人类管理角色 | 负责治理范围、治理责任、组织级策略和控制基线的业务责任语境 |
| Gate 决策人 / Approver | 人类或授权成员角色 | 在关键节点对 Gate / Approval / Decision 作出正式治理裁决 |
| Policy / Control 责任人 | 人类治理维护角色 | 维护 Policy 生效意图、控制适用性、复核责任和 shared rules 管理语境 |
| AIIA / SoA 评审人 | 人类治理评审角色 | 评审影响评估、适用性声明和控制覆盖结论,不拥有 artifact 正文 |
| Nonconformity 处置责任人 | 人类治理处置角色 | 跟进不符合、纠正、原因分析、复验和闭环责任语境 |
| 审计者 / 合规查看者 | 人类审计角色 | 查看治理事实、裁决依据、策略适用、控制覆盖和纠正闭环轨迹 |
| 项目 / 领域负责人 | 人类业务协作角色 | 在项目、过程、工作或产物语境中请求治理裁决或消费治理结论 |
| AI member / 自动化执行者 | 平台成员角色 | 作为受治理对象被 Policy、Gate 和 autonomy 边界约束;可提出治理输入,但身份和推理真相不归本仓 |
| 治理系统 actor | 系统角色 | 代表平台自动产生治理触发、周期性复核、告警转治理输入或维护性标记 |
| 运维 / 后台任务 | 系统维护角色 | 执行派生重建、对账、报告生成、归档准备或维护类动作,不创造新的业务治理结论 |

### 7.2 角色分类结论

| 分类 | 包含角色 | 说明 |
|---|---|---|
| 治理管理角色 | 治理负责人 / 组织管理员、Policy / Control 责任人 | 负责治理责任和策略 / 控制维护语境 |
| 治理裁决角色 | Gate 决策人 / Approver、AIIA / SoA 评审人 | 负责关键节点裁决和治理结论评审 |
| 纠正与审计角色 | Nonconformity 处置责任人、审计者 / 合规查看者 | 负责不符合闭环和可追溯查看 |
| 业务协作角色 | 项目 / 领域负责人 | 从相邻业务语境触发或消费治理结论 |
| 受治理成员角色 | AI member / 自动化执行者 | 被 Policy、Gate 和 autonomy 边界约束,不拥有身份或执行 truth |
| 系统维护角色 | 治理系统 actor、运维 / 后台任务 | 执行自动触发、周期检查、派生、对账、报告和归档准备 |

### 7.3 权限差异结论

本步不形成权限矩阵。当前只确认以下差异方向:

- Gate 决策、Policy / Control 维护、AIIA / SoA 评审、Nonconformity 处置、审计查看和后台维护是不同接触场景。
- 这些差异必须在后续用户故事、功能需求、业务规则、数据归属、接口和验收中分别展开。
- 任何角色差异都不能让 governance 拥有 identity 成员生命周期、runtime 执行事实、artifact 正文、observability 审计存储或相邻仓业务 truth。

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §5。

```md
## 5. 用户与角色

> 校准来源:
> - `design-calibration/00_req_step_05_users_roles.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“当前文档问题诊断”和“设计取舍”小节,了解本章如何把旧角色表和权限矩阵收束为需求层角色定义。

### 5.1 角色说明

| 角色 | 类型 | 使用场景 |
|---|---|---|
| 治理负责人 / 组织管理员 | 人类管理角色 | 负责治理范围、治理责任、组织级策略和控制基线的业务责任语境 |
| Gate 决策人 / Approver | 人类或授权成员角色 | 在关键节点对 Gate / Approval / Decision 作出正式治理裁决 |
| Policy / Control 责任人 | 人类治理维护角色 | 维护 Policy 生效意图、控制适用性、复核责任和 shared rules 管理语境 |
| AIIA / SoA 评审人 | 人类治理评审角色 | 评审影响评估、适用性声明和控制覆盖结论,不拥有 artifact 正文 |
| Nonconformity 处置责任人 | 人类治理处置角色 | 跟进不符合、纠正、原因分析、复验和闭环责任语境 |
| 审计者 / 合规查看者 | 人类审计角色 | 查看治理事实、裁决依据、策略适用、控制覆盖和纠正闭环轨迹 |
| 项目 / 领域负责人 | 人类业务协作角色 | 在项目、过程、工作或产物语境中请求治理裁决或消费治理结论 |
| AI member / 自动化执行者 | 平台成员角色 | 作为受治理对象被 Policy、Gate 和 autonomy 边界约束;可提出治理输入,但身份和推理真相不归本仓 |
| 治理系统 actor | 系统角色 | 代表平台自动产生治理触发、周期性复核、告警转治理输入或维护性标记 |
| 运维 / 后台任务 | 系统维护角色 | 执行派生重建、对账、报告生成、归档准备或维护类动作,不创造新的业务治理结论 |

本章不形成正式权限矩阵。Gate 决策、Policy / Control 维护、AIIA / SoA 评审、Nonconformity 处置、审计查看和后台维护的差异,将在用户故事、功能需求、业务规则、数据归属、接口和验收章节继续展开。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否保留旧权限矩阵 | 保留 RaiseGate / DecideGate / ActivatePolicy 等操作矩阵 | 不保留,后移功能、规则和接口 | 推荐 B。原因是旧矩阵已经混入后续章节内容 |
| Q-002 | 是否把相邻仓写成系统角色 | 是,把 runtime / process / work 等列为角色 | 否,后移 Step 6 使用方与依赖 | 推荐 B。原因是相邻仓是协作方,不是身份角色 |
| Q-003 | AI member 是否进入角色表 | 不进入 | 进入,但只作为受治理成员角色 | 推荐 B。原因是 autonomy 和 Policy 约束需要表达受治理对象 |
| Q-004 | 是否拆分 AIIA / SoA、Nonconformity 和审计角色 | 不拆,统一写 Auditor | 拆分为评审、处置和查看三类场景 | 推荐 B。原因是三者接触治理事实的方式不同 |

当前建议:接受上述推荐后进入 Step 6。

---

## 10. 进入下一步条件

- 已明确主要角色及其接触场景。
- 已区分人类角色、平台成员角色、系统角色、审计 / 维护角色。
- 已明确本步不写正式权限矩阵。
- 已把 runtime / process / work / artifact / conversation / identity / method-library / observability / workspace 等相邻仓关系后移 Step 6 / Step 12。
- 未写 API、Command、事件名、DTO、字段、状态机、持久化或实施计划。
