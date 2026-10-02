# 02 Step 12：详细设计承接清单

## 1. Step状态

开工：用户已确认01并授权全部02；Step 12 completed，formal未装配。仅当前agent。

Step内计划：P1读取输入 → P2逐题回答 → P3诊断 → P4前后比较 → P5取舍 → P6结构化 → P7回填草稿 → P8自检/停审。P1～P8已分批完成。

模块门禁：本Step独立收束后才允许下一Step。

## 2. 本步输入

当前正式00§9～16、01§6～17；本Step对应SOP与书写规范。前一Step的问题回答/诊断/取舍/待确认事项：02_hld_step_11_config_impacts.md。旧02未作为推导依据。

## 3. SOP问题回答

1. 哪些代码主体框架已经由概要设计收稳，详细设计不能重新发明？

答：七U/七Service、三Entry、内側ports与外側SDK/PGadapter责任、Rust/Vue方向不可由03重新发明。

2. 哪些对象、接口、处理流和状态机已经成为详细设计输入？

答：43独立对象、21command/16query/12job、49独立flow、14carrier全矩阵、qualifiedread/重建与完整原result都已收稳为localstructure。

3. 详细设计应继续展开哪些字段、协议、函数、事务、异常和测试内容？

答：03逐module/object/DTO→factory/typedport/flow/state/error/result/replay、UoW/concurrency/config/test建立可调用闭环；05suite/06EV与07dependencyclosure后续承接。

4. 如果详细设计发现主语需要变更，应回退到哪里修正？

答：发现新业务owner/capability/state/类型更名回02对应Step并向00/01追溯；正式ownercontract改变需受控重开受影响Step，不实施侧补义。

5. 哪些配置影响需要交给详细设计收口为实现契约？

答：RuntimeConfig loader/validator/builder/adapter/jobtyped注入、缺配置失败与不可配置guard交03；04keys/defaults/来源/override另设计。

6. 哪些未闭环内容不能写入承接清单，而应进入风险与待确认事项？

答：owner未qualifiedexport/SDKsupport、publisherauth/Govbinding/materialreceiver/notice/Obs/Billing/Archive/MK2与Q-MP01不能写作稳定positive实现能力，分流§13保持blocked。

## 4. 当前文档问题诊断

Step6的概要骨架不是完整schema；Step7typed方法名称不证明SDK直接可调用；Step8job内部正式surface不能在07后置contract/result。03若只补服务名称会留下publictransitivetype/sidecar/result/plan来源缺口。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 03承接 | 留后续细化笼统 | DTO/domain/port/flow/state/事务/result/config/test具名闭环任务 | 实现者不补义 |
| 外部缺口 | 可能当下一阶段既有能力 | 独立blocked清单/重开规则 | 不抹上游qualification |
| 验证 | 架构CUT | 最小入口与fake证明上限 | 不造suite/run |

## 6. 设计取舍

采用稳定localstructure vs conditionalexternalqualification两张清单；不让实现者补ownertruth或runtime不支持的payload。CUT1～7只为未来最小验证入口，不伪造suite/run/evidence。

## 7. 结构化中间产物

