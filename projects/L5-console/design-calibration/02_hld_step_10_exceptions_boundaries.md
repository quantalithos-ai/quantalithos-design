## Step 10. 异常与边界场景轮廓

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 10
- 回填章节：正式 `02-概要设计.md` §10「异常与边界场景轮廓」

#### 1.1 Step 内计划

- [x] 读取 Step 8 处理流、Step 9 状态机和正式 00 验收/否决项
- [x] 筛选会改变主线、状态迁移、跨部分协作或 owner 边界的异常
- [x] 为每个场景明确归属部分、影响对象/接口/状态和概要处理口径
- [x] 对语境失效、部分数据、unknown command 和 forbidden-body 画异常影响图
- [x] 排除错误码全集、retry 参数、补偿脚本、实现栈和运维 runbook
- [x] 完成回填草稿、待确认和三层门禁

### 2. 本步输入

- `design-calibration/02_hld_step_08_processing_flows.md`
- `design-calibration/02_hld_step_09_state_machine.md`
- `projects/L5-console/00-需求文档.md` §13～§15
- `projects/L5-console/01-架构设计.md` §5、§9～§10、§13、§15
- `standards/document/概要设计书写规范.md` §4.10

### 3. SOP 问题回答

1. **哪些异常必须在概要层点名？**

   语境不可验证/过期/撤销/冲突，visibility/资格不明，owner query partial/stale/unavailable/conflict，正式空与 missing/restricted 混淆，safe-field/forbidden-body 泄露风险，直接入口和缓存残留，command 前置变化，receipt/response 中断导致 unknown，reconciliation/幂等缺失，owner result/ref 撤销，单 owner 故障扩散，SDK invalidation 重复/乱序/缺失，诊断失败，辅助技术反馈失败，以及未闭口主题/外围 link 被误激活。

2. **哪些边界场景会改写协作关系？**

   语境失效会从所有部分回退到 AccessContext 重验；partial/conflict 会使 Topic/OwnerView 局部降级；unknown command 会从提交流切换为 reconciliation/blocked；forbidden-body 命中会中止 mapping、缓存、错误、诊断和导出路径；activation 缺失会把主题固定在 read-only/partial/blocked。

3. **哪些失败不能留到详细设计才发现？**

   会导致越权披露、第二 truth、重复副作用、伪造正式结果、跨 owner 故障扩散、forbidden-body 旁路或 a11y 死路的失败都必须在本步收稳。纯实现异常映射、组件错误边界、网络库错误、重试算法和日志格式可留给 03。

4. **概要层需要讲到什么程度？**

   每项写清“落在哪个部分、改变哪个流程/状态、当前安全上限、禁止什么”。不写完整恢复流程、错误码、backoff、timeout、补偿脚本、存储事务或 UI 文案全集。

5. **哪些内容仍属于详细设计？**

   SDK/adapter 错误映射、缓存介质与失效实现、焦点恢复算法、播报去重、diagnostic envelope、请求取消/并发控制、retry/backoff、浏览器支持和自动化测试矩阵留给 03/04/05。

### 4. 当前文档问题诊断

| 材料/位置 | 当前问题 | 修正 |
|---|---|---|
| 旧 02 外部可用性段 | 多种失败统一为“模块不可用/重试” | 按语境、来源多轴、command unknown、activation、forbidden-body 和 a11y 分开 |
| 旧 dashboard | 空列表、partial、权限裁剪、服务故障可能同样显示为空 | 明确正式空/缺失/受限/partial/unavailable/conflict/unknown 不可互换 |
| 旧 action | 网络失败后可能允许再次点击，缺少副作用 unknown 边界 | unknown 切换到正式 reconciliation；无依据阻断重放 |
| 旧日志/错误 | 未限制 raw owner body 或治理/evidence 正文 | forbidden body 在 mapping 前即拒绝进入任何旁路 |
| 历史技术假设 | 固定 SLA/timeout、Provider Contract、框架错误边界无当前 authority | 只写行为级异常和安全上限，参数后移 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 故障模型 | 全局 success/loading/error | context + owner/topic + request + recovery 多主语 | 支持局部隔离与准确恢复 |
| 空值语义 | empty 兜底 | empty/missing/restricted/partial/unavailable/conflict/unknown 分离 | 防止误判事实或合规 |
| command 恢复 | retry/refresh | reconcile 或 blocked，须有正式依据 | 防止重复副作用 |
| 敏感数据 | 错误/日志事后脱敏 | forbidden body 零进入正常和失败生命周期 | 防止旁路泄露 |
| 可访问性 | 视觉错误页可用即完成 | 焦点/播报/键盘恢复与视觉同一安全上限 | 防止非视觉死路 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：列完整错误码表 | 看似精确 | 上游 contract 未闭口且越入协议/详细设计 | 不采用 |
| 方案 B：只写通用“失败重试” | 简短 | 无法区分语境、query、command unknown 和 forbidden body | 不采用 |
| 方案 C：按会改变主线的异常分类，给出状态影响和安全上限 | 足以约束落码且不伪造协议 | 具体错误映射仍需 03 | 采用 |

