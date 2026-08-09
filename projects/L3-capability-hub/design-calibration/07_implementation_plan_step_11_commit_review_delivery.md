# L3-capability-hub 07 实施计划 Step 11：提交、评审与交付纪律

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 11
> 书写规范: `standards/document/实施计划书写规范.md` §4.8~§4.9、§5.11
> 台账规范: `standards/document/代码实施台账与门禁规范.md` Commit Gate / Handoff Gate
> 回填章节: `projects/L3-capability-hub/07-实施计划.md` §11
> 输入: Step 6 的 26 个 commit boundary、Step 7 gate/evidence contract、Step 10 pause/change control
> 创建日期: 2026-07-26
> 当前模式: controlled-reopen / implementation-handoff-sync
> Fixed access-review reason controlled repair: 2026-08-09; the next design-only commit freezes the exact persisted reason contract; no implementation commit or PH-02 run exists

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 11 定义提交、评审与交付纪律 |
| 当前状态 | controlled_reopen_completed_2026-08-07 |
| candidate boundary | 26 个，`commit-01-a`~`commit-11-b` |
| planned implementation commit | 每个 boundary 恰好一笔；`commit-01-a` 与 `commit-01-b` 已真实发生，其余均未发生 |
| current design-repo git identity | `quantalithos-labs` / `quantalithos.ai@gmail.com`，仅为当前仓观察事实 |
| target implementation repo | `/home/aris/Projects/quantalithos-capability-hub` 已验证为 Git worktree；当前实现锚点为 `8e4a422a4b6477afc214eec1f2db8676f0e1c7ec` |
| implementation commit / hash | PH-01: `a4df225e3eba8cca611da3ca78f198ae36ec9045`, `8e4a422a4b6477afc214eec1f2db8676f0e1c7ec`; `commit-02-a` implementation commit 不存在 |
| unresolved upstream blocker | `0` |
| 下一动作 | 提交并冻结本次 fixed-reason design repair anchor，同步 implementation ledger，然后停止在 `commit-02-a` activation 前 |

## 2. 本步输入与 SOP 问题回答

| 输入 | 本 Step 用途 | 当前结论 |
|---|---|---|
| Step 6 boundary / batch / subgroup | 固定一 boundary 一 commit、body 分组和 commit timing | 26/26 均有唯一 planned message 与 subgroup 映射 |
| Step 7 boundary gate matrix | 固定提交前命令、raw/report、AC/VF/VETO 引用 | 证据只允许引用显式 run-scoped 路径，不粘贴日志 |
| Step 10 pause/change control | 固定禁止提交、恢复和历史保护规则 | blocker、scope drift、gate failure、用户改动混入时禁止 commit |
| 实施计划书写规范 | message、language、footer、自检 | 实现仓英文；design 仓英文 type + 中文 subject/body |
| 代码实施台账规范 | Commit Gate、Handoff Gate、planned skeleton | 真实 hash/message/status 只在实现期回写 |
| 当前 design 仓 git log/config | 只校准规范适用性 | 不把 design 仓历史提交当目标实现仓历史 |

本步回答：

1. **提交前 git identity 检查什么？** `user.name` 必须为 `quantalithos-labs`，`user.email` 必须为 `quantalithos.ai@gmail.com`；目标仓建立后必须在目标仓上下文重新读取，不能继承本次观察结果。
2. **message 参考什么？** 先读本 Step、正式 `07` §11、代码实施台账规范和目标仓近期合格提交；目标仓更严格规则只能叠加，不能放宽英文 message、固定 title 和一 boundary 一 commit。
3. **design 仓和实现仓如何区分？** `quantalithos-design` 使用英文 type、中文 subject/body；实现仓 title/body、源码标识符、普通注释、Rustdoc 和测试名默认全部英文。
4. **实现仓 title 格式是什么？** 固定 `<type>(<scope>): <subject>`，scope 必填，subject 使用祈使式或明确结果式英文，不写 boundary ID 代替语义。
5. **提交粒度是什么？** 一笔提交只对应 Step 6 一个 boundary；同一 boundary 的 contract/domain/service/fake/test 协作面按 body group 组织，不按文件、crate 或 route 拆成多笔。
6. **何时允许 commit？** 当前 boundary 的 Design、Scope、Worktree、Build、Test、适用 Evidence 和 Commit Gate 均有真实通过记录，staged diff 与 planned scope 一致后。
7. **何时禁止 commit？** target repo/baseline 未确认、设计缺口、scope drift、用户改动混入、编译或测试失败、Rustdoc 缺失、raw/report 不配对、redaction/dependency/responsibility/VETO 失败或 message 不合规时。
8. **body 如何组织？** 第一段一句英文 boundary summary；随后按本 Step §7.5 的子功能组列文件名、近似改动量和说明；只写文件名，不写完整路径。
9. **换行和 footer 如何控制？** 禁止字面量 `\n`；标题后、group 之间和 footer 前使用真实空行；bullet 之间不插空行；默认 footer 为 `Co-Authored-By: Codex <noreply@openai.com>`。
10. **如何精确提交？** 把完整 message 写入临时 message 文件，使用 `git commit -F <message-file>`；amend 仅在用户授权且符合 Step 10 历史保护规则时使用 `git commit --amend -F <message-file>`。
11. **证据如何引用？** 只引用 `reports/runs/<run_id>/...`、`reports/acceptance/...` 或 boundary ledger 字段，不粘贴完整 stdout，不引用 `latest`，不把 candidate 当 verdict。
12. **提交后回写什么？** boundary ledger 的真实 hash、message、post status、gates run、tests not run、remaining blockers、下一 boundary、用户改动未触碰清单；未提交前全部保持 pending/planned。

## 3. 当前问题诊断与设计取舍

### 3.1 问题诊断

