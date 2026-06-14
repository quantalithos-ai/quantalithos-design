# Step 13. 演进路线

> 对应正式章节: `01-架构设计.md` §14
> 本步状态: 已完成
> 前序依赖: Step 12 已完成
> 当前结论: `L1-identity` 当前阶段的目标不是“把所有能力一次性做满”,而是先让身份 truth center、正式承接层、reference-only 外部边界、只读消费、事件最终一致、append-only trace / career、显式降级 marker 和 report-only 维护这些主线成立。后续演进只围绕来源承接、消费投影、追溯归档、恢复能力和性能基线增强展开;认证、ProjectMember、method 正文、memory 正文、governance decision truth、runtime execution 和 UI 状态不作为 identity 演进方向。

---

## 1. Step 状态 + Step 内计划

- 本步目标: 明确当前阶段做到哪里才算架构主线成立,哪些结构债务当前可接受,哪些后续能力才进入主线演进,以及什么事实会触发下一阶段。
- 复杂度判断: 本步不按架构单元拆附录,采用一个主控 Step 文件承载演进路线表、阶段边界说明、触发条件和不演进项。
- 粒度约束: 本步不写项目排期、版本号、里程碑、任务拆单、commit 计划、实施顺序、TODO 清单或未来愿望池。
- 判定约束: 已被职责边界和数据 ownership 排除的方向不得重新包装成后续演进项;可接受债务必须说明为什么当前不打穿主线。
- 停审要求: 本步完成后停留审核;已按用户“同意”进入 Step 14。

| 计划项 | 产物 | 状态 |
|---|---|---|
| 读取 Step 10 / 11 / 12 与已知后移事项 | 本步输入表 | 已完成 |
| 回答演进路线问题 | SOP 问题回答表 | 已完成 |
| 诊断旧演进路线排期化 / 愿望池问题 | 当前材料 / 旧文档问题诊断表 | 已完成 |
| 记录阶段边界取舍 | 设计取舍表 | 已完成 |
| 输出演进路线表 | 结构化中间产物 | 已完成 |
| 输出阶段边界说明和触发条件小表 | 结构化中间产物 | 已完成 |
| 输出可接受债务和不演进项 | 结构化中间产物 | 已完成 |
| 形成正式 §14 回填草稿 | 回填草稿 | 已完成 |
| 停下等待用户审核 | 进入下一步条件 | 已完成 |

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| `01_arch_step_10_technology_choices.md` | 提供当前主线机制、当前不采用 full event sourcing 主体范式和后续文档承接约束 |
| `01_arch_step_11_alternatives_tradeoffs.md` | 提供当前主线方案、相邻不采用路径和不进入候选的边界外方向 |
| `01_arch_step_12_cross_cutting_concerns.md` | 提供安全、visibility、审计、可观测、韧性、性能、配置和幂等的横切边界 |
| `01_arch_step_08_data_ownership_consistency.md` | 提供当前阶段必须守住的 truth / projection / reference / forbidden body 和 report-only 口径 |
| `01_arch_step_09_interactions_communication.md` | 提供同步 / 异步 / 后台承接和失败降级的阶段边界 |
| `00_req_step_15_risks_open_questions.md` | 提供 method source、high-risk lifecycle、memory handoff、visibility / privacy、performance baseline、旧 `04` 等待确认事项 |
| `架构设计讨论流程_SOP.md` Step 13 | 约束本步写结构演进,不写实施排期 |
| `架构设计书写规范.md` §4.14 | 约束演进路线表、阶段边界说明和触发条件小表 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 当前阶段做到哪里才算足够? | 只要身份 truth center、全局 lifecycle、role capability identity-side summary、career / memory ref relation、consumer traceability、reference-only 外部边界、只读 projection / query、event eventual consistency、append-only trace / career、显式降级 marker 和 report-only reconciliation 能在架构上闭合,当前主线就成立。 |
| 第一批必须守住哪些结构? | 必须守住 GlobalMember 与 ProjectMember 分层、method body / memory body / runtime body / credential 不入仓、`L0-core` 唯一编译期依赖候选、`L0-bus` 事件协作边界、query no-write、后台不修复相邻仓 truth、旧技术栈 / 旧性能数字不回流。 |
| 哪些能力或约束留到后续阶段演进? | method / work / governance / memory / archive 来源协议增强、字段级 visibility / redaction、投影搜索和多 consumer profile、trace / archive handoff、replay / recovery、性能 / 可用性硬基线和配置 schema 留到后续结构阶段。 |
| 哪些设计债务当前可接受,哪些不可接受? | 可接受的是不改变当前主线成立性的债务,例如 source protocol 细节、字段级 visibility、性能阈值和配置 schema;不可接受的是会打穿 truth ownership、正文排除、query no-write、report-only、依赖裁剪或 accepted truth 与传播最终一致的债务。 |
| 未来哪些触发条件会迫使架构调整? | 当外部来源变化频率、下游消费复杂度、trace / audit 合规压力、projection / event / handoff 失败规模、性能基线压力、配置变更风险超过当前承接方式时,必须进入下一阶段演进。 |

