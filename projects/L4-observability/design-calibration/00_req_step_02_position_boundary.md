# Step 02 本仓定位与边界

## Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 02 本仓定位与边界 |
| 输出文件 | `design-calibration/00_req_step_02_position_boundary.md` |
| 当前模式 | full-restart |
| 当前轮次 | 审查后补强 |
| 已读取项目台账 | yes |
| 已读取需求 flow | yes |
| 已读取前序 Step | yes, 已读取补强后的 `00_req_step_01_upstream_relation.md` |
| 已读取 SOP / 书写规范 | yes, 需求 SOP Step 02 与需求书写规范 4.2 |
| 已读取历史材料 | yes, 旧 `README.md`、旧 `00-需求文档.md` 与旧 `01/02/03/05/06` 仅作为 historical material |
| 用户确认 | yes, 用户确认进入 Step 02 补强 |
| 进入条件 | pass |

## 本步目标

本步目标是在后续所有能力、规则、数据、接口和验收展开前,先建立对 `L4-observability` 的正确仓级心智:它到底拥有什么真相,不拥有什么真相,为什么必须单独成仓,最容易与哪些相邻仓或概念混淆。

这一步最容易犯的错有两个。第一类是把本仓写成“监控产品组合”或“观测基础设施仓”,把 OTel、Prometheus、Grafana、TimescaleDB、对象存储和 dashboard 当成仓定义。第二类是把本仓写成“通用审计真相仓”,从而把 Governance、Artifact、Identity、runtime / sandbox、archive 甚至测试验收结论一并拉进来。Step 02 补强的核心就是把这两类串线切干净。

## 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_01_upstream_relation.md` | 已补强完成 | 固定直接稳定上游、相邻真相上游、historical material 和“不重新定义清单” |
| `standards/document/需求文档讨论流程_SOP.md` Step 02 | 已读取 | 固定本步只允许回答一句话定义、单独成仓原因、非职责和易混淆边界 |
| `standards/document/需求文档书写规范.md` 4.2 | 已读取 | 固定正式输出必须是边界声明表 + 一段边界说明短文字,不得滑入依赖、功能、规则、数据或接口 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已读取 | 提供 `L4-observability` 在全局分层中的位置和与 sibling 仓的硬边界 |
| `projects/L4-observability/README.md` | 已读取 | 诊断旧“可观测平台 / 产品栈 / 性能指标 / 目录树”式定位为何不能作为当前仓定义 |
| 旧 `projects/L4-observability/00-需求文档.md` | 已读取 | 提取“no-write truth”“body-free evidence”“retention / report handoff”方向线索,不继承旧对象名和旧口径 |
| 旧 `projects/L4-observability/01/02/03/05/06` | 已读取 | 识别旧边界、旧 veto 和旧实现假设是否反向污染 Step 02 |
| `projects/L0-bus/00-需求文档.md` ~ `07-实施计划.md` | 已读取 | 固定 bus 拥有事件协作 truth,Observability 只能拥有观察材料和只读投影 |
| `projects/L1-governance/00-需求文档.md` ~ `07-实施计划.md` | 已读取 | 固定 governance 拥有治理 truth,Observability 只能拥有审计投影与交接语境 |
| `projects/L1-artifact/00-需求文档.md` ~ `07-实施计划.md` | 已读取 | 固定 artifact / evidence body 归属,Observability 只能拥有 body-free evidence linkage |
| `projects/L1-identity/00-需求文档.md` ~ `07-实施计划.md` | 已读取 | 固定 identity truth 归属,Observability 只能拥有 safe actor / subject refs |

## Step 内计划

| 计划项 | 状态 | 产物 / 门禁 |
|---|---|---|
| 读取项目级台账与 00 flow | done | 确认当前是 Step 02 审查后补强,不得顺带进入 Step 15 或 Step 17 |
| 读取 Step 02 SOP 与书写规范 4.2 | done | 确认只能写仓声明,不能补功能、依赖、规则、数据或接口 |
| 回读补强后的 Step 01 | done | 继承来源分层、truth owner 和 historical material 降级结论 |
| 诊断旧 README、旧正式 00 和旧后续链 | done | 识别“产品栈仓”“通用审计真相仓”“签署 / verdict 仓”等错误定位 |
| 收敛一句话定义 | done | 用最小信息量表达本仓拥有的真相范围 |
| 收敛非职责、边界对象和单独成仓原因 | done | 建立后续 Step 03~16 的共同边界前提 |
| 补充改动前后对比与待确认事项 | done | 对齐 `L1-governance` 粒度,避免只剩结论摘要 |
| 自检未滑入 Step 06 / 07 / 09 / 10 / 11 / 12 / 13 / 14 内容 | done | 可等待用户确认进入下一优先级补强 |

## SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本仓一句话定义是什么? | `L4-observability` 是平台横切观测材料、审计投影与只读报告交接真相仓。 |
| 为什么它需要单独成仓? | 因为跨域 log / metric / trace / audit material 需要统一的 redaction、correlation、retention、body-free evidence linkage 和 no-write truth 口径,不能散落在各 truth owner、执行仓、归档仓或展示工具中。 |
| 本仓不是什么? | 它不是业务 truth 仓、事件总线、治理决策仓、Artifact / evidence 正文仓、Identity 真相仓、runtime / sandbox 执行裁决仓、archive package / recovery 仓、console UI 仓、外部监控产品配置仓或真实验收 verdict / signoff 仓。 |
| 最容易与哪些相邻仓或概念混淆? | 最容易与 `L0-bus`、`L1-governance`、`L1-artifact`、`L1-identity`、runtime / sandbox、`L4-archive`、`L5-console` / 外部 APM 工具,以及“观测材料”“审计投影”“body-free evidence linkage”“retention marker”“report handoff”“final verdict”这些概念混淆。 |

## 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 旧 `README.md` | 把仓使命写成 `OTel Collector + 不可变审计日志 + 指标聚合 + DORA/EBM/42001 仪表板` | 仓定义被技术产品和实现组件绑死,像“监控平台选型文档”而不是仓边界 | Step 02 只保留“横切观测材料、审计投影、只读交接”定位,不继承产品栈 |
| 旧 `README.md` | 把 `Rust + TimescaleDB + 对象存储` 写进仓定位 | 技术栈和存储实现提前进入仓级定义 | 后移架构、配置、测试和实施计划 |
| 旧 `README.md` | 把查询 API、告警规则引擎、Grafana dashboard 和血缘查询直接列为核心职责 | 容易把观察面、UI 消费和外部产品绑定写成本仓身份 | Step 02 只定义仓是什么 / 不是什么,不定义功能面 |
| 旧 `00-需求文档.md` | 已比 README 更强调 no-write truth,但一句话定义仍偏“基础仓”,没有把本仓 own 的真相范围说透 | 会导致后续读者把它误读成纯基础设施而不是独立 truth boundary | 本轮把定义收紧为“观测材料、审计投影与只读报告交接真相仓” |
| 旧 `00-需求文档.md` | “report handoff”“diagnostic”“evidence”出现较多,但与 `final verdict`、真实 `run_id`、真实 evidence alias 的边界没有在 Step 02 提前钉住 | 容易把只读交接写成验收裁决入口 | 本轮明确“只读报告交接”与“真实验收结论 / 签署”必须分开 |
| 旧 `01/02/03/05/06` 和旧 implementation 资产 | 容易把 hash chain、冷存、对象目录、验收路径和边界骨架倒灌成仓定义 | Step 02 会变成“旧实现风格声明” | 继续作为 historical material,不回写到边界声明 |
| 当前 Step 02 旧版本 | 有结论,但“为什么不是通用审计真相仓 / 监控产品仓 / verdict 仓”的推演不够 | 粒度明显弱于 `L1-governance` | 本轮补足诊断层、对比层、取舍层和挂起层 |

## 改动前后对比

| 项 | 补强前 | 补强后 | 原因 |
|---|---|---|---|
| 一句话定义 | “横切观测材料、审计投影与报告交接基础仓” | “横切观测材料、审计投影与只读报告交接真相仓” | 需要把本仓 own 的真相范围和“只读”属性说清楚 |
| 本仓不是什么 | 已排除若干相邻仓,但未显式排除 `final verdict / signoff` | 增加“不是真实验收 verdict / signoff 仓” | 保护 report handoff 与验收结论边界 |
| 易混淆对象 | 主要是相邻仓 | 增加“report handoff / final verdict”“外部 APM / console UI”概念与工具边界 | 防止把观察面消费端当作本仓定义 |
| 单独成仓原因 | 强调横切性 | 增加 redaction、correlation、retention、body-free evidence linkage 和 no-write truth 统一口径 | 说明为什么不能散在各 truth owner 或展示工具中 |
| 推演层 | 更像收口摘要 | 补上诊断、对比、取舍和待确认事项 | 对齐 `L1-governance` 的中间产物粒度 |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 定位为“可观测平台 / 监控基础设施仓” | 容易和 OTel / Prometheus / Grafana 等旧材料衔接 | 会把产品栈、存储和 UI / 报表工具抬升为仓本体 | 不采用 |
| 方案 B: 定位为“通用审计真相仓” | 突出 audit 和 report | 会把 Governance、Artifact、Identity、runtime、archive 等外部 truth 一并吸入本仓 | 不采用 |
| 方案 C: 定位为“横切观测材料、审计投影与只读报告交接真相仓” | 精确表达本仓 own 的观察面真相,同时保留只读和 no-write 边界 | 需要后续章节继续解释 report handoff、retention 和 evidence linkage 的细化形态 | 采用 |
| 方案 D: 定位为“外部观测产品绑定仓” | 与旧 README 和旧技术栈最接近 | 直接误导架构、配置和实施为需求前提 | 不采用 |

