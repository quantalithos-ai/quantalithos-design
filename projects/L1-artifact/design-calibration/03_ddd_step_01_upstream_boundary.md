# Step 1. 确认概要设计输入边界

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 1
> 回填章节: `03-详细设计.md` §1 与上游文档的关系声明;§17 风险与待确认事项
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步输入

| 输入 | 当前状态 | 用途 |
|---|---|---|
| `projects/L1-artifact/00-需求文档.md` | 当前正式需求基线 | 提供仓定位、业务规则、数据归属、验收红线和禁止行为 |
| `projects/L1-artifact/01-架构设计.md` | 当前正式架构基线 | 提供依赖方向、数据所有权、一致性、通信方式和技术中立边界 |
| `projects/L1-artifact/02-概要设计.md` | 当前正式概要基线 | 提供代码主体框架、10 个主要组成部分、对象轮廓、接口骨架、处理流、状态机、异常边界和配置影响 |
| `projects/L1-artifact/design-calibration/02_hld_step_12_detailed_design_handoff.md` | 已完成 | 提供概要设计向详细设计的稳定输入和回退规则 |
| `projects/L1-artifact/design-calibration/02_hld_step_13_risks_open_questions.md` | 已完成 | 提供不应被详细设计误收为默认结论的风险与待确认事项 |
| `projects/L1-artifact/03-详细设计.md` | 历史草稿 | 仅用于旧主线和旧结构问题诊断,不得作为当前实现契约来源 |

---

## 2. SOP 问题回答

### 2.1 当前详细设计直接承接概要设计中的哪些结论?

当前详细设计直接承接以下结论:

- 代码主体框架已固定为 13 个代码主体:
  `Artifact Sync Entry`、`Artifact Async Intake`、`Artifact Operations Jobs`、`Truth Write Services`、`Truth Read / Consumption Services`、`Intake / Review Boundary Services`、`Derived Maintenance Services`、`Artifact Truth Domain Core`、`Truth Persistence Ports`、`Reference / Snapshot / Body Source Ports`、`Projection / Preview / Report Read Models`、`Derived Persistence / Handoff Preparation Ports`、`Event / Audit / Handoff Relay Ports`。
- 业务主语已固定为 10 个主要组成部分,详细设计不得重新发明新的第一层结构。
- 关键对象轮廓已固定,包括 truth core、boundary context、support states、policies、projections、references / audit 六大对象族。
- 接口骨架已固定为 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 五类。
- 关键处理流已固定为 intake、fact、version、lineage、baseline、authorized read、state-writing consumer、truth change relay、derived maintenance 和 handoff preparation 几条主线。
- 状态机已固定为 8 组并列状态机,不是单一全局状态机。
- 配置影响、异常边界和详细设计承接清单已经在 `02` 收稳,详细设计只能继续下沉为可落码 contract。

### 2.2 概要设计中的代码主体框架是否已经足够稳定?

足够稳定。`02-概要设计.md` 已经明确:

- 哪些主体属于 Inbound / Operations。
- 哪些主体属于 Application Services。
- 哪些主体属于 Domain Model / Policy。
- 哪些主体属于 Ports / Persistence / Projection / Handoff。

因此 `03` 可以继续把这些主体落成 crate / module / file / trait / struct / constructor,但不能改变“谁承接入口、谁拥有 truth、谁只做派生、谁只做交接”的职责边界。

### 2.3 概要设计中的关键对象、接口骨架、处理流和状态机是否足够继续展开?

足够进入详细设计。当前已具备以下直接输入:

- 关键对象:
  `ArtifactFact`、`ArtifactContentFactContext`、`ArtifactVersion`、`ArtifactVersionCandidate`、`ArtifactLineageLink`、`ArtifactBaseline`、`ArtifactBaselineMembership`、`ArtifactIntakeContext`、`ArtifactReviewAnchor`、`AutomationArtifactInput`、`ConsumableArtifactReference`、`ArtifactConsumptionBackref`、`ArtifactDerivedViewState`、`ExternalReferenceResolutionState` 等。
- 接口骨架:
  `RegisterArtifactIntake`、`EstablishArtifactFact`、`PublishArtifactVersion`、`EstablishArtifactLineageLink`、`FreezeArtifactBaseline`、`GetArtifactReadSurface`、6 个 state-writing consumers、各类 truth change events 和 maintenance / handoff jobs。
