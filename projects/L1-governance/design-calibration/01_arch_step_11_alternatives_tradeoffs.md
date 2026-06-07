# Step 11. 备选方案与取舍

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 11
> 回填章节: `01-架构设计.md` §12 备选方案与取舍
> 生成日期: 2026-06-07
> 状态: 已完成

---

## 1. 本步目标

把 `L1-governance` 当前主线架构方案与主要相邻替代路径放到同一判断框架下比较,说明为什么选择当前方案,为什么放弃其它路径,以及当前方案牺牲了什么、换来了什么。

本步只比较架构层路径级替代关系,不写产品横评、局部实现对比、愿望池、未来可能性大全、API / event / job / schema、数据库、规则引擎、外部 GRC 产品或部署细节。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `01_arch_step_02_goals_constraints.md` | 已完成 | 承接架构目标、不可变约束、当前阶段取舍和非目标 |
| `01_arch_step_03_responsibility_boundary.md` | 已完成 | 排除职责边界外事项,防止重新包装为备选方案 |
| `01_arch_step_07_dependency_direction.md` | 已完成 | 承接唯一编译期依赖、依赖倒置和层间约束 |
| `01_arch_step_08_data_ownership_consistency.md` | 已完成 | 承接数据归属和一致性取舍 |
| `01_arch_step_09_interactions_communication.md` | 已完成 | 承接同步 / 异步 / 后台路径分离 |
| `01_arch_step_10_technology_choices.md` | 已完成 | 承接关键技术机制和不采用口径 |
| 旧 `01-架构设计.md` | 旧 Draft | 仅作为旧 Gate / Policy / Control / AIIA / SoA / Nonconformity、audit store、Policy engine、report、external GRC 等替代路径诊断来源 |

---

## 3. SOP 问题回答

### 3.1 这个仓有哪些主要可选架构方案?

当前主线方案是:

> 以独立 Governance truth 为核心,通过正式承接边界、依赖倒置、truth / snapshot / reference / derived separation、核心强一致 + 外围最终一致、同步 / 异步 / 后台分离、Policy truth 与 runtime cache 分离、正文引用与治理结论分离、只读派生、幂等顺序保护、traceability / evidence / handoff 机制构成治理决策与治理控制事实架构。

值得比较的相邻替代路径是:

| 替代路径 | 是否进入本章比较 | 判断 |
|---|---|---|
| 外部 GRC / compliance suite 主导路径 | 是 | 与 Governance 独立 truth 主线构成结构性替代。 |
| Policy engine / runtime cache 主导路径 | 是 | 与 Policy effective fact 归 Governance 的主线构成替代。 |
| Artifact / method definition 正文主导路径 | 是 | 与正文引用和治理结论分离主线构成替代。 |
| Observability / report / dashboard 主导路径 | 是 | 与只读派生和追溯交接主线构成替代。 |
| 相邻仓直接写 Governance 核心路径 | 是 | 与正式承接边界和依赖倒置主线构成替代。 |
| 完整事件溯源优先路径 | 是 | 与 traceability / evidence / handoff 机制但不硬化 ES 的主线构成替代。 |
| 全同步闭环路径 | 是 | 与同步 / 异步 / 后台分离构成一致性承接替代。 |
| 全异步事件化路径 | 是 | 与核心治理事实同步成立 / 拒绝构成替代。 |
| 具体数据库、消息产品、规则引擎、report 工具或外部 GRC 产品 | 否 | 属于产品级或实现级选择,后续文档收敛。 |
| process、work、artifact、conversation、runtime、observability 等职责入 Governance | 否 | 已被 Step 2 / Step 3 的不可变约束和非目标排除,不再作为有效备选方案。 |

### 3.2 为什么当前选择这一种?

当前主线方案能同时满足四个硬目标:

1. Governance truth 独立成立,不被 process waiting、work lifecycle、artifact body、conversation display、runtime cache、observability store、workspace view 或 external GRC 替代。
2. 跨仓协作可发生,但只通过 ref、snapshot、safe summary、event、adapter、handoff 或共享 core contract 承接。
3. Gate / Decision、Approval、Policy、Control、AIIA / SoA 和 Nonconformity 等核心治理事实保持同步成立、拒绝或挂起口径。
4. 下游消费、报告、对账、归档交接和外部系统导出允许最终一致,但重复、乱序、stale、unresolved、failed 和 retryable 状态必须可解释。

