# L6-bridges 02 Step 12：详细设计承接清单

## 1. Step 状态与内计划

done / pass；full-restart / single-agent-serial；回填正式§12。开工：三层门禁已核；通用规范与当前SOP/书写规范已读取；Step4~11；SOP12/规范4.12已核对；前序思考/结构/自检pass。未来Step未创建。

| 计划项 | 状态 |
|---|---|
| 前序读取 | done |
| 问题/诊断/取舍 | done |
| 结构化/复杂度 | done |
| 草稿/自检 | done / pass |

## 2. 本步输入

Step4~11；SOP12/规范4.12；前序校准文件的回答/诊断/取舍/待确认；项目/flow；通则/中间产物/真相源适用纪律。历史02/README后置扫描。

## 3. SOP 问题回答

1~2. 交付一个BC/六U、20对象、五类20主语、23port最低语义、19独立流、17机/3无机及独立结果。3. 03必须完整定义所有字段/slot/marker/DTO/port/metadata/schema/事务/异常与测试切口，不只重复名词。4. 改主语/owner/trigger需回02甚至01/00，不暗改。5. config只到实现装配contract，具体值/pin/profile到04。6. 不承接“已就绪产品/上游兼容接口/已准入producer”等未建立事实，这些保持Step13待确认。

## 4. 当前文档问题诊断

概要名称不等于已有公开type。若03只展开20对象而遗漏typed supporting carriers/required-by-state、owner accepted与查询read basis，会让实现者猜schema。当前补具体类型使用索引，明确local type命名与真正外部authority分离；不将缺owner contract转成已收稳输入。

## 5. 改动前后对比

| 02已收口 | 03要补 | 不允许 |
|---|---|---|
| 主语/typed骨架/guard | 字段全集、optional/required-by-state、public契约来源与resolve/failure | 用string/empty/raw cache补缺口 |
| port语义与adapter seam | 明确callable绑定及per-installation资格 | 给上游凭空新增方法或宣ready |
| 稳定流程与状态 | 完整UoW/claim/fence/crash/error/query contract | 暗改effect、one-use、cursor/unknown边 |

## 6. 设计取舍

承接表列稳定主语与具体细化方向；支撑类型索引做本Step附录，03逐项正式化，不是实施台账/新对象池。来源只取Step4~11，不能在此新增能力/事件/schema。依规范不画图；不写开发任务/日期/测试全集。思考done。

## 7. 结构化中间产物

### 详细设计承接清单

