# Step 14 分件 A. 残余风险、不可接受项与下游关闭门禁

> 父Step: `05_test_plan_step_14_regression_risks.md`
> 标准来源: `测试方案讨论流程_SOP.md` Step 14;`测试方案书写规范.md` §5.14
> 生成日期: 2026-07-13
> 状态: reviewed_with_parent_step_passed_to_step_15
> 边界: 本文只定义planned residual candidate与关闭责任,不记录实际risk acceptance、姓名、日期、签署、run、evidence或测试结果。

---

## 1. M3状态与模块计划

| 模块项 | 状态 | 产物 |
|---|---|---|
| 读取Step 2 /10~13与正式`03/04`风险 | done | §2来源 /分类规则 |
| 回答“什么可作为residual、谁裁决” | done | §3 |
| 诊断blocker / residual混写风险 | done | §4 |
| 取舍并结构化风险 | done | §5~§7 |
| 模块自检 | done | §8 |

当前无真实acceptance authority assignee或有效期日期来源。本文只使用角色与condition-based expiry;新版`06`未裁决前全部保持`pending_for_06`。

## 2. 分类规则与来源

| 类别 | 是否进入残余风险表 | 强制处理 |
|---|---:|---|
| B级且不影响P0 / VF / VETO / evidence integrity | 是 | 有owner、影响、理由、期限来源、重开触发;由新版`06`裁决 |
| Conditional / P1 / P2正式非范围 | 是 | 记录当前证明上限与升级触发,不得补偿P0 |
| S / A、VF / VETO、安全 / truth / evidence红线 | 否 | 修复、完整复验、关闭;不可risk acceptance |
| target repo / suite / ENV-02~05 / candidate / provider / lab缺失 | 否 | execution blocker;保持Blocked / NotEvaluated |
| 无正式字段 /状态 /错误 /配置 /断言来源 | 否 | DesignReopen并回写`00~04` |
| PROFILE-05真实资格前置缺失 | 否 | activation / P0-Q blocker,不得由P06或residual替代 |
| PROFILE-06 /07当前未激活能力 | 是,仅作为scope residual | 激活前按trigger回写范围 / gate;未激活不能宣称ready |

正式来源包括Step 10 `COND-005` / PROFILE-06 /07成熟度、Step 11 B级接受边界、Step 12 conditional退出、Step 13 retention guard,以及正式`04` RSK-05 /07 /15 /16 /28与OQ-07 /09~11 /24。旧README数字、backend名称或旧checkbox不构成风险来源。

## 3. M3问题回答

| 问题 | 收口答案 |
|---|---|
| 哪些风险暂不覆盖 | 只限当前正式conditional / P1 / P2和下游物理策略;见RR-SBX-001~008。 |
| 谁提出和谁裁决 | risk owner提出并维护触发;测试负责人核对证明上限;acceptance role在新版`06`裁决。 |
| 接受期限怎么写 | 无日期来源时使用condition-based expiry;一旦重开触发成立,旧接受自动失效。 |
| 什么不能接受 | S / A、VF / VETO、P0 Blocked / Failed、identity / raw / report缺失、design-reopen和真实material安全前置缺失。 |
| 风险如何关闭 | `06`固定裁决和适用release,`07`实现边界,`09`物理runbook / retention / alert;任一层不能替另一层签署。 |

## 4. 当前材料诊断与取舍

| 诊断 | 采用取舍 | 未采用取舍 |
|---|---|---|
| Step 10 /12把conditional分散在性能、P06 / P07和physical drill | 按独立风险来源汇总,保留各自触发 | 合并成“生产能力未测”短摘要 |
| 正式`04`大量open项有些阻塞P05、有些只阻塞future | 先按§2分类,只将当前P0不要求的项列residual | 把所有open配置问题一律risk accept |
| 实际接受人 /期限未形成 | 写角色 + pending + condition expiry | 伪造姓名、日期、批准状态 |
| consumer完整E2E不属于Sandbox owner | 记录集成残余风险并要求consumer owner测试 | 把tools / runtime / member业务测试塞进Sandbox |
| retention无数值来源 | condition guard +下游物理策略 | 发明固定天数或让resource cleanup顺带删除artifact |

