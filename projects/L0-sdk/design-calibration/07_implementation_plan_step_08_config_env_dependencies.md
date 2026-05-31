# L0-sdk 07 实施计划 Step 8: 配置、环境与外部依赖准备

> 本文件是 `projects/L0-sdk/07-实施计划.md` 的 Step 8 中间产物。
> 本步定义实施前和阶段前必须准备的配置、环境、外部依赖、跨仓依赖和 fake / fixture 使用边界。
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
| `07_implementation_plan_step_05_phases_dependencies.md` | 已确认 | 继承 PH-01~PH-07 使用阶段 |
| `07_implementation_plan_step_07_tests_acceptance_gates.md` | 已确认 | 继承每阶段测试、验收、artifact 和 report 门禁 |
| `03-详细设计.md` §4 / §13 / §15 | 已完成 | 提取目标仓、目录、path dependency、外部依赖绑定和脚本 / 产物规则 |
| `04-配置设计.md` §6~§12 | 已完成 | 提取 profile、配置项、敏感引用、加载校验和失效模式 |
| `05-测试方案.md` §8 / §9 / §13 | 已完成 | 提取测试环境矩阵、gate scripts、artifact / report 输出 |
| `06-验收标准.md` §10 / §11 | 已完成 | 提取证据路径、VETO、redaction 和 acceptance handoff 要求 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已完成 | 区分编译期依赖、运行期依赖和事件协作依赖 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 哪些外部服务或仓是实施前置依赖 | P0 硬前置是目标实现仓、Rust / Python / TypeScript 工具链、`core-contracts`、`bus-contracts`、JSON profile fixture 和 evidence 目录。真实 formal API service、真实 bus runtime、public registry、real credential provider 和 L1/L2/L3/L4 服务仓不是 P0 前置服务。 |
| 2. 哪些依赖只在特定阶段需要 | PH-01 需要目标仓、toolchain、path deps、config/scripts;PH-02 需要 contract fixtures;PH-03 需要 fake endpoint / fake bus boundary;PH-04 需要 language generator、package builder、artifact store;PH-05 需要 docs / smoke / validation runners;PH-06 需要 compatibility fixture;PH-07 需要 report / acceptance tools。 |
| 3. 哪些配置项必须在本地或 CI 环境准备 | 必须准备 `store`、`sources`、`boundaries`、`runners`、`artifacts`、`outbox`、`projections`、`language_packages`、`policies`、`cli`、`jobs` 配置组,并在 gate/job 启动时固定 `run_id` 和 `artifacts/test/<run_id>`。 |
| 4. 是否允许 fake / mock,允许到什么阶段为止 | P0 允许 fake / fixture / local process 贯穿 PH-01~PH-07,用于证明默认可验证路径。fake 不得伪装成 production endpoint、real credential provider、public registry 或真实 bus runtime。 |
| 5. 外部依赖不可用时是暂停、降级还是替代 | `core-contracts` / `bus-contracts` 编译期不可用必须暂停;Rust toolchain 不可用暂停;Python / TypeScript 工具链不可用阻断 PH-04 / PH-05 或进入 Step 9 Spike;运行期 service / bus / registry 不可用使用 fake / fixture 并登记后续风险。 |
| 6. 哪些依赖需要由其他团队或仓提供 | L0-core 提供 `core-contracts`;L0-bus 提供 `bus-contracts`;未来 service owner 提供 formal API;future release / ops 提供 registry 和 real credential provider;L1/L2/L3/L4 提供真实服务客户端覆盖。这些后续提供方不阻塞 P0。 |
| 7. 已实现仓库依赖是否已经在 `/home/aris/Projects` 下存在 | 当前存在 `/home/aris/Projects/quantalithos-core` 和 `/home/aris/Projects/quantalithos-bus`,且两者 `crates/contracts` 均存在。当前也存在 `/home/aris/Projects/quantalithos-sdk`,但仅有 git shell,PH-01 仍需初始化 workspace 和交付物骨架。 |
| 8. 哪些依赖是编译期依赖,Cargo 本地 path dependency 写法是否已经与详细设计一致 | 编译期依赖是 `core-contracts = { path = "../quantalithos-core/crates/contracts" }` 和 `bus-contracts = { path = "../quantalithos-bus/crates/contracts" }`,与 `03-详细设计.md` 一致。 |
| 9. 哪些依赖是运行期依赖或事件协作依赖,应该如何表达 | formal API、fake endpoint、bus event boundary、runner、package builder、artifact store、projection、outbox、report consumer 都不是 Cargo path dependency;分别用 port、adapter、event、projection、fixture、local process 或 report evidence 表达。 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 编译期依赖和运行期依赖容易混淆 | SDK 同时消费 core / bus contracts,又与 formal API、bus runtime、package registry 协作 | 可能把运行期依赖写成 Cargo path dependency | 明确只有 contracts crate 是 path dependency |
| 多语言工具链未在阶段中前置 | Rust / Python / TypeScript 都是 P0 | 到 PH-04 / PH-05 才发现缺工具链 | 明确 PH-01 检查工具链,PH-04 / PH-05 前阻断 |
| artifact root 口径容易混乱 | 配置项有 artifact root,测试验收要求 `artifacts/test/<run_id>` | 证据路径不可验 | 明确 gate/job 启动时必须固定到 `artifacts/test/<run_id>` |
| fake / fixture 边界需要收紧 | P0 默认路径依赖 fake / fixture | fake 成功可能被误写成 production support | 定义 fake 使用边界和禁止声明 |
| public registry 易误入 P0 | package candidate 容易被误读为公网发布 | P0 范围膨胀 | 明确只交付 local candidate,registry 后置 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 外部依赖 | 散落在详细设计、配置设计和测试方案中 | 形成依赖准备表 | 实施者可逐项检查 |
| 配置准备 | 只知道 P0 profile 存在 | 按阶段列出 profile、root、失败处理 | 降低运行时配置错误 |
| 多语言环境 | 只在测试和 candidate 中出现 | 前置 Rust / Python / TypeScript 工具链检查 | 避免后期阻塞三语言 P0 |
| fake / mock | 只作为测试口径出现 | 明确使用阶段、边界和禁止伪装 | 防止 fake 结果被当成真实联调成功 |
| 不可用处理 | 分散在配置和验收文档 | 集中为暂停、fail-fast、fail-closed、pending / failed、risk | 实施中不可临场判断 |

