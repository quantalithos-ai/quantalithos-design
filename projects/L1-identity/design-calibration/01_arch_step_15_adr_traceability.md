# Step 15. ADR 与需求追溯

> 对应正式章节: `01-架构设计.md` §16 需求追溯矩阵 / §17 ADR 索引
> 本步状态: 已完成
> 前序依赖: Step 14 已完成
> 当前结论: `L1-identity` 的关键架构决定已经可以追溯到新版需求基线、业务规则、数据 ownership、非功能底线、验收和风险挂起口径。本步只建立 ADR 索引和需求追溯,不新增架构结论、不创建 ADR 正文、不伪造已存在 ADR 文件。

---

## 1. Step 状态 + Step 内计划

- 本步目标: 把 Step 1~14 已确认的关键架构决定与需求、约束、风险和取舍来源显式连接起来,形成可长期保留的 ADR 索引和需求追溯矩阵。
- 复杂度判断: 本步必须同时处理 ADR 和需求追溯,但二者主语不同。ADR 主语是“长期架构决策”;追溯矩阵主语是“需求结论 / 约束如何被架构承接”。
- 粒度约束: 本步不写 ADR 正文、不写文件目录、不写历史年表、不写技术清单、不把局部实现选择升格为 ADR、不把待确认事项写成已定结论。
- 判定约束: 只有前文已停审且长期影响 truth、边界、依赖、一致性、消费、追溯或演进主线的决定才进入 ADR 索引。
- 停审要求: 本步已完成审核并作为 Step 16 正式文档装配输入;后续不得在 Step 16 新增 ADR、追溯或风险裁决。

| 计划项 | 产物 | 状态 |
|---|---|---|
| 读取 Step 1~14 与 `00` 需求追溯基线 | 本步输入表 | 已完成 |
| 回答 ADR 与需求追溯问题 | SOP 问题回答表 | 已完成 |
| 诊断旧 Step 15 薄表和追溯目录化问题 | 当前材料 / 旧文档问题诊断表 | 已完成 |
| 确认 ADR 进入标准和不进入项 | 设计取舍表 | 已完成 |
| 输出 ADR 索引结论 | 结构化中间产物 | 已完成 |
| 输出需求追溯矩阵 | 结构化中间产物 | 已完成 |
| 输出漏项检查、停审记录和跨追溯审计 | 结构化中间产物 | 已完成 |
| 形成正式 §16 / §17 回填草稿 | 回填草稿 | 已完成 |
| 完成用户审核确认 | 进入下一步条件 | 已完成 |

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| `00-需求文档.md` §7~§16 | 提供 `C-ID-*`、`FR-ID-*`、`BR-ID-*`、`NFR-ID-*`、`AC-ID-*`、`VETO-ID-*`、`OQ-ID-*` 和需求追溯矩阵 |
| `00_req_step_09_functional_requirements.md` | 提供功能需求与能力节点映射 |
| `00_req_step_10_business_rules_boundaries.md` | 提供业务规则、禁止行为和边界红线 |
| `00_req_step_11_data_ownership.md` | 提供需求层 truth / snapshot / reference / forbidden body 基线 |
| `00_req_step_13_non_functional_requirements.md` | 提供性能、可用性、安全、审计、幂等和可观测口径 |
| `00_req_step_14_acceptance_criteria.md` | 提供 AC / VETO 与验收红线 |
| `01_arch_step_03_responsibility_boundary.md` | 提供做 / 不做、易混职责和边界红线 |
| `01_arch_step_05_bounded_context_subdomains.md` | 提供八个架构单元和核心 / 支撑 / 本地索引分类 |
| `01_arch_step_07_dependency_direction.md` | 提供 `L0-core` 唯一编译期依赖候选和外部来源倒置边界 |
| `01_arch_step_08_data_ownership_consistency.md` | 提供数据 ownership 与一致性策略 |
| `01_arch_step_09_interactions_communication.md` | 提供同步 / 异步 / 后台承接和失败降级口径 |
| `01_arch_step_10_technology_choices.md` | 提供关键机制级选型 |
| `01_arch_step_11_alternatives_tradeoffs.md` | 提供采用 / 不采用路径的取舍来源 |
| `01_arch_step_12_cross_cutting_concerns.md` | 提供横切关注点和架构单元适用审计 |
| `01_arch_step_13_evolution_path.md` | 提供演进触发和不演进项 |
| `01_arch_step_14_risks_open_questions.md` | 提供风险与待确认事项,防止未闭口项被写成 ADR |
| `架构设计讨论流程_SOP.md` Step 15 | 约束 ADR 和追溯必须建立在已停审结论上 |
| `架构设计书写规范.md` §4.16 / §4.17 | 约束需求追溯矩阵和 ADR 索引的正式结构 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些架构决定需要沉淀为 ADR? | 需要长期保留的决定包括:独立 identity truth center、GlobalMember / ProjectMember 分层、正式承接层隔离外部来源、typed ref / source marker、truth / snapshot / reference / forbidden body 分离、query / projection no-write、accepted fact event eventual consistency、append-only trace / career、后台 report-only reconciliation、`L0-core` only compile dependency、full event-sourcing-first 不作为 P0 主体范式。 |
| 每个关键架构决定对应哪些需求、约束或风险来源? | ADR 索引表逐项回指 `C-ID-*`、`FR-ID-*`、`BR-ID-*`、`NFR-ID-*`、`AC-ID-*`、`VETO-ID-*`、Step 8~14 的取舍和风险来源。 |
| 是否存在没有需求来源的架构设计? | 未发现 unresolved 孤儿架构决定。当前 ADR 候选均可回指需求能力、规则、验收、VETO 或前序已停审取舍。 |
| 是否存在没有架构承接的核心需求或关键约束? | `C-ID-1`~`C-ID-5`、`FR-ID-001`~`FR-ID-014`、`BR-ID-001`~`BR-ID-015`、核心 NFR / AC / VETO 均有架构承接。`OQ-ID-001`~`OQ-ID-006` 不是未承接核心需求,而是后续 `03/04/05/06/07` 必须闭口的待确认事项。 |
| 哪些取舍和红线必须长期可追溯? | 正文排除、身份 ref 不复用、查询不写入、外部来源不直达核心、投影 / 对账不反写 truth、同步 fan-out 不作为 accepted 条件、业务仓不得成为编译期依赖、高风险 lifecycle 缺 basis 不 accepted。 |
| 每个 ADR 是否回指已停审的架构单元、需求 / 约束 / 风险来源和取舍结论? | 是。ADR 表中的每项都关联至少一个架构单元或跨单元主线,并回指前序 Step 与需求编号。 |
| 每个关键架构决定完成后是否通过停审? | §7.5 已按架构单元完成追溯停审,§7.6 已按“长期影响、来源充分、不新增未确认结论、非局部实现选择”完成 ADR 停审。 |
| 所有 ADR / 追溯完成后,是否存在孤儿架构决定、孤儿核心需求、普通实现选择误入 ADR 或新增未确认结论? | §7.7 审计未发现 unresolved 冲突。旧 Step 15 中的薄 ADR 候选已被扩展为正式索引和追溯矩阵。 |