| 已由概要设计收稳 | 详细设计继续展开 |
|---|---|
| 七U/Service、三Entry与向内依赖，Web只发意图/展示 | 文件/module/crate组织、typed facade与runtime builder，不重定义市场owner |
| Rust API/Worker+Vue/TS Web、PG本地承载 | HTTP/driver/ORM/testframework及检索FTS/trigram/中文策略具体选型，锁定正式理由/版本/兼容条件；不以demo证明性能 |
| 43对象独立轮廓与immutable/mutable分类 | 全struct/enum/valueobject/DTO二级传递类型、codec/nullable/校验/factory/rehydrate/字段来源表；pure refs不解析隐式ID |
| Draft持久安全候选、Submitted固定basis/review | DraftPublicationSpec所有安全字段与revise/save/get、submit DTO→PublicationBasis/ReviewHandoff，conditionrefs缺失错误 |
| SourceBinding/MaterialReference与正式决定/receiver/notice/Obs binding | 本地需求schema、owner类型映射/adapter qualification、参数来源/fieldbinding；formal缺口不能本地编造 |
| 每mutablecarrier revision与typed副记录读取 | typed save/get/byuniquekey、Versioned载体、expected_version来源、ID/clock/cursor、sameUoWfake/durable；repo只保存已转换domain |
| operation/scope/key/canonicalintent唯一、完整原结果 | 指纹规范输入/算法版本、OperationContext channel/metadata authority、reserve/complete/conflict/busy、full Command/Job resultvariants、typedstore/load、missing/wrongkind/error/replayoverlay规则 |
| accepted+audit+原result+必要durable责任原子 | 每flow副作用inventory、UoW/提交顺序/失败原子/数据库隔离与versionserialization、跨command/job共同提交runner |
| originalintent与externalcommitunknown分轴 | claim/dispatchfence/lease/permission记录、crashinspection、latebinding、probe/known-not-committed/无probe人工依据、retry新attempt不新intent |
| withdraw与新获取/派发许可同版本边界 | precise race/locking/CAS，withdrawcommit之后admission拒绝；已许可外发范围与lateimpactdelta同结果事务，禁止跨owner瞬时取消承诺 |
| 49独立flow、14carrier状态矩阵 | 全函数/typed参数/返回/错误/conditionrefs、非法pair、factoryinitial/terminal、queryreadsurface与publicdisposition映射一致 |
| scope安全Query/freshness结果 | 正式scope/disclosure resolver、当前visibility交集、数量/提示/历史同裁剪、隐藏与缺失安全映射、不触发refresh/write |
| typedqualifiedsnapshot本体+state读取 | finite source/publisher/material/decision/receiver/notice/observation切片、typed readkeys/version、refreshfailurestate+optionaltypedmaterial/sidecars/报告refs；不fakeprivate补齐 |
| projection identity kind/scope/typed view keys+fixedcursor | Catalog/Progress/Impact/Audit typedview每字段rebuildsource、非空typedplan/output、sourcecursor/CAS/shadowatomicreplace、missingplan与partial错误 |
| KnownScopeComplete只本地已知cursor集合 | stable分页/去重/late增量/unknown保守coverage；每impact/notice目标正式依据，不造全安装用户集 |
| 内部Job formal请求/完整逐itemreport/replay | MarketWorkerContext合法wrapper/单metadataauthority、idempotentjobresultstore/get与error；publicjobschema如果后续暴露须与该job同boundary，不07后置 |
| 配置只影响entry/adapter/runner，Domain间接typed注入 | RuntimeConfig/loader/validator/error与builder调用契约、adapter/job规则注入；04再实际keys/defaults/override/secretref，无guard开关 |
| append-only安全audit，Observation准入独立 | safeactor/subject/basis/reason/trace/cursor append/read/error；runtime observability不等businessaudit/evidence |
| 默认英文、中英文展示状态/ref一致 | Vue/TS页面/组件、APItypedclient、loading/empty/rejected/unknown/stale/degraded、不可用控件与无scope安全面；locale不改业务enum/ref/key |
| 正式协议无代码/资产结果事实 | 03/05/06/07保持fakevsintegration与证据owner分层；不建立不存在的实现仓/commit/run/digest/verdict/signoff |

### 未来最小测试切口

| 切口 | 最小验证入口与边界 | 未来验证重点 | 证据上限 |
|---|---|---|---|
| CUT-MP-1 | U1 SourceGatePolicy + typed owner/publisher/material fakeport | wrongtype/ref/version/digest/scope、missingauthority、rawbody拒绝、Released资格失效 | 只local语义，不真实publisher/资产/scan |
| CUT-MP-2 | U2固定basis与Gov adapter fakeboundary | Submitted拒改、错binding/waived/revoked/ACK、unknownprobe/无probe | 无formal合同不证明审批集成 |
| CUT-MP-3 | U3目录/versionquery+scope/projection fake与PG后续合同 | count/suggest/history统一可见、exact selection、stale拒新获取、中文分页profile | fake不证明真实权限/生产延迟 |
| CUT-MP-4 | U4 applicationflow+localUoW+receiverfake | samedigest完整重放/异intentconflict、withdrawrace、cancel/late/unknown、fence | 不installed/paid/receiverrealcommit |
| CUT-MP-5 | U5 versiondisposition+knownimpact/noticefake | 边界停新发、lateincrement/cursorpartial、ACK/failed/unknown独立 | 不全安装覆盖/实际送达/卸载 |
| CUT-MP-6 | U6 OperationStore/result/audit/work/typedrecovery | 任一写失败无accepted、missingresult/错kind、crashpermissionprobe、原report逐item | localaudit非Obs/Archive/evidence |
| CUT-MP-7 | U7 typed snapshot/rebuildplan/readonlyfacade | 缺snapshot本体/空plan/opaque引用不推typedcontext、scope/cursor/shadow、refreshfailure | 仅派生安全，不业务truth/ready |

