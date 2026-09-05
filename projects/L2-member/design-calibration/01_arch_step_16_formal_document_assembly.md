# Step 16. 整理正式文档

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 16
> 对应书写规范: `standards/document/架构设计书写规范.md` §4.1~§4.18
> 回填位置: 正式 `01-架构设计.md` §1~§18
> 日期: 2026-08-23
> 状态: `complete; formal_01_stop_review`
> 串行门禁: Step 1~15 已通过;本文件先完成装配前门禁,通过后才允许删除并重建旧正式 01

## 1. 本步边界

本步只把 Step 1~15 已确认结论重组为正式 18 章,统一术语、编号、图表与交叉引用。不得新增架构分析,不得把 pending / blocker 写成合同,不得把 historical material 恢复成当前选择,也不得写入概要、详细、配置、测试或实施层结论。

## 2. 三层装配门禁

| 门禁层 | 检查入口 | 装配前状态 | 判断 |
|---|---|---|---|
| 项目级 | `design-calibration/project_execution_ledger.md` | 当前文档为 01,当前 Step 为 16 allowed,只允许创建 Step 16 并先做 preassembly audit | pass |
| 文档级 | `design-calibration/01_architecture_calibration_flow.md` | Step 1~15 pass,Step 16 `open_for_step_16_preflight`,未来文档仍禁止 | pass |
| Step 级 | 本文件 + `01_arch_step_15_adr_traceability.md` | Step 15 的 D01~09、103 项追溯、漏项和跨审计均 pass | pass |

门禁效力:

- 本节通过前旧正式 `01-架构设计.md` 仍是 historical material,禁止修改。
- 本节与第 3~8 节通过后,允许删除旧正式 01 并从空文件按 18 章重建。
- 正式装配权限不授权新增决定、进入 02、实现代码、修改兄弟目录或提交 commit。

## 3. 强制架构单元停审复核

| 必审 Step | 必审对象 | 已停审范围 | 结果 |
|---|---|---|---|
| Step 5 | 限界上下文 | BC-L2M-01~07 逐项停审 + 跨语义边界审计 | pass |
| Step 7 | 依赖方向 | BC01~07 逐项依赖停审 + 裁剪 / 类型 / 禁止依赖审计 | pass |
| Step 8 | 数据所有权 | BC01~07 逐项数据停审 + truth / projection / ref / forbidden-body 审计 | pass |
| Step 9 | 交互方式 | BC01~07 逐项交互停审 + sync / async / background 跨审计 | pass |
| Step 12 | 横切关注点 | BC01~07 适用性停审 + 横切约束总审计 | pass |
| Step 15 | ADR / 追溯 | D-L2M-01~09 逐项停审 + 103 项正式编号覆盖 + 孤儿审计 | pass |

没有未停审架构单元进入正式装配。BC01~05 保持 core semantics,BC06 保持 supporting anti-corruption mirror,BC07 保持 local read projection;不得因正式章节压缩而改变分类。

## 4. 跨架构单元总审计

| 审计维度 | 一致性判定 | 保留边界 | 结果 |
|---|---|---|---|
| 职责 | RESP-L2M-001~010 与 BC01~07 一致,本仓只拥有成员容器内交互边界事实 | Runtime / host / Bus / Governance / Work / Identity / Conversation / Tools / Observability truth 外置 | pass |
| 依赖 | Core 是唯一 compile authority;host / Runtime 是 runtime seam;Bus 是 event seam;ref 只是材料形态 | runtime / event / ref / adapter / fake 不伪装 package dependency | pass |
| 数据所有权 | local truth、external snapshot、derived projection、typed ref 和 forbidden body 分离 | raw body、hidden reasoning、secret、definition body、external truth 不持久化为本仓 truth | pass |
| 一致性 | local logical commit 先成立;external feedback eventual;历史 append / supersede;unknown side effect fenced | 不假定 shared DB、distributed transaction、outbox、retry 或 recovery 已实现 | pass |
| 通信 | sync admission、async committed fact / feedback、qualified background continuation 分离 | Runtime accepted 不等于 run complete;published attempt 不等于 delivered / observed / accepted | pass |
| 横切 | subject / scope、最小暴露、可归责、幂等 / 顺序、韧性、projection freshness 均映射到具体 BC | 不以单一 `success`、日志或 readiness 压平多 owner 状态 | pass |
| ADR | 只有 ADR-0004 / ADR-0005 是可正式索引的既存编号 | D-L2M-03~09 只写 local ADR candidate / 未建立,不进入正式 ADR 主表 | pass |
| 追溯 | FR/E、BR、NFR、AC、VF 共 103 个正式编号均有唯一矩阵行 | 覆盖是设计追溯,不构成实现、测试或验收证据 | pass |

