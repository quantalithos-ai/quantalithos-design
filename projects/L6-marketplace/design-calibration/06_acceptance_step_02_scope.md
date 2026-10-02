# Step 2：明确验收目标与范围

## 1. Step 状态

SOP Step2/规范5.2；回填§2；status=completed/selfcheck_done/stop_review，gate_status=pass（设计），gate_reason=scope/P0/非范围已可判定；next_allowed_action=Step3基线阅读。

### 1.1 Step 内计划

| 计划项 | 状态 | 产物 |
|---|---|---|
| 读取输入和前序结论 | done | §2 |
| SOP问题回答 | done | §3 |
| 当前/历史材料诊断 | done | §4 |
| 设计取舍 | done | §6 |
| 结构化中间产物 | done | §7范围/证明资格 |
| 复杂度/附录判断 | done | 范围留主控，具体项等Step5～11 |
| 回填草稿 | done | §8→正式§2 |
| 自检/进入下一步 | done | §10 |

## 2. 本步输入

source_files：[Step1](06_acceptance_step_01_input_boundary.md)全部结论/诊断/取舍/十二待确认项；00§4/14、01责任边界、03七U、05§2/12。输入已恢复，旧06范围污染已隔离。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 核心裁决目标？ | 对声明的scope/baseline，发布→审核handoff→目录/版本→分发→撤回影响/通知→审计恢复是否受控成立，不裁决全生态ready。 |
| P0/P1/P2？ | 05全部98TC及20AC/五VETO为当前P0；无新增P1功能，非P0体验微调仅有合法残余才可接受；capacity-candidate为P2观察，非硬SLO。 |
| 下游只验什么？ | 接收/通知/Obs exact合同与本地责任映射；不验执行、安装、启用、已读、财务账本或Archive恢复。 |
| 非范围如何影响结论？ | formal资格缺失不能当可接受遗留；scope提前冻结且不得删失败路径缩范围。未来能力缺口不自动阻断已声明local scope，也不自动纳入。 |
| 哪些可能否决？ | source/body/credential、approval、scope/index/UI、ACK/交易、撤回/伪结果/历史红线，按五VETO。 |
| 哪些须正式名称？ | 全49入口/14carrier及DTO/18ErrorCode、PublicationBasis/NoticeIntent/ReceiverOutcomeBinding等；draft/原型措辞非contract。 |

## 4. 当前文档问题诊断

旧06§1纳入安装、订阅、账单、rating/ranking/compatibility bundle，无正式owner和当前测试源；不得保留。05local-contract与formal-selected分层已有，但06须禁止送验后把formal失败改称local通过。

## 5. 改动前后对比

| 前 | 后 | 原因 |
|---|---|---|
| 五条commerce/install主线 | 五能力及七U受控闭环 | 以当前00～05范围为准 |
| “全部验收”无scope | local/formal-selected/capacity三层 | 明确证明上限和缺口影响 |
| 只看主流程成功 | 正反/并发/恢复与非业务安全同P0 | 不能靠happy path规避门禁 |

## 6. 设计取舍

采用scope在run前冻结、结论带scope/exclusions/资格，local全98和正式selected额外资格分开。未采用“formal不可用就改local并沿用成功EV”：篡改范围且可能择优覆盖失败。capacity只趋势，不用旧200ms阈值。

## 7. 结构化中间产物

| 验收范围项 | 类型/优先级 | 裁决目标/绑定 | 非范围/影响 |
|---|---|---|---|
| 来源与责任 | C1/U1/P0 | AC-MP-101/102/103；SOURCE及REFERENCE；03U1 | 不自产publisher资格、正文/材料；formal positive缺口阻本scope |
| 申请与审核 | C2/U2/P0 | AC-MP-201/202/203；REVIEW/CATALOG；03U2/3 | 治理approval归Gov；rejected可匹配但不可List |
| 目录/搜索/版本 | C3/U3/U7/P0 | AC-MP-301/302/303；CATALOG/REFERENCE | 不合并资产owner目录，不默认latest，不自产正文 |
| 受控获取 | C4/U4/P0 | AC-MP-401/402/403；DISTRIBUTION | 局部relation/attempt非installed/paid；free不免gate |
| 撤回/通知/恢复 | C5/U5/U6/P0 | AC-MP-501/502/503/504；WITHDRAWAL/RECOVERY | KnownScopeComplete非全安装；不反写owner/删历史 |
| 横切库存/安全/一致性/配置 | 七U/P0 | AC-MP-G01/G02/G03；CROSS/CONFIG；13CUT | 全49/43/14/222/17/146/33/16Q库存必须展开 |
| Web协议/locale | Web/P0 | AC-MP-G04；CROSS-008/021、CONFIG-011 | Vue/TS实际browser；9090原型不是验收产物 |
| 报告/证据工具 | tooling/P0 | CROSS-010/六checks/四reports；05§13 | 不以report生成成功推断业务通过 |
| 合法非P0微调残余 | 非核心/P1候选 | §12/13由真实finding证明无P0影响后才接受 | 当前未创建P1功能/缺陷，不降级任何98TC |
| capacity-candidate | 观察/P2 | Q-MP-01；05Step10声明workload | 无数值SLO/EV，不证明production性能 |

| scope | 必选证明 | 资格上限/扩展条件 |
|---|---|---|
| local-contract | 完整98TC/11suite/所有required subcase及六两stage checks | test typed fake+actual PG+API/Worker/browser；可裁决本地契约，formal positive仍blocked |
| formal-integration selected | local全量基线+送验前明确selected owner/type/operation/version/scope的actual集成 | exact SDK/owner/auth/data资格、同run真实结果；不覆盖未选择接缝，不把fake例视为formal |
| capacity-candidate | approved workload下实际raw samples和趋势 | 独立观察记录；不是业务P0退出或生产SLO通过 |

正式selected所需positive必须按既有TC的required subcase扩展manifest；若既有TC无法表达，回05/03受控补设计，06不另造测试。scope冻结后改变需新baseline、新run、新review，保留旧失败；不复用旧通过子集。未选future能力可排除，但安全禁止依赖负例仍P0。

## 8. 回填草稿

正式§2候选：五能力及横切库存、Web、配置、证据工具为P0，三scope在run前声明。全部结论带明确范围与排除，不表示Marketplace全项目或生产ready。评级/推荐/收藏、安装激活、finance/订阅/结算、Archive writer/restore、active Event/outbox未纳入，变更先回00/01。

## 9. 待确认事项

formal-selected operation/type/owner集合由未来送验明确，当前无实例。十二上游项不因local设计解除；P1接受authority未指派，不能预签。

## 10. 进入下一步条件

设计自检：五能力16业务AC与4全局AC均有范围，98TC不降级，无未授权P1功能；formal scope扩展/失败不缩范围、capacity非阈值规则明确。独立停审pass，下一读Step3 SOP/规范5.3、03库存/04profile/05§13及schema，无commit。
