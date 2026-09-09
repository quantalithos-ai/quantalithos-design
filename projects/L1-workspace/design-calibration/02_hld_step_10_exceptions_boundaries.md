# Step 10. 异常边界

## 1. Step 状态与计划

- 模式：full-restart / single-agent-serial；输入门禁 pass；思考记录、结构化、回填、自检 done。
- gate_status=pass；gate_reason=本Step静态自检完成；next_allowed_action=由flow串行推进；formal_fill_allowed=step14_only。
- source_files：Step 9；00 §14；项目台账；02 flow；概要SOP对应Step与概要规范对应章节。
- 写入前检查：本项目/本文档授权有效；无正式正文污染；分批规模不限制最终完整性。

### Step 内计划

1. 已读取三层台账、前序及规范。
2. 问题回答、诊断、取舍见§3~6。
3. 读取安全组→输入/局部写组→恢复组逐批；跨组核对失败姿态和写边界
4. 结构化后后置历史审计；从§7摘录回填。
5. 自检通过后更新flow，不把上游pending改为闭合。

## 2. 本步输入

Step 9；00 §14；00 FR-WS-001~010/BR-WS-001~012；01 §6/8/9/10/13/15。前步的问题回答、诊断、取舍、待确认均承接，具体依赖见flow §3。

## 3. SOP 问题回答

1. 必须覆盖授权失效、缺失/空、分页失效、source顺序/重复、提交unknown、恢复并发与上游合同缺口。
2. 这些情形分别使读流裁剪/拒绝、写流停写或新candidate恢复，不改变owner边界。
3. 不能推迟发现的失败是query隐式写、cursor超前、失效后旧页泄漏、unknown当rollback以及overlay被重建覆盖。
4. 概要层固定归属、结果姿态和是否允许副作用，精确错误码/重试退避/补偿算法后置。
5. 不列一般参数校验或底层错误全集，也不把所有上游风险搬进异常表。

## 4. 当前文档问题诊断

前步多个不同失败都能表现为blocked，但它们是否写局部诊断、是否保留旧视图、是否要求新attempt不同，不能用统一catch-all处理。

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 尚无本Step正式校准；01只有架构约束 | 本Step将已核验边界转为异常边界，不补上游schema |

## 6. 设计取舍

按读取安全、输入/局部写、恢复三组审查；以场景→部分→动作/禁止效果表表达，已有Step8足以显示协作，不重复画异常图。

## 7. 结构化中间产物

异常分类只约束结构，不定义协议错误码。相同外部失败的持久效果取决于入口类别：Query只能派生响应；Consumer/Operations只有正式业务依据才能改变局部状态。

### EX1 读取安全与缺失

#### 问题与依据

来源：Step8六Query、Step9 CP1/2/7、00 BR-WS-002/003/010。

读取失败必须区分没有可服务材料与完整空集合；同时不能泄露hidden存在性。

#### 诊断与取舍

stale授权、分页旧绑定、空页没有item校验，都会绕过正常per-item裁剪。

采用：列安全与缺失异常，不以默认空或匿名成功统一吞错；未采用：把外部truth或后续实现细节并入本部分。复杂度允许在本文件独立小节展开。

写入前检查：项目/flow/本部分门禁pass；依据与取舍done；目标仅当前Step；正式正文不写。下一批先结构化本部分再自检。

#### 结构化中间产物

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| scope不可解析/主体不匹配 | CP1/CP7 | 安全失败，不带scope/ref/count/provenance，不查后再猜授权 |
| 现时权限缺失/撤销/冲突 | CP2/CP7 | 受影响内容fail-closed；stale数据不使用旧allow；不等待物理清理 |
| 分区或projection不存在 | CP7 | 安全missing/unavailable，不初始化、不发refresh、不当complete empty |
| 空页/全被裁剪 | CP2/CP7 | 必须有list访问证明；不得暴露隐藏条目数量或缺失owner清单 |
| 部分source不可用 | CP2/CP7 | 已允许子集可partial/stale；必要source无法满足则blocked；Query不持久化source删除 |
| 分页绑定发生变化 | CP7 | generation/view/local/query/主体/权限语境不可服务则重新读取；不静默切页或混代 |
| Transient聚合失败 | CP7/CP2 | 仅返回安全部分或失败；不保存snapshot、不发物化cursor，不自动切换另一读模式 |
| export未闭合/旧页失效 | CP7 | blocked或要求重读；不形成archive/handoff接受记录 |

#### 回填草稿与模块自检

回填本部分结构表和边界结论，不摘录诊断过程。八场景均无写副作用；内容与元信息同一裁剪边界。

模块状态：问题/诊断/取舍/结构化/回填/自检=done；gate_status=pass；外部正向合同仍blocked。允许下一部分依据审查。

### EX2 输入应用与局部写失败

#### 问题与依据

来源：Step8 CP1/3/5；Step9 CP3/5。

重投、乱序和本地unknown不能用同一重试动作处理；源truth与局部用户意图版本分离。

#### 诊断与取舍

同key异payload覆盖会抹掉已提交结果；未闭合cursor加一判缺口会跳过真实输入。

采用：列成功重取、冲突停写、缺口保持及unknown核对分支，所有副作用限定本分区；未采用：把外部truth或后续实现细节并入本部分。复杂度允许在本文件独立小节展开。

