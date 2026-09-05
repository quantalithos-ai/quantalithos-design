# Step 12. 横切关注点

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 12
> 对应书写规范: `standards/document/架构设计书写规范.md` §4.13
> 回填位置: 正式 `01-架构设计.md` §13
> 日期: 2026-08-22
> 当前状态: `pass`;BC-L2M-01~07 and cross-cutting audit pass
> 串行门禁: BC01~07 逐单元适用性停审和跨横切审计完成前,禁止创建 Step 13

## 1. 本步输入与判断原则

| 输入 | 本步承接 |
|---|---|
| Step 2 goals / constraints | 安全、owner、依赖与非伪造硬边界。 |
| Step 8 data / consistency | forbidden body、local truth first、idempotency、unknown fence。 |
| Step 9 communication | sync / async / background failure boundary。 |
| Step 10 mechanisms | anti-corruption mirror、append history、safe material、projection isolation。 |
| 正式 00 NFR-L2M-001~016 | 性能可分解、可用性、安全、追溯、一致性、可观测和 readiness 纪律。 |

判断规则:只有能明确说明“适用于哪个架构单元、保护什么、如何判断是否成立”的横切项才进入。具体监控实现、告警配置、secret 脚本、压测脚本、配置 key / default 和数值阈值不在本步。

## 2. 横切约束基线

| ID | 类别 | 正式约束 | 判断口径 |
|---|---|---|---|
| `CC-L2M-001` | 安全 / 主体 | subject、identity anchor、scope、source、credential / rule result 不可验证时 fail closed | invalid / conflict / unsupported / unknown 不得进入 positive state。 |
| `CC-L2M-002` | 安全 / 最小暴露 | inspection 之外所有 truth / trace / projection / handoff body-free | 无 raw body、hidden reasoning、secret、definition / conversation / artifact / evidence body。 |
| `CC-L2M-003` | 安全 / 网络边界 | 只允许正式 host / Bus / Runtime / owner seam;禁止通用 listener 和 provider / MCP / A2A / API 直连 | formal seam 与违规外联可区分。 |
| `CC-L2M-004` | 安全 / 派生 | snapshot / mirror / projection / outlet 不授予 authorization 且不得反写 | resolved / fresh 不自动等于 allowed / healthy / available。 |
| `CC-L2M-005` | 审计 / 追溯 | 关键决定 / 变化 / attempt / gap 有 subject、source、scope、purpose、correlation 和 result category | 任一事实可回链而不依赖正文。 |
| `CC-L2M-006` | 审计 / 历史 | correction / late feedback / resolution append or supersede,不原地抹写 | 历史和变化来源可解释。 |
| `CC-L2M-007` | 可观测性 | local state / decision / failure / dependency gap 形成低敏、低基数、可关联 material | 本地 attempt / gap 可判断,不依赖 backend ready。 |
| `CC-L2M-008` | 可观测性分层 | local decided / attempted 与 external delivered / observed / accepted / healthy 分开 | external feedback 不覆盖 local history。 |
| `CC-L2M-009` | 可用性 / 隔离 | 单一 external seam 失效只影响相关能力;已提交 local truth / history 保留 | waiting / blocked / degraded / stale / gap 具体归因。 |
| `CC-L2M-010` | 韧性 | duplicate / late / out-of-order idempotent / append;commit / side-effect unknown fenced | 无盲重放、无 truth 分叉。 |
| `CC-L2M-011` | 性能 | 本地判断、carrier / projection 和 external wait 分 stage / dependency / outcome 观察 | 不用总延迟掩盖外部等待;当前无数值。 |
| `CC-L2M-012` | 性能 / 容量隔离 | trace / observation / projection / read 不成为 core local commit 的外部同步放大点 | 派生失败可独立降级。 |
| `CC-L2M-013` | 配置 | 配置只能选择已允许机制,不能覆盖 owner、fail-closed、forbidden-body、unknown fence 或依赖分类 | 边界硬约束不可配置关闭。 |
| `CC-L2M-014` | 配置 / 来源 | 会影响 subject、scope、screening、target、freshness、continuation 的配置必须有 owner / source / version / scope / effective state | unknown / stale / conflict 不静默生效。 |
| `CC-L2M-015` | 数据生命周期 | retention / archive / rebuild 不能引入 forbidden body或修改 immutable history | 物理 retention 未定,边界先成立。 |
| `CC-L2M-016` | 证据纪律 | planned / fake / blocked / not_run 与 positive integration / evidence / readiness 分开 | 无实现 / run / artifact 不得写 pass。 |

