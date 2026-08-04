# L4-observability 03-详细设计 Step 01 · 确认概要设计输入边界

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 01
> 回填章节: `03-详细设计.md` §1 与上游文档的关系声明;§17 风险与待确认事项
> 当前模式: full-restart
> 当前门禁: Step 01 完成后停审,等待用户确认后才进入 Step 02

## 1. Step 状态

| 项 | 内容 |
|---|---|
| 当前文档 | `03-详细设计.md` |
| 当前 Step | Step 01 `确认概要设计输入边界` |
| 输出文件 | `design-calibration/03_ddd_step_01_upstream_boundary.md` |
| flow 文件 | `design-calibration/03_ddd_calibration_flow.md` |
| Step 状态 | done |
| 正式回填状态 | blocked_until_step_19 |
| gate_status | pass |
| next_allowed_action | wait_user_confirmation_before_step_02 |

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 01 | 已读取 | 约束本步只确认概要设计输入边界,输出上游关系、本文不再回答、本文必须回答和输入不足风险 |
| `standards/document/详细设计书写规范.md` 5.1 / 5.17 | 已读取 | 约束正式 §1 与 §17 的输出形态,本步只形成回填草稿 |
| `standards/document/设计文档讨论中间产物规范.md` | 已读取 | 约束逐 Step、旧材料 historical material、flow / 台账同步和正式文档追溯 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已读取 | 约束继续任务恢复、唯一 truth source、实现前闭环和不得由实现侧私补设计 |
| `projects/L4-observability/design-calibration/project_execution_ledger.md` | 已读取 | 确认 `02` 已完成正式装配,用户已确认进入 `03` |
| `projects/L4-observability/design-calibration/02_hld_calibration_flow.md` | 已读取 | 确认 `02` Step 01~14 均 pass,下一步允许进入 `03` |
| `projects/L4-observability/00-需求文档.md` | 当前正式需求基线 | 作为需求约束来源,本步不重写需求 |
| `projects/L4-observability/01-架构设计.md` | 当前正式架构基线 | 作为架构约束来源,本步不重写架构 |
| `projects/L4-observability/02-概要设计.md` | 当前正式概要基线 | 作为 `03` 的直接输入 |
| `02_hld_step_12_detailed_design_handoff.md` | 当前概要承接产物 | 提供 `03` 必须继续展开的契约清单 |
| `02_hld_step_13_risks_open_questions.md` | 当前概要风险产物 | 提供 `03` 不得误收为已确认契约的风险和待确认事项 |
| `02_hld_step_14_formal_document_assembly.md` | 当前概要正式装配产物 | 提供正式 `02` 的校准来源和旧材料处理口径 |
| 旧 `03-详细设计.md` 与旧 `03_ddd_*` | historical material | 只用于问题诊断,不得作为当前详细设计 truth source |
| `projects/L1-governance`、`projects/L1-artifact`、`projects/L0-bus` 的 `03` 与 Step 01 | 参考粒度 | 只参考粒度和结构,不复制业务 truth |

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取详细设计 Step 01 标准、书写规范、台账和当前 `02` 输入 | done | 本文件 §2 |
| 回答 SOP Step 01 五个问题 | done | 本文件 §4 |
| 诊断旧 `03` 与旧 `03_ddd_*` 的历史材料问题 | done | 本文件 §5 |
| 输出改动前后对比和设计取舍 | done | 本文件 §6~§7 |
| 输出上游关系映射表、本文不再回答、本文必须回答和输入不足风险清单 | done | 本文件 §8 |
| 形成正式 §1 / §17 回填草稿 | done | 本文件 §9 |
| 完成自检、flow / 台账同步和 Step 02 门禁 | done | 本文件 §10~§11 |

## 4. SOP 问题回答

### 4.1 当前详细设计直接承接概要设计中的哪些结论?

当前 `03-详细设计.md` 直接承接正式 `02-概要设计.md` 已收稳的以下结论:

- 10 个业务主要组成部分:
  `Observation Intake and Safety`、`Correlation and Safe Signal`、`Audit Projection and Body-free Evidence Linkage`、`Report Handoff and Authenticity`、`Retention, Replay and No-write Guard`、`Read Query and Diagnostic Consumption`、`Gap and Degraded Expression`、`Peripheral Consumption and Export`、`Product-neutral Adapter and Reference Support`、`Derived Maintenance and Replay Coordination`。
- 实现分层:
  Inbound、Operations、Application Services、Domain Model、Domain Policy、Ports、Persistence、Projection、Outbox / Handoff。
- 入口、service、policy、store、port、job 和 read model 主体:
  `ObservationSyncEntry`、`ObservationAsyncMaterialConsumer`、10 个 application services、truth / projection / reference / outbox stores、reference ports、maintenance jobs。
- Step 06 已正式化的关键对象族:
  truth / signal / audit、truth guard / consumption、policy / invariant / guard、projection / read model、reference / boundary / context、audit / history / change / execution record。
- Step 07 已收稳的五类接口骨架:
  Command、Query、Inbound Event Consumer、Outbound Event、Operations Job。
- Step 08 已收稳的 10 组处理流族:
  intake / safety、correlation / safe signal、audit / evidence linkage、report handoff、retention / replay / no-write、read / diagnostic、gap / degraded、peripheral / export、reference snapshot、outbox / maintenance。
- Step 09 已收稳的 11 组状态族:
  intake / safety admission、correlation / safe signal / rollup、audit projection / evidence linkage、report handoff / authenticity、retention / active protection、replay / no-write guard、read / diagnostic、gap / degraded、peripheral / export、reference snapshot / adapter、maintenance / publication。
- Step 10 / Step 11 已收稳的异常边界和配置影响轮廓:
  forbidden body、redaction-first、body-free evidence、query no-write、consumer non-truth-write、job no-source-repair、handoff non-signoff、retention active protection、产品中立和禁止配置化红线。

### 4.2 概要设计中的代码主体框架是否已经足够稳定?

足够稳定,可以进入详细设计。正式 `02` 已经把业务主要组成部分与实现分层区分清楚,并给出每个组成部分的主要代码主体、非职责和跨部分接缝。`03` 可以继续把这些主体落为 module、file、struct、enum、trait、repository、adapter、service 函数、transaction boundary 和测试切口。

稳定并不代表详细设计可以改写概要主语。若后续 Step 发现需要新增 / 删除 / 合并业务主要组成部分、改变接口读写性质、改变状态组、允许 Query 写状态、让 Job 修 source truth、让 Consumer 接管外部 truth、让外部产品成为 truth source,必须回退 `02` 对应 Step 或更上游 `00/01`。

### 4.3 概要设计中的关键对象、接口骨架、处理流和状态机是否足够继续展开?

足够进入详细设计。当前 `02` 已经提供:

- 对象主语:每个主要组成部分都有关键对象、对象类型、关键字段 / 函数骨架和禁止事项。
- 接口主语:每个 Command / Query / Consumer / Outbound Event / Job 都有输入骨架、输出骨架、本地结果和边界。
- flow 主语:每个处理流族都有入口接口、关键函数 / 数据流骨架、关键对象和边界。
- 状态主语:每个状态族都有承载对象、主要触发、核心状态、状态流转图和禁止迁移摘要。
- 承接清单:正式 `02` §12 明确要求 `03` 展开对象字段、DTO、port / repository trait、函数级处理流、事务、一致性、错误、幂等、配置引用、测试切口和实施承接。

因此本步不需要返回 `02` 补齐概要设计。后续详细设计必须下沉到可落码粒度,不能停留在当前概要骨架。

### 4.4 哪些内容仍停留在概要设计轮廓,进入详细设计前必须补清?

以下内容是详细设计必须补清的实现契约,不构成 Step 01 上游 blocker:

| 仍是轮廓的内容 | `03` 必须补清 |
|---|---|
| 目录 / crate / module / file 布局 | 选择单 crate 模块分层或 workspace 多 crate,定义目录、package、crate、binary、module 和 owner |
| 关键对象 | 完整 struct / enum / value object、字段类型、Rustdoc 注释、factory、member function、状态字段、不变量和 DomainError |
| typed ref / summary / reason / cursor / marker | exact Rust-facing carrier、owner family、字段、来源、禁止替代和 fake / durable parity |
| Command / Query / Consumer / Event / Job | request / response / receipt / view / event payload / job input / report DTO schema、schema version、metadata、idempotency 和 error surface |
| port / repository / adapter | trait 名称、函数签名、参数类型、返回类型、错误类型、事务参与方式和测试 double 切口 |
| 函数级 flow | handler -> service -> domain -> repository / port -> outbox / projection / result 的调用链、save order 和异常分支 |
| 状态机 | 正式 enum、variant 语义、初始态、终态、允许 / 禁止迁移矩阵、触发函数和非法迁移错误 |
| 持久化与一致性 | UoW、expected version、idempotency record、stored result、history、outbox、projection stale marker 和 duplicate replay |
| 错误与恢复 | error taxonomy、response mapping、quarantine、dead-letter、retry cut、recovery cut 和 degraded / not-visible / unavailable surface |
| 配置引用 | config owner、loader、validator、builder 注入、adapter/job/read/consumer/publisher/handoff config 类型和禁止配置化校验 |
| 测试切口 | 模块、DTO、state transition、query no-write、forbidden body、body-free evidence、consumer duplicate、job no-source-repair、config negative gates |

### 4.5 哪些需求或架构结论会影响详细设计,但不能在详细设计中重新定义?

以下结论只能承接,不得在 `03` 中重新定义:

- `L4-observability` 只拥有 observation-owned facts、audit projections、body-free evidence linkage、safe signal、read / diagnostic surfaces、report handoff markers、retention markers、no-write violation 和派生维护状态。
- 本仓不拥有 Governance truth、Artifact / evidence body、Identity truth、Runtime / Sandbox execution truth、Archive package truth、Console / external product truth 或任何业务 source truth。
- redaction-first 是所有入仓、输出、投影、handoff 和 export 的前置门禁。
- forbidden body 必须 rejected / quarantined / body-blocked,不得通过 DTO、event、store、query、handoff 或 export 入仓。
- correlation id、trace id、span id、causation id 和 opaque business hint 只能服务观察关联,不得反推出业务 truth。
- Evidence linkage、audit projection、report handoff 和 evidence index input 只能 body-free,不得保存 evidence / artifact / governance / identity / runtime 正文。
- Query no-write、Consumer non-truth-write、Job no-source-repair、Replay observation-side-only、report handoff non-signoff 和 retention marker non-cleanup 均为红线。
- `L0-core` 是唯一编译期核心依赖;其他 sibling repo 通过 runtime event、safe ref、summary、snapshot、port、adapter 或 handoff 协作。
- 外部 APM、OTel、Prometheus、Grafana、TimescaleDB、object store、dashboard、alert、GRC、external audit 产品只能是 adapter / storage / display / export 候选,不能定义 truth。
- 真实 `run_id`、真实 evidence alias、真实测试结果、验收签署和 implementation commit 只能来自真实执行与后续验收 / 实施流程,设计文档不得伪造。

## 5. 当前文档问题诊断