### 需求编号承接索引

本表只导航当前00已存在的编号到本概要稳定主体/未来测试切口，不复制需求或声称验收通过。IF/DEP仍是能力/依赖面，非已支持API。

| 来源能力 | 当前00编号 | 概要承接 | 后续切口 |
|---|---|---|---|
| C1 | AC-MP-101、AC-MP-102、AC-MP-103、BR-MP-101、BR-MP-102、BR-MP-103、BR-MP-104、DEP-MP-101、DEP-MP-102、FR-MP-101、FR-MP-102、FR-MP-103、IF-MP-101、IF-MP-102、NFR-MP-101、NFR-MP-102、NFR-MP-103 | U1，Bind/Release/Verify与qualificationquery | CUT-MP-1 |
| C2 | AC-MP-201、AC-MP-202、AC-MP-203、BR-MP-201、BR-MP-202、BR-MP-203、BR-MP-204、DEP-MP-201、DEP-MP-202、FR-MP-201、FR-MP-202、FR-MP-203、IF-MP-201、IF-MP-202、NFR-MP-201、NFR-MP-202 | U2申请/Govhandoff与U3ListMarketVersion | CUT-MP-2/3 |
| C3 | AC-MP-301、AC-MP-302、AC-MP-303、BR-MP-301、BR-MP-302、BR-MP-303、BR-MP-304、DEP-MP-301、DEP-MP-302、FR-MP-301、FR-MP-302、FR-MP-303、IF-MP-301、IF-MP-302、IF-MP-303、NFR-MP-301、NFR-MP-302、NFR-MP-303 | U3目录/版本与U7readprojection | CUT-MP-3/7 |
| C4 | AC-MP-401、AC-MP-402、AC-MP-403、BR-MP-401、BR-MP-402、BR-MP-403、BR-MP-404、DEP-MP-401、DEP-MP-402、FR-MP-401、FR-MP-402、FR-MP-403、IF-MP-401、IF-MP-402、IF-MP-403、NFR-MP-401、NFR-MP-402 | U4受理/receiver结果与U5lateimpact | CUT-MP-4/5 |
| C5 | AC-MP-501、AC-MP-502、AC-MP-503、AC-MP-504、BR-MP-501、BR-MP-502、BR-MP-503、BR-MP-504、BR-MP-505、DEP-MP-501、DEP-MP-502、DEP-MP-503、FR-MP-501、FR-MP-502、FR-MP-503、FR-MP-504、IF-MP-501、IF-MP-502、IF-MP-503、IF-MP-504、NFR-MP-501、NFR-MP-502、NFR-MP-503 | U5处置/影响/notice、U6audit/recovery、U7维护 | CUT-MP-5/6/7 |
| 全入口/横切 | AC-MP-G01、AC-MP-G02、AC-MP-G03、AC-MP-G04、NFR-MP-G01、NFR-MP-G02、NFR-MP-G03、NFR-MP-G04 | U1～7，三Entry与共同authority/UoW/replay/locale | CUT-MP-1～7 |
| 红线 | VETO-MP-1～5 | VETO1→U1/U6/U7正文/资质排除；VETO2→U2/U3formalapproval；VETO3→U3/U4/U7scope与撤回；VETO4→U4无安装/财务；VETO5→U4/U5/U6停新发/unknown/历史 | CUT-MP-1～7及未来06一票否决 |

### 合同资格另行挂起

MP-UP-001～005/007/008、MP-SRC-010影响positive source/approval/publisher/material/receiver/notice/Obs及SDK mapping；不得按上表“继续展开”解释为对端已支持。MP-UP-006无Billing写面，Archive无market export/restore，MP-SRC-013无包/29110逐类型资格；MP-SRC-003没有draft替代技术授权；Q-MP-01没有生产数值。具体受影响入口与重开条件见§13。

复杂度：稳定localstructure、contractqualification、futuretest三类分开；03若新增/改变capability、object、state、port或owner关系，先回对应02Step校准并受控回写，再继续实现设计。当前不是implementation handoff ready。

## 8. 回填草稿

正式§12仅摘录本文件§7及已pass部分附录，不带问题/诊断/历史审计；不新增结论。

## 9. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01沿01保留，仅受影响正向lane blocked；不是owner已确认或已发送请求。

## 10. 进入下一步条件

P1～P8均完成；内部stop_review/pass。稳定结构与挂起资格分离，无新增API/object/state；七CUT对应FR/VETO与未来ownerboundary。 外部资格不关闭，允许进入Step 13。
