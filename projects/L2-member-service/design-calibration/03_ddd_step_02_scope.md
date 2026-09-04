# 03-详细设计 Step 2：明确本轮实现范围和非范围

> 项目：`L2-member-service`
> 对应 SOP：`详细设计讨论流程_SOP.md` Step 2
> 状态：completed
> Gate：pass_with_upstream_blockers
> 日期：2026-08-25

## 1. 本步输入与门禁

| 输入 | 结论 |
|---|---|
| Step 1 上游关系映射 | 已明确 00/01/02 的承接和不能重定义项 |
| `02-概要设计.md` §2、§5~§12 | 已冻结七个 CMP、29 对象、17 接口、流族、状态与配置影响 |
| `02_hld_step_12_detailed_design_handoff.md` | 已给出 03 的字段 / 函数 / UoW / port / schema / test ceiling |
| `02_hld_step_13_risks_open_questions.md` | `MSVC-UP-001~008` 仍 pending / blocked / waiting |

本步只裁决详细设计的实现契约范围，不定义开发排期、phase / commit boundary、配置 key、测试结果或新的业务主语。

## 2. SOP 问题回答

### 2.1 本轮详细设计必须覆盖什么

本轮覆盖从显式项目型宿主意图到安全事实消费的本地实现契约闭环：

```text
intent acceptance
  -> orchestration decision
  -> required qualification / assembly / readiness
  -> generation / host progression / local action attempt
  -> registration / endpoint / Host Session shell
  -> signal / health assessment / explicit recovery decision
  -> closure / cleanup attempt / residual / reconciliation
  -> body-free material / history / outbox / handoff / safe projection / query
```

覆盖范围必须始终以 Host Truth 和 control plane 为中心；外部动作只通过 typed port、attempt、safe outcome、gap 或 placeholder 交接。

### 2.2 本轮必须定义哪些实现契约

| 契约类别 | 本轮必须收稳的内容 | 允许的未闭合形态 |
|---|---|---|
| 实现单元 | workspace / crate / module / file 的 planned layout 和依赖方向 | 实现仓不存在时标 `planned`，不写“已创建” |
| Domain 对象 | 29 个对象的字段、来源、构造、transition、revision、invariant | 跨仓字段用 typed ref / safe summary / placeholder |
| Application | 17 个接口的 use-case mapping、读集、写集、UoW 和 result | exact external contract pending 时保留 blocked result |
| Ports / Adapters | repository、UoW、resolver、carrier、session、binding、publisher、handoff、clock / id | neutral trait、fake / placeholder；不写产品 API |
| Public protocol | Command / Query / Consumer / Event / Job DTO、result、receipt、error、view | Core / Bus / sibling schema 未闭口时只写类别和缺口 |
| Function flow | 七条流族中每条 public / job / feedback path 的函数级顺序 | 不越过 owner，不伪造 external completion |
| State | 正交状态轴、迁移 guard、CAS、late / unknown / gap / residual | 不新增全局 `HostStatus` |
| Persistence | repository capability、存储字段族、唯一键、版本、事务边界、outbox / projection 关系 | 不锁数据库产品、DDL 或部署方式 |
| Errors / recovery | 28 个异常的代码分类、映射和恢复口径 | unknown / blocked / waiting / manual 分支保持显式 |
| Concurrency | generation fence、single-active、stable keys、idempotency、重入规则 | 没有 workload authority 时不写性能数字 |
| Config binding | runtime builder、adapter / job / read / handoff 注入位置 | 完整 key / 默认值留给 04 |
| Observability | local audit、safe log、metric / trace seam、history correlation | 不拥有 Observability backend 或 observed truth |
| Test cut | unit / contract / integration seam、负例和闭环检查点 | 不写执行结果、artifact、report 或 verdict |

### 2.3 实现者拿到本文后应能完成什么

在 `03-详细设计.md` 收口后，实现者应能在 planned 实现仓中：

1. 按既定模块和文件边界声明类型、trait、handler、repository、adapter 和 job；
2. 从每个 Command / Consumer / Job 输入构造正确的本地对象或明确返回缺失 / blocked；
3. 按函数级 flow 执行 source read、domain guard、UoW、history / material / outbox 写入和 local result 返回；
4. 对重复、并发、迟到、未知 effect、过期 projection、外围失败和禁止主语执行 fail-closed 或 gap / reconciliation；
5. 以 05 / 06 的测试与验收切口验证字段、状态、事务、幂等和边界，而不需要自行选择另一套语义。