---

## 4. 当前材料 / 旧文档问题诊断

| 诊断项 | 旧处理风险 | 本步处理 |
|---|---|---|
| 旧 Step 13 写成 P0/P1/P2 阶段表 | 容易被理解为版本排期或项目路线图 | 改为结构阶段:当前主线成立、来源承接增强、消费投影增强、追溯归档增强、恢复 / 基线增强 |
| “后续增强”缺少触发条件 | 容易变成愿望池 | 每个后续演进项都绑定结构压力或明确触发事实 |
| 债务只写“后续处理” | 不说明当前为什么可接受,会变成“以后再说” | 每项债务说明当前不打穿哪条主线,以及触发后如何演进 |
| 把边界外事项写成未来演进方向 | 认证、ProjectMember、method body、memory body、runtime、UI 可能被重新打开 | 明确列为不演进项 |
| full event sourcing 表述模糊 | 可能被误读为迟早整体采用 | 当前只把更强 replay / temporal / audit 压力作为触发评估,不承诺 full ES 主体范式 |
| 性能 / 可用性硬阈值空缺 | 可能让后续验收继续使用旧数字或无阈值 pass | 本步只说明硬基线后移 `05/06`,触发条件是 sample / baseline / 评审压力 |

---

## 5. 改动前后对比

| 维度 | 旧处理风险 | 新处理 |
|---|---|---|
| 阶段表达 | P0/P1/P2 类版本化标签 | 当前主线成立阶段和结构增强阶段 |
| 当前边界 | 能力清单式“必须守住” | 明确做到哪里算 identity 架构成立 |
| 债务 | 只写后续处理 | 写当前可接受原因、保护的主线和触发条件 |
| 后续演进 | 来源、投影、归档、生态混成一张表 | 按来源承接、消费投影、追溯归档、恢复 / 基线分层 |
| 不演进项 | 简短排除列表 | 明确说明这些方向已被前文排除,不能作为未来主线 |
| 触发条件 | 泛泛“需要更精确状态” | 绑定外部来源压力、消费复杂度、审计压力、失败规模、性能基线和配置风险 |

---

## 6. 设计取舍

| 方案 / 取舍点 | 采用与否 | 理由 |
|---|---|---|
| 把演进路线写成项目排期 / 版本路线图 | 不采用 | 架构演进描述结构阶段,不描述交付时间或任务顺序。 |
| 把当前阶段定义为“所有能力一次性完成” | 不采用 | 这会把后续 source protocol、field visibility、performance baseline 和 handoff schema 等细节提前变成架构阻塞。 |
| 把当前阶段定义为“主线边界成立” | 采用 | 只要 truth、边界、依赖、交互、横切约束成立,架构即可支撑后续概要 / 详细设计继续闭口。 |
| 把 full event-sourcing-first 当作必然下一阶段 | 不采用 | Step 11 已裁定不作为当前主线;后续只有在 replay / audit / temporal 压力明确时才评估。 |
| 把边界外能力作为未来演进 | 不采用 | 认证、work truth、method body、memory body、governance truth、runtime execution 和 UI 状态不因“未来”而改变 ownership。 |
| 用明确触发条件驱动后续演进 | 采用 | 可以避免愿望池,也能让后续 `14/15/07` 判断债务是否仍可接受。 |

