# Step 2. 明确本轮实现范围和非范围

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 2
> 回填章节: `03-详细设计.md` §2 本次详细设计目标与范围
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步输入

| 输入 | 当前状态 | 用途 |
|---|---|---|
| `projects/L1-artifact/design-calibration/03_ddd_step_01_upstream_boundary.md` | 已完成 | 提供 `03` 的真相源顺序、旧 `03` 的诊断定位和“不再重答”的边界 |
| `projects/L1-artifact/00-需求文档.md` | 当前正式需求基线 | 提供 Artifact truth ownership、禁止行为、验收否决线和相邻仓协作红线 |
| `projects/L1-artifact/01-架构设计.md` | 当前正式架构基线 | 提供依赖方向、一致性分层、入口分层和技术中立边界 |
| `projects/L1-artifact/02-概要设计.md` | 当前直接上游 | 提供 13 个代码主体、10 个主要组成部分、关键对象、接口骨架、处理流、状态机和配置影响 |
| `projects/L1-artifact/design-calibration/02_hld_step_12_detailed_design_handoff.md` | 已完成 | 提供 `02` 向 `03` 的承接清单和回退规则 |
| `projects/L1-artifact/design-calibration/02_hld_step_13_risks_open_questions.md` | 已完成 | 提供不应在 `03` 中被误写成默认结论的风险与待确认事项 |
| `projects/L1-governance/design-calibration/03_ddd_step_02_scope.md` | 已读取 | 作为 Step 2 单文件结构和粒度参考 |
| `projects/L1-artifact/03-详细设计.md` | 历史草稿 | 只用于范围误差诊断,不得作为本轮范围来源 |

---

## 2. SOP 问题回答

### 2.1 本轮详细设计必须覆盖哪些实现范围?

本轮 `03-详细设计.md` 必须覆盖 `L1-artifact` 的核心可落码闭环和必要接缝,并且直接承接 `02-概要设计.md` 已收稳的 13 个代码主体和 10 个主要组成部分。

必须覆盖的实现范围包括:

- 实现单元与文件布局:
  workspace、crate、module、file、binary / library 边界、依赖方向和 builder 注入入口。
- 模块实现契约:
  `Artifact Sync Entry`、`Artifact Async Intake`、`Artifact Operations Jobs`、`Truth Write Services`、`Truth Read / Consumption Services`、`Intake / Review Boundary Services`、`Derived Maintenance Services`、`Artifact Truth Domain Core`、`Truth Persistence Ports`、`Reference / Snapshot / Body Source Ports`、`Projection / Preview / Report Read Models`、`Derived Persistence / Handoff Preparation Ports`、`Event / Audit / Handoff Relay Ports`。
- 对象实现契约:
  truth core、boundary context、support states、policies、projections、references / audit 六大对象族的 exact Rust-facing carrier、字段、factory、成员函数、状态、不变量和错误。
- Trait / Port / Adapter 契约:
  truth repository、history / trace / audit / relay、content source / definition / context resolver、projection rebuild、derived persistence、handoff preparation、clock / id / config / unit-of-work 等。
- 协议契约:
  Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 五类接口的 request / response / receipt / report / metadata / idempotency / error surface。
- 函数级处理流:
  intake register、fact establish、version publish、lineage establish、baseline freeze、authorized read、六类 state-writing consumers、truth change relay、projection rebuild、reference refresh、reconciliation、handoff preparation / delivery。
- 状态矩阵:
  intake / submission、fact / content、version / lineage / baseline、review / responsibility、automation boundary、consumption / read / backref、derived / reference / refresh / report、trace / handoff 八组状态机。
- 持久化 / 事务 / 一致性:
  truth / history / trace / stored result / outbox / projection / freshness / receipt 的 repository 语义、expected version、同事务成立边界和最终一致路径。
- 错误 / 并发 / 幂等 / 配置 / 观测 / 测试切口:
  错误 taxonomy、duplicate / conflict / stale / degraded / unavailable 语义、request digest / dedup / replay、config binding、audit / trace hook、最小验证清单。

### 2.2 本轮必须继续展开哪些关键对象、接口、处理流和状态机?