| 材料 | 诊断 | 本轮处理 |
|---|---|---|
| 旧正式 `03-详细设计.md` | 约 456 行,明显不足以承接当前正式 `02` 的对象、接口、flow、状态、事务、错误、配置和测试切口;正文包含旧 log / metric / trace schema 先行心智 | 降级为 historical material;正式 `03` 只能在 Step 19 按 Step 01~18 当前产物重建 |
| 旧 `03_ddd_calibration_flow.md` | 全 Step 直接标 `pass`,下一动作使用旧自动顺推口径,不符合当前用户要求的逐 Step 停审 | 已替换为当前 full-restart flow,只允许 Step 01 pass 后等待用户确认 Step 02 |
| 旧 `03_ddd_step_01_upstream_boundary.md` | 只有 81 行,将 `NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection` 等旧 schema 写成结构化产物,但未承接当前正式 `02` 的 10 个组成部分和对象族 | 已替换为当前 Step 01 产物 |
| 旧 `03_ddd_step_02` ~ `03_ddd_step_19` | 文件存在但来自上一轮粗糙自动流程,不能代表当前 Step 已完成 | 保留为 historical material,等进入对应 Step 时逐个替换 |
| 旧 `04~07` 与旧 implementation ledger / boundaries | 未经当前 `03` 重建,不能作为配置、测试、验收或实现移交依据 | 继续 historical material;不得提前创建新 implementation ledger / planned boundaries |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| `03` 工作台状态 | 旧 flow 显示 Step 01~19 全部 pass | 当前 flow 只承认 Step 01 pass,Step 02~19 均等待逐 Step 确认 | 符合用户要求和中间产物规范 |
| Step 01 输入 | 旧 Step 01 主要沿用旧 schema 和旧 README 心智 | 当前 Step 01 直接承接正式 `00/01/02`、`02` Step 12~14 和当前项目台账 | 保持真相源顺序 |
| 旧正式 `03` 地位 | 可能被误当作可继续修补的详细设计基线 | 只作为 historical material 诊断输入 | 避免旧口径残留 |
| 正式 `03` 写入时机 | 旧流程已装配正式文档 | 当前正式 `03` 必须等 Step 19 才能重建 | 每章必须可追溯到具体 Step 中间产物 |
| 上游 blocker 判断 | 旧流程未逐项判断当前正式 `02` 是否足够 | 当前明确 `02` 足以支撑进入 `03`,但后续 exact contract 必须由 Step 02~18 闭口 | 防止把概要轮廓误当最终实现契约 |

## 7. 设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否沿用旧正式 `03` | 不沿用 | 旧正文粒度低于当前 `02` 承接要求,且旧 schema / 自动门禁残留明显 |
| 是否直接重写正式 `03` | 不重写 | 详细设计 SOP 要求 Step 中间产物先行,正式文档只能在 Step 19 装配 |
| 是否删除旧 Step 02~19 文件 | 暂不删除 | 未来 Step 不得提前批量落盘;当前仅记录 historical material,进入对应 Step 时替换 |
| 是否把待确认事项写成 blocker | 不写成 Step 01 blocker | 当前 `02` 已足以进入详细设计;待确认项是后续 Step / `04~07` 必须闭口的实现前风险 |
| 是否把产品、P95、retention days、hash chain 等旧材料升级为当前输入 | 不升级 | 当前正式 `02` 已明确这些是 historical material 或后续确认项 |

## 8. 结构化中间产物

### 8.1 上游关系映射表

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `projects/L4-observability/00-需求文档.md` | 仓定位、核心能力闭环、forbidden body、body-free evidence linkage、report handoff、retention marker、active reference protection、query / consumer / job no-write、验收红线 | 把需求红线落到对象不变量、DTO 校验、函数分支、错误模型、状态机、测试切口和实现承接清单 |
| `projects/L4-observability/01-架构设计.md` | 职责边界、上下文划分、依赖裁剪、数据所有权、一致性分层、产品中立适配、运行承载和演进边界 | 把架构边界落到 module / crate、port / adapter、repository、transaction、event / handoff、projection、outbox 和配置绑定 |
| `projects/L4-observability/02-概要设计.md` §4~§12 | 代码主体框架、10 个主要组成部分、关键对象轮廓、五类接口骨架、10 组处理流、11 组状态族、异常边界、配置影响和详细设计承接清单 | 展开为文件布局、模块契约、对象契约、trait / port / adapter 契约、协议 schema、函数级 flow、状态矩阵、持久化、错误、幂等、配置引用、测试切口和实施承接 |
| `projects/L4-observability/02-概要设计.md` §13 | 设计风险和待确认事项,包括 SafeSignal 拆分、external audit export 落点、outbox publication、diagnostic freshness、read access、产品选型、旧指标和 implementation boundary 重建 | 在 `03` 风险输入中保留;能在详细设计闭口的由 Step 02~18 收敛,不能闭口的移交 `04~07` 或 ADR |
| `projects/L4-observability/design-calibration/02_hld_step_12_detailed_design_handoff.md` | `03` 必须继续展开的对象、接口、flow、状态、异常、配置和测试承接矩阵 | 作为 Step 02~18 的直接任务入口,不得被实现侧自行补全 |
| `projects/L4-observability/design-calibration/02_hld_step_13_risks_open_questions.md` | 风险、待确认事项、实现前会阻塞的事项和保守处理口径 | 作为详细设计风险输入和后续 `04~07` 追踪入口 |
| 旧 `README.md`、旧正式 `03-详细设计.md`、旧 `03_ddd_*` | 旧产品、旧性能、旧 schema、旧自动门禁、旧 implementation boundary | 只作为 historical material 和反例诊断,不作为当前详细设计来源 |

