# Step 01 与上游文档的关系声明

## Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 01 与上游文档的关系声明 |
| 输出文件 | `design-calibration/00_req_step_01_upstream_relation.md` |
| 当前模式 | full-restart |
| 当前轮次 | 审查后补强 |
| 已读取项目台账 | yes |
| 已读取需求 flow | yes |
| 已读取通用规范 | yes |
| 已读取 SOP / 书写规范 | yes, 需求 SOP Step 01 与需求书写规范 4.1 |
| 已读取上游输入 | yes, `L0-core`、`L0-bus`、`L1-governance`、`L1-artifact`、`L1-identity`、全局依赖规则与历史 L4 材料 |
| 用户确认 | yes, 用户确认按返工优先级先补强 Step 01 |
| 进入条件 | pass |

## 本步目标

本步目标不是定义 `L4-observability` 的能力边界、功能清单、数据归属或接口形态,而是先把需求来源校准清楚:哪些文档是稳定上游,哪些只是 historical material,哪些只提供语义线索而不能直接升格为当前需求基线。

`L4-observability` 是横切观测与审计投影仓。它的危险点不在“上游缺失”,而在“旧 README 的产品栈和性能数字”以及“旧正式文档中的实现倾向”很容易被误当成当前需求前提。因此 Step 01 必须先把来源层级、truth owner 边界和历史材料降级口径钉住,否则 Step 02 以后会不断串线。

## 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `standards/document/需求文档讨论流程_SOP.md` | 已读取 | 固定 Step 01 只做来源声明、诊断、取舍和结构化来源映射,不滑入边界、功能、数据和接口。 |
| `standards/document/需求文档书写规范.md` | 已读取 | 固定正式第 1 章应回答“承接什么、承接哪部分主题、为何不是重新定义、在本仓起什么细化作用”。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已读取 | 确认 `L4-observability` 的唯一编译期依赖是 `L0-core`,并确认 bus / sibling 仓只能以事件协作或运行期边界出现。 |
| `projects/L0-core/00-需求文档.md` | 已读取 | 提取 typed ref、trace、metadata、error、安全 marker 和共享契约语境,作为本仓唯一稳定编译期上游。 |
| `projects/L0-bus/00-需求文档.md` ~ `07-实施计划.md` | 已读取 | 提取事件协作、tap / audit material、只读输出和 bus truth ownership 的边界。 |
| `projects/L1-governance/00-需求文档.md` ~ `07-实施计划.md` | 已读取 | 提取 Governance truth、审计 / traceability、report / handoff 和正文禁止边界。 |
| `projects/L1-artifact/00-需求文档.md` ~ `07-实施计划.md` | 已读取 | 提取 Artifact truth、evidence ownership、body-free evidence linkage 和交接边界。 |
| `projects/L1-identity/00-需求文档.md` ~ `07-实施计划.md` | 已读取 | 提取 actor / subject safe ref、audit safe ref 和 identity body 禁止边界。 |
| `projects/L4-observability/README.md` | 已读取 | 作为历史定位材料,识别旧产品栈、旧指标、旧目录和旧职责表达中仍有价值的使命线索。 |
| 旧 `projects/L4-observability/00-需求文档.md` | 已读取 | 作为历史需求输入,识别 no-write truth、evidence、retention 等仍可保留的方向,不直接继承编号和对象名。 |
| 旧 `projects/L4-observability/01/02/03/05/06` | 已读取 | 作为历史后续链诊断输入,识别是否存在旧边界、旧验收或旧产品绑定反向污染需求。 |
| 旧 `implementation_execution_ledger.md` 与 `implementation-boundaries/*` | 已读取 | 明确上一轮粗糙推进的 implementation 资产只能作为 historical material,不得作为当前 Step 01 权威来源。 |

## Step 内计划

| 计划项 | 状态 | 产物 / 门禁 |
|---|---|---|
| 读取项目级台账与 00 flow | done | 确认当前为审查后补强 Step 01,不得顺带进入 Step 02 |
| 读取 Step 01 SOP 与书写规范 4.1 | done | 确认本 Step 只写上游关系声明与来源层级 |
| 回读 `L0-core` 与全局依赖规则 | done | 补足旧版本 Step 01 中缺失的稳定编译期上游 |
| 回读 `L0-bus`、`L1-governance`、`L1-artifact`、`L1-identity` | done | 校准 truth owner 与 body-free / no-write / report 边界语境 |
| 诊断旧 README、旧正式 00、旧 01/02/03/05/06 和旧 implementation 资产 | done | 把产品栈、性能数字、目录树、边界骨架全部降级为 historical material |
| 形成来源分层 | done | 区分直接稳定上游、相邻真相上游、历史材料和依赖基线 |
| 形成“不重新定义清单” | done | 明确本仓不重新定义 bus truth、governance truth、artifact truth、identity truth 或 execution truth |
| 补充改动前后对比和待确认事项 | done | 提升到接近 `L1-governance` 的推演粒度 |
| 自检未提前写本仓定位、功能、规则、数据、接口、NFR 或验收 | done | 可等待用户确认进入 Step 02 补强 |

## SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本文承接哪些上游文档? | 承接 `L0-core` 的共享契约语境、`L0-bus` 的事件协作和 tap / audit material 边界、`L1-governance` 的治理 truth 与 report / handoff 边界、`L1-artifact` 的 Artifact / evidence ownership、`L1-identity` 的 actor / subject safe ref 边界,以及全局依赖规则。`README`、旧 `00~07` 与旧 implementation 资产仅作为 historical material。 |
| 承接的是上游哪一部分主题? | 承接的是“横切观测与审计投影需要依附哪些外部 truth owner 才能成立”这部分主题,具体包括:观测材料来源、trace / correlation 语境、body-free evidence linkage、只读 report handoff、retention marker 和 no-write truth 防线。 |
| 本文为什么不是重新定义该主题? | 因为 bus、governance、artifact、identity 和 runtime 各自拥有正式 truth。`L4-observability` 只消费、投影、聚合、查询和交接安全材料,不能把 projection、summary、dashboard、alert 或 diagnostic 重新定义为 source truth。 |
| 本文在当前仓里承担什么细化作用? | 把“横切观测仓应该从哪些上游拿到什么语义,哪些旧材料必须降级,哪些东西绝不能在需求层直接继承”收束为 Step 02~16 的共同前置。 |

## 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 旧 `README.md` | 直接把 OTel Collector、Prometheus、Grafana、TimescaleDB、对象存储、DORA / EBM、P95、目录树写进仓使命和核心职责 | 把产品栈、容量和实现结构误写成需求来源 | 只保留“横切观测、审计、evidence、retention、report handoff”这些使命线索,其余降级为 historical material |
| 旧 `00-需求文档.md` | 已强调 no-write truth 和 body-free 方向,但仍混入 hash chain、冷存、对象命名、旧 `FR/BR/AC` 和实现倾向 | 会让新版 Step 01 看起来像在继承旧需求编号链 | 只保留方向线索,不继承旧编号、旧对象名、旧产品绑定和旧验收口径 |
| 旧 `01/02/03/05/06` | 含有旧架构栈、旧测试对象、旧 veto 口径和实现边界 | 会把后续文档的粗糙内容倒灌回需求来源层 | 作为历史后续链诊断输入,不作为当前 Step 01 的正式来源 |
| 旧 implementation ledger / boundaries | 上一轮粗糙推进时已提前生成 implementation 资产 | 容易被误读为“设计已完成,只差实现” | 在重新完成 `07-实施计划.md` 前全部视为 historical material |
| 当前 Step 01 旧版本 | 有来源映射表,但缺少输入分层、改动前后对比、`L0-core` 直接上游和待确认事项 | 结论成立但推演层明显弱于 `L1-governance` 粒度 | 本轮补强输入层级、诊断层、取舍层和挂起层 |
| 全局依赖规则 | 已明确 `L4-observability` 编译期只依赖 `L0-core` | 旧版本 Step 01 没把这一点提升为稳定上游结论 | 本轮明确把 `L0-core` 列为直接稳定上游 |

## 改动前后对比

| 项 | 补强前 | 补强后 | 原因 |
|---|---|---|---|
| 直接稳定上游 | 主要写 `L0-bus` 和若干 L1 仓 | 增加 `L0-core` 作为唯一稳定编译期上游 | Step 01 必须先把共享契约语境钉住 |
| 来源分层 | 把上游与历史材料并列 | 明确区分直接稳定上游、相邻真相上游、依赖基线和 historical material | 便于后续 Step 不误继承旧技术和旧边界 |
| 旧材料诊断 | 只有简短诊断 | 增加旧 README、旧正式 00、旧 01/02/03/05/06 和旧 implementation 资产的分项诊断 | 提升对历史污染源的识别精度 |
| 不重新定义范围 | 只有一句总括 | 增加“不重新定义清单” | 防止 Step 02~16 把外部 truth 倒灌进本仓 |
| 挂起层 | 没有待确认事项 | 增加 Step 01 级待确认事项 | 与 `L1-governance` 的审查粒度对齐 |
| 与 `L1-governance` 的差距 | 更像收口摘要 | 更接近“来源输入 + 诊断 + 对比 + 取舍 + 结构化产物 + 挂起项”的完整推演链 | 这是本轮补强的直接目标 |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只保留旧版简短来源映射表 | 改动小 | 无法解释为什么 `README`、旧正式文档和旧 implementation 资产都不能直接继承 | 不采用 |
| 方案 B: 对齐 `L1-governance` 粒度,补上输入分层、诊断、对比、取舍和挂起项 | 推演链完整,便于后续 Step 审查 | 文档更长 | 采用 |
| 方案 C: 把旧 `README` 技术栈和性能数字列为“候选上游” | 看似保留更多信息 | 会在需求层错误抬高 OTel / Grafana / TimescaleDB / P95 的权威级别 | 不采用 |
| 方案 D: 直接把旧 `00-需求文档.md` 当作 Step 01 来源主轴 | 速度快 | 会把旧 `FR/BR/AC`、hash chain、冷存、对象名和实现化口径整体带回 | 不采用 |

