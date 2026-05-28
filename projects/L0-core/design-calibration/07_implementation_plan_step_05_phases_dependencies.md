## Step 5. 设计实施阶段与依赖顺序

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 5
- 回填章节：`07-实施计划.md` §5 实施阶段与依赖顺序

### 2. 本步输入

- 上游文档：
  - `projects/L0-core/03-详细设计.md` §4 / §5 / §7 / §8 / §10 / §13 / §15 / §16
  - `projects/L0-core/04-配置设计.md` §7 / §9 / §12
  - `projects/L0-core/05-测试方案.md` §6 / §9 / §13
  - `projects/L0-core/06-验收标准.md` §5 / §6 / §7 / §8 / §10
- 已确认结论：
  - 本轮交付物围绕 P0 契约来源仓闭环组织，不按对象索引机械拆分。
  - 真实 L0-bus、L0-sdk、L1+ 联调不是本轮交付物，只交付 boundary / fake / 可消费接缝。
  - 测试 suite、fixture 和 evidence index 是实施交付物的一部分。
- 依赖的前序 Step：
  - `07_implementation_plan_step_04_deliverables.md`

### 3. SOP 问题回答

1. 最小可运行或可测试的纵切是什么。

   回答：最小可测试纵切是 `CreateContractDraft` 写路径：DTO -> domain scope / boundary policy -> application service -> idempotency -> file repository -> audit append -> outbox append -> receipt。该纵切不要求发布、snapshot 或真实 bus，但必须证明 contracts、domain、application、infra、config 和测试 fixture 已能贯通。

2. 哪些阶段必须先于其他阶段。

   回答：workspace、DTO、配置、测试 harness 和 fake adapter 必须先于任何业务纵切；草稿写路径必须先于评审 / 发布；发布基线必须先于 snapshot、fact、trace 和 release gate；读面 / projection 可在草稿写路径后启动，但 package / sample / trace 的完整验收依赖发布与快照；后台 job 和 outbox relay 依赖 baseline、snapshot、outbox 和 fake publisher。

3. 哪些风险或跨仓依赖需要前置。

   回答：真实 L0-bus、L0-sdk、L1+、审批系统、外部 toolchain 和观测归档都不能作为 P0 前置阻塞项。需要前置的是 fake publisher、fake gate、fake reference resolver、fake toolchain runner、状态根 fixture、JSON profile 和 evidence index 逻辑结构，否则后续阶段无法独立验证。

4. 每个阶段完成后能验证什么。

   回答：PH-01 验证 workspace、DTO、配置和测试基础；PH-02 验证 draft truth 写入、幂等、audit / outbox 原子边界；PH-03 验证 review、publish、baseline、gate fail 和生命周期；PH-04 验证 query、projection stale、trace、package view 和 guide sample；PH-05 验证 validate / derive / rebuild / recalculate / publish fact job 和 relay boundary；PH-06 验证最小闭环、证据索引、红线和 release gate。

5. 是否存在按对象拆分而不可验证的阶段。

   回答：存在风险。例如单独实现 `ContractDefinition`、`ContractReleaseBaseline`、`OutboxPort` 或某个 crate 都不能证明 P0 能力成立。因此阶段必须以可验证能力命名，并在阶段内组合对象、接口、adapter 和测试。

6. 哪些阶段可以并行，哪些不能并行。

   回答：PH-01 必须最先完成。PH-02 是第一条业务纵切，不能被 PH-03~PH-06 跳过。PH-04 的基础 query skeleton 可在 PH-02 后与 PH-03 部分并行，但 trace / package / sample 的验收依赖 PH-03。PH-05 的 job skeleton 可在 PH-03 后与 PH-04 部分并行，但 snapshot / fact / relay 完整验收依赖发布基线和 outbox。PH-06 只能最后执行。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `07-实施计划.md` | 尚未创建 §5 阶段与依赖顺序 | 后续 Step 6 无法拆任务和提交边界 |
