# Step 07 核心能力闭环

## Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 07 核心能力闭环 |
| 输出文件 | `design-calibration/00_req_step_07_core_capability_loop.md` |
| 当前模式 | full-restart |
| 已读取项目台账 | yes |
| 已读取需求 flow | yes |
| 已读取前序 Step | yes, `00_req_step_02_position_boundary.md`、`00_req_step_04_goals_non_goals.md` 与 `00_req_step_06_consumers_dependencies.md` |
| 已读取 SOP / 书写规范 | yes, 需求 SOP Step 7 与需求书写规范 4.7 |
| 已读取上游粒度参考 | yes, `L1-governance` 与 `L1-artifact` 的核心能力闭环中间产物 |
| 已读取历史材料 | yes, 旧 `00-需求文档.md` 的核心能力闭环章节作为 historical material |
| 用户确认 | yes, 用户确认进入 Step 07 |
| 进入条件 | pass |

## Step 内计划

| 计划项 | 状态 | 产物 / 门禁 |
|---|---|---|
| 读取项目级台账与 00 flow | done | 确认当前只允许推进 `00` 的 Step 07 |
| 读取 Step 02 本仓边界 | done | 核心闭环必须落在观测材料、审计投影与报告交接基础仓内 |
| 读取 Step 04 目标与非目标 | done | 能力节点不得越过 no-write truth、body-free evidence、retention marker 和不伪造验收边界 |
| 读取 Step 06 使用方与依赖 | done | 核心能力必须承接 `L0-core`、`L0-bus`、source owner 和消费 / 交接方的关系,但不得把依赖对象写进闭环图 |
| 读取需求 SOP Step 7 与书写规范 4.7 | done | 确认必须输出仓存在必要性、闭环结论、节点顺序、停审清单、外围增强、边界外和功能回填映射 |
| 对齐 L1-governance / L1-artifact 粒度 | done | 参考“先必要性、后能力节点、再层级裁剪”的组织方式,不复制能力内容 |
| 诊断旧正式 00 的核心能力章节 | done | 旧表有有效线索,但混入 normalized material、hash linkage、replay、对象词和验收占位,需要上收到能力状态 |
| 收敛核心能力闭环、节点讨论顺序和停审清单 | done | 形成 4.7 可回填草稿 |
| 自检未滑入用户故事、功能需求、规则、数据归属、接口、事件或实现组织 | done | 可等待用户确认进入 Step 08 |

## SOP 问题回答

| 问题 | 回答 |
|---|---|
| 如果没有这个仓,系统会缺什么不可替代的能力或结构? | 平台会缺少统一的横切观测材料边界,也缺少把审计投影、证据关联、运行观察、只读诊断、报告交接、留存约束和不反写真相统一收束的需求位置。各 source owner 会被迫各自维护日志、指标、trace、审计线索和报告材料,形成多套不可对账、不可统一脱敏、不可统一关联的观察面。 |
| 这个仓成立必须共同具备哪些能力? | 必须共同具备安全观测材料入口、审计投影与证据关联、运行观察面安全表达、只读诊断与报告交接、留存与不反写真相约束五类能力。 |
| 哪些能力缺一个,这个仓就不算真正成立? | 缺安全入口会导致材料不可准入和不可关联;缺审计 / 证据能力会导致审计投影无法支撑可审计交接;缺运行观察面会导致日志、指标、trace 分散;缺只读诊断和报告交接会让材料无法被审查和消费;缺留存与 no-write 约束会使观察面反向污染 source truth 或丢失仍被引用的材料。 |
| 哪些能力只是外围增强,而不是闭环核心? | 高级 dashboard、告警产品规则、异常检测、DORA / EBM / ISO 报表、外部 APM / Grafana / Prometheus 绑定、长期分析、容量优化和外部 GRC 导出属于外围增强。 |
| 哪些能力根本不属于这个仓? | 业务 truth 写入、事件总线主干、治理裁决、Artifact / evidence 正文、Identity truth、runtime / sandbox 执行裁决、archive package / recovery、console UI ownership、真实测试 run_id / evidence alias / 验收签署均不属于本仓。 |
| 当前已有或预期功能中,哪些是在支撑这些核心能力? | 后续功能应按能力节点回填:接入校验和脱敏支撑安全入口;审计投影和 evidence linkage 支撑审计关联;log / metric / trace 投影支撑运行观察面;query / diagnostic / report handoff 支撑只读交接;retention / replay / no-write guard 支撑边界约束。 |
| 核心能力闭环应拆成哪些能力节点? | 拆为 `C-OBS-1` 安全观测材料入口、`C-OBS-2` 审计投影与证据关联、`C-OBS-3` 运行观察面安全表达、`C-OBS-4` 只读诊断与报告交接、`C-OBS-5` 留存与不反写真相边界。 |
| 这些能力节点应按什么顺序逐个讨论? | 后续 Step 8 起应按 `C-OBS-1 -> C-OBS-2 -> C-OBS-3 -> C-OBS-4 -> C-OBS-5` 逐节点展开,每个节点都先收故事 / 功能 / 规则 / 数据 / 接口 / 验收的局部闭口,再进入下一个节点。 |
| 每个能力节点完成停审时,必须证明哪些内容已经收敛? | 必须证明对应节点的准入、输出、越界、降级和 no-write 边界已经清楚,且没有把 source truth、正文、执行裁决、产品绑定或伪造证据写入本仓范围。 |

