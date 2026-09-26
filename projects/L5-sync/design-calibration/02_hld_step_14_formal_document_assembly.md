# Step 14. 整理正式概要设计文档

## 1. Step 状态与计划

- 模式：`full-restart + single-agent-serial`；Step 1~13 均已通过，`SYNC-UP-001~010` 仍为 `pending/blocked`。
- 状态：`completed / formal_stop_review`；`02-概要设计.md` 已完成 full-restart 装配与最终静态审计。
- 本步只重组、润色、统一术语/编号/引用与执行静态审计，不新增对象、接口、flow、state、risk 或配置结论。

### Step 内计划

- [x] 回读项目台账、02 flow、Step 1~13 与概要正式 14 章规范。
- [x] 建立章节—Step 来源映射、术语/编号规范与装配前 source audit。
- [x] 删除旧正式 02，创建 14 章新骨架；按章节分批回填且每章列具体 calibration 来源/延伸阅读。
- [x] 执行结构、来源、ownership、对象/API/flow/state、blocker、forbidden fact 与 historical pollution 静态审计。
- [x] 更新本文件、flow、项目台账为 `formal_stop_review`，立即停止，不进入 03。

## 2. 本步输入

`02_hld_step_01_upstream_boundary.md` 至 `02_hld_step_13_risks_open_questions.md`、`02_hld_calibration_flow.md`、项目台账、正式 00/01 和概要书写规范。旧正式 02 仅作为已登记污染样本，不作为装配来源。

## 3. SOP 问题回答

1. Step 1→§1，Step 2→§2，Step 3→§3，Step 4→§4，Step 5→§5，Step 6→§6，Step 7→§7，Step 8→§8，Step 9→§9，Step 10→§10，Step 11→§11，Step 12→§12，Step 13→§13；本 Step→§14/元信息/停审声明。
2. Hard constraints、blockers 和 ownership 会在相关多章就地出现，但以各 Step 稳定表为唯一内容来源，不机械复制全部过程记录。
3. 统一 `Selection & Access` 等五部分、29 对象、正式 API 名、`SYNC-UP-001~010`、`blocked/unsupported/needs-action/probe-required` 和 owner 名称。
4. 所有未闭合合同保持风险/待确认与路径门禁，不润色为 available/implemented/verified/ready。
5. 函数完整签名、物理 schema、协议 payload、配置 key/default、测试 case/result、实现/commit/evidence 全部留在正式 02 之外。
6. 参考仅列实际使用的正式基线、标准、专项上游与本轮 calibration；README/旧正式/draft 只在历史边界说明，不作为正式设计 authority。

## 4. 当前文档问题诊断

旧正式 02 为 662 行跨 chat/console/runner 的统一同步器设计，包含 `SyncTask`、fanout/replay/resync、旧接口/状态/指标，与正式 00/01 及 Step 1~13 全链冲突。必须删除后按新骨架重建，不能复用旧章节或局部 patch。

## 5. 改动前后对比

| 改动前 | 改动后目标 |
|---|---|
| 跨端同步任务与旧五部分 | 平台—本地 working-copy 受控入口与当前五部分 |
| `SyncTask`/fanout/replay 主语 | 29 local objects、typed interfaces、18 key flows、多轴状态 |
| 固定 SLA/RPC/技术选择 | blocker-aware planned contracts，无实现/指标伪造 |
| 缺少具体 calibration 来源 | 每章具体 Step 文件 + 延伸阅读入口 |

## 6. 设计取舍

采用完整 14 章正式主链；对象和关键流保持可落码粒度，即使正文较长也不压缩掉 typed fields/functions、状态/禁止迁移或 blocker。过程诊断、逐模块思考和全部停审表保留在 calibration，正文只摘录审定结构。

## 7. 结构化中间产物

### 7.1 章节装配映射

| 正式章节 | 主要来源 | 装配内容 |
|---|---|---|
| §1 上游关系 | Step 1 | 来源映射、不再/必须回答、完成上限 |
| §2 目标范围 | Step 2 | 目标、范围、非范围、深度 |
| §3 约束 | Step 3 | 22 hard constraints 与部分映射 |
| §4 代码主体 | Step 4 | 两张必需图、分层、主体清单 |
| §5 组成部分 | Step 5 | 总表、capability、五部分边界/接缝、交互图 |
| §6 关键对象 | Step 6 | 29 对象六段骨架、筛选与审计 |
| §7 API | Step 7 | CLI、Command/Query/Consumer/Job/Ports |
| §8 处理流 | Step 8 | 通用骨架、18 关键流与覆盖 |
| §9 状态 | Step 9 | 多轴归属、五部分图、允许/禁止迁移、传播 |
| §10 异常 | Step 10 | 40 场景与异常影响图 |
| §11 配置 | Step 11 | 影响/禁止配置化/交接方向 |
| §12 03 承接 | Step 12 | 17 交接、测试切口、回退规则 |
| §13 风险 | Step 13 | 14 风险、10 pending、完成上限 |
| §14 参考 | Step 14 + actual sources | 实际使用材料与用途 |

