# Step 17. 收口详细设计到实施计划的承接清单

### 1. Step 状态

- 状态:[x] 已确认
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 17
- 回填章节:`03-详细设计.md` §5.16 详细设计到实施计划的承接清单

### 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 1~16 中间产物 | 上游、范围、约束、布局、模块、对象、port、协议、flow、状态、事务、错误、幂等、配置、观测、测试 | 固定实施计划承接来源 |
| `standards/document/详细设计讨论流程_SOP.md` Step 17 | 承接清单、前置阅读、字段 / DTO / 状态 / phase / 命名复核 | 固定本 Step 输出 |
| `standards/document/详细设计书写规范.md` §5.16 | 必须包含提交规范、git config、Rust 编码规范和注释规范 | 固定前置阅读门禁 |
| `standards/document/设计文档讨论中间产物规范.md` §5.10 | 跨文档一致性复核表 | 固定复核维度 |
| `standards/document/实施计划书写规范.md` | `07` 负责阶段、代码批次、提交边界、commit message、永久记忆种子 | 固定本 Step 与 `07` 边界 |
| `standards/coding/rust.md` | Rust 源码英文、rustdoc、普通注释、测试名和命名规范 | 固定实施前置阅读 |
| `standards/document/子项目目录与代码文件组织规范.md` | 实现仓、crate、scripts、reports、artifacts 组织 | 固定目标仓检查项 |
| `projects/README.md` §3.3 / §8.2 | git config、design 仓与实现仓提交语言边界 | 固定提交前置项 |

已确认结论:

```text
目标实现仓路径: /home/aris/Projects/quantalithos-work
目标实现仓当前未在 /home/aris/Projects 下发现;实施计划 PH-01 前置门禁必须确认创建或路径。
Step 17 只回答“详细设计交给实施计划什么”,不写开发排期、任务拆分或 commit boundary。
实施计划应引用正式 03 和 design-calibration Step,不得复制重写对象、函数、协议、状态矩阵或测试表。
真实实现仓不是 quantalithos-design,因此 commit message、源码标识符、rustdoc、普通注释和测试名默认使用英文。
```

### 3. 分批写入记录

本 Step 按 `设计文档讨论中间产物规范.md` §3.4 分批写入:

| 批次 | 内容 | 状态 |
|---|---|---|
| 17.1 | 文件骨架、SOP 问题回答、承接关系 | [x] |
| 17.2 | 实施承接清单、前置阅读清单、实施前检查清单 | [x] |
| 17.3 | 跨文档一致性复核、命名一致性、冲突与修正 | [x] |
| 17.4 | 回填草稿、待确认事项和进入下一步条件 | [x] |

### 4. SOP 问题回答

1. 哪些实现契约已经足够进入实施计划?

   回答:Step 1~16 已收稳上游边界、P0 范围、Rust / repo 约束、workspace 布局、七模块主轴、对象契约、trait / port / adapter、18 Command、8 Query、7 Inbound Event、9 Outbound Event、6 Job、逐接口 flow、12 组状态机、事务一致性、错误恢复、幂等并发、配置绑定、可观测性和最小测试切口。它们足够作为 `07-实施计划.md` 的输入。

2. 实施者需要先阅读哪些文档?

   回答:必须先读 L1-work `00/01/02`、正式 `03-详细设计.md`、本轮 `03_ddd_calibration_flow.md` 和对应 Step 中间产物、L0-core 上游文档、Rust 编码规范、目录组织规范、实施计划书写规范、项目 README 提交规范。正式 `03` 审核前不得移交实现,也不得按旧版 `03-详细设计.md` 开发。

3. 提交规范、git config 用户、Rust 编码规范和注释规范是否已经列入前置阅读?

   回答:已列入。实施计划还必须把 `git config user.name=quantalithos-labs`、`git config user.email=quantalithos.ai@gmail.com`、实现仓英文 commit、`type(scope): subject` 标题、固定 AI footer、源码英文、rustdoc / 普通注释英文和测试名英文列为开工门禁。

