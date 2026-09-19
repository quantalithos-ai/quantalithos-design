# Step 13 · 非功能需求

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 13 · 非功能需求 |
| 输出文件 | `design-calibration/00_req_step_13_non_functional_requirements.md` |
| 当前模式 | `full-restart + single-agent-serial` |
| 已读取规范 | yes，需求 SOP Step 13、书写规范 §4.13 与通用规范 |
| 已读取前序输入 | yes，Step 7 闭环、Step 10 规则、Step 11 数据、Step 12 接口/依赖 |
| 模块骨架 | done：六类默认 NFR / 可访问性专项 / 节点映射 / 量化 authority 审计 / 停审 |
| 进入条件 | `pass`，Step 12 已完成 |

## 2. Step 内计划

| 计划项 | 状态 | 产物 / 门禁 |
|---|---|---|
| 按性能、可用性、安全、审计/追溯、幂等/一致性、可观测性逐项判断 | done | 见 §7.1 |
| 将可访问性作为本产品关键专项展开 | done | 见 §7.1 |
| 每项提供可判断口径并映射能力节点 | done | 见 §7.1~§7.2 |
| 区分能力级约束与全仓质量约束 | done | 见 §7.1~§7.2 |
| 审计旧 P95/首屏/SLA/固定数量与阈值 authority | done | 见 §7.3 |
| 核对所有功能/规则/数据/接口的质量风险 | done | 见 §7.4 |
| 形成回填草稿、自检和三层门禁 | done | 见 §9、§11~§12 |

## 3. 本步输入

| 输入 | 本步使用方式 |
|---|---|
| Step 7 | C1~C6 提供能力级 NFR 映射，跨全部节点的要求标为全仓质量约束。 |
| Step 10 | 将 fail-closed、最小披露、query no-write、结果分层、局部降级与 a11y 硬规则转为质量判断口径。 |
| Step 11 | 安全要求必须覆盖 client truth/snapshot/ref/forbidden body 与诊断旁路。 |
| Step 12 | SDK/owner 依赖失效、异步提示和 unknown result 构成可用性、一致性与可观测性边界。 |
| historical material | 旧 P95、首屏、SLA、固定控制项/指标只用于污染审计，不作为目标来源。 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些要求能回指能力节点？ | 语境安全对应 C1，资格最小披露对应 C2，查询响应/来源保真对应 C3，命令一致性与结果追溯对应 C4，局部可用与 owner 隔离对应 C5，降级/恢复/a11y 对应 C6。 |
| 哪些覆盖全仓？ | 禁止 forbidden body、SDK-only 访问、客户端状态不成为业务 truth、诊断失败不改变业务、全路径可访问和所有确定性声明可追溯覆盖全仓。 |
| 性能要求是什么？ | 客户端本地交互不得无必要等待无关 owner；每个管理区域的加载/探索应有界且局部完成，慢或不可用来源不得拖成无解释的全局阻塞。精确预算待 authority。 |
| 可用性要求是什么？ | actor/scope 不可验证时整体安全关闭；单 owner 故障只降级其依赖区域；已安全取得的其他来源和本地草稿按规则维持可解释状态。 |
| 安全要求是什么？ | 最小披露、正式资格上限、SDK/正式服务访问、forbidden body 零进入、scope/资格变化立即收紧，且客户端不得推导授权/裁决。 |
| 审计/可追溯要求是什么？ | 所有管理结果、治理/证据/审计/指标展示和受控意图都可回指正式 source/result/ref；客户端诊断与业务审计严格分离。 |
| 幂等/一致性要求是什么？ | owner truth 单一，草稿/receipt/confirmed 分离，unknown 不自动重放，snapshot 的 freshness/coverage/consistency 不被消平，跨域不伪装原子一致。 |
| 可观测性要求是什么？ | 能安全判断页面/依赖/请求处于何种客户端姿态并关联正式引用；诊断不可泄露正文，也不得因诊断系统失败改变用户业务结果。 |
| 哪些能量化？ | 当前没有经正式 authority 确认的性能、可用率或数量阈值；可用行为与零容忍边界可直接判断。数值基线需后续产品/SLO owner 确认，不能沿用旧值。 |

