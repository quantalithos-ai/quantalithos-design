# Step 8. 设计测试环境与配置矩阵

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 8
- 回填章节：`projects/L0-core/05-测试方案.md` §8

## 2. 本步输入

| 输入 | 内容 | 使用方式 |
|---|---|---|
| Step 4 测试分层 | Unit、Service、Integration、Contract / Worker、E2E / Release gate | 映射不同环境中运行的测试层 |
| Step 6 用例矩阵 | P0 用例及断言点 | 确认每类用例在哪个环境执行 |
| Step 7 测试数据 | fixture、builder、seed、fake / real-like 选择 | 定义环境数据策略和依赖替身 |
| `04-配置设计.md` §6~§12 | profile、7 个 P0 配置项、配置来源优先级、失效模式 | 定义配置矩阵和配置门禁 |

依赖的前序 Step：Step 1~7 已确认。

## 3. SOP 问题回答

1. local / CI / integration / staging 分别测什么?

   回答：local-dev 用于开发者快速验证 unit / service / config smoke；ci-test 用于 PR 阻断的自动化主链；integration 用于真实 adapter 或 real-like file store 的持久化、事务、outbox、job 和配置失效模式；release-like 用于发布前最小闭环、snapshot、relay boundary 和证据归档。staging / production 真实部署语境不在 L0-core P0 测试方案内,由部署运维文档承接。

2. 每个环境依赖哪些服务?

   回答：L0-core 不是常驻服务,P0 测试不依赖真实 L0-bus、真实下游仓库或真实 secret provider。local / CI 依赖 fake store、fake resolver、fake publisher 和临时目录；integration / release-like 可使用 real-like file adapter、临时 job runtime 和 failing port。

3. 哪些 feature flag / config 影响测试结果?

   回答：本轮没有正式 feature flag。影响测试结果的是 7 个 P0 配置项、配置来源优先级、root path cross-field validate、reference resolver fail closed、outbox / audit / idempotency 路径可用性和 profile fixture。

4. 哪些依赖需要 mock 或 fake?

   回答：repository、audit、outbox、publisher、reference resolver、clock、id generator 和 failure injector 在 unit / service 层使用 fake；JSON parser、CLI args、env map、CloudEvent fixture 和 job input 使用 real-like fixture；真实外部服务不在 P0 连接。

5. 环境不可用时如何处理?

   回答：local smoke 不阻断合并；PR CI 不可用视为阻断；integration 环境不可用时必须标记 infra failure 并重跑,不得降级为通过；release-like gate 不可用时不得发布。所有跳过必须有 skip reason 和 evidence gap。

## 4. 当前文档问题诊断

| 位置 | 问题 | 影响 |
|---|---|---|
| `05-测试方案.md` §4 | 环境矩阵仍围绕 shared primitive admission 和 registry | 与新版 contract definition / snapshot / outbox / job / config 不匹配 |
| `05-测试方案.md` §4 | 没有承接 `04-配置设计.md` 的 profile 与 7 个 P0 配置项 | 配置测试无法定位到具体配置项 |
| `05-测试方案.md` §4 | 没有说明 L0-core 不是常驻服务 | 容易误写成 service staging / production 测试方案 |
| `05-测试方案.md` §4 | 环境不可用处理不明确 | CI 失败、infra failure 和真实缺陷容易混淆 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 环境口径 | dev / test / integration 粗粒度 | local-dev / ci-test / integration / release-like | 对齐配置 profile 和测试层 |
| 配置项 | 未列当前配置 | 映射 7 个 P0 配置项、来源优先级和失效模式 | 承接 `04-配置设计.md` |
| 依赖服务 | 默认 registry / bus 消费 | fake / real-like adapter,不接真实 L0-bus | 保持 L0-core 边界 |
| 环境失败 | 未定义 | 区分 infra failure、skip reason、阻断级别 | 支撑 CI/CD 门禁 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 用单一 test 环境跑全部用例 | 简单 | 无法区分 PR、integration、release gate 的成本和风险 | 不采用 |
| B. 为 L0-core 建常驻 staging 服务 | 接近在线服务测试 | 与 L0-core library + CLI/job 定位不符 | 不采用 |
| C. 按 profile + 测试层定义 local / CI / integration / release-like | 能表达执行位置、配置和阻断级别 | 需要维护配置矩阵 | 采用 |
| D. 真实连接下游仓库和 L0-bus | 可做系统验证 | 超出 L0-core P0 范围 | 只作为后续系统级 E2E |

## 7. 结构化中间产物

### 7.1 环境矩阵

| 环境 | 用途 | 依赖服务 | 关键配置 / feature flag | 数据策略 | 风险 |
|---|---|---|---|---|---|
| local-dev | 开发者快速验证 | fake repository、fake audit、fake outbox、fake resolver、temp dir | defaults + local JSON + env / CLI override | builder + fixture,单机临时目录 | 本地环境差异导致偶发失败 |
| ci-test | PR 阻断主链 | deterministic fake adapter、temp dir、fixed clock | defaults + test JSON + env | `test_run_id` namespace,并发隔离 | CI 资源不足或路径权限差异 |
| integration | adapter / persistence / worker 集成 | real-like file adapter、failing port、fake publisher | integration JSON,显式 root path | namespace cleanup + temp root | 失败需区分 infra 与缺陷 |
| release-like | 发布前最小闭环和证据归档 | real-like adapter、job binary、outbox relay boundary、fake bus publisher | versioned JSON + env + CLI | clean runtime fixture,保留 evidence artifact | 成本较高,只跑 P0 gate |
| staging-integration(P1) | 真实系统联调 | 真实 L0-bus / 下游仓库 / secret provider | 部署运维文档定义 | 脱敏数据 | 不属于 L0-core P0 |

