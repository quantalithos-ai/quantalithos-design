# Step 1. 确认概要设计输入边界

## 1. Step 状态与开工确认

- 状态：`completed / pass_with_upstream_blockers`；`current_part = closed`。
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 1；未来回填正式 03 §1/§17。
- 开工门禁：正式 02 已停审，用户已明确授权 03 Step 1～4；项目 ledger 与 03 flow 已建立。
- 写入边界：只写本 Step 校准产物，不修改 historical `03-详细设计.md`，不进入 Step 2 内容。

### 1.1 本 Step 串行计划

1. 读取正式 00/01/02、02 Step 12/14、项目 ledger 和详细设计规范。
2. 回答五项 SOP 问题，区分稳定本地骨架与未闭合外部合同。
3. 形成上游映射、不再回答、必须回答与输入风险清单。
4. 后置审计旧 03/README 污染，形成回填草稿和门禁结论。

## 2. 本步输入

- [正式 00](../00-需求文档.md)、[正式 01](../01-架构设计.md)、[正式 02](../02-概要设计.md)。
- [02 Step 12 详细设计承接](02_hld_step_12_detailed_design_handoff.md)与 [02 Step 14 正式装配](02_hld_step_14_formal_document_assembly.md)。
- [项目台账](project_execution_ledger.md)与 [03 flow](03_ddd_calibration_flow.md)。
- 详细设计 SOP/书写规范、通用中间产物规范、真相源闭环标准、全局依赖规则。
- `L1-workspace` 的 03 Step 1～4 仅作粒度与组织样本，不继承其领域对象或协议。

## 3. SOP 问题回答

1. **直接承接哪些概要结论？** 承接六 CP 与四类实现层、26 个 Archive-owned 正式对象、3 Command、5 no-write Query、5 Consumer、17 Operations Job、7 required/local ports、3 outbound event candidates、多轴状态、38 个异常、14 条配置红线与 source-authority matrix。
2. **代码主体框架是否稳定？** 本地责任与业务主语稳定，足以继续下沉。六 CP 是业务组成部分，不等于六个 crate；同步入口、后台执行、异步消费是运行角色，不等于必须独立部署。
3. **对象、接口、处理流与状态机是否足够？** 足以定义本地模块/文件和后续实现契约；不足以声明 owner/provider/receiver 的 exact schema 或 ready adapter。外部缺口不阻止本地 fail-closed 设计。
4. **哪些仍是轮廓？** 语言/runtime、布局形态在 Step 3/4 收稳；完整字段/constructor/trait/DTO/flow/matrix/UoW/error/concurrency/config/test seam 留 Step 5～16。outbound event 必要性和 workload 数值仍开放。
5. **哪些上游结论不可在 03 重定义？** truth owner、项目 archived/dissolved/restored 状态、RetentionPolicy/legal hold/delete/risk 决定、Artifact 正文/血缘、observability backend、workspace Auxiliary 地位、restore receiver 业务 commit、依赖类型与系统责任均不可暗改。

## 4. 旧材料与当前输入问题诊断

| 位置 | 问题 / 风险 | 本步处置 |
|---|---|---|
| 旧 `03-详细设计.md` | 以 `ArchiveIndex`、`RetentionClass`、`LegalHold` 等对象把索引、治理决定或外部 truth 收进本仓 | 标为污染材料；不继承、不局部修补，Step 19 才删除重建 |
| 旧 README/draft | 固定 Rust、S3/MinIO/Glacier、PostgreSQL、7 年与性能值 | 仅作历史审计；语言、runtime、存储和参数重新核验 |
| 正式 02 typed slots | `ActorContext`、source feedback、material/ref 等名字容易被误读为 exact external schema | 只当本地语义槽位；共享/外部类型须逐项核验 |
| 正式 02 outbound candidates | 三个候选可能被误写成 publisher/outbox 既定需求 | 保留 `AR-HLD-Q-001`；合同关闭前不建发送路径 |
| 外部 source/receiver/capability | 关系稳定但合同未闭合 | 只允许 required seam、blocked wiring 与保守错误 |
| 目标实现仓 | 当前不存在 | 后续只写 planned layout，不声称现状或 baseline |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 03 输入资格 | 正式 02 已完成，但 03 未建立承接门禁 | 明确本地骨架可继续、外部正向接入仍 blocked | 区分设计可推进与集成 ready |
| 业务主语 | 旧 03 与正式 02 并存，容易混读 | 只承接正式 02 的六 CP、26 对象、30 入口 | full-restart 禁止污染继承 |
| 类型含义 | typed slot 可能被当作真实共享/外部类型 | 按 shared candidate / local boundary / external contract 分流 | 不用名字伪造 schema |
| 风险姿态 | blocker 散落于 00~02 | 汇总为 03 后续每步必须保留的完成上限 | 防止后续文件布局掩盖缺口 |

