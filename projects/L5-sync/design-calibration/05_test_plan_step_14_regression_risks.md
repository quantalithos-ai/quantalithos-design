# Step 14. 定义回归策略与残余风险

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 14。
> 回填章节：未来正式 `05-测试方案.md` §14。
> 本步整合回归触发器、残余风险、future trigger 和跨切口审计；不关闭上游 blocker。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 14 / regression_risks |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 直接下一步 | Step 15：正式文档装配 |
| 持续 blocker | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` |

## 1A. 本步输入

- Step 5 coverage、Step 6 cases、Step 8 environment/config、Step 9 gates、Step 10 NFR、Step 11 retest、Step 13 evidence。
- `04_config_step_14_risks_open_questions.md` 的 blocker/future trigger 和 03/04 交接结论。

## 1B. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 哪些变化触发回归？ | 需求、object/field/state/port/error、config/activation/redaction、owner/tool/store contract、runner/evidence schema 变化均按影响面回归。 |
| 如何表达残余风险？ | 登记 ID、影响、缓解、owner/blocker 和 future trigger；不把风险表当 verdict。 |
| 总审计检查什么？ | 跨切口、跨覆盖、跨 suite、跨 evidence 和 truth ownership/historical pollution。 |

## 1C. 旧材料诊断与改动前后对比

| 维度 | 旧材料 | 当前回归/风险方案 |
|---|---|---|
| 回归选择 | 主流程重跑或人工清单 | 变更类型→suite/批次映射，保留原 case/data/profile |
| 风险 | blocker 与产品缺陷混列 | upstream/local blocker、design-change、implementation、evidence 风险分开 |
| 审计 | 单章检查 | 四轴总审计和 future trigger 作为正式停审门禁 |

## 1D. 测试设计取舍

1. 变更影响面决定回归，不采用全量 E2E 作为唯一保障。
2. blocker 关闭后必须重开受影响 calibration Step，不只改状态字段。
3. 残余风险保持保守姿态，未确认的 LFS/浅克隆/GUI、performance、retention 不进入 P0。

## 2. 回归策略

### 2.1 触发器到 suite 的映射

| 变更/事件 | 必跑回归 | 追加回归 | 说明 |
|---|---|---|---|
| 00 FR/BR/AC/VETO/NFR 变更 | traceability、protocol、VETO、entry/exit | 受影响 CP 全链 | 可能触发设计重启 |
| 03 object/field/port/error 变更 | domain/state/protocol、所有受影响 Command/Query | flow/UoW/idempotency/recovery | 05 case 不能自修字段 |
| 03 state/flow/UoW 变更 | `TC-SYNC-STATE-*`、flow/fault/recovery | consumer/job/status/handoff | terminal/unknown 传播需重审 |
| 04 config leaf/source/activation 变更 | config/profile/redaction/builder | all entry/ops/evidence | no-silent-fallback 重新检查 |
| SDK/source/access/review contract 变更 | adapter contract/blocked mapping | relevant P0 flow/entry | positive suite 仍需 fixture/权限 |
| metadata physical schema/driver 变更 | repository/UoW/migration/crash | metadata commands/status/recovery | UP-006 关闭后重建 physical cases |
| Git/fs/tool support 变更 | path/dirty/non-overwrite/adapter | clone/pull/status/resume/cancel | 禁止自动 merge/rebase/push/stash |
| redaction/telemetry/report schema 变更 | redaction/observability/evidence path | all suites’ packaging | sink/report 失败不改业务结果 |
| test runner/package/CI 变更 | static/entry/config/report packaging | all affected suites | LOCAL-004 不可被静态结果替代 |

### 2.2 回归批次

| 批次 | 内容 | 入口条件 |
|---|---|---|
| `REG-SYNC-LOCAL` | G0～G4 P0 unit/contract/flow/fault/config/redaction | local-dev/ci-test composition |
| `REG-SYNC-BOUNDARY` | dependency/VETO/forbidden output/no remote truth | any design or adapter change |
| `REG-SYNC-ADAPTER` | SDK/source/Git/fs/metadata controlled seams | exact contract + fixture；否则 blocked |
| `REG-SYNC-OPS` | consumer/job receipt/report/replay/no repair | operations contract and bounded input |
| `REG-SYNC-ENTRY` | CLI semantic selection/presentation/disposition | parser/toolchain confirmed |
| `REG-SYNC-EVIDENCE` | path/redaction/coverage/report/evidence index | report schema and storage policy |

## 3. 残余风险登记

| ID | 风险 | 影响 | 当前缓解 | 状态 |
|---|---|---|---|---|
| `SYNC-TEST-RISK-001` | SDK/source/access/review/probe exact contract 未闭合 | P1 positive integration、handoff/unknown mapping | typed ports、blocked/waiting、negative cases | blocked (`UP-001~005/008`) |
| `SYNC-TEST-RISK-002` | `.qs-sync` physical schema/migration/crash/retention 未闭合 | repository/UoW physical evidence | logical store/UoW、commit unknown、no silent repair | blocked (`UP-006`) |
| `SYNC-TEST-RISK-003` | comparator/gap/replay/cross-version 未闭合 | incremental pull/cursor advance | gap/unknown/unsupported 不推进 | blocked (`UP-002/008`) |
| `SYNC-TEST-RISK-004` | Git/fs dirty/path/LFS/shallow/GUI support 未闭合 | clone/pull/apply/CLI | non-overwrite/root guard、adapter boundary | blocked (`UP-007/009/010`) |
| `SYNC-TEST-RISK-005` | Node/package/parser/runner/Git library 未确认 | actual automation execution | semantic suite/paths only | waiting (`LOCAL-001~005`) |
| `SYNC-TEST-RISK-006` | 06 重建 AC/VETO/evidence schema 可能改 ID | acceptance handoff mapping | keep 00 IDs + explicit 06 handoff | waiting |
| `SYNC-TEST-RISK-007` | external evidence/attestation/retention 责任不明 | evidence lifecycle | bounded plan + no signoff/readiness | waiting |
| `SYNC-TEST-RISK-008` | operations Consumer source/topic/order 未闭合 | registration/real replay | envelope validator/quarantine/blocked | blocked |
| `SYNC-TEST-RISK-009` | performance workload/threshold 未确认 | capacity exit gate | relative/no fixed number | waiting |
| `SYNC-TEST-RISK-010` | future tool choice误把历史 LFS/浅克隆/GUI升格 | safety/support claims | historical/pending + future trigger | pending |
| `SYNC-TEST-RISK-011` | local carrier/telemetry/job report 被误读为 evidence/readiness | governance misuse | result/evidence layer separation repeated | open |
| `SYNC-TEST-RISK-012` | formal 07 phase/commit boundary 尚不存在 | implementation handoff | no implementation ledger/skeleton in 05 | blocked (`07 not started`) |

## 4. Future trigger 与回写规则

| 触发 | 必须回写 | 05 处理 |
|---|---|---|
| owner 提供 exact SDK/source/review/probe contract | 03 adapter/protocol/error、04 refs、05 case/data/environment/evidence | 重新打开 P1 suites并重审 blocker |
| physical metadata schema/driver 选定 | 03 persistence、04 metadata config、05 repository/crash cases | 增补 physical fixture/retention/repair boundary |
| comparator/cursor contract 选定 | 03 cursor/state/flow、05 incremental/recovery | 重审 gap/replay/compatibility suites |
| Git/tool support matrix 选定 | 03 adapters、04 localTools、05 environment/command cases | 只启用明确支持；不放宽 dirty/root rules |
| 06 AC/VETO/evidence schema 定案 | 05 traceability/evidence/entry-exit | 维护双向 mapping，不改设计 truth |
| 07 runner/package/phase boundary 定案 | 05 automation/path/retest | 将 semantic suites落到实际任务，但不改变 scope |
| 新字段/state/error/config leaf 需求出现 | 00/03/04 对应 Step | design-change-required，暂停受影响切口 |

## 5. 跨切口/覆盖/suite/evidence 总审计输入

| 审计轴 | 检查 | 结果 |
|---|---|---|
| 跨切口 | 29 objects、10 Command、13 Query、3 Consumer、3 Job、17 state 均有 `TC-SYNC-*` 入口；无旧 SyncTask 复活 | pass |
| 跨覆盖 | CP/FR/BR/AC/VETO/NFR 双向 mapping；P0/P1/P2/blocker 分层 | pass_with_upstream_blockers |
| 跨 suite | G0～G7 顺序覆盖所有 cut；Query zero-write、unknown、redaction、forbidden effect 不遗漏 | pass |
| 跨 evidence | artifact/report/evidence 路径、字段、redaction、proof ceiling 一致；无 latest/project path | pass |
| truth ownership | 不拥有 Project/Artifact/Baseline/Review Gate/Workspace/Archive/Git remote；commit/ACK/job/telemetry 不升格 | pass |
| historical pollution | README/旧 05/06/draft 仅被登记为历史诊断 | pass |
| blocker integrity | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` 原样保留 | pass |