---

## 4. 当前材料 / 旧文档问题诊断

| 诊断项 | 旧处理风险 | 本步处理 |
|---|---|---|
| 旧 Step 15 直接列 ADR 候选 | 只有主题和来源,不能说明决策解决什么问题、为什么值得长期保留 | 改为 ADR 索引表,每项写架构决策、问题、关联主线和说明 |
| 需求追溯写成架构基线对照 | 类似目录或标签映射,没有说明需求如何被架构承接 | 改为 `需求来源 -> 需求结论 / 约束 -> 架构承接结果 -> 承接位置 -> 说明` |
| `ADR 候选` 状态不清 | 可能被误读为已有 ADR 文件或正式 ADR 正文 | 明确本步只建立索引,不伪造 ADR 文件,编号为架构索引编号 |
| 普通机制可能误入 ADR | typed ref、marker、event 等机制如果只当技术词写,会变成清单 | 只有长期影响边界和主线的机制进入 ADR,并解释解决的问题 |
| 待确认事项可能被升格为 ADR | `OQ-ID-*` 尚未闭口,若进入 ADR 会制造假定论 | 待确认事项只进入漏项 / 风险追溯,不进入 ADR |
| 旧材料回流可能破坏追溯 | 旧 `02/04` 或旧性能指标可能作为来源进入追溯 | 本步只追溯新版 `00` 与新版 Step 1~14,旧材料只作为风险项 |
| 需求漏项可能被“全覆盖”掩盖 | 一张大表容易声明“已覆盖”但没有定位 | 用能力级、规则级、非功能 / 验收级矩阵分别承接,再做漏项检查 |

---

## 5. 改动前后对比

| 维度 | 旧处理风险 | 新处理 |
|---|---|---|
| ADR 主语 | ADR 编号 / 主题 | 长期架构决策本身 |
| ADR 状态 | 候选但未说明边界 | 明确为架构索引编号,不伪造 ADR 文件 |
| 追溯矩阵 | 架构基线对需求标签 | 需求结论 / 约束到架构承接结果的正式映射 |
| 漏项检查 | 简短“未发现” | 区分需求未承接、架构缺来源、关系未闭口、待确认事项 |
| 风险挂起 | 没有说明和 ADR 的边界 | `OQ-ID-*` 不进入 ADR,继续作为后续设计闭口事项 |
| 停审记录 | 少量决策过审 | 所有 ADR 逐项停审,并做跨 ADR / 追溯审计 |
| 正式回填 | 只提示摘录 | 给出 §16 / §17 可回填草稿 |

---

## 6. 设计取舍

| 方案 / 取舍点 | 采用与否 | 理由 |
|---|---|---|
| 把所有架构章节都映射为 ADR | 不采用 | ADR 索引只记录长期关键决策,不是章节目录。 |
| 为每项 ADR 创建正式 ADR 文件 | 不采用 | 当前 SOP 只要求 `01` 中建立 ADR 索引,不要求生成 ADR 正文或文件。 |
| 使用 `ADR-ID-ARCH-*` 作为索引编号 | 采用 | 能避免伪造已有 ADR 文件,同时为后续正式 ADR 文档留出稳定入口。 |
| 把待确认事项作为 ADR 占位 | 不采用 | 未收稳事项应留在风险 / 待确认表,不能升格为长期决策。 |
| 追溯到每个 user story | 不作为主矩阵主轴 | 用户故事已在需求层映射到 FR;架构层主矩阵追溯到能力、功能、规则、NFR、AC / VETO 更稳定。 |
| 主矩阵只写已成立追溯,缺口另列 | 采用 | 避免用“已覆盖”掩盖未闭口事项。 |
| 将旧 `02/04` 或实现口径作为追溯来源 | 不采用 | 新版 `01` 必须承接新版 `00` 和当前 Step 1~14,旧材料只作历史诊断。 |

---

## 7. 结构化中间产物

### 7.1 ADR 进入标准

| 标准 | 当前口径 | 排除对象 |
|---|---|---|
| 架构层决策 | 影响 truth ownership、职责边界、依赖方向、一致性、通信、横切或演进主线 | 具体 crate、目录、数据库、消息产品、API path、DTO 字段 |
| 长期稳定性 | 后续 `02/03/04/05/06/07` 都必须承接,不能被局部实现自由替换 | 临时迁移步骤、短期 workaround、测试脚本选择 |
| 值得单独理解 | 后续读者需要知道为什么这样分层、为什么不采用相邻路径 | 单纯机制词、章节摘要、历史讨论记录 |
| 来源闭合 | 可回指需求、业务规则、NFR、AC / VETO、风险或已停审取舍 | 缺正式来源的判断 |
| 不新增结论 | 只索引前文已确认的决定 | `OQ-ID-*` 等未确认事项 |

