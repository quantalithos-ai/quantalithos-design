# L4-observability 02-概要设计 Step 14 · 整理正式概要设计文档

> 回填章节: `projects/L4-observability/02-概要设计.md` 全文
> 当前模式: full-restart
> 当前 Step: Step 14 `整理正式概要设计文档`
> 当前门禁: 用户已确认进入 Step 14;本步只装配正式 `02-概要设计.md`,不得自动跨到 `03-详细设计.md`

## 1. 本步目标

把 Step 01 ~ Step 13 已确认的概要设计结论按 `概要设计书写规范.md` 的正式章节主链重组为 `02-概要设计.md`。

本步只做重组、润色、术语统一、编号统一和交叉引用补齐。不新增未经 Step 01 ~ Step 13 讨论确认的新结论,不把详细设计、配置设计、测试、验收或实施计划内容补进概要设计。

## 2. 本步输入

| 输入 | 状态 | 本步用途 |
|---|---|---|
| `standards/document/概要设计讨论流程_SOP.md` Step 14 | 已读取 | 约束正式装配只能重组既有结论,不得新增分析结论。 |
| `standards/document/概要设计书写规范.md` | 已读取 | 约束 14 个正式章节、每章校准来源块和正式章节输出形态。 |
| `projects/L4-observability/design-calibration/project_execution_ledger.md` | 已读取 | 确认当前恢复点为 `02` Step 13 complete,用户已确认进入 Step 14。 |
| `projects/L4-observability/design-calibration/02_hld_calibration_flow.md` | 已读取 | 确认 Step 01 ~ Step 13 当前产物均 pass,Step 14 原先等待用户确认。 |
| `projects/L4-observability/design-calibration/02_hld_step_01_upstream_boundary.md` | 已读取 | 提供上游关系声明。 |
| `projects/L4-observability/design-calibration/02_hld_step_02_scope.md` | 已读取 | 提供设计目标、范围和非范围。 |
| `projects/L4-observability/design-calibration/02_hld_step_03_constraints.md` | 已读取 | 提供 truth ownership、redaction-first、body-free、no-write、依赖裁剪等硬约束。 |
| `projects/L4-observability/design-calibration/02_hld_step_04_code_subject_framework.md` | 已读取 | 提供代码主体框架、业务组成部分与实现分层关系。 |
| `projects/L4-observability/design-calibration/02_hld_step_05_components_boundary.md` | 已读取 | 提供 10 个主要组成部分、对象候选池、接缝和跨组成部分审计。 |
| `projects/L4-observability/design-calibration/02_hld_step_06_key_objects.md` 及 6 个对象附录 | 已读取 | 提供对象正式化筛选、对象分布和代表对象字段 / 函数骨架。 |
| `projects/L4-observability/design-calibration/02_hld_step_07_api_interface_skeleton.md` | 已读取 | 提供 Command / Query / Consumer / Outbound Event / Job 接口骨架。 |
| `projects/L4-observability/design-calibration/02_hld_step_08_processing_flows.md` | 已读取 | 提供通用路径、10 个处理流族和跨流审计。 |
| `projects/L4-observability/design-calibration/02_hld_step_09_state_machine.md` | 已读取 | 提供状态族、状态定义、允许 / 禁止迁移和传播关系。 |
| `projects/L4-observability/design-calibration/02_hld_step_10_exceptions_boundaries.md` | 已读取 | 提供异常场景、处理流族异常口径和异常影响图。 |
| `projects/L4-observability/design-calibration/02_hld_step_11_configuration_impact.md` | 已读取 | 提供配置影响、禁止配置化边界和配置实现契约方向。 |
| `projects/L4-observability/design-calibration/02_hld_step_12_detailed_design_handoff.md` | 已读取 | 提供详细设计承接清单、继续展开方向和回退规则。 |
| `projects/L4-observability/design-calibration/02_hld_step_13_risks_open_questions.md` | 已读取 | 提供设计风险、待确认事项和不阻塞 Step 14 的判断。 |
| `projects/L1-governance/02-概要设计.md`、`projects/L1-artifact/02-概要设计.md` | 已读取 | 作为正式文档粒度参考,不复制业务 truth。 |
| 旧 `projects/L4-observability/02-概要设计.md` 和旧 Step 14 | 已读取 | 仅作 historical material,用于诊断旧正文过短、schema 化和旧门禁问题。 |

