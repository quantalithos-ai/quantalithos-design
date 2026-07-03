# L1-artifact 00 需求 Step 6: 使用方与依赖

> 创建日期: 2026-06-29
> 状态: done
> 当前模式: full-restart
> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 6
> 回填位置: `00-需求文档.md` 第 6 章“使用方与依赖”
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 文档级 flow: `design-calibration/00_requirements_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 6 使用方与依赖 |
| 输出文件 | `design-calibration/00_req_step_06_consumers_dependencies.md` |
| 前置 Step | Step 5 `用户与角色` 已完成并通过自检,停审结论为 `allow_step_6` |
| 当前入口 | `使用方与依赖:开工确认 / 必读文档:先思考` |
| 已读取恢复文件 | yes:`project_execution_ledger.md`;`00_requirements_calibration_flow.md`;`00_req_step_05_users_roles.md` |
| 已读取规范线索 | yes:`需求文档讨论流程_SOP.md` Step 6;`需求文档书写规范.md` 4.6;`全局项目依赖关系与裁剪规则.md` |
| 当前禁写范围 | 不写角色说明、用户故事、核心能力闭环、功能需求、业务规则、数据归属、接口签名、DTO、事件 schema、API、port、repository、handler、事务流程、配置或实施边界 |
| 正式文档写入 | blocked: 当前只写中间产物,不修改正式 `00-需求文档.md` |
| next_allowed_action | Step 6 已完成;等待用户确认后进入 Step 7 `开工确认 / 必读文档:先思考`。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 开工确认 / 必读文档:先思考 | done | Step 6 输入、必读范围和禁写范围诊断 | pass | 进入必读文档再写入。 |
| 必读文档:再写入 | done | 必读文档摘要和对 Step 6 的影响 | pass | 进入整体模块搭建。 |
| 整体模块搭建:先思考 | done | Step 6 模块骨架诊断 | pass | 进入整体模块搭建再写入。 |
| 整体模块搭建:再写入 | done | Step 6 模块骨架 | pass | 进入模块 1 先思考。 |
| 模块 1 仓际能力关系候选:先思考 | done | 输入 / 输出关系候选诊断 | pass | 进入模块 1 再写入。 |
| 模块 1 仓际能力关系候选:再写入 | done | 仓际能力关系候选结论 | pass | 进入模块 2 先思考。 |
| 模块 2 全局依赖裁剪:先思考 | done | `L1-artifact` 相关全局依赖边诊断 | pass | 进入模块 2 再写入。 |
| 模块 2 全局依赖裁剪:再写入 | done | 本仓依赖裁剪表草稿 | pass | 进入模块 3 先思考。 |
| 模块 3 闭环前置与失效影响:先思考 | done | 闭环前置、强阻塞、失效影响诊断 | pass | 进入模块 3 再写入。 |
| 模块 3 闭环前置与失效影响:再写入 | done | 闭环前置依赖和失效影响结论 | pass | 进入模块 4 先思考。 |
| 模块 4 外部系统依赖与裁剪:先思考 | done | 外部系统依赖是否进入主链诊断 | pass | 进入模块 4 再写入。 |
| 模块 4 外部系统依赖与裁剪:再写入 | done | 外部系统依赖结论 | pass | 进入模块 5 先思考。 |
| 模块 5 禁止依赖与 ASCII 图:先思考 | done | 禁止依赖和依赖裁剪图诊断 | pass | 进入模块 5 再写入。 |
| 模块 5 禁止依赖与 ASCII 图:再写入 | done | 禁止依赖表和依赖裁剪 ASCII 图 | pass | 进入结构化中间产物。 |
| 结构化中间产物 | done | 内部仓依赖表 / 外部系统依赖表 / 裁剪表 / 类型分类表 / 禁止依赖表 / ASCII 图 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 6 章候选草稿 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表 / 是否允许进入 Step 7 | pass | allow_step_7 |

---

## 2. 开工判断

### 2.1 本步目标

Step 6 要说明 `L1-artifact` 在仓际协作网络中:

- 向哪些内部仓提供 Artifact 正文、版本、血缘与基线事实能力。
- 依赖哪些内部仓提供前置能力或引用语境。
- 哪些关系来自全局依赖基线,属于编译期、运行期或事件协作依赖。
- 哪些依赖会阻塞后续核心能力闭环成立。
- 哪些外部系统依赖不应进入当前需求主链。

### 2.2 本步不做

本步不做以下事项:

- 不把 Step 5 的角色说明重写为依赖关系。
- 不写用户故事或“作为...我想...”句式。
- 不写功能清单、业务规则、数据归属或验收标准。
- 不写接口签名、DTO、事件 schema、API 路径、port、repository 或 adapter。
- 不把运行期依赖或事件协作依赖写成 Cargo / package dependency。
- 不复制 27 仓全量依赖矩阵,只裁剪 `L1-artifact` 相关子图。

### 2.3 当前输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `00_req_step_02_position_boundary.md` | done/pass | 提供 `L1-artifact` 是可审计制品真相仓的边界。 |
| `00_req_step_04_goals_non_goals.md` | done/pass | 提供相邻仓不拥有 Artifact 正文、版本、血缘与基线事实的非目标边界。 |
| `00_req_step_05_users_roles.md` | done/pass | 提供角色和使用场景,并明确相邻仓不是角色。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已读取线索 | 提供全局依赖矩阵、裁剪表、类型分类表、禁止依赖表和 ASCII 图格式。 |
| 旧 `projects/L1-artifact/00-需求文档.md` | historical_material | 后续只在独立结论形成后做差异审计,不得直接继承旧 §10。 |
| `architecture/bus-draft/event-catalog.md` | event clue | 只作为事件协作线索,不得在 Step 6 写事件 payload 或事件契约。 |

---

## 3. 必读文档:先思考

### 3.1 必读文档候选

| 文档 | 必读原因 | 预计落点 |
|---|---|---|
| `standards/document/需求文档讨论流程_SOP.md` Step 6 | 确认 Step 6 的目标、输入、输出、约束和进入下一步条件。 | Step 6 开工规则和自检标准。 |
| `standards/document/需求文档书写规范.md` 4.6 | 确认内部仓依赖表、外部系统依赖表、依赖裁剪表、类型分类表、禁止依赖表和 ASCII 图的粒度。 | Step 6 结构化中间产物。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 提供全局依赖矩阵和固定裁剪格式。 | 模块 2、模块 5 和正式草稿。 |
| `00_req_step_02_position_boundary.md` | 明确 artifact 拥有 / 不拥有的真相边界。 | 判断依赖是否侵犯 truth 边界。 |
| `00_req_step_04_goals_non_goals.md` | 明确相邻仓引用、消费、展示、审计或封存 Artifact 的边界。 | 判断依赖是否进入当前需求主链。 |
| `00_req_step_05_users_roles.md` | 防止把角色和仓际依赖再次混写。 | Step 6 禁写范围和旧材料审计。 |
| `architecture/仓库拆分方案.md` | 提供 L1 artifact 仓职责和仓间依赖矩阵上游线索。 | 全局依赖基线核对。 |
| `product/六域模型.md` | 提供 work/process/governance/conversation/archive 对 artifact 的产品级协作线索。 | 仓际能力关系候选。 |
| `architecture/bus-draft/event-catalog.md` | 提供 artifact 与 work/process/governance/archive/observability/method-library 等事件协作线索。 | 事件协作依赖候选,不写 payload。 |
| `projects/L1-governance/design-calibration/00_req_step_06_consumers_dependencies.md` | 参考已完成项目如何裁剪依赖子图和防止运行期依赖误写成编译期。 | 组织方式参考,不复制 governance 结论。 |

### 3.2 待按需补读

| 文档 | 触发条件 | 使用限制 |
|---|---|---|
| 旧 `projects/L1-artifact/00-需求文档.md` §10 | 当模块 1~2 独立形成依赖候选后,用于旧接口与依赖差异审计。 | 不直接继承旧接口、SLA、事件名或技术依赖。 |
| `projects/L1-artifact/01/02/03/05/06` | 当旧下游材料可能把架构组件、测试依赖或验收责任反推成需求依赖时再读。 | 只作污染检查,不反推需求结论。 |

### 3.3 初步关注点

后续 Step 6 需要重点防止以下混层:

- 把 `L1-work`、`L1-process`、`L1-governance` 等从 Step 5 的“非角色”直接写成角色,而不是依赖 / 使用方。
- 把 `artifact.approved`、`artifact.baselined`、`artifact.content_tampered` 等事件名写成 Step 6 的正式依赖契约。
- 把 `L1-artifact` 按需消费 work / process / governance 引用误写成对这些仓的编译期依赖。
- 把 archive、observability、SDK、console、sync 等下游消费方误写成拥有 Artifact truth。
- 把外部对象存储、数据库、搜索、向量库、审计平台等基础设施提前定为正式外部系统依赖。

### 3.4 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| Step 6 开工 | pass | 用户已确认从 Step 5 进入 Step 6。 |
| 必读文档思考 | pass | 已明确 Step 6 必读文档候选、按需补读文档和关注点。 |
| 正式文档写入 | blocked | 正式 `00-需求文档.md` 仍等待 Step 17 统一组装。 |
| 当前模块 | pass | 已完成 `自检与停审`;停审结论为 `allow_step_7`。 |

当前下一步只能进入 Step 7 `开工确认 / 必读文档:先思考`,不得直接进入 Step 7 模块写入或正式 `00-需求文档.md`。

## 4. 必读文档:再写入

### 4.1 必读文档摘要

| 文档 | 读取结论 | 对 Step 6 的影响 |
|---|---|---|
| `standards/document/需求文档讨论流程_SOP.md` Step 6 | Step 6 要说明本仓向谁提供能力、依赖谁的前置能力、哪些依赖阻塞核心闭环,并输出仓际能力关系、闭环前置、失效后果、裁剪表、类型分类表、禁止依赖表和 ASCII 图。 | 本步必须围绕仓际能力关系和依赖裁剪推进,不得把角色、接口、功能、规则或数据归属混入本章。 |
| `standards/document/需求文档书写规范.md` 4.6 | 正式表达应包含内部仓依赖表、外部系统依赖表、本仓依赖裁剪表、本仓依赖类型分类表、本仓禁止依赖表,按需补依赖裁剪 ASCII 图。 | 后续结构化中间产物必须使用固定表结构,字段只写能力级关系,不写函数、DTO、事件 schema 或实现组织。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 全局矩阵给出 `L1-artifact` 编译期依赖 `L0-core`,运行期按需消费 governance / work / process 引用,通过 `L0-bus` 发布制品事件。 | 后续模块必须从这条基线裁剪 `L1-artifact` 子图;运行期和事件协作不得写成 package dependency。 |
| `00_req_step_02_position_boundary.md` | `L1-artifact` 是可审计制品真相仓,承载 Artifact 正文、版本、血缘与基线事实。 | 判断依赖时必须保护 Artifact truth,相邻仓只能引用、消费或协作,不能反向定义 Artifact 正文、版本、血缘或基线。 |
| `00_req_step_04_goals_non_goals.md` | 相邻仓可以引用、消费、展示、审计或封存 Artifact,但不拥有 Artifact truth;旧材料中的对象、功能、规则、性能和技术方案后置。 | 本步只讨论仓际协作和依赖裁剪,不得把旧功能 / 性能 / 技术方案写成依赖结论。 |
| `00_req_step_05_users_roles.md` | Step 5 已明确相邻仓不是角色,并将 work / process / governance / archive / observability 后移到 Step 6 / Step 12。 | Step 6 可以处理这些仓作为使用方、依赖方或协作方,但不能回写为用户角色。 |
| `architecture/仓库拆分方案.md` | `quantalithos-artifact` 职责包括 Artifact 状态机、kind 枚举、ArtifactRelation 血缘、Baseline 冻结、Quality 标签和发布事件。 | 可作为仓职责上游线索;状态机、kind、事件名不能在 Step 6 展开为功能或接口契约。 |
| `product/六域模型.md` | work、process、governance、conversation、archive 等会引用或消费 artifact;Artifact 域承载可审计产出和血缘。 | 提供仓际能力关系候选,但具体依赖类型仍必须回到全局依赖裁剪规则判断。 |
| `architecture/bus-draft/event-catalog.md` | artifact 与 work/process/governance/archive/observability/method-library 存在事件协作线索,例如 artifact approved / baselined / content_tampered 等。 | 只作为事件协作依赖候选;Step 6 不写事件名、payload、订阅关系或事件契约。 |
| `projects/L1-governance/design-calibration/00_req_step_06_consumers_dependencies.md` | L1-governance 的 Step 6 使用“输入 / 输出能力、全局裁剪表、类型分类表、禁止依赖表、ASCII 图”组织依赖讨论。 | 只借鉴组织方式和防混层方式,不复制 governance 的依赖结论。 |

### 4.2 必读后的执行约束

| 约束 | 当前口径 |
|---|---|
| 只裁剪本仓相关边 | 不复制 27 仓全量矩阵,只裁剪 `L1-artifact` 相关输入、输出和协作边。 |
| 只写能力级依赖 | 表格中只写“提供 / 依赖内容”的能力级描述,不写函数、DTO、事件、API 或实现。 |
| 区分依赖类型 | 每条进入主链的关系必须标注编译期、运行期或事件协作依赖。 |
| 保护 truth 边界 | 下游消费方不能反向定义 Artifact 正文、版本、血缘或基线事实。 |
| 外部系统谨慎进入 | 对象存储、数据库、搜索、向量库、审计平台等基础设施默认不是当前需求主链外部依赖。 |
| 禁止依赖必须显式 | 对容易被误写成编译期依赖的运行期 / 事件协作关系,后续必须进入禁止依赖表。 |

### 4.3 下一步输入

整体模块搭建应基于上述必读摘要,把 Step 6 拆成可逐步讨论的模块,至少覆盖:

- 仓际能力关系候选。
- 全局依赖裁剪。
- 闭环前置与失效影响。
- 外部系统依赖与裁剪。
- 禁止依赖与 ASCII 图。
- 结构化中间产物、回填草稿、自检与停审。

当前仍不得直接生成依赖裁剪表或依赖裁剪图。

## 5. 整体模块搭建:先思考

### 5.1 拆分原则

Step 6 的关键不是罗列所有相邻仓,而是把 `L1-artifact` 相关的仓际能力关系裁剪成可讨论、可追溯、可停审的子模块。拆分时应先识别关系候选,再回到全局依赖基线判断依赖类型,最后再形成结构化表格和正式草稿。

本步应遵守以下原则:

- 先从 `L1-artifact` 的 truth 边界出发,判断哪些仓消费 Artifact 正文、版本、血缘与基线事实。
- 再从全局依赖基线出发,判断哪些边是编译期、运行期或事件协作依赖。
- 闭环前置必须单独讨论,不能把所有消费方都写成强前置。
- 外部系统依赖必须单独裁剪,避免把对象存储、数据库、搜索、向量库、审计平台提前写成需求主链。
- 禁止依赖必须显式写出,用于约束后续架构和实施不把运行期 / 事件协作边落成编译期耦合。
- 当前只搭模块顺序,不直接产出最终依赖表、事件图、接口契约或正式正文。

### 5.2 建议模块顺序

| 顺序 | 模块 | 讨论目的 | 不提前写入的内容 |
|---:|---|---|---|
| 1 | 仓际能力关系候选 | 找出哪些仓会输入、输出或协作消费 Artifact 能力,并按能力级语言描述关系。 | 不判断全部依赖类型;不写接口、事件 schema 或调用流程。 |
| 2 | 全局依赖裁剪 | 把模块 1 的候选关系回贴到全局依赖基线,判断编译期、运行期、事件协作和是否进入当前主链。 | 不扩展到 27 仓全量矩阵;不新增全局基线未支持的编译期边。 |
| 3 | 闭环前置与失效影响 | 区分基础闭环前置、场景前置、消费方退化和非阻塞协作方。 | 不把所有下游消费方写成 `L1-artifact` 成立的强依赖。 |
| 4 | 外部系统依赖与裁剪 | 明确对象存储、数据库、搜索、向量库、审计平台、外部文档系统等是否进入当前需求主链。 | 不提前指定技术选型、容量指标、SLA 或配置项。 |
| 5 | 禁止依赖与 ASCII 图 | 固化禁止编译期耦合、禁止 truth 反向定义和依赖裁剪图表达。 | 不写 package path、crate、adapter、repository 或事件 payload。 |
| 6 | 结构化中间产物 | 汇总内部仓依赖表、外部系统依赖表、裁剪表、类型分类表、禁止依赖表和 ASCII 图。 | 不新增前面模块未确认的关系。 |
| 7 | 回填草稿 | 形成正式第 6 章候选正文,等待 Step 17 统一装配。 | 不直接修改正式 `00-需求文档.md`。 |
| 8 | 自检与停审 | 核对 SOP / 书写规范 / 全局依赖规则,判断是否允许进入 Step 7。 | 不越过未解决 blocker。 |

### 5.3 为什么按这个顺序

如果先写依赖裁剪表,容易把旧文档里的接口、事件、SLA 或技术依赖直接搬进 Step 6。先做“仓际能力关系候选”可以把关系限定在能力级;再做“全局依赖裁剪”可以防止把运行期或事件协作误写成编译期依赖;最后才做结构化表格和 ASCII 图,能保证每张表都有前置讨论来源。

这个顺序也能承接 Step 7。Step 7 的核心能力闭环需要知道哪些依赖是基础前置,哪些只是消费方或显化方。如果 Step 6 不先区分这些关系,Step 7 容易把 archive、observability、workspace、console 等下游能力误判为 Artifact truth 成立的强前置。

### 5.4 本步需要重点防止的错误

| 错误 | 影响 | 本步处理 |
|---|---|---|
| 把相邻仓写成 Step 5 角色 | 用户与仓际依赖混层 | 模块 1 只写仓际能力关系。 |
| 把 `L1-work` / `L1-process` / `L1-governance` 写成编译期依赖 | 破坏 L1 平权真相域,引入循环依赖风险 | 模块 2 和模块 5 必须回到全局基线裁剪。 |
| 把 artifact event 名称写成正式契约 | Step 6 越界到接口 / 协议设计 | 事件只作为协作类型,不写 payload、schema 或订阅表。 |
| 把对象存储 / 数据库 / 搜索写成外部主链依赖 | 提前进入架构和技术选型 | 模块 4 单独裁剪,默认不进入当前需求主链。 |
| 把所有消费方都写成闭环前置 | 导致核心能力闭环过重 | 模块 3 区分基础前置、场景前置和消费退化。 |
| 复制 27 仓全量矩阵 | 文档失焦,无法服务 `L1-artifact` | 只裁剪与 `L1-artifact` 直接相关子图。 |

### 5.5 下一小步判断

下一小步应进入 `整体模块搭建:再写入`,把上述思考固化为 Step 内计划和模块 gate。该小步仍只写模块骨架,不直接写模块 1 的仓际能力关系结论。

## 6. 整体模块搭建:再写入

### 6.1 固化后的模块骨架

Step 6 采用 8 个小模块推进。前 5 个模块逐步形成依赖判断,后 3 个模块负责汇总、回填和自检。

| 顺序 | 模块 | 输入 | 输出 | 完成门禁 |
|---:|---|---|---|---|
| 1 | 仓际能力关系候选 | Step 2 边界、Step 4 非目标、Step 5 角色边界、产品 / 架构线索 | `L1-artifact` 输入方、输出方、协作方的能力级候选表 | 不混入角色、接口、事件 schema、功能和实现组件。 |
| 2 | 全局依赖裁剪 | 模块 1 候选、全局依赖关系与裁剪规则 | 本仓依赖裁剪候选,标注是否进入当前主链 | 每条关系能回指全局基线或明确裁剪理由。 |
| 3 | 闭环前置与失效影响 | 模块 2 进入主链的依赖关系 | 基础前置、场景前置、消费退化和失效影响 | 不把下游消费方统一升级成强前置。 |
| 4 | 外部系统依赖与裁剪 | 旧材料中的存储、搜索、审计、文档系统等外部线索 | 外部系统依赖是否进入需求主链的裁剪结论 | 不提前写技术选型、容量、SLA 或配置。 |
| 5 | 禁止依赖与 ASCII 图 | 模块 2~4 结论、全局禁止依赖规则 | 禁止依赖表和 `L1-artifact` 依赖裁剪图 | `[compile]`、`[runtime]`、`[event]` 不混写。 |
| 6 | 结构化中间产物 | 模块 1~5 已确认结论 | 内部仓依赖表、外部系统依赖表、裁剪表、类型分类表、禁止依赖表、ASCII 图 | 不新增前面未确认的关系。 |
| 7 | 回填草稿 | 结构化中间产物 | 正式第 6 章候选草稿 | 只形成候选草稿,不修改正式 `00-需求文档.md`。 |
| 8 | 自检与停审 | SOP、书写规范、全局依赖规则、候选草稿 | 自检表和是否允许进入 Step 7 的停审结论 | 未通过时记录 blocker,不得进入 Step 7。 |

### 6.2 模块进入顺序

后续每个模块都必须按 `先思考`、`再写入` 两段执行:

| 当前模块 | 下一模块 | 推进条件 |
|---|---|---|
| 模块 1 仓际能力关系候选 | 模块 2 全局依赖裁剪 | 已确认输入 / 输出 / 协作方候选,且未写实现细节。 |
| 模块 2 全局依赖裁剪 | 模块 3 闭环前置与失效影响 | 已标注编译期、运行期、事件协作和裁剪理由。 |
| 模块 3 闭环前置与失效影响 | 模块 4 外部系统依赖与裁剪 | 已区分基础前置、场景前置和消费退化。 |
| 模块 4 外部系统依赖与裁剪 | 模块 5 禁止依赖与 ASCII 图 | 已明确外部系统是否进入主链。 |
| 模块 5 禁止依赖与 ASCII 图 | 结构化中间产物 | 已形成禁止依赖和依赖裁剪图边界。 |
| 结构化中间产物 | 回填草稿 | 所有表格的来源能回指模块 1~5。 |
| 回填草稿 | 自检与停审 | 候选草稿未新增未确认依赖关系。 |
| 自检与停审 | Step 7 | SOP、书写规范和全局依赖规则均通过。 |

### 6.3 本 Step 的统一写入约束

| 约束 | 固化口径 |
|---|---|
| 依赖粒度 | 只写仓际能力级依赖,不写接口、函数、DTO、事件 payload、订阅表或存储结构。 |
| 依赖范围 | 只裁剪 `L1-artifact` 直接相关子图,不复制全量项目矩阵。 |
| 编译期依赖 | 仅允许依据全局基线进入,不得把运行期 / 事件协作关系提升为编译期依赖。 |
| Truth 边界 | 相邻仓只能引用、消费、展示、归档或协作 Artifact truth,不能反向定义 Artifact 正文、版本、血缘或基线事实。 |
| 外部系统 | 默认不进入当前需求主链;若进入,必须说明其能力级必要性,不得写技术方案。 |
| 正式文档 | Step 6 全部完成前不修改正式 `00-需求文档.md`;候选正文只写在本中间产物。 |

### 6.4 当前 gate 结论

| 项 | 状态 | 说明 |
|---|---|---|
| 模块拆分 | pass | 已固化 8 个模块和顺序。 |
| 写入边界 | pass | 已明确每个模块的输入、输出和完成门禁。 |
| 防混层规则 | pass | 已限制角色、接口、功能、数据、事件、配置和实现越界。 |
| 正式文档写入 | blocked | 正式 `00-需求文档.md` 仍等待 Step 17 统一装配。 |
| 下一小步 | pass | 整体模块搭建完成后已进入模块 1;当前以最新恢复点为准。 |

当前 Step 6 的整体模块搭建已完成。后续小步以本文件顶部和项目台账中的最新恢复点为准。

## 7. 模块 1 仓际能力关系候选:先思考

### 7.1 本模块要回答的问题

模块 1 只回答“哪些仓或平台能力与 `L1-artifact` 存在能力级关系候选”。这里的候选关系不是最终依赖裁剪表,也不是接口契约。最终依赖类型、是否进入当前主链、是否闭环前置,都留到模块 2 和模块 3 处理。

本模块的判断粒度如下:

| 判断项 | 当前口径 |
|---|---|
| 关系对象 | 只看与 Artifact 正文、版本、血缘、基线事实直接相关的内部仓或平台能力。 |
| 关系方向 | 先分为输入语境、输出消费、双向协作和基础协作候选。 |
| 描述粒度 | 只写能力级关系,例如“提供工作语境引用”“消费基线事实”。 |
| 暂不判断 | 不判断编译期 / 运行期 / 事件协作,不写接口、事件名、payload、DTO、port 或实现。 |

### 7.2 候选关系来源

| 来源 | 对模块 1 的作用 | 使用限制 |
|---|---|---|
| Step 2 本仓定位 | 固定 `L1-artifact` 拥有 Artifact 正文、版本、血缘与基线事实。 | 不能扩成对象字段、状态机或接口。 |
| Step 4 目标 / 非目标 | 固定相邻仓只能引用、消费、展示、审计或封存 Artifact,不能拥有 Artifact truth。 | 不能把相邻仓协作写成强依赖。 |
| Step 5 用户与角色 | 固定相邻仓不是角色,只能在 Step 6 作为使用方、依赖方或协作方处理。 | 不能回写为角色说明。 |
| 全局依赖规则 | 提供 `L1-artifact` 相关依赖边的基线:依赖 `L0-core`,按需消费 governance / work / process 引用,通过 `L0-bus` 发布制品事件。 | 本模块只作为候选来源,类型裁剪留到模块 2。 |
| 产品 / 架构线索 | 提示 work、process、governance、conversation、archive、observability、method-library 等会围绕 artifact 协作。 | 不继承旧状态机、事件名、聚合根或技术方案。 |
| 旧 `00-需求文档.md` / README | 提供旧接口、事件、SLA、技术依赖的污染检查线索。 | 不直接继承旧 §10 或 README 技术栈。 |

### 7.3 候选关系分组诊断

| 分组 | 候选对象 | 能力级关系候选 | 诊断 |
|---|---|---|---|
| 基础协作候选 | `L0-core` | 提供跨仓共享 ID、引用、trace、错误和基础契约语境。 | 全局基线已明确其重要性;本模块只列候选,依赖类型模块 2 再判定。 |
| 基础协作候选 | `L0-bus` | 承载 Artifact 事实变化的跨仓协作通道。 | 只能写为事件协作候选,不得写事件名、payload 或订阅表。 |
| 输入语境候选 | `L1-work` | 提供项目、工作对象、工作产出归属和基线关联语境;消费 Artifact 版本 / 基线事实。 | work truth 不归 artifact;不能写 WorkItem 状态规则。 |
| 输入语境候选 | `L1-process` | 提供活动、过程产出和过程节点语境;消费 Artifact 是否到位或可引用事实。 | process truth 不归 artifact;不能写流程推进规则。 |
| 输入 / 协作候选 | `L1-governance` | 提供治理裁决、证据边界、AIIA / SoA 等治理语境;消费 Artifact evidence / baseline 事实。 | governance decision truth 不归 artifact;不能写 Gate 或 Policy 规则。 |
| 输入语境候选 | `L1-identity` | 提供作者、审查者、actor / member 引用语境。 | Step 5 已确认角色不等于身份仓;直接依赖类型需模块 2 回贴全局基线。 |
| 定义来源候选 | `L3-method-library` | 提供 WorkProduct / Artifact kind、方法产出定义或受控词表线索。 | 不能在本步固化 kind 枚举或方法定义 schema。 |
| 输出消费候选 | `L1-conversation` | 显化、分享或追溯 Artifact 引用和版本事实。 | conversation 不拥有正文或血缘;不能写 Turn 结构。 |
| 输出消费候选 | `L1-workspace` / `L5-console` | 展示和管理入口消费 Artifact 事实的只读视图。 | UI / 工作台状态不归 artifact;不能写页面或查询 API。 |
| 输出消费候选 | `L4-archive` | 封存、恢复或合规包消费 Artifact 版本、基线和发布事实。 | archive 不拥有 Artifact 正文 truth;不能写归档包格式。 |
| 输出 / 横切候选 | `L4-observability` | 消费 Artifact 血缘、质量、完整性和审计线索。 | observability 不替代 Artifact lineage truth;不能写指标、告警或日志存储。 |
| 输出消费候选 | `L0-sdk` / `L5-sync` | 通过正式访问边界或同步能力消费 Artifact facts。 | 不能绕过正式服务边界;是否进入主链留到模块 2。 |
| 弱候选 / 待裁剪 | `L2-runtime` / `L3-capability-hub` | 可能消费 Artifact 作为运行证据、能力产物或工具输出线索。 | 直接关系不应自动进入主链;需要模块 2 判断是否只经 work / process / governance / method-library 间接成立。 |

### 7.4 当前不作为候选结论的对象

| 对象 | 暂不作为模块 1 候选结论的原因 | 后续处理 |
|---|---|---|
| 数据库、对象存储、Git、S3、搜索、向量库 | 属于架构、配置、NFR 或外部系统候选,不是需求 Step 6 的仓际能力关系。 | 模块 4 外部系统依赖与裁剪。 |
| 旧事件名,如 `artifact.approved`、`artifact.baselined`、`artifact.content_tampered` | 事件名属于协议 / 接口 / 测试线索,本模块只识别事件协作关系。 | Step 12 或后续设计文档。 |
| 旧接口名,如 `CreateArtifact`、`GetLineage` | 属于功能或接口层,不是仓际能力关系候选。 | Step 9 / Step 12。 |
| 角色名,如制品作者、Reviewer、Auditor | Step 5 已处理角色;模块 1 只处理仓际使用方和依赖方。 | 不回写到 Step 6 关系表。 |
| 全 27 仓清单 | 会让 Step 6 失焦,且不符合“只裁剪本仓相关子图”。 | 只在模块 2 必要时引用全局基线。 |

### 7.5 取舍

| 方案 | 内容 | 优点 | 缺点 | 当前取舍 |
|---|---|---|---|---|
| 方案 A | 只列全局基线中的 `L0-core`、governance / work / process、`L0-bus`。 | 严格贴合基线。 | 会漏掉明显消费方和显化 / 归档 / 观测关系候选,不利于后续裁剪。 | 不单独采用。 |
| 方案 B | 复制全部项目矩阵并逐项判断。 | 看似全面。 | 失焦,且容易把弱关系写成正式依赖。 | 不采用。 |
| 方案 C | 先按输入语境、输出消费、基础协作和弱候选四组列候选,再由模块 2 裁剪类型和主链。 | 既覆盖候选关系,又保留后续裁剪空间。 | 需要在模块 1 再写入时明确这些不是最终依赖结论。 | 采用。 |
| 方案 D | 直接沿用旧 `00-需求文档.md` §10 接口与依赖。 | 写得快。 | 旧文档混入接口、SLA、事件和实现依赖。 | 不采用。 |

### 7.6 模块 1 再写入建议

模块 1 再写入时,应形成一张“仓际能力关系候选表”,建议列为:

```text
方向 / 候选对象 / 能力级关系候选 / 候选理由 / 后续裁剪点
```

表中只写候选关系,不写依赖类型和是否进入主链。依赖类型、当前主链和裁剪理由留到模块 2 `全局依赖裁剪`。

模块 1 先思考完成时的下一小步是 `模块 1 仓际能力关系候选:再写入`;该小步现已完成,当前恢复点以后续章节和项目台账为准。

## 8. 模块 1 仓际能力关系候选:再写入

### 8.1 仓际能力关系候选表

下表只固化候选关系,用于模块 2 回贴全局依赖基线。表内不表达最终依赖类型,不判断是否进入当前主链,也不代表闭环前置。

| 方向 | 候选对象 | 能力级关系候选 | 候选理由 | 后续裁剪点 |
|---|---|---|---|---|
| 基础协作 | `L0-core` | 为 Artifact 正文、版本、血缘与基线事实提供跨仓共享 ID、引用、trace、错误和基础契约语境。 | 全局基线中 `L1-artifact` 依赖 `L0-core`;没有共享基础语境,Artifact truth 难以跨仓稳定表达。 | 模块 2 判断依赖类型和是否作为唯一编译期候选。 |
| 基础协作 | `L0-bus` | 为 Artifact 事实变化提供跨仓协作通道。 | 全局基线中 `L1-artifact` 通过 `L0-bus` 发布制品事件;相邻仓需要感知制品事实变化。 | 模块 2 只能裁剪为事件协作候选,不得扩写事件名或 payload。 |
| 输入语境 / 输出消费 | `L1-work` | work 提供项目、工作对象、工作产出归属和基线关联语境;work 消费 Artifact 版本、引用和基线事实。 | 产品线索中 WorkItem、Project baseline 与 Artifact 强相关;Step 4 已明确 work 不拥有 Artifact truth。 | 模块 2 判断运行期 / 事件协作边;不得写 WorkItem done 规则。 |
| 输入语境 / 输出消费 | `L1-process` | process 提供活动、过程产出和过程节点语境;process 消费 Artifact 是否到位、可引用或已冻结的事实。 | 产品线索中 Activity 输入 / 输出 Artifact;过程执行 truth 不归 artifact。 | 模块 2 判断是否进入当前主链;流程推进规则后置 Step 10 / Step 12。 |
| 输入语境 / 输出消费 | `L1-governance` | governance 提供治理裁决、证据边界、AIIA / SoA 等治理语境;governance 消费 Artifact evidence、版本和 baseline 事实。 | 全局基线写明 `L1-artifact` 按需消费 governance 引用;AIIA / SoA 存在治理和制品双重语境。 | 模块 2 判断运行期 / 事件协作边;不得写 Gate、Policy 或审批规则。 |
| 输入语境 | `L1-identity` | 提供作者、审查者、actor / member 等引用语境。 | Step 5 已识别制品作者、审查者、系统 actor 等角色,但身份 truth 不归 artifact。 | 模块 2 判断是否作为直接边进入主链,或仅经 `L0-core` 引用成立。 |
| 定义来源 | `L3-method-library` | 提供 WorkProduct / Artifact kind、方法产出定义或受控词表线索。 | 产品和事件线索中 method-library 可能发布 work product definition;旧材料也有 kind 定义线索。 | 模块 2 判断是否直接进入当前主链;不得在本 Step 固化 kind 枚举或 schema。 |
| 输出消费 | `L1-conversation` | 消费 Artifact 引用、版本、预览和追溯语境,用于对话显化或分享。 | 六域模型中 Turn 可携带 artifact 引用;conversation 不拥有 Artifact 正文或血缘。 | 模块 2 判断是否进入主链;Turn 结构、展示模式和事件后置。 |
| 输出消费 | `L1-workspace` | 消费 Artifact facts 的只读视图和聚合工作台语境。 | Step 4 已明确 workspace 可展示或聚合 Artifact,但不拥有 truth。 | 模块 2 判断是否作为下游消费方保留;页面、筛选和查询 API 后置。 |
| 输出消费 | `L5-console` | 作为管理入口消费 Artifact facts 和只读管理视图。 | console 是产品 / 管理入口,可能经正式边界查看制品事实。 | 模块 2 判断是否通过 SDK / workspace 间接消费,避免写成直接 truth 依赖。 |
| 输出消费 | `L4-archive` | 消费 Artifact 版本、baseline、发布和封存事实,用于归档、恢复或合规包。 | Step 4 已明确 archive 可封存 Artifact,但不拥有 Artifact 正文 truth。 | 模块 2 判断归档消费边;归档包格式、恢复流程后置。 |
| 输出 / 横切消费 | `L4-observability` | 消费 Artifact 血缘、质量、完整性和审计线索。 | 全局产品线索把可追溯性与 artifact 血缘、observability 横切审计关联。 | 模块 2 判断是否作为事件 / 追溯协作保留;指标、告警、日志存储后置。 |
| 输出访问边界 | `L0-sdk` | 为产品、同步和外部入口提供 Artifact 能力访问边界。 | 全局依赖规则中 L5 / L6 倾向经 SDK 消费内部能力。 | 模块 2 判断是否直接进入 Step 6 主链;不能绕过正式服务边界。 |
| 输出消费 | `L5-sync` | 可能经 SDK 同步 workspace、archive 或 artifact 状态。 | 全局基线提到 sync 经 SDK 消费 workspace / archive / artifact。 | 模块 2 多半裁剪为非主链或间接消费,避免扩写同步协议。 |
| 弱候选 / 待裁剪 | `L2-runtime` | 可能消费 Artifact 作为运行证据、任务产物或执行材料引用。 | 自动化执行可能产出制品,但 runtime execution truth 不归 artifact。 | 模块 2 判断是否只经 work / process / governance 间接成立。 |
| 弱候选 / 待裁剪 | `L3-capability-hub` | 可能消费 Artifact 作为能力产物、工具输出或能力治理证据线索。 | 工具和能力可能产出或引用制品,但 capability registration truth 不归 artifact。 | 模块 2 判断是否直接进入主链;能力注册和工具执行后置。 |

### 8.2 候选关系边界

| 边界 | 当前结论 |
|---|---|
| 候选不等于正式依赖 | 上表只是模块 2 的输入,不代表依赖类型、主链范围或闭环前置已成立。 |
| 相邻仓不拥有 Artifact truth | work、process、governance、conversation、workspace、observability、archive、console、sync 等只能引用、消费、展示、审计、封存或协作 Artifact truth。 |
| 事件只作为协作线索 | 本模块不写 `artifact.*` 事件名、payload、订阅关系或保留期。 |
| 外部基础设施不进入模块 1 | 数据库、对象存储、Git、S3、搜索、向量库、审计平台等留到模块 4 裁剪。 |
| 角色不回写为依赖 | 制品作者、Reviewer、Auditor、Owner 等已在 Step 5 处理,不进入仓际关系候选表。 |

### 8.3 后续输入

模块 2 `全局依赖裁剪:先思考` 应基于上述候选表做三件事:

- 回贴 `standards/document/全局项目依赖关系与裁剪规则.md` 中与 `L1-artifact` 直接相关的边。
- 区分哪些候选是编译期、运行期、事件协作、输出消费或应裁剪为非主链。
- 识别哪些候选没有全局基线支撑,只能作为弱候选、间接消费或后续阶段线索。

当前模块 1 已完成。下一步只能进入 `模块 2 全局依赖裁剪:先思考`,不得直接写模块 2 裁剪结论、结构化中间产物或正式第 6 章草稿。

## 9. 模块 2 全局依赖裁剪:先思考

### 9.1 本模块要回答的问题

模块 2 要把模块 1 的宽候选关系回贴到 `standards/document/全局项目依赖关系与裁剪规则.md`。本模块只做裁剪诊断,不直接产出最终裁剪表。真正的“关联项目 / 全局关系 / 本仓角色 / 依赖类型 / 是否进入当前文档主链 / 裁剪理由”表,留到 `模块 2 全局依赖裁剪:再写入`。

本模块的判断问题如下:

| 判断问题 | 当前口径 |
|---|---|
| 哪些候选来自 `L1-artifact` 自己的全局矩阵行 | 优先作为直接基线候选。 |
| 哪些候选来自其他仓对 artifact 的消费行 | 可作为 `L1-artifact` 的输出消费或被依赖边候选。 |
| 哪些候选只有产品 / 事件 / 旧材料线索 | 暂列弱候选或后续阶段线索,不得直接写成主链依赖。 |
| 哪些候选不得进入编译期依赖 | 所有 L1/L2/L3/L4/L5 关系默认不得写成 Cargo / package dependency。 |

### 9.2 全局基线直接给出的关系

全局矩阵中 `L1-artifact` 自身一行给出三条直接基线:

| 基线项 | 全局矩阵口径 | 对模块 2 的含义 |
|---|---|---|
| 编译期依赖 | `L1-artifact` 编译期依赖 `L0-core`。 | `L0-core` 是唯一直接编译期候选;后续禁止把 work / process / governance 等写成编译期依赖。 |
| 运行期依赖 | `L1-artifact` 按需消费 governance / work / process 引用。 | `L1-governance`、`L1-work`、`L1-process` 是运行期引用候选,但只消费引用 / 边界,不拥有对方 truth。 |
| 事件协作依赖 | `L1-artifact` 通过 `L0-bus` 发布制品事件。 | `L0-bus` 是事件协作主干;Step 6 不写事件名、payload 或订阅关系。 |

这三条是模块 2 再写入时最稳的主线。它们也决定了一个红线:`L1-artifact` 不能为了消费 work / process / governance 引用而对这些 L1 仓形成源码级依赖。

### 9.3 由其他仓矩阵行反向裁剪出的消费关系

模块 1 中若干候选不是 `L1-artifact` 自身行直接列出,而是其他仓的全局矩阵行显示“对 artifact 或 L1 truth 的消费”。这些关系可以作为 `L1-artifact` 的输出消费候选,但不能反向改变 Artifact truth。

| 候选对象 | 全局矩阵线索 | 当前诊断 |
|---|---|---|
| `L1-conversation` | conversation 按需消费 identity / governance / artifact 能力边界。 | 可作为 artifact 输出消费候选;只消费引用、显化或预览语境,不拥有正文 / 血缘 truth。 |
| `L1-work` | work 按需消费 process / governance / artifact。 | 与 `L1-artifact` 自身运行期消费 work 引用形成双向协作候选;必须保持 truth 分离。 |
| `L1-governance` | governance 按需消费 process / artifact evidence boundary。 | 与 `L1-artifact` 自身消费 governance 引用形成双向协作候选;治理结论归 governance,证据 / 正文归 artifact。 |
| `L1-workspace` | workspace 只读消费 L1 真相域查询 / 投影,订阅 L1 事件维护视图。 | 可作为只读视图 / 事件协作消费候选;不拥有 Artifact truth。 |
| `L4-archive` | archive 消费 L1 domain snapshot / export 能力,通过 `L0-bus` 消费归档相关事件。 | 可作为归档 / 恢复消费候选;归档包不替代 Artifact truth。 |
| `L5-sync` | sync 经 SDK 消费 workspace / archive / artifact。 | 有直接 artifact 消费线索,但属于产品 / CLI 层,应谨慎判断是否进入当前主链。 |
| `L0-sdk` | SDK 封装 L1 / L2 / L3 / L4 API 和事件消费。 | 可作为访问边界候选,但不是 Artifact truth 的上游依赖。 |
| `L5-console` | console 经 SDK 消费 L1 / L2 / L3 / L4 管理 API。 | 可作为后台管理入口消费候选,通常经 SDK 间接成立。 |

这些候选在模块 2 再写入时可以进入裁剪表,但要区分“被依赖方 / 输出消费方 / 间接消费方”。其中 workspace、archive、SDK、console、sync 都不能被写成 `L1-artifact` 的基础闭环前置。

### 9.4 弱候选和待裁剪对象

| 候选对象 | 当前诊断 | 倾向处理 |
|---|---|---|
| `L1-identity` | 全局矩阵没有把 identity 列为 `L1-artifact` 的直接运行期依赖;Step 5 的作者、审查者、actor / member 引用可以先通过 `L0-core` 共享 ref 语义表达。 | 暂不直接进入模块 2 主链;若后续需要身份解析,留给 Step 12 或详细设计重新裁剪。 |
| `L3-method-library` | 产品和事件线索显示 work product definition / kind 可能影响 artifact,但全局矩阵没有把 method-library 写成 `L1-artifact` 的直接运行期依赖。 | 暂列定义来源弱候选;不得在 Step 6 直接固化 kind 枚举或源码依赖。 |
| `L2-runtime` | runtime 运行期依赖 method-library / capability-hub / tools,没有直接 artifact 基线;自动化产出制品更可能经 work / process / governance 或正式 API 进入 artifact。 | 不作为直接主链依赖;后续作为产出来源或系统 actor 语境处理。 |
| `L3-capability-hub` | capability-hub 管理能力注册与治理,没有直接 artifact 基线。 | 不作为直接主链依赖;工具产物或能力证据线索后置。 |
| `L4-observability` | 全局矩阵表达 observability 通过 `L0-bus` 消费 tap / audit material,未明确直接消费 artifact;产品线索存在可追溯和审计横切关系。 | 可作为横切协作候选,但是否进入主链需谨慎,不得反写 Artifact truth。 |
| `L2-member-service` / `L2-member` | 模块 1 未列为 artifact 候选,全局矩阵也无 artifact 直接边。 | 当前不进入 Step 6 artifact 主链。 |

弱候选并不等于“不相关”。它们只是缺少当前 Step 6 直接主链所需的全局基线支撑,或更适合在 Step 12、详细设计、配置设计、实施计划中重新裁剪。

### 9.5 裁剪取舍

| 取舍问题 | 方案 A | 方案 B | 当前推荐 |
|---|---|---|---|
| 是否只保留 `L1-artifact` 自身行 | 文档最短,但无法说明 conversation / workspace / archive / SDK 等消费方。 | 在自身行之外,补入其他仓矩阵行显示的 artifact 消费方。 | 采用 B,但明确这些是输出消费或间接消费,不是基础前置。 |
| 是否把 identity 写成直接运行期依赖 | 作者 / 审查者需要身份引用,看起来合理。 | 先通过 `L0-core` ref 语义表达,不在 Step 6 扩出未写入全局基线的直接边。 | 采用 B,避免自行扩展全局依赖。 |
| 是否把 method-library 写成直接运行期依赖 | Artifact kind / WorkProduct 定义可能来自 method-library。 | 先列弱候选,不在 Step 6 固化 kind 定义依赖。 | 采用 B,后续如需要由 Step 11 / 12 重新裁剪。 |
| 是否把 runtime / capability-hub 写成直接依赖 | 自动化产出制品可能相关。 | 不直接进入主链,通过正式产出、work / process / governance 语境或 SDK 进入。 | 采用 B,避免执行 truth 反向定义 Artifact truth。 |
| 是否把 observability 写入主链 | 审计和可追溯很重要。 | 可作为横切消费候选,但不作为 artifact truth 成立前置。 | 倾向 B,在再写入时谨慎标注。 |

### 9.6 模块 2 再写入建议

`模块 2 全局依赖裁剪:再写入` 应形成一张裁剪候选表,字段使用全局规范要求:

```text
关联项目 / 全局关系 / 本仓角色 / 依赖类型 / 是否进入当前文档主链 / 裁剪理由
```

写入时建议按以下顺序:

1. 先写 `L0-core` 和 `L0-bus`。
2. 再写 `L1-governance`、`L1-work`、`L1-process` 三条 `L1-artifact` 自身行直接给出的运行期引用关系。
3. 再写其他仓矩阵行中明确消费 artifact 或 L1 truth 的输出消费方,如 conversation、workspace、archive、SDK、console、sync。
4. 最后写弱候选或不进入当前主链的对象,如 identity、method-library、runtime、capability-hub、observability,并说明裁剪原因。

模块 2 先思考完成时的下一小步是 `模块 2 全局依赖裁剪:再写入`;该小步现已完成,当前恢复点以后续章节和项目台账为准。

## 10. 模块 2 全局依赖裁剪:再写入

### 10.1 本仓依赖裁剪候选表

下表按全局依赖规则裁剪 `L1-artifact` 相关子图。它是后续模块 3~5 的输入,不是最终第 6 章正文;闭环前置、失效影响、类型分类、禁止依赖和 ASCII 图仍需后续模块继续确认。

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | `L1-artifact` 编译期依赖 `L0-core`。 | 依赖方 | 编译期 | 是 | 共享 ID、引用、trace、错误和基础契约是 Artifact 正文、版本、血缘与基线事实跨仓表达的基础。 |
| `L0-bus` | `L1-artifact` 通过 `L0-bus` 发布制品事件。 | 协作方 | 事件协作 | 是 | Artifact 事实变化需要进入跨仓协作;本步只确认事件协作类型,不写事件名、payload 或订阅关系。 |
| `L1-governance` | `L1-artifact` 按需消费 governance 引用;`L1-governance` 按需消费 artifact evidence boundary。 | 协作方 | 运行期 / 事件协作 | 是 | AIIA / SoA / evidence、批准和基线语境需要双向引用,但治理决策 truth 归 governance,Artifact 正文 / evidence body 归 artifact。 |
| `L1-work` | `L1-artifact` 按需消费 work 引用;`L1-work` 按需消费 artifact。 | 协作方 | 运行期 / 事件协作 | 是 | 项目、工作对象、工作产出和基线关联需要协作;work truth 不归 artifact,Artifact truth 不归 work。 |
| `L1-process` | `L1-artifact` 按需消费 process 引用;process 通过活动产出 / 输入语境与 artifact 协作。 | 协作方 | 运行期 / 事件协作 | 是 | Activity、过程产出和过程节点可提供 Artifact 语境;process truth 不归 artifact。 |
| `L1-conversation` | conversation 按需消费 identity / governance / artifact 能力边界。 | 被依赖方 | 运行期 / 事件协作 | 是 | 对话可显化、分享或追溯 Artifact 引用和版本事实,但 conversation 不拥有 Artifact 正文或血缘。 |
| `L1-workspace` | workspace 只读消费 L1 真相域查询 / 投影,订阅 L1 事件维护视图。 | 被依赖方 | 运行期 / 事件协作 | 是 | 工作台可消费 Artifact facts 的只读视图,但 workspace 只拥有视图局部状态。 |
| `L4-archive` | archive 消费 L1 domain snapshot / export 能力,并通过 `L0-bus` 消费归档相关事件。 | 被依赖方 | 运行期 / 事件协作 | 是 | 归档、恢复和合规包需要消费 Artifact 版本、baseline 和发布事实,但归档包不替代 Artifact truth。 |
| `L0-sdk` | SDK 封装 L1 / L2 / L3 / L4 API,按能力封装事件消费。 | 被依赖方 | 运行期 | 是 | 上层产品、同步和外部入口默认应通过正式访问边界消费 Artifact 能力,不得直接绑定 artifact 源码。 |
| `L5-console` | console 经 SDK 消费 L1 / L2 / L3 / L4 管理 API。 | 被依赖方 | 运行期 | 是 | 管理入口可经 SDK 查看或管理 Artifact facts,但 UI / 管理视图不拥有 Artifact truth。 |
| `L5-sync` | sync 经 SDK 消费 workspace / archive / artifact。 | 被依赖方 | 运行期 | 是 | CLI / 同步库存在 artifact 消费线索,但必须经 SDK 或正式边界;同步协议和离线策略后置。 |
| `L4-observability` | observability 通过 `L0-bus` 消费 tap / audit material。 | 协作方 | 事件协作 / 追溯交接 | 是 | Artifact 血缘、完整性和审计线索会被横切观测消费;observability 不反写 Artifact truth,指标和日志存储后置。 |
| `L1-identity` | identity 自身不在 `L1-artifact` 运行期依赖行中;全局基线只给 identity 通过 `L0-bus` 发布成员事件。 | 候选上游引用方 | 非直接主链 | 否 | 作者、审查者、actor / member 可先通过 `L0-core` typed ref 语义表达;若需身份解析,留到 Step 12 或后续设计裁剪。 |
| `L3-method-library` | method-library 按需对外提供 method / role / process template 定义,但未写成 `L1-artifact` 直接运行期依赖。 | 候选定义来源 | 非直接主链 | 否 | WorkProduct / Artifact kind 定义有线索,但当前 Step 6 不固化 kind 枚举、definition schema 或源码依赖。 |
| `L2-runtime` | runtime 消费 method-library / capability-hub / tools 能力,没有 artifact 直接基线。 | 弱候选消费方 | 非直接主链 | 否 | 自动化执行可能产出制品,但 execution truth 不归 artifact;制品进入应经 work / process / governance 或正式 API。 |
| `L3-capability-hub` | capability-hub 管理能力注册与治理,没有 artifact 直接基线。 | 弱候选消费方 | 非直接主链 | 否 | 工具产物或能力证据可能关联 Artifact,但能力注册和工具适配 truth 不归 artifact。 |
| `L2-member` / `L2-member-service` | 全局矩阵未给出 artifact 直接边。 | 非当前候选 | 非主链 | 否 | 成员运行和容器编排不直接定义 Artifact truth;如需协作,应通过 identity / work / policy / SDK 等正式边界。 |
| `L5-chat` / `L5-runner` / `L6-bridges` / `L6-marketplace` | 产品 / 生态层经 SDK 或公开 API 消费内部能力。 | 间接消费方 | 非主链 | 否 | 当前第 6 章以 artifact 直接相关子图为主,产品入口和外部平台接入后置到 SDK / 产品 / 集成边界。 |

### 10.2 裁剪结论分层

| 分层 | 关联项目 | 当前处理 |
|---|---|---|
| 直接基线 | `L0-core`;`L0-bus`;`L1-governance`;`L1-work`;`L1-process` | 必须进入后续结构化中间产物。 |
| 输出消费 / 协作 | `L1-conversation`;`L1-workspace`;`L4-archive`;`L4-observability`;`L0-sdk`;`L5-console`;`L5-sync` | 可进入 Step 6 主链,但不得被写成 Artifact truth 前置或编译期依赖。 |
| 弱候选 / 后续阶段 | `L1-identity`;`L3-method-library`;`L2-runtime`;`L3-capability-hub` | 当前不作为直接主链依赖,后续如需解析、定义或执行协作,由 Step 11 / Step 12 / 详细设计重新裁剪。 |
| 裁剪排除 | `L2-member`;`L2-member-service`;`L5-chat`;`L5-runner`;`L6-bridges`;`L6-marketplace` | 当前不进入 `L1-artifact` Step 6 直接子图。 |

### 10.3 防混层结论

| 风险 | 当前裁剪口径 |
|---|---|
| 把 L1 相邻仓写成编译期依赖 | 只允许 `L0-core` 作为编译期依赖;work / process / governance / conversation / workspace 等只能运行期或事件协作。 |
| 把下游消费方写成 truth 前置 | conversation、workspace、archive、observability、SDK、console、sync 都是消费 / 协作方,不反向定义 Artifact 正文、版本、血缘或基线事实。 |
| 把弱候选写成正式依赖 | identity、method-library、runtime、capability-hub 只作为后续裁剪线索,当前不进入直接主链。 |
| 把接口、事件、SLA 写入依赖章 | 当前只写依赖类型和能力级关系,不写事件名、API、DTO、payload、订阅关系、P95 或容量指标。 |

### 10.4 后续输入

模块 3 `闭环前置与失效影响:先思考` 应基于本裁剪候选表继续判断:

- 哪些依赖是 `L1-artifact` 基础制品事实闭环前置。
- 哪些只是场景前置,例如 governance / work / process 语境缺失时的降级。
- 哪些只是输出消费方,失效时不应阻塞 Artifact truth 成立。

当前模块 2 已完成。下一步只能进入 `模块 3 闭环前置与失效影响:先思考`,不得直接写模块 3 结论、依赖类型分类表、禁止依赖表、ASCII 图或正式第 6 章草稿。

## 11. 模块 3 闭环前置与失效影响:先思考

### 11.1 本模块要回答的问题

模块 3 要回答“哪些依赖会阻塞 `L1-artifact` 的当前阶段能力闭环”。这里的闭环不是泛泛的全部协作可用,而是要区分至少四层:

| 层级 | 判断问题 | 当前解释 |
|---|---|---|
| 基础事实闭环前置 | 没有它,Artifact 正文、版本、血缘与基线事实是否无法稳定表达? | 这是最强阻塞层。 |
| 平台协作前置 | 没有它,Artifact facts 能否跨仓发布、被消费或形成平台级协作? | 可能不破坏本仓 truth,但会阻塞跨仓协作闭环。 |
| 场景前置 | 没有它,某些 work / process / governance 场景是否只能降级? | 只阻塞对应场景,不阻塞全部 Artifact truth。 |
| 输出消费方 | 没有它,展示、归档、观测、同步或管理入口是否退化? | 只影响消费和显化,不得反向修改 Artifact truth。 |

本模块只做分层诊断,不直接产出最终“闭环前置与失效影响结论表”。该结论表留到 `模块 3 闭环前置与失效影响:再写入`。

### 11.2 基础事实闭环诊断

| 候选依赖 | 是否可能阻塞基础事实闭环 | 诊断 |
|---|---|---|
| `L0-core` | 是 | Artifact 正文、版本、血缘与基线事实需要共享 ID、typed ref、trace、error 和基础契约语境。没有 `L0-core`,跨仓引用和事实表达会失去统一口径。 |
| `L0-bus` | 部分是 | `L0-bus` 不应承载 Artifact truth 本身,但它是制品事实变化进入平台协作的事件主干。没有它,本仓局部事实可表达,但平台协作闭环不完整。 |
| `L1-governance` | 否,但部分场景是 | governance 是 AIIA / SoA / evidence / approval / baseline 语境的重要来源或消费方;缺失时相关治理场景降级,但不能阻止普通 Artifact truth 成立。 |
| `L1-work` | 否,但部分场景是 | work 提供项目、工作对象和产出归属语境;缺失时项目 / WorkItem 关联场景降级,但 artifact 不补造 work truth。 |
| `L1-process` | 否,但部分场景是 | process 提供 activity / process output 语境;缺失时过程产出关联降级,但不阻塞 Artifact 正文和版本事实成立。 |

当前倾向是:基础事实闭环最强前置为 `L0-core`;`L0-bus` 是平台协作闭环前置;governance / work / process 是场景前置,不是全部 Artifact truth 的强前置。

### 11.3 输出消费方失效诊断

| 消费 / 协作方 | 失效影响 | 不能做的事 |
|---|---|---|
| `L1-conversation` | 对话显化、分享、预览或追溯入口退化。 | 不能因此让 conversation 拥有 Artifact 正文或血缘。 |
| `L1-workspace` | 工作台聚合视图、只读查询和事件投影退化。 | 不能让 workspace 反向定义 Artifact truth。 |
| `L4-archive` | 归档、恢复、合规包和长期封存消费退化。 | 不能让归档包替代 Artifact 正文、版本或 baseline truth。 |
| `L4-observability` | 审计、追溯、指标和完整性观测退化。 | 不能把日志、指标或审计存储写成 Artifact lineage truth。 |
| `L0-sdk` | 上层产品、同步和外部入口的一致访问边界退化。 | 不能鼓励产品层直接绑定 artifact 源码或内部实现。 |
| `L5-console` | 管理入口和后台只读管理视图退化。 | 不能把 UI 状态写成本仓事实。 |
| `L5-sync` | CLI / 同步库消费和离线同步场景退化。 | 不能在 Step 6 写同步协议或离线一致性规则。 |

这些对象对平台体验和下游消费重要,但不是 Artifact truth 成立的基础前置。模块 3 再写入时应把它们标为“消费退化”或“输出协作退化”,而不是“阻塞闭环”。

### 11.4 弱候选失效诊断

| 对象 | 当前判断 | 失效影响 |
|---|---|---|
| `L1-identity` | 当前不作为直接主链依赖。 | 若缺身份解析,作者 / 审查者 / actor 显示或校验场景降级;Artifact 可先保存 typed ref,不补造 identity truth。 |
| `L3-method-library` | 当前不作为直接主链依赖。 | 若缺方法或 work product definition,kind 定义或模板来源场景降级;Step 6 不固化 kind 枚举。 |
| `L2-runtime` | 当前不作为直接主链依赖。 | 自动化执行产出入口可能降级;runtime execution truth 不归 artifact。 |
| `L3-capability-hub` | 当前不作为直接主链依赖。 | 工具产物、能力证据或能力注册相关场景降级;能力注册 truth 不归 artifact。 |

弱候选失效不能作为当前 Step 6 的 blocker。它们应在后续 Step 11 / Step 12 / 详细设计中根据实际数据、接口或实现边界重新裁剪。

### 11.5 取舍

| 取舍问题 | 方案 A | 方案 B | 当前推荐 |
|---|---|---|---|
| 是否把所有进入主链的关系都写成闭环前置 | 简单,但会让下游消费方过重。 | 分为基础事实、平台协作、场景前置和输出消费。 | 采用 B。 |
| 是否把 `L0-bus` 写成基础 truth 前置 | 强调事件协作。 | 把事件主干和 truth 存储混在一起。 | 采用折中:平台协作前置,不是正文 / 版本 truth 本体。 |
| 是否把 governance / work / process 都写成强前置 | 能体现跨域协作。 | 会误导为 Artifact 必须依赖相邻仓才成立。 | 采用场景前置。 |
| 是否把 archive / observability 写成强前置 | 强调审计和归档重要性。 | 会让横切仓反向定义 Artifact truth。 | 采用消费退化。 |
| 是否把 identity / method-library 纳入闭环前置 | 能覆盖作者和 kind 定义。 | 当前缺全局直接边,容易自行扩展依赖。 | 当前不纳入,后续重新裁剪。 |

### 11.6 模块 3 再写入建议

`模块 3 闭环前置与失效影响:再写入` 应形成一张分层结论表,建议字段为:

```text
层级 / 关联项目 / 是否阻塞当前阶段能力 / 失效影响 / 降级口径
```

写入时建议按以下顺序:

1. 先写 `L0-core` 和 `L0-bus` 的基础 / 协作前置。
2. 再写 governance / work / process 的场景前置。
3. 再写 conversation / workspace / archive / observability / SDK / console / sync 的输出消费退化。
4. 最后写 identity / method-library / runtime / capability-hub 的非主链或后续重裁剪口径。

本节建议已由 §12 `模块 3 闭环前置与失效影响:再写入` 承接;当前恢复点以文件顶部和 §12.4 为准。

## 12. 模块 3 闭环前置与失效影响:再写入

### 12.1 闭环前置与失效影响结论表

下表固化模块 3 的分层结论。这里的“阻塞”只指当前阶段能力闭环,不等于后续所有业务场景都必须同时可用。

| 层级 | 关联项目 | 是否阻塞当前阶段能力 | 失效影响 | 降级口径 |
|---|---|---|---|---|
| 基础事实闭环前置 | `L0-core` | 是 | Artifact 正文、版本、血缘与基线事实缺少统一 ID、typed ref、trace、error 和基础契约语境,跨仓事实表达不可稳定成立。 | 当前阶段不能绕过 `L0-core` 自行定义基础引用和错误语义;若缺失,Step 7 核心闭环不得继续假设可用。 |
| 平台协作前置 | `L0-bus` | 部分阻塞 | 本仓局部 Artifact truth 仍可表达,但 Artifact 事实变化无法进入跨仓事件协作,work / process / governance / archive / observability 等消费链路退化。 | 只降级跨仓协作和异步消费;不得把 `L0-bus` 写成 Artifact truth 存储或正文承载。 |
| 场景前置 | `L1-governance` | 阻塞治理场景,不阻塞全部 Artifact truth | AIIA、SoA、evidence、approval、baseline 相关治理语境降级;治理裁决无法完整联动 Artifact evidence。 | Artifact 可保留治理 typed ref 或待解析状态;不得补造 governance decision truth。 |
| 场景前置 | `L1-work` | 阻塞工作场景,不阻塞全部 Artifact truth | 项目、工作对象、工作产出归属和工作基线关联降级;WorkItem 视角无法完整消费 Artifact facts。 | Artifact 可保留 work typed ref 或缺语境状态;不得补造 work truth。 |
| 场景前置 | `L1-process` | 阻塞过程场景,不阻塞全部 Artifact truth | Activity、过程产出、过程节点和过程输入 / 输出关联降级;过程推进视角无法完整消费 Artifact facts。 | Artifact 可保留 process typed ref 或缺语境状态;不得补造 process truth。 |
| 输出消费退化 | `L1-conversation` | 否 | 对话显化、分享、预览和追溯入口退化。 | 不影响 Artifact truth;conversation 只能消费引用和展示语境,不能拥有正文或血缘。 |
| 输出消费退化 | `L1-workspace` | 否 | 工作台聚合视图、只读查询、事件投影和操作入口退化。 | 不影响 Artifact truth;workspace 只能拥有视图局部状态,不能反向定义 Artifact facts。 |
| 输出消费退化 | `L4-archive` | 否 | 归档、恢复、合规包和长期封存消费退化。 | 不影响当前 Artifact truth;归档包不能替代 Artifact 正文、版本、血缘或 baseline truth。 |
| 输出 / 横切消费退化 | `L4-observability` | 否 | 审计、追溯、指标、完整性观测和横切告警退化。 | 不影响 Artifact truth;日志、指标和审计存储不能替代 Artifact lineage truth。 |
| 访问边界退化 | `L0-sdk` | 否,但影响上层一致访问 | 上层产品、同步库和外部入口访问 Artifact 能力的一致边界退化。 | 产品层不得因此直接绑定 artifact 源码或内部实现;正式访问边界后续在 Step 12 裁剪。 |
| 输出消费退化 | `L5-console` | 否 | 管理入口、后台只读管理视图和人工操作入口退化。 | 不影响 Artifact truth;UI / 管理状态不得写成本仓事实。 |
| 输出消费退化 | `L5-sync` | 否 | CLI / 同步库消费、离线同步和跨环境显化场景退化。 | 不影响 Artifact truth;同步协议、离线一致性和冲突策略后置。 |
| 非直接主链 / 后续重裁剪 | `L1-identity` | 否 | 作者、审查者、actor / member 的显示、解析或校验场景可能降级。 | 当前先以 `L0-core` typed ref 表达引用;如需身份解析,后续 Step 12 或详细设计重新裁剪。 |
| 非直接主链 / 后续重裁剪 | `L3-method-library` | 否 | WorkProduct / Artifact kind、方法产出定义或模板来源场景可能降级。 | 当前不固化 kind 枚举或 definition schema;如需定义来源,后续 Step 11 / Step 12 重裁剪。 |
| 非直接主链 / 后续重裁剪 | `L2-runtime` | 否 | 自动化执行产出入口、运行证据或任务产物引用场景可能降级。 | runtime execution truth 不归 artifact;制品进入应经正式产出边界、work / process / governance 或 SDK。 |
| 非直接主链 / 后续重裁剪 | `L3-capability-hub` | 否 | 工具产物、能力证据或能力注册相关场景可能降级。 | capability registration truth 不归 artifact;工具适配和能力治理后置。 |

### 12.2 分层结论

| 分层 | 固化结论 |
|---|---|
| 最强前置 | `L0-core` 是当前阶段 Artifact facts 能稳定表达的基础事实闭环前置。 |
| 协作前置 | `L0-bus` 是平台事件协作前置,不是 Artifact truth 存储或正文承载。 |
| 场景前置 | `L1-governance`、`L1-work`、`L1-process` 只阻塞各自治理、工作、过程场景;不阻塞全部 Artifact truth。 |
| 消费退化 | conversation、workspace、archive、observability、SDK、console、sync 失效时表现为消费、显化、归档、追溯或访问边界退化。 |
| 后续重裁剪 | identity、method-library、runtime、capability-hub 当前不进入直接主链;后续如触发具体数据或接口需求再重裁剪。 |

### 12.3 禁止推论

| 禁止推论 | 原因 |
|---|---|
| 不得把所有进入主链的关系都写成强前置。 | Step 6 需要区分基础事实、平台协作、场景前置和输出消费。 |
| 不得把 `L0-bus` 写成 Artifact truth 本体。 | 事件主干只承载跨仓协作,不承载正文、版本、血缘或 baseline facts。 |
| 不得用 governance / work / process 缺失阻止普通 Artifact truth 成立。 | 这些仓提供场景语境,但不拥有 Artifact 正文、版本、血缘与基线事实。 |
| 不得让 archive / observability / workspace 反向定义 Artifact truth。 | 它们是消费方或横切方,不是 Artifact truth owner。 |
| 不得把 identity / method-library / runtime / capability-hub 私自升级为直接主链依赖。 | 当前全局基线未给出直接边,后续需要在数据、接口或详细设计阶段重新裁剪。 |

### 12.4 后续输入

模块 4 `外部系统依赖与裁剪:先思考` 应基于上述结论继续判断:

- 对象存储、数据库、Git、搜索、向量库、审计平台、文档系统等是否属于当前需求主链外部依赖。
- 哪些外部系统线索只是旧材料、架构实现、NFR 或配置候选。
- 哪些外部系统不得被写成 Artifact truth 前置。

当前模块 3 已完成。下一步只能进入 `模块 4 外部系统依赖与裁剪:先思考`,不得直接写外部系统依赖结论、依赖类型分类表、禁止依赖表、ASCII 图或正式第 6 章草稿。

## 13. 模块 4 外部系统依赖与裁剪:先思考

### 13.1 本模块要回答的问题

模块 4 要回答“旧材料和上游线索中出现的外部系统,是否应成为当前需求主链的正式外部系统依赖”。这里的外部系统不是内部仓,也不是后续架构实现组件。只有当某个外部系统已经成为本仓能力成立的明确前置,或已经形成正式协作边界时,才允许进入 Step 6。

本模块只做裁剪诊断,不直接产出最终外部系统依赖表。结论表留到 `模块 4 外部系统依赖与裁剪:再写入`。

### 13.2 外部系统候选来源

| 来源 | 出现的外部系统 / 技术线索 | 当前使用限制 |
|---|---|---|
| 旧 README | Rust、PostgreSQL、Git、S3 / MinIO、inline、external URL、向量库。 | 只作历史技术线索,不得继承为当前需求依赖。 |
| 旧 `00-需求文档.md` | PostgreSQL、Git / S3 / URL 存储、多后端内容存储、向量检索系统本体。 | 只能做差异审计,不得继承旧 SLA、后端清单或多后端策略。 |
| 旧 `01/02/03` | content adapter、object storage、search / browse index、DB、cold storage、graph DB 备选。 | 属于架构 / 详细设计历史材料,不得反推需求主链。 |
| 旧 `05/06` | fake storage、test DB、controlled content backend、search backend 若后续外置。 | 属于测试和验收历史线索,不得提前定义当前 Step 6 外部依赖。 |
| 需求书写规范 | 仅当外部系统成为能力成立前置或正式协作边界时才写入;否则显式写无正式外部系统依赖。 | 模块 4 需要给出“进入 / 不进入”的能力级理由。 |

### 13.3 候选诊断

| 外部系统候选 | 是否可能进入当前主链 | 诊断 |
|---|---|---|
| 关系数据库 / PostgreSQL | 否 | 旧材料把 DB 写成主库和存储方案,但当前需求阶段不选择数据库,也不把数据库可用性写成仓际依赖。持久化方案应后置到架构 / 详细设计 / 配置设计。 |
| 对象存储 / S3 / MinIO | 否 | Artifact 正文可能需要物理承载,但对象存储是实现后端候选,不是 Artifact truth owner。当前只能保留“正文承载不得反向定义 truth”的边界。 |
| Git content backend | 否 | Git 可作为代码类内容后端历史线索,但不能在需求 Step 6 固化为正式外部依赖。代码制品、版本和血缘 truth 应由 artifact 语义表达,不是由 Git 仓替代。 |
| external URL / 外部文档链接 | 否 | 外部 URL 可作为引用来源或导入线索,但不能作为当前 Artifact 正文、版本或 baseline truth 的正式前置。 |
| inline storage | 否 | inline 是存储策略或实现模式,不是外部系统。 |
| 搜索 / browse index / OpenSearch / Elasticsearch | 否 | 搜索和 browse 是读侧体验或投影能力,可退化、可重建,不得替代正式 Artifact / Version / Lineage truth。 |
| 向量库 / 语义检索系统 | 否 | 旧需求已把向量检索系统本体列为非目标;当前仍不把它写成 Step 6 外部系统依赖。 |
| 外部审计平台 / 日志系统 | 否 | 审计和观测应优先通过内部 `L4-observability` / `L4-archive` 协作边界表达;外部审计平台不直接拥有 Artifact truth。 |
| 外部归档 / cold storage | 否 | 冷存储是归档实现线索;当前归档协作由 `L4-archive` 表达,不直接写外部 cold storage 依赖。 |
| 外部身份提供方 | 否 | 作者、审查者、actor 可先以 typed ref 表达;身份解析不在当前 Step 6 外部系统主链。 |
| 外部通知 / 邮件 / webhook | 否 | 通知属于产品、集成或事件消费线索,不定义 Artifact truth;如后续需要,由 Step 12 或集成设计裁剪。 |

### 13.4 关键取舍

| 取舍问题 | 方案 A | 方案 B | 当前推荐 |
|---|---|---|---|
| 是否继承旧 `PostgreSQL + Git/S3/URL` 外部依赖表 | 写起来完整,并贴近旧文档。 | 会把历史实现方案伪装成当前需求前置。 | 不继承旧表。 |
| 是否把“正文承载后端”写成正式外部依赖 | 能体现 Artifact 正文可能不全部内嵌。 | 会提前指定存储边界和技术方案。 | 当前不写具体外部系统;只保留 truth 边界,后续 Step 11 / Step 12 / 04 再裁剪。 |
| 是否把 search / browse / vector 写入外部系统依赖 | 读侧体验完整。 | 搜索、浏览、语义检索不是 Artifact truth 前置。 | 当前不进入主链,最多作为后续 NFR / 读侧设计线索。 |
| 是否把外部审计平台写入主链 | 强化合规叙事。 | 容易绕过内部 archive / observability 真相边界。 | 当前不写外部审计平台;用内部协作方表达。 |

### 13.5 初步结论倾向

当前阶段倾向为:Step 6 不纳入正式外部系统依赖。旧材料中的 PostgreSQL、Git、S3 / MinIO、URL、搜索引擎、向量库、审计平台、cold storage 等都应裁剪为历史技术线索、后续架构 / 配置 / NFR / 接口输入,而不是需求主链外部系统依赖。

这不表示 `L1-artifact` 不需要持久化、正文承载、查询或归档能力;只是这些能力在需求阶段应由本仓能力边界、内部仓协作和后续 Step 11 / Step 12 / Step 13 / 配置设计承接,不能在 Step 6 提前锁死具体外部系统。

### 13.6 模块 4 再写入建议

`模块 4 外部系统依赖与裁剪:再写入` 应形成一张裁剪结论表,建议字段为:

```text
外部系统候选 / 来源线索 / 是否进入当前主链 / 裁剪理由 / 后续归属
```

写入时建议按以下顺序:

1. 先写持久化和内容后端候选:数据库、对象存储、Git、URL、inline。
2. 再写读侧和检索候选:search / browse index、向量库。
3. 再写横切和集成候选:外部审计平台、cold storage、身份提供方、通知 / webhook。
4. 最后给出“当前阶段无正式外部系统依赖”的收束句。

本节建议已由 §14 `模块 4 外部系统依赖与裁剪:再写入` 承接;当前恢复点以文件顶部和 §14.5 为准。

## 14. 模块 4 外部系统依赖与裁剪:再写入

### 14.1 外部系统依赖裁剪结论表

下表固化模块 4 的外部系统依赖裁剪结论。这里的“外部系统”只指平台内部仓之外的技术系统、存储系统、检索系统、审计系统或集成系统候选;内部仓依赖仍由模块 1~3 处理。

| 外部系统候选 | 来源线索 | 是否进入当前主链 | 裁剪理由 | 后续归属 |
|---|---|---|---|---|
| 关系数据库 / PostgreSQL | 旧 README、旧 `00/01/02/03/05` 写到主库、DB、metadata、relations、baselines。 | 否 | 数据库是持久化实现候选,不是需求 Step 6 的外部协作方;当前需求不选择数据库,也不把 DB SLA 写成仓际依赖。 | 后续架构设计、详细设计、配置设计和测试方案。 |
| 对象存储 / S3 / MinIO | 旧 README、旧 `00/01/02/03/05/06` 写到多后端内容存储、object storage、S3 / MinIO。 | 否 | 正文可能需要物理承载,但对象存储不是 Artifact truth owner;不能用存储后端反向定义正文、版本、血缘或基线事实。 | Step 11 数据归属、Step 12 接口边界、后续架构 / 配置设计。 |
| Git content backend | 旧 README、旧 `00/01/02/03` 写到 Git 后端和代码类内容存储。 | 否 | Git 可作为特定内容后端线索,但不能替代 Artifact version / lineage / baseline 语义,也不能在需求阶段固化为外部前置。 | 后续架构设计或内容后端配置。 |
| external URL / 外部文档链接 | 旧 README、旧 `00/01` 写到 URL 后端和外部内容句柄。 | 否 | 外部 URL 可作为引用或导入线索,但不是当前 Artifact truth 的正式外部前置。 | Step 11 数据归属、Step 12 接口边界。 |
| inline storage | 旧 README、旧 `00/01` 写到 inline 后端。 | 否 | inline 是存储策略或实现模式,不是外部系统。 | 后续架构实现取舍。 |
| search / browse index | 旧 `01/02/03/05/06` 写到 browse/search、search backend、读模型和投影重建。 | 否 | 搜索和浏览索引是读侧体验或投影能力,可退化、可重建,不得替代正式 Artifact / Version / Lineage truth。 | Step 13 NFR、后续读侧设计、测试方案。 |
| 向量库 / 语义检索系统 | 旧 README、旧 `00` 写到向量库和语义检索。 | 否 | 旧需求已将向量检索系统本体列为非目标;当前仍不作为 Artifact 能力成立前置。 | 后续产品检索能力或独立集成设计。 |
| 外部审计平台 / 日志系统 | 旧材料中的 audit、tampered、lineage audit、observability 线索。 | 否 | 审计和观测在当前主链通过内部 `L4-observability` / `L4-archive` 协作表达;外部审计平台不拥有 Artifact truth。 | Step 12 外部依赖边界、Step 13 NFR、观测 / 归档后续设计。 |
| 外部归档 / cold storage | 旧 `01/02` 写到 cold storage 和归档封存。 | 否 | 冷存储是归档实现线索;当前归档协作由 `L4-archive` 表达,不直接写外部 cold storage 依赖。 | `L4-archive` 后续设计、配置设计。 |
| 外部身份提供方 | Step 5 角色和旧材料中的 author / reviewer / actor 语境。 | 否 | 身份解析不在当前 Step 6 外部系统主链;作者、审查者和 actor 可先以 typed ref 表达。 | Step 12 接口边界或 identity 后续协作裁剪。 |
| 外部通知 / 邮件 / webhook | 旧事件、notification、downstream refs 等历史线索。 | 否 | 通知是产品、集成或事件消费能力,不定义 Artifact truth。 | Step 12 接口边界、产品集成或 event 设计。 |

### 14.2 当前阶段外部系统依赖结论

当前阶段,`L1-artifact` 的 Step 6 不纳入正式外部系统依赖。

这意味着本章不把 PostgreSQL、Git、S3 / MinIO、URL、对象存储、搜索引擎、向量库、外部审计平台、cold storage、外部身份提供方或通知系统写成 Artifact truth 成立的正式前置。它们只保留为历史技术线索、后续数据归属、接口边界、非功能需求、配置设计、架构设计或测试方案输入。

### 14.3 保留边界

| 保留边界 | 当前口径 |
|---|---|
| 正文承载能力仍重要 | 当前不选对象存储或 Git,但后续 Step 11 / Step 12 仍要说明正文、引用、hash、可达性和归属边界。 |
| 查询体验仍重要 | 当前不选 search / browse 后端,但后续可在功能需求、NFR 和读侧设计中讨论查询、浏览、重建和退化。 |
| 审计与归档仍重要 | 当前不接外部审计平台或 cold storage,但通过内部 archive / observability 协作方承接审计、追溯和封存语境。 |
| 外部集成仍可能存在 | 当前不写 webhook、外部 URL 或身份提供方为主链依赖;若后续出现正式接口需求,由 Step 12 重新裁剪。 |

### 14.4 禁止推论

| 禁止推论 | 原因 |
|---|---|
| 不得把旧 `PostgreSQL + Git/S3/URL` 外部依赖表直接继承为当前需求结论。 | 旧表混入技术选型、SLA 和实现后端,不是本轮 full-restart 的独立结论。 |
| 不得把对象存储或 Git 写成 Artifact truth owner。 | 它们最多是物理承载或内容后端,不能拥有正文、版本、血缘与基线语义。 |
| 不得把 search / browse / vector 写成基础闭环前置。 | 检索和浏览是读侧体验或后续能力,正式 truth 必须可独立成立。 |
| 不得用外部审计平台替代内部 archive / observability 协作边界。 | 横切观测和归档应先通过内部仓协作表达。 |
| 不得在 Step 6 写数据库表、索引、adapter、后端类型、SLA 或配置项。 | 这些属于后续架构、详细设计、NFR、配置或测试方案。 |

### 14.5 后续输入

模块 5 `禁止依赖与 ASCII 图:先思考` 应基于模块 1~4 的结论继续判断:

- 哪些内部仓关系必须禁止写成编译期依赖。
- 哪些消费方不得反向定义 Artifact truth。
- 哪些外部系统候选不得进入当前主链。
- 依赖裁剪 ASCII 图应如何表达 `[compile]`、`[runtime]`、`[event]` 和消费退化关系。

当前模块 4 已完成。下一步只能进入 `模块 5 禁止依赖与 ASCII 图:先思考`,不得直接写禁止依赖表、ASCII 图、结构化中间产物或正式第 6 章草稿。

## 15. 模块 5 禁止依赖与 ASCII 图:先思考

### 15.1 本模块要回答的问题

模块 5 要把前四个模块已经确认的依赖裁剪转成两类约束:

- 哪些依赖关系必须被明确禁止,以防后续架构或实现把运行期 / 事件协作关系误写成编译期耦合。
- 依赖裁剪 ASCII 图如何只展示 `L1-artifact` 相关子图,并准确标注 `[compile]`、`[runtime]`、`[event]`。

本模块只做诊断,不直接产出最终禁止依赖表或 ASCII 图。最终表和图留到 `模块 5 禁止依赖与 ASCII 图:再写入`。

### 15.2 禁止依赖来源诊断

| 来源 | 应形成的禁止约束 | 诊断 |
|---|---|---|
| 模块 2 全局依赖裁剪 | 除 `L0-core` 外,不得把相邻仓写成编译期依赖。 | `L1-artifact` 唯一明确编译期依赖是 `L0-core`;work / process / governance / conversation / workspace / archive / observability / SDK / console / sync 都不能变成 package dependency。 |
| 模块 3 闭环前置 | 不得把场景前置或消费退化写成基础事实前置。 | governance / work / process 是场景前置;conversation / workspace / archive / observability / SDK / console / sync 是消费或显化退化。 |
| 模块 4 外部系统裁剪 | 不得把旧技术栈或存储 / 检索 / 审计系统写成当前需求主链外部依赖。 | PostgreSQL、Git、S3 / MinIO、URL、对象存储、search、vector、外部审计平台等都应后置。 |
| Step 2 / Step 4 truth 边界 | 下游消费方不能反向定义 Artifact truth。 | archive、observability、workspace、conversation、console、sync 等只能消费、展示、封存或追溯 Artifact facts。 |
| 需求书写规范 | 禁止依赖表必须写“禁止依赖 / 禁止原因 / 正确协作方式”。 | 模块 5 再写入必须采用固定字段,不能写成散文。 |

### 15.3 应进入禁止依赖表的候选

| 禁止依赖候选 | 禁止原因 | 正确协作方向 |
|---|---|---|
| `L1-artifact -> L1-governance` 编译期依赖 | 会把同层治理 truth 和制品 truth 绑定成源码耦合。 | 运行期引用治理边界,事件协作传递制品事实变化。 |
| `L1-artifact -> L1-work` 编译期依赖 | 会把 work truth 误并入 Artifact truth,形成 L1 同层耦合。 | 运行期消费 work typed ref 或安全摘要,事件协作同步制品事实。 |
| `L1-artifact -> L1-process` 编译期依赖 | 会把 process truth 误并入 Artifact truth。 | 运行期消费 process typed ref 或过程产出语境。 |
| `L1-artifact -> L1-conversation / L1-workspace / L4-archive / L4-observability / L5-console / L5-sync` 反向 truth 依赖 | 会让下游消费、视图、归档、观测或产品层反向定义 Artifact truth。 | 下游只读消费 Artifact facts,经事件、SDK、查询或归档边界协作。 |
| `L1-artifact -> L1-identity / L3-method-library / L2-runtime / L3-capability-hub` 直接主链依赖 | 当前全局基线未给出直接边,且容易引入身份、方法定义、执行或能力注册 truth。 | 当前先以 typed ref、后续 Step 11 / Step 12 / 详细设计重新裁剪。 |
| `L1-artifact -> PostgreSQL / Git / S3 / search / vector / audit platform` 需求主链依赖 | 会把历史技术方案和外部系统选型写成需求前置。 | 后续架构、配置、NFR、测试或集成阶段处理。 |
| `L1-artifact -> L0-bus` 作为 truth 存储依赖 | 会把事件协作通道误当作 Artifact truth 承载。 | `L0-bus` 只作为事件协作主干,truth 仍归 `L1-artifact`。 |

### 15.4 ASCII 图表达诊断

依赖裁剪图应满足以下约束:

- 图标题固定为 `#### 依赖裁剪图: L1-artifact`。
- 图中只展示 `L1-artifact` 相关依赖边,不复制全局矩阵。
- `L0-core -> L1-artifact` 或 `L1-artifact -> L0-core` 必须标为 `[compile]`,并在图后说明 `[compile]` 才可进入 package dependency。
- `L1-artifact` 与 `L0-bus` 必须标为 `[event]`,不得画成存储或调用链。
- governance / work / process 应标为 `[runtime/event]` 或分成运行期引用和事件协作,并注明是场景前置。
- conversation / workspace / archive / observability / SDK / console / sync 应标为消费 / 显化 / 归档 / 观测 / 访问边界,不得画成 truth 上游。
- 图中不得出现 PostgreSQL、S3、Git、search、vector、DB、adapter、repository、API、事件名或字段名。

