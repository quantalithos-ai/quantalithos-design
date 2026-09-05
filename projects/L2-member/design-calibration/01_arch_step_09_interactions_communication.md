# Step 9. 关键交互与通信方式

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 9
> 对应书写规范: `standards/document/架构设计书写规范.md` §4.10
> 回填位置: 正式 `01-架构设计.md` §10
> 日期: 2026-08-22
> 当前状态: `pass`;BC-L2M-01~07 interaction 与 cross-interaction audit 全部通过
> 串行门禁: BC01~07 逐交互停审和跨交互审计完成前,禁止创建 Step 10

## 1. 本步输入与通信类型

| 输入 | 本步承接 |
|---|---|
| Step 4 system context | 正式外部对象与输入 / 输出面。 |
| Step 6 RU-L2M-01~08 | 同步入口、异步消费、Runtime boundary、handoff、background / read roles。 |
| Step 8 consistency | local strong、external eventual、unknown fence 与 projection rebuild。 |
| Runtime 正式 01 §10 | trigger / control 即时判断、committed fact 异步传播、长时 continuation 分层。 |

| 通信方式 | 适用语义 | 失败姿态 |
|---|---|---|
| 同步请求 / 响应 | 需要立即 accept / reject / blocked / current safe read 的边界判断 | timeout / unavailable / unknown 不返回伪成功。 |
| 异步事件 / 反馈 | 已提交事实传播、Bus fact intake、Runtime outcome handoff、external feedback | duplicate / late / out-of-order / unresolved 只追加关联。 |
| 后台任务 / 延后承接 | periodic signal、snapshot refresh、projection rebuild、gap reconciliation、满足条件的 continuation | waiting / stale / gap;unknown side effect 不盲重试。 |

本步只选择通信类别和边界理由,不写 API path、event name、topic、DTO、schema、UDS / gRPC、ack guarantee、重试算法或运行时序实现。

## 2. 交互单元停审计划

| 顺序 | 单元 | 状态 | 下一动作 |
|---:|---|---|---|
| 1 | BC-L2M-01 Presence / Host | pass | BC02 |
| 2 | BC-L2M-02 Inbound | pass | BC03 |
| 3 | BC-L2M-03 Runtime Mediation | pass | BC04 |
| 4 | BC-L2M-04 Outbound | pass | BC05 |
| 5 | BC-L2M-05 Trace | pass | BC06 |
| 6 | BC-L2M-06 Mirror | pass | BC07 |
| 7 | BC-L2M-07 Read Model | pass | cross audit |
| 8 | cross-interaction audit | pass | Step 10 allowed |

## 3. BC-L2M-01 交互方式

| 交互 | 对端 / 单元 | 通信方式 | 选择理由 | 失败 / 降级 |
|---|---|---|---|---|
| startup subject / context 受理 | host boundary -> BC01 | 同步请求 / 响应语义 | 调用方需要即时知道 member accept / reject / blocked,不能从后续 heartbeat 推断 | invalid / unresolved / timeout -> reject / blocked / unknown;不进入 presence。 |
| Work / Identity / credential / host ref 解析 | BC01 -> BC06 / external seam | 同步 safe resolution 或已收快照消费 | presence 决定必须在当前来源语境上判断 | unavailable / stale / conflict -> fail closed;不猜测。 |
| host register / liveness / status material 交接 | BC01 -> host boundary | 异步 signal / feedback | member local fact 先成立,host acceptance / health 独立收敛 | attempt / gap / degraded;不声明 accepted / healthy。 |
| periodic liveness / status trigger | background -> BC01 coordination | 后台任务 / 延后承接 | 周期触发可延后,不能定义 presence truth | scheduler / host unavailable -> gap;频率未定。 |
| presence committed fact 提供 | BC01 -> BC05 / BC07 | 异步 committed-fact propagation 或本地消费 | trace / projection 不得成为 core commit 的同步外部前置 | propagation / projection gap;source truth 保留。 |