其它路径通常只能优化某一面:更快接入外部 GRC、更强规则表达、更方便本地合规材料读取、更完整审计重放、更强即时感或更彻底解耦,但会牺牲边界、依赖裁剪、正文归属、Policy truth 或派生不反写。

### 3.3 被放弃方案的主要优点是什么?

| 被放弃方案 | 主要优点 |
|---|---|
| 外部 GRC / compliance suite 主导路径 | 合规工具链成熟,外部审计和报表生态可能更快接入。 |
| Policy engine / runtime cache 主导路径 | 规则表达和执行反馈闭环更直接,下游生效感更强。 |
| Artifact / method definition 正文主导路径 | AIIA / SoA / Control / evidence 评审材料本地读取更方便。 |
| Observability / report / dashboard 主导路径 | 审计、指标、可视化和管理视图体验更直接。 |
| 相邻仓直接写 Governance 核心路径 | 初期开发更快,少一层 adapter / snapshot / ref 转换成本。 |
| 完整事件溯源优先路径 | 历史重放、审计叙事和事实演进表达更强。 |
| 全同步闭环路径 | 调用方即时感强,短链路结果更直观。 |
| 全异步事件化路径 | 运行单元更解耦,吞吐扩展和跨仓传播空间更明显。 |

### 3.4 为什么即便有这些优点,当前仍不采用?

这些优点大多是短期实现便利、工具生态、即时体验或表达力收益,但 `L1-governance` 的首要问题不是“最快接入合规工具 / 规则引擎 / 报表”,而是“守住治理决策与治理控制事实的独立真相”。一旦选择外部 GRC 主导、runtime cache 主导、正文入仓、report 反写、直接源码依赖或全事件化核心,后续会很难恢复 Governance truth、正文归属和依赖边界。完整事件溯源、具体 rule engine、report 平台和 external GRC 属于后续演进或实现承载问题,不能在当前阶段反向定义治理核心。

### 3.5 当前选择牺牲了什么,换来了什么?

| 当前方案牺牲 | 当前方案换来 |
|---|---|
| 初期接入路径更长 | 外部输入不会直接污染核心语义 |
| adapter / ref / snapshot / safe summary / marker 设计成本更高 | 非 core sibling 仓不会变成编译期依赖或第二真相 |
| Policy 生效与 runtime cache 更新可能短暂不一致 | Policy truth 不被执行层反向定义 |
| AIIA / SoA / Control / evidence 评审不能直接本地保存正文 | 合规结论和正文来源边界稳定 |
| report / dashboard / external GRC 会有派生延迟 | 派生消费不反写 Governance truth |
| 幂等、顺序、traceability 和 handoff 设计更复杂 | 重复、乱序、导出和消费失败不会产生多份治理事实 |
| 暂不硬化完整 ES / rule engine / GRC 产品 | 当前核心闭环更可控,复杂能力有清晰演进空间 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `01-架构设计.md` | PostgreSQL、audit store、Policy engine、report system、external GRC 等旧技术假设出现较早 | 未经过新版边界和依赖裁剪重新论证 | 作为替代路径或产品级候选诊断,不直接继承 |
| 旧 `01-架构设计.md` | Gate / Policy / Control / AIIA / SoA / Nonconformity 与实现聚合草案混写 | 缺少路径级取舍说明 | 本步汇总为独立 Governance truth 主线与替代路径比较 |
| Step 2 / Step 3 | 已排除相邻仓职责入 Governance | 不能把已排除事项重新包装成方案 | 本章只比较仍在边界内的相邻替代路径 |
| Step 10 | 已列单项关键技术机制 | 本步需要路径级取舍,不能重写每项机制理由 | 主表按方案路径比较 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 方案取舍表达 | 分散在各 Step 的局部设计取舍中 | 汇总为架构路径级比较 | 对齐架构规范 4.12 |
| 旧外部 GRC / Policy engine 假设 | 可能被默认视为主线 | 明确作为不采用或后续观察路径比较 | 避免旧 Draft 污染新版架构 |
| 产品级差异 | 容易混入方案对比 | 明确排除出本章 | 产品横评不属于架构路径取舍 |
| 边界外职责 | 可能再次进入讨论 | 明确不作为有效备选方案 | 尊重 Step 2 / Step 3 的不可变约束 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只保留 Step 10 的单项机制说明 | 简短 | 缺路径级替代方案比较 | 不采用 |
| 方案 B: 按结构性替代路径做方案比较 | 能说明当前主线为什么成立 | 表格较长 | 采用 |
| 方案 C: 加入数据库、消息产品、规则引擎、外部 GRC 产品横评 | 接近实现讨论 | 违反本章边界 | 不采用 |
| 方案 D: 把所有未来增强都列为备选方案 | 看似完整 | 会把愿望池和正式取舍混在一起 | 不采用 |

