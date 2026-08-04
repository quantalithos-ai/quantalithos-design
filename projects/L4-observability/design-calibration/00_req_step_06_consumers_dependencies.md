# Step 06 使用方与依赖

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 06 使用方与依赖 |
| 输出文件 | `design-calibration/00_req_step_06_consumers_dependencies.md` |
| 当前模式 | full-restart |
| 当前轮次 | 审查后补强 |
| 已读取项目台账 | yes |
| 已读取需求 flow | yes |
| 已读取前序 Step | yes, 已读取补强后的 `00_req_step_02_position_boundary.md` 与 `00_req_step_05_users_roles.md` |
| 已做一致性反查 | yes, 已回看旧 `README.md`、旧 `00-需求文档.md` 与补强后的 `00_req_step_10_rules_boundary_constraints.md`,仅用于检查依赖关系不回退为历史产品栈、角色说明或规则表,不把这些材料当作本步前置 truth |
| 已读取 SOP / 书写规范 | yes, 需求 SOP Step 06 与需求书写规范 4.6 |
| 已读取全局依赖裁剪规则 | yes, `standards/document/全局项目依赖关系与裁剪规则.md` |
| 已读取上游粒度参考 | yes, `L1-governance` 与 `L1-artifact` 的 Step 06 中间产物 |
| 已读取历史材料 | yes, 旧 `README.md` 与旧 `00-需求文档.md` 的依赖表达仅作为 historical material |
| 用户确认 | yes, 用户确认进入 Step 06 补强 |
| 进入条件 | pass |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 开工确认 / 必读文档:先思考 | done | Step 06 目标、输入、禁写范围和依赖识别风险诊断 | pass | 进入必读文档再写入。 |
| 开工确认 / 必读文档:再写入 | done | 必读文档摘要、输入索引和执行约束 | pass | 进入依赖收敛先思考。 |
| 依赖收敛:先思考 | done | 依赖候选分层、裁剪项、依赖类型写法和强阻塞判断诊断 | pass | 进入依赖收敛再写入。 |
| 依赖收敛:再写入 | done | 内部仓依赖表、外部依赖结论、裁剪表、类型分类表、禁止依赖表和 ASCII 图写入 | pass | 进入当前文档问题诊断。 |
| 当前文档问题诊断 | done | 历史材料、旧 Step 06 和全局依赖基线的差异诊断 | pass | 进入改动前后对比。 |
| 改动前后对比 | done | 补强前后结构、粒度和依赖类型口径差异表 | pass | 进入设计取舍。 |
| 设计取舍 | done | 编译期边界、外部产品裁剪和交接边界取舍 | pass | 进入结构化中间产物。 |
| 结构化中间产物 | done | 仓际能力关系、闭环前置、失效后果和全部固定表格结论 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 6 章候选草稿 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表 / 是否允许进入下一补强 step | pass | wait_user_or_start_step_08_strengthening_after_confirmation |

## 2. 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| Step 06 开工 | pass | 已确认当前只允许推进 `00` 的 Step 06 审查后补强。 |
| 必读文档思考 | pass | 已明确 Step 06 只写仓际能力关系、依赖类型、闭环前置和裁剪结论,不把角色、核心闭环步骤、接口、事件 schema 或数据归属写进本章。 |
| 必读文档摘要写入 | pass | 已写入 Step 02 / Step 05、SOP、书写规范、全局依赖规则和历史材料对本步的约束。 |
| 依赖收敛思考 | pass | 已完成依赖候选、裁剪项、依赖类型写法和强阻塞判断诊断。 |
| 依赖表与裁剪表写入 | pass | 已形成内部仓依赖表、外部依赖结论、依赖裁剪表、依赖类型分类表、禁止依赖表和 ASCII 图。 |
| 当前文档问题诊断 | pass | 已诊断旧 README、旧 `00` 和旧 Step 06 的失焦点。 |
| 结构化中间产物 | pass | 已整理正式回填所需的最小单元。 |
| 回填草稿 | pass | 已形成正式第 6 章候选草稿。 |
| 自检与停审 | pass | Step 06 审查后补强已完成。 |
| 正式文档写入 | blocked | 正式 `00-需求文档.md` 仍等待 Step 17 统一装配。 |
| 当前下一步 | `Step 08 用户故事（补强）:开工确认 / 必读文档:先思考` |

当前不得直接写正式 `00-需求文档.md`，也不得自动进入 Step 08。下一步只允许在用户确认后进入 `Step 08 用户故事（补强）`。

## 3. 开工确认 / 必读文档:先思考

### 3.1 本步目标诊断

Step 06 的任务是回答: `L4-observability` 在仓际协作网络里,为哪些仓提供什么能力,依赖哪些仓提供什么前置能力,以及哪些依赖会直接影响后续核心能力闭环成立。对 `L4-observability` 来说,这一步的价值不是把上下游清单抄一遍,而是把“横切观察面真相”的协作边界钉成编译期、运行期和事件协作三类关系,防止后续 Step 07~12 把运行协作误落成源码耦合,或把消费边界误读成 truth ownership。

