# L2-tools 05 测试方案 · Step 14 回归策略与残余风险

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 14「定义回归策略与残余风险」
>
> 目标回填：`projects/L2-tools/05-测试方案.md` §14
>
> 直接输入：`05_test_plan_step_05_traceability_coverage.md`、`05_test_plan_step_06_cases.md`、
> `05_test_plan_step_08_environment_config.md`、`05_test_plan_step_09_automation_gates.md`、
> `05_test_plan_step_10_nonfunctional.md`、`05_test_plan_step_11_defects_retest.md`、
> `05_test_plan_step_12_entry_exit.md`、`05_test_plan_step_13_evidence.md`。

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | 14 / 定义回归策略与残余风险 |
| 状态 | `accepted_for_step_14 / proceed_to_step_15` |
| 当前模块 | `regression_strategy_and_residual_risks` |
| 本步结论 | 已固定 L2-tools 变更类型到最小回归套件、P0 全量回归集合、S 级触发、P1/P2/future residual、06 交接项和 Step 13 证据承接；未创建真实 run、artifact、report、evidence alias 或风险签署。 |
| 正式文档写入 | 未允许；正式 `05-测试方案.md` 仍锁定至 Step 15。 |
| 下一步 | Step 15：整理正式测试方案文档。 |

### 1.1 Step 内计划

- [x] 读取 Step 5~13 的追溯、用例、环境、suite、专项、缺陷、准则和证据规则。
- [x] 按 L2-tools 的契约、状态、事务、配置、边界和证据变更类型建立最小回归矩阵。
- [x] 固定共享契约/安全/证据变更触发的 P0 全量回归集合。
- [x] 规定 S 级触发、复验扩展和不得风险接受的条件。
- [x] 识别 `RULE`、`DATA`、`NFR-*` 主题标签与 Step 6 具体 TC 身份的差异，并给出不新增编号的归属规则。
- [x] 把未闭上游和无 authority 项转成 residual、owner/trigger、缓解和 06 交接项。
- [x] 完成跨回归、残余风险、证据和真实性审计。

## 2. 本步输入与 SOP 问题回答

| 输入 | 直接用途 | 当前状态 |
|---|---|---|
| Step 5 双向追溯 | 需求/规则/设计主题到 TC/EV 方向 | accepted intermediate |
| Step 6 具体用例矩阵 | 稳定 TC family、断言、phase 和数据前置 | accepted intermediate |
| Step 8 环境/profile | 回归 profile、依赖类型和 unavailable 行为 | accepted intermediate |
| Step 9 suite/gate | 主 suite、blocking level、脚本和 check | accepted intermediate |
| Step 10 专项验证 | redaction、unknown、pair、no-write、性能 sample | accepted intermediate |
| Step 11 缺陷复验 | S/A/B/R、复验范围和风险接受边界 | accepted intermediate |
| Step 12 进入/退出 | P0 denominator、暂停和阻断条件 | accepted intermediate |
| Step 13 证据归档 | run-scoped artifact/report/evidence 派生 | accepted intermediate |
| 当前正式 `00~04` | 需求、架构、概要、详细、配置 oracle | current formal |

| SOP 问题 | 回答 | 依据 |
|---|---|---|
| 哪些变更触发最小回归？ | 由变更触及的正式对象、协议、状态、Store/UoW、Port、配置域、观测面或证据生成器决定；最小集合必须包含拥有该 oracle 的主 suite，并加入相邻边界 check。 | `03` §5~§15、`04` §9~§12、Step 9/11 |
| 哪些变更触发全量回归？ | 共享 contracts、公共 carrier/error、状态/phase、事务/幂等/并发、redaction/dependency/config safety、artifact/report/evidence derivation、跨模块 facade 或无法证明影响局部性的变更。 | `00` VF、`03` §10~§14、Step 10/13 |
| 哪些风险暂不覆盖？ | 开放 provider positive、Sandbox receipt/cleanup/DLQ、Observability route/readiness、SDK client、production-like、容量/数字阈值、retention 和未冻结 source baseline。 | `L2T-UP-001~009`、Step 8/10/13 |
| 谁接受残余风险？ | 当前只记录 owner role 和待确认接受人；不填姓名、不伪造签署。P0/VF/S 级不得接受。 | Step 11、06 尚未重建 |
| 哪些必须转入 06？ | P0/VF 逐项裁决、evidence eligibility、full denominator、blocker/residual disposition、S/A 关闭证据、任何 readiness/签署规则。 | Step 12/13、验收标准 SOP |

## 3. 当前文档问题诊断

