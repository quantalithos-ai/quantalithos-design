# Step 2. 明确配置设计目标、范围和非范围

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 2
> 回填章节：`04-配置设计.md` §2
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_02_scope.md`
> 状态：`done / pass / self_reviewed`

## 1. 本步目标与输入

本 Step 将 Step 1 的输入边界收敛为 P0/P1/P2 配置范围和明确非范围。输入为 Step 1、正式 `03` §13、03 Step 14/18；不写具体 key/value，不选择部署产品。

| 输入 | 用途 |
|---|---|
| Step 1 输入映射 | 固定四个现有字段/配置域和历史污染边界 |
| `ConsoleClientBindingConfig` | 决定本轮 P0 可写入外部配置文档的 schema 上限 |
| `ConsoleRuntimeDependencies` | 区分“配置选择”与“宿主注入实例”，避免把依赖对象塞进 JSON |
| `CON-Q-034～047` | 判断 P1/P2 和未确认前安全姿态 |

## 2. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| P0 必须定义什么？ | `runtime.profile`、`bindings.adapterBindings[]`、`invalidation.enabled`、`diagnostics.enabled`；并定义 strict JSON、default、source、profile compatibility、startup validation、失效与 rollback。 |
| P1/P2 是什么？ | P1 是 authority 到达后的 production binding/consumer/sink/configured medium 候选；P2 是 hot reload、remote config/admin override、跨会话 state、产品阈值等设计变更。 |
| 哪些留部署运维？ | 配置 artifact 如何托管/挂载/注入、环境变量 selector、CSP/CDN/host 发布、secret provider 操作、监控告警路由和回滚命令。 |
| 哪些留实施计划？ | schema/parser/validator/build wiring 的任务与提交边界、工具选择、目标仓路径、测试落位和 rollout 顺序。 |
| 非范围残余风险？ | P0 可设计但当前不能声称 production adapter、consumer、configured storage 或 diagnostic sink 可用；必须通过 profile/校验 fail closed。 |

## 3. 当前诊断、对比与取舍

| 议题 | 候选/问题 | 收口 | 理由 |
|---|---|---|---|
| 是否无配置 | 浏览器依赖可全由 host 注入 | 否；03 已定义 `ConsoleClientBindingConfig` 四字段 | 必须定义输入语义与失败规则 |
| binding 配置粒度 | 每个 owner/endpoint/SDK method 单独配置 | 只配置既有 `ConsoleAdapterBindingRef` slot/profile/local ref | exact schema 未闭口，不能发明 endpoint |
| state 配置 | medium/TTL/encryption/capacity | 不进 P0 | 会超出 03 和 `CON-Q-044` authority |
| route/a11y 配置 | route map、message、browser flags | 不进 P0 | host/framework matrix未闭口且没有 runtime field |
| diagnostics | endpoint/sampling/batching | P0 仅 boolean；默认 false | envelope/sink/vocabulary pending |
| invalidation | event topic/order/dedup | P0 仅 boolean；默认 false | event contract pending |
| P0 production | production-pending 可配置 | 允许 profile value，但它明确是 pending posture，不能配出 production ready | 承接既有 union 名称 |

## 4. 结构化中间产物

### 4.1 目标表

| 目标 | 说明 | 交付给下游 |
|---|---|---|
| CFG-CON-01 | 将 03 typed config 映射为唯一严格 JSON schema | 05 的 schema/negative tests；07 的实现输入 |
| CFG-CON-02 | 固定配置不授予权限、不证明合同/健康/readiness | 05/06 的 forbidden-config veto |
| CFG-CON-03 | 固定四域 source/default/profile/cross-field/失败规则 | 05 环境矩阵；06 配置门禁 |
| CFG-CON-04 | 保证浏览器配置零 raw secret/credential/owner body | 安全测试与运维注入边界 |
| CFG-CON-05 | 定义 startup-only 加载、whole-document validation/activation/rollback | 实施 parser/builder 和运维 rollback 输入 |
| CFG-CON-06 | 保真传递 open/pending 与设计变更触发器 | 07 暂停条件；未来 04 reopen 条件 |

### 4.2 本轮范围

| 范围 | 优先级 | 本轮展开深度 |
|---|---|---|
| runtime profile | P0 | 三个既有值、默认、环境映射、兼容校验、startup 生效 |
| adapter binding refs | P0 | 既有 slot union、profile、opaque local ref、唯一性/coverage/forbidden value 校验 |
| SDK invalidation switch | P0 | 默认 false、profile约束、合同与 binding 前置、当前正式 profile上限 |
| diagnostic switch | P0 | 默认 false、local fake条件、生产合同前置、失败隔离 |
| strict JSON document | P0 | 模块级/完整 demo、unknown/duplicate/alias/key policy、whole-document validation |
| host-provided config source role | P0 | 定义一个外部 JSON document 可覆盖 defaults；实际 delivery mechanism 留 07/09 |
| production positive bindings | P1/blocked | 只定义进入条件和 pending posture，不写具体 binding ref/endpoint |
| configured state medium | P1/design-change-required | 只列触发条件；当前不形成配置项 |
| remote/hot/admin/跨会话与量化 | P2/design-change-required | 仅演进与风险，不形成当前 schema |

### 4.3 P0/P1/P2 口径

| 等级 | 判定 | 当前内容 | 正式口径 |
|---|---|---|---|
| P0 | 已由 03 字段支持，且无需新增代码契约即可定义 | 四域 + JSON/source/validation/failure | 当前正式合同 |
| P1 | 有业务方向但缺 formal contract、产品/host authority 或 03 字段 | positive owner binding、invalidation、production diagnostics、configured medium | pending/blocked，不写为可用 |
| P2 | 会改变 runtime lifecycle/远程治理/状态范围/量化权威 | hot reload、config center、admin override、cross-session/device、threshold | future design-change trigger |

### 4.4 非范围

| 非范围 | 去向 |
|---|---|
| owner/SDK Query/Command/Result/Ref schema、endpoint 和 transport | 各 owner / L0-sdk 正式合同；到达后回写 03/04 |
| framework/router/bundler/package manager、component library | 架构裁决与 07 实施计划 |
| host route map、DOM、URL、CSP、asset base | host/部署运维；如改变 runtime field 先回写 03 |
| state medium、serialization、TTL、quota、encryption、migration、cross-tab/session/device | `CON-Q-044`；未来 03/04 设计变更 |
| diagnostic envelope/version/endpoint/sampling/batching/retention | `CON-Q-046` / observability owner；未来 03/04 |
| raw secret、token、cookie、credential | 禁止进入 browser config；宿主正式认证边界，不归 04 配置项 |
| 完整测试 case/evidence/verdict/signoff | 05/06；当前只交测试切口和门禁输入 |
| phase/task/commit、部署命令、runbook | 07/09 |
| 性能、兼容、SLO 数字 | authority 到达后的 05/06/09；不得由 04发明 |

### 4.5 无配置路径判定

| 判定问题 | 结果 |
|---|---|
| 是否存在 `ConsoleClientBindingConfig`？ | 是 |
| 是否存在 profile-dependent runtime assembly？ | 是 |
| 是否存在 optional invalidation/diagnostics switches？ | 是 |
| 是否必须定义无效配置的启动姿态？ | 是 |
| 结论 | 非无配置项目；Step 3～13 全部适用 |

### 4.6 非范围残余风险

| 风险 | 影响 | 当前处理 |
|---|---|---|
| host delivery 未定 | 配置如何被浏览器入口取得 | 04 只定义 source role；具体注入留 07/09，不从 URL/DOM猜值 |
| production contracts未定 | binding/flag 正向启用 | profile保持 pending；cross-field validation 拒绝虚假启用 |
| config schema只含四字段 | 未来可能需要扩展 | 新字段必须重开 03/04，不允许实现侧临时 key |
| 旧 05/06 环境口径冲突 | 下游可能沿用旧 store/panel/阈值 | Step 12 显式要求 full-restart，旧文档不作为 truth |

## 5. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 当前 P0 只映射 03 既有四字段 | 否 | 配置语义细化 | 不适用 | 无回写 |
| 外部 strict JSON 仅是 `ConsoleClientBindingConfig` 的序列化输入 | 否 | 文件格式/来源 | 不适用 | 无回写 |
| runtime dependencies 本身不写入 JSON | 否 | 既有注入边界 | 不适用 | 无回写 |
| future route/storage/endpoint/secret/hot reload 配置 | 是 | 新字段/constructor/flow/lifecycle | 03 Step 4/7/11/14/15 | 当前排除；未来先回写 |

## 6. 回填草稿

正式 §2 应写明：本轮 P0 为 runtime/bindings/invalidation/diagnostics 四域及其完整控制面；P1/P2 只记录进入条件。非范围必须指向 owner/SDK、03、05/06、07 或 09。`production-pending` 是配置姿态名，不等 production readiness。

## 7. 待确认事项与门禁

| 事项 | 阻塞范围 | 未确认处理 |
|---|---|---|
| production slots 和 flags | production integration | pending/false；不能通过 JSON 升级 |
| configured medium | durability/cross-session | P0 无 key；session-volatile only |
| framework/host details | concrete UI/route/config delivery | 04 保持 host-neutral；07/09 承接 |

| 进入 Step 3 条件 | 结论 |
|---|---|
| 目标、范围、非范围可判定 | pass |
| P0/P1/P2 分层无越界 | pass |
| 无配置路径已判定 | pass（不适用） |
| 无当前 03 待回写 | pass |

Step 2 `done / pass / self_reviewed`；允许串行进入 Step 3。正式 04 仍不可写。
