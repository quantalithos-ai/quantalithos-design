# L5-sync 项目设计讨论执行台账

> 创建日期：2026-09-20
> 当前模式：`full-restart + single-agent-serial`
> 当前任务：按 `00 → 01 → 02 → 03 → 04 → 05 → 06 → 07` 串行校准；正式 `00`～`06` 已完成并停审，正式 `07-实施计划` 已完成并停审；当前等待用户复核。
> 实施状态：`not_started / blocked`；不实现代码、不执行测试、不提交 commit。
> 单 agent 纪律：当前 agent 独立完成全部阅读、分析、写入和审计；不创建、调用或委派任何 sub-agent、worker、team 或并行代理。

## 1. 当前恢复点

| 当前文档 | 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | 细节入口 |
|---|---|---|---|---|---|---|
| `07-实施计划.md` | Step 13 | `formal_document_assembly` | pass_with_upstream_blockers | Step 1～13 已完成；正式 07、implementation ledger 和 16 个 boundary skeleton 已静态审计并停审 | `user_review_formal_07` | `design-calibration/07_implementation_plan_calibration_flow.md`、`design-calibration/07_implementation_plan_step_13_formal_assembly.md`、`design-calibration/implementation_execution_ledger.md` |

## 2. 文档级进度

| 文档 | flow 文件 | 状态 | 当前 Step | 文档切换门禁 | blocker |
|---|---|---|---|---|---|
| `00-需求文档.md` | `design-calibration/00_requirements_calibration_flow.md` | formal_stop_review | Step 17 | 正式 00 已 full-restart 重建并完成静态审计；已停审 | `SYNC-UP-001~010` |
| `01-架构设计.md` | `design-calibration/01_architecture_calibration_flow.md` | formal_stop_review | Step 16 | 正式 01 已完成并关闭写入；作为 02 的直接输入 | `SYNC-UP-001~010` |
| `02-概要设计.md` | `design-calibration/02_hld_calibration_flow.md` | formal_stop_review | Step 14 | 正式 02 已完成并关闭写入；等待用户审查 | `SYNC-UP-001~010` |
| `03-详细设计.md` | `design-calibration/03_ddd_calibration_flow.md` | formal_stop_review | Step 19 | 正式 03 已 full-restart 装配、静态审计并关闭写入；作为 04～07 的直接输入 | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` |
| `04-配置设计.md` | `design-calibration/04_config_calibration_flow.md` | formal_stop_review | Step 15 | 正式 04 已按 15 章装配并完成跨配置域总审计；写入关闭，作为 05 直接输入 | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` |
| `05-测试方案.md` | `design-calibration/05_test_plan_calibration_flow.md` | formal_stop_review | Step 15 | Step 1～15 已完成；正式 05 已 full-restart 装配并完成静态闭环审计，作为 06 直接输入 | 继承 `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` |
| `06-验收标准.md` | `design-calibration/06_acceptance_calibration_flow.md` | formal_stop_review | Step 15 | Step 1～15 已完成；正式 06 已 full-restart 装配并完成跨门禁静态审计，作为 07 直接输入 | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` |
| `07-实施计划.md` | `design-calibration/07_implementation_plan_calibration_flow.md` | formal_stop_review | Step 13 | 正式 07 已 full-restart 装配并完成静态审计；实现移交仍 blocked，等待用户复核 | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005`、`TARGET-REPO-001`、`DESIGN-BASELINE-001` |

## 3. 执行规则

| 规则 | 状态 | 说明 |
|---|---|---|
| 写入范围 | active | 只修改 `projects/L5-sync/` 下设计文档、calibration 中间产物和本项目台账。 |
| 单 agent 串行 | active | 禁止 sub-agent、worker、agent team 或并行代理。 |
| full-restart | active | README、旧正式文档和旧 draft 只作 `historical_material`，不得直接继承。 |
| 正式文档顺序 | active | 严格 `00 → 01 → 02 → 03 → 04 → 05 → 06 → 07`。 |
| Step 顺序 | active | 每个 Step 独立文件、独立门禁、独立回填草稿和自检。 |
| 不伪造事实 | active | 不写实现、commit、run、测试结果、artifact、report、evidence、verdict、signoff 或 readiness。 |
| 不提交 | active | 用户未明确要求 commit；`commit_required=false`。 |