4. 每个 Domain 必填字段是否能回指 DTO、event、派生规则、查表规则或系统生成规则?

   回答:已通过初步闭环复核。Step 6 的 domain 必填字段能回指 Step 8 DTO / Event / Job、Step 9 处理流、Step 7 repository / resolver / id generator / clock、或 Step 11 查表规则。后续 Step 19 正式文档回填时仍需逐章校对。

5. 每个 Command / Event / Job 是否能构造目标对象,或明确缺失处理?

   回答:已通过初步闭环复核。Command 缺失走 reject / protocol error,Inbound Event 缺失走 retry / dead-letter / unresolved marker,Job 缺失走 reject / report failed。目标对象构造入口由 Step 9 flow 指定,不得由实施者自行补字段。

6. 每个 Query 的 response view / page / marker、read model / projection / cursor id/ref 是否已经闭合?

   回答:已通过初步闭环复核。8 个 Query 的 response 字段来源、projection / truth repository key、empty / not visible / stale / failed 口径在 Step 8 / Step 9 / Step 12 / Step 16 中闭合。Query no-write 是硬约束。

7. 状态枚举、状态图、测试切口、验收口径是否使用同一套正式状态名?

   回答:详细设计内部通过。Step 10、Step 16、正式 `05-测试方案.md` 和正式 `06-验收标准.md` 使用同一套状态名。后续实现和验收不得另起旧名。

8. 当前 phase / commit boundary 是否误用了后续 phase 才定义的对象、结果或证据?

   回答:本 Step 不定义 phase / commit boundary,因此当前不适用。后续 `07-实施计划.md` 定义每个 phase / commit boundary 时,必须重新执行 phase boundary 复核,不得让某阶段依赖后续阶段才产出的 evidence、projection、outbox 或 handoff marker。

9. 哪些字段、状态、函数、用例或证据仍有旧名、口语名或别名漂移?

   回答:本轮已禁用旧版 `DraftIteration`、child WorkItem proposal / accepted / rejected、Project `Draft / Paused / Dissolved` 等旧口径。实现计划和代码必须使用 Step 6 / Step 8 / Step 10 的正式名称。

10. 哪些内容仍待确认,不能进入实施?

   回答:正式 `03` 已由 Step 19 回填并完成本轮审核收口;正式 `04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` 已按新版生成。目标实现仓尚未确认存在;生产 DB / MQ / HTTP framework 不在详细设计中锁死。这些不能由实现者自行补成设计契约。

11. 实施计划应该如何引用本文,而不是重复本文?

   回答:`07-实施计划.md` 应引用正式 `03` 章节和对应 `design-calibration` Step,把它们映射为 phase / commit boundary 的前置阅读、门禁和验证项;不得复制 Step 6 字段表、Step 8 协议表、Step 10 状态矩阵或 Step 16 测试清单。

### 5. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 1~16 | 中间产物数量多,实施者容易跳读 | 本 Step 给出承接清单和前置阅读清单 |
| 正式 `03-详细设计.md` | 已由 Step 19 重建并完成本轮审核收口 | 本 Step 明确正式移交前必须以正式 03 和后续 07 为开工真相源 |
| `07-实施计划.md` | 已按新版生成,phase / commit boundary 以正式 `07` 为准 | 本 Step 只保留详细设计承接输入,不覆盖正式实施计划 |
| 跨文档闭环 | 字段、DTO、Query、状态、phase、命名需要复核 | 本 Step 输出复核表 |
| 提交 / 注释规范 | 容易在实现仓被遗漏 | 本 Step 列为阻塞性前置阅读和检查项 |
| 配置 / 测试 / 验收 | 仍有独立文档职责 | 本 Step 标为后续文档输入,不替代它们 |

