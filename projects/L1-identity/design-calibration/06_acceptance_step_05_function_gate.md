# Step 5. 定义功能验收门禁

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 5
> 回填章节: `06-验收标准.md` §5 功能验收门禁

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 5 定义功能验收门禁 |
| 当前状态 | 已审核通过 |
| 输入基线 | Step 1~4 已审核通过;新版 `00` FR/BR/AC、`03` flow / protocol、`05` TC / EV / suite |
| 输出文件 | `projects/L1-identity/design-calibration/06_acceptance_step_05_function_gate.md` |
| 正式文档状态 | 本 Step 不修改正式 `06-验收标准.md` |
| 停审方式 | 用户已确认,允许进入 Step 6 |

## 2. 本步目标

把 `L1-identity` 的 P0 功能能力转成可裁决的功能验收门禁,并为每个门禁建立需求 / 设计契约、测试用例、证据 ID、report path 和裁决影响闭环。

本 Step 只定义功能能力门禁:

- identity anchor 与稳定 ref。
- lifecycle 与高风险依据。
- role/capability summary 与 source response。
- career 与 memory/archive refs。
- consumption traceability 与 report-only maintenance。

本 Step 不定义数据边界红线、接口 / event / job 逐项验收、状态事务验收、非功能门禁、证据完整性门禁或 VETO 最终裁决;这些分别在 Step 6~11 闭合。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_02_scope.md` | 已审核通过 | 提供 P0 功能范围与 P1/P2 边界 |
| `06_acceptance_step_03_baseline.md` | 已审核通过 | 提供 `<run_id>`、artifact/report 和 P0 suite 路径规则 |
| `06_acceptance_step_04_entry_exit.md` | 已审核通过 | 提供进入 / 退出条件和风险接受边界 |
| `00-需求文档.md` §9 / §10 / §14 | 正式输入 | 提供 FR-ID-001~014、BR-ID-001~015、AC-ID-001~010 |
| `03-详细设计.md` §6 / §8 / §15 | 正式输入 | 提供正式 Command / Query / Consumer / Job 名称、flow discipline 和最小测试切口 |
| `05-测试方案.md` §5 / §6 / §13 | 正式输入 | 提供 TC family、formal EV family、suite / report path 和 evidence ID |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 P0 功能的通过条件是什么? | 每个功能必须证明对应 FR / BR / AC 在正式设计边界内成立,并能通过 `TC-ID-*`、`EV-ID-*`、suite report 和 raw artifact 复核。通过条件必须同时覆盖正向能力、关键负向保护和 duplicate / no-write / report-only 等功能保护边界。 |
| 每个 P0 功能的失败条件是什么? | 任何功能若无法证明正式设计契约、缺 TC / EV / report path、出现隐式创建、ref 复用、正文泄漏、缺高风险依据 accepted、改写历史、job 修 truth 或 evidence 缺失,都不能作为通过功能门禁。涉及 VETO 的失败在 Step 11 进一步升级裁决。 |
| 证据来自哪些测试用例或报告? | 功能门禁优先引用新版 `05` §13 的正式 `EV-ID-CORE-001`、`EV-ID-CMD-001`、`EV-ID-QUERY-001`、`EV-ID-CONSUMER-001`、`EV-ID-OUTBOX-001`、`EV-ID-JOB-001`、`EV-ID-IDEMP-001`、`EV-ID-REDACTION-001`、`EV-ID-STATE-001` 和对应 suite report。 |
| 哪些 P1 功能只做后置边界验收? | real-like / durable-like selected-run、真实 DB / bus / archive / metric / secret provider、production-like capacity、hard SLO、external HR / IdP、advanced UI / dashboard 均不进入本 Step P0 功能门禁。 |
| 哪些功能失败会导致总体不通过? | P0 功能门禁失败通常导致不通过;若失败同时触发 `VETO-ID-001~006`、S 级缺陷或 evidence integrity 缺口,不得风险接受。仅 P1/P2 residual 或不影响 P0 truth 的非阻断问题可进入 Step 13 风险接受。 |
| 每个功能验收项能否回指需求 / 设计契约、测试用例、证据 ID 和 report path? | 本 Step 对每个 `AC-FUNC-*` 建立了需求 / 设计 / TC / EV / report path / 裁决影响表。正式 `06` §5 不得新增没有这些映射的 P0 功能门禁。 |
| 每个功能验收项完成后是否通过停审? | 本 Step 为每个功能验收项增加停审记录,检查设计来源、证据路径、通过 / 失败条件、P1 污染和 VETO 交叉影响。 |
| 所有功能验收项完成后,是否存在 P0 功能缺门禁、证据重复或裁决影响冲突? | 初步审计结论为无 unresolved 冲突。接口 / 状态 / 红线 / 证据细节会在 Step 6~11 再次分主题审计。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` §4 | 功能门禁按旧命令、旧 query、旧 job 展开 | 改为按新版 C-ID / FR-ID 能力闭环分组 |
| `05-测试方案.md` §5 | 覆盖表中存在测试覆盖族和正式 evidence 族混用 | 本 Step 只引用 §13 的正式 `EV-ID-*` 族作为验收证据 |
| `05-测试方案.md` §6 | 用例族比功能门禁更细 | 本 Step 按能力聚合;接口 / state / job 细项后续 Step 展开 |
| `03-详细设计.md` §8 | flow discipline 包含事务、状态、outbox、job 等横切规则 | 本 Step 只抽取功能通过 / 失败影响,状态事务等细节留到 Step 8 |
| P1 / P2 能力 | 可能被误写成 P0 功能缺口 | 本 Step 明确只验 P0 功能,selected-run / production-like 不作为 P0 必过 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 功能门禁粒度 | 旧草案按历史 Command / Query / Event / Operations 切 | 新版按 5 个核心能力闭环切 | 与 `00` 的 C-ID / FR 分组一致 |
| 证据引用 | 旧草案泛写 API / DB / log | 新版引用正式 EV、TC family 和 fixed report path | 符合验收书写规范 |
| P1/P2 | 旧草案未稳定排除 | 新版明确不得污染 P0 功能门禁 | 保持 Step 2 范围边界 |
| VETO | 旧草案把红线混在功能表里 | 新版功能表标注可能触发的裁决影响,VETO Step 11 正式闭合 | 防止功能门禁和一票否决混杂 |

