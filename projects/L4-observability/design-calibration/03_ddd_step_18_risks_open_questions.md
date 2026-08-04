# L4-observability 03-详细设计 Step 18 · 风险与待确认事项

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 18
> 回填章节: `03-详细设计.md` §17 风险与待确认事项
> 当前模式: `full-restart`
> 本步边界: 只收口 Step 01~17 仍未关闭的问题及其保守处理口径,不新增对象、协议、状态、配置值、测试结果或实施 boundary

## 1. Step 状态

| 项 | 内容 |
|---|---|
| 当前正式文档 | `projects/L4-observability/03-详细设计.md` |
| 当前 Step | Step 18 `风险与待确认事项` |
| 输出文件 | `projects/L4-observability/design-calibration/03_ddd_step_18_risks_open_questions.md` |
| 上游完成状态 | Step 01~17 均有 current 设计记录；Step 09~17 为 `completed_design_record_with_affected_open` |
| 用户确认 | 已授权一次完成 M3,本 Step 完成后只允许顺序进入 Step 19 |
| 本步写入状态 | `completed_design_record_with_affected_open` |
| 本步自检状态 | `pass_with_affected_open` |
| 正式回填状态 | `blocked_until_current_step_19` |
| gate_status | `pass_with_affected_open` |
| next_allowed_action | `continue_M3_step_19_under_current_user_authorization` |
| 本步新发现上游 blocker | `none` |
| 既有 blocker / affected | I05 两项=`open_upstream_internal`;H13=`open_controlled`;其余 9 项 inherited affected 保持开放；详见 §9.3 |
| implementation readiness | `blocked`;详见 §11,不构成当前设计上游 blocker |

### 1.1 Step 内分批计划与停审记录

| 批次 | 范围 | 写入状态 | 批次结论 | 后续承接 |
|---|---|---|---|---|
| `18.0` | 标准、上游、Step 01~17、历史材料和参考粒度审计 | done | 当前输入足够;旧 81 行 Step 18 只作 historical diagnosis | `18.1` |
| `18.1` | SOP 问题回答、当前文档诊断、风险分类和已关闭事项 | done | 风险、待确认、implementation precondition 与普通后续任务已分开 | `18.2` |
| `18.2` | Step 01~17 风险来源覆盖、风险表和待确认事项表 | done | 所有仍开放事项均有稳定 ID、影响、阻塞范围、owner 和保守口径 | `18.3` |
| `18.3` | 未确认前处理规则、Step 19 装配输入与正式 §17 回填草稿 | done | 未把未确认事项脑补为正式契约,也未把实现前置条件误报为上游 blocker | `18.4` |
| `18.4` | 静态自检、门禁与恢复点 | done | 风险登记完成；当前 M3 授权下只允许进入 Step 19 | `19.0` |

本文件的 `pass_with_affected_open` 只表示风险登记、affected 阻塞范围和未确认前处理口径已经闭合。它
不表示既有 blocker 已关闭,不表示正式 `03-详细设计.md` 已装配,不表示当前轮 `04~07` 已重建,也不
表示目标实现仓、脚本、测试、artifact、report、evidence、verdict 或签署已经存在。

## 2. 本步目标与非目标

### 2.1 目标

1. 汇总 Step 01~17 中仍可能影响正式装配、下游文档、实现 boundary、production integration 或验收裁决的问题。
2. 区分已关闭设计问题、开放风险、待确认事项、implementation precondition、普通后续任务和违反既有 invariant 的 blocker。
3. 为每项开放问题写明影响、触发条件、阻塞范围、缓解方式、负责人或待确认方以及未确认前处理方式。
4. 明确本步没有发现新的上游 blocker,同时如实保留 I05、H13 和其余 inherited affected,并区分它们与 implementation readiness。
5. 为 Step 19 装配正式 §17 提供唯一风险输入,避免旧 README、旧正式 `03~07` 或旧 Step 18 回流。

### 2.2 非目标

- 不在本步重新设计 Step 06 对象、Step 07 port、Step 08 协议、Step 09 flow、Step 10 状态或 Step 11~15 横切契约。
- 不选择数据库、消息、HTTP / RPC、OTel、Prometheus、Grafana、TimescaleDB、对象存储、dashboard、alert、GRC 或 external audit 产品。
- 不固定配置 key、环境变量、endpoint、topic、schedule、secret provider、retention days、lease、retry、backoff、capacity 或 SLO 数值。
- 不创建目标实现仓、源码、配置、migration、脚本、测试、fixture、CI、artifact 或 report。
- 不创建或刷新 `implementation_execution_ledger.md` 与 `implementation-boundaries/*`;这些产物只能在当前轮 `07-实施计划.md` 完成时统一创建。
- 不伪造实现 commit、真实 `run_id`、真实 evidence alias、测试结果、验收 verdict、风险接受、signoff 或签署。
- 不修改正式 `03-详细设计.md`;正式装配只能由顺序完成本 Step 后的 Step 19 执行。

## 3. 本步输入与采用方式

### 3.1 规范输入

| 输入 | 采用方式 |
|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 18 | 约束本步输出风险表和待确认事项表,并要求全部未关闭项具有影响范围与未确认前处理方式 |
| `standards/document/详细设计书写规范.md` 5.17 | 约束正式 §17 的表格与阻塞范围表达,禁止把不确定项脑补为正文契约 |
| `standards/document/设计文档讨论中间产物规范.md` | 约束 Step 状态、问题回答、诊断、前后对比、取舍、结构化产物、回填草稿和逐 Step 停审 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 约束未闭环字段、DTO、状态、测试、evidence 或 boundary 必须回设计,不得留给实现者自行补设 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 约束 `L0-core` 唯一编译期核心依赖与非 core sibling 的运行期 / event 协作边界 |

### 3.2 项目与上游输入

| 输入 | 当前身份 | 本步采用方式 |
|---|---|---|
| 当前正式 `00-需求文档.md` §15 | current baseline | 复核 truth ownership、forbidden body、historical material、产品和量化目标风险 |
| 当前正式 `01-架构设计.md` §15 | current baseline | 复核 observation-only、产品中立、依赖裁剪、retention、no-write 和外围一致性风险 |
| 当前正式 `02-概要设计.md` §13 | direct upstream | 复核概要阶段开放问题在 Step 05~17 中的关闭或保留状态 |
| `02_hld_step_13_risks_open_questions.md` | upstream risk artifact | 提供概要风险来源、保守口径和不得误收为 exact contract 的候选项 |
| 当前 `03` Step 01~16 | current detailed-design truth | 逐 Step 提取已关闭项、后移项、风险和测试切口 |
| `03_ddd_step_17_implementation_handoff.md` §12~§15 | direct input | 提供跨文档复核结果、implementation precondition、`07` 审计输入和 Step 18 必判事项 |
| `03_ddd_calibration_flow.md` | document ledger | 提供当前 Step 门禁和 historical material 处理状态 |
| `project_execution_ledger.md` | project ledger | 提供项目恢复点、正式文档顺序和全局 blocker 状态 |

### 3.3 Historical material 与参考粒度

| 输入 | 诊断 | 当前处理 |
|---|---|---|
| `projects/L4-observability/README.md` | 仍以 OTel Collector、TimescaleDB、对象存储、Grafana、哈希链、DORA / EBM、旧 P95 和冷存年限为确定主线,与当前 observation-only、body-free 和产品中立基线冲突 | `historical_material`;只登记污染风险,不继承任何产品、数字、目录或开放问题结论 |
| 当前磁盘 `03-详细设计.md` | 4990 行 pre-M2 Step 19/R2 装配稿,章节主体有可复核来源,但 completion wording、accepted UoW 顺序、Step 16~18 和 inherited affected 状态早于本轮 M2/M3 | `historical_material_pending_current_step_19_reassembly`;Step 19 只保留经 current Step source matrix 验证的正文并替换所有 stale 结论 |
| 旧正式 `04~07`、旧 implementation ledger / boundaries | 与当前 full-restart 设计链不一致或创建时点无效 | `historical_material`;按正式文档顺序逐份重建,ledger / skeleton 只在当前轮 `07` 完成时创建 |
| 旧 Step 18 | 仅 81 行,把 schema 摘要误当风险产物,没有稳定 ID、阻塞范围、owner、来源覆盖或未确认前处理规则 | 全量替换;旧 `pass` 和自动顺推门禁不继承 |
| L1-governance / L1-artifact / L1-identity Step 18 | 198 / 228 / 422 行 | 只参考风险分层、关闭项排除、表格粒度和停审方式,不复制相邻域 truth |

## 4. SOP 问题回答

### 4.1 哪些问题仍可能影响代码实现?

仍会影响实现的事项集中在五类:

1. **正式基线与历史污染**:正式 `03` 尚未装配,当前轮 `04~07` 尚未重建,README 和旧正式文档仍可能把产品、旧对象、旧指标或旧 boundary 带回当前链路。
2. **实现环境与物理绑定**:目标实现仓尚不存在;物理持久化、DDL、transport route / topic / RPC / schedule、secret provider 和真实 adapter 产品尚未绑定。
3. **外部副作用能力**:真实 publisher / handoff / export adapter 是否支持稳定 idempotency namespace、same-token probe、historical binding resolution 和安全 rotation 尚待实证。
4. **量化和执行门禁**:retention / lease / retry / backoff 等数值以及 performance / capacity / SLO 尚无当前稳定来源;正式测试、验收和 phase / commit boundary 尚未建立。
5. **Inherited affected**:I05 payload/schema 与 producer binding、H13、accepted UoW、recovery owner、external phase、Consumer completion/outbox、Job report ref、secondary type owner 和 per-flow quality 均会阻塞引用它们的 positive boundary。
6. **实现漂移**:reserved transition 被提前暴露、Command / Job 同名操作被按 route 字符串猜测、forbidden body 或业务 truth 被写入本仓,都会直接破坏已闭合契约。

