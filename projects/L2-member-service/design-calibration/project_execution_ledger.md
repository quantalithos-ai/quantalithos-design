# L2-member-service 项目执行台账

> 依据: `standards/document/设计文档讨论中间产物规范.md` §3.4.2 三层台账。
> 模式: full-restart;旧 README / 旧正式 `00/01/02/03/05/06` 为 historical_material,仅作后置差异审计输入。
> 项目窗口: Layer 3 并行窗口(`L2-member` / `L2-member-service` / `L2-member-images`);本项目内部严格 `00 -> 01 -> ... -> 07` 串行,每完成一个正式文档停审。
> 预讨论输入：`projects/L2-member-service/draft/`。2026-08-21 用户明确同意本次审计结论与修复方向；该确认不等于逐条签署 draft 结论，draft 只能作为对应 Step 的讨论输入。

## 当前恢复点

| 当前文档 | 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | 细节入口 |
|---|---|---|---|---|---|---|
| 07-实施计划.md | Step 13 formal_document_assembly | formal_assembly | `completed / pass_with_upstream_blockers; stop_review`；v1.0.2 规范补正后 Step 1~13、正式文档、implementation ledger 与 24 skeleton 已收口 | 用户已明确“继续完成全部 07”；本轮完成终审补正、正式章节装配和设计期实施交接审计。 | 停审；不创建实现源码、不运行测试、不生成真实证据、不提交 | `design-calibration/07_implementation_plan_calibration_flow.md` |

### 文档切换批准记录

| 日期 | 用户确认 | 生效范围 | 不代表 |
|---|---|---|---|
| 2026-08-22 | “完同意，帮我修复一下” | 正式 00 通过停审门禁；允许 full-restart 启动并完成 01 | 不代表批准 01 结论，不允许进入 02，不授权实现或提交 commit |
| 2026-08-23 | “同意 现在完成02” | 正式 01 通过停审门禁；允许 full-restart 启动并完成 02 | 不代表批准 02 结论，不允许进入 03，不授权实现或提交 commit |
| 2026-09-03 | 用户“继续” | 04 停审后允许进入 05，完成 Step 1~15 并装配正式 `05-测试方案.md` | 不代表批准 05 结论，不允许进入 06，不授权测试执行、实现或提交 commit |
| 2026-09-03 | 用户“同意并完成全部的 06” | 05 停审后允许连续完成 06 Step 1~15 并装配正式 `06-验收标准.md`；完成后立即停审 | 不代表验收已执行或通过，不授权实现、测试执行、真实证据生成、进入 07 或提交 commit |
| 2026-09-03 | 用户“继续完成全部 07” | 06 停审后允许连续完成 07 Step 1~13，装配正式 `07-实施计划.md`、implementation ledger 和 24 个 planned boundary skeleton；完成后立即停审 | 不代表授权实现、测试执行、真实证据生成或提交 commit |
| 2026-09-03 | 07 终审补正（本轮） | 在不改变 07 停审状态的前提下，补齐正式 §2/§3/§6/§7 的规范字段并修正 `commit-08-c` 引用；同步校准材料与台账 | 不代表重新授权实现、测试执行、真实证据生成或提交 commit |

## 文档级进度

| 文档 | flow 文件 | 状态 | 当前 Step | 文档切换门禁 | blocker |
|---|---|---|---|---|---|
| 00-需求文档 | `design-calibration/00_requirements_calibration_flow.md` | approved_architecture_baseline | Step 17 complete | user_approved_2026-08-22 | none |
| 01-架构设计 | `design-calibration/01_architecture_calibration_flow.md` | approved_hld_baseline | Step 16 completed / pass | user_approved_2026-08-23 | none_for_architecture_document；MSVC-UP-001~008 remain downstream blockers |
| 02-概要设计 | `design-calibration/02_hld_calibration_flow.md` | completed / pass_stopped | Step 14 completed / pass | user_confirmation_required_for_03 | positive paths remain bounded by MSVC-UP-001~008 and parallel sibling contracts |
| 03-详细设计 | `design-calibration/03_ddd_calibration_flow.md` | completed / pass_with_upstream_blockers; stop_review | Step 19 completed after full-restart assembly and audit | Formal 03 is the current stopped document; no transition to 04 without explicit user confirmation. | `MSVC-UP-001~008` remain pending / blocked；cursor exact types, transport codes, storage/lease product, config defaults, observability backend and delivery contracts remain pending；正文只能写 placeholder / fail-closed。 |
| 04-配置设计 | `design-calibration/04_config_calibration_flow.md` | completed / pass_with_upstream_blockers; stop_review | Step 15 completed | formal_04_stop_review_completed；正式 `04` 已装配并完成最终审计 | `MSVC-UP-001~008` 等上游 exact contract 与配置产品 / 数值仍 pending；仅真实正向集成受阻 |
| 05-测试方案 | `design-calibration/05_test_plan_calibration_flow.md` | completed / pass_with_upstream_blockers; stop_review | Step 15 completed | user_confirmation_required_for_06；正式 `05` 已装配并完成最终审计 | `MSVC-UP-001~008`、cursor exact type、真实产品 / 性能 authority、观测后端仍 pending / blocked / waiting |
| 06-验收标准 | `design-calibration/06_acceptance_calibration_flow.md` | completed / pass_with_upstream_blockers; stop_review | Step 15 completed | formal_06_stop_review_completed; user authorized 07 | 正式 06 已装配并完成总审计；MSVC-UP-001~008 等正向合同仍 pending / blocked / waiting |
| 07-实施计划 | `design-calibration/07_implementation_plan_calibration_flow.md` | completed / pass_with_upstream_blockers; stop_review | Step 13 completed | formal_07_stop_review_completed | `MSVC-IMPL-001`、`MSVC-UP-001~008` 等实现前 blocker 仍 pending/blocked/waiting |

