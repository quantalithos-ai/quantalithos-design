# L4-observability 05-测试方案 Step 01：确认测试输入边界

## Step 状态

| 字段 | 当前值 |
|---|---|
| project | `L4-observability` |
| document | `05-测试方案.md` |
| step | `01 / 确认测试输入边界` |
| mode | `full-restart` |
| status | `completed_current_design_record` |
| gate_status | `pass` |
| next_allowed_action | `start_current_05_step_02` |
| formal_document_write | `not_allowed_until_step_15` |
| current_baseline | current `00-需求文档.md` through `04-配置设计.md` |
| test_execution | `not_run` |
| evidence | `planned_only`; no real alias or run id |
| commit | not required; no commit requested |

## 1. 本步输入

本步按 `standards/document/测试方案讨论流程_SOP.md` Step 01 执行。已读取并作为 current
输入的文档如下：

| 输入类别 | 文档 | 本步用途 |
|---|---|---|
| 通用标准 | `standards/document/设计文档编写通则.md` | 固定正式文档边界、引用和粒度 |
| 通用标准 | `standards/document/设计文档讨论中间产物规范.md` | 固定三层台账、Step 独立产物、full-restart 和写入门禁 |
| 通用标准 | `standards/document/设计真相源闭环与可落码性标准.md` | 固定字段、状态、协议、evidence 和 no-write 的可验证性要求 |
| 通用标准 | `standards/document/全局项目依赖关系与裁剪规则.md` | 固定跨仓依赖和 truth owner 边界 |
| 测试标准 | `standards/document/测试方案讨论流程_SOP.md` | 固定本 Step 问题、05 章节主链和逐切口停审规则 |
| 测试标准 | `standards/document/测试方案书写规范.md` | 固定正式 05 的 15 章结构和校准来源写法 |
| current 上游 | `projects/L4-observability/00-需求文档.md` | 需求、规则、数据边界、NFR、AC 和 VETO 输入 |
| current 上游 | `projects/L4-observability/01-架构设计.md` | 系统边界、依赖方向、truth ownership 和运行边界输入 |
| current 上游 | `projects/L4-observability/02-概要设计.md` | 组成部分、协议族轮廓、状态和处理流输入 |
| current 上游 | `projects/L4-observability/03-详细设计.md` | exact protocol、flow、state、UoW、error、config、telemetry 和 test cut 输入 |
| current 上游 | `projects/L4-observability/04-配置设计.md` | profile、schema、sensitivity、assembly、failure 和 lifecycle 测试输入 |
| 参考粒度 | `projects/L1-governance/05-测试方案.md`、`projects/L1-artifact/05-测试方案.md` | 仅参考章节粒度、矩阵深度和证据结构 |

`06-验收标准.md` 尚未完成 current full-restart，因此本步只承接 `00` 已明确的验收方向和
VETO，不把旧 `06` 的 verdict、evidence 或验收状态视为输入。`07-实施计划.md` 也尚未
完成，因此本步不承接旧实施阶段、commit boundary 或实现仓事实。

## 2. SOP 问题回答

### 2.1 当前测试方案要承接哪些需求、规则和非功能目标

测试方案承接 current `00` 的以下闭环：

| 输入族 | current ID / 范围 | 测试承接方式 |
|---|---|---|
| 核心能力 | `C-OBS-1~5` | 每个能力至少形成对象、流程、边界和证据切口 |
| 核心功能 | `FR-OBS-001~013` | 建立需求到设计契约、用例和 planned evidence 的双向追溯 |
| 规则 | `BR-OBS-001~026` | 正向约束和禁止行为均有可判定负向场景 |
| 数据归属 | `DO-OBS-001~034` | 验证 observation fact、projection、handoff、retention 和 violation 的 owner；验证禁止正文不入仓 |
| 质量目标 | `NFR-OBS-001~024` | 只承接可由当前设计表达的安全、可追溯、降级、重复输入、no-write 和依赖边界；无来源硬指标保持候选 |
| 验收方向 | `AC-OBS-001~031` | 为后续 `06` 提供 planned test / evidence 输入，不填写验收结果 |
| 一票否决 | `VF-OBS-001~010` | 设计 P0 veto 场景和证据 schema；执行状态仍为 `planned` |
| 外围增强 | `FR-OBS-E01~E06` | 只验证不污染核心观察闭环的边界；不把外围增强升格为 P0 核心通过条件 |