| 材料/位置 | 诊断 | 本 Step 处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 只有摘要级回归语句、旧状态/阈值和静态结果路径 | `historical_material`；不继承旧触发、数字或结果 |
| Step 5 与 Step 6 | Step 5 初稿曾把 `RULE/DATA/NFR/CORE` theme 写成 TC-like 候选；Step 6 的稳定身份表只落成 concrete family | 不新增、不删除 TC；明确主题标签是 derived coverage/evidence grouping，并已反向回校 Step 5；正式用例只引用 Step 6 具体 TC |
| Step 9 | suite 已有主 owner，但未给出“某类变更最小回归” | 建立变更类型到 suite/check 的矩阵 |
| Step 11 | 已有缺陷复验范围，但未规定共享契约变更的全量触发 | 增加全量触发和 S 级强制规则 |
| Step 13 | evidence slot 已定义，但 residual 如何影响 eligibility 未集中说明 | 将 evidence handoff、ineligible 和 reopen 条件纳入本 Step |
| `L2T-UP-001~009` | 不能在回归策略中被当作已完成的 provider/readiness | 按 blocker/residual 记录 owner、trigger、缓解和 06 交接 |

## 4. TC 身份与主题标签校准

### 4.1 稳定 TC 身份的唯一来源

Step 6 是具体测试用例身份的唯一来源。本轮正式方案只允许下列 concrete family 及其已列序号：

| Concrete family | 计划数量 | 主要 oracle |
|---|---:|---|
| `FOUNDATION` | 18 | typed ref、metadata、carrier、body-free、projection/error 基础边界 |
| `CONTRACT` | 8 | `CF-01~04`、合同演进、current/history、terminal/late material |
| `BIND` | 8 | `CF-05~07`、Hub snapshot/assessment/gap、CAS 和无本地 registry |
| `INV` | 8 | `CF-08`、受理、carrier parity、no-execution、duplicate |
| `PRE` | 10 | `CF-09~10`、authorization/sandbox requirement、Prepared/unknown |
| `OUTCOME` | 10 | `CF-11`、normalized outcome、source assessment、终态和 pair |
| `HANDOFF` | 8 | `CF-12`、safe handoff 四门、attempt/status 独立性 |
| `QUERY` | 11 | `QF-01~11`、zero-write/zero-refresh/zero-external-Port |
| `CONSUMER` | 5 | `IF-01~05`、claim/receipt/dedup/source/version |
| `CONT` | 4 | `OF-01~04`、one-call、phase-2 disposition、unknown |
| `JOB` | 4 | `JF-01~04`、bounded scope、partial report、no-repair |
| `STATE` | 12 | 六状态族合法迁移、terminal guard、late material |
| `TX` | 10 | UoW、CAS、append、pair atomicity、commit outcome |
| `CONC` | 23 | race、replay、semantic uniqueness、watermark、re-entry |
| `ERR` | 12 | typed error、mapping、unknown/blocked/unavailable/recovery |
| `CFG` | 7 | 03 配置/构造切口 |
| `CFG-T` / `CFG-A` / `CFG-F` / `CFG-X` | 12 / 10 / 20 / 12 | 04 strict parse、acceptance、failure、cross-field gates |
| `OBS` | 9 | TraceContext、low cardinality、audit/status separation、redaction |
| `VETO` | 13 | `VF-L2T-001~013` 与静态禁止边界 |

### 4.2 主题标签不产生第二套 TC

Step 5 中的 `RULE`、`DATA`、`NFR-AVAIL`、`NFR-SEC`、`NFR-AUDIT`、`NFR-CONS`、`NFR-OBS`、`CORE`、`BOUNDARY`、`REDACTION` 是覆盖查询和 planned EV 的主题标签，不是另一个可执行用例命名空间。映射规则如下：

