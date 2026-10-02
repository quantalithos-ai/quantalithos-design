# 07 Step 9：Spike、风险与待确认事项

## Step 状态

| 字段 | 值 |
|---|---|
| status | completed / selfcheck_done / stop_review |
| gate_status | pass (design-only) |
| gate_reason | 本Step结构化/定向回修及正式传播已完成；Step13实际文档静态核验通过，见07_implementation_static_review_record.md；仅design，不表示实施或资格 |
| next_allowed_action | waiting_user_confirmation |
| source_files | Step 1/5/6/8；03 §17；04 §12；05 §14；06 §13；R-MP-DDD-01～10 |

### Step 内计划

| 项 | 状态 | 产物 |
|---|---|---|
| 读输入/逐问题/诊断/取舍 | done | 下方逐项及原结构化产物 |
| 定向修复/复杂度/回填 | done | 排程/数量/来源/安全及成熟度按新版Step5～8对齐；业务schema不复制 |
| 自检/停审 | done | Step13实际文档静态核验通过；外部资格/实施Gate不通过 |

## 本步目标

在实施前识别会导致返工、暂停、设计回写或资格阻断的不确定性，定义每个 Spike 的可交付输出、影响 phase/boundary、截止点和失败动作。长期悬空的“后续确认”必须转为 blocker、future 或明确的 re-open 条件。

## 本步输入

| 输入 | 当前结论 |
|---|---|
| Step 1/8 | 目标实现仓不存在；owner/SDK/provider/PG/receiver/notice/Obs qualification 不完整 |
| 03 §17 | MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01、R-MP-DDD-01～10 |
| 05/06 | 正确性优先；capacity-candidate 与 formal integration 分层 |

## SOP 问题回答

| SOP问题 | 回答 |
|---|---|
| 1. 哪些技术点需要先做 Spike。 | 见7Spike；SDK/codec/PG/plan/receiver/Obs与rawtools在最早使用点之前验证。 |
| 2. 哪些风险会阻塞某个阶段。 | 字段/DTO/state/phase/typedplan、tool/export/PG及actualrequired外部资格与redaction/schema缺口阻当前boundary。 |
| 3. 哪些待确认事项会影响提交边界或验收门禁。 | pub/org/auth、Gov/material/current、receiverprobe、notice/Obs、容量/retention及未来Billing/Archive影响scope/证明范围。 |
| 4. 每个 Spike 的输出是什么。 | compatibility/golden/feasibility/typedplan/redaction/schema记录；执行型Spike只有额外实现授权才跑，本轮只定义。 |
| 5. 每个风险的处理方式和截止点是什么。 | 各Spike表列影响/截止/失败；工具SP07在01-a前、PGplan SP04在02-b前，不拖到07。 |
| 6. 哪些风险需要回写上游设计。 | 真相源缺口回所属03/04/05/06/07；通用经验越出本项目授权只登记待回写，已有标准覆盖则明确无需回写。 |

## 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| generic SDK read/call 被误当 exact consumer | 受影响 boundary 会伪通过 | SP-01 只输出 exact mapping matrix；缺失标 ContractBlocked |
| partial owner qualification 被当成全局 ready | U1～U7 正向路径错误开放 | 逐 type/operation/version/scope 分项记录 |
| 性能/容量缺口被写成默认 SLO | 产生无依据完成判定 | Q-MP-01 只做 capacity-candidate；正确性先行 |
| Unknown/retry 语义不清 | blind retry 或错误成功 | SP-05 固定 original intent/probe/reconcile 结果 |
| evidence schema/redaction 未验证 | report 可能泄露 secret/body 或循环 | SP-07 输出 machine schema/redaction/recursion negative |

## 改动前后对比

| 项 | 原状态 | 本步收口 |
|---|---|---|
| blocker | 只在 03/05/06 散列 | 按 phase/boundary 建立 blocker register |
| Spike | 无输出/截止点 | 7 个 Spike 各有输出和截止 |
| 风险 | 容易长期悬空 | 分类为 design blocker、external blocker、capacity candidate、future |
| 经验回写 | 只修当前 boundary | blocker 修复后横向检查标准/SOP/记忆与示例 |

