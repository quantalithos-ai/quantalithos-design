# Step 05 用户与角色

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 05 用户与角色 |
| 输出文件 | `design-calibration/00_req_step_05_users_roles.md` |
| 当前模式 | full-restart |
| 当前轮次 | 审查后补强 |
| 已读取项目台账 | yes |
| 已读取需求 flow | yes |
| 已读取前序 Step | yes, 已读取补强后的 `00_req_step_02_position_boundary.md` 与 `00_req_step_04_goals_non_goals.md` |
| 已做一致性反查 | yes, 已回看补强后的 `00_req_step_03_problem_context.md`,仅用于检查角色是否能承接问题主线,不把 Step 03 当作本步前置 truth |
| 已读取 SOP / 书写规范 | yes, 需求 SOP Step 05 与需求书写规范 4.5 |
| 已读取上游粒度参考 | yes, `L1-governance` 与 `L1-artifact` 的 Step 05 中间产物 |
| 已读取历史材料 | yes, 旧 `00-需求文档.md` 的角色表与权限表达仅作为 historical material |
| 用户确认 | yes, 用户确认进入 Step 05 补强 |
| 进入条件 | pass |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 开工确认 / 必读文档:先思考 | done | Step 05 目标、输入、禁写范围和角色识别风险诊断 | pass | 进入必读文档再写入。 |
| 开工确认 / 必读文档:再写入 | done | 必读文档摘要、输入索引和执行约束 | pass | 进入角色收敛先思考。 |
| 角色收敛:先思考 | done | 角色候选分层、裁剪项、权限矩阵必要性和分类写法诊断 | pass | 进入角色收敛再写入。 |
| 角色收敛:再写入 | done | 角色说明表、角色分类和权限差异矩阵写入 | pass | 进入当前文档问题诊断。 |
| 当前文档问题诊断 | done | 历史材料、旧 Step 05 和边界输入的差异诊断 | pass | 进入改动前后对比。 |
| 改动前后对比 | done | 补强前后结构、粒度和口径差异表 | pass | 进入设计取舍。 |
| 设计取舍 | done | 权限矩阵保留策略、角色泛化策略和裁剪策略 | pass | 进入结构化中间产物。 |
| 结构化中间产物 | done | 角色识别口径、角色结论、分类结论和权限差异结论 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 5 章候选草稿 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表 / 是否允许进入下一补强 step | pass | wait_user_or_start_step_10_strengthening_after_confirmation |

## 2. 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| Step 05 开工 | pass | 已确认当前只允许推进 `00` 的 Step 05 审查后补强。 |
| 必读文档思考 | pass | 已明确 Step 05 只写谁以什么身份接触本仓,不把仓际依赖、用户故事、接口动作或数据对象写成角色。 |
| 必读文档摘要写入 | pass | 已写入 Step 02、Step 04、SOP、书写规范和历史材料对本步的约束。 |
| 角色收敛思考 | pass | 已完成角色候选、裁剪项、矩阵必要性和分类写法诊断。 |
| 角色表写入 | pass | 已形成 8 个主要角色并区分人类与系统角色。 |
| 权限差异写入 | pass | 已形成能力级权限差异矩阵,且未写 API、Command、事件名或对象字段。 |
| 当前文档问题诊断 | pass | 已诊断旧正式 00 与当前较短 Step 05 的失焦点。 |
| 结构化中间产物 | pass | 已整理正式回填所需的最小单元。 |
| 回填草稿 | pass | 已形成正式第 5 章候选草稿。 |
| 自检与停审 | pass | Step 05 审查后补强已完成。 |
| 正式文档写入 | blocked | 正式 `00-需求文档.md` 仍等待 Step 17 统一装配。 |
| 当前下一步 | `Step 10 业务规则与边界约束（补强）:开工确认 / 必读文档:先思考` |

当前不得直接写正式 `00-需求文档.md`，也不得自动进入 Step 10。下一步只允许在用户确认后进入 `Step 10 业务规则与边界约束（补强）`。

## 3. 开工确认 / 必读文档:先思考

### 3.1 本步目标诊断

Step 05 的任务是回答:谁会以什么身份直接接触 `L4-observability` 的观察面真相,以及这些角色在什么语境下接触本仓。它不是依赖表,也不是故事表,更不是接口授权表。对于 `L4-observability` 来说,角色定义如果不干净,后续 Step 06 的使用方与依赖、Step 08 的用户故事、Step 09 的功能需求和 Step 12 的接口边界都会被提前污染。

