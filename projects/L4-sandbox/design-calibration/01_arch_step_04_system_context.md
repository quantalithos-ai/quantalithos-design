# Step 4. 系统边界与上下文

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 4
> 回填章节: `01-架构设计.md` §5 系统边界与上下文
> 生成日期: 2026-07-07
> 状态: 已完成,等待用户审查

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 项目级台账是否允许进入 Step 4 | pass。用户已确认 Step 3 `职责边界`,可进入 Step 4。 |
| 是否已读取当前 flow 与前序 Step | pass。已读取 `01_architecture_calibration_flow.md`、`01_arch_step_01_requirement_baseline.md`、`01_arch_step_02_goals_constraints.md` 和 `01_arch_step_03_responsibility_boundary.md`。 |
| 是否已读取架构 SOP Step 4 与书写规范 §4.5 | pass。已读取系统上下文图、上下游与输入 / 输出面表、边界说明和禁止混写要求。 |
| 是否已读取当前正式需求基线 | pass。已读取新版正式 `projects/L4-sandbox/00-需求文档.md` 的依赖、规则、数据、接口、NFR、验收和风险章节。 |
| 是否已读取上游边界线索 | pass。已参考 `L2-tools`、`L2-runtime`、`L2-member-service`、`L1-identity`、`L1-work` 的 sandbox / execution / policy / artifact / observability 边界。 |
| 是否已读取旧材料 | pass。旧 README 和旧 `01-架构设计.md` 仅作为 historical material / 差异审计输入。 |
| 是否允许改正式 `01-架构设计.md` | no。正式 `01` 只能在 Step 16 装配时重建。 |
| 是否允许提前创建后续 Step 文件 | no。本步只创建 / 更新 `01_arch_step_04_system_context.md` 并同步 flow / 台账。 |

---

## 2. 本步目标

说明 `L4-sandbox` 在全局系统中的位置,明确它有哪些正式上下文对象、输入面、输出面以及外部边界。本步只表达正式上下文关系和输入 / 输出方向,不展开内部职责划分、限界上下文、容器部署、数据所有权矩阵、接口协议、事件名、DTO、route、技术设施或实现层依赖方向。

---

## 3. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `01_arch_step_01_requirement_baseline.md` | 已完成并经用户确认 | 承接需求基线、硬约束、旧材料污染诊断和依赖裁剪前提。 |
| `01_arch_step_02_goals_constraints.md` | 已完成并经用户确认 | 承接架构目标、不可变约束、当前取舍和架构非目标。 |
| `01_arch_step_03_responsibility_boundary.md` | 已完成并经用户确认 | 承接做 / 不做、易混淆职责、边界红线和后续 Step 承接要求。 |
| `projects/L4-sandbox/00-需求文档.md` §6 / §10 / §11 / §12 / §13 / §14 / §15 | 当前正式需求基线 | 校验使用方、依赖、规则、数据归属、接口边界、NFR、验收和风险。 |
| `00_req_step_06_consumers_dependencies.md` | 已完成 | 提供仓际能力关系、全局依赖裁剪和禁止依赖线索。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已读取 | 确认 `L0-core` 编译期依赖、运行期依赖、事件协作和禁止依赖边界。 |
| `projects/L4-sandbox/README.md` | historical material | 诊断旧上下文图、后端、capability-hub、SRE、事件和目录线索污染。 |
| `projects/L4-sandbox/01-架构设计.md` | historical material | 诊断旧 C4 Context、旧外部依赖、旧系统上下文和旧可用性约束。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 4 | 已读取 | 控制本步问题、输出、ASCII 图和进入下一步门禁。 |
| `standards/document/架构设计书写规范.md` §4.5 | 已读取 | 控制系统上下文图、输入 / 输出面表和边界说明写法。 |

---

