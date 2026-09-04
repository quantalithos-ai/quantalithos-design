# 03-详细设计 Step 17：详细设计到实施计划承接

> 项目：`L2-member-service`
> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 17
> 书写规范：`standards/document/详细设计书写规范.md` §5.16
> 实施计划规范：`standards/document/实施计划书写规范.md`
> 参考粒度：`projects/L1-governance/design-calibration/03_ddd_step_17_implementation_handoff.md`
> 目标正式文档：`projects/L2-member-service/03-详细设计.md`
> 校准日期：2026-09-02

## 1. Step 状态、目标与边界

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 17：详细设计到实施计划承接 |
| 当前状态 | completed / pass_with_upstream_blockers |
| 输入 | Step 1~16 校准材料、正式 `00/01/02`、Rust / 目录 / 真相源标准 |
| 输出 | 给后续 `07-实施计划.md` 的承接清单、前置阅读清单和闭环预复核 |
| 正式正文 | Step 19 前仍不写入；本步不替代正式 `03` |
| 本步禁止 | 不写开发排期、任务拆分、phase、commit boundary、测试用例编号、验收 evidence、实现仓事实或 readiness |

本步只回答“详细设计哪些结论可以被 `07` 引用、实现者开工前必须读取什么、哪些闭环仍不能交给实现者自行取舍”。它不把 `pass_with_upstream_blockers` 改写为 ready，也不为 Runtime、Member、Images、Sandbox、Core、Bus、SDK 或观测后端补合同。

## 2. 输入基线与实施承接上限

| 输入 | 已形成的承接结论 | 仍未闭合的上限 |
|---|---|---|
| `03_ddd_step_01_input_boundary.md` | 新版 `00/01/02` 是唯一正向输入，旧 `03` 只作污染诊断 | 旧对象、旧产品和旧执行主线不得开工 |
| `03_ddd_step_02_scope.md` | 项目型 `ProjectMemberRef` 为唯一执行主语，`GlobalMemberRef` 为身份锚；Host Truth 控制面为范围 | 不实现 L1/L2/L4 sibling truth |
| `03_ddd_step_03_runtime_constraints.md` | Rust 2024 planned、多 crate workspace、源码英文、compile/runtime/event/ref/adapter/fake 分类 | 实际 toolchain、SDK target 和实现仓仍需开工前确认 |
| `03_ddd_step_04_module_layout.md` | planned `quantalithos-member-service`，七个实现单元和文件 owner 已固定 | 当前未创建实现仓、Cargo 文件或源码 |
| `03_ddd_step_05_module_contracts.md` | `contracts -> domain -> application -> infra -> api -> worker -> jobs` 依赖主轴 | 不增设 `common`、`manager`、`execution` 等第八业务模块 |
| `03_ddd_step_06_object_contracts.md` | 29 个冻结业务对象、字段来源、factory、transition、状态和禁止替代已分配 owner | exact sibling mapper、cursor type 和产品适配仍 pending |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | application-only port、infra adapter、fake parity、UoW / clock / id / result seam 已命名 | trait 的 exact upstream payload、产品和 transport 类型待闭合 |
| `03_ddd_step_08_protocol_contracts.md` | 实际协议分母固定为 10 Command、6 Query、5 Consumer、1 material helper、7 Job | Core/Bus envelope、route、receipt 和 sibling exact DTO 仍 placeholder |
| `03_ddd_step_09_function_flows.md` | validate -> reserve -> load -> domain -> save -> materialize -> result -> commit 顺序已固定 | 外部正向结果不可由本地 receipt 或 fake 推导 |
| `03_ddd_step_10_state_machine.md` | 正交状态轴、合法 / 非法迁移和禁止跨轴推导已固定 | Runtime / Member / Sandbox positive transition 仍 blocked |
| `03_ddd_step_11_persistence_tx_consistency.md` | logical store owner、UoW 写集、expected revision、append-only、outbox snapshot、projection non-source 已固定 | durable product、DDL、cursor exact type 未定 |
| `03_ddd_step_12_errors_recovery.md` | layered error、stable disposition、rollback、unknown、gap、hold / reconcile 口径已固定 | transport numeric code、DLQ / diagnostic product 未定 |
| `03_ddd_step_13_concurrency_idempotency.md` | namespace、canonical digest、duplicate replay、generation/effect/publication/handoff fence 已固定 | lease / lock product、hash / retention 数值未定 |
| `03_ddd_step_14_config_dependencies.md` | typed config binding、builder 顺序和依赖分类已固定 | key、默认值、secret、endpoint 留给 `04` |
| `03_ddd_step_15_observability_audit.md` | safe log、低基数 metric、refs-only audit、trace 传播和 redaction baseline 已固定 | backend、SLO、采样和保留期未定 |
| `03_ddd_step_16_test_cut.md` | 七模块、10/6/5/1/7 协议、状态、一致性、错误、配置和观测测试入口已固定 | 不声称测试已执行或有 evidence |