## 结构化中间产物

### 7.1 上游文档来源结论

| 来源文档 | 承接内容 | 权威级别 |
|---|---|---|
| `standards/document/全局项目依赖关系与裁剪规则.md` | `L4-observability` 的分层位置、唯一编译期依赖和 sibling 依赖裁剪规则 | 依赖基线输入 |
| `projects/L0-core/00-需求文档.md` | typed ref、trace、metadata、error、安全 marker 和共享契约语境 | 直接稳定上游 |
| `projects/L0-bus/00-需求文档.md` ~ `07-实施计划.md` | 事件协作、tap / audit material、只读输出、replay 和 bus truth ownership | 直接稳定上游 |
| `projects/L1-governance/00-需求文档.md` ~ `07-实施计划.md` | Governance truth、traceability、report / handoff 和正文禁止边界 | 稳定相邻真相上游 |
| `projects/L1-artifact/00-需求文档.md` ~ `07-实施计划.md` | Artifact truth、evidence ownership、body-free evidence linkage 和交接边界 | 稳定相邻真相上游 |
| `projects/L1-identity/00-需求文档.md` ~ `07-实施计划.md` | actor / subject safe ref、audit safe ref 和 identity body 禁止边界 | 稳定相邻真相上游 |
| `projects/L4-observability/README.md` | 横切观测、审计、trace、metrics、retention 和 report handoff 的旧使命线索 | historical material |
| 旧 `projects/L4-observability/00-需求文档.md` | no-write truth、body-free 证据、留存与交接等旧需求线索 | historical material |
| 旧 `projects/L4-observability/01/02/03/05/06` | 旧架构、概要、详细、测试和验收方向 | historical material |
| 旧 `implementation_execution_ledger.md` 与 `implementation-boundaries/*` | 上一轮粗糙推进产生的 implementation 资产 | historical material |

### 7.2 承接主题结论

| 上游主题 | `L4-observability` 承接方式 |
|---|---|
| `L0-core` 的 shared contract 语境 | 使用 typed ref、trace、metadata、error 和安全 marker 作为观测材料与投影的基础语境,不重新定义共享契约 |
| `L0-bus` 的事件协作和 tap / audit material | 通过事件协作消费观测材料和审计材料,不拥有事件投递、ack、retry、dead-letter 或 replay 主干 truth |
| `L1-governance` 的治理 truth | 消费治理审计语境、报告交接语境和 body-free 引用,不拥有治理决策正文或正式裁决 truth |
| `L1-artifact` 的 Artifact / evidence truth | 消费 Artifact / evidence safe ref 和 body-free 关联线索,不拥有制品正文、版本、血缘、基线或 evidence body |
| `L1-identity` 的身份 truth | 消费 actor / subject safe ref 和相关审计语境,不拥有 member / actor / role 生命周期 truth |
| 旧 `README` 与旧 `00~07` 的历史线索 | 只提炼“横切观测”和“no-write truth”等方向性线索,不直接继承产品栈、指标、目录、边界骨架或旧编号 |

### 7.3 不重新定义清单

| 对象 | 为什么不能由 `L4-observability` 重新定义 |
|---|---|
| `L0-core` 的 typed ref、trace、metadata、error、安全 marker | 这是共享契约来源,本仓只能消费,不能自造另一套契约语义 |
| `L0-bus` 的 publish / subscribe / ack / retry / dead-letter / replay 主干 | 这是事件协作 truth,本仓只能观察和引用 |
| `L1-governance` 的 Gate / Policy / Decision / Control / AIIA / SoA / Nonconformity truth | 这是治理正式结论,本仓只能投影和交接 |
| `L1-artifact` 的 Artifact 正文、version / lineage / baseline 和 evidence body | 这是制品与证据本体 truth,本仓只能保留 body-free 关联线索 |
| `L1-identity` 的 member / actor / role 生命周期 truth | 这是身份正式真相,本仓只能保留 safe ref |
| runtime / sandbox 的 execution truth 和控制命令 | 本仓只能承接 log / metric / trace / diagnostic 观察面,不能裁决执行结果 |
| archive package、恢复正文和最终归档 truth | 本仓只涉及 retention marker 和 report handoff 边界,不拥有 archive 正文 |
| console UI state、dashboard layout 或外部 APM 产品配置 | 本仓只提供观察材料和只读投影语境,不拥有 UI truth 或产品配置 truth |

