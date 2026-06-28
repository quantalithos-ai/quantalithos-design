# Step 14. 定义回归策略与残余风险

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 14
> 回填章节: `05-测试方案.md` §14 回归策略与残余风险
> 创建日期: 2026-06-28
> 当前模式: full-restart / step14-regression-risks
> 当前状态: completed
> 当前模块: `R14.2 regression / residual risks:再写入`
> 当前门禁: `R14.2` completed_wait_user_confirm_to_R15.1;等待确认进入 Step 15 `R15.1 formal document assembly:先思考`

---

## 0. Step 13 handoff

Step 13 已确认当前 `05-测试方案.md` 的测试报告与证据归档输入:

- P0 suite / check 证据必须由 fixed `<run_id>` 下的 raw artifact 与 generated human report 配对形成。
- raw artifact root 方向为 `artifacts/test/<run_id>/...`,human report root 方向为 `reports/runs/<run_id>/...`。
- acceptance handoff / risk acceptance / review 补充只能作为后续 `06-验收标准.md` 和审查输入,不能在测试方案内裁决 release verdict。
- `EV-ML-*` 证据族必须能回指 `TC-ML-*`、suite/check family、artifact root、report path 和后续验收引用方向。
- failed / timeout / unavailable suite 也必须保留 safe failure reason、已执行 case result direction 和 suite report direction。
- redaction、dependency、report integrity、no latest、no static evidence、raw artifact/report pairing 属于 P0 evidence integrity 红线。
- P1/P2 selected-run、real-like adapter、production-like capacity、长期归档天数和硬性能阈值仍是 residual / downstream closure,不得计入 P0 pass。

Step 14 的任务是把 Step 6 的用例族、Step 9 的 suite/gate、Step 10 的专项边界、Step 11 的缺陷复验、Step 12 的进出准则和 Step 13 的证据归档,收敛成“什么变更触发哪些回归、哪些风险必须记录并交给验收接受”的中间产物。

---

## R14.1 regression / residual risks:先思考

### 1. 当前模块目标

`R14.1` 只思考 Step 14 的开工边界、必读文档、SOP 五问、L1-governance Step 14 框架参考、L3-method-library 的回归触发轴、最小 / 全量回归候选、残余风险分类、不可风险接受项、必须转入新版 `06-验收标准.md` 的事项、回归证据交接和 `R14.2` 写入边界。

当前模块不写最终回归触发表、不写最终残余风险表、不执行回归、不填写真实缺陷状态、不裁决 release pass / fail、不固定验收 VETO / AC ID、不定义 implementation CI、脚本实现、required check、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R14.2 |
| 用户确认 | 已确认从 Step 13 completed 推进到 Step 14 `R14.1`。 |
| 当前允许 | 思考回归触发、最小回归、全量 P0 回归、residual 风险、风险接受角色、转入 `06` 事项和回归证据归档。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写最终回归 / 风险表;执行测试;写真实 pass/fail;写验收标准、实施计划、CI YAML、脚本实现或 implementation code。 |

### 2. Step 14 启动前必须承接

| 输入 | 必须承接的内容 | 禁止继承 / 禁止提前 |
|---|---|---|
| `project_execution_ledger.md` | 当前恢复点、单模块推进和正式 05 不得跳写。 | 跳过 R14.1 直接写完整 Step 14 或正式 `05`。 |
| `05_test_plan_calibration_flow.md` | Step 1~13 completed,Step 14 in_progress,Step 15 blocked。 | 一次性进入 Step 15 正式装配。 |
| `05_test_plan_step_06_cases.md` | 83 条唯一 `TC-ML-*` 候选用例、五个 P0 用例批次、P1/P2 phase 边界。 | 新增 TC、改写断言或把 residual 写成 P0 pass。 |
| `05_test_plan_step_09_automation_gates.md` | P0 blocking suite、release check、P1 selected-run、release smoke representative only、artifact/report direction。 | 定义 CI YAML、required check 或脚本实现。 |
| `05_test_plan_step_10_nonfunctional.md` | redaction、dependency、observability、performance sample/trend、P0/P1/P2 边界。 | 把无来源性能数字硬化为 pass/fail 阈值。 |
| `05_test_plan_step_11_defects_retest.md` | S/A/B/R 缺陷分级、修复后复验、自动化防回归触发、风险接受边界。 | 用 Step 14 重写缺陷分级或新增用例。 |
| `05_test_plan_step_12_entry_exit.md` | 进入 / 退出阻断项、P0 redline 不可风险接受、residual 处理方向。 | 在 Step 14 改写进入 / 退出准则。 |
| `05_test_plan_step_13_evidence.md` | `EV-ML-*` 证据族、artifact/report pairing、failed suite 留证、risk acceptance report 方向。 | 定义 machine artifact JSON schema 或验收 verdict。 |
| SOP Step 14 | 固定五问、回归触发表、残余风险表和进入下一步条件。 | 只写口号式“修复后回归”。 |
| 书写规范 §5.14 | 固定回归触发表和残余风险表格式。 | 不列接受人或待确认项。 |
| L1-governance Step 14 | 参考回归触发、全量回归、不可接受风险、转入 `06` 的框架深度。 | 复制 `TC-GOV-*`、`EV-GOV-*`、`VF-GOV-*` 或 governance 领域事实。 |

