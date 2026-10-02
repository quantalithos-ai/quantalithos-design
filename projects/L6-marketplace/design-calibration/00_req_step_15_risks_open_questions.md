# Step 15. 风险与待确认事项

## 1. 状态与计划

`pass / stop_review`；SOP Step15与规范§4.15已读。输入/问题/诊断/取舍done；风险及问题两表、owner/影响/重开条件、草稿、自检pending。

## 2. 输入

Step1 MP-SRC-001～013、draft MP-UP-001～008；五能力pending；Step12支持资格及Step14证明上限。仅本仓台账，不修改上游或宣称回流完成。

## 3. SOP 问题回答

1. 风险：来源/verification/审批/材料/receiver缺口被界面字段掩盖；billing与包ownership被愿景授权；上游状态/文档不一致；审计/归档接口资格不足；栈冲突。
2. 影响层：owner边界与正向契约资格、生命周期/数据/接口/质量/验收；不是仅测试TODO。
3. 待确认：8类候选UP、13个SRC调查、技术选型与容量依据。
4. 哪些影响成立：这些前置缺失不能真实上架/获取/通知/审计通过；负向fail-closed要求可完整定义但不能冒充正向闭环已实现。
5. 可否接受：本轮仅允许作为需求中的显式条件保存，不形成risk acceptance；强阻对应正向实现/验收。Billing/可执行包/归档恢复future，不用false owner补齐；01未授权不能进入。

## 4. 诊断

旧00风险与README开放计费模型容易暗示财务scope已有authority。早期Step1“所有上游长文件全文未读不能下一步”把阅读计划与合同资格混淆；现在记录实际适用读取与明确未qualified面，不说已全部全文或ready。缺口不因本轮审查结束关闭。

## 5. 对比

| 项 | 改前 | 改后 | 原因 |
|---|---|---|---|
| 开放项 | 模糊后续看 | owner/能力影响/当前姿态/重开条件 | 可恢复但不私造 |
| 上游状态 | 完成即ready | 当前formal/ledger资格分开 | 防状态污染 |

## 6. 取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 路径级blocked/future，需求完整与ready分开 | 能审查并保持安全 | 正向实现依赖协调 | 采用 |
| 等所有实现才装需求 | 避免开放项 | 不能先约束行为 | 不采用 |
| 用本地adapter定义补上游 | 实现看似能做 | 伪truth/contract | 不采用 |

## 7. 结构化中间产物

### 风险清单

| 风险 | 影响范围 | 当前处理口径 |
|---|---|---|
| R-MP-1 来源、材料与publisher资格无法正式验证却被界面当有效 | C1/C2/C4，§5/9～14 | 相应正向路径blocked，安全局部缺口可查，不复制truth |
| R-MP-2 decision读取成功/扫描/签名/ACK被误认审核通过 | C2，§9/10/12/14 | 只允许有效批准及完整binding，现合同缺口保持blocked |
| R-MP-3 财务/联合包愿景被当成本仓ownership授权 | §2/4/11/12/14 | Billing全部future；可执行包owner/格式适用缺口保留，不宣称合规通过 |
| R-MP-4 市场/源版本与接收/安装结果混淆 | C3/C4/C5 | exact版本、receiver binding、unknown分层，不生成installed |
| R-MP-5 已知影响与通知/audit/restore完整性被夸大 | C5，§11～14 | 区分已知范围、attempt、外部qualified结果；归档未开放 |
| R-MP-6 global Rust/Vue与draft TS/React选型冲突 | 后续01～07 | 00不锁栈，01需上位口径或正式变更依据；当前不自行覆盖 |
| R-MP-7 设计/fake/原型被当真实readiness | 全仓/§14 | 不生成run/asset/digest/evidence/verdict/signoff；只需求停审 |

### 待确认事项与恢复条件（本地候选，不是上游官方blocker）

