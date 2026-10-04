# L6-bridges 04 Step10：变更、审计与回滚

## 1. Step状态与开工确认

2026-10-04；前序Step9已通过设计静态自检，授权仅全部04；正式04完成即停审。full-restart / single-agent-serial，无代理/并行工具。

| 模块 | 骨架 | 思考 | 写入/草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|
| S10 | done | done | done | done | pass | enter_step11 |

### Step内计划

| 小阶段 | 位置 | 状态 |
|---|---|---|
| 读取输入/前序 | §2 | done |
| SOP问题回答 | §3 | done |
| 当前材料诊断 | §4 | done |
| 设计取舍 | §6 | done |
| 结构化/逐域停审 | §7 | done |
| 复杂度与批次 | §6 | done |
| 回填草稿 | §8 | done |
| 自检/下一条件 | §10 | done |

## 2. 本步输入

Step7~9完整字段/current/加载；03 C01 expected/wholeCAS、source mode排他/原effect unknown；原safe audit/O01材料；配置SOP Step10和书写§5.10。精确读取/使用范围随§7记录，不把旧05/06或Chat作正式输入。

## 3. SOP问题回答

| 问题 | 回答 |
|---|---|
| 1 谁可变更 | §7七类具名授权责任，提案者不能自签internal/平台/secret/producer权；token/OAuth管理员身份不替正式basis。 |
| 2 评审 | 所有authority/ref/source/store/material/policy变更critical；资源/profile高风险；不假设具体工单/平台产品。 |
| 3 生效 | 文件startup/cold，业务安装C01 expected CAS明确接纳；停旧/完整新admission后生效，source group先证明排他。 |
| 4 审计 | 03body-free原mutation/CAS/revision/basis/stage/finite材料及实际disposition；禁止raw before/after/selector/secret/URL/hash内容。 |
| 5 回滚 | file失败不publish；已经接纳C01只能新revision表达语义回退并current核旧ref，不能还旧CAS或终态；外部已知效果不撤销，unknown不重发。 |
| 6~8 逐类与跨审 | 七类回指Step7/8/9字段/敏感/current与Step11失效；二十域全部纳入，权限/审查/审计/回退/原op/泄露逐类停审。 |

## 4. 当前文档问题诊断

“复制旧文件并重启”不能回滚已C01更新的revision；“切新driver/新token后重试”会丢original unknown。先开新webhook/Gateway再关旧source可能双消费。config审计不能把全JSON、差异哈希或读取凭据原值送Observability，且local audit不等consumer accepted。

## 5. 改动前后对比

| 之前 | 本步后 |
|---|---|
| cold方向只有原则 | 七类提案/评审/接纳/生效/审计/回退与20域责任齐 |
| 失败后旧配置无条件继续风险 | 旧actual current独立核验，已撤销不LKG授权 |
| rollback混外部结果 | 新revision语义回退，原known/unknown/终态不改 |

## 6. 设计取舍与复杂度

采用提案审查→明确接纳→cold activation三个概念阶段，均已有source/basis/C01/host责任，不新增变更API、registry产品或状态机。未采用自动apply/reload、snapshot差异dump、rollback反向修改旧revision/原result、移库探unknown或default ticket系统。

审计失败/mandatory缺准入按03先阻受保护mutation/IO；不是“变更先落后补证据”。以七变更类逐类小循环，随后20域coverage审查；全部真实commit/activation/disposition尚未发生。

## 7. 结构化中间产物

### 7.1 变更类型 / 逐类停审

