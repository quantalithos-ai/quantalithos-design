# L0-sdk 07 实施计划 Step 1: 实施输入边界

> 本文件是 `projects/L0-sdk/07-实施计划.md` 的 Step 1 中间产物。
> 本步确认 L0-sdk 是否具备制定实施计划所需的上游输入,并识别输入缺口、风险和后续 Step 的检查项。
> 本步不创建或修改正式 `07-实施计划.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 1 |
| 主题 | 确认实施输入边界 |
| 状态 | 已确认 |
| 正式回填位置 | `07-实施计划.md` §1 |
| 是否修改正式 `07-实施计划.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `00-需求文档.md` v0.2.0 | 已存在 | 提供官方三语言客户端接入层定位、P0 范围、F-001~F-010 和一票否决来源 |
| `01-架构设计.md` v0.2.0 | 已存在 | 提供 official client access layer、跨仓依赖方向、运行边界和数据所有权 |
| `02-概要设计.md` v0.2.0 | 已存在 | 提供代码主体框架、主要组成部分、关键对象、接口、流程、状态和配置影响轮廓 |
| `03-详细设计.md` v0.2.0 | 已存在 | 提供实现仓、workspace、crate、package、对象、trait、API / Event / Job、状态、事务、错误、配置和测试切口 |
| `04-配置设计.md` v0.1.0 | 已存在 | 提供 JSON 配置、profile、cross-repo path、runtime graph、加载校验和 forbidden toggle |
| `05-测试方案.md` v0.2.0 | 已存在 | 提供测试对象、用例、自动化门禁、证据归档、缺陷复验和残余风险 |
| `06-验收标准.md` v0.2.0 | 已存在 | 提供验收范围、门禁、一票否决、缺陷分级、风险接受和签署口径 |
| `standards/document/实施计划书写规范.md` | 已读取 | 约束正式实施计划结构、阶段、提交边界、测试证据和 commit 规范 |
| `standards/document/实施计划讨论流程_SOP.md` | 已读取 | 约束 Step 执行顺序和中间产物输出 |

---

## 3. SOP 问题回答

### 3.1 当前仓是否已经具备完整的 00 / 01 / 02 / 03 / 05 / 06 文档?

具备。当前还额外具备 `04-配置设计.md`,并且 L0-sdk 的 `03`、`05`、`06` 均已经把配置加载、profile、cross-repo contracts path、runtime graph、artifact / reports path 和 fail-fast / fail-closed 作为 P0 实施门禁的一部分。因此 `04` 必须纳入实施计划输入。

### 3.2 哪些上游文档版本是本轮实施计划的基线?

本轮以 `00` v0.2.0、`01` v0.2.0、`02` v0.2.0、`03` v0.2.0、`04` v0.1.0、`05` v0.2.0、`06` v0.2.0 为实施计划输入基线。

### 3.3 详细设计是否已经足以支持 1:1 实现?

基本足够。`03-详细设计.md` 已明确:

- 目标实现仓: `/home/aris/Projects/quantalithos-sdk`。
- 稳定上游: `/home/aris/Projects/quantalithos-core` 和 `/home/aris/Projects/quantalithos-bus`。
- 编译期依赖: `core-contracts = { path = "../quantalithos-core/crates/contracts" }` 和 `bus-contracts = { path = "../quantalithos-bus/crates/contracts" }`。
- workspace / crate / Python package / TypeScript package / scripts / artifacts / reports 目录。
- 对象、trait、API、event、job、处理流、状态机、事务、一致性、错误、配置和测试切口。

但实施前仍需在 Step 3 检查目标实现仓是否存在、core / bus contracts path dependency 是否可用、git config 是否合格、Rust / Python / TypeScript 工具链和编码规范是否已确认。

### 3.4 测试方案和验收标准是否足以定义阶段门禁?

