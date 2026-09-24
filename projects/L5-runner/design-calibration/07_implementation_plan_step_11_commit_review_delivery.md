# Step 11. 定义提交、评审与交付纪律

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 11  
> 书写规范：`standards/document/实施计划书写规范.md` §5.11、§11  
> 可落码标准：`standards/document/设计真相源闭环与可落码性标准.md` §九  
> 实施台账规范：`standards/document/代码实施台账与门禁规范.md`  
> 回填章节：未来正式 `projects/L5-runner/07-实施计划.md` §11  
> 执行方式：`full-restart + single-agent-serial`

## 1. Step 状态与事实边界

| 项 | 当前值 |
|---|---|
| `current_document` | `07-实施计划.md` calibration |
| `current_step` | `Step 11` |
| `current_module` | `commit_review_delivery_discipline` |
| `status` | `completed / self_reviewed` |
| `gate_status` | `pass_for_step_12` |
| `gate_reason` | 已固定设计仓/实现仓语言边界、未来 commit 的 type/scope/title/body/footer 规则、18 个 boundary 到 body 分组的映射、提交前门禁、独立评审、artifact/report 交付和 handoff 纪律；当前目标实现仓、工具链、baseline、commit、run、artifact、report、evidence、verdict、signoff 和 readiness 均未创建或未执行。 |
| `formal_07_write_allowed` | `false_until_step_13_assembly` |
| `implementation_write_allowed` | `false` |
| `test_execution_allowed` | `false` |
| `implementation_ledger_allowed` | `false_until_step_13_assembly` |
| `commit_required` | `false` |
| `next_allowed_action` | 创建并完成 `07_implementation_plan_step_12_completion_criteria.md`；完成后停审 |

本 Step 只定义未来实现仓的提交、评审和交付控制。所有 commit message、文件名、改动量、report 路径、review 角色、baseline 和 run 关系均为计划合同；不存在实际提交或证据实例。本 Step 不修改正式 `07-实施计划.md`，不创建 `implementation_execution_ledger.md` 或 `implementation-boundaries/`。

## 2. 本步输入、输出与执行约束

### 2.1 本步输入

| 输入 | 承接内容 | 使用上限 |
|---|---|---|
| `07_implementation_plan_step_06_tasks_commit_boundaries.md` | 六个 phase、18 个 boundary、批次、子功能分组、allowed/forbidden scope、Commit/Handoff Gate | 只将已有 boundary 转成提交和评审纪律，不新增或合并 boundary |
| `07_implementation_plan_step_07_test_acceptance_gates.md` | `GATE-01`～`GATE-12`、suite/CUT/TC、artifact/report/evidence pairing 和失败语义 | 只定义提交前如何引用和审查既有 gate，不生成执行结果 |
| `07_implementation_plan_step_10_rollback_change_control.md` | pause、rollback、change、resume、失败材料保留、新 run lineage 和不可风险接受项 | 只把禁止提交和恢复前条件接入 Commit/Handoff Gate |
| `03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md` | Runner truth source、配置/测试/验收分母和红线 | 不补 schema、port、状态、技术栈或 owner truth |
| `standards/document/实施计划书写规范.md`、SOP、实施台账规范 | message、语言、footer、评审、交付、台账规则 | 标准优先于历史提交样例；历史样例只作冲突扫描输入 |

### 2.2 本步输出

- 提交纪律表：git identity、规范读取、提交时机、粒度、工作树和 staging 规则。
- design 文档仓与未来 Runner 实现仓的语言、标题、body、源码注释和测试名边界。
- `type` / `scope` 候选值及其与 18 个 boundary 的回指规则；技术 authority 未闭合处标为候选而非最终绑定。
- commit message 结构、body 分组、文件名/改动量、空行、footer 和 `git commit -F` 规则。
- 18 个 boundary 的 body 分组、review focus、证据引用和提交前阻断条件映射。
- Design/Scope/Worktree/Toolchain/Test/Evidence/Commit/Handoff Gate 矩阵。
- 独立评审纪律、artifact/report 交付检查、失败材料和 acceptance handoff 规则。
- 合格/不合格 message 示例和不合格拆分示例。
- 跨 boundary 提交纪律审计、回填草稿、待确认事项和 Step 12 入口条件。

### 2.3 强制约束

1. 一笔未来实现仓 commit 只能对应一个 Step 6 `commit-ph-*` boundary；不同 boundary 不得合并，单个文件/函数/目录也不得把同一 boundary 拆成多笔提交。
2. 当前 design 仓没有用户授权的 commit；本 Step 不提交、不改 git config、不创建 message 文件。未来若用户授权提交，必须按适用仓规则重新读取规范并执行门禁。
3. Runner 目标实现仓和技术栈未获 authority；不得写死语言命令、源码路径、package/crate/binary、脚本实现或把历史命令当成 required check。
4. 实现仓 title、subject、body、源码标识符、rustdoc/注释、测试名的英文要求不得被 design 仓中文规则放宽；目标仓更严格规则只能叠加。
5. 提交说明只引用同一 `run_id` 下的 report/check/evidence 路径，不粘贴完整日志，不把 local log、receipt、设计层 `pass` 或 report draft 当 formal evidence。
6. 未通过 Design Gate、Scope Gate、required Test/Evidence Gate、security/dependency/redaction check、Commit Gate 或 Handoff Gate 时不得提交或进入下一 boundary。
7. `blocked`、`not_run`、`timeout`、`flaky_suspected`、`dependency_unavailable`、`incomplete` 和 `review_disputed` 必须保真；不存在报告、baseline、run 或 review 时写 `not_created/not_run`，不得补造。
8. 每次继续、恢复、准备提交或交付前，未来实现 agent 必须先读取项目级 implementation ledger、当前 boundary ledger、正式 03/04/05/06/07 和必要 calibration；Step 13 前这些实施台账仍不得创建。

