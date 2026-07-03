# Step 1. 确认需求基线

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 1
> 回填章节: `01-架构设计.md` §1 与上游文档的关系声明、§3 约束条件、§16 需求追溯矩阵
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步目标

确认当前架构设计依赖的需求结论已经收敛到足以支撑架构推导的程度,并识别哪些需求结论会直接影响系统边界、数据所有权、依赖方向和一致性策略。本步只提炼对架构有约束力的需求结论,不重写需求文档全文,不定义容器、模块、协议、状态机、数据库、对象 schema 或技术栈。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `projects/L1-artifact/design-calibration/project_execution_ledger.md` | 当前台账 | 确认 00 已完成,01 可启动。 |
| `projects/L1-artifact/design-calibration/00_requirements_calibration_flow.md` | 已完成 | 确认需求阶段 Step 17 已通过。 |
| `projects/L1-artifact/00-需求文档.md` | 新版正式需求基线 | 作为架构设计直接需求基线。 |
| `00_req_step_02_position_boundary.md` | 已完成 | 提炼本仓定位和非职责边界。 |
| `00_req_step_06_consumers_dependencies.md` | 已完成 | 提炼依赖裁剪和禁止依赖。 |
| `00_req_step_07_core_capability_loop.md` | 已完成 | 固定五个核心能力节点。 |
| `00_req_step_10_business_rules_boundaries.md` | 已完成 | 提炼业务规则、禁止行为和边界约束。 |
| `00_req_step_11_data_ownership.md` | 已完成 | 提炼 truth / snapshot / ref / forbidden body 边界。 |
| `00_req_step_14_acceptance_criteria.md` | 已完成 | 提炼验收与一票否决边界。 |
| `00_req_step_15_risks_open_questions.md` | 已完成 | 识别后续设计待确认项。 |
| `00_req_step_16_traceability_matrix.md` | 已完成 | 检查功能、规则、数据、接口、NFR 和验收追溯。 |
| `projects/L1-artifact/01-架构设计.md` | 旧 Draft | 只作为问题诊断来源。 |
| `standards/document/架构设计讨论流程_SOP.md` | 已读取 | 约束 Step 1 输出和门禁。 |
| `standards/document/架构设计书写规范.md` | 已读取 | 约束正式回填章节粒度。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、需求 flow、正式 00 和架构 SOP / 规范 | done | 本文件 §2 |
| 从新版需求基线提炼架构约束力结论 | done | 本文件 §4、§8.1 |
| 诊断旧 `01-架构设计.md` 中不能继承的口径 | done | 本文件 §5 |
| 选择 full-restart 而非旧文档局部修补 | done | 本文件 §7 |
| 形成架构需求基线、硬约束和未关闭风险 | done | 本文件 §8 |
| 写出 Step 16 可回填草稿 | done | 本文件 §9 |
| 完成 Step 1 自检并更新 flow / 项目台账 | done | 本文件 §10 |

---

## 4. SOP 问题回答

### 4.1 当前架构设计依赖哪些需求结论?

