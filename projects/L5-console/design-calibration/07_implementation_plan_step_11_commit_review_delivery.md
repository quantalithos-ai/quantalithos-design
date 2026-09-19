# Step 11. 定义提交、评审与交付纪律

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 11
> 回填章节：`07-实施计划.md` §11 提交、评审与交付纪律
> 粒度参考：`projects/L1-governance/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md`
> 执行模式：`full-restart + single-agent-serial`

## 1. Step 状态与输入确认

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 11 · 提交、评审与交付纪律 |
| 当前状态 | `done / pass / self_reviewed`（设计层；`step_stop_review`） |
| 输入基线 | Step 6 的 22 boundary/批次/message；Step 7 gate/evidence；Step 10 pause/change；实施计划书写规范；代码实施台账规范 |
| 正式 07 写入 | `false`；Step 13 full-restart 前不得创建或修改 |
| 实现移交 | `blocked / wait_design`；目标仓、baseline、required checks 和真实 evidence 未固定 |
| 本步输出 | 提交纪律、type/scope/message、语言/footer、body 分组、评审/交付检查表、22 boundary 停审和跨提交审计 |
| 下一动作 | Step 11 停审后进入 Step 12；不提交 commit |

## 2. SOP 问题回答

| 问题 | 本项目结论 |
|---|---|
| 1. 提交前检查哪些 git 配置？ | 目标实现仓首次提交前检查 `user.name=quantalithos-labs`、`user.email=quantalithos.ai@gmail.com`；当前目标仓不存在，不执行也不修改 design 仓配置。 |
| 2. message 参考什么？ | `实施计划书写规范.md`、代码实施台账规范、目标实现仓近期合格历史；若无历史，以本 Step 和 Step 6 planned message 为准。 |
| 3. 当前提交发生在哪个仓？ | 本轮只修改 design 仓 `projects/L5-console/` 文档与台账；未来实现发生在 `/home/aris/Projects/quantalithos-console`，两者纪律分开。 |
| 4. design 仓语言如何控制？ | type 使用英文；subject/body 可用中文；固定 footer 只在用户授权并实际提交时按仓规范处理；本轮不提交。 |
| 5. 实现仓 message 如何控制？ | title、subject、body 使用英文；源码标识符、注释、测试名默认英文；标题固定 `<type>(<scope>): <subject>`，scope 必填。 |
| 6. type/scope 如何定义？ | type：`feat/fix/refactor/docs/test/chore/perf/ci/style`；scope 使用 `console` 或与 boundary 归属一致的 `config/access/navigation/query/intent/features/recovery/adapters/state/diagnostics/release/report`，不得用无意义 `misc`。 |
| 7. 一笔提交对应几个 boundary？ | 一笔提交严格对应一个 Step 6 boundary；不能把多个 phase/boundary 或 PH-08 evidence 与业务功能混成一笔。 |
| 8. 同一 boundary 多个协作子功能如何处理？ | 保留一笔提交，在 body 按 Step 6 子功能分组说明“为何同属一个可验证增量”；不得按文件/目录拆成多笔。 |
| 9. body 第一段写什么？ | 一句英文 boundary summary，包含 boundary ID 和可验证增量；后续按协作子功能分组列文件名与近似改动量。 |
| 10. 证据如何附到 commit/PR/handoff？ | 只引用 `reports/runs/<run_id>`、suite report、`reports/acceptance/*` 和审查笔记路径；不粘贴完整日志，不把路径当执行结果。 |
| 11. 什么时候允许/禁止 commit？ | 适用 Design/Scope/Worktree/Build/Test/Evidence/Commit/Handoff Gate 均真实通过、staged scope/message/diff check 完成且获得用户授权时才允许；任何 blocker/pending/缺 evidence/越界/静态 pass 时禁止。 |
| 12. 如何处理设计偏离？ | 依 Step 10 回写 03/04/05/06/07，固定新 baseline，重跑受影响 gate；不得先 commit 再补文档。 |
| 13. artifact/report 是否必须成对？ | 是。raw artifact、paired report、digest、evidence index、redaction/pairing/no-static 必须可回指；PH-08 acceptance 草稿还需人/Agent 审查。 |
| 14. 如何处理用户已有改动？ | 只 stage 当前 boundary 允许文件；不得 reset/checkout/delete 用户改动；final/handoff 记录未触碰的无关文件。 |