### 3.1 单元停审

| 检查项 | 结果 |
|---|---|
| 即时 startup 判定是否使用同步语义 | pass |
| host feedback 是否最终一致且不定义 local presence | pass |
| periodic trigger 是否不预设固定间隔 / scheduler | pass |
| 外部不可用是否 fail closed / degraded | pass |
| 是否下沉 RPC、port、credential schema 或 heartbeat 数字 | pass:未下沉 |

`BC-L2M-01 interaction gate = pass`。下一允许单元仅为 BC-L2M-02。

## 4. BC-L2M-02 交互方式

| 交互 | 对端 / 单元 | 通信方式 | 选择理由 | 失败 / 降级 |
|---|---|---|---|---|
| inbound fact 到达 | Bus boundary -> BC02 | 异步事件 / feedback | 事实由 Bus 传递,member 不要求 source 同步阻塞 | duplicate / late / unavailable -> idempotent / pending / degraded;delivery truth 外置。 |
| rule / scope safe snapshot 变化 | Governance / identity context -> BC06 -> BC02 | 异步事件 / snapshot update | 已生效外部事实传播适合异步,member 只消费 source state | stale / conflict / missing -> conservative screening。 |
| 当前 ref / snapshot 即时解析 | BC02 -> BC06 | 同步 safe resolution | 单条 screening 需要当下 source / scope / freshness 判断 | timeout / unknown -> pending / blocked;不 fail open。 |
| transient inspection 与 screening | BC02 local coordination | 同步本地判断语义 | 必须在正文离开授权瞬时窗口前形成 body-free conclusion | unauthorized / unsafe -> blocked;正文立即离开 member scope。 |
| committed screening -> Runtime delivery coordination | BC02 -> BC03 | 异步 committed-fact handoff 语义 | screening truth 先成立,不等待 Runtime acceptance | handoff gap -> waiting;不改变 screening。 |
| screening diagnostic aggregation | committed BC02 facts -> BC07 | 后台 / 异步派生 | 统计 / 诊断可延后,不能进入决定主路径 | stale / gap;不改规则 / conclusion。 |

### 4.1 单元停审

| 检查项 | 结果 |
|---|---|
| Bus fact / external snapshot 是否用异步语义 | pass |
| screening 是否在 transient body window 内即时收口 | pass |
| screening -> Runtime 是否不等待 acceptance | pass |
| communication 是否符合 external eventual consistency | pass |
| 是否写 event name / topic / ack / filter algorithm | pass:未写 |

`BC-L2M-02 interaction gate = pass`。下一允许单元仅为 BC-L2M-03。

## 5. BC-L2M-03 交互方式

| 交互 | 对端 / 单元 | 通信方式 | 选择理由 | 失败 / 降级 |
|---|---|---|---|---|
| controlled context 提交与即时受理 | BC03 -> Runtime entry | 同步请求 / 响应语义 | Runtime 正式 entry 需要即时 accepted / rejected / blocked;不能让 caller 等待完整 run | timeout / unavailable / unknown -> waiting / gap;不代答,不声明 run。 |
| Runtime safe status / result ref 即时读取 | BC03 -> Runtime safe view(按需) | 同步只读语义 | 当前 correlation / source validation 需要受控 safe result | stale / unavailable -> gap;查询不改变双方 truth。 |
| committed safe material 交接 | Runtime -> BC03 | 异步事件 / feedback / handoff 语义 | 长时 run outcome 在 Runtime 已提交后独立传播,不能伪装同步 return | duplicate / late / wrong source -> idempotent link / reject / gap。 |
| reception committed fact -> Outbound | BC03 -> BC04 | 异步 committed-fact handoff 语义 | reception 先成立,Outbound 再独立决定是否发布 | handoff gap 不改变 Runtime outcome / reception。 |
| waiting / unknown resolution | BC03 coordination | 后台 continuation(有正式 resolution / idempotency 前提时) | 可延后恢复,但未知副作用不能自动重放 | 无前提 -> fenced / manual-or-owner resolution pending。 |
| mediation fact -> Trace / Read | BC03 -> BC05 / BC07 | 异步 committed-fact propagation | trace / projection 不阻塞 entry acceptance / local commit | gap / stale;不回滚。 |

