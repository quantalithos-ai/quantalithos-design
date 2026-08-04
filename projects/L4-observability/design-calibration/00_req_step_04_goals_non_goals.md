# Step 04 目标与非目标

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 04 目标与非目标 |
| 输出文件 | `design-calibration/00_req_step_04_goals_non_goals.md` |
| 当前模式 | full-restart |
| 当前轮次 | 审查后补强 |
| 已读取项目台账 | yes |
| 已读取需求 flow | yes |
| 已读取前序 Step | yes, 已读取补强后的 `00_req_step_02_position_boundary.md` 与 `00_req_step_03_problem_context.md` |
| 已读取 SOP / 书写规范 | yes, 需求 SOP Step 04 与需求书写规范 4.4 |
| 已读取上游粒度参考 | yes, `L1-governance` 与 `L1-artifact` 的 Step 04 中间产物 |
| 已读取历史材料 | yes, 旧 `README.md`、旧 `00-需求文档.md` 仅作为 historical material |
| 用户确认 | yes, 用户确认进入 Step 04 补强 |
| 进入条件 | pass |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 开工确认 / 必读文档:先思考 | done | Step 04 目标、输入、边界风险和禁写范围诊断 | pass | 进入必读文档再写入。 |
| 开工确认 / 必读文档:再写入 | done | 必读文档摘要、输入索引、执行约束 | pass | 进入目标收敛先思考。 |
| 目标收敛:先思考 | done | 目标候选、裁剪项、验证方式写法诊断 | pass | 进入目标收敛再写入。 |
| 目标收敛:再写入 | done | 正式目标表和目标覆盖结论 | pass | 进入非目标收敛先思考。 |
| 非目标收敛:先思考 | done | 非目标候选、相邻仓归属和后续阶段后移诊断 | pass | 进入非目标收敛再写入。 |
| 非目标收敛:再写入 | done | 正式非目标表和范围收束表 | pass | 进入结构化中间产物。 |
| 结构化中间产物 | done | 目标结论、非目标结论和正式回填最小单元 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 4 章候选草稿 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表 / 是否允许进入下一补强 step | pass | wait_user_or_start_step_03_strengthening_after_confirmation |

## 2. 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| Step 04 开工 | pass | 已确认当前只允许推进 `00` 的 Step 04 审查后补强。 |
| 必读文档思考 | pass | 已明确 Step 04 只收口目标、非目标和范围,不写功能、规则、接口、数据或实现方案。 |
| 必读文档摘要写入 | pass | 已写入 Step 02 / 03、SOP、书写规范和上游参考对本步的约束。 |
| 目标收敛思考 | pass | 已完成目标候选、裁剪项和验证方式写法诊断。 |
| 目标表写入 | pass | 已形成 6 条目标,均可回指后续章节验证。 |
| 非目标收敛思考 | pass | 已完成相邻仓非目标、后续阶段后移项和应裁剪空话诊断。 |
| 非目标表写入 | pass | 已形成 12 条非目标和 4 条范围收束结论。 |
| 结构化中间产物 | pass | 已整理目标、非目标和正式回填最小单元。 |
| 回填草稿 | pass | 已形成正式第 4 章候选草稿。 |
| 自检与停审 | pass | Step 04 审查后补强已完成。 |
| 正式文档写入 | blocked | 正式 `00-需求文档.md` 仍等待 Step 17 统一装配。 |
| 当前下一步 | `Step 03 背景与问题定义（补强）:开工确认 / 必读文档:先思考` |

当前不得直接写正式 `00-需求文档.md`，也不得自动进入 Step 03。下一步只允许在用户确认后进入 `Step 03 背景与问题定义（补强）`。

## 3. 开工确认 / 必读文档:先思考

### 3.1 本步目标诊断

Step 04 的任务是把 `L4-observability` 本次需求到底要达成哪些状态、边界和能力范围收口清楚，并同时明确哪些相关事项虽然会被后续消费、引用或集成，但当前不纳入本仓 / 本章主范围。它既不是把 Step 03 的问题换个说法重写一遍，也不是提前进入 Step 07 的能力闭环、Step 09 的功能表、Step 10 的规则表或 Step 13 / 14 的指标和验收。

对 `L4-observability` 来说，Step 04 最容易犯的错有四类。第一类是把目标写成产品栈或产品组合，例如 OTel、Prometheus、Grafana、TimescaleDB、对象存储、dashboard 或 alert pipeline。第二类是把目标写成对象 schema、字段、接口、状态机、算法或配置项。第三类是把“报告交接”“证据关联”“留存”误写成最终验收结论、证据正文归属或 archive 正文 ownership。第四类是把非目标写成空话，例如“不做过度设计”“不解决所有问题”，而不是明确指向相邻仓或后续阶段。

