# Step 17. 收口详细设计到实施计划的承接清单

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 17
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md` §5.10
> 回填章节: `03-详细设计.md` §16 详细设计到实施计划的承接清单
> 生成日期: 2026-07-09
> 状态: completed_wait_user_review
> 所属流程: `03_ddd_calibration_flow.md`
> 本 Step 口径: 本步只把 Step 1~16 已收敛的详细设计契约整理成未来 `07-实施计划.md` 可承接的输入,并做字段、DTO / Event / Job、Query view、状态、命名和 phase / commit boundary 预复核。本步不写正式 `03-详细设计.md`,不创建 Step 18 文件,不写开发排期、任务拆分、实施 phase、commit boundary、implementation ledger、planned boundary skeleton、真实 evidence alias、run_id、测试结果、验收签署或实现仓代码。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 17 | 是。Step 16 审查点后用户已回复“同意”,允许进入 Step 17。 |
| 项目级台账是否允许进入 Step 17 | 是。原恢复点为 Step 16 `pass_wait_review`;用户确认后可进入本步。 |
| 文档级 flow 是否允许进入 Step 17 | 是。`03_ddd_calibration_flow.md` 原记录 Step 17 需等待 Step 16 审查通过,用户确认后门禁满足。 |
| 是否已读取 Step 17 SOP | 是。本步必须输出实施承接清单、实施前置阅读清单、字段 / DTO / 状态 / phase boundary 复核表、命名一致性复核表和未进入实施的待确认项。 |
| 是否已读取详细设计书写规范 §5.16 | 是。本章不得写具体排期或开发任务拆分,必须说明 `07` 如何引用本文而不是重复本文。 |
| 是否已读取中间产物规范 §5.10 | 是。本步进入详细设计收口阶段,必须生成跨文档一致性复核类中间产物。 |
| 是否已读取实施相关规范 | 是。已读取 `实施计划书写规范.md`、`代码实施台账与门禁规范.md`、`子项目目录与代码文件组织规范.md`、`standards/coding/rust.md` 和提交规范相关段落。 |
| git config 是否已确认 | 是。当前设计仓 `user.name=quantalithos-labs`,`user.email=quantalithos.ai@gmail.com`;实现仓正式提交前仍需在目标仓本地复核。 |
| 是否发现阻塞 Step 17 的上游 blocker | 未发现阻塞本步生成的 blocker。目标实现仓未发现、正式 `04/07` 缺失、旧 `05/06` 待重建均是 downstream / implementation precheck,不阻塞本步。 |

---

## 2. 本步目标

本 Step 把 `03` Step 1~16 已形成的详细设计契约整理为 `07-实施计划.md` 的输入索引,让后续实施计划可以按正式 `03/04/05/06/07` 和 phase / commit boundary 做整体可落码闭环审计。

本步必须回答:

- 哪些实现契约已经足够进入实施计划。
- 实施者开始编码前必须阅读哪些正式文档、校准中间产物和规范。
- 提交规范、git config 用户、Rust 编码规范、注释规范是否进入前置阅读。
- 字段、DTO / Event / Job、Query response / page / marker、状态枚举、状态图、测试切口、验收口径和命名是否闭合。
- 当前是否存在旧名、口语名、历史材料或下游文档缺口会污染实现。
- `07` 应如何引用详细设计,而不是复制详细设计形成第二真相源。
- 本文是否给 `07` 按 phase / commit boundary 审计正式 `03/05/06/07` 提供足够输入。

本步不定义:

- `07` 的 phase、commit boundary、任务拆分、排期、owner、实施台账、planned boundary skeleton 或提交顺序。
- `05` 的测试用例编号、fixture、CI job、覆盖率目标、测试报告、真实 evidence alias 或 run_id。
- `06` 的验收签署、真实验收证据、验收通过结论或 veto 签署。
- 目标实现仓中的 Cargo 文件、Rust 源码、脚本、reports 目录或实现提交。

---

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `03_ddd_step_01_upstream_boundary.md` | 已完成 | 固定正式 `00/01/02` 是当前 `03` 上游;旧 `README/03/05/06` 只作 historical material。 |
| `03_ddd_step_02_scope.md` | 已完成 | 固定 sandbox 范围和非范围,防止 `07` 把 tools semantic execution、runtime agent loop、member lifecycle、artifact truth、observability store 或 policy truth 混入。 |
| `03_ddd_step_03_constraints.md` | 已完成 | 固定 Rust、源码英文、提交规范、目标仓前置检查和 `core-contracts` 唯一编译期 sibling 依赖。 |
| `03_ddd_step_04_file_layout.md` | 已完成 | 固定目标实现仓 planned path、workspace 多 crate、package / crate / binary 命名和 planned 文件树。 |
| `03_ddd_step_05_module_contracts.md` | 已完成 | 固定 `contracts/domain/application/infra/api/worker/jobs` 七个实现模块和依赖方向。 |
| `03_ddd_step_06_object_contracts.md` | 已完成 | 固定 execution context、environment identity、boundary、policy、run、capture、handoff、failure、cleanup、redline、projection、relay、audit、idempotency、adapter outcome、entry shell 和 job report 对象契约。 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 固定 service facade、repository、UoW、resolver、backend、handoff、publisher、idempotency、stored result、runtime builder 和 fake parity。 |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 固定 10 Command、13 Query、9 Inbound Consumer、13 Outbound Event、10 Operations Job 的 public protocol surface。 |
| `03_ddd_step_09_function_flows.md` | 已完成 | 固定 55 个 flow、事务顺序、side effect、query no-write、consumer receipt、relay / handoff no-rollback 和 job no-repair。 |
| `03_ddd_step_10_state_matrix.md` | 已完成 | 固定 8 个状态族、29 个状态机批次、正式状态名、合法 / 禁止迁移和非法迁移处理。 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已完成 | 固定 logical store、repository 语义、`Versioned<T>`、UoW、cursor、rollback、projection、relay 和 stored replay。 |
| `03_ddd_step_12_error_recovery.md` | 已完成 | 固定错误 taxonomy、public surface、dead-letter、quarantine、degraded、no-write / no-repair violation 和恢复 / 不恢复口径。 |
| `03_ddd_step_13_concurrency_idempotency.md` | 已完成 | 固定 idempotency key / digest、duplicate replay、stored result / receipt / report、commit unknown、expected version 和 race guard。 |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | 固定 config owner、runtime builder、adapter binding、外部依赖、inbound / outbound binding 和禁止配置化边界。 |
| `03_ddd_step_15_observability_audit.md` | 已完成 | 固定 log、metric、audit trace、relay / handoff marker、job report、diagnostic issue 和 redaction。 |
| `03_ddd_step_16_test_cuts.md` | 已完成 | 固定模块、接口、状态机、一致性 / 幂等 / 并发、错误 / 配置 / 观测测试切口和脚本契约候选。 |
| `standards/document/实施计划书写规范.md` | 已读取 | 固定本步与 `07` 的边界,以及 commit message、校准来源、提交自检和实施计划写法。 |
| `standards/document/代码实施台账与门禁规范.md` | 已读取 | 固定 implementation ledger 和 planned boundary skeleton 只能在正式 `07` 完成时创建。 |
| `standards/coding/rust.md` | 已读取 | 固定源码标识符、rustdoc、普通注释、测试名默认英文。 |
| `standards/document/子项目目录与代码文件组织规范.md` | 已读取 | 固定实现仓路径、workspace member、package、crate、binary、scripts / reports 目录规则。 |
| `projects/README.md` §1.1 / 提交规范相关段落 | 已承接 | 固定 design 仓与实现仓目录和提交语言边界。 |
| `projects/L1-governance/design-calibration/03_ddd_step_17_implementation_handoff.md` | 已读取 | 作为 Step 17 粒度参考;不继承治理项目语义。 |
| `projects/L1-artifact/design-calibration/03_ddd_step_17_implementation_handoff.md` | 已读取 | 作为 Step 17 粒度参考;不继承制品项目语义。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 恢复项目级台账、文档级 flow 和 Step 16 当前文件。 | done | 确认用户已允许进入 Step 17。 |
| 2 | 读取 Step 17 SOP、详细设计 §5.16、实施计划规范、代码实施台账规范、Rust 规范和中间产物 §5.10。 | done | 明确本步输出和不得提前写 `07` 的边界。 |
| 3 | 从 Step 1~16 提取 implementation handoff 候选。 | done | 形成对象、协议、flow、状态、持久化、配置、观测、测试输入池。 |
| 4 | 输出实施承接清单、前置阅读清单和实施前检查清单。 | done | `07` 可引用,但不形成 phase / commit boundary。 |
| 5 | 输出跨文档一致性复核、字段闭环、DTO / Event / Job 闭环、Query view 闭环、状态闭环、命名一致性和冲突表。 | done | 满足中间产物规范 §5.10。 |
| 6 | 输出 historical material / blocker、回填草稿、未进入实施的待确认项、自检和进入下一步条件。 | done | 当前恢复点停在 Step 17 审查点,不跨到 Step 18。 |

---

## 5. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| 哪些实现契约已经足够进入实施计划 | Step 1~16 已形成上游边界、范围、工程约束、workspace 布局、模块、对象、port / adapter、public protocol、55 个 flow、状态矩阵、持久化 / 事务、错误恢复、并发 / 幂等、配置 / 外部依赖、可观测 / 审计和最小测试切口。它们足以作为 `07` 的引用输入,但正式实现移交必须等 Step 19 装配正式 `03`,并完成后续 `04/05/06/07`。 |
| 实施者需要先阅读哪些文档 | 必须阅读正式 `00/01/02`,Step 1~19 校准链,Step 19 后的正式 `03`,后续正式 `04/05/06/07`,Rust 编码规范、目录组织规范、实施计划规范、代码实施台账规范、提交规范和可落码性标准。 |
| 提交规范、git config 用户、Rust 编码规范和注释规范是否已经列入前置阅读 | 已列入。目标实现仓正式提交前必须复核 `git config user.name=quantalithos-labs` 和 `git config user.email=quantalithos.ai@gmail.com`;实现仓 commit message 使用英文,标题格式 `type(scope): subject`;源码标识符、module、type、function、variable、rustdoc、普通注释和测试名默认英文。 |
| 每个 Domain 必填字段是否能回指 DTO、event、派生规则、查表规则或系统生成规则 | 预复核通过。Step 6 字段来源可回指 Step 8 DTO / Event / Job、Step 9 flow、Step 7 repository / resolver / port、Step 11 lookup / cursor / version、Step 14 config summary 或系统 clock / id generator。正式 `03` 装配时仍需逐章校验,发现断裂必须回写对应 Step,不得交给实现者自补字段。 |
| 每个 Command / Event / Job 是否能构造目标对象,或明确缺失处理 | 预复核通过。10 Command、9 Inbound Consumer、13 Outbound Event、10 Operations Job 均能映射到 Step 6 对象、Step 7 callable surface 和 Step 9 flow。缺失处理必须使用 reject、fail-closed、delayed、quarantined、dead-letter、retryable、failed marker、partial report、degraded surface 或 stored replay,不得静默成功。 |
| 每个 Query 的 response view / page / marker、read model / projection / cursor id/ref 是否已经闭合 | 预复核通过。13 Query 均使用 `SandboxQueryResponseDto<T>`、page info、projection marker、visibility marker、freshness / degraded surface。Query 不得 reserve idempotency、begin write UoW、append audit / relay、refresh reference、rebuild projection、retry handoff、cleanup release 或修复 core truth。 |
| 状态枚举、状态图、测试切口、验收口径是否使用同一套正式状态名 | Step 6、Step 10、Step 16 内部口径一致。后续 `05/06/07` 必须引用 Step 10 正式状态名,不得继承旧 `README/03/05/06` 中的旧状态词、旧单线 lifecycle 或口语化 success / failed。 |
| 当前 phase / commit boundary 是否误用了后续 phase 才定义的对象、结果或证据 | 本步不定义 phase / commit boundary,只做预复核。当前 Step 1~16 未把后续 `05/06/07` 才能产生的测试结果、验收 evidence alias、implementation ledger 或 commit boundary 写成已存在事实。未来 `07` 必须逐 boundary 复核正式 `03/05/06/07`,不得引用未来 boundary 才会创建的对象、结果或证据作为当前 boundary 前置已满足。 |
| 哪些字段、状态、函数、用例或证据仍有旧名、口语名或别名漂移 | 已识别旧 `SandboxExecution/Session/Command/Policy/Output` 五段主线、provider bridge、Docker/gVisor 硬选型、artifact / observability body、旧测试 / 验收口径不得进入新版实现。当前 Step 8 协议数量为 10 Command、13 Query、9 Consumer、13 Outbound、10 Job,后续正式装配必须沿用该数量,不得被旧文档或摘要漂移。 |
| 哪些内容仍待确认,不能进入实施 | 正式 `03` 尚未装配,Step 18 风险和 Step 19 formal assembly 未完成;正式 `04` 缺失;旧 `05/06` 尚未按新版 `03` 重建;正式 `07` 缺失;目标实现仓 `/home/aris/Projects/quantalithos-sandbox` 当前未发现;backend 产品组合、transport route、store / secret / OTel / scheduler 等 raw config 细节仍归 `04/07/ADR`。 |
| 实施计划应该如何引用本文,而不是重复本文 | `07` 应按 phase / commit boundary 引用正式 `03` 章节和对应 `design-calibration/03_ddd_step_*.md`,把它们转成阅读门禁、允许范围、禁止范围、测试门禁、blocker 回流和提交自检。`07` 不应复制 Step 6 字段表、Step 8 DTO 表、Step 9 flow、Step 10 状态矩阵或 Step 16 测试切口形成第二真相源。 |
| 本文是否给 07 按 phase / commit boundary 执行交付实现前闭环审计提供了足够对象、协议、flow、状态、持久化、测试切口和验收映射输入 | 是。本文给出真相源表、字段闭环、DTO / Event / Job 构造闭环、Query response 闭环、状态闭环、phase / commit boundary 预复核、public protocol 传递类型闭环、命名一致性和冲突表。正式 `07` 仍必须在正式 `03/05/06/07` 完成后逐 boundary 重做闭环审计。 |

---

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| 旧 `projects/L4-sandbox/03-详细设计.md` | 旧五段主线、旧对象、旧目录、provider bridge、Docker/gVisor、artifact / observability 混层仍可能污染实现。 | 继续登记为 historical material。Step 19 前不得按旧 `03` 开工。 |
| Step 1~16 | 信息量大,实现者若跳读会遗漏 UoW、cursor、stored replay、no-write、no-rollback、redaction 等硬边界。 | 本步输出承接清单、阅读矩阵和前置检查,供 `07` 转为边界门禁。 |
| 正式 `04-配置设计.md` | 当前缺失。 | 登记为 downstream gap。后续 `04` 必须承接 Step 14 config owner、raw schema、profile、defaults、source priority、secret、validation 和 binding。 |
| 旧 `05-测试方案.md` / `06-验收标准.md` | 旧口径可能不匹配新版 Step 5~16。 | 登记为 historical material / downstream rebuild。后续 `05/06` 必须按新版 `03` 重建或复核。 |
| 正式 `07-实施计划.md` | 当前缺失。 | 登记为 downstream gap。完成 `07` 时才创建 implementation ledger 和 planned boundary skeleton。 |
| 目标实现仓 | `/home/aris/Projects/quantalithos-sandbox` 当前未发现。 | 不阻塞 Step 17;列为正式实施前置检查,不得伪造成已存在。 |

---

## 7. 设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| Step 17 是否写完整实施计划 | A. 写 phase / commit / 排期;B. 只写承接和闭环预复核 | 采用 B。phase、commit boundary、owner、实施台账和 planned skeleton 属于正式 `07`。 |
| `07` 是否复制详细设计表格 | A. 复制字段 / DTO / flow / 状态表;B. 引用正式 `03` 和中间产物 | 采用 B。避免第二真相源和实现侧选边。 |
| 目标实现仓不存在是否阻塞本步 | A. 阻塞 Step 17;B. 作为实施前置检查 | 采用 B。设计承接可以完成,正式落码前必须确认或创建目标仓。 |
| 旧 `05/06` 是否可以沿用 | A. 暂时沿用;B. 按新版 `03` 重建 / 复核 | 采用 B。旧测试 / 验收不可作为新版 evidence truth。 |
| backend 产品是否在本步定型 | A. 定 Docker/gVisor/Firecracker/k8s;B. 只保留 abstract backend adapter 与 no weak fallback | 采用 B。产品选择归 `04/07/ADR`,sandbox 详细设计只固定语义边界。 |
| implementation ledger 是否现在创建 | A. Step 17 创建;B. 完成正式 `07` 时创建 | 采用 B。符合代码实施台账规范,避免伪授权实现。 |

---

## 8. 实施承接关系图

```text
------------------+
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
+----------------------------------------+
| 03 DDD Step 1~19 + 正式 03             |
| objects / ports / protocols / flows    |
| states / UoW / config / observability  |
+--------+-------------------------------+
         |
         v
