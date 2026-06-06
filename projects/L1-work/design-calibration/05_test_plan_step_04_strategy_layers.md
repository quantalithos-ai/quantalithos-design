# Step 4. 制定测试策略与分层

> 本步定义 `L1-work` 每类风险应该在哪个测试层级被发现。本步不分配用例 ID、不设计 fixture 细节、不定义 CI 命令;这些内容留给 Step 6、Step 7 和 Step 9。

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| Step | 4 |
| 状态 | 已完成 |
| 回填章节 | `projects/L1-work/05-测试方案.md` §4 测试策略与分层 |
| 生成日期 | 2026-06-04 |

## 2. 本步输入

| 输入 | 用途 |
|---|---|
| `05_test_plan_step_01_input_boundary.md` | 确认新版 `00/01/02/03/04` 为测试主输入 |
| `05_test_plan_step_02_scope.md` | 确认 P0/P1/P2 测试范围、非范围和下游接缝边界 |
| `05_test_plan_step_03_test_objects_cuts.md` | 提供 P0 测试对象、协议、状态、一致性、配置和观测切口 |
| `03-详细设计.md` §15 | 提供最小验证清单:七模块、18 Command、8 Query、7 Consumer、10 Event、6 Job、12 状态机和一致性边界 |
| `04-配置设计.md` §6~§12 | 提供 profile、配置项、敏感输出、加载校验、失效模式和测试承接 |
| `测试方案讨论流程_SOP.md` Step 4 | 本步问题、期望产物和进入下一步条件 |
| `测试方案书写规范.md` §5.4 | 正式测试分层图和分层表格式 |

## 3. SOP 问题回答

### 3.1 哪些问题必须在 unit 层发现?

unit 层负责发现不依赖 I/O、repository、worker 或真实 adapter 的局部契约错误。任何可以由对象、value object、policy、DTO schema 或状态转换独立判断的问题,不得推迟到 service 或 E2E。

| 风险 | unit 层发现方式 | 不应下沉到更高层的原因 |
|---|---|---|
| truth object 不变量错误 | `Project`、`ProjectMember`、`Backlog`、`WorkItem`、`ChildWorkItem`、`Iteration` 等构造和字段校验 | 局部规则失败不需要启动 service flow |
| 状态机合法 / 非法转换错误 | 12 组正式状态机的主线合法转换和非法转换单测 | 状态名和 transition 是 domain truth,不能依赖 API happy path 间接覆盖 |
| policy accept / reject 错误 | `WorkTruthPolicy`、`FormalWorkPolicy`、`PromotePolicy`、`DependencyGraphPolicy`、`IterationCommitmentPolicy` 等 | policy 是一票否决边界,应在最小输入下直接断言 |
| forbidden body / external body exclusion | value object、payload ref、snapshot ref、reason / evidence ref 不接受正文字段 | 一旦进入 service / repository,泄露来源更难定位 |
| public DTO / typed ref schema 错误 | contracts DTO roundtrip、必填字段、domain-only enum 不出现在 public DTO | 协议 surface 的字段级错误应在 contract unit 层快速失败 |
| idempotency digest 规范化错误 | volatile metadata 排除、业务输入 digest 包含项固定 | digest 规则是纯函数,不应等到 repository duplicate case 才发现 |
| observability forbidden field 清单错误 | log / metric / audit / event 字段清单只允许低基数字段和 ref | 字段边界可静态或单元断言,不能依赖人工审阅 |

### 3.2 哪些问题必须在 service 层验证编排?

service 层负责验证 application service 对 domain、repository port、UnitOfWork、idempotency、resolver、outbox、projection stale 和错误映射的编排顺序。它使用 fake / in-memory port,不依赖真实 DB / broker / HTTP。

