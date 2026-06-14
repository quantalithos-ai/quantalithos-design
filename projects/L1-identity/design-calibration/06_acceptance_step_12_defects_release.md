# Step 12. 定义缺陷分级、复验与放行规则

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 12
> 回填章节: `06-验收标准.md` §12 缺陷分级、复验与放行规则

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 12 定义缺陷分级、复验与放行规则 |
| 当前状态 | 已审核通过 |
| 输入基线 | Step 1~11 已审核通过;新版 `05` 缺陷管理与复验规则;Step 10 evidence gate;Step 11 VETO |
| 输出文件 | `projects/L1-identity/design-calibration/06_acceptance_step_12_defects_release.md` |
| 正式文档状态 | 本 Step 不修改正式 `06-验收标准.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 13 |

## 2. 本步目标

定义缺陷如何影响 L1-identity 验收结论、修复后如何复验、哪些情况可以或不可以放行到下一阶段。

本 Step 只定义:

- S / A / B 缺陷分级和 R 类 residual 输入的边界。
- 每级缺陷对“通过 / 有条件通过 / 不通过”的影响。
- 修复后的最小复验 suite / check / evidence 要求。
- 当前阶段的放行规则:什么必须阻断,什么可进入 Step 13 风险接受,什么可以作为非阻断遗留。

本 Step 不实际接受风险,不指定接受人,不签署最终结论,不安排修复排期,不新增测试用例 / EV / report schema。风险接受结构留 Step 13,最终签署留 Step 14。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_10_evidence_audit.md` | 已审核通过 | 提供 evidence integrity、report audit、redaction/dependency failure 的阻断规则 |
| `06_acceptance_step_11_blockers.md` | 已审核通过 | 提供 `VETO-ID-001~006` 和不可风险接受规则 |
| `05-测试方案.md` §11 / §12 | 正式输入 | 提供 S/A/B/R 分级、复验矩阵、进入 / 退出准则 |
| `05_test_plan_step_11_defects_retest.md` | 已审核通过 | 提供缺陷分级、S 级阻断、复验矩阵、风险接受和自动化防回归规则 |
| `05_test_plan_step_12_entry_exit.md` / `05` §12 | 已审核通过 | 提供 P0 退出、暂停 / 阻断和 selected-run residual 口径 |
| 验收 SOP Step 12 / 书写规范 §5.12 | 当前标准 | 提供正式 `06` 的 S/A/B 表结构和结论影响要求 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| S/A/B 缺陷如何定义? | S 是一票否决、P0 truth 破坏、安全 / redaction / dependency / evidence integrity / config / query no-write / job no-repair / stored replay 红线;A 是未命中 VETO 但影响 P0 主线、blocking suite 稳定性或证据可信度的主线风险;B 是非 P0、P1/P2 selected-run、报告可读性或非阻断维护性问题。R 作为 residual 输入进入 Step 13,不作为正式缺陷级别主表。 |
| 每级缺陷对验收结论有什么影响? | 任一未关闭 S 导致不通过;未接受的 A 通常导致不通过,经明确风险接受后才可能有条件通过;B 可进入 Step 13 风险接受或遗留跟踪,不影响 P0 通过;R 只能支撑范围外或 future residual,不得伪装为已验证。 |
| 修复后如何复验? | 至少复验原失败 TC、同 family TC、相关 P0 suite / check 和受影响 evidence/report;安全、dependency、report integrity、query no-write、job no-repair、idempotency、config、fake parity 缺陷必须复跑对应专项 check。 |
| 哪些缺陷可以风险接受? | 仅 A/B/R 中已证明不影响 P0 truth、VETO、redaction、dependency、config fail-fast、query no-write、job no-repair、stored replay 和 evidence integrity 的项可进入 Step 13。 |
| 哪些缺陷必须阻断下一阶段? | 未关闭 S、任一 VETO、P0 blocking suite 失败且不能证明为测试工具缺陷、redaction / dependency / report-audit fail、P0 evidence 缺失、query/job truth write、duplicate rerun mutation、invalid config silent fallback 均必须阻断。 |
| 缺陷规则是否与一票否决项一致? | 是。`VETO-ID-001~006` 全部映射 S 级,不得风险接受。非 VETO 但阻断项按 Step 10 evidence gate 和 Step 12 S 级处理。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 书写规范 §5.12 | 正式验收主表只要求 S/A/B | 本 Step 主表使用 S/A/B,R 作为 residual 输入说明 |
| `05` §11 | 测试方案有 S/A/B/R | 本 Step 转成验收结论影响和放行规则 |
| Step 11 | VETO 已固定,但非 VETO 阻断项待分级 | 本 Step 把 evidence integrity、query write、job repair、duplicate rerun、config fail-fast 等纳入 S |
| Step 10 | `risk-acceptance.md` 只是支撑材料 | 本 Step 只判定哪些项可进入风险接受,不实际接受 |
| 性能 sample | 无硬 P95 / SLA | 缺 sample 是阻断;数值未达无来源目标进入 residual |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 缺陷级别 | 测试方案有 S/A/B/R | 验收主表收成 S/A/B,R 留 residual | 对齐验收书写规范 |
| VETO 处理 | Step 11 只裁决不通过 | Step 12 固定 VETO 均为 S,不得放行 | 支撑缺陷闭环 |
| 复验规则 | 测试方案按触发面定义 | 验收按缺陷触发面绑定 suite/check/evidence | 可执行裁决 |
| 放行 | 旧草案可能泛写“修复后通过” | 明确 S 阻断、A 需接受、B 可遗留、R 进风险 | 支撑 Step 13/14 |
| 自动化防回归 | 测试方案已有触发 | 验收要求 P0 漏检必须补自动化或阻断 | 防止手工关闭 |