## 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 用 Spike 结果代替正式 owner 签核 | 拒绝 | Spike 只能证明合同/缺口，不产生 authority |
| 把所有风险拖到 PH-07 | 拒绝 | 会在最后才发现无法落码或证据泄露 |
| 先做 local/controlled negative，再等待 positive | 采用 | 保持正确性和进度，不伪造 readiness |
| 为 capacity 未知设置默认阈值 | 拒绝 | Q-MP-01 未确认，不能写 SLA/吞吐/TTL |

## 结构化中间产物

### Spike 表

| ID | Spike 输出 | 影响 phase/boundary | 截止点 | 失败处理 |
|---|---|---|---|---|
| SP-01 | Core/SDK exact export 与 17 ports/8 slots compatibility matrix | PH-01/06；01-a/06-c | PH-01 开工前 | 缺 export 则 compile/adapter blocked，回写 03 |
| SP-02 | Rust MSRV/codec/canonicalization golden fixture matrix | PH-01/02；01-a/02-a | 01-a commit 前 | 固定支持库或回写 codec 设计 |
| SP-03 | PG 17/SQLx 0.8 Tx、frame lock、CAS、cursor/replay feasibility report | PH-02；02-a/02-b | 02-a 开工前 | PG gate blocked；不改为时间戳/sequence |
| SP-04 | projection fixed-upper、lookup key、四kind完整typed input/builder、bounded maintenance plan | PH-02/03；02-b/03-b | 02-b plan首批前，03-b再复核 | 回写 projection/port/phase |
| SP-05 | receiver external effect Unknown、original intent probe、late result/reconcile contract | PH-04/05/06；04-a/05-b/06-c | 04-a 开工前 | no unqualified dispatch / waiting；不猜 success |
| SP-06 | Obs producer/redaction/admission and recursion exclusion matrix | PH-01/05/06；01-a/05-b/06-c | 01-a redaction契约前；05-b producer使用前 | local audit only；Obs positive blocked |
| SP-07 | artifact/report JSON schema, run-id/DAG and redaction/recursion check script design | PH-01/07；01-a/07-a/b | 01-a bootstrap首批前；07-a final再审 | 不生成 acceptance handoff |

### 风险与 blocker 表

| ID | 类型 | 描述 | 影响 | 处理/截止 |
|---|---|---|---|---|
| MP-UP-001 | external blocker | owner immutable export/qualification 不全 | U1/U2/U3/U4/U7、01-a/03-a/06-c | 各 type exact qualification 前 blocked |
| MP-UP-002 | external blocker | Governance full binding/current decision 不全 | 03-a/06-c | formal decision contract 前 blocked |
| MP-UP-003 | external blocker | publisher/org/human auth owner 未定 | all write/scope | owner 确认前 blocked |
| MP-UP-004 | external blocker | material/signature/scan/SBOM authority 未定 | 03-a/04-a | 只引用 refs；positive blocked |
| MP-UP-005 | external blocker | receiver intent/result/probe/materialization 未定 | 04-a/05-b/06-c | no dispatch；Unknown waiting |
| MP-UP-006 | future/blocker | Billing/payment/subscription/revenue/cross-border 无 owner | future transaction | 不建 writer；重开00/01后再计划 |
| MP-UP-007 | external blocker | notice authority/channel/receipt 未定 | 04-b/05-b | local stop；positive notice blocked |
| MP-UP-008 | external blocker | Obs producer/redaction/receipt 未定 | 05-b/07-a | local audit；handoff blocked |
| MP-SRC-003 | design blocker | draft 技术栈与正式 Rust/Vue 差异 | all build | 正式栈优先；受控变更才回写 |
| MP-SRC-010 | design/owner blocker | Governance 历史状态/项目台账冲突 | 03-a/06-c | exact consumer 核验；不猜 approval |
| MP-SRC-013 | future/design blocker | package/ISO/MK2 authority 未闭合 | 03-a/04-a | 不自产 package/compliance verdict |
| Q-MP-01 | capacity candidate | 吞吐、检索、retention、notice budget 未知 | PH-02/05/07 | capacity-candidate；无默认 SLA/TTL |

