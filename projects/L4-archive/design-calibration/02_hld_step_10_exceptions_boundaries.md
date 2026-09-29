# Step 10. 异常与边界场景轮廓

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；对应概要 SOP Step 10。

- [x] 读取项目 ledger、02 flow、Step 8~9、正式 00 §14/§15。
- [x] 回答必须前置的异常、归属、状态影响与详细设计边界。
- [x] 按 admission/read、capture/bundle、capability/lifecycle、restore/handoff 四组审查。
- [x] 完成异常影响与历史污染审计。

装配审计复核：四组逐项数量为 `8 + 11 + 9 + 10 = 38`。此前跨 Step 摘要中的“34 个”属于计数错误；不删除任何已收稳场景。

## 2. 本步输入、问题回答与取舍

必须在概要层固定的不是完整错误码，而是异常发生时“谁处理、能否写、写哪个本地姿态、是否允许继续外部副作用”。普通字段校验、provider 错误码、具体 retry/backoff/timeout 和补偿脚本留 03/04。

异常会改变跨 CP 主线：source 缺口阻止 manifest Complete；closure/integrity/compatibility 缺口阻止 seal/material-ready；governance/storage 缺口阻止生命周期动作；receiver unknown 阻止重试与全局恢复声明。因关系清晰但跨四组，补一张异常影响图。

## 3. 请求受理与只读安全

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| authority/actor/scope 无法证明 | CP1 / ArchiveRequestService | Rejected 或 Blocked；不创建伪 Accepted，不泄露目标存在性。 |
| 同幂等 key 同 digest | CP1/CP5/CP6 对应入口 | 读回既有提交结果并按当前权限裁剪，不重复效果。 |
| 同幂等 key 异 digest | 对应 application service | Conflict；保留原记录，不覆盖或执行新副作用。 |
| 本地提交结果 unknown | ArchiveStorePort 与调用 service | 按稳定 request/action/handoff ref 核对；无记录不证明 rollback。 |
| Query 当前权限撤销或冲突 | 所有 Query / 访问决定边界 | fail-closed；旧成功、旧 ref 或 stale view 不复活权限。 |
| Bundle/job/plan 不存在或不可见 | CP1/CP3/CP6 Query | SafeNotAvailable；不区分 hidden 与 absent，不触发创建/修复。 |
| 查询遇到 partial/stale/unknown | Query composition | 在允许披露范围内返回显式多轴姿态；不返回伪完整 count。 |
| material/ref/finding 含未获准内容 | Query redaction boundary | 内容、ref、count、provenance 同一裁剪；不只裁正文。 |

## 4. source capture、manifest 与验证

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| source authority 或 exact contract 缺失 | CP2 / ArchiveSourceBinding | Planned/Blocked；不以 sibling 实现、SDK、event payload 或 fake 替代。 |
| owner export timeout/空响应 | CP2 / CaptureAttempt | Unknown/Blocked/Failed 依正式语义；不得直接判 Missing 或 empty。 |
| source version/fence 不可比较 | CP2 / CaptureCoverage | Stale/Conflicting/Unknown；不跨 owner 排序或选择“最大版本”。 |
| canonical slice 缺失但 workspace projection 存在 | CP2 / source-authority matrix | canonical 缺口保持；projection 只作 Auxiliary，不补 Complete。 |
| Artifact 只有 ref 无正文/血缘闭包证明 | CP2/CP3 | manifest 条目保留 ref 类别，coverage/closure 不得乐观完整。 |
| Observability 只有摘要或未明确脱敏边界 | CP2 | 只纳入获准 material/ref；不当完整审计链或 backend truth。 |
| manifest missing/unexpected/invalid | CP3 / ManifestClosure | Incomplete/Overfull/Invalid；不得忽略或用 verification/storage 成功修复。 |
| 固定 manifest 需修订 | CP3 / BundleManifest | 新建 immutable revision 并串前序；旧 assessment/placement 不自动适用。 |
| digest/signature/key/algorithm 不可用 | CP4 / VerificationAssessment | Blocked/Unknown；不生成占位 digest、签名或 key。 |
| integrity mismatch/signature invalid | CP4 | IntegrityFailed；相关 seal/restore material 路径阻塞，保留 finding。 |
| schema/reader/receiver version 不支持或冲突 | CP4 / CompatibilityAssessment | Unsupported/Conflicting/Unknown；不自动迁移，不跨 target context 复用。 |

