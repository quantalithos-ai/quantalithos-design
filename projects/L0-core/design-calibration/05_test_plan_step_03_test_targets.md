# Step 3. 抽取测试对象与测试切口

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 3
- 回填章节：`projects/L0-core/05-测试方案.md` §3

## 2. 本步输入

| 输入 | 内容 | 使用方式 |
|---|---|---|
| Step 2 范围结论 | P0 覆盖契约定义、Command / Query / Event / Job、发布、快照、事务、配置、观测审计 | 限定测试对象抽取范围 |
| `03-详细设计.md` §5 | 模块实现契约和关键对象索引 | 抽取模块级、对象级测试切口 |
| `03-详细设计.md` §7~§8 | API / Command / Query / Event / Job 协议与逐接口处理流 | 抽取协议和流程测试切口 |
| `03-详细设计.md` §9~§12 | 状态机、事务、错误、并发、幂等 | 抽取状态、一致性、恢复测试切口 |
| `03-详细设计.md` §13~§15 | 配置引用、观测审计、最小测试切口 | 抽取配置、观测和最小验证切口 |
| `04-配置设计.md` | 配置项、profile、失效模式 | 补充配置测试对象 |

依赖的前序 Step：Step 1、Step 2 已确认。

## 3. SOP 问题回答

1. 哪些 domain object / value object / policy 必须单测?

   回答：必须单测 `ContractDefinition`、`ContractLifecycle`、`ContractReleaseBaseline`、`CompatibilityStatus`、`ContractReleaseSnapshot`、`ContractFactRecord`、`ExternalReference`、`ContractReadModel`、`ContractTraceProjection`、`CompatibilityTraceIndex`、`ScopePolicy`、`BoundaryGuard`、`DefinitionUseBoundaryGuard`、`ReferenceValidationPolicy`、`FingerprintPolicy`。重点验证生命周期、范围边界、发布门禁、兼容状态、快照状态、事实状态、引用状态、指纹和禁止正文入仓。

2. 哪些 application service 必须做 service test?

   回答：必须覆盖 `ContractChangeService`、`ContractReleaseService`、`ContractCompatibilityService`、`ContractSnapshotService`、`ContractTraceService`、`ContractFactService`、`ContractOperationsService`。重点验证 port 调用顺序、事务边界、错误映射、幂等调用壳、audit / outbox 副作用和 projection 不反向阻塞 truth。

3. 哪些 repository / adapter / worker 必须做集成测试?

   回答：必须覆盖文件型 source / snapshot store、definition / baseline / snapshot repository、projection store、audit store、outbox store、idempotency repository、reference resolver adapter、event publisher boundary、runtime wiring、`OutboxRelayWorker`。重点验证路径配置、读写权限、fail fast、fail closed、pending / failed、stale / rebuild 和 adapter 失败注入。

4. 哪些 Command / Query / Event / Job 必须做协议和流程测试?

   回答：Command 必须覆盖 5 个写路径;Query 必须覆盖 8 个读路径;Event 必须覆盖 7 个 CloudEvent payload;Job 必须覆盖 5 个 operations job 和 outbox relay。每个协议至少要有正向、关键异常、错误映射和证据断言。

5. 哪些状态机、事务、一致性、幂等和恢复行为必须单列切口?

   回答：必须单列 `ContractLifecycleState`、`CompatibilityValue`、`ContractReleaseBaselineStatus`、`ContractReleaseSnapshotStatus`、`FactDeliveryStatus`、`ReferenceState`、`ProjectionState`。一致性必须覆盖 truth + audit + outbox 原子边界、expected version、idempotency same / different payload、outbox relay 重放、snapshot derive 重跑、projection rebuild 并发和 audit 不得静默失败。

## 4. 当前文档问题诊断