## 3. Step 内计划

| 计划项 | 状态 | 本步产出 |
|---|---|---|
| 读取 Step 14 标准、书写规范、flow、台账和 Step 01 ~ Step 13 | done | 本文件 §2 |
| 诊断旧 Step 14 和旧正式 `02-概要设计.md` | done | 本文件 §5 |
| 回答 Step 14 SOP 问题 | done | 本文件 §4 |
| 建立正式章节重组表 | done | 本文件 §6 |
| 建立章节回填映射、术语统一和交叉引用规则 | done | 本文件 §7 ~ §9 |
| 替换正式 `02-概要设计.md` | done | `../02-概要设计.md` |
| 更新 `02_hld_calibration_flow.md` 与项目执行台账 | done | flow / ledger |
| 自检和门禁 | done | 本文件 §13 ~ §14 |

## 4. SOP 问题回答

### 4.1 哪些已确认结论应分别回填到哪些正式章节?

Step 01 ~ Step 13 与正式 14 章基本一一对应,但不是机械复制关系。Step 04 ~ Step 11 的结构性结论会被多处交叉引用:

| 正式章节 | 主要来源 | 装配原则 |
|---|---|---|
| §1 与上游文档的关系声明 | Step 01 | 只写承接关系、不重写需求 / 架构。 |
| §2 本次设计目标与范围 | Step 02 | 保留结构目标、非范围和设计深度口径。 |
| §3 约束条件 | Step 03 | 保留硬约束,不把约束写成口号。 |
| §4 代码主体框架总览 | Step 04 | 保留两个 ASCII 图和业务组成部分 / 实现分层区分。 |
| §5 主要组成部分、职责与边界 | Step 05 | 保留 10 个组成部分、对象发现维度、交互图和每部分职责 / 接缝摘要。 |
| §6 关键对象轮廓 | Step 06 及附录 | 保留对象分布、正式对象摘要和代表字段 / 函数骨架;不粘贴全部附录。 |
| §7 API / 接口骨架 | Step 07 | 保留五类接口骨架和读写边界。 |
| §8 关键处理流 / 重要函数数据流 | Step 08 | 保留通用路径、关键流族和 no-write / body-free / job non-repair 口径。 |
| §9 状态定义与状态流转 | Step 09 | 保留状态族、核心状态、流转图、禁止迁移和传播关系摘要。 |
| §10 异常与边界场景轮廓 | Step 10 | 保留异常总览、处理流族异常、状态影响和异常影响图。 |
| §11 配置影响轮廓 | Step 11 | 保留配置影响表、禁止配置化边界、配置影响图和后移清单。 |
| §12 详细设计承接清单 | Step 12 | 保留承接矩阵、继续展开方向和概要回退规则。 |
| §13 设计风险与待确认事项 | Step 13 | 保留风险、待确认事项、实现前阻塞条件和处理规则。 |
| §14 参考 | Step 14 | 只列实际使用材料及用途。 |

### 4.2 哪些结论需要拆分吸收到多个章节?

| 结论 | 拆分方式 |
|---|---|
| `L4-observability` 不拥有业务 truth | §1 声明上游边界;§3 写硬约束;§5 写非职责;§7~§10 写接口 / 流 / 异常红线;§13 写风险。 |
| redaction-first 与 body-free | §3 写约束;§6 写对象禁止事项;§7 写输入 / 输出边界;§8 写处理流检查点;§10 写异常落点;§11 写禁止配置化。 |
| Query no-write / Job no-source-repair | §3 写约束;§7 写接口分类;§8 写通用路径;§9 写禁止迁移;§10 写异常;§12 写详细设计测试承接。 |
| report handoff non-signoff | §5 写组成部分非职责;§6 写 `ReportHandoffRecord` / `AuthenticityHint`;§7~§8 写接口和 flow;§13 写风险。 |
| external product neutrality | §1 写 historical material 处理;§3 写约束;§11 写配置影响;§13 写待确认。 |

