# Step 11. 定义提交、评审与交付纪律

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 11。
>
> 回填章节：未来 `07-实施计划.md` §11 提交、评审与交付纪律。
>
> 粒度参考：`projects/L1-governance/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md`。只参考提交边界、message、评审、交付和停审结构；不继承 Governance 的 scope、提交、证据或交付结论。
>
> 事实边界：本文件定义 future implementation commit / review / handoff 规则。目标实现仓当前不存在，未发生代码修改、测试运行、artifact / report 生成、commit、review、handoff、verdict、signoff 或 readiness；下文的 title、路径和检查均是 planned 规则，不是执行记录。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 11：定义提交、评审与交付纪律 |
| 执行模式 | `full-restart + single-agent-serial`；Step 10 完成后按用户连续授权进入 |
| Step 开工确认 | 已读取项目级台账、07 flow、Step 6～10、07 SOP / 书写规范、实施台账规范、`projects/README.md` 提交规则及 L1-governance 同粒度材料 |
| 本步模块骨架 | `commit-discipline`、`message-and-scope`、`review-and-evidence-handoff`、`cross-boundary-audit` |
| 当前状态 | `completed / pass_for_design_with_explicit_blockers / serial_continuation_authorized` |
| 输出文件 | `projects/L2-member/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` |
| 正式回填 | Step 13 后回填未来 `07-实施计划.md` §11；本 Step 不写正式 07 |
| 实施事实 | `not_started`；不创建 implementation ledger / boundary skeleton，不写实现仓、不提交 |
| 下一步 | 仅进入 Step 12，定义完成判定；不能据本 Step 宣称任何 boundary 已提交或可交付 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 | 使用上限 |
|---|---|---|---|
| Step 3 前置阅读、代码仓与永久记忆规则 | 已完成 | 固定目标仓、Rust 英文源码、git identity、台账与 evidence path | 目标仓缺失仍是 blocker，不把 planned rule 写成已检查事实 |
| Step 6 18 个 commit boundary | 已完成 | 固定“一 boundary 一 future commit”、scope / body 分组和 boundary 停审 | 不调整 PH、batch、包含项或不包含项 |
| Step 7 测试、验收与报告门禁 | 已完成 | 固定提交前 check、raw→report 交付和 PH-08 review 红线 | 不运行或生成任何结果 |
| Step 8 配置、环境与依赖分类 | 已完成 | 固定 Core-only compile、external seam / candidate non-materialization 检查 | 不创建依赖、配置或 adapter |
| Step 9 风险、Spike 与 OQ | 已完成 | 固定 blocker 未闭合时禁止 commit / handoff 的时点 | 不关闭 blocker |
| Step 10 暂停、回退与变更控制 | 已完成 | 固定 design gap、gate failure、用户改动和历史保护处理 | 不执行回退、amend、rebase 或 reset |
| `projects/README.md` §8.2 | 已读取 | 固定设计仓与实现仓不同语言规则、git identity、body 和 footer 约束 | 当前不提交设计仓文档 |
| `实施计划书写规范.md` §5.11 | 已读取 | 固定 type / scope、body、footer、review 和 delivery minimum | 不能覆盖更严格目标仓规则 |
| `代码实施台账与门禁规范.md` | 已读取 | 固定 future Commit Gate / Handoff Gate 和 user-change protection | 台账仅 Step 13 后可创建 planned skeleton |

## 3. SOP 问题回答