### 7.2 ADR 索引表

| ADR 编号 | 架构决策 | 解决的问题 | 关联主线 | 说明 |
|---|---|---|---|---|
| ADR-ID-ARCH-001 | 将 `L1-identity` 定义为独立 identity truth center | 防止平台级 AI 员工身份被认证账号、ProjectMember、runtime instance、UI profile 或外部来源替代 | 职责边界 / 数据 ownership / 技术机制 | 该决策承接 `C-ID-1`~`C-ID-5` 和 `FR-ID-001`~`FR-ID-014`,是 lifecycle、角色能力、生涯记忆和消费追溯能够围绕同一身份主语成立的前提。 |
| ADR-ID-ARCH-002 | 保持 GlobalMember 与 ProjectMember / work truth 分层 | 防止项目内成员事实、任务事实或 ProjectMember 状态反向定义平台级成员身份 | 职责边界 / 依赖方向 / 数据 ownership | 该决策承接 `BR-ID-006`、`BR-ID-011`、`VETO-ID-003`,长期保护 `L1-work` ownership 和 identity 全局 lifecycle 边界。 |
| ADR-ID-ARCH-003 | 通过正式承接层隔离 method / work / governance / memory / archive 外部来源 | 防止外部输入直接打穿身份核心语义,或把外部正文 / 私有状态写成 identity truth | 系统上下文 / 交互 / 技术机制 | 该决策承接 `FR-ID-005`~`FR-ID-011`、`BR-ID-005`、`BR-ID-007`~`BR-ID-012`,并解释为什么外部来源只能通过 ref、safe summary、basis、marker 或 rejected surface 进入。 |
| ADR-ID-ARCH-004 | 使用 typed reference / source marker,禁止字符串猜测外部 ref 或 private id | 防止跨仓协作依赖隐式字符串格式、route path 或外部私有 id,形成第二真相源 | 依赖方向 / 数据 ownership / 后续可落码性 | 该决策承接 `DEP-ID-*` 和 `VETO-ID-006`,为后续 `03` 的 refs、ports、source state、stale marker 和 tests 提供稳定边界。 |
| ADR-ID-ARCH-005 | 采用 truth / snapshot / reference / forbidden body 分离作为数据 ownership 主轴 | 防止成员摘要、source snapshot、memory ref、event shadow、report finding 或外部正文与 identity truth 混层 | 数据 ownership / 横切关注点 / 验收红线 | 该决策承接 `BR-ID-007`、`BR-ID-011`、`BR-ID-012`、`AC-ID-013`、`VETO-ID-003`,是后续对象和协议不得保存 forbidden body 的长期依据。 |
| ADR-ID-ARCH-006 | 对下游提供只读 projection / query / event / report 消费面,不得直接暴露核心 truth 写模型 | 防止 consumer、query、projection 或 report 反向绑定和改写 identity truth | 消费追溯 / 一致性策略 / 横切 read safety | 该决策承接 `FR-ID-012`~`FR-ID-014`、`BR-ID-002`、`BR-ID-013`、`BR-ID-015`、`VETO-ID-002`、`VETO-ID-005`,长期保护 query no-write 和 report-only。 |
| ADR-ID-ARCH-007 | 采用 accepted identity fact 最终一致传播,不采用同步 fan-out / 跨仓事务作为 accepted 条件 | 防止下游消费、event delivery 或外部仓可用性反向阻塞 identity accepted truth | 关键交互 / 一致性策略 / 技术机制 | 该决策承接 `FR-ID-012`、`FR-ID-013`、`NFR-ID-002`、`NFR-ID-006`,并解释为什么传播失败只能进入 pending / replayable / failed marker,不能回滚 truth。 |
| ADR-ID-ARCH-008 | 采用 append-only trace / career 机制承接身份变化、生涯和关键判断追溯 | 防止生命周期、生涯记录、角色能力变化和 memory ref 变化缺少可审计来源,或通过原地改写掩盖事实 | 数据 ownership / 审计追溯 / 横切关注点 | 该决策承接 `FR-ID-009`、`FR-ID-013`、`BR-ID-010`、`BR-ID-014`、`NFR-ID-005`、`NFR-ID-007`,长期保护身份叙事和 accountability。 |
| ADR-ID-ARCH-009 | 后台 projection / reference / reconciliation 只做延后承接和 report-only finding,不得修复相邻仓 truth | 防止维护任务、对账任务或 projection rebuild 成为第二写源或跨仓修复器 | 后台维护 / 数据 ownership / 验收 VETO | 该决策承接 `FR-ID-014`、`BR-ID-015`、`NFR-ID-008`、`NFR-ID-009`、`VETO-ID-005`,长期约束 jobs / reports / reconciliation 的边界。 |
| ADR-ID-ARCH-010 | 除 `L0-core` shared contracts 外,业务仓不得成为 identity 编译期依赖 | 防止 method、work、governance、archive、observability 等 implementation 侵入 identity,形成循环依赖或 truth 混层 | 依赖方向 / 配置与运行边界 | 该决策承接 `DEP-ID-001`、`DEP-ID-002`~`DEP-ID-007` 和 `VETO-ID-006`,是后续 adapter / resolver / publisher / handoff port 的架构依据。 |
| ADR-ID-ARCH-011 | 不把 full event-sourcing-first 作为 P0 identity truth 主体范式 | 防止为了追溯和 replay 提前引入超出当前需求的建模、存储、迁移和测试复杂度 | 方案取舍 / 技术机制 / 演进路线 | 该决策来自 Step 10~13 已停审取舍。当前采用 append-only trace / career 与 accepted fact event collaboration,后续只有在 replay / temporal query / audit 压力明确时再评估。 |

### 7.3 需求追溯矩阵

