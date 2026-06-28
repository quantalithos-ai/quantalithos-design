# Step 15. 整理正式验收标准文档

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 15
> 回填章节: 完整 `06-验收标准.md`
> 创建日期: 2026-06-28
> 当前模式: full-restart / step15-formal-document-assembly
> 当前状态: completed_wait_user_confirm_to_07
> 当前模块: `R15.2 formal document assembly:再写入`
> 当前门禁: `R15.2` completed;`06-验收标准.md` 已完成正式装配,等待用户确认进入 `07-实施计划.md` full-restart。

---

## R15.1 formal document assembly:先思考

### 1. 当前模块目标

`R15.1` 只思考正式 `06-验收标准.md` 如何由 Step 1~14 已确认中间产物装配,并固定装配输入、章节主链、旧材料隔离、回填顺序、跨门禁裁决总审计和 R15.2 写入边界。

当前模块不修改正式 `06-验收标准.md`,不提前装配正文,不填写真实 run_id、真实验收结论、真实签署人或真实 release sign-off,不写 `07-实施计划.md`、CI、script 或 implementation boundary。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R15.2 |
| 用户确认 | 已确认从 Step 14 completed 推进到 Step 15 `R15.1 formal document assembly:先思考`。 |
| 当前允许 | 思考正式装配输入、15 章主链、旧材料隔离、Step 1~14 回填顺序、跨文档一致性复核、跨门禁裁决总审计和 R15.2 写入边界。 |
| 当前禁止 | 修改正式 `06`;写真实验收结果;新增验收门禁、测试用例、evidence schema、artifact/report schema、CI、实施边界或实施计划。 |

### 2. 本模块输入承接

| 输入 | R15.1 关注点 | 禁止外推 |
|---|---|---|
| SOP Step 15 | 正式文档装配、评审清单、跨门禁裁决总审计。 | 把测试报告结果写进验收标准。 |
| 书写规范主链 | 正式 `06` 必须使用 15 章主链,章节不得随意改名。 | 保留旧文档中的旧 P0 主语。 |
| 中间产物规范 §5.10 | 验收标准收口必须做跨文档一致性复核。 | 缺字段 / 状态 / 命名 / phase 审计仍装配为正式通过条件。 |
| Step 1~4 | 输入边界、范围、基线、进入 / 退出条件。 | 用旧 `06/07` 覆盖新版 `00`~`05`。 |
| Step 5~10 | 功能、架构、接口、状态、非功能、证据门禁。 | 新增未讨论 AC / EV / report path。 |
| Step 11~14 | VETO、缺陷、风险接受、最终结论与签署。 | 写真实 verdict 或真实签署状态。 |
| 当前正式 `06-验收标准.md` | historical material,旧口径污染诊断。 | 保留旧主语、旧同步路径、旧基础设施或旧硬阈值。 |

### 3. SOP Step 15 问题思考

| SOP 问题 | R15.1 初判 | R15.2 写入提醒 |
|---|---|---|
| 正式文档是否按 15 章主链组织? | 必须按书写规范固定 15 章主链装配,保留文档元信息和变更记录。 | R15.2 直接重写正式 `06` 为当前主链。 |
| 是否删除 SOP 问题原文? | 正式正文只保留结论、门禁、表格、证据方向和校准来源,不保留“应问的问题”格式。 | 每章保留“校准来源 / 延伸阅读”。 |
| 每条 P0 门禁是否有通过条件、失败条件和证据来源? | Step 5~10 已形成 AC / ML-NFR / evidence gate,正式装配必须保留通过 / 失败 / 证据方向。 | 不新增真实 run 结果。 |
| 一票否决项是否真实生效? | Step 11 固定 `VETO-ML-001~014`,任一命中不得通过或有条件通过。 | 写进 §11 和 §14 判定矩阵。 |
| 每条 P0 门禁是否能回指设计契约、测试用例和 evidence ID? | 必须通过 Step 5~10 与 `EV-ML-*` / `TC-ML-*` 回指。 | 孤儿 AC / EV 不得进入正式正文。 |
| 状态、字段、接口、事件名是否与详细设计和测试方案一致? | R15.2 装配前必须做命名一致性审计,旧验收主线不得残留。 | 不在 `06` 复制详细设计 schema。 |
| 风险接受是否有接受人和后续动作? | Step 13 要求 `acceptor`、owner、deadline_or_trigger、follow_up_ref。 | 正式 §13 写字段要求,不填真实姓名。 |
| Step 5~Step 11 是否全部完成停审? | 当前 Step 5~11 已完成 stop-review。 | R15.2 写总审计表。 |
| 是否存在孤儿验收项、孤儿证据、重复裁决、VETO 未覆盖、风险接受越权或 report path 不固定? | R15.1 未发现必须阻塞装配的 unresolved 冲突;R15.2 需要写跨门禁裁决总审计。 | 若发现冲突,不得装配为正式通过条件。 |