这一章最容易犯五类错。第一类是把 Step 05 里的人类角色或系统角色重写成依赖关系。第二类是把 log / metric / trace / audit 的能力主线写成核心闭环步骤。第三类是把 `L0-bus`、`L1-governance`、`L1-artifact`、`L1-identity`、`L2-runtime` 等运行期或事件协作关系误写成编译期依赖。第四类是把 OTel、Prometheus、Grafana、TimescaleDB、对象存储或外部 APM 产品直接固化成正式需求主链依赖。第五类是把 report handoff、retention marker、evidence linkage 和 correlation/ref 关系写成业务 truth、archive truth 或 final verdict truth。

### 3.2 必读文档候选

| 文档 | 必读原因 | 预计落点 |
|---|---|---|
| `standards/document/需求文档讨论流程_SOP.md` Step 06 | 固定本步目标、输出物、应问问题和进入下一步门禁。 | 本步结构、自检和停审方式。 |
| `standards/document/需求文档书写规范.md` 4.6 | 固定内部仓依赖表、外部系统依赖表、依赖裁剪表、依赖类型分类表、禁止依赖表和 ASCII 图的写法。 | 结构化中间产物和回填草稿。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 提供 `L4-observability` 的全局依赖基线和固定裁剪格式。 | 依赖类型判断、裁剪表和禁止依赖表。 |
| `00_req_step_02_position_boundary.md` | 固定本仓只拥有 observation material、audit projection 和 read-only report handoff truth。 | 依赖边界和禁止依赖结论。 |
| `00_req_step_05_users_roles.md` | 固定角色和仓际依赖的分层,防止把角色表回写成仓依赖表。 | 候选裁剪和禁写范围。 |
| 旧 `README.md` 与旧 `00-需求文档.md` | 提取依赖线索,识别产品栈绑定、实现化词汇和历史污染。 | 当前文档问题诊断和改动前后对比。 |
| `projects/L1-governance/design-calibration/00_req_step_06_consumers_dependencies.md` | 参考已完成项目如何把依赖关系拆成主链、裁剪、禁止和 ASCII 图。 | 组织方式和粒度基线。 |
| `projects/L1-artifact/design-calibration/00_req_step_06_consumers_dependencies.md` | 参考已完成项目如何区分场景前置、消费方退化和外部系统裁剪。 | 收敛方式和停审层级。 |

### 3.3 初步关注点

- `L0-core` 是当前唯一允许进入编译期依赖的内部仓。
- `L0-bus` 是事件协作主干,它提供 tap / audit material 协作通道,但 bus 主干 truth 不归本仓。
- `L1-identity`、`L1-governance`、`L1-artifact`、`L2-runtime`、`L4-sandbox` 等 source owner 只通过运行期和事件协作边界进入本仓主链。
- `L4-archive`、`L5-console`、`L0-sdk` 是消费 / 交接边界,它们重要,但不构成本仓成立的业务 truth 前置。
- 具名产品和基础设施能力只能作为历史线索或后续架构候选,当前阶段不直接升级为正式外部系统依赖。

### 3.4 本模块停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 本步目标诊断 | pass | 已明确 Step 06 只收口仓际能力关系和依赖裁剪。 |
| 必读文档候选 | pass | 已固定标准、前序 Step、历史材料和粒度参考。 |
| 初步关注点 | pass | 已明确 5 类最易误写点。 |
| 正式依赖表写入 | blocked | 当前尚未进入依赖收敛正式写入。 |
| 正式文档写入 | blocked | 正式 `00-需求文档.md` 仍等待 Step 17。 |
| 当前下一步 | `开工确认 / 必读文档:再写入` |

## 4. 开工确认 / 必读文档:再写入

### 4.1 必读文档摘要

