# 07 Step 11：提交、评审与交付纪律

## Step 状态

| 字段 | 值 |
|---|---|
| status | completed / selfcheck_done / stop_review |
| gate_status | pass (design-only) |
| gate_reason | 本Step结构化/定向回修及正式传播已完成；Step13实际文档静态核验通过，见07_implementation_static_review_record.md；仅design，不表示实施或资格 |
| next_allowed_action | waiting_user_confirmation |
| source_files | 前序Step10/6/7；实施SOP Step11、书写§4.9；代码台账/编码规范 |

### Step 内计划

| 项 | 状态 | 产物 |
|---|---|---|
| 来源/逐问/诊断/取舍 | done | 下方33问题 |
| body映射/正反例/交付 | done | 15独立group、planned真实文件名 |
| 复杂度与回填 | done | schema与运行报告不复制到计划 |
| 自检/停审 | done | Step13实际文档静态核验通过；外部资格/实施Gate不通过 |

## 本步目标

定义未来授权实施仓的单boundary提交与审查纪律，本轮当前design仓禁止commit。

## 本步输入

[Step10](07_implementation_plan_step_10_rollback_pause_change.md)暂停/回退/新run，Step6七phase/15boundary/tasks，Step7证据层；[实施书写§4.9](../../../standards/document/实施计划书写规范.md)、[代码台账](../../../standards/document/代码实施台账与门禁规范.md)。提交规范另文件并不存在，不猜路径。

## SOP 问题回答

