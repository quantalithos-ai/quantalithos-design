# 03 Step 19：正式详细设计装配

## 1. Step状态

2026-10-02；full-restart / single-agent；completed / selfcheck_done / stop_review。用户授权完成全部03，不授权04、实现或commit。已恢复项目台账、03 flow与Step1～18完成记录，读取SOP Step19、书写规范章节主链/模块契约/来源/评审、通则三层装配门和中间产物固定十段。独立规则先落盘，之后全文读取旧正式03仅做差异审计；三层装配门通过后删除旧稿，分批完成18章并执行文档静态自检。当前等待用户审阅确认，不跨入04。

### Step内计划

| 单元 | 产物 / 完成门禁 | 状态 |
|---|---|---|
| 输入与七题/诊断/取舍 | §2～6，装配不得新增契约 | done |
| 来源与三层门/历史差异 | §7.1～7.3；逐来源完成，旧稿仅后置对比 | done |
| 删除旧稿/18章骨架 | 正式03；全部章节先有具体来源 | done |
| 分章分模块装配 | 正式§1～18；独立模块有实质契约，完整详情规范性引用 | done |
| 静态审计与停审 | 本Step§10、静态记录、flow/项目台账一致 | done |

## 2. 本步输入

[当前00](../00-需求文档.md)、[当前01](../01-架构设计.md)、[当前02](../02-概要设计.md)和当前03 Step1～18；[模块主轴](03_ddd_step_05_module_contracts.md)、[对象](03_ddd_step_06_object_contracts.md)、[ports](03_ddd_step_07_port_adapter_contracts.md)、[协议](03_ddd_step_08_protocol_contracts.md)、[flow](03_ddd_step_09_function_flows.md)、[状态](03_ddd_step_10_state_matrix.md)及其明确附录；[实施承接](03_ddd_step_17_implementation_handoff.md)、[风险](03_ddd_step_18_risks.md)。规范性细节随模块引用，不重新定义owner/SDK真相。

## 3. SOP问题回答

1. 章节主链？严格18章，Step1～18的来源映射见§7.1；Step19是装配记录而非新增技术章。
2. 第5章是否模块主轴？contracts/domain/application/infra/api/worker/web七模块，各有职责、路径、capability、对象、port、函数、错误、测试；七U嵌入domain/application，不当七微服务。
3. 对象/trait/协议/flow/状态互相回指？43主对象、17ports/146methods、49协议与独立flow、14carrier/222pairs/73合法迁移，以已校准附录为完整定义；第6章仅查找索引。
4. 闭环复核？Step17字段/DTO/Query/状态/命名/metadata/phase审计为输入；最终逐章核对并回修源Step，不能装配时暗自改变契约。Step18 SDK路径简写需先回源为Step4真实planned `_adapter.rs`。
5. 可还原到代码？本地schema、Row、factory、callable、事务与负向分支完整；external exactowner/SDK资格仍blocked，不能把文档完整称为生产可运行或开工授权。
6. 跨文档越界？不写04 profile数值、05完整cases、06 verdict/evidence、07任务/排期/boundary；保留承接位置与测试切口。
7. 07整体审计输入？提供模块/路径/schema/ports/49flow/14矩阵/存储/恢复/幂等/config/audit/test/需求映射；后续07必须对正式03/05/06/07逐boundary重审，本轮不创建实施台账或skeleton。

## 4. 当前文档问题诊断

装配前独立结论：旧正式03不能沿用为当前实现基线；来源库存已有，但缺正式18章可导航装配与最终11～19审计记录。本Step已补齐。Step18§7.2的 `infra/sdk/*.rs` 简写已回源为Step4完整planned `_adapter.rs` 路径（MP-DDD-FIX-10，design-fixed/not-run）。后置旧稿全文诊断见§7.3；不以历史批准/交易/安装对象反向补当前truth。装配文字与旧恢复点歧义修正见静态记录MP-DDD-FIX-11/12。

## 5. 改动前后对比

| 项 | 装配前 | 装配后目标 | 原因 |
|---|---|---|---|
| 正式03 | historical_material | 18章模块主轴、具体可点击来源 | 当前full-restart只有校准结论可装配 |
| 细节查找 | 重schema/flow分附录 | 模块内规范性详情入口+全局索引 | 保留完整性而不复制第二套schema |
| 完成状态 | Step18 completed | Step19 completed / stop_review | 正式完成不授权04或实施 |