## 3. SOP 问题回答

| SOP 问题 | Runner 收口回答 |
|---|---|
| 提交前必须检查哪些 git 配置？ | 未来实现仓首次提交前须核对项目级 `user.name=quantalithos-labs`、`user.email=quantalithos.ai@gmail.com`，并确认未使用 `--global` 污染全局；当前不执行配置写入或提交。 |
| message 应参考哪些规范和历史？ | 以 `实施计划书写规范.md`、目标实现仓正式提交规范和近期合格历史为准；历史 README、旧 07 或其他项目样例不能覆盖当前规则。目标仓不存在时保持 `RUN-DDD-001/002`，不猜规则。 |
| 当前仓与未来提交仓是什么？ | 当前工作目录是 `quantalithos-design` 设计文档仓；未来代码提交若获授权，应发生在 `/home/aris/Projects/quantalithos-runner` 候选实现仓，但该目录目前不存在，路径和 authority 尚未闭合。 |
| design 仓和实现仓的语言边界是什么？ | design 仓使用英文 `type`，subject/body 可中文，AI 参与时保留固定 footer；未来实现仓 title/body、源码标识符、普通注释、文档注释和测试名默认英文，标题固定 `type(scope): subject`。 |
| 当前项目允许哪些 type/scope？ | `feat/fix/refactor/docs/test/chore/perf/ci/style` 是标准候选 type；scope 采用 Runner 语义能力词，需能回指一个 boundary。因技术 authority 未闭合，候选 scope 不等于已获实现仓批准。 |
| 一笔提交如何对应 boundary？ | 一个 `commit-ph-*` = 一笔 commit；同 boundary 的多个协作子功能只在 body 中分组，不按文件、repository、service、route 或 adapter 拆提交。若无法独立 review/验证/回退，必须回到 Step 6/10 重审 boundary。 |
| body 第一段和分组如何写？ | 标题后真实空行；body 第一段用一句话说明可验证 boundary 增量；随后按 Step 6 子功能分组，每组列文件名、近似改动量和为什么属于同一增量。bullet 之间不插空行。 |
| footer 和 message 文件如何处理？ | footer 前必须有真实空行；AI 参与时使用 `Co-Authored-By: Codex <noreply@openai.com>`（若目标仓有更严格固定 footer，以其规则为准）。需要精确换行时先写完整 message 文件，再使用 `git commit -F` 或 `git commit --amend -F`。 |
| 哪些时机允许/禁止提交？ | 只有当前 boundary 的设计闭环、scope、toolchain、targeted Test/Evidence Gate、diff、message 和 review 条件全部满足时允许；设计 blocker、required check 未执行/失败、跨 boundary、用户改动混入、static/cross-run evidence 或 VETO 未清除时禁止。 |
| 证据如何附到提交或 handoff？ | 只引用 `reports/runs/<run_id>/...`、同 run suite/check report 和必要的 `reports/acceptance/` / `reports/review/` 路径；raw 日志不粘进 message，缺 pair、scanner unavailable 或 report 未审查时不得 handoff。 |
| 评审由谁完成？ | 设计闭环由设计负责人复核，代码/范围由实现 reviewer 复核，测试/证据由独立测试或证据 reviewer 复核，安全/依赖由安全 reviewer 复核，最终 handoff 由验收/GRC authority 复核；实现者不得自签 verdict/signoff。 |
| 发现设计偏离怎么办？ | 按 Step 10 `change-upstream` 回写 03/04/05/06/07 或 owning owner seam，固定新 baseline，重审受影响 boundary/gate/risk，再决定 resume；不得先提交再补设计。 |
| raw artifact 是否必须有 report？ | 是。若一个未来 gate 生成 raw artifact，必须有同一 run 的可回链 report/check；只生成 raw、不生成 report、report pairing 失败或静态 report 均阻断 Evidence/Commit/Handoff Gate。 |
| acceptance handoff 是否等于 verdict？ | 不是。`reports/acceptance/handoff.md`、`veto-checklist.md` 和 `risk-acceptance.md` 只能作为审查载体；它们不能自动生成 verdict、signoff、readiness，且当前均未创建。 |

## 4. 当前文档问题诊断

| 问题 | Step 11 前的风险 | 本 Step 处理 |
|---|---|---|
| Step 6 已有 18 个 boundary，但没有统一 title/body 纪律 | 实现者可能按文件或个人工作量提交，破坏回退和审计 | 固定一 boundary 一 commit，并给出 18 行 body 分组映射 |
| design 仓与实现仓语言规则不同 | 中文 design message 可能被带入实现仓 | 明确英文实现仓 message/source 规则与 design 仓例外 |
| 技术 authority 尚未闭合 | 直接写 `cargo`、源码路径或 package scope 会伪造前置条件 | required checks 使用“authority 到达后绑定”的条件性表述 |
| Step 7 已定义 raw/report/evidence，但提交说明可能粘贴日志 | message 失去可读性，且可能泄露敏感内容 | 只引用 run-scoped report/check/acceptance path，禁止粘全文日志 |
| Step 10 已定义 failed material 和新 run，但提交纪律未承接 | 修复 run 可能覆盖失败 run 或跨 run 拼 evidence | Commit/Handoff Gate 强制 predecessor/supersedes、same-run pairing 和失败材料保留 |
| 未来 implementation ledger 只能 Step 13 创建 | 提前创建台账会把计划误写成实施事实 | 本 Step 只定义未来字段和检查，不创建文件 |