### 3.2 必读文档候选

| 文档 | 必读原因 | 预计落点 |
|---|---|---|
| `standards/document/需求文档讨论流程_SOP.md` Step 04 | 固定本步目标、输入、输出和进入下一步的门禁。 | 目标 / 非目标 / 范围收束三类产物。 |
| `standards/document/需求文档书写规范.md` 4.4 | 固定目标表和非目标表的写法,以及不得滑入的内容。 | 目标表、非目标表、自检表。 |
| `00_req_step_02_position_boundary.md` | 固定本仓拥有的 truth 范围和不拥有的 truth 范围。 | 目标和非目标必须继承仓级边界。 |
| `00_req_step_03_problem_context.md` | 固定要回应的问题主线。 | 目标必须直接回应横切观测基线、投影混层、脱敏关联和留存交接问题。 |
| 旧 `README.md` | 识别旧目标为何会被产品栈、性能数字和目录树绑死。 | 当前文档问题诊断。 |
| 旧 `00-需求文档.md` | 只提取 `no-write truth`、`body-free evidence`、`retention / report handoff` 等方向线索。 | 改动前后对比和设计取舍。 |
| `projects/L1-governance/design-calibration/00_req_step_04_goals_non_goals.md` | 参考 Step 04 如何把目标、非目标和范围收束拆清楚。 | 补足思考层、裁剪层和回填层。 |
| `projects/L1-artifact/design-calibration/00_req_step_04_goals_non_goals.md` | 参考与相邻 truth owner 的非目标写法。 | 细化 Artifact / evidence body 边界和后续阶段后移写法。 |

### 3.3 初步关注点

- 目标必须回应 Step 03 的问题主线，而不是重复 Step 02 的一句话定义。
- 目标要写成“成立的状态、边界或能力范围”，不能写成功能名、接口名或实现路径。
- 非目标必须具体指向相邻 truth owner、外部产品、真实测试 / 验收阶段或后续设计阶段。
- report handoff、证据真实性提示、retention marker 和 no-write truth 只能作为边界目标,不能被写成真实 verdict、真实 evidence 或 archive / recovery 正文。
- 外部 APM、Grafana、Prometheus、OTel、对象存储、告警产品、管理报表和异常检测最多是外围增强主题或后续候选,不是 Step 04 的硬目标。

### 3.4 本模块停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 本步目标诊断 | pass | 已明确 Step 04 只收口目标与非目标。 |
| 必读文档候选 | pass | 已固定标准、前序 Step、历史材料和上游参考。 |
| 初步关注点 | pass | 已明确本步最易混层的五类误写。 |
| 正式目标表写入 | blocked | 当前尚未进入目标收敛正式写入。 |
| 正式文档写入 | blocked | 正式 `00-需求文档.md` 仍等待 Step 17。 |
| 当前下一步 | `开工确认 / 必读文档:再写入` |

## 4. 开工确认 / 必读文档:再写入

### 4.1 必读文档摘要

| 文档 | 读取结论 | 对 Step 04 的影响 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 04 | Step 04 只收口本次需求要达成什么、不达成什么,不写闭环步骤、功能清单、规则表、接口清单或实现方案。 | 后续必须先做目标候选诊断,再写目标表;再做非目标诊断,再写非目标表。 |
| `需求文档书写规范.md` 4.4 | 目标表固定使用 `目标 / 说明 / 验证方式`;非目标表固定使用 `非目标 / 不做原因`。 | 每个目标都要可验证;每个非目标都必须具体且有边界作用。 |
| Step 02 本仓定位与边界 | 本仓只拥有横切观测材料、审计投影与只读报告交接真相,不拥有业务 truth、事件总线主干、治理 truth、artifact / evidence 正文、identity truth、runtime execution truth、archive 正文、console UI 或外部产品配置 truth。 | 目标必须落在 observation / audit projection / read-only handoff / no-write truth 语境内;非目标必须显式排除相邻仓 truth 和外部产品绑定。 |
| Step 03 背景与问题定义 | 当前问题主线是横切观测材料缺少统一需求基线、审计投影与业务 truth 容易混层、脱敏与关联口径缺少前置收束、留存标记与报告交接边界缺少正式问题定义。 | 目标必须逐项回应这四类问题,而不是继续补写性能、目录结构、产品栈或对象 schema。 |
| 旧 `README.md` | 把目标隐含为 OTel、Prometheus、Grafana、TimescaleDB、对象存储、P95、冷存、append-only 和 dashboard。 | 当前需要把“产品 / 指标绑定目标”重写成“边界 / 状态 / 能力范围目标”。 |
| 旧 `00-需求文档.md` | 已有 `no-write truth`、`body-free evidence`、`retention / report handoff` 等方向线索,但混入 schema version、hash linkage、replay / rebuild、性能数字和后续对象词。 | 这些方向可以保留为目标主题,但必须上收为需求边界,不能保留细节词。 |
| `L1-governance` / `L1-artifact` Step 04 | 参考项目都把 Step 04 拆成目标收敛、非目标收敛、范围收束和回填草稿。 | 本步需要补足“先思考、再写表、再停审”的中间过程,不只保留最终两张表。 |

