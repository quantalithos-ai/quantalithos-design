# L0-bus 05 测试方案 Step 7: 测试数据设计

> 本文件是 `projects/L0-bus/05-测试方案.md` 的 Step 7 中间产物。
> 本步定义测试数据如何构造、隔离、复用和清理,确保 Step 6 的 P0 / P0-min 用例可重复执行。
> 本步不修改正式 `05-测试方案.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 7 |
| 主题 | 设计测试数据 |
| 状态 | 已确认 |
| 正式回填位置 | `05-测试方案.md` §7 |
| 是否修改正式 `05-测试方案.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `05_test_plan_step_06_cases.md` | 已确认 | 提取 P0 / P0-min 用例的前置条件、输入、断言和证据 |
| `03-详细设计.md` §10 | 已完成 | 提取数据所有权、repository 映射、UoW 和唯一约束 |
| `03-详细设计.md` §11~§12 | 已完成 | 提取错误恢复、幂等键、重复调用和并发数据要求 |
| `03-详细设计.md` §13~§15 | 已完成 | 提取配置、观测、redaction 和脚本证据数据要求 |
| `04-配置设计.md` §6~§12 | 已完成 | 提取 profile、配置项、secret ref、failure mode 和 reports / artifacts 承接 |

---

## 3. SOP 问题回答

### 3.1 哪些基础数据必须存在?

基础数据用于支撑 publication、delivery、feedback、recovery、read-only output 和 config 主线。

| 基础数据 | 用途 | 构造要求 |
|---|---|---|
| `run_id` | 隔离一次测试运行 | 每次运行唯一,进入 id、source ref、artifact path、report path |
| `ActorContext` | 写 Command、Query、Job 和 audit | 提供 publisher、subscriber、operator、system job 四类 actor |
| `CommandMetadata` / `JobMetadata` | 幂等、trace、审计 | 含 trace ref、request id、idempotency key、job run id |
| core contract reference | publication acceptance | 使用真实 `L0-core` contract ref 或稳定 fixture ref,不得在 bus 中重定义契约 |
| payload reference | payload 边界 | 只包含 ref、digest、size/type metadata,不得包含正文 |
| committed outbox fact | outbox relay | 标记为 committed,含 source system、source record ref、contract ref |
| backend capability ref | transport semantic / backend boundary | 提供 available、unsupported、unavailable 三类能力 |
| delivery record fixture | delivery / feedback / recovery | delivery suite 提供 `Scheduled / Dispatching / Delivered / Failed` 状态；feedback suite 提供 `Completed` 状态 |
| audit / history seed | recovery / read-only output | 提供 append-only sequence 和 audit chain ref |
| config profile fixture | runtime graph | 提供 `ci-test`、`integration-test`、`operations-recovery` JSON |

### 3.2 哪些边界、异常、并发和恢复数据必须构造?

| 数据类别 | 必须构造的数据 | 覆盖用例 |
|---|---|---|
| publication 边界 | missing core contract ref、payload body injected、accepted / rejected terminal record | `TC-BUS-PUB-002`~`004` |
| semantic 边界 | backend private field injected、unsupported semantic、capability mismatch | `TC-BUS-SEM-002`、`TC-BUS-BND-002` |
| delivery 异常 | backend unavailable、delivered duplicate dispatch attempt、batch success + failure items | `TC-BUS-DLV-002`~`004` |
| feedback / idempotency | same key same digest、same key different digest、late feedback、unknown delivery | `TC-BUS-FDB-002`~`004` |
| recovery | failed delivery、retry policy ref、failure material、DLQ、missing approval、valid audit chain | `TC-BUS-REC-001`~`004` |
| read-only output | current projection、stale projection、missing projection、failure material output | `TC-BUS-OUT-001`~`004` |
| transaction side effect | publisher retryable failure、source ack failure、commit uncertain | `TC-BUS-OUT-006`、`TC-BUS-OBX-002`、`TC-BUS-BND-003` |
| config failure | unsupported key、invalid enum、raw secret、secret unavailable、reload request | `TC-BUS-CFG-002`~`003` |
| redaction | artifacts containing forbidden body sample and clean artifacts sample | `TC-BUS-RED-001` |

### 3.3 数据如何隔离不同测试运行?

测试数据必须按 `run_id` 和 deterministic namespace 隔离。

