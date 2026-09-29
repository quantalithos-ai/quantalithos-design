# Step 14. 定义最终结论与签署口径

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 14\
> 正式回填：`06-验收标准.md` §14\
> 日期：2026-09-14\
> 状态：`completed / three_value_aggregation_and_signoff_closed_unsigned / continue_authorized`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 当前 Step | Step 14：定义最终结论与签署口径 |
| 目标 | 固定三值裁决的聚合顺序、维度、进入下一阶段/发布准备条件、签署职责及其与 risk acceptance 的边界 |
| gate_status | `completed / three_value_aggregation_and_signoff_closed_unsigned` |
| gate_reason | `not_entered` 与三值 verdict 分离；通过/有条件通过/不通过的 P0、VETO、defect、evidence、formal seam、risk 条件闭合；签署角色、顺序、拒签/分歧与重签规则可判定；当前无 verdict/signoff 实例 |
| next_allowed_action | 按连续授权创建 Step 15，整体重建正式 `06-验收标准.md` 并停审 |
| source_files | 06 Step 1～13；验收 SOP/书写规范；正式 05 §12～14；L1-governance/workspace Step 14 粒度样本 |

| 小阶段 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 14A | 过程姿态与三值分离 | done | `not_entered` 不是“不通过”或“有条件通过” |
| 14B | 维度与总体聚合 | done | P0/VETO/evidence/formal/risk 无平均、投票或局部覆盖 |
| 14C | 下一阶段与发布准备 | done | 设计链推进、真实验收放行、生产 readiness 分开 |
| 14D | 签署职责与顺序 | done | 具名 authority、范围、拒签/分歧/失效完整 |
| 14E | 停审与跨结论审计 | done | 不填姓名、日期、结论、接受或 readiness |

## 2. 过程姿态与正式结论

| 类别 | 合法值 | 使用时机 | 当前值 / 限制 |
|---|---|---|---|
| 验收过程姿态 | `not_entered`,`in_review`,`paused`,`decision_ready`,`decided` | 描述是否具备真实 baseline/run/package 和裁决进度 | `not_entered`；这不是三值 verdict |
| 维度/总体 verdict | `通过`,`有条件通过`,`不通过` | 只有实际验收已进入且证据可裁决时填写 | 当前不存在，禁止预填 |
| VETO posture | `not_triggered`,`triggered`,`undetermined` | 对每个 VETO 的真实 evidence review | 当前无实例，禁止默认全绿 |
| risk posture | `proposed`,`under_review`,`accepted`,`rejected`,`expired`,`superseded` | 对每个 eligible residual 的具名决定 | 当前无实例 |
| signoff posture | `pending`,`signed`,`rejected`,`withdrawn`,`superseded` | 对固定 decision package 的具名签署 | 当前无实例 |

正式 06 的文档停审只表示“裁决规则设计完成，可供 07 规划引用”；它不把当前过程姿态改成 `in_review/decided`，也不产生任何验收 verdict、发布许可或生产 readiness。进入后续正式文档仍受用户明确授权与项目文档门禁控制，而非由未来验收签署自动授权。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 结论只能有哪些取值？ | 只允许“通过”“有条件通过”“不通过”。尚未送验使用过程姿态 `not_entered`，不造一个三值结论。禁止“基本通过/原则上通过/局部通过但整体通过/后补”。 |
| 何时允许进入下一阶段？ | 对真实实现/发布流程：所有 P0/formal/evidence 通过，10 VETO 有证据未触发，S=0，未接受 A=0，签署完整；有条件通过只可带已正式接受且不污染 P0 的 residual。对设计文档 06→07：正式 06 停审后仍须用户新授权，不依赖虚构验收。 |
| 何时允许发布准备？ | 真实 verdict 为通过或合格的有条件通过，固定 delivery/env/config/run/acceptance package 未漂移，发布范围内 P1/P2 条件按基线完成，且签署未撤销/过期；仍不等于部署或生产 readiness。 |
| 哪些角色必须签署？ | 验收负责人、L4-archive 实施 owner、测试/证据 owner、架构/依赖 owner、安全/数据/records owner；每个实际纳入的 source/governance/storage/integrity/observability/restore target 还需其合同/接缝 owner 提供 closure review。 |
| 签署是否代表风险接受？ | 不代表。风险必须由有权限的具名 acceptor 在 `risk-acceptance.md` 逐项接受；最终签署只确认固定清单、证据和结论一致。任何签署都不能接受 VETO/S/P0 blocker 或改 raw。 |