### 6.1 待确认问题的方案选择

#### external GRC 是否作为当前主线 truth source?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | external GRC 主导 Governance truth | 工具生态成熟,但外部系统会反向定义治理事实 |
| 方案 B | Governance 独立 truth,external GRC 只作为导出 / 下游消费 / 外围增强 | 对齐数据所有权和职责边界 |

推荐方案 B。

#### Policy engine / runtime cache 是否作为 Policy truth source?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | engine / cache 成功定义 Policy 生效 | 规则执行路径直接,但执行层会反向定义 Policy truth |
| 方案 B | Governance 拥有 Policy effective fact,engine / cache 作为实现或消费边界 | 保护 Policy 和 shared rules 语义 |

推荐方案 B。

#### 完整事件溯源是否作为当前主线?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 完整 ES 优先 | 历史表达强,但会提前固化持久化和事件模型 |
| 方案 B | 当前只确认 traceability / event collaboration / handoff,完整 ES 后续观察 | 保留追溯需求,降低 P0 复杂度 |

推荐方案 B。

---

## 7. 结构化中间产物

### 7.1 当前主线方案

当前采用的主线方案是:

```text
独立 Governance truth 核心
  + 正式承接边界隔离外部输入
  + 运行期接缝 / 引用 / 快照 / safe summary / event / handoff
  + Governance truth / external snapshot / reference / derived separation
  + 核心治理事实强一致
  + 下游消费 / 报告 / 对账 / 归档交接最终一致
  + 同步 / 异步 / 后台三类路径分离
  + Policy effective fact 与 runtime cache 分离
  + 正文引用与治理结论分离
  + Nonconformity 线索与纠正闭环 truth 分离
  + 只读派生消费
  + 幂等 / 顺序保护
  + traceability / evidence / handoff
```

该方案的核心判断是:Governance 的 truth center 必须独立稳定,外部能力只能经正式边界进入,下游消费不能直接绑定核心结构,派生和交接可以延迟收敛但不能反写真相。

### 7.2 方案路径比较表

