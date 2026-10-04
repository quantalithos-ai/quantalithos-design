# L6-bridges 00 Step 15：风险与待确认事项

> 状态：done / pass；回填00 §15；full-restart；风险/疑问与精确状态自检完成。

## 1. 状态与 Step 内计划

开工确认：项目台账/flow、Step1/6/9~14、Step5平台附录、需求SOP Step15/书写规范§4.15已读；专项七owner的00~07阅读沿用Step1登记，本次复读Conversation03 §7.4、Identity00 §2及实施台账当前头部、Governance00 §10及07 flow、Artifact00 §12及实施台账、SDK00 §12与07 flow、Workspace项目台账全文、Observability实施台账全文。进入条件pass；不回写上游。

| 单元 | 输入读取 | 问题/诊断/取舍 | 结构化 | 回填 | 自检 | gate_status / 下一动作 |
|---|---|---|---|---|---|---|
| 风险与未闭合项登记 | done | done | done | done | done | pass / next_step |

本Step不拆模块：一份不确定性register覆盖五节点，不再展开新能力或对象；风险、疑问、上游精确状态按不同表分批记录。

## 2. 输入

既有BR-UP-001~010索引；FR/BR/DR/NFR/AC的既定保护；七专项正式设计与状态台账；平台附录来源资格。Identity存在上游implementation报告，不说其全部未实现；Observability十二affected保留各自原状态，不概括为全部“未设计”。

## 3. SOP 逐项问题回答

| 问题 | 回答 |
|---|---|
| 哪些风险未关闭？ | human/AI和权限owner串线、安全材料来源断裂、平台能力与scope/版本漂移、未知副作用重试、不可比cursor/gap及dedup窗口、敏感材料泄露、seam选型/secret解析假设、上游交接与证据资格混同、并行/陈旧台账污染来源。 |
| 影响哪层需求结构？ | 边界§2、依赖§6/12、五能力§7、功能§9、规则§10、数据§11及质量/验收§13/14；每项将列明确影响FR/AC而不泛称全项目不能推进。 |
| 有哪些待确认事项？ | BR-UP-001~009是具体合同/部署资格缺口；BR-UP-010只是未停审Chat不得输入的约束，不用它创建依赖。SDK/平台SDK/OAuth/KMS/路由均not_selected/not_established。 |
| 哪些影响前文成立？ | 正向入站可靠接管、安全外显/附件、human责任动作、自动恢复与真实审计交接受到相关basis/material/query/probe合同约束；当前失败/拒绝/unknown要求已成立，不由缺口新增泛用提交/授权接口。 |
| 哪些可接受，哪些阻塞？ | 可以继续需求设计/风险收口的是显式边界和受限行为；缺依据阻塞受影响正向adapter激活/实施/联调/验收声明，不阻塞将保守需求装配成待审00。进入01仍需用户明确确认；运行readiness不由本文判断。 |

## 4. 当前材料问题诊断

| 当前来源位置 | 核对事实 | 不能推论 |
|---|---|---|
| Conversation03 §2边界表与§7.4 | 一处旧正文归属措辞指向Bridges/平台，§7.4已有target mode、actor、kind/digest及禁止body要求 | 不可承接Bridges拥有平台正文；不得否认正式bridge协议已有设计 |
| Identity实施台账Current Implementation State | current commit-08-c / ready_for_design_gate，有上游实现报告 | 不可说完全未实现，也不可当作Bridges联调或human认证证据 |
| Governance07 flow §1/5 | 正式07已创建，仍待最终检查/用户审查 | 不可称全部停审或部署ready；只承接已有正式语义并保资格限制 |
| Artifact实施台账Current Implementation State | current commit-01-a，其余planned，目标仓未由设计agent确认 | 不可说附件上传/读取/传播已建立 |
| Workspace项目台账§4~5 | 07已装配停审；WS-UP及WS-LOCAL开放 | 文档停审不关闭safe read/export/visibility与driver/crypto缺口 |
| Observability实施台账Current/Inherited | pre_implementation_blocked、wait_design；十二affected各有状态 | design_record_closed或covered_conditional不等实现/evidence/producer接受 |
| SDK/Conversation07 flow头部与Step13/正式07 | 头部仍称未创建，但正式07实际存在 | 不以陈旧头部抹去正文，也不自行改上游台账或推定用户签署 |
| Step5 PS07~09 | Telegram官网获准请求仍超时，官方源码仅核验选定片段 | 不声称官网全文、云配额/TTL/删除通知或固定部署版本已核验 |