### 8.2 本文不再回答

- `L4-observability` 是否是业务 truth owner、Governance truth owner、Artifact / evidence body owner、Identity truth owner、Runtime / Sandbox execution truth owner、Archive package truth owner 或 external product truth owner。
- forbidden body、raw payload、secret、credential、source audit body、evidence body、artifact body、governance decision body、identity body、runtime body、provider response body 或 archive package body 是否可以入仓。
- Query、diagnostic、read model、projection rebuild、replay、retention、handoff、external export、consumer 或 operations job 是否可以反写 source truth。
- correlation id、trace id、span id、causation id 或 opaque hint 是否可以替代业务主键或业务事实。
- report handoff、authenticity hint、evidence index input 是否可以生成 final verdict、真实 evidence alias、真实 run id、真实验收 signoff。
- 外部 APM、OTel、Prometheus、Grafana、TimescaleDB、dashboard、alert、GRC 或 external audit 产品是否是核心 truth source。
- 是否允许非 `L0-core` sibling repo 成为核心语义编译期依赖。
- 需求目标、架构上下文、主要组成部分、接口类别、处理流族、状态族、异常红线和配置不可越界边界是否重新定义。

### 8.3 本文必须回答

- 当前实现单元、目录、crate / module / file / binary 如何布局,以及如何映射 10 个业务主要组成部分和实现分层。
- 每个模块包含哪些 capability、对象、trait、adapter、repository、service 函数、错误类型和测试切口。
- 每个 struct / enum / value object / policy / service / repository / port 的字段、函数、参数、返回类型、错误和不变量。
- 每个 Command / Query / Consumer / Outbound Event / Job 的 DTO、二级公开类型、metadata、idempotency、stored result、receipt、view、event payload、job report 和 error surface。
- 每条处理流的函数级调用链、validation、load、domain transition、save order、outbox、projection stale marker、history、stored result、事务边界和异常分支。
- 每个状态机的状态主语、enum variant、允许 / 禁止迁移、触发函数、非法转换错误、并发冲突和恢复口径。
- 持久化、事务、一致性、并发、幂等、重入、配置引用、外部依赖绑定、可观测性与审计埋点如何成为可落码契约。
- `03` 如何把测试切口和实施承接清单交给 `05/06/07`,并明确 `07` 才创建 implementation ledger 和 planned boundary skeleton。

### 8.4 输入不足风险清单

| 风险 | 当前影响 | 处理方式 | 是否阻塞 Step 02 |
|---|---|---|---|
| 旧正式 `03` 粒度过低,可能诱导后续继续写薄摘要 | 影响对象、协议、flow、状态和事务可落码性 | 当前降级为 historical material;后续重 Step 必须按模块 / 协议族 / flow / 状态机分批 | 不阻塞 |
| `SafeSignal` 是否拆成 log / metric / trace 三套 exact 类型仍未闭口 | 影响对象契约、DTO、query、rollup、projection 和 adapter | Step 02 明确范围,Step 06 / 08 / 10 闭口;不得改变统一 `SafeSignal` 主语 | 不阻塞 |
| `ExternalAuditExportPreparation`、`OutboxPublicationState`、`DiagnosticFreshnessState`、`ReadAccessRecord` 的承载位置未定 | 影响对象归属、状态矩阵、持久化和处理流 | 在 Step 05~11 中闭口;若需要新增概要对象则回退 `02` Step 06 / 09 | 不阻塞 |
| Query response 中 restricted / redacted / not-visible / unavailable / degraded 字段组合未定 | 影响协议 schema、read visibility、测试断言和验收门禁 | Step 08 / 12 / 16 闭口;不得合并语义 | 不阻塞 |
| 产品、P95 / P99 / SLO、retention days、batch、retry、digest / canonicalization 未定 | 影响配置、测试、验收和实施计划 | `03` 只定义代码读取 / 注入 / 校验契约;具体值进入 `04~07` 或 ADR | 不阻塞 |
| implementation ledger 和 planned boundary skeleton 尚未重建 | 影响实现移交 | 必须等 `07-实施计划.md` 完成时创建,当前 `03` 不创建 | 不阻塞 |

