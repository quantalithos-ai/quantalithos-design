# Step 11. 备选方案与取舍

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 11
> 回填章节: `01-架构设计.md` §12 备选方案与取舍
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步目标

把 `L1-artifact` 当前主线架构方案与主要相邻替代路径放到同一判断框架下比较,说明为什么选择当前方案,为什么放弃其它路径,以及当前方案牺牲了什么、换来了什么。

本步只比较架构层路径级替代关系,不写产品横评、局部实现对比、愿望池、未来可能性大全、API / event / job / schema、数据库、对象存储、Git 后端、搜索产品、hash 算法、队列产品或部署细节。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `design-calibration/01_arch_step_02_goals_constraints.md` | 已完成 | 承接架构目标、不可变约束、当前阶段取舍和非目标。 |
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | 已完成 | 排除职责边界外事项,防止重新包装为备选方案。 |
| `design-calibration/01_arch_step_07_dependency_direction.md` | 已完成 | 承接唯一编译期依赖、依赖倒置和层间约束。 |
| `design-calibration/01_arch_step_08_data_ownership_consistency.md` | 已完成 | 承接数据归属、强一致 / 最终一致和外部正文边界。 |
| `design-calibration/01_arch_step_09_interactions_communication.md` | 已完成 | 承接同步 / 异步 / 后台路径分离。 |
| `design-calibration/01_arch_step_10_technology_choices.md` | 已完成 | 承接关键技术机制和不采用口径。 |
| `projects/L1-artifact/00-需求文档.md` §13 / §15 | 已重建 | 提供 NFR、风险、旧指标后置和后续待确认事项。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 11 | 已读取 | 控制本步只比较路径级替代方案和当前取舍。 |
| `standards/document/架构设计书写规范.md` §4.12 | 已读取 | 控制方案路径比较表、边界说明和轻量取舍表写法。 |
| 旧 `projects/L1-artifact/01-架构设计.md` §10 | 旧 Draft | 作为旧 metadata-first / 全量 DB / Git-only 等实现方案横评诊断输入。 |
| `projects/L1-governance/design-calibration/01_arch_step_11_alternatives_tradeoffs.md` | 已参考 | 只参考“路径级比较 + 不进入比较方向”的组织方式,不复制治理仓结论。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、架构 flow、Step 2 / 3 / 7 / 8 / 9 / 10、SOP Step 11 和书写规范 4.12 | done | 本文件 §2 |
| 读取需求 NFR / 风险、旧架构取舍段和 L1-governance Step 11 框架 | done | 本文件 §2 / §5 |
| 回答主要可选方案、当前选择理由、被放弃方案优点、不采用原因和当前取舍 | done | 本文件 §4 |
| 输出当前主线方案、方案路径比较表、不进入比较方向、轻量取舍表和边界说明 | done | 本文件 §8 |
| 写出 Step 16 可回填草稿 | done | 本文件 §9 |
| 完成 Step 11 自检并更新 flow / 项目台账 | done | 本文件 §11 |

---

## 4. SOP 问题回答

### 4.1 这个仓有哪些主要可选架构方案?

当前主线方案是:

> 以独立 Artifact truth 为核心,通过正式承接边界、依赖倒置、truth / reference / snapshot / derived separation、核心强一致 + 外围最终一致、同步 / 异步 / 后台分离、外部正文引用与内容事实语境分离、version / lineage / baseline 正式锚定、只读派生、幂等顺序保护、traceability / audit backref / handoff 机制构成可审计制品事实架构。

值得比较的相邻替代路径是:

| 替代路径 | 是否进入本章比较 | 判断 |
|---|---|---|
| 内容后端 / 外部正文主导路径 | 是 | 与 Artifact 内容事实语境和外部正文生命周期分离主线构成结构性替代。 |
| metadata-first 存储主导路径 | 是 | 与机制级 truth / reference / snapshot / derived 分离主线构成替代。 |
| 全量对象存储主导路径 | 是 | 与 Artifact truth 独立、外部正文引用和派生消费分离主线构成替代。 |
| 全 Git / 文本仓主导路径 | 是 | 与多类型 Artifact truth 主线构成替代。 |
| 图数据库 / lineage engine 主导路径 | 是 | 与 lineage truth 锚定正式 fact / version、查询实现后置主线构成替代。 |
| 完整事件溯源优先路径 | 是 | 与 traceability / event collaboration / handoff 但不硬化 ES 的主线构成替代。 |
| 全同步闭环路径 | 是 | 与同步 / 异步 / 后台分离构成一致性承接替代。 |
| 全异步事件化路径 | 是 | 与核心 Artifact truth 同步成立 / 拒绝构成替代。 |
| 具体 PostgreSQL、Git、S3、URL、搜索、消息产品或 hash 算法 | 否 | 属于产品级或实现级选择,后续文档收敛。 |
| work、process、governance、archive、observability、sync 等拥有 Artifact truth | 否 | 已被 Step 2 / Step 3 / Step 8 的不可变约束和数据所有权排除,不再作为有效备选方案。 |

