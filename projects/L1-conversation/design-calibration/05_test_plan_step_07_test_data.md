# L1-conversation 05 测试方案 Step 7: 设计测试数据

> 所属流程: `05_test_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/05-测试方案.md` §7 测试数据设计
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 7 |
| 主题 | 设计测试数据 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/05_test_plan_step_07_test_data.md` |

本步只定义测试数据如何构造、隔离、复用和清理。测试环境、配置矩阵、CI 命令、门禁顺序和证据编号分别留给 Step 8、Step 9 和 Step 13。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `05_test_plan_step_06_cases.md` | P0 用例矩阵 | 作为数据集和 fixture 分组来源 |
| `03-详细设计.md` §7 / §8 / §9 / §10 / §11 / §12 / §15 | DTO、状态、事务、错误、恢复、脚本契约 | 作为数据字段和状态构造来源 |
| `03_ddd_step_16_test_slices.md` | 最小测试切口、fake / in-memory 语义和脚本输出 | 作为数据覆盖下限 |
| `04-配置设计.md` §6 / §7 / §8 / §11 / §12 | profile、测试 / fixture 配置、redaction、reports / artifacts | 作为数据隔离和敏感数据边界来源 |

## 3. SOP 问题回答

### 3.1 哪些基础数据必须存在?

必须存在 deterministic actor、owner、participant、consumer、space、participant scope、visibility scope、fact source ref、payload ref、trace context、outbox record、projection state、cursor、external fact ref、safe snapshot、manifestation、handoff record、job run id 和 run-scoped artifact / report root。

这些数据必须由 fixture builder 或 seed 生成,不得靠测试执行者手工临时拼接。

### 3.2 哪些边界、异常、并发和恢复数据必须构造?

必须构造 missing metadata、missing idempotency key、same key same digest、same key different digest、sealed visibility expansion、forbidden body、source unresolved、digest mismatch、invalid envelope、duplicate event、publish failure、handoff failure、stale / failed projection、expired / invalidated cursor、repository failure、unsupported profile、raw secret 和 extra project layer path。

### 3.3 数据如何隔离不同测试运行?

所有数据必须携带 `TestRunId` 或由 `TestRunId` 派生的前缀。业务 ID、event id、idempotency key、job run id、trace ref、artifact path 和 report path 都必须可从 run-scoped seed 重建。artifact root 固定为 `artifacts/test/<run_id>`，report root 固定为 `reports/runs/<run_id>`，不得加入 `<project>` 层级。

### 3.4 数据如何清理?

P0 默认使用 in-memory repository / fake adapter 时，清理以 drop runtime / reset fixture store 为准。涉及 artifacts / reports 的数据，清理只删除当前 `run_id` 目录，不删除其他 run。测试不得依赖清理后的全局状态来判定成功。

### 3.5 哪些外部依赖使用 fake / stub / real-like?

P0 使用 deterministic fake resolver、fake publisher、fake handoff、in-memory repository、fixed clock 和 deterministic id generator。integration-like 可使用 configured local / controlled adapter，但必须保留 unresolved、retry、failed、quarantine、redaction 和 fake marker 语义。真实 DB、真实 broker、真实 source resolver 和真实 handoff endpoint 不进入本步 P0 数据要求。

## 4. 当前文档问题诊断

| 文档 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 旧数据围绕消息和 stream,缺少新版 truth、scope、manifestation、handoff 和 redaction 数据 | 不继承旧数据集 |
| Step 6 | 已有可执行用例,但前置条件仍是自然语言 | 本步落成数据集、builder 和 seed 规则 |
| `03` §15 | 约束最小切口和脚本输出,但不定义 fixture 管理 | 本步补充测试数据组织 |
| `04` §6 / §11 | 已定义 profile、fake、reports 和失效模式 | 本步转换为 fixture / negative data |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 数据来源 | 用例前置条件散落 | 统一由 seed、builder、fixture store 构造 |
| 隔离方式 | 未说明 | 以 `TestRunId` / `run_id` 隔离 ID、路径和外部 fake 行为 |
| 负向数据 | 分散在用例描述 | missing field、forbidden body、unresolved、digest mismatch、retry failure 等集中定义 |
| 清理方式 | 未说明 | in-memory reset + run-scoped artifact / report cleanup |

## 6. 测试设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 数据是否手工准备 | 测试执行前人工造数 | deterministic seed + builder 自动生成 | B | SOP 要求可重复生成 |
| 是否共享一个全局 fixture | 所有用例复用同一全局状态 | 每个用例组使用 run-scoped fixture | B | 可避免顺序依赖和污染 |
| forbidden body 数据是否真实存储 | 写入真实正文后检查 | 使用 sentinel forbidden body 并要求被拒绝 / quarantine | B | 不能让 forbidden body 成为正常 truth |
| fake adapter 是否只返回成功 | happy-path fake | fake 支持 success / unresolved / retry / failed / quarantine | B | P0 fake 必须保留失败语义 |
| artifact / report 是否全局输出 | 固定 latest 或全局目录 | `artifacts/test/<run_id>` + `reports/runs/<run_id>` | B | 支撑验收可复核 |

## 7. 结构化中间产物

### 7.1 测试数据集表

| 数据集 | 用途 | 构造方式 | 隔离键 | 清理方式 | 关联用例 |
|---|---|---|---|---|---|
| `DS-CONV-BASE-SPACE` | 创建、关闭、scope / visibility 主线 | `ConversationSpaceFixtureBuilder` 生成 actor、owner、participants、space kind、initial scope | `TestRunId` + `SpaceSeed` | reset in-memory truth store | TC-CONV-SPACE-*、TC-CONV-SCOPE-* |
| `DS-CONV-FACT-HAPPY` | append / retract fact 主线 | `ConversationFactFixtureBuilder` 生成 visible actor、payload ref、source ref、trace ref | `TestRunId` + fact sequence seed | reset fact / trace / outbox stores | TC-CONV-FACT-001、TC-CONV-FACT-005 |
| `DS-CONV-IDEMPOTENCY` | duplicate / conflict | 固定 `IdempotencyKey` 和 request digest 组合 | `TestRunId` + idempotency namespace | reset idempotency store | TC-CONV-FACT-002、TC-CONV-FACT-003 |
| `DS-CONV-STATE-BOUNDARY` | 非法状态转换 | builder 直接构造 `Closed` space、`Sealed` visibility、terminal fact、expired cursor | `TestRunId` + state case id | reset domain fixture | TC-CONV-SPACE-003、TC-CONV-SCOPE-002、TC-CONV-QUERY-004 |
| `DS-CONV-AUTH-VISIBILITY` | 授权查询和未授权拒绝 | 生成 visible consumer、hidden consumer、visible fact、hidden fact | `TestRunId` + consumer ref | reset projection / read model store | TC-CONV-QUERY-001、TC-CONV-QUERY-002、TC-CONV-SEARCH-001 |
| `DS-CONV-MANIFESTATION` | 跨域显化和 snapshot refresh | fake resolver 返回 safe snapshot、unresolved、digest mismatch 三类响应 | `TestRunId` + external ref | reset resolver script + snapshot store | TC-CONV-MAN-001~003 |
| `DS-CONV-CONSUMER` | inbound consumer 正向 / duplicate / quarantine | event builder 生成 valid envelope、missing event id、duplicate event、runtime result ref-only、bridge body sentinel | `TestRunId` + event id namespace | reset event idempotency + quarantine store | TC-CONV-CONSUMER-* |
| `DS-CONV-HANDOFF` | trace / archive handoff | handoff fixture 生成 trace context、pending handoff、retryable failure、permanent failure、archive package ref | `TestRunId` + handoff id | reset handoff store + fake handoff script | TC-CONV-TRACE-001、TC-CONV-HANDOFF-* |
| `DS-CONV-OUTBOX` | event publish / rerun | outbox fixture 生成 pending outbox、publish success、publish failure、state write failure once | `TestRunId` + outbox id | reset outbox store + fake publisher script | TC-CONV-OUTBOX-* |
| `DS-CONV-DERIVED` | projection、search、cursor、consistency | projection fixture 生成 fresh / stale / failed state、outbox gap、missing read model issue | `TestRunId` + projection scope | reset projection / cursor stores | TC-CONV-DERIVED-*、TC-CONV-CURSOR-001、TC-CONV-CONSISTENCY-001 |
| `DS-CONV-CONFIG` | unsupported profile、path shape、redaction | JSON fixture 生成 unsupported profile、non-strict redaction、extra project layer path、raw secret sentinel | `TestRunId` + config case id | delete only run-scoped files | TC-CONV-CONFIG-001、TC-CONV-REPORT-001、TC-CONV-REDACTION-001 |

### 7.2 Fixture / Builder 规则

| 规则 | 要求 |
|---|---|
| ID 生成 | 使用 deterministic id generator,同一 `TestRunId` + seed 必须生成同一 ID |
| 时间 | 使用 fixed clock,不得依赖 wall clock 判断状态 |
| actor / participant | 使用 typed ref,不得复制 identity truth 或成员正文 |
| payload | 只生成 `PayloadRef` / digest / safe summary,不得生成可被正常保存的正文 |
| forbidden body | 使用 sentinel 字符串触发拒绝 / quarantine / redaction failure,不得作为成功数据落库 |
| external source | fake resolver 只返回 ref、safe snapshot、unresolved、digest mismatch,不得返回来源正文 |
| publisher / handoff | fake 必须支持 success、retryable failure、permanent failure 和 fake marker |
| repository failure | 通过 failure injection point 构造,不得依赖真实磁盘或网络不稳定 |
| report path | 只使用当前 `run_id`,不得写 `latest` 或 `<project>` 层级 |

### 7.3 Seed 命名规则

| Seed | 格式 | 用途 |
|---|---|---|
| `TestRunId` | `run-conv-<yyyyMMddHHmmss>-<short>` | 隔离一次测试运行 |
| `SpaceSeed` | `space-seed-<case>` | 派生 space、scope、visibility 初始数据 |
| `FactSeed` | `fact-seed-<case>-<seq>` | 派生 fact、payload ref、receipt、trace |
| `EventSeed` | `event-seed-<source>-<case>` | 派生 inbound / outbound event id 和 idempotency key |
| `JobSeed` | `job-seed-<job-kind>-<case>` | 派生 job run id、batch scope、report ref |
| `FailureSeed` | `failure-seed-<adapter>-<mode>` | 控制 fake adapter failure mode |

### 7.4 隔离与清理规则

| 资源 | 隔离方式 | 清理方式 | 禁止事项 |
|---|---|---|---|
| in-memory truth / projection / outbox store | store namespace = `TestRunId` | drop runtime 或 reset namespace | 不能跨用例复用 mutable state |
| idempotency store | key prefix = `TestRunId` | reset namespace | 不能使用全局固定 key |
| fake resolver / publisher / handoff script | script namespace = `TestRunId` + `FailureSeed` | reset script registry | 不能把 fake success 写成 production success |
| artifacts | `artifacts/test/<run_id>` | 删除当前 run 目录 | 不能删除其他 run;不能写 `<project>` 层级 |
| reports | `reports/runs/<run_id>` | 删除当前 run 目录 | 不能写 `latest`;不能保存 raw secret |
| redaction sentinel | 只在负向输入或 generated report check 中出现 | 负向用例结束后清理 run 目录 | 不能进入 truth、event、log、audit success path |

### 7.5 外部依赖数据替身表

| 依赖 | P0 数据替身 | 必须保留的语义 | 关联用例 |
|---|---|---|---|
| `L0-core` shared contracts | typed ref / metadata fixture | ID、actor、trace、error 类型稳定 | 全部协议用例 |
| `L0-bus` event collaboration | fake publisher / outbox fixture | retry、failed、duplicate event id | TC-CONV-OUTBOX-* |
| `L1-identity` | actor / member ref + safe display snapshot | unresolved actor、not visible | TC-CONV-SPACE-*、TC-CONV-QUERY-* |
| `L1-work` / governance / artifact | external fact ref + safe snapshot | unresolved、digest mismatch、source body absent | TC-CONV-MAN-* |
| `L2-runtime` | runtime result committed ref-only event | reasoning body forbidden | TC-CONV-CONSUMER-001、TC-CONV-FACT-004 |
| `L6-bridges` | mapped fact ref-only event | platform body forbidden、invalid mapping | TC-CONV-CONSUMER-003 |
| `L4-observability` / archive | fake handoff receipt / archive package ref | retry / failed、payload ref-only | TC-CONV-HANDOFF-* |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §7 时摘录。

```markdown
## 7. 测试数据设计