## 4. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、架构 flow、Step 1~3、正式 00、SOP Step 4 和书写规范 §4.5 | done | 本文件 §1、§3 |
| 回答全局位置、正式上游、正式下游、输入面、输出面、上下文边界和降级口径问题 | done | 本文件 §5 |
| 诊断旧 README / 旧 `01` 中系统上下文污染点 | done | 本文件 §6 |
| 选择关键对象组主图 + 表格完整展开,不画角色、事件名、接口名或基础设施 | done | 本文件 §8 |
| 输出系统上下文图、上下游与输入 / 输出面表、边界说明 | done | 本文件 §9 |
| 写出 Step 16 可回填草稿 | done | 本文件 §10 |
| 完成 Step 4 自检并更新 flow / 项目台账 | done | 本文件 §12;`01_architecture_calibration_flow.md`;`project_execution_ledger.md` |

---

## 5. SOP 问题回答

### 5.1 这个仓在全局系统中的位置是什么?

`L4-sandbox` 位于 L4 基础设施层,是平台受控执行隔离事实的正式上下文中心。它上承 `L0-core` 的共享契约基础,按场景消费 identity / work 语境引用、给定 launch / isolation policy 和 isolation backend 承载能力,向 tools、runtime、member-service、runner 等执行调用方提供统一 sandbox 语义,并向 artifact、observability 和事件协作边界交接输出、候选材料、观测材料、失败分类、控制和清理收束材料。

这个位置的关键不是“所有执行都通过同一个 API 名称”,而是所有真实代码、工具、构建、测试或 Runner 应用执行都必须围绕同一套 execution isolation truth 收束。相邻仓可以提供语境、策略、承载或消费材料,但不能拥有 sandbox 的正式受理、隔离边界、policy 执行裁定、capture / handoff、failure / cleanup 或 redline truth。

### 5.2 它有哪些正式上游?

| 正式上游 | 关系类型 | 当前口径 |
|---|---|---|
| `L0-core` | 来源 / 依赖 | 提供共享 ID、typed refs、actor / context、trace、error、metadata、安全材料和跨仓契约基础;是唯一编译期上游。 |
| `L1-identity` | 来源 | 提供 actor / member identity anchor,用于执行环境身份和责任链语境;identity truth 不归 sandbox。 |
| `L1-work` | 来源 | 提供 project / work / context refs,用于执行上下文和工作责任语境;work truth 不归 sandbox。 |
| governance / capability / tools policy 来源 | 治理依赖 / 来源 | 提供 launch / isolation policy、authorization、allow / deny 语境和高风险动作约束;policy definition truth 不归 sandbox。 |
| 容器 / k8s / isolation backend | 依赖 / 外部系统 | 提供进程、文件系统、网络、资源和生命周期控制的运行承载能力;backend 产品 truth 不归 sandbox。 |
| `L0-bus` | 入口 / 协作主干 | 承载受控执行状态、审计、维护和跨仓协作信号;bus 不承载 sandbox truth。 |

### 5.3 它有哪些正式下游?

| 正式下游 | 关系类型 | 当前口径 |
|---|---|---|
| `L2-tools` | 消费 | 消费危险 / restricted / governed 工具所需隔离执行环境、边界反馈和失败材料;工具语义和 ToolPolicy truth 不归 sandbox。 |
| `L2-runtime` | 消费 | 消费统一受控执行能力、隔离层结果、失败 / 清理语境和 control 材料;ExecutionInstance / recover truth 不归 sandbox。 |
| `L2-member-service` | 消费 | 消费成员宿主受限动作所需 sandbox 能力和绑定 / 执行反馈材料;SandboxBinding 装配 truth 不归 sandbox。 |
| `L5-runner` | 消费 / 入口 | 消费 Runner 应用或 AI 产物运行所需隔离执行能力、policy 语义和结果回收语义;RunnerRun / UI truth 不归 sandbox。 |
| `L1-artifact` | 消费 | 消费 sandbox 捕获的输出、候选材料和 handoff refs,但 formal Artifact truth、baseline 和 evidence truth 不归 sandbox。 |
| `L4-observability` | 消费 | 消费 sandbox audit / trace / metric / failure / cleanup / redline material,但 observability store truth 不归 sandbox。 |
| `L0-bus` | 消费 / 协作主干 | 承接受控执行状态、失败、控制、cleanup 和 redline 相关协作信号,但不替代 truth 存储。 |

