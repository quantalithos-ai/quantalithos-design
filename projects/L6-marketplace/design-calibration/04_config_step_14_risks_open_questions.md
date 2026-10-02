# 04 Step 14：定义风险与待确认事项

## 1. Step状态

2026-10-02；`completed / selfcheck_done / stop_review`。Step1～13均已完成；本步收拢配置风险、外部资格和重开条件。存在外部pending/blocked，但没有本轮新增的03代码契约待回写项，因此允许Step15装配。

## 2. 本步目标

**目标**：区分“配置语义已收敛”和“外部运行资格未闭合”，避免把配置文件可解析误报为Marketplace可运行或ready。

### 本步输入

Step1～13、正式00～03、项目台账、03§13/§17、MP-UP/MP-SRC/Q影响清单。

### 本步输出

风险表、待确认表、详细设计回写表、Step15装配门禁，回填正式04§14。

## 3. 应问的问题与SOP回答

1. **配置设计是否需要等待所有owner正向合同？** 不需要等待才能定义键、ref、校验和失败姿态；但正向adapter仍Blocked，不能宣称可用。
2. **哪些缺口会改变03？** 新RuntimeConfig字段、adapter constructor、port、error、DTO、flow、状态或active event lane；本轮均未新增。
3. **哪些缺口只影响实施/运行？** PG/SDK/provider真实值、profile容量、TLS/auth注入、owner exact mapping和Q-MP-01预算；作为pending/future，不伪造默认。
4. **如何防止配置证据越界？** 文档、JSON demo、fake、原型和静态检查都不等于真实资格、digest、scan、payment、evidence、verdict、signoff或readiness。

### 当前材料问题诊断与取舍

当前本地配置语义已足够装配文档，但owner/SDK/provider/PG/TLS/auth和容量事实仍未闭合。采用“风险原样保留、能力fail-closed、代码契约不猜”的取舍；不为解除风险新增字段或默认值。

### 改动前后对比

| 之前 | 本步后 |
|---|---|
| 外部缺口可能被配置表掩盖 | 每项标记pending/blocked/affected/future |
| 代码契约和运行事实混为一谈 | 03影响表区分无回写与未来重开 |
| 配置静态通过可能被误读为ready | 证据上限和Step15门禁明确保留 |

## 4. 风险表

| 风险 / blocker | 影响 | 缓解 / 当前处理 | 状态 |
|---|---|---|---|
| `MP-UP-001～008` owner/consumer资格未闭合 | 八slot positive binding、发布/审核/分发/通知/观察能力无法正向启用 | 只保存typed ref；validator保持Blocked/Disabled；逐type/operation/version/scope复核 | pending/blocked |
| `MP-SRC-003` publisher/human/org/auth资格 | 不能把Identity AI或本地登录当publisher truth | Publisher slot只做引用，未闭合则Blocked | pending |
| `MP-SRC-010` Governance binding/正式决定消费合同 | ACK/扫描/签名不等approval；上架不能自审 | Governance slot要求正式decision/current binding | pending/affected |
| `MP-SRC-013` 材料/包/供应链边界 | 不能自产scan/signature/SBOM或包truth | Material只引用owner材料，缺正式contract fail-closed | pending/future |
| `Q-MP-01` worker/容量/超时预算 | 无法填写生产batch/lease、provider timeout和profile上限 | 项目项必填，无数值默认；先由正式owner/平台确认 | blocked |
| PG/schema/extension/隔离能力未验证 | local truth、索引与事务装配可能Unavailable | storage ref必填；关键能力失败拒启动 | pending |
| SDK profile/exact operation/schema mapping未验证 | generic SDK无法证明八slot可用 | sdk ref只选profile；positive adapter保持Blocked | affected |
| secret provider/rotation合同未知 | ref可解析性、轮换兼容和redaction风险 | 仅opaque ref；不写provider名称/真实值 | pending |
| TLS/CORS/auth尚未形成03字段 | listener和可信actor边界不能用04私造 | 当前不新增字段；由平台/owner合同触发03/04重开 | pending |
| Billing/支付/订阅/收入分成/跨境交易无owner | 不能把transaction/entitlement truth写进Marketplace | 不配置、不建slot，列future/blocker | future/blocker |
| Archive export/restore、active event/outbox无正式lane | 不能把配置打开为第二条truth链 | 保持0 active lane，需上位文档重开 | future/blocker |

## 5. 待确认表

| 事项 | 需要确认的事实 | 确认方 / 关闭证据 | 未确认处理 |
|---|---|---|---|
| 配置schema/parser | 严格JSON、duplicate key、profile值域和错误映射 | 03/07实现设计与05测试 | loader语义固定；实现pending |
| `api.bind`与Web origin | 正式监听、TLS/CORS/auth allowlist | 平台/正式auth owner | 无生产默认；构建/启动fail-fast |
| PG ref与能力 | connection/pool/lock/statement/extension预算和隔离 | storage实施核验 | storage assembly blocked |
| SDK/owner refs | exact operation/schema/consumer/current authority | 各owner/SDK正式合同 | slot Blocked/Unavailable |
| secret provider | provider、rotation、兼容窗口、保留期 | 安全/平台合同 | 只存ref；不加载明文 |
| worker预算 | batch/lease上限、timeout、Q-MP-01 | 平台/容量owner | 数值必填；不填默认 |
| 业务范围扩展 | Billing/Archive/event/新资产类型 | 00/01/02受控变更 | 不配置化；future/blocker |

## 6. 详细设计影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 七字段、八slot、六域、严格loader | 否 | 配置语义 | 03§13已有契约 | 无回写 |
| provider/PG/SDK/owner真实合同缺失 | 是（外部资格） | 运行绑定/positive adapter | 03§13/§17已标受影响 | 无回写（pending外部输入） |
| TLS/auth若未来成为字段 | 是 | RuntimeConfig/entry | 03§13；需未来重开 | 无回写（未来触发） |
| Billing/Archive/event lane | 是 | scope/flow/port | 00～03受控重开 | 无回写（future/blocker） |

本表没有`待回写`或`阻塞待确认`状态；“pending/blocked”只描述外部事实，不表示本Step可以私自补充代码契约。

## 7. Step15门禁与回填草稿

Step15可以装配正式04，前提是：

- §1～§15每章都有对应中间产物路径和延伸阅读说明。
- 正文只写Step1～13已收口的配置语义；Step14风险原样保留。
- 未生成任何真实配置包、secret、digest、scan、payment、evidence、verdict、signoff或readiness。
- 正式文档状态写`completed / selfcheck_done / stop_review / waiting_user_confirmation`，05仍未授权。

### 进入下一步的条件

Step15装配门禁满足；下一步只做正式文档骨架/分批装配和静态审查，不读取05 SOP。
