# Step 5. 定义模块实现契约主轴

## 1. Step 状态

- 状态：`completed`
- `gate_status=pass_with_upstream_blockers`
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 5
- 回填章节：未来正式 `03-详细设计.md` §5 模块实现契约
- 框架参考：`projects/L1-governance/design-calibration/03_ddd_step_05_module_contracts.md`；只借用粒度和停审结构，不复制 Governance 业务对象、Rust crate 或 truth ownership。
- 前序门禁：Step 1～4 已完成；目标实现仓仍为 `not_created`。
- 持续 blocker：`SYNC-UP-001~010`、`SYNC-LOCAL-001~005` 均未关闭。

### 1.1 Step 内计划完成情况

1. [x] 回读 Step 4、正式 02 §4～§8、DDH-SYNC-01～17 与详细设计 Step 5 规范。
2. [x] 固定五个业务 feature 主轴与六类正交技术模块，不把技术模块变成业务 truth owner。
3. [x] 为每个模块定义职责、对外暴露、允许依赖、禁止依赖和文件归属。
4. [x] 映射 29 个正式概要对象、services、ports、handlers、repositories 与五个业务组成部分。
5. [x] 给出依赖图、测试切口预告、边界审计和 Step 6 承接条件。

## 2. 本步输入

| 输入 | 本步承接 |
|---|---|
| `03_ddd_step_04_units_file_layout.md` | 单 TypeScript package、feature-first + layer-within-feature、计划文件树与依赖方向。 |
| 正式 02 §4～§5 | 五个业务组成部分与 Inbound/Application/Domain/Ports/Persistence/Adapters 正交轴。 |
| 正式 02 §6 | 29 个关键对象的 identity 与归属。 |
| 正式 02 §7～§8 | Command/Query/Consumer/Job/Port 主语与 18 个关键流。 |
| 正式 02 §12 | `DDH-SYNC-01~17`、测试 seam、回退规则与 blocker 上限。 |
| `L1-governance` Step 5 | 模块总览、逐模块职责、依赖图、文件映射、测试切口和停审粒度。 |

## 3. SOP 问题回答

1. **本仓拆成哪些实现模块？** 五个业务 feature：`selection_access`、`working_copy_metadata`、`source_materialization`、`conflict_recovery`、`review_handoff_provenance`；六类正交技术模块：`orchestration`、`adapters`、`operations`、`composition`、`config`、`cli`。单 package 内不再建立横向 `domain/application/infra` 顶层桶。
2. **每个模块对应什么？** 五个 feature 一一对应正式 02 的 CP1～CP5；正交模块分别承接跨 feature 编排、外部能力实现、条件性 consumer/job、装配、配置载体与用户入口。
3. **对外暴露什么？** root library 只显式导出批准的 command/query facade 与公共结果；feature 暴露 domain types、application service 和 inward ports 给包内使用；adapter concrete types、provider DTO 与 metadata backend 不进入公共 surface。
4. **允许与禁止依赖？** `cli/operations -> orchestration or owning application -> domain + ports`；`adapters -> inward ports + public SDK/tool facility`；`composition -> all assembly surfaces`。Domain 不依赖 application、adapter、CLI、config 或 provider DTO；feature application 不直接依赖别的 feature concrete service；query service 不获得 mutation capability。
5. **对象、port、handler、repository 归属？** 29 个关键对象归所属 feature 的 `domain/`；用例 service 归 feature `application/`；inward port/repository 归使用它的 feature `ports/`；concrete adapter 归 `adapters/`；入口归 `cli/operations`；跨 feature 顺序归 `orchestration`。

## 4. 当前文档问题诊断

Step 4 已能创建 planned 文件树，但尚未回答“模块如何协作、哪些符号可被谁依赖”。若只按技术层拆顶层模块，五个业务 ownership 会被打散；若只把五个 feature 并列，又容易把 SDK/Git/fs/store、CLI 与 jobs 错当第六至第十一种业务 truth。因此本步固定“业务 feature 主轴 + 正交技术模块”双轴，并通过 inward port 与 composition root 保持依赖倒置。

