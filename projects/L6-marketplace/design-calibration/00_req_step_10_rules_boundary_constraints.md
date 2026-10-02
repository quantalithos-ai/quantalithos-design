# Step 10. 业务规则与边界约束

## 1. 状态与计划

`pass / stop_review`；SOP Step10 / 规范 §4.10 已读。输入/问题/诊断/取舍 done；规则来源与状态主语审计/草稿/自检 pending。回填 §10。

## 2. 输入

Step2/7/9；五能力附录原始规则、状态需求、取舍与 pending。规则引用固定附录编号，不从旧例重新命名。

## 3. SOP 问题回答

1. 按 C1～5 逐节点规则已停审；本步做共同约束与冲突检查。
2. 不变量：owner ref/version/digest/scope 一致，申请基线固定，市场版本 exact，当前资格再核验，重复意图不新增事实。
3. 禁止：approval 推断、正文复制、query 写入、ACK 当 installed、支付/订阅生成、通知/审计伪造及外部 truth 修复。
4. 显式变化：申请基线修订、上架/限制/撤回、恢复有新依据；query/索引不推进。
5. 边界：资产、Identity、Gov、receiver、Billing、Observability/Archive 各自 authority 不迁移。
6. 治理/审计条件：上架需正式批准绑定；所有关键局部变化与未知外部副作用需可追溯。
7. 规则保护的功能见附录规则最后列；无无功能规则。
8. 未挂功能的未来计费/包操作不建规则状态，列风险；全局正文字段由 NG1/2 与 BR101/102/103/402/404/505 限定。
9. 需求阶段足以阻越界，exact function/transaction/error code 留03，但不能让实现绕 gate。

## 4. 诊断

旧00 §6.2 BR002 把包格式当已有 truth，BR005 仅“必须通知”没写停新分发/失败边界；draft 状态名 approved_by_governance 会偷带 approval truth。必须分别筛选 listing/version/review/distribution 主语，不为 ref/UI/外部真相发明状态机。

## 5. 对比

| 项 | 改前 | 改后 | 原因 |
|---|---|---|---|
| 审核门槛 | 材料/共批标签 | 有效正式决定+申请/版本/材料/scope | authority 可验证 |
| 状态 | 发布/安装 Done | 各主语与 outside outcome 分离 | 失败恢复可判别 |

## 6. 取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 需求不变量+正式 authority+局部显式状态要求 | 清晰且不锁实现 | 03仍须 exact transition | 采用 |
| 统一 MarketState 包所有结果 | 表少 | approval、projection、安装与通知混层 | 不采用 |

## 7. 结构化中间产物

| 能力 | 规则集合 | truth source / 失败姿态 | 验收 |
|---|---|---|---|
| C1 | BR-MP-101～104 | owner 来源、publisher 正式 authority、材料 basis；缺失不放行 | AC101～103 |
| C2 | BR-MP-201～204 | Gov 正式有效批准与基线、市场局部受控意图；pending/waived/失效/unknown 不 eligible | AC201～203 |
| C3 | BR-MP-301～304 | 正式 visibility resolution、局部 listing/版本、source marker；隐藏不泄漏，索引不能授权 | AC301～303 |
| C4 | BR-MP-401～404 | 当前资格、receiver 正式 outcome、canonical 意图；unknown 对账，不造 installed/paid | AC401～403 |
| C5 | BR-MP-501～505 | 处置依据、已知关系与安全历史、channel/审计 qualified outcome；通知失败不停撤回，范围缺口可见 | AC501～504 |

21条规则逐条原文见五附录 §7，保留其不变量/禁止行为/显式变化/边界约束/治理约束/审计约束类型，正式 §10 不改语义。

### 状态主语与后续闭口

| 主语 | 本仓是否拥有迁移 | 需求约束来源 |
|---|---|---|
| listing / market version | 是，局部生命周期 | FR203、BR201/203、C2 状态表 |
| 申请 / review handoff | 是，只申请与交接过程，不 Gov decision | FR201/202、BR202/204 |
| distribution relation / notice attempt / audit handoff | 是，只市场过程状态 | C4/C5、BR402/403/503/504 |
| owner version/approval/Identity/installed/payment | 否，只消费来源 | C1/2/4边界规则 |
| ref/digest/UI locale/cursor | 不进入业务状态机 | 来源标识不等 authority |

撤回是局部风险控制，有依据可撤回；来源未知可限制而不伪称 Gov revoked。重新发布不能复活旧申请批准，要新有效依据/版本及显式上架。取消外部正在交接的请求不自动回滚 receiver commit。目录索引失效不是 market version revoked。以上已从原附录规则/结果收束，无新增 owner 状态。

复杂度：规则与主语分表，正式规则不包含函数、schema、transaction 或错误码；03必须从这些约束逐迁移闭口。

## 8. 回填草稿

正式§10按五能力列21条规则固定表，增加短来源说明；状态主语审计留校准，正式表只陈述硬约束。

## 9. 待确认

未知授权/材料/Gov binding/receiver 不得靠配置或 local enum 派生。上游状态冲突不在本仓修复。

## 10. 自检停审

21条有对应功能/正式源/失败姿态与验收；规则同名无冲突，C5限制新获取承接C4当前资格，不形成越权反写。计划 done；`pass / stop_review`，允许 Step11。
