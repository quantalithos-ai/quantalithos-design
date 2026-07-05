# Step 7. 定义接口、事件与跨仓同步验收

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 7
> 回填章节: `06-验收标准.md` §7 接口、事件与跨仓同步验收

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 7 定义接口、事件与跨仓同步验收 |
| 当前状态 | 已完成;用户审查通过 |
| 输入基线 | Step 5 功能门禁;Step 6 数据边界与架构红线;`03-详细设计.md` §7 / §8;`03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_14_config_external_binding.md`;`04-配置设计.md` §6 / §12;`05-测试方案.md` §6 / §9 / §13 |
| 输出文件 | `projects/L1-artifact/design-calibration/06_acceptance_step_07_interfaces_events_sync.md` |
| 停审方式 | 已获用户审查通过,进入 Step 8 |

## 2. 本步目标

把 `L1-artifact` 的 public protocol、事件协作、operations job 和跨仓同步接缝转成可裁决的验收门禁。

本 Step 只回答:

- 16 个 Command 如何按正式协议验收。
- 13 个 Query 如何按只读 surface、visibility 和 degraded surface 验收。
- 6 个 Inbound Event Consumer 如何按 envelope、duplicate replay、unsupported version 和 body-free 口径验收。
- 8 个 Outbound Event 如何按 stored payload snapshot、topic-neutral key 和 publisher marker 验收。
- 6 个 Operations Job 与 1 个 worker-only relay publication facade 如何按 report replay、partial failure 和 no truth repair 验收。
- 跨仓依赖如何区分 compile-time / runtime / event / handoff / downstream seam。
- 下游未就绪时如何使用 fake / controlled / disabled seam 证明 P0 语义。