| 已由概要设计收稳 | 详细设计继续展开 |
|---|---|
| 一个外部协议适配BC与U1~U6 | 业务结构/代码层/部署角色保持不同轴；目录/crate/package/builder从此结构展开，不另发明owner或六微服务。 |
| 20局部关键对象与六附录 | 完整字段/enum/slot/marker/ID、构造与成员签名、值域/可选性/required-by-state、local vs owner ref及serialization归属逐卡闭口；不复制正文truth。 |
| 三mapping typed骨架 | identity/account kind/actor，location/channel-DM-topic-thread/parent/target，message/change/source/version/accepted/effect/origin；namespace/generation/basis/唯一约束/保留与失效正式schema。 |
| 配置接纳、关系active和来源verified | RuntimeConfig/AdapterConfig与owner qualification独立；current resolver/authority版本/expiry/revoke，配置接受不等激活/权限。 |
| ConversationHandoffPort既有语义 | 精确绑定BridgeMappedFactReceivedEvent AppendFact/ManifestExternalFact、ActorRef/BridgeTargetMode与Integration/BridgeMapped/required digest；safe material/result ref及accepted/pending/unknown兼容缺口未释放仍blocked。 |
| actor与explicit binding责任 | human/AI/Integration正式owner链、participant/action/读取资格与外部定位映射；Identity只AI锚点，external_id不自动建GlobalMember。 |
| Policy/Gate与安全外显/action | 真实适用性/visibility/存在性/安全提示/受控入口/action/责任basis；敏感审批正文不外发，没正式entry不造URL/按钮；callback owner二次核验。 |
| 附件引用与conditional Workspace读取 | Artifact准入/authorized ref/传播/expiry/必要与可省略依据；Workspace安全read/export只消费真实合同，不从snapshot倒推权限。 |
| StableEffectIdentity与C04/E02语义唯一 | 明确定义validated tuple/canonicalization/namespace/版本/冲突/DB唯一；各自idempotency_key不是effect唯一。原target/source/projection不可变，new版本不掩盖旧unknown。 |
| intent/attempt/receipt、IO前后两UoW | durable原op+claim/fence先于任何IO；private material/secret最后资格核验、超时/崩溃/迟到结果/no-effect/known分类及原结果引用；LocalCommitDisposition未知与driver权威同op提交探测/no-commit proof必须闭口，不假定rollback；platform ACK/HTTP不是accepted/delivered。 |
| one-use与CallbackHandoffRecord | action/source/actor/target/owner revision/expiry/current binding，claim+原op+record/dedup同UoW；claim不可复活、owner未知不重新approve。 |
| DedupRecord scoped同义/失效 | management/inbound/outbound/callback/recovery/handoff namespace、key authority、body-free meaning、原result当前可见性、retention/tombstone；过期不重新执行。 |
| StreamCursor/GapRecord与safe replay | source namespace/stream/epoch/position/comparator、kind-specific coverage/range/CAS、不同阶段位置、缺来源manual；qualified safe refs重走原consumer，无raw replay cache。 |
| DispatchLane/limit/retry资格 | 局部顺序/创建locator依赖、claim/fence/共享bucket-major-resource-global下界、no-effect proof与当前预算/窗口；库内部retry必须可禁。 |
| 五类接口与metadata单一来源 | C01~06/Q01~04/E01~04/O01/J01~05全部typed request/result/envelope/job carriers；CommandMetadata key/trace、QueryMetadata page/consistency、event source/id/key和可信job context不得默造。 |
| 23个本地port要求 | 逐个定义callable/input/output/error/读取or写入性质、owned abstraction与具体owner SDK正式binding；缺合同不可声称已有方法/可运行。 |
| 四平台adapter有限语义 | per installation/pin/scope/direction/method验证locators、ACK、变化/线程/附件、业务result、cursor/rate/retry/probe；Telegram官网、安装能力与产品仍待核。 |
| SDK/OAuth/API Key/KMS/router seams | 版本、grant/scope/CSRF（适用）、private resolver/rotation/revoke、路由认证隔离、禁rawlogging/自动权限；产品选择必须可追正式资料与安装资格，不直接沿旧技术栈。 |
| body-free audit与条件canonical handoff | 明确唯一producer/source+schema/admission、安全材料构造、真实consumer result与原op恢复；无canonical payload只audit-only/blocked，不造通用outbox。 |
| BridgeLocalView与四qualified/degraded Query | 完整字段来源/scope resolver/current read basis/visibility/count-ref过滤/page-consistency/denied-unavailable与no-write proof；无repair/refresh/重放/probe/audit写。 |
| 17局部机/三无机、六传播图 | 完整state enum/触发guard/非法返回与current required fields；known/unknown/terminal/one-use/epoch各自保持，传播不等consumer accepted/evidence。 |
| 29关键异常与设计测试切口 | 错误分类/port结果/事务失败/网络不确定/恢复资格/crash矩阵、05可执行验证切口；禁止原body/hash/secret/rawerror进入任何出口。 |
| 配置影响及禁止配置化 | loader/validator/typed RuntimeConfig/AdapterConfig/JobConfig/ConfigError/builder契约到03；具体key/default/env/profile/pin/opaque ref填写到04，红线不可开关。 |
| support carrier/type使用索引 | 见本Step类型附录；所有概要字段类型、函数typed参数、API/port/request/result/envelope/basis refs均须03逐条定义、来源/版本/scope/expiry/失败、serialization与required关系，不交实现猜。 |

### supporting type闭口索引

[02 Step12 support type使用附录](02_hld_step_12_support_type_handoff.md)是Step6/7/8/9已出现名称的使用索引，不是完整schema，不新增对象或宣称上游存在全部类型。03必须逐项给正式定义或明确绑定外部shared正式类型，禁止只复制名称；字段Slot缺失与state guard强制必填不得同时含糊。未获上游authority/qualification的carrier保持blocked，即使本地结构已定义也不能执行。

### 回退规则

若03发现已列主语、对象归属、接口分类、trigger、effect语义、状态红线、query边界或配置不变量需改变，应先回02对应Step校准并重审；涉及owner/BC/依赖/ADR回01，涉及scope/业务授权/禁止材料回00与正式owner，不在03暗改。单纯完整字段/类型/序列化/签名/事务driver细化由03负责；实际值/pin/profile由04负责；具体TC/EV/phase另由05~07，不提前创建实施台账或planned boundary。


## 8. 回填草稿

正式§12回填稳定主语/具体03细化、support type附录入口与回退规则，不把类型索引当完整schema/已就绪上游。

## 9. 待确认事项

BR-UP-001~009=open；010=reference_only；不关闭上游。

## 10. 进入下一步条件

自检pass；gate_status=pass；gate_reason=detailed_design_handoff_and_support_type_inventory_closed；next_allowed_action=step13_risks；formal_backfill_allowed=after_step14；commit_required=false。
