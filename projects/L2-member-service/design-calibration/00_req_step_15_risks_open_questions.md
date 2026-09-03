# Step 15. 风险与待确认事项

## 1. Step 状态

- 状态：[x] 已完成并通过（2026-08-22）
- 对应 SOP：`需求文档讨论流程_SOP.md` Step 15
- 回填章节：`00-需求文档.md` §15（书写规范 4.15）
- 当前结论：开放项不阻塞需求边界成文，但阻塞受影响的正向合同、schema、配置、测试、实施与 readiness 声明

### 1.1 Step 内计划

- [x] 读取 Step 15 SOP、书写规范 4.15 和 Step 01~14 全部开放项
- [x] 重新核对 `L2-member` / `L2-member-images` 当前正式停审状态
- [x] 将具体失守风险与需要正式 owner 回答的问题拆成两张表
- [x] 为每项写明影响范围和当前约束 / 挂起口径
- [x] 区分不阻塞需求成文、阻塞后续正向闭口和必须重开需求三种情况
- [x] 回填 MSVC-UP-001~009，保留已解决范围决定
- [x] 审计普通 TODO、未来优化、方案脑补、空泛“未定”和历史污染

## 2. 本步输入与 authority 刷新

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| 需求 SOP Step 15 / 书写规范 4.15 | current_standard | 固定风险 / 待确认分表及第三列语义 |
| Step 01~14 校准材料 | pass | 汇总仍会影响前文结构或后续正向落地的开放项 |
| `project_execution_ledger.md` MSVC-UP-001~009 | active_ledger | 作为 blocker / pending 主索引，不在本步伪关闭 |
| `L2-member` 执行台账与正式 00 | formal_00_complete_stop_review | 需求级 owner 分工可正式消费；详细合同仍 pending |
| `L2-member-images` 执行台账与正式 00 | formal_00_stop_review；exact_contract_pending | 正式消费 supply availability 与 pinned instantiable entry 供给方向；`MI-UP-001` 所列 exact contract 继续 pending |
| `L2-runtime` 正式 00~07 | current_formal_with_open_Q | 继续传递 `Q-L2R-001` 逻辑入口 / 会话 surface 开放边界 |
| 旧 README / 旧正式 00~06 | historical_material | 只识别回流风险，不把旧问题或方案当当前待确认 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 还有哪些未关闭风险？ | 主要是跨仓正向合同未闭口导致 owner / readiness 被实现者猜测，以及旧协议、指标、产品与“万能控制面”边界回流。见 §4。 |
| 风险影响哪一层？ | 需求中的 owner、接口、数据、NFR 和验收语义已可收口；具体 schema、协议、adapter qualification、配置、正向测试和实施证据仍受影响。 |
| 还有哪些待确认事项？ | Runtime surface、Member 详细合同、Member Images handoff、SandboxBinding、policy / credential owner、Core / SDK 边界、基础设施 adapter、事件 / 观测反馈和量化基线。见 §5。 |
| 哪些会影响前文成立？ | 如果正式 owner 结论与当前 owner / 项目型-only / no-bypass 边界冲突，必须重开受影响 Step；若只是字段、协议、路由或目标数字未定，不推翻当前需求语义。 |
| 哪些当前可接受，哪些阻塞后续？ | 所有开放项都可通过 pending / fail-closed 进入正式 00；它们阻塞受影响的正向 contract、configuration、qualification 和 readiness，不能被静态设计替代。 |

## 4. 风险清单