本 Step 不重复字段级 DTO schema,不裁决状态事务细节,不裁决 evidence index 真实性。这些分别由 `03` Step 8 / 9、Step 8、Step 10 和 `05` 收口。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_05_function_gate.md` | 已完成 | 提供 AC-ART-001~020 的功能验收边界和证据锚点 |
| `06_acceptance_step_06_data_arch_redlines.md` | 已完成 | 提供 truth / snapshot / ref / forbidden body / no-write / no-truth-repair 红线 |
| `03-详细设计.md` §7 / §8 | 已完成 | 提供 public protocol inventory、函数级 flow 骨架和 replay 语义 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 提供 application service、repository、resolver、relay、handoff、UoW 和 result port |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 提供 16 Command、13 Query、6 Consumer、8 Outbound Event、6 Job 的协议名称和 carrier 约束 |
| `03_ddd_step_09_function_flows.md` | 已完成 | 提供 accepted / rejected / duplicate / replay / no-write / no-truth-repair 的函数级顺序 |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | 提供 topic-neutral key、external binding、adapter availability 和 disabled seam 责任边界 |
| `04-配置设计.md` §6 / §12 | 已完成 | 提供 runtime profile、topic binding、handoff target、replay root 和 fail-fast 语义 |
| `05-测试方案.md` §6 / §9 / §13 | 已完成 | 提供 TC-ART 用例族、blocking suite 和 `EV-CAND-ART-*` 证据路径 |
| `projects/L1-governance/design-calibration/06_acceptance_step_07_interfaces_events_sync.md` | 已读取 | 仅作为粒度与结构参考,不复用 governance 专属语义 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 Command / Query 如何验收? | Command 按 16 个正式协议验收,必须验证 metadata、idempotency、accepted side effect、stored result 和 negative reject。Query 按 13 个正式协议验收,必须验证 no-write、visibility、degraded、stale、missing 和 page surface。 |
| Consumer / Outbound / Job 如何验收? | 6 个 Consumer 必须验证 v1 envelope、duplicate replay、unsupported version no-parse/no-write、snapshot/reference/stale marker 和 body-free。8 个 Outbound Event 必须验证 stored payload snapshot、topic-neutral key、topic completeness 和 publish failure marker。6 个 Job 必须验证 public input、stored report replay、partial failure、marker/report 写入和 no truth repair。 |
| worker-only relay publication facade 是否算 public job? | 不算。`PublishPendingArtifactRelays` 仍然是 worker-only internal facade,只在 worker relay loop 中验收,不并入 6 个 public job。 |
| 跨仓同步成功标准是什么? | P0 不要求相邻仓完整实现。成功标准是本仓对外只使用 formal ref / snapshot / marker / event / handoff seam,并在下游 unavailable / disabled 时给出 delayed / rejected / failed / residual surface。 |
| 下游未就绪时如何验接缝? | 使用 fake / controlled / disabled seam 证明 P0 语义。运行期来源不可用时只写 degraded / delayed / failed marker;external target disabled 时 job / handoff 被拒绝或跳过,不得伪造 truth。 |
| 跨仓依赖如何分类? | `L0-core/core-contracts` 是唯一编译期依赖;其余 `L1-`、`L3-`、`L4-`、`L5-` 仓只允许通过 runtime / event / handoff / downstream seam 协作。 |
| 是否要求 transport topic / HTTP path 在本 Step 闭口? | 不要求。本 Step 只验 route-neutral / topic-neutral / job-name-neutral 的 acceptance 规则,真实 transport 绑定留给 `04` 配置和实现层。 |
| 是否要求下游仓完整实现才能通过? | 不要求。本 Step 只验本仓接缝和下游未就绪裁决;下游完整实现属于相邻仓自己的设计与实施门禁。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 接口验收只聚焦旧同步 API,缺少 consumer / outbound / job / relay facade / dependency seam | 重建为 Command / Query / Consumer / Outbound / Job / relay / dependency 验收 |
| `03` / `05` | 已有 16 / 13 / 6 / 8 / 6 inventory,但验收尚未把它们收束成可裁决项 | 本 Step 转成 `AC-ART-026~032` 和协议闭环矩阵 |
| `04-配置设计.md` | topic binding、handoff target 和 replay root 已定义,但验收未把它们转成接口门禁 | 本 Step 增加 config binding 和 downstream not-ready 裁决 |
| Step 6 | 已收口数据边界和 no-write / no-truth-repair,但未覆盖 protocol / event / sync seam | 本 Step 专注接口、事件和跨仓同步 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 接口范围 | 只看同步入口 | Command、Query、Consumer、Outbound Event、Job、worker-only relay facade | 承接正式 `03` protocol inventory |
| 事件范围 | 容易混成“有消息就行” | 只看 v1 envelope、stored snapshot、topic-neutral key 和 publication marker | 防止 current truth 重算 |
| 同步边界 | 容易写成“下游完整可用” | 按 compile / runtime / event / handoff / downstream seam 验收 | 避免误把相邻仓内部 truth 当本仓门禁 |
| 不可用场景 | 容易伪通过或误判失败 | fake / controlled / disabled seam + residual 处理 | 防止 P1/P2 污染 P0 |

## 7. 验收裁决取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否把 16/13/6/8/6 全部写成独立验收项 | A. 每个一项;B. 按协议族分组并列正式清单 | 采用 B。正式清单保证不漏项,分组门禁保证 `06` 可读和可裁决 |
| 是否在验收标准中写 transport topic / HTTP path | A. 写真实 route;B. 只写 protocol name / topic-neutral key / job route | 采用 B。真实 route 属配置 / 部署,且可能敏感 |
| 是否要求下游仓真实实现通过 | A. 要求;B. 只验正式接缝 | 采用 B。仓级 P0 验收不验相邻仓内部 truth |
| 是否把 `PublishPendingArtifactRelays` 当成 public job | A. 计入;B. 作为 worker-only facade 单列 | 采用 B。它是 worker relay publication loop,不改变 public job 口径 |
| 是否允许 P1/P2 selected-run 补 P0 通过证据 | A. 允许;B. 不允许 | 采用 B。P1/P2 只进 residual / future |

## 8. 结构化中间产物

### 8.1 接口与同步验收表

| 验收项 ID | 验收主题 | 设计契约 | 测试用例 | 证据候选 ID | report path | 裁决影响 |
|---|---|---|---|---|---|---|
| AC-ART-026 | Command public protocol | `03` §7.1;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_09_function_flows.md` | `TC-ART-CMD-001~016` | `EV-CAND-ART-CMD-*` | `reports/runs/<run_id>/suites/service-flow-fast.md` | 任一 Command 缺失、metadata/idempotency 失败、accepted side effect 不闭合则不通过 |
| AC-ART-027 | Query public protocol | `03` §7.2;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_09_function_flows.md` | `TC-ART-QUERY-001~013` | `EV-CAND-ART-QUERY-*` | `reports/runs/<run_id>/suites/service-flow-fast.md` | 任一 Query 缺失、no-write 失守、visibility/degraded surface 不闭合则不通过 |
| AC-ART-028 | Inbound Event Consumer | `03` §7.3;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_09_function_flows.md` | `TC-ART-CONSUMER-001~006` | `EV-CAND-ART-CONSUMER-*` | `reports/runs/<run_id>/suites/entry-worker-job.md` | 任一 Consumer 缺失、unsupported version 误解析、snapshot/reference/stale marker 不闭合则不通过 |
| AC-ART-029 | Outbound Event + worker relay | `03` §7.3;`03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_09_function_flows.md` | `TC-ART-OUTBOX-001~008`;`TC-ART-RELAY-001` | `EV-CAND-ART-OUTBOX-*`;`EV-CAND-ART-RELAY-*` | `reports/runs/<run_id>/suites/operations-replay-core.md`;`reports/runs/<run_id>/suites/entry-worker-job.md` | 任一 Outbound Event / relay 缺失、current truth 重算、publish failure marker 不闭合则不通过 |
| AC-ART-030 | Operations Job | `03` §7.4;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_09_function_flows.md` | `TC-ART-JOB-001~006` | `EV-CAND-ART-JOB-*`;`EV-CAND-ART-HANDOFF-*` | `reports/runs/<run_id>/suites/operations-replay-core.md`;`reports/runs/<run_id>/suites/entry-worker-job.md` | 任一 Job 缺失、duplicate report replay / partial failure / no truth repair 不闭合则不通过 |
| AC-ART-031 | topic-neutral key / config binding completeness | `03_ddd_step_14_config_external_binding.md`;`04` §6 / §12 | `TC-ART-CONFIG-001~004`;`TC-ART-OUTBOX-001~008` | `EV-CAND-ART-CONFIG-*`;`EV-CAND-ART-OUTBOX-*` | `reports/runs/<run_id>/suites/config-redline.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | enabled binding 缺失、transport route 进入 acceptance truth 或 topic completeness 不闭合则不通过 |
| AC-ART-032 | cross-repo dependency seam | `01-架构设计.md` §8;`03` §7~§8;`04` §6 / §12 | `TC-ART-ARCH-001`;`TC-ART-CONSUMER-*`;`TC-ART-JOB-*` | `EV-CAND-ART-ARCH-*`;`EV-CAND-ART-HANDOFF-*` | `reports/runs/<run_id>/dependency-boundary.md`;`reports/runs/<run_id>/suites/entry-worker-job.md` | 编译期 sibling 依赖、下游完整实现误要求或未就绪伪通过则不通过 |

