# Step 6. 定义环境、部署 profile 与配置矩阵

> 本文件是 `projects/L0-sdk/04-配置设计.md` 的 Step 6 中间产物。
> 本步定义 L0-sdk 在 local、CI、integration、candidate validation、staging-like 和 production-like 语境下的配置来源、依赖、敏感配置处理和差异。
> 本步不定义完整配置项清单,不写 JSON 示例,不新增 `SdkRuntimeConfig.profile` 字段,不回写 `03-详细设计.md`。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 6
- 回填章节：`projects/L0-sdk/04-配置设计.md` §6 环境、部署 profile 与配置矩阵

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | 已确认普通来源优先级、CLI / job 局部输入、secret / credential ref 边界和 fail-fast 规则 | 固定各 profile 的配置来源和覆盖方式 |
| `04_config_step_04_classification_boundaries.md` | 已确认 P0 核心配置冷更新、诊断配置边界和禁止配置化项 | 固定各 profile 的生效方式和不可越界项 |
| `01-架构设计.md` §3 / §4 / §5 / §13 | SDK 是官方客户端接入层,不是 server、gateway、bus runtime 或 public registry 运营仓 | 防止把 staging / production 写成 SDK 常驻服务部署环境 |
| `03-详细设计.md` §13 / §15 / §17 | `SdkRuntimeConfig`、配置绑定点、测试切口、reports / artifacts 目录和 `04` 缺失风险 | 将 profile 差异映射到既有 config 组,不新增代码契约 |
| `03_ddd_step_14_config_dependencies.md` | local sibling repo、fake / fixture default path、source / boundary / runner / artifact / outbox / projection 配置绑定 | 确定 profile 下的外部依赖和敏感配置处理 |

已确认结论:

```text
L0-sdk 不是常驻线上服务。staging-like 和 production-like 是消费者集成与发布承接语境,不是 SDK 自身的服务部署环境。

profile 是配置矩阵分类,不是本步新增的 `SdkRuntimeConfig.profile` 字段。
P0 必须覆盖 local-dev、ci-test、integration-test 和 candidate-validation。
staging-like / production-like 作为 P1/P2 承接方向,在本步只定义边界和差异。
```

## 3. SOP 问题回答

### 3.1 local / CI / test / staging / prod 分别是否适用?

| 环境语境 | 是否适用 | 当前口径 |
|---|---|---|
| local | 适用 | P0 必须支持本地 CLI / jobs / Rust client facade 的默认可验证路径,使用 local source、fake boundary、local runner 和 filesystem artifact |
| CI | 适用 | P0 必须支持自动化测试、配置校验、redaction check、deterministic ID / clock 和 artifacts / reports 生成 |
| test / integration | 适用 | P0 必须支持跨 crate、source adapter、boundary adapter、runner、projection 和 package surface 的集成测试 |
| candidate validation | 适用 | P0 必须支持三语言 candidate build、smoke、docs、compatibility 和 boundary verification |
| staging | 适用,但不阻塞 P0 | 作为 staging-like profile,用于后续真实或 real-like formal API / bus boundary / credential provider 集成 |
| prod | 适用,但不阻塞 P0 | 作为 production-like consumer profile,用于真实消费者接入、endpoint、credential 和发布运维承接;不代表 SDK server 部署 |

### 3.2 每个环境配置来源是什么?

所有 profile 均遵守普通来源顺序:

```text
code defaults < JSON config file < environment variables
```

CLI / job args 只作为 config source selector 或单次 operation 局部参数,不作为全局覆盖层。

| profile | 配置来源 |
|---|---|
| local-dev | code defaults + local JSON config file + optional env override;CLI 可传 config path / local run id |
| ci-test | code defaults + test JSON config file + CI env override;CI job 可传 run id / artifact root / report root |
| integration-test | integration JSON config file + env override;fixture source、fake / real-like boundary 和 local runner 必须显式可追踪 |
| candidate-validation | candidate JSON config file + env override + job 局部参数;用于 package build、smoke、docs、compatibility、boundary verification |
| staging-like | staging JSON config file + env override + secret / credential refs;真实 material 由外部注入 |
| production-like | production JSON config file + env override + secret / credential refs;remote config、admin override 和 registry 发布后续专项 |

### 3.3 每个环境依赖哪些外部服务?