## 3. SOP 问题回答

| 问题 | 本仓结论 |
|---|---|
| 哪些实现契约足够进入实施计划？ | Step 1~16 已足够作为 `07` 的引用输入：七模块职责、29 对象、ports / adapters、10/6/5/1/7 协议、函数顺序、状态、UoW、错误、幂等、配置、观测和最小 test cut 均有唯一校准来源。它们尚不足以证明真实外部合同或实现仓 ready。 |
| 实施者需要先阅读哪些文档？ | 必须先读本仓正式 `00/01/02`、Step 1~19 校准链（Step 19 后再读正式 `03`）、后续正式 `04/05/06/07`、适用 standards、实现仓 README 和真相源标准。 |
| 提交规范、git config、Rust 编码和注释规范是否列入？ | 已列入 §6。实现仓开工前须核对 `user.name=quantalithos-labs`、`user.email=quantalithos.ai@gmail.com`；实现仓 commit 标题和 body 使用英文，标题为 `type(scope): subject`；源码标识符、rustdoc、普通注释和测试名默认英文。 |
| Domain 必填字段能否回指来源？ | 预复核通过：字段可回指 Step 8 DTO / Consumer / Job、Step 9 flow、Step 7 reader / port、Step 11 rehydrate / cursor / store 或 application 的 clock / id generator。若实现仓实际字段不能回指，必须暂停并回写 Step 6~9。 |
| 每个 Command / Event / Job 能否构造目标对象？ | 10 Command、5 Consumer、1 material helper、7 Job 均有目标对象、local marker、attempt、receipt 或 report surface；缺失按 reject、blocked、delayed、unknown、gap、partial、failed 或 no-write 处理，不由实现者补字段。 |
| Query response / page / marker 是否闭合？ | 6 Query 均有 `SafeHostView`、safe slice、page、freshness、visibility 或 unavailable surface；Query 不 reserve、refresh、repair、rebuild、append 或反写。page cursor 不得充当 revision 或 source cursor。 |
| 状态、测试、验收是否共用正式名称？ | Step 10 的正式状态名是唯一口径，Step 16 已逐轴建立切口；后续 `05/06/07` 必须引用这些名称，不得继承旧 `03/05/06` 的口语状态。 |
| 是否误把后续 phase 才有的对象写进当前边界？ | 本步不定义 phase 或 commit boundary。外部 feedback、durable 产品、真实 adapter、报告、evidence、signoff 和 readiness 均保持后续门禁，不进入当前实施承接契约。 |
| 哪些旧名或别名仍需防漂移？ | 禁止恢复 `MemberRuntimeSession`、`WorkerSlot`、`CapabilityMount`、`ExecutionHandle`、`GovernanceRequest`、直接 `ExecuteRuntimeAction` 等历史名。`HostChangeCursor` / `CommittedChangeCursor` exact type 仍是单一 pending 项，不得创建 alias 或第三种 cursor。 |
| 哪些事项不能进入实施？ | `MSVC-UP-001~008`、Core/Bus exact envelope、Member/Runtime/Images/Sandbox mapper、cursor exact type、durable store / broker / diagnostic backend、目标实现仓和 `04/05/06/07` 下游同步未闭合前，不得声称真实实现可交付。 |
| `07` 如何引用本文？ | `07` 只引用正式 `03` 章节和本 Step 的复核表，不复制对象、DTO、状态或测试表；每个实施 boundary 仍须按正式 `03/05/06/07` 重做闭环审计。 |
| 本文是否给 `07` 足够的审计输入？ | 足够作为预复核输入，但不是最终实现移交结论。`07` 仍需在各 phase / commit boundary 检查字段、DTO、state、port、outbox、projection、job、测试和验收映射。 |

