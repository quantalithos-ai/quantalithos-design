# L6-bridges 00 Step 17：正式需求文档装配

> 状态：done / formal_stop_review；full-restart；16章装配及全文设计自检完成，等待用户审查00。

## 1. 状态与 Step 内计划

开工确认：恢复三层台账，已读Step1~16及五卡、需求SOP Step17、书写规范§2/4.16、通则正式正文/修订模式、中间产物规范三层门禁/写入前检查/回填门禁。前序语义/编号审计pass；preflight发现Step8/10/11/12的问题回答合并成段落，当时阻塞装配；已在B0回源补显式逐项映射并自检，不能冒称原先已满足。本Step按批次完成装配并立即停审，当前不得继续写正式正文或进入01。

| 批次 | 允许范围 | 来源判断 | 写入 | 审计 | 当前门禁 |
|---|---|---|---|---|---|
| B0 | 来源逐项问题与历史定位补审、装配门禁 | done | done | done | pass / next_batch |
| B1 | 删除旧00、创建16章骨架 | done | done | done | pass / next_batch |
| B2 | 正式§1~5 | done | done | done | pass / next_batch |
| B3 | 正式§6~8 | done | done | done | pass / next_batch |
| B4 | 正式§9 | done | done | done | pass / next_batch |
| B5 | 正式§10~12 | done | done | done | pass / next_batch |
| B6 | 正式§13~14 | done | done | done | pass / next_batch |
| B7 | 正式§15~16 | done | done | done | pass / next_batch |
| B8 | 全文静态/语义/范围审计与停审 | done | done | done | blocked / wait_for_user_confirmation_before_01 |

这些是当前Step的写入批次，不是未来文件创建许可。每批100~300行为参考，不限制全文长度；只在当前项目写，不建立01 flow或implementation ledger。

## 2. 输入

Step1~16§7结构化结论及§8摘录，五卡、Step14能力级设计停审和Step16跨能力审计；Step15风险/疑问及继承状态。旧00历史在Git原文件中存在；已读仅作后置冲突扫描，不据其重建新正文。

## 3. 动作要求逐项核对

| 要求 | 装配边界 |
|---|---|
| 只做重组/润色 | 每章摘录对应Step的§7已校准要求，不生成新功能/字段/接口或产品选择。 |
| 统一术语 | C-BR-1~5；human actor/AI GlobalMember/integration来源分开；owner提交与receipt分开。 |
| 统一编号 | 5G、11US、16FR、24BR、20DR、11IF、10DEP、16NFR、38AC、6VETO；R9/BR-UP10。 |
| 补齐交叉引用 | 16章各有单独具体校准来源与延伸阅读；主矩阵有简写字典/全局保护。 |
| 保留能力到章节 | 五节点分组在故事/FR/规则/数据/质量/验收出现；接口与追溯不变主归属。 |
| 不吸收未经停审输入 | Chat reference_only；上游资格冲突/材料/认证/probe缺口留风险，不润色成现成正向接口。 |
| 正式正文不承载过程 | 不复制SOP问题、旧材料诊断、取舍表、自检/停审记录或回流建议；风险当前挂起可保留。 |
| 整理发现缺口 | 当前已回Step8/10/11/12补逐项记录，语义不变；发现新语义缺口则回相应Step重审，不在本Step补。 |

## 4. 当前材料问题诊断

旧00目录/编号与新16章不一致，包含自动身份假设、低敏感默认审批、Turn/平台效果混同、SLA/4平台成功/批次/责任人等未经本轮确证口径。Step8/10~12虽有分节点结构与既有语义，但§3合并成散文、历史诊断部分未定位旧章节，当前补审只改对应过程材料，不改变§7正式结论。

## 5. 前后对比

| 装配前 | 装配后目标 | 理由 |
|---|---|---|
| 旧13章与旧F/US链 | 新16章及已校准唯一编号链 | full-restart不在旧文件叠补保留旧语义 |
| 阶段成功/选型/SLA混入需求 | 明确受限与unknown、seam未选状态 | 来源事实和运行证据分离 |
| 来源问题回答合并 | 对应Step逐项映射补审留痕 | 形式/审查缺口不能靠Step17润色遮蔽 |

