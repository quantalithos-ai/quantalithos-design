# Step 8. 定义状态机、事务与一致性验收

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 8
> 回填章节: `06-验收标准.md` §8 状态机、事务与一致性验收
> 创建日期: 2026-06-28
> 当前模式: full-restart / step8-state-tx-consistency
> 当前状态: completed_wait_user_confirm_to_R9.1
> 当前模块: `R8.2 state tx consistency:再写入`
> 当前门禁: `R8.2` completed_wait_user_confirm_to_R9.1;等待确认进入 Step 9 `R9.1 nonfunctional gate:先思考`

---

## R8.1 state tx consistency:先思考

### 1. 当前模块目标

`R8.1` 只思考新版 `06-验收标准.md` 的状态机、事务、一致性、幂等、并发和恢复验收如何从正式 `03-详细设计.md` §9~§12、Step 6 红线、Step 7 接口 / 事件 / Job 验收和 `05-测试方案.md` 的 `TC-ML-*` / `EV-ML-*` 收敛。

当前模块不修改正式 `06-验收标准.md`,不写最终状态 / 事务验收表,不裁决 Step 11 VETO,不进入 Step 9 非功能门禁,不补 state、port、schema、artifact/report schema 或 implementation boundary。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R8.2 |
| 用户确认 | 已确认从 Step 7 completed 推进到 Step 8 `R8.1 state tx consistency:先思考`。 |
| 当前允许 | 思考合法 / 非法状态迁移、事务原子性、Query no-write、Consumer / Outbound / Handoff / Job 边界、duplicate replay、expected_version、commit unknown、checkpoint resume 和 R8.2 写入边界。 |
| 当前禁止 | 修改正式 `06`;写 Step 9 非功能阈值;写真实测试结论;定义 physical lock、DB isolation、retry numeric policy、TTL、lease duration、config key、CI 或 implementation code。 |

### 2. 本模块输入承接

| 输入 | R8.1 关注点 | 禁止外推 |
|---|---|---|
| Step 6 架构红线 | Query / projection / job / report 不得反写真相;source missing 不得 private fallback。 | 用事务或恢复逻辑绕过红线,或把报告 / 观测材料作为 truth。 |
| Step 7 接口 / 同步门禁 | 58 Command、57 Query、4 Inbound、34 Outbound、8 Job 的协议范围和接缝边界。 | 新增协议、topic、route、scheduler、queue 或下游完整实现要求。 |
| `02-概要设计.md` §8 / §11 | Command 写、Query 只读、Inbound body-free、Event candidate、Job 只维护派生材料;配置不得改变状态 owner。 | 把配置开关写成状态机或事务语义来源。 |
| `03-详细设计.md` §9 | Business truth、source/reference/body-boundary、trace/audit/lineage/impact、read/material、maintenance/job/report、idempotency/runtime、outbound/handoff 状态族。 | 手写口语状态、恢复旧 lifecycle / publish / outbox 状态,或把状态名脱离 owner。 |
| `03-详细设计.md` §10 | logical store family、expected_version、append identity、stored replay surface、checkpoint/cursor、transaction boundary。 | 绑定物理 DB、DDL、SQL 方言、cache 产品或 object storage。 |
| `03-详细设计.md` §11 | invalid/rejected/version conflict/UoW failure/duplicate/stored surface missing/commit unknown/error recovery。 | 用 raw exception、HTTP/SQL code、adapter note 或 log 推断 public surface。 |
| `03-详细设计.md` §12 | same digest duplicate replay、different digest conflict、in-flight guard、expected_version、worker reentry、lease boundary、checkpoint resume。 | 用 lease、queue offset、timestamp、page cursor 或 current material scan 替代 checkpoint / version / replay proof。 |
| `05-测试方案.md` §6 / §9 / §13 | `TC-ML-STATE-*`;`TC-ML-IDEMP-*`;`TC-ML-UOW-*`;`TC-ML-RECOVERY-*`;`TC-ML-REPLAY-*`;`TC-ML-JOB-*` 和 `EV-ML-*` suite/report 方向。 | 新增 TC/EV 或把 nightly / P1 extended run 当 P0 唯一证明。 |
| L1-governance Step 8 | framework_reference | 参考“状态与一致性验收表 + 闭环矩阵 + 一致性失败裁决 + 停审 + 跨状态审计”的粒度。 | 复制 governance 状态、AC-GOV、EV-GOV、TC-GOV 或协议数量。 |

### 3. SOP Step 8 问题思考