### 15.5 图形取舍

| 取舍问题 | 方案 A | 方案 B | 当前推荐 |
|---|---|---|---|
| 是否把所有候选仓都画进图 | 看起来全面。 | 图过重,并会把弱候选误解为正式主链。 | 不画弱候选或只在图后文字说明后续重裁剪。 |
| 是否把外部系统画进图 | 能反映旧材料。 | 与模块 4 “无正式外部系统依赖”冲突。 | 不画外部系统。 |
| 是否把下游消费方画成一组 | 图更短。 | 可能丢失 archive / observability / SDK 等消费差异。 | 可以分组展示,但图后说明各自消费边界。 |
| 是否使用方向箭头表达 truth 所有权 | 有助于理解。 | 容易被误读为调用方向。 | 使用标签和说明明确依赖类型,不画调用链。 |

### 15.6 模块 5 再写入建议

`模块 5 禁止依赖与 ASCII 图:再写入` 应产出:

1. 一张本仓禁止依赖表,字段固定为:

```text
禁止依赖 / 禁止原因 / 正确协作方式
```

2. 一张依赖裁剪 ASCII 图,标题固定为:

```text
#### 依赖裁剪图: L1-artifact
```

3. 图后说明:

- `[compile]` 只有 `L0-core`,可进入 package dependency。
- `[runtime]`、`[event]` 和消费边不得写成 package dependency。
- 当前无正式外部系统依赖,因此图中不出现外部系统节点。

