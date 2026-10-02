# Step 7：接口、事件与跨仓同步验收

## 1. Step 状态

SOP Step7/规范5.7；正式§7；completed/selfcheck_done/stop_review；gate_status=pass（设计）；gate_reason=49入口/4shared/依赖资格独立停审及跨审计完成；next_allowed_action=Step8状态事务。

### 1.1 Step 内计划

| 项 | 状态 | 产物 |
|---|---|---|
| 读取前序/输入 | done | §2 |
| SOP问题 | done | §3十二问 |
| 诊断 | done | §4 |
| 取舍 | done | §6 |
| 结构化/逐入口停审 | done | §7及49入口附录 |
| 复杂度/附录 | done | 拆接口item reviews，字段不复制第二schema |
| 草稿 | done | §8 |
| 跨接口审计 | done | §10 |

## 2. 本步输入

source_files：[Step6](06_acceptance_step_06_boundary_gate.md)八GT/AC/边界及资格缺口；03§6.2/6.3/7/8、Step7typed ports、Step8shared surface与七U协议/Step9flow；[05字段索引](05_test_plan_step_06_contract_index.md)/Step6、04八slot。所有字段/route/result叶子以03规范性schema为准。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| Command/Query怎么验？ | 21C完整Request/Result/错误/meta/原重放与Tx；16Q current ReadSurface/七paged/零写，37HTTPexactroute。 |
| Event怎么证消费重放？ | 当前0active inbound/outbound/topic/outbox，验禁止依赖/route，不发明事件TC。 |
| Job怎么证？ | 12内部nativeRust入口，原work/plan/fence/key、A/B/probe/fullreport/继任责任，全部required子例。 |
| 同步成功？ | exact owner formal typed outcome与intent/version/consumer/scope绑定，仅证明该接缝；ACK非commit/approval。 |
| 下游未就绪？ | 本地parity/blocked负例可验，selected真实positive阻断，不要求下游全仓实现。 |
| 依赖类型？ | Core/SDKcompile；九owner/receiver/notice/Obs runtime+ref+adapter；event当前0。 |
| 证据怎么选？ | contract compile/manifest→CROSS-011/014/020；运行→specific业务TC；Event只zero-lane检查。 |
| 正式字段状态？ | Request全字段沿05index/03；返回逐叶比对，不从HTTP或文案推state。 |
| 固定surface/path？ | C/Q固定POST，J worker-internal；49附录逐行route/surface/TC/EV，report由Step5§7展开。 |
| 未就绪裁决？ | scope内required资格缺失不通过候选，不risk accept；local通过不承诺formal ready。 |
| 每项停审？ | 49行各风险/取舍、设计、条件、TC/EV/route/AC/裁决、design-stop；分U落盘。 |
| 跨接口冲突？ | 集合必须21/16/12、37HTTP/12internal；17/146同签名/Tx，no public Job/no新增topic。 |

## 4. 当前文档问题诊断

旧06PublishRelease/RecordInstall等非当前入口，无正式route/schema。API返回200可是Degraded或局部Accepted，不能作为批准/获取成功；generic SDKcall存在不提供exact consumer资格。

## 5. 改动前后对比

| 前 | 后 | 原因 |
|---|---|---|
| 用功能总表替接口 | 49独立surface门禁 | 各入口的字段/错误/副作用有不同边界 |
| 缺下游靠fake | local与formal required资格分开 | fake不自证外部结果 |
| event/topic沿用邻仓 | 0active Event、显式禁止lane | 当前依赖闭包无Bus源码 |

## 6. 设计取舍

采用逐入口门禁GT-MP-I01～I49，回指业务AC与G01/G02；shared codec/port/HTTP检查是每项共同必选证据。未采用抄49schema进06：复制会形成第二truth；只固定surface/字段来源及必须完整比对的范围。U1资格→U2freeze/Gov→U3目录→U4分发→U5通知→U6恢复/Obs→U7projection顺序小循环。

## 7. 结构化中间产物

49项完整[独立附录](06_acceptance_step_07_entry_reviews.md)已按U1-U3/U4-U7分批，逐行design-stop/pass。共同门禁：

- GT-MP-I50：17ports/146methods conformance与49flow调用序、fault/完整returned result，TC-CROSS-014→EV-UNIT-004。
- GT-MP-I51：49Request/result/report/view及可达nested字段codec/required/unknown/kind/tag，TC-CROSS-011→EV-UNIT-003。
- GT-MP-I52：37HTTP route/error/ReadSurface/安全replayheader及12Job无publicroute，TC-CROSS-018→EV-API-003。
- GT-MP-I53：0Event/topic/outbox/财务/Archive writer及Core/SDKcompile-only，TC-CROSS-020→EV-UNIT-005。

上述先检查Inventory/authority再结果路径，失败P0阻断或相应VETO；固定report依Step5§7完整EV展开。17trait实际签名来源03，不能给fake添加private便利口；shared检查不替代49行业务主TC。

### 7.1 Shared逐项停审

