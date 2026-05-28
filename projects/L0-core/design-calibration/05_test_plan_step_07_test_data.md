# Step 7. 设计测试数据

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 7
- 回填章节：`projects/L0-core/05-测试方案.md` §7

## 2. 本步输入

| 输入 | 内容 | 使用方式 |
|---|---|---|
| Step 6 用例矩阵 | P0 主线、负向、幂等、并发、事务、配置、恢复和审计用例 | 反推每类用例需要的数据前置条件 |
| `03-详细设计.md` §7~§12 | Command / Query / Event / Job、状态机、持久化、事务、错误与幂等契约 | 定义 DTO fixture、状态 fixture、失败注入数据和恢复数据 |
| `04-配置设计.md` §7~§12 | profile、配置来源优先级、加载校验、失效模式、敏感边界 | 定义配置 fixture 与临时目录数据 |

依赖的前序 Step：Step 1~6 已确认。

## 3. SOP 问题回答

1. 哪些基础数据必须存在?

   回答：必须存在 contract source fixture、definition draft builder、release baseline fixture、snapshot asset fixture、projection fixture、audit trace fixture、outbox event fixture 和配置 fixture。它们分别支撑草稿创建、评审、发布、快照、查询、审计、事件 relay 和 runtime wiring。

2. 哪些边界、异常、并发和恢复数据必须构造?

   回答：必须构造 invalid scope、missing source ref、stale expected version、gate fail、fingerprint mismatch、重复 idempotency key、同 key 不同 payload、outbox publisher fail、projection stale、snapshot rerun、配置路径冲突和 resolver fail closed 等数据。

3. 数据如何隔离不同测试运行?

   回答：所有数据必须带 `test_run_id` 或由 `test_run_id` 派生的 namespace。领域对象使用 `definition_id`、`baseline_id`、`snapshot_id`、`job_run_id` 与 `event_id` 隔离；文件类数据使用临时根目录隔离。

4. 数据如何清理?

   回答：内存 / fake store 在测试结束后丢弃；真实 adapter integration 测试必须按 `test_run_id` 清理 fixture namespace；文件类数据删除临时目录；失败注入数据不得复用到下一用例。

5. 哪些外部依赖使用 fake / stub / real-like?

   回答：domain / service 层使用 fake repository、fake audit、fake outbox、fake resolver 和 failing port；contract / worker 层使用 real-like JSON fixture、CloudEvent fixture、CLI config fixture；不在 L0-core 测试中连接真实 L0-bus、真实下游仓库或真实 secret provider。

## 4. 当前文档问题诊断

| 位置 | 问题 | 影响 |
|---|---|---|
| `05-测试方案.md` §5 | 测试数据仍是 shared ref、dto、enum、error 等旧 shared primitive 样本 | 无法支撑当前 contract definition、baseline、snapshot、outbox、job 和 config 主线 |
| `05-测试方案.md` §5 | 没有定义隔离键和清理规则 | CI 并发运行和失败重跑时容易污染数据 |
| `05-测试方案.md` §5 | 没有区分基础、边界、异常、并发和恢复数据 | P0 负向与恢复用例缺少可重复前置条件 |
| `05-测试方案.md` §5 | 没有说明 fake / stub / real-like 选择 | 实现者无法判断哪些依赖应该真实接入、哪些只测接缝 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 数据主题 | shared primitive admission 样本 | contract source、definition、baseline、snapshot、projection、outbox、job、config fixture | 对齐新版 L0-core 设计对象 |
| 构造方式 | fixture + builder 粗略描述 | 明确 fixture、builder、seed、fake、failing port、real-like fixture | 支撑自动化实现 |
| 隔离方式 | primitive_id / family_name | `test_run_id` + 领域 ID + 临时根目录 | 支撑并发 CI 和重复执行 |
| 清理方式 | 未明确 | 按 namespace、fake store、临时目录和失败注入数据分别清理 | 防止测试间污染 |
| 外部依赖 | 未说明 | L0-bus / 下游仓库 / secret provider 不真实接入,只测契约边界 | 保持 L0-core 测试边界 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 依赖人工造数 | 初期看似简单 | 不可重复、不可审计、CI 无法稳定执行 | 不采用 |
| B. 每个用例独立手写完整数据 | 隔离清楚 | 重复大,容易产生字段漂移 | 不作为主方案 |
| C. 统一 builder + 场景 fixture + namespace 隔离 | 可重复、可组合、适合自动化 | 需要维护 builder 与 fixture 版本 | 采用 |
| D. 接入真实外部服务构造数据 | 更接近生产 | 超出 L0-core 边界,失败原因不可控 | 仅在下游仓或系统级 E2E 使用 |