| 编号 | 需求结论 | 对架构的约束 |
|---|---|---|
| ARB-ART-001 | `L1-artifact` 是可审计制品真相仓。 | 架构必须围绕 Artifact fact、version、lineage、baseline 和 consumable reference truth 组织,不能退化为附件库、视图仓、归档包或内容存储适配层。 |
| ARB-ART-002 | Artifact 正文 / 内容事实、版本、血缘与基线事实归 `L1-artifact`。 | 架构必须保留正式制品事实入口、版本语境、血缘语境和受控版本集合边界。 |
| ARB-ART-003 | work、process、governance、conversation、workspace、observability、archive、method-library、runtime、capability-hub 等相邻仓不拥有 Artifact truth。 | 架构必须通过引用、摘要、事件协作、消费回指或 adapter 协作,不得让相邻仓复制、反推或补造 truth。 |
| ARB-ART-004 | 核心能力闭环固定为制品事实承载、制品版本化、制品血缘关联、制品基线冻结、制品事实可消费表达。 | 架构目标、职责、上下文、数据所有权和交互方式必须能支撑这五个节点。 |
| ARB-ART-005 | 查询、投影、报表、搜索、预览、通知、归档友好输出、观测友好输出、SDK / console / sync 友好输出属于外围增强。 | 架构可为外围增强留扩展边界,但不得让外围增强成为核心 truth 成立前置或反写真相。 |
| ARB-ART-006 | 外部正文、运行材料、工具结果、模型上下文、workspace 视图、conversation 正文、observability 正文和 archive package 正文不得进入本仓 truth 生命周期。 | 架构必须区分 Artifact content truth、外部正文引用、展示摘要和禁止保存正文。 |
| ARB-ART-007 | `L0-core` 是唯一编译期依赖,`L0-bus` 只承载变化协作信号。 | 架构依赖方向必须遵守裁剪规则,非 core 仓不能成为 package dependency。 |
| ARB-ART-008 | 重复输入、自动化重放和下游消费不得制造多义 Artifact truth。 | 架构必须保留幂等、冲突识别、重复消费不反写和依赖降级不补造 truth 的一致性策略。 |
| ARB-ART-009 | 旧 P95 / 容量 / hash / tampered 等数字不再是当前需求硬指标。 | 架构不得直接继承旧性能、容量、可用率或技术指标,只能在后续技术选型 / 测试中重新校准。 |
| ARB-ART-010 | 缺失的正式 `04-配置设计.md` 和 `07-实施计划.md` 是后续文档链缺口。 | 架构阶段只记录缺口,不得提前补配置或实施 boundary。 |

### 4.2 这些需求结论里哪些已经稳定?

| 稳定结论 | 判断 |
|---|---|
| 仓定位 | 稳定。`L1-artifact` 是可审计制品真相仓。 |
| 主事实范围 | 稳定。Artifact fact、version、lineage、baseline 和 consumable backref 是本仓主线 truth。 |
| 非职责边界 | 稳定。相邻仓 truth、外部正文、运行材料、视图材料、归档包和观测正文不归本仓。 |
| 核心能力闭环 | 稳定。五个核心能力节点有故事、功能、规则、数据、NFR 和验收承接。 |
| 依赖裁剪 | 稳定。`L0-core` 是唯一编译期依赖,其他仓只能运行期、事件、引用、摘要或 adapter 协作。 |
| 验收否决项 | 稳定。核心闭环断裂、truth ownership 串线、版本 / 血缘 / 基线不可追溯、消费方反写 truth 均为否决项。 |

### 4.3 哪些需求结论仍然待确认?

当前没有阻塞架构 Step 2 的需求缺口。下列事项属于后续架构、概要、详细、配置、测试或实施阶段的细化问题:

| 待确认事项 | 当前架构处理口径 |
|---|---|
| Artifact kind、identity key、classification 和 definition source 的承载方式 | Step 1 不定义 schema;后续概要 / 详细设计闭口。 |
| ArtifactVersion 状态、候选修订、替代关系、历史版本和并发语义 | 架构只保留稳定版本 truth 与禁止无声覆盖原则。 |
| Artifact lineage 关系类型、方向、证据引用和自动化来源可信度 | 架构只保留 fact / version 锚点与正式血缘语境原则。 |
| Baseline 成员表达、冻结语境、治理 / 发布 / 归档协作和历史读取 surface | 架构只保留受控版本集合与历史基线不可补造原则。 |
| Consumable reference、read surface、projection、sync、SDK 和 console 的安全消费形态 | 架构只保留下游不得反写 truth 和消费必须回指正式 truth 的原则。 |
| content storage、hash、content-addressing、完整性校验和 tamper 线索 | 架构后续 Step 可讨论技术取舍,Step 1 不把旧方案升格为结论。 |
| 与 governance、work、process、archive、observability、method-library、runtime 等相邻仓的正式协议 | 后续系统上下文、关键交互和详细设计闭口。 |
| 旧性能、容量、可用性和审计覆盖候选是否升级 | 后续技术选型、测试方案和验收标准再判断。 |

### 4.4 哪些需求会直接影响架构边界?