## 全局 blocker / 跨项目 pending

| ID | 内容 | 状态 | 当前约束 |
|---|---|---|---|
| MSVC-UP-001 | Runtime 逻辑入口与宿主触发 / 会话 surface(对端 `Q-L2R-001`) | open_boundary | 本仓只定义宿主侧语义,不替 runtime 定义 entry |
| MSVC-UP-002 | `L2-member` launch / register / heartbeat / status 合同 | requirement_boundary_formally_stopped；detailed_contract_pending | 对端正式 00 已完成停审；可正式消费“member 拥有请求 / 信号 / 报告，本仓拥有接受 / registry / session / 健康判定”的需求级分工；字段、协议、凭据形态与真实联调仍 pending |
| MSVC-UP-003 | `L2-member-images` pinned image ref / manifest / digest / verification / provenance 消费合同 | requirement_boundary_formally_stopped；detailed_contract_pending | 对端正式 00 已停审；可正式消费 supply availability 与 pinned instantiable entry 供给方向。双方 exact manifest / variant / ref / confirmation contract 仍由 `MSVC-UP-003` / `MI-UP-001` 挂起；本仓不直接解析 method-library role/image mapping，引用不可验证则 launch blocked |
| MSVC-UP-004 | 宿主级 `SandboxBinding` / bind / release / failure / cleanup refs 与非工具维护动作 caller | upstream_forward_schema_pending | 字段级 pending；逐动作工具 execute 明确归 tools / runtime 正式边界，不归本仓 |
| MSVC-UP-005 | policy 到宿主传递路径 owner | owner_pending | 待确认;传递事实与策略 truth 分层前提下讨论 |
| MSVC-UP-006 | launch credential 签发 / 撤销 owner | owner_pending | 需求先锁"可撤销、不复用、可审计"语义 |
| MSVC-UP-007 | member-service-specific Core schema / event family | schema_pending | 只引用类别,不本地 shadow |
| MSVC-UP-008 | `L0-sdk` 的准确编译 dependency target / Server 自测试方式 | baseline_applied_scope_pending | 按全局矩阵保留 compile 基线；01 / 03 收敛准确形态，不得解释为运行期宿主主链依赖 |
| MSVC-UP-009 | 本版是否要求非 ProjectMember-scoped 宿主及其第三种正式执行主语 | resolved_for_current_scope | 用户于 2026-08-21 明确同意项目型-only；当前仅以 ProjectMemberRef 为执行主语、GlobalMemberRef 为身份锚。非项目 launch fail closed；未来如纳入，须先由正式 ADR / 上游合同定义主语并重开 C-MS-1。 |

## 执行纪律确认(2026-08-20 启动)

| 项目 | 记录 |
|---|---|
| 已读取通用规范 | yes(通则 / 中间产物规范 / 真相源标准 / 全局依赖裁剪规则) |
| 已读取文档类型规范 | yes(需求、架构、概要、配置、测试、验收规范；实施计划讨论流程_SOP / 实施计划书写规范 / 代码实施台账与门禁规范；Rust 编码规范 / 子项目目录与代码文件组织规范) |
| 已读取项目输入 | yes(L2-runtime / L2-tools 正式 00~07，L1-identity / L1-work、L4-sandbox、L0-core / L0-bus / L0-sdk 当前正式边界，L1-governance / L1-artifact 粒度参考，兄弟项目台账、旧文档、draft/；07 生成前复核正式 00~06 与目标实现仓路径；2026-08-22 Step 17 终审刷新确认 L2-member 与 L2-member-images 正式 00 均已停审，可消费需求级 owner / supply 分工；双方详细合同仍 pending) |
| 当前模式 | full-restart |
| 执行纪律 | 逐 Step 独立落盘;Step 内小阶段完整;旧材料后置差异审计;单批 100~300 行;正式正文只写收口结论;每正式文档完成后停审;配置域 / 配置项按 SOP 独立停审 |
| 提交纪律 | 未经用户明确要求不提交 commit |

