# Step 12. 定义实施完成判定

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 12
> 回填目标：正式 `07-实施计划.md` §12

## Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 12 / implementation_completion判定 |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 下一步 | Step 13；装配正式 07、实施台账和 planned boundary skeleton |

## 本步输入

| 输入 | 来源 | 状态 |
|---|---|---|
| 实施范围/交付物 | Step 2/4 | completed / stop_review |
| phase/boundary/gates | Step 5～7 | completed / stop_review |
| 依赖/风险/rollback/commit | Step 8～11 | completed / stop_review |
| AC/VETO 三值规则 | `06-验收标准.md` §11～§14 | formal / stop_review |

## SOP 问题回答

| 问题 | 收口回答 | 依据 |
|---|---|---|
| 何时算 boundary 完成？ | boundary ledger 存在；Design/Scope/Worktree/Build/Test/Evidence/Commit/Handoff Gate 按计划有真实证据；hash 和 next action 已回写。 | 代码实施台账规范 §十四 |
| 何时算 phase 完成？ | 所属 boundaries 完成，阶段测试/验收/证据聚合无 unresolved S/VETO，跨 boundary 审计通过，才可进入下一 phase。 | 07 SOP §2.6/Step 7 |
| 何时算本轮实施完成？ | 范围内交付物完成、所有必要 gates 有证据、AC/VETO 可裁决、风险有正式处理，03/05/06/07 整体闭环审计通过。 | 07 规范 §5.12、06 §14 |
| 当前能否宣称实施完成？ | 不能。当前只有设计计划；目标仓、代码、run、artifact、report、evidence、commit/hash 和 reviewer 均不存在或未确认。 | Step 1/3、project ledger |
| 未完成项怎么处理？ | blocking → design/implementation blocker；P1 positive → waiting；P2/historical → deferred/future trigger；不得使用“基本完成”。 | 06 §12/§13 |

## 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 计划文档完成不等于代码完成 | 容易误报 readiness | 正式 07 明确双层结论：plan stop_review / implementation not_started |
| 真实 evidence 尚不存在 | 无法填写 AC/VETO 结论 | 只定义证据要求和路径，不填写实际结论 |
| 上游 blocker 仍在 | 正向 integration 无法放行 | 保持 boundary/phase blocked/waiting，要求回写设计或正式 owner contract |

## 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 完成 | 未定义 | boundary→phase→implementation 三层判定 | 避免混淆 |
| 未完成 | 泛化风险 | blocking/waiting/deferred 分类和动作 | 可执行 |
| 审计 | 仅有 03 预告 | 交付前按 03/05/06/07 + 每 boundary 主动审计 | 真相源闭环 |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 所有代码合并后统一判断 | 简洁 | 无法定位阶段和证据归属 | 拒绝 |
| 只看测试绿灯 | 快 | 漏掉 scope、VETO、redaction、truth owner 和 report audit | 拒绝 |
| boundary/phase/overall 三层完成判定 + 交付前闭环审计 | 可审查、可恢复 | 需要多张表 | 采用 |

## 结构化中间产物

### Boundary 完成判定表

| 判定项 | 标准 | 证据 | 当前计划姿态 |
|---|---|---|---|
| boundary ledger | 文件存在且 current/future 状态合法 | boundary ledger | Step 13 预创建；当前未创建 |
| Design Gate | baseline、required reads、字段/DTO/state/phase closure | design refs/audit | blocked until baseline |
| Scope/Worktree Gate | allowed scope、用户改动保护 | cached diff/status | 未来执行 |
| Build/Test Gate | required checks 执行并记录 | command output/report | 当前未运行 |
| Evidence Gate | raw artifact/report pairing、redaction/link audit | fixed run paths | 当前无实例 |
| Commit Gate | staged scope/message/whitespace/checks | commit ledger | 当前无 commit |
| Handoff Gate | hash、blocker、next boundary、未跑测试、用户改动 | project/boundary ledger | 当前未交付 |

### Phase 完成判定表

| Phase | 完成标准 | 必须证据 | 当前姿态 |
|---|---|---|---|
| PH-01 | 01-a/b boundary 完成，shared/config contract 可验证 | protocol/config reports | blocked/waiting |
| PH-02 | 02-a/b metadata/access facts 闭环 | domain/metadata/UoW evidence | blocked/waiting |
| PH-03 | 03-a/b status/materialization safety | query/flow/fault evidence | blocked/waiting |
| PH-04 | 04-a/b recovery/unknown/idempotency | state/consistency evidence | blocked/waiting |
| PH-05 | 05-a/b handoff/provenance layers | handoff/trace evidence | blocked/waiting |
| PH-06 | 06-a/b query/CLI safe entry | query/entry/redaction evidence | blocked/waiting |
| PH-07 | 07-a/b consumer/job/ops hooks | ops/replay/redaction evidence | blocked/waiting |
| PH-08 | 08-a/b reports/handoff/audit reviewed | fixed-run acceptance package | blocked/waiting |

