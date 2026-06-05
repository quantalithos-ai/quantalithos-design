# L1-work 07 实施计划 Step 1: 确认实施输入边界

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-work/07-实施计划.md` §1 与上游文档的关系声明
> 状态: `[x] 已完成`
> 日期: 2026-06-04

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 1 |
| 主题 | 确认实施输入边界 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-work/design-calibration/07_implementation_plan_step_01_input_boundary.md` |

本步确认 L1-work 是否具备制定实施计划所需的上游输入,并识别输入缺口、风险和后续 Step 的检查项。本步不创建或修改正式 `07-实施计划.md`,不拆分实施阶段,不定义 commit boundary。

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `00-需求文档.md` | 需求基线 / 2026-06-02 | 提供仓定位、C-1~C-5、`FR-WORK-*`、`BR-WORK-*`、`AC-WORK-*`、`VF-WORK-*` 和非目标 |
| `01-架构设计.md` | v1.0 / 已按新版架构 SOP 重建 | 提供职责边界、依赖方向、数据所有权、唯一编译期依赖、运行期接缝和架构红线 |
| `02-概要设计.md` | v1.0.0 / Draft | 提供代码主体框架、主要组成部分、对象候选、接口骨架、处理流和状态集合 |
| `03-详细设计.md` | v1.0.0 / 已审核收口 | 提供目标实现仓、crate / module / object / trait / API / flow / state / persistence / error / config / test slices |
| `04-配置设计.md` | v0.1.0 / Draft | 提供 `WorkRuntimeConfig` 承接、配置来源、profile、配置项、secret ref、fail-fast / fail-closed 和下游承接 |
| `05-测试方案.md` | v0.2.0 / Draft | 提供 `TC-WORK-*`、`EV-WORK-*`、suite、fixture、automation gate、report 和 regression 口径 |
| `06-验收标准.md` | v1.0.0 / Draft | 提供 `AC-WORK-*`、`VF-WORK-*`、红线、缺陷、风险接受和最终裁决口径 |
| `standards/document/实施计划书写规范.md` | 已读取 | 约束正式实施计划结构、阶段、提交边界、测试证据和 commit 规范 |
| `standards/document/实施计划讨论流程_SOP.md` | 已读取 | 约束 Step 执行顺序和中间产物输出 |
| `standards/document/子项目目录与代码文件组织规范.md` | 已确认存在 | 后续 Step 3 / Step 4 检查实现仓目录、workspace member、package、crate、binary 和 scripts / reports |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已确认存在 | 后续 Step 3 / Step 8 检查本地 sibling repo 和 dependency 类型 |
| `standards/coding/rust.md` | 已确认存在 | 后续 Step 3 纳入编码规范阅读清单 |

## 3. SOP 问题回答

### 3.1 当前仓是否已经具备完整的 00 / 01 / 02 / 03 / 05 / 06 文档?

具备。当前还额外具备 `04-配置设计.md`,且 `04` 已被 `05` 和 `06` 作为配置、profile、secret、reports / artifacts、redaction 和 failure mode 的输入来源。正式 `07-实施计划.md` 已按新版生成;本 Step 撰写时“尚未创建”仅为历史诊断。

### 3.2 哪些上游文档版本是本轮实施计划的基线?

本轮以当前工作树中的 `00~06` 正式文档作为实施计划校准基线。已有版本字段的文档按版本记录;没有明确版本字段的文档按当前 Draft / 校准完成状态记录。最终交给实现 agent 前,design repo 必须提交并给出固定 design commit hash,不能要求实现者依据未提交工作树开发。

### 3.3 详细设计是否已经足以支持 1:1 实现?

足以支持制定实施计划。`03-详细设计.md` 已明确:

- 目标实现仓:`/home/aris/Projects/quantalithos-work`。
- 实现形态:Rust 2024 workspace 多 crate。
- 实现单元:`contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`。
- package / crate 命名:`work-<role>` / `work_<role>`。
- 唯一编译期依赖:`core-contracts = { path = "../quantalithos-core/crates/contracts" }`。
- 运行期或事件协作依赖不得写成 Cargo path dependency。
- 对象契约、trait / port / adapter、协议、函数流、状态、事务、错误、配置、观测和测试切口已在正式 `03` 及 `03_ddd_*` 中收稳。

但目标实现仓当前不存在;这不阻塞实施计划制定,但会成为 Step 3 前置检查和 Step 5 初始建仓 / workspace 初始化阶段的输入。

### 3.4 测试方案和验收标准是否足以定义阶段门禁?