## 5. 存储、治理与外部副作用

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| storage location/tier/provider 未闭合 | CP5 / ArchivePlacement | Intent 或 Blocked；不写 provider 名、默认 tier、durability 或 SLA。 |
| 外部发送成功但无 commit 反馈 | CP5 / ExternalActionRecord | Dispatched 或 CommitUnknown；ACK/transport success 不等 Committed。 |
| 外部调用 timeout 且可能已生效 | CP5 / ReconcileExternalAction | 先 probe；不支持 probe 则保持 unknown/人工处置，不盲 retry。 |
| retrieval 已请求但材料不可取回 | CP5 / ArchivePlacement retrieval 轴 | Requested/Unavailable/Failed；placement Committed 不推导 Retrievable。 |
| RetentionPolicy/期限无法解释 | CP5 / GovernanceDecisionPort | Blocked；不默认七年、不由配置生成。 |
| legal hold 存在、变化或版本冲突 | CP5 / LifecycleExecution | 危险动作立即 Blocked；旧 release/delete 不覆盖新 hold。 |
| 删除授权/风险接受缺失 | CP5 | 不创建 Eligible/dispatch；Archive 不批准销毁或接受风险。 |
| governance decision 变化 fan-out 部分完成 | CP5 Consumer | per-target 记录完成范围；不声明全局原子更新，查询仍 fail-closed。 |
| 本地结果保存失败或 unknown | CP5 service/store | 外部效果可能存在时进入 commit-unknown 核对；不可回滚推断。 |

## 6. 恢复计划、材料与 owner handoff

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| Bundle closure/integrity/compatibility/retrieval 任一不足 | CP6 / RestoreItem | Blocked；不进入 MaterialReady。 |
| restore target owner 未显式声明或 receiver 未闭合 | CP6 / RestorePlan/RestoreItem | 不生成全域默认 item；相关 owner item Blocked。 |
| material 属于其他 owner、stale、missing 或 conflicting | CP6 / PrepareRestoreMaterial | 拒绝绑定；不得转换为目标 owner 写权限。 |
| receiver ACK 无 commit 语义 | CP6 / RestoreHandoff | Acknowledged；不写 Succeeded。 |
| receiver timeout/重复/乱序反馈 | CP6 / HandoffOutcome | 按 handoff id + digest + receiver 语境去重/核对；不盲重发。 |
| receiver 明确 Reject/Fail/Conflict | CP6 | per-item Rejected/Failed/CommitUnknown/Blocked；其他 owner 不被推导。 |
| 多 owner 结果混合 | CP6 / RestorePlan | Partial；保留每项结果，不包装为全局恢复成功。 |
| compensation authority 缺失 | CP6 / CompensationRecord | Blocked；Archive 不自行 reverse/cancel/retry owner side effect。 |
| compensation timeout 或 commit unknown | CP6 | 先 probe，保留原 handoff 与补偿历史；不抹除原副作用。 |
| receiver 声称成功但 owner 项目状态未确认 | CP6/read surface | 只显示 handoff Succeeded；不得显示 project Restored。 |

## 7. 异常影响图

```text
request / source / external capability / receiver anomaly
                         │
                         ▼
             owning CP classifies locally
 rejected | blocked | partial | stale | conflicting |
 unsupported | integrity-failed | commit-unknown
                         │
           ┌─────────────┴─────────────┐
           ▼                           ▼
 safe local state/history       stop unsafe progression
 remains queryable              no seal / delete / retry /
 with current redaction         material-ready / success claim
```

关键说明：异常分类只改变 Archive-owned 状态与下一步资格，不修改 owner truth。确定失败与 unknown 分开；只有正式新输入、probe、decision 或 receiver outcome 才能解阻，参数和补偿脚本留后续设计。

## 8. 跨异常审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 关键验收负向路径 | pass | 00 §14 的 authority、truth、治理、完整性、unknown 副作用一票否决项均覆盖。 |
| 异常归属 | pass | 所有场景落到既有 CP/object/service/port，无“系统统一处理”。 |
| 写入边界 | pass | Query 不写；外部异常仅保存本地姿态，不反写 owner/provider。 |
| unknown 与失败 | pass | timeout/无记录/ACK 均不冒充失败、rollback 或 commit。 |
| 详细设计边界 | pass | 未写错误码全集、retry 参数、补偿脚本或 provider 映射。 |
| 历史污染 | pass | 无默认 replay、自动修复、固定 SLA、默认 retention/provider。 |

## 9. 回填草稿、待确认与进入下一步条件

正式 §10 摘录四组异常表与影响图；blocker 的关闭条件留 §13，不把外部设计风险伪装成已实现异常处理。

所有异常的精确错误分类、持久化约束、probe/retry/compensation 协议与安全披露规则由 03 承接；外部正向分支仍受 `AR-UP-001~009` 阻塞。

关键异常已明确归属、状态影响和禁止副作用，未越层到实现。`gate_status = pass_with_upstream_blockers`；允许创建并执行 Step 11。