### 5.4 它从外部接收哪些输入面?

| 输入面 | 来源对象 | 本步边界 |
|---|---|---|
| 共享契约输入面 | `L0-core` | 接收 typed refs、trace、error、actor / context 和 metadata 等基础契约,不得自造第二套跨仓契约。 |
| 执行身份和责任语境输入面 | `L1-identity`;`L1-work`;调用方语境来源 | 只接收 identity / work refs 或安全摘要,不得接管 actor、member、project、work 或 runner 正文 truth。 |
| policy / authorization 输入面 | governance / capability / tools policy 来源 | 只承接给定 launch / isolation policy 和授权摘要,不得生成 allowlist、approval、capability 或 policy DSL truth。 |
| 受控执行请求输入面 | `L2-tools`;`L2-runtime`;`L2-member-service`;`L5-runner` | 接收需要真实隔离执行的请求语境,但调用方业务语义和运行主线不归 sandbox。 |
| isolation backend 承载输入面 | 容器 / k8s / isolation backend | 接收后端能力摘要和承载结果语境,但不把 Docker/gVisor/Firecracker 等产品本体写成当前上下文 truth。 |
| 协作信号输入面 | `L0-bus`;下游 handoff / 调查状态来源 | 接收协作和安全交接状态线索,但不得让事件或下游状态反向定义 sandbox truth。 |

### 5.5 它向外部提供哪些输出面?

| 输出面 | 消费对象 | 本步边界 |
|---|---|---|
| 受控执行能力输出面 | `L2-tools`;`L2-runtime`;`L2-member-service`;`L5-runner` | 提供统一 sandbox 语义、隔离执行边界和执行收束材料,不输出可被调用方反写的 sandbox truth 副本。 |
| 边界反馈与失败材料输出面 | `L2-tools`;`L2-runtime`;`L2-member-service`;`L5-runner` | 提供 deny、timeout、backend failure、capture failure、cleanup 等隔离层反馈,不替代调用方业务失败或 runtime recover。 |
| 输出与候选材料交接输出面 | `L1-artifact`;`L2-runtime`;`L5-runner` | 提供 captured output、candidate material 和 handoff refs,不宣布 formal artifact / evidence / baseline truth。 |
| 观测与审计材料输出面 | `L4-observability`;`L0-bus` | 提供 usage、audit、trace、metric、failure、cleanup 和 redline material,不拥有观测存储或查询 truth。 |
| 控制 / cleanup / redline 收束输出面 | `L2-runtime`;`L2-member-service`;`L1-artifact`;`L4-observability`;调查 / 安全交接边界 | 提供 control、lease、orphan、cleanup guard 和 redline containment 材料,不重写相邻仓 truth。 |
| 变化协作输出面 | `L0-bus` | 发布执行状态和维护协作信号,不把事件流当作正式 sandbox truth 存储。 |

### 5.6 哪些外部系统或相邻仓构成正式上下文边界?

正式上下文边界按是否会持续影响 execution isolation truth 的输入、承载、消费、协作或失效处理来判断。