| 文档 | 读取结论 | 对 Step 06 的影响 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 06 | 本步必须回答本仓向谁提供能力、依赖谁的前置能力、哪些依赖阻塞核心闭环,并输出内部仓依赖、外部依赖、裁剪表、类型分类表、禁止依赖表和 ASCII 图。 | 后续必须先诊断依赖候选,再写结构化表格,不得跳过思考层直接写表。 |
| `需求文档书写规范.md` 4.6 | 本章只写能力级仓际关系,不写角色、主链步骤、业务规则、数据归属、接口签名、DTO、事件 schema 或实现组织。 | 回填草稿必须坚持能力级写法,不把 event name、API 或对象字段带进本章。 |
| `全局项目依赖关系与裁剪规则.md` | 全局基线明确 `L4-observability` 编译期依赖 `L0-core`,运行期存在产品中立的观测采集 / 审计 / 指标存储能力背景,并通过 `L0-bus` 消费 tap / audit material。 | `L0-core` 是唯一编译期依赖;`L0-bus` 固定为事件协作依赖;具名外部产品不能据此直接进入正式需求主链。 |
| Step 02 本仓定位与边界 | 本仓只拥有 observation material、audit projection 和 read-only report handoff truth,不拥有业务 truth、artifact / evidence 正文、identity truth、runtime / sandbox execution truth、archive truth 或 final verdict truth。 | 依赖关系必须始终服务于只读观察面,不能把消费边界写成 truth ownership。 |
| Step 05 用户与角色 | Step 05 已把 SRE、auditor、owner、source producer、consumer、handoff consumer、maintenance actor 等收口为角色。 | Step 06 不能把这些角色重写成依赖对象,仓际依赖只能写成 repo-to-repo 或正式外部系统关系。 |
| 旧 `README.md` 与旧 `00-需求文档.md` | 历史材料里已有 `L0-core`、`L0-bus`、identity / governance / artifact / runtime / archive / console 等线索,但同时混入 OTel、Prometheus、Grafana、TimescaleDB、对象存储和 `query / diagnostic / rollup / handoff` 等实现化词汇。 | 本轮保留仓际线索,裁掉具名产品、实现词和对象词。 |
| `L1-governance` / `L1-artifact` Step 06 | 参考项目都把 Step 06 拆成依赖候选、主链裁剪、禁止依赖、外部依赖裁剪和正式草稿。 | 本步也需要补足思考层、诊断层、对比层和门禁层。 |

### 4.2 Step 06 输入索引

| 输入类型 | 已确认来源 | Step 06 使用方式 |
|---|---|---|
| 仓边界输入 | Step 02 | 固定本仓 own 的 truth 范围和不得侵入的相邻 truth。 |
| 角色分层输入 | Step 05 | 固定角色与仓际依赖分层,避免混写。 |
| 全局依赖基线输入 | `全局项目依赖关系与裁剪规则.md` | 固定 compile / runtime / event 三类关系和裁剪格式。 |
| 历史线索输入 | 旧 `README.md`;旧 `00` | 提取仓际协作线索,识别产品绑定和实现化污染。 |
| 粒度参考输入 | `L1-governance`;`L1-artifact` Step 06 | 对齐依赖收敛层级和固定表格粒度。 |
| 用户重点边界输入 | 当前任务说明 | 保证 log / metric / trace / audit、redaction、correlation、evidence linkage、retention marker、report handoff 和不反写业务 truth 都能在依赖关系里找到正确边界。 |

### 4.3 执行约束

| 约束 | 当前口径 |
|---|---|
| 依赖对象写法 | 只写内部仓或正式外部系统,不写角色、面、抽象消费者或具体 job。 |
| 能力写法 | 只写能力级协作内容,不写 API、事件名、DTO、字段、表、topic、adapter 或实现顺序。 |
| 依赖类型写法 | 每条主链关系必须标注编译期、运行期或事件协作,不得用模糊词替代。 |
| 外部系统写法 | 当前阶段若无正式外部依赖,必须显式写明“无”;具名产品只能作为 historical material 或后续候选。 |
| truth 边界 | 依赖关系只能支持 observation material、audit projection 和 read-only handoff truth,不能反向拥有上游业务 truth。 |
| 正式文档后置 | 当前仍只写 `design-calibration` 中间产物,正式 `00-需求文档.md` 留待 Step 17。 |

### 4.4 下一步输入

`依赖收敛:先思考` 需要完成四件事:一是把依赖候选分成“必须进入主链 / 只作背景候选 / 当前应裁剪”三类;二是确认每条主链关系的预期依赖类型;三是区分基础强阻塞、材料域强阻塞和消费 / 交接关系;四是明确哪些旧产品和实现词必须被留在 historical material。

### 4.5 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 必读文档摘要 | pass | 已写入标准、Step 02 / Step 05、全局基线和历史材料对 Step 06 的约束。 |
| 输入索引 | pass | 已明确本步依赖来源和一致性反查用途。 |
| 执行约束 | pass | 已明确不写角色、主链步骤、接口、schema、对象和实现。 |
| 依赖收敛思考 | pass | 已在 §5 完成候选诊断。 |
| 正式文档写入 | blocked | 正式 `00-需求文档.md` 仍等待 Step 17。 |
| 当前下一步 | `依赖收敛:先思考` |

## 5. 依赖收敛:先思考

### 5.1 收敛目标

本模块只诊断“哪些依赖关系应该正式进入 Step 06,哪些不应该”,不直接写最终表格。对 `L4-observability` 来说,合格的依赖关系必须同时满足四个条件。第一,它要能解释 observation material、audit projection 或 read-only handoff truth 为何能够成立。第二,它要能回贴到全局依赖基线的 compile / runtime / event 之一。第三,它不能打穿 Step 02 的 no-write 和 truth ownership 边界。第四,它不能抢 Step 07 核心能力闭环、Step 09 功能需求、Step 11 数据归属或 Step 12 接口边界的内容。

### 5.2 依赖候选分层

