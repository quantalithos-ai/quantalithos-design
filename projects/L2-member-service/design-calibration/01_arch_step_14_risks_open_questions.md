# 01 架构校准 Step 14：风险与待确认事项

> 状态：completed / pass
> 日期：2026-08-23
> 前序门禁：Step 13 completed / pass
> 本步目的：拆分正式架构风险与外部待确认事项，固定当前保护口径、阻塞范围和挂起上限，不脑补最终合同

## 1. Step 内计划

- [x] 读取 flow、项目台账、Step 1~13 和正式 00 的风险 / 待确认基线。
- [x] 按 SOP 4.15 判定“已知风险”与“尚缺定论的问题”，排除 TODO、愿望和已定结论。
- [x] 为每项风险固定影响范围、当前架构保护口径和阻塞性。
- [x] 为 Q-MS-001~011 固定缺失确认、挂起口径、owner、关闭条件和 positive ceiling。
- [x] 区分不阻塞 01 成文、阻塞正向设计闭口、阻塞资格 / 验收 readiness 和必须重开需求。
- [x] 审计 sibling 进行中内容、历史材料和 resolved 项没有被伪装成当前 truth 或开放 blocker。
- [x] 形成正式 §15 回填草稿和 gate 自检。

## 2. 输入与效力

| 输入 | 效力 | 本步使用方式 |
|---|---|---|
| 正式 `00-需求文档.md` §15 | direct baseline | 承接 R-MS-001~013、Q-MS-001~011 和需求期 blocker 分层；架构可具体化影响，不得删除开放项。 |
| Step 1~13 | stopped architecture units | 汇总职责、依赖、数据、交互、机制、横切和演进中仍未关闭的主线问题。 |
| 项目执行台账 | blocker registry | 以 MSVC-UP-001~009 为跨项目状态入口；resolved 项不得重新写成 current blocker。 |
| sibling 正式 00 / 进行中 01 | mixed authority | 正式 00 的 owner / supply 方向可用；进行中 01 只提示潜在兼容问题，不提供定论。 |
| 旧正式 01 与 `draft/` | historical / discussion input | 只用于识别回流风险，不继承协议、产品、数字、对象或状态。 |

## 3. SOP 问题回答

### 3.1 当前有哪些尚未关闭的正式架构风险

风险集中在十条主线上：placeholder 冒充正向能力、外部 owner truth 侵入、本应 fail closed 的 qualification 被旁路、活动世代与不可逆副作用分叉、local / external outcome 被压平、forbidden body 泄漏、基础设施产品语义反向塑形、依赖类型错置、历史污染回流，以及无 authority 的范围扩张。这些问题的危害已经明确，因此属于风险，不是“等上游回答后再判断是否有害”的问题。

### 3.2 哪些风险阻塞后续推进

- 不阻塞正式 01 说明边界：当前架构已为每类风险给出禁止边、fail-closed 或 deferred 上限。
- 阻塞受影响的正向合同、adapter、schema、route、配置或交互被声明 complete：开放合同不能靠 placeholder 闭口。
- 一旦出现多 truth owner、fail-open、第二活动世代、正文入仓或外部完成冒认，必须阻塞下游并回退受影响架构单元。
- fake、局部 attempt 或静态设计审计不解除任何真实集成、测试、验收或 readiness blocker。

### 3.3 当前有哪些待确认事项

Q-MS-001~011 仍分别缺 Runtime、Member、Images、Sandbox、policy、credential、Core、SDK、基础设施 adapter、材料消费者以及 workload / measurement authority 的正式确认。它们会影响精确合同或指标，但当前不足以改变已经停审的 host truth owner、项目型双锚、五核心语义、依赖分类和 fail-closed 结论。

### 3.4 哪些问题会影响前文是否成立

若正式 owner 合同否定本仓的宿主侧 owner 边界，或要求本仓取得 Runtime / Member / Images / Sandbox / L1 / infrastructure truth，Step 3~12 必须重开。若只是字段、协议、schema、route、产品或数值尚未确定，则前文结构仍成立，受影响正向路径保持 blocked / waiting。policy 被纳入当前功能或非项目型主语进入范围时，必须先重开 00，不能仅在 01 补结论。