这一章最容易犯四类错。第一类是把 `L0-bus`、`L1-governance`、`L1-artifact`、`L1-identity`、archive、console 或外部产品写成“角色”,实际它们是相邻仓、消费方或协作方。第二类是把 `query`、`diagnostic`、`rollup`、`report handoff`、`rebuild`、`gap scan` 之类能力或对象词写进角色定义。第三类是把“作为某角色,我希望...”的故事句式直接写成角色说明。第四类是把权限矩阵写成 API、Command、事件名或数据模型级别的实现说明。

### 3.2 必读文档候选

| 文档 | 必读原因 | 预计落点 |
|---|---|---|
| `standards/document/需求文档讨论流程_SOP.md` Step 05 | 固定本步只输出角色结论、系统角色结论、使用场景结论和必要时的权限差异结论。 | 本步结构和进入下一步门禁。 |
| `standards/document/需求文档书写规范.md` 4.5 | 固定角色说明表和按需权限矩阵的写法,并限制不得写仓际依赖、故事、接口和实现。 | 回填草稿、自检表。 |
| `00_req_step_02_position_boundary.md` | 固定本仓是 observation material、audit projection 和 read-only report handoff truth 仓。 | 角色场景不能越界到 source truth 或最终验收结论。 |
| `00_req_step_04_goals_non_goals.md` | 固定统一边界、body-free 关联、redaction / correlation、只读 handoff、retention / no-write、协作边界等目标。 | 角色场景必须承接这些目标,但不提前写能力和规则。 |
| `00_req_step_03_problem_context.md` | 仅做反向一致性校对,确认角色能覆盖问题主线里的观察、审计、脱敏、关联和交接语境。 | 角色完整性反查,不作为本步前置 truth。 |
| 旧 `00-需求文档.md` §5 | 提取旧 SRE、Auditor、owner、reviewer、source、consumer、maintenance 等角色线索。 | 保留角色方向,裁掉对象词和功能词。 |
| `projects/L1-governance/design-calibration/00_req_step_05_users_roles.md` | 参考 Step 05 如何拆出角色候选、裁剪项和场景边界。 | 中间产物结构补强。 |
| `projects/L1-artifact/design-calibration/00_req_step_05_users_roles.md` | 参考如何避免把系统协作方、正文 owner 和仓际依赖误写成角色。 | 角色收敛与裁剪层。 |

### 3.3 初步关注点

- 角色说明表只能回答“谁以什么身份接触本仓、在什么场景下接触”,不能回答“通过什么接口、读写哪些对象、执行哪些 job”。
- Observability 的角色边界天然会被人类诊断、审计查看、只读消费、材料来源和维护作业同时拉扯,因此本步需要同时处理人类角色和系统角色。
- 书写规范允许按需补权限矩阵。当前仓的人类查看、系统来源、系统消费和系统维护差异明显,因此保留权限矩阵是合理的,但操作类型必须是能力级动作。
- 报告交接与最终结论分离是本仓核心边界之一,因此角色场景必须显式区分“接收交接材料”与“生成最终 verdict / signoff”。
- `Console / SDK / reporting consumer`、`Source service / worker / job` 这类旧叫法有价值,但需要被上收为泛化角色名,避免把具体系统依赖提前写回 Step 05。

### 3.4 本模块停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 本步目标诊断 | pass | 已明确 Step 05 只收口角色与接触场景。 |
| 必读文档候选 | pass | 已固定标准、前序 Step、历史材料和粒度参考。 |
| 初步关注点 | pass | 已明确 5 类最易误写点。 |
| 正式角色表写入 | blocked | 当前尚未进入角色收敛正式写入。 |
| 正式文档写入 | blocked | 正式 `00-需求文档.md` 仍等待 Step 17。 |
| 当前下一步 | `开工确认 / 必读文档:再写入` |

## 4. 开工确认 / 必读文档:再写入

### 4.1 必读文档摘要

