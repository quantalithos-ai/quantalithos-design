## Step 14. 整理正式概要设计文档

### 1. Step 状态

- 状态：`formal_stop_review`（装配后复核已完成，等待用户明确授权进入 03）
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 14
- 回填目标：重建 `projects/L5-console/02-概要设计.md` §1～§14

#### 1.1 Step 内计划

- [x] 读取 Step 1～13、正式 00/01、概要设计 SOP/书写规范和项目/文档台账
- [x] 确认项目级、文档级、Step 级门禁允许 Step 14 正式装配
- [x] 建立 14 章回填映射、术语表、交叉引用和历史污染排除清单
- [x] 删除旧正式 `02-概要设计.md`，重建新版 14 章骨架
- [x] 分批回填 §1～§14，每章添加具体校准来源和延伸阅读
- [x] 审计对象/接口/处理流/状态/异常/配置/承接/风险的一致性
- [x] 审计旧 Provider Contract、固定数字、技术框架、私有 API/DB/bus 和 owner truth 未回流
- [x] 更新本文、flow 和 project ledger 为 `formal_stop_review`，立即停止，不进入 03

### 2. 本步输入

- `design-calibration/02_hld_step_01_upstream_boundary.md` 至 `02_hld_step_13_risks_open_questions.md`
- `design-calibration/02_hld_calibration_flow.md`
- `design-calibration/project_execution_ledger.md`
- `projects/L5-console/00-需求文档.md`
- `projects/L5-console/01-架构设计.md`
- `standards/document/概要设计讨论流程_SOP.md`
- `standards/document/概要设计书写规范.md`

### 3. SOP 问题回答

1. **已确认结论如何回填？**

   Step 1～13 依次回填正式 §1～§13；§14 只列实际使用的正式上游、标准和 calibration 入口。Step 4～9 的重内容从结构化中间产物摘取收口表/图，不复制诊断、方案比较和停审记录。

2. **哪些结论需要跨章吸收？**

   Truth/SDK-only/forbidden-body/permission/result/unknown/owner-partition/a11y 既出现在约束，也必须在对象、接口、流、状态、异常、配置和风险章保持同一语义；每章只写该章节结构职责，不重复论证。

3. **术语和编号如何统一？**

   正式标题固定为 14 章；业务主语使用五个“主要组成部分”；实现层使用 Inbound/Operations、Application Services、Domain/Policy、Ports/Adapters/state carrier；对象、接口、流和状态沿 Step 6～9 名称；风险使用 `HLD-RISK-CON-*`，待确认沿用 `CON-Q-034～047`。

4. **哪些继续保留为风险/待确认？**

   Step 13 的全部 open 项必须原样保持，不将 `pending/blocked/read-only/partial` 润色为 active/integrated/ready。正式文档可声明安全骨架完成，但不能声明实现、集成、测试、证据、signoff 或 readiness。

5. **哪些细节仍留给详细设计？**

   完整 schema/DTO/trait/struct、protocol path、错误码、函数实现、组件/route/store、缓存/并发/取消、配置项、测试矩阵和部署细节均不进入正式 02。

6. **实际参考材料是什么？**

   仅正式 00/01、产品/架构/全局规则、L0 SDK 与指定 L1～L4 owner 当前正式文档、文档标准、Step 1～13 calibration；历史 README/旧 02/draft 只在污染审计中使用，不列为正式 truth 参考。

### 4. 当前文档问题诊断

| 旧正式 02 问题 | 装配修正 |
|---|---|
| 旧 7 章/页面导向结构不符合新版 14 章主链 | 完全删除并按 §1～§14 重建 |
| `ConsoleWorkspace`、`PanelState`、`UnifiedDashboard`、`PermissionHint` 容易成为第二 truth/权限 | 使用 Step 6 正式对象和 guard/view/ref 边界 |
| chat/runtime 等外部系统被当 Console 模块 | 改为 owner-specific formal ports/adapters 或 pending link/ref |
| Provider Contract、旧 API/path/DTO、固定框架和固定数字无 authority | 全部排除，exact contract/量化保持 open |
| action/toast/refresh 与业务完成混淆 | 使用 draft/request/receipt/result/unknown 分层 |
| 统一 dashboard/green 状态压平 owner 多轴 | 保留 source/freshness/coverage/availability/consistency 和局部降级 |
| 缺少对象字段类型、函数参数、接口、处理流、状态机和配置承接 | 从 Step 6～12 装配可落码骨架 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| 文档结构 | 旧产品说明/架构混合 | 新版概要设计 14 章主链 |
| 真相边界 | 页面对象可能承载业务/权限语义 | 仅客户端 interaction truth + owner-safe view/ref |
| 可落码性 | 模块与交互概述 | 主体、对象、接口、流、状态、异常、配置、03 承接 |
| 接口成熟度 | 历史合同/技术调用近似既成事实 | 能力级 skeleton + pending/blocked/read-only/partial |
| 风险诚实 | 固定指标/技术栈/可用性假设 | 无 authority 不写数字，不声明实现/验证/ready |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 在旧 02 上逐段修补 | 修改量小 | 旧结构和污染继续约束新文档 | 不采用 |
| 将 Step 文件全文拼接为正式文档 | 信息完整 | 过程材料、重复和讨论噪声过多 | 不采用 |
| 删除旧文件，按 14 章从回填草稿/结构化结论重新装配 | 可追溯、边界清晰、满足 full-restart | 需要分批装配和总审计 | 采用 |

