# Step 1. 确认概要设计输入边界

## 1. Step 状态

- 状态：`completed`
- `gate_status=pass_with_upstream_blockers`
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 1
- 回填章节：正式 `03-详细设计.md` §1 与上游文档的关系声明、§17 风险与待确认事项
- 正式 `03-详细设计.md` 写入：`false`
- 本步只确认承接边界，不写实现代码、正式章节、implementation ledger 或 boundary skeleton。

## 2. 本步输入

| 输入 | 本步使用方式 |
|---|---|
| `projects/L5-sync/00-需求文档.md` | 承接定位、目标/非目标、FR/BR/NFR、数据归属、验收红线和 `SYNC-UP-001~010`。 |
| `projects/L5-sync/01-架构设计.md` | 承接五个业务组成部分、系统边界、依赖方向、运行单元、通信方式和 local/external truth ownership。 |
| `projects/L5-sync/02-概要设计.md` | 作为详细设计直接输入，承接代码主体、29 个对象、四个 CLI、接口骨架、18 个关键流、17 组状态和异常/配置交接。 |
| `design-calibration/02_hld_step_01_upstream_boundary.md` 至 `02_hld_step_14_formal_document_assembly.md` | 核对概要设计来源、交接合同、风险和停审状态。 |
| 八个专项上游当前正式文档及必要台账 | 仅核对 owner truth、可消费 capability 和未闭合 surface；不复制外部对象。 |
| `standards/document/详细设计讨论流程_SOP.md`、`详细设计书写规范.md`、`设计文档讨论中间产物规范.md` | 约束本步问题、输出、追溯和门禁。 |
| `standards/document/设计真相源闭环与可落码性标准.md`、`全局项目依赖关系与裁剪规则.md` | 约束 truth ownership、跨文档闭环和 Layer 5 依赖方向。 |
| `standards/coding/typescript.md`、`子项目目录与代码文件组织规范.md` | 登记 Step 3/4 的语言、runtime、包和布局输入；本步不提前锁实现方案。 |
| `projects/L5-sync/03-详细设计.md`、`README.md`、`draft/` | 仅作为 `historical_material` / `pre-calibration_input` 进行污染诊断，不作为当前设计 authority。 |

已确认前提：正式 00、01、02 均为当前直接基线并处于 `formal_stop_review`；旧正式 03 和 README 不得局部修补或直接继承。

## 3. SOP 问题回答

### 3.1 当前详细设计直接承接概要设计中的哪些结论？

详细设计直接承接以下已收稳主语，不重新定义其业务含义：

1. 五个业务组成部分：`Selection & Access`、`Working Copy & Metadata`、`Source Materialization`、`Conflict & Recovery`、`Review Handoff & Provenance`。
2. 正交实现分层：Inbound/Operations、Application、Domain/Policy、Ports、Local Persistence、Adapters；共享 owner references 不构成第六个 truth 部分。
3. 四个 P0 CLI 语义：`clone`、`pull`、`status`、`push-review`，以及 metadata/recovery maintenance 入口。
4. 29 个 local object 的 identity、职责轮廓、状态轴和禁止事项；它们仍需在后续 Step 转成 TypeScript type/class/enum/function 契约。
5. 18 个关键处理流、17 组 local lifecycle 状态、多轴结果分层和 40 个异常场景；后续只补函数级调用、持久化/锁/错误映射，不改变主语。
6. `status` query no-write、explicit selection、owner revalidation、dirty/non-overwrite、cursor finalize、prepare→call→probe/finalize、ACK/Decision 分层和 provenance 保护等硬约束。

### 3.2 概要设计中的代码主体框架是否足够稳定？

足够进入详细设计的 Step 2～4。概要设计已经点名五部分 application service、`OperationCoordinator`、`SyncStatusQueryService`、local domain objects/policies、owner/source/handoff/probe ports、Git/filesystem/metadata/diagnostics adapters 和 `LocalStateUnitOfWork`。这些名称足以讨论本轮范围、TypeScript 约束和 planned 文件布局。