## 5. 改动前后对比

| 项 | Step 4 之前 | 本步收稳后 |
|---|---|---|
| 模块主轴 | 只有 planned 目录与文件职责 | 五 feature 是业务主轴，六类技术模块只承载入口/实现/装配。 |
| 跨 feature 调用 | 仅预告 coordinator | 统一由 `OperationCoordinator` 编排，禁止 concrete service 环状调用。 |
| ports/adapters | 只列文件名 | inward port 归 capability 使用方，adapter 只实现接口且不得升级外部结果。 |
| status 查询 | 有 no-write 原则 | module capability segregation 明确 query composition 不注入写口。 |
| blocked surface | 散落于上游风险 | owner/source/handoff/consumer 等正向能力显式保持 blocked/unsupported。 |

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| Governance 式七 crate 技术层主轴 | 不采用 | 本仓已收稳为单 TypeScript package，机械套用会打散五个 feature。 |
| 仅五 feature、所有 adapter 放各 feature | 不采用 | SDK/Git/fs/metadata 设施可能服务多个 feature，且会增加重复与循环。 |
| 五 feature + 正交技术模块 | 采用 | 同时保留业务 ownership、依赖倒置和明确 entry/composition 边界。 |
| 全局 `contracts/common/types/utils` | 禁止 | 容易形成无边界公共桶；shared types 必须有 owning feature 或 orchestration contract 来源。 |

## 7. 结构化中间产物

### 7.1 模块总览

| 模块 | 所属实现单元 | 核心职责 | 对外暴露 | 依赖对象 |
|---|---|---|---|---|
| `selection_access` | feature | 显式选择、operation、owner snapshot、access/posture eligibility | CP1 domain、service、owner ports | 本 feature domain/ports；typed refs |
| `working_copy_metadata` | feature | working-copy binding、metadata、cursor/mapping、local observation 与保护 | CP2 domain、service、local ports | 本 feature domain/ports；CP1 decision refs |
| `source_materialization` | feature | source delta、plan/change set、stage/apply/finalize | CP3 domain、service、source/Git/fs ports | CP1 eligibility、CP2 refs/observations |
| `conflict_recovery` | feature | conflict、checkpoint、manual intent、resume/probe safety | CP4 domain、service、probe/repository ports | operation/run/attempt refs；local stores |
| `review_handoff_provenance` | feature | candidate、handoff attempt、provenance、layered status | CP5 domain、services、handoff/decision/diagnostics ports | CP1/2/4 snapshots and refs |
| `orchestration` | application coordination | 跨 feature mutation/query call order 与 capability segregation | `OperationCoordinator` facade | feature application contracts only |
| `adapters` | infrastructure | SDK/Git/filesystem/metadata/diagnostics concrete bindings | concrete implementations for composition | public SDK/tool facility + inward ports |
| `operations` | inbound operations | 条件性 invalidation consumers 与三个 bounded jobs | consumer/job handlers | orchestration/owning services; no direct store |
| `composition` | composition root | 装配 ports/adapters/services、能力验证 | runtime/library/CLI assembly | all construction surfaces |
| `config` | configuration seam | typed runtime config carrier/load/validate interface | config types/load result | no domain ownership |
| `cli` | inbound/presentation | 解析 verb、显式参数、调用 facade、映射安全输出 | four P0 entries + maintenance/recovery entries | public application facade only |

### 7.2 模块依赖图：L5-sync 实现主轴

```text
                      +-------------------+
                      |   cli / operations|
                      +---------+---------+
                                |
                                v
                      +---------+---------+
                      |   orchestration   |
                      +---------+---------+
                                |
            +-------------------+-------------------+
            |          feature application          |
            +-------------------+-------------------+
                                |
                  domain rules  |  inward ports
                                v        ^
                      +---------+--------+----------+
                      | five feature domain / ports |
                      +-----------------------------+
                                      ^
                                      | implements
                      +---------------+-------------+
                      | adapters: SDK / Git / fs /  |
                      | metadata / diagnostics      |
                      +-----------------------------+

 composition/config construct the graph; they do not own business truth.
```

