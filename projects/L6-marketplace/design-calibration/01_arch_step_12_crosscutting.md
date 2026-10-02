# 01 Step12 · 横切关注点

## 1. 开工确认与Step内计划

模式full-restart；当前agent单独执行；前序Step已停审。已读取架构SOP本Step、架构书写规范对应章节和通用规范适用规则。输入：Step08～11、00全部NFR/AC及VETO。输出为当前文件；正式回填仍待Step16。

计划：输入恢复→问题回答→诊断→取舍→结构化→复杂度/历史差异审计→回填草稿→自检/停审。前四项进入本批，后四项pending；未来Step不预建。

| gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|
| pass | 前序停审及用户01授权，只许可当前Step | 完成当前单元思考后才写结构化 | Step08～11、00全部NFR/AC及VETO |

## 2. SOP问题回答

六类横切均有具体适用：安全守来源/actor/scope和正文排除；审计保存基线/intent/result及局部/外部分层；观测解释pending/unknown/degraded而不作证据；韧性保持撤回及既有意图；性能使query/影响枚举/重建/等待有界；配置变更只选技术绑定和预算，不改qualified/approved。没有负载不能编SLO/保留删除数字；不能将无限job扫描称最终一致。locale贯穿表示层不得改ref/status/idempotency语义。

## 3. 输入诊断

按六类笼统写全局“安全可靠”不足；每单元需明确适用保护目标。诊断日志不可持raw error/secret，全局翻译不能把unknown翻译成“成功”；fake/原型颜色不构成业务证据。通知/观测故障不能弱化撤回gate。

## 4. 设计取舍

采用逐U1～7安全/追溯/观察/韧性/有界/配置适用与未来测试切口；不采用通用运维清单或配置开关模拟批准。无contract时只测试局部fail-closed，不宣布真实正向集成。

### U1 问题、诊断与取舍

问题/依据：C1 NFR101～103保护来源/publisher，哪些六类适用？全部作用于核验及多下游依据。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U1 结构化、回填与停审

安全：最小scope/body-free；追溯：source/version/material/publisher关联；观察：缺口/失效/不支持；韧性：source unknown不自证；有界：引用核验范围及外部等待；配置：source绑定不能任意verified。测试切口CUT-MP-1：wrong-kind/version/digest/scope、publisher缺authority、scan≠approval、禁止正文。证据上限为合同/fake局部语义，真实资质仍需owner。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U2 问题、诊断与取舍

问题/依据：C2 NFR201/202影响申请/审核/上架多链；怎样防ACK批准？有效binding在全入口一致。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U2 结构化、回填与停审

安全：actor/正式决定适用；追溯：固定基线与Gov ref；观察：待交接/contract gap/unknown；韧性：不二次申请、不超时批准；有界：审核handoff等待/核对预算；配置：无approve bypass。CUT-MP-2：旧材料/版本/scope、waived/revoked/superseded、乱序/duplicate、缺public outcome，fake不证明Governance批准。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U3 问题、诊断与取舍

问题/依据：C3 NFR301～303是否仅搜索性能？还覆盖总数/提示/版本/历史可见性。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U3 结构化、回填与停审

安全：scope交集、隐藏存在性不泄漏；追溯：exact version与freshness；观察：empty/not-visible/missing/stale/degraded区分；韧性：不silent latest、不由projection修truth；有界：分页/筛选/计数约束；配置/locale：默认英文双语但status/ref稳定。CUT-MP-3：跨scope、hidden count/suggestion/history、same-type多listing、多version、stale/rebuild/no-write、中文搜索容量profile待测。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U4 问题、诊断与取舍

问题/依据：C4 NFR401/402为何跨安全/韧性/审计？同意图重放与receiver未知贯穿多入口。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U4 结构化、回填与停审

