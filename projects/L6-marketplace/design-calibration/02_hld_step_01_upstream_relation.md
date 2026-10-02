# 02 Step 1：与上游文档的关系声明

## 1. Step状态

开工：用户已确认01并授权全部02；Step 1 completed，formal未装配。仅当前agent。

Step内计划：P1读取输入 → P2逐题回答 → P3诊断 → P4前后比较 → P5取舍 → P6结构化 → P7回填草稿 → P8自检/停审。P1～P8已分批完成。

模块门禁：本Step独立收束后才允许下一Step。

## 2. 本步输入

当前正式00§9～16、01§6～17；本Step对应SOP与书写规范。九owner当前正式02相关约束/组成/接口、必要台账及共享metadata来源；读取覆盖见后续结构化清单。旧02未作为推导依据。

## 3. SOP问题回答

1. 当前概要设计要承接哪些需求结论？

答：承接00§9的16FR、§10的21BR、§11四类数据、§12十四能力接口/十一依赖、§13十七NFR、§14二十AC与五VETO；C1～5完整闭环，不把需求IF误作现成协议。

2. 当前概要设计要承接哪些架构结论？

答：承接01§6七语义单元、§7Web/API/Worker、§8Core/SDK编译与owner运行期、§9局部原子及外部最终一致、§11Rust/Vue与PostgreSQL方向、§17八ADR。

3. 这些结论里，哪些已经足够稳定，可以直接作为概要设计输入？

答：市场truth范围、exact owner引用、固定基线、正式批准唯一、查询不写、撤回序列化、unknown核对、原完整结果重放已收稳。当前00/01均经用户确认。

4. 哪些结论虽然相关，但仍未收稳，因此当前不能直接往下展开？

答：owner exact导出/SDK支持、Gov批准binding、human publisher/授权、签名扫描authority、receiver/probe、notice/audit准入仍挂起；不定义外部DTO假装闭合。

5. 哪些边界、非目标和约束会直接决定概要设计当前不该展开到哪里？

答：不复制正文/Identity/Gov/Registry/Artifact truth；不建Billing/安装/全用户扫描/Archive active lane；02只对象字段和函数骨架，不写DDL/完整schema/框架实现。

## 4. 当前文档问题诊断

00§12明确IF不是现成API，01§8运行依赖不能直接成为Rust path dependency；01§15正向缺口不能被形式上的模块完整性抹平。九owner formal与flow状态有差异，Gov沿MP-SRC-010，SDK旧开头与当前formal并存不据此认证支持。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| IF与支持 | 00只有需求能力面、01有接缝责任 | 精确区分正式名称线索与consumer资格 | 防止设计名称冒充API支持 |
| owner状态 | formal/flow/ledger不同状态 | 路径级保留冲突与blocked | 不修改上游或假关闭 |
| 类型authority | Core候选需核验 | metadata唯一、opaque ref禁止解析 | 避免第二套共享truth |

## 6. 设计取舍

采用双层资格：本地设计结构可继续，受影响owner正向lane blocked；拒绝以所有上游pending阻止全部局部设计，也拒绝通过文档完成关闭合同缺口。

## 7. 结构化中间产物

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| 当前00§9～14 | C1～5、FR/BR/数据归属/IF/DEP/NFR/AC/VETO | 七部分capability、对象、接口、处理流、状态和测试交接 |
| 当前01§6～13、16/17 | U1～7、三运行单元、依赖/一致性/技术约束、八ADR | 代码主体分层、事务骨架、SDK-owner接缝及配置影响 |
| L0-core正式03§5/7；metadata校准§13 | ActorContext、CommandMetadata、QueryMetadata；command key唯一来源 | 复用共享上下文，本地OperationContext不重复承载metadata authority；exact导出03核验 |
| L0-sdk正式02§3～5/7及02 flow | SDK client、formal read/call、三语言默认边界；flow旧状态未自动消除 | 本地required port到SDK正式支持逐operation资格，不绕SDK |
| Identity正式02§3～5/7及flow | GlobalMember非账号/认证 | AI成员引用条件消费，human publisher owner仍缺 |
| Governance正式02§3～7、03§7.2及flow | 独立Decision/Approval；GetGateDecision为只读DecisionSummaryView | 固定申请与formal outcome/binding核验需求；不由摘要可读推approved |
| Artifact正式02§3～5/7及项目台账 | version/lineage/baseline/consumable ref | 材料与来源ref消费，issue consumable不代表任何市场类型都适用 |
| Method正式02§3/4/7及项目台账 | 定义/正式版本/受控材料；不拥有market交易/安装 | 三展示类型的正式映射、GetFormalMethodAssetVersionSummary等候选读取 |
| Hub正式02§3/7及项目台账 | Registry/Descriptor/Exposure，与marketplace分离；当前repair anchor pending | GetFormalExposureBoundary/visibility候选资格，不能借registry presence放行 |
| Images正式02§3/7及项目台账 | pinned entry、ConsumerHandoffGap；0 outbound | ResolveInstantiableEntry候选；MI-UP相关positive仍blocked，不猜availability event |
| Observability正式02§3/7及项目台账 | redaction-first/local observation≠business truth；affected保留 | SubmitObservationMaterial准入需求，不把局部audit当正式receipt |
| Archive正式02§3/4/7及项目台账 | per-owner source/export/restore，market未纳source matrix | 当前无active export/restore，仅future blocker |

### 输入资格结论

本地U1～7设计可展开；每种owner/type/operation/consumer/scope须单独形成正式映射与SDK支持证据后才激活positive adapter。interface名称是来源线索，不是已有集成承诺。没有读取或生成实现仓事实；未读owner巨型对象章节不宣称全文核验。旧02尚未读取。

### 复杂度与结果深度

本Step为输入资格单元；矩阵比图准确，按规范不画可选图。§4～9会按七部分展开，§12分开稳定承接与合同挂起；03完成前不宣称可直接实现整个positive链。

## 8. 回填草稿

正式§1仅摘录本文件§7及已pass部分附录，不带问题/诊断/历史审计；不新增结论。

## 9. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01沿01保留，仅受影响正向lane blocked；不是owner已确认或已发送请求。

## 10. 进入下一步条件

P1～P8均完成；内部stop_review/pass。九专项上游当前formal受影响约束/接口与必要状态已核对；当前00/01直承接，旧02未污染。 外部资格不关闭，允许进入Step 2。
