# Step 3. 职责边界

> 对应正式章节: `01-架构设计.md` §4
> 本步状态: 已完成
> 前序依赖: Step 2 已完成
> 当前结论: `L1-identity` 只承担平台级 AI 员工身份真相、全局生命周期、身份侧角色能力摘要、生涯 / memory 引用和身份事实消费追溯边界;认证、ProjectMember、RoleDefinition 正文、memory / artifact / runtime 正文、治理裁决 truth 和 UI 展示均不属于本仓职责。

---

## 1. Step 状态 + Step 内计划

- 本步目标: 明确 `L1-identity` 做什么、不做什么、哪些相邻仓能力容易混淆,并固化职责红线。
- 复杂度判断: 本步按职责归属分组审查,不拆附录;本步只做职责归因,不画系统上下文图,不展开子域、数据所有权、接口协议或实现机制。
- 停审要求: 本步完成后停留审核;已按用户“继续”进入 Step 4。

| 计划项 | 产物 | 状态 |
|---|---|---|
| 读取 Step 1~2、需求边界和数据归属 | 本步输入表 | 已完成 |
| 回答职责边界问题 | SOP 问题回答表 | 已完成 |
| 诊断旧职责混层 | 当前材料 / 旧文档问题诊断表 | 已完成 |
| 记录职责归属取舍 | 设计取舍表 | 已完成 |
| 输出做 / 不做、易混职责和红线表 | 结构化中间产物 | 已完成 |
| 判断是否需要拆职责附录 | 复杂度判断 | 已完成 |
| 形成正式 §4 回填草稿 | 回填草稿 | 已完成 |
| 停下等待用户审核 | 进入下一步条件 | 已完成 |

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| `01_arch_step_01_requirement_baseline.md` | 提供唯一需求基线、架构硬约束和后移事项 |
| `01_arch_step_02_goals_constraints.md` | 提供架构目标、不可变约束、当前阶段取舍和非目标 |
| `00-需求文档.md` §2 | 提供本仓定位、边界对象和判定问题 |
| `00-需求文档.md` §4 | 提供 `G-ID-001`~`G-ID-005` 和需求非目标 |
| `00-需求文档.md` §7 | 提供 `C-ID-1`~`C-ID-5` 核心能力节点 |
| `00-需求文档.md` §10 | 提供 `BR-ID-001`~`BR-ID-015` 业务规则与边界红线 |
| `00-需求文档.md` §11 | 提供 truth / snapshot / reference / forbidden body 数据归属基线 |
| `00-需求文档.md` §12 | 提供能力级接口和依赖边界线索,但本步不展开交互方式 |
| `架构设计讨论流程_SOP.md` Step 3 | 约束本步只收敛职责边界 |
| `架构设计书写规范.md` §4.4 | 约束职责项类型、说明列粒度和正反例 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 这个仓具体做什么? | 承载平台级成员身份真相,维护成员全局生命周期,保存身份侧角色 / 能力摘要及来源引用,追加身份侧生涯记录和 memory refs,并提供身份事实消费、追溯和对账报告边界。 |
| 这个仓具体不做什么? | 不做认证、登录、token、session、credential、权限裁决、ProjectMember 管理、RoleDefinition / CapabilityDefinition 正文、memory / artifact / conversation / runtime 正文、运行编排、UI 展示和跨仓 truth 修复。 |
| 哪些能力看起来相关但必须属于其他仓? | ProjectMember 属于 `L1-work`;角色 / 能力定义正文属于 `L3-method-library`;高风险授权 / 治理结论属于 governance / 安全边界;memory / archive 正文属于外部承载方;runtime instance 和执行上下文属于 runtime / member-service。 |
| 哪些行为绝不能隐式发生? | 查询不得隐式创建成员;消费方不得反向写 identity truth;维护对账不得修复相邻仓 truth;高风险 lifecycle 不得无依据通过;identity 不得复制外部正文;运行期 / 事件协作不得变成业务仓源码依赖。 |
| 哪些边界如果不写清,后续设计最容易串线? | GlobalMember / ProjectMember、身份生命周期 / 项目状态 / runtime 状态、角色能力摘要 / method-library 定义正文、memory refs / memory body、identity 追溯 / 外部审计正文、对账报告 / 自动修复这六组最容易串线。 |

---

## 4. 当前材料 / 旧文档问题诊断