安全：当前资格与receiver绑定；追溯：intent/attempt/consumer/version/result；观察：受理/交接/confirmed/unknown/failed可辨；韧性：原完整结果重放、unknown先probe；有界：等待/对账；配置：不能将免费/ACK变授权/installed。CUT-MP-4：same key不同intent、重复原result、wrong receiver/version/scope、取消竞争/commit未知/withdrawal fence、无Billing结果。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U5 问题、诊断与取舍

问题/依据：C5通知失败是否会逆转撤回？不能；影响范围缺口也是必须展示的观察边界。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U5 结构化、回填与停审

安全：处置authority与通知内容scope；追溯：处置依据/已知关系/迟到/attempt；观察：partial/unknown/gap/delivery独立；韧性：禁新发不等通知，原意图通知重试；有界：稳定范围枚举/去重/批次，不扫描全安装；配置：retry不复活版本。CUT-MP-5：撤回并发、迟到relation、通知故障/ACK≠送达/未知影响、不卸载/不造全覆盖。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U6 问题、诊断与取舍

问题/依据：审计/恢复为何不是一般日志？accepted审计原子和外部准入独立，恢复不能篡历史。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U6 结构化、回填与停审

安全：safe refs/原因/diagnostic，不raw body/credential；追溯：局部accepted与恢复追加；观察：external admission/unknown独立；韧性：原意图核对，历史连续；有界：恢复/审计交接预算，retention/delete authority缺则不定义purge；配置：sink失败不造成功或修改truth。CUT-MP-6：audit/backlog/result原子故障、redaction、Observability拒绝/unknown、Archive无lane、recovery不反写。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U7 问题、诊断与取舍

问题/依据：projection的六类横切如何适用而不变truth？仅scope-safe读取及有源重建。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U7 结构化、回填与停审

安全：resolver-first及摘要允许字段；追溯：generation/source freshness与局部事实回指；观察：stale/rebuilding/gap；韧性：重建失败旧安全view或degraded；有界：范围/分页/去重，不能job全仓扫；配置：阈值不扩大visibility或默认fresh。CUT-MP-7：missing rebuild input、projection不可反写、空页可见seed、safe telemetry无业务写、fake/durable边界一致。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

## 5. 结构化中间产物

### 横切关注点约束表

| 横切关注点 | 作用范围 | 约束要求 | 保护目标 | 说明 |
|---|---|---|---|---|
| 安全边界 | U1核验、U2审核、U3全读取、U4接收、U5处置、U6追溯、U7投影 | 所有入口统一authority/scope；正文与凭据不进入写入、索引、日志、事件或报告 | 唯一owner及可见性交集 | 系统actor、免费、public、恢复不豁免 |
| 审计与可追溯 | U1～6局部变化、U7来源回指 | 局部accepted、完整原结果、审计及待交接责任原子成立；外部结果独立引用 | 固定基线、原意图及来源连续 | local audit不等Observability准入或Archive接纳 |
| 可观测性 | 核验、review、query、distribution、withdrawal、notice、recovery | 缺口/拒绝/陈旧/失败/unknown独立且安全可定位；locale不改状态 | 防止展示成功掩盖业务未成立 | runtime logs不作业务证据 |
| 韧性 / 恢复能力 | U2交接、U4接收、U5通知、U6恢复、U7重建 | unknown先按原意图核对；未派发再核验；撤回不等外围恢复；派生只从正式来源重建 | 禁新分发与副作用不重复 | 无probe合同保留人工依据缺口，不盲重试 |
| 性能 / 容量约束 | U3读取、U5影响枚举、U6交接、U7重建及外部等待 | 范围/稳定分页/去重/批次/等待有界；容量profile及SLO待Q-MP-01 | 防无界放大和隐式全安装扫描 | 中文搜索性能须测量，不能用演示替代 |
| 配置与变更控制 | Web/API/Worker及SDK-owner绑定、locale、等待预算 | 配置集中声明适用范围/来源/变更影响；不能配置verified/approved/installed或扩大visibility | 正常与恢复相同gate | 原型9090和0.0.0.0不是生产默认 |

