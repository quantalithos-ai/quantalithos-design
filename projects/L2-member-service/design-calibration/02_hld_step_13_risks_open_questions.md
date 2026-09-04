# 02 概要校准 Step 13：设计风险与待确认事项

> 状态：completed / pass
> 日期：2026-08-24
> 前序门禁：Step 12 completed / pass
> 本步目的：区分已知会破坏概要成立性的设计风险与仍缺正式 owner / 双侧合同 / measurement authority 的待确认事项，并固定当前保守口径

## 1. Step 开工确认与计划

| 项目 | 记录 |
|---|---|
| 已读取通用规范 | yes；概要设计 SOP Step 13、书写规范 §4.13、风险 / 待确认分表规则已复核 |
| 已读取项目输入 | yes；Step 4~12、正式 00 / 01 风险与 Q、项目 blocker 台账和并行 sibling 效力已复核 |
| 当前 Step | Step 13：设计风险与待确认事项 |
| 本 Step 输出 | `design-calibration/02_hld_step_13_risks_open_questions.md` |
| 正式文档写入 | forbidden；Step 14 前旧正式 02 仍为 historical_material |
| 下一 Step | blocked；本步 completed / pass 前不得修改正式 02 或创建 Step 14 |

- [x] 判定概要层风险与待确认事项，排除任务、TODO、优化愿望和已稳定承接项。
- [x] 为每项风险标明影响的组成部分、对象、接口、处理流、状态或配置边界。
- [x] 为 Q-MS-001~011 固定 owner / 关闭条件 / 当前挂起口径和 positive ceiling。
- [x] 审计并行 sibling WIP、历史材料、fake 和局部 receipt 未被误写为 ready。
- [x] 形成正式第 13 章回填草稿与 Gate 自检。

## 2. 分类口径

| 类别 | 判定条件 | 本步处理 |
|---|---|---|
| 设计风险 | 危害和影响已经明确，但需要持续受红线或外部闭口保护 | 使用 `HR-MS-*` 记录影响与当前保守处理；不写具体实施方案。 |
| 待确认事项 | 最终定论仍依赖正式 owner、双侧合同、环境或 measurement authority | 沿用 `Q-MS-001~011` / `MSVC-UP-*`，写清关闭前挂起上限。 |
| 稳定承接项 | Step 4~12 已收稳，03 只需继续展开实现契约 | 不重复写成风险或 Q；留在 Step 12 承接清单。 |
| 范围 resolved | 当前仅支持 ProjectMemberRef + GlobalMemberRef | `MSVC-UP-009` 不作为开放 Q；未来变化先重开需求。 |
| 任务 / 优化 | 开发拆分、排期、重构、压测、上线或运维任务 | 不进入本步。 |

## 3. 设计风险清单

