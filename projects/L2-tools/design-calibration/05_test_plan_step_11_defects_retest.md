# L2-tools 05 测试方案 · Step 11 缺陷管理与复验规则

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 11「定义缺陷管理与复验规则」
>
> 目标回填：`projects/L2-tools/05-测试方案.md` §11
>
> 直接输入：`05_test_plan_step_05_traceability_coverage.md`、`05_test_plan_step_06_cases.md`、
> `05_test_plan_step_09_automation_gates.md`、`05_test_plan_step_10_nonfunctional.md`、
> `projects/L2-tools/00-需求文档.md` §14.3、`projects/L2-tools/03-详细设计.md` §11~§15。

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | 11 / 定义缺陷管理与复验规则 |
| 状态 | `accepted_for_step_11 / proceed_to_step_12` |
| 当前模块 | `defect_management_and_retest_rules` |
| 本步结论 | 已形成 S/A/B/R 分级、P0 红线不可风险接受规则、按触发面复验矩阵、关闭证据要求和自动化防回归触发条件。 |
| 正式文档写入 | 未允许；正式 `05-测试方案.md` 仍锁定至 Step 15。 |
| 下一步 | Step 12：进入准则与退出准则。 |

### 1.1 Step 内计划

- [x] 读取 P0 用例、suite/gate、专项红线和 `VF-L2T-001~013`。
- [x] 区分产品缺陷、测试基础设施缺陷、依赖阻塞和范围外 residual。
- [x] 固定修复后原用例、同 family、相关 suite/check 的复验范围。
- [x] 固定缺陷关闭所需的 planned artifact/report/evidence linkage；不创建真实运行事实。
- [x] 完成风险接受边界、自动化防回归和跨缺陷审计。

## 2. 本步输入与 SOP 问题回答

| 输入 | 直接用途 | 当前状态 |
|---|---|---|
| `00-需求文档.md` §14.3 | 一票否决项、AC/VF 方向 | current formal |
| Step 5 追溯矩阵 | 需求、设计、TC、candidate EV 双向映射 | accepted intermediate |
| Step 6 用例矩阵 | `TC-L2T-*` 原失败切口、正式 oracle 和 phase fence | accepted intermediate |
| Step 9 自动化门禁 | suite owner、blocking level、status 和脚本/check | accepted intermediate |
| Step 10 专项测试 | redaction、UoW、CAS、unknown、Query/Job、NFR 红线 | accepted intermediate |
| `03` §11~§15 | typed error、恢复、并发、配置和观测断言 | current formal |

| SOP 问题 | 回答 | 依据 |
|---|---|---|
| 哪些缺陷属于 S 级阻断？ | 任一 `VF-L2T-001~013` 命中；P0 truth、Query zero-write、Job no-repair、pair atomicity、phase/unknown fence、redaction、dependency、config fail-fast 或 evidence integrity 破坏；或 blocking suite 的结果无法判定且不能证明只是 harness 自身问题。 | `00` §14.3；`03` §9~§15；Step 9~10 |
| 哪些缺陷可以风险接受？ | 仅 P1/P2/future、开放 provider 的 `blocked_dependency`、无正式 authority 的性能 sample、非核心可读性或未来产品适配风险。它们必须保持 residual/unavailable，不得计入 P0 pass。 | `00` §13~§15；Step 2、8、10 |
| 修复后必须回归哪些用例？ | 原失败 TC、同一 family 的正/负/duplicate/no-write 代表集、受影响主 suite、相邻 suite，以及对应 redaction/dependency/report/phase check。shared contract、state、UoW、config 或 evidence 变更触发全量 P0 回归。 | Step 6、9、10；`03` §10~§14 |
| 缺陷关闭需要什么证据？ | 失败上下文、修复说明、固定 run 的 raw artifact/report、复验 TC/suite 状态、相关 check、candidate EV 关联和 residual 处理。设计期只定义 schema，不填写真实 `run_id`、digest、结果或签署。 | Step 9、13 预留；证据规范 |
| 是否需要新增自动化防回归？ | 手工发现 P0、release smoke 发现而低层 suite 未发现、redaction/dependency/evidence 漏检、duplicate/UoW/unknown 复发时必须新增或扩展 TC、fixture、suite 或 check。 | SOP Step 11；Step 6、9、10 |

## 3. 当前文档问题诊断