| 风险 | service 层验证方式 | 失败语义 |
|---|---|---|
| accepted command 半提交 | command service 断言 truth、trace / audit、outbox、projection stale、command result save、idempotency complete 同一 UoW | 阻断 PR / CI |
| reject 后仍写副作用 | metadata reject、domain reject、version conflict、resolver unresolved 后断言无 accepted truth / outbox / business audit | 阻断 PR / CI |
| command duplicate / conflict 错误 | same key same digest 从 `CommandResultRepository` 返回旧 result;same key different digest 返回 conflict | 阻断 PR / CI |
| query no-write 破坏 | 8 个 Query service 断言不打开写 UoW、不写 audit / outbox / idempotency / marker | 阻断 PR / CI |
| projection stale / failed surface 错误 | query service 映射 stale、rebuilding、failed、not visible,不触发 rebuild 写入 | 阻断 PR / CI |
| inbound consumer 编排错误 | event service 处理 envelope、dedup、resolver、snapshot / marker 和 dead-letter | 阻断 CI |
| operations job item 语义错误 | job service 验证 batch、partial failure、rerun、report 和 no repair truth | 阻断 CI |
| error mapping 不稳定 | domain / repository / resolver / publisher / handoff / UoW error 映射到正式 application / protocol error | 阻断 PR / CI |

### 3.3 哪些问题必须依赖 DB / adapter / worker 集成测试?

integration 层负责验证 repository、UnitOfWork、adapter、runtime builder、worker loop 和 job runner 在真实或 in-memory 技术边界上的语义。P0 使用 fake / in-memory / controlled adapter,不要求 production DB / MQ / KMS / endpoint。

| 风险 | integration 层验证方式 | P0 依赖 |
|---|---|---|
| repository version / unique key 不一致 | in-memory 或 future durable repository contract test 验证 optimistic version、unique key、page ordering | fake / in-memory store |
| UoW rollback 语义不完整 | outbox enqueue failure、repository failure、idempotency complete failure 时断言全部回滚 | fake UoW failure injection |
| runtime builder 装配漂移 | `WorkRuntimeConfig` 通过 validation 后装配 repository、projection、idempotency、resolver、publisher、handoff、clock、id generator | `local-dev` / `ci-test` config |
| config loader / validator 错误 | defaults、JSON、env、strict unknown key、cross-field validation、unsupported hot reload | config fixture |
| resolver / publisher / handoff adapter 错误 | not found、unavailable、digest mismatch、publish failed、handoff failed marker | configured fake adapter |
| outbox worker 重入错误 | pending batch、partial failure、mark failed、dual publisher single winner、rerun | fake publisher + in-memory outbox |
| job runner partial failure 错误 | projection rebuild、reference refresh、reconciliation、handoff / archive job 的 item-level report | fake job runner |
| sensitive output 泄露 | config、log、audit、event、report、artifact 扫描 raw secret / raw payload / external body absent | redaction check |

### 3.4 哪些问题需要 API / contract test?

API / Worker contract 层负责验证公开入口的协议形状、metadata、envelope、error mapping 和 typed response。它不替代 service 编排测试,也不补设计中不存在的 DTO 字段。

| 入口类型 | contract test 重点 | 不在本层解决的问题 |
|---|---|---|
| Command handler | request / response DTO roundtrip、`ActorContext`、`CommandMetadata`、idempotency key、protocol error 映射 | domain policy 全组合 |
| Query handler | `QueryMetadata`、page token、not visible / degraded / stale surface、query no-write 观察点 | projection rebuild 细节 |
| Inbound Event consumer | event envelope、source ref、dedup key、trace context、dead-letter / quarantine / duplicate receipt | 相邻仓完整实现 |
| Outbound Event | event name、payload schema、version、forbidden field absent、outbox ref / trace ref | broker 产品行为 |
| Operations Job | job metadata、scope、idempotency / rerun、partial failure report、system / operator actor | 真实调度系统 |
| Error DTO | protocol / application / domain / repository / config / job error 的公开 surface | error 内部栈信息 |

### 3.5 哪些场景才需要 E2E 或 release gate?

E2E / release gate 只覆盖最小业务闭环和跨模块高风险链路,不承载所有状态、字段和异常组合。P0 E2E 使用 `ci-test` 或 `integration-like` profile 与 controlled adapter。

| 场景 | 使用 E2E / release gate 的原因 | 最小链路 |
|---|---|---|
| 核心能力闭环 smoke | 证明 C-1~C-5 在同一运行时可串起来 | create project -> assign member -> create work item -> commit iteration -> query board / trace |
| promote 边界闭环 | 证明 runtime 来源不能直写 Work,必须显式 request / review | consume promote requested -> request / review promotion -> created formal work ref -> outbox |
| external reference failure 闭环 | 证明相邻仓不可用时产生 marker,不造假 truth | consumer / command resolver failure -> unresolved / failed marker -> query degraded surface |
| outbox / projection / query 闭环 | 证明 accepted truth 可传播到派生消费面,但派生不反写 | command accepted -> outbox pending -> projection stale / rebuild -> query view |
| configuration redline gate | 证明配置不能绕过 metadata、idempotency、audit、outbox、forbidden body 和 sensitive output | invalid config fail-fast + redaction scan |
| release readiness sample | 发布前证明 P0 profile、自动化、报告和证据链可复核 | selected smoke suite + evidence archive |

