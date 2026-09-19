# Step 12. 定义缺陷分级、复验与放行规则

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 12  
> 回填章节：`06-验收标准.md` §12 缺陷分级、复验与放行规则

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 12 缺陷分级、复验与放行规则 |
| 当前状态 | `done / pass / self_reviewed` |
| 输入基线 | 正式 05 §9/§11～§14；06 Step 4、10、11 |
| 输出文件 | `design-calibration/06_acceptance_step_12_defects_retest_release.md` |
| 当前缺陷记录 | 0 个可引用实例；缺陷系统、执行 run 与关闭记录均不存在 |
| 下一动作 | 只允许进入 Step 13 |

## 2. 本步计划与事实边界

本步先继承正式 05 的 S/A/B/R 测试管理分类，再把每一级绑定到验收生命周期、三值 verdict、复验集合、fixed-run 证据和放行规则，最后审计七项 VETO、证据完整性与风险接受之间是否冲突。

本步定义的是 future defect/retest contract，不创建 `BUG-*`、不宣告“缺陷为 0”、不执行复验，也不把设计自审 `pass` 写成测试或验收通过。缺实现仓、baseline、run 或 evidence 时，当前状态仍是 `not_entered / blocked_by_missing_baseline`，不是缺陷关闭事实，也不是“不通过” verdict。

## 3. 本步输入

| 输入 | 本步用途 |
|---|---|
| `05-测试方案.md` §9 | Console planned suite、gate、check 与失败姿态 |
| `05-测试方案.md` §11 | S/A/B/R、S 级不可降级项、复验与关闭证据 |
| `05-测试方案.md` §12 | 测试进入、退出、暂停和阻断条件 |
| `05-测试方案.md` §14 | 最小/全量回归、残余风险和不可接受项 |
| Step 4 | `not_entered → entered → decision_pending → decided` 与送验有效性 |
| Step 10 | fixed-run artifact/report/EV、pair/digest 与 handoff 资格 |
| Step 11 | 恰好七项 VETO；任一命中总体不通过且不可风险接受 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| S/A/B 缺陷如何定义？ | S 是 VETO、P0 safety/truth、访问、redaction、依赖、配置 fail-closed 或证据真实性红线破坏；A 是未命中 S 但使适用 P0 flow/blocking gate 或主要交付证明不能成立的问题；B 是不破坏 P0 的非阻断功能、selected 或报告可读性问题；沿用 05 的 R 表示范围外、future 或等待 authority 的 residual，不冒充已执行缺陷。 |
| 每级对结论有什么影响？ | 未关闭 S 只能阻断进入或导致“不通过”；未关闭 A 原则上不得“通过”，只有独立合格证据已证明全部适用 P0 且该 A 不触碰硬门禁、并被逐项接受时才可能“有条件通过”；B/R 不计入 P0 passed，只有记录完整并逐项接受时才可随“有条件通过”放行。 |
| 修复后如何复验？ | 必须使用新 run，保留失败 run；至少复跑原 TC、同 family 正/负/边界代表、受影响 suite、邻接 redaction/dependency/pairing/no-static-evidence check；协议、状态、配置、证据 schema 或任一 S 修复触发全量 P0。 |
| 哪些缺陷可以风险接受？ | S/VETO 永不允许；A 仅允许接受“P0 已由其他合格证据完整证明且问题不影响 truth/safety/evidence”的有限情形；B/R 可作为候选，但必须有 owner、acceptor、理由、证据、动作和 deadline/trigger。 |
| 哪些缺陷必须阻断下一阶段？ | 任一开放 S/VETO；任一未接受 A；适用 P0 gate failed/blocked；redaction/dependency/pairing/no-static-evidence 失败；缺 fixed-run P0 artifact/report/EV；伪 signoff；或风险接受字段不完整。 |

## 5. 当前文档问题诊断