## 7. 验收裁决取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否把 R 作为正式缺陷级别 | A. 是;B. 主表只写 S/A/B,R 作为 residual 输入 | 采用 B。符合验收书写规范。 |
| A 级是否允许有条件通过 | A. 一律不允许;B. 允许,但必须证明不影响 P0 且进入 Step 13 | 采用 B。保留有条件通过机制。 |
| P0 blocking suite failure 是否一定 S | A. 一律 S;B. 默认 S,若证明是测试工具缺陷且 P0 语义另有 artifact 可降为 A | 采用 B。与 `05` 一致。 |
| 性能 sample 数值偏高是否阻断 | A. 阻断;B. 无正式阈值时不阻断,缺 sample 才阻断 | 采用 B。阈值必须有来源。 |
| 修复后是否只跑失败 case | A. 是;B. 必须跑同 family / suite / check | 采用 B。防止局部修复掩盖共享缺陷。 |

## 8. 结构化中间产物

### 8.1 缺陷分级表

| 缺陷级别 | 定义 | 对结论的影响 | 复验要求 |
|---|---|---|---|
| S | 一票否决、P0 truth 破坏、安全 / redaction / dependency / evidence integrity、query no-write、job no-repair、stored replay、config fail-fast、fake parity 红线 | 任一未关闭 S 导致总体不通过;不得风险接受;不得进入下一阶段 | 修复后必须复跑原 TC、同 family TC、相关 P0 suite / check、redaction/dependency/report audit,并更新 closing evidence |
| A | P0 主线风险但未命中 VETO / S,或 blocking suite 因实现 / 测试工具缺陷无法稳定证明但 P0 语义未破坏 | 未关闭且未接受的 A 通常导致不通过;经 Step 13 明确风险接受后可有条件通过 | 修复后复跑原 TC、相关 family、受影响 suite/check;若临时接受,必须有替代 evidence 和后续复验动作 |
| B | 非 P0、P1/P2 selected-run、报告可读性、非阻断维护性或文档清晰度问题 | 不阻断 P0 通过;若影响交接清晰度,只能支撑有条件通过 | 按影响范围抽样复验或在后续计划跟踪;不得影响 P0 EV / VETO / redaction / dependency |

### 8.2 R 类 residual 输入表

| Residual 类型 | 含义 | Step 13 处理 |
|---|---|---|
| P1/P2 selected-run unavailable | 真实产品、real-like adapter、future integration 当前未执行或不可用 | 可风险接受,但必须标明不计 P0 pass |
| production-like capacity / hard SLO | 当前无正式负载模型或部署基线 | 记录后续容量基线动作 |
| 真实 HR / IdP / observability backend 行为 | 当前不属于 P0 闭环 | 记录 future owner 和触发条件 |
| 旧性能候选数字未达但 sample 存在 | 无正式阈值来源 | 记录 trend / review action,不得判 S/A |
| 文档或报告可读性非阻断问题 | raw artifact / EV / gate 均完整 | 可作为 B 或 residual 跟踪 |

