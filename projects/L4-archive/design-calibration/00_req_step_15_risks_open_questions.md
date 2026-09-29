# Step 15. 风险与待确认事项

## 1. Step 状态

- 状态：`[x] 已完成并通过自检`
- 回填位置：正式 `00-需求文档.md` §15
- gate_status：`pass_with_blockers`
- gate_reason：风险与待确认事项已拆表，所有未闭合合同均明确影响与当前挂起口径，没有脑补最终方案。
- next_allowed_action：进入 Step 16 需求追溯矩阵。

### 1.1 Step 内计划

- [x] 读取 Step 1~14 的 blocker、风险和待确认记录以及需求规范 §4.15。
- [x] 区分“风险”与“会影响前文成立的待确认事项”。
- [x] 诊断旧文档将供应商选择、截止时间和空泛 TODO 当风险的问题。
- [x] 选择按 AR-UP blocker 聚合风险，不在本仓解决 owning project 合同。
- [x] 形成带稳定编号、影响范围、owner 指向和当前挂起口径的两张表。
- [x] 形成回填草稿并完成不确定性/伪关闭自检。

## 2. 本步输入

- `design-calibration/00_req_step_01_upstream_relation.md` 至 `00_req_step_14_acceptance_criteria.md`
- `design-calibration/project_execution_ledger.md` 的 `AR-UP-001~009`
- `standards/document/需求文档书写规范.md` §4.15
- 旧 `00-需求文档.md` §12（仅作污染审计）

## 3. SOP 问题回答

1. 哪些风险尚未关闭？

   owner snapshot/export/fence/coverage、`L1-work` lifecycle handoff、governance retention/hold/delete/risk decision、密码学/schema authority、storage contract、Artifact/Observability/Workspace material boundary、restore receiver outcome 均未闭合。

2. 哪些会阻塞后续正向设计或 readiness？

   `AR-UP-001~009` 不阻止需求边界收束，但会阻止相关 adapter/protocol 的确定实现、真实集成、量化验收和 readiness；在 owning project 合同关闭前必须保留 pending/blocked。

3. 当前如何处理而不脑补方案？

   本仓只记录影响、owner 和 fail-closed 上限；不选择供应商/算法/密钥，不定义上游 schema，不代替 owner 关闭 blocker。

4. 哪些是待确认事项而非一般 TODO？

   只保留会改变 source authority、治理执行、完整性、存储、恢复接口或验收口径的合同问题；普通实现优化不进入本表。

## 4. 当前文档问题诊断与设计取舍

| 项 | 历史问题 | 当前取舍 |
|---|---|---|
| 存储选型 | 把 Glacier/自建选择和截止时间列为风险。 | 记录 `AR-UP-005` 的能力合同缺口，不在需求层选择供应商。 |
| 恢复时限 | 把两分钟或时间窗口作为待确认。 | 缺 workload authority 前只保留量化验收 blocker。 |
| 删除与永久保留 | 作为 Archive 自己解决的冲突。 | 指向 governance/legal owner，当前 fail-closed。 |
| 风险状态 | 使用“未定/后续再看”。 | 明确当前如何挂起以及何时阻塞。 |

## 5. 结构化中间产物

### 5.1 风险清单

| 风险 | 影响范围 | 当前处理口径 |
|---|---|---|
| `R-AR-001 / AR-UP-001`：各 L1 owner 的 snapshot/export/query、版本/水位、fence、coverage 合同不一致 | A2、A3、数据、接口、验收；owner：各 L1 truth project | 按逐 source binding 处理；缺失/冲突保留 partial、stale、missing 或 blocked。 |
| `R-AR-002 / AR-UP-002`：`L1-work` 生命周期与 Archive 触发/恢复 handoff 未闭合 | A1、A5、A7~A9、规则；owner：`L1-work` | 只消费 owner decision/ref，不推断 archived/dissolved/restored。 |
| `R-AR-003 / AR-UP-003`：RetentionPolicy、legal hold、删除授权和风险接受接缝未闭合 | A5、BR-AR-006、验收；owner：`L1-governance` 或明确 owner | fail-closed；不固定保留年限或销毁动作。 |
| `R-AR-004 / AR-UP-004`：digest、签名、密钥、加密、压缩和 schema evolution authority 未确定 | A4、A7、NFR、验收；owner：待正式指定 | 只记录待验证状态；不私造算法、密钥或 digest。 |
| `R-AR-005 / AR-UP-005`：对象存储 location/tier/迁移/取回语义未确定 | A5、性能/可用性；owner：存储/运维 owning project 待指定 | 保留 storage adapter seam；位置和执行未知保持可见。 |
| `R-AR-006 / AR-UP-006~008`：Artifact、Observability、Workspace 的 archive material/ref 接缝未闭合 | A2~A6、数据和审计；owner：`L1-artifact`、`L4-observability`、`L1-workspace` | 只接收 owner-approved material/ref；不把引用或 projection 当正文/canonical truth。 |
| `R-AR-007 / AR-UP-009`：owner restore receiver 反馈枚举和提交语义未闭合 | A7~A9、恢复验收；owner：各接收 truth project | 逐 owner 记录结果，保留 commit-unknown 和 compensation-required。 |

### 5.2 待确认事项

| 待确认事项 | 影响章节 | 当前状态 |
|---|---|---|
| `Q-AR-001`：各 source 的最小 snapshot/export/ref 合同及 authority matrix 是否统一 | §6、§7、§9、§11、§12、§14 | 不强行定统一字段；正向能力受阻时停在 blocked；由各 L1 truth project 提供合同。 |
| `Q-AR-002`：workspace projection 是否存在稳定 archive read/export contract | §6、§9、§11、§12 | 暂按辅助快照处理，不纳入 canonical 主链；指向 `L1-workspace`。 |
| `Q-AR-003`：governance decision、RetentionPolicy、legal hold、删除授权的正式输入面 | §6、§10、§12、§15 | 按治理结论依赖挂起；不产生默认决定；指向 `L1-governance`/明确 owner。 |
| `Q-AR-004`：digest/signature/KMS/schema evolution 的 owning authority | §9、§10、§12、§13、§14 | 保持 unknown/pending；不声明 verified 或长期可读；owner 待正式指定。 |
| `Q-AR-005`：外部存储层级、迁移和取回目标值 | §9、§12、§13、§14 | 不承诺供应商、tier、RTO/RPO 或分钟级 SLA；指向存储/运维 owner。 |
| `Q-AR-006`：各 owner 的 restore/import/command/handoff 接收方和反馈协议 | §7、§9、§12、§14 | 只形成 owner-specific plan/material；未获反馈不得判定恢复成功；指向各 truth owner。 |

## 6. 回填草稿

当前风险集中在九类上游合同：逐源 snapshot/export/fence/coverage、项目生命周期 handoff、governance retention/hold/delete/risk decision、密码学/schema authority、storage contract、Artifact/Observability/Workspace material seam 和各 owner restore receiver。所有问题均指向 owning project；Archive 只保留逐源状态、fail-closed 和 owner-specific handoff，不代替上游补定义或声明 blocker 已关闭。

## 7. 自检与进入下一步条件

- [x] 风险与待确认事项拆成两张表。
- [x] 每条风险都有影响范围和当前处理口径；每条待确认都有影响章节和挂起方式。
- [x] 未新增功能、目标、规则或实施方案。
- [x] gate_status=`pass_with_blockers`，允许进入 Step 16。