### 3. SOP Step 14 五问思考边界

| SOP 问题 | R14.1 初判 | R14.2 写入提醒 |
|---|---|---|
| 哪些变更触发最小回归? | requirements / design / contract / domain / flow / state / UoW / config / dependency / redaction / evidence 等局部变更,至少触发受影响 TC family、所属 suite、相邻 suite 和相关 release audit。 | R14.2 写变更类型到最小回归集表。 |
| 哪些变更触发全量回归? | truth owner、Definition vs Use、formal version、state matrix、UoW / replay、query no-write、job no truth repair、config redline、redaction、dependency、evidence integrity、S 级修复等必须触发全量 P0 regression。 | R14.2 写全量 P0 回归集和触发条件。 |
| 哪些风险暂不覆盖? | P1 real-like selected-run、真实外部产品 / vendor、production-like capacity、硬性能 P95/SLO、multi-region/tenant、advanced package / dashboard、长期归档天数和未固定验收 ID。 | R14.2 写 residual 风险表,不得计入 P0 pass。 |
| 谁接受残余风险? | 当前只能写角色级接受人或待确认项:验收负责人、架构负责人、测试负责人、产品负责人、合规负责人等。 | 具体个人、签署状态和 verdict 留新版 `06` 或 acceptance report。 |
| 哪些风险必须转入验收标准? | VETO / AC ID、risk acceptance role、P1 selected-run 是否强制、性能阈值是否硬化、retention period、real adapter gate、production-like capacity gate 必须转入新版 `06`。 | R14.2 写转入事项表,不裁决。 |

### 4. L1-governance Step 14 框架参考思考

L1-governance Step 14 的可借鉴点是“把变更类型映射为最小回归 / 全量回归,再把未覆盖项集中为 residual 风险并交给验收标准”。L3 采用表格密度、触发条件和风险不隐藏原则,不复制 governance 领域对象、编号或验收红线。

| L1 框架点 | L3 采用方式 | L3 禁止 |
|---|---|---|
| 输入基线先声明 | L3 承接 Step 6 / 9 / 10 / 11 / 12 / 13。 | 用旧 `05/06/07` 反推回归范围。 |
| 局部变更触发最小回归 | L3 按 TC family、suite family、release audit 思考。 | 只跑单个失败测试就关闭 P0 风险。 |
| 红线变更触发全量 P0 回归 | L3 按 truth / boundary / version / UoW / redaction / dependency / evidence integrity 收口。 | 把 release smoke 当作底层 suite 替代。 |
| residual 风险集中列出 | L3 将 P1/P2、future、product-neutral 和未闭口验收项集中交给 `06`。 | 把 residual 写成已验证或 P0 passed。 |
| 不可接受项单独列出 | L3 对 source missing stop、raw leak、static evidence、query write、job truth repair 等单独思考。 | 给 P0 redline 设置普通风险接受。 |

### 5. L3 回归触发轴思考

| 触发轴 | 主要承接来源 | R14.1 初判 |
|---|---|---|
| requirement / business rule / acceptance direction | `00`;Step 5;Step 6 | 影响 FR/BR/NFR 的变更至少触发受影响 TC family、traceability review 和 release summary audit。 |
| architecture / dependency boundary | `01`;Step 9/10 | 编译依赖、truth owner、Definition vs Use 或 data ownership 改动需带 dependency-boundary 和 affected suite。 |
| object / contract / protocol | `03` §6~§8;Step 6 | typed ref、public shell、DTO、reason/safe issue、protocol surface 改动需带 contract-domain-fast 和 service-flow-fast。 |
| function flow / state / consistency | `03` §8~§12;Step 6/11 | command/query/job/inbound/outbound、state transition、UoW、idempotency、replay 变更需带所属 suite和相邻 suite。 |
| config / adapter availability | `04`;Step 8/9/10 | profile、config source、adapter availability、forbidden configurable boundary 变更需带 config-redline 和 dependency checks。 |
| redaction / observability / evidence | Step 10/13 | raw body/secret、metric label、trace/audit refs-only、artifact/report pairing、no static evidence 变更需带 redaction / report audit。 |
| defect fix / manual discovery | Step 11 | 原失败 TC、同 family、所属 suite、相关 release check 必须回归;手工发现 P0 要触发防回归候选。 |

