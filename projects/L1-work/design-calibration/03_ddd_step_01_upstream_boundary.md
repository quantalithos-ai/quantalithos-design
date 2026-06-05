# Step 1. 确认概要设计输入边界

### 1. Step 状态

- 状态:[x] 已确认
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 1
- 回填章节:`03-详细设计.md` §1 与上游文档的关系声明;§17 风险与待确认事项

### 2. 本步输入

- 上游文档:
  - `projects/L1-work/00-需求文档.md`
  - `projects/L1-work/01-架构设计.md`
  - `projects/L1-work/02-概要设计.md`
  - `projects/L1-work/design-calibration/02_hld_step_12_detailed_design_handoff.md`
  - 旧版 `projects/L1-work/03-详细设计.md` 的 git 历史版本,仅作为问题诊断样本
- 已确认结论:
  - `L1-work` 是项目工作事实真相仓。
  - 编译期依赖只允许 `L0-core`;其他仓按运行期、事件协作、追溯交接、外部接缝或下游消费处理。
  - Work truth 包含 Project、ProjectMember、Backlog、WorkItem、ChildWorkItem、WorkDependency、WorkBlocker、Iteration、IterationCommitment、PromoteResult、trace / audit / outbox 等对象边界。
  - Query、projection、reconciliation、event consumer、process timing 和 runtime promote event 不得直接写真相。
  - 概要设计已经固定 Command / Query / Consumer / Event / Job 名称、读写边界、metadata / idempotency 强制要求、关键处理流和状态集合。
- 依赖的前序 Step:
  - 无。本 Step 是详细设计 SOP 起点。

### 3. SOP 问题回答

1. 当前详细设计直接承接概要设计中的哪些结论?

   回答:直接承接 `02-概要设计.md` 中的代码主体框架、10 个主要组成部分、关键对象轮廓、Command / Query / Event / Job 骨架、关键处理流、状态集合、异常落点、配置影响轮廓和详细设计承接清单。`00-需求文档.md` 和 `01-架构设计.md` 只作为需求边界、依赖方向、数据归属和通信方式的上游约束,不在详细设计中重新定义。

2. 概要设计中的代码主体框架是否已经足够稳定?

   回答:足够稳定。概要设计已经把业务主要组成部分与实现分层分开,并明确 Inbound / Operations、Application Services、Domain Model and Policies、Ports and External Seams、Persistence / Projection、Outbox and Handoff 的实现分层。详细设计可以继续将这些主体落到 crate、module、file、trait、service 和 adapter。

3. 概要设计中的关键对象、接口骨架、处理流和状态机是否足够继续展开?

   回答:足够进入详细设计。概要设计已经完成以下闭环:
   - 关键对象反查到 Step 6,包括 truth、policy、projection、reference、audit / outbox。
   - Command / Query / Consumer / Event / Job 已有正式名称和读写边界。
   - CreateProject、UpdateBacklogAvailability、CreateWorkItem、RequestWorkPromotion、ReviewWorkPromotion、CommitIterationScope、UpdateIterationCommitment 等主流程已经收敛。
   - 状态集合已经固定,包括 Project `Active / ReadOnly / Closed / Archived`、Work lifecycle `Formalized / Committed / InProgress / Completed / Cancelled / Superseded`、Outbox `Pending / Published / Failed`。

4. 哪些内容仍停留在概要设计轮廓,进入详细设计前必须补清?

   回答:以下内容必须由详细设计继续补清,但不阻塞进入 Step 2:
   - crate / package / module / file layout。
   - 完整 Rust struct / enum / value object 字段与 Rustdoc 注释。
   - Command / Query / Event / Job DTO schema、result / receipt / reason / ref 类型。
   - repository / port / adapter trait 签名。
   - 函数级调用链、事务边界、UoW、idempotency record、request digest 和 duplicate / conflict 行为。
   - projection rebuild truth source、snapshot refresh、outbox publication、trace / archive handoff 细节。
   - 正式状态转换矩阵和测试切口。

5. 哪些需求或架构结论会影响详细设计,但不能在详细设计中重新定义?

   回答:以下结论只能承接,不得在详细设计中改写:
   - Work truth 归属和相邻仓正文排除。
   - `L0-core` 唯一编译期依赖。
   - `L4-archive` 双角色与 `L4-observability` 只作为 trace / audit / maintenance consumer 的口径。
   - formalize / promote 显式边界。
   - ProjectMember / GlobalMember 分层。
   - Iteration 是 Backlog 正式工作全集中的承诺子集,process planning 不拥有 Iteration truth。
   - Query / projection / reconciliation 不反写真相。

