# L2-member-images 05 测试方案 Step 14：回归策略与残余风险

> 状态：`completed`
> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 14
> 回填位置：正式 `05-测试方案.md` 第 14 章

## 0. Step 状态与输入

| 项目 | 记录 |
|---|---|
| 本步目标 | 定义变更触发的最小/全量回归集，登记当前残余风险、owner、缓解和重开条件。 |
| 本步输入 | Step 1~13；03 Step 18 风险/重开规则；04 Step 14 风险；测试规范 §5.14。 |
| 本步输出 | 回归触发表、残余风险表、跨切口/证据/阻断审计和正式 §14 草稿。 |
| gate_status | `pass_with_explicit_blockers` |

## 1. SOP 问题回答

| 问题 | 收敛回答 |
|---|---|
| 哪些变更必须最小回归？ | contracts/DTO、domain/state、application/UoW/idempotency、infra/config、api/worker/jobs、docs/evidence tooling 各有对应 suite；任何 owner contract 变化还要重开边界测试。 |
| 何时做全量回归？ | 共享字段/状态/port/error、source/profile、store/version/replay、static/live/redaction、依赖裁剪或 VETO 相关变更；以及 blocker 解除后。 |
| 当前残余风险是什么？ | B01/B02/PF、owner/sibling/schema、无真实 environment/threshold、无实现/执行 evidence；均不能由测试方案自行接受。 |
| 谁接受风险？ | 由 06、架构、owner、测试/安全/运维在未来报告中明确；本文件只登记候选责任域。 |

## 2. 回归触发表

| 变更类型 | 最小回归集 | 全量回归触发条件 | 责任人/待确认方 |
|---|---|---|---|
| `contracts` DTO/ref/error | `pr-contract-domain`、`ci-entry-contracts` | public field/schema/enum/mapper 改动 | contracts + API/worker owner |
| `domain` object/state/guard/history | domain suite、state matrix、VETO negative | lifecycle、factory、不变量、append/supersede 改动 | domain owner + 架构 |
| application flow/UoW/idempotency | boundary-no-write、integration-seams、concurrency | canonical input/result replay、transaction order、version 改动 | application owner |
| infra store/projection/adapter | integration-seams、config-security、recovery negative | store schema、projection direction、adapter disposition 改动 | infra/runtime owner |
| config/profile/source/redaction | config-security、dependency-redaction | key/source/profile、sensitive policy、startup activation 改动 | config/security/ops owner |
| api/worker/jobs entry | entry-contracts、boundary-no-write | route/event/job shape、marker/acceptance boundary 改动 | entry owner + event owner |
| test scripts/report/evidence | affected suite、evidence index、redaction scan | path/schema/EV mapping、gate logic 改动 | test/release owner |
| sibling/upstream contract closure | negative seam + affected protocol/state suite | MI-UP/Q-MI blocker 解除或 schema 正式变更 | 双方 owner；先重开 03/04 |

## 3. 残余风险表

| 风险 | 未覆盖原因 | 影响 | 缓解方式 | 接受人 |
|---|---|---|---|---|
| `DDD-S9-B01/B02` | canonical input/result replay 未闭 | 10 Command/6 Job 正向 mutation/replay 不可测 | zero-effect seam；重开 03 Step 6~9 | 详细设计 owner |
| `PF-UNAVAILABLE-RECOVERY` | recovery function 未定义 | projection recovery 正向不成立 | 只测 blocked/no-repair；重开 03 Step 10~16 | 详细设计 owner |
| `MI-UP-001/002/003/006/007` | sibling/owner schema pending | consumer/component/mapping/seed/Artifact positive lane 不可断言 | ref/gap/unknown；owner 闭合后重开 | 各 owner |
| `MI-UP-005/009` | inbound/outbound event authority pending | accepted event/publisher 不可测 | marker-only/zero inventory | Bus/Core/event owner |
| `Q-MI-001~004` | scope/product/evidence policy pending | special variant、multi-arch、真实 gate/扫描未覆盖 | P1/P2 future；不进 P0 分母 | scope/security/release owner |
| 无实现仓/CI/真实环境 | 当前未授权实施和执行 | 没有实际 run、report、digest、verdict | 07/执行阶段核验；不伪造 | 项目/实施 owner |
| 性能/容量阈值缺失 | 无 workload/baseline | 无法给出量化通过结论 | 只保留 benchmark 设计 | 运维/架构/测试 |
| 历史 05/06 污染 | 旧主线与路径不可信 | 可能误用旧结果/编号 | Step 15 只做差异审计 | 文档 owner |

## 4. 跨切口与重开审计

| 审计项 | 结论 |
|---|---|
| 每个 P0 logical surface 有 TC/层级/EV 方向 | 通过（planned；非执行结果） |
| 状态、UoW、幂等、Query no-write 与配置规则一致 | 通过；B01/B02/PF 仍显式阻断正向 lane |
| `Available/Fresh/Assembled` 是否被用作 readiness | 不允许；需负向断言 |
| blocked 与 failed 是否区分 | 已区分；环境/owner 缺口为 blocked，断言失败为 failed |
| 旧编号、旧路径、旧 report 是否回流 | 不允许；Step 15 做 historical-only 审计 |

## 5. 取舍、回填草稿、待确认与进入下一步条件

采用按变更面触发回归，而不是固定“全量每次运行”；这样保留边界清晰且不虚构执行能力。正式 §14 回填两张表和审计结论。进入 Step 15 的条件是回归触发器、残余风险、owner 和重开规则完整，且没有未登记的正向 readiness 假设。