跨单元未发现职责重叠、反向依赖、双真相、通信语义冲突、横切遗漏、孤儿决定或孤儿需求。`L2M-UP-*`、`Q-L2M-*`、`AQ-L2M-*` 的开放状态只条件阻塞后续 schema、配置、测试、联调与 readiness,不阻塞当前架构成文。

## 5. 正式 18 章回填映射

| 正式章节 | 主要校准来源 | 回填结论 | 禁止混入 |
|---:|---|---|---|
| 1 与上游文档的关系声明 | Step 1 | 来源、效力与本文细化范围 | 需求清单、上下文图 |
| 2 业务背景与驱动力 | Step 1 / 2 | 问题背景、驱动力、架构目标 | 约束和选型目录 |
| 3 约束条件 | Step 2 | 不可变约束、阶段取舍、非目标 | 技术产品选择 |
| 4 职责边界 | Step 3 | 做 / 不做、易混淆 owner、红线 | 协议、字段、部署 |
| 5 系统边界与上下文 | Step 4 | Context 图、关系面、降级 | 内部模块、事件时序 |
| 6 限界上下文与子域划分 | Step 5 | BC01~07、分类、统一语言、关系 | 源码模块和物理容器 |
| 7 容器 / 部署架构 | Step 6 | RU 逻辑运行承载与部署边界 | 进程数、语言、transport 已实现 |
| 8 依赖方向与层间约束 | Step 7 | inward roles、裁剪表、类型表、禁止表与图 | runtime / event 伪装 compile |
| 9 数据所有权与一致性策略 | Step 8 | data classes、owner、consistency、failure | schema、表、store、retention 数值 |
| 10 关键交互与通信方式 | Step 9 | 交互场景、方式分类、失败口径 | API / event / DTO 目录 |
| 11 关键技术选型 | Step 10 | TM-L2M-001~014 与 deferred 机制 | Rust / UDS / gRPC 等历史选择 |
| 12 备选方案与取舍 | Step 11 | ALT-L2M-A~H 与关键取舍 | 局部实现变体比较 |
| 13 横切关注点 | Step 12 | CC 约束与 BC 适用性 | 单点实现要求 |
| 14 演进路线 | Step 13 | 当前基线、债务、触发器、阶段方向 | 排期、任务、ready 声明 |
| 15 风险与待确认事项 | Step 14 | risk / question / debt / trigger / blocker 分层 | 把 pending 润色成结论 |
| 16 需求追溯矩阵 | Step 15 | 固定五列的 103 项需求覆盖 | 新决定、证据或验收结果 |
| 17 ADR 索引 | Step 15 | ADR-0004 / ADR-0005 适用性 | local candidate 伪编号 |
| 18 参考 | Step 1~15 的正式来源 | 类别、用途 / 参考价值、入章理由 | ADR、追溯或历史年表 |

Step 与章节不是机械一一复制:第 1~3 章共同吸收 Step 1~2;第 15 章同时汇总 Step 13~15 的开放边界;第 18 章只收正式来源。所有正文只保留收口结论,问题回答、旧材料诊断、过程停审与写入检查留在 calibration 文件。

## 6. 术语与编号统一

| 统一词 / 编号 | 正式口径 | 禁止替代或混用 |
|---|---|---|
| AI Member 容器 | 产品 / 部署位置,不等于固定物理进程拓扑 | “member 就是容器”或“固定双进程” |
| ProjectMember / GlobalMember | 项目型执行主语 / 身份锚 | 用 GlobalMember 代替执行主语 |
| presence | member 本地在场事实 | host acceptance / health / ready |
| screening decision | 四态筛选结论 | Governance decision 或 Runtime acceptance |
| controlled delivery | member 向 Runtime 提交受控材料的决定 / attempt | run created / completed |
| committed outcome material | Runtime 已提交的 safe material / ref | member 自己的 outcome truth |
| outbound decision / publication attempt | 本地出站决定 / 对 Bus 的尝试 | delivered / observed / accepted |
| Member Summary | BC07 可重建只读 projection 的必需能力 | capability outlet 或 core truth 直出 |
| capability outlet | 结构保留、激活可裁剪的 ref-derived projection | capability registry / invocation / authorization |
| BC-L2M-01~07 | 正式限界上下文编号 | 旧 B1~B6 模块名 |
| RU / TM / ALT / CC / D | 逻辑运行单元 / 技术机制 / 路径 / 横切 / 决定 | 实现组件、部署实例或正式 ADR 编号 |