| 主题标签 | 由 concrete TC 派生 | 典型主 suite | 规则 |
|---|---|---|---|
| `CORE` | `CONTRACT`、`BIND`、`INV`、`PRE`、`OUTCOME`、`HANDOFF` 的代表 TC | `local-closure` | 只聚合既有结果，不新增 derived theme TC namespace |
| `RULE` / `BOUNDARY` | `FOUNDATION`、`CONTRACT`、`BIND`、`INV`、`PRE`、`STATE`、`CFG-*`、`VETO` | `static-boundary`、`contract-domain`、`config-validator` | 每条规则必须列具体 `tc_ref`；主题名不能作为 full-denominator case |
| `DATA` / `REDACTION` | `FOUNDATION`、`CONTRACT`、`PRE`、`OUTCOME`、`HANDOFF`、`QUERY`、`CFG-*`、`OBS`、`VETO` | `contract-domain`、`observability-redaction` | 只引用 field/ref/body/redaction 断言的具体 TC |
| `NFR-AVAIL` | `PRE`、`OUTCOME`、`HANDOFF`、`CONSUMER`、`CONT`、`JOB`、`ERR`、`OBS` | `application-core`、`controlled-seam`、`local-closure` | 只验证结构性隔离和可解释失败，不产生数字通过 |
| `NFR-SEC` | `FOUNDATION`、`PRE`、`HANDOFF`、`CFG-*`、`OBS`、`VETO` | `static-boundary`、`observability-redaction` | forbidden/self-auth/no-bypass 由具体 TC 断言 |
| `NFR-AUDIT` | `OUTCOME`、`HANDOFF`、`CONSUMER`、`CONT`、`OBS` | `application-core`、`entry-worker-job`、`observability-redaction` | identity→outcome/audit/handoff 回链由具体 TC 产生 |
| `NFR-CONS` | `CONTRACT`、`BIND`、`INV`、`OUTCOME`、`HANDOFF`、`STATE`、`TX`、`CONC`、`ERR` | `transaction-concurrency`、`application-core` | duplicate/CAS/pair/unknown/late material 由具体 TC 产生 |
| `NFR-OBS` | `FOUNDATION`、`OUTCOME`、`HANDOFF`、`QUERY`、`CONSUMER`、`JOB`、`OBS`、`VETO` | `observability-redaction`、`query-purity` | 只保留安全字段、低基数和状态独立性 |

这项校准不改变 Step 6 的任何 `TC-L2T-*` 身份，也不把 Step 5 的主题候选宣称为已执行。Step 15 正文应在 §5 使用主题标签做覆盖检索，在 §6 只列 concrete TC。

## 5. L2-tools 变更类型到最小回归矩阵

| 变更类型 | 变更示例/边界 | 最小回归 suite | 必要 check / 断言 | 全量触发条件 | 责任 owner role |
|---|---|---|---|---|---|
| 公共 typed ref、metadata、carrier、ProtocolError | `contracts` 字段、kind、version、body-free carrier、error mapping | `static-boundary`、`contract-domain`、`application-core` | case manifest、redaction、FOUNDATION roundtrip、unknown variant、zero write | public carrier 被多模块消费、字段/enum删除或错误语义改变 | contracts + application |
| 合同 identity/definition/evolution | `CF-01~04`、current pointer、terminal/late material | `contract-domain`、`application-core` | duplicate/digest、state transition、CAS、history immutable | identity/ref/status/schema/UoW 改动或影响 `CONTRACT`/`STATE` 共享 helper | domain + application |
| Binding/Hub seam | snapshot、assessment、gap、replacement/invalidation、Hub Port | `application-core`、`controlled-seam` | blocker truth、no-local-registry、CAS、source separation | binding carrier、PortResolution、visibility/authorization boundary或 IF/JF 映射改变 | binding + integration |
| Invocation/admission | `CF-08`、canonical frame、caller/carrier parity、duplicate admission | `contract-domain`、`application-core`、`query-purity` | no-execution、outcome/audit pair、metadata/digest、no external Port | invocation schema、admission status、idempotency scope、carrier/API改变 | invocation + application |
| Authorization/precondition | `CF-09`、auth source、requirement combination、fail-closed | `application-core`、`controlled-seam`、`static-boundary` | no default allow、source status、phase fence、redaction | taxonomy/source/owner、effective decision mapping或 config safety改变 | precondition + dependency owner |
| Sandbox/handoff/side effect | `CF-10`、`CF-12`、`OF-01~04`、one-call | `application-core`、`controlled-seam`、`transaction-concurrency` | Prepared-before-call、one call、unknown/manual、safe handoff four gates | Port method/timeout/retry/phase/attempt/status/evidence mapping改变 | handoff + infra |
| Outcome/audit normalization | `CF-11`、`ToolInvocationOutcome`、`ToolAuditEntry`、source assessment | `application-core`、`transaction-concurrency`、`observability-redaction` | same-UoW pair、result/error XOR、local truth first、redaction | outcome/audit schema、terminal status、late material、store/UoW改变 | outcome + audit |
| Query/projection/read mapper | `QF-01~11`、projection status、visibility | `query-purity`、`contract-domain` | zero-write、zero-refresh、zero-Port、NotVisible/Unavailable distinction | query DTO、mapper、projection lifecycle或 visibility semantics改变 | query + projection |
| Consumer/continuation/event | `IF-01~05`、`OF-01~04`、receipt/attempt/status | `entry-worker-job`、`transaction-concurrency`、`controlled-seam` | dedup、source/version、IF-03-only re-entry、no second side effect | envelope schema、claim/receipt/route/status or event collaboration changes | worker + integration |
| Job/bounded operation | `JF-01~04`、cursor/watermark、partial report | `entry-worker-job`、`query-purity`、`transaction-concurrency` | boundedness、no-repair、per-target disposition、replay | job input/scope/limit, projection/write boundary or report schema changes | jobs + application |
| Store/UoW/CAS/idempotency/replay | seven Store surfaces、one UoW、append/CAS/page/watermark | `transaction-concurrency`、`application-core`、`contract-domain` | pair atomicity、stale CAS、same/different digest、commit/call unknown | shared persistence trait, isolation, replay key or transaction order changes | infra + application |
| Config schema/source/profile | 04 root/item、D/F/E/R/X/L、V0~V8 | `config-validator`、`config-assembly`、`static-boundary` | strict parse、invalid-high no fallback、profile isolation、no-output | any root/item/source/profile/feature or cross-field gate changes | config + release |
| Runtime builder/activation | B0~B8、partial graph、feature registration | `config-assembly`、`application-core`、`entry-worker-job` | fail-fast、dispose prefix、single bundle、no partial entry | builder stage/order, capability registry or enabled event set changes | config + application |
| Observability/audit/redaction | logs/metrics/traces, safe material, labels | `observability-redaction`、`static-boundary` | forbidden scan、low cardinality、TraceContext、status separation | any output carrier, logger/metric key, audit field or redaction rule changes | observability + security |
| Dependency/package/public boundary | Cargo/package/import path、sibling references、historical scans | `static-boundary`、`contract-domain` | Core-only compile dependency、no sibling truth, no static evidence | dependency graph, workspace layout, public module export or external owner boundary changes | architecture + implementation |
| Test runner/report/evidence generator | suite manifest、check/report script、EV derivation | affected suite + `static-boundary`、`observability-redaction` | full denominator、pairing、no-static-evidence、redaction | artifact schema, path, derivation tuple, report generator or check logic changes | test infrastructure |
| Upstream blocker closure | Hub/Auth/Sandbox/Obs/Bus/Core/SDK owner closes a contract | negative P0 family + `controlled-seam`; then conditional suite | blocker truth, source/version/mapping parity, no readiness inference | only after owner closure and 06/profile gate explicitly promote scope | owning upstream + L2 integration |