| 问题 | 风险 | 本 Step 处理 |
|---|---|---|
| 目标实现仓历史曾不存在 | 旧设计快照无法核对仓内 identity | 当前以已验证 worktree 与 PH-01 handoff 为事实；后续仍按 current boundary 重新核对 |
| Step 6 有子功能但无 message 映射 | 实现者可能按 crate 拆提交 | 26/26 固定 body groups |
| Step 7 有 raw/report contract | 提交说明可能静态宣称 pass | 只引用 run-scoped report，真实结论由 ledger 记录 |
| evidence/report builder 在 PH-11 才完整 | 早期 boundary 可能误造最终 evidence | 早期只引用可用 targeted raw/report；不得伪造最终 index |
| design 与 implementation 语言不同 | 中文 message/source 污染目标仓 | 明确双仓语言边界和 review 检查 |
| public schema 规模大 | 结构体字段或 enum payload 注释易遗漏 | Commit Gate 必跑 Rustdoc coverage；field/variant/callable 均受 `///` 门禁 |
| 同一 boundary 涉及多层 | 按文件拆分会破坏可验证增量 | 保留一笔 commit，body 解释协作关系 |

### 3.2 设计取舍

| 方案 | 结论 | 原因 |
|---|---|---|
| 每个 batch 一笔提交 | 不采用 | batch 是 100~300 行编写单位，不是独立业务提交边界 |
| 每个 crate 一笔提交 | 不采用 | contract/domain/service/fake/test 需要共同形成可验证增量 |
| 每个 Step 6 boundary 一笔提交 | 采用 | review、rollback、evidence 和 ledger 恰好对齐 |
| 同一 boundary 出现 defect 时继续塞入原 planned commit | 条件采用 | 未提交且仍在同一 scope可修；已提交后按 Step 10 fix-forward，不改写历史 |
| body 粘贴测试日志 | 不采用 | 噪音大、可能泄密且无法稳定追溯 |
| body 只引用显式 run-scoped report | 采用 | 保持 provenance 和简洁性 |
| 使用命令行 `-m` 拼复杂 message | 不采用 | 容易产生字面量换行和空行错误 |
| 使用完整 message file + `git commit -F` | 采用 | 格式可复核、可重现 |

## 4. 提交纪律与语言边界

### 4.1 通用提交纪律

| 项 | 要求 | 检查方式 |
|---|---|---|
| git user.name | `quantalithos-labs` | 目标仓内执行 `git config user.name` |
| git user.email | `quantalithos.ai@gmail.com` | 目标仓内执行 `git config user.email` |
| 提交规范 | 本 Step、正式 `07` §11、目标仓更严格规则 | 提交前 required reads |
| 提交粒度 | 一笔提交对应一个 Step 6 boundary | boundary ledger + staged diff |
| 提交时机 | boundary 所有适用 pre-commit gates 真实通过后 | Gate Matrix |
| title | 实现仓固定 `<type>(<scope>): <subject>` | message file review |
| body | 英文 summary + 子功能分组 + 文件名/近似改动量 | message file review |
| footer | 默认固定 Codex footer，前有真实空行 | message file review |
| 源码语言 | 标识符、普通注释、Rustdoc、测试名默认英文 | review / lint / grep |
| public docs | public declaration、struct field、enum variant/payload、trait/method/callable 均有完整英文 `///` | `check_rustdoc_coverage.sh` |
| 文档同步 | 设计偏离先回写 owning formal/calibration，再固定新 baseline | design change record |
| 用户改动保护 | 不 stage、不清理、不回退无关用户文件 | Worktree Gate |

### 4.2 双仓语言边界

| 仓类型 | commit message | 源码 / 文档语言 | 当前适用性 |
|---|---|---|---|
| `quantalithos-design` | 英文 type；中文 subject/body；固定 footer | 正式设计文档和校准文档以中文为主 | 当前受控回开只提交 Capability Hub-only design repair；不提交实现代码 |
| `quantalithos-capability-hub` | title/body 全英文；title 固定 `type(scope): subject` | 标识符、普通注释、Rustdoc、测试名全英文 | 已用于 PH-01；后续 boundary 继续适用 |

### 4.3 Type / Scope 约束

| 项 | 允许值 | 使用规则 |
|---|---|---|
| type | `feat`,`fix`,`refactor`,`docs`,`test`,`chore`,`perf`,`ci`,`style` | planned 新增能力默认 `feat`；工程/配置基线可用 `chore`；实际类型必须与 diff 一致 |
| scope | `workspace`,`config`,`contracts`,`domain`,`application`,`identity`,`registry`,`identity-registry`,`descriptor`,`adapter`,`relation`,`relation-service`,`exposure`,`exposure-service`,`trace-impact`,`reference`,`query`,`query-core`,`query-extended`,`inbound`,`outbound`,`jobs`,`jobs-derived`,`jobs-recovery`,`report`,`release` | scope 必填，必须唯一回指本 Step §7.5 的 boundary |

禁止使用 `update`、`misc`、`stuff`、`wip` 或 boundary ID 作为 scope/subject 的替代语义。新增 scope 必须先受控回写正式 `07` §11 和对应 boundary skeleton。

### 4.4 Commit message 结构

| 部分 | 规则 | 示例 |
|---|---|---|
| title | `<type>(<scope>): <subject>`，全英文 | `feat(identity-registry): complete identity and registry service slice` |
| summary | body 第一段一句话说明本 boundary 的可验证增量 | `Identity and registry accepted services with transaction-safe replay for commit-03-c:` |
| body groups | 按 Step 6 子功能分组，不按目录或文件类型分组 | `Service and transaction flow:` |
| file bullet | 文件名 + 近似改动量 + 英文说明 | `services.rs (~+260/-20): add accepted command orchestration and stored-result replay.` |
| evidence | 只列真实执行期存在的 run-scoped report path | `Evidence: reports/runs/<run_id>/suites/service-command-query.md` |
| footer | footer 前真实空行；默认一行 | `Co-Authored-By: Codex <noreply@openai.com>` |

