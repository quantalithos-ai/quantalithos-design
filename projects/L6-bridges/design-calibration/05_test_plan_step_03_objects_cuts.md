# L6-bridges 05 Step3：对象与切口

## 1. Step状态与开工确认

2026-10-04；仅05获授权；full-restart / single-agent-serial。此步先骨架，不提前创建未来Step或正式正文。

| 模块 | 骨架 | 思考 | 写入 | 自检 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|---|---|---|
| objects_cuts | done | done | done | pass_design_static | pass | step_design_review_complete_external_gates_open | begin_step04_skeleton | 本Step§2/7；实际静态审计 |

### Step内计划

| 小阶段 | 状态 |
|---|---|
| 输入/前序阅读 | done |
| SOP问题回答 | done |
| 当前材料诊断 | done |
| 测试设计取舍 | done |
| 结构化/逐切口停审 | done |
| 复杂度与批次判断 | done |
| 回填草稿 | done |
| 实际自检/下一条件 | done |

## 2. 本步输入

已回读Step2范围/未决、03§15全文、§16.6/16.7 exact enum与函数及04§12.2十二切口；复核SOP Step3的十问题/书写§5.3。源§8完整schema/§9矩阵/§10持久化仍唯一，必要字段负向不复制另定义。

## 3. SOP问题回答

1. 19Domain的factory/rehydrate/pure guard及17durable机单测；immutable两对象/view分别无机。
2. application逐19flow验证参数/顺序/current/wholeUoW/异常与0禁副作用；不只按技术层命名切口。
3. 八repo/UoW及four adapters/owner clients/worker须local契约与real资格分层。
4. 20协议都做codec和正反flow，O01条件输出不造独立entry。
5. key/cursor/rate/recovery/local分别单列，不能合称稳定性。
6. 每schema required逐字段删除、错型/错owner/错scope/缺Slot；DTO构造完整不允许dummy。
7. 状态逐字使用03 enum，包括Valid而非Linked identity、Claimed而非Reserved attempt、StoppedWithUnknown而非StoppedKnown。
8. 每cut具名source/对象/风险/target见逐切口表。
9. 03§15七模块/20协议/21机/四平台/一致性/禁材及04十二切口无孤儿；脚本待Step9反校准。
10. 每cut写入后立即局部结构审查；全cut后检查重复/phase/未承接来源。

## 4. 当前材料问题诊断

大量对象不能逐类堆重复case；选canonical cut以风险/phase为轴，继承精确schema和矩阵，由参数化case覆盖每字段与pair。技术target简称不是cut，也不是测试结果。

## 5. 改动前后对比

| 原风险 | 收敛 |
|---|---|
| 一对象一摘要但guard遗漏 | 22canonical cuts+20协议/21机参数化完整枚举 |
| 状态口语导致不可能迁移 | exact enum/member/guard来源固定03§9/16.6 |
| 同一fake吞掉平台差异 | inbound/change/rate/real四平台分别参数 |
| 配置/报告工具游离P0 | CONFIG/PRIVATE/EVIDENCE/REAL独立cut |

## 6. 测试设计取舍与复杂度

22cut分别小循环写入并停审，整体约100行总表但各行完整风险/phase/target；Step6按cut再展开TC/DS/suite/EV。这里只列后续用例要求，不抢做用例矩阵。批量结构检查不替代逐cut语义判断。

## 7. 结构化中间产物

### 7.1 Planned target索引

所有路径仅planned/not_run；support仅原application/tests/support/{mod,qualified_ports}.rs与infra/tests/support/{mod,qualified_providers}.rs，不导出production lib或作provider fallback。

| target | 03原planned路径 |
|---|---|
| S | `crates/contracts/tests/protocol_surface_tests.rs` |
| D | `crates/domain/tests/local_guards_tests.rs` |
| A | `crates/application/tests/authorization_flow_tests.rs` |
| C | `crates/application/tests/continuity_flow_tests.rs` |
| R | `crates/application/tests/safe_read_tests.rs` |
| B | `crates/infra/tests/platform_boundary_tests.rs` |
| L | `crates/infra/tests/local_commit_boundary_tests.rs` |
| P | `crates/infra/tests/private_material_boundary_tests.rs` |
| I | `crates/api/tests/inbound_dispatch_tests.rs` |
| W | `crates/worker/tests/consumer_dispatch_tests.rs` |
| J | `crates/jobs/tests/job_invocation_tests.rs` |

### 7.2 Canonical cut登记

全部P0，风险与后续断言不弱化源合同；本表目标非通过结果。