---

## 7. 结构化中间产物

### 7.1 演进路线表

| 阶段 | 当前目标 / 范围 | 当前可接受债务 | 后续演进项 | 触发条件 | 说明 |
|---|---|---|---|---|---|
| 当前主线成立阶段 | 建立独立 identity truth center、正式承接层、reference-only external boundary、只读派生消费、accepted fact 最终一致传播、append-only trace / career、显式降级 marker 和 report-only 维护 | method/work/governance/memory/archive source 协议细节、字段级 visibility、诊断 schema、性能硬阈值、配置 schema 可后移 | 后续按具体压力增强来源承接、消费投影、追溯归档、恢复能力和性能基线 | 任一债务开始打穿 truth ownership、正文排除、query no-write、report-only、依赖裁剪或 accepted truth / propagation 分离 | 当前阶段足够支撑身份真相仓成立,但不承诺所有后续增强能力。 |
| 外部来源承接增强阶段 | 在不依赖外部 implementation 的前提下强化 method / work / governance / memory / archive 来源状态、basis、safe summary 和 stale / unavailable 表达 | 当前可先保留 source protocol 未细化,只要求 ref / marker / safe summary / basis 语义成立 | 更细的 source state、source version、resolver / adapter contract、basis validation、stale refresh 和 source reconciliation | 来源变化频繁、source stale 影响核心消费解释、high-risk basis 难以判断、实现阶段反复请求自行发明 source schema | 该阶段增强外部承接能力,不是把外部 truth 或正文搬进 identity。 |
| 消费投影与读取增强阶段 | 强化多 consumer profile、projection freshness、visibility / redaction、搜索 / dashboard / employee profile 等派生消费能力 | 当前可先保留字段级裁剪、projection schema 和搜索能力后移,只要求 query no-write 与 stale / degraded 可解释 | 多 projection profile、field-level visibility、read model rebuild strategy、consumer-specific summary、search index boundary | 下游消费方增多、读取压力上升、不同 consumer 对 visibility / redaction 的需求冲突、projection stale 无法解释 | 该阶段增强消费体验,但 projection 仍只读、可重建、不得成为 truth。 |
| 追溯 / 归档 / 观测增强阶段 | 强化 trace / audit / archive / observability handoff、长期留存、redacted trace view 和审计回放能力 | 当前可先保留 handoff target、diagnostic report schema、long-term retention policy 后移 | 更强 trace handoff、archive handoff、audit replay、redacted diagnostic report、handoff recovery | 合规 / 审计要求升级、handoff failure 规模扩大、trace view 不足以支持复盘、归档承载边界需要正式闭口 | 该阶段增强追溯能力,但 observability / archive body 仍不进入 identity truth。 |
| 恢复能力与性能基线增强阶段 | 强化 event replay、projection rebuild、reference refresh、maintenance scope、performance / availability baseline 和 config change guard | 当前可先保留硬阈值、capacity model、maintenance scope schema 和 retry policy 后移 | 正式 baseline、sample-to-threshold 规则、rebuild / replay policy、maintenance partitioning、config validation / diff gate | sample 或运行数据证明当前路径被放大,事件 / projection / maintenance 失败堆积,配置变更开始影响主线边界 | 该阶段增强运行韧性和可验收性,但不得让恢复任务修复相邻仓 truth。 |

### 7.2 阶段边界说明