| SOP问题 | 回答 |
|---|---|
| 1. 提交前必须检查哪些 git 配置。 | 目标仓git config --local user.name/email，当前worktree/staged范围、branch/log与用户改动记录；本轮不修改git。 |
| 2. 提交 message 应参考哪些规范和历史提交。 | 真实实施书写规范§4.9与目标仓实际近期log；实现仓尚不存在，不造history，较严格规则只叠加。 |
| 3. 当前仓是 `quantalithos-design` 设计文档仓，还是其他实现代码仓。 | 当前为quantalithos-design，本轮只设计，不commit；以下实现纪律用于未来独立target。 |
| 4. 如果提交发生在当前 design 文档仓，如何保证 `type` 英文、subject / body 中文、footer 固定。 | design type英文、subject/body中文，固定Codexfooter；须用户另授权提交，不能混其他项目dirty。 |
| 5. 如果提交发生在其他实现仓，如何保证 commit message 必须使用英文。 | 实施仓title/summary/body/groups/file说明均英文，不继承design中文例外。 |
| 6. 如果提交发生在其他实现仓，如何保证标题格式固定为 `type(scope): subject`。 | 标题必须type(scope): subject且scope必填，与下方15映射一致。 |
| 7. 当前项目允许哪些 `type` 和 `scope`，以及 `scope` 如何与 §6 commit boundary 对齐。 | type=feat/fix/refactor/docs/test/chore/perf/ci/style；scope表逐15对齐。 |
| 8. 每笔提交应对应哪个 §6 commit boundary，是否存在把多个 boundary 混成一笔的风险。 | 每笔一个§6boundary，staged若含两个无关能力先分scope/回07，不揉成一笔。 |
| 9. 如果一个 commit boundary 内部包含多个协作子功能，如何保证仍然是一笔提交，而不是按文件、repository、service、route 或子模块拆成多笔。 | 协作inputs/guard/Tx/result/tests仍一笔；批次不是提交，不能按route/file/service拆。 |
| 10. commit body 的第一句如何概括本 commit boundary。 | 第一句概括当前boundary的可验证能力，不写全部后端或文件清单。 |
| 11. commit body 应按哪些子功能分组，分组名称如何体现“为什么这些文件属于同一笔提交”。 | 下表两类英文完整能力group与Step6任务映射，说明为何一起实现验证。 |
| 12. body 文件条目是否只写文件名，禁止写完整路径。 | 文件条目basename only，不完整路径；同名文件用功能组澄清职责，不乱命名设计不存在文件。 |
| 13. body 文件条目是否带大致改动量，例如 `(+3)`、`(-35)`、`(~38)`、`(~+330/-60)`。 | 改动量从真实diff --stat计算；示例数仅格式示例，不填进Commit Record。 |
| 14. body 是否禁止字面量 `\n`，并使用真实换行。 | 真实换行，禁字面量反斜杠n；message先完整文件再git commit -F（需提交授权）。 |
| 15. bullet 之间是否禁止插空行。 | 相邻bullet之间无空行，group/summary/footer之间保留必要真实空行。 |
| 16. 当前项目是否要求固定 footer，固定文本是什么。 | 固定Co-Authored-By: Codex <noreply@openai.com>，不虚造多模型参与。 |
| 17. `Co-Authored-By` 前是否必须有真实空行。 | 必须真实空行，不用转义文本替代。 |
| 18. 是否允许多模型 `Co-Authored-By`，还是只能保留项目固定 footer。 | 本项目固定Codexfooter，当前agent独立，无多模型/代理注脚。 |
| 19. 当需要精确控制格式时，是否必须把完整 message 写入文件，再使用 `git commit -F` 或 `git commit --amend -F`。 | 需精确格式用完整messagefile后-F/amend-F；本轮不建message或执行commit。 |
| 20. 如果提交发生在其他实现仓，源码标识符、rustdoc、普通注释和测试名是否必须英文。 | Rust/TS/Vue标识符/rustdoc/普通注释/testname默认英文；中文只i18n/en-zh业务fixture，可追溯至Web展示。 |
| 21. 哪些 commit 时机被允许，哪些时机被禁止。 | 全部required gates真实pass并额外授权才commit；pending/failed/跨scope/未回写设计/半函数/WIP不可。 |
| 22. 代码规范、格式化、lint 和测试如何检查。 | 按栈fmt/check/clippy/rustdoc、Webtypecheck/lint/browser、scripts shellcheck/CLI；直接tests及Step7 required不是可选。 |
| 23. 设计偏离时如何同步文档。 | 偏离pause回03/04/05/06/07/calibration，固定新baseline及重复55经验审，不能先提交错误truth。 |
| 24. 证据如何附到提交、PR 或交付说明中。 | message/PR/handoff引用固定run报告及审查路径，不粘完整log；hash/status真实记录台账。 |
| 25. 哪些情况下必须拆分提交，哪些情况下允许合并提交。 | 跨boundary/无关功能必须分；同boundary协作子批合一笔，风险/范围变化先调整07。 |
| 26. 当前实施计划中应给出的合格 commit 示例和反例是什么。 | 下方准确03planned文件名的正例与缺scope/完整路径/latest/虚pass反例；只是格式教学，不是commit证据。 |
| 27. 提交或交付说明是否只引用 `reports/runs/<run_id>` 和 `reports/acceptance`，而不是粘贴完整日志？ | 只固定reports/runs/<run_id>和reports/acceptance/必要review；不得latest/跨run或整log。 |
| 28. 如果门禁生成了 raw artifact，是否已经生成对应 report？ | 每raw有suite/run展示和失败context；完整EV要求artifactchecks/validdetail/index/6seal，partial披露。 |
| 29. `reports/acceptance/handoff.md` 和 `veto-checklist.md` 是否已经由人或 Agent 审查？ | 07-b审查handoff/veto/必要risk，固定入口回指immutable same-run；当前无review/signoff。 |
| 30. Step 6 中每个 commit boundary 的子功能分组是否已经映射到 commit body 分组。 | 15boundary与Step6tasks一一映射到下面groups，不漏U1/U7/工具bootstrap。 |
| 31. Commit body 分组是否说明“为什么这些文件属于同一笔提交”,而不是按文件类型或目录平铺。 | 每group以能力/共同验证目标描述，不按rs/vue/json目录平铺。 |
| 32. 每个 commit boundary 的提交纪律是否完成停审。 | 本轮逐15设计映射停审，不等未来Commit/Handoff Gate通过；Step13静态再核。 |
| 33. 所有 boundary 的 type / scope、message 语言、body 分组、footer、证据引用和 diff 范围是否通过跨提交审计。 | 全15 scope/type/body/footer/语言/路径/单scope/basename及来源检查，最后静态记录；实际commit未有。 |

