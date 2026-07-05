# Step 2. 明确实施目标、范围和非范围

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 2
> 回填章节: `07-实施计划.md` §2 实施目标与范围
> 参考粒度: `projects/L1-governance/design-calibration/07_implementation_plan_step_02_scope.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 2 明确实施目标、范围和非范围 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 1 输入边界结论;`00-需求文档.md`;`03-详细设计.md`;`05-测试方案.md`;`06-验收标准.md` |
| 输出文件 | `projects/L1-artifact/design-calibration/07_implementation_plan_step_02_scope.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 3 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 1 输入边界 | 已完成;用户已同意继续 | 固定 `00`~`06` 可作为实施计划输入,并记录 design baseline、target repo 和 boundary ledger 风险 |
| `00-需求文档.md` §7 / §9 / §10 / §14 / §16 | 已存在 | 提供五个核心能力、`FR-ART-001~020`、`BR-ART-001~025`、`VF-ART-001~004` 和追溯矩阵 |
| `03-详细设计.md` §4~§16 | 已存在 | 提供七 crate workspace、对象 / port / protocol / flow / state / persistence / config / observability / test cuts |
| `05-测试方案.md` §2 / §9 / §13 / §14 | 已存在 | 提供 P0 / P1 / P2 测试范围、blocking suite、artifact / report、`EV-CAND-ART-*` 和 residual 风险 |
| `06-验收标准.md` §2 / §5~§14 | 已存在 | 提供验收范围、`AC-ART-001~058`、`VETO-ART-001~009`、risk acceptance 和最终裁决口径 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本轮实施的最小可交付结果是什么? | 最小可交付结果是 `/home/aris/Projects/quantalithos-artifact` 中可编译、可测试、可通过 P0 设计门禁的 Artifact truth center。它必须覆盖 Artifact fact、version、lineage、baseline、consumable reference / backref、authorized read surface、inbound consumer、outbox / relay、operations job、config / redaction / evidence scripts。它不是单个 API、单个 domain 包或只跑通 smoke 的半成品。 |
| 哪些需求编号必须覆盖? | 必须覆盖 `FR-ART-001~020`、`BR-ART-001~025`、`NFR-ART-CAP-001~027`、`NFR-ART-GLOB-001~012` 的 P0 规则约束,并保证 `VF-ART-001~004` 不触发。搜索 / 浏览增强、归档消费友好输出、观测友好输出、SDK / console / sync 友好输出等仅在正式 P0 seam 内体现,不得膨胀为高级产品能力。 |
| 哪些详细设计章节必须落地? | 必须落地 `03-详细设计.md` §4~§16: workspace / crate 与文件布局、模块实现契约、对象 / trait / API 索引、16 Command、13 Query、6 Inbound Consumer、8 Outbound Event、6 public Operations Job、worker-only `PublishPendingArtifactRelays`、逐接口 flow、状态矩阵、持久化事务一致性、错误恢复、并发幂等、配置绑定、观测审计和测试切口。 |
| 哪些验收项必须在本轮可判定? | 本轮实施完成后必须能让 `AC-ART-001~058` 按 `06-验收标准.md` 的 P0 口径被判定,并能证明 `VETO-ART-001~009` 未触发。正式通过 / 有条件通过 / 不通过结论不在实施计划阶段填写,但实施计划必须保证 artifact、report、candidate evidence、VETO checklist 和 acceptance handoff 的生成路径可执行。 |
| 哪些能力明确不在本轮实施? | 真实 DB / bus / search / object storage 产品绑定、真实 upstream / downstream 产品深度集成、production-like / capacity / hard SLO、高级 dashboard / analytics、derived UX、长期 evidence retention 数值、部署运维 runbook、真实验收裁决、真实 `run_id` 和 final signoff 不进入当前实施设计范围。 |
| 是否存在 P1 / P2 能力容易被误做进 P0? | 存在。高风险误入项包括 real-like provider selected-run、durable store、真实消息产品、external archive / observability / sync vendor schema、高级 dashboard、production-like / capacity gate、long-retention storage 和 P1 selected-run。实施计划必须把这些写成 residual / future / selected-run,不得让它们阻塞 P0 truth center,也不得把 unavailable 伪装为 P0 passed。 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| `07-实施计划.md` | 尚不存在实施目标与范围章节 | 无法指导后续 phase / commit boundary | 本 Step 提供 §2 回填草稿 |
| `00` 的核心能力与增强能力 | 核心闭环和消费友好输出同时出现 | 实施阶段可能把高级发现 / 展示 / SDK 能力误做进 P0 | 明确 P0 只覆盖 formal seam 和基础 read/report surface |
| `03` 的完整实现契约 | 对象、协议、flow、job、config、observability 范围很大 | 若只按模块横切会形成不可验增量 | Step 5 / Step 6 必须按可验证纵切分阶段 |
| `05/06` 的 P1/P2 selected-run | 真实 adapter / production-like 被记录为 residual | 实施者可能误以为必须先接真实产品 | 本 Step 明确 fake / controlled / disabled seam 是 P0,真实产品后置 |
| 验收执行结果 | 真实 `run_id`、implementation commit、config digest 尚不存在 | 无法在实施计划中填写最终结论 | 只定义生成路径和门禁,不伪造结果 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 实施目标 | 尚未定义 | 锁定为 P0 Artifact truth center 可编译、可测试、可验收 | 防止后续任务膨胀或缩水 |
| 实施范围 | 分散在 `00/03/05/06` | 汇总为需求、设计、测试、验收四类范围 | 让 Step 5~6 可按范围拆 phase / commit |
| 非范围 | 只在上游各自声明 | 汇总真实产品、production-like、正文存储、部署运维和真实验收结论 | 避免 P1/P2 混入 P0 |
| 验收目标 | 可能被理解为本 Step 要填真实 verdict | 明确本轮只保证可判定路径,不填写执行期真实结论 | 防止设计阶段伪造 evidence |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只实现最小 API smoke | 速度快 | 无法证明 Artifact truth center、状态、事务、outbox、job 和 VETO | 不采用 |
| 完整实现 P0 Artifact truth center | 覆盖 `FR-ART-001~020`、`AC-ART-*`、`VETO-ART-*`,可进入验收 | 工作量大,需要分 phase / commit | 采用 |
| 把真实 DB / bus / archive / observability 产品纳入 P0 | 更接近生产 | 产品未锁定,会让 P0 被 P1/P2 环境阻塞 | 不采用 |
| 用 fake / controlled / disabled seam 完成 P0,真实产品后置 | 符合 `05/06`,能验证语义和边界 | 不证明真实 vendor 行为 | 采用 |
| 把 `PublishPendingArtifactRelays` 并入 6 个 public jobs | 简化任务表 | 违反 `03/05/06` 的 worker-only relay facade 口径 | 不采用;必须单列 |