| 需求来源 | 需求结论 / 约束 | 架构承接结果 | 承接位置 | 说明 |
|---|---|---|---|---|
| `C-ID-1`;`FR-ID-001`~`FR-ID-003`;`BR-ID-001`~`BR-ID-003`;`AC-ID-001`;`VETO-ID-001`~`VETO-ID-002` | 平台必须建立稳定 AI 员工身份主语,读取不得隐式创建,身份 ref 不得复用 | 独立 identity truth center、平台级成员身份真相架构单元、身份 ref 稳定和 tombstone 语义 | §4 职责边界;§6 限界上下文;§9 数据所有权;§11 技术机制 | 架构把需求中的身份锚定转译为本仓核心 truth,并用 query no-write 和 ref 不复用红线保护它。 |
| `C-ID-2`;`FR-ID-004`~`FR-ID-005`;`BR-ID-004`~`BR-ID-006`;`AC-ID-002`;`AC-ID-007`;`VETO-ID-004` | 成员全局 lifecycle 由 identity 表达,高风险处置必须有依据 | 成员生命周期边界作为支撑子域;全局 lifecycle 属于本仓 truth;governance / authorization 只作为 basis ref / summary | §4 职责边界;§6 子域;§9 数据所有权;§10 关键交互 | 架构区分全局 lifecycle、ProjectMember 状态和 runtime availability,并把 high-risk basis 留在正式承接层。 |
| `C-ID-3`;`FR-ID-006`~`FR-ID-008`;`BR-ID-007`~`BR-ID-009`;`AC-ID-003`;`AC-ID-008`;`VETO-ID-003` | identity 维护身份侧角色能力摘要,不得保存 RoleDefinition / CapabilityDefinition 正文或评估算法正文 | 角色能力摘要架构单元;identity-side summary / source ref / evidence ref 分离;method-library 正文外部拥有 | §6 子域;§8 依赖方向;§9 数据所有权;§10 关键交互 | 架构用正式承接层和 forbidden body boundary 承接角色能力需求,避免 method truth 入仓。 |
| `C-ID-4`;`FR-ID-009`;`BR-ID-010`~`BR-ID-011`;`AC-ID-004`;`AC-ID-009`;`VETO-ID-003` | 生涯记录只能追加,项目事实和 ProjectMember truth 不由 identity 反向定义 | 身份侧 career append record 属于本仓 truth;project / ProjectMember 只作为来源 ref / safe summary | §4 职责边界;§9 数据所有权;§10 关键交互;§13 横切关注点 | 架构把生涯需求承接为身份侧追加历史,而不是复制 work truth。 |
| `C-ID-4`;`FR-ID-010`~`FR-ID-011`;`BR-ID-012`;`AC-ID-010`;`VETO-ID-003`;`OQ-ID-003` | identity 可维护 memory / archive refs,但不得保存 memory body、embedding 或 archive package | 成员与 memory / archive refs 的关系归 identity;外部正文和 package 归承载方;handoff surface 后续闭口 | §4 职责边界;§9 数据所有权;§10 关键交互;§15 风险与待确认 | 架构已承接 ref-only boundary,但 handoff target / result surface 仍是后续详细设计待确认项。 |
| `C-ID-5`;`FR-ID-012`;`BR-ID-013`;`AC-ID-005` | 相邻仓只能通过正式边界消费身份事实,不能反写 identity truth | 只读 query / projection / event / report 消费面,consumer 不直接绑定核心写模型 | §8 依赖方向;§9 数据所有权;§10 关键交互;§11 技术机制 | 架构把消费需求转译为读写分离和派生消费边界,避免下游成为第二写源。 |
| `C-ID-5`;`FR-ID-013`;`BR-ID-014`;`NFR-ID-005`;`AC-ID-005` | 身份变化、角色能力变化、生涯追加和 memory ref 变化必须可追溯 | append-only trace / career、safe trace view、audit / handoff ref 和可见性裁剪 | §9 数据所有权;§10 关键交互;§11 技术机制;§13 横切关注点 | 架构把追溯需求承接为本仓自身 accountability 材料和只读追溯视图,不保存外部正文。 |
| `C-ID-5`;`FR-ID-014`;`BR-ID-015`;`NFR-ID-008`~`NFR-ID-009`;`VETO-ID-005` | 投影 / 引用对账只能发现和报告漂移,不得修复相邻仓 truth | 后台 projection / reference / reconciliation 承接;report-only finding;维护任务不写外部 truth | §9 数据所有权;§10 关键交互;§12 备选方案与取舍;§13 横切关注点 | 架构把维护需求收敛为 report-only 和本仓派生状态维护,防止后台越权。 |
| `DEP-ID-001`;`VETO-ID-006`;全局依赖裁剪规则 | `L0-core` 是唯一编译期依赖候选,运行期 / 事件协作不得写成业务仓源码依赖 | dependency inversion for external sources;method/work/governance/memory/archive 只通过 ref、event、adapter、handoff 协作 | §5 系统上下文;§8 依赖方向;§11 技术机制 | 架构把依赖要求转译为源码依赖裁剪和正式边界协作,后续不能用 path dependency 绕开。 |
| `NFR-ID-002`;`NFR-ID-008`;`AC-ID-015`;`OQ-ID-005` | 基础身份读取和 lifecycle 不应因外围依赖不可用整体失效;性能 / 可用性基线不得继承旧数字 | 核心读取避免同步 fan-out;显式 stale / degraded / unavailable marker;硬阈值后移测试 / 验收 | §10 关键交互;§13 横切关注点;§14 演进路线;§15 风险 | 架构已承接结构性可用性与性能口径,但 P0 数字基线仍需 `05/06` 闭口。 |
| `NFR-ID-003`~`NFR-ID-004`;`AC-ID-014`;`VETO-ID-003` | 写入身份 truth 必须受可信上下文和授权边界约束;外部正文、credential、secret 泄漏 0 容忍 | 安全 / 隐私边界、forbidden body boundary、正式承接层和 redacted diagnostic / report 口径 | §4 职责边界;§9 数据所有权;§13 横切关注点 | 架构用正文排除和输入承接约束保护安全底线,不把安全留给实现细节。 |
| `NFR-ID-006`~`NFR-ID-007`;`BR-ID-010`;`FR-ID-008`~`FR-ID-014` | 重复来源变化、项目事实或维护任务不得产生重复身份、重复历史或重复 report fact | accepted truth 与传播分离、幂等 / 重放安全横切、append-only 语义和 replay / duplicate no-op 口径 | §10 关键交互;§11 技术机制;§13 横切关注点 | 架构层只规定幂等和重放安全主线,具体 idempotency key / digest / result surface 后移详细设计。 |
| `OQ-ID-001`;`FR-ID-006`~`FR-ID-008` | method-library 到 identity 的角色 / 能力来源方式尚未裁决 | 当前只承接 method-library 是外部来源上下文,identity 只保存 ref / safe summary / marker | §5 系统上下文;§8 依赖方向;§15 风险与待确认 | 该追溯关系已说明当前架构边界成立,但具体 event / query / snapshot 协议仍是后续闭口项。 |
| `OQ-ID-002`;`FR-ID-005`;`VETO-ID-004` | 高风险 lifecycle 动作枚举和 basis shape 尚未裁决 | 当前只承接高风险处置必须有 basis,缺 basis 不 accepted;动作枚举和 basis schema 后移 | §9 数据所有权;§10 关键交互;§15 风险与待确认 | 该项不是未被架构承接,而是后续状态矩阵 / protocol / 验收需要继续闭合。 |
| `OQ-ID-004`;`FR-ID-002`;`FR-ID-012`~`FR-ID-013` | 成员摘要字段级 visibility / privacy 裁剪尚未裁决 | 当前只承接 visibility / read safety、not visible / stale / degraded 和 forbidden body 不泄漏 | §10 关键交互;§13 横切关注点;§15 风险与待确认 | 架构已给读取安全主线,字段级 marker 和 redaction schema 后移 `03/05/06`。 |
| `OQ-ID-006` | 既有 `04-配置设计.md` 是否保留或重写尚未裁决 | 当前只规定旧 `04` 不作为新版 `01` 上游,配置不得改变 ownership、query no-write、report-only 或依赖裁剪 | §1 来源承接;§13 横切关注点;§15 风险与待确认 | 该事项挂起到新版 `03` 稳定后复核,不能反向约束当前架构。 |

