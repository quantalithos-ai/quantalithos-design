# L2-tools 07 实施计划 Step 11：提交、评审与交付纪律

## Step 状态

`accepted`

## 本步输入与事实边界

输入为 Step 6 的 26 个 boundary、Step 7 gates、Rust 编码规范和实施计划 commit 规范。本文件只固定未来提交格式；当前不授权、不创建、不伪造任何 commit hash/message execution fact。

## 提交纪律

| 项 | 要求 | 检查方式 |
|---|---|---|
| git identity | repo-local `quantalithos-labs` / `quantalithos.ai@gmail.com` | `git config user.name/email` |
| boundary | 一笔提交恰好对应一个 §6 boundary | ledger + staged diff |
| title | implementation repo 英文 `type(scope): subject` | message review |
| body | 英文一句 boundary summary + 按协作子功能分组；文件名不带路径并标大致改动量 | message file review |
| footer | AI 实际参与时 `Co-Authored-By: Codex <noreply@openai.com>`，前一真实空行 | message review |
| checks | Build/Test/Evidence/Commit Gate 有真实结果或 exact N/A | boundary ledger |
| user changes | unrelated files untouched/unstaged | initial/current status + staged list |
| precision | 使用完整 message file + `git commit -F` | command record |

允许 type：`feat`,`fix`,`refactor`,`test`,`docs`,`chore`,`perf`,`ci`,`style`。scope 必须与当前 boundary capability 一致，不允许 `update`,`stuff`,`wip` 或只写 boundary ID。

## Commit Boundary 到 Body Group 映射

| Boundary | Planned title | Required body groups |
|---|---|---|
| `commit-01-a` | `chore(workspace): establish the tools workspace skeleton` | `Workspace and member layout:`; `Dependency and naming boundaries:` |
| `commit-01-b` | `chore(tooling): add strict config and run-scoped roots` | `Strict configuration shell:`; `Run-scoped tooling roots:` |
| `commit-02-a` | `feat(contracts): add the public tool contract foundation` | `Typed references and metadata:`; `Shared carriers and errors:` |
| `commit-02-b` | `feat(domain): add tool state and invariant foundations` | `Domain object foundations:`; `State guards and invariant tests:` |
| `commit-02-c` | `feat(application): add ports transactions and replay foundations` | `Application ports and transactions:`; `Replay and fake parity:` |
| `commit-03-a` | `feat(contract): add tool identity and definition flows` | `Identity and definition contracts:`; `Accepted service and read surface:` |
| `commit-03-b` | `feat(evolution): add tool revision lifecycle flows` | `Revision impact and adoption:`; `Retirement history and replay:` |
| `commit-04-a` | `feat(binding): add capability binding contracts` | `Binding relation contracts:`; `Snapshot and assessment guards:` |
| `commit-04-b` | `feat(binding): complete controlled binding consumption` | `Binding services and persistence:`; `Controlled Hub seam and query:` |
| `commit-05-a` | `feat(invocation): add canonical invocation admission` | `Canonical invocation contracts:`; `Admission and no-execution state:` |
| `commit-05-b` | `feat(precondition): add fail-closed execution preconditions` | `Execution requirement mapping:`; `Authorization consumption failures:` |
| `commit-05-c` | `feat(handoff): add prepared sandbox handoff fencing` | `Prepared handoff persistence:`; `One-call and unknown fencing:` |
| `commit-06-a` | `feat(outcome): add normalized outcome audit pairs` | `Execution source normalization:`; `Atomic outcome and audit persistence:` |
| `commit-06-b` | `feat(handoff): add safe material eligibility` | `Four-gate eligibility:`; `Body-free material mapping:` |
| `commit-06-c` | `feat(outbound): add local submission attempt state` | `Local submission attempts:`; `Independent external status views:` |
| `commit-07-a` | `feat(query): add read-only query foundations` | `Visibility and page contracts:`; `Read ports and no-write guards:` |
| `commit-07-b` | `feat(query): add core tool read surfaces` | `Core read bundles:`; `Query handlers and degraded mapping:` |
| `commit-07-c` | `feat(projection): add derived tool read material` | `Derived projection storage:`; `Reports diagnostics and guidance:` |
| `commit-08-a` | `feat(consumer): add inbound tool consumer receipts` | `Envelope and claim lifecycle:`; `Stored receipts and source assessments:` |
| `commit-08-b` | `feat(event): add safe outbound continuation flows` | `Sandbox source re-entry:`; `Event continuation and feedback refs:` |
| `commit-09-a` | `feat(jobs): add bounded job protocol foundation` | `Job contracts and journal:`; `Frozen targets and report carriers:` |
| `commit-09-b` | `feat(jobs): complete bounded maintenance reports` | `Consistency and projection jobs:`; `Status refresh and replay reports:` |
| `commit-10-a` | `feat(config): add strict tools configuration activation` | `Strict candidate validation:`; `Profile and cross-field activation:` |
| `commit-10-b` | `feat(runtime): compose controlled tool adapters` | `Runtime graph composition:`; `Entry and adapter parity:` |
| `commit-11-a` | `feat(testing): add run-scoped test evidence tooling` | `Raw artifacts and suite reports:`; `Checks and evidence derivation:` |
| `commit-11-b` | `feat(release): add acceptance handoff scaffolding` | `Release-local aggregation:`; `VETO and review-required handoff:` |

