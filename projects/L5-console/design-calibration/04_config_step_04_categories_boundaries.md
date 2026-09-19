# Step 4. 定义配置分类与禁止配置化边界

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 4
> 回填章节：`04-配置设计.md` §4
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_04_categories_boundaries.md`
> 状态：`done / pass / self_reviewed`

## 1. 目标、输入与 SOP 回答

本 Step 以 Step 3 四域为主轴，定义配置类别、更新时机与永不允许配置化的边界。

| 问题 | 收口回答 |
|---|---|
| 有哪些类别？ | startup runtime selector、startup binding correlation、optional side-path switch、static design boundary（非配置项）。当前无 raw sensitive/secret 配置、无运行时策略阈值、无 build-time feature。 |
| 哪些允许热更新？ | P0 全部不允许 hot/reload；whole document 仅 startup 读取。变更须重新装配/重启当前客户端 runtime。 |
| 哪些必须 cold/startup？ | 四域全部 startup；profile/binding/switch 在 runtime 生命周期内冻结。 |
| 哪些禁止配置化？ | truth/owner、Policy/Gate、context/visibility/qualification/safe-field guard、Query no-write、状态正向恢复、unknown/no replay、owner command/invalidation activation、forbidden-body、a11y等价、formal audit/evidence、state durability claim等。 |
| 禁止项如何改变？ | 必须先回需求/架构/详细设计及相应 owner合同；不能通过配置版本/迁移兼容。 |

## 2. 诊断、对比与取舍

| 风险候选 | 收口 |
|---|---|
| 用 feature flag 隐藏权限/资格问题 | flag不授权；guard永远执行 |
| 用 profile 选择 owner truth 或不同状态机 | profile只选择装配姿态，不改变不变量 |
| hot reload 交换 adapter/carrier | P0禁止；会改变 builder lifecycle，需先回写03 |
| 把 diagnostic/invalidation 当业务 feature | 仅 optional side path；disabled不影响核心显式Query |
| 把 `configured-medium` 当配置选项 | 当前没有配置项且不得返回正向姿态 |
| 允许 `bindingRef` 为 URL/secret | whole-document reject |

## 3. 结构化中间产物

### 3.1 配置分类

| 类别 | 说明 | 示例 | 热更新 | 风险 |
|---|---|---|---|---|
| static design boundary | 不是普通配置，只声明不可变红线 | owner truth、guard、Query no-write、unknown/no-replay | N/A | 被伪装成 flag 会绕过设计 |
| startup runtime selector | runtime 构造前选择安全姿态 | `runtime.profile` | 否 | profile 名被误当 readiness |
| startup binding correlation | runtime 构造前登记封闭 slot 与 local ref | `bindings.adapterBindings[]` | 否 | 任意 endpoint/method或假 `bound` |
| startup optional-path switch | 请求装配可禁用旁路 | invalidation/diagnostics `enabled` | 否 | 合同缺失仍启用、旁路改变业务结果 |
| future sensitive ref | 当前 P0 不适用 | future endpoint/credential/provider ref | 否/待设计 | 浏览器泄密；必须先回写 03/04 |
| future runtime policy | 当前 P0 不适用 | TTL/sampling/timeout/threshold | 待设计 | 无 authority 数字、改变生命周期 |

### 3.2 更新时机

| 域 | 读取时机 | 生命周期内是否可变 | 变更方式 | 失败姿态 |
|---|---|---|---|---|
| runtime | bootstrap 前 | 否 | 新 validated document + 新 runtime assembly | startup fail-fast |
| bindings | registry 构造前 | 否 | whole-document 替换并重建 registry | duplicate/invalid/forbidden reject |
| invalidation | runtime 构造前 | 否 | 新 runtime；不得动态订阅/退订 | unsupported true reject；false disabled |
| diagnostics | runtime 构造前 | 否 | 新 runtime；不得动态换 sink | unsupported true reject；false disabled |

### 3.3 禁止配置化项

| 禁止项 | 原因 | 改变流程 |
|---|---|---|
| owner/truth/data ownership | 防止 Console 成为第二真相 | 回 00/01/02/03 及 owner设计 |
| DB/repository/private bus/BFF/worker/job/direct owner private schema | 绕过 SDK/正式边界 | 架构与详细设计重开 |
| context、visibility、qualification、safe-field/redaction guard | 权限与最小披露红线 | 安全/owner合同 + 03/05/06 |
| Query zero-write 和唯一 owner submit side effect | 防止读取/flag触发写入 | 协议/flow重新设计 |
| receipt/transport/toast/cache/route→confirmed/current/active | 防止 UI 推导 formal state | 状态与owner合同重开 |
| unknown/no replay/reconciliation ceiling | 防止重复副作用 | owner幂等/结果合同 + 03 |
| command/activation without exact formal contracts | 防止配置冒充能力 | 合同到达并回写 adapter/protocol |
| invalidation without envelope/id/order/dedup | 防止不可信提示污染状态 | SDK/event合同 + 03 Step 7/8/9/13 |
| forbidden body/credential/secret/raw error/URL/DOM in config/state/diagnostic | 数据最小化和泄露红线 | 安全设计变更；默认不可兼容 |
| state load 恢复 verified/current/active/confirmed | carrier非formal truth | 状态/一致性设计变更 |
| configured durability/TTL/migration/cross-session 声明 | `CON-Q-044` 未闭口 | 先回写 03/04/05/06 |
| diagnostics=正式 audit/evidence/report/readiness | Console不拥有正式证明 | owner/观测合同与架构变更 |
| a11y通道独立业务动作或放宽 guard | 必须三通道语义等价 | 03/05/06 a11y设计重开 |
| 未停审 L5/L6 私有 link/ref | 不能消费平行项目未停审真相 | 等双方正式合同后回设计 |

### 3.4 按域分类边界

| 域 | 适用类别 | 不适用类别 | 域内禁止项 | 原因 |
|---|---|---|---|---|
| runtime | startup selector | hot/reload/build-time/sensitive/policy threshold | 任意值、readiness/权限/owner选择 | union 已封闭 |
| bindings | startup correlation | raw secret、endpoint、admin override、dynamic discovery | slot外值、重复slot、profile不匹配、ref正文 | 只关联既有窄slot |
| invalidation | startup optional switch | event topic/cursor/retry/hot subscription | 无合同true、写入/refresh、直连bus | hint仅单调收紧 |
| diagnostics | startup optional switch | endpoint/sampling/batching/retention/metadata map | 无sink true、raw body、影响业务结果、audit/evidence | optional body-free facade |

### 3.5 域内停审与跨分类审计

| 域/项 | 类别明确 | 更新边界明确 | 禁止项可执行 | 结论 |
|---|---|---|---|---|
| runtime | yes | startup frozen | exact enum + forbidden keys | pass |
| bindings | yes | startup frozen | closed slot/ref validation | pass with contract blockers |
| invalidation | yes | startup frozen | false default + true prerequisites | pass with explicit blocker |
| diagnostics | yes | startup frozen | false default + safe fake/sink prerequisites | pass with explicit blocker |

| 跨分类审计项 | 结论 |
|---|---|
| 同一行为在不同域分类一致 | pass；全部 startup-only |
| 禁止项是否遗漏安全/状态/审计/a11y | pass |
| P1/P2 是否污染 P0 schema | no |
| feature flag 是否改变领域/owner语义 | no |
| sensitive/raw secret 是否混入普通配置 | no |
| 是否引入 03 新契约 | no |

## 4. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 四域均 startup-only/frozen | 否 | 细化既有启动装配 | 不适用 | 无回写 |
| 配置只请求 optional path，不能产生 bound/active/readiness | 否 | 既有 availability 语义 | 不适用 | 无回写 |
| future hot reload/dynamic adapter swap | 是 | builder/port/flow/concurrency变更 | 03 Step 7/9/13/14 | 当前禁止；未来先回写 |
| future sensitive/threshold/state config | 是 | 新字段/validation/lifecycle | 03 Step 11/14/15 | 当前不进入 schema |

## 5. 回填、待确认与门禁

正式 §4 应保留分类表和禁止配置化项表；明确“当前无 sensitive/secret配置项”不等于可把 secret 放进普通项。所有禁止项均是 validator/design-review veto。

| 待确认 | 当前处理 |
|---|---|
| 是否未来需要 hot reload | P2 design-change-required；P0 reject |
| state/diagnostic/invalidation正向产品能力 | pending；不形成额外类别或配置项 |

| 进入 Step 5 条件 | 结论 |
|---|---|
| 类别和更新时机完整 | pass |
| 每域禁止边界停审 | pass / explicit blocker |
| 跨分类无 unresolved 冲突 | pass |
| 无当前 03 待回写 | pass |

Step 4 `done / pass / self_reviewed`；允许串行进入 Step 5。正式 04 仍不可写。