### 6. 最小 / 全量回归候选思考

| 回归层 | R14.1 候选 | 注意事项 |
|---|---|---|
| 最小回归 | 原失败或受影响 TC family + owning suite + 相邻 suite + relevant release audit。 | 不能只跑单测或只跑 release smoke。 |
| suite 相邻关系 | contract/domain 变更带 service;service 变更带 entry/job/report;job 变更带 operations replay/report audit;config 变更带 dependency/redaction。 | R14.2 需转成表格。 |
| 全量 P0 regression | `contract-domain-fast`;`service-flow-fast`;`infra-runtime-fake`;`entry-worker-job`;`operations-replay-core`;`config-redline`;`dependency-boundary`;`redaction-boundary`;`observability-boundary`;`report-generation-audit`;`release-main-smoke`;release audit checks。 | release smoke 仅 representative,不得替代底层 suite。 |
| P1 selected-run | `p1-real-like-selected-run` 只在明确启用时运行。 | unavailable 只能进入 residual,不得算 P0 pass。 |
| extended / fault injection | `operations-replay-extended`;`fault-injection-matrix` 可作为 nightly / expanded regression。 | 当前不作为所有 P0 变更必跑项。 |

### 7. 残余风险思考

| 风险族 | 当前判断 | R14.2 写入提醒 |
|---|---|---|
| real-like / durable adapter selected-run | P1 residual;产品和环境未锁定时不阻断 P0。 | 接受人角色待确认。 |
| external provider / vendor behavior | P1/P2 residual;P0 只证明 controlled seam 和 body-free boundary。 | 真实 vendor 验证留后续。 |
| production-like capacity / long-run | P2 residual;当前无正式容量模型。 | 不写硬阈值。 |
| performance P95 / SLO | 当前只保留 sample/trend。 | 若硬化需新版 `06` 定义环境、负载和阈值。 |
| advanced package / method set / marketplace / dashboard | peripheral / future residual。 | 不阻断 core truth / formalization / consumption / traceability P0。 |
| evidence retention period | 当前只要求保留到验收和缺陷复验关闭。 | 具体天数留 `06` / 运维归档策略。 |
| acceptance ID / VETO closure | 新版 `06` 尚未重启。 | Step 14 只列转入事项。 |

### 8. 不可风险接受项思考

| 不可接受项 | 原因 |
|---|---|
| 方法资产定义 truth 不归属本仓或下游替代定义 | 破坏仓定位和 Definition vs Use。 |
| 正式版本语义静默覆盖或未正式化资产被正式消费 | 破坏 version stability 和 formalization boundary。 |
| source-missing stop 被 fixture / private map / raw string 私补 | 违反设计真相源闭环和可落码性。 |
| query / job / observability 反写真相或修复 truth | 破坏 read / operations boundary。 |
| raw body、secret、full sensitive ref 进入 log / trace / report / artifact | P0 redaction 红线。 |
| non-core sibling compile dependency 或依赖方向反转 | P0 dependency boundary 红线。 |
| artifact/report pairing 缺失、`latest` 引用或 static evidence 伪 pass | P0 evidence integrity 红线。 |
| P0 profile unavailable 却标记 passed | 破坏 release gate 可信性。 |

### 9. 回归证据交接思考

| 回归类型 | 证据交接方向 |
|---|---|
| 最小回归 | 必须按 Step 13 产出 fixed `<run_id>` 的 raw artifact、suite report、evidence index 和 regression scope 说明方向。 |
| 全量 P0 回归 | 必须生成完整 `reports/runs/<run_id>`、redaction/dependency/report audit、release summary 和 acceptance handoff 初稿方向。 |
| 缺陷复验 | 必须关联 failed run、fixed run、原 TC、同 family、所属 suite、修复说明和是否新增防回归方向。 |
| residual review | 必须进入 `reports/acceptance/risk-acceptance.md` 或 `reports/review/*` 方向,不得写成 P0 evidence pass。 |