## 7. 结构化中间产物

### 7.1 实施目标表

| 实施目标 | 来源 | 完成判定 |
|---|---|---|
| 建立 `quantalithos-artifact` Rust workspace 和七 crate 实现边界 | `03` §4~§5 | `contracts/domain/application/infra/api/worker/jobs` 可编译,依赖方向符合设计 |
| 实现 Artifact fact accepted command 主链 | `FR-ART-001~004`;`03` §6~§11 | fact、automation input、review anchor、responsibility context、trace / audit / outbox / stale / stored result 可执行 |
| 实现 Artifact version 主链 | `FR-ART-005~008`;`03` §6~§13 | candidate / publish / supersede / current pointer / history retain / duplicate replay 可测 |
| 实现 Artifact lineage 主链 | `FR-ART-009~012`;`03` §6~§13 | formal lineage link、rejection、impact summary、backref、consumer signal 收束可测 |
| 实现 Artifact baseline 主链 | `FR-ART-013~016`;`03` §6~§13 | baseline candidate / freeze / supersede / history audit 只接正式 version 可测 |
| 实现 Artifact consumable reference / backref / read surface | `FR-ART-017~020`;`03` §7~§11 | consumable ref、read surface、consumer backref、handoff、no ownership transfer 可测 |
| 实现 inbound / outbound / relay seam | `03` §7~§9;`06` §7 | 6 Consumer、8 Outbound Event、`PublishPendingArtifactRelays` worker-only relay facade、snapshot payload 和 failure marker 可测 |
| 实现 operations job 和 report / replay | `03` §7~§13;`06` §7~§10 | 6 public Jobs report、partial failure、duplicate replay、no truth repair 和 disabled target surface 可测 |
| 实现 P0 config、redaction、dependency 和 evidence 脚本门禁 | `04`;`05` §9 / §13;`06` §10~§14 | fixed artifact / report path、redaction / dependency / report audit、VETO checklist 和 acceptance handoff 生成路径成立 |

