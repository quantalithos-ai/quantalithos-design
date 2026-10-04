# L6-bridges 00 Step 7：核心能力闭环

> 状态：done / pass；回填00 §7；full-restart。

## 1. 状态与 Step 内计划

开工确认：已读六标准、台账/flow、Step2/4/6、Step5平台附录、需求SOP Step7与书写规范§4.7。进入条件pass；先仓必要性再能力，不从FR或开发阶段反推。按C-BR-1~5串行完成语义卡；每卡自检停审后才能开始下一卡。

| 顺序 | 节点 | 思考/写入/自检 | 语义卡 |
|---|---|---|---|
| 1 | C-BR-1 受权绑定与映射成立 | done / done / pass | `00_req_step_07_c1_binding_mapping.md` |
| 2 | C-BR-2 可解释入站交接成立 | done / done / pass | `00_req_step_07_c2_inbound.md` |
| 3 | C-BR-3 安全外显与交付成立 | done / done / pass | `00_req_step_07_c3_outbound.md` |
| 4 | C-BR-4 受控交互责任成立 | done / done / pass | `00_req_step_07_c4_callback.md` |
| 5 | C-BR-5 失败恢复与安全追溯成立 | done / done / pass | `00_req_step_07_c5_recovery_audit.md` |

## 2. 输入

Step2仓级局部状态；Step4五项目标；Step6前置边界；官方资料；用户inbound/outbound、编辑删除/线程附件、敏感Gate、回调、幂等恢复红线。

## 3. SOP 逐项问题回答

| 问题 | 回答 |
|---|---|
| 没有本仓缺什么？ | 外部协议与内部truth之间的授权映射、效果分离和可解释失败边界会散落。 |
| 必须共同具备什么？ | 受权绑定、合规入站、安全交付、可操作回调责任与受控恢复/追溯。 |
| 缺一个为何不成立？ | 没绑定会越权；没入站只剩通知；没交付无法反馈；没回调无法闭合声称可操作的交互；没恢复/追溯无法解释重复和未知。 |
| 外围增强？ | 诊断UI、发现体验、卡片美化、批量配置等不定义新truth；当前只保留候选，不新增正式FR。 |
| 边界外？ | 内部事实、平台事实、认证中心、默认审批、直接工具执行和跨平台广播。 |
| 预期功能如何支撑？ | 配置/映射支撑C1；验证/交接/差异支撑C2；安全外显/附件/receipt支撑C3；回调与owner动作支撑C4；cursor/retry/replay/audit支撑C5。 |
| 如何拆节点/顺序？ | 五个成立描述，C1前置C2/C3，C3的目标与交付映射支撑C4，C2~4的局部记录支撑C5；讨论次序1~5，不是每次运行必须走全链。 |
| 停审证明什么？ | 来源、故事目标、能力主题、规则、数据/接口、质量、验收否决与blocker均可查；不冒称用户签署。 |

## 4. 诊断

draft六节点将平台差异单列为独立闭环；实际上差异保护每个平台的入/出/回调，不能最后才考虑。旧00把平台接入步骤或功能清单当核心闭环；图不能再写“调用SDK/写Turn/发消息”。

## 5. 前后对比

六动作候选 -> 五个能力成立节点；平台差异末端增强 -> C1能力资格、C2入站、C3交付、C4回调、C5恢复共同约束；平台成功 -> 独立阶段与显式unknown。

## 6. 取舍与复杂度

采用五节点和五张语义卡，去重/顺序/限流是C2~4必要保护，C5承接其跨过程恢复，不因讨论次序后置保护。未采用“通知就算完整bridge”或“所有外部Gate可审批”。卡片按节点独立落盘、逐卡审查，最后跨节点审计；Step8~14按同序正式编号，不重定义语义。

## 7. 结构化中间产物

### 7.1 闭环定义

本仓必须同时具备受权绑定与映射、可解释入站、安全外显与交付、受控交互责任、失败恢复与安全追溯。缺任一项都会使桥接失去授权、双向结果、可操作责任或可靠性边界；各节点的成立包含明确拒绝、不支持和未知结果，不表示平台能力等价或已运行。

#### 核心能力闭环图: L6-bridges

```text
[Authorized binding and mapping established]
       |                         |
       v                         v
[Explainable inbound]    [Safe outward delivery]
       |                         |
       |                         v
       |                [Controlled interaction responsibility]
       |                         |
       +------------+------------+
                    v
       [Recoverable failure and safe traceability established]
```

图中箭头仅表示能力成立的逻辑依赖；不是运行、接口、事件或开发顺序。安全交付不要求每次先有入站消息；追溯保护贯穿所有节点。

| 分类 | 内容 |
|---|---|
| 核心能力闭环 | C-BR-1~5；平台差异、幂等、安全、限流及secret约束贯穿相关节点 |
| 外围增强能力 | 诊断展示、发现体验、卡片美化、批量配置候选；当前无独立正式FR |
| 边界外能力 | 内部/平台truth、认证授权中心、默认审批、直接执行、跨平台广播 |

### 7.2 节点进入、退出与功能主题

| 节点 | 进入条件 | 正常 / 非正常退出 | 功能回填主题 |
|---|---|---|---|
| C-BR-1 | 正式管理basis、配置和typed目标来源 | 受权relation / waiting、blocked、suspended、revoked | 配置secret、binding、mapping |
| C-BR-2 | 有效binding、verified来源与safe材料合同 | owner结果ref / rejected、quarantined、pending、indeterminate | 验证接管、正式交接、消息差异 |
| C-BR-3 | committed source、当前外显依据与目标 | 已知平台receipt / blocked、retry_wait、indeterminate | 安全展示、附件、intent/attempt/receipt |
| C-BR-4 | 可信interaction、映射、当前actor/action授权 | owner结果 / invalid、expired、replayed、blocked、indeterminate | 回调验证、动作责任交接 |
| C-BR-5 | 可定位原operation/gap与恢复/读取授权 | 局部对账及真实handoff / blocked、missing_source、indeterminate | 去重cursor、顺序限流、安全恢复、审计、no-write读取 |

### 7.3 跨节点审计

| 检查 | 结论 |
|---|---|
| 孤儿主题 | 每项用户强制主题有节点：identity/channel/message在C1；入站/变化C2；外显/附件/receiptC3；callbackC4；cursor/retry/recovery/auditC5 |
| 重复owner | 规则跨节点复用但状态主语唯一；C1relation、C2交接、C3effect、C4action、C5recovery/handoff不相互替代 |
| 边界串线 | 无内部truth写入、平台truth所有权、Chat正式输入或defaultapproval |
| 依赖断裂 | safe材料、actor、visibility、owner结果query与平台probe仍明确blocked，不伪造读取面 |
| 状态冲突 | ACK/commit/platformreceipt独立；lease失效和超时仍unknown；不同cursor不共用watermark |
| 后续编号 | Step8~14只按五卡现有主题编号，不增加增强能力；卡片自检不等于用户审查或测试pass |

## 8. 回填草稿

正式§7使用§7.1~7.2；五卡与跨节点审计为延伸阅读。正式章节不展开SDK、DTO、schema或处理时序。

## 9. 待确认

BR-UP-001~009按节点保留；来源未闭合时允许写拒绝/blocked的需求语义，不声明正向能力已经存在。

## 10. 进入下一步条件

自检：五卡串行落盘并逐卡停审；跨节点来源、职责、阶段、主题和失败审计完成；图五节点且只表达成立关系。允许Step8。

```text
gate_status = pass
current_module = completed
next_allowed_action = read_step_08_then_number_stories
commit_required = false
```