关键说明：

- 图表达模块依赖方向，不表达 Step 9 的函数级处理流。
- 五 feature 之间只传 typed refs、snapshots、decisions 和 application contracts；不得 import 对方 adapter 或 store implementation。
- `adapters` 实现 inward ports；feature core 不 import concrete adapter/provider DTO。
- `status` 使用单独 read-only composition，不能借查询触发 refresh、repair、probe 或 observation persistence。

### 7.3 五个业务 feature 契约

#### 7.3.1 `selection_access`

| 项 | 内容 |
|---|---|
| 主要责任 | 建立 explicit `SyncSelection`、创建/推进 `SyncOperation`、保存 owner snapshot、输出 access/posture eligibility decision。 |
| 对外暴露 | CP1 五对象；`SelectionAccessService`；`OwnerAccessPort`、`OwnerReferenceStore`。 |
| 允许依赖 | 自有 domain/ports；共享 clock/id/digest type；外部 ref 的不透明表示。 |
| 禁止依赖 | SDK adapter、Project/Artifact/Workspace/Governance domain model、默认项目/版本推断、本地授权。 |
| blocker | `SYNC-UP-001/003`：正向 owner check/matrix 只能 blocked skeleton。 |

#### 7.3.2 `working_copy_metadata`

| 项 | 内容 |
|---|---|
| 主要责任 | 管理 binding/manifest/cursor/mapping/observation，执行 metadata integrity 与 dirty/path safety guard。 |
| 对外暴露 | CP2 七对象；working-copy 与 maintenance services；metadata/UoW/Git observation/fs ports。 |
| 允许依赖 | CP1 typed selection/evaluation refs；自有 repositories；read-only Git/fs observations。 |
| 禁止依赖 | 固定历史 `metadata.json`、provenance 删除、隐式 repair、把 Git remote/commit 当 source truth。 |
| blocker | `SYNC-UP-006/007/010`：物理 schema、Git mapping、path/manual contract 未闭合。 |

#### 7.3.3 `source_materialization`

| 项 | 内容 |
|---|---|
| 主要责任 | 从外部 source snapshot/delta 构造 plan/change set，以 stage→apply→finalize 边界物化到 working copy。 |
| 对外暴露 | CP3 五对象；`MaterializationService`；source/Git worktree/filesystem apply ports。 |
| 允许依赖 | CP1 eligibility decision；CP2 binding/cursor/mapping/observation refs；CP4 checkpoint/conflict intake contract。 |
| 禁止依赖 | 自动 fetch/merge/rebase/push/stash、无 comparator 前推进 cursor、覆盖 dirty/untracked、伪造 source version。 |
| blocker | `SYNC-UP-002/007/008/010`：source authority、增量 comparator 与 apply safety 未闭合。 |

#### 7.3.4 `conflict_recovery`

| 项 | 内容 |
|---|---|
| 主要责任 | 记录 conflict/checkpoint/manual resolution intent/probe，决定 resume/replan/manual/stop；不拥有原业务 truth。 |
| 对外暴露 | CP4 五对象；conflict/recovery services；probe/conflict/recovery repository ports。 |
| 允许依赖 | operation/run/handoff attempt typed refs、immutable fingerprints、owner-provided probe result。 |
| 禁止依赖 | 自动解决冲突、盲重试 unknown outcome、把取消解释为外部撤销、删除 attempt/provenance。 |
| blocker | `SYNC-UP-004/005/010`：formal probe/idempotency/manual decision contract 未闭合。 |

#### 7.3.5 `review_handoff_provenance`

| 项 | 内容 |
|---|---|
| 主要责任 | 冻结 review candidate、prepare/call/probe/finalize attempt、append provenance、构建 layered status。 |
| 对外暴露 | CP5 七对象；handoff/provenance/status services；handoff/decision/provenance/diagnostics ports。 |
| 允许依赖 | CP1 access snapshot、CP2 working-copy/cursor/mapping refs、CP4 conflict/checkpoint/probe refs。 |
| 禁止依赖 | 自动 Git push、创建 Review Decision、ACK→accepted、local commit→Artifact/Baseline、raw evidence/body 持久化。 |
| blocker | `SYNC-UP-001/004/005/006`：handoff/Decision/probe/provenance storage 正向合同未闭合。 |

