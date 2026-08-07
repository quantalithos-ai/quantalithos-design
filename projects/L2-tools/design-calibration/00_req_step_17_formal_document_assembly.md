# L2-tools 需求 Step 17:正式文档装配

> Step 状态: completed_stop_review
> 当前模式: full-restart
> 正式回填目标: `projects/L2-tools/00-需求文档.md` 全文
> 本步原则: 只重组、摘录、统一术语和补齐交叉引用;不新增 Step 1~16 未确认的需求、关系、协议、实现或 evidence。

---

## 1. Step 状态

| 字段 | 值 |
|---|---|
| step | Step 17 |
| status | `completed_stop_review` |
| current_module | `formal_document_assembly:completed_stop_review` |
| gate_status | `pass` |
| gate_reason | 最终全链审计已通过;正式 00 已完成,`L2T-UP-001~009` 保持开放但不阻塞需求文档完成。 |
| next_allowed_action | `wait_user_review_to_01_architecture`;未经用户明确确认不得进入 01。 |
| source_files | `00_req_step_01_upstream_relation.md`~`00_req_step_16_traceability_matrix.md`;需求 SOP Step 17;需求书写规范 §2.2~2.3 / §4.1~4.16;中间产物规范 §3.4.6 / §4 |
| formal_write_status | `closed_completed_stop_review` |

### 1.1 Step 内计划

| 序号 | 动作 | 状态 | 可审查产物 / 门禁 |
|---:|---|---|---|
| 1 | 恢复项目 ledger、需求 flow 与 Step 1~16 | done | 三层恢复点只允许创建 Step 17。 |
| 2 | 读取 SOP Step 17、正式结构和三层写入规范 | done | 只装配既有结论,正式目录固定为 16 章。 |
| 3 | 检查 Step 16 独立复审与补正 | done | 23 行主矩阵、19 核心 IB、外围 AC 来源均通过。 |
| 4 | 形成 16 章来源与内容映射 | done | 每章映射唯一对应 Step 文件和延伸阅读小节。 |
| 5 | 形成对象数量与 historical material 排除清单 | done | 全量编号不得压缩或回流旧口径。 |
| 6 | 执行正式写入三层门禁预检 | done | Step 17 自身允许回填;flow / ledger 同步后才开始写正式 00。 |
| 7 | 删除旧正式 00 并建立新骨架 | done | 旧正文已删除,16 章正式正文已在新骨架中全量重建。 |
| 8 | 按 100~300 行审查批次装配 16 章 | done | 16 章与 16 个 calibration source block 已完整装配,批次限制未压缩最终文档粒度。 |
| 9 | 执行结构、计数、追溯、污染与 blocker 审计 | done | 16 章、16 个来源块、对象全集、23 行固定六列矩阵、依赖裁剪、开放 blocker 与伪事实审计均已通过。 |
| 10 | 更新三层台账并停审 | done | 正式 00、需求 flow 与项目 ledger 已统一收口;等待用户明确确认进入 01。 |

## 2. 本步输入

| 输入 | 已读取结论 | 装配用途 |
|---|---|---|
| Step 1~6 | 来源、定位、问题、范围、角色与依赖裁剪已完成。 | 正式 §1~6。 |
| Step 7~12 | 五节点闭环、故事、FR、BR、DR、IB / DB 已完成能力级停审。 | 正式 §7~12,保留完整编号和映射。 |
| Step 13~16 | NFR、AC / VF、风险 / 待确认和追溯矩阵已完成。 | 正式 §13~16,不把验收定义写成实际结果。 |
| Step 16 独立复审 | `IB-L2T-019` owner 边界通过;外围 E01~E03 已补 `AC-L2T-036`;陈旧 18 项计数已更正为 19。 | 防止正式 §12 / §16 继承复审前遗漏。 |
| 需求 SOP Step 17 | 只做重组、润色、术语和交叉引用统一。 | 不在装配现场补结论。 |
| 需求书写规范 | 正式目录为 §1~16;每章有具体校准来源和延伸阅读。 | 固定表头、章节边界和粒度。 |
| 中间产物规范 | full-restart 删除旧文件后重建;每批 100~300 行;正式写入需三层门禁。 | 控制装配顺序和可审查性。 |

## 3. SOP 问题回答