| # | 问题 | 本项目回答 |
|---:|---|---|
| 1 | 提交前检查哪些 git 配置 | future target repo 首次提交前检查项目级 `user.name=quantalithos-labs`、`user.email=quantalithos.ai@gmail.com`；当前目标仓不存在，不能写成已检查。 |
| 2 | message 参考什么 | 先读 `projects/README.md` §8.2、`实施计划书写规范.md` §5.11、正式 07 和目标仓届时存在的合格历史；没有目标仓历史时，以本 Step 的规则为最低线。 |
| 3 | 当前仓属于什么 | 当前是 `quantalithos-design` 设计文档仓；future code commit 只发生在 `/home/aris/Projects/quantalithos-member`，该目录当前不存在。 |
| 4 | design 仓如何写 | future design-repo commit 使用英文 type、中文 subject / body、真实空行和 `Co-Authored-By: Codex <noreply@openai.com>`；本轮未获 commit 授权。 |
| 5 | 实现仓如何写 | future implementation title、body summary、body groups、file descriptions 均为英文；标识符、rustdoc、普通注释和测试名默认英文。 |
| 6 | 实现仓 title 格式 | 固定 `<type>(<scope>): <subject>`，scope 不得省略；目标仓存在更严格规则时只能叠加。 |
| 7 | 可用 type / scope | type 仅 `feat`、`fix`、`refactor`、`docs`、`test`、`chore`、`perf`、`ci`、`style`；scope 必须由本 Step §7.2 的 boundary 映射选取。 |
| 8 | 一笔提交对应什么 | 一笔 future commit 只对应 Step 6 中一个 `commit-01-a`～`commit-08-b` boundary；跨 boundary、跨 phase 或无关用户改动必须拆出。 |
| 9 | 同 boundary 如何保持一笔 | 同一 boundary 的 contracts / state / service / fake / logical entry 等协作子功能按 body group 说明，不能按目录、文件或临时工作量拆成多笔。 |
| 10 | body 第一句 | 英文一句话说明该 boundary 的可验证增量，含 boundary id 或能唯一回指其目标；不把测试结果、hash 或外部成功写进 summary。 |
| 11 | body 如何分组 | 使用 §7.3 映射的协作子功能名称；名称解释“为何必须同提交”，不能使用 `Files:`、`misc:` 或目录名。 |
| 12 | 文件名写法 | 仅写实际文件名，不写完整路径；目标仓形成后由 Scope Gate 核对，不得在当前设计阶段虚构 touched-file list。 |
| 13 | 改动量 | future body file bullet 使用近似 `(+3)`、`(-35)`、`(~38)` 或 `(~+330/-60)`；不得用伪精确行数代替 diff 检查。 |
| 14 | 换行 | 禁止字面量 `\\n`；需要精确格式时先写完整 message file，再使用 `git commit -F` 或经明确授权的 `git commit --amend -F`。 |
| 15 | bullet 空行 | 标题后、group 间、footer 前允许真实空行；同一 group 的 bullet 间不得插空行。 |
| 16 | footer | AI 实际参与的 future commit 默认使用 `Co-Authored-By: Codex <noreply@openai.com>`，且 footer 前必须有真实空行。 |
| 17 | footer 前空行 | 必须有；没有真实空行的 message 视为格式不合格。 |
| 18 | 多模型 footer | 只记录实际参与且项目规则允许的模型，每个 footer 独占一行；不得为未参与 agent 虚构注脚。本轮单 agent，不产生任何 commit footer 实例。 |
| 19 | 格式控制工具 | 复杂 message 必须用 message file 加 `git commit -F`；历史重写不属于正常实施路径，只有用户明确授权且 Step 10 范围检查通过才可考虑。 |
| 20 | 源码语言 | future Rust implementation 的 identifiers、rustdoc、comments 和 test names 默认英文；设计文档中文不迁移到代码注释。 |
| 21 | 允许 / 禁止时机 | 只有 current boundary 的 Design / Scope / Worktree / Build / Test / Evidence / Commit Gate 均有真实适用证据且无 blocker 才能提交；repo / baseline 缺失、gate 未跑、blocked、scope 混入、redaction / dependency / provenance failure、candidate materialization 或 VETO 风险均禁止。 |
| 22 | 格式化、lint 与测试 | 按 Step 6 / 7 每个 boundary 的 required checks 执行 `cargo fmt --check`、`cargo check`、targeted tests、`git diff --check` 和必要 scripts；未运行不能标 `pass`。 |
| 23 | 设计偏离如何同步 | 按 Step 10 回写 `03`（schema / Port / state / UoW）、`04`（config）、`05`（suite / evidence）、`06`（AC / VF / VETO）或 `07`（phase / boundary / delivery）；external exact contract 回到 owner。本地实现不得补洞。 |
| 24 | 证据如何附带 | future commit / PR / handoff 只引用真实 `reports/runs/<run_id>/...` 与 `reports/acceptance/...` 路径，并能回链 raw artifact；不粘贴完整日志。 |
| 25 | 何时拆 / 合 | 不同 boundary 必拆；同 boundary 的协作子功能必合。若设计发现同一 boundary 无法独立验证，应先回写 Step 6 / 07 再实施，不能临场改变粒度。 |
| 26 | 正反例 | §7.4 给出格式正例 / 反例；二者均是 future message 示例，不是仓库历史。 |
| 27 | 交付说明是否只引用路径 | 是。路径必须是实际运行时产物；`<run_id>` 是 future variable，不能在当前填入或伪造。 |
| 28 | raw artifact 是否有对应 report | future applicable boundary 必须通过 raw→report pairing；PH-08 还必须通过 report generation audit。缺任一端时不能 commit / handoff。 |
| 29 | acceptance 文件是否审查 | `handoff.md`、`veto-checklist.md` 及适用 `risk-acceptance.md` 只能先生成 draft，必须由获授权人或 Agent 审查；draft 不是 verdict / signoff。 |
| 30 | 子功能是否已映射 | 是；§7.3 为 18 个 boundary 逐个映射 Step 6 子功能到 English body groups。 |
| 31 | 分组是否解释同提交原因 | 是；每组以契约与协作关系命名，例如 `Committed source and receipts:`，不按文件类型平铺。 |
| 32 | 每个 boundary 是否完成纪律停审 | §7.7 完成 design-level stop review；execution-time 必须在真正 Commit Gate 再次核验，当前无任何 execution pass。 |
| 33 | 跨 boundary 是否完成审计 | §7.8 对 scope、粒度、语言、footer、evidence、raw/report 和用户改动处理完成 design-level audit；目标仓、baseline、真实 checks / artifacts 继续阻塞执行。 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| Step 6 | 18 个 boundary 已定义，但尚未把各自协作子功能翻译成 message body group | 实现者可能按 crate 或文件碎片提交 | 建立 boundary→scope→summary→body-group 映射 |
| Step 7 | gate、artifact / report 路径已定义，但没有统一交付引用规则 | 可能粘贴日志、把 raw 当 report，或把 draft 当 verdict | 固定路径引用、raw→report pairing、review 与禁止事实伪造 |
| Step 8 / 9 | target repo、baseline、Core、owner seam 与 DDD blocker 开放 | 可能把 planned title / scope 误读为提交许可 | 每一纪律规则声明 execution gate 仍 blocked / pending |
| Step 10 | 有暂停 / 回退规则但没有 commit 侧反混入规则 | 用户已有改动可能被 stage 或 destructive cleanup 伤害 | Commit / review / handoff 均要求 Worktree Gate 与 user-change protection |
| historical material | 旧 README 的 CloudEvents、AG-UI、UDS、launch token 等曾可能影响提交 scope | 可能把未核验 adapter / Event 工作混入 boundary | 仅以当前 Step 6 / 7 scope 为准；24 candidate 不进入任何 message 或 commit scope |