当前阶段不是“全做完才算成立”,而是先让 identity 作为身份真相仓的结构主线成立:truth ownership 清楚、外部来源只经正式承接层进入、消费只读且可解释、传播最终一致、追溯可审计、维护 report-only。当前可接受的债务都不能改变这些主线,只能影响后续 schema、字段级策略、基线和增强型承接能力。后续演进必须由明确结构压力触发,例如 source 状态无法解释、consumer profile 冲突、trace / handoff 不足、event / projection 失败规模扩大或性能基线无法成立。已经被前文排除的边界外能力不会因为“未来演进”而重新进入 identity 主线。

### 7.3 当前可接受债务表

| 债务 | 当前可接受原因 | 不能越过的红线 | 触发后的演进方向 |
|---|---|---|---|
| method-library 到 identity 的 role / capability 来源协议未细化 | 当前已固定 method 拥有定义正文,identity 只拥有身份侧摘要、source ref 和 marker | 不得复制 RoleDefinition / CapabilityDefinition body,不得依赖 method implementation | 外部来源承接增强阶段补 source contract、version、stale / unavailable 语义 |
| high-risk lifecycle 动作枚举和 basis 细节未细化 | 当前已固定高风险动作必须有 actor / basis boundary,缺 basis 不得 accepted | 不得默认通过、不得由 runtime 状态替代 lifecycle、不得绕过 governance / authorization basis | 外部来源承接增强阶段补 basis validation 和 lifecycle action matrix |
| memory / archive handoff surface 未细化 | 当前已固定 memory body / archive package 不入仓,identity 只维护 refs / marker / handoff status | 不得保存 memory body、embedding、archive package,不得把 handoff failure 润色成成功 | 追溯 / 归档 / 观测增强阶段补 handoff target、record 和 recovery surface |
| 字段级 visibility / redaction 未细化 | 当前已固定 query no-write、not visible / stale / degraded、forbidden body 不泄漏 | 不得直接暴露 core truth 给下游,不得隐藏不可见状态为普通缺失 | 消费投影与读取增强阶段补 field-level visibility 和 consumer-specific projection |
| performance / availability 硬阈值未细化 | 当前旧 P95 / 容量不可继承,但结构上已禁止同步 fan-out 和下游阻塞 accepted path | 不得用无阈值 sample 冒充 pass,不得让核心读取依赖外部正文同步拉取 | 恢复能力与性能基线增强阶段补 baseline、threshold 或评审规则 |
| 配置 schema 和 runtime profile 未细化 | 当前已固定配置不得改变 ownership、query no-write、report-only、依赖裁剪和 phase boundary | 不得通过配置启用未正式定义 source、复制正文、绕过 adapter boundary 或修复外部 truth | 恢复能力与性能基线增强阶段补 config validation / diff gate |
| full event-sourcing-first 未作为当前主体范式 | 当前需求要求追溯和 event collaboration,未要求所有 truth 事件溯源化 | 不得失去 accepted truth 的可追溯材料,不得用 outbox / event shadow 反向定义 current truth | 若 replay / temporal query / audit 压力明确,评估局部或全局事件溯源增强 |

### 7.4 触发条件小表

| 触发条件 | 触发的演进方向 | 判断口径 |
|---|---|---|
| 外部来源状态难以解释或 source stale 频繁影响消费 | 外部来源承接增强 | 实现或验收反复需要自造 source schema / resolver rule / stale marker |
| 高风险 lifecycle 判断无法稳定映射 basis | 外部来源承接增强 | 缺动作枚举、basis validation 或 governance summary 导致 flow 无法 1:1 落码 |
| 下游 consumer 增多且 visibility / redaction 需求冲突 | 消费投影与读取增强 | 单一 summary view 无法同时满足 consumer 可见性和隐私边界 |
| projection stale / degraded 对用户或消费者不可解释 | 消费投影与读取增强 | query / trace / report 不能稳定表达 not visible、stale、degraded 或 unavailable |
| trace / audit / handoff 不足以支持合规、复盘或归档 | 追溯 / 归档 / 观测增强 | safe trace refs、handoff refs 或 diagnostic markers 无法支撑审计问题 |
| event publish、handoff、projection rebuild 或 reconciliation failure 堆积 | 恢复能力与性能基线增强 | 失败状态无法通过现有 retry / pending / report-only 口径收敛 |
| 性能 sample 或容量评审显示核心路径被放大 | 恢复能力与性能基线增强 | 核心 read/write 因同步外部来源、projection rebuild 或 maintenance scope 放大 |
| 配置变更开始影响主线边界 | 恢复能力与性能基线增强 | adapter / source / retry / maintenance 配置可能改变 ownership、report-only 或依赖裁剪 |