| 类别 | 判断标准 | 当前处理方式 |
|---|---|---|
| 必须进入主链的内部仓关系 | 直接决定本仓观察面真相能否进入、被解释、被消费或被交接。 | 保留进内部仓依赖表和裁剪表。 |
| 只作为背景候选的外部能力 | 历史材料中出现,但当前阶段尚未成为正式能力成立前置。 | 仅在外部系统依赖结论中显式说明“不进入主链”。 |
| 当前应裁剪的候选 | 实际是角色、功能、对象、事件名、产品名、实现单元或真实执行材料。 | 不进入 Step 06 结构化表格。 |

### 5.3 必须进入主链的内部仓关系诊断

| 候选关系 | 保留理由 | 预期依赖类型 | 是否可能成为闭环前置 |
|---|---|---|---|
| `L0-core` | 没有共享 ref、trace / correlation 语境、metadata 和安全标记,观察材料无法稳定表达来源与边界。 | 编译期 | 是,基础强前置 |
| `L0-bus` | 横切 tap / audit material 的主要协作入口经由 bus 进入,但 bus truth 不归本仓。 | 事件协作 | 是,基础强前置 |
| `L1-identity` | actor / subject safe ref 和身份相关审计语境需要进入观察面,但 identity truth 不归本仓。 | 运行期 / 事件协作 | 是,限身份相关材料域 |
| `L1-governance` | 治理审计线索、policy / gate 观察语境和治理侧只读消费需要进入主链。 | 运行期 / 事件协作 | 是,限治理相关材料域 |
| `L1-artifact` | artifact / evidence safe ref、完整性线索和 body-free evidence linkage 需要进入主链。 | 运行期 / 事件协作 | 是,限 artifact / evidence 相关材料域 |
| `L2-runtime` | 运行 log / metric / trace 的观察材料来源语境和 runtime 侧只读消费需要被承接。 | 运行期 / 事件协作 | 是,限运行观察材料域 |
| `L4-sandbox` | sandbox 隔离和执行环境相关观察材料属于独立材料域,且容易与 runtime truth 混淆。 | 运行期 / 事件协作 | 按 sandbox 场景前置 |
| `L4-archive` | retention marker、archive eligibility 和长期只读交接需要正式消费边界。 | 运行期 | 否,消费 / 交接关系 |
| `L5-console` / `L0-sdk` | 上层需要正式的只读观察面消费入口,否则展示与外部访问会绕过边界。 | 运行期 | 否,消费关系 |

### 5.4 当前应裁剪或后移的候选

| 候选 | 处理 | 理由 |
|---|---|---|
| OTel、Prometheus、Grafana、TimescaleDB、对象存储 | 裁剪到 historical material / 后续候选 | 它们是具名产品或基础设施候选,不是当前正式需求主链依赖。 |
| dashboard、alert sink、report tool、外部 APM 平台 | 裁剪 | 它们是展示或产品层消费,不是本仓成立前置。 |
| `Console / SDK / reporting consumer` 这类旧写法中的具体产品端 | 泛化为 `L5-console` / `L0-sdk` 的正式消费边界 | Step 06 只写 repo 级关系,不罗列具体产品端。 |
| `query`、`diagnostic`、`metric rollup`、`report handoff`、`retention marker`、`rebuild` | 裁剪为能力或对象词 | 它们属于后续能力、规则或数据表达,不是依赖对象。 |
| final verdict、signoff、真实 `run_id`、真实 evidence alias | 裁剪 | 它们属于真实执行与验收边界,不构成依赖关系。 |
| `SRE`、`auditor`、`source producer`、`handoff consumer` | 裁剪 | 它们是 Step 05 角色,不是 Step 06 仓际依赖对象。 |

### 5.5 依赖类型写法

| 依赖类型 | 当前写法要求 |
|---|---|
| 编译期依赖 | 只用于共享 contract、ref、trace / correlation 语境和基础类型约束,当前仅允许 `L0-core`。 |
| 运行期依赖 | 用于 safe ref、摘要、观察材料、只读消费和交接边界协作,不得暗示 package dependency。 |
| 事件协作依赖 | 用于通过 `L0-bus` 协作 tap / audit material 或相关观察信号,不写事件名和 payload。 |

### 5.6 强阻塞与非强阻塞判断

| 关系类型 | 当前判断 | 说明 |
|---|---|---|
| 基础强阻塞 | `L0-core`;`L0-bus` | 没有共享 contract 和事件协作主干,本仓横切观察面无法稳定成立。 |
| 材料域强阻塞 | `L1-identity`;`L1-governance`;`L1-artifact`;`L2-runtime`;`L4-sandbox` | 它们按材料域决定相应 observation / audit / evidence linkage 是否有合法来源,但不构成统一编译期耦合。 |
| 消费 / 交接关系 | `L4-archive`;`L5-console`;`L0-sdk` | 它们不可用会影响消费、交接和展示,但不会把 observation truth 转移回 source owner。 |
| 非正式外部候选 | 产品中立的采集 / 存储 / 展示 / 导出能力 | 当前只作为后续架构和配置候选背景,不阻塞需求主链收敛。 |