### 4.3 哪些术语、编号或交叉引用需要统一?

| 旧 / 易漂移写法 | 正式统一写法 | 说明 |
|---|---|---|
| ingestion / ingest / intake 混用 | `Observation Intake and Safety` | 正式主要组成部分名称以 Step 05 为准。 |
| log / metric / trace 三套对象先行 | `SafeSignal` + 后续详细设计可细分 | Step 06 未把 `MetricPoint`、`TraceSpanRecord` 作为正式关键对象。 |
| `EvidenceLink` | `EvidenceLinkage` | 以 Step 06 正式对象为准。 |
| `AuditEventProjection` | `AuditProjection` | 以 Step 06 正式对象为准。 |
| `NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord` | 详细设计可细分 DTO / value object | 不作为当前正式 `02` 的关键对象主语。 |
| schema、topic、HTTP path、repository trait | 详细设计内容 | 不在 Step 14 装配时补入。 |
| `run_id`、EV alias、signoff | 真实执行 / 验收材料 | 不伪造,只写 non-signoff 和真实性提示边界。 |

### 4.4 哪些内容仍应继续保留为设计风险或待确认,不能润色成定论?

Step 13 的待确认事项继续保留。特别是:

- `SafeSignal` 是否在详细设计拆成 log / metric / trace 三套对象。
- `ExternalAuditExportPreparation` 的最终 state / projection 落点。
- `PrepareExternalAuditExport` Command 与 Job 是否改名。
- `ConsumeSourceAuditMaterial` 是否按 source family 拆 handler。
- `OutboxPublicationState`、`DiagnosticFreshnessState`、`ReadAccessRecord` 的详细设计承载位置。
- Query response 字段组合、consumer stored result、handoff / export receipt、dead-letter payload、配置对象和产品选型。
- P95 / P99 / SLO、retention days、digest / canonicalization、产品基线是否进入后续测试 / 验收 / ADR。

这些事项不阻塞正式 `02` 装配,但不得在正文里改写成已确认实现契约。

### 4.5 哪些细节仍应留给详细设计?

以下内容不得在 Step 14 补入正式 `02`:

- 完整 Rust struct / enum / trait / repository / port。
- 完整 DTO / JSON / event payload / handoff schema。
- DDL、索引、事务脚本、cursor、batch、retry、dead-letter payload。
- 配置 key、默认值、环境变量、secret、endpoint、产品参数。
- 测试矩阵、真实 evidence、真实 run id、验收签署、implementation commit。
- implementation ledger、planned boundary skeleton 和实施 boundary。

## 5. 历史材料诊断

| 材料 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `02_hld_step_14_formal_document_assembly.md` | 以 schema 化对象和旧自动装配门禁为主,没有逐章映射 Step 01 ~ Step 13 当前产物 | 全量替换为当前 Step 14 产物。 |
| 旧正式 `02-概要设计.md` | 只有约 269 行,相对 Step 05~13 当前产物粒度明显不足;使用旧对象名如 `MetricPoint`、`TraceSpanRecord`、`AuditEventProjection` | 全量替换为本轮 Step 01 ~ Step 13 装配版。 |
| 旧 README / 历史产品心智 | 包含 TimescaleDB、Grafana、P95、hash chain、冷存、事件数量等未由当前链路闭合的信息 | 继续作为 historical material,不进入正式概要结论。 |
| 旧 `03~07` / implementation boundary | 未经当前 `02` 重建,不能作为实现移交依据 | 继续 blocked_by_02;只有后续正式完成 `07` 才能创建 implementation ledger 和 planned boundary skeleton。 |