## 5. 改动前后对比

| 项 | 本 Step 前 | 本 Step 后 | 原因 |
|---|---|---|---|
| commit 粒度 | 有 boundary，缺 message 映射 | 一 boundary 一 future commit，18 个 title / group 规则可回指 | 支持 review、rollback 与 ledger |
| implementation scope | 只有技术 boundary 描述 | fixed scope vocabulary 与每个 boundary 的 scope | 防止 title 过泛或遗漏 scope |
| message body | 只有通用写法 | summary、group、filename、change-size、newline、footer 规则 | reviewer 可理解协作增量 |
| design / implementation language | 规则分散 | 明确设计仓中文与 implementation 英文边界 | 不把设计仓口径迁入代码仓 |
| evidence handoff | Step 7 有路径但未接入提交纪律 | raw→report、reviewed acceptance draft、no-log-paste 明确 | 保持 provenance 和人工裁决边界 |
| user changes | Step 10 有原则，commit 侧未细化 | Scope / Worktree Gate 强制分离和 handoff 说明 | 保护用户已存在工作 |

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 按 crate、文件或当天工作量分 commit | 不采用 | 打散同一可验证增量，无法回指 Step 6 或独立回退。 |
| 一 boundary 一 future commit，body 按协作子功能分组 | 采用 | 保持可 review、可验证、可回退的最小实施切片。 |
| 将 design-repo 中文 commit 规则带入 implementation repo | 不采用 | implementation 的源码、测试和 message 必须默认英文。 |
| 以 repo 尚不存在为由省略 title / review 规则 | 不采用 | 规划仍须固定纪律，但所有执行态保持 `planned / blocked / pending`。 |
| 为 24 outbound candidate 增加 event / outbox scope | 不采用 | `L2M-UP-005` 未关闭前禁止 materialization；不得以提交命名绕过红线。 |
| 让 generator 自动生成 acceptance verdict / signoff | 不采用 | report / draft 与审查裁决必须分层，避免 static evidence。 |

