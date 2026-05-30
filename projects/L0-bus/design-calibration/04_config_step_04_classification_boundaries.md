# Step 4. 定义配置分类与禁止配置化边界

> 本文件是 `projects/L0-bus/04-配置设计.md` 的 Step 4 中间产物。
> 本步定义配置类别、热更新 / 冷更新口径和禁止配置化边界。
> 本步不列完整配置项清单,不定义来源优先级,不写 JSON 示例,不回写 `03-详细设计.md`。

---

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 4
- 回填章节：`projects/L0-bus/04-配置设计.md` §4 配置分类与边界

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_03_control_plane_overview.md` | 已确认配置来源链、runtime 装配路径、控制面总表和模块读取边界 | 将控制面归类为启动、运行、策略、敏感、测试 / 调试等配置类别 |
| `02_hld_step_11_configuration_impact.md` §7.2 | 禁止配置化边界表 | 作为本步禁止配置化项的主要来源 |
| `03_ddd_step_14_config_dependencies.md` §7.5 | 禁止配置化校验表 | 确认禁止项应由 `ConfigValidator` / adapter constructor / policy factory 检测 |
| `01-架构设计.md` §9 / §11 / §13 | 数据所有权、一致性、横切关注点和配置管理 | 确认安全、审计、可追溯、只读输出和配置集中管理边界 |
| `03-详细设计.md` §13 | 正式详细设计中的禁止配置化边界 | 确认本步不新增代码契约 |

已确认结论:

```text
配置可以控制运行装配、profile、adapter、source、publisher、projection、policy ref、secret ref、batch、timeout、cursor 和测试可复现性。

