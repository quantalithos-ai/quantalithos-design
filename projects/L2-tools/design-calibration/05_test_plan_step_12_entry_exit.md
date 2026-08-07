# L2-tools 05 测试方案 · Step 12 进入准则与退出准则

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 12「定义进入准则与退出准则」
>
> 目标回填：`projects/L2-tools/05-测试方案.md` §12
>
> 直接输入：`05_test_plan_step_06_cases.md`、`05_test_plan_step_07_test_data.md`、
> `05_test_plan_step_08_environment_config.md`、`05_test_plan_step_09_automation_gates.md`、
> `05_test_plan_step_10_nonfunctional.md`、`05_test_plan_step_11_defects_retest.md`。

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | 12 / 定义进入准则与退出准则 |
| 状态 | `accepted_for_step_12 / proceed_to_step_13` |
| 当前模块 | `entry_exit_criteria` |
| 本步结论 | 已将设计基线、数据、环境/profile、suite/check、证据配对和缺陷规则收敛为可判定的进入、退出、暂停与阻断条件；不把任何执行结果写成当前事实。 |
| 正式文档写入 | 未允许；正式 `05-测试方案.md` 仍锁定至 Step 15。 |
| 下一步 | Step 13：测试报告与证据归档。 |

### 1.1 Step 内计划

- [x] 读取 Step 6~11 的用例、数据、环境、自动化、专项和缺陷规则。
- [x] 区分测试设计/执行准备进入条件、P0 退出条件和 P1/P2 residual 条件。
- [x] 固定 profile、fixture、suite、script、artifact/report 的可判定要求。
- [x] 固定设计缺口、环境不可用、S 级缺陷、静态证据和 blocker 的暂停/阻断行为。
- [x] 完成准则来源追溯与跨准则审计。

## 2. 本步输入与 SOP 问题回答

| 输入 | 直接用途 | 当前状态 |
|---|---|---|
| `00-需求文档.md` §13~§15 | NFR、AC、VF 和 blocker 语义 | current formal |
| `01-架构设计.md` §4~§10 | owner、依赖、写权和系统接缝 | current formal |
| `02-概要设计.md` §4~§10 | 六个组成部分、主流程和状态轮廓 | current formal |
| `03-详细设计.md` §5~§15 | 七模块、协议、flow、状态、错误、UoW、配置和观测 oracle | current formal |
| `04-配置设计.md` §6~§12 | profile、source、failure、builder、redline 和下游 handoff | current formal |
| Step 6~11 | TC、DS、环境、suite、专项和缺陷门禁 | accepted intermediates |

| SOP 问题 | 回答 | 依据 |
|---|---|---|
| 开始前哪些文档必须可用？ | 当前正式 `00~04` 必须作为唯一测试输入；Step 1~11 的中间产物、编号和审计必须完成。若 `03/04` 后续改变 P0 字段、状态、flow、Port、配置、redaction 或 gate，先回审受影响 Step，不能直接执行旧用例。 | `03` §15~§17；`04` §12~§14；Step 1~11 |
| 哪些环境和数据必须可用？ | P0 需要 `local-dev`、`ci-test`、`integration-like` 的对应 profile；P0 数据集必须可由 deterministic fixture/builder/seed 构造、按 run/case 隔离并可清理；fake/controlled/disabled seam 必须明确类型。 | Step 7、8 |
| 哪些自动化必须可运行？ | P0 主 suite：`static-boundary`、`contract-domain`、`application-core`、`query-purity`、`config-validator`、`entry-worker-job`、`transaction-concurrency`、`config-assembly`、`observability-redaction`、`local-closure`；受控接缝与 release checks 按 profile 条件启用。 | Step 9 |
| 退出时哪些用例必须有结果？ | 所有 P0 `TC-L2T-*` family 必须在固定 run/profile 下得到 `passed` 或明确的 `failed/blocked_dependency/not_evaluated/invalid_artifact`；P0 release gate 只能在阻断项已处理后退出。不能用缺失结果当通过。 | Step 6、9、11 |
| 哪些缺陷或风险阻断退出？ | 任一 `VF-L2T-001~013`、S 级缺陷、P0 blocking suite failure、P0 profile 不可用、redaction/dependency/evidence pairing 失败、静态 evidence 或 unknown 被改名为 pass，均阻断。P1/P2 residual 可不阻断，但必须有 owner/触发条件/缓解。 | `00` §14.3；Step 10、11 |

