# Step 1. 确认验收输入边界 · L2-member-service

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 1
> 回填章节：`06-验收标准.md` §1 与上游文档的关系声明
> 模式：full-restart；本文件先独立收敛输入边界，再对已删除旧 06 做后置差异审计。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 1 确认验收输入边界 |
| 当前状态 | `[x] 已确认` |
| 输入基线 | 正式 `00~05`、`03_ddd_step_16_test_cut.md`、06 SOP / 书写规范、设计中间产物规范、`L1-governance` 06 参考 |
| 输出文件 | `design-calibration/06_acceptance_step_01_input_boundary.md` |
| 当前模块 | `input_mapping`、`historical_material_audit` |
| 思考记录 | `done` |
| 写入记录 | `done` |
| 自检状态 | `done` |
| gate_status | `pass` |
| gate_reason | 验收输入、验收不回答的问题、必须回答的问题和上游 blocker 已逐项定位；未写入真实验收结果 |
| next_allowed_action | 进入 Step 2，定义验收目标与范围 |

### 1.1 Step 内计划

- [x] 读取输入和前序结论：已完成。
- [x] SOP 问题回答：已逐项回答。
- [x] 当前材料 / 旧文档诊断：已完成历史污染审计。
- [x] 设计取舍：已确定正式输入优先级与证据边界。
- [x] 结构化中间产物：已生成输入映射、问题边界和 blocker 表。
- [x] 复杂度判断：无需拆分；历史审计与正式输入放在同一 Step 的独立小节。
- [x] 回填草稿：已形成 §1 草稿。
- [x] 自检与进入下一步条件：通过。

## 2. 本步目标

本 Step 只确定 `06-验收标准.md` 可以消费哪些正式输入，以及验收标准必须 / 不应回答什么。验收标准是裁决文档，不重新发明需求、设计、测试用例或实施任务。

本 Step 的输出必须让后续 Step 能回答：

- 哪些 `AC-MS-*`、`VF-MS-*`、FR / BR / NFR、设计契约和 `TC-*` 是正式依据。
- 哪些 `EV-MS-*` 与固定 `reports/runs/<run_id>` 路径只是未来证据入口，当前没有执行结果。
- 哪些 sibling 合同仍是 pending / blocked / waiting，不能被验收文档写成 ready。
- 旧 06 的哪些内容被废弃，避免旧宿主 / API / staging 口径回流。

## 3. 本步输入

| 输入 | 来源 | 状态 | 本 Step 用途 |
|---|---|---|---|
| 需求目标、非目标、C-MS-1~5、FR-MS、BR-MS、D-MS、NFR-MS、AC-MS、VF-MS | `00-需求文档.md` §2、§4、§9~§16 | 已确认 | 验收对象、红线和结果类别的唯一需求来源 |
| Host Truth Center、四语义层、依赖裁剪和 owner 边界 | `01-架构设计.md` §2~§12 | 已确认 | 架构 / 数据边界验收输入 |
| CMP-MS-01~07、29 个对象、入口和处理流骨架 | `02-概要设计.md` §4~§14 | 已确认 | 验收主题和范围分组输入 |
| 7 模块、协议、状态、UoW、错误、幂等、配置、观测契约 | `03-详细设计.md` §5~§15 | 已确认 | P0 验收项的设计契约来源 |
| P0 profile、strict JSON、builder、fail-fast、redaction 和 dependency seam | `04-配置设计.md` §1~§14 | 已确认 | 配置、环境和安全验收输入 |
| TC / EV 族、suite、artifact/report 结构、缺陷和回归 | `05-测试方案.md` §3~§14 | 已确认 | 验收证据和缺陷裁决输入 |
| 详细设计最小测试切口 | `03_ddd_step_16_test_cut.md` | 已确认 | 防止验收项遗漏对象、状态或负向切口 |
| 旧验收主线 | 历史 `projects/L2-member-service/06-验收标准.md`（已删除前读取） | historical_material | 仅识别污染，不继承旧结论 |
| 项目说明 / 旧入口描述 | `README.md` | historical_material | 仅识别产品、接口、环境和职责漂移 |
| 粒度 / 格式参考 | `projects/L1-governance/06-验收标准.md` 及其 Step 文件 | 只读参考 | 采用 15 章、来源入口、闭环矩阵和三值裁决格式，不消费 Governance truth |