### 5.1 最小回归的共同规则

1. 最小回归必须包含变更直接拥有的主 suite、同一状态/错误/证据边界的负向 case，以及相关 mandatory check。
2. 任何 `unknown`、`blocked_dependency`、`unavailable`、`not_evaluated` 或 `invalid_artifact` 都保留原状态；不能通过重跑或筛选变成 `passed`。
3. 若变更影响多个 concrete family，按并集执行，不以主题标签或 suite 名替代 case manifest。
4. 组合 suite 只能复用下层 oracle；不得以 cross-module smoke 的结果覆盖低层失败。
5. 新 run 必须使用新的固定 `run_id`，旧 artifact/report 不可覆写或择优拼接。

## 6. P0 全量回归集合

### 6.1 触发条件

以下任一条件成立时，必须执行 P0 全量回归，而不是局部最小回归：

- `contracts` 公共字段、typed ref、协议 version/variant、公共错误或 shared carrier 改变。
- 任一六状态族、terminal guard、phase fence、`ToolInvocationOutcome`/`ToolAuditEntry` pair、UoW/CAS/idempotency/replay 规则改变。
- 任何 `NC-L2T-*`、`VF-L2T-*`、redaction、dependency、profile isolation、no-write/no-repair 或 blocker-truth 规则改变。
- 配置 root/item、source priority、profile、V0~V8/B0~B8、cross-field gate 或 safe output floor 改变。
- 跨 `contracts`/`domain`/`application`/`infra`/`api`/`worker`/`jobs` 的公共 facade、Store、Port 或 entry 变更，且不能证明影响局部。
- suite/check/report/evidence schema、artifact/report pairing 或 evidence derivation 逻辑改变。
- S 级缺陷修复、P0 A 级缺陷修复，或同类缺陷连续复发。
- workspace/source baseline、依赖图或实现仓布局改变，导致既有 provenance 不可比较。

### 6.2 全量 suite 与 concrete denominator

P0 全量回归的 suite 集合为：