本节建议已由 §16 `模块 5 禁止依赖与 ASCII 图:再写入` 承接;当前恢复点以文件顶部和 §16.4 为准。

## 16. 模块 5 禁止依赖与 ASCII 图:再写入

### 16.1 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L1-artifact -> L1-governance` 编译期依赖 | 会把同层治理 truth 和制品 truth 绑定为源码耦合,并让 governance decision truth 反向影响 Artifact truth 边界。 | 运行期只消费 governance typed ref、evidence boundary 或安全摘要;Artifact 事实变化通过 `L0-bus` 协作。 |
| `L1-artifact -> L1-work` 编译期依赖 | 会把 work truth、项目状态或工作对象状态并入 Artifact truth,形成 L1 同层循环耦合。 | 运行期只消费 work typed ref、工作产出语境或安全摘要;work 通过正式边界消费 Artifact facts。 |
| `L1-artifact -> L1-process` 编译期依赖 | 会把 process truth、activity 状态或过程推进规则并入 Artifact truth。 | 运行期只消费 process typed ref、过程产出语境或安全摘要;process 通过正式边界消费 Artifact facts。 |
| `L1-artifact -> L1-conversation` truth 上游依赖 | conversation 是对话显化和分享入口,不是 Artifact 正文、版本、血缘或基线事实来源。 | conversation 只读消费 Artifact 引用、版本和预览语境。 |
| `L1-artifact -> L1-workspace` truth 上游依赖 | workspace 是聚合视图和操作入口,其视图状态不能反向定义 Artifact truth。 | workspace 只读消费 Artifact facts,必要时通过事件或查询维护视图。 |
| `L1-artifact -> L4-archive` truth 上游依赖 | 归档包和恢复材料不能替代 Artifact 正文、版本、血缘或 baseline truth。 | archive 消费 Artifact 版本、baseline、发布和封存事实,归档语义由 `L4-archive` 自己拥有。 |
| `L1-artifact -> L4-observability` truth 上游依赖 | 日志、指标、审计流或观测材料不能替代 Artifact lineage truth。 | observability 消费 Artifact 血缘、完整性和审计线索,不得反写本仓事实。 |
| `L1-artifact -> L0-sdk / L5-console / L5-sync` 内部源码依赖 | SDK、console 和 sync 是访问边界、管理入口或同步消费方,不是 Artifact truth source。 | 上层产品和同步能力必须经 SDK、查询、事件或公开能力边界消费 Artifact facts。 |
| `L1-artifact -> L1-identity / L3-method-library / L2-runtime / L3-capability-hub` 直接主链依赖 | 当前全局基线未给出这些直接边,且容易引入身份解析、方法定义、执行或能力注册 truth。 | 当前先以 `L0-core` typed ref 和后续重裁剪承接;如需正式协作,在 Step 11 / Step 12 / 详细设计中闭口。 |
| `L1-artifact -> PostgreSQL / Git / S3 / URL / search / vector / external audit platform` 需求主链依赖 | 会把历史技术方案、存储后端、检索系统或外部审计系统伪装成需求前置。 | 后续架构、详细设计、配置设计、NFR、测试或集成阶段重新裁剪。 |
| `L0-bus` 作为 Artifact truth 存储或正文承载 | `L0-bus` 是事件协作主干,不是 Artifact 正文、版本、血缘或 baseline facts 的存储位置。 | Artifact truth 归 `L1-artifact`;`L0-bus` 只承载事实变化的跨仓协作信号。 |