配置不得控制或绕开领域不变量、安全红线、状态机、审计链、只读输出边界和 bus / backend / governance / observability 数据所有权边界。
```

---

## 3. SOP 问题回答

### 3.1 当前系统有哪些启动配置、运行时配置、策略配置、敏感配置、调试配置?

| 配置类别 | 说明 | 示例 | 是否允许热更新 | 主要风险 |
|---|---|---|---|---|
| 启动配置 | 决定 runtime graph 如何装配,通常在进程启动时读取 | store kind、backend kind、publisher kind、source kind、API / worker / job enablement | 否,P0 冷更新 | 热更新会造成入口、adapter 和事务边界漂移 |
| 运行参数配置 | 决定 worker / job 运行节奏和资源边界 | batch size、timeout、cursor profile、checkpoint profile、retry category | 原则上否;P0 仅重启生效 | 运行中改变可能破坏幂等、cursor 和 retry 判断 |
| 策略引用配置 | 选择已定义策略或能力引用,不直接改变领域不变量 | recovery policy ref、read consistency policy ref、backend capability ref、approval ref policy | 否,P0 冷更新 | 策略引用错误可能绕过 replay、DLQ 或只读边界 |
| 敏感引用配置 | 只保存 secret / connection 的引用,不保存明文 | secret ref、connection ref、credential provider ref | 否,P0 冷更新;轮换由后续运维承接 | raw secret 泄露、日志泄露、错误响应泄露 |
| 外部接缝配置 | 连接外部 source、backend、publisher、projection store 或后续 consumer | outbox source profile、transport backend profile、outbox publisher profile、projection store profile | 否,P0 冷更新 | 后端差异泄漏成 transport semantic |
| 测试 / fixture 配置 | 支撑 local / CI / deterministic tests | in-memory store、fixture source、in-memory backend、deterministic clock / id generator | 否,仅测试启动时选择 | 测试便利项被误用为生产默认 |
| 诊断 / 调试配置 | 支撑本地调试和证据生成,不改变业务语义 | verbose validation report、redaction check mode、local trace verbosity | 否或仅 local | 调试开关泄露敏感数据或关闭安全校验 |
| P1/P2 扩展配置 | 后续生产 adapter、config center、secret provider 等配置 | remote config source、production MQ product fields、KMS provider fields | 后续专项定义 | 提前写入会虚构字段和改变 P0 假设 |

### 3.2 哪些配置允许热更新?

P0 默认不支持热更新。所有会影响 adapter、store、source、publisher、policy、worker / job 节奏、projection 和 security boundary 的配置都采用冷更新或启动读取。

当前允许的“热”行为只限于运维观察层或后续专项：

| 配置 / 行为 | P0 是否热更新 | 处理口径 |
|---|---|---|
| store / backend / publisher / source profile | 否 | 启动读取,变更需重启 runtime |
| API / worker / jobs enablement | 否 | 启动读取,避免部分入口使用旧依赖 |
| batch size / timeout / cursor / checkpoint | 否 | 启动读取;运行中改变会影响幂等和进度判断 |
| recovery / replay / DLQ policy ref | 否 | 启动读取;运行中改变可能破坏审计链 |
| projection rebuild mode | 否 | 通过 operations job 显式触发,不通过热更新隐式触发 |
| secret ref / connection ref | 否 | P0 冷更新;轮换策略留给 Step 8 / 运维文档 |
| diagnostic verbosity | 可在 local / test 中有限允许 | 不得关闭 redaction、validator、audit 或 forbidden boundary |
| config center / remote reload | 否,P1/P2 | 后续专项定义 reload、回滚和一致性 |

### 3.3 哪些配置只能冷更新或启动读取?

以下配置必须冷更新或启动读取：

- `StoreConfig`
- `BackendConfig`
- `OutboxSourceConfig`
- `PublisherConfig`
- `ApiConfig`
- `WorkerConfig`
- `JobConfig`
- `ProjectionConfig`
- `RecoveryPolicyConfig`
- `SecurityBoundaryConfig`
- `ClockConfig`
- `IdGeneratorConfig`

原因是这些配置都会影响 runtime graph、port / adapter 实例、repository、policy set、worker / job cursor 或审计链。如果运行中无门禁替换,会出现同一 delivery / recovery / projection 链路前后配置不一致的问题。

### 3.4 哪些安全、审计、事务、一致性或领域规则禁止配置化?

禁止配置化项如下。

| 禁止配置化项 | 原因 | 如需改变应走什么流程 |
|---|---|---|
| 允许 bus 保存 payload body | 破坏 bus 只保存引用和摘要的边界 | 回到 `00-需求文档.md`、`01-架构设计.md` 和 `02-概要设计.md` 重开边界 |
| 允许保存 backend private body | 破坏后端语义归一化和信息边界 | 回到架构后端适配边界和详细设计 adapter 契约 |
| 允许 raw secret 写入配置正文、状态、日志或审计 | 破坏安全边界和 redaction 门禁 | 回到安全设计、配置设计 Step 8 和实施安全门禁 |
| 关闭关键 audit / history | 破坏 delivery、feedback、retry、DLQ、replay 的可追溯性 | 回到需求、架构横切关注点和验收门禁 |
| 允许 projection 反写 bus truth | 破坏 read-only output 边界 | 回到架构数据所有权和概要 / 详细状态机设计 |
| 允许 replay 绕过 DLQ / history / audit chain | 破坏失败恢复可信链 | 回到 recovery 需求、状态机和 governance / operator 控制边界 |
| 允许 backend raw status 直接写入 `DeliveryStatus` | 破坏 unified transport semantic | 回到后端 adapter 归一化设计 |
| 允许 `CheckBackendCapability` 自动改写 delivery truth | 混淆能力检查和 delivery truth | 回到概要状态机和详细设计 capability job |
| 允许关闭 privileged operation 授权边界 | tap、DLQ read、replay preparation、failure material 和 operator control 必须受控 | 回到安全 / governance / gateway 边界设计 |
| 允许业务幂等替代 bus 幂等 | bus 只处理 delivery / feedback 幂等,不接管业务副作用 | 回到需求和概要中的 bus 幂等边界 |
| 允许 query 自动 rebuild 并写 truth | Query 会产生隐藏写副作用 | 回到 read-only output 和 projection job 设计 |
| 允许 application 直接读取 DB / MQ / secret config | 破坏 ports and adapters 和配置集中校验 | 回到详细设计 port / adapter 边界 |

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
再进入 04 定稿 / 05 测试 / 06 验收
```

关键规则：

