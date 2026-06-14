# Step 2. 明确本仓设计目标与当前范围

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 2
> 回填章节: `02-概要设计.md` §2 本次设计目标与范围
> 生成日期: 2026-06-11
> 状态: 已完成,等待用户审核

---

## 1. Step 状态 + Step 内计划

| 计划项 | 状态 | 产物位置 |
|---|---|---|
| 读取 Step 1 上游边界、`00/01` 和概要 SOP Step 2 | 已完成 | §2 |
| 回答 Step 2 SOP 问题 | 已完成 | §3 |
| 诊断旧 Step 2 与当前材料的差距 | 已完成 | §4 |
| 比较改动前后口径 | 已完成 | §5 |
| 记录采用 / 不采用的设计取舍 | 已完成 | §6 |
| 输出设计目标表、范围表、非范围表和深度口径 | 已完成 | §7 |
| 判断本 Step 是否需要拆分 | 已完成 | §8 |
| 形成正式 `02` §2 回填草稿 | 已完成 | §9 |
| 列出待确认事项和进入下一步条件 | 已完成 | §10~§11 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步用途 |
|---|---|---|
| `02_hld_step_01_upstream_boundary.md` | 已完成并已获用户认可 | 提供上游关系、本文不再回答 / 必须回答清单和输入风险 |
| `projects/L1-identity/00-需求文档.md` | 当前需求输入 | 提供 `C-ID-1`~`C-ID-5`、`FR-ID-*`、`BR-ID-*`、`VETO-ID-*`、`OQ-ID-*` |
| `projects/L1-identity/01-架构设计.md` | 当前架构输入 | 提供 identity truth center、正式承接层、typed refs、query no-write、eventual propagation、report-only maintenance 等机制 |
| `standards/document/概要设计讨论流程_SOP.md` | 最新流程标准 | 规定本 Step 只收目标、范围和深度 |
| `standards/document/概要设计书写规范.md` | 最新正式结构标准 | 规定正式 `02` §2 的输出位置 |
| 旧 `02_hld_step_02_goals_scope.md` | legacy draft | 只作为诊断输入,不得直接继承为新版结论 |

---

## 3. SOP 问题回答

### 3.1 本次概要设计最主要要把哪些结构说清?

本次概要设计要把 `L1-identity` 从需求和架构结论转译为可进入详细设计的代码主体骨架。重点是说清:

- 身份 truth center 如何组织成代码主体框架。
- `C-ID-1`~`C-ID-5` 如何落到主要组成部分、职责、边界和候选对象入口。
- 哪些关键对象在概要层成立,以及它们属于 truth、snapshot / projection、reference、trace / history、outbox、report 还是 policy / guard 类轮廓。
- Command、Query、Event、Operations Job、外部 resolver / handoff / publisher 等接口类别如何承接需求接口与架构交互方式。
- 建档、读取、生命周期变化、角色能力摘要更新、生涯追加、memory refs、消费追溯、投影维护、reference refresh、handoff 和 report-only 对账等关键处理流如何串起对象、接口与状态。
- 身份、生命周期、来源引用、摘要、投影、handoff、对账和降级状态如何定义到足以进入详细状态矩阵。
- 哪些异常和边界场景必须在概要层被点名,避免详细设计或实现阶段自行补规则。
- 哪些配置影响需要进入后续 `03/04`,以及哪些边界不得被配置改变。

### 3.2 这一轮概要设计应停在什么深度,才算足够支撑进入详细设计?

本轮停在“可实现结构骨架”深度:

- 可以点名正式对象名、主要组成部分、接口类别、关键 command/query/event/job 名、处理流名和状态名。
- 可以列关键字段骨架,字段必须带类型名,但不写完整字段全集、序列化 schema、数据库列或索引。
- 可以列成员函数 / 工厂函数骨架,参数必须带类型名和参数名,但不写完整 Rust 签名、实现代码或完整调用链。
- 可以画结构图和处理流骨架图,但不写详细时序、事务脚本、retry policy、topic map 或部署参数。
- 可以保留待闭口接缝,但不得把未闭口的 source protocol、basis schema、visibility marker、performance threshold 或 config schema 写成已定论。

### 3.3 哪些内容属于本次概要设计范围?

属于本次概要设计范围的内容是 identity 自身可承接的结构骨架:

- 身份锚定与稳定引用:成员身份主语、身份摘要读取、引用不复用、tombstone 轮廓。
- 生命周期可用性:全局 lifecycle 状态、高风险处置 basis 接缝、生命周期追溯轮廓。
- 角色能力摘要:role / capability source ref、safe summary、evidence ref、source stale / unavailable 轮廓。
- 生涯与记忆引用:career append、ProjectMember / work source ref、memory ref、archive / migration / handoff marker。
- 消费与追溯:query / projection、accepted fact propagation、trace / audit / history、outbox、consumer visibility、stale / degraded。
- 派生维护与对账:projection rebuild、reference refresh、reconciliation finding、report-only maintenance、duplicate / replay 轮廓。
- 外部协作接缝:method-library、work、governance、archive / memory、observability、downstream consumers 的 runtime adapter / event / handoff 边界。
- 详细设计承接:哪些对象、port、DTO、event、job、状态矩阵、持久化和测试切口必须在 `03` 或后续文档闭口。