## 7. 结构化中间产物

### 7.1 测试数据集表

| 数据集 | 用途 | 构造方式 | 隔离键 | 清理方式 | 关联用例 |
|---|---|---|---|---|---|
| `contract_source_fixture` | 提供合法 / 缺失 / 不兼容 source ref | versioned JSON fixture | `test_run_id` + `source_ref` | 删除 fixture namespace | TC-CMD-001、TC-JOB-004 |
| `definition_draft_builder` | 构造 Draft / InReview / Published / Retired definition | builder + state preset | `test_run_id` + `definition_id` | fake store drop 或 namespace cleanup | TC-CMD-001~006、TC-CONC-001 |
| `invalid_scope_fixture` | 验证单仓私有实现、非法边界和范围拒绝 | negative fixture | `test_run_id` + `scope_case_id` | 删除 fixture namespace | TC-SCOPE-002 |
| `release_baseline_fixture` | 构造可发布 / gate fail / fingerprint mismatch baseline | builder + approved / rejected gate preset | `test_run_id` + `baseline_id` | namespace cleanup | TC-CMD-004、TC-CMD-005 |
| `snapshot_asset_fixture` | 验证 release snapshot 派生和重跑幂等 | generated fixture + expected fingerprint | `test_run_id` + `snapshot_id` | 删除临时 snapshot root | TC-JOB-002、TC-E2E-001 |
| `projection_fixture` | 验证 current / stale / rebuild 查询视图 | seed read model fixture | `test_run_id` + `projection_id` | truncate namespace 或 fake drop | TC-QUERY-001、TC-QUERY-002、TC-JOB-003 |
| `outbox_event_fixture` | 验证 CloudEvent 结构和 relay 失败恢复 | event fixture + publisher fake | `test_run_id` + `event_id` | 清理 outbox namespace | TC-EVENT-001、TC-OUTBOX-001、TC-OUTBOX-002 |
| `idempotency_record_fixture` | 验证重复 key replay 和 payload conflict | idempotency seed | `test_run_id` + `idempotency_key` | 清理 idempotency namespace | TC-IDEM-001、TC-IDEM-002 |
| `audit_trace_fixture` | 验证 actor、trace、action、result 留证 | audit fixture + command/job receipt | `test_run_id` + `trace_id` | 清理 audit namespace | TC-AUDIT-001、TC-E2E-001 |
| `job_input_fixture` | 验证 validate、derive、rebuild、fingerprint、publish fact job | job input JSON fixture | `test_run_id` + `job_run_id` | 删除 job temp root | TC-JOB-001~005 |
| `concurrency_version_fixture` | 验证 expected version 冲突 | two-writer builder preset | `test_run_id` + `definition_id` | fake drop 或 namespace cleanup | TC-CONC-001 |
| `transaction_failure_fixture` | 验证 audit/outbox/repository 失败回滚 | failing port fixture | `test_run_id` + `failure_case_id` | 丢弃 fake / failing port 状态 | TC-TXN-001、TC-OUTBOX-001 |
| `config_fixture_valid` | 验证 defaults + file + env + CLI 优先级 | JSON config fixture + env map + CLI args | `test_run_id` + temp root | 删除临时 config root | TC-CONFIG-001 |
| `config_fixture_invalid_roots` | 验证 audit/outbox/idempotency root 冲突和不可写 | negative JSON config fixture | `test_run_id` + temp root | 删除临时 config root | TC-CONFIG-002 |
| `reference_resolver_fake_data` | 验证 resolver fail closed 和禁止默认放行 | fake resolver fixture | `test_run_id` + `resolver_case_id` | 丢弃 fake resolver 状态 | TC-CONFIG-003、TC-JOB-004 |

