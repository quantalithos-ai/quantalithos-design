## Step 13. 设计风险与待确认事项

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 13
- 回填章节：正式 `02-概要设计.md` §13「设计风险与待确认事项」

#### 1.1 Step 内计划

- [x] 汇总 Step 4～12 暴露的概要设计层未闭环项
- [x] 对齐正式 00 `RISK-CON-*` / `CON-Q-034～047` 与正式 01 §15
- [x] 区分已识别风险和仍待 authority 的问题，不混入 backlog/实施任务
- [x] 为每项风险写影响范围和当前保守处理口径
- [x] 为每项待确认写影响的对象/接口/流/状态/配置和挂起方式
- [x] 审计未伪造 resolved/integrated/ready/signoff，完成三层门禁

### 2. 本步输入

- `design-calibration/02_hld_step_04_code_subject_framework.md` 至 `02_hld_step_12_detail_design_handoff.md`
- `projects/L5-console/00-需求文档.md` §15
- `projects/L5-console/01-架构设计.md` §15
- `design-calibration/project_execution_ledger.md`
- 指定专项上游当前正式文档和必要台账中仍开放的消费边界
- `standards/document/概要设计书写规范.md` §4.13

### 3. SOP 问题回答

1. **哪些问题已构成概要设计风险？**

   Owner exact contract 未闭口、scope/visibility/safe-field 不一致、unknown 缺 reconciliation、owner 多轴状态易被合并、专项 surface 成熟度不一、状态 carrier 生命周期不明、SDK invalidation/diagnostic/a11y/量化 authority 未定、旧 Provider/固定数字/绿色语义污染和撤销传播延迟，都会影响接口、流程、状态或后续落码。

2. **哪些只能作为待确认事项？**

   `CON-Q-034～047` 仍需 owner/SDK/测量 authority 或相邻项目正式停审：exact surface、scope hierarchy、visibility/qualification/reason、safe-field/status axes、reconciliation/idempotency、Workspace/Method/Capability/Observability/Archive/Sandbox 接缝、客户端 state lifecycle、性能/兼容/a11y/diagnostic、外围 link/ref。

3. **这些项影响什么？**

   影响 Step 6 对象字段、Step 7 exact API、Step 8 adapter/flow 分支、Step 9 terminal/activation/invalidations、Step 10错误/恢复、Step 11 配置和 Step 12 的 03 可展开深度；但不改变 Console 不拥有 owner truth、SDK-only、fail-closed、unknown 不重放等已收稳根边界。

4. **哪些若不收纳会误导 03？**

   所有 exact contract、positive activation、scope/visibility、safe-field、reconciliation、lifecycle、diagnostic/a11y 和量化事项若不显式挂起，03 容易伪造 DTO、endpoint、enum、TTL、阈值、支持矩阵或 ready 状态，因此必须保留。

5. **哪些只是任务或优化项，不应包装成风险？**

   页面美化、组件重构、排期、人力、代码风格、未来 dashboard 增强、性能“优化”、测试执行和发布计划不是本步设计风险；它们归详细设计、测试、验收或实施计划，且当前未授权启动。

### 4. 当前文档问题诊断

| 材料/位置 | 当前问题 | 修正 |
|---|---|---|
| 旧 02 风险 | 技术栈、固定 SLA、资源/时间等项目管理项与设计风险混写 | 只保留影响概要主语/边界的设计风险 |
| 旧接口/Provider | 历史接口可能被误当已验证合同 | 全部回到 exact surface 待确认，正向面 pending |
| 旧指标/控制 | 固定数量和阈值可能被当成正式 authority | 作为历史污染风险，正式 owner/测量 authority 前不进入设计 |
| Step 4～12 pending | 分散在各文件，若不聚合易遗漏 | 建立风险表与待确认表并追踪影响位置 |
| 上游台账 | 有些上游文档已停审但消费合同仍未闭口 | 只承接 owner truth 边界，不把停审等同于 Console surface active |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 风险范围 | 项目/技术/资源混杂 | 只含影响概要设计成立性的设计风险 | 对齐 SOP |
| 待确认 | “TBD”或未来优化 | 明确所需 authority、影响范围和当前挂起口径 | 防止下游脑补 |
| 成熟度 | 页面存在/上游停审≈可集成 | surface/activation/safe-field/result 均需正式合同 | 防止伪 ready |
| 量化 | 继承旧 SLA/指标数 | 无 authority 不写数字，保留行为上限 | 事实诚实 |
| 状态 | pending 可能被润色关闭 | pending/blocked/read-only/partial 原样传递 | 保持可审计性 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：只保留几条“大风险” | 文档短 | 下游无法定位具体对象/接口/状态受影响 | 不采用 |
| 方案 B：把所有 TODO 都列风险 | 全面 | 混入任务、优化和实施项，失去设计焦点 | 不采用 |
| 方案 C：风险与待确认分表，并绑定当前安全口径和影响面 | 可追溯、可阻断脑补 | 项目较多但可逐项关闭 | 采用 |