- 禁止配置化项不能通过环境变量、JSON、CLI args、secret provider 或 config center 覆盖。
- 禁止配置化项不能作为“临时调试开关”进入 local / CI / staging。
- 如果确实需要改变,它不是配置问题,而是需求、架构、概要或详细设计边界变化。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `04_config_step_03_control_plane_overview.md` | 已说明配置可以控制什么,但没有分类和热 / 冷更新口径 | Step 5 / Step 7 难以判断哪些配置可覆盖、哪些必须启动读取 |
| `02_hld_step_11_configuration_impact.md` | 已列禁止配置化边界,但还没有转成正式配置分类章节 | 读者可能把禁止项当成普通配置项 |
| `03_ddd_step_14_config_dependencies.md` | 已定义 validator 检测禁止项,但没有配置设计层的“禁止配置化项改变流程” | 后续实现或运维可能用配置开关绕过红线 |
| 当前旧 `05/06` | 未按新版禁止配置化边界设置配置验收门禁 | 后续测试验收需基于本步重校准 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置分类 | 只有控制面总表 | 分为启动、运行参数、策略引用、敏感引用、外部接缝、测试 / fixture、诊断 / 调试和 P1/P2 扩展 | 支撑后续来源优先级、配置项清单和测试矩阵 |
| 热更新口径 | 未明确 | P0 默认不支持热更新;影响 runtime graph 的配置均冷更新 | 避免运行中改变 adapter、policy、cursor 和审计链 |
| 禁止配置化 | 散落在概要和详细设计 | 形成正式禁止配置化项表和改变流程 | 防止配置开关绕过需求 / 架构红线 |
| 调试配置 | 未单独说明 | 允许 local / test 诊断,但不得关闭 redaction、validator、audit 或 forbidden boundary | 防止调试开关破坏安全边界 |
| 改变禁止项流程 | 未定义 | 必须回到上游设计链路,不能作为配置变更处理 | 明确禁止项属于设计不变量 |

---

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：允许部分配置热更新 | 运维灵活 | P0 会引入 runtime graph 替换、一致性、回滚和并发风险 | 不采用 |
| 方案 B：P0 全部核心配置冷更新,只允许 local / test 诊断项有限变化 | 行为稳定,实现简单,测试可重复 | 运维灵活性较低 | 采用 |
| 方案 C：禁止所有调试配置 | 安全保守 | 本地和 CI 诊断成本高 | 不采用 |
| 方案 D：把禁止项做成 hidden feature flag | 调试方便 | 本质上绕过安全和审计红线 | 不采用 |

推荐方案 B。

原因：

- 当前 P0 的重点是可验证闭环和边界稳定,不是在线动态配置系统。
- 冷更新能避免同一 delivery / recovery / projection 链路在运行中跨配置版本。
- 诊断配置可以存在,但必须被限制在 local / test,且不得关闭 redaction、validator、audit 或 forbidden boundary。

---

## 7. 结构化中间产物

### 7.1 配置分类表

| 配置类别 | 说明 | 示例 | 是否允许热更新 | 主要风险 |
|---|---|---|---|---|
| 启动配置 | 决定 runtime graph 和 adapter 装配 | store kind、backend kind、publisher kind、source kind、entry enablement | 否 | 运行中替换会造成依赖图不一致 |
| 运行参数配置 | 决定 worker / job 节奏和边界 | batch size、timeout、cursor、checkpoint、retry category | 否,P0 冷更新 | 运行中改变会影响幂等和进度判断 |
| 策略引用配置 | 选择已定义策略或能力引用 | recovery policy ref、read consistency policy ref、backend capability ref | 否 | 策略引用错误可能绕过恢复边界 |
| 敏感引用配置 | 只保存 secret / connection 引用 | secret ref、connection ref、credential provider ref | 否 | raw secret 泄露或日志泄露 |
| 外部接缝配置 | 绑定 source、backend、publisher、projection 等外部能力 | source profile、backend profile、publisher profile、projection store profile | 否 | 后端差异泄漏成平台语义 |
| 测试 / fixture 配置 | 支撑 local / CI 和 deterministic tests | in-memory backend、fixture source、deterministic clock / id generator | 否,启动选择 | 测试便利项进入生产 |
| 诊断 / 调试配置 | 支撑本地调试和配置报告 | verbose validation report、local trace verbosity | local / test 有限允许 | 泄露敏感信息或关闭安全校验 |
| P1/P2 扩展配置 | 生产 adapter、remote config、KMS 等后续能力 | config center、production MQ fields、KMS provider fields | 后续专项定义 | 提前进入会虚构字段 |