| 方案路径 | 解决的问题 | 主要收益 | 主要代价 / 约束 | 当前结论 | 说明 |
|---|---|---|---|---|---|
| 独立 Governance truth + 正式边界协作主线 | 在多仓协作中保持治理决策与治理控制事实独立、可裁决、可消费、可追溯。 | 同时保护 truth 边界、依赖裁剪、正文归属、Policy truth、派生不反写和归档交接。 | 增加承接、adapter、snapshot、derived、handoff、idempotency 和 evidence 成本。 | 采用 | 这是当前主线方案,最符合 Step 2~10 已收敛约束。 |
| 外部 GRC / compliance suite 主导路径 | 用外部治理工具统一合规、审批、报表和审计。 | 工具生态成熟,外部审计集成可能更快。 | 外部系统会成为 Governance truth source,并可能覆盖本仓裁决、Policy 和 Control 语义。 | 不采用 | external GRC 只能作为导出 / 消费 / 外围增强,不得定义本仓 truth。 |
| Policy engine / runtime cache 主导路径 | 用规则引擎和执行 cache 统一策略计算和生效反馈。 | 执行反馈直接,下游生效感强,规则表达空间大。 | engine / cache 会反向定义 Policy effective fact 和 shared rules,执行 truth 污染治理 truth。 | 不采用 | Policy 生效、scope、priority、conflict 和 shared rules 必须归 Governance。 |
| Artifact / method definition 正文主导路径 | 把 AIIA / SoA / Control / evidence / standard 材料本地合并管理。 | 评审读取方便,合规材料看似集中。 | Governance 会接管 artifact / evidence / method / standard 正文和生命周期。 | 不采用 | Governance 只拥有治理结论和引用,正文归外部来源仓。 |
| Observability / report / dashboard 主导路径 | 用审计、报表、看板和指标系统组织治理事实消费。 | 管理视图、追溯展示和指标体验更直接。 | 派生和物理观测存储会靠近 truth center,report / dashboard 可能反写真相。 | 不采用 | report / dashboard / audit summary 只能派生或输入线索,不能写核心 truth。 |
| 相邻仓直接写 Governance 核心路径 | 降低 adapter、resolver 和事件协作成本。 | 初期开发短,类型和调用复用直接。 | 破坏 `L0-core` 唯一编译期依赖,相邻仓模型会反向塑造 Governance。 | 不采用 | 运行期接缝、引用、快照和事件协作是当前主线。 |
| 完整事件溯源优先路径 | 强化历史重放、事实演进和审计叙事。 | 追溯表达强,天然强调追加和重放。 | 在对象、状态和事件契约尚未细化前过早锁定持久化范式,提高 P0 复杂度。 | 保留观察 | 当前采用 traceability / evidence / event collaboration / handoff,不把完整 ES 作为 P0 必选。 |
| 全同步闭环路径 | 让治理写入、下游分发、report、archive 和 external GRC 同步完成。 | 调用方即时感强,表面完整性清晰。 | 下游消费、报告、归档和外部系统会阻塞或回滚 Governance 主事实。 | 不采用 | 只适合核心治理事实即时判断,不适合作为全局交互主线。 |
| 全异步事件化路径 | 最大化运行解耦和吞吐弹性。 | 异步能力强,入口压力小,传播扩展空间明显。 | Gate / Decision、Policy、Control、AIIA / SoA 和 Nonconformity 缺少即时成立 / 拒绝口径。 | 不采用 | 核心治理事实必须有同步收口,不能全部异步化。 |
| 派生 / report / external export first 路径 | 优先满足管理视图、审计导出和外部合规报告。 | 展示和导出体验直接,管理入口推进快。 | 读模型和导出结构会反向塑造核心 truth,形成第二治理事实。 | 不采用 | 派生消费和导出只能从 Governance truth 出发。 |

### 7.3 不进入本章正式比较的方向

| 方向 | 不进入比较的原因 | 正确处理 |
|---|---|---|
| Process waiting gate 拥有 Gate / Decision truth | Step 3 已确认 waiting gate 是过程等待状态,不是正式治理裁决。 | Process 消费 Governance decision,不拥有 decision truth。 |
| Work lifecycle / blocker 拥有 Governance decision / Nonconformity truth | Step 3 已确认 WorkItem / blocker 是工作事实,不是治理纠正闭环。 | Work 提供语境或线索,Governance 收口裁决和纠正闭环。 |
| Artifact 拥有 AIIA / SoA governance conclusion | Step 3 已确认 artifact 拥有正文,Governance 拥有治理结论。 | Artifact 提供正文和 evidence 引用,Governance 形成结论。 |
| Conversation Gate card / review display 拥有 Decision truth | Step 3 已确认显化和 UI 状态不是正式裁决。 | Conversation 显化 Governance facts,不拥有 truth。 |
| Runtime cache / capability whitelist 拥有 Policy truth | Step 3 已确认执行 cache 和能力注册不定义 Policy effective fact。 | Runtime / capability 消费 Policy 并反馈执行线索。 |
| Observability audit ledger 拥有 governance traceability truth | Step 3 已确认物理审计存储不等于治理可解释事实。 | Observability 消费交接材料并提供观测摘要。 |
| 具体数据库、消息中间件、规则引擎、report 工具、GRC 产品 | 这些是实现或产品载体,不改变本章路径级取舍。 | 后续概要、详细、配置、实施或 ADR 收敛。 |