### 4.2 哪些问题会阻塞实现,哪些只影响后续优化?

- 本步没有发现新的上游 blocker,也没有要求回退当前正式 `00/01/02` 的新冲突；这不等于既有 blocker 归零。
- I05 payload/schema 与 producer binding 是既有 `open_upstream_internal`,阻塞 I05 decode / registration / accepted positive path；H13 是既有 `open_controlled`,阻塞 J06 positive execution / completion。两者当前只能走 reserved / Blocked / manual / zero-write 路径。
- 其余 inherited affected 逐项阻塞引用它们的 activation boundary；聚合事实保持 `60/60` 有设计记录、`0/60` 无条件完成。
- 正式 `03` 未装配会阻塞正式详细设计移交;当前轮 `04~07`、逐 boundary 审计、implementation ledger / skeleton 未完成会阻塞实现 kickoff。
- 目标实现仓不存在会阻塞代码写入、编译、测试和 commit,但不阻塞设计文档继续收口。
- 物理 store、transport 和 adapter capability 未定只阻塞对应 durable / integration / external-effect boundary,不推翻 contracts / domain / application 的产品中立契约。
- performance / capacity / SLO 未定只阻塞相应 NFR 最终通过裁决,不阻塞功能详细设计。
- dashboard、sampling、外围产品和 README 同步若不被写成核心 truth,属于后续绑定或文档同步,不构成当前设计 blocker。
- forbidden body 入仓、反写 source truth、reserved transition 提前实现、blind retry 或伪造 evidence 不是“待优化”,而是受影响 boundary 的立即 blocker / veto。

### 4.3 每个待确认事项需要谁确认?

确认责任按 truth owner 分配:详细设计维护者负责 Step 19 和命名 / historical 清理;配置设计维护者负责 key、profile、数值、activation 和 binding lifecycle;架构 / infra / 运维及相邻仓负责人负责产品与真实 capability;测试和验收维护者负责 NFR、fixture、artifact、evidence 与裁决;实施计划维护者负责 phase / commit boundary、spike、ledger 和 skeleton;目标实现 agent 只负责核实实现仓现实,无权替这些 owner 发明契约。

### 4.4 未确认前实现者应该如何处理?

未确认前不得正式开工。后续进入实现阶段后,若某一 boundary 仍缺正式来源,实现者必须停止该 boundary,记录 exact 缺口、影响与安全停止点,回到对应 `03/04/05/06/07` 收口。产品未定时只能使用正式设计允许的 fake / in-memory / disabled / controlled 语义;capability 不足时必须 fail closed 或转 manual;任何场景都不得用旧文档、默认数字、字符串 route、blind retry、private fixture、临时 schema 或虚构 evidence 填空。

## 5. 当前文档问题诊断与改动前后对比

| 诊断面 | 旧 Step 18 / 旧链路问题 | 当前重建处理 |
|---|---|---|
| 产物类型 | 以 log / metric / trace / audit schema 摘要替代风险登记 | 只登记 Step 01~17 仍开放风险和待确认事项;exact schema 继续归 Step 06~15 |
| 来源覆盖 | 未逐项核对概要风险和 Step 01~17 后移项 | 建立已关闭项表、逐 Step 来源覆盖表和稳定风险 ID |
| 风险 / 问题边界 | 风险、设计结论、历史缺口和普通任务混写 | 区分风险、待确认、implementation precondition、普通后续任务和 invariant violation |
| 阻塞判断 | 只有笼统 `pass`,没有说明阻塞哪个阶段 | 每项写明 formal assembly、downstream、kickoff、boundary-specific、production 或 acceptance 范围 |
| 未确认前处理 | 没有 owner、确认时点或安全默认 | 每项明确 owner、确认时点和 fail-closed / stop / defer 口径 |
| Historical material | 继续复述 `NormalizedLogRecord`、`MetricPoint` 等旧对象,可能与当前 `SafeSignal` 主线冲突 | README、旧正式 `03~07` 和旧 Step 18 全部保持 historical material |
| 实施资产 | 未说明 ledger / skeleton 的唯一创建时点 | 明确只能在当前轮正式 `07` 完成时一次创建全部 planned skeleton |
| 真实性 | 只泛称不伪造证据,未区分 planned 与 real | 明确 scripts、artifact、report、evidence、verdict、signoff 当前均不存在且不得静态伪造 |
| Step 门禁 | `next_step_or_formal_assembly` 自动顺推 | 当前 M3 授权只允许本 Step 完成后顺序进入 Step 19;正式 `03` 仍只能由 Step 19 修改 |

## 6. 设计取舍与风险分类规则

### 6.1 设计取舍

| 取舍 | 当前结论 | 理由 |
|---|---|---|
| 是否把所有未完成工作都列为风险 | 否 | 普通文档编写、代码实现和真实测试执行是计划任务;只有存在不确定性、漂移或门禁影响时才进入风险表 |
| 是否把 implementation precondition 叫作上游 blocker | 否 | 目标仓、`04~07` 和 ledger 缺失阻塞 implementation readiness,但当前 `00/01/02` 与 Step 01~17 足以完成详细设计 |
| 是否把全部对象 / 协议误报为已闭合 | 否 | 只把确已关闭的项目放入 §7；I05、H13 和其余 inherited affected 独立保留,不由风险措辞代替 closure |
| 是否在本步选择产品和数值以消除待确认 | 否 | 产品与数值没有当前来源,强行选择会形成未经确认的第二真相源 |
| 是否把 Command / Job 同名视为未解命名问题 | 否 | static family + body mapping 已闭合;保留的是实现映射漂移风险,不是改名待确认 |
| 是否把 reserved transition 视为待实现 backlog | 否 | reserved 是 current non-scope;当前实现必须拒绝,未来启用需新增 protocol / flow / tests 和重新审查 |
| 是否允许风险表生成真实 evidence 占位 | 否 | 设计只能说明产生规则和缺口,不能伪造真实运行事实或验收裁决 |

### 6.2 分类与阻塞范围词汇

| 分类 | 判定规则 | 典型处理 |
|---|---|---|
| `closed_design_item` | 已在 Step 01~17 形成 exact contract 且通过交叉复核 | 不再列为待确认;只在存在漂移可能时登记 residual risk |
| `open_risk` | 触发后可能破坏已确认边界、导致错误实现或使下游门禁失真 | 写风险 ID、触发条件、影响、阻塞范围、缓解和 owner |
| `open_question` | 需要明确 owner 在指定文档 / boundary 前作出选择 | 写确认方、截止时点和未确认前处理方式 |
| `open_upstream_internal` | 上游 producer/schema/owner 尚未提供本仓激活所需契约 | 保留 protocol slot并阻塞 positive activation,不得本仓私造上游 truth |
| `open_controlled` | 缺口已知且有明确 Blocked/manual/zero-write 安全路径 | 允许详细设计继续,但对应 positive boundary 保持 blocker |
| `inherited_affected` | 上游或早期 Step 的未关闭项已传播到多个下游 surface | 每个 `07` boundary 显式消费,未关闭前不得激活或宣告 vertical slice 完成 |
| `implementation_precondition` | 不影响当前设计成立,但未满足前不能正式开工或提交 | 保持 `blocked` readiness,不得误报设计已完成即能实现 |
| `boundary_specific_precondition` | 只阻塞 durable、transport、external-effect、NFR 等特定 boundary | 调整 boundary 或先做受控 spike,不把全项目笼统判死 |
| `ordinary_follow_up` | 已有 owner 与正式后续文档,不存在当前不确定性 | 进入 `04~07` 计划,不包装成风险 |
| `invariant_violation` | forbidden body、source truth writeback、伪证、blind retry 等违反现有正式约束 | 立即停止受影响 boundary,回设计 / 实现修正,不得风险接受后继续 |

| 阻塞范围 | 含义 |
|---|---|
| `none_current_design` | 不阻塞 Step 18 或 Step 19 风险装配 |
| `formal_03_assembly` | 触发时必须先清理冲突,否则正式 `03` 不得通过 |
| `downstream_document` | 阻塞对应 `04/05/06/07` 通过 |
| `implementation_kickoff` | 未满足前不得把项目移交实现 agent |
| `affected_boundary` | 只阻塞引用该产品、route、capability 或数值的 boundary |
| `protocol_activation` | 阻塞某个 protocol 的 decode、positive handler、registration、accepted completion 或 report surface |
| `production_integration` | 可保留 fake / controlled 设计,但真实外部集成不得宣告完成 |
| `acceptance_decision` | 不阻塞功能契约,但不得宣告 NFR / release / final acceptance 通过 |
| `immediate_veto` | 违反现有 invariant,受影响实现必须立即停止 |

## 7. 已关闭风险不再列入待确认