### 8.2 协议闭环矩阵

| 验收项 ID | 正式协议 / seam | 通过条件 | 失败条件 | 证据与报告 |
|---|---|---|---|---|
| AC-ART-026 | 16 Command: `RegisterArtifactIntake`、`EstablishArtifactFact`、`CreateArtifactVersionCandidate`、`PublishArtifactVersion`、`SupersedeArtifactVersion`、`EstablishArtifactLineageLink`、`RejectArtifactLineageLink`、`CreateArtifactBaselineCandidate`、`FreezeArtifactBaseline`、`SupersedeArtifactBaseline`、`OpenArtifactReviewAnchor`、`AssignArtifactResponsibility`、`RegisterAutomationArtifactInput`、`AcceptAutomationArtifactInput`、`IssueConsumableArtifactReference`、`RecordArtifactConsumptionBackref` | metadata、idempotency、accepted transaction side effects、stored result、negative reject 均闭合 | 漏任一 command / reject / replay / conflict / stored result surface | `TC-ART-CMD-*`;`EV-CAND-ART-CMD-*`;`service-flow-fast.md` |
| AC-ART-027 | 13 Query: `GetArtifactFact`、`GetArtifactVersion`、`ListArtifactVersionsByFact`、`GetArtifactLineageSummary`、`GetArtifactBaseline`、`GetArtifactReviewSummary`、`GetArtifactReadSurface`、`GetArtifactTrace`、`SearchArtifactFacts`、`GetArtifactPreview`、`GetArtifactReport`、`GetArtifactReconciliationReport`、`GetExternalReferenceResolution` | no-write、visibility、degraded、stale、missing、empty page surface 均闭合 | query 写 truth / projection / report 或 selector 不闭合 | `TC-ART-QUERY-*`;`EV-CAND-ART-QUERY-*`;`service-flow-fast.md` |
| AC-ART-028 | 6 Consumer: `ConsumeWorkArtifactContextChanged`、`ConsumeProcessArtifactContextChanged`、`ConsumeGovernanceArtifactContextChanged`、`ConsumeMethodArtifactDefinitionChanged`、`ConsumeRuntimeArtifactSignalRecorded`、`ConsumeExternalContentSourceChanged` | v1 envelope、duplicate replay、unsupported version no-parse/no-write、snapshot/reference/stale marker、body-free 均闭合 | consumer 解析外部正文、创建核心 truth 或静默吞 unsupported | `TC-ART-CONSUMER-*`;`EV-CAND-ART-CONSUMER-*`;`entry-worker-job.md` |
| AC-ART-029 | 8 Outbound Event + `PublishPendingArtifactRelays` | stored payload snapshot、topic-neutral key、publisher marker、publish failure 不回滚 accepted truth、worker-only relay facade 独立闭口 | event 从 current truth 重算、relay loop 被计入 public job、publish failure 回滚 truth | `TC-ART-OUTBOX-*`;`TC-ART-RELAY-001`;`EV-CAND-ART-OUTBOX-*`;`EV-CAND-ART-RELAY-*`;`operations-replay-core.md` |
| AC-ART-030 | 6 public Jobs: `RebuildArtifactDerivedViews`、`RefreshExternalReferenceStates`、`RunArtifactReconciliation`、`PrepareArtifactArchiveHandoff`、`PrepareArtifactObservabilityHandoff`、`PrepareArtifactSyncHandoff` | public input、stored report replay、partial failure、no truth repair、disabled target surface 均闭合 | job 修复核心 truth、重复重跑 mutation、报告缺失或静默成功 | `TC-ART-JOB-*`;`EV-CAND-ART-JOB-*`;`EV-CAND-ART-HANDOFF-*`;`operations-replay-core.md` |
| AC-ART-031 | topic-neutral key / config binding | enabled key 有 binding、disabled feature 不要求 binding、route 不进入 acceptance truth | enabled key 缺 binding 仍启动或 config 替代 protocol truth | `TC-ART-CONFIG-*`;`EV-CAND-ART-CONFIG-*`;`config-redline.md` |
| AC-ART-032 | compile/runtime/event/handoff/downstream seam | `L0-core/core-contracts` 之外无 compile-time sibling；下游未就绪以 degraded / delayed / failed / residual 裁决 | 误要求下游完整实现、把 downstream unavailable 判成 P0 passed、编译期打穿边界 | `TC-ART-ARCH-001`;`EV-CAND-ART-ARCH-*`;`dependency-boundary.md` |