### 7. 结构化中间产物

#### 7.1 异常与边界场景表

| 场景 | 应落在哪个部分处理 | 影响对象 / 接口 / 状态 | 当前概要口径 |
|---|---|---|---|
| actor/scope 无法验证 | 访问语境与导航 | `ResolveAccessContext`；`ContextLifecycleState=unknown/restricted` | 整体 fail-closed，只显示最小壳和重验入口；不从 URL/local role 推导 |
| 语境过期或撤销 | 访问语境与导航 + 所有受保护部分 | context→expired/revoked；导航/快照/动作失效 | 立即收紧、清理敏感选择和旧 ref，显式重验后才恢复 |
| 多正式语境材料冲突 | 访问语境与导航 | context→conflict | 不由 Console 择优或合并；停止受保护披露/提交 |
| direct/deep-link 指向受限对象 | 访问语境与导航 | `GetNavigationVisibility`、`GetSafeLink` | 与普通导航同一 guard；不泄露对象存在性，安全回退 |
| visibility/qualification/reason 不可判定 | 导航 + 主题 + 受控意图 | `TopicVisibility=unknown/disabled`；提交 blocked | 客户端只能收紧；reason 仅按正式允许粒度显示 |
| owner 正式空结果 | 来源保真视图 | coverage complete + safe empty result | 显示“正式为空”并保留来源/时间依据；不能当 missing 或服务失败 |
| owner missing/not-covered/restricted | 来源保真视图 | coverage/visibility 分轴状态 | 分别呈现未覆盖、缺失或裁剪；不推导对象不存在 |
| owner partial/stale/unavailable | 来源保真视图 + 主题组织 | `SourceStatusAxes`、局部 `DegradationState` | 保留已有安全信息和缺口说明，局部禁用依赖动作，不扩散全局 |
| owner consistency conflict | 来源保真视图 + 受控意图 | consistency=conflict；危险动作 blocked | 不由客户端合并/择优，不生成健康/合规/readiness，提供正式回链 |
| safe-field/redaction contract 不清 | view mapping / all output seams | snapshot/view/error/diagnostic/export | 使用更小安全上限；raw/hidden body 不进入任何状态载体 |
| forbidden body 出现在 owner response/error | 来源映射 + 韧性诊断 | mapping 中止；安全错误/diagnostic marker | 丢弃敏感正文，保持可归因最小错误；不得缓存、日志、播报或导出 |
| 草稿含禁止字段或绑定旧语境 | 受控意图与结果 | `DraftIntent=invalid` 或安全清理 | 阻止复核/提交；可保留的安全字段需重新绑定当前语境 |
| 提交前语境/资格变化 | 受控意图与结果 + 语境 | eligibility blocked；context revalidation | 不沿用按钮可见或旧 reviewable 状态；用户明确处理后再提交 |
| transport/response 中断 | 受控意图与结果 | `RequestPhase=unknown` | 不显示成功、不自动重放；转入 reconciliation 或 blocked |
| receipt 只有 accepted/pending | 受控意图与结果 | request accepted/pending | 保持处理中呈现；只有正式 result 才 confirmed/rejected |
| reconciliation surface 缺失/失败 | 受控意图与结果 + 恢复 | unknown/blocked；`RecoveryPlan` 禁用 retry | 提供退出、保留安全草稿或正式支持方向；不以 refresh 猜测 |
| 正式 result/ref 过期、撤销或 owner 不匹配 | 受控意图与结果 | result invalidated/conflict | 撤除结果链接/敏感呈现，重新查询；不移植到另一 scope/owner |
| topic exact contract/activation 缺失 | 管理主题组织 | `TopicActivationState=pending/blocked/read_only/partial` | 允许诚实只读/说明页，禁止用 mock、flag 或计划启用正向动作 |
| 一个 owner 故障而其他成功 | 管理主题组织 | 单 owner degradation；TopicView partial | 只降级相关区域；成功不能掩盖失败，失败不能拖垮无关主题 |
| SDK invalidation hint 缺失 | 来源/恢复 | snapshot 依 query 时点更新 | 显式 requery/revalidation 是核心 fallback；不维护私有 bus |
| SDK invalidation hint 重复/乱序/范围不明 | 韧性 | 只收紧为 stale/invalidated/unknown | 未有正式 envelope 语义时不启用 consumer；不靠本地排序恢复 fresh |
| safe-link 失效或外围项目未停审 | 来源/主题导航 | link blocked/removed | 不猜 URL、不携带私有状态；留在当前安全页面 |
| 诊断 sink 失败 | 韧性/诊断 | `DiagnosticContext` emit failure | 不改变业务结果、资格或 recovery；不得补发敏感正文 |
| 焦点丢失/播报失败/仅颜色表达 | 可访问交互 | `AccessibilityState` 非等价 | 视为核心路径未闭合；提供等价文本、焦点和操作，不以视觉路径抵消 |
| 本地状态介质不可用或清理失败 | 韧性 + state carrier | draft/preference/request history 受限 | 收紧到会话内最小状态；不得用持久化失败改变 owner truth或放宽安全 |
| 多标签页/并发旧视图 | 语境 + view + intent | snapshot/context/version conflict | 提交前重验，旧视图标 stale/conflict；不假定跨标签页原子一致 |
| 无 authority 的 SLA/threshold/control count | 配置/呈现边界 | dashboard/metric view | 不显示为产品保证或合规门槛；只呈现 owner 正式定义和引用 |