### 2.2 哪些概要 / 详细设计章节直接影响测试对象

| 设计来源 | 直接测试输入 | 后续 05 章节 |
|---|---|---|
| `02` §4~§6 | 代码主体、组成部分和关键对象轮廓 | §3、§4 |
| `02` §7~§8 | Command / Query / Consumer / Event / Job 骨架与处理流 | §3、§6 |
| `02` §9~§10 | 状态组、合法/禁止转换、异常轮廓 | §6、§10、§11 |
| `02` §11 | 配置影响和禁止配置化边界 | §7、§8、§10 |
| `03` §5~§7 | 模块、对象、trait/port、protocol helper 和 exact protocol schema | §3、§5、§6 |
| `03` §8~§9 | 逐接口 flow、状态矩阵和 phase 约束 | §6、§10、§14 |
| `03` §10~§13 | store、UoW、事务、错误、恢复、并发、幂等和配置绑定 | §6~§12 |
| `03` §14 | log/metric/trace/audit schema、redaction、correlation、evidence、retention、handoff、no-write | §3、§6、§9、§10、§13 |
| `03` §15 | 已确认的测试层次、最小 harness 和测试切口 | §3~§6、§9 |
| `03` §16~§17 | 实施承接、affected、风险、待确认和 readiness | §12、§14、§15；后续 `06/07` |
| `04` §6~§13 | profile、raw schema、敏感字段、13-stage assembly、变更、失败、迁移和 handoff | §7~§10、§13、§14 |

### 2.3 哪些验收项需要测试方案提供证据

所有 `AC-OBS-001~031` 和 `VF-OBS-001~010` 都需要在 `05` 中有可追溯的 planned
测试输入或明确的设计期不可执行 disposition。具体证据 ID 只能在 Step 13 生成候选
schema；本步不创建真实 alias。

优先需要测试方案提供证据输入的验收面是：

| 验收面 | 需要的测试输入 | 真实状态限制 |
|---|---|---|
| 核心能力闭环 | `C-OBS-1~5` 的主流程和边界场景 | 只能标 `planned`，不能标 pass |
| body-free / redaction | `BR-OBS-002`、`BR-OBS-008`、`BR-OBS-012`、`VF-OBS-002~003` | 必须有序列化前负向断言；不得写真实 payload |
| no-write | `BR-OBS-015~016`、`BR-OBS-022~023`、`VF-OBS-005` | query/job/rebuild/consumer 的写集合需可审计 |
| correlation / evidence / retention / handoff | `FR-OBS-002`、`FR-OBS-005`、`FR-OBS-010~013` | 只验证 ref、digest、marker、handoff 和 gap；不生成真实证据或 verdict |
| 依赖裁剪与历史材料 | `VF-OBS-008~010` | 静态检查和文档追溯可计划；不声称已运行 |
| 配置安全与失败 | `04` §8~§13、`CFG-FAIL-01~25` | 只定义测试场景和输出 schema；不把配置可用等同实现 ready |

### 2.4 测试方案不应重新定义什么

测试方案不拥有以下决策：

1. 不新增或改写 `00` 的需求、规则、数据归属、NFR、AC、VETO ID。
2. 不重新定义 `03` 的字段、状态、协议数量、trait/port、UoW、错误、恢复或函数流。
3. 不把 `04` 的配置项、默认值、profile 或 redline 改成测试专用配置。
4. 不替代 `06` 对 evidence 的通过/失败裁决、风险接受或最终签署。
5. 不替代 `07` 安排实现顺序、commit、实现仓路径或 boundary ownership。
6. 不把测试替身升级为生产能力，不以 fake/controlled 结果证明 RuntimeLike 或 external target 已成立。
7. 不填写真实 `run_id`、真实 evidence alias、测试结果、验收签署或实现 commit。