| 文档 | 读取结论 | 对 Step 05 的影响 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 05 | 本步只允许产出角色结论、系统角色结论、使用场景结论和必要时的权限差异结论。 | 后续必须先诊断角色候选,再写角色表;不得直接写依赖、故事、功能或接口。 |
| `需求文档书写规范.md` 4.5 | 角色说明表固定为 `角色 / 类型 / 使用场景`;权限矩阵仅按需补充,且操作类型只能是能力级动作。 | 回填草稿必须维持角色表主表达形式,矩阵只能辅助存在。 |
| Step 02 本仓定位与边界 | 本仓只拥有 observation material、audit projection 和 read-only report handoff truth,不拥有业务 truth、artifact / evidence 正文、identity 正文、runtime truth、archive 正文或最终验收结论。 | 角色场景必须体现只读消费、材料来源和维护边界,不能写成业务裁决或最终签署角色。 |
| Step 04 目标与非目标 | 已明确统一边界、body-free 关联、redaction / correlation、只读交接、retention / no-write、防止 truth 转移等目标。 | 角色定义必须能承接这些目标,尤其是只读消费、证据交接和 no-write truth 语境。 |
| Step 03 问题主线 | 当前问题集中在统一基线缺失、truth 混层、脱敏关联后置、留存与交接边界不清。 | 角色场景应覆盖诊断、审计、交接、来源和维护语境,否则无法支撑问题收束。 |
| 旧 `00-需求文档.md` §5 | 旧角色表已含 SRE、Auditor、Project owner、acceptance reviewer、consumer、source、maintenance 等线索,但夹带 `query`、`metric rollup`、`report handoff`、`retention marker`、`rebuild` 等后续对象词。 | 保留角色方向,裁掉对象词和能力词,统一改写为能力级接触语境。 |
| `L1-governance` / `L1-artifact` Step 05 | 参考项目都把角色识别、角色裁剪、分类结论和回填草稿拆开。 | 本步需要补足“先思考、再写入、再停审”的中间过程。 |

### 4.2 Step 05 输入索引

| 输入类型 | 已确认来源 | Step 05 使用方式 |
|---|---|---|
| 仓边界输入 | Step 02 | 固定角色接触的是观察面真相,不是 source truth。 |
| 目标边界输入 | Step 04 | 固定角色场景必须服务于统一观察面边界、body-free 关联、只读 handoff 和 no-write truth。 |
| 问题反查输入 | Step 03 | 检查角色集合是否足够覆盖诊断、审计、交接、来源和维护等问题语境。 |
| 历史角色线索输入 | 旧 `00` | 提取有效角色候选,识别对象词和实现词污染。 |
| 粒度参考输入 | `L1-governance`、`L1-artifact` Step 05 | 补足中间产物拆分、裁剪层和停审层。 |
| 用户重点边界输入 | 当前任务说明 | 保证 log / metric / trace / audit、redaction、correlation、evidence linkage、retention marker、report handoff 和 no-write truth 都能在角色场景中找到承接主体。 |

### 4.3 执行约束

| 约束 | 当前口径 |
|---|---|
| 角色写法 | 只写谁以什么身份接触本仓、在什么场景下接触,不写关注点列、不写故事句式。 |
| 类型写法 | 至少区分人类角色与系统角色;如有必要,再补管理 / 审计 / 维护分类。 |
| 场景写法 | 只写能力级接触语境,不写接口名、事件名、DTO、job 名、表名或字段名。 |
| 权限矩阵写法 | 如保留矩阵,操作类型只能写能力级动作,不能写 API 路径、Command 名或事件名。 |
| 依赖边界 | 仓际依赖、外部产品和相邻仓协作关系不得写成角色,它们后移 Step 06 / Step 12。 |
| 正式文档后置 | 当前仍只写 `design-calibration` 中间产物,正式 `00-需求文档.md` 留待 Step 17。 |

### 4.4 下一步输入

`角色收敛:先思考` 需要完成四件事:一是把旧角色候选分成“保留 / 泛化 / 裁剪”三类;二是确认哪些角色是人类查看或审查角色,哪些角色是系统来源、消费或维护角色;三是判断权限差异是否足够明显到需要保留矩阵;四是把所有能力名和对象名从角色描述里剥离出去。

### 4.5 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 必读文档摘要 | pass | 已写入标准、Step 02 / 03 / 04 和历史材料对 Step 05 的约束。 |
| 输入索引 | pass | 已明确本步角色来源和一致性反查用途。 |
| 执行约束 | pass | 已明确不写依赖、故事、接口、对象和实现。 |
| 角色收敛思考 | pass | 已在 §5 完成候选诊断。 |
| 正式文档写入 | blocked | 正式 `00-需求文档.md` 仍等待 Step 17。 |
| 当前下一步 | `角色收敛:先思考` |

## 5. 角色收敛:先思考

### 5.1 收敛目标

本模块只诊断“哪些角色应该正式进入 Step 05,哪些不应该”,不直接写正式角色表。对 `L4-observability` 来说,合格的角色必须同时满足三个条件。第一,它必须直接接触本仓的 observation material、audit projection 或 read-only handoff truth。第二,它的接触场景必须符合 Step 04 的 no-write、body-free 和只读交接边界。第三,它必须能被后续 Step 06、08、09、10、12 继续承接,而不是和那些章节抢内容。

