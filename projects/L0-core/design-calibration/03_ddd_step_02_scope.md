# Step 2. 明确本轮实现范围和非范围

> 本版本是 L0-core 详细设计校准的 Step 2 中间产物。
> 本步只明确本轮详细设计要覆盖哪些实现契约、哪些内容不进入本轮。
> 本步不展开文件布局、模块契约、对象字段、协议 schema 或函数级调用链。

## 1. Step 状态

- 状态: [x] 已确认
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 2
- 回填章节: `projects/L0-core/03-详细设计.md` §2 本次详细设计目标与范围

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 1 上游关系映射表 | 已确认详细设计承接 `00/01/02` v0.2.0,旧版 `03` 不作为主线 | 作为本轮范围收口的输入边界 |
| Step 1 `本文必须回答` | 文件布局、模块契约、对象实现、trait / port、协议 schema、函数级处理流、状态矩阵、持久化、错误、幂等、配置、审计和测试切口 | 转成详细设计目标表 |
| `02-概要设计.md` §2 | 概要设计已把范围收敛到契约真相、发布与消费基线、引用追溯、查询解析、后台承接和下游边界 | 作为本轮实现范围来源 |
| `02-概要设计.md` §5 | 6 个业务主要组成部分 + 技术承载与外部适配支撑主体集合 | 作为本轮必须覆盖的模块范围 |
| `02-概要设计.md` §7 | Command / Query / Outbound Event / Operations Job 骨架 | 作为本轮必须覆盖的协议范围 |
| `02-概要设计.md` §8~§10 | 关键处理流、状态族、异常边界 | 作为本轮必须覆盖的流程、状态和错误范围 |
| `02-概要设计.md` §11~§12 | 详细设计承接清单、设计风险与待确认事项 | 作为本轮继续展开和挂起风险的边界 |

已确认结论:

```text
本轮详细设计覆盖 L0-core P0 主链的完整实现契约。
本轮不展开 P1 增强能力、相邻仓实现、完整测试方案、验收标准或实施计划。
```

依赖的前序 Step:

```text
Step 1 已确认概要设计输入边界。
```

---

## 3. SOP 问题回答

### 3.1 本轮详细设计必须覆盖哪些模块?

回答:

本轮必须覆盖概要设计 §5 已收稳的 6 个业务主要组成部分,并覆盖支撑它们的技术承载与外部适配集合。

| 范围 | 必须覆盖的模块 / 组成部分 | 详细设计要展开什么 |
|---|---|---|
| P0 主链 | 契约变更承接与输入收口 | command handler、input guard、change service、scope policy、definition/use boundary guard |
| P0 主链 | 契约真相与领域契约组织 | `ContractDefinition`、`ContractScope`、`ContractVersion`、`ContractLifecycle`、`ContractEvolutionRecord`、六个 `ContractPackage` 的完整实现契约 |
| P0 主链 | 兼容性门禁与发布基线 | release service、compatibility service、release baseline、compatibility status、release policy、reference validation、fingerprint policy |
| P0 主链 | 快照派生与下游消费 | snapshot service、release snapshot、downstream consumption ref、snapshot repository / blob ref 绑定 |
| P0 主链 | 引用索引与追溯查询 | query api、trace service、standard mapping、event catalog reference、compatibility trace index、read model、trace projection、external reference |
| P0 主链 | 后台校验与事实输出 | operations trigger / service、fact service、fact record、outbox relay worker、validation / snapshot / index / fingerprint / fact jobs |
| 支撑集合 | 技术承载与外部适配 | repositories、ports、unit of work、audit、outbox、gate、reference resolver、event publisher、clock、id generator |

### 3.2 本轮必须定义哪些对象、接口、事件、job 和状态机?

回答:

| 类别 | 本轮必须定义 | 详细设计输出 |
|---|---|---|
| 对象 | `ContractDefinition`、`ContractScope`、`ContractVersion`、`ContractLifecycle`、`ContractEvolutionRecord` | Rust struct / enum / value object、字段、函数、状态守卫、Rustdoc 注释 |
| 对象 | `ContractReleaseBaseline`、`CompatibilityStatus`、`ContractReleaseSnapshot`、`ContractFactRecord`、`DownstreamConsumptionRef` | 发布、快照、事实和消费引用的实现契约 |
| 对象 | 六个 `ContractPackage` 对象族 | 共享字段、包生命周期、消费域差异、view 输出边界 |
| 对象 | `StandardMappingIndex`、`EventCatalogReference`、`CompatibilityTraceIndex`、`ContractReadModel`、`ContractTraceProjection`、`ExternalReference` | 索引、投影、引用和追溯对象契约 |
| DTO / value object | `CommandMetadata`、`QueryMetadata`、receipt、view、query、event payload 等 | 正式对象化或明确挂起 |
| Command | `CreateContractDraft`、`UpdateContractDraft`、`SubmitContractForReview`、`PublishContractBaseline`、`UpdateContractLifecycle` | 请求 / 响应 DTO、handler、service 调用、错误映射、幂等 |
| Query | `GetContractDefinition`、`ListContractDefinitions`、`GetContractReleaseBaseline`、`GetContractReleaseSnapshot`、`TraceContractEvolution`、`GetCompatibilityTrace`、`GetContractPackage`、`GetContractGuideSample` | 查询 DTO、read model / projection 读取、stale / rebuilding 语义 |
| Outbound Event | `ContractDraftChanged`、`ContractReviewSubmitted`、`ContractBaselinePublished`、`ContractLifecycleChanged`、`ContractCompatibilityStatusChanged`、`ContractSnapshotReady`、`ContractFactPublished` | event schema、发布方、消费边界、outbox 关系、版本策略 |
| Operations Job | `ValidateContractChangeJob`、`DeriveReleaseSnapshotJob`、`RebuildContractIndexJob`、`RecalculateFingerprintJob`、`PublishContractFactJob` | job 输入 / 输出、触发方式、幂等、失败和重试边界 |
| 状态机 | `ContractLifecycle`、`CompatibilityStatus`、`ContractReleaseBaseline`、`ContractReleaseSnapshot`、`ContractFactRecord`、`DownstreamConsumptionRef`、read model / projection / trace index、`ContractPackageLifecycle` | 状态转换矩阵、允许 / 禁止迁移、非法转换错误 |

### 3.3 哪些能力属于 P1 / 后续阶段,不应在本轮展开?

回答:

| 后续能力 | 不在本轮展开的原因 | 后续归属 |
|---|---|---|
| method plugin / marketplace metadata / package listing | 不属于 L0-core P0 契约来源主链,容易污染定义发布闭环 | 后续 P1 或 marketplace 相关设计 |
| variability、dependency DAG、复杂组合规则 | 概要设计已明确 P1 不得污染 P0 主链 | 后续 P1 详细设计 |
| SDK 高层客户端、认证封装、开发者体验 | 属于 `L0-sdk`,不是本仓实现范围 | `L0-sdk` |
| bus 投递、订阅、ack、retry、dead-letter | 属于 `L0-bus`,本仓只定义 outbox / event publisher 边界 | `L0-bus` |
| L1 业务聚合、业务状态机、业务规则 | 下游业务真相不属于 `L0-core` | 各 L1 仓 |
| 观测日志查询、归档正文、运行时执行正文 | 不属于契约来源仓真相 | L4 / L2 相关仓 |
| 完整 UI / console 页面和交互文案 | 本仓只提供 query / view 契约 | UI / console 设计 |
| Inbound Event Consumer 主线 | 概要设计已确认当前主线不纳入 | 未来若需要,回退概要设计 Step 7 / Step 8 |

### 3.4 哪些内容属于测试方案、实施计划、配置设计或运维手册?

