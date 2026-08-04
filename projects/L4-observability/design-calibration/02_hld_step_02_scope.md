# L4-observability 02-概要设计 Step 02 · 明确本次设计目标与当前范围

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 2
> 回填章节: `02-概要设计.md` §2 本次设计目标与范围
> 生成日期: 2026-07-08
> 状态: 已完成,等待用户确认后进入 Step 03

---

## 1. 本步目标

在 Step 01 已确认上游输入边界的前提下,明确本轮 `L4-observability` 概要设计要收敛哪些结构、停在什么设计深度,以及哪些内容当前明确不进入概要设计范围。

本步只回答“本轮 `02` 要讲清什么、不讲什么、讲到什么程度”,不提前进入代码主体框架拆解、主要组成部分定名、对象字段全集、接口表、处理流细节、状态矩阵、配置项清单、测试矩阵或实施 boundary。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `projects/L4-observability/design-calibration/02_hld_step_01_upstream_boundary.md` | 已完成 | 提供上游关系映射表、`本文不再回答` 清单、`本文必须回答` 清单和暂不进入范围线索。 |
| `projects/L4-observability/00-需求文档.md` | 当前正式需求基线 | 提供仓定位、`C-OBS-1~5`、`FR-OBS-001~013`、外围增强挂起口径、非目标和后续待确认项。 |
| `projects/L4-observability/01-架构设计.md` | 当前正式架构基线 | 提供架构目标、不可变约束、架构非目标、上下文 / 运行承载边界、产品中立适配和后续演进阶段口径。 |
| `standards/document/概要设计讨论流程_SOP.md` | 已读取 Step 2 | 约束本步必须输出设计目标表、非范围表和当前阶段设计深度口径。 |
| `standards/document/概要设计书写规范.md` | 已读取 4.2 | 约束正式 §2 只能写结构目标、非范围和交付给详细设计的结果。 |
| `projects/L1-governance/design-calibration/02_hld_step_02_goals_scope.md` | 已读取 | 作为 Step 02 粒度参考,对齐“目标 / 非范围 / 深度口径”三段式结构。 |
| `projects/L1-artifact/design-calibration/02_hld_step_02_goals_scope.md` | 已读取 | 作为 Step 02 粒度参考,对齐“结构目标而非功能愿望池”的收口方式。 |
| 旧 `projects/L4-observability/02-概要设计.md` | 已读取 | 仅作为 historical material,识别旧正文容易回滑到对象 / 产品 / 性能心智的位置。 |
| 旧 `projects/L4-observability/design-calibration/02_hld_step_02_scope.md` | 已读取 | 仅作为 historical material,识别旧 Step 02 与 Step 01 混写对象 / schema / 产品心智的问题。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取 Step 02 标准、L1 对标和当前 Step 01 结果 | done | 本文件 §2 |
| 从新版 `00` 提炼本轮概要设计必须讲清的结构目标 | done | 本文件 §4.1、§8.1 |
| 从新版 `01` 提炼本轮概要设计的深度上限和下游分工 | done | 本文件 §4.2、§8.2、§8.3 |
| 诊断旧 Step 02 和旧正式 `02` 的范围漂移问题 | done | 本文件 §5 |
| 形成设计目标表、非范围表和当前阶段设计深度口径 | done | 本文件 §8 |
| 写出正式 §2 的回填草稿 | done | 本文件 §9 |
| 完成自检并回写 flow / 项目台账 | done | 本文件 §11、§12 |

---

## 4. SOP 问题回答

### 4.1 本次概要设计最主要要把哪些结构说清?

本次概要设计最主要要把以下结构说清:

- 如何把“横切 observation truth、audit projection、body-free evidence linkage、report handoff、retention marker 和 no-write 防线”从需求 / 架构结论转译为可进入详细设计的代码主体骨架。
- 代码主体框架如何承接安全观测材料入口、审计投影与证据关联、安全 log / metric / trace、只读查询 / 诊断 / 交接、留存 / 重建 / 违例防线这些主线。
- 主要组成部分如何划分,每个组成部分承担什么、不承担什么、包含哪些代码主体 / 模块候选,以及它们之间如何协作而不越权接管相邻 truth owner。
- 哪些对象类别足以承接 observation、redaction、correlation、audit projection、evidence linkage、diagnostic、handoff、retention、rebuild 和 violation 语义。
- Command / Query / Event / Job / 外部接缝需要形成怎样的接口骨架,才能让只读边界、body-free 边界、retention 边界和 no-write guard 在后续详细设计中可闭口。
- accepted / rejected / quarantined / degraded / blocked / conflict / replay / not-visible 等关键处理流和状态主语如何在概要层先稳定下来。
- 哪些配置影响只需识别轮廓,哪些边界明确禁止配置化,哪些内容必须留给 `03~07` 继续闭口。

### 4.2 这一轮概要设计应停在什么深度,才算足够支撑进入详细设计?

这一轮概要设计应停在“可实现结构骨架层”,具体包括:

- 可以正式收敛代码主体框架、主要组成部分、关键对象类别、接口分类、关键处理流主线、状态主语和配置影响轮廓。
- 可以点名正式对象名、接口族、处理流名、状态名以及关键字段 / 参数骨架,但不展开字段全集、完整函数签名、完整 DTO / schema、完整状态矩阵或持久化契约。
- 可以明确同步 / 异步 / 后台 / 派生 / 交接等路径各自由哪些结构承接,但不写完整时序脚本、重试算法、事务脚本或外部产品参数。
- 可以明确详细设计、配置设计、测试方案、验收标准和实施计划各自继续展开什么,但不抢写这些下游文档内容。

换言之,本轮 `02` 的完成标准不是“把 Observability 全部设计完”,而是“把进入 `03-详细设计.md` 前必须稳定的结构主语讲清”。

### 4.3 哪些内容属于本次概要设计范围?

当前属于本次概要设计范围的内容包括:

- 与上游文档的关系声明、本次设计目标与范围、约束条件三类前导章节。
- 代码主体框架总览,包括架构边界如何转译为代码主体层、应用层、派生层和接缝层的骨架。
- 主要组成部分、职责与边界,包括 observation intake、audit projection / evidence linkage、safe signal、query / diagnostic / handoff、retention / rebuild / no-write 等结构主语。
- 关键对象轮廓、API / 接口骨架、关键处理流 / 重要函数数据流、状态定义与状态流转。
- 异常与边界场景轮廓、配置影响轮廓、详细设计承接清单、设计风险与待确认事项、参考。
- 外围增强能力在概要设计中的边界归属,即只说明它们如何消费核心观察面或在哪个接缝进入,不把它们升级为核心前置。

### 4.4 哪些内容虽然相关,但当前不进入概要设计范围?

以下内容虽然相关,但当前明确不进入概要设计范围:

- 重新定义需求目标、用户故事、功能需求、业务规则、数据归属、验收标准和 veto 项。
- 重新定义系统上下文、限界上下文、职责边界、依赖方向、数据所有权、一致性策略、技术机制和架构取舍。
- 完整 Rust struct / enum / value object 字段全集和完整函数签名。
- DTO / JSON / Event / handoff schema、DDL、索引、事务、repository / port / adapter 细节。
- 数据库、对象存储、OTel、Prometheus、Grafana、TimescaleDB、搜索、缓存、alert sink、GRC export 产品和性能数字选型。
- 配置 JSON 示例、配置项逐项说明、配置加载实现和变更审计实现。
- 测试用例、验收门禁、真实 evidence、真实 `run_id`、真实 signoff、implementation ledger 和 planned boundary skeleton。
- 旧正文中的术语教学、产品导览、历史技术心智和无来源量化目标。

### 4.5 哪些内容应留给详细设计,而不应在本章提前展开?

以下内容应明确留给详细设计或后续文档:

- Observation / redaction / correlation / audit projection / evidence linkage / handoff / retention / violation 对象的完整字段、类型、不变量和函数签名。
- Command / Query / Event / Job 的完整输入输出 schema、错误语义、幂等和鉴权契约。
- repository、port、adapter、store、projection rebuild、replay、retention scan 和 handoff assembly 的函数级调用链、事务边界和持久化契约。
- 状态机的完整枚举、转移函数、非法转换错误和状态测试切口。
- redaction、digest / canonicalization、authenticity hint、retention days、legal hold、archive eligibility 和 no-write 审计的配置项级契约。
- 真实负载模型、性能 / 容量指标、测试矩阵、验收标准和实施移交边界。

---

## 5. 当前文档问题诊断

| 旧材料 / 当前风险 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `design-calibration/02_hld_step_02_scope.md` | 与旧 Step 01 基本重复,并直接进入 `NormalizedLogRecord`、`MetricPoint`、`AuditEventProjection` 等对象 / schema 心智 | 重新改写为真正的“结构目标 + 非范围 + 深度口径”,不提前进入 Step 4~9 |
| 旧 `projects/L4-observability/02-概要设计.md` 的前半段 | 容易直接从 observability 对象和产品栈开始叙述,缺少“本轮 02 到底收什么、不收什么”的显式分层 | 当前先把正式 §2 所需边界钉住,后续章节才能避免继续串层 |
| 旧 README 和旧产品心智 | 容易把 OTel / Grafana / Prometheus / TimescaleDB / P95 / hash chain 当作概要设计范围的一部分 | 在本步显式列为非范围或后续候选,不进入当前目标表 |
| 需求层的外围增强故事和功能 | 如果不先区分,容易把 dashboard、alert、external audit / GRC、anomaly analysis 写进当前核心结构目标 | 在本步明确它们只作为边界归属和扩展点,不作为核心闭环成立前置 |
| `07-实施计划` 缺失的实现移交资产 | 如果 Step 02 不先排除 implementation ledger / planned boundary skeleton,后续很容易提前补 implementation 资产 | 在本步明确列为非范围,只允许 `07` 完成时重建 |

---

## 6. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 设计目标表达 | 容易被旧材料带成对象 / schema / 产品清单 | 改为“代码主体框架 + 组成部分 + 对象 / 接口 / 流程 / 状态骨架 + 配置 / 承接边界” |
| 范围边界 | 需求、架构、概要、详细设计和实施层容易混写 | 明确哪些属于 `02`,哪些留在 `00/01/03/04/05/06/07` |
| 深度控制 | 容易过早进入字段、函数、schema、产品和性能指标 | 明确停在可实现结构骨架层 |
| 外围增强位置 | 容易和核心闭环混写 | 明确只做边界归属和扩展点说明 |
| 实现移交边界 | 容易被旧 implementation 资产带回当前范围 | 明确 implementation ledger / planned boundary skeleton 只属于 `07` |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 按功能清单定义 Step 02 范围 | 看起来贴近 `FR-OBS-*` | 会回滑成需求文档续写,不是概要设计范围定义 | 不采用 |
| 方案 B: 按对象名 / schema 候选定义 Step 02 范围 | 显得具体 | 会跳过代码主体框架和主要组成部分层,过早进入 Step 06 / Step 07 | 不采用 |
| 方案 C: 以“结构目标 + 非范围 + 深度口径”定义 Step 02 | 能稳定承接 `00/01`,也能给 `03` 清楚输入 | 需要后续 Step 继续逐层展开 | 采用 |
| 方案 D: 把产品选型、性能数字和 implementation 资产一并纳入 02 | 细节看起来完整 | 会越权覆盖 `03~07` 的职责 | 不采用 |

---

## 8. 结构化中间产物

### 8.1 设计目标表