## 当前文档问题诊断

| 输入 | 诊断 |
|---|---|
| 旧 README | 将 Observability 直接靠近 OTel、Prometheus、Grafana、TimescaleDB、冷存、P95 和 dashboard,容易把外部产品与非功能目标当成核心能力。 |
| 上一轮粗糙 `00-需求文档.md` | 已列出 `C-OBS-1~5` 线索,但节点说明包含 normalized observation material、hash linkage、metric rollup、report handoff record、replay/rebuild、legal hold 等后续功能 / 对象词,不适合作为 Step 07 的能力状态表达。 |
| Step 02 本仓边界 | 已确认本仓是平台横切观测材料、审计投影与报告交接基础仓,不是业务 truth、事件总线、治理决策、Artifact/evidence 正文、Identity truth、执行裁决、归档恢复、控制台或外部产品配置仓。 |
| Step 04 目标与非目标 | 已要求建立观测材料边界、审计投影与证据链接边界、脱敏关联口径、留存报告交接范围和 no-write truth 防线。 |
| Step 06 使用方与依赖 | 已确认只有 `L0-core` 是编译期依赖;`L0-bus` 是事件协作主干;source owner 与消费方通过运行期 / 事件协作 / 交接关系参与,不得成为闭环图节点。 |

## 设计取舍

| 取舍 | 结论 |
|---|---|
| 是否沿用旧 `C-OBS-1~5` 的节点方向 | 有条件采用。保留五类能力方向,但将节点名称从功能 / 对象表达上收为能力成立状态。 |
| 是否把 log、metric、trace、audit schema 写进闭环图 | 不采用。闭环图只写能力状态;schema、字段、接口、事件和数据归属后移 Step 09~12 与后续设计文档。 |
| 是否把 OTel、Prometheus、Grafana、TimescaleDB 或对象存储写成核心能力 | 不采用。它们最多是后续架构 / 配置候选,不是需求层核心闭环。 |
| 是否把 evidence linkage 写成 evidence ownership | 不采用。核心能力只要求 body-free 关联成立,Artifact 或相应 source owner 仍拥有正文和证据本体。 |
| 是否把 report handoff 写成最终报告裁决或验收签署 | 不采用。报告交接只是只读材料交接能力,不得伪造真实执行证据、真实 evidence alias、最终裁决或签署。 |
| 是否把 retention / replay 写成 source truth 修复能力 | 不采用。留存和重放只约束观察面及投影重建,不能修复、删除或反写任何 source business truth。 |

## 结构化中间产物

### 仓存在必要性结论

`L4-observability` 需要单独存在,因为平台横切观测与审计投影无法由任一业务 truth 仓、事件总线、运行执行仓、归档仓或控制台替代。没有该仓,log、metric、trace、audit material、evidence linkage、retention marker 和 report handoff 会散落在各 source owner、本地日志、测试记录或展示工具中,导致材料无法统一脱敏、无法跨域关联、无法判断留存冲突,也无法在审计、诊断、报告和验收语境中形成只读交接面。