### 4.2 Step 04 输入索引

| 输入类型 | 已确认来源 | Step 04 使用方式 |
|---|---|---|
| 仓定位输入 | Step 02 | 确定目标不能越过 observation truth 范围,非目标必须指向相邻 truth owner 或外部产品层。 |
| 问题主线输入 | Step 03 | 确定目标必须回应横切基线、投影混层、脱敏关联和留存交接问题。 |
| 历史材料输入 | 旧 README、旧 `00` | 识别哪些旧目标其实是产品选型、性能数字、实现路径或后续对象词。 |
| 上游粒度输入 | `L1-governance`、`L1-artifact` Step 04 | 参考如何写出具体非目标和范围后移项。 |
| 用户重点边界输入 | 当前任务说明 | 确保目标 / 非目标能够承接 log / metric / trace / audit schema、redaction、correlation id、evidence linkage、retention marker、report handoff 和不反写业务 truth 的后续展开空间。 |

### 4.3 执行约束

| 约束 | 当前口径 |
|---|---|
| 目标写法 | 目标只能写本次需求完成后应成立的状态、边界或能力范围,不能写功能、接口或实现路径。 |
| 非目标写法 | 非目标必须具体指向不纳入当前仓 / 当前主范围的事项,不能写成空洞口号。 |
| 不写后续细节 | 不写 schema、字段、状态机、事务、表结构、算法、产品选型、测试步骤、CI 或实施任务。 |
| 不重开仓定义 | 仓定义已在 Step 02 收口,本步只承接并转化为目标和非目标。 |
| 不把外围增强写成硬目标 | dashboard、alert、外部产品绑定、管理报表、异常检测和外部 GRC 导出不在本步写成硬目标。 |
| 正式文档后置 | 当前仍只写 `design-calibration` 中间产物,正式 `00-需求文档.md` 留待 Step 17。 |

### 4.4 下一步输入

`目标收敛:先思考` 需要先完成三件事:一是把 Step 03 的四类问题主线映射成可验证目标;二是把旧 README 和旧 `00` 中的产品、性能和实现词裁掉;三是确定每个目标的验证方式应回指后续哪些章节,而不是直接写成测试或验收动作。

### 4.5 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 必读文档摘要 | pass | 已写入标准、Step 02 / 03 和历史材料对 Step 04 的约束。 |
| 输入索引 | pass | 已明确目标和非目标的来源。 |
| 执行约束 | pass | 已明确 Step 04 不得滑入功能、规则、接口和实现。 |
| 目标收敛思考 | pass | 已在 §5 完成候选诊断。 |
| 正式文档写入 | blocked | 正式 `00-需求文档.md` 仍等待 Step 17。 |
| 当前下一步 | `目标收敛:先思考` |

## 5. 目标收敛:先思考

### 5.1 目标收敛目标

本模块只诊断“本次需求完成后需要成立什么”，不直接写正式目标表。对 `L4-observability` 来说，合格的目标必须同时满足两个条件。第一，它要直接回应 Step 03 暴露的问题主线。第二，它要能被后续章节持续验证，而不是只能靠某个产品选型、某个字段设计或某组性能数字证明成立。

### 5.2 目标候选分层

| 类别 | 判断标准 | 当前处理方式 |
|---|---|---|
| 应保留的正式目标 | 能直接回应 Step 03 问题主线,且可以用后续章节是否越界、是否闭口来验证。 | 保留进正式目标表。 |
| 当前应裁剪的候选 | 只是功能名、产品名、对象 schema、指标数字、实现路径或测试动作。 | 不进入目标表。 |
| 应后移后续文档的候选 | 与 schema、接口、配置、测试、实施或产品选型有关,但对后续设计仍重要。 | 留到后续 Step / 正式设计文档闭口。 |

### 5.3 保留目标方向诊断