| Suite | concrete TC denominator | 共同断言 |
|---|---|---|
| `static-boundary` | `TC-L2T-VETO-001~013`；依赖/历史/静态边界引用 | `VF-L2T-001~013`、Core-only compile、无静态 evidence |
| `contract-domain` | `FOUNDATION-001~018`、`STATE-001~012`、`CFG-001~007` 的对应纯分支 | typed fields、state、error、redaction predicate |
| `application-core` | `CONTRACT-001~008`、`BIND-001~008`、`INV-001~008`、`PRE-001~010`、`OUTCOME-001~010`、`HANDOFF-001~008` | flow order、UoW、pair、no-execution、phase/unknown |
| `query-purity` | `QUERY-001~011` | zero-write、zero-refresh、zero-external-Port |
| `entry-worker-job` | `CONSUMER-001~005`、`CONT-001~004`、`JOB-001~004` | envelope/claim/receipt、boundedness、no-repair |
| `transaction-concurrency` | `TX-001~010`、`CONC-001~023`、`ERR-001~012` | CAS、replay、race、unknown、typed recovery |
| `config-validator` | `CFG-T-001~012`、`CFG-A-001~010`、assigned `CFG-F-*`/`CFG-X-*` | strict parse/source/profile/cross-field/redline |
| `config-assembly` | remaining `CFG-F-001~020`、`CFG-X-001~012` and builder branches | B0~B8 atomic activation/no partial graph |
| `observability-redaction` | `OBS-001~009` plus all concrete families' output-surface scans | safe fields、low cardinality、forbidden corpus、status separation |
| `local-closure` | selected concrete references from all above suites, not a new denominator | five `C-L2T-*` nodes、local truth first、safe handoff |
| `controlled-seam` | relevant concrete seam cases only; external positive may be `blocked_dependency` | mapping/parity、blocked/unavailable/unknown、no host/direct fallback |

`conditional-provider`、`release-local-smoke` 都不创建 P0 semantic denominator。前者只有在 Step 12 条件、上游 blocker 和新版 06 闭口后才启用；后者是每个 release run 必需的 same-run aggregate，只复用 11 个 P0 owning suite 的 case 并验证报告门禁。P0 全量回归仍要求所有 blocking suite 和 mandatory checks 有明确 status；provider 未启用不删减 P0 case，smoke 缺失则 release 阻断。

### 6.3 P0 mandatory checks

每次 P0 全量回归必须运行并保留适用结果：

```text
check_case_manifest.sh
check_dependency_boundary.sh
check_profile_isolation.sh
check_query_no_write.sh
check_job_boundedness.sh
check_phase_unknown_fence.sh
check_outcome_audit_pair.sh
check_redaction_boundary.sh
check_blocker_truth.sh
check_artifact_report_pairing.sh
check_no_static_evidence.sh
```

具体输出仍遵守 Step 9/13 的 `artifacts/test/<run_id>/` 与 `reports/runs/<run_id>/` 规则；当前没有实际脚本或执行结果。

## 7. S 级缺陷触发与复验规则

### 7.1 直接 S 级触发

以下情况直接创建 S 级阻断，不允许以 A/B/R 或 residual 接受：

| S 级触发 | 最低证据/断言 | 复验集合 |
|---|---|---|
| 任一 `VF-L2T-001~013` 命中 | 对应 concrete `VETO` case、静态/运行 check、safe finding | 原 VETO case、同边界 family、`static-boundary`、相关 check |
| Tool identity/definition/binding truth 被 capability、provider、visibility、local registry 或 SDK 替代 | `CONTRACT`/`BIND`/`FOUNDATION` formal oracle | 原 case、同 family positive/negative/duplicate、`contract-domain`、`application-core` |
| authorization self-auth、missing fail-open、Sandbox host/direct fallback | `PRE`/`HANDOFF` no-execution/blocked oracle | 原 case、`PRE`/`OUTCOME`/`HANDOFF` family、`controlled-seam`、phase check |
| raw body/secret/provider capture 或 full sensitive ref 泄露 | `FOUNDATION`/`OBS`/`CFG` redaction scan | 原 case、所有输出载体、`observability-redaction`、redaction check |
| Query 写、Job repair、Bus/Obs/Runtime 反写 local truth | `QUERY`/`JOB`/`OBS` effect journal | 原 case、相邻 query/job/consumer、`query-purity`、`entry-worker-job` |
| outcome/audit 半对、terminal/late material 覆盖历史 | `OUTCOME`/`HANDOFF`/`TX` UoW projection | 原 case、pair/late/terminal family、`application-core`、pair check |
| one-call/unknown 被自动重调或误判 known | `PRE`/`HANDOFF`/`CONT`/`TX` journal | 原 case、same/different digest、unknown/replay family、phase check |
| sibling compile dependency、static evidence、health marker 或 open blocker 被写成 ready/pass | `VETO`/dependency/blocker/evidence checks | 原 case、全部静态边界和证据 checks、`static-boundary`、`local-closure` |
| config invalid-high fallback、partial graph、unsafe override | `CFG-F/X`、builder和redline oracle | 原 case、同 config domain、`config-validator`、`config-assembly`、profile check |

### 7.2 S 级复验纪律