概要 `02` Step 13 和详细设计早期 Step 中出现过的下列问题已经在当前 Step 05~17 闭合。它们不是实现自由度,但也不得继续伪装成“尚未设计”;后续若偏离,应按风险表中的 design drift 处理。

| 原开放问题 | 当前关闭结论 | 关闭来源 | 后续纪律 |
|---|---|---|---|
| `SafeSignal` 是否拆为 raw log / metric / trace 三套核心对象 | 维持统一 `SafeSignal` 主语和 `SignalKind`;不引入 raw provider body 对象 | Step 06、08、15、17 | adapter 可映射不同 signal kind,不得恢复 `MetricPoint` / `TraceSpanRecord` / raw log schema 为核心 truth |
| `ExternalAuditExportPreparation` 承载位置 | 已归 domain peripheral / export 主线,并由 preparation、delivery state、view、intent、token 和 Job flow 承接 | Step 06~14、17 | 产品和 target 仍待绑定,但对象 owner 与 lifecycle 不再待确认 |
| Command / Job 都显示 `PrepareExternalAuditExport` | public family 保留同名;Command 静态映射到 `ObservationCommandOperation::PrepareExternalAuditExport`,Job 映射到 `ObservationJobOperation::PrepareExternalAuditExportDelivery` | Step 06、08、13、17 | family discriminator 必须 typed;未知或 body mismatch 在 UoW 前拒绝 |
| `ConsumeSourceAuditMaterial` 是否按每个 source family 拆多个 consumer | 保留 9 个正式 consumer surface,其中 source-family 语义由 typed producer / payload family 映射 | Step 08、09、17 | transport binding 可分 route,不得在 domain 复制 source body 或擅增协议族 |
| `OutboxPublicationState` 是否独立对象化 | `ObservationOutboxRecord` 拥有 `OutboxPublicationState`,stored payload snapshot 与 state / claim / token 分离 | Step 06、10、11、13、14、17 | `Failed` retry 不回 `Pending`;publisher 只读 stored snapshot |
| `DiagnosticFreshnessState` 放在哪里 | 已作为正式 freshness state,由 diagnostic / read projection assembler 与 maintenance replacement 承接 | Step 06、08~11、17 | Query 只读,不得因查询触发 refresh / repair |
| `ReadAccessRecord` 是否由 Query 同步写入 | 当前 phase-reserved;同步 Query 永远 no-write,未来只有新增独立 accepted async audit flow 才可启用 | Step 11、12、15、17 | 当前没有 writer;不得由 repository / middleware 暗写 |
| restricted / redacted / not-visible / unavailable / degraded 是否可合并 | public surface、visibility、error 和 degraded semantics 已分开定义 | Step 06、08、10、12、15~17 | 不得用一个 bool、empty 或 generic error 合并 |
| 七模块与协议 / flow / state inventory 是否存在 | 七模块、60 个协议、14 Query、27 个正式状态机均有设计记录；这只关闭“是否有 inventory”,不关闭 §9.3 affected | Step 05~17 | 必须同时引用 exact card 与 affected register；不能把 inventory 存在写成 protocol runtime-ready |
| duplicate / in-flight / conflict / unknown outcome 的基本分支是否存在 | stable key/digest、claim/fence、token/probe 和 typed branch 已有设计记录；recovery owner 与 external accounting 仍受 §9.3 约束 | Step 12~17 | 数值可后移,但 mapper owner、phase link/accounting 和 fail-closed invariant 不可由实现补造 |
| log / metric / trace / durable audit 如何分层 | runtime telemetry 与 durable observation truth / native history 已分层,字段 allowlist、low-cardinality、redaction 和 recursion guard 已闭合 | Step 15~17 | backend / sampling 可后移,telemetry 不得成为 truth、result 或 acceptance |

## 8. 不进入风险表的普通后续任务

| 后续任务 | 为什么不是当前开放风险 | 正式承接位置 |
|---|---|---|
| Step 19 装配正式 `03-详细设计.md` | 路径和输入已经确定;风险是装配时历史污染或压缩,不是“是否要装配” | Step 19 |
| 为 60 个协议和 27 个状态机编写代码与测试 | 已有设计来源,但必须先由 `05/07` 消费 §9.3；受影响 positive path 在关闭前只能保留 reserved / blocked gate | 当前轮 `05/07` 与未来 implementation boundaries |
| 创建五个 planned script | 当前只存在脚本契约;实际创建属于实现计划定义的 boundary | 当前轮 `05/07` |
| 真实运行生成 artifact / report / evidence | 只能由实际执行产生,不是可在设计阶段关闭的疑问 | 实现 / 测试阶段 |
| reviewer 作出 verdict / risk acceptance / signoff | 属于真实验收职责,设计只能定义输入和规则 | 当前轮 `06` 与真实验收阶段 |
| README 与最终正式链同步 | 不影响当前设计 truth;只要继续保持 historical material 身份即可 | 正式 `00~07` 完成后的独立同步任务 |
| dashboard、alert、DORA / EBM 或高级 anomaly analysis | 当前明确是外围增强,未进入核心闭环 | 后续增强设计,需要时重新立项 |

## 9. 风险来源覆盖表

### 9.1 Step 01~17 覆盖

| 来源 | 原问题 / 后移项 | 当前分类 | 对应风险 / 待确认 |
|---|---|---|---|
| Step 01 | README / 旧正式链污染;产品、指标和 implementation skeleton 未定 | 保留 historical drift 与移交风险 | `OBS-DDD-R-001~003`;`OBS-DDD-OQ-001~004` |
| Step 02 | P0 / 非范围、外围产品和下游文档边界 | 范围已闭合;保留越界实现风险 | `OBS-DDD-R-004`;`OBS-DDD-R-010` |
| Step 03 | 目标仓不存在;唯一编译期依赖 | implementation precondition;依赖漂移 veto | `OBS-DDD-R-004`;`OBS-DDD-R-014`;`OBS-DDD-OQ-005` |
| Step 04~05 | 目标仓不存在;目标 workspace / 七模块布局 | 布局已闭合;仓现实待 kickoff 核实 | `OBS-DDD-R-004`;`OBS-DDD-OQ-005` |
| Step 06~08 | DTO / port / protocol / state 继续展开;I05 schema/binding、H13、secondary owner、Consumer/Job surface affected;route / topic / RPC 未绑定 | `60/60` 有设计记录,但 inherited affected 未关闭；transport binding 开放 | §9.3 affected register;`OBS-DDD-R-006`;`OBS-DDD-OQ-007` |
| Step 09~10 | per-flow quality、UoW传播、H13、DDL / retry / topic 后移和 reserved transitions | 27状态机有记录；受影响 positive flow保持blocked,reserved 当前拒绝 | §9.3 affected register;`OBS-DDD-R-005~006`;`OBS-DDD-R-010`;`OBS-DDD-OQ-006~008` |
| Step 11 | store 产品 / DDL;accepted UoW顺序、Consumer outbox/completion、Job report ref、read audit reserved、handoff / export binding | logical contract 有记录；affected与物理/integration boundary开放 | §9.3 affected register;`OBS-DDD-R-005~007`;`OBS-DDD-OQ-006~009` |
| Step 12 | recovery owner、transport code、retry 数字、DLQ / ack、provider raw error | typed error层有记录；owner/entry/runtime affected开放 | §9.3 affected register;`OBS-DDD-R-006~008`;`OBS-DDD-OQ-007~010` |
| Step 13 | external phase link/accounting、retention / lease / retry / backoff 数值、adapter probe 能力 | key/digest/fence有记录；affected、数值与真实能力开放 | §9.3 affected register;`OBS-DDD-R-007~008`;`OBS-DDD-OQ-008~010` |
| Step 14 | exact key / value / profile;产品;old binding / secret lifecycle | typed config 已关闭;current `04` 与 integration precheck 开放 | `OBS-DDD-R-005~008`;`OBS-DDD-OQ-006~010` |
| Step 15 | telemetry backend、bucket、sampling、threshold、dashboard;read audit reserved | 埋点契约已关闭;外围 / 数值后移 | `OBS-DDD-R-009~010`;`OBS-DDD-OQ-011` |
| Step 16 | framework、fixture、CI、script、artifact、performance / SLO | test cuts 已关闭;正式执行门禁开放 | `OBS-DDD-R-003`;`OBS-DDD-R-009`;`OBS-DDD-R-012`;`OBS-DDD-OQ-003`;`OBS-DDD-OQ-011~012` |
| Step 17 | 正式 `03~07`、target repo、physical binding、capability、ledger / skeleton、真实 evidence | 全量保留并分层 | `OBS-DDD-R-001~003`;`OBS-DDD-R-005~009`;`OBS-DDD-R-012`;`OBS-DDD-OQ-001~012` |

### 9.2 核心边界覆盖