```text
----------------------+
| Test run             |
| run_id               |
+----------+-----------+
           |
           v
+----------+-----------+
| Fixture namespace    |
| bus-test::<run_id>   |
+----------+-----------+
           |
           v
+----------+-----------+
| In-memory runtime    |
| store/backend/source |
+----------+-----------+
           |
           v
+----------+-----------+
| artifacts / reports  |
| test/<run_id>        |
+----------------------+
```

图后说明：

- 所有 id、source ref、event id、job item key 必须带 `run_id` 或由 `run_id` 派生。
- fixed clock 和 deterministic id generator 只允许在 test profile 中使用。
- in-memory store、fake backend、fixture source 和 in-memory publisher 每个 run 独立创建。
- artifacts 和 reports 以 `run_id` 建目录,不得再额外添加项目名层级。

### 3.4 数据如何清理?

| 数据位置 | 清理策略 | 例外 |
|---|---|---|
| in-memory store / backend / source / publisher | 测试结束丢弃 runtime graph | 失败时可 dump 到 artifacts |
| local temp fixture | 按 `run_id` 删除 | release gate 可保留失败 fixture 摘要 |
| `artifacts/test/<run_id>` | 本地 / PR 可清理,release / acceptance 必须保留 | redaction 失败时必须保留证据 |
| `reports/runs/<run_id>` | release / acceptance 必须保留 | 本地 smoke 可清理 |
| external fake provider state | 每次测试创建新 namespace,结束删除 | 若用于失败复现,记录 namespace ref |

### 3.5 哪些外部依赖使用 fake / stub / real-like?

| 外部依赖 | 当前测试数据策略 | 原因 |
|---|---|---|
| `L0-core` shared contracts | 使用真实 path dependency + stable fixture refs | core 契约是 P0 前提,但不重测 core 内部 |
| committed outbox source | fake fixture source | P0 验证 committed fact 接缝,不依赖真实业务仓 |
| transport backend | fake / in-memory backend | P0 验证 port 语义,production adapter 后置 |
| outbound publisher | in-memory sink + failure injector | 验证 publisher success / retryable failure / evidence |
| repository store | in-memory store with constraints | 验证唯一约束和 expected version 语义 |
| secret / connection provider | fake provider returning ref / unavailable | 验证 ref-only 和 fail-closed |
| clock / id generator | fixed clock + deterministic id generator | 保证数据可重复 |
| observability / governance / SDK | fake consumer / snapshot assertion | 只测 bus 输出接缝,不测下游完整产品 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 旧 `05` 未定义可复现测试数据 | 用例可能依赖人工临时造数 | CI 和验收无法稳定复现 | 本步定义 fixture / builder / seed 规则 |
| 数据边界容易越界 | payload body、raw secret、governance decision body 可能被误造入 bus | 测试本身污染边界 | 本步明确只造 ref / digest / metadata 和 forbidden sample |
| 幂等 / 并发数据缺失 | same key same digest、different digest、source duplicate 未明确定义 | 关键一致性用例无法执行 | 本步单列幂等和重复数据 |
| 恢复链数据复杂 | retry、DLQ、replay preparation 需要多对象前置 | 手工构造容易漏 audit chain | 本步定义 recovery fixture 族 |
| 证据目录隔离不清 | artifacts / reports 可能跨 run 污染 | 验收证据不可信 | 本步以 `run_id` 作为统一隔离键 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 数据来源 | 用例前置条件文字描述 | 明确 fixture / builder / seed | 可自动生成 |
| 数据隔离 | 未定义 | `run_id` + deterministic namespace | 可并行、可清理 |
| 边界数据 | 隐含 | forbidden body / raw secret / private body 作为专用 negative sample | 可验证 redaction |
| 恢复数据 | 手工理解 | failed delivery、failure material、DLQ、audit chain 组合 fixture | 可复现恢复链 |
| 外部依赖 | 不清楚 | fake / stub / real-like 策略明确 | 支撑 Step 8 环境矩阵 |

---

## 6. 测试设计取舍

### 6.1 是否使用真实业务 payload

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 使用真实 payload body | 接近业务 | 违反 bus 数据边界 | 不采用 |
| B. 默认只使用 payload ref / digest / metadata,另造 forbidden sample 做负例 | 符合边界且可测 redaction | 不能验证业务正文语义 | 采用 |
| C. 完全不构造 payload 相关数据 | 简单 | 无法测试 payload boundary | 不采用 |

