# Step 2. 明确架构目标与约束

> 对应正式章节: `01-架构设计.md` §2、§3
> 本步状态: 已完成
> 前序依赖: Step 1 已完成
> 当前结论: `L1-identity` 架构目标必须围绕平台级成员身份真相、生命周期、角色能力摘要、生涯记忆引用、消费追溯和依赖裁剪展开;约束必须守住认证、ProjectMember、method body、memory body、runtime body、治理裁决和跨仓源码依赖边界。

---

## 1. Step 状态 + Step 内计划

- 本步目标: 把新版 `00` 中已确认的目标、能力闭环、规则和验收底线转译为架构目标、不可变约束、当前阶段取舍和架构非目标。
- 复杂度判断: 本步不拆附录。本步只分成“目标、约束、取舍、非目标”四类,不进入系统上下文、职责边界、数据所有权或技术选型。

| 计划项 | 产物 | 状态 |
|---|---|---|
| 读取 Step 1 和新版 `00` 目标 / 规则 / 验收 | 本步输入表 | 已完成 |
| 回答架构目标与约束问题 | SOP 问题回答表 | 已完成 |
| 诊断旧目标和旧技术承诺混层 | 当前材料 / 旧文档问题诊断表 | 已完成 |
| 记录目标分层取舍 | 设计取舍表 | 已完成 |
| 输出架构目标、不可变约束、阶段取舍和非目标 | 结构化中间产物 | 已完成 |
| 判断是否需要拆分 | 复杂度判断 | 已完成 |
| 形成正式 §2 / §3 回填草稿 | 回填草稿 | 已完成 |
| 自检并决定是否进入 Step 3 | 进入下一步条件 | 已完成 |

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| `01_arch_step_01_requirement_baseline.md` | 提供唯一需求基线、架构硬约束和后移事项 |
| `00-需求文档.md` §4 | 提供 `G-ID-001`~`G-ID-005` 目标与需求非目标 |
| `00-需求文档.md` §7 | 提供 `C-ID-1`~`C-ID-5` 核心能力闭环 |
| `00-需求文档.md` §10 | 提供 `BR-ID-001`~`BR-ID-015` 业务规则与边界约束 |
| `00-需求文档.md` §14 | 提供 `AC-ID-*` 和 `VETO-ID-*` 的验收 / 否决底线 |
| `00-需求文档.md` §15 | 提供 `R-ID-*` 和 `OQ-ID-*` 风险与待确认事项 |
| `架构设计讨论流程_SOP.md` Step 2 | 约束本步只收敛架构目标、不可变约束、阶段取舍和非目标 |
| `架构设计书写规范.md` §4.2 / §4.3 | 约束正式 §2 / §3 的表达形式和正反例 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 这个仓在架构层面要确保什么成立? | 必须确保平台级 AI 员工身份不是 runtime instance、ProjectMember、账号或显示名的附属物,而是独立的长期身份主语;还必须让生命周期、角色能力摘要、生涯记忆引用、消费追溯和依赖裁剪在结构上可持续成立。 |
| 哪些约束是不可变的? | 身份引用不可复用;查询不得隐式写入;认证 / credential / token 不归 identity;ProjectMember、RoleDefinition、memory / artifact / runtime / conversation body 不归 identity;高风险生命周期不得无依据通过;对账不得修复相邻仓 truth;除 `L0-core` 外不得形成业务仓源码依赖。 |
| 哪些约束是当前阶段可以接受的取舍? | 高风险 lifecycle 的具体 Gate / policy 协议、method-library 来源协议、memory / archive handoff surface、visibility / privacy 字段级裁剪、P0 性能阈值和既有 `04` 的保留与否,当前只保留架构承接位置,不在 Step 2 定成细节。 |
| 哪些目标可以明确判断,甚至量化? | Step 2 只做结构目标,不设性能数值。可明确判断的目标是:是否覆盖 `C-ID-1`~`C-ID-5`;是否避免 `VETO-ID-001`~`VETO-ID-006`;是否让后续 Step 能分别推导职责、上下文、依赖、数据和交互。 |
| 哪些事情虽然相关,但不是本仓架构当前要解决的问题? | 认证架构、权限系统、ProjectMember 管理、method-library 定义正文、memory/archive/artifact 正文存储、runtime 编排、UI 展示、数据库 / 消息产品选择和 DTO / repository 细节都不属于 Step 2 或当前 `01` 的主线目标。 |

---

## 4. 当前材料 / 旧文档问题诊断