## 5. 改动前后对比与设计取舍

### 5.1 改动前后对比

| 议题 | Step 11 前 | Step 11 后 | 作用 |
|---|---|---|---|
| 提交粒度 | 18 boundary 已存在但 message 未绑定 | 一 boundary 一 commit，body 分组回指 Step 6 | review/rollback 可定位 |
| 工具命令 | 可能从历史技术选择继承 | 语言/runtime/命令等 authority 到达后才绑定 | 避免伪造 toolchain gate |
| 语言边界 | design/implementation 容易混用 | design 中文 subject/body；实现仓全英文 | 保持仓规则一致 |
| 证据引用 | 可能粘贴日志或跨 run | 只引用同 run 路径，失败材料不可覆盖 | 安全且可审计 |
| 评审 | 可能由实现者自检 | 设计、代码、测试/证据、安全、验收角色分离 | 防止自签 |
| 交付 | handoff 与 verdict 容易混淆 | handoff、VETO、risk、verdict/signoff/readiness 分离 | 保持事实边界 |

### 5.2 设计取舍

| 方案 | 优点 | 风险/代价 | 结论 |
|---|---|---|---|
| 按文件/模块拆 commit | diff 较小 | 打散可验证增量，难以回退和审计 | 不采用 |
| 每个 phase 一笔 commit | 提交少 | PH-03/05/06 的状态、副作用和证据边界过粗 | 不采用 |
| 每个 Step 6 boundary 一笔 commit | 可独立 review、验证、回退；body 可解释协作关系 | 需要维护 18 行映射和台账 | 采用 |
| 先写固定语言/命令 | 文档看似具体 | 技术 authority 未到，继承旧技术或伪造命令 | 不采用 |
| authority 到达后绑定命令，当前只固定逻辑 gate | 保持技术中立和事实边界 | 后续需补目标仓规范 | 采用 |
| 提交中复制完整日志 | 信息多 | 泄露、噪声大、不可审计 | 不采用 |
| message 引用 run-scoped report path | 可读、可回链、保护敏感数据 | 依赖报告生成器稳定 | 采用 |
| 自动生成 handoff 即视为交付 | 快 | 混淆 draft、review、verdict | 不采用 |
| 独立 review 后才 handoff | 责任清楚 | 需要 reviewer authority | 采用 |

## 6. 结构化中间产物

### 6.1 提交纪律表

| 项 | 未来实现仓要求 | 当前状态/检查方式 |
|---|---|---|
| 项目级 git identity | `user.name=quantalithos-labs`；`user.email=quantalithos.ai@gmail.com`；使用项目级配置，不使用 `--global` | 当前不写入、不验证、不提交；未来由 Design/Commit Gate 读取配置 |
| 提交规范读取 | 目标仓正式 commit 规范、`实施计划书写规范.md`、Step 6/7/10/11、目录/编码规范 | 目标仓不存在；保持 `RUN-DDD-001/002`，不猜规范路径 |
| 当前 design 仓提交 | 若用户未来明确授权，英文 type、中文 subject/body、固定 footer；当前 `commit_required=false` | 本轮不提交 |
| 未来实现仓提交 | 英文 title/body、`type(scope): subject`、源码标识符/注释/测试名默认英文 | scope/type 需目标仓 authority 确认 |
| 一笔提交范围 | 只覆盖一个 `commit-ph-*` allowed scope；不得带后续 phase、无关文件或用户改动 | staged scope future/pending |
| 提交前设计门禁 | 当前 boundary required reads、字段/DTO/state/ref/port/evidence/phase closure 已复核 | 当前实现未授权；`blocked/not_started` |
| 提交前工具门禁 | 由技术 authority 绑定的 format/build/lint/type/test/check 命令；不得从 README 猜 | `RUN-DDD-002` 开放；不执行命令 |
| 提交前测试门禁 | Step 7 对应 suite/CUT/TC、失败分类、same-run artifact/report/check 和 required acceptance gate | actual `not_run/not_created` |
| 提交前证据门禁 | raw/report/check pair、digest/source match、redaction、dependency、link/pairing、cleanup | actual `not_created` |
| 提交后 handoff | 回写真实 baseline、commit hash（若用户授权）、实际 gate、remaining blocker、next boundary | implementation ledger 仅 Step 13 创建 |

### 6.2 Type / Scope 约束

#### Type 候选

