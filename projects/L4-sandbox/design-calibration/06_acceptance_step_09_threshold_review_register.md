# Step 9 分件 B. 非功能阈值来源、成熟度与停审登记

> 父Step: `06_acceptance_step_09_nonfunctional.md`
> 对应SOP: `standards/document/验收标准讨论流程_SOP.md` Step 9
> 正式来源: `00-需求文档.md` §13.1~§13.3;`03-详细设计.md` §10~§14;`04-配置设计.md` §8~§14;`05-测试方案.md` §9~§14
> 生成日期: 2026-07-15
> 状态: completed_reviewed_passed_to_step_10
> 事实成熟度: `PassDesign`;0 target repo,0 fixed run,0 runtime EV,真实验收仍为`NotEntered`

---

## 1. 登记口径

- `NTH-SBX-001~020`是阈值 /成熟度检查索引,不是新的NFR、AC、SLO、风险或evidence ID。
- “阈值”包括数值阈值、零容忍、结构边界、资格完整性、状态完整性和激活前置;不能只登记latency数字。
- 正式硬门槛只能来自当前正式`00~05`。历史数字、产品名、旧README、旧`06`和L1参考都不能成为L4-sandbox阈值来源。
- `Blocked`表示必需执行前置或证明缺失;`NotRunConditional`表示非P0条件尚未激活。两者都不是Passed,但传播不同。
- 未执行的P0必须保持Blocked / NotEvaluated并阻断通过;未激活的conditional不阻断当前P0,也不得声称该能力已验证。

---

## 2. 阈值来源分层

| 来源级别 | 可形成什么 | 不可形成什么 |
|---|---|---|
| 正式需求硬口径 | 零容忍、追溯缺口`=0`、核心不依赖外围、显式失败 /等待 | 未被需求确认的产品性能数字 |
| 正式设计不变量 | no-write、no-repair、atomic UoW、single winner、coherent boundary、guard-first | 真实backend / topology / provider已资格结论 |
| 正式测试门槛 | exact TC全集、P0-C / P0-Q分母、fixed source identity、raw / report pairing | 测试未运行时的Passed或runtime EV |
| 送验claim /运行基线 | 未来可激活量化latency / throughput / capacity / availability | 未固定workload / baseline /误差时的硬SLO |
| historical /参考材料 | 污染扫描、差异审计、候选trigger | 当前验收门槛、产品选择或事实 |

---

## 3. NTH-SBX-001~020阈值与成熟度裁决