旧文档中的 Identity Card、Attention、External RPC、Event IO、`launch_token`、AG-UI、固定 CloudEvent family、UDS / gRPC、Rust、supervisord、固定 P95 / heartbeat 数值均不得作为当前正式术语或选择复活。CloudEvents / W3C 只可作为 Core shared authority 类别出现,member-specific schema / route 继续 pending。

## 7. 来源块与交叉引用规则

- 正式每章在正文前列出具体 `design-calibration/01_arch_step_*.md` 路径。
- 每章延伸阅读定位到对应文件的“结构化中间产物 / 回填草稿 / 风险或待确认 / 门禁”类小节;若文件标题不同,使用真实小节名。
- 第 16 章固定列为 `需求来源 | 需求结论 / 约束 | 架构承接结果 | 承接位置 | 说明`。
- 第 17 章只索引既存 `ADR-0004`、`ADR-0005`,并明确是裁剪适用而非全文无条件继承。
- 第 18 章不把 historical material 列为正式架构来源;历史污染只在 calibration 中保留。
- 图使用 `text` ASCII,图后给出边界说明;不得引入 Mermaid / PlantUML / Graphviz、颜色或 emoji。

## 8. Pending、兄弟边界与非伪造审计

| 范围 | 正式装配口径 | 结果 |
|---|---|---|
| member-service | 正式 01 已到 Step 16 allowed 但尚未停审;仍只引用已停审正式 00 的 owner 分工,字段 / IPC / credential / 正向联调 pending | pass |
| member-images | 正式 01 已 stop_review;漂移检查确认 image truth 外置、pinned member component release -> image supply -> pinned entry / gap 边界,exact shape / compatibility / confirmation 仍 pending | pass |
| Runtime | 只承接 loop / context / plan / outcome owner 和 entry / handoff seam;mapping / source family pending | pass |
| Core / Bus | Core shared authority 与 Bus delivery truth 成立;member-specific schema / route pending | pass |
| 设计状态 | 只声明 planned / pending / blocked / waiting / degraded / gap / fail-closed | pass |
| 禁止事实 | 不声明实现、commit、run_id、测试结果、artifact、report、evidence、verdict、signoff、integration pass 或 readiness | pass |

截至 2026-08-23 最新刷新,member-service 正式 01 尚未停审;member-images 正式 01 已 stop_review 且与本仓 owner、dependency、runtime truth 和 static supply 边界无冲突。该刷新只精化 `L2M-UP-002` 的 exact release / compatibility / consumer contract 缺口,不构成 integration 或 readiness。若 sibling 后续改变 host owner、运行主语或 topology 边界,必须按 Step 13 trigger 回开受影响 Step。

## 9. 装配前门禁结论

| 检查项 | 结果 |
|---|---|
| 三层门禁是否全部通过 | pass |
| Step 5 / 7 / 8 / 9 / 12 / 15 是否全部停审 | pass |
| 跨职责 / 依赖 / 数据 / 通信 / 横切 / ADR / 追溯是否无 unresolved 冲突 | pass |
| 18 章来源与回填位置是否明确 | pass |
| pending / historical / non-fabrication 边界是否保留 | pass |
| 是否允许重建正式 01 | pass |

`Step 16 preassembly gate = pass`。下一允许动作仅为删除旧正式 `01-架构设计.md`,从空文件按 18 章结构分批重建并完成写后总审计;正式文档审计通过前不得将 Step 16 标为 complete,不得进入 02。

## 10. 正式装配结果

旧正式 `01-架构设计.md` 已按 full-restart 纪律删除,并从空文件按规范 18 章结构重建。正式正文只吸收 Step 1~15 已停审结论;Step 16 只做章节映射、术语 / 编号统一、交叉引用、sibling 最新状态刷新与静态审计,没有新增架构决定。

| 装配对象 | 结果 | 说明 |
|---|---|---|
| 正式章节 | 18 / 18 | 章节顺序与书写规范 §4.1~§4.18 一致。 |
| 校准来源块 | 18 / 18 | 每章均有具体 calibration source 和延伸阅读。 |
| calibration source 引用 | 21 项引用,16 个唯一 Step 文件 | 引用文件全部存在;覆盖 Step 1~16。 |
| 正式需求追溯 | 103 / 103 | FR 12、增强 FR 3、BR 30、NFR 16、AC 33、VF 9,无 missing / extra / duplicate。 |
| 追溯表结构 | 103 / 103 五列 | 固定列为“需求来源 / 需求结论或约束 / 架构承接结果 / 承接位置 / 说明”。 |
| 正式 ADR 索引 | 2 项 | 只含既存 `ADR-0004` / `ADR-0005`;D03~09 保持未编号 local candidate。 |
| 正式参考 | current formal / normative materials only | historical / draft / sibling 未停审材料不进入正式参考。 |