### 3.6 测试失败是否阻断?

P0 相关失败默认阻断。P1/P2 专项在当前阶段只记录风险,除非被明确纳入 release gate。

| 层级 | PR 阶段 | CI 阶段 | release gate | 失败处理 |
|---|---|---|---|---|
| Unit | 必跑 | 必跑 | 必跑 | 阻断 PR / CI |
| Service | 核心 command / query 必跑 | 全量必跑 | 必跑 | 阻断 PR / CI |
| Integration | 轻量 in-memory 可 PR 选择性跑 | P0 全量必跑 | 必跑 | 阻断 CI / 发布 |
| API / Worker contract | DTO / handler 快速集可 PR 跑 | P0 全量必跑 | 必跑 | 阻断 CI / 发布 |
| E2E / Release gate | 不要求 | smoke 可选 | 必跑 | 阻断发布 |
| P1/P2 专项 | 不要求 | 不要求 | 仅被纳入时必跑 | 默认不阻断 P0 |

## 4. 当前文档问题诊断

| 文档 / 位置 | 当前问题 | 本步处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 测试策略仍按旧草案描述,没有把新版七模块、协议、配置和观测切口分层 | 本步重建分层策略,旧内容不作为正式口径 |
| Step 3 测试对象总表 | 已给推荐测试层级,但没有统一执行层级、失败处理和 E2E 边界 | 本步把推荐层级收敛为正式分层 |
| `03-详细设计.md` §15 | 只写最小验证入口,未定义哪些测试在哪层发现 | 本步承接并分配到 unit / service / integration / API / E2E |
| `04-配置设计.md` §12 | 已列配置测试切口,但未分配测试层级 | 本步把配置 loader / validator 放 integration,配置红线 gate 放 release gate |
| 旧性能候选 | 旧文档可能把性能数字推到 E2E 硬门禁 | 本步不处理性能阈值;Step 10 再判断专项测试口径 |

## 5. 改动前后对比

| 维度 | Step 3 后 | Step 4 收敛后 |
|---|---|---|
| 测试对象 | 已抽取对象、协议、状态和一致性切口 | 明确每类切口在哪个层级发现 |
| unit 范围 | 只知道 domain / contract 需要测 | 明确不变量、policy、状态、DTO、digest 和 forbidden field 必须 unit 发现 |
| service 范围 | 只知道 application service 必测 | 明确 UoW、幂等、error mapping、query no-write 和 consumer / job 编排放 service |
| integration 范围 | 只知道 repository / adapter / worker 必测 | 明确 repository、runtime builder、config、adapter、worker、job runner 和 redaction check 放 integration |
| API / worker contract | 协议入口已列出 | 明确 contract test 验公开 surface,不替代 service / domain 组合 |
| E2E | 尚未定义边界 | 明确只测最小闭环、跨模块高风险链路和 release readiness sample |
| 阻断策略 | 尚未定义 | P0 unit / service / integration / contract / release gate 失败均按所在阶段阻断 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 所有风险都用 E2E 覆盖 | 接近用户路径 | 慢、定位差,且无法覆盖字段级 schema、状态非法转换和幂等组合 | 不采用 |
| 方案 B: 只做 unit + service,不做 integration / contract | 反馈快 | 无法验证 repository、UoW、config、worker、job、协议 surface | 不采用 |
| 方案 C: 按风险发现位置分层,高风险先在最低可验证层发现,E2E 只保留最小闭环 | 可定位、可自动化、符合 Step 3 切口 | 需要后续 Step 6 / 9 继续细化用例和门禁 | 采用 |
| 方案 D: production-like 真实依赖作为 P0 release gate | 最贴近生产 | 当前 04 未定义 production DB / MQ / KMS / endpoint 字段全集,会虚构环境 | 不采用 |

推荐方案 C。

原因:

- `L1-work` 的高风险主要来自 truth 边界、状态、幂等、事务、配置和 forbidden body,这些风险应在 unit / service / integration 层提前失败。
- E2E 更适合证明少量跨模块闭环,不适合穷举 18 Command、8 Query、7 Consumer、10 Event、6 Job 和 12 状态机。
- 配置设计已经把 production-like、remote config、hot reload 和完整运维后移,测试分层必须保持 P0 可执行。

## 7. 结构化中间产物

### 7.1 测试分层图

#### 测试分层图: L1-work 测试金字塔

```text
[Unit tests]
  - contracts DTO / value object / domain object / policy / state machine
        |
        v
[Service tests]
  - application service + fake ports + UoW + idempotency + error mapping
        |
        v
[Integration tests]
  - repository / runtime builder / config / adapter / worker / job runner
        |
        v
[API / Worker contract tests]
  - HTTP / RPC / event envelope / outbox event / job contract
        |
        v
[E2E / Release gate]
  - minimal business closure + cross-module smoke + evidence archive
```

关键说明:

- 越靠下的层级越早发现局部错误;不得把 schema、状态和 policy 错误推给 E2E。
- service 层验证编排和事务边界,但不依赖真实 DB / broker / external endpoint。
- integration 层验证 fake / in-memory / controlled adapter 的技术语义和配置装配。
- E2E / release gate 只保留最小主链、跨模块高风险链路和可归档证据。

### 7.2 测试分层表

| 层级 | 目标 | 典型内容 | 执行时机 | 失败处理 |
|---|---|---|---|---|
| Unit | 发现局部不变量、schema、状态和 policy 错误 | DTO roundtrip、typed ref、domain object、policy、state transition、digest、forbidden field | PR / CI | 阻断 PR / CI |
| Service | 验证 application 编排、UoW、幂等、错误映射和 no-write | 18 Command service、8 Query service、consumer orchestration、job orchestration | PR / CI | 阻断 PR / CI |
| Integration | 验证 repository、adapter、runtime builder、config、worker、job runner 技术边界 | fake / in-memory repository、UnitOfWork、config loader、resolver / publisher / handoff、outbox worker、redaction check | CI / pre-release | 阻断 CI / 发布 |
| API / Worker contract | 验证公开协议、metadata、envelope、receipt、event / job schema 和 error surface | command / query handler、event consumer envelope、outbound event schema、job input / report | CI / pre-release | 阻断 CI / 发布 |
| E2E / Release gate | 证明最小业务闭环、跨模块高风险链路和证据归档可复核 | project -> member -> work -> iteration -> query / trace;promote;outbox / projection;config redline smoke | release gate / staging-like dry-run | 阻断发布 |

### 7.3 P0 切口到测试层级矩阵

| P0 切口族 | Unit | Service | Integration | API / Worker contract | E2E / Release gate |
|---|---|---|---|---|---|
| Project / ProjectMember truth | object / policy / state | command orchestration | repository version / unique | command DTO / handler | core smoke |
| Backlog / WorkItem / child WorkItem | object / formal work policy | create / update flows | UoW rollback | command DTO / error | core smoke |
| Promote boundary | source ref / policy | request / review flows | resolver fake | command / consumer contract | promote smoke |
| Dependency / blocker | graph / cycle policy | dependency / blocker flows | repository edge uniqueness | command DTO / event schema | selected smoke |
| Iteration commitment | iteration state / scope policy | iteration flows | repository page / version | command DTO / event schema | core smoke |
| Query / projection no-write | view DTO helper | query service no-write | projection repository marker | query handler surface | board / trace smoke |
| Inbound consumers | event DTO helper | consumer orchestration | dedup store / resolver fake | envelope / receipt contract | selected smoke |
| Outbound events / outbox | event payload helper | outbox enqueue decision | publisher / outbox worker | event schema | propagation smoke |
| Operations jobs | job DTO helper | job item orchestration | job runner / report store | job input / report contract | release sample |
| State matrix | legal / illegal transition | rejected flow side effects | not required by default | selected error mapping | not exhaustive |
| Transaction / idempotency / concurrency | digest pure function | duplicate / conflict / rollback | UoW / idempotency / command result store | duplicate error surface | selected commit unknown smoke |
| Configuration | typed value helper | runtime builder behavior where applicable | loader / validator / profile / redaction | protocol rejects config-created invalid request | config redline gate |
| Observability / audit | allowed field list | audit / trace side effects | log / report scan | event / error field surface | evidence archive |