| 必须保护的边界 | 当前是否已定义 | 本步 residual risk |
|---|---|---|
| observation truth 不等于业务 truth | 已定义 | `OBS-DDD-R-013` 防止实现 / adapter 越权 |
| forbidden raw log / metric / trace / audit / evidence body 不入仓 | 已定义 | `OBS-DDD-R-013` immediate veto |
| redaction-first 与可区分 visibility / degraded semantics | 已定义 | `OBS-DDD-R-013` immediate veto |
| correlation id 只关联、不推导业务 truth | 已定义 | `OBS-DDD-R-013` immediate veto |
| body-free evidence linkage | 已定义 | `OBS-DDD-R-013` immediate veto |
| retention marker 不授权 source cleanup | 已定义 | `OBS-DDD-R-010`;`OBS-DDD-R-013` |
| report handoff 不生成真实 evidence / verdict / signoff | 已定义 | `OBS-DDD-R-012~013` |
| Query / replay / handoff / export / retention 不反写 source truth | 已定义 | `OBS-DDD-R-013` immediate veto |
| external effect 使用 snapshot / intent / stable token / exact binding / probe | 已定义 | `OBS-DDD-R-007` 真实 capability 风险 |
| implementation ledger / skeleton 的创建时点 | 已定义 | `OBS-DDD-R-003` kickoff gate |

### 9.3 Inherited affected register

本表与 §10 的通用风险表并列生效。§10 回答文档、环境、产品、能力和 invariant 漂移；本表回答哪些
current 设计缺口仍会阻塞具体 protocol / transaction / mapper / external-effect boundary。它们不是普通后续优化，
也不能因为本步“未发现新的上游 blocker”而消失。

| Affected ID | Current classification | 仍未关闭的事实 | 阻塞范围 | 未关闭前处理 | 关闭 owner / 最早关闭位置 |
|---|---|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | `open_upstream_internal` | I05 canonical payload schema、version 与字段安全规则无唯一上游 owner | I05 decode、fixture、accepted positive handler与production registration | slot 保留但不激活；payload parse、UoW、ack 前 typed fail closed | 上游 producer/schema owner；回灌 current Step 08/09/16 与未来 `04/07` audit |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | `open_upstream_internal` | I05 producer event identity、binding 与source comparator未闭合 | I05 producer allowlist、dedup/source order、consumer registration | disabled或startup fail；zero local/source write | 上游 producer owner + current `04/07` binding owner |
| `R06.6-F2-H13-UPSTREAM` | `open_controlled` | H13 `ReplayScopeTransition` owner/record contract仍为 explicit no-record | J06 positive execution、completion、report与H13 writer | 仅 controlled `Blocked` / manual；zero H13/source write；不生成execution result | H13 owner 的正式设计决定；随后回灌 Step 06~16与`07` |
| `R06-F-AFFECT-UOW-01` | `inherited_affected` | accepted UoW 新顺序尚需传播并逐 boundary 验证 | 所有 Command/Consumer accepted mutation、owner-coupled Event、Job start/item/finalize、handoff/export finalize | 固定 `stage owner/post-state + membership plan -> assign cursor -> construct/append cursor-bound history/outbox/stale -> result -> complete -> commit`;任一点失败whole rollback | current Step 09/11/13/15/16/19 + `07` per-boundary audit |
| `S08-RECOVERY-CLASS-OWNER-01` | `inherited_affected` | recovery class owner及内部/public/entry mapper未全量闭合 | error mapper、retry/dead-letter/manual、commit-unknown与external outcome | 未识别分类fail closed/manual；`DomainError::ReservedTransition`与`ApplicationError::ReservedTransition`保持分层 | current detailed design mapper owner + future `05/07` |
| `R07-EXTERNAL-PHASE-LINK-01` | `inherited_affected` | local intent/item/result到external phase identity的durable link未逐adapter验证 | publication、handoff、export call/resume/finalize | 只保存immutable intent/snapshot；link不完整则不调用外部target | current `04/07` binding/capability owner |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | `inherited_affected` | same-token retry/probe attempt与outcome accounting owner未闭合 | external retry、probe、exhaustion/manual与report fold | Unknown保留intent并manual/probe；禁止blind retry、换token/binding | current `04/07` capability与persistence boundary |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | `inherited_affected` | 9 Consumer accepted local fact到owner-coupled outbox follower尚未逐项闭合 | 需要Event follower的Consumer positive boundary | 无same-UoW typed snapshot则whole rollback；commit后不得从current truth补建 | current Step 08/09/11 + `07` Consumer vertical slice |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | `inherited_affected` | commit-unknown后的Consumer completion与ack action无全量唯一映射 | worker ack/retry/dead-letter与restart recovery | 不ack success；probe reservation/stored result，仍未知则manual/controlled retry | current Step 12/13 + future `05/07` Consumer gate |
| `S08-JOB-REPORT-REF-OWNER-01` | `inherited_affected` | Job report ref canonical owner、mint/rehydrate与durable relation未全量闭合 | 9 Job result/report/finalize、Query/report handoff | 缺owner不得mint假ref、finalize `Completed`或生成run/evidence identity | current Step 06/08/11 + `07` Job vertical slice |
| `S08-M1-SECONDARY-TYPE-OWNER-01` | `inherited_affected` | public protocol secondary type仍有唯一owner/definition gap | contracts/public DTO、encoder/decoder、mapper、fixture与entry | 不建alias/default/private duplicate；entry/UoW前拒绝 | current Step 06/08 owner registry + `07` compile audit |
| `03-RPR-S09-PER-FLOW` | `inherited_affected` | 60项exact-flow虽有记录,逐flow质量与cross-reference仍需boundaries消费 | 对应16 Command、14 Query、9 Consumer、12 Event、9 Job vertical slice | family模板不能替代exact flow；未审计flow不得宣告slice完成 | current Step 09 + `07` per-boundary audit |

聚合结论：`60 = 16 + 14 + 9 + 12 + 9`，`60/60` 有设计记录，`0/60` 无条件完成；27 个正式
状态机有设计记录，但状态记录不能补造缺失 schema、owner、UoW、recovery、report 或 external capability。
I05 与 J06 的 positive test 继续是 `positive_reserved`,当前只能验证 disabled / Blocked / manual、zero write 和
no-fabrication；不得产生 positive pass。

## 10. 风险表

严重度只表达潜在影响,不等于当前已发生。`当前状态` 为 `controlled_open` 表示风险仍存在但已有未确认前处理方式;`precondition_open` 表示必须在相应开工时点关闭;`invariant_guarded` 表示契约已明确,一旦违反即 veto。