| 诊断项 | 旧处理风险 | 本步处理 |
|---|---|---|
| GlobalMember 与 ProjectMember 混层 | 旧材料容易把平台成员、项目成员和任务承担统一写成“成员管理” | 明确 identity 只拥有 GlobalMember 身份主语和平台级状态;ProjectMember 归 `L1-work` |
| 身份生命周期与 runtime 状态混层 | 暂停 / 退役可能被写成 runtime 容器状态或执行可用性缓存 | 明确 identity 管全局身份可用性;runtime 只消费结果或运行自己的实例状态 |
| 角色能力摘要与定义正文混层 | 成员画像容易吸收 RoleDefinition、CapabilityDefinition、评分算法或 method body | 明确 identity 只保存身份侧摘要、来源和证据引用;定义正文归 `L3-method-library` |
| 生涯记录与项目 truth 混层 | 项目经历追加可能反向定义项目事实、work item 或 ProjectMember truth | 明确 identity 可追加身份侧生涯记录,但项目事实仍归 `L1-work` |
| memory ref 与 memory body 混层 | 为了展示成员记忆,可能把 memory 原文、embedding 或 archive package 写进 identity | 明确 identity 只保存 refs、迁移状态和身份侧关联,不保存正文 |
| 对账与修复混层 | 后台维护任务可能被设计成跨仓修复器 | 明确对账只能发现、报告或重建本仓派生状态,不得修改相邻仓 truth |
| 认证 / 授权与身份真相混层 | 账号、credential、token、ActorContext 或治理裁决可能被写成 identity truth | 明确认证入口和授权 / 治理裁决不归 identity,identity 只消费可信操作者上下文或依据引用 |

---

## 5. 改动前后对比

| 维度 | 旧处理风险 | 新处理 |
|---|---|---|
| 职责表达 | 按创建、查询、更新等功能项列职责 | 按仓级真相、边界和归属列职责 |
| 相邻仓边界 | 把所有“成员相关”能力都吸入 identity | 只保留需要平台级身份 truth 的能力 |
| 外部正文 | 为了便利查询复制 method / memory / runtime body | 只保存引用、摘要、状态或安全可见原因 |
| 高风险处置 | lifecycle service 自行判断或后台静默执行 | 只承载生命周期变化,高风险依据来自正式授权 / 治理引用 |
| 对外消费 | 下游直接绑定 identity 内部 truth 或反向写入 | 下游只能通过正式消费边界读取 / 订阅,不得反写 truth |
| 维护任务 | 后台任务自动修复下游 truth | 对账只报告漂移或处理本仓派生状态 |

---

## 6. 设计取舍

| 方案 / 取舍点 | 采用与否 | 理由 |
|---|---|---|
| 把 identity 定义为“成员相关信息总仓” | 不采用 | 会吸收 ProjectMember、method body、memory body、runtime body 和 UI 展示状态,打穿需求边界。 |
| 把 identity 定义为“平台级身份 truth center + 引用 / 摘要边界” | 采用 | 能承接 `C-ID-1`~`C-ID-5`,同时守住相邻仓 truth。 |
| 让 identity 负责认证和权限裁决 | 不采用 | 认证入口、credential 和授权 / 治理裁决不是身份 truth。 |
| 让 identity 负责 ProjectMember 分配 | 不采用 | 项目内承担事实属于 `L1-work`;identity 只提供 GlobalMember 身份锚点。 |
| 让 identity 保存 RoleDefinition / CapabilityDefinition 正文 | 不采用 | 定义正文属于 `L3-method-library`;identity 只承载身份侧摘要与来源。 |
| 让 identity 保存 memory 原文或 archive package | 不采用 | 外部正文归 memory / archive / artifact 承载方;identity 只保存 refs。 |
| 让维护任务跨仓修复 truth | 不采用 | 这会绕过正式能力和相邻仓 ownership,违反 `BR-ID-015` / `VETO-ID-005`。 |
| 在本步展开接口协议或上下文图 | 不采用 | Step 3 只收敛职责归属;系统上下文、交互方式和接口协议分别留给后续 Step。 |

---

## 7. 结构化中间产物

### 7.1 做 / 不做清单