| 索引 | 主题 | 当前正式门槛 /状态 | 来源 | 缺失 /失败传播 | 禁止解释 |
|---|---|---|---|---|---|
| `NTH-SBX-001` | 宿主 /旁路 /匿名formal执行 | 成功数`=0` | 正式`00`§13.1 /§13.3;AC-SBX-038;VF-SBX-002 | 任一成功 -> Failed / VETO候选 | “仅测试”“fallback一次”可接受 |
| `NTH-SBX-002` | 必需四维silent degrade / partial ignore | 成功数`=0`;resource / FS / network / process必须同代coherent | 正式`00`§13;正式`03/04`;VF-SBX-003 | 语义失败 -> P0-C Failed;真实Q未证明 -> P0Q Blocked | fake拒绝等于真实限制已施加 |
| `NTH-SBX-003` | 未授权外联 /越权 /高风险继续 | 成功数`=0` | 正式`00`§13.1~§13.3;AC-SBX-038;VF-SBX-004 | 任一继续 -> Failed / VETO候选 | 白名单检查耗时优先于授权正确性 |
| `NTH-SBX-004` | 外部正文 / raw sensitive进入carrier | 泄漏数`=0` | 正式`00`§13.2;正式`03`§14;VETO-CFG-05 | 任一泄漏 -> Failed;不可风险接受 | redaction后仍存raw、plain hash或报告回显marker |
| `NTH-SBX-005` | 材料静默升格下游truth | 成功数`=0` | 正式`00`§13;VF-SBX-006;VETO-CFG-13 | 任一升格 -> Failed / VETO候选 | receipt / telemetry /candidate ref就是下游formal truth |
| `NTH-SBX-006` | cleanup先删证据 / orphan脱管 / advisory redline | 成功数`=0`;non-Allowed release call`=0` | 正式`00`§13;VF-SBX-007/008;VETO-CFG-09/10 | 任一命中 -> Failed / containment | teardown成功可覆盖产品truth / guard失败 |
| `NTH-SBX-007` | 关键变化追溯 | 缺口`=0` | 正式`00`§13.3;AC-SBX-039;VF-SBX-010 | 任一owner链缺口 -> AC-SBX-039 Failed;证据缺失阻断裁决 | 95% / 99%覆盖、日志可搜即可 |
| `NTH-SBX-008` | 第二正式execution / policy / control语义 | 冲突语义数`=0` | 正式`00`§13.2;AC-SBX-040;VF-SBX-009 | 任一分叉 -> Failed / VETO候选 | caller / backend / downstream可各自解释 |
| `NTH-SBX-009` | duplicate / retry第二次owner副作用 | owner mutation / external side effect`=0` | 正式`03`§10~§12;Step 8;AC-SBX-040 | 任一二写 /重算 -> Failed | “最终值相同”可掩盖重复副作用 |
| `NTH-SBX-010` | race与事务 | single winner;half group`=0`;loser有typed surface | 正式`03`;Step 8 14 TXN /19 race | double winner /半状态 /吞错 -> Failed | 低并发重跑或偶现压测绿色可替代deterministic schedule |
| `NTH-SBX-011` | Query / Job / relay owner边界 | Query writes`=0`;Job core repairs`=0`;publish / handoff rollback source`=0` | 正式`03`§10~§12;AC-SBX-040 | 任一越界写 -> Failed | read-side自愈 / reconciliation auto-fix属于可用性优化 |
| `NTH-SBX-012` | 关键观测盲区 | blind spot`=0`,且safe carrier泄漏`=0` | 正式`00`§13.1~§13.2;AC-SBX-041 | 任一关键路径无safe surface -> Failed | optional sink不可用可关闭formal audit / guard |
| `NTH-SBX-013` | 结构有界性 | no optional prerequisite;no unbounded scan / batch / retry;完整duration / count / call sample;未归因phase gap`=0` | 正式`00`性能正式口径;正式`03/04`;AC-SBX-036 | 任一结构越界、sample / typed归因缺失 -> Failed | duration值本身当前直接判pass / fail |
| `NTH-SBX-014` | 当前量化性能 | `NotRunConditional`;无P0 latency / throughput / capacity / cost硬数字 | 正式`00`§13.3候选;正式`05`§10;RR-002 | 不影响当前P0,不得形成SLO结论 | 继承Docker `<1s`、gVisor `<2s`、销毁 `<500ms`、白名单 `<5ms` |
| `NTH-SBX-015` | API可用率 /事件时延 | 当前无硬`>=99.9%`或事件时延SLO;conditional / future operations | 正式`00`§13.3;RR-002/007 | 当前不按数字判fail;若claim要求则先设计重开 /激活 | 历史API数字等于当前release目标 |
| `NTH-SBX-016` | P0-C完整性 | 237条P0-C主结果 + MAIN-CONTRACT / MAIN-SEAM / OPS必需suite / checks无Failed / InfraFailed / missing | 正式`05`§9 /§12 | 任一缺失 -> release Blocked或Failed | PR、部分suite、手工表、重跑覆盖旧失败可替代 |
| `NTH-SBX-017` | P0-Q完整性 | 13条CONF + fixed packet identity + redaction + cleanup disposition;当前Blocked | 正式`05`§8~§13;AC-SBX-038 | candidate / provider / lab / identity缺失 -> P0Q Blocked并阻断release | ENV-02~04 / ENV-06 / host / fake /其他candidate替代 |
| `NTH-SBX-018` | PROFILE-06 conditional激活 | composition + workload + baseline + threshold / error / regression + acceptance consumer + change rule全部存在 | 正式`05`§10;RR-001/002 | 缺任一 -> NotRunConditional;激活后按SUITE-SBX-015裁决 | 临时benchmark /诊断sample自动升级P0 |
| `NTH-SBX-019` | Evidence可裁决性 | mandatory NFCHK必须有fixed source exact raw / report / item / digest;当前0实例 | 正式`05`§13;Step 3 baseline | 缺mandatory evidence -> Blocked / NotAdjudicable;Step 10继续裁决 | ESLOT、Markdown、静态JSON、`latest`或alias单独即证据 |
| `NTH-SBX-020` | Residual / future物理能力 | RR-001~008保持pending;不可接受红线不得risk accept | 正式`05`§14;正式`04`VETO | Step 13决定接受 /拒绝;trigger命中后过期或design reopen | 在Step 9直接签署、给期限或把Blocked包装有条件通过 |

