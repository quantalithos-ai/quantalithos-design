# L6-bridges 05 Step15 跨文档与逐切口复核

> 2026-10-04；design-only，full-restart / single-agent-serial；当前05正式装配准入前审查。以下不是test运行结果/EV实例/owner签署。

## 1. 真相源表

| 设计事实 | 唯一源 | 当前05消费者/冲突规则 |
|---|---|---|
| 能力/规则/数据/NFR/AC/VETO | 正式00§9~14；01/02ownership | Step1/2/5/10/12/14；不新增需求/owner |
| field/type/factory/DTO来源 | 正式03§5/7/8/10/16.2/16.3 | 下述逐191field/构造链只加TC/EV，原合同不重定义 |
| enum/member/guard/pair | 正式03§9/16.6 | state_pair_registry exact21机/150pair；未列拒，非genericsetter |
| Query/publicwire/metadata | 正式03§7/8/16.4/16.5 | READ/SURFACE/STATE/PRIVATE切口；zero-write/唯一core |
| actualU/key/unknown/cursor/rate | 正式03§8~12/16.8 | LOCAL/KEY/CURSOR/RATE/RECOVERY；四proof不互证 |
| config/secret/stopbudget | 正式04§7~14及CFG-03-001 | CONFIG12/PRIVATE/ENTRY，82key/CF22/F27，secretref不输出 |
| TC/DS/suite/script/harnessschema/EVplan | 当前05 Step3~13/design-only registries | planned，不是runtime evidence；TEST-03-001具名反校准 |
| 上游actual资格/实施状态 | 七上游正式合同与必要ledger、04原状态 | BR-UP/WS/affected继承，synthetic不解除 |
| 06/07/readiness | 尚未获用户授权的新正式基线 | 旧06historical；没有实施ledger/boundary/run/verdict |

### 1.1 当前纠正的逐切口小循环

前步共享问题/诊断后逐cut写/局部检查，书面独立思考记录不足。本次每cut先重新读取03/04来源与TC/DS/suite/EV，再写本段独立问题/诊断/取舍/复杂度与审查门禁。不得回填为前步当时已完成，正式准入仍等待下面全部cut审查。

#### CUT-BR-SURFACE

问题回答：本切口正式对象=C01~C06/Q01~Q04/E01~E04/O01/J01~J05；19Domain+View；唯一源=03§8/15.1/16.3~16.5，完整TC=TC-SURFACE-001、TC-SURFACE-002、TC-SURFACE-003、TC-SURFACE-004，DS-SURFACE-001，suite=SUITE-S/SUITE-C/SUITE-D，plannedEV=EV-CONTRACT-001。本cut是否可以由其他phase/owner成功代替：不能，断言只在原来源/current/实际U或原foreignproof阶段。

诊断：exact fields/required/enum/type、core metadata、ManagementBody变义、private排除；不得缺Slot或冒别名。若只主链/通用成功或syntheticproof，无法证明上述风险不存在；每字段/状态/expected/callback/source变异必须独立实例而非复合happyfixture。

取舍：保原完整schema/enum/member/guard和sourcekey；合法主线及保护性拒绝采用对应TC，unknown只原identityreadonly权威probe/manual。DSfresh构造，duplicate/recovery故意共享original；suite按原module路由，EV只能真实case/suite产生，不从静态计划制造。

复杂度/写入：当前只独立复核记录，无新需求/TC/业务合同；完整case/DS/suite/EV表分别保持原源。实际逐行核对TC输入/预期/参数/禁止副作用与DS/state/资格/计划EV路径，局部结构检查后才进入下一cut。

gate_status=pass；gate_reason=cut_design_review_complete_runtime_not_established；next_allowed_action=review_next_cut；source_files=03§8/15.1/16.3~16.5、05 Step6/7/9/13；formal_document_write_allowed=false。该pass仅当前设计审查，无run/actualqualification/result。

#### CUT-BR-BIND

问题回答：本切口正式对象=BridgeInstallation/ExternalBinding；config/local/generation独立；唯一源=03§8 C01/C02/§9 M01/M02/§15.1，完整TC=TC-BIND-001、TC-BIND-002、TC-BIND-003、TC-BIND-004，DS-BIND-001，suite=SUITE-A，plannedEV=EV-CONTRACT-002。本cut是否可以由其他phase/owner成功代替：不能，断言只在原来源/current/实际U或原foreignproof阶段。

诊断：平台安装≠binding授权；Pending不能循环授Active；撤销/旧generation/current/expected；外部admin不授权。若只主链/通用成功或syntheticproof，无法证明上述风险不存在；每字段/状态/expected/callback/source变异必须独立实例而非复合happyfixture。

取舍：保原完整schema/enum/member/guard和sourcekey；合法主线及保护性拒绝采用对应TC，unknown只原identityreadonly权威probe/manual。DSfresh构造，duplicate/recovery故意共享original；suite按原module路由，EV只能真实case/suite产生，不从静态计划制造。

复杂度/写入：当前只独立复核记录，无新需求/TC/业务合同；完整case/DS/suite/EV表分别保持原源。实际逐行核对TC输入/预期/参数/禁止副作用与DS/state/资格/计划EV路径，局部结构检查后才进入下一cut。

gate_status=pass；gate_reason=cut_design_review_complete_runtime_not_established；next_allowed_action=review_next_cut；source_files=03§8 C01/C02/§9 M01/M02/§15.1、05 Step6/7/9/13；formal_document_write_allowed=false。该pass仅当前设计审查，无run/actualqualification/result。

#### CUT-BR-MAP

问题回答：本切口正式对象=ExternalIdentityMapping/ExternalLocationMapping/ExternalMessageMapping；唯一源=03§8 C03/§9 M03~M05/§15.1，完整TC=TC-MAP-001、TC-MAP-002、TC-MAP-003、TC-MAP-004、TC-MAP-005，DS-MAP-001，suite=SUITE-A，plannedEV=EV-CONTRACT-003。本cut是否可以由其他phase/owner成功代替：不能，断言只在原来源/current/实际U或原foreignproof阶段。

诊断：installation/kind/generation隔离、0/1/多命中、known才link、Stale/Revoked/Tombstoned；external_id非GlobalMember。若只主链/通用成功或syntheticproof，无法证明上述风险不存在；每字段/状态/expected/callback/source变异必须独立实例而非复合happyfixture。

取舍：保原完整schema/enum/member/guard和sourcekey；合法主线及保护性拒绝采用对应TC，unknown只原identityreadonly权威probe/manual。DSfresh构造，duplicate/recovery故意共享original；suite按原module路由，EV只能真实case/suite产生，不从静态计划制造。

复杂度/写入：当前只独立复核记录，无新需求/TC/业务合同；完整case/DS/suite/EV表分别保持原源。实际逐行核对TC输入/预期/参数/禁止副作用与DS/state/资格/计划EV路径，局部结构检查后才进入下一cut。

gate_status=pass；gate_reason=cut_design_review_complete_runtime_not_established；next_allowed_action=review_next_cut；source_files=03§8 C03/§9 M03~M05/§15.1、05 Step6/7/9/13；formal_document_write_allowed=false。该pass仅当前设计审查，无run/actualqualification/result。

#### CUT-BR-INBOUND

问题回答：本切口正式对象=verified Private、InboundHandoffRecord、Conversation port；唯一源=03§8 E01/§9 M06/§15.1，完整TC=TC-INBOUND-001、TC-INBOUND-002、TC-INBOUND-003、TC-INBOUND-004、TC-INBOUND-005，DS-INBOUND-001，suite=SUITE-I，plannedEV=EV-CONTRACT-004。本cut是否可以由其他phase/owner成功代替：不能，断言只在原来源/current/实际U或原foreignproof阶段。

诊断：验签/时效/marker/回环/owner mode/safe ref、claim actual commit先于owner；ACK独立。若只主链/通用成功或syntheticproof，无法证明上述风险不存在；每字段/状态/expected/callback/source变异必须独立实例而非复合happyfixture。

取舍：保原完整schema/enum/member/guard和sourcekey；合法主线及保护性拒绝采用对应TC，unknown只原identityreadonly权威probe/manual。DSfresh构造，duplicate/recovery故意共享original；suite按原module路由，EV只能真实case/suite产生，不从静态计划制造。

复杂度/写入：当前只独立复核记录，无新需求/TC/业务合同；完整case/DS/suite/EV表分别保持原源。实际逐行核对TC输入/预期/参数/禁止副作用与DS/state/资格/计划EV路径，局部结构检查后才进入下一cut。

gate_status=pass；gate_reason=cut_design_review_complete_runtime_not_established；next_allowed_action=review_next_cut；source_files=03§8 E01/§9 M06/§15.1、05 Step6/7/9/13；formal_document_write_allowed=false。该pass仅当前设计审查，无run/actualqualification/result。

#### CUT-BR-CHANGE

问题回答：本切口正式对象=原mapping/source version、location/message/gap；唯一源=03§8 E01/C03/§9 M04/M05/M13/M14/§15.2，完整TC=TC-CHANGE-001、TC-CHANGE-002、TC-CHANGE-003、TC-CHANGE-004，DS-CHANGE-001，suite=SUITE-B，plannedEV=EV-CONTRACT-005。本cut是否可以由其他phase/owner成功代替：不能，断言只在原来源/current/实际U或原foreignproof阶段。

诊断：create/edit/delete原ref、source可比、unsupported不伪新发言；不删除内部truth/换channel。若只主链/通用成功或syntheticproof，无法证明上述风险不存在；每字段/状态/expected/callback/source变异必须独立实例而非复合happyfixture。

取舍：保原完整schema/enum/member/guard和sourcekey；合法主线及保护性拒绝采用对应TC，unknown只原identityreadonly权威probe/manual。DSfresh构造，duplicate/recovery故意共享original；suite按原module路由，EV只能真实case/suite产生，不从静态计划制造。

复杂度/写入：当前只独立复核记录，无新需求/TC/业务合同；完整case/DS/suite/EV表分别保持原源。实际逐行核对TC输入/预期/参数/禁止副作用与DS/state/资格/计划EV路径，局部结构检查后才进入下一cut。

gate_status=pass；gate_reason=cut_design_review_complete_runtime_not_established；next_allowed_action=review_next_cut；source_files=03§8 E01/C03/§9 M04/M05/M13/M14/§15.2、05 Step6/7/9/13；formal_document_write_allowed=false。该pass仅当前设计审查，无run/actualqualification/result。

#### CUT-BR-PRESENT

问题回答：本切口正式对象=SafePresentationPlan；source/visibility/Policy/Gate refs；唯一源=03§8 C04/E02/§9 M07/§15.2，完整TC=TC-PRESENT-001、TC-PRESENT-002、TC-PRESENT-003、TC-PRESENT-004，DS-PRESENT-001，suite=SUITE-A，plannedEV=EV-CONTRACT-006。本cut是否可以由其他phase/owner成功代替：不能，断言只在原来源/current/实际U或原foreignproof阶段。

诊断：committed source、存在性/提示/入口/action逐项proof；不公开敏感内容、不默认低敏感可操作。若只主链/通用成功或syntheticproof，无法证明上述风险不存在；每字段/状态/expected/callback/source变异必须独立实例而非复合happyfixture。

取舍：保原完整schema/enum/member/guard和sourcekey；合法主线及保护性拒绝采用对应TC，unknown只原identityreadonly权威probe/manual。DSfresh构造，duplicate/recovery故意共享original；suite按原module路由，EV只能真实case/suite产生，不从静态计划制造。

复杂度/写入：当前只独立复核记录，无新需求/TC/业务合同；完整case/DS/suite/EV表分别保持原源。实际逐行核对TC输入/预期/参数/禁止副作用与DS/state/资格/计划EV路径，局部结构检查后才进入下一cut。

gate_status=pass；gate_reason=cut_design_review_complete_runtime_not_established；next_allowed_action=review_next_cut；source_files=03§8 C04/E02/§9 M07/§15.2、05 Step6/7/9/13；formal_document_write_allowed=false。该pass仅当前设计审查，无run/actualqualification/result。

#### CUT-BR-ATTACH

问题回答：本切口正式对象=Artifact authorized ref/Grant、private renderer；唯一源=03§8 C04/E01/§13/§15.2，完整TC=TC-ATTACH-001、TC-ATTACH-002、TC-ATTACH-003、TC-ATTACH-004，DS-ATTACH-001，suite=SUITE-A/SUITE-B，plannedEV=EV-CONTRACT-007。本cut是否可以由其他phase/owner成功代替：不能，断言只在原来源/current/实际U或原foreignproof阶段。

诊断：双向准入/传播/current/expiry，必要缺失blocked；允许省略另有owner依据；不落bytes/hash/token URL。若只主链/通用成功或syntheticproof，无法证明上述风险不存在；每字段/状态/expected/callback/source变异必须独立实例而非复合happyfixture。

取舍：保原完整schema/enum/member/guard和sourcekey；合法主线及保护性拒绝采用对应TC，unknown只原identityreadonly权威probe/manual。DSfresh构造，duplicate/recovery故意共享original；suite按原module路由，EV只能真实case/suite产生，不从静态计划制造。

复杂度/写入：当前只独立复核记录，无新需求/TC/业务合同；完整case/DS/suite/EV表分别保持原源。实际逐行核对TC输入/预期/参数/禁止副作用与DS/state/资格/计划EV路径，局部结构检查后才进入下一cut。

gate_status=pass；gate_reason=cut_design_review_complete_runtime_not_established；next_allowed_action=review_next_cut；source_files=03§8 C04/E01/§13/§15.2、05 Step6/7/9/13；formal_document_write_allowed=false。该pass仅当前设计审查，无run/actualqualification/result。

#### CUT-BR-DELIVERY

问题回答：本切口正式对象=DeliveryIntent/DeliveryAttempt/PlatformReceipt；唯一源=03§8 C04/J01/§9 M08/M09/§10.3/§15.2，完整TC=TC-DELIVERY-001、TC-DELIVERY-002、TC-DELIVERY-003、TC-DELIVERY-004、TC-DELIVERY-005，DS-DELIVERY-001，suite=SUITE-C，plannedEV=EV-CONTRACT-008。本cut是否可以由其他phase/owner成功代替：不能，断言只在原来源/current/实际U或原foreignproof阶段。

诊断：A/B/C实际commit、same effect一次dispatch、HTTP业务结果、known finalize失败不重发；immutable receipt。若只主链/通用成功或syntheticproof，无法证明上述风险不存在；每字段/状态/expected/callback/source变异必须独立实例而非复合happyfixture。

取舍：保原完整schema/enum/member/guard和sourcekey；合法主线及保护性拒绝采用对应TC，unknown只原identityreadonly权威probe/manual。DSfresh构造，duplicate/recovery故意共享original；suite按原module路由，EV只能真实case/suite产生，不从静态计划制造。

复杂度/写入：当前只独立复核记录，无新需求/TC/业务合同；完整case/DS/suite/EV表分别保持原源。实际逐行核对TC输入/预期/参数/禁止副作用与DS/state/资格/计划EV路径，局部结构检查后才进入下一cut。

gate_status=pass；gate_reason=cut_design_review_complete_runtime_not_established；next_allowed_action=review_next_cut；source_files=03§8 C04/J01/§9 M08/M09/§10.3/§15.2、05 Step6/7/9/13；formal_document_write_allowed=false。该pass仅当前设计审查，无run/actualqualification/result。

#### CUT-BR-CALLBACK

问题回答：本切口正式对象=ExternalActionBinding/CallbackHandoffRecord；owner action port；唯一源=03§8 C05/E03/§9 M10/M11/§15.2，完整TC=TC-CALLBACK-001、TC-CALLBACK-002、TC-CALLBACK-003、TC-CALLBACK-004、TC-CALLBACK-005，DS-CALLBACK-001，suite=SUITE-A/SUITE-P，plannedEV=EV-CONTRACT-009。本cut是否可以由其他phase/owner成功代替：不能，断言只在原来源/current/实际U或原foreignproof阶段。

诊断：actor/source/target/action/revision/expiry全部current，双回调claim原子，ACK非Decision/不直执行。若只主链/通用成功或syntheticproof，无法证明上述风险不存在；每字段/状态/expected/callback/source变异必须独立实例而非复合happyfixture。

取舍：保原完整schema/enum/member/guard和sourcekey；合法主线及保护性拒绝采用对应TC，unknown只原identityreadonly权威probe/manual。DSfresh构造，duplicate/recovery故意共享original；suite按原module路由，EV只能真实case/suite产生，不从静态计划制造。

复杂度/写入：当前只独立复核记录，无新需求/TC/业务合同；完整case/DS/suite/EV表分别保持原源。实际逐行核对TC输入/预期/参数/禁止副作用与DS/state/资格/计划EV路径，局部结构检查后才进入下一cut。

gate_status=pass；gate_reason=cut_design_review_complete_runtime_not_established；next_allowed_action=review_next_cut；source_files=03§8 C05/E03/§9 M10/M11/§15.2、05 Step6/7/9/13；formal_document_write_allowed=false。该pass仅当前设计审查，无run/actualqualification/result。

#### CUT-BR-KEY

问题回答：本切口正式对象=六operation namespace/ManagementBody/DedupRecord；唯一源=03§11/§9 M12/§8 J05/§15.2，完整TC=TC-KEY-001、TC-KEY-002、TC-KEY-003、TC-KEY-004、TC-KEY-005，DS-KEY-001，suite=SUITE-C，plannedEV=EV-CONTRACT-010。本cut是否可以由其他phase/owner成功代替：不能，断言只在原来源/current/实际U或原foreignproof阶段。

诊断：same key same meaning原完整result；变义/跨域拒；target与Job两key/op同U，expiry不清key/result/unknown。若只主链/通用成功或syntheticproof，无法证明上述风险不存在；每字段/状态/expected/callback/source变异必须独立实例而非复合happyfixture。

取舍：保原完整schema/enum/member/guard和sourcekey；合法主线及保护性拒绝采用对应TC，unknown只原identityreadonly权威probe/manual。DSfresh构造，duplicate/recovery故意共享original；suite按原module路由，EV只能真实case/suite产生，不从静态计划制造。

复杂度/写入：当前只独立复核记录，无新需求/TC/业务合同；完整case/DS/suite/EV表分别保持原源。实际逐行核对TC输入/预期/参数/禁止副作用与DS/state/资格/计划EV路径，局部结构检查后才进入下一cut。

gate_status=pass；gate_reason=cut_design_review_complete_runtime_not_established；next_allowed_action=review_next_cut；source_files=03§11/§9 M12/§8 J05/§15.2、05 Step6/7/9/13；formal_document_write_allowed=false。该pass仅当前设计审查，无run/actualqualification/result。

#### CUT-BR-CURSOR

问题回答：本切口正式对象=StreamCursor/GapRecord/Comparator/full coverage proof；唯一源=03§8 J03/§9 M13/M14/§15.2，完整TC=TC-CURSOR-001、TC-CURSOR-002、TC-CURSOR-003、TC-CURSOR-004，DS-CURSOR-001，suite=SUITE-C，plannedEV=EV-CONTRACT-011。本cut是否可以由其他phase/owner成功代替：不能，断言只在原来源/current/实际U或原foreignproof阶段。

诊断：same epoch After才推进；B闭gap与C新stageproof独立；opaque不得字符串排序/空页假覆盖。若只主链/通用成功或syntheticproof，无法证明上述风险不存在；每字段/状态/expected/callback/source变异必须独立实例而非复合happyfixture。

取舍：保原完整schema/enum/member/guard和sourcekey；合法主线及保护性拒绝采用对应TC，unknown只原identityreadonly权威probe/manual。DSfresh构造，duplicate/recovery故意共享original；suite按原module路由，EV只能真实case/suite产生，不从静态计划制造。

复杂度/写入：当前只独立复核记录，无新需求/TC/业务合同；完整case/DS/suite/EV表分别保持原源。实际逐行核对TC输入/预期/参数/禁止副作用与DS/state/资格/计划EV路径，局部结构检查后才进入下一cut。