### 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 实施承接 | 分散在 Step 1~16 | 统一实施承接清单 | 方便 `07` 引用 |
| 阅读顺序 | 由实施者自行推断 | 列出阻塞性前置阅读 | 降低实现选边风险 |
| 跨文档复核 | 隐含在各 Step | 输出真相源、字段、DTO、Query、状态、phase、命名复核表 | 满足中间产物规范 §5.10 |
| 提交纪律 | 只在 Step 3 / 标准中出现 | Step 17 再次列为开工门禁 | 避免实现仓提交违规 |
| 与实施计划关系 | 容易写阶段和任务 | 明确不写排期、任务拆分、commit boundary | 保持文档职责 |

### 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 在 Step 17 写完整实施计划 | 一次性收口 | 越过 `07-实施计划.md` 职责 | 不采用 |
| 允许 `07` 复制对象 / 状态 / DTO 表 | `07` 自包含 | 会形成第二真相源 | 不采用 |
| `07` 只引用 `03` 和 calibration Step | 避免漂移 | 实施者需按阅读清单追溯 | 采用 |
| 跳过 Step 19 直接按旧 `03` 开工 | 快 | 旧文档与新版主线冲突 | 不采用 |
| 跳过正式 `03` 审核,只按中间产物正式开工 | 可提前实现 | 正式文档与校准来源尚未完成一致性审核 | 不采用;只允许做阅读准备 |
| phase boundary 在 Step 17 预定义 | 早收敛 | 属于实施计划 | 不采用 |

### 8. 结构化中间产物

#### 8.1 实施承接关系图

```text
00-需求文档
  -> 01-架构设计
  -> 02-概要设计
  -> 03-详细设计 Step 1~19 + 正式 03
  -> 07-实施计划
  -> /home/aris/Projects/quantalithos-work
```

关键说明:

- `03-详细设计` 输出实现契约。
- `07-实施计划` 输出执行顺序、代码批次、门禁和提交边界。
- `07` 必须引用 `03` 和 `design-calibration`,不得复制重写详细设计。
- 目标实现目录是 `/home/aris/Projects/quantalithos-work`,不是当前 design 仓。

#### 8.2 实施承接清单

| 承接项 | 已定义位置 | 实施者如何使用 |
|---|---|---|
| 上游输入边界 | Step 1 | 只承接新版 `00/01/02`,旧 `03` 只作诊断 |
| P0 / 非范围 | Step 2 | 控制 L1-work truth center 范围,不扩展到外部正文 / gateway / global observability |
| 编码、runtime、仓库约束 | Step 3 | 确认 Rust 2024、源码英文、`core-contracts` 唯一编译期依赖和提交规范 |
| Workspace 与文件布局 | Step 4 | 创建 `/home/aris/Projects/quantalithos-work` 和 7 个 workspace member |
| 模块实现契约 | Step 5 | 按 `contracts/domain/application/infra/api/worker/jobs` 组织职责和依赖方向 |
| 对象实现契约 | Step 6 | 实现 domain struct / enum / value object / policy / audit / outbox |
| Trait / Port / Adapter | Step 7 | 定义 application port 和 infra fake / adapter |
| API / Command / Query / Event / Job | Step 8 | 实现 DTO、route / topic / job name、response、error surface |
| 函数级处理流 | Step 9 | 还原每个 flow 的调用顺序、UoW、错误映射和副作用 |
| 状态机 | Step 10 | 实现 12 组正式状态机、合法转换和非法转换错误 |
| 持久化 / 事务 / 一致性 | Step 11 | 实现 repository、UoW、optimistic version、outbox / projection / reference recovery |
| 错误模型 / 恢复 | Step 12 | 实现错误枚举、retry / dead-letter / failed marker / no-write 口径 |
| 并发 / 幂等 / 重入 | Step 13 | 实现 idempotency key、canonical digest、duplicate replay、commit unknown audit |
| 配置 / 外部依赖 | Step 14 | 实现 `WorkRuntimeConfig`、runtime builder 和 adapter binding |
| 可观测性 / 审计 | Step 15 | 实现 structured logs、metrics、audit / trace / handoff marker 和 forbidden field guard |
| 测试切口 | Step 16 | 将最小测试切口映射为实施阶段门禁,完整展开交给测试方案 |