| 材料/位置 | 诊断 | 当前处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 旧分级和固定成功率不能证明当前七模块、六状态族和 phase fence | `historical_material`，不继承编号、结果或阈值 |
| Step 9 | 已有 blocking suite/status，但未规定失败如何变成缺陷、何时可重跑 | 本 Step 固定 status 到 severity 的判定和新 run 规则 |
| Step 10 | 已有 P0 redline，但未明确 P1/P2 residual 与 P0 的风险接受边界 | P0 红线不可接受；P1/P2 只记录 residual |
| `L2T-UP-001~009` | 依赖开放不能被标成缺陷已修复或正向通过 | 采用 `blocked_dependency`、`unavailable`、`unverifiable`、`unknown` 或 `not_evaluated` |
| 性能候选 | 目前没有负载模型、阈值或 measurement authority | 只保留 sample provenance/correctness-first；不按旧百分比生成缺陷 |
| 证据材料 | candidate EV 不是实际证据，静态 index 不能关闭缺陷 | 关闭时要求未来真实 artifact/report 配对；当前不创建实例 |

## 4. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 缺陷分级 | suite 失败与风险接受没有统一分类 | S/A/B/R 四级，另保留 blocked/not_evaluated 状态 | 可被 Step 12/14 和实施计划直接引用 |
| P0 红线 | 分散在 VF、NFR 和专项矩阵 | `VF-L2T-001~013` 与具体触发面逐项映射 | 防止降级或遗漏 |
| 复验范围 | 容易只重跑原失败 case | 原 case + family + suite + 必要 check | 覆盖共享契约和跨模块回归 |
| 运行重试 | 可能把 flaky/unknown 重试成通过 | 每次重跑新 run；旧记录不覆盖，unknown 不自动重试 | 保持副作用和证据可审计 |
| 关闭证据 | 只有口头“已修复” | 固定失败前后 artifact/report、TC/suite/check 和防回归说明 | 支撑 06 消费但不提前验收 |

## 5. 测试设计取舍

| 议题 | 备选 | 取舍 |
|---|---|---|
| VF 命中是否可风险接受 | 可降级 / 不可降级 | 采用不可降级；必须修复并复验。 |
| blocking suite 失败是否一律 S | 一律 S / 先区分产品与 harness | 先区分；若仅为脚本/环境自身错误且 P0 语义有独立可信 artifact，可临时记 A，并必须修复 harness。 |
| 依赖未闭是否建缺陷 | 统一记产品失败 / 独立 blocked | 独立 `blocked_dependency`；不把上游 blocker 伪装成 L2 已实现缺陷或通过。 |
| unknown 是否自动 retry | 自动 retry / 保持 manual fence | 保持 `unknown` 和人工解析；禁止第二次 side-effect Port call。 |
| 性能 sample 未达历史数字 | 按历史数字阻断 / 记录趋势 | 记录 sample/trend；无 authority 时不生成 S/A 性能缺陷。 |
| P0 手工发现是否保留手工流程 | 仅记录 / 增加自动化 | 必须增加自动化防回归，手工 evidence 只能补充解释。 |

## 6. 结构化中间产物

### 6.1 缺陷级别与状态

| 级别 | 定义 | L2-tools 典型触发 | 处理要求 | 是否阻断 |
|---|---|---|---|---|
| `S` | 一票否决、P0 truth/安全/一致性/证据真实性破坏 | `VF-L2T-001~013`；forbidden body 泄露；Query 写入；Job 修 truth；outcome/audit 半对；unknown 重调；非 Core sibling dependency；静态 evidence 伪造 | 必须修复；原 case + family + blocking suite + 相关 checks；不得风险接受 | 是 |
| `A` | P0 用例失败但未命中 VF，或可证明是测试 harness/环境问题且尚不能判定产品语义 | 某非红线 report 字段缺失；controlled fixture 不稳定；blocking suite invalid 但独立语义 artifact 尚可用 | 测试/设计负责人明确处置；通常阻断 release；修复后复验 | 通常是 |
| `B` | 非 P0、可维护性或 P1 条件路径问题 | P1 real-like unavailable；报告可读性；非阻断 sample 质量问题 | 排期或风险接受；不得计入 P0 pass | 否 |
| `R` | 已确认范围外、future 或未闭 authority 风险 | production-like capacity、真实 provider 深度行为、SDK client、长期 retention | 记录 owner/trigger/缓解；不得写成已验证 | 否 |

缺陷级别与执行状态分离：`failed` 可以产生 S/A/B；`blocked_dependency`、`unavailable`、`unknown`、`not_evaluated` 默认不是“通过”，由影响范围决定是否形成 A/B/R 或保持 blocker。任何 `invalid_artifact` 都先阻断 gate，再按原因归类。

### 6.2 S 级阻断判定矩阵

