# Step 11. 定义提交、评审与交付纪律

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 11
> 回填章节: `07-实施计划.md` §11 提交、评审与交付纪律
> 参考粒度: `projects/L1-governance/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 11 定义提交、评审与交付纪律 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 6 commit boundary;Step 7 gate matrix;Step 10 pause/change rules;实施计划书写规范;代码实施台账与门禁规范 |
| 输出文件 | `projects/L1-artifact/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 12 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 6 `commit-01-a`~`commit-08-b` | 已完成;用户已确认 | 固定一笔提交对应一个 commit boundary,并映射 body 分组 |
| Step 7 phase / boundary gate | 已完成;用户已确认 | 固定提交前 required checks、artifact/report 和 AC/VETO 证据引用 |
| Step 10 pause / rollback / change control | 已完成;用户已确认 | 固定不允许提交、必须暂停和必须回写设计的场景 |
| `实施计划书写规范.md` §4.6 | 已存在 | 提供提交边界、台账门禁和提交粒度规则 |
| `代码实施台账与门禁规范.md` §7.7 / §7.8 | 已存在 | 提供 Commit Gate、Handoff Gate 和提交后回写字段 |
| 目标实现仓 `/home/aris/Projects/quantalithos-artifact` | 当前检查未发现 | PH-01 前必须重新确认;仓不存在时不能读取本仓历史提交样例 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 提交前必须检查哪些 git 配置? | 必须检查 `git config user.name = quantalithos-labs` 和 `git config user.email = quantalithos.ai@gmail.com`;不匹配时先修正,不得提交。 |
| 提交 message 应参考哪些规范和历史提交? | 参考本 Step、`实施计划书写规范.md`、`代码实施台账与门禁规范.md` 和目标实现仓近期合格提交;目标仓不存在时以本 Step 为准,仓创建后 PH-01 补读历史。 |
| 当前仓是 design 仓还是实现仓? | 当前正在写 `quantalithos-design` 设计仓;正式代码实施目标是 `/home/aris/Projects/quantalithos-artifact`。 |
| design 仓提交语言如何控制? | design 仓使用英文 type,subject/body 可中文,AI footer 固定;本规则不放宽实现仓英文提交要求。 |
| 实现仓 commit message 如何控制? | 实现仓 title、subject、body 必须英文,title 固定 `<type>(<scope>): <subject>`。 |
| 实现仓源码语言如何控制? | 标识符、rustdoc、普通注释和测试名默认英文;中文只允许出现在项目明确要求的用户可见文案或测试 fixture 中。 |
| 允许哪些 type / scope? | type 见 §7.2;scope 必须回指 Artifact phase / surface,不得省略。 |
| 每笔提交对应哪个 boundary? | 一笔 commit 只对应 Step 6 的一个 commit boundary;不同 boundary 必须拆分。 |
| 同一 boundary 多个子功能如何提交? | 保持一笔提交,body 按 Step 6 子功能分组说明协作关系,不得按文件、crate、route 或当天工作量拆散。 |
| commit body 第一段写什么? | 第一段是一句英文 boundary summary,说明本提交形成的可验证增量。 |
| body 文件条目如何写? | 只写文件名和近似改动量,不写完整路径,每条说明文件在当前子功能中的作用。 |
| body 是否允许字面量 `\n`? | 不允许;必须用真实换行,复杂 message 用 `git commit -F <message-file>`。 |
| bullet 之间是否允许空行? | 不允许;分组之间可空一行,同组 bullet 连续。 |
| footer 策略是什么? | AI 参与时使用 `Co-Authored-By: Codex <noreply@openai.com>`,footer 前必须有真实空行;多模型 footer 只在实际参与时逐行添加。 |
| 哪些 commit 时机允许? | 当前 boundary 代码、测试、证据、Commit Gate 和 Handoff Gate 都通过后才允许提交。 |
| 哪些 commit 时机禁止? | 设计 blocker 未闭口、P0 gate 失败、staged diff 混入无关用户文件、scope 越界、静态 evidence 伪 pass、目标仓或依赖不可用时都禁止。 |
| 代码规范和测试如何检查? | 按 Step 6 / Step 7 的 required_checks 运行 `cargo fmt --check`、`cargo check`、targeted suites、script dry-run、`git diff --check` 和 `git diff --cached`。 |
| 设计偏离如何处理? | 按 Step 10 回写 `03/04/05/06/07` 或 standards,固定新 baseline 后重跑 Design Gate。 |
| 证据如何附到提交或交付说明? | 只引用 `reports/runs/<run_id>`、suite report、`reports/acceptance/*` 或 boundary ledger evidence,不粘贴完整日志。 |
| 何时拆分或合并提交? | 不同 boundary 必须拆;同一 boundary 的强相关子功能必须合并;若粒度错误,先回写 Step 6 调整 boundary。 |
| raw artifact 和 report 如何配对? | 每个 blocking suite 生成 raw artifact 后必须有对应 report;PH-08 由 `report-generation-audit` 阻断孤儿 artifact / orphan evidence。 |
| acceptance handoff 是否脚本生成即通过? | 否;`handoff.md`、`veto-checklist.md`、`risk-acceptance.md` 必须经人或 Agent 审查。 |
| 每个 boundary body 分组是否已映射? | 已在 §7.5 映射,正式装配时不得丢失。 |
| 每个 boundary 是否停审? | §7.13 完成设计层停审;执行期提交前仍需重复核。 |
| 跨提交纪律是否审计? | §7.14 已审计 scope、语言、body、evidence、diff 和 user-owned changes。 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| Step 6 | 已定义 boundary,但未定义 commit message 和 review 纪律 | 实现者可能按 crate / 文件拆提交 | 固定一 boundary 一 commit 和 body 分组映射 |
| Step 7 | 已定义门禁与 report 路径 | 提交说明可能只说“tests passed”或粘贴日志 | 固定只引用 report path 和 run_id |
| Step 10 | 已定义暂停和回写 | 还需明确哪些状态不能提交 | 增加禁止 commit 场景和 Commit Gate |
| 目标实现仓 | 当前未发现 | 暂不能读历史提交或确认 hooks | PH-01 前重新检查;本 Step 给默认纪律 |
| PH-08 | acceptance draft 需要审查 | 可能把脚本输出当 final pass | 固定人/Agent review 和 no-static-evidence |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 提交粒度 | Step 6 有 boundary,但提交纪律未落表 | 一笔提交对应一个 boundary | 保证 review、rollback 和 ledger 追踪 |
| message 格式 | 未映射到 Artifact surface | `type(scope): subject` + Artifact scope | 避免中文或模糊 subject 进入实现仓 |
| body 分组 | 未与 Step 6 子功能绑定 | 20 个 boundary 均有建议分组 | 让 reviewer 看见同提交原因 |
| 证据引用 | 分散在 Step 7 / Step 10 | 提交、PR、handoff 只引用 report path | 保持提交可读且证据可追溯 |
| 交付审查 | PH-08 只在门禁中出现 | 增加 handoff / VETO / risk acceptance 审查纪律 | 防止静态 passed |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按文件 / crate / route 拆 commit | 单笔 diff 小 | 打散可验证业务增量 | 不采用 |
| 每个 Step 6 boundary 一笔 commit | review / rollback / handoff 清晰 | 某些 boundary body 较长 | 采用 |
| 实现仓允许中文 body | 与设计仓一致 | 不利于代码仓统一审查 | 不采用 |
| 只在最终 release 写证据引用 | 提交更短 | 中间 boundary 不可追溯 | 不采用 |
| message 文件 + `git commit -F` | 格式稳定 | 多一步操作 | 采用 |

