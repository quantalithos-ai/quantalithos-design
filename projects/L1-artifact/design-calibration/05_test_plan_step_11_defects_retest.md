# Step 11. 定义缺陷管理与复验规则

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 11
> 回填章节: `05-测试方案.md` §11 缺陷管理与复验规则

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 11 定义缺陷管理与复验规则 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 6 用例矩阵;Step 9 自动化门禁;Step 10 专项测试;`00` 第 14 章五类验收方向与 `VF-ART-001~004` |
| 输出文件 | `projects/L1-artifact/design-calibration/05_test_plan_step_11_defects_retest.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 12 |

## 2. 本步目标

定义 Artifact 的测试缺陷如何分级、阻断、升级、修复、复验和关闭,确保真相归属、跨仓消费边界、正文与 redaction、dependency boundary、query no-write、job no-truth-repair、report integrity 和 replay consistency 不会在测试收口时被降级成普通风险。

本 Step 只回答:

- 哪些失败或发现属于 S 级阻断、A 级阻断、B 级缺陷或 R 级残余风险。
- 哪些缺陷绝不允许风险接受,哪些只允许在 P1/P2 或 future 范围内记录 residual。
- Step 9 的 suite / check 失败如何映射到缺陷级别和复验范围。
- Step 10 的专项红线如何进入 triage、复验和关闭证据。
- 修复后何时只跑最小 targeted subset,何时必须回归同 family / 同 gate,何时必须重跑 full release gate。
- 缺陷关闭需要哪些 raw artifact、report、check 结果和防回归动作。

本 Step 不定义缺陷系统字段、工单平台、责任人组织结构、正式 evidence ID、正式 acceptance handoff 模板或 release 最终裁决。这些由 Step 12、Step 13 和后续 `06-验收标准.md` 继续收口。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `projects/L1-artifact/00-需求文档.md` §14 | 正式输入 | 提供五类验收方向、`VF-ART-001~004` 与一票否决口径 |
| `05_test_plan_step_05_traceability_coverage.md` | 已完成 | 提供 `FR-ART` / `BR-ART` / `NFR-ART` / `VF-ART` 到用例、gate 和候选证据的追溯 |
| `05_test_plan_step_06_cases.md` | 已完成 | 提供 `TC-ART-*` 主线、负向、no-write、no-truth-repair、redaction、dependency、config、idempotency 用例 |
| `05_test_plan_step_09_automation_gates.md` | 已完成 | 提供 PR / main / nightly / release / selected-run suites、blocking checks、artifact/report 根目录和失败语义 |
| `05_test_plan_step_10_nonfunctional.md` | 已完成 | 提供 truth ownership、cross-repo consumption、redaction、安全、恢复、observability、config/dependency 等专项红线 |
| `03_ddd_step_12_error_recovery.md` | 正式输入 | 提供 rejected / delayed / duplicate / partial failure / consistency defect / commit unknown 口径 |
| `03_ddd_step_15_observability_audit.md` | 正式输入 | 提供 logs / metrics / audit / trace / report 的 safe output 与 report-audit 约束 |
| `projects/L1-governance/design-calibration/05_test_plan_step_11_defects_retest.md` | 已读取 | 只作为 Step 11 粒度与框架参考,本文件按 Artifact 语义重写 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些缺陷属于 S 级阻断? | `VF-ART-001~004` 任一命中、truth ownership 被打破、下游或外围能反写 Artifact truth、外部正文或消费副本进入正式 truth、version / lineage / baseline 无法稳定形成 / 追溯 / 冻结、query 出现写副作用、public job 或 relay facade 出现 truth repair、redaction 泄漏、非 `L0-core/core-contracts` compile-time sibling dependency、report integrity / no-static-evidence 失效、duplicate replay 或 commit unknown 导致第二次 truth write,均为 S 级。 |
| 哪些缺陷可以风险接受? | 只允许 P1/P2 或 future 范围内的 unavailable / residual,以及当前没有正式硬阈值来源的性能 sample / trend 偏差、selected-run real-like unavailable、非阻断可读性问题。P0 的 truth、redaction、dependency、config fail-fast、query no-write、job no-truth-repair、report integrity 不允许风险接受。 |
| 修复后最少要回归什么? | 至少回归原失败 `TC-ART-*`、同 family 用例、关联 suite 和相关 blocking check。涉及共享 contracts、state matrix、UoW / idempotency、outbox / relay、handoff、config、redaction、dependency、report audit 的修复,不得只跑单个 case。 |
| 何时必须重跑 full release gate? | 只要缺陷触及 `release-main-smoke`、`config-redline`、`dependency-boundary`、`redaction-boundary`、`operations-replay-core`、`report-generation-audit` 任一 blocking release 证据链,或者触及 `VF-ART-*`、truth ownership、cross-repo consumption、report pairing / no-static-evidence,都必须重跑 full release gate。 |
| 缺陷关闭需要哪些证据? | 必须保留失败前 run_id、raw artifact、suite report、gate summary、失败说明;修复后必须保留复验 run_id、对应 suite/check 结果、修复说明、是否新增防回归测试说明。S / A 级若涉及 redaction、dependency、report integrity,还必须附对应检查报告。 |
| 什么情况下必须新增自动化防回归? | 手工发现 P0 缺陷、release smoke 发现但 lower suites 未发现、query no-write / job no-truth-repair 漏测、redaction / dependency / report audit 漏检、commit unknown / duplicate replay / missing stored result 类一致性缺陷复发时,必须补自动化或扩现有 suite / check。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 9 | 已定义 suites 和 blocking checks,但缺失败后的分级、升级与关闭规则 | 本 Step 固定 suite/check -> defect severity -> retest 范围 |
| Step 10 | 已定义专项红线,但缺“哪些不可风险接受”与“哪些只能 residual” | 本 Step 固定 P0 红线不可降级 |
| Step 6 | 已有 `TC-ART-IDEMP-006/007` 等高风险用例,但缺陷模型还没把它们上升到 veto / blocker | 本 Step 把 query no-write / job no-truth-repair / report integrity 进入 S 级 |
| 旧 `05/06` | 历史缺陷规则不覆盖 report pairing / no-static-evidence / cross-repo consumption truth boundary | 不继承旧规则 |
| 性能候选 | 容易被误写成 release blocker | 本 Step 明确当前只作 sample / trend,无正式硬阈值时不记 S/A |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 缺陷分级 | 只有 suite pass/fail | 固定 `S/A/B/R` 分级模型 | 便于 Step 12 进入 / 退出准则承接 |
| Artifact 红线 | 分散在 `VF-ART`、Step 6、Step 9、Step 10 | 汇总成 S 级阻断判定表 | 防止 P0 红线在 triage 中被冲淡 |
| 复验范围 | 只知道“重新跑测试” | 固定 targeted subset / family suite / full release gate 三档 | 避免修完只跑单测 |
| 关闭证据 | 只知道有 artifact/report | 固定失败前后 run_id、suite/check、gate summary、防回归说明 | 支撑后续 acceptance 审核 |
| 自动化补强 | 仅在 Step 9 暗含 | 明确哪些缺陷必须补自动化 | 防止相同 P0 缺陷反复出现 |

## 7. 缺陷管理设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| `VF-ART` 是否允许降级为 A/B | A. 可临时接受;B. 一律 S | 采用 B。`VF-ART-001~004` 直接对应一票否决。 |
| release blocking suite failed 是否都自动 S | A. 一律 S;B. 先按失败类型拆分 | 采用 B。若只是测试脚本自身缺陷且不影响 P0 语义,可记 A;但一旦触及 truth / redaction / dependency / report integrity 即 S。 |
| query no-write / job no-truth-repair 失败是否只算用例失败 | A. 只算 case 失败;B. 直接升级为 truth boundary defect | 采用 B。它们等价于 `VF-ART-004` 范围。 |
| 当前性能 sample 偏差是否阻断 | A. 阻断;B. 记录风险 | 采用 B。没有正式数值阈值来源。 |
| real-like selected-run unavailable 是否阻断 P0 | A. 阻断;B. 只记 residual | 采用 B。Step 8/9 已明确它不是当前 P0 主证据链。 |

## 8. 结构化中间产物

### 8.1 缺陷分级表

| 级别 | 定义 | Artifact 典型示例 | 处理要求 | 是否阻断 |
|---|---|---|---|---|
| S | 命中一票否决、P0 truth / boundary / security / evidence 红线 | `VF-ART-001~004`;query no-write 失守;job no-truth-repair 失守;redaction 泄漏;dependency boundary 破坏;report 静态造证据;duplicate replay 生成第二次 truth | 必须修复;不得风险接受;必须按要求复验;关闭前必须有完整证据链 | 是 |
| A | P0 阻断缺陷,但未直接命中一票否决;或 blocking suite 因实现/脚本问题无法稳定证明通过 | config-redline 某核心 profile 失败;replay report pairing 缺字段;consumer duplicate replay 返回面错误;release smoke 场景断裂但 truth 未损坏 | 必须修复或经明确批准后暂缓;release / exit 前通常仍阻断 | 通常是 |
| B | 非 P0 或不影响当前主证据链的缺陷 | P1 selected-run unavailable;报告可读性问题;性能 sample 异常但无硬阈值;非阻断的 fake 维护性问题 | 可排期处理或记录 follow-up | 否 |
| R | 当前范围外或未来能力残余风险 | real-like provider 深层行为、production-like capacity、未来 SLA/容量门槛、真实 observability backend 特性 | 只能记录 residual / 假设 / 后续触发条件,不得伪装成已验证 | 否 |

### 8.2 S 级阻断判定表

| 触发条件 | 对应来源 | 判定 |
|---|---|---|
| 五个核心能力节点任一无法成立 | `VF-ART-001` | S |
| 外部正文、消费副本、preview/report/outbox/handoff body 进入正式 truth 或正式输出面 | `VF-ART-002`;Step 10 安全 / body-free / redaction | S |
| version / lineage / baseline 无法稳定形成、追溯、冻结或历史被静默覆盖 | `VF-ART-003`;Step 6 `TC-ART-CMD-*`;Step 10 truth ownership | S |
| 下游 / 外围 / query / consumer / job / handoff / replay 可以反写 Artifact truth | `VF-ART-004`;Step 6 `TC-ART-IDEMP-006/007` | S |
| query 执行触发 write UoW、refresh、rebuild、append audit、truth mutation | Step 6 `TC-ART-IDEMP-006` | S |
| public job 或 `PublishPendingArtifactRelays` 修复 / 覆盖 / 重算 truth | Step 6 `TC-ART-IDEMP-007`;`TC-ART-RELAY-001` | S |
| redaction scan 检出 raw body、external response、secret、full sensitive ref | Step 9 `redaction-boundary`;Step 10 安全专项 | S |
| 非 `L0-core/core-contracts` sibling compile-time dependency | Step 9 `dependency-boundary`;`TC-ART-ARCH-001` | S |
| report 缺 raw artifact 回指、artifact/report pairing 失败、静态 JSON/Markdown 直接宣告通过 | Step 9 `report-generation-audit` | S |
| duplicate replay、commit unknown、missing stored result 导致第二次 truth write 或从 current truth/current report 重算 | Step 6 `TC-ART-IDEMP-002/004`;Step 10 一致性专项 | S |

### 8.3 Suite / check 到缺陷级别映射表

| Suite / check | 失败类型 | 默认缺陷级别 | 升降级规则 |
|---|---|---|---|
| `contract-domain-fast` | typed ref / DTO / state / invariant / rejection surface 失败 | A | 若导致 body-free 失守、非法状态 accepted 或 cross-boundary truth 污染,升 S |
| `service-flow-fast` | command / query / consumer 主线或负向失败 | A | 若触及 `VF-ART-*`、query no-write、consumer truth write、backref 反写 truth,升 S |
| `config-redline` | strict JSON / no fallback / forbidden override / profile assembly 失败 | A | 若 invalid config 暗中启动或关闭 no-write / redaction / truth boundary,升 S |
| `dependency-boundary` | compile-time sibling boundary 失败 | S | 不降级 |
| `infra-runtime-fake` | UoW / result store / repository / runtime builder / idempotency fault 失败 | A | 若出现 missing result recompute、commit unknown 二写 truth、runtime invalid 却继续提供 facade,升 S |
| `entry-worker-job` | API / worker / public job entry surface 失败 | A | 若 worker/job 入口触发 truth write 越界、receipt/report replay 失真或 public job repair truth,升 S |
| `operations-replay-core` | relay publish / replay / handoff / no-truth-repair 失败 | A | 若 relay 从 current truth 重算、handoff 迁移 ownership、replay repair truth,升 S |
| `redaction-boundary` | redaction / safe output 失败 | S | 不降级 |
| `operations-replay-extended` | nightly 深跑 failure | A | 若复现 P0 consistency / truth corruption,按影响升 S;若仅 nightly 深度覆盖问题且不触主链,可 B |
| `report-generation-audit` | pairing / no-static-evidence / candidate deriv出失败 | S | 不降级 |
| `release-main-smoke` | 五能力最小闭环失败 | A | 若定位到 `VF-ART-*` 或主链 truth 破坏,升 S |
| `p1-real-like-selected-run` | unavailable / 环境适配失败 | B/R | 不影响当前 P0 结论 |

### 8.4 复验范围决策矩阵

| 缺陷类型 | 最小复验 | 必须追加 | 是否重跑 full release gate |
|---|---|---|---|
| 单一 case 编排错误,局限于一个 command/query/consumer family | 原失败 `TC-ART-*` + 同 family case | 对应 primary suite | 否 |
| contracts / state / rejection / typed ref 变更 | 原失败 case | `contract-domain-fast`;关联 `service-flow-fast` | 视是否触 release 证据链 |
| UoW / idempotency / duplicate / commit unknown / stored result | 原失败 case | `infra-runtime-fake`;`operations-replay-core`;相关 `TC-ART-IDEMP-*` | 是,若触及 accepted/replay/report 主链 |
| query no-write / visibility / degraded 变更 | 原失败 query case | 全部代表性 query no-write 用例 + `service-flow-fast` | 是,若读面证据进入 release smoke |
| public job / relay facade / handoff / replay 变更 | 原失败 job/relay case | `entry-worker-job`;`operations-replay-core`;相关 handoff/replay checks | 是 |
| config / runtime builder / profile 变更 | 原失败 config case | `config-redline`;必要时 `infra-runtime-fake` | 是 |
| redaction / metrics label / safe output 变更 | 原失败 leak case | `redaction-boundary`;相关 suite;release redaction check | 是 |
| dependency / architecture boundary 变更 | 原失败 dependency case | `dependency-boundary` | 是 |
| report pairing / no-static-evidence / gate summary 变更 | 原失败 audit case | `report-generation-audit`;相关 blocking suites | 是 |
| 仅 P1/P2 selected-run / future residual | 原失败 selected-run | 视情况追加 selected-run family | 否 |

### 8.5 blocker / non-blocker / residual 处理表

| 类型 | 进入条件 | 处理 | 是否允许测试退出 |
|---|---|---|---|
| blocker | 任一 S;任一未获批准的 A | 修复并复验后方可继续 | 否 |
| conditional blocker | A 级且已确认不触及 `VF-ART` / release 主证据链,但影响当前里程碑 | 由明确接受人决定是否暂缓;若暂缓必须记录剩余风险和回归条件 | 一般否,除非 Step 12 明确允许 |
| non-blocker | B 级 | 记录并排期 | 是 |
| residual risk | R 级 | 记录 residual / unavailable / future capability,不得伪装成已通过 | 是 |

### 8.6 风险接受规则

| 项 | 是否可风险接受 | 条件 |
|---|---|---|
| `VF-ART-001~004` 命中 | 否 | 一票否决 |
| truth ownership / cross-repo consumption 失守 | 否 | 直接 S |
| query no-write 失败 | 否 | 直接 S |
| public job no-truth-repair 失败 | 否 | 直接 S |
| redaction / dependency / report integrity 失败 | 否 | 直接 S |
| invalid config silent fallback / forbidden override 生效 | 否 | 直接 S 或 A->S |
| replay consistency / missing result recompute | 否 | 直接 S |
| 性能 sample/trend 偏差 | 是 | 当前无正式阈值,记录风险即可 |
| P1 selected-run unavailable | 是 | 仅记 unavailable / residual |
| 报告文案、非阻断可读性、维护性问题 | 是 | 不影响 raw artifact、suite status 和 gate 结论 |

### 8.7 缺陷关闭证据清单

| 证据 | S 级 | A 级 | B/R 级 |
|---|---|---|---|
| 缺陷记录、影响面与分级理由 | 必需 | 必需 | 必需 |
| 失败前 `run_id` | 必需 | 必需 | 有则附 |
| 失败前 raw artifact / suite report / gate summary | 必需 | 必需 | 有则附 |
| 修复说明与影响范围 | 必需 | 必需 | 建议 |
| 复验 `run_id` | 必需 | 必需 | 有则附 |
| 复验 suite/check 报告 | 必需 | 必需 | 视情况 |
| redaction / dependency / report audit 报告 | 相关即必需 | 相关即必需 | 可选 |
| 是否新增防回归测试说明 | 必需 | 必需 | 可选 |
| 风险接受人 / residual 说明 | 不允许 | 若接受则必需 | 必需 |

### 8.8 自动化防回归新增规则

| 触发 | 要求 |
|---|---|
| 手工发现 P0 缺陷 | 必须新增 `TC-ART-*` 或扩现有 suite 断言 |
| release smoke 发现但 lower suite 未发现 | 必须把断言下沉到更低层 suite |
| query no-write / job no-truth-repair 漏检 | 必须扩 `TC-ART-IDEMP-006/007` 家族或对应 write-audit helper |
| redaction 泄漏未被 scanner 捕获 | 必须扩 redaction fixture / scanner |
| dependency boundary 漏检 | 必须扩 graph / manifest check |
| report pairing / no-static-evidence 漏检 | 必须扩 `report-generation-audit` |
| duplicate replay / commit unknown / missing stored result 缺陷复发 | 必须扩 idempotency / recovery fault injection |
| P1/P2 风险升级为 P0 | 必须先回写 Step 2 / 8 / 9 / 10 / 11,再补自动化 |

### 8.9 缺陷停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| `VF-ART-001~004` 是否全部进入 S 级 | 通过 | 见 §8.2 |
| query no-write / job no-truth-repair 是否被提升为 veto 边界 | 通过 | 见 §8.2 / §8.6 |
| suite/check failure 是否都有 severity 映射 | 通过 | 见 §8.3 |
| retest 是否区分 targeted / family / full release gate | 通过 | 见 §8.4 |
| residual risk 是否未误入 P0 通过链 | 通过 | 见 §8.5 / §8.6 |
| 缺陷关闭是否要求失败前后证据链 | 通过 | 见 §8.7 |
| 自动化补强触发是否明确 | 通过 | 见 §8.8 |

### 8.10 跨缺陷 / 复验审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| Step 9 blocking gates 是否能直接映射为 blocker 体系 | 通过 | `dependency-boundary` / `redaction-boundary` / `report-generation-audit` 直接 S |
| Step 10 truth ownership / cross-repo consumption 是否进入 triage 主轴 | 通过 | 见 §8.2 / §8.3 |
| performance 是否未被误写成硬阻断 | 通过 | 只作 B/R 风险 |
| `PublishPendingArtifactRelays` 是否保持独立于 6 public jobs | 通过 | 以 relay facade 单列复验范围 |
| 是否存在“只跑单测就关闭”的路径 | 否 | §8.4 已要求 family / gate 回归 |
| 是否提前固定正式 evidence ID | 否 | 仍保持 `EV-CAND-ART-*` / run-based 证据 |

## 9. 对上游设计的影响判定

| 缺陷规则结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| `VF-ART` 全部不可降级 | 否 | 测试与验收管理细化 | 与正式 `00` 一致 |
| query no-write / job no-truth-repair 进入 S 级 | 否 | 测试 blocker 细化 | 与 Step 6 / Step 10 一致 |
| report integrity / no-static-evidence 进入 S 级 | 否 | 证据真实性约束 | 与 Step 9 一致 |
| 若未来要求性能数字成为正式阻断 | 是 | 验收基线变更 | 需回写 `00/05/06` |
| 若 future real-like seam 升级为 P0 | 是 | 范围与 gate 变更 | 需回写 Step 2 / 8 / 9 / 10 / 11 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_11_defects_retest.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“缺陷分级表”“S 级阻断判定表”“Suite / check 到缺陷级别映射表”“复验范围决策矩阵”“缺陷关闭证据清单”和“自动化防回归新增规则”小节。

正式 `05-测试方案.md` §11 应回填:

- 缺陷分为 `S/A/B/R` 四级。其中 `S` 对应 `VF-ART-001~004`、truth ownership / cross-repo consumption 破坏、query no-write 失守、job no-truth-repair 失守、redaction 泄漏、dependency boundary 破坏和 report integrity 失效,不得风险接受。
- `A` 级是当前 P0 阻断缺陷但未直接命中一票否决的情形,通常仍阻断 release 或退出;`B/R` 只用于 P1/P2、future residual、性能 sample / trend 或非阻断可读性问题。
- 修复后至少回归原失败 `TC-ART-*`、同 family 用例、关联 suite 和关联 blocking check;触及 release 主证据链时必须重跑 full release gate。
- 缺陷关闭必须同时具备失败前后 `run_id`、raw artifact、suite report、gate summary、修复说明和复验结果。安全、dependency 和 report integrity 缺陷还必须附对应检查报告。
- 手工发现 P0 缺陷、release smoke 漏检、query no-write / job no-truth-repair 漏检、redaction / dependency / report audit 漏检时,必须补自动化防回归。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| A 级暂缓的审批人与记录模板 | 影响 Step 12 / Step 13 退出裁决 | 当前只要求“明确接受人 + residual 说明” |
| future 若把 numeric performance threshold 升格为正式门禁 | 影响分级与退出 | 当前不升格,留 Step 14 讨论 |
| R 级 residual 是否需要固定独立报告版式 | 影响 Step 13 归档 | 当前只保留 residual 说明和 run context |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| S/A/B/R 分级可执行 | 通过 | 见 §8.1 |
| `VF-ART` 与 P0 truth boundary 不可降级 | 通过 | 见 §8.2 / §8.6 |
| 复验范围和 full release gate 触发清楚 | 通过 | 见 §8.4 |
| 缺陷关闭证据链明确 | 通过 | 见 §8.7 |
| 可进入 Step 12 | 通过 | 下一步定义进入准则与退出准则;进入前等待用户审查 |