### 5.7 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 依赖候选诊断 | pass | 已识别 9 组需要正式保留的内部仓关系。 |
| 裁剪 / 后移项诊断 | pass | 已剔除具名产品、角色、能力词、对象词和真实执行材料。 |
| 依赖类型写法 | pass | 已明确 compile / runtime / event 三类写法。 |
| 依赖表写入 | pass | 已在 §10 写入正式结构化结论。 |
| 当前下一步 | `依赖收敛:再写入` |

## 6. 依赖收敛:再写入

### 6.1 写入原则

正式依赖表达只记录 repo-to-repo 或 repo-to-formal-external-system 的能力级关系。它不记录角色、流程步骤、接口签名、事件 schema、字段或实现组件。对 `L4-observability` 来说,依赖表的首要价值不是说明“系统之间怎么调”,而是阻止 observation material、audit projection、evidence linkage、retention marker 和 report handoff 被误写成相邻 truth owner 的源码耦合或最终裁决边界。

## 7. 当前文档问题诊断

| 输入 | 当前表现 | 诊断 | 处理口径 |
|---|---|---|---|
| 旧 `README.md` | 直接把 OTel Collector、Prometheus、Grafana、TimescaleDB、对象存储写成核心依赖。 | 把产品栈和基础设施候选抬成需求主链,会误导后续架构与实现。 | 只保留“采集 / 存储 / 展示 / 导出能力”背景,不保留具名产品。 |
| 旧 `00-需求文档.md` §6 / §12 | 已有 `L0-core`、`L0-bus`、governance / artifact / identity / runtime / archive / console 等方向线索。 | 线索有效,但夹带 `query`、`diagnostic`、`metric rollup`、`report handoff`、`retention marker` 等能力或对象词。 | 保留仓际方向,裁掉能力词和对象词。 |
| 当前较短旧 Step 06 | 已有依赖表、裁剪表和 ASCII 图雏形。 | 粒度弱于 `L1-governance`,缺少停审点、依赖候选分层、强阻塞判断、改动前后对比和门禁层。 | 本轮补足思考层、诊断层、对比层和自检层。 |
| 全局依赖基线 | 明确 `L4-observability` 仅编译期依赖 `L0-core`,并通过 `L0-bus` 消费 tap / audit material。 | 若不重裁,很容易让运行期或事件协作关系越界成 package dependency。 | 本轮显式固定 compile / runtime / event 三类关系。 |
| Step 02 / Step 05 收束结论 | 已明确本仓只拥有观察面真相,且角色与依赖必须分层。 | Step 06 若回写角色、final verdict 或 archive truth,会直接打穿已补强边界。 | 依赖关系只承接仓际能力边界,不承接角色和真实验收结论。 |

## 8. 改动前后对比

| 项 | 补强前 | 补强后 | 原因 |
|---|---|---|---|
| 结构层次 | 以结论表为主,缺少读标准、先思考、再写入和停审层。 | 增加 0~12 完整结构,补足思考层、诊断层、对比层和门禁层。 | 对齐 `L1-governance` 与 `L1-artifact` 的中间产物粒度。 |
| 编译期边界 | 虽然提到 `L0-core`,但旧表达仍容易让 source owner 被误读为源码依赖。 | 显式固定只有 `L0-core` 可进入编译期依赖。 | 防止后续架构和实现把运行协作落成 path dependency。 |
| 外部依赖口径 | OTel / Prometheus / Grafana / TimescaleDB / 对象存储更接近正式依赖。 | 统一降级为 historical material 或后续架构候选。 | 保护需求阶段的产品中立性。 |
| 消费 / 交接边界 | archive、console、SDK 与 report handoff 的关系表达偏实现化。 | 明确它们是消费 / 交接边界,不拥有 observation truth、archive truth 或 final verdict truth。 | 保护 handoff 与 truth ownership 边界。 |
| 当前恢复点同步 | 旧 Step 06 与 flow / ledger 的恢复点未同步到补强完成状态。 | 本轮同步 Step 06、flow 和项目台账。 | 便于后续按用户确认继续推进 Step 08。 |

## 9. 设计取舍

| 取舍 | 结论 | 原因 |
|---|---|---|
| 是否沿用旧依赖表中的具名产品栈 | 不沿用 | 具名产品属于后续架构 / 配置 / 测试候选,不是当前需求主链。 |
| 是否把 `L0-bus` 写成编译期或内部实现依赖 | 不采用 | `L0-bus` 只作为事件协作主干出现,其主干 truth 不归本仓。 |
| 是否把 source owner 统一写成编译期强依赖 | 不采用 | 这会打穿 L1 / L2 / L4 sibling truth 边界,并形成循环耦合风险。 |
| 是否把 `L4-archive`、`L5-console`、`L0-sdk` 写成核心闭环强前置 | 不采用 | 它们是消费 / 交接边界,失效会造成展示和交接退化,但不改变本仓 truth 成立。 |
| 是否把 report handoff 视为 final verdict 或 signoff 依赖 | 不采用 | report handoff 只是只读交接材料边界,不能被提升为真实验收结论。 |
| 是否保留具名外部系统依赖表 | 不保留为正式主链 | 当前阶段无正式外部系统依赖,只显式说明“无”并记录历史候选。 |