| 职责项 | 类型 | 说明 |
|---|---|---|
| 平台级成员身份真相承载 | 做 | 这是 `L1-identity` 的核心职责,用于稳定回答“这个 AI 员工是谁”。 |
| 成员身份引用稳定性 | 做 | 身份 ref 的稳定和不可复用必须由身份真相仓保证。 |
| 全局生命周期可用性维护 | 做 | 平台级暂停、退役、墓碑化等身份状态必须独立于项目和 runtime。 |
| 高风险生命周期依据引用承接 | 做 | 本仓承载身份变化需要的依据引用,但不拥有治理裁决 truth。 |
| 身份侧角色摘要维护 | 做 | 成员职业 / 角色在身份侧的摘要需要归 identity 追溯。 |
| 身份侧能力画像摘要维护 | 做 | 能力声明属于成员身份侧可消费摘要,但必须有来源或证据引用。 |
| 生涯记录追加 | 做 | 成员长期身份经历需要 append-only 方式归 identity 追溯。 |
| memory refs 与迁移状态关联 | 做 | 成员与外部记忆的身份侧关联可以归 identity,正文不归 identity。 |
| 身份事实消费与追溯边界 | 做 | 下游需要稳定读取身份摘要、状态和变化追溯。 |
| 投影 / 引用对账报告 | 做 | 本仓可发现 identity 自身投影、引用或消费边界漂移。 |
| 认证、登录、token、session、credential | 不做 | 这些属于认证入口或 gateway / security layer,不是身份 truth。 |
| 权限裁决和治理决策 truth | 不做 | 授权 / 治理结论属于 governance / security boundary,identity 只消费依据引用。 |
| ProjectMember 和项目内角色分配 | 不做 | 项目内承担事实属于 `L1-work`,不是平台级成员身份 truth。 |
| RoleDefinition / CapabilityDefinition 正文 | 不做 | 定义正文属于 `L3-method-library`,identity 不能复制或主导。 |
| method body、评估算法和绩效评分 | 不做 | 这些属于方法定义或分析能力,不是 identity 仓职责。 |
| memory 原文、embedding、检索索引和 archive package | 不做 | 外部记忆正文和包体属于 memory / archive / artifact 承载方。 |
| runtime container、execution context 和运行日志正文 | 不做 | 运行实例和运行正文属于 runtime / observability 边界。 |
| Conversation / Workspace / UI 展示状态 | 不做 | 展示状态属于消费层,identity 只提供可消费身份事实。 |
| 自动修复相邻仓 truth | 不做 | 维护对账不得绕过正式能力修改 `work`、`method-library`、archive 或其他仓 truth。 |
| 平台级成员与项目级成员边界 | 易混淆职责 | 若不显式区分,后续会把 `GlobalMember` 与 `ProjectMember` 混为一体。 |
| 身份 lifecycle 与 runtime availability 边界 | 易混淆职责 | 全局身份可用性不是 runtime 容器是否可运行。 |
| 角色能力摘要与定义正文边界 | 易混淆职责 | identity 可保存摘要和来源,但定义正文不归 identity。 |
| 生涯记录与项目事实边界 | 易混淆职责 | identity 可记录“成员经历引用”,但不能反向定义项目事实。 |
| memory refs 与 memory body 边界 | 易混淆职责 | identity 可维护引用关系,但不能保存原文、向量或 archive package。 |
| 追溯 / 审计摘要与外部证据正文边界 | 易混淆职责 | identity 只保存安全可见原因、来源或 evidence ref,不保存外部证据正文。 |
| 对账报告与跨仓修复边界 | 易混淆职责 | 对账可发现漂移,修复必须回到拥有 truth 的正式能力。 |

### 7.2 职责边界表

| 边界组 | identity 承担 | identity 不承担 | 归属判断 |
|---|---|---|---|
| 成员主语 | GlobalMember 身份锚点、稳定 ref、墓碑化后不可复用 | 账号、登录主体、外部用户身份、runtime instance | 是否回答“平台级 AI 员工是谁” |
| 生命周期 | 全局身份可用性、显式变化、原因 / 操作者 / 依据引用 | 项目成员状态、runtime 可运行状态、任务执行状态 | 是否影响平台级成员身份本身 |
| 角色能力 | 身份侧角色摘要、能力画像摘要、来源 / 证据引用 | RoleDefinition / CapabilityDefinition 正文、能力评估算法、绩效评分 | 是否只是身份侧摘要而非定义正文 |
| 生涯 | 身份侧生涯记录、项目 / ProjectMember ref、append-only 追溯 | 项目 truth、work item truth、ProjectMember truth | 是否记录成员身份经历而非定义项目事实 |
| memory / archive | memory refs、迁移 / 冷存引用状态、身份侧关联 | memory 原文、embedding、检索索引、archive package | 是否只保存引用而非正文 |
| 消费 | 身份摘要、状态摘要、变化追溯、可见 ref | 下游业务 truth、UI 展示状态、共享数据库读写 | 消费方是否只能读 / 订阅而不能反写 |
| 维护 | 本仓投影重建、引用对账、漂移报告 | 修改相邻仓 truth、自动重写外部正文、跨仓事务修复 | 是否只处理本仓派生状态和报告 |
| 安全依据 | 写入所需操作者上下文和高风险依据引用 | 认证 credential、token、权限裁决 truth、治理决策 truth | 是否只是消费正式依据而非作出裁决 |