## 6. 设计取舍

| 方案 | 收益 | 代价 / 风险 | 结论 |
|---|---|---|---|
| 承接稳定本地主语，按 blocker 设计 required seam | 可继续产生可落码的本地契约 | 正向 adapter 仍不可标 ready | 采用 |
| 等所有 owner/provider 合同关闭后再做 03 | 无外部占位 | 不必要地阻塞本仓模块、状态与失败契约 | 不采用 |
| 从旧 03/README 继承对象与技术选择 | 速度快 | 复制越权 truth、provider 与假参数 | 禁止 |
| 把 26 对象或六 CP 直接映射为 crate | 表面一一对应 | 混淆业务轴与技术分层，破坏同一 UoW | 不采用，布局留 Step 4 判定 |

## 7. 结构化中间产物

### 7.1 上游关系映射

| 正式来源 | 已收稳输入 | 03 必须继续展开 |
|---|---|---|
| 本仓正式 00 §2/4/6~16 | Archive 价值、范围、使用方、FR/BR/NFR、数据 owner、验收方向 | 代码边界与可验证 seam；不复述用户故事 |
| 本仓正式 01 §4~13/15 | 六 U、容器角色、依赖方向、owner/一致性、交互、技术机制与横切约束 | crate/module 依赖、port/adapter、runtime wiring、事务与错误边界 |
| 本仓正式 02 §4/5 | 六 CP、四实现层与三运行角色 | 技术 role 布局、模块 capability 和唯一文件落点 |
| 本仓正式 02 §6 | 26 个对象及 typed slot | 字段来源、构造/变更、序列化、校验、比较、redaction |
| 本仓正式 02 §7/8 | 30 个入口、7 required ports、3 outbound candidates 与主流程 | DTO/trait/handler/逐接口函数流、外部调用前后本地提交 |
| 本仓正式 02 §9/10 | 多轴状态、允许/禁止传播、38 个异常 | 穷举转换矩阵、error taxonomy、retry/probe/compensation |
| 本仓正式 02 §11~13 | 配置边界、03 深度、风险与 12 个开放项 | 注入/验证/test seams；阻塞项保持显式 |
| `L0-core` 正式文档与真实 contracts crate | shared contract authority 与现有符号候选 | 每个 shared symbol 的语义/导出/路径核验，不建 shadow schema |
| L1 owners / workspace / artifact / observability 正式文档 | canonical/auxiliary/material/ref/receiver owner 边界 | per-owner required port 与 source-authority binding，不导入 sibling 实现 |

### 7.2 本文不再回答

- 不重新定义为何归档、用户故事、优先级、六 CP 或系统责任。
- 不决定或反写 identity、conversation、work、process、governance、artifact、workspace、observability truth。
- 不决定项目 archived/dissolved/restored、保留期限、legal hold、删除许可或风险接受。
- 不把 Bundle 当跨域写权，不把 workspace projection、artifact ref 或审计摘要升格为 canonical truth。
- 不改变 runtime/event/ref/adapter/fake 为 compile 依赖，不将 SDK client、UI、provider/KMS/backend 收入本仓。