### 4.5 Body 文件条目与格式规则

| 项 | 正例 | 反例 |
|---|---|---|
| 文件名 | `services.rs` | `crates/application/src/services.rs` |
| 改动量 | `(+3)`,`(-35)`,`(~38)`,`(~+330/-60)` | `(about 120 lines)` |
| 分组 | `Receipt and replay behavior:` | `Files:` |
| 换行 | message file 中的真实换行 | `subject\n\nbody` |
| bullet 空行 | 连续 bullet 之间无空行 | 每条 bullet 后插空行 |
| evidence | `reports/runs/<run_id>/gate-summary.md` | `reports/latest` 或粘贴完整日志 |

## 5. Commit boundary 到 message / body 分组映射

### 5.1 Planned title 与 Step 6 子功能映射

下表中的 title 仅是未来实现期的 planned message，不表示 commit 已创建。实际提交前允许在不改变 boundary 语义的前提下微调 subject，但 type、scope 或子功能分组发生实质变化时必须先更新正式 `07` 和 ledger。

| Boundary | Planned title | Step 6 子功能 -> body group | 为什么必须同一笔提交 |
|---|---|---|---|
| `commit-01-a` | `chore(workspace): establish the capability hub workspace skeleton` | workspace manifest + seven member skeletons -> `Workspace and member layout:`；dependency/name checks -> `Dependency and naming boundaries:` | layout、member identity 和唯一编译依赖共同构成可检查 workspace |
| `commit-01-b` | `chore(config): add strict configuration and evidence roots` | config loader/profile shell -> `Strict configuration baseline:`；scripts/artifact/report roots + path checks -> `Run-scoped tooling roots:` | strict loader 与显式 run roots 共同形成后续执行基线 |
| `commit-02-a` | `feat(contracts): add the public capability contract foundation` | refs/metadata/closed errors -> `Typed references and metadata:`；shared carriers/codec/Rustdoc fixtures -> `Shared contract carriers:` | public carrier 必须与 kind、error、codec 和字段注释同时闭合 |
| `commit-02-b` | `feat(domain): add capability state and policy foundations` | state guards/domain errors -> `State and error foundations:`；policies/invariants/pure tests -> `Policies and invariant tests:` | 状态、policy、negative oracle 共同定义无 infra 的 domain truth |
| `commit-02-c` | `feat(application): add ports transactions and replay foundations` | Ports/repositories/UoW -> `Application ports and transactions:`；idempotency/stored result/fakes -> `Replay and fake parity:` | Port、事务和 replay 语义缺一不可，不能按 trait/file 拆散 |
| `commit-03-a` | `feat(identity): add capability identity and access review contracts` | identity DTO/ref -> `Identity contracts:`；review state/rules/pure tests -> `Access review state and guards:` | identity 与 review source/transition 是同一 contract-domain 增量 |
| `commit-03-b` | `feat(registry): add capability registry domain contracts` | registry DTO/ref -> `Registry contracts:`；lifecycle/visibility/history tests -> `Registry lifecycle and visibility:` | current/history/version/visibility 必须在同一 domain baseline闭合 |
| `commit-03-c` | `feat(identity-registry): complete the identity and registry service slice` | service inputs/same-UoW service -> `Accepted service and transaction flow:`；fake parity/stored result -> `Repository and replay parity:`；facade/focused tests -> `Entry facade and focused verification:` | 首个 accepted slice 必须同时证明 owner、UoW、replay 与 entry facade |
| `commit-04-a` | `feat(descriptor): add safe adapter descriptor contracts` | descriptor contracts -> `Descriptor contracts:`；risk/secret-safe domain + body-free tests -> `Risk and secret-safe guards:` | descriptor state、typed secret ref 与 body-free redline必须同一基线 |
| `commit-04-b` | `feat(adapter): add the external adapter descriptor service seam` | source/descriptor resolver + controlled/disabled fake -> `Descriptor resolution adapters:`；service/config/API seam -> `Service and configuration binding:` | 外部接入合同需要 resolver、failure mapping、config 和 facade 同时可验证 |
| `commit-05-a` | `feat(relation): add governance and method relation contracts` | seam refs/results -> `Governance seam contracts:`；relation state/guards/no-body tests -> `Method relation and body-free guards:` | 非拥有引用和 body-free relation 共同建立责任边界 |
| `commit-05-b` | `feat(relation-service): add controlled governance and method relation services` | service inputs/UoW/repositories -> `Relation service and persistence:`；controlled resolver/fake + tests -> `Controlled seam parity:` | accepted relation path必须同时验证 typed ref、transaction 和 resolver parity |
| `commit-06-a` | `feat(exposure): add formal exposure and visibility contracts` | exposure DTO/applicability -> `Exposure contracts:`；visibility state/guards/tests -> `Visibility state and guards:` | exposure source 与 visibility semantics 必须同一 domain baseline |
| `commit-06-b` | `feat(exposure-service): add controlled consumer exposure services` | view material/resolver/assembler -> `Controlled consumer view:`；server facade/freshness tests -> `Server exposure and freshness:` | material source、visibility resolver、facade 和 marker 同时闭合才可只读暴露 |
| `commit-07-a` | `feat(trace-impact): add capability trace and impact services` | trace carrier/impact/revision -> `Trace and impact contracts:`；source symmetry/capture/redaction tests -> `Source symmetry and safe capture:` | source、revision、impact、capture 对称性不可拆成孤立 DTO |
| `commit-07-b` | `feat(reference): add canonical capability reference resolution` | typed reference DTO/state -> `Canonical reference contracts:`；resolver/fake/symmetry tests -> `Reference resolution parity:` | kind、missing/degraded state、sidecar 和 resolver parity 共同定义引用真相 |
| `commit-08-a` | `feat(query): add query response and read port foundations` | page/cursor/marker DTO -> `Query response contracts:`；read ports/no-write fixtures -> `Read-only port foundations:` | response marker 与只读 Port 必须共同阻止 query mutation |
| `commit-08-b` | `feat(query-core): add core capability query services` | Q01~Q10 -> `Identity registry and descriptor queries:`；Q11~Q19 -> `Relation and exposure queries:`；no-write/visibility tests -> `Core query safeguards:` | 19 个 core Query 共用 resolver-first、marker 和 no-write contract |
| `commit-08-c` | `feat(query-extended): add trace and material query services` | Q20~Q28 -> `Trace impact and directory queries:`；Q29~Q33 -> `Reference and material queries:`；freshness/redaction tests -> `Extended query safeguards:` | extended reads 共用 source/version/freshness/body-free material contract |
| `commit-09-a` | `feat(inbound): add inbound receipt and worker intake seams` | envelope/header gate -> `Header-first intake contracts:`；receipt/dedup/replay -> `Receipt and replay behavior:`；worker lifecycle/tests -> `Inbound worker lifecycle:` | decode gate、receipt、dedup 和 lifecycle 共同保证不反写外部 truth |
| `commit-09-b` | `feat(outbound): add outbound collaboration snapshot seams` | event envelope/snapshot/capture -> `Immutable outbound snapshots:`；mapper/facade/continuation tests -> `Collaboration continuation:` | accepted source snapshot 与 post-commit continuation 必须保持同一语义 |
| `commit-10-a` | `feat(jobs): add job protocol journal and report foundations` | job input/journal/checkpoint -> `Job protocol and journal:`；frozen plan/target/result/report -> `Frozen plans and typed reports:` | public Job schema、checkpoint、plan 与 result/report 必须可 replay |
| `commit-10-b` | `feat(jobs-derived): add derived material and reconciliation jobs` | J01~J05 -> `Derived material jobs:`；J06~J07 + terminal reports -> `Reconciliation and terminal reports:` | target selection、read material 和 immutable report 共同阻止 truth repair |
| `commit-10-c` | `feat(jobs-recovery): add event recovery and replay jobs` | J08/recovery/capture binding -> `Event recovery flow:`；duplicate/reentry/failure terminalization -> `Replay and terminalization:` | recovery authority、replay 和 terminal result 必须在同一 transaction boundary 验证 |
| `commit-11-a` | `feat(report): add run reports and evidence index builders` | raw schemas/suite reports -> `Run-scoped raw and reports:`；checks/pairing/redaction -> `Provenance and safety audits:`；evidence index -> `Evidence candidate indexing:` | raw、report、audit 和 index 必须由同 run provenance链生成 |
| `commit-11-b` | `feat(release): add release smoke and acceptance handoff shells` | release gate/smoke -> `Release gate aggregation:`；VETO/handoff/open issue/risk drafts -> `Acceptance and review handoff:` | lower-run aggregation与 pending-review drafts共同形成可送审而非已裁决交付 |