### 8.3 跨仓依赖类型映射表

| 关联对象 | 依赖类型 | 协作方式 | P0 验收方式 | 禁止误判 |
|---|---|---|---|---|
| `L0-core` / core-contracts | 编译期依赖 | shared ID、ActorRef、TraceContext、Error、metadata | dependency-boundary / contract compile | 不得复制 core 类型或绕过 shared metadata |
| `L0-bus` | 运行期 / 事件协作 | outbound publish / inbound delivery seam | fake publisher topic map、outbox marker、consumer receipt | 不得把 bus 实现写成编译期依赖 |
| `L1-identity` | 运行期 / 事件协作 | actor capability snapshot / consumer | fake resolver / consumer receipt | 不验 identity 生命周期 |
| `L1-process` | 运行期 / 事件协作 | process context ref / decision consume | process context consumer / safe summary / outbox decision event | 不验 process 内部状态机 |
| `L1-work` | 运行期 / 事件协作 | work context ref / policy/control consumption | work context consumer / safe summary / outbox event | 不验 work 内部生命周期 |
| `L1-conversation` / workspace / console | 下游消费 | display context、read surface、handoff view | query / outbound / handoff seam | 不让 UI 状态替代 truth |
| `L1-method-library` | 运行期 / 事件协作 | method definition safe summary / consumer | method definition consumer / safe summary | 不保存 method 正文 |
| `L2-runtime` / capability | runtime feedback | runtime signal / capability summary | runtime signal consumer | 不让 runtime cache/tool result 定义 truth |
| `L4-observability` | 事件 + handoff | alert summary input;trace/audit output handoff | alert consumer、trace handoff job | 不拥有 log/metric/trace body |
| `L4-archive` | handoff | archive handoff marker、trace / report refs | archive handoff job | 不保存 archive package body |
| `L0-sdk` / `L5-console` / `L5-sync` | 下游消费 | external read / sync / handoff seam | query / handoff / sync seam | 不让入口 UI / 同步副本内部状态成为 truth |
| external content source | runtime / event | source ref、resolution state、degraded / unavailable surface | consumer / query / job seam | 不保存 external body |