| 候选方向 | 来源 | 保留理由 | 下一步写入口径 |
|---|---|---|---|
| 建立横切观测材料的统一需求边界 | Step 02；Step 03 问题 1 | 没有这一目标,后续所有设计都会从局部日志、局部指标或产品栈倒推需求。 | 写成“observation material 边界成立”的目标。 |
| 收束审计投影与 body-free 证据关联边界 | Step 02；Step 03 问题 2 | 没有这一目标,observability 会被误写成 governance / artifact / identity / runtime 的第二 truth。 | 写成“审计投影与证据关联边界成立”的目标。 |
| 建立 redaction 与 correlation 的统一需求口径 | Step 02 单独成仓原因；Step 03 问题 3 | 没有这一目标,后续会用 raw label、full ref、opaque id 或临时映射补齐关联。 | 写成“安全输出与跨仓关联口径成立”的目标。 |
| 收束只读诊断、报告交接与真实性提示边界 | Step 02；Step 03 问题 4 | 没有这一目标,diagnostic / handoff 很容易被误写成 final verdict、真实 evidence 或签署入口。 | 写成“只读交接和真实性边界成立”的目标。 |
| 建立 retention marker、活动引用保护和 no-write truth 防线 | Step 02 单独成仓原因；Step 03 问题 4 | 没有这一目标,后续会把 retention / rebuild / replay 写成 archive / recovery / source truth 修复。 | 写成“留存与不反写真相边界成立”的目标。 |
| 收束相邻 truth owner 协作边界 | Step 02 边界对象；Step 03 业务问题 | 没有这一目标,后续依赖、接口、规则和验收都会重新串回 bus、governance、artifact、identity、runtime、archive 或外部产品。 | 写成“相邻仓协作但不转移 truth”的目标。 |

### 5.4 应裁剪目标候选

| 候选 | 裁剪理由 | 后续归属 |
|---|---|---|
| OTel / Prometheus / Grafana / TimescaleDB / 对象存储 | 属于产品 / 存储候选,不是需求目标。 | `01/04/07`。 |
| P95 / P99 / SLA / 冷存年限 / hash chain 分片 / 事件数量 | 属于非功能 / 测试 / 容量候选,不是目标层。 | `13/14/05/06`。 |
| log / metric / trace / audit event schema、字段和状态枚举 | 属于对象 / 协议细化,不是目标层。 | `02/03`。 |
| query API、diagnostic API、report DTO、evidence index input format | 属于接口和交接格式细化,不是目标层。 | `12/03/05/06`。 |
| replay / rebuild 流程、hash 算法、canonicalization、retention state machine | 属于规则 / 数据 / 详细设计细化,不是目标层。 | `10/11/03/04/06`。 |
| 真实 `run_id`、真实 evidence alias、final verdict、signoff | 属于真实测试执行与验收阶段,不是目标层。 | `05/06`。 |

### 5.5 目标验证方式写法

| 目标类型 | 验证方式写法 |
|---|---|
| 边界目标 | 写“后续章节不再把某类外部 truth 写成本仓 own 的内容”。 |
| 只读 / no-write 目标 | 写“后续规则、数据和验收能证明 query / diagnostic / handoff 不反写真相”。 |
| 安全输出 / 关联目标 | 写“后续规则、数据和接口能持续检查 forbidden body、full ref、opaque mapping 是否越界”。 |
| 留存 / 交接目标 | 写“后续数据、非功能、测试和验收能区分 retention marker、report handoff、archive package 和真实 evidence”。 |
| 协作边界目标 | 写“后续依赖、接口、规则和验收可验证不转移相邻仓 truth”。 |

### 5.6 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 目标候选诊断 | pass | 已识别 6 个需要正式保留的目标方向。 |
| 裁剪项诊断 | pass | 已剔除产品、指标、接口、对象和真实证据类候选。 |
| 目标表写入 | pass | 已在 §6.2 写入正式目标表。 |
| 非目标收敛写入 | blocked | 当前尚未进入非目标正式写入。 |
| 当前下一步 | `目标收敛:再写入` |

## 6. 目标收敛:再写入

### 6.1 写入原则

目标表只记录本次需求完成后应成立的状态、边界或能力范围。每条目标都必须有明确的对象范围、有为什么需要成立的说明,以及能被后续章节持续检查的验证方式。目标表不写接口名、不写具体字段、不写测试步骤、不写性能数字。

### 6.2 目标结论