### 7.2 禁止配置化项表

| 禁止配置化项 | 原因 | 如需改变应走什么流程 |
|---|---|---|
| 保存 payload body | 破坏 bus 只保存引用和摘要的边界 | 重开需求、架构、概要和详细设计 |
| 保存 backend private body | 破坏后端语义归一化和信息边界 | 重开后端适配边界设计 |
| raw secret 写入配置正文 / 状态 / 日志 / 审计 | 破坏安全和 redaction 边界 | 重开安全、配置 Step 8 和实施安全门禁 |
| 关闭关键 audit / history | 破坏可追溯性和 replay trusted chain | 重开需求、架构横切关注点和验收门禁 |
| projection 反写 bus truth | 破坏 read-only output 边界 | 重开数据所有权、状态机和 projection 设计 |
| replay 绕过 DLQ / history / audit chain | 破坏失败恢复可信链 | 重开 recovery 状态机和治理 / operator 边界 |
| backend raw status 直接写入 `DeliveryStatus` | 破坏 unified transport semantic | 重开 adapter normalize 设计 |
| `CheckBackendCapability` 自动改写 delivery truth | 混淆能力视图和 delivery truth | 重开 capability job 与状态机设计 |
| 关闭 privileged operation 授权边界 | 破坏 tap、DLQ、replay、failure material 和 operator control 边界 | 重开安全 / governance / gateway 边界 |
| 业务幂等替代 bus 幂等 | bus 不承接业务副作用幂等 | 重开需求和概要 bus 幂等边界 |
| Query 自动 rebuild 并写 truth | Query 产生隐藏写副作用 | 重开 read-only output 和 projection job 设计 |
| application 直接读取 DB / MQ / secret config | 破坏 ports and adapters 和配置集中校验 | 重开详细设计 port / adapter 边界 |

### 7.3 热更新边界表

| 配置类别 | P0 生效方式 | 是否可热更新 | 说明 |
|---|---|---|---|
| 启动配置 | 启动读取 | 否 | 改变 runtime graph |
| 运行参数配置 | 启动读取 / job run 开始读取 | 否 | 改变 cursor、batch、timeout 和 retry 判断 |
| 策略引用配置 | 启动读取 | 否 | 改变 policy set |
| 敏感引用配置 | 启动读取 | 否 | 轮换由后续运维和 secret provider 专项处理 |
| 外部接缝配置 | 启动读取 | 否 | 改变 adapter / source / publisher |
| 测试 / fixture 配置 | 测试启动读取 | 否 | 用于可复现测试 |
| 诊断 / 调试配置 | local / test 启动读取或受控读取 | 有限允许 | 不得关闭 redaction、validator、audit 或 forbidden boundary |
| P1/P2 扩展配置 | 后续专项定义 | 后续定义 | remote reload 需专项设计 |

### 7.4 禁止配置化边界图

```text
Configuration
  |
  v
ConfigValidator / RuntimeBuilder
  |
  +-- allowed: runtime assembly / adapter profile / batch / timeout / ref
  |
  +-- rejected:
      +-- payload body persistence
      +-- raw secret persistence
      +-- audit or history disabled
      +-- projection writes truth
      +-- replay bypasses DLQ/history/audit
      +-- backend raw status becomes DeliveryStatus
      +-- privileged operation authorization disabled
```

关键说明：

- 图中 rejected 项不是普通非法值,而是设计红线。
- 被拒绝的边界不能通过 JSON、env、CLI、secret provider 或 config center 覆盖。
- `ConfigValidator` 负责静态拒绝,`RuntimeBuilder` 和 adapter / policy factory 负责装配阶段兜底。
- 如果 rejected 项需要改变,应回到上游设计链路,不是在配置设计中调整默认值。