## Commit Message 正例

```text
feat(handoff): add prepared sandbox handoff fencing

Prepared Sandbox handoff fencing for commit-05-c:

Prepared handoff persistence:
- handoff_service.rs (~+180/-12): persist the handoff and prepared attempt before the external call.
- repositories.rs (+96): add versioned handoff attempt save and lookup parity.

One-call and unknown fencing:
- handoff_adapters.rs (~+120/-8): preserve typed local and ambiguous call outcomes without fallback.
- handoff_phase_tests.rs (+210): cover one-call, stale phase-two CAS, and unknown no-retry behavior.

Co-Authored-By: Codex <noreply@openai.com>
```

反例包括：标题/正文中文用于实现仓、body 含字面量 `\n`、文件条目带完整路径、bullet 间空行、按 repository/service/routes 拆同一 boundary、footer 前无空行、未跑门禁却写 passed。

## Commit Gate

| 检查项 | 通过条件 |
|---|---|
| activation/design | current boundary唯一且 immutable baseline 已记录，Design Gate pass |
| staged scope | `git diff --cached --name-only` 仅含 allowed scope |
| unrelated changes | 用户/其他 agent 文件不在 staged set |
| message | title/body groups/file entries/footer/英文符合本表 |
| whitespace | `git diff --cached --check` pass |
| Rustdoc/source language | public item/field/variant/callable完整英文 Rustdoc；identifier/comment/test英文 |
| required gates | actual commands/results/path写入 ledger；pending/blocked不得提交 |

## 评审纪律

| Review | 必查 | 失败动作 |
|---|---|---|
| design | formal03/04/05/06/07 与 calibration exact source | wait_design |
| scope | boundary included/excluded + phase fence | split/fix scope |
| behavior | positive/negative/replay/unknown/no-write/no-repair | fix and rerun |
| security | body/secret/ref/redaction/dependency/owner | hard stop/VF review |
| evidence | same-run raw/report/check/digest/no-static | invalid_artifact/new run |
| commit | staged diff/message/body groups/footer | fix before commit |
| handoff | hash/gates/not-run/blockers/next/user changes | remain current boundary |

## 交付纪律

| 项 | 要求 |
|---|---|
| Commit Record | 只在真实 commit 后写 hash/message/post-status。 |
| Handoff Gate | 记录 actual gates、tests not run、remaining blockers、next boundary、user changes。 |
| artifact/report | 引用 fixed run paths，不粘贴 raw secrets/full logs。 |
| acceptance | drafts 必须经 review；不自动生成 verdict/risk acceptance/signoff。 |
| future activation | 当前 handoff pass 后，项目 ledger 才能把下一 skeleton 从 planned 激活。 |

### Commit discipline 停审与跨审计

| 审计项 | 结论 |
|---|---|
| 26 boundary 均有 title/body groups | pass-designed |
| type/scope 与 capability 匹配 | pass-designed |
| 一 boundary 一 commit | pass-designed |
| implementation repo 英文边界 | pass-designed |
| footer/message file 规则 | pass-designed |
| raw/report/acceptance 事实边界 | pass-designed |
| current commit facts | none；未授权提交 |

## 回填草稿

正式 07 §11 应收录提交纪律、26 个 planned title/body group、正反例、Commit Gate、review/handoff 规则；planned message 不得被 boundary ledger 误记为 committed message。

## 进入下一步条件

- [x] 26 个 boundary 的提交时机/title/body group 完整。
- [x] Commit/Handoff Gate 与代码台账规范一致。
- [x] 当前无 commit、hash 或伪造执行事实。