| 目标 | 说明 | 验证方式 |
|---|---|---|
| 建立横切观测材料的统一需求边界 | 明确本仓讨论的是跨仓 observation material、audit projection 和 read-only handoff 语境,不是各 source owner 的业务 truth、本地日志实现或外部观测产品栈。 | 后续用户、依赖、能力、功能、数据和验收章节都能回指 observation material 边界,且不把业务 truth、bus 主干、治理结论或产品配置写成本仓 own 的内容。 |
| 收束审计投影与 body-free 证据关联边界 | 明确本仓可以承载可审计投影、证据引用、摘要和缺口语境,但不拥有 governance body、artifact / evidence body、identity body、runtime body 或 source audit truth 正文。 | 后续规则、数据和验收章节不出现本仓替代 Governance、Artifact、Identity、runtime / sandbox truth 的表述,且证据关联始终保持 body-free。 |
| 建立 redaction 与 correlation 的统一需求口径 | 明确 log、metric、trace、audit material、diagnostic summary 和 report handoff 在需求层必须同时满足安全输出和跨仓可关联两类要求,但本 Step 不固化字段、schema 或算法。 | 后续章节能持续检查 raw body、secret、payload body、full sensitive ref、opaque id 和临时映射是否越界,并保持跨仓关联语境可解释。 |
| 收束只读诊断、报告交接与真实性提示边界 | 明确 query、diagnostic、summary、report handoff 和 evidence hint 只承载只读观察材料、缺口说明和真实性提示,不生成 final verdict、真实 evidence、验收签署或业务裁决。 | 后续故事、功能、规则和验收章节都能区分只读交接与最终结论,且不静态填写真实 `run_id`、真实 evidence alias、final verdict 或 signoff。 |
| 建立 retention marker、活动引用保护和 no-write truth 防线 | 明确 retention、active reference、replay / rebuild 和 gap handling 必须只约束观察面与派生投影,不能删除仍被引用的材料,也不能修复、覆盖或反写 source truth。 | 后续数据、非功能、测试和验收章节能区分 retention marker、archive package、report handoff、rebuild 和 source truth,并持续证明 no-write boundary 成立。 |
| 收束相邻 truth owner 协作边界 | 明确本仓与 `L0-bus`、`L1-governance`、`L1-artifact`、`L1-identity`、runtime / sandbox、archive、console / 外部 APM 的关系是引用、投影、摘要、交接或消费协作,不是 truth ownership 转移。 | 后续依赖、接口、规则和验收章节均可验证本仓不接管相邻仓 truth,也不把外部产品或旧材料升级为当前需求 truth source。 |

### 6.3 目标覆盖结论

| Step 03 问题主线 | Step 04 目标承接 |
|---|---|
| 横切观测材料缺少统一需求基线 | `建立横切观测材料的统一需求边界` |
| 审计投影与业务 truth 容易混层 | `收束审计投影与 body-free 证据关联边界`;`收束相邻 truth owner 协作边界` |
| 脱敏与关联口径缺少前置问题收束 | `建立 redaction 与 correlation 的统一需求口径` |
| 留存标记与报告交接边界缺少正式问题定义 | `收束只读诊断、报告交接与真实性提示边界`;`建立 retention marker、活动引用保护和 no-write truth 防线` |

### 6.4 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 正式目标表 | pass | 已形成 6 条目标。 |
| 问题主线映射 | pass | Step 03 的四类问题均有目标承接。 |
| 非目标收敛思考 | pass | 已在 §7 完成候选诊断。 |
| 当前下一步 | `非目标收敛:先思考` |

## 7. 非目标收敛:先思考

### 7.1 非目标收敛目标

非目标不是“我们什么都不做”。它要明确说明哪些相关事项虽然会被本仓引用、投影、交接或消费，但当前不属于本仓 truth、当前不属于本次需求主范围,或者当前必须后移到后续设计 / 测试 / 实施文档。对 `L4-observability` 来说，非目标写得不够具体，就会直接诱发相邻仓串线和产品绑架。

### 7.2 非目标候选分层

| 类别 | 判断标准 | 当前处理方式 |
|---|---|---|
| 应保留的正式非目标 | 明确指向相邻 truth owner、外部产品层、真实测试 / 验收阶段或后续设计阶段。 | 保留进正式非目标表。 |
| 当前应裁剪的空泛非目标 | 例如“不解决所有问题”“不考虑未来扩展”“不做过度设计”。 | 不进入非目标表。 |
| 应作为外围增强保留的主题 | 如 dashboard、alert、管理报表、异常检测、外部 GRC 导出。 | 不在本步写成非目标本体,只排除其产品 ownership / truth ownership / 硬前置形态。 |

### 7.3 保留非目标方向诊断

