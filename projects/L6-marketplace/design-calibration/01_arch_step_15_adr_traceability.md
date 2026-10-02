# 01 Step15 · ADR与需求追溯

## 1. 开工确认与Step内计划

模式full-restart；当前agent单独执行；前序Step已停审。已读取架构SOP本Step、架构书写规范对应章节和通用规范适用规则。输入：Step01～14、正式00§9～16、架构规范§4.16/4.17。输出为当前文件；正式回填仍待Step16。

计划：输入恢复→问题回答→诊断→取舍→结构化→复杂度/历史差异审计→回填草稿→自检/停审。前四项进入本批，后四项pending；未来Step不预建。

| gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|
| pass | 前序停审及用户01授权，只许可当前Step | 完成当前单元思考后才写结构化 | Step01～14、正式00§9～16、架构规范§4.16/4.17 |

## 2. SOP问题回答

值得长期保留的是市场边界/运行分离、唯一来源/固定基线、Gov批准专属、受控exact分发、原子原结果及unknown、撤回序列化、scope-safe派生、局部与外部审计边界。每项回指既有单元及需求/风险/取舍。Rust/Vue是上位约束而非本仓新ADR；具体框架/ORM/组件不是ADR。逐决定停审后建立全需求矩阵。

## 3. 输入诊断

追溯必须说明具体承接而非“见章节”；数据及VETO不能只被FR计数代替。正文类型禁止项、IF504条件事件、无Billing/Archive、29110缺口均需显式回指。positive材料未闭合是来源—合同资格缺口，不是本地责任遗漏。

## 4. 设计取舍

八项ADR索引只组织前序已有决定，不编ADR正文或批准日期。逐FR及BR/AC/NFR/IF/DEP/数据/VETO映射到单元、机制、CUT及正式位置；不把通过本Step等同用户正式签核。

### ADR-MP-001 问题、诊断与取舍

前序Step03/05/06/11；00职责及NFR-G01；R-MP-7。问题：UI与后台是否拆为两个truth项目？诊断：部署分离不要求领域分裂。取舍：一个市场边界、多个运行单元，七语义单元不强拆微服务。

思考done；gate_status=pass；next_allowed_action=本单元结构化/自检；source_files=本Step§1及上述前序。

### ADR-MP-001 结构化、回填与停审

单一市场责任边界、分离Web/API/Worker：U1～7共享市场不变量，UI只展示/发意图，API受理，Worker推进耐久责任；长期防止多运行入口产生第二truth。

回填草稿：仅摘录已确认决策与映射，不加新合同。自检：长期意义、来源/取舍回指、前序停审及未新增结论通过；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及上述前序。

### ADR-MP-002 问题、诊断与取舍

前序Step05/08；FR101/103/201、BR104/202、VETO1；R-MP-1。问题：材料修订如何不换掉已审基线？诊断：复制或覆盖会断来源。取舍：owner immutable引用，修订新依据。

思考done；gate_status=pass；next_allowed_action=本单元结构化/自检；source_files=本Step§1及上述前序。

### ADR-MP-002 结构化、回填与停审

不可变owner引用与固定申请基线：U1核验，U2固定submitted基线，U3市场版本绑定exact来源；不复制正文/重算digest；长期保护同一审核对象。

回填草稿：仅摘录已确认决策与映射，不加新合同。自检：长期意义、来源/取舍回指、前序停审及未新增结论通过；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及上述前序。

### ADR-MP-003 问题、诊断与取舍

前序Step05/08/09；FR202/203、BR201/204、VETO2；R-MP-2。问题：可读摘要可否准入？诊断：缺outcome/binding不能证明批准。取舍：仅正式approved且适用、失效可核验，未闭合blocked。

思考done；gate_status=pass；next_allowed_action=本单元结构化/自检；source_files=本Step§1及上述前序。

### ADR-MP-003 结构化、回填与停审

正式Governance批准及适用binding唯一：U2局部handoff≠approval，U3有据显式处置；scan/signature/ACK/waived不可替代；MP-UP-002保留。

回填草稿：仅摘录已确认决策与映射，不加新合同。自检：长期意义、来源/取舍回指、前序停审及未新增结论通过；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及上述前序。

### ADR-MP-004 问题、诊断与取舍

前序Step05/08/09；FR303/401～403、BR303/401/402/404、VETO3/4；R-MP-3/4。问题：免费或UI选择可否直接安装？诊断：资格与receiver执行分属不同truth。取舍：当前gate、exact版本、正式receiver。

思考done；gate_status=pass；next_allowed_action=本单元结构化/自检；source_files=本Step§1及上述前序。

### ADR-MP-004 结构化、回填与停审

当前资格与exact分发，不拥有安装/财务：U4只本地关系/意图/attempt/映射结果，不installed/paid；无Billing无transaction写路径；长期防止产品词扩大authority。

回填草稿：仅摘录已确认决策与映射，不加新合同。自检：长期意义、来源/取舍回指、前序停审及未新增结论通过；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及上述前序。

### ADR-MP-005 问题、诊断与取舍

前序Step08/09/10；BR403/504/505、NFR-G02、AC403/G02；R-MP-4/5。问题：崩溃和超时如何不重复副作用？诊断：新意图盲重试或缺audit/backlog会失责。取舍：局部原子、原结果重放、未知先probe。

思考done；gate_status=pass；next_allowed_action=本单元结构化/自检；source_files=本Step§1及上述前序。

### ADR-MP-005 结构化、回填与停审

局部原子责任、完整原结果与externalunknown核对：accepted变化+安全审计+完整原结果+耐久待交接责任同局部事务；同key不同intent冲突；外部无probe等待正式人工依据，不承诺跨owner事务。

回填草稿：仅摘录已确认决策与映射，不加新合同。自检：长期意义、来源/取舍回指、前序停审及未新增结论通过；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及上述前序。

### ADR-MP-006 问题、诊断与取舍

前序Step08/09；FR501/502、BR501/502/503、AC501/502、VETO5；R-MP-5。问题：撤回与worker竞争如何处理？诊断：等通知后再封锁会放行新获取。取舍：撤回commit后拒新受理，未派发再核验，既有未知纳影响。