## 7. 结构化中间产物

### 7.1 提交纪律表

| 项 | 要求 | 检查方式 |
|---|---|---|
| git user.name | `quantalithos-labs` | `git config user.name` |
| git user.email | `quantalithos.ai@gmail.com` | `git config user.email` |
| 提交规范 | 本 Step + `实施计划书写规范.md` + `代码实施台账与门禁规范.md` | 提交前阅读 |
| 提交粒度 | 一笔 commit 对应一个 Step 6 commit boundary | 对照 §7.5 和 boundary ledger |
| staged diff | 只包含当前 boundary allowed_scope | `git diff --cached --name-only`;`git diff --cached` |
| required checks | Step 6 / Step 7 required_checks 全部通过或有正式 N/A 理由 | reports / command evidence |
| message 输入 | 复杂 message 使用 `git commit -F <message-file>` | shell history / review |
| handoff | 提交后回写 hash、message、gates、next boundary 和 user-owned changes | implementation ledger / boundary ledger |

### 7.2 Type / Scope 约束

| 项 | 允许值 | 说明 |
|---|---|---|
| type | `feat`;`fix`;`refactor`;`docs`;`test`;`chore`;`perf`;`ci`;`style` | 实现仓和 design 仓均使用英文 type |
| scope | `workspace`;`config`;`fact`;`intake`;`review`;`responsibility`;`version`;`lineage`;`baseline`;`query`;`projection`;`consumer`;`event`;`outbox`;`relay`;`publisher`;`job`;`handoff`;`export`;`release`;`report`;`artifact` | 实现仓必填,并能回指 Step 6 boundary |