## 5. 前后对比

| 易误读 | 当前收口 | 理由 |
|---|---|---|
| 缺口统一写“后续补” | 每项有当前失败姿态、影响与需要的正式关闭依据 | 不给实现者留下授权/材料/结果猜测 |
| 上游文件齐全等于可联调 | 正式语义、停审资格、上游实现报告与Bridges运行四者分离 | 证据只证明其实际所属边界 |
| 风险表安排产品/库/KMS方案 | 当前只约束、挂起和明确不宣称 | Step15不新增功能或方案 |

## 6. 取舍与复杂度

采用风险/疑问两个规范三列表，再附Bridges对接缺口的source/影响/释放依据和继承状态核对表；未采用笼统“所有上游没设计完”或为解决风险在本仓补owner truth。关闭依据是必须提供的正式材料，不是当前实施方案、owner承诺或已签署事实。复杂度可在当前文件分批记录，不新建跨项目台账或实施台账。

## 7. 结构化中间产物

### 7.1 风险清单

| 风险 | 影响范围 | 当前处理口径 |
|---|---|---|
| R-BR-001 外部human账号被误当GlobalMember，Workspace投影被误当授权owner | §2/6/9~12；FR002/003/010/011；AC003/004/023/024 | 当前按主体kind、显式binding及owning责任链收口，禁止自动身份或私有权限；BR-UP-002/003/005受影响正向路径仍blocked。 |
| R-BR-002 缺安全材料ref与重解析合同，接管或恢复可能被迫保存raw body | §7/9/11/13/14；FR004/005/007/008/014；AC009/010/016/017/031 | 当前只允许获准瞬时转换与正式材料ref；缺owner/准入/ref时拒绝或blocked，不承诺可靠接管、无损回放。 |
| R-BR-003 平台版本/scope/入口差异或Telegram来源不完整造成虚假兼容承诺 | §6/9/12~14；四adapter、FR001/003/004/006~010/012/013 | 当前按逐安装capability和来源版本保留supported/degraded/unsupported；未核验分支不激活，非4/4运行声明。 |
| R-BR-004 owner或外部效果未知被timeout/lease失效误当失败并重复执行 | §9/10/13/14；FR005/009/011/013/014；AC010/018/024/030/031 | 当前以同operation/effect continuity保护，未知仅原identity权威对账或manual，禁止盲重试/换target。 |
| R-BR-005 cursor跨epoch或去重窗口不足掩盖缺口、吞变化或重复回放 | §9~11/13/14；FR006/012~014；AC011/029~031 | 当前只在正式可比stream推进；gap关闭需覆盖依据；重放窗口不明或dedup已过期禁止自动回放，不假设永久留存。 |
| R-BR-006 敏感Gate、附件链接、callback私有URL或raw平台错误在外显/观测中泄露 | §10/11/13/14；全部adapter出口；AC016/017/026/037/038 | 当前按材料禁止/白名单收口，存在性/入口/action分开获准；不以永久URL、错误正文或派生字段绕禁止。 |
| R-BR-007 SDK/OAuth/API Key/KMS/路由默认行为绕授权、限流或effect连续性 | §6/9/12~14；FR001/004/009/010/013/014 | 当前均为adapter/config/secret seam待核，不默认选择、继承SDK自动retry、admin PAT或动态路由；缺有效引用/配置basis不激活。 |
| R-BR-008 inherited审计接收缺口与本地handoff混同，静态检查被冒称真实evidence | §12~14；FR015/016及强制审计操作；AC032/033/037/038 | 当前保留Observability原affected状态与pre_implementation_blocked报告；只记录本仓body-free intent/attempt，不报告consumer接受/证据/readiness。 |
| R-BR-009 并行Chat内容或陈旧上游flow头部污染正式来源资格 | §1/6/12/15；全部来源解释 | 当前只引用专项正式语义及明确来源状态；Chat保持reference_only，SDK/Conversation07头部冲突仅登记，不自行补签署/改上游。 |