思考done；gate_status=pass；next_allowed_action=本单元结构化/自检；source_files=本Step§1及上述前序。

### ADR-MP-006 结构化、回填与停审

撤回与新获取同局部序列化、已知影响增量收束：U3/U4/U5同市场处置边界；迟到确认增量补关系/通知，不声称全安装或全局即时撤销；外围失败不复活版本。

回填草稿：仅摘录已确认决策与映射，不加新合同。自检：长期意义、来源/取舍回指、前序停审及未新增结论通过；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及上述前序。

### ADR-MP-007 问题、诊断与取舍

前序Step05/08/09/12；FR301～303、BR301/302、NFR302/303、AC302/303、VETO3。问题：搜索可否成为资格truth？诊断：count/suggest/history也会泄漏。取舍：visibility交集、opaque resolver、当前gate、正式来源重建。

思考done；gate_status=pass；next_allowed_action=本单元结构化/自检；source_files=本Step§1及上述前序。

### ADR-MP-007 结构化、回填与停审

范围安全且不反写的可重建读取投影：U7派生自已提交U1～6事实及qualified owner安全快照；query无业务写、projection不自证；长期隔离读取优化和authority。

回填草稿：仅摘录已确认决策与映射，不加新合同。自检：长期意义、来源/取舍回指、前序停审及未新增结论通过；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及上述前序。

### ADR-MP-008 问题、诊断与取舍

前序Step08/09/12；FR503/504、BR504/505、AC503/504、VETO1/5；R-MP-5/7。问题：日志或ACK可否证明已归档恢复？诊断：局部事实、外部准入和证据不同。取舍：safe audit/恢复意图、外部qualified结果独立。

思考done；gate_status=pass；next_allowed_action=本单元结构化/自检；source_files=本Step§1及上述前序。

### ADR-MP-008 结构化、回填与停审

安全局部审计与外部接纳独立，恢复不篡truth：U6追加局部过程；Observability准入pending、Archive无market lane；不存raw正文/secret，不反写owner或删改历史，不造evidence/signoff。

回填草稿：仅摘录已确认决策与映射，不加新合同。自检：长期意义、来源/取舍回指、前序停审及未新增结论通过；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及上述前序。

## 5. 结构化中间产物

### 正式§16需求追溯矩阵

编号完整前缀为FR/BR/AC/NFR/IF/DEP-MP；U与CUT对照§6/13。每行是结构承接，不是owner资格或测试结果。

#### 功能追溯

| 需求来源 | 需求结论 / 约束 | 架构承接结果 | 承接位置 | 说明 |
|---|---|---|---|---|
| 00§9 FR-MP-101 来源资格核验 | 核验正式类型映射、不可变ref/version/digest/visibility与发布资格；缺失/冲突不放行 | U1来源核验；CUT-MP-1；ADR-MP-002 | §6/9/10/13/17 | 规则/AC映射继承00§16，positive资格不由追溯关闭 |
| 00§9 FR-MP-102 发布责任绑定 | 绑定正式主体/组织验证与授权，形成publisher relation而非身份truth | U1发布责任关联；CUT-MP-1；ADR-MP-002 | §4/6/9/13/17 | 规则/AC映射继承00§16，positive资格不由追溯关闭 |
| 00§9 FR-MP-103 审核材料边界 | 消费适用签名/扫描/SBOM/兼容材料引用及安全摘要，错类型/过期/失败保留缺口 | U1安全材料引用；CUT-MP-1；ADR-MP-002/003 | §6/9/10/13/17 | 规则/AC映射继承00§16，positive资格不由追溯关闭 |
| 00§9 FR-MP-201 受控申请基线 | 固定经核验来源、责任、材料与范围，修订需可追溯新基线 | U2固定申请；CUT-MP-2；ADR-MP-002 | §6/9/10/13/17 | 规则/AC映射继承00§16，positive资格不由追溯关闭 |
| 00§9 FR-MP-202 正式审核交接 | 交接申请并消费正式决定与适用binding，未匹配/未知不产生approval | U2正式审核交接；CUT-MP-2；ADR-MP-003 | §6/9/10/13/17 | 规则/AC映射继承00§16，positive资格不由追溯关闭 |
| 00§9 FR-MP-203 市场上架处置 | 有效批准及当前资格下显式维护listing/market version可用性，失效或撤销停新分发 | U2依据→U3有据市场处置；CUT-MP-2；ADR-MP-003/006 | §6/9/10/13/17 | 规则/AC映射继承00§16，positive资格不由追溯关闭 |
| 00§9 FR-MP-301 目录分类与可见搜索 | 关键词/五类/分类/标签的范围内稳定分页，空与失败可判别、不泄漏 | U3目录truth与U7范围安全投影；CUT-MP-3；ADR-MP-007 | §6/9/10/13/17 | 规则/AC映射继承00§16，positive资格不由追溯关闭 |
| 00§9 FR-MP-302 来源与版本详情 | 展示可证明来源、市场/owner版本、材料状态与限制，不伪造预览评分 | U3版本详情与U7安全摘要；CUT-MP-3；ADR-MP-007 | §6/9/10/13/17 | 规则/AC映射继承00§16，positive资格不由追溯关闭 |
| 00§9 FR-MP-303 明确版本选择 | 确切市场版本绑定来源版本，无可用/撤回/失效不静默换最新 | U3 exact市场/来源版本绑定；CUT-MP-3；ADR-MP-004/007 | §6/9/10/13/17 | 规则/AC映射继承00§16，positive资格不由追溯关闭 |
| 00§9 FR-MP-401 获取资格视图 | 按当前来源/授权/市场版本及未撤回资格判断可获取、拒绝或未知 | U4当前资格核验；CUT-MP-4；ADR-MP-004 | §6/9/10/13/17 | 规则/AC映射继承00§16，positive资格不由追溯关闭 |
| 00§9 FR-MP-402 受控分发关系 | exact版本/receiver/意图成立时形成局部关系与交接过程，缺合同不派发 | U4分发意图/关系/attempt；CUT-MP-4；ADR-MP-004/005/006 | §6/9/10/13/17 | 规则/AC映射继承00§16，positive资格不由追溯关闭 |
| 00§9 FR-MP-403 接收结果对账 | 只采纳匹配intent/version/consumer/receiver/scope的正式结果，未知先对账 | U4同意图receiver结果映射/unknown核对；CUT-MP-4；ADR-MP-004/005 | §6/9/10/13/17 | 规则/AC映射继承00§16，positive资格不由追溯关闭 |
| 00§9 FR-MP-501 撤回与资格限制 | 有正式处置依据撤回/限制，资格失效限制新分发，不伪造外部撤销 | U5处置约束U3/U4新获取；CUT-MP-5；ADR-MP-006 | §6/9/10/13/17 | 规则/AC映射继承00§16，positive资格不由追溯关闭 |
| 00§9 FR-MP-502 影响识别与通知 | 枚举已知版本关系与未知交接，形成影响缺口/通知计划/attempt/结果 | U5已知影响/未知交接/迟到补充/通知；CUT-MP-5；ADR-MP-006 | §6/9/10/13/17 | 规则/AC映射继承00§16，positive资格不由追溯关闭 |
| 00§9 FR-MP-503 局部审计与安全交接 | 关键变更及来源可追溯，外部准入/脱敏/接收失败不冒充完成 | U6局部安全审计与外部接纳分离；CUT-MP-6；ADR-MP-005/008 | §6/9/10/13/17 | 规则/AC映射继承00§16，positive资格不由追溯关闭 |
| 00§9 FR-MP-504 受控失败恢复 | 原意图对账/重试、授权局部派生重建，不能改外部truth或盲重放副作用 | U6原意图恢复与U7有源重建；CUT-MP-6/7；ADR-MP-005/007/008 | §6/9/10/13/17 | 规则/AC映射继承00§16，positive资格不由追溯关闭 |