| 诊断项 | 问题 | 本步处理 |
|---|---|---|
| 旧 `01` 容易把目标写成能力清单 | “创建成员 / 查询成员 / 更新生命周期”是功能需求,不是架构目标 | Step 2 改写为“承载、守住、支撑、允许”的结构性目标 |
| 旧 `02/03/04` 可能反向约束架构 | 已有对象、配置和实现口径可能把旧字段 / 旧 profile / 旧协议带回新版 `01` | 本步只承接新版 `00` 和 Step 1,不从旧后续文档推目标 |
| 约束、取舍、非目标容易混写 | 例如把认证写成“当前不做深”,或把性能阈值写成已确定 | 本步把边界外事项写入非目标,把未闭口但本仓相关事项写入当前阶段取舍 |
| 相邻仓 truth 容易进入 identity | ProjectMember、RoleDefinition、memory body、runtime state 都可能被误认为成员相关事实 | 本步将它们列为不可变约束和架构非目标,后续 Step 3 / 8 再细化 |
| 旧性能 / 可用性数字可能被继承 | 需求层已明确旧数字不能直接宣告通过 | 本步只保留“后续需重定基线”的架构取舍,不写具体阈值 |

---

## 5. 改动前后对比

| 维度 | 旧处理风险 | 新处理 |
|---|---|---|
| 架构目标 | 按功能项或旧模块列目标 | 按 `C-ID-1`~`C-ID-5` 和依赖裁剪列结构目标 |
| 约束条件 | 把边界、实现细节和非目标混成一张表 | 拆成不可变约束、当前阶段取舍和架构非目标 |
| 高风险生命周期 | 容易在架构层直接定义 Gate / policy 协议 | 只确认必须有授权 / 治理依据,协议后移 |
| 角色能力 | 容易把 method-library 定义正文拉入 identity | 只确认身份侧摘要、来源和证据引用 |
| 生涯 / 记忆 | 容易把项目 truth 或 memory body 复制到 identity | 只确认 career append-only 和 memory refs |
| 依赖方向 | 容易把运行期协作写成源码依赖 | 明确 `L0-core` 之外不得成为业务编译期依赖 |

---

## 6. 设计取舍

| 方案 / 取舍点 | 采用与否 | 理由 |
|---|---|---|
| 用功能需求直接作为架构目标 | 不采用 | 功能需求会在详细设计中落为 command / query / event;架构目标要表达结构必须成立的结果。 |
| 用五个核心能力节点组织架构目标 | 采用 | `C-ID-1`~`C-ID-5` 已形成需求闭环,能稳定牵引职责、数据、依赖和交互。 |
| 在 Step 2 直接定义高风险 lifecycle 状态枚举 | 不采用 | 需求只固定必须有依据,具体状态和 Gate / policy 协议应在 `03/06` 闭合。 |
| 把 method-library、memory/archive、governance 协议提前定成接口形态 | 不采用 | Step 2 只定义架构承接位置和边界,不定义 protocol schema。 |
| 把认证、ProjectMember、runtime 编排列为阶段取舍 | 不采用 | 它们是边界外能力,应进入架构非目标,不是“当前阶段先不做”。 |
| 保留既有 `04` 为架构输入 | 不采用 | 既有 `04` 需等待新版 `01~03` 稳定后复核,不能反向决定架构目标。 |

---

## 7. 结构化中间产物

### 7.1 业务背景与结构性驱动力

`L1-identity` 值得单独做架构设计,不是因为它需要一组成员 CRUD,而是因为 Quantalithos 需要一个可长期引用、可审计、可被多个仓消费的 AI 员工身份主语。若缺少架构层边界,identity 会退化为账号表、项目成员表、runtime 缓存、角色定义索引或 memory 容器,无法稳定支撑平台级 AI 员工身份。

| 驱动力 | 来源 | 架构含义 |
|---|---|---|
| AI 员工必须长期存在 | `G-ID-001`, `C-ID-1` | 需要独立身份真相核心,不能依附 runtime / project / auth |
| 成员必须有全局可用性 | `G-ID-002`, `C-ID-2` | 生命周期边界必须归 identity,但高风险依据来自正式治理 / 授权引用 |
| 成员需要身份侧职业能力语义 | `G-ID-003`, `C-ID-3` | identity 承载摘要、来源和证据引用,不承载定义正文 |
| 成员需要生涯与记忆延续 | `G-ID-004`, `C-ID-4` | 生涯可追加,记忆只保存 refs,外部正文不进入 |
| 相邻仓需要消费身份事实 | `G-ID-005`, `C-ID-5` | 架构必须提供消费和追溯边界,同时禁止反写 truth |
| 多仓协作需要依赖裁剪 | `VETO-ID-006` | 除 `L0-core` 外,跨仓协作必须走 runtime / event / handoff / ref |

