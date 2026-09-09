# 01 架构 Step 16：正式装配

## 1. Step 状态

状态：completed / pass_with_upstream_blockers / stop_review；模式：full-restart；对应 SOP：架构 SOP Step 16。
开工确认：项目台账、flow、前序 Step 已读；三层门禁允许当前 Step。formal_01_write_allowed 仍关闭。

### Step 内计划

- [x] 读取输入和前序结论：见 §2。
- [x] SOP 问题回答：见 §3。
- [x] 当前材料诊断：见 §4。
- [x] 设计取舍：见 §6。
- [x] 结构化中间产物。
- [x] 复杂度判断与按单元停审。
- [x] 回填草稿。
- [x] 自检与进入下一步条件。

模块骨架：正式章节分批装配，每批不超过 300 行；完成后静态总审计。未来 Step 不创建。

## 2. 本步输入

Step 1~15 完成产物、各 U 单元停审；项目台账与本 flow；架构规范 §1~18；共同输入：正式 00、项目台账、架构 flow 的来源复核表、架构 SOP 对应 Step、书写规范对应章节、中间产物规范和真相源闭环标准。前序产物的未闭合 seam 仍保留。

## 3. SOP 问题回答

1. 如何回填？Step 1 -> §1/3，Step 2 -> §2/3，Step 3~14 -> §4~15，Step 15 -> §16/17，来源登记 -> §18。
2. 哪些不能复制？诊断、自检、owner 待回流和 gate 留 calibration；正式正文只取已收束表、图、边界。
3. 术语统一什么？owner/局部 truth、source cursor/view revision/ReadCursor/generation、多轴降级、六类依赖。
4. 未确认如何保留？WS-UP-001~008 及 seed 子项继续 open，不润色为 ready/fresh/正向集成。
5. 单元是否停审？Step 5/7/8/9/12 的 U1~U6 与 Step 15 七决定已逐一自检；终检将核对实际文件与引用。
6. 参考如何收口？正式来源表引用本项目 00、全局规则及上游当前 00/01；README/draft/ADR 草稿只留污染审计，不列正式参考。
7. 是否新增分析？仅装配已收敛内容；不一致回原 Step 修复。

## 4. 当前文档问题诊断

图标题已回 Step 4/5/6/7 改为规范图类型；flow 明细空行待格式修复。正式文件不存在，无旧正文要删除。前序泛化停审不等于测试结果。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 当前架构主题 | 正式 01 未创建，draft 只作候选 | 由本步输入独立收束后进入 §7 | 阻止历史草稿升级为真相 |
| 外部依赖 | 00 已登记 pending/blocker | 保留 owner 和解锁条件 | 不以架构补外部合同 |

## 6. 设计取舍

| 方案 | 优点 | 代价 | 结论 |
|---|---|---|---|
| 已停审草稿分批装配、逐章具体来源 | 可复查不添加设计 | 需结构与术语核对 | 采用 |
| 另写自由架构文章 | 表述流畅 | 易新增未确认设计 | 不采用 |

## 7. 结构化中间产物

### 7.1 装配前跨架构单元总审计

| 单元/决定 | 职责 | 依赖 | 数据 | 交互 | 横切 | ADR/追溯 | 结论 |
|---|---|---|---|---|---|---|---|
| U1 scope/partition | Step 5 U1 | Step 7 U1 | Step 8 U1 | Step 9 U1 | Step 12 U1 | ADR-WS-001/002/003 | pass：无 identity/work/auth truth |
| U2 source | Step 5 U2 | Step 7 U2 | Step 8 U2 | Step 9 U2 | Step 12 U2 | ADR-WS-001/003/007 | pass：body-free、正式只读输入 |
| U3 projection | Step 5 U3 | Step 7 U3 | Step 8 U3 | Step 9 U3 | Step 12 U3 | ADR-WS-004/006 | pass：局部应用不等于 bus delivery |
| U4 attention | Step 5 U4 | Step 7 U4 | Step 8 U4 | Step 9 U4 | Step 12 U4 | ADR-WS-005 | pass：local state 与 source/重建分离 |
| U5 recovery | Step 5 U5 | Step 7 U5 | Step 8 U5 | Step 9 U5 | Step 12 U5 | ADR-WS-006 | pass：候选隔离，缺 seam 不切换 |
| U6 read/export | Step 5 U6 | Step 7 U6 | Step 8 U6 | Step 9 U6 | Step 12 U6 | ADR-WS-001/003/007 | pass：no-write，不产生 archive acceptance |
| 跨单元 | 无双 owner | 无源码循环 | 局部原子/外部最终一致 | 显式写与读分开 | 安全无旁路 | FR/BR/NFR 均覆盖 | pass_with_upstream_blockers |

### 7.2 正式来源与章节映射