### 5.2 角色候选分层

| 类别 | 判断标准 | 当前处理方式 |
|---|---|---|
| 应保留的正式角色 | 直接以人类或系统身份接触本仓观察面真相,且能用一行场景说明解释清楚。 | 保留进正式角色表。 |
| 应泛化的角色候选 | 旧材料里是具体系统、具体工具或具体 job 名,但本质上对应某类稳定角色。 | 改写为泛化角色名后保留。 |
| 当前应裁剪的候选 | 实际是相邻仓、外部产品、接口动作、故事句式、对象名或实现单元。 | 不进入角色表。 |

### 5.3 保留角色方向诊断

| 候选方向 | 来源 | 保留理由 | 下一步写入口径 |
|---|---|---|---|
| SRE / oncall | 旧 `00`;当前正式 00 历史材料 | 本仓必须服务运行异常、链路异常和观测缺口的诊断语境。 | 写成“人类运维诊断角色”,不写具体查询动作。 |
| Auditor / 合规查看者 | 旧 `00`;用户重点边界 | 审计投影、证据关联和交接材料的审查是本仓独立存在的重要原因之一。 | 写成“人类审计查看角色”,不写索引或报表对象。 |
| Project / domain owner | 旧 `00`;Step 03 问题主线 | 业务责任方需要查看观察摘要,但不能把摘要当作业务 truth。 | 写成“人类业务观察角色”,不写具体对象列表。 |
| Test / acceptance reviewer | 旧 `00`;用户重点边界 | 用户已明确 report handoff 与 final verdict 必须分开,因此需要保留消费交接材料但不做真实签署的质量角色。 | 写成“人类质量审查角色”,不写真实 evidence 或 signoff。 |
| Source material producer | 旧 `00`;Step 02 单独成仓原因 | 观察面材料必须有稳定来源角色,否则角色集合无法承接统一接入问题。 | 写成“系统来源角色”,不写具体 service / worker / job 名。 |
| Read-only observation consumer | 旧 `00`;当前正式 00 历史材料 | 观察面会被控制台、SDK、报表或内部工具只读消费,但这些具体系统不应在 Step 05 逐个展开。 | 写成“系统消费角色”,不写具体消费端列表。 |
| Report / evidence handoff consumer | 旧 `00`;用户重点边界 | 交接材料会被报告、审计、验收或归档准备消费,但必须保持“只接收线索,不生成最终结论”。 | 写成“系统交接角色”,不写具体下游仓名。 |
| Observability maintenance actor | 旧 `00`;Step 04 目标 5 | retention、重建、缺口扫描和材料维护需要稳定维护角色,但不能让其成为修复 source truth 的入口。 | 写成“系统维护角色”,不写具体后台任务或算法。 |

### 5.4 应裁剪或泛化的候选

| 候选 | 处理 | 理由 |
|---|---|---|
| `L0-bus`、`L1-governance`、`L1-artifact`、`L1-identity`、`L4-archive`、`L5-console` | 裁剪 | 它们是相邻仓或消费 / 协作边,不是角色身份。 |
| Grafana、Prometheus、OTel、object store | 裁剪 | 它们是产品或基础设施候选,不是角色。 |
| `Console / SDK / reporting consumer` | 泛化为 `Read-only observation consumer` | 旧表述带具体系统依赖味道,应上收为稳定角色类别。 |
| `Source service / worker / job` | 泛化为 `Source material producer` | 旧表述混入具体实现单元。 |
| `Observability maintenance job` | 泛化为 `Observability maintenance actor` | 避免把具体 job 形态固定在需求层。 |
| `query`、`diagnostic`、`metric rollup`、`report handoff`、`retention marker`、`rebuild` | 裁剪 | 这些是能力名或对象词,不是角色。 |
| “作为某角色,我希望...”句式 | 裁剪 | 这是 Step 08 用户故事,不是 Step 05 角色定义。 |
| `run_id`、evidence alias、final verdict、signoff | 裁剪 | 属于真实执行与验收阶段,不是角色识别内容。 |

### 5.5 权限矩阵必要性诊断