## 3. 当前材料问题诊断

| 问题 | 风险 | 本 Step 修正 |
|---|---|---|
| 22 boundary 有 planned message 但未形成提交纪律 | 可能按文件碎片化提交 | 固定一 boundary 一 commit，并逐 boundary 停审 |
| design/implementation 仓语言不同 | 中文 message 可能泄漏到实现仓 | 明确 design 与实现仓 title/body/source 规则 |
| body 只列文件或完整路径 | review 无法理解增量边界 | body 以协作子功能分组，只写文件名和改动量 |
| 证据路径可能被当作通过结果 | 静态造 evidence/readiness | 只有真实 run/report 才可引用；当前全为 pending/not_created |
| 自动生成 acceptance draft 可能直接提交 | 绕过人/Agent 审查 | handoff/VETO/risk/open-issues 必须审查后才可交付 |

## 4. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按文件/模块各提交一次 | diff 小 | 打散可验证增量，难以回退 | 不采用 |
| 每个 phase 一笔提交 | 简单 | 大 phase 无法独立审查 | 不采用 |
| 每个 Step 6 boundary 一笔提交 | 对齐测试/回退/审查 | 某些 boundary 仍需内部 batch | 采用 |
| 实现仓沿用 design 中文 body | 统一表面格式 | 违反实现仓英文规则 | 不采用 |
| body 只引用完整日志 | 信息多 | 提交不可读、证据难定位 | 不采用；引用 report path |

## 5. 结构化中间产物

### 5.1 提交纪律表

| 项 | 要求 | 检查方式 | 当前状态 |
|---|---|---|---|
| project-local git identity | 实现仓 `quantalithos-labs / quantalithos.ai@gmail.com` | `git config --local` | target repo absent/not_checked |
| 粒度 | 一笔提交对应一个 `commit-XX-x` | Step 6 mapping + staged diff | planned |
| implementation title | `<type>(<scope>): <subject>`，英文 | message file/log review | planned |
| implementation source language | identifier/comment/test 默认英文 | review/lint/grep | planned |
| design title/body | type 英文；subject/body 按 design 仓约定；不与实现仓规则混用 | design commit review | no commit requested |
| footer | 仅在真实提交时按仓规范写入；AI footer 不能冒充贡献事实 | message review | not_applicable now |
| exact message | 需要精确格式时写 message file，使用 `git commit -F` | file/diff review | planned |
| evidence citation | 只引用同一 run 的 report/acceptance 路径 | pairing/report audit | future |

### 5.2 Type / Scope 约束

| 项 | 允许值 | 规则 |
|---|---|---|
| type | `feat`、`fix`、`refactor`、`docs`、`test`、`chore`、`perf`、`ci`、`style` | 英文；实际类型必须符合改动 |
| scope | `console`、`config`、`access`、`navigation`、`views`、`query`、`intent`、`features`、`recovery`、`adapters`、`state`、`diagnostics`、`release`、`report` | scope 应能回指 boundary；禁止 `misc`/`tmp` |
| boundary mapping | `commit-01-a`～`commit-08-c` | 一笔提交只对应一个 boundary；scope 不得掩盖跨 boundary |

### 5.3 Commit message 结构与文件条目

```text
feat(query): establish safe core query read seam

Safe core query read seam for commit-03-b:

Safe view and query mapping:
- owner_view_mapper.ts (~+80/-0): map only approved safe material and preserve source axes.
- core_query_ports.ts (+42): expose zero-write query seam without owner storage access.

Query contract checks:
- query_call_ledger.ts (+36): record read-only calls and forbidden-write assertions.
- query_contract.spec.ts (+94): cover empty, blocked, unavailable, and unknown outcomes.

Co-Authored-By: Codex <noreply@openai.com>
```

Rules: title 后真实空行；body 第一段说明 boundary；按协作子功能分组；文件条目只写文件名，不写完整路径；改动量用 `(+3)`、`(-35)`、`(~38)` 或 `(~+330/-60)`；bullet 之间不插空行；footer 前真实空行；禁止字面量 `\n`。示例仅为格式合同，不表示文件、测试或 commit 已存在。