| `type` | 适用场景 | 约束 |
|---|---|---|
| `feat` | 新增已批准的 Runner capability slice | 不能把 planned/blocked shell 写成 ready |
| `fix` | 修复当前 boundary 已定义行为或 gate failure | 不得用 fix 绕过设计回写 |
| `refactor` | 不改变 truth/协议/状态语义的内部重组 | 必须证明 scope 和 gate 不变 |
| `docs` | 实现仓内与当前 boundary 绑定的文档/ledger 更新 | 不能替代正式设计 truth source |
| `test` | 仅测试/fixture/check 变更，且属于当前 boundary | 不得删除 blocked TC 或制造 pass |
| `chore` | 受批准的配置/工具/目录维护 | 必须有 authority 和 boundary 归属 |
| `perf` | 已批准且有 NFA/measurement 依据的性能改动 | 未有 SLO/capacity authority 时不能写 production outcome |
| `ci` | gate/report automation 变更 | 必须保留 same-run、redaction、pairing 语义 |
| `style` | 不改变行为的格式化 | 不得与功能、设计变更或无关文件混提交 |

#### Scope 候选

| Scope | 主要回指 boundary | 语义边界 |
|---|---|---|
| `workspace` | `commit-ph-01-a` | 仓/逻辑装配/依赖分类；不锁物理技术 |
| `config` | `commit-ph-01-b`、`commit-ph-02-c` | strict config/profile/readiness；不等 environment ready |
| `contract` | `commit-ph-01-a/b`、`commit-ph-02-a`、`commit-ph-05-a` | public carrier/protocol/header；不拥有 owner truth |
| `selection` | `commit-ph-02-a` | explicit version/selection/generation；禁止 latest |
| `material` | `commit-ph-02-b/c` | acquisition/integrity/qualification axes；不本地批准 |
| `run` | `commit-ph-03-a/b` | run/control intent and effect ordering；Accepted 不等 Running |
| `resource` | `commit-ph-03-a` | resource observation/guard/conflict；不自行 allocation |
| `recovery` | `commit-ph-03-c` | RecoveryCase/manual review/no-replay；不 owner repair |
| `control` | `commit-ph-03-d` | lifecycle/control/query local slice；Query no-write |
| `presentation` | `commit-ph-04-a/b` | bounded preview/diagnosis/handoff view；不输出 raw |
| `query` | `commit-ph-04-c` | committed read section/projection identity；不 refresh/reconcile |
| `consumer` | `commit-ph-05-a` | header-first/receipt/no-ACK；不 parse payload |
| `job` | `commit-ph-05-b/c` | local claim/checkpoint/report；不 owner repair/replay |
| `report` | `commit-ph-05-d`、`commit-ph-06-b` | report/index/pairing capability；不生成 verdict |
| `integration` | `commit-ph-06-a` | selected public seam/preflight；positive lane 需 authority |
| `handoff` | `commit-ph-06-b` | same-run package/review inputs；不等 signoff/readiness |
| `security` | 相关 boundary 的 redaction/dependency/event-zero | 只收安全检查，不遮蔽功能 scope |

Scope 是未来实现仓的语义候选，实际允许值、大小写和目标仓 hook 需在 `RUN-DDD-002` 关闭后固定；禁止用 scope 名掩盖跨 boundary 改动。

### 6.3 Commit message 结构与格式

#### 实现仓格式

```text
<type>(<scope>): <英文 subject>

<One-sentence English summary of the single commit boundary.>

<Sub-feature group A>:
- <file_name> (+N): <short English behavior summary>.
- <file_name> (~+N/-M): <short English behavior summary>.

<Sub-feature group B>:
- <file_name> (~N): <short English behavior summary>.

Co-Authored-By: Codex <noreply@openai.com>
```

#### design 仓格式（仅描述规范，不表示本轮提交）

```text
docs: <中文 subject>

<中文 boundary summary>

<中文子功能分组>:
- <文件名> (+N): <中文说明>

Co-Authored-By: Codex <noreply@openai.com>
```

| 格式项 | 强制规则 | 失败动作 |
|---|---|---|
| title | 实现仓为 `type(scope): subject`，scope 必填；design 仓为英文 type + 中文 subject | `pause + fix_gate_failure`，不得提交 |
| title 语言 | 实现仓 subject 英文；design 仓 subject 可中文 | 回到目标仓规范确认，不把 design 规则带入实现仓 |
| summary | body 第一段恰好概括一个 boundary 的可验证增量 | 重写 message，不扩大 scope |
| body groups | 分组来自 Step 6 子功能，说明为什么共同提交 | 若只能按文件平铺，暂停并重审 boundary |
| file bullet | 只写文件名，不写完整路径；带 `(+3)`、`(-35)`、`(~38)` 或 `(~+330/-60)` | 补齐 message；不得粘贴绝对路径/完整日志 |
| line breaks | 使用真实换行；禁止字面量 `\n` | 通过 message file 重建 |
| blank lines | title 后空一行；分组间可空一行；bullet 之间不插空行；footer 前空一行 | message format gate failed |
| footer | AI 参与时使用项目固定 footer；只列实际参与模型 | 删除未经授权的模型 footer 或按目标仓规则修正 |
| message file | 复杂 message 使用完整文件和 `git commit -F` / `git commit --amend -F` | 不使用多次 `-m` 拼接 |

### 6.4 18 boundary 到 commit body 分组映射