### 3.4 哪些内容虽然相关,但当前不进入概要设计范围?

当前不进入概要设计范围的内容包括:

- 需求目标、用户故事、功能需求、验收标准的重新裁定。
- 架构级职责边界、系统上下文、依赖方向、数据 ownership、通信方式和方案取舍的重新裁定。
- 认证、账号、credential、token、session、gateway auth、授权裁决 truth。
- `ProjectMember` truth、work task truth、method-library 的 RoleDefinition / CapabilityDefinition 正文、memory / artifact / conversation / runtime body。
- 完整 protocol schema、DTO 字段全集、event payload 全量结构、job request / receipt 全量结构。
- 完整 repository / port 签名、事务顺序、idempotency stored result、版本并发规则、DDL 和索引。
- 配置 JSON、profile 文件、环境变量、CLI args、adapter registry 实现和部署拓扑。
- 测试矩阵、验收证据、实施 commit 计划和实现仓目录文件路径。

### 3.5 哪些内容应留给详细设计,而不应在本章提前展开?

应留给 `03-详细设计.md` 和后续文档的内容是可落码契约:

- 对象 contract、值对象、enum variants、字段完整类型、构造器和状态迁移函数。
- Command / Query / Event / Job DTO schema、错误模型、幂等 key、result replay surface。
- Repository / port / adapter trait、runtime builder、publisher、handoff、resolver、config binding。
- accepted transaction 内的 trace / audit / history / outbox / projection stale / result store 顺序。
- 状态矩阵、非法转移、precondition、postcondition 和异常分支。
- 持久化模型、索引、unique key、cursor、version、transaction consistency。
- 测试切口、验收 evidence、P0 / P1 gate、实施 commit boundary。

---

## 4. 当前材料 / 旧文档问题诊断

| 旧材料 / 倾向 | 问题 | 本轮处理 |
|---|---|---|
| 旧 Step 2 已直接给出对象、port、adapter、job 轮廓 | 粒度偏向详细设计,但缺少对“为什么这些结构属于本轮范围”的诊断和取舍 | 本 Step 只先收目标、范围和深度,对象 / 接口延后 Step 5~7 |
| 旧 Step 2 把 repository / port / adapter 作为范围项并列列出 | 容易让后续 Step 误以为已经可以直接定义 trait 和签名 | 当前只允许点名接口类别和接缝方向,签名后移 `03` |
| 旧 Step 2 没有单独列“范围内但仍未闭口”的事项 | 未闭口 source / basis / visibility / handoff 容易被润色成已定协议 | 本 Step 将其列入范围内接缝或待确认事项,禁止写成 schema |
| 旧 Step 2 没有说明 Step 5~9 小循环深度 | 后续容易一次性生成全仓对象 / 接口 / flow 总表 | 当前明确 Step 5~9 必须按主要组成部分小循环推进 |
| 旧 Step 2 未明确正式 `02` 仍不能作为实现基线 | 可能被实现 agent 提前用于 1:1 落码 | 当前坚持 Step 14 前正式 `02` 仍为占位 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| Step 2 作用 | 直接列概要设计要写的模块与技术面 | 先明确目标、范围、非范围和深度门禁 |
| 结构来源 | 混合需求、架构和旧实现口径 | 只承接已审核 Step 1、当前 `00/01` 和最新版 SOP |
| 对象 / 接口 | 过早进入 repository / port / adapter 轮廓 | 后移到 Step 5~7,本 Step 只规定可展开范围 |
| 未闭口事项 | 容易被范围表吸收为已定能力 | 明确为接缝 / 风险,后续 Step 12~13 承接 |
| 正式文档影响 | 可能让 §2 像详细设计前置表 | §2 只回填目标表、范围表、非范围表和深度口径 |

---

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 继续沿用旧 Step 2 | 不采用 | 旧文件没有按最新版中间产物结构留下诊断、取舍和复杂度判断 |
| 本 Step 一次性拆出所有主要组成部分、对象和接口 | 不采用 | 违反 Step 2 只收范围与深度的约束,也会破坏 Step 5~9 小循环 |
| 只写抽象目标,不列 identity 范围 | 不采用 | 后续 Step 无法判断哪些内容应该进入身份概要结构 |
| 按 `C-ID-1`~`C-ID-5` 和架构机制收出范围边界 | 采用 | 能让后续主要组成部分、对象、接口和 flow 都回指需求 / 架构来源 |
| 将未闭口事项写为接缝和待确认,不写为定论 | 采用 | 防止后续 `03` 或实现 agent 自行补 schema / port / 状态 |