### 6.1 关键命名取舍

| 取舍 | 结论 |
|---|---|
| 是否在一句话定义中保留“基础仓”表述 | 不保留。它太抽象,无法说明本仓 own 的观察面真相。 |
| 是否在一句话定义中加入“只读” | 保留。这样可以在仓定义层就阻断“query / diagnostic / report handoff 反写 source truth”的误读。 |
| 是否在一句话定义中直接写 log / metric / trace / audit | 不直接写。它们会在后续章节展开,Step 02 只保留更高层的“观测材料 / 审计投影”概念。 |
| 是否在一句话定义中写 “evidence / retention” | 不直接写。这些更适合作为边界说明文字和后续章节对象,不是最短仓定义。 |

## 结构化中间产物

### 7.1 边界声明表

| 字段 | 结论 |
|---|---|
| 一句话定义 | `L4-observability` 是平台横切观测材料、审计投影与只读报告交接真相仓。 |
| 本仓不是什么 | 它不是业务 truth 仓、事件总线、治理决策仓、Artifact / evidence 正文仓、Identity 真相仓、runtime / sandbox 执行裁决仓、archive package / recovery 仓、console UI 仓、外部监控产品配置仓或真实验收 verdict / signoff 仓。 |
| 边界对象列表 | 仓:`L0-bus`;仓:`L1-governance`;仓:`L1-artifact`;仓:`L1-identity`;仓:`L2-runtime`;仓:`L4-sandbox`;仓:`L4-archive`;仓:`L5-console`;概念:`观测材料`;概念:`审计投影`;概念:`body-free 证据关联`;概念:`留存标记`;概念:`报告交接`;概念:`最终验收结论`。 |
| 单独成仓原因 | 跨域观察面必须统一 redaction、correlation、retention、body-free evidence linkage 和 no-write truth 口径,不能并入 source truth 仓、执行仓、归档仓或展示工具。 |

### 7.2 边界说明短文字

`L4-observability` 必须单独存在,因为跨域 log / metric / trace / audit material 需要统一的 redaction、correlation、retention 和 no-write truth 口径,不能散落在各 truth owner 或展示工具中。它最容易与 `L0-bus`、`L1-governance`、`L1-artifact`、runtime / sandbox、`L4-archive` 以及 console / APM 产品混淆。边界必须分开,因为本仓只拥有观察材料、审计投影和只读交接事实,不拥有业务 truth、证据正文、执行 truth、归档正文或产品配置 truth。

### 7.3 易混淆边界结论

| 类型 | 对象 | 混淆点 | Step 02 收束口径 |
|---|---|---|---|
| 仓 | `L0-bus` | 容易把“事件投递 / tap / replay 主干”与“事件观察材料”混成一个仓 | `L0-bus` 拥有事件协作 truth;本仓只拥有观察材料和审计投影,不拥有投递主干 truth |
| 仓 | `L1-governance` | 容易把审计投影和 report handoff 当成治理结论本体 | `L1-governance` 拥有治理 truth;本仓只拥有其只读观察与交接语境 |
| 仓 | `L1-artifact` | 容易把 body-free evidence linkage 写成 evidence body ownership | `L1-artifact` 拥有制品与证据正文;本仓只拥有 body-free 关联线索 |
| 仓 | `L1-identity` | 容易把 actor / subject safe ref 扩大为身份正文或权限裁决 | `L1-identity` 拥有身份 truth;本仓只保留安全引用语境 |
| 仓 | `L2-runtime` / `L4-sandbox` | 容易把 log / metric / trace 和 diagnostic 写成执行结论或控制入口 | runtime / sandbox 拥有 execution truth;本仓只拥有安全观察面 |
| 仓 | `L4-archive` | 容易把 retention marker / archive eligibility 写成 archive package 或 recovery 正文 | `L4-archive` 拥有归档 / 恢复正文;本仓只拥有留存观察和只读交接语境 |
| 仓 / 工具 | `L5-console` / 外部 APM | 容易把 dashboard、Grafana、Prometheus 或 OTel 产品配置写成本仓本体 | console / 外部产品只是消费或运行期候选;本仓不是产品配置 truth owner |
| 概念 | `报告交接` vs `最终验收结论` | 容易把 handoff、diagnostic summary 或 evidence index input 写成真实 verdict / signoff | 本仓只拥有只读交接事实;最终验收结论和真实签署不属于本仓 |