+----------------------------------------+
| 04 / 05 / 06 / 07 downstream           |
| config / tests / acceptance / plan     |
+--------+-------------------------------+
         |
         v
+----------------------------------------+
| /home/aris/Projects/quantalithos-sandbox |
| target implementation repo              |
+----------------------------------------+
```

关键说明:

- Step 17 是详细设计到实施计划的承接清单,不是最终实现移交通过结论。
- 正式实现移交必须等待 Step 19 装配正式 `03`,并完成后续正式 `04/05/06/07`。
- `07` 必须按 phase / commit boundary 对正式 `03/05/06/07` 执行整体可落码闭环审计。
- 目标实现仓不是当前 `quantalithos-design` 仓,且当前未发现,不得伪造成已创建。

---

## 9. 实施承接清单

| 承接项 | 已定义位置 | 实施者如何使用 |
|---|---|---|
| 上游输入边界 | Step 1 | 只承接新版正式 `00/01/02`;旧 `README/03/05/06` 只作 historical material。 |
| 范围与非范围 | Step 2 | 实现 execution isolation truth;不得实现 tools semantic execution、runtime agent loop、member lifecycle、artifact truth、observability store、policy definition / approval truth。 |
| 编码 / runtime / 仓库约束 | Step 3 | 确认 Rust、源码英文、git config、提交规范、`core-contracts` 唯一编译期 sibling 依赖和目标仓前置检查。 |
| Workspace 与文件布局 | Step 4 | 在目标实现仓按 `crates/contracts/domain/application/infra/api/worker/jobs` 建立 Rust workspace planned layout。 |
| 模块实现契约 | Step 5 | 按七模块组织职责和 Cargo 依赖方向,不得按旧五段对象或六个业务组成部分拆 crate。 |
| 对象实现契约 | Step 6 | 实现 context、identity、boundary、policy、run、capture、handoff、failure、control、lease、cleanup、redline、reference、projection、derived、relay、audit、idempotency、adapter outcome、entry shell、job report 对象和 carrier。 |
| Trait / Port / Adapter | Step 7 | 在 application 定义 service facade、repository、UoW、port trait;在 infra 实现 repository / adapter / fake / runtime builder。 |
| API / Command / Query / Event / Job | Step 8 | 实现 10 Command、13 Query、9 Inbound Consumer、13 Outbound Event、10 Operations Job 和 shared public protocol helper。 |
| 函数级处理流 | Step 9 | 按 command、query、consumer、relay、job 模板实现调用链、异常分支和副作用顺序。 |
| 状态机 | Step 10 | 实现正式状态 enum、合法迁移、禁止迁移、非法迁移错误和 cross-state guard。 |
| 持久化 / 事务 / 一致性 | Step 11 | 实现 logical store、version、expected version、UoW、cursor、rollback visibility、projection、relay 和 stored replay。 |
| 错误模型 / 恢复 | Step 12 | 实现 validation、domain、repository、adapter、idempotency、no-write、no-repair、dead-letter、quarantine、degraded 和 public error redaction。 |
| 并发 / 幂等 / 重入 | Step 13 | 实现 canonical digest、duplicate replay、same-key conflict、in-flight、failed record、commit unknown、consumer dedup、job replay 和 race guard。 |
| 配置 / 外部依赖绑定 | Step 14 | 实现 `infra/config.rs`、`infra/runtime_builder.rs`、adapter availability、topic-neutral binding、external runtime / event / handoff / backend dependencies and fake strategy。 |
| 可观测性 / 审计 | Step 15 | 实现 structured log、metric、audit trace、relay / handoff marker、job report、diagnostic issue 和 redaction guard。 |
| 测试切口 | Step 16 | 后续 `05/07` 应把模块、协议、状态、一致性、幂等、并发、配置、观测测试切口转为正式测试矩阵和门禁。 |

---

## 10. 实施前置阅读矩阵

| 场景 | 必读文档 | 阅读目的 |
|---|---|---|
| 首次开工前 | `projects/L4-sandbox/00-需求文档.md`;`01-架构设计.md`;`02-概要设计.md` | 确认业务需求、架构边界、概要主轴和禁止混入相邻仓 truth。 |
| 首次开工前 | `projects/L4-sandbox/design-calibration/03_ddd_calibration_flow.md` | 确认当前详细设计恢复点、旧材料处理纪律和 Step 索引。 |
| 首次开工前 | `03_ddd_step_01_upstream_boundary.md` through `03_ddd_step_17_implementation_handoff.md` | 追溯对象、port、protocol、flow、state、persistence、error、idempotency、config、observability、test cuts 和 handoff。 |
| Step 19 后 | `projects/L4-sandbox/03-详细设计.md` | 作为正式详细设计入口;Step 19 前不得按旧正式 `03` 开工。 |
| 配置实现前 | 后续正式 `04-配置设计.md`;Step 14 | 确认 raw config、profile、defaults、source priority、secret、validation、adapter binding 和 forbidden configurable boundary。 |
| 测试实现前 | 后续正式 `05-测试方案.md`;Step 16 | 确认正式 TC、fixture、CI / script、report 和最小验证门禁。 |
| 验收准备前 | 后续正式 `06-验收标准.md`;Step 10 / 16 / 17 | 确认验收状态名、AC / VF、veto、evidence alias 规则和不得伪造证据。 |
| 实施计划生成 / 实现移交前 | 后续正式 `07-实施计划.md`;`实施计划讨论流程_SOP.md`;`实施计划书写规范.md` | 生成 phase / commit boundary、阅读门禁、提交门禁、实现暂停条件、implementation ledger 和 planned boundary skeleton。 |
| Rust 落码前 | `standards/coding/rust.md` | 确认 Rust 命名、注释、rustdoc、模块、错误、测试名和源码英文约束。 |
| 目录 / Cargo 落码前 | `standards/document/子项目目录与代码文件组织规范.md`;Step 4 | 确认目标实现仓路径、workspace member、package、crate、binary、scripts / reports 命名。 |
| 依赖接入前 | `standards/document/全局项目依赖关系与裁剪规则.md`;Step 3 / 14 | 确认只有 `core-contracts` 是编译期 sibling path dependency,其他 sibling 通过 port / adapter / event / handoff / fake。 |
| 遇到设计缺口时 | `standards/document/设计真相源闭环与可落码性标准.md`;本文件 §12 | 判断是回写设计、进入 blocker,还是在 `07` boundary 中标记 not_applicable。 |
| 提交前 | `standards/document/实施计划书写规范.md` §4.9;目标仓项目规范 | 确认实现仓英文 commit、`type(scope): subject`、body 分组、真实空行、AI footer 和测试门禁。 |

---

## 11. 实施前检查清单

| 检查项 | 当前要求 | 失败处理 |
|---|---|---|
| 目标实现仓 | `/home/aris/Projects/quantalithos-sandbox` 必须存在或由正式 `07` 的首个允许 boundary 创建。 | 暂停实现,回到 `07` 明确创建 / 确认策略。 |
| git user | 目标仓本地 `git config user.name` 应为 `quantalithos-labs`;`git config user.email` 应为 `quantalithos.ai@gmail.com`。 | 修正目标仓 git config 后再提交。 |
| commit message | 实现仓 commit 使用英文;标题 `type(scope): subject`;body 按 commit boundary 和子功能分组;footer 前有真实空行。 | amend 或重写 message,不得提交含中文实现仓 commit。 |
| 源码语言 | Rust 标识符、module、type、function、variable、rustdoc、普通注释、测试名默认英文。 | 修正源码语言后再提交。 |
| workspace layout | 使用 `crates/contracts/domain/application/infra/api/worker/jobs`。 | 不得沿用旧单 crate `src/` 或旧五段目录。 |
| Cargo package / crate | package 使用 `sandbox-<role>`;library crate 使用 `sandbox_<role>`;binary 包含 `sandbox-api`、`sandbox-control-worker`、`sandbox-fulfillment-worker` 和 job binaries。 | 命名偏离时暂停并回写设计或修正实现。 |
| 编译期 sibling dependency | 只允许 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`。 | 不得加入其他 sibling path dependency;运行期协作改用 port / adapter / event / fake。 |
| 正式详细设计 | 必须等待 Step 19 装配正式 `03`,并与 Step 1~18 一致。 | 不一致时回 Step 19 修正文档。 |
| 下游文档 | 正式 `04/05/06/07` 必须按新版 `03` 生成 / 重建 / 复核。 | 未完成前不得正式移交实现。 |
| implementation ledger / boundary skeleton | 只能在正式 `07-实施计划.md` 完成时同步创建。 | Step 17 不创建;若实现前缺失,回 `07` 补齐。 |
| 真实测试 / 验收证据 | 本步没有真实测试结果、run_id、evidence alias 或验收签署。 | 不得在实现计划或提交中伪造。 |

