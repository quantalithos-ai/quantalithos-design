# L0-bus 07 实施计划 Step 8: 配置、环境与外部依赖准备

> 本文件是 `projects/L0-bus/07-实施计划.md` 的 Step 8 中间产物。
> 本步定义实施前和阶段前必须准备的配置、环境、外部依赖、跨仓依赖和 fake / in-memory 使用边界。
> 本步不创建或修改正式 `07-实施计划.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 8 |
| 主题 | 定义配置、环境与外部依赖准备 |
| 状态 | 已确认 |
| 正式回填位置 | `07-实施计划.md` §8 |
| 是否修改正式 `07-实施计划.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_03_prerequisites_reading.md` | 已确认 | 继承目标仓、sibling repo、path dependency、scripts、artifacts、reports 前置结论 |
| `07_implementation_plan_step_05_phases_dependencies.md` | 已确认 | 继承 PH-01~PH-08 使用阶段 |
| `07_implementation_plan_step_07_tests_acceptance_gates.md` | 已确认 | 继承每阶段测试、验收、artifact 和 report 门禁 |
| `03-详细设计.md` §13 | 已完成 | 提取 `RuntimeConfig`、外部依赖绑定和禁止配置化边界 |
| `04-配置设计.md` §3~§12 | 已完成 | 提取配置来源、profile、配置项、敏感引用、加载校验和失效模式 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已完成 | 区分编译期依赖、运行期依赖和事件协作依赖 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 哪些外部服务或仓是实施前置依赖 | P0 硬前置只有 `/home/aris/Projects/quantalithos-core/crates/contracts`。目标实现仓 `/home/aris/Projects/quantalithos-bus` 当前不存在,由 PH-01 创建。真实 MQ / DB / SDK / governance / observability 不是 P0 前置服务。 |
| 2. 哪些依赖只在特定阶段需要 | `core-contracts` 从 PH-01 起需要;publication fixture 从 PH-02;fake backend 从 PH-03;outbox fixture source 从 PH-04;feedback / timeout fixtures 从 PH-05;recovery fixtures 从 PH-06;projection / publisher sink 从 PH-07;report / acceptance tooling 从 PH-08。 |
| 3. 哪些配置项必须在本地或 CI 环境准备 | local-dev、ci-test、integration-test、operations-recovery profile;store、outbox_source、transport_backend、publisher、api、worker、job、projection、security boundary 配置;artifact / report root 和 run_id。 |
| 4. 是否允许 fake / mock,允许到什么阶段为止 | P0 允许 fake / in-memory 贯穿 PH-01~PH-08,用于证明默认可验证路径。fake 不是生产能力声明,不得在 handoff 中误写为 production adapter 完成。 |
| 5. 外部依赖不可用时是暂停、降级还是替代 | 编译期 `core-contracts` 不可用必须暂停;目标仓不存在由 PH-01 创建;运行期 MQ / DB / publisher / source 不可用使用 fake / in-memory;真实下游不可用使用 fixture / fake consumer;redaction 或 report 工具不可用则阻断对应阶段。 |
| 6. 哪些依赖需要由其他团队或仓提供 | L0-core 提供 `core-contracts`;未来 adapter owner 提供生产 MQ / durable store;governance 提供 approval / decision truth;observability 提供 dashboard / long-term store;SDK 提供高层客户端。这些均不阻塞当前 P0。 |
| 7. 已实现仓库依赖是否已经在 `/home/aris/Projects` 下存在 | 当前存在 `quantalithos-core`,且 `/home/aris/Projects/quantalithos-core/crates/contracts` 存在。当前未发现 `/home/aris/Projects/quantalithos-bus`。 |
| 8. 哪些依赖是编译期依赖,Cargo 本地 path dependency 写法是否已经与详细设计一致 | 唯一编译期依赖是 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`,与 `03-详细设计.md` 一致。 |
| 9. 哪些依赖是运行期依赖或事件协作依赖,应该如何表达 | committed outbox source、bus store、transport backend、outbound publisher、observability、governance、SDK、publisher / subscriber 都不是 Cargo path dependency;分别用 port、adapter、event、projection、fixture、fake consumer 或 report evidence 表达。 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 编译期依赖和运行期依赖容易混淆 | L0-bus 同时依赖 L0-core 契约和事件协作边界 | 可能把 MQ / downstream 写成 Cargo path dependency | 明确只有 `core-contracts` 是 path dependency |
| fake / in-memory 边界需要收紧 | P0 默认路径依赖 fake / in-memory | 可能被误声明为生产 adapter 完成 | 定义 fake 使用边界和 handoff 声明 |
| 配置项与阶段关系未落到实施计划 | `04` 写了配置设计,Step 5 写了阶段 | 实施者不知道哪个阶段准备哪些 profile | 输出配置与阶段矩阵 |
| 目标仓不存在 | `/home/aris/Projects/quantalithos-bus` 未发现 | 实施者可能在 design 仓写代码 | PH-01 明确创建目标仓 |
| artifact / report root 属于配置环境的一部分 | 测试和验收强依赖固定路径 | 路径错误会阻断验收 | 写入环境检查和失败处理 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 外部依赖 | 散落在详细设计、配置设计和测试方案中 | 形成依赖准备表 | 实施者可逐项检查 |
| 配置准备 | 只知道 P0 profile 存在 | 按阶段列出 profile、root、失败处理 | 降低运行时配置错误 |
| fake / mock | 只在多个文档中提到 | 明确 P0 允许范围和禁止误声明 | 防止范围膨胀 |
| 不可用处理 | 缺少统一口径 | 编译期暂停,运行期 fake,证据工具阻断 | 避免临场判断 |
| 跨仓依赖 | 可能被统一当 repo dependency | 区分编译期、运行期、事件协作 | 保持架构依赖正确 |