### 5.1 单元停审

| 检查项 | 结果 |
|---|---|
| Entry acceptance 是否同步但不等待 run 完成 | pass |
| committed outcome handoff 是否异步且 source-owned | pass |
| communication 是否符合 local truth first / external eventual | pass |
| unknown continuation 是否有 fence | pass |
| L2M-UP-003 mapping 是否保持 blocked | pass |
| 是否锁 UDS / gRPC / proto / backpressure schema | pass:未锁 |

`BC-L2M-03 interaction gate = pass`。下一允许单元仅为 BC-L2M-04。

## 6. BC-L2M-04 交互方式

| 交互 | 对端 / 单元 | 通信方式 | 选择理由 | 失败 / 降级 |
|---|---|---|---|---|
| committed material 安全门禁与 outbound decision | BC03 -> BC04 local coordination | 同步本地判断语义 | 必须在 material 进入任何 handoff 前立即 accept / reject,且决定独立提交 | unsafe / unresolved / wrong source -> reject / gap;不发布。 |
| interaction material 发布 | BC04 -> Bus / formal handoff boundary | 异步事件 / handoff | local outbound decision 先成立,delivery / downstream 独立收敛 | submit fail -> attempt / gap;不回滚 decision。 |
| delivery / downstream feedback | Bus / consumers -> BC04 | 异步 feedback | external owner 结果可迟到 / 重复 / 乱序 | idempotent link / new fact / pending;不声明超出 feedback authority 的状态。 |
| qualified retry / handoff continuation | BC04 coordination | 后台 continuation(需明确 idempotency / result resolution) | 可延后处理已知安全 gap,但不能自动重演 unknown side effect | 缺前提 -> fenced;route pending -> waiting。 |
| outbound facts -> Trace / Read | BC04 -> BC05 / BC07 | 异步 committed-fact propagation | trace / projection 不阻塞 local decision | gap / stale;不反写。 |

### 6.1 单元停审

| 检查项 | 结果 |
|---|---|
| material gate 是否在 handoff 前即时收口 | pass |
| publication 是否异步且 local truth first | pass |
| external feedback 是否只追加关联 | pass |
| background continuation 是否有 idempotency / resolution 前提 | pass |
| 是否直连 Conversation / Observability / provider | pass:未直连 |
| 是否写 event family / route / guarantee / retry algorithm | pass:未写 |

`BC-L2M-04 interaction gate = pass`。下一允许单元仅为 BC-L2M-05。

## 7. BC-L2M-05 交互方式

| 交互 | 对端 / 单元 | 通信方式 | 选择理由 | 失败 / 降级 |
|---|---|---|---|---|
| minimal correlation anchor 形成 | BC01~04 local commit | 同步本地提交语义 | 每个 source fact 必须先有最小 source / correlation,否则后续无法安全追溯 | incomplete -> source gap / reject;不靠日志猜测。 |
| committed facts -> trace link | BC01~04 -> BC05 | 异步 committed-fact propagation | trace linking 可最终收敛,不应成为外部同步前置 | propagation fail -> correlation gap;source fact 不回滚。 |
| safe observation / audit material handoff | BC05 -> formal observation boundary | 异步事件 / handoff | backend / observed truth 独立,member 只提交 safe material | attempt / gap;不声明 ingest / observed。 |
| observed / ingest feedback | external boundary -> BC05 | 异步 feedback | 外部状态可迟到 / 重复,只提供关联 | idempotent link / pending;不覆盖 local attempt。 |
| trace gap reconciliation / material rebuild | BC05 coordination | 后台任务 / 延后承接 | 可从 committed refs 重试派生,不得修改 source truth | unresolved source -> gap remains;retention / schedule 未定。 |
| trace summary -> Read Model | BC05 -> BC07 | 异步 projection source | read view 可延后、可重建 | stale / gap;不改 trace。 |

