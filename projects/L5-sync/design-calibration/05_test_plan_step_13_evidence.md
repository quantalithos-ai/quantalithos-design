# Step 13. 定义测试报告与证据归档

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 13。
> 回填章节：未来正式 `05-测试方案.md` §13。
> 本步只规划证据载体、路径、字段和边界；不创建真实 artifact、report、evidence、run、verdict 或 signoff。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 13 / evidence |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 直接下一步 | Step 14：定义回归策略与残余风险 |
| 持续 blocker | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` |

## 1A. 本步输入

- Step 5 coverage IDs、Step 6 case/suite candidates、Step 9 path/gate rules、Step 11 defect/retest、Step 12 entry/exit。
- `03-详细设计.md` §15 的 evidence ceiling 和 `04-配置设计.md` §12.6 的配置证据边界。

## 1B. 旧材料诊断与改动前后对比

| 维度 | 旧材料 | 当前证据方案 |
|---|---|---|
| 路径 | 旧路径或 latest 索引 | run-scoped 三层固定路径，禁止 project 子目录/latest |
| 载体 | report/ACK 可能等 evidence | artifact/report/evidence 分层，各有 proof ceiling |
| 敏感输出 | 可能保留 raw body/path/output | write 前 redaction scan，raw 永不进入 public evidence |
| blocker | 空报告掩盖未执行 | blocker/unknown/partial 保留并可消费 |

## 1C. 测试设计取舍

1. 先锁路径、最小字段、redaction 和可回链关系，再让 07/工具链选择格式化实现。
2. 不为满足“有报告”而生成 fake run/artifact/evidence；本轮只提供计划 ID 和 schema ceiling。
3. acceptance handoff 只供 06 消费，不在 05 填 verdict/signoff/readiness。

## 2. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| artifact/report/evidence 如何分层？ | artifact 保存单次 suite/run 的脱敏机器输入与结果片段；report 汇总 run/suite/disposition/blocker；evidence 是供 06 消费的可追溯索引与边界说明；三者不互相升格。 |
| 路径是什么？ | `artifacts/test/<run_id>/`、`reports/runs/<run_id>/`、`reports/acceptance/`；禁止 `latest`、`artifacts/test/<project>/<run_id>`、`reports/<project>`。 |
| 能否证明 owner accepted/readiness？ | 不能。local result、Git commit、ACK、HTTP 200、job report、telemetry 只能证明各自层事实。 |
| unknown/blocked 如何留证？ | 保留 disposition、blocker ID、缺失契约、next action 和 redacted failure summary；不填写 pass/fail 或伪造成功。 |
| raw output 是否归档？ | 默认不归档；仅在正式批准且经过 redaction 的 bounded summary。raw secret/body/path/Git output/provider response 永不进入公共证据。 |

## 3. 证据 ID 计划

| 计划 ID | 覆盖 | 主要消费者 | 证明上限 |
|---|---|---|---|
| `EV-SYNC-TRACE-001` | CP1/CP2 selection/access/binding/metadata trace | 06/05 audit | local contract/traceability；不证明 owner permission |
| `EV-SYNC-FLOW-001` | clone/pull/conflict/resume/cancel flow | 06 | local state/UoW/forbidden effect |
| `EV-SYNC-HANDOFF-001` | candidate/attempt/transport/probe/Decision layer | 06/Governance owner | handoff layer facts；ACK 不等 accepted |
| `EV-SYNC-QRY-001` | 13 Query zero-write/read completeness | 06 | query behavior；不证明 external refresh |
| `EV-SYNC-OPS-001` | 3 Consumer/3 Job receipt/report/no repair | 06/ops | local operations result；不等正式 report/readiness |
| `EV-SYNC-CONFIG-001` | 42 leaf/4 profile/strict source/activation/failure | 06/07 | config contract；不等部署健康 |
| `EV-SYNC-REDACT-001` | no secret/body/path/provider/Git output | 06/security | absence in tested surfaces；不证明所有未来 sinks |
| `EV-SYNC-CONSISTENCY-001` | version/UoW/idempotency/commit unknown/recovery | 06/07 | controlled local semantics；physical crash/external equivalence pending |
| `EV-SYNC-ARCH-001` | dependency/outbound event/remote truth absence | 06/07 | static architecture boundary |
| `EV-SYNC-BLOCKER-001` | `SYNC-UP-*`/`SYNC-LOCAL-*` status and exact impact | all downstream | blocker truth；不构成 failure/pass |

## 4. 载体目录与最小字段

### 4.1 Test artifact

规划目录：`artifacts/test/<run_id>/`

```text
manifest.json
suite/<suite_id>/case-index.json
suite/<suite_id>/dispositions.json
suite/<suite_id>/safe-failure-summary.json (optional)
redaction-scan.json
blockers.json
```

每个 artifact 至少包含 `run_id`、`suite_id`、`case_id`、`profile`、`dataset_class`、`source_refs`、`disposition`、`state_summary`、`blocker_refs`、`redaction_version` 和生成时间（来自注入 Clock）。不得包含 raw body/secret/full path/stdout/stderr/provider response。

### 4.2 Run report

规划目录：`reports/runs/<run_id>/`

```text
run.json
suite-summary.json
coverage-links.json
failure-summary.json
environment-profile.json
```

`run.json` 只描述 planned/observed run metadata、profile、suite status、blockers、toolchain marker（若未来确认）；不得写 fake commit/hash、readiness 或 owner accepted。失败 suite 仍保留脱敏 reason；unknown/blocked 不压成 skipped/pass。

### 4.3 Acceptance handoff summary

规划目录：`reports/acceptance/`

计划内容：按 AC/VETO/FR/BR/NFR 的 evidence link、coverage status、blocker map、evidence ceiling 和下一动作，供未来 06 消费。此目录当前不存在，也不在本步创建；不填写 verdict、signoff、review decision 或 readiness。

## 5. 证据边界矩阵

| 载体/事实 | 可证明 | 不可证明 |
|---|---|---|
| pure unit/property artifact | object/state/policy/canonicalization | store/tool/owner integration、readiness |
| application fake report | order/write-set/zero-write/idempotency/unknown mapping | real effect equivalence、owner accepted |
| adapter contract report | typed mapping/unavailable/failure seam | official endpoint/service health |
| local Git observation | dirty/root/path/tool observation | Git remote truth、Artifact/Baseline |
| local finalize result | local binding/cursor/mapping/provenance visibility | platform Artifact/source accepted |
| handoff transport ACK | transport fact/attempt identity | Review accepted/Decision/approval/signoff |
| job report/telemetry | bounded operations/diagnostic signal | evidence/readiness/verdict |
| config profile report | strict parse/profile/capability classification | health/authorization/clean worktree |

## 6. Redaction与完整性规则

- 所有 artifact/report/evidence 在写入前做 forbidden-value scan；scan failure 将 packaging gate 置为 blocked。
- 只存 safe refs、digest、长度、类型、状态、correlation 和 bounded reason；full sensitive ref 也按 04 的敏感级别裁剪。
- provenance/history 只追加、保护、supersede/degrade；不得为了清理证据删除业务事实。
- 证据索引必须含 source ref、case/suite/run、profile、design refs 和 blocker；不得只凭文件名或 `latest`。
- 同一 run/case/digest 的报告更新必须保留历史和 revision；不能覆写 unknown/partial 为 known。

## 7. 证据与 blocker 关系

| blocker | 证据姿态 |
|---|---|
| SDK/source/access/review/probe 未闭合 | 只产出 local contract/negative/blocked mapping 计划；不产 owner success evidence |
| physical `.qs-sync` 未闭合 | 只产 logical UoW/metadata evidence 计划；不产 physical durability claim |
| Git/fs support 未闭合 | 只产 path/dirty policy/controlled seam 计划；不产真实 tool compatibility claim |
| runner/package/tool 未确认 | 只产 semantic suite/path schema；不产 command/run result |

## 8. 回填草稿（未来正式 §13）

报告与证据严格分层并使用固定目录：单次测试 artifact 在 `artifacts/test/<run_id>/`，运行报告在 `reports/runs/<run_id>/`，供 06 消费的计划索引在 `reports/acceptance/`。所有载体脱敏、可追溯、禁止 `latest` 和 project 子目录。local/fake/job/ACK/telemetry/commit 只证明各自层事实，不升格为 Artifact/Baseline/Review accepted/evidence/verdict/signoff/readiness。

## 9. 待确认事项

| 事项 | 处理 |
|---|---|
| artifact/report 实际 schema | 由 07/工具链和 06 消费契约确认；当前只锁最小字段与路径。 |
| retention/expiry | 由 09/安全/metadata owner 确认；05 不删除 provenance/history。 |
| evidence signer/attestation | 由 06/治理 owner 确认；本轮不生成 signoff。 |
| stdout/stderr 是否可保留 | 默认不保留 raw；仅脱敏 bounded summary。 |

## 10. Step 自检与进入下一步门禁

| 检查项 | 结果 |
|---|---|
| artifact/report/evidence 层次、路径、字段和上限明确 | pass |
| forbidden output 与 redaction gate 明确 | pass |
| blocker 不被证据伪造关闭 | pass_with_upstream_blockers |
| 未创建实际载体或结果 | pass |
| 允许进入 Step 14 | pass |

## 11. 下一步门禁

Step 14 必须整理 suite/case/config/adapter 变更的回归选择、风险登记、残余 blocker 和 future trigger，并完成跨切口、跨覆盖、跨 evidence 的审计输入。