| SOP 问题 | R8.1 初判 | R8.2 写入提醒 |
|---|---|---|
| 哪些合法状态迁移必须通过? | `MethodAssetDefinition`、`MethodAssetCatalogEntry`、`FormalizationState`、`FormalMethodAssetVersion`、`MethodAssetConsumptionMaterial`、`MethodAssetRelation`、`MethodPackage`、`MethodSetAssembly` 等 truth 状态,以及 source/reference、trace/audit、read/material、job/report、outbound/handoff 状态族,必须按正式 owner 和 flow 迁移。 | 写 `ML-STATE-*` 时按状态族聚合,不把每个 enum 展开成独立 AC。 |
| 哪些非法迁移必须拒绝? | Query 写 truth、catalog view 反写、raw body 决定 formalization accepted、fingerprint/latest timestamp 生成版本、downstream runtime truth 授权、本仓保存 external body、job 修 core truth、publisher failure 回滚 truth、old state resurrection 均必须拒绝。 | 写失败条件时连接 Step 6 红线和 Step 11 VETO 候选,但不提前裁决 VETO。 |
| 哪些事务必须原子提交? | Command accepted mutation 的 truth/support/material writes、stored accepted result、body-free candidate refs 必须同一 logical UoW 或等价 formal atomic boundary。Command rejected/conflict、Inbound receipt、Operations job item/page、publication outcome 和 handoff outcome 各有独立事务边界。 | R8.2 写 `ML-TX-*` 和事务闭环矩阵。 |
| 哪些幂等和并发行为必须成立? | same formal operation key + same digest duplicate 复制 stored surface;different digest conflict;in-flight 不允许第二 writer;mutable truth 用 expected_version;duplicate command/inbound/job 只能读 stored result/receipt/report;commit unknown 不能靠 timeout/log/current truth 判断成功。 | R8.2 写 `ML-IDEMP-*` / `ML-REPLAY-*` 候选。 |
| 失败时如何判定不通过? | 状态名漂移、非法迁移被接受、accepted truth 与 stored result/candidate 半提交、Query / Job hidden write、duplicate 重跑 mutation、expected_version 缺来源、checkpoint 被 lease/offset 替代、commit unknown 盲目重跑均不得通过。 | 写一致性失败裁决表,证据回指 `EV-ML-*`。 |
| 是否存在旧状态名或后续 phase 状态污染? | 旧 `MethodContent`、publish/published、snapshot、fingerprint、old outbox/delivery、旧 lifecycle 状态机、旧 P0/P1 phase 语言不得进入本 Step。 | 写旧 `06` / 旧 `03` 污染诊断。 |
| 每个状态 / 事务验收项能否回指状态矩阵、flow、TC、EV 和 report path? | 可以。状态矩阵来自 `03` §9,事务/一致性来自 §10,错误恢复来自 §11,幂等并发来自 §12,证据来自 `05` suite/report。 | R8.2 写闭环矩阵。 |
| 每个状态 / 事务验收项是否通过停审? | R8.1 只能形成停审维度:状态名正式、trigger flow 当前范围、副作用断言明确、证据固定、phase 不越界。 | R8.2 写停审记录。 |
| 是否存在状态名漂移、phase 越界、非法转换缺证据或副作用断言缺失? | 需要 R8.2 全表后审计。R8.1 已识别高风险是状态 owner 脱落、cursor/checkpoint/version 混用、duplicate replay 缺 stored surface、job/report/handoff 反写真相。 | R8.2 写跨状态一致性门禁审计表。 |

### 4. 状态与一致性范围盘点

| 范围 | 正式来源 | R8.1 判断 | R8.2 处理 |
|---|---|---|---|
| Business truth 状态 | `03` §9.3 | 覆盖 definition、catalog、formalization、version、consumption material、relation、package、method set。 | 写 `ML-STATE-001` / `ML-STATE-002` 候选。 |
| Source / Reference / Body-boundary 状态 | `03` §9.4 | 只承载 refs、digest/summary refs、safe reason 和 body-free marker。 | 写入状态合法来源和 body-free 失败条件。 |
| Trace / Audit / Lineage / Impact 状态 | `03` §9.5 | append-only / refs-only / safe marker,不保存 raw log、evidence body 或 downstream runtime effect。 | 与 Step 10 证据门禁衔接。 |
| Read / Material 状态 | `03` §9.6 | 只服务 Query public surface,不得产生写入或 marker synthesis。 | 写 `ML-READ-001` 候选。 |
| Maintenance / Job / Report 状态 | `03` §9.7 | Job 只写派生材料、progress、checkpoint、report、issue。 | 写 `ML-JOB-TX-001` / checkpoint 候选。 |
| Idempotency / Replay / Runtime 状态 | `03` §9.8 / §12 | duplicate 只能复制 stored surface;runtime readiness 不等于 business truth。 | 写 `ML-IDEMP-*` 候选。 |
| Outbound / Publication / Handoff 状态 | `03` §9.9 / §10 / §11 | candidate/outcome/handoff 独立于 accepted truth;failure 不回滚 truth。 | 写 `ML-PUB-TX-001` 候选。 |
| Transaction / Consistency | `03` §10~§12 | 以 logical UoW、expected_version、append identity、stored replay surface、checkpoint/report 为核心。 | 写闭环矩阵和失败裁决表。 |

