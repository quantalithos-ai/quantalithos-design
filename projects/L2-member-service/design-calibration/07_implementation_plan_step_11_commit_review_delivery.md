# Step 11. 定义提交、评审与交付纪律

> 对应 SOP：standards/document/实施计划讨论流程_SOP.md Step 11
> 本步状态：completed / pass_with_upstream_blockers
> 回填目标：正式 07-实施计划.md §11

## Step 状态

| 项 | 结论 |
|---|---|
| gate_status | completed / pass_with_upstream_blockers |
| current_module | commit_review_delivery |
| next_allowed_action | Step 12 completion_criteria |
| commit_allowed | false；本轮设计仓不提交 |

## 本步输入

实施计划规范 §4.8~§4.10、代码实施台账规范、Step 6 的 24 boundary、Step 7 的门禁与证据矩阵、Rust 编码规范和目标实现仓约定。

## SOP 问题回答

未来实现仓一笔 commit 对应一个 boundary；标题固定英文 `type(scope): subject`，body 英文、按 Step 6 子功能分组，文件条目只写文件名和近似改动量，禁止字面量 `\\n`，bullet 之间不插空行，footer 前保留真实空行并使用固定 `Co-Authored-By: Codex <noreply@openai.com>`。当前 design 仓若未来只修改文档，可按项目历史使用英文 type、中文 subject/body，但本轮不提交。Commit Gate 检查 staged scope、门禁、whitespace、message、证据引用；Handoff Gate 回写 hash、baseline、next boundary、未跑检查、blocker、用户改动和恢复点。

## 当前文档问题诊断

如果不区分 design 仓与 implementation repo，容易把中文提交规则带入 Rust 实现仓；如果只说“提交代码”，无法保证 boundary 粒度、body 分组和证据配对。需要把提交纪律、评审维度和交付台账写成可执行门禁。

## 改动前后对比

| 方面 | 改动前 | 改动后 |
|---|---|---|
| 粒度 | 未固定 | 一 boundary 一 commit |
| 语言 | 未区分仓类型 | design 与 implementation 分离 |
| 证据 | 可能只贴日志 | raw/report/handoff 固定路径 |
| 交付 | 只报完成 | Commit/Handoff Gate + ledger |

## 设计取舍

- 24 boundary 同时是 review、rollback、台账和 commit identity，不按文件或个人工作量拆。
- 同一 boundary 的协作子功能保留为一笔提交，通过 body 分组说明原因。
- 设计期所有 `committed_hash`、run、artifact、report、evidence 统一为 none/not_started。

## 结构化中间产物

### 提交纪律

| 项 | 要求 |
|---|---|
| git identity | 实现仓本地检查 `quantalithos-labs` / `quantalithos.ai@gmail.com` |
| 时机 | 当前 boundary 的 Design/Scope/Build/Test/Evidence Gate 通过后 |
| 粒度 | 一笔提交对应 Step 6 一个 boundary |
| scope | 实现仓标题必须填写 scope，且与 boundary 功能一致 |
| 设计偏离 | 先回写 owning source，不能在 commit 中隐式补设计 |
| 当前 design 仓 | 本轮不提交；用户未要求 commit |

### Commit message 结构

```text
feat(session): wire host session application slice

Wire the host session slice for PH-03 commit-03-c:

Session application and fake seam:
- services.rs (~+80/-0): assemble the planned session use case.
- fake_session.rs (~+65/-0): preserve generation and duplicate semantics.

Entry and negative tests:
- command_handlers.rs (~+40/-0): map safe outcomes without runtime body.
- session_tests.rs (~+90/-0): cover stale and cross-generation registration.

Co-Authored-By: Codex <noreply@openai.com>
```

规则：title/body 真实换行；文件名不带完整路径；bullet 不插空行；需要精确格式时使用 `git commit -F <message-file>`；不允许把 planned hash 或 report 当真实提交证据。

### Type / Scope 约束

| Type | Scope 示例 |
|---|---|
| feat、fix、refactor、docs、test、chore、perf、ci、style | workspace、config、control、qualification、assembly、host、session、health、recovery、closure、reconcile、material、projection、query、consumer、publisher、job、release、report、handoff |

### Boundary 到 body 分组映射

| Boundary 族 | body 分组 | 同提交原因 |
|---|---|---|
| Foundation | workspace / config / tooling | 共同建立可检查基础，不含业务 truth |
| Control | contract/domain；application/UoW；negative tests | 同一 control slice 的构造、编排和验证 |
| Host/health/closure | truth/state；adapter seam；entry/replay | 同一生命周期增量，保持 generation/key fence |
| Material/query/consumer/job | carrier/projection；mapping/entry；replay/report | 同一 handoff/read/maintenance 增量 |
| Evidence/release | fixture/gate；report/audit；handoff | 只有 PH-08 才能形成固定 run 交付面 |

### Commit Gate / Handoff Gate

| Gate | 必查内容 | 设计期状态 |
|---|---|---|
| Commit Gate | allowed scope、staged diff、fmt/check/test、message、whitespace、文档同步、artifact/report 引用 | planned；无实际证据 |
| Handoff Gate | commit hash、design baseline、下一 boundary、未跑检查、blocker、user changes、恢复点、ledger 更新 | blocked until implementation |

### 评审维度

| 维度 | 评审问题 |
|---|---|
| truth / owner | 是否越界复制 sibling truth 或新增 owner |
| contract | 字段、DTO、状态、Port、error 是否可 1:1 构造 |
| consistency | UoW、revision、idempotency、cursor、outbox、projection 是否闭合 |
| safety | raw body、secret、endpoint、manifest 是否泄漏 |
| phase | 是否提前使用 successor 对象、结果或 evidence |
| evidence | artifact/report pairing 与 run_id 是否真实 |
| scope | staged files 是否只覆盖当前 boundary |

### 交付检查表

| 交付项 | 要求 | 当前状态 |
|---|---|---|
| raw artifact | `artifacts/test/<run_id>`，失败保留 | not_generated |
| run report | `reports/runs/<run_id>` | not_generated |
| evidence index | 可回指 raw artifact / digest / TC / AC/VF | not_generated |
| acceptance handoff | `reports/acceptance/handoff.md`，需人工/Agent 审查 | not_generated |
| VETO checklist | `reports/acceptance/veto-checklist.md` | not_generated |
| risk acceptance | 仅有 eligible residual 时生成 | not_applicable in design phase |

### Commit discipline 停审记录

| 审计项 | 结论 |
|---|---|
| 24 boundary 都有 commit identity 与 scope | pass-designed |
| design/implementation 语言边界 | pass-designed |
| body 分组可回指 Step 6 | pass-designed |
| Commit/Handoff Gate 字段完整 | pass-designed；实际执行待未来 |
| current 与 future boundary 状态隔离 | pass-designed |

## 回填草稿

正式 §11 应包含一 boundary 一 commit、英文实现仓 message、design 仓差异、body 分组、footer、Commit/Handoff Gate、评审维度和 artifact/report 交付检查表。

## 待确认事项

- 目标实现仓实际 git identity 与是否允许固定 footer 的最终确认。
- 评审人/Agent 的交接渠道和 commit hash 记录方式。

## 进入下一步条件

提交、评审、交付和台账纪律已固定，允许进入 Step 12 实施完成判定。