### 7. 结构化中间产物

#### 7.1 设计风险表

| ID / 风险 | 影响 | 当前处理口径 |
|---|---|---|
| `HLD-RISK-CON-001` Owner exact Query/Command/Result/Ref 与 activation 未完全闭口 | Step 7 API、Step 8 adapter/flow、Step 9 result/activation、03 协议 | 只写能力级 seam；按 owner/主题保持 `pending/blocked/read_only/partial`，不继承旧 API/Provider/mock |
| `HLD-RISK-CON-002` tenant/organization/project scope owner、层级、切换和撤销不明 | `AccessContext`、context switch、direct link、所有受保护 Query/Command | scope 只作外部正式 ref；无法验证/冲突即 fail-closed，不本地建模层级 |
| `HLD-RISK-CON-003` visibility、qualification、reason、redaction 粒度不一致 | navigation/topic/action entry、提交前 guard、最小披露 | 客户端只能收紧；unknown/撤销/冲突阻断；reason 按更小安全上限 |
| `HLD-RISK-CON-004` safe-field 与 freshness/coverage/availability/consistency 表达不统一 | snapshot/view/status、cache、错误、diagnostic、export | per-owner mapper；保留多轴；exact 未闭口时只允许最小 summary/ref |
| `HLD-RISK-CON-005` unknown command 缺 reconciliation/幂等依据 | request/result 状态、RecoveryPlan、重复副作用 | unknown 不自动重放、不声明成功；无正式回查时 blocked/explicit exit/keep-draft |
| `HLD-RISK-CON-006` 多 owner 时效、覆盖、一致性和可用性不同 | TopicViewModel、联合页面、比较/摘要、局部恢复 | 分 owner 呈现状态轴和失败；不合成 health/compliance/audit/readiness |
| `HLD-RISK-CON-007` Workspace、Method、Capability、Observability、Archive、Sandbox surface 成熟度不同 | 八类主题 adapter、正向入口、safe link、result/ref | 条件化消费；逐 owner 只读/partial/blocked；不阻塞壳/公共安全主线 |
| `HLD-RISK-CON-008` 草稿、偏好、request/view cache 生命周期与介质未定 | state carrier、隐私、跨会话/设备、多标签页 | 只确认交互 truth；不承诺跨设备/离线连续性；语境变化/撤销优先清理/收紧 |
| `HLD-RISK-CON-009` SDK invalidation 提示/envelope/重复乱序语义未定 | snapshot validity、context revocation、optional consumer | explicit Query/revalidation 是核心 fallback；consumer 保持 pending，不接私有 bus/cursor/replay |
| `HLD-RISK-CON-010` 客户端 diagnostic envelope、sink、关联与保留未定 | `DiagnosticContext`、错误定位、forbidden-body、Observability 接缝 | 只允许最小安全标记/ref；sink 失败不改业务；不冒充 audit/evidence/report |
| `HLD-RISK-CON-011` a11y/browser 支持矩阵、核心路径和播报/focus 约束未闭口 | `AccessibilityState`、恢复流、测试/验收 | 先固化语义等价和键盘/辅助技术目标；不声明具体组合已支持或已验证 |
| `HLD-RISK-CON-012` 性能、可用率、负载、timeout/retry/page/concurrency 无 authority | 配置、adapter、fan-out、测试/验收 | 只用有界、可归因、局部隔离行为口径；不继承旧 SLA/P95/固定数字 |
| `HLD-RISK-CON-013` 未停审 L5/L6 可能改变 deep-link/ref 与外围导航 | SafeLinkPort、外围入口和未来跨产品恢复 | 只保留 pending link/ref 候选；不消费私有状态或成为主链前置 |
| `HLD-RISK-CON-014` 旧 Provider Contract、固定控制/指标数量、技术框架和绿色语义回流 | 全文接口、配置、view、readiness 与历史污染 | 持续 historical_material 审计；无当前 authority 一律不进入正式结论 |
| `HLD-RISK-CON-015` 资格、状态、result/ref 撤销传播延迟 | context/view/action/result/link 失效和敏感披露 | 过期/撤销/冲突时优先收紧；提交前重验；旧 cache/ref 不放宽敏感路径 |
| `HLD-RISK-CON-016` 详细设计绕过回退规则重新发明主语 | Step 5～12 全部结构、追溯和 owner boundary | Step 12 建立回退矩阵；任何组成部分/对象/接口/流/状态/配置改变先回退 02 |