### 5. 验收项候选思考

| 候选 ID | 验收主题 | 通过方向 | 失败方向 | 证据候选 |
|---|---|---|---|---|
| ML-STATE-001 | 正式状态名与合法迁移 | 所有 P0 状态族使用正式 owner + 状态名 + trigger flow,合法迁移由 domain/service 测试覆盖。 | 口语状态、测试状态、旧 publish/outbox 状态或后续 phase 状态被接受。 | `TC-ML-STATE-*`;`TC-ML-FORMALIZATION-*`;`EV-ML-CONTRACT-001`;`EV-ML-SERVICE-001` |
| ML-STATE-002 | 非法迁移与终态保护 | forbidden transition、old-state resurrection、raw body / fingerprint / timestamp 推导状态均被拒绝。 | query/catalog view/job/report/handoff 改写 truth,或终态原地覆盖。 | `TC-ML-STATE-*`;`TC-ML-BOUNDARY-*`;`TC-ML-POLLUTION-*`;`EV-ML-CONTRACT-001` |
| ML-TX-001 | Command accepted UoW 原子性 | accepted truth/support/material writes、stored accepted result、body-free candidate refs 同一 formal atomic boundary 提交或同回滚。 | 半提交、stored result/candidate 缺失、rollback 后 accepted surface 可见。 | `TC-ML-UOW-*`;`TC-ML-IDEMP-*`;`EV-ML-SERVICE-001`;`EV-ML-INFRA-001` |
| ML-TX-002 | Consumer / Outbound / Handoff 事务边界 | inbound 只写 receipt/intake;publication/handoff outcome 独立于 truth;failure 不回滚 committed truth。 | inbound 改 core truth;publisher/handoff failure 回滚 truth;outcome 用 raw transport body。 | `TC-ML-CONSUMPTION-*`;`TC-ML-PUBLISHER-*`;`TC-ML-HANDOFF-*`;`EV-ML-SERVICE-001`;`EV-ML-REPLAY-001` |
| ML-READ-001 | Query no-write 与 read surface 一致性 | Query 只读 formal safe surface,复制 visibility/freshness/degraded/unavailable/not-visible marker。 | Query 写 idempotency store、修 material、创建 marker、启动 job 或 append audit。 | `TC-ML-QUERY-*`;`TC-ML-MARKER-*`;`EV-ML-SERVICE-001` |
| ML-JOB-TX-001 | Operations Job no truth repair | Job 只写 derived material、progress、checkpoint、run history、safe issue、stored report 和 event candidate hint。 | Job 创建/更新/删除/修复 core truth,或用 current scan 重建 report。 | `TC-ML-JOB-*`;`TC-ML-REPLAY-*`;`TC-ML-UOW-*`;`EV-ML-REPLAY-001`;`EV-ML-ENTRY-001` |
| ML-IDEMP-001 | Duplicate replay stored surface | Command / Inbound / Job same digest duplicate 返回 stored result/receipt/report,不同 digest conflict。 | duplicate 重跑 mutation、重发 side effect、从 current truth 重建 response。 | `TC-ML-IDEMP-*`;`TC-ML-REPLAY-*`;`EV-ML-SERVICE-001`;`EV-ML-REPLAY-001` |
| ML-IDEMP-002 | expected_version / race / commit unknown | mutable truth 用 formal expected_version;version conflict 要求 safe conflict/reload;commit unknown 只由 stored/read-back/recovery source 裁决。 | cursor/checkpoint/timestamp/lease 替代 version;commit unknown 盲目重跑 accepted mutation。 | `TC-ML-IDEMP-*`;`TC-ML-RECOVERY-*`;`TC-ML-UOW-*`;`EV-ML-INFRA-001`;`EV-ML-REPLAY-001` |
| ML-CHKPT-001 | Checkpoint / cursor / lease 边界 | checkpoint 只作 job resume anchor;page cursor 只作分页;lease 只作 runtime ownership。 | queue offset、lease、timestamp、page cursor 或 current material scan 成为 checkpoint / version / replay proof。 | `TC-ML-JOB-*`;`TC-ML-RECOVERY-*`;`EV-ML-REPLAY-001`;`EV-ML-INFRA-001` |

### 6. 一致性失败裁决思考

| 失败类型 | R8.1 初判 | R8.2 写入提醒 |
|---|---|---|
| 状态名不是正式 owner + 状态名 | 状态验收失败。 | 不允许通过风险接受变成 P0 pass。 |
| illegal transition accepted | 状态验收失败;若改 core truth,进入 Step 11 VETO 候选。 | Step 8 只记录裁决影响,不裁决 VETO。 |
| accepted truth 缺 stored result / candidate / audit lineage | 事务验收失败。 | 证据回指 service-flow / UoW / replay suite。 |
| Query / Job / Report / Handoff 反写真相 | 红线和一致性双失败。 | Step 11 可能纳入一票否决。 |
| duplicate 重新执行 mutation | 幂等验收失败。 | 不得以“结果相同”替代 stored replay。 |
| expected_version 无正式来源 | 一致性验收失败或设计缺口。 | 不得由 fake private map、cursor 或 timestamp 补口。 |
| commit unknown 靠 timeout/log/current truth 判断成功 | 恢复验收失败。 | 必须回正式 stored/read-back/recovery source。 |
| checkpoint/resume 靠 lease/queue offset | job resume 验收失败。 | lease 只能表达 runtime ownership。 |

