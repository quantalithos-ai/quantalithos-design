# Step 11. 定义缺陷管理与复验规则

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 11  
> 回填章节：`05-测试方案.md` §11  
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_11_defects_retest.md`  
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与事实边界

| 项 | 当前值 |
|---|---|
| current_document | `05-测试方案.md` |
| current_step | Step 11 |
| current_module | `defects_retest:severity_escalation_closure_and_regression` |
| gate_status | `pass_for_step_12` |
| gate_reason | S/A/B/R 分级、一票否决红线、风险接受边界、按影响面复验、关闭证据和自动化防回归规则均已明确；未创建缺陷记录、未执行复验、未生成 artifact/report/evidence/verdict。 |
| formal_05_write_allowed | `false_until_step_15` |
| implementation_write_allowed | `false` |
| test_execution_allowed | `false` |
| commit_required | `false` |
| next_allowed_action | 创建并完成 Step 12 |

本 Step 定义测试管理合同，不定义工单平台、字段实现、负责人排期或验收裁决。缺陷状态、run、artifact、report、EV 和风险接受均只能在未来真实执行后产生；本文件中的级别与示例不是当前项目结果。

## 2. 本步目标、输入与非目标

### 2.1 目标

1. 把需求/设计红线映射为可判定的 S、A、B、R 缺陷级别；
2. 明确哪些问题绝不可风险接受，哪些只能登记为 residual/blocked；
3. 规定修复后原用例、同 family、相关 suite/check 的复验范围；
4. 规定缺陷关闭所需的固定 run、artifact/report、redaction 和边界证据；
5. 对手工发现、release smoke 漏检和安全/证据缺口强制补自动化，避免重复回归。

### 2.2 输入基线

| 输入 | 用途 |
|---|---|
| `00-需求文档.md` §9～§14 | FR/BR/NFR/AC 和禁止越权、`latest`、泄露、未知重放、上游反写红线。 |
| `03-详细设计.md` §7～§15 | Command/Query/Consumer/Job、状态、UoW、错误/恢复、幂等、配置、观测和 event-zero 契约。 |
| `04-配置设计.md` §9～§12 | fail-fast/fail-closed、configured/enabled/ready、redaction、rollback 和 evidence 边界。 |
| `05_test_plan_step_05_traceability_coverage.md` | 需求→设计→CUT→TC/EV 候选双向关系。 |
| `05_test_plan_step_06_cases.md` | `TC-RUN-*`、18 个 P0 切口和正式断言。 |
| `05_test_plan_step_09_automation_gates.md` | blocking suite、gate/check/report 和故障分类。 |
| `05_test_plan_step_10_nonfunctional.md` | 安全、恢复、依赖、观测、性能和跨平台专项红线。 |

### 2.3 非目标

- 不把缺陷级别当作 Runner 业务状态、owner outcome 或验收 verdict。
- 不因测试脚本自身故障伪造业务缺陷；此类情况先分类为 `harness_infra_failure`/`not_run`，修复脚本后生成新 run。
- 不用旧 `05/06` 的 S/A/B 定义、旧对象或旧性能数字覆盖新版契约。
- 不提前创建缺陷系统、issue、artifact、report、evidence 或风险签字。
- 不将 P1/P2 的真实跨仓 unavailable、无来源性能 sample 或 UX 文案问题降格/升级为 P0 通过结论。

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 哪些缺陷属于 S 级阻断？ | 任一 `AC-RUN-*` 禁止条件命中且破坏安全主链；`latest`/隐式选择放行；未获 authority 或 integrity 未验证仍下载/请求；accepted/ACK/PID/端口被显示为 Running/Confirmed/Cleaned；Query 写入、Consumer 解析/ACK、Job 修复 owner truth、Runner 产生 outbound event；Unknown/commit-unknown 自动 replay；保护材料被误删；raw secret/body/path/URL/PID/port/stack 泄露；私有 SDK/backend 或 sibling 源码依赖；配置 silent fallback/half facade；静态 evidence/report 宣告通过或缺 raw artifact/report 配对。 |
| 哪些可以风险接受？ | 只有明确的 P1/P2、future product-like 环境 unavailable、无正式 authority 的探索性性能趋势、非核心 UX/可读性或范围外能力；必须有残余风险和接受角色。P0 truth、redaction、dependency boundary、config fail-closed、evidence integrity 不可接受。 |
| 修复后要跑哪些？ | 原失败 TC 必跑；同一 CUT 的正/负/边界/Unknown 代表必跑；共享 contract/state/UoW/idempotency/config/redaction/dependency/report 变更需扩大到相关 blocking suite；安全/证据类缺陷必须复跑对应 check。 |
| 关闭需要什么证据？ | 失败与修复前后固定 `<run_id>`、suite artifact/report、TC 与 CUT 映射、影响/根因/修复说明、相关 redaction/dependency/pairing check、回归结果和防回归决定；未真实执行不得标为 closed/pass。 |
| 何时新增自动化？ | 手工发现 P0、release smoke 发现而低层 suite 未发现、redaction/dependency/report audit 漏检、duplicate/Unknown/cleanup race 复现或 P1/P2 升为 P0 时，必须新增或下沉 deterministic assertion/check。 |

## 4. 缺陷分级总表

| 级别 | 定义 | Runner 例子 | 处理要求 | 是否阻断 |
|---|---|---|---|---|
| `S` | 一票否决、安全/真相/证据完整性破坏，或 P0 blocking gate 证明核心边界失守 | `latest` 放行；未验证材料进入请求；accepted 显示 Running；Query/Job 反写 truth；Unknown 重放；保护材料删除；raw secret 泄露；私有 Sandbox/SDK 依赖；静态 EV/report 伪造 | 必须修复；扩大复验；不得风险接受；需相关 gate/check 和人工审查 | 是 |
| `A` | P0 用例或 blocking suite 失败，但未命中 S 红线；或实现/测试 harness 使安全语义暂不能稳定证明 | 某 flow 缺 safe issue ref；projection stale 标记不稳定；controlled fault 结果不确定 | 必须修复；只有证明不影响 P0 且有明确接受人时才可临时接受；通常阻断发布 | 通常是 |
| `B` | 非 P0、局部可读性、维护性或已批准 P1/P2 范围问题 | UX 文案不清但没有安全误导；future product profile unavailable；探索性性能趋势无正式阈值 | 排期或记录 residual；不得改变 P0 结果 | 否 |
| `R` | 已确认范围外或等待 authority 的残余风险 | 生产容量、真实跨仓 recovery、平台支持矩阵、长期 retention | 登记影响、缓解、触发条件和接受角色；不声称已验证 | 否 |

## 5. S 级一票否决判定矩阵

| 触发条件 | 设计/需求来源 | 判定 |
|---|---|---|
| 缺 actor/scope/context 或使用 `latest`/默认选择仍取得/运行 | `FR-RUN-001/002`、`BR-RUN-001~005`、`AC-RUN-001` | S |
| authority 缺失/过期/撤销/冲突却放行 | `BR-RUN-002`、`AC-RUN-002` | S |
| transfer/complete 被当作 verified/qualified | `FR-RUN-003/004`、`AC-RUN-003/004` | S |
| accepted、ACK、PID、端口或 toast 被显示为 Running/terminal success | `BR-RUN-005`、`AC-RUN-005/006` | S |
| stop/cancel/cleanup 绕过 lease/guard/retention/orphan 保护 | `FR-RUN-007/009`、`AC-RUN-008` | S |
| 断线/重启/lease mismatch 自动 replay/resend/reclaim/resume | `FR-RUN-010`、`AC-RUN-009`、03 §11/§12 | S |
| preview/diagnosis/handoff 输出 raw body/secret/full sensitive ref 或伪装 evidence/verdict | `FR-RUN-011~013`、`AC-RUN-010`、03 §14 | S |
| Runner 修改 Release/Governance/Runtime/Sandbox/Observability/Archive truth | `FR-RUN-005~010`、`AC-RUN-011`、01/03 boundary | S |
| Query 产生 reserve/save/refresh/reconcile/dispatch/cleanup；Consumer parse/hash/store/ACK；Job repair owner | 03 §8～§15、CUT-09/14/15/18 | S |
| 任一 Runner outbound event 或私有 bus/topic/private implementation 依赖 | 03 §7.4、CUT-18、`RUN-UP-008` | S |
| 配置 invalid silent fallback、fake 跨 profile 污染或 core capability 不足仍暴露 facade | 04 §6/§9/§11、CUT-16 | S |
| artifact/report/evidence 静态宣告 pass、缺 raw artifact、run mismatch、`latest` 引用或 redaction scan 失效 | Step 9/10、Step 13 contract | S |

S 级触发不得通过“测试未执行”“上游 ACK”“本地日志成功”或风险接受语句降级。

## 6. 风险接受与升级规则

| 情况 | 是否可接受 | 条件/动作 |
|---|---|---|
| S 级或任一上述一票否决 | 否 | 修复并复验；阻断所有后续 release/acceptance。 |
| P0 redaction、dependency、config fail-closed、evidence integrity | 否 | 必须修复并复跑对应 scan/gate。 |
| P0 blocking suite assertion failure | 原则上否 | 只有证明是脚本/harness 自身问题、P0 语义有独立真实 artifact 支撑且新 run 已重跑时，才可暂记 A；不能关闭 S 红线。 |
| A 级 | 有条件 | 测试负责人和验收责任方明确接受人、期限、影响和回归计划；release 前通常阻断。 |
| B 级 | 是 | 不影响 P0；纳入排期或残余风险。 |
| R 级/上游 blocker | 是（以 blocked 记录） | 不计测试通过；写入 Step 14/06 待确认，指定 owner/触发条件。 |
| 无正式性能阈值的 sample | 是（仅记录） | 只能作为 exploratory trend，不能产生 fail/pass 或 S/A。 |

## 7. 修复后复验矩阵

| 缺陷触发面 | 原失败 + 同 family 用例 | 必跑 suite/check | 额外边界 |
|---|---|---|---|
| context/selector/authority/integrity | `TC-RUN-CTX-*`、`TC-RUN-SELECT-*`、`TC-RUN-ACQ-*`、`TC-RUN-INTEGRITY-*` | `S-RUN-CONTRACT`、`S-RUN-DOMAIN`、`S-RUN-SERVICE`、`S-RUN-CONFIG` | `latest`/scope/generation/authority mismatch、zero owner call |
| request/control/owner projection | `TC-RUN-REQ-*`、`TC-RUN-CTL-*`、`TC-RUN-OWN-*` | SERVICE、CONTROLLED、ENTRY | accepted/pending/unknown/Running separation、no truth write |
| resource/cleanup/recovery | `TC-RUN-RES-*`、`TC-RUN-REC-*` | DOMAIN、UOW、JOB、REPLAY | guard/lease/epoch、commit unknown、no replay/no delete |
| preview/diagnosis/handoff | `TC-RUN-PRE-*`、`TC-RUN-OBS-*` | CONTRACT、SECURITY、REPLAY | forbidden corpus、low-cardinality、local≠evidence |
| Query/no-write/projection | `TC-RUN-QRY-*`、`TC-RUN-UOW-005/006` | SERVICE、ENTRY、UOW、SECURITY | all representative Query writes = 0 |
| protocol/entry/Consumer | `TC-RUN-CON-*`、`TC-RUN-ENT-*`、`TC-RUN-CNS-*` | CONTRACT、ENTRY、CONSUMER | metadata/name-body/header-first/duplicate/no ACK |
| idempotency/UoW/Job | `TC-RUN-IDM-*`、`TC-RUN-UOW-*`、`TC-RUN-JOB-*` | SERVICE、UOW、JOB、REPLAY | same/different digest、claim/checkpoint, stored result |
| config/readiness/dependency | `TC-RUN-CFG-*`、dependency cases | CONFIG、CONTROLLED、SECURITY | strict JSON、profile isolation、configured≠ready、boundary scan |
| report/evidence integrity | affected candidate case + report audit cases | SECURITY、REPLAY、future evidence check | fixed run id、raw artifact/report pairing、no static evidence |

修复若改变共享对象、状态、协议、metadata、idempotency、projection、redaction、配置 schema 或依赖方向，不能只复验单个失败 case；必须扩大到受影响 family 及其 P0 gate。

## 8. 缺陷关闭证据清单

| 关闭输入 | S | A | B/R |
|---|---|---|---|
| 缺陷描述、影响面、根因/修复说明 | 必需 | 必需 | 必需 |
| 失败前固定 `run_id`、artifact、report | 若实际执行过则必需 | 若实际执行过则必需 | 有执行才需 |
| 修复后固定 `run_id`、相关 TC/suite report | 必需 | 必需 | 相关时 |
| redaction/dependency/report-pairing check | 安全/证据类必需；相关缺陷必需 | 相关时必需 | 可选 |
| 复验范围与未执行项 | 必需 | 必需 | 必需 |
| 新增防回归测试或不新增的理由 | 必需 | 必需 | 相关时 |
| 风险接受人、期限、触发条件 | 不允许 S 接受 | 若接受必需 | R/B 必需 |
| Step 13 EV/AC 关联更新 | 影响 evidence 时必需 | 影响 evidence 时必需 | 可选 |

没有真实 artifact/report/run_id 的设计阶段记录只能标记 `planned/blocked`，不能以静态表关闭缺陷。

## 9. 自动化防回归规则

| 触发 | 必须新增/修改 |
|---|---|
| 手工发现 P0 或 UX 发现安全误导 | 将最小断言下沉到 Contract/Domain/Service/Entry 对应 suite，补 TC/EV candidate 映射。 |
| release/组合 smoke 发现而 lower suite 未发现 | 把触发条件下沉到最早风险层，并加入 main/PR blocking gate。 |
| redaction 漏检或 scan 器失效 | 扩展 forbidden-field corpus、deny rule、artifact/report 双面扫描和 failure test。 |
| private dependency/SDK bypass 漏检 | 扩展 dependency graph/import/call boundary check，加入 `S-RUN-SECURITY`。 |
| report/evidence pairing、静态 pass 或 `latest` 漏检 | 增加 fixed-run link audit、raw artifact existence 和 no-static-evidence check。 |
| duplicate/commit-unknown/claim race/cleanup 误判 | 增加 deterministic fault profile、call ledger 和 zero-side-effect assertion。 |
| P1/P2 变成 P0 或上游合同发生变化 | 先回写 Step 2/5/6/8/9/10，再新增 scope/data/environment/gate。 |

## 10. 缺陷停审与跨缺陷审计

| 审计项 | 结论 | 缺口/修正 |
|---|---|---|
| S/A/B/R 是否可判定 | 通过（设计层） | 例子与处理要求已绑定 Runner 需求/切口。 |
| 一票否决是否不可降级 | 通过 | S 触发不得由 blocked、ACK 或本地记录掩盖。 |
| 风险接受是否越过 P0 | 无 | 仅 B/R 或受控 A；P0 truth/security/evidence 不可接受。 |
| 修复复验是否覆盖原 case、family、suite/check | 通过 | §7 映射 18 CUT 的主要风险族。 |
| 关闭是否需要真实证据 | 通过 | 固定 run/artifact/report；无执行只能 planned/blocked。 |
| 缺陷结果是否会反写 owner truth | 无 | 缺陷管理不改变 Runner/上游业务状态。 |
| 自动化防回归是否明确 | 通过 | §9 覆盖手工、release、redaction、dependency、evidence 和 race 漏检。 |
| 性能无来源数字是否误成缺陷 | 无 | 仅 exploratory/residual，不产 S/A。 |

## 11. 结构化回填草稿

正式 §11 应收录：S/A/B/R 分级、Runner 一票否决矩阵、风险接受边界、按影响面复验矩阵、关闭证据清单和自动化防回归规则。正文只写规则与计划，不写实际缺陷数量、修复结果、run_id、artifact、report、EV 或 verdict。

## 12. 待确认与持续 blocker

| 项 | 影响 | 当前处理 |
|---|---|---|
| 缺陷平台字段、通知和角色命名 | 实施管理细节未定 | 留给 07/项目流程，不在 05 猜测。 |
| S/A 关闭的人工签署要求 | 影响验收流程 | Step 13/新版 06 再确定；当前 S 不可接受。 |
| NFR 性能阈值 | 可能改变 B/R→A/S | authority 未提供前仅 exploratory；若硬化需回写 Step 10/12/14。 |
| 上游 positive seam、durable store、实现仓 | 复验环境与真实 artifact 不可用 | 保持 `RUN-UP-*`、`RUN-DDD-*` 为 blocked。 |

## 13. Step 11 进入下一步门禁

- [x] S/A/B/R 分级和 Runner 专属例子可判定。
- [x] `AC-RUN-*`/`BR-RUN-*`/03/04 红线已映射 S 级，不可风险接受。
- [x] 原失败 TC、同 family、相关 suite/check 的复验矩阵明确。
- [x] 缺陷关闭要求固定 run/artifact/report 和 redaction/dependency/pairing 证据。
- [x] 手工发现、release 漏检和安全/证据缺口的自动化防回归触发明确。
- [ ] 缺陷执行、修复、复验、artifact、report、evidence、verdict、signoff：未发生，不作为本 Step 条件。

Step 11 完成，允许进入 Step 12；正式 `05-测试方案.md` 仍不可写。