---

## 12. 跨文档一致性复核

### 12.1 真相源表

| 设计事实 | 真相源文档 | 章节 / 中间产物 | 后续消费者 | 冲突处理 |
|---|---|---|---|---|
| sandbox 业务边界、红线和非目标 | 正式 `00-需求文档.md` | C-SBX / FR / BR / AC / VF / NFR | `03/05/06/07` | 与旧 README 冲突时以正式 `00` 为准。 |
| 独立 truth center、依赖方向和数据所有权 | 正式 `01-架构设计.md` | 架构边界、上下文、数据归属、一致性分层 | `03/04/07` | 与旧 `03` provider bridge / backend 直连冲突时以正式 `01` 为准。 |
| 代码主体、主要组成部分、接口骨架、状态机摘要 | 正式 `02-概要设计.md` | 代码主体框架、接口骨架、状态和 handoff | `03` Step 4~10 | 与旧五段主线冲突时以正式 `02` 和 Step 1~16 为准。 |
| 目标实现仓、Rust、源码语言、唯一编译依赖 | `03_ddd_step_03_constraints.md`;`03_ddd_step_04_file_layout.md` | constraints / file layout | `07`;目标实现仓 Cargo | 目标仓不存在不得伪造;只作为 implementation precheck。 |
| 模块职责和 Cargo 依赖方向 | `03_ddd_step_05_module_contracts.md` | 模块契约、依赖矩阵 | `03` Step 19;`07`;Cargo workspace | Cargo 依赖反向时回 Step 5 / 7 修正。 |
| Domain 对象、字段、状态 owner | `03_ddd_step_06_object_contracts.md` | 对象卡片、字段来源、状态闭环 | domain / application / tests | 字段缺失回 Step 6,不得由实现者在代码中自由补字段。 |
| Port / repository / adapter callable surface | `03_ddd_step_07_trait_port_adapter_contracts.md` | service facade、repository、port、adapter、fake parity | application / infra / tests | Step 8 / 9 不得新增未在 Step 7 开放的 mutating callable surface。 |
| Public protocol | `03_ddd_step_08_protocol_contracts.md` | Command / Query / Consumer / Outbound / Job DTO | contracts / api / worker / jobs | DTO 与 flow 冲突时回 Step 8 / 9。 |
| 函数级 flow 和副作用顺序 | `03_ddd_step_09_function_flows.md` | 55 个 flow、shared transaction template | application services | 不得自行调整 reserve、save、stored result、cursor、commit 顺序。 |
| 状态机与迁移 | `03_ddd_step_10_state_matrix.md` | 8 状态族、29 状态机批次 | domain / tests / acceptance | 状态冲突回 Step 10,旧状态名不得进入 `05/06/07`。 |
| 持久化、事务、version、cursor | `03_ddd_step_11_persistence_transaction_consistency.md` | logical stores、UoW、repository semantics | infra / application / fake / durable tests | fake 与 durable 必须等价;cursor 不得来自 page/version/time/id。 |
| 错误、恢复、并发、幂等 | `03_ddd_step_12_error_recovery.md`;`03_ddd_step_13_concurrency_idempotency.md` | taxonomy、stored replay、duplicate、race guard | application / tests | duplicate 不重跑;no-write/no-repair violation 不得静默通过。 |
| 配置、外部依赖、观测、测试切口 | `03_ddd_step_14_config_external_binding.md`;`03_ddd_step_15_observability_audit.md`;`03_ddd_step_16_test_cuts.md` | config binding、redaction、test cuts | `04/05/06/07`;infra/tests | 细节不足进入下游文档;不得由 implementation 自行脑补。 |

