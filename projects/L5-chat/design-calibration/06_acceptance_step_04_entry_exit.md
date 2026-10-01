# L5-chat 06 · Step 4 进入条件与退出条件

## 1. Step状态

> done / pass_with_upstream_blockers；2026-10-01。这里只定义验收规则，所有TC/EV为planned预约，无实际验收结果或签署。

## 2. 本步输入

前序Step3 local gate已通过；06 SOP Step4、书写规范5.4；00实际36AC、03契约、04配置、05TC/EV和证据schema；中间产物§5.10与真相源§7。

## 3. SOP问题回答

何时能开始/结束、缺陷/证据/风险哪个阻断？两清单与blocked/failed区别明确，不填actual verdict。

## 4. 当前文档问题诊断

勾选执行进入/退出会暗示真实送验已完成；失败关闭与证据不足需区分。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 勾选执行进入/退出会暗示真实送验已完成；失败关闭与证据不足需区分。 | §7结构化裁决 | 保持正式contract/TC/EV与证据能力一致 |

## 6. 验收裁决取舍与复杂度

所有checkbox未勾选，只定义可判定进入/失败关闭/最终签署规则；current成熟度单独列。

## 7. 结构化中间产物

### 4.1 进入实际验收条件

- [ ] 批准规则/送验交付baseline已固定，00～06指纹、SDK/host版本/dirty/build refs可核。
- [ ] 05执行退出条件满足；216P0TC及全参数、17主体合法/guard/非法全集与必要formal SDK/native/AT证据真实存在。
- [ ] primary_run_id与全部run_ids明确，无latest/跨baseline/错profile或支持矩阵缺项。
- [ ] 04有效来源/六profile/flat14、SDKregistry/runtime资格与native approvedpolicy分别验证。
- [ ] evidence-index/fullEVdetail与机器case/report路径/digest/schema/分母及两阶段redaction全部有效，maturity至少full_ev，handoff生成需07授权acceptance_handoff。
- [ ] 当前S/A及影响P0缺陷无未解决项；旧失败有同层复验记录；阻断上游能力已具备。
- [ ] 真实OS/AT/版本、生产预算/数据权限/保留ACL来源批准，适用核心目标可操作与安全恢复。
- [ ] handoff/veto/risk/openissues固定入口完整、安全、人/Agent审阅责任明确，risk未接受不能当已接受。

当前所有checkbox是要求，**未勾选**；除设计可定位外，实施/测试/真实报告/支持/批准均not_started、waiting或blocked。规则编写完成不意味着执行进入条件满足。

### 4.2 退出与失败关闭

- [ ] 每个P0 parentAC及相关子gate有实际证据绑定和审查记录，不存在unassessed/pending/blocked被标pass。
- [ ] VETO全部有实证核对结果；任一实际触发总体不通过，无风险豁免。
- [ ] 缺陷同层复验、缺口与P1遗留分类清楚，P0/S/A未通过不能条件放行。
- [ ] 有条件通过仅非P0遗留：真实责任人/接受人/批准范围、动作、截止日期完整。
- [ ] 最终三值结论和适用scope按§14由必要角色实际签署；送验不完整不填“通过”。
- [ ] acceptance与run材料脱敏、bytes/JCS digest、固定版本/路径、访问与保留policy有效。

“不通过”可以在已有可靠证据确认任一硬失败后结束本次失败审查；不要求失败样本也全部通过。送验不成立或证据不足保持blocked/reviewing，不制造最终结论；强行放行触发证据/门禁绕过VETO。
local阶段验证只结束明确批准的本地scope，不等于Desktop产品验收。07实施设计下一阶段须另行用户授权，本轮不据checkbox推进。

## 8. 回填草稿

正式06 §4回填本步§7裁决结论/表/schema；过程停审、差异和自检留本文件，不冒充实际结果。

## 9. 待确认事项

CHAT-UP001～009/WS-UP001～008/BASE001/native/OS/AT/生产预算/精确版本/来源/发布/归档继续open/blocked。角色、build、run_id、报告、actualEV、风险接受与签署均waiting；没有当前放行或readiness。

## 10. 自检及下一Step门禁

输入基线、退出证据、真实层与风险边界一致，当前未送验/无产品结论。 本地规则设计gate pass_with_upstream_blockers；允许Step5先读取台账/flow/当前产物与对应SOP，不创建其它未来Step。