### 7.2 架构目标表

| 架构目标 | 说明 | 需求来源 |
|---|---|---|
| 承载独立的平台级成员身份真相核心 | 否则成员身份会退化为认证主体、ProjectMember、runtime instance 或显示名。 | `G-ID-001`, `C-ID-1`, `BR-ID-001` |
| 支撑成员全局生命周期与可用性边界 | 否则暂停、退役、墓碑化会散落在项目、runtime 或 UI 中。 | `G-ID-002`, `C-ID-2`, `BR-ID-004`~`BR-ID-006` |
| 守住角色能力摘要与定义正文边界 | 否则 method-library 的 RoleDefinition / CapabilityDefinition truth 会漂移进 identity。 | `G-ID-003`, `C-ID-3`, `BR-ID-007`~`BR-ID-009` |
| 支撑生涯与记忆引用的长期身份叙事 | 否则成员跨项目经历和 memory refs 无法形成可追溯身份历史。 | `G-ID-004`, `C-ID-4`, `BR-ID-010`~`BR-ID-012` |
| 允许相邻仓稳定消费身份事实并追溯变化 | 否则下游会各自维护成员副本,导致身份漂移和审计断裂。 | `G-ID-005`, `C-ID-5`, `BR-ID-013`~`BR-ID-015` |
| 保持跨仓依赖可裁剪、可替换、可审计 | 否则 L1 仓之间会形成源码依赖循环或 truth 混层。 | `VETO-ID-006`, Step 1 硬约束 |

### 7.3 不可变约束表

| 约束 | 说明 | 来源 |
|---|---|---|
| 成员身份引用不得复用 | 这是平台级身份主语成立的最低边界。 | `BR-ID-001`, `VETO-ID-001` |
| 查询 / 消费路径不得隐式创建成员 | 读写语义混淆会破坏身份真相的显式创建边界。 | `BR-ID-002`, `VETO-ID-002` |
| 不把认证主体、账号、credential、token、session 或 runtime instance 等同为 GlobalMember truth | 否则 identity 会侵入认证入口和 runtime 执行边界。 | `BR-ID-003`, `AC-ID-011` |
| 不拥有 ProjectMember、项目事实或任务事实 | 否则平台级成员身份与项目级承担事实会混层。 | `BR-ID-006`, `BR-ID-011`, `VETO-ID-003` |
| 不拥有 RoleDefinition / CapabilityDefinition 正文或能力评估算法 | 否则定义 truth 会从 `L3-method-library` 漂移到 identity。 | `BR-ID-007`, `BR-ID-009`, `VETO-ID-003` |
| 不保存 memory 原文、向量、artifact body、archive package、conversation body 或 runtime body | 否则 identity 会变成外部正文总仓。 | `BR-ID-012`, `AC-ID-012`, `VETO-ID-003` |
| 高风险生命周期处置不得缺少授权 / 治理依据仍被接受 | 否则 lifecycle 会绕过正式责任链。 | `BR-ID-005`, `VETO-ID-004` |
| 维护对账不得修复相邻仓 truth | 否则后台任务会绕过正式能力写入其他仓真相。 | `BR-ID-015`, `VETO-ID-005` |
| 除 `L0-core` 外不得形成业务仓源码依赖 | 运行期 / 事件协作不能变成编译期耦合。 | `VETO-ID-006` |

### 7.4 当前阶段可接受取舍表

| 取舍 | 当前口径 | 后续承接 |
|---|---|---|
| 高风险 lifecycle 的具体 Gate / policy 协议 | 当前只固定“必须有授权 / 治理依据”;不定义状态枚举或协议 schema | `03` 状态矩阵 / flow,`06` 验收 |
| Role / Capability 来源方式 | 当前只固定 method-library 归属和身份侧摘要边界;不选事件、查询或混合协议 | Step 9 交互方式,`03` port / event |
| memory refs 承载方和迁移结果 surface | 当前只固定 ref-only 和禁止正文;不定义 handoff DTO | Step 8 数据所有权,Step 9 交互方式,`03` 外部绑定 |
| visibility / privacy 字段级裁剪 | 当前只固定“不得泄漏正文 / secret / 不可见摘要”;不定义字段级 projection | Step 12 横切关注点,`03` query protocol |
| P0 performance / availability 阈值 | 当前只固定不能继承旧数字;不写数值阈值 | `05` 测试方案,`06` 验收标准 |
| 既有 `04-配置设计.md` 是否保留 | 当前不作为新版 `01` 输入;待新版 `03` 稳定后复核 | `04` 复核或重建 |

