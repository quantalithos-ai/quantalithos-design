# L2-runtime 02 概要 Step 3: 约束条件

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `02-概要设计.md` 第 3 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 1 稳定 / 挂起边界、Step 2 目标 / 非范围 / 深度、正式 01 数据 / 依赖 / 交互 / 横切结论 |
| 目标 | 提炼能直接决定后续主体、对象、接口、flow、state 合法性的硬约束 |
| 禁止 | 架构全文复述、工程口号、语言 / DB / deployment 偏好、完整实现策略 |

## 1. 约束筛选标准

一条约束只有在能够回答至少一个后续判断时才进入本 Step：某主体是否属于 Runtime、某对象能否成为 local truth、某字段 / 输入是否允许进入对象骨架、某接口能否推进状态、某 flow 在失败时如何停止、某状态迁移是否合法。日志规范、代码风格、数据库索引、部署资源、告警和通用可维护性不在此处收录。

## 2. 约束条件表

| ID | 约束 | 说明 |
|---|---|---|
| `HLC-L2R-001` | Runtime local truth 单一 owner | Run、goal-plan working state、composition / working memory、model / action / delegation / recovery decision、checkpoint、local outcome、handoff attempt / gap 的对象与写接口只能由 Runtime domain / application 主体维护；Entry、projection、adapter 和 consumer 无直接写源能力。 |
| `HLC-L2R-002` | 外部 owner 只通过 typed boundary 进入 | Method、Capability、Governance、Tools、Sandbox、Artifact、memory 和 provider 输入必须是 typed ref、safe snapshot、formal result、candidate 或 availability / gap；后续接口必须标 source owner、scope、freshness 和 failure。 |
| `HLC-L2R-003` | Forbidden body 贯穿所有结构 | method / policy / tool / capture / artifact / evidence / durable memory body、secret、raw provider response、hidden reasoning 不能成为对象字段、DTO body、checkpoint payload、event payload 或 safe view；只能保留 ref / redacted marker / safe category。 |
| `HLC-L2R-004` | 只有 Core 是 compile 候选 | 代码主体框架不得引入非 Core sibling package；Tools / Hub / Method / Governance / Sandbox / Artifact / model / memory 通过 runtime / ref / adapter，Bus / Observability 通过 event，SDK / Member / Product 是下游 consumer。 |
| `HLC-L2R-005` | Seam 标签不可伪装 package 依赖 | ref / adapter / fake 是合同形式，runtime / event 是协作类型，均不生成 sibling source dependency；Step 4 / 5 的 Ports 必须位于边界层，不能渗入 Domain owner。 |
| `HLC-L2R-006` | 前置不可验证即 fail closed | principal / scope / capability / Governance / Tools / Sandbox 等必须前置若 missing / stale / conflict / unknown，则 Command / flow 只能 reject / wait / blocked / unavailable，不得自我授权、local allowlist、host fallback 或伪降级成功。 |
| `HLC-L2R-007` | Action choice 与外部执行状态分层 | ActionDecision、ToolActionIntent、submission、receipt、executed、normalized outcome、incorporation 必须是不同主体 / 状态；Runtime 不定义 Tool / Sandbox execution truth，也不能由 capture 或 transport ACK 推导 success。 |
| `HLC-L2R-008` | Logical model decision 与 provider control 分层 | ModelIntent / Selection / Turn / Disposition 可以成为 Runtime 对象；provider endpoint、route、secret、quota、cost、billing、physical failover 不得成为 Runtime domain object 或 config truth。 |
| `HLC-L2R-009` | Working memory 与 durable memory 分层 | Working memory、retrieval request / result ref、candidate / use record 可进入 Runtime；durable body / index / retention / deletion / accepted write 不能进入；owner pending 时 flow 必须允许 working-only / unavailable。 |
| `HLC-L2R-010` | History immutable，恢复形成新决定 | feedback、reflection、resume、retry、recovery 追加新 decision / history record，不能改写原 turn / action / outcome；对象骨架必须支持 source / causation / correlation / version 语义。 |
| `HLC-L2R-011` | Stable point 是 checkpoint 前置 | Checkpoint 只能引用可解释、body-free、版本可判定的 stable state；commit unknown / atomicity unknown 必须进入 explicit unknown / blocked，不得由“已调用 repository”推导已持久化。 |
| `HLC-L2R-012` | Unknown side effect 不盲重试 | Tool / Sandbox / model / child 或 persistence 的 side effect / commit unknown 时，状态机不得迁移到普通 retry 或 success；必须等待 resolution、manual intervention 或 terminal policy decision。 |
| `HLC-L2R-013` | Late / duplicate / out-of-order 不逆写 | Inbound feedback 必须做 identity / correlation / causation / ordering 判定；迟到或重复结果只能形成 ignored / pending / linked-new-fact，不能覆盖新 decision 或 committed outcome。 |
| `HLC-L2R-014` | Local outcome 先于外部传播成立 | RuntimeOutcome 与 HandoffAttempt / Gap、Bus delivery、Observed、Artifact / downstream acceptance 分层；outbound / projection failure 不回滚 local commit，query 不把未观测解释为未完成。 |
| `HLC-L2R-015` | Safe Runtime Views 只读、可重建 | status / outcome / decision / handoff view 只从 committed local truth 派生；projection 接口无 domain mutation 权限，stale / rebuilding / gap 必须是 query surface。 |
| `HLC-L2R-016` | Context 与 delegation 有显式边界预算 | composition source set、working set、retrieval candidate、model turn、child scope / budget 均有 typed budget / exhaustion / omission / gap 语义；当前不固定数值，配置不能绕过父 scope。 |
| `HLC-L2R-017` | Parent / child context 不共享可变正文 | Delegation 必须带 parent run、child scope / budget、context boundary 和 lifecycle；child result 通过 feedback / incorporation 进入父 run，不共享 mutable working memory，也不拥有 member / container lifecycle。 |
| `HLC-L2R-018` | 同步、异步、后台三类入口语义分离 | Command / Query 收口即时判断，Inbound / Outbound Event 关联已成立事实，Job 承接 continuation / projection / handoff；不得用异步处理补写一个本应同步拒绝的合法性判断。 |
| `HLC-L2R-019` | Idempotency / correlation 是协议骨架前置 | 所有 trigger、feedback、checkpoint、resume、handoff 候选接口必须能识别稳定 request / run / turn / decision / action / child / checkpoint / handoff identity；具体 key 算法留给 03。 |
| `HLC-L2R-020` | Pending contract 只生成 candidate / blocked boundary | `L2R-UP-001~008` 和 checkpoint persistence / downstream entry 未闭口时，可命名 local object / port / semantic operation，但公共 schema、positive adapter、route、receipt、observed、readiness 必须标 candidate / blocked。 |
| `HLC-L2R-021` | 配置不得改变 owner 或架构红线 | source precedence、budget、adapter availability、recovery / handoff behavior 可形成配置影响候选；任何配置都不能允许 forbidden body、fail-open、blind retry、owner takeover、非 Core compile dependency 或 observed writeback。 |
| `HLC-L2R-022` | Evidence / readiness 不属于概要事实 | fake、adapter skeleton、设计文件、目录和静态配置不能成为 implemented / tested / ready 证据；所有后续表只写 design status，不写测试 pass、evidence alias、verdict 或签署。 |
| `HLC-L2R-023` | 语言与物理承载尚未选择 | 对象和接口使用语言中立类型类别；不得从 `L0-core` 的 Rust、旧 Runtime Python 或 SDK 多语言推导本仓语言，也不固定 DB / queue / protocol / deployment。 |