---

## 6. 实施设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 等真实 MQ / DB / publisher 都就绪再实施 | 接近最终生产 | 阻塞 P0,违反默认可验证路径 | 不采用 |
| P0 使用 in-memory / fake / fixture | 可独立实现、测试和验收 | 生产化风险后置 | 采用 |
| 所有 Quantalithos 仓都用 path dependency | 编译期方便 | 错误表达运行期和事件协作依赖 | 不采用 |
| 仅 `core-contracts` 使用 path dependency | 与全局依赖规则一致 | 需要为其他依赖写 fake / port | 采用 |
| config center / hot reload 提前做 | 未来扩展自然 | P2 非范围,增加风险 | 不采用 |
| 严格 JSON + env override + cold start validation | 可测试、可审计、边界清楚 | 不支持运行期热更新 | 采用 |

---

## 7. 结构化中间产物

### 7.1 外部依赖准备表

| 依赖项 | 类型 | 全局依赖类型 | 使用阶段 | 提供方 | 检查方式 | 不可用时处理 |
|---|---|---|---|---|---|---|
| 目标实现仓 | repo | 不适用 | PH-01 | 实施者 | 检查 `/home/aris/Projects/quantalithos-bus` | 不存在则 PH-01 创建;不得在 design 仓实现 |
| `core-contracts` | repo / crate | 编译期依赖 | PH-01~PH-08 | L0-core | 检查 `/home/aris/Projects/quantalithos-core/crates/contracts/Cargo.toml` package `core-contracts` / lib `core_contracts` | 不可用则暂停编译期阶段 |
| L0-core committed outbox source | event source / fixture | 运行期依赖 / 事件来源 | PH-04 | L0-core / fixture | `OutboxFactSourcePort` + committed fact fixture | P0 使用 fixture source;真实服务不可用不阻塞 |
| bus store | store adapter | 运行期依赖 | PH-02~PH-08 | L0-bus infra | `StoreConfig.kind=in_memory`、repository tests | P0 使用 in-memory;durable store 后置 |
| transport backend / MQ backend | service / adapter | 运行期依赖 | PH-03~PH-08 | L0-bus infra / future adapter owner | `TransportBackendPort` fake / in-memory tests | P0 使用 fake backend;生产 MQ 不可用不阻塞 |
| outbound publisher / event bus | event publisher | 事件协作依赖 | PH-07~PH-08 | L0-bus infra / future L0-bus backend | `OutboxPublisherPort` + in-memory sink | P0 使用 in-memory sink;真实 publisher 后置 |
| publisher / subscriber business repos | external repo / event collaborator | 事件协作依赖 | PH-02~PH-08 | 下游业务仓 | publication / feedback fixture 和 fake subscriber | 不依赖业务仓源码;fixture 不可用则暂停对应阶段 |
| governance approval / decision truth | external domain | 运行期 / 协作边界 | PH-06~PH-08 | governance 仓 | approval ref / audit chain fixture | P0 用 ref fixture;不得生成 governance decision body |
| observability / archive | external domain | 事件协作 / 只读消费 | PH-07~PH-08 | observability / archive 仓 | tap output、audit material、report evidence | 真实 dashboard 不可用不阻塞 |
| L0-sdk | external repo | 只读消费 / SDK 后置 | PH-07~PH-08 | L0-sdk | Query / event / view contract 可消费检查 | 不做 SDK high-level client;不可用不阻塞 |
| report / check scripts | tool | 不适用 | PH-01、PH-08 | L0-bus repo | `scripts/reports/*`、`scripts/checks/*` args smoke | 不可用阻断对应阶段 |