### 7.2 实施范围表

| 类别 | 内容 | 来源 | 是否本轮实施 | 说明 |
|---|---|---|---|---|
| 核心闭环 | 制品事实承载、制品版本化、制品血缘关联、制品基线冻结、制品事实可消费表达 | `00` §7 / §14 | 是 | 作为 P0 纵切和最终 release smoke 主线 |
| 功能能力 | `FR-ART-001~020` | `00` §9 / §16 | 是 | 必须映射到 command / query / consumer / job / report |
| 规则边界 | `BR-ART-001~025` | `00` §10 / §16 | 是 | 进入 domain invariant、service guard、redaction、dependency 和 VETO 测试 |
| 非功能能力级要求 | `NFR-ART-CAP-001~027` | `00` §13 | 是 | 进入状态、幂等、no-write、degraded、trace 和 evidence gate |
| 非功能全局要求 | `NFR-ART-GLOB-001~012` | `00` §13 | 是 | 进入 truth ownership、正文排除、依赖降级、无来源指标和边界异常检查 |
| 验收项 | `AC-ART-001~058` | `06` §5~§14 | 是 | 必须能被 evidence / report 判定,但不在设计阶段填写 verdict |
| 一票否决 | `VETO-ART-001~009` | `06` §11 | 是 | 每个 phase / gate 提前规避,最终 release gate 不得命中 |
| 实现单元 | 七 crate workspace、script / artifact / report roots | `03` §4;`05` §9 / §13 | 是 | Step 3 / Step 4 继续细化为交付物 |
| Public protocol | 16 Command、13 Query、6 Consumer、8 Outbound Event、6 public Job | `03` §7;`06` §7 | 是 | Step 6 分批落到 commit boundary |
| Worker relay facade | `PublishPendingArtifactRelays` | `03`;`05`;`06` §7 | 是 | worker-only internal relay publication facade,不得并入 public job 数量 |
| P0 environment | `local-dev`、`ci-test`、`integration-like`、`operations-replay` | `04`;`05`;`06` §3 | 是 | fake / controlled / disabled seam |
| P1 / P2 environment | `staging-like`、`production-like`、real-like selected-run | `05`;`06` §2 / §13 | 否 | 只作为 residual / selected-run,不计 P0 pass |

### 7.3 非范围表

| 非范围项 | 来源 | 处理 |
|---|---|---|
| 外部正文 / 附件 / 运行材料 / 消费副本正文存储 | `00` §11;`01`;`06` §6 / §11 | 禁止进入本仓 truth 或正式输出面;只允许 ref / safe summary / marker |
| 真实 DB / bus / search / object storage 产品 | `03` §2 / §17;`05`;`06` §13 | 作为 P1/P2 或 ADR 输入,不阻塞 P0 |
| 真实 upstream / downstream 产品深度集成 | `05`;`06` §2 | P0 只实现 formal seam contract、fake / controlled / disabled adapter |
| `staging-like` / `production-like` / capacity / hard SLO | `05`;`06` §2 / §9 | 不作为 P0 pass/fail;无正式阈值前只生成 structure sample |
| 高级 dashboard / analytics / derived UX | `06` §2 | P2 residual;基础 read surface / report 是 P0 |
| 长期 evidence retention 天数 | `06` §2 / §13 | operations residual;当前只要求验收与复验关闭周期可追溯 |
| 部署拓扑、生产告警、运维 runbook | `03` §2 非范围 | 留给部署与运维文档 |
| 真实 implementation commit / `run_id` / config digest / final verdict | `06` §3 / §14 | 实施执行和验收阶段填写,不在 `07` 设计阶段伪造 |
| 正式 `EV-ART-*` evidence alias | `06` 文档元信息 / §15 | 当前不引入;保持 `EV-CAND-ART-* -> artifact_path -> report_path -> run_id` 可逆追溯 |

