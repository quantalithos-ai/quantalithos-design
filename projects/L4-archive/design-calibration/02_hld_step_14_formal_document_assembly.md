# Step 14. 正式概要设计装配

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；对应概要 SOP Step 14。

- [x] 读取项目 ledger、02 flow、Step 1~13 和概要设计新版 14 章规范。
- [x] 核对每个 Step 的回填草稿、风险上限和正式来源入口。
- [x] 建立章节映射、术语规范和装配前门禁。
- [x] 删除 historical `02-概要设计.md` 并按 14 章整体重建。
- [x] 完成逐章来源、对象/接口/流/状态、引用和污染静态审计。
- [x] 更新 flow 与项目 ledger 为 `formal / stop_review`。

## 2. SOP 问题回答

1. Step 1~13 分别支撑正式 §1~13；§14 只列本轮实际使用的标准、正式文档、专项上游与粒度样本。
2. Step 5 的诊断/停审不进入正文；§5 按 CP 组织。Step 6 的逐 CP 审计不进入正文；§6 按 26 个关键对象独立成节。
3. Step 7 的本地接口名保持稳定；外部 port/event 均加 required/candidate 上限。Step 8/9 只摘录已收稳的主流程、事务切面和状态迁移。
4. `AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002` 必须保留为风险/待确认，不能在装配时润色成正向合同。
5. 不补完整 schema、trait、DDL、重试参数、配置项或实现文件；这些留 03/04。

## 3. 正式章节装配映射

| 正式章节 | 校准来源 | 装配内容 |
|---|---|---|
| §1 | Step 1 | 上游映射、不再回答/必须回答、依赖裁剪、完成上限 |
| §2 | Step 2 | 目标、非范围、深度 |
| §3 | Step 3 | 16 条硬约束 |
| §4 | Step 4 | 六 CP 映射、两张图、三轴判断 |
| §5 | Step 5 | 组成部分总表、对象发现维度、交互图、逐 CP 职责/主体/接缝 |
| §6 | Step 6 | 候选筛选、26 个独立对象卡、辅助类型排除 |
| §7 | Step 7 | 分类、Command/Query/Consumer/Job/required port/outbound candidate |
| §8 | Step 8 | 通用约束、关键处理流、unknown/reconcile/no-write |
| §9 | Step 9 | 多轴状态、允许/禁止迁移、传播关系 |
| §10 | Step 10 | 38 个异常与影响图 |
| §11 | Step 11 | 配置影响、禁止配置化、03/04 分工 |
| §12 | Step 12 | 稳定输入、详细设计深度、回退规则 |
| §13 | Step 13 | 设计风险、待确认、完成上限 |
| §14 | 本 Step | 实际参考材料及用途 |

## 4. 术语与交叉引用规范

- 六个业务组成部分统一为 CP1~CP6；U1~U6 只在架构映射中出现。
- 正式对象使用 Step 6 的 26 个唯一名称；service/port/DTO/provider response 不升格。
- `sealed`、`verified`、`eligible`、`committed`、`retrievable`、`material-ready`、`handoff-complete` 均带对象/轴语境。
- “恢复成功”只允许写 receiver-specific handoff outcome；项目/owner 业务状态始终由 owning domain 决定。
- 正式章节使用 §6/§7/§8/§9 交叉引用，不保留“未来 Step”时态。

## 5. 装配前门禁

| 门禁 | 结论 |
|---|---|
| 项目级 | 用户已授权完成全部 02；只修改 `projects/L4-archive/`；不提交。 |
| 文档级 | Step 1~13 均已落盘并通过静态门禁；正式 02 只在本 Step 重建。 |
| Step 级 | 本文件已先于正式正文创建；章节映射和风险上限明确。 |
| 历史材料 | 旧 02 仅为污染审计输入；允许删除后重建，不做局部继承。 |
| 下一文档 | 完成后必须停审；不得进入 03。 |

`formal_fill_allowed = true_for_reviewed_step_1_to_13_content`。

## 6. 实际参考材料范围

本轮实际使用：本仓正式 00/01 与其校准/台账；概要 SOP/规范及通用设计标准；`L1-workspace` 正式 00~07、ledger、02 校准作为粒度样本；`L1-identity`、`L1-conversation`、`L1-work`、`L1-process`、`L1-governance`、`L1-artifact`、`L4-observability`、`L0-core`、`L0-bus`、`L0-sdk` 的正式文档与必要台账。旧 README/02/03/05/06/draft 仅用于污染审计，不作为正式结论来源。

## 7. 装配后静态审计

| 审计项 | 结果 | 结论 |
|---|---|---|
| 正式结构与追溯 | 14 个正式章节、14 个具体 calibration source block | pass |
| 组成部分与 authority | 六 CP；8 类 source-authority matrix；workspace 永久为 Auxiliary | pass |
| 对象 | §6.2~§6.27 共 26 个独立对象卡，均有类型字段、函数骨架和禁止事项 | pass |
| 接口 | 3 Command、5 Query、5 Consumer、17 Job | pass |
| required/outbound 边界 | 7 个 required/local port；3 个 outbound event candidate，均保留未 ready 上限 | pass_with_blockers |
| 流程与一致性 | fence、fixed revision、local UoW、intent-before-effect、per-owner、unknown reconcile、Query no-write | pass |
| 状态与禁止推导 | 多轴状态完整，局部成功不推导 owner/project truth | pass |
| 异常 | 四组逐项 38 个，编号连续 | pass_after_count_correction |
| 配置 | 17 类影响主体、14 条禁止配置化红线、03/04 分工 | pass |
| 风险 / 待确认 | 11 项风险；`AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002` 共 12 项开放 | pass_with_blockers |
| Markdown / links | 代码围栏成对；正文所有本地链接目标存在；`git diff --check` 通过 | pass |
| historical pollution | provider/SLA/默认期限/cache/replay/治理越权词只在排除、禁止或 blocker 语境出现 | pass |

装配审计修正：Step 10 四组异常实际为 `8 + 11 + 9 + 10 = 38`，早先跨 Step 摘要写成 34。正式装配和后续承接统一采用 38；不改变场景语义。

## 8. 停审结论

正式 `02-概要设计.md` 已按 14 章装配并通过静态审计，`gate_status = pass_with_upstream_blockers`。完成只代表概要设计静态结构收稳；不关闭外部合同，不证明实现、测试、验收或 readiness。

本轮在此 `formal_stop_review`。不得自动进入 03；下一动作是等待用户新的明确授权。未运行项目测试，未实现代码，未提交 commit。
