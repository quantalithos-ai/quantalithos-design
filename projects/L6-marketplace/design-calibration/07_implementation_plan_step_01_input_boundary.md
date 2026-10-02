# 07 Step 1：实施输入边界

## Step 状态

| 字段 | 值 |
|---|---|
| mode | full-restart / single-agent / design-only |
| status | completed / selfcheck_done / stop_review |
| gate_status | pass (design-only) |
| gate_reason | 本Step结构化/定向回修及正式传播已完成；Step13实际文档静态核验通过，见07_implementation_static_review_record.md；仅design，不表示实施或资格 |
| next_allowed_action | waiting_user_confirmation |
| source_files | 07 SOP §5 Step 1；项目台账；正式 00～06；对应 calibration flow/static record |

### Step 内计划

| 项 | 状态 | 产物 |
|---|---|---|
| 读输入/逐问题/诊断/取舍 | done | 下方逐项及原结构化产物 |
| 定向修复/复杂度/回填 | done | 排程/数量/来源/安全及成熟度按新版Step5～8对齐；业务schema不复制 |
| 自检/停审 | done | Step13实际文档静态核验通过；外部资格/实施Gate不通过 |

## 本步目标

确认实施计划唯一承接的设计输入、版本关系、1:1 可落码闭环和外部 blocker。实施计划不补写需求、架构、对象、协议、状态或测试设计；发现缺口时限定 phase、标为 blocker，或要求回写所属正式文档。

## 本步输入

| 输入 | 版本 / 路径 | 用途 | 状态 |
|---|---|---|---|
| 需求 | 00-需求文档.md | 16 FR、21 BR、17 NFR、20 AC、14 IF、11 DEP、5 VETO | confirmed design baseline |
| 架构 | 01-架构设计.md | Web/API/Worker、向内依赖、六 Rust member + Web、owner/SDK 边界 | confirmed design baseline |
| 概要 | 02-概要设计.md | 七 U、43 对象轮廓、21 Command/16 Query/12 Job、49 flow | confirmed design baseline |
| 详细 | 03-详细设计.md | 1:1 实现契约、17 ports/146 methods、14 carrier/222 pairs、事务/状态/错误/观测 | confirmed design baseline；positive adapters 仍受资格限制 |
| 配置 | 04-配置设计.md | 严格 JSON、六域、七 RuntimeConfig 字段、八 adapter slot、四 profile | confirmed design baseline |
| 测试 | 05-测试方案.md | 98 TC/EV、11 suite、13 CUT/13 DS、环境/证据/失败语义 | confirmed design baseline；未运行 |
| 验收 | 06-验收标准.md | 20 AC、5 VETO、三类证明范围、进入/退出/三值算法 | confirmed design baseline；未送验 |

## SOP 问题回答

| SOP问题 | 回答 |
|---|---|
| 1. 当前仓是否已经具备完整的 00 / 01 / 02 / 03 / 05 / 06 文档。 | 正式00～06完整，04也纳入；本轮07已完成结构化装配与设计静态核验。 |
| 2. 哪些上游文档版本是本轮实施计划的基线。 | 当前full-restart正式working tree；不是已冻结不可变设计commit。 |
| 3. 详细设计是否已经足以支持 1:1 实现。 | localtyped schema/ports/flow有来源，55项按15边界再审；externalpositive缺资格不能宣称1:1正向集成。 |
| 4. 测试方案和验收标准是否足以定义阶段门禁。 | 05/06完整98TC/EV、11suite、AC/VETO及schema能定义计划；实际run未有。 |
| 5. 是否存在上游文档之间的冲突。 | Step13发现04 §7.1七字段误句及07排程/别名冲突；已回修对应calibration/04一句，不靠实现补洞。 |
| 6. 详细设计是否已经完成字段闭环、DTO 构造闭环、状态闭环和 phase boundary 复核。 | 03的字段/DTO/state有正式来源；phase属于07，本轮已重修前置runner/U1/U7与工具成熟度；最终Step13校验。 |
| 7. 测试方案和验收标准是否使用详细设计正式字段、状态、接口和证据名称。 | 只使用正式05/06 IDs、state/ports/证据词表，测试字母不能猜业务；发现旧名需修truth。 |
| 8. 哪些缺口会阻塞实施计划，哪些缺口可以记录为风险继续推进。 | 设计冲突先修，repo/baseline/env缺阻移交；ownerpositive按local/selected分层blocked，Billing/Archivefuture；容量候选不伪SLO。 |

## 当前文档问题诊断

| 问题 / 缺口 | 影响 | 处理 |
|---|---|---|
| 目标实现仓不存在 | 无法做 Cargo/Node/PG/SDK 编译或运行检查 | 在 07 中只规划目标路径；移交前保持 blocked，不创建实现仓 |
| 外部 owner exact consumer qualification 未闭合 | U1～U5、U7 positive integration 不能标为 ready | 相关 phase/boundary 标 blocked；仅允许 local/fake/controlled seam |
| Q-MP-01 容量、检索、留存预算未确认 | 不能写 SLO、吞吐或 TTL/GC 完成判定 | 作为风险与 Spike；正确性优先，容量候选不作为放行 |
| Billing/支付/订阅/分成/跨境无 owner | entitlement/transaction 只保留明确局部状态 | 规划为 future/blocker，不交付财务 writer |
| Archive 无 market lane | 不能规划 Archive writer/restore | 仅保留 local recovery 与未来 handoff，Archive boundary blocked |
| 07 之前没有 implementation ledger | 设计阶段尚未授权实现 | Step 13 创建项目级 ledger 和全部 planned boundary skeleton |