| 应问问题 | 回答 |
|---|---|
| Step 1~16 是否都已确认并可回填 | 是。各 Step 均有结构化产物、回填草稿和 `gate_status = pass`;Step 16 的独立复审问题已补正。 |
| 能力级停审是否有未关闭失败项 | 否。`C-L2T-1~3` 通过,`C-L2T-4~5` 以开放约束通过;开放约束已进入风险和待确认,没有润色成 resolved。 |
| 跨能力追溯是否存在孤儿项 | 否。23 项 FR、43 条 BR、34 条 DR、23 项 IB、8 条 DB、19 条 NFR、39 条 AC 和 13 条 VF 均有来源或承接。 |
| 正式文档是否会新增未经讨论的内容 | 否。只使用 Step 1~16 的结构化产物和回填草稿;发现缺口必须返回对应 Step 补正。 |
| 每个正式章节是否能回指能力节点或外围来源 | 是。§7~16 保留能力 / 外围映射,§1~6 保留其前置边界来源。 |
| 未完成或开放事项如何处理 | `R-L2T-001~012`、`Q-L2T-001~008` 和 `L2T-UP-001~009` 原样保持开放并进入 §15 / §16 影响说明。 |
| 正式文档完成后是否进入 01 | 否。必须停在 `00_completed_stop_review`,等待用户再次确认。 |

## 4. 当前文档问题诊断

| 诊断对象 | 当前问题 | 装配约束 |
|---|---|---|
| 正式 `00` 装配结果 | 规范 16 章正文已按修复后的 Step 1~16 完成同步,§6 / §12 / §16 的依赖口径和头部状态已通过终审。 | 完成状态仅表示需求文档停审,不表示实现、测试、验收或上游 blocker 已完成。 |
| 旧正式链 | `01` 的 Python 同进程与 `03` 的 Rust RPC / HTTP / DB 互相冲突。 | 两者都不是需求 authority,不得反推部署和技术。 |
| Step 9~16 | 内容密度高,若只摘摘要会丢失编号、owner、失败语境和追溯。 | FR / BR / DR / IB / DB / NFR / AC / VF / R / Q 全量保留。 |
| 上游 seam | Authorization、Sandbox handoff、Observability producer、Core schema、SDK client 尚未闭口。 | 只写正式 ref / safe summary / candidate / fail-closed / blocked,不补 schema、route 或 readiness。 |
| 正式来源 | 每章若只写“Step 1~16”会失去精确追溯。 | 每章列具体 calibration 文件和建议阅读小节。 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 正式结构 | 旧 13 节,章节边界不符合当前规范。 | 规范固定 16 章。 | 恢复正式需求结构和逐章门禁。 |
| 仓定位 | Runtime“手脚”与具体工具集合。 | 工具调用语义契约真相仓。 | 分离 Runtime、Hub、Sandbox、Observability 和产品库存。 |
| 核心主线 | builtin / MCP / extras 和接口清单。 | 五节点工具合同闭环与条件路径。 | 以仓存在必要性而非旧库存组织需求。 |
| 需求粒度 | 少量摘要功能、旧 SLA 和接口假设。 | 23 FR、43 BR、34 DR、23 IB、8 DB、19 NFR、39 AC、13 VF 全量装配。 | 满足 Step 5 后可落码粒度与完整追溯。 |
| 未闭口关系 | 容易被写成既有协议或联调事实。 | 九项 blocker 保持开放并约束后续定稿。 | 不伪造 owner、schema、route、client 或 readiness。 |
| 验收语气 | 混入测试结果和完成暗示。 | 只定义通过条件与一票否决项。 | 需求验收定义不等于实际验收。 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 采用:删除旧 00 后按 16 章全量装配 | 可彻底排除旧结构污染,完整保留来源和编号。 | 文档较长,需分批审计。 | 采用;完整性优先。 |
| 不采用:在旧 00 上逐章修补 | 改动表面较小。 | 会残留旧标题、旧编号、SLA、事件和产品库存主线。 | 不采用,违反 full-restart。 |
| 不采用:只复制各 Step 回填草稿摘要 | 装配较快。 | Step 9 以后会丢失对象全集、映射和失败边界。 | 不采用。 |
| 不采用:在正式矩阵中补接口 / NFR / VF 列 | 单表看似集中。 | 破坏规范固定六列并制造未经确认的逐 FR 关系。 | 不采用;使用附属审计表。 |
| 不采用:在需求层闭口开放 seam | 可减少待确认项。 | 会越过上游 authority,伪造协议和 readiness。 | 不采用;保持 blocker。 |

## 7. 结构化中间产物

### 7.1 正式章节来源映射