### 8.4 下游未就绪裁决表

| 场景 | P0 裁决 | 证据要求 | 不允许 |
|---|---|---|---|
| 运行期来源不可用 | 通过 degraded / delayed / failed marker 裁决 | fake / controlled adapter failure evidence、consumer receipt / job report | 伪造外部 truth 或复制正文 |
| inbound event unsupported version | rejected / no-parse / no-write 裁决 | `TC-ART-CONSUMER-001~006`、`EV-CAND-ART-CONSUMER-*` | 解析 payload 后再拒绝 |
| outbound publisher unavailable | accepted truth 不回滚;publication failed marker | `TC-ART-OUTBOX-*`、`TC-ART-RELAY-001`、`EV-CAND-ART-OUTBOX-*` | publisher failure 回滚 truth |
| archive / observability / sync target disabled | job rejected / skipped / failed with report | `TC-ART-JOB-004~006`、`EV-CAND-ART-HANDOFF-*` | disabled target 仍改 truth |
| real-like / staging-like 未运行 | P0 不受影响;进入 residual | `reports/acceptance/risk-acceptance.md` when relevant | 标成 P0 passed 或 P0 failed |

### 8.5 接口 / 事件 / 同步停审记录

| 验收项 ID | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| AC-ART-026~027 | Command / Query 协议名、metadata、idempotency、no-write / degraded surface 是否固定 | 通过 | formal inventory 已闭口,仅保留 Step 8 状态 / 一致性加严 |
| AC-ART-028 | Consumer 是否不写核心 truth、不保存正文、unsupported version no-parse | 通过 | Step 10 继续审计 receipt / raw artifact pairing |
| AC-ART-029 | Outbound Event 是否从 stored payload snapshot 发布,worker-only relay 是否独立 | 通过 | topic binding 由 `04` 和 Step 8 / Step 10 继续证明 |
| AC-ART-030 | Job input/report/duplicate replay/no truth repair 是否固定 | 通过 | 幂等与事务细节由 Step 8 加严 |
| AC-ART-031 | topic-neutral key / config binding 是否闭合 | 通过 | 不写真实 transport route 或 secret |
| AC-ART-032 | 跨仓依赖类型是否正确 | 通过 | 不要求下游仓完整实现 |