## 3. 架构单元停审计划

| 顺序 | 单元 | 状态 | 下一动作 |
|---:|---|---|---|
| 1 | BC-L2M-01 Presence / Host | pass | BC02 |
| 2 | BC-L2M-02 Inbound | pass | BC03 |
| 3 | BC-L2M-03 Runtime Mediation | pass | BC04 |
| 4 | BC-L2M-04 Outbound | pass | BC05 |
| 5 | BC-L2M-05 Trace | pass | BC06 |
| 6 | BC-L2M-06 Mirror | pass | BC07 |
| 7 | BC-L2M-07 Read Model | pass | cross audit |
| 8 | cross-cutting audit | pass | Step 13 allowed |

## 4. BC-L2M-01 横切适用性

| 横切类别 | 适用 | 单元约束 / 判断口径 |
|---|---|---|
| 安全 | 是 | CC-001 / 002 / 003:双锚、startup / credential ref 不可验证即拒绝;credential body 不入仓;host 只经正式 seam。 |
| 审计 / 追溯 | 是 | CC-005 / 006:startup acceptance、presence change、host attempt 可回链 source / subject / reason。 |
| 可观测性 | 是 | CC-007 / 008:local presence / attempt / gap 与 host health / acceptance 分层,材料低敏。 |
| 可用性 / 韧性 | 是 | CC-009 / 010:host unavailable 只使 host path degraded;local presence history 保留;unknown 不自动重发。 |
| 性能 | 是,仅判断口径 | CC-011:startup 本地校验与 external ref wait 分开;无 `<5ms` / SLA 数字。 |
| 配置 | 是 | CC-013 / 014:subject type、credential source、host binding / signal policy 不得绕过 project-scoped / fail-closed;具体 key / interval 后移。 |
| 数据生命周期 | 是 | CC-015:presence / attempt history retention 未定,但 credential / external body 禁止因诊断需求入仓。 |
| 证据纪律 | 是 | CC-016:host fake / pending contract 不表示 registered / healthy / ready。 |

### 4.1 单元停审

| 检查项 | 结果 |
|---|---|
| 每个适用项是否有 BC01 原因和判断口径 | pass |
| 是否把 host health / credential truth 吸收 | pass:未吸收 |
| 是否写通用安全 / 观测空话 | pass:均挂载具体事实 |
| 是否下沉 secret / alert / heartbeat / performance 配置 | pass:未下沉 |
| 与 Step 8 / 9 数据通信是否一致 | pass |

`BC-L2M-01 cross-cutting gate = pass`。下一允许单元仅为 BC-L2M-02。

## 5. BC-L2M-02 横切适用性