该结论不表示目标实现仓或任何类已经存在；精确 package/binary 名、flags、exit codes、完整函数签名和物理 metadata schema 仍需后续收口。

### 3.3 关键对象、接口骨架、处理流和状态机是否足够继续展开？

足够作为实现契约输入，但只达到概要深度：

| 输入类别 | 已收稳内容 | 详细设计继续补充 |
|---|---|---|
| 对象 | 29 个对象的职责、关键字段类别、状态类别、成员行为方向 | TypeScript interface/class、readonly 字段、工厂、二级类型和校验错误 |
| 接口 | 四 CLI、Command/Query/conditional consumer/operations job、ports/adapters 类别 | request/result DTO、函数签名、错误映射、adapter capability boundary |
| 处理流 | mutation/query/consumer/job 通用骨架及 18 条关键流 | exact call order、UoW、锁/staging、crash window、恢复查询和副作用边界 |
| 状态 | local operation、metadata、materialization、conflict/recovery、handoff 等多轴状态 | enum、guard、合法/非法迁移、持久化版本和跨轴传播 |

### 3.4 哪些内容仍停留在概要轮廓，进入详细设计前必须补清？

- 单 TypeScript package 的真实目标仓布局、`src/` 模块和 CLI/library entry 组织。
- ESM/Node runtime 的版本与 package manager 约束；当前不能猜测精确版本或命令解析库。
- `@quantalithos/sdk` 可核验的基础 client surface 与 L5-sync 所需 capability port 之间的适配边界；不得发明 Sync 专用 SDK DTO。
- `.qs-sync` metadata 的逻辑主题到物理持久化、generation、integrity、migration、retention 和 crash recovery 的映射。
- Git observation/worktree、filesystem、安全路径、锁和 staging 的最小 adapter 合同；Git remote 不进入 truth ownership。
- Artifact/Workspace source authority、increment comparator/gap、Governance handoff/probe/idempotency、Project posture action matrix 等仍受 `SYNC-UP-001~010` 阻断的正向合同。

### 3.5 哪些需求或架构结论会影响详细设计，但不能在详细设计中重新定义？

需求与架构已经锁定的本仓定位、非目标、单一 truth owner、显式选择、fail-closed、query no-write、non-overwrite、Review Gate 不绕过、provenance 不伪造/不删除、禁止自动 merge/rebase/push/stash，以及 Layer 5 依赖裁剪，均只能被转译为代码契约，不能在 03 中重新解释为本地业务所有权。Project、Artifact、Baseline、Review Gate/Decision、Workspace projection、Archive、身份/权限和 Git remote truth 仍由各自 owner 持有。

## 4. 当前文档问题诊断

旧正式 `03-详细设计.md` 以 `SyncTask`、fanout、跨端 projection、replay/resync 和 Rust/Tauri 风格目录为中心，未承接当前 00/01/02 的 working-copy、source binding、Review handoff、provenance 和多轴状态边界。README/draft 还包含固定 metadata 单文件、Git LFS、浅克隆、GUI 等历史选择。它们与当前上游和 blocker 传播规则不一致，不能通过局部修改恢复可信度。

本轮因此只保留旧材料的污染记录，后续正式 03 必须在 Step 19 以 calibration 产物 full-restart 重建；当前 Step 不修改正式文件。

## 5. 改动前后对比