## 7. 结构化中间产物

### 7.1 提交纪律

| 项 | future 要求 | future 检查方式 |
|---|---|---|
| target repo | `/home/aris/Projects/quantalithos-member` 必须存在且有经授权的 immutable baseline | PH-01 Design Gate；当前 `L2M-DDD-001` blocked |
| git identity | `user.name=quantalithos-labs`；`user.email=quantalithos.ai@gmail.com` | `git config`，只在 target repo 存在后检查 |
| boundary 粒度 | 一笔 commit 只对应 Step 6 一个 boundary | 对照正式 07 §6、boundary ledger 与 staged diff |
| title | implementation repo 固定 `<type>(<scope>): <subject>`；英文且 scope 必填 | message-file review / Commit Gate |
| body | 英文 summary + 协作子功能 groups + actual filename / approximate diff size | message-file review；不得写完整路径、`\\n` 或 bullet 空行 |
| footer | Codex 实际参与时使用 `Co-Authored-By: Codex <noreply@openai.com>`，前有真实空行 | message-file review；不虚构其他参与者 |
| source language | Rust identifiers、rustdoc、comments、tests 默认英文 | code review / lint / targeted scan |
| allowed checks | 仅执行 current boundary 在 Step 7 指定的 future checks | Build / Test / Evidence Gate；未跑不能 pass |
| evidence reference | 只引用实际 generated report / acceptance path，且能回链 raw artifact | Evidence / Handoff Gate |
| user changes | 未授权用户改动不 stage、不 commit、不清理；handoff 说明其未触碰状态 | Worktree / Scope Gate |

### 7.2 Type / scope 约束

| 项 | 允许值 | 约束 |
|---|---|---|
| type | `feat`; `fix`; `refactor`; `docs`; `test`; `chore`; `perf`; `ci`; `style` | future implementation boundary 初始落地通常为 `feat`；缺陷修复只能在对应 current / fix boundary 选择 `fix`，不得借 type 合并范围。 |
| scope | `workspace`; `config`; `presence`; `screening`; `inbound`; `runtime`; `outbound`; `trace`; `mirror`; `projection`; `consumer`; `jobs`; `release`; `handoff` | 仅用于 Member implementation repo；必须映射本 Step §7.3 的一个 boundary。 |
| forbidden scope | `event`; `outbox`; `publisher`; `route`; `topic`; `retry`; `dlq`; `adapter`（泛化）；`all` | 前六项会误导 24 candidate materialization；后两项会掩盖 owner-specific boundary。 |

### 7.3 Planned boundary 到 message / body group 映射

> 下表是 future message 约束，不是已写入、已 staged 或已提交的记录。`planned title` 的具体 subject 可在 target repo的 Scope Gate 后按真实 boundary diff 收紧，但不得改变 scope、跨入其他 boundary 或放宽禁止项。