| 目标 | 说明 | 交付给详细设计的结果 |
|---|---|---|
| 收稳代码主体框架主线 | 必须先把 observation truth、audit projection、safe signal、query / handoff、retention / no-write 从架构结论转成可实现结构主线 | `03` 可继续按代码主体 / service / port / adapter / store / projection 边界展开 |
| 收稳主要组成部分与职责边界 | 必须说明 intake、audit projection / evidence linkage、signal projection、query / diagnostic / handoff、retention / rebuild / violation 等由哪些主要部分承接 | `03` 可按组成部分逐个展开对象、接口、状态和持久化契约 |
| 建立关键对象候选池并准备正式化 | 必须先说明后续哪些对象类别会承接 observation、redaction、correlation、audit、evidence、handoff、retention 和 violation 语义 | `03` 可为每个对象补完整 struct / enum / value object 契约 |
| 收稳接口骨架分类 | 必须先稳定 Command / Query / Event / Job / 外部接缝这几类正式入口,避免后续接口主语漂移 | `03` 可逐接口族补完整签名、DTO、错误和幂等语义 |
| 收稳关键处理流骨架 | 必须说明 accepted / rejected / quarantined、audit projection append、signal projection、diagnostic read、handoff assembly、retention / rebuild / replay 等主流向 | `03` 可逐处理流展开函数调用链、事务边界和错误分支 |
| 收稳状态主语与流转方向 | 必须先稳定 receipt、visibility、projection freshness、handoff、retention、rebuild、violation 等状态主语 | `03` 可展开完整状态矩阵、转移函数和非法转换错误 |
| 收稳配置影响与禁止配置化边界 | 必须明确哪些部分可能受 redaction、retention、sampling、adapter 和 cadence 影响,哪些边界不能被配置改写 | `03` 和 `04` 可继续定义配置结构、默认值、加载位置和校验规则 |
| 收稳详细设计承接边界 | 必须明确当前 `02` 结束后,`03~07` 分别还要补什么,避免实现侧自行补设计真相 | `03~07` 可按承接清单继续推进,不再向上回补本轮范围 |

### 8.2 非范围表

| 非范围 | 留给哪一层 |
|---|---|
| 需求目标、用户故事、功能需求、数据归属、验收标准和 veto 项重述 | `00-需求文档.md` |
| 系统上下文、限界上下文、职责边界、依赖方向、数据所有权、一致性策略、技术机制和架构取舍重述 | `01-架构设计.md` |
| 完整对象字段全集、完整类型定义和完整函数签名 | `03-详细设计.md` |
| 完整 DTO / JSON / Event / handoff schema、DDL、索引、事务和持久化模型 | `03-详细设计.md` |
| 配置 JSON、配置项逐项说明、配置加载实现和配置变更治理细节 | `04-配置设计.md` / `03-详细设计.md` |
| 测试矩阵、测试用例、验收门禁、真实 evidence、真实 `run_id`、真实 signoff | `05-测试方案.md` / `06-验收标准.md` |
| implementation ledger、planned boundary skeleton、实施 boundary 和 commit 切分 | `07-实施计划.md` |
| OTel、Prometheus、Grafana、TimescaleDB、对象存储、alert sink、GRC export 产品和性能数字的正式锁定 | `03~07` 对应技术 / 配置 / 测试 / 实施文档 |
| 旧 README、旧正式 `02`、旧 `02_hld_step_02~14` 中的术语教学、历史产品心智和旧实现边界 | historical material,不进入当前正式链路 |

### 8.3 当前阶段设计深度口径

- 本轮 `02` 必须足够支撑后续详细设计判断“该拆哪些主要部分、对象、接口、流程和状态”,而不是只留下概念解释。
- 本轮 `02` 允许点名正式主要组成部分、对象类别、接口族、处理流名、状态主语和关键字段 / 参数骨架,但这些都服务于结构轮廓,不是最终实现契约。
- 本轮 `02` 不负责把对象写成完整 Rust 类型、把接口写成完整 schema、把流程写成完整时序、把状态写成完整矩阵、把配置写成可运行清单。
- 本轮 `02` 对外围增强能力只做到“边界归属与结构接入点”级别,不让 dashboard、alert、外部产品、长期分析和 GRC 导出抢占核心主线。
- 本轮 `02` 必须明确哪些内容继续交给 `03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md` 和 `07-实施计划.md`,避免后续 agent 通过实现补文档真相。