#### 规则追溯

| 需求来源 | 需求结论 / 约束 | 架构承接结果 | 承接位置 | 说明 |
|---|---|---|---|---|
| 00§10 BR-MP-101 | owner类型/ref/version/digest/visibility/资格一致可核验；展示标签不自定义上游enum | U1 immutable来源核验；ADR-MP-002；CUT-MP-1 | §4/6/9/10/13/17 | 独立规则承接，不以FR数量代替 |
| 00§10 BR-MP-102 | publisher relation不产生身份、组织认证或授权，系统actor不豁免scope | U1责任关联非认证、全actor同scope；ADR-MP-002；CUT-MP-1 | §4/6/9/10/13/17 | 独立规则承接，不以FR数量代替 |
| 00§10 BR-MP-103 | 签名、扫描、材料或ACK不构成Governance approval | U1材料≠U2批准；ADR-MP-003；CUT-MP-1/2 | §4/6/9/10/13/17 | 独立规则承接，不以FR数量代替 |
| 00§10 BR-MP-104 | 来源/材料/责任基线变更须重核验并保留旧依据，不覆盖已提交申请 | U1重核验、U2新基线保留旧依据；ADR-MP-002；CUT-MP-1/2 | §4/6/9/10/13/17 | 独立规则承接，不以FR数量代替 |
| 00§10 BR-MP-201 | 只有有效正式批准匹配申请/来源版本/材料/scope才可上架，豁免不默认等于批准 | U2 approved适用、U3显式上架；ADR-MP-003；CUT-MP-2 | §4/6/9/10/13/17 | 独立规则承接，不以FR数量代替 |
| 00§10 BR-MP-202 | submitted基线不能就地改成另一版本，修订需新依据与复审 | U2 submitted基线不可覆盖；ADR-MP-002；CUT-MP-2 | §4/6/9/10/13/17 | 独立规则承接，不以FR数量代替 |
| 00§10 BR-MP-203 | listing/version上架、限制、撤回须有正式局部处置依据，查询不推进 | U3有据市场迁移、查询无写；ADR-MP-003/007；CUT-MP-2/3 | §4/6/9/10/13/17 | 独立规则承接，不以FR数量代替 |
| 00§10 BR-MP-204 | 不创建approval，ACK、材料齐备或摘要可读/fresh不构成批准 | U2拒绝ACK/可读性冒充批准；ADR-MP-003；CUT-MP-2 | §4/6/9/10/13/17 | 独立规则承接，不以FR数量代替 |
| 00§10 BR-MP-301 | 市场不能扩大owner/scope可见性；搜索/总数/提示/详情/历史均受约束 | U3/U7全读取visibility交集；ADR-MP-007；CUT-MP-3/7 | §4/6/9/10/13/17 | 独立规则承接，不以FR数量代替 |
| 00§10 BR-MP-302 | 查询/索引不批准、上架、获取或修truth，不凭ref字符串推scope | U7不可反写，opaque ref正式解析；ADR-MP-007；CUT-MP-3/7 | §4/6/9/10/13/17 | 独立规则承接，不以FR数量代替 |
| 00§10 BR-MP-303 | 市场版本唯一绑定不可变owner版本，不静默替换用户选择 | U3 exact不可静默latest；ADR-MP-004；CUT-MP-3 | §4/6/9/10/13/17 | 独立规则承接，不以FR数量代替 |
| 00§10 BR-MP-304 | 市场分类/metadata不并进方法库或能力池，不伪造评分、预览或兼容结论 | U3市场metadata独立、不造预览评分；ADR-MP-001/007；CUT-MP-3 | §4/6/9/10/13/17 | 独立规则承接，不以FR数量代替 |
| 00§10 BR-MP-401 | 新分发按当前来源/权限/市场版本/未撤回资格再核验，UI选择或缓存不授权 | U4当次gate且未派发再核验；ADR-MP-004/006；CUT-MP-4 | §4/6/9/10/13/17 | 独立规则承接，不以FR数量代替 |
| 00§10 BR-MP-402 | 请求/派发/ACK/接收不生成安装激活、付款或订阅truth | U4交接非安装/支付truth；ADR-MP-004；CUT-MP-4 | §4/6/9/10/13/17 | 独立规则承接，不以FR数量代替 |
| 00§10 BR-MP-403 | 同意图重复只一个局部关系与原结果，不同意图冲突；external unknown先对账 | U4完整原结果/冲突/unknown先probe；ADR-MP-005；CUT-MP-4 | §4/6/9/10/13/17 | 独立规则承接，不以FR数量代替 |
| 00§10 BR-MP-404 | 无Billing owner不接受/推断paid/settled/subscribed；免费同样受授权 | U4无Billing写面，免费同gate；ADR-MP-004；CUT-MP-4 | §4/6/9/10/13/17 | 独立规则承接，不以FR数量代替 |
| 00§10 BR-MP-501 | 有据撤回/限制停新分发，通知失败不撤销处置；来源未知限制资格而非假造外部撤销 | U5撤回commit拒新受理，通知不复活；ADR-MP-006；CUT-MP-5 | §4/6/9/10/13/17 | 独立规则承接，不以FR数量代替 |
| 00§10 BR-MP-502 | 影响仅来自已知关系/正式receiver来源，未知交接保守纳入，不声称全安装覆盖 | U5只已知关系及未知交接，迟到增量；ADR-MP-006；CUT-MP-5 | §4/6/9/10/13/17 | 独立规则承接，不以FR数量代替 |
| 00§10 BR-MP-503 | 计划/attempt/ACK不等送达/已读/已处置，不自动卸载或修改owner truth | U5 attempt非送达，不卸载；U6不回滚owner；ADR-MP-006/008；CUT-MP-5/6 | §4/6/9/10/13/17 | 独立规则承接，不以FR数量代替 |
| 00§10 BR-MP-504 | 关键变化/意图/基线/来源/结果/unknown可追溯，不伪造外部审计归档状态 | U6安全连续局部追溯；ADR-MP-005/008；CUT-MP-6 | §4/6/9/10/13/17 | 独立规则承接，不以FR数量代替 |
| 00§10 BR-MP-505 | 恢复只修授权局部派生状态或推进有依据局部处理，不由索引造truth、不删历史、不修外部truth | U6/U7授权恢复不篡truth/历史；ADR-MP-007/008；CUT-MP-6/7 | §4/6/9/10/13/17 | 独立规则承接，不以FR数量代替 |