---

## 4. 历史候选数字排除登记

| 历史候选 | 当前定位 | 重新激活的最小前置 | 当前是否可用于裁决 |
|---|---|---|---|
| Docker启动`<1s` | historical candidate;产品也未选 | formal product composition、workload、baseline、threshold、error / regression rule | 否 |
| gVisor启动`<2s` | historical candidate;产品也未选 | 同上,且candidate / profile identity固定 | 否 |
| 销毁`<500ms` | historical candidate;cleanup安全优先 | cleanup disposition、evidence / investigation guard、workload和baseline | 否 |
| 白名单判断`<5ms` | historical candidate;当前不拥有allowlist truth | formal policy / authorization seam、operation mix、baseline和hard threshold | 否 |
| API稳定性`>=99.9%` | future operations candidate | service boundary、measurement window、error budget、topology、consumer与owner | 否 |
| 旧`06`“100%样本链” | invalid ambiguous threshold | 改用exact TC / source / evidence闭集,无需恢复百分比 | 否 |
| 旧`06`“额外开销在阈值内” | invalid source-less threshold | 按NTH-SBX-018建立完整量化claim后才可形成新阈值 | 否 |

这些数字只允许出现在historical差异审计中,不得进入正式§9门禁表、future evidence的threshold field、测试Passed理由或风险接受条件。

---

## 5. 成熟度与传播矩阵

| 观察状态 | 适用范围 | AC聚合处理 | 整体验收处理 |
|---|---|---|---|
| `Passed` | 真实case全部断言成立且evidence有效 | 仅满足对应NFCHK,不自动满足整个AC | 所有mandatory项齐备后才可继续裁决 |
| `Failed` | 产品 /契约断言不成立 | 对应canonical AC Failed | P0失败阻断通过;VETO候选按Step 11 |
| `Blocked` | 必需环境 / identity / candidate / dependency前置缺失 | AC不可作通过裁决 | P0-Q或mandatory source Blocked使release Blocked |
| `InfraFailed` | harness / CI / environment基础设施失败 | AC不可作产品通过 /失败裁决 | 必须修复基础设施并新run,不得改Skipped |
| `NotRunConditional` | 非P0条件未激活 | 不影响P0聚合,但该能力仍未验证 | 不得补偿或宣称通过;按RR / trigger追踪 |
| `NotEvaluated` | assertion尚未执行或review | 无结论 | 当前设计仓全部runtime assertion属此状态 |

`NotEvaluated`是assertion schema允许状态;测试artifact主状态仍使用`Passed / Failed / Blocked / NotRunConditional / InfraFailed`。不得新增`Skipped / Waived / Partial / UnknownPass`吞并差异。

---

## 6. RR-SBX-001~008在Step 9的去向

