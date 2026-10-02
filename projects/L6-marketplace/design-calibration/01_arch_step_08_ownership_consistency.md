# 01 Step08 · 数据所有权与一致性策略

## 1. 开工确认与Step内计划

模式full-restart；当前agent单独执行；前序Step已停审。已读取架构SOP本Step、架构书写规范对应章节和通用规范适用规则。输入：Step03/05/07、00§10/11/13、owner01§9。输出为当前文件；正式回填仍待Step16。

计划：输入恢复→问题回答→诊断→取舍→结构化→复杂度/历史差异审计→回填草稿→自检/停审。前四项进入本批，后四项pending；未来Step不预建。

| gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|
| pass | 前序停审及用户01授权，只许可当前Step | 完成当前单元思考后才写结构化 | Step03/05/07、00§10/11/13、owner01§9 |

## 2. SOP问题回答

本仓truth是申请/责任/market状态/分发/处置/计划attempt/局部审计恢复；external不可变资产与批准等仅ref/safe snapshot。当前资格需要source-backed重新核验，不能说跨仓强一致。局部accepted变更、审计追溯、幂等原完整结果及待交接责任要同一原子承诺；外部工作不能混入本地事务。搜索projection最终一致但visibility和禁新获取不得陈旧放行。撤回与获取有本地序列化点：撤回提交后新意图不受理，已在之前受理的交接保留独立结果/影响，不伪称取消外部commit。

## 3. 输入诊断

“最终一致”不能成为发布/获取以旧资格放行理由；“强一致”不能成为跨Gov/receiver共享事务承诺。外部owner在本地提交后可变，须明确不保证全球瞬时撤销；已得知失效限制、unknown按当前可证明资格拒绝。

## 4. 设计取舍

采用local atomic accepted边界+外部独立结果+可重建projection；不采用distributed transaction或把index当可授权快照。写前核验的owner版本/绑定只是本次决策依据，需正式有效性语义，缺则positive blocked。逐单元分别停审。

### U1 问题、诊断与取舍

问题/依据：C1 truth/ref/snapshot分别是谁？本地关系及核验过程是truth，publisher/source/material authority是外部。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U1 结构化、回填与停审

Truth：责任关联与核验过程；ref：owner version/digest/visibility、主体/组织依据及材料；snapshot：qualified安全摘要。relation更新与局部依据绑定一致，来源变更重新核验不覆盖已提交申请；禁止正文/credential/raw签名扫描保存。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U2 问题、诊断与取舍

问题/依据：申请与Gov决定如何防双truth？固定申请基线本地拥有，Decision外置。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U2 结构化、回填与停审

Truth：申请/固定baseline/交接过程；ref：正式Decision、申请接收结果、材料；snapshot：允许的Gov状态摘要。submitted基线不就地换版本；上架依据有效性在本地处置边界检查；ACK/摘要可读/fresh/waived不当approved。外部unknown不补造决定。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U3 问题、诊断与取舍

问题/依据：listing与market version都truth，source只有ref；多版本如何避免silent latest？immutable绑定。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U3 结构化、回填与停审

Truth：listing/taxonomy/metadata/market version状态；ref：不可变owner版本及U2/U5处置依据；projection：U7可见目录。上架/限制/撤回与本地审计/结果/待交接责任局部一致；版本绑定不被来源更新覆盖；重新上架新有效依据+显式处置。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U4 问题、诊断与取舍

问题/依据：同意图重复、不同意图冲突、外部commit未知分别如何处理？要原完整result持久化及明确receiver outcome。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U4 结构化、回填与停审

Truth：获取意图/relation/attempt/本地映射结果；ref：receiver正式结果；snapshot：窄资格/receiver摘要。operation+scope+key+canonical intent同则重放原完整结果，不重算；不同intent冲突；intent/version/consumer/receiver/scope不匹配不映射。unknown先原意图对账，不盲retry；取消不声称外部已回滚。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U5 问题、诊断与取舍

问题/依据：撤回如何不等通知、如何和分发竞争？禁新获取处置与版本/受理检查共局部序列化边界。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U5 结构化、回填与停审

Truth：处置/已知影响/通知plan和attempt；ref：qualified通道结果；projection：影响进展。撤回提交先禁新受理，Worker尚未发出的意图在实际派发前重查gate；此前外部交接unknown仍入影响。计划形成后新确认/迟到关系补充影响而非丢弃；通知失败不复活版本，attempt/ACK非送达。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U6 问题、诊断与取舍

问题/依据：accepted audit与日志如何不同？业务audit原子承诺，runtime诊断不能代替。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U6 结构化、回填与停审

Truth：安全局部审计、恢复意图/attempt/结果、外部审计交接过程；ref：正式外部接收；projection：安全查询摘要。本地业务变更与追溯/原结果/待交接责任一致，缺一不能accepted；外部接收最终一致。恢复留历史、推进既有意图或影子，不改owner/旧记录。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

### U7 问题、诊断与取舍

问题/依据：source snapshot和目录projection怎重建？前者来自qualified owner，后者committed local truth+允许摘要。

诊断：相邻单元或owner主语不能并入本单元。取舍：采用本单元独立责任与外部来源接缝，不采用投影直接写truth或外部ACK推断结论。思考done；gate_status=pass，仅允许本单元结构化；next_allowed_action=本单元写入/自检。

### U7 结构化、回填与停审