| 边界对象 | 是否进入 Step 4 主图 | 判断 |
|---|---|---|
| `L0-core` | 进入 | 唯一编译期共享契约来源,必须在主图表达。 |
| `L1-identity` / `L1-work` | 进入但收缩 | 作为身份、责任链和工作语境来源,主图收缩成 context refs 边界,表中展开。 |
| governance / capability / tools policy 来源 | 进入但收缩 | 作为 policy / authorization 来源边界,必须表达其来源地位和 sandbox 不拥有 truth 的限制。 |
| 容器 / k8s / isolation backend | 进入 | 作为正式隔离环境承载能力来源,但不指定 Docker/gVisor/Firecracker 产品组合。 |
| `L2-tools` / `L2-runtime` / `L2-member-service` / `L5-runner` | 进入但收缩 | 作为执行消费方和调用方边界,主图收缩成 execution consumers,表中展开。 |
| `L1-artifact` / `L4-observability` | 进入但收缩 | 作为材料消费和观测消费边界,主图收缩成 material / observability consumers,表中展开。 |
| `L0-bus` | 进入 | 作为事件协作主干进入,但不得被解释为 truth store。 |
| Docker / gVisor / Firecracker / runc / containerd / Kubernetes 发行版 | 不单独进入 | 当前是后续技术选型、配置或实施候选;Step 4 只表达抽象 isolation backend 边界。 |
| 数据库 / 对象存储 / OTel / 日志平台 / 审计平台 / secrets / external GRC | 不进入 | 当前是后续技术设施、配置或外部集成候选,不是系统上下文 truth 对象。 |
| SRE / 安全审查者 / Runner 操作者 / AI member | 不进入 | 这些是需求角色,不属于系统上下文对象。 |

### 5.7 依赖失效时,本仓的降级口径是什么?

| 失效对象 | 降级口径 |
|---|---|
| `L0-core` | 不可自行降级;共享契约缺失时不得补造 typed refs、trace、error 或 actor / context 语义。 |
| `L1-identity` | identity anchor 暂不可解析时,受控执行语境只能拒绝、挂起或标记缺失,不得创建 actor / member truth。 |
| `L1-work` | work / project / context refs 缺失或不可解析时,责任链不完整的执行只能拒绝、挂起或标记缺语境,不得保存 WorkItem / ImplementationPlan 正文。 |
| governance / capability / tools policy 来源 | policy / authorization 缺失、冲突、不可解析或后端不支持时必须 fail closed,不得 permissive fallback。 |
| 容器 / k8s / isolation backend | 无法创建真实受控隔离环境或无法落实必需限制时,不得宿主直跑或 test-only 升格,只能拒绝或保守失败。 |
| `L2-tools` / `L2-runtime` / `L2-member-service` / `L5-runner` | 调用方不可用或消费失败不改变已成立的 sandbox truth;不得由 sandbox 补造工具结果、ExecutionInstance、SandboxBinding 或 RunnerRun。 |
| `L1-artifact` | artifact 消费不可用时,sandbox 保留 capture / handoff pending 或 failed 状态,不得把候选材料宣布为 formal artifact truth。 |
| `L4-observability` | observability 消费不可用时,sandbox 保留 audit / trace / metric material 和显式交接状态,不得用本地日志替代观测 store truth 或掩盖 capture failure。 |
| `L0-bus` | 事件协作不可用时,本仓 truth 不应丢失;协作信号可挂起、延后或标记失败,不得伪装为已传播。 |
| 下游安全交接 / 调查边界 | 调查或安全交接状态不可用时,cleanup / reaper 必须保守阻断或挂起,不得先删材料。 |

---

## 6. 当前材料问题诊断

### 6.1 旧 README 诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 关键依赖 | 写 `quantalithos-core` / `quantalithos-sdk`、Docker / containerd / gVisor / Firecracker / runc。 | SDK 和具体后端被写成当前上下文事实,与 `L0-core` 唯一编译期依赖和后端候选口径冲突。 | 主图只保留 `L0-core` 和抽象 isolation backend,不画 SDK / 具体产品。 |
| 下游 | 写 tools、runner、capability-hub。 | 漏掉 runtime、member-service、artifact、observability、bus 等当前新版上下文,且 capability-hub 被误写成固定 policy 来源。 | 表中完整展开执行消费方、材料消费方和 policy 来源边界。 |
| 目录结构 | 写 `backends/`、`api/`、`limits/`、`audit/`、`rpc/`。 | 内部模块和实现目录不属于系统上下文对象。 | 不进入 Step 4 图和表。 |
| 安全基线 / 性能目标 | 写 seccomp、AppArmor、cap drop、启动时延等。 | 属于技术、配置、测试或验收候选,不是系统上下文对象。 | 后移到 Step 10 / Step 12 / 04 / 05 / 06。 |