| Boundary | Step 6 子功能 | body 分组名称（候选） | review focus | 证据引用（未来） |
|---|---|---|---|---|
| `commit-ph-01-a` | authority、logical composition、dependency classification | `Workspace and dependency boundary:` | 目标仓/authority、依赖类型、event=0；不锁物理技术 | dependency/boundary report（若生成） |
| `commit-ph-01-b` | strict config、profile/readiness、fixture/path、gate/report capability | `Configuration and readiness contract:`；`Fixture and report roots:` | whole-document、profile isolation、redaction、same-run path | config/security/path reports |
| `commit-ph-02-a` | context/selection contracts、selection state/generation | `Context and explicit selection:`；`Selection state and generation:` | explicit selector、typed ref、generation、no latest | CTX contract/domain report |
| `commit-ph-02-b` | acquisition/integrity/cache、C03～C06 local flow/UoW | `Material and integrity axes:`；`Local acquisition flows:` | Complete/Verified/Qualified、duplicate/version、authority不绕过 | MAT/IDM/UOW report |
| `commit-ph-02-c` | semantic adapter slots、availability、Q01～Q05 safe query | `Public adapter availability:`；`Safe material queries:` | SDK/public seam、Query no-write、cache not authority | controlled/dependency/query report |
| `commit-ph-03-a` | run/control/resource/guard local truth | `Run and control contracts:`；`Resource and protection guards:` | Accepted≠Running、Confirmed≠Cleaned、resource conflict | CTL/RES state report |
| `commit-ph-03-b` | effect ordering、UoW、idempotency、stored result/unknown | `Effect orchestration and UoW:`；`Unknown and stored results:` | reserve→call→readback/unknown→commit、zero owner write | REQ/CTL/IDM/UOW report |
| `commit-ph-03-c` | RecoveryCase、manual review、readback/no-replay | `Recovery and manual review:`；`No-replay protection:` | Unknown/RecoveryCase、lease/orphan、无自动 replay/reclaim | REC/REPLAY report |
| `commit-ph-03-d` | C07～C10 services、Q06～Q08 safe reads | `Lifecycle control services:`；`Safe resource and recovery queries:` | service/query no-write、stored result、entry mapping | SERVICE/ENTRY report |
| `commit-ph-04-a` | bounded view/read-section contracts、body-free/redaction schema | `Bounded presentation contracts:`；`Redaction-safe fields:` | forbidden corpus、visibility/freshness/source、无 raw | PRE/OBS security report |
| `commit-ph-04-b` | diagnosis/handoff semantic slots、C11/Q09～Q11 | `Diagnosis and handoff posture:`；`Visibility and redaction resolution:` | receipt≠evidence、unknown/no-resend、safe source | OBS/service/replay report |
| `commit-ph-04-c` | Q12 composer、projection identity、entry/static checks | `Committed read sections:`；`No-write entry checks:` | generation/identity、无 refresh/reconcile/upsert | QRY/BND no-write report |
| `commit-ph-05-a` | Consumer header/receipt/disposition、negative loop | `Header-first consumer surface:`；`Receipt and duplicate handling:` | no payload/hash/ACK/cursor、event-zero | CNS/CONTRACT report |
| `commit-ph-05-b` | Job DTO、claim/checkpoint/report/result/idempotency | `Local job protocol:`；`Stored report replay:` | result/report symmetry、duplicate/idempotency | JOB/UOW report |
| `commit-ph-05-c` | local Job runners、generation/claim guards、no-repair | `Job runners and claim fences:`；`No-repair and no-replay:` | owner truth unchanged、stale claim、cleanup | JOB/REPLAY report |
| `commit-ph-05-d` | script/check/report/index、event-zero/link/pairing | `Gate and check capabilities:`；`Same-run report pairing:` | no-static、redaction/dependency/link/cleanup | report-audit/link/pairing report |
| `commit-ph-06-a` | baseline/preflight、selected adapter/run slot | `Selected integration preflight:`；`Public adapter slot:` | authority、fixed run、target tier、blocked posture | controlled/preflight report |
| `commit-ph-06-b` | same-run evidence/VETO/link/review/handoff | `Evidence and VETO package:`；`Reviewed handoff inputs:` | same-run pair、independent review、无 verdict伪造 | acceptance/review reports |

映射规则：每个 body group 必须能回到 Step 6 的同一子功能和 allowed scope；若一个 group 同时指向两个 boundary，必须拆回对应 boundary 或发起 Step 10 change-upstream，不能通过 scope 名称掩盖合并。

### 6.5 提交时机与禁止提交矩阵

| 情形 | 提交动作 | 状态/理由 |
|---|---|---|
| 当前 boundary 的 Design/Scope/Toolchain/Contract/State/Test/Evidence Gate 均有真实证据 | 允许准备 Commit Gate；用户另行授权后才可 commit | 只代表条件满足，不自动执行 commit |
| 设计 truth、字段/DTO/state/port、配置或验收发生变化 | 禁止 | `change-upstream`、新 baseline、受影响 boundary 重审 |
| required test/check 未执行、failed、unavailable 或 report 缺失 | 禁止 | `blocked/not_run/incomplete`，不能以设计 pass 替代 |
| VETO/P0/security/dependency/evidence-integrity finding | 禁止且不可 risk-accept | 进入 Step 10 pause/recovery |
| 跨 boundary/phase 或用户改动混入 | 禁止 | 修复 staging/scope，必要时 rollback-current |
| 只剩格式化且已明确为同一 boundary 的无行为变更 | 仅在同 boundary Gate 允许时合并 | 不得把无关格式化带入功能提交 |
| 同 boundary 子功能尚未完成但实现者想先提交 WIP | 禁止 | 不创建 WIP commit；保留工作区台账，等 boundary 完成 |
| 正式 07/implementation ledger/boundary skeleton 尚未允许 | 禁止创建实施交付事实 | Step 13 前只写 calibration 计划 |

