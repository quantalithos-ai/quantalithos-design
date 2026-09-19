# Step 6. 定义环境、部署 profile 与配置矩阵

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 6
> 回填章节：`04-配置设计.md` §6
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_06_environment_profiles_matrix.md`
> 状态：`done / pass / self_reviewed`

## 1. 目标与关键判断

本 Step 把常见环境名称映射到 03 已存在的三种 `ConsoleRuntimeProfile`，不新增 profile union。环境名是部署/测试上下文；runtime profile 是 typed config 值；二者都不表示 readiness。

| SOP问题 | 回答 |
|---|---|
| local/CI/test/staging/prod是否适用？ | 都作为环境角色说明适用，但当前仅 local与CI可用 `local-fake` 完成安全设计/测试；integration/test映射`integration-pending`；staging/prod映射`production-pending`且保持blocked/minimal。 |
| 来源？ | defaults + 每环境一个host-provided strict JSON document；不得以env叶子覆盖漂移。 |
| 外部依赖？ | local/CI使用parity fake/disabled dependencies；integration/staging/prod只有已到正式合同的facet可绑定，其余pending/disabled。 |
| 敏感配置？ | 所有环境browser config都不得含raw secret；当前也无secret ref项。认证由host/SDK正式边界提供，不进入配置。 |
| 对测试/验收影响？ | 必须验证profile isolation、fake不能进入production-pending、flags前置、partial binding、blocked/minimal posture，不得声称staging/prod已具备。 |

## 2. 诊断与取舍

| 候选问题 | 收口 |
|---|---|
| 为每环境新增profile enum | 否；映射到既有三值，避免改03 |
| staging/prod因名字存在即可启用 | 否；`production-pending`明确保持pending |
| local fake默认profile | 仍要求显式`runtime.profile`，避免误入fake |
| CI可启用diagnostics | 仅注入body-free fake sink且显式true时；不是正式诊断 |
| integration可启用invalidation | 当前否；formal envelope/order/dedup未闭口 |
| prod使用empty bindings启动 | 可进入minimal/pending shell仅作为fail-closed姿态，不构成产品release/readiness |

## 3. 结构化中间产物

### 3.1 环境 / profile 总表

| 环境角色 | 用途 | runtime profile | 配置来源 | 外部依赖 | 敏感处理 | 当前姿态/差异 |
|---|---|---|---|---|---|---|
| local design/dev | 本地对象/flow/UI shell与负向验证 | `local-fake` | safe defaults + local strict JSON | parity fake host/formal adapters；session-volatile carrier；diagnostic fake可选 | 零raw secret；fixture不得含credential/body | 允许fake，默认invalid/diagnostic false；不证明integration |
| CI unit/contract | 可重复schema/guard/adapter parity测试 | `local-fake` | checked test JSON/fixture selector（document外） | deterministic parity fake；no network required | 零secret；fixture redaction scan | fake必须覆盖blocked/unknown/cancel；无evidence事实声明 |
| integration/test | 正式SDK/owner surface到达后的按facet集成 | `integration-pending` | 一个受控 strict JSON | 已闭合facet可绑定；其它pending；volatile state | credential由test host/SDK边界处理，不进document | 当前全部positive owner facet受blocker；invalidation/diagnostics默认false |
| staging-like | future production-like rehearsal | `production-pending` | 一个受控发布artifact | 仅正式approved bindings；不得fake | browser artifact零secret | 当前blocked/minimal；不得声称staging ready |
| production | 正式产品运行目标 | `production-pending` | 一个批准的immutable artifact | 正式contract/host/carrier/sink authority均需另行闭合 | 零raw secret/ref；auth材料由host/SDK | 当前pending，不是可发布profile；flags false |

### 3.2 Profile 外部依赖矩阵

| dependency family | local-fake | integration-pending | production-pending |
|---|---|---|---|
| host lifecycle/presentation/route/a11y | parity fake或受控local host；仍执行guards | formal test host待定 | approved production host待定 |
| formal owner/SDK adapters | parity fake；不得登记production `bound` | per-facet contract到达才可bind；当前pending | 全部所需facet正式闭合才可bind；当前pending |
| state carrier | session-volatile | session-volatile | session-volatile上限；configured medium未授权 |
| SDK invalidation | false/disabled | false/disabled pending contract | false/disabled pending contract |
| diagnostics | false；可选body-free fake sink | false；formal test sink待合同 | false；production sink/envelope pending |
| external L5/L6 links | disabled/pending | 按双方停审合同 | 按双方停审合同；当前不得依赖 |

### 3.3 Profile 来源矩阵

| profile | profile必填 | bindings default | invalidation default | diagnostics default | forbidden override |
|---|---|---|---|---|---|
| local-fake | yes | `[]`，需显式fake binding项才请求装配 | false | false | production/private endpoint、secret、owner body |
| integration-pending | yes | `[]`，正式facet逐项显式列 | false | false | fake标为formal、未闭口consumer/sink |
| production-pending | yes | `[]`，仅approved formal slots | false | false | 所有fake/test fixture、unsupported true、configured medium claim |

### 3.4 测试/验收承接矩阵

| 场景 | 05应验证 | 06未来裁决输入 |
|---|---|---|
| local/CI fake isolation | parity fake覆盖安全分支且不能进入production-pending | fake污染production为veto |
| integration per-facet partial | 一个slot成功不掩盖其它pending/unknown | partial来源和blocked姿态必须可见 |
| staging/prod pending | 缺合同时只minimal/blocked，不启动危险路径 | 任一虚假bound/active/readiness为veto |
| flags | 默认false；true缺前置时reject | 无合同启用consumer/sink为veto |
| browser secret | 所有profile raw secret/no-output负向 | secret进入artifact/log/error为veto |
| state | 所有profile仅session-volatile | durability/cross-session虚假声明为veto |

### 3.5 Profile停审与跨profile审计

| profile | 来源清楚 | 依赖清楚 | secret边界 | 状态 | 结论 |
|---|---|---|---|---|---|
| local-fake | yes | parity fake/volatile/optional fake sink | zero secret | usable only for design/test | pass |
| integration-pending | yes | per-facet pending | zero secret | current positive integration blocked | pass with blockers |
| production-pending | yes | approved-only | zero secret | current release/readiness blocked | pass with blockers |

| 跨profile审计 | 结论 |
|---|---|
| fake是否可能进入production-pending | no；cross-field reject |
| profile是否改变安全/状态不变量 | no |
| 环境名是否新增03 enum | no |
| 一个owner success是否掩盖其它partial | no |
| staging/prod是否被写成已具备 | no |
| 配置来源是否因环境漂移 | no；每环境单artifact，同一schema |

## 4. 对详细设计的影响判定

| 结论 | 是否影响03 | 类型 | 回写位置 | 状态 |
|---|---|---|---|---|
| 五类环境映射既有三profile | 否 | 环境语义映射 | N/A | 无回写 |
| production-pending保持blocked而非新增production-ready | 否 | 承接profile命名与availability | N/A | 无回写 |
| state所有profile当前session-volatile | 否 | 既有安全上限 | N/A | 无回写 |
| future profile值/host/storage/sink lifecycle | 是 | union/config/builder/adapter变更 | 03 Step 3/7/11/14/15 | 当前排除 |

## 5. 回填、待确认与门禁

正式§6应突出环境角色≠profile≠readiness，避免把staging/prod行误读为已具备。旧05/06的workspace store/action history矩阵不继承。

| 待确认 | 处理 |
|---|---|
| exact staging/prod运行组合 | pending；production-pending保持blocked |
| browser/a11y support matrix | 05/06+`CON-Q-046`；04不写兼容结论 |

| 进入Step 7条件 | 结论 |
|---|---|
| P0环境/profile差异可定位 | pass |
| 外部依赖与secret处理明确 | pass / explicit blockers |
| 测试/验收输入明确 | pass |
| 无03待回写 | pass |

Step 6 `done / pass / self_reviewed`；允许串行进入 Step 7。正式04仍不可写。