gate_status=pass；gate_reason=cut_design_review_complete_runtime_not_established；next_allowed_action=review_next_cut；source_files=03§8 J03/§9 M13/M14/§15.2、05 Step6/7/9/13；formal_document_write_allowed=false。该pass仅当前设计审查，无run/actualqualification/result。

#### CUT-BR-RATE

问题回答：本切口正式对象=DispatchLane、全部shared scope/bounds、original budget；唯一源=03§8 J01/J02/§9 M15/§11~12/§15.2，完整TC=TC-RATE-001、TC-RATE-002、TC-RATE-003、TC-RATE-004、TC-RATE-005，DS-RATE-001，suite=SUITE-C/SUITE-B，plannedEV=EV-CONTRACT-012。本cut是否可以由其他phase/owner成功代替：不能，断言只在原来源/current/实际U或原foreignproof阶段。

诊断：unresolved head阻后继、取max下界，429/remaining/cancel/lease不造NoEffect；禁SDK暗retry。若只主链/通用成功或syntheticproof，无法证明上述风险不存在；每字段/状态/expected/callback/source变异必须独立实例而非复合happyfixture。

取舍：保原完整schema/enum/member/guard和sourcekey；合法主线及保护性拒绝采用对应TC，unknown只原identityreadonly权威probe/manual。DSfresh构造，duplicate/recovery故意共享original；suite按原module路由，EV只能真实case/suite产生，不从静态计划制造。

复杂度/写入：当前只独立复核记录，无新需求/TC/业务合同；完整case/DS/suite/EV表分别保持原源。实际逐行核对TC输入/预期/参数/禁止副作用与DS/state/资格/计划EV路径，局部结构检查后才进入下一cut。

gate_status=pass；gate_reason=cut_design_review_complete_runtime_not_established；next_allowed_action=review_next_cut；source_files=03§8 J01/J02/§9 M15/§11~12/§15.2、05 Step6/7/9/13；formal_document_write_allowed=false。该pass仅当前设计审查，无run/actualqualification/result。

#### CUT-BR-RECOVERY

问题回答：本切口正式对象=RecoveryRecord；LocalCommit/Owner/Platform/Consumer原subject；唯一源=03§8 C06/J02/J03/J04/§9 M16/§15.2，完整TC=TC-RECOVERY-001、TC-RECOVERY-002、TC-RECOVERY-003、TC-RECOVERY-004、TC-RECOVERY-005，DS-RECOVERY-001，suite=SUITE-C，plannedEV=EV-CONTRACT-013。本cut是否可以由其他phase/owner成功代替：不能，断言只在原来源/current/实际U或原foreignproof阶段。

诊断：readonly原身份权威probe、四proof不互替；NotFound/timeout/TTL不NoEffect；无权限manual/blocked。若只主链/通用成功或syntheticproof，无法证明上述风险不存在；每字段/状态/expected/callback/source变异必须独立实例而非复合happyfixture。

取舍：保原完整schema/enum/member/guard和sourcekey；合法主线及保护性拒绝采用对应TC，unknown只原identityreadonly权威probe/manual。DSfresh构造，duplicate/recovery故意共享original；suite按原module路由，EV只能真实case/suite产生，不从静态计划制造。

复杂度/写入：当前只独立复核记录，无新需求/TC/业务合同；完整case/DS/suite/EV表分别保持原源。实际逐行核对TC输入/预期/参数/禁止副作用与DS/state/资格/计划EV路径，局部结构检查后才进入下一cut。

gate_status=pass；gate_reason=cut_design_review_complete_runtime_not_established；next_allowed_action=review_next_cut；source_files=03§8 C06/J02/J03/J04/§9 M16/§15.2、05 Step6/7/9/13；formal_document_write_allowed=false。该pass仅当前设计审查，无run/actualqualification/result。

#### CUT-BR-LOCAL

问题回答：本切口正式对象=19logical collections、八repo/UoW、same driver seal/journal；唯一源=03§10.1~10.4/§15.2，完整TC=TC-LOCAL-001、TC-LOCAL-002、TC-LOCAL-003、TC-LOCAL-004、TC-LOCAL-005、TC-LOCAL-006，DS-LOCAL-001，suite=SUITE-L/SUITE-REAL，plannedEV=EV-CONTRACT-014。本cut是否可以由其他phase/owner成功代替：不能，断言只在原来源/current/实际U或原foreignproof阶段。

诊断：全expected/unique/write set、失败rollback零partial；ACK lost只原mutation恢复，不另apply/commit。若只主链/通用成功或syntheticproof，无法证明上述风险不存在；每字段/状态/expected/callback/source变异必须独立实例而非复合happyfixture。

取舍：保原完整schema/enum/member/guard和sourcekey；合法主线及保护性拒绝采用对应TC，unknown只原identityreadonly权威probe/manual。DSfresh构造，duplicate/recovery故意共享original；suite按原module路由，EV只能真实case/suite产生，不从静态计划制造。

复杂度/写入：当前只独立复核记录，无新需求/TC/业务合同；完整case/DS/suite/EV表分别保持原源。实际逐行核对TC输入/预期/参数/禁止副作用与DS/state/资格/计划EV路径，局部结构检查后才进入下一cut。

gate_status=pass；gate_reason=cut_design_review_complete_runtime_not_established；next_allowed_action=review_next_cut；source_files=03§10.1~10.4/§15.2、05 Step6/7/9/13；formal_document_write_allowed=false。该pass仅当前设计审查，无run/actualqualification/result。

#### CUT-BR-READ

问题回答：本切口正式对象=BridgeLocalView；resolver/full committed snapshot；唯一源=03§8 Q01~Q04/§16.4/§15.2，完整TC=TC-READ-001、TC-READ-002、TC-READ-003、TC-READ-004，DS-READ-001，suite=SUITE-R，plannedEV=EV-CONTRACT-015。本cut是否可以由其他phase/owner成功代替：不能，断言只在原来源/current/实际U或原foreignproof阶段。

诊断：resolver-first/current/visibility，Denied/Unavailable/hidden不假empty；0write/probe/ID/repair/audit。若只主链/通用成功或syntheticproof，无法证明上述风险不存在；每字段/状态/expected/callback/source变异必须独立实例而非复合happyfixture。

取舍：保原完整schema/enum/member/guard和sourcekey；合法主线及保护性拒绝采用对应TC，unknown只原identityreadonly权威probe/manual。DSfresh构造，duplicate/recovery故意共享original；suite按原module路由，EV只能真实case/suite产生，不从静态计划制造。

复杂度/写入：当前只独立复核记录，无新需求/TC/业务合同；完整case/DS/suite/EV表分别保持原源。实际逐行核对TC输入/预期/参数/禁止副作用与DS/state/资格/计划EV路径，局部结构检查后才进入下一cut。

gate_status=pass；gate_reason=cut_design_review_complete_runtime_not_established；next_allowed_action=review_next_cut；source_files=03§8 Q01~Q04/§16.4/§15.2、05 Step6/7/9/13；formal_document_write_allowed=false。该pass仅当前设计审查，无run/actualqualification/result。

#### CUT-BR-AUDIT

问题回答：本切口正式对象=SafeAuditRecord/SafeHandoffRecord；正式producer/schema；唯一源=03§8 E04/O01/J04/§9 M17/§15.2，完整TC=TC-AUDIT-001、TC-AUDIT-002、TC-AUDIT-003、TC-AUDIT-004、TC-AUDIT-005，DS-AUDIT-001，suite=SUITE-C/SUITE-A，plannedEV=EV-CONTRACT-016。本cut是否可以由其他phase/owner成功代替：不能，断言只在原来源/current/实际U或原foreignproof阶段。

诊断：actual同U材料、O01九字段、original consumer op、NonRecursiveResultOnly；mandatory不足先阻，ACK非Accepted/EV。若只主链/通用成功或syntheticproof，无法证明上述风险不存在；每字段/状态/expected/callback/source变异必须独立实例而非复合happyfixture。

取舍：保原完整schema/enum/member/guard和sourcekey；合法主线及保护性拒绝采用对应TC，unknown只原identityreadonly权威probe/manual。DSfresh构造，duplicate/recovery故意共享original；suite按原module路由，EV只能真实case/suite产生，不从静态计划制造。

复杂度/写入：当前只独立复核记录，无新需求/TC/业务合同；完整case/DS/suite/EV表分别保持原源。实际逐行核对TC输入/预期/参数/禁止副作用与DS/state/资格/计划EV路径，局部结构检查后才进入下一cut。

gate_status=pass；gate_reason=cut_design_review_complete_runtime_not_established；next_allowed_action=review_next_cut；source_files=03§8 E04/O01/J04/§9 M17/§15.2、05 Step6/7/9/13；formal_document_write_allowed=false。该pass仅当前设计审查，无run/actualqualification/result。

#### CUT-BR-CONFIG

问题回答：本切口正式对象=82项/20域/22CF/27F/CFG-CUT-001~012；唯一源=04§7/9/11/12.2；03§13，完整TC=TC-CONFIG-001、TC-CONFIG-002、TC-CONFIG-003、TC-CONFIG-004、TC-CONFIG-005、TC-CONFIG-006、TC-CONFIG-007、TC-CONFIG-008、TC-CONFIG-009、TC-CONFIG-010、TC-CONFIG-011、TC-CONFIG-012，DS-CONFIG-001，suite=SUITE-B/SUITE-I/SUITE-A/SUITE-P/SUITE-C/SUITE-W/SUITE-J，plannedEV=EV-CONTRACT-017。本cut是否可以由其他phase/owner成功代替：不能，断言只在原来源/current/实际U或原foreignproof阶段。

诊断：单JSON/严格parse/三个entry参数/required闭包/五环境/secret/cold rollback；不隐式default或激活。若只主链/通用成功或syntheticproof，无法证明上述风险不存在；每字段/状态/expected/callback/source变异必须独立实例而非复合happyfixture。

取舍：保原完整schema/enum/member/guard和sourcekey；合法主线及保护性拒绝采用对应TC，unknown只原identityreadonly权威probe/manual。DSfresh构造，duplicate/recovery故意共享original；suite按原module路由，EV只能真实case/suite产生，不从静态计划制造。

复杂度/写入：当前只独立复核记录，无新需求/TC/业务合同；完整case/DS/suite/EV表分别保持原源。实际逐行核对TC输入/预期/参数/禁止副作用与DS/state/资格/计划EV路径，局部结构检查后才进入下一cut。

gate_status=pass；gate_reason=cut_design_review_complete_runtime_not_established；next_allowed_action=review_next_cut；source_files=04§7/9/11/12.2；03§13、05 Step6/7/9/13；formal_document_write_allowed=false。该pass仅当前设计审查，无run/actualqualification/result。

#### CUT-BR-PRIVATE

问题回答：本切口正式对象=owning/短借、exact五用途provider/key/revision/scope/window；唯一源=03§13~15；04§8，完整TC=TC-PRIVATE-001、TC-PRIVATE-002、TC-PRIVATE-003、TC-PRIVATE-004、TC-PRIVATE-005，DS-PRIVATE-001，suite=SUITE-P，plannedEV=EV-CONTRACT-018。本cut是否可以由其他phase/owner成功代替：不能，断言只在原来源/current/实际U或原foreignproof阶段。

诊断：synthetic内存canary跨wire/durable/log/trace/metric/report/error/SDK Debug；raw/可还原派生为0要求。若只主链/通用成功或syntheticproof，无法证明上述风险不存在；每字段/状态/expected/callback/source变异必须独立实例而非复合happyfixture。

取舍：保原完整schema/enum/member/guard和sourcekey；合法主线及保护性拒绝采用对应TC，unknown只原identityreadonly权威probe/manual。DSfresh构造，duplicate/recovery故意共享original；suite按原module路由，EV只能真实case/suite产生，不从静态计划制造。

复杂度/写入：当前只独立复核记录，无新需求/TC/业务合同；完整case/DS/suite/EV表分别保持原源。实际逐行核对TC输入/预期/参数/禁止副作用与DS/state/资格/计划EV路径，局部结构检查后才进入下一cut。

gate_status=pass；gate_reason=cut_design_review_complete_runtime_not_established；next_allowed_action=review_next_cut；source_files=03§13~15；04§8、05 Step6/7/9/13；formal_document_write_allowed=false。该pass仅当前设计审查，无run/actualqualification/result。

#### CUT-BR-ENTRY

问题回答：本切口正式对象=七bin/19callable、RuntimeExecutionState/JobInvocationState/SourceSession/WorkerBatch；唯一源=03§7外层/§8 J/§9 M18~M21/§15；04§12 CFG-CUT-011，完整TC=TC-ENTRY-001、TC-ENTRY-002、TC-ENTRY-003、TC-ENTRY-004、TC-ENTRY-005、TC-ENTRY-006、TC-ENTRY-007，DS-ENTRY-001，suite=SUITE-I/SUITE-W/SUITE-J，plannedEV=EV-CONTRACT-019。本cut是否可以由其他phase/owner成功代替：不能，断言只在原来源/current/实际U或原foreignproof阶段。

诊断：source排他/owning单inflight/current，stop-time newbudget同tuple checked、cancel未知并集、summary actual。若只主链/通用成功或syntheticproof，无法证明上述风险不存在；每字段/状态/expected/callback/source变异必须独立实例而非复合happyfixture。

取舍：保原完整schema/enum/member/guard和sourcekey；合法主线及保护性拒绝采用对应TC，unknown只原identityreadonly权威probe/manual。DSfresh构造，duplicate/recovery故意共享original；suite按原module路由，EV只能真实case/suite产生，不从静态计划制造。

复杂度/写入：当前只独立复核记录，无新需求/TC/业务合同；完整case/DS/suite/EV表分别保持原源。实际逐行核对TC输入/预期/参数/禁止副作用与DS/state/资格/计划EV路径，局部结构检查后才进入下一cut。

gate_status=pass；gate_reason=cut_design_review_complete_runtime_not_established；next_allowed_action=review_next_cut；source_files=03§7外层/§8 J/§9 M18~M21/§15；04§12 CFG-CUT-011、05 Step6/7/9/13；formal_document_write_allowed=false。该pass仅当前设计审查，无run/actualqualification/result。

#### CUT-BR-STATE

问题回答：本切口正式对象=M01~M21；PlatformReceipt/SafeAuditRecord immutable、View无机；唯一源=03§9/§16.6/§15.2，完整TC=TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006，DS-STATE-001，suite=SUITE-D/SUITE-I/SUITE-J/SUITE-W，plannedEV=EV-CONTRACT-020。本cut是否可以由其他phase/owner成功代替：不能，断言只在原来源/current/实际U或原foreignproof阶段。

诊断：101 labels/150 allowed pairs=123durable+27technical；未列pair拒/失败原对象不变/factory不计。若只主链/通用成功或syntheticproof，无法证明上述风险不存在；每字段/状态/expected/callback/source变异必须独立实例而非复合happyfixture。

取舍：保原完整schema/enum/member/guard和sourcekey；合法主线及保护性拒绝采用对应TC，unknown只原identityreadonly权威probe/manual。DSfresh构造，duplicate/recovery故意共享original；suite按原module路由，EV只能真实case/suite产生，不从静态计划制造。

复杂度/写入：当前只独立复核记录，无新需求/TC/业务合同；完整case/DS/suite/EV表分别保持原源。实际逐行核对TC输入/预期/参数/禁止副作用与DS/state/资格/计划EV路径，局部结构检查后才进入下一cut。

gate_status=pass；gate_reason=cut_design_review_complete_runtime_not_established；next_allowed_action=review_next_cut；source_files=03§9/§16.6/§15.2、05 Step6/7/9/13；formal_document_write_allowed=false。该pass仅当前设计审查，无run/actualqualification/result。

#### CUT-BR-EVIDENCE

问题回答：本切口正式对象=local test-harness DTO/runner/report writer；不增加production协议；唯一源=03§15脚本边界；00 AC037/038；测试规范§4.6/5.13，完整TC=TC-EVIDENCE-001、TC-EVIDENCE-002、TC-EVIDENCE-003、TC-EVIDENCE-004、TC-EVIDENCE-005，DS-EVIDENCE-001，suite=SUITE-TOOLS，plannedEV=EV-CONTRACT-021。本cut是否可以由其他phase/owner成功代替：不能，断言只在原来源/current/实际U或原foreignproof阶段。

诊断：planned不passed、fixed run/sha256/schema/TC关联/redaction、故障安全留存；真实实例不从静态表生成。若只主链/通用成功或syntheticproof，无法证明上述风险不存在；每字段/状态/expected/callback/source变异必须独立实例而非复合happyfixture。

取舍：保原完整schema/enum/member/guard和sourcekey；合法主线及保护性拒绝采用对应TC，unknown只原identityreadonly权威probe/manual。DSfresh构造，duplicate/recovery故意共享original；suite按原module路由，EV只能真实case/suite产生，不从静态计划制造。

复杂度/写入：当前只独立复核记录，无新需求/TC/业务合同；完整case/DS/suite/EV表分别保持原源。实际逐行核对TC输入/预期/参数/禁止副作用与DS/state/资格/计划EV路径，局部结构检查后才进入下一cut。

gate_status=pass；gate_reason=cut_design_review_complete_runtime_not_established；next_allowed_action=review_next_cut；source_files=03§15脚本边界；00 AC037/038；测试规范§4.6/5.13、05 Step6/7/9/13；formal_document_write_allowed=false。该pass仅当前设计审查，无run/actualqualification/result。

#### CUT-BR-REAL

问题回答：本切口正式对象=core/SDK compile、六owner/Bus、四platform、DB/executor/secret/producer；唯一源=03§14~17；04§14/平台核验附录，完整TC=TC-REAL-001、TC-REAL-002、TC-REAL-003、TC-REAL-004、TC-REAL-005、TC-REAL-006、TC-REAL-007，DS-REAL-001，suite=SUITE-REAL，plannedEV=EV-REAL-001。本cut是否可以由其他phase/owner成功代替：不能，断言只在原来源/current/实际U或原foreignproof阶段。

诊断：实际pin/manifest/driver/account/scope/grant/route/current/producer注册缺失blocked；fake不释放。若只主链/通用成功或syntheticproof，无法证明上述风险不存在；每字段/状态/expected/callback/source变异必须独立实例而非复合happyfixture。

取舍：保原完整schema/enum/member/guard和sourcekey；合法主线及保护性拒绝采用对应TC，unknown只原identityreadonly权威probe/manual。DSfresh构造，duplicate/recovery故意共享original；suite按原module路由，EV只能真实case/suite产生，不从静态计划制造。

复杂度/写入：当前只独立复核记录，无新需求/TC/业务合同；完整case/DS/suite/EV表分别保持原源。实际逐行核对TC输入/预期/参数/禁止副作用与DS/state/资格/计划EV路径，局部结构检查后才进入下一cut。

gate_status=pass；gate_reason=cut_design_review_complete_runtime_not_established；next_allowed_action=review_next_cut；source_files=03§14~17；04§14/平台核验附录、05 Step6/7/9/13；formal_document_write_allowed=false。该pass仅当前设计审查，无run/actualqualification/result。

## 2. 字段闭环表

原列中的“本章§16.x”、Step编号及“未来05/06/07”均保留03语境，回指正式03，而非本附录的新章节或推进许可。当前05测试关联只写新增的最后两列，不改原字段、来源、构造、状态或phase合同。

字段表的具体TC含SURFACE/STATE/LOCAL横向核验；该行EV是所属cut的验收方向，不把横向TC改归该EV。真实case的唯一cut/DS/suite/EV关联仍以当前case/evidence plan registry及正式05§6/9/13为准。

以下逐行原field/type/source/factory/input/missing从正式03§16.2当前完整表读取，只将planned测试简称替换为当前具体TC及plannedEV方向；无新schema。每field归属/Slot/state/localrevision源唯一，missing不补default。

### BridgeInstallation

来源：03§16.2 BridgeInstallation及其§5原factory/schema；每原字段独立missing/wrongtype/Slot/state负向实例，不抽样。

