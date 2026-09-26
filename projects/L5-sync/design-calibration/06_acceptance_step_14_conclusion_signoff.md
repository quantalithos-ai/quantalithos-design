# Step 14. 定义最终结论与签署口径

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 14
> 回填位置：正式 `06-验收标准.md` §14

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 14 / conclusion_signoff |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 当前实际结论 | `not_adjudicated`；不填写通过/有条件通过/不通过实例 |
| 下一步 | `Step 15 / formal_document_assembly` |
| 正式 06 写入 | `blocked_until_step_15` |

## 2. 本步输入

| 输入 | 来源 | 状态 | 说明 |
|---|---|---|---|
| AC 功能/红线/接口/状态/NFR | Step 5～9 | `available` | P0 门禁集合 |
| evidence/handoff 门禁 | Step 10 | `available` | 证据可裁决前置 |
| VETO | Step 11 | `available` | 触发即不通过 |
| 缺陷/放行规则 | Step 12 | `available` | S/A/B/R 影响 |
| 风险接受结构 | Step 13 | `available` | conditional 约束 |
| 实际 run、defect、acceptor、signoff | 送验材料 | `not_provided` | 当前不填写 |

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 结论允许哪些取值？ | 只允许 `通过`、`有条件通过`、`不通过`；另可记录 `暂停/不可裁决` 作为验收过程姿态，但不能当最终三值结论。 | 06 书写规范 §4.2；SOP Step 14 |
| 何时允许进入下一阶段/发布准备？ | `通过`：全部 P0、VETO、证据完整、S=0、无未接受 A；`有条件通过`：P0 主线成立、VETO 未触发、S=0、风险有 owner/acceptor/deadline；`不通过`：任一 P0/VETO/S/证据硬门禁失败。 | Step 12/13；验收规范 |
| 哪些角色签署？ | Owner/业务、架构、测试、实施、运维/安全/合规、验收负责人；姓名/日期在送验资料中补齐。 | 验收规范 §4.2；治理粒度参考 |
| 签署是否代表风险接受？ | 不代表。签署确认结论和已列风险；风险接受必须在 `risk-acceptance.md` 逐项由 acceptor 明确。 | Step 13 |
| 当前能否填写结论？ | 不能。当前无真实 run/artifact/report/evidence、缺陷、VETO checklist、acceptor 或 signoff。 | 台账和 Step 3/10/13 |

## 4. 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 使用“基本通过/原则上通过” | 无法作为放行条件 | 只保留三值结论 |
| 缺 evidence 仍填写通过 | 伪造验收事实 | 缺基线/证据只能暂停或不通过 |
| 签署人自动成为风险接受人 | 责任边界不清 | 签署与 risk acceptance 分离 |
| P1 blocked 被误写为 P0 fail/pass | 结论越界 | 根据范围和 evidence ceiling 进入 residual/blocked |
| 只签业务不签安全/架构 | 无法确认 VETO/ownership | 角色矩阵覆盖所有门禁责任 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 结论 | 模糊措辞 | 通过/有条件通过/不通过 | 可裁决 |
| 缺证据 | 可能口头补齐 | 暂停/不通过 | 保证证据真实性 |
| 签署 | 泛化审批 | 多角色责任 + risk acceptance 分离 | 责任可追踪 |
| 当前状态 | 容易误填完成 | `not_adjudicated` | 不伪造事实 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只用 pass/fail | 简单 | 无法表达已接受 residual | 拒绝 |
| 增加“部分通过/基本通过” | 灵活 | 不可作为明确放行门禁 | 拒绝 |
| 三值最终结论 + 独立暂停姿态 + 角色签署表 | 与规范一致，能表达 conditional 和不可裁决 | 需要严格证据和风险文件 | 采用 |

## 7. 结构化中间产物

### 7.1 结论判定矩阵

