# L3-capability-hub 06 验收标准 Step 4: 定义进入条件与退出条件

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 4
> 书写规范: `standards/document/验收标准书写规范.md` §5.4
> 回填章节: `06-验收标准.md` §4
> Step 状态: `completed-designed / continuous execution`
> 日期: 2026-07-26

## 1. Step 状态、目标与边界

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 4 定义进入条件与退出条件 |
| 输入 | Step 3 immutable baseline；formal `05` §§11~14；Step 2 scope |
| 输出 | entry checklist、exit checklist、pause/invalidation matrix、scope-specific exit rules |
| 当前状态 | `completed-designed`; 未执行验收，未形成任何真实结论 |
| 正式文档 | 正式 `06-验收标准.md` 不在本 Step 修改，Step 15 才整体装配 |
| 下一步 | Step 5 定义功能验收门禁 |

本 Step 规定“何时有资格开始验收”和“何时可以结束某一层验收”。它不执行 test、review 或 signoff，也不把设计期 `pass-designed` 解释成产品通过。

## 2. 本步输入

| 输入 | 权威内容 | 不得推断 |
|---|---|---|
| `06_acceptance_step_03_baseline.md` | source/delivery/config/environment/data/evidence baseline fields、fixed roots、new-run rules | 真实值已填写 |
| `05-测试方案.md` §11 | observation class、S/A/B、13 VF、retest and non-waiver | 实际 defect count |
| `05-测试方案.md` §12 | future P0/selected/release entry and exit denominator | execution complete |
| `05-测试方案.md` §13 | raw/report/evidence instance predicate and review status | alias or report exists |
| `05-测试方案.md` §14 | R0~R4 regression、16 risks、never-acceptable findings | residual accepted |
| Step 2 scope | P0 semantic、P1 selected、R4 release、P2 operations | production readiness |

## 3. SOP 问题回答

| 问题 | L3-capability-hub 答案 |
|---|---|
| 开始验收前哪些基线必须确认？ | active `00`~`05` source refs、implementation/build/image、core-contracts ref、profile/entry/config digest、fixture/replay root、explicit run ID、raw/report roots、scope manifest和review入口全部固定。 |
| 哪些证据必须先生成？ | P0 blocking suites、189 case/data/evidence对应的同 run raw/report链、638 pair registry、9 checks、gate summary、evidence index、redaction/dependency/report audit、acceptance handoff和VETO checklist；未生成不等于失败，但等于不能进入。 |
| 哪些缺陷阻断进入？ | 未归零的 confirmed S、影响当前 P0 的 A、设计 blocker、P0 prerequisite、invalid artifact、缺失 pairing、redaction/ownership/dependency/report audit failure、P0 profile unavailable 或 baseline drift 未回归。 |
| 退出需要哪些结论？ | P0 每个适用 AC 有可判定结论、13 VF 均有真实 negative evidence、189/189/189 和 638/638 分母完整、blocking checks通过、S/P0-A为零、证据链可复验、open issue/residual分类清楚。 |
| 哪些风险必须先接受？ | 本设计阶段没有 accepted risk。未来只有不影响 P0 truth/evidence/VF 的 eligible B 或明确 P1/P2 residual可进入 Step 13；S、VF、current P0 A、证据完整性和责任红线不可接受。 |

## 4. 历史正式 06 诊断

| 旧规则 | 当前问题 | 处理 |
|---|---|---|
| 只要求旧 `02/03/05` 和基础数据 | 无法证明完整 source、config、run和evidence provenance | 由 Step 3 baseline 全量替代 |
| “测试通过后即可验收” | test exit 与 acceptance verdict 不是同一层 | 增加 AC/VF/evidence/review/defect gate |
| P1 staging-like 缺失即整体失败或整体忽略 | 混淆 P0 semantic 与 selected/release claim | 按 scope manifest 分层裁决 |
| 空白 acceptance report | 可能被当作默认通过 | empty/draft 只能是 not_decided |
| S/A/B 模糊 waiver | 会覆盖 P0 A 或 VF | S、VF和current P0 A固定不可风险接受 |

## 5. 验收进入条件

### 5.1 Immutable source and delivery gate

正式验收启动前，以下条件全部必须由未来真实 manifest/报告满足：

- [ ] `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md` 的 source refs 已冻结。
- [ ] implementation source revision、build ID、适用时 image/package digest 已冻结。
- [ ] `L0-core`/core-contracts source ref 或 package version 已冻结，且 dependency-boundary check 可追溯。
- [ ] 本次 acceptance scope manifest 明确选择 `SCOPE-CH-P0-SEMANTIC`、`SCOPE-CH-P1-SELECTED`、`SCOPE-CH-R4-RELEASE` 哪些层；未选择层不能被隐含声称。
- [ ] profile、entry、config artifact、config digest、fixture/replay root、environment ID和dependency kind已冻结。
- [ ] 基线冻结后没有未经回归授权的 P0 设计、实现、配置、test manifest或report schema变化。