---

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| Step 4 定义配置分类和禁止配置化边界,不新增配置字段 | 否 | 无代码契约变化 | 无 | 无回写 |
| P0 核心配置默认冷更新 / 启动读取 | 否 | 配置生效策略,未改变 `ConfigLoader` / `RuntimeBuilder` 签名 | 无 | 无回写 |
| 诊断 / 调试配置仅 local / test 有限允许,不得关闭 redaction、validator、audit 或 forbidden boundary | 否 | 配置边界约束,未新增正式配置项 | 无 | 无回写 |
| 禁止配置化项沿用概要和详细设计已有红线 | 否 | 与 `02` §11 和 `03` §13 一致 | 无 | 无回写 |

说明：

- 本步没有新增 `RuntimeConfig` 字段、`ConfigError` 枚举值或 adapter constructor 参数。
- Step 7 如果需要把某个禁止边界显式落为配置校验项,应先检查 `03` 中的 `ConfigError::ForbiddenBoundaryOverride` 是否足够表达。

---

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §4。

```md
## 4. 配置分类与边界

> 校准来源：
> - `design-calibration/04_config_step_04_classification_boundaries.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“配置分类表”“禁止配置化项表”“热更新边界表”和“对详细设计的影响判定”小节，了解本章如何区分可配置行为和设计红线。

L0-bus 的配置分为启动配置、运行参数配置、策略引用配置、敏感引用配置、外部接缝配置、测试 / fixture 配置、诊断 / 调试配置和 P1/P2 扩展配置。

P0 默认不支持核心配置热更新。凡是会改变 runtime graph、adapter、store、source、publisher、policy set、worker / job cursor 或审计链的配置,均采用启动读取或冷更新。诊断 / 调试配置只允许在 local / test 中有限使用,且不得关闭 redaction、validator、audit 或 forbidden boundary。

配置可以控制运行装配、profile、adapter、source、publisher、projection、policy ref、secret ref、batch、timeout、cursor 和测试可复现性。配置不得控制或绕开领域不变量、安全红线、状态机、审计链、只读输出边界和 bus / backend / governance / observability 数据所有权边界。

禁止配置化项包括：保存 payload body、保存 backend private body、raw secret 写入配置正文 / 状态 / 日志 / 审计、关闭关键 audit / history、projection 反写 bus truth、replay 绕过 DLQ / history / audit chain、backend raw status 直接写入 `DeliveryStatus`、`CheckBackendCapability` 自动改写 delivery truth、关闭 privileged operation 授权边界、业务幂等替代 bus 幂等、Query 自动 rebuild 并写 truth、application 直接读取 DB / MQ / secret config。

这些禁止项不是普通配置值,而是设计红线。任何改变都必须回到需求、架构、概要或详细设计重新校准,不得通过 JSON、env、CLI、secret provider 或 config center 覆盖。

本章未发现需要回写 `03-详细设计.md` 的配置结论。
```

---

## 10. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| P0 是否支持核心配置热更新 | A. 支持;B. 不支持,核心配置冷更新;C. 只支持部分 worker 参数热更新 | 推荐 B | P0 不应引入 runtime graph 替换、一致性和回滚复杂度 |
| 是否允许 local / test 调试配置关闭安全边界 | A. 允许;B. 不允许;C. 只允许人工确认 | 推荐 B | 测试环境也不能培养绕过 redaction、validator、audit 的实现习惯 |
| 禁止配置化项是否能通过 hidden feature flag 开启 | A. 可以;B. 不可以;C. 仅开发者本地可以 | 推荐 B | hidden flag 本质上破坏设计红线和验收门禁 |

---

## 11. 进入下一步条件

- [x] 配置分类表已形成。
- [x] 禁止配置化项表已形成。
- [x] 热更新 / 冷更新口径已明确。
- [x] 禁止配置化项改变流程已明确。
- [x] 本步无需回写 `03-详细设计.md`。
- [x] Step 4 状态从 `[~]` 更新为 `[x]`。