足够。`05-测试方案.md` 已定义 `TC-SDK-*`、`SPECIAL-SDK-*`、`EV-SDK-*`、gate scripts、report scripts、check scripts、`artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance`。`06-验收标准.md` 已定义 `AC-FUNC-*`、`AC-BOUND-*`、`AC-RED-*`、`AC-IF-*`、`AC-STATE-*`、`AC-NFR-*`、`AC-EV-*`、`VETO-SDK-*`、缺陷分级、风险接受和签署口径。

### 3.5 是否存在上游文档之间的冲突?

未发现阻塞性冲突。当前主要需要在实施计划中保持以下一致性:

- 实现仓不是 design 仓,源码标识符、rustdoc、普通注释、测试名和 commit message 必须使用英文。
- L0-sdk 的目标实现仓是 `/home/aris/Projects/quantalithos-sdk`,当前目录已存在,但仅有 git shell,仍需 PH-01 初始化 workspace、packages、scripts、artifacts 和 reports。
- `L0-core` 和 `L0-bus` 的 contracts 是已确认编译期 path dependency,但不得依赖 core / bus domain crate。
- L1/L2/L3/L4 服务仓是运行期依赖或人工查阅位置,不得写成本地 Cargo path dependency。
- public registry、production endpoint 全量覆盖、real credential provider、remote config / hot reload 和 full service client coverage 不进入 P0。
- reports / artifacts 路径不得带 `<project>` 层级,不得使用 `latest`。

### 3.6 详细设计是否已经完成字段闭环、DTO 构造闭环、状态闭环和 phase boundary 复核?

已经足以进入实施计划讨论。`03` 已明确 DTO、Command / Query / Event / Job、状态 enum、事务、错误、幂等、配置绑定和最小测试切口。已知风险主要是 Python / TypeScript 工具链、真实 package build / smoke 工具链和目标实现仓尚未完成 workspace 初始化,这些属于 Step 3 / Step 8 / Step 9 继续收束的实施前置项,不阻塞 Step 2。

### 3.7 测试方案和验收标准是否使用详细设计正式字段、状态、接口和证据名称?

是。`05` / `06` 已使用 `SnapshotFreshnessState`、`CapabilitySupportState`、`PackageCandidateStatus`、`EvidenceResult`、`EvidenceRedactionStatus`、`CompatibilityDecisionState`、`DeprecatedApiLifecycleState`、`TC-SDK-*`、`EV-SDK-*`、`AC-*` 和 `VETO-SDK-*` 等正式名称。`06` §8 明确禁止 `Built`、`Published`、candidate `Rejected` 等状态漂移。

### 3.8 哪些缺口会阻塞实施计划,哪些缺口可以记录为风险继续推进?