回答:

| 内容 | 不进入本轮详细设计正文的部分 | 留给哪一层 / 哪份文档 |
|---|---|---|
| 完整测试策略、覆盖率目标、测试排期 | 详细设计只写测试切口与最小验证清单 | `05-测试方案.md` |
| 验收场景、验收证据、一票否决执行记录 | 详细设计只承接可验证接口和状态边界 | `06-验收标准.md` |
| 开发阶段、任务拆分、提交顺序、排期 | 详细设计只给实施计划承接清单 | `07-实施计划.md` |
| 部署拓扑、告警阈值、故障处置流程 | 详细设计只写代码埋点、审计和健康检查切口 | 部署 / 运维手册 |
| 环境矩阵、配置手册、密钥管理说明 | 详细设计只定义代码读取哪些配置项和依赖绑定 | 配置设计 / 运维文档 |
| 数据库迁移执行步骤 | 详细设计只定义表、索引、事务和一致性契约 | 实施计划 / migration 文档 |

### 3.5 实现者拿到本文后,应能完成哪些代码范围?

回答:

实现者拿到正式详细设计后,应至少能完成以下代码范围。

| 代码范围 | 完成标准 |
|---|---|
| 仓库布局 | 按详细设计创建 crate / module / file tree,并知道每个文件职责 |
| domain 类型 | 实现关键 struct / enum / value object,包含 Rustdoc 注释、字段、函数和不变量 |
| application service | 实现 command、query、release、snapshot、trace、fact、operations 的编排边界 |
| ports / repositories | 实现 repository、audit、outbox、gate、reference、blob、event publisher、clock、id、unit of work trait |
| API / protocol DTO | 实现 Command / Query / Event / Job 请求响应、schema 和错误映射 |
| processing flow | 按函数级调用链实现写路径、读路径、追溯路径和作业路径 |
| state machine | 实现状态转换矩阵、非法迁移错误和状态守卫 |
| persistence / consistency | 实现真相、基线、快照、引用、投影、outbox 的持久化和事务边界 |
| error / recovery | 实现幂等冲突、兼容失败、快照失败、stale、事实失败、引用失效等错误与恢复口径 |
| observability / audit | 实现必要日志、metric、trace、audit 切口 |
| test slices | 按最小验证清单写单元测试、集成测试和契约测试切口 |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` §1~§3 | 范围仍围绕 shared primitive、ID / Ref / DTO / enum / error / metadata | 与新版 P0 契约来源主链不一致 |
| 旧版 `03-详细设计.md` 目录树 | 先给出旧实现目录,没有先声明本轮实现范围和非范围 | 文件布局会先入为主,导致 Step 4 难以校准 |
| 当前正式 `02` §12 | Metadata / Receipt / View 仍是待对象化风险 | Step 2 必须把它们纳入本轮详细设计范围,不能留给实现者自造 |
| 当前正式 `02` §7 | 不纳入 Inbound Event Consumer | Step 2 必须明确它不是本轮范围,避免 Step 8 误加 consumer |
| 当前正式 `02` §10 | 快照失败、读面 stale、事实发布失败已经有概要语义 | Step 2 必须纳入本轮错误 / 恢复契约范围 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 本轮范围 | 旧文档隐含为共享 primitive 注册、查询和消费 | 明确为 L0-core P0 契约来源主链完整实现契约 | 对齐新版 `02` |
| 模块覆盖 | 旧文档按 primitive 类型拆 | 覆盖 6 个业务主要组成部分 + 技术支撑集合 | 对齐概要设计 §5 |
| 接口覆盖 | 旧文档只列 register/query 类型接口 | 覆盖 Command / Query / Outbound Event / Operations Job | 对齐概要设计 §7 |
| P1 边界 | 旧文档未清晰区分 | 明确 plugin、marketplace、variability、dependency DAG 等不进入本轮 | 防止 P1 污染 P0 |
| 下游文档边界 | 旧文档混有测试、上线和实现计划倾向 | 明确测试方案、验收标准、实施计划和运维文档边界 | 保持详细设计只写实现契约 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只覆盖最小 domain 对象和 command | 文档较短 | 无法让另一个 agent 1:1 实现完整 P0 闭环 | 不采用 |
| 方案 B: 覆盖 P0 主链完整实现契约,排除 P1 和相邻仓实现 | 能支撑实现,边界清晰 | 篇幅较长,需要分 Step 展开 | 采用 |
| 方案 C: 同时覆盖 P0 + P1 + bus / sdk / marketplace 协作 | 看起来完整 | 严重越界,会破坏 L0-core 边界 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 设计目标表

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| 固定实现布局范围 | 选择并定义本仓 Rust 实现布局、实现单元、模块和文件职责 | 可直接创建目录和文件 |
| 固定模块实现契约 | 覆盖 6 个业务主要组成部分和技术支撑集合 | 每个模块有职责、依赖、对象、trait、错误和测试切口 |
| 固定对象实现契约 | 将概要对象轮廓展开为完整 Rust struct / enum / value object | 字段、函数、返回、错误、Rustdoc 注释和不变量可直接实现 |
| 固定 trait / port / adapter 契约 | 定义 repository、audit、outbox、gate、reference、blob、event publisher、clock、id、unit of work 等边界 | 实现者知道哪些依赖通过 trait 注入 |
| 固定协议契约 | 定义 Command / Query / Outbound Event / Operations Job 的 DTO、schema、handler 和错误映射 | 可实现 API handler、event payload 和 job input / output |
| 固定函数级处理流 | 展开草稿、评审、发布、生命周期、读、追溯、校验、快照、索引、事实发布路径 | 可按调用链实现 service、domain、repo、outbox 和 projection 交互 |
| 固定状态与错误契约 | 定义状态转换矩阵、非法迁移、错误 enum、恢复口径、幂等和重试边界 | 可实现状态守卫、错误映射和恢复逻辑 |
| 固定持久化与一致性契约 | 定义真相、基线、快照、引用、投影、outbox 的存储与事务边界 | 可实现 repository、transaction、projection rebuild 和 outbox 顺序 |
| 固定配置、审计和测试切口 | 定义配置依赖、外部绑定、日志 / metric / trace / audit 和最小验证清单 | 可进入实施计划和测试方案 |

### 7.2 非范围表

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 需求目标、用户故事、功能需求、验收指标重写 | `00-需求文档.md` |
| 系统上下文、架构选型、备选方案取舍重写 | `01-架构设计.md` / ADR |
| 概要设计对象名、接口名、处理流和状态族重新命名 | 回退 `02-概要设计.md` 对应 Step |
| method plugin / marketplace metadata / package listing | 后续 P1 设计 / `L6-marketplace` |
| variability、dependency DAG、复杂组合规则 | 后续 P1 详细设计 |
| `L0-bus` 投递、订阅、ack、retry、dead-letter | `L0-bus` |
| `L0-sdk` 高层客户端、认证封装、重试和开发者体验 | `L0-sdk` |
| L1 业务聚合、业务状态机、业务规则 | 各 L1 仓 |
| 观测日志查询、归档正文、运行时执行正文 | L4 / L2 相关仓 |
| Inbound Event Consumer 主线 | 当前不纳入;未来若需要,回退概要设计 Step 7 / Step 8 |
| 完整测试策略、覆盖率目标和测试排期 | `05-测试方案.md` |
| 验收证据和一票否决执行记录 | `06-验收标准.md` |
| 开发任务拆分、提交顺序和排期 | `07-实施计划.md` |
| 部署拓扑、告警阈值和故障处置流程 | 部署 / 运维手册 |
| 环境矩阵、配置手册、密钥管理说明 | 配置设计 / 运维文档 |

---

## 8. 回填草稿

可直接回填到正式 `03-详细设计.md` §2 的草稿结构:

```md
## 2. 本次详细设计目标与范围