本轮必须把概要设计已经点名的正式主语继续展开为 1:1 可落码契约:

- Truth / State 核心对象:
  `ArtifactFact`、`ArtifactContentFactContext`、`ArtifactVersion`、`ArtifactVersionCandidate`、`ArtifactLineageLink`、`ArtifactBaseline`、`ArtifactBaselineMembership`。
- Truth / State 支撑对象:
  `ArtifactIntakeContext`、`ArtifactSubmissionRecord`、`ArtifactReviewAnchor`、`ArtifactResponsibilityAssignment`、`AutomationArtifactInput`、`ConsumableArtifactReference`、`ArtifactConsumptionBackref`。
- 支撑状态对象:
  `ArtifactDerivedViewState`、`ExternalReferenceResolutionState`。
- Policy / Guard 对象:
  `ArtifactFactPolicy`、`ArtifactVersionPolicy`、`ArtifactLineagePolicy`、`ArtifactBaselinePolicy`、`ArtifactIntakePolicy`、`ArtifactReviewPolicy`、`AutomationBoundaryPolicy`、`ArtifactReadVisibilityPolicy`、`ArtifactTraceabilityPolicy`、`ExternalReferenceValidityPolicy`。
- Projection / Read Model 对象:
  `ArtifactFactSummaryView`、`ArtifactVersionSummaryView`、`ArtifactLineageSummaryView`、`ArtifactBaselineSummaryView`、`ArtifactReviewSummaryView`、`ArtifactReadSurfaceView`、`ArtifactPreviewView`、`ArtifactReportView`、`ArtifactReconciliationReport`。
- Reference / Audit / History 对象:
  `ArtifactContentSourceRef`、`ArtifactDefinitionRef`、`ArtifactWorkContextRef`、`ArtifactProcessContextRef`、`ArtifactGovernanceContextRef`、`AutomationSourceRef`、`AdjacentConsumerRef` 以及 change / trace / handoff / refresh / audit record 家族。
- 接口骨架:
  `RegisterArtifactIntake`、`EstablishArtifactFact`、`PublishArtifactVersion`、`EstablishArtifactLineageLink`、`FreezeArtifactBaseline`、`GetArtifactReadSurface`、六类 state-writing consumer、truth change outbound events、rebuild / refresh / reconcile / handoff jobs。
- 状态机:
  intake / submission、fact / content、version / lineage / baseline、review / responsibility、automation boundary、consumption / read / backref、derived / reference / refresh / report、trace / handoff 八组状态机。

### 2.3 哪些内容不属于本轮详细设计正文范围?

以下内容不属于本轮 `03` 正文范围,只能保留承接口径、风险或后续文档入口:

- 重新定义需求目标、验收目标、业务规则、truth ownership、相邻仓边界或架构依赖方向。
- 重新组织 `02` 已固定的 13 个代码主体、10 个主要组成部分、五类接口骨架或八组状态机。
- 具体 DB、message bus、object store、search、archive、observability、sync、external source 产品选型与生产参数。
- 完整配置项清单、默认值、env var、secret、profile、迁移策略和环境矩阵。
- 完整测试策略、测试数据、自动化脚本、evidence 路径、回归策略和覆盖率计划。
- 验收基线、准入准出、发布门禁、最终判定和生产值守流程。
- phase / commit boundary、提交顺序、开发排期、回退计划和实施报告。
- 高级 search / preview / report / reconciliation 增强、content integrity / tamper 的产品级机制、archive / observability / sync 深度双向集成。
- 相邻仓和外部系统的正文模型、内部数据库模型或非本仓 truth object。

### 2.4 哪些内容应交给下游文档继续收口?

下游文档分工必须保持清晰:

- `04-配置设计.md`:
  完整配置项、profile、默认值、环境变量、secret、调度数字、外部产品接入参数和迁移说明。
- `05-测试方案.md`:
  完整测试矩阵、测试数据、自动化执行、报告产物、回归策略和 evidence 组织。
- `06-验收标准.md`:
  验收门禁、准入准出、验收证据、发布判定和最终失败条件。