没有阻塞制定实施计划的文档缺口。目标实现仓 `/home/aris/Projects/quantalithos-sdk` 当前已存在,但尚未形成可编译 workspace,这不阻塞继续写实施计划,但会影响 Step 3 和 Step 5 之后的实施前置条件:PH-01 必须明确 workspace、package、scripts、artifacts 和 reports 初始化步骤。

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 正式 `07-实施计划.md` 尚不存在 | `projects/L0-sdk` 下没有 `07-实施计划.md` | 实施者没有统一编码路径 | 本轮按 SOP 从中间产物开始生成 |
| 上游文档均为 Draft | `00~06` 状态多为 Draft | 可能被误解为不能进入实施计划 | 作为设计校准完成基线使用,不阻塞实施计划 |
| 目标实现仓仅有 git shell | `/home/aris/Projects/quantalithos-sdk` 当前已存在,但缺少 workspace / package / scripts / evidence 结构 | Step 3 需要明确初始化前置条件 | 记录为前置检查,不在 Step 1 展开 |
| 上游 contracts path 需要复查 | `/home/aris/Projects/quantalithos-core`、`/home/aris/Projects/quantalithos-bus` 当前存在 | contracts crate 名称和 commit 漂移会影响编译 | Step 3 固定 dependency snapshot |
| 三语言工具链未完全固定 | Rust / Python / TypeScript package build 和 smoke 涉及多工具链 | 可能影响 candidate build 阶段 | Step 3 / Step 8 / Step 9 作为工具链前置与 Spike |
| design-calibration 资料量大 | `design-calibration` 中已有 00~06 大量文件 | 实施者可能不知道哪些必须读 | Step 3 建立阶段阅读矩阵 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 实施计划入口 | 无正式 `07`,也无 `07` 工作台 | 新建 `07_implementation_plan_calibration_flow.md` 和 Step 1 中间产物 | 可按 SOP 推进 |
| 输入边界 | 依赖散落在 `00~06` | 明确 `00~06` 和 `04` 均为本轮输入基线 | 防止漏读配置 |
| 详细设计可实现性 | 需要人工判断 | 明确 `03` 足以支撑实施计划,但实现仓和工具链需后续检查 | 可继续 |
| 上游依赖 | 容易只看 core | 明确 core / bus contracts 都是编译期依赖 | 符合 L0-sdk 设计 |
| 风险分类 | 未归类 | 文档缺口无 blocker,实现仓和工具链进入后续 Step 风险 | 可控推进 |

---

## 6. 实施设计取舍

### 6.1 是否在 Step 1 直接规划阶段

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 直接规划阶段 | 速度快 | 会跳过实施目标、前置条件和交付物抽取 |
| B. 只确认输入边界,阶段规划留到 Step 5 | 符合 SOP,边界清楚 | 需要多一步推进 | 采用 |
| C. 把 Step 1~3 合并 | 看似省时 | 违反逐 Step 规则 | 不采用 |

### 6.2 是否把目标实现仓未初始化视为 blocker

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 视为 blocker,暂停实施计划 | 严格 | 实施计划本身可以定义建仓步骤 |
| B. 记录为 Step 3 前置条件和 Step 5 初始阶段输入 | 能继续规划 | 需要后续明确初始化步骤 | 采用 |
| C. 忽略 | 简单 | 实施者可能找错目录 | 不采用 |

### 6.3 是否把 design-calibration 全部列为全局必读

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 全部列为必读 | 信息完整 | 成本过高,不符合实施计划书写规范 |
| B. Step 3 按阶段 / commit boundary 建阅读矩阵 | 精准 | 需要阶段拆分后映射 | 采用 |
| C. 完全不读 | 省时间 | 细节追溯不足 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 实施输入边界表

| 上游文档 | 版本 / 路径 | 本计划如何使用 | 状态 | 风险 |
|---|---|---|---|---|
| `00-需求文档.md` | v0.2.0 / `projects/L0-sdk/00-需求文档.md` | 确定官方 SDK 定位、P0 范围、F-001~F-010、红线和风险 | 已确认 | 无阻塞 |
| `01-架构设计.md` | v0.2.0 / `projects/L0-sdk/01-架构设计.md` | 确定 official client access layer、依赖方向、运行边界和数据所有权 | 已确认 | 无阻塞 |
| `02-概要设计.md` | v0.2.0 / `projects/L0-sdk/02-概要设计.md` | 确定代码主体框架、主要组成部分、对象、接口、流程和状态轮廓 | 已确认 | 无阻塞 |
| `03-详细设计.md` | v0.2.0 / `projects/L0-sdk/03-详细设计.md` | 作为实施阶段、代码批次、模块、接口、状态、事务和测试切口直接输入 | 已确认 | 目标实现仓和工具链需 Step 3 检查 |
| `04-配置设计.md` | v0.1.0 / `projects/L0-sdk/04-配置设计.md` | 作为配置 loader、validator、runtime graph、profile、path dependency 和失效模式实施输入 | 已确认 | 无阻塞 |
| `05-测试方案.md` | v0.2.0 / `projects/L0-sdk/05-测试方案.md` | 定义每阶段测试门禁、证据归档、缺陷复验和报告路径 | 已确认 | 无阻塞 |
| `06-验收标准.md` | v0.2.0 / `projects/L0-sdk/06-验收标准.md` | 定义每阶段验收门禁、一票否决、风险接受和完成判定 | 已确认 | 无阻塞 |