| 位置 | 问题 | 影响 |
|---|---|---|
| `05-测试方案.md` §2 | 测试层级直接列旧对象,没有从新版 03 抽取测试对象 | P0 实现者无法知道哪些模块必须测 |
| `05-测试方案.md` §6 | 用例围绕 RegisterShared* | 覆盖不到 Create/Update/Publish/Query/Job/Relay |
| `05-测试方案.md` §9 | 非功能验证没有对应状态机、事务、配置、观测对象 | 无法形成可审计证据 |
| `05-测试方案.md` 全文 | 未覆盖 `03-详细设计.md` §15 最小验证清单 | 与详细设计交付标准不一致 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 测试对象来源 | 旧 shared primitive 模型 | `03-详细设计.md` §5~§15 和 `04-配置设计.md` | 以当前实现契约为准 |
| 切口组织 | 按测试层级笼统列举 | 先按模块、对象、接口、状态、一致性、配置、观测抽取 | 先确定风险,再决定测试层级 |
| worker / job | 只写 replay / rebuild 旧主线 | 覆盖 Validate、DeriveSnapshot、RebuildIndex、RecalculateFingerprint、PublishFact、OutboxRelay | 与当前 jobs binary 一致 |
| 配置切口 | 无 | 覆盖 source priority、config items、cross-field validate、failure mode | 承接 04 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 只按模块列测试对象 | 易读 | 容易漏掉协议、状态和一致性 | 不采用 |
| B. 按模块 + 接口 + 状态 + 一致性 + 配置 + 观测多轴抽取 | 覆盖完整,可追溯到 03 §15 | 表格较多 | 采用 |
| C. 直接进入用例设计 | 更快 | 用例会缺少对象依据和风险分层 | 不采用 |

## 7. 结构化中间产物

### 7.1 测试对象与测试切口总表

| 测试对象 | 来源章节 | 测试切口 | 风险 | 推荐测试层级 |
|---|---|---|---|---|
| `contract_source_assets` | 03 §5 / §15.1 | source tree 解析、引用路径、非法目录 | 契约来源不可读或错误吸收正文 | filesystem unit / adapter |
| `release_snapshot_assets` | 03 §5 / §15.1 | snapshot tree 只读、fingerprint 匹配、写入完整性 | 下游消费错误快照 | filesystem unit / integration |
| `contracts` DTO | 03 §7 / §15.1 | command / query / event / job DTO roundtrip、字段约束、版本兼容 | 协议漂移 | unit / contract |
| `ContractDefinition` / `ContractLifecycle` | 03 §5 / §9 / §15.3 | lifecycle transition、非法迁移、终态保护 | 契约真相状态错误 | unit |
| `ScopePolicy` / `BoundaryGuard` | 03 §5 / 00 BR-001~BR-006 | 范围准入、边界外对象拒绝、正文禁止 | L0-core 吸收相邻仓职责 | unit / negative |
| `ContractReleaseBaseline` / `CompatibilityStatus` | 03 §5 / §9 / §15.3 | gate、compatibility、fingerprint、baseline status | 破坏性变化被发布 | unit / service |
| `ContractReleaseSnapshot` | 03 §5 / §9 / §15.3 | building -> ready、asset / metadata 匹配、重跑幂等 | 快照不可信 | unit / job / integration |
| `ExternalReference` / reference resolver | 03 §5 / §11 / 04 §7 | resolve / stale / fail closed、禁止默认放行 | 引用失败被当作有效 | unit / adapter |
| `ContractReadModel` / projections | 03 §5 / §10 / §15.1 | stale、rebuild、watermark 不倒退 | 查询视图误导使用方 | projection / integration |
| `ContractFactRecord` / `FactDeliveryStatus` | 03 §5 / §9 / §15.3 | pending / published / failed、不可回退 | 事实发布状态不可追溯 | unit / worker |
| `ContractChangeService` | 03 §8 / §15.2 | create / update / submit flow、事务、audit、outbox | 写路径破坏 truth | service |
| `ContractReleaseService` | 03 §8 / §15.2 | publish / lifecycle flow、gate、fingerprint | 发布门禁失效 | service |
| `ContractTraceService` / query services | 03 §8 / §15.2 | read model 查询、not found、stale | 查询结果不可信 | service / query |
| `ContractOperationsService` | 03 §8 / §15.2 | rebuild、recalculate、replay 类操作 | 恢复动作破坏水位或真相 | service / job |
| repositories / `UnitOfWork` | 03 §10 / §15.4 | expected version、truth + audit + outbox 原子性 | 并发覆盖或审计缺失 | integration |
| `IdempotencyRepository` | 03 §12 / §15.4 | same key same payload、same key different payload | 重复请求产生冲突真相 | integration / idempotency |
| `OutboxPort` / `EventPublisherPort` | 03 §7 / §10 / §15.4 | append、fetch pending、mark published / failed、CloudEvent id | 事件不可恢复发布或重复完成 | integration / worker |
| `ContractCommandApi` / CLI bridge | 03 §7 / §15.1 | 参数解析、metadata、exit code、error mapping | CLI 无法作为可执行入口 | CLI contract |
| `ContractQueryApi` | 03 §7 / §15.2 | 8 个只读查询、stale / not found | 读路径改变 truth 或错误码漂移 | query contract |
| `ValidateContractChangeJob` | 03 §7 / §15.2 | 校验通过、runner 失败、引用失败 | 兼容性状态错误 | job |
| `DeriveReleaseSnapshotJob` | 03 §7 / §15.4 | snapshot 生成、fingerprint 冲突、重跑 | 重复或错误快照 | job |
| `RebuildContractIndexJob` | 03 §7 / §15.4 | projection rebuild、watermark、失败保持 stale | 查询恢复失败 | job / integration |
| `OutboxRelayWorker` | 03 §7 / §15.4 | 精确一次边界、单条失败、pending 保留 | event boundary 不可靠 | worker |
| `CoreRuntimeConfig` / runtime wiring | 03 §13 / 04 §2~§12 | config source priority、parse、cross-field validate、build_cli_runtime、build_job_runtime | CLI / job 无法稳定启动 | config / integration |
| trace / log / metric / audit | 03 §14 | traceparent、structured log、metric、audit event | 无法验收追溯和诊断 | observability / audit |