- 修复后必须新建固定 run；原失败 run 保持原 status，不被改写。
- 至少执行原失败 TC、同 concrete family 的正向/负向/duplicate 或 no-write 代表、受影响主 suite 和对应 mandatory checks。
- 若 S 级触发涉及共享契约、状态、UoW、配置安全或 evidence schema，升级为 §6 P0 全量回归。
- unknown、blocked、unavailable、not_evaluated 和 invalid artifact 不构成关闭证据；它们必须保持原分类并进入 blocker/residual。
- 设计期不创建缺陷 ID、run_id、artifact digest、签署或 accepted 结论。

## 8. P1/P2/future residual 风险表

| Risk ID | 未闭风险/未覆盖范围 | 影响 | 当前状态 | 缓解/当前测试 | owner role | 重开/升级触发 | 06 交接 |
|---|---|---|---|---|---|---|---|
| `L2T-RR-001` | `L2T-UP-001` authorization owner/source 未闭 | positive governed allow、decision freshness | `blocked_dependency` | missing/stale/conflict/unverifiable fail-closed；P0 negative | authorization/Sandbox owner | owner、schema和freshness正式闭口 | 必须列入 blocker disposition |
| `L2T-RR-002` | `L2T-UP-002` authorization taxonomy/schema 未闭 | high-risk/requirement positive mapping | `blocked_dependency` | typed requirement、deny/no-execution | authorization owner | taxonomy/version/source matrix可引用 | 必须列为 conditional gate |
| `L2T-RR-003` | `L2T-UP-003` Sandbox generic mapping 未闭 | ToolInvocation 到 execution mapping | `blocked_dependency` | no-host、mapping blocked、Prepared/unknown | Sandbox + L2 integration | mapping/Port/receipt schema闭合 | 不得写 Sandbox ready |
| `L2T-RR-004` | `L2T-UP-004` receipt/cleanup/DLQ/feedback 未闭 | positive recovery/continuation | `blocked_dependency` | local attempt/status independent、unknown/manual | Sandbox owner | receipt/cleanup/DLQ owner确认 | 交接为 unavailable/blocked |
| `L2T-RR-005` | `L2T-UP-005` Observability producer/source 未闭 | external observation provenance | `blocked_dependency` | safe sink、status gap、local truth first | Observability owner | producer/source family和schema闭合 | 不得生成 Observed |
| `L2T-RR-006` | `L2T-UP-006` route/status/formal chain冲突 | Bus/Obs positive delivery/readiness | `blocked_dependency` | body-free handoff、independent status | Bus/Observability owner | route/status formal chain统一 | 06 需单列冲突 |
| `L2T-RR-007` | `L2T-UP-007` workspace immutable baseline 未冻结 | reproducibility、source provenance | `unverifiable` | 记录 uncommitted/not_available source marker | workspace/release owner | immutable baseline/ref冻结 | 不得填 source commit |
| `L2T-RR-008` | `L2T-UP-008` Core tools-specific schema/package authority 未闭 | compile-time shared contract | `candidate_only` | 只引用 shared category、禁止私造 schema | L0-core owner | formal package/type authority | 06 记录 dependency pending |
| `L2T-RR-009` | `L2T-UP-009` SDK tools client seam 未闭 | downstream client integration | `future` | server carrier/fake seam only | L0-sdk owner | tools-specific client contract | 不作为当前验收项 |
| `L2T-RR-010` | measurement authority、负载模型和数字阈值未闭 | P95/P99/QPS/SLA/容量验收 | `unverifiable` | provenance-complete duration/count sample；correctness-first | performance/acceptance owner | formal metric registry/threshold | 06 只能收结构性证据 |
| `L2T-RR-011` | durable Store/UoW/sidecar capability未选 | real-like parity、容量和持久恢复 | `conditional` | deterministic fake/controlled candidate、P0 local contract | storage/implementation owner | capability metadata和profile闭合 | 作为 release residual |
| `L2T-RR-012` | target implementation repo、runner/framework和entry命令未冻结 | 实际执行可重复性 | `not_available` | 只固定 suite/script/CLI 外层契约 | implementation/test owner | repo manifest、runner和命令可定位 | 不得伪造执行结果 |
| `L2T-RR-013` | evidence retention/介质/删除责任未定 | 长期归档和复验可追溯 | `pending` | 至少保留至验收、复验和 residual review 结束 | acceptance/ops owner | retention policy正式化 | 06/运维承接 |
| `L2T-RR-014` | staging/production-like qualification未定义 | deployment/readiness | `inactive` | 不创建环境、不计P0分母 | release/ops owner | profile、source、owner、measurement闭合 | 不得声明 readiness |
| `L2T-RR-015` | Step 5 主题标签与具体 TC 的历史文字差异 | 覆盖审计误把标签当用例 | `reconciled` | §4.2 derived mapping；正式§6只用concrete TC | test design owner | 新增TC必须先更新Step5/6/9 | 06消费 concrete refs |
| `L2T-RR-016` | 06 evidence/签署/风险接受 authority尚未重建 | 最终 verdict、签署和 eligible规则 | `blocked_by_06` | candidate EV、draft handoff、无签署 | acceptance owner | 06正式文档闭口 | 必须回填Step13/14 |