| Boundary | planned title | Step 6 协作子功能 | required English body groups | future report reference | 不得混入 |
|---|---|---|---|---|---|
| `commit-01-a` | `feat(workspace): establish member crate composition` | workspace root + naming + Core classification | `Workspace composition:`; `Core contract boundary:` | dependency / check report | config、CP business work、非 Core compile dependency |
| `commit-01-b` | `feat(config): add strict member composition profiles` | strict profile + composition slots + generator roots | `Profile validation:`; `Gate and report roots:` | config / dry-run report | real artifact、EV、verdict |
| `commit-02-a` | `feat(presence): add member admission and presence contracts` | subject anchor + CP01 local fact + legal transition | `Subject and admission contracts:`; `Presence state constraints:` | CP01 contract/domain report | Store / host IPC / positive host success |
| `commit-02-b` | `feat(presence): add local presence service and replay flow` | UoW service + fake parity + logical entries | `Application transaction and replay:`; `Logical entry and fake parity:` | CP01 service / entry / replay report | credential issue、host lifecycle / transport |
| `commit-03-a` | `feat(screening): add inbound scope and screening fences` | scope + inbound fact + screening fence | `Scope and inbound contracts:`; `Screening and redaction fences:` | CP02 contract / redaction report | raw body、allowlist、Bus wire |
| `commit-03-b` | `feat(inbound): add local screening service and pre-gate surface` | service + fake + worker/API pre-gate | `Scope transaction and stored replay:`; `Worker pre-gate and read surfaces:` | CP02 service / entry / replay report | supersede workaround、receipt reconstruction、broker ack |
| `commit-04-a` | `feat(runtime): add runtime mediation decision contracts` | decision + submission attempt + result / reception carrier | `Mediation contracts and state:`; `Attempt and reception fences:` | CP03 contract report | Runtime loop / context / plan / outcome |
| `commit-04-b` | `feat(runtime): add local runtime mediation orchestration` | named service + blocked seam + API/worker mapping | `Runtime boundary ports:`; `Local service and logical entries:` | CP03 service / entry report | trigger client、positive Runtime acceptance |
| `commit-05-a` | `feat(outbound): add outbound material attempt-gap boundary` | safe material + local attempt/gap + read posture | `Outbound decision and material:`; `Local handoff and replay surface:` | outbound / replay report | Event、publisher、outbox、route、topic、retry、DLQ or delivery claim |
| `commit-05-b` | `feat(trace): add redacted interaction trace posture` | trace / observation body-free facts + redacted reads | `Trace and observation facts:`; `Redacted read posture:` | trace / redaction report | observability backend、observed / evidence truth |
| `commit-06-a` | `feat(mirror): add owner-scoped context resolution boundary` | owner-safe resolution + local gap + no-write read | `Resolution and gap contracts:`; `Owner-scoped service and read surface:` | mirror / replay report | generic resolver、foreign truth、direct refresh |
| `commit-06-b` | `feat(projection): add committed member summary projection` | committed-only projection + safe views + API mapping | `Projection state and views:`; `No-write query and outlet surface:` | projection / query report | source repair、tool registry / invocation |
| `commit-07-a` | `feat(consumer): add external consumer pre-gates` | external Consumer pre-gates + safe refusal | `External source gates:`; `Rejected and blocked entries:` | consumer-entry report | generic listener、ack、DLQ、positive external success |
| `commit-07-b` | `feat(consumer): add committed-fact receipt continuation` | committed source + receipt relation | `Committed source and receipts:`; `Projection continuation:` | continuation / replay report | source scan、event candidate materialization |
| `commit-07-c` | `feat(jobs): add job carrier and stored report replay` | Job carrier + stored report + duplicate replay | `Job protocol surface:`; `Stored report and duplicate replay:` | Job contract / replay report | scheduler、external side effect / final verdict |
| `commit-07-d` | `feat(jobs): add local continuation job runners` | runner + partial report + unknown fence | `Continuation runners:`; `Partial isolation and blocked outcomes:` | Job / partial report | source repair、blind retry、delivery / observed claim |
| `commit-08-a` | `feat(release): add release gate and report generation shell` | gate shell + report/index shell | `Release gate checks:`; `Artifact-to-report generation:` | gate / report-audit dry-run output | static EV、VETO pass、signoff / readiness |
| `commit-08-b` | `feat(handoff): add local smoke and acceptance draft path` | smoke + acceptance drafts | `Fixed-run smoke path:`; `Acceptance draft material:` | fixed-run reports and reviewed drafts | manual verdict、signoff、readiness or new feature |

