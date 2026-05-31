# Step 4. 定义配置分类与禁止配置化边界

> 本文件是 `projects/L0-sdk/04-配置设计.md` 的 Step 4 中间产物。
> 本步定义 SDK 配置类别、热更新 / 冷更新口径和禁止配置化边界。
> 本步不列完整配置项清单,不定义来源优先级,不写 JSON 示例,不回写 `03-详细设计.md`。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 4
- 回填章节：`projects/L0-sdk/04-配置设计.md` §4 配置分类与边界

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_03_control_plane_overview.md` | 已确认配置来源链、runtime 装配路径、控制面总表和模块读取边界 | 将控制面归类为启动、运行装配、策略、敏感、测试 / fixture、诊断和扩展配置 |
| `02-概要设计.md` §11.2 | 禁止配置化边界表 | 作为本步禁止配置化项的主要来源 |
| `03-详细设计.md` §13.5 | 配置禁止项 | 确认禁止项应由 `ConfigValidator`、`SdkRuntimeBuilder`、policy factory 或 adapter constructor 检测 |
| `03-详细设计.md` §11 / §16 / §17 | 异常恢复、实施承接和已关闭决策 | 确认 raw body、raw secret、fake success、public registry publish 和源码依赖红线 |
| `01-架构设计.md` §3 / §4 / §13 | 架构约束、职责边界和演进取舍 | 确认 SDK 不能配置成 gateway、auth provider、bus runtime、服务端聚合层或 public release manager |

已确认结论:

```text
配置可以控制 SDK runtime 装配、source / boundary / runner / artifact / outbox / projection profile、language package profile、policy profile、CLI / job 参数和测试可复现性。