#### 7.2 语境失效异常影响图

```text
正式撤销 / 过期 / 冲突 / 无法验证
                 │
                 ▼
AccessContextService
  - context -> revoked / expired / conflict / unknown
                 │
                 ├────────> NavigationState：清理敏感入口/选择
                 ├────────> OwnerViewModel：撤除或收紧旧 snapshot/ref
                 ├────────> DraftIntent：阻止提交，按安全规则保留/清理
                 ├────────> Request/Result：阻止新动作，已有正式结果不改写
                 └────────> AccessibilityState：焦点回到安全入口并播报
                                      │
                                      ▼
                           显式 ResolveAccessContext
```

关键说明：

- 语境异常改变所有受保护流的进入条件，因此需要异常影响图。
- 收紧优先于恢复；旧缓存、route 或页面状态不能继续放行。
- 图不表达认证实现、错误码、session storage 或焦点算法。

#### 7.3 部分/冲突数据异常影响图

```text
Owner A：fresh + complete + available
Owner B：stale + partial + degraded
Owner C：conflict / unavailable
                 │
                 ▼
OwnerViewCompositionService
  - 每个 owner 独立 SourceStatusAxes
  - 不补齐、不择优、不合成全局绿色
                 │
                 ▼
TopicViewModel
  - A 区域正常呈现
  - B 区域标 partial/stale，禁用依赖动作
  - C 区域 blocked/unavailable，保留安全回链或恢复入口
                 │
                 ▼
RecoveryPlan：按 owner requery；其他区域不受错误扩散
```

关键说明：

- 一项成功不覆盖另一项失败，一项失败也不应拖垮无关结果。
- partial/stale/conflict 不能通过本地插值、阈值或默认值变成 complete/coherent。
- 图不表达 fan-out 并发策略、timeout 或重试次数。

#### 7.4 Unknown command 异常影响图

```text
SubmitControlledIntent
        │ transport / response ambiguous
        ▼
RequestPresentation = unknown
        │
        ├─ 正式 ReconciliationPort 可用 ──> ReconcileRequestResult
        │                                      │
        │                                      └─> pending / confirmed / rejected / unknown
        │
        └─ 无正式 reconciliation / idempotency basis
                                               │
                                               ▼
                                     RecoveryPlan = blocked
                                     - 禁止自动 retry
                                     - 允许安全退出/保留草稿/正式支持方向
```