### 7.4 Message grammar、future positive example 与反例

```text
type(scope): English subject

One English sentence that describes exactly one commit boundary:

Collaborating sub-feature group A:
- actual_file_name.rs (~+120/-12): English functional description.
- actual_test_name.rs (+48): English verification description.

Collaborating sub-feature group B:
- actual_file_name.rs (~38): English functional description.

Co-Authored-By: Codex <noreply@openai.com>
```

future formatting example only（文件名为格式示意，不能当作已存在 target-repo 文件或已提交 diff）：

```text
feat(outbound): add outbound material attempt-gap boundary

Outbound local decision, safe material, and attempt-gap read posture for commit-05-a:

Outbound decision and material:
- outbound_decision.rs (~+140/-16): define local decision and safe material boundary tests.
- outbound_contracts.rs (+84): add body-free handoff carrier checks.

Local handoff and replay surface:
- outbound_service.rs (~+210/-22): preserve local attempt-gap and typed replay behavior.
- outbound_service_tests.rs (+96): cover blocked handoff and duplicate replay cases.

Co-Authored-By: Codex <noreply@openai.com>
```

该示例不授权 Event / publisher / outbox / route / topic / retry / DLQ，也不代表这些假想文件存在、上述检查已运行或该 commit 已产生。

不合格反例：

```text
feat(outbound): add events
Outbound work:\n\n- crates/application/src/outbound_service.rs (+210): outbound.

- crates/contracts/src/outbound_contracts.rs (+84): contracts.
Co-Authored-By: Codex <noreply@openai.com>
```

错误原因：标题没有表达 `commit-05-a` 的受限增量；body 含字面量 `\\n`；写了完整路径；bullet 间空行；没有协作子功能分组；footer 前没有真实空行；`events` 还会误导违反 `L2M-UP-005` 的 candidate materialization。

### 7.5 Future Commit Gate 检查清单

| 检查项 | 通过条件 | 失败处理 |
|---|---|---|
| target repo / baseline | target repo、immutable design baseline 和 current boundary 可核验 | `wait_design`；不得在 design repo 代写实现 |
| git identity | 两个项目级 identity 字段符合要求 | 修正 target-repo local config 后再继续 |
| Design Gate | 已读项目级 / current boundary ledger、正式 03～07 和 required calibration；无适用 design gap | `wait_design` 并回写 owning design source |
| Scope / Worktree Gate | staged diff 仅覆盖 current boundary allowed scope；用户无关改动未触碰 | 撤出 staged 范围；不 destructive cleanup |
| required checks | Step 7 所列 fmt / check / targeted test / script 已实际运行且结果可回链 | `fix_gate_failure`；未运行不能 commit |
| dependency / candidate | 仅 Core compile candidate；24 candidate 仍 non-materialized | 删除越界内容或回写 architecture / owner |
| redaction / truth | 无 body / secret leak、Query no-write、external success fence、UoW / replay / receipt规则未被绕过 | 修复当前 boundary或 `wait_design` |
| evidence | applicable raw artifact 与 report 已配对；PH-08 audit / draft review符合范围 | 修 generator / source；不得手写 pass |
| message format | title、scope、English body groups、actual filename / size、true newlines、footer 全部合格 | 重写 message file，使用 `git commit -F` |
| design synchronization | implementation发现的 schema / protocol / config / test / acceptance / phase deviation 已回写对应设计 | 固定新 baseline后重复 Design Gate |

### 7.6 Future review discipline

