# Step 8. 数据所有权与一致性策略

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 8
> 对应书写规范: `standards/document/架构设计书写规范.md` §4.9
> 回填位置: 正式 `01-架构设计.md` §9
> 日期: 2026-08-22
> 当前状态: `pass`;BC-L2M-01~07 data 与 cross-data audit 全部通过
> 串行门禁: BC01~07 逐单元停审和跨数据审计完成前,禁止创建 Step 9

## 1. 本步输入与数据类型

| 输入 | 本步承接 |
|---|---|
| Step 3 RESP / RR | member 拥有与不拥有的仓级事实。 |
| Step 5 BC01~07 | 每类语义事实的唯一上下文 owner。 |
| Step 7 dependency direction | 外部数据只能通过 inward seam 形成 ref / snapshot / result / gap。 |
| 正式 00 §11 / §13 | truth / snapshot / ref / forbidden body 与幂等 / late / unknown 需求。 |
| Runtime / Tools / host / Bus / Conversation / Governance 当前正式 owner | 外部 truth 不得形成副本或被 member 反写。 |

| 数据类型 | 架构定义 | 一致性上限 |
|---|---|---|
| 正式真相数据 | member 对自身交互边界事实的唯一权威记录 | 同一决定及其必要 source / scope / correlation 在逻辑本地提交边界内一致;物理事务 pending。 |
| 快照 / 投影数据 | external safe snapshot 或 member 可重建 read model | 消费时点 / 最终一致;必须显式 source / scope / freshness / stale / gap,不得反写。 |
| 引用关系数据 | 指向本地 / 外部 owner fact 的 typed correlation | 引用完整性可验证;unresolved / conflict / wrong owner 显式。 |
| 明确不拥有的正文 / 真相 | raw body、hidden reasoning、secret、外部生命周期 / execution / delivery / decision / definition body | 不进入 truth、snapshot、trace、projection、handoff 或 state carrier。授权瞬时 inspection 不改变此规则。 |

逻辑一致性不等于已存在数据库、事务、atomic commit、volume 或 recovery。任何物理 commit unknown 必须 fenced,不得盲重试或声明部分成功。

## 2. 数据单元停审计划

| 顺序 | 单元 | 状态 | 下一动作 |
|---:|---|---|---|
| 1 | BC-L2M-01 Presence / Host | pass | BC02 |
| 2 | BC-L2M-02 Inbound | pass | BC03 |
| 3 | BC-L2M-03 Runtime Mediation | pass | BC04 |
| 4 | BC-L2M-04 Outbound | pass | BC05 |
| 5 | BC-L2M-05 Trace | pass | BC06 |
| 6 | BC-L2M-06 Mirror | pass | BC07 |
| 7 | BC-L2M-07 Read Model | pass | cross audit |
| 8 | cross-data audit | pass | Step 9 allowed |

## 3. BC-L2M-01 数据所有权

| 类别 | 数据 | 所有权与边界 |
|---|---|---|
| truth | startup acceptance / rejection、local presence、presence change、host request / signal / report formation、local attempt / gap | BC01 唯一拥有;历史不可被 host feedback 覆盖。 |
| snapshot / projection | host acceptance / session / health safe summary、subject / identity safe summary | 只消费 owner-safe view,带 freshness;不证明 host / Identity / Work 当前 truth。 |
| reference | ProjectMemberRef、GlobalMemberRef、startup / credential ref、host acceptance / session ref | 只保持 owner / scope / correlation;解析失败拒绝 / gap。 |
| forbidden | ProjectMember / GlobalMember body、credential value / secret、host registry / session / health truth、container / process lifecycle truth | 不保存、不派生、不反写。 |

### 3.1 一致性与失败口径

| 关系 | 一致性口径 | 失败 / 补偿上限 |
|---|---|---|
| ProjectMember subject + GlobalMember anchor + startup acceptance + initial presence | 逻辑本地强一致;关联冲突不得部分进入 presence | commit unknown -> fenced / unknown;不可验证 -> reject。 |
| presence change + source / reason / correlation | 逻辑本地强一致、历史追加 | 非法迁移拒绝;不静默覆盖。 |
| host request / signal / report 与 local attempt | local truth first;外部 feedback 最终一致 | unavailable -> degraded / gap;不声明 accepted / healthy。 |
| host safe snapshot | 消费时点一致,允许 stale 显式 | stale / conflict 不覆盖 presence;形成 marker / gap。 |