### 6.6 提交前 Gate 矩阵（未来实现期）

| Gate | 必须确认 | 证据/引用 | 失败动作 |
|---|---|---|---|
| Design Gate | 正式 truth source、当前 boundary calibration、Step 10 状态和 design baseline 一致；可落码项无 blocker | required-read record、baseline reference、设计复核结论 | `wait_design`，回写 owning source |
| Scope Gate | 只改当前 boundary allowed scope；未触碰用户改动、后续 phase/private seam/direct DB/bus/topic | scope snapshot、diff classification | `fix_gate_failure` 或 `rollback-current` |
| Worktree Gate | 工作树起点、staged/unstaged ownership、目标实现仓和路径符合 authority | status snapshot、ownership note | 暂停，隔离用户改动 |
| Toolchain Gate | 由 authority 指定的 formatter/build/lint/type/test/check 可运行且版本被记录 | command/version report（未来） | `blocked`，不猜命令 |
| Contract/State Gate | DTO、fields、states、refs、mapper、UoW、idempotency、config/evidence carriers 闭合 | targeted review/test report | 回写 03/04/05/06，禁止补口 |
| Test Gate | Step 7 对应 suite/CUT/TC 和 required negative/controlled lane 通过或明确 blocked carve-out | same-run suite/check report | 修复并新 run；不提交 |
| Evidence Gate | raw/report/check pair、same-run、digest/source、redaction、dependency、link/pairing、cleanup 完整 | report/audit paths | incomplete/blocked；不 handoff |
| Commit Gate | message、staged scope、whitespace、required checks、review notes 和 failure lineage 完整 | message file、diff check、boundary ledger | `fix_gate_failure`；不 commit |
| Handoff Gate | 实际 baseline、commit hash（若存在）、gate status、remaining blocker、next boundary、review authority 已回写 | implementation ledger、review/handoff report | `handoff` 不通过；不进入下一 boundary |

### 6.7 评审纪律表

| 评审面 | 必须审查 | 独立性/证据 | 失败处理 |
|---|---|---|---|
| Design closure | fields、DTO、state、typed ref、validation truth、metadata/idempotency、projection/rebuild、artifact materialization、phase boundary | 设计负责人或被授权 reviewer；对应 truth source 引用 | `wait_design`，回写设计并重审 |
| Boundary scope | 一句话增量、allowed/forbidden scope、后续 phase 越界、body group 映射 | code reviewer + diff/scope snapshot | 拆 scope 或回退当前 WIP |
| Code correctness | 本 boundary 业务/状态/错误/恢复/副作用实现与正式设计一致 | 实现 reviewer；targeted checks | 修复或新 baseline，不自签通过 |
| Test evidence | required suite/CUT/TC、失败分类、same-run pair、raw/report/check 可回链 | 独立测试/证据 reviewer | 补跑/修 writer；保留失败材料 |
| Security/dependency | redaction、private implementation、direct DB/bus/topic、event=0、Query/Consumer/Job 红线 | 安全/架构 reviewer；scan report | 立即 pause，VETO/P0 不可接受 |
| Config/environment | profile/source/readiness、secret handling、environment/slot 语义 | 配置/安全 reviewer；config check | fail-closed，禁止 fallback |
| Commit message | title、type/scope、summary、body groups、file bullets、空行、footer、语言 | reviewer 对照 message file | 重写 message，不改 scope 事实 |
| Acceptance/handoff | AC/AR/TX/NFA/VETO、open issues、review dispute、target tier、handoff scope | 验收/GRC authority；不由实现者自签 | `handoff` blocked，不生成 verdict/signoff |

### 6.8 交付纪律与 artifact/report 检查

| 交付项 | 必须条件 | 当前事实/失败处理 |
|---|---|---|
| Boundary commit | 一 boundary 一 commit；Commit Gate 通过；用户已授权提交 | 当前 `commit_required=false`，无 commit |
| Implementation ledger | 项目级 ledger、当前 boundary ledger 和未来 planned skeleton 已按 Step 13 规则创建 | Step 13 前禁止创建；当前 `RUN-DOC-003` open/blocking |
| Run-scoped artifacts | 若执行 gate，所有 raw artifact 置于 `artifacts/test/<run_id>/`，显式 run/profile/root | 当前未执行；缺 run 记 `not_created` |
| Run reports | suite/run/check report 可从同一 run raw 回链；失败 report 保留 | 当前未生成；缺 pair 不得 handoff |
| Evidence index | 仅由有效 same-run raw/report/check pair 生成；slot/alias 不等 evidence | 当前未生成；静态 index 不合格 |
| Redaction/dependency/link/pairing/cleanup | 所有 required checks 有状态；unavailable 不记 clean | 当前未执行；scanner/tool blocker 保持 blocked |
| Acceptance draft | `reports/acceptance/handoff.md`、`veto-checklist.md`、`open-issues.md` 等只能是审查载体 | 当前未创建；draft 不等 verdict |
| Independent review | 设计/测试/安全/验收 review 分离，争议保留 | 当前无 reviewer/run；不能 handoff |
| Final decision | verdict/signoff/readiness 只能由 06/授权 authority 产生 | 当前 `actual_verdict=none`，不得生成 |
| Failed material | failed/partial run、report、check、cleanup journal 不删除；修复用新 run lineage | 当前无实例；未来按 Step 10 §6.9 |