足够。`05-测试方案.md` 已定义 `TC-WORK-*`、`EV-WORK-*`、suite、test data、environment config、automation gates、reports、defects 和 regression 风险。`06-验收标准.md` 已定义 `AC-WORK-*`、`VF-WORK-*`、红线、接口 / 事件 / job sync、状态 / 事务 / 幂等、NFR、证据、veto、缺陷、风险接受和最终结论口径。实施计划必须把这些门禁嵌入每个阶段,不能把测试和验收留到最后。

### 3.5 是否存在上游文档之间的冲突?

未发现阻塞制定实施计划的正式文档冲突。需要在后续 Step 持续保持以下一致性:

- 正式实现以 `03-详细设计.md` 和对应 `03_ddd_*` 为实现真相源。
- 只有 `quantalithos-core/crates/contracts` 是编译期 path dependency。
- `L0-bus`、`L0-sdk`、`L1-identity`、`L1-conversation`、`L3-method-library`、`L1-process`、`L1-governance`、`L1-artifact`、`L2-runtime`、`L1-workspace`、`L4-observability` 和 `L4-archive` 均不得写成 Cargo path dependency。
- reports / artifacts 路径不得带 `<project>` 层级,不得使用 `latest`。
- design 仓文档可以使用中文;实现仓源码、rustdoc、测试名和 commit message 必须使用英文。

### 3.6 详细设计是否已经完成字段闭环、DTO 构造闭环、状态闭环和 phase boundary 复核?

已具备制定实施计划所需的闭环输入。详细设计已通过:

- `03_ddd_step_06_object_contracts.md` 提供对象字段、不变量、policy、value object 和 enum 注释来源。
- `03_ddd_step_08_protocol_contracts.md` 提供 Command / Query / Consumer / Event / Job 字段闭环和 DTO 构造来源。
- `03_ddd_step_10_state_matrix.md` 提供正式状态名和合法 / 非法迁移来源。
- `03_ddd_step_11_persistence_transaction_consistency.md`、`03_ddd_step_12_error_recovery.md`、`03_ddd_step_13_concurrency_idempotency.md` 提供事务、错误、幂等和并发门禁。
- `03_ddd_step_16_test_cuts.md` 提供实现阶段测试切口。
- `03_ddd_step_17_implementation_handoff.md` 提供详细设计到实施计划承接清单。

实施计划仍必须在每个 phase / commit boundary 开工前复核字段、DTO、状态、测试、验收和 phase boundary。如果实现者发现正式 `03` 与 `design-calibration` 不一致,必须先以正式 `00~07` 为准;仍无法落码时暂停并回报设计缺口。

### 3.7 测试方案和验收标准是否使用详细设计正式字段、状态、接口和证据名称?

是。`05` 与 `06` 已按新版详细设计主线重建,使用 `Project`、`ProjectMember`、`Backlog`、`WorkItem`、child WorkItem、`WorkDependency`、`WorkBlocker`、`Iteration`、`IterationCommitment`、promote / formalize、projection / reference / outbox / handoff 等正式主语,并使用 `TC-WORK-*`、`EV-WORK-*`、`AC-WORK-*`、`VF-WORK-*` 作为测试和验收编号。它们不应回到旧 `domain/work/README.md` 的未校准口径或旧文档口径。

### 3.8 哪些缺口会阻塞实施计划,哪些缺口可以记录为风险继续推进?

当前没有阻塞 Step 2 的文档缺口。风险和待收束项包括:

- `07-实施计划.md` 已按新版生成;本项历史风险已关闭。
- 目标实现仓 `/home/aris/Projects/quantalithos-work` 当前不存在。
- `/home/aris/Projects/quantalithos-core/crates/contracts` 已存在,当前 core commit 为 `ef0d24941fe6e00c24d423ac330347e6e1acb2da`,后续 Step 3 / 交接前仍需固定基线。
- design repo 当前 `L1-work` 文档仍有未提交改动,最终实现交接前必须固定 design commit。
- 真实 bus、sdk、identity、conversation、method-library、process、governance、artifact、runtime、workspace、observability、archive 未就绪不阻塞本仓 P0,但必须作为 controlled seam / risk acceptance 处理。

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 正式 `07-实施计划.md` 尚不存在 | `projects/L1-work` 下没有 `07-实施计划.md` | 实施者没有统一编码路径 | 本轮按 SOP 从中间产物开始生成 |
| 目标实现仓尚未创建 | `/home/aris/Projects/quantalithos-work` 当前不存在 | 后续 agent 无法直接进入实现目录 | Step 3 固定前置检查,Step 5 规划初始建仓 / workspace 初始化 |
| design repo 尚未提交固定基线 | L1-work 文档存在未提交改动 | 实现 agent 若读取未提交状态,后续难以复查 | Step 3 / Step 11 要求交接前固定 design commit |
| 稳定编译期依赖需要复查 | `core-contracts` 是唯一 path dependency | 版本漂移会影响编译和契约一致性 | Step 3 固定 `/home/aris/Projects/quantalithos-core/crates/contracts` 和 commit |
| design-calibration 资料量大 | 已有 00~06 大量中间产物 | 实施者不知道哪些必须读 | Step 3 建立阶段 / commit boundary 阅读矩阵 |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 实施计划入口 | 无正式 `07`,也无 `07` 工作台 | 新建 `07_implementation_plan_calibration_flow.md` 和 Step 1 中间产物 | 可按 SOP 推进 |
| 输入边界 | 依赖散落在 `00~06` | 明确 `00~06` + `04` 均为本轮输入基线 | 防止漏读配置、测试和验收 |
| 详细设计可实现性 | 需要人工判断 | 明确 `03` 足以支撑实施计划,但实现仓状态需后续检查 | 可继续 |
| 测试 / 验收门禁 | 可能最后统一测试 | 明确 `05` / `06` 必须嵌入阶段门禁 | 保证可验证增量 |
| 风险分类 | 未归类 | 文档缺口无 blocker,实现仓和 commit 固定进入后续 Step | 可控推进 |

## 6. 实施计划取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 是否在 Step 1 直接规划阶段 | 直接规划 | 只确认输入边界,阶段规划留到 Step 5 | B | 遵守逐 Step 规则 |
| 目标实现仓不存在是否阻塞 | 阻塞实施计划 | 记录为 Step 3 / Step 5 前置和初始阶段输入 | B | 实施计划可以定义建仓和初始化 |
| 是否把 `04-配置设计.md` 纳入输入 | 不纳入 | 纳入 `00~06` 全链路 | B | 配置已影响 03、05、06 的 P0 门禁 |
| 是否全量要求阅读 `design-calibration` | 全量必读 | Step 3 按 phase / commit boundary 建阅读矩阵 | B | 降低实施者负担,同时保留追溯 |
| 是否等 design commit 固定后再继续 | 暂停 | 继续生成计划,交接前固定 commit | B | 文档可先制定,真实实现必须固定基线 |

## 7. 结构化中间产物

### 7.1 实施输入边界表

| 上游文档 | 版本 / 路径 | 本计划如何使用 | 状态 | 风险 |
|---|---|---|---|---|
| `00-需求文档.md` | 需求基线 / `projects/L1-work/00-需求文档.md` | 确定仓定位、核心能力、FR / BR / AC / VF、边界和红线 | 已确认 | 最终交接前需固定 design commit |
| `01-架构设计.md` | v1.0 / `projects/L1-work/01-架构设计.md` | 确定职责边界、依赖方向、数据所有权和架构风险 | 已确认 | 无阻塞 |
| `02-概要设计.md` | v1.0.0 / `projects/L1-work/02-概要设计.md` | 确定代码主体框架、组成部分、对象、接口、流程和状态轮廓 | 已确认 | 无阻塞 |
| `03-详细设计.md` | v1.0.0 / `projects/L1-work/03-详细设计.md` | 作为实施阶段、代码批次、模块、接口、状态、事务和测试切口直接输入 | 已确认 | 目标实现仓需 Step 3 检查 |
| `04-配置设计.md` | v0.1.0 / `projects/L1-work/04-配置设计.md` | 作为配置 loader、validator、runtime graph、profile 和失效模式实施输入 | 已确认 | 无阻塞 |
| `05-测试方案.md` | v0.2.0 / `projects/L1-work/05-测试方案.md` | 定义每阶段测试门禁、证据归档、缺陷复验和报告路径 | 已确认 | 真实 gate command 实施期固定 |
| `06-验收标准.md` | v1.0.0 / `projects/L1-work/06-验收标准.md` | 定义每阶段验收门禁、一票否决、风险接受和完成判定 | 已确认 | 真实 run_id / handoff 实施期固定 |

### 7.2 设计闭环复核表

