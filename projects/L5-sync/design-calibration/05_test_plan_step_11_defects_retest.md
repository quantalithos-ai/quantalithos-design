# Step 11. 定义缺陷管理与复验规则

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 11。
> 回填章节：未来正式 `05-测试方案.md` §11。
> 本步定义设计级缺陷分类、状态、复验和回写规则；不创建 defect、run 或实际报告。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 11 / defects_retest |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 直接下一步 | Step 12：定义进入/退出准则 |
| 持续 blocker | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` |

## 1A. 本步输入

- Step 5 coverage、Step 6 cases、Step 9 gate、Step 10 NFR/VETO、Step 13 evidence boundary。
- `03-详细设计.md` §11～§15 的 error/recovery/concurrency/observability 和 `04-配置设计.md` §11～§12 的 failure/handoff。

## 1B. 旧材料诊断与改动前后对比

| 维度 | 旧材料 | 当前缺陷规则 |
|---|---|---|
| blocker | 与失败/关闭混同 | `UP/LOCAL blocker` 独立状态，不能用 fake/重试关闭 |
| severity | 单一 bug 列表 | VETO/core/integration/documentation 分级影响 gate |
| 复验 | 只重跑 happy path | 原 case/data/profile + 受影响横切回归 |
| 回写 | 测试侧临时补字段 | design-change-required 回写 00/03/04 后继续 |

## 1C. 测试设计取舍

1. 保留首次 unknown/partial/blocked carrier，避免重测覆盖事实或误转 known。
2. P0 VETO/安全/一致性错误优先阻断；P1 external mapping 不能伪造为 P0 pass。
3. 缺陷记录只保存 safe refs/digest/bounded summary，遵守 evidence redaction。

## 2. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 如何区分 defect 与 blocker？ | defect 是已能由当前合同/层级重现的实现或设计偏差；blocker 是外部合同/环境/工具未闭合，不能以失败重试或 fake 关闭。 |
| 哪些情况触发 03/04 回写？ | 新增字段、状态、port、error、carrier、config leaf、truth owner、evidence schema 或改变非范围/安全红线；测试方案不能自修。 |
| 如何复验？ | 原 case/data/profile/suite 复现→修复候选→目标 case retest→受影响依赖回归→redaction/evidence boundary 重扫。 |
| unknown/partial 缺陷如何处理？ | 保留原 unknown/partial 事实和 checkpoint/attempt；不能把重跑结果覆盖原记录或转 known。 |
| 什么时候可关闭？ | 只有在正式 owner/设计契约支持、可审计 run/artifact/report/evidence（未来阶段）和无残余 VETO violation 时；本轮只定义状态，不填 closed。 |

## 3. 缺陷分类与严重度

| 类别 | 说明 | 示例 | 处置 |
|---|---|---|---|
| `DESIGN-CONTRACT` | 03/04/00 契约矛盾或不可落码 | field/state/port/error/config leaf 缺失、结果层混同 | `design-change-required`；暂停相关 Step，回写 owner 文档 |
| `IMPLEMENTATION` | 已锁契约下的代码/编排偏差 | query 写 UoW、cursor wrong advance、ACK=accepted | P0 block，修复后 retest/regression |
| `SECURITY/VETO` | VETO 或敏感边界违反 | dirty overwrite、secret/body leak、private seam | immediate P0 block；不得以 workaround 关闭 |
| `CONSISTENCY/RECOVERY` | version/idempotency/UoW/unknown/replay 错误 | duplicate effect、commit unknown guessed、blind retry | P0 block，保留原 carrier/history |
| `CONFIG` | strict source/validation/activation/failure 偏差 | high-priority invalid fallback、半 graph facade | P0 block，重跑 config/redaction |
| `ADAPTER-CONTRACT` | SDK/Git/fs/store mapping 偏差 | raw provider error leak、typed unavailable mapped success | P1/blocking；若上游合同未闭合保持 blocked |
| `TEST-DESIGN` | case/data/traceability/gate 不完整 | 无负向 case、无 evidence ceiling、suite漏映射 | 先修 05 calibration，受影响后续 Step 重审 |
| `ENVIRONMENT/TOOLCHAIN` | runner/package/tool/env 缺失或不匹配 | LOCAL-001~005 | 标 waiting/blocked；不降级为 pass |
| `EVIDENCE-PACKAGING` | 路径、redaction、report schema 或链路错误 | 使用 latest、project 子目录、伪造 result | P0 packaging block；不修改业务 verdict |
| `UPSTREAM-BLOCKER` | 依赖 owner/合同未闭合 | SDK/source/Review/metadata/comparator 未知 | 保持 `SYNC-UP-*`；不创建 workaround |

## 4. 设计级严重度

| 严重度 | 触发条件 | 退出影响 |
|---|---|---|
| P0 / veto | VETO、越权、敏感泄露、truth ownership、dirty overwrite、blind retry、query write | 阻断所有相关 gate；不能进入 06/07 readiness |
| P1 / core | 核心 Command/Query/state/UoW/幂等/恢复或配置语义错误 | 阻断核心 suite；修复和回归后再评估 |
| P2 / integration | adapter mapping、controlled seam、环境/工具问题 | 受影响 P1 blocked；P0 local 可继续，但不得声称整体完成 |
| P3 / documentation | 文字、索引、非核心未来说明缺失 | 记录后修订；不改变 capability truth |

## 5. 缺陷记录最小字段

```text
defect_id / category / severity / source_refs / case_id / suite_id
first_observed_run_ref / profile / dataset_ref / blocker_refs
expected_contract / observed_disposition_or_state / forbidden_effect
reproduction_summary / redaction_status / design_change_required
owner / retest_scope / regression_scope / status / closure_authority
```

记录不得包含 raw secret、body、credential、完整 path、Git stdout/stderr 或 provider response；用 digest、safe ref 和 bounded summary 代替。

## 6. 缺陷状态流转

```text
new -> triaged -> assigned -> fixed_candidate -> retest
                         |                    |
                         +-> blocked/waiting  +-> regression
                                                  |
                                           resolved_candidate
                                                  |
                                      06/owner review -> closed
