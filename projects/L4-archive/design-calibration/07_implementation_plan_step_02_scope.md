# Step 2. 明确实施目标、范围和非范围

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 2\
> 日期：2026-09-14\
> 状态：`completed / p0_vertical_scope_fixed / continue_authorized`

## 1. Step 状态与开工确认

| 项 | 结论 |
|---|---|
| 当前 Step | Step 2：明确实施目标、范围和非范围 |
| 输入 | Step 1；正式 `00～06`；03/04/05/06 的范围与完成上限 |
| 输出 | P0/P1/P2 实施范围矩阵、非范围/禁止清单、阶段防漂移约束 |
| gate_status | `pass`（实施计划可继续；不授权代码/测试/commit） |
| gate_reason | 目标围绕 Archive 归档/恢复纵切固定；本地可落码面、外部 blocked seam、P1/P2 后置面和禁止 owner truth 已分离 |
| next_allowed_action | `create_and_complete_step_03_prerequisites_reading` |

## 2. Step 内计划

- [x] 读取 Step 1、正式 00～06 及实施计划 Step 2 SOP/规范。
- [x] 从需求/架构/详细设计提取可验证功能增量，区分 P0/P1/P2。
- [x] 登记非范围、禁止实现和 blocker 对 phase 的影响。
- [x] 完成范围防漂移、取舍、回填草稿和自检。

复杂度判断：范围可用单一矩阵收敛；不按对象拆附录，具体对象/字段仍回指 03。

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 本轮核心实施目标是什么？ | 形成可验证的 Archive-owned request/job、source capture、Bundle closure、assessment、placement/lifecycle、restore handoff 和 safe query 纵切；保留 owner-specific formal seam。 | 00 §4/§7/§9；03 §2 |
| P0/P1/P2 如何划分？ | P0 是本地契约/不变量/入口/一致性/安全/证据边界及 required formal seam；P1 是选定 provider/SDK/product 组合；P2 是 workload/容量/RTO/RPO/长稳/DR 等量化面。 | 05 §2；06 §2/§9 |
| 哪些下游只验接缝？ | L1 truth owner、governance、artifact、workspace、observability、Bus、storage/integrity/KMS/compression、restore receiver 只验正式合同和 Archive 侧行为。 | 01 §5；03 §3/§17 |
| 哪些内容不能进入实施？ | owner 业务真相、治理决策、Artifact 正文、observability backend、event producer/outbox、SDK client/cache、UI、provider 产品选择和 direct DB write。 | 00 §4/§11；01 §4；03 §2 |
| 哪些能力是完整验收前置？ | 逐 source authority、manifest exact closure、integrity/compatibility、storage/governance finality、per-owner receiver、durable UoW/codec/cursor 和 evidence chain。 | 06 §4～§11/§13 |
| 如何防止阶段越界？ | 每个 phase 以一个可验证纵切命名；boundary 列 allowed/forbidden scope，开工前复核不引用后续 phase 结果；未闭合即 `blocked/wait_design`。 | 实施计划 SOP §2.6/§2.10 |

## 4. 当前材料问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 旧 README/材料偏向固定 S3/Glacier、PostgreSQL、期限/性能 | 会把未授权产品选择带入实施 | 全部排除为 historical；只保留 provider-neutral seam |
| `03` 同时包含 local closed 与 external blocked 面 | 若不区分会误开工或误称完成 | P0 范围保留 requiredness，phase 以 local/controlled/formal lane 分层 |
| 归档六 CP 容易被误写成六个服务仓 | 破坏 03 六 crate 与业务/实现正交轴 | 采用 6 role crate、6 CP 作为功能轴，不创建 CP 仓 |
| 测试/验收分母较大 | 可能把测试方案复制到计划 | 只引用 exact TC/EV/AC/VETO 和阶段门禁，不复制用例正文 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 实施组织 | 仅有 03 handoff 的未来提示 | 以功能纵切和可验证阶段为主轴 | 符合实施计划规范 |
| P0 | local 与 external 面混在一起 | P0 required lane + local/controlled/formal 状态分离 | 保留正式接缝 requiredness |
| P1/P2 | 容易成为默认承诺 | 明确后置、独立 baseline/run、不得替代 P0 | 防止 readiness 漂移 |
| 非范围 | 文字散落各文档 | 集中列出 owner truth、provider、UI/SDK 等禁止面 | 便于 Scope Gate |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按 CP1～CP6 各建 crate | 直观 | 将业务轴误当部署/代码边界，扩大依赖面 | 不采用 |
| 按文件/对象顺序实施 | 易列任务 | 无法形成可验证功能增量，测试后置 | 不采用 |
| 先本地机制、再受控接缝、最后 formal | 能在 blocker 下推进可验证设计面，证据上限清楚 | 外部 positive 仍等待 owner | 采用 |
| 删除 blocked P0 以缩短计划 | 文档短 | 破坏 requiredness、掩盖完整验收缺口 | 禁止 |