| Domain对象 | 字段 | 类型 | 原字段来源 | 构造入口 | DTO/Event/Job或系统映射 | 缺失处理 | 当前具体TC | planned验收证据方向 |
|---|---|---|---|---|---|---|---|---|
| BridgeInstallation | `installation_ref` | `BridgeInstallationRef` | local配置identity；Application ID source/首次UoW | `BridgeInstallation::configure`；原rehydrate | `BridgeInstallation::configure.installation_ref` <- C01/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-BIND-001、TC-BIND-002 | EV-CONTRACT-002 planned；AC-BR-001~007及037/038；actual not_evaluated |
| BridgeInstallation | `namespace` | `InstallationNamespace` | 精确安装namespace；受权config | `BridgeInstallation::configure`；原rehydrate | `BridgeInstallation::configure.namespace` <- C01/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-BIND-001、TC-BIND-002 | EV-CONTRACT-002 planned；AC-BR-001~007及037/038；actual not_evaluated |
| BridgeInstallation | `platform_kind` | `PlatformKind` | 平台分类；namespace一致decoder | `BridgeInstallation::configure`；原rehydrate | `BridgeInstallation::configure.platform_kind` <- C01/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-BIND-001、TC-BIND-002 | EV-CONTRACT-002 planned；AC-BR-001~007及037/038；actual not_evaluated |
| BridgeInstallation | `config_revision` | `ConfigRevision` | 配置CAS；首次1；受权配置变化checked next | `BridgeInstallation::configure`；原rehydrate | `BridgeInstallation::configure.config_revision` <- C01/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-BIND-001、TC-BIND-002 | EV-CONTRACT-002 planned；AC-BR-001~007及037/038；actual not_evaluated |
| BridgeInstallation | `capability_ref` | `CapabilitySnapshotRef` | 逐method能力ref；ConfigQualificationPort | `BridgeInstallation::configure`；原rehydrate | `BridgeInstallation::configure.capability_ref` <- C01/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-BIND-001、TC-BIND-002 | EV-CONTRACT-002 planned；AC-BR-001~007及037/038；actual not_evaluated |
| BridgeInstallation | `secret_binding` | `OpaqueSecretBindingRef` | 精确provider/key/version；same config source | `BridgeInstallation::configure`；原rehydrate | `BridgeInstallation::configure.secret_binding` <- C01/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-BIND-001、TC-BIND-002 | EV-CONTRACT-002 planned；AC-BR-001~007及037/038；actual not_evaluated |
| BridgeInstallation | `route_policy` | `RoutePolicyRef` | 受权route ref；same source，不存URL | `BridgeInstallation::configure`；原rehydrate | `BridgeInstallation::configure.route_policy` <- C01/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-BIND-001、TC-BIND-002 | EV-CONTRACT-002 planned；AC-BR-001~007及037/038；actual not_evaluated |
| BridgeInstallation | `configuration_basis` | `ConfigurationBasisRef` | 配置授权；current配置owner | `BridgeInstallation::configure`；原rehydrate | `BridgeInstallation::configure.configuration_basis` <- C01/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-BIND-001、TC-BIND-002 | EV-CONTRACT-002 planned；AC-BR-001~007及037/038；actual not_evaluated |
| BridgeInstallation | `qualification` | `InstallationQualificationRefSlot` | 资格Slot；Configure必须Missing；维护job建立current | `BridgeInstallation::configure`；原rehydrate | `BridgeInstallation::configure.qualification` <- C01/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-BIND-001、TC-BIND-002 | EV-CONTRACT-002 planned；AC-BR-001~007及037/038；actual not_evaluated |
| BridgeInstallation | `state` | `BridgeInstallationState` | 本对象业务状态；factory固定初态；hydrate只取实际local store | `BridgeInstallation::configure`；原rehydrate | factory原固定初态；hydrate只actual stored.state，无DTO终态输入 | 初态固定，hydrate缺失/未知state拒绝；不默认成功 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-BIND-001、TC-BIND-002 | EV-CONTRACT-002 planned；AC-BR-001~007及037/038；actual not_evaluated |
| BridgeInstallation | `local_revision` | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW | `BridgeInstallation::configure`；原rehydrate | 首次固定1；后续actual UoW CAS；hydrate actual stored.local_revision | 缺actual版本拒绝；不从请求/时间生成 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-BIND-001、TC-BIND-002 | EV-CONTRACT-002 planned；AC-BR-001~007及037/038；actual not_evaluated |

### ExternalBinding

来源：03§16.2 ExternalBinding及其§5原factory/schema；每原字段独立missing/wrongtype/Slot/state负向实例，不抽样。

| Domain对象 | 字段 | 类型 | 原字段来源 | 构造入口 | DTO/Event/Job或系统映射 | 缺失处理 | 当前具体TC | planned验收证据方向 |
|---|---|---|---|---|---|---|---|---|
| ExternalBinding | `binding_ref` | `ExternalBindingRef` | local relation identity；Application ID/同UoW | `ExternalBinding::propose`；原rehydrate | `ExternalBinding::propose.binding_ref` <- C02/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-BIND-001、TC-BIND-002 | EV-CONTRACT-002 planned；AC-BR-001~007及037/038；actual not_evaluated |
| ExternalBinding | `installation_ref` | `BridgeInstallationRef` | 原安装；受权配置 | `ExternalBinding::propose`；原rehydrate | `ExternalBinding::propose.installation_ref` <- C02/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-BIND-001、TC-BIND-002 | EV-CONTRACT-002 planned；AC-BR-001~007及037/038；actual not_evaluated |
| ExternalBinding | `external_scope` | `ExternalScopeLocator` | 外部typed scope；verified decoder | `ExternalBinding::propose`；原rehydrate | `ExternalBinding::propose.external_scope` <- C02/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-BIND-001、TC-BIND-002 | EV-CONTRACT-002 planned；AC-BR-001~007及037/038；actual not_evaluated |
| ExternalBinding | `internal_target` | `BridgeInternalTargetRef` | 正式内部target；owner resolver | `ExternalBinding::propose`；原rehydrate | `ExternalBinding::propose.internal_target` <- C02/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-BIND-001、TC-BIND-002 | EV-CONTRACT-002 planned；AC-BR-001~007及037/038；actual not_evaluated |
| ExternalBinding | `actor_basis` | `ActorResponsibilityRefSlot` | 原责任Slot；正式责任链，pending可Missing | `ExternalBinding::propose`；原rehydrate | `ExternalBinding::propose.actor_basis` <- C02/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-BIND-001、TC-BIND-002 | EV-CONTRACT-002 planned；AC-BR-001~007及037/038；actual not_evaluated |
| ExternalBinding | `authorization_basis` | `AuthorizedBindingBasisRefSlot` | 显式授权Slot；formal qualification，pending可Missing | `ExternalBinding::propose`；原rehydrate | `ExternalBinding::propose.authorization_basis` <- C02/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-BIND-001、TC-BIND-002 | EV-CONTRACT-002 planned；AC-BR-001~007及037/038；actual not_evaluated |
| ExternalBinding | `directions_actions` | `BridgeDirectionActionSet` | 受限动作集合；明确提案，不是自动授权 | `ExternalBinding::propose`；原rehydrate | `ExternalBinding::propose.directions_actions` <- C02/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-BIND-001、TC-BIND-002 | EV-CONTRACT-002 planned；AC-BR-001~007及037/038；actual not_evaluated |
| ExternalBinding | `generation` | `BindingGeneration` | relation代际；首次1/许可变化checked next | `ExternalBinding::propose`；原rehydrate | `ExternalBinding::propose.generation` <- C02/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-BIND-001、TC-BIND-002 | EV-CONTRACT-002 planned；AC-BR-001~007及037/038；actual not_evaluated |
| ExternalBinding | `state` | `ExternalBindingState` | 本对象业务状态；factory固定初态；hydrate只取实际local store | `ExternalBinding::propose`；原rehydrate | factory原固定初态；hydrate只actual stored.state，无DTO终态输入 | 初态固定，hydrate缺失/未知state拒绝；不默认成功 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-BIND-001、TC-BIND-002 | EV-CONTRACT-002 planned；AC-BR-001~007及037/038；actual not_evaluated |
| ExternalBinding | `local_revision` | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW | `ExternalBinding::propose`；原rehydrate | 首次固定1；后续actual UoW CAS；hydrate actual stored.local_revision | 缺actual版本拒绝；不从请求/时间生成 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-BIND-001、TC-BIND-002 | EV-CONTRACT-002 planned；AC-BR-001~007及037/038；actual not_evaluated |

### ExternalIdentityMapping

来源：03§16.2 ExternalIdentityMapping及其§5原factory/schema；每原字段独立missing/wrongtype/Slot/state负向实例，不抽样。

| Domain对象 | 字段 | 类型 | 原字段来源 | 构造入口 | DTO/Event/Job或系统映射 | 缺失处理 | 当前具体TC | planned验收证据方向 |
|---|---|---|---|---|---|---|---|---|
| ExternalIdentityMapping | `mapping_ref` | `IdentityMappingRef` | local mapping identity；Application技术ID | `ExternalIdentityMapping::link`；原rehydrate | `ExternalIdentityMapping::link.mapping_ref` <- C03/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-001~007及037/038；actual not_evaluated |
| ExternalIdentityMapping | `external_account` | `ExternalAccountLocator` | namespace/account-kind/ID；verified decoder | `ExternalIdentityMapping::link`；原rehydrate | `ExternalIdentityMapping::link.external_account` <- C03/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-001~007及037/038；actual not_evaluated |
| ExternalIdentityMapping | `actor_kind` | `BridgeActorKind` | human/AI/Integration正式分类；责任resolver | `ExternalIdentityMapping::link`；原rehydrate | `ExternalIdentityMapping::link.actor_kind` <- C03/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-001~007及037/038；actual not_evaluated |
| ExternalIdentityMapping | `internal_actor` | `ActorRef` | 正式actor；ActorResponsibilityPort/Identity；display_name=None | `ExternalIdentityMapping::link`；原rehydrate | `ExternalIdentityMapping::link.internal_actor` <- C03/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-001~007及037/038；actual not_evaluated |
| ExternalIdentityMapping | `binding_ref` | `ExternalBindingRef` | 原relation；current Active | `ExternalIdentityMapping::link`；原rehydrate | `ExternalIdentityMapping::link.binding_ref` <- C03/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-001~007及037/038；actual not_evaluated |
| ExternalIdentityMapping | `generation` | `BindingGeneration` | 原代际；current relation | `ExternalIdentityMapping::link`；原rehydrate | `ExternalIdentityMapping::link.generation` <- C03/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-001~007及037/038；actual not_evaluated |
| ExternalIdentityMapping | `basis` | `IdentityMappingBasisRef` | 两端依据；formal mapping qualification | `ExternalIdentityMapping::link`；原rehydrate | `ExternalIdentityMapping::link.basis` <- C03/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-001~007及037/038；actual not_evaluated |
| ExternalIdentityMapping | `state` | `IdentityMappingState` | 本对象业务状态；factory固定初态；hydrate只取实际local store | `ExternalIdentityMapping::link`；原rehydrate | factory原固定初态；hydrate只actual stored.state，无DTO终态输入 | 初态固定，hydrate缺失/未知state拒绝；不默认成功 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-001~007及037/038；actual not_evaluated |
| ExternalIdentityMapping | `local_revision` | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW | `ExternalIdentityMapping::link`；原rehydrate | 首次固定1；后续actual UoW CAS；hydrate actual stored.local_revision | 缺actual版本拒绝；不从请求/时间生成 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-001~007及037/038；actual not_evaluated |

### ExternalLocationMapping

来源：03§16.2 ExternalLocationMapping及其§5原factory/schema；每原字段独立missing/wrongtype/Slot/state负向实例，不抽样。

| Domain对象 | 字段 | 类型 | 原字段来源 | 构造入口 | DTO/Event/Job或系统映射 | 缺失处理 | 当前具体TC | planned验收证据方向 |
|---|---|---|---|---|---|---|---|---|
| ExternalLocationMapping | `mapping_ref` | `LocationMappingRef` | local mapping identity；Application技术ID | `ExternalLocationMapping::link`；原rehydrate | `ExternalLocationMapping::link.mapping_ref` <- C03/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-001~007及037/038；actual not_evaluated |
| ExternalLocationMapping | `external_location` | `ExternalLocationLocator` | channel/DM/topic/thread全定位；verified decoder | `ExternalLocationMapping::link`；原rehydrate | `ExternalLocationMapping::link.external_location` <- C03/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-001~007及037/038；actual not_evaluated |
| ExternalLocationMapping | `parent_location` | `ParentLocationRefSlot` | root/parent明确适用性；source能力及原父mapping | `ExternalLocationMapping::link`；原rehydrate | `ExternalLocationMapping::link.parent_location` <- C03/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-001~007及037/038；actual not_evaluated |
| ExternalLocationMapping | `internal_target` | `BridgeInternalTargetRef` | 正式target；owner resolver | `ExternalLocationMapping::link`；原rehydrate | `ExternalLocationMapping::link.internal_target` <- C03/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-001~007及037/038；actual not_evaluated |
| ExternalLocationMapping | `binding_ref` | `ExternalBindingRef` | 原relation；current Active | `ExternalLocationMapping::link`；原rehydrate | `ExternalLocationMapping::link.binding_ref` <- C03/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-001~007及037/038；actual not_evaluated |
| ExternalLocationMapping | `generation` | `BindingGeneration` | 原代际；same relation | `ExternalLocationMapping::link`；原rehydrate | `ExternalLocationMapping::link.generation` <- C03/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-001~007及037/038；actual not_evaluated |
| ExternalLocationMapping | `basis` | `LocationMappingBasisRef` | 两端kind/parent/方向依据；formal qualification | `ExternalLocationMapping::link`；原rehydrate | `ExternalLocationMapping::link.basis` <- C03/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-001~007及037/038；actual not_evaluated |
| ExternalLocationMapping | `state` | `LocationMappingState` | 本对象业务状态；factory固定初态；hydrate只取实际local store | `ExternalLocationMapping::link`；原rehydrate | factory原固定初态；hydrate只actual stored.state，无DTO终态输入 | 初态固定，hydrate缺失/未知state拒绝；不默认成功 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-001~007及037/038；actual not_evaluated |
| ExternalLocationMapping | `local_revision` | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW | `ExternalLocationMapping::link`；原rehydrate | 首次固定1；后续actual UoW CAS；hydrate actual stored.local_revision | 缺actual版本拒绝；不从请求/时间生成 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-001~007及037/038；actual not_evaluated |

### ExternalMessageMapping

来源：03§16.2 ExternalMessageMapping及其§5原factory/schema；每原字段独立missing/wrongtype/Slot/state负向实例，不抽样。

| Domain对象 | 字段 | 类型 | 原字段来源 | 构造入口 | DTO/Event/Job或系统映射 | 缺失处理 | 当前具体TC | planned验收证据方向 |
|---|---|---|---|---|---|---|---|---|
| ExternalMessageMapping | `mapping_ref` | `MessageMappingRef` | local relation identity；Application ID | `ExternalMessageMapping::link_known`；原rehydrate | `ExternalMessageMapping::link_known.mapping_ref` <- C03/E01/J01/J02/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-004/011/018/019/029及037/038；actual not_evaluated |
| ExternalMessageMapping | `external_message` | `ExternalMessageLocator` | 原message/root/thread；verified result/source | `ExternalMessageMapping::link_known`；原rehydrate | `ExternalMessageMapping::link_known.external_message` <- C03/E01/J01/J02/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-004/011/018/019/029及037/038；actual not_evaluated |
| ExternalMessageMapping | `source_ref_version` | `SafeSourceVersionRef` | 原安全source版本；owner/source qualification | `ExternalMessageMapping::link_known`；原rehydrate | `ExternalMessageMapping::link_known.source_ref_version` <- C03/E01/J01/J02/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-004/011/018/019/029及037/038；actual not_evaluated |
| ExternalMessageMapping | `change_kind` | `ExternalChangeKind` | 原change；verified decoder | `ExternalMessageMapping::link_known`；原rehydrate | `ExternalMessageMapping::link_known.change_kind` <- C03/E01/J01/J02/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-004/011/018/019/029及037/038；actual not_evaluated |
| ExternalMessageMapping | `owner_result` | `OwnerAcceptedRefSlot` | 原已知owner结果；actual accepted或明确不适用的Missing | `ExternalMessageMapping::link_known`；原rehydrate | `ExternalMessageMapping::link_known.owner_result` <- C03/E01/J01/J02/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-004/011/018/019/029及037/038；actual not_evaluated |
| ExternalMessageMapping | `effect_ref` | `DeliveryEffectRefSlot` | 原outbound effect；actual known平台结果/原intent | `ExternalMessageMapping::link_known`；原rehydrate | `ExternalMessageMapping::link_known.effect_ref` <- C03/E01/J01/J02/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-004/011/018/019/029及037/038；actual not_evaluated |
| ExternalMessageMapping | `generation_direction` | `MappingGenerationDirection` | 原relation代际动作；qualified binding | `ExternalMessageMapping::link_known`；原rehydrate | `ExternalMessageMapping::link_known.generation_direction` <- C03/E01/J01/J02/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-004/011/018/019/029及037/038；actual not_evaluated |
| ExternalMessageMapping | `origin_marker` | `VerifiedOriginMarkerRef` | 可信来源与self-send关联；actual platform/local mapping | `ExternalMessageMapping::link_known`；原rehydrate | `ExternalMessageMapping::link_known.origin_marker` <- C03/E01/J01/J02/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-004/011/018/019/029及037/038；actual not_evaluated |
| ExternalMessageMapping | `mapping_basis` | `MappingBasisRef` | 受权两端关联依据；formal mapping qualification | `ExternalMessageMapping::link_known`；原rehydrate | `ExternalMessageMapping::link_known.mapping_basis` <- C03/E01/J01/J02/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-004/011/018/019/029及037/038；actual not_evaluated |
| ExternalMessageMapping | `state` | `MessageMappingState` | 本对象业务状态；factory固定初态；hydrate只取实际local store | `ExternalMessageMapping::link_known`；原rehydrate | factory原固定初态；hydrate只actual stored.state，无DTO终态输入 | 初态固定，hydrate缺失/未知state拒绝；不默认成功 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-004/011/018/019/029及037/038；actual not_evaluated |
| ExternalMessageMapping | `local_revision` | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW | `ExternalMessageMapping::link_known`；原rehydrate | 首次固定1；后续actual UoW CAS；hydrate actual stored.local_revision | 缺actual版本拒绝；不从请求/时间生成 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-MAP-001、TC-MAP-002 | EV-CONTRACT-003 planned；AC-BR-004/011/018/019/029及037/038；actual not_evaluated |

### InboundHandoffRecord

来源：03§16.2 InboundHandoffRecord及其§5原factory/schema；每原字段独立missing/wrongtype/Slot/state负向实例，不抽样。