## 5. 当前材料与旧文档问题诊断

| 旧要求 | 问题 | 当前处理 |
|---|---|---|
| 主列表/看板首屏 `<2s` | 无场景、设备、网络、数据规模或 authority | 不继承；保留关键路径不被无关依赖阻塞的判断口径 |
| 审计过滤 P95 `<500ms`、nav/panel P95 `<200ms` | 混合 owner 延迟与客户端交互，测量边界不明 | 不继承；分别要求本地交互与 owner 请求可归因、有界、可降级 |
| Console 可用率 `≥99.9%`、owner SLA `99.9%/99.95%` | 无正式 SLO owner/baseline，且 Console 不能承诺上游 SLA | 不继承；按身份强失败、owner 局部降级验收 |
| SoA 38 控制项、8 个指标 | 固定集合无当前正式定义来源 | 不继承；以 owner 正式定义、coverage 和版本语义判断 |
| “100% 核心路径键盘可完成” | 方向正确但核心路径未按新版闭环定义 | 重写为 C1~C6 所有适用目标的辅助技术等价路径；验收以路径覆盖判定 |

## 6. 改动前后对比与设计取舍

| 主题 | 旧口径 | 当前取舍 |
|---|---|---|
| 数值目标 | 无来源数字直接作为门槛 | 有 authority 才量化；当前用可判断行为口径并登记待确认 |
| 可用性 | 单一 uptime / skeleton | 身份失败全局 fail-closed，owner 失败局部隔离，状态可解释 |
| 性能 | 页面总耗时混合所有依赖 | 区分本地交互、相关 owner 等待、无关 owner 阻塞与用户可见进展 |
| 一致性 | dashboard 看似统一 | 保留每个 owner 的 source/freshness/coverage/consistency 与非原子上限 |
| 可观测性 | 日志/指标越多越好 | 只采安全、可关联的客户端诊断，不能成为业务审计/evidence |
| 可访问性 | 独立检查项 | C1~C6 happy/non-happy path 的等价业务能力 |

## 7. 结构化中间产物

### 7.1 非功能需求表