| 需求 | 影响的架构边界 |
|---|---|
| Artifact truth 由 `L1-artifact` 统一拥有 | 必须保留独立 Artifact truth boundary,不能分散到 work / process / governance / archive。 |
| Artifact fact、version、lineage、baseline 和 consumable reference 是主事实链 | 必须围绕五类事实组织核心上下文和数据所有权。 |
| 派生材料和外部正文不得替代正式 Artifact fact | Content / evidence / runtime / workspace / archive / observability 边界必须与 Artifact truth 分开。 |
| 下游只能引用、展示、封存、观测或同步 | Consumer boundary 与 truth owner boundary 必须分开。 |
| 外围增强不阻塞核心闭环 | Search / preview / projection / report / sync 等边界必须可滞后、可降级且不可反写。 |

### 4.5 哪些需求会直接影响数据所有权?

| 数据类别 | 架构影响 |
|---|---|
| 真相数据 | Artifact fact、version、lineage、baseline 和 consumable backref 必须有主 truth 承载。 |
| 快照数据 | 展示、预览、报表、归档、观测或消费摘要只能服务解释和消费,不得反向定义 truth。 |
| 引用数据 | 外部审查、责任、项目、治理、自动化来源、归档、观测和消费方语境只能以 ref / summary / trace context 进入。 |
| 禁止保存正文 | 外部仓正文、运行材料、视图材料、事件材料、归档包、观测正文和消费方私有材料不得进入 truth 生命周期。 |

### 4.6 哪些需求会直接影响依赖方向或一致性策略?

| 需求 | 影响 |
|---|---|
| `L0-core` 唯一编译期依赖 | 内部层次和 package dependency 必须遵守依赖裁剪。 |
| `L0-bus` 只承载变化协作 | 事件协作不得携带或替代 Artifact body、version set、lineage graph 或 baseline truth。 |
| 相邻仓运行期 / 事件 / 引用 / 摘要协作 | 架构需要明确 adapter、publisher、consumer、resolver 和 safe summary 边界。 |
| 重复输入不得产生多义 truth | 架构必须支持幂等、重复检测和冲突识别,但 Step 1 不定义具体算法。 |
| 依赖不可用不得补造 truth | 一致性策略必须允许等待、不可用、降级或缺少外部语境,禁止反写或伪造。 |

---

## 5. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 旧 `01-架构设计.md` 文档元信息 | 日期为 2026-05-11,状态为 Draft,版本 v0.1.0。 | 与当前新版需求基线和 full-restart 过程不一致。 | Step 16 重建正式文档时清理。 |
| 旧 §1 成功标准 | 写入 Artifact 写 P95、GetLineage P95、hash 校验、5000w、1.5 亿和 tampered 100%。 | 新版需求已明确无来源硬指标不固化。 | 不继承为当前架构目标;后续测试 / 验收重新校准。 |
| 旧 §2 约束条件 | 写入 16 kind、7 relation kind、approved 后内容不可改、baseline pin version+hash、quality_tags 等硬约束。 | 当前需求未把这些旧对象 / 枚举 / hash 规则定为正式结论。 | 只作为历史线索;后续对象契约和规则重新闭口。 |
| 旧 §3 架构风格 | 直接选择 metadata-first、external content store、relation graph、baseline pin。 | Step 1 不能提前确定技术 / 存储风格。 | 后续 Step 10 重新讨论技术选型。 |
| 旧 §4 系统上下文 | 把 process / work / governance / archive / observability 与具体输出混写。 | 需要按新版 truth ownership 重新画上下文,避免消费方变 truth owner。 | 后续 Step 4 重建上下文图。 |
| 旧 §5 限界上下文 | 直接给 Metadata / Lineage / Freeze / Dataset / Content 等上下文。 | 新版需求尚未在架构层重新确认子域划分。 | 后续 Step 5 独立收敛。 |