### 7.1 单元停审

| 检查项 | 结果 |
|---|---|
| source anchor 是否在本地提交语义中成立 | pass |
| trace link 是否允许异步但 gap 显式 | pass |
| observation handoff 是否不声明 observed | pass |
| reconciliation 是否只派生 /关联不改 source | pass |
| 是否依赖 complete log / backend query | pass:未依赖 |
| 是否写 telemetry schema / route / retention | pass:未写 |

`BC-L2M-05 interaction gate = pass`。下一允许单元仅为 BC-L2M-06。

## 8. BC-L2M-06 交互方式

| 交互 | 对端 / 单元 | 通信方式 | 选择理由 | 失败 / 降级 |
|---|---|---|---|---|
| on-demand external ref / safe state resolution | BC01~05 coordination -> BC06 -> source boundary | 同步请求 / 响应语义 | 当前决定需要即时 owner / scope / freshness 分类,但只返回 neutral result | timeout / unavailable / unknown -> unresolved / gap;consumer conservative handling。 |
| source committed update / feedback receipt | external owner / Bus -> BC06 | 异步事件 / feedback | 已提交外部事实传播与 member local truth 解耦 | duplicate / late / conflict -> idempotent source-specific marker;不合并 truth。 |
| snapshot refresh / expiration / reconciliation | BC06 coordination | 后台任务 / 延后承接 | freshness 维护可延后,不应阻塞已有 local truth | refresh fail -> stale / gap;不猜测续期。 |
| neutral resolution / freshness result 交付 | BC06 -> BC01~05 / BC07 | 同步 local capability 或异步 snapshot propagation | 核心即时判断与派生更新需要不同节奏 | result unknown 显式;不输出 business decision。 |
| unsupported / schema / owner gap reporting | BC06 -> BC05 / BC07 | 异步 committed support fact | gap 需可追溯 / 可见,但不能变 external error truth | trace / projection stale;source 不变。 |

### 8.1 单元停审

| 检查项 | 结果 |
|---|---|
| sync resolution 与 async source update 是否分开 | pass |
| refresh 是否后台且 stale 显式 | pass |
| conflict 是否不静默合并 / fallback | pass |
| neutral result 是否不等于 authorization / health / acceptance | pass |
| 是否形成 provider / MCP / A2A / API hub | pass:未形成 |
| 是否写 source-specific API / schema / polling interval | pass:未写 |

`BC-L2M-06 interaction gate = pass`。下一允许单元仅为 BC-L2M-07。

## 9. BC-L2M-07 交互方式

| 交互 | 对端 / 单元 | 通信方式 | 选择理由 | 失败 / 降级 |
|---|---|---|---|---|
| committed source / freshness update | BC01~06 -> BC07 | 异步 event / local projection source | projection 最终一致,不能阻塞 source commit | lag / duplicate / gap -> idempotent update / stale。 |
| member summary / diagnostic / explanation read | consumer -> BC07 | 同步只读请求 / 响应语义 | 消费者需要当前 body-free view 与 freshness,不触发写入 | unavailable / stale -> explicit status;不回源改 truth。 |
| capability outlet read | consumer -> BC07 | 同步只读语义(可裁剪) | 当前可见能力范围需要连同 source freshness 返回 | source unresolved -> stale / gap / not_available;不表示 invocation permission。 |
| projection rebuild / reconciliation | BC07 coordination | 后台任务 / 延后承接 | 可从 committed refs 重建,与 core path 解耦 | failure -> rebuilding / gap;不修复 source。 |
| downstream cache / SDK / product consumption | BC07 -> public read boundary | 同步 read 或异步 projection distribution(后续选择) | 只需维持 read-only 与 freshness,当前无 authority 固定载体 | consumer failure 不影响 projection / core;不形成 reverse dependency。 |