### 7.2 配置与环境检查表

| 配置 / 环境项 | 使用阶段 | 要求 | 检查方式 | 失败处理 |
|---|---|---|---|---|
| Rust toolchain | PH-01~PH-08 | 可执行 workspace build / test | `rustc --version`、`cargo --version` | 暂停实施并补齐工具链 |
| project git config | PH-01~PH-08 | 项目级 `quantalithos-labs` / `quantalithos.ai@gmail.com` | `git config user.name` / `user.email` | 提交前修正 |
| local-dev profile | PH-01~PH-08 | defaults + local JSON,in-memory adapters | config smoke | 不通过则阻断 PH-01 |
| ci-test profile | PH-01~PH-08 | deterministic fixture、fake refs、artifact root | CI config test | 不通过则阻断 PR / CI gate |
| integration-test profile | PH-03~PH-08 | fake source、fake backend、fake publisher | integration config test | 不通过则阻断集成阶段 |
| operations-recovery profile | PH-06~PH-08 | recovery job args、fake approval / audit chain | recovery config test | 不通过则阻断 PH-06 |
| artifact root | PH-01~PH-08 | `artifacts/test/<run_id>` | path check / report link check | 修正路径并重跑 |
| report root | PH-01~PH-08 | `reports/`、`reports/runs/<run_id>`、`reports/acceptance` | report generator smoke | 阻断 report / acceptance 阶段 |
| no-latest rule | PH-01~PH-08 | 正式引用不得使用 `latest` | grep / check script | 发现即修正 |
| no project layer rule | PH-01~PH-08 | 不使用 `artifacts/test/<project>/<run_id>` 或 `reports/<project>` | path check | 发现即修正 |
| secret / connection refs | PH-01~PH-08 | 只使用 ref,禁止 raw secret | config validator / redaction check | fail-closed,不得继续 |

### 7.3 阶段配置矩阵

| 阶段 | 必备配置 / 环境 | 允许 fake / in-memory | 禁止项 |
|---|---|---|---|
| PH-01 | local-dev、ci-test、artifact root、report root、`core-contracts` path | in-memory defaults | 在 design 仓写代码、使用全局 git config 替代项目级配置 |
| PH-02 | publication fixture、store in-memory、audit enabled、redaction enabled | in-memory store | payload body fallback、关闭 audit |
| PH-03 | backend capability fixture、transport backend in-memory、delivery job profile | fake backend | backend raw status 直接成为 transport semantic |
| PH-04 | committed outbox fact fixture、source cursor profile、source idempotency store | fixture source | 未提交 outbox fact、source ack before commit |
| PH-05 | feedback fixture、timeout fixture、idempotency store | fake backend signal / timeout signal | duplicate 生成新 truth、unknown feedback 生成孤儿事实 |
| PH-06 | recovery fixture、approval ref fixture、audit chain fixture、operations-recovery profile | fake approval / audit chain refs | replay 绕过 DLQ / history / audit chain |
| PH-07 | projection store、publisher in-memory sink、tap output、redaction check | in-memory projection / sink / fake consumer | Query 自动 rebuild、failure material 生成 governance decision |
| PH-08 | release-like config、fixed run_id、report scripts、acceptance templates | fake / in-memory P0 evidence | `latest`、非法路径、P1/P2 误声明为 P0 |