### 4.2 为什么当前选择这一种?

当前主线方案能同时满足四个硬目标:

1. Artifact truth 独立成立,不被 work lifecycle、process execution、governance decision、method definition、runtime trace、conversation display、workspace view、archive package、observability store、console state 或 sync copy 替代。
2. 跨仓协作可发生,但只通过 ref、snapshot、safe summary、event、adapter、handoff 或共享 core contract 承接。
3. Artifact fact、content fact context、version、lineage、baseline 和 consumption backref 等核心制品事实保持同步成立、拒绝或挂起口径。
4. 下游消费、搜索、预览、报告、对账、归档交接、观测解释和同步材料允许最终一致,但重复、乱序、stale、unresolved、failed 和 retryable 状态必须可解释。

其它路径通常只能优化某一面:更快进入存储实现、更统一内容承载、更强 lineage 查询、更强审计重放、更强即时感或更彻底解耦,但会牺牲 Artifact truth、外部正文边界、依赖裁剪、历史版本稳定性、baseline truth 或派生不反写。

### 4.3 被放弃方案的主要优点是什么?

| 被放弃方案 | 主要优点 |
|---|---|
| 内容后端 / 外部正文主导路径 | 正文获取、完整性检查和后端生命周期管理更直接。 |
| metadata-first 存储主导路径 | 开发心智简单,查询和列表能力容易想象。 |
| 全量对象存储主导路径 | 二进制、大文档和多类型内容承载直观。 |
| 全 Git / 文本仓主导路径 | 文本审计、diff、历史和分支协作能力天然强。 |
| 图数据库 / lineage engine 主导路径 | 多跳 lineage 查询和关系探索能力更直接。 |
| 完整事件溯源优先路径 | 历史重放、审计叙事和事实演进表达更强。 |
| 全同步闭环路径 | 调用方即时感强,短链路结果更直观。 |
| 全异步事件化路径 | 运行单元更解耦,吞吐扩展和跨仓传播空间更明显。 |

### 4.4 为什么即便有这些优点,当前仍不采用?

这些优点大多是短期实现便利、查询能力、内容承载能力、工具生态、即时体验或表达力收益,但 `L1-artifact` 的首要问题不是“最快落一个内容仓 / metadata store / lineage query engine”,而是“守住可审计制品事实的独立真相”。一旦选择内容后端主导、metadata 存储主导、全对象存储、全 Git、图查询主导、完整 ES 优先或全事件化核心,后续会很难恢复 Artifact fact、version、lineage、baseline、consumption backref、外部正文边界和派生不反写。具体数据库、内容后端、图查询、搜索、hash、事件溯源和同步协议属于后续概要 / 详细 / 配置 / 测试 / 实施问题,不能在当前阶段反向定义制品事实核心。

### 4.5 当前选择牺牲了什么,换来了什么?

| 当前方案牺牲 | 当前方案换来 |
|---|---|
| 初期接入路径更长 | 外部输入不会直接污染核心语义。 |
| adapter / ref / snapshot / safe summary / marker 设计成本更高 | 非 core sibling 仓不会变成编译期依赖或第二真相。 |
| content backend 不能直接成为主模型 | Artifact 内容事实语境和外部正文生命周期边界稳定。 |
| lineage 查询实现不能先行定义模型 | 血缘 truth 锚定正式 fact / version。 |
| search / preview / report / sync 会有派生延迟 | 派生消费不反写 Artifact truth。 |
| 幂等、顺序、traceability 和 handoff 设计更复杂 | 重复、乱序、导出和消费失败不会产生多份制品事实。 |
| 暂不硬化完整 ES / graph engine / object store / Git 后端 | 当前核心闭环更可控,复杂能力有清晰演进空间。 |

---