| 切口/测试对象 | 设计真相源 | 必须验证的字段/状态/协议/错误及风险 | target |
|---|---|---|---|
| CUT-BR-SURFACE 公开协议与构造：C01~C06/Q01~Q04/E01~E04/O01/J01~J05；19Domain+View | 03§8/15.1/16.3~16.5 | exact fields/required/enum/type、core metadata、ManagementBody变义、private排除；不得缺Slot或冒别名 | S/D |
| CUT-BR-BIND 配置与显式授权关系：BridgeInstallation/ExternalBinding；config/local/generation独立 | 03§8 C01/C02/§9 M01/M02/§15.1 | 平台安装≠binding授权；Pending不能循环授Active；撤销/旧generation/current/expected；外部admin不授权 | A/C/L/D |
| CUT-BR-MAP 三映射与双端回链：ExternalIdentityMapping/ExternalLocationMapping/ExternalMessageMapping | 03§8 C03/§9 M03~M05/§15.1 | installation/kind/generation隔离、0/1/多命中、known才link、Stale/Revoked/Tombstoned；external_id非GlobalMember | A/B/C/L/D |
| CUT-BR-INBOUND 可信入站及正式对话交接：verified Private、InboundHandoffRecord、Conversation port | 03§8 E01/§9 M06/§15.1 | 验签/时效/marker/回环/owner mode/safe ref、claim actual commit先于owner；ACK独立 | I/W/B/A/C/L/P |
| CUT-BR-CHANGE 编辑删除线程差异：原mapping/source version、location/message/gap | 03§8 E01/C03/§9 M04/M05/M13/M14/§15.2 | create/edit/delete原ref、source可比、unsupported不伪新发言；不删除内部truth/换channel | B/A/C/D/L |
| CUT-BR-PRESENT 安全外显与敏感Gate：SafePresentationPlan；source/visibility/Policy/Gate refs | 03§8 C04/E02/§9 M07/§15.2 | committed source、存在性/提示/入口/action逐项proof；不公开敏感内容、不默认低敏感可操作 | A/C/S/P/L |
| CUT-BR-ATTACH 受控附件引用：Artifact authorized ref/Grant、private renderer | 03§8 C04/E01/§13/§15.2 | 双向准入/传播/current/expiry，必要缺失blocked；允许省略另有owner依据；不落bytes/hash/token URL | A/B/P/S |
| CUT-BR-DELIVERY 原逻辑效果与receipt：DeliveryIntent/DeliveryAttempt/PlatformReceipt | 03§8 C04/J01/§9 M08/M09/§10.3/§15.2 | A/B/C实际commit、same effect一次dispatch、HTTP业务结果、known finalize失败不重发；immutable receipt | A/B/C/L/J/W/P |
| CUT-BR-CALLBACK 来源认证/动作授权/one-use：ExternalActionBinding/CallbackHandoffRecord；owner action port | 03§8 C05/E03/§9 M10/M11/§15.2 | actor/source/target/action/revision/expiry全部current，双回调claim原子，ACK非Decision/不直执行 | A/B/C/L/I/W/P |
| CUT-BR-KEY 稳定key与重放/expiry：六operation namespace/ManagementBody/DedupRecord | 03§11/§9 M12/§8 J05/§15.2 | same key same meaning原完整result；变义/跨域拒；target与Job两key/op同U，expiry不清key/result/unknown | S/D/A/C/L/J |
| CUT-BR-CURSOR cursor/gap分阶段进度：StreamCursor/GapRecord/Comparator/full coverage proof | 03§8 J03/§9 M13/M14/§15.2 | same epoch After才推进；B闭gap与C新stageproof独立；opaque不得字符串排序/空页假覆盖 | B/C/D/L/J |
| CUT-BR-RATE lane/限流/原retry预算：DispatchLane、全部shared scope/bounds、original budget | 03§8 J01/J02/§9 M15/§11~12/§15.2 | unresolved head阻后继、取max下界，429/remaining/cancel/lease不造NoEffect；禁SDK暗retry | B/C/D/L/J/W |
| CUT-BR-RECOVERY 原operation权威恢复：RecoveryRecord；LocalCommit/Owner/Platform/Consumer原subject | 03§8 C06/J02/J03/J04/§9 M16/§15.2 | readonly原身份权威probe、四proof不互替；NotFound/timeout/TTL不NoEffect；无权限manual/blocked | A/B/C/L/J |
| CUT-BR-LOCAL wholeCAS及实际commit：19logical collections、八repo/UoW、same driver seal/journal | 03§10.1~10.4/§15.2 | 全expected/unique/write set、失败rollback零partial；ACK lost只原mutation恢复，不另apply/commit | L/C/A |
| CUT-BR-READ 纯安全Query：BridgeLocalView；resolver/full committed snapshot | 03§8 Q01~Q04/§16.4/§15.2 | resolver-first/current/visibility，Denied/Unavailable/hidden不假empty；0write/probe/ID/repair/audit | R/S/P |
| CUT-BR-AUDIT 安全材料/正式consumer交接：SafeAuditRecord/SafeHandoffRecord；正式producer/schema | 03§8 E04/O01/J04/§9 M17/§15.2 | actual同U材料、O01九字段、original consumer op、NonRecursiveResultOnly；mandatory不足先阻，ACK非Accepted/EV | A/C/L/P/S/W/J |
| CUT-BR-CONFIG 完整配置consumer及错误：82项/20域/22CF/27F/CFG-CUT-001~012 | 04§7/9/11/12.2；03§13 | 单JSON/严格parse/三个entry参数/required闭包/五环境/secret/cold rollback；不隐式default或激活 | B/S/A/L/R/I/J/W/P/C/D |
| CUT-BR-PRIVATE private/secret/所有禁材出口：owning/短借、exact五用途provider/key/revision/scope/window | 03§13~15；04§8 | synthetic内存canary跨wire/durable/log/trace/metric/report/error/SDK Debug；raw/可还原派生为0要求 | P/S/B/A/I/W/J/L |
| CUT-BR-ENTRY api/jobs/worker运行资源：七bin/19callable、RuntimeExecutionState/JobInvocationState/SourceSession/WorkerBatch | 03§7外层/§8 J/§9 M18~M21/§15；04§12 CFG-CUT-011 | source排他/owning单inflight/current，stop-time newbudget同tuple checked、cancel未知并集、summary actual | I/W/J/B/C/P/L |
| CUT-BR-STATE 全部状态pair与guard：M01~M21；PlatformReceipt/SafeAuditRecord immutable、View无机 | 03§9/§16.6/§15.2 | 101 labels/150 allowed pairs=123durable+27technical；未列pair拒/失败原对象不变/factory不计 | D/A/C/L/I/W/J/B/S/R |
| CUT-BR-EVIDENCE 测试工具/证据真实性：local test-harness DTO/runner/report writer；不增加production协议 | 03§15脚本边界；00 AC037/038；测试规范§4.6/5.13 | planned不passed、fixed run/sha256/schema/TC关联/redaction、故障安全留存；真实实例不从静态表生成 | S/P（test-only harness） |
| CUT-BR-REAL actual seam准入与四平台兼容：core/SDK compile、六owner/Bus、四platform、DB/executor/secret/producer | 03§14~17；04§14/平台核验附录 | 实际pin/manifest/driver/account/scope/grant/route/current/producer注册缺失blocked；fake不释放 | B/L/I/W/J/A/C/P |