### 7.5 不演进项

| 不演进方向 | 原因 | 前序来源 |
|---|---|---|
| 接管认证、credential、token、session、secret | 这些不是 GlobalMember truth,属于认证 / 安全入口 | Step 2 / 3 / 8 / 12 |
| 接管 ProjectMember、WorkItem、Iteration 或 project truth | 这些归 `L1-work`,identity 只提供 GlobalMember anchor 和 source refs | Step 3 / 8 |
| 接管 RoleDefinition、CapabilityDefinition、method body 或评估算法 | 这些归 method-library,identity 只保存身份侧摘要和 source / evidence refs | Step 3 / 8 / 10 |
| 接管 memory body、embedding、archive package 或 artifact body | 这些属于外部正文 / 承载方,identity 只保存 refs / relation / handoff marker | Step 3 / 8 / 12 |
| 接管 governance decision truth、policy body 或 approval truth | identity 只消费 high-risk basis / summary / marker,不拥有治理裁决 truth | Step 2 / 3 / 8 |
| 接管 runtime execution、container state 或 runtime availability | runtime 状态不能替代全局 identity lifecycle | Step 3 / 7 / 9 |
| 接管 workspace / UI 展示状态或 consumer private state | 下游只能消费 identity facts,不得反写或定义 identity truth | Step 3 / 8 / 11 |
| 把 full external body replication 作为演进 | 已违反 forbidden body boundary,不是可演进路径 | Step 8 / 10 / 11 / 12 |

---

## 8. 回填草稿

````md
## 14. 演进路线