本仓不可替代的结构不是某个监控产品、dashboard 或存储后端,而是把“安全接入、审计关联、运行观察、只读交接、留存与 no-write 约束”共同收束为一个不拥有业务 truth 的观察面基础。

### 核心能力闭环结论

`L4-observability` 的核心能力闭环是:观测材料必须先以安全、可拒绝、可关联的方式进入观察语境;在该入口之上,审计投影与证据关联必须在不保存正文、不替代 source truth 的前提下成立;日志、指标和追踪等运行观察面必须以脱敏、安全标签和关联语境表达;只读查询、诊断和报告交接必须能消费这些观察材料而不生成最终业务裁决;最后,留存、重放、缺口与 no-write truth 边界必须持续约束所有观察材料和派生投影。任一能力缺失,本仓都会退化为本地日志集合、审计副本、dashboard、外部 APM 配置或会反写真相的诊断工具。

#### 核心能力闭环图

```text
安全观测材料入口能够成立
  -> 审计投影与证据关联能够成立
  -> 运行观察面能够安全表达
  -> 只读诊断与报告交接能够成立
  -> 留存与不反写真相边界能够持续约束
```

图示说明:

- 本图只表达能力成立的逻辑依赖关系。
- 本图不表达运行时调用顺序、接口时序、事件传播顺序或开发实施步骤。
- 图中节点只写能力状态,不写仓名、角色、外部系统名、接口名、事件名、对象字段、数据库动作或实现组件名。

### 核心能力节点执行顺序结论

| 顺序 | 能力节点 | 能力成立描述 | 缺失后果 |
|---:|---|---|---|
| 1 | `C-OBS-1` 安全观测材料入口 | 跨域观测材料能够被安全准入、拒绝、隔离和关联,并能表达来源、关联语境和脱敏状态。 | 后续审计、运行观察、诊断和交接都缺少可信入口,source owner 会各自私补观测格式。 |
| 2 | `C-OBS-2` 审计投影与证据关联 | 审计投影、证据链接和缺口语境能够在不拥有正文、不替代 source truth 的前提下成立。 | 审计材料会变成业务 truth 副本或不可追溯流水,无法支撑报告和审查。 |
| 3 | `C-OBS-3` 运行观察面安全表达 | 日志、指标、追踪等观察面能够以安全、可关联、可降级的方式表达运行状态。 | 运行诊断会依赖 raw log、私有 label 或不可审计 trace,并可能冒充执行 truth。 |
| 4 | `C-OBS-4` 只读诊断与报告交接 | 查询、诊断和报告交接能够只读消费观察材料,输出安全摘要、缺口和交接线索。 | 人类和系统消费者无法稳定获得观察面,或把诊断结果误写成业务结论 / 验收签署。 |
| 5 | `C-OBS-5` 留存与不反写真相边界 | 留存、重放、缺口处理和 no-write truth 防线能够持续约束接入、投影、观察和交接。 | 材料可能被越权清理、错误重建、反写 source truth,或伪造真实证据。 |

说明: `C-OBS-*` 是能力节点标识,不是功能需求编号。功能需求编号必须等 Step 09 再定义。

### 能力节点停审清单

| 能力节点 | 停审时必须证明已经收敛的内容 | 不通过表现 |
|---|---|---|
| `C-OBS-1` 安全观测材料入口 | accepted / rejected / quarantined 的材料边界、来源语境、关联语境、脱敏状态和不得反写 source truth 的入口边界已经清楚。 | 入口等同于写入业务 truth;raw body 或 secret 可以进入观察材料;无法表达来源或关联语境。 |
| `C-OBS-2` 审计投影与证据关联 | 审计投影、证据链接、缺口与正文 owner 的边界已经清楚,且只保存 body-free 关联和可审计语境。 | 保存 evidence body / artifact body;替代 Governance decision、Artifact lineage、Identity truth 或 source audit truth。 |
| `C-OBS-3` 运行观察面安全表达 | 日志、指标和追踪只表达安全观察面,不会保存未脱敏正文,不会用 trace / metric / log 裁决执行 truth。 | metric label 泄漏高敏正文;trace success 被当成 runtime truth;log 保存 provider response 或 raw prompt。 |
| `C-OBS-4` 只读诊断与报告交接 | 查询、诊断、报告交接均为只读观察面,能表达 degraded / gap / not-visible,且不生成最终裁决或伪造证据。 | diagnostic 下发控制命令;report handoff 填写真正 run_id、evidence alias、final verdict 或 signoff 占位。 |
| `C-OBS-5` 留存与不反写真相边界 | 留存、重放、缺口扫描和 no-write 防线能够阻断越权清理、错误重建和反写真相。 | retention 删除仍被审计 / 诊断 / 报告引用的材料;replay 修复 source truth;query / job 写回业务仓。 |