### 16.2 依赖裁剪 ASCII 图

#### 依赖裁剪图: L1-artifact

```text
                         +----------------+
                         |    L0-core     |
                         | shared refs    |
                         +----------------+
                                 |
                              [compile]
                                 |
                                 v
+----------------+       +----------------+       [event]       +----------------+
| L1-governance  |<----->|  L1-artifact   |<------------------->|     L0-bus    |
| L1-work        |       | artifact truth |                     | event channel |
| L1-process     |       +----------------+                     +----------------+
+----------------+              ^
   [runtime/event:              |
    scene refs, evidence,       |
    work/process context]       |
                                 |
                                 | [runtime/event: read, display,
                                 |  archive, observe, access, sync]
                                 |
       +---------------------------------------------------------------+
       | L1-conversation / L1-workspace / L4-archive / L4-observability |
       | L0-sdk / L5-console / L5-sync                                  |
       +---------------------------------------------------------------+
```

### 16.3 图示说明

| 图示项 | 说明 |
|---|---|
| `[compile]` | 当前只允许 `L0-core` 进入编译期 / package dependency 候选。 |
| `[event]` | `L0-bus` 是事件协作主干,不得写成 Artifact truth 存储或正文承载。 |
| `[runtime/event: scene refs...]` | governance / work / process 是场景语境、引用、安全摘要或 evidence boundary 协作方,不是同层源码依赖。 |
| `[runtime/event: read, display...]` | conversation / workspace / archive / observability / SDK / console / sync 是消费、显化、归档、观测、访问或同步边界,不得反向定义 Artifact truth。 |
| 图中未出现外部系统 | 当前阶段无正式外部系统依赖;数据库、Git、S3、搜索、向量库和外部审计平台后置。 |
| 图中未出现弱候选 | identity、method-library、runtime、capability-hub 当前不进入直接主链,后续按触发条件重新裁剪。 |