| 项 | 历史/旧输入 | 当前详细设计承接口径 |
|---|---|---|
| 主语 | 跨端统一 `SyncTask` 与 fanout/replay | 平台来源到本地 working copy 再到 Review handoff 的受控入口 |
| truth | Git、bus、平台状态和本地 projection 易被合并 | Sync 只拥有 local session/binding/metadata/cursor/mapping/conflict/recovery/handoff/provenance |
| 操作 | 隐含同步、默认版本或自动恢复倾向 | explicit project/version/source/target/operation；缺失或过期即 blocked/needs-action |
| 状态 | 单一 synced/failed/lag 叙事 | object-qualified、多轴 local/transport/probe/Decision/archive posture |
| 技术事实 | Rust/Tauri、固定 metadata、LFS/shallow/GUI 被当作方案 | TypeScript/ESM/Node 作为 planned 方向；精确版本和历史能力保持 pending |
| 完成含义 | 文档名称可能被误读为已有实现 | 只证明设计中间产物，绝不证明代码、测试、artifact、evidence、review 或 readiness |

## 6. 设计取舍

1. 采用“稳定 ownership + 保守失败骨架”：上游缺口允许在后续详细设计中定义 typed `blocked`、`unsupported`、`needs-action`、`probe-required` 和 `manual` 路径，但不允许用历史 RPC、fake、cache 或 opaque map 填补正向合同。
2. 以正式 00/01/02 为唯一直接真相源；专项上游只提供 owner boundary/capability 证据，L1-workspace draft 只参考表达粒度。
3. 将业务组成部分与实现分层保持正交：五部分决定责任和对象归属，TypeScript 文件布局只表达实现边界，不新增业务 truth。
4. 将 `SYNC-UP-001~010` 作为唯一 blocker 集合持续传播；任何后续正向合同闭合都必须回流受影响 Step，不能在 03 中暗改。

## 7. 结构化中间产物

### 7.1 上游关系映射表

| 来源文档 | 承接内容 | 本文/后续详细设计继续展开 |
|---|---|---|
| 00 §2、§4、§7 | 定位、目标、非目标、六项能力闭环 | 将能力约束翻译为 local type、guard、command 和 result posture |
| 00 §8～§12 | 用户故事、FR/BR、数据归属、接口依赖 | 建立 DTO、port、repository、adapter 输入输出和 forbidden body 边界 |
| 00 §13～§16 | NFR、验收、一票否决、风险与追溯 | 建立测试切口、证据上限和 blocker 回流，不生成运行事实 |
| 01 §4～§8 | 职责边界、上下文、运行单元、依赖方向 | 固化单 package 的 entry/application/domain/ports/persistence/adapters 依赖 |
| 01 §9～§13 | ownership、一致性、通信、技术机制和横切约束 | 补 UoW、状态、恢复、配置和诊断适配边界 |
| 01 §14～§17 | 演进、风险、ADR、追溯 | 保持 pending/blocked，不将历史选择升级为当前实现事实 |
| 02 §4～§12 | 代码主体、五部分、29 对象、接口/流/状态/异常/配置 | 作为 Step 2～4 及后续 Step 的直接实现契约输入 |
| 八个专项上游 | owner truth、正式 SDK seam、workspace/artifact/governance/archive/observability 边界 | 只消费 refs/snapshots/capabilities；不内化外部模型 |

### 7.2 本文不再回答

- 为什么 L5-sync 属于 Layer 5、用户价值和验收目标是什么。
- Project、Artifact、Baseline、Workspace projection、Review Gate/Decision、Archive、Identity 和 Git remote 的内部模型、生命周期或授权算法。
- Artifact/Workspace 如何计算 source authority、Project 如何决定 archive/dissolved/retired 动作、Governance 如何生成 Decision。
- 具体 Node 版本、package manager、CLI parser、binary/package 名、flags、exit codes、metadata 文件布局、DDL、完整协议 payload 和性能数字。
- Git LFS、浅克隆、GUI/Tauri、daemon 是否受支持；这些只可作为 `historical/pending`。

### 7.3 本文必须回答

- 本轮详细设计覆盖的 P0/P1 模块、CLI、对象、ports/adapters、状态和恢复契约边界。
- TypeScript/ESM/Node 的编码与 runtime 约束、目标仓事实边界和依赖类型。
- 单 package 的实现单元、文件布局、模块职责和命名检查；不把 planned path 当现有文件。
- `.qs-sync`、Git/filesystem、SDK/Governance/Artifact/Workspace adapter 的可落码边界，以及 blocker 如何传播。
- 哪些内容交给 04/05/06/07，哪些必须停在 detailed design 或 `planned/blocked/waiting`。

