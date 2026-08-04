# L4-observability 07-实施计划 Step 11：提交、评审与交付纪律

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 11
> 对应书写规范：`standards/document/实施计划书写规范.md` §5.11、§4.9
> 直接输入：current Step 06~10、`代码实施台账与门禁规范.md`、`03/04/05/06` current 正式文档
> 文档性质：设计讨论中间产物。本文定义未来实现仓的提交、评审、handoff 和证据纪律，不声称已有 commit、review、run、artifact 或 report。

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| project | `L4-observability` |
| document | `07-实施计划` |
| step | `Step 11 / 提交、评审与交付纪律` |
| mode | `full-restart` |
| status | `completed_current_step_11` |
| current module | `commit-review-delivery-discipline` |
| input baseline | current Step 01~10；current formal `03/04/05/06` |
| implementation repo reality | `/home/aris/Projects/quantalithos-observability` absent when checked |
| implementation commit reality | no implementation commit/hash/review/handoff exists |
| design gate | `pass_with_affected_and_reality_preconditions` |
| new upstream blocker | `none` |
| inherited affected | `12` 项继续 `open` / `controlled` / `conditional` |
| next allowed action | `continue_to_step_12` |
| current commit | 不需要；用户未要求提交 |

## 2. 本步输入与阅读记录

| 输入 | current 用法 | 结果 |
|---|---|---|
| Step 06 boundary matrix | 固定一 boundary 一 commit、子功能分组和 scope 回指 | 16 个 boundary 均有可映射提交规则 |
| Step 07 gate matrix | 固定提交前 required checks、AC/VF 关联和 planned evidence 归属 | gate pass 不等于 acceptance verdict |
| Step 08 readiness | 固定目标仓、toolchain、profile/lane、artifact/report root 的现实检查 | 缺失状态保持 blocked/not_run/not_evaluated |
| Step 09 risk register | 固定提交阻断风险、affected 和 report provenance 风险 | hard blocker 不转风险接受 |
| Step 10 control rules | 固定暂停、回退、变更和恢复时的提交禁令 | 不覆盖失败材料、不回退用户改动 |
| `实施计划书写规范.md` §4.9 | 提供 title/body/footer/语言/格式规则 | 实现仓和设计仓规则显式分开 |
| `代码实施台账与门禁规范.md` | 提供 Commit Gate、Handoff Gate 和 ledger 字段 | Step 13 才创建 current implementation assets |

## 3. SOP 问题回答