| 待确认事项 | 影响章节/能力 | 当前状态 | 期望owner / 重开条件 |
|---|---|---|---|
| MP-UP-001 exact type/ref/version/digest/visibility/发布资格 | §6/9～14，C1/2/3/4 | 每类型正向发布/获取blocked；五类标签不是owner enum | 方法库/Hub/Images/Artifact；提供正式consumer字段/来源/失败/SDK映射 |
| MP-UP-002 Gov申请/版本/材料/scope/有效结果绑定 | §9/10/12/14，C2 | query名称存在不放行；缺正式批准binding保持blocked | Governance；public正式outcome及基线绑定、撤销/替代处理和SDK资格 |
| MP-UP-003 publisher主体/组织验证/授权 | §5/6/9～14，C1/4 | 人类认证owner缺失；Identity不替代；受影响写入口blocked | 正式安全/组织verification owner待定；提供authority/scope/失效/receiver身份合同 |
| MP-UP-004 签名/扫描/SBOM与适用材料权威 | §9～14，C1/2 | 仅材料引用与缺口，禁止由本地工具结果生成approval | 资产/安全材料owner+Governance；kind/version/binding/过期/失败与适用规则 |
| MP-UP-005 每类型交付/receiver/确认语义 | §6/9～14，C4/5 | 获取正向blocked；ACK不证明安装，unknown先对账 | 资产owner与正式接收系统；delivery/materialization/intent/version/scope/outcome/对账合同 |
| MP-UP-006 Billing/payment/subscription/settlement | §4/11/12/14 | 全部future/blocker，无transaction写面、不造finance ledger | 正式Billing owner尚无；只有正式owner授权与契约后重新讨论范围 |
| MP-UP-007 撤回来源、影响通知通道与receipt | §9～14，C5 | 本地停新分发/影响要求明确；外部通知正向blocked | 资产/Gov/通知owner；处置authority、receiver/channel/送达与unknown合同 |
| MP-UP-008 Observability/Archive交接 | §6/11～14，C5 | audit准入/receipt pending；Archive source未含市场，restore future | Observability producer准入/schema/redaction/receipt；Archive正式纳入source及export/restore authority |
| MP-SRC-003 技术栈差异 | 后续01～07 | 当前不选最终栈，保持上位差异 | 全局架构owner/用户正式选型；01确认或受控上位变更 |
| MP-SRC-010 Gov状态来源冲突 | §1/6/12/14，C2 | flow与formal/Step17不一致；不得本地修owner状态 | Governance澄清current baseline及消费资格 |
| MP-SRC-013 MK2 29110格式适用/包owner | §4/9/11/14，C1/2 | 标准要求未废弃但适用合同缺失；不能declared compliant或自建包truth | 合规owner/资产owner；逐类型格式适用、不可变包引用/检查材料/接收范围 |
| Q-MP-01 容量/延迟/通知SLO与保留授权 | §13/14，后续04～07 | 不给无依据数字/删除策略，不声称容量/送达达标 | 产品/owner输入+容量profile测量与正式保留/删除依据 |

### 调查来源映射

| 本地SRC | 对应UP/风险 | 保留处理 |
|---|---|---|
| 001 旧identity.Role | UP001/R1 | 当前RoleDefinition owner已纠正，不能推导exact发布enum |
| 002 publisher≠Identity认证 | UP003/R1 | authority缺口不关闭 |
| 003 TS/React vs Rust/Vue | R6 | 01选型阻塞口径 |
| 004 产品包/交易愿景 | UP005/006、SRC013、R3 | 不授权ownership |
| 005 Observability完成与affected | UP008/R5 | 路径级producer资格核验 |
| 006 方法库将settlement指市场 | UP006/R3 | 只承接方法库不拥有finance，不接受本仓财务授权 |
| 007 Hub曝光+repair anchor等待 | UP001/R1 | 只读消费资格未闭合，旧anchor不当current ready |
| 008 Images supply与consumer/Artifact缺口 | UP001/005/007、R4 | MI-UP001/003/007/009只按对应路径映射 |
| 009 BOM/scan/signature priority | UP004/R2 | Q-MI-004未确认，不假设材料完成 |
| 010 Gov状态冲突 | UP002/R2 | formal/flow冲突待owner澄清 |
| 011 Gov summary缺批准及market binding | UP002/R2 | 已检查读取面仍不足，不访问internal truth补齐 |
| 012 Archive无market source | UP008/R5 | restore不启用 |
| 013 MK2格式适用与包owner | Q格式/R3 | 原标准保留、正向合规不能声明 |

复杂度：风险表与问题表分开，额外调查映射只校准保留；不把local SRC号写成上游已批准缺口。01可讨论需求级已确定边界，但需用户确认，且exact实现合同缺口不自动解除。

## 8. 回填草稿

正式§15摘录风险及待确认表前三列；owner/重开条件可作为说明列保留以便协作。SRC细节延伸至本文件/Step1。不出现“已回流”“已接受风险”或最终解决方案。

## 9. 待确认

本文件正式问题表将统一挂起状态，非owner确认编号、不发消息、不改upstream，不形成signoff。

## 10. 自检停审

8UP/13SRC全部有当前姿态及受影响路径；栈/格式/容量显式；no owner不能被本地补truth。计划done；`pass / stop_review`，允许Step16；未关闭上游blocker。
