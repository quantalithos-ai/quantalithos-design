# Step 11. 定义提交、评审与交付纪律

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 11
> 回填目标：正式 `07-实施计划.md` §11

## Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 11 / commit_review_and_delivery_discipline |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 下一步 | Step 12；定义实施完成判定 |

## 本步输入

| 输入 | 来源 | 状态 |
|---|---|---|
| commit boundaries/body groups | Step 6 | completed / stop_review |
| test/evidence gates | Step 7 | completed / stop_review |
| rollback/worktree rules | Step 10 | completed / stop_review |
| commit/ledger standards | 07 书写规范、代码实施台账规范 | read |

## SOP 问题回答

| 问题 | 收口回答 | 依据 |
|---|---|---|
| git identity 如何检查？ | 在目标实现仓使用项目级 `user.name=quantalithos-labs`、`user.email=quantalithos.ai@gmail.com`；不得使用 `--global`。当前未执行。 | 07 SOP Step 3/11 |
| 实现仓 message 规则？ | 英文 `type(scope): subject`，body 先 boundary summary，再按子功能分组，文件名不带路径并标大致改动量，固定 Codex footer。 | 07 书写规范 §4.9 |
| 设计仓规则？ | `type` 英文、subject/body 中文、固定 footer；只有用户明确要求才提交。 | 07 书写规范 §4.9.3 |
| 提交粒度？ | 一笔提交对应一个 Step 6 commit boundary；同一 boundary 的协作子功能用 body 分组，不按文件拆多笔。 | Step 6、书写规范 |
| 交付前必须记录什么？ | staged scope、unrelated changes、message、whitespace、required checks、artifact/report refs、commit hash、remaining blocker、next boundary、未跑测试、用户改动。 | 台账规范 §7.7/§7.8 |

## 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 目标仓不存在/无 history | 无法核对实际 scope/style | 当前只定义默认规则；目标仓创建后先读其更严格规则 |
| 无真实 staged files/checks/hash | 不能将 Commit/Handoff Gate 标 pass | implementation ledger/skeleton 均保持 planned/blocked/waiting |
| boundary 含多个协作子功能 | 容易被拆成文件级 commit | message body 按功能组说明为何同提交 |

## 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| commit message | 03 只给候选格式 | 完整 title/body/footer/语言/示例规则 | 可执行 |
| staged scope | 未定义 | Commit Gate 强制 allowed files、user changes、diff check | 保护工作区 |
| handoff | 未定义 | hash/checks/blockers/next boundary/user changes 必填 | 可恢复 |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 一个 phase 一笔提交 | 简洁 | boundary 太粗，不利回退 | 拒绝 |
| 每个文件/批次一笔提交 | 细 | 破坏功能增量和 review 语义 | 拒绝 |
| 一 boundary 一提交，body 按协作子功能分组 | 对齐 review/revert/evidence | message 更长 | 采用 |

## 结构化中间产物

### 提交纪律

| 项 | 要求 | 检查方式 |
|---|---|---|
| git user.name | `quantalithos-labs` | `git config user.name`（目标仓内） |
| git user.email | `quantalithos.ai@gmail.com` | `git config user.email`（目标仓内） |
| git config scope | project-local only | 不使用 `--global` |
| 提交粒度 | 一笔提交对应一个 `commit-xx-y` | boundary ledger + staged diff |
| 实现仓标题 | `<type>(<scope>): <subject>`，英文 | message file review |
| 实现仓源码语言 | identifier/JSDoc/comment/test name 默认英文 | review/lint |
| design 仓标题 | 英文 type + 中文 subject/body | design history/rules |
| footer | `Co-Authored-By: Codex <noreply@openai.com>` | footer 前真实空行 |
| 精确格式 | 使用完整 message file + `git commit -F` | message file review |
| 用户改动 | 只 stage 当前 boundary，未授权文件保持 unstaged/untouched | status/cached diff |

### Type / Scope

| Type | 用途 |
|---|---|
| `feat` | 新功能或新实现切片 |
| `fix` | 行为缺陷修复 |
| `test` | 测试/fixture/gate 补充 |
| `docs` | 文档和 handoff |
| `refactor` | 不改变行为的重构 |
| `chore` | package/tool/script 维护 |
| `ci` | CI/gate wiring |

本项目实现仓 scope 候选：`foundation`、`selection`、`metadata`、`materialization`、`recovery`、`handoff`、`query`、`cli`、`operations`、`evidence`。实际 scope 必须与 boundary 一致，目标仓更严格规则只能叠加。

### Boundary 到 commit body 分组映射