### 7. P1 / P2 防污染思考

| 能力 / 材料 | R8.1 判断 | R8.2 写入提醒 |
|---|---|---|
| durable DB isolation / row lock | P1 / implementation detail。 | P0 验 semantic expected_version / UoW / replay,不验具体 DB isolation。 |
| real queue / scheduler lease | P1 / runtime detail。 | P0 不用 queue offset、lease 或 scheduler state 证明 checkpoint。 |
| operations-replay-extended / fault-injection-matrix nightly | 扩展证据。 | 可作为补强,不得替代 PR/main P0 required evidence。 |
| production-like race / capacity run | P1/P2。 | 不作为 P0 状态一致性通过前置。 |
| real publisher / handoff target | P1 或部署层。 | P0 只验 candidate/outcome/handoff local safe surface。 |

### 8. 旧正式 06 污染思考

| 旧口径 | R8.1 判断 | R8.2 处理 |
|---|---|---|
| 旧 `MethodContent` lifecycle | 与当前状态 owner 不一致。 | 不进入 `ML-STATE-*`。 |
| publish / published / snapshot / fingerprint 状态 | 当前 formal version 不以 publish/fingerprint 成立。 | 禁止作为状态或迁移来源。 |
| old outbox / delivery 状态 | 当前 Outbound 是 candidate/outcome/handoff safe surface。 | 不作为事务或恢复 proof。 |
| PostgreSQL / gateway / HTTP code | 属实现/transport 绑定。 | 不作为状态、version、rollback 或 commit unknown 证据。 |
| 旧 P95 / capacity 口径 | 属 Step 9 非功能。 | 本 Step 不处理。 |

### 9. R8.2 写入策略思考

R8.2 应写入 Step 8 的结构化中间产物,但仍不修改正式 `06-验收标准.md`。

| 写入范围 | 目的 |
|---|---|
| 状态与一致性验收表 | 固定 `ML-STATE-*` / `ML-TX-*` / `ML-IDEMP-*` / `ML-CHKPT-*` 的通过条件、失败条件和证据来源。 |
| 状态 / 事务闭环矩阵 | 将状态机 / 事务契约、触发 flow、TC、EV、report path 和裁决影响连接起来。 |
| 一致性失败裁决表 | 固定非法迁移、半提交、hidden write、duplicate rerun、version source gap、commit unknown 和 checkpoint misuse 的失败裁决。 |
| 状态 / 事务验收项停审记录 | 审查状态名正式性、flow 范围、副作用断言、证据固定和 phase 不越界。 |
| 跨状态一致性门禁审计表 | 审计状态名漂移、phase 越界、非法转换缺证据、副作用断言缺失和幂等 / 并发裁决冲突。 |
| 回填草稿 | 提供未来 `06` §8 草稿,不写正式文档。 |

### 10. R8.2 写入边界思考

`R8.2 state tx consistency:再写入` 可以写入:

1. `06_acceptance_step_08_state_tx_consistency.md` 的 SOP 问题回答、状态与一致性验收表、状态 / 事务闭环矩阵、一致性失败裁决表、停审记录、跨状态一致性门禁审计表、回填草稿、待确认事项和进入 Step 9 条件。
2. `06_acceptance_calibration_flow.md` 推进到 Step 8 completed_wait_user_confirm_to_R9.1。
3. `project_execution_ledger.md` 推进到 `06` Step 8 completed_wait_user_confirm_to_R9.1。

`R8.2` 禁止写入:

1. 正式 `06-验收标准.md` 正文。
2. Step 9 非功能阈值、Step 10 证据真实性、Step 11 一票否决最终裁决。
3. physical lock、DB isolation、retry numeric policy、TTL、lease duration、config key、CI YAML、artifact schema、report schema、implementation boundary 或实现代码。