### 7.3 跨切口来源审查

22切口已逐一写入、读取目标行/核对源§15对应条目与phase后停审；没有新schema/state/target。跨审：七role、20协议（条件O01不entry）、19flow、21机与immutable/view、19logical collections/wholeUoW、四平台、禁材全部承接；04 CFG-CUT-001~012→CONFIG并横切ENTRY/PRIVATE/READ等，无孤儿P0。平台SDK/secret/路由实际资格由REAL承接，不由local通过释放。


## 8. 回填草稿

正文§3保§7.1/7.2及总承接规则，逐cut过程审查放本Step§10，不把pass列搬正文。

## 9. 待确认事项

actual来源/资格继续blocked；不在本Step发明script或新Rust test文件。22cut是否覆盖全部03最小清单在完成后实际复核。

## 10. 自检与进入下一步条件

恢复修正：逐row append曾留下行间空行，结构检查未识别孤立表行；进入Step4前已只修表格连续性，新增“表块第二行须delimiter”检查并复跑，不改变22cut合同或抢做Step4。

实际自检：22cut逐写逐核；十一target exact，20协议/19flow/21机/12CFG切口与禁材/real门禁无孤儿；所有cut保持P0及planned。已运行当前05校准Markdown/编号章节/相对文件链接检查，errors=[]；仅设计静态，不是项目测试或运行证据。

self_review=pass_design_static_external_gates_open；gate_status=pass；gate_reason=step_design_review_complete_external_gates_open；next_allowed_action=begin_step04_skeleton；source_files=本Step§2/7及对应SOP/规范。
formal_document_write_allowed=false；implementation_write_allowed=false；test_execution_allowed=false；commit_required=false。
