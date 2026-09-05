# Step 5. 定义功能验收门禁

> 对应 SOP：standards/document/验收标准讨论流程_SOP.md Step 5
> 回填章节：06-验收标准.md §5
> 粒度参考：projects/L1-governance/design-calibration/06_acceptance_step_05_function_gate.md

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 5 定义功能验收门禁 |
| 当前状态 | 已完成；本轮连续授权并保留独立停审记录 |
| 输入基线 | Step 2~4；00 AC-L2M-001~018；03 §5~§8；05 §5~§6、§13 |
| 输出文件 | projects/L2-member/design-calibration/06_acceptance_step_05_function_gate.md |

## 2. 本步目标

把五个核心能力和 FR-L2M-001~012 / E01~E03 转成可裁决的功能门禁。每项 P0 必须绑定正式设计契约、planned TC、planned EV candidate、固定 report path 和失败影响；candidate 不是已生成证据。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| 00 §7、§9、§14 | C-L2M-1~5、FR、AC 与 VF |
| 03 §5~§8 | 模块、对象、协议和函数级 flow |
| 05 §5~§6、§13 | 追溯矩阵、TC、EV 族和报告路径 |
| Step 2~4 | 范围、基线和进入 / 退出前置 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 P0 功能的通过条件是什么？ | 正式 local truth / safe carrier / view 按 03 的 flow 和状态成立，负向边界成立，且有真实 artifact/report 生成的 EV 支撑。 |
| 失败条件是什么？ | 核心对象不能形成、关键分支缺失、foreign truth 被写入、body-free / no-write / owner fence 失败、或证据不能回指固定 artifact。 |
| 证据来自哪里？ | 05 的 TC-L2M-CMD/QRY/CON/JOB/COMMON、EV-CAND-L2M-* 规划槽位，以及执行时 reports/runs/<run_id> 的 suite report。 |
| 哪些 P1 只做后置边界验收？ | host / Runtime / Bus / resolver / image / durable-like 的真实正向资格和能力出口授权；只在 blocker 关闭后 selected-run。 |
| 哪些失败影响总体不通过？ | 任一 P0 AC-L2M-001~017 失败；AC-L2M-018 的外围缺失仅在其被错误宣称核心时影响结论；命中 VF 则不可风险接受。 |
| 是否逐项停审？ | 是。每项审查设计来源、TC、EV candidate、report path、失败影响和 phase 边界；所有项完成后再做跨功能审计。 |

## 5. 当前文档问题诊断

| 材料 | 问题 | 处理 |
|---|---|---|
| 旧 06 | 只写 persona / endpoint“可用”，没有 local truth、safe material、projection 和 no-write 门禁 | 按 C1~C5、FR 和 AC 逐项重建 |
| 05 | EV 仍是 planned schema | 06 只引用候选 / 族，并要求执行时由真实 artifact/report 生成 |
| 外部 seam | 容易把 host / Runtime / Bus 成功当作 member 功能成功 | 仅验 local attempt / gap / blocked / unknown |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| 功能对象 | 旧 persona / endpoint | C-L2M-1~5、FR-L2M-001~012 和外围 E01~E03 |
| 通过条件 | API 返回或 DB 存在 | 正式 truth、边界、TC、EV、report 和失败影响闭环 |
| 外部结果 | accepted / delivered 等混写 | local decision / attempt / gap / blocked / unknown 分层 |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| AC 是否合并成五项 | 合并 / 保留 001~018 稳定编号 | 保留稳定编号，便于缺陷定位和追溯 |
| smoke 是否可替代详细用例 | 可以 / 不可以 | 不可以；smoke 只作代表性补充 |
| P1 正向联调是否证明 P0 | 是 / 否 | 否，P1 需独立 selected-run |

## 8. 结构化中间产物

### 8.1 功能验收门禁表

