# Step 2. 明确实施目标、范围和非范围

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 2
> 回填章节: `07-实施计划.md` §2 实施目标与范围

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 2 明确实施目标、范围和非范围 |
| 当前状态 | 已完成;自动继续后续 Step |
| 输入基线 | Step 1 输入边界结论;`00-需求文档.md`;`03-详细设计.md`;`05-测试方案.md`;`06-验收标准.md` |
| 输出文件 | `projects/L1-governance/design-calibration/07_implementation_plan_step_02_scope.md` |
| 停审方式 | 用户已要求自动执行后续 Step;本 Step 完成后直接进入 Step 3 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 1 输入边界 | 已完成 | 固定 `00`~`06` 可作为实施计划输入,并记录 design baseline / target repo 风险 |
| `00-需求文档.md` §7 / §9 / §14 | 已存在 | 提供 C-GOV-1~5、FR-GOV-001~010、FR-GOV-E01~E06、AC-GOV-001~031、VF-GOV-001~010 |
| `03-详细设计.md` §4~§16 | 已存在 | 提供七 crate workspace、对象 / port / protocol / flow / state / persistence / config / observability / test cuts |
| `05-测试方案.md` §2 / §9 / §13 / §14 | 已存在 | 提供 P0 / P1 / P2 测试范围、blocking suite、artifact / report、residual 风险 |
| `06-验收标准.md` §2 / §5~§14 | 已存在 | 提供验收范围、功能门禁、红线、接口同步、非功能、VETO 和最终裁决口径 |

## 3. SOP 问题回答

1. 本轮实施的最小可交付结果是什么。

   回答: 最小可交付结果是 `/home/aris/Projects/quantalithos-governance` 中可编译、可测试、可通过 P0 设计门禁的 Governance truth center。它必须覆盖 Governance context / input、Gate / Decision / Approval responsibility、Policy / shared rules / conflict、Control / AIIA / SoA、Nonconformity、authorized query / projection / trace、inbound consumer、outbox publish、operations jobs、config / redaction / evidence scripts。它不是单个 API、单个 domain 包或只跑通 smoke 的半成品。

2. 哪些需求编号必须覆盖。

   回答: 必须覆盖 C-GOV-1~C-GOV-5、FR-GOV-001~FR-GOV-010、BR-GOV-001~BR-GOV-040 对应的 P0 规则约束、AC-GOV-001~AC-GOV-031 和 VF-GOV-001~VF-GOV-010。FR-GOV-E01~E06 是外围增强,不进入当前 P0 实施范围。

3. 哪些详细设计章节必须落地。

   回答: 必须落地 `03-详细设计.md` §4~§16:实现单元与文件布局、模块实现契约、对象 / trait / API 索引、23 Command、14 Query、9 Inbound Consumer、12 Outbound Event、7 Operations Job、逐接口 flow、状态矩阵、持久化事务一致性、错误恢复、并发幂等、配置绑定、观测审计和测试切口。`03` 的风险与待确认事项进入 Step 9 和 Step 10,不由实现者现场补缺。

4. 哪些验收项必须在本轮可判定。

   回答: 本轮实施完成后必须能让 AC-GOV-001~031 按 `06-验收标准.md` 的 P0 口径被判定,并能证明 VF-GOV-001~010 未触发。正式通过 / 有条件通过 / 不通过结论不在实施计划阶段填写,但实施计划必须保证 artifact、report、EV、VETO 和 acceptance handoff 的生成路径可执行。

5. 哪些能力明确不在本轮实施。

   回答: 高级治理看板与报表、Policy DSL 与模拟评估、复杂 Gate 编排与升级路径、AIIA / SoA 自动草拟和周期重评建议、外部 GRC / 审计工具深度集成、容量 / 延迟 / 策略传播 / 报告健康度分析不进入 P0。真实 DB / bus / search / object storage / metric backend / external GRC 产品绑定、production-like、capacity、部署运维 runbook、真实验收裁决也不在当前实施范围。

6. 是否存在 P1 / P2 能力容易被误做进 P0。

   回答: 存在。高风险误入项包括 real-like adapter、durable store、真实 message product、external GRC vendor schema、高级 dashboard、Policy DSL、复杂 Gate、自动草拟、production-like / capacity gate 和 P1 selected-run。实施计划必须把这些写成 residual / future / selected-run,不得让它们阻塞 P0 truth center,也不得把 unavailable 伪装为 P0 passed。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| `07-实施计划.md` | 尚不存在实施目标与范围章节 | 无法指导后续 phase / commit boundary | 本 Step 提供 §2 回填草稿 |