#### 8.3 实施前置阅读清单

| 文档 | 阅读目的 |
|---|---|
| `projects/L1-work/00-需求文档.md` | 理解 L1-work 需求、P0 闭环和非目标 |
| `projects/L1-work/01-架构设计.md` | 理解系统位置、依赖方向、通信方式和数据所有权 |
| `projects/L1-work/02-概要设计.md` | 理解代码主体骨架、主要组成部分、关键对象、接口、流程和状态机 |
| `projects/L1-work/design-calibration/03_ddd_calibration_flow.md` | 理解详细设计校准状态和 Step 文件位置 |
| `projects/L1-work/03-详细设计.md` | 作为审核后的正式详细设计入口 |
| `projects/L1-work/design-calibration/03_ddd_step_01_upstream_boundary.md` ~ `03_ddd_step_19_formal_document_assembly.md` | 追溯正式 `03` 的字段级实现契约、取舍和装配来源 |
| `projects/L0-core/00~07` | 理解 `core-contracts`、Actor / Metadata / Trace / Page / Event envelope 来源 |
| `standards/coding/rust.md` | 遵守 Rust 源码标识符、rustdoc、普通注释、测试名和错误处理规范 |
| `standards/document/子项目目录与代码文件组织规范.md` | 遵守实现仓、crate、binary、scripts、reports、artifacts 组织 |
| `standards/document/实施计划书写规范.md` | 编写 `07` 时遵守阶段、门禁、提交边界、commit message 和永久记忆种子规则 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 从全局依赖图中裁剪 L1-work 编译期、运行期、事件协作依赖 |
| `projects/README.md` §3.3 / §8.2 | 确认实施前门禁、git config、design / 实现仓提交语言差异 |

#### 8.4 实施前检查清单

| 检查项 | 要求 | 失败处理 |
|---|---|---|
| 目标实现仓 | `/home/aris/Projects/quantalithos-work` 存在或可创建 | 暂停实施并确认目录 |
| git config | `user.name=quantalithos-labs`;`user.email=quantalithos.ai@gmail.com` | 修正项目级 git config 后再提交 |
| Rust workspace | edition 2024;workspace member 为 `contracts/domain/application/infra/api/worker/jobs` | 不得按旧单 crate 或业务 crate 开工 |
| 唯一编译期依赖 | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | 不得复制 core 类型或引入 core 非 contracts crate |
| 非 core sibling repo | 不进入 Cargo dependency | 只能用 port / event / snapshot / handoff / fake |
| 源码语言 | 标识符、rustdoc、普通注释、测试名英文 | 发现中文源码注释则修正 |
| commit message | 实现仓英文;标题 `type(scope): subject`;AI footer 前空行 | 不符合则 amend 后提交 |
| 正式基线 | 正式 `03` 已由 Step 19 重建并完成本轮审核收口;以正式 `03` 和对应 calibration Step 为准 | `07` 生成前不得正式移交实现 |
| 永久记忆种子 | 由 `07-实施计划.md` §3 阅读清单生成,不得自行总结 | 缺失则暂停并补实施计划 |

#### 8.5 真相源表

