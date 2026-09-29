# Step 17. 正式需求文档装配

## 1. Step 状态

- 状态：`[x] 已完成并通过自检`
- 输出：`projects/L4-archive/00-需求文档.md`
- gate_status：`stop_review`
- gate_reason：Step 1~16 均已完成，正式 00 已按 16 节结构重建并通过来源、边界、追溯和污染审计。
- next_allowed_action：等待用户明确授权进入 `01-架构设计.md`；不得自动继续。

## 2. 装配输入

正式文档逐章承接 `00_req_step_01_upstream_relation.md` 至 `00_req_step_16_traceability_matrix.md`。装配只进行结构重组、术语统一、编号统一和交叉引用，不新增需求结论。

## 3. 写入前门禁

| 检查 | 结果 |
|---|---|
| 项目台账允许当前 00 装配 | pass |
| flow 的 Step 1~16 门禁已通过 | pass_with_blockers |
| Step 16 无孤儿项或矩阵新增项 | pass |
| 旧正式 00 已先删除再重建 | pass |
| 单次写入已分批控制 | pass |

## 4. 一致性审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 章节结构 | pass | 正式文档严格包含规范要求的 §1~§16；文档级状态保留在元信息、flow、ledger 和本 Step。 |
| 校准来源 | pass | 每个正式章节均列出具体 Step 文件和延伸阅读。 |
| 编号一致性 | pass | A1~A9、US-AR-001~010、F-AR-001~009、BR-AR-001~012 均一致。 |
| source authority | pass | L1 owner、workspace projection、artifact、observability 分层明确。 |
| 真相边界 | pass | Archive 只拥有归档专属对象、状态、计划和交接记录。 |
| 恢复边界 | pass | 只通过 owner-specific handoff；无直接上游写入。 |
| 依赖类型 | pass | compile/runtime/event/ref/adapter/fake 没有混写。 |
| 失败姿态 | pass | partial/stale/missing/conflicting/unsupported-version/integrity-failed/commit-unknown/compensation-required 均保留。 |
| blocker 保留 | pass | AR-UP-001~009 未被伪关闭。 |

## 5. 历史污染清除

- 已删除固定“六域必含”作为全局成功分母的口径。
- 已删除 Archive 生成 SoA/AIIA/Conformance Claim 的越界职责。
- 已删除 Archive 直接恢复 Active、发布 `project.restored` 或决定 archived/dissolved 的口径。
- 已删除固定七年保留、自动 purge、S3/Glacier/PostgreSQL、固定 SLA/容量数字。
- 已删除把 workspace projection、observability 摘要或 Artifact ref 当 canonical truth/完整正文的表达。

## 6. 停审结论

```text
formal_00_status = formal / stop_review
formal_01_write_allowed = false_until_new_user_authorization
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
upstream_blockers = AR-UP-001..AR-UP-009 retained
```