| `00` 的核心 / 外围能力 | P0 与外围增强同时存在 | 实施阶段可能把 FR-GOV-E01~E06 误做进 P0 | 明确 FR-GOV-E01~E06 非本轮 P0 |
| `03` 的完整实现契约 | 对象、协议、flow、job、config、observability 范围很大 | 若只按模块横切会形成不可验增量 | Step 5 / Step 6 必须按可验证纵切分阶段 |
| `05/06` 的 P1/P2 selected-run | 真实 adapter / production-like 被记录为 residual | 实施者可能误以为必须先接真实产品 | 本 Step 明确 fake / controlled / disabled seam 是 P0,真实产品后置 |
| 验收执行结果 | 真实 run_id、implementation commit、config digest 尚不存在 | 无法在实施计划中填写最终结论 | 只定义生成路径和门禁,不伪造结果 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 实施目标 | 尚未定义 | 锁定为 P0 Governance truth center 可编译、可测试、可验收 | 防止后续任务膨胀或缩水 |
| 实施范围 | 分散在 `00/03/05/06` | 汇总为需求、设计、测试、验收四类范围 | 让 Step 5~6 可按范围拆 phase / commit |
| 非范围 | 只在上游各自声明 | 汇总 FR-GOV-E01~E06、真实产品、production-like、部署运维和真实验收结论 | 避免 P1/P2 混入 P0 |
| 验收目标 | 可能被理解为本 Step 要填真实 verdict | 明确本轮只保证可判定路径,不填写执行期真实结论 | 防止设计阶段伪造 evidence |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只实现最小 API smoke | 速度快 | 无法证明 Governance truth center、状态、事务、outbox、job 和 VETO | 不采用 |
| 完整实现 P0 truth center | 覆盖 C-GOV-1~5、FR-GOV-001~010、AC / VF,可进入验收 | 工作量大,需要分 phase / commit | 采用 |
| 把真实 DB / bus / external GRC 纳入 P0 | 更接近生产 | 产品未锁定,会让 P0 被 P1/P2 环境阻塞 | 不采用 |
| 用 fake / controlled / disabled seam 完成 P0,真实产品后置 | 符合 `05/06`,能验证语义和边界 | 不证明真实 vendor 行为 | 采用 |

## 7. 结构化中间产物

### 7.1 实施目标表

| 实施目标 | 来源 | 完成判定 |
|---|---|---|
| 建立 `quantalithos-governance` Rust workspace 和七 crate 实现边界 | `03` §4~§5 | `contracts/domain/application/infra/api/worker/jobs` 可编译,依赖方向符合设计 |
| 实现 Governance core truth accepted command 主链 | C-GOV-1~4;FR-GOV-001~008;`03` §6~§11 | 23 Command 的 P0 子集最终全量可执行,accepted path 具备 truth / trace / outbox / stale / stored result |
| 实现授权 query / projection / trace 消费面 | C-GOV-5;FR-GOV-009;`03` §7~§11 | 14 Query hit/missing/not visible/degraded/stale/failed/empty/no-write 可测 |
| 实现 inbound / outbound event seam | FR-GOV-009~010;`03` §7~§11 | 9 Consumer、12 Outbound Event、receipt、snapshot、outbox payload snapshot 和 retry / failed marker 可测 |
| 实现 operations job 和 report / duplicate replay | FR-GOV-010;`03` §7~§13 | 7 Operations Job report、partial failure、duplicate replay 和 no truth repair 可测 |
| 实现 P0 config、redaction、dependency 和 evidence 脚本门禁 | `04`;`05` §9 / §13;`06` §10~§14 | fixed artifact / report path、redaction / dependency / report audit 和 acceptance handoff 生成路径成立 |

### 7.2 实施范围表

| 类别 | 内容 | 来源 | 是否本轮实施 | 说明 |
|---|---|---|---|---|
| 核心闭环 | C-GOV-1~C-GOV-5 | `00` §7 | 是 | 作为 P0 纵切和最终 release smoke 主线 |
| 功能能力 | FR-GOV-001~FR-GOV-010 | `00` §9 | 是 | 必须映射到 command / query / consumer / job / report |
| 外围增强 | FR-GOV-E01~FR-GOV-E06 | `00` §9 | 否 | 作为 residual / future,不得阻塞 P0 |
| 规则边界 | BR-GOV-001~BR-GOV-040 | `00` §10 / §14 | 是 | 进入 domain invariant、service guard、redaction、dependency 和 VETO 测试 |
| 验收项 | AC-GOV-001~AC-GOV-031 | `00` §14;`06` §5~§14 | 是 | 必须能被 evidence / report 判定,但不在设计阶段填写 verdict |
| 一票否决 | VF-GOV-001~VF-GOV-010 | `00` §14;`06` §11 | 是 | 每个 phase / gate 提前规避,最终 release gate 不得命中 |
| 实现单元 | 七 crate workspace、script / artifact / report roots | `03` §4;`05` §9 / §13 | 是 | Step 3 / Step 4 继续细化为交付物 |
| Public protocol | 23 Command、14 Query、9 Consumer、12 Outbound Event、7 Job | `03` §7;`06` §7 | 是 | Step 6 分批落到 commit boundary |
| P0 environment | local-dev、ci-test、integration-like、operations-replay | `04`;`05` §8~§9;`06` §3 | 是 | fake / controlled / disabled seam |
| P1 / P2 environment | staging-like、production-like、real-like selected-run | `05` §8~§14;`06` §2 / §13 | 否 | 只作为 residual / selected-run,不计 P0 pass |