## 4. Historical material 诊断与裁决取舍

| 历史/宽松口径 | 当前处置 | 理由 |
|---|---|---|
| `[待评审]` 单格或 TL/QA/SRE 泛角色 | 分维度三值 + 具名责任/authority + package identity | 可判定、可追责 |
| 功能大多通过即可整体通过 | 任一 required P0 非通过即总体不通过 | 不以平均/投票覆盖红线 |
| 局部 seal/verify/handoff success 代表归档/恢复成功 | 各维度独立，禁止 owner/project/global state 推导 | 所有权与 phase 隔离 |
| 签字可补证据或接受 blocker | 签署只能确认现有 qualified package | 防 authority/evidence 越权 |
| 文档写完即可进入实现/发布 | 设计授权、真实验收、发布准备三条门禁分开 | 不伪造 delivery/readiness |

| 议题 | 采用方案 | 未采用方案 |
|---|---|---|
| 聚合优先级 | VETO/P0/evidence/formal hard gate 优先；其后 defect/risk；最后签署 | 以通过率、票数或多数维度平均 |
| undetermined VETO | 阻止通过/条件通过；若已进入且到裁决时仍未解决，结论不通过 | 当作未触发或留空仍签署 |
| accepted residual | 只允许 P0 已独立通过后的有限 A/B/R/P1/P2 | 用 risk acceptance 关闭 P0 blocker |
| 当前结论 | `not_entered`，verdict 空 | 预填“不通过”或“有条件通过” |

## 5. 结构化中间产物

### 5.1 裁决聚合顺序

```text
fixed baseline + acceptance entry
             |
             v
P0 AC / formal seam / evidence completeness
             |
             v
10 VETO: all evidenced not_triggered?
             |
             v
defects: S=0, A disposition valid?
             |
             v
eligible residuals individually accepted and unexpired?
             |
             v
dimension verdicts -> overall worst-result aggregation
             |
             v
named responsibility reviews and signoffs on same package
```

关键说明：任一节点失败均不能由后续节点修补。维度聚合采用最严格结果：任一“不通过”→总体“不通过”；没有不通过但存在有效条件→总体“有条件通过”；只有所有维度通过且无 active condition→总体“通过”。签署是最后确认，不参与多数投票。

### 5.2 三值裁决矩阵

| 判定面 | 通过 | 有条件通过 | 不通过 |
|---|---|---|---|
| P0 AC（FUNC/RL/CMD/QUERY/EVENT/JOB/SYNC/STATE/TX/IDEM/CONC/EFFECT/NFR/EVID） | 全部适用项 qualified passed | 仍须全部 passed | 任一 failed/blocked/infra/not_run/unqualified/missing |
| formal seams | 每个 required target 独立 formal passed，owner closure 可核验 | 仍须全部 passed | 任一缺 target/合同/vector/binding/finality 或被 fake/local 替代 |
| VETO | 001～010 全部有证据 `not_triggered` | 同左 | 任一 `triggered` 或 `undetermined` |
| defects | S=0、A=0；B/R 不在 scope 或已关闭 | S=0；仅有限 A/B/R 有合格且未过期接受 | S>0、未接受/越界 A、争议影响未知 |
| evidence/review | fixed-run raw/report/19 EV/七 report/四 acceptance 文件/具名 review 全部有效 | 同左 | 缺失、泄漏、static/latest/cross-run、匿名/争议未解 |
| risk acceptance | 无需 active condition | 每项 eligible、具名、basis/action/deadline/re-entry 完整且未过期 | 接受 P0/VETO/S，或缺 acceptor/evidence/action/time |
| baseline | delivery/design/Core/env/config/data/run/target package 完整未漂移 | 同左 | 缺失、漂移或旧证据支撑新 baseline |