## 3. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 6~11 | 已有局部门禁，缺统一的开始/结束判定 | 汇总为 checklist 和来源矩阵 |
| Step 8 | `staging-like`/`production-like` 容易被误写成现成环境 | 明确为 conditional/inactive，不进入 P0 分母 |
| Step 9 | `blocked_dependency`、`not_evaluated`、`invalid_artifact` 已定义，但没有退出语义 | 明确这些状态不能替代 P0 passed |
| Step 10 | 性能只有结构性 sample，无数字 authority | 退出要求 sample provenance，不要求 P95/P99/QPS/SLA |
| Step 11 | 缺陷分级与风险接受已定义，尚未接入退出门禁 | S/A/P0 redline 与 residual 规则进入退出条件 |
| 旧 `05/06` | 旧准则包含具体产品、阈值、签署和结果叙事 | 仅作 `historical_material`，按当前 `00~04` 重建 |

## 4. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 进入准则 | 分散在数据、环境和 suite 文件 | 统一为文档、数据、环境、自动化、证据和缺陷六组 checklist | 实施者可以逐项判定 |
| 退出准则 | 只有“P0 通过”方向 | 增加 full denominator、VF、checks、artifact/report pairing 和 residual | 避免模糊完成 |
| P1/P2 | 可能被误判为 P0 前置 | 明确为 conditional/residual，不计 P0 分母 | 维护范围边界 |
| 证据 | 可能提前要求正式 EV | 只要求未来固定 run 的 raw/report 可生成，EV 实例由 Step 13/真实执行产生 | 不伪造 evidence |
| 环境故障 | 可能用 fake/health marker 替代 | P0 profile 无效即阻断；open seam 保持 blocked/unavailable | 防止 fail-open |

## 5. 测试设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否要求正式 `05` 已装配才能开始准备 | 要求 / 允许使用已审查中间产物 | 允许使用中间产物准备；正式 `05` 仍在 Step 15 装配，不改变真相源。 |
| 是否要求真实 provider positive 才能进入 P0 | 要求 / 使用 local negative 与 controlled seam | 采用后者；provider positive 单列 P1 conditional，不能替代本地 P0。 |
| `blocked_dependency` 能否算退出通过 | 能 / 不能 | 不能；它是状态分类，受影响 positive gate 保持 blocked。 |
| P1 selected-run unavailable 是否阻断 P0 | 阻断 / residual | 作为 residual，不阻断 P0，但必须记录 owner 和重开触发。 |
| 性能候选是否需要数字阈值 | 需要 / 只要求 sample provenance | 当前只要求 sample provenance、核心隔离和正确性不变；数字留给后续 authority。 |
| A 级缺陷是否全部阻断 | 全部 / 仅影响 P0 release 的阻断 | 采用后者；无影响的 A 级必须有明确接受人和复验计划。 |

## 6. 结构化中间产物

### 6.1 进入准则

执行前，以下条件必须逐项检查；本表是 planned gate，不表示当前已执行：

- [ ] 正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 的当前版本已被记录为本轮输入；workspace 未冻结 commit 时不得声称 immutable baseline。
- [ ] Step 1~11 中间产物、flow/ledger 状态和编号审计完成；旧 `README.md`、旧 `05`、旧 `06` 不作为 oracle。
- [ ] `TC-L2T-FOUNDATION-*`、`CONTRACT-*`、`BIND-*`、`INV-*`、`PRE-*`、`OUTCOME-*`、`HANDOFF-*`、`QUERY-*`、`CONSUMER-*`、`CONT-*`、`JOB-*`、`STATE-*`、`TX-*`、`CONC-*`、`ERR-*`、`CFG-*`、`OBS-*`、`VETO-*` 均有前置、断言、suite 归属和 candidate EV 方向。
- [ ] Step 7 的 P0 数据集 manifest、deterministic Clock/ID、typed ref、fault corpus、forbidden corpus、UoW/Port spy、cursor/watermark fixture 可重复构造。
- [ ] `local-dev`、`ci-test`、`integration-like` profile 的 canonical config、source lane、scope、feature 和 safety floor 可定位；`staging-like`/`production-like` 未被误启用。
- [ ] 只有 `L0-core` 作为 compile-time dependency candidate；Hub/Sandbox/Runtime 是 runtime seam，Bus/Observability 是 event collaboration，SDK seam 保持 future/pending。
- [ ] P0 suite registry、主 owner、full denominator、公共 gate 参数和固定输出根已可解析；gate 支持 `--run-id`、`--artifact-root`、`--config-profile`，report 支持固定 `--report-root`。
- [ ] 计划输出根为 `artifacts/test/<run_id>` 与 `reports/runs/<run_id>`；不使用 `latest`、项目子目录、静态 evidence alias 或复用旧 run。
- [ ] redaction、dependency、Query no-write、Job boundedness、phase/unknown、outcome/audit pair、blocker truth 和 artifact/report pairing checks 已纳入相应 gate。
- [ ] Step 11 的 S/A/B/R 分级、风险接受和复验矩阵已被执行负责人理解；任何开放 `L2T-UP-001~009` 仅能产生 blocked/unavailable/unknown/conditional。