### 7.4 P1 / P2 防误入表

| 容易误入 P0 的能力 | 正确边界 | 防误入规则 |
|---|---|---|
| real-like provider selected-run | P1 residual | P0 使用 fake / controlled / disabled;unavailable 只记 residual |
| durable store / real bus / real object storage | P1/P2 / ADR | P0 不因真实产品缺失失败;只验证 repository / publisher / storage seam |
| production-like / capacity gate | P2 / future | 不作为 P0 release blocker;无正式阈值时只生成 sample |
| external archive / observability / sync vendor schema | P1/P2 | P0 只验 disabled / fake / controlled handoff 不定义 vendor truth |
| advanced dashboard / analytics | P2 | P0 只实现基础 query / report / handoff surface |
| long-retention evidence store | Operations residual | P0 只验证 run-scoped artifact/report pairing |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_02_scope.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“实施目标表”“实施范围表”“非范围表”和“P1 / P2 防误入表”小节,了解实施目标与范围如何收敛。

正式 `07-实施计划.md` §2 应回填:

本轮实施目标是把 `L1-artifact` 落地为可编译、可测试、可验收的 Artifact truth center。实现范围覆盖制品事实承载、制品版本化、制品血缘关联、制品基线冻结、制品事实可消费表达五个核心能力,覆盖 `FR-ART-001~020`、`BR-ART-001~025`、`NFR-ART-CAP-001~027`、`NFR-ART-GLOB-001~012`、`AC-ART-001~058` 和 `VETO-ART-001~009`,并按正式 `03` 实现七 crate workspace、16 Command、13 Query、6 Inbound Consumer、8 Outbound Event、6 public Operations Job、worker-only `PublishPendingArtifactRelays`、配置 / redaction / dependency / evidence 门禁。

本轮实施必须让 P0 Artifact truth、read surface、event seam、operations job、config profile、artifact / report、VETO checklist 和 acceptance handoff 具备可执行路径。正式验收结论、真实 `run_id`、implementation commit、config digest 和 final verdict 不在设计阶段填写。

真实 DB / bus / search / object storage / external archive / observability / sync 产品绑定、production-like、capacity、高级 dashboard / analytics、derived UX、长期 retention、部署运维 runbook 和 vendor-specific 行为不进入 P0 实施范围。这些能力只能作为 residual、future、selected-run 或后续 ADR 输入,不得阻塞 P0 truth center 成立。

## 9. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 目标实现仓由 PH-01 创建还是手工预建 | 影响 Step 3 / Step 5 前置条件 | Step 3 记录为检查项,Step 5 可把创建纳入 PH-01 |
| P1 selected-run 是否需要在未来 release candidate 中触发 | 影响 future gate,不影响 P0 | Step 7 / Step 9 记录为 residual |
| 真实产品选型何时进入 ADR | 影响 P1/P2 durable adapter | Step 9 记录为风险和后续触发 |
| relay facade 在 commit boundary 中如何单列 | 影响 Step 6 提交边界 | Step 6 必须保持 `PublishPendingArtifactRelays` worker-only 独立口径 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 本轮目标明确 | 通过 | P0 Artifact truth center |
| 本轮范围明确 | 通过 | 五个核心能力、`FR-ART-*`、`BR-ART-*`、NFR、`AC-ART-*`、`VETO-ART-*` 和 `03` 实现契约 |
| 非范围明确 | 通过 | 真实产品、production-like、正文存储、部署运维、真实 verdict 和 formal `EV-ART-*` evidence alias |
| P1 / P2 防误入口径明确 | 通过 | selected-run / residual / future,不得替代 P0 |
| 可进入 Step 3 | 通过 | 下一步收稳前置条件与阅读清单;进入前等待用户审查 |