- `07-实施计划.md`:
  phase / commit boundary、任务拆分、实现前阅读矩阵、执行顺序、提交要求和回退说明。
- ADR / 运维 / 部署文档:
  产品选型、部署拓扑、容量、监控阈值、值守策略和运行手册。

### 2.5 实现者拿到本轮详细设计后,应能完成哪些代码范围?

实现者拿到正式 `03-详细设计.md` 后,应能直接在目标实现仓完成以下代码范围,而不需要自行补真相源:

- Rust workspace / crate / module / file skeleton。
- `contracts` 层 DTO、view、event、job report、error surface、typed ref carrier。
- `domain` 层 aggregate / entity / value object / policy / state transition。
- `application` 层 command / query / consumer / job service 和编排函数。
- `ports` 层 repository、resolver、projection、relay、handoff、clock / id / config / UoW trait。
- `infra` 层 fake repository、fake adapter、config loader 和最小 runner shell。
- projection / report / reconciliation / handoff / receipt / freshness 的派生维护逻辑。
- trace / audit / outbox / relay / handoff delivery 的 accepted truth side effect。
- unit / contract / service / integration 最小测试切口。

实现者不应再自行决定:

- 哪些对象属于 truth,哪些只属于 projection / reference / audit。
- 哪些接口是 Command / Query / Consumer / Job。
- 哪些状态可迁移、哪些错误应映射为 degraded / unavailable / conflict。
- 哪些字段、typed ref、metadata authority、idempotency digest 或 stored result 由哪里提供。

---

## 3. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| 旧 `projects/L1-artifact/03-详细设计.md` 文档元信息 | 仍绑定旧 `02-概要设计.md v0.1.0` 和旧对象主线 | 本轮范围只承接新版 `00/01/02` 和 `02_hld_step_12/13` |
| 旧 `03` §1~§3 | 以“五个主要部分 + 内容采集提示 + 旧目录树”为起点 | 本轮 Step 2 改为“详细设计必须覆盖什么 / 不覆盖什么”的实现范围表 |
| 正式 `02` §12 | 只给出高层承接方向,尚未转成 `03` 自身的范围声明 | 本步把它转写为详细设计范围表、非范围表和实现者可完成范围 |
| 正式 `02` §13 | 混合了风险、产品未定事项和下游文档缺口 | 本步明确哪些只作为挂起项,哪些不应进入 `03` 正文 |
| `04-配置设计.md` / `07-实施计划.md` 尚未创建 | 容易让 `03` 越界去写配置手册和实施边界 | 本步把配置 / 实施内容明确后移 |

---

## 4. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 范围来源 | 可能混入旧 `03` 的五部分旧结构 | 只承接新版 `00/01/02` 与 `02_hld_step_12/13` | 防止历史草稿回流 |
| 详细设计目标 | 容易被理解为“把对象写细一点” | 明确定义为 1:1 可落码的模块、对象、接口、流程、状态、事务和测试切口契约 | 对齐书写规范 |
| 非范围 | 边界未明,容易越界到配置 / 测试 / 实施 | 明确下游文档职责和后移内容 | 保持文档链分工 |
| 实现者预期 | 可能仍需实现侧猜字段、猜状态、猜 port | 明确实现者应能直接落 workspace、contracts、domain、application、ports、infra、tests | 形成可落码门禁 |

---

## 5. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 只覆盖 fact / version / baseline 三条核心 truth 写路径 | 文档量较小,推进快 | read、consumer、projection、refresh、handoff 和 trace / audit 仍缺 exact 契约 | 不采用 |
| B. 覆盖 `02` 已收稳的核心闭环和必要接缝 | 可直接支撑后续实现和 `07` 实施计划 | 写作量较大,后续 Step 需要严格逐步推进 | 采用 |
| C. 同时把配置手册、测试方案、验收和实施边界写入 `03` | 看起来一次成稿 | 混淆文档职责,会提前锁定下游结论 | 不采用 |

---

## 6. 结构化中间产物