### 6.2 退出准则

退出测试阶段前，未来真实运行必须满足以下条件；当前设计阶段不填写结果：

- [ ] P0 TC 的 full denominator 在固定 run/profile 中均有明确 status；不存在静默过滤、缺失 case 或将 `not_evaluated` 当作 passed。
- [ ] P0 主 suite `static-boundary`、`contract-domain`、`application-core`、`query-purity`、`entry-worker-job`、`transaction-concurrency`、`config-validator`、`config-assembly`、`observability-redaction`、`local-closure` 均满足对应 oracle。
- [ ] `controlled-seam` 的本地 contract parity 成立；任何外部 owner positive 仍按 `blocked_dependency` 或 conditional 单独呈现。
- [ ] `VF-L2T-001~013` 的正向/负向静态或运行检查均有可追溯结果，且无一项被降级为普通 residual。
- [ ] `check_case_manifest.sh`、`check_dependency_boundary.sh`、`check_profile_isolation.sh`、`check_query_no_write.sh`、`check_job_boundedness.sh`、`check_phase_unknown_fence.sh`、`check_outcome_audit_pair.sh`、`check_redaction_boundary.sh`、`check_blocker_truth.sh`、`check_artifact_report_pairing.sh`、`check_no_static_evidence.sh` 的结果可追溯；适用的 P0 check 不得缺失。
- [ ] 每个 blocking suite 有同一 run 的 `context.json`、`report.json`、stdout/stderr 和人类可读 report 配对；失败或 blocked 也保留安全的原因材料。
- [ ] 无 S 级缺陷；任何影响 P0 truth、redaction、dependency、config safety、phase/unknown、pair atomicity 或 evidence integrity 的 A 级缺陷已修复并复验，或退出被阻断。
- [ ] P1/P2/future residual（provider、Sandbox receipt、Observability route/readiness、SDK client、production-like/capacity、长期 retention、无 authority 数字阈值）均记录 owner、影响、缓解和重开触发，不写成 passed。
- [ ] 性能专项至少有带 profile/run/suite/case/dataset/clock/ref provenance 的 duration/count sample；不以旧 P95/P99/QPS/SLA 或百分比作当前退出条件。
- [ ] local `ToolInvocationOutcome` 与 `ToolAuditEntry` 成对、Query zero-write、Job bounded/no-repair、one-call/unknown fence、safe handoff 四门和 local truth first 均有对应证据路径。
- [ ] 没有真实 provider readiness、Sandbox run/receipt、Bus delivery、Observation observed、SDK client、验收签署或静态 evidence alias 被伪造。

### 6.3 暂停与阻断准则

| 触发 | 处理 |
|---|---|
| `03/04` 缺少构造 P0 用例所需的正式字段/状态/error/配置语义 | 暂停受影响测试设计，回写详细/配置设计；不得在测试或代码中补第二 schema。 |
| P0 profile 或 required local Store/UoW/Clock-ID capability 无法装配 | 阻断进入/退出；不得 fallback、health marker-as-ready 或静态 pass。 |
| fixture/fault injection 无法触发 unknown、half pair、stale CAS、forbidden body 或 bounded Job | 阻断相关 suite；补测试基础设施或将缺口登记为 implementation blocker。 |
| open `L2T-UP-*` 被 gate 解释为 positive ready/accepted/executed | 立即阻断并按 `VF-L2T-012`、`VF-L2T-013` 立 S 级缺陷。 |
| 任一 S 级缺陷或 P0 redline check 失败 | 阻断退出，按 Step 11 修复、创建新 run 并复验。 |
| artifact/report pairing 或 redaction 失败 | 阻断退出；失败材料也需安全保存，不能用手写报告替代。 |
| P1 selected provider/environment unavailable | 不阻断 local P0，但记录 conditional/residual；不能进入 P0 positive denominator。 |
| 旧数字阈值未达但结构性 sample 完整 | 不按旧阈值阻断；转入 Step 14 residual，等待 measurement authority。 |

### 6.4 进入准则来源追溯表

| 准则组 | 来源 | 承接 |
|---|---|---|
| 设计基线与边界 | `00~04`；Step 1~5 | 需求/架构/详细设计真相和历史材料隔离 |
| 用例与数据 | Step 6~7 | TC full denominator、DS manifest、fixture/清理 |
| 环境与配置 | Step 8 | P0 profile、依赖类型、blocked/unavailable 行为 |
| 自动化与输出 | Step 9 | suite、gate/check/report、固定 run 路径 |
| 专项与红线 | Step 10 | NFR、redaction、no-write、phase、dependency |
| 缺陷与复验 | Step 11 | S/A/B/R、风险接受和新 run 复验 |

### 6.5 退出准则来源追溯表

