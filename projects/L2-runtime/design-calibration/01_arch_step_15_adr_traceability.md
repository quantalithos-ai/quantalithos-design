# L2-runtime 01 架构 Step 15: ADR 与需求追溯

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `01-架构设计.md` 第 16、17 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | `00_req_step_16_traceability_matrix.md`、架构 Step 1~14 全部已停审结论、全局依赖裁剪和上游 blocker 台账 |
| 目标 | 建立需求 / 约束到架构结果的可审计映射，并索引需长期保留的架构决定 |
| 禁止 | 在矩阵或 ADR 中新增未确认结论、伪造独立 ADR 文件 / commit / 签署、把普通实现选择塞入 ADR |
| ADR 定位 | 下表是本架构文档内的正式索引决定，不声称仓库中已存在同编号的独立 ADR artifact |

## 1. 需求追溯矩阵

| 需求来源 | 需求结论 / 约束 | 架构承接结果 | 承接位置 | 说明 |
|---|---|---|---|---|
| `00-需求文档.md` `C-L2R-1` / `FR-L2R-001~004` | Runtime 必须承接有主体、scope、目标、计划和显式终止语义的受控 run | `Run & Goal-Plan` 核心子域、controlled transition、source anchoring、显式状态边界 | 第 4、5、6、8、9、10、13 章 | 架构把运行能力转成独立 truth owner，不把 Work / Process / Artifact 正文吸收进来。 |
| `00-需求文档.md` `C-L2R-2` / `FR-L2R-005~008` | Context composition、working memory 和长期检索 mediation 必须按 owner / ref / scope / freshness / budget 工作 | `Context & Memory Mediation` 核心子域；External Truth Views；truth / snapshot / ref / candidate / forbidden body 分层 | 第 5、6、9、10、11、13 章 | 架构只拥有 working context 与 mediation，durable body / index / retention 留在外部 owner。 |
| `00-需求文档.md` `C-L2R-3` / `FR-L2R-009~012` | Model 决定需 provider-neutral、可关联、可解释且不泄露 raw / hidden body | `Model Decision` 核心子域；logical / physical split；safe decision summary；adapter seam | 第 4、6、7、8、9、10、11、12、13 章 | logical selection 不推导 provider route、secret、quota 或 cost。 |
| `00-需求文档.md` `C-L2R-4` / `FR-L2R-013~016` | Action / Tool / sub-agent 选择需区分前置、执行、反馈、父子 scope 和未知副作用 | `Action & Delegation Orchestration` 核心子域；formal precondition gate；bounded delegation；unknown fence | 第 4、5、7、8、9、10、11、12、13 章 | Runtime 只编排和纳入结果，Tools / Governance / Sandbox / Hub 仍拥有各自 truth。 |
| `00-需求文档.md` `C-L2R-5` / `FR-L2R-017~020` | Checkpoint、recovery、reflection、local outcome 和 handoff 必须可恢复、不可逆写历史并分层外部状态 | `Checkpoint, Recovery & Handoff` 核心子域；immutable history；stable checkpoint；local-truth-first | 第 5、6、8、9、10、11、12、13 章 | delivery / observed / accepted 不能替换 local outcome，未闭合 route 只产生 attempt / gap。 |
| `00-需求文档.md` `BR-L2R-001~008` | run / goal / plan 需有来源、显式状态、不可隐式推进且不吞并外部业务正文 | source-anchored controlled state transition；Run & Goal-Plan 边界；历史不可变 | 第 3、4、6、8、10、11、12、13 章 | 结构性约束保护运行工作态与外部 Work / Process / Artifact truth 的分离。 |
| `00-需求文档.md` `BR-L2R-009~016` | 外部 context / memory 必须带 owner / scope / freshness，候选与 durable truth 不得混层 | External Truth Views；Context & Memory 数据归属和降级语义 | 第 5、6、8、9、10、12、13 章 | stale / conflict / missing 可进入 waiting / degraded / gap，不升级为 source truth。 |
| `00-需求文档.md` `BR-L2R-017~024` | Model intent / selection 与 provider control 分离，迟到结果不覆盖新决定，hidden body 禁止进入 truth | provider-neutral adapter；correlation / ordering；body-free summary；fail-closed unavailable | 第 4、7、8、9、10、11、12、13 章 | 这些决定来自 model owner separation 和最小暴露红线，不是 provider 产品选型。 |
| `00-需求文档.md` `BR-L2R-025~034` | Action choice、治理前置、Tool contract、Sandbox isolation、sub-agent scope 必须分层和 fail closed | Action & Delegation；formal seam；bounded delegation；no host fallback | 第 4、5、7、8、9、10、12、13、14 章 | 架构只把外部前置作为必需输入，不本地生成审批、执行或隔离真相。 |
| `00-需求文档.md` `BR-L2R-035~044` | Stable point、recovery 新决定、unknown fence、late feedback 和 handoff 分层必须成立 | immutable history + stable checkpoint + recovery-as-new-decision + local outcome / gap | 第 8、9、10、11、12、13、14 章 | 这些规则共同保护恢复合法性和跨 owner 结果独立性。 |
| `00-需求文档.md` `NFR-L2R-001~006` | 核心路径需 bounded、等待可见、外围不可用不污染核心、正向前置缺失 fail closed | bounded context / delegation；同步判断与异步传播分离；横切韧性约束 | 第 3、7、9、10、11、12、13 章 | 当前不写 P95 / QPS / retry 数字，数值证据留后续文档。 |
| `00-需求文档.md` `NFR-L2R-007~012` | forbidden body 最小暴露，运行事实、恢复、handoff 可关联且不等于完整 reasoning trace | body-free safe summary；source / correlation / causation；安全边界 | 第 4、8、9、10、11、12、14 章 | 追溯通过 source / purpose / run / turn / outcome 关联实现，不保存 hidden reasoning。 |
| `00-需求文档.md` `NFR-L2R-013~019` | 重复、乱序、unknown、观测和依赖 readiness 必须可判别且不伪造 | idempotency / ordering / correlation；unknown-side-effect fence；observed 分层；pending preservation | 第 7、8、9、10、11、12、13、14 章 | 依赖类别和真实 readiness 分离，fake 只表示语义接缝，不表示正向事实。 |
| `00-需求文档.md` `L2R-UP-001~008` / `R-L2R-002~009` | 上游正向合同、owner、schema、route、persistence、observability 和 readiness 未闭合时不能正向定稿 | 正式 seam + pending / blocked / fail-closed 传递；风险与待确认表显式保留 | 第 3、4、7、8、9、10、12、13、15 章 | 开放项不阻塞架构逻辑完成，但阻塞 schema / adapter / route、配置、测试、evidence 和 acceptance。 |

