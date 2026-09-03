# L2-member-images 02 概要 Step 14: 正式概要设计装配

> 创建日期: 2026-08-24
> 状态: `completed_stop_review`
> 当前模式: `full-restart`
> 回填位置: 正式 `02-概要设计.md` 全文（固定 14 章）
> 当前限制: 旧正式 `02` 仅作本 Step 后置 historical material；不得直接继承其正文、对象、状态、数字、产品、实现或 readiness

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 1~13 已通过的校准文件、正式 `00-需求文档.md`、正式 `01-架构设计.md`、概要设计书写规范固定 14 章主链 |
| 规范 | 已读取概要设计 SOP Step 14、概要设计书写规范 §3、§4.1~§4.14、设计文档讨论中间产物规范的来源与重建门禁 |
| 用户授权 | 用户已明确“完成全部的 02”，允许连续完成 Step 4~14；正式 02 完成后立即停审，不进入 03 |
| 本步目标 | 只重组、润色、统一术语 / 编号 / 交叉引用，把已确认结论装配成可追溯的正式 02 |
| 本步禁止 | 在装配阶段新增结论、提前写 03 / 04 / 05 / 06 / 07 内容、把历史材料当 authority、伪造实现 / 测试 / digest / report / evidence / readiness |

## 1. 后置历史污染审计门禁

本节在 Step 14 开始后开放旧正式 `projects/L2-member-images/02-概要设计.md` 的读取权限。旧文件只用于识别污染，不是正式来源；所有可保留方向必须重新回指 Step 1~13 或正式 `00/01`，不得复制旧正文作为新正文。

| 审计类别 | 旧材料处理规则 | 新正式文档处置 |
|---|---|---|
| 对象 / 状态 / 生命周期 | 逐项与 Step 6 / 9 对照 | 保留仅限新校准明确的对象与局部状态；其余废弃或后移 |
| 产品 / 协议 / 路径 / schema | 检查是否无 authority 或越过概要粒度 | 不继承；只保留接口分类与 neutral seam |
| 数字 / SLA / 容量 / 保留期 | 一律视为历史污染，除非当前正式 authority 明确承接 | 不写入正式 02 |
| 实现 / 部署 / CI / 数据库 | 视为越界实现材料 | 后移 03/04/07 或废弃 |
| 测试 / evidence / digest / readiness | 视为执行事实，当前无真实证据则废弃 | 只写设计上的结果类别和证据边界 |
| 依赖 / sibling 结论 | 检查是否把进行中内容写成合同 | 只保留 owner / direction / pending / blocker |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 哪些结论回填到哪些章节？ | Step 1~3 进入第 1~3 章；Step 4 进入第 4 章；Step 5~6 进入第 5~6 章；Step 7~9 进入第 7~9 章；Step 10~12 进入第 10~12 章；Step 13 进入第 13 章；第 14 章只列实际参考材料。 |
| 2. 哪些结论需跨章节拆分？ | owner / truth、pending 上限、fail-closed 和 staged decisions 需在边界、接口、流程、状态和风险章节分别以最小必要内容出现，但不得重新定义；来源只由对应 Step 文件提供。 |
| 3. 哪些术语需统一？ | `DefinitionAssembly`、`BuildCandidate`、`Qualification`、`SupplyEntry`、`ReferenceDerived` 为五个主要组成部分；`candidate`、`eligibility`、`availability`、`Artifact handoff`、`consumer / container state` 永不合并；`pending`、`blocked`、`unknown`、`unavailable`、`gap` 按上下文使用。 |
| 4. 哪些仍保留为风险 / 待确认？ | Step 13 的 `R-HLD-MI-001~008` 与 `MI-UP-001~009`、`Q-MI-001~004` 原样保留语义；不得润色为 ready、已闭合或 positive integration。 |
| 5. 哪些留给详细设计？ | 完整 schema、序列化、错误码、repository / UoW、并发、retry / timeout、配置键、DDL、具体产品、测试全集和实施计划均留给后续正式文档。 |
| 6. 实际参考材料有哪些？ | 以本文件第 6 节审计后的材料表为准；只列实际读取并影响本概要结论的正式文档、标准、ADR、全局模型和本仓校准文件。 |

## 3. 章节回填矩阵