### 7.2 待确认事项

| 待确认事项 | 影响章节 | 当前状态 |
|---|---|---|
| BR-UP-001 Conversation bridge输入兼容、safe材料owner/ref、变化和结果对账 | §6/7/9/11~14；FR003~007/009/014 | 正式target mode/Integration/kind/digest已存在，但Bridges来源正文归属、材料读取/重解析与accepted/unknown对账兼容未闭合；相关交接/外显/恢复保持blocked，不新造“提交Turn”。 |
| BR-UP-002 human account、AI身份与internal actor/participant责任链 | §2/5/6/9~14；FR002/003/010/011 | Identity仅AI锚点，internal human认证/授权来源未闭合；未明确主体kind及正式basis的绑定/动作不执行，external_id不自动建GlobalMember。 |
| BR-UP-003 Policy/Gate适用性、外显/存在性、action和责任验证 | §5~7/9~14；FR002/005/007/010/011/014 | 不把Governance当统一登录/六域授权中心；没有当前可验证展示/action/状态依据不外显或执行，低敏感不默认审批，受控入口未建立不造链接。 |
| BR-UP-004 Artifact附件准入、读取和跨平台传播ref | §6/9/11~14；FR005/008/014 | 通用Artifact可消费引用已有设计，外部附件接收/下载/上传/链接的具体准入、权限及有效性合同尚未验证；必要附件blocked，可省略须owner依据。 |
| BR-UP-005 Workspace safe read/export/visibility provenance | §6/9/11~14；FR003/007/016 | WS-UP-001~008/006-S、WS-LOCAL-001~003保持原open；只影响选用分支，不以Workspace为频道/权限owner；有独立正式owner依据的路径不强制经Workspace。 |
| BR-UP-006 Observability生产者准入、安全payload及真实consumer disposition | §6/12~14；FR015/016及强制审计操作 | pre_implementation_blocked与十二affected原状态保留；handoff/body-free backlog在获准预算内等待，强制准入缺失限制相应操作，不产生本地evidence/verdict。 |
| BR-UP-007 正式SDK客户端、平台SDK/OAuth/API Key/KMS/路由配置与secret binding | §6/9/12~14；FR001/004/009/010/013/014 | not_selected/not_established；公开协议读取不证明安装、grant、scope、provider或route可用；缺核验配置、有效ref及解析资格不激活，不填真实凭证。 |
| BR-UP-008 四平台分安装、版本与能力范围 | §6/9/12~14；FR001/003/004/006~010/012~014 | Slack/MM/Discord按已读取范围留待部署版本/pin核验；Telegram官网超时，仅官方源码片段部分核验，云配额/留存/TTL/时限未闭合；不宣称四平台正向通过。 |
| BR-UP-009 幂等/位置/顺序、限流预算及unknown恢复能力 | §9~14；FR009/012~014，保护FR004~011 | operation/effect/cursor语义已校准；具体编码、comparator、获准窗口/预算、并发claim与平台/owner probe合同待详细闭合；缺证明保持incomparable/gap/indeterminate/manual，不默认retry。 |
| BR-UP-010 L5-chat并行入口 | §1/6/12 | reference_only；本轮不采纳其未停审内容，不作为Bridges阻塞前置或审批路由。只有后续明确可引用正式合同才重新评估消费边，不表示当前对接已存在。 |

### 7.3 精确对接缺口与释放依据（calibration）