## 7. 结构化中间产物

### 7.1 实施目标矩阵

| 目标 | P0 可验证增量 | 主要 Phase | 当前上限 |
|---|---|---|---|
| 请求与作业协调 | request/job/stage 的 admission、幂等、阶段边界 | PH-02/03 | 只证明 Archive local truth，不代表业务批准 |
| 逐 source 采集 | per-source binding/capture/coverage/finding、partial/stale/missing/conflict | PH-04/08 | formal owner/export 缺失则 blocked |
| Bundle 闭包 | immutable manifest revision、declared/actual exact set、closure finding | PH-02/04 | 不由 storage/verification 反推 closure |
| integrity/compatibility | fixed input assessment、Unknown/Unsupported/IntegrityFailed | PH-05/08 | 算法/KMS/schema owner 未闭合则 blocked |
| placement/lifecycle | intent/ACK/commit/probe/decision/hold 分轴 | PH-06/08 | 不选择 provider/tier/retention/delete |
| restore | frozen plan、per-owner item/material/handoff/outcome/compensation | PH-07/08 | 不写 owner DB，不推导 restored |
| safe query | 5 Query、visibility、provenance、cursor/zero-write | PH-03/07 | cursor/visibility formal 缺失则 blocked |
| evidence | raw→suite→EV→report→acceptance 单向链 | PH-07/08 | 当前无真实 evidence |

### 7.2 P0/P1/P2 范围与防误入

| 层级 | 纳入内容 | 启用条件 | 当前状态 |
|---|---|---|---|
| P0 | 6 crates；26 objects；8 services；7 port families；3C/5Q/5E/17J；18 states；UoW/IDEM/CONC/EFFECT；config/redaction/dependency/evidence boundary | 03/04/05/06 已停审；每 boundary 复核 | planned；未实现 |
| P0 formal seam | 8 source authority、governance/storage/integrity/receiver/Bus/durable required lanes | target contract/version/fence/coverage/binding/finality + real run | blocked |
| P1 | selected storage/integrity/KMS/compression/SDK/product compatibility、hardening | 具名 scope、target baseline、独立 run | not selected/pending |
| P2 | workload、容量、时延、RTO/RPO、长稳、跨区/DR、retention operations | authority、方法、阈值、环境与 owner | blocked/not_run |

### 7.3 非范围与禁止实现

| 禁止面 | owning project / 文档 | 计划处理 |
|---|---|---|
| identity/conversation/work/process/project truth、archived/dissolved/restored | 各 L1 owner | 只接收 approved material/ref/receiver seam |
| RetentionPolicy、legal hold、delete、risk acceptance | `L1-governance`/正式 owner | 只绑定 decision/ref，执行缺失时 fail-closed |
| Artifact 正文/血缘、observability backend/audit chain | `L1-artifact`、`L4-observability` | 只保留获准 material/ref |
| workspace canonicalization | `L1-workspace` | projection 永远 `Auxiliary` |
| event producer/outbox/publisher、Bus delivery truth | `L0-bus`/owner | 只做 inbound seam/absence check；`AR-HLD-Q-001` 前不发送 |
| SDK client/cache、产品 UI、marketplace/runtime/tools/sandbox | 相邻产品/基础设施项目 | 不创建代码或 package 依赖 |
| storage provider、KMS/secret truth、算法/压缩/schema registry | 外部 owner | 只定义 adapter slot 与 typed outcome |

## 8. 回填草稿

正式 §2 应固定六类 Archive 纵切目标、P0/P1/P2 分层和非范围表；明确 P0 formal seam 即使 blocked 也不能删减，fake 只用于 local/negative/controlled，P1/P2 必须独立 baseline/run，所有 owner truth、SDK/UI/provider 和 outbox 均禁止进入。

## 9. 待确认、上游影响与事实边界

| 事项 | 影响 | owner/截止点 | 当前姿态 |
|---|---|---|---|
| 18 blocker/pending 的 formal closure | 受影响 phase/boundary 无法正向实现/验收 | 对应 owner；各 boundary 开工前 | open/blocked |
| P1 selected target 与 P2 authority | 不得生成组合或数值结论 | 产品/运维/验收 owner；release scope 前 | pending |
| outbound candidates 是否未来解锁 | 可能回开 02/03/04/05/06 | Archive/Bus owner；解锁前 | blocked，当前完全不存在 |

本 Step 未改变任何上游正式文档；仅把已确认范围转译为实施计划输入。

## 10. 自检与进入下一步条件

- [x] 目标按可验证功能增量表达，未按对象/文件拆阶段。
- [x] P0/P1/P2、formal seam 与非范围边界可判定。
- [x] 18 blocker/pending 保留 requiredness，未用 fake/fallback 关闭。
- [x] 未新增需求、对象、协议、状态、provider 或数值。
- [x] 连续授权允许 Step 3；实现/测试/commit 仍禁止。