### 5.2 提交时机、评审责任与证据 / Handoff 映射

| Boundary | Commit timing | 主评审责任 | Report / evidence reference | Handoff Gate 最小交付 |
|---|---|---|---|---|
| `commit-01-a` | workspace fmt/check、dependency/name/Rustdoc targeted 检查通过后 | repository owner + contracts owner | static-contract/dependency targeted report；无 canonical EV | 真实 hash/message、targeted member/dependency checks、canonical assembly owner=`commit-11-a`、`commit-01-b` |
| `commit-01-b` | strict parse、path schema、script dry-run、no-static targeted 检查通过后 | config owner + test tooling owner | targeted runtime-binding/configuration-strict/path reports；无 canonical EV | config/path checks、canonical assembly owner=`commit-11-a`、`commit-02-a` |
| `commit-02-a` | public contract compile、codec、Rustdoc targeted coverage 通过后 | contracts owner + domain owner | contract foundation targeted report；无 domain-state report | public schema/Rustdoc checks、不得创建 FOUNDATION-002 chain、`commit-02-b` |
| `commit-02-b` | 638 pair registry完整且state/policy negative tests通过后 | domain owner + test owner | domain-state report and pair check | 24 STATE primary、FOUNDATION targeted、pair count/provenance、`commit-02-c` |
| `commit-02-c` | Port/method parity、22 TX、idempotency/replay/fake parity通过后 | application owner + transaction reviewer | repository-transaction/service targeted reports | 22 TX primary、FOUNDATION targeted、UoW/replay checks、`commit-03-a` |
| `commit-03-a` | identity/access-review contract-domain targeted gates通过后 | identity owner + design closure reviewer | identity contract targeted report；无新增 primary EV | source/state review、`commit-03-b` |
| `commit-03-b` | registry current/history/visibility targeted gates通过后 | registry owner + design closure reviewer | registry contract targeted report；无新增 primary EV | history/visibility review、`commit-03-c` |
| `commit-03-c` | C01~C08 accepted/rejected/duplicate/race、same-UoW、no-write通过后 | application owner + identity/registry owners | service-command-query and transaction reports | 8 primary command results、`commit-04-a` |
| `commit-04-a` | descriptor state、typed secret ref、body-free/redaction targeted gates通过后 | descriptor owner + security/redaction reviewer | descriptor/domain/redaction targeted reports | safe-field review、`commit-04-b` |
| `commit-04-b` | resolver/fake/config/failure mapping/API seam gates通过后 | adapter owner + config owner | descriptor service/runtime-binding/config reports | selected unavailable 分类、`commit-05-a` |
| `commit-05-a` | governance/method relation owner separation与body-free gates通过后 | relation owner + governance/method boundary reviewers | relation contract/responsibility/redaction reports | owner/non-body review、`commit-05-b` |
| `commit-05-b` | relation UoW、resolver parity、receipt precursor和negative gates通过后 | application owner + relation owner | service/transaction/inbound targeted reports | seam parity and no-approval-mutation review、`commit-06-a` |
| `commit-06-a` | exposure/applicability/visibility state与source symmetry通过后 | exposure owner + SDK boundary reviewer | exposure contract/domain targeted reports | no-runtime/no-client review、`commit-06-b` |
| `commit-06-b` | controlled view、freshness/degraded markers、no-write/binding通过后 | exposure owner + query reviewer | exposure service/runtime-binding reports | server-only exposure review、`commit-07-a` |
| `commit-07-a` | trace/impact/revision/capture source symmetry、TX和redaction通过后 | trace owner + redaction reviewer | trace-impact/transaction/redaction reports | source/capture audit、`commit-07-b` |
| `commit-07-b` | typed kind、missing/degraded/invalid、resolver parity和dependency checks通过后 | reference owner + dependency reviewer | reference/inbound/transaction/check reports | body-free typed-ref review、`commit-08-a` |
| `commit-08-a` | shared response DTO/read Port/Rustdoc/no-write fixtures通过后 | query owner + contracts reviewer | query-foundation targeted report；无新增 EV | all field/variant `///` review、`commit-08-b` |
| `commit-08-b` | Q01~Q19 全部 primary raw、visibility/no-write=0 checks通过后 | query owner + capability-family owners | core query suite and pairing report | 19 Query owner/provenance、`commit-08-c` |
| `commit-08-c` | Q20~Q33 全部 primary raw、freshness/body-free/no-write通过后 | query owner + material/redaction reviewers | extended query/material/redaction reports | 14 Query owner/provenance、`commit-09-a` |
| `commit-09-a` | header-first、receipt replay、dedup、worker cleanup和redaction通过后 | inbound owner + worker owner | entry-inbound/runtime-binding/redaction reports | 6 INBOUND primary、FOUNDATION targeted and lifecycle cleanup、`commit-09-b` |
| `commit-09-b` | immutable snapshot、capture、post-commit continuation和failure tests通过后 | outbound owner + collaboration reviewer | outbound-collaboration/transaction/redaction reports | 10 primary rows and no-delivery-truth review、`commit-10-a` |
| `commit-10-a` | public Job schema、journal/frozen plan/result/report Rustdoc与targeted protocol tests通过后 | jobs owner + contracts reviewer | job protocol targeted report；无 canonical EV | zero primary、FOUNDATION/JOB owner links、public schema docs and replay carrier review、`commit-10-b` |
| `commit-10-b` | J01~J07 target/terminal/report/no-truth-repair gates通过后 | jobs owner + material owner | jobs lifecycle/configuration reports | 7 primary rows and terminal reports、`commit-10-c` |
| `commit-10-c` | J08 recovery、duplicate/reentry、commit-unknown和terminalization通过后 | jobs owner + transaction reviewer | jobs lifecycle/transaction/idempotency reports | 1 primary row and recovery limits、`commit-11-a` |
| `commit-11-a` | 60 cross-phase primary、full 189 owner、638 pairs、83 flows、same-run pairing、redaction/dependency/no-static audits通过后 | test tooling owner + evidence reviewer | all 10 suite reports、summary/gate-summary/report-audit/evidence-index candidates | FOUNDATION/BIND/CONFIG/OBS 60 primary；189/189 missing=0 duplicate=0；non-verdict status、`commit-11-b` |
| `commit-11-b` | lower-run refs、release smoke、37 AC/13 VF/23 VETO draft schema和review assignment完整后 | release owner + authorized acceptance/review owners | release report and `reports/acceptance/*` pending-review drafts | no default verdict/signoff、next action=`handoff` or authorized review |

