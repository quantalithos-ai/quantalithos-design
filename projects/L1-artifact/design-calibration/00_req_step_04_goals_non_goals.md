# L1-artifact 00 需求 Step 4: 目标与非目标

> 创建日期: 2026-06-29
> 状态: done
> 当前模式: full-restart
> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 4
> 回填位置: `00-需求文档.md` 第 4 章“目标与非目标”
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 文档级 flow: `design-calibration/00_requirements_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 4 目标与非目标 |
| 输出文件 | `design-calibration/00_req_step_04_goals_non_goals.md` |
| 前置 Step | Step 3 `背景与问题定义` 已完成并通过自检 |
| 已读取 SOP / 书写规范 | yes:`需求文档讨论流程_SOP.md` Step 4;`需求文档书写规范.md` 4.4 |
| 已读取恢复文件 | yes:`project_execution_ledger.md`;`00_requirements_calibration_flow.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md` |
| 已读取历史材料 | yes:`projects/L1-artifact/README.md`;`projects/L1-artifact/00-需求文档.md` 旧目标与非目标章节 |
| 历史材料口径 | 旧 README 和旧 `00-需求文档.md` 只作目标线索与污染审计输入,不继承为当前结论 |
| 当前禁写范围 | 不写角色、依赖裁剪、核心能力闭环、用户故事、功能、业务规则、数据归属、接口、NFR、验收、schema、事件 payload、port、repository、配置或实施边界 |
| 正式文档写入 | blocked: 当前只写中间产物,不修改正式 `00-需求文档.md` |
| next_allowed_action | Step 4 已完成;等待用户确认后进入 Step 5 `用户与角色`。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 已读取 Step 4 规范、Step 2/3 结论和旧目标材料。 |
| 整体模块搭建 | done | Step 4 模块骨架 | pass | 进入模块 1 思考。 |
| 模块 1 目标候选:先思考 | done | 目标候选判定问题 / 诊断 / 取舍 | pass | 进入模块 1 再写入。 |
| 模块 1 目标候选:再写入 | done | 目标候选结论 | pass | 进入模块 2 思考。 |
| 模块 2 非目标候选:先思考 | done | 非目标候选判定问题 / 诊断 / 取舍 | pass | 进入模块 2 再写入。 |
| 模块 2 非目标候选:再写入 | done | 非目标候选结论 | pass | 进入模块 3 思考。 |
| 模块 3 范围收束与验证口径:先思考 | done | 范围收束和验证方式诊断 | pass | 进入模块 3 再写入。 |
| 模块 3 范围收束与验证口径:再写入 | done | 范围收束结论 | pass | 进入模块 4 思考。 |
| 模块 4 旧材料差异审计:先思考 | done | 旧目标 / 非目标污染检查 | pass | 进入模块 4 再写入。 |
| 模块 4 旧材料差异审计:再写入 | done | 可保留线索、废弃项、后置项 | pass | 进入结构化中间产物。 |
| 结构化中间产物 | done | 目标表 / 非目标表 / 范围收束候选 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 4 章草稿 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表 / 是否允许进入 Step 5 | pass | wait_user_confirm_step_5 |

---

## 2. 必读文档

### 2.1 已读取文档摘要

| 文档 | 读取结论 | 对 Step 4 的影响 |
|---|---|---|
| `standards/document/需求文档讨论流程_SOP.md` Step 4 | 本步要收口范围,明确本次需求要达成什么、不达成什么;输出目标结论、非目标结论和范围收束结论。 | Step 4 只能回答状态、边界或能力范围,不能进入功能、方案、接口、数据或验收。 |
| `standards/document/需求文档书写规范.md` 4.4 | 正式第 4 章推荐两张表:目标表和非目标表;目标表固定为“目标 / 说明 / 验证方式”,非目标表固定为“非目标 / 不做原因”。 | 后续结构化中间产物必须形成两张可回填表,且每个目标可验证、每个非目标具体有边界作用。 |
| `design-calibration/00_req_step_02_position_boundary.md` | Step 2 已确认 `L1-artifact` 是可审计制品真相仓,负责承载 Artifact 正文、版本、血缘与基线事实。 | Step 4 目标必须围绕制品事实边界收束,不能把 work、process、governance、conversation、workspace、observability 或 archive 的真相纳入目标。 |
| `design-calibration/00_req_step_03_problem_context.md` | Step 3 已收束 P-ART-001~003:需求层未收束、多仓解释风险、问题 / 方案 / 指标混层。 | Step 4 目标应回应这三类问题;非目标应阻断旧功能、旧指标和相邻仓真相被直接继承。 |
| `projects/L1-artifact/README.md` | 旧 README 把仓使命、对象数量、技术栈、多后端内容存储、目录结构、维护纪律、性能目标和安全扫描混写。 | 可提取“可审计产出”“Baseline”“DatasetArtifact”“血缘”等目标线索;不得继承技术栈、目录、P95、hash 扫描或 5000w 规模。 |
| `projects/L1-artifact/00-需求文档.md` 旧 §3 | 旧目标 G-1~G-7 已把 kind / relation 全覆盖、Baseline pin、hash 校验、GetLineage P95、写入 P95、tampered 事件写成目标;旧非目标列出 work、governance、process、conversation 和向量检索边界。 | 旧目标多数混入功能、规则、NFR 和验收;旧非目标有可保留边界线索,但需要补齐 archive、observability、workspace、method-library、runtime、capability-hub 等当前边界。 |
| `projects/L1-governance/design-calibration/00_req_step_04_goals_non_goals.md` | 已完成项目的 Step 4 使用“本步目标 / 本步输入 / SOP 问题回答 / 诊断 / 取舍 / 结构化中间产物 / 回填草稿 / 自检”框架。 | 只借鉴文件组织方式,不复制 governance 的目标、非目标或对象。 |

### 2.2 待补读文档

| 文档 | 必要原因 | 预计落点 |
|---|---|---|
| `projects/L1-artifact/01-架构设计.md` | 若模块 4 需要审计旧架构如何把实现方案反推为目标,再按历史材料读取。 | 模块 4 旧材料差异审计。 |
| `projects/L1-artifact/02-概要设计.md` | 若旧概要把对象、组件、接口或流程写成目标,再审计。 | 模块 4 旧材料差异审计。 |
| `projects/L1-artifact/03-详细设计.md` | 若旧详细设计把 schema、port、状态机或事件反推到目标层,再审计。 | 模块 4 旧材料差异审计。 |
| `projects/L1-artifact/05-测试方案.md` / `06-验收标准.md` | 若旧测试或验收把 P95、覆盖率、tampered 或容量指标反推为目标,再审计。 | 模块 4 旧材料差异审计。 |

---

## 3. 整体模块骨架

Step 4 只拆四个实质模块:

| 模块 | 要回答的问题 | 输出 | 不输出 |
|---|---|---|---|
| 模块 1:目标候选 | 本次需求结束后,`L1-artifact` 应成立哪些状态、边界或能力范围?这些目标如何回应 P-ART-001~003? | 目标候选和目标粒度取舍。 | 不写功能名、接口名、对象字段、P95、容量、测试用例或实现路径。 |
| 模块 2:非目标候选 | 哪些相关事项明确不纳入本仓 / 本文处理范围?哪些应交给相邻仓或后续阶段? | 非目标候选和归属理由。 | 不写依赖裁剪表、不写接口协作、不写数据归属矩阵。 |
| 模块 3:范围收束与验证口径 | 目标如何被后续章节验证?哪些边界必须贯穿 Step 5~14? | 范围收束结论和后续验证口径。 | 不写验收标准、测试步骤、非功能指标或通过条件细则。 |
| 模块 4:旧材料差异审计 | 旧 README / 旧 00 中哪些目标线索可保留,哪些把功能、规则、NFR、验收或实现方案写成了目标? | 可保留线索、废弃项、后置项。 | 不继承旧 G-1~G-7、旧 P95、旧 kind / relation 数量、旧技术栈或旧验收。 |

模块推进顺序固定为:

```text
目标候选 -> 非目标候选 -> 范围收束与验证口径 -> 旧材料差异审计 -> 结构化中间产物 -> 回填草稿 -> 自检与停审
```

当前最小下一步是等待用户确认后进入 Step 5 `用户与角色`,尚不修改正式 `00-需求文档.md`。

---

## 4. 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| Step 4 开工 | pass | 用户已确认进入 Step 4。 |
| 必读文档读取 | pass | 已读取 Step 4 规范、Step 2/3 结论、旧 README / 旧目标材料和 L1-governance 框架参照。 |
| 整体模块搭建 | pass | 已明确 Step 4 四个实质模块和禁写范围。 |
| 当前模块 | pass | Step 4 已完成;等待用户确认进入 Step 5 `用户与角色`。 |
| 正式文档写入 | blocked | 正式 `00-需求文档.md` 仍等待 Step 17 统一组装。 |

当前下一步只能在用户确认后进入 Step 5 `用户与角色`,不得直接修改正式 `00-需求文档.md`。

---

## 5. 模块思考记录

### 5.1 模块 1:目标候选:先思考

#### 5.1.1 问题回答

模块 1 要回答“本次需求结束后,L1-artifact 应成立哪些状态、边界或能力范围”。目标必须从 Step 2 的仓级边界和 Step 3 的三条问题推出,不能从旧功能清单、旧性能数字或旧实现方案直接复制。

当前目标候选应围绕三条问题主线收束:

| Step 3 问题 | 目标应回应什么 | 目标不应写成什么 |
|---|---|---|
| P-ART-001 制品事实缺少新版需求层收束 | 让 `L1-artifact` 的需求边界重新成立,明确本仓承载 Artifact 正文、版本、血缘与基线事实。 | 不写 `16 kind` 全覆盖、`7 relation` 全覆盖或对象字段。 |
| P-ART-002 制品事实容易被相邻仓各自解释 | 让相邻仓只能引用、消费、展示或封存制品事实,不能复制正文、重建血缘或私自冻结基线。 | 不写依赖裁剪表、事件订阅、接口或数据归属矩阵。 |
| P-ART-003 问题、方案和量化指标容易混层 | 让旧功能、旧 NFR、旧技术栈和旧验收数字被隔离到后续 Step 重新审计。 | 不写 P95、容量、hash 扫描、tampered 事件、Rust / PostgreSQL / S3 等实现口径。 |

因此,模块 1 的目标候选应是“状态 / 边界 / 能力范围”级别,而不是功能项:

- 建立可审计制品事实的需求边界。
- 收束 Artifact 正文、版本、血缘与基线事实的需求范围。
- 收束相邻仓围绕 Artifact 的引用 / 消费 / 展示 / 封存边界。
- 建立旧材料中功能、规则、NFR、验收和实现线索的后置审计边界。

#### 5.1.2 旧目标诊断

旧 `00-需求文档.md` 的 G-1~G-7 有目标线索,但多数不适合作为 Step 4 目标原样保留:

| 旧目标 | 当前诊断 | Step 4 处理 |
|---|---|---|
| G-1 `16 种 kind 全覆盖` | 属于对象枚举 / 功能覆盖 / 测试口径。 | 后置 Step 7 / Step 9 / Step 10 / Step 11 / Step 14。 |
| G-2 `7 种关系全覆盖` | 属于关系种类、业务规则和功能测试。 | 后置血缘能力、规则和数据归属讨论。 |
| G-3 `Baseline pin 到 version+hash` | 包含有效的基线事实线索,但写成了规则和验收。 | Step 4 只保留“基线事实边界需要收束”,pin / hash 规则后置。 |
| G-4 `hash 校验` | 属于业务规则、NFR、安全和实现候选。 | 后置 Step 10 / Step 13 / Step 14。 |
| G-5 `GetLineage P95(depth=5)` | `GetLineage` 是功能,`P95` 是 NFR。 | 后置 Step 9 / Step 13 / Step 14。 |
| G-6 `写入 P95` | 属于非功能指标,且旧数字未重新校准。 | 后置 Step 13 / Step 14。 |
| G-7 `tampered 检测事件` | 属于规则、事件、接口和验收候选。 | 后置 Step 10 / Step 12 / Step 14。 |

旧目标的可保留部分是目标背后的边界主题:

- Artifact kind / relation 提醒后续要讨论制品类型和血缘语义,但不是 Step 4 目标。
- Baseline 提醒本仓需要收束基线事实边界,但不提前写 pin / hash 规则。
- hash / tampered 提醒后续要审计完整性和防篡改要求,但不作为当前目标。
- P95 / 容量提醒后续可能有 NFR,但不作为当前目标。

#### 5.1.3 目标主轴取舍

| 方案 | 目标主轴 | 优点 | 缺点 | 当前取舍 |
|---|---|---|---|---|
| 方案 A | 保留旧 G-1~G-7 目标 | 看起来可验证,承接旧文档。 | 把功能、规则、NFR、验收和实现线索混进目标层。 | 不采用。 |
| 方案 B | 只写一个目标:“统一制品事实” | 简洁,不容易越界。 | 过泛,无法约束正文、版本、血缘、基线和相邻仓边界。 | 不单独采用。 |
| 方案 C | 按制品事实边界拆目标:需求边界、正文 / 版本 / 血缘 / 基线范围、相邻仓协作边界、旧材料污染隔离 | 能直接回应 P-ART-001~003,且保持 Step 4 粒度。 | 需要后续 Step 7~14 再展开能力、功能、规则、数据和验收。 | 采用。 |
| 方案 D | 按旧对象拆目标:Artifact、ArtifactRelation、Baseline、DatasetArtifact | 对后续对象清晰。 | 提前把对象候选固化成目标,会污染数据归属和详细设计。 | 不采用。 |
| 方案 E | 按标准映射拆目标:ISO 15288 / 9001 / 25010 / 24748-2 / 25012 / 42001 | 能承接标准线索。 | 会把标准映射和验收提前写入目标层。 | 不采用。 |

#### 5.1.4 当前推荐方向

模块 1 再写入时,建议将目标候选收束为 4 条:

| 候选目标方向 | 说明 | 后续验证方式候选 |
|---|---|---|
| 建立可审计制品事实的需求边界 | 回应 P-ART-001,明确本仓是制品事实需求收束对象。 | 后续章节不再把旧对象清单、功能、指标或实现方案当作当前结论。 |
| 收束 Artifact 正文、版本、血缘与基线事实范围 | 承接 Step 2 一句话定义,避免把 Artifact 降格为附件或内容存储。 | 后续能力、功能、规则、数据和验收都能回指这四类事实范围。 |
| 收束相邻仓协作边界 | 回应 P-ART-002,避免 work / process / governance / conversation / workspace / observability / archive 各自解释制品真相。 | 后续依赖、接口、数据和验收章节不出现相邻仓复制正文、重建血缘或私自冻结基线。 |
| 建立旧材料线索后置审计边界 | 回应 P-ART-003,隔离旧功能、旧规则、旧 NFR、旧验收和旧实现想象。 | 后续 Step 对 kind、relation、Baseline、DatasetArtifact、GetLineage、hash、tampered、P95 和容量逐项重新校准。 |

这些目标候选仍不是最终目标表。下一步 `目标候选:再写入` 才能将它们整理为“目标 / 说明 / 验证方式”的候选表。

### 5.2 模块 1:目标候选:再写入

#### 5.2.1 目标候选结论

| 目标 | 说明 | 验证方式 |
|---|---|---|
| 建立可审计制品事实的需求边界 | 明确 `L1-artifact` 本轮需求收束对象是平台产出的可审计制品事实,不是旧对象清单、功能清单、性能指标或实现方案的直接继承。 | 后续章节不把旧 `16 kind`、`7 relation`、旧功能、旧 P95、旧技术栈或旧验收数字直接作为当前结论。 |
| 收束 Artifact 正文、版本、血缘与基线事实范围 | 承接 Step 2 定位,明确本仓目标围绕 Artifact 正文、版本、血缘与基线事实成立,避免把 Artifact 降格为附件、日志、视图、归档包或内容存储后端。 | 后续核心能力、功能、规则、数据和验收都能回指正文、版本、血缘与基线事实,且不把这些事实散落到相邻仓。 |
| 收束相邻仓围绕 Artifact 的协作边界 | 明确 work、process、governance、conversation、workspace、observability 和 archive 可以引用、消费、展示或封存 Artifact,但不拥有 Artifact 正文、版本、血缘与基线事实。 | 后续依赖、接口、数据和验收章节不出现相邻仓复制正文、重建血缘、私自冻结基线或把视图 / 日志 / 归档包当成 Artifact 真相。 |
| 建立旧材料线索的后置审计边界 | 明确旧材料中的 Artifact kind、ArtifactRelation、Baseline、DatasetArtifact、GetLineage、hash、tampered、P95、容量和技术栈只作为后续审计输入。 | 后续 Step 对功能、规则、数据、接口、NFR 和验收逐项重新校准,不得把旧线索跳过本轮讨论直接写成正式需求。 |

#### 5.2.2 目标粒度说明

| 目标候选 | 粒度判断 | 不提前生成的内容 |
|---|---|---|
| 可审计制品事实需求边界 | 状态 / 边界级目标。 | 不生成对象枚举、功能清单、验收测试。 |
| 正文、版本、血缘与基线事实范围 | 仓级事实范围目标。 | 不生成 Artifact 字段、relation kind、Baseline pin 规则或 hash 规则。 |
| 相邻仓协作边界 | 跨仓边界目标。 | 不生成依赖裁剪表、接口、事件订阅或数据归属矩阵。 |
| 旧材料线索后置审计边界 | 需求过程边界目标。 | 不生成 P95、容量、benchmark、技术栈、目录或实现计划。 |

#### 5.2.3 不采用目标表达

| 表达 | 不采用原因 |
|---|---|
| `L1-artifact` 目标是支持 16 种 Artifact kind 和 7 种 relation。 | 属于对象枚举、功能覆盖和测试口径,应后置。 |
| `L1-artifact` 目标是实现 Baseline pin 到 version+hash。 | 包含有效主题,但 pin / hash 是规则和数据细节,不属于目标层。 |
| `L1-artifact` 目标是提供 GetLineage(depth=5) 且 P95 < 500ms。 | `GetLineage` 是功能,`P95` 是非功能指标。 |
| `L1-artifact` 目标是 hash 校验和 tampered critical 事件 100% 触发。 | 属于规则、接口、事件和验收候选。 |
| `L1-artifact` 目标是采用 Rust、PostgreSQL、Git / S3 / inline / URL 多后端内容存储。 | 属于架构、配置或实现方案。 |

#### 5.2.4 后续约束

模块 2 `非目标候选` 需要基于上述目标候选继续排除相关但不归本仓或不归当前 Step 的事项,尤其要覆盖:

- 相邻仓真相:work、process、governance、conversation、workspace、observability、archive。
- 定义 / 运行 / 能力仓:method-library、runtime、capability-hub。
- 后续阶段事项:功能、规则、数据、接口、NFR、验收、架构、配置和实施计划。

模块 2 不得把非目标写成泛泛的“不做所有事情”,必须给出具体不做原因和归属口径。

### 5.3 模块 2:非目标候选:先思考

#### 5.3.1 问题回答

模块 2 要回答“哪些相关事项明确不纳入本仓 / 本文处理范围”。非目标必须有边界作用,不能写成泛泛的“不做所有事情”,也不能把后续 Step 才会讨论的内容永久排除。

当前非目标候选需要覆盖三类排除:

| 排除类型 | 判定问题 | 当前适用方向 |
|---|---|---|
| 相邻仓 truth 排除 | 这个事项是否属于 work、process、governance、conversation、workspace、observability、archive 等相邻仓的正式真相? | 项目 / 工作项、过程执行、治理决策、对话展示、工作台视图、观测日志、归档包等不能纳入 `L1-artifact`。 |
| 运行 / 定义 / 能力排除 | 这个事项是否属于 method-library、runtime、capability-hub 或外部内容后端? | 方法定义、运行时执行、能力注册、工具调用、多后端存储实现不归 Step 4 目标范围。 |
| 后续阶段排除 | 这个事项是否属于功能、规则、数据、接口、NFR、验收、架构、配置或实施计划? | Artifact kind、relation kind、Baseline pin、hash、tampered、P95、容量、Rust / PostgreSQL 等只后置审计,不在 Step 4 定稿。 |

因此,非目标候选不应只复用旧 `NG-1~NG-5`,因为旧非目标只覆盖 work、governance、process、conversation 和向量检索,没有覆盖当前已明确的 workspace、observability、archive、method-library、runtime、capability-hub、后续阶段和实现方案边界。

#### 5.3.2 旧非目标诊断

旧 `00-需求文档.md` 的非目标有价值,但需要扩展和改写:

| 旧非目标 | 可保留线索 | 当前问题 | Step 4 处理 |
|---|---|---|---|
| NG-1 工作项状态机 | work truth 不归 artifact。 | “只回传 artifact.approved 等事件”提前写了事件协作。 | 保留 work truth 排除,事件协作后置 Step 12。 |
| NG-2 Gate 决策 | governance truth 不归 artifact。 | “双身份 / frozen 状态”容易把 AIIA / SoA / baseline 规则提前写入。 | 保留治理决策排除,治理引用关系后置规则 / 数据 / 接口。 |
| NG-3 过程编排 | process truth 不归 artifact。 | “consume outputs / approved”提前写了过程协作。 | 保留过程执行排除,协作后置 Step 6 / Step 12。 |
| NG-4 Conversation 展示 | 对话展示不归 artifact。 | “只发 artifact 事件”提前写事件。 | 保留 conversation truth / 展示排除,显化协作后置接口。 |
| NG-5 向量检索系统本体 | 外部检索后端不归 artifact。 | 旧说法过窄,没有覆盖内容后端、运行时、能力仓和 observability。 | 扩展为“外部内容 / 检索 / 存储基础设施不归本仓”。 |

旧非目标缺少的当前边界:

- `L1-workspace`:工作台聚合视图、筛选状态、UI 展示状态不归 artifact。
- `L4-observability`:审计日志、trace、metrics、alert storage 不归 artifact。
- `L4-archive`:归档包、长期保留策略、恢复编排不归 artifact。
- `L3-method-library`:Artifact kind / WorkProductDefinition / method content 定义来源不归 artifact。
- `L2-runtime` / `L3-capability-hub`:执行、工具调用、能力注册和工具目录不归 artifact。
- 后续阶段事项:功能、规则、数据、接口、NFR、验收、架构、配置和实施计划不在 Step 4 定稿。

#### 5.3.3 非目标分组取舍

| 方案 | 非目标组织方式 | 优点 | 缺点 | 当前取舍 |
|---|---|---|---|---|
| 方案 A | 只保留旧 NG-1~NG-5 | 简短,承接旧文档。 | 覆盖不全,且混入事件协作、规则和状态细节。 | 不采用。 |
| 方案 B | 按相邻仓逐项列非目标 | 边界清楚,可直接回答“归属到哪里”。 | 列表较长,需要避免变成依赖矩阵。 | 采用为主。 |
| 方案 C | 按后续 Step 列非目标 | 能防止功能 / NFR / 验收前置。 | 不能覆盖相邻仓 truth 边界。 | 与方案 B 合并采用。 |
| 方案 D | 只写“非 artifact truth 均不做” | 简洁。 | 太空泛,不符合“非目标具体且有边界作用”。 | 不采用。 |
| 方案 E | 按旧对象拆非目标,如 Artifact kind / Baseline / DatasetArtifact | 看似细。 | 容易误把本仓后续会讨论的主题排除掉。 | 不采用。 |

当前推荐采用“相邻仓 truth 排除 + 后续阶段事项排除 + 实现 / 基础设施排除”的组合。这样既能补齐旧非目标缺口,又不会把后续本仓需要讨论的 Artifact 正文、版本、血缘、基线事实误排除。

#### 5.3.4 当前推荐方向

模块 2 再写入时,建议将非目标候选收束为三组:

| 非目标候选组 | 应覆盖事项 | 写法边界 |
|---|---|---|
| 相邻仓 truth 非目标 | work、process、governance、conversation、workspace、observability、archive 的正式真相。 | 写“不拥有 / 不接管这些真相”,不写依赖、接口或事件协作。 |
| 定义 / 运行 / 能力 / 基础设施非目标 | method-library 定义、runtime 执行、capability-hub 能力注册、外部内容 / 检索 / 存储后端。 | 写归属和不做原因,不写架构选型或 adapter 方案。 |
| 后续阶段非目标 | 功能清单、业务规则、数据归属、接口、NFR、验收、架构、配置、实施计划。 | 写“当前 Step 不定稿 / 后置到对应 Step”,不把本仓后续应讨论主题永久排除。 |

非目标候选需要特别避免两种错误:

- 把 `Artifact 正文、版本、血缘与基线事实` 写成非目标;这些是本仓目标范围。
- 把 `Artifact kind、ArtifactRelation、Baseline、DatasetArtifact、GetLineage、hash、tampered、P95` 永久排除;它们只是不能在 Step 4 定稿,后续仍要按对应 Step 重新审计。

下一步 `非目标候选:再写入` 才能把上述方向整理成“非目标 / 不做原因”的候选表。

### 5.4 模块 2:非目标候选:再写入

#### 5.4.1 非目标候选结论

| 非目标 | 不做原因 |
|---|---|
| Project / WorkItem / Iteration / backlog / 工作状态真相 | 属于 `L1-work`;`L1-artifact` 只承载制品事实,不接管工作管理真相。 |
| ProcessTemplate / ProcessInstance / Activity / checkpoint / 过程执行真相 | 属于 `L1-process`;`L1-artifact` 不编排过程,也不保存过程执行状态真相。 |
| Gate decision / Policy / AIIA / SoA 治理结论 / Nonconformity 纠正闭环 | 属于 `L1-governance`;`L1-artifact` 可承载相关制品正文和版本事实,不拥有治理裁决真相。 |
| conversation space / turn / review discussion / artifact preview 展示真相 | 属于 `L1-conversation` 或上层产品入口;`L1-artifact` 不保存对话或展示状态真相。 |
| workspace 聚合视图 / 筛选状态 / UI 布局 / console 展示状态 | 属于 `L1-workspace` / `L5-console`;`L1-artifact` 不拥有视图和交互状态。 |
| audit log store / trace storage / metrics / alert stream / 观测物理存储 | 属于 `L4-observability`;`L1-artifact` 不替代观测和审计日志存储。 |
| 归档包 / 长期保留策略 / 恢复编排 / 跨域快照包 | 属于 `L4-archive`;`L1-artifact` 不拥有归档包装和恢复编排真相。 |
| MethodContent / WorkProductDefinition / Artifact kind 定义来源 / ProcessTemplateDef | 属于 `L3-method-library`;`L1-artifact` 不拥有方法定义或 artifact 类型定义源。 |
| runtime 执行 / 工具调用 / 自动化策略执行 / policy cache | 属于 `L2-runtime` 等执行边界;`L1-artifact` 不执行运行时策略。 |
| capability registration / tool adapter / whitelist runtime decision | 属于 `L3-capability-hub`;`L1-artifact` 不拥有能力注册或工具调用真相。 |
| 外部内容存储 / 向量检索系统 / Git / S3 / inline / URL / PostgreSQL 等具体基础设施选型 | 属于后续架构、配置或外部基础设施;Step 4 不把实现后端写成需求目标。 |
| 具体功能清单、业务规则、数据归属、接口、NFR、验收、架构、配置和实施计划定稿 | 分别后置到 Step 7~14 和后续设计文档;Step 4 只收束目标与非目标。 |

#### 5.4.2 非目标粒度说明

| 非目标类别 | 粒度要求 | 当前处理 |
|---|---|---|
| 相邻仓 truth | 必须能说明“不归谁 / 归谁”,但不展开协作协议。 | 逐项排除 work、process、governance、conversation、workspace、observability、archive 的正式真相。 |
| 定义 / 运行 / 能力 truth | 必须防止方法定义、运行执行和能力注册被写成本仓目标。 | 逐项排除 method-library、runtime、capability-hub 的正式真相。 |
| 基础设施和实现方案 | 必须防止旧 README 的技术栈、多后端存储和检索方案反推为需求目标。 | 只写“不在 Step 4 定稿”,后置到架构、配置或外部基础设施讨论。 |
| 后续阶段事项 | 必须防止功能、规则、数据、接口、NFR 和验收提前混入目标层。 | 明确后置到对应 Step,不永久排除本仓后续需要讨论的主题。 |

#### 5.4.3 不采用非目标表达

| 表达 | 不采用原因 |
|---|---|
| `L1-artifact` 不负责 Artifact 正文、版本、血缘与基线事实。 | 这四类事实正是本仓目标范围,不能写成非目标。 |
| `L1-artifact` 不讨论 Artifact kind、ArtifactRelation、Baseline、DatasetArtifact。 | 这些是后续可能需要重新校准的本仓主题,不能在 Step 4 永久排除。 |
| `L1-artifact` 不提供 GetLineage、hash 校验、tampered 检测或 P95。 | 这些旧线索不能在 Step 4 定稿,但后续功能、规则、NFR 和验收仍要审计。 |
| `L1-artifact` 只负责保存文件,不负责版本、血缘或基线。 | 这会把本仓降格为内容存储后端,违反 Step 2 仓级定位。 |
| `L1-artifact` 不接入任何相邻仓。 | Step 4 只能排除相邻仓 truth 归属,不能提前否定后续依赖和接口协作。 |

#### 5.4.4 后续约束

模块 3 `范围收束与验证口径` 需要把目标候选和非目标候选合并成可贯穿后续 Step 的范围约束。该约束至少要回答:

- 哪些事实范围必须贯穿 Step 5~14。
- 哪些相邻仓边界必须在依赖、功能、数据、接口和验收中持续校验。
- 哪些旧材料线索只能作为后置审计输入。
- 哪些内容当前不定稿,但后续仍需讨论,不能被非目标永久排除。

模块 3 不得把范围约束扩写成用户角色、依赖裁剪、核心能力闭环、功能清单、业务规则、数据归属、接口、NFR 或验收标准。

### 5.5 模块 3:范围收束与验证口径:先思考

#### 5.5.1 问题回答

模块 3 要把模块 1 的目标候选和模块 2 的非目标候选合并成后续 Step 可持续使用的范围约束。这里的“验证口径”不是 Step 14 的验收标准,而是后续章节写作时用来检查是否越界、漏边界或把旧材料直接当结论的判定问题。

当前范围收束需要围绕四条主线:

| 收束主线 | 必须保留的范围 | 必须阻断的偏差 | 后续验证口径 |
|---|---|---|---|
| 制品事实正向范围 | Artifact 正文、版本、血缘与基线事实。 | 把 `L1-artifact` 写成附件仓、日志仓、视图仓、归档包或内容后端。 | Step 5~14 的角色、能力、功能、规则、数据、接口和验收都能回指这四类事实。 |
| 相邻仓 truth 边界 | 相邻仓可引用、消费、展示、审计或封存 Artifact。 | work / process / governance / conversation / workspace / observability / archive 复制正文、重建血缘、私自冻结基线或接管 Artifact truth。 | Step 6 / Step 11 / Step 12 必须区分 truth owner、引用方、消费者和展示方。 |
| 定义 / 运行 / 能力 / 基础设施分离 | `L1-artifact` 只承载制品事实,不拥有方法定义、运行执行、能力注册和存储 / 检索实现选型。 | 把 MethodContent、runtime policy cache、capability whitelist、Git / S3 / PostgreSQL / 向量库等写成当前需求目标。 | 后续出现这些主题时,必须标明归属或后置到架构、配置、实施计划。 |
| 旧材料后置审计 | 旧 kind、relation、Baseline、DatasetArtifact、GetLineage、hash、tampered、P95、容量和技术栈只作线索。 | 直接继承旧 G-1~G-7、旧验收数字、旧事件名、旧对象数量或旧技术方案。 | 这些线索只能在对应 Step 被重新讨论,不得跳过本轮校准写成正式结论。 |

因此,范围收束结论不应新增目标或非目标,而应把已经确认的目标 / 非目标变成“后续章节必须持续遵守的边界检查”。

#### 5.5.2 验证口径粒度

Step 4 的验证口径应是章节级一致性检查,不是测试用例、验收指标或性能阈值。

| 验证口径类型 | 可以写 | 不能写 |
|---|---|---|
| 正向一致性检查 | 后续章节是否围绕正文、版本、血缘、基线事实展开。 | 不写 Artifact 字段、relation kind、Baseline pin 规则。 |
| 负向边界检查 | 后续章节是否避免相邻仓 truth 转移到 `L1-artifact`。 | 不写依赖裁剪表、接口协议、事件 payload。 |
| 后置审计检查 | 旧材料线索是否只在对应 Step 重新讨论。 | 不把旧 P95、容量、hash、tampered 覆盖率写成当前验收。 |
| 归属检查 | method-library、runtime、capability-hub、observability、archive 等是否保持 truth owner。 | 不展开这些仓的内部需求。 |

当前 Step 可以说“后续章节必须能验证不越界”,但不能提前说“通过哪些测试用例验收”。具体功能、规则、数据、接口、NFR 和验收分别留给 Step 9~14。

#### 5.5.3 收束方案取舍

| 方案 | 范围收束方式 | 优点 | 缺点 | 当前取舍 |
|---|---|---|---|---|
| 方案 A | 只写一句“本仓负责 Artifact”。 | 简短。 | 无法约束正文、版本、血缘、基线和相邻仓边界。 | 不采用。 |
| 方案 B | 把目标表和非目标表重复一遍。 | 不会新增内容。 | 没有形成后续 Step 的检查口径。 | 不采用。 |
| 方案 C | 按“正向事实范围 + 相邻仓 truth 边界 + 定义 / 运行 / 能力 / 基础设施分离 + 旧材料后置审计”四条主线收束。 | 能承接目标和非目标,并可贯穿 Step 5~14。 | 后续仍需各 Step 继续细化。 | 采用。 |
| 方案 D | 现在直接列完整验收矩阵。 | 看似可验证。 | 违反 Step 4 粒度,会提前进入 Step 14。 | 不采用。 |
| 方案 E | 现在直接列完整依赖和数据归属矩阵。 | 有助于边界清晰。 | 违反 Step 6 / Step 11 粒度。 | 不采用。 |

#### 5.5.4 当前推荐方向

模块 3 再写入时,建议形成一段范围收束结论和一张后续验证口径表。

范围收束结论建议表达为:

```text
本次需求范围收束在可审计制品事实主题,即 Artifact 正文、版本、血缘与基线事实的需求边界。`L1-artifact` 不接管工作、过程、治理、对话、工作台、观测、归档、方法定义、运行执行、能力注册或基础设施选型真相;旧材料中的对象、功能、规则、性能、容量和技术方案只能作为后续 Step 的审计输入。
```

后续验证口径建议覆盖:

| 后续章节 | 验证问题 |
|---|---|
| Step 5 用户与角色 | 角色是否围绕产出、引用、审查、消费或审计 Artifact 事实,而不是相邻仓内部角色。 |
| Step 6 使用方与依赖 | 是否区分 truth owner、引用方、消费者、展示方和封存方,不转移 Artifact truth。 |
| Step 7 核心能力闭环 | 核心能力是否覆盖正文、版本、血缘、基线事实闭环,且没有引入无关仓能力。 |
| Step 8~10 故事 / 功能 / 规则 | 是否只把旧 kind、relation、Baseline、GetLineage、hash、tampered 等线索作为候选重新校准。 |
| Step 11 数据需求与数据归属 | 是否明确 Artifact truth 与相邻仓快照、引用、日志、归档包、展示状态的边界。 |
| Step 12 接口与依赖 | 是否只定义必要协作边界,不让接口协议替代需求范围或 truth 归属。 |
| Step 13~14 NFR / 验收 | 是否从已确认能力、规则、数据和接口推出指标与验收,不继承旧 P95、容量或覆盖率数字。 |

下一步 `范围收束与验证口径:再写入` 只能把上述推荐方向整理成结论,不得进入模块 4 旧材料差异审计。

### 5.6 模块 3:范围收束与验证口径:再写入

#### 5.6.1 范围收束结论

本次需求范围收束在可审计制品事实主题,即 Artifact 正文、版本、血缘与基线事实的需求边界。`L1-artifact` 不接管工作、过程、治理、对话、工作台、观测、归档、方法定义、运行执行、能力注册或基础设施选型真相;旧材料中的对象、功能、规则、性能、容量和技术方案只能作为后续 Step 的审计输入。

该结论产生四条后续约束:

| 约束 | 内容 | 后续检查点 |
|---|---|---|
| 正向事实范围 | 后续章节必须围绕 Artifact 正文、版本、血缘与基线事实展开。 | 任一角色、能力、功能、规则、数据、接口或验收若不能回指这四类事实,应被删除、后置或改归相邻仓。 |
| 相邻仓 truth 边界 | 相邻仓可以引用、消费、展示、审计或封存 Artifact,但不拥有 Artifact 正文、版本、血缘与基线事实。 | 后续不得出现 work / process / governance / conversation / workspace / observability / archive 复制正文、重建血缘或私自冻结基线。 |
| 定义 / 运行 / 能力 / 基础设施分离 | 方法定义、运行执行、能力注册、工具调用、存储后端和检索系统不属于 Step 4 目标范围。 | 后续若出现 MethodContent、runtime policy cache、capability whitelist、Git / S3 / PostgreSQL / 向量库等,必须标明归属或后置。 |
| 旧材料后置审计 | 旧 kind、relation、Baseline、DatasetArtifact、GetLineage、hash、tampered、P95、容量和技术栈只作线索。 | 这些线索只能在对应 Step 重新讨论,不得跳过本轮校准写成正式需求结论。 |

#### 5.6.2 后续章节验证口径

| 后续章节 | 验证问题 | 当前 Step 4 不允许提前写入 |
|---|---|---|
| Step 5 用户与角色 | 角色是否围绕产出、引用、审查、消费或审计 Artifact 事实,而不是相邻仓内部角色。 | 不列权限模型、操作菜单、审批角色实现或 identity 生命周期。 |
| Step 6 使用方与依赖 | 是否区分 truth owner、引用方、消费者、展示方、观测方和封存方,且不转移 Artifact truth。 | 不写依赖裁剪表、接口方向、事件订阅或数据同步细节。 |
| Step 7 核心能力闭环 | 核心能力是否覆盖 Artifact 正文、版本、血缘、基线事实闭环,且没有引入无关仓能力。 | 不提前命名完整能力节点、状态迁移或闭环图。 |
| Step 8 用户故事 | 用户故事是否回指制品事实的产出、版本化、追溯、基线冻结或审计消费语境。 | 不写完整故事清单和验收条件。 |
| Step 9 功能需求 | 功能是否只描述外部可见行为,并从正文、版本、血缘、基线事实推出。 | 不提前定 Artifact kind、relation kind、GetLineage 或具体命令 / 查询。 |
| Step 10 业务规则与边界约束 | 规则是否来自已确认能力和事实边界,而不是旧 hash、tampered、Baseline pin 规则的直接继承。 | 不提前写 pin 规则、防篡改规则、事件触发规则或状态机。 |
| Step 11 数据需求与数据归属 | 是否明确 Artifact truth 与相邻仓快照、引用、日志、归档包、展示状态的边界。 | 不写 schema、字段、repository、数据库表或存储后端。 |
| Step 12 接口与依赖 | 是否只定义必要协作边界,不让接口协议替代需求范围或 truth 归属。 | 不写 event payload、RPC schema、port trait 或 adapter 方案。 |
| Step 13 非功能需求 | 指标是否从已确认能力、规则、数据和接口推出,而不是继承旧 P95、容量或性能数字。 | 不提前写 P95、容量、吞吐、覆盖率或技术栈指标。 |
| Step 14 验收标准 | 验收是否覆盖已确认能力、功能、规则、数据、接口和 NFR,而不是复用旧验收用例。 | 不提前写测试用例、通过条件、evidence schema 或自动化脚本。 |

#### 5.6.3 越界判定口径

| 待写内容 | 当前判定 |
|---|---|
| 能回指 Artifact 正文、版本、血缘或基线事实 | 可以作为后续 Step 候选,但仍需在对应 Step 重新校准。 |
| 只属于 work、process、governance、conversation、workspace、observability 或 archive 的正式 truth | 不写入 `L1-artifact` 目标范围;可在后续依赖或接口 Step 作为协作对象讨论。 |
| 属于 method-library、runtime、capability-hub 或基础设施选型 | 不写入需求目标;按归属后置到定义、运行、能力、架构或配置讨论。 |
| 来自旧文档的对象、功能、规则、NFR、验收或实现方案 | 只作为历史线索;必须在对应 Step 重新讨论后才能进入正式需求。 |
| 无法说明归属、事实边界或后续验证方式 | 暂不写入,进入风险或待确认事项,不得伪装成结论。 |

#### 5.6.4 后续约束

模块 4 `旧材料差异审计` 需要基于上述范围收束结论,审计旧 README 和旧 `00-需求文档.md` 的目标 / 非目标内容:

- 哪些旧线索可保留为后续 Step 输入。
- 哪些旧目标把功能、规则、NFR、验收或实现方案提前写入目标层。
- 哪些旧非目标仍可保留,但需要去掉事件、状态或接口细节。
- 哪些旧缺口已由当前 Step 4 补齐,例如 workspace、observability、archive、method-library、runtime 和 capability-hub 边界。

模块 4 仍不得修改正式 `00-需求文档.md`,也不得进入结构化中间产物、回填草稿或自检。

### 5.7 模块 4:旧材料差异审计:先思考

#### 5.7.1 审计问题

模块 4 要回答“旧 README / 旧 `00-需求文档.md` 的目标与非目标内容,哪些可以作为线索保留,哪些会污染当前 Step 4 结论”。审计对象不是整个旧需求文档,而是目标 / 非目标相关材料以及 README 中直接影响目标层的使命、技术栈、性能和安全表达。

当前审计必须使用模块 3 的范围收束结论作为判定标准:

| 判定标准 | 通过 | 不通过 |
|---|---|---|
| 是否围绕 Artifact 正文、版本、血缘与基线事实 | 可保留为本步目标 / 非目标线索或后续 Step 输入。 | 若只是对象数量、功能名、指标或技术栈,不能作为 Step 4 结论。 |
| 是否保持相邻仓 truth 边界 | 可保留相邻仓“不拥有 Artifact truth”的边界线索。 | 若夹带事件、状态、接口或协作细节,需要后置。 |
| 是否属于后续 Step 粒度 | 可作为 Step 7~14 的审计输入。 | 不能在 Step 4 直接定稿为目标、非目标或验收。 |
| 是否是旧实现方案 | 只能作为历史材料。 | 不得进入当前需求目标。 |

因此,模块 4 的输出不应复述旧材料,而应给出“保留 / 改写 / 后置 / 废弃”的处理口径。

#### 5.7.2 旧 README 诊断

旧 README 的仓使命写到 Artifact、ArtifactRelation、Baseline、DatasetArtifact 和“可审计产出承载者”,其中“可审计产出”与“Baseline / 血缘”是有效线索,但 README 同时把对象枚举、技术栈、外部依赖、目录结构、性能目标和安全扫描写在仓级说明里。

| 旧 README 内容 | 可保留线索 | 当前问题 | Step 4 处理 |
|---|---|---|---|
| 制品域服务 / 一切可审计产出的承载者 | 支撑 `L1-artifact` 是可审计制品事实仓。 | “一切”过大,需要收束到 Artifact 正文、版本、血缘与基线事实。 | 改写后保留。 |
| Artifact(16 kind)+ ArtifactRelation(7 kind)+ Baseline + DatasetArtifact | 提醒后续讨论制品类型、血缘、基线和数据集特化。 | 对象数量和对象清单不属于 Step 4 目标。 | 后置 Step 7 / 9 / 10 / 11 / 14。 |
| Rust + PostgreSQL + Git / S3 / inline / external URL | 可能是旧实现想象。 | 技术栈和内容后端选型不属于需求目标。 | 废弃为 Step 4 结论;后置架构 / 配置。 |
| 外部 PG / Git / S3 / 向量库 | 说明曾考虑内容存储和检索。 | 把外部基础设施写成仓目标。 | 扩展为“外部内容 / 检索 / 存储基础设施非目标”。 |
| P95、5000w Artifact、1.5 亿 Relation | 可能是旧 NFR 线索。 | 无当前测量来源,且属于非功能 / 验收。 | 后置 Step 13 / 14。 |
| hash 定期核对、tampered critical 事件 | 提醒后续讨论完整性和篡改检测。 | 属于规则、事件、接口和验收。 | 后置 Step 10 / 12 / 14。 |

旧 README 最核心的可保留点是“制品事实必须可审计、可追溯、可冻结”。其余对象、指标、技术栈和实现细节不得作为 Step 4 结论。

#### 5.7.3 旧目标 G-1~G-7 诊断

旧 `00-需求文档.md` 的目标表看似可验证,但把对象覆盖、业务规则、性能指标、事件触发和验收方式全部写入目标层。

| 旧目标 | 当前诊断 | Step 4 处理 |
|---|---|---|
| G-1 16 种 kind 全覆盖 | 对象枚举 / 状态机 / 测试覆盖口径。 | 不作为目标;后置 Step 7 / 9 / 11 / 14。 |
| G-2 7 种关系全覆盖 | 关系种类 / 血缘规则 / 关系测试口径。 | 不作为目标;后置 Step 9 / 10 / 11 / 14。 |
| G-3 Baseline pin 到 version+hash | 有效基线事实线索,但 pin 到 version+hash 是规则和数据细节。 | Step 4 只保留“基线事实边界”;规则后置 Step 10 / 11 / 14。 |
| G-4 hash 校验 approve < 50ms | 完整性规则 + 性能指标 + benchmark。 | 后置 Step 10 / 13 / 14。 |
| G-5 GetLineage P95(depth=5) < 500ms | 功能 + 查询深度 + 性能指标。 | 后置 Step 9 / 13 / 14。 |
| G-6 写入 P95 < 200ms | 非功能指标。 | 后置 Step 13 / 14。 |
| G-7 tampered 检测事件 100% 触发 | 规则 + 事件 + 接口 + 验收覆盖。 | 后置 Step 10 / 12 / 14。 |

旧 G-1~G-7 不适合作为当前目标表保留。它们的主题线索可以保留,但必须在对应 Step 按本轮边界重新校准。

#### 5.7.4 旧非目标 NG-1~NG-5 诊断

旧非目标的方向基本正确,但粒度不稳定:每条都在“不做”的同时提前写了事件、状态或接口协作。

| 旧非目标 | 可保留线索 | 当前问题 | Step 4 处理 |
|---|---|---|---|
| NG-1 工作项状态机 | work truth 不归 artifact。 | “只回传 artifact.approved 等事件”提前写事件协作。 | 保留 work truth 排除;事件后置 Step 12。 |
| NG-2 Gate 决策 | governance truth 不归 artifact。 | “双身份 / frozen 状态”提前写治理和基线规则。 | 保留 Gate decision 非目标;规则后置。 |
| NG-3 过程编排 | process truth 不归 artifact。 | “只消费 outputs / approved”提前写过程协作。 | 保留 process truth 排除;协作后置。 |
| NG-4 Conversation 展示 | conversation / 展示 truth 不归 artifact。 | “只发 artifact 事件”提前写接口。 | 保留 conversation 展示排除;事件后置。 |
| NG-5 向量检索系统本体 | 外部检索系统不归 artifact。 | 范围过窄,未覆盖外部内容存储、基础设施和能力注册。 | 扩展为外部内容 / 检索 / 存储基础设施非目标。 |

旧非目标缺失 workspace、observability、archive、method-library、runtime、capability-hub 以及“后续阶段不定稿”的边界,这些已经由当前模块 2 / 3 补齐。

#### 5.7.5 当前推荐方向

模块 4 再写入时,建议输出三类审计结论:

| 类别 | 内容 |
|---|---|
| 可保留线索 | 可审计产出、正文 / 版本 / 血缘 / 基线、Baseline、DatasetArtifact、完整性、篡改、血缘查询、相邻仓边界。 |
| 必须后置线索 | 16 kind、7 relation、Baseline pin、hash 校验、GetLineage、tampered 事件、P95、容量、旧验收方式。 |
| 废弃为 Step 4 结论 | 旧 G-1~G-7 的目标表、旧 README 技术栈 / 外部依赖 / 目录 / 性能目标、旧非目标中的事件和状态细节。 |

下一步 `旧材料差异审计:再写入` 只把上述审计判断整理成结论,不得进入结构化中间产物、回填草稿或正式 `00-需求文档.md`。

### 5.8 模块 4:旧材料差异审计:再写入

#### 5.8.1 可保留线索

| 旧材料线索 | 保留方式 | 后续落点 |
|---|---|---|
| “制品域服务”“可审计产出承载者” | 改写为“可审计制品事实仓”,并收束到 Artifact 正文、版本、血缘与基线事实。 | Step 4 目标表 / 范围收束结论。 |
| Artifact 正文、版本、血缘、Baseline | 保留为本仓事实边界主线。 | Step 7 核心能力闭环;Step 9 功能;Step 10 规则;Step 11 数据;Step 14 验收。 |
| DatasetArtifact | 保留为后续制品类型 / 数据集特化线索,不在 Step 4 定稿。 | Step 7 / Step 9 / Step 11。 |
| hash / tampered | 保留为完整性和防篡改主题线索,不在 Step 4 定规则、事件或指标。 | Step 10 / Step 12 / Step 13 / Step 14。 |
| GetLineage / relation graph | 保留为血缘查询和追溯能力线索,不在 Step 4 定功能名、深度或 P95。 | Step 7 / Step 9 / Step 13 / Step 14。 |
| work / process / governance / conversation 边界 | 保留相邻仓 truth 不归 `L1-artifact` 的方向。 | Step 4 非目标表;Step 6 / Step 12 依赖协作。 |

#### 5.8.2 必须后置线索

| 旧材料内容 | 后置原因 | 后置位置 |
|---|---|---|
| `16 kind` | 对象枚举和覆盖口径,不是目标层结论。 | Step 7 / Step 9 / Step 11 / Step 14。 |
| `7 relation` | 关系类型、血缘规则和测试覆盖口径。 | Step 9 / Step 10 / Step 11 / Step 14。 |
| `Baseline pin 到 version+hash` | 基线规则和数据归属细节。 | Step 10 / Step 11 / Step 14。 |
| `hash 校验 approve < 50ms` | 规则 + 性能指标 + benchmark。 | Step 10 / Step 13 / Step 14。 |
| `GetLineage P95(depth=5) < 500ms` | 功能 + 参数 + 非功能指标。 | Step 9 / Step 13 / Step 14。 |
| `写入 P95 < 200ms` | 非功能指标且旧数字未校准。 | Step 13 / Step 14。 |
| `tampered 检测事件 100% 触发` | 规则、事件、接口和验收覆盖混写。 | Step 10 / Step 12 / Step 14。 |
| 旧用户故事、功能表、业务规则、数据结构、接口、NFR、验收 | 均属于后续章节粒度。 | Step 5~14 对应章节重新校准。 |

#### 5.8.3 废弃为 Step 4 结论的内容

| 废弃内容 | 废弃原因 |
|---|---|
| 旧 G-1~G-7 目标表原文 | 把对象覆盖、规则、功能、NFR、验收方式混写成目标,不符合当前 Step 4 粒度。 |
| 旧 README 技术栈 `Rust + PostgreSQL` | 属于实现和架构候选,不能作为需求目标。 |
| 旧 README 多后端内容存储 `Git / S3 / inline / URL` | 属于基础设施和配置候选,不能作为 Step 4 目标。 |
| 旧 README 外部 PG / Git / S3 / 向量库依赖 | 属于架构、配置或外部基础设施,不能反推需求目标。 |
| 旧 README 目录结构和模块组织 | 属于实现仓组织方式,不能进入需求目标。 |
| 旧非目标中的 `只回传 artifact.approved`、`只消费 outputs / approved`、`只发 artifact 事件` | 属于接口 / 事件协作细节,应后置 Step 12。 |
| 旧非目标中的 `双身份 / frozen 状态` | 属于治理和基线规则细节,不能写在非目标原因中。 |

#### 5.8.4 当前 Step 4 补齐的旧缺口

| 旧缺口 | 当前补齐方式 |
|---|---|
| 旧非目标未覆盖 `L1-workspace` | 当前非目标已排除 workspace 聚合视图、筛选状态、UI 布局和 console 展示状态。 |
| 旧非目标未覆盖 `L4-observability` | 当前非目标已排除 audit log store、trace storage、metrics 和 alert stream。 |
| 旧非目标未覆盖 `L4-archive` | 当前非目标已排除归档包、长期保留策略、恢复编排和跨域快照包。 |
| 旧非目标未覆盖 `L3-method-library` | 当前非目标已排除 MethodContent、WorkProductDefinition、Artifact kind 定义来源和 ProcessTemplateDef。 |
| 旧非目标未覆盖 `L2-runtime` / `L3-capability-hub` | 当前非目标已排除 runtime 执行、工具调用、能力注册和 whitelist runtime decision。 |
| 旧目标缺少后置审计边界 | 当前范围收束已要求旧对象、功能、规则、性能、容量和技术方案只作后续 Step 输入。 |

#### 5.8.5 后续约束

后续 `结构化中间产物` 必须基于模块 1~4 的结论生成三类内容:

- 目标表候选:只保留 Step 4 粒度的目标,不继承旧 G-1~G-7。
- 非目标表候选:保留相邻仓和后续阶段边界,去掉旧非目标中的事件、状态和接口细节。
- 范围收束候选:把正文、版本、血缘、基线事实范围和旧材料后置审计边界写成可回填草稿。

`结构化中间产物` 仍不得修改正式 `00-需求文档.md`,不得进入 Step 5,也不得写功能、规则、数据、接口、NFR 或验收。

---

## 6. 结构化中间产物

### 6.1 目标表候选

| 目标 | 说明 | 验证方式 |
|---|---|---|
| 建立可审计制品事实的需求边界 | 明确 `L1-artifact` 本轮需求收束对象是平台产出的可审计制品事实,不是旧对象清单、功能清单、性能指标或实现方案的直接继承。 | 后续章节不把旧 `16 kind`、`7 relation`、旧功能、旧 P95、旧技术栈或旧验收数字直接作为当前结论。 |
| 收束 Artifact 正文、版本、血缘与基线事实范围 | 承接 Step 2 定位,明确本仓目标围绕 Artifact 正文、版本、血缘与基线事实成立,避免把 Artifact 降格为附件、日志、视图、归档包或内容存储后端。 | 后续核心能力、功能、规则、数据和验收都能回指正文、版本、血缘与基线事实,且不把这些事实散落到相邻仓。 |
| 收束相邻仓围绕 Artifact 的协作边界 | 明确 work、process、governance、conversation、workspace、observability 和 archive 可以引用、消费、展示、审计或封存 Artifact,但不拥有 Artifact 正文、版本、血缘与基线事实。 | 后续依赖、接口、数据和验收章节不出现相邻仓复制正文、重建血缘、私自冻结基线或把视图 / 日志 / 归档包当成 Artifact 真相。 |
| 建立旧材料线索的后置审计边界 | 明确旧材料中的 Artifact kind、ArtifactRelation、Baseline、DatasetArtifact、GetLineage、hash、tampered、P95、容量和技术栈只作为后续审计输入。 | 后续 Step 对功能、规则、数据、接口、NFR 和验收逐项重新校准,不得把旧线索跳过本轮讨论直接写成正式需求。 |

### 6.2 非目标表候选

| 非目标 | 不做原因 |
|---|---|
| Project / WorkItem / Iteration / backlog / 工作状态真相 | 属于 `L1-work`;`L1-artifact` 只承载制品事实,不接管工作管理真相。 |
| ProcessTemplate / ProcessInstance / Activity / checkpoint / 过程执行真相 | 属于 `L1-process`;`L1-artifact` 不编排过程,也不保存过程执行状态真相。 |
| Gate decision / Policy / AIIA / SoA 治理结论 / Nonconformity 纠正闭环 | 属于 `L1-governance`;`L1-artifact` 可承载相关制品正文和版本事实,不拥有治理裁决真相。 |
| conversation space / turn / review discussion / artifact preview 展示真相 | 属于 `L1-conversation` 或上层产品入口;`L1-artifact` 不保存对话或展示状态真相。 |
| workspace 聚合视图 / 筛选状态 / UI 布局 / console 展示状态 | 属于 `L1-workspace` / `L5-console`;`L1-artifact` 不拥有视图和交互状态。 |
| audit log store / trace storage / metrics / alert stream / 观测物理存储 | 属于 `L4-observability`;`L1-artifact` 不替代观测和审计日志存储。 |
| 归档包 / 长期保留策略 / 恢复编排 / 跨域快照包 | 属于 `L4-archive`;`L1-artifact` 不拥有归档包装和恢复编排真相。 |
| MethodContent / WorkProductDefinition / Artifact kind 定义来源 / ProcessTemplateDef | 属于 `L3-method-library`;`L1-artifact` 不拥有方法定义或 artifact 类型定义源。 |
| runtime 执行 / 工具调用 / 自动化策略执行 / policy cache | 属于 `L2-runtime` 等执行边界;`L1-artifact` 不执行运行时策略。 |
| capability registration / tool adapter / whitelist runtime decision | 属于 `L3-capability-hub`;`L1-artifact` 不拥有能力注册或工具调用真相。 |
| 外部内容存储 / 向量检索系统 / Git / S3 / inline / URL / PostgreSQL 等具体基础设施选型 | 属于后续架构、配置或外部基础设施;Step 4 不把实现后端写成需求目标。 |
| 具体功能清单、业务规则、数据归属、接口、NFR、验收、架构、配置和实施计划定稿 | 分别后置到 Step 7~14 和后续设计文档;Step 4 只收束目标与非目标。 |

### 6.3 范围收束候选

本次需求范围收束在可审计制品事实主题,即 Artifact 正文、版本、血缘与基线事实的需求边界。`L1-artifact` 不接管工作、过程、治理、对话、工作台、观测、归档、方法定义、运行执行、能力注册或基础设施选型真相;旧材料中的对象、功能、规则、性能、容量和技术方案只能作为后续 Step 的审计输入。

### 6.4 后续章节验证口径候选

| 后续章节 | 验证问题 |
|---|---|
| Step 5 用户与角色 | 角色是否围绕产出、引用、审查、消费或审计 Artifact 事实,而不是相邻仓内部角色。 |
| Step 6 使用方与依赖 | 是否区分 truth owner、引用方、消费者、展示方、观测方和封存方,且不转移 Artifact truth。 |
| Step 7 核心能力闭环 | 核心能力是否覆盖 Artifact 正文、版本、血缘、基线事实闭环,且没有引入无关仓能力。 |
| Step 8 用户故事 | 用户故事是否回指制品事实的产出、版本化、追溯、基线冻结或审计消费语境。 |
| Step 9 功能需求 | 功能是否只描述外部可见行为,并从正文、版本、血缘、基线事实推出。 |
| Step 10 业务规则与边界约束 | 规则是否来自已确认能力和事实边界,而不是旧 hash、tampered、Baseline pin 规则的直接继承。 |
| Step 11 数据需求与数据归属 | 是否明确 Artifact truth 与相邻仓快照、引用、日志、归档包、展示状态的边界。 |
| Step 12 接口与依赖 | 是否只定义必要协作边界,不让接口协议替代需求范围或 truth 归属。 |
| Step 13 非功能需求 | 指标是否从已确认能力、规则、数据和接口推出,而不是继承旧 P95、容量或性能数字。 |
| Step 14 验收标准 | 验收是否覆盖已确认能力、功能、规则、数据、接口和 NFR,而不是复用旧验收用例。 |

### 6.5 结构化产物自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 目标表是否只写状态、边界或能力范围 | pass | 未写功能名、对象字段、性能指标或验收用例。 |
| 非目标表是否具体且有归属 | pass | 已覆盖相邻仓、定义 / 运行 / 能力仓、外部基础设施和后续阶段事项。 |
| 是否继承旧 G-1~G-7 | pass | 旧目标仅作为后续审计输入,未进入当前目标表。 |
| 是否把本仓核心事实误写为非目标 | pass | Artifact 正文、版本、血缘与基线事实保留为正向范围。 |
| 是否修改正式 `00-需求文档.md` | pass | 本阶段只写中间产物。 |

下一步 `回填草稿` 只能把上述结构化中间产物整理成正式第 4 章草稿候选,仍不得修改正式 `00-需求文档.md`,不得进入自检或 Step 5。

---

## 7. 回填草稿

以下草稿仅供 Step 17 统一重建正式 `00-需求文档.md` 时使用。本阶段不直接修改正式文档。

```md
## 4. 目标与非目标