| Step 4 交付物清单 | 已列出交付物，但还没有实施顺序 | 交付物可能被实现者按文件或 crate 随意落地 |
| `03-详细设计.md` §5 | 模块依赖清楚，但不是实施阶段 | 不能把模块图直接当阶段图 |
| `05-测试方案.md` §9 | 自动化门禁按 PR/main/nightly/release gate 定义 | 需要映射到每个实施阶段，不应最后统一测试 |
| 外部依赖 | 多个交付物面向 L0-bus / L0-sdk / L1+ | 需要在阶段中前置 fake / boundary，避免真实联调阻塞 P0 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 阶段划分 | 只有交付物清单 | 形成 PH-01~PH-06 的可验证阶段 | 实施计划需要说明先后顺序 |
| 最小纵切 | 未明确 | 明确 `CreateContractDraft` 是第一条业务纵切 | 先证明端到端基础能力，再扩展发布和读面 |
| 测试门禁 | 只存在测试方案中 | 每个阶段绑定 suite / TC / EV | 防止测试后置 |
| 外部依赖 | 只列为非交付物或 boundary | 在 PH-01 前置 fake / stub adapter | 后续阶段可独立验证 |
| 并行策略 | 未说明 | 允许 PH-04 / PH-05 局部并行，但验收受依赖约束 | 提高实施效率但不破坏顺序 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按 crate 排阶段：contracts -> domain -> application -> infra -> cli -> jobs | 与文件布局一致 | 每阶段不可独立验收，容易变成对象/文件驱动 | 不采用 |
| 按完整业务闭环一次性实现 | 最终路径完整 | 阶段过大，review、回退和定位困难 | 不采用 |
| 按可验证功能增量推进 | 每阶段有门禁，可独立 review 和回退 | 需要阶段内跨 crate 同步实现 | 采用 |
| 把测试集中到最后 | 前期编码速度快 | 无法证明阶段完成，返工风险高 | 不采用 |
| 将测试和 evidence 嵌入每阶段 | 阶段完成可判定 | 每阶段需要维护测试输入和证据 | 采用 |

### 7. 结构化中间产物

#### 7.1 阶段依赖图: L0-core 实施阶段顺序

```text
[PH-01 基础骨架与协议/配置门禁]
  | enables workspace, DTO, config, fake adapters
  v
[PH-02 契约草稿写路径最小纵切]
  | establishes truth + audit + outbox + idempotency
  v
[PH-03 评审、发布基线与生命周期]
  | establishes Published / Released baseline
  v
[PH-04 查询、投影、追溯与消费视图]
  | consumes truth / baseline / projection
  v
[PH-05 后台作业、快照、事实与 relay boundary]
  | derives snapshot and publishes recoverable facts
  v
[PH-06 最小闭环、证据与 release gate 收口]
```

关键说明：
- 图表达阶段依赖顺序，不表达完整函数调用链。
- PH-04 与 PH-05 的部分脚手架可以并行，但完整验收必须遵守图中的依赖。
- 每个阶段都必须有测试门禁，不能把测试统一后置到 PH-06。

#### 7.2 阶段总表

| 阶段编号 | 阶段名称 | 实施目标 | 依赖阶段 | 核心交付物 | 阶段门禁 |
|---|---|---|---|---|---|
| PH-01 | 基础骨架与协议 / 配置门禁 | 建立 workspace、DTO、配置加载、fixture、fake adapter 和基础测试门禁 | 无 | workspace、contracts DTO、CoreRuntimeConfig、test harness、fake ports | `fmt_lint_suite`、`dto_schema_contract_suite`、`config_smoke_suite` 初版 |
| PH-02 | 契约草稿写路径最小纵切 | 打通 create/update draft 的 truth、幂等、audit、outbox 和 receipt | PH-01 | `ContractDefinition`、scope / boundary policy、command service、file repository、audit/outbox/idempotency store | `TC-SCOPE-*`、`TC-CMD-001~002`、`TC-IDEM-*`、`TC-OUTBOX-001` |
| PH-03 | 评审、发布基线与生命周期 | 打通 submit、publish、gate fail、baseline released 和生命周期终态保护 | PH-02 | review / publish commands、release baseline、gate fake、compatibility status、lifecycle event | `TC-CMD-003~006`、release gating、EV-AUDIT-001 |
| PH-04 | 查询、投影、追溯与消费视图 | 提供 P0 query、stale projection、trace、package view 和 guide sample | PH-02；完整验收依赖 PH-03 | query API、read model、trace projection、package/sample view | `TC-QUERY-001~003`、`TC-QUERY-007~008`、EV-SVC-001、EV-TRACE-001 |
| PH-05 | 后台作业、快照、事实与 relay boundary | 打通 validate、derive snapshot、rebuild、recalculate、publish fact 和 relay boundary | PH-03；部分依赖 PH-04 projection | job binaries、snapshot store、fact record、outbox relay、fake publisher | `TC-JOB-001~005`、`TC-OUTBOX-002`、EV-WORKER-001、EV-CONTRACT-002 |
| PH-06 | 最小闭环、证据与 release gate 收口 | 跑通 draft -> review -> publish -> snapshot -> query -> fact -> relay，补齐证据和红线扫描 | PH-01~PH-05 | E2E fixture、evidence index、redline scans、handoff note | `TC-E2E-001`、EV-E2E-001、EV-SEC-*、release gate |

#### 7.3 阶段顺序理由表