| 旧问题 | 本步处理 |
|---|---|
| 旧 06 的缺陷规则未与新版 96 TC、suite 和 EV 闭环 | 以正式 05 当前 family/suite/check 重建复验矩阵 |
| “无记录”容易被写成“缺陷为 0” | 明确当前是无可引用 defect register，不是零缺陷证明 |
| A 级可接受条件过宽 | 限定为全部适用 P0 已被独立合格证据证明且不触碰硬门禁 |
| selected/blocked/future 容易混为缺陷 | 分开 execution blocker、B 与 R；均不得贡献 positive pass |
| 原 run 可被修订成 passed | 强制新 run、保留失败材料和失败→修复关联 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| 分级 | 泛化 S/A/B | Console S/A/B/R 与 P0/VETO/selected/residual 绑定 |
| 复验 | “修复后重测” | 原 TC + same family + suite/check + 新 run + closing evidence |
| 放行 | 人工判断 | 生命周期、verdict、risk acceptance 与 signoff 四层判定 |
| 缺记录 | 可被误读为 0 | 明确 `not_available / not_evaluated` |
| 失败历史 | 可覆盖 | failed run 不可变，fixed run 另建并关联 |

## 7. 验收裁决取舍

| 议题 | 裁决 |
|---|---|
| 是否把 baseline/runner 不存在登记成当前 S | 否；当前尚未进入验收，应保持 `blocked_by_missing_baseline`，不得伪造 defect instance |
| A 是否可批量接受 | 否；只能逐项审查，且不能覆盖适用 P0 gate、VETO、S 或 evidence integrity |
| R 是否等同已知产品缺陷 | 否；R 是 residual/future/open-authority 记录，可在触发升级后形成 B/A/S |
| 一次修复可否删除旧失败 run | 否；必须保留旧 run，并由新 fixed run 的 evidence 显式关联 |
| rerun 通过是否自动关闭与放行 | 否；还需 defect review、影响面复核、evidence qualification、risk 状态与验收裁决 |

## 8. 结构化中间产物

### 8.1 缺陷分级表

| 级别 | 定义 | 对验收结论的影响 | 复验与关闭要求 |
|---|---|---|---|
| S | 命中 `VETO-CON-001～007`；破坏 P0 truth/access/phase/body/inference/a11y/isolation；或 redaction、dependency、strict config、evidence integrity 失守 | 未进入时阻断准入；进入后只能“不通过”；不可风险接受 | 新 run 复跑原 TC、同 family、全部受影响 suite/check 和全量 P0；保留失败 run；完整关闭证据与 reviewer 结论 |
| A | 未命中 S，但适用 P0 flow、blocking suite、主要交付语义或其稳定证明失败 | 原则上不得“通过”；未接受时阻断；仅在全部适用 P0 已由独立合格证据证明且不触碰硬门禁时，才可逐项支持“有条件通过” | 原 TC、同 family、相关 suite/check/report audit；若接受则必须有 qualified alternative evidence、owner、acceptor、deadline/trigger |
| B | 不破坏 P0 的非阻断功能、selected matrix、可读性或维护性问题 | 不贡献 P0 pass；未记录/未接受时不得宣告无风险；可逐项支持“有条件通过” | 按影响复跑 selected/affected suite 或补 report review；记录 follow-up 与触发条件 |
| R | 范围外、future、等待 authority/合同/环境的 residual；不表示已执行失败 | 不影响已定义 P0 safety 判定，但不能被计为 positive capability/readiness；进入 release scope 后必须重新定级 | 固定 blocker/authority/owner/trigger；升级为 in-scope 后重新基线并执行对应 TC/suite |

### 8.2 S 级与强制阻断判定

| 触发 | 分类 | 强制处理 |
|---|---|---|
| 任一 `VETO-CON-001～007` 命中 | S | 总体“不通过”；修复并全量 P0；不可接受 |
| DB/private API/private bus/sibling source/BFF、第二 truth、Query write 或额外 owner write | S | 修复 dependency/call graph；architecture + dependency + full P0 |
| 无效/过期/冲突 context、visibility、qualification 仍披露、导航或 submit | S | access/security/minimum-disclosure + full P0 |
| receipt/toast/cache/diagnostic 推导 confirmed/active/ready，或 `unknown` 自动 replay | S | intent/state/consistency + full P0 |
| secret、credential、forbidden body、stack、free text/full ref 进入对象、state、diagnostic、artifact/report | S | whole reject、no echo、redaction scan + full P0 |
| partial/failed owner 被合成 normal/verdict/readiness 或失败扩散/被 sibling success 掩盖 | S | composition/recovery/security + full P0 |
| 核心 C1～C6 语义路径无法等价操作/恢复 | S | semantic-a11y + affected flow + full P0 |
| invalid config silent fallback、profile 越界或 partial protected runtime | S | config-redline/release-config + full P0 |
| static EV/VETO pass、run mismatch、orphan、缺 pair/digest、删除失败记录或伪 signoff | S / 送验无效 | 修复 evidence chain；source suites + pairing/no-static/report audit + full P0 |