| Domain对象 | 字段 | 类型 | 原字段来源 | 构造入口 | DTO/Event/Job或系统映射 | 缺失处理 | 当前具体TC | planned验收证据方向 |
|---|---|---|---|---|---|---|---|---|
| InboundHandoffRecord | `record_ref` | `InboundRecordRef` | local record identity；Application ID/UoW | `InboundHandoffRecord::from_verified`；原rehydrate | `InboundHandoffRecord::from_verified.record_ref` <- E01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-INBOUND-001、TC-INBOUND-002 | EV-CONTRACT-004 planned；AC-BR-008~014及037/038；actual not_evaluated |
| InboundHandoffRecord | `verified_source` | `VerifiedPlatformSourceRef` | 真实协议验证依据；PlatformIngressPort | `InboundHandoffRecord::from_verified`；原rehydrate | `InboundHandoffRecord::from_verified.verified_source` <- E01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-INBOUND-001、TC-INBOUND-002 | EV-CONTRACT-004 planned；AC-BR-008~014及037/038；actual not_evaluated |
| InboundHandoffRecord | `origin_marker` | `VerifiedOriginMarkerRef` | 真实来源回环依据；same verification | `InboundHandoffRecord::from_verified`；原rehydrate | `InboundHandoffRecord::from_verified.origin_marker` <- E01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-INBOUND-001、TC-INBOUND-002 | EV-CONTRACT-004 planned；AC-BR-008~014及037/038；actual not_evaluated |
| InboundHandoffRecord | `source_ref` | `SafeSourceRefSlot` | 安全材料source或缺口；qualified source，缺失不承诺replay | `InboundHandoffRecord::from_verified`；原rehydrate | `InboundHandoffRecord::from_verified.source_ref` <- E01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-INBOUND-001、TC-INBOUND-002 | EV-CONTRACT-004 planned；AC-BR-008~014及037/038；actual not_evaluated |
| InboundHandoffRecord | `operation_ref` | `BridgeOperationRef` | 原owner operation；首次reservation后不可替换 | `InboundHandoffRecord::from_verified`；原rehydrate | `InboundHandoffRecord::from_verified.operation_ref` <- E01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-INBOUND-001、TC-INBOUND-002 | EV-CONTRACT-004 planned；AC-BR-008~014及037/038；actual not_evaluated |
| InboundHandoffRecord | `mapping_context` | `AuthorizedMappingContextRefSlot` | 原两端mapping；BindingQualificationPort | `InboundHandoffRecord::from_verified`；原rehydrate | `InboundHandoffRecord::from_verified.mapping_context` <- E01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-INBOUND-001、TC-INBOUND-002 | EV-CONTRACT-004 planned；AC-BR-008~014及037/038；actual not_evaluated |
| InboundHandoffRecord | `target_mode` | `BridgeTargetModeSlot` | owner正式模式；ConversationHandoffPort | `InboundHandoffRecord::from_verified`；原rehydrate | `InboundHandoffRecord::from_verified.target_mode` <- E01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-INBOUND-001、TC-INBOUND-002 | EV-CONTRACT-004 planned；AC-BR-008~014及037/038；actual not_evaluated |
| InboundHandoffRecord | `actor_ref` | `ActorRefSlot` | 正式责任actor；ActorResponsibilityPort；AppendFact=Integration | `InboundHandoffRecord::from_verified`；原rehydrate | `InboundHandoffRecord::from_verified.actor_ref` <- E01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-INBOUND-001、TC-INBOUND-002 | EV-CONTRACT-004 planned；AC-BR-008~014及037/038；actual not_evaluated |
| InboundHandoffRecord | `material_ref` | `QualifiedMaterialRefSlot` | 合格材料引用；PrivateMaterialPort/owner，不存body | `InboundHandoffRecord::from_verified`；原rehydrate | `InboundHandoffRecord::from_verified.material_ref` <- E01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-INBOUND-001、TC-INBOUND-002 | EV-CONTRACT-004 planned；AC-BR-008~014及037/038；actual not_evaluated |
| InboundHandoffRecord | `required_digest_ref` | `OwnerRequiredDigestRefSlot` | owner digest要求；current material，非body hash | `InboundHandoffRecord::from_verified`；原rehydrate | `InboundHandoffRecord::from_verified.required_digest_ref` <- E01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-INBOUND-001、TC-INBOUND-002 | EV-CONTRACT-004 planned；AC-BR-008~014及037/038；actual not_evaluated |
| InboundHandoffRecord | `protocol_disposition` | `ProtocolAckDisposition` | 实际ACK阶段；private entry，非owner结果 | `InboundHandoffRecord::from_verified`；原rehydrate | `InboundHandoffRecord::from_verified.protocol_disposition` <- E01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-INBOUND-001、TC-INBOUND-002 | EV-CONTRACT-004 planned；AC-BR-008~014及037/038；actual not_evaluated |
| InboundHandoffRecord | `owner_result` | `OwnerHandoffResultRefSlot` | 原owner实际结果；owner actual，同op，初始Missing | `InboundHandoffRecord::from_verified`；原rehydrate | `InboundHandoffRecord::from_verified.owner_result` <- E01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-INBOUND-001、TC-INBOUND-002 | EV-CONTRACT-004 planned；AC-BR-008~014及037/038；actual not_evaluated |
| InboundHandoffRecord | `state` | `InboundHandoffState` | 本对象业务状态；factory固定初态；hydrate只取实际local store | `InboundHandoffRecord::from_verified`；原rehydrate | factory原固定初态；hydrate只actual stored.state，无DTO终态输入 | 初态固定，hydrate缺失/未知state拒绝；不默认成功 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-INBOUND-001、TC-INBOUND-002 | EV-CONTRACT-004 planned；AC-BR-008~014及037/038；actual not_evaluated |
| InboundHandoffRecord | `local_revision` | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW | `InboundHandoffRecord::from_verified`；原rehydrate | 首次固定1；后续actual UoW CAS；hydrate actual stored.local_revision | 缺actual版本拒绝；不从请求/时间生成 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-INBOUND-001、TC-INBOUND-002 | EV-CONTRACT-004 planned；AC-BR-008~014及037/038；actual not_evaluated |

### SafePresentationPlan

来源：03§16.2 SafePresentationPlan及其§5原factory/schema；每原字段独立missing/wrongtype/Slot/state负向实例，不抽样。

| Domain对象 | 字段 | 类型 | 原字段来源 | 构造入口 | DTO/Event/Job或系统映射 | 缺失处理 | 当前具体TC | planned验收证据方向 |
|---|---|---|---|---|---|---|---|---|
| SafePresentationPlan | `plan_ref` | `PresentationPlanRef` | local plan identity；Application技术ID | `SafePresentationPlan::prepare`；原rehydrate | `SafePresentationPlan::prepare.plan_ref` <- C04/E02/J01/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-PRESENT-001、TC-PRESENT-002 | EV-CONTRACT-006 planned；AC-BR-015~021及037/038；actual not_evaluated |
| SafePresentationPlan | `source_ref_version` | `CommittedSourceVersionRef` | owner committed source版本；actual producer source | `SafePresentationPlan::prepare`；原rehydrate | `SafePresentationPlan::prepare.source_ref_version` <- C04/E02/J01/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-PRESENT-001、TC-PRESENT-002 | EV-CONTRACT-006 planned；AC-BR-015~021及037/038；actual not_evaluated |
| SafePresentationPlan | `binding_context` | `AuthorizedMappingContextRef` | 原两端与受众；formal mapping qualification | `SafePresentationPlan::prepare`；原rehydrate | `SafePresentationPlan::prepare.binding_context` <- C04/E02/J01/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-PRESENT-001、TC-PRESENT-002 | EV-CONTRACT-006 planned；AC-BR-015~021及037/038；actual not_evaluated |
| SafePresentationPlan | `projection_ref` | `AllowedProjectionRefSlot` | 获准projection；PresentationQualificationPort | `SafePresentationPlan::prepare`；原rehydrate | `SafePresentationPlan::prepare.projection_ref` <- C04/E02/J01/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-PRESENT-001、TC-PRESENT-002 | EV-CONTRACT-006 planned；AC-BR-015~021及037/038；actual not_evaluated |
| SafePresentationPlan | `disclosure_basis` | `DisclosureQualificationRefSlot` | 存在性/提示/route/action披露依据；owner/Governance current | `SafePresentationPlan::prepare`；原rehydrate | `SafePresentationPlan::prepare.disclosure_basis` <- C04/E02/J01/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-PRESENT-001、TC-PRESENT-002 | EV-CONTRACT-006 planned；AC-BR-015~021及037/038；actual not_evaluated |
| SafePresentationPlan | `attachment_grants` | `AttachmentGrantRefSetSlot` | 获准附件或明确empty；Artifact actual grant；必要不可省略 | `SafePresentationPlan::prepare`；原rehydrate | `SafePresentationPlan::prepare.attachment_grants` <- C04/E02/J01/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-PRESENT-001、TC-PRESENT-002 | EV-CONTRACT-006 planned；AC-BR-015~021及037/038；actual not_evaluated |
| SafePresentationPlan | `presentation_kind` | `QualifiedPresentationKind` | 完整允许或无动作安全降级；explicit disclosure | `SafePresentationPlan::prepare`；原rehydrate | `SafePresentationPlan::prepare.presentation_kind` <- C04/E02/J01/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-PRESENT-001、TC-PRESENT-002 | EV-CONTRACT-006 planned；AC-BR-015~021及037/038；actual not_evaluated |
| SafePresentationPlan | `capability_ref` | `CapabilitySnapshotRef` | 逐method安装能力；qualified config | `SafePresentationPlan::prepare`；原rehydrate | `SafePresentationPlan::prepare.capability_ref` <- C04/E02/J01/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-PRESENT-001、TC-PRESENT-002 | EV-CONTRACT-006 planned；AC-BR-015~021及037/038；actual not_evaluated |
| SafePresentationPlan | `state` | `PresentationState` | 本对象业务状态；factory固定初态；hydrate只取实际local store | `SafePresentationPlan::prepare`；原rehydrate | factory原固定初态；hydrate只actual stored.state，无DTO终态输入 | 初态固定，hydrate缺失/未知state拒绝；不默认成功 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-PRESENT-001、TC-PRESENT-002 | EV-CONTRACT-006 planned；AC-BR-015~021及037/038；actual not_evaluated |
| SafePresentationPlan | `local_revision` | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW | `SafePresentationPlan::prepare`；原rehydrate | 首次固定1；后续actual UoW CAS；hydrate actual stored.local_revision | 缺actual版本拒绝；不从请求/时间生成 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-PRESENT-001、TC-PRESENT-002 | EV-CONTRACT-006 planned；AC-BR-015~021及037/038；actual not_evaluated |

### DeliveryIntent

来源：03§16.2 DeliveryIntent及其§5原factory/schema；每原字段独立missing/wrongtype/Slot/state负向实例，不抽样。

| Domain对象 | 字段 | 类型 | 原字段来源 | 构造入口 | DTO/Event/Job或系统映射 | 缺失处理 | 当前具体TC | planned验收证据方向 |
|---|---|---|---|---|---|---|---|---|
| DeliveryIntent | `intent_ref` | `DeliveryIntentRef` | local intent；Application ID/UoW | `DeliveryIntent::from_plan`；原rehydrate | `DeliveryIntent::from_plan.intent_ref` <- C04/E02/J01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-DELIVERY-001、TC-DELIVERY-002 | EV-CONTRACT-008 planned；AC-BR-015~021及037/038；actual not_evaluated |
| DeliveryIntent | `effect_ref` | `DeliveryEffectRef` | 不可变effect；首次dedup接管，重复保原 | `DeliveryIntent::from_plan`；原rehydrate | `DeliveryIntent::from_plan.effect_ref` <- C04/E02/J01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-DELIVERY-001、TC-DELIVERY-002 | EV-CONTRACT-008 planned；AC-BR-015~021及037/038；actual not_evaluated |
| DeliveryIntent | `operation_ref` | `BridgeOperationRef` | 原producer/management op；reservation | `DeliveryIntent::from_plan`；原rehydrate | `DeliveryIntent::from_plan.operation_ref` <- C04/E02/J01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-DELIVERY-001、TC-DELIVERY-002 | EV-CONTRACT-008 planned；AC-BR-015~021及037/038；actual not_evaluated |
| DeliveryIntent | `source_projection` | `StableSourceProjectionRef` | 原source/projection版本；原plan | `DeliveryIntent::from_plan`；原rehydrate | `DeliveryIntent::from_plan.source_projection` <- C04/E02/J01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-DELIVERY-001、TC-DELIVERY-002 | EV-CONTRACT-008 planned；AC-BR-015~021及037/038；actual not_evaluated |
| DeliveryIntent | `target_context` | `ImmutableDeliveryTargetRef` | 原安装/位置/parent/generation；qualified mapping | `DeliveryIntent::from_plan`；原rehydrate | `DeliveryIntent::from_plan.target_context` <- C04/E02/J01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-DELIVERY-001、TC-DELIVERY-002 | EV-CONTRACT-008 planned；AC-BR-015~021及037/038；actual not_evaluated |
| DeliveryIntent | `operation_kind` | `ExternalDeliveryKind` | send/edit/delete/reply；原safe meaning | `DeliveryIntent::from_plan`；原rehydrate | `DeliveryIntent::from_plan.operation_kind` <- C04/E02/J01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-DELIVERY-001、TC-DELIVERY-002 | EV-CONTRACT-008 planned；AC-BR-015~021及037/038；actual not_evaluated |
| DeliveryIntent | `plan_ref` | `PresentationPlanRef` | 原plan；existing qualified/degraded plan | `DeliveryIntent::from_plan`；原rehydrate | `DeliveryIntent::from_plan.plan_ref` <- C04/E02/J01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-DELIVERY-001、TC-DELIVERY-002 | EV-CONTRACT-008 planned；AC-BR-015~021及037/038；actual not_evaluated |
| DeliveryIntent | `lane_ref` | `DispatchLaneRef` | 受限顺序lane；same qualified scope | `DeliveryIntent::from_plan`；原rehydrate | `DeliveryIntent::from_plan.lane_ref` <- C04/E02/J01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-DELIVERY-001、TC-DELIVERY-002 | EV-CONTRACT-008 planned；AC-BR-015~021及037/038；actual not_evaluated |
| DeliveryIntent | `retry_basis` | `RetryEligibilityRefSlot` | 同effectretry资格；初始Missing，actual authoritative basis | `DeliveryIntent::from_plan`；原rehydrate | `DeliveryIntent::from_plan.retry_basis` <- C04/E02/J01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-DELIVERY-001、TC-DELIVERY-002 | EV-CONTRACT-008 planned；AC-BR-015~021及037/038；actual not_evaluated |
| DeliveryIntent | `state` | `DeliveryIntentState` | 本对象业务状态；factory固定初态；hydrate只取实际local store | `DeliveryIntent::from_plan`；原rehydrate | factory原固定初态；hydrate只actual stored.state，无DTO终态输入 | 初态固定，hydrate缺失/未知state拒绝；不默认成功 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-DELIVERY-001、TC-DELIVERY-002 | EV-CONTRACT-008 planned；AC-BR-015~021及037/038；actual not_evaluated |
| DeliveryIntent | `local_revision` | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW | `DeliveryIntent::from_plan`；原rehydrate | 首次固定1；后续actual UoW CAS；hydrate actual stored.local_revision | 缺actual版本拒绝；不从请求/时间生成 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-DELIVERY-001、TC-DELIVERY-002 | EV-CONTRACT-008 planned；AC-BR-015~021及037/038；actual not_evaluated |

### DeliveryAttempt

来源：03§16.2 DeliveryAttempt及其§5原factory/schema；每原字段独立missing/wrongtype/Slot/state负向实例，不抽样。

| Domain对象 | 字段 | 类型 | 原字段来源 | 构造入口 | DTO/Event/Job或系统映射 | 缺失处理 | 当前具体TC | planned验收证据方向 |
|---|---|---|---|---|---|---|---|---|
| DeliveryAttempt | `attempt_ref` | `AttemptRef` | 唯一attempt；Application ID/同UoW | `DeliveryAttempt::claim_for`；原rehydrate | `DeliveryAttempt::claim_for.attempt_ref` <- J01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-DELIVERY-001、TC-DELIVERY-002 | EV-CONTRACT-008 planned；AC-BR-015~021及037/038；actual not_evaluated |
| DeliveryAttempt | `intent_effect` | `DeliveryIntentEffectRef` | 原intent/effect；existing intent | `DeliveryAttempt::claim_for`；原rehydrate | `DeliveryAttempt::claim_for.intent_effect` <- J01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-DELIVERY-001、TC-DELIVERY-002 | EV-CONTRACT-008 planned；AC-BR-015~021及037/038；actual not_evaluated |
| DeliveryAttempt | `claim_ref` | `FencedClaimRef` | 原lane claim/fence；UoW reservation；IO前必须durable | `DeliveryAttempt::claim_for`；原rehydrate | `DeliveryAttempt::claim_for.claim_ref` <- J01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-DELIVERY-001、TC-DELIVERY-002 | EV-CONTRACT-008 planned；AC-BR-015~021及037/038；actual not_evaluated |
| DeliveryAttempt | `qualification_ref` | `DispatchEligibilityRef` | 调用前资格；current ports，不含secret值 | `DeliveryAttempt::claim_for`；原rehydrate | `DeliveryAttempt::claim_for.qualification_ref` <- J01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-DELIVERY-001、TC-DELIVERY-002 | EV-CONTRACT-008 planned；AC-BR-015~021及037/038；actual not_evaluated |
| DeliveryAttempt | `attempt_window` | `AuthorizedAttemptWindowRef` | 受权调用窗口；current eligible | `DeliveryAttempt::claim_for`；原rehydrate | `DeliveryAttempt::claim_for.attempt_window` <- J01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-DELIVERY-001、TC-DELIVERY-002 | EV-CONTRACT-008 planned；AC-BR-015~021及037/038；actual not_evaluated |
| DeliveryAttempt | `result_ref` | `PlatformBusinessResultRefSlot` | known结果Slot；初始Missing，actual adapter结果 | `DeliveryAttempt::claim_for`；原rehydrate | `DeliveryAttempt::claim_for.result_ref` <- J01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-DELIVERY-001、TC-DELIVERY-002 | EV-CONTRACT-008 planned；AC-BR-015~021及037/038；actual not_evaluated |
| DeliveryAttempt | `state` | `DeliveryAttemptState` | 本对象业务状态；factory固定初态；hydrate只取实际local store | `DeliveryAttempt::claim_for`；原rehydrate | factory原固定初态；hydrate只actual stored.state，无DTO终态输入 | 初态固定，hydrate缺失/未知state拒绝；不默认成功 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-DELIVERY-001、TC-DELIVERY-002 | EV-CONTRACT-008 planned；AC-BR-015~021及037/038；actual not_evaluated |
| DeliveryAttempt | `local_revision` | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW | `DeliveryAttempt::claim_for`；原rehydrate | 首次固定1；后续actual UoW CAS；hydrate actual stored.local_revision | 缺actual版本拒绝；不从请求/时间生成 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-DELIVERY-001、TC-DELIVERY-002 | EV-CONTRACT-008 planned；AC-BR-015~021及037/038；actual not_evaluated |

### PlatformReceipt

来源：03§16.2 PlatformReceipt及其§5原factory/schema；每原字段独立missing/wrongtype/Slot/state负向实例，不抽样。

| Domain对象 | 字段 | 类型 | 原字段来源 | 构造入口 | DTO/Event/Job或系统映射 | 缺失处理 | 当前具体TC | planned验收证据方向 |
|---|---|---|---|---|---|---|---|---|
| PlatformReceipt | `receipt_ref` | `PlatformReceiptRef` | local receipt；Application技术ID | `PlatformReceipt::from_known`；原rehydrate | `PlatformReceipt::from_known.receipt_ref` <- J01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-DELIVERY-001、TC-DELIVERY-002 | EV-CONTRACT-008 planned；AC-BR-018~021及037/038；actual not_evaluated |
| PlatformReceipt | `attempt_effect` | `AttemptEffectRef` | 原attempt/effect；actual known结果 | `PlatformReceipt::from_known`；原rehydrate | `PlatformReceipt::from_known.attempt_effect` <- J01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-DELIVERY-001、TC-DELIVERY-002 | EV-CONTRACT-008 planned；AC-BR-018~021及037/038；actual not_evaluated |
| PlatformReceipt | `result_kind` | `KnownPlatformBusinessResultKind` | business accepted/rejected；qualified adapter mapping | `PlatformReceipt::from_known`；原rehydrate | `PlatformReceipt::from_known.result_kind` <- J01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-DELIVERY-001、TC-DELIVERY-002 | EV-CONTRACT-008 planned；AC-BR-018~021及037/038；actual not_evaluated |
| PlatformReceipt | `external_locator` | `VerifiedExternalMessageLocatorSlot` | 实际结果locator或明确不适用；same method authoritative response | `PlatformReceipt::from_known`；原rehydrate | `PlatformReceipt::from_known.external_locator` <- J01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-DELIVERY-001、TC-DELIVERY-002 | EV-CONTRACT-008 planned；AC-BR-018~021及037/038；actual not_evaluated |
| PlatformReceipt | `authority_basis` | `PlatformResultAuthorityRef` | 真实method结果权威；PlatformDeliveryPort | `PlatformReceipt::from_known`；原rehydrate | `PlatformReceipt::from_known.authority_basis` <- J01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-DELIVERY-001、TC-DELIVERY-002 | EV-CONTRACT-008 planned；AC-BR-018~021及037/038；actual not_evaluated |
| PlatformReceipt | `no_effect_basis` | `NoEffectBasisRefSlot` | 明确no-effect或缺失；same actual result，不由拒绝默认 | `PlatformReceipt::from_known`；原rehydrate | `PlatformReceipt::from_known.no_effect_basis` <- J01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-DELIVERY-001、TC-DELIVERY-002 | EV-CONTRACT-008 planned；AC-BR-018~021及037/038；actual not_evaluated |
| PlatformReceipt | `safe_reason` | `SafeReasonCode` | finite reason；safe error mapper | `PlatformReceipt::from_known`；原rehydrate | `PlatformReceipt::from_known.safe_reason` <- J01/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-DELIVERY-001、TC-DELIVERY-002 | EV-CONTRACT-008 planned；AC-BR-018~021及037/038；actual not_evaluated |
| PlatformReceipt | `local_revision` | `LocalRevision` | immutable技术版本；factory固定1，后续不迁移或覆写 | `PlatformReceipt::from_known`；原rehydrate | factory固定1；hydrate只actual stored.local_revision=1；不提供CAS更新成员 | 缺actual版本或非1拒绝；不从请求/时间生成 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-DELIVERY-001、TC-DELIVERY-002 | EV-CONTRACT-008 planned；AC-BR-018~021及037/038；actual not_evaluated |