### 6.2 旧 `01-架构设计.md` 诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| §4.1 系统上下文图 | 图中画 runtime / tools / runner、capability-hub、Docker、gVisor、observability、SRE。 | 混入角色、具体后端、固定 capability-hub policy 来源和观测 sink;遗漏 identity / work 语境、member-service、artifact、bus、抽象 policy 来源边界。 | 新图只画正式上下文对象组,不画角色和具体产品。 |
| §4.2 职责边界 | 把职责边界放在系统上下文下。 | Step 3 已独立收敛职责,Step 4 不应重复职责章节。 | 本步只表达上下文关系和输入 / 输出面。 |
| §4.3 外部系统可用性约束 | 写 Docker / containerd、gVisor、capability-hub policy、observability SLA 和降级。 | 这是技术设施和运行 SLA,且“切 gVisor / 低安全环境退 Docker”可能违反当前 fail-closed 口径。 | 降级口径按 truth owner 和 fail-closed 重写。 |
| §6 容器图 | 提前写 sandbox-api、execution orchestrator、limits / policy gate、backend adapter、audit emitter。 | 容器 / 部署视图属于后续 Step 6,不是系统上下文。 | 不继承。 |

---

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 图对象 | runtime / tools / runner、capability-hub、Docker、gVisor、observability、SRE。 | `L0-core`、context refs、policy sources、isolation backend、execution consumers、material / observability consumers、`L0-bus`。 | 对齐架构规范 §4.5,避免角色和具体产品入图。 |
| 上下文完整性 | 旧图遗漏 identity / work、member-service、artifact、bus 和抽象 policy 来源。 | 表中完整展开身份 / 工作语境、执行消费方、材料消费方、事件协作和承载边界。 | 承接新版 `00` 和 Step 3。 |
| 技术设施 | Docker/gVisor/capability-hub policy 被当成固定上下文。 | 后端产品、policy 来源产品和观测存储后移;本步只表达抽象上下文边界。 | 防止技术选型提前硬化。 |
| 降级口径 | 偏“切后端 / backlog / SLA”。 | 改为 fail-closed、pending / failed handoff、truth 不补造、cleanup guard 保守阻断。 | 对齐 `BR-SBX-*`、`AC-SBX-*`、`VF-SBX-*`。 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 单图逐个画出所有关联仓和外部系统 | 信息完整。 | 图超过规范建议对象数,并容易变成全仓依赖矩阵。 | 不采用。 |
| 方案 B: 主图收缩关键上下文对象组,表格完整展开 | 图清晰,表可审查,能保留完整上下游。 | 需要图后说明收缩节点。 | 采用。 |
| 方案 C: 沿用旧 C4 Context 图并局部补词 | 修改少。 | 角色、具体后端、固定 capability-hub、SRE 和旧接口假设残留。 | 不采用。 |
| 方案 D: 主图只画 `L0-core`、isolation backend 和 execution consumers | 最简。 | 会丢失 policy 来源、context refs、artifact / observability handoff 和 bus 协作边界。 | 不采用。 |
| 方案 E: 把 Docker/gVisor/Firecracker、OTel、数据库、secrets 和 external GRC 画入主图 | 接近实现环境。 | 越过容器、技术选型和配置 Step,且会污染系统上下文 truth 对象。 | 不采用。 |

### 8.1 待确认问题的方案选择

#### 是否把具体 isolation backend 画进系统上下文图?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 单列 Docker、gVisor、Firecracker、local_process。 | 会把旧 README 线索提前硬化为正式上下文和技术选型。 |
| 方案 B | 只画抽象 isolation backend;具体承载后续 Step 6 / Step 10 / 04 再裁剪。 | 保留承载依赖,不提前锁定产品组合。 |

推荐方案 B。

