# L4-observability 02-概要设计 Step 01 · 确认上游输入边界

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 1
> 回填章节: `02-概要设计.md` §1 与上游文档的关系声明
> 生成日期: 2026-07-08
> 状态: 已完成,等待用户确认后进入 Step 02

---

## 1. 本步目标

确认当前概要设计依赖的需求结论和架构结论已经收敛到足以支撑“代码主体框架、主要组成部分、关键对象、接口骨架、关键处理流、状态定义、配置影响轮廓和详细设计承接清单”展开的程度,并明确哪些上游边界会直接限制 `02-概要设计.md` 的组织深度。

本步只确认概要设计可承接什么、不再回答什么、必须继续回答什么,不提前定义代码主体、对象字段、接口表、状态机、配置项、协议 schema、DDL、产品选型或实现 boundary。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `projects/L4-observability/design-calibration/project_execution_ledger.md` | 已读取 | 确认 `01-架构设计.md` 已完成,当前进入 `02-概要设计` Step 01。 |
| `projects/L4-observability/design-calibration/01_architecture_calibration_flow.md` | 已读取 | 确认 `01` 当前停在正式装配完成状态,可作为 `02` 直接上游。 |
| `standards/document/概要设计讨论流程_SOP.md` | 已读取 Step 1 和通用执行纪律 | 约束本步只做上游输入边界确认,不得提前进入 Step 2~14。 |
| `standards/document/概要设计书写规范.md` | 已读取 4.1 章节 | 约束正式第 1 章必须输出上游关系映射表、`本文不再回答` 清单和 `本文必须回答` 清单。 |
| `projects/L4-observability/00-需求文档.md` | 当前正式需求基线 | 提炼仓定位、核心能力闭环、规则边界、数据归属、依赖裁剪、非功能和验收否决项中对概要设计有约束力的结论。 |
| `projects/L4-observability/01-架构设计.md` | 当前正式架构基线 | 提炼职责边界、系统上下文、限界上下文、依赖方向、数据所有权、一致性、技术机制和演进边界中对概要设计有约束力的结论。 |
| `projects/L4-observability/design-calibration/00_req_step_*.md` | 已完成 | 作为 `00` 需求结论的追溯来源,不在本步重复讨论过程。 |
| `projects/L4-observability/design-calibration/01_arch_step_*.md` | 已完成 | 作为 `01` 架构结论的追溯来源,不在本步重新发明系统边界或技术判断。 |
| `projects/L1-governance/design-calibration/02_hld_step_01_upstream_boundary.md` | 已读取 | 作为 Step 01 粒度参考,对齐“问题回答 + 诊断 + 结构化产物 + 门禁”的完整度。 |
| `projects/L1-artifact/design-calibration/02_hld_step_01_upstream_boundary.md` | 已读取 | 作为 Step 01 粒度参考,对齐“只收口上游关系,不提前进入对象 / 接口 / flow”的边界。 |
| 旧 `projects/L4-observability/README.md` | 已读取 | 仅作为 historical material,识别旧产品栈、旧性能数字和旧目录结构的污染风险。 |
| 旧 `projects/L4-observability/02-概要设计.md` | 已读取 | 仅作为 historical material,识别旧正式文档中的章节漂移和提前实现化问题。 |
| 旧 `projects/L4-observability/design-calibration/02_hld_calibration_flow.md` 与旧 `02_hld_step_01~14` | 已读取 | 识别旧自动顺推状态和越 Step 内容,本轮不继承其 pass 结论。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、`01` flow、`02` 标准和 L1 参考粒度 | done | 本文件 §2 |
| 从新版 `00` 提炼对概要设计有约束力的需求结论 | done | 本文件 §4.1、§8.1 |
| 从新版 `01` 提炼对概要设计有约束力的架构结论 | done | 本文件 §4.2、§8.1 |
| 诊断旧 `02` 正式文档、旧 `02_hld` flow 和旧 Step 产物 | done | 本文件 §5 |
| 选择 full-restart Step 01 重建而非沿用旧 `02` 结构 | done | 本文件 §7 |
| 形成上游关系映射表、`本文不再回答` 清单和 `本文必须回答` 清单 | done | 本文件 §8 |
| 写出供 Step 14 使用的正式回填草稿 | done | 本文件 §9 |
| 完成自检并回写 flow / 项目台账 | done | 本文件 §11、§12 |