## 3. 约束到后续章节的作用矩阵

| 约束族 | Step 4 / 5 主体 | Step 6 对象 | Step 7 接口 | Step 8 flow | Step 9 state |
|---|---|---|---|---|---|
| owner / dependency `001~005` | Domain / Ports 边界 | truth type / owner | seam / direction | 外部输入承接点 | external state 不写 local truth |
| security / action / model / memory `006~009` | boundary services | forbidden fields | reject / blocked | fail-closed path | unavailable / blocked / unknown |
| history / recovery `010~013` | recovery / feedback subjects | version / causation | idempotent feedback | stable / unknown branch | no backward overwrite |
| outcome / view `014~015` | projection / handoff subjects | truth vs view | query / outbound | local commit first | gap / stale independent |
| budget / child / interaction `016~019` | context / delegation / inbound / jobs | scope / budget / identity | command / event / job split | bounded / correlated flow | lifecycle / exhaustion |
| pending / config / evidence / language `020~023` | candidate / blocked labels | no fake truth | no positive schema claim | no readiness claim | pending explicit |

## 4. 历史污染约束

旧 `ExecutionInstance`、`ExecutionStep`、`PromoteRequest`、`ExecutionFeedback` 不能因为已存在于历史 02 而自动成为关键对象；必须在 Step 5 / 6 由当前 capability / owner 重新发现。旧 StateGraph、Python、member 容器、UDS、固定指标和每步 checkpoint 不能成为主体映射、interface 或 flow 约束。

## 5. 回填草稿

正式第 3 章回填第 2 节约束表；可按 owner / data / security / consistency / interaction / pending 分组展示，但编号和含义不变。第 1、3、4 节的筛选过程、作用矩阵与历史诊断留在 calibration。

## 6. 自检与门禁

| 检查 | 结果 |
|---|---|
| 每条约束至少影响主体 / 对象 / 接口 / flow / state 之一 | pass |
| owner、data、dependency、security、recovery、view、interaction、pending 均覆盖 | pass |
| 未写语言 / DB / protocol / deployment 实现约束 | pass |
| `L2R-UP-001~008` 未被转成正向事实 | pass |
| 历史对象与技术未获得输入 authority | pass |
| 未创建 Step 4 文件或修改正式 02 | pass |

```text
gate_status = pass
next_allowed_action = create_02_hld_step_04_code_skeleton
formal_02_write_allowed = false
future_step_files_allowed = false_until_step_04_start
```