### 外围增强能力结论

| 外围增强能力 | 处理口径 |
|---|---|
| 高级 dashboard、可视化编排和管理后台 | 后续可作为消费 / 展示增强,不进入核心闭环。 |
| 告警规则产品、通知渠道和 alert sink | 后续可作为运行消费增强,不得把 alert 当业务 truth。 |
| DORA / EBM / ISO 报表和管理指标体系 | 后续可作为报告增强,当前只保留 report handoff 边界。 |
| 外部 APM、Prometheus、Grafana、OTel Collector、TimescaleDB 或对象存储绑定 | 后续架构 / 配置 / 测试重新裁剪,当前不作为需求主链前置。 |
| 异常检测、根因推荐、容量优化和长期趋势分析 | 后续增强或非功能方向,不能替代核心观察面成立。 |
| 外部审计 / GRC 导出 | 后续集成增强,不得改变本仓不拥有治理 truth 和 evidence body 的边界。 |

### 边界外能力结论

| 边界外能力 | 归属 / 裁剪理由 |
|---|---|
| 业务 truth 写入、修复、删除或裁决 | 属于各 source owner;本仓只输出观察、诊断、交接、缺口或冲突材料。 |
| 事件总线投递、ack、retry、dead-letter 和 replay 主干 | 属于 `L0-bus`;本仓只消费事件协作材料或输出观察材料。 |
| Governance decision、Policy、Gate、AIIA、SoA、Control、Nonconformity truth | 属于 `L1-governance`;本仓只承载审计投影和报告交接线索。 |
| Artifact 正文、版本、血缘、基线和 evidence body | 属于 `L1-artifact` 或相应 evidence owner;本仓只保留 body-free 证据关联。 |
| Identity member、actor、role、subject lifecycle truth | 属于 `L1-identity`;本仓只保留安全 actor / subject 引用语境。 |
| Runtime / sandbox execution truth、调度控制、kill / retry / recovery 命令和执行裁决 | 属于 runtime / sandbox 边界;本仓只表达观察和诊断。 |
| Archive package、长期正文保存、恢复流程和归档裁决 | 属于 archive 或后续存储 / 配置 / 实施边界;本仓只讨论留存标记和交接冲突。 |
| Console UI ownership、dashboard 布局和外部监控产品配置 | 属于产品层、配置层或外部系统;本仓只定义可被消费的观察材料边界。 |
| 真实测试 `run_id`、真实 evidence alias、验收签署和最终 verdict | 属于真实测试执行与验收阶段;设计文档不得伪造。 |

### 功能回填映射结论

| 后续功能回填方向 | 支撑的能力节点 | Step 09 展开时的边界要求 |
|---|---|---|
| 观测材料准入、来源识别、关联语境和脱敏判定 | `C-OBS-1` | 只能写需求能力,不得提前写 DTO、接口、事件 schema、存储表或 adapter。 |
| 审计投影、证据链接、缺口和审计可追溯 | `C-OBS-2` | 必须保持 body-free,不得拥有 Governance、Artifact、Identity 或 runtime truth。 |
| 日志、指标、追踪的安全观察面和降级表达 | `C-OBS-3` | 不保存 raw body、secret、高敏完整引用或执行裁决。 |
| 只读查询、诊断摘要、报告交接和 evidence index 输入 | `C-OBS-4` | 只输出观察 / 交接材料,不得写 source truth 或伪造真实证据。 |
| 留存标记、重放 / 重建边界、缺口处理和 no-write guard | `C-OBS-5` | 只约束观察材料生命周期和派生投影,不得修复或反写 source truth。 |