## 10. 结构化中间产物

### 10.1 写入原则

本节只写正式回填所需的最小依赖单元:内部仓依赖、外部系统依赖结论、仓际能力关系结论、闭环前置结论、失效后果结论、依赖裁剪表、依赖类型分类表、禁止依赖表和依赖裁剪图。所有表项都维持能力级描述,不写接口、事件名、字段或内部组件。

### 10.2 内部仓依赖表

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | `L0-core` | 共享 ID、safe ref、trace / correlation 语境、metadata、error 和安全标记等基础 contract | 是 | 观察材料无法稳定表达来源、关联、安全状态或错误口径。 |
| 输入 | `L0-bus` | tap / audit material 的事件协作通道和横切观察材料入口 | 是 | 事件协作来源中断,本仓难以获得主要横切观察材料入口。 |
| 输入 / 输出 | `L1-identity` | actor / subject safe ref、身份相关审计语境和 identity 侧对只读观察面的正式消费 | 是,限身份相关材料域 | 身份相关观察材料会降级为缺来源或不可解释,但 identity truth 不会转移到本仓。 |
| 输入 / 输出 | `L1-governance` | 治理相关审计语境、policy / gate 观察线索和 governance 侧对报告交接材料的正式消费 | 是,限治理相关材料域 | 治理审计投影和交接线索降级,但 governance decision truth 不会由本仓补造。 |
| 输入 / 输出 | `L1-artifact` | artifact / evidence safe ref、完整性线索、body-free evidence linkage 和 artifact 侧对只读观察面的正式消费 | 是,限 artifact / evidence 相关材料域 | 证据关联和制品观察语境降级,但 artifact body / evidence body 不会进入本仓。 |
| 输入 / 输出 | `L2-runtime` | runtime log / metric / trace 的观察材料来源语境和 runtime 侧对只读观察面的正式消费 | 是,限运行观察材料域 | 运行观察材料出现明显缺口,但 execution truth 不会由本仓裁决。 |
| 输入 / 输出 | `L4-sandbox` | sandbox 隔离、环境和执行相关观察材料来源语境及 sandbox 侧只读消费边界 | 按 sandbox 观察场景前置 | sandbox 相关观察缺口扩大,但不影响非 sandbox 材料域成立。 |
| 输出 | `L4-archive` | retention marker、archive eligibility 线索和长期只读交接材料边界 | 否 | 长期留存和归档交接退化,但 archive truth 不会迁入本仓。 |
| 输出 | `L5-console` / `L0-sdk` | 上层正式的只读观察面消费入口、审计投影查看入口和交接材料消费入口 | 否 | 展示和访问退化,但不能反写 observation truth 或上游业务 truth。 |

### 10.3 外部系统依赖表

当前阶段无需要纳入需求主链的正式外部系统依赖。OTel、Prometheus、Grafana、TimescaleDB、对象存储、外部 APM 平台和其他观测基础设施只作为后续架构、配置、测试或实施阶段的候选输入,当前不进入正式依赖主链。

### 10.4 仓际能力关系结论

| 关系类型 | 结论 |
|---|---|
| 输入来源 | `L0-core` 提供共享 contract;`L0-bus` 提供 tap / audit material 协作入口;identity / governance / artifact / runtime / sandbox 提供各自材料域的合法来源语境。 |
| 输出消费 | identity、governance、artifact、runtime / sandbox、archive、console / SDK 会消费只读观察面、审计投影或报告交接材料。 |
| 强阻塞 | `L0-core`、`L0-bus` 和相应材料域的 source owner 对对应观察材料成立构成强前置。 |
| 非强阻塞 | archive、console、SDK 和具名外部产品不可用时只会让消费、展示或交接退化,不得反向改变 observation truth。 |

### 10.5 闭环前置依赖结论

| 层级 | 前置依赖 | 说明 |
|---|---|---|
| 基础闭环前置 | `L0-core`;`L0-bus` | 没有共享 contract 和事件协作主干,本仓横切观察面无法稳定成立。 |
| 材料域前置 | `L1-identity`;`L1-governance`;`L1-artifact`;`L2-runtime`;`L4-sandbox` | 对应材料域若没有合法来源,本仓只能表达缺口或降级,不得补造 source truth。 |
| 消费 / 交接前置 | `L4-archive`;`L5-console`;`L0-sdk` | 它们支撑只读交接、展示和访问,但不构成 observation truth 成立的基础前置。 |

### 10.6 依赖失效后果结论