### 6.9 合格与不合格 commit 示例

#### 合格实现仓示例（计划格式，不是实际提交）

```text
feat(consumer): add header-first receipt boundary for commit-ph-05-a

Header-first consumer receipts and negative dispositions for commit-ph-05-a:

Header-first consumer surface:
- consumer_protocol.rs (~+120/-8): define header-only readiness and typed disposition mapping.
- receipt.rs (+76): preserve stored receipt identity without payload parsing or ACK.

Receipt and duplicate handling:
- consumer_service.rs (~+210/-24): add strict duplicate handling and blocked outcomes.
- consumer_tests.rs (+98): cover no-payload, no-ACK, no-cursor, and event-zero assertions.

Co-Authored-By: Codex <noreply@openai.com>
```

该示例只表达 message 形状；文件名、改动量和 report 路径不是当前事实，也不能作为实现仓已存在的证据。

#### 合格 design 仓示例（计划格式，不是本轮提交）

```text
docs: 收稳 Runner 提交与交付纪律

固定 18 个 commit boundary 的 message、评审、证据和交付规则：

提交边界映射:
- 07_implementation_plan_step_11_commit_review_delivery.md (~+300): 固定一 boundary 一提交、body 分组和 handoff 门禁。

Co-Authored-By: Codex <noreply@openai.com>
```

#### 不合格示例

```text
feat(consumer): add consumer
Header-first work:\n\n- crates/application/src/consumer.rs (+210): implement consumer.

- receipt.rs (+76): receipt.
Co-Authored-By: Codex <noreply@openai.com>
```

错误原因：缺少真实空行、包含字面量 `\n`、使用完整路径、bullet 之间插入空行、body 没有按协作子功能分组，且没有说明该改动只属于哪个 boundary。

#### 不合格拆分示例

```text
commit A: feat(consumer): add header DTO
commit B: feat(consumer): add receipt store
commit C: feat(consumer): add no-ACK tests
```

如果三者共同构成 `commit-ph-05-a`，它们必须在一个 boundary commit 内按 body 分组；除非 Step 6/10 正式重审并拆出新的 boundary。

### 6.10 跨提交边界纪律审计

| 审计项 | 结论（设计层） | 依据/后续动作 |
|---|---|---|
| 18 个 boundary 是否各有一笔提交规则 | `pass` | §6.4、Step 6 18 行；实现执行时逐 boundary 复核 |
| type/scope 是否能回指 boundary | `pass`（候选层） | §6.2/§6.4；目标仓 authority 到达后锁定实际 scope |
| design/implementation message 语言是否分离 | `pass` | §6.3、书写规范 §5.11 |
| body 是否按子功能而非文件平铺 | `pass` | §6.4、合格/反例 |
| footer、空行、真实换行和 `git commit -F` 是否明确 | `pass` | §6.3、§6.9 |
| Commit Gate/Handoff Gate 是否包含 evidence pairing | `pass` | §6.6、§6.8；当前无实例 |
| 失败材料和新 run lineage 是否不可覆盖 | `pass` | Step 10 §6.9 与 §6.8 |
| reviewer 是否分离且不自签 verdict | `pass` | §6.7/§6.8、06 authority boundary |
| 技术命令是否被错误硬编码 | `pass` | 只写 authority 到达后绑定；`RUN-DDD-002` 继续 blocked |
| 提交时机是否受 VETO/P0/设计 blocker 阻断 | `pass` | §6.5/Step 10；不可 risk-accept |
| 当前是否创建/执行任何交付事实 | `pass` | 无仓、commit、run、artifact/report/evidence/verdict/signoff/readiness |

## 7. 回填草稿（未来正式 `07-实施计划.md` §11）

正式 §11 在 Step 13 装配时只保留以下收口结论，详细矩阵和示例继续保留在本 Step：

1. **提交粒度**：一笔实现仓 commit 对应一个 Step 6 `commit-ph-*` boundary；同 boundary 子功能在 body 分组，不按文件拆分；不同 boundary 不合并。
2. **语言与 message**：当前 design 仓采用英文 type、中文 subject/body 和固定 `Co-Authored-By: Codex <noreply@openai.com>`；未来实现仓 title/body、源码标识符、注释、测试名默认英文，标题固定 `type(scope): subject`，目标仓更严格规则只能叠加。
3. **格式**：标题后真实空行；body 第一段概括 boundary，后续按子功能分组；文件条目只写文件名和近似改动量；bullet 之间不插空行；footer 前空一行；复杂 message 使用 `git commit -F`。
4. **提交前门禁**：Design/Scope/Worktree/Toolchain/Contract-State/Test/Evidence/Commit/Handoff Gate 均需有真实证据；设计 blocker、required check 未执行/失败、VETO/P0、安全/证据完整性、用户改动混入或跨 boundary 时禁止提交。
5. **评审与交付**：设计、实现、测试/证据、安全/依赖、配置和验收/GRC review 分离；交付只引用同一 run 的 report/check/acceptance path；handoff、VETO checklist、risk acceptance 是审查载体，不等 verdict/signoff/readiness。
6. **失败材料**：failed/partial artifact/report/check/cleanup journal 永久保留，修复使用新显式 run_id 和 predecessor/supersedes；不跨 run 拼 evidence，不删除失败材料。
7. **事实声明**：当前 Step 11 只完成设计纪律；没有实现仓、工具、baseline、commit、run、artifact、report、evidence、verdict、signoff 或 readiness 实例。

