## Step 12. 详细设计承接清单

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 12
- 回填章节：正式 `02-概要设计.md` §12「详细设计承接清单」

#### 1.1 Step 内计划

- [x] 汇总 Step 4～11 已收稳的代码主体、主要组成部分、对象、接口、处理流、状态、异常和配置影响
- [x] 区分“概要设计已收稳”与“详细设计继续展开”
- [x] 为每个主要主语指定 03 继续展开方向和不得越过的边界
- [x] 建立主语变更回退规则，防止 03 重新发明或暗改 02
- [x] 将未闭口 owner contract、scope、visibility、safe-field、reconciliation、activation、量化和 a11y matrix 保持在风险/待确认，不伪装为承接结论
- [x] 完成承接清单审计、回填草稿和三层门禁

### 2. 本步输入

- `design-calibration/02_hld_step_04_code_subject_framework.md`
- `design-calibration/02_hld_step_05_components_boundary.md`
- `design-calibration/02_hld_step_06_key_objects.md`
- `design-calibration/02_hld_step_07_api_interface_skeleton.md`
- `design-calibration/02_hld_step_08_processing_flows.md`
- `design-calibration/02_hld_step_09_state_machine.md`
- `design-calibration/02_hld_step_10_exceptions_boundaries.md`
- `design-calibration/02_hld_step_11_configuration_impact.md`
- `standards/document/概要设计书写规范.md` §4.12

### 3. SOP 问题回答

1. **哪些代码主体框架已经由概要设计收稳？**

   五个业务主要组成部分及其跨实现层的主体已收稳：访问语境与导航、来源保真视图、受控意图与结果、管理主题组织、韧性与可访问交互；实现层为 Inbound/Operations、Application Services、Domain/Policy、Ports/Adapters/state carrier。不存在 Console BFF、后台 worker、业务数据库、owner projection 或内部 event bus。

2. **哪些对象、接口、处理流和状态机已成为 03 输入？**

   对象包括 `AccessContext`、`NavigationState`、`OwnerViewSnapshot`、`SourceStatusAxes`、`OwnerViewModel`、`ReferenceSet`、`DraftIntent`、`RequestPresentation`、`ResultReference`、`TopicVisibility`、`TopicViewModel`、`TopicActivationState`、`DegradationState`、`RecoveryPlan`、`AccessibilityState`、`DiagnosticContext` 及相关 guard/ref。接口为 Step 7 五部分 Query/Command/可选 invalidation consumer 和 port 边界；流为 Step 8 九组主流；状态为 Step 9 的客户端状态机和只读 owner-safe 多轴。

3. **03 需要继续展开什么？**

   继续展开模块/文件组织、trait/struct/enum、完整字段和 schema、adapter/port 契约、错误映射、redaction、cache/state carrier、并发/取消、reconciliation/幂等、焦点/播报、诊断 envelope、配置注入、事务边界（仅 Console 本地）、测试切口和可观测性实现；仍不得拥有 owner truth 或补齐未闭口合同。

4. **哪些配置影响需要交给 03？**

   runtime composition、typed config/validation、owner adapter registry、state carrier/retention、cache invalidation、safe-link、diagnostic/a11y adapter 和 technical budget 的 authority 绑定。具体项、默认值、profile、secret reference、填写/覆盖说明交给 04。

5. **发现主语需要改变时怎么办？**

   先暂停 03 当前展开，回退到对应 02 Step：组成部分/职责→Step 5；对象→Step 6；接口→Step 7；处理流→Step 8；状态→Step 9；异常→Step 10；配置影响→Step 11。更新相关 calibration、flow 和台账后，才允许 03 继续。03 不得通过新增类名、endpoint、DTO、错误码或数据库表暗改 02。

6. **哪些未闭环内容不能写入承接清单？**

   owner exact Query/Command/Result/Ref、tenant/scope hierarchy、visibility/qualification/reason/redaction、safe-field 多轴合同、reconciliation/幂等、专项 activation、客户端生命周期/介质、invalidation envelope、diagnostic envelope、浏览器/a11y 支持矩阵、性能/可用率/兼容 authority、未停审产品 link/ref 都不能写成已收稳接口或 ready surface，只能在风险/待确认中挂起。

### 4. 当前文档问题诊断