### 8.3 修复后复验矩阵

| 缺陷面 | 原 TC / same family | 必跑 suite | 邻接 check / closing evidence |
|---|---|---|---|
| context/access/navigation | `TC-CTX-*`、`TC-NAV-*`、相关 `TC-SEC-*` | `console-pure-contract`、`console-module-flow`、`console-semantic-a11y` | redaction；fixed-run UNIT/FLOW/SECURITY/ACCESSIBILITY EV |
| views / 16 Query / no-write | `TC-VIEW-*`、相关 `TC-ADAPTER-*`、`TC-ARCH-*` | module-flow、port-adapter、architecture-static | redaction + dependency；FLOW/CONTRACT/SECURITY/ARCH EV |
| 5 Command / result / reconcile | `TC-INTENT-*`、`TC-CONSISTENCY-004～007` | module-flow、port-adapter、concurrency-race、release-safety-smoke | pairing + no-static；FLOW/CONTRACT/INTEGRATION EV |
| topics / partition / activation | `TC-TOPIC-*`、`TC-RECOVERY-*`、相关 `TC-SEC-*` | controlled-composition、recovery-matrix、release-safety-smoke | redaction/pairing；FLOW/INTEGRATION/SECURITY EV |
| state / carrier / consistency | `TC-STATE-*`、`TC-CONSISTENCY-*` | pure-contract、concurrency-race、controlled-composition | report audit；UNIT/FLOW/CONTRACT/INTEGRATION EV |
| recovery / a11y | `TC-RECOVERY-*`、`TC-A11Y-*` | recovery-matrix、semantic-a11y、module-flow | redaction；FLOW/INTEGRATION/ACCESSIBILITY EV |
| config / binding | `TC-CONFIG-*`、`TC-ADAPTER-004/005` | config-redline、architecture-static、release-config-redline | dependency/redaction/report audit；CONTRACT/SECURITY/RELEASE EV |
| diagnostic / forbidden material | `TC-DIAG-*`、`TC-SEC-002/003` | redaction-boundary、release-redaction、affected source suite | redaction + pairing + no-static；SECURITY/RELEASE EV |
| module / protocol / dependency graph | `TC-ARCH-*`、受影响协议 family | architecture-static、port-adapter、release-dependency | generated graph/call ledger + pairing；ARCH/RELEASE EV |
| gate / report / EV tooling | 受影响正式 TC + representative source TC | report-pairing-audit、release-report-audit、全部受影响 source suites | pairing + no-static + digest review；RELEASE 与受影响 EV |

任一 S、协议 inventory、状态/phase、四项配置、redaction/dependency/evidence schema 或 release blocking topology 变化，都必须执行正式 05 §14.2 的全量 P0 集合。Conditional positive 只有在新 baseline 声明 enabled 后才进入必跑范围；disabled/blocked 不能因复验被伪装为 positive pass。

### 8.4 Future 缺陷关闭证据

| 关闭字段 / 材料 | S | A | B/R |
|---|---|---|---|
| `defect_ref`、级别、发现 run、原 TC/suite、影响面 | 必需 | 必需 | 必需 |
| failed `run_id` 与不可变 artifact/report refs/digests | 必需 | 必需 | 有执行时必需 |
| 修复 delivery ref、设计/测试回写 ref | 必需 | 必需 | 变更相关时必需 |
| 新 fixed `run_id`、原 TC/same-family/suite/check 结果 | 必需 | 必需 | 按影响必需 |
| source EV 与 evidence-index/pairing/redaction refs | 必需 | 必需 | 有执行时必需 |
| 防回归断言或不新增的审查理由 | 必需 | 必需 | 可选 |
| defect owner、reviewer、关闭结论与日期 | 必需 | 必需 | 必需 |
| risk acceptance | 禁止 | 仅严格条件下逐项 | 放行时必需 |