## 8. 待确认事项、持续 blocker 与重开触发

| 编号 | 待确认/ blocker | 对 Step 11 的影响 | 未确认前处理 | 重开入口 | 当前状态 |
|---|---|---|---|---|---|
| `OQ-RUN-001` | 目标实现仓创建方、初始 baseline、提交 hook 和用户改动登记 | 无法确定实际 staging、message hook 和 commit 命令 | 仅保持计划规则，不创建仓/commit | `SP-RUN-001`、PH-01、`commit-ph-01-a` | `blocked` |
| `OQ-RUN-002` | 语言/runtime、GUI/CLI、process/packaging、编码规范路径 | 无法绑定真实 formatter/build/lint/test 或源码语言检查 | 只写逻辑 Gate，不猜命令 | `RUN-DDD-002`、Step 3/8/11 | `blocked` |
| `OQ-RUN-012` | scripts/gates/checks/reports 技术 authority、scanner availability、reviewer | 无法生成或审查实际 report/evidence | 工具 unavailable 记 blocked，不记 clean | `SP-RUN-010`、`commit-ph-05-d`/`06-b` | `waiting` |
| `OQ-RUN-016` | 每个 boundary 的 review、evidence review、risk/disposition 权限 | 不能 handoff 或接受风险 | 不自签、不生成 verdict | 各 boundary Gate、06 authority | `waiting` |
| `RUN-OPS-001~002` | GRC、SLO、retention、真实 integration/release 环境 | PH-06 delivery 只能 `baseline_blocked/not_run` | 不写 production/release 结论 | SP-RUN-012、PH-06 | `blocked` |
| `RUN-DOC-003` | 正式 07、implementation ledger、planned boundary skeleton 尚未创建 | 不能移交实现 agent | Step 13 前保持未创建 | Step 13 full-restart | `open/blocking` |
| 目标仓可能有更严格规则 | 实际 type/scope/footer/hook 可能变化 | 目标规则到达前不锁最终值；更严格规则只能叠加 | Step 11 recheck / Step 13 | `pending` |

待确认事项不会自动授权提交，也不会清除上游 blocker；必须有正式 authority、审查记录和必要的新 baseline。

## 9. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 提交纪律、提交时机和粒度明确 | `pass` | §6.1、§6.5；一 boundary 一 commit |
| design/implementation 语言边界明确 | `pass` | §3、§6.3；不继承历史技术选择 |
| type/scope 候选和 boundary 映射完整 | `pass` | §6.2、§6.4；实际 scope 仍等待目标仓 authority |
| body/footer/换行/文件条目规则完整 | `pass` | §6.3、§6.9 合格/反例 |
| 18 boundary 的 commit body 分组和 review focus 完整 | `pass` | §6.4 18/18 |
| Commit/Handoff Gate 与失败材料、same-run evidence 对齐 | `pass` | §6.6、§6.8；未生成实例 |
| 评审角色、交付证据和 handoff/verdict 分离 | `pass` | §6.7、§6.8 |
| 跨 boundary 纪律审计完成 | `pass` | §6.10 无 unresolved 设计冲突 |
| 当前事实边界保真 | `pass` | 无实现仓、commit、run、artifact/report/evidence、verdict/signoff/readiness |
| 可进入 Step 12 | `pass_for_step_12` | 下一步创建并完成 `07_implementation_plan_step_12_completion_criteria.md`；正式 07、implementation ledger、boundary skeleton 仍禁止提前创建 |

## 10. Step 自审记录

| 自审项 | 结论 | 说明 |
|---|---|---|
| 是否只承接 Step 6/7/10 和标准 | `pass` | 未新增业务需求、对象、DTO、测试分母、验收 authority 或技术选型 |
| 是否覆盖 SOP 要求的 message、type/scope、body、footer、语言边界 | `pass` | §3、§6.1～§6.4、§6.9 完整 |
| 是否为 18 boundary 提供 body 分组和评审入口 | `pass` | §6.4 18/18 |
| 是否禁止按文件拆提交和跨 boundary 合并 | `pass` | §2.3、§6.5、§6.10 |
| 是否保护失败 artifact/report、same-run pairing 和事实边界 | `pass` | §6.8、Step 10 lineage 规则 |
| 是否避免硬编码 Rust/Tauri/cargo/path | `pass` | 命令和 scope 均标 authority 到达后绑定 |
| 是否保持 Query/Consumer/Job/event-zero 红线 | `pass` | scope、review、Gate 和 boundary mapping 独立覆盖 |
| 是否保持 Step 13 时序 | `pass` | 未创建正式 07、implementation ledger 或 boundary skeleton |

## 11. Step 结论与门禁

```text
current_document = 07-实施计划.md
current_step = 11
current_module = commit_review_delivery_discipline
gate_status = completed / pass / self_reviewed
gate_reason = 提交粒度、type/scope、message/body/footer、design/implementation 语言边界、18 boundary body 分组、提交前 Gate、独立评审、artifact/report 交付、失败材料和 handoff/verdict 分离均已收敛；目标实现仓、工具、baseline、commit、run、artifact/report/evidence/verdict/signoff/readiness 仍未创建或执行。
next_allowed_action = create_and_complete_07_step_12_completion_criteria
formal_07_write_allowed = false_until_step_13_assembly
implementation_ledger_allowed = false_until_step_13_assembly
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```
