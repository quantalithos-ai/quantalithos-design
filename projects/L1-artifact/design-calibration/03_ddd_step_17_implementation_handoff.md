# Step 17. 收口详细设计到实施计划的承接清单

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 17
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md` §5.10
> 回填章节: `03-详细设计.md` §16 详细设计到实施计划的承接清单
> 生成日期: 2026-07-04
> 状态: 已完成;待用户审查

---

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 17 收口详细设计到实施计划的承接清单 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | 需求、架构、概要、Step 1~16 详细设计校准文档 |
| 输出文件 | `projects/L1-artifact/design-calibration/03_ddd_step_17_implementation_handoff.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 18 |

---

## 2. 本步目标

本 Step 把 Step 1~16 已经闭口的详细设计契约整理成未来 `07-实施计划.md` 可以直接引用的承接清单,并在进入正式实施计划前完成一次跨文档一致性预复核。

本 Step 只回答:

- 哪些详细设计契约已经可被实施计划承接。
- 实施者开始编码前必须阅读哪些文档和规范。
- 字段、DTO / Event / Job、Query response、状态、命名和 phase / commit boundary 是否存在显性断裂。
- 哪些事项不能进入实施,必须在 Step 18 / Step 19 或后续 `04/05/06/07` 中继续闭合。

本 Step 不写开发排期、任务拆分、phase 划分、commit boundary、测试用例编号、验收 evidence 编号、实现仓代码批次或交付时间表。这些属于后续正式 `05-测试方案.md`、`06-验收标准.md` 和 `07-实施计划.md` 的职责。

---

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `03_ddd_step_01_upstream_boundary.md` | 已完成 | 固定新版 `00/01/02` 为详细设计输入,旧 `03` 只作诊断 |
| `03_ddd_step_02_scope.md` | 已完成 | 固定 P0 / 非范围,防止实施计划扩域 |
| `03_ddd_step_03_constraints.md` | 已完成 | 固定 Rust、语言、仓库、提交和依赖约束 |
| `03_ddd_step_04_file_layout.md` | 已完成 | 固定 workspace / crate / file layout |
| `03_ddd_step_05_module_contracts.md` | 已完成 | 固定七个实现模块和依赖方向 |
| `03_ddd_step_06_object_contracts.md` | 已完成 | 固定对象、字段、状态、reason、marker、trace、relay、projection、handoff、report 等 schema |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 固定 repository、port、adapter、UoW、Clock、IdGenerator、stored result 等读取 / 写入面 |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 固定 Command、Query、Inbound Event、Outbound Event、Job public protocol surface |
| `03_ddd_step_09_function_flows.md` | 已完成 | 固定逐接口处理流、事务顺序、副作用顺序和异常分支 |
| `03_ddd_step_10_state_matrix.md` | 已完成 | 固定正式状态枚举、合法迁移、非法迁移和测试入口 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已完成 | 固定持久化、optimistic version、transaction、relay snapshot、projection / reference consistency |
| `03_ddd_step_12_error_recovery.md` | 已完成 | 固定错误模型、retry、dead-letter、quarantine、degraded / failed surface |
| `03_ddd_step_13_concurrency_idempotency.md` | 已完成 | 固定 idempotency、duplicate replay、commit unknown、concurrency guard |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | 固定 config boundary、adapter binding、external dependency availability |
| `03_ddd_step_15_observability_audit.md` | 已完成 | 固定日志、指标、审计、trace、redaction 和 forbidden field guard |
| `03_ddd_step_16_test_cuts.md` | 已完成 | 固定最小测试切口,为后续 `05` 和 `07` 提供验证入口 |
| `projects/L1-governance/design-calibration/03_ddd_step_17_implementation_handoff.md` | 已读取 | 作为 Step 17 粒度框架参考,本文件按 Artifact 语义重写 |
| `standards/document/实施计划书写规范.md` | 已读取 | 固定 Step 17 与正式实施计划的边界 |
| `standards/coding/rust.md` | 已由 Step 3 承接 | 固定 Rust 源码英文、rustdoc、注释和测试命名规范 |
| `projects/README.md` §1.1 / §8.2 | 已由 Step 3 承接 | 固定设计仓 / 实现仓目录和提交语言边界 |

---

## 4. 分批写入记录

