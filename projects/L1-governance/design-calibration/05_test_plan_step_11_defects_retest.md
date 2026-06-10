# Step 11. 定义缺陷管理与复验规则

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 11
> 回填章节: `05-测试方案.md` §11 缺陷管理与复验规则

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 11 定义缺陷管理与复验规则 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 6 用例矩阵;Step 9 自动化门禁;Step 10 专项测试;`00` VF-GOV 一票否决项 |
| 输出文件 | `projects/L1-governance/design-calibration/05_test_plan_step_11_defects_retest.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 12 |

## 2. 本步目标

定义测试缺陷如何分级、升级、修复、复验和关闭,确保一票否决、P0 blocking suite、证据真实性和 redaction / dependency 红线不会被降级成普通风险。

本 Step 只回答:

- 哪些缺陷属于 S 级阻断。
- 哪些缺陷可以风险接受。
- 修复后必须回归哪些用例和 suite。
- 缺陷关闭需要哪些证据。
- 什么时候必须新增自动化防回归。

本 Step 不定义缺陷系统字段、工单平台流程、负责人排期、验收通过裁决、正式 EV 编号或 reports/acceptance 模板。正式证据归档由 Step 13 固定,进入 / 退出准则由 Step 12 固定。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `00-需求文档.md` §14.2 | 正式输入 | 提供 VF-GOV-001~010 一票否决项 |
| `05_test_plan_step_05_traceability_coverage.md` | 已完成 | 提供 VF / AC / TC / EV-CAND 追溯 |
| `05_test_plan_step_06_cases.md` | 已完成 | 提供 TC-GOV-* 用例、断言和候选证据 |
| `05_test_plan_step_09_automation_gates.md` | 已完成 | 提供 P0 blocking suite、artifact/report 输出和静态证据阻断 |
| `05_test_plan_step_10_nonfunctional.md` | 已完成 | 提供专项红线、故障注入、redaction、dependency 和性能候选边界 |
| `测试方案书写规范.md` §5.11 | 标准输入 | 提供 S / A / B 分级和复验规则要求 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些缺陷属于 S 级阻断? | 任一 VF-GOV-001~010 命中、任一 P0 blocking suite 失败且无法证明为测试脚本自身错误、redaction 泄露、非 core sibling compile dependency、query/job 反写真相、accepted truth 缺 trace/audit/outbox/result、duplicate replay 分叉、release evidence/report 静态伪造或缺 raw artifact/report 配对,均为 S 级阻断。 |
| 哪些缺陷可以风险接受? | 只允许 P1/P2 范围、future real-like selected-run unavailable、旧性能候选数字未达但无正式阈值、非核心 UI/报表体验、真实产品 adapter 深度行为、implementation runner 非阻断可维护性问题进入风险接受。P0 truth、VF、redaction、dependency、config fail-fast、evidence integrity 不允许风险接受。 |
| 修复后必须回归哪些用例? | 至少回归原失败 TC、同 family TC、相关 suite 和对应 release check。涉及 shared contracts/domain/state/UoW/redaction/dependency/config/outbox/job/report 的修复必须回归更宽 suite,不能只跑单个失败测试。见 §8.3。 |
| 缺陷关闭需要哪些证据? | 必须有缺陷记录、修复说明、复验 run_id、失败前 artifact/report ref、修复后 artifact/report ref、相关 TC / suite status、redaction/dependency/report pairing 结果、是否新增防回归测试的说明。S 级关闭必须有对应 blocking suite 通过证据。 |
| 是否需要新增自动化防回归? | 如果缺陷来自未覆盖路径、手工发现、release smoke 发现但底层 suite 未覆盖、证据造假 / report pairing 漏检、redaction 漏扫、dependency boundary 漏扫或 P0 负向断言缺失,必须新增或扩展自动化用例 / check。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 9 | 已定义 blocking suite,但缺失败后分级和关闭规则 | 本 Step 固定 suite failure 到缺陷级别 |
| Step 10 | 已定义红线,但缺风险接受边界 | 本 Step 明确 VF/P0/redaction/dependency 不可风险接受 |
| 旧 `05/06` | 旧缺陷规则不能覆盖新版 EV/report 防伪和 P0 suite | 不继承旧规则 |
| Evidence | Step 13 尚未定义正式归档 | 本 Step 只定义缺陷关闭需要的证据类型,正式路径由 Step 13 固定 |
| 性能 | 旧性能数字可能被误报缺陷 | 本 Step 明确无正式阈值时只能记 sample/risk,不是 S/A 缺陷 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 缺陷分级 | 只有用例和门禁 | 增加 S/A/B/R 分级 | 便于测试退出和复验 |
| 一票否决处理 | 只在需求和专项中出现 | 明确 VF 命中一律 S 级 | 防止降级 |
| 风险接受 | 未说明哪些能接受 | 限定为 P1/P2/future/candidate | 保护 P0 truth |
| 复验 | 未说明修复后跑哪些 suite | 按触发面映射回归 suite | 避免只跑单测 |
| 自动化新增 | 未说明触发条件 | 缺覆盖或手工发现 P0 必须补自动化 | 防止复发 |

## 7. 缺陷管理设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| VF 命中是否可风险接受 | A. 可接受;B. 不可接受 | 采用 B。一票否决不可降级 |
| P0 blocking suite failed 是否都 S 级 | A. 全部 S;B. 先判断影响 | 采用 B。若证明是测试脚本自身错误且不影响 P0 语义,可为 A;否则 S |
| 旧性能候选未达是否阻断 | A. 阻断;B. 不阻断,记录风险 | 采用 B。无正式阈值来源 |
| 修复后是否只跑失败 case | A. 是;B. 跑失败 case + family + gate | 采用 B。P0 缺陷常涉及共享契约 |
| 手工发现 P0 缺陷是否必须自动化 | A. 可手工保留;B. 必须补自动化 | 采用 B。P0 缺陷需要防回归 |

## 8. 结构化中间产物

### 8.1 缺陷分级表

| 级别 | 定义 | 示例 | 处理要求 | 是否阻断 |
|---|---|---|---|---|
| S | 一票否决、P0 truth 破坏、P0 blocking evidence 失真或安全红线命中 | VF-GOV-001~010;redaction 泄露;query/job 反写真相;non-core sibling compile dependency;release artifact/report 伪造 | 必须修复;必须复验对应 blocking suite;不得风险接受;关闭需附修复后 artifact/report | 是 |
| A | P0 用例失败但未命中 VF,或 blocking suite 因实现 / 测试工具缺陷无法稳定证明 | 某 Command accepted flow 少写非关键 report field;operations replay partial count 错;fake fault profile 不稳定 | 必须修复或由测试负责人批准临时风险接受;修复后回归相关 suite | 视情况;release 前通常阻断 |
| B | 非 P0、P1/P2 selected-run、文档/报告清晰度、非阻断可维护性问题 | P1 real-like unavailable;候选性能 sample 偏高;report 文案不清但 raw artifact 完整 | 可排期处理或风险接受;不得影响 P0 pass | 否 |
| R | 已确认范围外或未来能力风险 | production-like capacity、真实 external GRC vendor behavior、高级 Policy DSL、复杂 Gate 编排 | 记录残余风险和接受人;不得伪装为已验证 | 否 |

### 8.2 S 级阻断判定表

| 触发条件 | 对应来源 | 判定 |
|---|---|---|
| C-GOV-1~5 任一核心闭环无法成立 | VF-GOV-001 | S |
| 相邻仓状态 / UI / runtime cache 替代 Gate / Decision truth | VF-GOV-002 | S |
| raw artifact/evidence/method/runtime/observability/archive/external GRC body 进入 truth/outbox/audit/trace/report/artifact | VF-GOV-003;VF-GOV-007 | S |
| Policy truth 被 runtime/method/capability 反向定义 | VF-GOV-004 | S |
| shared rules 被低 scope 覆盖 | VF-GOV-005 | S |
| finalized Decision 原地改写且无新事实 | VF-GOV-006 | S |
| Nonconformity 被 bug/work blocker/alert 替代关闭 | VF-GOV-008 | S |
| Query / projection / reconciliation / handoff / export job 反写 core truth | VF-GOV-009 | S |
| 非 `L0-core` sibling compile dependency | VF-GOV-010 | S |
| config invalid 被 silent fallback 或暴露 partial facade | Step 9 config-redline;Step 10 config | S |
| redaction check 发现真实或 dummy raw secret/body 且未阻断 | Step 9/10 redaction | S |
| evidence/report 从静态 JSON 宣告 pass,缺 raw artifact 或 report pairing | Step 9 report-generation-audit | S |

### 8.3 修复后复验矩阵

| 缺陷触发面 | 必跑用例 / suite | 必跑 check | 关闭证据 |
|---|---|---|---|
| contracts DTO / metadata / digest | 原 TC + `contract-domain-fast` | report pairing | suite report + case artifact |
| domain invariant / state / policy | 原 TC + same state family + `contract-domain-fast` | redaction if error output changed | domain suite report |
| command accepted / rejected / UoW | 原 TC + related command family + `service-flow-fast` | report pairing;redaction | service suite report + UoW assertion artifact |
| query no-write / visibility / degraded | 原 TC + all representative query no-write + `service-flow-fast` | write-audit + redaction | write-audit report |
| inbound consumer / worker | 原 TC + consumer duplicate/unsupported/delayed + `entry-worker-job` | redaction | worker suite report |
| outbox / publisher | original outbox TC + `operations-replay-core` | report pairing | outbox publication report |
| operations job / handoff / export | original job TC + duplicate/no truth repair + `operations-replay-core` | redaction;report pairing | job report + marker artifact |
| config / runtime builder | original config TC + `config-redline` | report pairing | config validation report |
| redaction leak | original leak TC + `redaction-boundary` + release redaction check | `check_redaction.sh` | redaction-check.md + raw scan artifact |
| dependency boundary | original dependency TC + `dependency-boundary` + release dependency check | `check_dependency_boundary.sh` | dependency-boundary.md + graph artifact |
| evidence/report integrity | failing report audit + `report-generation-audit` | `check_artifact_report_pairing.sh`;`check_no_static_evidence.sh` | report-audit.md |
| release smoke closure | original scenario + `release-main-smoke` + affected lower suite | release redaction/dependency/report checks | release suite report + gate summary |

### 8.4 风险接受规则

| 项 | 是否可风险接受 | 条件 |
|---|---|---|
| S 级缺陷 | 否 | 必须修复和复验 |
| VF-GOV-001~010 命中 | 否 | 一票否决不可降级 |
| P0 redaction / dependency / evidence integrity | 否 | 安全和证据真实性不可接受 |
| P0 blocking suite failure | 原则上否 | 只有证明是测试脚本缺陷且 P0 语义另有 artifact 证明时,可临时记 A 并必须修脚本 |
| 旧 P95/SLA 候选未达 | 是 | 当前无正式阈值;记录 sample/trend 和 Step 14 风险 |
| P1 selected-run unavailable | 是 | 不计 P0 pass;必须记录 unavailable/residual |
| P2 production-like / capacity / external vendor behavior | 是 | 必须有接受人和后续触发条件 |
| 文档表述或报告可读性问题 | 是 | 不影响 raw artifact、P0 断言和验收引用 |

### 8.5 缺陷关闭证据清单

| 证据 | S 级 | A 级 | B/R 级 |
|---|---|---|---|
| 缺陷记录和影响范围 | 必需 | 必需 | 必需 |
| 失败前 run_id / artifact / report | 必需 | 必需 | 可选,视是否有执行 |
| 修复说明和变更范围 | 必需 | 必需 | 可选 |
| 修复后相关 TC / suite report | 必需 | 必需 | 可选 |
| redaction / dependency / report pairing check | 相关即必需;安全/证据类必需 | 相关即必需 | 可选 |
| 是否新增防回归测试说明 | 必需 | 必需 | 可选 |
| 风险接受人 / 接受理由 | 不允许 | 若接受则必需 | 必需 |
| Step 13 evidence candidate 更新 | 若影响证据则必需 | 若影响证据则必需 | 可选 |

### 8.6 自动化防回归新增规则

| 触发 | 要求 |
|---|---|
| 手工发现 P0 缺陷 | 必须新增 TC 或 suite assertion |
| release smoke 发现但 lower suite 未发现 | 必须把断言下沉到 contract/domain/service/operations suite |
| redaction leak 未被 scanner 捕获 | 必须扩展 redaction deny list / scanner fixture |
| dependency boundary 漏检 | 必须扩展 dependency graph check |
| evidence/report 静态伪造或 pairing 漏检 | 必须扩展 report-generation-audit |
| duplicate / idempotency / UoW 缺陷复发 | 必须新增 fault injection case |
| P1/P2 风险升级为 P0 | 必须先回写测试范围、环境、数据、gate,再新增自动化 |

### 8.7 缺陷停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| S/A/B/R 分级是否可判定 | 通过 | 见 §8.1 |
| 一票否决是否不可降级 | 通过 | 见 §8.2 / §8.4 |
| P0 风险接受边界是否清楚 | 通过 | P0 truth/redaction/dependency/evidence 不可接受 |
| 修复后回归是否可执行 | 通过 | 见 §8.3 |
| 关闭证据是否明确 | 通过 | 见 §8.5 |
| 自动化防回归触发是否明确 | 通过 | 见 §8.6 |

### 8.8 跨缺陷 / 复验审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| VF-GOV-001~010 是否均映射 S 级 | 通过 | §8.2 覆盖 |
| blocking suite failure 是否有分级规则 | 通过 | S 或经证明后 A |
| P1/P2 是否未误阻断 P0 | 通过 | B/R 风险接受规则 |
| 性能候选是否未误判 S/A | 通过 | 无正式阈值时只记录风险 |
| 复验是否覆盖同 family / suite / check | 通过 | §8.3 |
| 缺陷关闭是否需要 artifact/report | 通过 | §8.5 |
| 是否提前固定正式 EV | 通过 | 只要求 evidence candidate 更新,正式 EV 留 Step 13 |

## 9. 对上游设计的影响判定

| 缺陷规则结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| VF 命中均为 S 级 | 否 | 测试管理细化 | 符合 `00` 一票否决 |
| P0 redaction / dependency / evidence integrity 不可风险接受 | 否 | 测试管理细化 | 符合 Step 9 / 10 |
| 旧性能候选未达不算 S/A | 否 | 范围边界 | Step 10 已明确 |
| 若缺陷暴露上游设计无法 1:1 落码 | 是 | 设计闭口缺陷 | 回写 `03/04/05/06/07` 相关文档 |
| 若 P1/P2 被要求纳入 P0 缺陷阻断 | 是 | 测试范围变更 | 回写 Step 2 / 8 / 9 / 10 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_11_defects_retest.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“缺陷分级表”“S 级阻断判定表”“修复后复验矩阵”“风险接受规则”“缺陷关闭证据清单”和“自动化防回归新增规则”小节,了解缺陷如何阻断、复验和关闭。

正式 `05-测试方案.md` §11 应回填:

- 缺陷分为 S、A、B、R 四类。S 级对应一票否决、P0 truth 破坏、安全 / redaction / dependency / evidence integrity 红线,必须修复,不得风险接受。
- A 级为 P0 用例或 blocking suite 风险,通常阻断 release,可在证明不影响 P0 语义且有接受人时临时风险接受。
- B/R 只用于 P1/P2、future、候选性能、文档可读性或范围外风险,不得用于降级 P0 红线。
- 修复后必须回归原失败 TC、同 family TC、相关 suite 和相关 check;安全、dependency、report integrity 必须复跑对应 release check。
- 缺陷关闭必须具备失败前后 run_id、artifact/report、复验 suite report、修复说明和是否新增防回归测试的说明。
- 手工发现 P0 缺陷、release smoke 发现但底层 suite 未覆盖、redaction / dependency / report audit 漏检时,必须新增自动化防回归。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 缺陷系统字段和责任人角色 | 影响实施管理 | 当前不固定;可由实施计划 / 项目流程补充 |
| S 级关闭是否需要人工签字 | 影响验收流程 | Step 13 / 新版 `06` 可继续定义 |
| A 级风险接受审批人 | 影响 release 决策 | 当前要求测试负责人和验收方明确接受人 |
| 性能候选未来硬化后的分级 | 影响 P2 升级 | 当前只作为 R/B 风险,硬化需回写基线 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 缺陷分级可执行 | 通过 | 见 §8.1 |
| 一票否决缺陷不可降级 | 通过 | 见 §8.2 / §8.4 |
| 复验规则说明证据要求 | 通过 | 见 §8.3 / §8.5 |
| 自动化防回归触发明确 | 通过 | 见 §8.6 |
| 可进入 Step 12 | 通过 | 下一步定义进入准则与退出准则;进入前等待用户审查 |