## 6. 取舍与复杂度

采用先来源补审/三层门禁、再删除旧文件/骨架、按章分批摘录，全文允许超300行。未采用原位补丁、批量“全部done”、继承旧README或直接生成一份全新结论。正式章内只保需求语义，精确平台核验/状态/scope来源在具体延伸阅读。删除目标唯一为当前旧00，不触碰其他旧正式文档；Git保留原追踪版本，未做Git恢复或提交。

## 7. 结构化中间产物

preflight completed：回源补审已完成，已严格按下表来源装配；未新增需求结论。下表记录装配前的回填门禁，不授权停审后的写入。

### 7.1 来源补审进度

| 来源 | 缺口 | 修复范围 | 当前自检 |
|---|---|---|---|
| Step8 | 问题回答合并、历史定位不明确 | §3逐项七问题与§4/10过程记录；11US不变 | pass |
| Step10 | 问题回答合并 | §3九问题与§4/10过程记录；24BR不变 | pass |
| Step11 | 问题回答合并 | §3九问题与§4/10过程记录；20DR不变 | pass |
| Step12 | 问题回答合并 | §3十问题与§4/10过程记录；11IF/10DEP不变 | pass |

补审只修过程材料，Step16现有主/补矩阵不变；回填前读到的Step1/2旧`formal_document_write_allowed=false`更新为Step17三层门禁条件，避免历史阶段禁写字段被误当当前永久禁写。

### 7.2 逐章装配来源

| 正式章 | 唯一主来源 | 允许摘录范围 | 正式回填门禁 |
|---|---|---|---|
| 1 | `00_req_step_01_upstream_relation.md` | §7主题来源表、§8承接说明 | pass |
| 2 | `00_req_step_02_position_boundary.md` | §7四字段边界表及短段 | pass |
| 3 | `00_req_step_03_problem_context.md` | §7.1~7.3背景、问题及分类 | pass |
| 4 | `00_req_step_04_goals_non_goals.md` | §7.1/7.2目标非目标及验证姿态 | pass |
| 5 | `00_req_step_05_users_roles.md` | §7角色/条件权限/责任链 | pass |
| 6 | `00_req_step_06_consumers_dependencies.md` | §7.1~7.5两依赖表、三裁剪表和ASCII；seam§7.6延伸阅读 | pass |
| 7 | `00_req_step_07_core_capability_loop.md` | §7.1/7.2五节点定义/逻辑图/进入退出；五卡延伸阅读 | pass |
| 8 | `00_req_step_08_user_stories.md` | §7.1~7.5十一故事，不摘停审记录 | pass |
| 9 | `00_req_step_09_functional_requirements.md` | §7.1~7.8十六FR、输入输出失败、平台差异、阶段语义 | pass |
| 10 | `00_req_step_10_business_rules_boundaries.md` | §7五组二十四BR，不摘停审段 | pass |
| 11 | `00_req_step_11_data_ownership.md` | §7.1~7.6二十DR/四类型/生命周期/ref失效 | pass |
| 12 | `00_req_step_12_interfaces_dependencies.md` | §7.1~7.3十一IF、十DEP及同步异步姿态 | pass |
| 13 | `00_req_step_13_non_functional_requirements.md` | §7.1~7.6十六NFR，节点/全局区分，六类均适用 | pass |
| 14 | `00_req_step_14_acceptance_criteria.md` | §7.1~7.7三十八AC/六VETO及条件范围 | pass |
| 15 | `00_req_step_15_risks_open_questions.md` | §7.1/7.2九R/十BR-UP及受限范围；精确继承状态延伸阅读 | pass |
| 16 | `00_req_step_16_traceability_matrix.md` | §7.1~7.3主矩阵、补充映射、漏项检查及简写字典 | pass |

### 7.3 三层写入前检查

