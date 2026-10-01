# L5-chat 06 · Step 12 缺陷分级、复验与放行规则

## 1. Step状态

> done / pass_with_upstream_blockers；2026-10-01。这里只定义验收规则，所有TC/EV为planned预约，无实际验收结果或签署。

## 2. 本步输入

前序Step11 local gate已通过；06 SOP Step12、书写规范5.12；00实际36AC、03契约、04配置、05TC/EV和证据schema；中间产物§5.10与真相源§7。

## 3. SOP问题回答

各severity的影响、修复/复验、能接受哪些问题、何时阻断？§12.1～3明确；P0/S/A无普通riskwaiver。

## 4. 当前文档问题诊断

测试严重性与验收S/A/B可能不同名，照搬别仓A级waiver会绕过本项目所有P0；旧失败版本与新送验不能混。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 测试严重性与验收S/A/B可能不同名，照搬别仓A级waiver会绕过本项目所有P0；旧失败版本与新送验不能混。 | §7结构化裁决 | 保持正式contract/TC/EV与证据能力一致 |

## 6. 验收裁决取舍与复杂度

保持05 workflow，三class映射、同层复验/历史failure与当前cases分开。privateDefectSummary回写Step10，非新客户端对象。

## 7. 结构化中间产物

### 12.1 与05缺陷规则映射

这些class/status只属于测试/验收管理记录，不进入17个客户端状态主体。05 severity与workflow保持原名称；06只是裁决映射。

| 06级别 | 对应05 | 定义 | 结论影响 | 复验 |
|---|---|---|---|---|
| S | blocker | 任一VETO、安全/权限/secret/真相/证据造假、硬门禁被绕过 | 未解决只能不通过；不可riskaccept | 原TC全失败variant、family/相关P0及必要real层、boundary/redaction/report全部复验 |
| A | major | P0主线/状态/CAS/AT/恢复/配置/真实层缺证据，不一定已触发VETO | 当前216TC均P0，不能通过或有条件通过；事实不足保持blocked而非伪verified | 同TC/同层/全受影响参数+相关suite/revoke/unknown；actualnewrun |
| B | minor | 明确不影响P0/安全/核心AT的P1/P2视觉、文档或维护问题 | 仅真实完整riskaccept可有条件通过；普通openB也不能被悄悄忽略 | 影响界定与actualreview，修复后对应检查/最小回归 |

不能照搬其它owner“A级可接受”来豁免本项目P0；诊断/增强defaultdisabled边界仍需P0验证。外部capability unavailable是blocked_external/上游缺口，不随文档完成改verified/closed。

### 12.2 status与关闭证据

沿用05：open→triaged→fix_planned→ready_for_retest→verified→closed；复验失败reopened→triaged；blocked_external不等修复。任何verified/closed必须实际旧失败ref、修复版本/交付与**同层**新复验case/ref；unit不能关闭formalSDK/native/AT缺陷。
实际报告每defect至少safe id、severity/class/priority、status、影响gate与TC/variants、有限reason、failure/newrun/source refs、责任人、复验scope与必要risk ref，禁止业务正文/秘密/原stack/受保护title。机器baseline DefectSummary见§10，open-issues.md安全表与其一致。

### 12.3 复验与放行

| 影响面 | 复验集 | 放行限制 |
|---|---|---|
| intent/result/unknown | intent全suite、CONC01～05/09/14、TC-REAL-001/004正式结果/幂等 | ACK/fake不能关闭owner结果问题 |
| visibility/CAS/source/cache | navigation/continuity/persistence、全部相关晚到/guard、图/目录safeDOM/AT | hide优先不依stop/delete成功；失败root不部分写 |
| Process/relationship/provider | process/directory、父图/旧节点/querylineage、CFG10、ATgraphlist、正式SDK | Work/log/原型不能代Process/provider |
| config/host/支持版本 | 六profiles、CFG12组、TS/Rustguard、native/AT真实层 | sameOSapprovedmatrix，不用Web覆盖native问题 |
| evidence/redaction/review | TC-REPORT-001～007、actual全refs/schema/hash/map/新review重签 | 旧signoff因数据改动失效；rawcandidate不归档 |

修复源码/build/合同改变必须新baseline/newrun；旧失败run可作为历史故障链，不能作为当前requiredcasepassed。实际复验报告不得覆盖旧安全失败材料。疑似不可复现/缺真正环境仍open或blocked_external。
S/A、任一P0或detectedVETO不得waive。B要有真实接受人/动作/截止；到期未完成撤销条件放行。全部结论和stage按§14，不在设计稿里创建BUG、run或实际签署。

## 8. 回填草稿

正式06 §12回填本步§7裁决结论/表/schema；过程停审、差异和自检留本文件，不冒充实际结果。

## 9. 待确认事项

CHAT-UP001～009/WS-UP001～008/BASE001/native/OS/AT/生产预算/精确版本/来源/发布/归档继续open/blocked。角色、build、run_id、报告、actualEV、风险接受与签署均waiting；没有当前放行或readiness。

## 10. 自检及下一Step门禁

S/A/B与05severity/status一致，真实复验source/层与风险规则闭口；当前没有缺陷执行记录。 本地规则设计gate pass_with_upstream_blockers；允许Step13先读取台账/flow/当前产物与对应SOP，不创建其它未来Step。