### 8.4 本步 blocker 判断

| blocker | 判断 |
|---|---|
| Step 01 是否已足以支撑 Step 02 | 足以支撑,无 blocker |
| `00-需求文档.md` 和 `01-架构设计.md` 是否已给出足够的结构目标线索 | 足以支撑,无 blocker |
| 是否存在必须在 Step 02 立即锁定的对象名、接口名、产品名或性能数字 | 不存在 |
| 旧 `02_hld_step_02_scope.md` 是否阻塞当前 Step 02 | 不阻塞,但必须整体降级为 historical material |

---

## 9. 回填草稿

以下内容供 Step 14 重建正式 `02-概要设计.md` 时回填。正式正文只摘录已确认结论,不重复问题回答、旧材料诊断或取舍过程。

```md
## 2. 本次设计目标与范围

> 校准来源:
> - `design-calibration/02_hld_step_02_scope.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/02_hld_step_02_scope.md` 的“结构化中间产物”“回填草稿”和“待确认事项”小节。

| 目标 | 说明 | 交付给详细设计的结果 |
|---|---|---|
| 收稳代码主体框架主线 | 把 observation truth、audit projection、safe signal、query / handoff、retention / no-write 从架构结论转成可实现结构主线 | `03` 可继续按代码主体 / service / port / adapter / store / projection 边界展开 |
| 收稳主要组成部分与职责边界 | 明确各结构主语分别承接什么、不承接什么 | `03` 可按组成部分逐个展开对象、接口、状态和持久化契约 |
| 收稳关键对象、接口、流程和状态骨架 | 为后续对象建模、接口契约、流程细化和状态机细化提供正式主语 | `03` 可继续展开完整对象 / 接口 / 流程 / 状态契约 |

| 非范围 | 留给哪一层 |
|---|---|
| 完整对象字段、完整接口 schema、完整函数签名、DDL、配置清单、测试矩阵、验收门禁和实施 boundary | `03~07` 对应文档 |
| 外部产品和性能数字的正式锁定 | `03~07` 对应技术 / 配置 / 测试 / 实施文档 |

当前阶段设计深度口径：
- 本轮 `02` 停在可实现结构骨架层
- 允许点名主要组成部分、对象类别、接口族、处理流名和状态主语
- 不提前写完整实现契约、产品选型、测试证据或实施移交资产
```

---

## 10. 待确认事项

| 编号 | 待确认事项 | 当前处理口径 |
|---|---|---|
| `Q-HLD-STEP02-001` | 正式 §2 的目标表是否按五条核心闭环拆分,还是按代码结构拆分 | 当前采用代码结构主语拆分,因为 Step 2 必须服务后续 Step 4~9 的结构展开 |
| `Q-HLD-STEP02-002` | 外围增强能力是否需要在正式 §2 逐项列出 | 当前只保留“只做边界归属和扩展点”口径,不逐项铺开以免稀释核心主线 |
| `Q-HLD-STEP02-003` | implementation ledger / planned boundary skeleton 是否需要在 §2 提前提醒 | 当前作为非范围明确后移到 `07`,不在正式 §2 展开流程细节 |

---

## 11. 自检

| 检查项 | 结果 |
|---|---|
| 是否输出了设计目标表和非范围表 | pass |
| 是否明确了当前阶段设计深度口径 | pass |
| 是否把目标写成结构目标而不是功能清单 | pass |
| 是否把非范围明确指向具体文档层次 | pass |
| 是否未提前展开代码主体细节、对象字段全集、接口 schema、处理流细节和状态矩阵 | pass |
| 是否未触碰正式 `02-概要设计.md` | pass |
| 是否发现阻塞 Step 03 的上游 blocker | no |

---

## 12. 门禁

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| pass | 已按概要 SOP Step 2、概要书写规范 4.2、新版 `00`、新版 `01` 和 L1 参考粒度重建 Step 02;正式 `02-概要设计.md` 未被提前装配;旧 Step 02 已降级为 historical material | wait_user_confirmation_before_step_03 |