| ID | 非功能类别 | 要求 | 判断口径 / 目标值 | 能力 / 全仓映射 |
|---|---|---|---|---|
| `NFR-CON-001` | 性能 | 本地导航、筛选、草稿编辑、焦点与状态切换不得无必要等待无关 owner 响应。 | 在相关 owner 尚未返回或某一无关 owner 不可用时，可独立完成的本地交互仍有即时、可理解反馈；精确交互预算 `pending authority`。 | C2/C3/C4/C6 |
| `NFR-CON-002` | 性能 | 每个管理区域的查询、分页、下钻和状态回查必须有界，慢来源不得形成无说明的全页面等待。 | 能逐 owner 判断 loading/partial/available/unavailable，用户可继续使用不依赖慢来源的能力；负载规模与延迟目标 `pending authority`。 | C3/C5/C6 |
| `NFR-CON-003` | 性能 | Console 不得通过无界跨域 fan-out、重复自动查询或未知命令重放放大 owner 负载。 | 任一用户意图可明确归因到所需 owner 能力；unknown 不自动重放，局部刷新不要求无关 owner 同步完成。 | C3/C4/C5；全仓 |
| `NFR-CON-004` | 可用性 | 正式 actor/scope 不可验证、过期或撤销时，受保护内容和动作必须 fail-closed。 | 所有受保护路径在语境不可判别时均停止披露/提交，仅显示安全恢复方向；不得使用旧缓存放行。 | C1；全仓安全前置 |
| `NFR-CON-005` | 可用性 | 单一业务 owner 故障、过期或部分结果不得无依据使其他 owner 区域失败，也不得被其他区域成功掩盖。 | 故障影响可按来源隔离；不依赖该 owner 的壳、导航、本地草稿和其他已授权区域保持可用且标明各自状态。 | C3/C5/C6 |
| `NFR-CON-006` | 可用性 | 未开放或未激活的 query/command/export/report 能力必须稳定呈现 read-only/partial/blocked，而非假接口或假成功。 | 每个 C5 主题的当前能力上限可判别；缺合同不触发私有直连、静默 fallback 或伪数据。 | C4/C5/C6 |
| `NFR-CON-007` | 安全 | 所有业务读取和意图提交必须经 SDK 或正式服务边界，且客户端可见性只能比 owner 决定更保守。 | 不存在 DB/repository/内部总线/服务源码旁路、本地 RBAC 放宽或 Policy/Gate 绕过；unknown/restricted 最小披露。 | C1~C5；全仓 |
| `NFR-CON-008` | 安全 | credential、授权/治理证明、隐藏字段及所有 forbidden body 不得进入 Console 自有数据、诊断、错误、日志或导出旁路。 | Step 11 §7.8 列出的正文在 Console 持有面为零；仅 owner-safe snapshot/ref 可进入，无法证明安全时拒绝/裁剪。 | C1~C6；全仓 |
| `NFR-CON-009` | 安全 | scope、visibility、资格或对象可见性变化必须在后续显示/动作前重新约束，且受限解释不得泄露对象存在性。 | 撤销/过期/冲突/unknown 后旧允许姿态不可继续；直接入口、回退导航和已开页面遵循同一最小披露上限。 | C1/C2/C4/C6 |
| `NFR-CON-010` | 审计 / 可追溯 | 所有业务状态、治理决定、evidence、审计/指标和运行状态声明必须可回指正式 owner/source/version 或安全引用。 | 任一确定性管理声明均可区分来源、当前性与覆盖；无正式引用时明确 unknown/missing，不由页面补造。 | C3/C5；全仓 |
| `NFR-CON-011` | 审计 / 可追溯 | 管理意图必须能区分本地草稿、提交经历、owner receipt、处理中与正式结果，并在 owner 提供时保留追溯引用。 | 任何“完成/拒绝”陈述都有正式 result/ref；HTTP、toast、缓存刷新和客户端诊断不能单独证明结果。 | C4/C6 |
| `NFR-CON-012` | 审计 / 可追溯 | 客户端诊断必须与正式 audit/evidence/业务历史在语义和呈现上分离。 | 诊断只能证明交互/请求经历并经过安全裁剪；不得被 Governance、Artifact 或 Observability 当作正式结论，除非 owner 另行正式接纳。 | C5/C6；全仓 |
| `NFR-CON-013` | 幂等 / 一致性 | 同一业务事实只采用正式 owner 的单一语义，Console snapshot、view model、缓存和联合视图不得形成第二真相。 | 页面保留 source/freshness/coverage/availability/consistency；跨 owner 结果不宣称原子、完整或统一当前。 | C3/C5；全仓 |
| `NFR-CON-014` | 幂等 / 一致性 | 未提交、submitted/accepted、pending、confirmed、rejected 与 unknown 必须保持不同，结果 unknown 时不得无正式依据自动重放。 | 每条有副作用的意图在任何时刻均有不夸大的可判别姿态；重复风险路径先正式回查，无法回查则保持 unknown。 | C4/C6 |
| `NFR-CON-015` | 幂等 / 一致性 | 本地草稿、筛选和布局只影响客户端交互，不得改变 owner 数据、资格、治理结论或业务优先级。 | 这些交互在查询、刷新、恢复和偏好变化前后均无业务副作用；提交只能经明确受控意图发生。 | C2/C3/C4；全仓 |
| `NFR-CON-016` | 可观测性 | Console 必须能安全区分并关联客户端语境、owner 依赖、查询、提交、结果回查、降级与恢复的交互姿态。 | 对每次用户可见失败可判断受影响能力/owner、客户端阶段与安全关联引用（若正式提供）；无需暴露正文即可定位责任边界。 | C1~C6；全仓 |
| `NFR-CON-017` | 可观测性 | 诊断 sink 缺失、延迟或失败不得改变业务请求结果、放宽权限、阻断安全恢复或被当作 owner 失败。 | 关闭或故障的诊断消费面不改变相同输入下的业务呈现/正式结果语义；诊断自身明确降级。 | C4/C6；全仓 |
| `NFR-CON-018` | 可观测性 | 部分、过期、受限、不可用、冲突、未知、回查中和恢复结果必须能被产品与安全诊断一致地区分。 | 用户语义与安全诊断分类不互相矛盾；无法分类时统一采用 unknown，而非归一成空/成功。 | C3~C6 |
| `NFR-CON-019` | 可访问性 | C1~C6 的语境、导航、查询、草稿/确认、管理主题、错误和恢复目标必须可通过键盘及受支持辅助技术完成。 | 每条适用核心路径均存在等价非指针操作路径，焦点顺序/返回可理解；不能完成任一关键目标即不通过。 | C1~C6；全仓 |
| `NFR-CON-020` | 可访问性 | 资格、状态、来源、错误、危险确认和结果变化不得只依赖颜色、位置、动画或瞬时提示表达。 | 每种语义均有可感知文本/名称/状态，动态变化得到适当播报且不会造成焦点丢失；具体技术映射后移。 | C2~C6；全仓 |
| `NFR-CON-021` | 可访问性 | partial/stale/unknown、validation error 和提交结果必须为辅助技术用户提供与视觉用户相同的恢复选择和安全上限。 | 非视觉路径可理解问题、定位相关输入/区域并执行同一获准恢复；不得因辅助路径失败而降级为越权或死路。 | C4/C6；全仓 |