### 4. 旧版 03 问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` 文档元信息 | 关联旧 `02-概要设计.md v0.4.0`,日期为 2026-05-14 | 与新版 `02-概要设计.md v1.0.0` 不一致,不能作为当前详细设计基线 |
| 旧版 `03-详细设计.md` §4 / §5 | 保留 Project `Draft / Active / Paused / Archived / Dissolved`、`Project::activate` 等旧口径 | 与新版 Project lifecycle `Active / ReadOnly / Closed / Archived` 冲突 |
| 旧版 `03-详细设计.md` 多处 | 保留 `DraftIteration`、`StartIteration`、planning freeze / spillover 旧流程 | 与新版 `OpenIteration`、`CommitIterationScope`、`UpdateIterationCommitment`、`UpdateIterationLifecycle` 命令骨架不一致 |
| 旧版 `03-详细设计.md` child WorkItem 章节 | 旧模型强调 proposal / accepted / rejected 直接进入 Backlog / Iteration | 与新版 `RequestWorkPromotion` / `ReviewWorkPromotion` 和 `PromoteResult` 明确边界不一致 |
| 旧版 `03-详细设计.md` 事件与测试输入 | 使用 `work.workitem.created`、`work.workitem.accepted` 等旧事件名 | 与新版 `WorkItemChanged`、`PromoteResultRecorded`、`IterationChanged` 等 outbound event 骨架不一致 |
| 旧版 `03-详细设计.md` 持久化表 | 使用旧 `work_items`、`backlog_items`、`planning_status` 等直接表口径 | 详细设计需要重新从新版对象 / 状态 / transaction contract 推导,不能复用旧表结构 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 详细设计生成方式 | 直接在旧 `03-详细设计.md` 上修补或重写 | 先按 SOP 创建 `03_ddd_calibration_flow.md` 和逐 Step 中间产物 | 详细设计 SOP 要求中间产物先于正式文档 |
| 旧 `03` 地位 | 可能被当作可继承基线 | 只作为 git 历史中的问题诊断输入 | 旧文档存在大量新版主线冲突 |
| 权威输入 | 旧 `03` + 旧概要 | 新版 `00/01/02` + `02_hld_*` 中间产物 | 保持需求、架构、概要、详细的真相源顺序 |
| 正式 `03` 写入时机 | 立即重写 | Step 19 整理正式文档 | 每章必须能追溯到具体 `03_ddd_step_*.md` |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 在旧 `03` 上局部修补 | 文件改动看起来较少 | 旧状态、旧流程、旧事件和旧持久化结构残留风险极高 | 不采用 |
| B. 直接重写正式 `03` | 可以快速形成新正文 | 跳过详细设计 SOP 中间产物,正式章节缺少校准来源 | 不采用 |
| C. 按详细设计 SOP 先生成 Step 中间产物,最后重建正式 `03` | 可追溯、可逐步审查、符合可落码性标准 | 需要更多步骤 | 采用 |

### 7. 结构化中间产物

#### 7.1 上游关系映射表

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `00-需求文档.md` | 仓定位、数据归属、业务规则、验收红线、禁止行为 | 将需求红线落实到对象不变量、协议校验、错误分支和测试切口 |
| `01-架构设计.md` | 依赖方向、数据所有权、一致性分层、通信方式、L4 archive / observability 角色 | 将架构边界落实到 crate 依赖、trait / adapter、event / handoff、transaction 和 projection 规则 |
| `02-概要设计.md` §4~§12 | 代码主体框架、主要组成部分、对象轮廓、接口骨架、处理流、状态集合、配置影响、详细设计承接清单 | 展开为文件布局、模块契约、对象契约、trait 契约、DTO schema、函数级 flow、状态矩阵、事务与幂等 |
| `design-calibration/02_hld_step_*.md` | 概要设计每个结论的讨论来源 | 作为详细设计理解和追溯入口;不替代正式 `02` |
| 旧版 `03-详细设计.md` git 历史版本 | 旧口径问题样本 | 用于识别不得继承的旧状态、旧命令、旧事件和旧表结构 |

#### 7.2 本文不再回答

- `L1-work` 是否是项目工作事实真相仓。
- Project、ProjectMember、Backlog、WorkItem、ChildWorkItem、Iteration 是否属于 Work truth。
- Identity、Conversation、Process、Governance、Artifact、Runtime、Workspace、Observability、Archive 是否拥有 Work truth。
- 是否允许 conversation / runtime / artifact event 直接创建 WorkItem 或 ChildWorkItem。
- 是否允许 query、projection rebuild、reconciliation 或 report generation 反写真相。
- 是否允许非 `L0-core` 仓进入编译期依赖。
- Project / Work / Backlog / Iteration / Promote / Outbox 的概要层状态集合是否可以在详细设计中随意增删。