| 横切类别 | 适用 | 单元约束 / 判断口径 |
|---|---|---|
| 安全 | 是,关键 | CC-001~004:rule / scope unknown conservative;inspection 只瞬时;无 raw forwarding / local allowlist;Bus / Governance seam 正式。 |
| 审计 / 追溯 | 是 | CC-005 / 006:每个 scope / screening / disposition 回链 subject / fact / rule source /四态结果。 |
| 可观测性 | 是 | CC-007 / 008:四态分布、source gap、inspection reject 低敏低基数;screening passed 不写 Runtime accepted。 |
| 可用性 / 韧性 | 是 | CC-009 / 010:Bus / Policy unavailable 进入 waiting / conservative state;duplicate fact 不分叉。 |
| 性能 | 是,仅 stage 口径 | CC-011:fact intake、local screening、external source resolution、Runtime wait 分开;不恢复 `<20ms`。 |
| 配置 | 是,关键 | CC-013 / 014:subscription / screening effective source 有 owner / version / scope / freshness;配置不能关闭 fail-closed / body ban。 |
| 数据生命周期 | 是,关键 | CC-015:transient inspection material 零持久化例外;retention 只适用于 body-free conclusion / link。 |
| 证据纪律 | 是 | CC-016:fake rule source / fake Bus 不表示真实 taxonomy / delivery / positive integration。 |

### 5.1 单元停审

| 检查项 | 结果 |
|---|---|
| security / body / rule source 是否具体适用 | pass |
| observability 是否未泄漏正文 / high-cardinality content | pass |
| performance 是否分 stage 且无历史数字 | pass |
| config 是否不能创建 local allowlist / fail-open | pass |
| transient body lifecycle 是否零持久化例外 | pass |

`BC-L2M-02 cross-cutting gate = pass`。下一允许单元仅为 BC-L2M-03。

## 6. BC-L2M-03 横切适用性

| 横切类别 | 适用 | 单元约束 / 判断口径 |
|---|---|---|
| 安全 | 是 | CC-001~003:subject / source / controlled context validation;raw / hidden / secret 禁止;只经 formal Runtime seam。 |
| 审计 / 追溯 | 是 | CC-005 / 006:screening、delivery decision、submission、Runtime result ref、reception / gap 可分层回链。 |
| 可观测性 | 是 | CC-007 / 008:submitted / accepted / rejected / unknown / committed-material-received 与 run / outcome 分开。 |
| 可用性 / 韧性 | 是,关键 | CC-009 / 010:Runtime unavailable 不改变 presence / screening;duplicate / late idempotent;unknown side effect fenced。 |
| 性能 | 是,仅 stage 口径 | CC-011:member local submission / correlation 与 Runtime queue / run wait 分开,不以总时延判断 member。 |
| 配置 | 是 | CC-013 / 014:transport / mapping / backpressure configuration 不能改变 acceptance ownership、raw-body ban或 unknown fence。 |
| 数据生命周期 | 是 | CC-015:Runtime payload / outcome body 不因 debugging / recovery 入仓;只保留 ref / safe material。 |
| 证据纪律 | 是,关键 | CC-016:fake / blocked EntryAuthority 不表示 Runtime integration / run / outcome ready。 |

### 6.1 单元停审

| 检查项 | 结果 |
|---|---|
| Runtime owner / forbidden body / formal seam 是否具体 | pass |
| submitted / accepted / run / outcome 是否观测分层 | pass |
| availability / unknown fence 是否与 Step 8 / 9 一致 | pass |
| performance 是否隔离 external wait | pass |
| mapping / fake 是否未伪装 readiness | pass |

`BC-L2M-03 cross-cutting gate = pass`。下一允许单元仅为 BC-L2M-04。

## 7. BC-L2M-04 横切适用性