Residual 不是当前测试通过，也不是缺陷关闭。每条 residual 都必须有 owner role、重开触发和后续文档落点；没有接受人或触发条件的项目保持 `blocked`/`unverifiable`，不能写成已接受。

## 9. 必须转入新版 06 的事项

| 交接项 | 05 提供的输入 | 06 必须裁决 | 当前状态 |
|---|---|---|---|
| P0 full denominator | concrete TC family、suite registry、mandatory checks | 哪些 suite/case 是 release/acceptance hard gate | planned only |
| `VF-L2T-001~013` | VETO case、S 级规则和 redline checks | 逐项 veto pass/fail/blocked 裁决 | 未执行 |
| Evidence eligibility | Step 13 candidate slot、run/artifact/report 派生条件 | eligible 是否可进入验收、缺失如何否决 | 未生成实例 |
| Blocker disposition | `L2T-UP-001~009` 与 `L2T-RR-*` | blocked、conditional、deferred 的正式接受边界 | open |
| S/A defect closure | 原 case/family/suite/check 复验矩阵 | 缺陷是否关闭、是否允许 release | 未创建缺陷事实 |
| Structural NFR | no-write、no-repair、unknown、pair、redaction、local truth first | 结构性验收是否满足 | 计划中 |
| Performance/capacity | provenance-complete samples、无数字阈值 | 指标 authority、阈值、样本有效性 | unverifiable |
| Profile/readiness | local/CI/integration-like 与 conditional profiles | 是否允许 staging/production-like/readiness 声明 | inactive |
| Evidence retention/signoff | raw/report路径、draft handoff、审查职责 | retention、签署角色、风险接受记录 | 待 06/运维 |

## 10. Step 13 证据归档承接

回归执行必须沿用 Step 13 的 run-scoped 元组和路径：

```text
(run_id, candidate_evidence_slot, suite, tc_ref, artifact_digest)
```

| 回归材料 | 规则 |
|---|---|
| 失败前后 run | 使用不同固定 `run_id`；旧 artifact/report 只读保留，不覆盖 |
| candidate EV | 只作为 slot；由同一 run raw case/suite/check/report 派生实例 |
| 复验报告 | `reports/runs/<run_id>/`；必须关联原失败 run、修复 run、TC、suite和check |
| 交接草稿 | `reports/acceptance/`；只写 draft/review_required，不写 verdict/signoff |
| 失败/blocked材料 | 保留安全上下文、failure reason、status和redaction结果；不可删除以制造 full pass |
| evidence index | 只能从 raw artifact/report 推导；pairing、redaction、blocker-truth或no-static check失败即 `invalid`/`ineligible` |

回归策略不产生真实证据、别名、签署或 readiness；任何 future run 的 eligible 仍需新版 06 裁决。

## 11. 回归触发图

#### 回归触发图: L2-tools 变更到回归门禁

```text
[change classification]
        |
        +--> local object / one flow
        |       -> owning suite + adjacent negative/checks
        |
        +--> shared contract / state / UoW / config / redline
        |       -> all P0 suites + mandatory checks
        |
        +--> report/evidence/check implementation
        |       -> affected suites + static/redaction/pairing/no-static checks
        |
        +--> upstream owner closure
                -> negative P0 regression
                   + conditional seam suite only after gate
```

关键说明：

- 图表达变更分类到测试范围的选择关系，不表达执行已经发生。
- “all P0 suites”仍要求 concrete TC full denominator；主题标签不能替代 manifest。
- 上游 owner closure 不会自动把 provider、delivery、observed 或 readiness 变成通过。

## 12. 对上游设计的影响判定

| 结论 | 是否回写上游 | 处理 |
|---|---|---|
| 回归矩阵、S 级规则和 residual 记录 | 否 | 测试执行与验收交接策略，不修改业务契约。 |
| 主题标签与 concrete TC 归属澄清 | 否 | 作为测试追溯解释；正式正文不得新增第二套 TC。 |
| 若实际修复暴露字段/状态/error/Port缺口 | 是 | 先回写 `03`/`04`，再重开受影响 Step 5~14。 |
| 若 06 提升 P1/P2 为 P0 或要求数字阈值 | 是 | 回写 Step 2、8、9、10、12、13、14；不能在06单独扩展。 |

## 13. 回填草稿（正式 05 §14）