---

## 7. 结构化中间产物

### 7.1 设计目标表

| 目标 | 说明 | 交付给详细设计的结果 |
|---|---|---|
| 收稳代码主体框架 | 把 identity truth center、正式承接层、消费投影、trace / outbox / maintenance 等机制转译为代码主体骨架 | `03` 可继续定义 crate / module / application service / domain / port / infra adapter 关系 |
| 收稳主要组成部分 | 按身份锚定、生命周期、角色能力、生涯记忆、消费追溯、派生维护等主轴说明职责和边界 | Step 5 可形成主要组成部分表、对象候选入口和停审记录 |
| 建立对象发现路径 | 从每个主要组成部分 capability 推导 truth、state、policy、reference、projection、trace、outbox、report 等对象候选 | Step 6 可筛选关键对象并补字段 / 函数骨架 |
| 收稳接口骨架分类 | 按 Command、Query、Event、Operations Job、外部 resolver / publisher / handoff 接缝分类 | Step 7 / `03` 可继续展开 DTO、port、error 和幂等 |
| 收稳关键处理流骨架 | 覆盖创建、读取、生命周期、高风险 basis、角色能力来源变化、生涯追加、memory refs、消费追溯、维护对账等主流 | Step 8 / `03` 可继续展开函数数据流、事务和测试切口 |
| 收稳状态和状态传播轮廓 | 明确身份、生命周期、来源、摘要、projection、reference、handoff、degraded、report-only 等状态类别 | Step 9 / `03` 可继续展开状态矩阵和非法转移 |
| 收稳异常与边界场景 | 覆盖 ref 复用、query 写入、forbidden body、source unavailable、basis 缺失、stale、duplicate、handoff failed 等 | Step 10 / `03` 可继续落错误模型和边界测试 |
| 收稳配置影响轮廓 | 识别 resolver、publisher、handoff、visibility、maintenance、profile 等会受配置影响的区域和不可配置红线 | Step 11 / `04` 可继续定义配置 schema、profile 和加载校验 |
| 收稳详细设计承接清单 | 把概要层已收稳和必须后移闭口的事项分开 | Step 12~13 / `03` 可据此避免自行补口 |

### 7.2 本次概要设计范围表

| 范围项 | 承接来源 | 本轮概要表达深度 |
|---|---|---|
| 身份锚定与稳定引用 | `C-ID-1`, `FR-ID-001`~`FR-ID-003`, `BR-ID-001`~`BR-ID-003` | 主要组成部分、关键对象、command / query、状态和异常轮廓 |
| 生命周期可用性与高风险处置 | `C-ID-2`, `FR-ID-004`~`FR-ID-005`, `BR-ID-004`~`BR-ID-006` | lifecycle 状态、basis 接缝、处理流和追溯轮廓 |
| 角色能力摘要 | `C-ID-3`, `FR-ID-006`~`FR-ID-008`, `BR-ID-007`~`BR-ID-009` | source ref / safe summary / evidence ref / stale 状态和来源变化流 |
| 生涯与 memory refs | `C-ID-4`, `FR-ID-009`~`FR-ID-011`, `BR-ID-010`~`BR-ID-012` | append-only career、reference-only memory / archive、migration / handoff 轮廓 |
| 消费与追溯 | `C-ID-5`, `FR-ID-012`~`FR-ID-014`, `BR-ID-013`~`BR-ID-015` | query / projection、event propagation、trace / history、report-only maintenance |
| 外部来源和消费接缝 | `IF-ID-*`, `DEP-ID-*`, `ADR-ID-ARCH-003`, `ADR-ID-ARCH-010` | 接口类别、方向、禁止源码依赖和 runtime adapter 轮廓 |
| 安全可见与正文排除 | `VETO-ID-003`, `NFR-ID-003`~`NFR-ID-004`, 架构 forbidden body boundary | 字段 / 事件 / trace / report 的边界轮廓,不写 redaction schema |
| 降级、stale、replay、maintenance | 架构 query no-write、eventual propagation、report-only maintenance | 状态和 flow 轮廓,不写 retry policy 或阈值 |

### 7.3 非范围表