## 4. 判定与编号口径

| 类别 | 判定条件 | 本步编号 | 不属于该类别 |
|---|---|---|---|
| 正式架构风险 | 危害及其对主线的影响已知，但尚需持续保护或外部闭口 | AR-MS-001~010 | 普通实现任务、产品选择、优化愿望。 |
| 待确认事项 | 定论仍依赖正式 owner、双侧合同、环境或测量 authority | 沿用 Q-MS-001~011 | 已确认红线、已 resolved 的当前项目型范围。 |
| 跨项目 pending | 需要在多项目台账保持同一开放状态 | MSVC-UP-001~008 | 本仓可单方面关闭的内部设计项。 |
| 当前范围 resolved | 已有正式范围结论，但未来变化须重开 | MSVC-UP-009 | 非项目型能力已经存在。 |

## 5. 正式架构风险结论

| 风险项 | 影响范围 | 当前处理口径 | 是否阻塞 | 说明 |
|---|---|---|---|---|
| `AR-MS-001` contract placeholder、fake 或局部 receipt 被误写为正向能力已 ready | A2 / A3、S1~S3、跨 owner 交互和后续资格链 | placeholder 只固定 host-side seam；positive path 保持 blocked / waiting，fake 只证明局部边界可控 | 有条件阻塞 | 不阻塞 01 表达边界，但阻塞相应合同、集成和 readiness 被声明完成。 |
| `AR-MS-002` Member / Runtime / Images / Sandbox / L1 / infrastructure truth 被本仓复制或反向取得 host truth | A1~A5、职责、依赖和数据所有权主线 | 只消费 typed ref / safe snapshot / allowed result；每类 truth 保持 single writer，外部正文和产品状态不入仓 | 阻塞 | 一旦 owner 发生迁移，核心边界失效，必须回退 Step 3 / 5 / 7 / 8。 |
| `AR-MS-003` required source、supply、credential、binding 或 carrier 缺失时被默认值、旧缓存或 host fallback 放行 | A1 / A2、S1 / S2、装配 readiness 与安全边界 | missing / stale / conflict / unknown / pending 均非 ready；required qualification 一律 fail closed | 阻塞 | 该风险会直接打穿项目、凭据和隔离边界，不能以可用性理由接受。 |
| `AR-MS-004` 重复、迟到、并发或 unknown 副作用形成第二活动宿主 / 注册 / session 或盲重放 | A1~A5、强一致提交、后台推进和 reconciliation | immutable generation、single-active、稳定相关锚、幂等资格、fence / hold；迟到结果不覆盖 | 阻塞 | 活动关联分叉会破坏 host truth，unknown 不能通过猜测消除。 |
| `AR-MS-005` local decision / attempt / gap 被压平成 cleanup completed、delivered、observed、accepted 或 Runtime success | A5、S3、P3、handoff、观测和验收边界 | local fact、external attempt、receipt / observed / accepted 分层；无正式反馈只保留 gap / unknown | 有条件阻塞 | 阻塞外部完成与验收声明，不回滚已经提交的本地 truth。 |
| `AR-MS-006` credential、secret、endpoint、mount、signal、run、capture、artifact 或 evidence 正文进入 truth、投影、日志或 handoff | 全部单元，重点 P1~P3 / S3 | 只允许 body-free ref、safe snapshot、redacted marker；forbidden body 不因排障或审计诉求例外 | 阻塞 | 正文入仓同时造成 owner 迁移和敏感信息暴露，不能作为可接受债务。 |
| `AR-MS-007` 容器运行时、编排平台、registry、RPC、事件或数据库产品语义反向定义领域对象和状态 | S2、技术机制、数据模型与部署承载 | 固定中立 port / adapter、ref / snapshot 和失败语义；产品、拓扑、协议与存储保持 deferred | 不阻塞 | 当前结构可在不选产品时成立；后续选择不得推翻 host truth 与四语义层。 |
| `AR-MS-008` runtime / event / ref / adapter / fake seam 被误写为 sibling 源码或运行期 SDK compile dependency | A1~A5、S1~S3、全局裁剪和可测试性 | 只保留允许的 Core / SDK compile 基线；跨 owner 协作用端口、事件、引用或 adapter 表达 | 阻塞 | 错置依赖会把运行期协作变成源码耦合并破坏独立演进。 |
| `AR-MS-009` 旧 REST / gRPC / WebSocket、Kubernetes / PostgreSQL、状态机、对象、SLA / P95 / heartbeat 数字回流 | 全文、性能 / 配置 / 测试 / 验收交接 | 旧材料只作污染审计；任何结论必须重新取得当前来源和对应 Step 门禁 | 有条件阻塞 | 旧细节本身没有 authority；一旦进入正式定论，必须删除或重开校准。 |
| `AR-MS-010` policy、非项目型主语、warm pool、复杂调度或 forensic 正文在无 FR / owner 时进入核心主线 | A1 / S1 / S3、范围、演进和追溯 | 当前主线只支持项目型 C-MS-1~5；外围项保持 enhancement / excluded，范围变化先重开 00 | 不阻塞 | 当前没有能力缺口；风险来自无 authority 扩范围，而不是已承诺功能未完成。 |