| 变更类型 / 配置项 | 发起方 | 评审要求 | 生效方式 | 审计记录 | 回滚方式 / 停审 |
|---|---|---|---|---|---|
| 功能/branch/provider选择 / host_admission及全部模块selector | 受权operator提案，Config/相关owner核正式basis | high/critical：required闭包、环境/build/scope、private与producer规则 | 启动/cold；不得自动启分支 | 仅§7.3原03已获准body-free材料/version/disposition，禁raw值 | 新受权snapshot；仅旧actual仍current可有限继续，不fallback授权；本类权限/评审/敏感/审计/回退/失败逐项pass_design |
| 执行预算/profile / execution五数值/clock/executor；host profile | 受权资源配置方＋config basis owner | high：五tuple和hard cap、memory/wait/ACK/stop影响；不以压测猜预算 | cold；CFG-03-001 actual stop新预算 | 仅§7.3原03已获准body-free材料/version/disposition，禁raw值 | 旧同tuple/profile须current；不降平台下界，不把新容量给原retry；本类权限/评审/敏感/审计/回退/失败逐项pass_design |
| 安装/能力/route/secret绑定 / installations及四平台adapters | 正式安装/config授权方，internal binding授权仍单独owner | critical：七draft字段、capability pin/method、namespace/current/route与所有secret用途 | 明确C01 expected CAS接纳后cold | 仅§7.3原03已获准body-free材料/version/disposition，禁raw值 | 语义回退须新ConfigRevision+新basis及oldrefs current；不还原旧revision或binding终态；本类权限/评审/敏感/审计/回退/失败逐项pass_design |
| source mode/producer/epoch / 四platform源、conversation/observation source、entry_transport | 受权source/producer operator与owner | critical：同source/family排他、Telegram整体group、epoch/gap、schema/admission | 先停旧source/drain，确认排他再开新；无drop_pending | 仅§7.3原03已获准body-free材料/version/disposition，禁raw值 | 不能claim恢复完整coverage；回旧mode亦新批准资格且保gap/原key；本类权限/评审/敏感/审计/回退/失败逐项pass_design |
| 凭据/材料/owner资格 / credential_use/private_material/六owner模块 | provider/材料/owner授权方＋config接纳，职责分离 | critical：exact version/purpose/revoke/private lifecycle/visibility，禁raw审计 | cold新ref；runtime revoke/expiry即时阻IO | 仅§7.3原03已获准body-free材料/version/disposition，禁raw值 | 旧secret过期或revoked不回退；原unknown readonly获准才probe，否则manual；本类权限/评审/敏感/审计/回退/失败逐项pass_design |
| 投递/恢复/保留source / dispatch/replay_continuity | Policy/retention/source正式owner＋受权维护方 | critical：原effect budget/NoEffect、full coverage、RetentionExpiryBasisRef，不能TTL清记录 | cold source选择；每原subject current重新核 | 仅§7.3原03已获准body-free材料/version/disposition，禁raw值 | 只原subject/result/continuity；无新effect，key/tombstone/unknown保持；本类权限/评审/敏感/审计/回退/失败逐项pass_design |
| store/schema/transport/job产品 / local_consistency/entry_transport/scheduling及executor | 受权实施/运维提案＋实际compat owner | critical：同driveractual commit probe/schema/CAS/19collection、scoped Future、原Job plan | 只经重新资格审查的cold切换；physical迁移未选 | 仅§7.3原03已获准body-free材料/version/disposition，禁raw值 | 旧unknown不能移到新driver猜测；无可用original probe则保blocked/manual，不能变成重发；本类权限/评审/敏感/审计/回退/失败逐项pass_design |


### 7.2 变更审计链图: Bridges受控接纳与宿主激活

```text
[authorized proposal + independent review/current basis]
  -> [bounded candidate validate, no secret/body dump]
  -> [explicit C01 expected CAS, if installation changed]
  -> [known local disposition / original-op reconcile if unknown]
  -> [stop old selected host/source, drain retaining original]
  -> [exclusive source proof + all new actual admission]
  -> [new host active, each IO current]
          |
          +--> [failure: no new publish; requalify prior semantic
                or remain blocked/manual, no blind effect retry]
```

关键说明：

- 图是已有管理/宿主边界的操作顺序，不新增Command/API或业务成功状态。
- C01接纳与实际new host/source active独立；未知local commit先同driver原op probe。
- 停止/new配置不改original key/effect/target/receipt或cursor gap；不丢pending。
- rollback只回已再次获准语义，不复活旧grant/终态或把已知结果当未发生。

### 7.3 变更审计材料与权限

| 材料 | 来源 / 允许内容 | 禁止 / 失败 |
|---|---|---|
| 提案/评审依据 | 实际ConfigurationBasisRef与相关Policy/owner/producer/current safe ref，source/version/scope由其owner核 | 不由文件“approved=true”或operator自签；没有basis拒接纳 |
| 局部mutation | 原operation/expected independent revision/实际wholeCAS/commit proof，按03SafeAuditRecord白名单 | 原raw config/selector/secret/DSN/endpoint/私有callback/敏感正文/可还原bodyhash不保存 |
| cold宿主阶段 | finite accepted/blocked/active-local等actual阶段及已获准安全指针；active-local非平台运行success | 不虚构过程disposition，不写伪run/report；原schema/guard名称不新增state |
| provider读取/轮换 | provider自己的实际审计与用途/revision/current revoke责任；Bridges只safe原变化依据 | KMS/OAuth成功不升internal permission或安装4/4ready |
| Observability交接 | 原O01规则适用/准入及body-free材料，J04/E04消费原结果 | 没formal producer/mandatory准入先阻mutation/IO；local audit不造canonical/evidence |