### 12.2 字段闭环表

| Domain 对象 | 字段 | 类型 | 字段来源 | 构造入口 | DTO / Event 字段 | 缺失处理 | 测试覆盖 | 验收证据 |
|---|---|---|---|---|---|---|---|---|
| `ControlledExecutionContext` | `context_ref`;`responsibility_context`;`intake_status` | typed refs + status | id generator、command metadata、resolver safe summary | `ControlledExecutionContext::open_pending(...)`;`accept(...)`;`reject(...)` | `OpenControlledExecutionContextRequest`;command metadata | unresolved -> `Unresolved` / reject;forbidden body -> reject / rollback | `OpenControlledExecutionContext_command`;`domain_state_transition_guards` | 后续 `06` 定义,本步不伪造 evidence。 |
| `ExecutionEnvironmentIdentity` | `environment_identity_ref`;`source_ref`;`identity_status` | typed refs + status | caller / work / runtime safe summary、resolver、reference state | identity factory / resolution flow | context command;reference consumer | missing / stale identity -> pending / rejected / degraded view | context / reference tests | 后续 `06`。 |
| `BoundaryRequirementSet` / `CoherentBoundary` | `environment_identity_ref`;`boundary_profile_ref`;`limit_template_ref`;`runtime_generation_ref`;`resource_limits`;`filesystem_boundary`;`network_boundary`;`process_boundary`;`coherence_status` | typed refs + boundary carriers + status | accepted context、active identity、command explicit requirements、builder-injected I039 / I040、LD-24 service generation、backend capability summary | `BoundaryRequirementSet::from_context_and_requirements(...)`;`CoherentBoundary::establish(...)` | `EstablishExecutionBoundaryRequest`;capability event | mismatch / unsupported / weak fallback -> rejected / failed,not silent allow;不得等待后序policy | `EstablishExecutionBoundary_command`;`boundary_capability_handle_lease_states` | 后续 `06`。 |
| `IsolationEnvironmentHandle` / `LeaseRecord` | `handle_ref`;`backend_profile_ref`;`lease_ref`;`lease_window`;`lease_status` | typed refs + lease window + status | generation-scoped isolation backend establish outcome、I065-bound profile、clock | handle / lease factory;grouped save;exact typed reads | boundary command;run command;backend lifecycle event;reaper job | backend unavailable -> pending / failed;run遇mismatch / inactive / expired -> backend call 0;orphan -> reaper marker | `StartControlledExecutionRun_command`;`RunLeaseOrphanReaper_job`;lease race tests | 后续 `06`。 |
| `PolicyExecutionDecision` / `HighRiskActionDecision` | `policy_snapshot_ref`;`decision_status`;`high_risk_marker` | refs + status + marker | policy summary port、command context、high-risk guard | policy decision factory | `EvaluatePolicyExecutionRequest`;policy event | missing / conflicted / stale -> fail-closed,not allow | `EvaluatePolicyExecution_command`;fail-closed tests | 后续 `06`。 |
| `ControlledExecutionRun` | `run_ref`;`boundary_ref`;`policy_decision_ref`;`run_status`;`handle_ref` | typed refs + status | accepted context、coherent boundary、exact active handle、exact active non-expired persisted lease、policy allow、isolation backend launch | `ControlledExecutionRun::prepare(...)`;failure / control transitions | `StartControlledExecutionRunRequest`;backend lifecycle event | denied / missing or mismatched boundary / handle / lease / launch failure -> rejected / failed marker;guard failure backend call 0 | `StartControlledExecutionRun_command`;run state / call-budget tests | 后续 `06`。 |
| `CaptureFact` / `CapturedMaterialRef` | `capture_ref`;`run_ref`;`capture_status`;`material_refs`;`observability_material_ref` | refs + status | capture adapter output、material summary、observability material marker | `CaptureFact::complete(...)`;`partial(...)`;`failed(...)` | `RecordCaptureResultRequest`;capture event | capture failed / body present -> failed / forbidden body reject | `RecordCaptureResult_command`;redaction tests | 后续 `06`。 |
| `HandoffFact` | `handoff_ref`;`source_capture_ref`;`target_kind`;`handoff_status`;`receipt_ref` | refs + enum + status | capture fact、handoff adapter、feedback consumer | `HandoffFact::open(...)`;status update | `OpenMaterialHandoffRequest`;handoff feedback event | target mismatch -> quarantine;adapter failure -> retryable / failed,no capture rollback | `OpenMaterialHandoff_command`;handoff no-rollback tests | 后续 `06`。 |
| `FailureClassification` / `ControlFact` | `failure_ref`;`failure_kind`;`control_kind`;`control_status`;`source_markers` | refs + enum + status | policy deny、timeout、backend/capture/handoff/control/redline markers | classifier / control factory | `ClassifySandboxFailureRequest`;`SubmitSandboxControlRequest`;control event | unknown -> pending input;conflict -> rejected | failure / control command tests | 后续 `06`。 |
| `CleanupGuard` / `RedlineContainment` | `cleanup_guard_ref`;`guard_status`;`redline_ref`;`containment_status`;`investigation_summary` | refs + status + summary | capture/handoff/investigation/redline truth、cleanup evaluator | guard / containment factories | cleanup command;redline command;investigation event | non-Allowed cleanup no release;redline not advisory-only | cleanup / redline tests | 后续 `06`。 |
| `ReferenceResolutionState` | `reference_state_ref`;`tracked_refs`;`safe_summary_refs`;`resolution_status`;`refresh_marker` | refs + marker + status | inbound event envelope、resolver、refresh job | reference state factory / update | reference consumer payload;refresh job spec | forbidden body -> quarantine;missing summary -> delayed / degraded | reference consumer / refresh job tests | 后续 `06`。 |
| `SandboxReadProjection` / `DerivedInspectPreviewTrendState` | `projection_ref`;`derived_state_ref`;`source_refs`;`projection_status`;`freshness_status` | refs + status | committed truth snapshot、projection rebuild、derived maintenance | projection / derived factories | query view;projection / derived events;jobs | missing projection -> degraded / missing;query cannot rebuild | query no-write;projection job tests | 后续 `06`。 |
| `SandboxEventRelayRecord` / `SandboxAuditTrace` | `relay_ref`;`source_truth_ref`;`source_cursor`;`trace_ref`;`trace_kind` | refs + cursor + enum | UoW committed truth cursor、audit mapper、event payload builder | relay append / trace append | outbound event envelope;command result | publisher failure -> retryable / dead-letter,no source rollback | relay publish tests;trace refs-only tests | 后续 `06`。 |
| `SandboxIdempotencyRecord` / `SandboxStoredOperationResult` | `idempotency_ref`;`operation_name`;`request_digest`;`stored_result_ref`;`result_status` | refs + digest + status | command / consumer / job metadata、canonical digest、stored public result | reserve / complete / replay | command metadata;consumer envelope;job input | same key different digest -> conflict;missing result -> blocker/degraded,no rerun | idempotency / duplicate replay tests | 后续 `06`。 |