| 验收项 | 功能 / 场景 | 优先级 | 通过条件 | 失败条件 | planned TC / EV candidate |
|---|---|---:|---|---|---|
| AC-L2M-001 | C1 在场成立 | P0 | 双锚、startup context、local presence 和 host material/attempt 边界均成立 | 错主语、未验证语境入场、member 声称 host acceptance/session/health | CMD-001~003；EV-CAND-L2M-CMD-001~003 |
| AC-L2M-002 | C2 入站成立 | P0 | scope 来源、四态 screening、规则回链、typed delivery 和 body-free 均成立 | unknown 放行、raw body 持久化 / 转发、无来源 allowlist | CMD-005~007、CON-002/003；EV-CAND-L2M-CMD-005~007 |
| AC-L2M-003 | C3 出站成立 | P0 | committed safe material、decision、attempt、gap 分层并可追溯 | 未提交材料出站、delivery/accepted 冒充 local result、24 candidate 物化 | CMD-007/008、JOB-001；EV-CAND-L2M-CMD-007/008 |
| AC-L2M-004 | C4 追溯成立 | P0 | correlation、来源/目的/结果分类、body-free trace 和安全观测成立 | 无关联、完整正文 / hidden reasoning 入观测、observed 冒充 | CON-005/012、QRY-009/011；EV-CAND-L2M-CON-005 |
| AC-L2M-005 | C5 摘要与出口成立 | P0 | committed fact + safe ref 派生 summary；freshness、stale、gap 可见；不反写 | view 反写 source、定义正文复制、缺来源仍 visible / ready | QRY-014~016、JOB-004；EV-CAND-L2M-QRY-014~016 |
| AC-L2M-006 | 项目型双锚在场 | P0 | ProjectMemberRef 与 GlobalMemberRef 匹配且 startup context 可验证 | 匿名、错项目、身份锚代主语、非项目 subject 被放行 | CMD-001；EV-CAND-L2M-CMD-001 |
| AC-L2M-007 | presence 状态 | P0 | 正式 MemberPresenceStatus 迁移可判定，unknown 不升级 | 状态压平、非法迁移、旧名或 default upgrade | CMD-002/003；EV-CAND-L2M-CMD-002/003 |
| AC-L2M-008 | host 协作本地面 | P0 | 请求、存活信号、状态报告的 local material / attempt 可记录 | 声称 host accepted/session/health 或外部失败逆写 | CMD-004、CON-001、QRY-002；EV-CAND-L2M-CMD-004 |
| AC-L2M-009 | subscription scope | P0 | 来源可验证、scope 可解释、替换缺口保守 | 来源未知仍扩权、scope supersede 被直写 | CMD-005/006、QRY-003；EV-CAND-L2M-CMD-005 |
| AC-L2M-010 | screening | P0 | Passed/Degraded/Blocked/Waiting 四态和规则 ref/freshness 明确 | 自建 allowlist、unknown/stale/conflict 默认通过 | CMD-005/007、QRY-004；EV-CAND-L2M-CMD-005 |
| AC-L2M-011 | Runtime 受控投递 | P0 | typed ref / safe snapshot / safety context 投递，mapping 缺失时 blocked | raw body、Runtime run/outcome 伪造或第二次执行 | CMD-007/008、CON-003/011；EV-CAND-L2M-CMD-007 |
| AC-L2M-012 | outbound decision | P0 | 决定锚定 formal safe reference，材料不合格则拒绝 | 从 current truth 临时重算、运行结果正文出站 | QRY-007、CMD-007；EV-CAND-L2M-QRY-007 |
| AC-L2M-013 | publication attempt / gap | P0 | attempt / gap / feedback 分层，迟到反馈形成新事实 | delivery/accepted 写入 local truth、失败回滚已提交事实 | QRY-008、CON-004、JOB-001；EV-CAND-L2M-CON-004 |
| AC-L2M-014 | interaction trace | P0 | 事实按同一 correlation 和 source/purpose/result 可回链 | trace 缺 predecessor、Query 追加记录、正文入 trace | QRY-009、CON-012；EV-CAND-L2M-QRY-009 |
| AC-L2M-015 | safe observation | P0 | low-cardinality、body-free、redacted observation posture | secret、body、stack、high-cardinality 或 observed/evidence 冒充 | QRY-011/016、CON-005；EV-CAND-L2M-COMMON-007 |
| AC-L2M-016 | summary projection | P0 | committed source、cursor/watermark、stale/not-ready 和 rebuild no-write 成立 | projection 修复 source、Query rebuild、旧 cursor 覆盖新视图 | QRY-014、JOB-004；EV-CAND-L2M-JOB-004 |
| AC-L2M-017 | capability outlet | P0 边界 / P1 正向 | safe ref / visibility / stale posture 成立；不授权 invocation | 复制 definition body、registry/grant/invocation 或 ready 冒充 | QRY-015、CON-009/014；EV-CAND-L2M-QRY-015 |
| AC-L2M-018 | 外围增强 | P1 | 提供时只读、body-free、可解释；缺失不影响 C1~C4 | 外围成为核心前置或反写 truth | QRY-016；EV-CAND-L2M-QRY-016 |