| 风险 | 影响范围 | 当前处理口径 |
|---|---|---|
| `R-MS-001` Runtime 逻辑入口、host session 与 execution handoff 未共同闭口，后续可能被误写为本仓拥有 run / checkpoint 或 Runtime 拥有 host lifecycle | §2 / §6 / §7 / §9~14；MSVC-UP-001 | 当前只保留宿主、host session 壳和允许 ref；Runtime run / entry / recovery truth 按边界排除，正向 surface 保持 pending。 |
| `R-MS-002` Member 的请求 / 信号 / 报告与本仓接受 / registry / session / 健康分工虽已需求级闭口，字段和 IPC 未闭口仍可能导致双方复制 truth | §6 / §9~14；MSVC-UP-002 | 当前正式采用需求级 owner 分工；字段、凭据和联调不可由任一方单方面补造。 |
| `R-MS-003` Member Images 的需求级 pinned entry 供给边界虽已正式停审，exact manifest / variant / ref / confirmation contract 仍可能被实现者误读为已经 ready | §6 / §9~14；MSVC-UP-003 | 正式消费 supply availability 与 pinned entry 方向；exact schema、qualification、confirmation 和正向集成继续 pending，无法验证即 launch blocked。 |
| `R-MS-004` 宿主级 SandboxBinding / release 与逐动作 Tool execution 若在后续设计中混写，本仓会侵入 Sandbox backend 或 Tools / Runtime progression | §2 / §6 / §9~14；MSVC-UP-004 | 当前只保留宿主级 binding 关联、本地决定与允许反馈；逐动作 execute 按边界排除，正向字段 / caller 继续挂起。 |
| `R-MS-005` launch credential owner 未闭口，旧 launch_token 方案可能回流并使本仓取得签发、撤销或 secret truth | §9~14；MSVC-UP-006 | 当前只允许实例绑定、可验证、不可复用的安全引用；owner 与正文保持外置，正向 qualification pending。 |
| `R-MS-006` policy 到宿主传递 owner 尚未闭口，旧 Policy Proxy / 本地 allowlist 可能在没有功能来源时被重新加入主链 | §4 / §9 / §11~15；MSVC-UP-005 | 当前无对应 FR、接口或数据项；只保留待确认背景，不预建 policy 传递能力或本地裁决。 |
| `R-MS-007` member-service-specific Core schema、事件 family 和 SDK dependency target 未闭口，后续可能出现本地 shadow 或把 SDK runtime client 混入 host truth | §6 / §11~14；MSVC-UP-007 / 008 | 当前只引用 Core 类别并遵守 Core / SDK compile 基线；准确 schema、event 和 target 均不得被需求层猜测。 |
| `R-MS-008` 容器运行时 / 编排平台和镜像 registry 的产品语义、结果状态或身份模型可能反向定义宿主 truth | §2 / §6 / §9~14 | 当前只按 adapter 能力与安全 ref / snapshot 处理；后端产品、资源正文和 unknown 结果不取得 domain authority。 |
| `R-MS-009` Bus / Observability / 下游 receipt 被压平成 delivered、observed 或 accepted，会使本地 handoff attempt 冒充外部完成 | §9~14 | 当前以 local truth / attempt / gap / delivered / observed / accepted 分层约束；路由和反馈未闭口时不声明外部完成。 |
| `R-MS-010` 旧 P95、容量、heartbeat、SLA 和 forensic 保留数字可能被误读为当前性能、健康或验收硬指标 | §10 / §13 / §14；后续 04~06 | 当前全部按 historical candidate 处理；缺 workload、环境、口径和 authority 时不得进入目标或通过结论。 |
| `R-MS-011` 旧 REST / gRPC / WebSocket、状态机、对象、repository、outbox、重试和技术产品可能绕过 full-restart 回流 | 全文；后续 01~07 | 当前旧材料只用于污染审计；任何旧细节成为新结论都必须重新取得当前来源并通过对应文档门禁。 |
| `R-MS-012` 已解决的项目型-only 范围可能在后续被 DM / PersonalWorkspace 场景重新扩张，并以 GlobalMemberRef 代替正式执行主语 | §2 / §4 / §7~14；MSVC-UP-009 | 当前只支持 ProjectMemberRef 执行主语；非项目型 launch fail closed，未来纳入必须先有正式第三主语并重开需求。 |
| `R-MS-013` forensic、观测或排障诉求可能把外部日志、capture、evidence、report、artifact 或 secret 正文带入本仓 | §2 / §10 / §11 / §13 / §14 | 当前按 forbidden-body 和 body-free safe material 约束；调查完整性和外部正文 owner 不转移。 |

## 5. 待确认事项