| 设计事实 | 真相源文档 | 章节 / 中间产物 | 后续消费者 | 冲突处理 |
|---|---|---|---|---|
| 上游输入边界 | Step 1 | `03_ddd_step_01_upstream_boundary.md` | Step 19 / `07` | 与旧 `03` 冲突时以新版 `00/01/02` 和本轮 Step 为准 |
| 实现范围 | Step 2 | `03_ddd_step_02_scope.md` | `07` / 测试方案 | 不得由实现者扩大 P0 |
| 仓库 / 语言 / 依赖 | Step 3 / Step 4 / Step 14 | 约束、文件布局、配置绑定 | `07` / 实现仓 | 若目标仓现状冲突,暂停并回设计 |
| 对象 / 字段 | Step 6 | `03_ddd_step_06_object_contracts.md` | 实现 / 测试 / 验收 | Step 8 / 9 必须能构造,否则回 Step 6 |
| Port / Adapter | Step 7 | `03_ddd_step_07_trait_port_adapter_contracts.md` | application / infra | 不得由 infra 反向改 application trait |
| DTO / Event / Job | Step 8 | `03_ddd_step_08_protocol_contracts.md` | contracts / API / worker / jobs | 与 flow 冲突时回 Step 8 / 9 收敛 |
| 处理流 | Step 9 | `03_ddd_step_09_function_flows.md` | application / API / worker / jobs | 不得由实现者改调用顺序补字段 |
| 状态集合 | Step 10 | `03_ddd_step_10_state_matrix.md` | domain / tests / acceptance | 禁止旧状态名 |
| 事务 / 错误 / 幂等 | Step 11~13 | `03_ddd_step_11*` ~ `13*` | application / infra / tests | 冲突时优先保持 no-write / rollback / idempotency 口径 |
| 配置 / 观测 / 测试 | Step 14~16 | `03_ddd_step_14*` ~ `16*` | infra / tests / `07` | 细节不足进入后续配置 / 测试方案,不得脑补 |

#### 8.6 字段闭环表

| Domain 对象 | 字段 | 类型 | 字段来源 | 构造入口 | DTO / Event 字段 | 缺失处理 | 测试覆盖 | 验收证据 |
|---|---|---|---|---|---|---|---|---|
| `Project` | `project_id` | `ProjectId` | 系统生成 | `Project::create(...)` | generated | generator failed -> reject | `CreateProject_contract` | 后续 `06` |
| `Project` | `owner_ref` | `ProjectOwnerRef` | Command body | `Project::create(...)` | `CreateProjectRequest.project_spec.owner_ref` | reject | `CreateProject_contract` | 后续 `06` |
| `Backlog` | `backlog_id` / `project_ref` | `BacklogId` / `ProjectRef` | 系统生成 / created project | `Backlog::open_for_project(...)` | generated / derived | generator failed -> reject | `CreateProject_contract` | 后续 `06` |
| `ProjectMember` | `member_ref` / `responsibility_spec` | `GlobalMemberRef` / `ProjectResponsibilitySpec` | Command body + resolver | `ProjectMember::assign(...)` | `AssignProjectMemberRequest.*` | resolver unresolved -> reject | `AssignProjectMember_contract` | 后续 `06` |
| `WorkItem` / `ChildWorkItem` | `work_intent` / `source_ref` | `FormalWorkIntent` / `SourceWorkRef` | Command body + resolver | `WorkItem::formalize(...)` | `CreateWorkItemRequest.*` | source unresolved -> reject | `CreateWorkItem_contract` | 后续 `06` |
| `PromoteResult` | `source_ref` / `reason` | `SourceWorkRef` / `PromoteReason` | Command / Event | `PromoteResult::request(...)` | `RequestWorkPromotionRequest.*` / runtime event | reject / dead-letter | `RequestWorkPromotion_contract` | 后续 `06` |
| `WorkDependency` / `WorkBlocker` | relation / cause / evidence refs | typed refs | Command body + resolver | dependency / blocker factory | dependency / blocker requests | graph cycle / unresolved -> reject | dependency / blocker contract tests | 后续 `06` |
| `Iteration` / `IterationCommitment` | `timebox_ref` / `changed_work_refs` | refs | Command body + process resolver / repo lookup | iteration factory / commitment factory | iteration requests | unresolved / version conflict | iteration contract tests | 后续 `06` |
| `WorkTraceRecord` | `trace_id` / `trace_context_ref` | `WorkTraceId` / `WorkTraceContextRef` | id generator / core metadata | `from_truth_change(...)` | metadata | missing metadata -> reject | `domain_audit_outbox_records` | 后续 `06` |
| `WorkOutboxRecord` | `outbox_id` / `event_kind` | `WorkOutboxId` / `WorkOutboxEventKind` | id generator / truth change | `from_truth_change(...)` | generated / derived | generator failed -> reject | `accepted_truth_and_outbox_same_uow` | 后续 `06` |