### 8.2 功能验收闭环矩阵（规划槽位）

| 验收项 | 设计契约 | 测试用例 | EV candidate | report path | 裁决影响 |
|---|---|---|---|---|---|
| AC-L2M-001~005 | 03 §5~§8、§10~§15；C1~C5 | CMD/QRY/CON/JOB 对应族 | EV-L2M-SMOKE-*、EV-L2M-SERVICE-*、EV-L2M-PROJECTION-* | reports/runs/<run_id>/suites/local-smoke.md 等 | 任一核心失败则不通过 |
| AC-L2M-006~011 | 03 CP01~CP03、双锚 / body gate | CMD-001~007、CON-001~003 | EV-L2M-DOMAIN-*、EV-L2M-ENTRY-* | reports/runs/<run_id>/suites/service-flow-fast.md；api-worker-entry.md | 失败则不通过；命中 VF-002/004/005 时不可接受 |
| AC-L2M-012~015 | 03 CP04~CP05、redaction / trace | QRY-007~011、CON-004/005/012、JOB-001/002 | EV-L2M-SERVICE-*、EV-L2M-REPLAY-*、EV-L2M-REDACTION-* | reports/runs/<run_id>/suites/service-flow-fast.md；redaction-check.md | 失败则不通过；正文泄漏触发 VETO |
| AC-L2M-016~018 | 03 CP06~CP07、projection / outlet | QRY-014~016、CON-009/014、JOB-003~005 | EV-L2M-PROJECTION-*、EV-L2M-JOB-* | reports/runs/<run_id>/suites/projection-readmodel.md；job-continuation.md | 边界失败不通过；正向 P1 未运行只能 residual |

### 8.3 P1 / P2 后置边界

| 能力 | 当前裁决 | 后续承接 |
|---|---|---|
| host / Runtime / Bus / resolver / image 正向 selected-run | 不作为 P0 前置；合同闭合后按 blocker 选取 | EV-L2M-OWNER-*、Step 13 residual |
| durable-like Store / crash proof | 不作为设计阶段结论 | 物理产品和实现基线固定后重验 |
| capability outlet 授权 / invocation | 不属于 member truth | Tools / capability owner 与后续产品验收 |
| E01~E03 外围诊断 / 历史浏览 / 配置解释 | 可裁剪 P1 | 不得阻塞核心闭环 |

### 8.4 功能项停审与跨功能审计

| 审计项 | 结论 | 修正 |
|---|---|---|
| P0 AC 是否全覆盖 | 通过（设计级） | 真实证据仍待执行 |
| 每项是否有正式设计 / TC / EV / report 槽位 | 通过（规划） | EV candidate 不等实例 |
| P1 是否污染 P0 | 通过 | owner positive 保持 conditional |
| smoke 是否替代细粒度证据 | 不允许 | 需保留 family-level evidence |
| 是否存在协议 / phase 漂移 | 未发现 | 以 03 正式名称为准 |

## 9. 回填草稿

正式 §5 应写入功能门禁表和闭环矩阵，并明确“证据候选 / 规划槽位必须由真实 run 生成，当前不构成通过”。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| owner positive seam | P1 资格 | blocker 关闭后 selected-run |
| evidence instance | 最终裁决 | 只由真实 artifact/report 生成 |
| CP06/07 正向 helper | AC-L2M-016/017 | 受 L2M-DDD-006/007 约束 |

## 11. 进入下一步条件

- [x] P0 功能均有可判定通过 / 失败条件。
- [x] 每项均有设计、TC、EV candidate、report 和裁决影响入口。
- [x] P1/P2 与外部成功语义未污染 P0。