| 待确认事项 | 影响章节 | 当前状态 |
|---|---|---|
| `Q-MS-001` Runtime 逻辑入口、host session、宿主触发和 execution handoff 的正式双侧 surface 是什么 | §6 / §9 / §12~14；后续 01~07 | 当前只保留 capability-level 宿主侧 seam；Runtime entry / run / recovery 正向合同保持 blocked，不替对端定义。 |
| `Q-MS-002` Member launch / register / heartbeat / status 的准确载荷、IPC、实例关联与凭据语境是什么 | §9~14；后续 01~07 | 需求级 owner 分工已正式成立；详细合同和真实联调保持 waiting，非法 / 重放 / 迟到语义 fail closed。 |
| `Q-MS-003` Member Images 向本仓交接 pinned image ref、manifest、digest、verification 和 provenance 安全材料的正式合同是什么 | §6 / §9~14；后续 01~07 | 对端正式 00 已停审并确认 pinned instantiable entry 供给方向；双方 exact contract 仍由 `MSVC-UP-003` / `MI-UP-001` 挂起，正向装配 blocked。 |
| `Q-MS-004` 宿主级 SandboxBinding 的 bind / release / failure / cleanup 合同以及非工具型维护动作 caller 是什么 | §6 / §9~14；后续 01~07 | 当前只确定宿主级 owner 边界和 no-fallback；字段、caller、receipt 与 backend qualification 保持 pending。 |
| `Q-MS-005` policy 到宿主传递的正式 owner、是否属于本仓当前功能及其输入来源是什么 | §4 / §6 / §9 / §11~15；后续文档范围 | 当前不纳入主链、无 FR / 接口 / 数据；只有正式 owner 与范围结论出现后才允许重开受影响 Step。 |
| `Q-MS-006` launch credential 的签发、撤销、资格验证与安全引用 owner 是什么 | §9~14；后续 01~07 | 当前只锁不保存正文、不复用、实例绑定与不可证 fail closed；正向 owner / contract 保持 pending。 |
| `Q-MS-007` member-service-specific Core shared ID / ref / metadata / error / event family 的最小正式集合是什么 | §6 / §11~14；后续 01 / 03 / 05~07 | 当前只引用 Core 契约类别，不本地 shadow；准确 schema、source、payload、receipt 和 route 等待 Core authority。 |
| `Q-MS-008` `L0-sdk` 的准确编译 dependency target 与 Server 自测试方式是什么 | §6 / §12~14；后续 01 / 03 / 05 / 07 | 当前遵守 compile 基线但不进入运行期主链；准确 target、test surface 和证据状态保持 pending。 |
| `Q-MS-009` 容器运行时 / 编排平台与镜像 registry adapter 的能力资格、结果关联和 unknown 边界如何正式表达 | §6 / §9~14；后续 01~07 | 当前只按中立 adapter、ref / snapshot 和 fail-closed 语义挂起；不固定产品、协议或后端状态机。 |
| `Q-MS-010` Bus / Observability / 下游消费的 producer、source、route、receipt 与反馈 owner 是什么 | §6 / §12~14；后续 01~07 | 当前只形成 body-free local material、attempt / gap；delivery / observed / accepted 正向证明保持 blocked。 |
| `Q-MS-011` 宿主 workload、并发规模、健康判定窗口、容量和性能目标由谁以何种环境与证据确权 | §13 / §14；后续 04~07 | 当前只保留测量维度和结构性门禁；旧数字不升级为目标，未取得 authority 前不得宣告性能通过。 |

## 6. Blocker 分层

| 层级 | 当前结论 |
|---|---|
| 不阻塞正式 00 成文 | Q-MS-001~011 均可由明确 owner 边界、pending、blocked、waiting、unknown 与 fail-closed 语义承接；正式 00 不需要 API、字段、协议、产品或目标数字才能说明“必须是什么”。 |
| 阻塞受影响正向设计闭口 | Q-MS-001~010 阻塞相应 schema、adapter、route、caller、配置项和正向交互被声明 complete；后续文档可保留 placeholder，但不得脑补合同。 |
| 阻塞测试 / 验收 / 实施 readiness | 所有 Q-MS-001~011 在所涉正向路径闭口和产生真实证据前，阻塞相关 positive qualification、artifact、report、evidence、verdict、signoff 和 readiness。 |
| 当前正式文档切换门禁 | 上游开放项不是 01 的直接文档门禁；正式 00 完成后仍必须先停审并取得用户明确确认，才能进入 01。 |
| 必须重开需求 | 正式 owner 结论与当前 truth 边界冲突；policy 传递被正式纳入当前功能；非项目型宿主进入当前范围；Member Images / Member / Runtime 正式合同否定当前能力边界；任何硬边界或一票否决条件被设计要求为允许。 |