### 6.2 是否使用真实 MQ / DB 数据

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. P0 使用真实 MQ / DB | 接近生产 | 超出 P0,不稳定 | 不采用 |
| B. P0 使用 in-memory store / fake backend,但实现唯一约束和 failure injection | 可复现且覆盖 port 语义 | 不证明真实产品行为 | 采用 |
| C. 只 mock service 返回值 | 很快 | 无法验证 repository / adapter 接缝 | 不采用 |

### 6.3 是否保留失败运行数据

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 所有运行都永久保留 | 便于追踪 | 占用大,本地噪声多 | 不采用 |
| B. 本地 / PR 可清理,release / acceptance 必须保留 | 平衡成本和验收 | 需要脚本区分模式 | 采用 |
| C. 全部自动删除 | 干净 | 无验收证据 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 测试数据集表

| 数据集 | 用途 | 构造方式 | 隔离键 | 清理方式 | 关联用例 |
|---|---|---|---|---|---|
| `DS-BUS-RUN-001` | run identity、actor、metadata | `TestRunBuilder` 生成 run_id、actor、trace、job metadata | `run_id` | 本地结束清理,release 保留摘要 | 全部用例 |
| `DS-BUS-PUB-001` | publication accepted 正向 | `PublicationFixtureBuilder.valid_material()` | `run_id + source_ref` | runtime 丢弃 | `TC-BUS-PUB-001` |
| `DS-BUS-PUB-002` | publication negative | missing contract、payload body injected、terminal record | `run_id + negative_case` | runtime 丢弃,redaction 失败保留 artifact | `TC-BUS-PUB-002`~`004` |
| `DS-BUS-SEM-001` | transport semantic | backend capability available / unsupported / private field sample | `run_id + backend_profile` | runtime 丢弃 | `TC-BUS-SEM-001`~`002`、`TC-BUS-BND-001`~`002` |
| `DS-BUS-DLV-001` | delivery lifecycle | `Scheduled / Dispatching / Delivered / Failed`、batch mixed items；`Completed` fixture 归 feedback suite | `run_id + delivery_id` | runtime 丢弃 | `TC-BUS-DLV-001`~`004` |
| `DS-BUS-FDB-001` | feedback / idempotency | ack、fail、timeout、same digest、different digest、late feedback | `run_id + idempotency_key` | runtime 丢弃 | `TC-BUS-FDB-001`~`004` |
| `DS-BUS-REC-001` | recovery chain | failed delivery、retry policy、failure material、DLQ、approval ref、audit chain | `run_id + recovery_ref` | runtime 丢弃;release 保留 evidence | `TC-BUS-REC-001`~`004` |
| `DS-BUS-OUT-001` | read-only output | current / stale / missing projection、failure material、audit sequence | `run_id + projection_key` | runtime 丢弃 | `TC-BUS-OUT-001`~`006` |
| `DS-BUS-OBX-001` | outbox relay | committed outbox fact、duplicate fact、source ack failure marker | `run_id + source_record_ref` | runtime 丢弃 | `TC-BUS-OBX-001`~`002` |
| `DS-BUS-CFG-001` | config valid / invalid | valid profile、unsupported key、invalid enum、raw secret、reload request | `run_id + profile_name` | temp config 删除;release 保留摘要 | `TC-BUS-CFG-001`~`003` |
| `DS-BUS-RED-001` | redaction / reports | clean artifacts、forbidden sample artifacts、expected report refs | `run_id` | 本地可删,release 保留 | `TC-BUS-RED-001`~`002` |

### 7.2 Fixture / builder 规则

| 规则 | 说明 |
|---|---|
| `TestRunBuilder` 是所有数据入口 | 统一生成 `run_id`、actor、metadata、fixed clock、deterministic id namespace |
| 每类业务数据有独立 builder | publication、delivery、feedback、recovery、projection、config、artifact 分开构造 |
| builder 默认生成合法数据 | negative / boundary 数据必须显式调用 `with_missing_contract()`、`with_payload_body()` 等方法 |
| 禁止默认生成 forbidden body | forbidden sample 只能进入 redaction negative fixture |
| 所有 source ref 必须带 `run_id` | 防止跨测试重复唯一键冲突 |
| 所有 fake dependency 必须可注入失败 | backend unavailable、publisher retryable failure、source ack failure、secret unavailable 都由 fixture 控制 |
| fixture 不读取开发者本机私有配置 | 只读测试 JSON、env override 和 fake provider |