### 16.4 模块 5 收束结论

`L1-artifact` 当前 Step 6 的依赖裁剪主线是:

- 以 `L0-core` 作为唯一编译期共享契约基线。
- 以 `L0-bus` 作为事件协作主干。
- 以 governance / work / process 作为运行期和事件协作场景语境。
- 向 conversation / workspace / archive / observability / SDK / console / sync 提供只读消费、显化、归档、观测、访问或同步边界。
- 不纳入正式外部系统依赖。
- 不把弱候选仓或旧技术方案升级为当前需求主链。

本节建议已由 §17 `结构化中间产物` 承接;当前恢复点以文件顶部和 §17.7 为准。

## 17. 结构化中间产物

### 17.1 内部仓依赖表

| 关联项目 | 本仓关系 | 依赖类型 | 是否进入 Step 6 主链 | 能力边界 |
|---|---|---|---|---|
| `L0-core` | 基础共享契约前置 | 编译期 | 是 | 提供跨仓 ID、typed ref、trace、error 和基础契约语境。 |
| `L0-bus` | 事件协作主干 | 事件协作 | 是 | 承载 Artifact 事实变化的跨仓协作信号,不承载 Artifact truth。 |
| `L1-governance` | 治理场景协作方 | 运行期 / 事件协作 | 是 | 提供或消费治理引用、evidence boundary、AIIA / SoA / baseline 语境;治理 truth 不归 artifact。 |
| `L1-work` | 工作场景协作方 | 运行期 / 事件协作 | 是 | 提供或消费项目、工作对象、工作产出和基线关联语境;work truth 不归 artifact。 |
| `L1-process` | 过程场景协作方 | 运行期 / 事件协作 | 是 | 提供或消费 activity、过程产出和过程节点语境;process truth 不归 artifact。 |
| `L1-conversation` | 输出消费方 | 运行期 / 事件协作 | 是 | 只读消费 Artifact 引用、版本、预览和追溯语境。 |
| `L1-workspace` | 输出消费方 | 运行期 / 事件协作 | 是 | 消费 Artifact facts 的只读视图和聚合工作台语境。 |
| `L4-archive` | 输出 / 封存消费方 | 运行期 / 事件协作 | 是 | 消费 Artifact 版本、baseline、发布和封存事实;归档包不替代 Artifact truth。 |
| `L4-observability` | 横切消费方 | 事件协作 / 追溯交接 | 是 | 消费 Artifact 血缘、完整性和审计线索,不得反写本仓事实。 |
| `L0-sdk` | 访问边界消费方 | 运行期 | 是 | 为产品、同步和外部入口提供一致访问边界,不得绕过正式服务边界。 |
| `L5-console` | 管理入口消费方 | 运行期 | 是 | 经 SDK 或正式边界查看 / 管理 Artifact facts,不拥有 Artifact truth。 |
| `L5-sync` | 同步消费方 | 运行期 | 是 | 经 SDK 或正式边界同步 Artifact 相关 facts,同步协议后置。 |