### 单元适用与后续测试切口

各U1～7六类均适用，具体判断已见逐单元记录；不能用全局表替代单元审计。

| 单元 | 特有保护对象 | 测试切口 | 未来证据上限 |
|---|---|---|---|
| U1 | 来源及publisher责任 | CUT-MP-1 错类型/版本/digest/scope、材料缺口、正文排除 | fake只证明本地核验拒绝；owner资质另证 |
| U2 | 固定基线与决定binding | CUT-MP-2 错基线/waived/revoked/乱序/ACK | 无批准合同不得宣称正向审核通过 |
| U3 | listing/版本与范围内发现 | CUT-MP-3 count/suggest/history/scope、exact选择、stale | 真实容量与可见性合同分别验证 |
| U4 | 当前资格、原意图与receiver结果 | CUT-MP-4 重放/冲突/取消/commitunknown/撤回竞争 | 不证明installed或paid |
| U5 | 禁新获取与已知影响 | CUT-MP-5 迟到关系/通知失败/ACK/影响缺口 | 不证明全安装覆盖或卸载 |
| U6 | 局部原子追溯与恢复 | CUT-MP-6 audit/result/backlog故障、脱敏、外部拒绝 | 不证明Observability/Archive接纳 |
| U7 | 有源投影与可见性 | CUT-MP-7 缺重建输入/反写/安全遥测/持久化一致 | 不从projection自证truth |

### 跨横切审计

| 检查 | 收束结果 |
|---|---|
| 模板化与遗漏 | 六类别按七单元核验；保留各单元特有对象及CUT，不下沉脚本 |
| Step08事务冲突 | 局部原子责任与跨owner unknown分开，无外部事务承诺 |
| Step09通信冲突 | local task不是canonical event；通知/审计ACK不推成功 |
| 配置与资格冲突 | 不存在approve/verified/installed bypass；栈变更仍走MP-SRC-003 |
| 证据层次 | 当前仅文档；未来prototype/fake/real integration/signoff分层，无既成结果 |

02承接对象/配置责任；03承接状态与接缝/原子故障；04实现边界；05使用CUT设计真实测试；06区分证据和签核authority。未生成测试执行或证据。

## 6. 复杂度判断

七单元分批思考/写入/停审记录已形成，已修正记录阅读顺序；六类跨单元审计无局部矛盾，外部正向qualification仍blocked。

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
| U1 | done | done | done | pass | 本单元小循环stop_review；外部qualification不关闭 | 本Step跨单元审计；通过后限前序flow许可 | 本Step§1、U1小循环、§5 |
| U2 | done | done | done | pass | 本单元小循环stop_review；外部qualification不关闭 | 本Step跨单元审计；通过后限前序flow许可 | 本Step§1、U2小循环、§5 |
| U3 | done | done | done | pass | 本单元小循环stop_review；外部qualification不关闭 | 本Step跨单元审计；通过后限前序flow许可 | 本Step§1、U3小循环、§5 |
| U4 | done | done | done | pass | 本单元小循环stop_review；外部qualification不关闭 | 本Step跨单元审计；通过后限前序flow许可 | 本Step§1、U4小循环、§5 |
| U5 | done | done | done | pass | 本单元小循环stop_review；外部qualification不关闭 | 本Step跨单元审计；通过后限前序flow许可 | 本Step§1、U5小循环、§5 |
| U6 | done | done | done | pass | 本单元小循环stop_review；外部qualification不关闭 | 本Step跨单元审计；通过后限前序flow许可 | 本Step§1、U6小循环、§5 |
| U7 | done | done | done | pass | 本单元小循环stop_review；外部qualification不关闭 | 本Step跨单元审计；通过后限前序flow许可 | 本Step§1、U7小循环、§5 |

## 10. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01按受影响路径保留；不作为运行通过或风险接受。02及后续正式文档仍未授权。