### 7.4 收束说明结论

```text
Global dependency rule
  |
  +-- L0-core shared contract context
  +-- L0-bus event collaboration and tap / audit material
  +-- L1-governance governance truth boundary
  +-- L1-artifact artifact / evidence truth boundary
  +-- L1-identity identity truth boundary
  |
  v
L4-observability
  owns observation material, audit projection, report handoff marker,
  retention marker and no-write violation observation
  but does not own business / governance / artifact / identity / execution truth
```

本图只表达来源收束方向和 truth owner 边界,不表达 API、DTO、schema、表结构、handler、adapter、存储选型或部署结构。

### 7.5 blocker 判断

| blocker | 判断 |
|---|---|
| 是否缺少可支撑 Step 01 的直接稳定上游 | no |
| 是否存在上游 truth owner 冲突导致 Step 01 无法继续 | no |
| 是否存在 historical material 会污染后续 Step | yes,但已通过降级为 historical material 处理,不阻塞继续 |
| 是否存在必须在 Step 01 就决定的产品栈 / 指标 / 存储方案 | no |

## 回填草稿

正式第 1 章应包含来源映射表和收束说明。候选正文如下:

```md
## 1. 与上游文档的关系声明

> 校准来源:
> - `design-calibration/00_req_step_01_upstream_relation.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“当前文档问题诊断”“改动前后对比”和“待确认事项”小节,了解本章来源关系如何收敛。

本文承接 `standards/document/全局项目依赖关系与裁剪规则.md`、`projects/L0-core/00-需求文档.md`、`projects/L0-bus/00-需求文档.md` ~ `07-实施计划.md`、`projects/L1-governance/00-需求文档.md` ~ `07-实施计划.md`、`projects/L1-artifact/00-需求文档.md` ~ `07-实施计划.md` 和 `projects/L1-identity/00-需求文档.md` ~ `07-实施计划.md` 的稳定结论。本文不重新定义 shared contract、event collaboration、governance truth、artifact / evidence truth、identity truth 或 runtime execution truth,只把横切观测、审计投影、body-free evidence linkage、retention marker、report handoff 和 no-write truth 防线收束为 `L4-observability` 的仓级需求基线。

旧 `README.md`、旧 `00-需求文档.md`、旧 `01/02/03/05/06` 和旧 implementation ledger / boundaries 仅作为 historical material。它们提供“横切观测”“审计”“trace / metrics”“retention”“report handoff”和 no-write truth 的旧方向线索,但其中的 OTel Collector、Prometheus、Grafana、TimescaleDB、对象存储、P95、冷存期限、hash chain 分片、目录树、旧编号和旧 implementation boundary 不直接继承为当前需求基线。
```

## 待确认事项

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| `Q-STEP01-001` | `L2-runtime`、`L4-sandbox`、`L4-archive`、`L5-console` 是否需要在 Step 01 就作为直接上游文档列入来源表 | 当前不需要。它们在本轮 Step 01 只作为边界概念存在,后续在 Step 02 / Step 06 / Step 12 再按需要展开。 |
| `Q-STEP01-002` | 旧 `README.md` 中的 OTel / Prometheus / Grafana / TimescaleDB / 对象存储是否需要保留为“候选上游” | 当前不保留。它们是历史产品栈和实现候选,后续如需纳入,必须在 `01/04/05/07` 重新闭口。 |
| `Q-STEP01-003` | `L0-core` 是否需要在正式第 1 章中显式列为直接稳定上游 | 当前需要。因为编译期唯一依赖和共享契约语境如果不在 Step 01 说清楚,后续 Step 06 / Step 12 会失去依赖裁剪锚点。 |

## 自检

| 检查项 | 结果 |
|---|---|
| 是否只写来源和承接关系,未提前写本仓定位与边界 | pass |
| 是否明确区分直接稳定上游、相邻真相上游和 historical material | pass |
| 是否补入 `L0-core` 作为稳定上游 | pass |
| 是否明确旧 README、旧正式 00、旧 01/02/03/05/06 和旧 implementation 资产的降级处理 | pass |
| 是否明确“不重新定义清单” | pass |
| 是否未提前写功能、规则、数据、接口、NFR、验收或实施方案 | pass |
| 是否未把产品栈、性能数字、目录结构、旧 boundary 骨架写回当前需求基线 | pass |
| 是否未写入正式 `00-需求文档.md` | pass |
| 是否发现阻塞进入 Step 02 补强的上游 blocker | no |

## 门禁

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| pass | 已完成 Step 01 审查后补强,来源分层、historical material 降级、`L0-core` 直接稳定上游和“不重新定义清单”已收束 | wait_user_or_start_step_02_strengthening_after_confirmation |