### 7.4 漏项检查表

| 追溯缺口类型 | 对象 / 缺口 | 影响范围 | 当前状态 | 说明 |
|---|---|---|---|---|
| 核心需求未被承接 | `C-ID-1`~`C-ID-5` | 全部核心能力闭环 | 未发现 | 每个能力节点均有职责边界、子域、数据 ownership、交互和技术机制承接。 |
| 功能需求未被承接 | `FR-ID-001`~`FR-ID-014` | 创建、读取、lifecycle、角色能力、生涯记忆、消费追溯、对账 | 未发现 | 每组 FR 均已映射到架构承接结果;具体 schema / flow 后移不构成架构追溯缺失。 |
| 规则缺架构承接 | `BR-ID-001`~`BR-ID-015` | 身份 ref、查询不写、正文排除、高风险依据、report-only | 未发现 | 规则已进入职责边界、数据 ownership、横切关注和 ADR。 |
| 架构判断缺来源 | ADR-ID-ARCH-001~011 | ADR 索引 | 未发现 | 每项 ADR 均回指需求、规则、验收、VETO 或已停审取舍。 |
| 追溯关系未闭口 | `OQ-ID-001`~`OQ-ID-006` | source protocol、basis shape、handoff、visibility、baseline、config | 已显式挂起 | 这些事项已被架构边界承接,但具体协议 / schema / baseline / config 仍需后续文档闭口,不得在本步主观补齐。 |
| 普通实现选择误入 ADR | 具体数据库、消息产品、API path、DTO、repository、worker、retry | ADR 索引质量 | 未发现 | 本步只记录架构层长期决策。 |
| 旧材料反向进入追溯 | 旧 `01/02/04`、旧 API / table / event 名、旧 P95 / 容量数字 | 真相源链路 | 未发现 | 本步只使用新版 `00` 与 Step 1~14;旧材料只作为风险来源。 |

### 7.5 按架构单元追溯停审记录