---

## 4. SOP 问题回答

### 4.1 当前概要设计要承接哪些需求结论?

当前概要设计要承接以下需求结论:

- `L4-observability` 是横切 observation truth、audit projection、body-free evidence linkage、report handoff、retention marker 和 no-write 防线基础,不是业务 truth、治理 truth、Artifact / evidence 正文、Identity truth、runtime / sandbox execution truth、archive package truth、console UI truth 或外部产品配置 truth。
- 核心能力闭环已经收稳为 `C-OBS-1~5`:安全观测材料入口、审计投影与证据关联、运行观察面安全表达、只读诊断与报告交接、留存与不反写真相边界。
- `FR-OBS-001~013` 已明确要求后续概要设计必须继续承接安全准入、来源 / 关联语境、redaction、audit projection、body-free evidence linkage、安全 log / metric / trace、只读 query / diagnostic、report handoff、authenticity hint、retention marker、active reference protection、rebuild / replay 和 no-write guard。
- 需求层已经固定 forbidden body、证据正文禁止入仓、只读交接不伪造真实证据、query / diagnostic / rebuild / report assembly 不反写 source truth、retention 不得误清活动引用材料等硬边界。
- `L0-core` 唯一编译期依赖、`L0-bus` 事件协作、相邻 truth owner 通过运行期 / ref / summary / handoff 协作的依赖裁剪口径已经收稳。
- 外围增强如 dashboard、alert、management report、external audit / GRC export、anomaly analysis 和产品绑定候选不阻塞核心闭环,但也不能反向定义本仓核心结构。
- 旧 README、旧正式 `02`、旧 `02_hld` Step、旧产品栈、旧 P95 / 冷存 / hash chain / 事件数量和旧 implementation boundary 仍然只是 historical material,不得直接恢复为概要设计输入。

### 4.2 当前概要设计要承接哪些架构结论?

当前概要设计要承接以下架构结论:

- 架构已经确认 `L4-observability` 的主线是独立 observation truth,并以安全准入、关联语境、安全 signal、audit projection、body-free evidence linkage、report handoff、retention / replay 和 no-write guard 组织系统结构。
- 职责边界已经明确“做 / 不做 / 易混淆职责”:本仓只拥有观测面内部事实、审计投影、交接事实、留存事实和违例记录,不拥有外部业务 truth、本体正文或控制命令。
- 系统上下文和限界上下文已经把 `L0-core`、`L0-bus`、`L1-governance`、`L1-artifact`、`L1-identity`、`L2-runtime`、`L4-sandbox`、`L4-archive`、`L0-sdk` 和报告 / 外部审计消费方的协作边界收稳为 safe ref、summary、signal、handoff 和 gap 协作,不发生 truth ownership 转移。
- 数据所有权已经区分 observation truth、derived projection、reference、snapshot / summary 和 forbidden body,并明确 audit projection 只读、evidence linkage body-free、rebuild 只作用于观察面与派生投影。
- 一致性与交互方式已经收稳为核心强一致 + 外围最终一致,同步准入 / 只读查询 / 状态判断与异步材料消费、后台重建 / 留存 / 交接任务分离。
- 架构阶段已经固定 `L0-core` 为唯一编译期依赖,`L0-bus` 为事件协作边界,外部产品只作为运行期 adapter / 配置候选,不得成为 truth source 或核心前置。
- 架构风险与待确认事项已经明确:对象名、字段、状态集、接口协议、redaction 策略、correlation carrier、digest / canonicalization、retention 细则、外部产品选型和 implementation boundary 均后移到 `02~07` 继续闭口。

### 4.3 哪些结论已经足够稳定,可以直接作为概要设计输入?

以下结论已经足够稳定,可以直接作为概要设计输入:

- 仓定位、职责边界、非目标和易混淆边界。
- `C-OBS-1~5` 核心闭环及其对应的结构方向。
- observation truth / derived projection / reference / forbidden body 的数据边界。
- audit projection 只读、body-free evidence linkage、report handoff 不伪造真实证据、retention marker / active reference protection / no-write guard 成立的红线。
- `L0-core` 唯一编译期依赖、`L0-bus` 事件协作和相邻 truth owner 只通过 safe ref / summary / signal / handoff 协作的依赖方向。
- 核心强一致 + 外围最终一致,同步 / 异步 / 后台分离的交互口径。
- 外部产品、旧性能指标、旧存储 / 目录 / hash chain / 冷存设想不作为当前概要设计硬结论。

### 4.4 哪些结论虽然相关,但仍未收稳,因此当前不能直接往下展开?

以下结论仍未收稳,当前不能作为已定概要设计输入直接展开:

- 正式代码主体框架的 crate / module / layer 组织方式。
- 主要组成部分的正式命名、职责粒度和跨部分边界。
- 关键对象清单、对象类型、字段骨架、成员函数骨架和工厂函数骨架。
- Command / Query / Event / Job 的正式名称、参数骨架、返回骨架和错误表面。
- 关键处理流 / 重要函数数据流的正式入口、service、port、projection 和交接顺序。
- 各主语的状态集合、状态含义、状态迁移和非法转换规则。
- redaction、correlation、digest / canonicalization、gap handling 和真实性提示的具体算法或 carrier。
- retention days、legal hold、archive eligibility、cleanup / replay / rebuild 的详细规则和配置承载。
- 外部 APM / OTel / Prometheus / Grafana / TimescaleDB / 对象存储 / GRC / alert sink 是否进入正式技术承载。
- 任何真实 `run_id`、真实 evidence alias、真实 signoff、真实测试结果、实施 commit 或 implementation boundary skeleton。

### 4.5 哪些边界、非目标和约束会直接决定概要设计当前不该展开到哪里?

以下边界直接决定概要设计当前不该越界:

- 不重新定义需求目标、用户故事、功能需求、数据归属、验收标准和一票否决项。
- 不重新定义系统上下文、限界上下文、职责边界、依赖方向、数据所有权原则、技术机制和 ADR / 需求追溯判断。
- 不在本章提前展开代码主体框架总览、主要组成部分、对象字段、接口表、处理流、状态机、配置项清单、DDL、产品选型或实现目录。
- 不让 observation / audit / signal / diagnostic / handoff / retention 任何输出面冒充 source business truth、Governance truth、Artifact truth、Identity truth、runtime execution truth 或 archive truth。
- 不让 forbidden body、evidence body、artifact body、identity body、governance decision body、source audit truth 正文或真实验收材料进入概要设计输入。
- 不把 query、diagnostic、report handoff、rebuild、replay、maintenance、dashboard、alert、external export 写成控制面、修复面或写源路径。

---

## 5. 当前文档问题诊断

| 输入 / 旧材料 | 当前表现 | 问题 | 本轮处理 |
|---|---|---|---|
| 旧 `design-calibration/02_hld_calibration_flow.md` | 全 Step 标记为 `done/pass`,`next_allowed_action=assemble_or_next_document` | 与用户要求“一次一个 Step,确认后再进下一 Step”直接冲突,且把整份 `02` 伪装成已完成 | 整体降级为 historical material,当前 flow 只承认 Step 01 已完成 |
| 旧 `design-calibration/02_hld_step_01_upstream_boundary.md` | Step 01 直接写入 `NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection` 等对象级内容 | 明显越过 Step 01 边界,把 Step 06 / Step 07 内容提前塞入上游关系声明 | 重新按 SOP Step 1 改写,只保留上游映射、`不再回答` 和 `必须回答` |
| 旧 `design-calibration/02_hld_step_02_scope.md` ~ `02_hld_step_14_formal_document_assembly.md` | 结构与 Step 01 高度重复,内容近乎模板复制,且均带自动跨步门禁 | 不能作为当前 `02` 的真实推进记录 | 统一记为 `historical_material_pending_rebuild`,后续逐 Step 重建 |
| 旧 `projects/L4-observability/02-概要设计.md` | 已经写成整份正式概要设计,但其来源链依赖旧自动流和越 Step 产物 | 当前正式文档缺乏可信的逐 Step 校准来源 | 本轮不触碰正式 `02`,先只重建 Step 01 中间产物 |
| 旧 `README.md` | 混合 OTel、Grafana、TimescaleDB、对象存储、P95、hash chain、目录结构等实现 / 产品心智 | 容易把历史产品栈和量化指标误抬升为概要设计输入 | 只保留“横切观测、审计、trace / metrics、retention、report handoff”的方向线索 |