### ExternalActionBinding

来源：03§16.2 ExternalActionBinding及其§5原factory/schema；每原字段独立missing/wrongtype/Slot/state负向实例，不抽样。

| Domain对象 | 字段 | 类型 | 原字段来源 | 构造入口 | DTO/Event/Job或系统映射 | 缺失处理 | 当前具体TC | planned验收证据方向 |
|---|---|---|---|---|---|---|---|---|
| ExternalActionBinding | `action_binding_ref` | `ExternalActionBindingRef` | local action identity；Application ID | `ExternalActionBinding::bind`；原rehydrate | `ExternalActionBinding::bind.action_binding_ref` <- C05/E03/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CALLBACK-001、TC-CALLBACK-002 | EV-CONTRACT-009 planned；AC-BR-022~027及037/038；actual not_evaluated |
| ExternalActionBinding | `installation_ref` | `BridgeInstallationRef` | 原安装；current relation | `ExternalActionBinding::bind`；原rehydrate | `ExternalActionBinding::bind.installation_ref` <- C05/E03/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CALLBACK-001、TC-CALLBACK-002 | EV-CONTRACT-009 planned；AC-BR-022~027及037/038；actual not_evaluated |
| ExternalActionBinding | `source_intent` | `SourceIntentMessageRef` | 原intent/known message/source；actual known platform映射 | `ExternalActionBinding::bind`；原rehydrate | `ExternalActionBinding::bind.source_intent` <- C05/E03/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CALLBACK-001、TC-CALLBACK-002 | EV-CONTRACT-009 planned；AC-BR-022~027及037/038；actual not_evaluated |
| ExternalActionBinding | `actor_responsibility` | `ActorResponsibilityRef` | 正式有权actor；ActorResponsibilityPort | `ExternalActionBinding::bind`；原rehydrate | `ExternalActionBinding::bind.actor_responsibility` <- C05/E03/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CALLBACK-001、TC-CALLBACK-002 | EV-CONTRACT-009 planned；AC-BR-022~027及037/038；actual not_evaluated |
| ExternalActionBinding | `target_action` | `OwnerTargetActionRef` | 正式owner目标动作；OwnerActionPort | `ExternalActionBinding::bind`；原rehydrate | `ExternalActionBinding::bind.target_action` <- C05/E03/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CALLBACK-001、TC-CALLBACK-002 | EV-CONTRACT-009 planned；AC-BR-022~027及037/038；actual not_evaluated |
| ExternalActionBinding | `owner_revision` | `OwnerActionStateRevision` | 正式owner当前状态条件；same owner | `ExternalActionBinding::bind`；原rehydrate | `ExternalActionBinding::bind.owner_revision` <- C05/E03/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CALLBACK-001、TC-CALLBACK-002 | EV-CONTRACT-009 planned；AC-BR-022~027及037/038；actual not_evaluated |
| ExternalActionBinding | `binding_generation` | `BindingGeneration` | 原relation代际；current binding | `ExternalActionBinding::bind`；原rehydrate | `ExternalActionBinding::bind.binding_generation` <- C05/E03/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CALLBACK-001、TC-CALLBACK-002 | EV-CONTRACT-009 planned；AC-BR-022~027及037/038；actual not_evaluated |
| ExternalActionBinding | `expiry_one_use` | `ActionExpiryOneUseRef` | 正式期限one-use basis；owner/CallbackRepository | `ExternalActionBinding::bind`；原rehydrate | `ExternalActionBinding::bind.expiry_one_use` <- C05/E03/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CALLBACK-001、TC-CALLBACK-002 | EV-CONTRACT-009 planned；AC-BR-022~027及037/038；actual not_evaluated |
| ExternalActionBinding | `authorization_basis` | `ActionAuthorizationBasisRef` | 动作授权独立于披露；actual owner | `ExternalActionBinding::bind`；原rehydrate | `ExternalActionBinding::bind.authorization_basis` <- C05/E03/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CALLBACK-001、TC-CALLBACK-002 | EV-CONTRACT-009 planned；AC-BR-022~027及037/038；actual not_evaluated |
| ExternalActionBinding | `one_use_claim` | `OneUseClaimRefSlot` | 原claim不可换op；初始Missing，Claimed必Established | `ExternalActionBinding::bind`；原rehydrate | `ExternalActionBinding::bind.one_use_claim` <- C05/E03/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CALLBACK-001、TC-CALLBACK-002 | EV-CONTRACT-009 planned；AC-BR-022~027及037/038；actual not_evaluated |
| ExternalActionBinding | `state` | `ExternalActionState` | 本对象业务状态；factory固定初态；hydrate只取实际local store | `ExternalActionBinding::bind`；原rehydrate | factory原固定初态；hydrate只actual stored.state，无DTO终态输入 | 初态固定，hydrate缺失/未知state拒绝；不默认成功 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CALLBACK-001、TC-CALLBACK-002 | EV-CONTRACT-009 planned；AC-BR-022~027及037/038；actual not_evaluated |
| ExternalActionBinding | `local_revision` | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW | `ExternalActionBinding::bind`；原rehydrate | 首次固定1；后续actual UoW CAS；hydrate actual stored.local_revision | 缺actual版本拒绝；不从请求/时间生成 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CALLBACK-001、TC-CALLBACK-002 | EV-CONTRACT-009 planned；AC-BR-022~027及037/038；actual not_evaluated |

### CallbackHandoffRecord

来源：03§16.2 CallbackHandoffRecord及其§5原factory/schema；每原字段独立missing/wrongtype/Slot/state负向实例，不抽样。

| Domain对象 | 字段 | 类型 | 原字段来源 | 构造入口 | DTO/Event/Job或系统映射 | 缺失处理 | 当前具体TC | planned验收证据方向 |
|---|---|---|---|---|---|---|---|---|
| CallbackHandoffRecord | `callback_ref` | `CallbackRecordRef` | local record identity；Application ID | `CallbackHandoffRecord::from_verified`；原rehydrate | `CallbackHandoffRecord::from_verified.callback_ref` <- E03/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CALLBACK-001、TC-CALLBACK-002 | EV-CONTRACT-009 planned；AC-BR-022~027及037/038；actual not_evaluated |
| CallbackHandoffRecord | `operation_ref` | `BridgeOperationRef` | 原owner op；首次dedup，一次消费复用 | `CallbackHandoffRecord::from_verified`；原rehydrate | `CallbackHandoffRecord::from_verified.operation_ref` <- E03/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CALLBACK-001、TC-CALLBACK-002 | EV-CONTRACT-009 planned；AC-BR-022~027及037/038；actual not_evaluated |
| CallbackHandoffRecord | `action_binding_ref` | `ExternalActionBindingRefSlot` | 原action；完整verified资格 | `CallbackHandoffRecord::from_verified`；原rehydrate | `CallbackHandoffRecord::from_verified.action_binding_ref` <- E03/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CALLBACK-001、TC-CALLBACK-002 | EV-CONTRACT-009 planned；AC-BR-022~027及037/038；actual not_evaluated |
| CallbackHandoffRecord | `verification_ref` | `CallbackVerificationRefSlot` | 完整来源责任验证；CallbackVerificationPort | `CallbackHandoffRecord::from_verified`；原rehydrate | `CallbackHandoffRecord::from_verified.verification_ref` <- E03/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CALLBACK-001、TC-CALLBACK-002 | EV-CONTRACT-009 planned；AC-BR-022~027及037/038；actual not_evaluated |
| CallbackHandoffRecord | `owner_action_ref` | `OwnerTargetActionRefSlot` | 正式动作；OwnerActionPort | `CallbackHandoffRecord::from_verified`；原rehydrate | `CallbackHandoffRecord::from_verified.owner_action_ref` <- E03/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CALLBACK-001、TC-CALLBACK-002 | EV-CONTRACT-009 planned；AC-BR-022~027及037/038；actual not_evaluated |
| CallbackHandoffRecord | `one_use_claim` | `OneUseClaimRefSlot` | one-use原op关联；初始Missing，Pending必Established | `CallbackHandoffRecord::from_verified`；原rehydrate | `CallbackHandoffRecord::from_verified.one_use_claim` <- E03/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CALLBACK-001、TC-CALLBACK-002 | EV-CONTRACT-009 planned；AC-BR-022~027及037/038；actual not_evaluated |
| CallbackHandoffRecord | `protocol_disposition` | `ProtocolAckDisposition` | 实际protocol ACK；private entry | `CallbackHandoffRecord::from_verified`；原rehydrate | `CallbackHandoffRecord::from_verified.protocol_disposition` <- E03/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CALLBACK-001、TC-CALLBACK-002 | EV-CONTRACT-009 planned；AC-BR-022~027及037/038；actual not_evaluated |
| CallbackHandoffRecord | `owner_result` | `OwnerActionResultRefSlot` | 同opactual owner结果；初始Missing，actual owner response | `CallbackHandoffRecord::from_verified`；原rehydrate | `CallbackHandoffRecord::from_verified.owner_result` <- E03/J02原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CALLBACK-001、TC-CALLBACK-002 | EV-CONTRACT-009 planned；AC-BR-022~027及037/038；actual not_evaluated |
| CallbackHandoffRecord | `state` | `CallbackHandoffState` | 本对象业务状态；factory固定初态；hydrate只取实际local store | `CallbackHandoffRecord::from_verified`；原rehydrate | factory原固定初态；hydrate只actual stored.state，无DTO终态输入 | 初态固定，hydrate缺失/未知state拒绝；不默认成功 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CALLBACK-001、TC-CALLBACK-002 | EV-CONTRACT-009 planned；AC-BR-022~027及037/038；actual not_evaluated |
| CallbackHandoffRecord | `local_revision` | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW | `CallbackHandoffRecord::from_verified`；原rehydrate | 首次固定1；后续actual UoW CAS；hydrate actual stored.local_revision | 缺actual版本拒绝；不从请求/时间生成 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CALLBACK-001、TC-CALLBACK-002 | EV-CONTRACT-009 planned；AC-BR-022~027及037/038；actual not_evaluated |

### DedupRecord

来源：03§16.2 DedupRecord及其§5原factory/schema；每原字段独立missing/wrongtype/Slot/state负向实例，不抽样。

| Domain对象 | 字段 | 类型 | 原字段来源 | 构造入口 | DTO/Event/Job或系统映射 | 缺失处理 | 当前具体TC | planned验收证据方向 |
|---|---|---|---|---|---|---|---|---|
| DedupRecord | `dedup_ref` | `DedupRecordRef` | local record；Application ID/UoW | `DedupRecord::reserve`；原rehydrate | `DedupRecord::reserve.dedup_ref` <- actual C/E/J；J05目标expiry原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-KEY-001、TC-KEY-002 | EV-CONTRACT-010 planned；AC-BR-028~036及037/038；actual not_evaluated |
| DedupRecord | `namespace_scope` | `DedupNamespaceScope` | 六namespace及scope；trusted entry/resolver | `DedupRecord::reserve`；原rehydrate | `DedupRecord::reserve.namespace_scope` <- actual C/E/J；J05目标expiry原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-KEY-001、TC-KEY-002 | EV-CONTRACT-010 planned；AC-BR-028~036及037/038；actual not_evaluated |
| DedupRecord | `idempotency_key` | `QualifiedIdempotencyKey` | 原technical key；原metadata或qualified source | `DedupRecord::reserve`；原rehydrate | `DedupRecord::reserve.idempotency_key` <- actual C/E/J；J05目标expiry原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-KEY-001、TC-KEY-002 | EV-CONTRACT-010 planned；AC-BR-028~036及037/038；actual not_evaluated |
| DedupRecord | `semantic_identity` | `BodyFreeOperationMeaningRef` | 安全结构含义；对应操作族source/target/version | `DedupRecord::reserve`；原rehydrate | `DedupRecord::reserve.semantic_identity` <- actual C/E/J；J05目标expiry原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-KEY-001、TC-KEY-002 | EV-CONTRACT-010 planned；AC-BR-028~036及037/038；actual not_evaluated |
| DedupRecord | `operation_effect` | `OriginalOperationEffectRef` | 原op/effect-kind/ID；首次reservation后不改 | `DedupRecord::reserve`；原rehydrate | `DedupRecord::reserve.operation_effect` <- actual C/E/J；J05目标expiry原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-KEY-001、TC-KEY-002 | EV-CONTRACT-010 planned；AC-BR-028~036及037/038；actual not_evaluated |
| DedupRecord | `result_ref` | `SafeOriginalResultRefSlot` | 实际stored结果；初始Missing | `DedupRecord::reserve`；原rehydrate | `DedupRecord::reserve.result_ref` <- actual C/E/J；J05目标expiry原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-KEY-001、TC-KEY-002 | EV-CONTRACT-010 planned；AC-BR-028~036及037/038；actual not_evaluated |
| DedupRecord | `retention_window` | `QualifiedRetentionWindowRef` | 去重/恢复有限窗口；formal retention policy | `DedupRecord::reserve`；原rehydrate | `DedupRecord::reserve.retention_window` <- actual C/E/J；J05目标expiry原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-KEY-001、TC-KEY-002 | EV-CONTRACT-010 planned；AC-BR-028~036及037/038；actual not_evaluated |
| DedupRecord | `state` | `DedupState` | 本对象业务状态；factory固定初态；hydrate只取实际local store | `DedupRecord::reserve`；原rehydrate | factory原固定初态；hydrate只actual stored.state，无DTO终态输入 | 初态固定，hydrate缺失/未知state拒绝；不默认成功 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-KEY-001、TC-KEY-002 | EV-CONTRACT-010 planned；AC-BR-028~036及037/038；actual not_evaluated |
| DedupRecord | `local_revision` | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW | `DedupRecord::reserve`；原rehydrate | 首次固定1；后续actual UoW CAS；hydrate actual stored.local_revision | 缺actual版本拒绝；不从请求/时间生成 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-KEY-001、TC-KEY-002 | EV-CONTRACT-010 planned；AC-BR-028~036及037/038；actual not_evaluated |

### StreamCursor

来源：03§16.2 StreamCursor及其§5原factory/schema；每原字段独立missing/wrongtype/Slot/state负向实例，不抽样。

| Domain对象 | 字段 | 类型 | 原字段来源 | 构造入口 | DTO/Event/Job或系统映射 | 缺失处理 | 当前具体TC | planned验收证据方向 |
|---|---|---|---|---|---|---|---|---|
| StreamCursor | `cursor_ref` | `StreamCursorRef` | local cursor；Application ID | `StreamCursor::initialize`；原rehydrate | `StreamCursor::initialize.cursor_ref` <- E01 notice/J03 C/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CURSOR-001、TC-CURSOR-002 | EV-CONTRACT-011 planned；AC-BR-028~036及037/038；actual not_evaluated |
| StreamCursor | `namespace_stream` | `CursorNamespaceStream` | stage/stream/安装/scope；registered source | `StreamCursor::initialize`；原rehydrate | `StreamCursor::initialize.namespace_stream` <- E01 notice/J03 C/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CURSOR-001、TC-CURSOR-002 | EV-CONTRACT-011 planned；AC-BR-028~036及037/038；actual not_evaluated |
| StreamCursor | `epoch` | `QualifiedStreamEpoch` | 原epoch；actual source | `StreamCursor::initialize`；原rehydrate | `StreamCursor::initialize.epoch` <- E01 notice/J03 C/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CURSOR-001、TC-CURSOR-002 | EV-CONTRACT-011 planned；AC-BR-028~036及037/038；actual not_evaluated |
| StreamCursor | `position` | `OpaqueStreamPositionSlot` | 原位置/未初始化；source；initialize Uninitialized | `StreamCursor::initialize`；原rehydrate | `StreamCursor::initialize.position` <- E01 notice/J03 C/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CURSOR-001、TC-CURSOR-002 | EV-CONTRACT-011 planned；AC-BR-028~036及037/038；actual not_evaluated |
| StreamCursor | `comparator_ref` | `AuthoritativeComparatorRefSlot` | source比较资格；actual registered comparator/欠缺 | `StreamCursor::initialize`；原rehydrate | `StreamCursor::initialize.comparator_ref` <- E01 notice/J03 C/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CURSOR-001、TC-CURSOR-002 | EV-CONTRACT-011 planned；AC-BR-028~036及037/038；actual not_evaluated |
| StreamCursor | `coverage_ref` | `ContinuityCoverageRefSlot` | 本阶段完整覆盖；initialize Missing，actual local+source证明 | `StreamCursor::initialize`；原rehydrate | `StreamCursor::initialize.coverage_ref` <- E01 notice/J03 C/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CURSOR-001、TC-CURSOR-002 | EV-CONTRACT-011 planned；AC-BR-028~036及037/038；actual not_evaluated |
| StreamCursor | `revision` | `CursorRevision` | cursor专用CAS；初始1，合法推进checked next | `StreamCursor::initialize`；原rehydrate | `StreamCursor::initialize.revision` <- E01 notice/J03 C/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CURSOR-001、TC-CURSOR-002 | EV-CONTRACT-011 planned；AC-BR-028~036及037/038；actual not_evaluated |
| StreamCursor | `state` | `StreamCursorState` | 本对象业务状态；factory固定初态；hydrate只取实际local store | `StreamCursor::initialize`；原rehydrate | factory原固定初态；hydrate只actual stored.state，无DTO终态输入 | 初态固定，hydrate缺失/未知state拒绝；不默认成功 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CURSOR-001、TC-CURSOR-002 | EV-CONTRACT-011 planned；AC-BR-028~036及037/038；actual not_evaluated |
| StreamCursor | `local_revision` | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW | `StreamCursor::initialize`；原rehydrate | 首次固定1；后续actual UoW CAS；hydrate actual stored.local_revision | 缺actual版本拒绝；不从请求/时间生成 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CURSOR-001、TC-CURSOR-002 | EV-CONTRACT-011 planned；AC-BR-028~036及037/038；actual not_evaluated |

### GapRecord

来源：03§16.2 GapRecord及其§5原factory/schema；每原字段独立missing/wrongtype/Slot/state负向实例，不抽样。