1. **提交前 Git 配置。** 目标实现仓必须检查 `user.name=quantalithos-labs`、`user.email=quantalithos.ai@gmail.com`；目标仓若有更严格 hook，只能叠加约束。
2. **提交依据。** 提交规范、目标仓编码规范、Step 06 boundary、Step 07 gate、Step 10 control 和目标仓近期合格提交共同构成依据；目标仓不存在时不伪造历史样例。
3. **仓库语言边界。** 当前编辑的是 `quantalithos-design`，设计仓提交允许英文 type + 中文 subject/body；未来实现发生在 `quantalithos-observability`，commit message、标识符、rustdoc、普通注释和测试名默认英文。
4. **标题格式。** 实现仓固定 `<type>(<scope>): <subject>`，scope 必填；设计仓可按项目历史使用 `<type>: <中文 subject>`，但本项目仍建议保留 scope 以便审计。
5. **粒度。** 一笔提交对应 Step 06 的一个 boundary；同 boundary 内的多个协作子功能保留一笔提交，在 body 中分组，不按文件、crate 或函数拆散。
6. **提交时机。** 只有当前 boundary 的设计闭环、scope、required checks、测试/报告、Commit Gate 和 review 均达到允许状态后才能提交；设计 blocker、hard gate failure、静态 evidence、无关 diff 或越界内容存在时禁止提交。
7. **证据引用。** message、PR 或 handoff 只引用 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` 和 `reports/review` 的路径；不粘贴完整日志，不用 `latest`。
8. **报告审查。** raw artifact 生成后必须有对应同 run report；acceptance/handoff、VETO checklist 和 risk acceptance 只能作为经过人/Agent审查的输入，脚本生成初稿不等于审查完成。
9. **设计偏离。** 发现 object/protocol/state/source/config/test/acceptance/boundary 缺口时按 Step 10 回写对应真相源，固定新 baseline，再重新审查当前 boundary；提交不能代替设计修复。
10. **affected 纪律。** I05、H13、UoW/recovery、external phase、Consumer completion、job report ref、secondary owner 和 per-flow proof 等 affected 只能在提交 body/handoff 中如实列为 open/controlled/conditional，不得写成 positive closure。

## 4. 当前材料问题诊断与历史处置

| 材料/问题 | 诊断 | current 处理 |
|---|---|---|
| 旧 Step 11 | 旧内容按文件/服务描述，未覆盖 current 16 boundary、same-run provenance 和 affected | `historical_material`；本文件重建 |
| 旧 implementation ledger | 可能含未来 commit/hash/status 的静态值 | Step 13 全部重建；本 Step 只定义字段和规则 |
| 目标实现仓 | 当前不存在，无法读取历史 commit | 不伪造历史样例；使用规范中的例子并标为 illustrative |
| 设计仓与实现仓语言 | 容易把中文规则带入 Rust 实现仓 | 分两张规则表，并在提交前清单中重复检查 |
| report/evidence | 可能把候选索引或 acceptance 初稿当最终结论 | 保留成熟度和人工/Agent review 状态，不产生 verdict/signoff |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| commit 粒度 | 有 boundary 但缺统一提交约束 | 16 boundary 一一映射到一笔提交 | 便于 review、回退和 evidence 归属 |
| scope | 可能按目录随意命名 | 使用 project-specific scope 且可回指 boundary | 避免文件平铺和 scope 漂移 |
| message body | 只写文件或短摘要 | 先 boundary summary，再按协作子功能分组和文件改动量 | 让提交解释可验证增量 |
| 语言 | design/implementation 规则混合 | design 中文说明、实现仓全英文 | 防止提交和源码规范串用 |
| 交付 | 只要求代码提交 | 同时要求 ledger、门禁、raw/report、review 和 affected handoff | 避免实现 agent 自行补交付面 |

## 6. 设计取舍

| 方案 | 结论 | 原因 |
|---|---|---|
| 按文件/目录各提交一次 | 不采用 | 打散可验证功能增量，无法独立审查 boundary |
| 一个 phase 一笔大提交 | 不采用 | 过粗，难以定位 UoW、redaction、query 或 evidence 风险 |
| 一 boundary 一笔提交 | 采用 | 与 Step 06、rollback 和 ledger 完全对齐 |
| 每个子功能单独提交 | 不采用 | 同 boundary 的协作增量会被人为拆散 |
| message 使用多次 `-m` 拼接 | 不采用 | 难以控制真实换行、分组和 footer |
| message 文件 + `git commit -F` | 采用 | 可机器检查 title/body/footer 格式 |
| 代码提交携带静态 passed/evidence | 不采用 | 违反 same-run provenance 和验收职责分离 |

## 7. 结构化中间产物

### 7.1 提交纪律表

| 项 | 实现仓要求 | 检查方式 |
|---|---|---|
| Git identity | `user.name=quantalithos-labs`；`user.email=quantalithos.ai@gmail.com` | `git config user.name/email` |
| 提交粒度 | 一笔提交对应一个 Step 06 boundary | 对照 boundary ledger 和 staged scope |
| 标题 | `<type>(<scope>): <subject>`，scope 必填，英文 | message file / `git log` |
| body | 英文；第一段说明 boundary，再按子功能分组 | message file review |
| 文件条目 | 只写文件名，带 `(+3)`/`(-35)`/`(~38)`/`(~+330/-60)` | message lint/review |
| 换行 | 不得出现字面量 `\n`；bullet 之间不插空行 | message file scan |
| footer | AI 参与时使用 `Co-Authored-By: Codex <noreply@openai.com>` | footer scan |
| 提交工具 | 复杂 message 使用 `git commit -F <message-file>` | command/review record |
| 设计回写 | 偏离已更新 `03/04/05/06/07` 或标准并固定新 baseline | design diff/review |

### 7.2 Design 仓与实现仓语言边界

| 仓库 | title/body | 源码/文档语言 | footer |
|---|---|---|---|
| `/home/aris/Projects/quantalithos-design` | `type` 英文；subject/body 可中文；scope 按项目历史 | 设计正文可中文 | 项目固定 footer：`Co-Authored-By: Codex <noreply@openai.com>` |
| `/home/aris/Projects/quantalithos-observability` | title/body 全英文；标题固定 `type(scope): subject` | 标识符、rustdoc、普通注释、测试名默认英文 | 实现仓有 AI 参与时同上 |

实现仓如必须出现中文，只能是明确的业务数据、协议样例、国际化资源或测试夹具，并须在 boundary ledger 记录原因和落点；不得用中文替代代码标识符或 review 说明。

### 7.3 Type / Scope 约束

| 项 | 允许值 |
|---|---|
| type | `feat`、`fix`、`refactor`、`docs`、`test`、`chore`、`perf`、`ci`、`style` |
| scope | `workspace`、`config`、`contract`、`domain`、`input`、`consumer`、`audit`、`evidence`、`projection`、`query`、`handoff`、`retention`、`job`、`runtime`、`gate`、`release`、`report` |

| Boundary | 推荐 type/scope | scope 选择理由 |
|---|---|---|
| `commit-01-a` | `chore(workspace)` | workspace、crate、only-core dependency 骨架 |
| `commit-01-b` | `feat(config)` | strict profile/config 与 canonical roots |
| `commit-02-a` | `feat(contract)` | public ref、protocol、DTO、error carrier |
| `commit-02-b` | `feat(domain)` | state、policy、history、technical carrier |
| `commit-03-a` | `feat(input)` | intake、redaction、correlation、UoW |
| `commit-03-b` | `feat(consumer)` | Consumer pre-parse、completion、controlled slot |
| `commit-04-a` | `feat(audit)` | audit/evidence/gap append and storage |
| `commit-04-b` | `feat(evidence)` | evidence/audit read and provenance |
| `commit-05-a` | `feat(projection)` | log/metric/trace projection and derived event |
| `commit-05-b` | `feat(query)` | 14 Query、diagnostic、strict zero-write |
| `commit-06-a` | `feat(handoff)` | handoff、evidence index、retention/protection |
| `commit-06-b` | `feat(job)` | Job、rebuild、recovery、external phase |
| `commit-07-a` | `feat(runtime)` | config assembly、entry assignment、activation |
| `commit-07-b` | `ci(gate)` | redaction/metric/dependency/report checks |
| `commit-08-a` | `feat(release)` | suite manifest、raw artifact、run report |
| `commit-08-b` | `feat(report)` | acceptance/review input shell |

推荐 scope 不是实现事实；实际提交前必须与当前 boundary 的 staged diff 和目标仓规范复核。

### 7.4 Commit message 结构

```text
<type>(<scope>): <english subject>