## 7. 验收裁决取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 功能门禁按接口还是能力分组 | A. 逐接口;B. 按 5 个能力闭环 | 采用 B。Step 7 会逐接口裁决,Step 5 聚焦功能能力。 |
| 是否把 VETO 直接写成失败即不通过 | A. Step 5 直接裁决全部 VETO;B. Step 5 标注影响,Step 11 正式裁决 | 采用 B。符合 SOP 分步边界。 |
| 是否引用候选 evidence family | A. 引用所有覆盖族;B. 只引用 `05` §13 formal EV | 采用 B。避免把候选覆盖名写成正式证据 ID。 |
| 是否要求真实产品 selected-run | A. 要求;B. 不作为 P0 功能门禁 | 采用 B。Step 2/3/4 已确认 P1/P2 不阻断 P0。 |

## 8. 结构化中间产物

### 8.1 功能验收门禁表

| 验收项 ID | 功能 / 场景 | 优先级 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|---|
| `AC-FUNC-001` | Identity anchor and stable ref | P0 | 能建立 `GlobalMember` 身份主语;读取与建立分离;identity ref 在 lifecycle 变化后仍稳定且不复用;duplicate replay 不分配新身份 | 建立失败无正式拒绝面;query / consumer / job 隐式创建 truth;ref 复用;duplicate rerun mutation | `TC-ID-CMD-001~002`;`TC-ID-QUERY-001~002`;`TC-ID-IDEMP-*`;`EV-ID-CORE-001`;`EV-ID-CMD-001`;`EV-ID-QUERY-001`;`EV-ID-IDEMP-001` |
| `AC-FUNC-002` | Global lifecycle and high-risk basis | P0 | lifecycle 变化由显式意图、原因和 actor context 触发;合法迁移 accepted;非法迁移 rejected;高风险处置缺 basis 不 accepted | 非法迁移成功;缺治理 / 授权依据仍 accepted;后台 job 静默执行高风险 lifecycle;生命周期状态与项目/runtime 状态混层 | `TC-ID-CMD-003~004`;`TC-ID-STATE-*`;`EV-ID-CORE-001`;`EV-ID-CMD-001`;`EV-ID-STATE-001` |
| `AC-FUNC-003` | Role/capability summary and source response | P0 | role/capability summary 只保存 source ref、safe summary 和 evidence refs;source unavailable / unrecognized 时不静默污染摘要;definition body 不落入 identity | 缺 source/evidence 仍形成声明;RoleDefinition / CapabilityDefinition 正文落盘或出现在 report/artifact;source change 重复或错误污染 summary | `TC-ID-CMD-005~006`;`TC-ID-CONSUMER-001`;`TC-ID-REDACTION-*`;`EV-ID-CMD-001`;`EV-ID-CONSUMER-001`;`EV-ID-REDACTION-001`;`EV-ID-CONTRACT-001` |
| `AC-FUNC-004` | Career and memory/archive refs | P0 | career append-only;duplicate work source 不生成重复历史;memory/archive 只保存 refs、state 和 handoff receipt;trace handoff empty rejected | 改写 / 删除 / 重排已确认 career;Project / WorkItem truth 被 identity 定义;memory text、embedding、archive package 或 artifact body 进入 truth/report/artifact | `TC-ID-CMD-007~012`;`TC-ID-CONSUMER-002~005`;`TC-ID-REDACTION-*`;`EV-ID-CMD-001`;`EV-ID-CONSUMER-001`;`EV-ID-REDACTION-001`;`EV-ID-CORE-001` |
| `AC-FUNC-005` | Consumption traceability and report-only maintenance | P0 | 正式 query / outbound / trace / audit / reconciliation / job 能支撑身份事实消费和追溯;projection/reference/reconciliation/report-only;job 不修 business truth | 下游越权消费;trace/audit 缺失或正文泄漏;reconciliation / maintenance job 修 identity business truth 或相邻 truth;publish/handoff 当前 truth 重构 payload | `TC-ID-QUERY-007~014`;`TC-ID-OUTBOX-*`;`TC-ID-JOB-*`;`TC-ID-IDEMP-*`;`EV-ID-QUERY-001`;`EV-ID-OUTBOX-001`;`EV-ID-JOB-001`;`EV-ID-IDEMP-001`;`EV-ID-CORE-001` |