---

## 6. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| Step 01 主语 | 上游关系、对象名、schema 候选和 no-write guard 混写 | 只收口上游输入边界,不提前进入对象 / 接口 / flow / state |
| 上游承接 | 旧 flow、旧正式 `02` 和旧技术心智隐式并入 | 直接承接新版 `00`、新版 `01` 和对应 calibration 追溯链 |
| 历史材料处理 | 旧 `02_hld` 全套文件表面上仍是 pass | 旧 `02_hld` flow 和旧 Step 02~14 显式降级为 historical material |
| 下一动作 | `next_step_or_formal_assembly` | `wait_user_confirmation_before_step_02` |
| 正式文档关系 | 旧正式 `02` 看起来像当前 truth | 正式 `02` 暂不改写,必须等 Step 02~14 逐步重建后再装配 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧 `02_hld` flow 和旧 Step 01,只修几处措辞 | 改动小 | 旧自动顺推状态、越 Step 内容和伪完成感会继续污染当前链路 | 不采用 |
| 方案 B: 从新版 `00` 和 `01` 重新执行 `02` Step 01,只重建本步中间产物和门禁 | 符合 SOP,能把 `02` 恢复到真实可审查状态 | 需要后续每个 Step 单独重建 | 采用 |
| 方案 C: 在 Step 01 直接固定代码主体框架、对象名和接口骨架 | 看起来更快进入落码粒度 | 跳过 Step 2~9,会把未确认结构伪装成已定结论 | 不采用 |
| 方案 D: 把旧正式 `02-概要设计.md` 当作当前概要基线,Step 01 只补来源表 | 能快速进入正式文档维护 | 正式文档会继续依赖无效的旧 Step 链 | 不采用 |

---

## 8. 结构化中间产物