| 风险 ID | 严重度 / 当前状态 | 风险与触发条件 | 影响 | 阻塞范围 | 缓解 / 未触发前处理 | 负责人 / 待确认方 |
|---|---|---|---|---|---|---|
| `OBS-DDD-R-001` | high / `precondition_open` | 正式 `03-详细设计.md` 仍是 4990 行 pre-M2 装配稿；若不传播 current completion、affected、reserved positive gate 与 UoW 顺序就直接开工 | 实现者会把 `60/60` 有记录误读成全部可激活,并错误执行 I05/J06 或 accepted write order | `formal_03_assembly`;`implementation_kickoff` | Step 19 按 source matrix 重装受影响章节并运行来源、命名、数量、affected 和 historical token 检查；此前不正式移交实现 | 详细设计维护者 / 用户 |
| `OBS-DDD-R-002` | high / `precondition_open` | 当前轮 `04/05/06/07` 尚未按新版 `03` 重建;若旧配置、测试、验收或实施计划继续作为门禁 | 旧 key、产品、对象、状态、阈值、evidence 或 boundary 会反向污染当前设计 | `downstream_document`;`implementation_kickoff` | 按正式文档顺序逐份 full-restart;每份完成后停审,不得用旧文档约束新版 `03` | 配置 / 测试 / 验收 / 实施计划维护者 / 用户 |
| `OBS-DDD-R-003` | critical / `precondition_open` | 当前 `07` 未完成逐 phase / commit-boundary 整体审计,implementation ledger 与全部 planned skeleton 尚未创建 | 实现 agent 无法恢复 exact boundary、required reads、gate、暂停 / 回退和 commit 状态,并可能被迫现场补设计 | `implementation_kickoff` | `07` 完成时一次创建 current implementation ledger 和全部 planned skeleton,逐 boundary 审计 `03/05/06/07`;此前不拆实现任务 | 实施计划维护者 / 用户 |
| `OBS-DDD-R-004` | high / `precondition_open` | `/home/aris/Projects/quantalithos-observability` 当前不存在;若假定 workspace、Cargo、git identity 或文件布局已经具备 | 无法核实代码落点、依赖、编译、测试、工作区状态或首个 commit 条件 | `implementation_kickoff` | `07` 定义 initialization boundary 和 reality check;仓存在后核实 workspace、`core-contracts` path、git config 与 dirty state;不得在设计仓实现代码 | 实施计划维护者 / 实现 agent / core 负责人 |
| `OBS-DDD-R-005` | high / `controlled_open` | 物理持久化产品、DDL、migration、partition、index、atomicity / fence capability 尚未映射;若直接把 Step 11 logical store 当物理 schema | durable adapter 可能无法满足 CAS、UoW、append-only、cursor、outbox snapshot、intent、claim / fence 或 recovery invariant | `affected_boundary`;`production_integration` | 在 `04/07` 或受控 spike 中验证产品能力并映射 logical contract;能力不满足时阻塞 durable boundary,不得改 domain / application 语义 | 架构 / infra / 配置 / 实施计划维护者 |
| `OBS-DDD-R-006` | high / `controlled_open` | HTTP path、RPC method、event topic、consumer mapping、DLQ / ack、cron / schedule 尚未绑定;若 route string 渗入 contracts / domain 或在首个请求时才发现缺失 | entry mapping、schema negotiation、actor / producer binding、outbox destination 和 worker behavior 不可验证 | `affected_boundary`;`production_integration` | `04/07` 用 typed config 和 adapter catalog 绑定;enabled entry 必须 startup fail-fast;domain / contracts 保持 route-neutral | 配置 / infra / Bus / 实施计划维护者 |
| `OBS-DDD-R-007` | critical / `controlled_open` | 真实 publisher / handoff / export adapter 对 stable idempotency namespace、same-token retry / probe、historical binding resolution 和 rotation 的支持尚未验证 | ambiguous outcome 可能造成重复发布、错投新 target、错误 finalize 或永久丢失恢复能力 | `affected_boundary`;`production_integration` | 对每个 effect phase 做 capability precheck / spike;`Unsupported` 或 `Unknown` 必须保留 intent 并转 manual,禁止 blind retry、换 token 或 current-route fallback | adapter / infra / external system owner / 实施计划维护者 |
| `OBS-DDD-R-008` | medium / `controlled_open` | exact retention duration、reservation lifetime、lease、heartbeat、retry、backoff、jitter、exhaustion、batch、parallelism 和 timeout 尚未定;若沿用 README 或随手默认 | 可能引起过早释放、重复 claim、重试风暴、饥饿、吞吐不足或 old binding 提前回收 | `downstream_document`;`affected_boundary` | `04` 按 typed owner、范围、profile、validation 和 activation 固定;未确认前只允许 bounded、non-zero、fail-closed code baseline,不得改变 state / token / no-write invariant | 配置设计维护者 / infra / 运维 / 相邻系统 owner |
| `OBS-DDD-R-009` | medium / `controlled_open` | performance、capacity、availability、freshness 和 SLO 缺少当前负载模型与 evidence 来源;若恢复 README 的 P95、10w、15s 等数字或用单次样本判定 | 测试与验收会形成不可辩护硬线,或在没有容量依据时错误宣告通过 | `downstream_document`;`acceptance_decision` | `05/06` 明确 workload、environment、sample、threshold / review rule 和 evidence;无来源时保留 `not_evaluated`,不得继承历史数字 | 测试方案 / 验收标准 / 性能 owner |
| `OBS-DDD-R-010` | high / `invariant_guarded` | phase-reserved transition、`ReadAccessRecord` writer、release / cancel / suppress / supersede / reopen 等 future flow 被实现者提前暴露 | 当前状态机、Query no-write、active reference protection 和 phase boundary 被绕过 | `immediate_veto` for affected boundary | 当前 handler / route / repository writer 必须不存在或明确返回 `ReservedTransition`;未来启用必须新增 protocol、flow、transaction、idempotency、tests、acceptance 并重开设计 | 详细设计维护者 / 实施计划维护者 / 实现 agent |
| `OBS-DDD-R-011` | high / `invariant_guarded` | public Command 与 Job 都名为 `PrepareExternalAuditExport`;若实现按 route / string 猜 family,或 digest / idempotency operation 复用错误 | 请求可能进入错误 façade、错误 UoW、错误 stable digest / stored result 或错误 external effect flow | `immediate_veto` for command / job entry boundary | 使用 typed protocol family + body 静态映射到两个 finite operation;unknown / mismatch 在 UoW 前拒绝;`07` 对两个 boundary 分别审计 | API / jobs / contracts / application owner |
| `OBS-DDD-R-012` | critical / `precondition_open` | 五个 planned script、测试 fixture、CI、artifact schema、report consumer、真实 run / evidence / verdict 当前均不存在;若设计切口被表述为已执行或填入虚构 alias / pass | 可追溯性和验收真实性失效,实现 / 发布可能基于不存在的证据 | `downstream_document`;`implementation_kickoff`;`acceptance_decision` | `05/06/07` 定义 producer / consumer / gate,实现阶段真实执行后才写实际 run / artifact / report / evidence;当前统一保持 planned / pending / not-run | 测试 / 验收 / 实施计划维护者 / reviewer |
| `OBS-DDD-R-013` | critical / `invariant_guarded` | 实现、配置或 adapter 保存 forbidden raw body / evidence body,将 observation / audit projection 当业务 truth,从 correlation 推导业务事实,或由 Query / replay / handoff / export / retention 反写 source truth | 打穿本项目最核心 ownership、安全、evidence、retention、report 和 no-write 边界 | `immediate_veto` project-wide | redaction-before-serialization、body-free typed ref、owner-qualified state、source-write trait 禁止、Query zero-write、no-write guard 和 negative tests 必须同时成立;违反即回设计 / 实现修正,不可风险接受 | 全体设计 / 实现 / 测试 / reviewer |
| `OBS-DDD-R-014` | critical / `invariant_guarded` | 引入非 `L0-core` sibling 编译期依赖,或把 `L0-bus` ack / retry / dead-letter / replay truth、本地 dashboard / GRC 产品 truth 移入本仓 | 依赖裁剪、truth ownership 和可替换 adapter 边界失效 | `immediate_veto` for dependency / integration boundary | Cargo 只允许当前设计的 `core-contracts` path;其他协作通过 event、port、typed ref、handoff、export 或 fake;发现新增编译依赖必须回开架构 / 详细设计 | 架构维护者 / implementation reviewer |

### 10.1 风险阻塞汇总

| 判断问题 | 当前结论 |
|---|---|
| 是否存在阻塞 Step 18 完成的风险 | 否;所有开放风险均有影响范围与未确认前处理方式 |
| 本步是否发现要求回退 `00/01/02` 的新上游 blocker | 否；Step 19 可以继续装配,但不得把该结论写成 affected=`none` |
| 是否存在既有上游/internal或controlled blocker | 是；I05 两项 `open_upstream_internal`、H13 `open_controlled`,只阻塞对应 positive activation boundary |
| 当前是否可以正式移交实现 | 否;`OBS-DDD-R-001~004`、`OBS-DDD-R-012` 的 implementation precondition 尚未满足 |
| 是否存在其他 inherited affected | 是；§9.3 其余9项继续阻塞引用它们的 boundary；`0/60` 无条件完成 |
| 产品 / transport / capability 未定是否阻塞全部实现 | 否;仅阻塞引用它们的 affected / production boundary,且 boundary 不能通过猜测绕过 |
| invariant violation 是否可以风险接受 | 否;`OBS-DDD-R-010~014` 触发即 immediate veto |

## 11. 待确认事项表

| 事项 ID | 待确认事项 | 当前影响 | 需要谁确认 | 最迟确认时点 | 未确认前处理方式 |
|---|---|---|---|---|---|
| `OBS-DDD-OQ-001` | Step 19 是否仅从 current Step 01~18 重装 4990 行 pre-M2 正文的受影响章节并重新执行全文门禁 | 决定正式详细设计唯一 baseline、哪些主体可保留以及 stale completion / UoW / affected token 是否清零 | 详细设计维护者 / 用户 | Step 19 装配前 | 不把磁盘现稿直接当 current baseline；不按单个 calibration 文件正式开工 |
| `OBS-DDD-OQ-002` | 当前轮 `04-配置设计.md` 的 full-restart 路径和 exact config source / key / profile / activation / rollback 范围 | 决定 typed config 如何成为可部署唯一来源 | 配置设计维护者 / 用户 | 任一 config-dependent implementation boundary 前 | 只承认 Step 14 typed shape / invariant;不由代码现场发明 key、env、默认值或 product binding |
| `OBS-DDD-OQ-003` | 当前轮 `05/06` 如何分配 suite / case / fixture / artifact / report / evidence / AC / VETO / reviewer 规则 | 决定 Step 16 test cuts 如何成为真实可执行和可裁决门禁 | 测试方案 / 验收标准维护者 / 用户 | `07` boundary 审计前 | 不引用旧测试 / 验收编号,不宣称任何切口已运行,不生成虚构 evidence alias 或 verdict |
| `OBS-DDD-OQ-004` | 当前轮 `07` 的 phase / commit boundaries、逐 boundary 审计、implementation ledger 和全部 skeleton 结构 | 决定项目能否无设计补洞地恢复与实施 | 实施计划维护者 / 用户 | implementation kickoff 前 | 不自行拆 phase / commit,不提前创建 current ledger / skeleton,不移交实现 agent |
| `OBS-DDD-OQ-005` | 目标实现仓何时创建,其 workspace、Cargo dependency、git identity 和初始工作区现实是否符合 Step 03~05 | 决定代码落点、编译、测试和 commit 前提 | 实施计划维护者 / 实现 agent / core 负责人 | initialization boundary / 首次代码修改前 | 设计仓只保留目标路径;目标仓不存在前不写代码,存在后先做 reality check |
| `OBS-DDD-OQ-006` | 物理 store / queue / object store 产品、DDL / migration / partition / index 与 capability 验证方式 | 决定 logical stores、UoW、CAS、cursor、outbox、intent 和 fence 的 durable 实现 | 架构 / infra / 配置 / 实施计划维护者 | durable adapter boundary 审计前 | 使用 port / fake 验证 logical semantics;不把候选产品表结构写入 domain / contracts |
| `OBS-DDD-OQ-007` | HTTP / RPC route、event topic、consumer source mapping、ack / DLQ、cron / schedule 的 typed binding | 决定 entry registration、worker dispatch 和 exact external destination | 配置 / infra / Bus / API / jobs owner | 对应 entry / transport boundary 前 | 保持 route-neutral;enabled binding 不完整则 startup fail / entry unavailable,不得首请求时猜测 |
| `OBS-DDD-OQ-008` | retention duration、reservation / claim lease、heartbeat、retry / backoff / jitter / exhaustion、batch / parallelism / timeout 的正式值和范围 | 决定资源保护、恢复节奏、吞吐与 old binding 生命周期 | 配置 / infra / 运维 / 相邻系统 owner | `04` 完成及相关 boundary 审计前 | 只使用 bounded、non-zero、fail-closed baseline;不恢复 README 数字,不改变 formal state / token / no-write 语义 |
| `OBS-DDD-OQ-009` | 每个真实 external adapter phase 是否支持 stable idempotency、probe、known-success finalize 和 historical binding lookup | 决定 ambiguous outcome 能否自动恢复 | adapter / external system owner / infra / 实施计划维护者 | publisher / handoff / export production boundary 前 | capability 未证明时按 `Unsupported` / `Unknown` 进入 manual,保留 intent,不 blind retry 或换 route |
| `OBS-DDD-OQ-010` | old binding、secret rotation、credential refresh、new assembly activation / rollback 和 in-flight drain 的物理保留策略 | 决定旧 snapshot / intent / plan 能否在配置切换后恢复到原 target | 配置 / infra / security / 运维 owner | rotation / activation boundary 前 | active / ambiguous material 存在时不删除旧 binding identity;新配置不得重写已有 durable material |
| `OBS-DDD-OQ-011` | performance / capacity / availability / freshness / SLO 的 workload、environment、sample 和 pass / review rule | 决定 NFR 测试和最终验收是否有当前依据 | 测试方案 / 验收标准 / 性能 owner | NFR case 定稿和 acceptance decision 前 | 标记 `not_evaluated`;不继承 README P95 / 10w / 15s,不以单次运行宣告通过 |
| `OBS-DDD-OQ-012` | planned scripts、artifact schema、report schema、evidence index 与真实执行目录由哪些 boundaries 物化 | 决定 gate 命令、生产者、消费者和失败输出能否闭环 | 测试 / 验收 / 实施计划维护者 | `07` 完成前 | 保留 Step 16 planned contract;不创建虚构 run 目录、artifact、report、alias、pass 或 signoff |