## 当前文档问题诊断

旧记录边界数量误差/不完整问题集，bodygroup只对象名、05-a错误rebuild，commit例含03树不存在的文件，report列泛gate-results/redaction-check没有exactschema路径，WorktreeGate缺失。全部回scope/read/tasks及05实际schema。

## 改动前后对比

| 项 | 前 | 后 / 理由 |
|---|---|---|
| 提交来源 | 泛§6/§11 | 实际规范§4.9 |
| body / 示例 | 功能名与假文件 | 15组完整能力句、03树的basename |
| gate | 缺Worktree | Design/Scope/Worktree/Build/Test/Evidence/Commit/Handoff |
| 证据 | 泛输出/把设计当auditpass | Step7严格成熟度、同run、新execution、真实review |

## 设计取舍

一boundary一笔；子批可拆但不是commit，跨phase/无关修改不合并。源码语言与设计语言分开，提交授权与实施授权分开；报告工具结果不自动给verdict。保留项目固定footer，不调用代理。

## 结构化中间产物

### 提交纪律表

| 项 | required规则 / 验证来源 |
|---|---|
| git identity | 目标repo --local quantalithos-labs / quantalithos.ai@gmail.com；不global |
| immutable baseline | 用户确认后冻结真实designidentity；当前workingtree/date不代替 |
| worktree/staged | 初始用户改动列表、修改前scope、提交前staged，单boundary；不暂存无关/他人文件 |
| title | 英文type(scope): subject，allowed types，scope下表 |
| summary/group | 英文一句boundarysummary→按共同能力分group |
| file entry | basename (+/-/~真实统计量): 英文功能说明；不fullpath、不臆造文件 |
| whitespace/footer | 真实换行，bullet无插空行；固定Codexfooter前真实空行 |
| Gate | Design/Scope/Worktree/Build/Test/Evidence有实际检查；再CommitGate |
| Handoff | 真实hash/baseline/同runreport/reviewer/remainingblockers/未跑checks/next；pending不提前激活 |
| 当前授权 | 只有本项目设计07，未有实现/commit授权；不执行上述写操作 |

### Boundary → scope / 协作body分组与停审