### 5.4 反例与拆分规则

不合格示例：`update query`、`fix stuff`、把 `crates/.../file.ts` 写进 body、用字面量 `\n`、bullet 间插空行、只写 `Files:`，或将 `commit-03-b` 的 mapper、query ledger、tests 拆为三笔互相无法独立证明的提交。

若一个 boundary 内有多个协作子功能，必须在同一 message 中分组；只有 Step 6 boundary 正式调整后才能拆成多笔。跨 boundary、跨 phase、业务实现与 release evidence 必须分开。

### 5.5 22 boundary body 分组映射

| Boundary | body 分组建议 | 证据引用（future） |
|---|---|---|
| `commit-01-a` | package/config skeleton；profile validation | config/static report |
| `commit-01-b` | gate/check roots；fixture/corpus/manifest | dry-run/redaction report |
| `commit-02-a` | entry/context/access guards；disclosure tests | module-flow/security report |
| `commit-02-b` | navigation/selection cleanup；semantic route bindings | navigation/a11y report |
| `commit-03-a` | safe material mapper；source/status axes | view/redaction report |
| `commit-03-b` | first Core Query seam；zero-write ledger | query contract report |
| `commit-03-c` | remaining Core Query/link/reconcile/activation | query/adapter report |
| `commit-04-a` | local draft/preference/discard phases；state tests | intent/state report |
| `commit-04-b` | controlled submit/reconcile/no-replay | flow/race/recovery report |
| `commit-04-c` | whole-record carrier/single-writer/late-drop | state/race report |
| `commit-05-a` | descriptors/activation/registry | registry/composition report |
| `commit-05-b` | eight partition queries/canonical order/isolation | composition/redaction report |
| `commit-05-c` | strict empty/page semantics/a11y completion | composition/a11y report |
| `commit-06-a` | typed degradation/recovery plans/action guards | recovery report |
| `commit-06-b` | semantic action/focus/announcement equivalence | a11y report |
| `commit-06-c` | diagnostic whitelist/redaction/sink isolation | diagnostic/security report |
| `commit-07-a` | adapter registry/availability/forbidden dependency scan | architecture/adapter report |
| `commit-07-b` | approved formal adapters/parity harness | adapter/contract report |
| `commit-07-c` | disabled invalidation/future envelope/race guards | invalidation/architecture report |
| `commit-08-a` | gate orchestration/pairing/redaction/no-static | release audit report |
| `commit-08-b` | run report/evidence candidate derivation | fixed-run evidence index |
| `commit-08-c` | handoff/VETO/risk/open-issues drafts/review notes | acceptance/review reports |

### 5.6 提交前检查清单

| 检查项 | 通过条件 |
|---|---|
| git identity | 目标实现仓 local user config 正确；当前仓不存在则保持 blocked |
| diff/scope | staged files 只属于当前 boundary；无用户无关改动 |
| design closure | 字段/DTO/Port/state/scope/carrier/reconcile/config/evidence/phase review 无 blocker |
| build/type/test | 使用目标仓真实命令；未运行不得写 pass |
| negative/redaction | 当前 boundary 所需 no-write/dependency/redaction/a11y checks 有真实 report |
| evidence pairing | raw/report/digest/run/TC/AC/VETO refs 成对且无 orphan |
| message | title/body/footer、语言、body groups、真实换行和文件条目合规 |
| document sync | 设计偏离已回写并固定新 baseline |
| user changes | 用户已有改动未被 stage、覆盖或删除 |
| commit authorization | 用户明确授权提交；本轮默认不提交 |

### 5.7 评审纪律与交付纪律

| 评审/交付项 | 要求 | 失败处理 |
|---|---|---|
| boundary review | reviewer 能从 title/body 回指一个 Step 6 boundary | 修改 message 或拆/并 boundary 后重审 |
| design closure | 开工前复核和修复后复核均有记录 | pause/wait_design |
| gate evidence | 引用 report 来自真实 raw artifact，同一 run | 补跑或修 generator；不可手写 |
| phase boundary | 不含后续 phase 或 forbidden owner/server structure | 移回正确 boundary；blocking |
| no unrelated changes | diff 不含用户或其他项目改动 | 重新 staging；保护用户文件 |
| acceptance draft | handoff/VETO/risk/open issues 由人/Agent审查 | 未审查不得交付/裁决 |
| failed artifacts | failed/blocked/residual 原样保留 | 新 run 修复；不得覆盖/删除 |
| handoff | 写真实 commit hash、gates run、未跑检查、remaining blockers、next boundary | 无 hash/run 时保持 pending，不得移交 |

