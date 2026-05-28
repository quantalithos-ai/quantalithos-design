# Step 4. 制定测试策略与分层

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 4
- 回填章节：`projects/L0-core/05-测试方案.md` §4

## 2. 本步输入

| 输入 | 内容 | 使用方式 |
|---|---|---|
| Step 3 测试对象与切口 | P0 测试对象按模块、接口、状态、一致性、配置、观测抽取 | 映射到测试层级 |
| `03-详细设计.md` §5~§15 | 模块边界、协议、处理流、状态机、事务、错误、幂等、配置、观测审计 | 判断风险最早应在哪一层发现 |
| `04-配置设计.md` §6~§12 | profile、配置项、加载校验、失效模式、下游承接 | 纳入配置测试层级 |

依赖的前序 Step：Step 1~3 已确认。

## 3. SOP 问题回答

1. 哪些问题必须在 unit 层发现?

   回答：领域对象不变量、value object 校验、policy 判断、状态允许 / 禁止迁移、DTO 序列化和 CloudEvent payload 局部字段约束应在 unit 层发现。这些问题不需要真实 repository 或 runtime wiring,越早发现越低成本。

2. 哪些问题必须在 service 层验证编排?

   回答：Command / Query / Job 对 application service 的编排、port 调用顺序、事务边界意图、错误映射、幂等调用壳、audit / outbox 副作用是否被触发,应通过 fake ports 的 service tests 验证。

3. 哪些问题必须依赖 DB / adapter / worker 集成测试?

   回答：文件型 source / snapshot store、repository expected version、UnitOfWork、audit / outbox / idempotency store、projection store、reference resolver adapter、runtime wiring、outbox relay 需要 integration tests。它们验证真实持久化、路径、权限、失败注入和 worker 状态更新。

4. 哪些问题需要 API / contract test?

   回答：Command / Query DTO、Event CloudEvent data、Job input / output、CLI 参数 / JSON payload / exit code / error response 都需要 API / contract tests。L0-core 当前不提供 HTTP / RPC,所以这里的 API / contract test 指 CLI command、Rust DTO contract、job binary contract 和 event contract。

5. 哪些场景才需要 E2E 或 release gate?

   回答：只把最小跨模块闭环放入 E2E / release gate: create draft -> submit review -> publish baseline -> derive snapshot -> query snapshot / trace -> publish fact -> outbox relay boundary。E2E 不覆盖所有边界值,也不测试 L0-bus runtime、SDK 高层或 L1 业务。

## 4. 当前文档问题诊断

| 位置 | 问题 | 影响 |
|---|---|---|
| `05-测试方案.md` §2 | 分层名称有 unit / integration / event chain 等,但内容仍围绕旧 registry | 不能覆盖新版 P0 风险 |
| `05-测试方案.md` §2 | 没有明确 service test 与 integration test 边界 | application 编排和 adapter 实现容易混测 |
| `05-测试方案.md` §8 | CI 门禁没有与分层风险绑定 | 失败是否阻断不清楚 |
| `05-测试方案.md` 全文 | E2E 主线不对应当前 create / publish / snapshot / outbox 闭环 | release gate 无法证明新版主线成立 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| Unit | shared primitive validation | domain object、policy、DTO、state transition | 回到当前领域对象和协议 |
| Service | registry + admission service | application service + fake ports | 验证编排和事务意图 |
| Integration | registry repo / consume builders | file stores、repositories、UoW、audit、outbox、projection、runtime config | 覆盖真实 adapter 风险 |
| API / Worker | event chain | CLI / DTO / Job / Event contract | 当前对外入口是 CLI / library / job / outbox |
| E2E | register -> consume -> replay | draft -> review -> publish -> snapshot -> query -> fact -> relay boundary | 对齐当前能力闭环 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 采用标准测试金字塔并直接套用 unit / integration / e2e | 简单 | 不体现 L0-core 的 CLI / job / outbox 特性 | 不采用 |
| B. 以 unit / service / integration / contract-worker / E2E-release gate 五层组织 | 可定位风险,匹配当前架构 | 需要明确每层边界 | 采用 |
| C. 强化 E2E,减少低层测试 | 看起来接近真实使用 | 失败定位困难,覆盖成本高 | 不采用 |

## 7. 结构化中间产物

### 7.1 测试分层图: L0-core 测试金字塔

```text
[Unit tests]
  - domain object / value object / policy / DTO / state rule
        |
        v
[Service tests]
  - application service + fake ports + transaction intent
        |
        v
[Integration tests]
  - file stores / repositories / UnitOfWork / config / adapters
        |
        v
[Contract and Worker tests]
  - CLI / DTO / CloudEvent / job binary / outbox relay
        |
        v
[E2E / Release gate]
  - minimal contract lifecycle + snapshot + fact output boundary
```