| Boundary | type(scope)格式示例 | 英文group（对应Step6任务） | 为什么同提交 / 设计停审 |
|---|---|---|---|
| commit-01-a | feat(foundation) | Close typed carriers and pure domain invariants together；Bootstrap safe test output before any later gate | contracts/domain、workspace 基础和 scripts 参数/原始输出/最小 index 能力是一个前置或vertical增量；拆开会割裂共同验证；本次设计映射收口、实际checks pending |
| commit-01-b | feat(config) | Map seven runtime fields without business authority；Reject unsafe profile, reference, and secret inputs | loader 映射七字段/八 slot、拒绝非法输入和展示 locale是一个前置或vertical增量；拆开会割裂共同验证；本次设计映射收口、实际checks pending |
| commit-02-a | feat(operation) | Reserve operations and preserve full original results；Close read, support, transaction, and fake-port semantics | 17 ports、runners、FlowSupport、Query/replay、UoW 与同语义 fake是一个前置或vertical增量；拆开会割裂共同验证；本次设计映射收口、实际checks pending |
| commit-02-b | feat(storage) | Persist typed rows with atomic versions and cursors；Supply complete read lookups and projection plans | 32 store、typed Row/codec、CAS/as-of/page/source-cursor是一个前置或vertical增量；拆开会割裂共同验证；本次设计映射收口、实际checks pending |
| commit-03-a | feat(publication) | Bind publisher responsibility and immutable source basis；Consume formal review decisions before listing versions | U1 全部 + U2 全部 + U3 五 Command 的本地纵切是一个前置或vertical增量；拆开会割裂共同验证；本次设计映射收口、实际checks pending |
| commit-03-b | feat(catalog) | Expose catalog queries with current disclosure；Refresh references and rebuild all four projection kinds | U3 五 Query + U7 两 Query/两 Job；四种 projection 完整 builder是一个前置或vertical增量；拆开会割裂共同验证；本次设计映射收口、实际checks pending |
| commit-04-a | feat(distribution) | Preserve original distribution intent and permission；Reconcile uncertain receiver effects and late outcomes | U4 全部七 flow是一个前置或vertical增量；拆开会割裂共同验证；本次设计映射收口、实际checks pending |
| commit-04-b | feat(withdrawal) | Stop new distribution while preserving known responsibility；Enumerate known impact and bind notice outcomes | U5 全部九 flow是一个前置或vertical增量；拆开会割裂共同验证；本次设计映射收口、实际checks pending |
| commit-05-a | feat(read) | Read audit, recovery, and full original operation results；Verify current disclosure and zero-effect replay | U6 三 Query是一个前置或vertical增量；拆开会割裂共同验证；本次设计映射收口、实际checks pending |
| commit-05-b | feat(recovery) | Recover from typed plans with lease and fencing；Dispatch safe observation without recursive audit | U6 一 Command/三 Job是一个前置或vertical增量；拆开会割裂共同验证；本次设计映射收口、实际checks pending |
| commit-06-a | feat(api) | Construct trusted command and query contexts；Map all HTTP result dispositions without direct owner access | 可信 context、21C/16Q route、typed disposition/error是一个前置或vertical增量；拆开会割裂共同验证；本次设计映射收口、实际checks pending |
| commit-06-b | feat(worker-web) | Execute internal jobs and retain full reports；Render typed Web workflows and bilingual states | 12 internal Job dispatch + Vue/TS UI 的 protocol-only 视图是一个前置或vertical增量；拆开会割裂共同验证；本次设计映射收口、实际checks pending |
| commit-06-c | feat(adapter) | Bind exact SDK operations or return formal blocked outcomes；Preserve uncertain effects and safe telemetry | Source/Publisher/Material/Governance/Scope/Receiver/Notice/Observation SDK wiring是一个前置或vertical增量；拆开会割裂共同验证；本次设计映射收口、实际checks pending |
| commit-07-a | test(evidence) | Complete all gate and report tooling from actual raw inputs；Validate final EV details, seals, and machine drafts | 完善22脚本，98 TC/EV/subcase manifest、artifact/seal 两阶段是一个前置或vertical增量；拆开会割裂共同验证；本次设计映射收口、实际checks pending |
| commit-07-b | docs(handoff) | Review actual boundary records and same-run evidence；Hand off only the declared proof scope and remaining blockers | 审查完整 run/EV/20AC/5VETO、台账/剩余风险与证明范围是一个前置或vertical增量；拆开会割裂共同验证；本次设计映射收口、实际checks pending |

### 正例：真实planned文件名的提交格式

仅示范未来03-a message格式；数值用于语法示例，不代表当前已有diff/commit。实际实施从真实diff重算，不能照抄数值或status。

```text
feat(publication): bind source responsibility before market publication

Close publisher responsibility and formal decision consumption for commit-03-a:

Bind publisher responsibility and immutable source basis:
- bind_publisher_relation.rs (+120): bind the formal publisher relation without copying identity truth.
- verify_publication_source.rs (+160): retain qualified immutable source references.

Consume formal review decisions before listing versions:
- create_publication_draft.rs (+110): preserve the complete publication basis.
- record_governance_decision.rs (+180): match the current formal decision and reject incomplete bindings.
- list_market_version.rs (+150): enforce current authority before the Listed transition.
- publication_review_flow_tests.rs (+190): cover mismatch, replay, and blocked-owner cases.

Co-Authored-By: Codex <noreply@openai.com>
```

### 反例：无边界/不真实证据

```text
feat: update backend
- crates/application/src/list_market_version.rs: add stuff
- report latest: pass
```

缺scope/一句增量/大致量/能力group/footer，写fullpath且文件位置错误，使用latest并无actualraw。即使英文也不合格；不能用示例当实施truth。

### 提交前诊断与提交后固定源码（05 Context前置）