权限与评审至少区分配置提案者、ConfigurationBasis owner、secret/source/route/provider授权方、Internal binding/Policy/Gate owner和Observability producer准入owner；具体人员/系统未指派，不伪造signoff。职能可以按正式治理规则组合，但不能仅“服务管理员”一词吞掉所有basis。

### 7.4 失败/回退与original保留

| 失败阶段 | 处理 | 原事实保持 |
|---|---|---|
| 候选parse/shape/profile未通过 | 不接纳、不publish；旧宿主仅其actual/current仍合法时可继续 | 不写任何伪新revision/result |
| C01 commit indeterminate | 保原management op/key/mutation；同driver readonly probe后known结果优先 | 不新begin/C01换key或复制新file当已成功 |
| 已C01接纳，新host admission失败 | 保安装已接纳事实，new branch blocked；若需旧内容用新revision+新basis/current资格 | 不将安装state/配置revision倒退，旧终态不复活 |
| old source无法证明已停/排他 | 新source不启动；旧source缺资格亦停，保gap/unknown/manual | 不靠去重容忍同source双模式 |
| old version/provider已revoke/expired | 不回退旧secret/权限；该original readonly恢复缺资格保持manual | key/tombstone/result/unknown不可删 |
| 部分IO known/unknown | known保持实际immutable result；unknown按原subject/source/probe窗口恢复 | 不能配置回滚外部消息或内部Turn；edit/delete也须新授权明确effect |
| store/schema产品切换 | 先原driver资格与original probe/迁移合同具名关闭；本轮未选physical迁移方法 | 不把新DB absence当旧op NoEffect、不能迁移后再猜原提交 |
| shutdown clock/profile失败 | 阻新IO，scoped隔离/取消保actual未决，不造deadline/StoppedLocal | CFG-03-001 guard与原unknown并集不变 |

### 7.5 二十域覆盖与跨审 / 对详细设计的影响判定

所有二十域分配到§7.1七类：host_admission/execution为选择/资源；installations及slack/mattermost/telegram/discord为安装/source；local_consistency为store；六owner与private_material/credential_use为资格/材料；dispatch/replay_continuity为投递/恢复/retention；entry_transport/scheduling为技术宿主。每域字段由Step7定义，敏感性Step8，加载Step9，失败按§7.4与Step11承接，没有未纳入变更类。

跨审：high/critical类都有具名提案、正式评审basis、startup/cold、受控审计和语义回退/拒绝出口；无raw diff/具体工单系统假设、无LKG authority/外部结果回滚。proposal/accepted/active-local等是操作阶段说明，不是替换03enum的配置状态机。

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 七类cold/C01/回滚/current/原op保护 | 否 | 原C01/state/CAS/host当前合同的配置操作细化 | 03§7/9/13/14，无新API/DTO/迁移边 | 无回写 |
| 停止时budget重建 | 是，前步已处理 | CFG-03-001继承 | 03§5/6/9/13 | 已回写 |

## 8. 回填草稿

正式§10逐字装配§7.1~7.5；所有cold变更按正式basis/C01/actual host/source分层，语义回退使用新revision并current重新核，而非撤销immutable业务事实或重发unknown。audit只03授权安全材料；无实际工单、人员签署、commit、activation或成功状态被编造。

## 9. 待确认事项

BR-UP001~009=open、010=reference_only；WS十二开放项及Observability十二affected保原状态；平台/SDK/OAuth/API Key/KMS/router/DB/executor实际资格未建立。不实现、运行项目测试、stage或commit。

## 10. 自检与下一Step条件

实际只读检查：十段齐，§3~8未写占位0、03影响表存在，errors=[]。人工按本Step SOP问题与具名03消费点逐项核对，本步范围/禁止面/来源/失效语义通过设计静态自检；七类逐类停审覆盖二十域；source切换、C01 unknown、store迁移失败保持original。首查把句中“不丢pending。”误判未写占位，已把规则限定独立占位行并真实重跑；没有跳过失败门禁或新增type/state。

self_review=pass_design_static；下一仅enter_step11。BR-UP/WS/affected及真实产品资格不释放；没有编译、项目测试或平台投递，不stage/commit。