## 5. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `01-架构设计.md` §10 | 用 metadata-first / 全量对象存储 / 全量 Git 做取舍 | 这是存储实现路径横评,没有先比较 Artifact truth 主线与结构性替代路径。 | 改为路径级方案比较,存储产品后置。 |
| 旧 §9 / §10 | PostgreSQL recursive CTE、graph DB、hash watcher 等混入方案比较 | 属于查询 / 完整性实现变体,不是本章主线方案。 | 只作为不进入比较或后续观察项。 |
| Step 2 / Step 3 / Step 8 | 已排除相邻仓和外部正文拥有 Artifact truth | 不能把已排除事项重新包装成方案。 | 本章只比较仍在边界内的相邻替代路径。 |
| Step 10 | 已列单项关键技术机制 | 本步需要路径级取舍,不能重写每项机制理由。 | 主表按方案路径比较。 |

---

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 方案取舍表达 | 存储和查询实现横评 | 架构路径级比较 | 对齐架构规范 4.12。 |
| metadata-first | 被写成当前整体方案 | 降为一种存储主导路径,当前不作为主线 | 防止对象 / 存储策略反向定义 truth。 |
| 全量 DB / Git-only / graph DB / realtime watcher | 实现替代方案 | 产品 / 实现候选,不主导当前章节 | 避免产品横评污染架构取舍。 |
| 边界外职责 | 可能再次进入讨论 | 明确不作为有效备选方案 | 尊重 Step 2 / Step 3 / Step 8 的不可变约束。 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只保留 Step 10 的单项机制说明 | 简短。 | 缺路径级替代方案比较。 | 不采用。 |
| 方案 B: 按结构性替代路径做方案比较 | 能说明当前主线为什么成立。 | 表格较长。 | 采用。 |
| 方案 C: 加入数据库、内容后端、搜索、hash、消息产品横评 | 接近实现讨论。 | 违反本章边界。 | 不采用。 |
| 方案 D: 把所有未来增强都列为备选方案 | 看似完整。 | 会把愿望池和正式取舍混在一起。 | 不采用。 |

### 7.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 |
|---|---|---|---|
| content backend 是否作为当前主线 truth source | A. 是;B. 否,只作为外部正文来源或实现候选 | B | Artifact 拥有内容事实语境,不拥有外部正文生命周期。 |
| metadata-first 是否作为当前主线架构 | A. 是;B. 否,只作为后续存储 / 对象设计候选 | B | 当前主线是 truth / reference / snapshot / derived 分离,不是字段 / 存储方案。 |
| 完整事件溯源是否作为当前主线 | A. 作为 P0 必选;B. 保留观察,当前只采用追溯、事件协作和 handoff 机制 | B | 当前需要可追溯,但完整 ES 会过早锁定实现范式。 |
| graph lineage engine 是否作为当前主线 | A. 是;B. 否,只作为后续查询实现候选 | B | 血缘 truth 先由 fact / version 锚定,查询引擎后置。 |

---

## 8. 结构化中间产物

### 8.1 当前主线方案

当前采用的主线方案是:

```text
独立 Artifact truth 核心
  + 正式承接边界隔离外部输入
  + 运行期接缝 / 引用 / 快照 / safe summary / event / handoff
  + Artifact truth / external reference / snapshot / derived separation
  + Artifact 核心 truth 强一致
  + 下游消费 / 搜索 / 预览 / 报告 / 对账 / 归档 / 观测 / 同步最终一致
  + 同步 / 异步 / 后台三类路径分离
  + 外部正文引用与 Artifact 内容事实语境分离
  + version / lineage / baseline 正式锚定
  + 只读派生消费
  + 幂等 / 顺序保护
  + traceability / audit backref / handoff
```

该方案的核心判断是:Artifact 的 truth center 必须独立稳定,外部能力只能经正式边界进入,下游消费不能直接绑定核心结构,派生和交接可以延迟收敛但不能反写真相。

### 8.2 方案路径比较表

