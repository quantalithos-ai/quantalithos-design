# Step 6. 设计测试场景与用例矩阵

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 6
- 回填章节：`projects/L0-core/05-测试方案.md` §6

## 2. 本步输入

| 输入 | 内容 | 使用方式 |
|---|---|---|
| Step 5 覆盖矩阵 | 需求 / 规则到用例 ID 和证据 ID 的映射 | 展开用例矩阵 |
| `03-详细设计.md` §7~§12 | Command / Query / Event / Job、函数流、状态机、事务、错误、幂等 | 提供用例输入、预期和断言 |
| `04-配置设计.md` §7~§11 | 配置项、加载校验、失效模式 | 提供配置用例 |

依赖的前序 Step：Step 1~5 已确认。

## 3. SOP 问题回答

1. 每个 P0 正向主线怎么执行?

   回答：P0 正向主线按“创建草稿 -> 更新草稿 -> 提交评审 -> 发布基线 -> 派生快照 -> 查询定义 / 快照 / 追溯 -> 发布事实 -> outbox relay boundary”展开。每段都要有 receipt、状态、audit、outbox 或 projection 断言。

2. 每个关键反向和边界场景如何触发?

   回答：反向场景通过非法范围、缺失字段、stale version、非法状态、gate fail、fingerprint mismatch、reference fail closed、配置路径非法、配置冲突、raw secret 输入等触发。

3. 每个状态非法迁移如何断言?

   回答：非法迁移应返回 `ApplicationError::PreconditionFailed` 或对应 domain illegal state,原状态保持不变,不得追加成功 audit / outbox,不得改变 projection 为 current。

4. 每个事务回滚和副作用如何验证?

   回答：通过 fake / failing ports 和真实 adapter integration 注入 audit append、outbox append、repository save、publisher mark 等失败,断言 truth、audit、outbox、idempotency 状态符合 03 §10~§12 规则。

5. 每个恢复场景如何复现?

   回答：通过重复 idempotency key、重跑 snapshot job、重跑 outbox relay、projection stale 后 rebuild、toolchain runner fail 后 retry、publisher fail 后 pending / failed 状态保留来复现。

## 4. 当前文档问题诊断

| 位置 | 问题 | 影响 |
|---|---|---|
| `05-测试方案.md` §6 | 用例仍是 RegisterShared* 旧场景 | 无法验证当前协议和处理流 |
| `05-测试方案.md` §6 | 没有断言点列 | 测试人员无法知道成功以什么为准 |
| `05-测试方案.md` §6 | 缺少配置、事务、幂等、job、outbox relay 用例 | P0 风险缺口 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 用例组织 | 旧 admission 主线 | 按 Scope / DTO / CMD / Query / Event / Job / Config / NFR 分类 | 对齐新版设计 |
| 断言 | 只写预期结果 | 明确状态、receipt、audit、outbox、projection、error code | 支撑自动化和验收 |
| 恢复场景 | replay registry | idempotency、snapshot rerun、outbox relay、projection rebuild | 当前恢复主线不同 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 每个接口只列一个 happy path | 简短 | 无法覆盖 P0 负向和恢复风险 | 不采用 |
| B. P0 主线 + 关键负向 + 一致性 / 恢复 / 配置用例 | 覆盖有效,规模可控 | 不是全部边界值穷举 | 采用 |
| C. 在测试方案中写完整测试代码 | 可执行性强 | 越过设计文档边界 | 不采用 |

## 7. 结构化中间产物

### 7.1 用例矩阵