| GT / canonical AC | 正式检查范围与通过/失败条件 | 独立审查 |
|---|---|---|
| I50 / AC-MP-G01/G02 | UnitOfWork8、Clock1、ID23、MarketStore48、OperationStore11、Audit5、Work10、Snapshot4、Projection9、Scope1、Source3、Publisher6、Material1、Gov4、Receiver4、Notice5、Observation3=17/146；所有签名/Tx/failure匹配03，无隐藏方法/隐式commit | adopted公开trait conformance而非privatefake；TC-CROSS-014/EV-UNIT-004，design-stop/pass |
| I51 / AC-MP-G01/G04 | 全49Request/result/report/view及nested codec逐required/unknown/kind/tag，返回逐叶完整；缺字段/影子authority即阻断 | adopted全库存而非代表类型；TC-CROSS-011/EV-UNIT-003，design-stop/pass |
| I52 / AC-MP-G01/G02 | 37HTTP固定route、18ErrorCode exact映射、Query200Degraded、hidden无replayheader/operationref、12Job无publicroute | adoptedtyped映射而非HTTP200成功；TC-CROSS-018/EV-API-003，design-stop/pass |
| I53 / AC-MP-G01 | Core/SDKcompile-only；0activeEvent/topic/outbox/财务/Archivewriter；无owner服务源码依赖 | adoptedzero-lane负例，不造Bus事件；TC-CROSS-020/EV-UNIT-005，design-stop/pass |

编号I50～53在本文省略固定`GT-MP-`前缀；machine EV只填canonical AC/VETO，不填GT。

### 7.2 八owner slot与依赖分类裁决

各runtime slot只有正式qualified binding才Bound；BindingDisposition只有Bound/Blocked/Disabled，Unavailable是runtime错误分类而非第四adapter姿态，也不是系统通过。配置不自证资格，localfake只test。表中formalpositive要求是未来送验前置，不声明当前满足；report统一Step5§7。

| slot/依赖类型 | 正式接缝/required绑定 | 本地TC→EV与失败影响 |
|---|---|---|
| Core/SDK / compile+runtime | actual exportedcontracts/client、version/consumer operation支持 | TC-CROSS-011→EV-UNIT-003；TC-CROSS-014→EV-UNIT-004；TC-CROSS-020→EV-UNIT-005；编译/映射缺失P0 |
| Source / runtime-ref-adapter | Method/Role/ProcessTemplate、Capability、Image exactowner type/ref/version/digest/visibility/eligibility | TC-SOURCE-003/004→EV-DOMAIN-003/004；MP-UP-001缺口阻selected |
| Publisher / runtime-ref-adapter | human/org/principal/scope正式authority，不由Identity AI替代 | TC-SOURCE-001/005→EV-DOMAIN-001/005；MP-UP-003 required缺失阻selected |
| Material / runtime-ref-adapter | Artifact/安全材料kind/current适用/immutable摘要，非扫描批准 | TC-SOURCE-003/004→EV-DOMAIN-003/004；MP-UP-004缺口阻selected |
| Governance / runtime-ref-adapter | application/basis/material/source/version/scope/currentformaldecision/原intentprobe | TC-REVIEW-007/008→EV-DOMAIN-013/014；MP-UP-002/SRC010阻selected |
| Scope / runtime-ref-adapter | current actor/delegate/requestedScope/typedtarget披露正式解析 | TC-CROSS-007→EV-API-002；TC-CROSS-017→EV-PG-021；缺authority不得公开 |
| Receiver / runtime-ref-adapter | 原intent/exactversion/consumer/receiver/scope/OutcomeBinding、notcommit/Unknownprobe | TC-DISTRIBUTION-005/008/010→EV-WORKER-005/008/010；MP-UP-005缺失阻selected |
| Notice / runtime-ref-adapter | formal disposition/target/channel/scope/receipt/probe，Confirmed非delivered/read | TC-WITHDRAWAL-007/008/009→EV-DOMAIN-023/024/025；MP-UP-007缺失阻selected |
| Observation / runtime-ref-adapter | 原operation/frozenauditset、safeproducer/redaction/admission/receipt/probe | TC-RECOVERY-008/009→EV-RECOVERY-008/009；MP-UP-008/Obsaffected阻selected |
| Identity / conditional AI-ref | 只AI member/actorref，不拥有human登录/组织资质 | TC-SOURCE-005→EV-DOMAIN-005，不凭Identityformaldoc关闭Publisher资格 |
| Archive / future，Event / none | 当前无market source/restore writer、0inbound/outbound；其他owner事件不激活本仓 | TC-CROSS-020→EV-UNIT-005，新增先00/01授权 |

SDKadapter由infra按03正式端口映射，缺exactexternaloperation/schema时不在adapter写字符串RPC/影子DTO；回owner/03受控闭口。所有runtime positive必须actual selected证据，表中local typedfakeEV不是其替代。各slot的currentgate/immutable/unknown负例已随对应I行独立审查，台账缺口不关闭。

### 7.3 跨接口审计

49名称/类别/route或internal与03§6.3集合一致；17/146、八slot、37HTTP/18ErrorCode来源明确。compile/runtime/event分类无误要求源码直接依赖。所有行有AC、具体TC/EV/path、字段与flow来源及失败影响；sameTC多入口参数化须展开而非重复计数。无publicjob/newtopic/NoticeAttempt/安装付款真相；fake不越formalscope，shared证据不替业务。完整表可机器按名称检索，actual编译/运行未执行。

## 8. 回填草稿

正式§7候选给C/Q/J/Event传输共同规则、49规范性独立入口表、I50～53shared与依赖分类/八slot，所有门禁绑定正式route/字段/flow/TC/EV/path。下游未就绪只验local边界且formalrequired阻断，0Event不造topic。

## 9. 待确认事项

MP-UP-001/002/003/004/005/007/008等exact契约仍开放；SDK/gov来源状态冲突与Hubreasonanchor/Obsaffected只按实际受影响接缝挂起。无真实跨仓run，不关闭owner全仓或宣称ready。

## 10. 进入下一步条件

设计自检完成49入口独立停审、四shared、八slot与依赖分类/跨接口审计；17/146库存待最终静态精确复核，运行not-run。下一读SOP Step8/规范5.8、03全14矩阵及frame/CAS/canonical/PageReadContext/恢复/副作用；无commit。
