# 07 Step 11：提交、评审与交付纪律

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 11
> 回填目标：正式 `07-实施计划.md` §11
> 本步状态：`completed_with_explicit_blockers`
> 事实边界：本文件定义 future 实现仓的提交与移交规则；当前只修改设计仓文档，不提交 commit，不生成实现侧 hash 或交付证据。

## 1. 仓库与语言边界

| 仓类型 | 允许修改 | commit message | 源码/注释规则 |
|---|---|---|---|
| 当前 design 仓 `/home/aris/Projects/quantalithos-design` | 仅 `projects/L2-member-images/` 设计文档与校准材料 | 本轮不提交；若用户未来授权，遵循设计仓既有英文 type、中文 subject/body、固定 footer 规则 | 设计说明可中文 |
| future implementation 仓 `/home/aris/Projects/quantalithos-member-images` | 仅当前 boundary allowed scope | 必须英文、`type(scope): subject` | Rust 标识符、rustdoc、普通注释、测试名默认英文 |

实现仓不存在时，不得在设计仓代替创建源码、Cargo manifest、脚本或测试。所有 commit/hash/status/run/artifact/report/evidence 只有在实现仓实际发生后才能记录为事实。

## 2. Commit boundary 规则

- 一笔实现提交对应一个 Step 6 boundary；不能按文件、struct、repository、route、个人当天工作量拆分。
- 同一 boundary 内的 contracts、domain/application、infra/entry 和 targeted tests 若共同构成一个可验证增量，应在一笔提交的 body 中按子功能分组说明。
- 只有当前 boundary 的 Design Gate、Scope Gate、Worktree Gate、Build/Test/Evidence Gate、Commit Gate 和 Handoff Gate 全部通过，且无 blocker，才允许提交。
- 当前 `commit-01-a` 因目标仓缺失为 `blocked / wait_design`；24 个 boundary 不产生实际 commit。

| Type | 允许范围 |
|---|---|
| `feat` | 新增一个 boundary 的设计内功能增量 |
| `fix` | 修复当前 boundary 已识别的门禁失败 |
| `refactor` | 不改变契约的内部重排 |
| `test` | 与当前 boundary 同步的测试切口修复 |
| `chore` | 工具/配置/目录壳，仍须属于当前 boundary |
| `ci` | 当前 boundary 的 gate/report/check tooling |
| `docs` | 实现仓内与当前 boundary 同步的说明 |
| `perf`、`style` | 仅在不改变 P0 语义且被 boundary 明确允许时使用 |

Scope 必须使用稳定的实现面词汇：`workspace`、`config`、`definition`、`assembly`、`build`、`qualification`、`supply`、`query`、`entry`、`job`、`evidence` 或 `handoff`；不得把 `L2` 层号、临时 issue 或 sibling 名称当作 scope。

## 3. Commit message 格式

实现仓固定格式：

```text
<type>(<scope>): <english subject>

<one-sentence boundary summary>

<sub-feature group>:
- <file_name.rs> (+/-N): <functional note>.
- <file_name.rs> (~+N/-M): <functional note>.

Co-Authored-By: Codex <noreply@openai.com>
```

规则：

- 标题后必须有真实空行；body 不得出现字面量“反斜杠+n”。
- bullet 之间不插空行；分组按“为什么属于同一 boundary”命名，不按文件类型平铺。
- 文件条目只写文件名，不写完整路径；使用 `(+N)`、`(-N)`、`(~N)` 或 `(~+N/-M)` 标记大致变更量。
- footer 前必须有真实空行；当前项目只保留固定 footer，不扩展未经批准的模型注脚。
- 需要精确控制格式时，将完整 message 写入临时文件并使用 `git commit -F` 或 `git commit --amend -F`；不得依赖 shell 拼接造成换行漂移。

合格示例（仅 planned contract，不是已执行提交）：

```text
feat(definition): add typed image variant contract shell

Typed definition and mapping-ref contract shell for PH-02-a:

Definition carriers:
- definition.rs (~+120/-0): add body-free identity and invalid-source dispositions.
- commands.rs (+24): expose the boundary request/result carrier.

Contract tests:
- definition_contract.rs (+48): cover missing, mutable and owner-mismatch refs.

Co-Authored-By: Codex <noreply@openai.com>
```

