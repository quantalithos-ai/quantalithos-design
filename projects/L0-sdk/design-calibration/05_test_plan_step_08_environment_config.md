# L0-sdk 05 测试方案 Step 8:设计测试环境与配置矩阵

> 所属流程:`05_test_plan_calibration_flow.md`
> 对应正式文档:`projects/L0-sdk/05-测试方案.md` §8 测试环境与配置矩阵
> 状态:已完成
> 日期:2026-05-31

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 8 |
| 主题 | 设计测试环境与配置矩阵 |
| 当前状态 | 已完成 |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L0-sdk/design-calibration/05_test_plan_step_08_environment_config.md` |

本步定义 P0 测试在哪些 profile 中运行、每个 profile 依赖哪些外部能力、配置如何影响测试结果,以及环境不可用时如何处理。自动化命令、CI gate 和报告归档分别留给 Step 9 和 Step 13。

## 2. 本步输入

| 输入 | 本步使用方式 |
|---|---|
| `05_test_plan_step_06_cases.md` | 继承 `TC-SDK-*` 用例和自动化候选 |
| `05_test_plan_step_07_test_data.md` | 继承 `DS-SDK-*` 数据集、`run_id` 隔离、artifact / report 路径和 fake / stub / real-like 策略 |
| `04-配置设计.md` §6 | 继承 `local-dev`、`ci-test`、`integration-test`、`candidate-validation`、`staging-like`、`production-like` profile |
| `04-配置设计.md` §7~§9 | 继承 11 个配置组、严格 JSON、加载优先级、fail-fast 和 builder 装配规则 |
| `04-配置设计.md` §11~§12 | 继承配置失效模式和对测试 / 验收的下游承接 |
| `01-架构设计.md` / `03-详细设计.md` | 继承 L0-sdk 与 L0-core、L0-bus、formal API、runner、artifact / report 的依赖方向 |

## 3. SOP 问题回答

### 3.1 local / CI / integration / staging 分别测什么?

| 环境 / profile | 测试重点 | 是否 P0 阻断 |
|---|---|---|
| `local-dev` | 本地手动 CLI / job、client facade 调试、最小 smoke、配置加载和 fake boundary 调试 | 是,用于开发者本地准入 |
| `ci-test` | unit / service / contract / config / redaction / deterministic fixture gate | 是,用于自动化主门禁 |
| `integration-test` | repository、adapter、projection、runner、event boundary、artifact filesystem 的跨 crate 集成 | 是,用于 P0 集成门禁 |
| `candidate-validation` | 三语言 package candidate、docs examples、cross-language smoke、compatibility evidence | 是,用于 candidate gate |
| `staging-like` | 后续真实消费者和 real-like formal / bus boundary 演练 | 否,P1 |
| `production-like` | 后续真实 endpoint、credential provider、registry 和运维承接 | 否,P1/P2 |

### 3.2 每个环境依赖哪些服务?

| 环境 / profile | 依赖服务 / 资源 |
|---|---|
| `local-dev` | local sibling contract crates、fixture source、fake endpoint、fake bus boundary、local process runner、filesystem artifact / report store |
| `ci-test` | local path contract crates 或锁定 fixture snapshot、temporary directory、fake adapters、deterministic runners、redaction scanner |
| `integration-test` | local contract crates、fixture-backed formal boundary、real-like local process、fake / replay bus boundary、filesystem store |
| `candidate-validation` | language generator、package builder、docs runner、smoke runner、compatibility runner、artifact / report filesystem |
| `staging-like` | real-like formal API、real-like bus boundary、secret / credential refs、observability consumer |
| `production-like` | real formal API、real bus boundary、credential provider、registry / artifact / report operation system |

### 3.3 哪些 feature flag / config 影响测试结果?

L0-sdk P0 不引入独立 feature flag 作为测试真相源。影响测试结果的是配置组和 policy 项。

| 配置 / policy | 影响的测试 |
|---|---|
| `sources.core_contracts_path` / `sources.bus_contracts_path` | contract compile、upstream snapshot freshness、semantic baseline |
| `sources.formal_api_snapshot_ref` | formal API snapshot、derived view、compatibility |
| `boundaries.fake_endpoint_ref` | service capability fake boundary、fake marker guard |
| `boundaries.bus_event_boundary_ref` | event semantic mapping、event replay / fake publish |
| `runners.generator_profile` / `runners.validation_profile` | candidate generation、docs、smoke、compatibility evidence |
| `artifacts.root` / `artifacts.report_root` | artifact digest、report path、redaction scan |
| `outbox.kind` / `projections.kind` | outbox retry、projection rebuild、read model stale / fresh |
| `language_packages.enabled_languages` | Rust / Python / TypeScript coverage |
| `policies.redaction` | raw body / secret / report scan gate |
| `policies.credential_protection` | ref-only credential and secret boundary |
| `policies.fake_marker_required` | fake success cannot become production truth |
| `policies.compatibility_gate` | `Stable` candidate and compatibility decision |
| `jobs.require_run_id` | artifact / report / idempotency isolation |

### 3.4 哪些依赖需要 mock 或 fake?

| 依赖 | P0 替身策略 |
|---|---|
| formal API runtime endpoint | 默认 fake boundary;integration 可用 real-like local process |
| bus event collaboration | fake boundary 或 event replay;不启动真实 bus runtime |
| runner / generator / package builder | unit / service 用 stub;integration / candidate 用 local process runner |
| credential provider | P0 不接入真实 provider;只使用 fake ref / credential ref |
| public registry | P0 不接入;candidate 只做 local install / smoke |
| external observability consumer | P0 不接入;使用 artifact / report / log scanner |

### 3.5 环境不可用时如何处理?

| 不可用对象 | 处理方式 |
|---|---|
| compile path contract crates 不可用 | 对应 compile / contract suite fail-fast;不得复制 core / bus 类型替代 |
| fixture snapshot 不可读 | 对应 source / semantic / compatibility 用例失败或标记 stale / pending |
| fake endpoint / fake bus boundary 不可用 | P0 suite fail-fast,因为 fake 是默认测试边界 |
| local process runner 不可用 | runner evidence 标记 failed / skipped,不得视为 passed |
| artifact / report root 不可写 | fail-fast,不得继续生成不完整证据 |
| staging-like / production-like 外部服务不可用 | 不阻断 P0;记录为 P1/P2 环境不可用 |
| public registry 不可用 | 不影响 P0,因为 P0 不做 public publish |
| credential provider 不可用 | 不影响 P0,因为 P0 不解析真实 credential material |

### 3.6 哪些依赖是编译期依赖,可用 path dependency?

| 依赖 | 类型 | 是否可用 path dependency |
|---|---|---|
| `quantalithos-core` contract crate | `[compile]` | 是,指向本机开发目录下的 core contracts package |
| `quantalithos-bus` contract crate | `[compile]` | 是,指向本机开发目录下的 bus contracts package |
| Rust workspace internal crates | `[compile]` | 是,使用当前仓 workspace path |
| Python / TypeScript generated package source | `[compile]` / build-time | 使用本地 generated source path,不是跨仓 truth 复制 |

### 3.7 哪些依赖是运行期依赖或事件协作依赖,必须用 mock / fake / real-like / event replay?

| 依赖 | 类型 | P0 协作方式 |
|---|---|---|
| formal API endpoint | `[runtime]` | fake boundary 或 real-like local process |
| formal API snapshot source | `[runtime]` | fixture snapshot |
| bus event boundary | `[event]` | fake boundary 或 event replay |
| local runner / generator / builder | `[runtime]` | stub 或 local process runner |
| artifact / report filesystem | `[runtime]` | isolated local filesystem root |
| credential provider | `[runtime]` | 不接入真实 provider;使用 ref-only fixture |
| public registry | `[runtime]` | P0 不调用 |

## 4. 当前文档问题诊断

| 文档 | 诊断 |
|---|---|
| 当前旧 `05-测试方案.md` | 未区分 local / CI / integration / candidate profile,也未区分 compile / runtime / event 依赖 |
| `04-配置设计.md` | 已定义 profile 和配置项,但测试方案仍需把它们转成可执行环境矩阵 |
| `05_test_plan_step_07_test_data.md` | 已定义数据隔离,但还未说明不同环境如何承载这些数据 |
| 当前测试方案链路 | 若不补 Step 8,Step 9 无法准确设计 CI gate 和命令参数 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 环境表达 | 旧版泛化写测试环境 | 明确 6 个 profile,其中 4 个是 P0 |
| 依赖类型 | 未区分 | 区分 `[compile]`、`[runtime]`、`[event]` |
| path dependency | 容易误用于运行期服务 | 只允许 compile dependency 使用 path dependency |
| 配置承接 | 配置只作为背景 | 11 个配置组逐项映射到测试影响 |
| 环境不可用 | 未定义 | fail-fast、failed / skipped、P1/P2 non-blocking 分别处理 |

## 6. 测试设计取舍

| 取舍 | 结论 | 原因 |
|---|---|---|
| 是否把 staging-like 作为 P0 | 不作为 P0 | L0-sdk 不是常驻线上服务,P0 目标是 local / CI / integration / candidate 可验证闭环 |
| 是否启动真实 L0-bus runtime | P0 不启动 | bus 只作为 contract 和 event semantic 依赖,事件协作用 fake / replay 验证 |
| 是否接入 public registry | P0 不接入 | local candidate gate 已能证明最小可用,公开发布是后续专项 |
| 是否允许复制 core / bus 类型到 SDK | 不允许 | compile truth 必须来自 path dependency 或正式 contract package |
| 是否用环境变量覆盖所有配置 | 不允许 | env 只作为普通最高优先级来源,CLI / job args 仅为 selector 或局部参数 |

## 7. 结构化中间产物

### 7.1 测试环境矩阵

| 环境 | 用途 | 依赖服务 | 全局依赖类型 | 测试协作方式 | 关键配置 / feature flag | 数据策略 | 风险 |
|---|---|---|---|---|---|---|---|
| `local-dev` | 手动调试、最小 smoke、CLI / job 验证 | core / bus contracts、fixture source、fake endpoint、fake bus boundary、local runner、filesystem | `[compile]` + `[runtime]` + `[event]` | path dependency + fake + local process | local JSON、env override、strict redaction、fake marker required | `DS-SDK-*` 小样本,本地 `run_id` | 本地路径缺失导致 compile suite fail-fast |
| `ci-test` | 自动化主门禁、确定性 unit / service / contract / config | temp dirs、fixture snapshot、fake adapters、deterministic runner | `[compile]` + `[runtime]` + `[event]` | path dependency 或 locked fixture + fake + stub | test JSON、CI env、`jobs.require_run_id=true` | 每次 run 独立 `artifacts/test/<run_id>` 和 `reports/runs/<run_id>` | runner skipped 不得被当成 passed |
| `integration-test` | repository / adapter / projection / runner / boundary 集成 | local contracts、real-like local process、fake / replay bus boundary、filesystem store | `[compile]` + `[runtime]` + `[event]` | path dependency + real-like + event replay | integration JSON、env override、filesystem roots | 中等规模 fixture,隔离 store / projection / outbox root | real-like boundary 不稳定会导致 suite failed |
| `candidate-validation` | 三语言 candidate、docs、smoke、compatibility | generator、package builder、docs runner、smoke runner、compat runner、artifact / report store | `[compile]` + `[runtime]` | local source + local process runner | candidate JSON、job run id、enabled languages、compatibility gate | candidate fixture + package artifacts + reports | artifact / report 不完整必须阻断 candidate |
| `staging-like` | 后续真实消费者和 real-like endpoint 演练 | real-like formal API、bus boundary、secret refs、observability consumer | `[runtime]` + `[event]` | real-like service + ref-only secret | staging JSON、credential refs | 不进入 P0 数据集 | 不可用不阻断 P0 |
| `production-like` | 后续真实 endpoint / registry / credential 运维 | real formal API、real bus boundary、credential provider、registry | `[runtime]` + `[event]` | real service + external secret provider | production JSON、credential refs | 不进入 P0 数据集 | 属 P1/P2,不得影响 P0 pass / fail |

### 7.2 配置矩阵

| 配置组 | 关键配置 | 影响的环境 | 测试断言 |
|---|---|---|---|
| `store` | `kind`、`root` | local / CI / integration | enum 合法、root 隔离、不可写 fail-fast |
| `sources` | core / bus contracts path、formal API snapshot ref | local / CI / integration / candidate | compile path 可定位、snapshot ref 可读、不可复制上游类型 |
| `boundaries` | formal endpoint ref、fake endpoint ref、bus boundary ref | local / CI / integration / staging | fake marker 必须存在、raw credential 不得进入、boundary unavailable 按 profile 处理 |
| `runners` | generator profile、validation profile | CI / integration / candidate | unsupported profile fail-fast、runner failed / skipped 不得视为 passed |
| `artifacts` | root、report root | 全部 P0 profile | root 可写、不得多包一层项目名、输出可被 redaction scan |
| `outbox` | kind、root | local / CI / integration | append / mark 能力可用,publish failure 保留 pending / failed |
| `projections` | kind、root | local / CI / integration / candidate | projection rebuild 不写 truth,stale / fresh 可断言 |
| `language_packages` | enabled languages、output root | candidate-validation | Rust / Python / TypeScript 必须覆盖,output root 可写 |
| `policies` | redaction、credential protection、fake marker、compatibility gate | 全部 P0 profile | 关闭或降级 fail-fast,unredacted evidence 阻断 |
| `cli` | default config path、default profile | local-dev / manual tests | selector 非法 fail-fast,不作为全局覆盖层 |
| `jobs` | artifact root、report root、require run id | CI / integration / candidate | 缺 `run_id` fail-fast,输出路径使用 run scoped root |

### 7.3 测试依赖类型与协作方式判定表

| 依赖对象 | 依赖类型 | P0 协作方式 | 允许 path dependency | 不允许的做法 |
|---|---|---|---|---|
| L0-core contracts | `[compile]` | Cargo path dependency 或正式 contract package | 是 | 复制 core 类型到 SDK |
| L0-bus contracts | `[compile]` | Cargo path dependency 或正式 contract package | 是 | 复制 bus 类型到 SDK |
| L0-bus event semantic | `[event]` | fake boundary / event replay / semantic fixture | 否 | 启动真实 bus 后绕过 mapping 测试 |
| formal API snapshot | `[runtime]` | fixture snapshot / real-like local source | 否 | 把 snapshot 当 compile truth |
| formal API endpoint | `[runtime]` | fake boundary 或 real-like local process | 否 | P0 直接依赖 production endpoint |
| runner / generator / builder | `[runtime]` | stub 或 local process runner | 否 | runner skipped 直接视为 passed |
| artifact / report filesystem | `[runtime]` | isolated local filesystem root | 否 | 写入全局默认目录或项目名重复层级 |
| public registry | `[runtime]` | P0 不调用 | 否 | 用 registry publish 作为 P0 成功条件 |
| credential provider | `[runtime]` | P0 不解析,只用 ref-only fixture | 否 | 把 raw secret 放入 config / env / report |

### 7.4 环境拓扑图

```text
                   [quantalithos-core contracts]
                              |
                              | [compile]
                              v
                   [L0-sdk test / build target]
                              ^
                              | [compile]
                   [quantalithos-bus contracts]

                   [L0-sdk test / build target]
                              |
                              | [runtime]
                              v
              [ConfigLoader + ConfigValidator + RuntimeBuilder]
                    |              |              |
                    | [runtime]    | [runtime]    | [runtime]
                    v              v              v
          [fixture sources] [fake formal API] [local runners]
                    |
                    | [event]
                    v
          [fake bus boundary / event replay]
                    |
                    | [runtime]
                    v
          [artifacts/test/<run_id> + reports/runs/<run_id>]