## 6. 待确认事项结论

| 待确认事项 | 影响范围 | 缺失确认 | 当前挂起口径 | 说明 |
|---|---|---|---|---|
| `Q-MS-001` Runtime entry、host session、宿主触发与 execution handoff 的正式双侧 surface | A3、C-MS-3 / 4、同步关联与后续执行交接 | Runtime 正式 entry / session owner、输入输出、失败与兼容合同 | 只保留 host-side session / handoff port；positive interaction blocked | 不创建或推进 run，不把宿主恢复写成 checkpoint 恢复。 |
| `Q-MS-002` Member launch / register / heartbeat / status 的准确载荷、IPC、实例关联和凭据语境 | A3 / A4、注册、endpoint 和健康交互 | 双方字段、协议、凭据、迟到 / 重放语义及联调合同 | 正式采用需求级 owner 分工；详细交互 waiting，非法或不可证输入 fail closed | 进行中的 sibling 01 不能单方面关闭本项。 |
| `Q-MS-003` pinned image ref、manifest、digest、verification 与 provenance 安全材料合同 | A2、S1 / S2、装配 qualification | Images 正式供给对象、最小安全字段、确认和兼容语义 | 只消费 pinned instantiable supply 方向；引用不可验证则 launch blocked | 不直接解析 Role -> image，也不保存构建 / 供应链 evidence 正文。 |
| `Q-MS-004` SandboxBinding bind / release / failure / cleanup 合同及非工具维护动作 caller | A2 / A5、S2、隔离装配和收束 | Sandbox 正式字段、caller、receipt、失败 / release / backend qualification 合同 | 只定义 host-side binding association / local outcome；正向 bind / release blocked | 逐动作 Tool execution 继续归 Tools / Runtime，不借本项移入本仓。 |
| `Q-MS-005` policy 到宿主传递的 owner、当前范围和正式输入来源 | 范围、S1 / S3、依赖与配置边界 | 正式 owner 与需求范围裁决 | 当前无 FR、接口、数据或上下文；不进入主线 | 若被纳入当前功能，先重开 00；owner 未定不等于已有风险事实。 |
| `Q-MS-006` launch credential 签发、撤销、资格验证和安全引用 owner | A2 / A3、S1 / S2、安全与注册 | credential authority、生命周期、验证结果和最小 ref 合同 | 只允许实例绑定、可撤销语义的安全 ref；不可证即 blocked | 本仓不签发、不撤销、不保存或输出 secret。 |
| `Q-MS-007` member-service 所需 Core ID / ref / metadata / error / event family 最小集合 | 全部跨仓 ref、事件与错误边界 | Core authority 下的准确类型、envelope、payload / receipt 类别 | 只引用 Core 正式类别；不得本地 shadow 或宣称 schema ready | 不阻塞语义边界，阻塞准确 schema 与事件合同闭口。 |
| `Q-MS-008` `L0-sdk` 准确 compile target 与 Server 自测试方式 | 依赖裁剪、详细设计、测试与实施交接 | SDK 正式 target、适用 surface 和测试 qualification | 保留受限 compile 基线；不把 SDK 写为运行期宿主主链依赖 | 准确 target 未闭口前不得伪造编译或 Server 测试证据。 |
| `Q-MS-009` 容器 / 编排 / registry adapter 的能力资格、结果关联和 unknown 边界 | S2、部署承载、外部副作用和 reconciliation | 基础设施 owner 的 capability / failure / correlation / qualification 合同 | 只固定中立 adapter 与 fail-closed 结果类别，不锁产品 / 协议 / 状态机 | backend observed 不取得 host truth，fake 不证明真实 backend。 |
| `Q-MS-010` Bus / Observability / 下游 producer、source、route、receipt 和反馈 owner | S3 / P3、事件交接、观测与外部 outcome | 各 owner 的 route、delivery / observation / acceptance receipt 合同 | 只形成 body-free local material、attempt / gap；外部完成 blocked | 不因 publish accepted 或日志写入而宣称 delivered / observed。 |
| `Q-MS-011` workload、并发规模、健康窗口、容量和性能目标的 authority 与证据口径 | 运行角色、配置、性能、测试和验收 | 场景、环境、测量 owner、窗口 / 分位数和证据来源 | 只保留结构性 guard 与测量维度；不使用旧数字或宣称性能通过 | 不阻塞 01 结构，阻塞 04~06 的具体数值和 readiness。 |