上述 Handoff Gate 中的 hash、message、gate 结果、run path 和下一 boundary 都只能在真实实现期填写。设计期 skeleton 必须保留 `pending` / `planned`，未来 boundary 必须是 `wait_until_current`。

## 6. Commit message 正反例

### 6.1 合格 planned 示例

```text
feat(identity-registry): complete the identity and registry service slice

Identity and registry accepted services with transaction-safe replay for commit-03-c:

Accepted service and transaction flow:
- services.rs (~+260/-20): add accepted command orchestration with same-unit-of-work persistence.
- unit_of_work.rs (~+90/-10): bind identity and registry writes to explicit commit resolution.
Repository and replay parity:
- memory.rs (~+180/-25): add versioned repositories and stored-result replay parity.
- idempotency.rs (+95): preserve the canonical winner and duplicate typed result.
Entry facade and focused verification:
- facade.rs (+120): expose the application service slice without repository access.
- identity_registry_tests.rs (~+240): cover accepted, rejected, duplicate, race, and query no-write branches.
Evidence:
- reports/runs/<run_id>/suites/service-command-query.md
- reports/runs/<run_id>/suites/repository-transaction.md

Co-Authored-By: Codex <noreply@openai.com>
```

该示例是格式合同，不是已存在的 commit、文件改动量、run 或 report。

### 6.2 不合格示例与原因

```text
feat: 完成 capability hub
Identity and registry work:\n\n
- crates/application/src/services.rs (+260): add services.

- crates/infra/src/memory.rs (+180): add fake.
Evidence: reports/latest
Co-Authored-By: Codex <noreply@openai.com>
```