### 6.1 设计目标表

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| 收稳实现边界 | 把 13 个代码主体和 10 个主要组成部分落成正式实现组织主轴 | 实现者可以创建 workspace / crate / module / file layout |
| 收稳对象契约 | 把六大对象族展开为 exact Rust-facing carrier、字段、状态和不变量 | 实现者可以定义 domain / contracts 类型,不自选字段 |
| 收稳协议契约 | 把五类接口骨架展开为 DTO、receipt、report、metadata、idempotency 和错误 surface | 实现者可以实现 entry / consumer / job shell |
| 收稳处理流与事务 | 把关键处理流展开为 application service 编排、save order、relay trigger 和 handoff boundary | 实现者可以实现 service 与 UoW |
| 收稳状态矩阵 | 把八组状态机落成正式 enum、迁移矩阵和 forbidden transition | 实现者可以实现 state guard 和状态测试 |
| 收稳持久化与一致性 | 明确 truth、history、trace、projection、receipt、stored result 的 repository / port 语义 | 实现者可以实现 fake adapter 和 repository trait |
| 收稳配置 / 观测 / 测试切口 | 只定义代码引用配置、trace / audit hook 和最小验证清单 | 下游 `04/05/06/07` 可在不改真相源的前提下继续展开 |

### 6.2 本轮覆盖范围表

| 范围 | 必须覆盖的设计内容 | 后续 Step |
|---|---|---|
| 实现约束与仓级规则 | Rust 语言、workspace 约束、依赖方向、提交 / 恢复纪律 | Step 3 |
| 文件布局 | crate、module、file、binary / library、目录映射 | Step 4 |
| 模块契约 | 13 个代码主体与 10 个主要组成部分的实现落点、职责和非职责 | Step 5 |
| 对象契约 | truth、boundary context、support states、policies、projections、references / audit 六大对象族 | Step 6 |
| trait / port / adapter | repository、resolver、projection、relay、handoff、config、clock、id、UoW | Step 7 |
| 协议契约 | Command、Query、Consumer、Outbound Event、Job 的 DTO / receipt / report / error mapping | Step 8 |
| 函数级处理流 | 写路径、读路径、consumer、rebuild、refresh、reconcile、handoff | Step 9 |
| 状态矩阵 | 八组状态机、允许 / 禁止迁移、重入和冲突规则 | Step 10 |
| 持久化 / 事务 / 一致性 | expected version、同事务成立边界、最终一致派生路径 | Step 11 |
| 错误 / 并发 / 幂等 / 配置 / 观测 / 测试 | 恢复口径、dedup、config binding、audit / trace、最小验证 | Step 12 ~ Step 16 |
| 实施承接 | 实现前阅读矩阵、闭环复核输入、未闭合项 | Step 17 |

### 6.3 非范围表

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 需求目标、用户故事、验收目标重写 | `00-需求文档.md` |
| 系统上下文、限界上下文、依赖方向和技术方案取舍重写 | `01-架构设计.md` |
| 新增 / 删除概要设计的代码主体、主要组成部分、关键对象、主接口或状态机组 | 回退 `02-概要设计.md` 对应 Step |
| 完整配置手册、环境矩阵、secret 和产品参数 | `04-配置设计.md` |
| 完整测试矩阵、测试数据、报告证据和回归策略 | `05-测试方案.md` |
| 准入准出、验收证据、发布门禁和最终判定 | `06-验收标准.md` |
| phase / commit boundary、任务拆分、提交说明和回退计划 | `07-实施计划.md` |
| 产品选型、部署拓扑、容量和运行手册 | ADR / 运维 / 部署文档 |
| 相邻仓正文模型和外部系统内部模型 | 相邻仓设计文档或外部契约 |
| 高级 search / preview / report / reconciliation 增强和深度双向 handoff 集成 | 后续版本 / ADR |

### 6.4 实现者拿到正式 `03` 后应能完成的代码范围