### 7.2 配置矩阵

| 配置测试项 | local-dev | ci-test | integration | release-like | 关联用例 |
|---|---|---|---|---|---|
| defaults 可用 | smoke | 必测 | 必测 | 必测 | TC-CONFIG-001 |
| file config 覆盖 defaults | 可选 | 必测 | 必测 | 必测 | TC-CONFIG-001 |
| env 覆盖 file | 可选 | 必测 | 必测 | 必测 | TC-CONFIG-001 |
| CLI 覆盖 env | 可选 | 必测 | 必测 | 必测 | TC-CONFIG-001 |
| root path 不可读 / 不可写 | 可选 | 必测 | 必测 | 必测 | TC-CONFIG-002 |
| audit / outbox / idempotency root 冲突 | 可选 | 必测 | 必测 | 必测 | TC-CONFIG-002 |
| reference resolver config invalid | 可选 | 必测 | 必测 | 必测 | TC-CONFIG-003 |
| raw secret 禁止进入配置 | 可选 | 必测 | 必测 | 必测 | TC-CONFIG-003 |

### 7.3 环境拓扑图

#### 环境图: L0-core 测试环境拓扑

```text
Developer / CI / Release gate
  |
  v
L0-core test runner
  |
  +--> fake / real-like repository
  +--> fake audit / audit temp root
  +--> fake outbox / outbox temp root
  +--> fake reference resolver
  +--> job binary / worker entry
  |
  v
Evidence artifacts
```

关键说明:

- L0-core P0 测试不连接真实 L0-bus,只验证 outbox / CloudEvent / relay boundary。
- 配置输入来自 defaults、JSON file、env 和 CLI args,且必须能定位到具体 profile fixture。
- release-like 是发布前近真实演练,不是常驻 staging 服务。

### 7.4 环境不可用处理表

| 环境 | 不可用处理 | 是否阻断 | 证据要求 |
|---|---|---|---|
| local-dev | 记录本地失败,开发者自行重跑 | 否 | 本地日志即可 |
| ci-test | 标记 infra failure 后重跑;重复失败则阻断 | 是 | CI job log + failure class |
| integration | 先判定 adapter / path / permission 是否环境问题;不得静默跳过 | 是 | integration report + skip reason |
| release-like | 不可用即 release gate 未通过 | 是 | release gate report + evidence gap |

## 8. 回填草稿

```md
## 8. 测试环境与配置矩阵

> 校准来源：
> - `design-calibration/05_test_plan_step_08_env_config.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“环境矩阵”“配置矩阵”“环境拓扑图”和“环境不可用处理表”小节,了解 L0-core library + CLI/job 的测试环境如何承接配置设计。

L0-core 不是常驻在线服务。本章的环境定义用于测试执行和配置 profile 选择,不是部署 topology。P0 环境分为 local-dev、ci-test、integration 和 release-like；staging-integration 属于后续系统级联调。

| 环境 | 用途 | 依赖服务 | 关键配置 / feature flag | 数据策略 | 风险 |
|---|---|---|---|---|---|
| local-dev | 开发者快速验证 | fake repository、fake audit、fake outbox、fake resolver、temp dir | defaults + local JSON + env / CLI override | builder + fixture,单机临时目录 | 本地环境差异导致偶发失败 |
| ci-test | PR 阻断主链 | deterministic fake adapter、temp dir、fixed clock | defaults + test JSON + env | `test_run_id` namespace,并发隔离 | CI 资源不足或路径权限差异 |
| integration | adapter / persistence / worker 集成 | real-like file adapter、failing port、fake publisher | integration JSON,显式 root path | namespace cleanup + temp root | 失败需区分 infra 与缺陷 |
| release-like | 发布前最小闭环和证据归档 | real-like adapter、job binary、outbox relay boundary、fake bus publisher | versioned JSON + env + CLI | clean runtime fixture,保留 evidence artifact | 成本较高,只跑 P0 gate |

配置测试必须覆盖 defaults、JSON file、env、CLI args 的优先级,并覆盖 root path、cross-field validate、reference resolver fail closed 和 raw secret 禁止规则。
```

## 9. 待确认事项

- 是否接受 release-like 只连接 real-like adapter 和 fake bus publisher,不连接真实 L0-bus。
- 是否接受 staging-integration 作为 P1 系统级联调,不进入 L0-core P0 测试环境矩阵。

## 10. 进入下一步条件

- [x] P0 自动化测试环境可定位。
- [x] P0 人工 / release-like 验证环境可定位。
- [x] 配置来源、配置项、失效模式和 profile fixture 已映射。
- [x] 可以进入 Step 9 设计自动化与 CI/CD 门禁。