| Domain对象 | 字段 | 类型 | 原字段来源 | 构造入口 | DTO/Event/Job或系统映射 | 缺失处理 | 当前具体TC | planned验收证据方向 |
|---|---|---|---|---|---|---|---|---|
| GapRecord | `gap_ref` | `GapRef` | local gap；Application技术ID | `GapRecord::detect`；原rehydrate | `GapRecord::detect.gap_ref` <- E01 notice/C06/J03原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CURSOR-001、TC-CURSOR-002 | EV-CONTRACT-011 planned；AC-BR-028~036及037/038；actual not_evaluated |
| GapRecord | `cursor_ref` | `StreamCursorRef` | 原cursor；existing read | `GapRecord::detect`；原rehydrate | `GapRecord::detect.cursor_ref` <- E01 notice/C06/J03原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CURSOR-001、TC-CURSOR-002 | EV-CONTRACT-011 planned；AC-BR-028~036及037/038；actual not_evaluated |
| GapRecord | `operation_ref` | `BridgeOperationRef` | 原gap tracking op；detect同UoW local-only技术op，恢复不换 | `GapRecord::detect`；原rehydrate | `GapRecord::detect.operation_ref` <- E01 notice/C06/J03原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CURSOR-001、TC-CURSOR-002 | EV-CONTRACT-011 planned；AC-BR-028~036及037/038；actual not_evaluated |
| GapRecord | `range_ref` | `QualifiedGapRangeRef` | known/unknown原range；qualified source比较/actual local disconnect | `GapRecord::detect`；原rehydrate | `GapRecord::detect.range_ref` <- E01 notice/C06/J03原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CURSOR-001、TC-CURSOR-002 | EV-CONTRACT-011 planned；AC-BR-028~036及037/038；actual not_evaluated |
| GapRecord | `reason` | `SafeGapReason` | 有限缺口原因；adapter/source | `GapRecord::detect`；原rehydrate | `GapRecord::detect.reason` <- E01 notice/C06/J03原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CURSOR-001、TC-CURSOR-002 | EV-CONTRACT-011 planned；AC-BR-028~036及037/038；actual not_evaluated |
| GapRecord | `coverage_ref` | `AuthoritativeCoverageRefSlot` | actual完整coverage；初始Missing | `GapRecord::detect`；原rehydrate | `GapRecord::detect.coverage_ref` <- E01 notice/C06/J03原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CURSOR-001、TC-CURSOR-002 | EV-CONTRACT-011 planned；AC-BR-028~036及037/038；actual not_evaluated |
| GapRecord | `recovery_ref` | `RecoveryRecordRefSlot` | 原受权恢复记录；初始Missing/真实同subject计划 | `GapRecord::detect`；原rehydrate | `GapRecord::detect.recovery_ref` <- E01 notice/C06/J03原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CURSOR-001、TC-CURSOR-002 | EV-CONTRACT-011 planned；AC-BR-028~036及037/038；actual not_evaluated |
| GapRecord | `window_basis` | `RecoveryWindowRefSlot` | 恢复window或欠缺；formal source；Missing可安全保gap | `GapRecord::detect`；原rehydrate | `GapRecord::detect.window_basis` <- E01 notice/C06/J03原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CURSOR-001、TC-CURSOR-002 | EV-CONTRACT-011 planned；AC-BR-028~036及037/038；actual not_evaluated |
| GapRecord | `state` | `GapState` | 本对象业务状态；factory固定初态；hydrate只取实际local store | `GapRecord::detect`；原rehydrate | factory原固定初态；hydrate只actual stored.state，无DTO终态输入 | 初态固定，hydrate缺失/未知state拒绝；不默认成功 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CURSOR-001、TC-CURSOR-002 | EV-CONTRACT-011 planned；AC-BR-028~036及037/038；actual not_evaluated |
| GapRecord | `local_revision` | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW | `GapRecord::detect`；原rehydrate | 首次固定1；后续actual UoW CAS；hydrate actual stored.local_revision | 缺actual版本拒绝；不从请求/时间生成 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-CURSOR-001、TC-CURSOR-002 | EV-CONTRACT-011 planned；AC-BR-028~036及037/038；actual not_evaluated |

### DispatchLane

来源：03§16.2 DispatchLane及其§5原factory/schema；每原字段独立missing/wrongtype/Slot/state负向实例，不抽样。

| Domain对象 | 字段 | 类型 | 原字段来源 | 构造入口 | DTO/Event/Job或系统映射 | 缺失处理 | 当前具体TC | planned验收证据方向 |
|---|---|---|---|---|---|---|---|---|
| DispatchLane | `lane_ref` | `DispatchLaneRef` | local lane；Application ID/UoW | `DispatchLane::for_scope`；原rehydrate | `DispatchLane::for_scope.lane_ref` <- C04/E02/J01/J02/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-RATE-001、TC-RATE-002 | EV-CONTRACT-012 planned；AC-BR-028~036及037/038；actual not_evaluated |
| DispatchLane | `order_scope` | `QualifiedLaneOrderScope` | 明确order/resource/scope；qualified mapping/adapter | `DispatchLane::for_scope`；原rehydrate | `DispatchLane::for_scope.order_scope` <- C04/E02/J01/J02/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-RATE-001、TC-RATE-002 | EV-CONTRACT-012 planned；AC-BR-028~036及037/038；actual not_evaluated |
| DispatchLane | `head_dependency` | `DeliveryDependencyRefSlot` | 原create/thread依赖；known mapping或formal NotRequired | `DispatchLane::for_scope`；原rehydrate | `DispatchLane::for_scope.head_dependency` <- C04/E02/J01/J02/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-RATE-001、TC-RATE-002 | EV-CONTRACT-012 planned；AC-BR-028~036及037/038；actual not_evaluated |
| DispatchLane | `claim_fence` | `FencedClaimRefSlot` | 当前本地claim；初始Missing，Held必Established | `DispatchLane::for_scope`；原rehydrate | `DispatchLane::for_scope.claim_fence` <- C04/E02/J01/J02/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-RATE-001、TC-RATE-002 | EV-CONTRACT-012 planned；AC-BR-028~036及037/038；actual not_evaluated |
| DispatchLane | `unresolved_head` | `Option<AttemptEffectRef>` | 释放后仍未知的原head；初始None；actual unknown原attempt不能越过 | `DispatchLane::for_scope`；原rehydrate | `DispatchLane::for_scope.unresolved_head` <- C04/E02/J01/J02/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | None仅原optional/state允许；required-by-state缺失拒绝 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-RATE-001、TC-RATE-002 | EV-CONTRACT-012 planned；AC-BR-028~036及037/038；actual not_evaluated |
| DispatchLane | `rate_bounds` | `QualifiedRateLimitBoundSet` | 全部适用下界向量；current rate authority/actual响应 | `DispatchLane::for_scope`；原rehydrate | `DispatchLane::for_scope.rate_bounds` <- C04/E02/J01/J02/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-RATE-001、TC-RATE-002 | EV-CONTRACT-012 planned；AC-BR-028~036及037/038；actual not_evaluated |
| DispatchLane | `retry_budget` | `RetryBudgetRef` | 原scope窗口内预算；qualified policy及store actual usage | `DispatchLane::for_scope`；原rehydrate | `DispatchLane::for_scope.retry_budget` <- C04/E02/J01/J02/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-RATE-001、TC-RATE-002 | EV-CONTRACT-012 planned；AC-BR-028~036及037/038；actual not_evaluated |
| DispatchLane | `revision` | `LaneRevision` | lane专用CAS；初始1；同UoW checked next | `DispatchLane::for_scope`；原rehydrate | `DispatchLane::for_scope.revision` <- C04/E02/J01/J02/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-RATE-001、TC-RATE-002 | EV-CONTRACT-012 planned；AC-BR-028~036及037/038；actual not_evaluated |
| DispatchLane | `state` | `DispatchLaneState` | 本对象业务状态；factory固定初态；hydrate只取实际local store | `DispatchLane::for_scope`；原rehydrate | factory原固定初态；hydrate只actual stored.state，无DTO终态输入 | 初态固定，hydrate缺失/未知state拒绝；不默认成功 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-RATE-001、TC-RATE-002 | EV-CONTRACT-012 planned；AC-BR-028~036及037/038；actual not_evaluated |
| DispatchLane | `local_revision` | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW | `DispatchLane::for_scope`；原rehydrate | 首次固定1；后续actual UoW CAS；hydrate actual stored.local_revision | 缺actual版本拒绝；不从请求/时间生成 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-RATE-001、TC-RATE-002 | EV-CONTRACT-012 planned；AC-BR-028~036及037/038；actual not_evaluated |

### RecoveryRecord

来源：03§16.2 RecoveryRecord及其§5原factory/schema；每原字段独立missing/wrongtype/Slot/state负向实例，不抽样。

| Domain对象 | 字段 | 类型 | 原字段来源 | 构造入口 | DTO/Event/Job或系统映射 | 缺失处理 | 当前具体TC | planned验收证据方向 |
|---|---|---|---|---|---|---|---|---|
| RecoveryRecord | `recovery_ref` | `RecoveryRecordRef` | local recovery identity；Application技术ID | `RecoveryRecord::request`；原rehydrate | `RecoveryRecord::request.recovery_ref` <- C06/J02/J03原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-RECOVERY-001、TC-RECOVERY-002 | EV-CONTRACT-013 planned；AC-BR-028~036及037/038；actual not_evaluated |
| RecoveryRecord | `original_subject` | `OriginalRecoverableSubjectRef` | 既有原subject；受权snapshot，不新造external实体 | `RecoveryRecord::request`；原rehydrate | `RecoveryRecord::request.original_subject` <- C06/J02/J03原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-RECOVERY-001、TC-RECOVERY-002 | EV-CONTRACT-013 planned；AC-BR-028~036及037/038；actual not_evaluated |
| RecoveryRecord | `operation_effect` | `OriginalOperationEffectRef` | 原op/effect-kind/ID；same existing record | `RecoveryRecord::request`；原rehydrate | `RecoveryRecord::request.operation_effect` <- C06/J02/J03原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-RECOVERY-001、TC-RECOVERY-002 | EV-CONTRACT-013 planned；AC-BR-028~036及037/038；actual not_evaluated |
| RecoveryRecord | `authorization_basis` | `RecoveryAuthorizationRef` | 显式受权恢复依据；当前Policy/Gate维护授权 | `RecoveryRecord::request`；原rehydrate | `RecoveryRecord::request.authorization_basis` <- C06/J02/J03原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-RECOVERY-001、TC-RECOVERY-002 | EV-CONTRACT-013 planned；AC-BR-028~036及037/038；actual not_evaluated |
| RecoveryRecord | `qualification_ref` | `RecoveryQualificationRefSlot` | probe current资格或缺口；初始Missing | `RecoveryRecord::request`；原rehydrate | `RecoveryRecord::request.qualification_ref` <- C06/J02/J03原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-RECOVERY-001、TC-RECOVERY-002 | EV-CONTRACT-013 planned；AC-BR-028~036及037/038；actual not_evaluated |
| RecoveryRecord | `probe_result` | `AuthoritativeProbeResultRefSlot` | 实际权威结果或未知；初始Missing | `RecoveryRecord::request`；原rehydrate | `RecoveryRecord::request.probe_result` <- C06/J02/J03原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-RECOVERY-001、TC-RECOVERY-002 | EV-CONTRACT-013 planned；AC-BR-028~036及037/038；actual not_evaluated |
| RecoveryRecord | `resolution_kind` | `SafeRecoveryResolutionKind` | 实际恢复结论；initial Unresolved；actual probe后确定 | `RecoveryRecord::request`；原rehydrate | `RecoveryRecord::request.resolution_kind` <- C06/J02/J03原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-RECOVERY-001、TC-RECOVERY-002 | EV-CONTRACT-013 planned；AC-BR-028~036及037/038；actual not_evaluated |
| RecoveryRecord | `safe_reason` | `SafeReasonCode` | 有限reason；safe mapper | `RecoveryRecord::request`；原rehydrate | `RecoveryRecord::request.safe_reason` <- C06/J02/J03原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-RECOVERY-001、TC-RECOVERY-002 | EV-CONTRACT-013 planned；AC-BR-028~036及037/038；actual not_evaluated |
| RecoveryRecord | `state` | `RecoveryState` | 本对象业务状态；factory固定初态；hydrate只取实际local store | `RecoveryRecord::request`；原rehydrate | factory原固定初态；hydrate只actual stored.state，无DTO终态输入 | 初态固定，hydrate缺失/未知state拒绝；不默认成功 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-RECOVERY-001、TC-RECOVERY-002 | EV-CONTRACT-013 planned；AC-BR-028~036及037/038；actual not_evaluated |
| RecoveryRecord | `local_revision` | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW | `RecoveryRecord::request`；原rehydrate | 首次固定1；后续actual UoW CAS；hydrate actual stored.local_revision | 缺actual版本拒绝；不从请求/时间生成 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-RECOVERY-001、TC-RECOVERY-002 | EV-CONTRACT-013 planned；AC-BR-028~036及037/038；actual not_evaluated |

### SafeAuditRecord

来源：03§16.2 SafeAuditRecord及其§5原factory/schema；每原字段独立missing/wrongtype/Slot/state负向实例，不抽样。

| Domain对象 | 字段 | 类型 | 原字段来源 | 构造入口 | DTO/Event/Job或系统映射 | 缺失处理 | 当前具体TC | planned验收证据方向 |
|---|---|---|---|---|---|---|---|---|
| SafeAuditRecord | `audit_ref` | `SafeAuditRef` | local audit identity；Application ID/UoW | `SafeAuditRecord::from_mutation`；原rehydrate | `SafeAuditRecord::from_mutation.audit_ref` <- actual C/E/J各U原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-AUDIT-001、TC-AUDIT-002 | EV-CONTRACT-016 planned；AC-BR-028~036及037/038；actual not_evaluated |
| SafeAuditRecord | `mutation_ref` | `LocalMutationRef` | 真实local变更；same UoW reservation/实际提交，不是外部事实 | `SafeAuditRecord::from_mutation`；原rehydrate | `SafeAuditRecord::from_mutation.mutation_ref` <- actual C/E/J各U原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-AUDIT-001、TC-AUDIT-002 | EV-CONTRACT-016 planned；AC-BR-028~036及037/038；actual not_evaluated |
| SafeAuditRecord | `operation_ref` | `BridgeOperationRef` | 原operation；same mutation | `SafeAuditRecord::from_mutation`；原rehydrate | `SafeAuditRecord::from_mutation.operation_ref` <- actual C/E/J各U原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-AUDIT-001、TC-AUDIT-002 | EV-CONTRACT-016 planned；AC-BR-028~036及037/038；actual not_evaluated |
| SafeAuditRecord | `subject_refs` | `AuthorizedSafeSubjectRefSet` | 获准record主语；producer policy current | `SafeAuditRecord::from_mutation`；原rehydrate | `SafeAuditRecord::from_mutation.subject_refs` <- actual C/E/J各U原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-AUDIT-001、TC-AUDIT-002 | EV-CONTRACT-016 planned；AC-BR-028~036及037/038；actual not_evaluated |
| SafeAuditRecord | `stage_reason` | `SafeStageReason` | 真实stage及finite reason；实际本地变更 | `SafeAuditRecord::from_mutation`；原rehydrate | `SafeAuditRecord::from_mutation.stage_reason` <- actual C/E/J各U原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-AUDIT-001、TC-AUDIT-002 | EV-CONTRACT-016 planned；AC-BR-028~036及037/038；actual not_evaluated |
| SafeAuditRecord | `basis_refs` | `SafeBasisRefSet` | 安全依据集合；same policy/qualified sources | `SafeAuditRecord::from_mutation`；原rehydrate | `SafeAuditRecord::from_mutation.basis_refs` <- actual C/E/J各U原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-AUDIT-001、TC-AUDIT-002 | EV-CONTRACT-016 planned；AC-BR-028~036及037/038；actual not_evaluated |
| SafeAuditRecord | `trace_ref` | `TrustedTraceRef` | 原可信trace；metadata | `SafeAuditRecord::from_mutation`；原rehydrate | `SafeAuditRecord::from_mutation.trace_ref` <- actual C/E/J各U原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-AUDIT-001、TC-AUDIT-002 | EV-CONTRACT-016 planned；AC-BR-028~036及037/038；actual not_evaluated |
| SafeAuditRecord | `producer_revision` | `SafeProducerSchemaRevision` | producer schema版本；actual registered schema | `SafeAuditRecord::from_mutation`；原rehydrate | `SafeAuditRecord::from_mutation.producer_revision` <- actual C/E/J各U原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-AUDIT-001、TC-AUDIT-002 | EV-CONTRACT-016 planned；AC-BR-028~036及037/038；actual not_evaluated |
| SafeAuditRecord | `local_revision` | `LocalRevision` | immutable技术版本；factory固定1，后续不迁移或覆写 | `SafeAuditRecord::from_mutation`；原rehydrate | factory固定1；hydrate只actual stored.local_revision=1；不提供CAS更新成员 | 缺actual版本或非1拒绝；不从请求/时间生成 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-AUDIT-001、TC-AUDIT-002 | EV-CONTRACT-016 planned；AC-BR-028~036及037/038；actual not_evaluated |

### SafeHandoffRecord

来源：03§16.2 SafeHandoffRecord及其§5原factory/schema；每原字段独立missing/wrongtype/Slot/state负向实例，不抽样。

| Domain对象 | 字段 | 类型 | 原字段来源 | 构造入口 | DTO/Event/Job或系统映射 | 缺失处理 | 当前具体TC | planned验收证据方向 |
|---|---|---|---|---|---|---|---|---|
| SafeHandoffRecord | `handoff_ref` | `SafeHandoffRef` | local handoff；Application ID/UoW | `SafeHandoffRecord::from_canonical`；原rehydrate | `SafeHandoffRecord::from_canonical.handoff_ref` <- 条件O01/J04/E04/J02 Consumer/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-AUDIT-001、TC-AUDIT-002 | EV-CONTRACT-016 planned；AC-BR-028~036及037/038；actual not_evaluated |
| SafeHandoffRecord | `source_audit_ref` | `SafeAuditRef` | 真实唯一producer；existing mutation audit | `SafeHandoffRecord::from_canonical`；原rehydrate | `SafeHandoffRecord::from_canonical.source_audit_ref` <- 条件O01/J04/E04/J02 Consumer/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-AUDIT-001、TC-AUDIT-002 | EV-CONTRACT-016 planned；AC-BR-028~036及037/038；actual not_evaluated |
| SafeHandoffRecord | `canonical_material_ref` | `CanonicalSafeMaterialRef` | actual canonical/schema引用；SafeObservationPort，不存body | `SafeHandoffRecord::from_canonical`；原rehydrate | `SafeHandoffRecord::from_canonical.canonical_material_ref` <- 条件O01/J04/E04/J02 Consumer/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-AUDIT-001、TC-AUDIT-002 | EV-CONTRACT-016 planned；AC-BR-028~036及037/038；actual not_evaluated |
| SafeHandoffRecord | `producer_admission` | `ProducerAdmissionRef` | 正式consumer准入；Observability current | `SafeHandoffRecord::from_canonical`；原rehydrate | `SafeHandoffRecord::from_canonical.producer_admission` <- 条件O01/J04/E04/J02 Consumer/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-AUDIT-001、TC-AUDIT-002 | EV-CONTRACT-016 planned；AC-BR-028~036及037/038；actual not_evaluated |
| SafeHandoffRecord | `operation_ref` | `BridgeOperationRef` | handoff namespace原op；首次reservation不换 | `SafeHandoffRecord::from_canonical`；原rehydrate | `SafeHandoffRecord::from_canonical.operation_ref` <- 条件O01/J04/E04/J02 Consumer/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-AUDIT-001、TC-AUDIT-002 | EV-CONTRACT-016 planned；AC-BR-028~036及037/038；actual not_evaluated |
| SafeHandoffRecord | `consumer_result` | `ConsumerDispositionRefSlot` | actual consumer分类；初始Missing | `SafeHandoffRecord::from_canonical`；原rehydrate | `SafeHandoffRecord::from_canonical.consumer_result` <- 条件O01/J04/E04/J02 Consumer/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-AUDIT-001、TC-AUDIT-002 | EV-CONTRACT-016 planned；AC-BR-028~036及037/038；actual not_evaluated |
| SafeHandoffRecord | `retention_window` | `QualifiedRetentionWindowRef` | 准入交接有限窗口；formal policy | `SafeHandoffRecord::from_canonical`；原rehydrate | `SafeHandoffRecord::from_canonical.retention_window` <- 条件O01/J04/E04/J02 Consumer/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-AUDIT-001、TC-AUDIT-002 | EV-CONTRACT-016 planned；AC-BR-028~036及037/038；actual not_evaluated |
| SafeHandoffRecord | `claim` | `QualificationSlot<SafeHandoffClaimRef>` | 原本地交接claim；初始Missing，Dispatching Established | `SafeHandoffRecord::from_canonical`；原rehydrate | `SafeHandoffRecord::from_canonical.claim` <- 条件O01/J04/E04/J02 Consumer/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | 明示Missing/Stale仅原schema与state允许；required Established缺失阻效果 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-AUDIT-001、TC-AUDIT-002 | EV-CONTRACT-016 planned；AC-BR-028~036及037/038；actual not_evaluated |
| SafeHandoffRecord | `producer_revision` | `SafeProducerSchemaRevision` | canonical精确schema；actual producer contract | `SafeHandoffRecord::from_canonical`；原rehydrate | `SafeHandoffRecord::from_canonical.producer_revision` <- 条件O01/J04/E04/J02 Consumer/J05原typed构造链；具体wire/port/lookup/system边界见本章§16.3 | required源缺失拒绝/NotEstablished；不填placeholder | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-AUDIT-001、TC-AUDIT-002 | EV-CONTRACT-016 planned；AC-BR-028~036及037/038；actual not_evaluated |
| SafeHandoffRecord | `state` | `SafeHandoffState` | 本对象业务状态；factory固定初态；hydrate只取实际local store | `SafeHandoffRecord::from_canonical`；原rehydrate | factory原固定初态；hydrate只actual stored.state，无DTO终态输入 | 初态固定，hydrate缺失/未知state拒绝；不默认成功 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-AUDIT-001、TC-AUDIT-002 | EV-CONTRACT-016 planned；AC-BR-028~036及037/038；actual not_evaluated |
| SafeHandoffRecord | `local_revision` | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW | `SafeHandoffRecord::from_canonical`；原rehydrate | 首次固定1；后续actual UoW CAS；hydrate actual stored.local_revision | 缺actual版本拒绝；不从请求/时间生成 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-LOCAL-001、TC-AUDIT-001、TC-AUDIT-002 | EV-CONTRACT-016 planned；AC-BR-028~036及037/038；actual not_evaluated |