## 6. 设计取舍

| 方案 | 优点 | 风险 / 限制 | 结论 |
|---|---|---|---|
| 模块实质契约+完整规范性附录 | 文件/函数/错误/测试可导航；巨型schema保持单authority | 实施者必须读指定附录完整卡与传递类型 | 采用；来源不是可选背景材料 |
| 将全部schema/49flow/222pairs再复制进正文 | 单文件冗长但可读 | 双份全文易漂移，掩盖来源与回修责任 | 不采用；正文不能只给链接或库存总表 |
| 修补历史章节与trade/install对象 | 操作量小 | 旧真相持续污染full-restart | 不采用；先差异审计，删除旧稿再搭新骨架 |

## 7. 结构化中间产物

### 7.1 章节与来源映射

| 正式章 | 唯一校准主源 | 规范性补充 |
|---|---|---|
| 1～4 | Step1、2、3、4各对应一章 | 当前00/01/02、Step4完整215树/职责 |
| 5 | Step5 | Step6 shared/runtime/七U；Step7 typedports/applicationcallables；Step11～16 |
| 6 | Step6/7/8主控库存 | §5模块定义、§7协议、§8flow；仅索引 |
| 7 | Step8 | shared_surface+七U协议完整request/result/view/report |
| 8 | Step9 | job_execution+七U独立flow；Step15逐入口O/P库存 |
| 9 | Step10 | 七U完整矩阵；Step6 enum/conditionrefs |
| 10～15 | Step11～16各对应一章 | 成对存取、完整原结果、恢复、codec、资格、audit与测试 |
| 16 | Step17 | 全字段/DTO/Query/状态/phase复核与前置阅读 |
| 17 | Step18 | 10技术风险/12retainedID、相邻资格裁剪与重开 |
| 18 | 本Step与前序实际阅读来源 | 规范、正式上游、owner与校准入口 |

### 7.2 三层门禁

项目层授权范围为03正式装配；没有禁止本地设计装配的全局blocker，MP-UP/SRC/Q是受影响外部positive/生产资格，不得关闭或绕过。文档层Step1～18完成且19获授权。Step层历史差异、来源闭环与候选回填自检通过后才装配；每批核对对应Step§7/8/10，无新schema/错误/流程判断。当前 `gate_status=pass`（03文档自检），`gate_status=blocked`（03→04待用户明确确认、外部positive资格）；`next_allowed_action=等待审阅`。source_files为§2/7.1、[正式03](../03-详细设计.md)及[静态记录](03_ddd_static_review_step_11_19.md)，不得把完成解释为实施ready。

### 7.3 历史差异审计与分批装配

独立结论后已全文读取旧正式03并核对指纹 `424692d6281e4a0331d5930d72b4347082267646`。指纹仅识别历史文件，不是实施baseline、资产digest或运行证据。

| 旧稿位置 / 口径 | 与当前结论的差异 | 正式处理 / 来源 |
|---|---|---|
| §1/5/6 五部分与PackageRelease/InstallRecord/Subscription/Purchase/Entitlement/Rating/Ranking | 扩大当前市场局部truth；缺正式owner/范围授权 | 不继承；当前七模块+七U、43主对象，Step2/5/6 |
| §2 内容采集题与阶段、§15总结 | 过程材料混入正式契约，15章非现行18章 | 全部删除；Step19主链/逐章来源 |
| §3 单src树、抽象函数无完整返回 | 不承接六member+Web、typedcallable/Tx/49接口 | 使用Step4完整215planned路径与Step7/8/9 |
| §7.6 上架审核“视场景”、release无需审批 | 不能消费正式Gov决定并闭合currentbinding | 使用Step6/8/9正式Gov handoff与admission，scan/signature/ACK不批准 |
| §7.8/7.9 五marketplace事件 | 当前0activecanonicalevent，没有正式schema/SDKlane | 不继承事件/Bus/outbox；Step2/7/8 |
| §7.7 Listed→Released→Installed等跨主语状态 | 不是14carrier独立矩阵，未闭合guard/condition | 使用Step6/10的14carrier/222pairs/73合法迁移 |
| §9～11 install/commerce表、泛化retry与补偿 | 无commitframe/history/原fullresult/未知外效应边界 | 使用Step11～15，同Tx责任、原intentprobe、无Billing/Archive writer |
| §13/14 安装/支付/运营“最小可运行” | 文档结论不能证明运行或对端资格 | Step16/17/18证明上限，全部planned/not-run/blocked |