### 3.2 单元停审

| 检查项 | 结果 |
|---|---|
| subject / anchor / presence truth 是否唯一 | pass |
| host / Identity / Work snapshot 是否禁止反写 | pass |
| credential / host body 是否禁止保存 | pass |
| 强一致关系是否只写逻辑要求,未伪造物理事务 | pass |
| external failure 是否不回滚本地 history | pass |

`BC-L2M-01 data gate = pass`。下一允许单元仅为 BC-L2M-02。

## 4. BC-L2M-02 数据所有权

| 类别 | 数据 | 所有权与边界 |
|---|---|---|
| truth | subscription scope decision / change、screening conclusion、body-free inbound disposition、rule source link | BC02 唯一拥有;screening 不等于 Policy / Runtime truth。 |
| snapshot / projection | Policy effective / risk taxonomy safe snapshot、fact source safe summary | 消费时点一致,带 source / scope / freshness;stale / conflict 保守处置。 |
| reference | inbound fact ref、rule source ref、member subject / scope ref | 不复制 fact / Policy body;wrong owner / unresolved 显式。 |
| transient only | 正式授权范围内必要正文 inspection window | 只在瞬时检查语境存在;不是 member data,不得跨出该语境。 |
| forbidden | raw body persistent / cache / trace / projection copy、Policy definition / decision body、Bus delivery / route truth | 不保存、不透明转发、不从 snapshot 反推。 |

### 4.1 一致性与失败口径

| 关系 | 一致性口径 | 失败 / 补偿上限 |
|---|---|---|
| subscription decision + source / subject / scope | 逻辑本地强一致 | source invalid / conflict -> reject;不保留半生效 scope。 |
| screening conclusion + fact ref + rule source + disposition | 逻辑本地强一致,body-free | inspection unauthorized / unsafe -> blocked / pending;commit unknown fenced。 |
| Policy / fact source snapshot | 消费时点一致 | unknown / stale / conflict -> conservative result;不自建 fallback allowlist。 |
| duplicate inbound fact | 幂等识别,不得产生分叉结论 / 重复不可逆副作用 | identity / correlation 不足 -> pending,不猜测合并。 |
| Bus delivery vs member disposition | 跨 owner 最终关联 | late / duplicate delivery feedback 形成新 link,不改原结论。 |

### 4.2 单元停审

| 检查项 | 结果 |
|---|---|
| screening truth 是否与 Policy / Bus / Runtime truth 分开 | pass |
| transient body 是否禁止持久化 / raw forwarding | pass |
| snapshot 是否禁止 fail-open /反写 | pass |
| duplicate / unknown 是否无盲重放 | pass |
| logical commit 是否未伪造 physical storage | pass |

`BC-L2M-02 data gate = pass`。下一允许单元仅为 BC-L2M-03。

## 5. BC-L2M-03 数据所有权

| 类别 | 数据 | 所有权与边界 |
|---|---|---|
| truth | Runtime delivery decision、entry submission local attempt / gap、screening-to-entry correlation、committed material reception / source validation conclusion | BC03 唯一拥有;不等于 Runtime acceptance / run / outcome。 |
| snapshot / projection | Runtime safe status / availability view(若正式提供) | 消费时点一致,只影响 current boundary decision;不得 shadow Runtime state。 |
| reference | screening fact ref、entry result ref、Runtime outcome / committed safe material ref、correlation ref | 只关联 owner fact;不复制 result / outcome body。 |
| forbidden | Runtime run / context / plan / checkpoint / outcome body、raw input / output、IPC payload archive、Tools / Sandbox / model result body | 不进入 member truth、trace、projection 或 handoff。 |

### 5.1 一致性与失败口径