## 当前停审结论

```text
current_document = 07-实施计划.md
current_step = Step 13 formal_document_assembly
    current_module = formal_document_assembly
    step_13_status = completed / stop_review
    test_plan_step_01_status = completed / pass_with_upstream_blockers
    test_plan_step_02_status = completed / pass_with_upstream_blockers
    test_plan_step_03_status = completed / pass_with_upstream_blockers
    test_plan_step_04_status = completed / pass_with_upstream_blockers
    test_plan_step_05_status = completed / pass_with_upstream_blockers
    test_plan_step_06_status = completed / pass_with_upstream_blockers
    test_plan_step_07_status = completed / pass_with_upstream_blockers
    test_plan_step_08_status = completed / pass_with_upstream_blockers
    test_plan_step_09_status = completed / pass_with_upstream_blockers
    test_plan_step_10_status = completed / pass_with_upstream_blockers
    test_plan_step_11_status = completed / pass_with_upstream_blockers
    test_plan_step_12_status = completed / pass_with_upstream_blockers
    test_plan_step_13_status = completed / pass_with_upstream_blockers
    test_plan_step_14_status = completed / pass_with_upstream_blockers
    test_plan_step_15_status = completed / pass_with_upstream_blockers
    acceptance_step_01_status = completed / pass
    acceptance_step_02_status = completed / pass
    acceptance_step_03_status = completed / pass
    acceptance_step_04_status = completed / pass
    acceptance_step_05_status = completed / pass
    acceptance_step_06_status = completed / pass
    acceptance_step_07_status = completed / pass
    acceptance_step_08_status = completed / pass
    acceptance_step_09_status = completed / pass
    acceptance_step_10_status = completed / pass_with_upstream_blockers
    acceptance_step_11_status = completed / pass_with_upstream_blockers
    acceptance_step_12_status = completed / pass_with_upstream_blockers
    acceptance_step_13_status = completed / pass_with_upstream_blockers
    acceptance_step_14_status = completed / pass_with_upstream_blockers
    acceptance_step_15_status = completed / pass_with_upstream_blockers
    implementation_plan_step_01_status = completed / pass_with_upstream_blockers
    implementation_plan_step_02_status = completed / pass_with_upstream_blockers
    implementation_plan_step_03_status = completed / pass_with_upstream_blockers
    implementation_plan_step_04_status = completed / pass_with_upstream_blockers
    implementation_plan_step_05_status = completed / pass_with_upstream_blockers
    implementation_plan_step_06_status = completed / pass_with_upstream_blockers
    implementation_plan_step_07_status = completed / pass_with_upstream_blockers
    implementation_plan_step_08_status = completed / pass_with_upstream_blockers
    implementation_plan_step_09_status = completed / pass_with_upstream_blockers
    implementation_plan_step_10_status = completed / pass_with_upstream_blockers
    implementation_plan_step_11_status = completed / pass_with_upstream_blockers
    implementation_plan_step_12_status = completed / pass_with_upstream_blockers
    implementation_plan_step_13_status = completed / stop_review
    gate_status = step_13_completed / stop_review
next_allowed_action = stop_review
formal_02_write_allowed = false_after_stop_review
formal_03_write_allowed = false_after_step_19_stop_review
formal_03_stop_review = completed
next_formal_document = none; 07 is current stopped document
next_formal_document_allowed = no automatic transition
formal_04_write_allowed = completed
formal_04_stop_review = completed; waiting_for_user_review
formal_05_write_allowed = completed
formal_05_stop_review = completed; waiting_for_user_review
formal_06_write_allowed = completed
formal_06_stop_review = completed; waiting_for_user_review
implementation_allowed = false; target repo absent and user did not authorize implementation
test_execution_allowed = false
commit_allowed = false
implementation_ledger = created_planned_not_started
boundary_skeletons = 24_created; commit-01-a current blocked; 23 planned wait_until_current
```

> 以下 04 配置 Step 与早期详细设计记录保留为历史执行轨迹；其历史状态不覆盖本台账顶部“当前恢复点”和“当前停审结论”。

### Step 2 配置范围停审记录（2026-09-02，历史）