### 5.2 Run and evidence readiness gate

- [ ] `run_id` 是唯一显式值，且不为 `latest`，没有预存 raw/report output。
- [ ] raw root 精确为 `artifacts/test/<run_id>/`，包含 run manifest、case/suite/check raw、attempt history、artifact digest和失败留证。
- [ ] report root 精确为 `reports/runs/<run_id>/`，包含 summary、gate summary、suite reports、evidence index、redaction、dependency和report-generation audit。
- [ ] 189 个 canonical TC、189 个 DS、189 个 EV contract 的 primary identity manifest已冻结；EV contract尚不是 instance。
- [ ] 638 个 state pair identity（`239 current + 98 reserved + 301 illegal`）registry已冻结，未采样、未推断、无重复或未分类项。
- [ ] 所有适用 P0 suite/check 具有 raw-derived结果或明确的 non-pass/unavailable raw，不允许缺 cell 后手工补表。
- [ ] `reports/acceptance/handoff.md`、`veto-checklist.md`、`open-issues.md` 已生成并引用同一 run/baseline；只有存在 eligible residual 时才要求 `risk-acceptance.md`。

### 5.3 Defect and redline readiness gate

- [ ] confirmed S = 0。
- [ ] 当前 P0 影响范围内的 A = 0；P0 A不能以“负责人接受”代替修复和复验。
- [ ] `VF-CH-001..013` 没有未复验修复或未解释的 negative evidence gap。
- [ ] `redaction-check`、`dependency-boundary`、`report-generation-audit`没有阻断 finding。
- [ ] P0 profile 没有把 `blocked_dependency`、`invalid_artifact`、`not_run` 或 unexpected unavailable提升为 passed。
- [ ] 所有基线变更都遵守 Step 3 的新 run 规则，旧 run 不被覆盖。

## 6. 分层进入规则

| Scope | 进入附加条件 | 不可用处理 | 是否影响其他层 |
|---|---|---|---|
| P0 semantic | 189 TC/DS/EV manifest、638 registry、P0 profiles、main suites/checks和同 run roots齐备 | `blocked_dependency`/missing为不能进入或不能退出 | 不得由P1替代 |
| P1 selected | immutable selected product/config/TLS/material manifest、选定 adapter/source/route/observer和cleanup proof | selected claim blocked；不改写P0 | 不自动影响P0 |
| R4 release | complete P0 main、release-required selected refs、release smoke、9 checks、review/handoff | release handoff blocked | 不产生 acceptance pass |
| P2 operations | 后续正式 operations baseline、numeric target、capacity/retention/production evidence | `not_claimed` | 不影响当前P0/R4 |

`not_applicable_by_manifest` 只有在 scope manifest 明确证明该项不适用时才可使用；缺产品、缺环境、缺证据不能自动转换成该状态。

## 7. 验收退出条件

### 7.1 P0 semantic exit

- [ ] 37 个 AC 均有唯一 primary acceptance owner，适用性有 manifest依据，结论只能来自真实 evidence bundle。
- [ ] `AC-CH-001..037` 的每个结论都能回指正式 design source、TC/DS/EV、same-run raw/report和裁决影响。
- [ ] `VF-CH-001..013` 均有 non-empty negative evidence direction，且没有 veto finding；任何 veto evidence缺失仍为阻断。
- [ ] 189/189 canonical TC、189/189 DS、189/189 EV instance contracts在适用 P0 分母中完成同 run pairing。
- [ ] 638/638 state pairs完整执行并按 `239/98/301` 分类，sampling、missing、duplicate和unclassified均为0。
- [ ] 10 个 primary suites和所有 main-applicable checks为 raw-derived passed；任何 worst status 为 non-pass均阻断。
- [ ] typed terminal、zero-effect、Query no-write、Job no-truth-repair、config fail-closed、Rustdoc和redaction/ownership/dependency gates均有证据。
- [ ] open S、current P0 A、design blocker、P0 prerequisite、invalid artifact均为0。
- [ ] numeric performance/capacity字段可记录，但无 active threshold时结论保持 `not_evaluated`，不伪造 pass/fail。

### 7.2 Selected and release exit