### 4. 正式章节主链思考

| 章节 | 正式标题 | 装配来源 | 装配口径 |
|---|---|---|---|
| 1 | 与上游文档的关系声明 | Step 1 | 固定 `00`~`05` 为正式上游,旧 `06/07` 只作 historical / direction input。 |
| 2 | 验收目标与范围 | Step 2 | 固定 P0/P1/P2、core / peripheral / out-of-scope。 |
| 3 | 验收基线 | Step 3 | 固定 source refs、implementation commit、run_id、artifact/report path 方向。 |
| 4 | 进入条件与退出条件 | Step 4 | 固定进入 / 退出 / 暂停 / 不可裁决条件。 |
| 5 | 功能验收门禁 | Step 5 | 固定 `ML-FG-*`。 |
| 6 | 数据边界与架构红线验收 | Step 6 | 固定 `ML-RL-*` 和 dependency / truth boundary。 |
| 7 | 接口、事件与跨仓同步验收 | Step 7 | 固定 command/query/job/event/handoff sync 门禁。 |
| 8 | 状态机、事务与一致性验收 | Step 8 | 固定 state / UoW / idempotency / replay / no truth repair 门禁。 |
| 9 | 非功能验收门禁 | Step 9 | 固定 `ML-NFR-*`、P0/P1 边界和 residual。 |
| 10 | 可观测性、审计与证据门禁 | Step 10 | 固定 `AC-ML-EV-*`、`EV-ML-*`、run-scoped report path。 |
| 11 | 一票否决项 | Step 11 | 固定 `VETO-ML-001~014`。 |
| 12 | 缺陷分级、复验与放行规则 | Step 12 | 固定 S/A/B/R、复验矩阵、放行规则。 |
| 13 | 风险接受与遗留项 | Step 13 | 固定 `RISK-ML-*`、不可接受项和 risk acceptance 字段。 |
| 14 | 最终结论与签署 | Step 14 | 固定三值结论、判定矩阵和签署角色。 |
| 15 | 参考 | Step 1~14 + 标准 | 列正式上游、标准和中间产物索引。 |

### 5. 旧材料隔离思考

| 旧口径 / 污染源 | 当前处理 | R15.2 写入提醒 |
|---|---|---|
| 旧 7 类内容资产 P0 | 不进入新版 P0。 | 用当前 `00`~`05` 和 Step 2 scope 替换。 |
| 旧发布 / 派生包 / 消息 / 基础设施主语 | historical material only。 | 不保留为正式验收项。 |
| 旧性能硬阈值 / SLA | 当前无正式阈值来源。 | 写为 sample/trend 或 residual,不得硬化。 |
| 旧事件 / 派生读取下游同步口径 | 已被 Step 7 当前接口与同步验收替换。 | 不复制旧路径。 |
| 旧最终结论占位 | 由 Step 14 三值口径替换。 | 不填真实 verdict。 |
| 旧参考缺少中间产物入口 | 由 Step 15 §15 参考补齐。 | 引用 `06_acceptance_step_*`。 |

### 6. 跨门禁裁决总审计思考

| 审计项 | R15.1 判断 | R15.2 写入提醒 |
|---|---|---|
| 孤儿验收项 | 正式装配时检查 AC / ML-NFR / VETO / RISK 是否均有来源 Step。 | 无来源项不得写入。 |
| 孤儿证据 | `EV-ML-*` 必须回到 suite/report/artifact 方向。 | 无 report path 的 EV 不得作为通过证据。 |
| report path 固定 | 必须使用 `reports/runs/<run_id>`、`artifacts/test/<run_id>`、`reports/acceptance/*`。 | 不使用 `latest` 或旧项目路径。 |
| VETO 覆盖 | `VETO-ML-001~014` 覆盖需求层和验收过程硬红线。 | 不允许 risk acceptance 覆盖。 |
| 风险接受越权 | `RISK-ML-*` 只覆盖 residual。 | S/VETO/P0 hard gate 不可接受。 |
| 重复裁决 | Step 9/10/11 交叉红线可重复引用,但不得产生冲突结论。 | 以 hard gate 失败优先。 |
| 命名漂移 | `TC-ML-*`、`EV-ML-*`、`AC-ML-*`、`VETO-ML-*`、`RISK-ML-*` 固定。 | 禁止旧 ID / 外部项目 ID。 |
| 真实结果污染 | 正式标准不写真实 pass/fail、run verdict、签署人。 | 只写条件和路径方向。 |

### 7. 跨文档一致性复核思考