不合格示例：标题为中文、没有 scope、写完整路径、使用字面量“反斜杠+n”、bullet 间插空行、把多个 boundary 混在一笔提交、或在 B01 blocker 下宣称成功。

## 4. Boundary body 分组映射

| Boundary 组 | body 分组 | 共同增量 | 不能混入 |
|---|---|---|---|
| `01-a~01-c` | workspace/contracts；config/composition；scripts/tests/ledger | PH-01 foundation | 业务 mutation、真实报告 |
| `02-a~02-c` | definition/mapping；static assembly；revision/derivation | PH-02 asset model | build candidate、owner body |
| `03-a~03-c` | build contracts；conservative outcome；bounded selectors | PH-03 build intent | UoW/replay success、scheduler |
| `04-a~04-c` | provenance/gate；Artifact gap；qualification errors | PH-04 qualification seam | Artifact acceptance、positive eligibility |
| `05-a~05-c` | availability/history；local supply；consumer gap | PH-05 local supply | launch/health/confirmation |
| `06-a~06-c` | query/view；projection freshness；API mapping | PH-06 read surface | Query repair、transport lifecycle |
| `07-a~07-c` | inbound marker；bounded jobs；facade entries | PH-07 controlled entries | envelope/receipt/scheduler/direct I/O |
| `08-a~08-c` | fixtures/gates；reports/evidence；smoke/handoff drafts | PH-08 tooling/handoff | static pass、verdict/signoff/readiness |

每个 boundary 的具体文件分组、allowed/forbidden scope、Gate 和 evidence path 以对应 `implementation-boundaries/commit-*.md` 为准；未来若修改分组，必须同步 Step 6、Step 7、ledger 和 formal 07。

## 5. 提交前检查清单

| 检查项 | 通过条件 |
|---|---|
| repo-local identity | `quantalithos-labs` / `quantalithos.ai@gmail.com`，不改 global |
| design baseline | 当前 formal 00~07 与 boundary source 的不可变身份已记录 |
| diff scope | 只覆盖一个 boundary 的 allowed scope，无用户文件误纳入 |
| design closure | 字段/DTO/support carrier/state/ref/validation/phase boundary 无未登记缺口 |
| build/test | 按 Gate 运行对应 fmt/check/test；当前设计期为 `not_run` |
| evidence | raw/report/EV same-run pair；当前为 `not_generated` |
| redaction/dependency | forbidden body/secret、sibling compile、outbound zero 检查通过或显式 blocked |
| message | type/scope/subject/body/footer/真实换行符合规则 |
| ledger | boundary ledger、项目 ledger、下一动作同步；blocked 时不得 commit |

## 6. Commit Gate、Handoff Gate 与评审责任

| Gate | 必须检查 | 当前实现期上限 | 责任 |
|---|---|---|---|
| Design Gate | formal 03/04/05/06、calibration、字段/DTO/state/ref/port/phase 一致 | `pass-designed` 或 `blocked` | 设计者先复核，实现者二次校验 |
| Scope Gate | allowed/forbidden 文件与依赖不越界 | `pending` 直到目标仓存在 | 实现者 + reviewer |
| Build/Test Gate | fmt/check、targeted TC、全量受影响 suite | `not_run` | 实现者执行、台账记录 |
| Evidence Gate | raw/report/EV pair、redaction、NOSTATIC、same-run | `not_generated` | test/evidence owner |
| Commit Gate | diff、message、identity、staged files、gate result | 当前 `blocked` | 实现者不得绕过 |
| Handoff Gate | post-commit status、hash、baseline、下一 boundary、blockers、报告 refs | 当前 `not_started` | 实现者整理，06 owner 审查 |

Handoff 只能提供 `draft/review_required` 输入；不能关闭 MI-UP/Q-MI、B/PF、VETO，不能填写 acceptance verdict、risk acceptance、signoff、release 或 readiness。

## 7. Artifact / report 交付检查