### 7.3 边界红线清单

| 红线 | 违反后果 | 需求来源 |
|---|---|---|
| 不得复用成员身份 ref | 平台级身份主语失效 | `BR-ID-001`, `VETO-ID-001` |
| 查询 / 消费不得隐式创建成员 | 读写语义混层,下游消费会产生 truth | `BR-ID-002`, `VETO-ID-002` |
| 不得把认证主体、账号、token、session、credential 等同 GlobalMember truth | 身份仓侵入认证入口 | `BR-ID-003`, `AC-ID-011` |
| 不得把 ProjectMember、项目事实或任务事实写成 identity truth | `L1-work` ownership 被打穿 | `BR-ID-006`, `BR-ID-011`, `VETO-ID-003` |
| 不得保存 RoleDefinition / CapabilityDefinition 正文 | `L3-method-library` 定义 truth 漂移 | `BR-ID-007`, `VETO-ID-003` |
| 不得保存 memory / artifact / archive / conversation / runtime 正文 | 外部正文和敏感内容进入身份 truth | `BR-ID-012`, `AC-ID-012`, `VETO-ID-003` |
| 高风险 lifecycle 不得缺少授权 / 治理依据仍被接受 | 身份处置绕过正式责任链 | `BR-ID-005`, `VETO-ID-004` |
| 维护对账不得修改相邻仓 truth | 后台任务绕过正式能力和 ownership | `BR-ID-015`, `VETO-ID-005` |
| 运行期 / 事件协作不得写成业务仓源码依赖 | 形成 L1 循环依赖或 truth 混层 | `VETO-ID-006` |

### 7.4 后续 Step 承接清单

| 后续 Step | 承接内容 | 不得反向改写 |
|---|---|---|
| Step 4 系统边界与上下文 | 把本步职责转译为上下游关系和输入输出面 | 不得把上下文关系重新定义为职责 |
| Step 5 限界上下文与子域划分 | 从本步职责拆分架构单元和统一语言 | 不得让子域吸收边界外职责 |
| Step 7 依赖方向 | 把职责边界转译为编译期 / 运行期 / 事件协作约束 | 不得把运行期协作写成源码依赖 |
| Step 8 数据所有权 | 把职责边界转译为 truth / snapshot / reference / forbidden body | 不得把引用数据升级成外部 truth ownership |
| Step 9 关键交互 | 把职责边界转译为同步 / 异步 / handoff 类别 | 不得提前发明协议 schema |
| Step 12 横切关注点 | 把红线转译为安全、审计、观测、韧性和配置约束 | 不得用横切能力放松职责红线 |

---

## 8. 回填草稿

```md
## 4. 职责边界

> 校准来源:
> - `design-calibration/01_arch_step_03_responsibility_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“职责边界表”“边界红线清单”和“后续 Step 承接清单”小节,了解本章职责归属如何从需求规则和架构约束收束。

`L1-identity` 的职责不是承载所有“成员相关信息”,而是承载平台级 AI 员工身份真相及其身份侧引用、摘要和追溯边界。凡是回答“这个 AI 员工是谁、全局是否可用、其身份侧角色能力是什么、有哪些身份侧经历和 memory refs、相邻仓如何消费身份事实”的内容,才可能进入本仓职责。