| 方案路径 | 解决的问题 | 主要收益 | 主要代价 / 约束 | 当前结论 | 说明 |
|---|---|---|---|---|---|
| 独立 Artifact truth + 正式边界协作主线 | 在多仓协作中保持制品事实、版本、血缘、基线和消费回指独立、可审计、可消费、可追溯。 | 同时保护 truth 边界、依赖裁剪、外部正文归属、历史版本、baseline truth、派生不反写和归档交接。 | 增加承接、adapter、snapshot、derived、handoff、idempotency 和 audit backref 成本。 | 采用 | 这是当前主线方案,最符合 Step 2~10 已收敛约束。 |
| 内容后端 / 外部正文主导路径 | 用内容存储、content ref、hash 或 content-addressing 统一承载 Artifact。 | 正文获取、完整性检查和后端生命周期管理直观。 | 外部正文和后端生命周期会靠近 truth center,容易让 storage / hash 反向定义 Artifact truth。 | 不采用 | 内容后端只能作为外部正文来源或实现候选,不得拥有制品事实。 |
| metadata-first 存储主导路径 | 以 metadata / relations / baseline 等对象存储结构组织 Artifact。 | 开发和查询心智简单,旧材料可复用度高。 | 对象 / 表结构会反向定义 truth,且容易把派生、外部引用和正式事实混成一层。 | 不采用 | 机制级分层先于对象 / 存储方案。 |
| 全量对象存储主导路径 | 用对象存储统一承载正文、版本和大型材料。 | 多类型内容承载直观,对二进制和大文档友好。 | 存储对象会被误读为 Artifact truth,查询、版本和血缘语义仍需另行定义。 | 不采用 | 对象存储可作为后续内容来源或正文承载候选,不是架构主线。 |
| 全 Git / 文本仓主导路径 | 用 Git 风格历史、diff、branch 和审计处理 Artifact。 | 文本审计、历史和协作能力强。 | 无法覆盖全部 Artifact 类型,且 Git 历史不等于 Artifact version / baseline / lineage truth。 | 不采用 | Git 可作为某类内容来源,不能成为全仓 truth owner。 |
| 图数据库 / lineage engine 主导路径 | 用图查询能力优先组织血缘和影响分析。 | 多跳关系探索和影响查询能力强。 | 查询图会诱导模型围绕 traversal 优化,可能替代正式 fact / version 锚定。 | 不采用 | Lineage truth 先锚定正式版本,图查询作为后续实现候选。 |
| 完整事件溯源优先路径 | 强化历史重放、事实演进和审计叙事。 | 追溯表达强,天然强调追加和重放。 | 在对象、状态和事件契约尚未细化前过早锁定持久化范式,提高 P0 复杂度。 | 保留观察 | 当前采用 traceability / audit backref / event collaboration / handoff,不把完整 ES 作为 P0 必选。 |
| 全同步闭环路径 | 让制品纳管、传播、派生、归档、观测和同步消费同步完成。 | 调用方即时感强,表面完整性清晰。 | 下游消费、报告、归档、观测和同步会阻塞或回滚 Artifact 主事实。 | 不采用 | 只适合核心 truth 即时判断,不适合作为全局交互主线。 |
| 全异步事件化路径 | 最大化运行解耦和吞吐弹性。 | 异步能力强,入口压力小,传播扩展空间明显。 | Artifact fact、version、lineage、baseline 和 consumption backref 缺少即时成立 / 拒绝口径。 | 不采用 | 核心制品事实必须有同步收口,不能全部异步化。 |
| 派生 / search / preview / report first 路径 | 优先满足发现、预览、报表和消费体验。 | 展示和消费推进快,用户体验更早显化。 | 读模型和展示结构会反向塑造核心 truth,形成第二制品事实。 | 不采用 | 派生消费只能从 Artifact truth 出发。 |

### 8.3 不进入本章正式比较的方向

| 方向 | 不进入比较的原因 | 正确处理 |
|---|---|---|
| Work lifecycle / WorkProduct 拥有 Artifact truth | Step 3 / Step 8 已确认 work truth 不归 Artifact。 | Work 提供语境或消费 Artifact truth。 |
| Process output / Activity 状态拥有 Artifact fact 或 lineage | Step 3 / Step 8 已确认 process execution truth 不归 Artifact。 | Process 提供产出语境或候选输入,Artifact 收束事实。 |
| Governance decision / AIIA / SoA 拥有 Artifact baseline | Step 8 已确认 governance truth 不替代 Artifact baseline truth。 | Governance 消费或引用 Artifact baseline。 |
| Conversation / workspace display 拥有 Artifact current view | Step 8 已确认显示、视图和局部状态不拥有 Artifact truth。 | Conversation / workspace 只显化或消费。 |
| Runtime trace / tool result / model context 拥有 lineage | Step 8 已确认运行材料只能作为线索或摘要。 | Runtime / capability 输入经 Artifact 正式收束。 |
| Observability audit store 拥有 Artifact audit truth | Step 8 已确认物理观测正文和 trace store 不归 Artifact。 | Observability 消费交接材料并提供观测摘要。 |
| Archive package 拥有 baseline / version truth | Step 8 已确认归档包不替代 Artifact truth。 | Archive 消费 Artifact version / baseline 并保留恢复交接。 |
| 具体数据库、消息中间件、内容后端、搜索产品、hash 算法 | 这些是实现或产品载体,不改变本章路径级取舍。 | 后续概要、详细、配置、测试、实施或 ADR 收敛。 |