| 关系 | 一致性口径 | 失败 / 补偿上限 |
|---|---|---|
| delivery decision + screened source / subject / correlation | 逻辑本地强一致 | source mismatch / incomplete -> reject / blocked;commit unknown fenced。 |
| decision -> submission local attempt | local truth first,attempt 为后续显式事实 | seam unavailable -> waiting / gap;不回滚 decision,不代答。 |
| Runtime acceptance / rejection / unknown feedback | 跨 owner 最终关联 | duplicate / late / out-of-order -> append link / pending;不覆盖 decision。 |
| committed material ref + source validation / reception | 逻辑本地强一致 | wrong source / unsafe / unresolved -> reject / gap;不生成 outbound source。 |
| unknown side effect / timeout | unknown fence | 未有正式 idempotency / resolution 证据不得盲重放。 |

### 5.2 单元停审

| 检查项 | 结果 |
|---|---|
| member delivery truth 与 Runtime truth 是否分开 | pass |
| Runtime safe view 是否禁止 shadow /反写 | pass |
| run / outcome / payload body 是否禁止保存 | pass |
| feedback 最终一致是否只追加 link | pass |
| commit / side-effect unknown 是否 fenced | pass |

`BC-L2M-03 data gate = pass`。下一允许单元仅为 BC-L2M-04。

## 6. BC-L2M-04 数据所有权

| 类别 | 数据 | 所有权与边界 |
|---|---|---|
| truth | outbound decision、material acceptance / rejection descriptor、publication local attempt / gap、external feedback link fact | BC04 唯一拥有;decision 与 attempt 分开,外部反馈不改历史。 |
| derived handoff material | body-free、redacted、source-anchored safe handoff material | 为提交边界服务;不得成为 Runtime / Conversation / Artifact / Evidence 正文副本。 |
| snapshot / projection | target / route availability safe snapshot、delivery / downstream status safe summary | 只辅助当前 handoff / view;不等于 delivery / accepted truth。 |
| reference | Runtime committed material / outcome ref、target / route ref、delivery / observed / accepted feedback ref | 只保持 owner / correlation;resolution 失败形成 gap。 |
| forbidden | Runtime result body、hidden reasoning、secret、raw input / output、conversation / artifact / evidence body、Bus delivery / downstream / observed truth | 不保存、不发布、不进入 trace / projection。 |

### 6.1 一致性与失败口径

| 关系 | 一致性口径 | 失败 / 补偿上限 |
|---|---|---|
| outbound decision + committed source ref + target class + safety conclusion | 逻辑本地强一致 | unsafe / wrong source / unresolved -> reject;不得形成部分决定。 |
| decision -> safe material / publication attempt | local truth first,material / attempt 在决定后显式形成 | route unavailable -> gap;不回滚 decision。 |
| publication attempt -> Bus / downstream feedback | 跨 owner 最终关联 | delivery fail / duplicate / late -> append fact;不改 decision。 |
| duplicate publication intent | 幂等识别,不产生重复不可逆副作用 | result unknown -> fenced;无证据不自动 replay。 |
| feedback vs current state | source-correlated append-only | out-of-order 不覆盖新事实或旧历史。 |

### 6.2 单元停审

| 检查项 | 结果 |
|---|---|
| outcome / outbound / attempt / delivery / accepted truth 是否分开 | pass |
| safe material 是否 body-free 且非 external body 副本 | pass |
| target / feedback snapshot 是否禁止反写 | pass |
| external failure 是否不回滚 local decision | pass |
| duplicate / unknown 是否 fenced | pass |

`BC-L2M-04 data gate = pass`。下一允许单元仅为 BC-L2M-05。

## 7. BC-L2M-05 数据所有权

| 类别 | 数据 | 所有权与边界 |
|---|---|---|
| truth | trace link、correlation gap、safe observation / audit material formation、observation handoff local attempt / gap | BC05 唯一拥有;不复制或重定义 source decision。 |
| derived material | body-free、redacted、low-cardinality、source-correlated observation / audit material | 只从 committed fact ref 派生;不等于 evidence / report / observed fact。 |
| snapshot / projection | external ingest / observed feedback safe summary(若正式提供) | 最终关联,只说明外部状态;不覆盖 local attempt。 |
| reference | BC01~04 committed fact ref、external source / result ref、Core trace / causation metadata | link 必须有来源;unresolved 显式 gap。 |
| forbidden | complete logs、event / run / conversation / tool body、hidden reasoning、secret、Evidence / verdict / report、observability store truth | 不保存、不从日志反推 core truth。 |

### 7.1 一致性与失败口径