| 架构单元 | 需求 / 约束来源 | 关联 ADR | 追溯结论 | 停审结论 |
|---|---|---|---|---|
| 平台级成员身份真相 | `C-ID-1`;`FR-ID-001`~`FR-ID-003`;`BR-ID-001`~`BR-ID-003`;`AC-ID-001`;`VETO-ID-001`~`VETO-ID-002` | ADR-ID-ARCH-001;ADR-ID-ARCH-005 | 已由 identity truth center、stable ref、query no-write 和 forbidden body boundary 承接 | 通过 |
| 成员生命周期边界 | `C-ID-2`;`FR-ID-004`~`FR-ID-005`;`BR-ID-004`~`BR-ID-006`;`VETO-ID-004`;`OQ-ID-002` | ADR-ID-ARCH-001;ADR-ID-ARCH-003;ADR-ID-ARCH-008 | 已由 global lifecycle truth、basis ref / summary 和 high-risk pending / rejected boundary 承接;动作枚举后续闭口 | 通过 |
| 角色能力摘要 | `C-ID-3`;`FR-ID-006`~`FR-ID-008`;`BR-ID-007`~`BR-ID-009`;`AC-ID-003`;`OQ-ID-001` | ADR-ID-ARCH-003;ADR-ID-ARCH-004;ADR-ID-ARCH-005 | 已由 identity-side summary、method source ref / marker 和 forbidden method body boundary 承接;来源协议后续闭口 | 通过 |
| 身份生涯与记忆引用 | `C-ID-4`;`FR-ID-009`~`FR-ID-011`;`BR-ID-010`~`BR-ID-012`;`OQ-ID-003` | ADR-ID-ARCH-005;ADR-ID-ARCH-008 | 已由 career append、ProjectMember ref-only、memory / archive ref-only 和 handoff 挂起口径承接 | 通过 |
| 身份事实消费与追溯 | `C-ID-5`;`FR-ID-012`~`FR-ID-013`;`BR-ID-013`~`BR-ID-014`;`NFR-ID-005` | ADR-ID-ARCH-006;ADR-ID-ARCH-007;ADR-ID-ARCH-008 | 已由只读消费面、event eventual consistency 和 append-only trace / safe trace view 承接 | 通过 |
| 外部来源引用 | `DEP-ID-003`~`DEP-ID-007`;`BR-ID-005`;`BR-ID-007`;`BR-ID-011`~`BR-ID-012`;`OQ-ID-001`~`OQ-ID-003` | ADR-ID-ARCH-003;ADR-ID-ARCH-004;ADR-ID-ARCH-010 | 已由 dependency inversion、typed refs / source markers 和正式承接层承接;具体 source surface 后续闭口 | 通过 |
| 消费投影与对账 | `FR-ID-014`;`BR-ID-015`;`NFR-ID-008`~`NFR-ID-009`;`VETO-ID-005` | ADR-ID-ARCH-006;ADR-ID-ARCH-009 | 已由 projection no-write、rebuild / stale 和 report-only reconciliation 承接 | 通过 |
| 事件协作影子 | `FR-ID-012`~`FR-ID-013`;`NFR-ID-006`;`DEP-ID-002`;`VETO-ID-006` | ADR-ID-ARCH-007;ADR-ID-ARCH-010 | 已由 accepted fact event eventual consistency、delivery / replay marker 和 non-compile dependency boundary 承接 | 通过 |

### 7.6 架构决定停审记录

| ADR 编号 | 是否长期影响主线 | 是否有正式来源 | 是否非局部实现选择 | 是否未新增未确认结论 | 结论 |
|---|---|---|---|---|---|
| ADR-ID-ARCH-001 | 是 | 是 | 是 | 是 | 通过 |
| ADR-ID-ARCH-002 | 是 | 是 | 是 | 是 | 通过 |
| ADR-ID-ARCH-003 | 是 | 是 | 是 | 是 | 通过 |
| ADR-ID-ARCH-004 | 是 | 是 | 是 | 是 | 通过 |
| ADR-ID-ARCH-005 | 是 | 是 | 是 | 是 | 通过 |
| ADR-ID-ARCH-006 | 是 | 是 | 是 | 是 | 通过 |
| ADR-ID-ARCH-007 | 是 | 是 | 是 | 是 | 通过 |
| ADR-ID-ARCH-008 | 是 | 是 | 是 | 是 | 通过 |
| ADR-ID-ARCH-009 | 是 | 是 | 是 | 是 | 通过 |
| ADR-ID-ARCH-010 | 是 | 是 | 是 | 是 | 通过 |
| ADR-ID-ARCH-011 | 是 | 是 | 是 | 是 | 通过 |

### 7.7 跨 ADR / 需求追溯审计表

| 审计项 | 结论 | 说明 |
|---|---|---|
| 是否存在孤儿核心需求 | 未发现 | `C-ID-1`~`C-ID-5` 均有架构承接。 |
| 是否存在孤儿功能需求 | 未发现 | `FR-ID-001`~`FR-ID-014` 均映射到职责、子域、数据、交互或横切章节。 |
| 是否存在孤儿业务规则 / VETO | 未发现 | 规则和 VETO 已进入边界红线、数据 ownership、横切和 ADR。 |
| 是否存在孤儿架构决定 | 未发现 | ADR 项均有正式来源和前序 Step 支撑。 |
| 是否存在普通实现选择误入 ADR | 未发现 | 没有将数据库、消息产品、API、DTO、repository 或 worker 写为 ADR。 |
| 是否存在待确认事项被写成定论 | 未发现 | `OQ-ID-*` 均保留为后续闭口项。 |
| 是否存在目录对照冒充追溯 | 未发现 | 追溯矩阵逐行说明需求结论与架构承接结果的关系。 |
| 是否存在新增未确认结论 | 未发现 | 本步没有新增 source 协议、basis schema、visibility 字段、performance threshold 或 config profile 裁决。 |

### 7.8 追溯范围说明

本步追溯粒度以能力、功能、规则、NFR、AC / VETO 和待确认事项为主,不逐条重复 user story,因为 user story 已在需求层映射到 `FR-ID-*`。ADR 索引只记录长期影响 identity truth、边界、依赖、一致性、消费、追溯和演进的架构决策,不记录普通技术词或实现选择。`OQ-ID-*` 已被架构主线以保守边界承接,但具体 schema、port、baseline 或配置仍未闭口,因此保留在漏项检查和 Step 14 风险口径中,不进入 ADR 定论。

---

## 8. 回填草稿

````md
## 16. 需求追溯矩阵