| 项目 | 记录 |
|---|---|
| 用户确认 | 本轮用户“继续”作为 Step 1 停审后的明确确认，允许进入 Step 2；不授权进入 Step 3 或正式 `04` |
| 已完成范围 | 配置设计目标、P0 / P1 / P2 配置口径、覆盖范围、非范围、无配置路径判定、下游去向和详细设计影响判定 |
| 配置项目判定 | `configuration_required = true`；本仓不是无配置项目，Step 3~13 适用 |
| P0 上限 | 仅 local / fake / in-memory / deterministic / placeholder / disabled / blocked 条件下的 host-side 语义可装配、可判定和可测试；不代表真实 sibling / backend readiness |
| P1 / P2 | P1 记录 durable / real-like / handoff / observability / secret 等产品化承接；P2 记录多区域、多租户、容量和深度集成演进；均未锁具体产品或数值 |
| 详细设计回写 | 当前无回写；若后续配置结论改变 `03` 的 runtime config、builder、adapter、Port、DTO、error、函数流或 owner，必须暂停并回写 |
| 未闭合 blocker | `MSVC-UP-001~008`、cursor exact type、durable / observability / DLQ 产品、measurement authority、policy / credential owner 继续 pending / blocked / waiting |
| 正式文档与实现 | 正式 `04-配置设计.md` 尚未创建；无实现、测试结果、artifact、report、evidence、verdict、signoff、readiness 或 commit |
| 停审后下一动作 | `stopped_waiting_for_user_explicit_confirmation_for_step_03` |

### Step 3 开工门禁（2026-09-02）

| 项目 | 记录 |
|---|---|
| 用户授权 | 用户最新“完成全部的 04”明确授权本轮继续 Step 3~15；正式 `04` 仍只在 Step 15 装配 |
| 当前模块 | `control_plane` |
| 已读取输入 | 项目 ledger、04 flow、Step 1/2、00/01/02/03、03 Step 14、配置 SOP / 书写规范、L1-governance 参考 |
| 写入前检查 | 项目级 gate 允许；文档级 Step 3 允许；模块骨架已完成；本次只写 Step 3 中间产物，不写正式正文 |
| 正文污染检查 | no |
| 下一门禁 | Step 3 自检通过后更新 flow/ledger，再进入 Step 4 |

### Step 3 完成与 Step 4 开工记录（2026-09-02）

| 项目 | 记录 |
|---|---|
| Step 3 结果 | `completed / pass_with_upstream_blockers`；来源链、`infra/config.rs -> runtime_builder` 装配入口、控制面、功能域、允许/禁止能力和跨控制面审计均已收口 |
| 详细设计影响 | 当前无回写；未来 hot reload、动态 adapter replacement、新字段或新构造参数仍需先回写 `03` |
| 用户授权 | “完成全部的 04”继续覆盖 Step 4~15；本记录不代表外部合同 ready |
| Step 4 开工 | 已读取本 ledger、04 flow、Step 3、配置 SOP / 书写规范和 L1-governance 对应材料；开始分类与禁止配置化边界 |
| 正式 `04` | 仍未创建；只允许在 Step 15 装配 |

### CMP-MS-06 完成记录（2026-09-01）

| 项目 | 记录 |
|---|---|
| 已完成范围 | `contracts 6.1-k` 的 local id / ref / revision / homogeneous-set carrier closure，以及 `domain / CMP-MS-06` 的 `HostClosure`、`CleanupAttempt`、`ResidualFinding`、`ReconciliationCase` 对象契约。 |
| 已审计 | capability-to-object、字段来源、factory / method、四轴状态、authority、cleanup 与 action-attempt 因果隔离、same-key / target / correlation fence、formal-versus-Job authority、future Step 7 seam。 |
| 不可推导 | `HostClosureDecisionRef` 仅为 closure candidate；local closure、cleanup success、finding resolved、case resolved 彼此不等价，且均不表示 Runtime stop、Sandbox / carrier release 或外部 cleanup completed。 |
| 未闭合输入 | `MSVC-UP-001~008`、Runtime / Member / Images / Sandbox / Core / Bus / SDK exact schema，以及 `HostChangeCursor` / `CommittedChangeCursor` 命名差异继续 pending / blocked。 |
| 停审与边界 | `CMP-MS-06 = completed / pass_with_upstream_blockers`。本记录不创建 Step 7、正式 `03-详细设计.md`、实现、测试、证据、signoff、readiness 或 commit；进入 `CMP-MS-07` 须另有用户明确确认。 |

### CMP-MS-07 完成与停审记录（2026-09-02）