### 7.3 Commit message 结构

| 部分 | 规则 | 正例 |
|---|---|---|
| title | 实现仓固定 `<type>(<scope>): <subject>`;英文动宾短语 | `feat(lineage): add artifact lineage relation state` |
| summary | body 第一段一句话说明 boundary 增量 | `Artifact lineage relation contracts and domain state for commit-03-b:` |
| body groups | 按 Step 6 子功能分组 | `Lineage relation contracts:` |
| file bullets | 文件名 + 近似改动量 + 文件级作用 | `lineage.rs (~+220/-8): add lineage relation DTOs and fixtures.` |
| footer | footer 前真实空行 | `Co-Authored-By: Codex <noreply@openai.com>` |

### 7.4 Commit body 文件条目规则

| 项 | 规则 | 正例 | 反例 |
|---|---|---|---|
| 文件名 | 只写文件名 | `lineage.rs` | `crates/contracts/src/lineage.rs` |
| 改动量 | 使用近似标记 | `(+3)` / `(-35)` / `(~38)` / `(~+330/-60)` | `(120 lines)` |
| 分组 | 按协作子功能分组 | `Lineage relation state:` | `Files:` |
| 换行 | 使用真实换行 | message file with real blank lines | `subject\n\nbody` |
| 空行 | 标题后空行;footer 前空行;bullet 之间不插空行 | group separated by one blank line | bullet 逐条空行 |

### 7.5 Commit boundary 到 body 分组映射