## 4. 实施承接清单

| 承接项 | 已定义位置 | 实施者如何使用 | 当前限制 |
|---|---|---|---|
| 上游与历史纪律 | Step 1；正式 `00/01/02` | 只读取新版正式文档；旧 `03` 仅用于差异和污染扫描 | 不得按旧正文开工 |
| 实现范围与非范围 | Step 2 | 以 Host Truth 控制面和项目型双锚约束实现范围 | 不复制 Member / Runtime / Tools / Images / Sandbox truth |
| Rust、仓库与依赖 | Step 3 | 先确认 Rust 2024 / MSRV、英文源码、依赖类别和 git 身份 | 实际 toolchain / SDK target pending |
| workspace 与文件布局 | Step 4 | 按七个 planned crate / binary 组织源码和测试 | `/home/aris/Projects/quantalithos-member-service` 当前未确认存在 |
| 模块职责与依赖方向 | Step 5 | 遵循 `contracts -> domain -> application -> infra -> api/worker/jobs` | domain 不反向依赖 infra 或 sibling client |
| 29 个对象与字段 | Step 6 | 先读对象卡，再实现 field / factory / transition / invariant | 支持值不升级为第 30 个业务对象 |
| Port / adapter / fake | Step 7 | application 定义 seam，infra 实现 adapter 与 fake parity | exact external body / product API pending |
| Public protocol | Step 8 | 实现 10 Command、6 Query、5 Consumer、material helper、7 Job 的 DTO / result / receipt | 不把 placeholder 写成 positive ready |
| 函数处理顺序 | Step 9 | 固定 validation、idempotency、read、domain、UoW、sidecar、result、commit 顺序 | Query no-write、Job no-authorization 不可配置化 |
| 状态与禁止迁移 | Step 10 | 用正式 enum 和 transition guard，不添加万能 `HostStatus` | external status 不映射为本地 ready / healthy |
| 持久化与一致性 | Step 11 | 按 logical store owner、expected revision、same-UoW 和 immutable snapshot 实现 | 不锁定数据库、DDL 或 broker |
| 错误与恢复 | Step 12 | 保留 reject / blocked / delayed / unknown / gap / manual recovery 的稳定 disposition | timeout、receipt、adapter `Ok` 不得变成完成 |
| 并发与幂等 | Step 13 | 使用 operation namespace、digest、原 key、generation / effect / handoff fence | 不以新 key 绕过 unknown 或冲突 |
| 配置与依赖 | Step 14 | 依赖 typed config binding 和 builder validation；mandatory boundary 不得被 config 关闭 | 完整 key / 默认值在 `04` |
| 观测与审计 | Step 15 | 输出安全字段、refs-only audit、低基数 metric、trace propagation 和 redaction guard | backend / SLO / retention pending |
| 测试入口 | Step 16 | 将最小 test cut 转入后续 `05/07` 门禁 | 不将切口写成执行结果 |

## 5. 跨文档闭环预复核