## 6. 正式文档重组结论

正式 `02-概要设计.md` 使用 `概要设计书写规范.md` 的 14 章主链。每章开头必须包含具体校准来源块:

```md
> 校准来源:
> - `design-calibration/02_hld_step_xx_*.md`
>
> 延伸阅读:
> - 建议继续阅读 ...
```

本次正式装配采用“正式正文承载收口结论,`design-calibration` 承载过程、诊断、取舍、附录和停审记录”的分层。Step 06 对象附录、Step 08 全量处理流图、Step 09 全量状态矩阵和 Step 12 全量承接清单不机械全贴,但正式正文必须保留足够让 `03-详细设计.md` 继续展开的对象、接口、流、状态和边界主语。

## 7. 章节回填映射

| 正式章节 | 写入内容 | 未写入内容 |
|---|---|---|
| §1 | 上游关系映射、本文不再回答、本文必须回答 | 需求目标、架构推导全文。 |
| §2 | 结构目标、交付给 `03` 的结果、非范围、设计深度 | 实施任务、开发排期。 |
| §3 | 约束表和后续章节影响 | 泛化工程口号、产品偏好。 |
| §4 | 架构模块到代码主体映射图、实现分层图、关系表、关键判断 | 目录、crate 真实路径、trait 定义。 |
| §5 | 组成部分总表、对象发现维度表、交互图、10 个组成部分摘要 | 字段骨架、接口协议、完整处理流。 |
| §6 | 对象分布、正式对象筛选、代表对象骨架、附录入口 | 全部对象附录逐项复制。 |
| §7 | 五类接口分类、Command / Query / Consumer / Event / Job 骨架、接口映射 | HTTP path、topic、完整 DTO、事务。 |
| §8 | 通用 Command / Query / Consumer / Job 路径、10 个流族摘要和跨流红线 | 完整伪代码、repository trait、错误码。 |
| §9 | 状态组、核心状态、流转图、禁止迁移、传播关系 | 完整状态矩阵、代码实现。 |
| §10 | 异常总览、异常分类、异常影响图、状态影响 | retry 数字、DLQ、恢复脚本。 |
| §11 | 配置影响、禁止配置化、配置影响图、后移清单 | config key、默认值、产品参数。 |
| §12 | 详细设计承接矩阵、继续展开方向、回退规则 | 详细设计正文、测试用例全集。 |
| §13 | 风险表、待确认表、实现前阻塞项、处理规则 | 已稳定输入重复挂起。 |
| §14 | 实际使用参考材料及用途 | 未使用材料、虚构 evidence。 |

## 8. 术语统一结论

| 术语 | 正式含义 |
|---|---|
| `主要组成部分` | Step 05 收稳的 10 个业务结构主语,不是目录、crate 或实现层。 |
| `代码主体骨架` | Service、domain object、policy、store、port、projection、outbox、job 等可落到详细设计的主体轮廓。 |
| `observation-owned truth` | 本仓拥有的准入事实、审计投影、body-free linkage、marker、history、projection、handoff、violation 等观察侧事实。 |
| `external truth` | Governance、Artifact、Identity、Runtime、Sandbox、Archive、Console、外部产品或 source owner 拥有的事实,本仓不得接管。 |
| `body-free` | 只承接 ref、safe summary、digest、visibility、gap 和 consumer purpose,不保存外部正文。 |
| `non-signoff handoff` | report handoff 只交接材料与真实性提示,不生成最终 verdict、真实 evidence alias、真实 run id 或验收签署。 |

## 9. 交叉引用结论

| 引用关系 | 正式处理 |
|---|---|
| §5 -> §6 | §5 的对象发现维度表必须在 §6 的对象分布中能找到承接或排除口径。 |
| §6 -> §7 | §7 只能使用 Step 06 已正式化对象或明确作为详细设计参数骨架的名称。 |
| §7 -> §8 | §8 处理流入口必须来自 §7 接口骨架。 |
| §8 -> §9 | §9 状态主语必须能回指 §8 处理流和 §6 对象。 |
| §9 -> §10 | §10 异常必须能影响已定义状态或明确被拒绝在状态外。 |
| §10 -> §11 | §11 配置影响只从异常红线和配置接缝抽取,不新增恢复机制。 |
| §12 -> §13 | §12 已承接给详细设计的稳定输入不得在 §13 重复挂起。 |