| 准则组 | 来源 | 承接 |
|---|---|---|
| P0 TC 结果 | Step 6、9 | 每个 family 的主 suite 和 full denominator |
| VF / safety | `00` §14.3；Step 10、11 | `VF-L2T-001~013` 不可降级 |
| consistency/recovery | `03` §10~§12；Step 6、10 | pair、CAS、unknown、late material、bounded Job |
| configuration | `04` §9~§12；Step 6、8、9 | V0~V8、B0~B8、CFG-T/A/F/X |
| evidence/report | Step 9；Step 13（待完成） | raw artifact/report pairing 和 candidate EV 派生 |
| residual | Step 2、8、10、11；Step 14（待完成） | P1/P2/future owner/trigger |

## 7. 对上游设计的影响判定

| 结论 | 是否回写上游 | 处理 |
|---|---|---|
| P0 profile、suite、TC 和证据缺失阻断退出 | 否 | 测试门禁细化，不改变业务契约。 |
| open seam 只能 blocked/conditional | 否 | 承接 `00`/`01`/`03` 已有边界。 |
| 若 P0 用例无法构造 | 是 | 回写 `03/04` 的字段、状态、flow、error 或 config 闭口。 |
| 若新版 06 要求不同退出分母或签署 | 是 | 由新版 `06` 重新确认并回写 Step 12/13/14，不在本 Step 私改。 |

## 8. 回填草稿（正式 05 §12）

> 校准来源：
> - `design-calibration/05_test_plan_step_12_entry_exit.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“进入准则”“退出准则”“暂停与阻断准则”和“准则来源追溯表”小节，了解测试何时可以开始、何时必须停止以及哪些 residual 不得伪装成通过。

正式 §12 应规定：进入前必须确认当前 `00~04` 基线、Step 1~11 中间产物、P0 TC/DS、`local-dev`/`ci-test`/`integration-like` profile、fake/controlled seam、P0 suite、固定 artifact/report 根和 redline checks 均可定位。退出时必须有 P0 full-denominator status、`VF-L2T-001~013` 检查、blocking suite/check、raw artifact/report pairing、无 S 级或未处置 P0 A 级问题，并明确 P1/P2/provider/production-like/容量/性能数字仍为 residual。任何 profile 不可用、redaction/dependency/evidence 失败、unknown 被改名或静态证据伪造都阻断退出。

## 9. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 实际执行是否必须等待 Step 15 正式 05 | 测试启动排期 | 设计上允许使用已审查中间产物准备；最终执行依据仍须 current formal 05。 |
| 正式 EV 是否作为退出硬门禁 | Step 13/06 交接 | 当前只定义 evidence schema 和 candidate EV；由 Step 13 与新版 06 收口。 |
| P1 selected provider 是否在某 release 升级为必需 | P0/P1 分母和退出 | 当前 conditional；升级需用户/验收方确认并回写。 |
| S/A 关闭是否需要人工签署 | release/验收流程 | 不伪造角色或签署，留给新版 06。 |
| workspace immutable baseline 何时冻结 | evidence provenance | 当前标记 `L2T-UP-007`，不得写冻结 commit。 |

## 10. Step 内停审与跨准则审计

| 审查项 | 结论 | 缺口/修正 |
|---|---|---|
| 进入准则均可逐项判定 | 通过 | 无“基本完成”或无 owner 的模糊项。 |
| 退出准则覆盖 TC/VF/suite/check/defect/report/residual | 通过 | §6.2 全部列出。 |
| P0 环境不可用禁止伪 pass | 通过 | §6.3 明确阻断。 |
| provider/staging/production 未被计入 P0 | 通过 | 仅 conditional/residual。 |
| 性能无来源数字未被硬化 | 通过 | 只要求 provenance sample。 |
| 正式 EV、run、签署未被伪造 | 通过 | 仅定义未来 schema/路径。 |
| 准则没有新增业务 oracle/key/依赖 | 通过 | 复用 Step 6~10 和 `00~04`。 |

## 11. 进入下一步条件

- [x] 进入、退出、暂停和阻断条件无模糊项。
- [x] P0 与 P1/P2/future residual 的分母和责任边界明确。
- [x] artifact/report、redaction、dependency、unknown 和缺陷规则已接入退出门禁。
- [x] 未创建真实 run、artifact、report、evidence alias 或测试结果。
- [x] 可进入 Step 13。

## 12. Step 12 停审记录

| 项 | 结论 |
|---|---|
| Step 状态 | `accepted_for_step_12 / proceed_to_step_13` |
| 停审时间 | 2026-08-06（设计审查记录；非测试执行时间） |
| 上游 blocker | `L2T-UP-001~009` 仍 open；正向 provider/readiness 维持 blocked/conditional。 |
| 正式文档写入 | 未写；Step 15 前保持锁定。 |
| 下一步 | Step 13 测试报告与证据归档。 |