## 9. 回填草稿

### 9.1 正式 §1 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_01_upstream_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“输入不足风险清单”和“回填草稿”小节,了解详细设计如何从当前正式 `02-概要设计.md` 承接输入边界。

本详细设计承接当前正式 `00-需求文档.md` 的仓定位、数据归属和验收红线,承接当前正式 `01-架构设计.md` 的职责边界、依赖方向、数据所有权、一致性和产品中立边界,并以当前正式 `02-概要设计.md` 的代码主体框架、10 个主要组成部分、关键对象、五类接口骨架、10 组处理流、11 组状态族、异常边界、配置影响和详细设计承接清单作为直接输入。

本文不重新定义需求目标、系统上下文、业务 truth ownership、主要组成部分、接口类别、处理流族或状态族。本文继续展开 module / file 布局、对象字段、函数签名、DTO schema、trait / port / adapter、函数级 flow、状态矩阵、持久化、事务、错误、幂等、配置引用、观测 / 审计埋点、测试切口和实施承接。

### 9.2 正式 §17 风险输入草稿

| 风险 | 影响 | 缓解方式 | 负责人 / 待确认方 |
|---|---|---|---|
| 旧 `03` 与旧 `03_ddd_*` 被误用为当前实现契约 | 实现者可能沿用旧 schema、旧自动门禁或旧薄正文 | 当前 flow 和 Step 01 已降级为 historical material;正式 `03` 等 Step 19 重建 | 设计文档维护者 |
| 概要层待确认事项被写成已确认 exact contract | 可能影响 SafeSignal、export、outbox、freshness、read access、产品和指标边界 | 进入对应 Step 时逐项闭口;不能闭口则进入 §17 / `04~07` | 设计文档维护者 |
| `03` 若未闭合对象、DTO、port、状态、事务、错误和测试切口即移交实现 | 实现侧会私补设计 truth,破坏可落码性 | Step 02~18 必须按中间产物逐步闭口;Step 19 才装配正式文档 | 设计文档维护者 |

## 10. 自检

| 检查项 | 结果 |
|---|---|
| 是否读取项目台账、`03` flow、当前 `02` 和本 Step 标准 | pass |
| 是否只确认概要设计输入边界,未提前展开 Step 02~18 | pass |
| 是否输出上游关系映射表 | pass |
| 是否输出 `本文不再回答` 清单 | pass |
| 是否输出 `本文必须回答` 清单 | pass |
| 是否输出输入不足风险清单 | pass |
| 是否把旧正式 `03` 和旧 `03_ddd_*` 标记为 historical material | pass |
| 是否避免伪造实现 commit、真实 run id、真实 evidence alias、验收签署或测试结果 | pass |
| 是否保持正式 `03` 到 Step 19 才装配 | pass |
| 是否需要回退 `02` | no |

## 11. 门禁

| 门禁 | 状态 | 说明 |
|---|---|---|
| 上游输入门禁 | pass | 当前正式 `02` 足以支撑进入详细设计 Step 02。 |
| Step 01 产物门禁 | pass | 已形成 SOP 要求的四类输出和正式回填草稿。 |
| 正式文档回填门禁 | blocked_until_step_19 | 本步不改正式 `03-详细设计.md`。 |
| 下一步门禁 | wait_user_confirmation_before_step_02 | 用户确认后才能进入 Step 02。 |
| 上游 blocker | none | 未发现阻塞 `03` Step 02 的上游 blocker。 |