> 校准来源:
> - `design-calibration/00_req_step_04_goals_non_goals.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“模块思考记录”“结构化中间产物”和“旧材料差异审计”小节,了解本章如何从旧 G-1~G-7 与旧 NG-1~NG-5 收敛为当前需求边界。

### 4.1 目标

| 目标 | 说明 | 验证方式 |
|---|---|---|
| 建立可审计制品事实的需求边界 | 明确 `L1-artifact` 本轮需求收束对象是平台产出的可审计制品事实,不是旧对象清单、功能清单、性能指标或实现方案的直接继承。 | 后续章节不把旧 `16 kind`、`7 relation`、旧功能、旧 P95、旧技术栈或旧验收数字直接作为当前结论。 |
| 收束 Artifact 正文、版本、血缘与基线事实范围 | 承接 Step 2 定位,明确本仓目标围绕 Artifact 正文、版本、血缘与基线事实成立,避免把 Artifact 降格为附件、日志、视图、归档包或内容存储后端。 | 后续核心能力、功能、规则、数据和验收都能回指正文、版本、血缘与基线事实,且不把这些事实散落到相邻仓。 |
| 收束相邻仓围绕 Artifact 的协作边界 | 明确 work、process、governance、conversation、workspace、observability 和 archive 可以引用、消费、展示、审计或封存 Artifact,但不拥有 Artifact 正文、版本、血缘与基线事实。 | 后续依赖、接口、数据和验收章节不出现相邻仓复制正文、重建血缘、私自冻结基线或把视图 / 日志 / 归档包当成 Artifact 真相。 |
| 建立旧材料线索的后置审计边界 | 明确旧材料中的 Artifact kind、ArtifactRelation、Baseline、DatasetArtifact、GetLineage、hash、tampered、P95、容量和技术栈只作为后续审计输入。 | 后续 Step 对功能、规则、数据、接口、NFR 和验收逐项重新校准,不得把旧线索跳过本轮讨论直接写成正式需求。 |

### 4.2 非目标

| 非目标 | 不做原因 |
|---|---|
| Project / WorkItem / Iteration / backlog / 工作状态真相 | 属于 `L1-work`;`L1-artifact` 只承载制品事实,不接管工作管理真相。 |
| ProcessTemplate / ProcessInstance / Activity / checkpoint / 过程执行真相 | 属于 `L1-process`;`L1-artifact` 不编排过程,也不保存过程执行状态真相。 |
| Gate decision / Policy / AIIA / SoA 治理结论 / Nonconformity 纠正闭环 | 属于 `L1-governance`;`L1-artifact` 可承载相关制品正文和版本事实,不拥有治理裁决真相。 |
| conversation space / turn / review discussion / artifact preview 展示真相 | 属于 `L1-conversation` 或上层产品入口;`L1-artifact` 不保存对话或展示状态真相。 |
| workspace 聚合视图 / 筛选状态 / UI 布局 / console 展示状态 | 属于 `L1-workspace` / `L5-console`;`L1-artifact` 不拥有视图和交互状态。 |
| audit log store / trace storage / metrics / alert stream / 观测物理存储 | 属于 `L4-observability`;`L1-artifact` 不替代观测和审计日志存储。 |
| 归档包 / 长期保留策略 / 恢复编排 / 跨域快照包 | 属于 `L4-archive`;`L1-artifact` 不拥有归档包装和恢复编排真相。 |
| MethodContent / WorkProductDefinition / Artifact kind 定义来源 / ProcessTemplateDef | 属于 `L3-method-library`;`L1-artifact` 不拥有方法定义或 artifact 类型定义源。 |
| runtime 执行 / 工具调用 / 自动化策略执行 / policy cache | 属于 `L2-runtime` 等执行边界;`L1-artifact` 不执行运行时策略。 |
| capability registration / tool adapter / whitelist runtime decision | 属于 `L3-capability-hub`;`L1-artifact` 不拥有能力注册或工具调用真相。 |
| 外部内容存储 / 向量检索系统 / Git / S3 / inline / URL / PostgreSQL 等具体基础设施选型 | 属于后续架构、配置或外部基础设施;Step 4 不把实现后端写成需求目标。 |
| 具体功能清单、业务规则、数据归属、接口、NFR、验收、架构、配置和实施计划定稿 | 分别后置到 Step 7~14 和后续设计文档;Step 4 只收束目标与非目标。 |

### 4.3 范围收束

本次需求范围收束在可审计制品事实主题,即 Artifact 正文、版本、血缘与基线事实的需求边界。`L1-artifact` 不接管工作、过程、治理、对话、工作台、观测、归档、方法定义、运行执行、能力注册或基础设施选型真相;旧材料中的对象、功能、规则、性能、容量和技术方案只能作为后续 Step 的审计输入。
```