#### 8.7 DTO / Event / Job 到 Domain 对象构造闭环表

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 | 关联处理流 |
|---|---|---|---|---|---|---|
| 18 个 Command | 对应 Project / Member / Work / Promote / Dependency / Blocker / Iteration truth | 是 | id generator、clock、repository lookup、resolver | command idempotency key != business id | reject / not found / resolver reject | Step 9 Command flows |
| 7 个 Inbound Event | snapshot / reference state / pending intake | 是 | source event envelope、clock、resolver | source_event_id != WorkOutboxId | retry / dead-letter / unresolved marker | Step 9 Consumer flows |
| 9 个 Outbound Event | event payload from `WorkOutboxRecord` + committed truth | 是 | outbox record、truth repository、trace context、clock | bus event id != WorkOutboxId | mark publish failed | Step 9 Outbound flows |
| 6 个 Operations Job | projection / reference / outbox / handoff marker / report | 是 | job metadata、repository page、port result | job_run_id != idempotency key | reject / report failed / retry | Step 9 Job flows |

#### 8.8 Query response / view 闭环表

| Query | Response DTO / View | 字段来源 | empty / not visible / degraded 口径 | public id/ref 规则 | 测试覆盖 |
|---|---|---|---|---|---|
| `GetProjectWorkFacts` | `ProjectWorkFactsView` | truth repositories | missing / not visible | `ProjectRef` from request | `GetProjectWorkFacts_contract` |
| `GetBacklog` | `BacklogView` | `BacklogRepository` + `WorkItemRepository` | empty page / missing | `ProjectRef` / page metadata | `GetBacklog_contract` |
| `GetWorkItem` | `WorkItemView` | `WorkItemRepository` | not found / not visible | `FormalWorkRef` | `GetWorkItem_contract` |
| `ListMemberWork` | `MemberWorkView` | projection repository | stale / rebuilding / failed surface | `ProjectMemberRef` | `ListMemberWork_contract` |
| `GetIterationSummary` | `IterationSummaryView` | projection + iteration truth | missing / stale | `IterationRef` | `GetIterationSummary_contract` |
| `SearchWork` | `WorkSearchResult` | projection search | failed surface / empty page | `ProjectRef` + public page | `SearchWork_contract` |
| `GetWorkTrace` | `WorkTraceView` | `AuditRepository.list_trace_records` | empty / not visible | `WorkTraceSubjectRef` | `GetWorkTrace_contract` |
| `GetProjectBoardView` | `ProjectBoardView` | projection repository | missing -> rebuilding / missing | `ProjectRef` / `DerivedWorkViewRef` | `GetProjectBoardView_contract` |

#### 8.9 状态闭环表