### 8.3 S 级阻断判定表

| 触发条件 | 来源 | 放行影响 |
|---|---|---|
| 任一 `VETO-ID-001~006` 命中 | Step 11 | 不通过;不得风险接受 |
| P0 evidence index 缺 EV / TC / AC / VETO 回指 | Step 10 `AC-EV-005` | 不通过或送验不成立 |
| raw artifact / report pairing 缺失、static evidence pass、failed artifact 被删除 | Step 10 `AC-EV-009`;`EV-ID-REPORT-001` | 不通过 |
| redaction check 发现 forbidden body / secret / full sensitive ref | `VETO-ID-003`;Step 9/10 | 不通过 |
| dependency boundary check 发现 forbidden compile dependency / truth mixing | `VETO-ID-006`;Step 9/10 | 不通过 |
| query 隐式创建 truth 或写入业务 side effect | `VETO-ID-002`;Step 6/8/10 | 不通过 |
| consumer/callback/job missing target 隐式创建 identity truth | `VETO-ID-002`;Step 6/7 | 不通过 |
| reconciliation / maintenance 修相邻仓 truth | `VETO-ID-005` | 不通过 |
| job 修 identity business truth | Step 6/8 job no-repair | 不通过;S 级但不新增 VETO |
| duplicate replay 重跑 mutation/job 或重构 stored result/receipt/report | Step 8/9 idempotency | 不通过 |
| high-risk lifecycle 缺 basis 仍 accepted | `VETO-ID-004` | 不通过 |
| invalid config silent fallback、redline disabled、disabled adapter fake success | Step 9 `AC-NFR-010/012` | 不通过 |
| accepted command / consumer / job flow 缺正式 required stored replay / receipt / report surface | Step 8/10 | 不通过 |

### 8.4 A / B 缺陷判定表

| 等级 | 典型触发 | 放行影响 | 必备条件 |
|---|---|---|---|
| A | P0 suite flaky、非关键 report item 缺字段、operations count 偏差、fake fault profile 不稳定、public error wording 漂移但未破坏 P0 truth | 默认阻断;可在 Step 13 风险接受后有条件通过 | 不命中 S/VETO;有替代 evidence;有接受人;有修复/复验计划 |
| A | 测试脚本自身缺陷导致 blocking suite fail,但 raw artifact 和其他 suite 证明 P0 语义成立 | 可有条件通过 | 必须修脚本或记录复验 run;不得掩盖真正 P0 failure |
| B | P1 selected-run unavailable、report 文案不清、非 P0 fixture 命名问题、非阻断维护性问题 | 不阻断;可进入 Step 13 | 不影响 P0 EV / VETO / redaction / dependency / evidence integrity |
| B | performance sample 存在但指标偏高且无正式阈值 | 不阻断 | 记录 trend 和后续 baseline action |

### 8.5 修复后复验规则

| 缺陷触发面 | 必跑用例 / suite | 必跑 check | 关闭证据 |
|---|---|---|---|
| contracts DTO / metadata / body-free | 原 TC + `TC-ID-CONTRACT-*` family + `contract-domain-fast` | report pairing;redaction if output changed | suite report + case artifact |
| domain invariant / state / lifecycle / ref stability | 原 TC + domain/state family + `contract-domain-fast` | redaction if error output changed | domain/state suite report |
| command accepted / rejected / UoW / outbox enqueue | 原 TC + related command family + `service-flow-fast` | report pairing;redaction | service suite report + UoW artifact |
| query no-write / visibility / degraded | 原 TC + representative query no-write + `service-flow-fast` | write-audit;redaction | query suite report + write-audit evidence |
| consumer / callback receipt / no implicit create | 原 TC + consumer duplicate/unsupported/delayed family + `entry-worker-job` | redaction | worker suite report |
| outbox / publisher / topic | original outbox TC + `operations-replay-core` | redaction;dependency if topic/binding changed | operations report |
| job / handoff / reconciliation / report-only | original job TC + `entry-worker-job` or `operations-replay-core` | report-generation-audit | job report + replay artifact |
| idempotency / commit unknown / rollback / stored missing | original idempotency TC + `infra-runtime-fake` + affected suite | report pairing | idempotency/fault artifact |
| config / runtime builder / disabled adapter | original config TC + `config-redline` | report pairing | config suite report |
| redaction leak | failing leak case + `redaction-boundary` + affected suite | `check_redaction.sh` | clean `redaction-check.md` |
| dependency boundary | `TC-ID-ARCH-001` + `dependency-boundary` | `check_dependency_boundary.sh` | clean `dependency-boundary.md` |
| evidence/report integrity | report-generation-audit suite | `check_artifact_report_pairing.sh`;`check_no_static_evidence.sh` | clean `report-audit.md` |
| release smoke closure | original scenario + `release-main-smoke` + affected lower suite | release redaction/dependency/report checks | release suite report + `gate-summary.md` |