| 正式章节 | 主要来源 | 允许回填 | 不得回填 |
|---|---|---|---|
| 1. 与上游文档的关系声明 | Step 1、正式 00 / 01 | authority 顺序、owner / pending 分层、不再回答 / 必须回答 | 旧 02 结论、实现 readiness |
| 2. 本次设计目标与范围 | Step 2、正式 00 / 01 | 目标、非目标、current / conditional / future / excluded | 新功能愿望、产品绑定 |
| 3. 约束条件 | Step 3 | owner、static / live、pin、staged decisions、dependency、history、pending 约束 | 配置键、协议详情 |
| 4. 代码主体框架总览 | Step 4 | 五个业务主体与五层实现视图、交互图 | BC 到 service / crate / DB 的机械映射 |
| 5. 主要组成部分、职责与边界 | Step 5 | 五部分职责、非职责、代码主体、接缝与对象候选入口 | 对象字段 / 完整 API |
| 6. 关键对象轮廓 | Step 6 | 已正式对象的字段类型骨架、状态、函数 / 工厂骨架、禁止事项 | 完整 schema、外部正文 |
| 7. API / 接口骨架 | Step 7 | Command / Query / conditional Inbound Event / Outbound absence / Job | route、topic、完整 payload、产品协议 |
| 8. 关键处理流 / 重要函数数据流 | Step 8 | 主流程、判断点、port / repository / projection 方向 | 实现步骤、retry 参数、执行结果 |
| 9. 状态定义与状态流转 | Step 9 | 局部状态轴、允许 / 禁止迁移、传播边界 | 单一 ready 生命周期、数据库状态列 |
| 10. 异常与边界场景轮廓 | Step 10 | 异常表、fail-closed、lane isolation、history-preserving 恢复 | 错误码、运维 runbook |
| 11. 配置影响轮廓 | Step 11 | 影响表、禁止配置化边界、03 / 04 承接 | 配置键、默认值、secret、部署事实 |
| 12. 详细设计承接清单 | Step 12 | 已收稳主语、03 展开方向、回退规则 | 新对象、新任务、新 positive contract |
| 13. 设计风险与待确认事项 | Step 13 | 风险表、待确认表、最小推进上限 | backlog、TODO、解决方案 |
| 14. 参考 | 实际读取材料 | 材料与用途 | 未使用资料、泛化链接 |

## 4. 历史污染审计记录

> 本节在读取旧正式 `02` 后填写。审计结果只作为装配依据，不替代 Step 1~13 的正式结论。