| 正式章节 | 校准来源 | 必须保留的主体 | 延伸阅读指向 |
|---|---|---|---|
| §1 与上游文档的关系声明 | `design-calibration/00_req_step_01_upstream_relation.md` | 固定三列来源表 + 1 段收束说明 | 结构化中间产物、Historical material、设计取舍 |
| §2 本仓定位与边界 | `design-calibration/00_req_step_02_position_boundary.md` | `字段 / 写什么 / 不写什么` 固定表 + 边界结论 | 仓定位四要素、真相范围、边界取舍 |
| §3 背景与问题定义 | `design-calibration/00_req_step_03_problem_context.md` | 背景、问题表、业务 / 技术问题 | 结构化中间产物、Historical material |
| §4 目标与非目标 | `design-calibration/00_req_step_04_goals_non_goals.md` | 5 项目标、7 项非目标、范围收束 | 目标表、非目标表、范围取舍 |
| §5 用户与角色 | `design-calibration/00_req_step_05_users_roles.md` | 8 类角色与权限边界 | 角色说明、分类、owner 边界 |
| §6 使用方与依赖 | `design-calibration/00_req_step_06_consumers_dependencies.md` | 内外依赖、三张裁剪表、依赖裁剪图 | 依赖裁剪、禁止依赖、失效后果 |
| §7 核心能力闭环 | `design-calibration/00_req_step_07_core_capability_loop.md` | 五节点图、条件路径、节点表、层级 | 结构化中间产物、功能回填映射 |
| §8 用户故事 | `design-calibration/00_req_step_08_user_stories.md` | 17 核心 + 6 外围故事、映射与排除 | 故事表、能力停审、跨能力审计 |
| §9 功能需求 | `design-calibration/00_req_step_09_functional_requirements.md` | 17 核心 + 6 外围 FR、输入输出失败语境 | 功能表、能力语境、依赖结论 |
| §10 业务规则与边界约束 | `design-calibration/00_req_step_10_business_rules_boundaries.md` | 42 核心 + 1 外围 BR、类型和映射 | 规则表、跨能力审计、旧规则重裁 |
| §11 数据需求与数据归属 | `design-calibration/00_req_step_11_data_ownership.md` | 34 DR、四类数据、功能 / 规则映射 | 数据表、覆盖与跨能力审计 |
| §12 接口与依赖 | `design-calibration/00_req_step_12_interfaces_dependencies.md` | 19 核心 + 4 外围 IB、8 DB、同步 / 异步边界 | 接口表、依赖表、映射与裁剪 |
| §13 非功能需求 | `design-calibration/00_req_step_13_non_functional_requirements.md` | 19 NFR、六类覆盖、判断口径 | NFR 表、来源映射、六类停审 |
| §14 验收标准 | `design-calibration/00_req_step_14_acceptance_criteria.md` | 39 AC、13 VF、来源映射 | 验收表、一票否决、能力停审 |
| §15 风险与待确认事项 | `design-calibration/00_req_step_15_risks_open_questions.md` | 12 风险、8 待确认、blocker 门禁 | 风险 / 待确认表、blocker 承接 |
| §16 需求追溯矩阵 | `design-calibration/00_req_step_16_traceability_matrix.md` | 23 行固定六列矩阵 + 附属审计 | 主矩阵、接口 / NFR / VF 审计、漏项检查 |

### 7.2 全量对象清单

| 对象 | 正式编号范围 | 数量 | 装配要求 |
|---|---|---:|---|
| 核心能力节点 | `C-L2T-1~5` | 5 | 保留条件路径,不写成固定运行时序。 |
| 用户故事 | `US-L2T-001~017`;`US-L2T-E01~E06` | 23 | 核心 / 外围分层。 |
| 功能需求 | `FR-L2T-001~017`;`FR-L2T-E01~E06` | 23 | 完整说明、节点和故事映射。 |
| 业务规则 | `BR-L2T-001~042`;`BR-L2T-E01` | 43 | 六类规则与约束对象完整。 |
| 数据归属 | `DR-L2T-001~034` | 34 | truth / snapshot / ref / forbidden body 完整。 |
| 接口边界 | `IB-L2T-001~019`;`IB-L2T-E01~E04` | 23 | `IB-L2T-019` 只消费正式 authorization 结果。 |
| 依赖边界记录 | `DB-L2T-001~008` | 8 | 保留 8 条记录全集;当前依赖为 001~002、004~007,003 为 pending,008 为 future / excluded。 |
| 非功能需求 | `NFR-L2T-001~019` | 19 | 六类全覆盖,不伪造数字。 |
| 验收标准 | `AC-L2T-001~039` | 39 | 只定义条件,不写实际结果。 |
| 一票否决项 | `VF-L2T-001~013` | 13 | 不写成已触发或已通过。 |
| 风险 | `R-L2T-001~012` | 12 | 第三列保持当前约束,不写解决方案。 |
| 待确认事项 | `Q-L2T-001~008` | 8 | 状态保持开放。 |
| 上游 blocker | `L2T-UP-001~009` | 9 | 全部保持开放,不伪称 resolved。 |