### 5.8 22 boundary 提交纪律停审

| 审计项 | 结论 |
|---|---|
| 22 boundary 是否一一对应一笔 planned commit | `pass`；编号唯一，无跨 boundary 合并 |
| body 分组是否回指 Step 6 子功能 | `pass`；每个 boundary 有分组主题和 future evidence 入口 |
| scope 是否可追溯 | `pass`；scope 受限于 Console 模块/phase，不使用 `misc` |
| 实现仓英文规则与 design 仓规则是否分离 | `pass` |
| evidence/report pairing 是否进入提交前检查 | `pass`；当前无实例，不产生 pass 事实 |
| footer/换行/文件名规则是否明确 | `pass` |
| commit 时机是否受 gate、用户授权和 blocker 约束 | `pass` |
| 当前是否存在真实 commit/hash | `no`；保持 not_created |

### 5.9 跨提交边界纪律审计

| 审计项 | 结论 | 修正 |
|---|---|---|
| 是否存在按文件碎片化风险 | `pass` | 同 boundary 协作子功能保留一笔提交 |
| 是否存在跨 phase 合并风险 | `pass` | Step 6 mapping 和 staged scope 阻断 |
| 是否可能把 planned path 当 evidence | `pass` | report 必须来自真实 run；当前全 future |
| 是否保护用户工作区 | `pass` | 禁止 destructive 操作；只 stage 当前 boundary |
| 是否把 fake/disabled pass 当 owner positive | `pass` | message/handoff 必须声明证明上限 |
| 是否覆盖 PH-08 review responsibility | `pass` | acceptance draft 必须人工/Agent review |

## 6. 回填草稿

正式 §11 应保留：一 boundary 一 commit；实现仓英文 title/body/source、设计仓语言边界；type/scope 允许值；body boundary summary、协作分组、文件名/改动量/换行规则；提交前 gate、证据路径、用户改动保护；评审和 handoff 责任。没有真实 hash、run、report 或 review 时，所有提交/交付字段保持 pending，不得伪造。

## 7. 待确认事项

| 事项 | 当前状态 | 处理时点 |
|---|---|---|
| target repo local git identity | `not_checked / repo_absent` | 首个实现 boundary 开工前 |
| target repo historical commit style | `not_available` | 首个实现 boundary 开工前 |
| 固定 footer 是否有仓级额外要求 | `pending` | 实际 commit 前读取目标仓规则 |
| 用户是否授权实际提交 | `false` | 当前任务仅设计文档；不得提交 |

## 8. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 提交粒度与 22 boundary 对齐 | `pass` | 一 boundary 一 planned commit |
| message/type/scope/body/footer 规则完整 | `pass` | design/implementation 语言边界清楚 |
| 提交前检查和证据引用完整 | `pass` | raw/report/pairing/no-static 纳入 |
| 评审/交付纪律完整 | `pass` | acceptance draft 必须人工/Agent review |
| 当前无真实 commit/hash/evidence 事实 | `pass` | planned/pending 保真 |
| 可进入 Step 12 | `pass` | 继续定义实施完成判定 |

## 9. Step 自审记录

- [x] 已回答 Step 11 主要提交、评审和交付问题。
- [x] 已建立 type/scope、message、body、footer、语言边界和 22 boundary 映射。
- [x] 已规定真实 gate/evidence/report、用户改动保护、failed artifact 保留和 handoff 纪律。
- [x] 已完成 22 boundary 提交停审及跨提交边界审计。
- [x] 未创建实现仓、代码、测试、run、artifact/report/evidence、commit hash 或 readiness。

## 10. Step 11 停审结论

Step 11 在设计层 `done / pass / self_reviewed`，并切换为 `step_stop_review`。提交规则只定义未来实施纪律，不授权实际提交；当前目标仓不存在、所有 gate/evidence/hash 均未执行或固定。按用户授权，下一步进入 Step 12。