配置不得控制或绕开 core / bus / service truth、SDK semantic baseline、状态机、candidate / evidence / compatibility gate、redaction / credential 下限、fake marker、只读查询边界和 SDK 职责边界。
```

## 3. SOP 问题回答

### 3.1 当前系统有哪些启动配置、运行时配置、策略配置、敏感配置、调试配置?

| 配置类别 | 说明 | 示例 | 是否允许热更新 | 主要风险 |
|---|---|---|---|---|
| 启动配置 | 决定 `SdkRuntimeHandle` 如何装配,通常在进程或 job 启动时读取 | store kind、source kind、boundary kind、runner kind、CLI / jobs enablement | 否,P0 冷更新 | 运行中替换会造成 adapter、repository 和 policy set 不一致 |
| 运行装配配置 | 绑定 source、boundary、runner、artifact、outbox、projection 等接缝 | local source、fake boundary、formal API endpoint ref、local runner、artifact root | 否,P0 冷更新 | 外部接缝漂移会造成 candidate / evidence 不可复核 |
| 运行参数配置 | 决定 job 或 runner 的执行节奏和资源边界 | run id、target、batch size、timeout、artifact root、report root | 否;job run 开始读取 | 运行中改变可能破坏幂等和报告归档 |
| 策略配置 | 选择已定义策略或更严格 profile | redaction profile、credential protection profile、trace profile、error mapping profile | 否,P0 冷更新 | 策略引用错误可能绕过安全下限 |
| 敏感引用配置 | 只保存 secret / credential / endpoint 的引用 | `SecretRef`、`CredentialRef`、endpoint credential ref | 否,P0 冷更新 | raw secret、raw token 或生产响应正文泄露 |
| 测试 / fixture 配置 | 支撑 local / CI 和 deterministic tests | fixture source、fake endpoint、deterministic clock / id、in-memory store | 否,启动选择 | 测试便利项被误认为 production capability |
| 诊断 / 调试配置 | 支撑本地调试和证据生成,不改变 SDK truth | verbose validation report、local trace verbosity、redaction report mode | local / test 有限允许 | 泄露敏感数据或弱化安全门禁 |
| P1/P2 扩展配置 | 后续 production endpoint、public registry、remote config 等能力 | registry publish profile、remote config source、hot reload | 后续专项定义 | 提前写入会虚构字段并扩大 P0 |

### 3.2 哪些配置允许热更新?

P0 默认不支持核心配置热更新。所有会影响 runtime graph、adapter、source、boundary、runner、artifact store、projection、outbox、policy set、language package 和 security boundary 的配置都采用冷更新或启动读取。

当前允许的“热”行为只限于 local / test 诊断层或后续专项:

| 配置 / 行为 | P0 是否热更新 | 处理口径 |
|---|---|---|
| store / source / boundary / runner / artifact / projection profile | 否 | 启动读取,变更需重启 runtime |
| CLI / jobs enablement | 否 | 启动读取,避免入口依赖图漂移 |
| job run id / target / artifact root / report root | 否 | job run 开始读取,不在运行中改变 |
| language package profile | 否 | candidate 生成前读取,运行中不替换 |
| redaction / credential / trace / error mapping profile | 否 | 启动读取,只允许等强或更严格 profile |
| secret / credential ref | 否 | P0 冷更新;轮换由 Step 8 / 运维文档承接 |
| diagnostic verbosity | local / test 有限允许 | 不得关闭 redaction、credential protection、validator、fake marker 或 evidence gate |
| remote config / hot reload | 否,P1/P2 | 后续专项定义 reload、回滚、审计和一致性 |

### 3.3 哪些配置只能冷更新或启动读取?

以下配置必须冷更新或启动读取:

- `StoreConfig`
- `SourceSnapshotConfig`
- `BoundaryConfig`
- `RunnerConfig`
- `ArtifactStoreConfig`
- `OutboxConfig`
- `ProjectionConfig`
- `LanguagePackageConfig`
- `PolicyConfig`
- `CliConfig`
- `JobConfig`

原因是这些配置都会影响 `SdkRuntimeHandle`、port / adapter 实例、repository、runner、policy set、artifact / report 输出、candidate 状态和 evidence 链。如果运行中无门禁替换,会出现同一 candidate / evidence / compatibility 链路前后配置不一致的问题。

### 3.4 哪些安全、审计、事务、一致性或领域规则禁止配置化?

| 禁止配置化项 | 原因 | 如需改变应走什么流程 |
|---|---|---|
| 用配置替代 `L0-core` / `L0-bus` / formal API truth | SDK 只消费上游 truth,不能制造第二事实源 | 回到需求、架构和对应上游仓设计 |
| 分裂 `SdkSemanticBaseline` | 三语言可以 idiomatic,但不能语义分裂 | 回到概要主要组成部分、对象和状态机设计 |
| 把 stale / unknown / unsupported 配成 fresh / supported | 会绕过上游 freshness 和 capability 判断 | 回到 source refresh、状态机和错误恢复设计 |
| 把 fake success 标记为 production success | 会污染 capability support 和 candidate gate | 回到 formal / fake boundary 和测试设计 |
| 关闭 redaction / credential protection 下限 | 会泄露 raw secret、payload body 或生产 request / response body | 回到安全需求、架构横切关注点和测试门禁 |
| raw secret / raw token 写入配置、状态、日志、审计或 evidence | 破坏敏感信息保护和可审计边界 | 回到配置 Step 8、安全设计和实施门禁 |
| 把 redaction marker 当成 evidence passed | redaction 不等于验证通过 | 回到 evidence 模型和状态机设计 |
| 绕过 compatibility / evidence gate | 会让未验证 candidate 进入 `Stable` | 回到 compatibility、evidence 和 candidate 状态机设计 |
| 把 `Stable` 配置成 public registry publish | `Stable` 只是本地稳定基线,不等于公共发布 | 回到发布专项和实施计划 |
| Query 或 projection rebuild 写 SDK truth | 破坏只读查询和 projection rebuild 边界 | 回到 handler / repository 权限约束 |
| runtime boundary call 改写 SDK truth | formal / fake / bus boundary 结果不能直接写 truth | 回到 service / event boundary 设计 |
| 把 L1/L2/L3/L4 服务仓写成 Cargo path dependency | 会让 SDK 拥有服务端业务 truth | 回到全局依赖裁剪和详细设计依赖绑定 |
| 把 SDK 配成 auth provider、gateway、bus runtime 或 public release manager | 破坏 SDK 官方客户端接入层职责 | 回到需求范围和架构边界 |

### 3.5 禁止配置化项如需改变应走什么流程?

禁止配置化项不是普通配置变更。任何改变都必须回到设计链路重新讨论。

```text
提出改变禁止配置化边界
  |
  v