## 10. 参考材料表

| 参考材料 | 用途 |
|---|---|
| `standards/document/概要设计讨论流程_SOP.md` | Step 14 装配流程和门禁。 |
| `standards/document/概要设计书写规范.md` | 正式章节结构、每章校准来源块和输出约束。 |
| `standards/document/设计文档讨论中间产物规范.md` | 中间产物先于正式文档、三层门禁和回填纪律。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 防止实现侧补设计 truth、伪造 evidence 或越过文档闭环。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | `L0-core` 唯一编译期依赖、sibling repo 通过裁剪边界协作。 |
| `projects/L4-observability/00-需求文档.md` | 当前需求基线。 |
| `projects/L4-observability/01-架构设计.md` | 当前架构基线。 |
| `projects/L4-observability/design-calibration/02_hld_step_01~13_*.md` | 正式 `02` 当前真相源。 |
| `projects/L1-governance/02-概要设计.md`、`projects/L1-artifact/02-概要设计.md` | 粒度参考。 |

## 11. 不写入正式文档的内容

| 内容 | 原因 | 后续落点 |
|---|---|---|
| 完整对象字段全集、函数签名、repository trait、DDL | 详细设计层内容 | `03-详细设计.md` |
| 配置 key、默认值、env var、secret、endpoint、产品参数 | 配置设计层内容 | `04-配置设计.md` |
| 测试矩阵、测试用例、fixture、真实 evidence | 测试 / 验收层内容 | `05-测试方案.md` / `06-验收标准.md` |
| implementation ledger、planned boundary skeleton、commit boundary | 实施计划层内容 | `07-实施计划.md` |
| 旧 P95 / P99 / 冷存 / hash chain / 事件数量 | 历史材料,尚未由当前链路闭口 | `04~07` 或 ADR 后续确认 |

## 12. 正式文档装配结果

| 文件 | 处理 |
|---|---|
| `projects/L4-observability/02-概要设计.md` | 已按 Step 01 ~ Step 13 当前产物全量替换正式正文。 |
| `projects/L4-observability/design-calibration/02_hld_calibration_flow.md` | 已更新 Step 14 为 pass,下一步停在等待用户确认进入 `03`。 |
| `projects/L4-observability/design-calibration/project_execution_ledger.md` | 已更新当前恢复点为 `02` Step 14 formal assembly complete。 |

## 13. 自检

| 检查项 | 结果 |
|---|---|
| 是否先创建 / 更新 Step 14 中间产物再更新正式 `02` | pass |
| 是否每章都有具体 `design-calibration` 校准来源块 | pass |
| 是否只使用 Step 01 ~ Step 13 当前产物作为正式结论来源 | pass |
| 是否替换旧正式 `02` 中 schema 化、产品化和旧门禁内容 | pass |
| 是否保留 Step 05 以后可落到详细设计的粒度 | pass |
| 是否未新增未经讨论的新结论 | pass |
| 是否未写完整 schema、DDL、配置 key、测试证据或实施计划 | pass |
| 是否未伪造 implementation commit、真实 run id、真实 evidence alias、验收签署或测试结果 | pass |
| 是否发现阻塞正式 `02` 装配的上游 blocker | no |

## 14. 门禁

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| pass | 已按概要 SOP Step 14、概要书写规范正式装配要求、Step 01~13 当前产物和 L1 / L1-artifact 粒度参考完成正式 `02-概要设计.md` 装配;旧正式 `02` 与旧 Step 14 已降级为 historical_material_replaced;未发现阻塞正式装配的上游 blocker | wait_user_confirmation_before_03 |