### 8.1 上游关系映射表

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `projects/L4-observability/00-需求文档.md` | 仓定位、`C-OBS-1~5`、`FR-OBS-001~013`、forbidden body、body-free evidence linkage、report handoff、retention marker、active reference protection 和 no-write 边界 | 在已收稳需求边界下展开代码主体框架、主要组成部分、关键对象、接口骨架、处理流、状态、配置影响和详细设计承接 |
| `projects/L4-observability/01-架构设计.md` | 观测主线架构、职责边界、上下文划分、依赖裁剪、数据所有权、一致性分层、产品中立适配和演进边界 | 把架构边界转译为可实现结构骨架,不重写系统上下文、限界上下文、技术判断或 ADR |
| `projects/L4-observability/design-calibration/00_req_step_*.md` | 需求结论如何从讨论收敛为正式 `00` | 为正式 `02` 提供需求追溯入口,不在概要正文重复讨论过程 |
| `projects/L4-observability/design-calibration/01_arch_step_*.md` | 架构结论如何从讨论收敛为正式 `01` | 为正式 `02` 提供架构追溯入口,不在概要正文重复架构推导过程 |
| `projects/L0-core/00-需求文档.md` ~ `07-实施计划.md` | 通过 `00/01` 已收稳的 shared ID、safe ref、correlation、metadata、error 和安全 marker 语境 | 后续对象 / 接口 / flow 只引用共享契约,不重新定义 |
| `projects/L0-bus/00-需求文档.md` ~ `07-实施计划.md` | 通过 `00/01` 已收稳的事件协作、tap / audit material、replay 和协作边界 | 后续接口和处理流只承接 bus 协作边界,不接管 bus 主干 truth |
| `projects/L1-governance/00-需求文档.md` ~ `07-实施计划.md` | 通过 `00/01` 已收稳的治理 truth、审计语境和 handoff 边界 | 后续审计投影和交接结构只承接 safe ref / summary / gap,不接管治理结论 |
| `projects/L1-artifact/00-需求文档.md` ~ `07-实施计划.md` | 通过 `00/01` 已收稳的 Artifact / evidence ownership 和 body-free evidence linkage 边界 | 后续证据关联和 report handoff 只承接引用、摘要、digest 和缺口语境 |
| `projects/L1-identity/00-需求文档.md` ~ `07-实施计划.md` | 通过 `00/01` 已收稳的 actor / subject safe ref 和 identity truth 边界 | 后续对象和接口只承接身份引用,不接管 identity lifecycle |
| `projects/L2-runtime/00-需求文档.md` ~ `07-实施计划.md`、`projects/L4-sandbox/00-需求文档.md` ~ `07-实施计划.md` | 通过 `00/01` 已收稳的 runtime / sandbox signal 来源和非 execution truth 边界 | 后续 signal、diagnostic 和降级表达只承接安全观察面 |
| `projects/L4-archive/00-需求文档.md` ~ `07-实施计划.md` | 通过 `00/01` 已收稳的 retention / archive handoff 边界 | 后续 retention marker 和 archive eligibility 只作为只读留存 / 交接边界展开 |
| 旧 `projects/L4-observability/README.md`、旧 `projects/L4-observability/02-概要设计.md`、旧 `projects/L4-observability/design-calibration/02_hld_*` | 旧使命线索、旧产品栈、旧目录、旧性能指标、旧对象名和旧自动顺推结果 | 仅作为 historical material 和问题诊断输入,不作为正式概要设计 truth source |

### 8.2 本文不再回答

- 不再回答 `L4-observability` 是否拥有业务 truth、治理 truth、Artifact / evidence 正文、Identity truth、runtime / sandbox execution truth、archive package truth 或 console UI truth。
- 不再回答需求目标、用户故事、功能需求、业务规则、数据归属、验收标准和 veto 项。
- 不再回答系统上下文、限界上下文、职责边界、依赖方向、数据所有权、一致性策略、技术机制和架构演进判断。
- 不再回答外部产品、旧性能指标、旧冷存期限、旧 hash chain 分片、旧目录结构和旧 implementation boundary 是否应直接进入当前基线。
- 不再回答真实 `run_id`、真实 evidence alias、真实 signoff、真实测试结果、implementation ledger 或 planned boundary skeleton。

### 8.3 本文必须回答

- 如何把安全观测材料入口、审计投影与 body-free 证据关联、安全 log / metric / trace、只读诊断 / report handoff、retention / no-write 约束转译成代码主体框架和主要组成部分。
- 哪些关键对象类别能够承接 observation、redaction、correlation、audit projection、evidence linkage、diagnostic、handoff、retention、rebuild 和 violation 语义。
- 哪些 Command / Query / Event / Job / adapter boundary 需要在概要设计层给出正式骨架。
- 哪些关键处理流和状态流转需要被收稳,以保证 accepted / rejected / quarantined / degraded / blocked / conflict / replay 等语义可落到详细设计。
- 哪些配置影响只能识别轮廓、哪些边界明确禁止配置化、哪些内容必须留给 `03~07` 继续闭口。

### 8.4 暂不进入范围

| 暂不进入范围 | 原因 | 后续落点 |
|---|---|---|
| 代码目录、文件路径、crate 名、trait 名和完整 module 树 | 属于概要 Step 4 以后和详细设计的可实现结构收口 | `02` Step 4~12 / `03-详细设计.md` |
| 完整对象字段、完整函数签名、DDL、索引、协议 schema、事件 payload | 属于详细设计契约 | `03-详细设计.md` |
| redaction、digest、correlation carrier、retention days、legal hold 的具体配置项 | 属于配置和验收闭口 | `04-配置设计.md` / `06-验收标准.md` |
| 外部产品选型、产品参数、部署拓扑和性能指标 | 属于技术选型、配置、测试和实施闭口 | `03~07` |
| implementation ledger、planned boundary skeleton、真实 evidence / run / signoff | 只有正式完成 `07-实施计划.md` 才能创建,且不能伪造真实执行材料 | `07-实施计划.md` |