| ID | owning source / 当前定位 | 当前缺口 | 受影响边界 | 解除相关挂起必须具备的材料 |
|---|---|---|---|---|
| BR-UP-001 | Conversation正式03 §7.4/§10/§12；本仓Step5 §3/4与C2/C3/C5 | bridge consumer已有正式语义，安全payload/material owner、refs与变化/result查询尚需兼容确认 | DEP002；IF002~005/009；DR008/010；AC008~014/015~021/031 | owner明确材料归属/准入/读取/重解析、target mode/actor/kind/digest兼容、source版本与变化处置、accepted/unknown幂等结果读取；不可把平台body指派本仓truth。 |
| BR-UP-002 | Identity正式00 §2/10；实施台账current commit-08-c；正式入口/责任链owner待明确 | AI身份锚点不等human认证，外部account->actor责任与binding basis未统一 | DEP003/004；IF001/006/007；AC003/004/023/024 | 正式入口/owning chain提供主体kind、external证明、internal actor/ref、scope/action/有效性/撤销依据；Identity实现报告不能替代本对接合同。 |
| BR-UP-003 | Governance正式00 §10/12、07 flow§1；Conversation/材料owner visibility | 当前适用Policy/Gate、展示/存在性/action及callback owner状态验证需逐分支 | DEP004；IF001/003/005~007/009；AC016/023/024/031 | 逐对象/scope的现行basis及撤销/expiry读取、safe projection owner、敏感提示/入口allowlist与动作责任/状态/幂等结果协议；无统一认证默认provider。 |
| BR-UP-004 | Artifact正式00 §11/12及必要03；实施台账current commit-01-a | 原文件瞬时接收与正式纳管、authorized ref及链接传播/有效性未建立 | DEP005；IF003/005/009；DR011；AC017/031 | Artifact正式准入/读取/ref有效性/传播范围/撤销/expiry及必要/可省略依据，平台文件访问合同核验；不以公开URL或本仓raw缓存补缺口。 |
| BR-UP-005 | Workspace项目台账§4/4.8/5、正式00 §2/12与03/04 | safe摘要/水位/visibility来源、SDK read/export及本地durable/crypto边界开放 | DEP006条件分支；IF005/011；AC004/016/033 | 对实际消费的source/scope/read-export逐项关闭相关WS-UP，local binding/driver资格真实核验；必须仍回指owning visibility，不要求无关personal执行/seed能力为Bridges前置。 |
| BR-UP-006 | Observability实施台账Inherited Affected Register、Current State；正式00 §11/12与03/04 | 生产者schema/binding/消费完成/unknown/handoff及实际环境资格未闭合 | DEP010；IF010/011；AC032/035~038 | 具体Bridges producer-safe材料协议、准入/消耗预算、body-free redaction、真实consumer disposition/unknown处理；继承affected仅由owner相关正式关闭，实际交接须真实运行材料。 |
| BR-UP-007 | SDK正式00 §12及03/04；本仓Step6 §7.6、Step5 PS04/06/09/14 | 客户端兼容/pin、平台SDK默认行为、grant/API Key解析、KMS/provider及路由未选未建立 | DEP001/007/008；IF001/002/005/006/009；AC002/009/018/023/030/031 | 可引用的选型/版本/能力核验，逐安装scope/撤销/rotation配置合同，opaque secret ref版本/expiry/解析authority与失败行为，固定受权路由/SSRF边界；不需要把secret正文交文档或证据。 |
| BR-UP-008 | 本仓Step5 PS01~14/§2及Step9 §7.7 | 分平台事件/identity/位置/变化/附件/callback/ACK、cursor/配额和部署能力资格 | DEP008；平台相关AC002/004/009/011/016~018/023/027/029~031 | pin/部署版本对应官方来源核验与明确supported/degraded/unsupported合同；Telegram缺口先有可访问官方服务版本依据，不用master源码假定cloud固定事实；真实联调另行授权并提供真实材料。 |
| BR-UP-009 | 本仓C5卡§4/5、Step9~13；正式owner result/cursor与平台协议 | 键编码/冲突、namespace/epoch comparator、retention/预算、同effect recovery的可执行合同未定 | IF008/009；DR014/015；AC018/029~031/034/036 | 后续03/04闭合幂等schema/claim/fence、cursor比较/覆盖规则、获准重放/dedup窗口、lane/bucket/retry预算和权威probe结果/无副作用证明；合同不支持时保持manual/unknown。 |
| BR-UP-010 | 全局依赖规则§4.1、本仓Step1/6 | 并行产品未停审材料不能正式输入 | 无当前正式输入边；G001/002保护 | 后续用户授权及可引用正式产品/owner消费合同才重新裁剪；不把当前reference_only改成ready或强前置。 |

这些是Bridges缺口索引，不给上游增加新的owner职责，不声称对应域全部未设计。当前未回流修改任何owner文档/flow/ledger，释放依据仅为审查要求，不是已获得证明。