| 批次 | 内容 | 状态 |
|---|---|---|
| 17.1 | 文件骨架、本步目标、输入和 SOP 问题回答 | [x] 已写入 |
| 17.2 | 实施承接清单、前置阅读清单、实施前检查清单 | [x] 已写入 |
| 17.3 | 跨文档一致性复核表、命名一致性表、冲突与修正表 | [x] 已写入 |
| 17.4 | 正反例、回填草稿、未进入实施的待确认项和进入下一步条件 | [x] 已写入 |

---

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些实现契约已经足够进入实施计划? | Step 1~16 已经形成模块、对象、port、protocol、flow、state、persistence、error、idempotency、config、observability 和 test cut 的详细设计输入。它们足以作为 `07-实施计划.md` 的引用源,但正式移交实现前仍必须等 Step 19 装配正式 `03`,并由 `07` 按 phase / commit boundary 做整体可落码闭环审计。 |
| 实施者需要先阅读哪些文档? | 必须阅读 L1-artifact `00/01/02`、Step 1~19 校准链、Step 19 后的正式 `03`、后续正式 `04/05/06/07`、Rust 编码规范、目录组织规范、实施计划规范、项目 README 提交规范和可落码性标准。 |
| 提交规范、git config 用户、Rust 编码规范和注释规范是否列入前置阅读? | 已列入。实现仓必须使用项目级 `git config user.name=quantalithos-labs` 和 `git config user.email=quantalithos.ai@gmail.com`;实现仓 commit message 使用英文,标题 `type(scope): subject`;源码标识符、rustdoc、普通注释和测试名默认英文;AI footer 前必须有真实空行。 |
| 每个 Domain 必填字段是否能回指 DTO、event、派生规则、查表规则或系统生成规则? | 预复核通过。Step 6 字段来源可以回指 Step 8 DTO / Event / Job、Step 9 flow、Step 7 repository / resolver / id generator / clock 或 Step 11 查表 / cursor 规则。正式 `03` 装配时仍需逐章复核,发现断裂必须回写 Step 6 / 7 / 8 / 9。 |
| 每个 Command / Event / Job 是否能构造目标对象,或明确缺失处理? | 预复核通过。Command、Query、Inbound Consumer、Outbound Event 和 Operations Job 均有目标对象、port 或 marker / report surface。缺失处理必须按 reject、delayed、dead-letter、quarantine、failed marker、partial report 或 no-write surface 执行。 |
| 每个 Query 的 response view / page / marker、read model / projection / cursor id/ref 是否闭合? | 预复核通过。Query 使用正式 response / page / visibility / freshness / degraded surface。Query 不得 reserve idempotency、append trace / relay、refresh reference、rebuild projection 或修 core truth。 |
| 状态枚举、状态图、测试切口、验收口径是否使用同一套正式状态名? | Step 6 / 10 / 16 内部口径一致。后续正式 `05`、`06` 和 `07` 生成时必须引用 Step 10 正式状态名,不得继承旧 `03` 或旧测试方案中的口语状态。 |
| 当前 phase / commit boundary 是否误用了后续 phase 才定义的对象、结果或证据? | 本 Step 不定义 phase / commit boundary,因此只做预复核。正式 `07` 必须按每个 phase / commit boundary 复核正式 `03/05/06/07`,并从可落码性标准 §九选择适用经验项给出通过 / 不适用 / blocker 结论。 |
| 哪些字段、状态、函数、用例或证据仍有旧名、口语名或别名漂移? | 已识别旧版 `ArtifactRequest` / `Exception` / `RiskAcceptance` 教学主线不得进入新版实现。Step 8 内还存在术语数量漂移的历史痕迹,应在 Step 19 装配正式 `03` 时统一为 Step 8 §6.1 的正式总表。 |
| 哪些内容仍待确认,不能进入实施? | 当前正式 `03` 仍是旧草稿 / 诊断输入,正式 `03` 要等 Step 19 装配。`04-配置设计.md` 和 `07-实施计划.md` 尚未生成;`05-测试方案.md`、`06-验收标准.md` 需要按新版 `03` 复核或重写。目标实现仓 `/home/aris/Projects/quantalithos-artifact` 在 Step 3 检查时未发现。 |
| 实施计划应该如何引用本文,而不是重复本文? | `07` 应按 phase / commit boundary 引用正式 `03` 章节和对应 `design-calibration/03_ddd_step_*.md`,把它们转成阅读门禁、提交边界、测试门禁和暂停条件。不得复制 Step 6 字段表、Step 8 DTO 表、Step 9 flow、Step 10 状态矩阵或 Step 16 测试表形成第二真相源。 |
| 本文是否给 `07` 的交付实现前闭环审计提供足够输入? | 是。本文给出真相源表、字段闭环表、DTO / Event / Job 构造闭环表、Query response 闭环表、状态闭环表、phase boundary 预复核表和命名一致性表。正式 `07` 仍必须基于正式 `03/05/06/07` 重做逐 boundary 审计。 |