### 7.3 Seed 顺序

```text
+--------------------+
| TestRunBuilder     |
+---------+----------+
          |
          v
+---------+----------+
| Config fixture      |
+---------+----------+
          |
          v
+---------+----------+
| Runtime graph       |
+---------+----------+
          |
          v
+---------+----------+
| Domain seed         |
| publication/delivery|
+---------+----------+
          |
          v
+---------+----------+
| Action under test   |
+---------+----------+
          |
          v
+---------+----------+
| Evidence fixture    |
+--------------------+
```

图后说明：

- config fixture 必须先于 runtime graph。
- domain seed 只写当前用例必要的最小前置数据。
- action under test 负责触发真实 service / handler / job 行为,不能直接伪造结果。
- evidence fixture 只用于验证 artifact / report,不得反向影响业务状态。

### 7.4 用例到数据集映射

| 用例范围 | 必须数据集 |
|---|---|
| `TC-BUS-PUB-001`~`004` | `DS-BUS-RUN-001`、`DS-BUS-PUB-001`、`DS-BUS-PUB-002` |
| `TC-BUS-SEM-001`~`002` | `DS-BUS-RUN-001`、`DS-BUS-PUB-001`、`DS-BUS-SEM-001` |
| `TC-BUS-DLV-001`~`004` | `DS-BUS-RUN-001`、`DS-BUS-DLV-001`、`DS-BUS-SEM-001` |
| `TC-BUS-FDB-001`~`004` | `DS-BUS-RUN-001`、`DS-BUS-DLV-001`、`DS-BUS-FDB-001` |
| `TC-BUS-REC-001`~`004` | `DS-BUS-RUN-001`、`DS-BUS-DLV-001`、`DS-BUS-REC-001` |
| `TC-BUS-OUT-001`~`006` | `DS-BUS-RUN-001`、`DS-BUS-OUT-001`、`DS-BUS-RED-001` |
| `TC-BUS-OBX-001`~`002` | `DS-BUS-RUN-001`、`DS-BUS-OBX-001` |
| `TC-BUS-BND-001`~`003` | `DS-BUS-RUN-001`、`DS-BUS-SEM-001`、`DS-BUS-CFG-001` |
| `TC-BUS-CFG-001`~`003` | `DS-BUS-RUN-001`、`DS-BUS-CFG-001` |
| `TC-BUS-RED-001`~`002` | `DS-BUS-RUN-001`、`DS-BUS-RED-001` |

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/05_test_plan_step_07_test_data.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“Fixture / builder 规则”和“用例到数据集映射”小节，了解本章测试数据如何支撑 P0 用例执行。

本测试方案使用 fixture / builder / seed 方式准备数据,不允许依赖人工临时造数。所有测试数据必须从 `TestRunBuilder` 派生 `run_id`、actor、metadata、fixed clock 和 deterministic id namespace,并以 `run_id` 隔离 source ref、event id、job item key、artifact path 和 report path。

P0 数据集覆盖 publication、transport semantic、delivery、feedback、recovery、read-only output、outbox relay、config、redaction 和 reports。默认数据只包含 ref、digest、metadata 和 bus truth;payload body、raw secret、backend private body、governance decision body 只能作为 negative / redaction fixture 出现。

---

## 9. 待确认事项

当前没有阻塞进入 Step 8 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| 是否允许真实 payload body 进入测试数据 | A. 允许;B. 默认禁止,只在 negative fixture 出现;C. 完全不构造 | 采用 B | bus 不拥有正文真相,但 redaction 需要负例样本 |
| 是否使用真实 MQ / DB 数据 | A. P0 使用真实产品;B. P0 使用 in-memory / fake;C. 全部 mock | 采用 B | P0 目标是验证 port 语义和默认路径,不是生产产品集成 |
| release / acceptance 是否保留数据 | A. 保留 reports 和必要 artifacts;B. 全部删除;C. 全部永久保留 | 采用 A | 验收需要证据,但不应保留无关临时状态 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 基础数据集已定义 | 已满足 |
| 边界、异常、并发、恢复数据已定义 | 已满足 |
| 数据隔离键和清理策略已定义 | 已满足 |
| 外部依赖 fake / stub / real-like 策略已定义 | 已满足 |
| Step 6 P0 / P0-min 用例的数据前置条件可满足 | 已满足 |

结论: 可以进入 Step 8,设计测试环境与配置矩阵。