## 7. Owner、关闭条件与 positive ceiling

| 待确认项 | 确认 owner / 待确认方 | 关闭条件 | 关闭前 positive ceiling | 主要受阻下游 |
|---|---|---|---|---|
| Q-MS-001 / MSVC-UP-001 | `L2-runtime` 与本仓双侧 | 双方正式文档给出一致 surface、failure、compatibility 并各自停审 | host-side placeholder only | 正向 session / execution handoff；02~07 对应合同与证据 |
| Q-MS-002 / MSVC-UP-002 | `L2-member` 与本仓双侧 | 字段、IPC、credential context、迟到 / 重放和联调合同正式闭口 | requirement owner split only | register / heartbeat 正向交互；03 / 05~07 |
| Q-MS-003 / MSVC-UP-003 | `L2-member-images` 与本仓双侧 | exact pinned supply ref / safe manifest / qualification / confirmation 双侧闭口 | supply direction only | image qualification / launch；02~07 |
| Q-MS-004 / MSVC-UP-004 | `L4-sandbox` 与本仓双侧；非工具 caller 待定 | binding / release / cleanup / receipt 与 caller 正式闭口 | host-side binding port only | bind / release 正向路径；02~07 |
| Q-MS-005 / MSVC-UP-005 | owner_pending；需求 authority | owner 与当前范围均形成正式结论 | no capability / no dependency | 当前无受阻功能；若纳入则重开 00~01 |
| Q-MS-006 / MSVC-UP-006 | credential authority pending | issuer / revoker / verifier 与安全 ref 合同正式闭口 | opaque instance-bound ref only | launch / register qualification；02~07 |
| Q-MS-007 / MSVC-UP-007 | `L0-core` authority | 最小共享类型与事件类别正式发布并通过本仓兼容复核 | category reference only | 准确 schema / event / receipt；03 / 05~07 |
| Q-MS-008 / MSVC-UP-008 | `L0-sdk` authority 与本仓 consumer | compile target / Server test surface 正式闭口 | compile baseline only | 03 / 05 / 07 的依赖与测试交接 |
| Q-MS-009 | infrastructure adapter owner pending | capability、correlation、unknown、qualification 双侧合同闭口 | neutral adapter / fake seam only | 真实后端集成、韧性与资格证据 |
| Q-MS-010 | `L0-bus`、Observability 与具体 consumer owner | source / route / receipt / feedback 按 owner 正式闭口 | local material / attempt / gap only | delivery / observed / accepted 证明；05~07 |
| Q-MS-011 | product / workload / test / acceptance authority pending | 场景、环境、指标口径和真实证据 authority 闭口 | structural guard / measurement dimension only | 04 数值、05 性能验证、06 verdict、07 readiness |