### 6.1 MSVC-UP 状态承接

| ID | Step 15 状态 | 当前挂起方式 |
|---|---|---|
| MSVC-UP-001 | open_boundary | Q-MS-001；宿主侧语义成立，Runtime positive surface blocked |
| MSVC-UP-002 | requirement_boundary_formally_stopped / detailed_contract_pending | Q-MS-002；需求级 owner 闭口，详细合同 waiting |
| MSVC-UP-003 | requirement_boundary_formally_stopped / detailed_contract_pending | Q-MS-003；需求级 supply direction 已闭口，exact contract 与 positive launch 仍 blocked |
| MSVC-UP-004 | upstream_forward_schema_pending | Q-MS-004；宿主级边界成立，字段 / caller / qualification pending |
| MSVC-UP-005 | owner_pending_no_current_FR | Q-MS-005；不纳入主链，owner 结论后决定是否重开 |
| MSVC-UP-006 | owner_pending | Q-MS-006；只锁安全消费语义 |
| MSVC-UP-007 | schema_pending | Q-MS-007；只引用 Core 类别 |
| MSVC-UP-008 | baseline_applied_scope_pending | Q-MS-008；compile 基线成立，准确 target pending |
| MSVC-UP-009 | resolved_for_current_scope | 当前版项目型-only 已闭合，不再列待确认；未来扩展必须重开 |

## 7. 历史污染与非风险项审计

| 候选项 | 分类结论 | 处理 |
|---|---|---|
| API、Command、DTO、schema、状态机、存储、事务、重试、框架和产品尚未定义 | 后续设计输入，不是需求风险本身 | 只在对应 Q 影响下挂起，不在本步补方案 |
| 容量建议、预热、forensic 材料和聚合视图未指定 release | 外围增强范围，不是当前核心缺陷 | 保持外围；不得因此阻塞核心 00 |
| 旧 P95 / SLA / heartbeat / 容量数字 | historical candidate，不是当前待确认答案 | 由 Q-MS-011 管理 authority，不原样继承 |
| 旧实现与测试 TODO | historical / implementation item，不是风险 | 不进入两张正式表 |
| MSVC-UP-009 项目型-only | 当前范围已解决 | 保留 resolved 决定，不能重新标成“未定” |
| 当前无实现仓、测试 run 或验收证据 | 与本任务阶段一致，不是缺陷 | 禁止用模板值填充；后续 07 也只能标 planned / blocked / waiting |

## 8. 回填草稿与门禁

### 8.1 回填草稿

> 校准来源：
> - `design-calibration/00_req_step_15_risks_open_questions.md`

正式装配时采用 §4 风险清单、§5 待确认事项和 §6 Blocker 分层。MSVC-UP 索引、输入刷新过程、历史污染和自检保留在校准材料；正文必须明确“开放项不阻塞需求边界成文，但阻塞受影响的正向合同和 readiness”。

### 8.2 门禁自检

- [x] 13 项具体风险与 11 项待确认事项分成两张表
- [x] 每项风险有影响范围和当前约束，每项待确认有影响章节和挂起方式
- [x] MSVC-UP-001~008 均有对应 Q；MSVC-UP-009 保持 resolved，不伪造 reopen
- [x] `L2-member` 与 `L2-member-images` 正式 00 最新停审状态已刷新
- [x] 已区分需求成文、后续正向闭口、qualification / readiness 和需求重开门禁
- [x] 无普通 TODO、空泛“未定”、实施方案、伪造证据或伪造 ready

结论：`gate_status = pass`，`current_state = stop_review`。用户已授权完成整份 00，下一动作是先更新 flow / ledger，再读取 Step 16 SOP、书写规范 4.16 并建立全链追溯矩阵。