写入前检查：项目/flow/本部分门禁pass；依据与取舍done；目标仅当前Step；正式正文不写。下一批先结构化本部分再自检。

#### 结构化中间产物

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| 同key同digest重投 | CP1/3/5/6 | 返回既有已提交结果并按当前权限裁剪，不重做effect或新增Inbox |
| 同key异digest | 对应写入service | conflict，保留原成功结果，不覆盖；日志不保存敏感原始输入 |
| 迟到有正式顺序证明 | CP3 | LateIgnored终局，不倒退cursor/条目；不是按时间戳判断 |
| 顺序不可比/缺口 | CP3 | Gap/Blocked，保留最后安全cursor；显式输入可记coverage诊断，但不占成功键 |
| event schema/来源不可验证 | CP3/CP2 | 不反序列化为本地安全值、不写受影响projection；不得fake补schema |
| 投影原子提交失败/unknown | CP3/WorkspaceStorePort | 确定失败无部分cursor推进；unknown先读结果，不把timeout当rollback |
| Provision并发唯一性冲突 | CP1 | 正式scope核对后安全复用既有分区；无ID时按scope操作键核对 |
| local expected版本冲突 | CP5 | 原意图不变；重新读取后显式重试，不能覆盖别的用户动作 |
| read intent跨generation不可映射 | CP5/CP7 | 保存用户意图，派生Unknown；不置已读、不移用source cursor |
| 操作结果查询无记录/被拒绝 | CP7及调用写service | 无记录不证明rollback；无法确认时停写，不盲重放 |

#### 回填草稿与模块自检

回填本部分结构表和边界结论，不摘录诊断过程。十场景与终局记录/coverage/用户意图模型一致；未定义上游重试或bus ack策略。

模块状态：问题/诊断/取舍/结构化/回填/自检=done；gate_status=pass；外部正向合同仍blocked。允许下一部分依据审查。

### EX3 恢复与失效边界

#### 问题与依据

来源：Step8 CP6五流、Step9维护双轴，01 §9.4。

baseline不完整、续接不存在、candidate并发与安全撤销均可能中止恢复，但不能覆盖current或local意图。

#### 诊断与取舍

旧worker完成后覆盖新current、跨分区失效只更新current而遗漏candidate，都会造成混代或撤销后复活。

采用：明确blocked/failed/冲突/替代/安全阻断的不同作用；只有局部已提交cutover可称Completed；未采用：把外部truth或后续实现细节并入本部分。复杂度允许在本文件独立小节展开。

写入前检查：项目/flow/本部分门禁pass；依据与取舍done；目标仅当前Step；正式正文不写。下一批先结构化本部分再自检。

#### 结构化中间产物

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| baseline或正式接续缺失 | CP6/RecoverySourcePort | attempt Blocked，不用旧projection、SDK cache、archive或seed替代 |
| bus只完成replay preparation | CP6 | 不证明executor/接续就绪；受影响路径保持blocked |
| Ready后candidate/current版本变化 | CP6/WorkspaceStorePort | 拒绝旧cutover；仍非终态且安全前提成立时重新验证，不混两代 |
| attempt被Superseded而旧worker继续 | CP6 | expected attempt版本/状态拒绝提交；不能产生第二current |
| 原attempt Blocked/Failed后依赖恢复 | CP6 | 新显式attempt；Query不复活旧任务 |
| 安全撤销与普通数据Gap同时发生 | CP6/CP2/CP3 | 安全裁剪不等数据补齐；所有受影响generation均受失效，旧allow不复活 |
| 跨分区失效仅部分完成 | CP6/CP7 | 分区级提交与完成范围如实报告；不宣称全局原子成功；Query现时权限继续fail-closed |
| DataStale误被当删除 | CP6 | 仅数据时效影响；无正式owner删除/撤销依据不能生成tombstone |
| 重建期间local command成功 | CP5/CP6/CP7 | 保留新local revision；cutover不覆盖overlay；旧分页绑定失效 |
| cutover提交unknown | CP6/WorkspaceStorePort | 先读partition指针、attempt及原子结果；不可确认就停写，不宣称Failed或Completed |

#### 回填草稿与模块自检

回填本部分结构表和边界结论，不摘录诊断过程。十场景均能回指既有flow/state。异常表无需新图，跨组关系已在Step8/9展开。

模块状态：问题/诊断/取舍/结构化/回填/自检=done；gate_status=pass；外部正向合同仍blocked。允许下一部分依据审查。

### 7.1 后置审计与收束

28个关键场景均指定处理部分和当前动作；未加入完整错误码、重试参数或补偿脚本。draft/02 §2.6中的缺口/恢复候选按本表细化，保留no-upstream-write与保守失败，废弃默认重放可用的解释。普通参数验证不进入本表；外部合同关闭条件仍在Step13登记，不把异常表当owner设计。

## 8. 回填草稿

正式§10摘录本文件§7的结论表/图；模块附录只摘录已停审结论，不复制讨论过程。详细字段不越过概要粒度。

## 9. 待确认事项

WS-UP-001~008/006-S持续开放；仅允许本地骨架与负向边界收口，受影响正向合同不能交实现。

## 10. 进入下一步条件

静态审查：读取安全8场景、输入/局部写10场景、恢复10场景均可落到既有部分；unknown与确定失败、DataStale与SafetyBlocked区分明确。
自检仅为文档静态审查，不是测试执行或上游签署。gate_status=pass；允许进入Step 11。