| 职责项 | 类型 | 说明 |
|---|---|---|
| 平台级成员身份真相承载 | 做 | 这是 `L1-identity` 的核心职责,用于稳定回答“这个 AI 员工是谁”。 |
| 成员身份引用稳定性 | 做 | 身份 ref 的稳定和不可复用必须由身份真相仓保证。 |
| 全局生命周期可用性维护 | 做 | 平台级暂停、退役、墓碑化等身份状态必须独立于项目和 runtime。 |
| 身份侧角色 / 能力摘要维护 | 做 | 成员职业、角色和能力声明在身份侧需要可追溯摘要和来源。 |
| 生涯记录与 memory refs 关联 | 做 | 成员长期经历和外部记忆关联需要身份侧追溯,但不保存外部正文。 |
| 身份事实消费、追溯和对账报告 | 做 | 下游需要稳定读取身份摘要、状态和变化追溯,维护任务只能报告漂移。 |
| 认证、登录、token、session、credential | 不做 | 这些属于认证入口或 gateway / security layer,不是身份 truth。 |
| 权限裁决和治理决策 truth | 不做 | 授权 / 治理结论属于 governance / security boundary,identity 只消费依据引用。 |
| ProjectMember 和项目内角色分配 | 不做 | 项目内承担事实属于 `L1-work`,不是平台级成员身份 truth。 |
| RoleDefinition / CapabilityDefinition 正文 | 不做 | 定义正文属于 `L3-method-library`,identity 不能复制或主导。 |
| memory / artifact / conversation / runtime 正文 | 不做 | 外部正文和运行正文属于相邻承载方,identity 只保存安全引用。 |
| 自动修复相邻仓 truth | 不做 | 维护对账不得绕过正式能力修改其他仓 truth。 |
| 平台级成员与项目级成员边界 | 易混淆职责 | 若不显式区分,后续会把 `GlobalMember` 与 `ProjectMember` 混为一体。 |
| 角色能力摘要与定义正文边界 | 易混淆职责 | identity 可保存摘要和来源,但定义正文不归 identity。 |
| memory refs 与 memory body 边界 | 易混淆职责 | identity 可维护引用关系,但不能保存原文、向量或 archive package。 |
| 对账报告与跨仓修复边界 | 易混淆职责 | 对账可发现漂移,修复必须回到拥有 truth 的正式能力。 |

### 4.1 边界红线

- 不得复用成员身份 ref。
- 查询 / 消费不得隐式创建成员。
- 不得把认证主体、账号、token、session、credential 等同 GlobalMember truth。
- 不得把 ProjectMember、项目事实或任务事实写成 identity truth。
- 不得保存 RoleDefinition / CapabilityDefinition 正文。
- 不得保存 memory / artifact / archive / conversation / runtime 正文。
- 高风险 lifecycle 不得缺少授权 / 治理依据仍被接受。
- 维护对账不得修改相邻仓 truth。
- 运行期 / 事件协作不得写成业务仓源码依赖。
```

---

## 9. 待确认事项

本步不新增待确认事项。需求层已登记的 `OQ-ID-001`~`OQ-ID-006` 继续有效。

| 待确认项 | 本步处理 |
|---|---|
| `OQ-ID-001` method-library 到 identity 的角色 / 能力来源方式 | 职责上只确认 method-library 拥有定义正文,identity 拥有身份侧摘要;具体来源协议后移 Step 9 / `03` |
| `OQ-ID-002` 高风险 lifecycle 动作枚举 | 职责上只确认 identity 承载生命周期变化和依据引用;具体动作枚举后移 `03/06` |
| `OQ-ID-003` memory refs 的正式承载方和迁移结果 surface | 职责上只确认 ref-only;具体承载和 handoff surface 后移 Step 8 / Step 9 / `03` |
| `OQ-ID-004` 成员摘要 visibility / privacy 字段级裁剪 | 职责上只确认不得泄漏正文或不可见摘要;字段级裁剪后移 Step 12 / `03` |
| `OQ-ID-005` P0 performance / availability 阈值 | 本步不处理性能阈值;后移 `05/06` |
| `OQ-ID-006` 既有 `04` 是否保留或重写 | 本步不引用既有 `04`;后移新版 `03` 稳定后的配置复核 |

---

## 10. 进入下一步条件

Step 3 已完成。允许进入 Step 4 的条件已满足:

- 用户已通过“继续”确认本步职责边界。
- `01_architecture_calibration_flow.md` 可将 Step 3 状态更新为 `已完成`。
- Step 4 只能承接本步职责边界去绘制系统边界与上下文,不得回头改写本步职责归属。
- 若后续审核发现职责归属冲突,必须先回到本 Step 修正,不能带着冲突继续后续 Step。