## 3. 当前文档问题诊断

| 材料 | 当前判定 | 处理 |
|---|---|---|
| `projects/L4-observability/README.md` | `historical_material` | 只保留横切观测方向线索；OTel、Prometheus、Grafana、TimescaleDB、SLA 和目录假设不进入 current 测试基线 |
| 旧 `05-测试方案.md` | `historical_material` | 含 L1-artifact 的协议、profile、需求 ID、测试编号和 `pass` 状态；不增量修补，Step15 重新装配 |
| 旧 `05_test_plan_step_01~15` | `historical_material` | 物理文件可供差异审计，但不继承其结论、编号、证据 alias 或门禁状态 |
| 旧 `06-验收标准.md` | `historical_material` | 不作为本步验收输入；只记录旧口径存在，待 `06` full-restart 重建 |
| 旧 `07-实施计划.md` | `historical_material` | 不作为本步实施输入；boundary、commit 和实现路径待 `07` 重建 |
| current `00~04` | `current_truth_source` | 作为本轮唯一正式测试设计输入；冲突时以正式上游文档为准 |
| L1 参考项目 | `granularity_reference_only` | 只比较章节、矩阵和证据粒度，不复制业务语义或协议数量 |

## 4. 设计取舍

| 方案 | 结论 | 取舍理由 |
|---|---|---|
| 以 current `00~04` 为唯一正式测试输入 | 采用 | 保证测试、验收和实施共享同一真相源，避免旧材料反向定义设计 |
| 继续沿用旧 `05` 的协议 / profile / TC / evidence 编号 | 放弃 | 旧文档属于 L1-artifact 口径且与 current Observability 协议、需求和配置不一致 |
| 以 `03` 的测试切口为主轴，再映射需求和验收 | 采用 | 详细设计已固定模块、协议、状态、UoW、redaction 和 no-write 切口，适合形成可落码测试 |
| 以需求 ID 为主轴、把详细设计只做附录 | 放弃 | 会遗漏 60 个 exact protocol、27 个状态 owner、flow 顺序和 typed error |
| 把上游 blocker 变成“暂时跳过”或默认通过 | 放弃 | 会遮蔽 I05 payload/binding、H13 和 affected closure 缺口；测试方案必须输出 blocked/conditional 语义 |
| 先定义外部产品和性能数字再设计测试 | 放弃 | 当前 `00` 明确这些是 historical/candidate；没有真实模型不能硬化为门禁 |

## 5. 结构化中间产物

### 5.1 Current 测试输入闭包

```text
00 requirements
  -> 01 ownership / dependency / runtime boundary
  -> 02 component / protocol / state outline
  -> 03 exact contracts / flows / UoW / error / config / telemetry / test cuts
  -> 04 typed config / profile / sensitivity / assembly / failure lifecycle
  -> 05 test scope / cases / data / environment / gates / evidence plan
  -> 06 acceptance decision contract
  -> 07 implementation phase and boundary contract
```

关键说明：

- 测试方案只能读取上游已定义的字段、状态、协议和边界，不能反向补设计。
- `05` 的 evidence 是 planned/candidate 输出，不能被解释成真实执行证据。
- `06` 和 `07` 的正式结论要在各自 full-restart 完成后回接，不能用旧文件提前填充。

### 5.2 Current ID 与协议基线

