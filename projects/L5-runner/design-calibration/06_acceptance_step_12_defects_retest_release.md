# Step 12. 定义缺陷分级、复验与放行规则

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 12  
> 回填章节：`06-验收标准.md` §12 缺陷分级、复验与放行规则  
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与事实边界

| 项 | 当前值 |
|---|---|
| current_document | `06-验收标准.md` |
| current_step | Step 12 |
| current_module | `defect_retest_release:S_A_B_R_lifecycle_impact_regression` |
| gate_status | `pass_for_step_13` |
| defect_model | `S / A / B / R` |
| actual_defect_records | 0（未进入实际验收，不等于“零缺陷”） |
| actual_retest_runs | 0 |
| release_decision | `none` |
| formal_06_write_allowed | `false_until_step_15` |
| next_allowed_action | 创建并完成 Step 13 |

本步只定义未来缺陷如何影响裁决。没有 fixed run 和缺陷系统事实时，不能创建虚构 `BUG-*`、填写数量、负责人、关闭日期或复验结果；`actual_defect_records=0` 仅表示本轮设计工作未产生实际记录。

## 2. 输入、目标与边界

| 输入 | 用途 |
|---|---|
| 05 Step 11/14、正式 §11/§14 | S/A/B/R 测试管理、影响面复验、残余风险和全量触发 |
| 06 Step 4 | entry/exit、暂停、退出与缺陷先决条件 |
| 06 Step 5～10 | AC、红线、协议、状态、NFR 和 evidence failure 的分类上下文 |
| 06 Step 11 | 12 项 VETO，定义 S 级不可降级边界 |

目标是把“发现 → 分类 → 隔离/暂停 → 修复 → 复验 → 证据审查 → 关闭/遗留 → 最终放行”收敛为可判定合同。缺陷工单不改写 TC/raw evidence、Runner 状态或 owner truth；实际工作平台、字段实现和排期留给后续实施流程。

## 3. SOP 问题回答

| 问题 | 收口答案 |
|---|---|
| S/A/B 如何定义？ | 保留 05 的 S/A/B/R 四级：S=VETO/安全真相证据破坏；A=P0 blocking failure；B=非 P0 局部问题；R=范围外或等待 authority 的 residual。R 不是“轻微缺陷”，也不计测试通过。 |
| 每级如何影响结论？ | 开放 S 必为不通过；开放 A 默认不能通过，仅在证明 P0 主线不受影响且满足 Step 13 严格接受时才可能有条件通过；B/R 不改变 P0 pass，但必须完整登记。 |
| 修复后如何复验？ | 新 fixed run，原失败 TC + 同 family 正负/边界/Unknown + 共享 contract/state/UoW/config/redaction/dependency/report 影响面；S 与共享红线变更触发全量 P0。 |
| 哪些可风险接受？ | S/VETO、P0 truth/security/redaction/dependency/config fail-closed/evidence integrity 不可接受。A 仅极窄条件可候选，B/R 可候选，但必须由 Step 13 完整结构和有权角色确认。 |
| 哪些阻断下一阶段？ | 任一开放 S、未满足严格接受的 A、required gate failed/blocked、修复未复验、证据/检查不完整、争议未关闭或退出条件未满足。 |

## 4. 缺陷等级与裁决影响

| 级别 | 定义与 Runner 例子 | 立即动作 | 关闭/遗留条件 | 对 verdict / 放行影响 |
|---|---|---|---|---|
| `S` | 任一 `VETO-RUN-001~012` hit；truth write、危险清理/重放、泄露、私有依赖、配置/证据/verdict 造假 | 暂停验收和相关执行；保存失败证据；安全处置；修复并扩大复验 | 只可修复关闭；新 run 全量 P0 + relevant checks + 独立 review；不可风险接受 | 开放或复验未清除：只能 `不通过`，不得进入下一阶段/发布准备 |
| `A` | target-tier P0 gate/AC/NFR/suite 失败但未命中 VETO；核心语义无法稳定证明 | 阻断相关范围，分析 root cause/impact，修复并复验 | 默认修复关闭；极窄例外需证明 P0 主线不受影响、补偿可执行，并经 Step 13 有权接受 | 开放未接受：不能通过；合格接受后最多 `有条件通过`，通常仍阻断 release |
| `B` | P1/非核心 UX、可读性、维护性或 baseline 未升格的局部问题，且无安全误导 | 登记影响与排期；验证不触 P0/VETO | 修复关闭，或 Step 13 接受并给 owner/deadline/trigger | 可支持 `通过` 或 `有条件通过`，取决于 baseline 与风险结构；不贡献 P0 pass |
| `R` | 已确认范围外、等待 upstream/operations authority、无 hard threshold 的 measurement、未启用 positive slot | 保持 blocked/residual，列 trigger/owner/mitigation | authority 到位重开设计/测试；或在当前 target tier 明确接受 | 不计缺陷通过；可成为有条件通过遗留，但 required target item 不能以 R 绕过 |