> 校准来源:
> - `design-calibration/01_arch_step_13_evolution_path.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“演进路线表”“当前可接受债务表”“触发条件小表”和“不演进项”小节,了解当前阶段做到哪里算架构成立,以及哪些变化必须由明确结构压力触发。

`L1-identity` 的演进路线描述的是架构主线的阶段性成立方式,不是项目排期或任务拆单。当前阶段的目标是先让身份 truth center、正式承接层、reference-only 外部边界、只读消费、eventual accepted fact propagation、append-only trace / career、显式降级 marker 和 report-only 维护成立。后续增强只围绕来源承接、消费投影、追溯归档、恢复能力和性能基线展开;已被职责边界和数据 ownership 排除的能力不会作为未来 identity 主线。

| 阶段 | 当前目标 / 范围 | 当前可接受债务 | 后续演进项 | 触发条件 | 说明 |
|---|---|---|---|---|---|
| 当前主线成立阶段 | 建立独立 identity truth center、正式承接层、reference-only external boundary、只读派生消费、accepted fact 最终一致传播、append-only trace / career、显式降级 marker 和 report-only 维护 | source 协议细节、字段级 visibility、诊断 schema、性能硬阈值、配置 schema 可后移 | 后续按具体压力增强来源承接、消费投影、追溯归档、恢复能力和性能基线 | 任一债务开始打穿 truth ownership、正文排除、query no-write、report-only、依赖裁剪或 accepted truth / propagation 分离 | 当前阶段足够支撑身份真相仓成立,但不承诺所有后续增强能力。 |
| 外部来源承接增强阶段 | 强化 method / work / governance / memory / archive 来源状态、basis、safe summary 和 stale / unavailable 表达 | 当前可先保留 source protocol 未细化 | 更细的 source state、source version、resolver / adapter contract、basis validation、stale refresh 和 source reconciliation | 来源变化频繁、source stale 影响核心消费解释、high-risk basis 难以判断 | 该阶段增强外部承接能力,不是把外部 truth 或正文搬进 identity。 |
| 消费投影与读取增强阶段 | 强化多 consumer profile、projection freshness、visibility / redaction、搜索 / dashboard / employee profile 等派生消费能力 | 当前可先保留字段级裁剪、projection schema 和搜索能力后移 | 多 projection profile、field-level visibility、read model rebuild strategy、consumer-specific summary、search index boundary | 下游消费方增多、读取压力上升、不同 consumer 对 visibility / redaction 的需求冲突 | 该阶段增强消费体验,但 projection 仍只读、可重建、不得成为 truth。 |
| 追溯 / 归档 / 观测增强阶段 | 强化 trace / audit / archive / observability handoff、长期留存、redacted trace view 和审计回放能力 | 当前可先保留 handoff target、diagnostic report schema、long-term retention policy 后移 | trace handoff、archive handoff、audit replay、redacted diagnostic report、handoff recovery | 合规 / 审计要求升级、handoff failure 规模扩大、trace view 不足以支持复盘 | 该阶段增强追溯能力,但 observability / archive body 仍不进入 identity truth。 |
| 恢复能力与性能基线增强阶段 | 强化 event replay、projection rebuild、reference refresh、maintenance scope、performance / availability baseline 和 config change guard | 当前可先保留硬阈值、capacity model、maintenance scope schema 和 retry policy 后移 | 正式 baseline、sample-to-threshold 规则、rebuild / replay policy、maintenance partitioning、config validation / diff gate | sample 或运行数据证明当前路径被放大,事件 / projection / maintenance 失败堆积,配置变更开始影响主线边界 | 该阶段增强运行韧性和可验收性,但不得让恢复任务修复相邻仓 truth。 |

### 14.1 不演进项

identity 后续演进不包括接管认证、credential、ProjectMember、WorkItem、RoleDefinition、CapabilityDefinition、method body、memory body、archive package、governance decision truth、runtime execution、workspace / UI 展示状态或 consumer private state。这些方向已经被前文明确排除,不是后续增强路径。
````

---

## 9. 待确认事项

本步不新增阻塞性待确认事项。需求层 `OQ-ID-001`~`OQ-ID-006` 继续有效,并将在 Step 14 与风险项一起显式收纳。

| 待确认项 | 本步处理 |
|---|---|
| `OQ-ID-001` method-library 到 identity 的角色 / 能力来源方式 | 作为外部来源承接增强阶段的触发项,当前不闭口协议。 |
| `OQ-ID-002` 高风险 lifecycle 动作枚举 | 作为 high-risk basis 判断增强的触发项,当前不闭口动作枚举。 |
| `OQ-ID-003` memory refs 的正式承载方和迁移结果 surface | 作为追溯 / 归档 / 观测增强阶段的触发项,当前不闭口 handoff surface。 |
| `OQ-ID-004` 成员摘要 visibility / privacy 字段级裁剪 | 作为消费投影与读取增强阶段的触发项,当前不闭口字段级裁剪。 |
| `OQ-ID-005` P0 performance / availability 阈值 | 作为恢复能力与性能基线增强阶段的触发项,当前不继承旧阈值。 |
| `OQ-ID-006` 既有 `04` 是否保留或重写 | 作为配置与变更控制增强项,当前不让旧 `04` 反向决定新版 `01`。 |

---

## 10. 进入下一步条件

Step 13 已完成。进入 Step 14 前必须满足:

- 用户已通过“同意”确认本步演进路线。
- `01_architecture_calibration_flow.md` 已将 Step 13 状态更新为 `已完成`。
- Step 14 只能收纳前序尚未关闭的风险和待确认事项,不得把本步后移债务润色成已闭口结论。
- 若审核发现本步写成项目排期、任务拆单、TODO 清单、未来愿望池,或把已排除事项重新包装成演进项,必须先修正本 Step,不能进入 Step 14。