| 维度 | current 基线 | 测试输入规则 |
|---|---|---|
| 能力 | `C-OBS-1~5` | 五个核心能力均为 P0 设计主轴 |
| 核心功能 | `FR-OBS-001~013` | 全部进入需求追溯；外围增强单独标记 |
| 外围增强 | `FR-OBS-E01~E06` | 只做边界 / 风险验证，不进入核心通过条件 |
| 规则 | `BR-OBS-001~026` | 正向和违反行为均需可判定 |
| 数据归属 | `DO-OBS-001~034` | 验证 owner、body-free 和 no-truth-transfer |
| NFR | `NFR-OBS-001~024` | 无来源的硬阈值保持 candidate/planned |
| 验收 | `AC-OBS-001~031` | 由 `06` 裁决，`05` 只提供证据输入 |
| VETO | `VF-OBS-001~010` | 负向测试和静态检查必须可追溯 |
| Command | `16` | 以 current `03` §7.2 和 exact flow 为准 |
| Query | `14` | 以 current `03` §7.3 和 strict no-write 为准 |
| Inbound Consumer | `9` | 以 current `03` §7.4 和 producer/schema affected 为准 |
| Outbound Event | `12` | 以 current `03` §7.5 的 immutable snapshot / redaction 规则为准 |
| Operations Job | `9` | 以 current `03` §7.6 和 job report / UoW / recovery 规则为准 |
| 总协议数 | `60` | `16 + 14 + 9 + 12 + 9`;不得使用旧项目数量 |

### 5.3 测试证据和状态词边界

| 词语 | 本文允许含义 | 本文禁止含义 |
|---|---|---|
| `planned` | 设计阶段预留测试、artifact 或 report 形状 | 测试已经执行 |
| `candidate` | 尚待真实运行生成的 evidence 候选 | 真实 evidence alias |
| `blocked` | 受 upstream/affected/环境/设计缺口限制 | 已通过或可忽略 |
| `not_applicable` | 明确说明该切口不适用于当前范围 | 没有分析就跳过 |
| `not_run` | 尚未执行测试 | 通过 |
| `pass` | 仅用于设计门禁或静态文档检查有实际证据时 | 用于伪造运行测试、验收或实现完成 |

## 6. Current blocker / affected 输入

### 6.1 直接上游 blocker

本步没有新发现的上游 blocker。以下已有状态必须作为测试条件传播：

| ID | 状态 | 测试处置 |
|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | `open_upstream_internal` | I05 正向 payload 测试标记 `blocked/conditional`；只能测试本地拒绝和 schema 缺失处理，不反推 canonical payload |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | `open_upstream_internal` | I05 producer binding 正向路由不声明完成；保留 adapter/binding negative cut |
| `R06.6-F2-H13-UPSTREAM` | `open_controlled` | J06 仅测试 blocked/manual/zero-fabrication 分支；不测试未定义的 positive replay truth |

### 6.2 继承 affected register

以下项目不是本步新 blocker，也不能在测试方案中关闭；后续 Step 必须把它们绑定到 exact
测试切口、证据状态和 `06/07` gate：

| ID | 当前处置 |
|---|---|
| `R06-F-AFFECT-UOW-01` | 传播 accepted UoW 顺序、single cursor、completion 与 commit unknown 测试 |
| `S08-RECOVERY-CLASS-OWNER-01` | 传播 recovery class 的 exact owner 和可判定错误分支 |
| `R07-EXTERNAL-PHASE-LINK-01` | 传播 prepare/call/finalize phase link，禁止跨 phase 猜测 |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | 传播 retry accounting、Unknown/manual 和 no-blind-retry |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | 传播 Consumer 与 outbox 的最小能力边界 |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | 传播 indeterminate completion、receipt/result/report 关系 |
| `S08-JOB-REPORT-REF-OWNER-01` | 传播 Job report ref / output 的唯一 owner |
| `S08-M1-SECONDARY-TYPE-OWNER-01` | 传播 public protocol 二级类型的 owner、构造和序列化 |
| `03-RPR-S09-PER-FLOW` | 60 项 exact flow 必须逐项有切口；family 模板不能替代 |

### 6.3 测试方案对 affected 的统一规则