判断是否改变需求 / 架构 / 概要 / 详细设计
  |
  +-- 是 -> 回到对应上游文档重新校准
  |
  +-- 否 -> 进入配置设计 Step 14 风险和待确认事项
  |
  v
完成 03 回写或明确阻塞
  |
  v
再进入 04 定稿 / 05 测试 / 06 验收 / 07 实施
```

关键规则:

- 禁止配置化项不能通过 JSON、env、CLI / job args、secret provider 或 remote config 覆盖。
- 禁止配置化项不能作为“临时调试开关”进入 local / CI / staging。
- 如果确实需要改变,它不是配置问题,而是需求、架构、概要或详细设计边界变化。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `04_config_step_03_control_plane_overview.md` | 已说明配置控制面,但没有分类和热 / 冷更新口径 | Step 5 / Step 7 难以判断哪些配置可覆盖、哪些必须启动读取 |
| `02-概要设计.md` §11.2 | 已列禁止配置化边界,但还没有转成正式配置分类章节 | 读者可能把禁止项当成普通配置项 |
| `03-详细设计.md` §13.5 | 已列配置禁止项,但没有配置设计层的改变流程 | 后续实现或运维可能用配置开关绕过红线 |
| 当前 `05/06` | 未按新版禁止配置化边界设置配置验收门禁 | 后续测试验收需基于本步重校准 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置分类 | 只有控制面总表 | 分为启动、运行装配、运行参数、策略、敏感、测试 / fixture、诊断 / 调试和 P1/P2 扩展 | 支撑后续来源优先级、配置项清单和测试矩阵 |
| 热更新口径 | 未明确 | P0 默认不支持核心配置热更新;影响 runtime graph 的配置均冷更新 | 避免运行中改变 adapter、policy、runner 和 evidence 链 |
| 禁止配置化 | 散落在概要和详细设计 | 形成正式禁止配置化项表和改变流程 | 防止配置开关绕过需求 / 架构红线 |
| 调试配置 | 未单独说明 | 允许 local / test 诊断,但不得关闭 redaction、credential protection、validator、fake marker 或 gate | 防止调试开关破坏安全边界 |
| 改变禁止项流程 | 未定义 | 必须回到上游设计链路,不能作为配置变更处理 | 明确禁止项属于设计不变量 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：允许部分核心配置热更新 | 运维灵活 | P0 会引入 runtime graph 替换、一致性、回滚和并发风险 | 不采用 |
| 方案 B：P0 全部核心配置冷更新,只允许 local / test 诊断项有限变化 | 行为稳定,实现简单,测试可重复 | 运维灵活性较低 | 采用 |
| 方案 C：禁止所有诊断配置 | 安全保守 | 本地和 CI 诊断成本高 | 不采用 |
| 方案 D：把禁止项做成 hidden feature flag | 调试方便 | 本质上绕过安全、状态机和验收门禁 | 不采用 |

推荐方案 B。

原因:

- 当前 P0 的重点是 official SDK default verifiable path 和边界稳定,不是在线动态配置系统。
- 冷更新能避免同一 candidate / evidence / compatibility 链路在运行中跨配置版本。
- 诊断配置可以存在,但必须限制在 local / test,且不得关闭 redaction、credential protection、validator、fake marker 或 gate。

## 7. 结构化中间产物

### 7.1 配置分类表

| 配置类别 | 说明 | 示例 | 是否允许热更新 | 主要风险 |
|---|---|---|---|---|
| 启动配置 | 决定 runtime graph 和 adapter 装配 | store kind、source kind、boundary kind、runner kind、entry enablement | 否 | 运行中替换会造成依赖图不一致 |
| 运行装配配置 | 控制 infra ports / adapters 如何装配 | source profile、boundary profile、runner profile、artifact store profile | 否 | 外部接缝漂移会污染 candidate / evidence |
| 运行参数配置 | 决定 job / runner 节奏和边界 | run id、target、batch、timeout、artifact root、report root | 否 | 运行中改变会影响幂等和报告归档 |
| 策略配置 | 选择已定义安全和横切策略 profile | redaction、credential、trace、error mapping、fake marker policy | 否 | 如果越界,会变成绕过安全下限的开关 |
| 敏感引用配置 | 只保存 secret / credential 引用 | secret ref、credential ref、endpoint credential ref | 否 | raw secret 或 raw token 泄露 |
| 测试 / fixture 配置 | 支撑 local / CI 和 deterministic tests | fixture source、fake endpoint、in-memory store、deterministic id | 否,启动选择 | fake / fixture 被误认为 production capability |
| 诊断 / 调试配置 | 只用于 local / CI 诊断,不改变 SDK truth | verbose report、local trace verbosity、redaction report mode | local / test 有限允许 | 泄露敏感信息或关闭安全校验 |
| P1/P2 扩展配置 | production endpoint、registry、remote config 等后续能力 | remote config、registry publish profile、hot reload | 后续专项定义 | 未经审计的在线变更破坏主线 |

### 7.2 禁止配置化项表

| 禁止配置化项 | 原因 | 如需改变应走什么流程 |
|---|---|---|
| 用配置替代上游 truth | SDK 只能消费 core / bus / formal API truth | 需求 / 架构 / 对应上游仓重校准 |
| 分裂 `SdkSemanticBaseline` | 三语言不能形成不同平台语义 | 概要和详细设计重校准 |
| stale / unknown / unsupported 伪装成 fresh / supported | 破坏 freshness 和 capability 判断 | 状态机和 source 设计重校准 |
| fake success 伪装 production success | 污染 capability support 和 candidate gate | formal / fake boundary 与测试设计重校准 |
| 关闭 redaction / credential protection | 泄露 raw secret、payload body 或生产请求响应 | 安全需求、架构和测试门禁重校准 |
| raw secret / raw token 写入配置或证据 | 破坏敏感信息保护 | 配置 Step 8 和安全实施门禁重校准 |
| redaction marker 等于 evidence passed | redaction 与验证结果是两件事 | evidence 模型重校准 |
| 绕过 compatibility / evidence gate | 未验证 candidate 可能进入 `Stable` | candidate / evidence / compatibility 状态机重校准 |
| `Stable` 等于 public registry publish | public publish 是发布专项,不是本地状态 | 发布专项和实施计划重校准 |
| Query / projection rebuild 写 truth | 破坏只读边界 | handler / repository 权限重校准 |
| runtime boundary call 写 SDK truth | formal / fake / bus boundary 不能拥有 SDK truth | service / event boundary 重校准 |
| 服务仓源码作为 SDK Cargo 依赖 | SDK 会拥有服务端业务 truth | 全局依赖裁剪和详细设计重校准 |
| SDK 变成 auth / gateway / bus runtime / public release manager | 破坏官方客户端接入层职责 | 需求和架构边界重校准 |

### 7.3 热更新边界表

| 配置类别 | P0 生效方式 | 是否可热更新 | 说明 |
|---|---|---|---|
| 启动配置 | 启动读取 | 否 | 改变 runtime graph |
| 运行装配配置 | 启动读取 | 否 | 改变 adapter / source / runner |
| 运行参数配置 | job run 开始读取 | 否 | 改变 runner、artifact 和 report 归档 |
| 策略配置 | 启动读取 | 否 | 改变 policy set |
| 敏感引用配置 | 启动读取 | 否 | 轮换由 Step 8 和运维专项处理 |
| 测试 / fixture 配置 | 测试启动读取 | 否 | 用于可复现测试 |
| 诊断 / 调试配置 | local / test 启动读取或受控读取 | 有限允许 | 不得关闭安全下限和 gate |
| P1/P2 扩展配置 | 后续专项定义 | 后续定义 | remote reload 需专项设计 |

### 7.4 禁止配置化边界图

#### 配置来源链图: L0-sdk 禁止配置化边界

```text
Configuration
  |
  v