> 校准来源：
> - `design-calibration/05_test_plan_step_14_regression_risks.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“TC 身份与主题标签校准”“变更类型到最小回归矩阵”“P0 全量回归集合”“S 级缺陷触发与复验规则”和“P1/P2/future residual 风险表”，了解回归范围如何由具体设计契约、suite 和证据门禁推导。

正式 §14 应规定：局部对象/流程变更至少回归其主 suite、相邻负向 case 和相关 check；公共 carrier、状态/phase、UoW/CAS/idempotency、redaction/dependency/config safety、跨模块 facade、证据生成器或 S/P0 A 缺陷修复必须执行 `static-boundary`、`contract-domain`、`application-core`、`query-purity`、`entry-worker-job`、`transaction-concurrency`、`config-validator`、`config-assembly`、`observability-redaction`、`local-closure` 和适用的 `controlled-seam` 全量 P0 回归，并保留 concrete TC full denominator。

任一 `VF-L2T-001~013`、P0 truth/security/consistency/evidence/dependency/config redline、Query 写入、Job 修 truth、outcome/audit 半对、unknown 重调、host/direct Sandbox fallback 或静态 evidence/blocker 伪造均触发 S 级阻断，不得风险接受。P1/P2/future residual（开放 provider、Sandbox receipt、Observability route/readiness、SDK、production-like、容量/数字阈值、retention、未冻结 baseline 和 runner）必须有 owner role、重开触发、缓解和新版 06 交接，不得写成通过。

Step 5 中的 `RULE`、`DATA`、`NFR-*`、`CORE`、`BOUNDARY`、`REDACTION` 只作为 derived coverage/evidence 标签；正式 §6 只引用 Step 6 已冻结的 concrete `TC-L2T-*`，不创建第二套身份。回归证据沿用 Step 13 的 fixed-run 元组和 artifact/report pairing，失败与 blocker 均保留并脱敏。

## 14. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 06 对 P0 full denominator、VETO 和 eligible evidence 的最终裁决 | release/acceptance gate | 先交接 Step 9/12/13/14 输入，等待 06 |
| residual 的正式接受人角色与签署格式 | 风险闭环 | 只记录 owner role，不伪造签署 |
| measurement authority 与数字阈值 | 性能/容量验收 | 只保留 sample provenance，数字留待 authority |
| 实现仓、runner、durable backend、CI provider | 回归可执行命令与环境 | 固定外层 suite/script/path，不伪造实现事实 |
| Step 5 主题标签未来是否需要独立 TC | 编号/manifest | 当前不新增；若需求改变，必须重开 Step 5/6/9/13 |

## 15. Step 14 停审与跨回归审计

| 审查项 | 结论 | 缺口/修正 |
|---|---|---|
| 每类 L2 变更有最小 suite/check | 通过 | §5 已覆盖对象、协议、状态、配置、边界、证据和上游闭口。 |
| 共享高风险变更触发 P0 全量 | 通过 | §6 明确 suite、concrete denominator 和 mandatory checks。 |
| S 级触发不可被 residual 吞掉 | 通过 | §7 覆盖 VF、truth、安全、一致性、证据和配置红线。 |
| P1/P2/future 有 owner/trigger/缓解 | 通过 | §8 逐项登记 `L2T-RR-*`；无姓名和签署伪造。 |
| Step 13 evidence 能承接回归复验 | 通过 | §10 固定前后 run、pairing、candidate slot 和 draft 边界。 |
| Step 5/6 主题标签与 TC 身份无孤儿歧义 | 通过 | §4 将主题标签定义为 derived grouping，不新增/删除 concrete TC。 |
| 是否引入新业务 oracle、配置 key、依赖类型 | 否 | 仅定义测试触发、证据和风险交接。 |
| 是否产生执行事实 | 否 | 无 run、artifact、report、digest、缺陷签署或验收结论。 |

## 16. 进入下一步条件

- [x] 变更类型到最小回归 suite/check 矩阵完成。
- [x] P0 全量回归集合、concrete denominator 和 mandatory checks 明确。
- [x] S 级触发、不可接受边界和复验升级规则明确。
- [x] P1/P2/future residual 均有 owner role、重开触发、缓解和 06 交接方向。
- [x] Step 5/6 主题标签差异已显式处理，未静默新增或删除 TC。
- [x] Step 13 证据归档规则已承接，未创建真实 evidence。
- [x] 可进入 Step 15 正式文档装配。

## 17. Step 14 停审记录

| 项 | 结论 |
|---|---|
| Step 状态 | `accepted_for_step_14 / proceed_to_step_15` |
| 停审时间 | 2026-08-06（设计审查记录；非测试执行时间） |
| 上游 blocker | `L2T-UP-001~009` 仍 open；provider、route、readiness、SDK、baseline 和 measurement residual 保持 blocked/conditional。 |
| 正式文档写入 | 未写；Step 15 前保持锁定。 |
| 下一步 | Step 15 整理正式测试方案文档。 |