| 项 | 当前判断 |
|---|---|
| 角色差异是否明显 | 是。人类查看 / 审查角色、系统来源角色、系统消费角色和系统维护角色差异明显。 |
| 是否需要保留权限矩阵 | 需要,但必须是能力级矩阵。 |
| 矩阵中允许出现的操作类型 | 查看安全观测面、提交观测材料、查看审计与证据线索、接收报告交接材料、执行观测维护动作、修改上游业务 truth。 |
| 矩阵中禁止出现的内容 | API 路径、Command 名、事件名、DTO、表名、字段名、真实验收动作。 |
| 为什么 `修改上游业务 truth` 要保留一行 | 这是 Step 02 / Step 04 的核心边界,所有角色都必须显式为 `no`。 |

### 5.6 角色分类写法

| 分类 | 写法要求 |
|---|---|
| 人类诊断 / 观察角色 | 说明其通过观察面理解状态或定位问题,但不执行业务控制。 |
| 人类审计 / 质量角色 | 说明其消费审计投影、证据线索和交接材料,但不生成最终结论。 |
| 系统来源角色 | 说明其把材料带入本仓观察语境,但 source truth 仍留在上游。 |
| 系统消费 / 交接角色 | 说明其只读消费观察面或交接线索,不得绕过边界反写。 |
| 系统维护角色 | 说明其维护观察材料生命周期和派生面,但不创造业务 truth。 |

### 5.7 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 角色候选诊断 | pass | 已识别 8 个需要正式保留的角色方向。 |
| 裁剪 / 泛化项诊断 | pass | 已剔除相邻仓、产品、能力名、对象词和故事句式。 |
| 权限矩阵必要性 | pass | 已确认需要保留能力级权限差异矩阵。 |
| 角色表写入 | pass | 已在 §6.2 写入正式角色表。 |
| 当前下一步 | `角色收敛:再写入` |

## 6. 角色收敛:再写入

### 6.1 写入原则

正式角色表只记录角色身份、角色类型和接触场景。角色说明不回答接口问题、不回答依赖问题、不回答数据归属问题。权限矩阵只用于表达“这些角色的能力级差异是否明显”,不把后续规则、对象、接口和实现动作提前写死。因此本节只写角色、场景和能力级差异。

### 6.2 角色说明表

| 角色 | 类型 | 使用场景 |
|---|---|---|
| SRE / oncall | 人类运维诊断角色 | 在运行异常、链路异常、数据缺口或异常相关性排查语境中查看安全观测面,辅助定位问题但不直接下发控制命令。 |
| Auditor / 合规查看者 | 人类审计查看角色 | 在审计、合规复核或证据完整性检查语境中查看审计投影、证据关联和交接材料,判断材料是否可追溯。 |
| Project / domain owner | 人类业务观察角色 | 在项目、领域、能力或制品相关语境中查看观察摘要,理解业务活动的可观察状态,但不把摘要当作业务 truth。 |
| Test / acceptance reviewer | 人类质量审查角色 | 在测试或验收审查语境中查看可交接的观测材料、脱敏状态和证据线索,为后续真实验收裁决提供输入。 |
| Source material producer | 系统来源角色 | 在上游服务、运行任务或自动化作业产出观测材料时,以受控方式把材料带入本仓观察语境,但 source 仍拥有自身 truth。 |
| Read-only observation consumer | 系统消费角色 | 在控制台、SDK、报表或内部工具需要展示观察面时,以只读方式消费安全观测材料,但不绕过边界写入观测或业务 truth。 |
| Report / evidence handoff consumer | 系统交接角色 | 在报告、审计、验收或归档准备语境中接收可交接材料线索,但不生成最终 verdict、真实 evidence 或签署。 |
| Observability maintenance actor | 系统维护角色 | 在留存、重建、缺口扫描或材料维护语境中维护观察面,但不修复、覆盖或反写任何上游业务 truth。 |

### 6.3 角色分类结论

| 分类 | 包含角色 | 分类说明 |
|---|---|---|
| 人类诊断与观察角色 | SRE / oncall;Project / domain owner | 以查看、理解和定位问题为主,不通过本仓执行业务控制或写 truth。 |
| 人类审计与质量角色 | Auditor / 合规查看者;Test / acceptance reviewer | 以审计查看、质量审查和交接材料消费为主,不伪造真实证据或验收签署。 |
| 系统来源角色 | Source material producer | 代表上游来源把材料引入本仓观察语境,source truth 仍留在上游。 |
| 系统只读消费角色 | Read-only observation consumer;Report / evidence handoff consumer | 消费观察面或交接材料,不得绕过边界反写本仓或上游 truth。 |
| 系统维护角色 | Observability maintenance actor | 维护观察材料生命周期和派生观察面,不创造业务结论。 |

### 6.4 能力级权限差异结论