- 状态主语:
  intake / submission、fact / content、version / lineage / baseline、review / responsibility、automation boundary、consumption / read / backref、derived / reference / refresh / report、trace / handoff。

这些内容已足够支撑 `03` 继续定义字段、DTO、trait、事务边界、错误模型和测试切口。

### 2.4 哪些内容仍停留在概要设计轮廓,进入详细设计前必须补清?

以下内容必须由详细设计继续补清,但当前不阻塞进入 Step 2:

- workspace / crate / package / module / file layout。
- 每个对象的完整字段、typed ref、enum variant、reason / summary / scope carrier 和 Rustdoc 注释。
- Command / Query / Event / Job 的 request / response / receipt / report DTO schema。
- repository / port / adapter trait 签名、UoW、expected version、stored result、idempotency 和 request digest。
- projection rebuild truth source、reference refresh、relay、handoff、receipt 和 failed / retryable surface。
- 正式状态矩阵、非法迁移、错误映射、并发冲突和幂等重入规则。

### 2.5 哪些需求或架构结论会影响详细设计,但不能在详细设计中重新定义?

以下结论只能承接,不得在详细设计中改写:

- `L1-artifact` 是正式 Artifact truth center。
- `ArtifactFact`、`ArtifactVersion`、`ArtifactLineageLink`、`ArtifactBaseline`、`ArtifactConsumptionBackref` 的 truth ownership 只能留在本仓。
- 外部正文、runtime output、archive body、observability body 和 sync private copy 不得进入 Artifact truth。
- baseline 只允许冻结正式 `ArtifactVersion`,不得动态解析 current latest。
- automation 只能 candidate-only 进入收束链,不得直接变成正式 truth。
- Query no-write、Consumer 不写核心 truth、Job 不修复核心 truth。
- 只有 `L0-core` 可作为编译期 sibling 依赖;其余仓只能通过 ref、summary、snapshot、event、port 或 handoff 协作。
- 配置不得改变 truth ownership、正式锚点、正文排除、路径分离和派生不反写边界。

---

## 3. 旧版 03 问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` 文档元信息 | 仍关联旧 `02-概要设计.md v0.1.0` | 与新版 `02` 的 14 章重建结果不一致,不能作为当前详细设计基线 |
| 旧版 `03-详细设计.md` §1 / §2 | 以“内容采集提示”和五部分旧主线为中心 | 不是新版详细设计的实现契约入口 |
| 旧版 `03-详细设计.md` 对象主语 | 使用旧 `Artifact / ArtifactVersion / Baseline / adopted relation / approved relation` 采集式展开 | 未承接新版 `ArtifactFact / ContentFactContext / ConsumptionBackref / DerivedViewState / ExternalResolutionState` 主语 |
| 旧版 `03-详细设计.md` 文件布局 | 直接给出旧目录树和 application/domain/infra 分配 | 缺少对新版 13 个代码主体和 10 个组成部分的映射证明 |
| 旧版 `03-详细设计.md` 数据来源声明 | 仍写“从 draft proto / 现有契约抽取或预先定义” | 不满足当前以正式 `00/01/02` 为真相源的门禁 |

---

## 4. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 详细设计输入 | 可能被旧 `03` 和历史采集主线带偏 | 直接承接新版 `00/01/02` 和 `02_hld_step_12/13` | 保持真相源顺序 |
| 旧 `03` 地位 | 容易被当成“可改可续写”的基线 | 只作为问题诊断输入 | 旧主线与新版概要设计冲突明显 |
| 正式 `03` 生成方式 | 可能直接重写正式文档 | 先创建 `03_ddd_calibration_flow.md` 和逐 Step 中间产物 | 符合详细设计 SOP |
| 后续可落码性 | 可能在旧目录树和旧对象上直接补字段 | 先锁上游边界和不再回答的问题 | 防止实现期私补主语 |

---