<One-sentence English summary for this commit boundary.>

<Sub-feature group A describing one cooperating increment>:
- <file_name> (<change-size>): <functional change in English>.
- <file_name> (<change-size>): <functional change in English>.

<Sub-feature group B describing the coupled increment>:
- <file_name> (<change-size>): <functional change in English>.

Co-Authored-By: Codex <noreply@openai.com>
```

规则：标题后空一行；body 先写一句 boundary summary；分组按 Step 06 子功能而非按文件类型；文件条目不含完整路径；bullet 之间不插空行；footer 前有真实空行；不得写字面量 `\n`；需要精确控制时使用 message file 和 `git commit -F`。

### 7.5 16 boundary 到 body 分组映射

| Boundary | Step 06 子功能分组 | Commit body 分组名称 | planned evidence 引用 |
|---|---|---|---|
| `commit-01-a` | workspace/Cargo skeleton；core dependency/static | `Workspace and package layout:`；`Core dependency boundary:` | boundary ledger、GATE-OBS-01 candidate |
| `commit-01-b` | config parser；script/path roots | `Strict configuration assembly:`；`Gate and report roots:` | config dry-run、GATE-OBS-07 candidate |
| `commit-02-a` | refs/metadata/protocol carriers；owner/body-free checks | `Public observation contracts:`；`Protocol ownership and serialization:` | contract suite、GATE-OBS-02 |
| `commit-02-b` | domain state/policy/history；technical carriers | `Observation state and policy:`；`Technical history carriers:` | domain suite、GATE-OBS-02 |
| `commit-03-a` | input assembly/accepted flow；UoW/idempotency/redaction | `Intake application flow:`；`Transaction and safety guards:` | service/UoW report、GATE-OBS-03/08 |
| `commit-03-b` | API/Consumer pre-parse；completion/controlled I05 | `Entry and envelope validation:`；`Completion and controlled availability:` | entry/recovery report、GATE-OBS-05 |
| `commit-04-a` | audit/evidence/gap sources；append/UoW/event snapshot | `Audit and evidence records:`；`Committed snapshot persistence:` | audit/repository report、GATE-OBS-04 |
| `commit-04-b` | Q05/Q06 read surface；event provenance/no-write | `Evidence read surfaces:`；`Read provenance and no-write guards:` | query report、GATE-OBS-09 |
| `commit-05-a` | signal schema/allowlist；projection/rollup/derived event | `Safe signal projection:`；`Derived event snapshots and sink safety:` | telemetry/projection report、GATE-OBS-08 |
| `commit-05-b` | Q01~Q14 carriers/bundles；diagnostic/write spies | `Strict observation queries:`；`Diagnostic and zero-write enforcement:` | query/no-write report、GATE-OBS-03/09 |
| `commit-06-a` | handoff/evidence index/authenticity；retention/protection | `Report handoff and evidence inputs:`；`Retention and protection guards:` | handoff/retention report、GATE-OBS-06 |
| `commit-06-b` | J01~J09 plan/claim/fence/report；rebuild/external controlled | `Job lifecycle and stored reports:`；`Recovery and external phase controls:` | recovery report、GATE-OBS-06 |
| `commit-07-a` | runtime builder/config; entry assignment/registrars | `Profile-bound runtime assembly:`；`Least-authority entry activation:` | config/entry report、GATE-OBS-07 |
| `commit-07-b` | static redaction/metric/dependency/report checks | `Safety and dependency scanners:`；`Report provenance gate orchestration:` | check raw/report candidate、GATE-OBS-08/10 |
| `commit-08-a` | suite manifest/99 TC/82 DS；raw/report generators | `Run-scoped test execution:`；`Artifact and report provenance:` | `artifacts/test/<run_id>`、`reports/runs/<run_id>` |
| `commit-08-b` | handoff/review/VF/risk/open issues | `Acceptance input assembly:`；`Review and unresolved-state records:` | `reports/acceptance`、`reports/review` |

以上是 body 分组的设计映射，不是实际文件列表或提交记录；实际文件名和改动量只能在目标 boundary 执行时填写。

### 7.6 合格实现仓 commit 示例

```text
feat(query): add strict observation query surfaces