这不等于允许实现者连接未闭口的真实 Runtime / Member / Images / Sandbox / Bus；正向联调须等待对应合同和 07 的 phase gate。

## 3. 详细设计目标表

| 目标 ID | 目标 | 交付给实现者的结果 | 非伪造边界 |
|---|---|---|---|
| `DD-MS-01` | 固定项目型宿主执行主语 | 双锚输入、scope guard、非项目 fail-closed | 不复制 Identity / Work truth |
| `DD-MS-02` | 固定七个 CMP 到实现层 | 模块职责、依赖方向、暴露面 | 不把技术角色升级为第八个 CMP |
| `DD-MS-03` | 定义 Host Truth 对象 | 29 对象字段、函数、状态和不变量 | 不引入 worker / execution / sandbox truth |
| `DD-MS-04` | 定义本地写入契约 | command mapping、repository、UoW、history / marker | 不建立跨 owner 分布式事务 |
| `DD-MS-05` | 定义受控外部接缝 | typed ref、resolver、carrier、session、binding、handoff ports | 不把 runtime / event / ref 写成源码依赖 |
| `DD-MS-06` | 定义 public / operations surface | 17 IB 的 DTO、result、view、error、flow | exact sibling schema 未闭口则 placeholder |
| `DD-MS-07` | 保持完成语义分层 | local / attempt / gap / submitted / delivered / observed / accepted | 不以 receipt / timeout 推断完成 |
| `DD-MS-08` | 保持正交状态与 generation | 状态矩阵、CAS、single-active、late fence | 不新增万能状态 |
| `DD-MS-09` | 保证安全和正文最小化 | redaction、forbidden-body validator、safe view / material | secret、raw endpoint、外部正文不入仓 |
| `DD-MS-10` | 交付测试和实施承接输入 | test cut、字段 / DTO / state / phase closure | 不声明测试执行或 implementation readiness |

## 4. 明确非范围

| 非范围 | 正式 owner / 文档 | 在 03 中的允许表达 |
|---|---|---|
| Member 主体、launch request / heartbeat / status / report 正文、IPC | `L2-member` | registration / signal placeholder、safe summary、matching feedback |
| Runtime LLM loop、goal / plan、memory、checkpoint、run / turn / outcome | `L2-runtime` | Host Session association、execution handoff placeholder；不建 Runtime 对象 |
| Tool execution、Capability registry、外部 MCP / A2A / API truth | `L2-tools` / capability owner | typed capability / external ref；不提交逐动作 ToolInvocation |
| 镜像内容、构建、digest、BOM、provenance、Role -> image mapping | `L2-member-images` | pinned supply qualification ref；不可验证即 blocked |
| Sandbox backend、policy、enforcement、capture、cleanup truth | `L4-sandbox` | host binding / release / cleanup port、safe outcome、residual |
| GlobalMember、ProjectMember、Work、Governance、Artifact、Observability 领域 truth | 对应 L1 / L0 / L4 owner | typed ref、safe qualification、body-free material |
| Bus delivery、consumer observed / accepted、外部报告正文 | `L0-bus` / Observability / consumer owner | local outbox / handoff attempt、gap、feedback layer |
| 容器产品、编排平台、RPC / HTTP、数据库、topic、部署和容量数字 | 04 / 实施或产品 ADR | product-neutral port、机制级配置影响 |
| 完整配置 key、默认值、secret 名、热更新、部署挂载 | `04-配置设计.md` | config type / binding owner / validation boundary |
| 测试全集、验收执行、evidence、artifact、报告和 verdict | `05-测试方案.md` / `06-验收标准.md` | test cut、acceptance mapping placeholder |
| 实施任务、排期、commit、implementation ledger 和 readiness | `07-实施计划.md` | handoff fields / phase boundary inputs only |

## 5. 本轮实现单元的正向 ceiling