### 7.3 本文必须回答

- 计划实现仓的 Rust/runtime/编码与目录约束、布局形态、crate/package/binary/module/file 映射。
- 六 CP 在技术 role 内的模块职责、26 对象的完整实现契约与公开索引。
- 3 Command、5 Query、5 Consumer、17 Job 和 required ports 的完整协议、函数流与错误映射。
- 多轴状态、局部 UoW、manifest revision、snapshot fence、幂等键、并发、commit-unknown、reconcile/compensation。
- 外部合同关闭前的 fail-closed wiring、配置注入点、可观测/审计与测试切口。

### 7.4 输入不足风险

| 缺口 | 受影响设计 | 关闭前姿态 |
|---|---|---|
| `AR-UP-001~002/006~008` source/export/trigger/material exact contract | source adapter、capture、coverage、manifest | per-owner typed seam；missing/stale/conflicting/unknown 显式；adapter blocked |
| `AR-UP-003` governance exact contract | lifecycle eligibility 与删除接缝 | 无正式适用性/有效性证明即 Blocked |
| `AR-UP-004~005` integrity/storage/schema/provider | verification、placement、retrieval、long-term readability | 不造算法/key/digest/location/commit；capability fail-closed |
| `AR-UP-009` restore receiver | material、handoff、probe、compensation | per-owner blocked/unsupported/commit-unknown；不造 success |
| `AR-ARCH-001` SDK 方向冲突 | package graph | Archive 不依赖 SDK compile |
| `AR-HLD-Q-001` outbound family 未定 | outbox/publisher/schema | 合同前无发送路径；若解锁回退 02 Step 6~9 |
| `AR-HLD-Q-002` workload/目标缺失 | batch/page/lease/timeouts/RTO | 不填默认数值，留 04/05/06 与正式 authority |

## 8. 后置历史材料审计

| 历史材料 | 污染口径 | 当前结论 |
|---|---|---|
| 旧 `03-详细设计.md` | ArchiveIndex、RetentionClass、LegalHold 等本仓 truth；固定数据库/对象存储/加密方案 | 全部不继承；只保留“需要索引/retention seam/hold guard/adapter”的问题线索 |
| `README.md` | 技术栈、provider、7 年、性能与完成度 | 不进入正式结论 |
| `draft/03` | pre-calibration 模块/对象/布局候选 | 仅作差异线索，必须由正式 02 和当前 Step 重推 |

## 9. 回填草稿

### 9.1 与上游文档的关系声明

本详细设计只承接已经停审的正式 00/01/02：需求与架构固定业务责任、truth owner、依赖方向和一致性上限；概要设计固定六 CP、26 个对象、30 个入口、required ports、多轴状态与异常边界。本文继续把这些结论展开为 Rust 实现单元、文件、对象、trait、协议、函数流、状态矩阵、事务/并发、配置绑定和测试切口，不重新定义上游责任。

`AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002` 保持开放。受影响内容只能定义 required seam、保守错误和 blocked wiring；任何文件或 fake 的存在都不能证明外部合同、真实材料、commit、handoff 或 readiness。

## 10. 待确认、门禁与进入下一步条件

本步没有需要用户立即裁决的新问题。持续 blocker 均有 owning authority 和安全姿态；它们不阻塞 Step 2～4 的本地静态设计。

| 检查项 | 结论 |
|---|---|
| 上游映射 | 六 CP、26 对象、30 入口、状态/异常/配置均可回指正式 02 |
| 责任边界 | 未新增 truth owner、外部能力、API、对象或状态主语 |
| 输入缺口 | 12 个开放项全部保留，没有润色成 ready contract |
| 历史污染 | 旧 03/README/draft 只作后置审计，不作为基线 |
| 正式写入 | 禁止；Step 19 前 `formal_fill_allowed=false` |

`gate_status = pass_with_upstream_blockers`。已明确详细设计承接什么、必须继续回答什么及哪些接缝仍阻塞，满足进入 Step 2 的条件。