## 5. 残余风险表

| Risk ID /风险 | 正式来源 /未覆盖原因 | 影响 | 当前缓解 | Risk owner | Acceptance role /状态 | 期限来源 /重开触发 | 下游关闭位置 |
|---|---|---|---|---|---|---|---|
| RR-SBX-001 PROFILE-06 real-like / durable parity未激活 | PER-037;COND-001/002;P06 composition /产品未qualified | 不能证明选定durable adapter、outage与real-like parity | P0-C fake / controlled + P0-Q candidate-real;P1可用时SUITE-015,不得补偿 | architecture +config +release owner | acceptance owner;`pending_for_06` | 任一release要求P06、产品组合锁定或P06激活时立即失效 /重开 | `06`定gate;`07/09`定composition /运行 |
| RR-SBX-002 量化latency / throughput / capacity / cost无硬基线 | AC-036仅结构P0;COND-005;无产品 / workload / baseline | 不能作数值SLO、容量或成本pass/fail | SUITE-014证明结构有界;duration / count只作诊断trend | product +performance owner | acceptance owner;`pending_for_06` | 正式SLO、workload manifest、容量模型或数值验收要求形成时失效 | `06`定阈值;`07/09`定runner /容量 |
| RR-SBX-003 PROFILE-07 production / peripheral / remote / hot surface inactive | PER-038;COND-003;P07未进入current scope | 不证明production topology、多宿主 /远程 /hot能力 | SUITE-016验证当前absence;出现surface先DesignReopen | product +architecture owner | acceptance owner;`pending_for_06`（scope decision） | 任一P07 / production需求进入current scope即自动失效,不可继续接受 | 先回`00~04`;再重开`05/06/07` |
| RR-SBX-004 tools / runtime / member-service跨仓完整E2E未覆盖 | Sandbox只拥有隔离 / launch / disposition接缝;consumer产品baseline未锁 | shared contract虽可通过,完整业务编排仍可能集成漂移 | SUITE-001 /004 /005 /010 /011 + consumer-owned contract tests;语义越界reopen | cross-project integration owner | system acceptance owner;`pending_for_06` | shared carrier / consumer release或联合验收要求变化时重开 | `06`定联合门禁;各consumer `05/07`落测试 |
| RR-SBX-005 长时soak / fleet-scale lease-orphan-reaper与资源耗尽未覆盖 | 无deployment topology、fleet scope、时间 /容量基线 | 不证明长期资源泄漏、批量orphan和高压reaper行为 | deterministic lease / race / cleanup + ENV-04 simulation + P0-Q bounded lifecycle | operations +safety owner | acceptance +operations owner;`pending_for_06` | topology、soak窗口、fleet /资源SLO或production activation形成时失效 | `06`定必要性;`07/09`定soak / runbook |
| RR-SBX-006 physical rollout / rollback / drift / TOCTOU carrier未形成 | EHR-11~13;正式`04` RSK-14/15;desired / observed / traffic / drain未定义 | 不能证明fleet aligned、zero-downtime或physical rollback成功 | strict generation、review / marker recheck、ENV-04 simulation;不宣称aligned / success | config +release +operations owner | acceptance owner;`pending_for_06` | P06+ rollout、software baseline或physical change要求出现时失效 | `06`定验收;`07/09`定carrier / runbook |
| RR-SBX-007 真实sink / alert route / pager /响应runbook未资格 | 正式`04` RSK-16;产品、阈值、聚合、通知未定 | 只能证明safe hook / logical signal,不能证明operator响应闭环 | P0验证低基数hook、formal audit和failure classification;不伪造告警送达 | observability +operations owner | acceptance owner;`pending_for_06` | 任一profile要求operational alert / response SLO时失效 | `06`定证明;`07/09`定产品 /阈值 / runbook |
| RR-SBX-008 evidence数值retention与物理介质未定 | Step 13 condition guard;无权威TTL / storage policy | 不能证明长期审计 /合规保留和物理处置 | 验收、S/A复验、P0-Q disposition /调查关闭前禁止删除;resource cleanup分owner | operations +compliance owner | acceptance owner;`pending_for_06` | 法规 /合同 /审计窗口、介质或TTL要求形成时失效 | `06`定最低条件;`07/09`定介质 /TTL /删除runbook |