### 7.2 缺失输入风险表

| 风险 ID | 风险 | 分类 | 处理口径 |
|---|---|---|---|
| R-SDK-IMPL-001 | 正式 `07-实施计划.md` 尚不存在 | expected-gap | 本轮按 SOP 生成,不阻塞 |
| R-SDK-IMPL-002 | 目标实现仓 `/home/aris/Projects/quantalithos-sdk` 当前仅有 git shell,尚未完成 workspace 初始化 | risk | Step 3 明确初始化检查,Step 5 规划初始阶段 |
| R-SDK-IMPL-003 | `quantalithos-core` / `quantalithos-bus` 存在但需固定 dependency snapshot | risk | Step 3 检查 contracts crate 和 commit |
| R-SDK-IMPL-004 | Python / TypeScript package build 和 smoke 工具链未完全固定 | risk | Step 3 / Step 8 收束工具链,Step 9 记录 Spike |
| R-SDK-IMPL-005 | `design-calibration` 资料量大 | risk | Step 3 按阶段 / commit boundary 建阅读矩阵 |

### 7.3 是否允许继续结论

| 结论项 | 判定 |
|---|---|
| 上游正式文档是否齐全 | 是 |
| 详细设计是否足以支撑实施计划 | 是 |
| 测试方案是否足以支撑阶段门禁 | 是 |
| 验收标准是否足以支撑完成判定 | 是 |
| 是否存在必须先回到 `00~06` 修文档的 blocker | 否 |
| 是否允许进入 Step 2 | 是 |

---

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §1。

```markdown
## 1. 与上游文档的关系声明

> 校准来源：
> - `design-calibration/07_implementation_plan_step_01_input_boundary.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“实施输入边界表”“缺失输入风险表”和“是否允许继续结论”小节，了解本实施计划为什么可以基于当前 `00~06` 继续展开。

本实施计划承接 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md` 和 `06-验收标准.md`。其中 `03-详细设计.md` 是直接实现输入，`05-测试方案.md` 和 `06-验收标准.md` 分别定义阶段测试门禁和实施完成判定。

本文不重新定义需求、架构、对象、协议、配置 schema、测试用例或验收门禁。若实施过程中发现上游设计缺口，必须暂停对应阶段并回到相应文档校准。
```

---

## 9. 待确认事项

| 事项 | 方案 | 建议 |
|---|---|---|
| 目标实现仓仅有 git shell 是否阻塞继续写实施计划 | A. 阻塞;B. 不阻塞,进入 Step 3 / Step 5 定义 workspace 初始化阶段;C. 忽略 | 采用 B |
| `04-配置设计.md` 是否纳入实施输入 | A. 纳入;B. 不纳入,只看 `03`;C. 后续再看 | 采用 A |
| 是否要求实施者全量阅读 `design-calibration` | A. 全量必读;B. 按阶段 / commit boundary 建阅读矩阵;C. 不读 | 采用 B |
| Python / TypeScript 工具链未固定是否阻塞实施计划 | A. 阻塞;B. 不阻塞,作为 Step 3 / Step 8 前置和 Step 9 Spike;C. 忽略 | 采用 B |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 上游输入基线明确 | 已满足 |
| 缺失或冲突项已分类为 blocker / risk / deferred | 已满足 |
| 已确认不存在阻塞制定实施计划的文档缺口 | 已满足 |
| 已形成实施输入边界表 | 已满足 |
| 已形成缺失输入风险表 | 已满足 |

结论: 可以进入 Step 2,明确实施目标、范围和非范围。
