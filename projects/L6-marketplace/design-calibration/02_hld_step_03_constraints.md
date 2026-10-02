# 02 Step 3：约束条件

## 1. Step状态

开工：用户已确认01并授权全部02；Step 3 completed，formal未装配。仅当前agent。

Step内计划：P1读取输入 → P2逐题回答 → P3诊断 → P4前后比较 → P5取舍 → P6结构化 → P7回填草稿 → P8自检/停审。P1～P8已分批完成。

模块门禁：本Step独立收束后才允许下一Step。

## 2. 本步输入

当前正式00§9～16、01§6～17；本Step对应SOP与书写规范。前一Step的问题回答/诊断/取舍/待确认事项：02_hld_step_02_scope.md。旧02未作为推导依据。

## 3. SOP问题回答

1. 哪些约束会直接影响本仓对象、接口、处理流或状态机设计？

答：归属、immutable basis、正式批准binding、scope intersection、exact版本、局部原子幂等、withdrawal序列化、unknown与body-free决定所有对象/flow。

2. 哪些约束来自需求文档，哪些约束来自架构设计或全局设计？

答：需求BR101～505和VETO1～5给出业务红线；01ADR001～008给出承载/事务/投影/接缝；全局Rust/Vue与SDK只向下给出依赖。

3. 哪些边界如果不先写清，后续最容易串到相邻仓或详细设计？

答：human publisher不是Identity；LocalReview不是approval；market version不是owner版本；attempt不是externalcommit；投影不是authority；配置不是正式授权。

4. 哪些约束只是泛化工程原则，不应进入本章？

答：泛化SOLID/高可用口号与无依据P95数字不列入；HTTP/ORM/索引库只是03技术选择。

5. 每条约束是否能指导后续章节的设计判断？

答：逐约束绑定§4～12和CUT1～7，违例有明确reject/blocked/unknown/degraded及重开来源，不以空泛原则代替判断。

## 4. 当前文档问题诊断

00§10跨能力红线需要转成具体对象/flow门禁；01§9撤回与获取强一致约束若只写最终一致会破坏停新发。01§13强调系统actor/恢复同gate，后台配置不能豁免。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 红线 | 00规则/01机制 | HC-MP-01～17绑定章节与CUT | 可判别后续设计违例 |
| 一致性 | 局部强一致与外部最终一致 | 撤回/受理同序列化、unknown独立 | 不把所有动作归最终一致 |

## 6. 设计取舍

采用约束驱动的对象/接口与失败边界；拒绝扫描齐备自动上架、索引作为资格、unknown新intent重发与跨owner事务。

## 7. 结构化中间产物

| 约束 | 说明 |
|---|---|
| HC-MP-01 唯一truth | U1～6只市场局部过程/目录/分发/处置；U7只ref/snapshot/projection。01§9；约束§5/6/8，CUT1/6/7 |
| HC-MP-02 不可变引用 | owner正式type/ref/version/digest/visibility/资格，不复制正文重算资产digest；00BR101/104，§6/7/8，CUT1 |
| HC-MP-03 publisher非Identity | 验证主体/组织/授权authority独立，AI GlobalMember不替代human；00BR102，§6/7，CUT1 |
| HC-MP-04 审核唯一 | matched有效Gov approved+申请/来源版本/材料/scope；ACK/扫描/签名/waived/fresh摘要不算；BR201/204，§6～9，CUT2 |
| HC-MP-05 基线固定 | Submitted后输入不改；修订新basis/申请语境，旧决定不可套新版本；BR202，§6～9，CUT2 |
| HC-MP-06 scope读取交集 | resolver-first，全部列表/count/suggest/详情/版本/历史同规则，opaque ref不解析；BR301/302，§7/8，CUT3/7 |
| HC-MP-07 exact获取 | 市场版本固定owner版本，无latest fallback；新受理/派发前当前资格；BR303/401，§6～9，CUT3/4 |
| HC-MP-08 原子受理 | 局部变化+audit+原完整结果+必要耐久责任同UoW；相同operation/scope/key/intent重放，异intent conflict；01ADR005，§7～10，CUT6 |
| HC-MP-09 撤回序列化 | 受理/派发许可/撤回同版本边界；撤回后不接受新获取，未派发再查；既有externalunknown独立收敛；01ADR006，§8/9，CUT4/5 |
| HC-MP-10 unknown-first | intent-before-effect，外部commit未知原意图probe，不盲retry/newintent；无probe保留人工正式依据；BR403/505，§8～10，CUT4/6 |
| HC-MP-11 结果分轴 | accepted/ACK/confirmed只局部分发映射，不installed/paid；通知attempt非delivered，audit非Obs准入；BR402/503/504，§6～9，CUT4/5/6 |
| HC-MP-12 已知影响 | late relation增量纳入，unknown保守候选；不全安装扫描/卸载；BR502，§8/9，CUT5 |
| HC-MP-13 正式接缝 | Core/SDK compile、owner runtime viaSDK，无私有L1 gRPC/owner源码；Images0outbound；canonical合同未闭合无producer/outbox，§4/7 |
| HC-MP-14 维护不反写 | query no-write；rebuild从committed localfacts+qualified snapshot，恢复不修owner/不删历史/不复活withdrawn，§8～12，CUT7 |
| HC-MP-15 无财务/包扩权 | Billing/Archive/MK2包authority未闭合，无transaction writer/export/restore/合规结果；§5/7/13 |
| HC-MP-16 配置证据上限 | 不配置approved/verified/visibility bypass；文档/fake/原型不证明真实来源或readiness；§11～13 |
| HC-MP-17 当前技术 | Rust API/Worker+Vue/TS Web；PostgreSQL局部承载；HTTP/ORM/FTS/trigram具体库03审查，Q-MP-01无数值默认；§4/11/12 |

复杂度：本Step仅约束矩阵；具体状态/函数后移对应Step，禁止在此补外部schema。

## 8. 回填草稿

正式§3仅摘录本文件§7及已pass部分附录，不带问题/诊断/历史审计；不新增结论。

## 9. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01沿01保留，仅受影响正向lane blocked；不是owner已确认或已发送请求。

## 10. 进入下一步条件

P1～P8均完成；内部stop_review/pass。每条约束有来源与后续位置；未塞入配置值/库实现/外部authority。 外部资格不关闭，允许进入Step 4。