### 7.4 继承状态核验（calibration）

Workspace：WS-UP-001~008/006-S及WS-LOCAL-001~003仍开放；其中safe query/version/event/gap/visibility/read-export直接影响选用消费，non-project personal subject/静态seed不是Bridges新增前置。Identity台账存在commit-08-c开工及之前implementation报告，本任务未检验其实现仓或Bridges联调。Artifact当前commit-01-a与后续planned，不生成附件成功推论。

Observability源台账十二affected的原状态逐项保留：

| affected_id | 上游原状态 | Bridges当前禁止推论 |
|---|---|---|
| S08-E-I05-PAYLOAD-SCHEMA-01 | open_upstream_internal | 不宣称Bridges producer payload可landing/completion |
| S08-E-I05-PRODUCER-EVENT-BINDING-01 | open_upstream_internal | 不自选任意event并声称consumer完成 |
| R06.6-F2-H13-UPSTREAM | open_controlled | 不声称H13/J06恢复已Completed |
| R06-F-AFFECT-UOW-01 | open_controlled_downstream | 不以partial success/clone模拟原子交接 |
| S08-RECOVERY-CLASS-OWNER-01 | open_internal_affected | 不自造默认retry类型解锁 |
| R07-EXTERNAL-PHASE-LINK-01 | covered_conditional | 条件覆盖不证明真实delivery或可换token/target |
| R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01 | covered_conditional | 不盲重试/造新intent，未知需probe/manual |
| S08-CONSUMER-OUTBOX-SURFACE-01 | open_internal_affected | 不默认ACK/outbox或consumer accepted |
| S08-CONSUMER-INDETERMINATE-COMPLETION-01 | open_internal_affected | 不把unknown改成ACK/retry/dead-letter |
| S08-JOB-REPORT-REF-OWNER-01 | open_internal_affected | 不用alias/String假report ref |
| S08-M1-SECONDARY-TYPE-OWNER-01 | open_internal_affected | 不复制或包裹shared type伪闭口 |
| 03-RPR-S09-PER-FLOW | design_record_closed_implementation_open | 设计记录闭合不证明逐flow implementation/run/evidence |

没有把covered_conditional或design_record_closed_implementation_open改成统一open/closed；本任务不执行这些上游gate。

### 7.5 历史材料后置核对

| 旧材料位置 | 旧口径 | 当前判断 / 理由 | 回填影响 |
|---|---|---|---|
| 旧00 §12.1 | 延迟以排队/retry/降级缓解 | 修改：未知不能盲重试、降级不能换target，预算无依据不得无限积压 | R004/005/007保当前限制 |
| 旧00 §12.2 | 批次8、Bridges+SRE/Product负责人、生命周期同步、Gate kind/翻译 | 废弃虚构批次/责任人与隐含truth同步；敏感依据由owner，翻译不是当前FR | BR-UP按实际合同挂起，不保期限/任命 |
| 旧00 §12.1 | 平台策略变更、身份错配、敏感泄露 | 保留风险主题，不继承未经证实概率/影响数字 | R001/003/006的具体范围/处置 |

## 8. 回填草稿

正式§15.1/15.2摘录§7.1/7.2两个三列表，并保需求设计可继续、受影响正向运行不获准的范围说明。§7.3/7.4为具体source/释放依据和继承原状态延伸阅读，不把回流建议、owner承诺、过程诊断或实现方案写入正文。

## 9. 待确认事项

本Step自身没有新owner选择；全部既有BR-UP保留原状态。若owner输入后续变化，回到拥有相应主题的Step重审，不在追溯矩阵或装配时补结论。

## 10. 进入下一步条件

自检：九风险与十既有BR-UP分别入两表，每条有范围和当前限制；十缺口有来源/影响/正式释放依据，Workspace开放项和Observability十二原状态未关闭；历史批次/负责人不承接。无新增能力/方案、无虚构实现/账户/证据。允许Step16。

```text
gate_status = pass
gate_reason = risks_and_pending_branches_explicit_without_fabrication
next_allowed_action = read_step_16_then_traceability
source_files = Step1/5-annex/6/9~14_and_owner_ledgers
formal_backfill_allowed = after_step_17_three_level_gate
commit_required = false
```
