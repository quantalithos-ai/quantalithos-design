# Step 15：整理正式测试方案文档

## 1. Step 状态

2026-10-02；full-restart / single-agent；completed / selfcheck_done / stop_review / waiting_user_confirmation；`assembly_gate=pass`（前序库存/静态门禁核对完成）。输入Step1～14及三份规范性附录/跨文档审查；输出旧稿删除、15章骨架与A/B/C分章装配、[最终静态记录](05_test_plan_static_review_record.md)与停审。完成仅指设计，不是测试或验收完成。

| Step内计划 | 状态 | 产物/门禁 |
|---|---|---|
| 读取/前序结论 | done | §2及全部前14Step诊断/取舍/未确认 |
| SOP回答/旧稿差异/取舍 | done | §3～6，旧12章无authority |
| 跨文档闭环 | done | 05_test_plan_cross_document_review.md十类输出 |
| 复杂度/分批判定 | done | §7.1三批装配；完整用例/入口/schema保留规范性附录，不压缩库存 |
| 装配前库存/三层门禁 | done | §7.2，104ID/98TC/98EV/11suite/49fields/15十段、links/table/fence已核 |
| 删除/骨架/§1～5 | done | 旧217行文件已删除，15章骨架重建，批次A已装配 |
| §6～10/§11～15 | done | B/C已装配；完整附录为规范性组成，不压缩库存 |
| 最终静态审计/停审 | done | static_review_record；设计自检完成，等待用户确认 |

`gate_status=pass`（本Step设计自检）；`gate_reason`=前14Step/跨闭环/15章装配/最终静态检查完成；`next_allowed_action`=等待用户明确确认或按意见修订05，不能进入06；`source_files`=§2/§7.1具体产物、跨审查及最终静态记录。项目/文档跨步gate=blocked waiting_user_confirmation，不把Step内pass当用户确认或实际执行完成。

## 2. 本步输入

Step1～14的每个十段主控，Step6 contract_index/cut_reviews、Step13 artifact_schema、[跨文档审查](05_test_plan_cross_document_review.md)；测试SOP Step15、书写规范15章/来源/paths、通则full-restart、中间产物规范§3.2/三层门禁/5.10。旧05只用其12章/commerce/install污染诊断，不采用其作者审定/版本/评审标记。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 15章主链？ | §7.1采用规范原名，章与Step1～14/参考一一关联。 |
| 全P0保留？ | 43/49/14/13CUT，98TC/13DS/11suite/98EV和schema/失败恢复，完整规范性附录不可省略。 |
| 删除讨论语气？ | 正式只结论/要求/表，SOP问题/诊断/取舍/审查留calibration。 |
| 未确认风险？ | Step14完整12ID/local残余/authority/重开，当前无接受/signoff。 |
| TC反查03？ | 全49Request字段索引，43/222/146/33/7完整参数化，正式error/enum/currentgate。 |
| 名称/phase越界？ | 已修Draft/shell/NoticeIntent/CommitUnknown/Conflict/MP-SRC003；运行证据不预填。 |
| 可供06？ | 提供AC/VETO→TC/EV→same-run raw/report、scope/进入退出/风险；本轮仍停审不进06。 |

## 4. 当前文档问题诊断

旧217行05为12章旧生产流程，主线含PackageRelease/InstallRecord/Entitlement/Rating/Ranking、安装/交易/生态运营对象和无当前owner合同事件。只能删除后重建；旧元信息“Aris审定”等不继承。04的MP-SRC003标签差异保留受控核对，不越范围私修。

## 5. 改动前后对比

| 前 | 本轮独立结论 | 正式装配要求 |
|---|---|---|
| 旧12章/install/commerce | 15章五能力/七U边界 | 不复制旧正文 |
| 单场景与模糊evidence | 98主TC、13CUT、全部参数化、unique EV | 主表/附录规范性明确 |
| 配置/事件宽泛 | 七字段/八slot/四profile、0active event | 不新造truth/lane |
| 原型/文档误ready | 计划与actual/fake/qualification/证据成熟度分层 | 全not-run，无真实digest/run/verdict |

## 6. 测试设计取舍

正文提供能直接消费的矩阵/门禁/路径与规范性完整附录入口，详细TC/49field/schema不能被当可选延伸；不把SOP逐问或诊断原文粘进正式章。拒绝沿旧12章改名/留commerce对象、自动越06或创建实施台账。07未来全部planned skeleton需纳入05的22测试脚本计划，但本轮不创建。

## 7. 结构化中间产物

### 7.1 章节来源与装配批次