无业务truth；仅引用/qualified快照及目录/进展/资格/影响/审计projection。generation/freshness可独立维护，不批准/上架/获取。重建不以现有projection反填字段，missing输入保持degraded；scope结果不能从ref字符串/cursor/timestamp猜测，索引/总数/提示都受正式可见判断。

回填草稿：正式对应章节摘录上述边界，不加schema/代码事实。自检：来源可回指、truth唯一、条件接缝保留、正文不入仓、无越层结论；gate_status=pass / stop_review；next_allowed_action=下一单元；source_files=本Step§1及本单元依据。

## 5. 结构化中间产物

### 正式§9数据归属

| 数据项 | 数据类型 | 归属说明 | 边界说明 |
|---|---|---|---|
| 责任关系/核验过程 | 正式真相数据 | U1本地过程 | 非主体/组织资质truth。 |
| 发布申请/固定基线/review handoff | 正式真相数据 | U2市场申请过程 | 非Gov批准或源正式化。 |
| Listing/market version/分类/metadata | 正式真相数据 | U3市场目录及处置 | 非Method目录或Registry。 |
| 获取意图/relation/attempt/本地结果 | 正式真相数据 | U4市场交接过程 | 非安装、支付、订阅。 |
| 撤回/已知影响/通知计划与attempt | 正式真相数据 | U5市场风险处置过程 | 非全安装用户集合/通道送达。 |
| 安全审计/恢复与外部交接过程 | 正式真相数据 | U6自身变化与处理 | 非Observability账本/Archive包。 |
| immutable source/material/authority/Gov refs | 引用关系数据 | truth由相应owner提供 | 来源version/digest/visibility不能本地生产；材料非批准。 |
| receiver/notice/audit结果refs | 引用关系数据 | 正式结果由接收owner提供 | 同intent/version/scope绑定后只映射局部结果。 |
| owner资格/材料/Decision/receiver安全摘要 | 快照 / 投影数据 | U7 qualified外部影子 | 本地存在不授权/批准，不自证有效。 |
| 目录搜索/进展/影响/审计与freshness视图 | 快照 / 投影数据 | U7从committed market事实派生 | 可失效/重建，不反写。 |
| 窄entitlement视图 | 快照 / 投影数据 | 正式获取资格authority来源 | 无transaction写面或财务账本。 |
| asset/Registry/Adapter/镜像/Artifact正文血缘/Identity/Gov truth | 明确不拥有的正文 / 真相 | 外部owner | 不进入market存储/索引/事件/日志/报告。 |
| credentials/raw扫描签名/SBOM/安装/财务/归档包正文 | 明确不拥有的正文 / 真相 | 外部owner或forbidden材料 | 不能在恢复/调试时复制补齐。 |

### 一致性策略

| 数据关系 / 场景 | 关联数据类型 | 一致性口径 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 申请固定基线及责任引用 | truth/ref/snapshot | 局部accepted强一致+依据适用 | 缺失/变更/错绑定则不提交或待核验 | submitted不就地换输入。 |
| 上架处置与正式批准 | truth/ref | 处置时完整有效绑定，不承诺跨owner强一致 | 无approved/outcome/binding即blocked | 持有ref不是资格。 |
| 新获取与当前来源/权限/版本/处置 | truth/ref/snapshot | 本地受理序列化+当前正式资格 | 未知/撤回/失效拒绝新意图 | 免费同gate，owner全球瞬时撤销非本地保证。 |
| 撤回与获取竞争 | truth/truth | 同market局部序列化边界 | 撤回后不受理；未发出意图派发前重查 | 先前外部交接独立收敛/纳入影响。 |
| 同operation/scope/key/canonical intent | truth/truth | 一个意图与原完整结果重放 | 不同intent冲突；缺stored result不猜成功 | key不能单独证明同意图。 |
| accepted与安全审计/原结果/待交接责任 | truth/truth | 局部原子承诺 | 任一未成立不accepted，外部unknown不写本地成功 | 不把外部调用置于跨仓事务。 |
| 分发/通知/审计意图与外部结果 | truth/ref | per-intent最终一致 | unknown原意图对账，无probe则等待人工依据 | ACK与business commit分离。 |
| 已知影响与迟到relation确认 | truth/ref/projection | 稳定已知集+增量收敛 | gap/unknown显式，迟到补充，不称全覆盖 | 不扫描全安装用户补truth。 |
| committed truth与读取projection | truth/projection | 最终一致，可重建；visibility不放松 | stale/degraded/不可见，不反写真相 | 资格/总数/提示不凭索引放行。 |
| 恢复与局部/外部历史 | truth/ref/projection | 原意图及历史连续性 | 只能追加新处理或重建shadow，不覆旧/改外部 | 来源恢复不自动重上架。 |

归属先于一致性。局部truth与外部依据可共同解释一次判断，但不构成跨owner原子提交。已获知外部失效或当前资格不能证明时，相关新positive关闭；event提示只触发核验/限制，不自造撤销事实。本章不画可选数据图：两表已明确分类/关系，避免把ref连线误读为数据流或跨仓事务。

跨数据审计：无double truth、projection反写、正文复制；强一致只局部、receiver结果独立、withdrawal fence与worker重查语义兼容。02/03必须进一步闭合stored result读写、canonical intent、expected version来源、accepted audit/effect inventory、查询scope来源及rebuild inputs；缺则不能进入实现。

## 6. 复杂度判断

七单元逐项停审；归属和一致性分表，具体UoW/repository/enum/schema后移02/03，不由实现补造。

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