> 校准来源:
> - `design-calibration/01_arch_step_15_adr_traceability.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“需求追溯矩阵”“漏项检查表”“按架构单元追溯停审记录”和“跨 ADR / 需求追溯审计表”小节,了解每条需求结论如何被架构结果承接,以及哪些事项仍需后续详细设计、配置、测试或验收闭口。

本章只记录已经成立的需求到架构承接关系,不新增架构结论。待确认事项不会被写成已定协议、schema、baseline 或配置结论。

| 需求来源 | 需求结论 / 约束 | 架构承接结果 | 承接位置 | 说明 |
|---|---|---|---|---|
| `C-ID-1`;`FR-ID-001`~`FR-ID-003`;`BR-ID-001`~`BR-ID-003`;`AC-ID-001`;`VETO-ID-001`~`VETO-ID-002` | 平台必须建立稳定 AI 员工身份主语,读取不得隐式创建,身份 ref 不得复用 | 独立 identity truth center、平台级成员身份真相架构单元、身份 ref 稳定和 tombstone 语义 | §4 职责边界;§6 限界上下文;§9 数据所有权;§11 技术机制 | 架构把需求中的身份锚定转译为本仓核心 truth,并用 query no-write 和 ref 不复用红线保护它。 |
| `C-ID-2`;`FR-ID-004`~`FR-ID-005`;`BR-ID-004`~`BR-ID-006`;`AC-ID-002`;`VETO-ID-004` | 成员全局 lifecycle 由 identity 表达,高风险处置必须有依据 | 成员生命周期边界作为支撑子域;全局 lifecycle 属于本仓 truth;governance / authorization 只作为 basis ref / summary | §4 职责边界;§6 子域;§9 数据所有权;§10 关键交互 | 架构区分全局 lifecycle、ProjectMember 状态和 runtime availability,并把 high-risk basis 留在正式承接层。 |
| `C-ID-3`;`FR-ID-006`~`FR-ID-008`;`BR-ID-007`~`BR-ID-009`;`AC-ID-003`;`VETO-ID-003` | identity 维护身份侧角色能力摘要,不得保存 RoleDefinition / CapabilityDefinition 正文或评估算法正文 | 角色能力摘要架构单元;identity-side summary / source ref / evidence ref 分离;method-library 正文外部拥有 | §6 子域;§8 依赖方向;§9 数据所有权;§10 关键交互 | 架构用正式承接层和 forbidden body boundary 承接角色能力需求,避免 method truth 入仓。 |
| `C-ID-4`;`FR-ID-009`~`FR-ID-011`;`BR-ID-010`~`BR-ID-012`;`AC-ID-004`;`VETO-ID-003` | 生涯只能追加;memory / archive 只保存引用和状态,不保存正文 | 身份侧 career append record、member-memory ref relation、memory / archive ref-only boundary | §4 职责边界;§9 数据所有权;§10 关键交互;§13 横切关注点 | 架构把生涯和记忆需求承接为身份侧追加历史与引用关系,而不是复制 work truth、memory body 或 archive package。 |
| `C-ID-5`;`FR-ID-012`~`FR-ID-014`;`BR-ID-013`~`BR-ID-015`;`AC-ID-005`;`VETO-ID-005` | 相邻仓可消费身份事实,身份变化可追溯,维护对账不修复相邻仓 truth | 只读 query / projection / event / report 消费面、append-only trace、report-only reconciliation | §8 依赖方向;§9 数据所有权;§10 关键交互;§13 横切关注点 | 架构把消费追溯需求承接为读写分离、追溯视图和 report-only 维护。 |
| `DEP-ID-001`;`VETO-ID-006` | `L0-core` 是唯一编译期依赖候选,运行期 / 事件协作不得写成业务仓源码依赖 | dependency inversion for external sources;外部协作通过 ref、event、adapter、handoff 边界进行 | §5 系统上下文;§8 依赖方向;§11 技术机制 | 架构把依赖要求转译为源码依赖裁剪和正式边界协作。 |
| `NFR-ID-002`;`NFR-ID-008`;`AC-ID-015`;`OQ-ID-005` | 基础身份读取和 lifecycle 不应因外围依赖不可用整体失效;性能 / 可用性基线不得继承旧数字 | 核心读取避免同步 fan-out;显式 stale / degraded / unavailable marker;硬阈值后移测试 / 验收 | §10 关键交互;§13 横切关注点;§14 演进路线;§15 风险 | 架构已承接结构性可用性与性能口径,但 P0 数字基线仍需 `05/06` 闭口。 |
| `NFR-ID-003`~`NFR-ID-004`;`AC-ID-014`;`VETO-ID-003` | 写入身份 truth 必须受可信上下文和授权边界约束;外部正文、credential、secret 泄漏 0 容忍 | 安全 / 隐私边界、forbidden body boundary、正式承接层和 redacted diagnostic / report 口径 | §4 职责边界;§9 数据所有权;§13 横切关注点 | 架构用正文排除和输入承接约束保护安全底线。 |
| `OQ-ID-001`~`OQ-ID-006` | source protocol、basis shape、handoff、visibility、baseline、config 仍缺后续裁决 | 当前架构只给保守边界和挂起口径,不把未闭口事项写成定论 | §15 风险与待确认事项;§16 追溯漏项 | 这些不是当前架构未承接核心需求,而是后续 `03/04/05/06/07` 必须闭口的追溯缺口。 |

### 16.1 漏项检查

| 追溯缺口类型 | 对象 / 缺口 | 影响范围 | 当前状态 | 说明 |
|---|---|---|---|---|
| 核心需求未被承接 | `C-ID-1`~`C-ID-5` | 全部核心能力闭环 | 未发现 | 每个能力节点均有职责边界、子域、数据 ownership、交互和技术机制承接。 |
| 架构判断缺来源 | ADR-ID-ARCH-001~011 | ADR 索引 | 未发现 | 每项 ADR 均回指需求、规则、验收、VETO 或已停审取舍。 |
| 追溯关系未闭口 | `OQ-ID-001`~`OQ-ID-006` | source protocol、basis shape、handoff、visibility、baseline、config | 已显式挂起 | 具体协议 / schema / baseline / config 仍需后续文档闭口,不得在本章主观补齐。 |
| 普通实现选择误入 ADR | 具体数据库、消息产品、API path、DTO、repository、worker、retry | ADR 索引质量 | 未发现 | 本章只记录架构层长期决策。 |

## 17. ADR 索引

> 校准来源:
> - `design-calibration/01_arch_step_15_adr_traceability.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“ADR 索引表”“架构决定停审记录”和“跨 ADR / 需求追溯审计表”小节,了解哪些架构决策值得长期单独保留,以及为什么它们不是局部实现选择。

本章建立 ADR 索引,不创建 ADR 正文文件。`ADR-ID-ARCH-*` 是本文内的架构决策索引编号,用于后续必要时扩展为正式 ADR。