## 4. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 本轮验收依据哪些需求和设计？ | 依据正式 `00~05`；需求编号以 `00` 为准，设计字段 / 状态 / 协议以 `03` 为准，配置以 `04` 为准，测试用例 / 证据结构以 `05` 为准。 | `00` §14~§16；`03` §5~§15；`04` §7~§12；`05` §5~§13 |
| 哪些测试证据支撑验收裁决？ | 未来由 `EV-MS-*` 实例支撑，必须能回指 `TC-*`、suite raw artifact、report 和 digest；当前仅定义证据族与固定路径，不填写状态。 | `05` §13.1~§13.8 |
| 哪些交付版本、环境和数据会成为基线？ | 由 Step 3 固定送验设计 source、implementation source、config profile / digest、fixture / replay root、固定 `run_id` 和 artifact/report pair；当前均为待送验字段。 | 06 SOP Step 3；`04` §6；`05` §13 |
| 哪些内容属于测试方案或实施计划，不应写入验收标准？ | 测试步骤、fixture 生成、自动化脚本、执行命令和回归安排属于 `05`；commit boundary、任务排期、实现状态属于 `07`；部署命令属于后续运维材料。 | 06 书写规范 §2.3~§2.4；`05` §14 |
| 是否存在阻塞验收标准生成的上游缺口？ | 存在。`MSVC-UP-001~008`、cursor exact type、Core/Bus exact schema / receipt、Member / Images / Runtime / Sandbox mapper、真实 store / provider / observability backend 和性能 authority 未闭合。可定义负向 / blocked 口径，但不可声称正向 ready。 | `project_execution_ledger.md` 全局 blocker 表；`05` §5.6、§14.4 |

## 5. 当前文档问题诊断

| 材料位置 | 诊断 | 处理 |
|---|---|---|
| 已删除旧 `06-验收标准.md` §1~§3 | 以 `MemberExecutionHost / session / worker / health` 的旧叙事为主，但未承接新版 `Host Truth / control plane / runtime session / execution handoff` 四层分离 | 废弃旧主线，改由 `00~05` 正式契约和 Step 2~14 重新生成 |
| 已删除旧 `06` §4 功能表 | 使用 `AllocateExecutionHost`、`BindExecutionContext`、`ExecuteRuntimeAction` 等未作为新版 public protocol 的名称，且把外部执行结果与本仓事实混合 | 不继承旧接口名；只使用 `03` 的 10 Command、6 Query、5 Consumer、1 material helper、7 Job |
| 已删除旧 `06` §5~§7 | 使用 API / DB / host trace 的泛化证据，没有 `TC-*`、`EV-MS-*`、固定 run/report 路径、redaction 和 no-static-evidence 规则 | 证据入口重建为 `05` §13 的结构，结果留待真实运行 |
| 已删除旧 `06` §8~§10 | 缺少 VETO、S/A/B/R、一票否决与风险接受的独立章节，也包含模糊的“视情况 / 可带着走”口径 | 按 06 SOP Step 11~14 重新定义三值结论和风险边界 |
| `README.md` / 历史材料 | 可能保留旧 REST / RPC、容器或 staging 假设，不能证明当前 owner 或 readiness | 仅作为污染输入；若与正式 `00~05` 冲突，以正式文档为准 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 输入权威 | 旧 06 自己描述宿主能力 | `00` 需求、`01` 架构、`02` 概要、`03` 详细、`04` 配置、`05` 测试逐层承接 | 保持 truth source 顺序 |
| 验收主语 | 旧 `AllocateExecutionHost` / `ExecutionInstance` 叙事 | `ProjectMemberRef` 执行主语 + `GlobalMemberRef` 身份锚，Host Truth 与 Runtime session 分层 | 解决执行主语和 owner 混层 |
| 证据 | API / DB / trace 泛化描述 | `TC-*` → `EV-MS-*` → `artifacts/test/<run_id>` → `reports/runs/<run_id>` | 可复验、可审计且禁止静态造证据 |
| 未闭合依赖 | 旧文档暗示 runtime / sandbox / member 可直接联调 | 显式 `pending / blocked / waiting / placeholder / fail-closed` | 不伪造兄弟项目 truth |
| 正式结构 | 10 章旧结构 | 06 SOP 规定的 15 章主链 | 与 `L1-governance` 粒度和书写规范对齐 |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| 是否保留旧 06 的功能名作为验收项 | A. 继续使用旧名；B. 仅使用 `03` 正式 protocol / state / object 名 | 采用 B；旧名没有当前协议来源，不能进入正式裁决 |
| 是否把 `05` 中候选 EV 当作已通过证据 | A. 直接引用为 passed；B. 只引用证据族和未来固定路径 | 采用 B；当前无真实 run、artifact、report 或 verdict |
| 是否因 sibling 合同未闭合而删除相关验收项 | A. 删除；B. 保留负向 / blocked / waiting 口径并标正向受限 | 采用 B；边界本身必须可验，正向 readiness 不能伪造 |
| 是否把 `07` 或部署运维内容纳入当前输入 | A. 纳入；B. 只作为下游承接 | 采用 B；避免把实施计划和发布步骤写成验收条件 |