| 历史类别 | 旧文件观察 | 判定 | 回填来源 / 处置 |
|---|---|---|---|
| 旧章节结构 | 旧文件声称使用“14 节结构”，实际只有“先用人话理解”到“模块交互”7 章，没有当前对象、API、处理流、状态、异常、配置、承接、风险和参考主链 | `废弃` | 删除旧正文；只按新版书写规范和 Step 1~13 固定 14 章重建 |
| 仓定位 | “成员镜像资产层 / persona-image 供给层”方向部分接近，但核心围绕 prompt / persona / toolset / seed 模板，而不是镜像定义、构建候选、资格、供给与派生维护闭环 | `修改后保留方向` | 只从正式 00 / 01 与 Step 1~5 重建“成员镜像资产与构建产物供给层”定位 |
| 旧对象与实体 | `MemberImage`、`ImageRoleBinding`、`ImagePersona`、`ImageToolset`、`MemorySeed`、`WorkspaceSeed`、`ImageDerivation` 被直接固定为本仓对象 | `整体废弃为 historical names` | 只使用 Step 6 重新推导的对象；Role / mapping truth 与 seed semantic body 外置，不把旧名称当 schema |
| Persona / prompt / tool / policy 正文 | 旧文将 default prompt / style / tone / starter behavior、toolset、policy overlay / provider preference 作为本仓负责内容 | `越界废弃` | 本仓只承接 persona binding、component / extras pin、seed template ref / placement；不拥有相邻正文、capability / governance truth |
| 旧主要部分 | 按定义、persona、tool / policy、memory / workspace、版本 / 实例化拆五部分 | `废弃并重建` | 改为 Step 5 的 `DefinitionAssembly`、`BuildCandidate`、`Qualification`、`SupplyEntry`、`ReferenceDerived`；避免按内容种类平铺 |
| 构建与供应链主线 | 旧文没有独立 intent / attempt / immutable input snapshot / candidate / provenance / applicable gate / eligibility / availability / Artifact handoff 分层 | `缺失补齐` | 仅从 Step 5~10 已确认结论回填，不从旧文反推 |
| 旧状态与流程 | 旧文使用 version / derive / publish / activate / retire / instantiate 三条简化主线，未区分 staged decisions，且把实例化结果靠近本仓主线 | `废弃并重建` | 采用 Step 8~9 的局部状态轴和流程；candidate、eligibility、availability、Artifact、consumer / container 分开 |
| 旧依赖方向 | 直接写 identity、capability-hub、conversation / UI / console、observability 等输入 / 输出，并把 member / runtime 合并为实例化消费者 | `越界或过时` | 只按 Step 1 / 3 / 4 / 7 的 `compile/runtime/event/ref/adapter/fake` 关系重建；UI、observability、marketplace 不进入当前主线 |
| 旧 sibling 合同 | 直接描述 member / runtime 接收 image bundle、bootstrap seeds、version switch / instantiate | `blocked historical claim` | `L2-member-service` exact manifest / variant / ref / confirmation 保持 `MI-UP-001`；`L2-member` release shape 保持 `MI-UP-002`，不继承 success contract |
| 旧 Artifact 关系 | 把 starter refs、activation 结果、版本证据笼统交给 artifact / observability | `废弃` | 通用 Artifact truth 归 `L1-artifact`；本仓只记录 image eligibility、handoff record / gap，`MI-UP-007` 未关闭不声明 formal ref |
| 旧 API / 协议 / 产品 | 未形成新版 Command / Query / Event / Job 分类，存在 instantiate / materialize hook、catalog / UI 输出等旧接口愿望 | `废弃并后移` | 只回填 Step 7 已确认接口骨架；无 route / topic / payload / product，当前无 outbound event authority |
| 旧数字 / SLA | 写入所有外部系统 `99.9%`、一致性 / 可追溯 / instantiate `100%`、P95 `< 100ms`、P0 / P1 等 | `污染废弃` | 当前无 measurement baseline 或 authority；正式 02 不写这些数字、优先级或结果 |
| 旧测试 / 验收 | 目标表直接写文档评审、集成测试、负向测试、benchmark 和“可验证”结果 | `后移且不得伪造` | 测试设计留 05、验收留 06；当前不声明测试运行、verdict、signoff 或 readiness |
| 旧实现 / 容量 | 写 starter files 长度、catalog 高频、索引复杂度、容量高 / 中高等未量化实现判断 | `废弃或后移` | 具体存储、容量、性能、配置和实现留后续文档，须有正式依据 |
| 旧文档元信息 | 旧作者、评审人、v0.1.0、2026-05-17 和“关联 ADR 待补”属于旧文状态 | `废弃` | 新文使用 `v1.0.0-restart`、当前日期、calibration-complete / review-pending，并列实际 ADR 用途 |

### 4.1 历史材料保留上限

旧文仅有三类方向可在重新核验后出现：成员镜像资产需要独立 owner、模板 / seed 与 live state 必须分离、版本派生和下游供给需要可追溯。它们已经由正式 00 / 01 与 Step 1~13 独立重新建立，因此新版引用当前来源，不引用旧正文；其他旧对象、章节、依赖、数字、状态、接口和验收表述全部不继承。

## 5. 术语与编号统一表

| 统一术语 | 使用规则 |
|---|---|
| `image family` / `image variant` / `persona binding` | 只表示本仓定义层身份，不表示 RoleDefinition 或 live persona |
| `AssemblyBaseline` / `VariantRevision` | baseline 是一次静态输入快照；revision 是可追溯派生语境；均不表示 build / availability |
| `BuildIntent` / `BuildAttempt` / `CandidateImage` | 分别表示意图、尝试、候选；外部成功不自动生成候选 |
| `ProvenanceBinding` / `GateEvaluation` / `EligibilityDecision` | 分别表示来源链、适用门禁判断、镜像资格；不拥有 governance / Artifact truth |
| `AvailabilityTransition` / `InstantiableEntry` / `ConsumerHandoffGap` | 分别表示供给变化、immutable 消费入口、下游合同缺口；不表示 container 状态 |
| `ExternalReferenceSnapshot` / `ContractGap` / `ProjectionFreshness` | 表示受控边界引用、缺口和派生新鲜度；不创建核心 positive truth |
| `pending` / `blocked` / `unknown` / `unavailable` / `gap` | 必须说明归属对象或阶段，不能互换为泛化 ready / failed |