---

## 6. 实施设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 等真实 formal API、bus runtime、registry 和 credential provider 都就绪再实施 | 接近最终生产 | 阻塞 P0,违反 local candidate 和 fake / fixture 路径 | 不采用 |
| P0 使用 local / fake / fixture / local process | 可独立实现、测试和验收 | 后续系统级风险需追踪 | 采用 |
| 所有 Quantalithos 仓都用 path dependency | 编译期方便 | 错误表达运行期和事件协作依赖 | 不采用 |
| 仅 core / bus contracts 使用 path dependency | 与全局依赖规则一致 | 需要为其他依赖写 fake / port | 采用 |
| public registry 作为 candidate-validation 前置 | 发布体验完整 | 依赖外部凭据和 registry,超出 P0 | 不采用 |
| local candidate + artifact metadata + smoke 作为 P0 | 可验证官方 SDK 闭环 | 需要后续 release 专项 | 采用 |

---

## 7. 结构化中间产物

### 7.1 外部依赖准备表

| 依赖项 | 类型 | 全局依赖类型 | 使用阶段 | 提供方 | 检查方式 | 不可用时处理 |
|---|---|---|---|---|---|---|
| 目标实现仓 | repo | 不适用 | PH-01~PH-07 | 实施者 | 检查 `/home/aris/Projects/quantalithos-sdk` 和 workspace 骨架 | 已存在但未初始化则 PH-01 补齐;不得在 design 仓实现 |
| Rust toolchain | tool | 不适用 | PH-01~PH-07 | 实施者 / CI | `rustc --version`、`cargo --version`、fmt/check/test | 不可用则暂停 PH-01 |
| Python toolchain | tool | 不适用 | PH-01、PH-04~PH-05 | 实施者 / CI | `python --version` 和目标仓 package build / smoke 命令 | 不可用则阻断 PH-04 / PH-05 或进入 Spike |
| TypeScript / Node toolchain | tool | 不适用 | PH-01、PH-04~PH-05 | 实施者 / CI | `node --version`、`npm --version` 或目标仓等价命令 | 不可用则阻断 PH-04 / PH-05 或进入 Spike |
| `core-contracts` | repo / crate | 编译期依赖 | PH-01~PH-07 | L0-core | 检查 `/home/aris/Projects/quantalithos-core/crates/contracts/Cargo.toml` package `core-contracts` | 不可用则暂停真实编译实现,不得复制类型 |
| `bus-contracts` | repo / crate | 编译期依赖 + 事件协作依赖 | PH-01~PH-07 | L0-bus | 检查 `/home/aris/Projects/quantalithos-bus/crates/contracts/Cargo.toml` package `bus-contracts` | contracts 不可用则暂停;bus runtime 不可用用 fake boundary |
| formal API snapshot source | config / fixture | 运行期依赖 | PH-02~PH-07 | service owners / fixture | `FormalApiSourcePort` fixture、snapshot ref 可读 | P0 使用 fixture;真实 source 不可用不阻塞 |
| formal API boundary | service / adapter | 运行期依赖 | PH-03~PH-07 | service owners / fake endpoint | `FormalApiBoundaryPort` fake / fixture tests | P0 使用 fake / fixture;production endpoint 后置 |
| fake / fixture endpoint | adapter | 运行期测试依赖 | PH-03~PH-07 | L0-sdk test fixtures | fake marker、ref-only result、negative tests | 缺 fake marker fail-fast |
| bus event boundary | event adapter | 事件协作依赖 | PH-03~PH-07 | L0-bus / fake boundary | `BusEventBoundaryPort` fake、event semantic mapping tests | bus runtime 不可用不阻塞;pending / failed 进入 evidence |
| language generator | local tool | 不适用 | PH-04~PH-05 | L0-sdk repo | generator profile `local_process`、layout checks | 不可用阻断 candidate |
| package builder | local tool | 不适用 | PH-04~PH-05 | L0-sdk repo | package build / artifact metadata tests | 不可用阻断 candidate |
| docs / smoke / compatibility runners | local tool | 不适用 | PH-05~PH-06 | L0-sdk repo | runner profile、exit code、evidence output | failed / skipped 不得视为 passed |
| artifact / report store | filesystem | 不适用 | PH-01~PH-07 | target repo / CI | `artifacts/test/<run_id>`、`reports/` 可写且无非法层级 | 不可用阻断对应阶段 |
| public package registries | external service | 发布阶段依赖 | P1/P2 | release / ops | 不作为 P0 检查项 | 不可用不阻塞 local candidate |
| real credential provider | external service | 运行期依赖 | P1/P2 | security / ops | 不作为 P0 检查项 | P0 使用 credential ref-only 和 fake refs |
| L1/L2/L3/L4 service repos | external repo / service | 运行期依赖 | P1/P2 | service owners | 可作为人工查阅位置,不作为 Cargo dependency | 不可用不阻塞 P0,能力 pending / unsupported |