### 11. R8.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按项目台账和 06 flow 恢复 | pass |
| 是否只推进 Step 8 R8.1 | pass |
| 是否承接 Step 6 红线与 Step 7 接口 / 事件 / Job 范围 | pass |
| 是否读取 Step 8 SOP 和 L1-governance 框架 | pass |
| 是否承接 `03` §9~§12 状态 / 事务 / 恢复 / 幂等并发 | pass |
| 是否承接 `05` TC / EV / suite / report path 方向 | pass |
| 是否识别状态 owner、transaction boundary、no-write、stored replay、expected_version、commit unknown 和 checkpoint 边界 | pass |
| 是否明确 P1/P2 不污染 P0 一致性门禁 | pass |
| 是否未填写真实测试 / 缺陷 / verdict 结论 | pass |
| 是否未修改正式 `06-验收标准.md` | pass |
| 是否形成 R8.2 写入边界 | pass |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.2 state tx consistency:再写入`;只允许写入 Step 8 的 SOP 问题回答、状态与一致性验收表、状态 / 事务闭环矩阵、一致性失败裁决表、状态 / 事务验收项停审记录、跨状态一致性门禁审计表、回填草稿、待确认事项和进入 Step 9 条件,并推进 flow / project ledger;不得修改正式 `06-验收标准.md`、`07-实施计划.md`、CI YAML、脚本实现、真实执行结论、验收 verdict 或 implementation code。

---

## R8.2 state tx consistency:再写入

### 12. R8.2 模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R9.1 |
| 用户确认 | 已确认从 Step 8 `R8.1 state tx consistency:先思考` 推进到 `R8.2 state tx consistency:再写入`。 |
| 当前写入 | SOP 问题回答、状态与一致性验收表、状态 / 事务闭环矩阵、一致性失败裁决表、停审记录、跨状态一致性门禁审计、回填草稿和进入 Step 9 条件。 |
| 当前禁止 | 修改正式 `06`;写非功能阈值;裁决 Step 11 VETO;写真实测试执行结论;补 state / port / schema / artifact / report / implementation boundary。 |

### 13. SOP 问题回答

| SOP 问题 | R8.2 回答 |
|---|---|
| 哪些合法状态迁移必须通过? | Business truth、source/reference/body-boundary、trace/audit/lineage/impact、read/material、maintenance/job/report、idempotency/runtime、outbound/publication/handoff 等状态族必须按 `03` §9 的正式 owner、状态名和触发 flow 迁移。 |
| 哪些非法迁移必须拒绝? | Query 写 truth、catalog view 反写、raw body 决定正式化、fingerprint/latest timestamp 生成版本、downstream runtime truth 授权、job/report/handoff 修 core truth、publisher failure 回滚 truth 和旧 state resurrection 均必须拒绝或保持 no-write。 |
| 哪些事务必须原子提交? | Command accepted mutation 的 truth/support/material writes、stored accepted result、body-free candidate refs 必须同一 logical UoW 或等价 formal atomic boundary。Command rejected/conflict、Inbound receipt、Operations job item/page、publication outcome 和 handoff outcome 采用各自独立事务边界。 |
| 哪些幂等和并发行为必须成立? | same formal operation key + same digest duplicate 复制 stored surface;different digest conflict;in-flight 不允许第二 writer;mutable truth 使用 formal expected_version;commit unknown 必须依赖 stored/read-back/formal recovery source。 |
| 失败时如何判定不通过? | 状态名漂移、非法迁移 accepted、半提交、Query / Job hidden write、duplicate rerun、expected_version 缺正式来源、commit unknown 盲目重跑、checkpoint 被 lease/offset 替代均不得通过。 |
| 是否存在旧状态名、口语状态名或后续 phase 状态被写入本轮验收? | 本 Step 只使用当前 `03` §9~§12 正式状态和一致性语义。旧 `MethodContent` lifecycle、publish/published、snapshot/fingerprint、old outbox/delivery、旧 P0/P1 phase 状态均不进入本轮验收。 |
| 每个状态 / 事务验收项能否回指状态矩阵、触发 flow、测试用例、证据 ID 和 report path? | 可以。见 §15 状态 / 事务闭环矩阵。 |
| 每个状态 / 事务验收项完成后是否通过停审? | 已按状态名正式性、trigger flow 当前范围、副作用断言、证据固定、phase 不越界和旧口径污染停审。 |
| 是否存在状态名漂移、phase 越界、非法转换缺证据或副作用断言缺失? | 未发现 unresolved 冲突。正式执行仍需 Step 10 审计 raw artifact/report pairing 和 evidence index 真实性。 |

### 14. 状态与一致性验收表

| 验收项 ID | 主题 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|
| ML-STATE-001 | 正式状态名与合法迁移 | 所有 P0 状态族使用正式 owner + 状态名 + trigger flow,合法迁移由 domain / service 测试覆盖。 | 口语状态、测试状态、旧 publish/outbox/lifecycle 状态或后续 phase 状态被接受。 | `TC-ML-STATE-*`;`TC-ML-FORMALIZATION-*`;`EV-ML-CONTRACT-001`;`EV-ML-SERVICE-001` |
| ML-STATE-002 | 非法迁移与终态保护 | forbidden transition、old-state resurrection、raw body / fingerprint / timestamp 推导状态均被拒绝。 | query/catalog view/job/report/handoff 改写 truth,或终态原地覆盖。 | `TC-ML-STATE-*`;`TC-ML-BOUNDARY-*`;`TC-ML-POLLUTION-*`;`EV-ML-CONTRACT-001` |
| ML-TX-001 | Command accepted UoW 原子性 | accepted truth/support/material writes、stored accepted result、body-free candidate refs 同一 formal atomic boundary 提交或同回滚。 | 半提交、stored result/candidate 缺失、rollback 后 accepted truth/surface 可见。 | `TC-ML-UOW-*`;`TC-ML-IDEMP-*`;`EV-ML-SERVICE-001`;`EV-ML-INFRA-001` |
| ML-TX-002 | Consumer / Outbound / Handoff 事务边界 | inbound 只写 receipt/intake;publication/handoff outcome 独立于 truth;failure 不回滚 committed truth。 | inbound 改 core truth;publisher/handoff failure 回滚 truth;outcome 用 raw transport body。 | `TC-ML-CONSUMPTION-*`;`TC-ML-PUBLISHER-*`;`TC-ML-HANDOFF-*`;`EV-ML-SERVICE-001`;`EV-ML-REPLAY-001` |
| ML-READ-001 | Query no-write 与 read surface 一致性 | Query 只读 formal safe surface,复制 visibility/freshness/degraded/unavailable/not-visible marker。 | Query 写 idempotency store、修 material、创建 marker、启动 job 或 append audit。 | `TC-ML-QUERY-*`;`TC-ML-MARKER-*`;`EV-ML-SERVICE-001` |
| ML-JOB-TX-001 | Operations Job no truth repair | Job 只写 derived material、progress、checkpoint、run history、safe issue、stored report 和 event candidate hint。 | Job 创建/更新/删除/修复 core truth,或用 current material scan 重建 report。 | `TC-ML-JOB-*`;`TC-ML-REPLAY-*`;`TC-ML-UOW-*`;`EV-ML-REPLAY-001`;`EV-ML-ENTRY-001` |
| ML-IDEMP-001 | Duplicate replay stored surface | Command / Inbound / Job same digest duplicate 返回 stored result/receipt/report,不同 digest conflict。 | duplicate 重跑 mutation、重发 side effect、从 current truth 重建 response/report。 | `TC-ML-IDEMP-*`;`TC-ML-REPLAY-*`;`EV-ML-SERVICE-001`;`EV-ML-REPLAY-001` |
| ML-IDEMP-002 | expected_version / race / commit unknown | mutable truth 使用 formal expected_version;version conflict 返回 safe conflict/reload;commit unknown 只由 stored/read-back/recovery source 裁决。 | cursor/checkpoint/timestamp/lease 替代 version;commit unknown 盲目重跑 accepted mutation。 | `TC-ML-IDEMP-*`;`TC-ML-RECOVERY-*`;`TC-ML-UOW-*`;`EV-ML-INFRA-001`;`EV-ML-REPLAY-001` |
| ML-CHKPT-001 | Checkpoint / cursor / lease 边界 | checkpoint 只作 job resume anchor;page cursor 只作分页;lease 只作 runtime ownership。 | queue offset、lease、timestamp、page cursor 或 current material scan 成为 checkpoint / version / replay proof。 | `TC-ML-JOB-*`;`TC-ML-RECOVERY-*`;`EV-ML-REPLAY-001`;`EV-ML-INFRA-001` |

### 15. 状态 / 事务闭环矩阵

| 验收项 ID | 状态机 / 事务契约 | 触发 flow | 测试用例 | 证据 ID | report path | 裁决影响 |
|---|---|---|---|---|---|---|
| ML-STATE-001 | `03` §9 allowed transition;formal owner + state name | Command accepted flow;domain guard;material/job/outbound state flow | `TC-ML-STATE-*`;`TC-ML-FORMALIZATION-*`;`TC-ML-VERSION-*` | `EV-ML-CONTRACT-001`;`EV-ML-SERVICE-001` | `reports/runs/<run_id>/suites/contract-domain-fast.md`;`reports/runs/<run_id>/suites/service-flow-fast.md` | 状态名漂移或合法迁移缺证据则不通过。 |
| ML-STATE-002 | `03` §9 forbidden transition and old-state resurrection ban | domain guard;query no-write;job/report/handoff no truth repair | `TC-ML-STATE-*`;`TC-ML-BOUNDARY-*`;`TC-ML-POLLUTION-*` | `EV-ML-CONTRACT-001`;`EV-ML-SERVICE-001` | `contract-domain-fast.md`;`service-flow-fast.md` | 非法迁移 accepted 则不通过;可能成为 Step 11 VETO 候选。 |
| ML-TX-001 | `03` §10 Command accepted logical UoW | 58 Command accepted template | `TC-ML-UOW-*`;`TC-ML-IDEMP-*`;`TC-ML-REPLAY-*` | `EV-ML-SERVICE-001`;`EV-ML-INFRA-001` | `service-flow-fast.md`;`infra-runtime-fake.md` | 半提交或 rollback 后 accepted surface 可见则不通过。 |
| ML-TX-002 | Inbound receipt、publication outcome、handoff outcome 独立边界 | 4 Inbound;34 Outbound;handoff flow | `TC-ML-CONSUMPTION-*`;`TC-ML-PUBLISHER-*`;`TC-ML-HANDOFF-*` | `EV-ML-SERVICE-001`;`EV-ML-REPLAY-001` | `service-flow-fast.md`;`operations-replay-core.md` | failure rollback committed truth 或 raw outcome 入仓则不通过。 |
| ML-READ-001 | Query no-write and formal read surface copy | 57 Query read template | `TC-ML-QUERY-*`;`TC-ML-MARKER-*`;`TC-ML-SHELL-*` | `EV-ML-SERVICE-001` | `reports/runs/<run_id>/suites/service-flow-fast.md` | Query hidden write、marker synthesis 或 repair material 则不通过。 |
| ML-JOB-TX-001 | Job derived material/report/checkpoint only | 8 Operations Job | `TC-ML-JOB-*`;`TC-ML-REPLAY-*`;`TC-ML-UOW-*` | `EV-ML-REPLAY-001`;`EV-ML-ENTRY-001` | `operations-replay-core.md`;`entry-worker-job.md` | Job 修 core truth 或 current scan 重建 report 则不通过。 |
| ML-IDEMP-001 | same digest replay;different digest conflict;stored surface only | Command duplicate;Inbound redelivery;Job duplicate | `TC-ML-IDEMP-*`;`TC-ML-REPLAY-*` | `EV-ML-SERVICE-001`;`EV-ML-REPLAY-001` | `service-flow-fast.md`;`operations-replay-core.md` | duplicate rerun mutation 或 side effect 则不通过。 |
| ML-IDEMP-002 | expected_version、version conflict、commit unknown source | repository writes;UoW fault injection;recovery branch | `TC-ML-IDEMP-*`;`TC-ML-RECOVERY-*`;`TC-ML-UOW-*` | `EV-ML-INFRA-001`;`EV-ML-REPLAY-001` | `infra-runtime-fake.md`;`operations-replay-core.md` | version 来源缺失或 commit unknown 盲跑则不通过。 |
| ML-CHKPT-001 | checkpoint / page cursor / lease separation | Job resume;query pagination;runtime entry guard | `TC-ML-JOB-*`;`TC-ML-RECOVERY-*`;`TC-ML-DEPENDENCY-*` | `EV-ML-REPLAY-001`;`EV-ML-INFRA-001` | `operations-replay-core.md`;`infra-runtime-fake.md` | lease/offset/cursor 替代 checkpoint 或 version 则不通过。 |

### 16. 一致性失败裁决表

| 失败类型 | 裁决 |
|---|---|
| 状态名不是正式 owner + state name | `ML-STATE-001` 失败;不得写入正式通过条件。 |
| illegal transition accepted | `ML-STATE-002` 失败;若改变 core truth,进入 Step 11 VETO 候选。 |
| accepted truth 缺 stored result / candidate / audit lineage | `ML-TX-001` 失败;不得通过。 |
| rollback 后 accepted truth/result/candidate 可见 | `ML-TX-001` 失败;不得以后续 job 修复。 |
| Query / Job / Report / Handoff 反写真相 | `ML-READ-001` 或 `ML-JOB-TX-001` 失败;Step 11 复核一票否决。 |
| duplicate 重新执行 mutation 或重发 side effect | `ML-IDEMP-001` 失败;不能用“输出相同”替代 stored replay。 |
| expected_version 无正式来源 | `ML-IDEMP-002` 失败或回设计闭口;不得用 cursor / timestamp / fake map 补口。 |
| commit unknown 通过 timeout / log / current truth 判断成功 | `ML-IDEMP-002` 失败;必须使用 stored/read-back/formal recovery source。 |
| checkpoint/resume 使用 lease / queue offset / current scan | `ML-CHKPT-001` 失败;lease 只表达 runtime ownership。 |
| static report 宣称一致性 pass 但缺 raw artifact/report pairing | 当前 Step 不判通过;Step 10 evidence gate 失败。 |

### 17. 状态 / 事务验收项停审记录

| 验收项 ID | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| ML-STATE-001 | 状态名是否来自 `03` §9 正式 owner / state family | 通过 | 正式 `06` 可摘要状态族,不新增口语状态。 |
| ML-STATE-002 | forbidden transition 是否覆盖旧主线和 hidden write | 通过 | Step 11 再裁决是否一票否决。 |
| ML-TX-001 | accepted Command UoW 是否有副作用断言 | 通过 | Step 10 继续审计 evidence artifact/report pairing。 |
| ML-TX-002 | Consumer / Outbound / Handoff 是否与 committed truth 分离 | 通过 | 不写真实 topic、transport receipt 或下游 truth。 |
| ML-READ-001 | Query no-write 是否明确 | 通过 | Query 不写 idempotency store、不刷新 material、不启动 job。 |
| ML-JOB-TX-001 | Job no truth repair 是否明确 | 通过 | 维护 job 只写派生材料、progress、checkpoint、issue、report。 |
| ML-IDEMP-001 | duplicate replay 是否只依赖 stored surface | 通过 | stored surface missing 进入 consistency/manual,不得重跑。 |
| ML-IDEMP-002 | expected_version / commit unknown 来源是否正式 | 通过 | 缺正式来源时阻断验收并回设计闭口。 |
| ML-CHKPT-001 | checkpoint / cursor / lease 是否分离 | 通过 | lease、queue offset、page cursor 均不得替代 checkpoint 或 version。 |

### 18. 跨状态一致性门禁审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 状态名漂移 | 未发现 | 使用 `03` §9 状态 owner / state family。 |
| phase 越界 | 未发现 | durable isolation、real queue、production-like race 不作 P0 前置。 |
| 非法转换缺证据 | 未发现设计层缺口 | 正式执行需 `EV-ML-CONTRACT-001` / `EV-ML-SERVICE-001`。 |
| 副作用断言缺失 | 未发现 | UoW、stored result、candidate、receipt、outcome、report、checkpoint 均覆盖。 |
| 幂等 / 并发裁决冲突 | 未发现 | same digest replay、different digest conflict、in-flight guard、commit unknown 口径一致。 |
| cursor / checkpoint / version 混用 | 未发现写入冲突 | R8.2 明确三者边界。 |
| 旧 `06` 状态污染 | 未发现写入污染 | 旧 MethodContent lifecycle、publish、snapshot、fingerprint、outbox 状态未进入验收项。 |

### 19. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_08_state_tx_consistency.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“状态与一致性验收表”“状态 / 事务闭环矩阵”“一致性失败裁决表”“状态 / 事务验收项停审记录”和“跨状态一致性门禁审计表”小节,了解状态机、事务、一致性、幂等和恢复验收如何从详细设计状态矩阵、事务契约、恢复口径、并发规则和测试证据收敛。

正式 `06-验收标准.md` §8 应回填:

- 状态机、事务与一致性验收覆盖 `ML-STATE-001~002`、`ML-TX-001~002`、`ML-READ-001`、`ML-JOB-TX-001`、`ML-IDEMP-001~002` 和 `ML-CHKPT-001`。
- 状态名必须使用 `03-详细设计.md` 的正式 owner / state family,不得使用口语状态、测试状态、旧 publish / snapshot / outbox 状态或后续 phase 状态。
- Command accepted 的 truth/support/material writes、stored accepted result 和 body-free candidate refs 必须在同一 formal atomic boundary 提交或同回滚。
- Query 必须 no-write;Inbound、Outbound、Handoff 和 Operations Job 只能写正式 receipt、candidate、outcome、progress、checkpoint、issue、report 或派生材料,不得修复 core truth。
- duplicate replay 必须使用 stored result / receipt / report;different digest conflict;commit unknown 必须依赖 stored/read-back/formal recovery source。
- expected_version、checkpoint、page cursor 和 lease 必须分离;cursor、timestamp、lease、queue offset 或 current scan 不得替代 version、checkpoint 或 replay proof。

### 20. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 正式 `06` 是否展开所有状态 owner / state family | 影响正文长度 | 中间产物已完整闭环;正式 `06` 可摘要并引用本文件。 |
| `operations-replay-extended` 是否在 release 时升级为必须证据 | 影响 Step 9 / Step 13 | 当前只作为扩展补强,不替代 P0 core evidence。 |
| 实现仓若缺 expected_version / stored replay source | 影响 `ML-IDEMP-002` / `ML-IDEMP-001` | 验收应失败或回设计闭口,不得由 fake/private map 补口。 |

### 21. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 状态和一致性门禁可裁决 | 通过 | 见 §14 / §15。 |
| 状态 / 事务验收项已停审 | 通过 | 见 §17。 |
| 跨状态一致性门禁审计无 unresolved 冲突 | 通过 | 见 §18。 |
| 可进入 Step 9 | 通过 | 下一步定义非功能验收门禁;进入前等待用户确认。 |

### 22. R8.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 Step 8 R8.2 | pass |
| 是否完成 SOP Step 8 期望产出 | pass |
| 是否使用 L3-local `ML-*` ID 而非 governance ID | pass |
| 是否覆盖状态、事务、Query no-write、Job no repair、duplicate replay、expected_version、commit unknown 和 checkpoint 边界 | pass |
| 是否未写 physical lock / DB isolation / TTL / lease duration / config key / CI | pass |
| 是否未补 state / port / schema / evidence schema | pass |
| 是否未修改正式 `06-验收标准.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 9 `R9.1 nonfunctional gate:先思考`;只允许思考性能、安全、可用性、兼容性、恢复等非功能验收门禁;不得修改正式 `06-验收标准.md`、不得进入 Step 10 或实施计划。
