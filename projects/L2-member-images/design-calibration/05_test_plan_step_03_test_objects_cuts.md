# L2-member-images 05 测试方案 Step 3：测试对象与测试切口

> 状态：`completed`
> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 3
> 回填位置：正式 `05-测试方案.md` 第 3 章

## 0. Step 状态与输入

| 项目 | 记录 |
|---|---|
| 本步目标 | 从 03/04 抽取对象、函数、协议、状态、store、配置和观测切口，形成可分层验证的最小入口。 |
| 本步输入 | Step 2；03 §4~§16、Step 6~17；04 §3~§14；L1-governance 的逐模块粒度仅作格式参照。 |
| 本步输出 | 七模块切口表、协议入口表、状态/一致性/边界切口表。 |
| gate_status | `pass_with_explicit_blockers` |

## 1. SOP 问题回答

| 问题 | 收敛回答 |
|---|---|
| 测试对象如何组织？ | 先按七模块，再按对象/协议/状态/一致性/配置/观测切口；不按旧主流程或部署服务罗列。 |
| 每个 P0 对象的最小证据是什么？ | 至少一个正向或既有读取样本、一个负向/边界断言、一个固定证据规划；当前不填写实际结果。 |
| 如何覆盖所有 logical surface？ | 10 Command、10 Query、2 inbound、6 Job 逐项映射；outbound 用零库存审计。 |
| 如何处理状态矩阵？ | 覆盖 19 个状态矩阵、20 个 local lifecycle subject 的合法主线、边界、非法迁移和 terminal/replacement；当前写路径阻断单独断言。 |

## 2. 七模块测试对象与切口

| 模块 | 对象/函数 | P0 测试切口 | 推荐层级 | 关键风险 |
|---|---|---|---|---|
| `contracts` | typed refs、metadata、Command/Query/Inbound/Job DTO、view/error | roundtrip、required field、canonical name、未知 schema/enum 拒绝 | Unit/Contract | 裸字符串、body、错误映射漂移 |
| `domain` | definition、assembly、build、qualification、supply、reference、guards、history、states | factory/invariant、状态矩阵、pin/static-live、append/supersede、非法 transition | Unit | 第二 truth、状态合并、原地覆盖 |
| `application` | facade、coordinator、query service、UoW、idempotency、ports | command/job zero-effect seam、query no-write、ordering、duplicate/conflict、commit unknown | Service | UoW 顺序和 replay 误算 |
| `infra` | config、runtime builder、repositories、projection/idempotency store、adapters、fakes | strict JSON、21 key、source priority、fake parity、failure mapping、dependency cut | Integration/Config | fallback、secret泄露、外部 ACK 伪成功 |
| `api` | command/query handlers、mappers、entry errors | logical DTO mapping、missing metadata、view/content-state、no direct write | Contract/Entry | transport 绑定或 handler 越权 |
| `worker` | 两条 conditional inbound marker boundary | unavailable/rejected/reopen_required、`accepted_input=false`、无 envelope/receipt/dedup | Entry/Service | 事件未闭却误写 BuildIntent |
| `jobs` | 6 bounded action runners | explicit scope/page、B01/B02 stop、no scheduler/run/report、no truth repair | Service/Entry | 全表扫描、job 反写真相 |

## 3. 协议与状态切口

| 协议族 | 数量 | 入口与最小断言 |
|---|---:|---|
| Command | 10 | 每项 required metadata、canonicalization stop、未来 accepted 模板、duplicate/version conflict；当前无 mutation |
| Query | 10 | hit/missing/not-visible/degraded/stale/failed/empty；绝对无 UoW、reserve、save、adapter call |
| Conditional inbound | 2 | marker-only，`accepted_input=false`，unsupported/unavailable/reopen，不 parse body |
| Operations Job | 6 | action marker、explicit page/exact target、duplicate/partial/blocked；当前 B01/B02 stop |
| Outbound | 0 | `NoneAuthorized`，无 DTO、outbox、publisher、delivery 或 retry job |

状态族切口：DefinitionAssembly、BuildCandidate、Qualification、SupplyEntry、ReferenceDerived、Idempotency、InboundContractMarker。每个状态使用 03 正式 enum；不得新增 `Ready/Published/Running/Delivered` 等口语状态。

## 4. 改动前后对比、取舍与结构化产物

旧 05 以组件/工具/seed 大功能块为单位，无法覆盖协议和状态边界；本轮用“模块→对象→切口→风险→层级”五列锁定切口，避免遗漏 query no-write、config 和 redaction。结构化产物即上面两张表及 `TC`/`EV` 规划入口，后续 Step 6~13 分别补用例、数据、环境和证据。

## 5. 回填草稿（正式 §3）

正式第 3 章应列出七模块测试对象、10/10/2/6/0 logical surface、19 状态矩阵、一致性/幂等/配置/观测/依赖边界切口，并为每个切口标注 03/04 的具体来源与推荐层级。所有当前 blocker 必须显示为 negative/no-write 或 future reopen，不得改写成已执行。

## 6. 待确认事项与进入下一步条件

待确认项包括 `PF-UNAVAILABLE-RECOVERY`、B01/B02、MI-UP/Q-MI 以及未来 owner 的 exact schema。只要每个 P0 对象有正式来源、切口、风险、层级和下游证据规划，即可进入 Step 4 制定分层策略；未确认事项不阻塞负向切口设计。