```text
Inbound / Operations
  command entries | query entries | signal / feedback consumers | lifecycle / publication jobs
Application
  intent | qualification | assembly | progression | registration / session
  health | recovery | closure | reconciliation | material | safe read services
Domain
  29 Host Truth / state / policy / reference / audit objects
Ports
  repository | UoW | resolver | carrier | session | binding | publication | handoff | clock / id
Persistence / Projection
  source stores | history | idempotency | outbox | safe projection | cursor / rebuild
Adapters / Wiring
  runtime / event / ref / adapter / fake bindings; planned, product-neutral
```

以上是实现契约的层级，不是部署拓扑、crate 数量或已经存在的源码。实际 crate / module / file 由 Step 3~5 收稳。

## 6. 阶段性裁剪与禁止扩展

### 6.1 本轮主线

本轮只支持同步权威受理、后台生命周期推进、异步信号 / 维护三个运行角色；它们是运行角色，不是新增 Host 状态。主线必须覆盖 local-first 提交与之后的 external handoff 分层，但不要求在当前设计中关闭外部合同。

### 6.2 明确禁止的扩展

- 不增加非项目型 Host、GlobalMember-only Host、warm pool、调度器或第三种执行主语。
- 不增加 `HostStatus`、`ExecutionStatus`、`SandboxStatus` 等跨对象万能状态。
- 不增加 `Worker`、`ActionExecution`、`CapabilityMount`、`RuntimeRun`、`SandboxExecution` 业务对象。
- 不增加隐式“自动决定 / 自动恢复 / 自动重试”入口；Job 只能推进已提交 work。
- 不用 fallback、旧缓存、fake、配置默认值或 sibling WIP 关闭 qualification。

## 7. 依赖失效时的实现口径

| 依赖失效 | 本轮允许结果 | 禁止结果 |
|---|---|---|
| subject / identity / Work | reject / blocked | 猜测主语或复制主体 |
| Images / credential / binding | waiting / blocked / unknown | 推导 `ready`、保存 secret 或使用 fallback |
| carrier / registry / Runtime / Member | local attempt / unknown / reconciliation | 以 timeout / fake / local receipt 写 external complete |
| Bus / Observability / consumer | local submitted / gap / not observed | 回滚 source 或声明 delivered / accepted |
| projection / read model | stale / degraded / unavailable | Query refresh / repair / 反写 source |
| Core / SDK exact schema | placeholder / compile scope pending | 本地 shadow schema 或声明 compile / server test ready |

## 8. 改动前后对比

| 维度 | 旧 03 常见口径 | 本轮详细设计范围 |
|---|---|---|
| 交付目标 | “写出宿主执行代码” | “写出 Host Truth 控制面实现契约” |
| 执行动作 | 直接 execute / callback | local attempt + external port + matching outcome |
| 组成部分 | worker / mount / sandbox / feedback 混合 | `CMP-MS-01~07` 分段并按实现层承接 |
| 外部依赖 | 可被误写成源码或产品依赖 | seam 分类、placeholder 与 fail-closed |
| 结果 | callback / report 容易冒充完成 | local / submitted / delivered / observed / accepted 分层 |
| 正向证明 | fake / 局部 receipt 可能被误读 | 本轮不生成任何 readiness / evidence |

## 9. 回填草稿与 Gate

正式 §2 应采用本文件 §3 的目标表和 §4 的非范围表；正式 §3 / §4 只能引用已收稳的范围，不写具体产品或排期。Step 3 只在本范围内收稳语言、runtime、仓库和依赖约束。

| 检查项 | 结果 | 说明 |
|---|---|---|
| 实现目标是契约而非需求复述 | pass | §3、§5 |
| 七个 CMP 和 29 对象没有被扩展 | pass | 仅承接 02 分母 |
| 非范围有 owner / 文档归属 | pass | §4 |
| blocker 保持 pending / blocked / waiting | pass_with_upstream_blockers | §7；`MSVC-UP-001~008` 未关闭 |
| 未写排期、实现、测试结果或 readiness | pass | 本文件无实现事实 |
| 可进入 Step 3 | pass | 下一步收稳 Rust / runtime / 仓库约束 |

```text
step_02_status = completed
step_02_gate = pass_with_upstream_blockers
next_allowed_step = Step 3 runtime_constraints
formal_03_write_allowed = false_until_step_19
```