## 5. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 在旧 `03` 上局部修补 | 看起来改动少 | 旧主线、旧对象和旧章节残留风险高 | 不采用 |
| B. 直接重写正式 `03` | 推进快 | 跳过 Step 中间产物,正式章节无校准来源 | 不采用 |
| C. 先创建 `03_ddd_calibration_flow.md` 和 Step 1~19 中间产物,最后装配正式 `03` | 可追溯、可审查、可回退 | 步骤更多 | 采用 |

---

## 6. 结构化中间产物

### 6.1 上游关系映射表

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `00-需求文档.md` | 仓定位、数据归属、业务规则、验收红线和禁止行为 | 对象不变量、协议校验、错误分支和测试切口 |
| `01-架构设计.md` | 依赖方向、数据所有权、一致性、通信方式和技术中立边界 | crate 依赖、trait / adapter、event / handoff、transaction 和 projection 规则 |
| `02-概要设计.md` §4~§12 | 代码主体框架、主要组成部分、对象轮廓、接口骨架、处理流、状态机、配置影响和详细设计承接清单 | 文件布局、模块契约、对象契约、trait 契约、DTO schema、函数级 flow、状态矩阵、事务与幂等 |
| `02_hld_step_12_detailed_design_handoff.md` | 概要设计向详细设计的稳定输入和回退规则 | 作为 `03` 的直接门禁输入 |
| `02_hld_step_13_risks_open_questions.md` | 产品未定、外围增强、配置 / 实施缺口等挂起事项 | 防止在 `03` 中误写成默认结论 |
| 旧 `03-详细设计.md` | 旧主线、旧对象、旧目录树和旧数据来源声明 | 仅作历史问题诊断 |

### 6.2 本文不再回答

- `L1-artifact` 是否是正式 Artifact truth center。
- 哪些 truth 属于本仓,哪些 truth 属于相邻仓。
- 外部正文、runtime output、archive body、observability body、sync copy 是否可以入仓。
- baseline formal-only、automation candidate-only、Query no-write、Consumer no-truth、Job no-repair 是否成立。
- 编译期依赖为什么只能收敛到 `L0-core`。

### 6.3 本文必须回答

- Rust workspace / crate / package / module / file layout。
- 每个模块内的对象、trait、adapter、错误类型和测试切口。
- 每个 API / Command / Query / Event / Job 的 DTO、receipt、report 和错误 surface。
- 每个关键处理流的函数级调用链、事务边界、状态推进和副作用。
- 每个状态机的正式矩阵、非法迁移和恢复口径。

### 6.4 输入不足风险

| 风险 | 是否阻塞 Step 2 | 处理口径 |
|---|---|---|
| 旧 `03` 与新版 `02` 大范围冲突 | 不阻塞 | 旧 `03` 只作问题诊断输入 |
| `04-配置设计.md` 尚未重建 | 不阻塞 Step 2,影响 Step 14 / Step 17 | `03` 先定义配置绑定点和 owner,配置项细节后移 |
| `05-测试方案.md` / `06-验收标准.md` 尚未跟随新版 `03` 重建 | 不阻塞 Step 2,影响 Step 16 / Step 17 | `03` 先提供测试切口和验收输入 |
| archive / observability / sync handoff 的产品级协议未定 | 不阻塞 Step 2,影响 Step 8 / Step 14 / Step 15 | 先定义 port、handoff target、receipt 和 failed / retryable surface |

---

## 7. 回填草稿

正式 `03-详细设计.md` 后续整理时:

- §1 “与上游文档的关系声明”引用本文件 §6.1 的上游关系映射表。
- §1 必须明确旧 `03` 只作为历史诊断输入,不得作为新版实现契约来源。
- §17 “风险与待确认事项”可承接本文件 §6.4 的输入不足风险,但需在 Step 18 重新正式收口。

---

## 8. 待确认事项

- 当前没有阻塞 Step 2 的待确认事项。
- `04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md` 和 `07-实施计划.md` 的后续缺口只记录为下游影响,当前不阻塞 `03` 启动。

---

## 9. 进入下一步条件

- 已明确详细设计直接承接新版 `00/01/02`。
- 已明确旧 `03` 只作为问题诊断输入。
- 已明确 `03` 不再回答什么、必须回答什么。
- 已识别输入不足风险,且无阻塞 Step 2 的缺口。
- 可以进入 Step 2 “明确本轮实现范围和非范围”。