### 7.4 fake / mock 使用边界

| fake / mock | 允许阶段 | 用途 | 必须证明 | 禁止声明 |
|---|---|---|---|---|
| in-memory store | PH-01~PH-08 | P0 repository / UoW 默认路径 | state、history、idempotency、projection 语义正确 | durable store 已完成 |
| fixture outbox source | PH-04~PH-08 | committed fact ingestion | committed-only、duplicate、ack failure replay | 真实 L0-core source 已联通 |
| fake transport backend | PH-03~PH-08 | delivery / backend capability 默认路径 | available / unsupported / unavailable / commit uncertain 语义 | production MQ adapter 已完成 |
| in-memory publisher sink | PH-07~PH-08 | outbound event schema 和 publish failure evidence | committed truth 后发布、failure 不回滚 truth | 真实 event bus 已完成 |
| fake governance refs | PH-06~PH-08 | replay approval / audit chain guard | missing approval rejected、ready 条件正确 | governance decision truth 已实现 |
| fake observer / consumer | PH-07~PH-08 | tap / projection / outbound event 可消费证明 | forbidden body absent、view stable | observability dashboard 或 SDK client 已完成 |

### 7.5 Cargo path dependency 约束

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

| 规则 | 说明 |
|---|---|
| 只允许编译期依赖使用 path dependency | 当前仅 `core-contracts` 符合 |
| 运行期依赖不得写成 path dependency | MQ、store、publisher、governance、observability、SDK 通过 port / adapter / event / projection / fake 表达 |
| 当前不要求 public crates.io | 后续发布策略另行决策 |
| private git tag / rev 是中期方案 | 不替代本地 sibling repo 检查 |
| 依赖版本 / commit 必须记录 | PH-08 handoff 需要 dependency snapshot |

---

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §8。

```markdown
## 8. 配置、环境与外部依赖准备

> 校准来源：
> - `design-calibration/07_implementation_plan_step_08_config_env_dependencies.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“外部依赖准备表”“配置与环境检查表”“阶段配置矩阵”“fake / mock 使用边界”和“Cargo path dependency 约束”小节，了解本轮实施哪些依赖是硬前置、哪些只能作为 fake / in-memory 默认路径、哪些必须后置。

本轮 P0 硬前置编译期依赖只有 L0-core `core-contracts`。目标实现仓固定为 `/home/aris/Projects/quantalithos-bus`,当前不存在时由 PH-01 创建。`core-contracts` 当前使用本地 path dependency:

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

运行期 MQ / store / publisher、governance、observability、SDK、publisher / subscriber 业务仓均不得写成 Cargo path dependency。P0 通过 port、adapter、event、projection、fixture、fake consumer 和 in-memory 默认路径验证。

正式内容从 `design-calibration/07_implementation_plan_step_08_config_env_dependencies.md` §7.1~§7.5 摘录。
```

---

## 9. 待确认事项

| 事项 | 当前结论 | 影响 | 建议 |
|---|---|---|---|
| `/home/aris/Projects/quantalithos-bus` 不存在 | PH-01 创建 | 不阻塞文档,阻塞实际编码前置 | 接受,写入 PH-01 |
| 是否提前接真实 MQ / durable store | 当前非 P0 | 提前会扩大范围 | 不接,保留 port + fake |
| 是否需要 public crates.io / GitHub dependency | 当前不需要 | 影响构建分发而非 P0 实施 | 使用本地 sibling path,中期再切 private git tag / rev |
| 是否允许 hot reload | 当前不允许 | 会破坏 runtime graph 冷启动验证 | reload request rejected,后续 P2 |

建议方案: 接受当前配置与依赖准备方案。原因是它把唯一硬依赖缩到 `core-contracts`,其余能力通过可测试边界表达,符合 P0 默认可验证路径和全局依赖规则。

---

## 10. 进入下一步条件

- 关键依赖均有检查方式和失败处理。
- 已明确只有 `core-contracts` 使用本地 Cargo path dependency。
- 已明确运行期和事件协作依赖使用 port / adapter / event / projection / fixture / fake 表达。
- 已明确 local-dev、ci-test、integration-test、operations-recovery profile 的阶段用途。
- 可以进入 Step 9,继续定义 Spike、风险与待确认事项。