关键说明:

- Unit 层优先发现领域规则、状态机和 DTO 漂移。
- Service 层验证 application 编排,不绑定具体 adapter。
- Integration 层验证真实持久化、配置、adapter failure 和 runtime wiring。
- Contract / Worker 层验证二进制入口、job、CloudEvent 和 outbox relay。
- E2E 只覆盖最小闭环,不替代下层测试。

### 7.2 测试分层表

| 层级 | 目标 | 典型内容 | 执行时机 | 失败处理 |
|---|---|---|---|---|
| Unit | 验证局部不变量和纯规则 | `ContractDefinition` lifecycle、policy、DTO roundtrip、CloudEvent data 局部字段 | PR | 阻断 |
| Service | 验证用例编排、事务意图和错误映射 | `ContractChangeService`、`ContractReleaseService`、`ContractTraceService`、fake ports | PR / CI | 阻断 |
| Integration | 验证 adapter、repository、UoW、配置和文件系统行为 | file stores、audit、outbox、idempotency、projection、runtime wiring | CI | 阻断 |
| Contract / Worker | 验证二进制入口和协议契约 | CLI command、query、job binary、outbox relay、CloudEvent envelope | CI / nightly | P0 阻断 |
| E2E / Release gate | 验证最小跨模块闭环 | draft -> review -> publish -> snapshot -> trace -> fact -> relay boundary | release-like / release gate | 阻断发布 |

### 7.3 切口到层级映射表

| 切口 | 首选层级 | 补充层级 | 说明 |
|---|---|---|---|
| lifecycle / state transition | Unit | Service | Unit 验证状态矩阵;service 验证调用路径 |
| command flow | Service | Contract / E2E | service 验证编排;contract 验证入口;E2E 只测主线 |
| query flow | Service / Integration | Contract | service 验证只读语义;integration 验证 projection |
| outbox atomics | Integration | Worker | integration 验证写入;worker 验证 relay |
| job rerun / recovery | Worker / Integration | E2E | worker 验证幂等和失败;E2E 只测一条恢复样本 |
| config load / validate | Integration | Contract | integration 验证 runtime wiring;CLI contract 验证 flags / errors |
| trace / audit evidence | Service / Integration | E2E | service 验证调用;integration 验证落盘和证据 |

## 8. 回填草稿

```md
## 4. 测试策略与分层

> 校准来源：
> - `design-calibration/05_test_plan_step_04_strategy_layers.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“测试分层图”“测试分层表”“切口到层级映射表”和“待确认事项”小节,了解每类风险应在哪个测试层级被发现。

本轮测试采用 unit / service / integration / contract-worker / E2E-release gate 五层策略。测试层级服务于风险定位,不是简单堆叠用例数量。领域规则和状态机优先在 unit 层发现;application 编排在 service 层发现;持久化、配置和 adapter 失败在 integration 层发现;CLI、DTO、Job、CloudEvent 和 outbox relay 在 contract-worker 层发现;E2E 只覆盖最小契约生命周期和事实输出闭环。

#### 测试分层图: L0-core 测试金字塔

```text
[Unit tests]
  -> [Service tests]
  -> [Integration tests]
  -> [Contract and Worker tests]
  -> [E2E / Release gate]
```

| 层级 | 目标 | 典型内容 | 执行时机 | 失败处理 |
|---|---|---|---|---|
| Unit | 验证局部不变量和纯规则 | domain object、policy、DTO、state rule | PR | 阻断 |
| Service | 验证用例编排和错误映射 | application service + fake ports | PR / CI | 阻断 |
| Integration | 验证 adapter、repository、UoW、配置 | file stores、audit、outbox、projection、runtime wiring | CI | 阻断 |
| Contract / Worker | 验证入口和协议契约 | CLI、job binary、CloudEvent、outbox relay | CI / nightly | P0 阻断 |
| E2E / Release gate | 验证最小跨模块闭环 | draft -> publish -> snapshot -> trace -> fact -> relay boundary | release-like | 阻断发布 |
```

## 9. 待确认事项

- 是否接受 Contract / Worker 作为单独测试层级,用于承载 CLI / job / event / relay。
- 是否接受 E2E 只覆盖最小闭环,不覆盖全部边界场景。

## 10. 进入下一步条件

- [x] 测试分层可以覆盖 Step 3 全部 P0 切口。
- [x] 每个层级的目标、典型内容、执行时机和失败处理已明确。
- [x] 可以进入 Step 5 建立需求追溯与覆盖矩阵。