### 5.3 最终维度结论表模板

实际裁决时每个维度只能填三值之一并引用固定 package；本文件不填实例。

| 维度 | 未来结论 | 最小输入 | 说明 / 聚合约束 |
|---|---|---|---|
| 功能验收 | `<通过|有条件通过|不通过>` | `AC-AR-FUNC-001～009` + related C/Q/E/J/EV | 9/9 P0 required；局部能力不覆盖其他项 |
| 数据/架构/依赖 | `<...>` | `RL-AR-001～012`、source matrix、SYNC-003/004、dependency report | owner zero-write、Auxiliary、compile/fake/outbound 红线 |
| 接口/事件/状态/一致性 | `<...>` | 30/32 surfaces、18 states、TX/IDEM/CONC/EFFECT | ACK/local/external/owner finality 和 unknown 分开 |
| 非功能验收 | `<...>` | `AC-AR-NFR-001～008`、structural P0、formal targets | measured P2 不得生成无来源 verdict |
| 证据/审计 | `<...>` | `AC-AR-EVID-001～010`、19 EV、report/review | raw first、same-run、redaction、no-static |
| 发布准备 | `<...>` | 上述维度 + defects/risk/signoff + release scope | 只表示可进入准备，不表示部署/生产 ready |
| 总体结论 | `<...>` | 所有维度最严格聚合 | 禁止平均、投票或模糊语言 |
| 是否允许进入下一实施/发布阶段 | `<是|有条件|否>` | 总体结论与有效条件清单 | “是/有条件/否”不是额外 verdict；必须与总体一致 |

### 5.4 当前姿态表

| 项 | 当前姿态 | 原因 |
|---|---|---|
| 06 裁决规则设计 | Step 14 completed；待 Step 15 装配 | 仅文档工作 |
| acceptance execution | `not_entered` | delivery/env/data/run/handoff/review 均无真实实例 |
| required formal P0 | `blocked` | 12 upstream/architecture + 6 local pending 开放 |
| actual dimension / overall verdict | absent | 未进入，不能填三值 |
| risk acceptance | 0 | 无具名 acceptor/basis/action/deadline instance |
| signoff | 0 | 无固定实际 decision package |
| release/readiness | 0 | 无实现、运行、验收或部署事实 |

### 5.5 签署角色与职责

| 角色 | 必须确认 | 不得代表 | 当前 |
|---|---|---|---|
| 验收负责人 | entry/exit、三值聚合、VETO/risk/signoff package 一致，作最终裁决 | 补 raw、替 owner 接受 formal gap | `<name/status/date unset>` |
| L4-archive 实施 owner | immutable source/build、实现范围、缺陷修复/change identity、无越界写面 | 测试结果或上游 truth | unset |
| 测试与证据 owner | 102 TC、suite/gate、19 EV、raw/report/digest、failed/fixed pairing 与 review completeness | 手改 status、决定业务风险 | unset |
| 架构与依赖 owner | truth boundary、30/32、12 RL、compile/runtime/event/ref/adapter/fake、outbound posture | 接受安全泄漏或 owner finality | unset |
| 安全/数据/records owner | visibility/redaction、secret/body、custody、evidence retention 操作与安全 residual | 决定项目状态、retention/delete business truth（除非也是正式 owner） | unset |
| Source/governance/artifact/workspace/observability seam owner（按 scope） | 自己 target 的 contract/version/fence/coverage/material/decision/closure proof | 其他 target 或 Archive 总体验收 | unset |
| Storage/integrity/restore receiver seam owner（按 scope） | 自己 target 的 binding/finality/probe/compatibility/compensation 语义 | 用 ACK/config 代 commit/Verified/restored | unset |
| 产品/业务 owner（若 scope 要求） | 验收范围、用户价值、P1/P2 是否纳入和 eligible residual | 降级 P0 或接受 VETO/S | unset |