| 条件 | 允许结论 | 说明 |
|---|---|---|
| 全部 P0 AC 真实证据通过；VETO-SYNC-001~005 未触发；S=0；evidence index/raw/report/redaction/dependency/report audit 完整；无未接受 A | `通过` | 可进入下一阶段或发布准备；仍不等于 Artifact/Baseline/Review accepted/readiness，除非其 owner 各自另有正式事实 |
| P0 主线真实证据成立；VETO 未触发；S=0；存在已由指定 acceptor 接受、具 deadline/trigger/follow-up 的 A/B/R residual | `有条件通过` | 只能在 risk-acceptance 完整且不触碰硬门禁时进入下一阶段；必须跟踪条件 |
| 任一 P0 AC 失败；VETO 命中；S 未关闭；缺 run/baseline/raw/report/evidence；redaction/dependency/report audit failed；风险无 acceptor；设计契约无法绑定 | `不通过` 或暂停验收 | 必须修复/补齐并按 Step 12 复验；不得用口头确认覆盖 |
| 当前只有 calibration/计划 ID，无真实送验 | `not_adjudicated`（过程状态） | 不得填入最终报告或签署；正式 06 只定义规则 |

### 7.2 签署角色表

| 角色 | 责任 | 签署确认范围 | 当前值 |
|---|---|---|---|
| Owner / 业务负责人 | 目标、范围、业务 residual | 验收目标/范围和已列业务风险 | `<name/date/signoff>` 待填 |
| 架构负责人 | ownership、依赖裁剪、红线/VETO | 数据边界、架构和 VETO 口径 | `<name/date/signoff>` 待填 |
| 测试负责人 | TC、suite、EV、artifact/report、缺陷/复验 | P0 测试和证据完整性 | `<name/date/signoff>` 待填 |
| 实施负责人 | implementation/build/config 送验事实 | 送验版本、配置和技术 residual | `<name/date/signoff>` 待填 |
| 运维/安全/合规负责人 | redaction、dependency、evidence retention/handoff | 安全、审计和合规 residual | `<name/date/signoff>` 待填 |
| 验收负责人 | 最终结论与风险文件一致 | 三值结论和签署材料一致性 | `<name/date/signoff>` 待填 |

### 7.3 签署含义与禁止事项

| 事项 | 口径 |
|---|---|
| 签署验收结论 | 表示签署人确认送验范围、证据和结论口径，不创造外部 Artifact/Baseline/Review accepted truth |
| 接受 residual 风险 | 必须单独写入 `reports/acceptance/risk-acceptance.md`，由 acceptor 逐项确认 |
| ACK/HTTP 200/local commit | 不构成签署、不构成 accepted/approved/signoff |
| 缺 evidence/基线/审查 | 只能暂停或不通过，不能由签署补洞 |
| P1 blocked/waiting | 不写成 P0 passed；须按 risk/residual 或下一轮基线处理 |

### 7.4 最终结论停审记录

| 审计项 | 结论 | 说明 |
|---|---|---|
| 三值结论是否唯一 | pass | 仅通过/有条件通过/不通过 |
| 暂停/不可裁决是否与最终结论分离 | pass | 当前设计阶段为 not_adjudicated |
| VETO/S/证据失败是否可被 conditional 覆盖 | pass | 明确禁止 |
| 签署是否与风险接受分离 | pass | risk-acceptance 独立文件和 acceptor |
| 当前是否填写真实 verdict/signoff/readiness | no | 当前不存在送验证据与责任人实例 |

## 8. 回填草稿

正式 §14 应只允许“通过”“有条件通过”“不通过”，并列出判定矩阵和角色签署表。缺 baseline/run/raw/report/evidence、命中 VETO/S、redaction/dependency/report audit 失败或风险无接受人时不得通过；签署不自动接受风险，risk acceptance 必须独立记录。当前正式文档不得填写实际 verdict、签署姓名、日期或 readiness。

## 9. 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| 实际送验结论、run、defect、VETO checklist | 决定最终三值结果 | 正式验收执行后 |
| 各签署角色与姓名/日期 | 决定签署文件可用性 | 验收交接前 |
| risk-acceptance acceptor/deadline | 决定是否允许有条件通过 | Step 13/正式交接 |

## 10. 进入下一步条件

- [x] 三值结论、暂停姿态和判定条件已固定。
- [x] 签署角色、签署含义与风险接受分离已固定。
- [x] 当前不填写真实 verdict/signoff/readiness。
- [x] 正式 §14 回填草稿已形成。
- [x] 本步停审；进入 Step 15 前读取所有 Step 1～14、本正式 06 旧文件诊断和书写规范主链。

## 11. Step 停审记录

- 本步裁决：`pass_with_upstream_blockers`。
- 结论和签署规则已冻结，当前仍 `not_adjudicated`，未产生任何实际结论或签署。
- 下一步阅读：06 flow、Step 1～14、正式 00～05、06 书写规范 §3/§4，创建 Step 15。