#### 是否把 policy 来源固定为某个仓或 capability-hub?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 主图固定 capability-hub 或单一 policy source。 | 会反向重写 policy truth 来源,且与新版需求“governance / capability / tools policy 来源”不一致。 |
| 方案 B | 主图收缩为 policy sources,表中说明 sandbox 只执行给定 policy。 | 保持来源边界,后续 Step 9 / 03 再细化接缝矩阵。 |

推荐方案 B。

#### 是否把 artifact / observability / bus 分别画入主图?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 分别单列 `L1-artifact`、`L4-observability`、`L0-bus`。 | 图仍可控,但执行消费方和语境来源已经较多;单列 bus 更关键。 |
| 方案 B | 单列 `L0-bus`,将 artifact / observability 收缩成 material / observability consumers,表中展开。 | 保留事件协作主干,同时避免主图过载。 |

推荐方案 B。

---

## 9. 结构化中间产物

### 9.1 系统上下文图

```text
+--------------------+      +--------------------+      +--------------------+
|      L0-core       |      | context ref sources|      |   policy sources   |
| shared contracts   |      | identity / work    |      | governance/tools   |
+---------+----------+      +---------+----------+      +---------+----------+
          |                           |                           |
          | 依赖                      | 输入                      | 输入
          v                           v                           v

                  +--------------------------------------+
                  |             L4-sandbox               |
                  | controlled execution isolation truth |
                  +------------------+-------------------+
                                     ^
                                     |
                         输入 / 依赖 |
                                     |
                  +------------------+-------------------+
                  |        isolation backend             |
                  |  process/fs/network/resource carrier |
                  +------------------+-------------------+
                                     |
             输出                    | 输入 / 输出                    输出
             v                       v                             v
+--------------------+      +--------------------+      +--------------------+
| execution consumers|      |       L0-bus       |      | material/observ.   |
| tools/runtime/etc. |      | event collaboration|      | artifact/observ.   |
+--------------------+      +--------------------+      +--------------------+
```

- 该图仅表达本仓与正式上下文对象之间的边界关系与输入/输出方向，不表达接口、事件、实现组件或运行时顺序。
- `L4-sandbox` 位于中心,表示它是受控执行隔离事实的 truth boundary,不是工具语义、runtime 主线、member host、artifact 或 observability truth owner。
- `context ref sources` 收缩 `L1-identity` 和 `L1-work`;`policy sources` 收缩 governance / capability / tools policy 来源。
- `execution consumers` 收缩 `L2-tools`、`L2-runtime`、`L2-member-service` 和 `L5-runner`;`material/observ.` 收缩 `L1-artifact` 和 `L4-observability`。
- `isolation backend` 是抽象承载边界,不是 Docker/gVisor/Firecracker 等具体产品选型。

### 9.2 上下游与输入 / 输出面表