#### 质量追溯

| 需求来源 | 需求结论 / 约束 | 架构承接结果 | 承接位置 | 说明 |
|---|---|---|---|---|
| 00§13 NFR-MP-101 核验不复制正文、泄漏secret或扩大可见性 | 只返回允许摘要；隐藏来源不泄漏正文/存在性 | U1正文排除与U3/U7visibility交集；CUT-MP-1 | §9/10/11/13 | 不编SLO、保留删除或真实run结果 |
| 00§13 NFR-MP-102 来源与责任核验基线一致 | 同意图原结果、不同意图冲突，来源变更可判别 | U1基线一致、同意图原结果/不同意图冲突；CUT-MP-1 | §9/10/11/13 | 不编SLO、保留删除或真实run结果 |
| 00§13 NFR-MP-103 来源缺口可见 | 不支持/陈旧/不可见/超时不当有效，安全原因可查 | U1安全核验缺口与unsupported/stale/unknown分层；CUT-MP-1 | §9/10/11/13 | 不编SLO、保留删除或真实run结果 |
| 00§13 NFR-MP-201 申请与上架依据一致 | 重复同申请/意图不二次上架，并发撤回不放行 | U2固定申请、U3显式有据上架及U4/U5撤回竞争；CUT-MP-2/4/5 | §9/10/11/13 | 不编SLO、保留删除或真实run结果 |
| 00§13 NFR-MP-202 申请/材料/决定/处置可追溯 | 外部unknown保留缺口、不自动上架 | U2固定申请/材料/决定绑定，U6局部追溯，unknown不自动上架；CUT-MP-2/6 | §9/10/11/13 | 不编SLO、保留删除或真实run结果 |
| 00§13 NFR-MP-301 查询有界 | 分页/明确筛选；未来声明容量profile实测，不编延迟SLO | U3/U7稳定有界分页与后续正式profile测量；CUT-MP-3 | §9/10/11/13 | 不编SLO、保留删除或真实run结果 |
| 00§13 NFR-MP-302 跨读取边界一致可见性 | 列表/总数/详情/版本/资格同scope，stale索引不泄漏或授权 | U3/U7列表/count/suggest/详情/历史一致scope与当次资格；CUT-MP-3/7 | §9/10/11/13 | 不编SLO、保留删除或真实run结果 |
| 00§13 NFR-MP-303 读取结果可判别 | empty/not-visible/missing/stale/degraded/不支持/失败分开，来源可查 | U3/U7 empty/missing/stale/degraded及不可见安全表达；CUT-MP-3/7 | §9/10/11/13 | 不编SLO、保留删除或真实run结果 |
| 00§13 NFR-MP-401 分发意图与结果稳定 | 同operation/scope/key/canonical intent重放原完整结果，不造第二关系或副作用；unknown对账 | U4 operation/scope/key/canonical intent及原完整结果重放；CUT-MP-4 | §9/10/11/13 | 不编SLO、保留删除或真实run结果 |
| 00§13 NFR-MP-402 分发责任可追溯 | intent/attempt/版本/consumer/receiver/scope及unknown可查，局部accepted不冒充外部commit | U4关系/attempt/receiver结果与externalunknown分层追溯；CUT-MP-4 | §9/10/11/13 | 不编SLO、保留删除或真实run结果 |
| 00§13 NFR-MP-501 撤回/影响/通知一致 | 停新分发语义一致，稳定影响枚举去重、通知重试同意图 | U5处置先停新发、影响增量去重、通知原意图重试；CUT-MP-4/5 | §9/10/11/13 | 不编SLO、保留删除或真实run结果 |
| 00§13 NFR-MP-502 局部与外部状态独立 | 范围缺口/unknown/人工介入可查，不泄漏敏感材料 | U5/U6局部影响/通知/恢复与外部结果独立及安全原因；CUT-MP-5/6 | §9/10/11/13 | 不编SLO、保留删除或真实run结果 |
| 00§13 NFR-MP-503 故障不恢复风险分发 | 通道/审计失败不放行新获取；恢复不改外部truth/历史 | U5不因通道/audit失败复活，U6恢复不反写owner/历史；CUT-MP-5/6 | §9/10/11/13 | 不编SLO、保留删除或真实run结果 |
| 00§13 NFR-MP-G01 全入口同authority与正文排除 | Web/API/后台、public/组织、正常/恢复不能扩大scope；配置不能跳过gate | U1～7所有入口同authority/scope与全材料正文排除；CUT-MP-1/2/3/4/5/6/7 | §9/10/11/13 | 不编SLO、保留删除或真实run结果 |
| 00§13 NFR-MP-G02 关键局部变更与追溯/待交接责任一致 | metadata唯一、原结果可重放、不同意图冲突，externalunknown独立；无跨owner事务 | U1/U2/U4/U5/U6局部accepted、审计、完整原结果、待交接责任原子；CUT-MP-1/2/4/5/6 | §9/10/11/13 | 不编SLO、保留删除或真实run结果 |
| 00§13 NFR-MP-G03 查询/维护/外部等待有界 | 明确范围/分页/超时与失败结果；停新分发不等全部通知；容量测量后确认SLO | U3/U5/U6/U7查询/枚举/重建/等待有界，外围失败不复活；CUT-MP-3/5/6/7 | §9/10/11/13 | 不编SLO、保留删除或真实run结果 |
| 00§13 NFR-MP-G04 默认英文、中英文切换状态语义一致 | ref/编号/资格不随locale变化；空/加载/拒绝/unknown可辨，无伪预览/评分或运行证据，安全trace不泄漏 | Web/API/Worker英文默认/双语状态语义一致，安全trace与真实性边界；CUT-MP-3/4/7 | §9/10/11/13 | 不编SLO、保留删除或真实run结果 |