### 5.1 真实Material平台资格边界

swap、core dump、SDK memory、zeroization、provider least privilege / native audit未验证时,任何要求真实material的PROFILE-05+激活都是blocker,不是RR-SBX风险接受。只有当前不携带真实material的正式scope可保持不受该激活项阻塞;一旦profile要求真实material,必须先完成专项设计、P0-Q / redaction证据和新版`06` veto裁决。

## 6. 不可风险接受 /不可伪装为Residual

| 项 | 当前状态 /处理 |
|---|---|
| target repo、suite、CI、ENV-02~05实例不存在 | execution blocker;不得接受为“测试已覆盖” |
| ENV-05 candidate / capability / template / provider / lab缺失 | P0-Q与Release保持Blocked;P06 / simulation不可替代 |
| S / A open或VF-SBX-001~010 / VETO-CFG-01~16命中 | 必须修复、复验、关闭;0 risk acceptance |
| P0 suite / gate Failed、Blocked、InfraFailed或250条P0缺结果 | 不满足退出;不得用B级或conditional补偿 |
| identity、redaction、raw / report / digest / pairing / no-static缺失 | evidence无效,不得送验或手工补EV |
| 无formal assertion来源或新public / config /领域surface | DesignReopen;先回写`00~04` |
| 真实material anti-leak / provider安全前置未满足 | 对要求真实material的profile为activation blocker |
| residual缺owner / acceptance role /影响 /期限来源 /重开触发,或触发已成立 | 不具备接受资格;保持open / Blocked |

## 7. 下游关闭与裁决职责

| 下游 | 必须消费 | 不得越权 |
|---|---|---|
| 新版`06-验收标准.md` | RR-SBX-001~008、适用release、接受 /拒绝角色、condition expiry、P0-Q / evidence veto | 不得把pending写accepted,不得接受S / A / blocker |
| `07-实施计划.md` | 对应profile / integration / benchmark / metadata / retention实现boundary与precheck | 不得选择风险接受人、伪造产品 /环境 /baseline |
| `09-部署与运维手册.md` | rollout / rollback / drift、soak / reaper、alert、介质 / TTL /删除物理runbook | 不得弱化Step 13 condition guard或改写测试 /验收结论 |
| future `00~04` reopen | P07、新public /领域surface、真实material / source / callback / hot能力 | 不得由`05/06/07/09`自行发明上游契约 |
| consumer projects | tools / runtime / member-service own contract / integration tests | 不得把其语义owner转给Sandbox |

## 8. M3模块停审

| 审计项 | 结论 |
|---|---|
| residual是否仅限B / conditional / P1 / P2 | 通过,8 /8均不补偿P0 |
| 每项是否有risk owner和acceptance role | 通过,角色完整但无伪造assignee |
| 每项是否有期限来源 /重开触发 | 通过,使用condition-based expiry |
| blocker / S / A / design-reopen是否混入可接受风险 | 否,§6单列 |
| PROFILE-06 /07是否被宣称ready | 否,P06 unqualified / P07 inactive |
| 真实material安全缺口是否被接受 | 否,激活即blocker |
| 是否可被`06/07/09`直接引用 | 是,§7固定职责 |
| 是否创建真实risk acceptance | 否,全部`pending_for_06` |

M3结论:残余风险登记与接受事实严格分离。本文没有接受任何风险;只有新版`06`在真实送验基线、owner和证据形成后才可裁决,且重开条件成立会使既有接受自动失效。