### 5.6 签署顺序、分歧与失效

1. 测试/证据 owner 先确认 fixed raw/report/EV 和缺陷复验；实施 owner 确认 delivery/change identity。
2. 架构、安全/数据/records 及每个适用 seam owner 对各自边界/closure review；任何拒绝或争议使 package 未就绪。
3. eligible residual 由对应具名 acceptor 逐项处理；这一步独立于最终签署。
4. 验收负责人核对相同 immutable package 后填写三值与最终签署；不得先签后补 evidence/risk。
5. 任一签署 `rejected/withdrawn`、package baseline 改变、risk 过期、new VETO/S/evidence conflict 出现，最终决定自动失效/暂停；影响回归和重新签署使用新 package version，旧签署保留历史。

## 6. 结论与签署停审 / 跨项审计

| 审查项 | 设计结论 | 当前事实 |
|---|---|---|
| 三值是否唯一 | 是 | 无 verdict instance |
| not_entered 是否被写成不通过 | 否 | 当前仅过程姿态 |
| P0/formal/VETO/evidence 是否可被条件覆盖 | 否 | 当前均未满足/未运行 |
| 维度聚合是否允许平均/投票 | 否 | 最严格结果 |
| 发布准备是否等于生产 readiness | 否 | readiness=0 |
| 签署是否等于风险接受 | 否 | risk acceptance=0 |
| seam owner 是否越权签其他 truth | 否 | 每 target 独立 |
| 分歧/撤签/baseline 漂移是否有处理 | 是 | 新 package/review/signoff |
| 06→07 是否被自动授权 | 否 | 仍需用户明确授权 |
| 姓名/日期/结论是否伪造 | 否 | 全部 unset |

## 7. 回填草稿

正式 §14 应回填过程姿态与三值分离、聚合流、三值矩阵、维度模板、当前姿态、签署职责与失效规则。正文必须明确当前 `acceptance_execution=not_entered`、formal P0 blocked、actual verdict/risk/signoff/readiness 均不存在；正式 06 停审后进入 07 仍需用户新授权。

## 8. 对上游影响与待确认事项

| 项 | 结论 |
|---|---|
| 00～05 回写 | 无；结论只聚合既有 AC/VETO/evidence/defect/risk，不新增需求或 owner |
| 新 blocker | 无 |
| 持续 blocker | 18 项全部开放；当前不具备实际通过或有条件通过条件 |
| 待 Step 15 | 15 章正式装配、具体 calibration 来源、跨门禁总审计和正式 06 停审 |
| 待未来执行 | 真实签署人/authority、package version、结论、日期与发布决定；本文不创建 |

## 9. 进入 Step 15 条件

- [x] `not_entered` 与三值 verdict、VETO/risk/signoff posture 分离。
- [x] 通过/有条件通过/不通过的所有 P0、formal、VETO、defect、evidence、risk 条件可判定。
- [x] 维度与总体采用最严格聚合，不允许平均、投票、局部成功或签署补洞。
- [x] 下一阶段、发布准备、生产 readiness 和 06→07 用户授权边界明确。
- [x] 签署职责、scope-specific seam review、顺序、分歧、撤签与失效规则完整。
- [x] 未伪造 verdict、risk acceptance、signoff、release 或 readiness。

当前 `gate_status`：`completed / three_value_aggregation_and_signoff_closed_unsigned`。

`next_allowed_action`：按连续授权创建 Step 15，整体重建正式 06 并停审。