| 对象 | 关系方向 | 关系类型 | 输入/输出面 | 说明 |
|---|---|---|---|---|
| `L0-core` | 输入 | 来源 / 依赖 | 共享 ID、typed refs、actor / context、trace、error、metadata、安全材料和跨仓契约基础 | 唯一编译期上游;不得由 sandbox 自行补造跨仓契约。 |
| `L1-identity` | 输入 | 来源 | actor / member identity anchor 和责任链身份语境 | sandbox 只消费身份锚点或摘要,不拥有 GlobalMember、actor lifecycle 或身份正文。 |
| `L1-work` | 输入 | 来源 | project / work / context refs 和工作责任语境 | sandbox 只消费工作语境引用,不保存 Project、WorkItem 或 ImplementationPlan 正文。 |
| governance / capability / tools policy 来源 | 输入 | 治理依赖 / 来源 | launch / isolation policy、authorization、allow / deny 语境和高风险动作约束 | sandbox 执行给定 policy 并 fail closed,不拥有 policy definition、approval、allowlist 或 capability truth。 |
| 容器 / k8s / isolation backend | 输入 | 外部系统 / 依赖 | 进程、文件系统、网络、资源限制和生命周期控制承载能力 | 当前只固定抽象承载边界,不把 Docker/gVisor/Firecracker 产品组合写成 Step 4 结论。 |
| `L2-tools` | 输入 / 输出 | 消费 / 入口 | 危险 / restricted / governed tool 隔离执行请求、边界反馈和失败材料 | 工具语义、ToolPolicy 和 ToolInvocationResult 仍归 tools。 |
| `L2-runtime` | 输入 / 输出 | 消费 / 入口 | runtime 调度的受控执行请求、隔离层结果、失败 / 清理语境和 control 材料 | ExecutionInstance、CurrentStep、agent loop 和 recover truth 仍归 runtime。 |
| `L2-member-service` | 输入 / 输出 | 消费 / 入口 | member host 受限动作的 sandbox bind / execute / release 语境和失败反馈 | MemberExecutionHost、SandboxBinding 装配结果和 host lifecycle 仍归 member-service。 |
| `L5-runner` | 输入 / 输出 | 入口 / 消费 | Runner 应用或 AI 产物运行所需受控执行能力、policy 语义和结果回收语义 | RunnerRun、run state、control entry、output preview 和 UI 状态不归 sandbox。 |
| `L1-artifact` | 输出 | 消费 | captured output、candidate material、handoff refs 和 evidence-like 来源语境 | sandbox 不宣布 formal Artifact truth、baseline truth 或 formal evidence truth。 |
| `L4-observability` | 输出 | 消费 | audit、trace、metric、usage、failure、cleanup 和 redline material | observability store、trace 查询、retention 和 alert stream 不归 sandbox。 |
| `L0-bus` | 输入 / 输出 | 入口 / 消费 | 受控执行状态、审计、失败、维护和 redline 协作信号 | bus 是事件协作主干,不是 sandbox truth 存储。 |
| 下游安全交接 / 调查边界 | 输入 / 输出 | 消费 / 治理依赖 | cleanup guard 所需安全交接状态、redline 调查状态和材料保留语境 | 当前只表达边界,正式调查生命周期和 operator UI 不归 sandbox。 |

### 9.3 依赖失效降级口径

| 对象 | 失效情况 | 架构口径 |
|---|---|---|
| `L0-core` | 共享契约、typed ref、trace 或 error 口径缺失 | 不新增私有契约,不得自造共享类型;后续设计应停审补契约或缩小范围。 |
| `L1-identity` / `L1-work` | 身份、工作或上下文 refs 缺失 / 不可解析 | 正式受控执行语境进入拒绝、挂起或缺语境状态;不得匿名执行或补造外部 truth。 |
| policy 来源 | policy 缺失、冲突、不支持、不可解析或授权不明 | 必须 fail closed,不得 permissive fallback 或临场生成 allowlist。 |
| isolation backend | 无法创建隔离环境或落实必需边界 | 不得宿主直跑、test-only 升格或 silent degrade;必须拒绝或保守失败。 |
| execution consumers | 调用方消费失败或不可用 | sandbox 已成立 truth 不被调用方状态改写;不得补造工具结果、runtime truth、host binding 或 RunnerRun。 |
| `L1-artifact` | artifact handoff 不可用或延迟 | 保留 capture truth 和 handoff pending / failed;不得把候选材料升格为 formal artifact truth。 |
| `L4-observability` | audit / trace / metric 消费不可用 | 保留 observability material 和交接状态;不得用本地日志掩盖 capture / handoff failure。 |
| `L0-bus` | 事件协作不可用 | truth 写入与事件传播分离;协作信号可挂起或失败,不得伪装为已发布。 |
| 安全交接 / 调查边界 | cleanup 前所需交接状态不可确认 | cleanup / reaper 必须保守阻断或挂起,不得先删 capture / audit / investigation material。 |

### 9.4 边界说明结论

`L4-sandbox` 的系统上下文围绕“共享契约、身份 / 工作语境、给定 policy、隔离承载、执行消费、材料交接、观测协作和事件协作”展开。进入主图的对象都是会持续影响受控执行隔离事实成立、边界落实、材料交接或失败清理收束的正式上下文对象;用户角色、文档来源、内部模块、接口名、事件名、DTO、具体后端产品和技术设施不进入本章。`L2-tools`、`L2-runtime`、`L2-member-service`、`L5-runner` 只能作为执行消费方和调用方语境参与,不能形成第二套 sandbox 语义。`L1-artifact`、`L4-observability`、`L0-bus` 和安全交接边界只消费或协作材料,不得反向定义 execution isolation truth。