| profile | 外部依赖 |
|---|---|
| local-dev | 本地 sibling `quantalithos-core` / `quantalithos-bus` contracts、fixture source、fake endpoint、local runner、filesystem artifact store |
| ci-test | 不依赖真实外部服务;使用临时目录、fixture source、fake adapters、local runner 和 deterministic utilities |
| integration-test | 可以使用 real-like local process 或 fixture-backed formal API / bus boundary,但不依赖生产 endpoint、真实 secret 或公共 registry |
| candidate-validation | 依赖 language generator、package builder、smoke runner、docs runner、compatibility checker、boundary verifier 和 artifact / report store |
| staging-like | 可以接入 real-like formal API、bus boundary、secret provider、artifact store、observability consumer 和下游测试消费者 |
| production-like | 依赖真实 formal API endpoint、bus boundary、credential provider、artifact / registry / report 体系和真实消费者;具体产品字段后续定义 |

### 3.4 敏感配置在不同环境如何处理?

| profile | 敏感配置处理 |
|---|---|
| local-dev | 不允许 raw secret;可使用 fake credential ref 或禁用真实 boundary |
| ci-test | 不允许 raw secret;fixture 中只能出现不可解析假引用或测试 credential ref,不得输出真实 secret |
| integration-test | 不允许 raw secret;real-like boundary 如需 credential 只能使用 secret / credential ref |
| candidate-validation | 不允许 raw secret;package registry token 不进入 P0,smoke/docs 目标必须保留 fake marker 或 ref |
| staging-like | 允许 secret / credential ref;真实 secret material 由外部注入,不得进入 JSON / env / CLI / report |
| production-like | 只允许 secret / credential ref;真实 material 由部署、发布和安全运维承接,不得进入设计文档或测试报告 |

### 3.5 哪些环境差异会影响测试和验收?

| 差异 | 对测试 / 验收的影响 |
|---|---|
| local / fake boundary vs production formal API | P0 只能证明 SDK boundary 与 fake marker,不能宣称 production support |
| fixture source vs real source | P0 验证 source 消费和 freshness 语义;真实 source 后续集成验收 |
| local runner vs真实 package toolchain | P0 验证 runner port、evidence 和 artifact ref;真实工具链后续补充 |
| filesystem artifact vs registry publish | P0 验证 package candidate artifact;public publish 不属于 P0 验收 |
| no secret vs secret / credential ref | P0 必须验证 raw secret 被拒绝;staging / prod 验证 ref 解析和 redaction |
| deterministic ID / clock vs system source | CI 必须可复现;production-like 需要 trace / audit 一致性验证 |
| projection / report root 差异 | 测试必须验证 artifact / report root 不含项目名重复层级,并能生成可追溯报告 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | 已定义来源优先级,但还没有落到环境矩阵 | Step 7 无法判断默认值和 profile 差异 |
| `01-架构设计.md` §3 / §4 | 已定义 SDK 不是 server / gateway / bus runtime | 需要在配置矩阵中避免 staging / prod 被误读成 SDK 服务部署 |
| `03-详细设计.md` §13 | 已定义配置绑定点,但没有 local / CI / integration / candidate / staging / production 的配置使用口径 | 实现者可能把 production endpoint 或 public registry 当 P0 前置 |
| 当前 `05/06` | 尚未按新版配置矩阵校准 | 后续测试验收必须基于本步重写环境和 profile 矩阵 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 环境口径 | 只有泛化 local / CI / test / staging / prod | 明确 local-dev、ci-test、integration-test、candidate-validation、staging-like、production-like | 让配置矩阵可直接承接到测试、验收和实施 |
| P0 范围 | 容易把 staging / prod 当成生产服务部署前置 | P0 只要求 local / CI / integration / candidate validation 默认可验证路径 | 避免 production endpoint、public registry 和真实 secret provider 阻塞 P0 |
| SDK 运行形态 | 容易按 server 项目理解 | 明确 staging-like / production-like 是消费者集成语境,不是 SDK server | 符合 SDK 官方客户端接入层定位 |
| 敏感配置 | 只说明 raw secret 禁止 | 按 profile 明确 fake ref、secret ref、credential ref 和真实 material 处理 | 支撑 Step 8 敏感配置设计 |
| 03 回写 | 未判断 | profile 只是配置矩阵分类,不新增 `SdkRuntimeConfig.profile` 字段 | 无需回写 03 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：按 dev / test / staging / prod 四环境写 | 通用、读者熟悉 | 会误导为 SDK 有常驻服务部署环境,也无法表达 candidate validation | 不采用 |
| 方案 B：按 local-dev / ci-test / integration-test / candidate-validation / staging-like / production-like 写 | 贴合 SDK runtime、package candidate 和消费者集成语境 | profile 数量更多,需要解释 P0 / P1 边界 | 采用 |
| 方案 C：新增正式 `SdkRuntimeConfig.profile` 字段 | 实现上显式 | 本步只是矩阵分类,过早新增字段会回写 03 | 不采用 |
| 方案 D：完全不写 staging / prod | 避免误解 | SOP 要求回答 staging / prod,且后续真实消费者接入缺少承接边界 | 不采用 |