| 项目 | 记录 |
|---|---|
| 已完成范围 | `6.1-l` shared local carrier corrective closure，以及 `domain / CMP-MS-07` 的 `HostFactMaterial`、`HostHandoffRecord`、`HostProjectionState`、`HostOutboxRecord`、`HostHistoryEntry` 对象契约与既有 `SafeHostView` consumption boundary。 |
| owner 收口 | material / handoff -> `domain/src/material.rs`；projection -> `domain/src/projection.rs`；outbox -> `domain/src/outbox.rs`；history -> `domain/src/history.rs`；`SafeHostView` -> `contracts/src/views.rs`；shared id/ref/key/revision -> `contracts/src/refs.rs`。不创建 `handoff.rs` / `publication.rs`。 |
| cursor 与 feedback | `HostChangeCursor` / `CommittedChangeCursor` exact type 继续 pending；`submitted`、`delivered`、`observed`、`accepted` 四层独立，不互推。 |
| 用户授权 | 用户本轮“继续”仅授权在该停审后进入 application 对象组 **preflight**；不构成 application 对象卡写入、Step 7、正式 `03-详细设计.md`、实现、测试、证据、signoff、readiness 或 commit 的授权。 |
| 开放 blocker | `MSVC-UP-001~008` 均保持 open / pending / blocked；尤其 `MSVC-UP-007` event family / delivery / receipt exact contract 不得伪造 ready。 |

`cmp_ms_07_status = completed / pass_with_upstream_blockers`
`cmp_ms_07_stop_review = completed`
`preflight_authorization_at_entry = application_object_group_preflight`

### Application 对象组 preflight（2026-09-02）

| 审计项 | 当前结论 | 唯一 owner / 允许上限 |
|---|---|---|
| facade 与 use-case assembly | completed / pass | `application/src/services.rs` 是唯一 facade / use-case assembly owner；只组装 use-case 与 ports，不拥有 domain truth、不实现 infra。 |
| command-side materialization | completed / pass_with_upstream_blockers | `application/src/use_cases/materialization.rs` 只编排已提交 local material / history / outbox / handoff，不定义 publication route、feedback receipt或 cursor。 |
| read-side assembly | completed / pass | `application/src/use_cases/read.rs` 是唯一 `SafeHostView` / history page application assembly seam，严格 query no-write。 |
| transaction / UoW helper | completed / pass_with_upstream_blockers | `application/src/transactions.rs` 与 `ports/unit_of_work.rs` 只承接 local read/write-set 与 UoW 编排边界；expected-version / commit proof仍待后续 Step 7/11。 |
| idempotency / stored result | completed / pass_with_upstream_blockers | `application/src/idempotency.rs` 只拥有 operation context、digest、reservation / decision和stored-result shell；durable store仍归 `infra/persistence/idempotency_store.rs`。 |
| mapping / error boundary | completed / pass_with_upstream_blockers | `application/src/mappers.rs`、`application/src/errors.rs` 只做 contracts↔domain / port-neutral映射，不 shadow sibling DTO 或 external error body。 |
| job helper | completed / pass_with_upstream_blockers | `application/src/jobs.rs` 只选择已提交 local work 并组装 application job result，不把 scheduler trigger写成 lifecycle decision。 |
| current gaps | blocked_by_exact_contracts | `MSVC-UP-001~008`、cursor exact type、Core/Bus route/envelope/receipt、Member/Images/Sandbox/Runtime mapper 均继续 pending；application 不得自行补 schema。 |

当前已完成 preflight stop-review，尚未写 application 对象卡；下一步必须在用户明确确认后，按 `services -> use_cases/materialization -> use_cases/read -> transactions/idempotency -> mappers/errors -> jobs` 小循环逐组收口并停审。

### Application 对象组 preflight 停审（2026-09-02）

| 项目 | 记录 |
|---|---|
| 已完成范围 | 已复核 Step 4 / 5 与 02 承接清单，确认 facade、command-side materialization、read-side assembly、transaction / UoW、idempotency / stored result、mapper / error、job helper 的唯一 owner、stable-carrier 分类和禁止越界项。 |
| 结论 | `application_preflight_status = completed / pass_with_upstream_blockers`；该结论只固定后续对象卡落点，不表示 application carrier、port、adapter、durability 或上游合同 ready。 |
| 未闭合边界 | `MSVC-UP-001~008`、`HostChangeCursor` / `CommittedChangeCursor` exact type、Core/Bus route/envelope/receipt、Member / Images / Sandbox / Runtime exact mapper继续 pending / blocked。 |
| 用户门禁 | application 对象卡尚未获授权；须用户明确确认后按 `services -> materialization -> read -> transactions/idempotency -> mappers/errors -> jobs` 逐组写入，每组完成立即停审。 |
| 禁止动作 | 不创建 Step 7、不修改正式 `03-详细设计.md`、不实现代码、不生成测试结果 / artifact / evidence / signoff / readiness，不提交 commit。 |

### Step 12 错误模型与恢复停审（2026-09-02）