| Commit boundary | Step 6 子功能分组 | Commit body 分组名称 | 证据引用 |
|---|---|---|---|
| `commit-01-a` | workspace skeleton + naming + only-core dependency | `Workspace and package layout:`;`Core dependency boundary:` | package check / dependency report |
| `commit-01-b` | config shell + script shell + artifact/report roots | `Runtime config shell:`;`Gate and report roots:` | config smoke / script dry-run |
| `commit-02-a` | fact/intake/review/responsibility contracts + domain truth + state tests | `Artifact fact contracts:`;`Fact domain state:` | `contract-domain-fast` fact report |
| `commit-02-b` | accepted fact command service + UoW/idempotency + repo fake + api handler | `Accepted fact command flow:`;`Repository fake and idempotency:`;`API command entry:` | `service-flow-fast` fact report |
| `commit-03-a` | version contracts + version domain/history | `Artifact version contracts:`;`Version domain history:` | version contract/domain report |
| `commit-03-b` | lineage contracts + lineage relation/impact domain | `Lineage relation contracts:`;`Lineage impact state:` | lineage contract/domain report |
| `commit-03-c` | version/lineage services + runtime fake + handlers | `Version and lineage services:`;`Runtime fake and replay guards:`;`Command handlers:` | version/lineage service report |
| `commit-04-a` | baseline contracts + candidate/freeze/supersede/history domain | `Baseline contracts:`;`Freeze and supersede domain state:` | baseline contract/domain report |
| `commit-04-b` | baseline services + runtime fake + audit tests | `Baseline service orchestration:`;`History audit and runtime fake:` | baseline service/redaction report |
| `commit-05-a` | query request/response/view contracts + projection identities | `Read model contracts:`;`Projection identities and markers:` | query contract report |
| `commit-05-b` | core query services + visibility/degraded/freshness/no-write | `Query services and visibility decisions:`;`Projection freshness and no-write guards:` | query no-write report |
| `commit-05-c` | trace/report/history/backref query + API query entry | `Trace and report read surfaces:`;`API query handlers:` | API query / projection report |
| `commit-06-a` | consumer envelopes/receipts + worker input shell | `Inbound consumer contracts:`;`Worker input shells:` | inbound contract report |
| `commit-06-b` | consumer services + local snapshot/receipt/stale markers + worker entry | `Consumer service orchestration:`;`Snapshot, receipt, and stale markers:` | consumer worker report |
| `commit-06-c` | outbound event snapshot + payload builders + publisher fake + relay worker loop | `Outbound event snapshots:`;`Relay payload builders:`;`Publisher fake and relay loop:` | outbox/relay report |
| `commit-07-a` | public job schema + result/report/replay carriers | `Public job protocol surface:`;`Stored report replay carriers:` | job contract report |
| `commit-07-b` | rebuild/refresh/reconcile/report replay services | `Maintenance job services:`;`Replay and partial report output:` | operations replay report |
| `commit-07-c` | handoff/export service + jobs entry + artifact/report output | `Handoff and export services:`;`Job entry and report materialization:` | handoff/export report |
| `commit-08-a` | gate/check/report shell + evidence index shell | `Release gate shell:`;`Evidence index guardrails:` | report audit dry-run |
| `commit-08-b` | release smoke + final reports + veto/risk + acceptance handoff | `Release smoke scenario:`;`Evidence and VETO reports:`;`Acceptance handoff:` | release reports / acceptance handoff |

### 7.6 合格 commit 示例

```text
feat(lineage): add artifact lineage relation state

Artifact lineage relation contracts and domain state for commit-03-b:

Lineage relation contracts:
- lineage.rs (~+220/-8): add artifact lineage relation DTOs, impact refs, and rejection fixtures.
- refs.rs (+18): add lineage-specific typed ref variants and parsing tests.

Lineage impact state:
- lineage_state.rs (~+180/-4): add relation status transitions, illegal transition guards, and state tests.
- fixtures.rs (+64): add deterministic lineage graph and impact fixtures for contract-domain-fast.

Co-Authored-By: Codex <noreply@openai.com>
```

### 7.7 不合格 commit 反例

```text
feat(lineage): add stuff
Artifact lineage work:\n\n- crates/contracts/src/lineage.rs (+220): contracts.

- lineage_state.rs (+180): state.
Co-Authored-By: Codex <noreply@openai.com>
```

错误原因:

- 标题不说明可验证增量。
- 标题后没有真实空行。
- body 中出现字面量 `\n`。
- 文件条目写完整路径。
- bullet 之间插入空行。
- 未按 Step 6 子功能分组。
- `Co-Authored-By` 前没有真实空行。

### 7.8 不合格拆分示例

```text
commit 1: feat(lineage): add lineage DTOs
commit 2: feat(lineage): add lineage state
commit 3: test(lineage): add lineage fixtures
```

如果这三部分共同构成 Step 6 的 `commit-03-b`,必须合并为一笔提交,并在 body 中按 `Lineage relation contracts` 和 `Lineage impact state` 分组说明。

### 7.9 提交前检查清单

| 检查项 | 通过条件 |
|---|---|
| git 配置 | `user.name=quantalithos-labs`;`user.email=quantalithos.ai@gmail.com` |
| 当前 boundary | project ledger 与 boundary ledger 均激活当前 boundary |
| diff 范围 | 只覆盖一个 Step 6 commit boundary 的 allowed_scope |
| 工作区 | 无未授权用户改动 staged;`.codex/`、`target/`、无关 `.gitignore` 不混入 |
| 设计闭环 | 当前 boundary Design Gate / Scope Gate 无 blocker |
| required checks | Step 6 / Step 7 required_checks 已跑并有 evidence |
| 文档同步 | 设计偏离已按 Step 10 回写并固定 baseline |
| 源码语言 | 实现仓标识符、rustdoc、普通注释和测试名默认英文 |
| title | 实现仓固定 `<type>(<scope>): <subject>` |
| body | boundary summary + Step 6 子功能分组 + 文件名 / 改动量 |
| 空行 / 换行 | 标题后空行;footer 前空行;bullet 之间不插空行;无字面量 `\n` |
| 证据引用 | 只引用 report / acceptance path,不粘贴完整日志 |
| Commit Gate | staged scope、unrelated changes、message、whitespace、required checks 全部 pass |