| 关系 | 一致性口径 | 失败 / 补偿上限 |
|---|---|---|
| source fact + minimal correlation anchor | 在 source context 的逻辑本地提交边界内一致 | anchor 不完整则 source 显式标 gap,不猜测补齐。 |
| source fact -> trace link | append-only,允许最终收敛 | link 形成失败 -> correlation gap;不回滚 source fact。 |
| trace link / gap correction | 历史不可变,以新事实 supersede / resolve | 不原地删除误关联历史。 |
| safe material -> observation handoff | local truth first,外部最终一致 | route / backend unavailable -> attempt / gap;不声明 observed。 |
| duplicate / late external feedback | 幂等关联 + append-only | 不产生重复 link 分叉,不覆盖新状态。 |

### 7.2 单元停审

| 检查项 | 结果 |
|---|---|
| Trace 是否只拥有 link / gap / material / attempt | pass |
| source truth 是否不复制 /不回滚 | pass |
| full log / evidence / observed body 是否禁止保存 | pass |
| trace 最终一致是否有显式 gap | pass |
| correction 是否 append-only | pass |

`BC-L2M-05 data gate = pass`。下一允许单元仅为 BC-L2M-06。

## 8. BC-L2M-06 数据所有权

| 类别 | 数据 | 所有权与边界 |
|---|---|---|
| local support truth | external ref resolution state、snapshot receipt state、source / scope / freshness marker、mirror conflict / gap | BC06 只拥有“本仓当前如何消费”的状态,不拥有 source 业务事实。 |
| snapshot / projection | Work / Identity / Governance / host / Runtime / Bus feedback / Tools / method 正式 safe snapshot | 带 owner / source time / scope / freshness;可 stale / unresolved / conflict。 |
| reference | 所有正式 external typed ref | ref 本身不迁移 owner,不等于 authorization / healthy / accepted / available。 |
| local index | ref -> current resolution / freshness / gap 的可重建定位 | 不是 canonical registry 或 definition store。 |
| forbidden | external entity / policy / run / session / delivery / definition body、credential / secret、source lifecycle truth | 不复制、不合并、不反写。 |

### 8.1 一致性与失败口径

| 关系 | 一致性口径 | 失败 / 补偿上限 |
|---|---|---|
| ref + expected owner / scope + resolution state | 逻辑本地一致 | wrong owner / scope / unsupported -> conflict / reject / gap。 |
| snapshot receipt + source / time / freshness marker | 逻辑本地一致 | metadata incomplete -> unresolved;不进入 core decision as valid。 |
| source truth -> local snapshot | 消费时点 / 最终一致 | update unavailable -> stale;不猜测续期。 |
| multiple source conflict | 不合并为新 truth | 保留 source-specific conflict,由消费上下文 conservative handling。 |
| local index rebuild | 可重建,最终一致 | rebuild gap 不改变 resolution source record 或外部 truth。 |

### 8.2 单元停审

| 检查项 | 结果 |
|---|---|
| local support truth 是否与 external business truth 分开 | pass |
| snapshot / ref 是否有 source / scope / freshness | pass |
| projection / index 是否禁止反写 | pass |
| conflict 是否禁止静默合并 | pass |
| external body / credential / definition 是否禁止保存 | pass |

`BC-L2M-06 data gate = pass`。下一允许单元仅为 BC-L2M-07。

## 9. BC-L2M-07 数据所有权

| 类别 | 数据 | 所有权与边界 |
|---|---|---|
| projection | Member Summary、Capability Outlet(可裁剪)、Diagnostic Summary、Boundary Explanation View | 全部从正式 source 重建,不是业务 truth 或 authorization。 |
| projection state | fresh / stale / rebuilding / unresolved / gap、rebuild / reconciliation local result | 只说明视图状态,不得改变 source truth。 |
| reference | BC01~05 committed fact / trace ref、BC06 freshness marker、Runtime / Tools / method safe ref | 只读;source unavailable 传播 stale / gap。 |
| local index | 面向只读消费的可重建定位 / aggregation | 不成为 registry、canonical definition store 或 source-of-record。 |
| forbidden | source mutable model、raw / event / run / conversation / tool / method body、secret、hidden reasoning、configuration truth | 不复制、不缓存为投影正文、不通过 read path 写回。 |

### 9.1 一致性与失败口径