---

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| 旧 `projects/L1-artifact/03-详细设计.md` | 仍保留旧主线,不能作为新版实现真相源 | 标记为 Step 19 前不得正式移交实现 |
| Step 1~16 | 信息量大,实施者容易跳读 | 本 Step 给出承接清单和阅读清单 |
| `04-配置设计.md` | 当前未发现正式文件 | 标记为后续配置文档任务 |
| `05-测试方案.md` / `06-验收标准.md` | 已存在但可能仍含旧口径 | 标记为需按新版 `03` 复核或重写 |
| `07-实施计划.md` | 当前未发现正式文件 | 标记为后续实施计划任务;不得由本 Step 预写 phase / commit |
| 目标实现仓 | Step 3 检查时 `/home/aris/Projects/quantalithos-artifact` 未发现 | 标记为正式实施前置门禁 |

---

## 7. 设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| Step 17 是否写完整实施计划 | A. 写 phase / commit;B. 只写承接与复核 | 采用 B。phase、任务拆分和 commit boundary 属于 `07` |
| `07` 是否复制详细设计表格 | A. 复制字段 / DTO / 状态表;B. 引用正式 `03` 和校准 Step | 采用 B。避免第二真相源 |
| 当前旧 `03` 是否可直接交给实现 | A. 可作为临时真相源;B. 等 Step 19 正式装配 | 采用 B。旧 `03` 与新版主线冲突 |
| 旧 `05/06` 是否可作为验证真相源 | A. 暂时沿用;B. 按新版 `03` 复核或重写 | 采用 B。避免测试 / 验收旧口径进入实现 |
| 实现仓提交语言 | A. 继承 design 仓中文 commit;B. 实现仓英文 commit | 采用 B。符合实施计划规范和 Step 3 |
| 目标仓不存在是否阻塞 Step 17 | A. 阻塞;B. 作为正式实施前门禁 | 采用 B。设计可继续,实现开工必须确认仓路径 |

---

## 8. 实施承接关系图

```text
+------------------+
| 00-需求文档      |
+--------+---------+
         |
         v
+------------------+
| 01-架构设计      |
+--------+---------+
         |
         v
+------------------+
| 02-概要设计      |
+--------+---------+
         |
         v
+-------------------------------+
| 03 DDD Step 1~19 + 正式 03    |
+--------+----------------------+
         |
         v
+-------------------------------+
| 04 / 05 / 06 / 07 downstream  |
+--------+----------------------+
         |
         v
+-------------------------------+
| /home/aris/Projects/          |
| quantalithos-artifact         |
+-------------------------------+
```

关键说明:

- Step 17 是详细设计向实施计划的承接清单,不是最终实现移交结论。
- 正式实现移交必须等 Step 19 装配正式 `03`,并完成后续正式 `04/05/06/07`。
- `07` 必须按 phase / commit boundary 对正式 `03/05/06/07` 做整体可落码闭环审计。
- 目标实现仓不是当前 `quantalithos-design` 仓。

---

## 9. 实施承接清单