| 非范围 | 留给哪一层 | 本轮不进入的原因 |
|---|---|---|
| 需求目标、用户故事、功能需求、验收标准重写 | `00-需求文档.md` | Step 1 已确认 `02` 只承接上游,不重开需求 |
| 系统上下文、职责边界、依赖方向、数据 ownership、技术机制重裁定 | `01-架构设计.md` | 概要设计只转译为实现结构骨架 |
| 完整对象 contract、字段全集、enum variants、构造器和状态迁移函数 | `03-详细设计.md` | 当前只允许关键对象轮廓和字段 / 函数骨架 |
| 完整 Command / Query / Event / Job DTO schema | `03-详细设计.md` | 当前只点名接口类别和关键 surface |
| Repository / port / adapter trait 完整签名 | `03-详细设计.md` | 当前只表达接缝方向和职责 |
| accepted transaction、cursor、version、idempotency、stored result、outbox payload snapshot | `03-详细设计.md` | 属于可落码契约,不能在概要层半闭口 |
| DDL、索引、存储事务、topic map、retry policy | `03/04/07` | 属于详细设计、配置或实施层 |
| 配置 JSON、profile、env key、CLI args、runtime builder 参数 | `04-配置设计.md` | Step 11 只识别配置影响轮廓 |
| 测试矩阵、验收 evidence、性能阈值、实施 commit boundary | `05/06/07` | 属于测试、验收和实施计划 |
| 认证 / 授权裁决 truth、ProjectMember truth、RoleDefinition body、memory body、runtime body、UI 状态 | 相邻仓或边界外能力 | 已被 `00/01` 排除,不能进入 identity truth 或概要对象 |

### 7.4 当前阶段设计深度口径

- `02` 必须强到能让 `03` 明确“要为哪些对象、接口、flow、状态和边界补详细契约”。
- `02` 不追求能直接让实现 agent 1:1 落码;1:1 落码性由 `03/04/05/06/07` 继续闭口。
- `02` 可以使用正式名词,但正式名词必须能回指 `00/01` 或已审核中间产物。
- `02` 可以写字段 / 函数骨架,但只写关键字段和关键函数,避免完整 schema 化。
- 未闭口事项必须以接缝、风险、待确认或详细设计承接项出现,不得包装成已定规则。
- Step 5~9 必须按主要组成部分小循环展开,每个组成部分完成后停审,再做跨部分闭环审计。

### 7.5 当前范围内但不得假装闭口的事项

| 事项 | 当前概要处理 | 后续闭口位置 |
|---|---|---|
| Role / capability 来源采用 query、event 还是组合 | 保留外部来源接缝和 source state 轮廓 | `03` protocol / port,必要时 `04/05/06` |
| high-risk lifecycle basis 形状和动作枚举 | 保留 basis ref / summary 接缝和缺依据拒绝口径 | `03` 状态矩阵 / flow / DTO,`05/06` |
| memory / archive carrier 和 migration receipt | 保留 reference-only / handoff marker 轮廓 | `03/04` handoff / external binding |
| visibility / privacy 裁剪字段 | 保留 not visible / redacted / degraded 响应轮廓 | `03` query / event schema,`05/06` |
| performance / availability 阈值 | 保留不采用旧硬阈值的风险 | `05` 测试方案和 `06` 验收标准 |
| 旧 `04-配置设计.md` 是否保留 | 不反向约束本轮 `02` | 新版 `03` 完成后复核 `04` |

---

## 8. 复杂度判断 / 是否拆分

本 Step 只收目标、范围和深度,不拆主要组成部分附录。

后续 Step 5~9 复杂度较高,必须拆成主要组成部分小循环。当前预判至少需要围绕以下主轴逐个停审:

- 身份锚定与稳定引用。
- 生命周期与高风险处置。
- 角色能力摘要。
- 生涯与 memory refs。
- 消费追溯与事件传播。
- 派生维护、reference refresh、handoff 和 report-only 对账。

具体组成部分名称以后续 Step 5 审核结果为准,本 Step 不提前定名为最终模块。

---

## 9. 回填草稿

正式 `02-概要设计.md` §2 后续应回填:

1. 设计目标表。
2. 本次概要设计范围表。
3. 非范围表。
4. 当前阶段设计深度口径。
5. 范围内但不得假装闭口的事项。

正式正文要等 Step 14 统一装配,当前不直接回填。

---

## 10. 待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可本 Step 将 `02` 深度限定为可实现结构骨架,而非可直接落码契约 | 若不认可,后续 Step 会过早进入详细设计 | 当前按最新版概要 SOP 限定 |
| 是否认可 Step 5~9 必须按主要组成部分小循环推进 | 若不认可,后续容易再次退化为一次性总表 | 当前按最新版 SOP 执行 |
| 是否认可未闭口 source / basis / handoff / visibility / threshold 只作为接缝和风险 | 若不认可,需要回退到 `00/01` 或提前进入 `03` 裁决 | 当前不在 Step 2 补定论 |

---

## 11. 进入下一步条件

进入 Step 3 前必须满足:

- 用户审核通过本 Step 的设计目标、范围、非范围和深度口径。
- 用户认可本 Step 不拆对象、不拆接口、不写详细契约。
- 用户认可范围内未闭口事项进入后续接缝 / 风险 / 详细设计承接,不得在概要层假装闭口。