| 材料/位置 | 当前问题 | 修正 |
|---|---|---|
| 旧 02/03 | 详细设计可能从旧页面或服务名重新发明对象、API 和状态机 | 以本清单作为 03 输入白名单和回退入口 |
| 旧 draft | Workspace projection、cursor、rebuild、事件/后台任务可能被视为实现承接 | 明确排除；只承接 Console-safe view/ref 与正式 port |
| 旧配置段 | 配置默认值和技术栈被当成概要结论 | 只承接影响类别，具体配置转 03/04 |
| 上游 owner 文档 | owner domain 状态、result schema、Policy/Gate 规则可能被复制 | 仅承接消费边界、safe-field/ref/activation 待确认项 |
| 流程/状态章节 | 主语可能在 03 中改名或合并 | 要求同名承接；变更先回退 02 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 03 入口 | 旧文档/临时名词自由发散 | 02 收稳主语白名单 | 防止跨层重发明 |
| 对象边界 | owner domain、DTO、repository 混杂 | Console interaction/safe view/ref/guard 分离 | 保持 truth 单一 |
| 接口深度 | 协议/实现细节提前进入 | 03 继续补 schema/trait/error/adapter，但不改能力级分类 | 保持层次 |
| 状态承接 | 统一健康或 owner 状态复制 | 客户端状态机 + owner-safe 只读轴 | 防止第二状态真相 |
| 配置承接 | 默认值/技术栈直接写入 | 影响类别→03 契约→04 配置说明 | 保持 authority 与可审计性 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：只列章节标题 | 简短 | 03 仍可随意重建主语 | 不采用 |
| 方案 B：把完整详细设计提前复制进承接清单 | 看似可落码 | 02 越界、重复且无法区分已收稳/待确认 | 不采用 |
| 方案 C：稳定主语 + 03 展开方向 + 回退规则 | 既保护边界又支撑可落码 | 需要在 03 严格执行回退 | 采用 |

### 7. 结构化中间产物

#### 7.1 详细设计承接清单

| 已由概要设计收稳 | 详细设计继续展开 | 03 不得做什么 |
|---|---|---|
| 五个业务主要组成部分与实现分层 | 模块/trait/struct/enum 组织、依赖注入和内部边界 | 不新增第六个业务部分或 owner service |
| `AccessContext`、`NavigationState`、`ContextLifecycleState`、`DisclosureGuard` | 完整字段、生命周期、失效清理、context adapter、测试切口 | 不生成 credential、scope hierarchy、allow/deny |
| `OwnerViewSnapshot`、`SourceStatusAxes`、`OwnerViewModel`、`ReferenceSet`、`QueryNoWriteGuard` | safe-field mapper、view builder、分页/筛选、cache/invalidation、redaction | 不复制 owner aggregate、projection、cursor、rebuild |
| `DraftIntent`、`RequestPresentation`、`ResultReference`、completion/unknown guards | 草稿 carrier、validation、request/result mapper、reconciliation/幂等 adapter | 不把草稿/receipt/cache/transport success 当 owner truth |
| `TopicVisibility`、`TopicViewModel`、`TopicActivationState`、owner/link refs/guards | 八类 topic adapter、registry、route/view model、activation validation、safe-link | 不由 flag/mock/页面存在激活能力或生成 readiness |
| `DegradationState`、`RecoveryPlan`、`AccessibilityState`、`DiagnosticContext` | error mapper、recovery matrix、focus/announcement、diagnostic envelope/sink isolation | 不生成全局 health/audit/evidence/readiness，不泄露 forbidden body |
| Step 7 Query/Command/optional invalidation Consumer 分类 | 完整 input/output schema、trait/port、错误映射、取消/并发 | 不改变 Command/Query/Event/Job 类别或偷偷添加后台 Job |
| Step 8 九组关键处理流 | 函数调用链、事务内外、adapter mapping、测试切口 | 不加入 DB、BFF、worker、private bus、跨 owner 原子事务 |
| Step 9 客户端状态机、多轴只读映射和传播边界 | enum/transition guard、持久/会话载体、并发失效 | 不复制 owner 状态机或把 UI 信号升级正式状态 |
| Step 10 异常与边界场景 | 错误类型映射、恢复实现、redaction、测试矩阵 | 不用通用 retry/refresh 掩盖 unknown、权限或 forbidden-body |
| Step 11 配置影响与禁止红线 | typed config/loader/validator/runtime composition；04 填写与示例 | 不用配置绕过不变量、资格、结果或数据归属 |