### 7.3 Historical material 排除清单

| 旧口径 | 当前处理 |
|---|---|
| Python 同进程包 / Rust RPC-HTTP 服务 / PostgreSQL / Redis / NATS | 技术与部署形态后移 01~04,需求不选型。 |
| builtin catalog、具体工具库存、MCP Client、Role extras、member-images | 排除为产品库存、外部 client 或装配边界。 |
| 本地 capability registry / allowlist / provider registry | 排除;Hub 与正式 authorization owner 保持真相。 |
| agent loop、LLM planning、orchestration、retry / recovery / checkpoint | 排除到 `L2-runtime`。 |
| Sandbox run / capture / failure / receipt / cleanup truth | 只作正式 source ref,不得并入 L2 truth。 |
| invocation history / replay / metrics / trace / observation store | 排除到 Runtime / Bus / Observability 等 owner。 |
| 旧 API、DTO、event、error code、topic、route | 不继承,后续正式设计重新闭口。 |
| 旧 P95 / SLA / 百分比 / replay 指标 | 无 measurement authority,不进入 NFR / AC。 |
| 旧测试结果、验收签署、真实 evidence alias、实现 commit / run_id | 不得伪造或继承。 |

### 7.4 三层正式写入预检

| 门禁层级 | 状态 | 依据 | 正式写入前动作 |
|---|---|---|---|
| 项目级 | pass | 装配启动前 `project_execution_ledger.md` 仅允许 Step 17 写正式 00,下一正式文档始终阻塞。 | 装配完成后已关闭正式 00 写入。 |
| 文档级 | pass | 装配启动前 `00_requirements_calibration_flow.md` 的 `formal_assembly:in_progress` 门禁已通过。 | 装配完成后已收口为 `00_completed_stop_review`。 |
| Step / 模块级 | pass | 固定十段、NFR 来源、对象全集和六列矩阵联合预检均通过。 | 正式正文只承载收口结论;当前等待用户审阅。 |
| 思考记录 | done | §2~7 已形成可审查产物。 | 不在正式装配中补结论。 |
| 正文污染 | no | 诊断、取舍和旧材料差异仅留在本文件。 | 正式正文只写收口结论。 |
| 批次误用 | no | 100~300 行只约束单次 patch。 | 分批写入但不压缩对象全集。 |

## 8. 回填草稿

正式文档头部已写明 `Draft / 00_completed_stop_review`,仅代表需求文档装配完成后停审,不代表实现、测试或验收完成。正文严格使用 §1~16,每章开头均列具体校准来源和延伸阅读。

装配已按以下批次完成:头部与 §1~4;§5~7;§8~10;§11~12;§13~14;§15~16。每批均已检查标题、表头、编号、owner 边界和旧关键词污染,未以批次长度为理由删减正式内容。

## 9. 待确认事项

本 Step 不新增待确认事项。`Q-L2T-001~008`、`R-L2T-001~012` 和 `L2T-UP-001~009` 原样继承;它们不阻塞需求正式装配,但继续阻塞受影响的 owner / schema / mapping / receipt / route / client / measurement / readiness 定稿。

## 10. 进入下一步条件

| 条件 | 当前结果 |
|---|---|
| Step 1~16 是否全部 `gate_status = pass` | pass |
| 16 章是否逐章映射具体 calibration 文件 | pass |
| 对象数量与编号范围是否固定 | pass |
| Historical material 排除清单是否完成 | pass |
| 三层正式写入预检是否完成 | pass |
| 是否未新增需求、协议、实现或事实 | pass |
| Step 1~16 修复是否完成并允许正式回填 | pass |
| 16 章、16 个 calibration source block 与对象全集是否完整 | pass |
| 23 行固定六列主矩阵与依赖裁剪是否无漂移 | pass |
| 九项 blocker 是否保持开放且伪事实审计是否通过 | pass |

```text
step_status = completed_stop_review
current_module = formal_document_assembly:completed_stop_review
gate_status = pass
gate_reason = final full-chain audit passed; formal 00 is complete; L2T-UP-001~009 remain open but do not block requirements completion
next_allowed_action = wait_user_review_to_01_architecture
source_files = Step 1~16 + requirements SOP Step 17 + requirements specification + intermediate artifact standard
formal_00_write_allowed = false
next_formal_document_allowed = false
commit_required = false
```