推荐方案 B。

原因:

- L0-sdk 的配置差异不只是环境差异,还包括 source、boundary、runner、candidate validation、language package 和消费者集成语境差异。
- P0 必须能在 local / CI / integration / candidate validation 下证明官方 SDK 默认路径成立。
- staging-like 和 production-like 需要给出边界,否则 P1/P2 实现会重新发明配置语义。

## 7. 结构化中间产物

### 7.1 环境 / profile 配置矩阵

| 环境 / profile | 用途 | 配置来源 | 外部依赖 | 敏感配置处理 | 差异说明 |
|---|---|---|---|---|---|
| local-dev | 本地开发、手动 CLI / job 验证、Rust client facade 调试 | defaults + local JSON file + env override;CLI 可传 config path / run id | local sibling contracts、fixture source、fake endpoint、local runner、filesystem artifact store | 不使用 raw secret;可用 fake credential ref 或禁用真实 boundary | P0 必需;不代表生产能力 |
| ci-test | 自动化测试、配置校验、redaction check、确定性 fixture | defaults + test JSON file + CI env override;CI job 可传 artifact root / report root | 临时目录、fixture source、fake adapters、local runner、deterministic utilities | 不使用 raw secret;测试 ref 只能是假引用或 fixture ref | P0 必需;所有失败必须可复现 |
| integration-test | 跨 crate / adapter / runner / projection / package surface 集成测试 | integration JSON file + env override | fixture-backed boundary、real-like local process、local contracts、filesystem store | 不使用 raw secret;real-like boundary 只能使用 ref | P0 必需;用于验证 SDK 主闭环 |
| candidate-validation | 三语言 candidate build、smoke、docs、compatibility、boundary verification | candidate JSON file + env override + job 局部参数 | language generator、package builder、smoke/docs/compatibility runner、artifact/report store | 不使用 raw secret;registry token 不进入 P0 | P0 必需;不等同 public registry publish |
| staging-like | 后续跨仓 / 真实消费者集成演练 | staging JSON file + env override + secret / credential refs | real-like formal API、bus boundary、secret provider、observability consumer | 只允许 secret / credential ref;真实 material 外部注入 | P1;不阻塞 P0 |
| production-like | 真实消费者、endpoint、credential、发布运维承接 | production JSON file + env override + secret / credential refs;remote config 后续专项 | 真实 formal API、bus boundary、credential provider、artifact / registry / report 体系 | raw secret 不进配置;真实 material 由运维和安全边界管理 | P1/P2;不是 SDK server 部署 |

### 7.2 profile 到测试验收承接表

| profile | 应进入测试方案的场景 | 应进入验收标准的门禁 |
|---|---|---|
| local-dev | 默认路径、local JSON、env override、fake endpoint、非法路径 fail-fast | 本地最小链路可运行,但不能单独作为最终验收通过依据 |
| ci-test | 重复 key、非法 env、缺失配置、raw secret 拒绝、redaction check、deterministic ID / clock | CI 能稳定复现配置成功和失败路径 |
| integration-test | source refresh、boundary call、event client、projection、runner 和 package surface 集成 | P0 主闭环在默认可验证路径上通过 |
| candidate-validation | package build、smoke、docs、compatibility、boundary evidence、artifact / report root | candidate 可验证,但不等同 public registry publish |
| staging-like | real-like formal API / bus boundary / credential provider 的配置校验 | P1 集成不破坏 P0 semantic baseline、fake marker 和 redaction |
| production-like | 真实 endpoint / credential / artifact / registry / report 承接 | 生产配置不得绕过禁止配置化项,且 raw secret 不落盘 |

### 7.3 profile 与 P0 / P1 / P2 映射

| profile | 优先级 | 是否阻塞 P0 | 说明 |
|---|---|---|---|
| local-dev | P0 | 是 | 支撑开发和最小实现验证 |
| ci-test | P0 | 是 | 支撑自动化测试、配置校验和证据生成 |
| integration-test | P0 | 是 | 支撑跨模块 P0 主闭环验证 |
| candidate-validation | P0 | 是 | 支撑三语言 package candidate 和 evidence gate |
| staging-like | P1 | 否 | 支撑真实或 real-like 外部能力集成 |
| production-like | P1/P2 | 否 | 支撑真实消费者、endpoint、registry 和运维手册 |