### 7.3 非范围表

| 非范围项 | 来源 | 处理 |
|---|---|---|
| 高级治理看板与报表 | FR-GOV-E01 | 记录为 future,基础 dashboard / query view 仍按 P0 query surface 实现 |
| Policy DSL 与模拟评估 | FR-GOV-E02 | 不实现 DSL / simulation engine;P0 只实现 Policy effective fact / shared rules truth |
| 复杂 Gate 编排与升级路径 | FR-GOV-E03 | 不实现复杂 orchestration;P0 只实现正式 Gate / Decision / Approval responsibility 基础闭环 |
| AIIA / SoA 自动草拟和周期重评建议 | FR-GOV-E04 | 不生成正文草稿;P0 只保存治理结论和 ref / safe summary |
| 外部 GRC / 审计工具深度集成 | FR-GOV-E05 | P0 只实现 disabled / fake / controlled export boundary,不绑定 vendor schema |
| 容量、延迟、策略传播和报告健康度分析 | FR-GOV-E06 | P0 只产出结构性 sample / report,不设置 production SLO |
| 真实 DB / bus / search / object storage 产品 | `03` §17;`05` §14;`06` §13 | 作为 P1/P2 或 ADR 输入,不阻塞 P0 |
| 部署拓扑、运维告警、生产 runbook | `03` §2 非范围 | 留给部署与运维文档 |
| 真实 implementation commit / `run_id` / config digest / final verdict | `06` §3 / §14 | 实施执行和验收阶段填写,不在 `07` 设计阶段伪造 |

### 7.4 P1 / P2 防误入表

| 容易误入 P0 的能力 | 正确边界 | 防误入规则 |
|---|---|---|
| real-like adapter / durable store | P1 selected-run | P0 使用 fake / in-memory / controlled;unavailable 只记 residual |
| production-like / capacity gate | P2 / future | 不作为 P0 release blocker;无正式阈值时只生成 sample |
| external GRC vendor schema | P1/P2 | P0 只验 disabled / fake / controlled export 不定义 truth |
| advanced dashboard / analytics | P2 | P0 只实现基础 query / dashboard view |
| Policy DSL / simulation | P2 | P0 不引入 DSL parser 或 rule engine |
| complex Gate orchestration | P2 | P0 不提前实现复杂多人编排 |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_02_scope.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“实施目标表”“实施范围表”“非范围表”和“P1 / P2 防误入表”小节,了解实施目标与范围如何收敛。

正式 `07-实施计划.md` §2 应回填:

本轮实施目标是把 `L1-governance` 落地为可编译、可测试、可验收的 Governance truth center。实现范围覆盖 C-GOV-1~C-GOV-5、FR-GOV-001~FR-GOV-010、AC-GOV-001~AC-GOV-031 和 VF-GOV-001~VF-GOV-010,并按正式 `03` 实现七 crate workspace、23 Command、14 Query、9 Inbound Consumer、12 Outbound Event、7 Operations Job、配置 / redaction / dependency / evidence 门禁。

本轮实施必须让 P0 Governance truth、read model、event seam、operations job、config profile、artifact / report 和 acceptance handoff 具备可执行路径。正式验收结论、真实 `run_id`、implementation commit、config digest 和 final verdict 不在设计阶段填写。

FR-GOV-E01~E06、真实 DB / bus / search / object storage / external GRC 产品绑定、production-like、capacity、高级 Policy DSL、复杂 Gate、自动草拟、部署运维 runbook 和 vendor-specific 行为不进入 P0 实施范围。这些能力只能作为 residual、future、selected-run 或后续 ADR 输入,不得阻塞 P0 truth center 成立。

## 9. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 目标实现仓由 PH-01 创建还是手工预建 | 影响 Step 3 / Step 5 前置条件 | Step 3 记录为检查项,Step 5 可把创建纳入 PH-01 |
| P1 selected-run 是否需要在未来 release candidate 中触发 | 影响 future gate,不影响 P0 | Step 7 / Step 9 记录为 residual |
| 真实产品选型何时进入 ADR | 影响 P1/P2 durable adapter | Step 9 记录为风险和后续触发 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 本轮目标明确 | 通过 | P0 Governance truth center |
| 本轮范围明确 | 通过 | C-GOV / FR-GOV / AC / VF / `03` 实现契约 |
| 非范围明确 | 通过 | FR-GOV-E01~E06、真实产品、production-like、部署运维和真实 verdict |
| P1 / P2 防误入口径明确 | 通过 | selected-run / residual / future,不得替代 P0 |
| 可进入 Step 3 | 通过 | 下一步收稳前置条件与阅读清单 |