### 7.4 单独成仓原因结论

`L4-observability` 必须单独成仓,不是因为“监控东西很多”,而是因为观察材料和审计投影的真相边界独立。跨域观察面需要把多个 truth owner 的材料统一成可脱敏、可关联、可留存、可追溯、不可反写的只读观察面;如果这些事实分散到 bus、governance、artifact、identity、runtime、archive 或 console,每个仓都会形成一份局部观察语义,后续无法稳定回答“材料来自哪里、是否安全、与哪些 evidence 有关、是否还能留存、是否只是交接而不是最终结论”。

## 回填草稿

正式第 2 章应使用固定边界声明表和一段边界说明短文字。候选正文如下:

```md
## 2. 本仓定位与边界

> 校准来源:
> - `design-calibration/00_req_step_02_position_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“当前文档问题诊断”和“设计取舍”小节,了解本仓边界如何从历史材料和相邻仓混淆中收敛。

| 字段 | 结论 |
|---|---|
| 一句话定义 | `L4-observability` 是平台横切观测材料、审计投影与只读报告交接真相仓。 |
| 本仓不是什么 | 它不是业务 truth 仓、事件总线、治理决策仓、Artifact / evidence 正文仓、Identity 真相仓、runtime / sandbox 执行裁决仓、archive package / recovery 仓、console UI 仓、外部监控产品配置仓或真实验收 verdict / signoff 仓。 |
| 边界对象列表 | 仓:`L0-bus`;仓:`L1-governance`;仓:`L1-artifact`;仓:`L1-identity`;仓:`L2-runtime`;仓:`L4-sandbox`;仓:`L4-archive`;仓:`L5-console`;概念:`观测材料`;概念:`审计投影`;概念:`body-free 证据关联`;概念:`留存标记`;概念:`报告交接`;概念:`最终验收结论`。 |
| 单独成仓原因 | 跨域观察面必须统一 redaction、correlation、retention、body-free evidence linkage 和 no-write truth 口径,不能并入 source truth 仓、执行仓、归档仓或展示工具。 |

`L4-observability` 必须单独存在,因为跨域 log / metric / trace / audit material 需要统一的 redaction、correlation、retention 和 no-write truth 口径,不能散落在各 truth owner 或展示工具中。它最容易与 `L0-bus`、`L1-governance`、`L1-artifact`、runtime / sandbox、`L4-archive` 以及 console / APM 产品混淆。边界必须分开,因为本仓只拥有观察材料、审计投影和只读交接事实,不拥有业务 truth、证据正文、执行 truth、归档正文或产品配置 truth。
```

## 待确认事项

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| `Q-STEP02-001` | 是否需要在一句话定义中显式写出“retention marker” | 当前不需要。它属于本仓边界对象和后续能力对象,不适合塞进最短仓定义。 |
| `Q-STEP02-002` | 是否需要在边界对象列表中加入 `report handoff` 与 `final verdict` 的并列概念 | 当前需要。当前仓最容易在“交接事实”与“真实结论”之间串线,所以 Step 02 必须先钉住。 |
| `Q-STEP02-003` | 是否需要把外部 APM / Grafana / Prometheus / OTel 明确列为边界对象 | 当前不直接列产品名。保留“外部监控产品配置仓 / console / APM 工具”层级即可,避免再次把技术栈抬成仓定义。 |

## 自检

| 检查项 | 结果 |
|---|---|
| 是否只写仓级定位和边界 | pass |
| 是否能用 3~5 句话说清本仓定位 | pass |
| 是否明确本仓不是什么 | pass |
| 是否指出至少 2 个最易混淆边界 | pass |
| 是否未展开使用方与依赖 | pass |
| 是否未展开核心能力闭环、功能需求、规则表、数据矩阵、接口清单、非功能指标或风险表 | pass |
| 是否未把 report handoff、diagnostic 或观察摘要误写成最终验收结论 | pass |
| 是否未把 OTel / Prometheus / Grafana / TimescaleDB / 对象存储写回仓定义 | pass |
| 是否未写入正式 `00-需求文档.md` | pass |
| 是否发现阻塞进入下一补强步骤的上游 blocker | no |

## 门禁

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| pass | 已完成 Step 02 审查后补强,一句话定义、非职责、边界对象、单独成仓原因和“只读交接不等于最终结论”边界已收束 | wait_user_or_start_step_15_strengthening_after_confirmation |