---

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 架构输入 | 旧 `01` 与旧 README / domain 线索混合。 | 新版 `00-需求文档.md` 为直接需求基线。 | 避免旧口径残留。 |
| 架构主线 | Artifact kind、relation kind、hash、baseline pin 和 content backend 直接展开。 | 先以 Artifact truth ownership、核心能力闭环、依赖裁剪和数据归属为主线。 | 保持需求到架构的推导关系。 |
| 技术和存储 | 旧文档预设 PostgreSQL、Git / S3 / inline / URL、递归 CTE。 | Step 1 不做技术定稿。 | 技术选型属于 Step 10。 |
| 性能目标 | 旧数字直接写目标值。 | 旧数字降为候选目标或历史线索。 | 与新版需求 §13 / §15 一致。 |
| 依赖边界 | 旧文档未完整体现唯一编译期依赖。 | 明确 `L0-core` 唯一编译期依赖,其他仓运行期 / 事件 / 引用协作。 | 与需求裁剪和验收否决项一致。 |
| 风险处理 | 不确定项隐含在正文。 | 显式列入待确认或后续细化。 | 防止后续自行补 schema、port、state 或 config。 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 直接修补旧 `01-架构设计.md` | 快。 | 旧硬指标、技术栈、枚举和上下文残留风险高,难以追溯到新版需求。 | 不采用。 |
| 方案 B: 按架构 SOP 生成 Step 1~16 中间产物后重建正式文档 | 可追溯,能逐步消除旧口径。 | 需要更多步骤。 | 采用。 |
| 方案 C: 在 Step 1 直接确定子域、容器、数据库和技术栈 | 进展看似更快。 | 越过 Step 2~Step 10,会把候选项写成架构事实。 | 不采用。 |
| 方案 D: 把所有待确认项都视为 Step 2 blocker | 极保守。 | 会让架构承担概要 / 详细设计职责,无法推进边界讨论。 | 不采用。 |

---

## 8. 结构化中间产物

### 8.1 需求基线结论

| 结论编号 | 需求基线结论 | 架构承接方式 |
|---|---|---|
| RB-ART-001 | `L1-artifact` 是可审计制品真相仓。 | 架构围绕 Artifact truth、consumer boundary、maintenance boundary 和 handoff boundary 组织。 |
| RB-ART-002 | Artifact fact、version、lineage、baseline 和 consumable reference 是主事实链。 | 后续职责、上下文、数据所有权和一致性策略必须逐项承接。 |
| RB-ART-003 | 相邻仓、外部正文、运行材料、视图材料、归档包和观测正文不拥有 Artifact truth。 | 架构通过 ref、safe summary、snapshot、event signal、adapter 和 handoff 协作。 |
| RB-ART-004 | 五个核心能力节点必须成立。 | 架构目标必须覆盖事实承载、版本化、血缘、基线和可消费表达。 |
| RB-ART-005 | 外围增强不阻塞核心闭环。 | 架构可保留 search / preview / projection / report / sync 扩展点,但不作为 truth 前置。 |
| RB-ART-006 | `L0-core` 是唯一编译期依赖。 | 架构依赖方向和后续实现计划必须执行依赖裁剪。 |
| RB-ART-007 | 无来源硬指标不固化。 | 架构可保留性能和容量方向,但不把旧数字写成已验证目标。 |

### 8.2 架构硬约束结论

| 约束编号 | 硬约束 | 影响章节 |
|---|---|---|
| HC-ART-001 | 不得让 work / process / governance / conversation / workspace / archive / observability / method-library / runtime / capability-hub 拥有 Artifact truth。 | §4 职责边界;§5 系统上下文;§8 依赖方向;§9 数据所有权 |
| HC-ART-002 | 不得把外部正文、运行材料、事件材料、视图材料、归档包、观测正文或消费方私有状态写入 truth 生命周期。 | §9 数据所有权;§13 横切关注点 |
| HC-ART-003 | ArtifactVersion 不得被 current latest、自动化再生成结果、外部状态或视图材料无声覆盖。 | §9 数据所有权;§10 关键交互 |
| HC-ART-004 | Artifact lineage 不得由 runtime trace、tool result、model context、event stream、observability record 或私有追溯链补造。 | §9 数据所有权;§10 关键交互 |
| HC-ART-005 | Artifact baseline 不得由发布说明、治理裁决、归档包、项目状态或临时清单替代。 | §9 数据所有权;§10 关键交互 |
| HC-ART-006 | Consumer、SDK、console、sync、report 和 projection 不得反写、迁移、复制或重建 Artifact truth。 | §8 依赖方向;§9 数据所有权;§13 横切关注点 |
| HC-ART-007 | 唯一编译期上游限定为 `L0-core`。 | §8 依赖方向 |
| HC-ART-008 | 旧硬指标和技术方案不得在 Step 1 直接升格为架构事实。 | §3 约束条件;§11 关键技术选型 |