#### 验收追溯

| 需求来源 | 需求结论 / 约束 | 架构承接结果 | 承接位置 | 说明 |
|---|---|---|---|---|
| 00§14 AC-MP-101 来源与责任资格 | 有效合同绑定才可进入申请；owner/type/ref/version/digest/visibility或主体/组织/scope不匹配不放行 | U1正式来源/责任绑定及正文排除；CUT-MP-1 | §9/10/13 | 为05/06验收与证据切口；当前未执行 |
| 00§14 AC-MP-102 材料与基线 | 正确适用材料可审查；missing/wrong-kind/stale/失败为缺口；变更重核验，正文/凭据不保存 | U1安全材料引用及基线变更重核验；CUT-MP-1 | §9/10/13 | 为05/06验收与证据切口；当前未执行 |
| 00§14 AC-MP-103 核验失败/重试 | 缺来源不冒充有效，duplicate不建第二责任记录，结果/基线可追溯 | U1原意图核验与缺口可见；CUT-MP-1 | §9/10/13 | 为05/06验收与证据切口；当前未执行 |
| 00§14 AC-MP-201 申请与受控上架 | C1资格、有效正式批准及申请/版本/材料/scope绑定均有效才显式上架 | U2固定基线与U3完整有效批准后的显式上架；CUT-MP-2/4/5 | §9/10/13 | 为05/06验收与证据切口；当前未执行 |
| 00§14 AC-MP-202 决定边界 | 错版本/scope/旧材料/waived/superseded/revoked/扫描或ACK均不冒充批准；不覆盖旧基线/决定 | U2依据绑定与ACK/waived/失效决定拒绝；CUT-MP-2/6 | §9/10/13 | 为05/06验收与证据切口；当前未执行 |
| 00§14 AC-MP-203 上架重试/并发 | 同意图一个结果，撤回后stale上架不放行新分发；unknown追溯可查 | U2/U3局部幂等处置及U4/U5撤回栅栏；CUT-MP-2/4/5 | §9/10/13 | 为05/06验收与证据切口；当前未执行 |
| 00§14 AC-MP-301 目录发现 | 五类正式映射、同类多listing、多版本可区分；搜索/详情只返当前范围可证明内容 | U3 taxonomy与U7范围内稳定分页、五类及多版本区分；CUT-MP-3 | §9/10/13 | 为05/06验收与证据切口；当前未执行 |
| 00§14 AC-MP-302 可见性与只读 | 跨scope/隐藏/受限/撤回的总数/提示/详情/历史不泄漏；查询/重建不反写truth | U3/U7全读取visibility交集、query无业务写、有源重建；CUT-MP-3/7 | §9/10/13 | 为05/06验收与证据切口；当前未执行 |
| 00§14 AC-MP-303 版本与读取结果 | 无可用/陈旧/失效不换最新或承诺可获取；分页去重稳定，empty/degraded可判别 | U3 exact选择与U7 empty/stale/degraded判别；CUT-MP-3/7 | §9/10/13 | 为05/06验收与证据切口；当前未执行 |
| 00§14 AC-MP-401 受控获取 | 当前资格+exact版本+receiver合同才建立分发；无授权/撤回/来源不可用拒绝，免费同gate | U4当前资格/exact版本/receiver绑定，免费同gate；CUT-MP-4 | §9/10/13 | 为05/06验收与证据切口；当前未执行 |
| 00§14 AC-MP-402 接收结果 | 仅匹配intent/version/consumer/receiver/scope结果可映射；ACK不显示installed/paid，视图不造authority | U4匹配正式receiver结果映射、ACK非安装/财务；CUT-MP-4 | §9/10/13 | 为05/06验收与证据切口；当前未执行 |
| 00§14 AC-MP-403 分发失败/重试 | 同意图原结果、不重复副作用，不同意图冲突；超时/取消竞争/乱序保持实际来源结果或unknown | U4完整原结果、冲突、取消竞争及unknown原意图核对；CUT-MP-4 | §9/10/13 | 为05/06验收与证据切口；当前未执行 |
| 00§14 AC-MP-501 撤回与停新分发 | 有据撤回停止新获取；资格未知限制，通知不可用不恢复获取 | U5有据处置、U3/U4同局部序列化及未派发再核验；CUT-MP-4/5 | §9/10/13 | 为05/06验收与证据切口；当前未执行 |
| 00§14 AC-MP-502 影响与通知 | 已知exact关系及unknown交接纳入影响，范围缺口明确；计划/attempt/送达/unknown分开，不承诺全安装覆盖 | U5已知关系/unknown/迟到增补、计划attempt与receipt分层；CUT-MP-5/6 | §9/10/13 | 为05/06验收与证据切口；当前未执行 |
| 00§14 AC-MP-503 安全审计 | 关键变化及恢复可追溯，准入/脱敏/接收失败可判别；local history与外部完成分开 | U6局部原子安全审计与外部准入/结果独立；CUT-MP-5/6 | §9/10/13 | 为05/06验收与证据切口；当前未执行 |
| 00§14 AC-MP-504 受控恢复 | 原意图重试，truth来源重建，不改外部truth/历史；unknown先对账，不造成功 | U6原意图恢复与U7从committed facts/qualified source重建；CUT-MP-6/7 | §9/10/13 | 为05/06验收与证据切口；当前未执行 |
| 00§14 AC-MP-G01 全入口gate | 全scope及正常/恢复入口不扩大权限/visibility或绕审核，正文/credential不进入truth/索引/日志/事件/报告 | U1～7所有入口同authority/scope与全材料正文排除；CUT-MP-1/2/3/4/5/6/7 | §9/10/13 | 为05/06验收与证据切口；当前未执行 |
| 00§14 AC-MP-G02 局部一致性 | 变更/历史/待交接责任一致，原完整结果可重放，metadata唯一，外部unknown独立、无跨owner事务 | U1/U2/U4/U5/U6局部accepted、审计、完整原结果、待交接责任原子；CUT-MP-1/2/4/5/6 | §9/10/13 | 为05/06验收与证据切口；当前未执行 |
| 00§14 AC-MP-G03 有界处理 | 查询/维护/等待有声明范围及超限/失败；外围故障不使撤回等待或复活；性能需正式profile测量 | U3/U5/U6/U7查询/枚举/重建/等待有界，外围失败不复活；CUT-MP-3/5/6/7 | §9/10/13 | 为05/06验收与证据切口；当前未执行 |
| 00§14 AC-MP-G04 体验与真实性 | 默认英文/中英文状态/ref/编号/资格一致，空/加载/拒绝/未知可辨，安全追溯可查，无伪造演示内容或证据 | Web/API/Worker英文默认/双语状态语义一致，安全trace与真实性边界；CUT-MP-3/4/7 | §9/10/13 | 为05/06验收与证据切口；当前未执行 |