### 7.4 轻量取舍对照表

| 当前方案得到 | 当前方案失去 |
|---|---|
| 独立 Governance truth 和清晰职责边界 | 外部 GRC / report / engine 的短期集中便利 |
| 非 core sibling 仓不进入编译期依赖 | 直接复用相邻仓模型的开发便利 |
| Policy truth 不被 runtime cache / engine 反向定义 | 下游 cache 与 truth 完全同步的即时感 |
| 合规结论与正文来源边界稳定 | 本地保存完整合规材料的读取便利 |
| 派生、report、dashboard、external GRC 不反写真相 | 派生视图立即成为管理主结构的速度 |
| 核心治理事实可同步收口 | 全事件化带来的极致解耦 |
| 下游传播、归档、对账可最终一致 | 全同步端到端即时完成感 |
| 关键变化、消费和交接可追溯 | 需要维护 evidence / handoff / failed / retryable 状态 |

### 7.5 方案边界说明短文

本章只比较会改变 `L1-governance` 主线结构的相邻替代路径,不比较产品、框架、语言、数据库、消息中间件、rule engine、external GRC 或 report 平台。process waiting state、work lifecycle、artifact body、conversation display、runtime cache、observability ledger、workspace dashboard、archive package 和 external GRC truth 等已被 Step 2 / Step 3 明确排除的事项,不再包装成有效备选方案。完整事件溯源、规则引擎、外部 GRC 和高级报表是后续演进或实现承载方向,只有当它们改变当前主线结构时才进入本章取舍。当前方案的核心取舍是牺牲短期直接性、工具集中性和即时展示感,换取 Governance truth、仓际边界、正文归属、一致性和演进空间。

---

## 8. 回填草稿

正式 `01-架构设计.md` 后续整理时:

- §12 “备选方案与取舍”直接摘录并整理本文件 §7.1、§7.2、§7.3、§7.4 和 §7.5。
- 不在本 Step 重复粘贴完整正式章节,后续 Step 16 从结构化中间产物摘录生成正式文档。

---

## 9. 待确认事项

### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| external GRC 是否作为当前主线 truth source | A. 是;B. 否,只作为导出 / 下游消费 / 外围增强 | B | Governance 必须独立拥有治理事实 | 已确认采用 B |
| Policy engine / runtime cache 是否作为 Policy truth source | A. 是;B. 否,只作为实现 / 消费边界 | B | 防止执行层反向定义 Policy truth | 已确认采用 B |
| 完整事件溯源是否作为 P0 主体架构 | A. 作为 P0 必选;B. 保留观察,当前只采用追溯、事件协作和 handoff 机制 | B | 当前需要可追溯,但完整 ES 会过早锁定实现范式 | 已确认采用 B |
| report / dashboard / external export 是否可以作为主组织核心 | A. 可以;B. 不可以,只能派生或导出 | B | 防止派生结构变成第二 truth | 已确认采用 B |
| 是否允许下游或相邻仓直接写 Governance core | A. 允许;B. 不允许,经正式承接边界 | B | 对齐职责边界和依赖倒置 | 已确认采用 B |

### 9.2 本 Step 未确认事项

本步不新增阻塞 Step 12 的待确认事项。完整事件溯源、rule engine、external GRC、report / dashboard、数据承载和容量目标是否在后续阶段升级为 ADR 级决策,应等待对象模型、状态机、事件契约、容量模型、审计 / 重放需求和外部集成需求进一步收敛后再判断。

---

## 10. 进入下一步条件

- 已明确当前架构主线方案。
- 已明确哪些相邻替代路径值得比较。
- 已说明每条路径解决的问题、主要收益和主要代价 / 约束。
- 已给出采用 / 不采用的正式结论。
- 已说明前文已排除的边界外事项不重新进入方案比较。
- 未滑入产品横评、局部实现对比、愿望池或未来脑暴。
- 可以进入 Step 12“横切关注点”。
