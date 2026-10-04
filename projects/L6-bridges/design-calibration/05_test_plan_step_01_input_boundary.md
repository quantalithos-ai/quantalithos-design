# L6-bridges 05 Step1：输入边界

## 1. Step状态与开工确认

2026-10-04；仅05获授权；full-restart / single-agent-serial。此步先骨架，不提前创建未来Step或正式正文。

| 模块 | 骨架 | 思考 | 写入 | 自检 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|---|---|---|
| input_boundary | done | done | done | pass_design_static | pass | step_design_review_complete_external_gates_open | begin_step02_skeleton | 本Step§2/7；实际静态审计 |

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

启动已完整读取测试SOP/书写规范/全局依赖；复核通则§1.4~1.7、中间产物§3.1~3.6/§5.10、真相源§2.15/§7.1~7.5。恢复台账、04 flow/Step15，04仅同步最新输入认可。旧05正文尚未作为输入读取。

本轮定点阅读：00§9~14（16FR/24BR/20DR/16NFR/38AC/6VETO）；03§10.1/10.3~10.4/11~15/16.4~16.11/17.1，§15全文；§10.2的115 repo函数与§16.3未全文重读，后续需要时定位。04§7.1及全部82项十列、CF22/F27、§12~14.5与平台再核附录。七上游05相关输入及台账见§7.1。本轮不冒称重读七项目00~07。

首次05范围基线已捕获并实际JSON.parse通过：Bridges原150文件；范围外4678，digest=6bc7c5f15e58638f6748cab42cc5f2779868a5b14b0506bf5632c58b51d1802a。前轮helper serialization/大输出截断失败未创建Step/推进；本续接保存function.toString后恢复，不以工具失败当完成。

## 3. SOP问题回答

1. 承接00全部已编号规则、数据/非功能、验收方向及VETO，不新增需求编号或以用例替换需求。
2. 01/02提供ownership/依赖；03对象、完整协议、flow、状态、wholeCAS、构造与private边界直接决定对象/切口；04决定配置矩阵与失败断言。
3. 00的38AC提供planned EV方向；旧06无当前资格。06未来负责最终验收规则/裁决，不在05伪造verdict。
4. 不重定义owner truth、授权、DTO/状态pair/secret范围、compile路径及平台产品；测试夹具不是provider fallback。
5. BR-UP/WS/affected缺口阻真实正向联调与资格，不阻本地negative/synthetic设计；当完整来源/guard无法确定时先回具名03设计，不留实现者猜。

## 4. 当前材料问题诊断

旧05不能承接当前19flow/21机与unknown/同drivercommit语义；先独立抽取输入，末步才扫描历史。current设计与actual可运行性分开：03/04已有可编码合同，但driver、账号、producer/secret/storage尚未准入，不能称所有依赖ready。

## 5. 改动前后对比

| 原问题 | 本轮选择 |
|---|---|
| 缺当前05闭环 | 从00~04独立校准，不增需求/实现真相 |
| 旧06被当已验收 | 仅00 AC为方向，06保historical_material |
| mock与实际资格混同 | local synthetic与real seam两类门禁独立 |
| 上游开放项可能被测试表关闭 | 原状态继承，证据/准入不足阻actual |

## 6. 测试设计取舍与复杂度

本步按输入资格单循环，结构化保留来源、不可重问和05必须回答的内容；正文§1只承接规范结论。约100行校准，小批先来源后自检；不展开TC、脚本、环境实例。

## 7. 结构化中间产物

### 7.1 输入映射与消费资格

