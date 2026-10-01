# L5-chat 06 · Step 14 最终结论与签署

## 1. Step状态

> done / pass_with_upstream_blockers；2026-10-01。这里只定义验收规则，所有TC/EV为planned预约，无实际验收结果或签署。

## 2. 本步输入

前序Step13 local gate已通过；06 SOP Step14、书写规范5.14；00实际36AC、03契约、04配置、05TC/EV和证据schema；中间产物§5.10与真相源§7。

## 3. SOP问题回答

什么结论、何时nextstage/release、必要角色、签署是否risk/业务审批？§14三图表与同digest规则给出，无实际姓名日期。

## 4. 当前文档问题诊断

以文档Accepted或“基本通过”代最终产品结论，缺scope/build与signature会伪readiness；overall递归聚合要避免。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 以文档Accepted或“基本通过”代最终产品结论，缺scope/build与signature会伪readiness；overall递归聚合要避免。 | §7结构化裁决 | 保持正式contract/TC/EV与证据能力一致 |

## 6. 验收裁决取舍与复杂度

三值只用于实际final；blocked intake/null不伪第四final。可靠失败可以拒绝关闭，pass/conditional必须完整P0与真实签署，CORE005无环聚合。

## 7. 结构化中间产物

### 14.1 三值最终裁决与输入posture

最终verdict只允许“通过 / 有条件通过 / 不通过”（机器pass/conditional_pass/fail）。draft/reviewing/blocked/未送验只是输入/流程posture，**不是第四种最终结论**。当前没有产品验收结论、签署或readiness。
规则设计完成只允许当前文档停审；后续07设计仍需用户另行授权。没有build/run/actualEV/approvedscope时，拒绝送验并保持final_verdict=null，不填“不通过”冒充本轮已经执行验收。

#### 验收裁决流: planned final decision

```text
[actual immutable baseline + trustworthy actual evidence + approved scope]
       | missing/untrusted -> blocked intake, no final verdict
       v
[reliable detected VETO or actual P0 hard failure?]
       | yes -> fail / no next stage / actual rejection review
       v no
[all required P0 + SDK/native/AT/quality + evidence + defect gates satisfied?]
       | no proof -> blocked review, cannot pass/conditional pass
       v yes
[only non-P0 residuals?]
       | none -> pass
       | eligible + approved owner/acceptor/action/deadline -> conditional_pass
       | unapproved/expired/affects P0 -> no pass; reopen review
       v
[required roles sign same baseline_input_digest]
       | incomplete -> no final permission
       v
[final archived review + scoped next-stage decision]
```

关键说明：
- 先确认送验scope与真实baseline，缺实证不是“默认无VETO”。
- 实际VETO/P0失败优先，不用其它suite成功抵消；可关闭失败审查而不要求所有其它case通过。
- 有条件通过只能非P0遗留且实际接受有效，缺P0能力/AT/质量不在该路径。
- 署名和业务审批/部署授权分开，baseline一改需重新评审/签署。

### 14.2 各维度与next-stage规则

| 维度 | 允许最终值 | 通过/有条件/失败条件 | 允许进入下一阶段 |
|---|---|---|---|
| 功能 | 三值 | 14功能与5核心/相关红线/协议/状态真实满足；actualP0失败硬fail；非P0可按risk | 仅同批准scope |
| 非功能 | 三值 | 7AC/24NFR行为+真实适用OS/AT/质量批准与测量；假阈值/安全/AT核心失败不可waive | 未批准/未证不能产品release |
| 证据/交接 | 三值 | actualfullEV/16suite/216TC全参数、run/source/hash/scope、redaction/审阅可信；证据造假硬fail | shell/template不准进入真实验收放行 |
| 发布准备 | 三值 | 产品P0与批准build/version/security/retention矩阵完整；release角色实际确认；非P0有效条件必须跟踪 | 不是上线runbook或自动部署许可 |
| 总体 | 三值 | actual任一VETO/P0失败→fail；全部P0成立且无遗留→pass；仅valid非P0接受→conditionalpass | fail=not_allowed；pass按scope allowed；conditional按action/截止 conditional |

整体判定先计算其它35parentAC，再独立检查AC-CHAT-005的全局子gate/证据，避免把自身当依赖形成循环。parentAC全部required子gate通过才通过，scope/版本错配未证明项blocked而非passed。
final fail需要足以证明失败原因的真实baseline、case/EV/ref与必要拒绝审阅；其它未评项可以保留not_evaluated/blocked，不能伪全clear。final pass/conditional要求全部36AC/所有适用P0gatepassed、VETOclear、缺陷/风险及全部必要角色签署完备。

### 14.3 签署角色与记录要求

| 必要角色 | 责任 | 实际签署所需 | 当前姓名/结论/日期 |
|---|---|---|---|
| product | 送验scope/功能目标/非P0影响与条件 | approvedscope、gate事实、risk授权范围 | 未指定/未签署 |
| technical | owner/SDK/字段/状态/CAS/config版本边界 | 同baseline设计实现映射、实际source/TC/EV | 未指定/未签署 |
| test | case/variant分母、real层/失败复验与报告完整 | 实际manifest、cases/suite/EV/source/不足 | 未指定/未签署 |
| security | authority/secret/forbiddenbody/dep/redaction/归档 | actualnegative及machine+derived+handoff安全检查 | 未指定/未签署 |
| platform | native/OS/WebView/AT/支持版本/质量来源 | approvedpolicy与实际Desktop/AT/预算证据 | 未指定/未签署 |
| release | 交付build/source版本、接续stage与限制 | actualbuild/规则baseline、审阅和nonP0条件跟踪 | 未指定/未签署 |

签署是实际审阅对同baseline_input_digest与三值verdict的批准记录，signer_ref必须真实授权角色身份、signed_at实际时间。人/Agent可参与技术/测试审阅，但不能默认冒产品/安全/平台/发布权限；没有真实授权和记录不得签署。当前未调用任何外部人员或创建签名。
最终必要角色一致地签同一digest/verdict；分歧/撤回/过期scope进入reviewing，不能用多数票抵消P0/VETO。finalstage前baseline、缺陷、风险、报告或signature影响字段变化使旧签名失效，先更新review版本并重签。
发布准备通过不等自动部署、发送通知或提交commit许可；任何实际外部动作另受用户授权与发布流程约束，本轮不执行。

## 8. 回填草稿

正式06 §14回填本步§7裁决结论/表/schema；过程停审、差异和自检留本文件，不冒充实际结果。

## 9. 待确认事项

CHAT-UP001～009/WS-UP001～008/BASE001/native/OS/AT/生产预算/精确版本/来源/发布/归档继续open/blocked。角色、build、run_id、报告、actualEV、风险接受与签署均waiting；没有当前放行或readiness。

## 10. 自检及下一Step门禁

三值/blocked/失败关闭、risk严格优先及6role签署scope明确；当前无actualverdict/nextstage许可。 本地规则设计gate pass_with_upstream_blockers；允许Step15先读取台账/flow/当前产物与对应SOP，不创建其它未来Step。