### 17.2 外部系统依赖表

当前阶段,`L1-artifact` 无需要纳入需求主链的正式外部系统依赖。

| 外部系统候选 | 是否进入 Step 6 主链 | 后续归属 |
|---|---|---|
| PostgreSQL / 数据库 | 否 | 架构设计、详细设计、配置设计、测试方案。 |
| Git / S3 / MinIO / URL / 对象存储 | 否 | Step 11 数据归属、Step 12 接口边界、架构 / 配置设计。 |
| search / browse index / 向量库 | 否 | 功能需求、NFR、读侧设计、测试方案。 |
| 外部审计平台 / cold storage / webhook / 外部身份提供方 | 否 | Step 12 接口边界、Step 13 NFR、集成或相邻仓后续设计。 |

### 17.3 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | `L1-artifact` 编译期依赖 `L0-core`。 | 依赖方 | 编译期 | 是 | 基础共享语义是 Artifact facts 跨仓表达前置。 |
| `L0-bus` | `L1-artifact` 通过 `L0-bus` 发布制品事件。 | 协作方 | 事件协作 | 是 | Artifact 事实变化需要进入跨仓协作,但不写事件 schema。 |
| `L1-governance` | 双向引用和 evidence / baseline 协作线索。 | 协作方 | 运行期 / 事件协作 | 是 | 治理场景需要协作,但 governance decision truth 不归 artifact。 |
| `L1-work` | 双向工作语境和 Artifact consumption 线索。 | 协作方 | 运行期 / 事件协作 | 是 | 工作场景需要协作,但 work truth 不归 artifact。 |
| `L1-process` | 过程产出 / 输入语境协作线索。 | 协作方 | 运行期 / 事件协作 | 是 | 过程场景需要协作,但 process truth 不归 artifact。 |
| conversation / workspace / archive / observability / SDK / console / sync | 其他仓消费 Artifact 或 L1 truth 的全局线索。 | 被依赖方 / 消费方 | 运行期 / 事件协作 | 是 | 只作为输出消费、显化、归档、观测、访问或同步边界。 |
| identity / method-library / runtime / capability-hub | 弱候选或后续定义 / 执行线索。 | 后续重裁剪方 | 非直接主链 | 否 | 当前全局基线未给出直接主链边,后续按触发条件重裁剪。 |
| 外部存储 / 检索 / 审计系统 | 旧材料技术线索。 | 非当前依赖 | 非主链 | 否 | 不在需求 Step 6 固化技术选型或外部系统前置。 |