| 触发面 | 具体断言 | 来源/TC | 判定 |
|---|---|---|---|
| 核心闭环缺失或错误合并 | 五个 `C-L2T-1~5` 任一不能独立成立，或把 Runtime/LLM/Hub/Sandbox/Obs truth 合并进来 | `VF-L2T-001`；`TC-L2T-VETO-001` | `S` |
| identity/definition authority 漂移 | display/provider/inventory/SDK/local registry 替代本地合同 | `VF-L2T-002`；`TC-L2T-VETO-002` | `S` |
| binding/authorization 越界 | 复制 Hub registry、visibility 当 authorization、self-authorize 或缺失时 default allow | `VF-L2T-003`、`VF-L2T-005`；`TC-L2T-BIND-006`、`TC-L2T-PRE-002~004` | `S` |
| canonical invocation 分叉 | caller/carrier 产生第二 request/result/error 或吸收 agent loop/planning | `VF-L2T-004`；`TC-L2T-INV-003` | `S` |
| Sandbox/no-host 红线 | sandbox-required host/direct fallback，或伪造 run/receipt/capture/cleanup | `VF-L2T-005`、`VF-L2T-006`；`TC-L2T-PRE-005` | `S` |
| outcome/audit truth 替换 | raw capture/provider/Bus/Obs/Runtime 状态替代 normalized outcome/error/audit | `VF-L2T-007`；`TC-L2T-OUTCOME-001~010` | `S` |
| forbidden material 泄露 | raw request/prompt/capture/provider body、secret、credential、full sensitive ref 进入任一 surface | `VF-L2T-008`；`TC-L2T-FOUNDATION-006`、`TC-L2T-FOUNDATION-018`、`TC-L2T-OBS-008` | `S` |
| downstream reverse write | Bus/Obs/SDK/Runtime 状态回滚、覆盖或重裁决本地 outcome/audit | `VF-L2T-009`；`TC-L2T-OBS-005~007` | `S` |
| owner/依赖越界 | 合并 Runtime orchestration、Hub registry、Sandbox execution、Obs store、SDK client 或 sibling path dependency | `VF-L2T-010`、`VF-L2T-012`；`TC-L2T-VETO-010`、`TC-L2T-VETO-012` | `S` |
| late material 改写历史 | terminal/admission/attempt 被 late source/status 原地覆盖 | `VF-L2T-011`；`TC-L2T-OUTCOME-006`、`TC-L2T-HANDOFF-008` | `S` |
| historical/blocker/evidence 伪造 | 旧 API/指标/签署、planned EV、health marker 或开放 blocker 被写成 current fact | `VF-L2T-013`；`TC-L2T-VETO-013` | `S` |
| consistency/recovery 红线 | half pair、duplicate second side effect、commit/call unknown 自动 retry、stale CAS 覆盖 | `03` §10~§12；`TC-L2T-TX-*`、`TC-L2T-CONC-*`、`TC-L2T-ERR-*` | `S` |
| config safety 红线 | malformed/high-source conflict silent fallback、partial graph、unsafe redaction override | `04` CFG-F/X；`TC-L2T-CFG-F-*`、`TC-L2T-CFG-X-*` | `S` |

### 6.3 修复后复验矩阵