### 7.2 能力节点与全仓质量映射

| 范围 | 重点 NFR | 停审结论 |
|---|---|---|
| `C-CON-1` | `NFR-CON-004`, `007~009`, `016`, `019` | 不可验证语境 fail-closed、可追溯且可访问；`pass` |
| `C-CON-2` | `NFR-CON-001`, `007`, `009`, `015~016`, `019~020` | 资格不由 UI 推导且最小披露；`pass` |
| `C-CON-3` | `NFR-CON-001~003`, `005`, `010`, `013`, `016`, `018~020` | 有界查询、来源保真、局部降级；`pass` |
| `C-CON-4` | `NFR-CON-003`, `006~009`, `011`, `014~017`, `019~021` | 结果分层、unknown 不重放、治理边界；`pass` |
| `C-CON-5` | `NFR-CON-002~003`, `005~008`, `010`, `012~013`, `016`, `018~020` | 多 owner 隔离、来源/能力上限清楚；`pass_with_positive_surfaces_pending` |
| `C-CON-6` | `NFR-CON-001~002`, `004~006`, `008~009`, `011~012`, `014`, `016~021` | 非理想状态、恢复与 a11y 等价闭合；`pass` |
| 全仓 | `NFR-CON-003~004`, `007~010`, `012~017`, `019~021` | truth、安全、诊断与 a11y 横切约束完整；`pass` |

### 7.3 量化 authority 与历史污染审计

| 候选量化项 | historical 值 | 当前 authority 状态 | 当前结论 |
|---|---:|---|---|
| 主页面首屏 | `<2s` | 无正式场景、基线、负载与 owner | `rejected_as_target / pending_authority` |
| 审计过滤 P95 | `<500ms` | 无正式 Observability/Console 端到端预算 | `rejected_as_target / pending_authority` |
| 导航/面板 P95 | `<200ms` | 无正式设备/浏览器/测量边界 | `rejected_as_target / pending_authority` |
| Console 关键路径可用率 | `≥99.9%` | 无正式 SLO owner 与测量窗口 | `rejected_as_target / pending_authority` |
| owner SLA | `99.9%/99.95%` | Console 无权替 owner 承诺 | `rejected` |
| SoA 控制项数量 | `38` | 当前 governance 正式定义不得由 Console 固定 | `rejected_fixed_count` |
| 核心指标数量 | `8` | 当前 Observability 正式定义不得由 Console 固定 | `rejected_fixed_count` |
| forbidden body 进入 Console | `0`（语义底线） | Step 10/11 正式需求边界 | `accepted_zero_tolerance` |
| 本地授权放宽 / unknown 自动重放 | `0`（语义底线） | Step 10 正式需求边界 | `accepted_zero_tolerance` |
| 适用核心路径可访问完成 | 全部适用路径 | Step 7/9/10 正式闭环 | `accepted_coverage_judgment`，非旧固定数值继承 |