### 7.10 评审纪律表

| 评审项 | 要求 | 失败处理 |
|---|---|---|
| boundary review | title/body 能回指 Step 6 boundary | 修改 message 或回写 boundary |
| design closure | 字段 / DTO / 状态 / port / version / evidence 复核记录存在 | 暂停并补设计 |
| staged scope | diff 不含后续 phase 或无关用户文件 | 重新 staging 或暂停 |
| test evidence | report 存在且来自 raw artifact | 补跑门禁或修 report generator |
| no-static-evidence | release / VETO / AC 结论从 artifact/report 推导 | 阻断提交 |
| language | 实现仓 message/source/test 英文 | 修正后提交 |

### 7.11 交付纪律表

| 交付项 | 要求 |
|---|---|
| 代码提交 | 一 boundary 一 commit,不得压缩多个 phase |
| 实施台账 | 提交前后回写 project ledger 和 boundary ledger |
| gates run | Handoff Gate 记录命令、report 路径和未跑测试理由 |
| blocker | remaining blockers 必须列明状态和 design source |
| next boundary | 只能由设计仓 project ledger 正式推进后开始 |
| user-owned changes | 交付说明必须说明用户文件未触碰或列出授权变更 |
| release handoff | PH-08 必须包含审查后的 `reports/acceptance/handoff.md` |
| VETO checklist | PH-08 必须包含审查后的 `reports/acceptance/veto-checklist.md` |
| risk acceptance | 有条件通过时必须包含审查后的 `risk-acceptance.md`;不得接受 VETO |

### 7.12 Artifact / report 交付检查表

| 检查项 | 通过条件 |
|---|---|
| artifact root | `artifacts/test/<run_id>` 存在并包含 suite raw artifacts |
| report root | `reports/runs/<run_id>` 已生成 |
| suite reports | 每个 blocking suite 有对应 `reports/runs/<run_id>/suites/<suite>.md` |
| evidence index | `reports/runs/<run_id>/evidence-index.md` 可回指 `EV-CAND-ART-*` raw artifact |
| gate summary | `reports/runs/<run_id>/gate-summary.md` 汇总 blocking / non-blocking gate |
| dependency boundary | `reports/runs/<run_id>/dependency-boundary.md` 通过 |
| redaction check | `reports/runs/<run_id>/redaction-check.md` 通过 |
| report audit | `reports/runs/<run_id>/report-audit.md` 通过 |
| acceptance handoff | `reports/acceptance/handoff.md` 已审查 |
| VETO checklist | `reports/acceptance/veto-checklist.md` 已审查 |
| risk acceptance | 有条件通过时 `reports/acceptance/risk-acceptance.md` 已审查 |

### 7.13 Commit discipline 停审记录

| Commit boundary | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `commit-01-a`~`commit-01-b` | workspace/config boundary 是否使用 `chore`/`ci`/`feat(config)` 合理 scope | 设计层通过 | 提交前按实际 diff 判断 type |
| `commit-02-a`~`commit-04-b` | fact/version/lineage/baseline truth 是否按功能 boundary 提交 | 设计层通过 | 不按 crate 横向拆 |
| `commit-05-a`~`commit-05-c` | query/projection/API boundary 是否保留 no-write 和 read-only 证据 | 设计层通过 | 提交前引用 query report |
| `commit-06-a`~`commit-06-c` | consumer/event/outbox/relay boundary 是否拆分清楚 | 设计层通过 | 不合并 inbound consumer 与 relay publish |
| `commit-07-a`~`commit-07-c` | job/handoff/export boundary 是否引用 operations reports | 设计层通过 | 不提前写 release evidence |
| `commit-08-a`~`commit-08-b` | release/report boundary 是否不生成静态 pass | 设计层通过 | PH-08 必须引用 report audit |