### 9.1 单元停审

| 检查项 | 结果 |
|---|---|
| projection update 是否异步 /最终一致 | pass |
| query 是否同步只读且返回 freshness / gap | pass |
| rebuild 是否后台且不改 source | pass |
| capability outlet 是否可裁剪且非 authorization | pass |
| downstream failure 是否不影响 core | pass |
| 是否写 API / cache / SDK binding / query schema | pass:未写 |

`BC-L2M-07 interaction gate = pass`。七个单元交互均已停审;下一允许动作仅为跨交互边界审计。

## 10. 关键交互场景总表

| 场景 | 起点 -> 终点 | 通信方式 | 即时成功只代表 | 后续独立状态 |
|---|---|---|---|---|
| startup / presence admission | host -> BC01 | 同步 request / response | member 已 accept / reject / block 当前语境 | host acceptance / session / health。 |
| host collaboration | BC01 -> host | 异步 signal + background trigger | local request / signal / report 已形成 / attempted | host receipt / verdict。 |
| inbound fact receipt | Bus -> BC02 | 异步 event | member 获得可筛选事实语境 | screening / Runtime delivery。 |
| screening | BC02 local | 同步 local decision | 四态结论已提交且 body-free | Runtime submission / acceptance。 |
| Runtime entry | BC03 -> Runtime | 同步 request / response | entry accepted / rejected / blocked | run / outcome / committed material。 |
| Runtime result handoff | Runtime -> BC03 / BC04 | 异步 feedback / handoff | committed material ref 已交接 /受理 | outbound decision / publication。 |
| outbound publication | BC04 -> Bus / handoff boundary | 异步 event / handoff | local attempt 已形成 | delivery / observed / accepted。 |
| external feedback | Bus / downstream -> BC04 / BC05 | 异步 feedback | feedback ref 已关联 | source owner 自身 truth;不逆写。 |
| trace / observation | BC01~04 -> BC05 -> observation boundary | async committed fact + handoff | link / material / attempt 已形成 | backend ingest / observed / evidence。 |
| mirror resolution / refresh | sources <-> BC06 | sync safe resolution + async update + background refresh | neutral resolution / receipt state 已形成 | authorization / health / acceptance 由消费 / source owner 决定。 |
| member view | BC01~06 -> BC07 -> consumers | async projection + sync read + background rebuild | 当前 projection / freshness 已返回 | source truth 不受影响。 |

## 11. 简化交互示意图

```text
+======================================================================+
|                    L2-member interaction semantics                   |
+======================================================================+
|                                                                      |
| host --[sync admission]--> Presence --[async status]--> host          |
|                                  |                                   |
| Bus --[async fact]--> Inbound --[committed handoff]--> Runtime Med.  |
|                                  |                    |               |
|                                  |              [sync entry]          |
|                                  |                    v               |
|                                  |                L2-runtime          |
|                                  |                    |               |
|                                  |          [async committed result]  |
|                                  |                    v               |
|                                  +--------------> Outbound            |
|                                                       |              |
|                                              [async handoff]          |
|                                                       v              |
|                                                      Bus             |
|                                                                      |
| committed facts --> Interaction Trace --> [async safe material]      |
| committed refs  --> Member Read Model --> [sync safe read]           |
| external refs   --> Mirror(sync/async/bg) --> all consumers           |
|                                                                      |
+======================================================================+
```

图示说明:

- 图表达通信类别和语义边界,不是 API / event /线程时序。
- Runtime entry 同步成功只表示受理,Runtime committed result 通过独立异步 handoff 返回。
- Bus 位于入站 / 出站 event boundary,delivery truth 不进入 member。
- Trace、Read Model、Mirror 的延后路径不成为核心 local commit 的外部同步前置。

## 12. 通信方式判断表

