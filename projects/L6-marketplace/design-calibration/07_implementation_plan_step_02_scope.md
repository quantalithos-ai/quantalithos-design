# 07 Step 2：实施目标、范围与非范围

## Step 状态

| 字段 | 值 |
|---|---|
| status | completed / selfcheck_done / stop_review |
| gate_status | pass (design-only) |
| gate_reason | 本Step结构化/定向回修及正式传播已完成；Step13实际文档静态核验通过，见07_implementation_static_review_record.md；仅design，不表示实施或资格 |
| next_allowed_action | waiting_user_confirmation |
| source_files | Step 1；00 §2/6/7/8/9；01 §6/7/12/15；02 §2/5/6；03 §2/16/17；05 §2/6；06 §2/5/13 |

### Step 内计划

| 项 | 状态 | 产物 |
|---|---|---|
| 读输入/逐问题/诊断/取舍 | done | 下方逐项及原结构化产物 |
| 定向修复/复杂度/回填 | done | 排程/数量/来源/安全及成熟度按新版Step5～8对齐；业务schema不复制 |
| 自检/停审 | done | Step13实际文档静态核验通过；外部资格/实施Gate不通过 |

## 本步目标

把正式需求和详细设计转成不会在实施阶段膨胀的目标、范围和非范围。范围只描述 Marketplace 局部 truth 和实现交付能力，不把上游 owner 的正文、审批、认证、材料、安装、支付或财务结果纳入本仓。

## 本步输入

| 输入 | 结论 |
|---|---|
| Step 1 输入边界 | 00～06 为唯一 design baseline；外部 positive qualification 未闭合 |
| 00 目标/边界 | 五项核心能力、七个 U、104 个需求编号 |
| 03 实现契约 | 49 个入口、43 个对象、17 ports、14 carriers、0 active canonical event/outbox |
| 05/06 门禁 | 98 TC/EV、20 AC、5 VETO；local/selected/candidate 证明分层 |

## SOP 问题回答

| SOP问题 | 回答 |
|---|---|
| 1. 本轮实施的最小可交付结果是什么。 | 可验证Marketplace七U localcontract/controlledseam，包括typed API/Worker/Web，不等实际运行。 |
| 2. 哪些需求编号必须覆盖。 | 全部16FR/21BR/17NFR/20AC/14IF/11DEP/5VETO都有范围/测试/验收/边界索引。 |
| 3. 哪些详细设计章节必须落地。 | 03完整typedtypes/ports/49flow/状态/PG/幂等/read/SDKblocked映射；不复制业务schema。 |
| 4. 哪些验收项必须在本轮可判定。 | 按06 local-contract、formal-selected、capacity-candidate分层；缺positive为not_evaluable/blocker，不在本轮发结论。 |
| 5. 哪些能力明确不在本轮实施。 | 所有ownerbody/Identity/Govapproval/安装支付财务/Archivewriter/eventoutbox等不实施；exactpositive受资格阻断，不擅自删requiredcase。 |
| 6. 是否存在 P1 / P2 能力容易被误做进 P0。 | 不加入rating/ranking/recommendation/新运营或支付后台；现有publisher/application/version控制仍是当前Web范围，任何新truth回00～07。 |

## 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| “发布成功”容易被误写成 owner approval 或资产可获取 | 会越过 Governance/Artifact/Receiver ownership | 拆成本地申请/审核 handoff、MarketVersion 状态和正式结果 binding；只消费 owner ref |
| “获取/分发”容易被误写成安装或付费 | 会生成未授权 entitlement/payment truth | 只实施 DistributionIntent/Relation/OutcomeBinding；paid/installed/subscribed 永久排除 |
| 目录/搜索可能被当作新的 asset truth | 会复制 Method/Hub/Image/Artifact 正文 | 目录只存 immutable ref、version、digest、visibility、eligibility 与市场 metadata |
| “审计/归档”容易引入 Archive writer 或 evidence verdict | 会跨越 Obs/Archive authority | 只实施 local audit、原结果/恢复和 qualified Observation handoff |
| 49 入口一次性实施过大 | 无法 review、回退和证据归属 | 后续按可验证 phase 和 commit boundary 拆分 |

## 改动前后对比

| 项 | 之前的宽泛表述 | 本步收口 |
|---|---|---|
| 发布 | “发布内容” | publisher relation + publication application + Governance handoff + listing/version |
| 分发 | “安装/获取” | eligibility、intent、受理、局部 relation、正式 receiver outcome binding |
| 目录 | “展示资产” | category/search projection；不复制 owner body/lineage |
| 运营 | “通知/审计/归档” | withdrawal/impact/notice intent、local audit/recovery、qualified Obs handoff；无 Archive lane |
| 交易 | “entitlement/transaction” | 只纳入明确列出的局部状态；Billing/payment/revenue/cross-border future/blocker |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只实现 UI 原型 | 能快速展示，但无 typed truth、失败恢复或验证入口 | 与正式 03/05/06 不可落码 | 拒绝 |
| 一次性实现所有 49 入口和 owner 集成 | 表面完整 | phase boundary 不可审查，正向 qualification 未闭合 | 拒绝 |
| 先 local contracts/vertical slice，再按资格启用外部 seam | 可独立验证且 fail closed | 正向 integration 要等待 owner | 采用 |

## 结构化中间产物

### 实施目标表