### 10. R14.2 写入边界思考

`R14.2 regression / residual risks:再写入` 可以写入:

1. Step 14 必读文档表和读取状态。
2. Step 13 handoff 承接表。
3. SOP Step 14 五问回答。
4. L1-governance Step 14 框架参考边界。
5. L3 回归触发表候选,包括变更类型、最小回归集、全量回归触发条件和责任人角色。
6. 全量 P0 回归集、最小回归选择规则、P1 selected-run / extended regression 边界。
7. 残余风险表、不可风险接受项、必须转入新版 `06-验收标准.md` 的事项。
8. 回归证据归档规则、回归停审、跨回归 / residual 风险审计和 Step 15 进入门禁。

`R14.2` 禁止写入:

1. 正式 `05-测试方案.md`。
2. 实际测试执行、真实 run_id、真实缺陷状态、release verdict、验收 pass/fail 或风险签署结果。
3. 新增 TC、DS、EV、artifact JSON schema、case schema、assertion key、config key、mapper、port、state、marker source 或 phase boundary。
4. CI YAML、脚本实现、required check、实现仓命令、实施计划或 implementation code。
5. 旧 `05/06/07` 的旧对象、旧 suite、旧验收项或旧实施边界。

### 11. R14.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 Step 14 回归策略与残余风险边界 | pass |
| 是否承接 Step 6 / Step 9 / Step 10 / Step 11 / Step 12 / Step 13 已确认输入 | pass |
| 是否读取并对照 SOP Step 14 和书写规范 §5.14 | pass |
| 是否参考 L1-governance 框架但未复制 governance 领域事实 | pass |
| 是否形成 L3 回归触发轴、最小 / 全量回归、residual、不可接受项和证据交接思考 | pass |
| 是否形成 R14.2 写入边界 | pass |
| 是否未写最终回归表、最终残余风险表、验收标准、实施计划或 implementation code | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 14 `R14.2 regression / residual risks:再写入`;只允许写入 Step 14 必读文档表、Step 13 handoff 承接、SOP 五问回答、L1-governance 框架参考边界、L3 回归触发表、全量 P0 回归集、最小回归选择规则、残余风险表、不可风险接受项、必须转入新版 `06-验收标准.md` 的事项、回归证据归档规则、回归停审、跨回归 / residual 风险审计和 Step 15 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写实际执行结论、验收标准、实施计划或 implementation code。

---

## R14.2 regression / residual risks:再写入

### 1. 当前模块写入目标

`R14.2` 将 R14.1 的思考固化为 Step 14 的回归策略与残余风险中间产物。当前模块只写 Step 14 必读文档、Step 13 handoff、SOP 五问、L1-governance 框架参考边界、L3 回归触发表、全量 P0 回归集、最小回归选择规则、残余风险表、不可风险接受项、必须转入新版 `06-验收标准.md` 的事项、回归证据归档规则、回归停审、跨回归 / residual 风险审计和 Step 15 进入门禁。

当前模块不修改正式 `05-测试方案.md`,不执行回归,不填写真实 run_id、缺陷状态、验收 verdict、release sign-off、CI YAML、脚本实现、required check、实施计划或 implementation code。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R15.1 |
| 用户确认 | 已确认从 `R14.1` 推进到 `R14.2`。 |
| 当前允许 | 写入回归触发、全量 P0、最小回归选择、residual、不可接受项、转入 `06` 事项和回归证据归档。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写真实执行结果、验收 verdict、CI YAML、脚本实现、implementation code 或实施计划。 |

### 2. 必读文档表与读取状态