| 门禁层级 | 装配前事实 | 装配结论 |
|---|---|---|
| 项目级 | 用户授权全部00，唯一本项目/单agent/无commit；受影响正向合同缺口已转显式受限需求，无需求语义审计blocker | pass，仅当前00 |
| 文档级 | Step1~16 done/pass；五能力设计停审与跨能力审计完成；Step17 B0补审通过 | pass，逐批来源已读才写 |
| Step / 章节级 | 16来源有十段结构、思考/结构化/回填及自检，Step8/10~12补审完成；正式摘录限上表§7/8 | pass，不允许装配新结论 |

旧00删除前只读检查：Git tracked且当前无该文件dirty；旧文件blob=`d85b25827b926add82a910d75511e6787410803b`，由`git hash-object`实际读取，不是commit或运行证据。只删除该路径并用apply_patch重建，不删旧01~03/05/06/README或用户draft。

装配前写入检查结论：正式污染检查no；批次不替代长度完整性；BR-UP不能被装配改为ready。各批均按本表主来源核对摘录范围并同步恢复点；当前装配写权限已关闭。

### 7.4 装配批次审计

| 批次 | 写入前检查 | 写入后检查 | 结果与限制 |
|---|---|---|---|
| B6 | 串行重读三层恢复入口、Step13/14全文、需求规范§4.13/4.14、SOP Step17及通用门禁；思考done，三层pass，正文污染no | §13的16NFR、§14的38AC/6VETO全部逐行精确匹配对应来源；13张三列表无列数错误；`git diff --check -- projects/L6-bridges`无错误 | pass；仅文档静态检查，非项目测试；BR-UP状态不变，允许B7回读来源 |
| B7 | 已读Step15/16全文、需求规范§4.15/4.16；复读Conversation03 §7.4、Identity/Artifact当前实施状态、Workspace开放登记、Observability当前状态及12项原affected；简写字典回源格式补全，未新增关系；三层pass，正文污染no | 正式9R/10BR-UP精确匹配Step15 §7.1/7.2，主/补矩阵32行精确匹配Step16；5张表列数一致，diff whitespace无错误；漏项表只去除过程性Step引用 | pass；首次静态选择器误纳仅供延伸阅读的§7.3，限定正确来源重跑后19/19通过；非文档缺口/项目测试，允许B8 |
| B8 | 已读正式全文及Step1~16摘录来源、通用边界/回填规则；发现引用清单与主链值格式缺口后，只修已有结论的表达；无新语义 | 完成下表静态、来源、语义与范围复核，两个格式缺口修复后重新检查无剩余问题 | design_self_review=pass；formal_stop_review，用户审查not_evaluated，01仍blocked |

### 7.5 全文审计与修复记录

首次全文只读检查：16章/16来源区、33个唯一引用路径、51张表、2个text图均可定位，全部既有编号及FR主/补矩阵覆盖无漏项/未知ID。发现正式§16延伸阅读列出Step14，但该章来源区未列该文件；已按规范§2.3补齐既有引用，不新增需求、矩阵关系或来源结论。首次检查未提前报告全文pass，修复后完成复核。

来源表行对照：§13/14/15及主/补矩阵除漏项表的过程引用润色外精确匹配；§1~12存在去历史诊断、缩短句子、术语/编号简写与节点名称补全，已逐章回读对应§7/§8核对语义，不以精确字面匹配替代语义审查。§6.3五个主链值被简写为“条件分支”等，按已读Step6 §7.3恢复“是，条件分支/受blocker控制/按平台独立”，保持原范围，不新增依赖。