| 目标 ID | 可验证目标 | 需求/设计来源 | 本轮状态 |
|---|---|---|---|
| OBJ-01 | 七 U 的 typed contracts、domain guard、application flow 和 ownership 边界可落码 | 00 C-MP-1～5；03 §5/7/8 | planned |
| OBJ-02 | publication application → Governance handoff → matched formal decision → MarketVersion listing 的局部闭环 | FR/AC；03 U2/U3 | planned；Gov positive blocked |
| OBJ-03 | catalog/category/search/version selection 只读投影与 scope/visibility/current disclosure | FR/BR；03 U3/U7；05 P catalog/reference主suite；R补层 | planned |
| OBJ-04 | distribution intent、受理、single dispatch/probe、局部 relation 和 late outcome binding | FR/AC；03 U4；05 W distribution主suite；I/R补层 | planned；Receiver positive blocked |
| OBJ-05 | withdrawal、known impact、notice intent/binding 与 no-new-distribution gate | FR/AC/VETO；03 U5；06 §5/11 | planned；Notice positive blocked |
| OBJ-06 | operation/result/audit/work/checkpoint/recovery 与 read-only replay | BR/NFR；03 U6；05 R恢复主suite；P/W/X补层 | planned |
| OBJ-07 | config validation、owner adapter slot 状态、redaction、evidence handoff seam | 04；05/06 §7/10 | planned；Obs positive blocked |

### 实施范围表

| 范围 | 本地交付 | 不复制的外部真相 |
|---|---|---|
| U1 source/publisher | relation、safe summary、immutable source/material refs、qualification gap | Method/Role/ProcessTemplate/Capability/Image/Artifact 正文、Identity truth、人类认证 |
| U2 publication/review | Draft/Submitted application、basis、handoff、decision binding/current check | Governance approval writer、审批规则和正式 decision truth |
| U3 catalog/version | Listing、Category、MarketVersion、版本选择、search projection | owner registry/adapter、owner body、安装包和财务状态 |
| U4 distribution | eligibility snapshot、intent、attempt、relation、outcome binding、probe/Unknown | receiver 内部执行、installed/paid/settled/subscribed |
| U5 withdrawal/notice | disposition、known impact、notice intent、receipt/probe binding、停发 gate | owner revoke、通知送达/阅读 truth、卸载 |
| U6 audit/recovery | operation/context/full result、audit、work/plan/checkpoint/recovery | Observation evidence verdict、Archive restore/write |
| U7 reference/read | qualified snapshot、derived index/projection、freshness/current disclosure | 上游 snapshot truth、缓存成为 truth、query side effect |

### 非范围表

| 非范围 | 状态 | 处理 |
|---|---|---|
| Method/Role/ProcessTemplate、Capability Registry/Adapter、Member Image、Artifact 正文/血缘 | 明确排除 | 只使用 owner immutable refs/version/digest/visibility/eligibility |
| Identity truth、人类/组织认证、Governance approval | 明确排除 | 由正式 owner 提供；缺失时 ContractBlocked/NotVisible |
| 签名、扫描、SBOM、ACK 产生 approval/installed/readiness | 明确排除 | 只作为材料引用或 receiver/notice binding，不能改变状态 |
| Billing/payment/subscription/revenue/cross-border | future/blocker | 不创建 writer、ledger、paid/settled truth |
| Archive export/restore、canonical event/outbox | 当前 0 active | 只有新正式 owner/schema/ADR 后重开 |
| rating/review/ranking/recommendation、公开发布 CLI、新的支付/全局权限运营后台 | 非当前入口 | 需求/架构变更后再计划 |

#### 实施范围图: Marketplace局部所有权

```text
[owner immutable refs / formal decisions / outcomes]
  | consumes; no body/approval copies
  v
[Marketplace listing/application/version/distribution/withdrawal]
  +--> [API + Web current typed views]
  +--> [Worker internal jobs + local audit/recovery]
```

关键说明：
- 图表达数据所有权与本地承载范围，不表达 owner 内部实现。
- 上游正文、approval、安装、支付和 evidence verdict 不进入 Marketplace truth。
- 缺少正式 owner contract 时，相关箭头只能进入 blocked/degraded/Unknown，不可继续为成功。

## 回填草稿

> 本轮实施目标是为 Marketplace 的七个用户单元建立可验证的本地实现增量：来源/发布责任、发布申请与审核交接、目录与市场版本、受控分发、撤回/影响/通知、审计/恢复以及引用/读面。每个目标均只拥有本地 listing、application、category、publisher relation、version/listing state、distribution relation、withdrawal/notice 与明确纳入的 entitlement/transaction 局部状态。
>
> 实施范围不包括任何 owner 正文、血缘、Registry/Adapter truth、Identity truth、Governance approval、安装/激活/卸载、支付/订阅/收入分成/跨境交易或 Archive writer。签名、扫描、ACK、receipt 不等 approval、installed、paid、delivered、evidence 或 readiness。未闭合的外部资格在后续 phase/boundary 中显式标为 blocked/future。

## 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| 是否有正式 publisher/org/auth owner | U1、scope 与所有写入口 | 对应 phase 开工前 |
| Governance exact decision binding | U2→U3/U4 正向路径 | review boundary 开工前 |
| Receiver/Notice/Observation producer | U4/U5/U6 positive integration | 对应 adapter boundary 开工前 |
| Billing owner 与范围 | entitlement/transaction 后续扩展 | 新需求/架构授权前 |

## 进入下一步条件

- [x] 实施目标可以追溯到 00/03/05/06。
- [x] 每个目标都有明确的本地拥有内容和外部禁止复制内容。
- [x] 非范围包含安装、支付、财务、Archive、owner 正文和自生 approval。
- [x] 后续 phase 可围绕可验证功能增量拆分，不按对象清单直接实施。

## 停审记录

本Step及其定向回修已通过Step13实际文档静态检查，正式来源与结构化产物一致。状态为completed / selfcheck_done / stop_review；本轮全部07设计已完成，现在等待用户确认07，不跨文档或实施。上游blocker、immutablebaseline与实际实现Gate仍未通过；无业务测试run或commit。