### 7.4 profile 关系图

#### 配置来源链图: L0-sdk profile 分层关系

```text
P0 profiles
|
+-- local-dev
+-- ci-test
+-- integration-test
+-- candidate-validation
|
v
P1 / P2 profiles
|
+-- staging-like
+-- production-like
```

关键说明:

- P0 profiles 证明 L0-sdk 默认可验证路径、三语言 candidate 和配置红线成立。
- staging-like / production-like 承接后续真实消费者集成和发布运维,但不改变 P0 设计边界。
- 所有 profile 都遵守普通来源优先级和 secret / credential ref 边界。
- profile 是配置矩阵分类,不是本步新增代码字段。

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| profile 是配置矩阵分类,不新增 `SdkRuntimeConfig.profile` 字段 | 否 | 无代码契约变化 | 无 | 无回写 |
| local-dev / ci-test / integration-test / candidate-validation 作为 P0 profile | 否 | 配置取值差异 | 无 | 无回写 |
| staging-like / production-like 作为 P1/P2 承接方向 | 否 | 范围分级 | 无 | 无回写 |
| 各 profile 均使用既有 config 组表达差异 | 否 | 不改变 `SdkRuntimeConfig` / 子 config 结构 | 无 | 无回写 |

说明:

- 本步没有新增 runtime builder 参数、profile enum、adapter constructor 参数或错误枚举。
- Step 7 如果认为必须将 profile 做成正式配置字段,需要标记 `待回写` 并回到 `03-详细设计.md`。

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §6。

````md
## 6. 环境、部署 profile 与配置矩阵

> 校准来源：
> - `design-calibration/04_config_step_06_profiles_matrix.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“环境 / profile 配置矩阵”“profile 到测试验收承接表”“profile 与 P0 / P1 / P2 映射”和“对详细设计的影响判定”小节，了解本章 profile 口径如何收敛。

L0-sdk 的配置矩阵按 local-dev、ci-test、integration-test、candidate-validation、staging-like 和 production-like 展开。profile 是配置矩阵分类,不是本步新增的 `SdkRuntimeConfig.profile` 字段。

P0 必须覆盖 local-dev、ci-test、integration-test 和 candidate-validation。它们共同证明 L0-sdk 的默认可验证路径、配置加载、配置校验、source / boundary / runner、三语言 package candidate、redaction、fake marker、evidence 和 compatibility gate 成立。

staging-like 和 production-like 适用于后续真实消费者集成、formal API / bus boundary、credential provider、artifact / registry / report 体系和发布运维承接,但不阻塞 P0。它们不是 SDK 自身的常驻服务部署环境。

所有 profile 均遵守普通配置来源顺序 `code defaults < JSON config file < environment variables`。CLI / job args 只作为 config source selector 或 operation 局部参数。raw secret 和 raw token 不得进入普通配置来源、日志、错误返回、审计正文、测试报告或中间产物。

本章未发现需要回写 `03-详细设计.md` 的配置结论。
````

## 10. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| 是否接受 local-dev、ci-test、integration-test、candidate-validation 作为 P0 profile | A. 接受;B. 只保留 local / CI;C. 把 staging 也作为 P0 | 推荐 A | 这四类 profile 能覆盖开发、自动化、集成和 candidate 主线 |
| 是否接受 staging-like / production-like 不阻塞 P0 | A. 接受;B. staging 必须进入 P0;C. production-like 必须进入 P0 | 推荐 A | 真实 endpoint、credential provider 和 public registry 未定,不应阻塞默认路径 |
| 是否接受 profile 只是配置矩阵分类,不新增 `SdkRuntimeConfig.profile` 字段 | A. 接受;B. 新增字段;C. 等 Step 7 决定 | 推荐 A | 本步无需改变代码契约,Step 7 如有必要再评估 |

## 11. 进入下一步条件

- [x] P0 profile 划分已明确。
- [x] staging / production-like 的适用口径已明确。
- [x] 敏感配置在不同 profile 下的处理边界已明确。
- [x] 环境差异对测试和验收的影响已明确。
- [x] 本步无需回写 `03-详细设计.md`。
- [x] Step 6 状态从 `[~]` 更新为 `[x]`。