---

## 10. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §9 的结构化结论,不重复扩写 SOP 问题回答、旧材料诊断和设计取舍。

```md
## 5. 系统边界与上下文

> 校准来源:
> - `design-calibration/01_arch_step_04_system_context.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“当前材料问题诊断”小节,了解本章如何把职责边界放入全局系统关系中。

### 5.1 系统上下文图

摘录 `design-calibration/01_arch_step_04_system_context.md` §9.1。

### 5.2 上下游与输入 / 输出面表

摘录 `design-calibration/01_arch_step_04_system_context.md` §9.2。

### 5.3 边界说明

摘录 `design-calibration/01_arch_step_04_system_context.md` §9.4。
```

---

## 11. 待确认事项

本步不新增阻塞 Step 5 的系统上下文缺口。下列事项继续挂入后续 Step,不得在系统边界与上下文中提前闭口:

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| Q-SBX-ARCH4-001 | `L4-sandbox` 内部限界上下文与子域如何划分 | 后续 Step 5 收敛;当前只固定系统上下文边界。 |
| Q-SBX-ARCH4-002 | 具体 isolation backend 组合、后端能力摘要和允许环境边界 | 后续 Step 6 / Step 10 / 04 / 07 收敛;当前只画抽象 isolation backend。 |
| Q-SBX-ARCH4-003 | policy / authorization 来源在 tools、runtime、member-service、runner 场景下的接缝矩阵 | 后续 Step 9 / 03 收敛;当前只固定 policy sources 上下文边界。 |
| Q-SBX-ARCH4-004 | capture / handoff ack、pending、failed 的通信形态 | 后续 Step 9 / 03 / 04 收敛;当前只固定材料消费边界和降级口径。 |
| Q-SBX-ARCH4-005 | `L0-bus` 上的事件种类、payload、topic 和发布时机 | 后续 Step 9 / 03 / 04 收敛;当前只表达事件协作上下文。 |

---

## 12. 自检与进入下一步条件

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否回答 Step 4 七个 SOP 问题 | pass | 见 §5.1~§5.7。 |
| 是否明确本仓在全局系统中的位置 | pass | `L4-sandbox` 已定位为 L4 受控执行隔离事实中心。 |
| 是否画出正式对象的系统上下文图 | pass | §9.1 只画仓、正式上下文对象组、抽象外部系统和协作主干。 |
| 图中是否避免角色、文档来源对象、接口名、事件名和实现组件 | pass | 图中无角色、文档、API、event、DTO、repository、database 或旧目录。 |
| 是否通过表格解释上下游和输入 / 输出面 | pass | §9.2 已列出对象、关系方向、关系类型、输入 / 输出面和说明。 |
| 是否说明边界和不进入主图的相关对象 | pass | §9.4 已解释角色、技术设施、具体后端产品和下游真相边界。 |
| 是否提前写内部结构、容器部署、数据所有权、协议或技术选型 | pass | 本步只输出系统上下文;相关事项进入后续 Step。 |
| 是否发现阻塞 Step 5 的上游 blocker | pass | 未发现阻塞 Step 5 的上游 blocker;`04` / `07` 缺失仍为 downstream blocker。 |
| 是否允许进入 Step 5 | pass_wait_review | 本步完成后等待用户审查;用户确认后才能启动 Step 5 `限界上下文与子域划分`。 |

本步完成后,`01-架构设计.md` 仍不得改写。下一步若用户确认,应读取本文件、`01_architecture_calibration_flow.md`、正式 `00-需求文档.md`、架构 SOP Step 5、架构书写规范 §4.6,再创建 `01_arch_step_05_bounded_context_subdomains.md`。