ConfigValidator / SdkRuntimeBuilder
  |
  +-- allowed: runtime assembly / adapter profile / runner / ref
  |
  +-- rejected:
      +-- upstream truth replacement
      +-- semantic baseline split
      +-- fake-as-production
      +-- disabled redaction or credential protection
      +-- raw secret or raw token persistence
      +-- evidence / compatibility gate bypass
      +-- query or boundary writes truth
      +-- SDK becomes gateway / auth / bus runtime / release manager
```

关键说明:

- 图中 rejected 项不是普通非法值,而是设计红线。
- 被拒绝的边界不能通过 JSON、env、CLI / job args、secret provider 或 remote config 覆盖。
- `ConfigValidator` 负责静态拒绝,`SdkRuntimeBuilder`、adapter 和 policy factory 负责装配阶段兜底。
- 如果 rejected 项需要改变,应回到上游设计链路,不是在配置设计中调整默认值。

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| Step 4 定义配置分类和禁止配置化边界,不新增配置字段 | 否 | 无代码契约变化 | 无 | 无回写 |
| P0 核心配置默认冷更新 / 启动读取 | 否 | 配置生效策略,未改变 `ConfigLoader` / `SdkRuntimeBuilder` 签名 | 无 | 无回写 |
| 诊断 / 调试配置仅 local / test 有限允许,不得关闭 redaction、credential protection、validator、fake marker 或 gate | 否 | 配置边界约束,未新增正式配置项 | 无 | 无回写 |
| 禁止配置化项沿用概要和详细设计已有红线 | 否 | 与 `02` §11 和 `03` §13 一致 | 无 | 无回写 |

说明:

- 本步没有新增 `SdkRuntimeConfig` 字段、配置错误枚举值或 adapter constructor 参数。
- Step 7 如果需要把某个禁止边界显式落为配置校验项,应先检查 `03` 的错误模型是否足够表达。

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §4。

```md
## 4. 配置分类与边界