### 7.5 架构非目标表

| 非目标 | 不展开原因 |
|---|---|
| 不设计认证架构 | 登录、token、session、credential 属于认证入口或 gateway / API layer。 |
| 不设计权限系统或治理裁决 truth | 授权和治理结论属于治理 / 安全能力,identity 只消费正式依据引用。 |
| 不承载项目级成员管理架构 | ProjectMember 和项目内角色分配属于 `L1-work`。 |
| 不设计 method-library 定义仓架构 | RoleDefinition / CapabilityDefinition 正文归 `L3-method-library`。 |
| 不设计 memory / archive / artifact 正文存储架构 | identity 只保存身份侧引用,正文与包体属于相邻承载方。 |
| 不设计 runtime 编排架构 | 容器启停、工具执行和运行实例属于 `L2-member-service` / `L2-runtime`。 |
| 不设计 UI 展示架构 | Conversation、Console、Workspace 和 L5 产品层只消费身份事实。 |
| 不选择数据库、消息后端、框架或代码目录 | 这些属于后续技术选型、详细设计或实施计划,不属于 Step 2。 |

### 7.6 Step 3 承接输入

| Step 3 需要承接 | 来自本步 |
|---|---|
| 做什么 / 不做什么 | 架构目标表 + 架构非目标表 |
| 易混职责 | 不可变约束中的认证、ProjectMember、method body、memory body、runtime、governance |
| 职责红线 | `VETO-ID-001`~`VETO-ID-006` 和 `BR-ID-*` |
| 待后移事项 | 当前阶段可接受取舍表 |

---

## 8. 回填草稿

```md
## 2. 业务背景与驱动力

> 校准来源:
> - `design-calibration/01_arch_step_02_goals_constraints.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“设计取舍”小节,了解架构目标如何从需求目标、核心能力和边界规则收束。

Quantalithos 要求 AI 员工作为长期存在、可被平台稳定引用的身份主体,而不是一次性执行器、会话实例、账号或项目成员。`L1-identity` 的架构价值在于为这个身份主体建立稳定 truth center,并让生命周期、角色能力摘要、生涯记忆引用、身份事实消费和追溯能够在多仓协作中保持边界清楚。

当前结构性驱动力包括:平台级成员身份必须独立存在;全局生命周期必须与项目状态和 runtime 状态分离;角色能力只能保存身份侧摘要和来源;生涯与 memory refs 必须支撑长期身份叙事但不保存外部正文;相邻仓必须通过正式边界消费身份事实。

| 架构目标 | 说明 |
|---|---|
| 承载独立的平台级成员身份真相核心 | 否则成员身份会退化为认证主体、ProjectMember、runtime instance 或显示名。 |
| 支撑成员全局生命周期与可用性边界 | 否则暂停、退役、墓碑化会散落在项目、runtime 或 UI 中。 |
| 守住角色能力摘要与定义正文边界 | 否则 method-library 的 RoleDefinition / CapabilityDefinition truth 会漂移进 identity。 |
| 支撑生涯与记忆引用的长期身份叙事 | 否则成员跨项目经历和 memory refs 无法形成可追溯身份历史。 |
| 允许相邻仓稳定消费身份事实并追溯变化 | 否则下游会各自维护成员副本,导致身份漂移和审计断裂。 |
| 保持跨仓依赖可裁剪、可替换、可审计 | 否则 L1 仓之间会形成源码依赖循环或 truth 混层。 |

## 3. 约束条件

