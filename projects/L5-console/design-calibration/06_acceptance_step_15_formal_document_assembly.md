# Step 15. 整理正式验收标准文档

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 15  
> 回填章节：完整 `06-验收标准.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 15 正式文档装配 |
| 当前状态 | `done / pass / self_reviewed / formal_stop_review` |
| 输入基线 | Step 1～14；验收标准书写规范；正式 00～05 |
| 输出文件 | 本文件 + `projects/L5-console/06-验收标准.md` |
| 当前实际验收 | `not_entered / blocked_by_missing_baseline`；无 verdict/signoff |
| 下一动作 | 停在 06；仅在用户明确授权后读取 07 SOP/书写规范并启动 07 |

## 2. 本步计划与事实边界

本步已按“来源映射→跨门禁裁决总审计→历史污染审计→正式 15 章装配→装配后静态复核”执行。旧正式 06 只作差异/污染输入，正式文档采用整文件替换，不从 workspace/panel 主线增量修补。

Step 15 只把既有验收合同装配成正式正文，不执行测试、验收或签署，不创建实现仓、run、artifact/report/evidence、缺陷、风险接受或 readiness。所有 `pass` 仅表示设计/装配自审；执行结果仍为 `not_evaluated`。

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| Step 1～4 | `done / pass / self_reviewed` | 上游关系、范围、基线、生命周期与进出条件 |
| Step 5～11 | `done / pass / self_reviewed` | P0 功能/红线/接口/状态/NFR/evidence/VETO 门禁与逐项停审 |
| Step 12～14 | `done / pass / self_reviewed` | 缺陷复验、风险接受、三值结论与签署 |
| 正式 00～05 | `formal_stop_review` | 当前需求、架构、设计、配置与测试 truth |
| 旧正式 06 | `historical_material` | workspace/panel/DB/API/旧阈值污染审计；不继承 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 是否按 15 章主链组织？ | 是；恰好 §1～§15，不另设旧“背景/三红线/安全治理”等平行主章。 |
| 是否删除 SOP 问题原文？ | 是；正式正文只保留可裁决合同、来源与延伸阅读。 |
| 每条 P0 是否有通过/失败/证据？ | 是；Step 5 的 20 项逐项闭合，Step 6～10 提供红线、接口、状态、NFR 和 evidence 细化；正文保留门禁表与固定追溯入口。 |
| VETO 是否真实生效？ | 是；恰好 `VETO-CON-001～007`，任一命中总体“不通过”且不可接受。当前 checklist 不存在，不能宣称未命中。 |
| 每条 P0 是否回指设计、TC、EV、report？ | 是；正文 §5 给出 20 项完整闭环矩阵，其他 P0 gate 以分组表回指正式 03、TC family、八 EV 和固定 evidence-index/suite reports。 |
| 协议/状态命名是否一致？ | 是；5 Command、16 Query、1 conditional consumer、0 Event、0 Job；11 ST、2 TX、6 CC，均使用 03 正式名。 |
| 风险接受是否有接受人和动作？ | 合同要求有；当前无实例。11 个 candidate 均 `not_accepted`，不得支撑有条件通过。 |
| Step 5～11 是否全部停审？ | 是；20 功能项、12 AR、22 协议、19 状态/一致性、7 NFR、8 EV、7 VETO 均有停审/跨门禁审计。 |
| 是否有孤儿、重复、VETO 缺口、风险越权或路径漂移？ | 设计层未发现 unresolved 冲突；执行层 instance=0，因此实际验收尚未进入。 |

## 5. 当前文档问题诊断

| 旧正式 06 问题 | 装配处理 |
|---|---|
| 以 `ConsoleWorkspace/PanelState/CrossPanelContext` 等旧对象为主线 | 全量删除，改用当前 00～05 的 context/owner-safe view/intent/topics/recovery 主线 |
| API response、DB record、history 当证据 | 删除，统一为 TC→suite→fixed-run artifact/report→EV→review |
| workspace store、action history、layout persistence 等越界真相 | 删除；当前唯一 carrier 为 exact-scope/session-volatile interaction state |
| P95 `<200ms>`、100% 样本链等无 authority 数字 | 删除；只保留 structural zero-violation 与 selected authority 升级规则 |
| 只有 10 章、缺接口/状态/evidence/VETO 正式链 | 按规范重建 15 章 |
| 空结论与签署栏易被误读 | 明确当前 `not_entered`，只定义 future 三值和签署合同 |

## 6. 改动前后对比

| 项 | 旧正式 06 | 新正式 06 |
|---|---|---|
| 章节 | 10 章旧结构 | 规范 15 章 |
| 主体 | workspace/panel/provider 风格 | SDK-only 浏览器 Console interaction truth |
| 协议 | 旧 Open/Build/Trigger 叙述 | 5 Command + 16 Query + 1 conditional consumer + 0/0 |
| 证据 | API/DB/compare 泛证据 | 96 TC、八 EV、fixed run pair/digest/review |
| 阈值 | 旧固定 P95/100% 数字 | structural/semantic P0；selected 数字待 authority |
| 裁决 | 空表/待评审 | lifecycle + 三值 + risk/signoff 规则；当前无 verdict |

## 7. 装配取舍

| 议题 | 裁决 |
|---|---|
| 是否在正文复制所有 calibration 表 | 保留裁决所需主表与 P0 完整闭环；逐项停审、问题诊断和审计细节留在具体 Step 文件 |
| 是否填写真实执行占位值 | 不填写假 commit/run/date/name/status；使用合同变量与明确“不存在”事实 |
| 是否列 11 个 residual candidate | 使用不与 01 架构风险编号碰撞的 `RES-CON-001～011`，并标记 `candidate / not_accepted` |
| 是否创建 evidence/acceptance 文件 skeleton | 否；这是 05/未来实现和实际送验产物，不在 06 设计仓静态造证据 |
| 是否进入 07 | 否；用户要求完成 06 后停审 |

## 8. 结构化中间产物

### 8.1 正式章节来源映射

| 正式章节 | 具体 calibration 来源 |
|---|---|
| §1 与上游文档的关系声明 | `06_acceptance_step_01_input_boundary.md` |
| §2 验收目标与范围 | `06_acceptance_step_02_scope.md` |
| §3 验收基线 | `06_acceptance_step_03_baseline.md` |
| §4 进入条件与退出条件 | `06_acceptance_step_04_entry_exit.md` |
| §5 功能验收门禁 | `06_acceptance_step_05_function_gate.md` |
| §6 数据边界与架构红线验收 | `06_acceptance_step_06_data_arch_redlines.md` |
| §7 接口、事件与跨仓同步验收 | `06_acceptance_step_07_interfaces_events_sync.md` |
| §8 状态机、事务与一致性验收 | `06_acceptance_step_08_state_tx_consistency.md` |
| §9 非功能验收门禁 | `06_acceptance_step_09_nonfunctional.md` |
| §10 可观测性、审计与证据门禁 | `06_acceptance_step_10_observability_evidence.md` |
| §11 一票否决项 | `06_acceptance_step_11_veto.md` |
| §12 缺陷分级、复验与放行规则 | `06_acceptance_step_12_defects_retest_release.md` |
| §13 风险接受与遗留项 | `06_acceptance_step_13_risk_acceptance.md` |
| §14 最终结论与签署 | `06_acceptance_step_14_final_decision_signoff.md` |
| §15 参考 | 本文件 + Step 1～14 + 正式 00～05 + 三份规范 |

### 8.2 P0 小循环闭环总审计

| 范围 | 数量 | 正式设计 | TC | EV | 固定 report / artifact | 通过/失败/裁决 | 结论 |
|---|---:|---|---|---|---|---|---|
| `AC-CON-*` | 7 | 03 §5～§15 | CTX/NAV/VIEW/INTENT/TOPIC/RECOVERY/A11Y/SEC/ARCH | 八 family 按项 | evidence-index + source suite reports/raw | 逐项 | pass |
| `AC-FR-*` | 13 | 00 §9/§14；03 §7～§12 | 具体 TC 见 Step 5 §8.2 | 八 family 按项 | 同上 | 逐项；013 conditional | pass |
| `AC-BR-*` | 7 | 00 §10/§14；03 flows/invariants | CTX/NAV/VIEW/INTENT/TOPIC/RECOVERY/A11Y/ARCH | UNIT/FLOW/CONTRACT/INTEGRATION/ACCESSIBILITY/SECURITY/ARCH | evidence-index + matching reports | Step 6/8/11 裁决 | pass |
| `AC-DR-*` | 5 | 00 §11/§14；03 objects/state/diagnostic | STATE/VIEW/INTENT/TOPIC/SEC | UNIT/FLOW/SECURITY/ARCH/RELEASE | evidence-index + redaction/architecture | Step 6/10/11 裁决 | pass |
| `AC-NFR-*` | 7 | 00 §13/§14；03 §10～§15 | Step 9 §8.1 family | 八 family 按项 | evidence-index + NFR/source reports | 逐项；selected 分离 | pass |
| `AR-CON-*` | 12 | 01/03/04 | VIEW/ADAPTER/STATE/DIAG/CONFIG/ARCH 等 | UNIT/FLOW/CONTRACT/INTEGRATION/SECURITY/ARCH/RELEASE | architecture/redaction/pairing/release | VETO/S 映射 | pass |
| `IFG-CON-*` | 7 / 22 协议 | 03 §7 | 22/22 协议 TC | 按协议 | evidence-index + port/flow/architecture | enabled/disabled 可判定 | pass |
| `ST/TX/CC-CON-*` | 11/2/6 | 03 §9～§12 | 19/19 gate TC | 按组 | concurrency/composition/state reports | VETO/S/P0 映射 | pass |
| Evidence | 8 family | 05 §9～§13 | 96 TC 适用集 | 8/8 | fixed run pair/digest/review | 缺失阻断 | pass |
| VETO | 7 | 00 §14.4 + 01/03 红线 | 7/7 负向覆盖 | 对应 EV | veto-checklist + source reports | 任一命中总体不通过 | pass |

“pass”仅指合同与追溯设计完整；当前所有执行项仍 `not_evaluated`，evidence instance=0。

### 8.3 跨门禁裁决总审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 孤儿验收项 | none | 7+13+7+5+7 均有正式设计/TC/EV/report 入口 |
| 孤儿 P0 TC / EV | none in design | 96 TC→suite/check→八 EV→AC/VETO；future pairing 审计执行层实例 |
| 协议 inventory | pass | 5+16+1/0/0；Query write=0；唯一 owner write=`OwnerCommandPort.submit` |
| 状态/phase 漂移 | none | 11 ST、2 TX、6 CC 使用 03 正式语义 |
| VETO 覆盖 | pass | truth/access/phase/body/inference/a11y/isolation 恰好七项 |
| VETO 重复/扩号 | none | evidence fraud 为 S/送验无效，不增设第八项 |
| risk acceptance 越权 | none | VETO/S/required P0/evidence integrity 不可接受 |
| report path | pass | 仅 `artifacts/test/<run_id>/`、`reports/runs/<run_id>/`、`reports/acceptance/`；禁止 `latest` |
| conditional positive | pass | disabled 安全不等 formal positive；enabled 必须 contract-derived evidence |
| readiness 推导 | none | profile/UI/diagnostic/test count/release EV/verdict 均不自动等 production readiness |
| 当前事实 | honest | 无 implementation/baseline/run/artifact/report/evidence/defect/risk acceptance/verdict/signoff |

### 8.4 历史污染审计

| 污染候选 | 正式正文处理 |
|---|---|
| `ConsoleWorkspace/PanelState/CrossPanelContext` 旧主线 | 不进入 current truth 或门禁 |
| Provider Contract、旧 RBAC/Store | 不进入配置/协议/权限真相 |
| OpenWorkspace/BuildUnifiedSummary 等旧 action | 不进入 5 Command/16 Query 清单 |
| DB record/API response/history/replay 泛证据 | 不作为证据；改用 fixed-run closure |
| `<200ms>`、P95、99.9/99.95%、固定控制/指标数量 | 无 authority，不进入门禁 |
| 框架/router/bundler/package manager 猜测 | 不进入验收 baseline |

### 8.5 正式装配后静态审计结果

- [x] 正式 `## 1.`～`## 15.` 恰好 15 章；每章有且只有对应具体 calibration 来源与延伸阅读。
- [x] 无 SOP 问题原文、旧 workspace/panel/provider 主线、旧指标阈值、DB/API 泛证据。
- [x] `AC-CON=7`、`AC-FR=13`、`AC-BR=7`、`AC-DR=5`、`AC-NFR=7`、`VETO=7`；八 EV family 全列。
- [x] 20 项功能闭环中的 EV 均为逗号分隔的精确 `EV-*-001`；未保留组合式伪 ID。
- [x] 正式协议名称/数量、Query write=0、唯一 owner write、状态/phase、三 profile/四配置与 03～05 一致。
- [x] 当前实际验收始终 `not_entered / blocked_by_missing_baseline`；无伪造真实执行值。
- [x] `git diff --check -- projects/L5-console` 通过。