## 5. 缺陷生命周期与不可变证据

### 5.1 状态合同

```text
Observed
  -> Triaged
  -> Confirmed | Harness/Infrastructure Blocked | Disputed
  -> Fix Planned
  -> Fixed Candidate
  -> Retest Pending
  -> Retest Passed | Retest Failed | Retest Blocked
  -> Closed | Residual Accepted | Reopened
```

| 状态规则 | 约束 |
|---|---|
| `Observed/Triaged` | 不得直接计入“已知缺陷数=0”；需绑定 source run/TC/gate 或受限人工发现 ref |
| `Harness/Infrastructure Blocked` | 不伪造业务失败/pass；修复 harness 后新 run，原 not-run/blocked 保留 |
| `Disputed` | 不等于关闭或 clear；required gate 仍不能通过，独立 review 记录争议 |
| `Fixed Candidate` | 仅表示变更待复验，不能关闭缺陷或改写旧 run |
| `Retest Passed` | 需要新 run、原失败 + 影响面结果、checks 与 evidence pair；单一截图/日志不足 |
| `Residual Accepted` | 仅 A/B/R 且 Step 13 完整、非 VETO；接受不改写原 failed/blocked status |
| `Closed` | closure report 回指失败与修复证据、回归范围和 review；S 只能由修复+复验关闭 |
| `Reopened` | 复发、证据 invalid、source digest mismatch 或影响面遗漏时必须重开 |

### 5.2 最小缺陷记录结构

| 字段组 | 必需内容 |
|---|---|
| identity | stable defect ref、级别、状态、发现时间/角色（实际发生后填写） |
| source | source run、TC/CUT/suite/gate/AC/VETO、artifact/report/evidence/check refs+digests |
| impact | target tier、影响范围、truth/security/evidence/owner boundary、用户可见后果 |
| diagnosis | safe symptom、root-cause status、affected version/config/platform、redacted refs |
| correction | fix/change refs、受影响 contract/state/config/dependency、迁移/兼容影响 |
| retest | predecessor/new run、必跑集合、actual results、remaining blocked/not-run |
| disposition | closed/residual/reopened、风险接受 ref、owner/acceptor/deadline/trigger（适用时） |

## 6. 复验选择与强制全量规则

### 6.1 影响面复验矩阵

| 触发面 | 原失败与同 family | 必跑 suite/check | 扩展断言 |
|---|---|---|---|
| context/selector/authority/material | CTX/MAT/CON/ENT/CFG | CONTRACT/DOMAIN/SERVICE/CONFIG/CONTROLLED/SECURITY | explicit version/scope/generation、zero unsafe call、digest/qualification |
| request/control/owner status | REQ/CTL/OWN | SERVICE/UOW/CONTROLLED/ENTRY/REPLAY | accepted≠running、intent≠result、source/freshness、no truth write |
| resource/cleanup/recovery | RES/REC/JOB | DOMAIN/UOW/JOB/REPLAY/CONTROLLED | lease/guard/generation、no delete/replay、RecoveryCase/readback |
| preview/diagnosis/handoff | PRE/OBS/QRY | SECURITY/SERVICE/ENTRY/REPLAY + redaction | forbidden corpus、visibility/freshness、local≠formal evidence |
| Query/Consumer/Job/event | QRY/CNS/JOB/BND | SERVICE/ENTRY/CONSUMER/JOB/UOW/SECURITY | Query write=0、payload/ACK=0、owner repair=0、event=0 |
| idempotency/UoW/store | IDM/UOW/REC/JOB | SERVICE/UOW/REPLAY/JOB | same digest exact replay、different conflict、commit unknown、restart parity |
| config/dependency/platform | CFG/CON/RES/BND | CONFIG/CONTRACT/CONTROLLED/SECURITY | strict parse、profile isolation、no private seam、capability/unsupported |
| artifact/report/evidence | affected source TC + OBS/BND | source suites + all four checks + report/review | fixed run、pairing/link/no-static、redaction、old run immutable |

### 6.2 必须全量 P0 的触发

- 任一 S/VETO 修复，或之前未检测到 VETO 的 harness/check 修复。
- truth owner、协议 metadata、状态/转换、UoW/idempotency/recovery、config schema/readiness、redaction/dependency/evidence schema 变化。
- 上游正式 seam 首次闭合或版本/authority 变化：先回写 00～06 的受影响设计，再执行全量。
- 跨平台资源/cleanup、SDK adapter、durable store、report generator 等共享基础设施变化。
- 复验出现新的 failed/blocked/incomplete、source digest mismatch、范围选择争议或跨 run 污染。

全量集合沿用 05：全部 target-tier required suites、108 planned TC 中适用分母、四项 integrity checks、18 slot/report generation 与 acceptance review。blocked/not-run 不从分母删除。