| 操作类型 | SRE / oncall | Auditor / 合规查看者 | Project / domain owner | Test / acceptance reviewer | Source material producer | Read-only observation consumer | Report / evidence handoff consumer | Observability maintenance actor |
|---|---|---|---|---|---|---|---|---|
| 查看安全观测面 | yes | yes | scoped | scoped | no | scoped | scoped | scoped |
| 提交观测材料 | no | no | no | no | yes | no | no | maintenance_only |
| 查看审计与证据线索 | scoped | yes | scoped | yes | no | scoped | yes | scoped |
| 接收报告交接材料 | no | scoped | scoped | yes | no | scoped | yes | scoped |
| 执行观测维护动作 | no | no | no | no | no | no | no | yes |
| 修改上游业务 truth | no | no | no | no | no | no | no | no |

### 6.5 与 Step 04 目标的反向一致性校对

| Step 04 目标主题 | Step 05 角色承接 | 反查结论 |
|---|---|---|
| 统一横切观测材料边界 | Source material producer;Read-only observation consumer | 一致,角色已覆盖来源和消费两端。 |
| 审计投影与 body-free 关联边界 | Auditor / 合规查看者;Report / evidence handoff consumer | 一致,角色消费线索但不拥有正文。 |
| redaction 与 correlation 统一口径 | SRE / oncall;Read-only observation consumer;Source material producer | 一致,角色场景承接安全输出与关联需求,但未提前写方案。 |
| 只读诊断、报告交接与真实性提示边界 | SRE / oncall;Test / acceptance reviewer;Report / evidence handoff consumer | 一致,角色区分了只读交接与最终结论。 |
| retention marker、活动引用保护和 no-write truth 防线 | Observability maintenance actor;Auditor / 合规查看者 | 一致,维护和审查语境已覆盖,且未写成 source truth 修复角色。 |
| 相邻 truth owner 协作边界 | 所有角色 | 一致,没有把相邻仓或外部产品误写成角色。 |

## 7. 当前文档问题诊断

| 输入 | 当前表现 | 诊断 | 处理口径 |
|---|---|---|---|
| 旧 `README.md` | 只列上下游与核心职责,没有单独整理谁会以什么身份接触本仓。 | 角色与依赖完全没有拆层,无法支撑后续用户故事和功能需求。 | 不沿用角色定义,只保留“来源 / 消费 / 维护”线索。 |
| 旧 `00-需求文档.md` §5 | 已有 SRE、Auditor、Project owner、acceptance reviewer、consumer、source、maintenance 等角色线索。 | 线索有效,但混入 `query`、`diagnostic`、`metric rollup`、`report handoff`、`retention marker`、`rebuild` 等后续能力或对象词。 | 保留角色方向,裁掉对象词和能力词,统一改写为能力级接触语境。 |
| 当前较短旧 Step 05 | 已有角色表、分类结论和权限矩阵。 | 粒度弱于 `L1-governance`,缺少停审点、候选分层、矩阵必要性诊断、改动前后对比和一致性反查。 | 本轮补足思考层、诊断层、对比层和门禁层。 |
| Step 02 边界结论 | 已明确相邻仓、外部产品和最终验收结论不归本仓。 | Step 05 若把仓际依赖、外部产品或 verdict / signoff 写成角色,会直接打穿仓边界。 | 角色收敛必须只保留观察面身份角色。 |
| Step 04 目标与非目标 | 已钉住只读 handoff、body-free 关联和 no-write truth。 | 角色场景若仍写成生成真实 evidence、最终 verdict 或 source truth 修复,会与已补强目标冲突。 | 角色说明必须显式保持只读、审查和维护边界。 |

## 8. 改动前后对比

| 项 | 补强前 | 补强后 | 原因 |
|---|---|---|---|
| 中间产物结构 | 主要是结论摘要和简短回填 | 增加开工确认、输入索引、候选分层、矩阵必要性、对比、取舍和停审点 | 对齐 `L1-governance` 粒度,提升恢复性和可审查性。 |
| 角色命名 | 含 `Console / SDK / reporting consumer`、`Source service / worker / job`、`maintenance job` 等实现味道较强的旧命名 | 泛化为 `Read-only observation consumer`、`Source material producer`、`Observability maintenance actor` | 避免把具体系统依赖和实现形态写进角色章。 |
| 场景表达 | 角色场景中仍夹带 `query`、`diagnostic`、`metric rollup`、`report handoff`、`retention marker` 等对象或能力词 | 统一上收为能力级接触语境,保留只读、审查、来源和维护边界 | 保护 Step 05 不滑入 Step 08 / 09 / 12。 |
| 权限矩阵 | 有矩阵,但缺少为什么需要它的诊断层 | 保留矩阵,并显式说明只允许能力级操作类型 | 让矩阵存在更可辩护。 |
| 与前序 Step 关系 | 主要依赖 Step 02 / 04,但未显式反查 | 增加与 Step 04 目标的反向一致性校对 | 保证角色集合能够承接已补强目标。 |
| 下一步门禁 | 指向 Step 06 | 更新为审查后补强优先级中的 Step 10 | 与当前返工顺序保持一致。 |