## 11. 写后总审计

### 11.1 结构、来源与表格审计

| 审计项 | 检查结果 | 判断 |
|---|---|---|
| H2 正式章节 | 1~18 连续、无缺章 / 重号 / 额外正式章 | pass |
| 每章来源 / 延伸阅读 | 18 章均同时存在,路径具体可定位 | pass |
| source 文件存在性 | 21 项引用全部解析到 `projects/L2-member/design-calibration/` 真实文件 | pass |
| Markdown 表格 | 代码块外所有连续表格列数一致 | pass |
| ASCII 图 | Context / BC / deployment / dependency / crop / interaction 图均为 `text`,且有图后说明 | pass |
| diff 格式 | `git diff --check -- projects/L2-member` 无错误 | pass |

### 11.2 追溯、ADR 与编号审计

| 审计项 | 检查结果 | 判断 |
|---|---|---|
| 正式 00 编号集合 | 103 项预期与正式第 16 章实际集合完全相等 | pass |
| 唯一性 | 每个正式编号恰好一行,无 extra / duplicate | pass |
| 行结构 | 103 行全部为固定五列 | pass |
| 覆盖效力 | 只声明 design trace coverage,未写 implementation / acceptance evidence | pass |
| ADR 主表 | 只有 `ADR-0004` / `ADR-0005` 两条既存正式编号 | pass |
| local candidate | `D-L2M-03~09` 只在边界说明中声明未建立,没有伪造 ADR 文件 / 编号 | pass |

### 11.3 Owner、依赖、数据与交互审计

| 审计项 | 检查结果 | 判断 |
|---|---|---|
| owner | member 只拥有本地 interaction-boundary truth;Runtime / host / Bus / Governance / downstream / image truth 外置 | pass |
| dependency | Core-only compile;runtime / event / ref / adapter / fake 明确分类 | pass |
| member-images 方向 | images 侧 runtime/ref 消费 future component release + build supply 不被写成本仓 package / runtime truth 依赖 | pass |
| data | truth / snapshot / projection / ref / forbidden body 与 local / external consistency 分层 | pass |
| interaction | sync admission、async committed fact / feedback、qualified background continuation 分开 | pass |
| projection | Member Summary 必需;capability outlet 激活可裁剪;BC07 不反写 | pass |

### 11.4 Sibling 最新状态与漂移审计

| sibling | 最终读取状态(2026-08-23) | 漂移判断 | 保留缺口 |
|---|---|---|---|
| `L2-member-service` | 正式 00 stop_review;正式 01 Step 16 allowed、尚未停审 | 无已停审新架构可升格;继续使用正式 00 owner 分工 | fields / IPC / credential / positive integration pending |
| `L2-member-images` | 正式 00 + 正式 01 stop_review | 正式 01 与本仓 owner、dependency、runtime truth、static supply 边界一致 | exact component release shape / compatibility / handoff / confirmation / readiness pending |

### 11.5 历史污染与非伪造审计

| 审计项 | 检查结果 | 判断 |
|---|---|---|
| CloudEvents / W3C | 只允许 Core shared authority 类别;member-specific family / route pending | pass |
| AG-UI、UDS、gRPC、launch token、Rust、supervisord、固定双进程 / P95 / heartbeat | 只出现在 historical、not-selected、deferred 或禁止继承语境 | pass |
| implementation / deployment | 未声明代码、进程、store、adapter、schema 或 topology 已实现 | pass |
| execution evidence | 未声明 commit、run_id、测试结果、artifact、report、evidence、verdict、signoff 或 readiness | pass |
| pending / fake | 未被写为 integration、delivered、observed、accepted、ready 或 pass evidence | pass |

## 12. Step 16 最终门禁

| 检查项 | 结果 |
|---|---|
| 是否只重组已确认结论 | pass |
| 正式 18 章是否完整且来源可定位 | pass |
| 跨架构单元总审计是否无 unresolved 冲突 | pass |
| 103 项追溯与 2 项正式 ADR 是否准确 | pass |
| sibling 最新变化是否完成只读漂移审计 | pass |
| pending / historical / non-fabrication 边界是否保留 | pass |
| 是否允许完成正式 01 | pass |

`Step 16 gate = pass; formal_01 = complete_stop_review`。正式 `01-架构设计.md` 已完成装配与写后总审计,当前立即停审。下一允许动作仅为等待用户明确确认是否进入 `02-概要设计.md`;未经确认不得创建 02 flow / Step、修改旧正式 02、实现代码或提交 commit。