### 11.1 Implementation readiness 与上游 blocker 区分

| 检查面 | 当前状态 | 是否为上游 blocker | 阻塞什么 | 关闭位置 |
|---|---|---|---|---|
| 当前正式 `00/01/02` 与 Step 01~17 | 一致,可承接 | 否 | none | 已关闭 |
| Step 18 风险登记 | 完整 | 否 | none after user review | 本 Step |
| I05 payload/schema + producer binding | `open_upstream_internal` | 是,既有且非本步新发现 | I05 `protocol_activation` | 上游 producer/schema owner + current design propagation |
| H13 / J06 | `open_controlled` | 是,既有且非本步新发现 | J06 positive execution/completion | H13 owner正式设计决定 |
| 其他 inherited affected | 9项 `inherited_affected` | 否,但均是 boundary gate | 对应 transaction/mapper/external/Consumer/Job/type/flow boundary | §9.3各自owner与`07` audit |
| 正式 `03` 装配 | pending | 否,但为实施前置 | formal baseline / kickoff | Step 19 |
| 当前轮 `04/05/06/07` | historical / pending restart | 否,但为实施前置 | config / test / acceptance / implementation handoff | 后续逐文档 full-restart |
| target repo | absent | 否,但为 kickoff precondition | code / compile / test / commit | current `07` initialization boundary |
| physical / transport / external capability | product-neutral only | 否,但为 boundary-specific precondition | durable / integration / external effect | current `04/07` 或 controlled spike |
| scripts / artifact / report / evidence / verdict | nonexistent by design | 否,但为 test / acceptance precondition | gate execution / acceptance decision | current `05/06/07` + real execution |
| implementation ledger / planned skeleton | current version absent | 否,但阻塞 kickoff | implementation recovery / boundary handoff | current `07` 完成时 |

当前结论必须拆成三层同时保留：本步新发现上游 blocker=`none`；既有 I05/H13 blocker 与其余 inherited
affected=`open`；implementation readiness=`blocked`。不得把第一层润色成“上游 blocker 全部为 none”,也不得
把已有设计记录润色成“现在可以实现”。

## 12. 未确认前处理规则

### 12.1 场景处理矩阵

| 场景 | 未确认前允许做什么 | 必须停止在哪里 | 禁止事项 | 回报 / 关闭入口 |
|---|---|---|---|---|
| 正式 `03` 尚未装配 | 继续 Step 19 文档装配与静态审查 | 正式实现移交前 | 按旧 `03` 或 calibration 单文件开工 | Step 19 / `OBS-DDD-OQ-001` |
| 当前轮 `04~07` 尚未重建 | 按用户确认逐文档 full-restart | implementation kickoff 前 | 用旧配置、测试、验收或实施计划作为新门禁 | 对应正式文档 flow / `OBS-DDD-OQ-002~004` |
| 目标实现仓不存在 | 在设计仓记录目标路径和 initialization precondition | 任何代码、测试、git config 或 commit 前 | 在设计仓代建实现代码;假定 workspace 已存在 | current `07` / `OBS-DDD-OQ-005` |
| physical store / DDL 未确认 | 实现 contracts / domain / application fake conformance boundary,前提是 `07` 明确允许 | durable adapter boundary 前 | 让产品 schema 反向改变 logical store / transaction invariant | `04/07` 或 controlled spike / `OBS-DDD-OQ-006` |
| route / topic / RPC / schedule 未确认 | 保持 typed route-neutral protocol 和 disabled / unavailable entry | transport / enabled entry boundary 前 | 硬编码 route 到 contracts / domain;从字符串猜 protocol family | `04/07` / `OBS-DDD-OQ-007` |
| external adapter capability 未确认 | 使用 formal fake / controlled outcome;记录 `Unsupported` / `Unknown` | production external-effect call 前 | blind retry、换 token、换 current target、把 timeout 当 known failure | capability spike / `OBS-DDD-OQ-009~010` |
| duration / lease / retry / batch 未确认 | 仅在正式配置设计允许时使用 bounded、non-zero、fail-closed baseline | config-dependent boundary acceptance 前 | 沿用 README 数字;用配置关闭 idempotency、fence、no-write 或 active protection | current `04` / `OBS-DDD-OQ-008` |
| performance / SLO 未确认 | 做功能与安全验证,结果标 `not_evaluated` | NFR / final acceptance decision 前 | 用旧阈值、单次样本或开发机结果宣告通过 | current `05/06` / `OBS-DDD-OQ-011` |
| reserved transition 被需求方提出 | 记录 future request 并回开设计 | 添加 public method / route / writer 前 | 直接调用 domain reserved method或由 repository 绕过 guard | 对应 `03` Step 06~13 / `OBS-DDD-R-010` |
| `PrepareExternalAuditExport` family 无法判定 | UoW 前返回 typed protocol mismatch | 进入 façade / reserve / digest 前 | 由 route string、body guessing 或共享 operation key 兜底 | Step 08 / 13 / `OBS-DDD-R-011` |
| scripts / artifact / report / evidence 不存在 | 保持 planned / pending / not-run,等待正式 producer / consumer | gate pass、acceptance 或 signoff 前 | 创建虚构 alias、空 report、静态 pass、假 run id 或 reviewer 签署 | current `05/06/07` / `OBS-DDD-OQ-003/012` |
| 实现发现字段 / DTO / state / mapper / source version 缺口 | 记录 exact type、source、影响和 safe stop | 写 placeholder / default / private map 前 | 实现者自行新增 schema、拼 key、猜状态或改 phase | 回对应 `03` Step + flow;必要时设计 blocker 回流 |
| 发现 forbidden body / source truth writeback / 非 core 编译依赖 | 保留最小复现和无敏感信息证据 | 立即停止受影响 boundary | 以风险接受、配置开关或 temporary hack 继续 | `OBS-DDD-R-013~014`;回架构 / 详细设计修正 |

### 12.2 风险关闭规则

| 风险类别 | 可关闭条件 | 不能作为关闭依据 |
|---|---|---|
| formal / downstream document precondition | 对应正式文档按 SOP 完成、通过用户停审并更新 flow / project ledger | 文件存在、旧文档可读、agent 口头称已完成 |
| implementation kickoff precondition | current `07` 完成审计并创建 ledger / skeleton;target repo reality check 有真实记录 | 设计 Step pass、假定仓将来会创建、虚构 commit |
| physical / transport binding | 正式 `04/07` 或批准的 spike 给出产品、typed binding、capability 与失败处理 | README、候选技术栈、实现者偏好 |
| external capability | 对真实 adapter / target 做可复查 capability check,并记录 Unsupported / degradation 处理 | SDK 文档推测、mock 始终 success、health endpoint 可达 |
| numeric / NFR | 正式来源写明 workload、range / threshold、environment 和裁决方式 | 历史数字、默认值、单次本地样本 |
| evidence / acceptance | 真实命令产生真实 artifact / report / evidence,由有权 reviewer 按 `06` 裁决 | placeholder alias、空目录、设计文档示例、adapter success |
| invariant-guarded residual risk | 相应 boundary 有正向、负向和 fail-closed gate,且 review 未发现偏离 | 把 invariant 改成配置、标为 accepted risk、仅写注释 |