### 8.5 blocker 判断

| blocker | 判断 |
|---|---|
| `00-需求文档.md` 是否足以支撑 `02` Step 01 | 足以支撑,无 blocker |
| `01-架构设计.md` 是否足以支撑 `02` Step 01 | 足以支撑,无 blocker |
| 旧 `02` 正式文档和旧 `02_hld` 是否会阻塞当前 Step 01 | 不阻塞,但必须整体降级为 historical material |
| 是否存在必须在 Step 01 立即决定的对象名、接口名、产品名或配置名 | 不存在 |

---

## 9. 回填草稿

以下内容供 Step 14 重建正式 `02-概要设计.md` 时回填。正式正文只摘录已确认结论,不重复问题回答、旧材料诊断或取舍过程。

```md
## 1. 与上游文档的关系声明

> 校准来源:
> - `design-calibration/02_hld_step_01_upstream_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/02_hld_step_01_upstream_boundary.md` 的“结构化中间产物”“回填草稿”和“待确认事项”小节。

本文承接 `projects/L4-observability/00-需求文档.md` 已收稳的仓定位、核心能力闭环、规则边界、数据归属和验收红线,并承接 `projects/L4-observability/01-架构设计.md` 已收稳的职责边界、上下文划分、依赖裁剪、数据所有权、一致性和产品中立适配边界。本文不重新定义需求目标、系统上下文、限界上下文、技术判断或 ADR,只把这些结论继续转译为代码主体框架、主要组成部分、关键对象、接口骨架、处理流、状态和配置影响轮廓。

本文不再回答：
- 需求目标、用户故事、业务规则、数据归属和验收标准
- 系统上下文、职责边界、依赖方向、数据所有权和技术机制
- 外部产品、旧性能指标、旧实现边界和真实测试证据

本文必须回答：
- 如何把 observation / audit / signal / diagnostic / handoff / retention / no-write 边界转译为可实现结构骨架
- 哪些关键对象、接口骨架、处理流和状态流转足以支撑进入详细设计
```

---

## 10. 待确认事项

| 编号 | 待确认事项 | 当前处理口径 |
|---|---|---|
| `Q-HLD-STEP01-001` | 正式第 1 章是否逐条列出 `L0-core` / `L0-bus` / `L1-*` / `L4-*` 上游,还是只通过 `00/01` 统一承接 | 当前在中间产物中保留直接映射;正式装配时按章节可读性决定保留层级,但不得丢失追溯入口 |
| `Q-HLD-STEP01-002` | `01` 中的核心子域命名是否直接等同于 `02` 的主要组成部分命名 | 当前不提前定稿,留到 Step 4 / Step 5 依据代码主体框架和主要组成部分收口 |
| `Q-HLD-STEP01-003` | 旧 `02_hld_step_02~14` 是否需要在当前就删除 | 当前不做删除操作,统一降级为 `historical_material_pending_rebuild`,后续逐 Step 替换 |

---

## 11. 自检

| 检查项 | 结果 |
|---|---|
| 是否使用了上游关系映射表 | pass |
| 是否输出了 `本文不再回答` 和 `本文必须回答` 清单 | pass |
| 是否未在本章画图 | pass |
| 是否未提前展开代码主体、对象字段、接口表、处理流和状态机 | pass |
| 是否把旧 `02_hld` flow 和旧 Step 02~14 显式降级为 historical material | pass |
| 是否未修改正式 `02-概要设计.md` | pass |
| 是否发现阻塞 Step 02 的上游 blocker | no |

---

## 12. 门禁

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| pass | 已按新版 `00`、新版 `01`、概要 SOP Step 1、概要书写规范 4.1 和 L1 参考粒度重建 Step 01;正式 `02-概要设计.md` 未被提前装配;旧自动顺推产物已降级为 historical material | wait_user_confirmation_before_step_02 |