| 触发面 | 原失败 TC | 同 family 必跑 | 主 suite / check | 关闭时必须看到 |
|---|---|---|---|---|
| contracts/ref/metadata/digest | 原 `FOUNDATION`/`CONTRACT` TC | wrong-kind、duplicate equal/conflict、redaction代表项 | `contract-domain`；必要时 `check_case_manifest.sh` | typed field、digest、error和安全面一致 |
| contract/state/evolution | 原 `CONTRACT`/`STATE` TC | 正向、非法迁移、terminal、late material | `contract-domain` + `application-core` | 一次切换、历史不变、typed conflict |
| binding/Hub seam | 原 `BIND`/`CONSUMER-001` TC | bound/unbound、blocked、stale、duplicate、no-local-registry | `application-core` + `controlled-seam`；`check_blocker_truth.sh` | relation/snapshot/assessment/gap 归属正确 |
| invocation/admission | 原 `INV`/`PRE` TC | carrier parity、missing context、duplicate、no-execution | `application-core` + `query-purity` | canonical frame、pair、zero Port/zero fallback |
| UoW/CAS/idempotency | 原 `TX`/`CONC`/`ERR` TC | same/different digest、stale CAS、commit unknown、half pair | `transaction-concurrency`；`check_outcome_audit_pair.sh`、`check_phase_unknown_fence.sh` | 单赢家、exact replay、manual unknown |
| Sandbox/handoff/outcome | 原 `PRE`/`OUTCOME`/`HANDOFF`/`CONT` TC | known failure、unknown、phase-2 stale、late status | `application-core` + `controlled-seam`；`check_phase_unknown_fence.sh` | one-call、local disposition、无 run/receipt 推断 |
| Query/Job no-write | 原 `QUERY`/`JOB` TC | stale/rebuilding/partial/failed、projection miss | `query-purity` + `entry-worker-job`；`check_query_no_write.sh`、`check_job_boundedness.sh` | zero write/refresh/Port，bounded report |
| consumer/event replay | 原 `CONSUMER`/`CONT` TC | duplicate、unsupported、route blocked、submission unknown | `entry-worker-job` + `transaction-concurrency` | claim/replay/receipt 状态独立，禁止第二 call |
| config parse/source/profile | 原 `CFG`/`CFG-T/A/F/X` TC | invalid-high、cross-field、redline、builder stage | `config-validator` + `config-assembly`；`check_profile_isolation.sh` | fail-fast/no partial/no raw diagnostic |
| observability/redaction | 原 `OBS`/`VETO` TC | every carrier/log/metric/trace/audit/report surface | `observability-redaction`；`check_redaction_boundary.sh` | forbidden corpus clean、low cardinality、local truth first |
| dependency/evidence integrity | 原 `VETO`/static TC | historical scan、package graph、artifact/report pairing | `static-boundary`；`check_dependency_boundary.sh`、`check_artifact_report_pairing.sh`、`check_no_static_evidence.sh` | no sibling compile、fixed run linkage、无静态 pass |

原失败 run 若存在，修复后必须创建新的 run context；不得覆盖、择优拼接或修改旧 artifact/report。当前设计文件不产生任何实际 run 或缺陷记录。

### 6.4 风险接受规则

| 项 | 是否可接受 | 条件 |
|---|---|---|
| `S` 级或任一 `VF-L2T-*` | 否 | 必须修复、复验并补防回归；不允许豁免 |
| P0 redaction/dependency/evidence/config safety | 否 | 证据真实性和安全边界不可风险接受 |
| P0 blocking suite `failed` | 原则上否 | 只有明确证明为 harness/环境自身错误、P0 语义有独立可信证据，并由责任角色登记 A；仍须修复 harness |
| `blocked_dependency`（开放上游） | 不计 pass | 记录 blocker、owner、触发条件；不把负向 blocked 行为当 provider positive closure |
| P1 real-like unavailable | 是，作为 residual | 不进入 P0 分母；需 owner/触发条件和后续复验 |
| P2 capacity/production-like/SDK/product 深度行为 | 是，作为 R | 需接受人角色和升级条件，进入 Step 14/新版 06 |
| 无 authority 的性能 sample | 是，作为 B/R | 只保留 provenance/trend；不得恢复旧阈值 |

### 6.5 缺陷关闭证据清单

| 关闭材料 | S | A | B/R |
|---|---:|---:|---:|
| 缺陷 ID、影响范围、触发 TC/suite/status | 必需 | 必需 | 必需 |
| 失败前固定 run/artifact/report 引用 | 若有执行则必需 | 若有执行则必需 | 可选 |
| 修复范围、设计来源和变更说明 | 必需 | 必需 | 可选 |
| 新 run 的 suite report、case-level assertion 和 raw context | 必需 | 必需 | 视影响 |
| 相关 redaction/dependency/phase/pair/report check | 相关即必需 | 相关即必需 | 可选 |
| 防回归 TC/fixture/check 变更说明 | 必需 | 必需 | 可选 |
| residual/风险接受人和理由 | 不允许以此关闭 | 若风险接受则必需 | 必需 |
| candidate EV 到真实 evidence 的派生记录 | 仅未来执行时必需 | 影响证据时必需 | 可选 |

### 6.6 自动化防回归触发

| 触发 | 必须动作 |
|---|---|
| 手工发现 P0 缺陷 | 将手工路径转成稳定 `TC-L2T-*`，补 fixture/negative corpus，并绑定主 suite。 |
| release/local closure 发现而低层 suite 未发现 | 把断言下沉到 `contract-domain`、`application-core`、`query-purity`、`entry-worker-job` 或 `transaction-concurrency`。 |
| redaction scanner 漏检 | 扩展 forbidden corpus、载体遍历和 `check_redaction_boundary.sh`；失败 artifact 也必须扫描。 |
| dependency boundary 漏检 | 扩展 import/package/public-surface 图检查和历史材料 deny list。 |
| evidence/report 静态伪造或 pairing 漏检 | 扩展 `check_artifact_report_pairing.sh`、`check_no_static_evidence.sh` 和 report generator 输入校验。 |
| duplicate/UoW/unknown 缺陷复发 | 增加 fault injection、same/different digest 和 one-call journal 断言。 |
| P1/P2 要求升级为 P0 | 先回写 Step 2/8/9/10 的范围、profile、数据和 gate，再增加 TC，不在缺陷单中私自扩展 oracle。 |