| Boundary | planned title | body 分组 | 证据引用 |
|---|---|---|---|
| commit-01-a | `chore(foundation): establish the sync package and gate skeleton` | Package and module layout; Gate script interfaces | future `reports/runs/<run_id>` |
| commit-01-b | `feat(foundation): add shared sync contracts and runtime composition` | Protocol carriers and errors; Config and capability composition; UoW/idempotency seams | protocol/config reports |
| commit-02-a | `feat(selection): add explicit selection and access evaluation` | Operation and selection domain; Owner access guards | domain/state reports |
| commit-02-b | `feat(metadata): add protected working-copy metadata lifecycle` | Binding and generation; Cursor/mapping/UoW; Migration/rebind guards | metadata/consistency reports |
| commit-03-a | `feat(query): add read-only working-copy inspection` | Observation reads; Status view composition | query reports |
| commit-03-b | `feat(materialization): add safe clone and pull orchestration` | Delta/plan/path safety; Git/filesystem seams; Finalize UoW | flow/fault reports |
| commit-04-a | `feat(recovery): add conflict facts and explicit recovery actions` | Conflict/checkpoint facts; Resolution/resume/cancel flows | recovery reports |
| commit-04-b | `feat(recovery): add probe and idempotent unknown-outcome handling` | Probe/reload; Idempotency/race guards | consistency reports |
| commit-05-a | `feat(handoff): add review candidates and protected provenance` | Candidate freeze; Provenance append/protect | trace reports |
| commit-05-b | `feat(handoff): add layered review handoff status` | Attempt/transport/probe layers; Review/Decision adapter reads | handoff reports |
| commit-06-a | `feat(query): add zero-write queries and safe diagnostics` | Query handlers/views; Diagnostic redaction | query/redaction reports |
| commit-06-b | `feat(cli): add safe sync command entry points` | CLI routes; Presentation; Runtime composition | entry reports |
| commit-07-a | `feat(operations): add bounded consumers and maintenance jobs` | Consumer receipts/quarantine; Job items/replay | ops reports |
| commit-07-b | `feat(operations): add closed telemetry and evidence hooks` | Signal isolation; Evidence/report hooks | redaction/link reports |
| commit-08-a | `ci(evidence): add fixed-run gates and report generation` | Gate/check scripts; Minimal evidence index/report links | fixed run reports |
| commit-08-b | `docs(evidence): add acceptance handoff and closure audit` | Handoff/VETO/risk templates; 03/05/06/07 audit | acceptance package |

### 合格实现仓 commit 示例

```text
feat(materialization): add safe clone and pull orchestration

Safe clone and pull orchestration for commit-03-b:

Delta planning and path safety:
- materialization_plan.ts (~+180/-20): validate source continuity, path changes, and one-shot plan consumption.
- materialization_service.ts (~+240/-35): orchestrate prepare, apply, and finalize without advancing cursors on unknown outcomes.

Typed Git and filesystem seams:
- git_worktree_adapter.ts (+160): map supported observations and failures into typed safe results.
- filesystem_apply_adapter.ts (+145): enforce root-bound non-overwrite application and partial-outcome reporting.

Co-Authored-By: Codex <noreply@openai.com>
```

### 不合格示例

```text
feat: sync work
- src/source_materialization/application/materialization_service.ts: update code

- src/adapters/git/git_worktree_adapter.ts: fix things
Co-Authored-By: Codex <noreply@openai.com>
```

不合格原因：缺 scope、subject 模糊、无 boundary summary、使用完整路径、无改动量、按文件平铺、bullet 间空行且无提交前门禁。

### Commit Gate

| 检查项 | 通过条件（未来） | 当前姿态 |
|---|---|---|
| staged scope | 只含当前 boundary allowed files | waiting |
| unrelated changes | 用户无关修改未 stage/未覆盖 | waiting |
| message | title/body/footer/语言/分组符合规则 | planned |
| whitespace | cached diff check 无错误 | waiting |
| required checks | boundary Build/Test/Evidence Gate 有真实记录 | blocked/waiting |
| design sync | 设计偏离已回写并固定新 baseline | blocked until baseline |

### Handoff Gate

| 检查项 | 必须记录 | 当前姿态 |
|---|---|---|
| commit hash/message | 目标仓真实值 | absent；不得伪造 |
| gates run | 精确命令、result、artifact/report refs | absent |
| tests not run | 原因和风险 | future required |
| remaining blockers | blocker ID/boundary/next action | current blockers preserved |
| next boundary | 唯一 boundary ID | planned |
| user changes | 未触碰/未 stage 文件清单 | future required |

### Artifact/report 交付检查

| 检查项 | 未来通过标准 | 当前姿态 |
|---|---|---|
| raw artifact | `artifacts/test/<run_id>` 含 context/index/suite report | absent |
| run report | `reports/runs/<run_id>` summary/index/gate/redaction/dependency/audit | absent |
| pairing | report 可回指 raw artifact/digest | planned |
| acceptance handoff | handoff/veto/risk 文件经人或 Agent 审查 | absent |
| evidence ceiling | 不把 ACK/local commit/job report/telemetry 当 truth/readiness | planned rule |

### Commit discipline 停审记录

| Boundary | diff/scope | title/body/footer | evidence reference | 结论 |
|---|---|---|---|---|
| commit-01-a～commit-08-b | 与 Step 6 一致 | planned mapping complete | fixed-run only | pass (plan); no commit executed |

### 跨提交边界纪律审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 一 boundary 一提交 | pass (plan) | 16 planned commits, zero actual commits |
| scope 命名 | pass (plan) | 与功能增量一致 |
| body 分组 | pass (plan) | 映射 Step 6 子功能 |
| 语言边界/footer | pass (plan) | implementation English/design Chinese, fixed Codex footer |
| evidence reference | pass (plan) | fixed run only; no latest/log paste |
| user changes protection | pass (rule) | future Worktree/Scope Gate required |

## 回填草稿

正式 §11 将回填 git config、type/scope、16 boundary message mapping、正反例、Commit/Handoff Gate、artifact/report checklist 和跨提交审计；明确当前无 commit、staged diff、hash 或 gate result。

## 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| 目标仓更严格 commit 规范/history | message scope/body | 01-a 前 |
| 项目级 git identity | Commit Gate | 首次提交前 |
| acceptance reviewer | Handoff Gate | 08-b 前 |

## 进入下一步条件

- [x] 提交、评审、交付和语言纪律完整。
- [x] 16 boundary 有 planned message/body mapping。
- [x] Commit/Handoff Gate 未伪造实际结果。