### 7.1 草稿自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否按书写规范形成目标表和非目标表 | pass | 目标表为“目标 / 说明 / 验证方式”,非目标表为“非目标 / 不做原因”。 |
| 是否包含范围收束结论 | pass | 已补充 §4.3 范围收束。 |
| 是否新增未讨论结论 | pass | 草稿全部来自 §6 结构化中间产物。 |
| 是否修改正式 `00-需求文档.md` | pass | 草稿仅写入当前中间产物。 |

下一步 `自检与停审` 需要判断 Step 4 是否允许进入 Step 5,并同步项目级台账和文档级 flow。

---

## 8. 自检与停审

### 8.1 Step 4 完成门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否形成目标表候选 | pass | §6.1 已形成“目标 / 说明 / 验证方式”三列表。 |
| 是否形成非目标表候选 | pass | §6.2 已形成“非目标 / 不做原因”两列表。 |
| 每个目标是否可被后续章节验证 | pass | 目标验证方式均指向后续章节的边界一致性检查,未写测试用例或 NFR 指标。 |
| 每个非目标是否具体且有归属 | pass | 非目标覆盖相邻仓、定义 / 运行 / 能力仓、外部基础设施和后续阶段事项。 |
| 是否回应 Step 3 问题 | pass | 目标和范围收束回应 P-ART-001~003:需求边界未收束、多仓解释风险、问题 / 方案 / 指标混层。 |
| 是否承接 Step 2 定位 | pass | 全部目标围绕 Artifact 正文、版本、血缘与基线事实展开。 |
| 是否完成旧材料差异审计 | pass | §5.7 和 §5.8 已审计旧 README、旧 G-1~G-7、旧 NG-1~NG-5。 |
| 是否避免继承旧对象 / 指标 / 技术栈 | pass | 旧 kind、relation、P95、容量、hash、tampered、Rust / PostgreSQL 等均后置。 |
| 是否避免写入功能、规则、数据、接口、NFR 或验收 | pass | 当前 Step 仅写目标、非目标、范围收束和后续验证口径。 |
| 是否修改正式 `00-需求文档.md` | pass | 本 Step 只写中间产物,正式文档未修改。 |

### 8.2 允许进入下一步判定

| 项 | 判定 |
|---|---|
| Step 4 gate_status | pass |
| 是否允许进入 Step 5 | yes,等待用户确认 |
| 下一 Step | Step 5 `用户与角色` |
| 下一步禁写范围 | 不得提前写依赖裁剪、核心能力闭环、功能、业务规则、数据归属、接口、NFR、验收、schema、事件 payload、port、repository、配置或实施边界。 |
| 正式文档写入 | 仍 blocked;正式 `00-需求文档.md` 等 Step 17 统一组装。 |

### 8.3 Step 5 开工前恢复要求

进入 Step 5 前必须先读取:

- `project_execution_ledger.md`
- `00_requirements_calibration_flow.md`
- `00_req_step_04_goals_non_goals.md`
- `standards/document/需求文档讨论流程_SOP.md` Step 5
- `standards/document/需求文档书写规范.md` 4.5

Step 5 只能讨论用户与角色,不得提前写依赖、能力、功能、规则、数据、接口、NFR 或验收。