正式05 schema的Context必须有真实implementation_commit和generator_commit，且与实际被测/报告生成源码一致。首次boundary未有commit，或源码/fixture/tooling仍有未提交改动时，不能把旧HEAD、设计commit、占位hash或临时tree当作这两个字段。此时只保存安全实际直接测试/工具输出的诊断与审查说明，位置为reports/review/<boundary_id>-precommit.md；它不是正式machine case/report/EV，也不伪渲染合格index。schema/工具负例fixture只是测试输入，不能代替实际业务raw。

提交前Build/Test核当前完整能力与直接层检查；Evidence Gate按当前诊断成熟度核真实输出/失败解释、scope和安全，不能声称完整主suite/合格EV。全部代码能力及这些required检查有真实结果、用户另授权后，才可单boundarycommit。提交之后固定真实源码与generatorcommit，源码/fixture/tooling无dirty或无关未跟踪输入，再以新run/newexecution生成正式05 Context和当前partial/full材料；不能让旧HEAD报告覆盖未提交代码来源。输出区新增报告不等源码dirty，所有输入仍须可追溯。

当前边界Handoff再核提交后同源材料、remainingblockers与next。07-a提交前只验证fulltool能力/直接测试/非合格诊断，不先发finalEV；提交后新run才运行全11/allsubcase/六artifact→98EV/index→六seal→draft，完整包通过才能handoff07-b。若失败保留currentblocked，在额外提交授权和用户改动保护下修复同boundary/fix或获准amend，固定新实际commit后再新run；不提前激活下一边界。本时序不放宽任何05/06 required集合，不新增machine字段/证明状态。

### 评审纪律与artifact交付

| Gate | required证据 | 未有 / 失败 |
|---|---|---|
| Design | formal03/05/06/07+04、55经验/固定baseline、无缺schema/phase | 回写truth，暂停 |
| Scope | exact路径/方法组、forbidden/未来内容排除 | 不编码；scope变化先回07 |
| Worktree | 目标仓/branch/用户改动清单、前后diff归属 | 不覆盖/暂存用户无关 |
| Build | toolchain/lock、fmt/check/lint/rustdoc或typecheck | 修当前；不WIPcommit |
| Test | plannedTC/requiredsubcase及actualdirectlayers | 不skip；失败保留、新run |
| Evidence | raw/reportpair/strictschema/DAG/redaction/currentmaturity，final6seal | 无finalEV不验收 |
| Commit | 单boundary staged/whitespace/message/git/授权 | 不commit，修scope/message |
| Handoff | actualhash/baseline/report/remainingblocker/unruntests/reviewer/next | 保持pending，不激活next |

raw与report固定路径由Step7及05规范，不能粘日志替代。01-a最小shell不等final；07-a生成immutable<run_id>-draft，07-breview固定handoff/veto/必要risk，reports/review引用run。任何文件不存在或reviewer未有只能pending，不填结论。中文只i18n/明确业务fixture，源码标识符/注释/公开rustdoc/testname英文。

### 跨提交设计审计

15type/scope唯一、两group对齐tasks、准确basename与body格式、用户dirty保护、固定footer、真实报告及新run规则均有结构化来源；Step13实际静态后才登记designpass。没有任何current实施commit。

## 回填草稿

正式§11保留完整规则、15映射与正反例，正文不放SOP问答/诊断。Required read source真实§4.9，所有提交仍须额外授权。

## 待确认事项

目标repo真实近期log/更严格规范、actualdiff量、gate/report/reviewer与commit授权待未来实际准备；固定Codexfooter已由规范定义不是悬空问题。

## 进入下一步条件

33问题/15group/8gate有来源，Step13已实际核对结构/paths/提交前后时序；不把设计自检改写成Commit Gate pass。

## 停审记录

本Step及其定向回修已通过Step13实际文档静态检查，正式来源与结构化产物一致。状态为completed / selfcheck_done / stop_review；本轮全部07设计已完成，现在等待用户确认07，不跨文档或实施。上游blocker、immutablebaseline与实际实现Gate仍未通过；无业务测试run或commit。