关闭记录只能引用 `artifacts/test/<run_id>/`、`reports/runs/<run_id>/` 和 `reports/acceptance/` 的固定入口；禁止 `latest`。failed/blocked run 必须保留，fixed run 不能改写历史 status。无真实 defect、delivery、run、pair/digest 和 review 时，状态只能是 `not_available / not_evaluated`，不能写 `closed/passed`。

### 8.5 放行规则

| 条件 | 生命周期 / verdict | 是否允许下一阶段 | 说明 |
|---|---|---|---|
| baseline/runner/environment/evidence 未固定 | `not_entered`，无 verdict | 否 | 当前实际状态 |
| 任一 VETO 或开放 S | entered 后“不通过” | 否 | 不可风险接受 |
| 适用 P0 failed/blocked 或 P0 evidence 不合格 | entered 后“不通过”或暂停补证 | 否 | blocked 不能计 passed |
| 开放 A 且无严格接受 | `decision_pending` 或“不通过” | 否 | 先修复/复验或逐项审查 |
| A 已严格接受，且全部适用 P0 独立证明通过 | 可候选“有条件通过” | 有条件 | 不得触碰 VETO/S/truth/safety/evidence integrity |
| 仅 B/R，逐项风险记录完整且被接受 | 可候选“有条件通过” | 有条件 | 不代表对应 positive/future/readiness 已完成 |
| 所有适用 P0 通过、VETO 未命中、S/A=0、证据/签署完整 | 可候选“通过” | 是 | 仍由 Step 14 正式裁决，不由 suite 自动生成 |
| rerun 通过但 defect review/risk/signoff 未完成 | `decision_pending` | 否 | rerun 不自动放行 |

### 8.6 缺陷与复验停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| S/A/B/R 是否与正式 05 一致 | pass | R 保持 residual，不冒充 defect result |
| 七项 VETO 是否全部映射 S | pass | 7/7；不可接受 |
| Console TC/suite/check 是否可执行追溯 | pass | 未迁入 Governance 服务端 suite/UoW/job 模型 |
| failed→fixed 是否新 run 且保留历史 | pass | fixed path/digest/review 必需 |
| A/B/R 接受是否可能覆盖硬门禁 | no | 由 §8.1、§8.5 与 Step 13 双重约束 |
| 当前是否伪造缺陷/关闭/放行 | no | instance=0；实际仍 `not_entered` |

## 9. 回填草稿

正式 §12 应回填 S/A/B/R 分级、S 级强制阻断、Console 专属复验矩阵、fixed-run 关闭证据和放行矩阵。正文必须明确：当前无可引用缺陷记录不等于 S/A/B 为 0；rerun passed 不自动关闭或放行；S/VETO 不可风险接受；A 只有在适用 P0 已由独立合格证据证明且不触碰硬门禁时才可逐项接受。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| future defect tracker 与 exact schema | 执行记录互操作 | 07/实施前固定；06 只要求 `defect_ref` 可回指 |
| 实际 defect owner/reviewer | 缺陷关闭 | 送验时填写，不造姓名 |
| A 级接受人 | 有条件通过 | Step 13/14 固定角色与逐项签署条件 |
| 某 selected facet 是否升级为 release required | 分级与必跑范围 | 由 Step 3 baseline authority 固定；变更则重新基线 |

## 11. 下一步门禁

| 条件 | 结果 |
|---|---|
| 缺陷等级与 verdict 影响可判定 | pass |
| VETO/S 不可风险接受 | pass |
| 复验和关闭证据可定位 | pass |
| 放行规则与生命周期一致 | pass |
| 允许进入 Step 13 | yes |
| 当前 defect/retest/release result | none / not_evaluated |
| 允许修改正式 06 | no |