## 2. 追溯缺口表

| 追溯缺口类型 | 对象 / 缺口 | 影响范围 | 当前状态 | 说明 |
|---|---|---|---|---|
| 需求承接待外部闭口 | `FR-L2R-014~015` 的 Tools / Governance / Sandbox 正向映射 | Action qualification、执行前置和反馈 incorporation | 已映射架构边界；正向 contract 未闭合 | 需求已被架构以 consumer / fail-closed 方式承接，正向 schema 不在本步补写。 |
| 需求承接待外部闭口 | `FR-L2R-008` durable memory mediation 的 owner / write feedback | Context / Memory 长期一致性 | working-only / candidate 已承接；durable owner pending | 不能把候选 handoff 追溯成 durable committed truth。 |
| 需求承接待外部闭口 | `FR-L2R-017~018` checkpoint persistence / commit-unknown 物理语义 | Recovery qualification、部署和事务边界 | stable point / unknown fence 已承接；物理合同 pending | 架构追溯不等同物理实现和测试证据。 |
| 来源—合同未闭环 | `L2R-UP-006` Core / Bus / Observability Runtime-specific schema | compile、event envelope、safe material source | 类别与 owner 已映射；正式 schema / route pending | 不能凭旧目录或历史文档补来源。 |
| 来源—消费语义未闭环 | `Q-L2R-001`,`Q-L2R-010` member / product entry 与 event consumer boundary | Entry、handoff、P4 外围增强 | capability-level entry / consumer-only 已承接；下游语义 pending | 下游未校准时不反向定义 Runtime truth。 |
| 需求范围未闭环 | `FR-L2R-E01~E04` replay / analytics / candidate handoff 的后续范围 | P4 演进、测试 / 验收范围 | 以外围增强映射；不进入核心主线 | 需求矩阵已有来源，但是否升格仍需需求确认，不能在架构中预支。 |
| 上游基线状态缺口 | `L3-method-library/03-详细设计.md` 工作区未提交改动 | 方法定义输入的不可变性声明 | current workspace formal input；未声称 immutable baseline | 追溯来源存在，但提交 / 签署事实缺失必须保留。 |