| 风险 | 影响 | 当前处理口径 |
|---|---|---|
| `HR-MS-001` placeholder、fake、adapter availability 或局部 receipt 被误写为 positive contract / readiness | CMP-MS-02~07；qualification、session、cleanup、handoff 接口和状态；03~07 downstream | placeholder 只证明本仓边界已点名；受影响正向路径保持 blocked / waiting / unknown，fake 不提供真实集成证据。 |
| `HR-MS-002` Runtime、Member、Images、Sandbox、L1、Governance、Observability 或 backend truth 被复制成本仓 Host Truth | 七个 CMP、29 对象、source resolver / feedback Consumer / projection | 只允许 typed ref、safe snapshot、freshness、redacted marker、body-free material 和 matching safe outcome；owner 迁移立即回退 00 / 01 / 02。 |
| `HR-MS-003` required subject、identity、supply、credential、binding 或 carrier qualification 被默认值、旧缓存、fallback 或配置放行 | CMP-MS-01~03；qualification / assembly / readiness flows；`HostReadinessDecision` | missing / stale / conflict / unknown / pending 全部非 ready；no-fallback 与 forbidden config boundary 保持一票阻塞。 |
| `HR-MS-004` 正交状态被压成一个 `HostStatus`，或 ready / active / healthy / closed / delivered / accepted 被互相推断 | 29 对象状态、Query、safe view、handoff 与详细设计 transition model | 保持各对象 owner-specific 状态轴；03 若要合并状态必须回退 Step 6 / 9，不得以实现便利暗改。 |
| `HR-MS-005` duplicate、late、concurrent 或 unknown effect 形成第二 current host / registration / session，或换 key 盲重放 | CMP-MS-01~06；generation、attempt、association、registration、session、cleanup | immutable generation、single-active、expected revision、stable effect key、hold / reconciliation；迟到只进 matching history。 |
| `HR-MS-006` local decision / attempt / submitted / gap 被写成 external action complete、cleanup complete、delivered、observed、accepted 或 Runtime success | CMP-MS-03、06、07；outbox / handoff / feedback flows；05 / 06 verdict | local truth、attempt、publisher submission、external outcome layers 分开；缺 owner feedback 即 gap / unknown，不回滚 source。 |
| `HR-MS-007` Query、Consumer、Job、projection 或 reconciliation 成为隐藏的 lifecycle command / second writer | Step 7 / 8 接口分类；CMP-MS-01~07 source facts；状态传播 | Query no-write；Consumer 只写 matching local snapshot / feedback；Job 只推进已提交 work；projection / reconciliation 不反写 source。 |
| `HR-MS-008` secret、credential、endpoint、image、signal、Runtime、Sandbox、report / evidence 正文因调试、forensic 或审计诉求入仓 | 全部对象、history、material、projection、event、log / handoff | forbidden body 一律拒绝或裁剪为 safe ref / summary；调查完整性不能迁移外部正文 owner。 |
| `HR-MS-009` 容器 / 编排 / registry、RPC、事件、SDK、数据库产品语义或配置 profile 反向定义对象、状态或 owner | code skeleton、ports / adapters、persistence、configuration impact | 保持 product-neutral port、adapter-neutral result 和依赖分类；产品 / 配置只能影响承载与节奏，不改变 domain invariant。 |
| `HR-MS-010` runtime / event / ref / adapter / fake seam 被转换为 sibling 源码依赖、共享数据库或 SDK runtime client | 实现分层、03 dependency / module design、并行项目演进 | 仅 Core / 受限 SDK target 可进入 compile 讨论；跨 owner 协作必须经正式 seam，不共享 sibling private model / storage。 |
| `HR-MS-011` 旧 02 / 03 / 05 / 06 的 worker、action execution、capability mount、Sandbox execution、协议、产品、状态和数字回流 | 正式 02 装配、Step 12 详细设计承接、后续 03~07 | historical material 只做污染审计；任何旧细节成为新结论必须有当前 authority 并重开相应 Step。 |
| `HR-MS-012` policy 传递、非项目型主语、warm pool、复杂调度、容量优化或 forensic body 无 FR 即进入核心 | Step 2 范围、七个 CMP、接口 / 对象分母、配置和演进 | 当前只支持项目型 C-MS-1~5；E01~E04 仍为外围扩展，新增主线先重开 00 / 01 / 02。 |
| `HR-MS-013` 投影 / publication / Observability 不可用被错误解释为 source truth 失败，或为可用性绕过安全视图 | CMP-MS-07、safe Query、material / history、核心 write availability | projection 可 stale / degraded / unavailable；外围失败不回滚核心 committed truth，Query 不 refresh / fallback forbidden body。 |

## 4. 待确认事项清单