| 项目 | 记录 |
|---|---|
| 已完成范围 | Domain / application / port / API / worker / job 错误分层；Command、Query、Consumer、Outbox、Operations Job 映射；rollback、retryable、blocked、hold/reconcile、manual recovery；unknown/late/gap 与 query no-write 规则。 |
| 结论 | `step_12_status = completed / pass_with_upstream_blockers`；稳定 disposition 与副作用边界已固定，具体传输数字码、DLQ、retry 数值和上游 exact error contract 仍 pending。 |
| 未闭合边界 | `MSVC-UP-001~008`、`HostChangeCursor` / `CommittedChangeCursor`、Core/Bus envelope/receipt、Member/Images/Sandbox/Runtime adapter error contract 继续 pending / blocked。 |
| 下一步 | 进入 Step 13 `concurrency_idempotency`；正式 `03-详细设计.md` 仍禁止写入，直至 Step 19。 |
| 禁止动作 | 不把 timeout/receipt/adapter exception 写成成功，不重建缺失 sidecar，不修改兄弟项目，不实现代码或提交 commit。 |

### Step 13 并发、幂等与重入停审（2026-09-02）

| 项目 | 记录 |
|---|---|
| 已完成范围 | optimistic `HostRevision`、single-active/current pointer、generation/effect/publication/handoff key fence；Command/Consumer/Job idempotency namespace 与 digest；same/different digest、in-flight、duplicate replay、commit unknown、outbox/projection/reference/handoff 重入。 |
| 结论 | `step_13_status = completed / pass_with_upstream_blockers`；重复处理不产生第二次 mutation，unknown 保留原 key；lease/lock 产品、具体 hash/retention 数值与上游 delivery contract 仍 pending。 |
| 未闭合边界 | `MSVC-UP-001~008`、cursor exact type、Core/Bus envelope/receipt、Member/Images/Sandbox/Runtime positive mapper继续 pending / blocked。 |
| 下一步 | 进入 Step 14 `config_dependencies`；正式 `03-详细设计.md` 仍禁止写入，直至 Step 19。 |
| 禁止动作 | 不以 fake、timeout、broker offset、scheduler retry 或新 effect key 绕过幂等/并发保护；不提交 commit。 |

### Step 14 配置引用与外部依赖绑定完成记录（2026-09-02）

| 项目 | 记录 |
|---|---|
| 已完成范围 | 配置读取层、typed validated binding、logical store / adapter / publisher / handoff / clock / id / entry 绑定点、compile/runtime/event/ref/adapter/fake 分类和 runtime builder 顺序。 |
| 结论 | `step_14_status = completed / pass_with_upstream_blockers`；配置不能改变 Host Truth owner、ProjectMember 主语、状态、幂等、审计、Query no-write 或 Job no-authorization。 |
| 未闭合边界 | `MSVC-UP-001~008`、cursor exact type、Core/Bus route/envelope/receipt、具体存储/消息/观测产品、key/default/secret/endpoint 数值继续 pending / blocked；完整配置真相留给后续 `04-配置设计.md`。 |
| 下一步 | 进入 Step 15 `observability_audit`；正式 `03-详细设计.md` 仍禁止写入，直至 Step 19。 |
| 禁止动作 | 不在本步伪造 sibling endpoint/schema、secret、部署产品、SLO、测试结果、实现仓或 commit。 |

### Step 15 可观测性与审计埋点完成记录（2026-09-02）

| 项目 | 记录 |
|---|---|
| 已完成范围 | 入口、application、UoW/repository、resolver、consumer、publisher、handoff、projection、reconciliation、job、config 的结构化日志和低基数指标；accepted audit、trace/correlation 传播及 forbidden-body 脱敏基线。 |
| 结论 | `step_15_status = completed / pass_with_upstream_blockers`；业务审计继续复用 HostHistory/Material/Handoff/Outbox/Projection/Job marker，观测记录不新增 truth owner。 |
| 未闭合边界 | 观测 backend、SLO、采样/保留、DLQ/diagnostic store、Core/Bus trace envelope 和 Runtime/Member/Sandbox feedback 继续 pending / blocked。 |
| 下一步 | 进入 Step 16 `test_cut`；正式 `03-详细设计.md` 仍禁止写入，直至 Step 19。 |
| 禁止动作 | 不把日志、metric、trace、receipt、adapter `Ok` 或 submitted 推导为 ready/healthy/delivered/observed/accepted，不记录 raw body、secret 或外部正文。 |

### 04 配置 Step 5~7 连续执行记录（2026-09-02，历史）