| 关系 | 一致性口径 | 失败 / 补偿上限 |
|---|---|---|
| committed source -> projection | 最终一致、可重建 | lag / rebuild fail -> stale / gap;不回滚 source。 |
| projection + source cursor / freshness | 逻辑本地一致 | cursor / freshness 不完整 -> unresolved;不显示为 fresh。 |
| rebuild / reconciliation | 幂等派生 | 重复执行不创建业务 fact;发现不一致只报告 gap。 |
| capability definition ref -> outlet | 最终一致、source-owned | ref invalid / stale -> outlet stale / gap 或裁剪;不复制 body。 |
| multiple source aggregation | source-specific freshness | conflict 显式,不合并出新的 canonical truth。 |

### 9.2 单元停审

| 检查项 | 结果 |
|---|---|
| projection 是否全部可重建且非 truth | pass |
| freshness / cursor / gap 是否显式 | pass |
| rebuild / reconciliation 是否禁止反写 | pass |
| outlet 是否禁止 registry / authorization / body copy | pass |
| source failure 是否只降级 projection | pass |

`BC-L2M-07 data gate = pass`。七个单元数据边界均已停审;下一允许动作仅为跨数据边界审计。

## 10. 数据归属总表

| 数据组 | 类型 | 唯一 owner | 其他上下文 / 外部关系 |
|---|---|---|---|
| subject acceptance / presence / host local attempt | member truth | BC01 | Work / Identity / host 只提供 ref / safe result,不反写。 |
| subscription / screening / disposition | member truth | BC02 | Policy / fact source 只提供 ref / snapshot,Bus / Runtime 不反写。 |
| delivery / submission / Runtime reception local fact | member truth | BC03 | Runtime acceptance / outcome 只以 ref 最终关联。 |
| outbound / material gate / publication attempt / gap | member truth | BC04 | Bus / downstream feedback 只以 ref 追加关联。 |
| trace link / correlation gap / observation material / attempt | member truth | BC05 | Source facts 只被引用;observed / evidence 外置。 |
| external ref resolution / freshness / mirror gap | member support truth | BC06 | 不等于 external business truth。 |
| summary / outlet / diagnostic / explanation / projection state | member projection | BC07 | 最终一致、可重建、不可反写。 |
| ProjectMember / GlobalMember / policy / host / Runtime / tool / delivery / downstream facts | external truth | 对应外部 owner | member 只持 typed ref / safe snapshot / feedback link。 |
| raw / hidden / secret / definition / full log / evidence / conversation / artifact bodies | forbidden | 外部 owner / 不进入 member | 瞬时授权 inspection 不产生副本。 |

## 11. 一致性策略总表

| 数据关系 / 场景 | 一致性策略 | 失败处理 |
|---|---|---|
| 每个本地决定 + subject / source / scope / correlation / reason | 逻辑本地强一致 | incomplete / conflict -> reject / blocked;physical commit unknown -> fenced。 |
| presence / screening / delivery / outbound 的历史变化 | append / supersede,不原地抹写 | correction 形成新事实;旧历史保留。 |
| local decision -> external submission / handoff | local truth first,外部最终一致 | attempt / gap;外部失败不回滚本地决定。 |
| host / Runtime / Bus / downstream feedback | source-correlated 最终一致 | late / duplicate / out-of-order -> idempotent link / new fact / pending。 |
| external truth -> ref / safe snapshot | 消费时点一致,允许 stale / conflict / missing 显式 | conservative / gap;不猜测刷新或合并。 |
| source fact -> trace link | 最终一致但 source 必须含最小 correlation anchor | trace failure -> gap,不回滚 source。 |
| source fact -> member projection | 最终一致、可重建 | stale / rebuild gap;不反写。 |
| duplicate command / event / feedback | idempotent classification | identity 不足 -> pending;不执行未知副作用 replay。 |
| commit / side-effect unknown | unknown fence | 等待正式 resolution / evidence;禁止盲重试。 |

本仓不要求与 host、Runtime、Bus、Conversation 或 Observability 形成跨仓分布式事务。跨 owner 的正确性由 local truth first、source-correlated feedback、explicit gap 和 immutable history 保证,不是由共享数据库或二阶段提交假设保证。