| 审计面 | 实际复核 | 设计检查结论 |
|---|---|---|
| 结构、来源与Markdown | 只读Node检查16连续正式章及16来源区、33个唯一相对/仓级路径存在、51张表无空单元格/列数错误、2个text图围栏闭合；补齐§16既有Step14引用 | pass；无空骨架、无未列校准来源、无过程性标题或TODO占位 |
| 编号与主追溯 | 5G/11US/16FR/24BR/20DR/11IF/10DEP/16NFR/38AC/6VETO/9R/10BR-UP定义完整；FR六列主矩阵16行，主/补映射missing/unknown为空；全局BR001/005/021、DR017~020、AC037/038未缩小范围 | pass；静态覆盖不是测试/验收通过 |
| 映射语义 | 16FR的故事/主C节点与§9.1一致；16项独立功能AC全部承接；BR/DR/IF分类与来源一致；§6.3主链值全部明确是/否；NFR/IF/DEP补充映射仍非package依赖 | pass；只润色来源，不造新功能或关系 |
| owner与责任 | 五能力均只持配置、受权relation/mapping、cursor/dedup、投递/回调/恢复局部记录；AI GlobalMember与human责任分开；Workspace只读；Policy/Gate、展示与action分别有当前依据 | pass；无自动身份、统一权限owner、本地审批或直接Runtime/Tools执行 |
| 阶段、效果与恢复 | ACK、owner结果/内部Turn、平台receipt、consumer disposition独立；platform_accepted非已读；timeout/lease失效/崩溃未知不盲重试、换identity/target；gap/dedup/预算及no-write约束未丢失 | pass；未虚报外部效果或任意自动恢复 |
| 平台、seam与材料 | 四平台独立installation/kind/消息/线程/变化/附件/callback/位置/限流下限；Discord3秒/15分钟有已读官方来源；Telegram仅片段核验，cloud缺口未关闭；SDK/OAuth/API Key/KMS/路由仍未选/未建立；禁止body/凭证/私有callback/敏感审批覆盖所有出口 | pass；无真实账号、secret、固定版本或投递成功声明 |
| 上游状态与并行输入 | 抽查Conversation03 §7.4、Identity/Artifact当前台账、Workspace开放项；逐项比对Observability12原affected状态全匹配，含covered_conditional/design_record_closed_implementation_open；Chat仍reference_only | pass；BR-UP-001~009 open，010 reference_only；无上游关闭/回写或用户/owner签署 |
| 文件范围与执行纪律 | calibration25个Markdown文件，17主Step十段结构完整，无01~07 flow/实施台账提前创建；未跟踪calibration无尾空白；tracked旧README/01~03/05/06的`git diff --exit-code`无差异；`git diff --check -- projects/L6-bridges`无错误 | pass；仅本项目设计材料，其他dirty保留；无代码、项目测试、真实证据或commit |

本恢复轮实际修改：`00-需求文档.md`、`00_req_step_16_traceability_matrix.md`（既有简写格式）、本Step17、`00_requirements_calibration_flow.md`及`project_execution_ledger.md`。全部检查为实际执行的只读文档静态检查和当前agent设计复核；没有项目测试run、artifact/report/evidence/verdict/signoff/readiness。

## 8. 回填草稿

正式16章已按§7.2主来源逐章摘录，章节前具体校准来源/延伸阅读指向有效文件。正文没有本Step新推导；schema/SDK选择/实现仓等未收口项未临时补写，具体限制仍在§15。

## 9. 待确认事项

BR-UP-001~009仍open、010 reference_only；不阻塞当前保护/失败需求成文，但阻塞受影响正向资格及运行声明。用户尚未审查本轮正式00；01和实现未获准。

## 10. 完成与停审条件

preflight与装配前三层门禁pass；B0~B8顺序完成，16章摘录及批次审计、全文路径/围栏/编号/表结构/污染/边界/范围检查完成，当前立即formal_stop_review。设计自检pass不等用户审查、owner确认或运行验收。正式写权限关闭；等待用户明确确认00后才可启动01，并先读取架构SOP、书写规范、正式00及对应上游来源。

```text
gate_status = blocked
gate_reason = formal_00_complete_awaiting_user_confirmation_before_01
current_module = formal_stop_review
next_allowed_action = wait_for_user_confirmation_before_01
source_files = Step1~16
formal_00_design_self_review = pass
user_review = not_evaluated
formal_00_assembly_allowed = false
next_document_allowed = false
implementation_ledger_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```