| 候选方向 | 来源 | 保留理由 | 下一步写入口径 |
|---|---|---|---|
| 事件总线主干、ack / retry / dead-letter / replay 主干 | Step 02；Step 03 | 这些是 `L0-bus` truth,不是 observation truth。 | 写成相邻仓非目标。 |
| Governance decision、Policy、Gate、AIIA、SoA、Control 或 Nonconformity 结论 | Step 02；用户重点边界 | 这些是 `L1-governance` truth,只能被观察或交接。 | 写成相邻仓非目标。 |
| Artifact / evidence body、identity truth、runtime execution truth、archive package / recovery 正文 | Step 02；Step 03 | 这些是最容易与 observability 串线的正文和 truth。 | 写成相邻仓非目标。 |
| Console / dashboard ownership、外部 APM 产品配置、具体存储产品选型 | 旧 README；Step 03 | 这些是产品层或架构层,不是当前需求 truth。 | 写成产品 / 配置非目标。 |
| 真实测试 `run_id`、真实 evidence alias、验收签署、final verdict | 用户规则；Step 02；Step 03 | 这些属于真实测试和验收阶段,设计文档不能伪造。 | 写成真实执行 / 验收非目标。 |
| schema、接口、数据模型、状态机、事务、表结构、adapter、代码目录 | 书写规范 4.4 | 这些属于后续 Step 或后续设计文档。 | 写成后续阶段非目标。 |
| 旧 P95、冷存年限、hash chain 分片、事件数量硬化 | 旧 README；Step 03 | 这些没有当前可验证来源,不能被固化进目标层。 | 写成非功能 / historical material 非目标。 |

### 7.4 应裁剪的非目标空话

| 候选 | 裁剪理由 |
|---|---|
| 不解决所有问题 | 没有边界作用。 |
| 不考虑未来扩展 | 没有说明当前到底排除了什么。 |
| 不做过度设计 | 属于方法论口号,不是范围结论。 |
| 不追求完美 | 没有说明归属对象或后移阶段。 |

### 7.5 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 非目标候选诊断 | pass | 已识别 12 个需要正式保留的非目标方向。 |
| 空泛非目标裁剪 | pass | 已剔除没有边界作用的空话。 |
| 正式非目标表写入 | pass | 已在 §8.2 写入正式非目标表。 |
| 当前下一步 | `非目标收敛:再写入` |

## 8. 非目标收敛:再写入

### 8.1 写入原则

非目标表只记录虽然相关、但当前明确不纳入本仓 / 本次需求主范围的事项。每条非目标都必须有明确的归属对象或后移阶段,不能写成抽象口号,也不能把后续外围增强主题误写为完全不相关。

### 8.2 非目标结论

| 非目标 | 不做原因 |
|---|---|
| 事件总线、ack / retry / dead-letter / replay 主干 | 属于 `L0-bus`;本仓只讨论 observation material、audit projection 和 read-only handoff 的需求边界。 |
| Governance decision、Policy、Gate、AIIA、SoA、Control 或 Nonconformity 结论本体 | 属于 `L1-governance`;本仓可以观察、引用或交接相关线索,但不得替代治理 truth。 |
| Artifact / evidence 正文、artifact 版本 / 血缘 / 基线本体和 archive package body | 属于 `L1-artifact` 或 archive / 对应 evidence owner;本仓只讨论 body-free 关联、引用和交接语境。 |
| Identity member、actor、role、subject lifecycle truth | 属于 `L1-identity`;本仓只讨论安全 actor / subject 引用进入观察面时的边界。 |
| runtime / sandbox execution truth、调度控制、kill / retry / recovery 命令和执行裁决 | 属于 runtime / sandbox 边界;本仓不把 trace、metric、log、summary 或 diagnostic 当 execution truth。 |
| archive package、长期正文保存和恢复流程 | 属于 archive 或后续存储 / 配置 / 实施边界;本仓只在需求层讨论 retention marker、冲突语境和交接问题。 |
| console UI、workspace view、Grafana dashboard ownership、外部 APM 产品配置和具体存储产品选型 | 属于展示层、外部产品层或后续架构 / 配置文档;当前需求不绑定产品栈。 |
| 真实测试 `run_id`、真实 evidence alias、passed evidence、验收签署和最终 verdict | 属于真实测试执行与验收阶段;设计文档不得伪造真实证据或签署。 |
| query / diagnostic / report assembly 对 source truth 的写入、修复、删除或裁决 | 本仓只承载只读观察和交接边界,不承担业务 truth 维护或外部 truth 修复。 |
| 具体 schema、接口、数据模型、状态机、事务、表结构、索引、代码目录和 adapter 实现 | 属于后续需求 Step 或 `01~07` 设计文档;Step 04 只收束目标与非目标。 |
| 旧 P95 / P99 / SLA、冷存年限、hash chain 分片、事件数量和旧 dashboard 指标硬化 | 当前缺少真实证据来源;只能作为后续阶段候选输入,不得在目标层固化。 |
| 旧 implementation ledger、旧 implementation boundaries 和旧执行门禁直接沿用 | 这些已降级为 historical material;只能在按新设计完成 `07-实施计划.md` 后重新重建。 |