#### 接口追溯

| 需求来源 | 需求结论 / 约束 | 架构承接结果 | 承接位置 | 说明 |
|---|---|---|---|---|
| 00§12 IF-MP-101 来源/责任/材料申明 | 受控提交可验证引用，不创建外部truth（FR101～103） | U1受控申明 | §8/10 | 能力面不是API已存在声明；03绑定exact合同 |
| 00§12 IF-MP-102 资格与材料缺口 | 范围内安全摘要（FR101～103） | U1核验缺口读取 | §8/10 | 能力面不是API已存在声明；03绑定exact合同 |
| 00§12 IF-MP-201 申请/终止与上架处置 | 有依据的申请及局部状态（FR201/203） | U2申请/终止、U3有据上架 | §8/10 | 能力面不是API已存在声明；03绑定exact合同 |
| 00§12 IF-MP-202 进展与处置依据 | 交接缺口、正式决定引用及局部结果（FR201～203） | U2/U3过程读取 | §8/10 | 能力面不是API已存在声明；03绑定exact合同 |
| 00§12 IF-MP-301 可见发现与详情 | 目录、搜索、来源/版本安全摘要（FR301/302） | U3/U7可见发现 | §8/10 | 能力面不是API已存在声明；03绑定exact合同 |
| 00§12 IF-MP-302 版本选择资格 | 明确版本及当前资格说明（FR303） | U3 exact选择资格 | §8/10 | 能力面不是API已存在声明；03绑定exact合同 |
| 00§12 IF-MP-303 目录重建/对账 | 只维护局部派生读取（FR301/302） | U7有源后台重建 | §8/10 | 能力面不是API已存在声明；03绑定exact合同 |
| 00§12 IF-MP-401 获取/取消意图 | 受控局部关系，不自动回滚外部（FR401/402） | U4获取/取消意图 | §8/10 | 能力面不是API已存在声明；03绑定exact合同 |
| 00§12 IF-MP-402 获取资格/关系/结果 | 自己/组织范围状态（FR401～403） | U4范围内关系/结果 | §8/10 | 能力面不是API已存在声明；03绑定exact合同 |
| 00§12 IF-MP-403 接收映射与对账 | 同意图版本正式结果、unknown对账（FR403） | U4接收映射/原意图核对 | §8/10 | 能力面不是API已存在声明；03绑定exact合同 |
| 00§12 IF-MP-501 撤回/限制与来源映射 | 有authority的局部处置（FR501） | U5有据处置 | §8/10 | 能力面不是API已存在声明；03绑定exact合同 |
| 00§12 IF-MP-502 影响/通知/审计/恢复 | 安全范围内局部与外部状态分层（FR502～504） | U5/U6影响/审计/恢复读取 | §8/10 | 能力面不是API已存在声明；03绑定exact合同 |
| 00§12 IF-MP-503 影响枚举与交接恢复 | 授权局部计划、通知/审计交接、对账（FR502～504） | U5/U6局部枚举与交接恢复 | §8/10 | 能力面不是API已存在声明；03绑定exact合同 |
| 00§12 IF-MP-504 安全市场变化提示 | 正式schema/消费合同后才启用（FR501～503） | 条件安全变化提示；无canonical合同当前不开producer | §8/10 | 能力面不是API已存在声明；03绑定exact合同 |

#### 依赖追溯