### 8.3 未关闭需求风险结论

| 风险 | 当前状态 | 是否阻塞 Step 2 |
|---|---|---|
| Artifact 分类、identity key 和 definition source 未定。 | 后续概要 / 详细设计职责。 | 否 |
| ArtifactVersion 状态集、替代关系和并发语义未定。 | 后续详细设计职责。 | 否 |
| Lineage relation taxonomy、证据载体和自动化来源可信度未定。 | 后续概要 / 详细 / 测试职责。 | 否 |
| Baseline member carrier、freeze transition 和历史读取 surface 未定。 | 后续概要 / 详细 / 测试职责。 | 否 |
| Consumable reference、read surface、projection、sync、SDK 和 console 消费形态未定。 | 后续架构 / 详细 / 配置职责。 | 否 |
| Content storage、hash、tamper 和完整性校验方案未定。 | 后续架构技术选型、配置和测试职责。 | 否 |
| 与相邻仓正式协作协议未定。 | 后续系统上下文、交互通信和详细设计职责。 | 否 |
| 正式 `04-配置设计.md` 和 `07-实施计划.md` 缺失。 | 后续文档链职责。 | 否 |
| 相邻仓或消费副本拥有 / 修改 / 补造 Artifact truth。 | 一旦后续发生即阻塞。 | 不阻塞 Step 2,但必须作为硬约束。 |

---

## 9. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §8 的结构化结论,不重复扩写 SOP 问题回答、旧材料诊断和设计取舍。

```md
## 1. 与上游文档的关系声明

> 校准来源:
> - `design-calibration/01_arch_step_01_requirement_baseline.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“当前文档问题诊断”小节,了解本章如何从新版需求基线排除旧架构残留口径。

本文首先承接 `projects/L1-artifact/00-需求文档.md` 已收稳的需求基线,再向上追溯产品、全局架构和依赖裁剪结论。本文不重新定义需求、业务规则、数据归属或验收标准,只把这些结论转译为系统结构、职责边界、依赖方向、数据所有权、一致性策略、技术取舍和演进约束。

旧版 `01-架构设计.md` 中的旧 Draft 状态、P95 / 容量 / hash / tampered 硬指标、16 kind / 7 relation kind、metadata-first、PostgreSQL、Git / S3 / inline / URL 和递归 CTE 等内容只作为历史输入,不作为新版架构真相源直接继承。
```

```md
## 3. 约束条件

本章应摘录:

- `design-calibration/01_arch_step_01_requirement_baseline.md` §8.1 需求基线结论。
- `design-calibration/01_arch_step_01_requirement_baseline.md` §8.2 架构硬约束结论。
- `design-calibration/01_arch_step_01_requirement_baseline.md` §8.3 未关闭需求风险结论。
```

---

## 10. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否只承接新版 `00-需求文档.md` | pass | 旧 `01` 只用于诊断,未作为架构真相源。 |
| 是否明确架构前提 | pass | §8.1 已输出需求基线结论。 |
| 是否明确硬约束 | pass | §8.2 已输出架构硬约束结论。 |
| 是否明确未关闭风险 | pass | §8.3 已输出不阻塞 Step 2 的风险和后续阻塞项。 |
| 是否提前写容器、数据库、协议、schema、状态机或技术栈 | pass | 本步只做需求基线提炼和历史诊断。 |
| 是否允许进入 Step 2 | pass | 当前需求基线足以支撑架构目标与约束讨论。 |

当前 Step 1 `确认需求基线` 已完成。下一步必须等待用户确认后进入 Step 2 `明确架构目标与约束`,并只创建 / 改写 `design-calibration/01_arch_step_02_goals_constraints.md`。