## 4. 当前上游 blocker / pending

| ID | 内容 | 对 L5-sync 的影响 | 当前处置 |
|---|---|---|---|
| `SYNC-UP-001` | L0-sdk 精确 project/version/source/artifact/workspace/review-handoff surface、错误和版本兼容仍需逐项核验。 | 不锁 API、RPC、DTO 或方法名。 | 架构层只锁 capability port 与正式 SDK seam。 |
| `SYNC-UP-002` | Artifact 与 Workspace 哪一方提供 materialization source、版本水位、增量比较和来源优先级未统一。 | 不承诺 clone/pull 输入或全局快照。 | source binding 保持 pending/blocked。 |
| `SYNC-UP-003` | L1-work 项目权限、ProjectMember、archived/dissolved/retired posture 与允许动作矩阵需核验。 | 无法本地授权或继续归档项目写操作。 | unknown/failure fail-closed。 |
| `SYNC-UP-004` | Governance Review Gate 创建、候选上传、ACK、probe、decision ref 协议未闭合。 | ACK 不得解释为 accepted。 | 只定义 handoff 意图和外部状态读取。 |
| `SYNC-UP-005` | unknown outcome、幂等键、重试和 probe 的正式合同未闭合。 | 不得盲目重放副作用。 | prepare→call→probe/finalize 作为需求纪律。 |
| `SYNC-UP-006` | `.qs-sync` metadata 目录、schema、迁移、完整性、恢复和保留规则未闭合。 | 不锁单文件、字段或永久删除语义。 | 只要求受控 provenance metadata。 |
| `SYNC-UP-007` | Git remote、平台来源、分支/对象和本地物化关系未闭合。 | 不把 remote truth 纳入 Sync。 | Git 仅作为本地观察/适配边界。 |
| `SYNC-UP-008` | 增量 cursor、mapping、版本 comparator、gap/replay 和跨版本兼容未闭合。 | 无安全 comparator 时不能 pull。 | blocked/needs-action。 |
| `SYNC-UP-009` | Git LFS、浅克隆、GUI/Tauri 等历史选择无当前权威支持矩阵。 | 不写成当前方案或性能承诺。 | historical/pending。 |
| `SYNC-UP-010` | 用户未提交修改、路径保护、非覆盖和人工冲突决策合同需进入后续设计。 | 不得覆盖 dirty worktree。 | 需求硬规则先行；精确实现后置。 |

## 5. 历史材料登记

| 材料 | 定位 | 处置 |
|---|---|---|
| `projects/L5-sync/README.md` | `historical_material` | Rust/Tauri、固定 metadata 单文件、LFS、浅克隆、旧 RPC 名称和固定数字不直接继承。 |
| 旧正式 `00/01/02/03/05/06` | `historical_material` | 只做污染审计；跨端统一同步器、SyncTask、旧 API/状态不作为当前真相。 |
| `projects/L5-sync/draft/01~03` | `pre-calibration_input` | 作为框架线索；本轮需求 Step 重新核验后才可进入正式正文。 |

## 6. 恢复顺序

```text
1. 读取本文件
2. 读取 `design-calibration/07_implementation_plan_calibration_flow.md`
3. 确认当前 Step、模块、`gate_status` 与 `next_allowed_action`
4. 读取当前 07 Step 文件、正式 00～06 输入和 implementation ledger/boundary skeleton
5. 复核本轮 AC/VETO/evidence ceiling、`SYNC-UP-*`/`SYNC-LOCAL-*` blocker
6. 07 Step 13 已完成并停审；保持 `user_review_formal_07`，未经新授权不得进入实现、测试或 commit
```