| 需求来源 | 需求结论 / 约束 | 架构承接结果 | 承接位置 | 说明 |
|---|---|---|---|---|
| 00§12 DEP-MP-101 | DEP-MP-101：正式来源/材料/可见性（FR101/103） | 输入 / 定义来源依赖 / 方法库/Hub/Images/Artifact；运行期，经SDK | §5/8/10 | 经SDK正式能力接缝；缺qualification挂起§15 |
| 00§12 DEP-MP-102 | DEP-MP-102：正式主体、组织、scope依据（FR102） | 输入 / 外部能力依赖 / publisher验证/授权owner待定；不适用 | §5/8/10 | 经SDK正式能力接缝；缺qualification挂起§15 |
| 00§12 DEP-MP-201 | DEP-MP-201：批准及适用binding（FR202/203） | 输入 / 治理结论依赖 / Governance；运行期/条件事件 | §5/8/10 | 经SDK正式能力接缝；缺qualification挂起§15 |
| 00§12 DEP-MP-202 | DEP-MP-202：正式申请接收，不是本地批准（FR202） | 输出 / 外部能力依赖 / Governance；运行期 | §5/8/10 | 经SDK正式能力接缝；缺qualification挂起§15 |
| 00§12 DEP-MP-301 | DEP-MP-301：摘要/visibility/资格（FR301～303） | 输入 / 定义来源依赖 / 各资产owner；运行期，经SDK | §5/8/10 | 经SDK正式能力接缝；缺qualification挂起§15 |
| 00§12 DEP-MP-302 | DEP-MP-302：正式scope，不由ID或UI推断（FR301～303） | 输入 / 外部能力依赖 / 读取授权owner待定；不适用 | §5/8/10 | 经SDK正式能力接缝；缺qualification挂起§15 |
| 00§12 DEP-MP-401 | DEP-MP-401：正式获取资格（FR401） | 输入 / 外部能力依赖 / 获取授权owner待定；不适用 | §5/8/10 | 经SDK正式能力接缝；缺qualification挂起§15 |
| 00§12 DEP-MP-402 | DEP-MP-402：可交付ref与intent/版本接收合同（FR402/403） | 输出 / 下游消费依赖 / 各类型正式receiver待绑定；运行期候选 | §5/8/10 | 经SDK正式能力接缝；缺qualification挂起§15 |
| 00§12 DEP-MP-501 | DEP-MP-501：正式处置/资格失效依据（FR501） | 输入 / 治理结论/定义来源依赖 / Gov/资产owner；运行期/条件事件 | §5/8/10 | 经SDK正式能力接缝；缺qualification挂起§15 |
| 00§12 DEP-MP-502 | DEP-MP-502：通知结果与unknown边界（FR502） | 输出 / 下游消费依赖 / 通知通道/receiver owner待绑定；运行期候选 | §5/8/10 | 经SDK正式能力接缝；缺qualification挂起§15 |
| 00§12 DEP-MP-503 | DEP-MP-503：producer准入及安全材料接收（FR503/504） | 输出 / 下游消费依赖 / Observability；运行期/条件事件 | §5/8/10 | 经SDK正式能力接缝；缺qualification挂起§15 |

#### 数据、红线与上位约束追溯

| 需求来源 | 需求结论 / 约束 | 架构承接结果 | 承接位置 | 说明 |
|---|---|---|---|---|
| 00§11 D101/201/202/301/401/501/502 | 六类市场局部truth | U1责任/U2申请/U3目录版本/U4关系/U5影响通知/U6审计恢复 | §6/9；ADR-MP-001/002/005/006/008 | 分类真相唯一；对象细化由02/03承接 |
| 00§11 D102/303/203/402/503引用部分 | 外部来源与结果正式owner | U7 body-free引用，U1～6关联不接管 | §4/6/9；ADR-MP-002/003/004/008 | Gov/材料/receiver/notice/audit不变成本仓truth |
| 00§11 D103/203/302/403/504快照部分 | 安全摘要可失效、有源重建 | U7 freshness/范围读取，当前资格另核验 | §6/9/13；ADR-MP-007 | 窄entitlement仅快照，不有transaction写主体 |
| 00§11 D104/204/304/404/505 | 禁止正文/secret/财务/安装/归档包 | 所有写入/索引/日志/事件/报告/恢复排除 | §4/9/13；CUT-MP-1/4/6/7 | 不复制后重算digest |
| 00§14 VETO-MP-1 | 不复制truth或造资质 | U1/6/7引用边界、正文排除 | §4/9/13；ADR-MP-002/008 | CUT-MP-1/6/7 |
| 00§14 VETO-MP-2 | 不自造/误用批准 | U2正式binding，U3有据处置 | §9/10；ADR-MP-003 | CUT-MP-2 |
| 00§14 VETO-MP-3 | 不绕scope/撤回 | U3/U7范围安全、U4当前gate | §9/10；ADR-MP-004/006/007 | CUT-MP-3/4/5/7 |
| 00§14 VETO-MP-4 | 获取ACK不等安装/付款 | U4 receiver/财务边界 | §4/9/10；ADR-MP-004 | CUT-MP-4 |
| 00§14 VETO-MP-5 | 撤回后不新发、不造外部结果或改历史 | U5序列化与U6受控恢复 | §9/10；ADR-MP-005/006/008 | CUT-MP-4/5/6 |
| 00§4 MK2/ISO29110 | 格式要求保留但类型/owner未闭合 | §15显式包owner/适用挂起 | §3/15 | 不能用列表UI证明合规 |
| 全局依赖§4.1/5/6、仓库拆分§9.2/十 | Layer5窗口、Core/SDK编译、owner运行/条件事件、Rust/Vue | §8三类裁剪、SDK接缝与§11当前约束 | §3/8/11 | TS/React变更仍MP-SRC-003，不造新ADR |

### 漏项检查表

| 追溯缺口类型 | 对象 / 缺口 | 影响范围 | 当前状态 | 说明 |
|---|---|---|---|---|
| 正向合同资格未闭环 | MP-UP-001～005/007/008及MP-SRC-010 | 发布/审核/获取/通知/外部审计 | 架构责任有映射，owner qualification未闭合 | 不能将拒绝测试当真实集成 |
| owner来源未闭环 | MP-UP-006、MP-SRC-013 | 财务/联合包/29110适用 | future/blocker有表达，正向无授权来源 | 非核心局部模块漏建 |
| 受控变更来源未闭环 | MP-SRC-003 | 替换Rust/Vue路线 | 当前遵上位，draft变更未闭合 | 不以讨论推荐补正式依据 |
| 定量来源未闭环 | Q-MP-01 | 容量/SLO/保留删除 | 有界架构承接，数值基线未闭合 | 无主观数字 |

### 正式§17 ADR索引