## 3. DTO / Event / Job 到 Domain 对象构造闭环表

以下完整原source表逐行承接03§16.3（原列含义不改），附当前具体TC/EV，均planned/not_run；不建立第二套public/Domainschema或07phase。

| 输入契约 / flow | 目标对象与完整factory | 原wire字段 / 补齐来源 | 不得混同 / 缺失处理 | 当前具体TC | plannedEV |
|---|---|---|---|---|---|
| C01 | BridgeInstallation::configure / apply_revision | draft七字段；installation ID=UoW，qualification=Missing，local初1；原config/local读与expected，current config port | shape!=Qualified，config!=local轴；MissingContract/Conflict，zerosecret/platform IO | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-BIND-001、TC-BIND-002、TC-BIND-003、TC-BIND-004 | EV-CONTRACT-002、EV-CONTRACT-001、EV-CONTRACT-020（planned） |
| C02 | ExternalBinding::propose / activate及原成员 | 原proposal两端/actions/actor/authorization Slots；ID/current安装=UoW/read；generation初1/expected checked next；正式activation port | Pending!=已Active；human/AI/Integration责任不互代；无正式两端basis不激活 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-BIND-001、TC-BIND-002、TC-BIND-003、TC-BIND-004 | EV-CONTRACT-002、EV-CONTRACT-001、EV-CONTRACT-020（planned） |
| C03 LinkIdentity/Location | ExternalIdentityMapping::link、ExternalLocationMapping::link | change完整external/actor-kind/internal/parent/basis；binding/generation=current完整row；ID/now=UoW | locator非身份/权限truth；parent Slot非默认root；current不足拒绝 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-MAP-001、TC-MAP-002、TC-MAP-003、TC-MAP-004、TC-MAP-005 | EV-CONTRACT-003、EV-CONTRACT-001、EV-CONTRACT-020（planned） |
| C03 LinkMessage / E01 known / J01 known | ExternalMessageMapping::link_known | 完整locator/source-version/change/owner/effect Slots/generation-direction/origin/basis/result；known owner/platform实际，ID/current/now=UoW/ports | owner accepted!=platform accepted，unknown不造Linked；缺formal mapping/结果不补 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-MAP-001、TC-MAP-002、TC-MAP-003、TC-MAP-004、TC-MAP-005 | EV-CONTRACT-003、EV-CONTRACT-001、EV-CONTRACT-020（planned） |
| E01 Private | InboundHandoffRecord::from_verified与原claim/result成员 | verification/source/origin=PlatformIngressPort；context actor/target/mapping/material/digest=正式owner/private资格；record/op ID/now=UoW；ACK/结果初Slot | 原raw只lease，safe source与actor责任独立；无法typed meaning/source/mapping不durable接管 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-INBOUND-001、TC-INBOUND-002、TC-INBOUND-003、TC-INBOUND-004、TC-INBOUND-005 | EV-CONTRACT-004、EV-CONTRACT-001、EV-CONTRACT-020（planned） |
| C04 / E02 | SafePresentationPlan::prepare | source/target/kind来自original body/event；mapping/allowed projection/disclosure/附件/qualified kind/capability/current=PresentationQualificationPort；ID/now=UoW | committed/source!=外显权限；Blocked/Degraded语义精确，不能伪ready/send | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-PRESENT-001、TC-PRESENT-002、TC-PRESENT-003、TC-PRESENT-004 | EV-CONTRACT-006、EV-CONTRACT-001、EV-CONTRACT-020（planned） |
| C04 / E02 | DeliveryIntent::from_plan、必要DispatchLane::for_scope | plan全current->stable source projection/effect；target/kind原意图；lane scope/dependency/rate/budget正式组合；ID/fence/local1=UoW；Absent唯一同U | C/E同effect；LaneRevision!=LocalRevision；缺scope/rate/config proof不Planned | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-DELIVERY-001、TC-DELIVERY-002、TC-DELIVERY-003、TC-DELIVERY-004、TC-DELIVERY-005 | EV-CONTRACT-008、EV-CONTRACT-001、EV-CONTRACT-020（planned） |
| J01 | DeliveryAttempt::claim_for | 原intent/effect/current/eligibility/window；claim=Lane/UoW实际fence，ID=UoW；result初Missing，nowactual | reservation/plan!=实际commit，actual B前zero dispatch；缺current/完整bounds停止 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-DELIVERY-001、TC-DELIVERY-002、TC-DELIVERY-003、TC-DELIVERY-004、TC-DELIVERY-005 | EV-CONTRACT-008、EV-CONTRACT-001、EV-CONTRACT-020（planned） |
| J01 / J02 Platform | PlatformReceipt::from_known | 原attempt/effect+actualKnownPlatformBusinessResult完整kind/locator/authority/no-effect/reason；receipt ID=UoW | HTTP2xx/ACK!=Known；NoEffect非普通Rejected推导；unknown无receipt | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-DELIVERY-001、TC-DELIVERY-002、TC-DELIVERY-003、TC-DELIVERY-004、TC-DELIVERY-005 | EV-CONTRACT-008、EV-CONTRACT-001、EV-CONTRACT-020（planned） |
| C05 | ExternalActionBinding::bind | body binding/source/target/responsibility，原已known message/intent读取；owner revision/expiry/authorization/current=formal owner；ID/now=UoW、claim初Missing | 签名不授owner action；初绑无callback/action ID前提；缺责任/known/owner proof拒绝 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-CALLBACK-001、TC-CALLBACK-002、TC-CALLBACK-003、TC-CALLBACK-004、TC-CALLBACK-005 | EV-CONTRACT-009、EV-CONTRACT-001、EV-CONTRACT-020（planned） |
| E03 | CallbackHandoffRecord::from_verified及one-use原成员 | 完整platform source+stored action/actor/owner/expiry verification=CallbackVerificationPort；原action/target/claim/current，ID/op=UoW | verified!=审批，actual claim后才owner；claim不可复活或换op | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-CALLBACK-001、TC-CALLBACK-002、TC-CALLBACK-003、TC-CALLBACK-004、TC-CALLBACK-005 | EV-CONTRACT-009、EV-CONTRACT-001、EV-CONTRACT-020（planned） |
| 所有actual C/E/J mutation / J05 target expiry | DedupRecord::reserve / 原结果/expire | qualified namespace/key/full meaning/original+正式retention；ID=UoW，result初Missing；expiry proof由ConfigQualificationPort具名取得 | targetbusiness key/op!=Job key/op；保旧window/unknown；TTL不authority、Expired不能重execute | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-KEY-001、TC-KEY-002、TC-KEY-003、TC-KEY-004、TC-KEY-005 | EV-CONTRACT-010、EV-CONTRACT-001、EV-CONTRACT-020（planned） |
| E01 Continuity / J03 C / J05 | StreamCursor::initialize / 原成员 | registered namespace-stream/stage/epoch，opaque position/comparator/coverage为原qualified notice/ports/原row，ID/初cursor1/local1=UoW | transport位置!=Owner/Delivery位置；After须full新stage proof，不能字符串比较 | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-CURSOR-001、TC-CURSOR-002、TC-CURSOR-003、TC-CURSOR-004 | EV-CONTRACT-011、EV-CONTRACT-001、EV-CONTRACT-020（planned） |
| E01 Continuity / C06 / J03 | GapRecord::detect / 原attach/coverage成员 | actual notice/cursor/原operation/range/reason；coverage/recovery/window Slots由正式当前或Missing；ID=UoW | full source gap proof!=stage advance；partial/unknown保gap、zero raw replay | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-CURSOR-001、TC-CURSOR-002、TC-CURSOR-003、TC-CURSOR-004 | EV-CONTRACT-011、EV-CONTRACT-001、EV-CONTRACT-020（planned） |
| C06 / J02 / J03 | RecoveryRecord::request / 原成员 | body原subject/original/basis + authoritative qualify_request，资格/probe初Missing、Unresolved及有限reason；ID=UoW | LocalCommit/Owner/Platform/Consumer四authority独立；缺formal只读契约blocked/manual | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-RECOVERY-001、TC-RECOVERY-002、TC-RECOVERY-003、TC-RECOVERY-004、TC-RECOVERY-005 | EV-CONTRACT-013、EV-CONTRACT-001、EV-CONTRACT-020（planned） |
| actual C/E/J各阶段 | SafeAuditRecord::from_mutation | BodyFreeMutationMaterial四字段+UoW audit/mutation/op+原trusted trace；schema正式；immutable local1 | raw/hash/敏感审批禁；无实际mutation不补audit，不变evidence | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-AUDIT-001、TC-AUDIT-002、TC-AUDIT-003、TC-AUDIT-004、TC-AUDIT-005 | EV-CONTRACT-016、EV-CONTRACT-001、EV-CONTRACT-020（planned） |
| 条件O01 / J04 / E04 / J02 Consumer / J05 Handoff | SafeHandoffRecord::from_canonical及原成员 | 原audit、actual canonical/admission/schema/retention/current，claim/consumer初Missing，consumer op/ID=技术reservation/UoW | current static map无Bridges仍blocked；正式非递归结果only不新建producer | TC-SURFACE-001、TC-SURFACE-002、TC-STATE-006、TC-AUDIT-001、TC-AUDIT-002、TC-AUDIT-003、TC-AUDIT-004、TC-AUDIT-005 | EV-CONTRACT-016、EV-CONTRACT-001、EV-CONTRACT-020（planned） |

## 4. 状态闭环表

以下完整原source表逐行承接03§16.6（原列含义不改），附当前具体TC/EV，均planned/not_run；不建立第二套public/Domainschema或07phase。

| 状态enum / 主语 | exact正式值 | 产生函数 / 原归属 | 合法迁移 | 禁止迁移 | planned测试 | 验收证据 | 当前具体TC | plannedEV |
|---|---|---|---|---|---|---|---|---|
| `BridgeInstallationState` / BridgeInstallation | `Configured` / `Qualified` / `Blocked` / `Suspended` / `Retired` | `BridgeInstallation::configure`、`BridgeInstallation::apply_revision`、`BridgeInstallation::record_qualification`、`BridgeInstallation::block`、`BridgeInstallation::suspend`、`BridgeInstallation::restart_configured`、`BridgeInstallation::retire` | M01原矩阵12对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/A/L/P/R | 正式00所属能力AC与全局037/038；TC/EV waiting | TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006 | EV-CONTRACT-020；AC-BR-034、AC-BR-038方向 |
| `ExternalBindingState` / ExternalBinding | `Pending` / `Active` / `Suspended` / `Revoked` / `Expired` | `ExternalBinding::propose`、`ExternalBinding::activate`、`ExternalBinding::suspend`、`ExternalBinding::revoke`、`ExternalBinding::expire`、`ExternalBinding::assert_current` | M02原矩阵9对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/A/C/L/R | 正式00所属能力AC与全局037/038；TC/EV waiting | TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006 | EV-CONTRACT-020；AC-BR-034、AC-BR-038方向 |
| `IdentityMappingState` / ExternalIdentityMapping | `Valid` / `Stale` / `Revoked` | `ExternalIdentityMapping::link`、`ExternalIdentityMapping::assert_applicable`、`ExternalIdentityMapping::invalidate`、`ExternalIdentityMapping::revoke` | M03原矩阵3对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/A/C/L/R | 正式00所属能力AC与全局037/038；TC/EV waiting | TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006 | EV-CONTRACT-020；AC-BR-034、AC-BR-038方向 |
| `LocationMappingState` / ExternalLocationMapping | `Valid` / `Stale` / `Revoked` | `ExternalLocationMapping::link`、`ExternalLocationMapping::resolve_target`、`ExternalLocationMapping::invalidate`、`ExternalLocationMapping::revoke` | M04原矩阵3对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/A/B/C/L/R | 正式00所属能力AC与全局037/038；TC/EV waiting | TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006 | EV-CONTRACT-020；AC-BR-034、AC-BR-038方向 |
| `MessageMappingState` / ExternalMessageMapping | `Linked` / `Stale` / `Tombstoned` | `ExternalMessageMapping::link_known`、`ExternalMessageMapping::match_change`、`ExternalMessageMapping::invalidate`、`ExternalMessageMapping::record_tombstone` | M05原矩阵3对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/A/C/B/L/P/R | 正式00所属能力AC与全局037/038；TC/EV waiting | TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006 | EV-CONTRACT-020；AC-BR-034、AC-BR-038方向 |
| `InboundHandoffState` / InboundHandoffRecord | `Verified` / `Blocked` / `Quarantined` / `HandoffPending` / `OwnerAccepted` / `OwnerRejected` / `Indeterminate` | `InboundHandoffRecord::from_verified`、`InboundHandoffRecord::qualify`、`InboundHandoffRecord::block`、`InboundHandoffRecord::quarantine`、`InboundHandoffRecord::begin_handoff`、`InboundHandoffRecord::apply_owner_result`、`InboundHandoffRecord::mark_unknown`、`InboundHandoffRecord::record_protocol_disposition` | M06原矩阵10对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/A/C/L/B/I/W/P | 正式00所属能力AC与全局037/038；TC/EV waiting | TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006 | EV-CONTRACT-020；AC-BR-034、AC-BR-038方向 |
| `PresentationState` / SafePresentationPlan | `Qualified` / `Degraded` / `Blocked` / `Stale` | `SafePresentationPlan::prepare`、`SafePresentationPlan::assert_current`、`SafePresentationPlan::invalidate`、`SafePresentationPlan::block` | M07原矩阵4对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/A/P/C/L/R | 正式00所属能力AC与全局037/038；TC/EV waiting | TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006 | EV-CONTRACT-020；AC-BR-034、AC-BR-038方向 |
| `DeliveryIntentState` / DeliveryIntent | `Planned` / `Dispatching` / `RetryWait` / `PlatformAccepted` / `KnownRejected` / `Indeterminate` / `Blocked` / `Unsupported` | `DeliveryIntent::from_plan`、`DeliveryIntent::claim`、`DeliveryIntent::apply_receipt`、`DeliveryIntent::mark_unknown`、`DeliveryIntent::schedule_retry`、`DeliveryIntent::block`、`DeliveryIntent::mark_unsupported`、`DeliveryIntent::restore_planned` | M08原矩阵14对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/C/L/B/A/P/J/R | 正式00所属能力AC与全局037/038；TC/EV waiting | TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006 | EV-CONTRACT-020；AC-BR-034、AC-BR-038方向 |
| `DeliveryAttemptState` / DeliveryAttempt | `Claimed` / `InFlight` / `KnownAccepted` / `KnownRejected` / `Indeterminate` / `NotDispatched` | `DeliveryAttempt::claim_for`、`DeliveryAttempt::begin_io`、`DeliveryAttempt::record_result`、`DeliveryAttempt::mark_unknown`、`DeliveryAttempt::record_not_dispatched` | M09原矩阵9对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/L/C/B/P/J/R | 正式00所属能力AC与全局037/038；TC/EV waiting | TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006 | EV-CONTRACT-020；AC-BR-034、AC-BR-038方向 |
| `ExternalActionState` / ExternalActionBinding | `Active` / `Claimed` / `Expired` / `Revoked` | `ExternalActionBinding::bind`、`ExternalActionBinding::claim_once`、`ExternalActionBinding::expire`、`ExternalActionBinding::revoke`、`ExternalActionBinding::assert_current` | M10原矩阵3对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/A/C/L/B/P/I/W | 正式00所属能力AC与全局037/038；TC/EV waiting | TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006 | EV-CONTRACT-020；AC-BR-034、AC-BR-038方向 |
| `CallbackHandoffState` / CallbackHandoffRecord | `Verified` / `Blocked` / `Rejected` / `OwnerPending` / `OwnerAccepted` / `OwnerRejected` / `Indeterminate` | `CallbackHandoffRecord::from_verified`、`CallbackHandoffRecord::begin_handoff`、`CallbackHandoffRecord::block`、`CallbackHandoffRecord::reject`、`CallbackHandoffRecord::apply_owner_result`、`CallbackHandoffRecord::mark_unknown`、`CallbackHandoffRecord::record_protocol_disposition` | M11原矩阵8对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/A/C/L/B/I/W/P/R | 正式00所属能力AC与全局037/038；TC/EV waiting | TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006 | EV-CONTRACT-020；AC-BR-034、AC-BR-038方向 |
| `DedupState` / DedupRecord | `Reserved` / `ResultRecorded` / `Indeterminate` / `Expired` | `DedupRecord::reserve`、`DedupRecord::match_meaning`、`DedupRecord::attach_result`、`DedupRecord::mark_unknown`、`DedupRecord::expire` | M12原矩阵6对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/C/L/R/P/J/S | 正式00所属能力AC与全局037/038；TC/EV waiting | TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006 | EV-CONTRACT-020；AC-BR-034、AC-BR-038方向 |
| `StreamCursorState` / StreamCursor | `Ready` / `Incomparable` / `Blocked` | `StreamCursor::initialize`、`StreamCursor::advance`、`StreamCursor::mark_incomparable`、`StreamCursor::lose_comparator`、`StreamCursor::block`、`StreamCursor::requalify_same_epoch` | M13原矩阵6对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/C/L/B/J/R | 正式00所属能力AC与全局037/038；TC/EV waiting | TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006 | EV-CONTRACT-020；AC-BR-034、AC-BR-038方向 |
| `GapState` / GapRecord | `Open` / `Probing` / `Closed` / `Manual` | `GapRecord::detect`、`GapRecord::begin_probe`、`GapRecord::attach_recovery`、`GapRecord::close`、`GapRecord::retain_uncovered`、`GapRecord::require_manual` | M14原矩阵6对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/C/L/B/J/R | 正式00所属能力AC与全局037/038；TC/EV waiting | TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006 | EV-CONTRACT-020；AC-BR-034、AC-BR-038方向 |
| `DispatchLaneState` / DispatchLane | `Ready` / `Held` / `Cooldown` / `Blocked` | `DispatchLane::for_scope`、`DispatchLane::claim`、`DispatchLane::apply_bounds`、`DispatchLane::release`、`DispatchLane::block`、`DispatchLane::finish_cooldown`、`DispatchLane::restore_ready` | M15原矩阵9对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/C/L/B/J/W/R | 正式00所属能力AC与全局037/038；TC/EV waiting | TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006 | EV-CONTRACT-020；AC-BR-034、AC-BR-038方向 |
| `RecoveryState` / RecoveryRecord | `Requested` / `Probing` / `Resolved` / `Blocked` / `Manual` | `RecoveryRecord::request`、`RecoveryRecord::begin_probe`、`RecoveryRecord::resolve`、`RecoveryRecord::block`、`RecoveryRecord::require_manual` | M16原矩阵8对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/C/L/A/P/J/R | 正式00所属能力AC与全局037/038；TC/EV waiting | TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006 | EV-CONTRACT-020；AC-BR-034、AC-BR-038方向 |
| `SafeHandoffState` / SafeHandoffRecord | `Pending` / `Dispatching` / `ConsumerAccepted` / `ConsumerRejected` / `Indeterminate` / `Blocked` | `SafeHandoffRecord::from_canonical`、`SafeHandoffRecord::begin_handoff`、`SafeHandoffRecord::apply_consumer_result`、`SafeHandoffRecord::mark_unknown`、`SafeHandoffRecord::block`、`SafeHandoffRecord::resume_pending` | M17原矩阵10对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/A/C/R/B/L/P/S/W/J | 正式00所属能力AC与全局037/038；TC/EV waiting | TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006 | EV-CONTRACT-020；AC-BR-034、AC-BR-038方向 |
| `RuntimeExecutionPhase` / RuntimeExecutionState | `Constructed` / `Active` / `Draining` / `StoppedLocal` / `StoppedWithUnknown` | `RuntimeExecutionState::from_parts`、`RuntimeExecutionState::begin`、`RuntimeExecutionState::begin_shutdown`、`RuntimeExecutionState::record_local_stop` | M18原矩阵4对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | A/C/L/P/I/W/J | 正式00所属能力AC与全局037/038；TC/EV waiting | TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006 | EV-CONTRACT-020；AC-BR-034、AC-BR-038方向 |
| `JobInvocationPhase` / JobInvocationState | `Pending` / `Dispatched` / `CompletedLocal` / `CancelledLocal` / `Indeterminate` | `JobInvocationState::from_parts`、`JobInvocationState::mark_dispatched`、`JobInvocationState::record_returned`、`JobInvocationState::cancel_local_wait` | M19原矩阵5对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | A/C/L/I/W/J | 正式00所属能力AC与全局037/038；TC/EV waiting | TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006 | EV-CONTRACT-020；AC-BR-034、AC-BR-038方向 |
| `SourceSessionPhase` / PlatformSourceSession | `Configured` / `Active` / `Disconnected` / `NotEstablished` / `Stopped` | `PlatformSourceSession::from_parts`、`PlatformSourceSession::record_connected`、`PlatformSourceSession::record_disconnect`、`PlatformSourceSession::record_unavailable`、`PlatformSourceSession::stop_local` | M20原矩阵10对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | B/C/I/P/W/J | 正式00所属能力AC与全局037/038；TC/EV waiting | TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006 | EV-CONTRACT-020；AC-BR-034、AC-BR-038方向 |
| `WorkerBatchPhase` / WorkerSchedulingBatch | `Collected` / `Dispatching` / `CompletedLocal` / `StoppedLocal` / `StoppedWithUnknown` | `WorkerSchedulingBatch::from_parts`、`WorkerSchedulingBatch::take_next_plan`、`WorkerSchedulingBatch::record_returned`、`WorkerSchedulingBatch::stop_local` | M21原矩阵8对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | A/C/L/I/W/J | 正式00所属能力AC与全局037/038；TC/EV waiting | TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006 | EV-CONTRACT-020；AC-BR-034、AC-BR-038方向 |