| 用例 ID | 场景 | 优先级 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 |
|---|---|---|---|---|---|---|---|
| TC-SCOPE-001 | 合法跨仓契约进入范围 | P0 | 合法 `ContractDefinitionDraftSpec` | 调用 `ScopePolicy` / `CreateContractDraft` | 创建 draft | state=Draft;truth saved;audit/outbox 产生 | 是 |
| TC-SCOPE-002 | 单仓私有实现被拒绝 | P0 | proposal 标记为 single-repo private | 调用 boundary guard | 返回 precondition / invariant error | 无 truth/audit/outbox 成功记录 | 是 |
| TC-DTO-001 | DTO roundtrip | P0 | 所有 Command / Query / Job fixture | serialize -> deserialize | 字段保持一致 | schema version / required fields | 是 |
| TC-CMD-001 | 创建契约草稿成功 | P0 | source ref 可读,scope 合法 | `CreateContractDraft` | 返回 `ContractChangeReceipt` | Draft;idempotency complete;audit/outbox append | 是 |
| TC-CMD-002 | 更新草稿 stale version | P0 | definition version 已变化 | `UpdateContractDraft` with old version | 返回 conflict | truth 不变;无成功 outbox | 是 |
| TC-CMD-003 | 提交评审成功 | P0 | Draft 完整且引用有效 | `SubmitContractForReview` | Draft -> InReview | receipt;audit;review event | 是 |
| TC-CMD-004 | 发布基线 gate fail | P0 | InReview,gate 未通过 | `PublishContractBaseline` | 返回 precondition_failed | definition 不发布;baseline 不 release | 是 |
| TC-CMD-005 | 发布基线成功 | P0 | gate approved,fingerprint 匹配 | `PublishContractBaseline` | Published + baseline Released | baseline;definition;outbox event | 是 |
| TC-CMD-006 | 生命周期终态保护 | P0 | Retired definition | `UpdateContractLifecycle` | 返回 precondition_failed | state 保持 Retired | 是 |
| TC-QUERY-001 | 查询定义命中 | P0 | read model current | `GetContractDefinition` | 返回 definition view | current=true;不写 audit/outbox | 是 |
| TC-QUERY-002 | 查询 stale projection | P0 | projection stale | `GetContractDefinition` | 返回 stale 标记或错误口径 | 不修改 truth | 是 |
| TC-QUERY-003 | 追溯查询 | P0 | evolution / audit 存在 | `TraceContractEvolution` | 返回 trace view | trace 与 audit / evolution 对齐 | 是 |
| TC-QUERY-007 | 查询 contract package view | P0 | package view fixture | `GetContractPackage` | 返回 package view | domain package 字段完整 | 是 |
| TC-QUERY-008 | 查询 guide sample | P0 | sample fixture | `GetContractGuideSample` | 返回 sample view | 不包含业务正文 | 是 |
| TC-EVENT-001 | baseline event 结构正确 | P0 | baseline released | 检查 `ContractBaselinePublished` CloudEvent | 字段符合约束 | type/source/subject/traceparent/content-type | 是 |
| TC-OUTBOX-001 | command truth + outbox 原子提交 | P0 | outbox 正常 | command write | truth 与 outbox 同时提交 | 缺一即失败 | 是 |
| TC-OUTBOX-002 | relay publish 失败保持 pending/failed | P0 | pending event,publisher fail | `OutboxRelayWorker.run_once` | 标记 failed 或保持 pending | 不生成新 truth;event id 不变 | 是 |
| TC-JOB-001 | ValidateContractChangeJob 成功 | P0 | target definition 存在 | run validate job | compatibility status 更新 | trace/audit/outbox 记录 | 是 |
| TC-JOB-002 | DeriveReleaseSnapshotJob 重跑幂等 | P0 | baseline released,same job/fingerprint | run derive twice | 不生成重复快照 | snapshot id/fingerprint 稳定 | 是 |
| TC-JOB-003 | RebuildContractIndexJob 成功 | P0 | projection stale | run rebuild | projection active | watermark 前进不倒退 | 是 |
| TC-JOB-004 | RecalculateFingerprintJob source missing | P0 | source ref missing | run recalculate | job failed | truth 不变;失败证据存在 | 是 |
| TC-JOB-005 | PublishContractFactJob 写 outbox | P0 | fact pending | run publish fact | fact queued / outbox append | delivery status 正确 | 是 |
| TC-IDEM-001 | 同 key 同 payload 重复提交 | P0 | completed idempotency record | repeat command | replay receipt | 不新增 truth/outbox | 是 |
| TC-IDEM-002 | 同 key 不同 payload 冲突 | P0 | same key different fingerprint | repeat command | conflict | 原 receipt 保留 | 是 |
| TC-CONC-001 | 并发 expected version 冲突 | P0 | same definition two writers | save with same expected version | 后写失败 | 只有一个版本成功 | 是 |
| TC-TXN-001 | audit append 失败回滚 | P0 | audit port failure | command write | command failed | truth/outbox 不提交或等价原子失败 | 是 |
| TC-CONFIG-001 | defaults + config file + env + CLI 优先级 | P0 | 四类来源均有值 | build runtime | 高优先级覆盖低优先级 | `CoreRuntimeConfig` 值正确 | 是 |
| TC-CONFIG-002 | root path cross-field invalid | P0 | audit/outbox/idempotency root 冲突 | build runtime | fail fast | 不启动 cli/job runtime | 是 |
| TC-CONFIG-003 | reference resolver 禁止默认放行 | P0 | invalid resolver config | build runtime / resolve | fail closed | 不发布;错误可诊断 | 是 |
| TC-AUDIT-001 | 审计证据完整 | P0 | command / job 成功 | 查询 audit store | audit record 存在 | actor/trace/action/result 完整 | 是 |
| TC-NFR-001 | 核心查询和 job 不阻塞主链 | P1 | fixture dataset | 执行 query/job baseline | 达到实施期阈值 | 记录耗时报告 | 部分 |
| TC-E2E-001 | 最小闭环 | P0 | clean runtime fixture | draft -> review -> publish -> snapshot -> query -> fact -> relay | 全链通过 | receipt、snapshot、trace、outbox evidence | 是 |

