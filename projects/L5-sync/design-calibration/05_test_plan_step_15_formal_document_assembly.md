# Step 15. 整理正式测试方案文档

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 15。
> 目标：由 Step 1～14 的停审产物装配正式 `projects/L5-sync/05-测试方案.md`。
> 本步完成后立即停审，不读取或创建 06。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 15 / formal_document_assembly |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 正式 05 写入 | `completed / closed`；已 full-restart 装配 |
| 直接动作 | 完成最终静态闭环审计并停审 |
| 下一文档 | 不进入 06；下一动作 `user_review_formal_05` |
| 持续 blocker | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` |

## 2. 装配输入清单

| 正式章节 | 主要 calibration 来源 |
|---|---|
| §1 上游关系 | Step 1 |
| §2 目标/范围 | Step 2 |
| §3 对象/切口 | Step 3 |
| §4 策略/分层 | Step 4 |
| §5 追溯/覆盖 | Step 5 |
| §6 场景/用例 | Step 6 |
| §7 测试数据 | Step 7 |
| §8 环境/配置 | Step 8 |
| §9 自动化/CI 门禁 | Step 9 |
| §10 专项/NFR | Step 10 |
| §11 缺陷/复验 | Step 11 |
| §12 进入/退出 | Step 12 |
| §13 报告/证据 | Step 13 |
| §14 回归/残余风险 | Step 14 |
| §15 参考 | 本步来源索引与停审声明 |

## 3. 装配纪律

1. 正式文档按 §1～§15 主链重写，不在旧 `05-测试方案.md` 上增量拼接；旧正式 05/06、README、draft 只保留历史诊断语句。
2. 每章开头必须指明具体 calibration 来源和延伸阅读；正文只引用已完成 Step 的结构化产物。
3. 保持 29 objects、10 Command、13 Query、3 Consumer、3 Job、17 state、42 config leaf、4 P0 profile 的 exact vocabulary；不引入旧 SyncTask/旧状态/旧 API。
4. 所有 suite/case/evidence ID 都是设计级计划标识；不得写真实执行结果、artifact、report、verdict、signoff、readiness。
5. 正式文档必须重复 owner/truth boundary、Query zero-write、no auto merge/rebase/push/stash、dirty non-overwrite、ACK≠accepted、commit≠Artifact/Baseline、redaction 和 blocker 纪律。

## 3A. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 装配依据是什么？ | 只使用 Step 1～14 的停审产物和 00～04 当前正式基线；不从旧 05/06/README/draft 继承 truth。 |
| 正式文档如何保证可追溯？ | 每章有 calibration 来源和延伸阅读，§1～§15 与 Step 1～15 一一映射。 |
| 装配完成能证明什么？ | 证明测试设计文档已完成静态闭环；不证明任何实现、run、结果、evidence 或 readiness。 |

## 3B. 旧材料诊断与改动前后对比

| 维度 | 旧正式 05 | 当前正式 05 |
|---|---|---|
| 主线 | 旧 SyncTask/体验层流程 | 00～04 的 CP、对象、protocol、state、config、evidence 主链 |
| 章节 | 非 SOP 15 章、缺 blocker/evidence ceiling | §1～§15 全量装配，逐章来源与停审 |
| 证据 | 旧路径/泛化通过语义 | run-scoped 路径、proof ceiling、planned/blocked/waiting |
| 工具选择 | 历史 Rust/Tauri/LFS 等倾向 | 当前保持 pending/historical，不锁实现工具 |

## 3C. 测试设计取舍

1. 用中间产物装配而不是在正式文档中临时补设计，确保每个 P0 批次独立可审计。
2. 正式文档保留 blocker 和证据上限，优先真实性而非“看起来完成”。
3. 装配后立即停审，不跨入 06/07，等待用户 review。

## 4. 跨文档闭环审计清单

| 审计轴 | 必须核对 |
|---|---|
| object/field | 05 只引用 03 exact object/field；不新增 schema |
| protocol | 10/13/3/3 数量和名称与 03 一致；Outbound Event=`not_applicable` |
| state | 17 主语和值不改写；disposition ≠ lifecycle |
| config | 42 leaf、38 required、4 nullable operations、4 P0 profile、strict source/activation 和 redaction一致 |
| traceability | CP/FR/BR/AC/VETO/NFR ↔ TC/Suite/Evidence 双向完整 |
| evidence | `artifacts/test/<run_id>/`、`reports/runs/<run_id>/`、`reports/acceptance/`，无 latest/project 子目录 |
| blocker | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` 原样保留；P1 positive blocked/waiting |
| historical | 旧 05/06/README/draft 不覆盖当前 truth |
| implementation | 不创建 implementation ledger/skeleton，不实现代码，不运行测试，不提交 |

## 5. 正式文档装配后的状态目标

```text
formal_05_status = formal / stop_review
formal_05_calibration_write_allowed = completed / closed
formal_05_write_allowed = completed / closed
next_allowed_action = user_review_formal_05
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

## 6. Step 15 自检（装配后）

| 检查项 | 结果 |
|---|---|
| Step 1～14 均为 `completed / stop_review` | pass |
| 正式章节 1～15 有唯一来源 | pass |
| blocker/evidence/禁止行为边界可回填 | pass |
| 正式 05 已按 §1～§15 full-restart 装配 | pass |
| 正式 05 静态闭环审计完成 | pass_with_upstream_blockers |

## 7. 待确认事项

| 事项 | 处理 |
|---|---|
| 06 最终 AC/VETO/evidence schema | 保留 00 IDs，标记为 06 consumer decision。 |
| 07 runner/package/phase/commit | 不在 05 写入 implementation facts。 |
| 上游 positive contract | 保持 blocked/waiting，装配后不改姿态。 |

## 7A. 回填草稿（正式文档完成状态）

正式 `05-测试方案.md` 已按 Step 1～14 的停审产物装配为 §1～§15；文档状态为 `formal / stop_review`。正文只保留 planned/blocked/waiting 设计语义，不填实现、run、测试结果、artifact、report、evidence、verdict、signoff 或 readiness。

## 8. 装配后停审记录

- 正式 05 §1～§15 已由本 Step 1～14 逐章回填。
- 静态审计通过：章节、ID、数量、路径、redaction、truth ownership、blocker 和 historical boundary 无冲突。
- 已更新 flow、`project_execution_ledger.md` 和本文件为 `completed / stop_review`。
- 已完成一次最终静态审计；发送完成汇报后停止，不读取/创建/修改 06 或 07。

## 9. 下一步门禁

下一步仅为 `user_review_formal_05`。在用户明确确认前，不得读取、创建或修改 06/07，不得实现代码、运行测试、创建真实 evidence 或提交 commit。