| 承接项 | 已定义位置 | 实施者如何使用 |
|---|---|---|
| 上游输入边界 | Step 1 | 只承接新版 `00/01/02`,旧 `03` 只作诊断 |
| P0 / 非范围 | Step 2 | 不实现相邻仓 truth、正文存储、global identity、archive package body、外部下游导出能力 |
| 编码、runtime、仓库约束 | Step 3 | 确认 Rust 2024、源码英文、git config、提交规范和 `core-contracts` 唯一编译期 sibling 依赖 |
| Workspace 与文件布局 | Step 4 | 在目标实现仓建立 `crates/contracts/domain/application/infra/api/worker/jobs` |
| 模块实现契约 | Step 5 | 按七模块组织职责和 Cargo 依赖方向 |
| 对象实现契约 | Step 6 | 实现 ArtifactFact、ArtifactVersion、ArtifactLineage、ArtifactBaseline、ArtifactIntake、ArtifactReview、ArtifactConsumption、ArtifactTrace、ArtifactRelay、ArtifactHandoff、ArtifactReport 等对象 |
| Trait / Port / Adapter | Step 7 | 在 application 定义 repository / port / UoW,在 infra 实现 adapter / fake / runtime builder |
| API / Command / Query / Event / Job | Step 8 | 实现 public protocol surface 和 shared protocol helper |
| 函数级处理流 | Step 9 | 按 validate -> reserve -> load -> domain -> save truth / marker -> stored result -> commit 顺序实现 |
| 状态机 | Step 10 | 实现正式状态 enum、合法迁移、非法迁移和错误 surface |
| 持久化 / 事务 / 一致性 | Step 11 | 实现 repository key、version、UoW、relay snapshot、projection stale、reference state 和 report consistency |
| 错误模型 / 恢复 | Step 12 | 实现 reject、not visible、degraded、retry、quarantine、dead-letter、failed marker 和 manual intervention |
| 并发 / 幂等 / 重入 | Step 13 | 实现 operation namespace、canonical digest、stored result / report / receipt replay、commit unknown recovery |
| 配置 / 外部依赖 | Step 14 | 实现 runtime config、adapter binding、availability / disabled / degraded surface |
| 可观测性 / 审计 | Step 15 | 实现 structured logs、metrics、audit refs-only、trace span、redaction 和 forbidden body checks |
| 测试切口 | Step 16 | 将最小测试入口映射到后续 `05` 和 `07` 门禁 |

---

## 10. 实施前置阅读矩阵

| 场景 | 必读文档 | 说明 |
|---|---|---|
| 首次开工前 | `00-需求文档.md`;`01-架构设计.md`;`02-概要设计.md` | 确认业务边界、系统边界和实现主轴 |
| 首次开工前 | Step 1~16 校准文档 | 读取字段、port、protocol、flow、state、persistence、error、idempotency、config、observability 和 test cut 的闭口来源 |
| 首次开工前 | `standards/coding/rust.md`;`standards/document/子项目目录与代码文件组织规范.md`;`standards/document/实施计划书写规范.md`;`standards/document/设计真相源闭环与可落码性标准.md` | 确认源码语言、目录、提交、门禁和真相源闭环 |
| 每个 module / crate 开工前 | Step 5;Step 6 | 复核模块职责与对象边界 |
| 每个 API / consumer / job 开工前 | Step 8;Step 9;Step 12 | 复核 protocol、flow 和错误 surface |
| 每个 persistence / idempotency 开工前 | Step 7;Step 11;Step 13 | 复核 repository、transaction、stored result 和 duplicate replay |
| 每个 config / observability 开工前 | Step 14;Step 15 | 复核 runtime 绑定、可观测性和 redaction |
| 每个测试落地前 | Step 16;后续 `05` | 先从 test cut 进入测试方案,再扩展 TC / fixture / CI |
| 正式交付实现前 | 正式 `03/04/05/06/07` | `07` 必须重做逐 boundary 审计后才可移交实现 |

---

## 11. 实施前检查清单

