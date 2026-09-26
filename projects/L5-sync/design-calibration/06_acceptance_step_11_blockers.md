# Step 11. 定义一票否决项

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 11
> 回填位置：正式 `06-验收标准.md` §11

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 11 / blockers |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 否决项范围 | `VETO-SYNC-001~005` |
| 下一步 | `Step 12 / defects_release` |
| 正式 06 写入 | `blocked_until_step_15` |

## 2. 本步输入

| 输入 | 来源 | 状态 | 说明 |
|---|---|---|---|
| 需求 VETO | `00-需求文档.md` §14.1 | `available` | 5 个正式一票否决项 |
| 架构/数据红线 | `01-架构设计.md`、Step 6 | `available` | ownership、dirty、redaction、依赖边界 |
| 详细设计不变量 | `03-详细设计.md` §7～§14 | `available` | no auto effect、Query zero-write、state/UoW/provenance |
| 测试证据计划 | `05-测试方案.md` §12/§13、Step 10 | `planned` | EV/report/checklist 未来入口 |

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 哪些失败直接不通过？ | 5 个 VETO 任一触发；另有 redaction/dependency/report evidence integrity 失败时，按 S 级阻断并不得放行。 | 00 VETO；05 §12.3；Step 10 |
| 每个 VETO 来源和检查方式是什么？ | 分别由 00 BR/AC/VETO、03 flow/state/UoW/redaction、05 TC/EV 和固定 report path 检查；详见 §7.1。 | 00、03、05 |
| VETO 是否可风险接受？ | 不可。VETO、S 级、redaction leak、dependency boundary failed、evidence integrity failure 不能由 risk-acceptance 覆盖。 | 06 SOP Step 11/13 |
| 是否覆盖所有 P0 红线？ | 已覆盖自动危险副作用、结果升格、owner truth 越权、provenance/敏感泄露、unknown fail-closed；跨门禁审计确认无遗漏。 | Step 5/6/7/9/10 |

## 4. 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| VETO 使用旧编号/旧语义 | 无法回指当前需求和测试 | 固定 `VETO-SYNC-001~005` 原样继承 |
| 将“失败”与“不可放行”混写 | 可能允许风险接受绕过硬红线 | VETO 单独列出，不受风险接受覆盖 |
| 只写行为名，不写证据 | 无法证明触发或未触发 | 每项绑定 EV、report path、检查方式和 artifact pairing |
| 把 ACK/HTTP 200 当接受 | 造成 Review/Artifact truth 越权 | VETO-002 明确阻断 |
| unknown 下危险操作未单列 | 盲重放、dirty overwrite 风险 | VETO-001/005 同时覆盖 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 自动动作 | 可能被视为便利功能 | merge/rebase/push/stash/overwrite/blind replay 一票否决 | 防数据损失和副作用 |
| 结果语义 | commit/ACK/HTTP 200 泛化成功 | 只停留 local/transport/probe 层 | 保持 owner boundary |
| 外部 truth | 可能由 Sync 直接写 | Project/Artifact/Baseline/Gate/Workspace/Archive/Git remote 越权即否决 | 架构 ownership |
| provenance/secret | 可能被清理/调试输出 | 删除/伪造/泄露即否决 | 可追溯与安全 |
| unknown | 可能继续执行 | owner/access/source/comparator unknown 危险动作即否决 | fail-closed |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 把 VETO 混入普通 AC | 表格少 | 可能被条件通过或风险接受绕过 | 拒绝 |
| 增加大量新 VETO 编号 | 看似覆盖更细 | 破坏 00 稳定编号和追溯 | 拒绝 |
| 固定 5 个正式 VETO，扩展检查矩阵但不改编号 | 稳定、覆盖全、可回链 | 需要跨门禁审计 | 采用 |

## 7. 结构化中间产物

### 7.1 一票否决项表