待确认项的状态只能在其 owner 的正式文档、approved ADR / spike 产物或真实执行台账中关闭。聊天确认若会改变正式契约,仍必须落入对应设计真相源;实现代码和 README 不能反向充当确认来源。

## 13. Step 19 装配输入与红线

### 13.1 正式 §17 必须装配

| 装配内容 | 当前唯一来源 | 装配要求 |
|---|---|---|
| 风险表 | §10 | 保留 14 个稳定 ID、影响、阻塞范围、缓解方式和 owner |
| 待确认事项表 | §11 | 保留 12 个稳定 ID、确认方、最迟时点和未确认前处理方式 |
| inherited affected register | §9.3 | 保留 12 项稳定 ID、classification、exact boundary、未关闭前行为与关闭 owner |
| 新 blocker / 既有 blocker / implementation readiness 区分 | §10.1、§11.1 | 同时写明 `no_new_blocker`、I05/H13/open affected 与 `blocked`,不得二选一 |
| 未确认前实现处理规则 | §12.1 | 至少保留 stop / fail-closed / no-fabrication / return-to-design 四类规则 |
| historical material 身份 | §3.3、§5 | 明确 README、旧正式 `03~07` 和旧 Step 18 不是真相源 |
| 真实性声明 | §2.2、§8、§12 | scripts / artifacts / reports / evidence / verdict / signoff 当前均不得写成真实存在 |

### 13.2 Step 19 不得新增或改变

- 不得在装配时替风险 owner 选择 store、transport、adapter、secret、数值、SLO 或 evidence 格式。
- 不得把 `controlled_open` 润色成“已决定”,也不得把 `precondition_open` 删除以制造 implementation ready 假象。
- 不得把 `OBS-DDD-R-010~014` 降级成可接受优化或普通 backlog。
- 不得恢复 README 的产品、目录、P95、10w、15s、冷存年限、哈希链或 DORA / EBM 主线。
- 不得把 `PrepareExternalAuditExport` 同名映射重新列为开放改名问题;正式风险是 typed family 映射不得漂移。
- 不得把 reserved transition 写入当前 callable API / Job / repository surface。
- 不得在正式 §17 伪造 commit、run、artifact、report、evidence、verdict、risk acceptance 或 signoff。

### 13.3 Step 19 装配前检查

| 检查项 | 通过标准 | 失败处理 |
|---|---|---|
| 来源完整 | §17 只来自当前 Step 18 已审核内容 | 停止装配,补来源或回 Step 18 |
| ID 完整 | `OBS-DDD-R-001~014`、`OBS-DDD-OQ-001~012` 无丢失 / 重号 | 停止装配并修复 |
| 阻塞范围完整 | 每个风险仍有 exact blocking scope | 不得用“有风险”泛化替代 |
| owner 完整 | 每项有维护者、系统 owner 或 reviewer | 未指定 owner 的项保持 blocker,不得交给实现者 |
| historical 隔离 | 旧产品、对象、状态、数字未回流 | 删除回流内容并按当前来源重装 |
| 真实性 | 所有未执行项保持 planned / pending / not-run | 删除虚构事实,不得补假 alias |
| affected 完整 | §9.3 的 12 项 ID、classification、阻塞范围与关闭 owner 全部进入正式 §17 | 任一缺失则停止装配,不得只写“无新 blocker” |
| reserved positive gate | I05 / J06 保持 `positive_reserved`,`0/60` 无条件完成 | 出现 positive pass、fabricated payload/H13/result 时回 Step 16/18 |

## 14. 正式 `03` §17 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_18_risks_open_questions.md`
>
> 延伸阅读:
> - 建议继续阅读本文件的“已关闭风险不再列入待确认”“风险来源覆盖表”“风险表”“待确认事项表”和“未确认前处理规则”,了解开放事项如何与已闭合详细设计契约分离。

### 17. 风险与待确认事项

本步没有发现要求回退正式 `00/01/02` 的**新**上游 blocker；这不关闭 I05 payload/schema 与 producer
binding 的 `open_upstream_internal`,也不关闭 H13 的 `open_controlled` 或其余 inherited affected。
Implementation readiness 仍为 blocked。正式 `03` 装配、当前轮 `04~07`、目标实现仓、逐 boundary
审计、implementation ledger / skeleton、真实脚本 / 测试 / evidence 尚未满足前,不得正式移交实现。

风险与待确认事项不是实现自由度。产品、transport、capability 和数值未确认时,只阻塞引用它们的 boundary,实现不得猜测;forbidden body、source truth writeback、reserved transition 提前实现、typed family 混用、blind retry、非 core 编译依赖或伪造 evidence 一旦发生,则立即否决受影响 boundary。

#### 17.1 Inherited affected register

协议聚合事实为 `60 = 16 + 14 + 9 + 12 + 9`、`60/60` 有设计记录、`0/60` 无条件完成；27 个正式
状态机有设计记录。下列 affected 未关闭前,其 positive boundary 不得激活：

| Affected ID | 状态 | 阻塞范围 | 未关闭前处理 |
|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | `open_upstream_internal` | I05 decode / fixture / accepted handler | slot 不激活；parse / UoW / ack 前 fail closed |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | `open_upstream_internal` | I05 producer allowlist / registration | disabled 或 startup fail；zero write |
| `R06.6-F2-H13-UPSTREAM` | `open_controlled` | J06 positive execution / completion / H13 | `Blocked` / manual；zero H13/source write/result fabrication |
| `R06-F-AFFECT-UOW-01` | `inherited_affected` | 所有 accepted mutation | stage owner/membership -> assign cursor -> append cursor-bound material -> result -> complete -> commit |
| `S08-RECOVERY-CLASS-OWNER-01` | `inherited_affected` | mapper / retry / dead-letter / manual | 未分类 fail closed；Domain/Application `ReservedTransition` 不合并 |
| `R07-EXTERNAL-PHASE-LINK-01` | `inherited_affected` | publication / handoff / export phase link | link 不完整不调用 external target |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | `inherited_affected` | same-token retry / probe / accounting | Unknown 保留 intent 并 probe/manual；禁止 blind retry |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | `inherited_affected` | Consumer owner-coupled Event | 无 same-UoW typed snapshot 则 rollback |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | `inherited_affected` | worker completion / ack action | probe stored result；仍未知则 manual/controlled retry |
| `S08-JOB-REPORT-REF-OWNER-01` | `inherited_affected` | Job result / report / finalize | 不 mint 假 ref,不 finalize `Completed` |
| `S08-M1-SECONDARY-TYPE-OWNER-01` | `inherited_affected` | public DTO / mapper / wire | 不建 alias/default/private duplicate |
| `03-RPR-S09-PER-FLOW` | `inherited_affected` | 60 protocol vertical slices | exact flow 未审计不得声明 slice 完成 |

#### 17.2 风险表

| 风险 ID | 风险 | 影响 / 阻塞范围 | 缓解方式 | 负责人 / 待确认方 |
|---|---|---|---|---|
| `OBS-DDD-R-001` | 正式 `03` 尚未按当前 Step 01~18 装配 | 阻塞 formal baseline 和 implementation kickoff | Step 19 全量装配并做来源、命名、数量与历史残留检查 | 详细设计维护者 / 用户 |
| `OBS-DDD-R-002` | 当前轮 `04~07` 尚未按新版 `03` 重建 | 阻塞对应下游文档和 implementation kickoff | 按正式文档顺序逐份 full-restart,旧文档不得反向约束新版 `03` | 下游文档维护者 / 用户 |
| `OBS-DDD-R-003` | `07` 边界审计、current implementation ledger 与 planned skeleton 尚不存在 | 阻塞 implementation kickoff | `07` 完成时逐 boundary 审计并一次创建 ledger 和全部 skeleton | 实施计划维护者 / 用户 |
| `OBS-DDD-R-004` | 目标实现仓不存在 | 阻塞代码、编译、测试和 commit | `07` 定义 initialization boundary;仓创建后先做 workspace / Cargo / git reality check | 实施计划维护者 / 实现 agent / core 负责人 |
| `OBS-DDD-R-005` | 物理 store / DDL / atomicity capability 未映射 | 阻塞 durable / production boundary | `04/07` 或 controlled spike 映射 Step 11 logical contract;不得改 domain invariant | 架构 / infra / 配置 / 实施计划维护者 |
| `OBS-DDD-R-006` | route / topic / RPC / schedule / ack / DLQ 未绑定 | 阻塞对应 entry / transport boundary | 用 typed config / catalog 绑定,enabled entry 缺失时 fail startup | 配置 / infra / Bus / 实施计划维护者 |
| `OBS-DDD-R-007` | 真实 adapter 的 idempotency / probe / historical binding 能力未验证 | 阻塞 external-effect production boundary | capability precheck;Unknown / Unsupported 保留 intent 并转 manual,禁止 blind retry | adapter / infra / external owner |
| `OBS-DDD-R-008` | retention / lease / retry / batch 等数值未定 | 阻塞 config-dependent boundary | `04` 固定来源、范围、profile 和 validation;不得改变 state / token / no-write invariant | 配置 / infra / 运维 owner |
| `OBS-DDD-R-009` | performance / capacity / SLO 缺当前来源 | 阻塞 NFR / final acceptance 裁决 | `05/06` 定义 workload、environment、threshold / review 和 evidence | 测试 / 验收 / 性能 owner |
| `OBS-DDD-R-010` | reserved transition 或 phase-reserved writer 被提前实现 | immediate veto | 当前必须拒绝;未来启用需新增 protocol / flow / tests 并重开设计 | 详细设计 / 实施计划 / 实现 owner |
| `OBS-DDD-R-011` | `PrepareExternalAuditExport` Command / Job typed family 被混用 | immediate veto for entry boundary | family + body 静态映射,UoW 前拒绝 unknown / mismatch | API / jobs / contracts / application owner |
| `OBS-DDD-R-012` | scripts / artifact / report / evidence / verdict 不存在却被写成已产生 | 阻塞 test / acceptance / kickoff 并破坏真实性 | 保持 planned / pending / not-run;只由真实执行和 reviewer 产生 | 测试 / 验收 / 实施计划 / reviewer |
| `OBS-DDD-R-013` | forbidden body 入仓、observation 冒充业务 truth 或反写 source truth | project-wide immediate veto | redaction-first、body-free ref、Query zero-write、no-write guard 和 negative gate | 全体设计 / 实现 / 测试 / reviewer |
| `OBS-DDD-R-014` | 非 `L0-core` sibling 编译依赖或外部协作 truth 移入本仓 | immediate veto for dependency / integration boundary | 仅 `core-contracts` 编译依赖;其他协作使用 event / port / ref / handoff / fake | 架构维护者 / implementation reviewer |