| 检查项 | 要求 | 失败处理 |
|---|---|---|
| 目标实现仓 | `/home/aris/Projects/quantalithos-artifact` 存在或在 PH-01 创建 | 暂停实现并确认目录 |
| git user | `git config user.name` 为 `quantalithos-labs`;`git config user.email` 为 `quantalithos.ai@gmail.com` | 修正项目级 git config 后再提交 |
| commit message | 实现仓英文;标题 `type(scope): subject`;body 按边界和子功能分组;footer 前真实空行 | amend 或重写 message |
| 源码语言 | 标识符、rustdoc、普通注释、测试名默认英文 | 修正后再提交 |
| workspace layout | `crates/contracts/domain/application/infra/api/worker/jobs` | 不得按旧单 crate 或业务 crate 开工 |
| Cargo package / crate | package 默认 `artifact-<role>`;library crate 默认 `artifact_<role>` | 命名偏离则暂停并回写设计或改实现 |
| compile-time dependency | sibling 编译期依赖只允许 `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | 不得引入其他 sibling path dependency |
| 正式详细设计 | Step 19 装配后的正式 `03` 与 calibration Step 一致 | 不一致时回 Step 19 修正文档 |
| 下游文档 | `04/05/06/07` 已按新版 `03` 生成或复核 | 未完成前不得正式移交实现 |
| 交付实现前审计 | `07` 已按 phase / commit boundary 审计正式 `03/05/06/07` | blocker 未关闭不得交给实现 agent |

---

## 12. 跨文档一致性复核

### 12.1 真相源表

| 设计事实 | 真相源文档 | 章节 / 中间产物 | 后续消费者 | 冲突处理 |
|---|---|---|---|---|
| 上游输入和旧文档诊断纪律 | Step 1 / workbench | `03_ddd_step_01*`;`03_ddd_calibration_flow.md` | Step 19 / `07` | 与旧 `03` 冲突时以新版 Step 为准 |
| 实现范围和非范围 | Step 2 | `03_ddd_step_02_scope.md` | `07` / `05` / `06` | 不得由实现者扩大 P0 |
| Rust / repo / dependency | Step 3 / 4 / 14 | constraints、layout、config binding | target repo / Cargo / runtime config | 冲突时暂停确认仓路径和依赖 |
| 模块职责和依赖方向 | Step 5 | module contracts | Cargo workspace | Cargo 依赖不得反向 |
| Domain 对象和字段 | Step 6 | object contracts | domain / application / tests | 字段缺失回 Step 6,不得代码补字段 |
| Trait / port / adapter | Step 7 | trait / port / adapter contracts | application / infra | adapter 不得改写 application trait |
| Public protocol | Step 8 | protocol contracts | contracts / api / worker / jobs | DTO 与 flow 冲突时回 Step 8 / 9 |
| Function flow | Step 9 | function flows | application services | 不得自行调整 UoW / idempotency 顺序 |
| State matrix | Step 10 | state matrix | domain / tests / acceptance | 状态冲突回 Step 10 |
| Persistence / error / idempotency | Step 11~13 | persistence、error、idempotency | application / infra / tests | 保持 no-write / rollback / duplicate replay |
| Config / observability / tests | Step 14~16 | config、observability、test cuts | infra / scripts / tests | 细节不足进入后续 `04/05/07`,不得脑补 |

### 12.2 字段闭环表

| Domain 对象 | 字段 | 类型 | 字段来源 | 构造入口 | DTO / Event 字段 | 缺失处理 | 测试覆盖 | 验收证据 |
|---|---|---|---|---|---|---|---|---|
| `ArtifactFact` | `artifact_ref` / `fact_ref` | typed refs | `IdGeneratorPort` + request body | `ArtifactFact::establish(...)` | request / event / report | generator failure -> reject / rollback | `EstablishArtifactFact_contract` | 后续 `06` |
| `ArtifactVersion` | `version_ref` / `fact_ref` / `state` | typed refs + enum | id generator + current fact | `ArtifactVersion::create(...)` / `publish(...)` | request / event / query view | missing source -> reject;invalid state -> conflict | version command tests | 后续 `06` |
| `ArtifactBaseline` | `baseline_ref` / `scope_ref` / `membership_refs` | typed refs | command body + repository lookup | `ArtifactBaseline::freeze(...)` | request / query view | membership unresolved -> reject | baseline tests | 后续 `06` |
| `ArtifactReviewAnchor` | `anchor_ref` / `responsibility_ref` | typed refs | command body + identity snapshot | review factory | request / query view | responsibility unavailable -> reject / degraded | review tests | 后续 `06` |
| `ArtifactConsumptionBackref` | `consumable_ref` / `consumer_ref` / `trace_ref` | typed refs | request body + accepted trace | backref factory | request / outbound audit | missing trace -> reject | consumption tests | 后续 `06` |
| `ArtifactTraceRecord` / `ArtifactRelayRecord` | trace / relay / event / cursor refs | typed refs | committed truth change + metadata + id generator | `from_truth_change(...)` | command metadata / outbound event / job report | invalid mapping -> rollback or failed marker | trace / relay tests | 后续 `06` |

### 12.3 DTO / Event / Job 到 Domain 对象构造闭环表

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 | 关联处理流 |
|---|---|---|---|---|---|---|
| Command request | core Artifact truth、history、trace、relay、stored command result | 是 | id generator、clock、repository lookup、resolver、policy guard | command idempotency key != business object id | reject / not found / conflict / rollback | Step 9 Command flows |
| Query request | view / page / marker response | 是 | truth repository、projection repository、trace repository、report repository | query cursor != optimistic version | missing / empty / not visible / degraded / failed | Step 9 Query flows |
| Inbound Event envelope | snapshot、reference state、receipt、stale marker | 是 if envelope valid | source event metadata、schema version、dedup key、resolver | source event ref != local relay id | duplicate / unsupported / delayed / rejected / dead-letter | Step 9 Consumer flows |
| Outbound Event | `ArtifactOutboundEventEnvelope<T>` and stored payload snapshot | 是 | committed truth change、trace context、visibility marker、relay snapshot builder | outbound event id != truth object id | mark failed / retry | Step 9 Outbound publish flow |
| Operations Job | report、projection、reference snapshot、handoff / export marker | 是 | job metadata、repository page、adapter result、stored job report | job run id != job idempotency key | invalid input / partial failure / stored replay | Step 9 Job flows |

### 12.4 Query response / view 闭环表

| Query | Response DTO / View | 字段来源 | empty / not visible / degraded 口径 | public id/ref 规则 | 测试覆盖 |
|---|---|---|---|---|---|
| `GetArtifactFact` | `ArtifactQueryResponse<ArtifactFactView>` | fact truth + reference state | missing / not visible / degraded fact reference | fact ref from request | `GetArtifactFact_query` |
| `GetArtifactVersion` | `ArtifactQueryResponse<ArtifactVersionView>` | version truth + freshness state | missing / not visible / degraded version reference | version ref from request | `GetArtifactVersion_query` |
| `ListArtifactVersionsByFact` | `ArtifactPageResponse<ArtifactVersionView>` | version projection | empty page / stale / failed / visibility filtered | page cursor opaque | `ListArtifactVersionsByFact_query` |
| `GetArtifactBaseline` | `ArtifactQueryResponse<ArtifactBaselineView>` | baseline truth + membership state | missing / not visible / degraded baseline | baseline ref from request | `GetArtifactBaseline_query` |
| `GetArtifactReviewSummary` | `ArtifactQueryResponse<ArtifactReviewSummaryView>` | review truth + responsibility state | missing / pending / not visible | review ref from request | `GetArtifactReviewSummary_query` |
| `GetArtifactReadSurface` | `ArtifactQueryResponse<ArtifactReadSurfaceView>` | selector branch + visibility state | invalid selector / degraded / not visible | read surface ref from request | `GetArtifactReadSurface_query` |
| `GetArtifactTrace` | `ArtifactPageResponse<ArtifactTraceRecordView>` | trace repository | empty page / redacted / not visible | trace cursor opaque | `GetArtifactTrace_query` |
| `GetArtifactReport` | `ArtifactQueryResponse<ArtifactReportView>` | report repository | missing report / failed / stale | report ref from request | `GetArtifactReport_query` |
| `GetExternalReferenceResolution` | `ArtifactQueryResponse<ArtifactExternalReferenceResolutionView>` | reference state repository | missing / degraded / unsupported selector | resolution ref from request | `GetExternalReferenceResolution_query` |

### 12.5 状态闭环表

| 状态集合 | 正式来源 | 实现入口 | 测试入口 | 结论 |
|---|---|---|---|---|
| fact / version / baseline / review states | Step 6 / Step 10 | domain transition methods and command flows | Step 16 command / state tests | 预复核通过 |
| intake / submission / resolution states | Step 6 / Step 10 | intake / resolver domain methods | intake / reference tests | 预复核通过 |
| consumption / backref / trace states | Step 6 / Step 10 | consumption domain methods | consumption tests | 预复核通过 |
| projection / reference / relay / job / handoff states | Step 6 / Step 10 / Step 11~13 | repository / job / worker flows | operations job and infra tests | 预复核通过 |

### 12.6 Phase / commit boundary 闭环表

| Phase / commit boundary | 包含内容 | 明确排除 | 依赖前置 | 不得依赖后续 | 测试范围 | 验收范围 |
|---|---|---|---|---|---|---|
| 待 `07` 定义 | 由正式 `07` 根据正式 `03/05/06` 拆分 | 不在 Step 17 预写 | Step 19 正式 `03`;新版 `04/05/06` | 不得调用后续 boundary 才定义的 DTO、port、state、result、report、evidence | 每个 boundary 由 `07` 指定 | 每个 boundary 由 `07` 映射 |

正式 `07` 的每个 boundary 必须补充:

- 字段 / DTO / 状态 / phase boundary 开工前复核。
- `设计真相源闭环与可落码性标准.md` §九的适用经验复核表。
- 通过 / 不适用 / blocker 结论。
- blocker 修复后的 design baseline。

### 12.7 Public protocol 传递类型闭环表

| 协议 surface | 外层 DTO | 传递类型 | 正式归属 | schema / variant 定义位置 | 缺失 / duplicate / retry 口径 | 依赖边界 |
|---|---|---|---|---|---|---|
| Command | `ArtifactCommandRequest<T>` / response | command name、metadata、effect summary、result ref | `contracts` / `core-contracts` | Step 8 | reject / stored result replay | no domain dependency in contracts |
| Query | `ArtifactQueryRequest<T>` / response / page | visibility、freshness、degraded、page info | `contracts` | Step 8 | not visible / empty / degraded / failed | query no-write |
| Inbound Event | `ArtifactInboundEventEnvelope<T>` / receipt | event version、dedup key、source ref、consumer name | `contracts` / `core-contracts` | Step 8 | duplicate / unsupported / delayed / dead-letter | no source body |
| Outbound Event | `ArtifactOutboundEventEnvelope<T>` / payload snapshot | event kind、topic key、schema version、payload | `contracts` | Step 8 / Step 11 | mark failed / retry | publisher reads stored snapshot |
| Job | `ArtifactJobRequest<T>` / response / report | job metadata、run disposition、report refs | `contracts` | Step 8 / Step 13 | stored report replay / partial failure | job no truth repair |

### 12.8 命名一致性表

| 名称类型 | 正式名称 | 禁用旧名 / 口语名 | 出现位置 | 修正要求 |
|---|---|---|---|---|
| 旧主线对象 | `ArtifactFact` / `ArtifactVersion` / `ArtifactBaseline` / `ArtifactReviewAnchor` / `ArtifactConsumptionBackref` | `ArtifactRequest` / `Exception` / `RiskAcceptance` 教学主线 | 旧 `03` | Step 19 正式 `03` 不继承旧对象主轴 |
| 实现仓名 | `quantalithos-artifact` | `L1-artifact` 作为代码仓名 | Step 3 / projects README | 实现仓、package、crate、module 不带 `L1` |
| Cargo package | `artifact-<role>` | `l1-artifact-*` / 业务混合 crate | Step 4 / 5 | `07` 和实现仓按 role crate 命名 |
| Rust crate | `artifact_<role>` | `artifact-request` / old request names | Step 4 / 5 | `contracts/domain/application/infra/api/worker/jobs` 统一 |
| Query surface | `ArtifactQueryResponse<T>` / `ArtifactPageResponse<T>` | 普通错误代替 not visible / degraded | Step 8 / 9 | not visible 走 visibility marker,不是普通 error |

### 12.9 冲突与修正表

| 冲突 ID | 冲突位置 | 冲突类型 | 影响范围 | 推荐修正 | 处理状态 |
|---|---|---|---|---|---|
| ART-DDD-17-001 | 当前旧 `03-详细设计.md` 与 Step 1~16 | 旧文档主线残留 | 正式实现真相源 | Step 19 用 Step 1~17 装配正式 `03`,不得修补旧草稿 | 待 Step 19 |
| ART-DDD-17-002 | `04-配置设计.md` 缺失 | 下游文档缺口 | config / adapter binding 实施 | 后续按 Step 14 生成正式 `04` | 待后续 SOP |
| ART-DDD-17-003 | `05-测试方案.md` / `06-验收标准.md` 可能旧口径 | 验证文档漂移 | 测试和验收门禁 | 后续按新版 `03` 复核或重写 | 待后续 SOP |
| ART-DDD-17-004 | `07-实施计划.md` 缺失 | 实施计划缺口 | phase / commit boundary | 后续按实施计划 SOP 生成,并做逐 boundary 审计 | 待后续 SOP |
| ART-DDD-17-005 | 目标实现仓 | Step 3 检查时未发现 | 实现路径、Cargo workspace 和 git config | `07` PH-01 前置门禁补确认 | 待实现前置检查 |

---

## 13. 正反例

### 13.1 正确示例

```md
| 承接项 | 已定义位置 | 实施者如何使用 |
|---|---|---|
| Outbound Event payload snapshot | Step 8 / Step 11 | commit boundary 中引用对应章节,实现 relay record 保存 stored snapshot;publisher 只读取 stored snapshot |
```

正确原因:

- 只引用详细设计真相源,不在实施计划重写 payload schema。
- 明确实现者该做什么,也明确 publisher 不得从 current truth 重算。
- 可被 `07` 拆成具体 commit boundary 后继续复核。

### 13.2 错误示例

```md
commit-xx: implement all artifact events.