> 校准来源：
> - `design-calibration/04_config_step_04_classification_boundaries.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“配置分类表”“禁止配置化项表”“热更新边界表”和“对详细设计的影响判定”小节，了解本章如何区分可配置行为和设计红线。

L0-sdk 的配置分为启动配置、运行装配配置、运行参数配置、策略配置、敏感引用配置、测试 / fixture 配置、诊断 / 调试配置和 P1/P2 扩展配置。

P0 默认不支持核心配置热更新。凡是会改变 runtime graph、adapter、source、boundary、runner、artifact store、projection、outbox、policy set、language package 或 security boundary 的配置,均采用启动读取或冷更新。诊断 / 调试配置只允许在 local / test 中有限使用,且不得关闭 redaction、credential protection、validator、fake marker 或 evidence / compatibility gate。

配置可以控制 SDK runtime 装配、source / boundary / runner / artifact / outbox / projection profile、language package profile、policy profile、CLI / job 参数和测试可复现性。配置不得控制或绕开 core / bus / service truth、SDK semantic baseline、状态机、candidate / evidence / compatibility gate、redaction / credential 下限、fake marker、只读查询边界和 SDK 职责边界。

这些禁止项不是普通配置值,而是设计红线。任何改变都必须回到需求、架构、概要或详细设计重新校准,不得通过 JSON、env、CLI / job args、secret provider 或 remote config 覆盖。

本章未发现需要回写 `03-详细设计.md` 的配置结论。
```

## 10. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| P0 是否支持核心配置热更新 | A. 支持;B. 不支持,核心配置冷更新;C. 只支持部分 runner 参数热更新 | 推荐 B | P0 不应引入 runtime graph 替换、一致性和回滚复杂度 |
| 是否允许 local / test 诊断配置关闭安全边界 | A. 允许;B. 不允许;C. 只允许人工确认 | 推荐 B | 测试环境也不能培养绕过 redaction、credential protection 和 gate 的实现习惯 |
| 禁止配置化项是否能通过 hidden feature flag 开启 | A. 可以;B. 不可以;C. 仅开发者本地可以 | 推荐 B | hidden flag 本质上破坏设计红线和验收门禁 |

## 11. 进入下一步条件

- [x] 配置分类表已形成。
- [x] 禁止配置化项表已形成。
- [x] 热更新 / 冷更新口径已明确。
- [x] 禁止配置化项改变流程已明确。
- [x] 本步无需回写 `03-详细设计.md`。
- [x] Step 4 状态从 `[~]` 更新为 `[x]`。