### 8.4 轻量取舍对照表

| 当前方案得到 | 当前方案失去 |
|---|---|
| 独立 Artifact truth 和清晰职责边界 | content backend / metadata store 的短期集中便利。 |
| 非 core sibling 仓不进入编译期依赖 | 直接复用相邻仓模型的开发便利。 |
| 外部正文不反向定义 Artifact | 全量内容后端主导的统一存储心智。 |
| Version / lineage / baseline 锚定正式 fact / version | 查询引擎优先带来的快速图探索。 |
| 派生、search、preview、report、sync 不反写真相 | 派生视图立即成为管理主结构的速度。 |
| 核心 Artifact truth 可同步收口 | 全事件化带来的极致解耦。 |
| 下游传播、归档、对账可最终一致 | 全同步端到端即时完成感。 |
| 关键变化、消费和交接可追溯 | 需要维护 audit backref / handoff / failed / retryable 状态。 |

### 8.5 方案边界说明短文

本章只比较会改变 `L1-artifact` 主线结构的相邻替代路径,不比较产品、框架、语言、数据库、消息中间件、内容后端、搜索产品、hash 算法或部署平台。work lifecycle、process execution、governance decision、conversation display、workspace view、runtime trace、observability record、archive package 和 sync private copy 等已被 Step 2 / Step 3 / Step 8 明确排除的事项,不再包装成有效备选方案。完整事件溯源、图查询、对象存储、Git 后端和完整性扫描是后续演进或实现承载方向,只有当它们改变当前主线结构时才进入本章取舍。当前方案的核心取舍是牺牲短期直接性、内容 / 查询工具集中性和即时展示感,换取 Artifact truth、仓际边界、外部正文归属、一致性和演进空间。

---

## 9. 回填草稿

正式 `01-架构设计.md` 后续整理时:

- §12 “备选方案与取舍”直接摘录并整理本文件 §8.1、§8.2、§8.3、§8.4 和 §8.5。
- 不在本 Step 重复粘贴完整正式章节,后续 Step 16 从结构化中间产物摘录生成正式文档。

---

## 10. 待确认事项

### 10.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| content backend 是否作为当前主线 truth source | A. 是;B. 否,只作为外部正文来源或实现候选 | B | Artifact 必须独立拥有制品事实。 | 已确认采用 B |
| metadata-first 是否作为当前主线架构 | A. 是;B. 否,只作为后续存储 / 对象设计候选 | B | 当前主线是 truth / reference / snapshot / derived 分离,不是字段 / 存储方案。 | 已确认采用 B |
| 完整事件溯源是否作为 P0 主体架构 | A. 作为 P0 必选;B. 保留观察,当前只采用追溯、事件协作和 handoff 机制 | B | 当前需要可追溯,但完整 ES 会过早锁定实现范式。 | 已确认采用 B |
| graph lineage engine 是否作为当前主线 | A. 是;B. 否,只作为后续查询实现候选 | B | 防止查询图替代正式血缘 truth。 | 已确认采用 B |
| search / preview / report 是否可以作为主组织核心 | A. 可以;B. 不可以,只能派生或导出 | B | 防止派生结构变成第二 truth。 | 已确认采用 B |

### 10.2 本 Step 未确认事项

本步不新增阻塞 Step 12 的待确认事项。完整事件溯源、graph lineage engine、对象存储、Git 后端、搜索 / 预览 / 报告、hash / integrity、数据承载和容量目标是否在后续阶段升级为 ADR 级决策,应等待对象模型、状态机、事件契约、容量模型、审计 / 重放需求和外部集成需求进一步收敛后再判断。

---

## 11. 进入下一步条件

- 已明确当前架构主线方案。
- 已明确哪些相邻替代路径值得比较。
- 已说明每条路径解决的问题、主要收益和主要代价 / 约束。
- 已给出采用 / 不采用 / 保留观察的正式结论。
- 已说明前文已排除的边界外事项不重新进入方案比较。
- 未滑入产品横评、局部实现对比、愿望池或未来脑暴。
- 可以进入 Step 12 `横切关注点`。