| 横切类别 | 适用 | 单元约束 / 判断口径 |
|---|---|---|
| 安全 | 是,关键 | CC-001~004:subject、committed source、target class 与 material safety 不可验证即拒绝 / gap;handoff 全程 body-free;只经正式 Bus / handoff seam;route / feedback snapshot 不授予发布资格。 |
| 审计 / 追溯 | 是,关键 | CC-005 / 006:Runtime material reception、outbound decision、safety conclusion、publication attempt / gap 与 external feedback 分层回链;迟到 / 修正只追加事实。 |
| 可观测性 | 是 | CC-007 / 008:decided / rejected / attempted 与 delivered / observed / accepted 分开形成低敏、低基数 material;外部状态不得覆盖本地历史。 |
| 可用性 / 韧性 | 是,关键 | CC-009 / 010:Bus / route / downstream 失效只降级相应 handoff;既有 decision 保留;duplicate / late 幂等关联,side-effect unknown fenced。 |
| 性能 | 是,仅 stage / 隔离口径 | CC-011 / 012:本地 safety gate、material formation、submission 与 external delivery wait 分开;Trace / Read propagation 不成为 outbound local commit 的同步前置。 |
| 配置 | 是,关键 | CC-013 / 014:target class、route resolution、material mapping、continuation 配置须有 owner / source / version / scope / effective state;不得放行 unsafe body、任意直连或 unknown replay。 |
| 数据生命周期 | 是 | CC-015:decision / attempt / gap / feedback history 可保留但不得引入 Runtime / Conversation / Artifact / Evidence body;retention / archive 物理策略仍 pending。 |
| 证据纪律 | 是,关键 | CC-016:fake Bus、planned adapter、pending route / event family 或 local attempt 不表示 delivered、observed、accepted、positive integration 或 readiness。 |

### 7.1 单元停审

| 检查项 | 结果 |
|---|---|
| source / material / target / formal seam 安全约束是否具体 | pass |
| outcome / decision / attempt / delivery / observed / accepted 是否分层 | pass |
| availability / duplicate / late / unknown 是否符合 local-truth-first 与 fence | pass |
| performance / derived propagation 是否隔离 external wait 与核心提交 | pass |
| 配置、retention、fake / pending 是否未绕过硬边界或伪装 readiness | pass |
| 是否下沉 route、event family、重试算法、告警或指标数值 | pass:未下沉 |

`BC-L2M-04 cross-cutting gate = pass`。下一允许单元仅为 BC-L2M-05。

## 8. BC-L2M-05 横切适用性

| 横切类别 | 适用 | 单元约束 / 判断口径 |
|---|---|---|
| 安全 | 是,关键 | CC-001~004:trace link 只连接来源可验证的 committed fact / formal ref,关联不完整即 gap 而非猜测;record / material / handoff body-free;只经正式 observation / audit seam;feedback / projection 不授权改写 link。 |
| 审计 / 追溯 | 是,核心职责 | CC-005 / 006:每个 link / gap / material / attempt 有 subject、source、scope、purpose、correlation 与 result category;修正 / resolution 以 append / supersede 保留历史。 |
| 可观测性 | 是,核心职责 | CC-007 / 008:从已提交事实形成低敏、低基数、可关联 material;local material-formed / attempted / gap 与 external ingest / stored / observed 分层。 |
| 可用性 / 韧性 | 是 | CC-009 / 010:trace propagation、external ref resolution 或 observation seam 失效只形成 correlation / handoff gap,不回滚 source fact;duplicate / late feedback 幂等追加,unknown handoff fenced。 |
| 性能 | 是,关键隔离口径 | CC-011 / 012:source commit 内只要求最小 correlation anchor;linking、material formation、handoff、reconciliation 分 stage 且不成为 BC01~04 核心提交的外部同步前置。 |
| 配置 | 是 | CC-013 / 014:correlation、redaction / material class、handoff target、reconciliation 配置须有 owner / source / version / scope / effective state;不得允许猜测关联、forbidden body、source truth 改写或 unknown replay。 |
| 数据生命周期 | 是,关键 | CC-015:trace history append-oriented;retention / archive / rebuild 不得引入 complete log / source body、抹除关联来源或修改 immutable history;物理策略仍 pending。 |
| 证据纪律 | 是,关键 | CC-016:local trace / material / attempt、fake backend、planned carrier 或 pending route 不等于 ingest、stored、observed、Evidence / verdict、positive integration 或 readiness。 |

### 8.1 单元停审