## 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| 计划输入 | 仅有各正式文档，未形成 07 输入判定 | 固定 00～06 baseline、来源用途和证明上限 |
| 外部资格 | 容易被“文档完成”误读为可集成 | 明确 local / selected / candidate 与 blocked/future 分层 |
| 可落码责任 | 可能把缺口留给实现者 | 要求回写所属设计或限制 boundary，不允许实现临场补 truth |
| 实施台账 | 尚未创建 | 延后至 Step 13，按 Gate Matrix 全量预创建 planned skeleton |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 直接按旧 07 或 draft 排期 | 快速，但会继承历史 commerce/install/payment 口径 | 与当前 ownership 和正式状态冲突 | 拒绝；旧材料仅 historical |
| 等所有 owner positive qualification 后再写 07 | 正向路径更完整 | 无法提前形成 local 实施顺序和阻断边界 | 拒绝；先规划可验证 local slice，并显式 blocked |
| 以正式 03/05/06 为基线、calibration 追溯细节 | 能 1:1 对齐并保留未闭合资格 | 需要每 boundary 重复审计 | 采用 |

## 结构化中间产物

### 输入基线与证明上限

| 层次 | 可规划 | 不可宣称 |
|---|---|---|
| 本地设计契约 | contracts/domain/application、PG UoW、API/Worker/Web 映射、配置校验、fake parity | 编译、测试、运行结果 |
| 受控集成 | adapter 的 exact mapping skeleton、ContractBlocked/Degraded/Unknown 分支、测试 seam | owner positive compatibility、真实材料/签名/扫描/receiver 结果 |
| 最终验收 | 98 TC/EV、20 AC、5 VETO 的执行路径 | run、artifact、report、verdict、signoff、readiness |

#### 实施前总门禁图: Marketplace设计与实施资格分层

```text
[formal 00..06 working tree]
  -> [03/05/06/07 boundary closure audit]
     -> local design may be planned
     -> exact positive absent: blocked
  -> [freeze immutable baseline + extra implementation authority]
  -> [project + current boundary Design/Scope/Worktree Gate]
```

关键说明：
- 图只表达实施计划输入和阻断关系，不表达运行时调用链。
- blocked 只表示资格或设计前置未满足，不是失败测试结果。
- 所有真实 evidence、report 和验收结论必须在实现仓按 05/06 规则产生。

### 输入闭环表

| 闭环项 | 来源 | 当前结论 | 07 处理 |
|---|---|---|---|
| 字段与支持 carrier | 03 Step 6/shared schema、Step 7 ports | 设计闭合 | 每 boundary 重核；缺口暂停并回写 |
| DTO 构造与 mapper | 03 Step 8/9/12/17 | 设计闭合 | 不允许 facade/fake 从字符串或 raw body 猜字段 |
| 状态迁移 | 03 §9、05 TC、06 §8 | 状态名一致 | phase 只拥有本 phase 迁移，后续状态 reserved |
| 持久化与事务 | 03 §10/12/13 | UoW、CAS、幂等、原结果和 checkpoint 已定义 | Q-MP-01 仅影响容量，不放松正确性 |
| 测试与验收 | 05 98 TC/EV；06 20 AC/5 VETO | 可建立门禁索引 | 实际执行仍 planned/blocked |
| 外部 owner | 03 §17；MP-UP/SRC/Q/R | exact qualification 缺失 | adapter boundary blocked/future |

## 回填草稿

> 本实施计划建立在当前正式 00-需求文档、01-架构设计、02-概要设计、03-详细设计、04-配置设计、05-测试方案和 06-验收标准之上。旧 README、旧正式稿和 draft 仅作 historical_material。正式 03 提供实现契约，05/06 提供阶段测试与验收门禁；本计划不补写其对象、协议、状态或测试内容。
>
> 本计划可以安排本地契约、受控 fake seam、PG 原子性、API/Worker/Web 映射和配置验证的 planned boundary；正式 owner/SDK positive、publisher/auth、Governance binding、material、receiver、notice、Observation producer、Billing 和 Archive lane 未闭合时，相关 boundary 必须保持 blocked/future。实现仓、run、artifact、report、evidence、verdict、signoff、readiness 均不得由设计仓伪造。

## 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| 用户确认 07 是否可作为实现移交基线 | 影响 Step 13 后是否允许 handoff | 正式 07 完成后停审 |
| 九 owner exact consumer / adapter qualification | 影响所有 positive integration boundary | 对应 boundary 开工前；未关闭则 blocked |
| Q-MP-01 容量/留存/检索预算 | 影响 capacity-candidate 和正式 SLO | capacity phase 开工前 |

## 进入下一步条件

- [x] 00～06 正式基线、旧材料地位和证明上限已明确。
- [x] 字段、DTO、状态、事务、测试和验收的现有闭环已索引。
- [x] 未闭合的 owner、Billing、Archive、容量事项已分类为 blocker/risk/future。
- [x] 不把 Step 1 结论误作实现授权。

## 停审记录

本Step及其定向回修已通过Step13实际文档静态检查，正式来源与结构化产物一致。状态为completed / selfcheck_done / stop_review；本轮全部07设计已完成，现在等待用户确认07，不跨文档或实施。上游blocker、immutablebaseline与实际实现Gate仍未通过；无业务测试run或commit。