| 复核项 | 设计位置 | 下游位置 | 预复核结论 | 未关闭问题 |
|---|---|---|---|---|
| 字段闭环 | Step 6、7、8、11、14 | `04/05/06/07` | pass_with_upstream_blockers | sibling exact mapper、cursor、config concrete values |
| DTO / Consumer / Job 构造闭环 | Step 8、9、12 | `05/06/07` | pass_with_upstream_blockers | Core/Bus envelope、Member/Runtime/Images/Sandbox payload |
| Query view / page / marker | Step 6、8、9、11 | `05/06/07` | pass | `HostChangeCursor` / `CommittedChangeCursor` exact type、projection product |
| 状态闭环 | Step 6、10 | `05/06/07` | pass_with_upstream_blockers | external positive feedback 仍 pending |
| 处理流闭环 | Step 9、11、12 | `05/06/07` | pass_with_upstream_blockers | durable commit proof、transport error code |
| metadata / idempotency | Step 8、13 | `05/06/07` | pass_with_upstream_blockers | durable reservation / stored result product |
| projection rebuild / materialization | Step 6、9、11、16 | `05/06/07` | pass_with_upstream_blockers | source cursor exact type、diagnostic store、backend |
| phase boundary | 本 Step 及后续 `07` | `07` | 本 Step 只预复核，不定义 boundary | 07 必须按每个 boundary 重做，不得由实现者自行分期 |
| artifact / evidence | Step 16 仅定义脚本契约 | `05/06/07` | 未生成、未验证 | 不得伪造 run_id、artifact、report、evidence、verdict、signoff、readiness |

### 5.1 真相源与引用原则

| 设计事实 | 唯一真相源 | 下游引用规则 |
|---|---|---|
| 主语 / owner / 非范围 | 正式 `00/01/02`、Step 1~2 | 冲突时回退上游，不在实现侧解释 |
| 模块 / 文件 owner | Step 4~5 | Cargo / 文件布局只能按此落位 |
| 对象 / 字段 / factory / state | Step 6、10 | 不从旧 `03` 或 DTO 名称反向猜测 |
| Port / adapter / error | Step 7、12、14 | adapter 不改 application trait，不暴露外部正文 |
| Protocol / result / view | Step 8、9 | exact transport 未闭合时保留 placeholder |
| persistence / cursor / replay | Step 11、13 | 不把 revision、cursor、offset、generation 互换 |
| logs / metrics / audit | Step 15 | 观测记录不新增业务 truth owner |
| test cut | Step 16 | `05/06/07` 负责完整用例、验收和执行证据 |

## 6. 实施前置阅读与工程检查

### 6.1 必读材料

| 文档 | 阅读目的 |
|---|---|
| `projects/L2-member-service/00-需求文档.md` | 项目型成员宿主范围、需求红线和非目标 |
| `projects/L2-member-service/01-架构设计.md` | Host Truth Center、owner、依赖方向和通信边界 |
| `projects/L2-member-service/02-概要设计.md` | 七 CMP、29 对象、IB skeleton、流族和状态骨架 |
| `projects/L2-member-service/design-calibration/03_ddd_calibration_flow.md` | Step 门禁、full-restart 和 pending 纪律 |
| `03_ddd_step_01_input_boundary.md` ~ `03_ddd_step_19_formal_document_assembly.md` | 字段、协议、flow、state、transaction、error、config、observability、test 和装配来源 |
| `projects/L2-member-service/03-详细设计.md` | 仅在 Step 19 完成后作为正式实现入口；正式生成前不得按旧稿开工 |
| 后续正式 `04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` | 配置、测试、验收和实施 boundary 的下游门禁 |
| `standards/coding/rust.md` | Rust 命名、所有权、错误、rustdoc、格式和安全实践 |
| `standards/document/子项目目录与代码文件组织规范.md` | workspace、crate、package、binary、文件和目录命名 |
| `standards/document/实施计划书写规范.md` | 后续 `07` 的阶段、commit、测试、证据和台账规则 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 字段、DTO、状态、metadata、idempotency、projection、materialization 和交付审计 |
| `projects/README.md` §1.1、§8.2 | design 仓与实现仓边界、提交语言和质量门禁 |

### 6.2 工程身份、源码和注释规则