| 状态枚举 | 正式状态值 | 产生函数 | 合法迁移 | 禁止迁移 | 测试用例 | 验收证据 |
|---|---|---|---|---|---|---|
| `ProjectLifecycleState` | `Active / ReadOnly / Closed / Archived` | project lifecycle methods | Active -> ReadOnly -> Closed -> Archived | Archived -> Active | `project_lifecycle_transitions` | 后续 `06` |
| `ProjectMemberResponsibilityState` | `Proposed / Active / Paused / Released` | member responsibility methods | Proposed -> Active <-> Paused -> Released | Released -> Active | `member_responsibility_transitions` | 后续 `06` |
| `BacklogState` | `Open / LockedForMaintenance / Archived` | backlog methods | Open <-> LockedForMaintenance -> Archived | Archived -> Open | `backlog_state_transitions` | 后续 `06` |
| `WorkItemState` | `Formalized / Committed / InProgress / Completed / Cancelled / Superseded` | work lifecycle methods | Formalized -> Committed -> InProgress -> Completed | terminal -> active | `work_item_state_transitions` | 后续 `06` |
| `PromoteResultState` | `PendingReview / Accepted / Rejected / Superseded` | promote review methods | PendingReview -> Accepted / Rejected -> Superseded | Superseded -> Accepted | `promote_result_transitions` | 后续 `06` |
| `DependencyState` | `Proposed / Active / Satisfied / Waived / Cancelled` | dependency methods | Proposed -> Active -> terminal | terminal reopen | `dependency_state_transitions` | 后续 `06` |
| `BlockerState` | `Open / Mitigating / Resolved / Closed` | blocker methods | Open -> Mitigating -> Resolved -> Closed | Closed -> Open | `blocker_state_transitions` | 后续 `06` |
| `IterationState` | `Planning / Committed / InProgress / Closed / Cancelled` | iteration methods | Planning -> Committed -> InProgress -> Closed | Closed -> InProgress | `iteration_state_transitions` | 后续 `06` |
| `CommitmentState` | `Candidate / Committed / Changed / Closed` | commitment methods | Candidate -> Committed -> Changed -> Closed | Closed -> Changed | `commitment_state_transitions` | 后续 `06` |
| `DerivedFreshnessState` | `Fresh / Stale / Rebuilding / Failed` | projection service | Fresh -> Stale -> Rebuilding -> Fresh / Failed | Query repairs fresh | `derived_freshness_transitions` | 后续 `06` |
| `ReferenceResolutionStatus` | `Unresolved / Resolved / Stale / Failed` | reference refresh | Unresolved -> Resolved -> Stale -> Resolved | failed drops last good snapshot | `reference_resolution_transitions` | 后续 `06` |
| `OutboxPublicationState` | `Pending / Published / Failed` | publish job | Pending -> Published / Failed -> Pending | Published -> Pending | `outbox_publication_transitions` | 后续 `06` |

#### 8.10 Phase / commit boundary 闭环表

| Phase / commit boundary | 包含内容 | 明确排除 | 依赖前置 | 不得依赖后续 | 测试范围 | 验收范围 |
|---|---|---|---|---|---|---|
| 待 `07-实施计划.md` 定义 | 不在 Step 17 定义 | 不写排期、任务拆分、commit boundary | Step 1~19 + 正式 `03` | 不得使用未来 phase 才生成的 evidence / projection / handoff marker | Step 16 映射 | 后续 `06` |

#### 8.11 命名一致性表

| 名称类型 | 正式名称 | 禁用旧名 / 口语名 | 出现位置 | 修正要求 |
|---|---|---|---|---|
| 实现仓 | `quantalithos-work` | `L1-work`、`work-service`、`quantalithos-l1-work` | Step 3 / Step 4 | 代码仓和 package 不带架构层级 |
| Workspace member | `contracts/domain/application/infra/api/worker/jobs` | `common`、`utils`、`service` 泛名 | Step 4 / Step 5 | 按 role 目录实现 |
| 编译期依赖 | `core-contracts` | `core-domain`、`core-application`、复制 core 类型 | Step 3 / Step 14 | 只依赖 contracts crate |
| Project 状态 | `Active / ReadOnly / Closed / Archived` | `Draft / Paused / Dissolved` | Step 10 | 禁止旧详细设计状态 |
| WorkItem 状态 | `Formalized / Committed / InProgress / Completed / Cancelled / Superseded` | child proposal / accepted / rejected | Step 10 | 使用 formal work 主线 |
| Iteration 状态 | `Planning / Committed / InProgress / Closed / Cancelled` | `DraftIteration` | Step 10 | 禁止旧 iteration 口径 |
| Query surface | `Missing / Empty / NotVisible / Stale / Rebuilding / Failed` | query 自动 rebuild / repair | Step 8 / Step 12 | Query no-write |