本单元自检：旧稿无当前独有必须保留而校准遗漏的契约；source truth不复制的红线已由当前更严格owner规则覆盖。MP-DDD-FIX-10只改本项目风险路径，不增215路径库存、不关闭资格。

装配分批按§1～4、七模块、索引/协议/flow/状态、§10～15、§16～18推进；每批约100～300行并自检来源/词汇/范围。

| 正式装配批次 | 实际产物 | 状态 / 当前门禁 |
|---|---|---|
| 删除与骨架 | 删除历史稿；18章各有具体来源/延伸阅读 | done；历史指纹已核，未继承旧真相 |
| §1～4 | 上游/范围/技术/六member+Web与215路径规范性清单 | done；来源Step1～4 |
| §5.0～5.3 | 向内图、contracts/domain/application独立八段契约 | done；完整43卡/typedport/callable来源明确 |
| §5.4～5.8 | infra/API/Worker/Web独立八段契约与收口摘要 | done；生产无fake、不新增入口 |
| §6 | 从已校准库存机械装配43对象/17ports/49协议索引 | done；生成时assert 43/17/146/49，无人工新增 |
| §7～9 | 全协议/49独立flow规范性详情、A/B及14carrier/全矩阵入口 | done；原O/P/Bframe与enum命名承接 |
| §10～12 | PG全store组/Frame/as-of、finite错误、原key/canonical/page | done；全部从11～13校准结论，不造SQL实现 |
| §13～15 | config七字段/八slot、有限埋点/Owork、全部最小测试来源 | done；不造04数值或执行结果 |
| §16～18 | 承接/完整风险/实际参考 | done；来源Step17/18/19 |
| 总审计 | 18章来源/完整索引/链接/围栏/矩阵/O-P/no-probe/范围 | done；实际结果见静态记录，03 completed / stop_review |

### 7.4 正式装配自检与修正收口

实际检查见[Step11～19静态记录](03_ddd_static_review_step_11_19.md)。19主Step十段、18章具体来源、七模块八段、43对象/17ports/146methods/49协议与独立flow、14carrier/222pairs/73A均与当前源契约核对；七paged caller/14签名、33finitecanonical、21C+八J O生产、B新frame、215planned路径及八SDK路径通过文档检查。完整细节为规范性附录，没有实施者自行补字段许可。

正式§1～18人工复核current披露、全原结果、同Tx审计/责任、原intentprobe、no-probe/report不足waiting、kind highwater不递归、无资产正文/财务/Archive writer。MP-DDD-FIX-11移除未经核验历史行数并纠错字；FIX-12标明旧Step4/10暂停历史并同步当前完成门禁，均只文档修正。范围内diff检查通过；无编译、PG/SDK/前端功能测试或运行证据。

## 8. 回填草稿

正式18章采用§7.1来源；每章开头有具体可点击校准文件及“延伸阅读”小节定位。正文只留收口契约与事实性风险，不回填SOP题目、诊断、方案比较、旧稿差异、模块停审或聊天。完整schema/签名/flow/矩阵引用明确为规范性，不能允许实施者自行补字段或替换命名。

## 9. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01及受影响Hub/Images/Obs/SDK资格均保留。03完成不是实现ready、风险接受、signoff或04授权；没有实现仓、commit、run、资产、扫描、支付或evidence。实施台账和全部planned boundary skeleton等正式07。

## 10. 自检与下一动作

输入/问题/取舍/来源/历史差异/路径回修与三层门自检完成；旧稿删除后正式18章全部装配，最终文档静态核验已完成，实际范围与证明上限见§7.4及静态记录。Step19 completed / selfcheck_done / stop_review；flow与项目台账同步03 completed / waiting_user_confirmation。当前立即停止，不进入04、不实现。下一阅读须用户明确确认后才是配置SOP/书写规范、正式§13与Step14/17/18及受影响owner配置合同；无需提交。
