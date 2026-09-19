# Step 19. 整理正式详细设计文档

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 19  
> 正式输出：`projects/L5-console/03-详细设计.md`  
> 配套审查：`design-calibration/03_ddd_step_19_granularity_review.md`  
> 粒度参考：`projects/L1-governance/design-calibration/03_ddd_step_19_formal_document_assembly.md`  
> 状态：`done / formal_stop_review / self_reviewed`

## 1. 目标与装配边界

本 Step 将 Step 1～18 的已确认结论装配为正式 18 章 `03-详细设计.md`，并从 Step 5 开始对模块、对象、port、protocol、flow、state、consistency、error、concurrency、binding、diagnostics、tests、handoff 和 risks 做最终粒度审查。

正式正文是实现阅读入口，不复制 calibration 的讨论过程。字段级 TypeScript contract、完整 port signature、逐接口分支和逐状态矩阵仍以对应 Step 文件为必读来源；摘要不足或来源仍 blocked 时必须暂停，不能由实现者补 schema。

## 2. 三层写入前检查

| 门禁 | 检查 | 结果 |
|---|---|---|
| 项目级 | `project_execution_ledger.md` 当前 Step=19、gate=in_progress、正式 03 仅 Step19 可写 | pass |
| 文档级 | `03_ddd_calibration_flow.md` Step 1～18 全部 done/pass，Step19 in_progress | pass |
| Step级 | Step 18 风险已完成；本文件与粒度审查文件先于正式正文创建 | pass |
| 授权 | 用户已要求完成全部 03，并要求审查从 Step 5 开始 | pass |
| 范围 | 只改 `projects/L5-console/`，不进入 04、不实现、不测试、不提交 | pass |
| 事实 | 目标实现仓 not_created；无 baseline/run/artifact/report/evidence/readiness 可写 | pass |

写入前检查结论：允许全量替换旧 historical `03-详细设计.md`。不允许沿用旧章节、Rust/API/DB/projection/Provider、固定数字、框架或指标阈值。

## 3. 输入状态

| 输入 | 状态 | 正式章节 |
|---|---|---|
| Step 1～4 | done/pass | §1～§4 |
| Step 5～7 | done/pass | §5～§6 |
| Step 8 | done/pass | §6～§7 |
| Step 9 | done/pass | §8 |
| Step 10 | done/pass | §9 |
| Step 11～15 | done/pass | §10～§14 |
| Step 16～18 | done/pass | §15～§17 |
| Step 19 | done/formal_stop_review | §18、装配/审查状态 |

## 4. 18 章装配策略

| 正式章节 | 校准来源 | 收口重点 |
|---|---|---|
| 1 上游关系 | Step 1 | 正式 00/01/02、历史隔离、继续展开边界 |
| 2 目标范围 | Step 2 | fail-closed client contracts 与非范围 |
| 3 实现约束 | Step 3 | TypeScript/ESM、SDK-only、pending技术选型 |
| 4 布局 | Step 4 | planned/not_created repo、feature-oriented tree |
| 5 模块契约 | Step 5～7、16 | 十模块逐模块职责/文件/对象/port/函数/error/test |
| 6 全局索引 | Step 6～8 | 对象、port、protocol 逐名索引，不新增设计 |
| 7 协议 | Step 8 | 5 Command、16 Query、1 conditional consumer；0 Event/Job |
| 8 Flow | Step 9 | 每协议调用链、副作用、no-write/unknown |
| 9 State | Step 10 | 客户端状态族、合法/非法、formal-only positive recovery |
| 10～14 | Step 11～15 | carrier、一致性、错误、并发、配置、诊断/audit boundary |
| 15～17 | Step 16～18 | 最小测试、实施承接、风险/pending |
| 18 参考 | Step 19 + 已读标准 | 正式输入与逐 Step 索引 |

## 5. 装配红线

- 正式第 5 章必须以 `entry/access/navigation/views/intent/features/recovery/adapters/state/diagnostics` 十模块为主轴。
- 第 6 章只索引，不新增对象、port 或 protocol。
- local protocol 与 owner formal protocol 分离；不发明 HTTP/RPC/path/topic/error code。
- 只有 `OwnerCommandPort.submit` 是 owner side effect；Query zero-write；consumer 当前 disabled。
- persistence 只写 scoped client carrier；DB/repository/UoW/outbox/projection明确 N/A。
- diagnostics 不写成 audit/evidence/report/verdict/readiness。
- pending/blocker 保真；不以 fake、SDK package 存在或 UI 状态关闭问题。
- 不把完整测试计划、验收门禁、phase/commit、配置文件或运维阈值放进 03。

## 6. 正式写入批次

| 批次 | 内容 | 状态 |
|---|---|---|
| 19.1 | 本文件、粒度审查骨架、三层写入前检查 | done |
| 19.2 | 正式 §1～§4 | done |
| 19.3 | 正式 §5～§6 | done |
| 19.4 | 正式 §7～§10 | done |
| 19.5 | 正式 §11～§18 | done |
| 19.6 | 从 Step 5 开始的粒度/污染/事实审查和回改 | done |
| 19.7 | flow/ledger `formal_stop_review` | done |

## 7. 完成门禁

正式 18 章、每章校准来源与延伸阅读、十模块主轴、5+16+1 协议、状态/一致性/错误/测试切口、Step 5 起审查、历史污染和事实诚实已全部通过。审查中回改了 Step 4 的完整 Port 文件落点、Step 16 两处 invalidation blocker 误引、Step 8/9 的 `SdkInvalidationPort.observe` 命名漂移、正式 §5 的函数名称压缩表达、正式 §8 的八个 Topic Query flow 逐名清单，以及 Step 18 已关闭的 Step 19 风险状态。

Step 19 结论：`done / pass / self_reviewed / formal_stop_review`。正式 `03-详细设计.md` 已重建；立即停止，不创建或进入 04，不提交 commit。