```

说明:

- `[compile]` 只用于 contract crate 和 workspace crate 的编译依赖,可以使用 path dependency。
- `[runtime]` 用于配置加载、fixture source、fake / real-like boundary、runner、artifact 和 report filesystem,不得写成 path dependency。
- `[event]` 用于 bus event semantic collaboration,必须通过 fake boundary、event replay 或 semantic fixture 验证。

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §8 时摘录。

```markdown
## 8. 测试环境与配置矩阵

> 校准来源：
> - `design-calibration/05_test_plan_step_08_environment_config.md`

本轮测试环境按 `local-dev`、`ci-test`、`integration-test`、`candidate-validation`、`staging-like` 和 `production-like` 六类 profile 组织。其中 `local-dev`、`ci-test`、`integration-test` 和 `candidate-validation` 是 P0 阻断环境;`staging-like` 和 `production-like` 是后续真实消费者、真实 endpoint、credential provider 和 registry 运维承接环境,不阻断 P0。

测试方案必须区分 `[compile]`、`[runtime]` 和 `[event]` 依赖。只有 L0-core / L0-bus contracts 这类编译期依赖允许使用 path dependency;formal API endpoint、bus event boundary、runner、artifact / report filesystem、credential provider 和 registry 等运行期或事件协作依赖必须使用 fake、stub、real-like local process、event replay 或明确的非 P0 策略。
```

## 9. 待确认事项

| 事项 | 建议方案 | 原因 |
|---|---|---|
| `staging-like` 是否阻断 P0 | 不阻断 | 它是后续真实消费者集成语境,不是 SDK 最小可验证闭环 |
| 是否允许 P0 依赖 public registry | 不允许 | P0 只验证 local candidate、install、docs、smoke 和 compatibility |
| 是否允许 runtime / event 依赖使用 path dependency 表述 | 不允许 | path dependency 只能表达 compile dependency,否则会混淆仓库依赖和运行协作 |
| 是否需要在本步写 CI 命令 | 不写 | 命令、流水线和 gate 归 Step 9 |

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| P0 自动化和人工测试环境已可定位 | 已满足 |
| 环境矩阵已定义 | 已满足 |
| 配置矩阵已定义 | 已满足 |
| 依赖类型与协作方式已区分 | 已满足 |
| 环境不可用处理已定义 | 已满足 |
| 环境拓扑图已标注 `[compile]`、`[runtime]`、`[event]` | 已满足 |

Step 9 可以在本文件被确认后开始,主题是设计自动化与 CI/CD 门禁。