## 3. ADR 索引决定

> 以下为本架构文档内的 ADR 索引，不代表仓库已有独立 ADR 文件、commit、签署或实施证据。

| ADR 索引 | 架构决定 | 需求 / 约束来源 | 取舍 / 风险来源 | 回指架构单元 / 停审结论 | 状态 |
|---|---|---|---|---|---|
| `ADR-L2R-001` | Runtime 是独立 controlled-run truth owner | `C-L2R-1`; `FR-L2R-001~004`; `BR-L2R-001~008` | 不采用无状态 coordinator；防止 Work / Process / Artifact owner 反转 | Run & Goal-Plan；Step 5 / 8 停审 | indexed_stable |
| `ADR-L2R-002` | 五核心语境与 Entry / External Truth Views / Safe Runtime Views 分层 | `C-L2R-1~5`; `FR-L2R-005~020` | 不采用单一“大脑”聚合；降低职责重叠 | Step 5 八单元及跨上下文审计通过 | indexed_stable |
| `ADR-L2R-003` | 只有 `L0-core` 作为 compile 候选，其余关系走 runtime / event / ref / adapter / fake seam | `ARB-L2R-004~012`; `NFR-L2R-019` | 不采用 sibling package、共享 DB 或 SDK 反向依赖 | Step 7 依赖裁剪审计通过 | indexed_stable |
| `ADR-L2R-004` | 外部 owner 通过正式承接边界进入，Runtime 只消费 ref / snapshot / result / gap | `RBR-L2R-002~007`; `BR-L2R-009~016`,`028~034` | 牺牲直连捷径，保护 owner separation 与 fail-closed | Step 3 / 4 / 7 / 8 / 9 停审 | indexed_stable |
| `ADR-L2R-005` | Model 采用 provider-neutral logical / physical split | `FR-L2R-009~012`; `BR-L2R-017~024` | provider route / secret / quota / cost 未定 | Model Decision；Step 8 / 10 停审 | indexed_stable_pending_adapter |
| `ADR-L2R-006` | truth、snapshot、ref、candidate、forbidden body 分层 | `BR-L2R-009~016`,`022`,`036`; `NFR-L2R-007`,`017` | 增加 stale / gap 表达，避免正文复制 | Step 8 数据审计通过 | indexed_stable |
| `ADR-L2R-007` | immutable history、stable checkpoint、recovery-as-new-decision | `FR-L2R-017~019`; `BR-L2R-035~040`; `NFR-L2R-010~015` | 不采用机械每步 checkpoint / blind retry | Checkpoint / Recovery；Step 8 / 9 / 12 停审 | indexed_stable_pending_persistence |
| `ADR-L2R-008` | 对 commit unknown / side-effect unknown 设置 unknown fence | `BR-L2R-038`,`BR-L2R-044`; `NFR-L2R-013`,`015` | 牺牲部分自动可用性，换取不可重复副作用 | Action、Recovery；Step 7 / 9 / 12 停审 | indexed_stable |
| `ADR-L2R-009` | local truth first，handoff / delivery / observed / accepted 分层 | `FR-L2R-020`; `BR-L2R-041~043`; `NFR-L2R-011`,`018` | 不采用外部 ACK 回写 Runtime outcome | Handoff / Safe Views；Step 8 / 9 / 12 停审 | indexed_stable_pending_route |
| `ADR-L2R-010` | 同步判断、异步送达传播、后台 continuation 分离 | `FR-L2R-001~004`,`011`,`017~020`; `NFR-L2R-001~006` | 不采用全同步或全异步端到端主线 | Step 9 / 11 / 12 停审 | indexed_stable |
| `ADR-L2R-011` | body-free safe summary / projection 是对外最小暴露面 | `FR-L2R-012`,`020`; `BR-L2R-011`,`022`,`036`,`043`; `NFR-L2R-007`,`017` | 不保存 hidden reasoning、raw body、secret 或 capture | Step 8 / 12 横切审计通过 | indexed_stable |
| `ADR-L2R-012` | 关键 action 前置采用 fail-closed，delegation 采用 bounded scope / budget | `FR-L2R-013~016`; `BR-L2R-025~034`,`044`; `NFR-L2R-008~009` | 不采用 host fallback / local allowlist / unbounded child | Action & Delegation；Step 3 / 5 / 7 / 12 停审 | indexed_stable_pending_upstream |