| 问题 | 原因 |
|---|---|
| 缺 scope | 无法唯一回指 `commit-03-c` |
| 实现仓 subject 中文 | 违反实现仓英文 message 边界 |
| 字面量 `\n` | 不是实际换行 |
| 完整路径 | body 文件条目只允许文件名 |
| bullet 间空行 | 破坏固定 body 格式 |
| 按文件平铺 | 没有表达协作子功能为何同提交 |
| `reports/latest` | 非显式 run-scoped provenance |
| footer 前无空行 | footer 格式不合规 |

### 6.3 不合格拆分与合并

| 反例 | 处理 |
|---|---|
| 分三笔提交 `add identity service`、`add memory repository`、`add facade tests` | 若共同属于 `commit-03-c`，合并为一笔并按三个 body group 组织 |
| 一笔提交混入 `commit-03-c` 与 `commit-04-a` | 拆为两个 boundary；先完成并 handoff `03-c` |
| `commit-11-a` 顺便生成最终通过 verdict | 移除越权内容；builder 只能生成 candidate/pending-review |
| 已提交 `commit-08-b` 后 amend 加 `commit-08-c` | 禁止；按新 boundary 正常提交，保护历史 |

## 7. 提交前、评审与交付纪律

### 7.1 提交前检查清单

| 检查项 | 通过条件 | 失败动作 |
|---|---|---|
| target repo | 真实仓、branch/worktree 和 baseline 已在 project ledger 记录 | `PAUSE-CH-01` |
| git identity | 目标仓内读取的 name/email 与要求一致 | 修正仓级配置后重检 |
| required reads | project ledger、boundary skeleton、正式 `03/04/05/06/07` exact sources 已读 | `read_docs` |
| boundary activation | 当前 boundary 是项目台账唯一 current；未来 boundary 未提前激活 | `wait_until_current` |
| design closure | field/DTO/ref/Port/state/config/evidence/phase 闭环无 blocker | `wait_design` |
| staged diff | 只覆盖一个 boundary allowed scope | 拆 staging；不清理用户改动 |
| worktree ownership | 用户和其他 agent 改动已列出且未 stage/回退 | `PAUSE-CH-04` |
| source language | identifiers/comments/Rustdoc/tests 全英文 | `fix_gate_failure` |
| Rustdoc coverage | 所有 public declaration、struct field、enum variant/payload、trait/method/callable 有英文 `///` | 阻止提交 |
| build/test gates | Step 7 当前 boundary 的 fmt/check/targeted tests/check scripts 已真实通过 | `fix_gate_failure` |
| evidence gate | 适用 raw/report/digest/pairing/redaction 同 run；不适用有明确理由 | `invalid_artifact` 或阻止提交 |
| VETO/responsibility | 无命中；runtime/tools/governance/method body/marketplace/provider/SDK client/backend未泄漏 | `wait_design` / VETO |
| message title | type/scope/subject 与 §5.1 planned boundary 一致 | 修 message file |
| message body | 英文 summary、正确 subgroup、仅文件名、近似改动量 | 修 message file |
| message whitespace | 无字面量 `\n`；bullet 间无空行；footer 前真实空行 | 修 message file |
| evidence references | 只引用真实存在的显式 run-scoped report；无 `latest`/静态 pass | 阻止提交 |
| diff whitespace | `git diff --cached --check` 通过 | `fix_gate_failure` |
| Commit Gate | staged scope、unrelated changes、message、whitespace、required checks均记录 | 未 pass 不得 commit |

### 7.2 评审纪律表

| 评审面 | 必须审查 | 责任分工 | 不通过处理 |
|---|---|---|---|
| boundary scope | Step 6 allowed/forbidden、phase predecessor、subgroup完整性 | implementation owner + boundary domain owner | 拆分/移除越界改动 |
| design closure | public schema、DTO构造、state、Port、TX、config、evidence source | design owner先闭合；implementer二次核对 | `wait_design` |
| responsibility | Hub只拥有 identity/registry/descriptor/relation/exposure/trace/reference/read/material seams | architecture/domain reviewer | VETO；回写 formal authority |
| transaction/replay | UoW、winner、receipt/capture/job replay、Unknown处理 | application/transaction reviewer | 当前 boundary non-pass |
| query/job/event | query no-write、job no-truth-repair、post-commit outbound | protocol family owner | 当前 boundary non-pass |
| dependency/config | 只有 `core-contracts` compile sibling、strict source/profile、无fallback | dependency/config reviewer | 当前 boundary non-pass |
| redaction | body、secret value、unsafe finding、provider details不泄漏 | security/redaction reviewer | VETO / failed artifact |
| tests/evidence | selector owner、raw/report pairing、digest、run identity、negative branch | test tooling/evidence reviewer | `invalid_artifact` / rerun |
| message/diff | 一 boundary 一 commit、英文 message/source、footer、用户改动保护 | commit reviewer | Commit Gate pending |
| handoff | hash、message、gates、tests not run、blockers、next boundary、untouched changes | current owner + next owner | Handoff Gate pending |

### 7.3 交付纪律表

| 时机 | 必须记录 | 固定位置 | 禁止 |
|---|---|---|---|
| boundary 开工前 | design baseline、current boundary、required reads、allowed/forbidden scope | project/boundary ledger | 无 ledger 直接落码 |
| commit 前 | staged files、message、required checks、evidence status | boundary Commit Gate | pending gate 提交 |
| commit 后 | committed hash/message、post status | boundary Commit Record | 设计期预填 hash |
| boundary handoff | gates run、tests not run、remaining blockers、next boundary、untouched user changes | boundary Handoff Gate + project ledger | 只说“完成”不列恢复点 |
| release handoff | lower run IDs、summary/gate/evidence paths、VETO/open issues/risk drafts、review owner | `reports/acceptance/*` / `reports/review/*` | builder 自动 verdict/signoff |
| design blocker handoff | exact source gap、affected boundary、forbidden workaround、next action | project ledger blocker + design change record | 实现端私补 schema |