## 12. 跨数据边界审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 双真相 | pass | 每类 member fact 只有 BC01~06 中一个 owner;external truth 全部外置。 |
| projection / cache 反写 | pass | BC07 / local index / snapshot 均无 core write 权限。 |
| 引用正文入仓 | pass | ref 只保存 owner / scope / correlation;body 明确 forbidden。 |
| 入站正文边界 | pass | 仅 BC02 transient inspection window,不跨上下文持久化 / raw forward。 |
| 强一致误用 | pass | 只约束本地决定及必要关联;未要求跨仓 distributed transaction。 |
| 最终一致误用 | pass | 外部反馈 / trace / projection 均不覆盖 source truth。 |
| duplicate / late / out-of-order | pass | idempotent / append / pending,无分叉 / 逆写。 |
| commit unknown | pass | 只定义 fence;未伪造 storage / recovery。 |
| forbidden body | pass | run / tool / conversation / artifact / evidence / secret / hidden reasoning / full log 均不进入。 |
| sibling pending | pass | host / image / credential / route schema 未升格。 |

## 13. 物理数据合同后移清单

| 未定事项 | 后续落点 | 当前架构限制 |
|---|---|---|
| database / embedded store / volume / remote store | 03 / 04 / 07 | 必须保护 owner、body-free、history 和 truth / projection 分离。 |
| aggregate / transaction / unit-of-work / atomicity | 02 / 03 | 必须满足本地决定 + 必要 correlation 的逻辑一致性。 |
| outbox / handoff carrier / delivery receipt | 02 / 03 / 04 | local truth first;attempt 不等于 delivery。 |
| version / lock / concurrency control / idempotency key | 03 | duplicate / late / unknown 不分叉。 |
| retention / archive / backup / restore | 03 / 04 / 05 | forbidden body 不因 retention 需求入仓;恢复不能改历史。 |
| encryption / key / secret reference | 03 / 04 | secret body 不进入 member;credential owner 外置。 |

这些 pending 不阻塞 Step 9 讨论通信类别和失败降级,但阻塞物理可落码、恢复资格、测试 evidence 与 readiness。

## 14. 当前文档问题诊断与取舍

| 旧口径 | 问题 | 当前结论 |
|---|---|---|
| IdentityCard / inbound event / outbound event / heartbeat state 粗分 | 未区分 truth / snapshot / ref / forbidden body | 按 BC01~07 和四类数据重建。 |
| member 内单进程强一致 | 物理进程假设冒充一致性合同 | 只锁逻辑本地强一致,物理 transaction pending。 |
| inbound / outbound at-least-once | Bus delivery guarantee 无 member authority | 只锁 duplicate / late / unknown 处理和 local truth first。 |
| audit event append-only | 未区分 source fact / trace link / observed truth | source / link append,backend truth 外置。 |
| retry / backlog / reconnect 补偿 | 可能盲重放 unknown side effect | explicit gap + unknown fence;具体恢复后移。 |

## 15. 结构化中间产物与回填草稿

- 数据 owner: BC01~06 local truth / support truth,BC07 projection,external owner facts 全部 ref / snapshot。
- 一致性: local logical strong + external eventual + immutable history + unknown fence。
- 禁止: distributed shared truth、projection backwrite、body persistence / raw forwarding、blind replay。
- 物理 store / transaction / outbox / retention / recovery 合同保持 pending。

正式 §9 回填数据归属总表、一致性策略总表、forbidden-body 说明和物理合同后移边界。不得写表结构、字段、DDL、缓存产品、事务脚本或已实现持久化。

## 16. Step 8 总门禁

| 检查项 | 结果 |
|---|---|
| 每个架构单元是否定义 truth / snapshot / projection / ref / forbidden | pass;7 / 7 |
| 每个单元是否独立停审 | pass;7 / 7 |
| 是否完成双真相 / 投影反写 / 正文入仓审计 | pass |
| 强一致 / 最终一致 / unknown fence 是否清楚 | pass |
| 是否避免跨仓分布式事务假设 | pass |
| 是否伪造物理 store / transaction / recovery readiness | pass:未伪造 |
| Step 8 总门禁 | `pass` |

下一允许动作仅为创建 `01_arch_step_09_interactions_communication.md`;正式 `01` 仍禁止修改。