| Step | 状态 | 主要产物 | 详细设计影响 | 下一步 |
|---|---|---|---|---|
| Step 5 来源 / 优先级 / 冲突 | completed / pass_with_upstream_blockers | 普通来源 `defaults < JSON file < env`、局部来源隔离、冲突与不可用策略 | 当前 P0 无回写；future remote/admin/hot reload 需先回写 `03` | Step 6 |
| Step 6 环境 / profile / 矩阵 | completed / pass_with_upstream_blockers | 四个 P0 profile、两个 future profile、依赖 / 来源 / 测试承接矩阵 | 当前 P0 无回写；真实产品与新 profile 仍 future | Step 7 |
| Step 7 配置项清单 | 历史状态：in_progress / pass_with_upstream_blockers | 功能域配置项十列、模块 JSON demo、完整 JSONC demo | 当时尚未写正式 `04`；新增代码契约仍禁止 | 后续已完成 Step 7 并进入 Step 8 |

上述段落是 2026-09-02 的历史快照；当时正在写入 `04_config_step_07_config_items.md`。所有上游未闭合合同继续保持 pending / blocked / placeholder；没有实现、测试结果、artifact、evidence、signoff、readiness 或 commit。

### 04 配置 Step 8 完成与 Step 9 开工（2026-09-02，历史）

| Step | 状态 | 主要产物 | 详细设计影响 | 下一步 |
|---|---|---|---|---|
| Step 8 敏感配置与密钥管理 | completed / pass_with_upstream_blockers | 敏感配置总表、profile 处理、禁止输出、rotation / revoke 和泄露审计 | 当前 P0 无回写；future provider / online rotation 需先回写 `03` | Step 9 |
| Step 9 加载 / 校验 / 生效 | 历史状态：in_progress / pass_with_upstream_blockers | 将固定 parse、type validation、cross-field validation、builder activation 和失败策略 | 当时尚未写正式 `04`；新增 reload / provider API 禁止 | 后续已完成 Step 9 并进入 Step 10 |

### 04 配置 Step 9~15 完成与正式文档停审记录（2026-09-03，历史）

| 项目 | 记录 |
|---|---|
| Step 9~14 | 均为 `completed / pass_with_upstream_blockers`；对应校准材料已完成并作为正式 §9~§14 输入 |
| Step 15 | `completed / pass_with_upstream_blockers`；正式 `04-配置设计.md` 已创建、修订并完成最终审计 |
| 最终校准 | carrier 仅保留 `carrier_binding.availability` marker；与 Member / Images / Runtime / Sandbox 的 ref-bearing lifecycle seam 分开；Step 3 / §7 聚合伪 key 已改为 ref-bearing binding 集合表述 |
| 上游 blocker | `MSVC-UP-001~008`、cursor exact type、Core/Bus route/envelope/receipt、具体存储/观测/provider 产品和数值继续 pending / blocked / placeholder；不得写成 ready |
| 详细设计回写 | 当前 P0 无回写；future remote/admin/hot/reload、dynamic adapter、provider health 或新 public schema 仍需先回写 `03` |
| 实现与证据 | 未实现代码、未执行测试、未生成 artifact/report/evidence/verdict/signoff/readiness，未提交 commit |
| 文件范围 | 仅修改 `projects/L2-member-service/` 下正式配置文档与校准材料；兄弟项目未修改 |
| 当时停审 | `formal_04_stop_review = completed; waiting_for_user_review`；随后已获用户“继续”进入 `05-测试方案.md` |

### 05 测试方案 Step 1~15 完成与正式文档停审记录（2026-09-03）

| 项目 | 记录 |
|---|---|
| 用户授权 | 用户“继续”作为 04 停审后的文档切换确认，允许进入 05；不代表批准 05 结论，不授权执行测试、实现或提交 commit |
| Step 1~14 | 均为 `completed / pass_with_upstream_blockers`；对应校准材料已完成并回填正式 §1~§14 |
| Step 15 | `completed / pass_with_upstream_blockers`；正式 `05-测试方案.md` 已装配并完成只读终审 |
| 测试分母 | 7 个实现模块、29 个业务对象、10 个 Command、6 个 Query、5 个 Inbound Consumer、1 个 `HostFactMaterialEventCandidate`、7 个 Operations Job；未引入伪造 outbound event 数量 |
| 测试边界 | control plane、Host Truth、runtime session、execution handoff 分层；Query no-write、Job no-truth-repair、generation/key fence、immutable material、redaction 和 dependency boundary 均有 planned 用例与门禁 |
| 证据边界 | `EV-MS-*`、`artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` 只作为 planned 结构；未生成真实 run、artifact、report、evidence、verdict、signoff 或 readiness |
| 上游 blocker | `MSVC-UP-001~008`、cursor exact type、Core/Bus route/envelope/receipt、Member/Images/Runtime/Sandbox exact mapper、durable store / observability backend、性能 authority 继续 pending / blocked / waiting |
| 详细设计回写 | 当前未发现需要回写 `03/04` 的 P0 漂移；若后续 schema、state、phase、config、redaction 或 gate 改变，按 §14 重新回归并回写受影响 Step |
| 当前停审 | `formal_05_stop_review = completed; waiting_for_user_review`；未经用户明确确认不得进入 `06-验收标准.md` |
| 禁止动作 | 不创建 `06` calibration flow，不实现代码，不运行测试，不生成真实执行材料，不修改兄弟项目，不提交 commit |