### 7.4 正交技术模块契约

| 模块 | 主要责任 | 允许依赖 | 禁止行为 |
|---|---|---|---|
| `orchestration` | 定义 clone/pull/status/push-review 与 maintenance/recovery 的跨 feature 顺序、UoW capability 使用边界 | feature application public contracts | 新增 global state/truth、直接访问 SDK/Git/fs/store、吞并 feature error |
| `adapters` | 将 SDK/Git/fs/local storage/diagnostics result 规范化为 inward port result | inward ports、public SDK/tool APIs | provider DTO 上泄、private endpoint、外部状态升级、本地授权、任意 shell |
| `operations` | 条件 consumer 和 bounded job 的 envelope/job validation、调用、result mapping | orchestration/owning service | daemon truth、auto repair/retry、直接 repository 写入 |
| `composition` | 构造 read-only/write capability graphs，验证 blocked/unsupported capability | config + services + adapters | 用默认/fake 绕过缺失能力；把测试 fake 注入生产 |
| `config` | 运行配置 typed carrier 与 validation seam | primitive/contract types | 改变 hard gate、承载 secret/raw body、提前锁 keys/defaults |
| `cli` | parser-neutral input/output boundary | facade DTO/result/error | domain rule、默认选择、直接 adapter call、输出 secret/raw evidence |

### 7.5 文件与代码主体映射

| 路径 | 主体 | 责任 |
|---|---|---|
| `src/selection_access/domain/*.ts` | CP1 五对象 | selection/access local truth、snapshot 与 policies。 |
| `src/working_copy_metadata/domain/*.ts` | CP2 七对象 | working-copy/metadata/cursor/mapping/observation safety。 |
| `src/source_materialization/domain/*.ts` | CP3 五对象 | delta/plan/change set/run/safety。 |
| `src/conflict_recovery/domain/*.ts` | CP4 五对象 | conflict/checkpoint/resolution/probe/recovery policy。 |
| `src/review_handoff_provenance/domain/*.ts` | CP5 七对象 | candidate/attempt/provenance/policies/layered view。 |
| each feature `application/*.ts` | use-case services | owning capability orchestration；不承载 transport。 |
| each feature `ports/*.ts` | inward ports/repositories | typed capability seam；不含 concrete/provider schema。 |
| `src/orchestration/operation_coordinator.ts` | cross-feature facade | 四 P0 与 recovery/maintenance call ordering。 |
| `src/adapters/**` | concrete bindings | SDK/Git/fs/metadata/diagnostics normalization。 |
| `src/operations/**` | conditional consumers/jobs | bounded operations entry；blocked surface 显式拒绝。 |
| `src/composition/**` | builders | capability-separated runtime construction。 |
| `src/config/**` | runtime config | Step 14/04 的载体，不定义最终配置。 |
| `src/cli/**` | entries/router/presenter | explicit input 与 safe layered output。 |

### 7.6 业务组成部分到模块映射

| 业务组成部分 | feature core | orchestration | adapters | entry |
|---|---|---|---|---|
| Selection & Access | `selection_access` | shared eligibility gate | owner SDK/store | CLI + invalidation consumer/job |
| Working Copy & Metadata | `working_copy_metadata` | clone/status/maintenance coordination | metadata/Git observation/fs | clone/status/maintenance entries/jobs |
| Source Materialization | `source_materialization` | pull coordination | material source/Git worktree/fs apply | pull + source invalidation consumer |
| Conflict & Recovery | `conflict_recovery` | resume/probe/cancel coordination | recovery probe/local repositories | recovery entry + probe job |
| Review Handoff & Provenance | `review_handoff_provenance` | push-review/status refresh | handoff/decision/provenance/diagnostics | push-review/status + Decision consumer |