### 7.2 P0 测试切口分类清单

| 分类 | 必测切口 |
|---|---|
| 模块切口 | source assets、snapshot assets、contracts、domain、application、ports、infra、cli、jobs |
| 对象切口 | `ContractDefinition`、`ContractReleaseBaseline`、`ContractReleaseSnapshot`、`ContractFactRecord`、read / trace projection |
| 接口切口 | 5 个 Command、8 个 Query、7 个 Event、6 个 Job / Worker |
| 状态切口 | lifecycle、compatibility、baseline、snapshot、fact、reference、projection |
| 一致性切口 | truth + audit + outbox、expected version、projection stale、snapshot fingerprint |
| 恢复切口 | idempotency replay、outbox relay retry、snapshot job rerun、projection rebuild |
| 配置切口 | defaults / file / env / CLI、7 个 P0 配置项、cross-field validate、fail fast / closed |
| 观测审计切口 | trace propagation、audit append、metrics、structured error evidence |

## 8. 回填草稿

```md
## 3. 测试对象与测试切口

> 校准来源：
> - `design-calibration/05_test_plan_step_03_test_targets.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“回填草稿”和“待确认事项”小节,了解测试对象和测试切口如何从 `03-详细设计.md` §15 与 `04-配置设计.md` 收敛。

本轮测试对象按模块、对象、接口、状态机、一致性、恢复、配置和观测审计多轴抽取。测试方案不得只按技术层级罗列测试,也不得跳过 `03-详细设计.md` §15 的最小验证清单。

| 测试对象 | 来源章节 | 测试切口 | 风险 | 推荐测试层级 |
|---|---|---|---|---|
| `ContractDefinition` / `ContractLifecycle` | 03 §5 / §9 / §15 | lifecycle transition、非法迁移、终态保护 | 契约真相状态错误 | unit |
| Command API | 03 §7 / §8 / §15 | create、update、submit、publish、lifecycle、幂等、事务、副作用 | 写路径破坏 truth | service / contract |
| Query API | 03 §7 / §8 / §15 | 8 个只读查询、not found、stale、projection unavailable | 查询结果不可信 | query / integration |
| Outbound Event / outbox | 03 §7 / §10 / §15 | CloudEvent 字段、outbox append、relay、pending / failed | 事实不可恢复发布 | event / worker |
| Operations Job | 03 §7 / §8 / §15 | validate、derive snapshot、rebuild、fingerprint、publish fact、relay | 后台任务破坏状态或不可重跑 | job |
| 配置与 runtime wiring | 03 §13 / 04 §2~§12 | source priority、config items、cross-field validate、build runtime | CLI / job 无法稳定启动 | config / integration |
```

## 9. 待确认事项

- 是否接受本步把配置和 runtime wiring 明确列为 P0 测试对象。
- 是否接受 Query API 只做只读和 projection 一致性测试,不通过查询路径触发修复动作。
- 是否接受 L0-bus 仅以 `EventPublisherPort` / outbox boundary 作为测试对象,不测试 bus runtime。

## 10. 进入下一步条件

- [x] P0 测试对象都有明确切口。
- [x] `03-详细设计.md` §15 的最小验证清单已覆盖。
- [x] 配置、观测、审计切口已纳入。
- [x] 可以进入 Step 4 制定测试策略与分层。