| ADR 编号 | 架构决策 | 解决的问题 | 关联主线 | 说明 |
|---|---|---|---|---|
| ADR-ID-ARCH-001 | 将 `L1-identity` 定义为独立 identity truth center | 防止平台级 AI 员工身份被认证账号、ProjectMember、runtime instance、UI profile 或外部来源替代 | 职责边界 / 数据 ownership / 技术机制 | 这是 lifecycle、角色能力、生涯记忆和消费追溯能够围绕同一身份主语成立的前提。 |
| ADR-ID-ARCH-002 | 保持 GlobalMember 与 ProjectMember / work truth 分层 | 防止项目内成员事实、任务事实或 ProjectMember 状态反向定义平台级成员身份 | 职责边界 / 依赖方向 / 数据 ownership | 该决策长期保护 `L1-work` ownership 和 identity 全局 lifecycle 边界。 |
| ADR-ID-ARCH-003 | 通过正式承接层隔离外部来源 | 防止外部输入直接打穿身份核心语义,或把外部正文写成 identity truth | 系统上下文 / 交互 / 技术机制 | 外部来源只能通过 ref、safe summary、basis、marker 或 rejected surface 进入。 |
| ADR-ID-ARCH-004 | 使用 typed reference / source marker,禁止字符串猜测外部 ref 或 private id | 防止跨仓协作依赖隐式字符串格式、route path 或外部私有 id | 依赖方向 / 数据 ownership / 后续可落码性 | 该决策为后续 refs、ports、source state、stale marker 和 tests 提供稳定边界。 |
| ADR-ID-ARCH-005 | 采用 truth / snapshot / reference / forbidden body 分离作为数据 ownership 主轴 | 防止派生状态、引用关系、event shadow、report finding 或外部正文与 identity truth 混层 | 数据 ownership / 横切关注点 / 验收红线 | 该决策是后续对象和协议不得保存 forbidden body 的长期依据。 |
| ADR-ID-ARCH-006 | 对下游提供只读 projection / query / event / report 消费面,不得直接暴露核心 truth 写模型 | 防止 consumer、query、projection 或 report 反向绑定和改写 identity truth | 消费追溯 / 一致性策略 / 横切 read safety | 该决策长期保护 query no-write 和 report-only。 |
| ADR-ID-ARCH-007 | 采用 accepted identity fact 最终一致传播,不采用同步 fan-out / 跨仓事务作为 accepted 条件 | 防止下游消费、event delivery 或外部仓可用性反向阻塞 identity accepted truth | 关键交互 / 一致性策略 / 技术机制 | 传播失败只能进入 pending / replayable / failed marker,不能回滚 truth。 |
| ADR-ID-ARCH-008 | 采用 append-only trace / career 机制承接身份变化、生涯和关键判断追溯 | 防止身份变化和生涯记录缺少可审计来源,或通过原地改写掩盖事实 | 数据 ownership / 审计追溯 / 横切关注点 | 该决策长期保护身份叙事和 accountability。 |
| ADR-ID-ARCH-009 | 后台 projection / reference / reconciliation 只做延后承接和 report-only finding,不得修复相邻仓 truth | 防止维护任务、对账任务或 projection rebuild 成为第二写源或跨仓修复器 | 后台维护 / 数据 ownership / 验收 VETO | 该决策长期约束 jobs / reports / reconciliation 的边界。 |
| ADR-ID-ARCH-010 | 除 `L0-core` shared contracts 外,业务仓不得成为 identity 编译期依赖 | 防止相邻仓 implementation 侵入 identity,形成循环依赖或 truth 混层 | 依赖方向 / 配置与运行边界 | 该决策是后续 adapter / resolver / publisher / handoff port 的架构依据。 |
| ADR-ID-ARCH-011 | 不把 full event-sourcing-first 作为 P0 identity truth 主体范式 | 防止为追溯和 replay 提前引入超出当前需求的建模、存储、迁移和测试复杂度 | 方案取舍 / 技术机制 / 演进路线 | 当前采用 append-only trace / career 与 accepted fact event collaboration,后续按压力触发再评估。 |
````

---

## 9. 待确认事项

本步不新增待确认事项。Step 14 中的风险和 `OQ-ID-001`~`OQ-ID-006` 继续有效,并在本步追溯矩阵中保留为后续闭口项。

| 待确认项 | 本步处理 |
|---|---|
| `OQ-ID-001` method-library 到 identity 的角色 / 能力来源方式 | 追溯到正式承接层和 ref / summary / marker 边界,不裁决 event / query / snapshot 协议。 |
| `OQ-ID-002` 高风险 lifecycle 动作枚举 | 追溯到 high-risk basis 必须存在,不裁决动作枚举和 basis schema。 |
| `OQ-ID-003` memory refs 的正式承载方和迁移结果 surface | 追溯到 ref-only / handoff boundary,不裁决 handoff target 和 result marker。 |
| `OQ-ID-004` 成员摘要 visibility / privacy 字段级裁剪 | 追溯到 visibility / read safety,不裁决字段级 marker。 |
| `OQ-ID-005` P0 performance / availability 阈值 | 追溯到结构性性能 / 可用性口径,不裁决硬阈值。 |
| `OQ-ID-006` 既有 `04` 是否保留或重写 | 追溯到旧 `04` 不作为新版 `01` 上游,不裁决配置方案。 |

---

## 10. 进入下一步条件

Step 15 已完成。进入 Step 16 前的条件已满足:

- 用户已确认继续,本步 ADR 索引和需求追溯矩阵作为正式装配输入。
- `01_architecture_calibration_flow.md` 将 Step 15 状态更新为 `已完成`。
- Step 16 只能从 Step 1~15 已确认内容装配正式 `01-架构设计.md`,不得新增架构结论、ADR、需求追溯或风险裁决。
- 本步未发现把目录对照当追溯、把待确认事项升格为 ADR、把局部实现选择写进 ADR、遗漏核心需求承接或新增未确认结论的问题。
