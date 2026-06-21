# L3-method-library 02 概要 Step 5: 主要组成部分、职责与边界

> 创建日期: 2026-06-16
> 状态: rewritten_completed
> 当前模式: full-restart
> 文档级 flow: `design-calibration/02_hld_calibration_flow.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 正式文档目标: `projects/L3-method-library/02-概要设计.md`
> 本轮口径: 基于 Step 4 代码主体框架收稳业务主要组成部分;不从旧 A-H、旧 P0 对象、旧 fingerprint / snapshot / outbox 或存储实现反推组成部分。
> 重写裁决: 原 Step 5 completed 结论粒度不足,当前作为 historical material 保留;新的有效恢复点从 `0R` 重写开工区开始。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 5 主要组成部分、职责与边界 |
| 输出文件 | `design-calibration/02_hld_step_05_components_boundary.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/02_hld_calibration_flow.md` |
| 已读取前序 Step | yes:`design-calibration/02_hld_step_01_upstream_boundary.md`;`02_hld_step_02_scope.md`;`02_hld_step_03_constraints.md`;`02_hld_step_04_code_subject_framework.md` |
| 已读取 SOP / 书写规范 | yes:`概要设计讨论流程_SOP.md` Step 5;`概要设计书写规范.md` 4.5;`设计文档讨论中间产物规范.md` |
| 已读取正式输入 | yes:`00-需求文档.md`;`01-架构设计.md` |
| 旧材料处理 | 旧 `02_hld_step_05_components_boundary.md`、旧 `02-概要设计.md` 和历史 `03_ddd_*` 只作后置差异审计 |
| 进入条件 | superseded_by_rewrite |
| next_allowed_action | 读取 `0R` 重写开工区,按 `0R.2` 当前模块状态表推进。 |

---

## 0R. Step 5 重写开工确认

| 项目 | 记录 |
|---|---|
| rewrite 状态 | completed |
| rewrite 触发 | Step 5 往后粒度偏浅,正式 `02-概要设计.md` §5~§9 和 Step 6~9 承接链出现旧主语 / 旧状态主线污染风险。 |
| 当前有效恢复点 | Step 6 关键对象轮廓 / 反查:先思考。 |
| 当前有效输入 | 当前 `00-需求文档.md`;当前 `01-架构设计.md`;Step 1~4;当前 Step 5 historical 内容;Step 6~9 仅作下游反查。 |
| 当前不可做 | 不继续 Step 12;不跳过 Step 6;不直接改 Step 7~9;不把正式 §6~§9 旧材料当成当前 truth。 |
| 写入纪律 | 先搭整体模块,再按模块先思考、再写入;每个组件完成停审后才能进入下一个组件。 |
| next_allowed_action | 等待用户确认后进入“Step 6 关键对象轮廓反查:先思考”;不得跳到 Step 7、Step 8 或 Step 9。 |

### 0R.1 必读文档清单

| 文档 | 本轮读取目的 | 读取状态 | 输出要求 |
|---|---|---|---|
| `projects/L3-method-library/design-calibration/project_execution_ledger.md` | 确认项目级恢复点已回退到 Step 5 rewrite。 | read | 不得继续 Step 12。 |
| `projects/L3-method-library/design-calibration/02_hld_calibration_flow.md` | 确认文档级 flow、Step 状态和 Step 6~9 反查口径。 | read | 后续动作必须匹配 flow。 |
| `/tmp/l3_method_library_step05_rewrite_plan.md` | 读取 Step 5 重写目标、模块顺序、组件小循环模板和完成门禁。 | read | 只作为执行计划,正式结论写入本文件。 |
| `/tmp/l3_method_library_step05_gap_audit_framework.md` | 读取缺口审计模块、缺口模板和初步 Gap ID。 | read | 作为缺口审计框架输入。 |
| `projects/L3-method-library/00-需求文档.md` | 回指核心能力、功能、业务规则、数据归属、接口依赖和风险。 | pending | 组件候选必须能回指需求来源。 |
| `projects/L3-method-library/01-架构设计.md` | 回指职责边界、子域、运行承载、数据所有权和交互通信。 | pending | 组件候选必须能回指架构来源。 |
| `projects/L3-method-library/design-calibration/02_hld_step_01_upstream_boundary.md` | 确认概要上游来源和禁止恢复旧材料边界。 | pending | 不让旧 02 / 03 反推当前结论。 |
| `projects/L3-method-library/design-calibration/02_hld_step_02_scope.md` | 确认概要层范围和非范围。 | pending | 外围 / 下游 / 外部正文不得越界。 |
| `projects/L3-method-library/design-calibration/02_hld_step_03_constraints.md` | 确认不可变约束和边界红线。 | pending | 组件边界不得冲突。 |
| `projects/L3-method-library/design-calibration/02_hld_step_04_code_subject_framework.md` | 重新推导组件候选池的直接前序输入。 | pending | 不默认沿用当前 8 个组件。 |
| `projects/L3-method-library/design-calibration/02_hld_step_06_key_objects.md` | 下游对象来源反查。 | pending | Step 6 对象必须回指新 Step 5 component / capability。 |
| `projects/L3-method-library/design-calibration/02_hld_step_07_api_interface_skeleton.md` | 下游接口 owner 反查。 | pending | Step 7 接口必须回指新 Step 5 owner。 |
| `projects/L3-method-library/design-calibration/02_hld_step_08_processing_flows.md` | 下游流程来源反查。 | pending | Step 8 流程必须回指新 Step 5/6/7。 |
| `projects/L3-method-library/design-calibration/02_hld_step_09_state_machine.md` | 下游状态 owner 反查。 | pending | Step 9 状态不得继承旧状态主线。 |
| `projects/L3-method-library/02-概要设计.md` | 正式文档旧主语污染审计。 | pending | Step 5 完成后再回填正式 §5。 |
| `projects/L1-governance/design-calibration/02_hld_step_05_components_boundary.md` | 参考成熟 Step 5 粒度、组件小节、对象线索和接缝审计。 | pending | 只参考粒度,不复制领域结论。 |
| `standards/document/概要设计讨论流程_SOP.md` | Step 5 流程和逐组件小循环。 | pending | 每个模块先思考后写入。 |
| `standards/document/概要设计书写规范.md` | 正式 §5 输出格式和概要深度边界。 | pending | 不写字段、协议 schema、DDL、函数实现。 |
| `standards/document/设计文档讨论中间产物规范.md` | 大文件分批、台账、门禁和模块状态要求。 | pending | 单次 patch 不等于文件总长度上限。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 防止组件、对象、接口、状态留下实现 blocker。 | pending | 发现缺口先记录,不得自行补口。 |

### 0R.2 重写模块状态表

| 顺序 | 模块 | 状态 | 本轮输出 | next_allowed_action |
|---:|---|---|---|---|
| 1 | 恢复点与台账切换 | done | 项目台账和 flow 已切回 Step 5 rewrite。 | 进入 Step 5 rewrite 框架。 |
| 2 | Step 5 rewrite 框架搭建 | done | 本 `0R` 开工区、必读清单、模块状态表。 | 进入缺口审计。 |
| 3 | 当前 Step 5 / 正式 02 / Step 6~9 缺口审计:先思考 | done | 见 `0R.3`。 | 进入缺口审计:再写入。 |
| 4 | 当前 Step 5 / 正式 02 / Step 6~9 缺口审计:再写入 | done | 见 `0R.4` 缺口总表、formal contamination 表、Step 6~9 反查表。 | 进入组件候选池重建:先思考。 |
| 5 | 组件候选池重建:先思考 | done | 见 `0R.5` 来源依据、候选拆分逻辑和采用 / 排除判断规则。 | 进入组件候选池重建:再写入。 |
| 6 | 组件候选池重建:再写入 | done | 见 `0R.6` 组件候选池、采用 / 合并 / 排除理由和来源追溯表。 | 进入组成部分总表:先思考。 |
| 7 | 组成部分总表:先思考 | done | 见 `0R.7` 最终组成部分数量、层级、排序和合并策略裁决。 | 进入组成部分总表:再写入。 |
| 8 | 组成部分总表:再写入 | done | 见 `0R.8` `组成部分 | 核心职责 | 主要代码主体 | 不承担什么` 总表。 | 进入逐组件 capability 小循环。 |
| 9 | 逐组件 capability 小循环 | done | 已完成 `0R.9`~`0R.24` 八个组成部分的先思考 / 再写入小循环。 | 进入各部分交互总图:先思考。 |
| 10 | 各部分交互总图 | done | 已完成 `0R.25` / `0R.26` 各部分交互总图先思考 / 再写入。 | 进入对象发现维度总表:先思考。 |
| 11 | 对象发现维度总表 | done | 已完成 `0R.27` / `0R.28` 对象发现维度总表先思考 / 再写入。 | 进入 Step 6~9 承接矩阵:先思考。 |
| 12 | Step 6~9 承接矩阵 | done | 已完成 `0R.29` / `0R.30` Step 6~9 承接矩阵先思考 / 再写入。 | 进入跨组件闭环审计:先思考。 |
| 13 | 跨组件闭环审计 | done | 已完成 `0R.31` / `0R.32` 跨组件闭环审计先思考 / 再写入。 | 进入旧材料差异审计:先思考。 |
| 14 | 旧材料差异审计 | done | 已完成 `0R.33` / `0R.34` 旧材料差异审计先思考 / 再写入。 | 进入正式 §5 回填草稿:先思考。 |
| 15 | 正式 §5 回填草稿 | done | 已完成 `0R.35` / `0R.36` 正式 §5 回填草稿先思考 / 再写入,并完成 `0R.37` 正式 §5 回填记录。 | 进入 flow / 台账更新:先思考。 |
| 16 | flow / 台账更新 | done | 已完成 `0R.38` / `0R.39` flow / 台账更新先思考 / 再写入。 | 等待用户确认后进入“Step 6 关键对象轮廓反查:先思考”;不得跳到 Step 7、Step 8 或 Step 9。 |

### 0R.3 当前 Step 5 / 正式 02 / Step 6~9 缺口审计:先思考

问题回答:

- 当前不是简单补几行组件说明,而是 Step 5 作为后续对象、接口、流程、状态来源层不够稳。
- 当前 Step 5 historical 内容已经有 8 个组成部分和若干对象线索,但 capability 维度不统一,缺少 `输入 / 输出 / 状态或副作用 / 外部协作 / 后续承接` 的逐项闭合。
- 当前正式 `02-概要设计.md` 仍需审计是否残留旧 `MethodContentLifecycle`、`OutboxEvent`、`DefinitionSnapshot`、`fingerprint`、旧发布同步主线。若这些内容仍在正式文档中,Step 5 重写完成前不得把正式文档当成当前 truth source。
- 当前 Step 6 已经开始使用 `MethodAssetDefinition`、`FormalMethodAssetVersion`、`MethodAssetConsumptionMaterial` 等新主语,但这些主语需要重新回指新 Step 5 的 component / capability 来源。
- 当前 Step 7 / Step 8 需要反查接口和流程 owner 是否只来自新 Step 5,不能继续沿用旧接口族或旧 outbox/snapshot 主线。
- 当前 Step 9 风险最大:若仍以旧 `MethodContentLifecycle` 或 `OutboxEventStatus` 为状态主线,则必须在新 Step 5 / Step 6 闭合后重写或至少做状态来源反查。

诊断:

| 审计面 | 初步诊断 | 风险 |
|---|---|---|
| 恢复点 | 台账和 flow 已切回 Step 5 rewrite,当前不再允许继续 Step 12。 | 若后续 agent 忽略台账,会跳过组件粒度修复。 |
| Step 5 historical 内容 | 可作为候选输入,但不能作为 completed 结论继续使用。 | 直接沿用会让 Step 6~9 继续浅粒度承接。 |
| 正式 `02-概要设计.md` | 需要做旧主语污染审计,尤其是 §5~§9。 | 正式文档可能与中间产物冲突。 |
| Step 6 对象 | 当前新主语方向较合理,但来源矩阵不足。 | 对象可能成为悬空主语。 |
| Step 7 接口 | 需要确认每个接口都有 component owner 和对象来源。 | 接口可能自行补 owner。 |
| Step 8 流程 | 需要确认每个流程都有 component / object / interface 来源和状态影响。 | 流程可能反向定义对象或状态。 |
| Step 9 状态 | 需要重点排查旧状态主线和 outbox 状态。 | 状态词表可能与对象 truth owner 冲突。 |

取舍:

- Step 5 historical 内容暂不删除,作为差异审计和候选池输入保留。
- 本轮不直接改正式 `02-概要设计.md`;只有 Step 5 重写完成并通过闭环审计后,才回填正式 §5。
- Step 6~9 暂不改写,只作为反查输入;等 Step 5 新组件与 capability 完成后再决定逐步重写还是 targeted 修正。
- 新 Step 5 必须把每个组件写成 capability 可承接结构,否则不进入 Step 6。

复杂度 / 越界检查:

- 本模块只做缺口审计思考,未生成最终组件正文。
- 未新增对象、接口、状态、字段、协议 schema、数据库、topic 或配置项。
- 未把 L1-governance 样板的领域内容复制到 L3-method-library,只保留粒度参考。
- 下一模块只能写缺口审计表和反查表,不得直接进入组件正文。

### 0R.4 当前 Step 5 / 正式 02 / Step 6~9 缺口审计:再写入

#### 缺口总表

| Gap ID | 位置 | 缺口类型 | 当前表现 | 风险 | 建议处理 | 阻塞级别 |
|---|---|---|---|---|---|---|
| ML-S5-GAP-001 | `02_hld_calibration_flow.md`;`project_execution_ledger.md` | recovery | 文档级 flow 和项目台账曾指向 Step 12。 | 后续 agent 会跳过 Step 5 重写,继续生成错误 handoff。 | 已切回 Step 5 rewrite;后续以 `0R` 开工区为恢复点。 | resolved |
| ML-S5-GAP-002 | `02-概要设计.md` §5~§9 | formal-doc contamination | 正式文档仍使用旧 `MethodContent` / publish / snapshot / outbox / fingerprint 主线。 | 正式文档会把旧对象、旧接口、旧流程和旧状态重新变成 truth source。 | Step 5 完成后先回填正式 §5,再审计 §6~§9 是否需要连带重装配。 | blocking |
| ML-S5-GAP-003 | `02_hld_step_09_state_machine.md` | state drift | Step 9 明确以 `MethodContentLifecycle` 和 `OutboxEventStatus` 为核心状态机。 | 状态 owner 与当前 Step 6 新对象口径冲突,后续详细设计会继承错误状态词表。 | 新 Step 5 / Step 6 闭合后重写 Step 9;不得沿用旧状态机。 | blocking |
| ML-S5-GAP-004 | `02_hld_step_05_components_boundary.md` historical §5 | component granularity | 原 Step 5 有 8 个组成部分,但核心 / 支撑 / operation / 外围分层和能力边界不够深。 | Step 6~9 会只拿到粗组件名,对象、接口、状态来源容易悬空。 | 重新推导组件候选池,不默认沿用原 8 个组件。 | major |
| ML-S5-GAP-005 | `02_hld_step_05_components_boundary.md` historical component sections | capability depth | capability 未统一写入输入、输出、状态 / 副作用、外部协作和后续承接。 | Step 7/8 需要自行补输入输出和状态影响。 | 每个组件小循环固定写 `Capability | 输入 | 输出 | 状态/副作用 | 外部协作 | 后续承接`。 | major |
| ML-S5-GAP-006 | Step 5 -> Step 6~9 | handoff matrix | 缺完整 `component -> capability -> object -> interface -> flow -> state` 矩阵。 | 后续章节无法稳定反查设计来源。 | 新增 Step 6~9 承接矩阵,作为 Step 5 完成门禁。 | major |
| ML-S5-GAP-007 | `02_hld_step_06_key_objects.md` | object source freshness | Step 6 已切到新对象主语,但来源仍来自旧 Step 5 completed 结论。 | 新对象方向正确但来源基线会随 Step 5 重写变化。 | Step 5 完成后反查 Step 6,确认每个对象有新 component / capability 来源。 | major |
| ML-S5-GAP-008 | `02_hld_step_07_api_interface_skeleton.md`;`02_hld_step_08_processing_flows.md` | interface / flow owner freshness | Step 7/8 已排除大量旧主线,但接口和流程 owner 仍需跟随新 Step 5 校准。 | 接口 owner 或处理流来源可能与新组件分层不一致。 | Step 5 完成后做 targeted recheck;若 owner 或来源不匹配再修 Step 7/8。 | major |
| ML-S5-GAP-009 | `02_hld_step_10_exceptions_boundaries.md`;`02_hld_step_11_configuration_impact.md` | downstream stale dependency | Step 10/11 已完成,但它们依赖旧 Step 5~9 链路。 | 异常或配置影响可能引用被新 Step 5 排除的旧机制。 | Step 5~9 反查完成后再确认 Step 10/11 是否需要 targeted 修正。 | major |

#### 正式文档旧主语污染审计表

| 正式文档位置 | 旧主语 / 旧机制 | 与当前中间产物冲突 | 处理方式 |
|---|---|---|---|
| `02-概要设计.md:1235`~`1238` | `PublishMethodContent`,`DeprecateMethodContent`,`RetireMethodContent`,`SupersedeMethodContent`,`OutboxEvent`,`Fingerprint` | 当前 Step 6/7/8 已改用 `MethodAssetDefinition`,`FormalMethodAssetVersion`,正式化与版本语义变化主线。 | 正式 §7 / §8 后续重装配,旧接口族不得继续作为接口 truth。 |
| `02-概要设计.md:1246`~`1252` | `GetMethodContent`,`ExportDefinitionSnapshot`,`CompareFingerprint`,`DefinitionSnapshot` | 当前受控消费和外部 archive 口径使用 material/ref/marker,不恢复 snapshot/fingerprint 作为主线。 | 正式读取接口和 snapshot 相关章节需跟随 Step 7/8 重写。 |
| `02-概要设计.md:1267`~`1278` | `method_library.content.*` topic、旧 publish event、fingerprint changed event | 当前 Step 8 只保留概要 outbound event candidate,不恢复 outbox/publish topic 机制。 | 正式事件章节后续重装配,不得提前写 topic/payload。 |
| `02-概要设计.md:1289` | `RecalculateFingerprint` | 当前版本语义变化不能由旧 fingerprint/hash 作为唯一依据。 | 删除或改为后续重新讨论的维护 / consistency 检查候选。 |
| `02-概要设计.md:1388`~`1676` | 旧 `PublishMethodContent` 处理流、`Create/Update/Submit/Deprecate/Retire/Supersede` 和 `ExportDefinitionSnapshot` | 当前 Step 8 已用 `EstablishMethodAssetDefinition`,`EvaluateMethodAssetFormalization`,`EstablishFormalMethodAssetVersion` 等新流替换。 | 正式 §8 必须在 Step 8 反查后重装配。 |
| `02-概要设计.md:1824`~`1951` | `MethodContent` 状态、`OutboxEvent` 状态和传播关系 | 当前 Step 6 明确旧 `MethodContentLifecycle` / `OutboxEventStatus` 不作为当前 Step 9 输入。 | 正式 §9 必须等待 Step 9 重写后回填。 |
| `02-概要设计.md:2084`~`2127` | 旧对象 / 详细设计承接项: `MethodContent`,`Fingerprint`,`DefinitionSnapshot`,`OutboxEvent` | 会把旧对象和旧状态传给 03 详细设计。 | Step 12 不得继续;待 Step 5~11 修正后重写 handoff。 |

#### Step 6~9 下游反查表

| 下游 Step | 当前状态 | 关键观察 | 是否可沿用 | 修正方向 |
|---|---|---|---|---|
| Step 6 关键对象 | 新主语方向基本成立,但需反查 | 已用 `MethodAssetDefinition`,`FormalMethodAssetVersion`,`MethodAssetConsumptionMaterial`,`MethodAssetTraceMaterial` 等替代旧 `MethodContent`;文件末尾也明确旧状态矩阵不得回流。 | partial | 新 Step 5 完成后逐对象反查 component / capability 来源;对象来源不匹配则 targeted 修正 Step 6。 |
| Step 7 接口骨架 | 多数新接口方向成立,但需反查 owner | 文件头部和差异审计已禁止旧 `CreateMethodContentDraft` / `PublishMethodContent` / snapshot / outbox / fingerprint。 | partial | 新 Step 5 完成后检查每个接口是否有组件 owner、对象来源和边界说明。 |
| Step 8 处理流 | 多数新流程方向成立,但需反查来源矩阵 | 文件已用新 flows 替换旧 publish / snapshot / outbox 主链,并保留旧材料差异审计。 | partial | 新 Step 5 完成后检查每个流程是否有 component / object / interface 来源和状态影响说明。 |
| Step 9 状态机 | 与当前新主线冲突 | 文件明确 `MethodContentLifecycle` 是 P0 主状态机,并保留 `OutboxEventStatus`。 | no | 必须在新 Step 5 和 Step 6 闭合后重写;状态 owner 从当前对象集合重新推导。 |
| 正式 `02-概要设计.md` §5~§9 | 与中间产物冲突 | 正式文档仍大量使用旧对象、旧接口、旧流程、旧状态和旧机制。 | no | Step 5 完成后先回填正式 §5;Step 6~9 完成反查 / 重写后再重装配正式 §6~§9。 |

#### 组件粒度审计表

| historical 组成部分 | 当前职责范围 | 是否过粗 | 是否需重推 | 拆分 / 重组候选 | 决策 |
|---|---|---|---|---|---|
| 方法资产定义与目录 | 定义 truth、身份、目录和适用语境 | yes | yes | 定义 truth / 目录语义 / 读取目录材料需分清 owned truth 与 view。 | 进入候选池重建,不默认保留原边界。 |
| 正式化与版本 | 正式化判断、正式版本、版本语义变化 | yes | yes | 正式化资格、正式版本、版本语义变化、正式化依据摘要需分别给 capability。 | 进入候选池重建。 |
| 受控消费 | 消费材料、可用性、Definition vs Use 边界 | partial | yes | 消费材料、availability view、downstream boundary 需区分 truth / material / view。 | 进入候选池重建。 |
| 追溯与一致性保护 | trace、impact、audit、consistency | yes | yes | trace material、impact summary、audit trail、consistency protection 可能需拆成 capability 而非一个笼统组件。 | 进入候选池重建。 |
| 关系与分发语义 | 方法资产关系和分发语义 | partial | yes | 关系 truth、distribution ref、relation integrity、marketplace boundary 必须拆清。 | 进入候选池重建。 |
| 外部摘要与引用 | 外部依据摘要、source ref、artifact/archive ref | partial | yes | external summary、source ref、artifact/archive ref、body-free guard 需分别给承接。 | 进入候选池重建。 |
| 后台维护与收敛 | read/trace material refresh 和 consistency recovery | yes | yes | maintenance 只能是派生材料维护 / recovery,不得成为业务 truth owner。 | 进入候选池重建并标注 operation 支撑。 |
| 外围包与方法集组织 | package、method set、外围发现 | partial | yes | package / set / discovery / marketplace context 必须保持外围增强。 | 进入候选池重建并标注非核心前置。 |

#### 审计结论

| 审计项 | 结论 | 后续动作 |
|---|---|---|
| 是否允许继续 Step 12 | no | Step 12 blocked by Step 5 rewrite。 |
| 是否直接重写正式 `02-概要设计.md` | no | 等 Step 5 新结论完成后只先回填 §5。 |
| 是否保留原 Step 5 内容 | yes_as_historical | 仅作为候选和差异审计输入,不得作为 completed truth。 |
| 是否需要重写 Step 9 | yes | 新 Step 5 / Step 6 完成后重写状态来源和状态迁移。 |
| 是否需要立刻改 Step 6~8 | no | 先完成新 Step 5;随后按反查表 targeted recheck。 |

停审记录:

- 功能是否清楚: pass。缺口已收敛为 recovery、formal contamination、state drift、component granularity、capability depth 和 handoff matrix 六类主问题。
- 候选对象是否有功能来源: partial。Step 6 新对象方向基本成立,但必须等新 Step 5 完成后逐项回指。
- 接缝是否清楚: partial。Step 7/8 接口和流程大体新主线成立,但 owner/source 仍需新 Step 5 反查。
- 禁止事项是否清楚: pass。旧 `MethodContent`、snapshot、outbox、fingerprint、topic、schema 和正式文档旧 §5~§9 不得作为当前 truth source。
- 是否越界: pass。未写字段、函数、协议 schema、状态迁移、数据库、topic 或配置项。

### 0R.5 组件候选池重建:先思考

问题回答:

- 组件候选池必须从当前 `00-需求文档.md` 的核心能力闭环、`01-架构设计.md` 的职责 / 子域 / 数据归属和 Step 4 的代码主体候选共同推导,不能直接沿用 historical 8 个组件。
- 当前需求层核心闭环是“统一定义和识别 -> 稳定版本正式使用 -> 下游受控消费 -> 变化追溯与消费一致性保护”。这个闭环给出核心组件的最小骨架,但不能把每个闭环节点粗暴写成一个大组件。
- 当前架构层已经把核心子域、支撑子域、本地索引 / 投影 / 引用和运行承载分开。Step 5 的组件必须是业务结构主语,不能把同步入口、异步协作、后台承载、Persistence、Projection 或 Adapter 写成组件。
- Step 4 给出的 8 个主体可以作为候选输入,但其中多个主体需要按 capability 接缝重新拆分,否则 Step 6~9 仍会缺对象、接口、流程和状态来源。

来源依据:

| 来源 | 关键结论 | 对候选池的影响 |
|---|---|---|
| `00-需求文档.md` §2 | 本仓是方法资产定义、版本发布与分发语义的真相仓。 | 必须有 definition truth、formal version、distribution semantics 候选。 |
| `00-需求文档.md` §7 | 核心闭环为统一定义和识别、稳定版本正式使用、下游受控消费、变化追溯与消费一致性保护。 | 核心候选至少覆盖四段闭环,且要拆出可承接对象 / 接口 / 状态的能力。 |
| `00-需求文档.md` §9 / §16 | FR-ML-001~009 覆盖定义表达、身份目录、正式化、版本边界、消费支撑、分发、追溯、一致性保护、证据线索。 | 候选池应显式覆盖这 9 类能力,不能只保留 4 个粗组件。 |
| `00-需求文档.md` §13~§15 | 外围增强不阻塞核心闭环;governance、artifact、marketplace、console、SDK 等为条件型 / 候选 / 外围关系。 | 外围包、方法集、生态发现、标准映射可作为外围候选,但不得成为核心前置。 |
| `01-架构设计.md` §4 | 职责包括定义 truth、身份目录、正式化版本、定义性关系、分发语义、追溯依据、受控消费、外部依据摘要或引用。 | 组件候选应至少覆盖这些职责项,并标注非职责边界。 |
| `01-架构设计.md` §6 | 子域包括定义与目录、正式化与版本、受控消费、追溯一致性、关系分发、包 / 方法集、外部摘要 / 引用、下游影响摘要。 | 可以作为候选池来源,但其中“下游影响摘要”更像一致性保护 capability,不是必然独立组件。 |
| `01-架构设计.md` §9~§11 | 核心 truth 与只读消费 / 追溯材料分层,跨边界变化异步最终一致,后台延后承接维护和恢复。 | 派生材料维护 / 恢复应作为支撑候选,但不能成为业务 truth owner。 |
| `02_hld_step_04_code_subject_framework.md` | 给出 8 个代码主体候选和实现分层边界。 | 作为候选输入,但需拆出更细 capability seam。 |

诊断:

- historical `方法资产定义与目录` 同时覆盖 definition truth、asset identity、catalog scope 和适用语境。这个粒度过粗,会让 Step 6 把 `MethodAssetDefinition`、`MethodAssetCatalogEntry`、`MethodAssetDefinitionRef`、`CatalogScopeRef` 和 catalog view 混在一起。
- historical `正式化与版本` 同时覆盖 eligibility、basis summary、formal version、version semantic change、retirement / replacement。它们状态 owner 和接口触发不同,后续至少要作为独立 capability 候选。
- historical `受控消费` 同时覆盖 consumption material、availability view、downstream boundary 和 Definition vs Use guard。这里需要拆清 material、view、boundary、guard 的角色,否则读取材料容易变成第二 truth。
- historical `追溯与一致性保护` 覆盖 trace material、audit trail、evidence marker、impact summary、consistency protection。它是最容易过粗的组件之一,需要判断是拆成两个组件,还是保留一个组件但强制按 capability 分解。
- historical `关系与分发语义` 需要拆清 relation truth、distribution ref 和 marketplace / ecosystem boundary。分发语义不能滑向 marketplace 交易、安装或履约。
- historical `外部摘要与引用` 是防止正文入仓的关键边界,但内部至少包含 governance / standard / ADR / artifact / archive / marketplace 等不同 external source 类型。Step 5 可以作为一个组件保留,但 capability 必须写出 source summary、source ref、artifact/archive ref、body-free guard。
- historical `后台维护与收敛` 应从“组件候选”降级审视:它是支撑派生材料、追溯材料和恢复的 operation 语义,不是核心业务 truth。若保留为组件,必须标注 support / operation。
- historical `外围包与方法集组织` 仍有独立价值,但只作为外围增强候选。它不得成为正式消费、核心下游或 Step 6 核心对象的前置。

候选拆分逻辑:

| 拆分维度 | 判断规则 | 候选方向 |
|---|---|---|
| truth owner 是否不同 | 如果一个 historical 组件内存在多个 owned truth 或 truth / view 混合,需要拆出候选。 | definition truth、catalog truth、relation truth、formal version truth。 |
| 状态 owner 是否不同 | 如果状态词表或迁移触发不同,需要至少拆成独立 capability。 | formalization state、formal version lifecycle、consumption material freshness、maintenance progress。 |
| 输入来源是否不同 | 如果输入分别来自本仓 command、外部依据、下游摘要、后台任务或外围关系,需要拆清 seam。 | external basis acceptance、downstream impact summary、maintenance refresh。 |
| 输出消费方是否不同 | 如果输出分别服务核心下游、审计、外围生态或内部读取,需要拆清 material / ref / view。 | consumption material、trace material、distribution ref、catalog view。 |
| forbidden boundary 是否不同 | 如果禁止事项不同,不能写成同一个模糊组件。 | marketplace boundary、artifact body boundary、governance execution boundary、Definition vs Use boundary。 |
| 是否只是实现承载 | 如果只是入口、异步协作、投影、持久化、任务调度或 adapter,不作为组件。 | 写入接缝或后续实现分层,不进组件候选。 |

初步候选方向:

| 候选方向 | 来源 | 初步判断 |
|---|---|---|
| 方法资产身份与定义主体 | 00 核心能力;01 职责 / 子域;Step 4 definition subject | 倾向核心候选。 |
| 方法内容 / 方法主题语义边界 | 00 上游主题 SPEM、生命周期模型、AI Policy、ViewProfile;01 易混淆职责 | 倾向作为定义主体内部 capability 候选,需判断是否独立组件。 |
| 目录与适用语境 | 00 FR-ML-002;01 身份目录语义;Step 4 catalog subject | 倾向核心或紧邻核心候选,需与 definition truth 拆清。 |
| 正式化资格与依据承接 | 00 FR-ML-003;01 governance 条件型结论;Step 4 formalization | 倾向核心候选或正式化组件内关键 capability。 |
| 正式版本边界与版本语义变化 | 00 FR-ML-004;NFR-ML-014;01 稳定版本 ADR | 倾向核心候选,不能被 formalization eligibility 吞掉。 |
| 受控消费材料 | 00 FR-ML-005;01 只读消费材料分层 | 倾向核心候选。 |
| 下游消费边界与 Definition vs Use guard | 00 BR-ML-003/005/008/012~018;01 职责红线 | 倾向核心候选或消费组件内关键 capability。 |
| 关系与组合语义 | 00 数据归属 / FR-ML-006;01 支撑子域 | 倾向支撑候选。 |
| 分发语义与生态引用边界 | 00 分发语义 / marketplace 边界;01 支撑子域 / 外围关系 | 倾向支撑候选,必须排除交易履约。 |
| 外部依据摘要与引用 | 00 治理 / 标准 / artifact / archive 边界;01 摘要 / 引用 ADR | 倾向支撑候选。 |
| 追溯、审计与证据线索 | 00 FR-ML-007/009;NFR-ML-009~011;01 横切审计 | 倾向核心支撑候选。 |
| 消费影响摘要与一致性保护 | 00 FR-ML-008;01 下游影响摘要 | 倾向从 trace 组件拆出 capability 或独立支撑候选,需再写入裁决。 |
| 派生材料维护与恢复收敛 | 01 后台延后承接;Step 4 maintenance | 倾向 support / operation 候选,不得成为 truth owner。 |
| 外围包与方法集组织 | 00 FR-ML-E-001/002;01 外围增强 | 倾向外围候选,不阻塞核心闭环。 |
| 高级策略变体 / 标准映射材料 | 00 FR-ML-E-003/004;01 演进路线 | 倾向外围候选或外部摘要 capability,不进核心组件。 |

取舍:

- 不再用 historical 8 个组件作为最终默认答案;下一模块要输出“候选池、采用 / 排除理由和来源表”。
- 候选池允许比最终组件多。先列出 capability seam,再在“组成部分总表:先思考”中收敛成最终组件数量和排序。
- 可能的最终结构不必等于候选数量。某些候选可以合并为一个组件内 capability,但合并必须保留输入、输出、状态 / 副作用、外部协作和后续承接列。
- 对 `方法内容 / 方法主题语义边界`、`消费影响摘要与一致性保护`、`派生材料维护与恢复收敛`、`外围包与方法集组织` 要特别审慎:它们最容易被写得过大或越界。
- Step 5 不裁决 `Qualification / CapabilityDefinition` 是否进入核心资产范围;该问题仍按 00/01 风险记录处理,不得在候选池中局部纳入。

复杂度 / 越界检查:

- 未写最终组件表,只给出候选拆分逻辑和初步候选方向。
- 未写字段、函数、状态枚举、协议 schema、数据库、topic、job 或配置项。
- 未把入口、adapter、repository、projection、persistence 或 task scheduler 当作业务组件。
- 未把 governance 执行、artifact 正文、marketplace 交易、UI 渲染或下游运行状态迁入本仓。
- 下一模块只能写组件候选池和采用 / 排除理由表,不得直接进入最终组成部分总表。

### 0R.6 组件候选池重建:再写入

#### 候选池采用 / 合并 / 排除总表

| 候选方向 | 候选级别 | 当前处理 | 采用 / 合并 / 排除理由 | 后续承接 |
|---|---|---|---|---|
| 方法资产身份与定义主体 | core | adopt | 这是本仓 truth source 的入口,承载方法资产稳定识别、定义主体和目录锚点。缺失该候选会让正式化、消费和追溯没有共同 subject。 | 进入组成部分总表;后续逐组件小循环必须拆清 definition truth、identity 和 catalog view。 |
| 方法内容 / 方法主题语义边界 | core-capability | merge_into_definition | 该候选用于说明本仓只承载“方法定义语义”,不承载下游运行内容、流程实例或 UI 表达。它更适合作为定义主体内的 capability 和边界 guard,不是独立组件。 | 合并到“方法资产定义与目录”的 capability;Step 6 再判断是否需要独立 policy / boundary 对象。 |
| 目录与适用语境 | core-adjacent | adopt_or_merge_later | 目录和适用语境是资产发现与正式消费前置,但不能把 catalog view 写成第二 truth。当前先保留为候选,在总表思考中裁决是独立组件还是定义组件内 capability。 | 进入组成部分总表思考;若合并,必须保留 catalog scope、applicability 和 read material 来源。 |
| 正式化资格与依据承接 | core | adopt | 正式化资格决定资产能否进入正式消费语境,并承接治理或其他外部依据摘要。它有独立输入来源和判定规则,不能被版本对象吞掉。 | 进入组成部分总表;后续 capability 必须写清 basis、eligibility 和外部依据边界。 |
| 正式版本边界与版本语义变化 | core | adopt | 正式版本和版本语义变化保护下游稳定消费,与资格判断的触发和状态含义不同。若合并过粗,Step 9 状态 owner 会再次漂移。 | 进入组成部分总表;后续可与正式化同组件,但必须保留独立 capability 和状态来源。 |
| 受控消费材料 | core | adopt | 下游只能消费受控材料,不能读取未正式化定义或反写 definition truth。该候选直接支撑 Definition vs Use 边界。 | 进入组成部分总表;Step 6 必须区分 consumption material、availability view 和 downstream boundary。 |
| 下游消费边界与 Definition vs Use guard | core-capability | merge_into_consumption | 这是消费组件的核心 guard,但不应单独变成一个大组件,否则会从材料提供滑向下游运行治理。 | 合并到“受控消费”的 capability;后续必须写入不拥有下游运行 truth。 |
| 关系与组合语义 | support | adopt | 方法资产之间的定义性关系、组合关系和引用关系会影响消费与分发,不应被目录或版本隐式承担。 | 进入组成部分总表,定位为支撑组件;后续排除 process / work / capability 执行关系。 |
| 分发语义与生态引用边界 | support | adopt_or_merge_later | 分发语义需要给生态引用和 marketplace 边界提供本仓语义来源,但不得承担交易、安装或履约。 | 进入组成部分总表思考;可与关系语义合并,但必须保留 marketplace boundary。 |
| 外部依据摘要与引用 | support | adopt | 当前 00 / 01 明确要求治理、标准、ADR、artifact、archive 等外部来源只能以摘要或引用承接。该边界若缺失,后续会把外部正文误写入本仓 truth。 | 进入组成部分总表;后续 capability 必须区分 summary、ref、artifact/archive ref 和 body-free guard。 |
| 追溯、审计与证据线索 | core-support | adopt | 追溯和证据线索是版本、消费和一致性保护的共同支撑,也为后续验收和审计提供来源。 | 进入组成部分总表;Step 6 必须拆清 trace material、audit trail、evidence lineage。 |
| 消费影响摘要与一致性保护 | support-protection | adopt_or_merge_later | 该候选直接回应“正式消费不被静默破坏”的需求,但可能作为追溯组件内 capability 而非独立组件。 | 进入组成部分总表思考;若合并进追溯组件,仍必须保留 impact summary 和 consistency policy。 |
| 派生材料维护与恢复收敛 | support-operation | adopt_conditionally | 读取材料、追溯材料和一致性收敛需要正式 owner,否则后台维护会在 Step 8/9 私造来源。但它不是业务 truth owner。 | 进入组成部分总表思考,标注 operation/support;不得产生新的业务定义 truth。 |
| 外围包与方法集组织 | peripheral | adopt_conditionally | MethodPackage / MethodSet 属于外围增强,可改善组织和发现,但 00 / 01 都不允许它阻塞核心闭环。 | 进入外围组成部分说明;后续不作为核心对象、状态或接口前置。 |
| 高级策略变体 / 标准映射材料 | peripheral-or-external | defer_or_merge | 这些能力属于演进路线或外部标准映射,当前不应扩大核心范围。若需要承接,应落在外部摘要、关系语义或外围组织的 capability。 | 不作为当前核心组件;记录为后续风险 / 演进候选。 |

#### 候选来源追溯表

| 候选方向 | 需求来源 | 架构来源 | Step 4 来源 | 当前追溯结论 |
|---|---|---|---|---|
| 方法资产身份与定义主体 | `00-需求文档.md` 核心定位、FR-ML-001/002、数据归属 | `01-架构设计.md` 职责边界、定义与目录子域 | definition / catalog subject | 具备完整来源,必须承接到 Step 5 总表。 |
| 方法内容 / 方法主题语义边界 | 上游方法主题、业务规则、非范围 | 职责边界、易混淆边界 | definition subject | 作为定义组件 boundary capability 承接。 |
| 目录与适用语境 | FR-ML-002、核心能力闭环 | 身份目录、适用语境、read model 边界 | catalog subject | 需要总表思考中裁决独立或合并。 |
| 正式化资格与依据承接 | FR-ML-003、治理条件型关系 | 正式化与版本子域、外部依据摘要 ADR | formalization subject | 必须承接到正式化 / 版本组件。 |
| 正式版本边界与版本语义变化 | FR-ML-004、NFR 稳定消费 | 正式版本 ADR、版本稳定语义 | version subject | 必须承接到正式化 / 版本组件,并保留状态来源。 |
| 受控消费材料 | FR-ML-005、Definition vs Use 业务规则 | 只读消费材料分层、下游边界 | consumption subject | 必须承接到受控消费组件。 |
| 下游消费边界与 Definition vs Use guard | BR-ML 下游边界、接口依赖 | 下游只读协作、依赖方向 | consumption / boundary subject | 作为受控消费 capability 承接。 |
| 关系与组合语义 | FR-ML-006、数据归属 | 关系与分发支撑子域 | relation subject | 进入支撑组件候选。 |
| 分发语义与生态引用边界 | 分发语义、marketplace 非范围 | 外围关系、生态引用边界 | distribution subject | 可与关系语义合并,但必须写出外部交易排除项。 |
| 外部依据摘要与引用 | 外部治理、标准、artifact/archive 边界 | 外部摘要 / 引用 ADR | external basis subject | 进入支撑组件候选。 |
| 追溯、审计与证据线索 | FR-ML-007/009、审计与证据线索 | 横切审计、trace / evidence 边界 | trace subject | 进入核心支撑候选。 |
| 消费影响摘要与一致性保护 | FR-ML-008、一致性保护 | 下游影响摘要、最终一致协作 | consistency / impact subject | 进入总表思考,不能丢失 impact 来源。 |
| 派生材料维护与恢复收敛 | NFR 可恢复、后台维护需求 | 后台延后承接、恢复收敛 | maintenance subject | 仅作为 support-operation 承接。 |
| 外围包与方法集组织 | FR-ML-E-001/002 | 外围增强、生态发现 | package / method set subject | 进入外围说明,不阻塞核心闭环。 |
| 高级策略变体 / 标准映射材料 | FR-ML-E-003/004、风险与演进 | 演进路线、标准映射候选 | strategy / mapping subject | defer;不得扩大当前核心范围。 |

#### 不进入组件候选池的名称 / 机制表

| 名称 / 机制 | 当前处理 | 排除理由 | 后续允许出现位置 |
|---|---|---|---|
| Inbound / Operations / Application Services / Domain Model / Ports / Persistence / Projection / Material / Collaboration / External Adapters | exclude_as_component | 它们是实现分层或承载位置,不是业务组成部分。 | Step 4 分层视图、Step 7 接口骨架、03 详细设计。 |
| repository / port / adapter / DTO / handler / worker / job / event / topic / DB | exclude_as_component | 这些是接口、运行、存储或消息细节,概要 Step 5 不以它们划分业务职责。 | Step 7~9 或后续 03/04/07。 |
| `MethodContent`、`PublishMethodContent`、`DefinitionSnapshot`、`OutboxEvent`、`fingerprint` | historical_only | 这些属于旧 formal doc / 旧 Step 的污染主线,当前 full-restart 不以它们作为 truth source。 | 旧材料差异审计。 |
| 旧 A-H 模块、旧七类 P0 对象 | historical_only | 旧分类混合了对象、接口、运行机制和外部协作,不能直接恢复为 Step 5 组件。 | 后置污染检查或 Step 6 对象排除项。 |
| governance execution / approval workflow | outside_boundary | 本仓只承接正式化依据摘要或引用,不执行治理流程。 | 外部依据摘要与引用、正式化边界。 |
| artifact body / archive body / standard full text / ADR body | outside_boundary | 本仓只保存摘要 / 引用 / ref,不保存外部正文。 | 外部摘要与引用的禁止事项。 |
| marketplace transaction / installation / fulfillment | outside_boundary | marketplace 交易和履约不是方法库 truth。 | 关系与分发语义、外围包边界。 |
| UI rendering / console session / SDK runtime state | outside_boundary | 展示和 SDK 运行状态属于消费方或交互层,不属于本仓业务 truth。 | 下游消费边界、接口依赖。 |
| downstream runtime state / process instance state / identity member state / work assignment state | outside_boundary | 下游状态不能反写方法定义、正式版本或消费材料。 | 受控消费边界和 Definition vs Use guard。 |

#### 候选池写入结论

| 结论项 | 裁决 |
|---|---|
| 是否直接沿用 historical 8 个组成部分 | no。historical 8 个组成部分只作为输入,本轮候选池按来源和 capability seam 重新生成。 |
| 是否现在裁决最终组件数量 | no。候选池允许大于最终组件数;最终数量和排序在“组成部分总表:先思考”裁决。 |
| 是否允许 Step 5 候选反推新对象 / 接口 / 状态 | no。本模块只生成候选池;对象、接口、流程、状态必须在后续 Step 6~9 独立闭合。 |
| 是否保留支撑 / operation / 外围候选 | yes。保留是为了防止后续章节缺 owner,但必须在总表中标注边界层级。 |
| 是否出现 design blocker | no。当前候选池能回指 00/01/Step 4;未发现需要暂停的缺正式输入问题。 |

停审记录:

- 功能是否清楚: pass。候选池覆盖定义身份、目录语境、正式化、版本、消费、关系、分发、外部引用、追溯、影响一致性、维护和外围组织。
- 候选对象是否有功能来源: pass。每个候选方向均有 00 / 01 / Step 4 来源,或明确作为 deferred / outside boundary。
- 接缝是否清楚: pass。已区分 adopt、merge、conditional adopt、defer 和 exclude,避免把 capability seam 误写成最终组件。
- 禁止事项是否清楚: pass。实现分层、旧机制、外部正文、治理执行、marketplace 交易和下游运行状态均已排除。
- 是否越界: pass。未写字段、函数、状态枚举、协议 schema、数据库、topic、job、config 或实现算法。
- next_allowed_action: 进入“组成部分总表:先思考”,只裁决最终组件数量、层级、排序和合并策略;不得直接写总表。

---

### 0R.7 组成部分总表:先思考

问题回答:

- 最终组成部分总表应收敛为 8 个可回指单元,不是 12 个候选全量展开,也不是只保留 4 个核心闭环节点。
- 8 个单元分为 `4 个核心 + 3 个支撑 / operation + 1 个外围`:
  - 核心:方法资产定义与目录、正式化与版本、受控消费、追溯与一致性保护。
  - 支撑 / operation:关系与分发语义、外部摘要与引用、后台维护与收敛。
  - 外围:外围包与方法集组织。
- 总表排序应沿业务成立链路排列,不是按实现分层或旧对象类型排列:先定义身份,再正式化版本,再受控消费,再追溯一致性;随后放关系分发、外部摘要、后台维护;最后放外围组织。
- 总表只回答每个组成部分的核心职责、主要代码主体和不承担事项。它不得写字段、函数、协议 schema、状态枚举、数据库、topic、job 或具体配置项。

候选合并判断:

| 候选池来源 | 总表收敛结论 | 判断理由 |
|---|---|---|
| 方法资产身份与定义主体;目录与适用语境 | 合并为 `方法资产定义与目录` | 身份、定义主体、目录和适用语境共同构成正式化、消费和追溯的 subject 锚点;拆成两个主组件会让目录 view 误像第二 truth。 |
| 正式化资格与依据承接;正式版本边界与版本语义变化 | 合并为 `正式化与版本` | 正式化资格和版本稳定性都围绕“进入正式使用语境”成立,可在同一组件内保留独立 capability;拆开会让状态 owner 过早膨胀。 |
| 受控消费材料 | 保留为 `受控消费` | Definition vs Use 边界是核心闭环独立节点,必须有自己的材料、可用性和下游边界 owner。 |
| 追溯、审计与证据线索;消费影响摘要与一致性保护 | 合并为 `追溯与一致性保护` | 追溯、证据、影响摘要和一致性保护共同回答“变化后如何解释并保护既有消费”;拆开会导致 impact summary 与 trace/audit 来源断裂。 |
| 关系与组合语义;分发语义与生态引用边界 | 合并为 `关系与分发语义` | 关系和分发都属于定义性语义支撑,需要同一边界防止 marketplace 交易、安装和履约渗入。 |
| 外部依据摘要与引用 | 保留为 `外部摘要与引用` | 这是 body-free guard 的关键支撑组件,不能被埋入正式化或追溯,否则外部正文 / 治理执行 / artifact 正文边界会分散。 |
| 派生材料维护、对账与恢复收敛 | 收敛为 `后台维护与收敛` | 它需要成为后续流程、状态和 evidence 的 owner,但只作为支撑 / operation 组件,不得拥有业务定义 truth。 |
| 外围包与方法集组织 | 保留为 `外围包与方法集组织` | 外围能力不阻塞核心闭环,但 MethodPackage / MethodSet 若完全不入总表,Step 6~9 会缺外围对象和边界来源。 |

诊断:

| 方案 | 结论 | 原因 |
|---|---|---|
| 只保留 4 个核心组成部分 | 不采用 | 关系分发、外部摘要、维护收敛和外围组织会在 Step 6~9 缺 owner,随后被接口、流程或状态章节自行补口。 |
| 12 个候选全部进入总表 | 不采用 | 概要层会过细,把 capability seam 误提升为主要组成部分,导致后续对象和状态过早碎片化。 |
| 8 个组成部分同级展示但不区分层级 | 不采用 | 会让支撑 / operation / 外围能力看起来都是核心闭环前置,违反 00 / 01 对外围增强和运行承载的隔离要求。 |
| 8 个组成部分进入同一总表,在职责和非职责中标明层级 | 采用 | 满足书写规范总表格式,同时保留统一 Step 6 回指入口和核心 / 支撑 / 外围边界。 |

取舍:

- `外部摘要与引用` 保持独立,优先保护外部正文禁止、治理执行不入仓、artifact / archive 正文不入仓和标准 / ADR 只引用的边界。
- `后台维护与收敛` 保持独立,但表述为 operation 支撑,避免后续维护 flow 缺归属或在 query/read path 中私造 repair 语义。
- `外围包与方法集组织` 进入总表末尾,但必须写明它不是核心闭环成立前置;其后续对象和接口只能作为外围增强候选。
- 总表的“主要代码主体”只使用 Step 4 已出现的 service / object candidate 名称,不新增未讨论的 handler、repository、port、adapter、DTO、event 或 job 名。

复杂度 / 越界检查:

- 本模块只裁决总表结构、层级、排序和候选合并策略,未写正式总表正文。
- 未引入旧 A-H、旧 P0 类型、`fingerprint`、`snapshot`、`outbox`、topic、数据库或实现目录作为划分依据。
- 未把 `L1-governance`、`L1-artifact`、`L6-marketplace`、console / SDK、repository、port、adapter 或 worker 写成本仓业务组成部分。
- 下一模块只允许写 `组成部分 | 核心职责 | 主要代码主体 | 不承担什么` 总表;不得跳到对象发现维度表、交互总图或逐组件小循环。

停审记录:

- 功能是否清楚: pass。最终 8 个组成部分覆盖核心闭环、支撑边界、维护收敛和外围增强。
- 候选对象是否有功能来源: pass。总表行均来自当前 00 / 01、Step 4 和 `0R.6` 候选池。
- 接缝是否清楚: partial。已裁决层级与合并策略;具体 inbound / outbound / forbidden boundary 留给总表和逐组件小循环。
- 禁止事项是否清楚: pass。下游运行 truth、外部正文、治理执行、marketplace 交易、旧 snapshot/fingerprint/outbox 和实现分层均被排除。
- 是否越界: pass。未写字段、函数、协议 schema、状态迁移、持久化结构、event payload、job 调度或配置项。
- next_allowed_action: 进入“组成部分总表:再写入”,只写总表正文,不得提前进入对象发现维度总表。

---

### 0R.8 组成部分总表:再写入

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| 方法资产定义与目录 | 作为核心组成部分,承载方法资产定义 truth、稳定身份、目录语义和适用语境,为正式化、版本、消费、关系和追溯提供共同 subject 锚点。 | `MethodAssetDefinitionService`;`MethodAssetCatalogService`;`MethodAssetDefinition`;`MethodAssetCatalogEntry`;`MethodAssetDefinitionRef`;`MethodAssetCatalogView` | 不保存流程实例、成员状态、治理执行、artifact 正文、UI 会话、marketplace 交易事实;不把目录读取材料写成第二定义 truth。 |
| 正式化与版本 | 作为核心组成部分,承载方法资产进入正式使用语境的资格判断、正式版本边界、版本语义变化和正式化依据承接。 | `MethodAssetFormalizationService`;`MethodAssetVersionService`;`FormalMethodAssetVersion`;`FormalizationBasisSummary`;`FormalizationState`;`FormalMethodAssetVersionView` | 不执行治理审批或 policy enforce;不允许读取、引用、同步或运行时使用隐式触发正式化;不把版本语义简化成 hash / fingerprint / storage snapshot。 |
| 受控消费 | 作为核心组成部分,为下游按边界消费正式方法资产提供消费材料、可用性判断和 Definition vs Use 防护。 | `MethodAssetConsumptionService`;`MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`DownstreamConsumptionBoundary`;`ConsumptionContextRef` | 不拥有下游运行 truth;不替下游执行流程、分配任务、绑定成员能力、渲染 UI 或保存消费仓私有模型正文。 |
| 追溯与一致性保护 | 作为核心组成部分,汇聚正式化依据、版本语义变化、引用语境、证据线索和消费影响摘要,保护既有正式消费不被静默破坏。 | `MethodAssetTraceService`;`MethodAssetConsistencyService`;`MethodAssetTraceMaterial`;`ConsumptionImpactSummary`;`MethodAssetAuditTrail`;`MethodAssetEvidenceLineage` | 不把日志、telemetry、audit raw dump 或 report 输出变成第二定义 truth;不保存下游内部状态正文或外部证据文件正文。 |
| 关系与分发语义 | 作为支撑组成部分,承载方法资产之间的定义性关系、组合语义和面向受控消费 / 生态发现的分发语义来源。 | `MethodAssetRelationService`;`MethodAssetDistributionService`;`MethodAssetRelation`;`MethodAssetDistributionRef`;`RelationIntegrityRule`;`DistributionContextRef` | 不承担 marketplace 定价、上架、订单、购买、结算、安装和履约;不让分发语义覆盖或替代核心定义 truth。 |
| 外部摘要与引用 | 作为支撑组成部分,承接治理结论、标准、ADR、artifact / archive 和外部来源的摘要或引用,统一保护外部正文不入仓。 | `ExternalBasisAcceptanceService`;`ExternalSourceSummary`;`ExternalSourceRef`;`ArtifactArchiveRef`;`GovernanceBasisRef`;`ExternalBodyBoundaryRule` | 不保存治理裁决正文、标准全文、ADR 正文、artifact 正文、证据文件、archive package 或外部系统运行状态;不执行外部系统职责。 |
| 后台维护与收敛 | 作为支撑 / operation 组成部分,维护正式读取材料、消费材料、追溯材料、引用有效性和一致性收敛任务,使已成立语义可被稳定读取和恢复。 | `MethodAssetMaintenanceService`;`ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MaintenanceRunRef`;`MaintenanceProgressView` | 不创建新的业务 truth;不绕过定义、正式化、版本和消费边界;不在本 Step 固定 job 调度、topic、重试策略、数据库或 worker 实现。 |
| 外围包与方法集组织 | 作为外围组成部分,组织方法资产包、组织级方法集和生态发现语义,在不阻塞核心闭环的前提下承接 MethodPackage / MethodSet 类增强能力。 | `MethodPackageService`;`MethodSetAssemblyService`;`MethodPackage`;`MethodSetAssembly`;`MethodPackageView`;`MethodSetAssemblyView` | 不作为核心闭环成立前置;不拥有 marketplace 交易履约;不覆盖、复制或替代核心方法资产定义、正式版本、消费和追溯语义。 |

总表裁决:

| 裁决项 | 结论 |
|---|---|
| 总表行数 | 8 行。保留统一回指入口,同时通过职责文本区分核心、支撑 / operation 和外围。 |
| 核心主链 | `方法资产定义与目录 -> 正式化与版本 -> 受控消费 -> 追溯与一致性保护`。 |
| 支撑边界 | `关系与分发语义`、`外部摘要与引用`、`后台维护与收敛` 进入总表,但不得升级为核心闭环前置。 |
| 外围边界 | `外围包与方法集组织` 进入总表末尾,只作为外围增强承接点。 |
| 代码主体来源 | 使用 Step 4 已出现的 service / object / ref / view / task candidate 名称;本表不新增 handler、repository、port、adapter、DTO、event、topic 或 job 实现名。 |

停审记录:

- 功能是否清楚: pass。总表覆盖定义、正式化、消费、追溯、关系分发、外部承接、维护收敛和外围组织。
- 候选对象是否有功能来源: pass。主要代码主体均可回指当前 00 / 01、Step 4 和 `0R.6` 候选池。
- 接缝是否清楚: partial。总表已固定职责和非职责;每个组成部分的 inbound / outbound / forbidden seam 仍需在逐组件小循环中展开。
- 禁止事项是否清楚: pass。每行均排除了下游运行 truth、外部正文、治理执行、marketplace 交易、旧 snapshot/fingerprint/outbox 和实现机制。
- 是否越界: pass。未写字段、函数、协议 schema、状态迁移、持久化结构、event payload、job 调度、配置项或实现算法。
- next_allowed_action: 进入“逐组件 capability 小循环:方法资产定义与目录:先思考”;不得跳到对象发现维度总表、交互总图或正式 §5 回填。

---

### 0R.9 方法资产定义与目录:先思考

问题回答:

- `方法资产定义与目录` 是本仓核心闭环的起点,负责回答“什么方法资产由本仓定义”、“它如何被稳定识别”、“它处于哪个目录 / 适用语境”。
- 该组件必须同时承接 FR-ML-001 的定义表达能力和 FR-ML-002 的身份 / 目录识别能力,并支撑后续正式化、受控消费、关系分发和追溯一致性。
- 该组件不是搜索索引、UI 分类、数据库目录表或旧 `MethodContent` 对象集合。目录语义必须服务于方法资产定义 subject 的稳定识别,不能变成第二 truth。
- 本组件只提供定义锚点、目录锚点和适用语境线索;正式化资格、正式版本语义、消费可用性、关系分发和追溯影响分别交给后续组件承接。

来源依据:

| 来源 | 对本组件的约束 |
|---|---|
| `00-需求文档.md` FR-ML-001 | 方法资产必须作为统一定义语义表达,不能散落到文档或消费仓私有模型。 |
| `00-需求文档.md` FR-ML-002 | 人类和系统必须能识别方法资产身份、适用语境和定义来源。 |
| `00-需求文档.md` BR-ML-001~003 | 定义 truth 归属本仓;方法资产必须有稳定身份与适用语境;Definition vs Use 必须成立。 |
| `00-需求文档.md` 数据归属 | SPEM 方法内容定义、过程模板、生命周期模型、ViewProfile、AIPolicy 等定义主题属于本仓定义 truth;身份与目录语义也属于本仓 truth。 |
| `01-架构设计.md` 职责边界 | 方法资产定义真相承载、身份与目录语义承载是本仓必须做的核心职责。 |
| `01-架构设计.md` 子域划分 | 方法资产定义与目录语义是核心子域,正式化、消费和追溯均围绕它成立。 |
| `02_hld_step_04_code_subject_framework.md` | `MethodAssetDefinitionService`,`MethodAssetCatalogService`,`MethodAssetDefinition`,`MethodAssetCatalogEntry` 是本组件当前代码主体候选。 |

capability 拆解思考:

| Capability | 输入来源 | 输出 / 结果 | 状态或副作用 | 外部协作 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 定义建立 | 方法资产作者 / 管理员提交的定义语义;允许的外部摘要或引用线索 | 可被后续正式化引用的定义锚点和定义主体 | 形成本仓定义 truth 候选;不形成正式版本 | 可引用外部摘要,但不保存外部正文 | Step 6 `MethodAssetDefinition`;Step 8 definition establishment flow |
| 定义调整 | 已存在定义锚点;显式调整意图;安全变更线索 | 更新后的定义语义和变更线索 | 记录定义变化,但不裁决正式版本语义 | 不由下游运行使用隐式触发 | Step 6 definition history candidate;Step 8 definition update flow |
| 稳定身份识别 | 定义主体;目录范围;来源和适用语境 | 稳定方法资产 ref / catalog anchor | 为正式化、消费、关系和追溯提供 subject | 只消费共享 ref / 基础契约,不依赖下游仓实现 | Step 6 `MethodAssetDefinitionRef`;Step 7 identity / lookup interface skeleton |
| 目录与适用语境表达 | 目录范围、适用对象、方法论主题、消费语境 | 目录项、目录视图和适用语境线索 | 目录 truth / read material 可被派生,但 read material 不是第二 truth | 可被 console / SDK 读取,但 UI 状态不入仓 | Step 6 `MethodAssetCatalogEntry`;Step 7 catalog query skeleton |
| 定义历史线索 | 定义建立 / 调整 / 目录语境变化 | 安全历史线索和追溯 subject | 支撑后续 trace / audit,不替代追溯组件 | 不保存 audit raw dump 或 telemetry | Step 6 history / audit candidate;Step 8 trace handoff |

对象发现线索:

| 对象线索 | 候选性质 | 当前判断 |
|---|---|---|
| `MethodAssetDefinition` | truth object candidate | 必须进入 Step 6 候选,但本 Step 不展开字段或具体资产类型全集。 |
| `MethodAssetCatalogEntry` | truth / catalog candidate | 必须进入 Step 6 候选,但不得把 catalog view 写成第二 truth。 |
| `MethodAssetDefinitionRef` | reference candidate | 需要作为正式化、消费、关系和追溯的 typed subject 线索。 |
| `MethodAssetCatalogView` | read model candidate | 可以作为读取材料线索,但只从 definition / catalog truth 派生。 |
| `MethodAssetDefinitionHistory` | history / audit candidate | 可作为变化线索,但具体审计对象由 Step 6 和追溯组件继续拆分。 |
| `CatalogApplicabilityRule` | policy / invariant candidate | 可作为适用语境规则线索,但不在 Step 5 定义规则字段或算法。 |

接缝判断:

| 接缝类型 | 判断 |
|---|---|
| inbound seam | 接收本仓允许的定义建立 / 调整意图、目录语境和安全外部摘要 / 引用线索;不得接收下游运行状态作为定义成立条件。 |
| outbound seam | 向正式化与版本输出定义锚点;向受控消费输出稳定 subject;向关系与分发输出关系端点;向追溯一致性输出变化 subject 和安全历史线索。 |
| forbidden seam | 不接收流程实例、成员实际角色、治理执行、artifact 正文、UI 会话、marketplace 交易、外部能力注册或旧 snapshot/fingerprint/outbox 作为定义 truth。 |

取舍:

- 不把“目录与适用语境”拆成独立主要组成部分。原因是目录语义服务于定义 subject 的稳定识别,与定义 truth 高度耦合;拆成主组件会让目录读取材料误像第二 truth。
- 不把“定义历史线索”并入追溯组件。本组件只记录定义变化线索和 subject;追溯组件负责解释正式化、版本、消费影响和证据链。
- 不在本组件内裁决正式化状态。方法资产是否进入正式使用语境属于 `正式化与版本`。
- 不把旧七类 P0 或旧 `MethodContent` 类型清单恢复为本组件结构。Step 6 可按当前范围独立筛选定义主题,但必须从本组件 capability 回指。

复杂度 / 越界检查:

- 本模块只做“先思考”,未写组件正式小节。
- 未写字段、函数、接口签名、协议 schema、状态枚举、数据库、topic、job、配置项或实现算法。
- 未把目录 view、搜索索引、UI 分类、repository、port、adapter、DTO 或旧 snapshot/fingerprint/outbox 写成业务组成部分。
- 下一模块只允许写“方法资产定义与目录:再写入”的职责、capability、代码主体、对象线索、接缝和停审记录;不得跳到正式化与版本或对象发现总表。

停审记录:

- 功能是否清楚: pass。定义建立、定义调整、稳定身份识别、目录适用语境和定义历史线索已拆成可承接 capability。
- 候选对象是否有功能来源: pass。候选对象均回指 FR-ML-001/002、BR-ML-001~003、数据归属和 Step 4 代码主体。
- 接缝是否清楚: pass。已区分 inbound、outbound 和 forbidden seam。
- 禁止事项是否清楚: pass。下游运行 truth、外部正文、治理执行、artifact 正文、marketplace 交易、旧 snapshot/fingerprint/outbox 均被排除。
- 是否越界: pass。未进入字段、函数、状态、协议、持久化或实现机制。
- next_allowed_action: 进入“方法资产定义与目录:再写入”,完成该组件独立小节和停审记录后再进入下一个组件。

---

### 0R.10 方法资产定义与目录:再写入

#### 本部分职责

方法资产定义与目录负责承载本仓拥有的方法资产定义 truth、稳定身份、目录语义和适用语境。它是正式化、版本、受控消费、关系分发和追溯一致性的共同 subject 锚点。

本部分不裁决方法资产是否已经正式化,不裁决正式版本语义,不判断下游是否可消费,也不维护消费影响或证据链完整解释。这些职责分别由 `正式化与版本`、`受控消费`、`追溯与一致性保护` 等后续组成部分承接。

#### Capability 清单

| Capability | 输入 | 输出 | 状态 / 副作用 | 外部协作 | 后续承接 |
|---|---|---|---|---|---|
| 定义建立 | 方法资产作者 / 管理员提交的定义语义;允许的外部摘要或引用线索 | 方法资产定义锚点和定义主体 | 形成本仓定义 truth 候选;不形成正式版本 | 可引用外部摘要,但不保存外部正文 | Step 6 `MethodAssetDefinition`;Step 8 definition establishment flow |
| 定义调整 | 已存在定义锚点;显式调整意图;安全变更线索 | 更新后的定义语义和变化线索 | 记录定义变化;不裁决正式版本语义 | 不由下游运行使用隐式触发 | Step 6 definition history candidate;Step 8 definition update flow |
| 稳定身份识别 | 定义主体、目录范围、来源和适用语境 | 稳定方法资产 ref / catalog anchor | 为正式化、消费、关系和追溯提供 subject | 只消费共享 ref / 基础契约,不依赖下游仓实现 | Step 6 `MethodAssetDefinitionRef`;Step 7 identity / lookup interface skeleton |
| 目录与适用语境表达 | 目录范围、适用对象、方法论主题、消费语境 | 目录项、目录视图和适用语境线索 | 目录 truth / read material 可被派生;read material 不是第二 truth | 可被 console / SDK 读取,但 UI 状态不入仓 | Step 6 `MethodAssetCatalogEntry`;Step 7 catalog query skeleton |
| 定义历史线索 | 定义建立、调整、目录语境变化 | 安全历史线索和追溯 subject | 支撑后续 trace / audit;不替代追溯组件 | 不保存 audit raw dump 或 telemetry | Step 6 history / audit candidate;Step 8 trace handoff |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `MethodAssetDefinitionService` | Application service candidate | 编排定义建立和定义调整,保护定义 truth 不被下游运行状态或外部正文反向污染。 | Step 7 接口骨架;Step 8 处理流 |
| `MethodAssetCatalogService` | Application service candidate | 编排稳定身份识别、目录锚点和适用语境维护。 | Step 7 查询 / 管理接口骨架;Step 8 目录处理流 |
| `MethodAssetDefinition` | Truth object candidate | 承载本仓拥有的方法资产定义语义,作为正式化、消费、关系和追溯的源头。 | Step 6 关键对象轮廓 |
| `MethodAssetCatalogEntry` | Truth / catalog candidate | 承载目录身份、目录范围和适用语境线索。 | Step 6 关键对象轮廓 |
| `MethodAssetDefinitionRef` | Reference candidate | 为正式化、消费、关系、追溯和外部只读消费提供 typed subject。 | Step 6 关键对象轮廓;Step 7 接口骨架 |
| `MethodAssetCatalogView` | Read model candidate | 从定义和目录 truth 派生目录读取材料,不得成为第二 truth。 | Step 6 候选筛选;Step 7 query 骨架 |

#### 本部分对象发现线索

| 对象线索 | 发现维度 | Step 6 处理要求 |
|---|---|---|
| `MethodAssetDefinition` | Truth | 必须独立展开,但不得从旧 `MethodContent` 或旧七类 P0 直接恢复字段全集。 |
| `MethodAssetCatalogEntry` | Truth / catalog | 必须区分目录 truth 与目录 read model,避免 catalog view 成为第二 truth。 |
| `MethodAssetDefinitionRef` | Reference | 必须成为正式化、消费、关系和追溯可复用的 typed ref 候选。 |
| `CatalogScopeRef` / `CatalogApplicabilityRule` | Reference / Policy | 可作为目录范围和适用语境候选,但 Step 6 需决定是否独立成对象。 |
| `MethodAssetCatalogView` | Projection / Read model | 只能由 definition / catalog truth 派生,不得反向改写定义。 |
| `MethodAssetDefinitionHistory` | History / Audit | 只作为定义变化线索候选,完整 trace / audit 仍由追溯组件承接。 |

#### 本部分不承担什么

| 不承担事项 | 原因 |
|---|---|
| 正式化资格、正式版本和版本语义变化裁决 | 归 `正式化与版本`;定义组件只提供可被正式化引用的 subject。 |
| 下游可消费 / 不可消费判断 | 归 `受控消费`;定义组件不拥有下游运行 truth 或消费状态。 |
| 关系分发语义 | 归 `关系与分发语义`;定义组件只提供关系端点。 |
| 完整追溯解释、证据链和消费影响归因 | 归 `追溯与一致性保护`;定义组件只提供变化 subject 和安全历史线索。 |
| 治理执行、artifact 正文、marketplace 交易、UI 渲染、流程实例或成员实际状态 | 这些属于相邻仓或外部系统,不得成为本仓定义 truth。 |
| 旧 snapshot / fingerprint / outbox / topic / database 机制 | 当前 full-restart 未授权这些旧机制作为概要组成部分或对象来源。 |

#### 与其他组成部分的接缝

| 对接部分 | 本部分输出 / 输入 | 接缝约束 |
|---|---|---|
| 正式化与版本 | 输出定义锚点、定义 subject、目录适用语境和安全变更线索。 | 正式化不得由读取、引用、同步或运行时使用隐式触发。 |
| 受控消费 | 输出稳定 subject、目录语境和可用于消费材料派生的定义来源。 | 下游只能按边界消费,不得创建、修改或替代定义 truth。 |
| 追溯与一致性保护 | 输出定义变化 subject、定义历史线索和目录语境变化线索。 | 完整追溯解释和消费影响归因不在本组件内完成。 |
| 关系与分发语义 | 输出可作为关系端点和分发来源的定义 ref。 | 关系和分发不得覆盖或替代核心定义 truth。 |
| 外部摘要与引用 | 可输入安全摘要 / 引用线索。 | 外部正文、治理裁决正文、artifact 正文和 archive package 不得进入定义主体。 |
| 后台维护与收敛 | 输出可被刷新和读取的定义 / 目录 material 来源。 | 维护路径不得创建或修复业务定义 truth。 |

#### 本部分停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 功能是否清楚 | pass | 定义建立、定义调整、稳定身份识别、目录适用语境和定义历史线索已形成可承接 capability。 |
| 候选对象是否有功能来源 | pass | `MethodAssetDefinition`,`MethodAssetCatalogEntry`,`MethodAssetDefinitionRef`,`MethodAssetCatalogView` 等均回指 FR-ML-001/002、BR-ML-001~003 和 Step 4。 |
| 接缝是否清楚 | pass | 已区分与正式化、消费、追溯、关系分发、外部摘要和后台维护的输入输出边界。 |
| 禁止事项是否清楚 | pass | 已排除下游运行 truth、外部正文、治理执行、artifact 正文、marketplace 交易、UI 渲染和旧实现机制。 |
| 是否越界 | pass | 未写字段、函数、协议 schema、状态枚举、数据库、topic、job、配置项或实现算法。 |

next_allowed_action: 进入“正式化与版本:先思考”;不得跳过到“正式化与版本:再写入”,也不得提前进入对象发现总表或正式 §5 回填。

---

### 0R.11 正式化与版本:先思考

问题回答:

- 本组成部分回答“一个已经存在的方法资产定义何时能进入正式使用语境”,以及“正式引用依赖哪个稳定版本语义边界”。
- 它必须位于核心主链中,接收 `方法资产定义与目录` 输出的 definition ref、catalog context 和定义变化线索,再向 `受控消费` 输出可作为正式消费前提的 formal version。
- 正式化不能被读取、引用、同步或运行时使用隐式触发;版本语义变化也不能通过覆盖更新、hash / fingerprint 变化或存储 snapshot 暗中替代。
- 治理、标准、ADR、artifact 或 archive 等外部输入只能作为正式化依据摘要或引用,不得把治理执行、Gate 流程、policy enforce 或外部正文迁入本仓。
- 本 Step 只做组件职责、capability 和对象线索判断,不定义正式化状态枚举、版本号算法、字段结构、接口签名、事件格式或持久化模型。

来源依据:

| 来源 | 关键结论 | 对本组成部分的影响 |
|---|---|---|
| `00-需求文档.md` FR-ML-003 / FR-ML-004 | 方法资产需要正式化能力和正式版本边界能力。 | 本组成部分必须覆盖正式化判断、正式版本建立和版本语义变化。 |
| `00-需求文档.md` BR-ML-004 / 007 / 009 / 010 / 019 / 020 | 未正式化不得正式消费;正式化和版本语义变化必须显式;治理只作依据;变化需要追溯。 | capability 需要区分前置检查、显式正式化、版本变化、依据承接和追溯线索。 |
| `00-需求文档.md` 数据归属 | 方法资产正式化与版本语义由本仓拥有正式真相;治理结论仅为摘要 / 引用。 | `FormalMethodAssetVersion` 与 `FormalizationState` 倾向成为本仓对象线索,治理执行不进入对象 truth。 |
| `01-架构设计.md` 职责 / 子域 | 正式化与版本语义是核心子域,依附于定义与目录,为受控消费提供正式版本前提。 | 本组成部分应保持核心组件地位,不能被外部摘要或受控消费吞并。 |
| `01-架构设计.md` 数据归属 / 一致性 | 版本语义不等同于 semver、hash、字段版本或状态枚举;正式化与版本语义建立要求强一致。 | 本 Step 不选择版本算法,但必须保留强一致和显式变化约束。 |
| `02_hld_step_04_code_subject_framework.md` | 给出 `MethodAssetFormalizationService`,`MethodAssetVersionService`,`FormalMethodAssetVersion`,`FormalizationBasisSummary`。 | 这些是本组成部分的代码主体和 Step 6 对象线索基础。 |
| `0R.8` / `0R.10` | 总表已把正式化与版本列为核心组成部分;定义与目录只输出 definition anchor。 | 本小节需要承接定义锚点,但不得反向修改定义 truth。 |

Capability 拆解思考:

| Capability | 输入 | 输出 | 状态 / 副作用 | 外部协作 | 后续承接 |
|---|---|---|---|---|---|
| 正式化前置检查 | definition ref;catalog context;正式化意图;可用依据摘要 / 引用 | 正式化资格判断线索 | 不形成正式版本;可保留不可正式化或待依据口径线索 | 可读取 `外部摘要与引用` 提供的 summary / ref | Step 6 `FormalizationEligibilityRule`;Step 8 formalization evaluation flow |
| 显式正式化确立 | 通过前置检查的方法资产定义;显式正式化动作;正式依据摘要 | 正式化结果和进入正式使用语境的边界 | 形成或推进 `FormalizationState` 候选;不得由 query / sync 隐式触发 | 外部治理结论只作为依据,不迁入执行状态 | Step 6 `FormalizationState`;Step 9 状态来源候选 |
| 正式版本建立 | 已正式化定义;目录语境;版本语义边界说明 | `FormalMethodAssetVersion` 候选和稳定引用语境 | 与正式化结果共同成立;失败时保持非正式或未完成口径 | 不依赖下游同步成功 | Step 6 `FormalMethodAssetVersion`;Step 7 / Step 8 version command / flow 骨架 |
| 版本语义变化表达 | 既有正式版本;显式变化原因;定义变化线索;影响语境 | 新正式版本或等价正式变化口径 | 禁止静默覆盖既有正式引用含义;输出追溯线索 | 可通知或供下游感知,但不拥有下游状态 | Step 8 version change flow;Step 9 version state / transition 来源 |
| 正式依据承接 | 治理、标准、ADR、artifact / archive 的摘要或引用 | `FormalizationBasisSummary` / `GovernanceBasisRef` 候选 | 摘要 / 引用成为正式化依据线索,不是外部 truth 副本 | 通过 `外部摘要与引用` 统一接入 | Step 6 basis summary;Step 7 external basis interface skeleton |
| 正式化历史线索 | 正式化、版本建立、版本语义变化和依据变更 | formalization / version history 线索 | 支撑追溯和审计,不替代完整 trace / audit | 不保存 raw log、telemetry 或外部正文 | Step 6 history / audit candidate;Step 8 trace handoff |

对象发现线索:

| 对象线索 | 发现维度 | Step 6 处理要求 |
|---|---|---|
| `FormalMethodAssetVersion` | Truth / State | 必须独立展开正式版本边界和稳定引用语义,但不得在本 Step 选择 semver、hash、字段版本或 snapshot 方案。 |
| `FormalizationState` | State candidate | 必须判断是否作为独立状态对象、状态词表或 formal version 的状态维度承接;本 Step 不定义枚举值。 |
| `FormalizationEligibilityRule` | Policy / Invariant | 需要表达未正式化不得正式消费、正式化必须显式、前置依据缺失时不得强行通过。 |
| `VersionStabilityRule` | Policy / Invariant | 需要表达正式版本语义稳定和变化必须显式,不得静默覆盖既有引用。 |
| `FormalMethodAssetVersionView` | Projection / Read model | 只能由 formal version truth 派生,不得成为正式版本第二 truth。 |
| `FormalizationBasisSummary` | Summary / Boundary | 承接治理、标准、ADR 或 artifact 等依据摘要,但不保存外部正文或治理执行状态。 |
| `GovernanceBasisRef` | Reference / Boundary | 只指向治理结论或依据来源,不得让治理 Gate、policy enforce 或审批过程进入本仓。 |
| formalization / version history 线索 | Audit / History | 需要交给 Step 6 判断是否独立成 history / audit 候选,并与追溯组件接缝。 |

接缝判断:

| 对接部分 | 本部分输入 / 输出 | 接缝约束 |
|---|---|---|
| 方法资产定义与目录 | 输入 definition ref、catalog context、定义变化线索。 | 不修改定义 truth,不把定义读取行为当作正式化动作。 |
| 受控消费 | 输出 formal version、formalization state 和正式可引用语境。 | 受控消费只消费正式版本前提,不得反向改变正式化结果。 |
| 追溯与一致性保护 | 输出正式化、版本变化、依据承接和历史线索。 | 完整影响归因、消费一致性保护和审计材料由追溯组件承接。 |
| 外部摘要与引用 | 输入正式化依据 summary / ref。 | 外部正文、治理执行、artifact 正文和标准全文不得进入本组成部分 truth。 |
| 关系与分发语义 | 输出正式版本语境供关系 / 分发判断使用。 | 关系和分发不得替代正式版本边界。 |
| 后台维护与收敛 | 输出 formal version truth 供读取材料刷新。 | 维护路径不得创建、修正或覆盖 formal version truth。 |

取舍:

- 本组成部分继续保留为一个核心组成部分,不拆成“正式化”和“版本”两个主要组成部分。原因是两者共同回答正式使用语境成立,拆开会让正式化状态和正式版本边界过早分裂。
- `FormalizationBasisSummary` 留在本组成部分的对象线索中,但外部来源统一通过 `外部摘要与引用` 接入,避免正式化路径拥有外部正文或治理执行。
- `FormalizationState` 只作为状态线索,后续 Step 6 / Step 9 再判断承载形态;当前不写状态枚举、迁移矩阵或失败码。
- 版本语义变化只要求显式形成新版本或等价正式变化口径,当前不选择 semver、hash、fingerprint、schema version、snapshot 或存储版本作为正式规则。
- 正式化历史线索交给追溯与一致性保护继续解释,但本组成部分必须输出可追溯的正式化 / 版本变化来源。

复杂度 / 越界检查:

- 未写字段、函数、协议 schema、状态枚举、状态迁移、数据库结构、事件 topic、payload、job 或配置项。
- 未把治理执行、Gate 流程、policy enforce、artifact 正文、标准全文、marketplace 交易或下游同步结果纳入本仓 formal version truth。
- 未复用旧 `PublishMethodContent`、`DeprecateMethodContent`、fingerprint、snapshot、outbox 或旧状态主线。
- 下一模块只允许写“正式化与版本:再写入”的职责、capability、代码主体、对象线索、接缝和停审记录;不得跳到受控消费或对象发现总表。

停审记录:

| 审查项 | 结论 | 说明 |
|---|---|---|
| 功能是否清楚 | pass | 已拆出正式化前置检查、显式正式化、正式版本建立、版本语义变化、依据承接和历史线索。 |
| 候选对象是否有功能来源 | pass | `FormalMethodAssetVersion`,`FormalizationState`,`FormalizationBasisSummary` 等均可回指 FR-ML-003/004、BR-ML-004/007/009/010/019/020 和 Step 4。 |
| 接缝是否清楚 | pass | 已区分定义输入、受控消费输出、追溯线索、外部依据输入、关系分发使用和维护读取材料边界。 |
| 禁止事项是否清楚 | pass | 已排除隐式正式化、静默覆盖、治理执行迁入、外部正文入仓和旧 snapshot / fingerprint / outbox 主线。 |
| 是否越界 | pass | 当前只写概要层思考,未下沉到对象字段、状态机、接口、协议、持久化或运行机制。 |

next_allowed_action: 进入“正式化与版本:再写入”;不得跳到“受控消费:先思考”,也不得提前进入对象发现总表或正式 §5 回填。

---

### 0R.12 正式化与版本:再写入

#### 本部分职责

正式化与版本负责把已存在的方法资产定义带入正式使用语境,并建立可被稳定引用的正式版本边界。它承接定义锚点、目录语境、显式正式化意图和外部依据摘要 / 引用,输出 formal version、正式化状态线索和版本语义变化线索。

本部分不执行治理审批,不拥有外部正文,不把下游读取、引用、同步或运行时使用当作正式化动作,也不把版本语义简化为 semver、hash、fingerprint、字段版本、storage snapshot 或旧 publish 状态。

#### Capability 清单

| Capability | 输入 | 输出 | 状态 / 副作用 | 外部协作 | 后续承接 |
|---|---|---|---|---|---|
| 正式化前置检查 | definition ref;catalog context;正式化意图;可用依据摘要 / 引用 | 正式化资格判断线索 | 不形成正式版本;前置不足时保持非正式或待依据口径 | 读取 `外部摘要与引用` 提供的 summary / ref | Step 6 `FormalizationEligibilityRule`;Step 8 formalization evaluation flow |
| 显式正式化确立 | 通过前置检查的方法资产定义;显式正式化动作;正式依据摘要 | 正式化结果和进入正式使用语境的边界 | 形成或推进 `FormalizationState` 候选;不得由 query / sync 隐式触发 | 治理结论只作为依据,不迁入执行状态 | Step 6 `FormalizationState`;Step 9 状态来源候选 |
| 正式版本建立 | 已正式化定义;目录语境;版本语义边界说明 | `FormalMethodAssetVersion` 候选和稳定引用语境 | 与正式化结果共同成立;失败时保持非正式或未完成口径 | 不依赖下游同步成功 | Step 6 `FormalMethodAssetVersion`;Step 7 / Step 8 version boundary skeleton |
| 版本语义变化表达 | 既有正式版本;显式变化原因;定义变化线索;影响语境 | 新正式版本或等价正式变化口径 | 禁止静默覆盖既有正式引用含义;输出追溯线索 | 可供下游感知,但不拥有下游状态 | Step 8 version change flow;Step 9 version state / transition source |
| 正式依据承接 | governance、standard、ADR、artifact / archive 的摘要或引用 | `FormalizationBasisSummary` / `GovernanceBasisRef` 候选 | 摘要 / 引用成为正式化依据线索,不是外部 truth 副本 | 通过 `外部摘要与引用` 统一接入 | Step 6 basis summary;Step 7 external basis skeleton |
| 正式化历史线索 | 正式化、版本建立、版本语义变化和依据变更 | formalization / version history 线索 | 支撑追溯和审计,不替代完整 trace / audit | 不保存 raw log、telemetry 或外部正文 | Step 6 history / audit candidate;Step 8 trace handoff |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `MethodAssetFormalizationService` | Application service candidate | 编排正式化前置检查、显式正式化和依据承接,保护正式化不得隐式发生。 | Step 7 接口骨架;Step 8 处理流 |
| `MethodAssetVersionService` | Application service candidate | 编排正式版本建立和版本语义变化表达,保护既有正式引用不被静默覆盖。 | Step 7 接口骨架;Step 8 处理流 |
| `FormalMethodAssetVersion` | Truth / state candidate | 承载正式版本边界和稳定引用语义。 | Step 6 关键对象轮廓;Step 9 状态来源反查 |
| `FormalizationBasisSummary` | Summary / boundary candidate | 承接治理、标准、ADR、artifact / archive 等正式化依据的安全摘要。 | Step 6 关键对象轮廓;外部摘要接缝 |
| `FormalizationState` | State candidate | 表达正式化判断结果和进入正式使用语境的状态线索。 | Step 6 候选筛选;Step 9 状态机 |
| `FormalMethodAssetVersionView` | Read model candidate | 从 formal version truth 派生读取视图,不得成为第二 truth。 | Step 6 候选筛选;Step 7 query 骨架 |

#### 本部分对象发现线索

| 对象线索 | 发现维度 | Step 6 处理要求 |
|---|---|---|
| `FormalMethodAssetVersion` | Truth / State | 必须独立展开正式版本边界和稳定引用语义,不得从旧 `PublishMethodContent` 或 snapshot / fingerprint 恢复字段。 |
| `FormalizationState` | State candidate | 需要判断是独立状态对象、状态词表,还是 formal version 的状态维度;本 Step 不定义枚举或迁移。 |
| `FormalizationEligibilityRule` | Policy / Invariant | 必须表达未正式化不得正式消费、正式化必须显式、依据缺失不得强行通过。 |
| `VersionStabilityRule` | Policy / Invariant | 必须表达正式版本语义稳定和变化显式化,禁止静默覆盖既有正式引用。 |
| `FormalMethodAssetVersionView` | Projection / Read model | 只能从 formal version truth 派生,不得反向改写正式版本。 |
| `FormalizationBasisSummary` | Summary / Boundary | 必须区分摘要 / 引用和外部正文;不得保存治理执行、标准全文、artifact 正文或 archive 正文。 |
| `GovernanceBasisRef` | Reference / Boundary | 只作为治理结论或依据来源引用,不得让 Gate 执行、policy enforce 或审批过程入仓。 |
| `FormalizationHistory` / `VersionChangeHistory` | Audit / History | 作为 history / audit candidate 进入 Step 6 筛选,并与追溯组件接缝。 |

#### 本部分不承担什么

| 不承担事项 | 原因 |
|---|---|
| 治理审批、Gate 执行、policy enforce 或治理裁决正文 | 这些属于 `L1-governance` 或外部治理边界;本仓只承接摘要 / 引用依据。 |
| 定义 truth 建立、定义调整和目录适用语境维护 | 归 `方法资产定义与目录`;本部分只消费 definition ref 和 catalog context。 |
| 下游可消费性、消费材料生成和 Definition vs Use 防护 | 归 `受控消费`;本部分只输出 formal version 前提。 |
| 完整影响归因、消费一致性保护和审计解释 | 归 `追溯与一致性保护`;本部分只输出正式化 / 版本变化线索。 |
| 外部正文、artifact 正文、archive 正文、标准全文、marketplace 交易或下游同步结果 | 这些不属于本仓 formal version truth,只能通过摘要 / 引用或边界外关系出现。 |
| 旧 publish / deprecate / retire / supersede 状态机、snapshot、fingerprint、outbox、topic 或存储版本 | 当前 full-restart 未授权这些旧机制作为概要组成部分或对象来源。 |

#### 与其他组成部分的接缝

| 对接部分 | 本部分输入 / 输出 | 接缝约束 |
|---|---|---|
| 方法资产定义与目录 | 输入 definition ref、catalog context、定义变化线索。 | 不修改定义 truth,不让读取或引用行为隐式正式化。 |
| 受控消费 | 输出 formal version、formalization state 和正式可引用语境。 | 受控消费不得反向改变正式化结果或版本边界。 |
| 追溯与一致性保护 | 输出正式化、版本变化、依据承接和历史线索。 | 完整影响归因和审计材料不在本组件内完成。 |
| 外部摘要与引用 | 输入正式化依据 summary / ref。 | 外部正文、治理执行和 artifact 生命周期不得进入本部分 truth。 |
| 关系与分发语义 | 输出正式版本语境供关系 / 分发判断使用。 | 关系和分发不得替代或覆盖正式版本边界。 |
| 后台维护与收敛 | 输出 formal version truth 供读取材料刷新。 | 维护任务不得创建、修复或覆盖 formal version truth。 |

#### 本部分停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 功能是否清楚 | pass | 正式化前置检查、显式正式化、正式版本建立、版本语义变化、依据承接和历史线索已形成可承接 capability。 |
| 候选对象是否有功能来源 | pass | `FormalMethodAssetVersion`,`FormalizationState`,`FormalizationBasisSummary`,`FormalMethodAssetVersionView` 等均回指 FR-ML-003/004、BR-ML-004/007/009/010/019/020 和 Step 4。 |
| 接缝是否清楚 | pass | 已区分定义输入、受控消费输出、追溯线索、外部依据输入、关系分发使用和后台维护读取材料边界。 |
| 禁止事项是否清楚 | pass | 已排除隐式正式化、静默覆盖、治理执行迁入、外部正文入仓、下游同步结果入仓和旧 publish / snapshot / fingerprint / outbox 主线。 |
| 是否越界 | pass | 未写字段、函数、协议 schema、状态枚举、状态迁移、数据库、topic、job、配置项或实现算法。 |

next_allowed_action: 进入“受控消费:先思考”;不得跳过到“受控消费:再写入”,也不得提前进入对象发现总表或正式 §5 回填。

---

### 0R.13 受控消费:先思考

问题回答:

- `受控消费` 回答“下游如何按边界使用已正式化的方法资产语义”,不是回答“下游如何运行流程、绑定成员、渲染 UI 或拥有方法定义正文”。
- 本组成部分必须接收 `正式化与版本` 输出的 formal version、formalization state 和正式可引用语境,并结合 `方法资产定义与目录` 提供的 definition / catalog subject,形成下游可读取、可判断、可追溯的消费材料。
- 受控消费的关键边界是 Definition vs Use:本仓提供正式消费前提、只读消费材料、可用性表达和下游边界 guard;消费方只能引用、索引、展示或执行自己的运行逻辑,不得反写或替代方法资产定义 truth。
- `FR-ML-006` 的消费语境分发与本组件有接缝,但分发语义本身后续由 `关系与分发语义` 负责;本组件只输出“哪些正式资产可被消费、以何种消费语境被引用”的前提材料。
- 消费影响摘要和变化后的一致性保护不在本组件内完整解释,但本组件必须输出可被 `追溯与一致性保护` 使用的 consumption lineage / formal version context 线索。

来源依据:

| 来源 | 关键结论 | 对本组成部分的影响 |
|---|---|---|
| `00-需求文档.md` US-ML-007 | 下游希望按边界消费正式方法资产语义,自身不拥有方法定义正文。 | 本组件必须提供正式消费材料和 Definition vs Use 防护。 |
| `00-需求文档.md` US-ML-008 / FR-ML-006 | 分发 / 同步语境需要知道哪些正式资产可进入受控消费链路。 | 本组件需要输出消费语境线索,但不拥有完整分发语义。 |
| `00-需求文档.md` FR-ML-005 | 系统必须支持下游按边界消费正式方法资产语义,且不把定义真相迁移到消费方。 | `MethodAssetConsumptionMaterial` 和 `DownstreamConsumptionBoundary` 是核心对象线索。 |
| `00-需求文档.md` BR-ML-003 / 007 / 008 | Definition vs Use 必须成立;未正式化不得正式消费;运行期消费关系不得变成源码级拥有关系。 | 消费前提必须检查 formalization / version,并禁止下游反写或复制定义 truth。 |
| `00-需求文档.md` BR-ML-012~018 | process、identity、governance、capability-hub、marketplace、UI、artifact/archive 均有相邻边界。 | 受控消费要按消费方类型表达边界,不能吸收相邻仓职责。 |
| `00-需求文档.md` BR-ML-021 / NFR-ML-010 | 正式消费应能回溯到定义来源和版本语境。 | 消费材料必须输出追溯线索,不能只给不可解释的本地约定。 |
| `01-架构设计.md` 子域 / 数据归属 | 受控消费前提语义属于本仓正式真相;正式读取与消费材料由本仓从正式真相派生。 | 本组件应区分 consumption prerequisite truth、read material 和 downstream runtime state。 |
| `01-架构设计.md` 一致性策略 | 正式 truth 到下游消费材料最终一致;下游未感知时保持待收敛或不可感知口径。 | `MethodAssetAvailabilityView` 需要表达可消费、待收敛、不可消费或未知口径。 |
| `02_hld_step_04_code_subject_framework.md` | 给出 `MethodAssetConsumptionService`,`MethodAssetConsumptionMaterial`,`MethodAssetAvailabilityView`,`DownstreamConsumptionBoundary`。 | 这些是本组成部分的代码主体和 Step 6 对象线索基础。 |

Capability 拆解思考:

| Capability | 输入 | 输出 | 状态 / 副作用 | 外部协作 | 后续承接 |
|---|---|---|---|---|---|
| 正式消费前提判断 | formal version;formalization state;definition ref;catalog / applicability context;消费方语境 | 可消费 / 不可消费 / 待收敛判断线索 | 不改变 formal version truth;未正式化或不稳定时不得进入正式消费 | 可读取外部摘要或关系语义,但不依赖下游同步成功 | Step 6 consumption prerequisite / policy candidate;Step 8 consumption evaluation flow |
| 消费材料形成 | 正式版本语义;定义来源;目录语境;允许的外部摘要 / 引用线索 | `MethodAssetConsumptionMaterial` 候选 | 派生只读消费材料;材料不是第二定义 truth | 向 process、identity、runtime、member-images 等下游提供边界内材料 | Step 6 consumption material;Step 7 consumption read skeleton |
| 可用性表达 | 消费前提判断;材料收敛情况;外部或下游不可用口径 | `MethodAssetAvailabilityView` 候选 | 表达可消费、不可消费、待收敛或未知,不改写定义 truth | 下游不可用或回报延迟时保持安全口径 | Step 6 availability view;Step 9 consumption availability state source |
| Definition vs Use 防护 | 消费方类型;消费目的;正式版本上下文;相邻仓边界规则 | `DownstreamConsumptionBoundary` 候选和边界裁决线索 | 阻止下游反写定义、复制正文或拥有替代定义 | 约束 process / identity / governance / marketplace / UI / artifact 等消费方 | Step 6 boundary / invariant candidate;Step 10 exception boundary |
| 消费语境承接 | formal version;catalog context;关系 / 分发语义线索;消费方 scope | `ConsumptionContextRef` 候选 | 为分发或同步提供受控入口线索,不等同于分发执行成功 | 与 `关系与分发语义` 接缝,不拥有 marketplace 交易或安装履约 | Step 6 context ref;Step 7 distribution-facing skeleton |
| 消费追溯线索输出 | consumption material;formal version context;definition source;availability decision | consumption lineage / consumed version context 线索 | 支撑正式消费回溯,不完成完整影响归因 | 输出给 `追溯与一致性保护` | Step 6 trace handoff candidate;Step 8 trace handoff flow |

对象发现线索:

| 对象线索 | 发现维度 | Step 6 处理要求 |
|---|---|---|
| `MethodAssetConsumptionMaterial` | Projection / Read material | 必须区分只读消费材料与定义 truth;不得保存外部正文或下游运行状态正文。 |
| `MethodAssetAvailabilityView` | View / State source | 可表达可消费、不可消费、待收敛或未知口径,但本 Step 不定义状态枚举。 |
| `DownstreamConsumptionBoundary` | Boundary / Invariant | 必须承载 Definition vs Use 防护,并能按相邻仓类型排除越界消费。 |
| `ConsumptionContextRef` | Reference / Boundary | 用于承接消费语境和分发接缝,但不得替代关系与分发组件的语义 owner。 |
| `FormalConsumptionPrerequisite` | Policy / Invariant candidate | 可作为未正式化不得消费、版本稳定前提和可用性判断规则线索。 |
| `ConsumptionLineageRef` | Trace / Reference candidate | 用于把正式消费回溯到 definition source 和 formal version context。 |
| `ConsumptionImpactSummary` | Summary candidate | 当前只作为与追溯一致性保护的接缝线索,不作为受控消费的主要 truth。 |

接缝判断:

| 接缝类型 | 判断 |
|---|---|
| inbound seam | 接收 definition ref、catalog context、formal version、formalization state、外部摘要 / 引用线索和消费方语境;不得接收下游运行状态作为消费前提 truth。 |
| outbound seam | 向核心下游提供只读消费材料、可用性表达和消费边界;向关系与分发输出消费语境线索;向追溯一致性输出 consumed version / lineage 线索。 |
| forbidden seam | 不允许下游创建、修改或替代方法资产定义;不保存流程实例、成员实际状态、治理执行、capability provider 接入、marketplace 交易、UI 渲染状态、artifact 正文或旧 snapshot / fingerprint / outbox。 |

取舍:

- 本组成部分保留为核心组成部分,不并入 `正式化与版本`。原因是正式化只决定正式使用语境成立,受控消费还要表达材料、可用性和下游边界。
- 本组成部分也不并入 `关系与分发语义`。分发语义会处理关系和生态引用边界,而受控消费只输出可消费前提和消费语境 ref。
- `MethodAssetAvailabilityView` 暂作为 read / view 线索,不在 Step 5 定义状态枚举或状态迁移;Step 6 / Step 9 再判断是否形成独立状态来源。
- `ConsumptionImpactSummary` 不提升为受控消费核心对象。它更适合由 `追溯与一致性保护` 解释,本组件只输出 lineage 和 consumed context。
- 下游不可用、同步滞后或回报缺失时,本仓不得改写定义 truth 或 formal version truth;只允许在消费材料 / 可用性表达中保留待收敛、不可感知或未知口径。

复杂度 / 越界检查:

- 未写字段、函数、协议 schema、状态枚举、状态迁移、数据库结构、事件 topic、payload、job、配置项或具体同步算法。
- 未把 process 执行、identity 成员状态、governance 执行、capability provider 接入、marketplace 交易、UI 渲染或 artifact 正文迁入本仓。
- 未恢复旧 `ExportDefinitionSnapshot`、snapshot、fingerprint、outbox、topic 或旧 publish-based 消费链路。
- 下一模块只允许写“受控消费:再写入”的职责、capability、代码主体、对象线索、接缝和停审记录;不得跳到追溯与一致性保护或对象发现总表。

停审记录:

| 审查项 | 结论 | 说明 |
|---|---|---|
| 功能是否清楚 | pass | 已拆出正式消费前提判断、消费材料形成、可用性表达、Definition vs Use 防护、消费语境承接和消费追溯线索输出。 |
| 候选对象是否有功能来源 | pass | `MethodAssetConsumptionMaterial`,`MethodAssetAvailabilityView`,`DownstreamConsumptionBoundary`,`ConsumptionContextRef` 等均可回指 FR-ML-005/006、BR-ML-003/007/008/012~018/021 和 Step 4。 |
| 接缝是否清楚 | pass | 已区分来自定义 / 正式化的输入、面向下游的输出、与关系分发和追溯一致性的接缝。 |
| 禁止事项是否清楚 | pass | 已排除下游运行 truth、外部正文、治理执行、marketplace 交易、UI 渲染、artifact 正文和旧 snapshot / fingerprint / outbox 主线。 |
| 是否越界 | pass | 当前只写概要层思考,未下沉到对象字段、接口、状态机、协议、持久化或运行机制。 |

next_allowed_action: 等待用户确认后进入“受控消费:再写入”;不得跳到“追溯与一致性保护:先思考”,也不得提前进入对象发现总表或正式 §5 回填。

---

### 0R.14 受控消费:再写入

#### 本部分职责

受控消费负责把已正式化的方法资产版本转化为下游可按边界读取、引用、索引或展示的消费材料,并保护 Definition vs Use 不被打穿。它承接 definition ref、catalog context、formal version 和 formalization state,输出只读消费材料、可用性表达、消费边界和消费追溯线索。

本部分不拥有下游运行 truth,不执行流程、不绑定成员实际能力、不渲染 UI、不执行治理,也不保存 artifact 正文、marketplace 交易事实或下游私有模型正文。下游不可用、同步滞后或回报缺失时,本部分只能表达待收敛、不可感知或未知口径,不得改写定义 truth 或 formal version truth。

#### Capability 清单

| Capability | 输入 | 输出 | 状态 / 副作用 | 外部协作 | 后续承接 |
|---|---|---|---|---|---|
| 正式消费前提判断 | formal version;formalization state;definition ref;catalog / applicability context;消费方语境 | 可消费 / 不可消费 / 待收敛判断线索 | 不改变 formal version truth;未正式化或不稳定时不得进入正式消费 | 可读取外部摘要或关系语义,但不依赖下游同步成功 | Step 6 consumption prerequisite / policy candidate;Step 8 consumption evaluation flow |
| 消费材料形成 | 正式版本语义;定义来源;目录语境;允许的外部摘要 / 引用线索 | `MethodAssetConsumptionMaterial` 候选 | 派生只读消费材料;材料不是第二定义 truth | 向 process、identity、runtime、member-images 等下游提供边界内材料 | Step 6 consumption material;Step 7 consumption read skeleton |
| 可用性表达 | 消费前提判断;材料收敛情况;外部或下游不可用口径 | `MethodAssetAvailabilityView` 候选 | 表达可消费、不可消费、待收敛或未知,不改写定义 truth | 下游不可用或回报延迟时保持安全口径 | Step 6 availability view;Step 9 consumption availability state source |
| Definition vs Use 防护 | 消费方类型;消费目的;正式版本上下文;相邻仓边界规则 | `DownstreamConsumptionBoundary` 候选和边界裁决线索 | 阻止下游反写定义、复制正文或拥有替代定义 | 约束 process / identity / governance / marketplace / UI / artifact 等消费方 | Step 6 boundary / invariant candidate;Step 10 exception boundary |
| 消费语境承接 | formal version;catalog context;关系 / 分发语义线索;消费方 scope | `ConsumptionContextRef` 候选 | 为分发或同步提供受控入口线索,不等同于分发执行成功 | 与 `关系与分发语义` 接缝,不拥有 marketplace 交易或安装履约 | Step 6 context ref;Step 7 distribution-facing skeleton |
| 消费追溯线索输出 | consumption material;formal version context;definition source;availability decision | consumption lineage / consumed version context 线索 | 支撑正式消费回溯,不完成完整影响归因 | 输出给 `追溯与一致性保护` | Step 6 trace handoff candidate;Step 8 trace handoff flow |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `MethodAssetConsumptionService` | Application service candidate | 编排正式消费前提判断、消费材料形成和消费边界裁决。 | Step 7 接口骨架;Step 8 处理流 |
| `MethodAssetConsumptionMaterial` | Projection / read material candidate | 承载下游只读消费材料,从 definition / formal version truth 派生。 | Step 6 关键对象轮廓 |
| `MethodAssetAvailabilityView` | Read view / state source candidate | 表达正式消费材料的可用、不可用、待收敛或未知口径。 | Step 6 候选筛选;Step 9 状态来源反查 |
| `DownstreamConsumptionBoundary` | Boundary / invariant candidate | 保护下游不得反写定义 truth、复制正文或拥有替代定义。 | Step 6 关键对象轮廓;Step 10 边界场景 |
| `ConsumptionContextRef` | Reference / boundary candidate | 承接消费语境,并与关系 / 分发语义形成接缝。 | Step 6 候选筛选;Step 7 分发相关骨架 |
| `ConsumptionLineageRef` | Trace / reference candidate | 把正式消费材料回指到定义来源和正式版本语境。 | Step 6 候选筛选;追溯组件接缝 |

#### 本部分对象发现线索

| 对象线索 | 发现维度 | Step 6 处理要求 |
|---|---|---|
| `MethodAssetConsumptionMaterial` | Projection / Read material | 必须独立区分只读消费材料与定义 truth;不得从下游私有模型、旧 snapshot 或 artifact 正文恢复字段。 |
| `MethodAssetAvailabilityView` | View / State source | 需要表达消费材料是否可用、待收敛、不可用或未知,但 Step 5 不定义状态枚举。 |
| `DownstreamConsumptionBoundary` | Boundary / Invariant | 必须覆盖 Definition vs Use 防护,并显式排除相邻仓职责渗入。 |
| `ConsumptionContextRef` | Reference / Boundary | 用于消费语境和分发接缝,但不得替代 `关系与分发语义` 的 owner。 |
| `FormalConsumptionPrerequisite` | Policy / Invariant | 可作为未正式化不得消费、正式版本稳定前提和可用性判断规则线索。 |
| `ConsumptionLineageRef` | Trace / Reference | 需要支撑 BR-ML-021 / NFR-ML-010 所要求的正式消费回溯。 |
| `ConsumptionImpactSummary` | Summary / 接缝候选 | 交由 `追溯与一致性保护` 继续解释,本组件只输出 consumed context 和 lineage。 |

#### 本部分不承担什么

| 不承担事项 | 原因 |
|---|---|
| 方法资产定义 truth 建立、调整和目录维护 | 归 `方法资产定义与目录`;本部分只消费 definition ref 和 catalog context。 |
| 正式化资格、正式版本边界和版本语义变化裁决 | 归 `正式化与版本`;本部分只消费 formal version 和 formalization state。 |
| 完整消费影响归因、一致性保护和审计解释 | 归 `追溯与一致性保护`;本部分只输出 lineage 和 consumed version context。 |
| 关系 truth、分发语义、生态引用和 marketplace 边界 | 归 `关系与分发语义`;本部分只提供受控消费语境线索。 |
| process 执行状态、identity 成员状态、governance 执行、capability provider 接入、UI 渲染、artifact 正文、marketplace 交易 | 这些属于相邻仓或外部系统,不得成为本仓消费材料 truth。 |
| 旧 snapshot / fingerprint / outbox / topic / publish-based 同步链路 | 当前 full-restart 未授权这些旧机制作为受控消费组成部分或对象来源。 |

#### 与其他组成部分的接缝

| 对接部分 | 本部分输入 / 输出 | 接缝约束 |
|---|---|---|
| 方法资产定义与目录 | 输入 definition ref、catalog context 和适用语境。 | 不修改定义 truth,不把目录读取材料写成消费方定义副本。 |
| 正式化与版本 | 输入 formal version、formalization state 和正式可引用语境。 | 未正式化或不稳定的资产不得作为正式消费依据。 |
| 追溯与一致性保护 | 输出 consumed version context、availability decision 和 lineage 线索。 | 完整影响归因、审计解释和一致性保护不在本组件内完成。 |
| 关系与分发语义 | 输出消费语境线索,并可读取关系 / 分发语义。 | 不拥有 relation truth、distribution semantics 或 marketplace 履约。 |
| 外部摘要与引用 | 可读取允许进入消费材料的外部摘要 / 引用。 | 不保存外部正文、artifact 正文、archive 正文或标准全文。 |
| 后台维护与收敛 | 输出可被刷新和收敛的消费材料来源。 | 维护任务不得创建、修复或覆盖受控消费前提 truth。 |

#### 本部分停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 功能是否清楚 | pass | 正式消费前提判断、消费材料形成、可用性表达、Definition vs Use 防护、消费语境承接和消费追溯线索已形成可承接 capability。 |
| 候选对象是否有功能来源 | pass | `MethodAssetConsumptionMaterial`,`MethodAssetAvailabilityView`,`DownstreamConsumptionBoundary`,`ConsumptionContextRef`,`ConsumptionLineageRef` 等均回指 FR-ML-005/006、BR-ML-003/007/008/012~018/021 和 Step 4。 |
| 接缝是否清楚 | pass | 已区分来自定义 / 正式化的输入、面向下游的输出、与关系分发、外部摘要、追溯一致性和后台维护的接缝。 |
| 禁止事项是否清楚 | pass | 已排除下游运行 truth、外部正文、治理执行、marketplace 交易、UI 渲染、artifact 正文和旧 snapshot / fingerprint / outbox 主线。 |
| 是否越界 | pass | 未写字段、函数、协议 schema、状态枚举、状态迁移、数据库、topic、job、配置项或实现算法。 |

next_allowed_action: 等待用户确认后进入“追溯与一致性保护:先思考”;不得跳到“追溯与一致性保护:再写入”,也不得提前进入对象发现总表或正式 §5 回填。

---

### 0R.15 追溯与一致性保护:先思考

问题回答:

- `追溯与一致性保护` 回答“正式化、版本语义变化、正式消费和消费影响如何被解释、审计和保护”,不是回答“如何实现日志、trace id、报表、事件 payload 或对账算法”。
- 本组成部分接收 `方法资产定义与目录` 的定义来源、`正式化与版本` 的 formal version / 版本变化线索、`受控消费` 的 consumed version context / availability decision,并承接允许范围内的下游消费影响摘要。
- 本组成部分必须支撑 FR-ML-007 / 008 / 009:版本、变更依据和引用语境可追溯;正式方法资产变化对既有消费的影响可识别;版本、发布和引用相关证据线索可进入验收或审计语境。
- 一致性保护不是把下游运行状态搬进本仓,也不是要求所有下游同步完成后本仓 truth 才成立。下游影响摘要缺失时只能保留未知、待承接或待确认口径。
- 证据线索不是证据文件正文。artifact、archive、标准全文、审计原始日志和外部文件正文仍归外部系统或相邻仓,本仓只保存可解释的来源线索、引用和关联语境。

来源依据:

| 来源 | 关键结论 | 对本组成部分的影响 |
|---|---|---|
| `00-需求文档.md` US-ML-009 / FR-ML-007 | 审计者需要查看方法资产版本和变更依据,判断被使用资产是否可追溯。 | 本组件必须形成 trace material 和版本 / 变更依据追溯线索。 |
| `00-需求文档.md` US-ML-010 / FR-ML-008 | 维护任务需要识别正式方法资产变化对既有消费的影响,避免语义漂移静默破坏下游引用。 | 本组件必须承接 impact summary 与一致性保护判断,但不拥有下游运行 truth。 |
| `00-需求文档.md` US-ML-011 / FR-ML-009 | 证据线索需要承接到正式验收或审计语境。 | 本组件必须输出 evidence lineage / audit handoff 线索,不保存证据文件正文。 |
| `00-需求文档.md` BR-ML-011 / 020 / 021 / 022 | 消费影响变化必须显式;正式化、版本变化和正式消费必须可追溯;证据线索不得只存在于人工说明。 | capability 需要覆盖显式变化识别、消费回溯、证据线索承接和审计解释。 |
| `00-需求文档.md` NFR-ML-009~016 | 追溯、证据、一致性、显式变化、可观测和观测材料边界必须成立。 | 本组件要保留可观察和可恢复线索,但不得让观测材料成为第二 truth。 |
| `01-架构设计.md` 数据所有权 | 方法资产追溯依据由本仓拥有正式真相;下游消费影响摘要只是摘要数据;artifact / archive 只保存引用。 | 需要区分 trace truth、impact summary 和 external evidence ref。 |
| `01-架构设计.md` 一致性策略 | 下游影响摘要缺失时保持未知或待确认;目录、读取和追溯材料可后台收敛;恢复不得反向改写核心 truth。 | 一致性保护输出安全口径和恢复线索,不改写 definition / formal version truth。 |
| `02_hld_step_04_code_subject_framework.md` | 给出 `MethodAssetTraceService`,`MethodAssetConsistencyService`,`MethodAssetTraceMaterial`,`ConsumptionImpactSummary`。 | 这些是本组成部分的代码主体和 Step 6 对象线索基础。 |

Capability 拆解思考:

| Capability | 输入 | 输出 | 状态 / 副作用 | 外部协作 | 后续承接 |
|---|---|---|---|---|---|
| 版本与变更依据追溯 | definition source;formal version;version semantic change;formalization basis | `MethodAssetTraceMaterial` 候选和版本 / 变更依据线索 | 形成可审计解释材料;不修改定义或版本 truth | 可引用外部摘要 / governance basis / artifact ref | Step 6 trace material;Step 8 trace view flow |
| 正式消费回溯 | consumption lineage;consumed version context;availability decision | 被消费定义来源和版本语境的回溯线索 | 支撑 BR-ML-021;不拥有消费方运行状态 | 接收受控消费输出的 lineage | Step 6 consumption trace candidate;Step 7 trace query skeleton |
| 消费影响识别 | formal version change;known consumption contexts;下游影响摘要候选 | `ConsumptionImpactSummary` 候选和影响范围线索 | 表达已知 / 未知 / 待承接影响口径;不扫描下游 truth | 可接收下游正式回报摘要 | Step 6 impact summary;Step 8 impact evaluation flow |
| 一致性保护判断 | trace material;consumption impact summary;availability / freshness 线索 | 一致性保护裁决线索和待恢复 / 待确认口径 | 暴露潜在语义漂移或材料未收敛;不强制同步成功 | 与后台维护和下游影响回报接缝 | Step 6 consistency policy candidate;Step 9 consistency state source |
| 证据线索承接 | formalization basis;version / publication / reference lineage;external evidence refs | evidence lineage / audit handoff 线索 | 支撑验收和审计,不保存证据文件正文 | 通过外部摘要与引用接入 artifact / archive / standard / ADR ref | Step 6 evidence lineage;Step 7 evidence query skeleton |
| 可观察与恢复线索输出 | trace / impact / evidence / material freshness 口径 | 可观察状态线索和 recovery handoff | 让异常、缺失、待承接或待恢复可被后续 Step 表达 | 与后台维护与收敛接缝 | Step 9 observability / recovery state source;Step 10 boundary scenarios |

对象发现线索:

| 对象线索 | 发现维度 | Step 6 处理要求 |
|---|---|---|
| `MethodAssetTraceMaterial` | Trace / Read material | 必须解释版本、变更依据和引用语境,但不得退化为 raw log、trace id 或 telemetry。 |
| `ConsumptionImpactSummary` | Summary / Impact | 只承接下游正式影响摘要和影响范围线索,不得保存下游运行状态正文。 |
| `MethodAssetConsistencyPolicy` | Policy / Invariant candidate | 可表达显式变化、静默覆盖禁止、影响未知时安全口径和一致性保护约束。 |
| `EvidenceLineageRef` | Reference / Evidence candidate | 用于连接版本、发布、引用和外部证据线索,不得保存证据文件正文。 |
| `AuditHandoffSummary` | Audit / Summary candidate | 可作为验收或审计语境承接线索,但不定义报表字段或审计 schema。 |
| `TraceFreshnessView` | View / State source candidate | 可表达追溯材料是否待收敛、缺失、不可用或已收敛,但本 Step 不定义枚举。 |
| `ConsistencyRecoveryRef` | Reference / Recovery candidate | 可作为后续后台维护和恢复收敛的接缝线索,不在本组件定义 job 或重试策略。 |

接缝判断:

| 接缝类型 | 判断 |
|---|---|
| inbound seam | 接收 definition source、formal version / version change、formalization basis、consumption lineage、availability decision、外部摘要 / 引用和下游影响摘要候选。 |
| outbound seam | 向审计 / 查询提供 trace material、impact summary、evidence lineage 和一致性保护口径;向后台维护输出待收敛 / 待恢复线索;向后续状态章节输出状态来源候选。 |
| forbidden seam | 不保存下游运行状态正文、artifact / evidence / archive 正文、raw log、telemetry、事件 payload、报表字段、对账算法或旧 snapshot / fingerprint / outbox 机制。 |

取舍:

- 本组成部分保留为核心组成部分,不拆成“追溯”“影响”“证据”“一致性”四个主要组件。原因是它们共同回答变化后的解释、审计和消费稳定性保护,拆开会让 evidence / impact / trace 来源断裂。
- `ConsumptionImpactSummary` 保留为候选,但不在 Step 5 裁决为强制 P0 同步机制。它只能是正式摘要和影响线索,不能把下游运行状态或回报协议带入本仓。
- `EvidenceLineageRef` 只作为证据线索候选,不定义证据 JSON、artifact schema、报表字段、文件格式或验收产物结构。
- 一致性保护可以输出待承接、未知、待恢复或显式异常线索,但不能通过恢复动作创建、修正或覆盖 definition truth / formal version truth。
- 可观察材料只用于判断关键状态是否成立,不得成为方法资产定义、正式版本或消费材料的替代 truth。

复杂度 / 越界检查:

- 未写字段、函数、协议 schema、状态枚举、状态迁移、数据库结构、事件 topic、payload、job、配置项、指标名或对账算法。
- 未把下游运行状态、artifact 正文、证据文件正文、archive 正文、外部标准全文、raw log、telemetry 或审计报表正文迁入本仓。
- 未恢复旧 snapshot、fingerprint、outbox、publish topic 或旧发布同步主线。
- 下一模块只允许写“追溯与一致性保护:再写入”的职责、capability、代码主体、对象线索、接缝和停审记录;不得跳到关系与分发语义或对象发现总表。

停审记录:

| 审查项 | 结论 | 说明 |
|---|---|---|
| 功能是否清楚 | pass | 已拆出版本与变更依据追溯、正式消费回溯、消费影响识别、一致性保护判断、证据线索承接和可观察 / 恢复线索输出。 |
| 候选对象是否有功能来源 | pass | `MethodAssetTraceMaterial`,`ConsumptionImpactSummary`,`EvidenceLineageRef`,`MethodAssetConsistencyPolicy` 等均可回指 FR-ML-007/008/009、BR-ML-011/020/021/022、NFR-ML-009~016 和 Step 4。 |
| 接缝是否清楚 | pass | 已区分来自定义 / 正式化 / 受控消费 / 外部摘要 / 下游影响摘要的输入,以及面向审计、后台维护和状态来源的输出。 |
| 禁止事项是否清楚 | pass | 已排除下游运行 truth、证据正文、artifact / archive 正文、raw log、telemetry、报表字段、对账算法和旧 snapshot / fingerprint / outbox 主线。 |
| 是否越界 | pass | 当前只写概要层思考,未下沉到对象字段、接口、状态机、协议、持久化、指标或运行机制。 |

next_allowed_action: 等待用户确认后进入“追溯与一致性保护:再写入”;不得跳到“关系与分发语义:先思考”,也不得提前进入对象发现总表或正式 §5 回填。

---

### 0R.16 追溯与一致性保护:再写入

#### 本部分职责

追溯与一致性保护负责解释方法资产正式化、正式版本语义变化、正式消费和消费影响之间的关系,让版本、变更依据、引用语境和证据线索能够进入审计、验收和一致性保护语境。它承接 definition source、formal version、version change、formalization basis、consumption lineage、availability decision 和允许范围内的下游消费影响摘要,输出追溯材料、影响摘要、一致性保护口径、证据线索和恢复接缝。

本部分不保存下游运行状态正文,不保存 artifact / evidence / archive 正文,不定义 raw log、trace id、报表字段、事件 payload、指标名或对账算法。下游影响摘要缺失时,本部分只能表达未知、待承接或待确认口径,不得要求下游同步完成后本仓 truth 才成立,也不得通过恢复动作改写 definition truth 或 formal version truth。

#### Capability 清单

| Capability | 输入 | 输出 | 状态 / 副作用 | 外部协作 | 后续承接 |
|---|---|---|---|---|---|
| 版本与变更依据追溯 | definition source;formal version;version semantic change;formalization basis | `MethodAssetTraceMaterial` 候选和版本 / 变更依据线索 | 形成可审计解释材料;不修改定义或版本 truth | 可引用外部摘要 / governance basis / artifact ref | Step 6 trace material;Step 8 trace view flow |
| 正式消费回溯 | consumption lineage;consumed version context;availability decision | 被消费定义来源和版本语境的回溯线索 | 支撑 BR-ML-021;不拥有消费方运行状态 | 接收受控消费输出的 lineage | Step 6 consumption trace candidate;Step 7 trace query skeleton |
| 消费影响识别 | formal version change;known consumption contexts;下游影响摘要候选 | `ConsumptionImpactSummary` 候选和影响范围线索 | 表达已知 / 未知 / 待承接影响口径;不扫描下游 truth | 可接收下游正式回报摘要 | Step 6 impact summary;Step 8 impact evaluation flow |
| 一致性保护判断 | trace material;consumption impact summary;availability / freshness 线索 | 一致性保护裁决线索和待恢复 / 待确认口径 | 暴露潜在语义漂移或材料未收敛;不强制同步成功 | 与后台维护和下游影响回报接缝 | Step 6 consistency policy candidate;Step 9 consistency state source |
| 证据线索承接 | formalization basis;version / publication / reference lineage;external evidence refs | evidence lineage / audit handoff 线索 | 支撑验收和审计,不保存证据文件正文 | 通过外部摘要与引用接入 artifact / archive / standard / ADR ref | Step 6 evidence lineage;Step 7 evidence query skeleton |
| 可观察与恢复线索输出 | trace / impact / evidence / material freshness 口径 | 可观察状态线索和 recovery handoff | 让异常、缺失、待承接或待恢复可被后续 Step 表达 | 与后台维护与收敛接缝 | Step 9 observability / recovery state source;Step 10 boundary scenarios |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `MethodAssetTraceService` | Application service candidate | 聚合 definition source、formal version、version change、consumption lineage 和 evidence lineage,形成可解释追溯材料。 | Step 7 接口骨架;Step 8 处理流 |
| `MethodAssetConsistencyService` | Application service candidate | 编排消费影响识别、一致性保护判断和待恢复 / 待确认口径。 | Step 7 接口骨架;Step 8 处理流 |
| `MethodAssetTraceMaterial` | Trace / read material candidate | 承载版本、变更依据、引用语境和消费回溯材料。 | Step 6 关键对象轮廓 |
| `ConsumptionImpactSummary` | Summary / impact candidate | 承接下游正式影响摘要和影响范围线索,不拥有下游运行状态。 | Step 6 关键对象轮廓 |
| `EvidenceLineageRef` | Reference / evidence candidate | 连接版本、发布、引用和外部证据线索。 | Step 6 候选筛选;外部摘要接缝 |
| `MethodAssetConsistencyPolicy` | Policy / invariant candidate | 表达显式变化、静默覆盖禁止、影响未知安全口径和一致性保护约束。 | Step 6 候选筛选;Step 9 状态来源反查 |

#### 本部分对象发现线索

| 对象线索 | 发现维度 | Step 6 处理要求 |
|---|---|---|
| `MethodAssetTraceMaterial` | Trace / Read material | 必须解释版本、变更依据和引用语境,但不得退化为 raw log、trace id 或 telemetry。 |
| `ConsumptionImpactSummary` | Summary / Impact | 只承接下游正式影响摘要和影响范围线索,不得保存下游运行状态正文。 |
| `MethodAssetConsistencyPolicy` | Policy / Invariant | 需要表达显式变化、静默覆盖禁止、影响未知时安全口径和一致性保护约束。 |
| `EvidenceLineageRef` | Reference / Evidence | 用于连接版本、发布、引用和外部证据线索,不得保存证据文件正文。 |
| `AuditHandoffSummary` | Audit / Summary | 可作为验收或审计语境承接线索,但不定义报表字段或审计 schema。 |
| `TraceFreshnessView` | View / State source | 可表达追溯材料是否待收敛、缺失、不可用或已收敛,但 Step 5 不定义枚举。 |
| `ConsistencyRecoveryRef` | Reference / Recovery | 作为后续后台维护和恢复收敛的接缝线索,不在本组件定义 job 或重试策略。 |

#### 本部分不承担什么

| 不承担事项 | 原因 |
|---|---|
| 方法资产定义 truth、目录适用语境和正式版本 truth 的创建或修改 | 这些分别归 `方法资产定义与目录` 与 `正式化与版本`;本部分只解释和回溯。 |
| 受控消费材料生成和下游消费边界裁决 | 归 `受控消费`;本部分只承接 consumed version context、lineage 和 availability decision。 |
| 下游运行状态、流程实例、成员状态、消费方内部对象或私有模型正文 | 本仓只可保留正式影响摘要,不得拥有下游运行 truth。 |
| artifact、evidence、archive、标准全文、ADR 正文或外部文件正文 | 这些属于相邻仓或外部系统;本仓只承接摘要 / 引用 / evidence lineage。 |
| raw log、telemetry、trace id、报表字段、指标名、事件 payload、topic 或对账算法 | 这些是观测、协议或实现细节,不属于概要 Step 5 的业务组成部分职责。 |
| 旧 snapshot / fingerprint / outbox / publish topic 或旧发布同步主线 | 当前 full-restart 未授权这些旧机制作为追溯或一致性保护来源。 |

#### 与其他组成部分的接缝

| 对接部分 | 本部分输入 / 输出 | 接缝约束 |
|---|---|---|
| 方法资产定义与目录 | 输入 definition source、definition history 和 catalog context。 | 只解释定义来源和变化线索,不得修改 definition truth。 |
| 正式化与版本 | 输入 formal version、version semantic change、formalization basis 和版本历史线索。 | 不创建或覆盖正式版本;只保留追溯和审计解释。 |
| 受控消费 | 输入 consumption lineage、consumed version context、availability decision。 | 不生成消费材料,不拥有下游运行状态。 |
| 外部摘要与引用 | 输入 governance / artifact / archive / standard / ADR 等摘要或引用线索。 | 不保存外部正文或证据文件正文。 |
| 后台维护与收敛 | 输出待收敛、待恢复、缺失、未知或显式异常线索。 | 后台维护只能推进材料收敛和恢复口径,不得反向改写核心 truth。 |
| 关系与分发语义 | 可输入关系 / 分发变化线索,并输出影响解释线索。 | 不拥有 relation truth 或 distribution semantics。 |

#### 本部分停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 功能是否清楚 | pass | 版本与变更依据追溯、正式消费回溯、消费影响识别、一致性保护判断、证据线索承接和可观察 / 恢复线索已形成可承接 capability。 |
| 候选对象是否有功能来源 | pass | `MethodAssetTraceMaterial`,`ConsumptionImpactSummary`,`EvidenceLineageRef`,`MethodAssetConsistencyPolicy`,`TraceFreshnessView` 等均回指 FR-ML-007/008/009、BR-ML-011/020/021/022、NFR-ML-009~016 和 Step 4。 |
| 接缝是否清楚 | pass | 已区分来自定义、正式化、受控消费、外部摘要、下游影响摘要、后台维护和关系分发的输入输出。 |
| 禁止事项是否清楚 | pass | 已排除下游运行 truth、证据正文、artifact / archive 正文、raw log、telemetry、报表字段、对账算法和旧 snapshot / fingerprint / outbox 主线。 |
| 是否越界 | pass | 未写字段、函数、协议 schema、状态枚举、状态迁移、数据库、topic、job、配置项、指标名或实现算法。 |

next_allowed_action: 等待用户确认后进入“关系与分发语义:先思考”;不得跳到“关系与分发语义:再写入”,也不得提前进入对象发现总表或正式 §5 回填。

---

### 0R.17 关系与分发语义:先思考

问题回答:

- `关系与分发语义` 回答“方法资产之间有哪些定义性关系,以及哪些正式资产可以进入分发 / 同步 / 生态发现语境”,不是回答 marketplace 如何定价、购买、安装、结算或履约。
- 本组成部分承接 `方法资产定义与目录` 的 definition ref / catalog context、`正式化与版本` 的 formal version context、`受控消费` 的 consumption context,形成关系 truth、分发语义和生态引用边界。
- 关系语义由本仓拥有正式 truth,不得由消费仓、同步结果、生态分发结果或 marketplace 引用隐式改写。
- 分发语义服务于受控消费和外围发现,但不等同于下游同步成功、包导出实现、生态上架状态或交易事实。
- 关系 / 分发变化可能影响消费和追溯,因此本组件需要输出变化线索给 `追溯与一致性保护`,但不替代其影响归因与一致性保护职责。

来源依据:

| 来源 | 关键结论 | 对本组成部分的影响 |
|---|---|---|
| `00-需求文档.md` FR-ML-006 / US-ML-008 | 分发 / 同步语境需要知道哪些正式方法资产可进入受控消费链路。 | 本组件需要表达可分发语义和消费语境接缝。 |
| `00-需求文档.md` 数据归属 | 方法资产关系语义和方法资产分发语义由本仓拥有正式真相。 | `MethodAssetRelation` 和 `MethodAssetDistributionRef` 是核心对象线索。 |
| `00-需求文档.md` BR-ML-008 / 011 / 016 | 运行期消费、事件协作或生态分发不得变成源码级拥有;影响消费变化必须显式;marketplace 交易履约不入仓。 | 关系 / 分发变化需要显式,但交易、安装、订单和履约必须排除。 |
| `00-需求文档.md` FR-ML-E-002 / BR-ML-E-001 | 生态发现是外围增强,不得改变核心方法资产定义真相边界。 | 本组件可提供生态引用边界,但不让外围发现成为核心前置。 |
| `01-架构设计.md` 子域划分 | 方法资产关系与分发语义是支撑子域,支撑受控消费和外围分发,不替代核心定义真相。 | 本组件定位为支撑组成部分,不是核心定义 / 正式化 / 消费 truth owner。 |
| `01-架构设计.md` 数据一致性 | 定义性关系变化是正式 truth 到正式 truth 的强一致关系;分发语义不等同于 marketplace 交易、安装或履约事实。 | 需要关系完整性和分发边界口径,但不写事务或存储模型。 |
| `02_hld_step_04_code_subject_framework.md` | 给出 `MethodAssetRelationService`,`MethodAssetDistributionService`,`MethodAssetRelation`,`MethodAssetDistributionRef`。 | 这些是本组成部分的代码主体和 Step 6 对象线索基础。 |

Capability 拆解思考:

| Capability | 输入 | 输出 | 状态 / 副作用 | 外部协作 | 后续承接 |
|---|---|---|---|---|---|
| 定义性关系建立 | source definition ref;target definition ref;catalog context;formal version context | `MethodAssetRelation` 候选和关系语义线索 | 形成或更新关系 truth;不得由消费仓隐式创建 | 可引用外部摘要,但不依赖 marketplace 或下游同步成功 | Step 6 relation truth;Step 8 relation flow |
| 关系完整性保护 | 已有关系;definition / formal version 可引用语境;边界规则 | 关系有效 / 待确认 / 不可成立线索 | 防止孤立、越界或不一致关系进入正式消费语境 | 与定义、正式化和追溯组件接缝 | Step 6 relation policy;Step 9 relation state source |
| 分发语义承接 | formal version;consumption context;catalog / applicability context;关系语义 | `MethodAssetDistributionRef` / `DistributionContextRef` 候选 | 表达可进入分发或同步语境的定义性前提;不代表分发执行成功 | 可供下游或生态边界读取 | Step 6 distribution ref;Step 7 distribution query skeleton |
| 生态引用边界 | 分发语义;外围生态对象引用;marketplace / package context ref | ecosystem / marketplace reference 线索 | 只保存引用关系,不保存交易、安装或履约 truth | 与 marketplace / 外围包组织保持边界 | Step 6 ecosystem ref candidate;外围组件接缝 |
| 消费语境输出 | relation semantics;distribution context;formal version context | 可供受控消费使用的关系 / 分发线索 | 支撑下游按边界消费,不生成消费材料 | 输出给 `受控消费` | Step 7 consumption-facing skeleton;Step 8 consumption handoff |
| 关系 / 分发变化线索输出 | relation change;distribution context change;formal version change | relation / distribution change lineage | 支撑影响识别和追溯;不完成影响归因 | 输出给 `追溯与一致性保护` | Step 6 change lineage;Step 8 trace handoff |

对象发现线索:

| 对象线索 | 发现维度 | Step 6 处理要求 |
|---|---|---|
| `MethodAssetRelation` | Truth | 必须表达方法资产之间的定义性关系,不得从下游使用关系或 marketplace 引用反推。 |
| `MethodAssetDistributionRef` | Reference / Distribution | 指向分发或同步语境的定义性引用,不得等同于同步成功、上架、购买或安装记录。 |
| `DistributionContextRef` | Reference / Boundary candidate | 用于承接可分发语境和受控消费接缝,但不定义分发协议。 |
| `MethodAssetRelationPolicy` | Policy / Invariant candidate | 可表达关系完整性、越界关系禁止和关系变化显式化。 |
| `EcosystemObjectRef` / `MarketplaceObjectRef` | External reference candidate | 只作为生态对象引用线索,不得保存交易或履约正文。 |
| `RelationDistributionLineageRef` | Trace / Reference candidate | 用于把关系 / 分发变化交给追溯与一致性保护。 |

接缝判断:

| 接缝类型 | 判断 |
|---|---|
| inbound seam | 接收 definition ref、catalog context、formal version context、consumption context、允许的外部摘要 / 引用和生态对象引用线索。 |
| outbound seam | 向受控消费输出关系 / 分发语义线索;向追溯一致性输出关系 / 分发变化 lineage;向外围包与方法集组织输出可引用的分发语义。 |
| forbidden seam | 不保存 marketplace 定价、订单、购买、结算、安装、履约、生态上架流程正文、下游同步结果正文、事件 payload、topic、包导出实现或旧 publish/outbox 机制。 |

取舍:

- 本组成部分作为支撑组成部分保留,不并入 `受控消费`。原因是关系 truth 和分发语义有自己的数据归属,受控消费只使用其输出材料和语境线索。
- 本组成部分不并入 `外围包与方法集组织`。包 / 方法集是外围组织增强,而关系 / 分发语义是支撑受控消费和生态发现的定义性语义来源。
- `MethodAssetDistributionRef` 只表达分发语义和引用边界,不表达分发任务、同步状态、事件 schema、包导出格式或 marketplace 上架状态。
- marketplace 只作为外部生态引用边界出现;交易、安装、履约、订单、订阅和结算保持边界外。
- 关系变化和分发语义变化需要输出追溯线索,但完整影响识别和一致性保护仍归 `追溯与一致性保护`。

复杂度 / 越界检查:

- 未写字段、函数、协议 schema、状态枚举、状态迁移、数据库结构、事件 topic、payload、job、配置项、包格式或 marketplace 流程。
- 未把 marketplace 交易、生态上架、同步成功、下游运行使用关系或包导出实现写成本仓 truth。
- 未恢复旧 publish、snapshot、fingerprint、outbox 或事件同步主线。
- 下一模块只允许写“关系与分发语义:再写入”的职责、capability、代码主体、对象线索、接缝和停审记录;不得跳到外部摘要与引用或对象发现总表。

停审记录:

| 审查项 | 结论 | 说明 |
|---|---|---|
| 功能是否清楚 | pass | 已拆出定义性关系建立、关系完整性保护、分发语义承接、生态引用边界、消费语境输出和变化线索输出。 |
| 候选对象是否有功能来源 | pass | `MethodAssetRelation`,`MethodAssetDistributionRef`,`DistributionContextRef`,`MethodAssetRelationPolicy` 等均可回指 FR-ML-006、数据归属、BR-ML-008/011/016/021 和 Step 4。 |
| 接缝是否清楚 | pass | 已区分定义 / 正式化 / 受控消费输入,以及面向受控消费、追溯一致性、外围组织和生态引用的输出。 |
| 禁止事项是否清楚 | pass | 已排除 marketplace 交易履约、同步成功记录、生态上架流程、包导出实现、事件 payload/topic 和旧 publish/outbox 主线。 |
| 是否越界 | pass | 当前只写概要层思考,未下沉到对象字段、接口、状态机、协议、持久化、分发实现或 marketplace 流程。 |

next_allowed_action: 等待用户确认后进入“关系与分发语义:再写入”;不得跳到“外部摘要与引用:先思考”,也不得提前进入对象发现总表或正式 §5 回填。

---

### 0R.18 关系与分发语义:再写入

#### 本部分职责

关系与分发语义负责承载方法资产之间的定义性关系、关系完整性和面向受控消费 / 分发 / 生态发现的定义性语义。它承接 definition ref、catalog context、formal version context 和 consumption context,输出关系 truth、分发语义引用、生态引用边界和关系 / 分发变化线索。

本部分不拥有方法资产定义 truth、正式版本 truth 或受控消费材料,也不承担 marketplace 定价、订单、购买、结算、安装和履约。本部分输出的分发语义不等同于下游同步成功、生态上架状态、包导出格式或交易事实。

#### Capability 清单

| Capability | 输入 | 输出 | 状态 / 副作用 | 外部协作 | 后续承接 |
|---|---|---|---|---|---|
| 定义性关系建立 | source definition ref;target definition ref;catalog context;formal version context | `MethodAssetRelation` 候选和关系语义线索 | 形成或更新关系 truth;不得由消费仓隐式创建 | 可引用外部摘要,但不依赖 marketplace 或下游同步成功 | Step 6 relation truth;Step 8 relation flow |
| 关系完整性保护 | 已有关系;definition / formal version 可引用语境;边界规则 | 关系有效 / 待确认 / 不可成立线索 | 防止孤立、越界或不一致关系进入正式消费语境 | 与定义、正式化和追溯组件接缝 | Step 6 relation policy;Step 9 relation state source |
| 分发语义承接 | formal version;consumption context;catalog / applicability context;关系语义 | `MethodAssetDistributionRef` / `DistributionContextRef` 候选 | 表达可进入分发或同步语境的定义性前提;不代表分发执行成功 | 可供下游或生态边界读取 | Step 6 distribution ref;Step 7 distribution query skeleton |
| 生态引用边界 | 分发语义;外围生态对象引用;marketplace / package context ref | ecosystem / marketplace reference 线索 | 只保存引用关系,不保存交易、安装或履约 truth | 与 marketplace / 外围包组织保持边界 | Step 6 ecosystem ref candidate;外围组件接缝 |
| 消费语境输出 | relation semantics;distribution context;formal version context | 可供受控消费使用的关系 / 分发线索 | 支撑下游按边界消费,不生成消费材料 | 输出给 `受控消费` | Step 7 consumption-facing skeleton;Step 8 consumption handoff |
| 关系 / 分发变化线索输出 | relation change;distribution context change;formal version change | relation / distribution change lineage | 支撑影响识别和追溯;不完成影响归因 | 输出给 `追溯与一致性保护` | Step 6 change lineage;Step 8 trace handoff |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `MethodAssetRelationService` | Application service candidate | 编排定义性关系建立、关系变更和关系完整性保护。 | Step 7 接口骨架;Step 8 处理流 |
| `MethodAssetDistributionService` | Application service candidate | 编排分发语义承接、消费语境输出和生态引用边界。 | Step 7 接口骨架;Step 8 处理流 |
| `MethodAssetRelation` | Truth object candidate | 承载方法资产之间的定义性关系,不得由下游使用关系反推。 | Step 6 关键对象轮廓 |
| `MethodAssetDistributionRef` | Reference / distribution candidate | 指向分发或同步语境的定义性引用,不代表执行成功或交易事实。 | Step 6 关键对象轮廓 |
| `DistributionContextRef` | Reference / boundary candidate | 承接受控消费和分发语境之间的接缝。 | Step 6 候选筛选;Step 7 distribution skeleton |
| `RelationDistributionLineageRef` | Trace / reference candidate | 将关系 / 分发变化交给追溯与一致性保护。 | Step 6 候选筛选;追溯组件接缝 |

#### 本部分对象发现线索

| 对象线索 | 发现维度 | Step 6 处理要求 |
|---|---|---|
| `MethodAssetRelation` | Truth | 必须表达方法资产之间的定义性关系,不得从下游使用关系、同步结果或 marketplace 引用反推。 |
| `MethodAssetDistributionRef` | Reference / Distribution | 指向分发或同步语境的定义性引用,不得等同于同步成功、上架、购买或安装记录。 |
| `DistributionContextRef` | Reference / Boundary | 用于承接可分发语境和受控消费接缝,但不定义分发协议或事件格式。 |
| `MethodAssetRelationPolicy` | Policy / Invariant | 需要表达关系完整性、越界关系禁止和关系变化显式化。 |
| `EcosystemObjectRef` / `MarketplaceObjectRef` | External reference | 只作为生态对象引用线索,不得保存交易、订单、安装或履约正文。 |
| `RelationDistributionLineageRef` | Trace / Reference | 用于把关系 / 分发变化交给追溯与一致性保护。 |

#### 本部分不承担什么

| 不承担事项 | 原因 |
|---|---|
| 方法资产定义 truth 建立、目录语义维护和正式版本边界裁决 | 这些分别归 `方法资产定义与目录` 与 `正式化与版本`;本部分只消费其 ref / context。 |
| 受控消费材料生成、可用性表达和 Definition vs Use 防护 | 归 `受控消费`;本部分只输出关系 / 分发语义线索。 |
| 完整影响归因、审计解释和一致性保护 | 归 `追溯与一致性保护`;本部分只输出关系 / 分发变化 lineage。 |
| MethodPackage / MethodSet 的外围组织结构 | 归 `外围包与方法集组织`;本部分只提供其可引用的分发语义来源。 |
| marketplace 定价、订单、购买、订阅、结算、安装、上架流程和商业履约 | 这些属于 `L6-marketplace` 或外部生态边界,不得进入本仓 truth。 |
| 同步成功记录、包导出格式、事件 payload、topic、outbox、旧 publish 链路或分发 job | 这些是协议或实现机制,不是概要 Step 5 的业务组成部分职责。 |

#### 与其他组成部分的接缝

| 对接部分 | 本部分输入 / 输出 | 接缝约束 |
|---|---|---|
| 方法资产定义与目录 | 输入 definition ref、catalog context 和适用语境。 | 关系端点必须来自本仓定义 subject,不得由下游使用关系隐式创建。 |
| 正式化与版本 | 输入 formal version context 和版本变化线索。 | 分发语义不得绕过正式版本边界。 |
| 受控消费 | 输出关系 / 分发语义线索和 distribution context。 | 受控消费使用这些线索生成消费材料,但本组件不生成消费材料。 |
| 追溯与一致性保护 | 输出 relation / distribution change lineage。 | 完整影响归因和一致性保护由追溯组件完成。 |
| 外部摘要与引用 | 可输入外部摘要、生态对象 ref、marketplace object ref。 | 外部正文和交易履约正文不得进入本组件 truth。 |
| 外围包与方法集组织 | 输出可引用的分发语义来源。 | 包 / 方法集组织不得覆盖关系 truth 或分发语义 truth。 |

#### 本部分停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 功能是否清楚 | pass | 定义性关系建立、关系完整性保护、分发语义承接、生态引用边界、消费语境输出和变化线索输出已形成可承接 capability。 |
| 候选对象是否有功能来源 | pass | `MethodAssetRelation`,`MethodAssetDistributionRef`,`DistributionContextRef`,`MethodAssetRelationPolicy`,`RelationDistributionLineageRef` 等均回指 FR-ML-006、数据归属、BR-ML-008/011/016/021 和 Step 4。 |
| 接缝是否清楚 | pass | 已区分来自定义、正式化、受控消费、外部摘要和外围组织的输入输出。 |
| 禁止事项是否清楚 | pass | 已排除 marketplace 交易履约、同步成功记录、生态上架流程、包导出实现、事件 payload/topic 和旧 publish/outbox 主线。 |
| 是否越界 | pass | 未写字段、函数、协议 schema、状态枚举、状态迁移、数据库、topic、job、配置项、包格式或 marketplace 流程。 |

next_allowed_action: 等待用户确认后进入“外部摘要与引用:先思考”;不得跳到“外部摘要与引用:再写入”,也不得提前进入对象发现总表或正式 §5 回填。

---

### 0R.19 外部摘要与引用:先思考

问题回答:

- `外部摘要与引用` 回答“本仓如何安全承接治理、标准、ADR、artifact / archive、marketplace 和其他外部来源”,不是回答“外部系统如何执行、存储、裁决、归档或交易”。
- 本组成部分只保存可被本仓核心语义使用的 summary / ref / lineage,不保存外部正文、治理裁决正文、artifact 正文、证据文件、archive 正文、marketplace 交易履约正文或外部系统生命周期状态。
- 它是 `正式化与版本`、`追溯与一致性保护`、`关系与分发语义` 和 `受控消费` 的支撑接缝:外部来源必须先被摘要化或引用化,才能参与正式化依据、追溯解释、证据线索、分发语义或消费材料。
- 外部来源不可用、引用失效或摘要缺失时,本组件只能输出待承接、不可判定、引用失效或显式不可用口径,不得复制外部正文补齐,也不得改写已成立的 definition truth / formal version truth。
- 治理正式化依赖仍按条件型处理;本组件不得把 `L1-governance` 的 Gate 流程、policy enforce、裁决执行或治理运行状态迁入本仓。

来源依据:

| 来源 | 关键结论 | 对本组成部分的影响 |
|---|---|---|
| `00-需求文档.md` 数据归属 | 治理正式化结论摘要、外部标准来源摘要、治理依据引用、标准 / ADR 来源引用、外部正文引用、artifact / archive 引用、marketplace 生态对象引用均不拥有外部正文 truth。 | 本组件必须区分 summary、ref、external lifecycle 和 forbidden body。 |
| `00-需求文档.md` BR-ML-018 / 019 / 022 | artifact/archive 正文不归本仓;治理结论只能作为引用或摘要;证据线索必须承接审计语境。 | capability 需要覆盖正文禁止、治理依据承接和证据线索 handoff。 |
| `00-需求文档.md` NFR-ML-005 / 007 / 011 / 013 | 外部依赖不可用不得改写定义真相;不得越权拥有外部正文;证据线索需可追溯;重复查看不得制造第二 truth。 | 需要引用有效性、安全失败口径和幂等读取边界。 |
| `00-需求文档.md` 待确认事项 | 治理正式化结论保存 summary 还是 ref-only 仍需后续设计收束,但不得迁入治理执行正文。 | Step 5 可保留 summary / ref 两类对象线索,不在此裁决字段和模式。 |
| `01-架构设计.md` 职责边界 | 外部依据摘要或引用边界承接是本仓职责;治理、artifact、marketplace、标准等外部语义只能以摘要或引用支撑本仓定义语境。 | 本组件作为支撑组成部分独立存在,防止外部正文被塞进核心组件。 |
| `01-架构设计.md` 数据一致性 | 正式化依赖外部治理结论时是前置一致 / 引用有效性一致;外部正文关系是引用有效性一致;引用失效时不得复制正文补齐。 | 需要 external reference validity 与 hanging / unavailable 口径。 |
| `02_hld_step_04_code_subject_framework.md` | 给出 `ExternalBasisAcceptanceService`,`ExternalSourceSummary`,`ExternalSourceRef`,`ArtifactArchiveRef`。 | 这些是本组成部分的代码主体和 Step 6 对象线索基础。 |

Capability 拆解思考:

| Capability | 输入 | 输出 | 状态 / 副作用 | 外部协作 | 后续承接 |
|---|---|---|---|---|---|
| 外部依据接收与归一 | governance / standard / ADR / artifact / archive / marketplace source;允许的来源上下文 | 可被本仓使用的外部依据摘要或引用线索 | 形成 summary / ref 候选;不形成外部 truth 副本 | 通过正式外部接缝接入,不依赖外部正文入仓 | Step 6 `ExternalSourceSummary`;Step 8 external basis flow |
| 治理依据承接 | governance conclusion summary;governance basis ref;formalization context | `GovernanceBasisRef` / formalization basis 线索 | 支撑正式化前置或依据解释;不执行治理 | 与 `L1-governance` 条件型协作 | Step 6 basis summary/ref;正式化组件接缝 |
| 标准 / ADR 来源承接 | standard source;ADR source;methodology source context | standard / ADR source ref 和摘要线索 | 支撑定义来源、追溯、标准映射候选 | 不保存标准全文或 ADR 正文 | Step 6 source ref;追溯组件接缝 |
| artifact / archive 引用承接 | artifact ref;archive ref;work product context;evidence context | `ArtifactArchiveRef` 候选和 evidence lineage 线索 | 只保存引用关系;不拥有正文和生命周期 | 与 artifact/archive 边界协作 | Step 6 artifact/archive ref;证据线索接缝 |
| 外部引用有效性判断 | external source ref;引用可达性 / 可判定性;失效线索 | 有效、失效、待承接、不可判定或不可用口径 | 支撑正式化挂起、追溯不可用、消费材料安全降级 | 不复制外部正文补齐 | Step 6 validity view/policy;Step 9 状态来源 |
| 外部正文禁止边界 | external source type;body availability;使用意图 | body-free boundary decision | 阻止外部正文、治理执行、证据文件或交易正文进入本仓 | 与所有外部系统保持 ref-only / summary-only 边界 | Step 10 exception boundary;Step 6 invariant candidate |
| 外部来源追溯线索输出 | summary/ref;source context;引用变化线索 | external source lineage / audit handoff | 支撑追溯和审计,不定义证据 schema | 输出给 `追溯与一致性保护` | Step 6 lineage ref;Step 8 trace handoff |

对象发现线索:

| 对象线索 | 发现维度 | Step 6 处理要求 |
|---|---|---|
| `ExternalSourceSummary` | Summary | 承载外部依据安全摘要,不得保存外部正文或裁决执行正文。 |
| `ExternalSourceRef` | Reference | 指向外部正文或来源,但引用不代表正文入仓。 |
| `ArtifactArchiveRef` | Reference / Boundary | 指向 artifact / archive,不得拥有 artifact 正文、证据文件正文或 archive 生命周期。 |
| `GovernanceBasisRef` | Reference / Boundary candidate | 指向治理结论或依据,不得包含 Gate 流程、policy enforce 或治理运行状态。 |
| `StandardAdrSourceRef` | Reference candidate | 指向标准、ADR 或方法论来源,不得保存标准全文或 ADR 正文。 |
| `ExternalReferenceValidityView` | View / State source candidate | 可表达有效、失效、待承接、不可判定或不可用口径,但本 Step 不定义枚举。 |
| `ExternalBodyBoundaryPolicy` | Policy / Invariant candidate | 约束外部正文、证据文件、治理执行和交易履约正文不得入仓。 |
| `ExternalSourceLineageRef` | Trace / Reference candidate | 将外部来源摘要 / 引用变化交给追溯与一致性保护。 |

接缝判断:

| 接缝类型 | 判断 |
|---|---|
| inbound seam | 接收治理结论摘要 / 引用、标准 / ADR 来源、artifact / archive ref、marketplace 生态对象 ref、外部正文引用和来源上下文。 |
| outbound seam | 向正式化提供 basis summary/ref;向追溯一致性输出 source lineage / evidence lineage;向关系分发提供生态对象引用;向受控消费提供可进入消费材料的安全外部引用线索。 |
| forbidden seam | 不保存治理执行、Gate 流程、policy enforce、标准全文、ADR 正文、artifact 正文、证据文件正文、archive 正文、marketplace 交易履约正文、外部系统生命周期状态、事件 payload 或旧 snapshot/fingerprint/outbox。 |

取舍:

- 本组成部分保持独立,不并入 `正式化与版本`。原因是外部来源不仅服务正式化,也服务追溯、证据线索、关系分发和受控消费。
- 本组成部分也不并入 `追溯与一致性保护`。追溯组件解释影响和证据语境,外部摘要与引用组件负责把外部来源安全转成 summary/ref。
- `ExternalSourceSummary` 与 `ExternalSourceRef` 两类线索都保留到 Step 6,因为当前需求明确 summary vs ref-only 仍需后续收束。
- artifact / archive 只作为 ref;WorkProductDefinition 可作为方法资产定义主题,但 artifact 正文、证据文件和 archive 正文生命周期不进入本仓。
- 外部引用失效时只输出挂起、不可判定或不可用口径,不得复制外部正文、造本地副本或把外部 truth 迁入本仓。

复杂度 / 越界检查:

- 未写字段、函数、协议 schema、状态枚举、状态迁移、数据库结构、事件 topic、payload、job、配置项、证据 JSON、artifact schema 或报表字段。
- 未把治理执行、Gate 流程、policy enforce、标准全文、ADR 正文、artifact 正文、证据文件正文、archive 正文、marketplace 交易履约或外部生命周期状态迁入本仓。
- 未恢复旧 snapshot、fingerprint、outbox、publish topic 或旧外部同步主线。
- 下一模块只允许写“外部摘要与引用:再写入”的职责、capability、代码主体、对象线索、接缝和停审记录;不得跳到后台维护与收敛或对象发现总表。

停审记录:

| 审查项 | 结论 | 说明 |
|---|---|---|
| 功能是否清楚 | pass | 已拆出外部依据接收与归一、治理依据承接、标准 / ADR 来源承接、artifact / archive 引用承接、引用有效性判断、正文禁止边界和来源追溯线索输出。 |
| 候选对象是否有功能来源 | pass | `ExternalSourceSummary`,`ExternalSourceRef`,`ArtifactArchiveRef`,`GovernanceBasisRef`,`ExternalReferenceValidityView` 等均可回指数据归属、BR-ML-018/019/022、NFR-ML-005/007/011/013 和 Step 4。 |
| 接缝是否清楚 | pass | 已区分外部输入、正式化依据、追溯证据、关系分发生态引用、受控消费安全引用和正文禁止边界。 |
| 禁止事项是否清楚 | pass | 已排除治理执行、外部正文、证据文件正文、artifact/archive 生命周期、marketplace 交易履约、事件 payload 和旧 snapshot / fingerprint / outbox 主线。 |
| 是否越界 | pass | 当前只写概要层思考,未下沉到对象字段、接口、状态机、协议、持久化、证据 schema 或外部系统实现。 |

next_allowed_action: 等待用户确认后进入“外部摘要与引用:再写入”;不得跳到“后台维护与收敛:先思考”,也不得提前进入对象发现总表或正式 §5 回填。

---

### 0R.20 外部摘要与引用:再写入

#### 本部分职责

外部摘要与引用负责把治理、标准、ADR、artifact / archive、marketplace 和其他外部来源安全转化为本仓可使用的摘要、引用和来源线索。它为正式化依据、追溯解释、证据线索、关系分发和受控消费提供外部接缝,同时保护本仓不拥有外部正文、外部裁决执行或外部生命周期状态。

本部分不保存治理裁决正文、Gate 流程、policy enforce、标准全文、ADR 正文、artifact 正文、证据文件正文、archive 正文、marketplace 交易履约正文或外部系统运行状态。外部来源不可用、引用失效或摘要缺失时,本部分只能表达待承接、不可判定、引用失效或显式不可用口径,不得复制外部正文补齐,也不得改写 definition truth 或 formal version truth。

#### Capability 清单

| Capability | 输入 | 输出 | 状态 / 副作用 | 外部协作 | 后续承接 |
|---|---|---|---|---|---|
| 外部依据接收与归一 | governance / standard / ADR / artifact / archive / marketplace source;允许的来源上下文 | 可被本仓使用的外部依据摘要或引用线索 | 形成 summary / ref 候选;不形成外部 truth 副本 | 通过正式外部接缝接入,不依赖外部正文入仓 | Step 6 `ExternalSourceSummary`;Step 8 external basis flow |
| 治理依据承接 | governance conclusion summary;governance basis ref;formalization context | `GovernanceBasisRef` / formalization basis 线索 | 支撑正式化前置或依据解释;不执行治理 | 与 `L1-governance` 条件型协作 | Step 6 basis summary/ref;正式化组件接缝 |
| 标准 / ADR 来源承接 | standard source;ADR source;methodology source context | standard / ADR source ref 和摘要线索 | 支撑定义来源、追溯、标准映射候选 | 不保存标准全文或 ADR 正文 | Step 6 source ref;追溯组件接缝 |
| artifact / archive 引用承接 | artifact ref;archive ref;work product context;evidence context | `ArtifactArchiveRef` 候选和 evidence lineage 线索 | 只保存引用关系;不拥有正文和生命周期 | 与 artifact/archive 边界协作 | Step 6 artifact/archive ref;证据线索接缝 |
| 外部引用有效性判断 | external source ref;引用可达性 / 可判定性;失效线索 | 有效、失效、待承接、不可判定或不可用口径 | 支撑正式化挂起、追溯不可用、消费材料安全降级 | 不复制外部正文补齐 | Step 6 validity view/policy;Step 9 状态来源 |
| 外部正文禁止边界 | external source type;body availability;使用意图 | body-free boundary decision | 阻止外部正文、治理执行、证据文件或交易正文进入本仓 | 与所有外部系统保持 ref-only / summary-only 边界 | Step 10 exception boundary;Step 6 invariant candidate |
| 外部来源追溯线索输出 | summary/ref;source context;引用变化线索 | external source lineage / audit handoff | 支撑追溯和审计,不定义证据 schema | 输出给 `追溯与一致性保护` | Step 6 lineage ref;Step 8 trace handoff |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ExternalBasisAcceptanceService` | Application service candidate | 编排外部依据接收、归一、引用有效性判断和正文禁止边界。 | Step 7 接口骨架;Step 8 处理流 |
| `ExternalSourceSummary` | Summary candidate | 承载治理、标准、ADR、artifact、marketplace 等外部来源的安全摘要。 | Step 6 关键对象轮廓 |
| `ExternalSourceRef` | Reference candidate | 指向外部正文或外部来源,但不让正文进入本仓 truth。 | Step 6 关键对象轮廓 |
| `ArtifactArchiveRef` | Reference / boundary candidate | 指向 artifact / archive 或证据来源,不拥有 artifact 正文、证据文件正文或归档生命周期。 | Step 6 关键对象轮廓 |
| `GovernanceBasisRef` | Reference / boundary candidate | 指向治理结论或依据,不包含治理执行状态。 | Step 6 候选筛选;正式化接缝 |
| `ExternalReferenceValidityView` | View / state source candidate | 表达外部引用有效、失效、待承接、不可判定或不可用口径。 | Step 6 候选筛选;Step 9 状态来源反查 |

#### 本部分对象发现线索

| 对象线索 | 发现维度 | Step 6 处理要求 |
|---|---|---|
| `ExternalSourceSummary` | Summary | 承载外部依据安全摘要,不得保存外部正文、治理裁决执行或外部生命周期状态。 |
| `ExternalSourceRef` | Reference | 指向外部正文或来源,但引用不代表正文入仓。 |
| `ArtifactArchiveRef` | Reference / Boundary | 指向 artifact / archive,不得拥有 artifact 正文、证据文件正文或 archive 生命周期。 |
| `GovernanceBasisRef` | Reference / Boundary | 指向治理结论或依据,不得包含 Gate 流程、policy enforce 或治理运行状态。 |
| `StandardAdrSourceRef` | Reference | 指向标准、ADR 或方法论来源,不得保存标准全文或 ADR 正文。 |
| `ExternalReferenceValidityView` | View / State source | 可表达有效、失效、待承接、不可判定或不可用口径,但 Step 5 不定义枚举。 |
| `ExternalBodyBoundaryPolicy` | Policy / Invariant | 约束外部正文、证据文件、治理执行和交易履约正文不得入仓。 |
| `ExternalSourceLineageRef` | Trace / Reference | 将外部来源摘要 / 引用变化交给追溯与一致性保护。 |

#### 本部分不承担什么

| 不承担事项 | 原因 |
|---|---|
| 方法资产定义 truth、正式版本 truth、关系 truth 或消费材料的创建 | 这些分别归核心或支撑组件;本部分只提供外部 summary / ref 输入。 |
| 治理执行、Gate 流程、policy enforce、治理裁决正文或治理运行状态 | 这些属于 `L1-governance`;本仓只承接治理结论摘要或依据引用。 |
| 标准全文、ADR 正文、外部文档正文、示例正文或模板文件正文 | 本仓只保存来源摘要或引用关系,不拥有外部正文生命周期。 |
| artifact 正文、证据文件正文、archive 正文或制品生命周期状态 | 这些属于 artifact/archive 边界;本仓只保存 `ArtifactArchiveRef` 类引用。 |
| marketplace 定价、订单、购买、订阅、结算、安装和履约正文 | 这些属于 marketplace 或外部生态系统,不得进入本仓 truth。 |
| 证据 JSON、artifact schema、报表字段、事件 payload、topic、外部同步 job 或旧 snapshot / fingerprint / outbox | 这些是协议、测试或实现细节,不是概要 Step 5 的业务组成部分职责。 |

#### 与其他组成部分的接缝

| 对接部分 | 本部分输入 / 输出 | 接缝约束 |
|---|---|---|
| 正式化与版本 | 输出 governance basis、formalization basis summary/ref。 | 外部依据可支撑正式化,但不得把治理执行或外部正文迁入 formal version truth。 |
| 追溯与一致性保护 | 输出 external source lineage、evidence lineage 和引用有效性线索。 | 追溯组件解释证据语境;本组件只提供 summary/ref。 |
| 关系与分发语义 | 输出 ecosystem / marketplace object ref 和安全外部引用线索。 | marketplace 交易履约正文不进入关系 / 分发 truth。 |
| 受控消费 | 输出可进入消费材料的安全外部引用线索。 | 消费材料不得复制外部正文。 |
| 方法资产定义与目录 | 可输出定义来源相关标准 / ADR / 外部方法论摘要或引用。 | 外部来源不能替代本仓定义 truth。 |
| 后台维护与收敛 | 输出引用失效、待承接、不可判定或不可用线索。 | 维护路径只能推进引用有效性和材料收敛,不得复制正文补齐。 |

#### 本部分停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 功能是否清楚 | pass | 外部依据接收与归一、治理依据承接、标准 / ADR 来源承接、artifact / archive 引用承接、引用有效性判断、正文禁止边界和来源追溯线索已形成可承接 capability。 |
| 候选对象是否有功能来源 | pass | `ExternalSourceSummary`,`ExternalSourceRef`,`ArtifactArchiveRef`,`GovernanceBasisRef`,`ExternalReferenceValidityView`,`ExternalBodyBoundaryPolicy` 等均回指数据归属、BR-ML-018/019/022、NFR-ML-005/007/011/013 和 Step 4。 |
| 接缝是否清楚 | pass | 已区分外部输入、正式化依据、追溯证据、关系分发生态引用、受控消费安全引用、定义来源和后台维护线索。 |
| 禁止事项是否清楚 | pass | 已排除治理执行、外部正文、证据文件正文、artifact/archive 生命周期、marketplace 交易履约、事件 payload 和旧 snapshot / fingerprint / outbox 主线。 |
| 是否越界 | pass | 未写字段、函数、协议 schema、状态枚举、状态迁移、数据库、topic、job、配置项、证据 JSON、artifact schema 或外部系统实现。 |

next_allowed_action: 等待用户确认后进入“后台维护与收敛:先思考”;不得跳到“后台维护与收敛:再写入”,也不得提前进入对象发现总表或正式 §5 回填。

---

### 0R.21 后台维护与收敛:先思考

问题回答:

- `后台维护与收敛` 回答“已成立的定义、目录、正式版本、消费、追溯、外部引用和关系分发语义如何被刷新成稳定可读、可追溯、可恢复的派生材料”,不是回答“如何重新定义、修复或替代这些业务 truth”。
- 本组成部分是 support / operation 组成部分。它可以推进 read material、consumption material、trace material、external reference validity 和 recovery material 的收敛,但不得成为方法资产定义 truth、formal version truth、consumption truth、relation truth 或 external summary truth 的 owner。
- 它必须能表达 stale、pending、unavailable、recovery-needed、recovered 或仍待人工确认一类线索,让后续查询、追溯和验收可以解释材料状态;但这些状态线索不得反向改写核心对象。
- 它需要独立存在,因为 Step 6~9 后续会需要 material freshness、maintenance run、recovery handoff 和一致性检查的 owner;若不设 owner,实现阶段容易在 query、adapter 或 fake runtime 中私造刷新和修复规则。
- 本 Step 只裁决职责、capability、对象线索和接缝,不定义 job 名称、调度、重试策略、worker、队列、topic、outbox、cache/index、数据库、metric 名、告警规则或具体算法。

来源依据:

| 来源 | 关键结论 | 对本组成部分的影响 |
|---|---|---|
| `00-需求文档.md` 后台任务接口 | 方法资产一致性维护需支撑目录、变更感知、追溯材料和证据线维护。 | 本组件需要承接维护和收敛职责,不能把这些职责散落到读取或实现细节。 |
| `00-需求文档.md` US-ML-010 | 维护任务需要识别正式方法资产变化对既有消费的影响。 | capability 需要覆盖 consumption material / impact material 收敛,但不得自行生成消费 truth。 |
| `00-需求文档.md` NFR-ML-002 / 004 / 005 / 006 | 追溯查看、外部治理、候选下游和外围能力不可用时,核心定义、正式化、消费和一致性维护主路径仍要有效。 | 维护路径只能表达 pending / unavailable / stale,不得因外部失败改写 truth。 |
| `00-需求文档.md` NFR-ML-013 / 015 / 016 | 重复读取、重复变更感知和后台维护不得改变定义正文或制造重复正式语义;状态和边界错误应可观察,但 observability 不替代 truth。 | 需要幂等维护防护和可观察线索输出,并禁止 telemetry / audit material 成为第二 truth。 |
| `01-架构设计.md` 运行承载 | 后台维护承载目录维护、追溯材料维护、一致性检查和恢复补偿,但不固定 job 名、调度或重试。 | 本组件可作为运行承载 owner,但概要层不得下沉到实现机制。 |
| `01-架构设计.md` 数据一致性 | 正式 truth 到读取材料、消费材料和追溯材料是最终一致;材料可 stale / pending / unavailable,不得重写 truth。 | capability 必须强调派生材料刷新和显式状态,而不是同步强制成功。 |
| `02_hld_step_04_code_subject_framework.md` | 给出 `MethodAssetMaintenanceService`,`ReadMaterialRefreshTask`,`TraceMaterialRefreshTask`,`ConsistencyRecoveryTask`。 | 这些是本组成部分代码主体和 Step 6 对象线索的主要来源。 |

Capability 拆解思考:

| Capability | 输入 | 输出 | 状态 / 副作用 | 外部协作 | 后续承接 |
|---|---|---|---|---|---|
| 正式读取材料刷新 | definition / catalog / formal version / relation / external summary truth;refresh scope | 可读材料刷新结果和 freshness 线索 | 推进派生 read material 收敛;不修改来源 truth | 无需在本 Step 固定 worker 或调度 | Step 6 `ReadMaterialFreshnessView`;Step 8 refresh flow |
| 消费材料收敛 | formal version;consumption decision;impact summary;downstream availability line | consumption material / impact material 收敛线索 | 暴露 stale / pending / unavailable;不重算消费授权 truth | 与下游可用性或影响回报保持松耦合 | Step 6 convergence view;受控消费接缝 |
| 追溯 / 证据线索材料刷新 | trace lineage;evidence context;external source lineage;impact material | trace material 和 evidence line material 刷新线索 | 维护可追溯材料;不定义证据 JSON 或报表字段 | 与 artifact / archive 只通过 ref / summary 协作 | Step 6 trace material candidate;Step 8 trace refresh |
| 外部引用有效性收敛 | external source ref;validity line;unavailable / hanging signal | 引用有效、失效、待承接、不可判定或不可用线索 | 推进 external ref validity material;不复制外部正文 | 外部系统不可用时安全降级 | 外部摘要与引用接缝;Step 9 状态来源 |
| 一致性恢复承接 | consistency gap;material freshness gap;reference validity gap;impact mismatch line | recovery handoff / recovery progress 线索 | 推进恢复收敛或等待确认;不自动修复业务 truth | 必要时只暴露待确认,不执行外部裁决 | Step 6 `MaintenanceRecoveryRef`;Step 10 异常边界 |
| 维护可观察线索输出 | maintenance attempt;refresh scope;result summary;boundary error line | maintenance progress / observation marker | 让维护状态可审计、可解释;不形成 telemetry truth | 可被审计或验收读取,但不定义指标 schema | Step 6 `MaintenanceProgressView`;Step 13 风险审计 |
| 幂等维护防护 | repeated refresh request;重复变更感知;既有材料状态 | 幂等维护判断和重复执行保护线索 | 防止重复维护制造第二正式语义或重复材料 | 不依赖具体锁、队列或调度算法 | Step 6 policy / invariant candidate;Step 9 状态反查 |

对象发现线索:

| 对象线索 | 发现维度 | Step 6 处理要求 |
|---|---|---|
| `MethodAssetMaintenanceService` | Application service candidate | 编排读取材料、消费材料、追溯材料、引用有效性和恢复收敛;不得拥有业务 truth。 |
| `ReadMaterialRefreshTask` | Task / Operation candidate | 表达读取材料刷新任务边界,不得定义调度、worker 或 cache/index 实现。 |
| `TraceMaterialRefreshTask` | Task / Operation candidate | 表达追溯和证据线索材料刷新边界,不得定义证据 artifact schema。 |
| `ConsistencyRecoveryTask` | Task / Recovery candidate | 表达一致性恢复承接,不得自动修复定义、正式化、消费或关系 truth。 |
| `MaintenanceRunRef` | Reference candidate | 指向维护运行或批次线索,但 Step 5 不定义字段、状态机或执行日志格式。 |
| `MaintenanceProgressView` | View / State source candidate | 可表达 pending、stale、unavailable、recovery-needed、recovered 等读取线索,但本 Step 不定义枚举。 |
| `ReadMaterialFreshnessView` | View / Freshness candidate | 承接 read material freshness,不得替代正式 truth 或查询 cache 实现。 |
| `MaintenanceRecoveryRef` | Recovery / Reference candidate | 将一致性缺口和恢复 handoff 暴露给后续流程或验收。 |
| `MaintenanceObservationMarker` | Observation candidate | 表达维护可观察线索,不得成为 telemetry / audit 第二 truth。 |
| `MaterialConvergencePolicy` | Policy / Invariant candidate | 约束维护只推进派生材料收敛,不越权改写核心 truth。 |

接缝判断:

| 接缝类型 | 判断 |
|---|---|
| inbound seam | 接收来自方法资产定义与目录、正式化与版本、受控消费、追溯一致性、关系分发和外部摘要与引用的正式 truth、summary/ref、impact line、freshness gap 和待恢复线索。 |
| outbound seam | 输出 read/consumption/trace/reference material freshness、pending / stale / unavailable / recovery handoff、maintenance progress 和 observation marker,供查询、追溯、异常边界和验收解释使用。 |
| forbidden seam | 不创建、修复、覆盖或重算 definition truth、formal version truth、controlled consumption truth、relation/distribution truth、external summary truth;不定义 scheduler、retry、worker、queue、topic、outbox、cache/index、DB、metric、alert 或具体恢复算法。 |

取舍:

- 本组成部分保持独立,不并入 `追溯与一致性保护`。追溯组件负责业务解释和证据语境,后台维护负责派生材料和恢复线索收敛。
- 本组成部分也不并入 `方法资产定义与目录` 或 `正式化与版本`。维护可以读取这些 truth 并刷新材料,但不得成为定义或正式化的创建路径。
- `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask` 和 `ConsistencyRecoveryTask` 作为候选保留,因为 Step 4 已给出运行承载;但 Step 5 只表达任务语义,不表达 worker 实现。
- `MaintenanceProgressView` 与 `MaintenanceObservationMarker` 只作为可观察线索候选,不允许演变成独立审计 truth、telemetry truth 或验收报告 schema。
- 外部引用失效、下游不可用或材料缺失时,维护路径只能暴露 pending / unavailable / recovery-needed,不得复制外部正文、私造消费影响或修补核心 truth。

复杂度 / 越界检查:

- 未写字段、函数签名、协议 schema、状态枚举、状态迁移、数据库、缓存、索引、事件 payload、topic、配置项、metric、告警规则、证据 JSON 或报表字段。
- 未定义 job 调度、worker 编排、重试策略、锁、队列、并发控制或恢复算法。
- 未把后台维护升级为业务 truth owner,也未让维护路径绕过定义、正式化、消费、关系或外部摘要边界。
- 未恢复旧 `MethodContent`、`DefinitionSnapshot`、`fingerprint`、`outbox`、publish-based flow 或旧运行同步主线。
- 下一模块只允许写“后台维护与收敛:再写入”的职责、capability、代码主体、对象线索、接缝和停审记录;不得跳到外围包与方法集组织或对象发现总表。

停审记录:

| 审查项 | 结论 | 说明 |
|---|---|---|
| 功能是否清楚 | pass | 已拆出读取材料刷新、消费材料收敛、追溯 / 证据线索材料刷新、外部引用有效性收敛、一致性恢复承接、维护可观察线索和幂等维护防护。 |
| 候选对象是否有功能来源 | pass | `MethodAssetMaintenanceService`,`ReadMaterialRefreshTask`,`TraceMaterialRefreshTask`,`ConsistencyRecoveryTask`,`MaintenanceProgressView` 等均回指 00 后台维护需求、NFR 和 Step 4。 |
| 接缝是否清楚 | pass | 已区分来自核心 truth / summary/ref / impact / freshness gap 的输入,以及面向查询、追溯、异常、验收的派生材料输出。 |
| 禁止事项是否清楚 | pass | 已排除业务 truth 修复、外部正文复制、消费授权重算、job 调度、topic/outbox、cache/index、DB、metric 和恢复算法。 |
| 是否越界 | pass | 当前只写概要层思考,未下沉到对象字段、接口、流程细节、状态机、协议、持久化、证据 schema 或运维实现。 |

next_allowed_action: 等待用户确认后进入“后台维护与收敛:再写入”;不得跳到“外围包与方法集组织:先思考”,也不得提前进入对象发现总表或正式 §5 回填。

---

### 0R.22 后台维护与收敛:再写入

#### 本部分职责

后台维护与收敛负责维护由正式 truth 和安全 summary/ref 派生出来的读取材料、消费材料、追溯材料、外部引用有效性材料和一致性恢复线索。它让已经成立的方法资产语义能够被稳定读取、追溯、解释和恢复,并在材料 stale、pending、unavailable 或需要恢复时给出明确线索。

本部分是 support / operation 组成部分,不创建、修复、覆盖或重算方法资产定义 truth、正式版本 truth、受控消费 truth、关系 / 分发 truth 或外部摘要 truth。它也不定义 job 调度、worker、重试策略、队列、topic、outbox、cache/index、数据库、指标、告警或具体恢复算法。

#### Capability 清单

| Capability | 输入 | 输出 | 状态 / 副作用 | 外部协作 | 后续承接 |
|---|---|---|---|---|---|
| 正式读取材料刷新 | definition / catalog / formal version / relation / external summary truth;refresh scope | 可读材料刷新结果和 freshness 线索 | 推进派生 read material 收敛;不修改来源 truth | 不固定 worker、调度或 cache/index | Step 6 `ReadMaterialFreshnessView`;Step 8 refresh flow |
| 消费材料收敛 | formal version;consumption decision;impact summary;downstream availability line | consumption material / impact material 收敛线索 | 暴露 stale / pending / unavailable;不重算消费授权 truth | 与下游可用性或影响回报保持松耦合 | Step 6 convergence view;受控消费接缝 |
| 追溯 / 证据线索材料刷新 | trace lineage;evidence context;external source lineage;impact material | trace material 和 evidence line material 刷新线索 | 维护可追溯材料;不定义证据 JSON 或报表字段 | 与 artifact / archive 只通过 ref / summary 协作 | Step 6 trace material candidate;Step 8 trace refresh |
| 外部引用有效性收敛 | external source ref;validity line;unavailable / hanging signal | 引用有效、失效、待承接、不可判定或不可用线索 | 推进 external ref validity material;不复制外部正文 | 外部系统不可用时安全降级 | 外部摘要与引用接缝;Step 9 状态来源 |
| 一致性恢复承接 | consistency gap;material freshness gap;reference validity gap;impact mismatch line | recovery handoff / recovery progress 线索 | 推进恢复收敛或等待确认;不自动修复业务 truth | 必要时只暴露待确认,不执行外部裁决 | Step 6 `MaintenanceRecoveryRef`;Step 10 异常边界 |
| 维护可观察线索输出 | maintenance attempt;refresh scope;result summary;boundary error line | maintenance progress / observation marker | 让维护状态可审计、可解释;不形成 telemetry truth | 可被审计或验收读取,但不定义指标 schema | Step 6 `MaintenanceProgressView`;Step 13 风险审计 |
| 幂等维护防护 | repeated refresh request;重复变更感知;既有材料状态 | 幂等维护判断和重复执行保护线索 | 防止重复维护制造第二正式语义或重复材料 | 不依赖具体锁、队列或调度算法 | Step 6 policy / invariant candidate;Step 9 状态反查 |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `MethodAssetMaintenanceService` | Application service candidate | 编排读取材料、消费材料、追溯材料、外部引用有效性和一致性恢复收敛。 | Step 7 接口骨架;Step 8 处理流 |
| `ReadMaterialRefreshTask` | Task / operation candidate | 表达正式读取材料和消费材料刷新的任务边界。 | Step 6 候选筛选;Step 8 maintenance flow |
| `TraceMaterialRefreshTask` | Task / operation candidate | 表达追溯材料和证据线索材料刷新的任务边界。 | Step 6 候选筛选;Step 8 trace refresh |
| `ConsistencyRecoveryTask` | Task / recovery candidate | 承接材料缺失、引用失效、影响不一致或恢复待确认线索。 | Step 6 候选筛选;Step 10 异常边界 |
| `MaintenanceRunRef` | Reference candidate | 指向维护运行或批次线索,用于后续可追溯和验收解释。 | Step 6 关键对象轮廓 |
| `MaintenanceProgressView` | View / state source candidate | 表达维护进度、材料 freshness 和恢复线索的读取视图。 | Step 6 关键对象轮廓;Step 9 状态来源 |

#### 本部分对象发现线索

| 对象线索 | 发现维度 | Step 6 处理要求 |
|---|---|---|
| `MethodAssetMaintenanceService` | Application service | 只能编排派生材料和恢复线索收敛,不得拥有业务 truth。 |
| `ReadMaterialRefreshTask` | Task / Operation | 表达读取材料刷新边界,不得定义调度、worker、cache 或 index 实现。 |
| `TraceMaterialRefreshTask` | Task / Operation | 表达追溯和证据线索材料刷新边界,不得定义证据 artifact schema。 |
| `ConsistencyRecoveryTask` | Task / Recovery | 表达一致性恢复承接,不得自动修复定义、正式化、消费或关系 truth。 |
| `MaintenanceRunRef` | Reference | 指向维护运行或批次线索,但 Step 5 不定义字段、状态机或执行日志格式。 |
| `MaintenanceProgressView` | View / State source | 可表达 pending、stale、unavailable、recovery-needed、recovered 等读取线索,但 Step 5 不定义枚举。 |
| `ReadMaterialFreshnessView` | View / Freshness | 承接 read material freshness,不得替代正式 truth 或查询 cache 实现。 |
| `MaintenanceRecoveryRef` | Recovery / Reference | 将一致性缺口和恢复 handoff 暴露给后续流程或验收。 |
| `MaintenanceObservationMarker` | Observation | 表达维护可观察线索,不得成为 telemetry / audit 第二 truth。 |
| `MaterialConvergencePolicy` | Policy / Invariant | 约束维护只推进派生材料收敛,不越权改写核心 truth。 |

#### 本部分不承担什么

| 不承担事项 | 原因 |
|---|---|
| 创建、修复、覆盖或重算方法资产定义 truth、正式版本 truth、受控消费 truth、关系 / 分发 truth 或外部摘要 truth | 这些 truth 均已有对应组成部分 owner;后台维护只能读取并刷新派生材料。 |
| 用后台恢复绕过定义、正式化、版本、消费、关系或外部摘要边界 | 维护路径只承接恢复线索和材料收敛,不得成为第二业务写路径。 |
| 复制外部正文、artifact 正文、证据文件正文、治理裁决正文或 marketplace 交易履约正文 | 外部正文和外部生命周期不属于本仓 truth。 |
| 定义 job 调度、worker、重试策略、锁、队列、topic、outbox、cache/index、数据库、metric 或告警规则 | 这些属于详细设计、配置、实施或运维层,不是概要 Step 5 职责。 |
| 生成证据 JSON、报表字段、artifact schema、状态枚举或状态迁移全集 | 这些应在测试方案、验收、详细设计或状态章节中由正式来源承接。 |
| 通过 observability、telemetry、audit material 或 maintenance log 替代业务 truth | 可观察材料只能解释维护状态,不得成为第二真相源。 |

#### 与其他组成部分的接缝

| 对接部分 | 本部分输入 / 输出 | 接缝约束 |
|---|---|---|
| 方法资产定义与目录 | 读取 definition / catalog truth,输出读取材料 freshness 和目录材料收敛线索。 | 不创建、修复或覆盖定义 truth。 |
| 正式化与版本 | 读取 formal version truth,输出正式版本读取材料 freshness。 | 不改变正式化结果、版本语义或版本演进关系。 |
| 受控消费 | 读取 consumption decision / impact summary,输出消费材料收敛和 stale / pending 线索。 | 不重算授权、不扩大消费范围、不绕过正式化。 |
| 追溯与一致性保护 | 接收 trace / evidence / impact gap,输出 trace material freshness 和 recovery handoff。 | 追溯业务解释归追溯组件;维护只推进材料和恢复线索。 |
| 关系与分发语义 | 读取 relation / distribution truth,输出相关 read material freshness。 | 不创建或修改关系 truth、分发语义或生态引用。 |
| 外部摘要与引用 | 接收 external ref validity gap、unavailable 和 hanging 线索,输出引用有效性收敛状态。 | 不复制外部正文,不替代外部系统生命周期。 |
| 外围包与方法集组织 | 可刷新外围读取材料或暴露外围 pending/unavailable。 | 外围材料不可用不得影响核心闭环成立。 |

#### 本部分停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 功能是否清楚 | pass | 已覆盖读取材料刷新、消费材料收敛、追溯 / 证据线索材料刷新、外部引用有效性收敛、一致性恢复承接、维护可观察线索和幂等维护防护。 |
| 候选对象是否有功能来源 | pass | `MethodAssetMaintenanceService`,`ReadMaterialRefreshTask`,`TraceMaterialRefreshTask`,`ConsistencyRecoveryTask`,`MaintenanceProgressView` 等均回指 00 后台维护需求、NFR 和 Step 4。 |
| 接缝是否清楚 | pass | 已区分来自核心 truth / summary/ref / impact / freshness gap 的输入,以及面向查询、追溯、异常、验收的派生材料输出。 |
| 禁止事项是否清楚 | pass | 已排除业务 truth 修复、外部正文复制、消费授权重算、job 调度、topic/outbox、cache/index、DB、metric 和恢复算法。 |
| 是否越界 | pass | 未写字段、函数、协议 schema、状态枚举、状态迁移、持久化、配置、证据 schema、报表字段或运维实现。 |

next_allowed_action: 等待用户确认后进入“外围包与方法集组织:先思考”;不得跳到“外围包与方法集组织:再写入”,也不得提前进入对象发现总表或正式 §5 回填。

---

### 0R.23 外围包与方法集组织:先思考

问题回答:

- `外围包与方法集组织` 回答“已经成立的方法资产如何被外围组织成资产包、组织级方法集和生态发现语境”,不是回答“核心方法资产如何定义、正式化、消费或被 marketplace 交易履约”。
- 本组成部分位于核心闭环之外。它只能围绕已成立的 definition truth、formal version truth、relation / distribution semantics 和外部 summary/ref 组织外围语义,不得反向规定核心方法资产定义、正式版本、受控消费边界或追溯语义。
- `MethodPackage` / `MethodSetAssembly` 可以作为外围组织语义进入 Step 6 候选,但必须标注为 peripheral;若核心资产引用不成立、正式版本不可用或关系分发语义不满足,外围组织只能 pending / invalid / unavailable,不得独立漂移成第二方法资产来源。
- marketplace 生态发现只保留上下文、引用或分发语义,不得进入定价、订单、购买、订阅、结算、安装、履约、上架审核执行或 UI 渲染体验。
- 当前 Step 只裁决外围组件的职责、capability、对象线索和接缝,不定义 package 文件格式、安装包、artifact 导出、marketplace listing schema、SDK / console API、组织配置算法或高级匹配策略。

来源依据:

| 来源 | 关键结论 | 对本组成部分的影响 |
|---|---|---|
| `00-需求文档.md` US-ML-E-001 / FR-ML-E-001 | 可按资产包或方法集组织相关方法资产,增强组织级复用和采用便利性。 | 需要保留 package / method set 组织能力,但作为外围增强。 |
| `00-需求文档.md` US-ML-E-002 / FR-ML-E-002 | 可支持方法资产包发现和评估语境,但不处理 marketplace 交易流程。 | 需要生态发现语境,同时排除交易、安装和履约。 |
| `00-需求文档.md` BR-ML-016 / BR-ML-E-001 | `L6-marketplace` 负责商业交易履约;外围增强不得改变核心方法资产定义真相边界。 | 本组件不得拥有 marketplace 交易 truth,也不得覆盖核心 truth。 |
| `00-需求文档.md` 数据归属 | 方法资产包组织语义、组织级方法集组装语义若进入范围,由本仓拥有外围增强 truth;marketplace 生态对象只保存引用。 | Step 6 可发现外围组织对象和 marketplace context ref,但必须与核心 truth 分层。 |
| `00-需求文档.md` NFR-ML-004 / 005 | 外围增强、marketplace、console、artifact 等不可用时,核心定义、正式化、消费和追溯仍应成立。 | 本组件必须显式不阻塞核心闭环,并支持外围 unavailable / pending 口径。 |
| `01-架构设计.md` 子域和数据所有权 | 方法资产包与方法集组织语义是支撑子域 / 外围增强,围绕核心定义组织,不作为核心闭环前置。 | 本组件可以保留在 Step 5 末尾,但不得进入核心主链中间。 |
| `01-架构设计.md` 系统上下文 / 演进路线 | `L6-marketplace`、console / SDK、artifact 当前为外围或候选关系;外围包 / 方法集组织阶段是后续演进。 | 当前只写外围位置和边界,不展开外部系统实现。 |
| `02_hld_step_04_code_subject_framework.md` | 给出 `MethodPackageService`,`MethodSetAssemblyService`,`MethodPackage`,`MethodSetAssembly`,并明确 `8` 是外围增强位置。 | 这些是本组成部分代码主体和 Step 6 对象线索基础。 |

Capability 拆解思考:

| Capability | 输入 | 输出 | 状态 / 副作用 | 外部协作 | 后续承接 |
|---|---|---|---|---|---|
| 方法资产包组织 | 已成立方法资产定义、正式版本、关系 / 分发语义、外部 summary/ref | 方法资产包组织语义和 package view 线索 | 形成外围组织 truth 候选;不创建核心资产 truth | 可引用 marketplace / ecosystem context,不执行交易 | Step 6 `MethodPackage`;Step 8 package organization flow |
| 组织级方法集组装 | 多个正式方法资产、方法包、组织采用语境、允许的分发语义 | 组织级方法集组装语义和 assembly view 线索 | 表达外围组合关系;不扩大受控消费授权 | 不依赖 UI / SDK / 组织配置实现 | Step 6 `MethodSetAssembly`;Step 8 assembly flow |
| 生态发现语境承接 | distribution context;marketplace / ecosystem object ref;external source ref | 生态发现上下文、可发现性线索或 marketplace context ref | 支撑发现和评估;不保存 marketplace listing / 交易 truth | 与 `L6-marketplace` 只保持外围引用或消费关系 | Step 6 `MarketplaceContextRef`;关系分发接缝 |
| 外围采用评估材料 | package / set summary;formal version refs;relation constraints;trace/evidence line | 可被评估的外围摘要或 adoption assessment view 线索 | 支撑评估,不等同于正式消费授权 | 可被 console / SDK 读取,但不定义其 API | Step 6 peripheral view candidate;受控消费接缝 |
| 外围引用有效性保护 | package/set 引用的 asset ref、version ref、distribution ref、external ref | pending / invalid / unavailable / valid 线索 | 防止外围组织引用漂移为第二 truth | 外部引用失效时安全降级 | Step 9 状态来源;后台维护接缝 |
| 外围边界隔离 | package / method set / marketplace / plugin / configuration 使用意图 | boundary decision 和 forbidden scope 线索 | 阻止外围增强成为核心前置 | 与 marketplace、artifact、console、SDK 保持边界 | Step 10 exception boundary;Step 13 风险审计 |
| 外围演进承接 | MethodPlugin / MethodConfiguration、高级 ViewProfile、AIPolicy override、标准映射增强候选 | 后续增强挂起或候选线索 | 保留演进入口,不进入当前核心主线 | 仅作为 future / peripheral context | Step 13 open questions;后续版本演进 |

对象发现线索:

| 对象线索 | 发现维度 | Step 6 处理要求 |
|---|---|---|
| `MethodPackageService` | Application service candidate | 编排外围资产包组织,不得创建或覆盖核心方法资产 truth。 |
| `MethodSetAssemblyService` | Application service candidate | 编排组织级方法集组装,不得扩大正式消费授权或替代受控消费。 |
| `MethodPackage` | Peripheral truth candidate | 表达围绕正式方法资产的包组织语义,不是 marketplace listing、安装包或 artifact 包。 |
| `MethodSetAssembly` | Peripheral truth candidate | 表达组织级方法集组装语义,不是组织运行配置、UI 视图或 SDK preset。 |
| `MethodPackageView` | View candidate | 表达外围包读取材料,不得成为核心定义读取材料替代物。 |
| `MethodSetAssemblyView` | View candidate | 表达外围方法集读取材料,不得成为正式消费决策替代物。 |
| `MethodPackageRef` | Reference candidate | 指向外围包组织语义,不代表外部安装包或交易对象。 |
| `MethodSetAssemblyRef` | Reference candidate | 指向组织级方法集组装语义,不代表组织运行实例。 |
| `MarketplaceContextRef` | Reference / Boundary candidate | 指向 marketplace 或生态对象上下文,不得包含定价、订单、安装或履约正文。 |
| `PackageCompositionRule` | Policy / Rule candidate | 约束 package 只能引用已成立核心资产和允许的分发语义。 |
| `MethodSetAssemblyRule` | Policy / Rule candidate | 约束 method set 组装不反向定义核心 truth、不扩大消费授权。 |
| `PeripheralAdoptionAssessmentView` | View candidate | 支撑外围评估语境,不等同于受控消费授权或治理裁决。 |

接缝判断:

| 接缝类型 | 判断 |
|---|---|
| inbound seam | 接收核心方法资产定义、正式版本、关系 / 分发语义、外部摘要 / 引用、追溯线索和外围采用语境。 |
| outbound seam | 输出外围包组织语义、方法集组装语义、生态发现上下文、外围读取视图、外围引用有效性和待承接线索。 |
| forbidden seam | 不输出核心 definition truth、formal version truth、controlled consumption truth、relation truth 或 governance truth;不保存 marketplace 交易履约、artifact 包正文、安装记录、UI / SDK preset、组织运行配置、事件 payload、topic、package 文件格式或导出实现。 |

取舍:

- 本组成部分保留在 Step 5 总表末尾,因为 00 / 01 都给出 package、method set 和生态发现的外围增强位置;完全删除会让 Step 6~9 缺少外围对象边界来源。
- 它不进入核心主链。核心闭环仍由定义与目录、正式化与版本、受控消费、追溯一致性、关系分发、外部摘要和后台维护支撑。
- `MethodPackage` 和 `MethodSetAssembly` 保留为外围组织 truth 候选,但必须以已成立核心资产为输入;核心资产引用不成立时,外围组织只能不可用或待承接。
- marketplace 只保留 `MarketplaceContextRef` / ecosystem context 线索,不进入 listing、交易、购买、结算、安装和履约。
- MethodPlugin / MethodConfiguration、高级 ViewProfile、AIPolicy override、标准映射增强只作为外围演进线索,当前 Step 不展开规则、字段或接口。

复杂度 / 越界检查:

- 未写字段、函数、协议 schema、状态枚举、状态迁移、DDL、package 文件格式、artifact 导出格式、marketplace listing schema、SDK / console API、配置键或验收报表字段。
- 未把 marketplace 定价、订单、购买、结算、安装、履约、上架审核执行、UI 渲染或组织运行实例迁入本仓。
- 未让外围包 / 方法集成为核心闭环成立前置,也未让外围对象覆盖核心定义、正式版本、受控消费、追溯或关系分发 truth。
- 未恢复旧 P1 技术包、MethodContent、DefinitionSnapshot、fingerprint、outbox、publish-based flow 或安装包实现主线。
- 下一模块只允许写“外围包与方法集组织:再写入”的职责、capability、代码主体、对象线索、接缝和停审记录;不得提前进入各部分交互总图、对象发现维度总表或正式 §5 回填。

停审记录:

| 审查项 | 结论 | 说明 |
|---|---|---|
| 功能是否清楚 | pass | 已拆出方法资产包组织、组织级方法集组装、生态发现语境、外围采用评估材料、外围引用有效性保护、外围边界隔离和外围演进承接。 |
| 候选对象是否有功能来源 | pass | `MethodPackageService`,`MethodSetAssemblyService`,`MethodPackage`,`MethodSetAssembly`,`MarketplaceContextRef` 等均回指 FR-ML-E-001/002、BR-ML-E-001、数据归属和 Step 4。 |
| 接缝是否清楚 | pass | 已区分核心资产输入、关系分发输入、外部引用输入、生态发现输出、外围读取输出和禁止的 marketplace / artifact / UI / SDK 实现面。 |
| 禁止事项是否清楚 | pass | 已排除 marketplace 交易履约、安装包、artifact 包正文、组织运行配置、核心 truth 覆盖、受控消费授权重算和旧发布同步主线。 |
| 是否越界 | pass | 当前只写概要层思考,未下沉到字段、接口、流程细节、状态机、协议、持久化、配置、package 格式或外部系统实现。 |

next_allowed_action: 等待用户确认后进入“外围包与方法集组织:再写入”;不得跳到各部分交互总图、对象发现维度总表或正式 §5 回填。

---

### 0R.24 外围包与方法集组织:再写入

#### 本部分职责

外围包与方法集组织负责在核心闭环之外表达方法资产包、组织级方法集和生态发现语境。它围绕已经成立的方法资产定义、正式版本、关系 / 分发语义、外部摘要和追溯线索组织一组可被采用、评估或发现的方法资产,让外围复用和生态分发有稳定语义来源。

本部分不作为核心闭环成立前置,也不覆盖或替代核心方法资产定义 truth、formal version truth、受控消费 truth、关系 / 分发 truth 或追溯语义。它不承担 marketplace 定价、订单、购买、结算、安装、履约、上架审核执行、artifact 包正文、UI 渲染或 SDK preset。

#### Capability 清单

| Capability | 输入 | 输出 | 状态 / 副作用 | 外部协作 | 后续承接 |
|---|---|---|---|---|---|
| 方法资产包组织 | 已成立方法资产定义、正式版本、关系 / 分发语义、外部 summary/ref | 方法资产包组织语义和 package view 线索 | 形成外围组织 truth 候选;不创建核心资产 truth | 可引用 marketplace / ecosystem context,不执行交易 | Step 6 `MethodPackage`;Step 8 package organization flow |
| 组织级方法集组装 | 多个正式方法资产、方法包、组织采用语境、允许的分发语义 | 组织级方法集组装语义和 assembly view 线索 | 表达外围组合关系;不扩大受控消费授权 | 不依赖 UI / SDK / 组织配置实现 | Step 6 `MethodSetAssembly`;Step 8 assembly flow |
| 生态发现语境承接 | distribution context;marketplace / ecosystem object ref;external source ref | 生态发现上下文、可发现性线索或 marketplace context ref | 支撑发现和评估;不保存 marketplace listing / 交易 truth | 与 `L6-marketplace` 只保持外围引用或消费关系 | Step 6 `MarketplaceContextRef`;关系分发接缝 |
| 外围采用评估材料 | package / set summary;formal version refs;relation constraints;trace/evidence line | 可被评估的外围摘要或 adoption assessment view 线索 | 支撑评估,不等同于正式消费授权 | 可被 console / SDK 读取,但不定义其 API | Step 6 peripheral view candidate;受控消费接缝 |
| 外围引用有效性保护 | package/set 引用的 asset ref、version ref、distribution ref、external ref | pending / invalid / unavailable / valid 线索 | 防止外围组织引用漂移为第二 truth | 外部引用失效时安全降级 | Step 9 状态来源;后台维护接缝 |
| 外围边界隔离 | package / method set / marketplace / plugin / configuration 使用意图 | boundary decision 和 forbidden scope 线索 | 阻止外围增强成为核心前置 | 与 marketplace、artifact、console、SDK 保持边界 | Step 10 exception boundary;Step 13 风险审计 |
| 外围演进承接 | MethodPlugin / MethodConfiguration、高级 ViewProfile、AIPolicy override、标准映射增强候选 | 后续增强挂起或候选线索 | 保留演进入口,不进入当前核心主线 | 仅作为 future / peripheral context | Step 13 open questions;后续版本演进 |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `MethodPackageService` | Application service candidate | 编排外围资产包组织、生态发现语境承接和包引用有效性判断。 | Step 7 接口骨架;Step 8 package flow |
| `MethodSetAssemblyService` | Application service candidate | 编排组织级方法集组装和外围采用评估材料承接。 | Step 7 接口骨架;Step 8 assembly flow |
| `MethodPackage` | Peripheral truth candidate | 表达围绕正式方法资产的包组织语义。 | Step 6 关键对象轮廓 |
| `MethodSetAssembly` | Peripheral truth candidate | 表达组织级方法集组装语义。 | Step 6 关键对象轮廓 |
| `MethodPackageView` | View candidate | 表达外围包读取材料和生态发现读取线索。 | Step 6 候选筛选;Step 9 状态来源 |
| `MethodSetAssemblyView` | View candidate | 表达外围方法集读取材料和采用评估读取线索。 | Step 6 候选筛选;Step 9 状态来源 |

#### 本部分对象发现线索

| 对象线索 | 发现维度 | Step 6 处理要求 |
|---|---|---|
| `MethodPackageService` | Application service | 编排外围资产包组织,不得创建或覆盖核心方法资产 truth。 |
| `MethodSetAssemblyService` | Application service | 编排组织级方法集组装,不得扩大正式消费授权或替代受控消费。 |
| `MethodPackage` | Peripheral truth | 表达围绕正式方法资产的包组织语义,不是 marketplace listing、安装包或 artifact 包。 |
| `MethodSetAssembly` | Peripheral truth | 表达组织级方法集组装语义,不是组织运行配置、UI 视图或 SDK preset。 |
| `MethodPackageView` | View | 表达外围包读取材料,不得成为核心定义读取材料替代物。 |
| `MethodSetAssemblyView` | View | 表达外围方法集读取材料,不得成为正式消费决策替代物。 |
| `MethodPackageRef` | Reference | 指向外围包组织语义,不代表外部安装包或交易对象。 |
| `MethodSetAssemblyRef` | Reference | 指向组织级方法集组装语义,不代表组织运行实例。 |
| `MarketplaceContextRef` | Reference / Boundary | 指向 marketplace 或生态对象上下文,不得包含定价、订单、安装或履约正文。 |
| `PackageCompositionRule` | Policy / Rule | 约束 package 只能引用已成立核心资产和允许的分发语义。 |
| `MethodSetAssemblyRule` | Policy / Rule | 约束 method set 组装不反向定义核心 truth、不扩大消费授权。 |
| `PeripheralAdoptionAssessmentView` | View | 支撑外围评估语境,不等同于受控消费授权或治理裁决。 |

#### 本部分不承担什么

| 不承担事项 | 原因 |
|---|---|
| 核心方法资产定义、正式版本、受控消费、追溯一致性或关系 / 分发 truth 的创建和修改 | 这些 truth 已有核心或支撑组成部分 owner;外围组织只能消费已成立语义。 |
| marketplace 定价、订单、购买、订阅、结算、安装、履约和上架审核执行 | 这些属于 `L6-marketplace` 或外部生态系统,不得进入本仓 truth。 |
| artifact 包正文、安装包、导出文件格式、package storage 或 29110 deployment package 实现 | 当前只保留分发语义和外围组织位置,不展开文件和制品实现。 |
| UI 渲染、console 体验、SDK preset、组织运行配置或成员采用实例 | 这些属于体验、SDK、组织运行或下游仓,不是方法资产定义源。 |
| 通过 package / method set 扩大正式消费授权或绕过正式化版本 | 外围组织不等同于受控消费授权,也不得替代正式版本判断。 |
| 完整字段、接口签名、状态枚举、协议 schema、marketplace listing schema、配置键或验收报表字段 | 这些属于后续详细设计、配置、测试或验收层。 |

#### 与其他组成部分的接缝

| 对接部分 | 本部分输入 / 输出 | 接缝约束 |
|---|---|---|
| 方法资产定义与目录 | 读取已成立的资产定义和目录身份,组织 package / set。 | 核心定义不成立时,外围组织不得独立成立。 |
| 正式化与版本 | 读取 formal version refs 和版本有效性线索。 | package / method set 不得替代正式版本裁决。 |
| 受控消费 | 可输出外围采用评估材料或 package / set 上下文。 | 评估材料不等同于消费授权,不得扩大消费范围。 |
| 追溯与一致性保护 | 读取 trace / evidence line,输出外围组织变化的追溯线索。 | 外围追溯不得覆盖核心追溯语义。 |
| 关系与分发语义 | 读取 relation / distribution semantics,输出外围组织可发现上下文。 | 外围组织不得反向定义关系 truth 或分发语义 truth。 |
| 外部摘要与引用 | 读取 marketplace / ecosystem / artifact / standard summary/ref。 | 只保存 summary/ref,不得保存外部正文或交易履约。 |
| 后台维护与收敛 | 输出外围材料 freshness、pending、invalid 或 unavailable 线索。 | 维护可刷新外围材料,但外围不可用不得影响核心闭环成立。 |

#### 本部分停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 功能是否清楚 | pass | 方法资产包组织、组织级方法集组装、生态发现语境、外围采用评估材料、外围引用有效性保护、外围边界隔离和外围演进承接已形成可承接 capability。 |
| 候选对象是否有功能来源 | pass | `MethodPackageService`,`MethodSetAssemblyService`,`MethodPackage`,`MethodSetAssembly`,`MarketplaceContextRef` 等均回指 FR-ML-E-001/002、BR-ML-E-001、数据归属和 Step 4。 |
| 接缝是否清楚 | pass | 已区分核心资产输入、关系分发输入、外部引用输入、生态发现输出、外围读取输出和禁止的 marketplace / artifact / UI / SDK 实现面。 |
| 禁止事项是否清楚 | pass | 已排除 marketplace 交易履约、安装包、artifact 包正文、组织运行配置、核心 truth 覆盖、受控消费授权重算和旧发布同步主线。 |
| 是否越界 | pass | 未写字段、函数、协议 schema、状态枚举、状态迁移、持久化、配置、package 格式、marketplace listing schema、SDK / console API 或外部系统实现。 |

next_allowed_action: 等待用户确认后进入“各部分交互总图:先思考”;不得跳到对象发现维度总表、Step 6~9 承接矩阵或正式 §5 回填。

---

### 0R.25 各部分交互总图:先思考

问题回答:

- 交互总图要回答“八个组成部分如何构成一条核心成立链路、三类支撑接缝、一条维护回路和一个外围隔离区”,不是回答对象字段、接口签名、流程步骤或状态机迁移。
- 总图必须以 `方法资产定义与目录 -> 正式化与版本 -> 受控消费 -> 追溯与一致性保护` 作为核心主链。若把关系分发、外部摘要、后台维护或外围包放到主链中间,会把支撑能力或外围能力误升级为核心前置。
- `关系与分发语义` 应挂在定义、消费、追溯和外围之间,作为定义性关系和分发语义来源,不进入 marketplace 交易或安装履约。
- `外部摘要与引用` 应作为外部来源的安全进入点,向正式化、追溯、关系分发、受控消费和外围组织输出 summary/ref,不得让外部正文直接打穿核心 truth。
- `后台维护与收敛` 应画成围绕读取材料、消费材料、追溯材料、引用有效性和恢复线索的维护回路,不能画成新业务写路径或核心 truth 修复路径。
- `外围包与方法集组织` 应画在核心闭环之外,只消费已成立的定义、正式版本、关系分发、外部摘要和追溯线索;其 unavailable / pending 不得阻塞核心闭环成立。

来源依据:

| 来源 | 关键结论 | 对交互总图的影响 |
|---|---|---|
| `0R.8` 组成部分总表 | 已裁决 8 个组成部分和核心 / 支撑 / 外围层级。 | 总图必须按该层级画,不能重新发明新组件。 |
| `0R.9`~`0R.24` 逐组件小循环 | 每个组成部分已形成职责、capability、对象线索和接缝判断。 | 总图只整合接缝,不新增字段、对象、接口或流程。 |
| `00-需求文档.md` 核心能力与验收 | 核心闭环不能被外围增强、外部系统、下游运行 truth 或旧同步机制阻塞。 | 图中需明确核心主链与外围隔离。 |
| `01-架构设计.md` 子域 / 数据所有权 / 一致性 | 正式 truth、summary/ref、读取材料、外围增强和外部正文边界分层。 | 图中需要区分 truth 流、summary/ref 流、derived material 流和 forbidden boundary。 |
| Step 4 代码主体框架 | 8 个组成部分已映射到 service / object / view / task 候选。 | 图中可引用组成部分名称,不展开代码层或 adapter 层。 |

总图层级思考:

| 层级 | 包含组成部分 | 图中位置 | 约束 |
|---|---|---|---|
| 核心主链 | 方法资产定义与目录;正式化与版本;受控消费;追溯与一致性保护 | 图中心横向主链 | 表达业务成立顺序,不得被支撑或外围能力打断。 |
| 支撑接缝 | 关系与分发语义;外部摘要与引用 | 主链上下侧接入 | 作为语义来源、summary/ref 和关系分发支持,不得成为第二 truth。 |
| 维护回路 | 后台维护与收敛 | 围绕主链和支撑材料形成回路 | 只刷新派生材料和恢复线索,不得修复核心 truth。 |
| 外围隔离区 | 外围包与方法集组织 | 核心闭环外侧 | 只消费已成立语义,不阻塞核心闭环。 |
| 禁止边界 | marketplace 交易、artifact 正文、治理执行、UI / SDK、下游运行 truth、旧 snapshot/outbox | 图外 forbidden zone | 只可通过 summary/ref 或正式消费边界间接出现。 |

交互裁决:

| 交互 | 是否进入总图 | 方向 | 图中表达 |
|---|---|---|---|
| 定义与目录 -> 正式化与版本 | yes | 核心 truth subject / definition basis | 主链第一段。 |
| 正式化与版本 -> 受控消费 | yes | formal version / availability basis | 主链第二段。 |
| 受控消费 -> 追溯与一致性保护 | yes | consumption material / impact line | 主链第三段,同时回接一致性保护。 |
| 追溯与一致性保护 -> 正式化 / 消费 | yes | consistency warning / impact evidence / recovery handoff | 表达保护回看,但不反向创建版本或授权。 |
| 关系与分发语义 -> 受控消费 | yes | relation / distribution context | 支撑消费边界和分发语义。 |
| 关系与分发语义 -> 外围包与方法集组织 | yes | package / set 可引用的分发语义 | 外围输入,不反向定义关系 truth。 |
| 外部摘要与引用 -> 正式化 / 追溯 / 关系 / 消费 | yes | governance / standard / artifact / marketplace summary/ref | 外部来源安全进入点。 |
| 后台维护与收敛 -> read / trace / consumption material | yes | refresh / freshness / recovery line | 维护回路,不是业务写路径。 |
| 外围包与方法集组织 -> 核心主链 | limited | 只允许 adoption / discovery context 读取或外围线索 | 不得成为核心定义、版本、消费或追溯前置。 |
| marketplace / artifact / governance / UI / SDK -> 核心 truth | no | forbidden direct edge | 只能经 summary/ref、正式消费或外围隔离进入。 |

图形表达取舍:

- 总图应采用单张 ASCII 图,优先表达边界与方向,不表达流程步骤编号、函数调用、port 名称或数据结构。
- 核心主链放中间,支撑组件放上下侧,维护回路围绕派生材料,外围组件放右侧或下侧隔离区。
- 关系与分发语义同时连接定义、消费、追溯和外围,但箭头必须避免表达“分发定义核心 truth”。
- 外部摘要与引用通过 summary/ref 箭头接入多个组成部分,但图中要显式标注 `no external body` 或同等禁入语义。
- 后台维护与收敛使用虚线或标注型箭头表达 derived material refresh / recovery,避免看起来像核心写路径。
- 外围包与方法集组织使用隔离框或标注 `peripheral` 表达,避免后续 Step 6 把外围对象误当核心对象。

复杂度 / 越界检查:

- 不写对象字段、接口签名、函数、协议 schema、状态枚举、状态迁移、数据库、事件 topic、payload、配置项或 job 调度。
- 不新增第 9 个组成部分,不修改 `0R.8` 已定的 8 个组成部分排序。
- 不把外部正文、下游运行 truth、marketplace 交易、artifact 正文、治理执行、UI / SDK 或旧 snapshot / outbox 画成直接输入核心 truth 的边。
- 不让后台维护、关系分发、外部摘要或外围组织成为核心闭环的成立前置。
- 下一模块只允许写“各部分交互总图:再写入”的 ASCII 图、图例和说明;不得提前进入对象发现维度总表、Step 6~9 承接矩阵或正式 §5 回填。

停审记录:

| 审查项 | 结论 | 说明 |
|---|---|---|
| 图的表达对象是否清楚 | pass | 总图只表达 8 个组成部分之间的主链、支撑接缝、维护回路和外围隔离。 |
| 核心 / 支撑 / 外围是否区分 | pass | 核心主链、支撑接缝、维护回路和外围隔离区已有明确位置和约束。 |
| 接缝方向是否清楚 | pass | 已裁决核心 truth、summary/ref、distribution context、derived material 和 forbidden direct edge 的方向。 |
| 禁止事项是否清楚 | pass | 外部正文、marketplace 交易、artifact 正文、治理执行、UI / SDK、下游运行 truth 和旧机制均不得直连核心 truth。 |
| 是否越界 | pass | 当前只写交互总图思考,未写正式图、字段、接口、流程、状态机、协议、持久化或实现细节。 |

next_allowed_action: 等待用户确认后进入“各部分交互总图:再写入”;不得跳到对象发现维度总表、Step 6~9 承接矩阵或正式 §5 回填。

---

### 0R.26 各部分交互总图:再写入

#### 交互总图

```text
                         +----------------------+
                         | 外部摘要与引用       |
                         | summary/ref only     |
                         | no external body     |
                         +----------+-----------+
                                    |
                     summary/ref basis and evidence context
                                    |
                                    v
+--------------------+    +--------------------+    +--------------------+    +--------------------+
| 方法资产定义与目录 | -> | 正式化与版本       | -> | 受控消费           | -> | 追溯与一致性保护   |
| definition/catalog |    | formal version     |    | consumption guard  |    | trace/consistency  |
+---------+----------+    +----------+---------+    +----------+---------+    +----------+---------+
          |                          ^                         ^                         |
          | relation subjects        | basis / source line      | distribution context    | impact / evidence
          v                          |                         |                         v
+---------+--------------------------+-------------------------+-------------------------+---------+
| 关系与分发语义                                                                             |
| relation / distribution semantics; no marketplace transaction / install / fulfillment truth |
+---------+------------------------------------------------------------------------------------+
          |
          | package / set discoverability context
          v
+----------------------+
| 外围包与方法集组织   |
| peripheral only      |
| not core gate        |
+----------------------+

+------------------------------------------------------------------------------------------+
| 后台维护与收敛                                                                           |
| derived material refresh: read / consumption / trace / external-ref validity / recovery   |
| no core truth repair; no scheduler / worker / retry / topic fixed in Step 5               |
+------------------------------------------------------------------------------------------+
          ^                    ^                    ^                    ^
          | freshness / pending / unavailable / recovery lines only      |
          +--------------------+--------------------+--------------------+
```

#### 图例

| 图中元素 | 含义 | 约束 |
|---|---|---|
| 横向主链 | `方法资产定义与目录 -> 正式化与版本 -> 受控消费 -> 追溯与一致性保护`。 | 表达核心闭环成立顺序,不得被支撑或外围组成部分打断。 |
| `summary/ref only` | 外部来源只能通过摘要或引用进入本仓。 | 不保存治理裁决正文、标准全文、artifact 正文、证据文件正文或 marketplace 交易正文。 |
| `关系与分发语义` 横向支撑条 | 为定义、消费、追溯和外围组织提供关系 / 分发语义。 | 不承担 marketplace 定价、订单、购买、安装或履约。 |
| `外围包与方法集组织` | 围绕已成立核心资产组织 package / method set / 生态发现语境。 | 只作为 peripheral,不可成为核心定义、正式版本、消费或追溯的成立前置。 |
| `后台维护与收敛` | 刷新派生读取材料、消费材料、追溯材料、外部引用有效性和恢复线索。 | 不是业务写路径,不得修复或重算核心 truth。 |
| `freshness / pending / unavailable / recovery lines only` | 维护路径输出材料状态和恢复线索。 | 不表达字段、状态枚举、job、topic、retry 或 worker 实现。 |

#### 关键交互说明

| 交互 | 图中位置 | 说明 |
|---|---|---|
| 定义与目录到正式化与版本 | 核心主链第一段 | 定义身份、目录语义和定义依据进入正式化判断。 |
| 正式化与版本到受控消费 | 核心主链第二段 | formal version 和正式可用性支撑下游受控消费。 |
| 受控消费到追溯与一致性保护 | 核心主链第三段 | 消费材料和影响线索进入追溯、一致性保护和审计解释。 |
| 追溯与一致性保护回看正式化 / 消费 | 主链上方 source / impact 线索 | 只提供一致性警示、证据线索和恢复 handoff,不反向创建版本或授权。 |
| 外部摘要与引用到主链和支撑条 | 图上方 summary/ref 入口 | 外部治理、标准、ADR、artifact、marketplace 等只以 summary/ref 支撑正式化、追溯、关系和消费。 |
| 关系与分发语义到外围组织 | 支撑条到 peripheral 区 | 分发语义可以成为 package / method set 的可发现上下文,但外围组织不得反向定义关系 truth。 |
| 后台维护与收敛到其他部分 | 图下方维护回路 | 只刷新派生材料和输出 pending / stale / unavailable / recovery 线索。 |

#### 禁止边界

| 禁止直连 | 原因 |
|---|---|
| marketplace 交易 / 安装 / 履约 -> 核心 truth | 交易和履约属于 `L6-marketplace`,本仓最多承接生态对象引用或分发语义。 |
| artifact 正文 / archive 正文 -> 核心 truth | 本仓只保存 artifact / archive ref 或摘要,不拥有正文生命周期。 |
| governance 执行 / policy enforce -> 核心 truth | 本仓只承接治理结论摘要或依据引用,不执行治理。 |
| UI / SDK / console 状态 -> 核心 truth | 体验入口或 SDK preset 不是方法资产定义源。 |
| 后台维护 -> 核心 truth 修复 | 维护只刷新派生材料和恢复线索,不得成为第二业务写路径。 |
| 外围 package / method set -> 核心闭环前置 | 外围能力不可用时核心定义、正式化、消费和追溯仍应成立。 |

#### 本模块停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 图是否覆盖 8 个组成部分 | pass | 图中包含 4 个核心组成部分、2 个支撑接缝、1 个维护回路和 1 个外围隔离区。 |
| 核心主链是否清楚 | pass | 主链按定义与目录、正式化与版本、受控消费、追溯一致性排列。 |
| 支撑和外围是否被隔离 | pass | 关系分发、外部摘要和后台维护没有插入核心主链;外围包与方法集组织标注为 peripheral。 |
| 禁止边界是否清楚 | pass | 已列出 marketplace、artifact、governance、UI / SDK、后台维护和外围组织的禁止直连。 |
| 是否越界 | pass | 未写字段、接口、函数、状态枚举、状态迁移、协议 schema、持久化、配置、job、topic 或证据 schema。 |

next_allowed_action: 等待用户确认后进入“对象发现维度总表:先思考”;不得跳到对象发现维度总表:再写入、Step 6~9 承接矩阵或正式 §5 回填。

---

### 0R.27 对象发现维度总表:先思考

问题回答:

- 对象发现维度总表回答“Step 6 需要从哪些组成部分发现哪些类型的对象候选”,不是回答对象字段、完整类型、接口签名、存储结构、事件 schema 或状态机迁移。
- 本模块必须把 `0R.8` 的 8 个组成部分、`0R.9`~`0R.24` 的逐组件对象线索和 `0R.26` 的交互总图汇总成一张发现矩阵,防止 Step 6 遗漏 owner 或把外围 / 支撑对象误升为核心对象。
- 对象发现维度应覆盖 `Truth / State`、`Policy / Invariant`、`Projection / View`、`Reference / Boundary`、`Audit / History`、`Operation / Recovery` 和 `Step 6 展开要求`。其中 Operation / Recovery 只用于后台维护等支撑路径,不得被写成业务 truth。
- 对象发现总表只能列候选和边界要求,不能在 Step 5 直接裁决字段全集、构造函数、生命周期状态枚举、repository、port、adapter、DTO 或 persistence model。
- `MethodContent`、`DefinitionSnapshot`、`fingerprint`、`outbox`、publish-based event flow、marketplace listing、artifact 正文、governance execution、UI / SDK preset 均不得作为当前对象发现主语恢复。

来源依据:

| 来源 | 关键结论 | 对对象发现维度的影响 |
|---|---|---|
| `0R.8` 组成部分总表 | 已裁决 8 个组成部分及各自主要代码主体。 | 对象发现必须逐行回指这 8 个组成部分,不得新增第 9 个业务组成部分。 |
| `0R.9`~`0R.24` 逐组件小循环 | 每个组成部分已有对象线索和 Step 6 处理要求。 | 总表需要整合这些线索,并标注核心、支撑、operation 或 peripheral。 |
| `0R.26` 交互总图 | 已区分核心主链、支撑接缝、维护回路和外围隔离区。 | 对象维度必须保护 truth / summary-ref / derived material / peripheral 的分层。 |
| 当前 `00-需求文档.md` 数据归属 | 明确定义 truth、正式版本 truth、消费材料、追溯材料、外部 summary/ref、外围增强 truth 和禁止保存正文。 | 对象发现需要区分 truth、view、summary、ref、禁止正文。 |
| 当前 `01-架构设计.md` 数据所有权 / 一致性 | 正式 truth、引用、读取材料、维护材料和外围增强有不同一致性边界。 | 对象候选需要带出后续 Step 9 状态来源和 Step 10 异常边界来源。 |
| Step 4 代码主体框架 | 已给出 service / object / view / task 候选名称。 | 总表使用这些名称做候选,但不展开代码分层和接口。 |

对象发现维度定义:

| 维度 | 本 Step 含义 | 可以写什么 | 不得写什么 |
|---|---|---|---|
| Truth / State | 组成部分拥有或维护的核心真相、外围真相或正式状态候选。 | 对象名、归属组成部分、是否核心 / 支撑 / 外围。 | 字段全集、状态枚举全集、持久化表、版本算法。 |
| Policy / Invariant | 保护边界、正式化、消费、关系、外部正文禁入或外围隔离的规则候选。 | 规则对象或约束候选及其保护目标。 | 规则表达式、算法、policy engine、配置键。 |
| Projection / View | 派生读取材料、目录视图、可用性视图、追溯材料视图、维护进度视图。 | view / material 候选和来源 truth。 | cache/index 实现、查询语句、报表字段。 |
| Reference / Boundary | 稳定引用、外部引用、下游消费边界、marketplace / artifact / governance 引用。 | ref / boundary 候选及其禁止正文。 | 外部正文、交易正文、artifact 正文、下游私有模型正文。 |
| Audit / History | 追溯、证据线索、影响摘要、审计轨迹或外围变化线索。 | audit / lineage / history 候选。 | raw log dump、telemetry schema、证据 JSON、报表 artifact。 |
| Operation / Recovery | 后台维护、材料刷新、恢复收敛、pending / unavailable 线索。 | task / run / progress / recovery 候选。 | job 调度、retry、worker、queue、topic、outbox。 |
| Step 6 展开要求 | 后续关键对象轮廓必须展开或反查的重点。 | 需要独立展开、合并、降级或排除的说明。 | 直接在 Step 5 完成对象细化。 |

逐组成部分发现方向:

| 组成部分 | 对象发现重点 | 需要防止的误判 |
|---|---|---|
| 方法资产定义与目录 | definition truth、catalog entry、definition ref、catalog view、definition boundary policy。 | 把目录 view 写成第二定义 truth;恢复旧 `MethodContent` 主线。 |
| 正式化与版本 | formal version truth、formalization basis summary、formalization state、version view、version transition invariant。 | 把正式化写成治理执行;把版本语义简化成 fingerprint / snapshot。 |
| 受控消费 | consumption material、availability view、downstream boundary、consumption context ref、Definition vs Use rule。 | 把下游运行 truth 或 UI / SDK 使用状态写入本仓对象。 |
| 追溯与一致性保护 | trace material、impact summary、audit trail、evidence lineage、consistency rule。 | 把 raw log、telemetry、report 或外部证据正文写成 truth。 |
| 关系与分发语义 | relation truth、distribution context/ref、relation integrity rule、distribution view。 | 把 marketplace 交易、安装、履约或 listing 当成分发对象。 |
| 外部摘要与引用 | external summary、external ref、governance basis ref、artifact/archive ref、external body boundary rule。 | 保存外部正文、治理执行正文、artifact 正文或标准全文。 |
| 后台维护与收敛 | maintenance service/task、refresh task、recovery task、maintenance run ref、progress/freshness view。 | 把维护任务写成业务 truth 修复路径或固定 job/worker/topic。 |
| 外围包与方法集组织 | method package、method set assembly、package/set view、marketplace context ref、composition rule。 | 把外围对象写成核心闭环前置、marketplace listing、安装包或组织运行配置。 |

筛选规则:

| 规则 | 说明 |
|---|---|
| 必须有组成部分 owner | 每个对象候选必须回指 `0R.8` 的一个组成部分。跨多个组成部分的对象要说明主 owner 和输入来源。 |
| 必须有能力来源 | 对象候选必须能回指逐组件 capability,不能仅因旧文档或实现想象出现。 |
| 必须标注层级 | 对象候选需要标注 core、support、operation 或 peripheral,避免外围和维护对象误升为核心对象。 |
| 必须区分 truth 与 material | Truth / State、Projection / View、Summary、Ref、History、Recovery 不得混写。 |
| 禁止正文复制 | 外部正文、下游运行正文、artifact 正文、governance 执行正文、marketplace 交易正文不得进入候选。 |
| 禁止实现下沉 | repository、adapter、DTO、event、topic、payload、job schedule、DDL、cache/index 不进入 Step 5 对象发现表。 |
| 允许保留待展开 | 当前只给 Step 6 展开要求;如果候选粒度不明,标注 Step 6 需拆分 / 合并 / 降级,不在 Step 5 私自闭口。 |

下一个写入模块的表结构裁决:

| 列 | 用途 | 写入要求 |
|---|---|---|
| 组成部分 | 回指 `0R.8` 的 8 个组成部分。 | 顺序保持 `0R.8`。 |
| Truth / State | 列核心或外围真相、正式状态候选。 | 无候选时写 `none` 或说明不应拥有 truth。 |
| Policy / Invariant | 列边界和规则候选。 | 只写对象 / 规则名和保护点。 |
| Projection / View | 列读取材料或视图候选。 | 不写查询实现或 cache/index。 |
| Reference / Boundary | 列 ref、boundary、external context 候选。 | 必须标注禁止正文边界。 |
| Audit / History | 列 trace、lineage、impact、audit 候选。 | 不写 raw log / report schema。 |
| Operation / Recovery | 列 task、run、refresh、recovery 候选。 | 主要用于后台维护;其他组成部分无则写 `none`。 |
| Step 6 处理要求 | 后续 Step 6 的展开 / 合并 / 降级提醒。 | 必须包含核心 / 支撑 / 外围 / operation 层级。 |

取舍:

- 对象发现维度总表放在交互总图之后,因为交互方向已经决定哪些对象是 truth、哪些只是 summary/ref、material、recovery 或 peripheral。
- 不在本模块直接恢复 historical 的对象发现表,因为旧表里可能包含旧主语和旧执行机制;只能作为后置差异审计输入。
- `Operation / Recovery` 作为独立列保留,避免后台维护对象被塞进 `Truth / State` 或 `Projection / View` 后失去边界。
- `Reference / Boundary` 作为独立列保留,因为本仓大量边界依赖 summary/ref 和禁止正文规则,不能只靠普通对象名表达。
- `Step 6 处理要求` 必须出现在总表,否则后续 Step 6 仍可能一次性细化或跳过外围 / operation 降级判断。

复杂度 / 越界检查:

- 不写字段、完整对象结构、函数、接口签名、repository、adapter、DTO、event、payload、topic、DDL、状态枚举、状态迁移、配置项或证据 schema。
- 不新增组成部分,不改变 `0R.8` 的排序和层级。
- 不把旧 `MethodContent`、`DefinitionSnapshot`、`fingerprint`、`outbox`、publish flow、marketplace listing、artifact package 或 UI / SDK preset 恢复为候选主语。
- 不把后台维护、外部摘要、关系分发或外围包组织写成核心闭环成立前置。
- 下一模块只允许写“对象发现维度总表:再写入”的对象发现矩阵;不得提前进入 Step 6~9 承接矩阵、跨组件闭环审计或正式 §5 回填。

停审记录:

| 审查项 | 结论 | 说明 |
|---|---|---|
| 维度是否清楚 | pass | 已定义 Truth / State、Policy / Invariant、Projection / View、Reference / Boundary、Audit / History、Operation / Recovery 和 Step 6 展开要求。 |
| 组件覆盖是否完整 | pass | 八个组成部分均有对象发现方向和误判防护。 |
| 筛选规则是否可执行 | pass | 已要求对象有 owner、能力来源、层级标注、truth/material 区分和禁止正文边界。 |
| 禁止事项是否清楚 | pass | 已排除旧主语、外部正文、下游运行正文、marketplace 交易正文和实现层对象。 |
| 是否越界 | pass | 当前只写对象发现思考和下一个表结构裁决,未写最终总表、字段、接口、流程、状态机或实现细节。 |

next_allowed_action: 等待用户确认后进入“对象发现维度总表:再写入”;不得跳到 Step 6~9 承接矩阵、跨组件闭环审计或正式 §5 回填。

---

### 0R.28 对象发现维度总表:再写入

#### 对象发现维度总表

| 组成部分 | Truth / State | Policy / Invariant | Projection / View | Reference / Boundary | Audit / History | Operation / Recovery | Step 6 处理要求 |
|---|---|---|---|---|---|---|---|
| 方法资产定义与目录 | `MethodAssetDefinition`;`MethodAssetCatalogEntry` | `DefinitionBoundaryRule`;`CatalogUniquenessRule` | `MethodAssetCatalogView`;`MethodAssetDefinitionView` | `MethodAssetDefinitionRef`;`MethodAssetCatalogScopeRef` | `DefinitionChangeHistory` | none | core。Step 6 必须独立展开 definition truth、catalog entry、stable ref 和目录读取材料;不得恢复旧 `MethodContent` 或把 catalog view 写成第二 truth。 |
| 正式化与版本 | `FormalMethodAssetVersion`;`FormalizationState` | `FormalizationEligibilityRule`;`VersionTransitionInvariant` | `FormalMethodAssetVersionView` | `FormalizationBasisSummary`;`FormalVersionRef`;`GovernanceBasisRef` | `FormalizationDecisionHistory` | none | core。Step 6 必须区分 formal version truth、basis summary/ref 和 formalization state;不得把版本语义简化为 fingerprint / snapshot,也不得写成 governance 执行。 |
| 受控消费 | `MethodAssetConsumptionMaterial` | `DefinitionVsUseRule`;`DownstreamConsumptionBoundaryRule` | `MethodAssetAvailabilityView`;`ConsumptionMaterialView` | `DownstreamConsumptionBoundary`;`ConsumptionContextRef`;`DownstreamConsumerRef` | `ConsumptionImpactLineage` | none | core。Step 6 必须表达消费材料、可用性视图和下游边界;不得保存下游运行 truth、UI / SDK 状态或消费仓私有模型正文。 |
| 追溯与一致性保护 | `MethodAssetTraceMaterial`;`ConsumptionImpactSummary` | `ConsistencyProtectionRule`;`EvidenceLineageBoundaryRule` | `TraceMaterialView`;`ConsistencyStatusView` | `EvidenceLineageRef`;`TraceSubjectRef` | `MethodAssetAuditTrail`;`MethodAssetEvidenceLineage`;`ConsumptionImpactHistory` | `ConsistencyRecoveryRef` | core。Step 6 必须区分 trace material、impact summary、audit trail 和 evidence lineage;不得把 raw log、telemetry、report 或外部证据正文写成 truth。 |
| 关系与分发语义 | `MethodAssetRelation`;`MethodAssetDistributionContext` | `RelationIntegrityRule`;`DistributionBoundaryRule` | `RelationGraphView`;`DistributionContextView` | `MethodAssetDistributionRef`;`DistributionContextRef`;`EcosystemObjectRef` | `RelationChangeHistory` | none | support。Step 6 必须展开 relation truth 和 distribution context/ref,但标注不承担 marketplace 交易、安装、履约或 listing truth。 |
| 外部摘要与引用 | `ExternalSourceSummary` | `ExternalBodyBoundaryRule`;`ExternalReferenceValidityRule` | `ExternalReferenceValidityView` | `ExternalSourceRef`;`ArtifactArchiveRef`;`GovernanceBasisRef`;`StandardAdrSourceRef`;`MarketplaceContextRef` | `ExternalSourceLineageRef` | none | support。Step 6 必须拆分 summary 与 ref-only 边界,并为 artifact/archive/governance/standard/marketplace 引用标注禁止正文。 |
| 后台维护与收敛 | none | `MaterialConvergencePolicy`;`MaintenanceIdempotencyRule` | `MaintenanceProgressView`;`ReadMaterialFreshnessView`;`TraceMaterialFreshnessView` | `MaintenanceRunRef`;`MaintenanceRecoveryRef` | `MaintenanceObservationMarker` | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask` | operation/support。Step 6 可发现 task/run/progress/recovery 对象,但不得写成业务 truth、job 调度、worker、retry、queue、topic 或 outbox。 |
| 外围包与方法集组织 | `MethodPackage`;`MethodSetAssembly` | `PackageCompositionRule`;`MethodSetAssemblyRule`;`PeripheralBoundaryRule` | `MethodPackageView`;`MethodSetAssemblyView`;`PeripheralAdoptionAssessmentView` | `MethodPackageRef`;`MethodSetAssemblyRef`;`MarketplaceContextRef` | `PackageAssemblyHistory`;`MethodSetChangeHistory` | none | peripheral。Step 6 必须标注外围增强和不阻塞核心闭环;不得写成 marketplace listing、安装包、artifact package、组织运行配置或核心消费授权。 |

#### 层级裁决

| 层级 | 对象候选范围 | 后续约束 |
|---|---|---|
| core | 方法资产定义与目录、正式化与版本、受控消费、追溯与一致性保护中的 truth/state/material/ref/audit。 | Step 6 必须优先展开,并在 Step 7~9 形成接口、流程和状态来源。 |
| support | 关系与分发语义、外部摘要与引用中的 relation、distribution、summary、ref、boundary、validity view。 | 支撑核心主链,但不得成为第二 truth 或核心闭环前置。 |
| operation | 后台维护与收敛中的 refresh task、recovery task、run ref、progress/freshness view。 | 只能刷新派生材料和恢复线索,不得修复核心 truth 或固定实现机制。 |
| peripheral | 外围包与方法集组织中的 package、method set、marketplace context、peripheral view。 | 只消费已成立语义,不可阻塞核心闭环或覆盖核心对象。 |

#### Step 6 展开优先级

| 优先级 | 内容 | 理由 |
|---|---|---|
| P0 | `MethodAssetDefinition`;`FormalMethodAssetVersion`;`MethodAssetConsumptionMaterial`;`MethodAssetTraceMaterial`;`MethodAssetRelation`;`ExternalSourceSummary` / `ExternalSourceRef`。 | 这些对象决定核心 truth、正式版本、消费材料、追溯材料、关系语义和外部来源边界。 |
| P1 | 关键 rule / boundary / ref / view,包括 `DefinitionVsUseRule`,`ExternalBodyBoundaryRule`,`RelationIntegrityRule`,`MethodAssetAvailabilityView`,`ExternalReferenceValidityView`。 | 这些对象保护跨组件接缝和禁止正文边界。 |
| P2 | operation / peripheral 候选,包括 `MaintenanceRunRef`,`ReadMaterialRefreshTask`,`MethodPackage`,`MethodSetAssembly`。 | 后续需要边界来源,但不能反向成为核心闭环前置。 |

#### 排除清单

| 排除对象 / 主语 | 处理口径 |
|---|---|
| `MethodContent`;`DefinitionSnapshot`;`fingerprint` | 不作为当前对象发现主语;若旧材料出现,只进入差异审计。 |
| outbox / publish event / event payload / topic | 不进入 Step 5 对象发现;事件与协议由后续详细设计或实现边界另行裁决。 |
| repository / adapter / DTO / persistence model / cache index | 属于实现或详细设计层,不得在 Step 5 作为业务对象候选。 |
| marketplace listing / order / purchase / billing / install / fulfillment | 属于 `L6-marketplace`;本仓只可保存生态上下文引用。 |
| artifact body / archive body / evidence file body | 只可通过 ref 或 summary 承接,不得保存正文。 |
| governance execution / policy enforce / Gate 流程 | 属于 `L1-governance`;本仓只承接治理依据 summary/ref。 |
| UI / SDK preset / console state / organization runtime config | 不属于方法资产定义 truth;仅可作为外围或下游消费语境。 |

#### 本模块停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 组成部分覆盖是否完整 | pass | 8 个组成部分均有对象发现维度行和 Step 6 处理要求。 |
| 维度是否完整 | pass | 已覆盖 Truth / State、Policy / Invariant、Projection / View、Reference / Boundary、Audit / History、Operation / Recovery。 |
| 层级是否清楚 | pass | 已裁决 core、support、operation、peripheral 四类对象候选及后续约束。 |
| 禁止事项是否清楚 | pass | 已排除旧主语、事件实现、持久化实现、marketplace 交易、artifact 正文、治理执行和 UI / SDK 状态。 |
| 是否越界 | pass | 未写字段全集、接口签名、状态枚举、状态迁移、DDL、协议 schema、topic、job 调度、配置项或证据 schema。 |

next_allowed_action: 等待用户确认后进入“Step 6~9 承接矩阵:先思考”;不得跳到跨组件闭环审计、旧材料差异审计或正式 §5 回填。

---

### 0R.29 Step 6~9 承接矩阵:先思考

问题回答:

- Step 6~9 承接矩阵回答“Step 5 的组成部分和 capability 如何稳定承接到 Step 6 对象、Step 7 接口、Step 8 处理流和 Step 9 状态来源”,不是直接重写 Step 6~9 正文。
- 当前 Step 6 已出现大量新主语和反查清单,可作为承接矩阵的重要输入;但 Step 7~9 仍需按 Step 5 rewrite 重新反查,尤其 Step 9 历史文件仍明显保留 `MethodContentLifecycle`、`OutboxEventStatus`、`DefinitionSnapshot`、`fingerprint` 和旧 publish / outbox 状态主线。
- 承接矩阵必须把每条链路写成 `component -> capability -> object owner -> interface owner -> processing flow -> state owner / state family`。如果某一段当前 Step 6~9 不存在或仍是旧主语,矩阵应标注 `needs_rewrite` / `blocked_by_step5_rewrite`,不得用旧材料补齐。
- 矩阵粒度应以 capability family 为行,而不是每个对象字段、每个函数或每个状态枚举为行。这样能支撑后续反查,又不把 Step 5 下沉到详细设计。
- 对 operation / peripheral 链路必须显式标注层级,避免后台维护、外围包与方法集组织在 Step 7~9 中被误写成核心闭环前置。

来源依据:

| 来源 | 关键结论 | 对承接矩阵的影响 |
|---|---|---|
| `0R.8` 组成部分总表 | 已固定 8 个组成部分和核心 / 支撑 / operation / peripheral 层级。 | 矩阵行必须按该顺序组织,不得新增业务组成部分。 |
| `0R.9`~`0R.24` 逐组件小循环 | 每个组成部分已有 capability、对象线索和接缝。 | 矩阵应从 capability family 出发行,避免直接按旧对象或旧流程反推。 |
| `0R.28` 对象发现维度总表 | 已给出 Step 6 对象候选、层级裁决和排除清单。 | Step 6 对象列必须来自该表或明确标注待重写。 |
| 当前 Step 6 文件 | 已有当前对象主语和 Step 8 / Step 9 反查清单,并列出旧材料差异审计。 | 可作为对象 owner 的当前输入,但不能越过 Step 5 直接采纳字段 / 函数细节。 |
| 当前 Step 7 / Step 8 / Step 9 文件 | Step 8 有重启口径;Step 9 仍存在明显旧状态主线。 | 矩阵需要标注 Step 7~9 哪些位置需反查或重写,不能用旧状态和旧流程闭口。 |
| `02_hld_calibration_flow.md` | Step 6~9 当前被 Step 5 rewrite 阻塞或需 recheck。 | 本矩阵是 Step 5 完成前的 handoff gate,不是直接进入后续 Step 的许可。 |

矩阵列裁决:

| 列 | 用途 | 写入要求 |
|---|---|---|
| 组成部分 | 回指 `0R.8` 的 8 个组成部分。 | 顺序保持不变,并标注 core/support/operation/peripheral。 |
| capability family | 回指逐组件 capability。 | 聚合到可承接的一组能力,不逐字段展开。 |
| Step 6 对象 owner | 指向对象发现维度总表和当前 Step 6 对象 owner。 | 只写对象候选 / owner,不写字段和函数。 |
| Step 7 接口 owner | 指出后续接口骨架应由哪个 service / boundary 承接。 | 不写完整接口签名、DTO 或 port。当前缺失时写 `needs_recheck`。 |
| Step 8 处理流 | 指出后续处理流 family。 | 不写步骤算法;当前缺失或旧主语污染时写 `needs_rewrite`。 |
| Step 9 状态来源 | 指出状态 owner / state family。 | 不写枚举全集和迁移;旧 `MethodContentLifecycle` / `OutboxEventStatus` 不可作为来源。 |
| 当前处置 | 标注 pass / needs_recheck / needs_rewrite / forbidden。 | 用于后续 Step 6~9 反查顺序和 blocker 记录。 |

行粒度裁决:

| 行类型 | 示例范围 | 原因 |
|---|---|---|
| core truth chain | 定义与目录、正式化与版本、受控消费、追溯一致性。 | 必须完整连到 Step 6 对象、Step 7 接口、Step 8 流程和 Step 9 状态来源。 |
| support seam chain | 关系分发、外部摘要 / 引用。 | 支撑核心主链,但不得成为第二 truth 或核心前置。 |
| operation chain | 读取材料刷新、追溯材料刷新、一致性恢复。 | 需要进入 Step 8 / Step 9,但不能成为业务 truth 写路径。 |
| peripheral chain | 方法包、方法集、生态发现、外围采用评估。 | 需要保留后续对象和接口边界,但不可阻塞核心闭环。 |
| forbidden chain | 旧 MethodContent、snapshot、fingerprint、outbox、marketplace 交易、artifact 正文、governance execution。 | 不进入矩阵正文;只在排除清单和差异审计中处理。 |

Step 6~9 反查门禁:

| Step | 承接检查 | 不通过时处理 |
|---|---|---|
| Step 6 关键对象 | 每个 matrix row 至少有一个对象 owner 或明确 `none` / `not_applicable`。 | 标注 `needs_rewrite_or_recheck`,不得在 Step 7/8/9 私造对象。 |
| Step 7 接口骨架 | 每个非纯 view / rule 的 capability family 有 service / boundary owner。 | 标注 `needs_recheck`;不得写完整接口签名补口。 |
| Step 8 处理流 | 每个核心和支撑 capability 有处理流 family 或明确只读 / material refresh 口径。 | 标注 `needs_rewrite`;不得恢复旧 `CreateMethodContentDraft` / publish / outbox flow。 |
| Step 9 状态来源 | 每个可能产生状态的对象有 state owner / state family 来源。 | 标注 `needs_rewrite`;不得沿用旧 `MethodContentLifecycle` / `OutboxEventStatus`。 |

旧材料污染处理:

| 污染类型 | 矩阵处理 |
|---|---|
| 旧对象主语 | `MethodContent`,`DefinitionSnapshot`,`OutboxEvent`,`CanonicalFingerprint` 不进入对象 owner 列。 |
| 旧 flow 主语 | `CreateMethodContentDraft`,`PublishMethodContent`,`OutboxRelayWorker`,`RebuildDefinitionIndex` 不进入处理流列。 |
| 旧状态主线 | `MethodContentLifecycle`,`OutboxEventStatus` 不进入状态来源列。 |
| 旧实现机制 | repository、adapter、DTO、event payload、topic、DDL、object storage、retry queue 不进入矩阵。 |
| 外部正文 / 交易正文 | artifact 正文、marketplace 交易履约、governance 执行、UI / SDK 状态只进入 forbidden 说明。 |

下一步写入结构裁决:

| 模块 | 内容 |
|---|---|
| 0R.30.1 承接矩阵正文 | 按 8 个组成部分写 component -> capability -> object -> interface -> flow -> state。 |
| 0R.30.2 缺口标注 | 列出 Step 6~9 中 needs_recheck / needs_rewrite / forbidden 项。 |
| 0R.30.3 后续 Step 处理顺序 | 说明 Step 5 完成后应优先 recheck Step 6,再反查 Step 7/8/9。 |
| 0R.30.4 停审记录 | 检查承接链、旧主语污染、外围 / operation 降级和越界情况。 |

复杂度 / 越界检查:

- 不写对象字段、完整接口签名、DTO、port、adapter、处理流步骤、状态枚举、状态迁移、repository、DDL、event topic、payload、job、配置项或证据 schema。
- 不直接修改 Step 6~9 文件;本模块只为后续反查生成 Step 5 handoff gate。
- 不把 Step 9 历史 `MethodContentLifecycle` / `OutboxEventStatus` 作为当前状态来源。
- 不把 Step 8 历史 publish / snapshot / outbox / fingerprint 流程作为当前处理流来源。
- 下一模块只允许写“Step 6~9 承接矩阵:再写入”的矩阵、缺口标注和停审记录;不得跳到跨组件闭环审计、旧材料差异审计或正式 §5 回填。

停审记录:

| 审查项 | 结论 | 说明 |
|---|---|---|
| 矩阵目的是否清楚 | pass | 矩阵用于 Step 5 到 Step 6~9 的来源承接,不是重写后续 Step 正文。 |
| 列结构是否清楚 | pass | 已固定 component、capability、object、interface、flow、state 和当前处置列。 |
| 旧材料污染是否识别 | pass | 已识别 Step 8/9 旧 flow / 旧状态主线,并规定不得用于闭口。 |
| 后续门禁是否清楚 | pass | Step 6 对象、Step 7 接口、Step 8 流程、Step 9 状态均有反查规则。 |
| 是否越界 | pass | 当前只写承接矩阵思考,未写矩阵正文、字段、接口、流程步骤、状态机或实现细节。 |

next_allowed_action: 等待用户确认后进入“Step 6~9 承接矩阵:再写入”;不得跳到跨组件闭环审计、旧材料差异审计或正式 §5 回填。

---

### 0R.30 Step 6~9 承接矩阵:再写入

#### 承接矩阵正文

| 组成部分 | capability family | Step 6 对象 owner | Step 7 接口 owner | Step 8 处理流 | Step 9 状态来源 | 当前处置 |
|---|---|---|---|---|---|---|
| 方法资产定义与目录(core) | 定义 truth、稳定身份、目录识别、定义边界保护 | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`MethodAssetDefinitionRef`;`MethodAssetCatalogView`;`DefinitionBoundaryRule` | `MethodAssetDefinitionService`;`MethodAssetCatalogService`;definition/catalog boundary | 定义建立 / 调整 / 目录识别 flow family;不得恢复 `CreateMethodContentDraft` | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;catalog view freshness | Step 6 当前可作为 owner 来源;Step 7~9 需按本链 recheck。 |
| 正式化与版本(core) | 正式化资格、正式版本、版本语义变化、依据承接 | `FormalMethodAssetVersion`;`FormalizationState`;`FormalizationBasisSummary`;`FormalizationEligibilityRule`;`VersionTransitionInvariant` | `MethodAssetFormalizationService`;`MethodAssetVersionService`;formalization boundary | 正式化裁定 / 版本演进 / 依据承接 flow family;不得恢复 publish / fingerprint flow | `FormalizationState`;`FormalMethodAssetVersion`;formal version availability state | Step 6 owner 来源基本闭合;Step 8/9 必须重写旧 publish / lifecycle 口径。 |
| 受控消费(core) | 消费材料、可用性判断、Definition vs Use、防下游 truth 侵入 | `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`DownstreamConsumptionBoundary`;`ConsumptionContextRef`;`DefinitionVsUseRule` | `MethodAssetConsumptionService`;downstream consumption boundary | 消费材料读取 / 可用性判断 / 下游边界检查 flow family | `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;consumption material freshness | Step 6 owner 来源可用;Step 7/8/9 需反查是否仍混入下游运行状态。 |
| 追溯与一致性保护(core) | 追溯材料、影响摘要、审计线索、一致性保护 | `MethodAssetTraceMaterial`;`ConsumptionImpactSummary`;`MethodAssetAuditTrail`;`MethodAssetEvidenceLineage`;`ConsistencyProtectionRule` | `MethodAssetTraceService`;`MethodAssetConsistencyService`;trace / consistency boundary | 变化追溯 / 影响摘要 / 一致性保护 flow family | `MethodAssetTraceMaterial`;`ConsumptionImpactSummary`;`ConsistencyStatusView`;audit material freshness | Step 6 owner 来源可用;后续不得把 raw log、report 或外部证据正文写成状态来源。 |
| 关系与分发语义(support) | 资产关系、分发语义、生态可发现上下文 | `MethodAssetRelation`;`MethodAssetDistributionContext`;`MethodAssetDistributionRef`;`RelationIntegrityRule`;`DistributionContextView` | `MethodAssetRelationService`;`MethodAssetDistributionService`;relation/distribution boundary | 关系维护 / 分发语义承接 / 分发上下文读取 flow family | `MethodAssetRelation`;`MethodAssetDistributionContext`;relation / distribution validity | Step 6 owner 来源可用;Step 7~9 需标注 support,不得升级为 marketplace 交易链路。 |
| 外部摘要与引用(support) | 外部来源摘要、ref-only、治理 / 标准 / artifact / marketplace 引用、正文禁入 | `ExternalSourceSummary`;`ExternalSourceRef`;`ArtifactArchiveRef`;`GovernanceBasisRef`;`ExternalBodyBoundaryRule`;`ExternalReferenceValidityView` | `ExternalBasisAcceptanceService`;external basis / reference boundary | 外部依据接收 / 摘要归一 / 引用有效性判断 flow family | `ExternalSourceSummary`;`ExternalReferenceValidityView`;external basis availability | Step 6 owner 来源可用;Step 7~9 需保持 no external body,不得写治理执行或 artifact 正文。 |
| 后台维护与收敛(operation/support) | 读取材料刷新、追溯材料刷新、引用有效性收敛、一致性恢复 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MaintenanceRunRef`;`MaintenanceProgressView`;`MaterialConvergencePolicy` | `MethodAssetMaintenanceService`;maintenance boundary | read material refresh / trace material refresh / consistency recovery flow family;不得固定 job/worker/topic | `MaintenanceProgressView`;`ReadMaterialFreshnessView`;`TraceMaterialFreshnessView`;recovery progress | Step 6 owner 来源可用;Step 8/9 需按 operation 降级,不得成为业务 truth 修复路径。 |
| 外围包与方法集组织(peripheral) | 方法资产包、方法集组装、生态发现、外围采用评估 | `MethodPackage`;`MethodSetAssembly`;`MethodPackageView`;`MethodSetAssemblyView`;`MarketplaceContextRef`;`PackageCompositionRule` | `MethodPackageService`;`MethodSetAssemblyService`;peripheral organization boundary | package organization / method set assembly / ecosystem discovery flow family | `MethodPackage`;`MethodSetAssembly`;peripheral availability / validity | Step 6 owner 来源可用;Step 7~9 必须标注 peripheral,不得成为核心闭环前置。 |

#### 缺口标注

| 位置 | 当前问题 | 处理口径 |
|---|---|---|
| Step 6 对象 | 当前文件已有新对象主语和旧材料差异审计,但仍需根据 `0R.28` 做一次最终反查。 | `needs_recheck`: Step 5 完成后优先核对对象 owner、层级和排除清单。 |
| Step 7 接口 | 当前接口骨架必须重新回指本矩阵的 service / boundary owner。 | `needs_recheck`: 不得用旧 handler、DTO、port 或 adapter 补口。 |
| Step 8 处理流 | 当前 Step 8 有重启口径,但仍需确保每个 flow family 只使用 Step 6/7 当前 owner。 | `needs_recheck`: 旧 `CreateMethodContentDraft` / publish / snapshot / outbox / fingerprint flow 只能作为历史污染处理。 |
| Step 9 状态机 | 历史 Step 9 仍以 `MethodContentLifecycle`、`OutboxEventStatus` 和 `DefinitionSnapshot` 为核心。 | `needs_rewrite`: 必须从本矩阵的 state owner / state family 重新展开。 |
| 正式 `02-概要设计.md` §5~§9 | 正式文档可能仍保留旧主语、旧状态和旧 outbox / snapshot / fingerprint 主线。 | `blocked_until_step5_handoff`: Step 5 完成后先回填 §5 草稿,再审计 §6~§9。 |

#### 后续 Step 处理顺序

| 顺序 | 动作 | 门禁 |
|---:|---|---|
| 1 | 完成 Step 5 剩余跨组件闭环审计、旧材料差异审计和正式 §5 回填草稿。 | 不得跳过 Step 5 完成门禁。 |
| 2 | 反查 Step 6 关键对象。 | 每个对象必须回指 `0R.28` 和本矩阵;旧对象主语不得回流。 |
| 3 | 反查 Step 7 接口骨架。 | 每个接口 owner 必须来自本矩阵 service / boundary;不写完整 DTO 补缺口。 |
| 4 | 反查或重写 Step 8 处理流。 | flow family 必须使用当前对象和接口 owner;旧 publish/outbox/snapshot/fingerprint flow 禁止复用。 |
| 5 | 重写或深度反查 Step 9 状态机。 | 状态 owner 必须来自当前 Step 6 对象;旧 `MethodContentLifecycle` / `OutboxEventStatus` 不得作为当前状态主线。 |

#### 本模块停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 承接链是否覆盖 8 个组成部分 | pass | 每个组成部分均有 capability、Step 6 owner、Step 7 owner、Step 8 flow family、Step 9 state source 和当前处置。 |
| 旧主语污染是否阻断 | pass | 明确禁止旧 MethodContent、publish、snapshot、fingerprint、outbox 和旧状态主线用于闭口。 |
| operation / peripheral 是否降级 | pass | 后台维护标注 operation/support,外围包与方法集组织标注 peripheral。 |
| 后续处理顺序是否清楚 | pass | 已规定先完成 Step 5,再按 Step 6 -> Step 7 -> Step 8 -> Step 9 反查或重写。 |
| 是否越界 | pass | 未写字段、接口签名、DTO、port、处理流步骤、状态枚举、状态迁移、DDL、topic、job、配置项或证据 schema。 |

next_allowed_action: 等待用户确认后进入“跨组件闭环审计:先思考”;不得跳到旧材料差异审计、正式 §5 回填或 Step 6 反查。

---

### 0R.31 跨组件闭环审计:先思考

问题回答:

- 本模块不是新增第 9 个组成部分,也不是开始修改 Step 6~9,而是对 `0R.8`、`0R.9`~`0R.24`、`0R.26`、`0R.28` 和 `0R.30` 形成的组件链做闭环审计。
- 审计要回答五类问题:是否有同一 truth 被多个组成部分拥有;是否有职责重叠导致实现侧无法判断 owner;是否有对象、接口、状态没有来源;是否有 summary/ref 接缝被写成正文或交易;是否有旧 `MethodContent` / `DefinitionSnapshot` / `fingerprint` / `outbox` / publish 主线回流。
- “先思考”只定义审计维度、范围、重点风险和下一步写入结构;最终 pass/fail、缺口编号和处置结论放到“再写入”。

来源依据:

| 来源 | 可用于审计的内容 | 使用限制 |
|---|---|---|
| `0R.8` 组成部分总表 | 8 个组成部分、core/support/operation/peripheral 层级和不承担事项。 | 只能检查边界,不得新增组成部分。 |
| `0R.9`~`0R.24` 逐组件小循环 | 每个组成部分的 capability、对象线索、接缝和停审记录。 | 不把对象线索直接升格为字段或接口签名。 |
| `0R.26` 各部分交互总图 | 核心主链、支撑接缝、维护回路、外围隔离区。 | 只检查交互方向,不补具体流程步骤。 |
| `0R.28` 对象发现维度总表 | Step 6 对象候选、层级裁决和排除项。 | 对象 owner 不清时记录缺口,不得在本段补对象结构。 |
| `0R.30` Step 6~9 承接矩阵 | component -> capability -> object -> interface -> flow -> state 的承接链。 | 只审计承接是否闭合,不得提前修改 Step 6~9 文件。 |
| Historical note 后旧材料 | 旧 A-H、旧 P0 对象、旧状态和旧同步机制污染源。 | 当前仅作污染检查输入,不得恢复为 truth source。 |

审计维度定义:

| 审计维度 | 检查问题 | pass 条件 | fail 处理 |
|---|---|---|---|
| 重复 truth 审计 | 同一业务事实是否被多个组成部分共同持有或写入。 | 每个 truth 只有一个 owner,其他组成部分只能持 summary/ref/view。 | 记录 `duplicate_truth` 缺口,要求回到对应组件或 Step 6 owner 处修正。 |
| 职责重叠审计 | formalization、consumption、trace、maintenance、peripheral 是否职责交叉。 | 每个 capability 有明确主 owner 和协作边界。 | 记录 `responsibility_overlap` 缺口,在“再写入”中指定主 owner。 |
| 孤儿对象审计 | `0R.28` 对象候选和 `0R.30` 矩阵项是否都有组件来源。 | 每个对象 / interface / state family 都能回指组成部分和 capability。 | 记录 `orphan_owner` 缺口,后续 Step 6 反查前必须闭合。 |
| 接缝冲突审计 | summary/ref-only、relation/distribution、maintenance、peripheral 是否越界。 | 接缝只承载允许的信息形态,不吞并正文、交易、运行状态或治理执行。 | 记录 `seam_conflict` 缺口,禁止用旧流程或实现细节补口。 |
| 状态来源审计 | Step 9 状态来源是否来自当前 Step 6 对象。 | 状态 owner 来自当前对象候选或明确标注 needs_rewrite。 | 记录 `state_source_gap` 缺口,旧状态主线不得继续。 |
| 旧主语污染审计 | 旧 `MethodContent`、`DefinitionSnapshot`、`fingerprint`、`outbox`、publish 是否回流。 | 旧主语只作为历史污染项,不出现在当前承接链。 | 记录 `legacy_subject_pollution`,后续旧材料差异审计集中处理。 |

审计对象范围:

| 范围项 | 纳入 | 不纳入 |
|---|---|---|
| 组成部分 | `0R.8` 的 8 个最终组成部分。 | 不新增组件,不恢复旧 A-H 模块。 |
| capability | `0R.9`~`0R.24` 中每个组成部分已裁决的 capability family。 | 不补函数级行为、配置项、topic、job 或部署参数。 |
| 对象候选 | `0R.28` 中 core/support/operation/peripheral 对象候选。 | 不写字段全集、schema、DTO 或 persistence 结构。 |
| 下游承接 | `0R.30` 中 Step 6~9 承接链。 | 不修改 Step 6~9 文件,只记录 recheck / rewrite 要求。 |
| 旧材料 | Historical note 后旧内容、正式 `02-概要设计.md` §5~§9 的旧主语风险。 | 不把旧材料直接当成当前结论。 |

重点风险:

| 风险项 | 涉及组成部分 | 初步判断 | 后续处理 |
|---|---|---|---|
| 定义 truth 与正式版本 truth 混写 | 方法资产定义与目录;正式化与版本 | 需要确认 definition truth 只归定义侧,formal version 只归正式化侧。 | “再写入”中用重复 truth 表检查。 |
| 消费材料与可用性视图混写 | 受控消费;后台维护与收敛 | 需要确认消费材料是受控消费 owner,维护只刷新 derived material/freshness。 | “再写入”中用职责重叠表检查。 |
| 外部摘要与外部正文边界不清 | 外部摘要与引用;追溯与一致性保护 | 需要确认 external body 不进入本仓 truth,追溯只持 lineage / summary。 | “再写入”中用接缝冲突表检查。 |
| 关系 / 分发被误写成 marketplace 交易 | 关系与分发语义;外围包与方法集组织 | 需要确认 distribution context 是语义上下文,不是 listing/install/fulfillment。 | “再写入”中标注 peripheral / support 降级。 |
| 维护回路被误写成业务修复路径 | 后台维护与收敛;追溯与一致性保护 | 需要确认 maintenance 只能收敛 material/progress,不能改写核心 truth。 | “再写入”中用状态来源和接缝表检查。 |
| Step 9 旧状态主线回流 | 全部组成部分 | 风险最高,旧 `MethodContentLifecycle` / `OutboxEventStatus` 仍需后续重写或反查。 | “再写入”中继续保留 `needs_rewrite` 门禁。 |

下一步写入结构裁决:

| 模块 | 内容 |
|---|---|
| 0R.32.1 重复 truth 审计表 | 按 definition、formal version、consumption material、trace material、relation、external summary、maintenance、peripheral 分项检查 owner。 |
| 0R.32.2 职责重叠审计表 | 检查 formalization vs governance execution、consumption vs downstream runtime、trace/audit vs report、maintenance vs truth repair、package/set vs marketplace。 |
| 0R.32.3 孤儿对象与承接缺口表 | 对 `0R.28` / `0R.30` 中 owner 不清或 needs_recheck 项给出缺口状态。 |
| 0R.32.4 接缝冲突审计表 | 检查 summary/ref-only、support、operation、peripheral 接缝是否越界。 |
| 0R.32.5 状态来源与旧主语污染表 | 标注 Step 9 重写风险和旧主语禁入项。 |
| 0R.32.6 停审记录 | 给出是否允许进入“旧材料差异审计:先思考”的门禁结论。 |

复杂度 / 越界检查:

- 本模块不做正式 `02-概要设计.md` §5 回填,只在 Step 文件中形成闭环审计准备。
- 若发现 owner 不清,只能记录缺口和后续 recheck / rewrite 要求,不得在本段补字段、接口、流程或状态枚举。
- support / operation / peripheral 不得为了闭环而升格为核心 truth owner。
- 旧材料差异审计尚未开始,因此本段只能预览旧主语污染维度,不能直接改写 historical 内容。

本模块停审记录:

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否保持先思考 | pass | 本段只定义审计框架、范围、风险和下一步写入结构。 |
| 是否新增组成部分 | pass | 没有新增或合并 `0R.8` 的 8 个组成部分。 |
| 是否提前写 Step 6~9 | pass | 只引用 `0R.30` 承接矩阵做审计准备,未修改下游 Step。 |
| 是否提前回填正式 §5 | pass | 未写入正式 `02-概要设计.md`。 |
| 是否越界到实现细节 | pass | 未写字段全集、DTO、port 签名、流程步骤、状态枚举、DDL、topic、job 或配置项。 |

next_allowed_action: 等待用户确认后进入“跨组件闭环审计:再写入”;不得跳到旧材料差异审计、正式 §5 回填或 Step 6 反查。

---

### 0R.32 跨组件闭环审计:再写入

问题回答:

- 本轮跨组件闭环审计结论是:Step 5 新的 8 个组成部分可以作为当前 component truth 使用,核心主链、支撑接缝、operation 回路和 peripheral 隔离区已经闭合到概要层。
- 当前没有发现需要新增第 9 个组成部分的缺口;也没有发现必须把 support / operation / peripheral 升格为 core truth owner 的缺口。
- 仍需保留三类后续门禁:正式 `02-概要设计.md` §5~§9 旧材料污染审计、Step 6/7/8 owner 反查、Step 9 状态来源重写或深度反查。

#### 0R.32.1 重复 truth 审计表

| truth / material | 主 owner | 协作方可持有 | 审计结论 | 后续门禁 |
|---|---|---|---|---|
| 方法资产定义 truth | 方法资产定义与目录 | 正式化只引用 definition ref;消费只读 consumption material;追溯只持 lineage。 | pass | Step 6 反查 `MethodAssetDefinition` owner。 |
| 正式版本 truth | 正式化与版本 | 定义侧不持 formal decision;消费侧只读可用材料。 | pass | Step 8 不得恢复 publish / fingerprint flow。 |
| 消费材料 truth | 受控消费 | 后台维护只刷新 derived material / freshness;下游只消费 ref / material。 | pass_with_gate | Step 9 状态不得落成下游 runtime state。 |
| 追溯材料 / 影响摘要 | 追溯与一致性保护 | 外部摘要只给 basis/ref;维护只刷新 trace material。 | pass | 不把 report body 或 raw audit log 写成 truth。 |
| 关系与分发语义 | 关系与分发语义 | 外围包可引用 distribution context;不拥有 relation truth。 | pass | 后续不得写 marketplace transaction / listing / install。 |
| 外部摘要与引用 | 外部摘要与引用 | 正式化、追溯、消费只引用 accepted external summary/ref。 | pass | 旧材料差异审计继续检查 external body 是否回流。 |
| 维护进度 / 收敛材料 | 后台维护与收敛 | 核心组件可读取 freshness / recovery view。 | pass_with_gate | 维护不得改写 definition / formal version / consumption truth。 |
| 方法包 / 方法集外围组织 | 外围包与方法集组织 | core 只提供可引用资产和版本,不依赖包完成。 | pass | peripheral 不得成为 core 主链前置。 |

#### 0R.32.2 职责重叠审计表

| 重叠风险 | 裁决 | 允许交互 | 禁止交互 |
|---|---|---|---|
| definition vs formalization | definition owns identity/catalog truth;formalization owns formal version truth。 | formalization 读取 definition ref 和 basis summary。 | formalization 不能改写 definition body;definition 不能替代 formal decision。 |
| formalization vs governance execution | method-library 只承接 governance basis/ref。 | 接收治理依据摘要、规则引用和验收 basis。 | 不执行治理流程,不持 governance decision body。 |
| consumption vs downstream runtime | consumption owns controlled material / availability view。 | 下游通过受控 material / ref 消费。 | 不记录下游运行状态、任务状态或领域执行结果。 |
| trace/audit vs telemetry/report | trace owns lineage / impact summary / audit trail material。 | 可引用 evidence/ref/report summary。 | 不持 raw telemetry、完整 report body 或证据正文归档。 |
| maintenance vs truth repair | maintenance owns refresh/recovery progress。 | 可刷新 material、freshness、validity view。 | 不作为核心 truth 的直接创建、修正或迁移入口。 |
| package/set vs marketplace | peripheral owns package/set organization view。 | 可引用 marketplace context ref。 | 不实现 listing、transaction、install、fulfillment。 |

#### 0R.32.3 孤儿对象与承接缺口表

| 检查项 | 覆盖情况 | 状态 | 后续处理 |
|---|---|---|---|
| `0R.28` core 对象候选 | 均能回指 definition、formalization、consumption、trace/consistency 四段 core 主链。 | pass | Step 6 反查字段和层级时必须保留 owner 回指。 |
| `0R.28` support 对象候选 | relation/distribution、external summary/ref 均有 support owner。 | pass | Step 7/8 接口和流程必须标注 support,不得升格为 core。 |
| `0R.28` operation 对象候选 | maintenance task/run/progress/freshness 均有 operation/support owner。 | pass_with_gate | Step 8/9 必须降级为 maintenance flow/state,不得变成业务 truth。 |
| `0R.28` peripheral 对象候选 | package/set/view/context/rule 均有 peripheral owner。 | pass | 后续正式 §5 需明确 peripheral 不阻塞核心闭环。 |
| `0R.30` Step 6 object owner | 当前矩阵能给出 owner,但 Step 6 文件仍需最终反查。 | needs_recheck | Step 5 完成后优先 recheck Step 6。 |
| `0R.30` Step 7 interface owner | 当前矩阵能给出 service/boundary owner,但接口骨架需回指。 | needs_recheck | Step 7 不得用旧 handler/DTO/adapter 补口。 |
| `0R.30` Step 8 flow family | 当前矩阵能给出 flow family,但历史 flow 污染仍需排查。 | needs_recheck | 旧 publish/snapshot/outbox/fingerprint flow 不得复用。 |
| `0R.30` Step 9 state source | 当前矩阵给出新 state source,但历史状态主线仍冲突。 | needs_rewrite_or_recheck | Step 9 必须重写或深度反查。 |

#### 0R.32.4 接缝冲突审计表

| 接缝 | 当前允许形态 | 冲突形态 | 审计结论 |
|---|---|---|---|
| definition -> formalization | definition ref、basis summary、eligibility input。 | formalization 直接写 definition truth。 | pass |
| formalization -> consumption | formal version ref、availability basis、consumption material source。 | consumption 自行裁定 formal version。 | pass |
| consumption -> downstream | controlled material、availability view、boundary rule。 | downstream body、runtime state、task result 回写。 | pass_with_gate |
| trace -> external evidence | evidence lineage、summary/ref。 | artifact body、report body、raw log 入库为 truth。 | pass_with_gate |
| relation/distribution -> marketplace | distribution context、ecosystem ref。 | listing、transaction、install、fulfillment。 | pass |
| maintenance -> core material | refresh task、freshness view、recovery progress。 | maintenance 作为 core write path。 | pass_with_gate |
| peripheral -> core | package/set 引用 core asset/version。 | package/set 反向决定 core asset 是否成立。 | pass |

#### 0R.32.5 状态来源与旧主语污染表

| 状态 / 旧主语风险 | 当前处理 | 状态 |
|---|---|---|
| `MethodAssetDefinition` / catalog state | 由“方法资产定义与目录”承接。 | pass |
| `FormalizationState` / formal version availability | 由“正式化与版本”承接。 | pass |
| consumption material freshness / availability | 由“受控消费”承接,维护仅刷新 derived view。 | pass_with_gate |
| trace material / consistency status / audit material freshness | 由“追溯与一致性保护”承接,维护仅推动收敛。 | pass_with_gate |
| relation / distribution validity | 由“关系与分发语义”承接。 | pass |
| external basis availability | 由“外部摘要与引用”承接。 | pass |
| maintenance progress / recovery progress | 由“后台维护与收敛”承接,不得进入 core lifecycle。 | pass_with_gate |
| peripheral availability / validity | 由“外围包与方法集组织”承接,不得阻塞 core。 | pass |
| 旧 `MethodContentLifecycle` | 当前禁入;只能作为旧材料差异审计对象。 | blocked_as_current_truth |
| 旧 `OutboxEventStatus` | 当前禁入;不得作为 Step 9 状态来源。 | blocked_as_current_truth |
| 旧 `DefinitionSnapshot` / `fingerprint` | 当前禁入;不得恢复为正式版本或消费材料 truth。 | blocked_as_current_truth |
| 旧 publish 主线 | 当前禁入;不得作为 formalization 或 distribution flow。 | blocked_as_current_truth |

#### 0R.32.6 闭环缺口台账

| Gap ID | 位置 | 状态 | 说明 | 后续动作 |
|---|---|---|---|---|
| ML-S5-CLOSURE-001 | 8 个组成部分 truth owner | resolved | 当前未发现重复 core truth owner。 | 保持 `0R.8` / `0R.30` owner 口径。 |
| ML-S5-CLOSURE-002 | support / operation / peripheral 降级 | resolved | 支撑、维护和外围均已保留降级边界。 | 后续 Step 7~9 继续标注非 core。 |
| ML-S5-CLOSURE-003 | Step 6/7/8 owner 承接 | open_controlled | 当前矩阵已给 owner,但文件级反查尚未执行。 | Step 5 完成后按 Step 6 -> Step 7 -> Step 8 反查。 |
| ML-S5-CLOSURE-004 | Step 9 状态来源 | open_controlled | 当前新状态来源已列出,旧状态文件仍可能冲突。 | Step 9 必须重写或深度反查。 |
| ML-S5-CLOSURE-005 | 正式 `02-概要设计.md` §5~§9 旧主语污染 | open | 正式文档污染尚未审计。 | 下一模块进入旧材料差异审计。 |

#### 本模块停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否完成跨组件闭环审计 | pass | 已覆盖重复 truth、职责重叠、孤儿对象、接缝冲突、状态来源和旧主语污染。 |
| 是否允许进入旧材料差异审计 | pass | 当前 Step 5 内部组件链已足够支撑旧材料污染排查。 |
| 是否允许直接回填正式 §5 | blocked | 仍需先完成旧材料差异审计和正式 §5 回填草稿。 |
| 是否允许直接反查 Step 6~9 | blocked | 必须先完成 Step 5 剩余模块,再按顺序反查。 |
| 是否越界 | pass | 未写字段、接口签名、DTO、port、处理流步骤、状态枚举、DDL、topic、job、配置项或证据 schema。 |

next_allowed_action: 等待用户确认后进入“旧材料差异审计:先思考”;不得跳到旧材料差异审计:再写入、正式 §5 回填或 Step 6 反查。

---

### 0R.33 旧材料差异审计:先思考

问题回答:

- 本模块要审计的“旧材料”不是当前 truth source,而是会污染 Step 5 正式回填和 Step 6~9 后续反查的历史结论。
- 审计目标不是删除 historical note 后的旧内容,也不是现在重写正式 `02-概要设计.md`;目标是先给旧材料建立处理规则:哪些替换、哪些降级、哪些禁入、哪些仅保留为后续反查输入。
- 当前已知污染面集中在正式 `02-概要设计.md` §5~§9、historical Step 5、旧 Step 9 状态机,以及旧对象 / 接口 / flow 中的 `MethodContent`、publish、snapshot、fingerprint、outbox、P1 plugin/configuration 主线。

已核对的污染源:

| 来源 | 旧材料表现 | 对当前 Step 5 的风险 |
|---|---|---|
| 正式 `02-概要设计.md` §5 | 使用“方法定义生命周期与发布治理”“定义同步与快照供给”“基线初始化与恢复运维”“P1 资产打包与配置组装”等旧组成部分。 | 会把旧 A-H / P0-P1 主线重新变成正式组成部分。 |
| 正式 `02-概要设计.md` §6 | 仍以 `MethodContent`、subtype、`MethodContentLifecycle`、`DefinitionVersion`、`Fingerprint`、`OutboxEvent`、`DefinitionSnapshot` 等为对象主线。 | 会覆盖 `0R.28` 的新对象候选和 owner。 |
| 正式 `02-概要设计.md` §7 | 旧 command / query / consumer / event / job 骨架仍承接 publish、snapshot、outbox、fingerprint。 | 会让 Step 7 回到旧接口族。 |
| 正式 `02-概要设计.md` §8 | 仍有 `PublishMethodContent`、`CreateMethodContentDraft`、`ExportDefinitionSnapshot`、`RecalculateFingerprint` 等处理流。 | 会让 Step 8 丢失当前 8 个组成部分的 flow family。 |
| 正式 `02-概要设计.md` §9 | 仍以 `MethodContent` 状态和 `OutboxEvent` 状态为状态机。 | 会与 `0R.30` / `0R.32` 的状态来源冲突。 |
| historical Step 5 | 已有旧 completed 结果和旧模块状态表。 | 可做差异输入,但不得当成当前 Step 5 completed。 |
| 当前 Step 6~8 | 已有新口径,并多处显式阻断旧主语。 | 可作为新口径参考,但仍需等 Step 5 完成后正式反查。 |
| 当前 Step 9 | 仍保留旧 `MethodContentLifecycle` / `OutboxEventStatus` 主线。 | 需要标记为 rewrite 或 deep recheck,不得直接承接。 |

审计处理动作定义:

| 处理动作 | 含义 | 适用材料 |
|---|---|---|
| `replace` | 用当前 `0R.8` / `0R.28` / `0R.30` 的新组成部分、对象、flow family 或状态来源替换。 | 旧正式 §5 组成部分、旧 §6 对象、旧 §8 flow、旧 §9 状态。 |
| `demote` | 从 core truth 降级为 support、operation、peripheral 或后续输入。 | P1 packaging、baseline/recovery、distribution / marketplace 相关旧材料。 |
| `ref_only` | 只保留为 typed ref / summary / marker,不承接正文或实现机制。 | external source、artifact archive、governance basis、marketplace context。 |
| `historical_only` | 只作为历史污染审计依据,不得进入当前正式结论。 | 旧 A-H 模块、旧 P0 七类内容 subtype、旧 publish 主线。 |
| `forbidden_current_truth` | 当前明确禁入,后续若需要必须重新讨论并闭口。 | `MethodContent`、`DefinitionSnapshot`、`Fingerprint`、`OutboxEvent`、outbox relay。 |
| `needs_downstream_recheck` | Step 5 不直接裁决细节,但要求 Step 6~9 反查或重写。 | Step 6 对象细节、Step 7 接口、Step 8 流程、Step 9 状态。 |

审计维度定义:

| 审计维度 | 检查问题 | 输出形态 |
|---|---|---|
| 旧组成部分差异 | 旧 §5 / historical Step 5 的模块是否能映射到当前 8 个组成部分。 | old module -> current component / disposition 表。 |
| 旧对象差异 | 旧 §6 / Step 6 历史对象是否被替换、降级、保留为 ref 或禁入。 | old object -> current object / disposition 表。 |
| 旧接口差异 | 旧 command/query/event/job 是否被当前 Step 7 service/boundary owner 替换。 | old interface family -> current owner / disposition 表。 |
| 旧流程差异 | 旧 draft/review/publish/snapshot/fingerprint/outbox flow 是否禁入。 | old flow -> current flow family / disposition 表。 |
| 旧状态差异 | 旧 lifecycle / outbox status 是否仍可用。 | old state family -> current state source / rewrite gate 表。 |
| 旧实现机制差异 | outbox relay、snapshot export、fingerprint recalculation、object storage 等是否越过概要边界。 | mechanism -> allowed abstract form / forbidden detail 表。 |

重点裁决预案:

| 旧材料 | 预期裁决方向 | 理由 |
|---|---|---|
| `MethodContent` 作为 P0 总对象 | `forbidden_current_truth` / replace | 当前对象主线已经拆成 definition、formal version、consumption material、trace material 等业务 owner。 |
| `MethodContentLifecycle` | `forbidden_current_truth` / needs Step 9 rewrite | 当前状态必须来自新 Step 6 对象,不能复用 draft/review/published/deprecated 主线。 |
| `PublishMethodContent` | replace | 当前正式化与版本不是 publish 动作,应由 formalization / version capability 承接。 |
| `DefinitionSnapshot` | `ref_only` 或 forbidden | 当前外部 / artifact 只允许 safe ref / summary,不得承接 snapshot body。 |
| `Fingerprint` | forbidden as semantic source | 版本语义变化应由 explicit reason / marker 承接,不能靠 hash 漂移替代业务判断。 |
| `OutboxEvent` / outbox relay | forbidden as current mechanism | 概要阶段可有 outbound event candidate,但不恢复 outbox 存储 / relay / dead letter 机制。 |
| P1 plugin/configuration | demote / peripheral | 可映射到外围包与方法集组织或后续配置影响,不得进入 core。 |
| marketplace listing/install/fulfillment | forbidden / external boundary | 当前只允许 marketplace context ref,不承接交易、安装、履约正文。 |

下一步写入结构裁决:

| 模块 | 内容 |
|---|---|
| 0R.34.1 旧组成部分差异表 | 将正式 §5 / historical Step 5 旧模块映射到当前 8 个组成部分或禁入项。 |
| 0R.34.2 旧对象差异表 | 将 `MethodContent`、subtype、lifecycle、version、fingerprint、snapshot、outbox、P1 对象逐项裁决。 |
| 0R.34.3 旧接口 / 事件 / job 差异表 | 将旧 command/query/consumer/outbound/job 映射到当前接口 owner 或 forbidden。 |
| 0R.34.4 旧处理流差异表 | 将 draft/review/publish/snapshot/rebuild/fingerprint/outbox flow 映射到当前 flow family 或 forbidden。 |
| 0R.34.5 旧状态差异表 | 标注旧状态机禁入和 Step 9 rewrite / recheck 入口。 |
| 0R.34.6 正式文档污染处置表 | 明确正式 `02-概要设计.md` §5~§9 的回填 / 后续重装配顺序。 |
| 0R.34.7 停审记录 | 判断是否允许进入“正式 §5 回填草稿:先思考”。 |

复杂度 / 越界检查:

- 本模块不删除 historical note 后的旧内容,只新增当前 `0R` 审计判断。
- 本模块不修改正式 `02-概要设计.md`,也不把正式 §6~§9 一次性重写。
- 若旧材料仍可能有价值,只能标注为 ref-only、demote 或 needs_downstream_recheck,不能直接恢复为 current truth。
- Step 9 的旧状态机风险最大,在 Step 5 只给 rewrite gate,不在本段补状态枚举或迁移图。

本模块停审记录:

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否保持先思考 | pass | 只定义污染源、处理动作、审计维度、重点预案和下一步结构。 |
| 是否提前写差异审计正文 | pass | 具体 old -> new 裁决表留给 `0R.34`。 |
| 是否提前回填正式文档 | pass | 未修改正式 `02-概要设计.md`。 |
| 是否越界到 Step 6~9 改写 | pass | 只记录后续 recheck / rewrite gate。 |
| 是否越界到实现机制 | pass | 未写 outbox relay、snapshot store、hash algorithm、DDL、topic、job 参数或 adapter 细节。 |

next_allowed_action: 等待用户确认后进入“旧材料差异审计:再写入”;不得跳到正式 §5 回填草稿、正式文档回填或 Step 6 反查。

---

### 0R.34 旧材料差异审计:再写入

问题回答:

- 旧材料差异审计结论是:旧 `MethodContent` / publish / snapshot / fingerprint / outbox / P1 plugin 主线不得作为当前 Step 5 truth source。
- 正式 `02-概要设计.md` §5 必须用当前 `0R.8`、`0R.26`、`0R.28`、`0R.30`、`0R.32` 的新组成部分和边界重装配。
- 正式 `02-概要设计.md` §6~§9 暂不在本 Step 改写,但必须标记为污染区;后续只能在 Step 6~9 反查或重写完成后再回填。

#### 0R.34.1 旧组成部分差异表

| 旧组成部分 / 章节 | 当前处置 | 当前承接 | 裁决理由 |
|---|---|---|---|
| 方法定义生命周期与发布治理 | replace | 方法资产定义与目录;正式化与版本 | 旧章节把定义、生命周期、发布和治理 gate 混成一条主线;当前拆为 definition truth 与 formal version truth。 |
| 方法定义真相与规则 | replace | 方法资产定义与目录;正式化与版本;受控消费 | 保留 truth / rule 意图,但不再以 `MethodContent` 总对象承接。 |
| 关系校验与边界保护 | replace | 关系与分发语义;追溯与一致性保护 | 关系 integrity 与 consistency protection 分属不同 owner。 |
| 定义同步与快照供给 | forbidden_current_truth | 外部摘要与引用;受控消费;后台维护与收敛 | snapshot body / sync 机制禁入;只允许 summary/ref/material refresh。 |
| 查询解析与审计追溯 | replace | 受控消费;追溯与一致性保护 | query resolution 与 audit lineage 需要分开,不得合成读侧总模块。 |
| 基线初始化与恢复运维 | demote | 后台维护与收敛 | 只保留 operation/support 语义,不能成为 core truth write path。 |
| P1 资产打包与配置组装 | demote | 外围包与方法集组织;后续配置影响反查 | 只保留 peripheral organization,不得作为核心闭环前置。 |
| 旧 A-H 模块划分 | historical_only | 不直接承接 | 当前采用 8 个业务组成部分,不恢复旧字母模块。 |

#### 0R.34.2 旧对象差异表

| 旧对象 / 对象族 | 当前处置 | 当前替代 / 承接 | 后续门禁 |
|---|---|---|---|
| `MethodContent` | forbidden_current_truth | `MethodAssetDefinition`;`FormalMethodAssetVersion`;`MethodAssetConsumptionMaterial`;`MethodAssetTraceMaterial` | Step 6 不得恢复总对象。 |
| 7 类 `MethodContent subtype` | replace | definition kind / catalog / formalization basis / consumption context 等当前对象族 | 需要 Step 6 按当前对象 owner 重新筛选。 |
| `MethodContentLifecycle` | forbidden_current_truth | `FormalizationState`;availability / freshness / validity / progress state families | Step 9 必须重写或深度反查。 |
| `DefinitionVersion` | replace | `FormalMethodAssetVersion`;`VersionTransitionInvariant`;`VersionChangeReasonRef` | 不得用 publish 结果替代 formal version。 |
| `Fingerprint` / `CanonicalFingerprint` | forbidden_current_truth | `VersionSemanticsMarker`;`VersionChangeReasonRef`;trace / evidence lineage | 不能以 hash 漂移作为业务语义变化依据。 |
| `DefinitionReference` | replace | `MethodAssetDefinitionRef`;`FormalMethodAssetVersionRef`;`ExternalSourceRef` | typed ref 必须按当前边界来源生成。 |
| `AuditRecord` | replace | `MethodAssetAuditTrail`;`MethodAssetEvidenceLineage`;`ConsumptionImpactSummary` | 不保存 raw log / report body。 |
| `BoundaryViolation` | replace | `DefinitionBoundaryRule`;`DownstreamConsumptionBoundary`;`ExternalBodyBoundaryRule` | 作为规则 / boundary result,不做异常总对象。 |
| `OutboxEvent` | forbidden_current_truth | outbound event candidate only | 不恢复 outbox store / relay / dead letter 状态。 |
| `DefinitionSnapshot` | forbidden_current_truth / ref_only | `ArtifactArchiveRef`;`ExternalSourceSummary`;consumption material ref | 不保存 snapshot body。 |
| `DefinitionReadModel` | replace | `MethodAssetCatalogView`;`MethodAssetAvailabilityView`;support views | 读模型必须回指当前 owner。 |
| `DefinitionTraceProjection` | replace | `MethodAssetTraceMaterial`;`ConsumptionImpactSummary` | projection 不拥有 truth。 |
| `ViewProfileProjection` | replace | `MethodAssetAvailabilityView`;`ExternalReferenceValidityView`;peripheral views | view profile 不作为通用状态 owner。 |
| `MethodPlugin` | demote | `MethodPackage`;`MethodSetAssembly`;peripheral context | 不进入 core Step 6。 |
| `MethodConfiguration` | demote | 后续 Step 11 配置影响轮廓 | 不作为 Step 5 core component 对象。 |

#### 0R.34.3 旧接口 / 事件 / job 差异表

| 旧接口族 | 当前处置 | 当前承接方向 | 禁止回流 |
|---|---|---|---|
| `CreateMethodContentDraft` / `UpdateMethodContentDraft` | replace | `EstablishMethodAssetDefinition`;`AdjustMethodAssetDefinition` | 旧 draft payload 和 subtype body。 |
| `SubmitMethodContentForReview` | replace | formalization eligibility / basis evaluation family | review 状态机。 |
| `PublishMethodContent` | replace | `EvaluateMethodAssetFormalization`;`EstablishFormalMethodAssetVersion` | publish 作为正式化事实。 |
| `DeprecateMethodContent` / `RetireMethodContent` / `SupersedeMethodContent` | replace | formal version semantic change / retire / replacement family | lifecycle 状态迁移。 |
| `ExportDefinitionSnapshot` | forbidden_current_truth | external / artifact ref-only handoff | snapshot export body。 |
| governance gate consumers | ref_only | governance basis summary / accepted external summary | governance execution body。 |
| outbox relay / retry / dead letter jobs | forbidden_current_truth | outbound event candidate;maintenance progress only if redefined | outbox storage、topic、retry、dead letter。 |
| `RebuildDefinitionIndex` | demote | read material refresh / maintenance convergence | 不能修复 core truth。 |
| `RecalculateFingerprint` | forbidden_current_truth | version semantics / trace evidence re-evaluation only if redefined | fingerprint algorithm and hash drift。 |
| P1 plugin / configuration APIs | demote | package / method set peripheral APIs;Step 11 config impact | core API 或 marketplace 履约。 |

#### 0R.34.4 旧处理流差异表

| 旧处理流 | 当前处置 | 当前 flow family | 说明 |
|---|---|---|---|
| draft -> review -> publish | replace | definition establishment -> formalization evaluation -> formal version establishment | 当前不使用旧 lifecycle 串联。 |
| publish -> snapshot -> outbox | forbidden_current_truth | formal version event candidate + consumption material availability | snapshot / outbox 机制禁入。 |
| supersede / retire content | replace | version semantic change / version retirement | 以 formal version 为 owner。 |
| snapshot export | ref_only / forbidden body | artifact archive ref / external source summary | 只承接 safe ref 或 summary。 |
| query view profile resolve | replace | availability view / catalog view / validity view read family | view 由具体 owner 产生。 |
| baseline seed / replay | demote | maintenance / recovery progress | 不作为业务创建路径。 |
| fingerprint recalculation | forbidden_current_truth | explicit semantic marker / reason audit | 不靠 hash 算法判断业务变化。 |
| package publish / plugin install | demote / forbidden | peripheral package / set organization | 不写 marketplace listing / install / fulfillment。 |

#### 0R.34.5 旧状态差异表

| 旧状态族 | 当前处置 | 当前状态来源 | 后续动作 |
|---|---|---|---|
| `draft` / `in_review` | forbidden_current_truth | definition establishment status;formalization eligibility result | Step 9 重新讨论,不得沿用旧名。 |
| `published` | forbidden_current_truth | `FormalMethodAssetVersion`;availability view | 不能作为 publish lifecycle。 |
| `deprecated` / `retired` / `superseded` | replace | formal version semantic state / retirement / replacement relation | Step 9 按 formal version source 展开。 |
| `OutboxEventStatus.pending/published/failed/dead_letter` | forbidden_current_truth | outbound event candidate 不持状态;maintenance progress 另行定义 | 不进入当前 Step 9。 |
| snapshot freshness | replace | consumption material freshness / read material freshness | 只作为 derived material freshness。 |
| fingerprint drift | forbidden_current_truth | version semantics marker / trace evidence | 不作为状态。 |
| P1 package state | demote | peripheral availability / validity | 不阻塞 core。 |

#### 0R.34.6 正式文档污染处置表

| 正式文档位置 | 污染判断 | 当前处置 | 回填顺序 |
|---|---|---|---|
| §5 主要组成部分、职责与边界 | blocked_by_old_components | 必须用当前 Step 5 `0R` 重写结果替换。 | 下一模块先写 §5 回填草稿。 |
| §6 关键对象轮廓 | contaminated_by_old_objects | 暂不改正式文档;等待 Step 6 反查 / 重写。 | Step 5 完成后进入 Step 6。 |
| §7 API / 接口骨架 | contaminated_by_old_interface_family | 暂不改正式文档;等待 Step 7 反查。 | Step 6 闭合后处理。 |
| §8 关键处理流 | contaminated_by_old_flows | 暂不改正式文档;等待 Step 8 反查或重装配。 | Step 7 闭合后处理。 |
| §9 状态定义与状态流转 | contaminated_by_old_state_machine | 标记为 needs_rewrite_or_recheck。 | Step 6/8 闭合后优先重写。 |
| §10~§11 异常 / 配置 | pending_impact_check | 暂不改;等 Step 5~9 完成后确认受影响范围。 | 后续 Step 10/11 反查。 |
| §12~§14 承接 / 风险 / 参考 | blocked_by_02_restart | 暂不改;等 Step 5~13 全部完成后统一装配。 | Step 14 正式装配。 |

#### 0R.34.7 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否完成旧材料差异审计 | pass | 已覆盖旧组成部分、旧对象、旧接口、旧流程、旧状态和正式文档污染处置。 |
| 是否允许进入正式 §5 回填草稿 | pass | Step 5 当前已有组件、对象线索、交互总图、承接矩阵、闭环审计和旧材料差异裁决。 |
| 是否允许直接改正式 `02-概要设计.md` | blocked | 下一步仍先写回填草稿,用户确认后再回填正式文档。 |
| 是否允许直接进入 Step 6 | blocked | 必须先完成正式 §5 回填草稿和 Step 5 flow / 台账更新。 |
| 是否越界 | pass | 未写字段全集、DTO、port、完整流程步骤、状态迁移图、DDL、topic、worker、retry、hash 算法或 adapter 细节。 |

next_allowed_action: 等待用户确认后进入“正式 §5 回填草稿:先思考”;不得直接改正式 `02-概要设计.md`,不得跳到 Step 6 反查。

---

### 0R.35 正式 §5 回填草稿:先思考

问题回答:

- 本模块要生成的是正式 `02-概要设计.md` §5 的回填草稿结构,不是直接修改正式文档。
- 正式 §5 必须只承接当前 `0R` 的新 Step 5 结论,不得混入 historical note 后旧 Step 5 completed 内容。
- 正式 §5 要回答“主要组成部分、职责与边界”,因此应包含组成部分总表、核心主链 / 支撑 / operation / peripheral 分层、交互总图、对象发现线索、逐组成部分职责摘要、Step 6~9 承接门禁和旧材料禁入说明。

草稿来源裁决:

| 来源 | 是否进入正式 §5 草稿 | 使用方式 |
|---|---|---|
| `0R.8` 组成部分总表 | yes | 作为正式 §5.1 的主表来源。 |
| `0R.9`~`0R.24` 逐组件小循环 | yes_summarized | 压缩为正式 §5.4 逐组成部分摘要,不搬运全部中间过程。 |
| `0R.26` 各部分交互总图 | yes | 作为正式 §5.2 或 §5.3 的 ASCII 总图来源。 |
| `0R.28` 对象发现维度总表 | yes_summarized | 作为正式 §5 对 Step 6 的对象发现线索,不写对象字段。 |
| `0R.30` Step 6~9 承接矩阵 | yes_summarized | 作为正式 §5 的后续展开门禁和承接规则。 |
| `0R.32` 跨组件闭环审计 | yes_summarized | 只保留重复 truth、职责重叠、接缝和状态来源的结论。 |
| `0R.34` 旧材料差异审计 | yes_summarized | 只保留旧主语禁入和正式 §6~§9 污染处置说明。 |
| Historical note 后旧内容 | no | 只作为历史差异输入,不得进入正式 §5 草稿正文。 |
| 正式 `02-概要设计.md` 当前 §5 | no_direct_reuse | 当前 §5 是污染对象,只能被新草稿替换。 |

正式 §5 草稿结构预案:

| 正式小节 | 标题 | 主要内容 | 来源 |
|---|---|---|---|
| §5.1 | 组成部分总表 | 8 个组成部分、核心职责、主要代码主体、不承担事项。 | `0R.8`;`0R.32` |
| §5.2 | 分层与核心主链 | core 主链、support、operation/support、peripheral 的分层说明。 | `0R.8`;`0R.26`;`0R.32` |
| §5.3 | 各部分交互总图 | ASCII 图和图例,说明 definition -> formalization -> consumption -> trace 主链及支撑接缝。 | `0R.26` |
| §5.4 | 逐组成部分职责与边界摘要 | 每个组成部分的职责、capability、对象线索、非职责和接缝。 | `0R.9`~`0R.24` |
| §5.5 | 对象发现与后续展开线索 | Step 6 对象候选层级、排除项、support / operation / peripheral 降级规则。 | `0R.28`;`0R.30` |
| §5.6 | Step 6~9 承接门禁 | 对象、接口、流程、状态必须回指当前 Step 5;Step 9 需重写或深度反查。 | `0R.30`;`0R.32` |
| §5.7 | 旧材料禁入与正式文档污染处置 | 禁止旧 `MethodContent` / publish / snapshot / fingerprint / outbox 主线回流。 | `0R.34` |

正式草稿压缩规则:

| 内容类型 | 草稿写法 | 禁止写法 |
|---|---|---|
| 组成部分职责 | 用 1~3 句说明职责和边界。 | 不搬运完整思考记录。 |
| capability | 用 capability family 表达。 | 不写函数名、完整接口签名或 DTO。 |
| 对象线索 | 只列对象候选名、owner 和 Step 6 处理要求。 | 不写字段、工厂、持久化、状态迁移。 |
| 交互 | 写概要流向和接缝。 | 不写完整调用链、事务、topic、retry。 |
| 旧材料处置 | 写禁入 / 替换 / 降级规则。 | 不在正式 §5 复述旧章节正文。 |
| 后续门禁 | 写 Step 6~9 反查顺序和禁止事项。 | 不直接替 Step 6~9 做结论。 |

关键取舍:

| 取舍点 | 裁决 | 理由 |
|---|---|---|
| 是否把八个组成部分全部展开为长篇独立小节 | 采用摘要展开 | 正式 §5 需要可读,详细推理留在 calibration。 |
| 是否保留旧 §5 小节标题 | 不保留 | 旧标题承载旧 lifecycle / publish / snapshot 主线。 |
| 是否在 §5 直接修复正式 §6~§9 | 不修复 | §5 只给承接门禁;后续 Step 6~9 独立反查或重写。 |
| 是否把旧材料差异表完整搬入正式 §5 | 不完整搬入 | 正式正文只写禁入结论和污染处置摘要。 |
| 是否在本模块直接改正式文档 | 不改 | 必须先形成草稿,等待用户确认后再回填。 |

下一步写入结构裁决:

| 模块 | 内容 |
|---|---|
| 0R.36.1 正式 §5 回填草稿正文 | 按 §5.1~§5.7 写可直接回填的草稿。 |
| 0R.36.2 回填范围说明 | 明确下一步若用户确认,只替换正式 `02-概要设计.md` §5,不触碰 §6~§14。 |
| 0R.36.3 回填前检查清单 | 检查草稿是否只来自当前 `0R`,是否禁入旧主语,是否未写概要外细节。 |
| 0R.36.4 停审记录 | 判断是否允许进入正式文档回填或继续 flow / 台账更新。 |

复杂度 / 越界检查:

- 本模块只设计草稿结构,不写正式正文完整草稿。
- 本模块不修改正式 `02-概要设计.md`,也不触碰 §6~§14。
- 正式 §5 草稿可比单次 300 行更长,但写入时应按模块分批;当前只是结构预案。
- 草稿必须保留 Step 6~9 的阻塞状态,不得因为 §5 回填就宣布概要整体完成。

本模块停审记录:

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否完成先思考 | pass | 已给出来源裁决、正式小节结构、压缩规则、关键取舍和下一步写入结构。 |
| 是否直接改正式文档 | pass | 未修改正式 `02-概要设计.md`。 |
| 是否引用旧材料为 truth | pass | historical 内容仅作为禁入 / 差异审计对象。 |
| 是否越界到 Step 6~9 | pass | 只定义承接门禁,未写对象字段、接口、流程或状态。 |
| 是否允许进入回填草稿再写入 | pass | 可进入 `0R.36` 写正式 §5 草稿正文。 |

next_allowed_action: 等待用户确认后进入“正式 §5 回填草稿:再写入”;不得直接改正式 `02-概要设计.md`,不得跳到 flow / 台账更新或 Step 6 反查。

---

### 0R.36 正式 §5 回填草稿:再写入

问题回答:

- 本段给出可直接回填到正式 `02-概要设计.md` §5 的草稿。
- 本段只覆盖正式 §5;正式 §6~§14 仍按 `0R.34.6` 标记为污染区或待后续 Step 反查区,不能随 §5 一起改写。
- 本段不把旧 `MethodContent` / publish / snapshot / fingerprint / outbox / P1 plugin 主线带回正式正文。

#### 0R.36.1 正式 §5 回填草稿正文

##### 5. 主要组成部分、职责与边界

本仓的概要组成部分以“方法资产可被定义、正式化、受控消费、追溯和安全扩展”为主线展开。当前设计不再采用旧 `MethodContent` 生命周期、publish、snapshot、fingerprint、outbox 或 P1 plugin 主线作为组成部分来源。

本节只定义组成部分、职责、边界、对象发现线索和后续展开门禁。对象字段、接口签名、处理流步骤、状态迁移、持久化结构、消息 topic、任务参数和配置项不在本节展开。

##### 5.1 组成部分总表

| 组成部分 | 层级 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|---|
| 方法资产定义与目录 | core | 持有方法资产定义 truth、稳定 typed ref、目录识别和定义边界。 | definition / catalog / boundary rule 相关 domain 与 application 主体。 | 不裁决正式版本,不提供下游运行事实,不保存外部正文。 |
| 正式化与版本 | core | 裁定方法资产是否形成正式版本,维护正式版本语义、依据和版本变更边界。 | formalization / version / eligibility / basis summary 主体。 | 不执行治理流程,不把 publish 或 fingerprint 当作正式化依据。 |
| 受控消费 | core | 生成和保护下游可消费材料,区分 definition truth 与 use material,维护可用性视图。 | consumption material / availability view / downstream boundary 主体。 | 不记录下游运行状态,不让下游修改本仓 truth。 |
| 追溯与一致性保护 | core | 维护追溯材料、影响摘要、审计线索和一致性保护边界。 | trace material / impact summary / audit trail / consistency rule 主体。 | 不保存 raw log、report body 或外部证据正文。 |
| 关系与分发语义 | support | 管理方法资产关系、分发语义和生态可发现上下文。 | relation / distribution context / integrity rule 主体。 | 不实现 marketplace listing、交易、安装或履约。 |
| 外部摘要与引用 | support | 接收和归一外部来源摘要,只保留 safe ref / summary / marker。 | external source summary / artifact ref / governance basis ref 主体。 | 不保存标准全文、治理执行正文、artifact 正文或外部 API payload。 |
| 后台维护与收敛 | operation/support | 刷新读取材料、追溯材料和引用有效性,推动一致性恢复进度。 | refresh task / recovery task / maintenance progress / freshness view 主体。 | 不作为业务 truth 创建或修复路径,不固定 worker/topic/retry 机制。 |
| 外围包与方法集组织 | peripheral | 组织方法资产包、方法集和外围生态发现材料。 | method package / method set assembly / peripheral view 主体。 | 不阻塞 core 主链,不表示 marketplace 履约或 artifact 包正文。 |

##### 5.2 分层与核心主链

核心主链只包含会影响方法资产成立、正式版本、受控消费和追溯一致性的组成部分:

```text
方法资产定义与目录
  -> 正式化与版本
  -> 受控消费
  -> 追溯与一致性保护
```

支撑层提供关系、分发、外部依据和引用有效性,但不拥有核心 truth:

```text
关系与分发语义
外部摘要与引用
```

operation/support 层负责维护材料刷新、收敛和恢复进度,不能越权成为业务写路径:

```text
后台维护与收敛
```

peripheral 层用于生态组织和外围发现,不得反向决定 core 主链是否成立:

```text
外围包与方法集组织
```

##### 5.3 各部分交互总图

```text
[方法资产定义与目录]
        |
        v
[正式化与版本] ---- receives basis/ref ---- [外部摘要与引用]
        |
        v
[受控消费] <---- relation/distribution ---- [关系与分发语义]
        |
        v
[追溯与一致性保护]
        ^
        |
[后台维护与收敛] ---- refreshes derived material / freshness only

[外围包与方法集组织] ---- references core asset/version/distribution context only
```

交互规则:

| 接缝 | 允许 | 禁止 |
|---|---|---|
| 定义到正式化 | definition ref、basis summary、eligibility input。 | 正式化改写 definition truth。 |
| 正式化到消费 | formal version ref、availability basis、consumption material source。 | 消费侧自行裁定正式版本。 |
| 消费到追溯 | consumption material ref、impact source、boundary result。 | 下游运行事实回写本仓 truth。 |
| 外部摘要到核心 | safe summary、typed ref、basis marker。 | 外部正文、artifact body、治理执行正文。 |
| 关系 / 分发到消费 | relation integrity、distribution context。 | marketplace 交易、安装、履约状态。 |
| 维护到核心材料 | freshness view、recovery progress、refresh result summary。 | 维护任务直接修复核心 truth。 |
| 外围到核心 | package / set 引用 core typed ref。 | package / marketplace 反向决定 core 是否成立。 |

##### 5.4 逐组成部分职责与边界摘要

| 组成部分 | capability family | 对象发现线索 | 边界摘要 |
|---|---|---|---|
| 方法资产定义与目录 | 定义建立、定义调整、目录识别、定义边界保护。 | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`MethodAssetDefinitionRef`;`MethodAssetCatalogView`;`DefinitionBoundaryRule`。 | 只持有定义 truth 和目录识别,不裁决正式化、不承接外部正文。 |
| 正式化与版本 | 正式化资格、正式版本建立、版本语义变化、依据承接。 | `FormalMethodAssetVersion`;`FormalizationState`;`FormalizationBasisSummary`;`FormalizationEligibilityRule`;`VersionTransitionInvariant`。 | 正式化依据只能来自可追溯 summary/ref,不恢复 publish / fingerprint 机制。 |
| 受控消费 | 消费材料、可用性判断、Definition vs Use 保护、下游边界。 | `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`DownstreamConsumptionBoundary`;`ConsumptionContextRef`;`DefinitionVsUseRule`。 | 下游只能消费受控材料,不能把运行状态或执行结果写回本仓。 |
| 追溯与一致性保护 | 追溯材料、影响摘要、审计线索、一致性保护。 | `MethodAssetTraceMaterial`;`ConsumptionImpactSummary`;`MethodAssetAuditTrail`;`MethodAssetEvidenceLineage`;`ConsistencyProtectionRule`。 | 只保存 lineage / summary / safe marker,不保存 raw log 或 report body。 |
| 关系与分发语义 | 关系建立、关系完整性、分发上下文、生态可发现语义。 | `MethodAssetRelation`;`MethodAssetDistributionContext`;`MethodAssetDistributionRef`;`RelationIntegrityRule`;`DistributionContextView`。 | 不实现 marketplace 交易链路,不表达运行依赖图或推荐算法。 |
| 外部摘要与引用 | 外部来源摘要、引用有效性、artifact / governance / standard ref-only。 | `ExternalSourceSummary`;`ExternalSourceRef`;`ArtifactArchiveRef`;`GovernanceBasisRef`;`ExternalBodyBoundaryRule`;`ExternalReferenceValidityView`。 | 外部材料只进入 summary/ref/marker,不进入正文归档。 |
| 后台维护与收敛 | read material refresh、trace material refresh、reference validity convergence、consistency recovery。 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MaintenanceRunRef`;`MaintenanceProgressView`;`MaterialConvergencePolicy`。 | 只推动 derived material 和 progress,不作为业务 truth repair。 |
| 外围包与方法集组织 | package organization、method set assembly、ecosystem discovery、peripheral adoption。 | `MethodPackage`;`MethodSetAssembly`;`MethodPackageView`;`MethodSetAssemblyView`;`MarketplaceContextRef`;`PackageCompositionRule`。 | 外围组织不阻塞 core,不持 marketplace listing/install/fulfillment truth。 |

##### 5.5 对象发现与后续展开线索

Step 6 必须从本节的组成部分和 capability 出发重新核对对象 owner。对象候选分为四类:

| 类别 | 代表对象 | Step 6 处理要求 |
|---|---|---|
| core truth / material | `MethodAssetDefinition`;`FormalMethodAssetVersion`;`MethodAssetConsumptionMaterial`;`MethodAssetTraceMaterial`。 | 必须明确 owner、业务语义和 typed ref 来源。 |
| support summary / ref / view | `MethodAssetRelation`;`ExternalSourceSummary`;`ExternalSourceRef`;`DistributionContextView`。 | 必须保持 summary/ref-only 或 support view,不得升级为 core truth。 |
| operation / freshness / recovery | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`MaintenanceProgressView`;`MaterialConvergencePolicy`。 | 必须标注 operation/support,不得改写核心 truth。 |
| peripheral organization | `MethodPackage`;`MethodSetAssembly`;`MarketplaceContextRef`;`PackageCompositionRule`。 | 必须标注 peripheral,不得成为核心闭环前置。 |

以下旧对象不得作为当前 Step 6 来源: `MethodContent`、`MethodContentLifecycle`、`DefinitionSnapshot`、`Fingerprint`、`OutboxEvent`、旧 P0 subtype 总表、旧 P1 plugin/configuration 主线。若后续确有需要,必须按当前组成部分重新讨论并闭口。

##### 5.6 Step 6~9 承接门禁

| 后续 Step | 承接要求 | 禁止事项 |
|---|---|---|
| Step 6 关键对象轮廓 | 每个对象必须回指本节的组成部分和 capability。 | 不得恢复旧 `MethodContent` 总对象、snapshot、fingerprint、outbox。 |
| Step 7 API / 接口骨架 | 每个 service / boundary owner 必须来自本节组成部分。 | 不得使用旧 draft/review/publish command 或 outbox relay API 补口。 |
| Step 8 关键处理流 | 每个 flow family 必须使用 Step 6 对象和 Step 7 owner。 | 不得恢复 publish -> snapshot -> outbox 或 fingerprint recalculation 主线。 |
| Step 9 状态定义与状态流转 | 状态 owner 必须来自当前 Step 6 对象。 | 不得沿用 `MethodContentLifecycle` 或 `OutboxEventStatus`。 |

处理顺序固定为:先完成正式 §5 回填,再反查 Step 6;Step 6 闭合后再反查 Step 7;Step 7 闭合后再反查 Step 8;Step 9 必须在当前对象和流程来源闭合后重写或深度反查。

##### 5.7 旧材料禁入与正式文档污染处置

当前正式文档 §5~§9 仍包含旧主线。正式 §5 回填后,以下处置规则继续有效:

| 旧材料 | 当前处置 |
|---|---|
| 旧 §5 组成部分标题 | 用本节当前 8 个组成部分替换。 |
| `MethodContent` 和旧 subtype | 禁止作为当前 truth source。 |
| draft / review / published lifecycle | 禁止作为当前状态机来源。 |
| publish flow | 替换为 formalization / formal version 相关能力。 |
| `DefinitionSnapshot` / snapshot export | 禁止作为当前正文或供给机制;外部 archive 只能通过 safe ref 表达。 |
| `Fingerprint` / hash drift | 禁止作为版本语义判断依据。 |
| `OutboxEvent` / relay / dead letter | 禁止作为当前机制;事件协作后续需按当前对象重新推导。 |
| marketplace listing / install / fulfillment | 禁止进入本仓;只允许 marketplace context ref 或 peripheral discovery summary。 |

正式 §6~§9 不随本节一次性回填。它们必须在对应 Step 反查或重写完成后,再按新的对象、接口、流程和状态来源重装配。

#### 0R.36.2 回填范围说明

| 项目 | 范围 |
|---|---|
| 可回填范围 | 正式 `projects/L3-method-library/02-概要设计.md` 的 `## 5. 主要组成部分、职责与边界`。 |
| 不可触碰范围 | 正式 `02-概要设计.md` 的 §6~§14。 |
| 回填方式 | 用户确认后,用 `0R.36.1` 草稿替换正式 §5 的现有旧内容。 |
| 回填后状态 | 只代表正式 §5 与当前 Step 5 中间产物对齐;不代表概要设计整体完成。 |
| 回填后下一步 | 更新 flow / 台账,再进入 Step 6 反查或重写。 |

#### 0R.36.3 回填前检查清单

| 检查项 | 结论 | 说明 |
|---|---|---|
| 草稿是否只来自当前 `0R` | pass | 来源为 `0R.8`、`0R.26`、`0R.28`、`0R.30`、`0R.32`、`0R.34`。 |
| 是否恢复旧主语 | pass | 明确禁入 `MethodContent`、publish、snapshot、fingerprint、outbox。 |
| 是否写入概要外细节 | pass | 未写字段全集、接口签名、DTO、port、流程步骤、状态迁移、DDL、topic、worker、配置项。 |
| 是否误改正式文档 | pass | 本段只写 calibration 草稿,未修改正式 `02-概要设计.md`。 |
| 是否允许直接进入 Step 6 | blocked | 需要用户确认后先完成正式 §5 回填和 flow / 台账更新。 |

#### 0R.36.4 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否完成正式 §5 回填草稿 | pass | 已写出可直接回填的 §5.1~§5.7 草稿。 |
| 是否允许正式回填 §5 | wait_user_confirm | 需要用户确认后再修改正式 `02-概要设计.md`。 |
| 是否允许进入 flow / 台账更新 | blocked | 正式 §5 还未回填。 |
| 是否允许进入 Step 6 | blocked | Step 5 正式文档和台账尚未闭合。 |
| 是否越界 | pass | 未触碰正式 §6~§14,未写概要外实现细节。 |

next_allowed_action: 等待用户确认后将 `0R.36.1` 回填到正式 `02-概要设计.md` §5;不得改 §6~§14,不得进入 flow / 台账更新或 Step 6 反查。

---

### 0R.37 正式 §5 回填记录

问题回答:

- 已将 `0R.36.1` 的正式 §5 草稿回填到 `projects/L3-method-library/02-概要设计.md` 的 `## 5. 主要组成部分、职责与边界`。
- 本次只替换正式 §5,没有改写正式 §6~§14。
- 正式 §6~§9 仍保留旧对象、旧接口、旧流程和旧状态污染,必须在 Step 6~9 反查或重写阶段处理。

回填范围:

| 项目 | 记录 |
|---|---|
| 回填目标 | `projects/L3-method-library/02-概要设计.md` |
| 回填范围 | `## 5. 主要组成部分、职责与边界` 到 `## 6. 关键对象轮廓` 之前 |
| 回填来源 | `0R.36.1 正式 §5 回填草稿正文` |
| 未触碰范围 | 正式 §6~§14 |
| 回填后标题 | `5.1` 组成部分总表;`5.2` 分层与核心主链;`5.3` 各部分交互总图;`5.4` 逐组成部分职责与边界摘要;`5.5` 对象发现与后续展开线索;`5.6` Step 6~9 承接门禁;`5.7` 旧材料禁入与正式文档污染处置 |

回填后检查:

| 检查项 | 结论 | 说明 |
|---|---|---|
| §5 是否改为当前 8 个组成部分 | pass | 旧 7 个组成部分已替换为当前 core / support / operation / peripheral 结构。 |
| §5 是否仍恢复旧 MethodContent 主线 | pass | §5 只在禁入说明中提及旧主语,不把它作为 truth source。 |
| §6 起始锚点是否保留 | pass | `## 6. 关键对象轮廓` 仍作为下一章起点。 |
| 是否改写 §6~§14 | pass | 本轮未主动改写 §6~§14;已有脏改动保持原状。 |
| 是否允许直接进入 Step 6 | blocked | 还需要完成 flow / 台账更新模块。 |

next_allowed_action: 等待用户确认后进入“flow / 台账更新:先思考”;不得跳到 Step 6 反查。

---

### 0R.38 flow / 台账更新:先思考

问题回答:

- 当前 Step 5 的业务内容、闭环审计、旧材料差异审计和正式 §5 回填已经完成,但还不能直接跳到 Step 6。
- 本模块需要先规划最后一次 flow / 台账更新:哪些状态应标为 Step 5 rewritten / completed,哪些下游 Step 仍 blocked_by_step5_rewrite 解除为 needs_recheck,哪些正式文档污染 gap 仍必须保留。
- “先思考”只定义更新策略和写入范围;真正修改 flow / 台账 completion 状态放到“再写入”。

状态裁决:

| 项目 | 当前事实 | 本模块裁决 |
|---|---|---|
| Step 5 中间产物 | `0R.1`~`0R.37` 已完成,正式 §5 已回填。 | 可在“再写入”标记 Step 5 rewrite completed。 |
| 正式 `02-概要设计.md` §5 | 已替换为当前 8 个组成部分和 Step 6~9 门禁。 | 可视为 §5 formal aligned。 |
| 正式 `02-概要设计.md` §6~§9 | 仍包含旧对象、旧接口、旧流程、旧状态主线。 | 不得视为 aligned;必须继续保留污染 gap。 |
| Step 6 文件 | 当前已有新对象材料,但需要按新 §5 / `0R.28` / `0R.30` 反查。 | 下一恢复点应进入 Step 6 recheck,不是直接 completed。 |
| Step 7 / Step 8 | 已有较新接口 / 流程材料,但必须在 Step 6 闭合后反查。 | 仍 blocked_by_step6_recheck。 |
| Step 9 | 仍是旧状态机污染重灾区。 | 标记 needs_rewrite_or_deep_recheck。 |

flow / 台账写入范围:

| 文件 | 下一步可写内容 | 禁止内容 |
|---|---|---|
| `02_hld_step_05_components_boundary.md` | `0R.39` 写 Step 5 完成记录、后续反查门禁、停审记录。 | 不再新增业务组成部分或改 Step 6 对象。 |
| `02_hld_calibration_flow.md` | 将 Step 5 标记为 rewritten_completed / pass,把当前恢复点切到 Step 6 反查入口。 | 不把 Step 6~9 一次性标 completed。 |
| `project_execution_ledger.md` | 更新当前恢复点、文档级进度、全局 blocker 和恢复顺序。 | 不删除未解决的 §6~§9 污染 blocker。 |
| `02-概要设计.md` | 本模块不再改正式文档。 | 不修改 §6~§14。 |

blocker / gap 处置预案:

| Gap | 当前处置 |
|---|---|
| ML-S5-GAP-001 flow / 台账曾指向 Step 12 | resolved,继续保持 resolved。 |
| ML-S5-GAP-002 正式 §5~§9 旧主语污染 | 拆分为 §5 resolved,§6~§9 open。 |
| ML-S5-GAP-003 Step 9 旧状态主线 | 保持 open,并升级为 Step 9 rewrite / deep recheck 前置门禁。 |
| Step 6 owner 反查 | 新增或保留为 next recovery gate。 |
| Step 7 / 8 反查 | 保留 blocked_by_step6_recheck。 |

下一步写入结构裁决:

| 模块 | 内容 |
|---|---|
| 0R.39.1 Step 5 完成记录 | 写明 Step 5 rewrite 已完成到正式 §5,并列出完成依据。 |
| 0R.39.2 下游反查门禁 | 写 Step 6 -> Step 7 -> Step 8 -> Step 9 的恢复顺序。 |
| 0R.39.3 flow 更新 | 在 `02_hld_calibration_flow.md` 改当前恢复点和 Step 总任务表。 |
| 0R.39.4 项目台账更新 | 在 `project_execution_ledger.md` 改当前恢复点、文档进度、blocker、恢复顺序。 |
| 0R.39.5 停审记录 | 明确是否允许进入 Step 6 recheck。 |

复杂度 / 越界检查:

- 本模块不再讨论 Step 5 业务内容,只讨论状态和恢复点。
- Step 5 completed 不等于 `02-概要设计.md` completed;正式 §6~§14 仍需后续反查或重装配。
- flow / 台账更新必须保留“一个 Step 一个 Step”的顺序,不得把 Step 6~9 自动合并处理。
- `project_execution_ledger.md` 当前未跟踪,但已作为本轮项目级台账使用;下一步继续更新它,不改无关文件。

本模块停审记录:

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否完成先思考 | pass | 已定义 completion 裁决、写入范围、gap 处置和下一步结构。 |
| 是否把 Step 5 直接标 completed | pass | 本段未实际改 completion 状态,留给 `0R.39`。 |
| 是否跳到 Step 6 | pass | 仍停在 flow / 台账更新。 |
| 是否改正式文档 | pass | 未修改正式 `02-概要设计.md`。 |
| 是否保留下游污染 gap | pass | §6~§9 污染仍保留为后续门禁。 |

next_allowed_action: 等待用户确认后进入“flow / 台账更新:再写入”;不得跳到 Step 6 反查。

---

### 0R.39 flow / 台账更新:再写入

问题回答:

- Step 5 rewrite 已完成:当前 `0R.1`~`0R.38` 均已形成记录,正式 `02-概要设计.md` §5 已回填为当前 8 个组成部分和 Step 6~9 承接门禁。
- Step 5 完成不等于 `02-概要设计.md` 完成;正式 §6~§9 仍有旧对象、旧接口、旧流程和旧状态污染,必须按 Step 6 -> Step 7 -> Step 8 -> Step 9 顺序反查或重写。
- 当前下一恢复点只允许进入 Step 6 关键对象轮廓反查的“先思考”模块。

#### 0R.39.1 Step 5 完成记录

| 完成项 | 依据 | 结论 |
|---|---|---|
| 组件候选池与最终组成部分 | `0R.5`~`0R.8` | 当前 8 个组成部分成立。 |
| 逐组件 capability 小循环 | `0R.9`~`0R.24` | 每个组成部分已有职责、capability、对象线索和接缝。 |
| 交互总图和对象发现 | `0R.25`~`0R.28` | 已形成核心主链、支撑接缝、维护回路、外围隔离区和对象候选。 |
| Step 6~9 承接矩阵 | `0R.29`~`0R.30` | 已给出 component -> object -> interface -> flow -> state 的反查线索。 |
| 跨组件闭环审计 | `0R.31`~`0R.32` | 已检查重复 truth、职责重叠、孤儿对象、接缝冲突和状态来源。 |
| 旧材料差异审计 | `0R.33`~`0R.34` | 已裁决旧 MethodContent / publish / snapshot / fingerprint / outbox 主线禁入。 |
| 正式 §5 回填 | `0R.35`~`0R.37`;正式 `02-概要设计.md` §5 | 已将当前 Step 5 结论回填到正式 §5。 |

#### 0R.39.2 下游反查门禁

| 顺序 | 下一动作 | 进入条件 | 禁止事项 |
|---:|---|---|---|
| 1 | Step 6 关键对象轮廓反查:先思考 | 本 Step 5 rewritten_completed。 | 不直接修改对象字段,不跳到 Step 7。 |
| 2 | Step 6 关键对象轮廓反查:再写入 | 用户确认 Step 6 反查思路。 | 不恢复旧 `MethodContent` / snapshot / fingerprint / outbox。 |
| 3 | Step 7 接口骨架反查 | Step 6 owner 和对象层级闭合。 | 不用旧 command / handler / DTO 补口。 |
| 4 | Step 8 处理流反查 | Step 7 service / boundary owner 闭合。 | 不恢复 publish / snapshot / outbox / fingerprint flow。 |
| 5 | Step 9 状态机重写或深度反查 | Step 6 / Step 8 状态来源闭合。 | 不沿用旧 `MethodContentLifecycle` / `OutboxEventStatus`。 |

#### 0R.39.3 flow 更新记录

| 文件 | 更新结果 |
|---|---|
| `02_hld_calibration_flow.md` | 当前恢复点应切到 Step 6 关键对象轮廓 / 反查:先思考。 |
| `02_hld_calibration_flow.md` Step 总任务表 | Step 5 应标记 `rewritten_completed`;Step 6 应标记 `recheck_ready`;Step 7~9 仍等待 Step 6 / Step 7 闭合。 |
| `02_hld_calibration_flow.md` blocker 台账 | §5 污染 resolved;§6~§9 污染和 Step 9 状态污染保持 open。 |

#### 0R.39.4 项目台账更新记录

| 文件 | 更新结果 |
|---|---|
| `project_execution_ledger.md` 当前恢复点 | 应切到 `02-概要设计.md` / Step 6 关键对象轮廓 / 反查:先思考。 |
| `project_execution_ledger.md` 文档级进度 | `02-概要设计.md` 仍为 in_progress,当前 Step 为 Step 6 recheck。 |
| `project_execution_ledger.md` blocker 台账 | `ML-S5-GAP-002` 拆分为 §5 resolved、§6~§9 open;`ML-S5-GAP-003` 继续 open。 |
| `project_execution_ledger.md` 恢复顺序 | 下一模块改为 Step 6 关键对象轮廓反查:先思考。 |

#### 0R.39.5 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 5 是否可标记 rewritten_completed | pass | 中间产物和正式 §5 已闭合。 |
| 是否允许进入 Step 6 反查 | pass | 只允许进入 Step 6 反查的先思考模块。 |
| 是否允许直接进入 Step 7~9 | blocked | 必须先完成 Step 6 owner / 对象反查。 |
| 是否允许把 `02-概要设计.md` 标记 completed | blocked | 正式 §6~§14 仍需后续反查和重装配。 |
| 是否保留旧主语污染门禁 | pass | §6~§9 污染和 Step 9 状态污染仍为 open。 |

next_allowed_action: 等待用户确认后进入“Step 6 关键对象轮廓反查:先思考”;不得跳到 Step 7、Step 8 或 Step 9。

---

> Historical note: 以下原 §1 起内容是上一轮 Step 5 completed 结果。当前仅作为重写输入和差异审计材料,不得被后续 Step 6~12 当成已完成真相源。

## 1. 必读文档

| 文档 | 读取重点 | 对 Step 5 的约束 |
|---|---|---|
| `standards/document/概要设计讨论流程_SOP.md` Step 5 | Step 5 必须回答主要组成部分、职责、非职责、capability、代码主体、对象发现线索和 Step 6 展开门禁。 | 按主要组成部分逐个小循环;每个部分完成后停审;全部完成后做跨部分闭环审计。 |
| `standards/document/概要设计书写规范.md` 4.5 | Step 5 必须输出组成部分总表、对象发现维度表、交互总图、每个主要组成部分独立小节和 Step 6 展开门禁。 | 本 Step 只写职责、代码主体 / 模块、接缝和对象发现线索,不写字段、函数、协议 schema 或持久化结构。 |
| `standards/document/设计文档讨论中间产物规范.md` | 长文档必须先搭框架,再按模块先思考、后写入,并增量更新模块状态。 | 本文件先建立框架和任务台账;业务内容按模块逐步写入。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 设计结论必须避免后续 schema / port / state / boundary 缺口。 | 组成部分和对象候选必须能回指当前 00 / 01,不能自行发明实现机制。 |
| `projects/L3-method-library/00-需求文档.md` | 核心能力闭环、功能需求、业务规则、数据所有权、接口依赖、风险和追溯矩阵。 | 组成部分必须覆盖定义、目录、正式化、版本、受控消费、追溯、一致性和外围隔离。 |
| `projects/L3-method-library/01-架构设计.md` | 职责边界、系统上下文、子域、运行承载、数据所有权、交互通信、横切关注和风险。 | 组成部分必须承接当前架构子域和逻辑承载,但不把运行承载或技术适配误写成业务组成部分。 |
| `design-calibration/02_hld_step_04_code_subject_framework.md` | 已收稳的代码主体候选和实现分层视图。 | Step 5 从这些主体候选中收敛业务主要组成部分,并区分外围增强与核心闭环。 |

---

## 2. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块搭建。 |
| 整体模块搭建 | done | Step 5 文件框架、模块顺序和状态台账 | pass | 进入“组成部分候选池:先思考”。 |
| 组成部分候选池:先思考 | done | 从 Step 4 候选主体收敛组成部分候选池的诊断和取舍 | pass | 进入“组成部分候选池:再写入”。 |
| 组成部分候选池:再写入 | done | 组成部分候选池和采用 / 排除说明 | pass | 进入“组成部分总表:先思考”。 |
| 组成部分总表:先思考 | done | 主要组成部分数量、边界和排序判断 | pass | 进入“组成部分总表:再写入”。 |
| 组成部分总表:再写入 | done | `组成部分 | 核心职责 | 主要代码主体 | 不承担什么` 表 | pass | 进入“对象发现维度总表:先思考”。 |
| 对象发现维度总表:先思考 | done | truth / state / policy / projection / reference / audit 维度判断 | pass | 进入“对象发现维度总表:再写入”。 |
| 对象发现维度总表:再写入 | done | 对象发现维度表 | pass | 进入“各部分交互总图:先思考”。 |
| 各部分交互总图:先思考 | done | 主要组成部分之间的大体交互和关键接缝判断 | pass | 进入“各部分交互总图:再写入”。 |
| 各部分交互总图:再写入 | done | ASCII 交互总图和说明 | pass | 进入“方法资产定义与目录:先思考”。 |
| 方法资产定义与目录:先思考 | done | 该组成部分职责、capability、对象线索和接缝判断 | pass | 进入“方法资产定义与目录:再写入”。 |
| 方法资产定义与目录:再写入 | done | 该组成部分独立小节和停审记录 | pass | 进入“正式化与版本:先思考”。 |
| 正式化与版本:先思考 | done | 该组成部分职责、capability、对象线索和接缝判断 | pass | 进入“正式化与版本:再写入”。 |
| 正式化与版本:再写入 | done | 该组成部分独立小节和停审记录 | pass | 进入“受控消费:先思考”。 |
| 受控消费:先思考 | done | 该组成部分职责、capability、对象线索和接缝判断 | pass | 进入“受控消费:再写入”。 |
| 受控消费:再写入 | done | 该组成部分独立小节和停审记录 | pass | 进入“追溯与一致性保护:先思考”。 |
| 追溯与一致性保护:先思考 | done | 该组成部分职责、capability、对象线索和接缝判断 | pass | 进入“追溯与一致性保护:再写入”。 |
| 追溯与一致性保护:再写入 | done | 该组成部分独立小节和停审记录 | pass | 进入“关系与分发语义:先思考”。 |
| 关系与分发语义:先思考 | done | 该组成部分职责、capability、对象线索和接缝判断 | pass | 进入“关系与分发语义:再写入”。 |
| 关系与分发语义:再写入 | done | 该组成部分独立小节和停审记录 | pass | 进入“外部摘要与引用:先思考”。 |
| 外部摘要与引用:先思考 | done | 该组成部分职责、capability、对象线索和接缝判断 | pass | 进入“外部摘要与引用:再写入”。 |
| 外部摘要与引用:再写入 | done | 该组成部分独立小节和停审记录 | pass | 进入“后台维护与收敛:先思考”。 |
| 后台维护与收敛:先思考 | done | 该组成部分职责、capability、对象线索和接缝判断 | pass | 进入“后台维护与收敛:再写入”。 |
| 后台维护与收敛:再写入 | done | 该组成部分独立小节和停审记录 | pass | 进入“外围包与方法集组织:先思考”。 |
| 外围包与方法集组织:先思考 | done | 该外围组成部分是否进入 Step 5 主表及其非前置边界判断 | pass | 进入“外围包与方法集组织:再写入”。 |
| 外围包与方法集组织:再写入 | done | 外围组成部分小节或外围说明 | pass | 进入“总体边界说明”。 |
| 总体边界说明 | done | 跨组成部分边界、边界外能力和禁止事项 | pass | 进入“Step 6 展开门禁”。 |
| Step 6 展开门禁 | done | Step 6 必须独立展开候选清单和排除项 | pass | 进入“后续展开一致性说明”。 |
| 后续展开一致性说明 | done | Step 6~9 承接规则 | pass | 进入“旧材料差异审计”。 |
| 旧材料差异审计 | done | 旧 A-H、旧 P0、旧实现机制差异审计 | pass | 进入“自检与停审”。 |
| 自检与停审 | done | Step 5 完成门禁和 flow / 台账更新依据 | pass | Step 5 completed;等待用户确认进入 Step 6。 |

---

## 3. 整体模块骨架

| 模块组 | 本 Step 要做 | 本 Step 不做 |
|---|---|---|
| 候选池收敛 | 从 Step 4 的代码主体候选中识别哪些是业务主要组成部分、哪些只是实现分层、外围增强或外部边界。 | 不从旧 A-H、旧七类 P0 或历史 DDD 对象直接恢复组成部分。 |
| 组成部分总表 | 用统一表格说明每个组成部分的核心职责、主要代码主体和不承担事项。 | 不写字段、函数、接口签名、协议 schema、数据库表或事件 payload。 |
| 对象发现维度 | 按 truth / state / policy / projection / reference / audit / history 维度发现 Step 6 候选对象。 | 不在本 Step 正式定义对象字段、状态迁移或工厂函数。 |
| 交互总图 | 说明主要组成部分之间的大体流向和关键交接点。 | 不写完整调用链、事务边界、消息 topic 或重试策略。 |
| 逐组成部分小节 | 每个主要组成部分单独说明职责、代码主体、对象发现线索、非职责和接缝。 | 不把 API、repository、port、trigger、DTO 或 adapter 误写成领域对象。 |
| Step 6 门禁 | 标出必须在 Step 6 独立成节的候选对象和排除理由。 | 不把候选对象压缩成对象组后直接跳到接口或流程。 |
| 差异审计 | 当前结论完成后再对旧材料做污染检查。 | 不让旧材料参与当前组成部分推导。 |

---

## 4. 组成部分候选暂存

以下仅保留 Step 4 给出的候选主语。正式采用 / 排除结论见 `5.2 组成部分候选池:再写入`:

| 候选主语 | 当前来源 | Step 5 待判断 |
|---|---|---|
| 方法资产定义与目录 | Step 4 代码主体框架;当前 00 / 01 核心定义与目录语义 | 是否作为核心主要组成部分进入总表。 |
| 正式化与版本 | Step 4 代码主体框架;当前 00 / 01 正式化与版本稳定语义 | 是否作为核心主要组成部分进入总表。 |
| 受控消费 | Step 4 代码主体框架;当前 00 / 01 正式消费边界 | 是否作为核心主要组成部分进入总表。 |
| 追溯与一致性保护 | Step 4 代码主体框架;当前 00 / 01 变化追溯和消费一致性保护 | 是否拆分或合并为一个核心主要组成部分。 |
| 关系与分发语义 | Step 4 代码主体框架;当前 01 支撑子域 | 是否作为支撑主要组成部分进入总表。 |
| 外部摘要与引用 | Step 4 代码主体框架;当前 00 / 01 外部依据摘要与引用边界 | 是否作为独立组成部分,还是归入正式化 / 追溯接缝。 |
| 后台维护与收敛 | Step 4 代码主体框架;当前 01 后台维护承载 | 是否是业务主要组成部分,还是实现承载 / operation 能力。 |
| 外围包与方法集组织 | Step 4 代码主体框架;当前 00 / 01 外围增强 | 是否进入主表,以及如何写明不阻塞核心闭环。 |

---

## 5. 模块执行记录

### 5.1 组成部分候选池:先思考

问题回答:

- Step 5 的候选池应以 Step 4 已形成的代码主体主语为起点,再回指当前 `00-需求文档.md` 和 `01-架构设计.md` 的核心能力、子域、数据归属和边界约束。
- 候选池不应直接恢复旧 A-H 主要组成部分,也不应按旧七类 P0 `MethodContent` 拆分。旧 A-H 混入入口、基础设施和旧同步机制;旧 P0 类型会把 Step 5 变成对象清单。
- 初步候选应围绕当前核心闭环形成:定义与目录、正式化与版本、受控消费、追溯与一致性保护。支撑与外围候选需要单独判断是否进入主表,不能自动与核心候选同级。

诊断:

- `方法资产定义与目录` 有明确 truth 来源和下游消费锚点,是核心候选。
- `正式化与版本` 是正式消费成立的前提,并承接治理依据或其他正式化依据摘要,是核心候选。
- `受控消费` 用于保护 Definition vs Use 边界,是核心候选,但不能拥有下游运行 truth。
- `追溯与一致性保护` 同时覆盖变化解释、消费影响识别和审计线索,当前适合先作为一个核心候选;是否拆分留给 Step 5 写入和 Step 6 对象候选再审。
- `关系与分发语义` 是支撑子域,与受控消费和外围生态有关,可作为支撑候选,但要写明不承担 marketplace 交易、安装和履约。
- `外部摘要与引用` 是跨仓和外部材料的正式承接方式。它有独立边界价值,但职责应限制在摘要 / 引用接收、保存和关联,不得保存外部正文。
- `后台维护与收敛` 更像运行承载和 operation 能力,不是业务语义源。若进入主表,必须被定义为维护正式读取、追溯材料和一致性收敛的支撑组成部分,不得成为独立 truth。
- `外围包与方法集组织` 来自外围增强需求,可进入外围组成部分说明,但必须标注不阻塞核心闭环。

取舍:

- 核心候选先保留四类:方法资产定义与目录、正式化与版本、受控消费、追溯与一致性保护。
- 支撑候选先保留三类:关系与分发语义、外部摘要与引用、后台维护与收敛。
- 外围候选单独保留:外围包与方法集组织。
- 实现分层名、外部仓名、repository / port / adapter / DTO / trigger 不进入组成部分候选池,只在后续代码主体、接缝或边界说明中出现。

复杂度 / 越界检查:

- 未写字段、函数、协议 schema、状态迁移、数据库表或事件 payload。
- 未把 `L0-bus`、governance、artifact、marketplace、console / SDK 写成本仓内部组成部分。
- 未继承旧 fingerprint、snapshot、outbox、PostgreSQL、object storage 作为当前组成部分依据。
- 下一模块只允许把上述思考写成“组成部分候选池和采用 / 排除说明”,不得直接生成完整 Step 5。

### 5.2 组成部分候选池:再写入

#### 组成部分候选池

| 候选组成部分 | 候选级别 | 采用结论 | 依据 | Step 5 后续处理 |
|---|---|---|---|---|
| 方法资产定义与目录 | 核心 | 采用 | 当前 00 / 01 均把方法资产定义 truth、身份和目录语义列为本仓中心职责。 | 进入组成部分总表和独立小节。 |
| 正式化与版本 | 核心 | 采用 | 正式化与版本稳定是正式消费成立前提,并承接治理依据或其他正式依据摘要。 | 进入组成部分总表和独立小节。 |
| 受控消费 | 核心 | 采用 | Definition vs Use 边界需要本仓提供正式消费前提,防止下游反写定义 truth。 | 进入组成部分总表和独立小节。 |
| 追溯与一致性保护 | 核心 | 采用 | 版本语义变化、正式化依据、消费影响和证据线索必须可追溯且不破坏既有消费。 | 进入组成部分总表和独立小节;Step 6 再判断对象是否拆分。 |
| 关系与分发语义 | 支撑 | 采用 | 当前 01 将方法资产关系与分发语义列为支撑子域,可支撑受控消费和外围生态。 | 进入组成部分总表,但明确不承担交易、安装和履约。 |
| 外部摘要与引用 | 支撑 | 采用 | 当前 00 / 01 要求外部治理、标准、ADR、artifact / archive 等只能以摘要或引用形态承接。 | 进入组成部分总表,并在边界中强调不保存外部正文。 |
| 后台维护与收敛 | 支撑 / operation | 有条件采用 | 读取材料、追溯材料和一致性收敛需要明确承接位置,但它不是独立业务 truth。 | 进入组成部分总表时标注为维护支撑组成部分,禁止反向定义业务语义。 |
| 外围包与方法集组织 | 外围 | 有条件采用 | 当前 00 / 01 保留 MethodPackage / MethodSet 等外围增强,但不允许其成为核心闭环前置。 | 进入外围组成部分说明,并标注不阻塞核心组成部分。 |

#### 不进入组成部分候选池的名称

| 名称类别 | 示例 | 排除理由 | 后续可出现位置 |
|---|---|---|---|
| 实现分层 | Inbound / Operations、Application Services、Domain Model、Ports、Persistence、Projection、Adapters | 它们说明代码如何安放,不是业务主要组成部分。 | Step 4 分层视图、Step 5 接缝说明、Step 7 接口骨架。 |
| 外部仓或外部系统 | `L0-bus`、`L1-governance`、`L1-artifact`、`L6-marketplace`、console / SDK | 它们是协作边界或消费方,不是本仓内部组成部分。 | 外部交互、引用边界、接口依赖或风险说明。 |
| 旧实现机制 | fingerprint、snapshot、outbox、PostgreSQL、object storage | 当前 full-restart 未授权这些机制作为概要组成部分依据。 | 仅可在后置差异审计中说明不继承。 |
| 纯技术接口名 | repository、port、adapter、DTO、trigger、worker | 这些是实现或协议承载形式,不能替代业务职责主语。 | Step 7 接口骨架、Step 8 处理流或 03 详细设计。 |
| 旧对象清单 | 旧七类 P0 `MethodContent`、旧 A-H 模块 | 旧对象清单会把 Step 5 变成对象列表或历史结构复刻。 | 仅可在 Step 6 按当前候选池重新筛选对象时审计。 |

停审记录:

- 功能是否清楚: pass。候选池覆盖定义、正式化、消费、追溯、一致性、关系、外部引用、维护收敛和外围组织。
- 候选对象是否有功能来源: pass。所有采用项均可回指当前 00 / 01 和 Step 4。
- 接缝是否清楚: partial。候选池已区分核心、支撑、operation 和外围;具体接缝留给交互总图和逐组成部分小节。
- 禁止事项是否清楚: pass。已排除实现分层、外部仓、旧机制、纯技术接口和旧对象清单。
- 是否越界: pass。未写字段、函数、状态、协议、存储或事件细节。

### 5.3 组成部分总表:先思考

问题回答:

- 组成部分总表应采用 `4 个核心 + 3 个支撑 + 1 个外围` 的结构,共 8 个可讨论单元。
- 这 8 个单元都可进入 Step 5 总表,但表述层级必须不同:核心组成部分表达核心闭环,支撑组成部分表达核心闭环所需的支撑边界,外围组成部分表达非前置增强。
- 总表排序应按业务成立链路排列,而不是按实现层或旧对象类型排列:先定义与目录,再正式化与版本,再受控消费,再追溯与一致性保护,随后放关系分发、外部摘要、后台维护,最后放外围包与方法集组织。

诊断:

- 若只列 4 个核心组成部分,关系、外部引用、维护收敛和外围组织会在后续 Step 6~9 中没有正式归属,容易被塞进接口、流程或状态章节。
- 若把 8 个单元全部无差别写成核心组成部分,会违反当前 00 / 01 对外围增强和运行承载的隔离要求。
- `后台维护与收敛` 需要进入总表,但核心职责必须写成维护读取材料、追溯材料和一致性收敛,不能写成拥有新的业务 truth。
- `外围包与方法集组织` 可以进入总表末尾,但必须在核心职责或不承担事项中标注“外围增强,不阻塞核心闭环”。

取舍:

- 总表采用 8 行,不拆成两个独立表,避免后续 Step 6 无法统一回指 Step 5 的组成部分。
- 在总表的“核心职责”和“不承担什么”列中显式标注支撑 / operation / 外围边界,而不新增额外列,以遵守书写规范给出的总表格式。
- `外部摘要与引用` 保持独立行,因为它是防止外部正文、治理执行、artifact 正文和 marketplace 交易渗入本仓 truth 的关键边界。
- `关系与分发语义` 保持独立行,因为关系和分发语义既支撑消费,也支撑外围生态,不应被埋入定义与目录或受控消费。

复杂度 / 越界检查:

- 本模块只决定总表结构和写表规则,未写正式总表。
- 未引入旧 A-H、旧 P0 类型、fingerprint、snapshot、outbox 或具体存储作为划分依据。
- 未把实现分层、外部仓、repository、port、adapter、DTO、trigger 写成组成部分。
- 下一模块只允许写 `组成部分 | 核心职责 | 主要代码主体 | 不承担什么` 总表,不得跳到对象发现维度表或逐组成部分小节。

### 5.4 组成部分总表:再写入

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| 方法资产定义与目录 | 承载方法资产定义 truth、稳定身份、目录语义和适用语境,为正式化、消费和追溯提供共同锚点。 | MethodAssetDefinitionService;MethodAssetCatalogService;MethodAssetDefinition;MethodAssetCatalogEntry | 不保存流程实例、成员状态、治理执行、artifact 正文、UI 会话或 marketplace 交易事实。 |
| 正式化与版本 | 承载方法资产进入正式使用语境的判断、正式版本边界和显式版本语义变化。 | MethodAssetFormalizationService;MethodAssetVersionService;FormalMethodAssetVersion;FormalizationBasisSummary | 不把治理执行或审批流程变成本仓主链;不允许下游读取或引用隐式触发正式化。 |
| 受控消费 | 为下游按边界消费正式方法资产提供消费材料、可用性判断和 Definition vs Use 防护。 | MethodAssetConsumptionService;MethodAssetConsumptionMaterial;MethodAssetAvailabilityView;DownstreamConsumptionBoundary | 不拥有下游运行 truth;不替下游执行流程、分配任务、绑定能力或渲染体验。 |
| 追溯与一致性保护 | 汇聚正式化依据、版本变化、引用语境、证据线索和消费影响摘要,保护既有正式消费不被静默破坏。 | MethodAssetTraceService;MethodAssetConsistencyService;MethodAssetTraceMaterial;ConsumptionImpactSummary | 不把日志、telemetry 或审计材料变成第二定义 truth;不保存下游内部状态正文。 |
| 关系与分发语义 | 承载方法资产之间的定义性关系和面向消费 / 生态分发的语义来源,支撑消费边界与外围发现。 | MethodAssetRelationService;MethodAssetDistributionService;MethodAssetRelation;MethodAssetDistributionRef | 不承担 marketplace 定价、订单、购买、结算、安装和履约;不替代核心定义 truth。 |
| 外部摘要与引用 | 承接治理结论、标准、ADR、artifact / archive 和外部来源的摘要或引用,防止外部正文进入本仓 truth。 | ExternalBasisAcceptanceService;ExternalSourceSummary;ExternalSourceRef;ArtifactArchiveRef | 不保存治理裁决正文、标准全文、artifact 正文、证据文件或 archive 正文;不执行外部系统职责。 |
| 后台维护与收敛 | 维护正式读取材料、消费材料、追溯材料和一致性收敛任务,使已成立语义可被稳定读取和恢复。 | MethodAssetMaintenanceService;ReadMaterialRefreshTask;TraceMaterialRefreshTask;ConsistencyRecoveryTask | 不创建新的业务 truth;不绕过正式化、版本和消费边界;不定义具体 job 调度、topic 或重试策略。 |
| 外围包与方法集组织 | 作为外围增强组织方法资产包、组织级方法集和生态发现语义,在不阻塞核心闭环的前提下承接后续扩展。 | MethodPackageService;MethodSetAssemblyService;MethodPackage;MethodSetAssembly | 不作为核心闭环成立前置;不拥有 marketplace 交易履约;不覆盖或替代核心方法资产定义。 |

停审记录:

- 功能是否清楚: pass。8 个组成部分覆盖核心闭环、支撑边界、维护收敛和外围增强。
- 候选对象是否有功能来源: pass。主要代码主体均来自 Step 4 候选,职责均可回指当前 00 / 01。
- 接缝是否清楚: partial。总表已固定职责边界,组成部分之间的流向留给后续交互总图。
- 禁止事项是否清楚: pass。每行均明确不承担事项,尤其是下游运行 truth、外部正文、治理执行和 marketplace 交易边界。
- 是否越界: pass。未写字段、函数、协议 schema、状态迁移、持久化结构、event payload 或 job 细节。

### 5.5 对象发现维度总表:先思考

问题回答:

- 对象发现维度总表应按每个组成部分横向扫描 `Truth / State`、`Policy / Invariant`、`Projection / Read model`、`Reference / Boundary`、`Audit / History` 和 `Step 6 必须独立展开`。
- 该表不是最终对象定义表,而是 Step 6 的候选池。凡是未来可能成为 struct、enum、value object、projection、policy、audit record 或 history record 的名称,都应在 Step 5 点名并交给 Step 6 筛选。
- 不适用的维度可以写 `-`,但不能省略维度判断。省略会导致 Step 6 无法判断某个对象缺失是有意排除还是遗漏。

诊断:

- `方法资产定义与目录` 的对象发现重点在 truth / identity / catalog 侧,不能被目录读取材料替代。
- `正式化与版本` 的对象发现重点在 formal version、formalization basis 和版本语义变化,不能把治理执行状态迁入本仓。
- `受控消费` 的对象发现重点在 consumption material、availability view 和 downstream boundary,但下游运行状态必须排除。
- `追溯与一致性保护` 的对象发现重点在 trace material、impact summary、consistency policy 和 evidence / audit 线索,但日志或 telemetry 不能升为 truth。
- `关系与分发语义` 的对象发现重点在定义性关系和分发引用,但 marketplace 交易对象不能进入候选池。
- `外部摘要与引用` 的对象发现重点在 external summary、source ref、artifact / archive ref 和正文禁止边界。
- `后台维护与收敛` 需要发现 task / recovery / refresh 类对象候选,但这些对象只能维护派生材料或收敛动作,不能拥有业务 truth。
- `外围包与方法集组织` 的对象发现重点在 package、method set assembly 和外围组织语义,且必须标注不阻塞核心闭环。

取舍:

- 维度总表先用规范要求的五类对象发现维度,不额外增加“运行承载”列,避免把 job、worker、adapter 误写成领域对象。
- `State` 与 `Truth` 暂放同一列,因为 Step 5 只做发现线索;是否拆成状态对象或状态机,留给 Step 6 和 Step 9。
- `Audit / History` 覆盖审计、历史和证据线索候选,但只表示对象发现线索,不定义证据 schema 或审计表。
- `Step 6 必须独立展开` 列要写候选对象名,但不在本步决定字段、枚举值、状态迁移或端口。

复杂度 / 越界检查:

- 本模块只确定对象发现维度总表的判断规则,未写正式维度表。
- 未把 repository、port、adapter、DTO、trigger、worker、数据库表或消息 topic 当作 Step 6 领域对象。
- 未把外部系统正文、治理执行、artifact 生命周期、marketplace 交易或下游运行 truth 纳入对象候选。
- 下一模块只允许写对象发现维度总表,不得跳到交互总图或逐组成部分小节。

### 5.6 对象发现维度总表:再写入

| 组成部分 | Truth / State | Policy / Invariant | Projection / Read model | Reference / Boundary | Audit / History | Step 6 必须独立展开 |
|---|---|---|---|---|---|---|
| 方法资产定义与目录 | MethodAssetDefinition;MethodAssetCatalogEntry | MethodAssetIdentityRule;CatalogApplicabilityRule | MethodAssetCatalogView | MethodAssetDefinitionRef;CatalogScopeRef | MethodAssetDefinitionHistory | MethodAssetDefinition;MethodAssetCatalogEntry;MethodAssetDefinitionRef |
| 正式化与版本 | FormalMethodAssetVersion;FormalizationState | FormalizationEligibilityRule;VersionStabilityRule | FormalMethodAssetVersionView | FormalizationBasisSummary;GovernanceBasisRef | FormalizationHistory | FormalMethodAssetVersion;FormalizationBasisSummary;FormalizationState |
| 受控消费 | MethodAssetConsumptionMaterial;MethodAssetAvailabilityState | ConsumptionBoundaryPolicy;DefinitionUseBoundaryGuard | MethodAssetAvailabilityView;MethodAssetConsumptionReadMaterial | DownstreamConsumptionBoundary;ConsumptionContextRef | ConsumptionTraceMaterial | MethodAssetConsumptionMaterial;MethodAssetAvailabilityView;DownstreamConsumptionBoundary |
| 追溯与一致性保护 | MethodAssetTraceMaterial;ConsumptionImpactSummary | ConsistencyProtectionPolicy;ImpactClassificationRule | MethodAssetTraceView;ConsumptionImpactView | TraceSubjectRef;ConsumptionImpactSourceRef | MethodAssetAuditTrail;MethodAssetEvidenceLineage | MethodAssetTraceMaterial;ConsumptionImpactSummary;ConsistencyProtectionPolicy;MethodAssetAuditTrail |
| 关系与分发语义 | MethodAssetRelation;MethodAssetDistributionRef | RelationIntegrityRule;DistributionBoundaryRule | MethodAssetRelationView;DistributionReadMaterial | RelatedMethodAssetRef;DistributionContextRef | RelationChangeHistory | MethodAssetRelation;MethodAssetDistributionRef;RelationIntegrityRule |
| 外部摘要与引用 | ExternalSourceSummary;ExternalBasisAcceptanceState | ExternalBodyBoundaryRule;ExternalBasisAcceptanceRule | ExternalSourceSummaryView | ExternalSourceRef;ArtifactArchiveRef;GovernanceBasisRef | ExternalBasisAcceptanceHistory | ExternalSourceSummary;ExternalSourceRef;ArtifactArchiveRef;ExternalBodyBoundaryRule |
| 后台维护与收敛 | ReadMaterialRefreshTask;TraceMaterialRefreshTask;ConsistencyRecoveryTask | MaintenanceConvergenceRule;RecoverySafetyRule | MaintenanceProgressView | MaintenanceRunRef;RefreshScopeRef | MaintenanceRunHistory | ReadMaterialRefreshTask;TraceMaterialRefreshTask;ConsistencyRecoveryTask |
| 外围包与方法集组织 | MethodPackage;MethodSetAssembly | PackageCompositionRule;MethodSetAssemblyRule | MethodPackageView;MethodSetAssemblyView | MethodPackageRef;MarketplaceContextRef | PackageAssemblyHistory | MethodPackage;MethodSetAssembly;PackageCompositionRule |

停审记录:

- 功能是否清楚: pass。每个组成部分都有对象发现维度覆盖,不适用内容通过边界规则表达。
- 候选对象是否有功能来源: pass。候选均来自当前 00 / 01、Step 4 代码主体框架和 Step 5 组成部分总表。
- 接缝是否清楚: partial。引用 / 边界列已点名接缝候选,具体流向留给交互总图。
- 禁止事项是否清楚: pass。外部正文、治理执行、artifact 生命周期、marketplace 交易和下游运行 truth 未作为对象候选进入表中。
- 是否越界: pass。未写对象字段、函数、状态迁移、协议 schema、存储结构或事件载荷。

### 5.7 各部分交互总图:先思考

问题回答:

- 交互总图应表达 8 个组成部分之间的大体流向和关键交接点,不是调用链、部署图或事件拓扑。
- 主干流向应从 `方法资产定义与目录` 出发,经过 `正式化与版本`,进入 `受控消费`,再由 `追溯与一致性保护` 回收变化解释、引用语境和消费影响。
- 支撑流向应让 `关系与分发语义` 辅助定义、消费和外围分发;让 `外部摘要与引用` 向正式化、追溯和关系分发提供摘要 / 引用依据;让 `后台维护与收敛` 维护读取、消费和追溯材料。
- 外围流向应把 `外围包与方法集组织` 画在核心闭环之外,只消费核心定义、版本、关系和分发语义,不得反向定义核心 truth。

诊断:

- 如果总图只画核心四部分,会遗漏外部摘要、关系分发和维护收敛这些后续 Step 6~9 必须归属的接缝。
- 如果总图把外部仓直接画成内部组成部分,会把治理执行、artifact 生命周期、marketplace 交易和下游运行状态误纳入本仓边界。
- 如果总图画成消息 / outbox / worker 拓扑,会提前进入未授权实现机制,并重新引入旧材料污染。
- 如果总图没有表达回流和维护,追溯一致性、读取材料刷新和消费影响收敛会在后续流程章节悬空。

取舍:

- 使用一张 ASCII 总图表达“核心主链 + 支撑接缝 + 外围增强 + 维护回路”。
- 图中只使用 Step 5 已收稳的组成部分名称,不新增 repository、port、adapter、event、topic、job 或数据库节点。
- 外部协作只以 `外部摘要 / 引用输入`、`下游消费影响摘要`、`外围生态语义` 等边界词出现,不画成内部业务主体。
- `后台维护与收敛` 在图中作为维护回路连接读取 / 追溯 / 一致性材料,不放在核心 truth 主链中间。

复杂度 / 越界检查:

- 本模块只确定交互总图画法,未写正式 ASCII 图。
- 未写完整调用链、事务边界、消息 topic、重试策略、job 调度或 adapter 实现。
- 未把外部系统、下游仓、治理执行、artifact 正文、marketplace 交易或 UI 状态画成本仓内部组成部分。
- 下一模块只允许写 ASCII 交互总图和简短说明,不得跳到逐组成部分小节。

### 5.8 各部分交互总图:再写入

```text
                         external summary / ref input
                                      |
                                      v
                        +---------------------------+
                        | 6. 外部摘要与引用        |
                        | summaries / refs only     |
                        +-------------+-------------+
                                      |
                        basis / source ref / archive ref
                                      |
                                      v
+---------------------------+     +---------------------------+
| 1. 方法资产定义与目录     | --> | 2. 正式化与版本          |
| definition truth / catalog |     | formal version boundary  |
+-------------+-------------+     +-------------+-------------+
              |                                 |
              | definition identity / catalog   | formal version / basis
              v                                 v
+---------------------------+     +---------------------------+
| 5. 关系与分发语义        | --> | 3. 受控消费              |
| relation / distribution   |     | consumption material     |
+-------------+-------------+     +-------------+-------------+
              |                                 |
              | distribution semantics          | consumption context
              v                                 v
+---------------------------+     +---------------------------+
| 8. 外围包与方法集组织    |     | 4. 追溯与一致性保护     |
| peripheral enhancement    | <-- | trace / impact / audit   |
+---------------------------+     +-------------+-------------+
                                                  ^
                                                  |
                         refresh / convergence   |
                                                  |
                         +------------------------+--+
                         | 7. 后台维护与收敛        |
                         | read / trace / recovery   |
                         +---------------------------+

External collaboration boundary, not internal component:

downstream consumption impact summary ---> 4. 追溯与一致性保护
marketplace / ecosystem context --------> 8. 外围包与方法集组织
governance / standard / ADR / artifact --> 6. 外部摘要与引用
```

说明:

- 核心主链是 `方法资产定义与目录 -> 正式化与版本 -> 受控消费 -> 追溯与一致性保护`。
- `关系与分发语义` 支撑定义间关系、消费边界和外围分发,但不替代定义 truth。
- `外部摘要与引用` 只把外部输入转成摘要 / 引用依据,不把外部系统或正文纳入本仓内部组成部分。
- `后台维护与收敛` 只维护读取、消费、追溯和恢复材料,不在 query 或维护路径创建新的业务 truth。
- `外围包与方法集组织` 位于核心闭环之外,只能消费已成立的定义、版本、关系和分发语义,不得反向规定核心 truth。

停审记录:

- 功能是否清楚: pass。图中已表达核心主链、支撑接缝、维护回路和外围增强。
- 候选对象是否有功能来源: pass。图中节点均来自组成部分总表,没有新增业务主体。
- 接缝是否清楚: pass。basis/source/ref、formal version、consumption context、trace/impact/audit 和 refresh/convergence 均作为概要接缝出现。
- 禁止事项是否清楚: pass。外部仓和外部系统只在 boundary 说明中出现,不作为内部组成部分。
- 是否越界: pass。未写完整调用链、事务边界、消息 topic、重试策略、job 调度或 adapter 实现。

### 5.9 方法资产定义与目录:先思考

问题回答:

- 本组成部分是方法资产定义 truth 和目录身份语义的入口。它要回答“什么是本仓拥有的方法资产定义”、“该定义如何被稳定识别”、“它适用于哪些目录 / 语境”。
- 它的 capability 应围绕定义建立、定义调整、目录识别、适用语境表达和定义历史线索展开,而不是围绕旧七类 P0 `MethodContent`、旧 A-H 模块或具体存储 / 同步机制展开。
- 它需要为 `正式化与版本` 提供可被正式化的定义锚点,为 `受控消费` 提供可消费定义身份,为 `关系与分发语义` 提供关系端点,为 `追溯与一致性保护` 提供变化来源。

诊断:

- 当前 00 / 01 都把方法资产定义 truth、身份和目录语义列为本仓中心职责,所以该组成部分必须是核心组成部分,不能被 projection、catalog view 或下游索引替代。
- `MethodAssetCatalogEntry` 应表达目录识别和适用语境,不是搜索索引、数据库目录表或 UI 分类状态。
- `MethodAssetDefinition` 可以作为 Step 6 独立候选对象,但本 Step 不能展开字段或旧 P0 类型清单;否则会提前落入详细设计。
- 定义历史可以作为对象发现线索,但不得把 audit raw log、telemetry 或实现事件流当成定义 truth。

取舍:

- 本组成部分的主体命名保留 `方法资产定义与目录`,而不是拆成“定义 truth”和“目录 catalog”两个主要组成部分。原因是身份、目录和定义锚点在当前 00 / 01 中共同构成后续正式化与消费的起点。
- 目录读取材料留作 projection / read model 候选,不作为第二 truth。
- 定义变更的正式版本含义不在本组成部分内裁决,而是交给 `正式化与版本`;本组成部分只提供定义变化事实和目录语义锚点。
- 外部标准、ADR、artifact、governance basis 只通过 `外部摘要与引用` 接入,不得作为定义正文或目录正文直接保存。

复杂度 / 越界检查:

- 本模块只做职责和对象线索判断,未写正式独立小节。
- 未写字段、状态迁移、工厂函数、repository、port、协议 schema、数据库表、事件 payload 或目录索引实现。
- 未把 process、identity、runtime、member-images、governance、artifact、marketplace 或 UI 状态纳入定义 truth。
- 下一模块只允许写“方法资产定义与目录”的独立小节和停审记录,不得跳到正式化与版本。

### 5.10 方法资产定义与目录:再写入

#### 5.10.1 本部分职责

方法资产定义与目录负责承载本仓拥有的方法资产定义 truth、稳定身份、目录语义和适用语境。它为正式化、版本、受控消费、关系分发和追溯一致性提供共同锚点。

本部分需要完成的 capability:

| Capability | 说明 | 后续承接 |
|---|---|---|
| 定义建立 | 接收已被本仓接受的方法资产定义语义,形成可被后续正式化引用的定义锚点。 | Step 6 `MethodAssetDefinition` |
| 定义调整 | 记录定义语义的调整来源和安全变更线索,但不在本部分裁决正式版本含义。 | Step 6 definition history;Step 8 definition update flow |
| 目录识别 | 为方法资产提供稳定目录项和识别语境,支撑查找、消费和追溯。 | Step 6 `MethodAssetCatalogEntry` |
| 适用语境表达 | 表达定义适用于哪些目录 / 范围 / 消费语境,不等同于运行时执行状态。 | Step 6 catalog scope / applicability rule |
| 定义历史线索 | 为后续追溯和审计保留定义变化的安全线索。 | Step 6 history / audit candidate;Step 8 trace flow |

#### 5.10.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| MethodAssetDefinitionService | Application service | 编排定义建立、定义调整和目录锚点维护,保证不越过本仓定义 truth 边界。 | Step 7 API / 接口骨架;Step 8 处理流 |
| MethodAssetCatalogService | Application service | 编排目录识别、适用语境判断和目录读取材料触发。 | Step 7 API / 接口骨架;Step 8 处理流 |
| MethodAssetDefinition | Truth object candidate | 承载本仓拥有的方法资产定义语义,作为正式化和消费的源头。 | Step 6 关键对象轮廓 |
| MethodAssetCatalogEntry | Truth / catalog candidate | 承载稳定目录身份、目录范围和适用语境线索。 | Step 6 关键对象轮廓 |
| MethodAssetDefinitionRef | Reference candidate | 为下游正式引用、关系端点和追溯主体提供 typed ref 候选。 | Step 6 关键对象轮廓;Step 7 接口骨架 |
| MethodAssetCatalogView | Read model candidate | 从定义和目录 truth 派生读取视图,不得成为第二 truth。 | Step 6 候选筛选;Step 7 query 骨架 |

#### 5.10.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | MethodAssetDefinition;MethodAssetCatalogEntry | 必须独立成节,说明二者如何分别承载定义 truth 和目录语义。 |
| Policy / Invariant | MethodAssetIdentityRule;CatalogApplicabilityRule | 必须判断是否作为 policy / guard 独立展开,至少说明身份稳定和适用语境不变量。 |
| Projection / Read model | MethodAssetCatalogView | 作为 read model 候选进入 Step 6 筛选;若不独立展开,必须说明由哪个对象派生。 |
| Reference / Boundary | MethodAssetDefinitionRef;CatalogScopeRef | `MethodAssetDefinitionRef` 必须独立成节或作为 typed ref 家族明确承接;不得由字符串拼接。 |
| Audit / History | MethodAssetDefinitionHistory | 作为 history / audit candidate 进入 Step 6 筛选,不得保存 raw log 或外部正文。 |

#### 5.10.4 本部分不承担什么

- 不承担方法资产正式化通过 / 驳回、正式版本边界裁决或版本语义变化解释;这些属于 `正式化与版本`。
- 不承担下游运行态消费成功、流程执行、任务分配、能力绑定、成员状态或 UI 渲染状态。
- 不保存治理裁决正文、标准全文、artifact 正文、archive 包、marketplace 交易或外部系统原始响应。
- 不把目录读取材料、搜索索引、projection、cache 或外部同步结果作为第二定义 truth。
- 不按旧七类 P0 `MethodContent` 或旧 A-H 模块拆分本部分职责。

#### 5.10.5 与其他部分的接缝

| 对接部分 | 接缝 | 说明 |
|---|---|---|
| 正式化与版本 | definition ref / catalog context -> formalization input | 本部分提供可被正式化引用的定义锚点和目录语境,不决定正式版本结果。 |
| 受控消费 | definition ref / catalog scope -> consumption material | 本部分提供消费材料的定义来源,受控消费负责可用性和 Definition vs Use 防护。 |
| 追溯与一致性保护 | definition change source -> trace material | 本部分提供定义变化来源,追溯部分负责变化解释、影响摘要和安全审计线索。 |
| 关系与分发语义 | definition ref -> relation endpoint | 本部分提供关系端点,关系分发部分负责关系完整性和分发语义。 |
| 外部摘要与引用 | external summary / source ref -> definition basis | 外部依据只能以摘要 / 引用进入,不得把外部正文写入定义 truth。 |
| 后台维护与收敛 | definition / catalog truth -> read material refresh | 维护部分可刷新读取材料,但不得修改本部分 truth。 |

停审记录:

- 功能是否清楚: pass。职责、capability 和接缝已围绕定义 truth、身份和目录语义闭合。
- 候选对象是否有功能来源: pass。候选对象均来自当前 00 / 01、Step 4、总表和对象发现维度表。
- 接缝是否清楚: pass。已明确与正式化、消费、追溯、关系、外部引用和维护的边界。
- 禁止事项是否清楚: pass。已排除下游运行 truth、外部正文、旧 P0 拆分、读取材料第二 truth。
- 是否越界: pass。未写字段、函数、协议 schema、状态迁移、存储结构或事件载荷。

### 5.11 正式化与版本:先思考

问题回答:

- 本组成部分负责把已存在的方法资产定义带入正式使用语境,并为正式版本语义变化建立显式边界。
- 它要回答“什么时候一个方法资产定义可以作为正式消费依据”、“正式版本如何稳定地被引用”、“哪些变化必须显式成为版本语义变化”。
- 它需要消费 `方法资产定义与目录` 提供的 definition ref / catalog context,并可消费 `外部摘要与引用` 提供的 formalization basis summary / governance basis ref,但不得把治理执行、审批流程或外部正文变成本仓主链。

诊断:

- 当前 00 / 01 明确要求未正式化资产不得作为正式消费依据,因此正式化与版本必须是核心组成部分,不能被查询、读取材料或下游使用行为隐式替代。
- `FormalMethodAssetVersion` 应承载正式版本边界,但本 Step 不能展开字段、算法、版本号格式、hash 或迁移规则。
- `FormalizationBasisSummary` 是外部依据的安全承接候选,但必须保持摘要 / 引用边界,不得保存治理裁决正文、标准全文或 artifact 正文。
- `FormalizationState` 可作为 Step 6 / Step 9 的候选状态线索,但本 Step 只点名状态存在,不定义状态枚举和迁移矩阵。

取舍:

- 本组成部分保留为独立核心组成部分,不并入 `方法资产定义与目录`。原因是定义存在与正式可消费是两个不同判断,混在一起会让未正式化定义被误用。
- 版本稳定边界放在本组成部分,而不是 `受控消费`。受控消费只判断正式材料能否按边界被消费,不定义版本语义本身。
- 治理、标准、ADR 或 artifact 只能通过 `外部摘要与引用` 提供 basis,本组成部分只使用 basis 判断正式化和版本语义,不执行外部系统职责。
- 版本语义变化的影响解释与消费影响摘要交给 `追溯与一致性保护`,本组成部分只负责显式版本边界和正式化结果。

复杂度 / 越界检查:

- 本模块只做职责、capability、对象线索和接缝判断,未写正式独立小节。
- 未写字段、正式化状态枚举、版本算法、hash、版本号格式、迁移矩阵、协议 schema、repository 或持久化结构。
- 未把治理执行、审批流、policy enforce result、下游运行状态或读取行为写成正式化来源。
- 下一模块只允许写“正式化与版本”的独立小节和停审记录,不得跳到受控消费。

### 5.12 正式化与版本:再写入

#### 5.12.1 本部分职责

正式化与版本负责把已存在的方法资产定义带入正式使用语境,并建立正式版本边界。它保证未正式化定义不会被当作正式消费依据,也保证影响正式含义的变化必须显式表达为版本语义变化。

本部分需要完成的 capability:

| Capability | 说明 | 后续承接 |
|---|---|---|
| 正式化判断 | 基于定义锚点、目录语境和正式依据摘要判断方法资产是否可进入正式使用语境。 | Step 6 `FormalizationState`;Step 8 formalization flow |
| 正式版本建立 | 为已正式化的方法资产形成稳定可引用的正式版本边界。 | Step 6 `FormalMethodAssetVersion` |
| 版本语义变化识别 | 识别哪些定义变化影响正式版本含义,并要求显式进入版本变化路径。 | Step 6 version stability rule;Step 8 version change flow |
| 正式依据承接 | 使用治理、标准、ADR 或 artifact 等外部依据的摘要 / 引用,不保存外部正文。 | Step 6 `FormalizationBasisSummary`;`GovernanceBasisRef` |
| 正式 / 非正式隔离 | 阻止下游读取、引用、同步或运行时使用隐式触发正式化。 | Step 8 query / consumption guard;Step 9 state flow |

#### 5.12.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| MethodAssetFormalizationService | Application service | 编排正式化判断、依据承接和正式化结果生成。 | Step 7 API / 接口骨架;Step 8 处理流 |
| MethodAssetVersionService | Application service | 编排正式版本建立和版本语义变化识别。 | Step 7 API / 接口骨架;Step 8 处理流 |
| FormalMethodAssetVersion | Truth / state candidate | 承载正式版本边界和稳定引用语义。 | Step 6 关键对象轮廓 |
| FormalizationBasisSummary | Summary candidate | 承接治理、标准、ADR 或 artifact 等正式化依据的安全摘要。 | Step 6 关键对象轮廓 |
| FormalizationState | State candidate | 表达正式化判断结果和进入正式使用语境的状态线索。 | Step 6 候选筛选;Step 9 状态机 |
| VersionStabilityRule | Policy candidate | 约束正式版本语义不得被静默覆盖。 | Step 6 policy 候选;Step 8 / Step 9 |

#### 5.12.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | FormalMethodAssetVersion;FormalizationState | `FormalMethodAssetVersion` 必须独立成节;`FormalizationState` 需判断是否作为状态对象或状态词表承接。 |
| Policy / Invariant | FormalizationEligibilityRule;VersionStabilityRule | 必须说明正式化资格和版本稳定不变量,不得依赖下游使用行为。 |
| Projection / Read model | FormalMethodAssetVersionView | 作为 read model 候选进入 Step 6 筛选,不得成为正式版本第二 truth。 |
| Reference / Boundary | FormalizationBasisSummary;GovernanceBasisRef | `FormalizationBasisSummary` 必须独立展开或明确归入外部摘要边界;不得保存治理执行正文。 |
| Audit / History | FormalizationHistory | 作为 history / audit candidate 进入 Step 6 筛选,用于解释正式化和版本变化来源。 |

#### 5.12.4 本部分不承担什么

- 不拥有方法资产定义正文;定义 truth 属于 `方法资产定义与目录`。
- 不执行治理审批、policy enforce、标准解释、artifact 生命周期或外部系统裁决。
- 不让读取、引用、同步、缓存命中或下游运行使用隐式触发正式化。
- 不保存治理裁决正文、标准全文、artifact 正文、archive 包或外部系统原始响应。
- 不负责消费材料的可见性、下游可用性或 Definition vs Use 防护;这些属于 `受控消费`。
- 不负责版本变化的消费影响解释和下游影响摘要;这些属于 `追溯与一致性保护`。

#### 5.12.5 与其他部分的接缝

| 对接部分 | 接缝 | 说明 |
|---|---|---|
| 方法资产定义与目录 | definition ref / catalog context -> formalization input | 本部分消费定义锚点和目录语境,但不修改定义 truth。 |
| 受控消费 | formal version -> consumption material | 本部分输出正式版本边界,受控消费基于正式版本判断可消费性。 |
| 追溯与一致性保护 | formalization / version change -> trace and impact material | 本部分提供正式化和版本变化事实,追溯部分解释原因和影响。 |
| 外部摘要与引用 | formalization basis summary / governance basis ref | 外部依据只通过摘要 / 引用进入正式化判断,不得保存外部正文。 |
| 后台维护与收敛 | formal version -> read material refresh | 维护部分可刷新正式版本读取材料,但不得改变正式化结果或版本 truth。 |

停审记录:

- 功能是否清楚: pass。职责、capability 和接缝已围绕正式化、正式版本和显式版本语义变化闭合。
- 候选对象是否有功能来源: pass。候选对象均来自当前 00 / 01、Step 4、总表和对象发现维度表。
- 接缝是否清楚: pass。已明确与定义目录、受控消费、追溯一致性、外部摘要和后台维护的边界。
- 禁止事项是否清楚: pass。已排除治理执行、外部正文、隐式正式化、下游运行状态和读取行为触发正式化。
- 是否越界: pass。未写字段、状态枚举、版本算法、hash、协议 schema、存储结构或事件载荷。

### 5.13 受控消费:先思考

问题回答:

- 本组成部分负责让下游能够按边界消费正式方法资产语义。它要回答“哪些正式版本可以被消费”、“消费材料应包含哪些语义类别”、“下游消费时哪些边界必须被看见”。
- 它只消费 `正式化与版本` 输出的 formal version 和 `方法资产定义与目录` 提供的定义 / 目录锚点,不重新定义方法资产 truth,也不让下游消费行为反向改变正式化结果。
- 它面向 `L1-process`、`L1-identity`、`L2-runtime`、`L2-member-images` 等核心消费方提供正式消费前提,但这些消费方只获得读取、引用或边界材料,不得拥有定义正文、正式版本 truth 或本仓内部状态。

诊断:

- 当前 00 / 01 已把“正式方法资产受控消费支撑”列为核心职责,并把“Definition vs Use 必须成立”“未正式化资产不得作为正式消费依据”“下游不得创建、修改或替代方法资产定义真相”列为不可变约束,所以受控消费必须作为核心组成部分独立存在。
- `MethodAssetConsumptionMaterial` 可以作为消费材料候选,但它不能退化为下游私有复制包、缓存机制或旧 snapshot 方案。它应表达可被下游安全消费的正式语义材料,具体字段留到 Step 6 / Step 8。
- `MethodAssetAvailabilityView` 可以作为读取 / 可用性候选,但它不是正式版本 truth,也不能让读取命中、缓存命中或运行时使用隐式触发正式化。
- `DownstreamConsumptionBoundary` 是关键边界候选,需要表达下游消费时的“允许使用什么”和“不得反写什么”,但本 Step 不能写成权限矩阵、鉴权实现或 API policy。
- 下游消费影响摘要属于 `追溯与一致性保护` 的输入 / 支撑线索,不应被受控消费直接拥有为下游运行状态。

取舍:

- 本组成部分保留为独立核心组成部分,不并入 `正式化与版本`。原因是正式版本成立与下游可消费是两个判断:前者决定正式语义边界,后者决定消费材料和消费边界。
- 本组成部分也不并入 `关系与分发语义`。关系 / 分发可为消费提供语境,但受控消费需要独立保护核心下游不复制、反写或替代定义 truth。
- 对外消费方按消费语境识别,不按实现入口、SDK、API、event 或 repository 划分;接口和协议细节留给后续 Step。
- 本组成部分可提出 consumption material、availability view、boundary rule 等 Step 6 候选,但不能在本 Step 固定字段、状态枚举、协议 schema 或持久化形态。

复杂度 / 越界检查:

- 未写字段、函数、DTO、event payload、API 路径、repository、port、数据库表、权限矩阵或鉴权实现。
- 未把 process、identity、runtime、member-images 的运行 truth 迁入本仓,也未把下游回报摘要写成本仓定义 truth。
- 未使用旧 fingerprint、snapshot、outbox、PostgreSQL、object storage 或历史 P0 类型作为当前消费材料依据。
- 下一模块只允许写“受控消费”的正式独立小节和停审记录,不得跳到“追溯与一致性保护”。

### 5.14 受控消费:再写入

#### 5.14.1 本部分职责

受控消费负责让下游按边界使用正式方法资产语义。它基于已成立的正式版本和定义 / 目录锚点组织消费材料、判断可消费性,并保护 Definition vs Use 边界,防止下游复制、反写或替代方法资产定义 truth。

本部分需要完成的 capability:

| Capability | 说明 | 后续承接 |
|---|---|---|
| 正式消费资格判断 | 判断指定正式版本和消费语境是否可以形成正式消费材料。 | Step 6 `MethodAssetAvailabilityState`;Step 8 consumption flow |
| 消费材料组织 | 组织只读的正式方法资产消费材料,使下游不需要复制定义正文。 | Step 6 `MethodAssetConsumptionMaterial`;`MethodAssetConsumptionReadMaterial` |
| Definition vs Use 防护 | 约束下游只能引用、读取或消费,不得创建、修改或替代定义 truth。 | Step 6 `DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard` |
| 消费语境识别 | 区分 process、identity、runtime、member-images 等下游消费语境,但不拥有其运行状态。 | Step 6 `ConsumptionContextRef`;Step 7 query / consumption boundary |
| 可用性读取 | 提供正式资产可消费 / 不可消费 / 待收敛的读取线索,不形成第二正式版本 truth。 | Step 6 `MethodAssetAvailabilityView` |
| 下游边界提示 | 在消费材料中保留边界提示和禁止事项,支撑后续追溯和一致性保护。 | Step 6 consumption boundary candidates;Step 8 trace handoff |

#### 5.14.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| MethodAssetConsumptionService | Application service | 编排正式消费资格判断、消费材料生成和下游边界保护。 | Step 7 API / 接口骨架;Step 8 处理流 |
| MethodAssetConsumptionMaterial | Read material / boundary candidate | 承载下游可使用的正式方法资产语义材料,不得成为下游私有定义副本。 | Step 6 关键对象轮廓 |
| MethodAssetConsumptionReadMaterial | Read model candidate | 承接面向读取和消费的派生材料,不得替代正式版本 truth。 | Step 6 候选筛选;Step 7 query 骨架 |
| MethodAssetAvailabilityView | Read model candidate | 表达正式方法资产在特定消费语境下的可用性线索。 | Step 6 候选筛选 |
| MethodAssetAvailabilityState | State candidate | 表达消费材料是否可用、不可用或需收敛的状态线索。 | Step 6 候选筛选;Step 9 状态机 |
| DownstreamConsumptionBoundary | Boundary candidate | 表达下游消费时的允许使用方式和禁止反写边界。 | Step 6 关键对象轮廓 |
| ConsumptionContextRef | Reference candidate | 标识消费语境,用于区分不同下游和不同正式消费场景。 | Step 6 typed ref 候选;Step 7 接口骨架 |
| ConsumptionBoundaryPolicy | Policy candidate | 约束消费材料不得越过 Definition vs Use 边界。 | Step 6 policy 候选;Step 8 guard |

#### 5.14.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | MethodAssetConsumptionMaterial;MethodAssetAvailabilityState | `MethodAssetConsumptionMaterial` 必须独立判断其是否为只读材料对象;`MethodAssetAvailabilityState` 需判断是否进入状态词表或状态对象。 |
| Policy / Invariant | ConsumptionBoundaryPolicy;DefinitionUseBoundaryGuard | 必须说明 Definition vs Use 防护不变量,不得把鉴权实现或权限矩阵提前写入。 |
| Projection / Read model | MethodAssetAvailabilityView;MethodAssetConsumptionReadMaterial | 作为 read model 候选进入 Step 6 筛选,明确不得成为正式定义或正式版本第二 truth。 |
| Reference / Boundary | DownstreamConsumptionBoundary;ConsumptionContextRef | `DownstreamConsumptionBoundary` 必须独立展开或作为边界对象承接;`ConsumptionContextRef` 不得由下游私有字符串替代。 |
| Audit / History | ConsumptionTraceMaterial | 作为 trace / audit candidate 进入 Step 6 筛选,用于说明正式消费可回溯到定义来源和版本语境。 |

#### 5.14.4 本部分不承担什么

- 不拥有方法资产定义 truth、正式版本 truth 或正式化判断结果。
- 不创建、修改、替代或同步下游的流程实例、成员状态、运行上下文、image variant 状态或 UI 会话状态。
- 不让读取命中、缓存命中、同步动作、下游引用或运行时使用隐式触发正式化。
- 不保存下游运行正文、外部系统正文、artifact 正文、archive 包、marketplace 交易或治理执行正文。
- 不实现认证登录、操作主体鉴权、权限矩阵或策略执行结果;本部分只表达消费边界语义。
- 不承接下游消费影响摘要的归档和解释;这些属于 `追溯与一致性保护`。

#### 5.14.5 与其他部分的接缝

| 对接部分 | 接缝 | 说明 |
|---|---|---|
| 方法资产定义与目录 | definition ref / catalog scope -> consumption material source | 本部分消费定义锚点和目录语境,不修改定义 truth。 |
| 正式化与版本 | formal version -> consumption eligibility | 本部分基于正式版本判断可消费性,不决定正式版本边界。 |
| 追溯与一致性保护 | consumption material / context -> trace and impact source | 本部分提供正式消费语境和材料线索,追溯部分负责影响解释和一致性保护。 |
| 关系与分发语义 | relation / distribution context -> consumption context | 关系和分发语义可补充消费语境,但不得替代消费边界。 |
| 外部摘要与引用 | external ref boundary -> forbidden body guard | 外部依据或正文引用只能作为边界线索,不得进入消费材料正文。 |
| 后台维护与收敛 | consumption material -> read material refresh | 维护部分可刷新消费读取材料,但不得创建新的定义 truth 或绕过正式化。 |

停审记录:

- 功能是否清楚: pass。职责、capability 和接缝已围绕正式消费资格、消费材料和 Definition vs Use 防护闭合。
- 候选对象是否有功能来源: pass。候选对象均来自当前 00 / 01、Step 4、总表和对象发现维度表。
- 接缝是否清楚: pass。已明确与定义目录、正式化版本、追溯一致性、关系分发、外部引用和维护收敛的边界。
- 禁止事项是否清楚: pass。已排除下游运行 truth、隐式正式化、外部正文、鉴权实现和消费影响解释归档。
- 是否越界: pass。未写字段、函数、协议 schema、状态枚举、权限矩阵、存储结构或事件载荷。

### 5.15 追溯与一致性保护:先思考

问题回答:

- 本组成部分负责解释方法资产正式化、版本语义变化、消费语境和证据线索之间的关系,并保护既有正式消费不被静默破坏。
- 它要回答“某个正式版本为什么成立或变化”、“哪些消费语境可能受到影响”、“影响和证据线索如何被安全承接并可回溯”。
- 它可以接收 `受控消费` 提供的 consumption material / consumption context,也可以接收下游消费影响摘要,但只能把下游材料作为摘要 / 线索承接,不得拥有下游运行 truth。

诊断:

- 当前 00 / 01 把“变化可追溯并保护消费一致性”列为核心闭环,并明确 FR-ML-007、FR-ML-008、FR-ML-009 分别覆盖追溯、消费一致性保护和证据线索承接。因此本组成部分必须独立存在,不能只作为 audit log 或 observability 附属能力。
- `MethodAssetTraceMaterial` 应承载正式化依据、版本变化、引用语境和消费语境的追溯材料线索,但本 Step 不能定义字段、trace id、证据 schema 或审计表。
- `ConsumptionImpactSummary` 是下游影响摘要候选,不是下游运行状态。若后续进入 Step 6,必须保留摘要边界和未知 / 待承接口径,不能要求本仓扫描下游内部状态。
- `ConsistencyProtectionPolicy` 和 `ImpactClassificationRule` 可以作为 policy / invariant 候选,用于表达哪些变化必须显式识别和哪些既有消费需要保护,但不能提前写成 drift 状态机、告警规则或恢复算法。
- `MethodAssetAuditTrail` 与 `MethodAssetEvidenceLineage` 可以作为 audit / history 候选,但它们不能替代定义 truth、正式版本 truth 或外部证据正文。

取舍:

- 本组成部分保留为独立核心组成部分,不并入 `正式化与版本`。正式化与版本负责正式边界和显式版本变化,本部分负责解释变化来源、影响线索和一致性保护。
- 本组成部分也不并入 `受控消费`。受控消费负责消费材料和边界判断,本部分负责消费发生后或变化发生时的追溯、影响摘要和保护口径。
- 证据线索与审计材料在本组成部分内只作为线索和 lineage 处理;正式证据文件、artifact、archive 正文和外部文档正文仍归边界外或外部摘要 / 引用接缝。
- 后台维护和恢复收敛留给 `后台维护与收敛`;本组成部分只定义一致性保护的业务语义和对象候选,不定义 job、调度、重试或自动恢复流程。

复杂度 / 越界检查:

- 未写字段、状态机、drift 算法、告警规则、event payload、evidence JSON、audit 表、repository、port 或持久化结构。
- 未把 observability、telemetry、raw log、artifact / archive 正文、治理执行正文或下游运行状态写成本仓 truth。
- 未使用旧 fingerprint、snapshot、outbox、P95、缓存、PostgreSQL 或 object storage 作为当前追溯 / 一致性机制依据。
- 下一模块只允许写“追溯与一致性保护”的正式独立小节和停审记录,不得跳到“关系与分发语义”。

### 5.16 追溯与一致性保护:再写入

#### 5.16.1 本部分职责

追溯与一致性保护负责把方法资产正式化依据、版本语义变化、正式消费语境、证据线索和消费影响摘要串成可解释的追溯材料,并保护既有正式消费不被静默破坏。它不替代定义 truth 或正式版本 truth,而是为变化解释、审计判断和一致性保护提供业务语义边界。

本部分需要完成的 capability:

| Capability | 说明 | 后续承接 |
|---|---|---|
| 版本变化追溯 | 说明正式版本为什么成立、为什么变化以及变化依据来自哪里。 | Step 6 `MethodAssetTraceMaterial`;Step 8 trace flow |
| 正式消费回溯 | 让正式消费可回溯到定义来源、正式版本和消费语境。 | Step 6 `ConsumptionTraceMaterial`;`TraceSubjectRef` |
| 消费影响识别 | 识别可能影响既有下游消费的变化,避免影响只存在于实现细节或人工约定。 | Step 6 `ConsumptionImpactSummary`;`ImpactClassificationRule` |
| 一致性保护判断 | 表达哪些变化需要保护既有正式消费,以及哪些情况必须显式待承接 / 待确认。 | Step 6 `ConsistencyProtectionPolicy`;Step 9 state / matrix |
| 证据线索承接 | 承接方法资产版本、发布和引用相关证据线索,不保存证据正文。 | Step 6 `MethodAssetEvidenceLineage`;Step 8 evidence handoff |
| 审计材料组织 | 组织可供审计和验收理解的变化线索,不把 raw log 或 telemetry 当作业务 truth。 | Step 6 `MethodAssetAuditTrail`;Step 15 observability / audit |

#### 5.16.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| MethodAssetTraceService | Application service | 编排正式化依据、版本变化、引用语境、消费语境和证据线索的追溯材料组织。 | Step 7 API / 接口骨架;Step 8 处理流 |
| MethodAssetConsistencyService | Application service | 编排消费影响识别和一致性保护判断。 | Step 7 API / 接口骨架;Step 8 处理流 |
| MethodAssetTraceMaterial | Trace material candidate | 承载方法资产变化、依据、引用语境和消费语境的可追溯材料。 | Step 6 关键对象轮廓 |
| ConsumptionImpactSummary | Summary candidate | 承接下游正式消费影响摘要,不得成为下游运行状态副本。 | Step 6 关键对象轮廓 |
| ConsistencyProtectionPolicy | Policy candidate | 约束正式版本变化和消费影响不得静默破坏既有正式消费。 | Step 6 policy 候选;Step 8 / Step 9 |
| ImpactClassificationRule | Policy / classification candidate | 辅助判断哪些变化属于可能影响既有消费的变化类别。 | Step 6 policy 候选 |
| MethodAssetAuditTrail | Audit candidate | 组织审计可读的变化线索,不得替代业务 truth 或 raw log。 | Step 6 候选筛选 |
| MethodAssetEvidenceLineage | Lineage candidate | 串联版本、发布、引用和证据线索之间的来源关系。 | Step 6 候选筛选 |

#### 5.16.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | MethodAssetTraceMaterial;ConsumptionImpactSummary | 二者必须独立判断:前者承接追溯材料,后者承接下游影响摘要,均不得替代定义 truth 或下游运行 truth。 |
| Policy / Invariant | ConsistencyProtectionPolicy;ImpactClassificationRule | 必须说明显式变化、消费影响识别和既有消费保护的不变量。 |
| Projection / Read model | MethodAssetTraceView;ConsumptionImpactView | 作为 read model 候选进入 Step 6 筛选,不得成为追溯材料或影响摘要的第二 truth。 |
| Reference / Boundary | TraceSubjectRef;ConsumptionImpactSourceRef | 必须明确追溯主体和影响来源的 typed ref 候选,不得由 free-form 字符串拼接。 |
| Audit / History | MethodAssetAuditTrail;MethodAssetEvidenceLineage | 必须判断是否独立展开为 audit / lineage 对象,并明确不保存外部证据正文。 |

#### 5.16.4 本部分不承担什么

- 不拥有方法资产定义 truth、正式版本 truth、正式化判断结果或下游运行 truth。
- 不保存 raw log、telemetry、trace id 流、metric、告警、审计表实现或 observability 原始材料。
- 不保存治理裁决正文、标准全文、artifact 正文、archive 包、证据文件正文或外部系统原始响应。
- 不扫描下游流程实例、成员状态、runtime 上下文或 image variant 状态来重建影响事实。
- 不定义 drift 状态机、告警规则、恢复算法、job 调度、event topic、payload 或可靠发布机制。
- 不负责刷新追溯材料或恢复收敛的执行流程;这些属于 `后台维护与收敛`。

#### 5.16.5 与其他部分的接缝

| 对接部分 | 接缝 | 说明 |
|---|---|---|
| 方法资产定义与目录 | definition change source -> trace material | 本部分消费定义变化来源和目录语境,用于解释变化,不修改定义 truth。 |
| 正式化与版本 | formalization / version change -> trace and consistency source | 本部分解释正式化和版本变化来源及影响,不决定正式版本边界。 |
| 受控消费 | consumption material / context -> trace and impact source | 本部分消费正式消费语境和材料线索,用于回溯和影响识别。 |
| 关系与分发语义 | relation / distribution change -> impact hint | 关系或分发变化可能影响消费范围,本部分负责影响解释和保护口径。 |
| 外部摘要与引用 | evidence / basis ref -> trace lineage | 外部依据和证据只能以摘要 / 引用或 lineage 进入,不得保存正文。 |
| 后台维护与收敛 | trace / impact material -> refresh and recovery scope | 维护部分可刷新追溯材料、影响摘要和恢复状态,但不得改变本部分业务语义。 |

停审记录:

- 功能是否清楚: pass。职责、capability 和接缝已围绕追溯材料、消费影响摘要、证据线索和一致性保护闭合。
- 候选对象是否有功能来源: pass。候选对象均来自当前 00 / 01、Step 4、总表和对象发现维度表。
- 接缝是否清楚: pass。已明确与定义目录、正式化版本、受控消费、关系分发、外部引用和后台维护的边界。
- 禁止事项是否清楚: pass。已排除 raw log、telemetry、外部正文、下游运行状态、drift 算法和恢复执行流程。
- 是否越界: pass。未写字段、状态机、协议 schema、event payload、审计表、证据 JSON、存储结构或 job 调度。

### 5.17 关系与分发语义:先思考

问题回答:

- 本组成部分负责表达方法资产之间的定义性关系,以及面向正式消费和外围生态发现的分发语义。
- 它要回答“哪些方法资产之间存在正式关系”、“关系如何影响消费语境或外围发现”、“哪些分发上下文可以被暴露给外围而不进入 marketplace 交易边界”。
- 它支撑 `方法资产定义与目录`、`受控消费`、`追溯与一致性保护` 和 `外围包与方法集组织`,但不替代定义 truth,也不拥有交易、安装或履约事实。

诊断:

- 当前 00 / 01 已把方法资产关系语义和方法资产分发语义列为本仓数据所有权与支撑子域,所以该组成部分不能只作为 UI 分类或外部 marketplace 附属能力处理。
- `MethodAssetRelation` 应表达方法资产之间的定义性关系,不是运行时依赖图、调用图、推荐算法结果、搜索索引或旧同步关系。
- `MethodAssetDistributionRef` 应表达可被消费或外围生态理解的分发语义引用,但它不是 marketplace listing、订单、购买、结算、安装包或履约状态。
- 关系变化和分发语义变化可能影响消费范围、外围包组织和一致性保护,因此必须与追溯 / 一致性保护形成接缝。
- 外部摘要或 artifact / archive 引用可以成为关系和分发语义的依据线索,但外部正文仍必须停留在 `外部摘要与引用` 边界内。

取舍:

- `关系与分发语义` 保持为一个支撑组成部分,暂不拆成“关系管理”和“分发管理”两个主要组成部分。二者都服务于消费语境和外围生态发现,拆开会让 Step 5 总体边界过细。
- `MethodPackage` 和 `MethodSetAssembly` 不放入本组成部分,继续归入 `外围包与方法集组织`,避免外围增强反向成为核心闭环前置。
- marketplace 只作为生态上下文和外部边界出现,不在本组成部分内定义定价、订单、购买、结算、安装或履约对象。
- 本组成部分只定义关系 / 分发的业务语义、对象线索和接缝,不定义图算法、分发渠道协议、事件 topic、repository 或存储索引。

复杂度 / 越界检查:

- 未写对象字段、关系类型枚举、分发协议、graph traversal 算法、repository、port、event payload、API schema 或数据库索引。
- 未把 marketplace 交易、安装履约、包内容正文、外部 artifact 正文或下游运行状态纳入本仓 truth。
- 未使用旧 P0 类型、旧 A-H 模块、fingerprint、snapshot、outbox 或历史同步机制作为当前关系 / 分发语义依据。
- 下一模块只允许写“关系与分发语义”的正式独立小节和停审记录,不得跳到“外部摘要与引用”。

### 5.18 关系与分发语义:再写入

#### 5.18.1 本部分职责

关系与分发语义负责承载方法资产之间的定义性关系,以及面向正式消费和外围生态发现的分发语义。它让消费方和外围组织能力能够理解资产之间的关联、适用范围和分发上下文,但不替代方法资产定义 truth,也不进入 marketplace 交易、安装和履约边界。

本部分需要完成的 capability:

| Capability | 说明 | 后续承接 |
|---|---|---|
| 定义性关系表达 | 表达方法资产之间的正式关系,为消费语境和外围组织提供关系端点。 | Step 6 `MethodAssetRelation`;`RelatedMethodAssetRef` |
| 关系完整性保护 | 防止关系指向不存在、未正式化或越界的方法资产语义。 | Step 6 `RelationIntegrityRule`;Step 8 relation flow |
| 分发语义承接 | 表达方法资产面向正式消费或外围生态发现时的分发上下文引用。 | Step 6 `MethodAssetDistributionRef`;`DistributionContextRef` |
| 消费语境补充 | 为受控消费提供关系和分发语义线索,但不决定下游运行状态。 | Step 6 `DistributionReadMaterial`;Step 8 consumption support |
| 外围发现支撑 | 为外围包与方法集组织提供关系 / 分发语义输入,但不让外围组织反向定义核心 truth。 | Step 6 relation / distribution candidates;Step 8 peripheral flow |
| 关系变化线索 | 将关系或分发语义变化交给追溯与一致性保护解释影响。 | Step 6 `RelationChangeHistory`;Step 8 trace handoff |

#### 5.18.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| MethodAssetRelationService | Application service | 编排关系建立、调整、检查和关系变化线索输出。 | Step 7 API / 接口骨架;Step 8 处理流 |
| MethodAssetDistributionService | Application service | 编排分发语义引用、消费语境补充和外围发现支撑。 | Step 7 API / 接口骨架;Step 8 处理流 |
| MethodAssetRelation | Truth / relation candidate | 承载方法资产之间的定义性关系,不得退化为运行依赖图或推荐结果。 | Step 6 关键对象轮廓 |
| MethodAssetDistributionRef | Reference / boundary candidate | 承载分发语义的 typed ref,不得表示 marketplace 交易或安装履约。 | Step 6 关键对象轮廓 |
| RelationIntegrityRule | Policy candidate | 约束关系端点、正式化状态和边界可用性。 | Step 6 policy 候选;Step 8 guard |
| DistributionBoundaryRule | Policy candidate | 约束分发语义不得越过 marketplace、安装履约或外部正文边界。 | Step 6 policy 候选 |
| MethodAssetRelationView | Read model candidate | 派生关系读取材料,不得成为第二关系 truth。 | Step 6 候选筛选;Step 7 query 骨架 |
| DistributionReadMaterial | Read material candidate | 为消费和外围发现提供分发语义读取材料。 | Step 6 候选筛选 |

#### 5.18.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | MethodAssetRelation;MethodAssetDistributionRef | `MethodAssetRelation` 必须独立成节;`MethodAssetDistributionRef` 必须明确其 ref / boundary 性质,不得承载交易事实。 |
| Policy / Invariant | RelationIntegrityRule;DistributionBoundaryRule | 必须说明关系端点完整性、正式化边界和分发越界保护。 |
| Projection / Read model | MethodAssetRelationView;DistributionReadMaterial | 作为 read model / read material 候选进入 Step 6 筛选,不得成为关系 truth 或 marketplace listing。 |
| Reference / Boundary | RelatedMethodAssetRef;DistributionContextRef | 必须明确 typed ref 候选,不得由 free-form asset id、route param 或 marketplace id 直接拼接。 |
| Audit / History | RelationChangeHistory | 作为 history / audit candidate 进入 Step 6 筛选,用于向追溯一致性说明关系变化来源。 |

#### 5.18.4 本部分不承担什么

- 不拥有或覆盖方法资产定义 truth、目录 truth、正式版本 truth 或正式化结果。
- 不承担 marketplace 定价、上架、订单、购买、结算、安装、履约、退款或授权交易事实。
- 不保存 package 正文、method set 正文、artifact 正文、archive 包、外部系统原始响应或生态平台私有数据。
- 不把关系读取视图、搜索索引、推荐结果、运行依赖图、调用图或 UI 分类当成关系 truth。
- 不扫描下游流程实例、成员状态、runtime 上下文或 image variant 状态来推导关系。
- 不定义图算法、分发渠道协议、event topic、payload、repository、数据库索引或可靠发布机制。

#### 5.18.5 与其他部分的接缝

| 对接部分 | 接缝 | 说明 |
|---|---|---|
| 方法资产定义与目录 | definition ref -> relation endpoint | 本部分使用定义锚点作为关系端点,但不修改定义 truth。 |
| 正式化与版本 | formal version / formalization state -> relation eligibility | 关系和分发语义需要感知正式化边界,但不决定正式版本结果。 |
| 受控消费 | relation / distribution context -> consumption context | 本部分为消费材料补充关系和分发语境,受控消费负责消费边界和可用性。 |
| 追溯与一致性保护 | relation / distribution change -> impact and trace hint | 关系或分发变化可能形成消费影响线索,由追溯部分解释和保护。 |
| 外部摘要与引用 | external summary / archive ref -> relation basis | 外部依据只能以摘要 / 引用作为关系或分发依据,不得保存外部正文。 |
| 外围包与方法集组织 | distribution context -> package / set organization | 本部分向外围组织提供语义输入,外围组织不得反向规定核心关系 truth。 |
| 后台维护与收敛 | relation / distribution material -> read material refresh | 维护部分可刷新读取材料,但不得创建或修改关系 truth。 |

停审记录:

- 功能是否清楚: pass。职责、capability 和接缝已围绕定义性关系、分发语义、消费语境和外围发现闭合。
- 候选对象是否有功能来源: pass。候选对象均来自当前 00 / 01、Step 4、总表和对象发现维度表。
- 接缝是否清楚: pass。已明确与定义目录、正式化版本、受控消费、追溯一致性、外部引用、外围组织和后台维护的边界。
- 禁止事项是否清楚: pass。已排除 marketplace 交易、安装履约、外部正文、运行依赖图、推荐结果和下游运行状态。
- 是否越界: pass。未写字段、关系枚举、图算法、协议 schema、event payload、存储结构或分发渠道实现。

### 5.19 外部摘要与引用:先思考

问题回答:

- 本组成部分负责把治理结论、标准 / ADR、方法论来源、artifact / archive、外部正文和 marketplace 生态对象等外部材料,以摘要或引用形态安全承接进本仓语义。
- 它要回答“哪些外部材料可作为方法资产定义、正式化、追溯、关系或外围发现的依据线索”、“外部材料在本仓内只能留下什么摘要 / ref”、“如何防止外部正文和外部生命周期进入本仓 truth”。
- 它是外部事实进入本仓核心语义前的正式承接边界,不是治理执行仓、标准正文仓、artifact 生命周期仓、marketplace 交易仓或外部内容镜像仓。

诊断:

- 当前 00 / 01 已明确本仓可保留治理正式化结论摘要、外部标准来源摘要、治理依据引用、标准 / ADR 来源引用、外部正文引用、artifact / archive 引用和 marketplace 生态对象引用,同时禁止保存治理执行正文、标准全文、artifact 正文、证据文件和交易履约正文。
- `ExternalSourceSummary` 应承载外部依据的安全摘要,但它不是外部正文副本、全文摘录、标准解释器、治理裁决正文或 artifact 元数据完整镜像。
- `ExternalSourceRef`、`ArtifactArchiveRef`、`GovernanceBasisRef` 等应作为 typed ref / boundary 候选,用于把正式化、追溯、关系分发和外围组织连接到外部依据,但不拥有外部对象生命周期。
- `ExternalBasisAcceptanceState` 可以作为 Step 6 / Step 9 的状态线索,用于表达外部依据是否已被本仓正式承接、不可用或待确认;但本 Step 不能定义状态枚举和迁移。
- 若没有独立的外部摘要与引用组成部分,外部依据会被分别塞入正式化、追溯、关系分发或外围组织,后续容易形成多套私有 ref、私有摘要和正文边界漏洞。

取舍:

- 本组成部分保持独立,不并入 `正式化与版本`。正式化可以使用治理或标准依据,但外部依据的摘要 / 引用边界应统一归口,避免正式化路径拥有治理执行或外部正文。
- 本组成部分也不并入 `追溯与一致性保护`。追溯需要使用证据线索和依据 ref,但外部来源的接收、摘要化和正文禁止边界应先在本部分闭合。
- 外部正文引用、artifact / archive 引用和 marketplace 生态对象引用都可进入本组成部分作为 ref 边界,但 marketplace 交易、artifact 生命周期、标准解释和治理执行仍留在边界外。
- 本组成部分只定义摘要 / 引用承接的业务语义和对象线索,不定义外部 API、回调协议、文件 schema、内容校验算法、证据 JSON 或存储适配。

复杂度 / 越界检查:

- 未写对象字段、summary schema、ref key 规则、状态枚举、外部 API、event payload、artifact schema、evidence JSON、repository 或持久化结构。
- 未把治理执行、policy enforce、标准全文、ADR 正文、artifact 正文、archive 包、证据文件、marketplace 交易履约或外部系统原始响应纳入本仓 truth。
- 未把条件型治理、artifact、marketplace、console / SDK 等外部关系升级为核心前置。
- 下一模块只允许写“外部摘要与引用”的正式独立小节和停审记录,不得跳到“后台维护与收敛”。

### 5.20 外部摘要与引用:再写入

#### 5.20.1 本部分职责

外部摘要与引用负责把治理结论、标准 / ADR、方法论来源、artifact / archive、外部正文和 marketplace 生态对象等外部材料,以摘要或引用形态安全承接到本仓语义中。它为定义、正式化、追溯、关系分发和外围组织提供外部依据线索,同时防止外部正文、外部生命周期和外部执行职责进入本仓 truth。

本部分需要完成的 capability:

| Capability | 说明 | 后续承接 |
|---|---|---|
| 外部依据摘要承接 | 将治理结论、标准、ADR 或方法论来源转成可被本仓使用的安全摘要。 | Step 6 `ExternalSourceSummary`;`FormalizationBasisSummary` |
| 外部来源引用 | 保存指向外部正文、来源、标准或 ADR 的 typed ref,不保存正文。 | Step 6 `ExternalSourceRef`;Step 7 reference boundary |
| 治理依据引用 | 承接方法资产正式化所需的治理结论或治理依据引用,但不执行治理裁决。 | Step 6 `GovernanceBasisRef`;Step 8 formalization support |
| artifact / archive 引用 | 保存与方法资产相关的 artifact 或 archive 引用关系,不拥有正文或生命周期。 | Step 6 `ArtifactArchiveRef`;Step 8 trace / evidence support |
| 正文边界保护 | 统一约束外部正文、证据文件、标准全文和交易履约不得进入本仓。 | Step 6 `ExternalBodyBoundaryRule`;Step 8 guard |
| 外部依据承接状态线索 | 表达外部依据是否已被正式承接、不可用或待确认,但不定义外部对象生命周期。 | Step 6 `ExternalBasisAcceptanceState`;Step 9 state candidate |

#### 5.20.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| ExternalBasisAcceptanceService | Application service | 编排外部依据摘要 / 引用的接收、承接和边界检查。 | Step 7 API / 接口骨架;Step 8 处理流 |
| ExternalSourceSummary | Summary candidate | 承载外部依据的安全摘要,不得成为外部正文副本。 | Step 6 关键对象轮廓 |
| ExternalSourceRef | Reference candidate | 指向外部正文、标准、ADR 或来源,不拥有外部正文生命周期。 | Step 6 typed ref 候选;Step 7 接口骨架 |
| ArtifactArchiveRef | Reference candidate | 指向 artifact / archive 相关外部材料,不保存制品或归档正文。 | Step 6 typed ref 候选 |
| GovernanceBasisRef | Reference candidate | 指向治理结论或治理依据,不保存治理裁决执行正文。 | Step 6 typed ref 候选 |
| ExternalBasisAcceptanceState | State candidate | 表达外部依据承接状态线索,用于后续状态矩阵判断。 | Step 6 候选筛选;Step 9 状态机 |
| ExternalBodyBoundaryRule | Policy candidate | 约束外部正文、证据正文和交易履约正文不得入仓。 | Step 6 policy 候选;Step 8 guard |
| ExternalSourceSummaryView | Read model candidate | 派生外部摘要读取材料,不得成为外部来源 truth。 | Step 6 候选筛选;Step 7 query 骨架 |

#### 5.20.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | ExternalSourceSummary;ExternalBasisAcceptanceState | `ExternalSourceSummary` 必须独立判断摘要边界;`ExternalBasisAcceptanceState` 需判断是否作为状态对象或状态词表承接。 |
| Policy / Invariant | ExternalBodyBoundaryRule;ExternalBasisAcceptanceRule | 必须说明外部正文禁止入仓、外部依据承接资格和引用失效处理口径。 |
| Projection / Read model | ExternalSourceSummaryView | 作为 read model 候选进入 Step 6 筛选,不得成为外部来源 truth。 |
| Reference / Boundary | ExternalSourceRef;ArtifactArchiveRef;GovernanceBasisRef | 必须明确 typed ref 候选和来源边界,不得由 free-form URL 或外部 id 直接替代正式 ref。 |
| Audit / History | ExternalBasisAcceptanceHistory | 作为 history / audit candidate 进入 Step 6 筛选,用于说明外部依据何时被承接、失效或挂起。 |

#### 5.20.4 本部分不承担什么

- 不拥有方法资产定义 truth、正式版本 truth、关系 truth、外围包 truth 或下游运行 truth。
- 不执行治理裁决、Gate 流程、policy enforce、标准解释、外部内容审查或 artifact 生命周期管理。
- 不保存治理裁决正文、标准全文、ADR 正文、外部文档正文、示例 / 模板正文、artifact 正文、archive 包或证据文件正文。
- 不保存 marketplace listing 正文、定价、订单、购买、结算、安装、履约或退款事实。
- 不把外部系统原始响应、网页快照、文件内容、包内容、对象存储内容或外部 API payload 作为本仓 truth。
- 不定义外部 API、回调协议、文件 schema、内容校验算法、证据 JSON、repository、持久化结构或 adapter 实现。

#### 5.20.5 与其他部分的接缝

| 对接部分 | 接缝 | 说明 |
|---|---|---|
| 方法资产定义与目录 | external summary / source ref -> definition basis | 外部来源可作为定义来源线索,但不得写入定义正文。 |
| 正式化与版本 | governance basis / formalization basis summary -> formalization input | 本部分提供正式化依据摘要 / 引用,正式化部分负责判断正式版本边界。 |
| 受控消费 | external ref boundary -> forbidden body guard | 外部引用只能作为消费边界提示或来源线索,不得进入消费材料正文。 |
| 追溯与一致性保护 | evidence / basis ref -> trace lineage | 本部分提供外部依据和证据线索 ref,追溯部分负责组织 lineage 和影响解释。 |
| 关系与分发语义 | external summary / archive ref -> relation basis | 外部依据可支撑关系或分发语义,但不得替代关系 truth。 |
| 外围包与方法集组织 | marketplace / package external ref -> peripheral context | 生态对象或包正文只能作为外围引用上下文,不得形成交易或履约 truth。 |
| 后台维护与收敛 | external ref / summary -> validation and refresh scope | 维护部分可检查引用可用性和摘要读取材料,但不得复制外部正文补齐。 |

停审记录:

- 功能是否清楚: pass。职责、capability 和接缝已围绕外部摘要、typed ref、正文禁止边界和外部依据承接状态闭合。
- 候选对象是否有功能来源: pass。候选对象均来自当前 00 / 01、Step 4、总表和对象发现维度表。
- 接缝是否清楚: pass。已明确与定义目录、正式化版本、受控消费、追溯一致性、关系分发、外围组织和后台维护的边界。
- 禁止事项是否清楚: pass。已排除治理执行、标准全文、ADR 正文、artifact / archive 正文、证据正文、marketplace 交易和外部 API payload。
- 是否越界: pass。未写字段、summary schema、ref key 规则、状态枚举、协议 schema、event payload、存储结构或 adapter 实现。

### 5.21 后台维护与收敛:先思考

问题回答:

- 本组成部分负责维护由正式 truth 派生出来的目录读取材料、消费读取材料、追溯材料、外部摘要读取材料、引用有效性检查线索和一致性恢复任务。
- 它要回答“哪些派生材料需要延后刷新”、“哪些引用、摘要或下游影响需要收敛检查”、“失败时如何保持待收敛、待恢复、待确认或显式不可用口径”。
- 它是支撑 / operation 组成部分,不是新的业务语义源;它不能创建、修改或绕过定义、正式化、版本、消费、关系和外部摘要的正式 truth。

诊断:

- 当前 00 / 01 已明确后台任务接口、后台维护承载、读取与追溯承载和一致性恢复口径,并强调正式 truth 到读取材料、消费材料、追溯材料是最终一致,不得因派生材料延迟改写 truth。
- `MethodAssetMaintenanceService` 应编排读取材料刷新、追溯材料刷新、引用有效性检查和恢复收敛,但不是业务命令主链或独立 truth owner。
- `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask` 和 `ConsistencyRecoveryTask` 可以作为 Step 6 候选,但它们表达维护工作项或恢复语义,不是 job 调度实现、worker、topic、outbox 或 retry policy。
- 本部分需要承接外部引用失效、摘要缺失、下游影响摘要缺失、读取材料旧视图、消费材料待收敛等状态线索,但 Step 5 不能定义状态机。
- 若没有该组成部分,刷新 / 恢复责任会散落到各核心组成部分,容易让查询、消费或追溯路径在同步入口中承担过多实现压力,或让维护逻辑反向改写 truth。

取舍:

- 本组成部分保留在 Step 5 总表中,但明确为支撑 / operation 组成部分,不是核心 truth 主链的一环。
- 维护对象候选以 task / recovery / run / scope 方式记录,而不是把 worker、cron、queue、event topic、outbox 或 adapter 写成组成部分。
- 读取材料、追溯材料和消费材料的具体派生字段留给 Step 6 / Step 7 / Step 8;本 Step 只固定“可刷新、可恢复、可显式待收敛”的职责边界。
- 恢复收敛只允许推动派生材料、引用检查和摘要承接状态收敛;不得补写外部正文、不得重做正式化裁决、不得绕过受控消费边界。

复杂度 / 越界检查:

- 未写 job 名、调度方式、重试策略、queue/topic/outbox、worker loop、状态迁移、repository、API schema、数据库表或锁策略。
- 未把 read model、cache、projection、maintenance task、recovery task 或运行报告当成第二定义 truth。
- 未把外部正文、下游运行状态、治理执行、artifact 生命周期或 marketplace 交易通过恢复路径写入本仓。
- 下一模块只允许写“后台维护与收敛”的正式独立小节和停审记录,不得跳到“外围包与方法集组织”。

### 5.22 后台维护与收敛:再写入

#### 5.22.1 本部分职责

后台维护与收敛负责维护由正式 truth 派生出来的读取材料、消费材料、追溯材料、外部摘要读取材料、引用有效性检查线索和一致性恢复任务。它让已成立的方法资产语义能够被稳定读取、追溯和恢复,但不创建新的业务 truth,也不绕过定义、正式化、版本、消费、关系和外部摘要的正式边界。

本部分需要完成的 capability:

| Capability | 说明 | 后续承接 |
|---|---|---|
| 读取材料刷新 | 推进目录、正式定义、正式版本、关系和分发等读取材料从正式 truth 派生并收敛。 | Step 6 `ReadMaterialRefreshTask`;Step 8 maintenance flow |
| 消费材料刷新 | 推进受控消费读取材料和可用性视图收敛,但不重新裁决消费边界。 | Step 6 refresh scope candidates;Step 8 consumption refresh |
| 追溯材料刷新 | 推进追溯材料、证据线索材料和影响摘要读取材料收敛。 | Step 6 `TraceMaterialRefreshTask`;Step 8 trace maintenance |
| 引用有效性检查 | 检查外部摘要 / 引用、artifact / archive ref 和 marketplace 生态 ref 的可用性线索。 | Step 6 `RefreshScopeRef`;Step 8 reference check |
| 一致性恢复收敛 | 在传播、摘要、读取材料或引用状态异常时推进可恢复收敛。 | Step 6 `ConsistencyRecoveryTask`;Step 9 state candidate |
| 维护进度可见 | 表达维护 run、刷新范围、待收敛、待恢复、待确认或显式不可用口径。 | Step 6 `MaintenanceProgressView`;Step 15 observability / audit |

#### 5.22.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| MethodAssetMaintenanceService | Application service | 编排读取材料、追溯材料、引用有效性和一致性恢复的维护动作。 | Step 7 API / 接口骨架;Step 8 处理流 |
| ReadMaterialRefreshTask | Task candidate | 表达正式读取和消费材料的刷新任务语义,不得成为 job 调度实现。 | Step 6 关键对象轮廓 |
| TraceMaterialRefreshTask | Task candidate | 表达追溯材料、证据线索材料和影响摘要材料的刷新任务语义。 | Step 6 关键对象轮廓 |
| ConsistencyRecoveryTask | Recovery candidate | 表达引用、摘要、传播或派生材料异常后的恢复收敛语义。 | Step 6 关键对象轮廓 |
| MaintenanceConvergenceRule | Policy candidate | 约束维护动作只能推动派生材料和状态收敛,不得改写核心 truth。 | Step 6 policy 候选;Step 8 guard |
| RecoverySafetyRule | Policy candidate | 约束恢复路径不得复制外部正文、重做正式化裁决或绕过消费边界。 | Step 6 policy 候选 |
| MaintenanceProgressView | Read model candidate | 表达维护进度和可见状态,不得成为维护 truth 或业务 truth。 | Step 6 候选筛选;Step 15 observability / audit |
| MaintenanceRunRef | Reference candidate | 标识维护运行语境,不等同于 worker、scheduler 或队列。 | Step 6 typed ref 候选 |
| RefreshScopeRef | Reference candidate | 标识刷新或恢复范围,用于限定维护动作影响面。 | Step 6 typed ref 候选 |

#### 5.22.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | ReadMaterialRefreshTask;TraceMaterialRefreshTask;ConsistencyRecoveryTask | 三者必须独立判断其 task / recovery 性质,并明确不拥有业务 truth。 |
| Policy / Invariant | MaintenanceConvergenceRule;RecoverySafetyRule | 必须说明维护收敛边界、恢复安全边界和不得反写核心 truth 的不变量。 |
| Projection / Read model | MaintenanceProgressView | 作为 read model 候选进入 Step 6 筛选,不得替代维护任务或核心 truth。 |
| Reference / Boundary | MaintenanceRunRef;RefreshScopeRef | 必须明确 typed ref 候选,不得由 worker id、queue id、cron 名或 free-form scope 字符串替代。 |
| Audit / History | MaintenanceRunHistory | 作为 history / audit candidate 进入 Step 6 筛选,用于说明维护和恢复动作的来源与结果。 |

#### 5.22.4 本部分不承担什么

- 不创建、修改或替代方法资产定义 truth、正式版本 truth、消费边界 truth、关系 truth 或外部摘要 truth。
- 不绕过正式化、版本、受控消费、关系完整性或外部正文边界来修复数据。
- 不保存外部正文、治理执行正文、下游运行状态、artifact 正文、archive 包、marketplace 交易或 UI 会话状态。
- 不把 read model、projection、cache、index、maintenance report 或恢复结果当成第二定义 truth。
- 不定义具体 job 名、worker loop、调度频率、queue、topic、outbox、重试策略、锁策略、数据库表或 adapter。
- 不因为读取材料旧视图、下游未感知或外部引用不可用而回滚已成立的核心 truth。

#### 5.22.5 与其他部分的接缝

| 对接部分 | 接缝 | 说明 |
|---|---|---|
| 方法资产定义与目录 | definition / catalog truth -> read material refresh | 本部分刷新定义和目录读取材料,但不得修改定义 truth。 |
| 正式化与版本 | formal version -> formal read material refresh | 本部分刷新正式版本读取材料,但不得改变正式化结果或版本 truth。 |
| 受控消费 | consumption material -> consumption read material refresh | 本部分刷新消费材料和可用性读取线索,但不得重新裁决消费边界。 |
| 追溯与一致性保护 | trace / impact material -> trace refresh and recovery scope | 本部分刷新追溯、证据线索和影响摘要材料,但不得改变追溯业务语义。 |
| 关系与分发语义 | relation / distribution material -> relation read material refresh | 本部分刷新关系和分发读取材料,但不得创建或修改关系 truth。 |
| 外部摘要与引用 | external ref / summary -> validation and refresh scope | 本部分检查引用有效性和摘要读取材料,但不得复制外部正文补齐。 |
| 外围包与方法集组织 | peripheral material -> peripheral refresh scope | 本部分可维护外围读取材料,但外围不可用不得影响核心闭环成立。 |

停审记录:

- 功能是否清楚: pass。职责、capability 和接缝已围绕读取材料刷新、追溯材料刷新、引用检查和恢复收敛闭合。
- 候选对象是否有功能来源: pass。候选对象均来自当前 00 / 01、Step 4、总表和对象发现维度表。
- 接缝是否清楚: pass。已明确与定义目录、正式化版本、受控消费、追溯一致性、关系分发、外部摘要和外围组织的边界。
- 禁止事项是否清楚: pass。已排除核心 truth 改写、外部正文补齐、下游运行状态入仓、job 调度和 outbox / topic 实现。
- 是否越界: pass。未写字段、状态迁移、job schema、worker loop、event payload、存储结构、锁策略或 adapter 实现。

### 5.23 外围包与方法集组织:先思考

问题回答:

- 本组成部分负责在外围增强层表达方法资产包、组织级方法集和生态发现语义,使组织能够按包或方法集采用一组已成立的方法资产。
- 它要回答“如何围绕核心方法资产定义组织包或方法集”、“外围组织语义如何消费核心定义、正式版本、关系和分发语义”、“如何保证外围增强不可反向成为核心闭环前置”。
- 它可以进入 Step 5 总表和对象发现线索,但必须被标注为外围增强;核心定义、正式化、受控消费、追溯一致性不能依赖它才成立。

诊断:

- 当前 00 / 01 明确将 MethodPlugin / MethodConfiguration、方法资产包、组织级方法集、marketplace 生态发现、高级策略变体和标准映射材料列为外围增强,并要求外围增强失效时核心闭环仍成立。
- `MethodPackage` 应表达围绕已成立核心方法资产的外围包组织语义,不是 marketplace listing、交易商品、安装包正文、artifact 包或外部 package storage。
- `MethodSetAssembly` 应表达组织级方法集组装语义,但不能替代核心方法资产定义、正式版本或消费边界,也不能把组织级运行配置和 UI 匹配实现迁入核心。
- 本部分需要消费 `关系与分发语义` 的分发上下文,也需要消费 `外部摘要与引用` 的 marketplace / package 外部 ref,但不得拥有交易、订单、结算、安装和履约事实。
- 若不在 Step 5 留出外围位置,后续 MethodPackage / MethodSetAssembly 容易被误塞进核心定义、消费或 marketplace 边界;若写得过强,又会让外围能力拖垮核心闭环。

取舍:

- 本组成部分保留为 Step 5 末尾的外围组成部分,而不是核心组成部分。它可为 Step 6 提供候选对象,但后续是否进入当前实现主线必须由实施边界再裁决。
- `MethodPackage` 与 `MethodSetAssembly` 暂合并在一个外围组成部分中,因为二者都服务于组织、采用和生态发现语义;不在 Step 5 拆成两个主要组成部分。
- marketplace 只作为生态发现 / 外部引用上下文,不在本部分内定义上架、定价、订单、购买、订阅、结算、安装、履约或退款。
- 高级 ViewProfile 匹配、AIPolicy override 和标准映射材料只作为外围增强接缝或后续扩展方向,不在本组成部分中展开对象细节。

复杂度 / 越界检查:

- 未写 package schema、method set 字段、组织级 override 规则、marketplace listing schema、交易状态、安装状态、event payload、repository 或存储结构。
- 未把 MethodPackage / MethodSetAssembly 写成核心闭环成立前置,也未让外围组织语义覆盖核心定义 truth。
- 未把 marketplace、console / SDK、artifact、外部 package storage 或 UI 体验写成本仓内部核心组成部分。
- 下一模块只允许写“外围包与方法集组织”的正式独立小节和停审记录,不得跳到“总体边界说明”。

### 5.24 外围包与方法集组织:再写入

#### 5.24.1 本部分职责

外围包与方法集组织负责在外围增强层表达方法资产包、组织级方法集和生态发现语义。它围绕已成立的核心方法资产定义、正式版本、关系和分发语义组织一组可被采用或发现的方法资产,但不作为核心闭环成立前置,也不覆盖或替代核心方法资产定义 truth。

本部分需要完成的 capability:

| Capability | 说明 | 后续承接 |
|---|---|---|
| 方法资产包组织 | 围绕已成立的核心方法资产组织外围资产包语义。 | Step 6 `MethodPackage`;Step 8 peripheral flow |
| 组织级方法集组装 | 表达组织采用或复用一组方法资产的组装语义。 | Step 6 `MethodSetAssembly`;Step 8 method set flow |
| 包组成边界保护 | 约束包内成员只能引用已成立或允许引用的方法资产,不得创建第二定义 truth。 | Step 6 `PackageCompositionRule`;Step 8 guard |
| 方法集组装边界保护 | 约束组织级方法集不得覆盖正式版本、消费边界或关系 truth。 | Step 6 `MethodSetAssemblyRule`;Step 8 guard |
| 生态发现语义支撑 | 为 marketplace / ecosystem / console / SDK 等外围发现提供方法资产包或方法集语义。 | Step 6 `MarketplaceContextRef`;Step 7 read boundary |
| 外围不可用隔离 | 在外围能力不可用时保持核心定义、正式化、受控消费和追溯一致性仍成立。 | Step 6 peripheral availability candidate;Step 9 state candidate |

#### 5.24.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| MethodPackageService | Application service | 编排外围方法资产包建立、调整和读取支撑。 | Step 7 API / 接口骨架;Step 8 处理流 |
| MethodSetAssemblyService | Application service | 编排组织级方法集组装、调整和读取支撑。 | Step 7 API / 接口骨架;Step 8 处理流 |
| MethodPackage | Peripheral truth candidate | 承载方法资产包组织语义,不得成为 marketplace listing 或安装包正文。 | Step 6 关键对象轮廓 |
| MethodSetAssembly | Peripheral truth candidate | 承载组织级方法集组装语义,不得替代核心定义或正式版本 truth。 | Step 6 关键对象轮廓 |
| PackageCompositionRule | Policy candidate | 约束包组成不得引用越界、未成立或不允许引用的方法资产。 | Step 6 policy 候选;Step 8 guard |
| MethodSetAssemblyRule | Policy candidate | 约束方法集组装不得覆盖核心定义、版本和消费边界。 | Step 6 policy 候选 |
| MethodPackageView | Read model candidate | 派生方法资产包读取材料,不得成为包组织第二 truth。 | Step 6 候选筛选;Step 7 query 骨架 |
| MethodSetAssemblyView | Read model candidate | 派生组织级方法集读取材料,不得成为方法集第二 truth。 | Step 6 候选筛选;Step 7 query 骨架 |

#### 5.24.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | MethodPackage;MethodSetAssembly | 二者必须标注为外围增强 truth candidate,并说明不作为核心闭环前置。 |
| Policy / Invariant | PackageCompositionRule;MethodSetAssemblyRule | 必须说明包组成、方法集组装、核心引用和外围不可反写不变量。 |
| Projection / Read model | MethodPackageView;MethodSetAssemblyView | 作为 read model 候选进入 Step 6 筛选,不得成为包或方法集第二 truth。 |
| Reference / Boundary | MethodPackageRef;MarketplaceContextRef | 必须明确 typed ref 候选,不得由 marketplace id、listing id、package file path 或 route param 替代。 |
| Audit / History | PackageAssemblyHistory | 作为 history / audit candidate 进入 Step 6 筛选,用于说明外围组织变化来源。 |

#### 5.24.4 本部分不承担什么

- 不作为核心定义、正式化、受控消费或追溯一致性成立的前置。
- 不拥有或覆盖方法资产定义 truth、正式版本 truth、消费边界 truth、关系 truth 或外部摘要 truth。
- 不承担 marketplace 上架、定价、订单、购买、订阅、结算、安装、履约、退款或商业授权事实。
- 不保存 package 正文、安装包正文、artifact 正文、archive 包、外部 package storage 内容、UI 会话或 console 私有状态。
- 不把高级 ViewProfile 匹配、AIPolicy override、标准映射材料或组织级运行配置提前写成核心主链。
- 不定义 package schema、method set 字段、交易状态、安装状态、event payload、repository、数据库表或外部适配。

#### 5.24.5 与其他部分的接缝

| 对接部分 | 接缝 | 说明 |
|---|---|---|
| 方法资产定义与目录 | definition ref / catalog scope -> package member | 本部分只引用已成立或允许引用的核心定义,不得创建定义 truth。 |
| 正式化与版本 | formal version -> package / set eligibility | 本部分可要求成员具备正式版本或允许引用状态,但不决定正式版本结果。 |
| 受控消费 | consumption boundary -> package / set adoption context | 本部分可辅助采用语境,受控消费仍负责正式消费材料和边界。 |
| 追溯与一致性保护 | package / set change -> impact hint | 外围组织变化可能形成影响线索,但不替代核心追溯材料。 |
| 关系与分发语义 | distribution context -> package / set organization | 本部分消费关系和分发语义组织外围包或方法集,不得反向规定关系 truth。 |
| 外部摘要与引用 | marketplace / package external ref -> peripheral context | marketplace 或 package 外部引用只能作为外围上下文,不得形成交易或履约 truth。 |
| 后台维护与收敛 | peripheral material -> peripheral refresh scope | 维护部分可刷新外围读取材料,但外围不可用不得影响核心闭环。 |

停审记录:

- 功能是否清楚: pass。职责、capability 和接缝已围绕方法资产包、组织级方法集、外围发现和核心闭环隔离闭合。
- 候选对象是否有功能来源: pass。候选对象均来自当前 00 / 01、Step 4、总表和对象发现维度表。
- 接缝是否清楚: pass。已明确与定义目录、正式化版本、受控消费、追溯一致性、关系分发、外部摘要和后台维护的边界。
- 禁止事项是否清楚: pass。已排除 marketplace 交易履约、安装包正文、artifact/archive 正文、UI/console 私有状态和核心前置化。
- 是否越界: pass。未写字段、package schema、method set schema、交易状态、安装状态、event payload、存储结构或 adapter 实现。

### 5.25 总体边界说明

#### 5.25.1 组成部分分层边界

| 层级 | 组成部分 | 本层职责 | 边界要求 |
|---|---|---|---|
| 核心闭环 | 方法资产定义与目录;正式化与版本;受控消费;追溯与一致性保护 | 让方法资产作为本仓定义 truth 成立、进入正式版本语境、被下游按边界消费,并在变化后可追溯和保护一致性。 | 任何外围、外部或维护能力不可用时,核心闭环仍应保持已成立 truth 不被改写。 |
| 支撑语义 | 关系与分发语义;外部摘要与引用 | 为核心闭环提供关系、分发、外部依据摘要和 typed ref,但不成为第二定义 truth。 | 支撑语义只能补充依据、引用和语境,不得拥有外部正文、交易履约或下游运行状态。 |
| 维护支撑 | 后台维护与收敛 | 维护读取材料、消费材料、追溯材料、引用检查和恢复收敛。 | 只能推动派生材料和状态收敛,不得创建、修改或修复核心 truth。 |
| 外围增强 | 外围包与方法集组织 | 承接方法资产包、组织级方法集和生态发现语义。 | 不作为核心闭环前置,不得覆盖核心定义、正式版本、消费边界或追溯语义。 |

#### 5.25.2 跨组成部分主线

```text
方法资产定义与目录
  -> 正式化与版本
  -> 受控消费
  -> 追溯与一致性保护

关系与分发语义
  -> 补充定义间关系、消费语境和外围分发语义

外部摘要与引用
  -> 向定义、正式化、追溯、关系和外围提供摘要 / ref

后台维护与收敛
  -> 刷新读取 / 消费 / 追溯材料并推进恢复收敛

外围包与方法集组织
  -> 消费核心定义、正式版本、关系和分发语义,但不反向定义核心 truth
```

#### 5.25.3 禁止进入本仓 truth 的能力

| 禁止能力 | 归属 / 边界 | Step 5 处理 |
|---|---|---|
| 流程执行、流程实例、work item 状态 | `L1-process` / runtime use | 只能作为下游消费方语境,不得进入定义 truth。 |
| 成员生命周期、成员状态、身份授权 | `L1-identity` / security | 只能通过正式消费或引用边界协作,不得成为方法资产定义条件。 |
| 治理裁决执行、Gate 流程、policy enforce | `L1-governance` | 只能作为治理结论摘要或依据引用,不得保存执行正文。 |
| 外部工具、MCP、A2A、provider 注册和访问裁决 | `L3-capability-hub` / governance | 本仓不接管外部能力注册或访问绑定。 |
| artifact、archive、证据文件和外部文档正文 | `L1-artifact` / archive / external systems | 本仓只保存摘要或 typed ref,不保存正文或生命周期状态。 |
| marketplace 定价、订单、购买、结算、安装和履约 | `L6-marketplace` | 本仓最多提供资产包、方法集或分发语义来源。 |
| UI 渲染、console 私有状态、SDK 封装体验 | `L5-console` / `L0-sdk` | 可作为外围消费或展示入口,不得成为核心定义来源。 |
| 旧 fingerprint、snapshot、outbox、PostgreSQL、object storage 机制 | 历史实现机制 | 当前 Step 5 不继承;后续若采用必须由当前设计重新闭口。 |

#### 5.25.4 Step 5 不展开事项

- 不定义对象字段、enum 值、状态迁移、工厂函数、repository、port、adapter、DTO、API 路径、event payload、topic、job 调度、数据库表、索引或 artifact JSON。
- 不把 read model、projection、cache、maintenance task、report、trace view 或 audit view 写成第二 truth。
- 不从旧 A-H 模块、旧七类 P0、旧 DDD 对象草案或历史实现机制反推当前组成部分。
- 不把外围包 / 方法集、marketplace、console / SDK、artifact 或条件型治理协作升级为核心闭环前置。

#### 5.25.5 停审记录

- 功能是否清楚: pass。核心、支撑、维护和外围四层边界已明确。
- 候选对象是否有功能来源: pass。总体边界均回指当前 00 / 01、Step 4 和本 Step 各组成部分小节。
- 接缝是否清楚: pass。主线、支撑接缝、维护接缝和外围接缝均已明确。
- 禁止事项是否清楚: pass。边界外能力、外部正文、交易履约、下游运行状态和旧实现机制已集中排除。
- 是否越界: pass。未写字段、接口、协议、状态、持久化、事件或 job 细节。

### 5.26 Step 6 展开门禁

#### 5.26.1 Step 6 必须独立展开的候选对象

| 组成部分 | Step 6 必须展开对象 | 展开要求 |
|---|---|---|
| 方法资产定义与目录 | MethodAssetDefinition;MethodAssetCatalogEntry;MethodAssetDefinitionRef | 必须说明定义 truth、目录语义和 typed ref 边界,不得恢复旧 P0 类型清单。 |
| 正式化与版本 | FormalMethodAssetVersion;FormalizationBasisSummary;FormalizationState | 必须说明正式版本边界、正式依据摘要和正式化状态线索,不得保存治理执行正文。 |
| 受控消费 | MethodAssetConsumptionMaterial;MethodAssetAvailabilityView;DownstreamConsumptionBoundary | 必须说明消费材料、可用性读取和 Definition vs Use 边界,不得拥有下游运行 truth。 |
| 追溯与一致性保护 | MethodAssetTraceMaterial;ConsumptionImpactSummary;ConsistencyProtectionPolicy;MethodAssetAuditTrail | 必须说明追溯材料、影响摘要、一致性保护和审计线索边界,不得保存 raw log 或外部正文。 |
| 关系与分发语义 | MethodAssetRelation;MethodAssetDistributionRef;RelationIntegrityRule | 必须说明定义性关系、分发引用和关系完整性,不得进入 marketplace 交易。 |
| 外部摘要与引用 | ExternalSourceSummary;ExternalSourceRef;ArtifactArchiveRef;ExternalBodyBoundaryRule | 必须说明外部摘要、typed ref、artifact/archive ref 和正文禁止边界。 |
| 后台维护与收敛 | ReadMaterialRefreshTask;TraceMaterialRefreshTask;ConsistencyRecoveryTask | 必须说明 task / recovery 语义,不得写成 job 调度、worker 或第二 truth。 |
| 外围包与方法集组织 | MethodPackage;MethodSetAssembly;PackageCompositionRule | 必须说明外围增强性质和不阻塞核心闭环,不得写成 marketplace listing 或安装包。 |

#### 5.26.2 Step 6 需要筛选但不得遗漏的候选

| 候选类别 | 候选对象 | Step 6 处理要求 |
|---|---|---|
| policy / invariant | MethodAssetIdentityRule;CatalogApplicabilityRule;FormalizationEligibilityRule;VersionStabilityRule;ConsumptionBoundaryPolicy;DefinitionUseBoundaryGuard;ImpactClassificationRule;DistributionBoundaryRule;ExternalBasisAcceptanceRule;MaintenanceConvergenceRule;RecoverySafetyRule;MethodSetAssemblyRule | 逐一判断是否独立成对象、归入 guard/policy 家族或作为不变量说明;不得静默丢弃。 |
| read model / material | MethodAssetCatalogView;FormalMethodAssetVersionView;MethodAssetConsumptionReadMaterial;MethodAssetTraceView;ConsumptionImpactView;MethodAssetRelationView;DistributionReadMaterial;ExternalSourceSummaryView;MaintenanceProgressView;MethodPackageView;MethodSetAssemblyView | 逐一说明派生来源和非 truth 边界;不得把 read model 写成第二 truth。 |
| reference / boundary | CatalogScopeRef;GovernanceBasisRef;ConsumptionContextRef;TraceSubjectRef;ConsumptionImpactSourceRef;RelatedMethodAssetRef;DistributionContextRef;MaintenanceRunRef;RefreshScopeRef;MethodPackageRef;MarketplaceContextRef | 必须决定 typed ref 家族和来源边界;不得由字符串拼接、route param、marketplace id 或外部 URL 直接替代。 |
| history / audit / lineage | MethodAssetDefinitionHistory;FormalizationHistory;ConsumptionTraceMaterial;MethodAssetEvidenceLineage;RelationChangeHistory;ExternalBasisAcceptanceHistory;MaintenanceRunHistory;PackageAssemblyHistory | 必须说明 history/audit/lineage 是否独立展开,并保持 body-free / no raw log / no external body。 |
| state candidate | MethodAssetAvailabilityState;ExternalBasisAcceptanceState | 必须判断是否进入状态对象或状态词表;状态迁移留给 Step 9。 |

#### 5.26.3 Step 6 明确排除项

| 排除项 | 排除理由 | 后续若需要如何进入 |
|---|---|---|
| 旧七类 P0 `MethodContent` 直接清单 | 当前 full-restart 未采用旧对象模型作为对象来源。 | 必须从当前 00 / 01 和本 Step 重新推导并回写 Step 6。 |
| 旧 A-H 组成部分或旧 DDD 对象草案 | 历史结构混入实现分层、旧同步机制和过细对象。 | 只可在差异审计中比较,不得作为 Step 6 输入。 |
| repository、port、adapter、DTO、handler、worker、job、event、topic、database table | 这些属于后续接口、流程、实现或持久化层。 | Step 7~11 若需要再按正式边界展开。 |
| fingerprint、snapshot、outbox、PostgreSQL、object storage 等旧机制 | 当前 Step 5 未授权继承历史实现机制。 | 后续若采用必须由当前设计重新闭口。 |
| process / identity / governance / capability-hub / marketplace / artifact / console / SDK 内部对象 | 属于相邻仓或外部系统。 | 只能以摘要、typed ref、消费边界或外部依赖出现。 |
| marketplace 交易、安装和履约对象 | 已明确属于 `L6-marketplace`。 | 不进入本仓对象轮廓;仅保留生态上下文 ref。 |
| 外部正文、artifact 正文、archive 包、证据文件正文、raw audit log | 已明确禁止保存正文。 | 只能作为摘要、引用或 lineage。 |

#### 5.26.4 Step 6 开工门禁

- Step 6 必须先读取本 Step 的组成部分总表、对象发现维度总表和本门禁清单。
- Step 6 每个对象必须回指一个组成部分、一个功能来源和一个边界说明。
- Step 6 不得直接写字段全集、repository 方法、协议 DTO、event payload、数据库表或状态迁移矩阵。
- Step 6 若发现某个候选对象没有来源、边界或归属,必须先回到本 Step 或 00 / 01 修正,不得在对象章节私补。

停审记录:

- 功能是否清楚: pass。Step 6 必须展开对象、筛选候选和明确排除项已分层列出。
- 候选对象是否有功能来源: pass。所有必须展开对象均可回指当前 00 / 01、Step 4 和 Step 5 组成部分。
- 接缝是否清楚: pass。reference / boundary、read model、policy、audit/history 已作为 Step 6 处理类别列出。
- 禁止事项是否清楚: pass。旧对象、实现机制、相邻仓内部对象、交易履约和外部正文已明确排除。
- 是否越界: pass。未写字段、状态迁移、repository、protocol、persistence、event 或 job 细节。

### 5.27 后续展开一致性说明

#### 5.27.1 Step 6 对象轮廓承接规则

| Step 5 结论 | Step 6 必须如何承接 | 禁止做法 |
|---|---|---|
| 组成部分总表 | 每个对象必须回指一个组成部分和一个对象发现维度。 | 对象脱离组成部分直接从旧 DDD 草案或实现类名恢复。 |
| 核心 / 支撑 / 维护 / 外围分层 | 对象必须标注所属层级,尤其是外围对象不得写成核心前置。 | MethodPackage / MethodSetAssembly 反向成为核心定义前置。 |
| 外部摘要 / 引用边界 | summary/ref/body-boundary 对象必须明确不保存正文。 | 把治理正文、标准全文、artifact 正文或交易履约正文写成对象字段。 |
| read model 非 truth | read model / material 必须写明派生来源和非 truth 地位。 | 将 view、projection、cache、report 写成第二 truth。 |
| typed ref 来源 | reference / boundary 对象必须说明来源和用途。 | 字符串拼接、route param、marketplace id、URL 或文件路径替代 typed ref。 |

#### 5.27.2 Step 7 接口骨架承接规则

| Step 5 结论 | Step 7 必须如何承接 | 禁止做法 |
|---|---|---|
| 核心闭环主线 | 接口按定义、正式化、消费、追溯的能力边界分组。 | 按 repository、数据库表、handler 或旧模块名分组。 |
| 支撑语义接缝 | 关系分发、外部摘要、维护收敛接口只能服务正式边界。 | 支撑接口直接创建或修改核心 truth。 |
| 外围增强隔离 | 外围接口必须标注非核心前置和 marketplace 边界。 | 把 package / method set 接口写成交易、安装或履约 API。 |
| no external body | 接口输入/输出不得承载外部正文或 raw audit body。 | DTO 中塞入标准全文、artifact 正文、archive 包或外部 payload。 |
| Step 6 对象来源 | 接口参数和返回必须优先使用 Step 6 的对象 / ref / summary / material。 | Step 7 私造 DTO 字段绕过 Step 6 对象轮廓。 |

#### 5.27.3 Step 8 处理流承接规则

| Step 5 结论 | Step 8 必须如何承接 | 禁止做法 |
|---|---|---|
| 定义 -> 正式化 -> 消费 -> 追溯主链 | 主流程必须保持该业务顺序,并显式处理支撑接缝。 | 读取、引用、同步或外围采用隐式触发正式化。 |
| query / read 不改 truth | 读取和派生材料流程只能读取或刷新材料,不得修业务 truth。 | query 中 repair projection、refresh reference、创建 truth 或补写正文。 |
| 后台维护只收敛材料 | 维护流程只刷新 read material、trace material、reference validity 和 recovery state。 | job / maintenance 绕过正式化或消费边界修核心对象。 |
| 外部依据只摘要 / 引用 | 外部输入流程必须先进入摘要或 ref 承接。 | flow 直接消费外部系统正文、执行过程或 payload body。 |
| 外围不可拖垮核心 | 外围流程失败只能影响外围材料或外围可用性。 | package / marketplace 不可用导致核心定义或正式版本失效。 |

#### 5.27.4 Step 9 状态矩阵承接规则

| Step 5 结论 | Step 9 必须如何承接 | 禁止做法 |
|---|---|---|
| 状态只来自正式对象 | 状态矩阵必须从 Step 6 的 truth/state/task/recovery candidate 推导。 | 为了流程方便新增未闭口状态。 |
| 核心 truth 与派生材料分离 | truth state、read material state、maintenance state 必须分开。 | read model stale 反向改写 truth state。 |
| 外部/下游缺失不改 truth | 外部依据缺失、引用失效、下游影响摘要缺失必须显式挂起、未知、待确认或不可用。 | 用外部缺失回滚定义 truth 或重建下游状态。 |
| 外围状态隔离 | 外围 package / method set 不可用不得污染核心状态。 | 外围不可用导致正式版本或消费边界变 invalid。 |
| 状态转移需有来源 | 每个状态转移必须能回指 Step 8 flow 和 Step 6 对象。 | 从错误字符串、adapter 私有状态或 fake map 推导状态。 |

#### 5.27.5 一致性停审记录

- 功能是否清楚: pass。Step 6~9 的承接方向已经按对象、接口、流程和状态分别固定。
- 候选对象是否有功能来源: pass。承接规则均回指 Step 5 组成部分、对象发现维度和 Step 6 门禁。
- 接缝是否清楚: pass。核心主链、支撑接缝、维护接缝、外部摘要和外围隔离均有后续展开规则。
- 禁止事项是否清楚: pass。旧草案恢复、DTO 私造、query repair、job truth repair、外部正文、外围前置化均已禁止。
- 是否越界: pass。未写具体字段、接口签名、流程步骤、状态枚举、持久化或事件细节。

---

### 5.28 旧材料差异审计

#### 5.28.1 审计对象

| 旧材料 | 审计用途 | 当前处理 |
|---|---|---|
| 旧 `projects/L3-method-library/02-概要设计.md` | 检查旧概要是否含有会污染当前 Step 5 的组成部分、对象类型或实现机制。 | 只作差异审计,不作为当前结论来源。 |
| 旧 `design-calibration/02_hld_step_05_components_boundary.md` | 检查旧 Step 5 的模块切分、P0/P1 口径和机制假设。 | 只记录差异,不恢复旧结构。 |
| 历史 `design-calibration/03_ddd_*` | 检查旧 DDD 对象、port、状态、存储和流程是否提前反推概要。 | 只用于污染识别,不得反向决定 Step 5。 |

#### 5.28.2 旧材料主要污染信号

| 污染信号 | 旧材料表现 | 当前 Step 5 处理 |
|---|---|---|
| 旧 A-H / 七组成部分结构 | 旧概要和旧 Step 5 曾按 lifecycle / publish governance、MethodContent truth、relation validation、sync / snapshot、query / audit trace、operations recovery、P1 packaging 等结构展开。 | 不继承。当前改为定义与目录、正式化与版本、受控消费、追溯一致性、关系分发、外部摘要、后台维护、外围组织。 |
| 旧 P0/P1 分割 | 旧材料把 P0 tied 到 `MethodContent`,P1 tied 到 MethodPlugin / MethodConfiguration / package enhancement。 | 不继承旧 P0/P1 作为组成部分依据。当前只保留“核心 / 支撑 / 维护 / 外围”的业务边界。 |
| 旧七类 `MethodContent` | 旧材料出现 Qualification、RoleDefinition、TaskDefinition、WorkProductDefinition、ProcessTemplateDef、ViewProfile、AIPolicyDef 等对象类型。 | 不直接恢复为 Step 6 必须对象。Step 6 只能从当前 Step 5 候选对象重新筛选。 |
| 旧实现机制 | 旧材料出现 fingerprint、snapshot、outbox、PostgreSQL、object storage、sync worker 等机制。 | 不作为当前 Step 5 组成部分、对象或流程依据。后续若采用,必须由当前设计重新闭口。 |
| 过早进入 DDD / port / adapter | 历史材料中有 repository、port、adapter、状态和持久化表的详细倾向。 | Step 5 只保留职责、代码主体、对象发现线索和接缝;接口、流程、状态和持久化留给后续 Step。 |

#### 5.28.3 差异结论

| 当前结论 | 是否受旧材料影响 | 说明 |
|---|---|---|
| 8 个组成部分 | no | 来自当前 `00-需求文档.md`、`01-架构设计.md` 和 Step 4 代码主体框架,不是旧 A-H 复刻。 |
| 外围包与方法集组织 | controlled_reuse | 只保留“外围增强、不阻塞核心闭环”的业务位置,不继承旧 P1 作为后置技术包或 marketplace 实现。 |
| 外部摘要与引用 | no | 来自当前外部正文禁止、summary/ref 边界和跨仓依赖规则,不是旧 artifact / archive 实现机制。 |
| 后台维护与收敛 | no | 只作为读取、追溯和一致性材料的维护支撑,不继承旧 snapshot/outbox/worker 机制。 |
| Step 6 对象候选 | no | 已按当前组成部分和对象发现维度重新列出,旧 `MethodContent` 类型不得直接进入。 |

#### 5.28.4 审计结论

- 旧材料能确认本轮需要警惕的污染风险:旧 A-H 结构、旧 P0/P1 分割、旧 `MethodContent` 类型、旧 fingerprint / snapshot / outbox / 存储机制、以及过早 DDD 细化。
- 当前 Step 5 没有从旧材料反推组成部分、对象候选、接口或处理流。
- 当前 Step 5 只在重新推导后保留了少量高层业务概念:方法包 / 方法集作为外围增强,外部摘要 / 引用作为边界承接。
- 当前 Step 5 未发现需要回滚或重写的污染项。

停审记录:

- 功能是否清楚: pass。旧材料审计已覆盖旧概要、旧 Step 5 和历史 DDD 材料。
- 候选对象是否有功能来源: pass。当前对象候选仍以当前 00 / 01、Step 4 和本 Step 组成部分为来源。
- 接缝是否清楚: pass。旧材料只作后置审计,不得进入当前结论推导链。
- 禁止事项是否清楚: pass。旧 A-H、旧 P0/P1、旧 `MethodContent`、旧实现机制和历史 port / adapter 不得反推当前设计。
- 是否越界: pass。未写字段、接口、流程、状态、持久化、事件或实现机制。

### 5.29 自检与停审

#### 5.29.1 完成门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| Step 5 框架是否已先搭建 | pass | 已建立开工确认、必读文档、Step 内计划、候选暂存和模块执行记录。 |
| 是否按模块先思考后写入 | pass | 候选池、总表、对象发现维度、交互总图和 8 个组成部分均按小循环推进。 |
| 组成部分是否闭合 | pass | 已形成 4 个核心、3 个支撑 / 维护、1 个外围组成部分。 |
| 对象发现线索是否足以进入 Step 6 | pass | 已列出必须展开对象、需筛选对象、typed ref / read model / policy / audit / state candidate。 |
| 后续 Step 承接规则是否明确 | pass | 已分别说明 Step 6、Step 7、Step 8、Step 9 的承接和禁止做法。 |
| 旧材料是否只作后置审计 | pass | 旧概要、旧 Step 5 和历史 DDD 只用于污染检查,未反推当前结论。 |
| 是否提前修改正式 `02-概要设计.md` | pass | 本 Step 未更新正式概要文档;正式装配留到 Step 14。 |
| 是否存在当前 blocker | pass | 未发现 Step 5 阻塞项。 |

#### 5.29.2 Step 5 停审结论

```text
Step 5 主要组成部分、职责与边界已完成。
当前结论可以支撑 Step 6 关键对象轮廓开工。
下一步只允许在用户确认后进入 Step 6:先列必读文档,再搭建 Step 6 整体模块。
不得直接写 Step 6 对象内容,不得提前更新正式 `02-概要设计.md`。
```

---

## 6. 模块模板归档

后续每个模块必须按以下格式增量写入:

```text
### <模块名>:先思考

问题回答:
- ...

诊断:
- ...

取舍:
- ...

复杂度 / 越界检查:
- ...

### <模块名>:再写入

<结构化表格 / 图 / 小节>

停审记录:
- 功能是否清楚:
- 候选对象是否有功能来源:
- 接缝是否清楚:
- 禁止事项是否清楚:
- 是否越界:
```

---

## 7. 自检与停审

| 检查项 | 当前状态 | 说明 |
|---|---|---|
| 是否已先搭建 Step 5 框架 | pass | 本文件已建立 Step 内计划、模块台账和写入占位。 |
| 是否已写入业务模块结论 | pass | 已完成候选池、组成部分总表、对象发现维度总表、各部分交互总图、全部组成部分独立小节、总体边界说明、Step 6 展开门禁、后续展开一致性说明和旧材料差异审计。 |
| 是否已更新 flow / 项目台账为 Step 5 completed | pass | `02_hld_calibration_flow.md` 和 `project_execution_ledger.md` 已推进到 Step 6 等待确认。 |
| 是否提前修改正式 `02-概要设计.md` | no | 正式文档只在 Step 14 装配。 |
| 是否使用旧材料反推当前结论 | no | 旧材料只保留为后置差异审计。 |

当前停审:

```text
Step 5 框架已搭建。
“组成部分候选池:先思考 / 再写入”和“组成部分总表:先思考 / 再写入”已完成。
“对象发现维度总表:先思考 / 再写入”已完成。
“各部分交互总图:先思考 / 再写入”已完成。
“方法资产定义与目录:先思考 / 再写入”已完成。
“正式化与版本:先思考 / 再写入”已完成。
“受控消费:先思考 / 再写入”已完成。
“追溯与一致性保护:先思考 / 再写入”已完成。
“关系与分发语义:先思考 / 再写入”已完成。
“外部摘要与引用:先思考 / 再写入”已完成。
“后台维护与收敛:先思考 / 再写入”已完成。
“外围包与方法集组织:先思考 / 再写入”已完成。
“总体边界说明”已完成。
“Step 6 展开门禁”已完成。
“后续展开一致性说明”已完成。
“旧材料差异审计”已完成。
Step 5 completed。
下一步只允许在用户确认后进入 Step 6 开工:先列必读文档,再搭建 Step 6 整体模块。
```