| ADR 编号 | 架构决策 | 解决的问题 | 关联主线 | 说明 |
|---|---|---|---|---|
| ADR-MP-001 | 单一市场责任边界、分离Web/API/Worker | UI与后台是否拆为两个truth项目？ | 边界与承载 | U1～7共享市场不变量，UI只展示/发意图，API受理，Worker推进耐久责任；长期防止多运行入口产生第二truth。 |
| ADR-MP-002 | 不可变owner引用与固定申请基线 | 材料修订如何不换掉已审基线？ | 来源与基线 | U1核验，U2固定submitted基线，U3市场版本绑定exact来源；不复制正文/重算digest；长期保护同一审核对象。 |
| ADR-MP-003 | 正式Governance批准及适用binding唯一 | 可读摘要可否准入？ | 治理承接 | U2局部handoff≠approval，U3有据显式处置；scan/signature/ACK/waived不可替代；MP-UP-002保留。 |
| ADR-MP-004 | 当前资格与exact分发，不拥有安装/财务 | 免费或UI选择可否直接安装？ | 版本/资格/分发 | U4只本地关系/意图/attempt/映射结果，不installed/paid；无Billing无transaction写路径；长期防止产品词扩大authority。 |
| ADR-MP-005 | 局部原子责任、完整原结果与externalunknown核对 | 崩溃和超时如何不重复副作用？ | 一致性/恢复 | accepted变化+安全审计+完整原结果+耐久待交接责任同局部事务；同key不同intent冲突；外部无probe等待正式人工依据，不承诺跨owner事务。 |
| ADR-MP-006 | 撤回与新获取同局部序列化、已知影响增量收束 | 撤回与worker竞争如何处理？ | 撤回/影响 | U3/U4/U5同市场处置边界；迟到确认增量补关系/通知，不声称全安装或全局即时撤销；外围失败不复活版本。 |
| ADR-MP-007 | 范围安全且不反写的可重建读取投影 | 搜索可否成为资格truth？ | 读取/数据归属 | U7派生自已提交U1～6事实及qualified owner安全快照；query无业务写、projection不自证；长期隔离读取优化和authority。 |
| ADR-MP-008 | 安全局部审计与外部接纳独立，恢复不篡truth | 日志或ACK可否证明已归档恢复？ | 追溯/外部交接 | U6追加局部过程；Observability准入pending、Archive无market lane；不存raw正文/secret，不反写owner或删改历史，不造evidence/signoff。 |

这是本轮架构决定索引，来源均为前序已停审结论；八项各自小循环见本Step，等待01正式用户审查，不代表owner确认、signoff或已有ADR文件。Rust/Vue上位约束与PostgreSQL承载方向不扩充为机制清单型ADR。

### 跨ADR/需求追溯审计

| 检查 | 结果 |
|---|---|
| 核心需求孤儿 | 16FR逐行映射；五能力及11US由00§16继承，无新增需求 |
| 约束/验收孤儿 | 21BR、17NFR、20AC、14IF、11DEP逐行；21D来源组在四类别及六truth主体中映射；5VETO逐行 |
| 架构孤儿 | U1～7各有FR/数据及CUT；八ADR回指Step03/05/06/08/09/11/12和需求/风险 |
| 普通实现或未确认新决定 | 未入ADR；栈替换、财务、包、Archive扩展保留§15 |
| 证据断层 | CUT仅未来验证切口，当前不生成evidence/verdict/signoff |


## 6. 复杂度判断

八个长期决定已逐项分批思考/结构化/停审；全量编号映射与跨单元审计完成，不新增机制或关闭合同。

## 7. 后置历史差异审计

旧01仅作污染审计，位置/口径见Step01§7；本Step由当前需求与前序独立推导，不继承旧代码组织、数字、安装/支付或自造审核。

## 8. 回填草稿

正式对应章节摘录§5已收束表与边界说明；不复制问题回答/诊断，不新增合同或运行事实。具体回填范围见本Step结构化产物。

## 9. 自检与停审

来源、责任唯一、依赖方向、数据分类、conditional合同、正文排除及本Step层次审查通过；无越界代码/schema/表结构，无新增运行/evidence。计划八项done；问题回答→诊断→取舍→结构化分批形成。

| 单元 | 思考/写入/自检 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| 本Step已列单元 | done/done/done | pass | 已逐项自检与stop_review，外部positive缺口不关闭 | 下一Step；正式装配限Step16 | §1输入及§5结构化产物 |

### 单元执行台账收口

| 单元 | 思考 | 写入 | 自检 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|---|---|
| ADR-MP-001 | done | done | done | pass | 本单元小循环stop_review；外部qualification不关闭 | 本Step跨单元审计；通过后限前序flow许可 | 本Step§1、ADR-MP-001小循环、§5 |
| ADR-MP-002 | done | done | done | pass | 本单元小循环stop_review；外部qualification不关闭 | 本Step跨单元审计；通过后限前序flow许可 | 本Step§1、ADR-MP-002小循环、§5 |
| ADR-MP-003 | done | done | done | pass | 本单元小循环stop_review；外部qualification不关闭 | 本Step跨单元审计；通过后限前序flow许可 | 本Step§1、ADR-MP-003小循环、§5 |
| ADR-MP-004 | done | done | done | pass | 本单元小循环stop_review；外部qualification不关闭 | 本Step跨单元审计；通过后限前序flow许可 | 本Step§1、ADR-MP-004小循环、§5 |
| ADR-MP-005 | done | done | done | pass | 本单元小循环stop_review；外部qualification不关闭 | 本Step跨单元审计；通过后限前序flow许可 | 本Step§1、ADR-MP-005小循环、§5 |
| ADR-MP-006 | done | done | done | pass | 本单元小循环stop_review；外部qualification不关闭 | 本Step跨单元审计；通过后限前序flow许可 | 本Step§1、ADR-MP-006小循环、§5 |
| ADR-MP-007 | done | done | done | pass | 本单元小循环stop_review；外部qualification不关闭 | 本Step跨单元审计；通过后限前序flow许可 | 本Step§1、ADR-MP-007小循环、§5 |
| ADR-MP-008 | done | done | done | pass | 本单元小循环stop_review；外部qualification不关闭 | 本Step跨单元审计；通过后限前序flow许可 | 本Step§1、ADR-MP-008小循环、§5 |

## 10. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01按受影响路径保留；不作为运行通过或风险接受。02及后续正式文档仍未授权。