数值 `pending_authority` 不阻塞需求文档完成，但阻塞未来将相关数字写入配置、测试阈值、验收报告或 readiness 结论。后续若获得正式目标，必须明确场景、测量起止、环境、负载、窗口、owner 和证据来源。

### 7.4 非功能覆盖审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 六类默认 NFR 是否逐项判断 | pass | 每类至少两项，并按 Console 风险调整深度。 |
| 可访问性是否覆盖完整闭环 | pass | 作为额外专项覆盖 C1~C6 happy/non-happy path。 |
| 每项是否有判断口径/目标值 | pass | 无空项；无 authority 的数值明确 pending。 |
| 能力级与全仓要求是否区分 | pass | §7.2 显式映射，无强塞单节点。 |
| 是否覆盖接口/数据旁路和 owner 局部失败 | pass | 安全、可用性、可观测性均覆盖。 |
| 是否能被 Step 14 验收承接 | pass | 所有 `NFR-CON-*` 都有可直接转为验收条件的判断语句。 |
| 是否写了工具、缓存参数、监控配置或实现方案 | pass | none。 |

## 8. 复杂度判断

21 项 NFR 覆盖六类默认质量和可访问性专项。当前最大的开放项是性能/可用率数值 authority，而不是质量语义缺失；需求可使用行为口径验收，未来不得在没有正式来源时补数字。单文件可审查，无需附录。

## 9. 回填草稿

正式 §13 回填 §7.1 的 NFR 表、§7.3 的精简量化审计和一段全仓质量说明。正式正文保留编号和能力映射列作为追溯增强；不得恢复旧 P95、首屏、SLA、38/8 数量或把工具名当判断口径。

## 10. 待确认事项

| ID | 待确认事项 | 当前处理口径 | 当前状态 |
|---|---|---|---|
| `CON-Q-027` | 客户端本地交互、页面读取、筛选/下钻与结果回查的正式性能预算 | 先以有界、可归因、无关 owner 不阻塞判断；不得采用旧值 | `open / blocks_numeric_acceptance` |
| `CON-Q-028` | Console 自身可用率/SLO 的 owner、窗口与依赖归因 | 先以 fail-closed 和 owner 局部隔离判断；不得替上游承诺 SLA | `open / blocks_numeric_slo` |
| `CON-Q-029` | 受支持浏览器、辅助技术组合与适用路径清单 | 当前要求全部适用核心目标等价完成；具体矩阵留待设计/测试 | `open / blocks_exact_compatibility_matrix` |
| `CON-Q-030` | 客户端诊断关联与安全 envelope | 仅允许最小安全分类/ref；诊断 sink 失败不影响业务 | `open / blocks_exact_observability_design` |

## 11. 自检

| 检查项 | 结果 |
|---|---|
| 是否逐项覆盖性能、可用性、安全、审计/追溯、幂等/一致性、可观测性 | pass |
| 是否将可访问性作为核心产品质量而非装饰 | pass |
| 每项是否有能力/全仓来源和可判断口径 | pass |
| 是否区分身份全局 fail-closed 与 owner 局部降级 | pass |
| 是否覆盖 forbidden body、最小披露、结果分层与诊断隔离 | pass |
| 是否未继承旧 P95、首屏、SLA、固定 38/8 数量 | pass |
| 是否未写监控平台、日志字段、缓存/重试算法、加密实现或测试步骤 | pass |
| 是否发现阻塞 Step 14 的 blocker | no；数值 authority 不阻塞行为级验收，必须作为待确认传递 |

## 12. 三层门禁

| 层级 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| Step / 模块级 | `pass` | 六类默认 NFR、可访问性专项、判断口径、能力映射和历史阈值审计完成 | 更新 flow，激活 Step 14 | 本文件；Step 7/10/11/12；书写规范 §4.13 |
| 文档级 | `pass_to_step_14` | 每项质量要求均可形成行为级验收，旧无 authority 数值已隔离 | 创建并完成 `00_req_step_14_acceptance_criteria.md` | 本文件；Step 7/9~12 |
| 项目级 | `pass_with_numeric_targets_pending` | 数值性能/SLO/兼容矩阵 pending，不阻塞需求级验收收敛 | 进入 Step 14；正式 00 仍不可写 | 项目台账；需求 flow |