### 12.3 DTO / Event / Job 到 Domain 对象构造闭环表

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 | 关联处理流 |
|---|---|---|---|---|---|---|
| 10 个 Command request | core sandbox truth、audit trace、relay record、stored command result | 是 | id generator、clock、repository lookup、resolver、policy / backend / handoff adapters | idempotency key != business object ref;expected_version != repository cursor | reject、fail-closed、pending、failed marker、rollback | Step 9 Command flows |
| 13 个 Query request | public view / page / marker response | 是 | truth snapshot、projection repository、derived repository、audit repository、visibility resolver | page cursor != truth cursor;view ref != domain object mutable version | empty、not visible、restricted、stale、degraded、failed、missing projection | Step 9 Query flows |
| 9 个 Inbound Event envelope | reference state、handoff feedback、control input、relay feedback、receipt | 是 if envelope valid | event metadata、schema version、dedup key、payload digest、source authority | source event ref != local relay ref;trusted source != bypass | duplicate、delayed、rejected、quarantined、dead-letter | Step 9 Consumer flows |
| 13 个 Outbound Event payload | outbound envelope / payload snapshot / relay record | 是 | committed truth or maintenance state、UoW source cursor、trace context、payload builder | outbound event id != truth object id;payload ref != body | append failure rollback source tx;publish failure no rollback source truth | Step 9 Relay flows |
| 10 个 Operations Job input | maintenance state / report / markers / stored job report | 是 | job metadata、scope、page cursor、repository page、adapter result,stored result | job run ref != job idempotency key;job report != acceptance evidence | invalid input、selection empty、partial failed、skipped、duplicate report replay | Step 9 Job flows |

### 12.4 Query response / view 闭环表

| Query | Response DTO / View | 字段 | 类型 | 字段来源 | empty / not visible / degraded 口径 | public id/ref 规则 | 测试覆盖 |
|---|---|---|---|---|---|---|---|
| `GetSandboxExecutionStatus` | `SandboxQueryResponseDto<SandboxExecutionStatusView>` | `surface_status`;`view`;`projection_marker` | status + view + marker | context / run / capture truth snapshot and projection | missing snapshot -> unavailable;not visible -> redacted;stale -> degraded marker | request context ref;no reconstructed ref | `GetSandboxExecutionStatus_query` |
| `GetBoundaryStatus` | `SandboxQueryResponseDto<BoundaryStatusView>` | boundary / capability / handle fields | view | boundary truth、capability reference、handle / lease truth | missing capability -> degraded;direct unsupported ref -> validation / missing | boundary ref from truth / request;no backend call | `GetBoundaryStatus_query` |
| `GetPolicyDecisionSummary` | `SandboxQueryResponseDto<PolicyDecisionSummaryView>` | decision status / fail-closed markers | view | policy decision truth and safe summary refs | missing policy -> degraded / fail-closed summary | policy decision ref from truth | `GetPolicyDecisionSummary_query` |
| `GetCaptureSummary` | `SandboxQueryResponseDto<CaptureSummaryView>` | capture status / material refs | view | capture truth and material refs | no capture -> empty;body absent always | material refs are body-free | `GetCaptureSummary_query` |
| `GetMaterialHandoffStatus` | `SandboxQueryResponseDto<MaterialHandoffStatusView>` | handoff status / receipt ref | view | handoff truth and feedback marker | no handoff -> empty;failed -> visible failure | handoff ref from truth / index | `GetMaterialHandoffStatus_query` |
| `GetFailureControlStatus` | `SandboxQueryResponseDto<FailureControlStatusView>` | failure/control status | view | failure classification and control fact | no failure -> empty;pending input -> degraded marker | failure/control refs from truth | `GetFailureControlStatus_query` |
| `GetCleanupReadiness` | `SandboxQueryResponseDto<CleanupReadinessView>` | guard status / blocking reasons | view | cleanup guard truth、investigation summary marker | no guard -> empty;pending investigation -> degraded marker | cleanup guard ref from truth | `GetCleanupReadiness_query` |
| `GetRedlineContainmentStatus` | `SandboxQueryResponseDto<RedlineContainmentStatusView>` | containment status / investigation marker | view | redline containment truth | no redline -> empty;handoff pending -> degraded | redline ref from truth | `GetRedlineContainmentStatus_query` |
| `GetSandboxReadProjection` | `SandboxQueryResponseDto<SandboxReadProjectionView>` | projection status / source cursor | view + marker | projection repository | missing projection -> `MissingProjection`;query no rebuild | projection ref from repository key | `GetSandboxReadProjection_query` |
| `GetDerivedInspectPreviewTrend` | `SandboxQueryResponseDto<DerivedInspectPreviewTrendView>` | freshness / derived refs | view | derived repository and source refs | rebuilding / failed / unavailable -> degraded / failed | derived state ref from repository | `GetDerivedInspectPreviewTrend_query` |
| `GetBackendCapabilityComparison` | `SandboxQueryResponseDto<BackendCapabilityComparisonView>` | comparison status / capability refs | view | backend capability reference state / projection | stale / unavailable -> degraded | capability ref body-free only | `GetBackendCapabilityComparison_query` |
| `GetSandboxReconciliationReport` | `SandboxQueryResponseDto<SandboxReconciliationReportView>` | report status / finding refs | view | reconciliation report repository | missing -> empty;degraded -> report degraded | report ref from latest index | `GetSandboxReconciliationReport_query` |
| `GetSandboxAuditTrace` | `SandboxPageResponseDto<SandboxAuditTraceRecordView>` | trace page / page_info | page view | audit trace repository | empty page / redacted / not visible | page cursor opaque;not truth cursor | `GetSandboxAuditTrace_query` |

