# Step 6. 定义数据边界与架构红线验收

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 6
> 回填章节: `06-验收标准.md` §6 数据边界与架构红线验收

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 6 定义数据边界与架构红线验收 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 5 功能门禁;`00-需求文档.md` §7 / §9 / §11 / §14 / §15 / §16;`01-架构设计.md` §3 / §4 / §8 / §9 / §13;`02-概要设计.md` §7 / §8 / §9 / §11 / §12;`03-详细设计.md` §5 / §7 / §8 / §9 / §10 / §11 / §12 / §13 / §14 / §15 / §16;`04-配置设计.md` §6 / §9 / §11 / §12 / §13 / §14;`05-测试方案.md` §2 / §8 / §10 / §13 / §14;`projects/L1-governance/design-calibration/06_acceptance_step_06_data_arch_redlines.md` (granularity reference only) |
| 输出文件 | `projects/L1-artifact/design-calibration/06_acceptance_step_06_data_arch_redlines.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 7 |

## 2. 本步目标

把 Artifact truth 的数据所有权、相邻仓边界、禁止正文、派生不反写、依赖裁剪和 P1/P2 防污染转成可检查的验收红线。

本 Step 只回答:

- 哪些数据不得由 `L1-artifact` 保存。
- 哪些相邻仓、下游、外部系统或 UI 不得反向改写 Artifact truth。
- 哪些 projection / read model / report / job / cache 不得反写真相。
- 哪些 P1/P2 能力不得污染 P0 验收。
- 红线失败时是否进入 Step 11 一票否决候选。

本 Step 不展开每个 Command / Query / Consumer / Event / Job 的接口验收细节,不裁决状态机、事务、幂等和证据真实性细节。这些分别由 Step 7~10 收口。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_02_scope.md` | 已完成 | 提供 P0 / P1 / P2 验收范围、只验接缝和 residual 口径 |
| `06_acceptance_step_05_function_gate.md` | 已完成 | 提供功能门禁与 `AC-ART-001~020` 的边界 |
| `00-需求文档.md` §7 / §9 / §11 / §14 / §15 / §16 | 已完成 | 提供 `BR-ART-001~025`、`VF-ART-001~004`、数据归属和追溯矩阵 |
| `01-架构设计.md` §3 / §4 / §8 / §9 / §13 | 已完成 | 提供 truth ownership、依赖裁剪、数据所有权和横切红线 |
| `02-概要设计.md` §7 / §8 / §9 / §11 / §12 | 已完成 | 提供组件、接口骨架、处理流、状态集合和配置影响 |
| `03-详细设计.md` §5 / §7 / §8 / §9 / §10 / §11 / §12 / §13 / §14 / §15 / §16 | 已完成 | 提供对象、protocol、flow、state、transaction、idempotency、error、observability 和 test cuts |
| `04-配置设计.md` §6 / §9 / §11 / §12 / §13 / §14 | 已完成 | 提供 P0 / P1 / P2 profile、strict validation、degraded / no-write 和 replay 口径 |
| `05-测试方案.md` §2 / §8 / §10 / §13 / §14 | 已完成 | 提供 `TC-ART-*`、`EV-CAND-ART-*`、suite / gate、artifact / report root 和 residual risk |
| `projects/L1-governance/design-calibration/06_acceptance_step_06_data_arch_redlines.md` | 已读取 | 仅作为粒度和结构参考,不复用 governance 专属政策 / 决策语义 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些数据不得由本仓保存? | work / process / governance / conversation / workspace / archive / observability / method / runtime / capability 的正文或主 truth 不得保存为 Artifact truth;只能保存 ref、safe summary、snapshot、marker、handoff material 或 Artifact 自身结论。 |
| 哪些下游不得反向改写 truth? | query、projection、report、consumer、job、handoff、sync、archive、observability、console、SDK 和相邻仓状态均不得创建、批准、关闭、覆盖或回写 Artifact fact / version / lineage / baseline truth。 |
| 哪些 projection / cache / report 不得反写真相? | Artifact read model、search index、preview、report、reconciliation、handoff preparation、runtime cache、sync copy、dashboard view 和 maintenance view 均只能派生,不得成为 truth source。 |
| 哪些 P1 / P2 能力不得污染 P0? | real-like resolver / publisher / durable store / bus、staging-like / production-like、capacity / SLO、advanced dashboard / search、external provider live seam 只可作为 residual 或 future,不得替代 P0 fake / controlled / disabled 证据。 |
| 红线失败时是否进入 Step 11 一票否决候选? | 直接打到 truth ownership、external body、version / lineage / baseline、query no-write、job no-truth-repair、dependency boundary 或 evidence integrity 的失败,必须登记为 Step 11 候选;是否正式 VETO 仍由 Step 11 收口。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` §4~§7 | 旧功能门禁围绕 CreateArtifact / PublishArtifactVersion / EvidenceRef / FreezeBaseline 少量旧主线,没有新版 Artifact truth boundary 的红线分层 | 本 Step 改为 truth / snapshot / ref / forbidden body / no-write / no-truth-repair / dependency / pollution 的红线裁决 |
| 旧 `06-验收标准.md` | 数据边界与架构红线没有显式分层,也没有支持 step-level 停审的红线表 | 本 Step 增加 RL-ART 和 AC-ART 闭环矩阵 |
| `05-测试方案.md` | 已有 truth ownership、cross-repo boundary、redaction、dependency、replay 和 report audit 的测试主线,但验收尚未把它们转成裁决条目 | 本 Step 将测试主线转成验收红线和 `AC-ART-021~025` |
| Step 5 | 功能门禁已判定五个核心能力,但还没收口哪些 data plane / read plane / maintenance plane 绝不能越界 | 本 Step 补齐数据边界和架构红线 |
| governance Step 6 | governance 的 Step 6 更强调 policy / decision / NC / AIIA / SoA 红线 | Artifact 的 Step 6 只借用其结构,不借用治理专属主语;重点改为 truth、body、snapshot、projection 和 no-truth-repair |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 数据边界 | 仅在需求 / 架构 / 详细设计中分散出现 | 收敛为 Artifact truth、snapshot、reference、forbidden body 四层 | 验收必须可定位违规类型 |
| 架构红线 | 只有功能门禁的隐含前提 | 显式成红线验收表和闭环矩阵 | 便于后续 Step 11 / Step 14 引用 |
| 下游关系 | 容易被写成“能力可用” | 强制只测接缝,不验相邻仓内部 truth | 保持仓级边界 |
| P1 / P2 | 容易被混成补证据 | 明确为 residual / future,不能污染 P0 | 防止真实产品不可用被静默遮蔽 |
| 依赖边界 | 只在架构中说明 | 作为验收红线独立裁决 | 防止编译期 sibling 依赖打穿边界 |

## 7. 验收裁决取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否延续 governance Step 6 的结构 | A. 完全照搬;B. 仅借用红线表 / AC 矩阵结构 | 采用 B。Artifact 不需要 governance 的 policy / decision / NC / SoA 语义,但需要同等级的红线分层 |
| 是否把 projection / report / handoff 作为独立真相 | A. 允许;B. 不允许 | 采用 B。它们只能是派生或交接材料 |
| 是否把 query / job / consumer 的修复能力写成正向能力 | A. 允许;B. 不允许 | 采用 B。它们只能 no-write / no-truth-repair |
| 是否允许 P1 / P2 selected-run 代替 P0 红线证据 | A. 允许;B. 不允许 | 采用 B。P1 / P2 只能进入 residual 或 future |
| 是否在 Step 6 直接裁决 VETO | A. 直接裁决;B. 只登记 Step 11 候选 | 采用 B。Step 6 记录可触发 VETO 的红线,Step 11 正式裁决 |

## 8. 结构化中间产物

### 8.1 Artifact 数据红线表

| 红线 ID | 红线 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|
| RL-ART-001 | Artifact truth 独立归属 | Artifact fact / version / lineage / baseline / consumable backref 由本仓正式承载,不依赖旁路正文 | 相邻仓 truth、运行正文或消费副本成为事实来源 | `TC-ART-CONTRACT-*`;`TC-ART-STATE-*`;`EV-CAND-ART-CORE-*` |
| RL-ART-002 | sibling truth 不入仓 | work / process / governance / conversation / workspace / archive / observability / method / runtime / capability 的主 truth 不入仓 | 任一相邻仓正文、主 truth 或私有状态被当成 Artifact truth 保存 | `TC-ART-BOUNDARY-*`;`TC-ART-REDACTION-*`;`EV-CAND-ART-BOUNDARY-*` |
| RL-ART-003 | 外部正文禁止入 truth | 外部正文只能变成 ref / safe summary / snapshot / marker | raw body、full sensitive ref、runtime output body、tool output body、method正文进入 truth / report / handoff | `TC-ART-REDACTION-*`;`TC-ART-OUTBOX-*`;`EV-CAND-ART-REDACTION-*` |
| RL-ART-004 | 版本 truth 不无声覆盖 | current pointer、history、candidate、supersede 和 duplicate replay 可追溯 | current truth 被静默覆盖、历史版本被删除或 replay 重算 current truth | `TC-ART-CMD-*`;`TC-ART-IDEMP-*`;`EV-CAND-ART-VERSION-*` |
| RL-ART-005 | 血缘 truth 只锚正式版本 | lineage 只能锚定正式 fact / version,并支持来源 / 影响 / 替代 / 依赖 / 审查语境 | trace、event、tool result、runtime signal 或私有追溯链补造 lineage | `TC-ART-LINEAGE-*`;`TC-ART-TRACE-*`;`EV-CAND-ART-LINEAGE-*` |
| RL-ART-006 | baseline 只收正式 version | baseline candidate、freeze、supersede 和 history audit 只接正式 versions | 非正式材料、临时清单、发布说明或 current latest 替代 baseline | `TC-ART-BASELINE-*`;`TC-ART-JOB-*`;`EV-CAND-ART-BASELINE-*` |
| RL-ART-007 | consumable ref 不转 ownership | consumer / sync / archive / observability 只能引用、展示、封存、观测或同步正式 truth | 消费方复制、接管、重建或反写 Artifact truth | `TC-ART-CONSUME-*`;`TC-ART-HANDOFF-*`;`EV-CAND-ART-HANDOFF-*` |
| RL-ART-008 | query / projection / report no-write | query、projection、report、reconciliation、maintenance 只能读 truth 或写派生 marker | query refresh / rebuild / repair、report rewrite truth、projection 变成 truth source | `TC-ART-QUERY-*`;`TC-ART-JOB-*`;`EV-CAND-ART-QUERY-*` |
| RL-ART-009 | consumer / job no-truth-repair | inbound consumer 只写 snapshot / marker / receipt,public job 只写 derived / report / handoff | consumer 或 job 直接创建、修复、批准、关闭或覆盖核心 truth | `TC-ART-CONSUMER-*`;`TC-ART-JOB-*`;`EV-CAND-ART-CONSUMER-*`;`EV-CAND-ART-JOB-*` |
| RL-ART-010 | 依赖裁剪保持 compile-time 窄边界 | 除 `L0-core/core-contracts` 外,无 sibling compile-time dependency | `L1-work`、`L1-process`、`L1-governance`、`L3-method-library`、`L4-observability`、`L4-archive`、`L0-sdk`、`L5-console`、`L5-sync` 进入 Cargo path 依赖 | `TC-ART-ARCH-001`;`EV-CAND-ART-ARCH-001` |
| RL-ART-011 | P1 / P2 不污染 P0 | real-like / production-like / capacity / advanced analytics 只作为 residual / future | P1 / P2 结果替代 P0 fake / controlled / disabled 证据,或未运行被当成通过 | `EV-CAND-ART-CONFIG-*`;`EV-CAND-ART-REPORT-*`;`EV-CAND-ART-REDACTION-*` |

### 8.2 数据边界闭环矩阵

| 验收项 ID | 验收主题 | 设计契约 | 测试用例 | 证据候选 ID | report path | 裁决影响 |
|---|---|---|---|---|---|---|
| AC-ART-021 | Artifact truth 归属正确 | `01` §9;`03` §5 / §6 / §9 | `TC-ART-CONTRACT-*`;`TC-ART-STATE-*` | `EV-CAND-ART-CORE-*`;`EV-CAND-ART-STATE-*` | `reports/runs/<run_id>/suites/contract-domain-fast.md` | 失败则不通过 |
| AC-ART-022 | 外部正文与 forbidden body 不入 truth | `01` §8 / §9;`03` §12 / §14;`04` §8 / §12 | `TC-ART-REDACTION-*`;`TC-ART-CONSUMER-*`;`TC-ART-OUTBOX-*` | `EV-CAND-ART-REDACTION-*`;`EV-CAND-ART-OUTBOX-*` | `reports/runs/<run_id>/redaction-check.md`;`reports/runs/<run_id>/suites/entry-worker-job.md` | 失败则不通过,可触发 `VF-ART-002` 候选 |
| AC-ART-023 | version / lineage / baseline 真运动作稳定 | `03` §7 / §9 / §10 / §11 / §13 | `TC-ART-CMD-*`;`TC-ART-QUERY-*`;`TC-ART-IDEMP-*` | `EV-CAND-ART-VERSION-*`;`EV-CAND-ART-LINEAGE-*`;`EV-CAND-ART-BASELINE-*`;`EV-CAND-ART-IDEMP-*` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | 失败则不通过,可触发 `VF-ART-003` 候选 |
| AC-ART-024 | query / projection / report / consumer / job no-write | `03` §7 / §8 / §14 / §15 | `TC-ART-QUERY-*`;`TC-ART-CONSUMER-*`;`TC-ART-JOB-*` | `EV-CAND-ART-QUERY-*`;`EV-CAND-ART-CONSUMER-*`;`EV-CAND-ART-JOB-*` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | 失败则不通过,可触发 `VF-ART-004` 候选 |
| AC-ART-025 | dependency boundary 与 P1/P2 防污染成立 | `01` §8;`03` §3 / §4 / §13;`04` §6 / §9 / §11 / §12 | `TC-ART-ARCH-*`;`TC-ART-CONFIG-*`;`TC-ART-REPORT-*` | `EV-CAND-ART-ARCH-*`;`EV-CAND-ART-CONFIG-*`;`EV-CAND-ART-REPORT-*` | `reports/runs/<run_id>/dependency-boundary.md`;`reports/runs/<run_id>/report-audit.md` | 失败则不通过 |

### 8.3 不得由本仓保存的数据清单

| 数据类别 | 禁止保存为 Artifact truth | 允许的最小形态 |
|---|---|---|
| Work / Process | work item、activity、checkpoint、recovery body | work / process ref、safe summary、backref |
| Governance | decision body、policy body、AIIA / SoA body、NC body | governance ref、safe summary、evidence backref |
| Method / Runtime | method definition body、standard body、tool result body、runtime execution body | definition ref、runtime signal ref、safe summary |
| Conversation / Workspace / Console | conversation body、workspace private copy、console private state | conversation / workspace ref、display marker、safe summary |
| Archive / Observability | archive package body、trace body、metrics body、audit body | archive / trace / audit ref、safe marker |
| External content | external response body、full sensitive ref、raw source payload | source ref、resolution state、summary、snapshot |
| Derived surfaces | search index body、report body、preview body、projection body、reconciliation body | derived summary、view ref、marker、refresh ref |

### 8.4 P1 / P2 防污染规则

| P1 / P2 能力 | P0 中允许的证明 | 禁止做法 |
|---|---|---|
| real-like resolver / publisher / durable store / bus | fake / controlled / disabled seam + failure mapping | 用真实产品 selected-run 直接代替 P0 红线证据 |
| staging-like / production-like | residual / future readiness 记录 | 因未运行而判 P0 失败,或因运行过而跳过 P0 fake 证据 |
| capacity / SLO / advanced analytics | sample / trend / future note | 把趋势或样本硬化成当前 P0 pass threshold |
| external provider live behavior | disabled / controlled / unavailable seam 结果 | 让外部产品 live 状态成为 Artifact truth 来源 |
| complex orchestration / UI polish | read surface / report / handoff marker 证明 | 用复杂编排状态直接覆盖 truth / no-write 门禁 |
| select-run only evidence | residual / unavailable | 以 P1 不可用偷换成 P0 fail 或 P0 pass |

### 8.5 跨红线审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否存在数据不得保存清单缺口 | 未发现 | 见 §8.3 |
| 是否存在 query / projection / report / job 反写 truth 口径 | 未发现 | no-write / no-truth-repair 已单列 |
| 是否存在外部正文、runtime body、method body 进入 truth 的口径 | 未发现 | forbidden body 已单列 |
| 是否存在 P1 / P2 污染 P0 | 未发现 | 见 §8.4 |
| 是否存在非 core sibling 编译期依赖口径 | 未发现 | 依赖裁剪已独立裁决 |
| 是否提前替代 Step 11 VETO | 未提前 | 只记录候选影响 |
| 是否要求下游仓完整实现 | 未要求 | 只验接缝与红线，不验对方内部 truth |

## 9. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_06_data_arch_redlines.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“Artifact 数据红线表”“数据边界闭环矩阵”“不得由本仓保存的数据清单”“P1 / P2 防污染规则”和“跨红线审计表”小节,了解数据边界与架构红线如何从需求、架构、详细设计和测试证据收敛。

正式 `06-验收标准.md` §6 应回填:

- 数据边界与架构红线验收覆盖 `AC-ART-021~025`。
- `L1-artifact` 只能拥有 Artifact fact / version / lineage / baseline / consumable backref truth,不得保存相邻仓正文或外部主 truth。
- query、projection、report、consumer、job、handoff、sync、archive、observability 和 runtime cache 均不得创建、修改、批准、关闭或覆盖 Artifact truth。
- `L1-artifact` 只能把 work / process / governance / method / runtime / archive / observability / external content 变成 ref、summary、snapshot、marker 或 handoff material,不能把这些正文接管为本仓 truth。
- 除 `L0-core/core-contracts` 外,任何 sibling compile-time dependency 均为红线失败。
- `real-like`、`staging-like`、`production-like`、capacity、advanced analytics 或 select-run unavailable 不得污染 P0 红线证据。
- 直接打穿 truth ownership、external body、version / lineage / baseline、query no-write、job no-truth-repair 或 dependency boundary 的失败,必须登记为 Step 11 候选;是否正式 VETO 仍由 Step 11 收口。

## 10. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| `AC-ART-021~025` 是否作为 §6 的最终编号 | 影响正式文档章节编号 | 当前采用连续编号,承接 `AC-ART-001~020` |
| 是否需要把 `PublishPendingArtifactRelays` 单独写进 §6 | 影响边界红线显式度 | 当前可并入 `job no-truth-repair` 与 `derived surface` 红线,Step 7 再单列 |
| `RL-ART-010` 的依赖边界是否需要明确到 `core-contracts` 具体包名 | 影响 dependency audit 细粒度 | 当前按 `L0-core/core-contracts` 口径处理 |
| `projects/L1-governance/design-calibration/06_acceptance_step_06_data_arch_redlines.md` 是否只保留为粒度参考 | 影响跨仓复用范围 | 当前仅作为结构参考,不复用治理专属政策语义 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 数据边界和架构红线都有验收项 | 通过 | `AC-ART-021~025` 已闭环 |
| 哪些数据不得保存已明确 | 通过 | 见 §8.3 |
| 下游 / projection / cache 不反写已明确 | 通过 | 见 §8.1 / §8.2 / §8.5 |
| P1 / P2 防污染已明确 | 通过 | 见 §8.4 |
| 可进入 Step 7 | 通过 | 下一步定义接口、事件与跨仓同步验收;进入前等待用户审查 |