### 8.6 跨接口同步门禁审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否存在 P0 public protocol 缺门禁 | 未发现 | 16 Command、13 Query、6 Consumer、8 Outbound Event、6 Job 均覆盖 |
| 是否存在依赖类型误判 | 未发现 | 编译期依赖仅 `L0-core/core-contracts` |
| 是否误要求下游完整实现 | 未发现 | 只验 ref / snapshot / event / handoff / downstream seam |
| 是否存在 topic / route 误写 | 未发现 | 使用 topic-neutral key;transport binding 留配置证据 |
| 是否存在 worker-only relay facade 计数错误 | 未发现 | `PublishPendingArtifactRelays` 未并入 6 个 public job |
| 是否存在 P1/P2 污染 P0 | 未发现 | real-like/staging-like/external deep integration 留 residual |
| 是否存在证据路径断裂 | 未发现设计层断裂 | 正式验收仍需固定 `<run_id>` 和 evidence index |

## 9. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_07_interfaces_events_sync.md`

正式 `06-验收标准.md` §7 应回填:

- P0 接口验收覆盖 16 个 Command、13 个 Query、6 个 Inbound Event Consumer、8 个 Outbound Event、6 个 Operations Job 和 1 个 worker-only relay publication facade。
- Command 必须证明 metadata、idempotency、accepted transaction side effects、stored result 和 negative reject。
- Query 必须证明 no-write、visibility、degraded、stale、missing 和 empty page surface。
- Consumer 必须证明 v1 envelope、duplicate replay、unsupported version no-parse/no-write、snapshot/reference/stale marker 和 body-free。
- Outbound Event 必须证明 stored payload snapshot、topic-neutral key、topic completeness 和 publish failure marker;不得从 current truth 重算。
- Job 必须证明 public input、stored report duplicate replay、partial failure、marker/report 写入和 no truth repair。
- 跨仓验收必须区分 compile/runtime/event/handoff/downstream 依赖类型;除 `L0-core` / core-contracts 外不得要求或引入 sibling compile dependency。
- 下游未就绪时 P0 只验 fake / controlled / disabled seam;真实 selected-run 不作为 P0 通过前置。

## 10. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 是否在正式 `06` 中把 16/13/6/8/6 全部展开到同粒度清单 | 影响正文长度 | 当前采用协议族分组 + formal inventory 引用 |
| 是否需要在正式 `06` 中单列 `PublishPendingArtifactRelays` | 影响 worker-only facade 显式度 | 当前保留为独立 note，不并入 public job 计数 |
| 是否需要把 `AC-ART-031` 的 config binding 进一步拆成 topic / handler / handoff 三段 | 影响可读性 | 当前以 topic-neutral / binding completeness 统一闭口 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 接口、事件和同步都有裁决口径 | 通过 | 见 §8.2 / §8.3 |
| 依赖类型已区分 | 通过 | 见 §8.1 |
| 下游未就绪裁决清楚 | 通过 | 见 §8.4 |
| 接口 / 事件 / 同步停审已完成 | 通过 | 见 §8.5 |
| 跨接口同步门禁审计无 unresolved 冲突 | 通过 | 见 §8.6 |
| 可进入 Step 8 | 通过 | 下一步定义状态机、事务与一致性验收 |