| 检查项 | 结果 |
|---|---|
| trace 是否只连接有来源的 committed fact / ref 且禁止猜测补齐 | pass |
| body-free、低敏、低基数和 formal observation seam 是否具体 | pass |
| local link / material / attempt 与 external ingest / stored / observed 是否分层 | pass |
| source commit、异步 linking、后台 reconciliation 的性能 / 失败边界是否清楚 | pass |
| correction / duplicate / late / unknown 是否符合 append-only 与 fence | pass |
| 配置、retention、fake / planned 是否未引入日志 / evidence / backend truth 或伪装 readiness | pass |
| 是否下沉 telemetry schema、backend、route、schedule、retention 数值或告警 | pass:未下沉 |

`BC-L2M-05 cross-cutting gate = pass`。下一允许单元仅为 BC-L2M-06。

## 9. BC-L2M-06 横切适用性

| 横切类别 | 适用 | 单元约束 / 判断口径 |
|---|---|---|
| 安全 | 是,关键 | CC-001~004:expected owner、source、scope、ref / snapshot metadata 与 freshness 不可验证即 unresolved / conflict / unsupported;不接收 credential / definition / source body;只经正式 owner seam;resolved / fresh 不授予 authorization、health、acceptance 或 availability。 |
| 审计 / 追溯 | 是 | CC-005 / 006:receipt、resolution、refresh、conflict、unsupported 与 gap 记录 owner / source / scope / source time / correlation / result category;迟到或修正只追加 source-specific marker。 |
| 可观测性 | 是 | CC-007 / 008:resolution / stale / conflict / gap 形成低敏、低基数支撑材料;member consumption state 与 external business truth / health / delivery 分开。 |
| 可用性 / 韧性 | 是,关键 | CC-009 / 010:单一 source / resolver / refresh 失效只使相应消费路径 unresolved / stale / gap;不静默续期、跨源合并或 fallback;duplicate / late update 按 source 幂等追加。 |
| 性能 | 是,仅 stage / 隔离口径 | CC-011 / 012:on-demand local classification、external resolution wait、snapshot propagation 与 background refresh / rebuild 分 stage;refresh / index 不成为既有 core truth 的同步前置。 |
| 配置 | 是,关键 | CC-013 / 014:expected owner、scope、source mapping、freshness 与 refresh / reconciliation 配置须有 owner / source / version / scope / effective state;不得配置关闭 conflict、静默延长 freshness 或把 resolved 提升为业务允许。 |
| 数据生命周期 | 是 | CC-015:receipt / resolution / freshness history 与可重建 index 不得引入 external entity / policy / run / session / delivery / definition body或 secret;rebuild 不反写 source / history。 |
| 证据纪律 | 是,关键 | CC-016:local resolved、fake resolver、cached snapshot、planned adapter 或 pending schema / route 不表示 source valid、authorized、healthy、accepted、positive integration 或 readiness。 |

### 9.1 单元停审

| 检查项 | 结果 |
|---|---|
| owner / source / scope / freshness 校验与 forbidden body 是否具体 | pass |
| resolution state 是否未提升为 authorization / health / acceptance / availability | pass |
| source failure、stale、conflict、duplicate / late 是否无静默合并 / fallback | pass |
| sync resolution、async update、background refresh / rebuild 是否分层且隔离核心提交 | pass |
| 配置与生命周期是否未形成第二 registry / schema authority 或 source truth | pass |
| fake / cached / planned / pending 是否未伪装 positive integration / readiness | pass |
| 是否下沉 source API、schema、poll interval、cache、scheduler 或具体 adapter | pass:未下沉 |

`BC-L2M-06 cross-cutting gate = pass`。下一允许单元仅为 BC-L2M-07。

## 10. BC-L2M-07 横切适用性