### R-MP-DDD 风险表

| ID | 关注点 | 影响 boundary | 保护规则 | 关闭条件 |
|---|---|---|---|---|
| R-MP-DDD-01 | 写帧吞吐/锁预算未知 | 02-a/b | 保持 frame correctness，不用 sequence/timestamp | formal capacity measurement + ADR |
| R-MP-DDD-02 | history/result/checkpoint 增长 | 02-b/05-b | 无删除 authority 不 TTL/GC/级联删 | retention owner/预算 |
| R-MP-DDD-03 | 中文/短词/分页负载 | 03-b/05-a | literal OR/simple FTS、固定序；超预算不可用 | product SLO + run |
| R-MP-DDD-04 | canonical library/MSRV/codec | 01-a/02-a | finite DTO/decimal/set/canonical golden | toolchain run |
| R-MP-DDD-05 | Unknown 原报告不可复原 | 04-a/05-b | formal terminal/probe；不足保持 Reserved waiting | receiver report/probe |
| R-MP-DDD-06 | local permission/remote effect time gap | 04-a/b/05-b | current gate、known impact、late result | receiver/notice/Gov contract |
| R-MP-DDD-07 | bounded maintenance 数值未知 | 02-b/03-b | fixed upper/typed continuation；不能截断称 Complete | capacity budget |
| R-MP-DDD-08 | exporter/audit 混淆 | 05-b/07-a | finite allowlist、防递归、same Tx | Obs producer qualification |
| R-MP-DDD-09 | future phase/private fake 补面 | all | 当前 carrier/result/read面不得后置 | boundary audit |
| R-MP-DDD-10 | docs/prototype/fake 被视为 ready | PH-07 | only planned/blocked/waiting | actual run/review |

## 回填草稿

> 07 将 Spike、external blocker、capacity candidate 和 future scope 分开管理。每个 Spike 都必须产出可审计的 compatibility matrix、golden fixture、feasibility report、typed plan、redaction matrix 或 schema/check design；Spike 结果不能产生 owner approval、payment、evidence、signoff 或 readiness。
>
> MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01 与 R-MP-DDD-01～10 继续保持 pending/blocked/affected/future。阻塞项到期未关闭时，相关 boundary 停在 blocked/waiting，不得用 local negative pass 或 fake 代替。

## 待确认事项

下表保留原责任、影响与截止点，仅归位到固定十段的独立章节；waiting/future不由设计静态审查关闭。

| 事项 | 责任/输入 | 影响 | 截止点 | 状态 |
|---|---|---|---|---|
| Core/SDK exact exports | Core/SDK owner | 01-a/06-c | PH-01 | waiting |
| publisher/org/auth | formal owner | all write/scope | PH-03 | waiting |
| Governance decision binding | Governance/SDK | 03-a | PH-03 | waiting |
| material authority | Artifact/owner | 03-a/04-a | PH-03 | waiting |
| receiver/probe/materialization | receiver owner | 04-a/05-b | PH-04 | waiting |
| notice channel/receipt | notice owner | 04-b | PH-04 | waiting |
| Obs producer/redaction | Obs owner | 05-b/07-a | PH-05 | waiting |
| PG/capacity/retention | PG/product/ops owner | 02-b/05-a | PH-02 | waiting |
| Billing/Archive authority | future owner | future | before new scope | future |

## 进入下一步条件

- [x] 7 个 Spike 均有明确输出、影响 phase 和截止点。
- [x] external blocker、capacity candidate、future 和 design risk 已分层。
- [x] 每个待确认事项有责任输入、影响和截止 phase。
- [x] 不存在长期悬空的“后续确认”。

## 停审记录

本Step及其定向回修已通过Step13实际文档静态检查，正式来源与结构化产物一致。状态为completed / selfcheck_done / stop_review；本轮全部07设计已完成，现在等待用户确认07，不跨文档或实施。上游blocker、immutablebaseline与实际实现Gate仍未通过；无业务测试run或commit。