1. affected 未闭合时，测试方案可以定义负向、blocked、manual、candidate 或 conditional 场景，但不能定义
   使其“自动通过”的临时 schema、默认事件、fallback owner 或伪造结果。
2. 测试数据、环境和自动化门禁必须标明 affected 是否为前置条件；缺失时输出 `blocked` 或
   `not_evaluable`，不能输出 `pass`。
3. `06` 只能引用 planned/candidate evidence，并根据 affected 状态作最终裁决；`07` 必须将 affected
   绑定到 boundary 开工门禁。

## 7. 回填草稿

本步仅允许回填正式 `05` 的第 1 章“与上游文档的关系声明”。正式章节应保留以下收口结论：

> `05-测试方案.md` 以 current `00-需求文档.md` 至 `04-配置设计.md` 为唯一正式输入，承接需求、架构、概要、详细和配置中已冻结的能力、协议、状态、事务、错误、redaction、correlation、evidence linkage、retention marker、report handoff 和 no-write 边界。旧 README、旧正式 `05~07`、旧测试编号、旧 profile、旧产品栈和旧证据状态仅作为 historical material，不得进入 current 测试真相。测试方案提供 planned/candidate 测试与证据输入，`06` 负责验收裁决，`07` 负责实施阶段与 boundary 安排；本步不声明测试、验收或实现完成。

正式章节必须引用本文件，并指向“本步输入”“当前文档问题诊断”“结构化中间产物”“当前 blocker / affected 输入”和“回填草稿”。

## 8. 待确认事项

| ID | 待确认事项 | 当前状态 | 允许的测试处理 |
|---|---|---|---|
| `Q-05-01` | I05 canonical payload/schema、encoder、registration 和 producer binding 仍由上游提供 | inherited `open_upstream_internal` | 保留 blocked/negative/candidate，不反推 schema |
| `Q-05-02` | H13 replay scope mutation 的最终记录语义未闭合 | inherited `open_controlled` | 只测试 blocked/manual/zero-fabrication |
| `Q-05-03` | UoW、recovery、external phase、Consumer completion、Job report 和 secondary type affected 的最终实现 owner 仍需 downstream closure | inherited affected | 先建立切口和 gate，不关闭 affected |
| `Q-05-04` | 当前实现仓尚未建立，真实测试命令、真实 run id 和真实 artifact 路径不存在 | `not_established` | 只写 planned schema；不得伪造执行结果 |
| `Q-05-05` | 外部产品与硬性能阈值未被 current 需求冻结 | `candidate` | 保留非功能风险和未来验证触发条件 |

## 9. 进入下一步条件

| 检查项 | 结论 |
|---|---|
| current 输入文档清单明确 | `pass` |
| 旧文档和 README 已降级为 historical material | `pass` |
| 需求、协议和测试输入数量可追溯 | `pass`；`C-OBS-1~5`、`FR-OBS-001~013`、`16+14+9+12+9=60` |
| 直接上游 blocker 已登记 | `pass`；无新增 blocker，已有 blocker/affected 已传播 |
| 测试方案没有反向定义上游契约 | `pass` |
| 真实测试/evidence/验收/commit 是否存在 | `not_run/not_established`；没有伪造 |
| Step gate | `pass` |
| next_allowed_action | `start_current_05_step_02` |

## 10. 参考

- `standards/document/测试方案讨论流程_SOP.md` Step 01
- `standards/document/测试方案书写规范.md` §二、§三、§四
- `projects/L4-observability/00-需求文档.md`
- `projects/L4-observability/01-架构设计.md`
- `projects/L4-observability/02-概要设计.md`
- `projects/L4-observability/03-详细设计.md` §15~§17
- `projects/L4-observability/04-配置设计.md` §8~§13
- `projects/L4-observability/design-calibration/03_ddd_step_16_test_cuts.md`
- `projects/L4-observability/design-calibration/project_execution_ledger.md`