| 横切类别 | 适用 | 单元约束 / 判断口径 |
|---|---|---|
| 安全 | 是,关键 | CC-001~004:projection 只消费来源可验证的 committed fact / formal ref / safe view;无 source body / secret / definition body;只经正式只读 seam;summary / explanation / outlet 不授予 authorization、registry membership、invocation permission 或 execution availability。 |
| 审计 / 追溯 | 是 | CC-005 / 006:projection source、scope、cursor / freshness、rebuild / reconciliation 与 gap 可回链;source 变化、冲突和修正形成新派生状态,不抹写 source history。 |
| 可观测性 | 是 | CC-007 / 008:fresh / stale / rebuilding / unresolved / gap 与 projection failure 形成低敏、低基数状态;视图状态不替代 presence / health / Runtime / capability source truth。 |
| 可用性 / 韧性 | 是,关键 | CC-009 / 010:projection / downstream consumer / capability source 失效不影响 BC01~05;outlet 可独立裁剪;duplicate update / rebuild 幂等,发现不一致只报告 gap、不修复 source。 |
| 性能 | 是,关键隔离口径 | CC-011 / 012:source propagation、projection lag、sync read、background rebuild 与 downstream distribution 分 stage;投影更新 / 查询 / 重建不成为 core local commit 的同步前置。 |
| 配置 | 是 | CC-013 / 014:projection selection、read exposure、freshness / rebuild 与 outlet 裁剪配置须有 owner / source / version / scope / effective state;不得开放 write-back、隐藏 stale / gap、复制 body 或把 visible 配置成 authorized。 |
| 数据生命周期 | 是 | CC-015:projection / index 可重建;retention / archive / rebuild 不得复制 event / run / conversation / tool / method body、secret 或 configuration truth,也不得补造 / 修改 source fact。 |
| 证据纪律 | 是,关键 | CC-016:fresh view、fake source、planned read carrier、outlet visible 或 pending SDK / distribution 不表示 source ready、registry valid、invocation allowed、positive integration 或 readiness。 |

### 10.1 单元停审

| 检查项 | 结果 |
|---|---|
| projection source / body-free / read-only seam 安全约束是否具体 | pass |
| summary / explanation / outlet 是否未提升为 truth / registry / authorization / availability | pass |
| freshness / cursor / rebuild / gap 是否可追溯且不改 source | pass |
| projection / outlet / downstream failure 是否与 BC01~05 隔离 | pass |
| async update、sync read、background rebuild 与 external distribution 是否分 stage | pass |
| 配置、生命周期、fake / planned 是否未绕过只读边界或伪装 readiness | pass |
| capability outlet 可裁剪是否保持且不影响 Member Summary / C1~C4 | pass |
| 是否下沉 API、query schema、cache / store、SDK binding 或 rebuild job 细节 | pass:未下沉 |

`BC-L2M-07 cross-cutting gate = pass`。七个单元横切适用性均已逐个停审;下一允许动作仅为跨横切约束审计。

## 11. 跨横切约束审计

### 11.1 覆盖与适用性审计

| 横切约束 | 主要适用单元 | 跨单元审计结论 |
|---|---|---|
| CC-001~004 安全 / 主体 / 最小暴露 / 正式边界 / 派生限制 | BC01~07 | pass:各单元分别挂载 subject、rule、Runtime source、outbound material、trace source、external owner、projection source;不是统一口号。 |
| CC-005~006 追溯 / immutable history | BC01~07,BC05 为关联中心 | pass:源上下文拥有决定事实,BC05 只追加 link / gap;correction / late feedback 不原地抹写。 |
| CC-007~008 可观测 / 状态分层 | BC01~07 | pass:local state / attempt / gap 与 host / Runtime / Bus / backend / downstream truth 分层,材料低敏低基数。 |
| CC-009~010 可用性 / 韧性 / fence | BC01~07 | pass:单 seam 失效按能力归因;local history 保留;duplicate / late 幂等追加;unknown side effect 不盲重放。 |
| CC-011~012 性能 / 派生隔离 | BC01~07,BC04 / 05 / 07 为关键隔离点 | pass:local decision、carrier / projection、external wait 分 stage;trace / read / refresh / rebuild 不成为核心外部同步前置。 |
| CC-013~014 配置 / 来源 | BC01~07 | pass:配置有 owner / source / version / scope / effective state,且不能关闭 owner、fail-closed、body ban、fence、freshness 或依赖分类。 |
| CC-015 数据生命周期 | BC01~07 | pass:retention / archive / rebuild 均服从 body-free 与 immutable history;物理策略未在架构层脑补。 |
| CC-016 证据纪律 | BC01~07 | pass:planned / fake / cached / blocked / local attempt 与 positive integration / external result / readiness 明确分开。 |