```

`blocked/waiting` 不是 pass，也不是 closed；`resolved_candidate` 只表示重测候选，不表示验收 verdict。涉及设计契约的 defect 在 triage 时必须冻结受影响的 05 case/traceability/suite，待回写后恢复。

## 7. 复验与回归矩阵

| 变更类型 | 必做复验 | 必做回归 |
|---|---|---|
| protocol/DTO/ref | 原 contract + body-free + typed separation | 所有 Command/Query/Consumer/Job envelope |
| state transition | 原合法/非法/terminal/context mismatch | 受影响 flow、recovery、handoff、consumer/job |
| UoW/version/idempotency | duplicate/digest/version/commit unknown | 10 Command、3 Job、Query no-write |
| config/source/activation | strict parser/profile/cross-field/redaction | builder、capability ceiling、entry-local/job-run-start |
| Git/fs/path safety | dirty/symlink/root/non-overwrite | clone/pull/status/resume/cancel/VETO |
| handoff/probe | ACK/unknown/probe/Decision layer | push-review、refresh、consumer Decision/job probe |
| redaction/diagnostic | canary all surfaces/sink failure | every report/artifact/log/audit/trace plan |
| evidence path/schema | path/latest/project-dir/redaction scan | cross-suite traceability and acceptance mapping |

## 8. Blocker 处理纪律

- `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` 只能由对应 owner/工具/合同闭合；测试失败、fake success、ACK、cache 或 telemetry 不得关闭。
- blocker 关闭后，需重开受影响 Step 的 input boundary、strategy、cases、data、environment 和 evidence mapping；不能只改状态文本。
- blocker 保持时，正向 integration case 的状态为 `blocked/waiting`；negative/unavailable case 可独立 planned。

## 9. 回填草稿（未来正式 §11）

缺陷按设计契约、实现、VETO/安全、一致性恢复、配置、适配器、测试设计、环境工具和证据包装分类，并按 P0～P3 影响 gate。复验必须重用原 case/data/profile，随后执行受影响回归；blocker 不等 defect，不得以 fake/ACK/报告关闭。所有记录保持脱敏和 local/evidence 分层。

## 10. 待确认事项

| 事项 | 处理 |
|---|---|
| 06 的 closure authority / verdict schema | 05 只定义状态和最小字段，06 决定正式关闭。 |
| issue tracker / defect ID 格式 | 留给 07/项目工具选择；本轮使用 semantic placeholder。 |
| retest runner / environment | `SYNC-LOCAL-004` 和 profile contract 关闭后确定。 |

## 11. Step 自检与进入下一步门禁

| 检查项 | 结果 |
|---|---|
| defect/blocker/design-change 区分明确 | pass |
| VETO、redaction、unknown、evidence packaging 有高优先级处理 | pass |
| retest/regression 触发器完整 | pass |
| 未创建 defect、run 或结果 | pass |
| 允许进入 Step 12 | pass |

## 12. 下一步门禁

Step 12 必须把 P0/P1/P2、blocker、redaction、VETO、evidence schema 和依赖条件转为进入/退出准则；退出不能写成“已通过”，而要写成未来可审计的判定条件和保守阻断规则。