## 9. 回填草稿

正式 06 已按 §8.1 的 15 章映射整文件重建。§5 保留 20 个功能项的完整 P0 小循环闭环；§6～§11 保留分组 gate、证据和裁决影响；§12～§14 明确当前没有执行实例、接受或签署。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 实际 source/delivery/environment/config/data/dependency refs | 验收准入 | 未创建，不填 |
| actual facet manifest/run/evidence | P0 required set 与裁决 | 未创建，不填 |
| defect/risk/signoff identities and dates | 最终 verdict | 未创建，不填 |
| retention/quantitative/browser/AT/diagnostic authority | selected/release scope | 保持 candidate/residual |

## 11. 正式写入门禁

| 条件 | 结果 |
|---|---|
| Step 1～14 全部完成并停审 | pass |
| P0/EV/VETO 跨门禁总审计 | pass |
| 风险接受无越权 | pass |
| 历史污染与事实边界清楚 | pass |
| 正式章节来源映射完整 | pass |
| `formal_06_write_allowed` | false；正式 06 写入已关闭 |
| 装配后动作 | 已完成静态审计；flow/ledger 已更新为 `formal_stop_review`；停在 06 |

## 12. 收口记录

| 项 | 结果 |
|---|---|
| 正式装配 | `06-验收标准.md` 已 full-restart 写入并固定为 15 章；组合式 EV 缩写已替换为精确 family ID 列表。 |
| 静态审计 | 章节/来源、AC/EV/VETO 数量、协议与写边界、路径、污染和事实诚实审计均通过；`git diff --check` 无输出。 |
| 当前实际验收 | `not_entered / blocked_by_missing_baseline`；instance=0；无 verdict、signoff、risk acceptance 或 readiness。 |
| 写入门禁 | `formal_06_write_allowed=false`；`formal_07_write_allowed=false`；实现、测试执行和提交均未授权。 |
| 停审 | Step 15 `done / pass / self_reviewed`；文档状态 `formal_stop_review`；下一动作只能是等待用户明确 07 授权。 |