### 8.2 功能验收项闭环表

| 验收项 ID | 需求 / 规则来源 | 设计契约 | 测试用例 | 证据 ID | report path | 裁决影响 |
|---|---|---|---|---|---|---|
| `AC-FUNC-001` | `FR-ID-001~003`;`BR-ID-001~003`;`AC-ID-001`;`AC-ID-006` | `03` §6.5 `EstablishGlobalMember`;§6.6 `GetGlobalMemberAnchor`;§8.2;§8.3 | `TC-ID-CMD-001~002`;`TC-ID-QUERY-001~002`;`TC-ID-IDEMP-*` | `EV-ID-CORE-001`;`EV-ID-CMD-001`;`EV-ID-QUERY-001`;`EV-ID-IDEMP-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/release-main-smoke.md` | 失败导致不通过;ref reuse / implicit create 升级 Step 11 |
| `AC-FUNC-002` | `FR-ID-004~005`;`BR-ID-004~006`;`AC-ID-002`;`AC-ID-007` | `03` §6.5 `UpdateGlobalLifecycleState`;§8.2;§9 state matrix | `TC-ID-CMD-003~004`;`TC-ID-STATE-*` | `EV-ID-CMD-001`;`EV-ID-STATE-001`;`EV-ID-CORE-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/contract-domain-fast.md` | 失败导致不通过;basis 缺失 accepted 升级 Step 11 |
| `AC-FUNC-003` | `FR-ID-006~008`;`BR-ID-007~009`;`AC-ID-003`;`AC-ID-008` | `03` §6.5 `MaintainRoleCapabilitySummary`;§6.7 `HandleRoleCapabilitySourceChanged`;§8.4 | `TC-ID-CMD-005~006`;`TC-ID-CONSUMER-001`;`TC-ID-REDACTION-*` | `EV-ID-CMD-001`;`EV-ID-CONSUMER-001`;`EV-ID-REDACTION-001`;`EV-ID-CONTRACT-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/entry-worker-job.md`;`reports/runs/<run_id>/redaction-check.md` | 失败导致不通过;正文泄漏升级 Step 11 |
| `AC-FUNC-004` | `FR-ID-009~011`;`BR-ID-010~012`;`AC-ID-004`;`AC-ID-009`;`AC-ID-010` | `03` §6.5 `AppendCareerRecord` / `MaintainMemoryReference` / `PrepareTraceHandoff`;§6.7 callback;§8.4 | `TC-ID-CMD-007~012`;`TC-ID-CONSUMER-002~005`;`TC-ID-REDACTION-*` | `EV-ID-CMD-001`;`EV-ID-CONSUMER-001`;`EV-ID-REDACTION-001`;`EV-ID-CORE-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/entry-worker-job.md`;`reports/runs/<run_id>/redaction-check.md` | 失败导致不通过;正文泄漏或改写历史进入 S 级审查 |
| `AC-FUNC-005` | `FR-ID-012~014`;`BR-ID-013~015`;`AC-ID-005` | `03` §6.6 trace/audit/outbox/report queries;§6.7 outbound/job;§8.3;§8.5;§8.6 | `TC-ID-QUERY-007~014`;`TC-ID-OUTBOX-*`;`TC-ID-JOB-*`;`TC-ID-IDEMP-*` | `EV-ID-QUERY-001`;`EV-ID-OUTBOX-001`;`EV-ID-JOB-001`;`EV-ID-IDEMP-001`;`EV-ID-CORE-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/operations-replay-core.md`;`reports/runs/<run_id>/suites/release-main-smoke.md` | 失败导致不通过;job repair truth 升级 Step 11 |