| 项 | 固定位置 | 未来完成条件 | 当前 |
|---|---|---|---|
| raw context/case/suite | `artifacts/test/<run_id>/` | 同一 run、机器 schema、不可改写 | `not_generated` |
| run reports | `reports/runs/<run_id>/` | 从 raw 派生 summary、suite、gate、redaction | `not_generated` |
| evidence index | `reports/runs/<run_id>/evidence-index.md` | 每个 EV 有 TC/suite/raw/report pair | `not_generated` |
| acceptance handoff | `reports/acceptance/handoff.md` | script draft + 人/Agent review | `not_created` |
| VETO/open/risk drafts | `reports/acceptance/` | 由 06 authority 审查 | `not_created` |

## 8. 提交纪律停审与跨边界审计

| 审计项 | 结论 | 处置 |
|---|---|---|
| 一 boundary 一 commit | 24 个 planned boundary 均有唯一提交身份槽位 | 未获实现授权前不填写 hash。 |
| message scope/body | 分组与 Step 6 boundary 对齐 | 任何混边界提交需退回拆分。 |
| 语言与 footer | 实现仓英文；设计仓规则分开；固定 footer | 不得跨仓继承中文源码/commit 规则。 |
| gate/evidence | 每 boundary 有 Gate、raw/report/EV 路径和责任 | 缺证据时 Commit/Handoff Gate 不通过。 |
| blocker 传播 | blocked 不可被 commit 或 handoff 改写为 ready | 回写设计或等待 owner。 |

## 9. 回填草稿、待确认事项与进入下一步

### 回填草稿（正式 §11）

实现仓采用一 boundary 一提交、英文 `type(scope): subject`、按子功能分组的 body 和固定 footer；提交前必须通过设计、范围、构建/测试、证据、redaction、依赖和台账门禁。当前目标仓不存在，`commit-01-a` 不能提交；任何未来 handoff 只提供 review-required 资料，不替代 06 验收裁决。

### 待确认事项

1. 实现仓实际 branch、git identity 和用户改动清单。
2. 未来是否保留固定 footer 的唯一文本，是否允许额外 co-author（当前计划不允许）。
3. owner closure 后新增的 positive boundary 是否改变 type/scope/body mapping。

### 进入 Step 12 条件

- 提交 message、粒度、评审、Commit/Handoff Gate 和 artifact/report 交付规则可执行。
- 设计仓与实现仓语言/权限边界明确。
- 24 boundary 的提交纪律已停审且无未登记跨边界冲突。

**Step 11 结论：`completed_with_explicit_blockers`。**

## Step 状态

`completed_with_explicit_blockers`

## 本步输入

Step 6/7、提交/台账/Rust 规范

## 本步输出

commit message、Commit/Handoff Gate、评审/交付

## 事实边界

无实现仓提交、hash 或 handoff 实例；所有真实执行事实仍保持未生成。

## SOP 问题回答

1. 每笔提交如何绑定？——一 boundary 一 commit。
2. 实现仓 message 如何写？——英文 `type(scope): subject`，按子功能分组，固定 footer。
3. 何时可提交？——所有 Design/Scope/Build/Test/Evidence/Commit/Handoff Gate 通过且无 blocker。
4. 交付能否写 verdict？——不能；只交给 06 的 review-required drafts。
## 当前文档问题诊断

- 设计仓和实现仓语言纪律不同。
- 按文件拆 commit 会破坏可验证增量和回退。
- 当前无目标仓、hash、测试或证据。
## 改动前后对比

| 项 | 之前 | 本步后 |
|---|---|---|
| 提交 | 只有 boundary 名称 | message、body、footer、时机和 Gate 完整 |
| 评审 | 泛化 code review | Design/Scope/Test/Evidence/Commit/Handoff 分层 |
| 交付 | 可能误写成功 | review-required，06 authority 外置 |
## 设计取舍

- 采用一 boundary 一提交，避免过大 diff。
- 保留同一 boundary 的协作子功能在一笔提交 body 中分组。
- 固定英文实现仓 message，防止设计仓中文说明泄漏。
## 结构化中间产物

本步结构化产物是提交格式、type/scope、body 分组、检查清单、Commit/Handoff Gate 和跨提交审计。