### 7.2 配置与环境检查表

| 配置 / 环境项 | 使用阶段 | 要求 | 检查方式 | 失败处理 |
|---|---|---|---|---|
| local-dev profile | PH-01~PH-03 | defaults + local JSON + fake endpoints + local process | config smoke | 不通过则阻断 PH-01 |
| ci-test profile | PH-01~PH-07 | deterministic fixture、fake refs、strict redaction、`jobs.require_run_id=true` | CI config test | 不通过则阻断 PR / CI gate |
| integration-test profile | PH-03~PH-07 | real-like local process、fake / replay bus boundary、filesystem store | integration config test | 不通过则阻断集成阶段 |
| candidate-validation profile | PH-04~PH-07 | generator、builder、docs runner、smoke runner、compat runner | candidate config test | 不通过则阻断 candidate |
| staging-like profile | P1 | real-like formal API、bus boundary、secret refs | 不作为 P0 gate | 不阻断 P0 |
| production-like profile | P1/P2 | real endpoint、registry、credential provider | 不作为 P0 gate | 不阻断 P0 |
| `sources.core_contracts_path` | PH-01~PH-07 | 指向 sibling contracts crate | Cargo check / path check | 不可用暂停 |
| `sources.bus_contracts_path` | PH-01~PH-07 | 指向 sibling contracts crate | Cargo check / path check | 不可用暂停 |
| `language_packages.enabled_languages` | PH-04~PH-07 | 必须包含 Rust / Python / TypeScript | config validator | 缺语言 fail-fast |
| `policies.redaction` / `credential_protection` | PH-01~PH-07 | `strict` / `ref_only`,不得关闭或降级 | config validator + redaction check | fail-fast |
| artifact root | PH-01~PH-07 | gate/job 必须落到 `artifacts/test/<run_id>` | script arg / path check | 修正路径并重跑 |
| report root | PH-01~PH-07 | `reports/`、`reports/runs/<run_id>`、`reports/acceptance` | report generator smoke | 阻断 report / acceptance 阶段 |
| no-latest rule | PH-01~PH-07 | 正式引用不得使用 `latest` | grep / check script | 发现即修正 |
| no project layer rule | PH-01~PH-07 | 不使用 `artifacts/test/<project>/<run_id>` 或 `reports/<project>` | path check | 发现即修正 |