### 12.5 状态闭环表

| 状态枚举 | 正式状态值 / 状态族 | 产生函数 | 合法迁移 | 禁止迁移 | 测试覆盖 | 验收证据 |
|---|---|---|---|---|---|---|
| `ControlledExecutionIntakeStatus` | `PendingResolution`;`Accepted`;`Rejected`;`Unresolved`;`Closed` | `ControlledExecutionContext::open_pending`;`accept`;`reject`;`mark_unresolved` | pending -> accepted / rejected / unresolved | rejected -> accepted;closed -> active | `intake_identity_reference_states` | 后续 `06` |
| `BoundaryDecisionStatus` / boundary family | `Required`;`Established`;`Rejected`;`PendingCapability`;`Failed` | boundary requirement / decision factories | required -> established / rejected / pending / failed | unsupported -> established;weak fallback success | `boundary_capability_handle_lease_states` | 后续 `06` |
| `PolicyExecutionDecisionStatus` | allow / reject / fail-closed variants | policy decision factory | applicable -> allowed / rejected;missing -> fail-closed | missing / stale -> allowed | `policy_high_risk_states` | 后续 `06` |
| `ControlledExecutionRunStatus` | `Preparing`;`Running`;`Completed`;`Failed`;`Terminated` | run start / lifecycle mapper | preparing -> running -> completed / failed / terminated | failed -> completed;terminated -> running | `run_capture_handoff_states` | 后续 `06` |
| `CaptureStatus` / `HandoffStatus` | pending / complete / partial / failed;pending / delivered / retryable / failed / dead-letter | capture / handoff factories | pending -> complete / partial / failed;pending -> delivered / retryable / failed | handoff failure -> capture rollback | `run_capture_handoff_states`;handoff tests | 后续 `06` |
| `FailureClassificationStatus` / `ControlStatus` | pending input / classified / terminal;requested / applied / conflict / failed | classifier / control factories | pending -> classified / terminal;requested -> applied / conflict | unknown -> success;conflicting controls both applied | failure / control tests | 后续 `06` |
| `CleanupGuardStatus` / `RedlineContainmentStatus` | pending evidence / blocked / allowed / completed;detected / contained / handoff pending / released / terminal | cleanup evaluator / redline containment factory | pending -> allowed / blocked;detected -> contained / handoff pending | non-allowed cleanup -> release;redline advisory only | cleanup / redline tests | 后续 `06` |
| `SandboxProjectionStatus`;`DerivedFreshnessStatus`;`ReconciliationReportStatus` | fresh / stale / rebuilding / degraded / unavailable;clean / issues / degraded / failed | projection / derived / reconciliation jobs | stale -> rebuilding -> fresh / degraded | query triggers rebuild;read failure -> core failure | query no-write;projection job tests | 后续 `06` |
| `EventRelayStatus` | pending / delivered / failed / retryable / dead-letter | relay append / publish outcome | pending -> delivered / retryable / failed / dead-letter | publish failure -> source rollback | relay publish tests | 后续 `06` |
| `IdempotencyRecordStatus`;`StoredResultStatus`;`ConsumerReceiptStatus`;`JobReportStatus` | reserved / completed / duplicate / failed;completed / missing;accepted / duplicate / delayed / quarantined;success / partial / failed / skipped / duplicate | reserve / complete / replay;receipt/report factories | reserved -> completed;completed -> duplicate replay | duplicate reruns mutation;report replay re-executes job | idempotency / job replay tests | 后续 `06` |
| `AdapterAvailabilityStatus`;`RuntimeConfigStatus` | available / degraded / unavailable / disabled;valid / blocked / degraded | runtime builder / health check | valid -> available / degraded;invalid -> startup blocked | config disables hard guard | config / adapter tests | 后续 `06` |

### 12.6 Phase / commit boundary 预复核表

| Phase / commit boundary | 包含内容 | 明确排除 | 依赖前置 | 不得依赖后续 | 测试范围 | 验收范围 |
|---|---|---|---|---|---|---|
| future `07` boundary for workspace scaffold | 目标仓确认 / 创建、Cargo workspace、7 crate、root dependency policy | domain object logic、API routes、runtime backend integration | Step 3 / 4;正式 `07` | 不得依赖未来测试 evidence 或 acceptance signoff | cargo metadata / fmt / check 由 `07` 定义 | 后续 `06/07` |
| future `07` boundary for contracts | typed refs、metadata、DTO、view、event、job、receipt、error schema | domain private state and repository adapter | Step 6 / 8 | 不得引用未来 domain implementations as schema source | contract unit / schema roundtrip | 后续 `06/07` |
| future `07` boundary for domain | domain objects、state transitions、invariants、redline / cleanup guard | repository persistence, route, bus, backend product | Step 6 / 10 / 12 | 不得依赖 infra fake to define domain state | domain unit / state transition tests | 后续 `06/07` |
| future `07` boundary for application services | command / query / consumer / job orchestration、UoW、idempotency、error mapping | durable DB / real bus / product backend | Step 7 / 9 / 11 / 13 | 不得 rely on later infra to decide flow order | fake repository / fake port service tests | 后续 `06/07` |
| future `07` boundary for infra adapters | repository fake / durable adapter, config, runtime builder, backend / handoff / publisher adapters | changing domain invariants or public DTO | Step 7 / 11 / 14 / 15 | 不得 weaken fail-closed / no-write / no-rollback | repository parity / config / adapter fake tests | 后续 `06/07` |
| future `07` boundary for api / worker / jobs | entry handler、consumer runtime、relay worker、job runner | business truth invention or raw config schema changes | Step 8 / 9 / 14 / 16 | 不得 depend on future evidence alias or acceptance signoff | handler / worker / job tests | 后续 `06/07` |
| future `07` boundary for tests / gates | Step 16 test cuts into formal test gates | claiming tests already ran | formal `05` and `06` | 不得 create fake run_id / evidence alias | test commands defined by `05/07` | `06` evidence alias rules |

说明: 上表只是 Step 17 的预复核输入,不是正式 `07` phase / commit boundary。正式 boundary ID、顺序、allowed scope、required checks、implementation ledger 和 planned skeleton 只能在 `07-实施计划.md` 完成时定义。

### 12.7 Public protocol 传递类型闭环表