| 依赖 | 失效后果 |
|---|---|
| `L0-core` | 共享 ref、trace / correlation 和安全标记语境失稳,本仓观察材料难以保持统一表达。 |
| `L0-bus` | 主要事件协作入口中断,横切 tap / audit material 难以持续进入本仓。 |
| `L1-identity` | 身份相关观察材料会出现缺来源或不可解释状态,但 identity truth 不会由本仓接管。 |
| `L1-governance` | 治理观察和审计投影降级,但本仓不能替代 governance decision。 |
| `L1-artifact` | body-free evidence linkage 和 artifact 观察语境出现缺口,但本仓不能保存正文或补造 artifact truth。 |
| `L2-runtime` | log / metric / trace 相关观察缺口放大,但 execution truth 不会由本仓裁决。 |
| `L4-sandbox` | sandbox 相关观察面和交接线索降级,但不影响其他材料域的基础边界。 |
| `L4-archive` | 长期交接和归档留存退化,但 retention marker 不会自动转成 archive ownership。 |
| `L5-console` / `L0-sdk` | 消费、展示和访问退化,但本仓 observation truth 不会被消费方替代。 |

### 10.7 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | `L4-observability` 编译期依赖 `L0-core` | 依赖方 | 编译期 | 是 | 共享 ref、trace / correlation、metadata 和安全标记是观察材料表达基础。 |
| `L0-bus` | `L4-observability` 通过 `L0-bus` 消费 tap / audit material | 协作方 | 事件协作 | 是 | 事件协作是横切观察材料主入口,但 bus truth 不归本仓。 |
| `L1-identity` | identity 提供身份 truth 和成员相关事件语境 | 来源方 / 消费方 / 协作方 | 运行期 / 事件协作 | 是 | actor / subject safe ref 和身份审计语境需要进入观察面,但 identity truth 不归本仓。 |
| `L1-governance` | governance 提供治理 truth 和相关事件语境 | 来源方 / 消费方 / 协作方 | 运行期 / 事件协作 | 是 | 治理审计投影和报告交接需要治理线索,但 governance decision 不归本仓。 |
| `L1-artifact` | artifact 提供 artifact truth、evidence body 边界和相关事件语境 | 来源方 / 消费方 / 协作方 | 运行期 / 事件协作 | 是 | body-free evidence linkage 和 artifact 观察需要正式承接,但正文不归本仓。 |
| `L2-runtime` | runtime 提供运行 truth 和运行事件语境 | 来源方 / 消费方 / 协作方 | 运行期 / 事件协作 | 是 | log / metric / trace 观察材料需要来源语境,但 execution truth 不归本仓。 |
| `L4-sandbox` | sandbox 提供环境隔离和执行环境语境 | 来源方 / 消费方 / 协作方 | 运行期 / 事件协作 | 是 | sandbox 观察材料需要被承接,但 sandbox truth 不归本仓。 |
| `L4-archive` | archive 消费留存 / 归档相关正式边界 | 消费方 / 交接方 | 运行期 | 是 | retention marker 和长期只读交接需要正式消费边界,但 archive truth 不归本仓。 |
| `L5-console` | console 经正式边界消费 L4 管理和观察能力 | 消费方 | 运行期 | 是 | console 是正式只读消费入口之一,但 UI truth 不归本仓。 |
| `L0-sdk` | SDK 封装上层访问观察面和交接材料的正式边界 | 消费方 / 访问边界 | 运行期 | 是 | SDK 是正式访问入口之一,但不能绕过边界写入 truth。 |
| OTel / Prometheus / Grafana / TimescaleDB / 对象存储 | 旧 README 的具名产品栈候选 | 外部候选能力 | 运行期候选 | 否 | 当前阶段不把具名产品固化为正式外部系统依赖。 |

### 10.8 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 使用共享 ref、trace / correlation、metadata、error 和安全标记 contract。 | `01` / `03` / `07` |
| 事件协作依赖 | `L0-bus`;`L1-identity`;`L1-governance`;`L1-artifact`;`L2-runtime`;`L4-sandbox` | 通过事件协作消费或承接观察材料来源语境,不定义业务事件 schema。 | `01` / `03` / `05` |
| 运行期依赖 | `L1-identity`;`L1-governance`;`L1-artifact`;`L2-runtime`;`L4-sandbox`;`L4-archive`;`L5-console`;`L0-sdk` | 读取 safe ref、摘要、观察材料和只读交接材料,或向正式消费方提供只读观察面。 | `01` / `03` / `04` / `07` |

### 10.9 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L4-observability -> L1 / L2 / L4 source repo` 编译期依赖 | 会让 sibling truth、execution truth 或 archive truth 侵入本仓,并形成循环耦合风险。 | 只保留 `L0-core` 编译期依赖,其他关系通过运行期和事件协作边界承接。 |
| `L4-observability` 拥有 `L0-bus` 投递、ack、retry、dead-letter 或 replay 主干规则 | 会把 bus 主干 truth 与观察面真相混成一个仓。 | 只通过正式 bus 边界消费 tap / audit material。 |
| `L4-observability` 保存 artifact body、evidence body、identity body、runtime control body 或其他 raw sensitive body | 违反 body-free、redaction 和 truth ownership 边界。 | 只保存 safe ref、摘要、digest、缺口标记、相关性语境和只读交接材料。 |
| `query`、`diagnostic`、`report handoff`、`retention`、`rebuild` 反写 source truth | 会把观察面误变成控制面或修复面。 | 这些能力只产生只读观察、交接、缺口或维护材料,由 source owner 自行处理业务 truth。 |
| 把 report handoff 视为 final verdict、signoff 或真实验收结论 | 会把只读交接边界升级为真实裁决边界。 | report handoff 只表达材料线索、可见性、脱敏状态和缺口说明。 |
| 把 retention marker 视为 archive package ownership 或 recovery truth | 会把留存线索误写成归档正文所有权。 | retention marker 只表达观察面留存约束,archive truth 归 `L4-archive`。 |
| 把 console、dashboard、外部 APM 或具名产品配置写成需求 truth 前置 | 会让消费层和产品栈反向定义本仓需求。 | 用产品中立能力表达需求,具名产品后移架构 / 配置 / 测试文档。 |