所有类别在七个单元均有适用项,原因不是模板强制,而是七个单元都跨越 source、状态、交互或派生边界;每个单元表已给出不同保护对象和判断口径。没有发现只影响单个 API / handler /脚本却被抬升为横切项的内容。

### 11.2 与数据和通信语义的一致性

| 审计主题 | Step 8 / 9 基线 | Step 12 结果 | 结论 |
|---|---|---|---|
| truth / snapshot / projection / ref | 唯一 owner;派生不反写;正文禁止 | CC-002 / 004 / 015 逐单元保持 | pass |
| local strong / external eventual | 本地决定逻辑强一致,外部反馈最终关联 | CC-006 / 008 / 009 保留 local truth first | pass |
| sync / async / background | sync admission / safe read;async committed fact / feedback;background qualified continuation | CC-010~012 未改变通信类别 | pass |
| duplicate / late / out-of-order | 幂等关联、append-only | CC-006 / 010 覆盖全部相关单元 | pass |
| commit / side-effect unknown | fenced,无证据不 replay | CC-010 / 013 使配置也不能绕过 | pass |
| derived path isolation | Trace / Mirror / Read 不阻塞核心提交 | CC-009 / 012 在 BC04~07 明确挂载 | pass |
| forbidden-body lifecycle | inspection 之外 body-free;不因 debug / rebuild 入仓 | CC-002 / 015 无 retention 例外 | pass |

### 11.3 正式非功能需求覆盖

| 正式需求 | 横切承接 | 结果 |
|---|---|---|
| NFR-L2M-001~003 性能 | CC-011 / 012;BC02 / 04 / 05 / 07 stage 与派生隔离 | covered;无历史数值 |
| NFR-L2M-004~005 可用性 | CC-009 / 010 / 012;外部 seam 与 projection / outlet 独立降级 | covered |
| NFR-L2M-006~008 安全 | CC-001~004;主体 / source fail-closed、body-free、正式网络边界 | covered |
| NFR-L2M-009~010 追溯 | CC-005~008;来源回链、历史追加、local / external 分层 | covered |
| NFR-L2M-011~013 幂等 / 一致性 | CC-001 / 006 / 010;duplicate / late / subject conflict / unknown fence | covered |
| NFR-L2M-014~015 可观测 / 安全 | CC-002 / 005 / 007 / 008;低敏低基数且 body-free | covered |
| NFR-L2M-016 证据纪律 | CC-016;planned / fake / blocked / not_run 不写 positive | covered |

### 11.4 开放项与历史污染审计

| 审计项 | 结果 |
|---|---|
| L2M-UP-001 / 006 host / credential pending | 保持 BC01 fail-closed;未形成固定 token、IPC、heartbeat 或 health 数字。 |
| L2M-UP-003 Runtime entry mapping pending | 保持 BC03 blocked / fenced;未形成 transport / schema / retry 结论。 |
| L2M-UP-004 / 005 handoff / event family / route pending | 保持 BC04 / 05 attempt / gap;未声明 delivered / observed。 |
| L2M-UP-007 rule source pending | 保持 BC02 conservative handling;未形成 local allowlist。 |
| L2M-UP-008 non-project subject pending | 保持 BC01 fail-closed;未以 GlobalMember 代执行主语。 |
| sibling member-service / images 正式 00 已停审 | 需求级 owner / supply 方向可消费;详细合同继续 pending,未声明正向 integration / compatibility / readiness。 |
| 旧 CloudEvents / AG-UI / UDS / launch token / supervisord / 固定 P95 / SLA | Core shared authority 与历史实现整包分开;未恢复为当前横切要求。 |
| unresolved 横切冲突 | none;开放项均有 fail-closed / pending 落点。 |