开发时如果缺字段,先从 current truth 查出来拼 payload。
```

错误原因:

- 没有引用 Step 8 / Step 11 的正式 schema 和 persistence 规则。
- 把多个未审计的事件合成一团,没有 phase / commit boundary 闭环。
- 允许实现者自行补字段,违反可落码性标准。

### 13.3 Query 正确示例

```md
| Query | Response DTO / View | 字段来源 | empty / not visible / degraded 口径 |
|---|---|---|---|
| GetArtifactFact | ArtifactQueryResponse<ArtifactFactView> | fact truth + reference state | missing / not visible / degraded reference |
```

正确原因:

- response view、字段来源和异常 surface 同时闭合。
- not visible 通过 marker 表达,不是普通 error。
- Query read path 不包含 repair / rebuild / refresh。

### 13.4 Phase boundary 错误示例

```md
commit-03-a: implement command handlers and assert final acceptance evidence.
```

错误原因:

- acceptance evidence 属于后续测试 / 验收和具体 commit boundary 门禁,不能在未定义 `05/06/07` 时预写。
- 当前 Step 17 不定义 commit boundary。
- 这会迫使实现者依赖后续文档尚未闭合的 evidence。

---

## 14. 未进入实施的待确认项

| 项 | 当前状态 | 不得交给实现者自行处理的原因 | 后续处理 |
|---|---|---|---|
| 正式 `03-详细设计.md` | 当前仍是旧草稿 / 诊断输入 | 旧主线与新版 Step 冲突 | Step 19 装配正式 `03` |
| `04-配置设计.md` | 当前未发现正式文件 | config key、runtime profile、adapter binding 不能由代码补 | 后续按配置设计 SOP 生成 |
| `05-测试方案.md` | 已存在但需复核新版口径 | 测试用例、suite、artifact root 和 evidence 需与 Step 16 对齐 | 后续按测试方案 SOP 复核 / 重写 |
| `06-验收标准.md` | 已存在但需复核新版口径 | acceptance gate / veto 不能继承旧对象状态 | 后续按验收标准 SOP 复核 / 重写 |
| `07-实施计划.md` | 当前未发现正式文件 | phase / commit boundary 和经验复核必须由设计者先完成 | 后续按实施计划 SOP 生成 |
| 目标实现仓 | Step 3 检查时未发现 | 实现路径、Cargo workspace 和 git config 需要开工前确认 | `07` PH-01 前置门禁 |

---

## 15. 回填草稿

> 校准来源:
> - `projects/L1-governance/design-calibration/03_ddd_step_17_implementation_handoff.md`

### 16. 详细设计到实施计划的承接清单

正式实施计划必须以本详细设计为直接输入,并引用对应 `design-calibration/03_ddd_step_*.md` 作为字段级、flow 级、状态级和测试切口的追溯来源。实施计划不得复制对象字段表、DTO 表、状态矩阵或函数 flow 形成第二真相源。

实施者开始编码前必须完成以下前置阅读和检查:

- 阅读 L1-artifact `00/01/02/03` 和对应详细设计校准 Step。
- 阅读 `standards/coding/rust.md`、目录组织规范、实施计划书写规范、实施计划 SOP、可落码性标准和 `projects/README.md` 提交规范。
- 确认目标实现仓 `/home/aris/Projects/quantalithos-artifact`、Rust workspace、`core-contracts` path dependency、git config、英文 commit message、英文源码注释和测试名。
- 等正式 `04/05/06/07` 完成并由 `07` 按 phase / commit boundary 对正式 `03/05/06/07` 做交付实现前闭环审计。

---

## 16. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 实施承接清单明确 | 通过 | Step 1~16 的承接项和使用方式已列出 |
| 实施前置阅读清单明确 | 通过 | 设计文档、规范、提交规范、Rust 规范和目录规范已列出 |
| 字段 / DTO / Query / 状态预复核完成 | 通过 | 已按中间产物规范 §5.10 输出复核表 |
| phase / commit boundary 边界未越权 | 通过 | 本 Step 不写 phase / commit,明确留给 `07` |
| 未进入实施事项明确 | 通过 | 正式 `03/04/05/06/07` 和目标实现仓门禁已列出 |
| 可进入 Step 18 | 通过 | Step 18 继续整理风险与待确认事项 |