### 7.4 层级阻断策略表

| 风险类别 | 首选发现层级 | 是否 P0 阻断 | 说明 |
|---|---|---|---|
| schema / DTO / typed ref 缺失或不一致 | Unit / API contract | 是 | 任何 public surface 字段不闭合都阻断 |
| domain invariant / state transition 错误 | Unit | 是 | 不得靠 service / E2E 间接发现 |
| UoW / idempotency / error mapping 错误 | Service | 是 | 写路径核心一致性 |
| repository / adapter / config 装配错误 | Integration | 是 | P0 fake / in-memory / controlled adapter 必须可靠 |
| worker / job duplicate、partial failure、rerun 错误 | Integration + contract | 是 | 影响派生、outbox 和维护链路 |
| raw secret / raw body / high-cardinality leakage | Unit + integration + release gate | 是 | 安全和证据红线 |
| production DB / MQ / KMS / endpoint 真实联调失败 | P1/P2 专项 | 当前不阻断 P0 | 未进入 P0 配置字段全集 |
| performance candidate 未达旧草案数字 | Step 10 专项 | 当前不阻断 | 旧数字未升级为正式阈值 |

## 8. 对上游设计的影响判定

| 测试结论 | 是否影响上游设计 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|
| 测试策略按 unit / service / integration / API-worker contract / E2E-release gate 分层 | 否 | 测试执行策略,无设计契约变化 | 无 | 无回写 |
| P0 风险必须在最低可验证层级优先发现,E2E 只保留最小闭环和 release gate | 否 | 测试策略裁剪,不改变需求或设计 | 无 | 无回写 |
| 配置 loader / validator / sensitive output 进入 integration / release gate,但不新增配置字段 | 否 | 测试承接 `04`,无配置契约变化 | 无 | 无回写 |
| production-like 真实依赖、remote config、hot reload 和旧性能数字不进入当前 P0 gate | 否 | 与 Step 2 范围一致 | 无 | 无回写 |

说明:

```text
本步没有改变需求、架构、概要、详细设计或配置设计。
如果 Step 5 / Step 6 发现某个 P0 覆盖项必须依赖上游未定义字段、状态、错误或配置,必须记录为上游待回写或阻塞待确认。
```

## 9. 回填草稿

正式 `05-测试方案.md` §4 建议采用以下结构:

```text
4. 测试策略与分层
  4.1 分层原则
  4.2 测试分层图
  4.3 测试分层表
  4.4 P0 切口到测试层级矩阵
  4.5 层级阻断策略
  4.6 对上游设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §4.1 | `design-calibration/05_test_plan_step_04_strategy_layers.md` §3 / §6 |
| §4.2 | `design-calibration/05_test_plan_step_04_strategy_layers.md` §7.1 |
| §4.3 | `design-calibration/05_test_plan_step_04_strategy_layers.md` §7.2 |
| §4.4 | `design-calibration/05_test_plan_step_04_strategy_layers.md` §7.3 |
| §4.5 | `design-calibration/05_test_plan_step_04_strategy_layers.md` §7.4 |
| §4.6 | `design-calibration/05_test_plan_step_04_strategy_layers.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 5 的待确认事项。

后续 Step 必须继续收口:

- Step 5 建立 FR / BR / AC 到测试对象、层级和后续用例的覆盖矩阵。
- Step 6 为 P0 切口分配稳定用例 ID、步骤摘要、断言点和 evidence ID。
- Step 7 设计 fixture、builder、fake adapter 和 failure injection 数据。
- Step 8 / Step 9 把 `04` 的 profile 和本步分层转成环境矩阵与自动化门禁。
- Step 10 决定旧性能候选数字是否进入专项测试,不得提前写成硬 release gate。

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 测试分层图已输出 | 通过 | 见 §7.1 |
| 测试分层表已输出 | 通过 | 见 §7.2 |
| Step 3 全部 P0 切口均可映射到测试层级 | 通过 | 见 §7.3 |
| 已说明各层失败是否阻断 | 通过 | 见 §3.6 / §7.4 |
| 未提前定义用例 ID、测试数据、CI 命令或验收裁决 | 通过 | 留给 Step 6 / Step 7 / Step 9 / `06` |