| 检查项 | 实施仓要求 | 失败处理 |
|---|---|---|
| 目标实现仓 | 仅在确认 `/home/aris/Projects/quantalithos-member-service` 后创建或写入 | 暂停，不在 design 仓实现 |
| git identity | `git config user.name` 为 `quantalithos-labs`；`git config user.email` 为 `quantalithos.ai@gmail.com` | 修正项目级 config 后才允许提交 |
| commit 标题 | 英文 `type(scope): subject` | 退回重写 |
| commit body | 英文、按子功能分组，使用真实空行；footer 前有真实空行；需要精确控制时使用 `git commit -F` / `--amend -F` | 不进入 Commit Gate |
| Rust 标识符 | 类型 `UpperCamelCase`，函数 / 变量 / 模块 `snake_case`，crate / package 遵循 Step 4 | 命名偏离即暂停 |
| rustdoc | 所有公开 module、struct、field、enum、variant、trait、函数和 type alias 使用英文 `///`；载荷 variant 说明来源、敏感性和错误语义 | 缺失即返工 |
| 普通注释 / 测试名 | 默认英文；不得把中文标题直接复制进源码 | Review 失败 |
| 依赖 | 仅允许已确认 compile seam；运行期协作通过 port / adapter / event / ref / fake | 不得新增 sibling path dependency |

## 7. 未进入实施的事项

以下事项故意不进入本 Step 的实施承接契约，必须留在 Step 18 / Step 19 或后续文档门禁中：

- Runtime entry、Host Session、execution handoff 的 exact mapper、route、outcome 和 feedback；
- Member launch / register / heartbeat / status 的 exact DTO、credential owner、IPC / transport；
- Images pinned manifest / digest / provenance / verification 的 exact consumption contract；
- Sandbox bind / release / cleanup 的 backend、policy、reaper 和 external completion truth；
- Core / Bus schema、envelope、route、receipt、delivery / observed / accepted feedback；
- `HostChangeCursor` / `CommittedChangeCursor` 的 exact type、序列化与跨仓兼容；
- durable store、broker、HTTP/RPC、DLQ、diagnostic store、observability backend 的产品选择；
- 完整配置 key、默认值、secret、endpoint、热更新和部署挂载；
- 完整测试用例、覆盖率、验收 evidence、report、verdict、signoff、readiness；
- 目标实现仓创建、源码、Cargo、实现台账、phase、commit、run_id 和交付时间。

## 8. 正反例与暂停规则

| 场景 | 正确承接 | 错误承接 |
|---|---|---|
| 上游 Member 合同未闭合 | 使用 safe registration ref、blocked / waiting、fake seam | 复制 Member request body 或声称 registration ready |
| Runtime association 未闭合 | 保留 placeholder、unknown、host-side local shell | 创建 Runtime run / turn / outcome |
| Images / Sandbox 输入缺失 | qualification gap、fail-closed、不可 Ready | 用缓存、timeout、fake 或默认值放行 |
| publisher 返回 receipt | 保存 local submitted / unknown marker | 推导 delivered / observed / accepted |
| Query 读模型过期 | 返回 stale / degraded / unavailable | Query 内 refresh、repair 或反写 source |
| Job 发现待处理 work | 推进已提交 attempt / marker，产生 item report | Job 创建 intent、decision、authorization 或 generation |
| stored result 缺失 | 返回 consistency error / manual recovery marker | 从 current truth 重算并覆盖 replay |
| phase / commit boundary 不清 | 暂停并由 `07` 回写设计 | 实现者自行拆分并提交 |

## 9. Gate 与下一步

| 检查项 | 结果 | 说明 |
|---|---|---|
| Step 1~16 均有可引用输出 | pass | 每个 Step 独立文件存在且已完成 |
| 10/6/5/1/7 协议分母已固定 | pass | 以 Step 8、16 为准，不继承兄弟项目数量 |
| 字段、DTO、Query view/page、状态闭环已预复核 | pass_with_upstream_blockers | exact upstream / cursor / durable details 仍 pending |
| Rust / git / comment 前置规则已列入 | pass | §6 |
| phase / commit 未被本步伪造 | pass | 后续 `07` 负责 |
| 实现事实、测试结果、artifact、evidence、readiness 未被伪造 | pass | 本文件仅为承接清单 |
| 上游 blocker 仍保持显式状态 | pass_with_upstream_blockers | `MSVC-UP-001~008`、cursor、Core/Bus、产品与 backend 均 pending / blocked |

```text
step_17_status = completed
step_17_gate = pass_with_upstream_blockers
formal_03_write_allowed = false_until_step_19
next_allowed_step = Step 18 risks_open_questions
```