| Residual | 本Step确定的非功能边界 | 后续owner |
|---|---|---|
| RR-SBX-001 P06 durable / real-like | 不证明physical parity / outage;不补偿P0 | Step 13风险裁决;`07/09`形成执行 /运维 |
| RR-SBX-002量化性能 /容量 /成本 | 当前无SLO结论;P0只证结构有界 | Step 13;未来claim触发NTH-SBX-018 |
| RR-SBX-003 P07 production / remote / hot | 当前inactive;只证absence / reject | scope进入先回写`00~04`,再重开`05/06/07` |
| RR-SBX-004 consumer跨仓E2E | Sandbox只证正式seam,不接管consumer业务真相 | system acceptance / consumer owner |
| RR-SBX-005 long soak / fleet reaper | deterministic + OPS + bounded P0-Q不证明长期fleet SLO | Step 13;`07/09`选择topology / soak / runbook |
| RR-SBX-006 physical rollout / rollback / drift | strict generation与simulation不证明fleet alignment | Step 13;`07/09`选择carrier / runbook |
| RR-SBX-007 real sink / alert / response | safe hook / formal audit不证明pager响应 | Step 13;`07/09`选择产品 /阈值 /责任 |
| RR-SBX-008 evidence TTL /介质 | condition-based guard不证明长期合规期限 | Step 13;`07/09`选择物理策略 |

本Step不写`accepted / rejected`、assignee、截止日期或签署。红线、P0-Q缺失、evidence伪造和mandatory P0失败不能通过RR表降级。

---

## 7. 阈值变更与失效规则

| 变更 | 当前evidence影响 | 必需动作 |
|---|---|---|
| 送验claim新增量化SLO | 现有结构sample不能证明新数字 | 重开Step 9阈值裁决,固定NTH-SBX-018全部前置并执行新conditional run |
| candidate / profile / generation / capability / template / provider变化 | 原P0-Q packet全部失效 | 新packet完整重跑13 CONF与identity / redaction / cleanup checks |
| workload / baseline /阈值 /误差规则变化 | 原量化结果不可比较 | 新run,保留parent / change refs,不得覆盖旧结果 |
| NFR从conditional升P0 | 原NotRunConditional不能补位 | 先回写正式需求 /设计 /测试,重开对应Step并加入P0分母 |
| redaction / dependency / cleanup / VETO规则削弱 | 现有资格与release证据失效 | 立即阻断并回正式owner;不得通过兼容窗口 |
| source run任一revision / digest / role变化 | RELEASE聚合不再同基线 | 重建同一送验基线四个fixed source run和RELEASE |

---

## 8. 阈值独立停审

| 停审项 | 结论 | Runtime状态 |
|---|---|---|
| 12类正式零 /结构门槛NTH-SBX-001~013 | 来源明确,可判定 | NotEvaluated /适用P0Q Blocked |
| 量化 /可用率NTH-SBX-014~015 | 无正式硬数字,保持候选 | NotRunConditional |
| P0-C完整性NTH-SBX-016 | 分母、source role和checks明确 | 当前fixed run不存在,Blocked |
| P0-Q完整性NTH-SBX-017 | packet、13 TC和反替代明确 | Blocked |
| conditional激活NTH-SBX-018 | composition、workload、baseline、threshold / error / regression、验收消费方和变更规则等全部正式前置必须齐备 | NotRunConditional |
| evidence可裁决性NTH-SBX-019 | exact identity / raw / report / digest要求明确 | 0实例,Blocked / NotEntered |
| residual边界NTH-SBX-020 | Step 9不伪接受 | Pending for Step 13 |

20 /20项完成设计停审;7个历史数字 /泛化阈值全部排除,0个无来源数值进入P0。

---

## 9. 分件自检

| 检查项 | 结论 |
|---|---|
| NTH编号是否连续唯一 | 通过;001~020。 |
| 每项是否有来源、传播和禁止解释 | 通过;20 /20。 |
| 正式零容忍是否保留 | 通过;未被概率 /抽样稀释。 |
| 结构有界是否与量化性能分离 | 通过。 |
| P0-C / P0-Q / conditional状态是否分离 | 通过。 |
| 历史数字是否只作historical candidate | 通过;7项排除登记。 |
| RR是否被提前接受 | 否。 |
| 是否发明SLO、时间窗、产品、topology或owner签署 | 否。 |
| 是否创建runtime evidence /结果 | 否。 |