### 7.7 对象与接缝归属预告

| 类别 | 唯一归属 | Step 6/7 处理 |
|---|---|---|
| 29 个正式概要对象 | 所属 CP feature `domain/` | Step 6 逐对象定义；不得移动 identity/ownership。 |
| shared refs/reasons/fingerprints | 首个拥有其语义的 feature，跨 feature 只通过显式 export | Step 6 收敛 secondary types；禁止全局 `common`。 |
| application command/query carrier | owning feature 或 orchestration | Step 6 闭口稳定 carrier；Step 8 定 public DTO。 |
| repositories/inward capability | 使用该 capability 的 feature `ports/` | Step 7 定签名、error、read/write/UoW。 |
| concrete SDK/Git/fs/store | `adapters/` | Step 7 映射表；正向 capability 可保持 blocked。 |
| handlers/jobs/consumers | `cli/operations` | Step 8 协议、Step 9 flow；不形成 business truth。 |

### 7.8 模块测试切口预告

| 模块 | Step 16/05 后续测试切口 | 当前证据上限 |
|---|---|---|
| five feature domain | invariants、state transition、forbidden transition、policy decisions | 只证明纯逻辑，不证明 owner/tool/store。 |
| feature application / orchestration | call order、UoW boundary、known/unknown、no hidden side effect | scripted port 不证明真实集成。 |
| adapters | contract mapping、redaction、capability refusal、fault normalization | adapter contract test 不证明上游 authority。 |
| operations | envelope/job validation、duplicate/no-op/blocked paths | consumer/job fake 不是运行证据。 |
| composition/config | read/write capability segregation、missing capability fail-closed | wiring test 不是 readiness。 |
| cli | explicit selection、safe output、error disposition、status no-write | parser unit test 不证明端到端成功。 |

### 7.9 模块级边界审计

| 审计项 | 结论 | blocker / 修正 |
|---|---|---|
| 五个业务部分是否各有唯一 core | pass | 技术模块不得成为第六业务 owner。 |
| 29 对象是否均有归属 | pass | CP1=5、CP2=7、CP3=5、CP4=5、CP5=7。 |
| Domain 是否隔离 adapter/provider | pass | Step 7 继续校验 import/contract direction。 |
| 跨 feature 是否可能成环 | pass_with_rule | 必须经 coordinator/typed contract，禁止 service concrete import。 |
| status 是否 no-write | pass | read-only composition 不注入 mutation/UoW/probe。 |
| blocked 正向 capability 是否伪装 ready | pass | `SYNC-UP-001~010` 全部保留。 |
| forbidden Git/review/provenance 边界 | pass | adapter 与 entry 均无旁路权限。 |

## 8. 回填草稿

未来正式 §5 应摘录模块总览、依赖图、五 feature/正交模块契约、业务映射与边界审计。正式正文只呈现收口结论，并引用本文件作为模块职责、依赖和停审依据。

## 9. 待确认事项

- `SYNC-UP-001~010` 继续为 `pending/blocked`；本步未关闭任何正向 adapter、metadata 或 Git 合同。
- `SYNC-LOCAL-001~005` 继续为 `local_pending`；模块边界不依赖具体 parser/validator/test runner/Git library。
- Step 6 必须覆盖 29 个对象和必要 secondary TypeScript types，不能只给全局摘要。

## 10. 进入下一步条件

- [x] 五 feature 与六类正交技术模块的职责、暴露面和依赖方向明确。
- [x] 29 对象、services、ports、handlers、repositories 均可找到唯一归属。
- [x] no-write query、no auto Git、ACK≠Decision、local commit≠Artifact/Baseline、provenance non-delete 均保留。
- [x] 上游 blocker 未被 adapter、fake、cache 或推测关闭。
- [x] 未修改正式 03、未创建代码/实现仓/测试/evidence/implementation ledger/commit。

结论：Step 5 通过 `pass_with_upstream_blockers`，允许按既有用户授权进入 Step 6；该结论仅表示模块中间产物静态闭合。
