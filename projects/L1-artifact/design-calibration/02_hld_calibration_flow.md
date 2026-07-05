# L1-artifact 概要设计校准工作台

> 对应文档: `projects/L1-artifact/02-概要设计.md`
> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md`
> 创建日期: 2026-07-03
> 当前目标: 在已完成新版 `00-需求文档.md` 和 `01-架构设计.md` 的前提下,按最新概要设计 SOP 校准 `L1-artifact`。

---

## 1. 本轮校准原则

- 概要设计必须承接新版需求和新版架构,不能回到旧版“先用人话理解本仓 / 术语解释 / 存储心智 / 摘要展示”作为主线。
- `L1-artifact` 的概要设计要下沉到代码主体骨架层,但不能提前写完整字段、函数实现、DDL、协议 schema、配置 JSON、测试用例或实施 commit boundary。
- 本轮概要设计必须围绕“可审计制品真相仓”的可实现结构展开:代码主体框架、主要组成部分、关键对象、API / 接口骨架、关键处理流、状态机、配置影响和详细设计承接清单。
- 旧 `02-概要设计.md` 只作为历史输入和问题诊断来源。正式概要设计已在 Step 14 按新文件标准重建完成。
- 每个 Step 必须独立落盘、独立更新本文状态,不得合并 Step。
- 回填草稿如果完全引用已有中间产物章节,只说明引用来源;正式总文档生成时再从中间产物摘录,避免重复写入。

---

## 2. 稳定输入

| 输入 | 当前状态 | 本轮使用方式 |
|---|---|---|
| `00-需求文档.md` | 已按需求 SOP 重建 | 作为概要设计需求边界 |
| `01-架构设计.md` | 已按架构 SOP 重建 | 作为概要设计架构边界 |
| `design-calibration/00_req_step_01_upstream_relation.md` ~ `00_req_step_17_formal_document_assembly.md` | 已完成 | 用于追溯需求结论来源 |
| `design-calibration/01_arch_step_01_requirement_baseline.md` ~ `01_arch_step_16_formal_document_assembly.md` | 已完成 | 用于追溯架构结论来源 |
| `standards/document/概要设计讨论流程_SOP.md` | 已读取 | 作为 Step 1~14 的流程约束 |
| `standards/document/概要设计书写规范.md` | 已读取 | 作为正式 `02-概要设计.md` 的 14 章结构约束 |
| `standards/document/设计文档讨论中间产物规范.md` | 已读取 | 作为 flow / Step / 项目台账的恢复和写入约束 |
| `projects/L0-core/00~07` | read_on_demand | 共享 ID、typed ref、trace、error 和基础契约边界线索 |
| `projects/L0-bus/00~07` | read_on_demand | 事件协作、变化传播和 handoff 边界线索 |
| `projects/L1-work/00~07`;`L1-process/00~07`;`L1-governance/00~07` | read_on_demand | Artifact 上游产出、治理证据、基线消费和回指边界线索 |
| `projects/L1-conversation/00~07`;`L1-workspace/00~07`;`L4-archive/00~07`;`L4-observability/00~07`;`L5-sync/00~07` | read_on_demand | 下游消费、只读派生、交接和同步边界线索 |
| `projects/L3-method-library/00~07`;`L2-runtime/00~07`;`L3-capability-hub/00~07` | read_on_demand | 定义来源、自动化产出和能力执行边界线索 |
| 旧 `02-概要设计.md` | 未按最新 SOP 校准 | 仅作为历史草案和问题诊断输入 |

---

## 3. Step 状态表

| Step | 主题 | 状态 | 中间产物 |
|---|---|---|---|
| Step 1 | 确认上游输入边界 | 已完成 | `design-calibration/02_hld_step_01_upstream_boundary.md` |
| Step 2 | 明确本仓设计目标与当前范围 | 已完成 | `design-calibration/02_hld_step_02_goals_scope.md` |
| Step 3 | 收稳约束条件 | 已完成 | `design-calibration/02_hld_step_03_constraints.md` |
| Step 4 | 代码主体框架映射 | 已完成 | `design-calibration/02_hld_step_04_code_subject_framework.md` |
| Step 5 | 主要组成部分、职责与边界 | 已完成 | `design-calibration/02_hld_step_05_components_boundary.md` |
| Step 6 | 关键对象轮廓 | 已完成 | `design-calibration/02_hld_step_06_key_objects.md` |
| Step 7 | API / 接口骨架 | 已完成 | `design-calibration/02_hld_step_07_api_interface_skeleton.md` |
| Step 8 | 关键处理流 / 重要函数数据流 | 已完成 | `design-calibration/02_hld_step_08_processing_flows.md` |
| Step 9 | 状态机与状态流转 | 已完成 | `design-calibration/02_hld_step_09_state_machine.md` |
| Step 10 | 异常与边界场景轮廓 | 已完成 | `design-calibration/02_hld_step_10_exceptions_boundaries.md` |
| Step 11 | 配置影响轮廓 | 已完成 | `design-calibration/02_hld_step_11_configuration_impact.md` |
| Step 12 | 详细设计承接清单 | 已完成 | `design-calibration/02_hld_step_12_detailed_design_handoff.md` |
| Step 13 | 设计风险与待确认事项 | 已完成 | `design-calibration/02_hld_step_13_risks_open_questions.md` |
| Step 14 | 整理正式概要设计文档 | 已完成 | `design-calibration/02_hld_step_14_formal_document_assembly.md` |

---

## 4. 当前已收敛的关键决策

| 编号 | 问题 | 当前结论 |
|---|---|---|
| D-HLD-ART-001 | 是否在旧 `02-概要设计.md` 上局部修补 | 否。旧文档作为历史输入,正式文档在 Step 14 按新文件标准重建。 |
| D-HLD-ART-002 | 概要设计是否继续以“先用人话理解本仓 / 术语词汇表 / 文件存储心智”作为第一层结构 | 否。它们是历史解释线索,第一层结构必须转为“可审计制品真相仓”的代码主体骨架。 |
| D-HLD-ART-003 | Artifact fact / version / lineage / baseline 是否可直接替代代码主体框架 | 否。它们是核心 truth 主线和主要组成部分候选,后续 Step 4~5 仍要重新筛成代码主体和组成部分边界。 |
| D-HLD-ART-004 | 外部正文、hash、tamper、search、lineage query、preview、archive handoff 是否现在升级为概要设计主线 | 否。它们只能作为边界、外围能力、派生能力或后续详细设计输入,不能抢占当前主线。 |
| D-HLD-ART-005 | 本轮概要设计是否按功能清单组织 | 否。当前应按代码主体框架、主要组成部分、对象 / 接口 / 流程 / 状态骨架组织,不能回滑成需求功能项列表。 |
| D-HLD-ART-006 | 本轮概要设计是否提前吸收 schema、DDL、配置项、测试和实施 boundary | 否。它们属于 `03~07` 的下游责任,本轮 02 只收可实现结构骨架。 |
| D-HLD-ART-007 | Step 3 是否复述全部架构约束 | 否。当前只保留会直接影响后续结构判断的约束,不把 `01-架构设计.md` 原文整体复制到 02。 |
| D-HLD-ART-008 | 派生消费和交接能力是否可以提升为核心 truth 主线 | 否。它们只以“只读派生 / 交接边界”约束持续生效,不能成为第二 truth center。 |
| D-HLD-ART-009 | 同步 / 异步 / 后台路径是否可在概要设计中混写 | 否。路径分离约束已在 Step 3 固定,后续接口骨架和处理流必须显式承接。 |
| D-HLD-ART-010 | 配置是否允许改变 truth ownership 和边界 | 否。配置只允许影响承载和调节,不得改变核心 truth owner、外部正文边界和派生不反写规则。 |
| D-HLD-ART-011 | Step 4 是否直接按技术分层替代业务主语 | 否。当前采用“业务主要组成部分候选 + 实现分层”双轴框架,二者不能混用。 |
| D-HLD-ART-012 | `Artifact Sync Entry / Async Intake / Operations Jobs` 是否就是最终业务组成部分 | 否。它们只代表入口 / 运维形态,正式组成部分总表留待 Step 5 收口。 |
| D-HLD-ART-013 | 派生 / 交接代码主体是否可与核心 truth 主体平权 | 否。它们必须在框架层即被降级为只读派生或交接主体。 |
| D-HLD-ART-014 | 代码主体框架是否应提前展开为目录和文件路径 | 否。当前只停在代码主体骨架和实现分层,不进入目录结构。 |
| D-HLD-ART-015 | Step 5 是否继续只按四条核心 truth 主线拆分 | 否。需补齐 intake、review、automation、consumption、derived 和 mirror 六类支撑组成部分。 |
| D-HLD-ART-016 | `Artifact consumption and traceability` 是否与 `Derived maintenance and handoff preparation` 合并 | 否。消费回指与派生维护 / 交接的状态语义不同,必须分开。 |
| D-HLD-ART-017 | local mirror / external reference 是否只是 intake 的附属细节 | 否。它同时支撑 intake、review、consumption 和 derived,需独立成正式组成部分。 |
| D-HLD-ART-018 | Step 6 是否继续沿用历史 `Artifact` / `BaselineMember` / `ContentRef` 作为当前正式对象名 | 否。当前正式对象承接为 `ArtifactFact`、`ArtifactBaselineMembership` 和 `ArtifactContentFactContext`。 |
| D-HLD-ART-019 | 是否把 adopted / approved relation 提前升格为 Step 6 正式关键对象 | 否。当前候选池未将其收稳为正式对象主语,留给后续详细设计接缝模型。 |
| D-HLD-ART-020 | derived freshness / external resolution 是否只保留为状态词汇 | 否。需正式提升为 `ArtifactDerivedViewState` 和 `ExternalReferenceResolutionState` 两个状态对象。 |
| D-HLD-ART-021 | Step 6 是否可以只输出一个对象总览表 | 否。对象数量较多,采用主控文件 + 6 个附录文件,保持“单对象独立成节”的粒度要求。 |
| D-HLD-ART-022 | Step 7 是否只保留“有接口”这类松散描述 | 否。必须显式按 Command / Query / Inbound Event Consumer / Outbound Event / Operations Job 五类接口分类。 |
| D-HLD-ART-023 | `ArtifactConsumptionBackref` 是否可由 Query 隐式写入 | 否。Query 保持只读,消费回指必须保留显式 Command 入口。 |
| D-HLD-ART-024 | Consumer 是否可以直接生成 fact / version / lineage / baseline | 否。Consumer 只能写 reference、resolution、pending 或 stale 语义。 |
| D-HLD-ART-025 | Job 是否可以顺手修复核心 truth | 否。Job 只允许维护 derived、refresh、reconciliation 和 handoff preparation。 |
| D-HLD-ART-026 | Step 8 是否可以只写“接口经过 service 再返回结果”这类松散流程 | 否。必须明确 P0 Command、关键 Query、所有 state-writing Consumer 和关键 Job 的独立处理流。 |
| D-HLD-ART-027 | 是否为每个 Query 单独机械画图 | 否。简单读取复用通用只读路径;仅对 `GetArtifactReadSurface` 单独展开 visibility / freshness / degraded 边界。 |
| D-HLD-ART-028 | Outbound Event 是否必须逐事件独立画同构流程 | 否。truth change signal 复用统一 relay flow,archive / observability / sync 交接单独走 handoff jobs。 |
| D-HLD-ART-029 | Consumer 和 Job 是否允许在处理流中隐式推进核心 truth | 否。Consumer 只写 ref / resolution / pending / stale,Job 只维护 derived / reconcile / handoff。 |
| D-HLD-ART-030 | `L1-artifact` 是否应建立单一全局状态机 | 否。当前按 intake、truth、version、baseline、review、automation、consumption、derived、trace / handoff 多组状态机并列收稳。 |
| D-HLD-ART-031 | 是否为 relay / outbound propagation 补独立 outbox 对象 | 否。Step 6 未 formalize 独立 outbox object,当前概要层只收 committed relay trigger 和 trace / handoff / freshness 传播边界。 |
| D-HLD-ART-032 | version candidate 与 formal version 是否可共用一套状态 | 否。`ArtifactVersionCandidate` 与 `ArtifactVersion::Candidate` 语义不同,前者是候选语境,后者是 formal version 物化骨架态。 |
| D-HLD-ART-033 | Query / Consumer / Job 是否允许越权恢复核心 truth | 否。Query 保持只读,Consumer 只写 reference / pending / stale,Job 只维护 freshness / reconcile / handoff。 |
| D-HLD-ART-034 | 是否在概要层展开完整异常处理机制 | 否。Step 10 只点名会改写主线理解的关键异常与边界场景。 |
| D-HLD-ART-035 | handoff / relay 失败是否影响 accepted truth 成立 | 否。它们只影响外围交付与运维可见面,不回滚核心 truth。 |
| D-HLD-ART-036 | 外部正文、tool output、sync private copy 是否可作为异常时的 fallback truth | 否。正文越界仍然是拒绝线,只允许 ref / summary / degraded surface。 |
| D-HLD-ART-037 | baseline formality、review readiness、automation candidate only 是否可以留到详细设计再点名 | 否。它们属于会扭曲主线理解的异常边界,必须在 Step 10 先点名。 |
| D-HLD-ART-038 | Domain / Policy 是否允许直接读取 runtime config | 否。它们只能间接受已验证输入、adapter 能力和 schedule outcome 影响,不得直接读取配置。 |
| D-HLD-ART-039 | 配置是否允许改变 truth ownership、正式锚点、query no-write、consumer no-truth、job no-repair | 否。Step 11 只允许配置影响运行承载、外围接缝、读面降级和维护节奏。 |
| D-HLD-ART-040 | Step 11 是否需要提前锁定 DB / queue / object store / search / archive / observability / sync 产品 | 否。当前只识别配置影响轮廓和详细设计承接方向,产品级参数后移 `04-配置设计.md` 和实施文档。 |
| D-HLD-ART-041 | `04-配置设计.md` 缺失时是否在概要设计补写配置项清单 | 否。Step 11 只记录 `04` 必须承接的配置影响范围,不提前代写具体配置项。 |
| D-HLD-ART-042 | Step 12 是否重新发明 `03-详细设计.md` 的主语 | 否。Step 12 只承接 Step 4~11 已收稳输入,不得新增对象、接口、流程或状态。 |
| D-HLD-ART-043 | `03-详细设计.md` 若发现主语要改,能否在 03 中直接暗改 | 否。必须回退对应概要 Step 修正,再继续详细设计。 |
| D-HLD-ART-044 | `04-配置设计.md` 缺失时,Step 12 是否要把具体配置项一起承接给 03 | 否。Step 12 只把 config ownership / validation / builder / adapter contract 承接给 03,具体配置项仍后移未来 `04`。 |
| D-HLD-ART-045 | 风险、产品选型、实施排期是否写入详细设计承接清单 | 否。它们不属于“已稳定输入”,应进入 Step 13 或后续 `04~07` 文档。 |
| D-HLD-ART-046 | Step 13 是否重复把 Step 12 已承接给 `03-详细设计.md` 的 exact contract 挂成待确认 | 否。Step 13 只保留真正未形成定论的问题,不重复挂起已交付 03 的稳定输入。 |
| D-HLD-ART-047 | 产品未定、本轮 `04/07` 缺失或外围增强未定,是否阻塞正式概要整理 | 否。只要当前有保守口径且不改变主语稳定性,即可进入 Step 14;但这些事项在进入实现前必须由后续文档闭口。 |
| D-HLD-ART-048 | 历史技术假设和旧性能数字能否在 Step 14 被润色成默认基线 | 否。它们只能保留为风险或待确认,不得在正式概要中转成已确认结论。 |
| D-HLD-ART-049 | 风险项的处理口径若在后续设计中需要改变,能否不回退上游文档 | 否。若会影响 Step 4~12 已收稳主语,必须回退到对应 Step 或 `00/01` 重审。 |

---

## 5. 下一步

当前已完成 Step 1、Step 2、Step 3、Step 4、Step 5、Step 6、Step 7、Step 8、Step 9、Step 10、Step 11、Step 12、Step 13 和 Step 14。下一步进入:

```text
02-概要设计已完成重建,下一步可进入 03-详细设计讨论流程。
```