## 7. 对上游设计的影响判定

| 结论 | 是否回写上游 | 处理 |
|---|---|---|
| `VF-L2T-001~013` 不可降级 | 否 | 只是将 `00` 的一票否决转成测试缺陷管理。 |
| P0 redaction/dependency/evidence/config safety 不可接受 | 否 | 与 `03`/`04` 已有不变量一致。 |
| 复验需跨 family/suite | 否 | 测试执行策略，不改变业务契约。 |
| 若复验无法引用唯一字段/状态/错误 | 是 | 回写 `03` 设计闭口，不允许测试自造 oracle。 |
| 若 residual 要升级 P0 | 是 | 由用户/验收方确认后回写 Step 2、8、9、10 和后续 06。 |

## 8. 回填草稿（正式 05 §11）

> 校准来源：
> - `design-calibration/05_test_plan_step_11_defects_retest.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“缺陷级别与状态”“S 级阻断判定矩阵”“修复后复验矩阵”“风险接受规则”和“自动化防回归触发”小节，了解缺陷如何阻断、复验和关闭。

正式 §11 应规定：缺陷分为 S、A、B、R 四级，执行状态与缺陷级别分离；任一 `VF-L2T-001~013`、P0 truth/security/consistency/evidence/dependency/config 红线均为 S 级且不可风险接受。修复后至少复验原失败 TC、同 family、相关主 suite 和必要 checks；unknown、blocked、unavailable、not_evaluated 不得被重试或改名为 pass。关闭需保留失败前后固定 run 的 artifact/report、复验断言、修复说明和防回归处理；手工发现的 P0 或证据/边界漏检必须补自动化。

## 9. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 缺陷系统字段、通知和具体责任人 | 实施期工单流程 | 不在 05 定义；由 07/项目流程承接。 |
| S 级关闭是否需要人工签署 | 验收交接 | 留给 Step 13 和新版 06；本 Step 只要求 planned evidence。 |
| A 级临时风险接受角色 | release 决策 | 以测试负责人/验收负责人角色待确认，不伪造姓名。 |
| 性能候选未来是否硬化阈值 | 级别与退出门禁 | 当前不硬化；若硬化需回写 05/06。 |
| 上游 positive provider 何时闭口 | P1 复验环境 | 继续按 `L2T-UP-001~009` blocked/conditional。 |

## 10. Step 内停审与跨缺陷审计

| 审查项 | 结论 | 缺口/修正 |
|---|---|---|
| S/A/B/R 定义可判定 | 通过 | §6.1 已区分 truth/redline、P0 non-redline、P1/P2 和 future。 |
| `VF-L2T-001~013` 均有 S 级映射 | 通过 | §6.2 覆盖全部 veto 家族。 |
| P0 风险接受边界明确 | 通过 | P0 redline、evidence、dependency、config safety 不可接受。 |
| 复验范围可落到 TC/suite/check | 通过 | §6.3 按触发面列出稳定族和脚本契约。 |
| unknown/blocked/flaky 未被转成 pass | 通过 | 继承 Step 9 status contract，重跑需新 run。 |
| 关闭证据与 Step 13 衔接 | 通过 | 只预留 future artifact/report/evidence linkage。 |
| 是否新增业务 oracle或配置 key | 否 | 未新增字段、状态、协议、配置或依赖类型。 |

## 11. 进入下一步条件

- [x] 缺陷级别、阻断条件和风险接受边界可判定。
- [x] 每个主要 P0 触发面都有原 TC、同 family、suite/check 和关闭证据规则。
- [x] `blocked_dependency`、`unavailable`、`unknown`、`not_evaluated` 不被误作通过。
- [x] 防回归自动化触发条件明确，未伪造执行结果。
- [x] 无未解决的测试设计冲突，可进入 Step 12。

## 12. Step 11 停审记录

| 项 | 结论 |
|---|---|
| Step 状态 | `accepted_for_step_11 / proceed_to_step_12` |
| 停审时间 | 2026-08-06（设计审查记录；非测试执行时间） |
| 上游 blocker | `L2T-UP-001~009` 仍 open；仅保留 blocked/unavailable/unknown/conditional 语义。 |
| 正式文档写入 | 未写；Step 15 前保持锁定。 |
| 下一步 | Step 12 进入准则与退出准则。 |