### 17.4 本仓依赖类型分类表

| 类型 | 关联对象 | 当前口径 |
|---|---|---|
| 编译期 | `L0-core` | 唯一可进入 package dependency 的共享契约基线。 |
| 事件协作 | `L0-bus`;按需涉及 governance / work / process / downstream consumers | 只表达跨仓事实变化协作,不写事件名、payload 或订阅表。 |
| 运行期场景协作 | `L1-governance`;`L1-work`;`L1-process` | 运行期引用、safe summary、evidence boundary 或场景语境,不得源码耦合。 |
| 输出消费 | `L1-conversation`;`L1-workspace`;`L4-archive`;`L4-observability`;`L0-sdk`;`L5-console`;`L5-sync` | 只读消费、显化、归档、观测、访问或同步 Artifact facts。 |
| 后续重裁剪 | `L1-identity`;`L3-method-library`;`L2-runtime`;`L3-capability-hub` | 当前不进入直接主链。 |
| 非当前外部依赖 | 数据库、对象存储、Git、search、vector、外部审计平台等 | 旧技术线索后置到后续文档。 |

### 17.5 禁止依赖与依赖裁剪图索引

| 产物 | 位置 | 状态 |
|---|---|---|
| 本仓禁止依赖表 | §16.1 | done/pass |
| 依赖裁剪 ASCII 图 | §16.2 | done/pass |
| 图示说明 | §16.3 | done/pass |

结构化中间产物引用 §16 的禁止依赖表和 ASCII 图,不重复复制完整内容。后续正式草稿可直接从 §16 和 §17 组合生成。

### 17.6 结构化产物自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 内部仓依赖表已形成 | pass | 覆盖编译期、运行期、事件协作、输出消费和后续重裁剪对象。 |
| 外部系统依赖表已形成 | pass | 明确当前阶段无正式外部系统依赖。 |
| 依赖裁剪表已形成 | pass | 每类关系有裁剪理由,未复制全量矩阵。 |
| 类型分类表已形成 | pass | 区分 `[compile]`、`[runtime]`、`[event]`、消费和非主链。 |
| 禁止依赖表和 ASCII 图可追溯 | pass | 已回指 §16。 |
| 正式文档写入 | blocked | 正式 `00-需求文档.md` 仍等待 Step 17 统一装配。 |