| 顺序 | 理由 |
|---|---|
| PH-01 必须先做 | 没有 workspace、DTO、config、fixture 和 fake adapter，后续无法稳定编译或测试 |
| PH-02 是第一条业务纵切 | draft 写路径能最早验证 truth、audit、outbox、idempotency 和 repository 原子边界 |
| PH-03 在 PH-02 之后 | 发布和生命周期依赖已有 definition truth 与 command orchestration |
| PH-04 在 PH-02 之后启动 | 查询至少需要 truth；trace、package、sample 的完整价值依赖 PH-03 的发布基线 |
| PH-05 在 PH-03 之后 | snapshot、fact 和 job 的输入来自 released baseline、definition 和 outbox |
| PH-06 最后执行 | release gate 需要所有 P0 / P0-min 能力、证据和红线门禁均已具备 |

#### 7.4 并行与禁止并行表

| 项 | 是否可并行 | 条件 |
|---|---|---|
| PH-01 与其他阶段 | 否 | PH-01 是所有阶段的基础 |
| PH-02 与 PH-03 | 否 | PH-03 依赖 PH-02 的 truth 和 command shell |
| PH-04 query skeleton 与 PH-03 | 可部分并行 | PH-02 完成后可做 basic query；trace / package / sample 验收等待 PH-03 |
| PH-05 job skeleton 与 PH-04 | 可部分并行 | PH-03 完成后可做 job shell；projection / trace 相关验收等待 PH-04 |
| PH-06 与任何阶段 | 否 | PH-06 是全链路收口和 release gate |

### 8. 回填草稿

以下内容回填到正式 `07-实施计划.md` §5。

````md
## 5. 实施阶段与依赖顺序

> 校准来源：
> - `design-calibration/07_implementation_plan_step_05_phases_dependencies.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“阶段依赖图”“阶段总表”“阶段顺序理由表”和“并行与禁止并行表”小节，了解本轮为什么按可验证功能增量排序。

本轮实施阶段按可验证功能增量推进，不按 crate、对象、函数或文件裸拆。最小业务纵切是 `CreateContractDraft` 写路径：DTO -> domain policy -> application service -> idempotency -> repository -> audit -> outbox -> receipt。

```text
[PH-01 基础骨架与协议/配置门禁]
  v
[PH-02 契约草稿写路径最小纵切]
  v
[PH-03 评审、发布基线与生命周期]
  v
[PH-04 查询、投影、追溯与消费视图]
  v
[PH-05 后台作业、快照、事实与 relay boundary]
  v
[PH-06 最小闭环、证据与 release gate 收口]
```

| 阶段编号 | 阶段名称 | 实施目标 | 依赖阶段 | 核心交付物 | 阶段门禁 |
|---|---|---|---|---|---|
| PH-01 | 基础骨架与协议 / 配置门禁 | 建立 workspace、DTO、配置加载、fixture、fake adapter 和基础测试门禁 | 无 | workspace、contracts DTO、CoreRuntimeConfig、test harness、fake ports | fmt/lint、DTO roundtrip、config smoke |
| PH-02 | 契约草稿写路径最小纵切 | 打通 create/update draft 的 truth、幂等、audit、outbox 和 receipt | PH-01 | definition、policy、command service、repository、audit/outbox/idempotency store | scope、draft command、idempotency、outbox atomics |
| PH-03 | 评审、发布基线与生命周期 | 打通 submit、publish、gate fail、baseline released 和生命周期保护 | PH-02 | review/publish command、release baseline、gate fake、lifecycle event | publish / gate / lifecycle tests |
| PH-04 | 查询、投影、追溯与消费视图 | 提供 query、stale projection、trace、package view 和 guide sample | PH-02；完整验收依赖 PH-03 | query API、read model、trace projection、package/sample view | query / trace / sample tests |
| PH-05 | 后台作业、快照、事实与 relay boundary | 打通 P0 jobs、snapshot、fact 和 relay boundary | PH-03；部分依赖 PH-04 | job binaries、snapshot store、fact record、outbox relay | worker job、relay boundary tests |
| PH-06 | 最小闭环、证据与 release gate 收口 | 跑通最小闭环并补齐证据、红线和交付说明 | PH-01~PH-05 | E2E fixture、evidence index、redline scans、handoff note | E2E、security/redline、release gate |
````

### 9. 待确认事项

- PH-04 和 PH-05 的局部并行必须在 Step 6 拆任务时明确到具体批次，不能在阶段层面伪装成无依赖。
- 目标实现仓如果已有 CI job 命名，阶段门禁名称需要在 Step 7 与实际命令对齐。
- PH-06 是否包含首次 NFR baseline，取决于 Step 9 / Step 12 对 release gate 风险的裁决。

建议方案：接受 PH-01~PH-06 阶段顺序。原因是它先建立基础和最小写路径，再逐步扩展发布、读面、作业与证据收口，既保持功能增量可验证，也避免对象导向拆分。

### 10. 进入下一步条件

- 阶段顺序已明确为 PH-01~PH-06。
- 每个阶段均有依赖、核心交付物和阶段门禁。
- 最小可测试纵切已明确为 `CreateContractDraft` 写路径。
- 可以进入 Step 6，继续拆分阶段任务、编写顺序与提交边界。