### 8.6 放行规则

| 条件 | 通过 | 有条件通过 | 不通过 |
|---|---|---|---|
| S 级缺陷 | 无未关闭 S | 不允许 | 任一未关闭 S |
| VETO | `VETO-ID-001~006` 均未触发且有证据 | 不允许 | 任一触发或证据无法裁决 |
| A 级缺陷 | 无未关闭 A | 未关闭 A 已证明不影响 P0 且 Step 13 风险接受完整 | 未关闭 A 且无接受 / 无替代 evidence |
| B 级缺陷 | 可存在但需记录 | 可作为条件和后续动作 | B 实际影响 P0 时升级 A/S |
| P0 suite / checks | 全部通过 | 仅测试工具缺陷可有条件,且 P0 语义有替代 artifact | blocking suite fail 且不能证明工具缺陷 |
| Evidence integrity | EV / report / artifact / audit 完整 | 不允许 | 缺 raw artifact、report pairing、static evidence pass |
| Redaction / dependency | clean | 不允许 | 任一失败 |
| P1/P2 residual | 无或已记录 | 可进入 Step 13 风险接受 | 被误作为 P0 pass 证据 |

### 8.7 风险接受进入条件

| 缺陷 / 风险 | 是否可进入 Step 13 | 条件 |
|---|---|---|
| S / VETO | 否 | 必须修复 |
| P0 redaction / dependency / evidence integrity | 否 | 必须修复 |
| P0 query write / job truth repair / duplicate rerun | 否 | 必须修复 |
| A 级 P0 主线风险 | 有条件 | 已证明不影响 P0 truth / VETO / evidence,且有替代证据 |
| B 级非阻断问题 | 是 | 有接受人、影响范围、后续动作 |
| R 类 residual | 是 | 明确非 P0,不得支撑 P0 pass |

### 8.8 缺陷关闭证据清单

| 证据项 | S | A | B |
|---|---|---|---|
| 缺陷记录和影响范围 | 必需 | 必需 | 必需 |
| 失败前 run_id / artifact / report | 必需 | 必需 | 可选 |
| 修复说明和变更范围 | 必需 | 必需 | 可选 |
| 修复后相关 TC / suite report | 必需 | 必需 | 视影响范围 |
| redaction / dependency / report audit | 相关即必需;安全/证据类必需 | 相关即必需 | 可选 |
| 是否新增防回归测试说明 | 必需 | 必需 | 可选 |
| 风险接受记录 | 不允许 | 若未关闭则必需 | 若放行前未关闭则必需 |
| `open-issues.md` 更新 | 必需 | 必需 | 必需 |

### 8.9 自动化防回归要求

| 触发 | 要求 |
|---|---|
| 手工发现 P0 缺陷 | 必须新增 TC、suite assertion 或 check |
| release smoke 发现但 lower suite 未发现 | 必须把断言下沉到 contract/domain/service/operations suite |
| redaction 漏扫 | 必须扩展 redaction fixture / scanner |
| dependency boundary 漏检 | 必须扩展 dependency graph check |
| report-audit / no-static 漏检 | 必须扩展 report-generation-audit |
| query no-write / job no-repair 漏检 | 必须扩展 write-audit 或 job report assertion |
| duplicate / idempotency / UoW 缺陷 | 必须新增 fault injection case |
| fake / controlled parity 缺陷 | 必须新增 fake/controlled 同构断言 |
| P1/P2 风险升级为 P0 | 必须先回写范围、环境、数据和 gate |