### 17.7 下一步

本节建议已由 §18 `回填草稿` 承接;当前恢复点以文件顶部和 §18.1 为准。

## 18. 回填草稿

> 本节是正式 `00-需求文档.md` 第 6 章候选草稿,仅供 Step 17 统一装配时使用。当前不修改正式文档。

## 6. 使用方与依赖

### 6.1 内部仓依赖

`L1-artifact` 是可审计制品真相仓,负责 Artifact 正文、版本、血缘与基线事实。当前阶段的依赖关系只裁剪 `L1-artifact` 相关子图,不复制全量项目矩阵。

| 关联项目 | 本仓关系 | 依赖类型 | 能力边界 |
|---|---|---|---|
| `L0-core` | 基础共享契约前置 | 编译期 | 提供跨仓 ID、typed ref、trace、error 和基础契约语境。 |
| `L0-bus` | 事件协作主干 | 事件协作 | 承载 Artifact 事实变化的跨仓协作信号,不承载 Artifact truth。 |
| `L1-governance` | 治理场景协作方 | 运行期 / 事件协作 | 提供或消费治理引用、evidence boundary、AIIA / SoA / baseline 语境;治理 truth 不归 artifact。 |
| `L1-work` | 工作场景协作方 | 运行期 / 事件协作 | 提供或消费项目、工作对象、工作产出和基线关联语境;work truth 不归 artifact。 |
| `L1-process` | 过程场景协作方 | 运行期 / 事件协作 | 提供或消费 activity、过程产出和过程节点语境;process truth 不归 artifact。 |
| `L1-conversation` | 输出消费方 | 运行期 / 事件协作 | 只读消费 Artifact 引用、版本、预览和追溯语境。 |
| `L1-workspace` | 输出消费方 | 运行期 / 事件协作 | 消费 Artifact facts 的只读视图和聚合工作台语境。 |
| `L4-archive` | 输出 / 封存消费方 | 运行期 / 事件协作 | 消费 Artifact 版本、baseline、发布和封存事实;归档包不替代 Artifact truth。 |
| `L4-observability` | 横切消费方 | 事件协作 / 追溯交接 | 消费 Artifact 血缘、完整性和审计线索,不得反写本仓事实。 |
| `L0-sdk` | 访问边界消费方 | 运行期 | 为产品、同步和外部入口提供一致访问边界,不得绕过正式服务边界。 |
| `L5-console` | 管理入口消费方 | 运行期 | 经 SDK 或正式边界查看 / 管理 Artifact facts,不拥有 Artifact truth。 |
| `L5-sync` | 同步消费方 | 运行期 | 经 SDK 或正式边界同步 Artifact 相关 facts,同步协议后置。 |

### 6.2 外部系统依赖

当前阶段,`L1-artifact` 无需要纳入需求主链的正式外部系统依赖。

旧材料中的 PostgreSQL、Git、S3 / MinIO、URL、对象存储、search / browse index、向量库、外部审计平台、cold storage、外部身份提供方和通知 / webhook 都只作为历史技术线索或后续设计输入,不得在本章定为 Artifact truth 成立的正式前置。

| 外部系统候选 | 是否进入当前主链 | 后续归属 |
|---|---|---|
| PostgreSQL / 数据库 | 否 | 架构设计、详细设计、配置设计、测试方案。 |
| Git / S3 / MinIO / URL / 对象存储 | 否 | 数据归属、接口边界、架构 / 配置设计。 |
| search / browse index / 向量库 | 否 | 功能需求、非功能需求、读侧设计、测试方案。 |
| 外部审计平台 / cold storage / webhook / 外部身份提供方 | 否 | 接口边界、非功能需求、集成或相邻仓后续设计。 |

### 6.3 本仓依赖裁剪表

| 关联项目 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|
| `L0-core` | 依赖方 | 编译期 | 是 | 基础共享语义是 Artifact facts 跨仓表达前置。 |
| `L0-bus` | 协作方 | 事件协作 | 是 | Artifact 事实变化需要进入跨仓协作,但不写事件 schema。 |
| `L1-governance` | 协作方 | 运行期 / 事件协作 | 是 | 治理场景需要协作,但 governance decision truth 不归 artifact。 |
| `L1-work` | 协作方 | 运行期 / 事件协作 | 是 | 工作场景需要协作,但 work truth 不归 artifact。 |
| `L1-process` | 协作方 | 运行期 / 事件协作 | 是 | 过程场景需要协作,但 process truth 不归 artifact。 |
| conversation / workspace / archive / observability / SDK / console / sync | 被依赖方 / 消费方 | 运行期 / 事件协作 | 是 | 只作为输出消费、显化、归档、观测、访问或同步边界。 |
| identity / method-library / runtime / capability-hub | 后续重裁剪方 | 非直接主链 | 否 | 当前全局基线未给出直接主链边,后续按触发条件重裁剪。 |
| 外部存储 / 检索 / 审计系统 | 非当前依赖 | 非主链 | 否 | 不在需求 Step 6 固化技术选型或外部系统前置。 |

### 6.4 本仓依赖类型分类表

| 类型 | 关联对象 | 当前口径 |
|---|---|---|
| 编译期 | `L0-core` | 唯一可进入 package dependency 的共享契约基线。 |
| 事件协作 | `L0-bus`;按需涉及 governance / work / process / downstream consumers | 只表达跨仓事实变化协作,不写事件名、payload 或订阅表。 |
| 运行期场景协作 | `L1-governance`;`L1-work`;`L1-process` | 运行期引用、safe summary、evidence boundary 或场景语境,不得源码耦合。 |
| 输出消费 | `L1-conversation`;`L1-workspace`;`L4-archive`;`L4-observability`;`L0-sdk`;`L5-console`;`L5-sync` | 只读消费、显化、归档、观测、访问或同步 Artifact facts。 |
| 后续重裁剪 | `L1-identity`;`L3-method-library`;`L2-runtime`;`L3-capability-hub` | 当前不进入直接主链。 |
| 非当前外部依赖 | 数据库、对象存储、Git、search、vector、外部审计平台等 | 旧技术线索后置到后续文档。 |

### 6.5 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L1-artifact -> L1-governance` 编译期依赖 | 会把同层治理 truth 和制品 truth 绑定为源码耦合。 | 运行期只消费 governance typed ref、evidence boundary 或安全摘要;Artifact 事实变化通过 `L0-bus` 协作。 |
| `L1-artifact -> L1-work` 编译期依赖 | 会把 work truth、项目状态或工作对象状态并入 Artifact truth。 | 运行期只消费 work typed ref、工作产出语境或安全摘要。 |
| `L1-artifact -> L1-process` 编译期依赖 | 会把 process truth、activity 状态或过程推进规则并入 Artifact truth。 | 运行期只消费 process typed ref、过程产出语境或安全摘要。 |
| `L1-artifact -> conversation / workspace / archive / observability / SDK / console / sync` truth 上游依赖 | 下游消费、视图、归档、观测、访问或同步能力不能反向定义 Artifact truth。 | 下游通过只读查询、事件、SDK、归档或观测边界消费 Artifact facts。 |
| `L1-artifact -> identity / method-library / runtime / capability-hub` 直接主链依赖 | 当前全局基线未给出直接边,且容易引入身份解析、方法定义、执行或能力注册 truth。 | 先以 typed ref 和后续重裁剪承接;如需正式协作,在后续 Step 中闭口。 |
| `L1-artifact -> PostgreSQL / Git / S3 / search / vector / external audit platform` 需求主链依赖 | 会把历史技术方案、存储后端、检索系统或外部审计系统伪装成需求前置。 | 后续架构、详细设计、配置设计、NFR、测试或集成阶段重新裁剪。 |
| `L0-bus` 作为 Artifact truth 存储或正文承载 | `L0-bus` 是事件协作主干,不是 Artifact truth 存储。 | Artifact truth 归 `L1-artifact`;`L0-bus` 只承载事实变化协作信号。 |

### 6.6 依赖裁剪图

#### 依赖裁剪图: L1-artifact

```text
                         +----------------+
                         |    L0-core     |
                         | shared refs    |
                         +----------------+
                                 |
                              [compile]
                                 |
                                 v
+----------------+       +----------------+       [event]       +----------------+
| L1-governance  |<----->|  L1-artifact   |<------------------->|     L0-bus    |
| L1-work        |       | artifact truth |                     | event channel |
| L1-process     |       +----------------+                     +----------------+
+----------------+              ^
   [runtime/event:              |
    scene refs, evidence,       |
    work/process context]       |
                                 |
                                 | [runtime/event: read, display,
                                 |  archive, observe, access, sync]
                                 |
       +---------------------------------------------------------------+
       | L1-conversation / L1-workspace / L4-archive / L4-observability |
       | L0-sdk / L5-console / L5-sync                                  |
       +---------------------------------------------------------------+
```

图中 `[compile]` 只有 `L0-core`,可进入 package dependency。`[runtime]`、`[event]` 和消费边不得写成 package dependency。当前无正式外部系统依赖,因此图中不出现外部系统节点。

### 18.1 草稿来源

| 草稿段落 | 来源 |
|---|---|
| 6.1 内部仓依赖 | §17.1 |
| 6.2 外部系统依赖 | §14.2;§17.2 |
| 6.3 本仓依赖裁剪表 | §17.3 |
| 6.4 本仓依赖类型分类表 | §17.4 |
| 6.5 本仓禁止依赖表 | §16.1 |
| 6.6 依赖裁剪图 | §16.2;§16.3 |

本节建议已由 §19 `自检与停审` 承接;当前恢复点以文件顶部和项目台账为准。

## 19. 自检与停审

### 19.1 SOP 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| Step 6 是否说明本仓向谁提供能力 | pass | 已在 §17.1 和 §18.6.1 写明向 conversation、workspace、archive、observability、SDK、console、sync 等消费方提供 Artifact facts。 |
| Step 6 是否说明本仓依赖谁的前置能力 | pass | 已在 §17.1 和 §18.6.1 写明 `L0-core`、`L0-bus`、governance、work、process 的依赖 / 协作边界。 |
| 是否区分闭环前置、场景前置和消费退化 | pass | 已在 §12 分层说明基础事实闭环、平台协作、场景前置、输出消费和后续重裁剪。 |
| 是否输出内部仓依赖表 | pass | 已在 §17.1 和候选草稿 §6.1 输出。 |
| 是否输出外部系统依赖表 | pass | 已在 §17.2 和候选草稿 §6.2 输出,并明确无正式外部系统依赖。 |
| 是否输出本仓依赖裁剪表 | pass | 已在 §17.3 和候选草稿 §6.3 输出。 |
| 是否输出依赖类型分类表 | pass | 已在 §17.4 和候选草稿 §6.4 输出。 |
| 是否输出禁止依赖表 | pass | 已在 §16.1 和候选草稿 §6.5 输出。 |
| 是否输出依赖裁剪 ASCII 图 | pass | 已在 §16.2 和候选草稿 §6.6 输出。 |

### 19.2 书写规范自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 表格字段是否使用固定格式 | pass | 裁剪表、分类表、禁止依赖表和外部系统依赖表均使用规范字段。 |
| 是否只写能力级依赖 | pass | 未写 API、DTO、port、repository、handler、数据库表或事件 payload。 |
| 是否将 `[compile]`、`[runtime]`、`[event]` 分开 | pass | §17.4 和 §18.6.4 已明确分类。 |
| ASCII 图是否只展示本仓相关子图 | pass | §16.2 / §18.6.6 只展示 `L1-artifact`、`L0-core`、`L0-bus`、场景协作方和消费方。 |
| 是否显式写明无正式外部系统依赖 | pass | §14.2、§17.2、§18.6.2 已写明。 |
| 是否保留正式文档不改动 | pass | 本 Step 只写中间产物,正式 `00-需求文档.md` 等待 Step 17 统一装配。 |

### 19.3 全局依赖裁剪规则自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否只裁剪 `L1-artifact` 相关子图 | pass | 未复制 27 仓全量矩阵。 |
| 是否只将 `L0-core` 写为编译期依赖 | pass | §16 / §17 / §18 均明确 `[compile]` 只有 `L0-core`。 |
| 是否把 `L0-bus` 写为事件协作 | pass | 已明确 `L0-bus` 不是 truth 存储或正文承载。 |
| 是否防止 L1 同层源码耦合 | pass | 禁止依赖表禁止 artifact 编译期依赖 governance / work / process。 |
| 是否防止消费方反向定义 truth | pass | 已禁止 conversation / workspace / archive / observability / SDK / console / sync 反向定义 Artifact truth。 |
| 是否防止旧技术栈进入需求主链 | pass | 已裁剪 PostgreSQL、Git、S3、search、vector、external audit platform 等。 |

### 19.4 历史材料污染检查

| 历史线索 | 处理结果 | 说明 |
|---|---|---|
| 旧 §10 外部系统依赖和 SLA | pass | 未继承旧 PostgreSQL / Git / S3 / URL SLA 作为当前结论。 |
| 旧接口名和事件名 | pass | 未写 CreateArtifact、GetLineage、artifact.approved 等接口或事件契约。 |
| 旧架构中的 adapter / storage / search | pass | 只作为历史线索,未进入需求主链。 |
| 旧测试和验收中的 DB / fake storage / search backend | pass | 未反推为需求依赖。 |

### 19.5 遗留事项

| 项 | 状态 | 处理口径 |
|---|---|---|
| 正式 `04-配置设计.md` 缺失 | open | 已记录为文档链缺口,不阻塞 00 Step 6。 |
| 正式 `07-实施计划.md` 缺失 | open | 已记录为文档链缺口,不阻塞 00 Step 6。 |
| identity / method-library / runtime / capability-hub 是否进入后续正式协作 | deferred | 当前不进入 Step 6 直接主链;后续 Step 11 / Step 12 / 详细设计按触发条件重裁剪。 |

### 19.6 停审结论

| 项 | 结论 |
|---|---|
| Step 6 状态 | done |
| gate_status | pass |
| 停审结论 | `allow_step_7` |
| 下一步 | 等待用户确认后进入 Step 7 `核心能力闭环:开工确认 / 必读文档:先思考`。 |
| 正式文档写入 | blocked_until_step_17 |

Step 6 `使用方与依赖` 已完成。下一步不得直接修改正式 `00-需求文档.md`,只能在用户确认后创建 / 进入 `00_req_step_07_core_capability_loop.md` 并执行 Step 7 开工确认与必读文档思考。