| 正式章 | source_files | 装配内容 | 批次 |
|---|---|---|---|
| 1 与上游文档的关系声明 | Step01 | 00～04权威、九owner接缝、历史/证明上限 | A |
| 2 本次测试目标与范围 | Step02 | 五能力/P0/P1/P2/VETO/非范围 | A |
| 3 测试对象与测试切口 | Step03+03Step16 | 七U/43/49/14/13CUT/路径 | A |
| 4 测试策略与分层 | Step04 | 分层/suite/时机/fake/PG边界 | A |
| 5 需求追溯与覆盖矩阵 | Step05 | 104ID/正反/EV/CUT反查、未覆盖 | A |
| 6 测试场景与用例设计 | Step06+两个附录 | 98完整TC矩阵入口、49fields、参数化库存 | B |
| 7 测试数据设计 | Step07 | 13DS/builder/隔离/清理 | B |
| 8 测试环境与配置矩阵 | Step08 | 依赖compile/runtime/event、七字段/八slot/profile | B |
| 9 自动化与 CI/CD 门禁 | Step09 | 11suite/98主集合/22脚本/参数/exit/raw-report | B |
| 10 专项测试与非功能验证 | Step10 | 17NFR/VETO/fault/观测/candidate | B |
| 11 缺陷管理与复验规则 | Step11 | S/A/B/复验/证据失效 | C |
| 12 进入准则与退出准则 | Step12 | scope及全未勾运行checklist | C |
| 13 测试报告与证据归档 | Step13+schema | paths/writer/strictschema/DAG/98EV/成熟度 | C |
| 14 回归策略与残余风险 | Step14 | 回归/12开放项/local风险/authority/重开 | C |
| 15 参考 | Step01/15 | 正式输入/未来06/规范/上游/详情 | C |

### 7.2 三层装配门禁

项目级只允许05；文档级前14Step十段/门禁/具体来源与全部P0设计完整；Step级本步独立结论、差异/跨闭环与库存校验通过。通过后记录actual允许写入，删除旧05，建立15章骨架，再A→B→C逐批。final selfcheck通过后才把本步及正式05标completed，并把项目门禁改为blocked waiting_user_confirmation，06/07 not_started。

装配前只读核对事实：15主Step固定十段；104需求与00完全相等；98TC/98EV各唯一；11主suite恰包含98TC且互斥；49入口/Request字段与03一致；20个05 calibration文件70本地链接、表列与围栏无错误。仅文档核对，不是suite run或owner签核。三层门禁已允许本轮正式05写入。

### 7.3 最终静态清单

15主Step十段/8计划项/gate/source；15正式章/具体校准与必读详情；104需求集合、98TC/98EV唯一/11主suite互斥、13CUT/13DS、49字段同03、14enum/222pair/43/17/146/33/7来源；JSON Schema解析/required/ref；所有本地links/anchors/表列/围栏；无旧commerce/install正向truth、无新增配置/事件/Billing/Archive、无fake执行证据；仅本项目diff及不触碰其他dirty。检查程序只读、不保存实现脚本/报告/evidence。

首轮最终核对发现正式§5只有规范性来源说明，未显式标“延伸阅读”；已补该入口，不改变矩阵。状态矩阵统计只取详细From/To/分类行，排除A/S/R网格行；canonical合并行逐入口展开，避免把网格重复计数或把两入口合并行漏计。修正后的核验口径仍为222pair/73A和33DTO，不改变03或测试库存。

### 7.4 实际批次恢复点

| 批次 | 范围 | 实际状态 | 下一许可 |
|---|---|---|---|
| A | 删除旧稿、15章骨架、§1～5 | done | B |
| B | §6～10 | done | C |
| C | §11～15 | done | 最终静态审查 |
| 最终静态审查 | §7.3清单及三层状态同步 | done | completed / stop_review / waiting_user_confirmation |

## 8. 回填草稿

按§7.1先写15章骨架，再分三批填候选结论；各章注明校准来源/具体延伸阅读与规范性附录。元信息状态写design completed待用户确认，不能写Accepted/ready或已有运行。

## 9. 待确认事项

MP-UP/SRC/Q、owner/SDK/provider/PG/TLS/auth资格、实际baseline/工具/资源/运行/evidence全部未关闭；正式05最终须用户确认。详细设计影响判定：所有TC依据03/04，无新增business schema；外部或实现缺口须回owning Step。

## 10. 进入下一步条件

正式05与本Step已完成设计装配/静态自检，立即stop_review。只允许等待用户明确确认或修订05，不得进入06；下一阅读仅获确认后06 SOP/书写规范及05 scope/AC/VETO/证据/风险，当前不读取，不提交commit。