| 协议 surface | 外层 DTO | 字段 | 传递类型 | 正式归属 | schema / variant 定义位置 | 缺失 / duplicate / retry 口径 | 依赖边界 | 测试覆盖 |
|---|---|---|---|---|---|---|---|---|
| Command result | `SandboxCommandResultDto` | `status`;`primary_ref`;`affected_refs`;`stored_result_ref`;`error` | result status、typed refs、public error | `contracts` | Step 8;Step 12 | duplicate returns stored result;missing result -> blocker/degraded | `contracts` 不依赖 `domain` | command tests |
| Query response | `SandboxQueryResponseDto<T>` | `surface_status`;`view`;`page_info`;`projection_marker` | query status、view、page helper、marker | `contracts` | Step 8;Query table | missing / not visible / degraded surface;no write | view from projection / truth snapshot only | query tests |
| Inbound event | `SandboxInboundEventEnvelopeDto<TPayload>` | `source_event_ref`;`dedup_key_ref`;`payload_digest`;`payload` | envelope helper、payload DTO、receipt | `contracts` | Step 8 | duplicate returns stored receipt;unsafe body -> quarantine | worker source adapter only | consumer tests |
| Consumer receipt | `SandboxConsumerReceiptDto` | `receipt_status`;`stored_result_ref`;`trace_record_ref`;`quarantine_marker_ref` | receipt status、typed refs | `contracts` | Step 8;Step 13 | delayed / rejected / quarantined explicit;no core success write | application owns receipt semantics | consumer tests |
| Outbound event | `SandboxOutboundEventEnvelopeDto<TPayload>` | `event_kind`;`source_truth_ref`;`source_cursor`;`payload_ref` | event kind、cursor、payload | `contracts` / application relay | Step 8 / 9 / 11 | publish retry / dead-letter no rollback source truth | publisher port only | relay tests |
| Job input / report | `SandboxJobInputDto<TSpec>`;`SandboxJobReportDto` | `job_kind`;`scope_ref`;`page_request`;`succeeded_refs`;`failed_refs`;`next_cursor` | job kind、scope、page、report refs | `contracts` | Step 8 / 13 / 16 | duplicate returns stored report;partial failed preserves item refs | jobs entry cannot repair core truth | job tests |
| Public error | `SandboxPublicErrorDto` | `error_kind`;`reason`;`trace_ref`;`retry_hint` | public error kind、reason、trace | `contracts`;application mapper | Step 8 / 12 / 15 | raw error / stack / adapter response redacted | no raw body or secret | error redaction tests |

### 12.8 命名一致性表

| 名称类型 | 正式名称 | 禁用旧名 / 口语名 | 出现位置 | 修正要求 |
|---|---|---|---|---|
| 项目实现仓 | `/home/aris/Projects/quantalithos-sandbox` | `L4-sandbox` as repo name;`sandbox-service` ad hoc repo | Step 3 / 4 / 17 | `L4` 只用于设计导航,不得进入 package / crate / module。 |
| Workspace roles | `contracts`;`domain`;`application`;`infra`;`api`;`worker`;`jobs` | `session`;`isolation`;`command`;`output`;`control`;`types`;`config` as top-level old tree | Step 4 / 5 | 实现只使用 Step 4 planned layout。 |
| Package / crate | `sandbox-contracts`;`sandbox_domain`;etc. | `quantalithos-sandbox-*`;`l4_sandbox_*` | Step 4 | package 用 `sandbox-<role>`,lib crate 用 `sandbox_<role>`。 |
| Context truth | `ControlledExecutionContext` | `SandboxExecution`;`SandboxSession` | Step 6 / old `03` | 旧对象只作 historical material。 |
| Boundary truth | `BoundaryRequirementSet`;`CoherentBoundary`;`IsolationEnvironmentHandle` | `IsolationConfig`;`RuntimeHost`;`BackendSession` | Step 6 / 7 / 10 | 使用 Step 6 object names and Step 10 states。 |
| Policy decision | `PolicyExecutionDecision`;`HighRiskActionDecision` | `SandboxPolicy`;`Allowlist`;`PolicyBody` | Step 6 / 8 / 14 | policy body external;only safe summary / snapshot refs in sandbox。 |
| Capture / handoff | `CaptureFact`;`HandoffFact`;`ObservabilityMaterialRef` | `SandboxOutput`;`artifact evidence body`;`ObservabilityStoreBody` | Step 6 / 8 / 15 | 保存 refs / summaries only,not body。 |
| Cleanup / redline | `CleanupGuard`;`RedlineContainment` | `cleanup flag`;`security warning`;`advisory redline` | Step 6 / 10 / 14 | redline 不 advisory-only;cleanup 必须 guard allowed。 |
| Query states | `SandboxQuerySurfaceStatus`;`SandboxProjectionStatus` | `ok/missing/error` bool-like status | Step 8 / 10 | Query 必须显示 no-write / degraded / stale / missing projection surface。 |
| Evidence / tests | future `05/06` evidence alias | ad hoc run_id;manual pass;current Step proof | Step 16 / 17 | 本步不声明真实测试或验收结果。 |

### 12.9 冲突与修正表

| 冲突 ID | 冲突位置 | 冲突类型 | 影响范围 | 推荐修正 | 处理状态 |
|---|---|---|---|---|---|
| SBX-DDD-HANDOFF-HIST-001 | 旧 `README.md`;旧 `03-详细设计.md` | 历史技术 / 对象 / 目录主线污染 | `03/07` implementation handoff | Step 19 正式装配时不继承旧五段、旧 Docker/gVisor 硬选型、provider bridge 或 body 存储口径。 | contained_as_historical_material |
| SBX-DDD-HANDOFF-DOC-001 | 正式 `04-配置设计.md` 缺失 | 下游配置文档缺口 | `04/07`;infra config | 后续按配置 SOP 创建,承接 Step 14 raw schema / profile / validation。 | open_downstream |
| SBX-DDD-HANDOFF-DOC-002 | 旧 `05-测试方案.md`;旧 `06-验收标准.md` | 测试 / 验收旧口径 | `05/06/07`;implementation gates | 后续按新版 `03` 重建或复核,不得作为当前真实测试或验收结果。 | open_downstream |
| SBX-DDD-HANDOFF-DOC-003 | 正式 `07-实施计划.md` 缺失 | 实施计划缺口 | implementation transfer | 后续进入 `07` 时生成正式文档、implementation ledger 和 planned boundary skeleton。 | open_downstream |
| SBX-DDD-HANDOFF-REPO-001 | `/home/aris/Projects/quantalithos-sandbox` 当前未发现 | 目标仓前置检查 | implementation start | `07` 首个 boundary 必须确认或创建目标仓,并复核 git config。 | open_for_07_precheck |
| SBX-DDD-HANDOFF-PHASE-001 | Step 17 不定义 phase / commit | 容易被误读为已可实现 | `07` | 本文件明确只是 handoff input;正式 boundary must be defined by `07`。 | resolved_by_scope |

### 12.10 正反例

| 类型 | 示例 | 结论 |
|---|---|---|
| 正例 | `07` boundary 写“实现 `sandbox-domain` state transitions;校准来源:正式 `03` §9 + `03_ddd_step_10_state_matrix.md`;不得修改 DTO schema;测试引用 Step 16 状态机切口”。 | 可接受。引用真相源,没有复制为第二表。 |
| 正例 | `infra/runtime_builder.rs` 只接收 raw config,输出 sanitized `SandboxRuntimeConfigSummary`,application 构造函数只接收 port trait 和 typed params。 | 可接受。符合 Step 14 config boundary。 |
| 正例 | Relay publish failure 标记 relay retryable / dead-letter,source truth 和 capture truth 保持已提交。 | 可接受。符合 Step 9 / 11 no-rollback。 |
| 反例 | 在 `07` 里直接新增 `SandboxGlobalState` 并让所有 Command 共用。 | 不可接受。违反 Step 10 状态主语拆分。 |
| 反例 | 实现 Query 发现 missing projection 时自动 rebuild 并 append audit。 | 不可接受。违反 query no-write。 |
| 反例 | 用 Docker/gVisor 作为唯一后端硬编码,并把 unsupported fallback 视为 success。 | 不可接受。旧 README 技术线索不得成为当前 hard baseline;weak fallback 禁止。 |
| 反例 | 为接入 `quantalithos-artifact`、`quantalithos-observability`、`quantalithos-member-service` 增加 Cargo path dependency。 | 不可接受。除 `core-contracts` 外,其他 sibling 只能通过 port / adapter / event / handoff / fake。 |
| 反例 | 现在创建 `implementation_execution_ledger.md` 并标记 planned boundary pass。 | 不可接受。implementation ledger / planned skeleton 只能在正式 `07` 完成时创建,且 future boundary 不得 pass。 |

---

## 13. Historical material / blocker 台账