| 层 | 完成条件 | 缺口结论 |
|---|---|---|
| P1 selected | selected manifest声明的 durable/external/source/route/TLS/observer subset、typed unavailable、cleanup和distinct run/report均闭合 | `blocked` 或 `not_claimed`，不影响有效P0 semantic result |
| R4 release | P0 main完整、release-required selected refs完整、release smoke、9 checks、report/evidence/review handoff完整 | `release_not_eligible`；不能签署 acceptance |
| P2 operations | 后续正式标准和真实生产/容量/retention evidence完整 | 当前不作 claim |

## 8. 暂停、阻断与不可裁决矩阵

| 触发条件 | 状态 | 处理 |
|---|---|---|
| source/delivery/config/run baseline未冻结 | `not_entered` | 不启动正式 acceptance；补齐 immutable manifest |
| `run_id`缺失、为 `latest` 或跨 run 拼接 | `invalid_artifact` | 保留材料；新 run；旧材料不能支撑结论 |
| raw/report路径错误或digest pairing缺失 | `invalid_artifact` | 阻断 affected scope，重建 report或重跑 |
| suite/check/evidence cell缺失 | `incomplete` | 不可裁决；不得用aggregate count补齐 |
| expected typed unavailable与P0 prerequisite缺失混淆 | `blocked_dependency` | 保留 exact reason；不能标为pass |
| redaction/dependency/report audit失败 | `failed`/`blocked` | 修复工具或实现，按 Step 12复验 |
| confirmed S、VF或current P0 A存在 | `failed` | 不可风险接受；修复并重新跑受影响及扩散范围 |
| baseline drift未按Step 3触发回归 | `paused` | 旧run转historical diagnostic；新 baseline/new run |
| design source无法绑定正式字段/状态/flow | `design_blocker` | 回开精确owner Step；受影响acceptance不进入 |
| P1 selected unavailable但P0合同完整 | `selected_blocked` | P0可继续独立裁决；selected/R4按manifest阻断 |
| 所有条件满足但review未完成 | `not_decided` | 不产生通过/有条件通过 |

## 9. 结论状态语义

| 状态 | 含义 | 是否可作为验收结论 |
|---|---|---|
| `not_entered` | entry prerequisites尚未齐备 | 否 |
| `not_evaluated` | 设计或运行尚未对该criterion形成结果（包括无numeric threshold） | 否 |
| `blocked_dependency` | prerequisite/environment/product/manifest缺失 | 否 |
| `invalid_artifact` | provenance/schema/path/digest/static evidence无效 | 否 |
| `passed` | 仅表示该具体 case/gate的真实证据满足oracle，不自动等于acceptance verdict | 需汇总 |
| `failed` | 真实证据违反criterion或阻断门禁 | 是，影响不通过/阻断 |
| `not_applicable_by_manifest` | closed scope manifest证明不适用 | 需理由和审查 |
| `not_decided` | evidence/review/authorization尚未形成裁决 | 否 |

## 10. 回填草稿

正式 `06-验收标准.md` §4 只应保留：

1. immutable source/delivery/config/data/run/evidence entry checklist；
2. P0 semantic、P1 selected、R4 release、P2 operations分层 entry/exit；
3. 189/189/189、638/638、10 suites、9 checks的完整分母要求；
4. S、VF、P0 A、invalid artifact、redaction/dependency/report audit和baseline drift的暂停/阻断规则；
5. `not_evaluated`、`blocked_dependency`、`invalid_artifact`、`not_decided`不能被解释为通过；
6. P1 unavailable不补偿P0，release-required selected缺失阻断R4。

## 11. 待确认事项

| 事项 | 当前处理 |
|---|---|
| `agent-review.md` 是否每次验收必填 | Step 10/14根据最终 review schema 收口；当前至少有一种 review notes入口 |
| 某个 release 是否声明 selected product 为必需 | 由不可变 R4 manifest决定，未声明时不自动扩大P0 |
| 无 residual 时是否创建空 risk report | 空模板不能产生结论；Step 13规定是否生成以及如何标记 not_applicable |

## 12. Step 5 进入门禁

| 条件 | 结果 |
|---|---|
| entry prerequisites按 source、delivery、config、data、run、evidence分组 | `pass-designed` |
| P0/selected/release/P2 exit边界不互相补偿 | `pass-designed` |
| 13 VF、S、current P0 A和evidence integrity均有不可接受处理 | `pass-designed` |
| invalid/incomplete/blocked/not-evaluated状态不被解释为pass | `pass-designed` |
| pause/invalidation和new-run规则可执行 | `pass-designed` |
| 未创建真实执行、defect、review、verdict或signoff | `pass-designed` |
| unresolved upstream blocker | `0` |
| 下一步 | `enter_06_step_05_function_gate` |