| 判断问题 | 同步 request / response | 异步 event / feedback | background / continuation |
|---|---|---|---|
| 是否需要当前调用方立即知道 accept / reject / blocked | 是 | 否 | 否 |
| 是否传播已提交事实或外部结果 | 否,仅 safe query 例外 | 是 | 按需消费 |
| 是否允许 source commit 与消费解耦 | 否 | 是 | 是 |
| 是否适合 projection / refresh / reconciliation | 只读查询 | source update | rebuild / refresh / gap work |
| unknown side effect 时是否自动继续 | 否 | 只记录 unknown feedback | 否,必须有 resolution / idempotency 前提 |
| 是否能声明 external delivered / observed / accepted | 否 | 只有 owner feedback 本身可被引用 | 否 |

## 13. 跨交互边界审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 同步 / 异步选择冲突 | pass | admission / safe read 同步;committed fact / feedback 异步;maintenance 后台。 |
| Runtime 长时结果伪同步 | pass | entry acceptance 与 outcome handoff 分开。 |
| 直接穿透边界 | pass | 无 Bus -> Runtime raw、Runtime -> downstream direct、member -> provider direct。 |
| 协议细节下沉 | pass | 未写 API、event name、topic、DTO、UDS / gRPC 或 ack guarantee。 |
| 数据一致性匹配 | pass | local truth first、external eventual、projection rebuild 与 Step 8 一致。 |
| failure / degradation 缺口 | pass | 每条关键边均有 reject / blocked / waiting / degraded / stale / gap / fence。 |
| duplicate / late / out-of-order | pass | 异步反馈只 idempotent link / append,不逆写。 |
| background blind retry | pass | continuation 需 formal idempotency / resolution;否则 fenced。 |
| sibling / upstream pending | pass | host、entry mapping、event family / route 继续 L2M-UP-001 / 003~005。 |
| 后续详细设计承接 | pass_with_constraint | 03 必须为每条正式 seam 定义 schema / idempotency / ordering / error,不得改变这里的 communication semantics。 |

## 14. 当前文档问题诊断与取舍

| 旧口径 | 问题 | 当前结论 |
|---|---|---|
| member <-> Runtime 固定 UDS gRPC | transport 冒充通信语义 | 同步 entry + 异步 committed result,载体 pending。 |
| member <-> bus 统一 CloudEvents | 只锁了 envelope,未区分 local decision / delivery | async event boundary + local truth first;member-specific family pending。 |
| member-service gRPC register / heartbeat | server / client / protocol 无 authority | sync startup admission + async host signals;transport pending。 |
| publish retry / heartbeat retry / IPC reconnect | 可能 blind retry unknown side effect | background continuation 需要 idempotency / resolution 前提。 |
| inbound -> attention -> runtime -> outbound 单线 | 把并发能力误写成固定时序 | 图只表达语义依赖,各 interaction 可独立并发。 |

## 15. 结构化中间产物与回填草稿

- 通信语义: sync admission / safe read;async committed fact / feedback / handoff;background refresh / rebuild / qualified continuation。
- 关键分层: host admission != health;screening != Runtime acceptance;entry accepted != run complete;outbound attempt != delivery / observed / accepted。
- transport / schema / route / guarantee 全部 pending;unknown side effect fenced。

正式 §10 回填关键交互总表、通信方式判断表、简化交互图和边界说明。不得写接口路径、事件名、topic、DTO、schema、协议或具体重试流程。

## 16. Step 9 总门禁

| 检查项 | 结果 |
|---|---|
| 每个架构单元是否定义 sync / async / background / failure | pass;7 / 7 |
| 每个单元是否独立停审 | pass;7 / 7 |
| 是否完成跨交互审计 | pass |
| communication 与 data ownership / consistency 是否一致 | pass |
| 是否直接穿透 Runtime / Bus / host / downstream / provider | pass:未穿透 |
| 是否下沉协议 schema / 时序实现 | pass:未下沉 |
| Step 9 总门禁 | `pass` |

下一允许动作仅为创建 `01_arch_step_10_technology_choices.md`;正式 `01` 仍禁止修改。