### 8.3 范围收束结论

| 范围主题 | 当前收束 |
|---|---|
| 本 Step 允许进入正式 `00` 的内容 | 目标表、非目标表和一段简短范围说明。 |
| 后续需求 Step 才能展开的内容 | 用户与角色、使用方与依赖、核心能力闭环、用户故事、功能、规则、数据、接口、非功能、验收和追溯矩阵。 |
| 后续正式文档才闭口的内容 | 架构分解、概要对象、详细 contract、配置项、测试证据、验收门禁、实施计划和 implementation boundary。 |
| 当前明确禁止升级为硬目标的内容 | 产品栈、性能数字、冷存期限、hash chain 分片、console ownership、真实 `run_id`、真实 evidence alias 和验收签署。 |

### 8.4 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 正式非目标表 | pass | 已形成 12 条非目标。 |
| 范围收束表 | pass | 已明确哪些内容留在 Step 04,哪些后移。 |
| 结构化中间产物 | pass | 已在 §9 汇总结论。 |
| 当前下一步 | `结构化中间产物` |

## 9. 结构化中间产物

### 9.1 目标结论

`L4-observability` 的 Step 04 目标不是“搭一个监控平台”或“把旧 README 里的产品栈落地”，而是把 observation material、audit projection、redaction / correlation、read-only handoff、retention marker 和 no-write truth 这些横切边界收成后续所有章节的共同目标前提。

### 9.2 非目标结论

本仓当前明确不接管任何业务 truth、治理 truth、artifact / evidence 正文、identity truth、runtime execution truth、archive 正文、console / product configuration truth，也不在 Step 04 决定 schema、接口、状态机、产品选型、性能数字、真实 evidence 或验收签署。

### 9.3 正式回填最小单元

| 正式第 4 章组件 | 来源 |
|---|---|
| 目标表 | 本文件 §6.2 |
| 非目标表 | 本文件 §8.2 |
| 范围收束短说明 | 本文件 §8.3 与 §10 |

## 10. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §4。正式文档不重复写 §3~§9 的思考过程，只摘录结论。

```md
## 4. 目标与非目标

> 校准来源:
> - `design-calibration/00_req_step_04_goals_non_goals.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“目标结论”“非目标结论”“范围收束结论”和“设计取舍”小节,了解本章如何从旧产品栈 / 旧指标目标收敛为当前边界目标。

### 4.1 目标

| 目标 | 说明 | 验证方式 |
|---|---|---|
| 建立横切观测材料的统一需求边界 | 明确本仓讨论的是跨仓 observation material、audit projection 和 read-only handoff 语境,不是各 source owner 的业务 truth、本地日志实现或外部观测产品栈。 | 后续用户、依赖、能力、功能、数据和验收章节都能回指 observation material 边界,且不把业务 truth、bus 主干、治理结论或产品配置写成本仓 own 的内容。 |
| 收束审计投影与 body-free 证据关联边界 | 明确本仓可以承载可审计投影、证据引用、摘要和缺口语境,但不拥有 governance body、artifact / evidence body、identity body、runtime body 或 source audit truth 正文。 | 后续规则、数据和验收章节不出现本仓替代 Governance、Artifact、Identity、runtime / sandbox truth 的表述,且证据关联始终保持 body-free。 |
| 建立 redaction 与 correlation 的统一需求口径 | 明确 log、metric、trace、audit material、diagnostic summary 和 report handoff 在需求层必须同时满足安全输出和跨仓可关联两类要求,但本 Step 不固化字段、schema 或算法。 | 后续章节能持续检查 raw body、secret、payload body、full sensitive ref、opaque id 和临时映射是否越界,并保持跨仓关联语境可解释。 |
| 收束只读诊断、报告交接与真实性提示边界 | 明确 query、diagnostic、summary、report handoff 和 evidence hint 只承载只读观察材料、缺口说明和真实性提示,不生成 final verdict、真实 evidence、验收签署或业务裁决。 | 后续故事、功能、规则和验收章节都能区分只读交接与最终结论,且不静态填写真实 `run_id`、真实 evidence alias、final verdict 或 signoff。 |
| 建立 retention marker、活动引用保护和 no-write truth 防线 | 明确 retention、active reference、replay / rebuild 和 gap handling 必须只约束观察面与派生投影,不能删除仍被引用的材料,也不能修复、覆盖或反写 source truth。 | 后续数据、非功能、测试和验收章节能区分 retention marker、archive package、report handoff、rebuild 和 source truth,并持续证明 no-write boundary 成立。 |
| 收束相邻 truth owner 协作边界 | 明确本仓与 `L0-bus`、`L1-governance`、`L1-artifact`、`L1-identity`、runtime / sandbox、archive、console / 外部 APM 的关系是引用、投影、摘要、交接或消费协作,不是 truth ownership 转移。 | 后续依赖、接口、规则和验收章节均可验证本仓不接管相邻仓 truth,也不把外部产品或旧材料升级为当前需求 truth source。 |