| 复核表 | R15.1 裁剪口径 | R15.2 写入提醒 |
|---|---|---|
| 真相源表 | 聚焦验收事实: scope、baseline、AC、EV、VETO、risk、decision。 | 不复制详细设计对象 schema。 |
| 字段闭环表 | 对验收标准只需复核 public evidence / report / acceptance 字段方向。 | 不发明 JSON 字段。 |
| Query response / view 闭环表 | 验收只引用 query no-write、visibility/degraded/stale 的测试与证据方向。 | 不复制 DTO 字段表。 |
| 状态闭环表 | 复核 state/UoW/idempotency 与 Step 8 / `EV-ML-*` 是否连通。 | 不重写状态矩阵。 |
| Phase / commit boundary 闭环表 | `06` 不定义 implementation commit boundary,只说明不作为 `07` 来源。 | 不写实施 phase。 |
| 命名一致性表 | 禁止旧内容资产主线、旧 EV / AC / VETO 命名漂移。 | R15.2 写审计结果。 |
| 冲突与修正表 | 若 R15.2 发现冲突,必须列 unresolved,不得默认为通过。 | 当前 R15.1 未发现 blocker。 |

### 8. R15.2 写入策略思考

`R15.2 formal document assembly:再写入` 可以写入:

1. 正式 `projects/L3-method-library/06-验收标准.md` 完整 15 章正文。
2. `06_acceptance_step_15_formal_document_assembly.md` 的装配记录、自审结果、跨门禁裁决总审计和 completed stop-review。
3. `06_acceptance_calibration_flow.md` 推进到 Step 15 completed。
4. `project_execution_ledger.md` 推进到 `06` completed,等待用户确认进入 `07-实施计划.md`。

`R15.2` 禁止写入:

1. 真实测试报告结果、真实 run verdict、真实签署人、真实 release sign-off。
2. 新增 Step 1~14 未推导过的验收门禁、测试用例、evidence ID、VETO、risk ID 或 report schema。
3. artifact/report JSON schema、CI YAML、script implementation、implementation boundary 或 `07-实施计划.md` 正文。
4. 旧内容资产主线、旧同步路径、旧基础设施和旧硬阈值污染。
5. 将 unresolved 冲突装配成正式通过条件。

### 9. R15.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按项目台账和 06 flow 恢复 | pass |
| 是否只推进 Step 15 R15.1 | pass |
| 是否读取 SOP Step 15、书写规范主链、中间产物规范 §5.10、Step 14 和正式旧 `06` 章节 | pass |
| 是否形成正式装配输入、15 章主链、旧材料隔离、回填顺序和总审计思考 | pass |
| 是否明确 R15.2 才能修改正式 `06-验收标准.md` | pass |
| 是否未写真实测试结果、真实 verdict、真实签署人、CI 或 implementation 内容 | pass |
| 是否未修改正式 `06-验收标准.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 15 `R15.2 formal document assembly:再写入`;只允许按 Step 1~14 中间产物装配正式 `06-验收标准.md`,写入 Step 15 自审、跨门禁裁决总审计和 completed stop-review,并推进 flow / project ledger;不得写真实验收结果、真实签署人、CI、脚本、implementation boundary 或 `07-实施计划.md` 正文。

## R15.2 formal document assembly:再写入

### 1. 当前模块目标

`R15.2` 按已确认的 Step 1~14 中间产物装配正式 `projects/L3-method-library/06-验收标准.md`,并回写本 Step 的装配记录、自审结果、跨门禁裁决总审计、跨文档一致性复核和 completed stop-review。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_07 |
| 用户确认 | 用户已确认从 R15.1 进入 R15.2。 |
| 已写入 | 正式 `06-验收标准.md`;本 Step R15.2 记录;`06_acceptance_calibration_flow.md`;`project_execution_ledger.md`。 |
| 当前禁止 | 写 `07-实施计划.md`;写 CI / scripts / implementation boundary;填写真实 run verdict、真实验收结论、真实签署人或真实 release sign-off。 |

### 2. 装配记录

| 装配项 | 结果 |
|---|---|
| 正式章节主链 | 已按书写规范固定 15 章:关系声明、目标范围、基线、进入退出、功能、红线、接口同步、状态一致性、非功能、证据、VETO、缺陷、风险、最终结论、参考。 |
| Step 1~14 输入 | 已逐章消费对应中间产物,未直接继承旧正式 `06/07` 的验收主线。 |
| 正式 `06` 裁决性质 | 保持为验收标准,只写条件、门禁、证据路径和裁决口径,不写执行记录。 |
| 旧材料隔离 | 旧主语、旧同步路径、旧基础设施和旧硬阈值口径未作为当前 P0 truth 或正式验收项保留。 |
| 证据路径 | 固定 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance/*`,未使用 `latest`。 |
| 真实结果 | 未填写真实 pass/fail、真实 run_id、真实签署人或真实发布结论。 |