### 7.2 数据构造规则

| 规则 | 说明 |
|---|---|
| 稳定 ID | 测试数据 ID 必须由 `test_run_id`、场景名和固定序号派生,避免随机值破坏断言 |
| 稳定时间 | 时间字段使用 fixed clock,不得使用真实当前时间直接断言 |
| 稳定 fingerprint | source、baseline、snapshot fixture 必须带 expected fingerprint |
| 无明文 secret | fixture 不得包含真实 token、credential、session 或密钥正文 |
| 可重复清理 | 每个 fixture 必须说明 namespace 和清理方式 |
| 失败注入隔离 | failing port 的失败状态只在单个用例内有效,不得跨用例复用 |

### 7.3 外部依赖替身策略

| 依赖 | 测试替身 | 使用场景 | 不做什么 |
|---|---|---|---|
| repository | fake repository / integration repository | unit / service / integration | 不在 unit 中连接真实存储 |
| audit store | fake audit + failing audit | 审计成功和回滚失败 | 不写真实生产审计目录 |
| outbox publisher | fake publisher + failing publisher | CloudEvent 结构和 relay 失败 | 不真实发布到 L0-bus |
| reference resolver | fake resolver | source ref 存在、缺失、fail closed | 不访问真实下游仓库 |
| config loader | real parser + temp JSON | 配置优先级、校验和失效模式 | 不读取用户机器真实配置 |

## 8. 回填草稿

```md
## 7. 测试数据设计

> 校准来源：
> - `design-calibration/05_test_plan_step_07_test_data.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“测试数据集表”“数据构造规则”和“外部依赖替身策略”小节,了解 P0 用例的数据前置条件如何保持可重复、可隔离和可清理。

本章定义 L0-core 测试数据的构造、隔离、复用和清理规则。所有 P0 用例的数据必须能由 fixture、builder、seed 或 fake port 自动构造,不得依赖人工临时造数。

| 数据集 | 用途 | 构造方式 | 隔离键 | 清理方式 | 关联用例 |
|---|---|---|---|---|---|
| `definition_draft_builder` | 构造 Draft / InReview / Published / Retired definition | builder + state preset | `test_run_id` + `definition_id` | fake store drop 或 namespace cleanup | TC-CMD-001~006、TC-CONC-001 |
| `release_baseline_fixture` | 构造可发布 / gate fail / fingerprint mismatch baseline | builder + gate preset | `test_run_id` + `baseline_id` | namespace cleanup | TC-CMD-004、TC-CMD-005 |
| `outbox_event_fixture` | 验证 CloudEvent 和 relay 恢复 | event fixture + publisher fake | `test_run_id` + `event_id` | 清理 outbox namespace | TC-EVENT-001、TC-OUTBOX-001、TC-OUTBOX-002 |
| `config_fixture_valid` | 验证配置来源优先级 | JSON config fixture + env map + CLI args | `test_run_id` + temp root | 删除临时 config root | TC-CONFIG-001 |

测试数据规则：

- 所有数据必须以 `test_run_id` 或其派生 namespace 隔离。
- 时间、ID 和 fingerprint 必须稳定可断言。
- fixture 不得包含真实 token、credential、session 或密钥正文。
- 外部依赖默认使用 fake / failing port / real-like fixture,不在 L0-core 测试中连接真实 L0-bus 或真实下游仓库。
```

## 9. 待确认事项

- 是否接受 L0-core 的测试数据默认不连接真实 L0-bus,只在 contract / worker 层验证 CloudEvent 和 relay 边界。
- 是否接受配置测试使用临时 JSON fixture + env map + CLI args,不读取用户机器真实配置文件。

## 10. 进入下一步条件

- [x] P0 用例的数据前置条件可满足。
- [x] 测试数据可重复生成、可隔离、可清理。
- [x] fake / stub / real-like 的使用边界已明确。
- [x] 可以进入 Step 8 设计测试环境与配置矩阵。