### 4.2 非目标

| 非目标 | 不做原因 |
|---|---|
| 事件总线、ack / retry / dead-letter / replay 主干 | 属于 `L0-bus`;本仓只讨论 observation material、audit projection 和 read-only handoff 的需求边界。 |
| Governance decision、Policy、Gate、AIIA、SoA、Control 或 Nonconformity 结论本体 | 属于 `L1-governance`;本仓可以观察、引用或交接相关线索,但不得替代治理 truth。 |
| Artifact / evidence 正文、artifact 版本 / 血缘 / 基线本体和 archive package body | 属于 `L1-artifact` 或 archive / 对应 evidence owner;本仓只讨论 body-free 关联、引用和交接语境。 |
| Identity member、actor、role、subject lifecycle truth | 属于 `L1-identity`;本仓只讨论安全 actor / subject 引用进入观察面时的边界。 |
| runtime / sandbox execution truth、调度控制、kill / retry / recovery 命令和执行裁决 | 属于 runtime / sandbox 边界;本仓不把 trace、metric、log、summary 或 diagnostic 当 execution truth。 |
| archive package、长期正文保存和恢复流程 | 属于 archive 或后续存储 / 配置 / 实施边界;本仓只在需求层讨论 retention marker、冲突语境和交接问题。 |
| console UI、workspace view、Grafana dashboard ownership、外部 APM 产品配置和具体存储产品选型 | 属于展示层、外部产品层或后续架构 / 配置文档;当前需求不绑定产品栈。 |
| 真实测试 `run_id`、真实 evidence alias、passed evidence、验收签署和最终 verdict | 属于真实测试执行与验收阶段;设计文档不得伪造真实证据或签署。 |
| query / diagnostic / report assembly 对 source truth 的写入、修复、删除或裁决 | 本仓只承载只读观察和交接边界,不承担业务 truth 维护或外部 truth 修复。 |
| 具体 schema、接口、数据模型、状态机、事务、表结构、索引、代码目录和 adapter 实现 | 属于后续需求 Step 或 `01~07` 设计文档;Step 04 只收束目标与非目标。 |
| 旧 P95 / P99 / SLA、冷存年限、hash chain 分片、事件数量和旧 dashboard 指标硬化 | 当前缺少真实证据来源;只能作为后续阶段候选输入,不得在目标层固化。 |
| 旧 implementation ledger、旧 implementation boundaries 和旧执行门禁直接沿用 | 这些已降级为 historical material;只能在按新设计完成 `07-实施计划.md` 后重新重建。 |

本次需求的范围是 observation material、audit projection、read-only handoff、retention marker 和 no-write truth 边界的需求收束,而不是完整监控产品、外部 APM 选型、archive 正文管理、真实验收执行或实现细节定稿。
```

## 11. 自检与门禁

| 检查项 | 结果 |
|---|---|
| 每个目标是否可验证 | pass |
| 每个非目标是否具体且有边界作用 | pass |
| 是否未把功能需求写成目标 | pass |
| 是否未把实现方案写成目标 | pass |
| 是否未把空洞口号写成目标 | pass |
| 是否未把废话写成非目标 | pass |
| 是否未写核心能力闭环、用户故事、业务规则、接口清单或数据归属 | pass |
| 是否未写入正式 `00-需求文档.md` | pass |
| 是否发现阻塞进入下一补强 step 的上游 blocker | no |

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| pass | 已完成 Step 04 审查后补强,目标、非目标和范围收束结论已形成,且目标可验证、非目标具体、不含功能、规则或实现方案 | wait_user_or_start_step_03_strengthening_after_confirmation |