关键说明：

- unknown 是副作用是否发生不可判定，不是失败或成功的别名。
- retry 只有 owner 正式幂等/reconciliation 依据具备时才可能进入后续设计。
- refresh、toast、本地 request id 或随机 key 不构成依据。

#### 7.5 Forbidden-body 异常影响图

```text
Owner result / error / event hint / user draft
                 │
                 ▼
Boundary mapper + ForbiddenBodyPolicy
       ┌─────────┴─────────┐
       │ safe summary/ref   │ credential/raw/hidden/business/evidence body
       ▼                    ▼
OwnerViewSnapshot /       丢弃正文 + 最小安全错误标记
DraftIntent / Ref           │
       │                    ├─ 不缓存
       │                    ├─ 不日志/诊断正文
       │                    ├─ 不播报/导出正文
       ▼                    └─ 不改变 owner result
Safe Presentation
```

关键说明：

- forbidden-body 检查覆盖正常、失败、事件、草稿、诊断和导出旁路。
- 不能先存储后脱敏；不安全正文不得进入 Console 生命周期。
- 具体字段规则与 mapper 实现留给正式 owner contract 和 03。

#### 7.6 不画其他异常图的原因

其他场景不改变 Step 8 已定义的主要协作形态，只改变局部状态或恢复动作，使用 §7.1 场景表足以收稳。为其追加流程图会重复主流或提前进入组件、协议、重试和错误实现。

#### 7.7 异常到状态/恢复映射

| 异常类别 | 首要状态 | 允许恢复 | 明确禁止 |
|---|---|---|---|
| 语境失效 | restricted/expired/revoked/conflict/unknown | revalidate、safe exit | 沿用旧权限/快照 |
| Query 来源异常 | partial/stale/unavailable/conflict/unknown | requery、safe link（若有效） | 隐式 command、填补缺失、统一绿色 |
| Command unknown | request unknown | formal reconcile、keep draft、exit | 自动重放、toast/refresh 确认 |
| activation 缺失 | pending/read_only/partial/blocked | 等待正式合同、保持只读 | flag/mock 提升 active |
| forbidden body | safe error + content dropped | 使用最小安全 ref/重新请求正式 safe surface | 缓存、日志、诊断、播报、导出正文 |
| a11y 非等价 | accessibility blocked | 修复焦点/文本/播报/键盘路径 | 以视觉路径可用宣称闭环 |

### 8. 回填草稿

正式 §10 回填异常与边界场景表、四张异常影响图及异常到状态/恢复映射表。正式正文以会改变主线的异常为限，不回填旧文档诊断、方案比较、详细错误码、重试参数、补偿脚本、框架异常类型或运维 runbook。

### 9. 待确认事项

- owner/SDK exact error taxonomy、safe reason、redaction、安全错误 envelope 尚未闭口；当前只固定状态和最小披露上限。
- reconciliation、幂等、重复副作用和 owner terminal error 语义未闭口；unknown 保持 blocked/explicit reconcile。
- cache/state carrier、跨标签页/跨会话并发和清理实现未闭口；不得用实现便利性改变 truth/权限。
- invalidation event envelope、diagnostic sink、浏览器/a11y 支持矩阵未闭口；不声明已兼容或已验证。
- 性能/可用率/timeout/重试数字无 authority；不进入异常处理参数。

### 10. 进入下一步条件与三层门禁

- 已点名所有会改变主线、状态或跨部分协作的关键异常，并明确归属、影响和安全上限。
- 语境失效、partial/conflict、unknown command 和 forbidden body 已有规范异常影响图；其他不画图原因已说明。
- 异常与风险/待确认、错误码/重试/补偿实现保持边界，没有提前展开详细设计。
- 一票否决边界（旁路、fail-open、伪成功、forbidden body、伪 readiness、a11y 非等价、故障掩盖）均有异常承接。

| 门禁 | 结论 | 证据 |
|---|---|---|
| Step / 模块级 | `pass` | 场景表、四张影响图、状态/恢复映射、图取舍和待确认完成。 |
| 文档级 | `pass` | 每个异常可回指 Step 8 流和 Step 9 状态；没有引入新对象/接口/状态机。 |
| 项目级 | `pass` | 允许进入 Step 11 配置影响；正式 `02` 仍锁定至 Step 14，持续 blocker 原样传递。 |