#### 7.3 本文必须回答

- 目标仓的 Rust workspace、crate、package、module 和文件布局。
- 每个模块包含的 struct、enum、value object、service、trait、adapter、repository、projection 和 error。
- 每个对象字段、函数、工厂、状态 enum variant 和 Rustdoc 注释。
- 每个 Command / Query / Consumer / Outbound Event / Job 的 DTO schema、result / receipt、metadata / idempotency 规则。
- 每个处理流的函数级调用链、transaction / UoW、repository / port 调用、outbox / trace / projection 副作用。
- 状态转换矩阵、非法转换、错误映射、恢复和重试口径。
- 并发、幂等、request digest、result_ref、duplicate / conflict 行为。
- projection rebuild truth source、reference snapshot refresh、outbox publication、trace / archive handoff 的实现契约。
- 测试切口和实施计划承接清单。

#### 7.4 输入不足风险

| 风险 | 是否阻塞 Step 2 | 处理口径 |
|---|---|---|
| 旧 `03` 与新版 `02` 大范围冲突 | 不阻塞 | 旧 `03` 只作为诊断输入,不作为真相源 |
| `04-配置设计.md` 当前不存在 | 不阻塞 Step 2,影响 Step 14 | Step 14 只定义详细设计需要读取的配置引用和绑定点;正式配置手册后续单独写 |
| `05-测试方案.md` / `06-验收标准.md` 仍是旧口径 | 不阻塞 Step 2,影响 Step 16~17 | Step 16 先按新版详细设计生成测试切口,后续再回写 05/06 |
| 相邻仓具体 contracts 字段可能尚未全部可读 | 不阻塞 Step 2,影响 Step 6~8 | 到对象 / 协议契约 Step 时逐项对齐,不可自行发明上游 truth 字段 |

### 8. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_01_upstream_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“回填草稿”和“待确认事项”小节,了解详细设计如何从新版需求、架构和概要设计承接,以及旧 `03` 为什么只能作为问题诊断输入。

#### 1. 与上游文档的关系声明

`03-详细设计.md` 直接承接新版 `00-需求文档.md`、`01-架构设计.md` 和 `02-概要设计.md`。本文继续把概要设计中已经收稳的代码主体框架、主要组成部分、关键对象、接口骨架、处理流、状态集合和配置影响轮廓展开为可以 1:1 实现的代码契约。

旧版 `03-详细设计.md` 已从当前工作树删除,只保留在 git 历史中作为问题诊断输入,不得作为新版详细设计真相源。旧文档中仍适用的事实必须通过新版 `00/01/02` 或本轮 `03_ddd_step_*` 中间产物重新进入正式文档。

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `00-需求文档.md` | 仓定位、数据归属、业务规则、验收红线、禁止行为 | 对象不变量、协议校验、错误分支和测试切口 |
| `01-架构设计.md` | 依赖方向、数据所有权、一致性分层、通信方式、L4 archive / observability 角色 | crate 依赖、trait / adapter、event / handoff、transaction 和 projection 规则 |
| `02-概要设计.md` | 代码主体框架、主要组成部分、对象轮廓、接口骨架、处理流、状态集合、配置影响、详细设计承接清单 | 文件布局、模块契约、对象契约、trait 契约、DTO schema、函数级 flow、状态矩阵、事务与幂等 |

本文不再回答 Work truth 归属、相邻仓 truth 边界、formalize / promote 显式边界、ProjectMember / GlobalMember 分层、Iteration 与 process planning 边界、query / projection 不反写真相、编译期依赖裁剪等已经由需求、架构和概要设计收稳的问题。

本文必须回答 Rust workspace / crate / file layout、模块实现契约、对象契约、trait / adapter 契约、协议契约、函数级处理流、状态转换矩阵、持久化事务、一致性、错误恢复、幂等重入、配置绑定、审计埋点、测试切口和实施承接清单。

### 9. 待确认事项

- 无阻塞 Step 2 的待确认事项。
- 后续 Step 14 需要处理 `04-配置设计.md` 当前不存在的问题。
- 后续 Step 16~17 需要标记旧 `05-测试方案.md` / `06-验收标准.md` 与新版详细设计的同步需求。

### 10. 进入下一步条件

- 已明确详细设计直接承接新版 `00/01/02`。
- 已明确旧 `03` 只作为问题诊断输入,不得作为新版契约来源。
- 已列出本文不再回答和必须回答的内容。
- 已识别输入不足风险,且无阻塞 Step 2 的缺口。