## 5. Query response / view 闭环表

以下完整原source表逐行承接03§16.4（原列含义不改），附当前具体TC/EV，均planned/not_run；不建立第二套public/Domainschema或07phase。

| Query / response字段 | 类型 | 实际来源 | empty / hidden / degraded / public ref规则 | 测试 | 当前具体TC | plannedEV |
|---|---|---|---|---|---|---|
| Q01~04 BridgeLocalView.view_subject | BridgeViewSubjectRef | actual allowed ref定位+resolver；Q allowlist三/八/五/二族 | 已允许exact查absent才NotFound；hidden finite Denied不泄存在；原18typed variant完整namespace/key | R/S | TC-READ-001、TC-READ-002、TC-READ-003、TC-READ-004、TC-SURFACE-001、TC-SURFACE-002 | EV-CONTRACT-015、EV-CONTRACT-001 |
| scope_ref | AuthorizedReadScopeRef | SafeReadQualificationPort actual同subject/source/revision/window | 不从ref字符串/snapshot/platform权限猜scope；缺scope无View | R/A/S | TC-READ-001、TC-READ-002、TC-READ-003、TC-READ-004、TC-SURFACE-001、TC-SURFACE-002 | EV-CONTRACT-015、EV-CONTRACT-001 |
| stage_slice | SafeStageSlice | 原complete committed snapshot的各stage getter+ReadDisclosureRules | Protocol/LocalCommit/Owner/Platform/Consumer/Business独立、获准slice；empty不全链success | R/C/S | TC-READ-001、TC-READ-002、TC-READ-003、TC-READ-004、TC-SURFACE-001、TC-SURFACE-002 | EV-CONTRACT-015、EV-CONTRACT-001 |
| qualified_refs | VisibleSafeRefSet | 原snapshot refs与current可见集合交集 | scope/validity/bounded unique；hidden集合不输出/不count=0；无全文rawref | R/P/S | TC-READ-001、TC-READ-002、TC-READ-003、TC-READ-004、TC-SURFACE-001、TC-SURFACE-002 | EV-CONTRACT-015、EV-CONTRACT-001 |
| freshness | ViewFreshnessKind | actual LocalRevision/原Stale/明确Degraded/Indeterminate有限事实 | 不从query时间造fresh，不以driver absence抹unknown；marker二级载荷完整 | R/C/S | TC-READ-001、TC-READ-002、TC-READ-003、TC-READ-004、TC-SURFACE-001、TC-SURFACE-002 | EV-CONTRACT-015、EV-CONTRACT-001 |
| availability | SafeViewDisposition | actual read资格/投影guard | View仅Qualified/Degraded；Denied/Unavailable外层finite，无placeholder六字段 | R/A/S | TC-READ-001、TC-READ-002、TC-READ-003、TC-READ-004、TC-SURFACE-001、TC-SURFACE-002 | EV-CONTRACT-015、EV-CONTRACT-001 |

## 6. Phase / commit boundary 闭环表

以下完整原source表逐行承接03§16.8（原列含义不改），附当前具体TC/EV，均planned/not_run；不建立第二套public/Domainschema或07phase。

| 审查边界 | 当前可包含 / 正式来源 | 明确排除 / 不依未来 | 前置 / planned测试 / 验收范围 | 当前具体TC | plannedEV |
|---|---|---|---|---|---|
| typed contract / pure对象面 | Step4/6/7/8全部当前完整carrier、factory、member、port需求、public C/E/J schema | raw product type/owner源码/private进入Contracts；不依未来report/evidence才能构造对象 | real core exports/pin closure；S/D；原AC与037/038，真实build未核 | TC-SURFACE-001、TC-SURFACE-002、TC-SURFACE-003、TC-SURFACE-004、TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006 | EV-CONTRACT-001、EV-CONTRACT-020（planned） |
| local mutation / result保存读面 | Step9/11原全expected/unique/reservation/staged set/immutable seed/audit/conditional handoff/seal | foreign IO在tx、只主行CAS、写无读面、stage当Committed、异op泛化 | 同driver actual UoW proof/正式observation；L/A/C；AC005/012/019/025/034/037/038 | TC-LOCAL-001、TC-LOCAL-002、TC-LOCAL-003、TC-LOCAL-004、TC-LOCAL-005、TC-LOCAL-006、TC-KEY-001、TC-KEY-002、TC-KEY-003、TC-KEY-004、TC-KEY-005、TC-AUDIT-001、TC-AUDIT-002、TC-AUDIT-003、TC-AUDIT-004、TC-AUDIT-005 | EV-CONTRACT-014、EV-CONTRACT-010、EV-CONTRACT-016（planned） |
| owner/platform/consumer效果面 | 原record/op/effect/claim提交后最终current、private短借和一次qualified call | 用future receipt/report来授权当前IO；new op、hidden retry、签名绕Policy | 逐installation/owner/method/config/secret/全bounds资格；A/B/P/I/W/J；各能力AC | TC-INBOUND-003、TC-INBOUND-004、TC-DELIVERY-001、TC-DELIVERY-002、TC-DELIVERY-003、TC-DELIVERY-004、TC-DELIVERY-005、TC-CALLBACK-001、TC-CALLBACK-002、TC-CALLBACK-003、TC-CALLBACK-004、TC-CALLBACK-005、TC-AUDIT-001、TC-AUDIT-003、TC-AUDIT-004、TC-ENTRY-003、TC-ENTRY-005、TC-ENTRY-007、TC-PRIVATE-001、TC-PRIVATE-002、TC-PRIVATE-003、TC-PRIVATE-004、TC-PRIVATE-005、TC-REAL-002、TC-REAL-003、TC-REAL-006 | EV-CONTRACT-004、EV-CONTRACT-008、EV-CONTRACT-009、EV-CONTRACT-016、EV-CONTRACT-019、EV-CONTRACT-018、EV-REAL-001（planned） |
| original恢复 / gap维护面 | J02/J03/J04已定义原subject/key/current/window与readonly权威结果及合法finalize | 通用replay raw/new effect、NotFound=NoEffect、GapClosed=cursor已advance | 原probe/comparator/两coverage/实际known/current；C/L/B/J；AC028~036 | TC-RECOVERY-001、TC-RECOVERY-002、TC-RECOVERY-003、TC-RECOVERY-004、TC-RECOVERY-005、TC-CURSOR-001、TC-CURSOR-002、TC-CURSOR-003、TC-CURSOR-004、TC-RATE-002、TC-RATE-003、TC-RATE-004、TC-RATE-005、TC-KEY-004、TC-KEY-005、TC-AUDIT-003、TC-AUDIT-004 | EV-CONTRACT-013、EV-CONTRACT-011、EV-CONTRACT-012、EV-CONTRACT-010、EV-CONTRACT-016（planned） |
| Query / read面 | 四Q完整root/snapshot/六view字段、resolver/current可见性与纯projector | new view ID/持久projection/rebuild from view、查询audit/probe/ID/repair；无page新surface | current read/same committed source；R/S/P；AC033~038，不依writer/report | TC-READ-001、TC-READ-002、TC-READ-003、TC-READ-004、TC-PRIVATE-004、TC-LOCAL-005、TC-SURFACE-001、TC-SURFACE-002 | EV-CONTRACT-015、EV-CONTRACT-018、EV-CONTRACT-014、EV-CONTRACT-001（planned） |
| conditional producer / result-only面 | 正式rule+canonical/admission/schema/原claim/op；NonRecursiveResultOnly | 缺map而默认audit-only、other producer冒名、result finalize递归新O01 | BR-UP-006与原十二affected/current proof；A/C/L/P/S/W/J；AC032/034~038 | TC-AUDIT-001、TC-AUDIT-002、TC-AUDIT-003、TC-AUDIT-004、TC-AUDIT-005、TC-LOCAL-003、TC-LOCAL-004、TC-PRIVATE-002、TC-PRIVATE-005、TC-REAL-003 | EV-CONTRACT-016、EV-CONTRACT-014、EV-CONTRACT-018、EV-REAL-001（planned） |
| 测试机器产物 / 报告面 | 未来05/06/07如交付writer，须完整schema/version/optional/enum/digest/canonicalization/path/红线/writer-reader及四成熟度 | 03业务Job summary不是run报告；不能预置TC/EV/run/artifact/acceptance；最小index非最终证据 | BR-DOWN-002/003/004 waiting；artifact root规范仅约束，真实测试/验收均not_evaluated | TC-EVIDENCE-001、TC-EVIDENCE-002、TC-EVIDENCE-003、TC-EVIDENCE-004、TC-EVIDENCE-005、TC-PRIVATE-005 | EV-CONTRACT-021、EV-CONTRACT-018（planned） |

## 7. Public protocol 传递类型闭环表

以下完整原source表逐行承接03§16.5（原列含义不改），附当前具体TC/EV，均planned/not_run；不建立第二套public/Domainschema或07phase。

| surface / 外层DTO | 字段与传递类型入口 | schema归属 / 缺失重复口径 | 依赖 / planned测试 | 当前具体TC | plannedEV |
|---|---|---|---|---|---|
| C01~06 BridgeCommandRequest<T>/Response | version/metadata/body；CommandMetadata -> actual core RequestMetadata/Actor/Origin/Trace/Key；body各原Request；result BridgeCommandResult->View/finite outcome | Step8 shared/command + Step6 Contracts；keyrequired、same-key完整ManagementBody/Outbound/Recovery meaning，不自动retry | Contracts->core仅；S/A/C/L/P | TC-SURFACE-001、TC-SURFACE-002、TC-SURFACE-003、TC-SURFACE-004、TC-PRIVATE-002 | EV-CONTRACT-001、EV-CONTRACT-018 |
| Q01~04 BridgeQueryRequest<T>/Response | version/metadata/body.subject；QueryMetadata实际page/consistency；result BridgeReadResult->上六字段 | Step8 shared/query、Step6 views/safe stage/ref markers；key/pageNone，无no-op audit | Contracts->core仅；S/R/P | TC-SURFACE-001、TC-SURFACE-002、TC-SURFACE-003、TC-SURFACE-004、TC-PRIVATE-002 | EV-CONTRACT-001、EV-CONTRACT-018 |
| E01~04 BridgeInboundEventEnvelope<T>/BridgeConsumerReceipt | version/envelope_ref/metadata/event_key/payload；SafeEventMetadata/原typed envelope ref；private payload非序列化 | Step8 inbound完整Private/Continuity/committed/disposition各载荷；source-keyverified，duplicate原结果，ACK单列；received_at只private call字段，不是envelope字段 | Private lease不出wire，formal source登记；S/B/I/W/P/C | TC-SURFACE-001、TC-SURFACE-002、TC-SURFACE-003、TC-SURFACE-004、TC-PRIVATE-002 | EV-CONTRACT-001、EV-CONTRACT-018 |
| O01 BridgeLocalDispositionRecordedEvent | version/metadata/source/material/admission/handoff/original/schema/retention九字段 | Step8 outbound/Step6 safe refs；正式map不兼容不发、原metadata/material/op重交 | 非新public publish/producer，零evidence；S/A/C/L/P | TC-SURFACE-001、TC-SURFACE-002、TC-SURFACE-003、TC-SURFACE-004、TC-PRIVATE-002 | EV-CONTRACT-001、EV-CONTRACT-018 |
| J01~05 BridgeJobRequest<T>/BridgeJobResponse | version/metadata/body；metadata唯一JobContinuityMetadata；J01 delivery、J02 recovery/subject、J03 gap、J04 handoff、J05 subject/expected；BridgeJobOutcome->actual原五summary | Step8 Job、Step7 Application BridgeMaintenanceSelection与Jobs JobInvocationPlan、Step6原summary/slots；trusted context/basis及runtime预算不进wire，原typed key/Job标签、unknown保原op | no report/run writer，structured本次可信invocation；J/S/A/C/L | TC-SURFACE-001、TC-SURFACE-002、TC-SURFACE-003、TC-SURFACE-004、TC-PRIVATE-002 | EV-CONTRACT-001、EV-CONTRACT-018 |
| finite错误 | BridgeProtocolError.issue/area/reason；CV/PE onlyfinite mapper | Step8 finite配对、Step12；有原可能效果保original责任，不公开raw PE载荷 | no rawcause/ref/count/privatevalue；S/I/P | TC-SURFACE-001、TC-SURFACE-002、TC-SURFACE-003、TC-SURFACE-004、TC-PRIVATE-002 | EV-CONTRACT-001、EV-CONTRACT-018 |

## 8. 命名一致性表

| 名称类别 | 正式源/本05对应 | 禁用混同 | 当前检查 |
|---|---|---|---|
| mapping | Identity/Location Valid-Stale-Revoked；Message Linked-Stale-Tombstoned | Identity Linked、任意自动GlobalMember/target | MAP/STATE字段与enum原源 |
| attempt | Claimed/InFlight/KnownAccepted/KnownRejected/Indeterminate/NotDispatched | Reservedattempt、timeout=NotDispatched/NoEffect | DELIVERY/STATE/ENTRY原guard |
| runtime/job/session/batch | 03四technical exactenum/value及具名member | StoppedKnown/统一Success/durablephase | ENTRY/STATE与原module路由 |
| Protocol | C6/Q4/E4/O1/J5 exactnames | CreateBridgeRequest/TriggerReplay/IntegrationStatus等旧API | 全20schema/正反与scope |
| Query/View | 四Get*View与BridgeLocalView六字段 | genericpage/hiddencount0/维护写入 | READ0mutable/probe/ID/audit |
| Test-harness | 本05九localDTO、owner/version1、TC/DS/suite/EVregistry | productionwire/Observabilityevidence/静态passed | planned设计，真runwriter另实施 |
| phase | Config/ACK/LocalCommit/Owner/Platform/Consumer及testEV分开 | ACK=Turn、commit=外部送达、consumeraccepted=EV | 相应TC只本阶段proof |

## 9. 冲突与修正表

| 冲突ID | 位置/类型 | 修正及范围 | 处理状态 |
|---|---|---|---|
| TEST-03-001 | script职责/I-O未定义 | 七plannedpath/type/参数/failure先同步03四处；05schema闭口 | synchronized_design，无实施 |
| 05-R-001 | cut共享思考/独立记录不足 | 当前Step15逐22cut重审补独立书面微循环，不伪造前序已完成时间线 | reviewed_before_formal_assembly |
| 05-R-002 | primarysuite与原crate归属错配 | Step9修40TCdefault、SURFACE/STATE/host路由、TOOLS双runner/results | repaired_design_no_new_target |
| 05-R-003 | SURFACE缺AC/STATE源向未同步 | Step13补原AC数据/guard方向和BR004/017/019 STATE，不新增需求 | repaired_design，22EV/38AC方向齐 |
| 05-R-004 | table空行/pipe、suite输出名 | staticcheck真实捕获后修、report.json/stdout-stderr.log安全tokens同步 | repaired_format_and_plan |
| 05-R-005 | Phase七行共用TC/EV关联、附录编号缩写 | Step15终审按纯对象/local/effect/recovery/Query/producer/harness逐行关联原具体TC/EV并展开编号；保留03原列 | repaired_design_test_mapping_only |
| HISTORY-05 | 旧05/06/README对象/技术/恢复/凭证/证据 | 不采纳，旧README/06原hash保护；旧05重建，历史不正式输入 | historical_only |
| Runtime blockers | BR-UP/WS/affected/产品/资格/policy | 只能原owner+实际安全材料释放，不localtest关闭 | open/inherited，不伪ready |

## 10. 正反例

| 正确当前设计 | 必须拒绝 |
|---|---|
| originalmutation同driver权威Committed/RolledBack/Indeterminate，unknown只readonlyprobe | timeout/NotFound→rollback、freshapply/send/新key抹unknown |
| callbacksource签名+actor/target/action/ownercurrent/oneuse全部合法，actualclaim后owner | 签名/admin/low敏感默认审批、按钮context替Policy、Claimed复活 |
| 真实case/suite/context/digest构成EV、status与expectedinstances一致，handoffdraft人审 | 静态plan造passed、缺case补fakeEV、shell当final、localpass当actualreadiness |
| 合成privatecanary只内存；typedallowlist/token-onlysafeoutputs先验 | raw先写log再redact、body/secret/私有callback/审批hash或URL作为证据 |
| 191field/20schema/150pair继承原03，测试只映具体TC/EV | 新setter/字段别名/GenericSuccess/newownertruth或07boundary猜测 |
