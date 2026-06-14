# Step 11. 定义缺陷管理与复验规则

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 11
> 回填章节: `05-测试方案.md` §11 缺陷管理与复验规则

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 11 定义缺陷管理与复验规则 |
| 当前状态 | 已写入;待用户审查 |
| 输入基线 | Step 6 用例矩阵;Step 9 自动化门禁;Step 10 专项测试;`00` VETO-ID 一票否决项;`03/04` redline / recovery / config 边界 |
| 输出文件 | `projects/L1-identity/design-calibration/05_test_plan_step_11_defects_retest.md` |
| 正式文档状态 | 本 Step 不修改正式 `05-测试方案.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 12 |

## 2. 本步目标

定义 L1-identity 测试缺陷如何分级、升级、修复、复验和关闭,确保 VETO、P0 blocking suite、redaction、dependency、query no-write、job no-repair 和 evidence integrity 缺陷不会被降级成普通风险。

本 Step 只回答:

- 哪些缺陷属于 S 级阻断。
- 哪些缺陷可以风险接受。
- 修复后必须回归哪些 TC、suite 和 check。
- 缺陷关闭需要哪些证据。
- 什么时候必须新增自动化防回归。

本 Step 不定义缺陷系统字段、工单平台流程、负责人排期、正式 `EV-*` evidence ID、`reports/acceptance` 模板、验收 verdict 或 release sign-off。正式证据归档由 Step 13 固定,进入 / 退出准则由 Step 12 固定。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `00-需求文档.md` §14 | 正式输入 | 提供 AC-ID-001~015 和 VETO-ID-001~006 |
| `05_test_plan_step_02_scope.md` | 已审核通过 | 提供 P0/P1/P2、非范围和残余风险边界 |
| `05_test_plan_step_05_traceability_coverage.md` | 已审核通过 | 提供 NFR / AC / VETO 到测试切口的追溯 |
| `05_test_plan_step_06_cases.md` | 已审核通过 | 提供 `TC-ID-*` 用例、断言和 `EV-CAND-ID-*` 候选证据 |
| `05_test_plan_step_09_automation_gates.md` | 已审核通过 | 提供 P0 blocking suite、artifact/report 输出和 static evidence guard |
| `05_test_plan_step_10_nonfunctional.md` | 已审核通过 | 提供专项红线、故障注入、redaction、dependency、性能 sample 和 fake parity 边界 |
| `03_ddd_step_12_error_recovery.md` | 正式输入 | 提供 duplicate no-rerun、query no-write、manual recovery、forbidden body 和 fake/durable parity |
| `04-配置设计.md` §11 / §12 | 正式输入 | 提供 fail-fast、fail-closed、disabled no fake success、redaction 和 downstream testing handoff |
| `测试方案书写规范.md` §5.11 | 标准输入 | 提供 S / A / B 分级和复验规则要求 |
| `L1-governance` Step 11 calibration | 参考输入 | 只参考缺陷分级和复验矩阵粒度,不复用 governance VETO、TC 或 EV |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些缺陷属于 S 级阻断? | 任一 VETO-ID-001~006 命中、任一 AC-ID-014 零容忍命中、任一 P0 blocking suite 失败且不能证明为测试脚本自身错误、redaction 泄露、非 core sibling compile dependency、query/consumer/job 隐式创建 identity truth、query 写副作用、job 修 business truth、duplicate replay 分叉、accepted mutation 缺 trace/audit/outbox/stored result、release evidence/report 静态伪造或缺 raw artifact/report 配对,均为 S 级阻断。 |
| 哪些缺陷可以风险接受? | 只允许 P1/P2 范围、future real-like selected-run unavailable、旧 P95/SLA 候选数字未达但无正式阈值、真实 product adapter 深度行为、production-like capacity、报告可读性或非阻断维护性问题进入风险接受。P0 truth、VETO、redaction、dependency、config fail-fast、query no-write、job no-repair、stored replay 和 evidence integrity 不允许风险接受。 |
| 修复后必须回归哪些用例? | 至少回归原失败 TC、同 family TC、对应 suite 和相关 release check。涉及 shared contracts/domain/state/UoW/idempotency/redaction/dependency/config/outbox/job/report 的修复必须扩大到 family 或 gate,不能只跑单个失败测试。见 §8.3。 |
| 缺陷关闭需要哪些证据? | 必须有缺陷记录、影响范围、失败前 run_id / artifact / report ref、修复说明、修复后 run_id / artifact / report ref、相关 TC / suite status、redaction/dependency/report pairing 结果、是否新增自动化防回归的说明。S 级关闭必须有对应 blocking suite 通过证据。 |
| 是否需要新增自动化防回归? | 如果缺陷来自未覆盖路径、手工发现、release smoke 发现但底层 suite 未覆盖、redaction 漏扫、dependency boundary 漏扫、report pairing 漏检、query/job write-audit 漏检、duplicate/idempotency/fault injection 漏断言,必须新增或扩展自动化用例 / check。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 6 | 已有 TC,但缺失败后的 defect level 和 retest 规则 | 本 Step 固定 TC family 到复验 suite |
| Step 9 | 已定义 blocking suite,但缺失败关闭和证据规则 | 本 Step 固定 suite failure 分级和关闭证据 |
| Step 10 | 已定义红线和专项,但缺风险接受边界 | 本 Step 明确 VETO/P0/redaction/dependency/evidence 不可风险接受 |
| 旧 `05/06` | 旧缺陷规则不能覆盖新版 evidence、防伪和 P0 suite | 不继承旧规则 |
| 性能 | 旧性能数字可能被误报为阻断缺陷 | 本 Step 明确无正式阈值时只能记 sample/risk,不是 S/A 缺陷 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 缺陷分级 | 只有用例和门禁 | 增加 S/A/B/R 分级 | 支撑 Step 12 exit gate |
| 一票否决处理 | 只在需求和专项中出现 | VETO 命中一律 S 级 | 防止降级 |
| 风险接受 | 未说明哪些能接受 | 限定为 P1/P2/future/candidate | 保护 P0 truth 和 evidence |
| 复验 | 未说明修复后跑哪些 suite | 按触发面映射原 TC、family、suite、check | 避免只跑单测 |
| 自动化新增 | 未说明触发条件 | P0 手工发现或漏检必须补自动化 | 防止复发 |

## 7. 缺陷管理设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| VETO 命中是否可风险接受 | A. 可接受;B. 不可接受 | 采用 B。一票否决不可降级 |
| P0 blocking suite failed 是否都 S 级 | A. 全部 S;B. 先判断影响 | 采用 B。若能证明是测试脚本自身错误且 P0 语义另有 artifact 证明,可为 A;否则 S |
| 旧性能候选未达是否阻断 | A. 阻断;B. 不阻断,记录风险 | 采用 B。无正式阈值来源 |
| 修复后是否只跑失败 case | A. 是;B. 跑失败 case + family + suite/check | 采用 B。P0 缺陷常涉及共享契约 |
| 手工发现 P0 缺陷是否必须自动化 | A. 可手工保留;B. 必须补自动化 | 采用 B。P0 缺陷需要防回归 |

## 8. 结构化中间产物

### 8.1 缺陷分级表

| 级别 | 定义 | 示例 | 处理要求 | 是否阻断 |
|---|---|---|---|---|
| S | 一票否决、P0 truth 破坏、P0 evidence 失真、安全红线或架构红线命中 | VETO-ID-001~006;redaction 泄露;query/job 写 truth;non-core sibling compile dependency;duplicate rerun mutation;static evidence pass | 必须修复;必须复验对应 blocking suite/check;不得风险接受;关闭需附修复后 artifact/report | 是 |
| A | P0 用例失败但未命中 VETO,或 blocking suite 因实现 / 测试工具缺陷无法稳定证明 | 某 accepted flow 少写非关键 report field;operations replay partial count 错;fake fault profile 不稳定但未越过 truth/redaction | 必须修复或由测试负责人和验收方批准临时风险接受;修复后回归相关 suite | 视情况;release 前通常阻断 |
| B | 非 P0、P1/P2 selected-run、文档/报告清晰度、非阻断可维护性问题 | P1 real-like unavailable;候选性能 sample 偏高;report 文案不清但 raw artifact 完整 | 可排期处理或风险接受;不得影响 P0 pass | 否 |
| R | 已确认范围外或未来能力风险 | production-like capacity、真实 HR/IdP behavior、真实 observability backend、复杂组织结构、full event-sourcing-first | 记录残余风险和接受人;不得伪装为已验证 | 否 |

### 8.2 S 级阻断判定表

| 触发条件 | 对应来源 | 判定 |
|---|---|---|
| 成员身份 ref 被复用给另一个成员 | VETO-ID-001 | S |
| query / consumer / callback / job 隐式创建 `GlobalMember` 或 identity truth | VETO-ID-002 | S |
| identity 保存 RoleDefinition、ProjectMember、memory、artifact、conversation、runtime、archive body 或 credential/token/raw secret | VETO-ID-003;NFR-ID-004;AC-ID-014 | S |
| 高风险生命周期缺少治理 / 授权依据仍 accepted | VETO-ID-004 | S |
| reconciliation / maintenance job 修复相邻仓 truth 或 identity business truth | VETO-ID-005 | S |
| 非 `L0-core` sibling business compile dependency 或 truth mixing | VETO-ID-006 | S |
| query 写 truth/idempotency/trace/audit/outbox/projection/reference/report | Step 6 query no-write;Step 10 redline | S |
| job 修 `GlobalMember`、lifecycle、role、career、memory truth | Step 6 job no business truth repair;Step 10 report-only | S |
| duplicate replay 重新执行 mutation 或从 current truth 重算 stored result/receipt/report | Step 6 idempotency;Step 10 consistency | S |
| accepted mutation 缺 trace/audit/outbox/stored result 且 flow 正式要求这些 side effects | Step 6 command/consumer;Step 10 traceability | S |
| invalid config silent fallback、redline false 仍启动或 disabled adapter fake success | Step 8/9/10 config | S |
| redaction check 发现 raw body/secret/full sensitive ref,或失败输出回显 raw value | Step 9/10 redaction | S |
| dependency boundary check 发现 forbidden compile dependency | Step 9 dependency-boundary | S |
| evidence/report 从静态 JSON 宣告 pass,缺 raw artifact 或 report pairing | Step 9 report-generation-audit | S |

### 8.3 修复后复验矩阵

| 缺陷触发面 | 必跑用例 / suite | 必跑 check | 关闭证据 |
|---|---|---|---|
| contracts DTO / metadata / schema version / body-free | 原 TC + `TC-ID-CONTRACT-*` family + `contract-domain-fast` | report pairing;redaction if body/output changed | suite report + case artifact |
| domain invariant / state / policy | 原 TC + same state/domain family + `contract-domain-fast` | redaction if error output changed | domain suite report |
| command accepted / rejected / UoW / outbox enqueue | 原 TC + related command family + `service-flow-fast` | report pairing;redaction | service suite report + UoW assertion artifact |
| query no-write / visibility / degraded | 原 TC + all representative query no-write + `service-flow-fast` | write-audit;redaction | write-audit report + query suite report |
| inbound consumer / callback | 原 TC + consumer duplicate/unsupported/delayed family + `entry-worker-job` | redaction | worker suite report |
| outbound material / publisher | original outbox TC + `operations-replay-core` | report pairing;redaction if payload shape changed | outbox publication report |
| operations job / handoff / reconciliation | original job TC + duplicate/no truth repair + `operations-replay-core` | redaction;report pairing | job report + marker artifact |
| idempotency / commit unknown / rollback / stored missing | original idempotency TC + `infra-runtime-fake` + affected service/job suite | report pairing | idempotency/fault artifact |
| config / runtime builder / disabled adapter | original config TC + `config-redline` | report pairing | config validation report |
| redaction leak | original leak TC + `redaction-boundary` + release redaction check | `check_redaction.sh` | redaction-check.md + raw scan artifact |
| dependency boundary | original dependency TC + `dependency-boundary` + release dependency check | `check_dependency_boundary.sh` | dependency-boundary.md + graph artifact |
| evidence/report integrity | failing report audit + `report-generation-audit` | `check_artifact_report_pairing.sh`;`check_no_static_evidence.sh` | report-audit.md |
| release smoke closure | original scenario + `release-main-smoke` + affected lower suite | release redaction/dependency/report checks | release suite report + gate summary |
| performance sample missing | affected suite + `release-main-smoke` or operations suite | report pairing | duration/count sample in run report |

### 8.4 风险接受规则

| 项 | 是否可风险接受 | 条件 |
|---|---|---|
| S 级缺陷 | 否 | 必须修复和复验 |
| VETO-ID-001~006 命中 | 否 | 一票否决不可降级 |
| AC-ID-014 zero tolerance 命中 | 否 | body/secret/query-create/ref-reuse 均不可接受 |
| P0 redaction / dependency / evidence integrity | 否 | 安全、架构和证据真实性不可接受 |
| P0 blocking suite failure | 原则上否 | 只有证明是测试脚本缺陷且 P0 语义另有 artifact 证明时,可临时记 A 并必须修脚本 |
| config fail-fast / disabled no fake success 失败 | 否 | 会伪造 runtime readiness |
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
| query no-write 或 job no-repair 漏检 | 必须扩展 write-audit helper / suite assertion |
| duplicate / idempotency / UoW 缺陷复发 | 必须新增 fault injection case |
| fake / controlled parity 缺陷 | 必须新增 fake/controlled 同构断言 |
| P1/P2 风险升级为 P0 | 必须先回写测试范围、环境、数据、gate,再新增自动化 |

### 8.7 缺陷停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| S/A/B/R 分级是否可判定 | 通过 | 见 §8.1 |
| 一票否决是否不可降级 | 通过 | 见 §8.2 / §8.4 |
| P0 风险接受边界是否清楚 | 通过 | P0 truth/redaction/dependency/evidence/config 不可接受 |
| 修复后回归是否可执行 | 通过 | 见 §8.3 |
| 关闭证据是否明确 | 通过 | 见 §8.5 |
| 自动化防回归触发是否明确 | 通过 | 见 §8.6 |

### 8.8 跨缺陷 / 复验审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| VETO-ID-001~006 是否均映射 S 级 | 通过 | §8.2 覆盖 |
| AC-ID-014 是否不可风险接受 | 通过 | §8.2 / §8.4 覆盖 |
| blocking suite failure 是否有分级规则 | 通过 | S 或经证明后 A |
| P1/P2 是否未误阻断 P0 | 通过 | B/R 风险接受规则 |
| 性能候选是否未误判 S/A | 通过 | 无正式阈值时只记录风险 |
| 复验是否覆盖原 TC / family / suite / check | 通过 | §8.3 |
| 缺陷关闭是否需要 artifact/report | 通过 | §8.5 |
| 是否提前固定正式 EV | 通过 | 只要求 evidence candidate 更新,正式 EV 留 Step 13 |
| 是否提前编辑正式 `05-测试方案.md` | 通过 | 本 Step 只写 `design-calibration` |

## 9. 对上游设计的影响判定

| 缺陷规则结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| VETO 命中均为 S 级 | 否 | 测试管理细化 | 符合 `00` 一票否决 |
| P0 redaction / dependency / evidence integrity 不可风险接受 | 否 | 测试管理细化 | 符合 Step 9 / 10 |
| 旧性能候选未达不算 S/A | 否 | 范围边界 | Step 10 已明确 |
| P0 手工缺陷必须补自动化 | 否 | 测试方案细化 | 支撑 Step 9 gate |
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
- 手工发现 P0 缺陷、release smoke 发现但底层 suite 未覆盖、redaction / dependency / report audit / write-audit 漏检时,必须新增自动化防回归。

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
| 正式 `05` 未提前改写 | 通过 | 本 Step 只写 `design-calibration` 中间产物 |
| 可进入 Step 12 | 待用户确认 | 用户审核通过后进入 Step 12: 定义进入准则与退出准则 |