## 9. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧角色表和旧矩阵 | 快,保留历史内容多 | 角色、对象、能力和实现词混在一起,恢复性差 | 不采用 |
| 方案 B: 只保留角色表,删除权限矩阵 | 最简洁,边界最稳 | 无法表达来源 / 消费 / 维护三类系统角色与人类角色的明显差异 | 不采用 |
| 方案 C: 保留角色表并收紧为能力级权限矩阵 | 既能表达差异,又不提前进入接口和实现 | 需要额外说明矩阵为何存在且如何受限 | 采用 |
| 方案 D: 把相邻仓和外部产品一并写入系统角色 | 看起来覆盖协作全面 | 会把 Step 05 变成 Step 06 依赖表 | 不采用 |

### 9.1 关键取舍补充

| 取舍 | 结论 |
|---|---|
| 是否新增“平台管理员”或“安全管理员”一类角色 | 当前不新增。现有目标主线更需要诊断、审计、交接、来源和维护角色,而不是引入未被问题主线直接要求的新管理角色。 |
| 是否把 `Console / SDK / reporting` 拆成多个系统消费角色 | 不拆。当前差异还不足以支撑多个独立角色,更适合在 Step 06 / 12 展开具体消费方。 |
| 是否把 `Report / evidence handoff consumer` 与 `Test / acceptance reviewer` 合并 | 不合并。前者是系统交接角色,后者是人类质量审查角色,两者边界不同。 |
| 是否把 `Observability maintenance actor` 写成拥有修复权的角色 | 不写。其职责只限维护观察面和派生面,不得反写上游 truth。 |

## 10. 结构化中间产物

### 10.1 角色识别口径

本章只识别以人类或系统身份接触 `L4-observability` 观察面真相的角色。角色收敛的判断标准是:该身份是否直接接触 observation material、audit projection 或 read-only report handoff truth,以及其场景是否保持 body-free、只读交接和 no-write truth 边界。相邻仓、外部产品、接口动作、对象字段和用户故事不在本章展开。

### 10.2 角色结论

| 角色 | 类型 | 使用场景 |
|---|---|---|
| SRE / oncall | 人类运维诊断角色 | 在运行异常、链路异常、数据缺口或异常相关性排查语境中查看安全观测面。 |
| Auditor / 合规查看者 | 人类审计查看角色 | 在审计、合规复核或证据完整性检查语境中查看审计投影、证据关联和交接材料。 |
| Project / domain owner | 人类业务观察角色 | 在项目、领域、能力或制品相关语境中查看观察摘要。 |
| Test / acceptance reviewer | 人类质量审查角色 | 在测试或验收审查语境中查看可交接的观测材料、脱敏状态和证据线索。 |
| Source material producer | 系统来源角色 | 把材料以受控方式带入本仓观察语境。 |
| Read-only observation consumer | 系统消费角色 | 只读消费安全观测材料。 |
| Report / evidence handoff consumer | 系统交接角色 | 接收可交接材料线索,但不生成最终结论。 |
| Observability maintenance actor | 系统维护角色 | 维护观察材料生命周期和派生观察面,但不反写真相。 |

### 10.3 角色分类结论

| 分类 | 内容 |
|---|---|
| 人类角色 | SRE / oncall、Auditor / 合规查看者、Project / domain owner、Test / acceptance reviewer。 |
| 系统角色 | Source material producer、Read-only observation consumer、Report / evidence handoff consumer、Observability maintenance actor。 |
| 管理 / 审计 / 维护差异 | 审计与质量角色关注可追溯与交接边界;维护角色关注生命周期与派生面维护;所有角色都不得修改上游业务 truth。 |

### 10.4 权限差异结论