## 7. 当前门禁

```text
formal_00_status = formal / stop_review
formal_00_write_allowed = completed
formal_01_status = formal / stop_review
formal_01_write_allowed = completed / closed
formal_02_status = formal / stop_review
formal_02_write_allowed = completed / closed
formal_03_status = formal / stop_review
formal_03_calibration_write_allowed = closed
formal_03_write_allowed = completed / closed
formal_04_status = formal / stop_review
formal_04_calibration_write_allowed = completed / closed
formal_04_write_allowed = completed / closed
formal_05_status = formal / stop_review
formal_05_calibration_write_allowed = completed / closed
formal_05_write_allowed = completed / closed
formal_06_status = formal / stop_review
formal_06_calibration_write_allowed = completed / closed
formal_06_write_allowed = completed / closed
current_document = 07-实施计划.md
current_step = 13
current_module = formal_document_assembly
gate_status = pass_with_upstream_blockers
next_allowed_action = user_review_formal_07
formal_07_status = formal / stop_review
formal_07_calibration_write_allowed = completed / closed
formal_07_write_allowed = completed / closed
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

## 8. 授权与停审记录

| 日期 | 用户指令 | 授权范围 | 不授权 |
|---|---|---|---|
| 2026-09-20 | “继续” | 在前置阅读完成后进入正式 `00`，建立 flow/Step/ledger，按 Step 1~17 full-restart 重建正式需求 | 不授权进入 `01`、代码、测试、commit 或跨项目写入 |
| 2026-09-20 | 本轮完成 | 正式 `00` 已装配并停审 | 未获得新的明确授权前不得创建 `01` calibration 或正式 `01` |
| 2026-09-20 | “继续完成全部 01” | 建立 `01` 架构 flow，按架构 SOP 完成 Step 1~16，full-restart 重建正式 `01`，完成后停审 | 不进入 `02`，不实现代码、不执行测试、不创建 implementation ledger/boundary skeleton、不提交 commit、不跨项目写入 |
| 2026-09-20 | 本轮完成 | 正式 `01` 已装配、静态审计并进入 `formal_stop_review` | 未获得新的明确授权前不得创建 `02` flow、修改正式 02 或进入实现/测试/commit |
| 2026-09-20 | “完成全部 02” | 建立 `02` 概要 flow，严格按 Step 1~14 完成中间产物，并在 Step 14 full-restart 重建正式 `02` 后停审 | 不进入 `03`，不实现代码、不运行测试、不创建 implementation ledger/boundary skeleton、不提交 commit、不跨项目写入 |
| 2026-09-21 | 本轮完成 | 正式 `02` 已 full-restart 装配、完成最终静态审计并进入 `formal_stop_review` | 未获得新的明确授权前不得读取或创建 `03` calibration；不实现代码、不运行测试、不创建 implementation ledger/boundary skeleton、不提交 commit、不跨项目写入 |
| 2026-09-21 | “完成03 的到 step4 结束后停下” | 建立 03 flow，严格完成 Step 1～4 中间产物和台账更新；Step 4 后停审 | 不进入 Step 5～19，不写正式 `03`，不实现代码、不运行测试、不创建 implementation ledger/boundary skeleton、不提交 commit、不跨项目写入 |
| 2026-09-21 | “接下来 step5 - step10 按照 projects/L1-governance 的粒度和框架”及“继续” | 严格按 Step 5→10 串行创建和审计详细设计 calibration；借用 Governance 对应 Step 的粒度与框架，不借用其业务 truth | 不进入 Step 11～19、不写正式 `03`、不实现代码、不运行测试、不创建 implementation ledger/boundary skeleton、不提交 commit、不跨项目写入 |
| 2026-09-22 | “完成全部03” | 继续完成 Step 11→19；逐 Step 创建 calibration、更新 flow/ledger；Step 19 重建正式 `03-详细设计.md` 后停审 | 不进入 `04`，不实现代码、不运行测试、不创建 implementation ledger/boundary skeleton、不提交 commit、不跨项目写入 |
| 2026-09-23 | 本轮完成 | 正式 `03` 已 full-restart 装配、完成静态闭环审计并进入 `formal_stop_review` | 未获新的明确授权前不得读取或创建 `04` calibration；不实现代码、不运行测试、不创建 implementation ledger/boundary skeleton、不提交 commit、不跨项目写入 |
| 2026-09-23 | “同意 完成全部04” | 建立 04 flow，严格完成 Step 1→15；Step 15 full-restart 装配正式 04 后停审 | 不进入 05，不实现代码、不运行测试、不创建 implementation ledger/boundary skeleton、不提交 commit、不跨项目写入 |
| 2026-09-24 | “继续” | 完成 Step 13「迁移、废弃与演进」中间产物并停审；更新 04 flow/项目台账，恢复点切换到 Step 14 | 不创建 Step 14/15 文件，不装配正式 04，不实现代码、不运行测试、不创建 implementation ledger/boundary skeleton、不提交 commit、不跨项目写入 |
| 2026-09-24 | “完成全部 04” | 完成 Step 14 风险/待确认/03 回写汇总；进入 Step 15，按 15 章主链装配正式 04 并完成总审计后停审 | 不进入 05，不实现代码、不运行测试、不创建 implementation ledger/boundary skeleton、不提交 commit、不跨项目写入 |
| 2026-09-25 | “我认可 现在完成全部05” | 在正式 04 停审后建立 05 flow，按测试方案 SOP Step 1→15 完成全部校准并装配正式 05，完成后停审 | 不进入 06，不实现代码、不运行测试、不创建 artifact/report/evidence 实例、不创建 implementation ledger/boundary skeleton、不提交 commit、不跨项目写入 |
| 2026-09-25 | “继续完成全部 06” | 在正式 05 停审后建立 06 flow，按验收标准 SOP Step 1→15 完成全部校准；Step 15 full-restart 重建正式 06，完成跨门禁裁决总审计并停审 | 不进入 07，不实现代码、不运行测试、不创建真实 artifact/report/evidence/verdict/signoff/readiness、不创建 implementation ledger/boundary skeleton、不提交 commit、不跨项目写入 |
| 2026-09-26 | “现在完成全部 07” | 在正式 06 停审后建立 07 flow，按实施计划 SOP Step 1→13 完成全部校准；Step 13 full-restart 装配正式 07，并同步创建 planned/blocked/waiting implementation ledger 与全部 boundary skeleton 后停审 | 不创建实现仓、不实现代码、不运行测试、不创建真实 artifact/report/evidence、不填写真实 commit/hash/verdict/signoff/readiness、不提交 commit、不跨项目写入 |

## 9. 07 完成产物与停审边界

| 产物 | 路径 | 状态 |
|---|---|---|
| 正式实施计划 | `projects/L5-sync/07-实施计划.md` | `formal / stop_review` |
| 07 flow | `projects/L5-sync/design-calibration/07_implementation_plan_calibration_flow.md` | `completed / closed` |
| Step 13 装配记录 | `projects/L5-sync/design-calibration/07_implementation_plan_step_13_formal_assembly.md` | `completed / stop_review` |
| implementation execution ledger | `projects/L5-sync/design-calibration/implementation_execution_ledger.md` | `blocked`；无真实执行记录 |
| boundary skeletons | `projects/L5-sync/design-calibration/implementation-boundaries/commit-*.md` | 16 个；状态仅 `planned`/`blocked`/`waiting` |

正式 07 完成后只允许 `user_review_formal_07`。目标实现仓仍不得创建；不实现代码、不运行测试、不生成真实 artifact/report/evidence、不填写 commit/hash/verdict/signoff/readiness，也不提交 commit。