## 8. Blocker 分层与跨项审计

| 层级 | 项目 | 当前结论 |
|---|---|---|
| 不阻塞正式 01 成文 | Q-MS-001~011 | owner、影响与挂起上限已明确；01 只声明结构与风险，不声明正向能力 complete。 |
| 阻塞正向合同 / adapter / schema 闭口 | Q-MS-001~004、006~010 | 可在 02~03 保留 placeholder 和 fail-closed，不得写 exact API / event / route / product ready。 |
| 阻塞具体配置 / 测试 / 验收 / 实施 readiness | Q-MS-001~004、006~011 | 受影响路径没有真实合同与证据前，不得生成 positive artifact、verdict、signoff 或 readiness。 |
| 当前无功能 blocker | Q-MS-005 | policy 传递不在当前范围；无 authority 扩范围才是风险。 |
| 必须重开 00 / 01 | owner 结论否定当前 truth 边界；policy 或非项目型进入当前范围 | 不允许在下游文档或实现中局部修补。 |
| 当前范围 resolved | MSVC-UP-009 | ProjectMemberRef 为唯一执行主语；非项目 launch fail closed，非项目合同并不存在。 |

| 审计项 | 结果 | 说明 |
|---|---|---|
| 风险与待确认是否混写 | pass | AR-MS 表达已知危害；Q-MS 表达缺失 authority，二者字段和状态分开。 |
| 是否把 TODO / 产品选择写成风险 | pass | 产品、协议、schema 和数字只作为缺失确认，不形成实施 backlog。 |
| 是否为开放项脑补 owner | pass | policy、credential、infrastructure 和 measurement owner 保持 pending。 |
| sibling 进行中 01 是否升格 | pass | Member / Images 只采用正式 00 方向，exact contract 仍需双侧正式停审。 |
| resolved 项是否重新开放 | pass | MSVC-UP-009 只保留未来重开条件，不列 current Q。 |
| 是否保留 fail-closed 与 evidence honesty | pass | 每个正向 seam 都有限定 ceiling，fake / attempt / static audit 不解除 blocker。 |
| 架构单元是否存在未归属开放项 | pass | A1~A5、S1~S3、P1~P3 的开放影响均可回指风险或 Q-MS。 |

## 9. 当前处理口径说明

AR-MS-001~010 的危害和主线影响已经明确，因此按正式风险持续受架构红线保护；Q-MS-001~011 仍缺 owner、双侧合同、环境或测量 authority，只能挂起，不能提前升格为确定合同。开放项不阻止 01 说明“系统必须如何分层”，但持续阻止受影响正向路径被写成 complete、qualified 或 ready。最终字段、产品、数值和处置方案属于后续正式文档或上游 owner，不在本步预支。

## 10. 回填草稿

- 正式 §15 使用 §5 的五列风险表和 §6 的五列待确认事项表，并保留 §9 的 4 句处理口径说明。
- owner、关闭条件、positive ceiling 和 blocker 分层留在 calibration，正式正文通过 Q / MSVC ID 回链，不扩展固定表字段。
- 正式正文不得把风险表写成任务清单，不得把 Q 写成临时方案，也不得声明任何合同、测试、证据或 readiness 已完成。

## 11. Gate 自检

| 检查项 | 结果 |
|---|---|
| 正式风险是否均影响主线且非模板空话 | pass |
| 风险是否有影响范围、当前处理口径和阻塞判断 | pass |
| Q-MS-001~011 是否完整且缺失确认具体 | pass |
| 每个 Q 是否有挂起上限、owner / 待确认方和关闭条件 | pass |
| 正向 blocker、当前无 blocker 和重开条件是否分层 | pass |
| 是否未脑补 sibling、产品、协议、schema、数字或证据 | pass |
| 是否允许创建 Step 15 | pass；须先同步 flow 与项目台账 |

```text
gate_status = pass
next_allowed_action = update_flow_and_ledger_then_create_step_15
formal_01_write_allowed = false
```