### 06 验收标准 Step 1~15 完成与正式文档停审记录（2026-09-03）

| 项目 | 记录 |
|---|---|
| 用户授权 | 用户明确“同意并完成全部的 06”，允许本轮连续完成 Step 1~15；不授权实现、测试执行、真实证据生成、进入 07 或提交 commit。 |
| Step 1~14 | 均为 `completed / pass_with_upstream_blockers`；每步均保留输入边界、问题回答、诊断、取舍、结构化产物、回填草稿、待确认事项和停审门禁。 |
| Step 15 | `completed / pass_with_upstream_blockers`；正式 `06-验收标准.md` 已按规范装配 15 章并完成跨章节总审计。 |
| 验收分母 | `AC-MS-001~039`、`VF-MS-001~009`、5 个核心闭环、10 Command、6 Query、5 Consumer、1 个 `HostFactMaterialEventCandidate`、7 个 Operations Job。 |
| 证据边界 | 仅固定 `05 §13.2` 的 14 个 `EV-MS-*-001`、`artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance/*` 未来入口；当前无真实 run、artifact、report、evidence、defect、verdict、signoff 或 readiness。 |
| 关键红线 | Query no-write、Job no-truth-repair、generation / key fence、immutable material、四层 handoff、redaction、dependency 和 report audit 已在正式 06 固定。 |
| 上游 blocker | `MSVC-UP-001~008`、cursor exact type、Core/Bus route/envelope/receipt、Member/Images/Runtime/Sandbox mapper、具体 provider / observability / 性能 authority 继续 pending / blocked / waiting。 |
| 详细设计回写 | 本轮未发现需要回写 `03` 或 `04` 的 P0 漂移；若后续改变 schema、state、phase、config、redaction 或 gate，必须重新打开受影响 Step 并生成新基线。 |
| 当前停审 | `formal_06_stop_review = completed; waiting_for_user_review`；本结论只表示验收标准设计 / 校准合同完成，不表示验收执行或交付通过。 |
| 下一步 | 等待用户明确授权进入 `07-实施计划.md`；本轮不创建 implementation ledger、planned boundary skeleton 或任何实现 / 测试材料。 |

### 07 实施计划 Step 1~13 完成与正式文档停审记录（2026-09-03）

| 项目 | 记录 |
|---|---|
| 用户授权 | 用户明确“继续完成全部 07”，允许本轮连续完成实施计划 Step 1~13；不授权实现代码、测试执行、真实证据生成或提交 commit。 |
| 终审校准修正 | 复核后补齐 24 boundary 逐项经验适用性矩阵；将 P1/P2 AC-MS-018~021 从 PH-06 P0 Gate 和实现完成谓词中隔离；不改变实现台账状态或停审边界。 |
| Step 1~12 | 均为 `completed / pass_with_upstream_blockers`；每步均保留输入、SOP 问题回答、诊断、改动对比、取舍、结构化产物、回填草稿、待确认事项和下一步条件。 |
| Step 13 | `completed / stop_review`；正式 `07-实施计划.md` 已按规范装配 13 章，每章标注具体 calibration 来源。 |
| 实施分母 | 7 个 workspace 模块、29 个业务对象、10 Command、6 Query、5 Consumer、1 个 `HostFactMaterialEventCandidate`、7 个 Operations Job、8 Phase、24 Boundary、72 Task、72 Batch、24 Gate。 |
| 台账 | 已创建 `design-calibration/implementation_execution_ledger.md`；`current_boundary=commit-01-a`、`gate_status=blocked`、`next_allowed_action=wait_design`。 |
| Boundary skeleton | 已预创建 `implementation-boundaries/commit-01-a..commit-08-c.md` 共 24 个；仅 `commit-01-a` 为 current/blocked，其余 23 个为 `planned / wait_until_current`。 |
| 事实边界 | `MSVC-UP-001~008`、cursor exact type、Core/Bus route/envelope/receipt、真实 store/lease/observability/provider、目标实现仓仍 pending/blocked/waiting；未把并行兄弟未停审内容当正式 truth。 |
| 实现与证据 | 未创建目标实现仓源码，未运行测试，未生成 run、artifact、report、evidence、verdict、signoff 或 readiness，未提交 commit。 |
| 当前停审 | `formal_07_stop_review = completed`；完成 07 后停审，不自动进入实现阶段或其他正式文档。 |