#### 17.3 待确认事项表

| 事项 ID | 事项 | 当前影响 | 需要谁确认 | 未确认前处理方式 |
|---|---|---|---|---|
| `OBS-DDD-OQ-001` | Step 19 正式 `03` 装配与旧正文全量替换 | 决定正式详细设计 baseline | 详细设计维护者 / 用户 | 不改正式 `03`,不按旧正文开工 |
| `OBS-DDD-OQ-002` | `04` exact key / source / profile / activation / rollback | 决定可部署 config truth | 配置设计维护者 / 用户 | 只承认 Step 14 typed contract,代码不私定配置 |
| `OBS-DDD-OQ-003` | `05/06` suite / fixture / artifact / evidence / AC / VETO / reviewer 规则 | 决定 test cuts 的执行与裁决 | 测试 / 验收维护者 / 用户 | 不引用旧编号,不伪造 run / evidence / verdict |
| `OBS-DDD-OQ-004` | `07` boundary、审计、ledger 与 skeleton | 决定 implementation handoff | 实施计划维护者 / 用户 | 不自行拆 boundary,不移交实现 |
| `OBS-DDD-OQ-005` | 目标仓创建及 workspace / Cargo / git reality | 决定代码落点与提交条件 | 实施计划 / 实现 / core 负责人 | 仓不存在前不写代码;存在后先核实 |
| `OBS-DDD-OQ-006` | physical store / DDL / migration / capability | 决定 durable adapter | 架构 / infra / 配置 / 实施计划维护者 | 先保持 logical port / fake,不让产品 schema 改 domain |
| `OBS-DDD-OQ-007` | route / topic / RPC / schedule / ack / DLQ binding | 决定 entry / transport | 配置 / infra / Bus / entry owner | 保持 route-neutral;缺 binding 则 unavailable / fail startup |
| `OBS-DDD-OQ-008` | retention / lease / retry / batch / timeout 数值 | 决定资源与恢复节奏 | 配置 / infra / 运维 owner | bounded、non-zero、fail-closed;不继承 README 数字 |
| `OBS-DDD-OQ-009` | real adapter idempotency / probe / historical lookup capability | 决定 ambiguous recovery | adapter / external / infra owner | Unknown / Unsupported 转 manual,禁止 blind retry |
| `OBS-DDD-OQ-010` | old binding / secret rotation / activation / rollback / drain | 决定旧 intent 恢复 | 配置 / infra / security / 运维 owner | active / ambiguous material 存在时保留旧 binding identity |
| `OBS-DDD-OQ-011` | performance / capacity / availability / SLO baseline | 决定 NFR acceptance | 测试 / 验收 / 性能 owner | 标 `not_evaluated`,不沿用旧阈值或单样本 |
| `OBS-DDD-OQ-012` | scripts / artifact / report / evidence 的 boundary 与 schema | 决定 gate traceability | 测试 / 验收 / 实施计划维护者 | 只保留 planned contract,不创建虚构输出 |

#### 17.4 未确认前实现处理规则

1. 未获得正式文档来源的 schema、port、state、mapper、config、test、evidence 或 boundary,实现者必须暂停并回报 exact design gap,不得自行补设。
2. 产品或 transport 未确认时只允许正式设计定义的 fake / in-memory / disabled / controlled 语义;不允许把候选产品细节写入 contracts / domain / application。
3. external capability 未验证时 fail closed;ambiguous outcome 保留 durable intent 并 probe / manual,不得换 token、换 binding 或 blind retry。
4. reserved transition、read-access writer 和 future flow 当前不得暴露;Command / Job 同名必须由 typed family 静态判定。
5. 任何 raw body、evidence body、secret、source truth writeback、伪造 run / evidence / verdict / signoff 或非 core 编译依赖都立即否决受影响 boundary。

## 15. 自检与进入下一步条件

### 15.1 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否读取 Step 18 SOP、书写规范 5.17、当前 flow / ledger 和正式 `00/01/02` 风险章节 | pass | §3 |
| 是否读取 Step 01~17 未关闭问题并重点承接 Step 17 §13 / §15.1 | pass | §7~§11 |
| 是否只把 L1 项目作为粒度参考 | pass | 未复制相邻域 truth |
| 是否全量替换旧 81 行 Step 18 | pass | 旧 schema 摘要和自动门禁未继承 |
| 是否回答 SOP 四个问题 | pass | §4 |
| 是否区分已关闭问题、风险、待确认、implementation precondition 和普通任务 | pass | §6~§8 |
| 是否覆盖 Step 01~17 风险来源 | pass | §9.1 |
| 是否覆盖 observation / body-free / redaction / correlation / evidence / retention / handoff / no-write 核心边界 | pass | §9.2、§10 |
| 风险是否均有影响、阻塞范围、缓解和 owner | pass | 14 项见 §10 |
| 待确认事项是否均有影响、确认方、时点和未确认前处理 | pass | 12 项见 §11 |
| 是否区分新 blocker、既有 blocker、affected 与 implementation readiness | pass | new=`none`;I05/H13/open affected retained;readiness=`blocked` |
| 是否逐项保留 inherited affected | pass | §9.3 共 12 项；I05/J06=`positive_reserved`,`0/60` 无条件完成 |
| 是否保留产品、transport、capability 和数值的不确定性 | pass | 未脑补产品 / key / route / number |
| 是否明确 reserved transition 与 Command / Job 同名映射 | pass | `OBS-DDD-R-010~011` |
| 是否明确 ledger / skeleton 只在当前轮 `07` 完成时创建 | pass | `OBS-DDD-R-003`;§11.1 |
| 是否伪造代码、script、commit、run、artifact、report、evidence、verdict 或 signoff | no | 全文保持 planned / pending / not-run |
| 是否修改正式 `03-详细设计.md` | no | blocked until Step 19 |
| 是否读取或进入 Step 19 | no within this Step | 当前 M3 授权允许本步门禁通过后顺序进入 Step 19 |

### 15.2 进入下一步条件

```text
All Step 01~17 open items are classified as closed, risk, open question,
implementation precondition, boundary-specific precondition, or ordinary follow-up.
Every open risk has an impact, blocking scope, mitigation, and owner.
Every open question has a confirmation owner and pre-confirmation handling rule.
No new upstream blocker requires reopening 00/01/02.
Existing I05/H13 blockers and all inherited affected remain open with exact scopes.
Step 19 may continue only under the current M3 authorization and only after this gate.
```

### 15.3 门禁与当前恢复点

| gate | 状态 | 说明 |
|---|---|---|
| Step 18 输入门禁 | `pass` | 标准、上游、Step 01~17、历史材料和 L1 粒度参考已审计 |
| Step 18 内容门禁 | `pass_with_affected_open` | 12 个 inherited affected、14 个风险、12 个待确认、关闭项、阻塞范围和处理规则已闭合 |
| 本步新发现上游 blocker | `none` | 无需因本步发现回退正式 `00/01/02` |
| 既有 blocker / affected | `open` | I05=`open_upstream_internal`;H13=`open_controlled`;其余9项按 §9.3 阻塞 exact boundary |
| implementation readiness | `blocked` | formal `03`、current `04~07`、target repo、audit、ledger / skeleton、真实 gate / evidence 未满足 |
| 正式 `03` 门禁 | `blocked_until_current_step_19` | 4990 行 pre-M2 正文仍需 current assembly |
| Step 切换门禁 | `continue_M3_step_19_under_current_user_authorization` | 只允许顺序进入 Step 19,不得进入 `04` |

当前恢复点:

```text
03-详细设计 / Step 18 风险与待确认事项
gate_status = pass_with_affected_open
next_allowed_action = continue_M3_step_19_under_current_user_authorization
```