### 10.10 依赖裁剪图

#### 依赖裁剪图: L4-observability

```text
+-----------+  [compile]  +----------------------+
| L0-core   +-----------> |   L4-observability   |
+-----------+             | observation truth    |
                          +----------+-----------+
                                     ^
                                     | [event]
                                  +--+----+
                                  |L0-bus |
                                  +--+----+

L1-identity / L1-governance / L1-artifact
L2-runtime / L4-sandbox
        | [runtime/event: safe refs, source materials, audit context]
        v
  L4-observability
        |
        | [runtime: read-only observation, audit projection, handoff materials]
        v
L4-archive / L5-console / L0-sdk
```

图示说明:

- 本图只展示 `L4-observability` 相关裁剪子图,不复制全量仓依赖矩阵。
- `[compile]` 只允许 `L0-core`;其他关系不得被写成 package dependency。
- `[event]` 表示通过 `L0-bus` 协作观察材料,不表示本仓拥有 bus truth、事件 schema 或 replay 主干。
- `[runtime/event]` 和 `[runtime]` 只表达能力级来源、消费和交接关系,不表达调用顺序、接口名或数据流步骤。

### 10.11 本章结论

`L4-observability` 当前阶段的依赖主线是:以 `L0-core` 作为唯一编译期共享 contract 基线,以 `L0-bus` 作为横切观察材料的事件协作主干,并按材料域通过 identity、governance、artifact、runtime 和 sandbox 的运行期 / 事件协作边界承接来源语境。archive、console 和 SDK 是正式消费 / 交接边界,但不构成本仓 truth 成立的基础前置。当前阶段无正式外部系统依赖进入主链;具名观测产品和基础设施都后移到后续设计文档重新裁剪。

## 11. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到第 6 章。若正式文档篇幅需要压缩,可摘录本文件 §10 的固定表格和本段短结论,不重复扩写全部分析。

```md
## 6. 使用方与依赖

> 校准来源:
> - `design-calibration/00_req_step_06_consumers_dependencies.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“内部仓依赖表”“本仓依赖裁剪表”“本仓依赖类型分类表”“本仓禁止依赖表”和“依赖裁剪图”小节,了解本章如何从全局依赖基线裁剪出 `L4-observability` 的依赖子图。

当前阶段,`L4-observability` 的唯一编译期依赖是 `L0-core`;`L0-bus` 是横切观察材料的事件协作主干。identity、governance、artifact、runtime 和 sandbox 通过运行期 / 事件协作边界向本仓提供各自材料域的合法来源语境;archive、console 和 SDK 作为正式消费 / 交接边界消费只读观察面、审计投影和报告交接材料。当前阶段无需要纳入需求主链的正式外部系统依赖;OTel、Prometheus、Grafana、TimescaleDB、对象存储等只作为后续架构或配置候选,不在本章定稿。
```

## 12. 自检与门禁

| 检查项 | 结果 |
|---|---|
| 是否明确本仓向谁提供能力、依赖谁的前置能力 | pass |
| 是否区分内部仓依赖与外部系统依赖 | pass |
| 是否指出哪些依赖阻塞核心能力闭环 | pass |
| 是否说明依赖失效时的需求层后果 | pass |
| 是否使用全局依赖裁剪规则固定表 | pass |
| 是否包含依赖裁剪 ASCII 图并标注依赖类型 | pass |
| 是否没有把角色说明、主链步骤、接口细节、事件 schema 或数据归属混写进本章 | pass |
| 是否未将运行期 / 事件协作误写成编译期依赖 | pass |
| 是否未把具名产品固化为正式外部系统依赖 | pass |
| 是否未把 report handoff、retention marker 或 evidence linkage 写成 truth ownership | pass |
| 是否未写入正式 `00-需求文档.md` | pass |
| 是否发现阻塞进入 Step 08 的上游 blocker | no |

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| pass | 已完成 Step 06 审查后补强,依赖候选分层、内部仓依赖表、外部依赖结论、依赖裁剪表、依赖类型分类表、禁止依赖表和 ASCII 图已收束,且未混写角色、主链步骤、接口细节或实现方案 | wait_user_or_start_step_08_strengthening_after_confirmation |