> 校准来源：
> - `design-calibration/05_test_plan_step_07_test_data.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“测试数据集表”“Fixture / Builder 规则”“Seed 命名规则”“隔离与清理规则”和“外部依赖数据替身表”小节，了解每组 P0 用例的数据前置条件如何稳定生成。

本轮测试数据必须由 deterministic seed、fixture builder 和 fake adapter script 自动生成。所有数据以 `TestRunId` 隔离，业务 ID、event id、idempotency key、job run id、trace ref、artifact path 和 report path 都必须能从 run-scoped seed 重建。P0 默认使用 in-memory repository、fixed clock、deterministic id generator、fake resolver、fake publisher 和 fake handoff，但 fake 必须保留 unresolved、retry、failed、quarantine、redaction 和 fake marker 语义。

artifact root 固定为 `artifacts/test/<run_id>`，report root 固定为 `reports/runs/<run_id>`。测试数据不得依赖人工临时造数，不得把 forbidden body、raw secret、source body 或 fake production success 作为正常成功数据保存。
```

## 9. 待确认事项

无阻塞进入 Step 8 的待确认事项。

后续 Step 必须继续收口:

- Step 8 将本步数据集分配到 `local-dev`、`ci-test`、`integration-like` 和 `operations-replay` 环境 / profile。
- Step 9 定义自动化门禁时必须指定哪些 builder / seed 在 PR、CI、release gate 或 operations-replay 中运行。
- Step 13 生成证据编号时必须承接本步 `TestRunId`、artifact path 和 report path。
- 后续实现不得把本步 fake / fixture 数据标记为 production evidence。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 用例数据前置条件可满足 | 通过 | 11 组数据集覆盖 Step 6 用例 |
| 测试数据可重复生成 | 通过 | deterministic seed + fixed clock + builder |
| 测试运行可隔离 | 通过 | `TestRunId` / `run_id` 统一隔离 |
| 清理规则明确 | 通过 | in-memory reset + run-scoped path cleanup |
| 可以进入 Step 8 | 通过 | 下一步设计测试环境与配置矩阵 |