#### 8.12 冲突与修正表

| 冲突 ID | 冲突位置 | 冲突类型 | 影响范围 | 推荐修正 | 处理状态 |
|---|---|---|---|---|---|
| `DDD17-ISSUE-001` | 正式 `03-详细设计.md` 已由 Step 19 重建 | 已关闭事项 | 实现者需要以正式 03 作为唯一详细设计真相源 | 本轮已完成正式 `03` 与 calibration 一致性审核;后续 `07` 引用正式 `03` 和 calibration | 已重建并审核收口 |
| `DDD17-ISSUE-002` | `05/06/07` 已按新版重建 | 已关闭事项 | 测试 / 验收 / 实施使用正式 `05` / `06` / `07` | 保持正式文档为真相源;calibration 只作追溯来源 | 已关闭 |
| `DDD17-ISSUE-003` | 实现仓不存在 | 实施前置缺口 | 无法开始代码提交 | `07` PH-01 前置确认创建 `/home/aris/Projects/quantalithos-work` | 待 PH-01 |

### 9. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_17_implementation_handoff.md`
>
> 延伸阅读:
> - 建议继续阅读本中间产物的“实施承接清单”“实施前置阅读清单”“实施前检查清单”“跨文档一致性复核表”和“冲突与修正表”小节。

#### 5.16 详细设计到实施计划的承接清单

L1-work 详细设计已经把实现所需的上游边界、P0 范围、Rust workspace、七模块主轴、对象、port、协议、处理流、状态机、事务、错误、幂等、配置、观测和测试切口收口为 Step 1~18 中间产物,并由 Step 19 重建正式 `03-详细设计.md`。本轮已完成正式 `03` 与 calibration 来源的一致性审核。正式 `07-实施计划.md` 已生成 phase / commit boundary 和开工门禁;实现移交以正式 `03` 和正式 `07` 为主,本 Step 仅作追溯来源。

`07-实施计划.md` 应只引用正式 `03` 章节和对应 `design-calibration` Step,将其转译为 phase / commit boundary、门禁和前置阅读矩阵。实施计划不得复制重写对象字段、DTO schema、状态矩阵或测试切口,否则会形成第二真相源。

实施者开工前必须阅读 Rust 编码规范、目录组织规范、实施计划书写规范和项目提交规范,并确认目标实现仓 git config、源码英文、实现仓英文 commit、唯一编译期依赖 `core-contracts`、非 core sibling repo 不进 Cargo dependency 等门禁。

### 10. 待确认事项

| 编号 | 待确认项 | 当前口径 | 影响 |
|---|---|---|---|
| DDD17-OPEN-001 | 目标实现仓当前未确认存在 | `/home/aris/Projects/quantalithos-work` 是目标路径;正式 `07` 已把创建 / 确认放入 PH-01 | 实施 PH-01 前置门禁 |
| DDD17-OPEN-002 | P0 之外的生产化配置、真实依赖和运维产品未选型 | 正式 `04` / `05` / `06` / `07` 均按 P0 fake / in-memory / controlled seam 收口 | 不阻塞 P0,阻塞 P1/P2 真实集成和生产化 |

### 11. 进入下一步条件

- [x] 实施承接清单覆盖 Step 1~16 的实现契约。
- [x] 实施前置阅读清单包含上游设计、中间产物、Rust 编码规范、目录组织规范、实施计划规范和提交规范。
- [x] git config、commit message、源码英文、rustdoc / 注释规范已列为前置门禁。
- [x] 字段闭环、DTO / Event / Job 构造闭环、Query response 闭环、状态闭环、phase boundary、命名一致性已完成初步复核。
- [x] 未闭合事项已进入待确认事项,未交给实施者自行取舍。
- [x] 未写开发排期、任务拆分或 commit boundary。