### 3. 自审结果

| 检查项 | 结果 | 说明 |
|---|---|---|
| 15 章主链完整 | pass | 正式 `06` 覆盖书写规范要求的全部章节。 |
| 每章有校准来源和延伸阅读 | pass | 每章均指向具体 `06_acceptance_step_*` 文件。 |
| P0 门禁有通过 / 失败 / 证据方向 | pass | `ML-FG-*`、`ML-RL-*`、`ML-SYNC-*`、状态 / 事务 / 非功能 / evidence gate 均有裁决条件。 |
| VETO 生效 | pass | `VETO-ML-001~014` 任一命中时不得通过或有条件通过。 |
| 风险接受不越权 | pass | `RISK-ML-*` 只覆盖 residual;VETO/S/P0 hard gate 不可接受。 |
| 未发明 schema / port / state / config key | pass | 正文只引用路径和语义门禁,未补 JSON 字段或实现契约。 |
| 未写真实验收结果 | pass | 只保留 `<run_id>`、`<name>`、`<date>` 等占位。 |
| 未写 `07` 或 implementation 内容 | pass | 当前仅完成 `06` 和校准台账。 |

### 4. 跨门禁裁决总审计表

| 审计项 | 结果 | 说明 |
|---|---|---|
| orphan AC | none | 正式门禁均来自 Step 5~10 或 Step 11~14。 |
| orphan EV | none | `EV-ML-*` 均回指 suite / report / artifact 方向。 |
| report path 固定 | pass | 使用 `reports/runs/<run_id>`、`artifacts/test/<run_id>`、`reports/acceptance/*`。 |
| VETO 覆盖 | pass | `VETO-ML-001~014` 覆盖需求红线和验收过程 hard gate。 |
| 风险接受覆盖范围 | pass | 仅覆盖 B/R、P1/P2、future 或严格 A 候选。 |
| release smoke 替代底层 suite | not allowed | 正文明确 release smoke 不替代底层 suite。 |
| evidence integrity | pass | no latest、no static evidence、artifact/report pairing 进入 hard gate。 |
| 旧口径污染 | none in formal P0 | 旧材料只作为历史诊断,未成为当前 P0 truth。 |
| 真实结果污染 | none | 正式标准未写真实 verdict / sign-off。 |
| unresolved 冲突 | none found | R15.2 未发现阻塞正式装配的未闭口冲突。 |

### 5. 跨文档一致性复核

| 复核项 | 结果 | 说明 |
|---|---|---|
| 真相源表 | pass | scope、baseline、gate、EV、VETO、risk、decision 均回指当前 `00`~`05` 和 Step 1~14。 |
| 字段闭环表 | pass | 验收仅声明 evidence/report/acceptance path 和字段方向,未复制或发明 DTO/schema 字段。 |
| DTO / Event / Job 到 Domain 构造闭环 | pass | `06` 只验 command/query/event/job surface 与测试证据,不新增构造规则。 |
| 状态闭环表 | pass | `ML-STATE-*`、`ML-TX-*`、`ML-IDEMP-*`、`ML-CHKPT-*` 回指 Step 8 和 `03` 状态 / 事务语义。 |
| Query response / view 闭环表 | pass | query no-write、degraded/stale/failed/safe shell 只作为验收方向,未补 DTO 字段。 |
| Phase / commit boundary 闭环表 | pass | `06` 不定义 implementation phase 或 commit boundary;等待 `07` 承接。 |
| Public protocol 传递类型闭环表 | pass | `ML-SYNC-*` 以协议族、topic-neutral family 和 job surface 裁决,不写真实 topic/endpoint。 |
| 命名一致性表 | pass | 正式正文使用 `TC-ML-*`、`EV-ML-*`、`ML-*`、`AC-ML-EV-*`、`VETO-ML-*`、`RISK-ML-*`。 |
| 冲突与修正表 | pass | 未发现需要回前序 Step 重新闭口的冲突。 |

### 6. R15.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按项目台账、06 flow 和 Step 15 恢复 | pass |
| 是否只推进 R15.2 | pass |
| 是否完成正式 `06-验收标准.md` 装配 | pass |
| 是否回写 Step 15、flow 和项目台账 | pass |
| 是否未写 `07-实施计划.md` | pass |
| 是否未写 CI、脚本、implementation boundary 或真实执行结果 | pass |
| 是否未新增未讨论门禁、EV、VETO、risk 或 schema | pass |

next_allowed_action: `06-验收标准.md` full-restart completed;等待用户确认后进入 `07-实施计划.md` full-restart;不得自动开始 `07`,不得写 CI、脚本、implementation boundary、真实验收结果或 implementation code。