## 6. 回填草稿（未来正式 §14）

回归按设计、配置、owner/tool contract、metadata、Git/fs、redaction、runner 和 evidence schema 变更触发，并分为 local P0、boundary、adapter、operations、entry、evidence 批次。残余风险登记明确 owner、影响和 blocker；未闭合的上游/本地选择保持 blocked/waiting。正式文档必须重复跨切口、跨覆盖、跨 suite、跨 evidence 审计，不得用旧文档或假运行结果填缺口。

## 7. 待确认事项

| 事项 | 处理 |
|---|---|
| blocker 关闭的权威 owner/时间 | 记录 ID 与影响；不自拟关闭日期。 |
| 06/07 schema、phase、commit boundary | 保持 waiting；05 不创建 implementation ledger/skeleton。 |
| regression retention/selection automation | 由 07/CI 工具链确认；只锁语义批次。 |

## 8. Step 自检与进入下一步门禁

| 检查项 | 结果 |
|---|---|
| 回归触发器、批次、风险和 future trigger 完整 | pass |
| 10 个上游 blocker 与 5 个 local blocker 未被关闭 | pass |
| 四轴总审计结果可回填正式文档 | pass |
| 允许进入 Step 15 | pass |

## 9. 下一步门禁

Step 15 只允许装配已完成的 Step 1～14：先更新 flow/ledger 为装配阶段，再 full-restart 重写正式 `05-测试方案.md` §1～§15，完成静态一致性/路径/证据/历史污染审计，最后进入 `formal / stop_review` 并停下。