### 8.10 缺陷与放行停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| S/A/B 定义是否符合书写规范 | 通过 | R 只作为 residual 输入 |
| S 是否覆盖全部 VETO | 通过 | `VETO-ID-001~006` 均 S |
| S 是否覆盖 evidence integrity / redaction / dependency | 通过 | §8.3 |
| A/B 是否有放行口径 | 通过 | §8.4 / §8.6 |
| 复验是否可执行 | 通过 | §8.5 |
| 风险接受边界是否清楚 | 通过 | §8.7 |
| 自动化防回归触发是否明确 | 通过 | §8.9 |
| 是否提前替代 Step 13/14 | 通过 | 不实际接受风险,不签署结论 |

### 8.11 跨缺陷裁决审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 缺陷规则是否与一票否决一致 | 通过 | VETO 不可接受 |
| 缺陷规则是否与证据门禁一致 | 通过 | evidence integrity fail 为 S |
| 缺陷规则是否与非功能门禁一致 | 通过 | redaction/config/dependency/fake parity 覆盖 |
| 是否存在可被风险接受的 P0 红线 | 否 | S 不可接受 |
| 是否把 P1/P2 误设为 P0 阻断 | 否 | R / B 处理 |
| 是否有复验路径和关闭证据 | 通过 | §8.5 / §8.8 |
| 是否提前给最终结论 | 否 | Step 14 处理 |

## 9. 对上游 / 下游文档的影响判定

| 结论 | 是否影响上游 / 下游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 正式验收主表使用 S/A/B,R 作 residual 输入 | 否 | 对齐书写规范 | 无需回写 |
| P0 evidence integrity fail 为 S | 否 | 承接 Step 10 | Step 14 使用真实 run 裁决 |
| A 级可有条件通过需 Step 13 风险接受 | 否 | 分工清晰 | Step 13 处理 |
| 若实际缺陷暴露设计无法 1:1 落码 | 是 | 设计闭口缺陷 | 回写 `03/04/05/06/07` 对应文档 |
| 若 P1/P2 升级 P0 | 是 | 范围和 gate 变更 | 回写 Step 2/3/9/10 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_12_defects_release.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“缺陷分级表”“S 级阻断判定表”“修复后复验规则”“放行规则”“风险接受进入条件”和“跨缺陷裁决审计表”小节,了解缺陷如何影响验收结论和下一阶段许可。

正式 `06-验收标准.md` §12 应回填:

- 缺陷分为 S、A、B 三类;R 作为 Step 13 residual 输入,不作为正式缺陷主级别。
- 任一未关闭 S 或任一 `VETO-ID-001~006` 命中,总体结论必须是不通过。
- A 级缺陷未修复时默认阻断;只有证明不影响 P0 且完成 Step 13 风险接受,才可支持有条件通过。
- B 级可作为非阻断遗留,但不得影响 P0 EV、VETO、redaction、dependency、config、query no-write、job no-repair 或 evidence integrity。
- 修复后必须复验原 TC、同 family TC、相关 suite / check,并保留修复前后 run_id、artifact、report、关闭证据和防回归说明。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 实际 `open-issues.md` 是否已生成 | 影响 Step 14 结论 | Step 14 使用真实 run 裁决 |
| A 级风险接受人是否已明确 | 影响有条件通过 | Step 13 处理 |
| S 级关闭是否需要人工签字 | 影响签署 | Step 14 处理 |
| P1/P2 selected-run 是否升级 P0 | 影响范围和缺陷级别 | 当前不升级;需正式回写 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 缺陷分级表完成 | 通过 | 见 §8.1 |
| S 级阻断判定完成 | 通过 | 见 §8.3 |
| A/B 放行口径完成 | 通过 | 见 §8.4 / §8.6 |
| 修复后复验规则完成 | 通过 | 见 §8.5 |
| 风险接受进入条件明确 | 通过 | 见 §8.7 |
| 缺陷关闭证据和防回归要求完成 | 通过 | 见 §8.8 / §8.9 |
| 未提前替代 Step 13~14 | 通过 | 风险接受和最终签署留后续 |
| 可进入 Step 13 | 通过 | 用户已确认,进入 Step 13: 定义风险接受与遗留项 |