### 7.3 阶段配置矩阵

| 阶段 | 必备配置 / 环境 | 允许 fake / fixture | 禁止项 |
|---|---|---|---|
| PH-01 | local-dev、ci-test、toolchain、path deps、artifact/report root | empty package skeleton、script smoke | 在 design 仓写代码、全局 git config 替代项目级配置 |
| PH-02 | core / bus contracts path、semantic fixture、freshness fixture | fixture snapshot、in-memory store | 复制 core / bus truth、stale 当 fresh |
| PH-03 | fake endpoint、fake bus boundary、redaction policy、trace config | fake formal API、fake bus boundary | raw body、credential value、boundary call 写 SDK truth |
| PH-04 | candidate-validation、language package output、artifact metadata | local generator、local builder | public registry token、缺 Python / TypeScript 仍 stable |
| PH-05 | docs runner、smoke runner、validation runner、redaction check | local process runner、fixture package install | skipped 当 passed、unredacted evidence |
| PH-06 | compatibility fixture、migration ref fixture、deprecated lifecycle config | local compatibility runner | breaking 缺 migration ref 或标 compatible |
| PH-07 | fixed run_id、report scripts、acceptance templates、redaction check | generated report draft | `latest`、非法路径、跨 run 拼接、VETO 风险接受 |

### 7.4 fake / mock 使用边界

| fake / mock | 允许阶段 | 用途 | 必须证明 | 禁止声明 |
|---|---|---|---|---|
| fixture snapshot source | PH-02~PH-07 | core / bus / formal API snapshot 输入 | digest、freshness、stale / missing 语义 | 真实 service source 已联通 |
| fake formal API endpoint | PH-03~PH-07 | service capability ref-only 调用 | unsupported、fake marker、diagnostic ref | production endpoint 覆盖完成 |
| fake bus boundary | PH-03~PH-07 | event client publish / subscription boundary | mapping missing、pending / failed、payload ref-only | bus runtime delivery 完成 |
| local language generator | PH-04~PH-05 | 生成三语言 package artifact | Rust / Python / TypeScript 均覆盖 | public registry package 已发布 |
| local package builder | PH-04~PH-05 | local candidate build | artifact metadata、digest、layout | PyPI / npm / crates.io 发布完成 |
| local docs / smoke runner | PH-05~PH-07 | quickstart、docs、cross-language smoke | skipped / failed 不当 passed | 真实消费者全量联调完成 |
| fake credential ref | PH-01~PH-07 | 验证 ref-only 和 redaction | raw secret 不进入 config / logs / reports | real credential provider 完成 |
| in-memory store / outbox / projection | PH-01~PH-07 | P0 默认可验证路径 | UoW、idempotency、projection no-write | production durable store 完成 |