| 来源 | 实际承接输入 | 正式05章 |
|---|---|---|
| [00](../00-需求文档.md)§9~14 | 16FR/24BR/20DR/16NFR/38AC/6VETO；需求/禁用能力不变 | 1/2/5/10/12/14 |
| [01](../01-架构设计.md)、[02](../02-概要设计.md) | 仅adapter-local truth、七role、六owner、compile/runtime/event裁剪 | 1/3/4/8 |
| [03](../03-详细设计.md)§4/7~16 | 十一target、20协议/19flow、21机/150允许对、wholeCAS/immutable/current/原op | 3/4/6/9/13 |
| [04](../04-配置设计.md)§7~14 | 严格JSON/82项、22CF/27F、五环境/12CFG切口、stop-time budget | 3/6~10/14 |
| [SDK05](../../L0-sdk/05-测试方案.md)§3/6/14 | 条件SDK compile seam、可信上下文/错误清洗；不选轻client | 4/8/14 |
| [Conversation05](../../L1-conversation/05-测试方案.md)§3/6 | bridge-origin输入/提交/版本变化/unknown；外部ACK不提交 | 3/6/12 |
| [Identity05](../../L1-identity/05-测试方案.md)§3/14.4~14.5 | external human绑定锚点/责任来源；不得自动GlobalMember | 3/6/14 |
| [Governance05](../../L1-governance/05-测试方案.md)§10.3~10.6 | Policy/Gate/current/one-use、敏感内容外显边界 | 6/10/12 |
| [Artifact05](../../L1-artifact/05-测试方案.md)§10.3~10.5 | authorized附件ref/私有短借/过期不可用 | 6/7/10 |
| [Workspace05](../../L1-workspace/05-测试方案.md)§1/13~14及项目台账 | 条件safe read/export/provenance；十二open不强制无关分支 | 6/8/14 |
| [Observability05](../../L4-observability/05-测试方案.md) affected处置及实施台账 | producer/schema/非递归/body-free交接；十二affected与wait_design | 6/12~14 |
| [04平台核验](04_config_step_07_platform_source_reverification.md) | 11公开URL中8选段/3unavailable；非pin/installation资格，未新增网络核验 | 6/8/14 |
| 00 AC及未来06 | 38AC为测试证据方向；06负责最终裁决，旧06非输入 | 5/12/13 |
| L5-chat | reference_only，未停审内容不消费 | 无正式输入 |
| 旧05/06/README | historical_material，后置冲突扫描 | 仅Step15过程 |

### 7.2 不再回答与必须回答

不再回答：谁拥有Conversation/Turn/Identity/Gate/Artifact/Workspace或平台truth；如何授予binding/Policy；原20协议、schema、状态pair、wholeCAS、private规则及上游SDK导出。测试不增加业务接口、setter或secret默认。

05必须回答：逐对象切口/完整正反断言、来源与覆盖、DS/隔离与清理、11target和真实seam资格、环境/配置矩阵、suite/script门禁、专项资源与安全、缺陷复验、entry/exit、机器可验证安全artifact/report/EV关系、回归/残余风险。

### 7.3 输入边界结论

Bridges只验证其owned配置/授权relation/三mapping/cursor/dedup/attempt/receipt/adapter-local状态。Owner或平台外部结果由对应正式port/driver authority提供；ACK、内部提交、平台接受、consumer接受四阶段分别assert，不互证。

BR-UP-001~009=open、010=reference_only；Workspace十二open、Observability十二affected保持原状态。actual产品/pin/account/provider/config/secret/producer资格未建立，local fixture/mock不能释放。对输入无法判定的actual分支输出blocked/unavailable，不skip后汇总pass。

## 8. 回填草稿

正式§1装配§7.1~7.3，保各来源资格/非范围/必须回答内容；不搬启动读书日志、工具失败、自检结论。

## 9. 待确认事项

七上游及平台actual兼容/注册/准入持续开放。外部secret/消息不读不写；旧材料待Step15扫描。暂无必须修改公共03schema的决定；若采用脚本需Step9先具名反校准。

## 10. 自检与进入下一步条件

实际自检：来源/正式输入资格、不可重问与必须回答边界逐项审查；旧06仅验收方向、ACK分阶段、actual阻塞保留。已运行当前05校准Markdown/编号章节/相对文件链接检查，errors=[]；仅设计静态，不是项目测试或运行证据。

self_review=pass_design_static_external_gates_open；gate_status=pass；gate_reason=step_design_review_complete_external_gates_open；next_allowed_action=begin_step02_skeleton；source_files=本Step§2/7及对应SOP/规范。
formal_document_write_allowed=false；implementation_write_allowed=false；test_execution_allowed=false；commit_required=false。