| 操作类型 | SRE / oncall | Auditor / 合规查看者 | Project / domain owner | Test / acceptance reviewer | Source material producer | Read-only observation consumer | Report / evidence handoff consumer | Observability maintenance actor |
|---|---|---|---|---|---|---|---|---|
| 查看安全观测面 | yes | yes | scoped | scoped | no | scoped | scoped | scoped |
| 提交观测材料 | no | no | no | no | yes | no | no | maintenance_only |
| 查看审计与证据线索 | scoped | yes | scoped | yes | no | scoped | yes | scoped |
| 接收报告交接材料 | no | scoped | scoped | yes | no | scoped | yes | scoped |
| 执行观测维护动作 | no | no | no | no | no | no | no | yes |
| 修改上游业务 truth | no | no | no | no | no | no | no | no |

## 11. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §5。

```md
## 5. 用户与角色

> 校准来源:
> - `design-calibration/00_req_step_05_users_roles.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“角色收敛:先思考”“当前文档问题诊断”和“设计取舍”小节,了解本章如何从历史角色线索收束为当前角色定义。

### 5.1 角色识别口径

本章只识别以人类或系统身份接触 `L4-observability` 观察面真相的角色。相邻仓、外部产品、接口动作、对象字段和用户故事不在本章展开;它们分别进入使用方与依赖、接口、数据、功能或用户故事章节。

### 5.2 角色说明表

| 角色 | 类型 | 使用场景 |
|---|---|---|
| SRE / oncall | 人类运维诊断角色 | 在运行异常、链路异常、数据缺口或异常相关性排查语境中查看安全观测面,辅助定位问题但不直接下发控制命令。 |
| Auditor / 合规查看者 | 人类审计查看角色 | 在审计、合规复核或证据完整性检查语境中查看审计投影、证据关联和交接材料,判断材料是否可追溯。 |
| Project / domain owner | 人类业务观察角色 | 在项目、领域、能力或制品相关语境中查看观察摘要,理解业务活动的可观察状态,但不把摘要当作业务 truth。 |
| Test / acceptance reviewer | 人类质量审查角色 | 在测试或验收审查语境中查看可交接的观测材料、脱敏状态和证据线索,为后续真实验收裁决提供输入。 |
| Source material producer | 系统来源角色 | 在上游服务、运行任务或自动化作业产出观测材料时,以受控方式把材料带入本仓观察语境,但 source 仍拥有自身 truth。 |
| Read-only observation consumer | 系统消费角色 | 在控制台、SDK、报表或内部工具需要展示观察面时,以只读方式消费安全观测材料,但不绕过边界写入观测或业务 truth。 |
| Report / evidence handoff consumer | 系统交接角色 | 在报告、审计、验收或归档准备语境中接收可交接材料线索,但不生成最终 verdict、真实 evidence 或签署。 |
| Observability maintenance actor | 系统维护角色 | 在留存、重建、缺口扫描或材料维护语境中维护观察面,但不修复、覆盖或反写任何上游业务 truth。 |

### 5.3 能力级权限差异

| 操作类型 | SRE / oncall | Auditor / 合规查看者 | Project / domain owner | Test / acceptance reviewer | Source material producer | Read-only observation consumer | Report / evidence handoff consumer | Observability maintenance actor |
|---|---|---|---|---|---|---|---|---|
| 查看安全观测面 | yes | yes | scoped | scoped | no | scoped | scoped | scoped |
| 提交观测材料 | no | no | no | no | yes | no | no | maintenance_only |
| 查看审计与证据线索 | scoped | yes | scoped | yes | no | scoped | yes | scoped |
| 接收报告交接材料 | no | scoped | scoped | yes | no | scoped | yes | scoped |
| 执行观测维护动作 | no | no | no | no | no | no | no | yes |
| 修改上游业务 truth | no | no | no | no | no | no | no | no |
```

## 12. 自检与门禁

### 12.1 自检

| 检查项 | 结果 |
|---|---|
| 是否所有主要角色都有场景说明 | pass |
| 是否区分人类角色与系统角色 | pass |
| 是否没有把仓际依赖关系写成角色 | pass |
| 是否没有把用户故事写成角色说明 | pass |
| 是否没有把接口动作写进使用场景 | pass |
| 是否在存在明显差异时补充了权限矩阵 | pass |
| 权限矩阵是否只使用能力级操作类型 | pass |
| 是否未展开接口、事件、数据归属或实现方式 | pass |
| 是否未写入正式 `00-需求文档.md` | pass |
| 是否发现阻塞进入下一补强步骤的上游 blocker | no |

### 12.2 门禁

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| pass | 已完成 Step 05 审查后补强,主要人类角色、系统角色、接触场景和能力级权限差异已收束,且未混写仓际依赖、用户故事、接口动作或实现方式 | wait_user_or_start_step_10_strengthening_after_confirmation |