| review item | reviewer must verify | failure disposition |
|---|---|---|
| boundary identity | diff、title、body summary 和 §7.3 指向同一 boundary | 拆分 / 移出越界文件，不得用泛 title 掩盖 |
| design closure | fields、DTO、state、typed ref、Port、version、UoW、replay、receipt / report、phase boundary 都有正式来源 | `wait_design`，implementation 不得补 schema 或 fake-only truth |
| dependency boundary | only Core compile candidate；no generic external adapter；24 candidate unmaterialized | blocker，移除或回写 owner |
| P0 safety | double-anchor、unknown fence、body-free / redaction、Query no-write、no external-success localization | blocking defect；受影响 family 重跑 |
| gate provenance | raw output、report、digest、disposition和实际 run relation正确；blocked / not_run未改写为 pass | evidence blocker，修 generator / report path |
| acceptance handoff | PH-08 draft 由真实 report生成，且审查人与裁决责任明确 | 不得把 draft 当 verdict / signoff |
| worktree integrity | user-owned / unrelated files 未进入 staged diff或回退范围 | 停止提交，隔离当前 boundary |
| language / message | implementation English、design vs implementation rules不混用、footer真实 | 修 message / source before commit |

### 7.7 Future delivery discipline与 boundary 停审

| delivery item | future requirement | forbidden substitution |
|---|---|---|
| boundary commit | exactly one verified commit per current boundary | 将多个 PH、不同 boundary或用户文件混成一笔 |
| raw artifacts | actual runtime output 位于 `artifacts/test/<run_id>/...`，failed raw 也保留 | 手写 artifact、删除失败 raw、使用 `latest` |
| readable reports | 从同一 raw source生成 `reports/runs/<run_id>/...` | raw artifact 代替 report、static report |
| evidence index | PH-08 从真实 raw / report pair推导 | 虚构 EV、digest、run_id或通过结论 |
| acceptance drafts | `reports/acceptance/{handoff,veto-checklist,risk-acceptance,open-issues}.md` 先为 draft、再由获授权人 / Agent 审查 | generator 自动 verdict、signoff或 readiness |
| unresolved issue | blocker / residual 绑定 boundary、owner、deadline_or_trigger | 从 handoff 删除、以 commit title掩盖 |
| user changes | handoff 说明未触碰的用户文件与剩余工作区状态 | broad reset、checkout或未说明地 commit |

| Boundary set | discipline stop-review conclusion | execution posture |
|---|---|---|
| `commit-01-a/b` | workspace / config scopes、Core-only / no-static-output rule可回指 | `planned / blocked`：repo、baseline和Core mapping未闭合 |
| `commit-02-a/b` | presence scope、local / blocked host distinction和 replay body groups可回指 | `planned / blocked`：repo、credential / host seam未闭合 |
| `commit-03-a/b` | screening / inbound scopes、unknown fence和 receipt / successor redlines可回指 | `planned / blocked`：scope supersede、receipt、policy seam缺口 |
| `commit-04-a/b` | runtime scope只承接 local mediation，不把 Runtime truth混入 | `planned / blocked`：Runtime exact mapping未闭合 |
| `commit-05-a/b` | outbound / trace scopes保留 material / attempt-gap，不含 Event / observed truth | `planned / blocked`：DDD-004/005、UP-004/005未闭合 |
| `commit-06-a/b` | mirror / projection scopes保留 owner-safe / no-write边界 | `planned / blocked`：DDD-006/007和 resolver / source缺口 |
| `commit-07-a/b/c/d` | consumer / jobs scopes分离 pre-gate、receipt、report和 runner | `planned / blocked`：receipt / report / helper / source缺口 |
| `commit-08-a/b` | release / handoff scopes不产生 verdict、signoff或 readiness | `planned / blocked`：无 repo、real run、artifact / report或审查 |

### 7.8 跨提交边界纪律审计