### 7.2 装配门禁

| 门禁 | 要求 |
|---|---|
| 来源 | 每章列具体 Step path 和延伸阅读小节 |
| 正式结构 | 恰好 14 个主章节，另可有元信息/停审声明 |
| 对象 | 29 对象每个独立成节且保留六类信息 |
| 接口/流/状态 | 名称和归属与 Step 7~9 一致，无临时新增 |
| truth | Project/Artifact/Baseline/Gate/Workspace/Archive/Git remote ownership 不转移 |
| blockers | `SYNC-UP-001~010` 全部保持 pending/blocked |
| forbidden facts | 不声明实现、commit、run、测试、artifact、report、evidence、verdict、signoff、readiness |
| historical pollution | 不继承 SyncTask/fanout/replay、Rust/Tauri、固定 metadata.json、LFS/shallow/GUI、固定 SLA |

### 7.3 装配前源审计

- Step 1~13 文件均存在且各自 `pass_with_upstream_blockers`。
- Flow/项目台账当前指向 Step 14，正式写入仅限本 Step。
- 正式 00/01 保持 `formal_stop_review`，本轮不修改。
- 29 对象、四 CLI、conditional consumers/no outbound event、18 key flows、17 lifecycle states、40 exceptions、15 non-configurable boundaries 与 10 blockers 均有唯一中间产物来源。

## 8. 正式回填结果

已按 §7.1 映射 full-restart 创建正式正文，未从旧 02 复制设计结论。正式 14 章均使用“校准来源 / 延伸阅读”前缀，并以 planned design contract / not implemented 元信息限制事实解释。

## 9. 待确认事项

`SYNC-UP-001~010` 原样进入正式 §13 并在相应章节就地标注。它们不阻止文本装配，但阻止对应正向 detailed-design/implementation readiness。

## 10. 最终静态审计与停审结论

| 审计项 | 结果 |
|---|---|
| 正式结构与来源 | pass；正式正文恰好为 §1~§14，14 章各有具体 calibration 来源与延伸阅读。 |
| 对象轮廓 | pass；29 个关键对象均独立成节，分别具备基本信息、typed 关键字段、状态集合、typed 成员函数、工厂函数和禁止事项，共 174 个对象子项。 |
| 接口、处理流与状态 | pass；四个 P0 CLI、Command/Query/conditional Consumer/Operations Job/Ports 均有 typed 骨架；四类通用路径、18 个关键流和 17 个 local lifecycle 对象齐全。 |
| 连续编号 | pass；`EX-SYNC-001~040`、`DDH-SYNC-01~17`、`RISK-SYNC-HLD-001~014` 与 `SYNC-UP-001~010` 无缺号或越界编号。 |
| 图、围栏与链接 | pass；所有 ASCII 图使用成对 `text` fence 且附关键说明；正式正文引用的本地文件均存在。 |
| ownership 与安全边界 | pass；Project、Artifact、Baseline、Review Gate/Decision、Workspace projection、Archive 与 Git remote truth 均未转移；status no-write、no auto Git、no overwrite、ACK/Decision 分层、unknown→probe/manual 与 provenance 保护均保留。 |
| blocker 与历史污染 | pass_with_upstream_blockers；`SYNC-UP-001~010` 全部保持 `pending/blocked`；旧 `SyncTask`/fanout/replay、固定 schema/SLA、Rust/Tauri、LFS/浅克隆/GUI 仅作为 historical/pending 说明。 |
| 事实诚实 | pass；未声称存在实现、commit、run、测试结果、artifact、report、evidence、review verdict、signoff 或 readiness。 |
| 静态格式 | pass；Step 1~13 无 `in_progress` 残留，代码围栏成对，`git diff --check -- projects/L5-sync` 通过。 |
| 下游门禁 | pass；未创建 03 flow、implementation ledger 或 boundary skeleton，未进入实现或测试。 |

终审结论：Step 14 完成，正式 02 进入 `formal_stop_review`。本结论只证明概要设计文本装配和静态一致性通过，不关闭 `SYNC-UP-001~010`，不授权 03；下一动作只能等待用户明确确认后读取详细设计 SOP/规范并建立 03 calibration flow。