| 代码范围 | 应具备的设计输入 |
|---|---|
| workspace / crate skeleton | Step 3 / Step 4 |
| `contracts` DTO / ref / view / event / job report / error | Step 6 / Step 8 / Step 12 |
| `domain` aggregate / value object / policy / state transition | Step 6 / Step 10 |
| `application` command / query / consumer / job service | Step 7 / Step 8 / Step 9 / Step 13 |
| `ports` repository / resolver / relay / projection / handoff / UoW | Step 7 / Step 11 / Step 14 |
| `infra` fake repository / fake adapter / config loader | Step 7 / Step 11 / Step 14 |
| projection / report / reconciliation / handoff side effect | Step 6 / Step 9 / Step 11 / Step 15 |
| unit / contract / service / integration test shell | Step 16 |

---

## 7. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_02_scope.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“回填草稿”和“待确认事项”小节,了解本轮详细设计覆盖范围、非范围和下游文档边界。

## 2. 本次详细设计目标与范围

本轮详细设计目标是把新版 `02-概要设计.md` 已收稳的 `L1-artifact` 代码主体框架、10 个主要组成部分、关键对象、五类接口骨架、关键处理流、八组状态机和配置影响轮廓,展开为目标实现仓可以 1:1 落码的实现契约。

### 2.1 设计目标表

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| 收稳实现边界 | 把 13 个代码主体和 10 个主要组成部分落成正式实现组织主轴 | workspace / crate / module / file layout |
| 收稳对象契约 | 把六大对象族展开为 exact Rust-facing carrier、字段、状态和不变量 | domain 与 contracts 类型 |
| 收稳协议契约 | 把五类接口骨架展开为 DTO、receipt、report、metadata、idempotency 和错误 surface | entry / consumer / job shell |
| 收稳处理流与事务 | 把关键处理流展开为 application service 编排、save order、relay trigger 和 handoff boundary | service 与 UoW |
| 收稳状态矩阵 | 把八组状态机落成正式 enum、迁移矩阵和 forbidden transition | state guard 与状态测试 |
| 收稳持久化与一致性 | 明确 truth、history、trace、projection、receipt、stored result 的 repository / port 语义 | repository trait 与 fake adapter |
| 收稳配置 / 观测 / 测试切口 | 只定义代码引用配置、trace / audit hook 和最小验证清单 | `04/05/06/07` 可继续展开 |

### 2.2 非范围表

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 需求目标、用户故事、验收目标重写 | `00-需求文档.md` |
| 系统上下文、限界上下文、依赖方向和技术方案取舍重写 | `01-架构设计.md` |
| 新增 / 删除概要设计的代码主体、主要组成部分、关键对象、主接口或状态机组 | 回退 `02-概要设计.md` 对应 Step |
| 完整配置手册、环境矩阵、secret 和产品参数 | `04-配置设计.md` |
| 完整测试矩阵、测试数据、报告证据和回归策略 | `05-测试方案.md` |
| 准入准出、验收证据、发布门禁和最终判定 | `06-验收标准.md` |
| phase / commit boundary、任务拆分、提交说明和回退计划 | `07-实施计划.md` |
| 产品选型、部署拓扑、容量和运行手册 | ADR / 运维 / 部署文档 |
| 相邻仓正文模型和外部系统内部模型 | 相邻仓设计文档或外部契约 |
| 高级 search / preview / report / reconciliation 增强和深度双向 handoff 集成 | 后续版本 / ADR |

---

## 8. 待确认事项

- 当前没有阻塞 Step 3 的待确认事项。
- `04-配置设计.md` 和 `07-实施计划.md` 仍是正式文档缺口,但当前只记录为后续文档职责,不阻塞 `03` 的 Step 3。
- 后续 Step 6 ~ Step 10 如发现需要新增 / 删除概要设计主语,必须回退 `02` 对应 Step,不能在 `03` 中暗改。

---

## 9. 进入下一步条件

- 已明确本轮 `03` 必须覆盖的实现范围。
- 已明确哪些内容不属于 `03` 正文,应后移到 `04/05/06/07` 或 ADR / 运维文档。
- 已明确实现者拿到正式 `03` 后应能直接完成的代码范围。
- 已明确旧 `03` 只用于范围诊断,不是本轮范围来源。
- 可以进入 Step 3 “收稳编码规范、语言 / runtime、仓库约束”。