#### 7.2 详细设计展开顺序建议

```text
03.1 模块与内部分层
   -> 03.2 关键对象完整契约
   -> 03.3 Query/Command/Result/Ref adapter 契约
   -> 03.4 处理流与错误/恢复映射
   -> 03.5 状态载体、失效、并发和幂等
   -> 03.6 配置注入与诊断/a11y 接缝
   -> 03.7 测试切口与证据边界
```

关键说明：

- 顺序是承接建议，不是实施计划；详细设计仍须遵守全局项目顺序和用户逐文档授权。
- 每一步若发现主语变化，先回退 02 对应 Step，再继续。
- owner exact contract 未闭口时，只能实现/描述安全 adapter boundary 和 blocked/read-only fallback，不能伪造 positive surface。

#### 7.3 回退规则

| 发现 | 必须回退到 | 回退原因 |
|---|---|---|
| 需要新增/合并业务主要组成部分 | Step 5 | 影响职责、接缝和对象发现维度 |
| 关键对象责任、归属或类型改变 | Step 6 | 影响字段/函数、接口和状态机主语 |
| API 类别、读写性质或输入/输出主语改变 | Step 7 | 影响处理流和 owner boundary |
| 处理流跨部分协作关系改变 | Step 8 | 影响 guard、事务边界和恢复姿态 |
| 状态名称、迁移、终态或传播改变 | Step 9 | 影响接口触发和异常边界 |
| 关键异常改写主线或安全上限 | Step 10 | 影响恢复、状态和一票否决 |
| 配置可影响范围或禁止红线改变 | Step 11 | 影响 03/04 配置契约 |

#### 7.4 待确认项与承接白名单审计

| 类别 | 可作为 03 输入 | 仍不得作为已收稳输入 |
|---|---|---|
| owner surface | 能力级 Query/Command/Result/Ref seam、局部 read-only/blocked fallback | exact path/schema、safe-field 全集、terminal result、activation proof |
| context/visibility | `AccessContext`、`VisibilityReference`、fail-closed guard | tenant hierarchy、Policy/Gate 内部规则、allow/deny cache |
| data/status | 多轴 `SourceStatusAxes`、safe snapshot/ref、Console interaction truth | owner domain、raw/hidden body、统一 health/readiness |
| result/recovery | request/result 分层、unknown blocked、正式 reconcile seam | 本地幂等 key、自动 replay、owner 事务/补偿 |
| config | 影响类别和禁止配置化 | 配置键、默认值、secret、热更新/部署实现 |
| a11y/diagnostic | 同语义焦点/播报、最小诊断记录 | support matrix、raw diagnostic payload、正式 audit/evidence |

### 8. 回填草稿

正式 §12 回填 §7.1 承接清单和 §7.3 回退规则，并简述 03/04/05 的继续展开方向。正式正文不回填本文件完整诊断、取舍和审计过程；承接表中的“不得做什么”保留为边界条款。

### 9. 待确认事项

- 03/04/05 尚未获用户逐文档授权；本清单只作为未来承接输入，不启动后续正式文档。
- owner exact contract、scope/visibility、safe-field、reconciliation、activation、lifecycle、diagnostic/a11y matrix、量化 authority 仍 open，不进入“已收稳”列。
- 若详细设计需要改变任何主语，必须按 §7.3 回退并更新 02 calibration/flow/ledger；不能在 03 中静默修正。

### 10. 进入下一步条件与三层门禁

- 已列出 03 详细设计必须承接的稳定主语、继续展开方向和禁止越界事项。
- 已明确主语变更回退到 Step 5～11 的具体规则。
- 未闭口 owner/量化/生命周期/诊断/a11y/外围合同均未伪装为承接结论。
- 承接清单不包含任务排期、测试用例全集、实现仓事实或部署细节。

| 门禁 | 结论 | 证据 |
|---|---|---|
| Step / 模块级 | `pass` | 承接白名单、详细设计方向、禁止事项、回退规则和待确认审计完成。 |
| 文档级 | `pass` | 清单只引用 Step 4～11 已收稳主语；未新增对象/接口/状态或配置结论。 |
| 项目级 | `pass` | 允许进入 Step 13 风险与待确认；正式 `02` 仍锁定至 Step 14。 |