## 回填草稿

正式第 7 章应包含闭环定义短文、核心能力闭环图、能力层级划分表和节点停审说明。候选正文如下:

### 7.1 闭环定义

`L4-observability` 的核心能力闭环是:观测材料必须先以安全、可拒绝、可关联的方式进入观察语境;在该入口之上,审计投影与证据关联必须在不保存正文、不替代 source truth 的前提下成立;日志、指标和追踪等运行观察面必须以脱敏、安全标签和关联语境表达;只读查询、诊断和报告交接必须能消费这些观察材料而不生成最终业务裁决;最后,留存、重放、缺口与 no-write truth 边界必须持续约束所有观察材料和派生投影。任一能力缺失,本仓都会退化为本地日志集合、审计副本、dashboard、外部 APM 配置或会反写真相的诊断工具。

### 7.2 核心能力闭环图

```text
安全观测材料入口能够成立
  -> 审计投影与证据关联能够成立
  -> 运行观察面能够安全表达
  -> 只读诊断与报告交接能够成立
  -> 留存与不反写真相边界能够持续约束
```

本图只表达能力成立的逻辑依赖关系,不表达运行时调用顺序、接口时序、事件传播顺序或开发实施步骤。

### 7.3 能力层级划分表

| 分类 | 内容 |
|---|---|
| 核心能力闭环 | 安全观测材料入口;审计投影与证据关联;运行观察面安全表达;只读诊断与报告交接;留存与不反写真相边界 |
| 外围增强能力 | 高级 dashboard;告警产品规则;DORA / EBM / ISO 报表;外部 APM / Grafana / Prometheus 绑定;异常检测;长期分析;容量优化;外部 GRC 导出 |
| 边界外能力 | 业务 truth 写入;事件总线主干;治理裁决;Artifact / evidence 正文;Identity truth;runtime / sandbox 执行裁决;archive package / recovery;console UI ownership;真实测试证据和验收签署 |

### 7.4 核心能力节点讨论顺序

| 顺序 | 能力节点 | 能力成立描述 |
|---:|---|---|
| 1 | `C-OBS-1` 安全观测材料入口 | 跨域观测材料能够被安全准入、拒绝、隔离和关联,并能表达来源、关联语境和脱敏状态。 |
| 2 | `C-OBS-2` 审计投影与证据关联 | 审计投影、证据链接和缺口语境能够在不拥有正文、不替代 source truth 的前提下成立。 |
| 3 | `C-OBS-3` 运行观察面安全表达 | 日志、指标、追踪等观察面能够以安全、可关联、可降级的方式表达运行状态。 |
| 4 | `C-OBS-4` 只读诊断与报告交接 | 查询、诊断和报告交接能够只读消费观察材料,输出安全摘要、缺口和交接线索。 |
| 5 | `C-OBS-5` 留存与不反写真相边界 | 留存、重放、缺口处理和 no-write truth 防线能够持续约束接入、投影、观察和交接。 |

## 自检

| 检查项 | 结果 |
|---|---|
| 是否说明仓存在的必要性 | pass |
| 是否定义 1 条核心能力闭环 | pass |
| 是否给出 3~5 个能力状态节点 | pass |
| 是否提供核心能力闭环 ASCII 图 | pass |
| 是否说明图中箭头只表达逻辑依赖 | pass |
| 是否区分核心闭环、外围增强和边界外能力 | pass |
| 是否给出核心能力节点执行 / 讨论顺序 | pass |
| 是否给出能力节点停审清单 | pass |
| 是否给出功能回填映射结论 | pass |
| 是否未把用户故事、功能需求、业务规则、数据归属、接口、事件、DTO、DB 或实现路径写入本 Step | pass |
| 是否未将仓名、角色、外部系统或实现组件写入闭环图节点 | pass |
| 是否未写入正式 `00-需求文档.md` | pass |
| 是否发现阻塞进入 Step 08 的上游 blocker | no |

## 门禁

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| pass | 仓存在必要性、核心能力闭环、节点讨论顺序、能力停审清单、外围增强、边界外能力和功能回填映射已收束,且未混写用户故事、功能、规则、数据、接口或实现方案 | wait_user_or_start_step_08_after_confirmation |