## 4. ADR 逐项停审记录

| ADR | 是否值得长期保留 | 来源完整性 | 是否新增未确认结论 | 停审结论 |
|---|---|---|---|---|
| `ADR-L2R-001~004` | 是 | 需求、职责、依赖和数据均有来源 | 否 | pass；作为 Runtime 边界基线。 |
| `ADR-L2R-005~006` | 是 | Model / body-free 规则和 Step 8 有来源 | 否 | pass；adapter owner 仍 pending，不影响逻辑决定。 |
| `ADR-L2R-007~009` | 是 | checkpoint、unknown、handoff 需求与 Step 8~12 有来源 | 否 | pass；物理 persistence / route 未被写成 ready。 |
| `ADR-L2R-010~012` | 是 | 交互、横切和风险 / 红线有来源 | 否 | pass；仅保留机制级决定，不锁产品。 |

## 5. 跨 ADR / 需求审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 核心需求是否有架构承接 | pass | `C-L2R-1~5` 与 `FR-L2R-001~020` 均落到核心语境、数据、交互、技术机制或演进章节。 |
| 关键约束是否有承接 | pass | `BR-L2R-001~044` 按能力族与跨节点规则映射；未知项未被升级。 |
| NFR 是否有架构落点 | pass | `NFR-L2R-001~019` 映射到边界、交互、横切、依赖和恢复机制；数值目标仍 pending。 |
| ADR 是否都有需求 / 风险 / 取舍来源 | pass | 每项 ADR 至少回指需求规则、架构目标 / 红线或 Step 11 取舍。 |
| 是否存在孤儿架构决定 | 否 | 12 项 ADR 均有单元停审和来源。 |
| 是否存在孤儿核心需求 | 否 | C1~C5、核心 FR、BR、NFR 均有矩阵承接。 |
| 是否把普通实现选择误入 ADR | 否 | 无语言、数据库、框架、协议、API、部署参数或测试结果。 |
| 是否把 pending seam 写成正向事实 | 否 | `L2R-UP-001~008` 和 Step 14 缺口仍保持 pending / blocked / fail-closed。 |
| 是否出现前文未确认的新结论 | 否 | 本步只建立映射和索引，不扩展架构语义。 |

## 6. 正式回填草稿

正式第 16 章回填第 1、2 节的主矩阵与缺口表，正式第 17 章回填第 3 节的 ADR 索引和必要说明。正文应保留 `indexed_stable`、`indexed_stable_pending_*` 等状态含义，但不得将它们解释为独立 artifact、实现 readiness、证据或签署。风险和待确认事项仍由第 15 章承接，不在 ADR 索引中重复写成解决方案。

## 7. 自检与门禁

| 检查项 | 结果 | 证据 |
|---|---|---|
| 需求来源—架构结果—章节位置—成立理由齐全 | pass | 第 1 节 |
| 追溯缺口与已成立映射分开 | pass | 第 2 节 |
| ADR 仅记录架构层长期决定 | pass | 第 3 节 |
| 每个 ADR 已完成值得保留 / 来源 / 新增结论停审 | pass | 第 4 节 |
| 跨 ADR / 需求无孤儿或冲突 | pass | 第 5 节 |
| pending / blocker 未被追溯表伪造为 ready | pass | 第 2、3、5 节 |
| 未创建独立 ADR artifact 或提交事实 | pass | 第 0、3 节声明 |

```text
gate_status = pass
next_allowed_action = create_01_arch_step_16_formal_document_assembly
formal_document_write_allowed = false
future_step_files_allowed = false_until_step_16_start
```
