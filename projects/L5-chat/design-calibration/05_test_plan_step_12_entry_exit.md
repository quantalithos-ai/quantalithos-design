# L5-chat 05 · Step 12 进入准则与退出准则

## 1. Step状态

> done / pass_with_upstream_blockers；2026-10-01。全部用例/证据/路径均planned，未执行。

## 2. 本步输入

已通过Step11；05 SOP Step12与书写规范5.12；03 Step16、04 §12；真相源§2.15/§7。复杂cut逐个收口，前序gate成立才创建本文件。

## 3. SOP问题回答

什么时候能开始、结束测试？§12两清单；当前只完成设计，所有运行条件按真实前置阻塞。

## 4. 当前文档问题诊断

把文档完成与执行退出合并会产生虚假readiness；真实前置和证据成熟度不能用模板替代。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 把文档完成与执行退出合并会产生虚假readiness；真实前置和证据成熟度不能用模板替代。 | 本步§7结构化结论 | 防止历史设计与当前owner合同分叉 |

## 6. 设计取舍与复杂度

分别列执行entry/exit、当前不足与失败姿态；gate是硬证据，不填未执行结果。

## 7. 结构化中间产物

### 12.1 执行进入条件

| 进入条件 | 当前状态 | 未满足时 |
|---|---|---|
| 当前00～04及05来源停审，manifest/合法row/guard/TC分母固定 | 设计已有；05本轮待最终审计 | 禁运行漂移用例 |
| 实施仓/源码/测试源/runner/批准pins | not_started | 所有应用测试planned，不能产run |
| 六profile批准来源、strict validate与测试隔离 | 设计明确，真实文件未实现 | blocked，不能env替代 |
| local fixture正规mapper/registry且无production泄漏 | planned | 测试support gate blocked |
| formalSDK public capability/session/各owner资格 | CHAT-UP/WS-UP blocked | real integration blocked |
| native批准origin/window/kind/OS/build权限 | blocked | Desktop gate blocked |
| 生产预算/支持版本/AT矩阵 | blocked | release质量gate blocked |
| run-scoped安全writer/schema/digest/redaction | planned | 不生成可采信EV |
| 测试数据创建/权限/清理与审查责任明确 | real申请waiting | 无真实数据不执行 |

### 12.2 执行退出条件

| 条件 | 必需证据 | 当前 |
|---|---|---|
| planned P0 TC及全部参数instance执行，分母无删减 | 同run manifest、case/suite真实status与assertions | 未执行 |
| 全17主体合法全行、逐guard、非法全行 | rowmanifest+TC-STATE全instance | 未执行 |
| formal SDK/native/AT实际必要层 | TC-REAL001～004对应正式scope材料 | blocked |
| 七条否决方向无违例 | 各负向真实case及报告审查 | 未判定 |
| 失败/blocked/skipped/not_run/missingartifact均未冒充pass | gate与evidence-index机器校验 | planned |
| 所有缺陷已同层复验，P0未解决数不得被waive | safe缺陷/复验refs | 无当前记录 |
| 配置/版本/来源/质量获批准与实测 | approvedrefs+实际验证 | blocked |
| redaction、digest/path/TC→EV→AC闭口 | §13 full EVdetail+index | 未生成 |
| 残余P1有责任人、批准限定scope | 未来06/07risk审查材料 | 未接受 |

local unit gate可以单独结束local scope；formal SDK/host/AT缺失时**整体测试不能退出为通过**。设计05完成不满足测试执行退出条件，更不代表产品acceptance。
证据不足就是未满足，不能给综合通过率掩盖某P0或适用AT失败。06定义最终acceptance/VETO和审阅signoff，05不写verdict。


## 8. 回填草稿

正式05 §12回填本步§7全部表、步骤和schema。

## 9. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native/生产预算/版本兼容/质量仍open或blocked。真实正向不得由fixture解除。无当前测试结果、EV或readiness。

## 10. 自检与下一Step门禁

entry/exit/current状态可区分；没有自称应用测试通过或验收ready。 本地设计gate pass_with_upstream_blockers；进入Step13，先读本产物/台账与对应SOP。