### 8.3 功能验收项停审记录

| 验收项 ID | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `AC-FUNC-001` | 设计来源、TC、EV、report path、失败影响 | 通过 | VETO 细化留 Step 11 |
| `AC-FUNC-002` | 设计来源、TC、EV、report path、失败影响 | 通过 | 状态细节留 Step 8 |
| `AC-FUNC-003` | 设计来源、TC、EV、report path、失败影响 | 通过 | redaction 证据门禁留 Step 10 |
| `AC-FUNC-004` | 设计来源、TC、EV、report path、失败影响 | 通过 | handoff 接口细节留 Step 7 |
| `AC-FUNC-005` | 设计来源、TC、EV、report path、失败影响 | 通过 | job/report-only 细节留 Step 7 / Step 8 |

### 8.4 跨功能门禁裁决审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 功能是否覆盖 `C-ID-1~C-ID-5` | 通过 | 五个 `AC-FUNC-*` 对应五个核心能力节点 |
| 是否覆盖 `FR-ID-001~014` | 通过 | 按 FR 分组全部映射 |
| 是否误用旧 command / query / job 名称 | 通过 | 全部使用新版 `03` 正式名称 |
| 是否引用非正式 EV family | 通过 | 使用 `05` §13 formal `EV-ID-*` |
| 是否把 P1/P2 写成 P0 功能失败 | 通过 | selected-run / production-like 均排除 |
| 是否提前裁决 VETO | 通过 | 只标注影响,Step 11 正式闭合 |

## 9. 对上游 / 下游文档的影响判定

| 结论 | 是否影响上游 / 下游 | 影响类型 | 处理状态 |
|---|---|---|---|
| P0 功能门禁足够进入 Step 6 | 否 | 功能验收范围闭合 | 无需回写 |
| `05` §5 覆盖族与 §13 formal EV 名称存在粒度差异 | 否 | 测试覆盖 vs 正式证据表达差异 | 本 Step 只使用 formal EV |
| 若后续 Step 7/8/10 发现接口、状态或 evidence 缺口 | 是 | 设计 / 测试闭环缺口 | 回写对应 Step 或暂停正式装配 |
| 若功能证据缺 artifact/report pairing | 是 | 证据门禁缺口 | Step 10 阻断 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_05_function_gate.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“功能验收门禁表”“功能验收项闭环表”“功能验收项停审记录”和“跨功能门禁裁决审计表”小节,了解 P0 功能门禁如何从需求、设计和测试证据收敛。

正式 `06-验收标准.md` §5 应回填:

- 功能验收门禁按 `AC-FUNC-001~005` 组织,分别覆盖 identity anchor、lifecycle、role/capability、career/memory 和 consumption traceability。
- 每个功能门禁必须同时给出通过条件、失败条件、需求来源、设计契约、TC family、EV ID、report path 和裁决影响。
- 功能门禁失败通常导致不通过;若触发 ref reuse、implicit create、forbidden body、high-risk accepted without basis、job repair truth 等红线,在 Step 11 进入一票否决裁决。
- P1 selected-run、真实产品深度行为、production-like capacity 和 UI / dashboard 不作为 P0 功能门禁。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| Step 7 是否需要把 `AC-FUNC-*` 拆到每个接口 surface | 影响接口验收粒度 | Step 7 逐接口闭合 |
| Step 8 是否需要按每个 state family 增补状态门禁 | 影响 lifecycle / projection / report-only 细节 | Step 8 闭合 |
| Step 10 是否所有 formal EV 均存在 artifact/report pairing | 影响功能门禁可裁决性 | Step 10 裁决 |
| Step 11 是否将功能失败升级为 VETO | 影响最终结论 | Step 11 正式裁决 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 功能门禁表完成 | 通过 | 见 §8.1 |
| 每个功能门禁有设计 / TC / EV / report path | 通过 | 见 §8.2 |
| 功能验收项已停审 | 通过 | 见 §8.3 |
| 跨功能门禁审计无 unresolved 冲突 | 通过 | 见 §8.4 |
| 未提前替代 Step 6~11 | 通过 | 红线、接口、状态、证据和 VETO 留后续 Step |
| 可进入 Step 6 | 通过 | 用户已确认,进入 Step 6: 定义数据边界与架构红线验收 |