### 实施完成判定表（未来真实实现）

| 判定项 | 标准 | 证据 | 允许结论 |
|---|---|---|---|
| 需求覆盖 | 本轮范围内 FR/BR/AC 有实现或正式延期/风险记录 | trace matrix、review | 通过/不通过 |
| 交付物 | code/test/config/script/doc 交付物全部完成 | boundary ledgers、diff | 通过/不通过 |
| Build/Test | 所有必要 boundary/phase gates 有真实结果 | artifacts/reports | 通过/不通过 |
| Acceptance | P0 AC 可判定，VETO 有真实检查，S=0 | reports/acceptance | 通过/有条件通过/不通过（由 06） |
| Evidence | raw/report/index/redaction/dependency/report-audit 完整 | fixed run | 通过/不通过 |
| Closure audit | 03/05/06/07 按 boundary 审计通过，未关闭项回写 | audit record + baseline | 可移交/暂停 |
| Blockers | 无未处理 blocking；P1/P2 有正式 disposition | blocker/risk records | 可移交/等待 |

### 未完成项处理表

| 类型 | 例子 | 处理 | 是否可风险接受 |
|---|---|---|---|
| Design blocker | 字段/DTO/state/owner/metadata/effect equivalence 缺口 | 回写 03/04/05/06/07，固定新 baseline | 否 |
| Implementation blocker | build/test/redaction/scope failure | 当前 boundary 修复并重跑 | 否，除非 06 规则允许的非 P0 residual |
| P1 waiting | SDK/Git/fs/Review positive contract unavailable | 标 waiting，保持 local negative only | 需正式 owner/acceptor，不能伪造 |
| P2 deferred | LFS/浅克隆/GUI/容量数字 | future trigger/范围外记录 | 可作为 R residual，不能改变 P0 |
| Evidence gap | 缺 artifact/report/index/audit | 重新生成固定 run；保留失败 run | P0 不可接受 |
| VETO/S | dangerous effect/truth elevation/raw leak | 停止并修复；原 family 复验 | 不可风险接受 |

### 交付实现前整体闭环审计

| 审计范围 | 检查内容 | 失败处理 | 当前姿态 |
|---|---|---|---|
| 03→07 field/DTO | 每 boundary 的字段、carrier、view、receipt、report 可构造 | 回写 03/07 | planned |
| 03→07 state | 17 主语 exact enum/transition，测试/验收同名 | 回写 03/05/06/07 | planned |
| 03→07 metadata/idempotency | authority、digest、stored result、UoW、unknown reload | 回写 03/04/07 | planned |
| 05→07 test/evidence | TC→EV→artifact/report→AC/VETO | 回写 05/06/07 | planned |
| phase/boundary | 无跨 phase 偷用后续结果；每 future boundary skeleton 存在 | 重切 boundary/预创建台账 | planned |
| dependency/truth | Sync 不拥有外部 truth；Outbound Event=0 | 退回架构/详细设计 | planned |
| redaction/report | raw secret/body/path/Git output absent | 清理并重跑 | planned |

### 当前计划结论

```text
plan_status = complete_after_step_13
implementation_status = not_started
implementation_readiness = not_claimed
actual_verdict = not_applicable
actual_signoff = not_applicable
actual_evidence = absent
```

## 回填草稿

正式 §12 将回填 boundary/phase/overall 三层完成判定、未完成项处理、交付前 03/05/06/07 审计和当前计划/实现双层状态；不填写实际完成、通过、readiness 或 signoff。

## 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| 目标仓和 baseline | 所有实际完成判定 | 实现移交前 |
| blocker 解锁和 owner acceptor | P1/positive release | 对应 boundary |
| fixed run/evidence/reviewer | PH-08/06 acceptance | 最终送验前 |

## 进入下一步条件

- [x] boundary、phase、overall 完成判定可审查。
- [x] 未完成项分类和处理动作明确。
- [x] 交付前整体闭环审计范围固定。
- [x] 当前不声称实现完成或 readiness。