## 7. 修复关闭证据与复验裁决

| 关闭检查 | S | A | B | R |
|---|---:|---:|---:|---:|
| 原失败 fixed run/raw/report/check 保留 | 必需 | 必需（如已执行） | 相关时 | 有执行时 |
| root cause、影响面、fix/change ref | 必需 | 必需 | 必需 | authority/原因 ref |
| 新 fixed run + 原 TC + 影响面 | 必需 | 必需 | 相关时 | trigger 后必需 |
| relevant redaction/dependency/link/pairing | 必需 | 相关时必需 | 相关时 | 相关时 |
| full P0 regression | 必需 | 共享/P0 变化时 | 否，除非影响 P0 | authority/contract 变化时 |
| independent review | 必需 | 必需 | 接受时必需 | 接受时必需 |
| risk acceptance | 禁止 | 极窄候选 | 可候选 | 可候选 |
| 实际关闭/接受事实 | 当前不存在 | 当前不存在 | 当前不存在 | 当前不存在 |

复验结果必须按 new run 原样记录：`passed` 只清除被证明的断言；`blocked/not_run/incomplete` 不能关闭 required defect；一次成功不能覆盖旧失败，也不能借局部 family pass 推出 target-tier 全部通过。

## 8. 放行规则

| 放行层级 | 必须满足 | 不得满足/不得替代 |
|---|---|---|
| 继续验收执行 | 无开放 S 安全处置；harness/check 可执行；baseline/run identity 仍有效 | 不能用“已提交修复”替代复验；不能修改旧 run |
| 进入 final decision | S=0；A 全关闭或具有合法候选接受；required gate/evidence/VETO 已裁决；争议有 review | open required blocked、未复验 fix、缺 pair/check、unknown VETO |
| `通过` | S=0、A=0；全部 target-tier P0 passed；无未接受 required residual；证据/签署完整 | B/R 不得隐藏；profile/文档完成不等通过 |
| `有条件通过` | S=0；P0 主线成立；仅合法 A/B/R residual；Step 13 全字段与有权接受；期限/trigger 可跟踪 | VETO、P0 truth/security/evidence、required positive blocked 不可被接受 |
| `不通过` | 任一 VETO hit/open S；required P0 failed；或无法满足退出门禁且已进入裁决 | 不得用多数通过、风险签字或本地成功改写 |

“release”在本步只表示允许进入下一阶段或发布准备的验收裁决条件，不是生产发布命令，也不声称 production readiness。

## 9. 缺陷与 VETO/风险/证据一致性审计

| 审计项 | 结论 | 处理 |
|---|---|---|
| S 是否与 12 VETO 一致 | pass | 任一 VETO hit 必为 S；S 不可降级/接受 |
| A 是否可能绕 P0 | no | 默认阻断；极窄接受必须先证明 P0 主线成立并由 Step 13 收口 |
| B/R 是否被计 pass | no | 只登记 residual；required item 不能改成 R 绕过 |
| harness failure 是否伪业务结论 | no | 单列 blocked/not_run，修复后新 run |
| 复验是否覆盖影响面 | pass_for_design | §6 family/suite/check + full triggers 可执行 |
| 旧失败是否可被覆盖 | no | immutable old run + superseding ref |
| 缺陷状态是否反写 TC/owner truth | no | raw status、Runner/owner state 均不变 |
| 当前是否伪造 zero defects/closed/retest | pass | actual records/runs 为 0 仅因未进入；无实际统计或结果声明 |

## 10. 回填草稿、blocker 与下一步

正式 §12 应收录 S/A/B/R、生命周期、最小记录、复验矩阵、全量触发、关闭证据和分层放行规则。不得写“当前零缺陷”，不得生成 `BUG-*`、负责人、日期、修复 commit 或实际复验结论。

| blocker | 影响 | 当前处理 |
|---|---|---|
| `RUN-DDD-001~003` | 无实现、缺陷来源 run 和复验环境 | 只定义合同，不创建记录 |
| `RUN-UP-001~008` | 多个 positive family 仍 blocked | 作为 R/blocked 候选，不计 pass；启用后重开 |
| `RUN-OPS-001~002` | release/SLO/GRC authority 缺失 | 不声明 release readiness；target tier 仍受限 |
| `RUN-DOC-002~003` | 正式 06/07 未完成 | 继续串行，不提前关闭 |

- [x] S/A/B/R 对 verdict 和放行的影响可判定。
- [x] 缺陷生命周期不改写 raw evidence 或 owner truth。
- [x] 修复后影响面与强制全量 P0 触发完整。
- [x] S/VETO 与不可风险接受边界一致。
- [x] 当前未生成缺陷、复验、关闭或 release 事实。
- [x] 允许进入 Step 13；正式 06 仍禁止写入。