Strict read-only observation queries and diagnostic zero-write enforcement for commit-05-b:

Strict observation queries:
- query_contracts.rs (~+120/-8): add the exact query selectors, page carriers, and visibility outcomes.
- query_services.rs (~+260/-20): assemble same-boundary read bundles without rebuilding projections.

Diagnostic and zero-write enforcement:
- diagnostic_views.rs (+145): map stale, degraded, and unavailable results without changing source state.
- query_spies.rs (+96): assert that all query branches avoid writer, reservation, refresh, and rebuild calls.

Co-Authored-By: Codex <noreply@openai.com>
```

该示例只说明格式，不代表真实文件、行数、测试结果或 commit 已存在。

### 7.7 不合格 commit 反例

```text
feat(query): add queries
Observation work:\n\n- crates/application/src/query_services.rs (+260): queries.

- routes.rs (+80): routes.
Co-Authored-By: Codex <noreply@openai.com>
```

错误原因：标题后缺真实空行；body 含字面量 `\n`；文件条目写完整路径；bullet 无功能分组；subject 过于笼统；无法回指一个明确 boundary。

### 7.8 不合格拆分示例

```text
commit 1: feat(query): add query carriers
commit 2: feat(query): add query services
commit 3: feat(query): add query routes
```

若三部分共同构成 `commit-05-b`，应合并为一笔 boundary commit，并在 body 中按 `Strict observation queries` 与 `Diagnostic and zero-write enforcement` 分组；只有 Step 06 重新拆 boundary 后才允许拆提交。

### 7.9 提交前检查清单

| 检查项 | 通过条件 |
|---|---|
| Git identity | `user.name` 和 `user.email` 符合项目要求 |
| current boundary | project ledger 与 boundary ledger 指向同一 boundary |
| design baseline | current `03/04/05/06/07` 和 affected register 已读，baseline 已记录 |
| diff scope | staged 文件只属于一个 boundary；没有用户已有改动或无关噪音 |
| design closure | 字段、DTO、state、ref、source、metadata、idempotency、projection、artifact、phase boundary 无 blocker |
| required checks | Step 07 对应 test/check/report 已执行或明确为 `not_applicable`；不得静态填 pass |
| redaction/no-write | 相关 scanner、writer spy、body-free 检查无 hard finding |
| evidence | raw artifact 与同 run report 配对，路径可回链；不使用 `latest` |
| affected | 受影响项的状态、owner、禁止声明和 next action 已记录 |
| title | 实现仓使用英文 `type(scope): subject`，scope 非空 |
| body | boundary summary + 子功能分组 + 文件名 + 改动量 |
| format | 无字面量 `\n`；标题/footer 空行正确；bullet 间无空行 |
| footer | AI 参与时有固定 Codex footer；无虚构模型 |
| documentation | 设计偏离已回写并重新核验；未把实现结果写回设计仓 |
| staging method | 复杂 message 使用 `git commit -F <message-file>` |

### 7.10 评审纪律表

| 评审项 | 必须回答 | 失败处理 |
|---|---|---|
| boundary identity | title/body/diff 能否唯一回指 Step 06 boundary | 修改 message 或调整 scope，禁止提交 |
| functional coherence | 子功能是否构成一个可验证增量 | 拆/并 boundary 后重新审查 |
| design closure | 是否存在实现侧补 schema/state/port/ref | pause + 回写真相源 |
| phase boundary | 是否引用后续 phase 的对象、结果或 evidence | 移出 diff 或回写 Step 06 |
| no-write/truth | Query/job/handoff/projection 是否取得 writer capability | hard block，修 capability |
| redaction | body/secret/raw material 是否进入输出或持久化 | hard block，保留 finding |
| test/report | 引用的 report 是否由同 run raw 生成 | 补生成/修 generator，不手写 pass |
| affected | 是否保留 open/controlled/conditional | 恢复 exact affected 记录 |
| language | 实现仓 message/source/test 是否英文 | 修正后重审 |
| user changes | 是否误 stage 用户已有改动 | 重新分离 staging，禁止 destructive rollback |

### 7.11 交付纪律表

| 交付项 | 规则 | 未完成状态 |
|---|---|---|
| code commit | 一个 boundary 一笔提交；不提交半成品 | `pending/blocked` |
| boundary ledger | 记录 baseline、scope、checks、Commit Gate、Handoff Gate、blocker、next boundary | `pending` |
| raw artifact | `artifacts/test/<run_id>` 保存输入、case、gate、失败材料；不覆盖失败 | `not_run`/`blocked` |
| run report | `reports/runs/<run_id>` 只由同 run raw 生成 | `not_run`/`blocked` |
| acceptance input | `reports/acceptance` 只生成 draft，须 review | `draft/open` |
| review input | `reports/review` 记录 reviewer notes，不自动 verdict | `not_evaluated` |
| affected handoff | exact ID、状态、owner、deadline/trigger、禁止声明齐全 | `open/controlled/conditional` |
| release decision | 不由实现 agent 或 generator 代签 | `absent` |

### 7.12 Artifact / report 交付检查表

| 检查项 | 设计期要求 | 执行期允许状态 |
|---|---|---|
| artifact root | `artifacts/test/<run_id>` 唯一根；禁止 project nested root 和 `latest` | `planned/not_run` |
| artifact manifest | meta、source/config/dataset manifest、suite/case/gate raw 可定位 | `planned/blocked` |
| report root | `reports/runs/<run_id>` 与 raw 同 run | `planned/not_run` |
| evidence index | 从 raw evidence index materialize，不能从设计表补 pass | `planned/blocked` |
| gate results | 汇总原始状态，不能折叠 blocked/not_run 为 passed | `planned/blocked` |
| redaction/metric/dependency audit | scanner finding 独立保留，运行成功不等于通过 | `planned/not_run` |
| acceptance handoff | `reports/acceptance/handoff.md` 经人/Agent审查 | `draft/open` |
| VETO checklist | `veto-checklist.md` 有真实 evidence/finding 输入，无自动裁决 | `not_evaluated/open` |
| risk acceptance | 仅有授权角色、scope、deadline/trigger 和 evidence 时进入草案 | `not_applicable/draft` |
| signoff/verdict | 不由 generator 或 design agent 生成 | `absent` |

### 7.13 16 boundary 提交纪律停审记录

| Boundary | scope/message | body 分组 | required evidence | 设计期结论 |
|---|---|---|---|---|
| `commit-01-a` | `chore(workspace)`；英文实现仓标题 | workspace + core dependency | metadata/dependency candidate | `pass_with_target_blocker` |
| `commit-01-b` | `feat(config)` | config + roots | config/path candidate | `pass_planned` |
| `commit-02-a` | `feat(contract)` | public contracts + serialization | contract candidate | `pass_with_affected_open` |
| `commit-02-b` | `feat(domain)` | state/policy + technical carriers | domain candidate | `pass_with_affected_open` |
| `commit-03-a` | `feat(input)` | intake + transaction/safety | service/UoW candidate | `pass_with_uow_affected` |
| `commit-03-b` | `feat(consumer)` | validation + controlled completion | entry/recovery candidate | `pass_with_controlled_affected` |
| `commit-04-a` | `feat(audit)` | records + committed persistence | audit/repository candidate | `pass_with_affected_open` |
| `commit-04-b` | `feat(evidence)` | read surface + provenance | query candidate | `pass_planned` |
| `commit-05-a` | `feat(projection)` | signal + derived snapshot | telemetry candidate | `pass_with_affected_open` |
| `commit-05-b` | `feat(query)` | queries + zero-write | query/no-write candidate | `pass_planned` |
| `commit-06-a` | `feat(handoff)` | handoff + retention | handoff candidate | `pass_with_affected_open` |
| `commit-06-b` | `feat(job)` | job + recovery/external | recovery candidate | `conditional_affected_open` |
| `commit-07-a` | `feat(runtime)` | runtime + entry | config/entry candidate | `pass_with_target_blocker` |
| `commit-07-b` | `ci(gate)` | scanners + provenance gates | check candidate | `pass_planned` |
| `commit-08-a` | `feat(release)` | suite + artifact/report | same-run candidate | `pass_planned_not_run` |
| `commit-08-b` | `feat(report)` | acceptance + review inputs | acceptance candidate | `pass_planned_not_evaluated` |

这些是设计期停审结论，不是提交结果；不存在真实 hash、测试输出或 handoff 签署。

### 7.14 跨提交边界纪律审计表

| 审计项 | 结论 | 处理 |
|---|---|---|
| 16 boundary 是否各有唯一提交粒度 | pass_design | Step 06 矩阵与 §7.13 一一对应 |
| scope 是否能回指 phase/boundary | pass_design | §7.3 |
| body 是否按协作子功能而非文件平铺 | pass_design | §7.5 |
| title/body 语言是否区分设计仓和实现仓 | pass_design | §7.2 |
| footer、空行、改动量和 `\n` 规则是否明确 | pass_design | §7.4/§7.9 |
| gate/report/evidence 是否与同 run 规则一致 | pass_design | §7.12、Step 07 |
| Commit Gate/Handoff Gate 是否可执行 | pass_design | Step 13 boundary skeleton 承接 |
| failed artifact 是否保留 | pass_design | Step 10/§7.12 |
| affected 是否被提交纪律关闭 | no | 12 项继续 open/controlled/conditional |
| 是否伪造 commit/hash/run/verdict/signoff | no | 本 Step 仅定义规则 |
| new upstream blocker | none | 无新增上游冲突 |

## 8. 回填草稿

正式 `07` §11 应保留：一 boundary 一 commit；实现仓英文标题/body；design 仓中文例外；allowed type/scope；body 分组和文件改动量；固定 footer；提交前 checklist；评审/交付纪律；canonical artifact/report 路径；Commit/Handoff Gate；12 项 affected 的如实 handoff。正式正文可压缩正反例，但不能删除语言边界、same-run、review responsibility 或禁止伪造规则。

## 9. 待确认事项

| 编号 | 事项 | 当前结论 | 截止点 |
|---|---|---|---|
| `OQ-OBS-11-001` | 目标实现仓是否有额外 commit hook 或 scope allowlist | 若存在只能叠加；以目标仓规则复核 | `commit-01-a` 前 |
| `OQ-OBS-11-002` | 目标仓近期合格 commit 样例 | 仓不存在时不伪造；首次提交按本 Step 规则 | 首次提交前 |
| `OQ-OBS-11-003` | acceptance/report 产物是否进入实现 commit 或独立交付 | 由 release owner 按 `05/06` scope 决定；路径规则不变 | `commit-08-a/b` 前 |
| `OQ-OBS-11-004` | 实际 reviewer、测试负责人和 truth-boundary reviewer | 必须在 handoff 前具名或记录 authority scope | 每个 boundary handoff 前 |

未关闭事项禁止改变当前 commit scope；不构成新的 upstream blocker，但会保持 `pending/open`。

## 10. 进入下一步条件

| 条件 | 结论 | 依据 |
|---|---|---|
| Git、title、body、footer 和语言规则明确 | pass | §7.1~§7.4 |
| 16 boundary 与 body 分组和 scope 映射完成 | pass | §7.5、§7.13 |
| 一 boundary 一 commit 且禁止按文件拆分 | pass | §7.3、§7.8 |
| Commit Gate/Handoff Gate 所需检查明确 | pass | §7.9、§7.11~§7.12 |
| review、artifact、report、acceptance 责任明确 | pass | §7.10~§7.12 |
| affected、failed evidence、无 commit 伪造规则明确 | pass | §7.13~§7.14 |
| new upstream blocker | none | 未发现新上游冲突 |
| gate_status | `pass_with_affected_and_reality_preconditions` | 纪律设计完成，执行现实未建立 |
| next_allowed_action | `continue_to_step_12` | 进入实施完成判定重建 |

## 11. 参考

- `standards/document/实施计划讨论流程_SOP.md` Step 11
- `standards/document/实施计划书写规范.md` §4.9、§5.11
- `standards/document/代码实施台账与门禁规范.md`
- `standards/document/设计真相源闭环与可落码性标准.md` §九
- `projects/L4-observability/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md`
- `projects/L4-observability/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md`
- `projects/L4-observability/design-calibration/07_implementation_plan_step_09_spikes_risks_open_questions.md`
- `projects/L4-observability/design-calibration/07_implementation_plan_step_10_rollback_pause_change_control.md`