## 6. 参考材料候选与实际使用确认

| 参考材料 | 用途 | 实际使用 |
|---|---|---|
| `projects/L2-member-images/00-需求文档.md` | 需求目标、范围、非目标、开放条件与验收边界 | `used` |
| `projects/L2-member-images/01-架构设计.md` | BC / LS、责任层、交互、依赖、机制与 ADR 边界 | `used` |
| `standards/document/设计文档编写通则.md` | 文档真相源、来源、重建、门禁与范围纪律 | `used` |
| `standards/document/设计文档讨论中间产物规范.md` | Step 产物、三层台账、来源入口与分批写入纪律 | `used` |
| `standards/document/概要设计讨论流程_SOP.md` | Step 1~14 问题、输出与装配门禁 | `used` |
| `standards/document/概要设计书写规范.md` | 固定 14 章结构、表格、图示与校准来源格式 | `used` |
| `standards/document/设计真相源闭环与可落码性标准.md` | 依赖、状态、对象、结果与可落码边界 | `used` |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 项目间依赖类型与并行窗口裁剪 | `used` |
| `architecture/adr/0005-member-image-per-role.md` | nightly、一 Role 一镜像、mapping owner、pinned 与禁 `latest` | `used` |
| `projects/L2-member-images/design-calibration/02_hld_step_01_upstream_boundary.md` ~ `02_hld_step_13_risks_open_questions.md` | 本概要逐步收敛的唯一校准来源 | `used` |
| 专项上游正式链与台账，以及并行 sibling 的 owner / pending placeholder | owner / boundary / pending 输入 | `used_as_boundary_input` |
| `projects/L1-governance/` 概要链 | 责任分层与 truth / projection 分离的模式参考 | `used_as_pattern_reference` |
| 旧 `projects/L2-member-images/02-概要设计.md` | 历史污染审计样本，不提供 authority | `used_historical_only` |

## 7. 装配与审计计划

1. 在本 Step 后置门禁内读取旧正式 `02`，记录对象、状态、产品、数字、实现、测试、依赖和 readiness 污染。
2. 不在旧文件上小修小补；按固定 14 章新建正式文件，分批写入，每批写入后做局部来源与范围检查。
3. 每章开头放置具体 calibration source 文件与延伸阅读小节；正式正文只写已确认结论。
4. 对照 Step 1~13 做唯一回填审计，确认每项结论只有一个正式落位且跨章引用不改语义。
5. 做 pending ID、禁止词 / 数字、旧残留、Markdown 表格、ASCII 图、`git diff --check` 和 scope 审计。

## 8. 装配结果与全量审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 正式文档是否为固定 14 章 | `pass` | 章节顺序为 1~14；每章均带具体 calibration source 与延伸阅读入口。 |
| Step 6 对象是否逐对象独立成节 | `pass` | 五个对象族共 33 个对象 / guard 与字段、状态（如适用）、函数骨架均逐项回填。 |
| Step 7~13 是否完整回填 | `pass` | 接口、处理流、状态、异常、配置、03 承接、风险 / 待确认均有对应章节。 |
| pending 是否保持显式 | `pass` | `MI-UP-001~009`、`Q-MI-001~004` 均保留；未推导 positive contract、digest、report、evidence 或 readiness。 |
| 历史污染是否清除 | `pass` | 旧对象、旧七章结构、无 authority 数字 / 产品 / 测试 / 发布事实未继承；旧文仅列为 historical audit。 |
| staged decision / owner boundary | `pass` | candidate、eligibility、availability、Artifact handoff、consumer / container state 分开；projection 只读。 |
| Markdown / 图示 / 空间审计 | `pass` | ASCII 图使用 fenced text block；`git diff --check` 通过，无 stray marker。 |
| scope / write audit | `pass` | 仅修改 `projects/L2-member-images/` 设计文档与校准材料；未实现代码、未修改其他项目、未提交 commit。 |

### 8.1 交付门禁

```text
step_status = completed_stop_review
formal_document_rebuild = complete
historical_audit_gate = closed
new_conclusion_allowed = false
implementation_allowed = false
commit_required = false
next_formal_document = 03-详细设计.md
next_formal_document_allowed = false_until_user_confirmation
```

正式 `02-概要设计.md` 已完成装配并停审；任何进入 `03` 的新正向合同仍须先由相关 owner 完成双方正式校准并关闭对应 pending，再按项目台账取得用户确认。