### 7.2 场景分类清单

| 场景类型 | 覆盖用例 |
|---|---|
| 正向主线 | TC-CMD-001、TC-CMD-003、TC-CMD-005、TC-JOB-002、TC-E2E-001 |
| 反向校验 | TC-SCOPE-002、TC-CMD-004、TC-CMD-006、TC-CONFIG-002、TC-CONFIG-003 |
| 状态非法迁移 | TC-CMD-006、TC-STATE 系列在 Step 10/正式文档中展开 |
| 幂等重复请求 | TC-IDEM-001、TC-IDEM-002、TC-JOB-002 |
| 并发冲突 | TC-CONC-001 |
| 事务回滚 | TC-TXN-001、TC-OUTBOX-001 |
| 外部依赖失败 | TC-JOB-004、TC-OUTBOX-002、TC-CONFIG-003 |
| replay / rebuild 恢复 | TC-JOB-003、TC-OUTBOX-002 |
| 观测和审计留证 | TC-AUDIT-001、TC-TRACE-001、TC-E2E-001 |

## 8. 回填草稿

```md
## 6. 测试场景与用例设计

> 校准来源：
> - `design-calibration/05_test_plan_step_06_cases.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“用例矩阵”“场景分类清单”和“待确认事项”小节,了解 P0 测试场景如何从需求追溯矩阵、协议契约、状态机、事务和配置失效模式收敛。

本章定义 P0 用例矩阵。每个 P0 用例必须具备前置条件、输入 / 操作、预期结果、断言点和自动化候选标记。用例不写具体测试代码,但必须足以让实现仓据此编写测试。

| 用例 ID | 场景 | 优先级 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 |
|---|---|---|---|---|---|---|---|
| TC-CMD-001 | 创建契约草稿成功 | P0 | source ref 可读,scope 合法 | `CreateContractDraft` | 返回 `ContractChangeReceipt` | Draft;idempotency complete;audit/outbox append | 是 |
| TC-CMD-005 | 发布基线成功 | P0 | gate approved,fingerprint 匹配 | `PublishContractBaseline` | Published + baseline Released | baseline;definition;outbox event | 是 |
| TC-JOB-002 | DeriveReleaseSnapshotJob 重跑幂等 | P0 | baseline released,same job/fingerprint | run derive twice | 不生成重复快照 | snapshot id/fingerprint 稳定 | 是 |
| TC-CONFIG-002 | root path cross-field invalid | P0 | audit/outbox/idempotency root 冲突 | build runtime | fail fast | 不启动 cli/job runtime | 是 |
| TC-E2E-001 | 最小闭环 | P0 | clean runtime fixture | draft -> review -> publish -> snapshot -> query -> fact -> relay | 全链通过 | receipt、snapshot、trace、outbox evidence | 是 |
```

## 9. 待确认事项

- 是否接受 P0 用例矩阵先覆盖关键主线与高风险负向,不穷举所有字段边界值。
- 是否接受 `TC-STATE-*` 在正式文档中可以并入 `TC-CMD-*` 和状态机专项矩阵,而不单独列全部状态组合。

## 10. 进入下一步条件

- [x] P0 用例可执行、可断言、可留证。
- [x] 正向、负向、状态、幂等、并发、事务、配置、恢复和审计场景均有覆盖。
- [x] 可以进入 Step 7 设计测试数据。