| 待确认 | 影响范围 | 当前挂起口径 |
|---|---|---|
| `Q-MS-001 / MSVC-UP-001` Runtime entry、Host Session、宿主触发与 execution handoff 双侧 surface | CMP-MS-04 / 05 / 07；session port、recovery / handoff flow、03 public contract | 只保留 host-side `RuntimeHostSessionAssociationPortPlaceholder` 和 blocked result；不创建 / 推进 run，不定义 checkpoint / outcome。 |
| `Q-MS-002 / MSVC-UP-002` Member launch / register / heartbeat / status 的准确载荷、IPC、实例关联和 credential context | CMP-MS-04 / 05；registration / signal Consumers、generation / replay fence | 需求级 owner 分工可用；并行 sibling 当前成果不采信为合同，字段 / 协议 / 联调 waiting，非法 / 迟到 / 重放 fail closed。 |
| `Q-MS-003 / MSVC-UP-003` Images pinned ref、manifest、digest、verification、provenance 和 confirmation 合同 | CMP-MS-02 / 03；supply resolver、asset acquisition、readiness | 只消费 pinned supply direction / typed ref；exact contract blocked，无法验证即 assembly / launch blocked，不解析 Role -> image。 |
| `Q-MS-004 / MSVC-UP-004` SandboxBinding bind / release / failure / cleanup contract 与非工具维护 caller | CMP-MS-02 / 03 / 06；binding qualification / lifecycle / cleanup ports | 只定义 host-side association、attempt 和 safe outcome；required binding no-fallback，positive bind / release / cleanup blocked。 |
| `Q-MS-005 / MSVC-UP-005` policy 到宿主传递的 owner、当前范围与输入来源 | Step 2 范围、CMP-MS-01 / 02、configuration impact | 当前无 FR、接口、对象或配置入口；完全不进入主线。若正式纳入，先重开 00。 |
| `Q-MS-006 / MSVC-UP-006` launch credential 签发、撤销、qualification 与 safe ref owner | CMP-MS-02 / 04；qualification、registration、安全异常 / 配置 | 只允许 instance-bound、revocable、不可复用的 opaque safe ref；本仓不签发、撤销、保存或输出 secret，不可证即 blocked。 |
| `Q-MS-007 / MSVC-UP-007` member-service Core ID / ref / metadata / error / event family 最小正式集合 | 全部 public skeleton、event / feedback / history / handoff contract | 只引用 Core category；不得本地 shadow。准确 schema、envelope、route、receipt、version 继续 blocked。 |
| `Q-MS-008 / MSVC-UP-008` SDK 准确 compile target 与 Server 自测试方式 | Step 4 实现分层、Step 12 03 / 05 / 07 承接 | 保留 limited compile / fake seam；不进入 runtime mainline，不声明 target、compile、self-test 或 evidence ready。 |
| `Q-MS-009` carrier / orchestration / registry adapter capability、correlation、qualification 与 unknown boundary | CMP-MS-02 / 03 / 06；adapter config、attempt / association / cleanup / reconciliation | 只固定中立 adapter result 和 fail-closed 类别；不锁产品 / 协议 / backend state machine，fake 不证明真实 backend。 |
| `Q-MS-010` Bus / Observability / consumer producer、source、route、receipt 与 feedback owner | CMP-MS-07；outbox / handoff、safe material、delivery / observation / acceptance layers | 只形成 body-free material、local attempt / submitted / gap；external outcome 继续 blocked，不以 publish accepted / log written 推断 delivered / observed。 |
| `Q-MS-011` workload、并发规模、健康窗口、容量和性能目标的 environment / measurement authority | 三运行角色、health / Job / config、04~07 downstream | 只保留结构性 guard 和测量维度；不使用旧数字，未有 authority / evidence 前不得声明性能、容量或 readiness 通过。 |

## 5. Owner、关闭条件与 positive ceiling

| 待确认项 | 确认 owner / 待确认方 | 关闭条件 | 关闭前 positive ceiling |
|---|---|---|---|
| Q-MS-001 | `L2-runtime` 与本仓双侧 | 正式 surface、failure、compatibility 双侧一致并停审 | host-side placeholder only |
| Q-MS-002 | `L2-member` 与本仓双侧 | fields、IPC、credential、late / replay 与 integration contract 正式闭口 | requirement owner split only；当前并行稿不可用 |
| Q-MS-003 | `L2-member-images` 与本仓双侧 | pinned supply ref / safe manifest / qualification / confirmation 双侧闭口 | supply direction / typed ref only；当前并行稿不可用 |
| Q-MS-004 | `L4-sandbox` 与本仓双侧；caller owner待定 | binding / release / cleanup / receipt / caller 正式闭口 | host-side binding / cleanup ports only |
| Q-MS-005 | demand authority / owner pending | owner 与当前范围形成正式结论 | no capability / no dependency |
| Q-MS-006 | credential authority pending | issuer / revoker / verifier / safe ref contract 正式闭口 | opaque instance-bound ref only |
| Q-MS-007 | `L0-core` authority | minimal types / envelope / event family 正式发布并兼容复核 | category reference only |
| Q-MS-008 | `L0-sdk` authority 与本仓 consumer | compile target / Server test surface 正式闭口 | limited compile boundary only |
| Q-MS-009 | infrastructure adapter owner pending | capability / failure / correlation / unknown / qualification contract 闭口 | neutral adapter / fake seam only |
| Q-MS-010 | Bus、Observability 与具体 consumer owner | source / route / receipt / feedback 各 owner 正式闭口 | local material / attempt / gap only |
| Q-MS-011 | workload / product / test / acceptance authority pending | scene、environment、metric definition 与真实 evidence owner闭口 | structural guard / measurement dimension only |