| VETO ID | 否决项 | 正式来源 | 检查方式 | 计划证据 / report path | 触发后裁决 |
|---|---|---|---|---|---|
| `VETO-SYNC-001` | 自动 merge/rebase/push/stash、覆盖 dirty/untracked、blind replay 或 unknown effect 重放 | BR-SYNC-006/012/013、AC-SYNC-003/004/008/011/019；03 apply/recovery/idempotency | Git/fs forbidden-port/static check；dirty/path/conflict/partial/unknown negative；same-key/digest replay/race | `EV-SYNC-FLOW-001`、`EV-SYNC-CONSISTENCY-001`、`EV-SYNC-ARCH-001`; `reports/runs/<run_id>/evidence-index.md`、`veto-checklist.md` | 任一触发即 `不通过`；不可 risk-accept |
| `VETO-SYNC-002` | local Git commit、ACK、HTTP 200、remote object、cache、telemetry、job report 被当作 Artifact/Baseline/Review accepted/approved/signoff/readiness | BR-SYNC-008/015/022；AC-SYNC-005/006/009/013/018/020 | layered result/schema/static scan；handoff/report/redaction audit；禁止 top-level accepted/success/ready elevation | `EV-SYNC-HANDOFF-001`、`EV-SYNC-OPS-001`、`EV-SYNC-ARCH-001`; fixed evidence/report paths | 任一升格即 `不通过`；不可 risk-accept |
| `VETO-SYNC-003` | Sync 创建、修改或伪造 Project、Artifact、Baseline、Review Gate/Decision、Workspace projection、Archive 或 Git remote truth | BR-SYNC-016/020/021/023；AC-SYNC-010/013/017 | dependency/static boundary、forbidden port spy、store ownership scan、outbound-event absence；不接受私有 seam/共享 DB/任意 bus | `EV-SYNC-ARCH-001`、`EV-SYNC-TRACE-001`; `dependency-boundary.md`、`veto-checklist.md` | 任一越权即 `不通过`；不可 risk-accept |
| `VETO-SYNC-004` | provenance/冲突证据/credential/外部正文被删除、伪造、泄露或静默重绑定 | BR-SYNC-007/018/019；AC-SYNC-002/004/014/017/018/020 | provenance append/protect/supersede/integrity unknown；redaction/path/body/stdout/secret scan；history retention check | `EV-SYNC-TRACE-001`、`EV-SYNC-CONSISTENCY-001`、`EV-SYNC-REDACT-001`; `redaction-check.md`、`veto-checklist.md` | 任一触发即 `不通过`；不可 risk-accept |
| `VETO-SYNC-005` | owner/access/source/comparator unknown/stale/revoked/archived/dissolved/conflicting 时仍危险 materialize/handoff | BR-SYNC-003/004/010/017；AC-SYNC-001/003/005/006/007/008/009/011/016/019 | unknown/stale/blocked fixture；fail-closed gate；禁止 cache/default/ACK/static mapping 补齐；只允许 blocked/needs_action/conflict/unknown/manual | `EV-SYNC-TRACE-001`、`EV-SYNC-FLOW-001`、`EV-SYNC-HANDOFF-001`、`EV-SYNC-BLOCKER-001`; `veto-checklist.md` | 任一危险动作即 `不通过`；不可 risk-accept |

### 7.2 VETO 单项停审记录

| VETO | 来源是否正式 | 检查是否可执行 | 证据/path 是否固定 | 风险接受 | 状态 |
|---|---|---|---|---|---|
| VETO-SYNC-001 | 是 | 是（local/controlled；Git/fs positive blocked） | 是（planned） | 禁止 | `stop_review` |
| VETO-SYNC-002 | 是 | 是（layer/static/report audit） | 是（planned） | 禁止 | `stop_review` |
| VETO-SYNC-003 | 是 | 是（architecture/dependency/static） | 是（planned） | 禁止 | `stop_review` |
| VETO-SYNC-004 | 是 | 是（provenance/redaction negative） | 是（planned） | 禁止 | `stop_review` |
| VETO-SYNC-005 | 是 | 是（fail-closed negative；owner positive blocked） | 是（planned） | 禁止 | `stop_review` |

### 7.3 跨 VETO 覆盖审计

| 审计项 | 结论 | 缺口/修正 |
|---|---|---|
| 00 的 5 个 VETO 是否全部保留 | pass | 编号和语义不变 |
| P0 功能/红线/接口/状态/NFR/evidence 是否有 VETO 映射 | pass | 每项至少映射一项；Step 15 再做全文审计 |
| VETO 与 risk acceptance 是否冲突 | pass | 明确全部不可接受 |
| VETO 是否需要真实证据 | pass | 未有 artifact/report 不能宣称未触发 |
| `EV-SYNC-BLOCKER-001` 是否被误作 VETO proof | pass | 仅描述 blocker，不证明未触发 |
| 是否存在未覆盖的硬红线 | pass (design) | Step 15 再复核孤儿/重复/缺证据 |

## 8. 回填草稿

正式 §11 应固定 `VETO-SYNC-001~005`，逐项列出正式来源、检查方式、EV/report path 和触发后的“不通过”裁决。VETO 不得被风险接受、P1/P2 residual、口头确认、ACK、job report、telemetry、cache 或静态 checklist 覆盖；证据缺失本身不能写成未触发。

## 9. 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| Git/fs forbidden-operation runner | VETO-001 正向检查 | SYNC-LOCAL-004/005、07 |
| report/static elevation scanner | VETO-002/003 | Step 10/07 |
| provenance/redaction physical scan | VETO-004 | SYNC-UP-006、07 |
| owner/source/comparator fixtures | VETO-005 positive negative pair | SYNC-UP-001~003/008/010 |

## 10. 进入下一步条件

- [x] 5 个正式 VETO 均有来源、可执行检查、证据/path、触发裁决和不可 risk-accept 规则。
- [x] 每个 VETO 已独立停审。
- [x] 跨 VETO 覆盖无设计缺口；真实未触发结论仍待未来 evidence。
- [x] 正式 §11 回填草稿已形成。
- [x] 本步停审；进入 Step 12 前读取 05 缺陷/复验/退出产物和 Step 9/11 门禁。

## 11. Step 停审记录

- 本步裁决：`pass_with_upstream_blockers`。
- VETO 语义已冻结；当前没有真实 checklist/evidence，未声称任一 VETO 未触发。
- 下一步阅读：`05_test_plan_step_11_defects_retest.md`、`05_test_plan_step_12_entry_exit.md`，创建 Step 12。