## 12. 结构化中间产物与正式回填草稿

| 横切关注点 | 作用范围 | 约束要求 | 保护目标 | 说明 |
|---|---|---|---|---|
| 主体、来源与正式边界安全 | Presence、Inbound、Runtime、Outbound、Mirror、Read | subject / source / scope / credential / rule / material 不可验证即 fail-closed;只经 host / Runtime / Bus / owner 正式 seam | 执行主语、核心决定与外部接入边界 | 派生状态不授予 authorization / health / acceptance。 |
| 最小暴露与数据生命周期 | inspection、truth、trace、handoff、projection、rebuild | inspection 之外 body-free;retention / archive / rebuild 不得引入 forbidden body | 外部正文、hidden reasoning、secret、definition / evidence 边界 | 物理 retention 后移,不构成正文例外。 |
| 审计与不可变追溯 | BC01~04 决定、BC05 link、external feedback | 关键事实 source-correlated;correction / late / resolution append / supersede | 事实可归责与历史可解释 | 不以完整日志或 evidence 代替 trace。 |
| 可观测状态分层 | local state / decision / attempt / gap 与 external result | 形成低敏低基数 material;local 与 delivered / observed / accepted / healthy 分开 | 故障归因与 owner 分界 | 不依赖 observability backend ready。 |
| 韧性与未知副作用 fence | host / Runtime / Bus / owner seam、continuation | 单 seam 失效局部降级;duplicate / late 幂等追加;unknown 不盲重放 | 本地真相、不可逆副作用与恢复边界 | waiting / blocked / degraded / stale / gap 不压平。 |
| 性能与派生路径隔离 | local decision、carrier、trace、projection、external wait | 按 stage / dependency / outcome 观察;派生与外部等待不成为核心同步放大点 | 核心本地提交与容量隔离 | 当前不填无来源数值。 |
| 配置与变更控制 | subject、scope、screening、target、freshness、continuation、projection | 配置有 owner / source / version / scope / effective state;不得覆盖硬约束 | 架构边界不被配置旁路 | 具体 key / default 后移 04。 |
| 证据与 readiness 纪律 | adapter、fake、pending seam、local attempt、projection | planned / fake / blocked / not_run 与真实 external result / integration / readiness 分开 | 设计状态与实现证据真实性 | 本文不声明实现或联调通过。 |

正式 §13 回填上述主表和一段横切影响说明。不得复制七个单元过程表,不得加入监控 / 告警 / secret / 压测脚本、配置 key、数值阈值或未闭口协议。

## 13. Step 门禁自检

| 检查项 | 结果 |
|---|---|
| CC-L2M-001~016 是否有正式约束和判断口径 | pass |
| BC-L2M-01~07 是否逐单元判断并停审 | pass |
| 是否存在模板化空话或单点实现误升格 | pass:不存在 |
| 与 Step 8 / 9 数据和通信语义是否一致 | pass |
| NFR-L2M-001~016 是否全部覆盖 | pass |
| 配置 / retention / observability / performance 是否未下沉实现 | pass |
| pending / historical / fake 是否未伪装 positive fact | pass |
| 跨横切约束是否存在 unresolved 冲突 | pass:none |
| Step 12 总门禁 | `pass` |

下一允许动作仅为创建 `01_arch_step_13_evolution_path.md`;正式 `01` 仍禁止修改。