### 7.4 Artifact / report 交付检查表

| 输出 | Canonical path | 交付条件 | 当前设计期状态 |
|---|---|---|---|
| raw artifacts | `artifacts/test/<run_id>/raw/` | explicit run/attempt/context；failed/invalid记录不可覆盖 | `commit-02-a`/full-main/business canonical raw 未创建；PH-01 targeted tooling raw 仅以实现仓 ledger 记录为准 |
| suite reports | `reports/runs/<run_id>/suites/<suite-id>.md` | 由 same-run raw builder 生成 | `commit-02-a`/full-main/business canonical reports 未创建；PH-01 targeted reports 不被本表否认 |
| run summary | `reports/runs/<run_id>/summary.md` | 189 owner、638 pair和checks可追溯 | `commit-02-a`/full-main summary 未创建；PH-01 historical run records 由实现仓 ledger 管理 |
| gate summary | `reports/runs/<run_id>/gate-summary.md` | GATE-01~09由raw/report推导 | `commit-02-a`/full-main gate summary 未创建；不得把 PH-01 targeted gate records升级为业务 verdict |
| evidence index | `reports/runs/<run_id>/evidence-index.md` / `.json` | candidate-only；回指same-run TC/DS/EV raw/report | `commit-02-a`/full-main canonical evidence index 未创建；PH-01 tooling records不构成业务 evidence |
| redaction audit | `reports/runs/<run_id>/redaction-check.md` | finding只含safe location/class/code | `commit-02-a`/full-main business audit 未创建；PH-01 targeted checks仅按实现仓 ledger引用 |
| dependency audit | `reports/runs/<run_id>/dependency-boundary.md` | 无非core compile edge | `commit-02-a`/full-main business audit 未创建；PH-01 targeted dependency record保留为历史事实 |
| report audit | `reports/runs/<run_id>/report-audit.md` | pairing/digest/no-static/builder inputs完整 | `commit-02-a`/full-main business audit 未创建；不否认 PH-01 tooling audit record |
| acceptance handoff | `reports/acceptance/handoff.md` | 显式run IDs；authorized reviewer审查 | 不存在 |
| veto checklist | `reports/acceptance/veto-checklist.md` | 23 VETO方向逐项真实审查 | 不存在 |
| open issues | `reports/acceptance/open-issues.md` | S/A/B/R、owner、retest/acceptance状态明确 | 不存在 |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | 仅真实conditional路径；有acceptor/expiry/trigger | `commit-02-a`/full-main acceptance risk 未创建；accepted residual=`0`，PH-01 tooling records不构成 risk acceptance |

本表中“未创建”只针对 `commit-02-a`、full-main 或业务 canonical evidence/acceptance 产物；不否认 PH-01 已由实现仓 ledger 记录的 targeted tooling artifacts/reports。任何 PH-01 路径都不能被提升为 `FOUNDATION-002` canonical chain、业务 verdict、risk acceptance 或 signoff。

Raw artifact 的存在不自动允许 commit；report 的存在不自动形成 evidence；candidate index 不自动形成验收 verdict；handoff draft 不自动形成 signoff。

### 7.5 Handoff Gate 固定检查

| 检查项 | 真实实现期证据 |
|---|---|
| commit hash | 当前 boundary 真实 hash |
| committed message | 与 message file / `git log -1` 一致 |
| gates run | 命令、run/attempt、report path |
| tests not run | 原因、影响、是否阻塞 next boundary |
| remaining blockers | blocker ID、owner、next action |
| next boundary | Step 6 唯一后继或 `handoff` |
| project ledger | 当前恢复点已同步 |
| boundary ledger | Commit/Handoff Gate 已同步 |
| user-owned changes untouched | 文件列表或明确 `none observed`，必须来自真实 worktree审查 |

## 8. Commit discipline 停审与跨 boundary 审计

### 8.1 26/26 boundary 停审