#### 7.2 待确认事项表

| ID | 待确认 | 影响范围 | 所需 authority / 关闭条件 | 当前挂起口径 |
|---|---|---|---|---|
| `CON-Q-034` | 各 owner 面向 Console 的 exact Query/Command/Result/Ref 与 activation 清单 | Step 7/8/9、03 adapter/protocol | owner + `L0-sdk` 正式合同，含 safe-field、错误、result/ref 和激活条件 | 能力级 seam；逐主题 pending/blocked/read-only/partial |
| `CON-Q-035` | tenant/organization/project scope 的正式 owner、层级、切换和跨页绑定 | AccessContext/navigation/all protected flows | identity/scope authority 的正式语义与撤销传播 | 外部 ref；不可验证即 fail-closed |
| `CON-Q-036` | visibility、动作资格、reason 披露和撤销 | TopicVisibility/guards/action entries | 正式 visibility/Policy/Gate surface 和最小披露规则 | 客户端只收紧、unknown、不得泄露存在性 |
| `CON-Q-037` | owner safe-field/redaction 和五个来源状态轴合同 | snapshot/view/cache/error/diagnostic/export | 各 owner + SDK 规范化安全结果 | 最小 summary/ref，多轴保真，不发明共同 schema |
| `CON-Q-038` | unknown result 的 reconciliation、幂等和重复风险 | submit/reconcile/recovery/state/tests | owner 正式回查与幂等 contract、terminal 语义 | unknown/blocked，不自动 replay |
| `CON-Q-039` | Workspace safe read/export 与来源范围 | Project/Workspace topic、safe link/export | `L1-workspace` 正式消费合同与 safe-field/export 边界 | 条件化非唯一来源；不迁 projection/cursor/rebuild |
| `CON-Q-040` | Method Library browse/edit/submit/publish 合同 | Method topic、DraftIntent、owner command | `L3-method-library` 正式 query/command/result/ref 和资格 | browse/read-only + 本地草稿；正向提交 blocked/pending |
| `CON-Q-041` | Capability Hub access-review/暴露状态和管理入口 | Capability topic/activation/result | `L3-capability-hub` 正式 safe-field/qualification/result/ref | 只读 owner 状态/ref，不创建 registration/readiness |
| `CON-Q-042` | Observability audit/metric/validation/report 与 client diagnostic seam | Observability topic、diagnostic sink、refs | `L4-observability` 正式 query/ref 与安全 diagnostic 接收合同 | 只读 owner 结果 + 最小诊断；不生成 audit/evidence/report |
| `CON-Q-043` | Archive/Sandbox activation、command、长时状态和结果 | Archive/Sandbox topics、submit/reconcile/recovery | `L4-archive`/`L4-sandbox` 正式 surface、receipt/result/ref、状态轴 | 分 owner read-only/blocked/partial；Console 不执行或推导 readiness |
| `CON-Q-044` | 草稿、偏好、筛选、request/view cache 的介质、保留、清理和跨设备/会话 | state carrier/config/concurrency/privacy | 03/04 正式 lifecycle、storage、cleanup、migration/冲突设计 | 只声明 Console interaction truth；不承诺跨设备/离线 |
| `CON-Q-045` | 本地交互、owner query/command/reconcile、fan-out 的性能/可用率/负载 authority | technical budgets、NFR、05/06 | 明确场景、环境、窗口、责任、测量和证据来源 | 不写数字；有界/可归因/局部隔离 |
| `CON-Q-046` | 浏览器、辅助技术、核心路径和 diagnostic envelope | a11y adapter、测试/验收、diagnostic | 正式支持矩阵、路径、语义、隐私和保留 authority | 语义等价先成立；不声称组合已验证 |
| `CON-Q-047` | 未停审 L5/L6 的正式 navigation/deep-link/diagnostic/ref 合同 | SafeLinkPort、外围入口 | 相邻项目正式停审 + 双方正式合同 | 不进主链、不消费私有状态 |