> 校准来源:
> - `design-calibration/01_arch_step_01_requirement_baseline.md`
> - `design-calibration/01_arch_step_02_goals_constraints.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“架构硬约束”“不可变约束表”“当前阶段可接受取舍表”和“架构非目标表”小节,了解边界约束如何从需求规则和验收 veto 收束。

| 约束 | 说明 |
|---|---|
| 成员身份引用不得复用 | 这是平台级身份主语成立的最低边界。 |
| 查询 / 消费路径不得隐式创建成员 | 读写语义混淆会破坏身份真相的显式创建边界。 |
| 不把认证主体、账号、credential、token、session 或 runtime instance 等同为 GlobalMember truth | 否则 identity 会侵入认证入口和 runtime 执行边界。 |
| 不拥有 ProjectMember、项目事实或任务事实 | 否则平台级成员身份与项目级承担事实会混层。 |
| 不拥有 RoleDefinition / CapabilityDefinition 正文或能力评估算法 | 否则定义 truth 会从 `L3-method-library` 漂移到 identity。 |
| 不保存 memory 原文、向量、artifact body、archive package、conversation body 或 runtime body | 否则 identity 会变成外部正文总仓。 |
| 高风险生命周期处置不得缺少授权 / 治理依据仍被接受 | 否则 lifecycle 会绕过正式责任链。 |
| 维护对账不得修复相邻仓 truth | 否则后台任务会绕过正式能力写入其他仓真相。 |
| 除 `L0-core` 外不得形成业务仓源码依赖 | 运行期 / 事件协作不能变成编译期耦合。 |

| 取舍 | 当前口径 |
|---|---|
| 高风险 lifecycle 的具体 Gate / policy 协议 | 当前只固定“必须有授权 / 治理依据”;不定义状态枚举或协议 schema。 |
| Role / Capability 来源方式 | 当前只固定 method-library 归属和身份侧摘要边界;不选事件、查询或混合协议。 |
| memory refs 承载方和迁移结果 surface | 当前只固定 ref-only 和禁止正文;不定义 handoff DTO。 |
| visibility / privacy 字段级裁剪 | 当前只固定“不得泄漏正文 / secret / 不可见摘要”;不定义字段级 projection。 |
| P0 performance / availability 阈值 | 当前只固定不能继承旧数字;不写数值阈值。 |
| 既有 `04-配置设计.md` 是否保留 | 当前不作为新版 `01` 输入;待新版 `03` 稳定后复核。 |

| 非目标 | 不展开原因 |
|---|---|
| 不设计认证架构 | 登录、token、session、credential 属于认证入口或 gateway / API layer。 |
| 不设计权限系统或治理裁决 truth | 授权和治理结论属于治理 / 安全能力,identity 只消费正式依据引用。 |
| 不承载项目级成员管理架构 | ProjectMember 和项目内角色分配属于 `L1-work`。 |
| 不设计 method-library 定义仓架构 | RoleDefinition / CapabilityDefinition 正文归 `L3-method-library`。 |
| 不设计 memory / archive / artifact 正文存储架构 | identity 只保存身份侧引用,正文与包体属于相邻承载方。 |
| 不设计 runtime 编排架构 | 容器启停、工具执行和运行实例属于 `L2-member-service` / `L2-runtime`。 |
| 不设计 UI 展示架构 | Conversation、Console、Workspace 和 L5 产品层只消费身份事实。 |
| 不选择数据库、消息后端、框架或代码目录 | 这些属于后续技术选型、详细设计或实施计划,不属于当前章节。 |
```

---

## 9. 待确认事项

本步不新增待确认事项。需求层已登记的 `OQ-ID-001`~`OQ-ID-006` 继续有效:

| 待确认项 | 本步处理 |
|---|---|
| `OQ-ID-001` method-library 到 identity 的角色 / 能力来源方式 | 作为当前阶段取舍,后移 Step 9 / `03` |
| `OQ-ID-002` 高风险 lifecycle 动作枚举 | 作为当前阶段取舍,后移 `03` / `06` |
| `OQ-ID-003` memory refs 承载方和迁移结果 surface | 作为当前阶段取舍,后移 Step 8 / Step 9 / `03` |
| `OQ-ID-004` 成员摘要 visibility / privacy 字段级裁剪 | 作为当前阶段取舍,后移 Step 12 / `03` |
| `OQ-ID-005` P0 performance / availability 阈值 | 作为当前阶段取舍,后移 `05` / `06` |
| `OQ-ID-006` 既有 `04` 是否保留或重写 | 后移新版 `03` 稳定后的配置复核 |

---

## 10. 进入下一步条件

Step 2 已完成。允许进入 Step 3 的条件已满足:

- 架构目标已从 `C-ID-1`~`C-ID-5` 和需求目标收束,没有写成功能项。
- 不可变约束已覆盖身份引用、读写边界、认证、ProjectMember、method body、memory body、runtime body、高风险 lifecycle、对账和跨仓源码依赖。
- 当前阶段取舍与架构非目标已区分,未把边界外事项写成 TODO。
- 正式 §2 / §3 回填草稿未新增未确认需求结论。
- Step 3 可以继续收敛职责边界,但不得使用当前目录中已存在的未来 Step 文件作为已完成依据;必须按最新 SOP 重新执行 Step 3。