| Boundary | diff / scope | type / scope | summary / groups | timing / evidence | Handoff | 设计期结论 |
|---|---|---|---|---|---|---|
| `commit-01-a` | workspace only | `chore(workspace)` | 2 groups | static/dependency | next `01-b` | pass-designed |
| `commit-01-b` | config/tool roots | `chore(config)` | 2 groups | config/path/no-static | next `02-a` | pass-designed |
| `commit-02-a` | contract foundation | `feat(contracts)` | 2 groups | compile/codec/Rustdoc | next `02-b` | pass-designed |
| `commit-02-b` | domain foundation | `feat(domain)` | 2 groups | state/policy/638 pairs | next `02-c` | pass-designed |
| `commit-02-c` | application foundation | `feat(application)` | 2 groups | Port/TX/replay | next `03-a` | pass-designed |
| `commit-03-a` | identity contract-domain | `feat(identity)` | 2 groups | targeted contract/state | next `03-b` | pass-designed |
| `commit-03-b` | registry contract-domain | `feat(registry)` | 2 groups | history/visibility | next `03-c` | pass-designed |
| `commit-03-c` | accepted service slice | `feat(identity-registry)` | 3 groups | service/TX/replay/no-write | next `04-a` | pass-designed |
| `commit-04-a` | descriptor contract-domain | `feat(descriptor)` | 2 groups | redaction/body-free | next `04-b` | pass-designed |
| `commit-04-b` | adapter descriptor seam | `feat(adapter)` | 2 groups | service/config/binding | next `05-a` | pass-designed |
| `commit-05-a` | governance/method relation contracts | `feat(relation)` | 2 groups | responsibility/body-free | next `05-b` | pass-designed |
| `commit-05-b` | controlled relation services | `feat(relation-service)` | 2 groups | service/TX/redaction | next `06-a` | pass-designed |
| `commit-06-a` | exposure contract-domain | `feat(exposure)` | 2 groups | state/source symmetry | next `06-b` | pass-designed |
| `commit-06-b` | server exposure service | `feat(exposure-service)` | 2 groups | no-write/binding/freshness | next `07-a` | pass-designed |
| `commit-07-a` | trace/impact service | `feat(trace-impact)` | 2 groups | TX/capture/redaction | next `07-b` | pass-designed |
| `commit-07-b` | typed reference service | `feat(reference)` | 2 groups | resolver/dependency/body-free | next `08-a` | pass-designed |
| `commit-08-a` | query foundation | `feat(query)` | 2 groups | DTO/Rustdoc/no-write | next `08-b` | pass-designed |
| `commit-08-b` | Q01~Q19 | `feat(query-core)` | 3 groups | 19 primary/no-write | next `08-c` | pass-designed |
| `commit-08-c` | Q20~Q33 | `feat(query-extended)` | 3 groups | 14 primary/material/redaction | next `09-a` | pass-designed |
| `commit-09-a` | inbound intake/receipt | `feat(inbound)` | 3 groups | header/receipt/replay | next `09-b` | pass-designed |
| `commit-09-b` | outbound collaboration | `feat(outbound)` | 2 groups | snapshot/post-commit | next `10-a` | pass-designed |
| `commit-10-a` | Job foundation | `feat(jobs)` | 2 groups | protocol/Rustdoc/replay | next `10-b` | pass-designed |
| `commit-10-b` | J01~J07 | `feat(jobs-derived)` | 2 groups | terminal/no-repair | next `10-c` | pass-designed |
| `commit-10-c` | J08/recovery | `feat(jobs-recovery)` | 2 groups | replay/Unknown/terminal | next `11-a` | pass-designed |
| `commit-11-a` | builders/audits | `feat(report)` | 3 groups | 189/638/provenance | next `11-b` | pass-designed |
| `commit-11-b` | release/handoff shell | `feat(release)` | 2 groups | lower runs/VETO/review | handoff | pass-designed |

`pass-designed` 只表示纪律定义完整，不表示任何 future gate、commit 或 handoff 已通过。

### 8.2 跨提交边界纪律审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 26 个 boundary 是否都有唯一 planned title | 通过 | 26/26，scope 无重复歧义 |
| Step 6 子功能是否全部映射到 body group | 通过 | 26/26，未按文件平铺 |
| 一 boundary 一 commit 是否固定 | 通过 | batch 不独立提交，跨 boundary 必须拆分 |
| commit timing 是否绑定 Step 7 gate | 通过 | 26/26 均有最低门禁方向 |
| review responsibility 是否覆盖 design/test/security/dependency | 通过 | 按 boundary 适用 owner 分配 |
| evidence 引用是否 run-scoped | 通过 | 禁止 `latest`、静态 pass、完整日志 |
| language boundary 是否明确 | 通过 | design 中文 subject/body；实现仓全英文 |
| footer/空行/字面量换行规则是否明确 | 通过 | 固定 Codex footer；message file控制 |
| Rust struct/enum field 注释是否进入 Commit Gate | 通过 | public field/variant/payload/callable均要求英文 `///` |
| Handoff Gate 是否能恢复 | 通过 | hash/message/gates/blockers/next/user changes字段完整 |
| 是否伪造 commit/run/evidence/verdict/signoff | 通过 | 仅引用实现仓 ledger 中真实 PH-01 commits/runs；本修复未创建新 run、canonical evidence、verdict 或 signoff |

## 9. 回填草稿

正式 `07-实施计划.md` §11 应保留：

1. 一笔实现提交对应一个 Step 6 boundary，同一 boundary 内按子功能分组，不按 crate/file 拆提交。
2. 实现仓 title/body 与源码默认英文，title 固定 `type(scope): subject`；design 仓使用英文 type + 中文 subject/body。
3. 固定 footer、真实空行、禁止字面量 `\n`、只写文件名和近似改动量。
4. 26 个 boundary 的 planned title/body group/timing/reviewer/report/handoff 摘要。
5. Commit Gate、Handoff Gate、artifact/report 交付检查和用户改动保护。
6. 所有 hash/run/report/evidence/verdict/signoff 只记录真实事实；当前仅 PH-01 hash/run/tooling report 存在，`commit-02-a`/full-main business evidence、verdict、risk acceptance 和 signoff 不存在。

## 10. 待确认事项

| 事项 | 当前结论 | 处理位置 |
|---|---|---|
| 目标仓是否有更严格 commit 规则 | PH-01 已按仓内规则提交；后续仍只能叠加不能放宽本 Step | current boundary Design Gate |
| 目标仓 branch/worktree/baseline | worktree 与 PH-01 实现锚点已建立；scanner anchor `5896471...` 已冻结；new fixed-reason design repair anchor pending | project implementation ledger preflight |
| 实际文件名和改动量 | 实现期由 staged diff 填写 | message file / Commit Gate |
| 实际 run/report path | 实现期显式 `run_id` 后填写 | boundary Evidence Gate |
| acceptance/review主体 | `OQ-CH-009` 未指派 | `commit-11-b` handoff前 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 提交纪律和双仓语言边界已定义 | 通过 | §4 |
| 26 个 planned title/body mapping已完成 | 通过 | §5.1 |
| 26 个 timing/review/evidence/handoff已完成 | 通过 | §5.2 |
| 正反例和格式控制已完成 | 通过 | §6 |
| Commit/Handoff/artifact交付检查已完成 | 通过 | §7 |
| 26/26停审和跨提交审计已完成 | 通过 | §8 |
| 未伪造真实 commit/hash/run/evidence | 通过 | PH-01 facts are recorded; this repair creates none |
| 可进入 Step 12 | 通过 | 下一步定义实施完成判定 |