| 文档 | 读取状态 | Step 14 用途 | 当前裁决 |
|---|---|---|---|
| `project_execution_ledger.md` | 已读取并承接 | 确认当前恢复点、单模块推进和正式 05 不得跳写。 | 本轮只推进 `R14.2`。 |
| `05_test_plan_calibration_flow.md` | 已读取并承接 | 确认 Step 1~13 completed、Step 14 R14.1 completed、Step 15 blocked。 | `R14.2` 完成后等待 `R15.1`。 |
| `05_test_plan_step_14_regression_risks.md` | 已读取并承接 | 承接 R14.1 思考和 R14.2 写入边界。 | 不重写 R14.1。 |
| `05_test_plan_step_06_cases.md` | 已承接 | 提供 `TC-ML-*` 用例族、P0/P1/P2 phase 边界和 source-missing stop 用例。 | 不新增或改写 TC。 |
| `05_test_plan_step_09_automation_gates.md` | 已承接 | 提供 suite family、release gate、P1 selected-run、release smoke representative only 和 artifact/report direction。 | 不定义 CI YAML 或脚本实现。 |
| `05_test_plan_step_10_nonfunctional.md` | 已承接 | 提供 redaction、dependency、observability、performance sample/trend 和 P1/P2 residual。 | 不硬化无来源性能阈值。 |
| `05_test_plan_step_11_defects_retest.md` | 已承接 | 提供 S/A/B/R 缺陷分级、复验范围、自动化防回归和风险接受边界。 | 不重写缺陷流程。 |
| `05_test_plan_step_12_entry_exit.md` | 已承接 | 提供 P0 redline、退出阻断、residual 不计 P0 pass 和 source gap 处理。 | 不改写进出准则。 |
| `05_test_plan_step_13_evidence.md` | 已承接 | 提供 `EV-ML-*` 证据族、run-scoped artifact/report pairing 和 risk acceptance report 方向。 | 不定义 JSON schema 或验收 verdict。 |
| SOP Step 14 | 已读取 | 固定五问、回归触发表、残余风险表和进入下一步条件。 | 当前按要求输出中间产物。 |
| 书写规范 §5.14 | 已读取 | 固定回归触发表和残余风险表格式。 | 必须列责任人 / 接受人角色或待确认。 |
| L1-governance Step 14 | 已对照 | 参考表格密度、回归触发、全量 P0、不可接受风险和转入 `06` 框架。 | framework reference only。 |

### 3. SOP 五问回答

| SOP 问题 | Step 14 回答 |
|---|---|
| 哪些变更触发最小回归? | 影响 requirement / architecture / object / protocol / flow / state / UoW / config / dependency / redaction / report 的局部变更,至少触发受影响 `TC-ML-*` family、owning suite、相邻 suite 和相关 release audit。 |
| 哪些变更触发全量回归? | truth owner、Definition vs Use、formal version、public schema、state matrix、UoW / idempotency / replay、query no-write、job no truth repair、config redline、dependency、redaction、evidence integrity、source-missing stop 或 S 级修复变更时触发全量 P0 regression。 |
| 哪些风险暂不覆盖? | P1 real-like selected-run、真实外部产品 / vendor 行为、production-like capacity、硬性能 P95/SLO、multi-region / tenant、advanced package / marketplace / dashboard、长期归档天数和未固定验收 ID。 |
| 谁接受残余风险? | P0 红线不可接受;P1/P2 residual 由验收负责人、架构负责人、测试负责人、产品负责人或合规负责人在新版 `06` 或 `reports/acceptance/risk-acceptance.md` 中确认。当前未定具体人时列为待确认。 |
| 哪些风险必须转入验收标准? | VETO / AC ID、risk acceptance role、P1 selected-run 是否强制、performance threshold 是否硬化、evidence retention period、real adapter gate、production-like capacity gate 必须转入新版 `06-验收标准.md`。 |

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 6 | 用例族完整,但变更后的回归触发尚未集中定义。 | 本 Step 按变更类型映射 TC family 和 suite。 |
| Step 9 | suite/gate 已定义,但何时重跑和何时全量回归尚未集中定义。 | 本 Step 固定最小 / 全量回归触发。 |
| Step 10 | P1/P2、selected-run、sample/trend 和 nonfunctional residual 分散。 | 本 Step 汇总 residual 风险。 |
| Step 11 | 缺陷复验已定义,但非缺陷设计 / 配置 / 证据变更回归未集中定义。 | 本 Step 补非缺陷变更回归。 |
| Step 13 | 证据归档已定义,但回归 run 如何归档未集中说明。 | 本 Step 要求每次回归 run 按 Step 13 归档。 |

### 5. 回归策略设计取舍

| 议题 | 方案 | 当前取舍 |
|---|---|---|
| 所有变更是否都全量回归 | A. 全量;B. 风险分层最小回归 + 红线触发全量 | 采用 B。保持执行效率,但 P0 红线变更强制全量。 |
| 修复后是否只跑原失败用例 | A. 只跑原失败;B. 原失败 + same family + owning suite + related audit | 采用 B。L3 的 truth / boundary / evidence 风险跨 suite。 |
| release smoke 是否替代底层 suite | A. 可替代;B. 只作为 representative | 采用 B。release smoke 只汇总代表性闭环。 |
| P1 selected-run unavailable 是否阻断 P0 | A. 阻断;B. 记录 residual | 采用 B。P1 不计 P0 pass,也不替代 P0 controlled suite。 |
| 性能 sample 是否成为硬阈值 | A. 成为 pass/fail;B. sample/trend only | 采用 B。当前无正式负载模型和阈值。 |