| ID | 类型 | 状态 | 描述 | 处理口径 |
|---|---|---|---|---|
| SBX-DDD-HANDOFF-001 | Step 17 blocker | resolved_for_step_17 | Step 16 已提供测试切口,但尚未把 `03` 可交给 `07` 的承接关系收口。 | 本文件已输出实施承接、阅读清单、前置检查和跨文档复核。 |
| SBX-DDD-HIST-001 | historical_material | contained | 旧 `03` 的旧对象、旧目录、provider bridge、Docker/gVisor 和 body / evidence 线索可能污染实现。 | Step 17 继续隔离旧材料;Step 19 正式装配不得继承未重校准内容。 |
| SBX-DOC-GAP-001 | downstream gap | open_downstream | 正式 `04-配置设计.md` 缺失。 | 后续进入 `04` 时创建并承接 Step 14。 |
| SBX-DOC-GAP-TEST-001 | downstream gap | open_downstream | 正式 `05-测试方案.md` 尚未按新版 `03` 重建。 | 后续进入 `05` 时承接 Step 16。 |
| SBX-DOC-GAP-ACCEPT-001 | downstream gap | open_downstream | 正式 `06-验收标准.md` 需要按新版 `03/05` 重建或复核。 | 后续进入 `06` 时处理。 |
| SBX-DOC-GAP-002 | downstream gap | open_downstream | 正式 `07-实施计划.md` 缺失。 | 后续进入 `07` 时创建正式文档、implementation ledger 和 planned boundary skeleton。 |
| SBX-IMPL-PRECHECK-001 | implementation precheck | open_for_07 | `/home/aris/Projects/quantalithos-sandbox` 当前未发现。 | 不阻塞当前设计 Step;实现前由 `07` 首个 boundary 确认或创建。 |

---

## 14. 回填草稿: `03-详细设计.md` §16

> 校准来源:
> - `design-calibration/03_ddd_step_17_implementation_handoff.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/03_ddd_step_17_implementation_handoff.md` 的“实施承接清单”“实施前置阅读矩阵”“实施前检查清单”“跨文档一致性复核”和“未进入实施的待确认项”小节,了解详细设计如何移交给后续 `07-实施计划.md`。

本详细设计向实施计划交付的输入包括上游边界、范围与非范围、Rust / 仓库 / 依赖约束、workspace 多 crate 布局、模块实现契约、对象实现契约、Trait / Port / Adapter 契约、10 个 Command、13 个 Query、9 个 Inbound Consumer、13 个 Outbound Event、10 个 Operations Job、55 个函数级 flow、状态矩阵、持久化 / 事务 / 一致性、错误恢复、并发 / 幂等、配置 / 外部依赖绑定、可观测性 / 审计和最小测试切口。

后续 `07-实施计划.md` 必须引用正式 `03` 章节和对应 `design-calibration/03_ddd_step_*.md`,把它们转成 phase / commit boundary 的阅读门禁、允许范围、禁止范围、测试门禁和暂停条件。`07` 不得复制字段表、DTO 表、flow 表或状态矩阵形成第二真相源;若发现字段、DTO、Query response、状态、命名或 boundary 闭环断裂,必须回写设计或登记 blocker,不得交给实现者自行取舍。

实施者开工前必须完成以下前置阅读和检查:正式 `00/01/02`,Step 1~19 校准链,Step 19 后的正式 `03`,后续正式 `04/05/06/07`,Rust 编码规范、目录组织规范、实施计划规范、代码实施台账规范、提交规范和真相源闭环标准。目标实现仓为 `/home/aris/Projects/quantalithos-sandbox`;当前设计阶段未确认该仓存在,因此正式实施前必须由 `07` 明确创建或确认。目标仓提交使用英文 commit message,源码标识符、rustdoc、普通注释和测试名默认英文;当前唯一允许的编译期 sibling path dependency 是 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`。

本章不表示实现已开始,也不表示测试、验收或交付已完成。本项目不得在详细设计阶段伪造实现 commit、run_id、evidence alias、测试通过结果或验收签署。implementation ledger 和全部 planned boundary skeleton 只能在正式 `07-实施计划.md` 完成时同步创建。

---

## 15. 未进入实施的待确认项

| 待确认项 | 当前状态 | 是否阻塞 Step 17 | 后续处理 |
|---|---|---:|---|
| Step 18 风险与待确认事项 | 未创建 | 否 | 用户确认本步后读取详细设计 SOP Step 18 和书写规范 §5.17,再创建 Step 18 中间产物。 |
| Step 19 正式 `03` 装配 | 未开始 | 否 | Step 18 用户确认后进入 Step 19,正式 `03` 才可重建。 |
| 正式 `04-配置设计.md` | 缺失 | 否 | 后续按配置 SOP 创建,承接 Step 14。 |
| 正式 `05-测试方案.md` | 旧材料 / 待重建 | 否 | 后续按测试方案 SOP 重建,承接 Step 16。 |
| 正式 `06-验收标准.md` | 旧材料 / 待重建 | 否 | 后续按验收标准 SOP 重建,承接新版 `03/05`。 |
| 正式 `07-实施计划.md` | 缺失 | 否 | 后续按实施计划 SOP 创建,并同步 implementation ledger 与 planned boundary skeleton。 |
| 目标实现仓存在性 | `/home/aris/Projects/quantalithos-sandbox` 当前未发现 | 否 | `07` 首个 implementation precheck / boundary 明确创建或确认。 |
| backend 产品组合 / isolation runtime 选型 | 抽象 adapter 已定,产品未定 | 否 | `04/07/ADR` 决定;不得改变 fail-closed、coherent boundary、no weak fallback。 |
| raw config key / topic / store / secret / OTel / scheduler | 当前仅有 binding 语义 | 否 | `04` 定 raw schema,`07` 定落地 boundary。 |

---

## 16. 自检

| 检查项 | 结论 |
|---|---|
| 是否只创建 / 更新当前 Step 中间产物 | 通过。本文件是 Step 17 中间产物;未创建 Step 18 文件。 |
| 是否修改正式 `03-详细设计.md` | 未修改。正式 `03` 仍等待 Step 19 装配。 |
| 是否写了实施 phase / commit boundary / 排期 / 任务拆分 | 未写。只给 future `07` 预复核输入。 |
| 是否创建 implementation ledger 或 planned boundary skeleton | 未创建。已明确只能在正式 `07` 完成时创建。 |
| 是否伪造真实测试结果、run_id、evidence alias、验收签署或实现 commit | 未伪造。 |
| 是否包含提交规范、git config 用户、Rust 编码规范和注释规范 | 已包含。见 §1、§10、§11。 |
| 是否完成跨文档一致性复核类中间产物 | 已完成。见 §12.1~§12.10。 |
| 是否闭合重点边界 | 已覆盖 execution environment identity、resource limits、filesystem / network / process boundary、tool/runtime launch policy、artifact capture、observability hooks、failure classification、cleanup / lease / reaper、security redlines,并排除 tools semantic execution、runtime agent loop 和 member lifecycle orchestration。 |

---

## 17. 进入下一步条件

```text
当前 Step 17 `收口详细设计到实施计划的承接清单` 已完成;
gate_status = pass_wait_review;
next_allowed_action = 等待用户审查 `03_ddd_step_17_implementation_handoff.md`;
用户确认后才允许进入 Step 18 `风险与待确认事项`;
进入 Step 18 前必须读取项目级台账、`03_ddd_calibration_flow.md`、本文件、Step 1~17 已完成中间产物、详细设计 SOP Step 18、详细设计书写规范 §5.17 和中间产物规范相关风险 / 待确认记录要求;
当前不需要提交 commit,且未经用户明确要求不得提交。
```

---

## 18. 实施计划回查修复记录

| 回查 ID | 发现位置 | 原冲突 | 修复结果 | 实施承接结论 |
|---|---|---|---|---|
| `SBX-IMP-BOUNDARY-POLICY-CYCLE-001` | `07` Step 6 required reads / phase boundary复核 | Step 17字段闭环表仍把policy summary列为BoundaryRequirementSet来源。 | 改为accepted context、active identity、explicit requirements、I039 / I040、LD-24 generation和capability;policy继续作为后序decision owner。 | `CB-SBX-05A/05B`不依赖`CB-SBX-06A/06B`;`CB-SBX-07A`才同时消费boundary与policy。 |