### 7.14 跨提交边界纪律审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 每笔提交是否对应一个 Step 6 boundary | 通过 | 规则已固定 |
| scope 是否能回指 Artifact surface | 通过 | §7.2 allowed scopes |
| body 是否按 Step 6 子功能分组 | 通过 | §7.5 mapping |
| 是否禁止按文件 / crate 拆提交 | 通过 | §7.8 反例 |
| 是否区分 design 仓和实现仓语言 | 通过 | §3 / §7.1 |
| footer 和空行规则是否明确 | 通过 | §7.3 / §7.4 |
| 证据引用是否避免粘贴完整日志 | 通过 | §7.9 / §7.12 |
| artifact/report 配对是否纳入交付检查 | 通过 | §7.12 |
| user-owned changes 是否受保护 | 通过 | §7.9 / §7.11 |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_11_commit_review_delivery.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“提交纪律表”“Type / Scope 约束”“Commit boundary 到 body 分组映射”“提交前检查清单”“评审纪律表”“交付纪律表”和“Artifact / report 交付检查表”小节。

正式 `07-实施计划.md` §11 应回填:

L1-artifact 的实现仓提交必须以 Step 6 commit boundary 为唯一默认提交单位。一笔 commit 只对应一个 boundary;不同 boundary 必须拆分;同一 boundary 内多个协作子功能必须保留为一笔提交,并在 body 中按子功能分组说明为什么属于同一个可验证增量。

实现仓 commit title 固定为 `<type>(<scope>): <subject>`,title 和 body 使用英文。scope 必须回指 Artifact surface,如 `fact`、`version`、`lineage`、`baseline`、`query`、`consumer`、`outbox`、`job`、`release` 或 `report`。源码标识符、rustdoc、普通注释和测试名默认英文。当前 design 仓提交可使用英文 type + 中文 subject/body,但不能把该口径带入实现仓。

提交前必须完成 git identity、current boundary、staged scope、Design Gate、required checks、message format、whitespace、artifact/report 和 user-owned changes 复核。Commit Gate 必须记录 staged scope、unrelated changes、commit message、whitespace 和 required checks 证据。Handoff Gate 必须记录 commit hash、gates run、tests not run、remaining blockers、next boundary 和用户改动保护说明。

提交或交付说明只引用 `reports/runs/<run_id>`、suite reports、`reports/acceptance/*` 和 boundary ledger evidence,不得粘贴完整日志。PH-08 的 `handoff.md`、`veto-checklist.md` 和 `risk-acceptance.md` 必须经人或 Agent 审查,不得用静态 `passed` 或 orphan `EV-CAND-ART-*` 替代真实 artifact/report。

## 9. 待确认事项

| 事项 | 当前结论 | 处理位置 |
|---|---|---|
| 目标实现仓是否存在历史 commit hook | 当前目标仓未发现,PH-01 前重新检查 | Step 3 / PH-01 |
| release reports 是否随 commit 入仓 | 按实现仓最终策略决定,但引用路径必须存在 | PH-08 |
| 多模型 footer | 默认只写实际参与模型;当前 Codex footer | 提交前 |
| failed artifact 保留周期 | 至少保留到 fixed run report 可追溯 | Step 12 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 提交纪律表已完成 | 通过 | §7.1 |
| message 结构和 type/scope 已完成 | 通过 | §7.2~§7.4 |
| boundary 到 body 分组映射已完成 | 通过 | §7.5 |
| 正反例已给出 | 通过 | §7.6~§7.8 |
| 提交前 / 评审 / 交付检查已完成 | 通过 | §7.9~§7.12 |
| 停审和跨提交审计已完成 | 通过 | §7.13~§7.14 |
| 正式 `07` 是否已创建 | 未创建 | 仍按 SOP 留到 Step 13 装配 |
| 可进入 Step 12 | 待用户确认 | 下一步定义实施完成判定 |