### 6. 回归触发表

| 变更类型 | 最小回归集 | 全量回归触发条件 | 责任人 |
|---|---|---|---|
| requirement / BR / NFR / acceptance direction 变更 | 受影响 `TC-ML-*` family + traceability review + `release-main-smoke` representative + evidence index audit。 | FR-ML / BR-ML / NFR-ML / 验收方向语义改变 P0 范围或红线。 | 设计负责人 + 测试负责人 |
| architecture / truth owner / Definition vs Use 变更 | `dependency-boundary` + affected `contract-domain-fast` / `service-flow-fast` + `report-generation-audit`。 | truth owner、data ownership、Definition vs Use、compile dependency 方向或相邻仓职责变化。 | 架构负责人 |
| object / typed ref / public shell / protocol 变更 | `contract-domain-fast` + affected `service-flow-fast` + related redaction shell check。 | public DTO、typed ref、safe reason、schema version、body-free shell 语义变化。 | contracts 负责人 |
| definition / catalog / formalization / version 变更 | `contract-domain-fast` + `service-flow-fast` + relevant `EV-ML-CONTRACT-001` report audit。 | 方法资产定义 truth、formal state、version stability、formal consumption 语义变化。 | domain 负责人 |
| state matrix / invariant / policy guard 变更 | affected `TC-ML-STATE-*` / policy family + `contract-domain-fast` + `service-flow-fast`。 | legal / illegal transition、terminal state、state source 或 invariant 变化。 | domain 负责人 |
| command / query / controlled consumption flow 变更 | affected flow TC family + `service-flow-fast` + adjacent `entry-worker-job` 或 `operations-replay-core`。 | UoW ordering、duplicate replay、query no-write、consumer boundary、handoff seam 语义变化。 | application 负责人 |
| UoW / idempotency / replay / recovery 变更 | `infra-runtime-fake` + `service-flow-fast` + `operations-replay-core`;必要时 nightly extended。 | commit unknown、rollback、stored replay、checkpoint/report、no truth repair 语义变化。 | infra / jobs 负责人 |
| config source / profile / adapter availability 变更 | `config-redline` + `dependency-boundary` + affected runtime / fake suite。 | P0 profile、source priority、fail-fast/degraded、forbidden configurable boundary、required adapter slot 变化。 | config 负责人 |
| dependency boundary / external seam 变更 | `dependency-boundary` + affected seam suite + `redaction-boundary` if output changes。 | non-core sibling compile dependency、runtime/event/replay boundary 或 external body boundary 变化。 | 架构负责人 + adapter 负责人 |
| redaction / observability / diagnostic 变更 | `redaction-boundary` + `observability-boundary` + affected suite sample + release redaction check。 | raw body/secret/full sensitive ref、metric label、trace/span、audit/diagnostic safe surface 变化。 | observability 负责人 |
| report / evidence / artifact path 变更 | `report-generation-audit` + affected suite sample + Step 13 evidence index generation review。 | artifact/report pairing、no latest、no static evidence、acceptance handoff draft 逻辑变化。 | test tooling 负责人 |
| S 级缺陷修复或 source-missing stop 修复 | 原失败 TC + same family + owning suite + related P0 redline check。 | 任一 truth / redaction / dependency / evidence integrity / source-missing stop 修复。 | 缺陷 owner + 测试负责人 |

### 7. 全量 P0 回归集

全量 P0 regression 至少包含:

- `contract-domain-fast`
- `service-flow-fast`
- `infra-runtime-fake`
- `entry-worker-job`
- `operations-replay-core`
- `config-redline`
- `dependency-boundary`
- `redaction-boundary`
- `observability-boundary`
- `report-generation-audit`
- `release-main-smoke`
- release config / redaction / dependency / report audit checks
- Step 13 evidence index generation and review-ready acceptance draft

触发全量 P0 regression 的条件:

- `00/01/02/03/04` 对 truth owner、Definition vs Use、formal version、public surface、state matrix、UoW、idempotency、replay、job report、config redline、dependency、redaction 或 observability 的正式口径变化。
- 任一 S 级缺陷修复或 source-missing stop 被绕过后的修复。
- 任一 P0 blocking suite、release audit、artifact/report pairing、evidence index 或 acceptance handoff draft 生成逻辑变化。
- P1/P2 residual 被升级为 P0 范围。

### 8. 最小回归选择规则

| 规则 | 说明 |
|---|---|
| 原失败 TC 必跑 | 缺陷修复或设计变更影响的原始 `TC-ML-*` 必须回归。 |
| 同 family 必跑 | 同一 TC family 下的正向、负向、duplicate、no-write、degraded 或 failure representative 必须覆盖。 |
| owning suite 必跑 | 每个变更必须跑对应 primary suite,不能只跑 release smoke。 |
| 相邻 suite 必跑 | domain 变更带 service;service 变更带 entry/job/replay/report;config 变更带 dependency/redaction;report 变更带 affected suite sample。 |
| 红线 audit 必跑 | redaction、dependency、config redline、source-missing stop 和 evidence integrity 相关变更必须跑对应 blocking audit。 |
| 证据必须归档 | 每次回归 run 必须按 Step 13 产出 raw artifact、suite report、evidence index 和 regression scope 方向。 |
| P1 不替代 P0 | `p1-real-like-selected-run` 不得替代 fake/controlled P0 regression。 |

### 9. 残余风险表

| 风险 | 未覆盖原因 | 影响 | 缓解方式 | 接受人 |
|---|---|---|---|---|
| P1 real-like selected-run 不作为 P0 阻断 | 真实产品、环境和数据未锁定。 | 不能证明真实 adapter 端到端行为。 | P0 使用 fake / controlled seam;selected-run 可用时记录,不可用进入 residual。 | 验收负责人待确认 |
| durable storage / bus / external resolver 产品行为未覆盖 | 产品选型和部署基线未锁定。 | 不能证明具体产品性能、故障模式和兼容性。 | P0 证明 port / repository / seam 语义;产品绑定后补 P1/P2。 | 架构负责人待确认 |
| production-like capacity / long-run 未覆盖 | 无正式容量模型、负载模型和部署基线。 | 不能证明高并发、长期运行和容量边界。 | 只保留 sample/trend;容量基线后补 P2 或验收 gate。 | 架构负责人待确认 |
| performance P95 / SLO 未硬化 | 当前只有 sample/trend 方向。 | 不能按 numeric threshold 裁决 pass/fail。 | 若要硬化,新版 `06` 定义环境、负载和阈值。 | 验收负责人待确认 |
| advanced package / method set / marketplace / dashboard 未覆盖 | 当前为 peripheral / future 能力。 | 不能证明高级组合、交易发现或复杂 UI 体验。 | 不阻断 core truth / formalization / consumption / traceability P0。 | 产品负责人待确认 |
| external provider / vendor deep behavior 未覆盖 | 外部系统不是当前 P0 依赖。 | 不能证明真实 vendor API 兼容性。 | P0 只证明 controlled seam、body-free boundary 和 unavailable marker。 | 验收负责人待确认 |
| evidence retention period 未固定 | 属于验收 / 运维归档策略。 | 不能证明长期审计保留满足外部要求。 | Step 13 要求保留到验收和缺陷复验关闭;具体天数进新版 `06`。 | 验收负责人待确认 |
| acceptance AC / VETO 正式 ID 未固定 | 新版 `06-验收标准.md` 尚未重启。 | 当前只能写验收引用方向,不能裁决 verdict。 | Step 14 列转入事项;新版 `06` 固定裁决矩阵。 | 验收负责人待确认 |

### 10. 不可风险接受项

| 项 | 处理 |
|---|---|
| 方法资产定义 truth 不归属本仓或下游替代定义 | 必须修复并全量 P0 regression。 |
| 正式版本语义静默覆盖或未正式化资产被正式消费 | 必须修复并回归 contract/domain、service flow 和 release smoke。 |
| source-missing stop 被 fixture / private map / raw string 私补 | 必须停审回设计真相源,不得由实现或测试补口。 |
| query / job / observability 反写真相或修复 truth | 必须修复并回归 affected suite + operations replay。 |
| raw body、secret、full sensitive ref 进入 log / trace / report / artifact | 必须修复并复跑 redaction-boundary 和 release redaction check。 |
| non-core sibling compile dependency 或依赖方向反转 | 必须修复并复跑 dependency-boundary。 |
| artifact/report pairing 缺失、`latest` 引用或 static evidence 伪 pass | 必须修复并复跑 report-generation-audit,不得送验。 |
| P0 profile unavailable 却标记 passed | 必须修复,不得风险接受。 |