| 审计项 | 结论 | 缺口 / 处理 |
|---|---|---|
| 18 个 boundary 均有唯一 planned scope、title 和协作 body group | `pass_for_design` | target repo存在后仍须以 actual diff 复核 filename / size。 |
| title / scope 不会把 24 candidate 物化为 Event 基础设施 | `pass_for_design` | `L2M-UP-005` 未关闭前任何 candidate-related change为 blocker。 |
| 同一 boundary 子功能保持同一 commit，不同 boundary 必拆 | `pass_for_design` | 若真实 diff 显示不可独立验证，回写 Step 6 / 07。 |
| design / implementation language、footer和 message-file纪律明确 | `pass_for_design` | 当前无 target repo、历史样例或实际 message，不能写 execution pass。 |
| Step 7 checks、raw→report、acceptance review都能进入 Commit / Handoff Gate | `pass_for_design` | actual check、run、artifact、report、review均 `not_run`。 |
| user change保护、rollback和 design-drift回写与 Step 10一致 | `pass_for_design` | 不授权 reset / rebase / amend；若未来触发需重新核验。 |
| target repo、immutable baseline、UP / DDD blocker 是否已消除 | `blocked` | `L2M-DDD-001~007`、`scope_supersede_gap`、`L2M-UP-001~008`仍开放。 |

## 8. 回填草稿

未来正式 `07-实施计划.md` §11 应说明：Member implementation repo 的每笔 future commit 必须只对应一个 `commit-01-a`～`commit-08-b` boundary，使用英文 `<type>(<scope>): <subject>`，并按本 Step 的 scope / body-group mapping解释同一验证增量内为何必须同提交。body 先写一句 English boundary summary，再按协作子功能分组列实际文件名和近似改动量；禁止完整路径、字面量 `\\n` 和 bullet 间空行。Codex 实际参与时 footer 为 `Co-Authored-By: Codex <noreply@openai.com>`，前有真实空行。设计仓则保持英文 type、中文 subject/body 的独立规则；本轮不提交。

未来 Commit Gate 必须检查 target repo / immutable baseline、git identity、Design / Scope / Worktree Gate、Step 7 checks、Core-only dependency、candidate non-materialization、redaction、raw→report pairing和 message format。delivery / handoff 只引用真实 `reports/runs/<run_id>` 与经审查的 `reports/acceptance/*`，不能粘贴日志、手写证据、自动写 verdict或伤及用户改动。所有当前 boundary仍是 planned / blocked；本规则不构成实施、测试、commit、evidence、review、signoff或 readiness 事实。

## 9. 待确认事项

| 事项 | 影响 | 当前处理 | 最迟点 |
|---|---|---|---|
| target implementation repo、git history与 project-local config | 实际 title 风格 / git identity / Scope Gate | 使用本 Step 最低规则；不得宣称已检查 | `commit-01-a` 开工前 |
| immutable design baseline manifest | Design Gate、commit / handoff traceability | 保持 dirty planning baseline blocker | `commit-01-a` 开工前 |
| actual file inventory | body filename / size bullets | 在真实 Scope Gate 后记录；当前不虚构 files | 每一 current boundary Commit Gate 前 |
| Core / host / Runtime / resolver / screening / source contracts | affected boundary review与 P1 positive lane | `blocked / wait_design`；不可用 fake-success或 title 绕过 | affected boundary前 |
| physical Store / UoW / report / receipt / helper closure | durable、replay、Consumer / Job review | 保留 `L2M-DDD-002~007` 和 `scope_supersede_gap` | affected boundary前 |
| PH-08 actual run / reviewer / risk acceptor | report、acceptance draft、handoff | `<run_id>` 仍是 runtime variable；无审查不作裁决 | `commit-08-a/b` execution 前 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 18 个 boundary 的 title / scope / body-group 映射 | `pass_for_design` | 与 Step 6 boundary inventory一致，未新增 candidate materialization。 |
| Commit / review / delivery / footer / language规则 | `pass_for_design` | design / implementation边界明确，future execution再核验。 |
| Commit Gate / Handoff Gate与 Step 7 / 10 对齐 | `pass_for_design` | 未执行 checks，不把规划写成事实。 |
| user-change protection与 design-drift回写 | `pass_for_design` | 保护范围、暂停和恢复方向明确。 |
| target repo、baseline、真实 gate / artifact / review | `blocked` | 只阻塞 implementation / qualification，不阻塞 Step 12规划。 |
| 可进入 Step 12 | `authorized` | 下一步只定义实施完成判定；不得提前创建正式 07或 implementation ledgers。 |