> 校准来源:
> - `design-calibration/03_ddd_step_02_scope.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/03_ddd_step_02_scope.md` 的“结构化中间产物”“回填草稿”和“待确认事项”小节,了解本轮详细设计的实现范围和非范围如何从概要设计承接清单收敛而来。

本轮详细设计覆盖 `L0-core` P0 主链的完整实现契约,包括 6 个业务主要组成部分、技术支撑集合、关键对象、Command / Query / Outbound Event / Operations Job、函数级处理流、状态矩阵、持久化、错误、幂等、配置、审计和测试切口。

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| 固定实现布局范围 | 选择并定义本仓 Rust 实现布局、实现单元、模块和文件职责 | 可直接创建目录和文件 |
| 固定模块实现契约 | 覆盖 6 个业务主要组成部分和技术支撑集合 | 每个模块有职责、依赖、对象、trait、错误和测试切口 |
| 固定对象实现契约 | 将概要对象轮廓展开为完整 Rust struct / enum / value object | 字段、函数、返回、错误、Rustdoc 注释和不变量可直接实现 |
| 固定协议契约 | 定义 Command / Query / Outbound Event / Operations Job 的 DTO、schema、handler 和错误映射 | 可实现 API handler、event payload 和 job input / output |
| 固定函数级处理流 | 展开草稿、评审、发布、生命周期、读、追溯、校验、快照、索引、事实发布路径 | 可按调用链实现 service、domain、repo、outbox 和 projection 交互 |
| 固定状态与错误契约 | 定义状态转换矩阵、非法迁移、错误 enum、恢复口径、幂等和重试边界 | 可实现状态守卫、错误映射和恢复逻辑 |

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 需求目标、用户故事、功能需求、验收指标重写 | `00-需求文档.md` |
| 系统上下文、架构选型、备选方案取舍重写 | `01-架构设计.md` / ADR |
| method plugin / marketplace metadata / variability / dependency DAG | 后续 P1 设计 |
| `L0-bus` 投递、订阅、ack、retry、dead-letter | `L0-bus` |
| `L0-sdk` 高层客户端、认证封装、重试和开发者体验 | `L0-sdk` |
| L1 业务聚合、业务状态机、业务规则 | 各 L1 仓 |
| 完整测试策略、验收证据、开发排期和提交顺序 | `05-测试方案.md` / `06-验收标准.md` / `07-实施计划.md` |
```

---

## 9. 待确认事项

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 本轮是否覆盖完整 P0 主链 | A. 只覆盖最小 domain; B. 覆盖完整 P0 主链; C. 同时覆盖 P0 + P1 | B | 目标是让另一个 agent 1:1 实现 L0-core P0 闭环,同时避免 P1 越界 | 已自动确认采用 B |
| 是否把 Metadata / Receipt / View 对象化纳入本轮 | A. 纳入; B. 留给实现者自造; C. 后续再补 | A | 概要设计已将其列为风险,详细设计必须正式处理 | 已自动确认采用 A |
| 是否纳入 Inbound Event Consumer | A. 纳入; B. 不纳入; C. 留空壳 | B | 概要设计已确认当前主线不纳入,若未来需要必须回退概要设计 | 已自动确认采用 B |

---

## 10. 进入下一步条件

- 已明确本轮详细设计覆盖 `L0-core` P0 主链完整实现契约。
- 已明确 6 个业务主要组成部分和技术支撑集合都进入本轮。
- 已明确对象、接口、事件、job、状态机、错误、持久化、幂等、配置、审计和测试切口都需要继续展开。
- 已明确 P1、相邻仓实现、完整测试方案、验收标准和实施计划不进入本轮详细设计正文。
- 可以进入 Step 3 “收稳编码规范、语言 / runtime、仓库约束”。
