# Step 10. 设计专项测试与非功能验证

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 10
> 回填章节：`projects/L2-member/05-测试方案.md` §10「专项测试与非功能验证」
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_10_nonfunctional.md`
> 阈值口径：没有正式 workload / measurement authority 的指标只作为 sample / trend，不硬化为 P0 退出阈值。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 10：设计专项测试与非功能验证 |
| 当前状态 | `completed / pass_with_explicit_blockers / stop_review` |
| 输入基线 | `00` NFR / AC / VF；Step 6 用例；Step 8 环境；Step 9 门禁；`03` §10~§15；`04` §11~§12 |
| 输出文件 | `projects/L2-member/design-calibration/05_test_plan_step_10_nonfunctional.md` |
| 回填位置 | 正式 `05-测试方案.md` §10（Step 15） |
| 停审方式 | 性能、安全、一致性、恢复、观测、审计、配置和依赖专项矩阵完成后停审 |

## 2. 本步目标

定义除普通功能用例外，如何验证 L2-member 的性能阶段分解、安全红线、事务一致性、故障恢复、低敏观测、配置失效和依赖边界。专项测试只验证 member-local contract 与安全姿态，不把外部 owner 的 delivery、accepted、observed、health 或 readiness 纳入本仓 oracle。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| `00-需求文档.md` §13~§14 | NFR-L2M-001~016、AC-L2M-027~033、VF-L2M-001~009 |
| `05_test_plan_step_06_cases.md` | 功能、负向、replay、redaction 和 config 用例 |
| `05_test_plan_step_08_environment_config.md` | profile、依赖类型、不可用策略 |
| `05_test_plan_step_09_automation_gates.md` | blocking suite、redline 和 report audit |
| `03-详细设计.md` §10~§15 | UoW、错误、幂等、并发、配置、观测和最小验证清单 |
| `04-配置设计.md` §11~§12 | fail-fast、degraded、redaction、下游承接 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些性能指标必须验证？ | `NFR-L2M-001~003` 要求能分解入站筛选、local persistence、投递 / 发布、观测和外部等待阶段；当前没有权威数字，采集 duration / count / dependency posture sample，不用旧 README 的 P95 / SLA。 |
| 哪些安全红线必须负向测试？ | 双锚 / owner / credential fail-closed；规则 unknown 不放行；raw body、hidden reasoning、secret、provider / conversation / artifact body 不持久化或转发；无通用 listener / 任意 provider；Query / Job / config 不旁路不变量；planned / blocked 不伪装成功。 |
| 哪些一致性和恢复需要故障注入？ | CAS race、append conflict、UoW rollback / rollback failure、carrier-before-complete、duplicate / in-flight / same-key conflict、commit unknown、external side-effect unknown、projection cursor、Job partial item。 |
| 哪些日志 / 指标 / audit / trace 必须存在？ | 操作 / channel / state / disposition / safe reason、double-anchor relation ref（按可见性）、one-way fingerprint、low-cardinality labels、committed local fact / successor / carrier ref；不要求完整业务正文或 external observed truth。 |
| 阈值来自哪里？ | 只有 `00` 明确的安全、所有权、no-write、fail-closed、幂等和分层规则可作为 P0 硬断言；性能数字、容量、保留期和 real-like compatibility 没有 authority，留 sample / residual / P1。 |

## 5. 当前文档问题诊断

| 问题 | 处理 |
|---|---|
| 旧 05 含无来源 P95 / SLA | 删除硬数字，改为阶段分解样本和阈值待确认 |
| 安全测试只看 API 返回 | 扩展到 Store、logs、metrics、trace、audit、report 和 config serializer |
| 外部不可用容易被当故障失败 | 分清 local attempt / gap / blocked 与外部 delivery / observed |
| projection / Job 可能修复 source | 专项断言只允许派生侧写入，禁止 source-truth repair |
| fake parity 可能被称为生产证明 | 在每项证据中写明 fake / controlled 的证明范围 |

## 6. 改动前后对比

| 维度 | 改动前 | 当前专项设计 | 原因 |
|---|---|---|---|
| 性能 | 固定数字 | stage sample / trend，数字待 authority | 防止无来源目标 |
| 安全 | 只测输入拒绝 | 全链路 forbidden-field / boundary scan | 保护 body-free 红线 |
| 一致性 | 少量重复测试 | UoW / CAS / replay / commit-unknown / cursor 全覆盖 | 对齐详细设计 |
| 观测 | 日志存在性 | 字段、基数、提交关系、redaction 和 no-foreign-success | 可审计且不泄漏 |

## 7. 测试设计取舍

| 议题 | 结论 | 取舍 |
|---|---|---|
| 性能是否作为 P0 release threshold | 只要求样本可生成、阶段可分解 | 没有正式 workload / SLO authority |
| 是否使用真实外部服务做安全测试 | P0 使用 controlled / disabled seam；real-like P1 | 避免把外部产品行为混入 member oracle |
| 是否允许 retry 帮助恢复 | 只按正式 retry fence；Unknown 不盲重试 | 防止重复副作用 |
| 观测后端是否必须在线 | 不作为核心事实前置 | 本地 attempt / gap 和安全 telemetry 足够验证边界 |

## 8. 结构化专项测试矩阵

| 专项 | 指标 / 风险 | 方法 | 环境 | 阈值 / 通过条件 | 证据候选 |
|---|---|---|---|---|---|
| 性能阶段分解 | local 与外部等待混淆（NFR-001~003） | 对 Command / Consumer / Job 记录阶段 duration、等待 posture、item count | `ci-test` / `operations-replay` | 能区分各阶段；无权威硬数字 | `EV-CAND-L2M-NF-PERF-*` |
| 入站安全 | 错主语、规则 unknown、raw body（NFR-006/007） | invalid / unknown / body-present marker 注入 | `ci-test` | fail-closed；无 raw body persistence / forward | `EV-CAND-L2M-NF-SEC-001` |
| 出站安全 | foreign body / hidden reasoning / secret | safe-material gate、serializer / Store / log scan | `ci-test` | forbidden field 不出现；不创建 outbound success | `EV-CAND-L2M-NF-SEC-002` |
| 外联边界 | 通用 listener / arbitrary provider（NFR-008） | static dependency / endpoint / adapter inventory scan | `ci-test` / release | 仅正式 seam；违规直边阻断 | `EV-CAND-L2M-NF-DEP-001` |
| UoW / CAS | partial commit、stale overwrite | fake UoW、two-writer deterministic scheduler | `ci-test` | carrier-before-complete、one CAS winner、失败回滚 | `EV-CAND-L2M-NF-CONS-*` |
| replay / idempotency | duplicate 分叉、同 key 不同 digest | completed / reserved / wrong carrier seed | `ci-test` / replay | exact carrier replay；Conflict / InFlight；不重跑 | `EV-CAND-L2M-NF-REPLAY-*` |
| commit unknown | ambiguous commit 后盲重试 | UoW fault injection + same-relation inspection | `operations-replay` | replay / in-flight / manual defect 三分；不换 key | `EV-CAND-L2M-NF-REC-001` |
| external side-effect | handoff unknown 被升格成功 | host / Runtime / publication / observation fake | `ci-test` | local attempt / gap fence；无 delivered / observed / accepted | `EV-CAND-L2M-NF-REC-002` |
| Job partial | 单项失败拖垮或修复全部 source | multi-item runner + one conflict/unavailable | `ci-test` / replay | 已提交项保持；报告标 unresolved；不修 source | `EV-CAND-L2M-NF-JOB-001` |
| projection freshness | old cursor 覆盖新 cursor、Query 触发修复 | projection fake + concurrent Query | `ci-test` | cursor monotonic；Stale / NotReady；Query no-write | `EV-CAND-L2M-NF-PROJ-001` |
| 可追溯性 | source / purpose / result 分类丢失（NFR-009/010） | relation graph / trace ref compare | `ci-test` / replay | 每个 local fact 可回链；正文不要求 | `EV-CAND-L2M-NF-AUDIT-*` |
| 观测基数 | trace / ref / actor 进入 label（NFR-014/015） | metric label inventory + log schema scan | `ci-test` / release | 仅有限 enum；无 secret / body / high cardinality | `EV-CAND-L2M-NF-OBS-*` |
| 配置失效 | required slot、非法 profile、unsafe redaction | malformed config / provider unavailable | `ci-test` | fail-fast / blocked；无 silent fallback | `EV-CAND-L2M-NF-CONFIG-*` |
| 依赖事实等级 | fake / blocked / not_run 伪装 pass（NFR-016） | gate/report metadata scan | release | disposition 保真，未执行不得写 pass | `EV-CAND-L2M-NF-INTEGRITY-001` |

## 9. 专项断言清单

### 9.1 安全与 owner 边界

- [ ] 双锚、source owner、scope、purpose、credential ref 任一不可验证时，入口 / service 以拒绝或 blocked 结束。
- [ ] 入站正文仅允许受控瞬时检查；Store、receipt、trace、projection、report 和 outbound material 不含 raw body。
- [ ] Runtime context / plan / outcome、tool input / output、conversation / artifact body、secret、private key 和完整 stack trace 不进入任何 member-local output。
- [ ] `Blocked` / `Waiting` / `Unknown` / `Stale` / `Gap` 不映射为 external accepted / delivered / observed / health / readiness。
- [ ] 无 generic external listener、arbitrary provider、MCP / A2A / API 直连；正式 host / Runtime / Bus seam 保持可区分。

### 9.2 一致性与恢复

- [ ] pre-gate 失败不 begin write UoW、不 reserve、不调用 side-effect adapter。
- [ ] carrier 保存先于 idempotency completion；任一失败不留下可见 completed relation。
- [ ] mutable successor 只使用加载时 `MemberStoreVersion`；immutable identity collision 不是 duplicate replay。
- [ ] duplicate 只回放同 relation typed carrier；missing / wrong carrier 返回保守 consistency issue。
- [ ] commit unknown 只检查同 key / 同 relation；rollback failure 不做隐藏补偿或假成功。
- [ ] Projection / Job 只影响自身 derived / continuation relation，不修改 CP01~CP06 source truth。

### 9.3 观测与审计

- [ ] log / metric / trace / local audit 仅含安全 refs、fingerprint、有限 enum 和 committed relation。
- [ ] 原始 idempotency / dedup key 不作为 label 或明文日志字段。
- [ ] Query、pre-gate、duplicate conflict 不写 accepted business audit；telemetry 不变成新 event / ledger。
- [ ] report 只表达 local continuation item / disposition / counts，不表达 scheduler completion、evidence、verdict 或 signoff。

## 10. 专项停审与跨项审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| P0 安全红线均有负向入口 | `covered / blocking` | 双锚、body、外联、foreign success、redaction |
| 一致性 / 恢复均有 fault injection | `covered` | UoW、CAS、replay、commit unknown、partial Job |
| 性能阈值有来源 | `sample_only` | 无硬数字；待 workload owner |
| 观测可验证 | `covered` | schema、基数、提交关系和 redaction |
| 配置 / 依赖边界 | `covered` | fail-fast、slot、Core-only、blocked truth |
| 外部 positive 资格 | `blocked` | `L2M-UP-001~008` 未闭合 |

## 11. 回填草稿（供正式 §10）

专项测试覆盖性能阶段分解、安全 / owner 边界、UoW / CAS / append-only、幂等与 replay、commit-unknown、外部副作用 unknown fence、Job partial isolation、projection freshness、配置失效、依赖分类、观测和 redaction。P0 硬断言来自正式安全、所有权、no-write、fail-closed、幂等和分层规则；性能、容量、真实产品 compatibility 和长期保留期只生成 sample / trend 或 P1 residual。

所有专项输出必须保持 body-free、低敏、低基数，并区分 local attempt / gap 与 external delivery / observed / accepted。fake / controlled / blocked / not-run 只能保留真实 disposition，不能写成正向 integration、evidence、verdict 或 readiness。

## 12. 待确认事项与进入下一步条件

| 待确认项 | 影响 | 处理 |
|---|---|---|
| workload / 性能阈值 owner | NFR-001~003 | 仅 sample；转 Step 14 / 06 |
| real-like adapter compatibility | P1 qualification | 等 `L2M-UP-001~008` |
| 证据保留期、后端告警 | Step 13 / 运维 | 不在本 Step 硬化 |

- [x] P0 非功能、安全、一致性、恢复、观测和审计均有来源与验证方法。
- [x] 无来源硬性能数字未进入 P0 退出条件。
- [x] 所有 foreign truth、fake、blocked 和 not-run 边界已显式。

**Step 10 结论：** `completed / pass_with_explicit_blockers / stop_review`。按本轮授权进入 Step 11。