### 7. 结构化中间产物

#### 7.1 章节回填映射

| 正式章节 | 主要校准来源 | 装配内容 |
|---|---|---|
| §1 与上游关系 | Step 1 | 上游映射、不再回答/必须回答 |
| §2 目标与范围 | Step 2 | 目标、非范围、设计深度 |
| §3 约束 | Step 3 | 结构性硬约束 |
| §4 代码主体框架 | Step 4 | 两张图、关系表、关键判断 |
| §5 主要组成部分 | Step 5 | 五部分总表、能力/主体/边界/接缝、对象发现 |
| §6 关键对象 | Step 6 | 候选筛选、关键对象卡、反查 |
| §7 API / 接口 | Step 7 | 分类、Command/Query/Event/Job、port 边界 |
| §8 关键处理流 | Step 8 | 通用流与九组关键流/覆盖 |
| §9 状态 | Step 9 | 状态归属、定义、迁移、传播 |
| §10 异常 | Step 10 | 异常表、四张影响图、恢复映射 |
| §11 配置影响 | Step 11 | 影响表、不可配置红线、03/04 承接 |
| §12 详细设计承接 | Step 12 | 稳定主语、继续展开、回退规则 |
| §13 风险与待确认 | Step 13 | 风险表、`CON-Q-034～047`、blocker |
| §14 参考 | Step 1/13/14 | 实际正式参考和 calibration 追溯入口 |

#### 7.2 正式写入前三层门禁

| 门禁 | 状态 | 理由 |
|---|---|---|
| 项目级 | `pass` | 用户已授权完成全部 02；项目恢复点为 Step 14 formal assembly。 |
| 文档级 | `pass` | Step 1～13 均 `done/pass`；flow 明确 Step 14 可删除旧 02 并重建。 |
| Step 级 | `pass` | 本文件已建立映射、术语、污染排除和装配计划；只允许重组已确认结论。 |

#### 7.3 术语与历史污染排除清单

- 只使用五个主要组成部分和 Step 6～9 收稳主语；旧页面名不升级为对象。
- 不写 React/Svelte/Tailwind/组件库、Provider Contract、HTTP/RPC path、旧 DTO/DB/private bus。
- 不写固定控制项/指标数量、首屏/P95/SLA/availability、timeout/retry/page/concurrency 数字。
- 不写 Console BFF、worker、projection、cursor/replay/rebuild、outbox 或业务数据库。
- 不把 route/menu/button/cache/toast/transport success/feature flag/mock 当权限、结果、审计、evidence 或 readiness。
- 不把未停审 L5/L6 私有状态、页面或 API 当本仓真相。

### 8. 回填草稿

按 §7.1 创建正式 14 章；每章开头列出具体 calibration 文件，并引导阅读“结构化中间产物”“回填草稿”“待确认事项”。正式正文只保留收口结论，过程诊断、取舍、停审、门禁和历史污染明细留在 calibration。

### 9. 待确认事项

- Step 13 全部待确认继续 open；装配不得改变状态。
- 正式 02 完成后立即 `formal_stop_review`；未经用户明确授权不得创建/进入 03 calibration 或修改正式 03。
- 本轮不提交 commit，不运行实现测试，不生成任何实现/验证/evidence/readiness 事实。

### 10. 装配后总审计结果

| 审计项 | 结果 | 说明 |
|---|---|---|
| 14 章顺序 | `pass` | 正式文档保持 §1～§14 主链，未混入过程章节。 |
| 来源追溯 | `pass` | §1～§14 均有对应 calibration 来源块或明确参考入口。 |
| §5 / §6 对象粒度 | `pass` | 五个主要组成部分与 §6 正式对象均已逐项成节；适用的字段、状态、成员/工厂函数与禁止事项齐全，省略项有逐名说明。 |
| 接口、处理流、状态交叉引用 | `pass` | §6 对象、§7 接口、§8 处理流和 §9 状态已逐名反查；四类状态轴/阶段集合与 Step 9 语义一致。 |
| 历史污染 | `pass` | Provider Contract、固定数字、技术框架、私有 API/DB/bus、旧页面模型未回流。 |
| owner truth 与 forbidden body | `pass` | 未引入 owner aggregate、业务正文、credential、授权证明、audit/evidence/report 或执行正文。 |
| unknown / reconciliation | `pass` | 无正式回查/幂等依据时保持 unknown/blocked，不自动重放。 |
| 权限与可访问性 | `pass` | visibility/qualification 只能收紧；键盘、焦点、播报和非颜色路径共享正式语义。 |
| 事实诚实 | `pass` | 未声明实现、集成、baseline、commit、测试、artifact、report、evidence、verdict、signoff 或 readiness。 |

`CON-Q-034～047` 继续保持 `open/pending`，并按 Step 13 的阻塞范围传递到后续详细设计、配置、测试、验收或正向 activation；本审计不关闭这些问题。

### 11. 完成门禁

- [x] 正式 02 已按 14 章重建且每章有具体 calibration 来源和延伸阅读
- [x] 对象/接口/处理流/状态/异常/配置/承接/风险主语和交叉引用一致
- [x] 历史污染、owner truth、权限、结果、forbidden-body、unknown、a11y 和量化审计通过
- [x] Step 14、flow、project ledger 已更新为 `formal_stop_review`
- [x] 未进入 03、未提交 commit