### 7.4 输入缺口与影响

| 缺口 | 影响 | 当前处置 |
|---|---|---|
| `SYNC-UP-001`：L0-sdk 精确 owner/handoff surface、error、compatibility 未闭合 | SDK adapter、DTO、错误映射无法写成真实 provider contract | 仅保留 capability port；正向 adapter `blocked` |
| `SYNC-UP-002/008`：source authority、watermark、comparator、gap/replay 未统一 | `clone/pull` 增量路径、cursor finalize 和 mapping 无法安全锁定 | 无 proof 不 pull；保留 `blocked/needs-action` |
| `SYNC-UP-003`：Project permission/posture action matrix 未闭合 | 归档/撤销/解散姿态下 mutation 不能正向放行 | unknown/stale/revoked/archived fail-closed |
| `SYNC-UP-004/005`：Review handoff、ACK、probe、idempotency、unknown outcome 合同未闭合 | `push-review` 不能声明 accepted，也不能盲重放 | prepare→call→probe/manual；分层结果 |
| `SYNC-UP-006`：`.qs-sync` 物理 schema/migration/retention 未闭合 | 不能锁文件布局、迁移和删除语义 | 仅定义逻辑主题和受保护 provenance |
| `SYNC-UP-007/009/010`：Git/source 映射、LFS/shallow/GUI、dirty/path protection 精确合同未闭合 | adapter 能力矩阵和 apply 细节受阻 | local observation + whitelist；unsupported/pending |
| 目标实现仓不存在 | 不能声称真实 package/file 已有 | 仅设计 planned 单 package 布局，不创建实现仓 |

### 7.5 详细设计完成上限

本 Step 证明输入足以进入 Step 2～4，并不证明任何正向跨域路径可以运行。详细设计可收稳 TypeScript 模块、类型、端口、状态和保守失败契约；但在用户授权实现、正式上游合同和真实运行证据前，不能宣称代码、测试、commit、artifact、report、evidence、review verdict、signoff 或 readiness。

## 8. 回填草稿

正式 `03-详细设计.md` §1 应摘录本文件 §7.1～§7.3，声明 00/01/02 是直接基线、旧 03/README/draft 仅为历史材料，并明确详细设计不拥有任何外部 truth。

正式 §17 应在后续 Step 18 汇总本文件 §7.4 的 blocker；本 Step 不提前装配正式章节，也不把缺口润色为可用合同。

建议正式章节延伸阅读：本文件“上游关系映射表”“本文不再回答 / 必须回答”“输入缺口与影响”“详细设计完成上限”。

## 9. 待确认事项

- `SYNC-UP-001~010` 无一关闭；全部继续 `pending/blocked`。
- 精确 Node/package/CLI/metadata/Git/SDK/Governance 合同留给 Step 2～4 及后续对应 Step，不能以历史材料补齐。
- 目标实现仓 `/home/aris/Projects/quantalithos-sync` 当前不存在；后续只可记录 `planned/not_created`。

## 10. 进入下一步条件与自检

- [x] 已回答详细设计 SOP Step 1 的五个问题。
- [x] 已列出上游关系映射、本文不再回答/必须回答和输入缺口。
- [x] 已诊断旧正式 03/README/draft 污染，未继承旧主语。
- [x] 已确认五部分、29 对象、四 CLI、18 流、17 状态是概要输入，不在本步新增主语。
- [x] 已区分文档完成上限与实现/测试/readiness，未伪造事实。
- [x] `SYNC-UP-001~010` 保持原状态；无跨项目写入。

结论：`gate_status=pass_with_upstream_blockers`；允许创建并完成 Step 2。该结论是中间产物静态门禁，不是用户签署、上游 signoff 或实现许可。