## 8. 结构化中间产物

### 8.1 验收输入映射表

| 输入类别 | 正式来源 | 06 消费方式 | 不能替代的内容 |
|---|---|---|---|
| 需求 / 红线 | `00` C/FR/BR/D/NFR/AC/VF | 形成范围、门禁、VETO 和风险触发 | 不重新定义需求 |
| 架构 / owner | `01` | 形成 truth ownership、依赖类型和数据边界门禁 | 不替兄弟项目定义 truth |
| 概要 / 对象 | `02` | 形成验收主题、能力分组和完整性检查 | 不新增对象 |
| 详细 / 协议 | `03` | 形成字段、状态、flow、UoW、错误和幂等闭环 | 不把 transport / 产品细节猜成正式协议 |
| 配置 | `04` | 形成 profile、strict validation、builder、fail-fast 门禁 | 不把默认值当 readiness |
| 测试 | `05` | 形成 TC、EV、suite、artifact/report 证据入口 | 不把测试计划当执行结果 |

### 8.2 验收标准必须回答的问题

- 在固定需求 / 设计 / 测试 / 交付 / 环境 / 数据基线下，哪些 P0 门禁必须通过。
- Host Truth、control plane、runtime session、execution handoff 的边界如何判定。
- 每条 P0 验收项如何闭环到正式设计契约、`TC-*`、`EV-MS-*` 和 report path。
- 哪些失败触发 `VETO`、S/A 缺陷、不通过或有条件通过。
- sibling 未就绪时的 fail-closed、blocked、waiting、unknown 和 residual 口径。

### 8.3 验收标准不再回答的问题

- 如何编写或执行测试用例、如何生成 fixture、如何运行脚本（归 `05`）。
- 如何拆 commit、安排任务、修改代码或部署服务（归 `07` 及运维文档）。
- Runtime loop、Member 主体、Images 构建、Sandbox backend / policy、Governance approval、L1 领域或观测后端内部如何实现。
- 真实交付版本、run、artifact、report、evidence、verdict、signoff 或 readiness；这些只能由未来真实交付和审查产生。

### 8.4 上游 blocker 与当前影响

| blocker | 影响 | 06 当前允许的表达 |
|---|---|---|
| `MSVC-UP-001~004` | 正向 session、registration、image、binding、cleanup 互操作不可裁决 | 保留安全接缝、负向测试、blocked / waiting 及不 ready 条件 |
| `MSVC-UP-005~006` | policy / credential 正向 owner 未闭合 | 不新增正向 AC；只验不本地拥有、不保存、不复用、不可证即拒绝 |
| `MSVC-UP-007~008` | Core/Bus schema、receipt、SDK target 未闭合 | 只验依赖分类和 body-free / topic-neutral seam，不写 ready |
| performance / product authority | 无法确定硬阈值、容量或具体后端行为 | 只定义结构性 sample 和未来 residual，不写无来源数字 |

## 9. 回填草稿

正式 `06-验收标准.md` §1 应声明：本验收标准承接正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 和 `05-测试方案.md`。需求提供目标、非目标、规则、数据归属、NFR、AC/VF；架构提供 Host Truth 与依赖裁剪；概要提供组成和流程；详细设计提供对象、协议、状态、事务、错误、幂等与观测契约；配置提供 profile、builder、fail-fast 与 redaction；测试方案提供 TC、EV、suite、artifact/report 和回归证据结构。

正式章节只引用具体 `design-calibration/06_acceptance_step_*.md`，不引用已删除旧 06 的结论。未闭合 `MSVC-UP-001~008` 只允许以 pending / blocked / waiting / placeholder / fail-closed 形式进入后续章节，不能成为 ready 或通过证据。

## 10. 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| 送验时的 implementation source ref、build / image digest | Step 3 基线和 Step 4 进入条件 | 进入正式验收前 |
| Core/Bus、Member、Images、Runtime、Sandbox exact contract | Step 7 正向同步与 Step 13 residual | 对应上游合同闭合前保持 blocker |
| 性能 workload / authority | Step 9 数值门禁 | 未取得 authority 前仅结构性 sample |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 验收输入和权威顺序清楚 | 通过 | 见 §8.1 |
| 必须 / 不回答的问题清楚 | 通过 | 见 §8.2~§8.3 |
| 上游 blocker 有明确影响和处理 | 通过 | 见 §8.4 |
| 旧 06 未被继承 | 通过 | 旧文件已删除，差异仅留在本文件诊断 |
| 可进入 Step 2 | 通过 | 下一步定义验收目标与范围 |