| 闭环复核项 | 来源 | 状态 | 阻塞范围 | 处理 |
|---|---|---|---|---|
| 字段闭环 | `03-详细设计.md` §6;`03_ddd_step_06_object_contracts.md` | 已足以制定计划 | 无 | Phase 开工前复读对应校准来源 |
| DTO 构造闭环 | `03-详细设计.md` §7;`03_ddd_step_08_protocol_contracts.md` | 已足以制定计划 | 无 | Commit boundary 开工前复核 request / result / error / metadata |
| 状态闭环 | `03-详细设计.md` §9;`03_ddd_step_10_state_matrix.md`;`06-验收标准.md` §8 | 已足以制定计划 | 无 | 测试和实现必须使用正式 enum variant |
| 事务 / 一致性闭环 | `03-详细设计.md` §10~§13 | 已足以制定计划 | 无 | Phase 任务拆分时嵌入 UnitOfWork、idempotency 和 rollback 门禁 |
| 测试 / 验收闭环 | `05-测试方案.md`;`06-验收标准.md` | 已足以制定计划 | 无 | Step 7 按阶段嵌入 TC / EV / AC |
| Phase boundary 闭环 | `03_ddd_step_17_implementation_handoff.md`;`06` §12~§14 | 待实施计划拆分后逐阶段确认 | PH / commit boundary | Step 5 / Step 6 / Step 7 继续收束 |

### 7.3 缺失输入风险表

| 风险 ID | 风险 | 分类 | 处理口径 |
|---|---|---|---|
| R-IMPL-WORK-001 | 正式 `07-实施计划.md` 尚不存在 | expected-gap | 本轮按 SOP 生成,不阻塞 |
| R-IMPL-WORK-002 | 目标实现仓 `/home/aris/Projects/quantalithos-work` 当前不存在 | risk | Step 3 明确建仓 / 初始化检查,Step 5 规划初始阶段 |
| R-IMPL-WORK-003 | `quantalithos-core` contracts 需要固定 sibling path 和 commit | risk | Step 3 检查 `/home/aris/Projects/quantalithos-core/crates/contracts` 和 commit |
| R-IMPL-WORK-004 | design repo 当前未提交固定 L1-work 设计基线 | risk | Step 11 / 实现交接前固定 design commit |
| R-IMPL-WORK-005 | `design-calibration` 资料量大 | risk | Step 3 按阶段 / commit boundary 建阅读矩阵 |
| R-IMPL-WORK-006 | 真实相邻仓未全部实现或未联调 | accepted-readiness-risk | P0 使用 controlled seam,真实联调进风险接受 |

### 7.4 是否允许继续结论

| 结论项 | 判定 |
|---|---|
| 上游正式文档是否齐全 | 是 |
| 详细设计是否足以支撑实施计划 | 是 |
| 测试方案是否足以支撑阶段门禁 | 是 |
| 验收标准是否足以支撑完成判定 | 是 |
| 是否存在必须先回到 `00~06` 修文档的 blocker | 否 |
| 是否允许进入 Step 2 | 是 |

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §1。

```markdown
## 1. 与上游文档的关系声明

> 校准来源:
> - `design-calibration/07_implementation_plan_step_01_input_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“实施输入边界表”“设计闭环复核表”“缺失输入风险表”和“是否允许继续结论”小节,了解本实施计划为什么可以基于当前 `00~06` 继续展开。

本实施计划承接 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md` 和 `06-验收标准.md`。其中 `03-详细设计.md` 是直接实现输入,`05-测试方案.md` 和 `06-验收标准.md` 分别定义阶段测试门禁和实施完成判定。

本文不重新定义需求、架构、对象、协议、配置 schema、测试用例或验收门禁。若实施过程中发现上游设计缺口,必须暂停对应阶段并回到相应文档校准。
```

## 9. 待确认事项

无阻塞进入 Step 2 的待确认事项。

后续必须继续收口:

- Step 3 固定 `/home/aris/Projects/quantalithos-work` 建仓 / 初始化前置条件。
- Step 3 固定 `quantalithos-core` sibling dependency 与 `core-contracts` path dependency 检查。
- Step 3 建立阶段实施前阅读矩阵,不要求实现者全量阅读整个 `design-calibration/`。
- Step 11 / 实现交接前固定 design repo commit,避免实现者依据未提交设计工作树开发。

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 上游输入基线明确 | 已满足 |
| 缺失或冲突项已分类为 blocker / risk / deferred | 已满足 |
| 已确认不存在阻塞制定实施计划的文档缺口 | 已满足 |
| 已形成实施输入边界表 | 已满足 |
| 已形成设计闭环复核表 | 已满足 |
| 已形成缺失输入风险表 | 已满足 |

结论:可以进入 Step 2,明确实施目标、范围和非范围。