### 7.5 Cargo path dependency 约束

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
bus-contracts = { path = "../quantalithos-bus/crates/contracts" }
```

| 规则 | 说明 |
|---|---|
| 只允许编译期依赖使用 path dependency | 当前仅 `core-contracts` 和 `bus-contracts` 符合 |
| 运行期依赖不得写成 path dependency | formal API、bus runtime、registry、credential provider、L1/L2/L3/L4 service repos 通过 port / adapter / event / projection / fake 表达 |
| 当前不要求 public crates.io / PyPI / npm | 后续 release / operations 专项另行决策 |
| private git tag / rev 是中期方案 | 不替代本地 sibling repo 检查 |
| 依赖版本 / commit 必须记录 | PH-07 handoff 需要 dependency snapshot |

### 7.6 依赖不可用处理表

| 不可用对象 | 处理 |
|---|---|
| Rust toolchain / workspace 不可构建 | 暂停 PH-01,先修复工具链或 workspace |
| `core-contracts` / `bus-contracts` path 不存在 | 暂停编译期阶段,不得复制类型 |
| Python / TypeScript 工具链不可用 | 阻断 PH-04 / PH-05 或进入 Step 9 Spike,不得把对应语言降为 P1 |
| JSON 配置 parse / type / cross-field validate 失败 | fail-fast,不回退低优先级来源 |
| artifact / report root 不可写或路径非法 | fail-fast,修正后重跑 gate / report |
| raw secret / token / credential 出现在配置或证据 | blocker,清理并重跑安全扫描 |
| formal API / bus runtime 不可用 | P0 使用 fake / fixture / boundary evidence;真实联调后置 |
| runner failed / skipped | 记录 failed / skipped evidence,不得当 passed |
| package artifact orphan 或 metadata 缺失 | candidate not verified,不得 stable |
| public registry 不可用 | 不阻塞 P0,local candidate 验证继续 |
| evidence root 不可写或 EV 缺失 | 阻断对应阶段或 PH-07 放行 |

---

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §8。

````markdown
## 8. 配置、环境与外部依赖准备

> 校准来源:
> - `design-calibration/07_implementation_plan_step_08_config_env_dependencies.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“外部依赖准备表”“配置与环境检查表”“阶段配置矩阵”“fake / mock 使用边界”“Cargo path dependency 约束”和“依赖不可用处理表”小节,了解本轮实施哪些依赖是硬前置、哪些只能作为 fake / fixture 默认路径、哪些必须后置。

本轮 P0 硬前置编译期依赖是 L0-core `core-contracts` 和 L0-bus `bus-contracts`。目标实现仓固定为 `/home/aris/Projects/quantalithos-sdk`,当前已存在但仅有 git shell,由 PH-01 初始化 workspace、packages、scripts、artifacts 和 reports。Cargo 本地 path dependency 固定为:

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
bus-contracts = { path = "../quantalithos-bus/crates/contracts" }
```

formal API、bus runtime、public registry、real credential provider、L1/L2/L3/L4 service repos 均不得写成 Cargo path dependency。P0 通过 port、adapter、event、projection、fixture、local process 和 report evidence 验证。

正式内容从 `design-calibration/07_implementation_plan_step_08_config_env_dependencies.md` §7.1~§7.6 摘录。
````

---

## 9. 待确认事项

| 事项 | 当前结论 | 影响 | 建议 |
|---|---|---|---|
| `/home/aris/Projects/quantalithos-sdk` 仅有 git shell | PH-01 初始化 workspace、packages、scripts、artifacts 和 reports | 不阻塞文档,阻塞业务编码前置 | 接受,写入 PH-01 |
| Python / TypeScript 具体工具命令 | 目标仓尚未形成 package 结构,命令未实测 | 影响 PH-04 / PH-05 | Step 9 作为 Spike 或阶段前检查 |
| `artifacts.root` 默认值与正式 evidence run 目录 | 配置默认可为本地值,gate/job 必须落到 `artifacts/test/<run_id>` | 影响证据归档 | 在 PH-01 / PH-07 检查 script args 和 path |
| 是否提前接 public registry | 当前非 P0 | 提前会扩大范围 | 不接,只做 local candidate |
| 是否提前接 real credential provider | 当前非 P0 | 可能引入 secret 泄露风险 | 不接,只做 credential ref-only 和 fake refs |

建议方案: 接受当前配置与依赖准备方案。原因是它把硬依赖限定为 contracts 和本地工具链,其余能力通过可测试边界表达,符合 P0 默认可验证路径和全局依赖规则。

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 关键依赖均有检查方式和失败处理 | 已满足 |
| 已明确 `core-contracts` 和 `bus-contracts` 使用本地 Cargo path dependency | 已满足 |
| 已明确运行期和事件协作依赖使用 port / adapter / event / projection / fixture / fake 表达 | 已满足 |
| 已明确 local-dev、ci-test、integration-test、candidate-validation profile 的阶段用途 | 已满足 |
| fake / mock 使用边界已明确 | 已满足 |
| 阶段级依赖关系与 Step 5 不冲突 | 已满足 |

结论: 可以进入 Step 9,继续定义 Spike、风险与待确认事项。