### 11. 必须转入新版 `06-验收标准.md` 的事项

| 事项 | 转入原因 | 建议 `06` 收口 |
|---|---|---|
| AC / VETO 正式 ID 和通过 / 不通过裁决 | `05` 只定义测试和证据。 | 建立 `EV-ML-*` / AC / VETO 裁决矩阵。 |
| P1 selected-run 是否强制 | 当前为 residual / selected-run。 | 明确某 release candidate 是否必须跑 selected-run。 |
| performance hard threshold | 当前只有 sample/trend。 | 若要 pass/fail,定义环境、负载、阈值和证据。 |
| evidence retention period | 当前不固定天数。 | 定义保留周期、归档介质和责任角色。 |
| risk acceptance approval role | 当前用角色待确认。 | 固定接受人角色、签署条件和阻断关系。 |
| production-like / capacity gate | 当前为 P2 residual。 | 明确何时升级为 P0/P1/P2 gate。 |
| real adapter / external provider certification | 当前 product-neutral。 | 产品绑定后定义追加验收项。 |

### 12. 回归证据归档规则

| 回归类型 | 证据要求 |
|---|---|
| 最小回归 | 按 Step 13 产出 fixed `<run_id>` raw artifact、suite report、evidence index 和 regression scope。 |
| 全量 P0 回归 | 产出完整 `reports/runs/<run_id>`、release summary、redaction/dependency/report audit 和 acceptance handoff 初稿。 |
| 缺陷复验 | 记录 failed run、fixed run、原 TC、same family、owning suite、修复说明和防回归新增方向。 |
| residual review | 产出 `reports/acceptance/risk-acceptance.md` 或 `reports/review/*` 补充,不得计入 P0 passed evidence。 |
| P1 selected-run unavailable | 产出 unavailable / residual marker direction,不得写成 P0 pass 或 release blocker。 |

### 13. 回归停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 变更类型是否均有最小回归集 | pass | §6 |
| 全量 P0 回归触发是否明确 | pass | §7 |
| 最小回归是否避免 release smoke 替代底层 suite | pass | §8 |
| residual 是否有接受人角色或待确认项 | pass | §9 |
| 不可接受 P0 红线是否明确 | pass | §10 |
| 必须转入新版 `06` 的事项是否明确 | pass | §11 |
| 回归证据是否承接 Step 13 | pass | §12 |

### 14. 跨回归 / residual 风险审计

| 审计项 | 结论 | 处理 |
|---|---|---|
| 是否存在无回归触发的 P0 变更 | pass | 回归触发表已覆盖需求、架构、对象、flow、state、config、dependency、redaction、report 和缺陷修复。 |
| 是否把 P1/P2 unavailable 写成 P0 pass | pass | P1 selected-run 和 production-like 均为 residual。 |
| 是否把性能 sample 写成硬阈值 | pass | 只保留 sample/trend,硬阈值转新版 `06`。 |
| 是否存在 residual 无接受人 | pass | 当前均列角色待确认。 |
| 是否存在可接受 P0 redline | pass | §10 全部不可接受。 |
| 是否可被实施计划引用 | pass | §6 / §7 / §8 可转为后续实施 gate 输入,但当前不写实施计划。 |
| 是否可被新版 `06` 引用 | pass | §9 / §11 明确 residual 和转入事项。 |

### 15. Step 14 completed stop-review

| 检查项 | 结果 |
|---|---|
| 是否输出 SOP 要求的回归触发表 | pass |
| 是否输出 SOP 要求的残余风险表 | pass |
| 是否明确最小 / 全量回归触发条件 | pass |
| 是否明确不可风险接受项 | pass |
| 是否明确必须转入新版 `06-验收标准.md` 的事项 | pass |
| 是否承接 Step 13 artifact/report/evidence 归档 | pass |
| 是否未执行测试、未写真实 run_id、未裁决 release verdict | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 15 `R15.1 formal document assembly:先思考`;只允许思考正式 `05-测试方案.md` 装配边界、Step 1~14 来源映射、旧正式 05 污染隔离、章节装配顺序、校准来源 / 延伸阅读写法、R15.2 写入边界和装配停审;不得直接越过 R15.1 写正式正文;不得写验收标准、实施计划或 implementation code。