#### 7.3 风险到概要结构的影响矩阵

| 结构 | 主要风险/待确认 | 当前是否阻塞 02 骨架 | 阻塞什么 |
|---|---|---|---|
| 主要组成部分/分层 | RISK-014/016 | 否 | 污染性重命名或新增服务端主体 |
| 关键对象 | Q-035～038/044 | 否（类型骨架成立） | 精确字段、生命周期、状态载体 |
| API / ports | RISK-001～005/007；Q-034～043 | 否（能力级骨架成立） | exact schema/path/error/positive activation |
| 处理流 | RISK-005/007/009/015 | 否（安全主流成立） | owner-specific 分支、reconciliation/event 细节 |
| 状态机 | RISK-003～006/009 | 否（客户端状态成立） | owner terminal/activation/invalidation 映射 |
| 异常/恢复 | RISK-005/009～011/015 | 否（保守 fallback 成立） | error taxonomy、retry/idempotency、diagnostic/a11y 细节 |
| 配置 | RISK-008/010～012 | 否（影响轮廓成立） | 字段、默认值、budget、支持矩阵 |
| 03/04/05/06 正向精确设计 | 全部相关项 | 是（按项） | 未获 authority 的协议、量化、兼容、测试/验收和 active/ready 结论 |

#### 7.4 上游 blocker 结论

当前发现并持续保留上游 blocker，但它们不阻塞 `02` 的安全骨架停审：

- exact owner/SDK contract、scope/visibility、安全字段、多轴状态、reconciliation/幂等；
- Workspace、Method、Capability、Observability、Archive、Sandbox 专项接缝与 activation；
- 客户端 lifecycle/介质、SDK invalidation、diagnostic envelope、a11y/browser matrix；
- 性能/可用率/负载/兼容量化 authority；
- 未停审 L5/L6 link/ref 合同。

它们会阻塞相应 03 精确接口/adapter/state/config、05 测试矩阵、06 量化验收或正向能力激活。任何后续文档不得因 `02` 停审而把这些事项视为 resolved。

### 8. 回填草稿

正式 §13 回填 §7.1 设计风险表、§7.2 待确认事项表和 §7.4 blocker 结论；风险 ID 使用 `HLD-RISK-CON-*`，待确认沿用上游 `CON-Q-034～047` 以维持追溯。正式正文不加入 backlog、负责人、截止时间、实施任务或“后续优化”空话。

### 9. 待确认事项

本 Step 的 §7.2 即当前完整待确认清单。除非获得正式 owner/SDK/测量 authority、相邻项目停审结论或用户对后续文档的明确授权，本轮不改变任何 open 状态，不创建 resolution、evidence、verdict、signoff 或 readiness 记录。

### 10. 进入下一步条件与三层门禁

- 已将概要设计风险与待确认事项分表表达，并为每项给出影响和当前安全口径。
- `CON-Q-034～047` 与正式 00/01 保持追溯，无丢失、重编号或虚假关闭。
- 风险只包含影响概要结构的事项，不混入 backlog、排期、优化、测试执行或实施计划。
- 已明确哪些事项不阻塞 02 安全骨架、但阻塞 03/05/06 精确设计或正向 activation。

| 门禁 | 结论 | 证据 |
|---|---|---|
| Step / 模块级 | `pass` | 风险表、待确认表、影响矩阵和上游 blocker 结论完成。 |
| 文档级 | `pass` | 风险可回指 Step 4～12，未闭口项未润色成已收稳结论。 |
| 项目级 | `pass` | 允许进入 Step 14 正式装配；仅允许重组/润色/统一术语，不再新增设计结论。 |