## 6. Blocker 分层与进入 03 的影响

| 层级 | 项目 | 当前结论 |
|---|---|---|
| 不阻塞正式 02 成文 | Q-MS-001~011 | 本地对象、接口、流程、状态和 fail-closed 结构已完整；02 可诚实表达 placeholder 与 positive ceiling。 |
| 阻塞 exact contract / adapter / schema 闭口 | Q-MS-001~004、006~010 | 03 可写 host-side skeleton / placeholder / fake negative seam，不得单方写 exact 对端 API / schema 或 positive ready。 |
| 阻塞具体配置 / 测试 / 验收 / 实施 readiness | Q-MS-001~004、006~011 | 真实合同、环境与证据前，04~07 不得生成 positive artifact、report、evidence、verdict、signoff 或 readiness。 |
| 当前无功能 blocker | Q-MS-005 | policy 传递不在当前范围；不得为“未来可能”预建模块 / 配置。 |
| 必须重开正式设计 | 正式 owner 否定当前 truth boundary；policy / 非项目型 / E01~E04 进入核心；任何 VF 红线要求被允许 | 先回退 00 / 01，再重走受影响 02 Step；不能在 03 局部补丁。 |
| 当前范围 resolved | MSVC-UP-009 | 本版 ProjectMember-only；不表示非项目型 contract 已存在。 |

## 7. 不属于风险 / 待确认的内容

| 内容 | 处理位置 | 原因 |
|---|---|---|
| 29 对象的完整字段、函数、repository 和 transaction | Step 12 -> 03 | 已是稳定承接方向，不是未定主语。 |
| 错误码、retry / timeout、batch / cursor 和配置 key | 03 / 04 | 属于实现与配置展开，不在概要风险层预支。 |
| 测试用例、验收执行、实施任务和排期 | 05~07 | 属于后续正式文档，不是设计 Q。 |
| E01~E04 的开发与优化 | 未来正式范围变更 | 当前是扩展边界，不是核心缺陷或当前 blocker。 |
| `MSVC-UP-009` 当前项目型范围 | resolved | 已有正式范围结论；未来变化须重开，不继续挂 Q。 |

## 8. 正式第 13 章回填草稿

正式 §13 应保留一张设计风险表和一张待确认事项表。风险可压缩为 owner / qualification、generation / state、local / external outcome、entry writer、forbidden body、dependency / product / config、historical pollution 和 scope creep 八族；待确认继续逐项保留 Q-MS-001~011，并至少写明影响范围与当前挂起口径。

正文必须说明：这些开放项不阻塞正式 02 说明本仓结构，但持续阻塞受影响 exact contract、正向 qualification、真实集成、测试 / 验收 evidence 和 readiness。并行 sibling 当前讨论不能单方关闭 Q-MS-002 / 003。

## 9. Gate 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 风险 / Q 分离 | pass | 13 条已知危害与 11 条待 owner / contract / authority 的问题分别成表。 |
| 影响范围 | pass | 每项均回指 CMP、对象、接口、流程、状态、配置或下游。 |
| 当前处理 / 挂起口径 | pass | 无“以后再说”；均有 fail-closed、placeholder、blocked / waiting 或回退规则。 |
| 稳定承接未重复成 Q | pass | 03 的字段 / UoW / error / test 方向留在 Step 12。 |
| sibling WIP 效力 | pass | 并行 `L2-member` / `L2-member-images` 不提供 exact contract 或 ready 证明。 |
| blocker 分层 | pass | 02 成文、exact contract、04~07 readiness 与必须重开设计分开。 |
| 任务 / TODO 排除 | pass | 未写 backlog、开发排期、实施方案或运维操作。 |
| 正式文档写入 | pass | 未修改旧正式 02；Step 14 尚未创建。 |

```text
step_13_status = completed
step_13_gate = pass
risks = 13
open_questions = 11
formal_02_write_allowed = true_for_step_14_only
next_allowed_step = Step 14 formal_document_assembly
```