| 正式章 | 主校准文件 |
|---|---|
| 1 | Step 1 及 flow 来源复核表 |
| 2/3 | Step 2；3 同时引用 Step 1 |
| 4/5/6/7/8/9/10 | Step 3/4/5/6/7/8/9 |
| 11/12/13/14/15 | Step 10/11/12/13/14 |
| 16/17 | Step 15 |
| 18 | Step 1 与本 Step 的来源材料登记 |

来源表使用本项目正式 00 与 flow 记录的 L0/L1/L2 正式文档，主题分别是 shared contract、事件传递、访问封装、六域 truth、execution/tool/host/image 排除边界。参考 governance/artifact 的边界、数据一致性与追溯粒度，不继承实现栈。全局依赖 §4.1 为窗口 authority。README/draft/历史 ADR 仅留污染审计，不列正式参考。

### 7.3 写入前检查

项目级：用户授权完成 01，未授权 02。文档级：Step 1~15 均 done；本 Step 装配前总审计通过。Step 级：模块思考/写入/自检已完成，回填来源可定位。允许分批创建正式 01；不得新增协议/字段、owner 决定或执行事实。

正式装配状态：正文 18 章已分批创建；最终静态检查已完成。

### 7.4 实际装配批次与回归修正

| 批次 | 写入内容 | 局部检查 |
|---|---|---|
| 骨架 | 元信息与 18 章标题 | 无旧正式 01，不删除历史材料 |
| 1 | §1~6 | 每章具体校准来源；职责/系统/语义图分离 |
| 2 | §7~12 | 运行承载、依赖三表、数据/版本/一致性、交互及方案 |
| 3 | §13~18 | 横切、演进、风险、追溯、ADR 与正式参考 |
| 回归 | Step 8 与正式 §9 | 区分缺失分区与有证明的 empty；检查记录不代表 owner 删除；游标不按整数猜 gap；撤销有效性不以 TTL 填空 |
| 格式 | Step 4~7 与 flow | 规范图标题；依赖箭头说明；flow 表空行修复 |

来源/参考清单具体条目使用正式 §1/18 的表，由本 Step §3、§7.2 及 Step 1/flow 来源复核表整理，不扩展新的 authority。架构中不写代码 schema 或完整协议，后续进入 02/03 必须按 SOP 展开；未闭合外部字段只能 blocked，不能让实现者自行补。

## 8. 回填草稿

对应正式 `01-架构设计.md` §1~18；每章来源为 §7.2 映射，正式正文已写入，未复制问题回答、诊断、自检、待回流安排。18 章与两个粒度参考项目处于相同架构层；未压成需求复述，也未代替概要/详细 schema。

复杂度判断：按章节分批，不把单次 patch 行数当最终文档上限；模块级校准保留在 Step 5/7/8/9/12/15。

## 9. 待确认事项

WS-UP-001~008 与关联 WS-UP-006-S 继续 open；具体 owner 回流表见 Step 14 §7.4。没有跨项目回写授权，未实际回流。没有实现仓、commit、run_id、测试结果、artifact/report/evidence、signoff 或真实 baseline 事实。

## 10. 进入下一步条件

### 10.1 静态审计记录

| 审计项 | 实际检查 | 结论 |
|---|---|---|
| 正式章链 | 18 个顺序编号章节 | pass |
| 中间产物 | 16 个 Step 文件，每个均有规范十段结构 | pass |
| 单元停审 | Step 5/7/8/9/12 各 6 条单元记录；Step 15 有 7 条决定记录 | pass |
| 章节来源 | 18 章具体校准来源与延伸阅读，文件存在 | pass |
| Markdown | 参考链接可解析、表列一致、围栏配对，无装配占位 | pass |
| 需求追溯 | FR-WS-001~010、BR-WS-001~012、NFR 与 blocker 能回链 | pass |
| 状态/一致性 | source version/cursor、view revision、ReadCursor、generation、page cursor 分离 | pass |
| 安全/所有权 | 无上游反写/正文复制/私有授权；失效权限不借 stale 放行 | pass |
| 恢复边界 | bus preparation != replay executor；local overlay 不被重建覆盖；seed/live 分开 | pass |
| 执行事实 | 未运行项目测试、未生成 evidence/readiness/commit；仅只读静态检查 | pass |
| 写入范围 | 本轮编辑目标均在 projects/L1-workspace/；既有外部 dirty 文件保留 | pass |
| 后续门禁 | 未创建 02~07 及其 calibration、implementation ledger/boundary skeleton | pass |
| 上游接缝 | WS-UP-001~008/006-S 继续 open；owner 回流未执行 | pass_with_upstream_blockers |

以上 pass 为静态文档检查，不是测试报告、验收 verdict、用户 signoff 或生产 readiness。正式 01 stop_review，不创建 02。用户后续授权进入 02 时，先读概要设计讨论 SOP 与书写规范，再读正式 00/01、当前台账及上游未闭合合同。

思考记录 = done；写入记录 = done；自检状态 = done；gate_status = pass；gate_reason = 18 章及三层状态静态闭合，外部 seam 保留阻塞；next_allowed_action = wait_for_user_confirmation_before_02。
