# Step 10. 设计专项测试与非功能验证

> 对应SOP: `standards/document/测试方案讨论流程_SOP.md` Step 10
> 书写规范: `standards/document/测试方案书写规范.md` §5.10
> 回填章节: `05-测试方案.md` §10 专项测试与非功能验证
> 生成日期: 2026-07-13
> 状态: reviewed_passed_to_step_11
> 所属流程: `05_test_plan_calibration_flow.md`
> 本Step口径: 复用已确认的254条`TC-SBX-*`、16个planned suite、七环境 / profile和`PER-SBX-001~038`,将六类NFR与安全红线收束成可执行专项。本文不创建新TC、正式EV、真实run、artifact、report、测试结果或验收裁决。

---

## 1. Step开工确认与状态

| 检查项 | 结论 |
|---|---|
| 用户是否确认Step 9并允许进入Step 10 | 是。用户在Step 9停审后明确回复“同意”,本次只放行Step 10。 |
| 台账与flow是否允许进入 | 是。Step 9原为`pass_wait_review`;本次确认后转为`passed_to_step_10`。 |
| 是否读取Step 10标准 | 是。已读取测试SOP Step 10和书写规范§5.10,必须输出性能、安全、一致性、恢复、观测与审计专项矩阵,且阈值必须有来源。 |
| 是否读取正式上游 | 是。复核正式`00` §13~§14、`03` §10~§15、`04` §8~§12 / §14,以及Step 5~9确认产物。 |
| 是否参考L1粒度 | 是。参考L1-governance / L1-artifact Step 10的专项分组、阈值来源和跨专项审计结构,不继承其对象、suite、环境或evidence命名。 |
| 当前状态 | 性能有界性、安全与四维隔离、可用性、幂等一致性、恢复生命周期、观测审计六类专项已形成可判定矩阵;用户已确认并传递至Step 11。 |
| 上游blocker | 未发现需要回写`00/03/04`的新冲突。目标实现仓缺失继续阻塞实际执行;ENV-05缺失继续阻塞P0-Q真实隔离资格。 |
| 停审 | 用户已确认Step 10;只放行Step 11,不得跨入Step 12或修改正式`05-测试方案.md`。 |

## 2. 本步目标、边界与成熟度

本Step完成:

1. 将正式六类NFR和`AC-SBX-036~041`逐项绑定到测试方法、环境、TC、suite、PER和通过条件。
2. 将`VF-SBX-001~010`逐项绑定到负向测试,确保安全红线不是人工说明或release摘要替代。
3. 把P0-C结构性语义验证、P0-Q真实backend资格和conditional量化验证分开。
4. 固定fault injection、deterministic race、write-audit、redaction scan、qualification probe和cleanup disposition的专项用途。
5. 明确planned artifact / report只是一种未来producer契约,不能被本文静态写成证据或通过结果。

本Step不完成:

- 不把旧Docker `<1s`、gVisor `<2s`、销毁 `<500ms`、白名单 `<5ms`或API `>=99.9%`升级为门禁。
- 不选择backend、provider、observability产品、durable store、bus、workload模型或容量基线。
- 不创建benchmark实现、故障注入器、探针、CI脚本、真实路径实例、EV alias、run_id或签署。
- 不用ENV-01~04的fake / simulation结果替代ENV-05四维真实施加、真实越界阻断和生命周期资格。
- 不把tools semantic execution、runtime agent loop或member lifecycle orchestration纳入sandbox专项主体。

| 成熟度 | 含义 | 对通过结论的限制 |
|---|---|---|
| `designed_p0c` | ENV-02~04可执行的确定性语义 /结构专项已设计 | 目标实现和suite未落码前不能记Passed。 |
| `designed_execution_blocked` | P0-Q方法与断言已设计,但ENV-05合法实例缺失 | 只能传播Blocked,不得N/A、skip或低profile替代。 |
| `conditional_non_p0` | 需要PROFILE-06、正式产品 / workload / baseline后选择性执行 | 不补偿P0,当前不能形成量化性能结论。 |
| `planned_requirement_only` | PER、artifact / report路径是未来producer要求 | 不是EV、证据实例、结果或验收裁决。 |

## 3. 输入承接与SOP问题回答

| 输入 | 本Step承接内容 |
|---|---|
| 正式`00` §13 / §14 | 六类NFR、零容忍目标、`AC-SBX-035~041`、`VF-SBX-001~010`和历史性能数字的候选地位。 |
| 正式`03` §10~§12 | UoW原子性、stored replay、version / cursor、错误恢复、并发single-winner和no-recompute。 |
| 正式`03` §13~§15 | 外部依赖绑定、唯一编译期依赖、日志 / metric / audit字段边界和测试切口。 |
| 正式`04` §8~§11 | sensitive lifecycle、complete generation、变更 / rollback / drift、fail-fast / degraded和禁止动作。 |
| 正式`04` §12 / §14 | TSH / FDT / EHR planned handoff、VETO-CFG、PROFILE-05~07成熟度和下游关闭门禁。 |
| Step 5~7 | AC / VF / NFR追溯、254条正式TC、28个数据集及synthetic marker / fault / race / qualification数据。 |
| Step 8~9 | ENV-01~07、PROFILE-01~07、16个suite、七类gate和固定run artifact / report契约。 |

| SOP问题 | 回答 |
|---|---|
| 哪些性能指标必须验证 | P0-C验证结构性有界:外围增强不是核心前置、同步读取不做无界扫描、batch / page只处理显式选择集、race与retry不产生无界重复副作用,并记录阶段duration / count / call-count观测。量化latency / throughput / capacity仅由`TC-SBX-COND-005`承接,当前conditional。 |
| 哪些安全和边界红线必须负向测试 | host / bypass /匿名执行、四维任一silent degrade、policy不完备继续、高风险动作越权、外部正文 / sensitive泄漏、材料升格下游truth、cleanup先删材料、orphan脱管、redline advisory和第二套正式语义均必须负向覆盖。 |
| 哪些一致性和恢复场景必须故障注入 | UoW逐阶段失败、commit unknown、rollback failure、stored result缺失、version conflict、relay / handoff失败、duplicate三通道、19类race、lease / reaper / cleanup / redline、projection / reconciliation partial failure。 |
| 哪些日志、指标和审计证据必须存在 | accepted mutation需要formal audit / relay / stored result等同UoW引用;rejected / blocked / degraded / failed路径需要safe log / metric / receipt / report / marker;所有carrier需redaction scan,metric只允许低基数标签。 |
| 阈值来自哪里 | 零容忍和追溯缺口`=0`来自正式`00` §13;语义通过条件来自正式`03/04`及Step 6断言;结构有界条件来自显式page / selection / state / call budget契约。无正式来源的数字不得判fail。 |

## 4. 专项测试总矩阵

表中artifact / report均是Step 9定义的未来固定`<run_id>`输出类型,不是已生成实例。

| 专项 | 指标 /风险 | 方法 | 环境 / Suite | 阈值 /通过条件来源 | TC / PER | Planned artifact / report | 成熟度 |
|---|---|---|---|---|---|---|---|
| 性能结构有界性 | optional增强阻塞核心、无界scan / batch / retry / race | 固定selection运行、port call-count、write-count、phase duration / item count观测与boundedness check | ENV-02 /04;SUITE-014,补强007~010 /012 | `AC-SBX-036`;显式page / selection / state契约;无数字阈值 | COND-004;相关TXN / RACE / JOB / QRY;PER-004~007/025/030 | SUITE-014 case rows / boundedness report | designed_p0c |
| 量化性能候选 | latency / throughput / capacity / tail / cost缺基线 | 正式workload manifest下benchmark / trend,只在激活后执行 | ENV-06;SUITE-015 / GATE-P1 | 需要正式产品、workload、baseline和验收门槛;历史数字无效 | COND-005;PER-037/038 | selected-run raw / report | conditional_non_p0 |
| 安全与truth边界 | host /旁路、外部正文、材料升格、依赖越界 | static boundary check、negative carrier、synthetic marker scan、write-audit | ENV-02 /04;SUITE-003/004/010/012/016 | `AC-SBX-035/038`;`VF-SBX-002/005/006`;零容忍成功率`=0` | ARCH-001~003;CFG-008/009/030;ERR-006/008;PER-026/029/032/033 | dependency / redaction / scope-absence reports | designed_p0c;target repo未形成时执行blocked |
| 四维真实隔离资格 | resource / FS / network / process未施加、weak fallback | immutable identity preflight + candidate-real bounded probes + substitution veto | ENV-05;SUITE-013 / GATE-P0Q | `AC-SBX-002/038`;`VF-SBX-002~004`;任一越界成功或维度缺失均失败 | CONF-001~006/011/012;PER-034/036 | qualification result / probe rows | designed_execution_blocked |
| 可用性与fail-closed | dependency缺失、下游延迟、optional sink失效被伪成功 | controlled unavailable / stale / conflict / retryable / failed注入 | ENV-02 /03 /04;SUITE-004~006/008/010/012 | `AC-SBX-037`;正式状态 /错误闭集;hard guard不可degraded | CMD-002/004/006/008/010/012/016/018/020;CFG-014/015/018~023;PER对应 | suite cases / error / operations reports | designed_p0c |
| 事务一致性 | partial truth、audit / relay / result分裂、commit unknown盲重试 | staged UoW fault injection + rollback visibility + write-set audit | ENV-02 /03;SUITE-007/008/010 | 正式`03` §10~§12;全量可见或全量不可见 | TXN-001~014;ERR-022~024/034;PER-022~024/026 | transaction / write-audit rows | designed_p0c |
| 幂等与并发 | duplicate重算、different digest复用、race双赢家 | 三通道stored replay + deterministic scheduler / barrier | ENV-02 /04;SUITE-007/009 | same digest返回stored result;different digest conflict;single winner;0第二次owner副作用 | CTR-004;TXN-007~014;RACE-001~019;PER-002/024/025 | replay / schedule rows | designed_p0c |
| 恢复与生命周期 | timeout / kill、lease / orphan、cleanup / reaper、redline误释放 | fault / control replay、guard重评、inspect / release call audit、cleanup disposition | ENV-02 /04;SUITE-010/012;真实子集ENV-05 / SUITE-013 | `AC-SBX-005/030/038~041`;non-Allowed时release=0;材料未交接不删除 | CMD-013~020;JOB-005~007;CFG-022;CONF-007/009/010;PER-007/018/035 | safety / cleanup / containment rows | P0-C designed;P0-Q blocked |
| 捕获与交接恢复 | capture partial / failed、handoff retry / terminal导致source回滚 | adapter fault injection + before / after owner write-set对比 | ENV-02 /03 /04;SUITE-004~006/008/010/012 | capture / handoff状态诚实;source truth与stored payload不回滚 | CMD-009~012;CNS-013~020;EVT / JOB适用;CFG-021;PER-006/012/017/020 | capture / handoff / relay rows | designed_p0c |
| 可观测性 | 关键状态、异常、超限、guard、redline存在盲区 | log / metric / marker schema assertion + event / report pairing | ENV-02 /03 /04;SUITE-003/005/006/010/012 | `AC-SBX-041`;每个正式producer存在safe可观察surface;缺项即失败 | CTR-006;CFG-015/030;ERR-001~038适用;PER-026/032 | log / metric / marker scans and suite report | designed_p0c;real probe blocked |
| 正式审计与追溯 | accepted变化无audit、失败伪成accepted trace、关键回链缺口 | same-UoW audit assertion、trace page、protocol / artifact pairing检查 | ENV-02 /04;SUITE-001/004~007/011/012 | `AC-SBX-039`;`VF-SBX-010`;关键追溯缺口`=0` | QRY-025/026;EVT-001~013;TXN适用;CFG-030;PER-012/022/023/032 | audit rows / pairing / protocol reports | designed_p0c |
| 敏感材料与redaction | raw secret / output / response / stack进入carrier | synthetic marker逐carrier注入、provider生命周期与平台anti-leak扫描 | ENV-02;SUITE-003;真实子集ENV-05 / SUITE-013 | marker泄漏`=0`;扫描失败不得回显marker;S04时序和lease identity一致 | CTR-006;CFG-009/012/013/030;CONF-013;PER-029/032/035/036 | redaction raw / report | P0-C designed;provider子集blocked |

## 5. 性能与结构有界性专项

### 5.1 P0-C结构性观察契约

| 观察项 | 测试方法 | 必须记录 | 通过条件 | 主TC / Suite |
|---|---|---|---|---|
| 核心前置闭集 | 在inspect、trend、comparison、multi-host、preview等enhancement disabled / absent时运行核心命令和安全流 | 实际调用port kind、flow phase、terminal surface | C-SBX-1~5不依赖enhancement调用;缺enhancement不导致核心伪成功或无结果等待 | COND-004;CMD适用;SUITE-014 |
| Query读取有界 | 对显式page / selector运行13 Query并放置超出selection的数据 | selected count、visited refs、repository calls、write calls | 只访问显式page / selector允许集合;无全仓同步scan;write calls `=0` | QRY-001~026适用;SUITE-004/014 |
| Job batch有界 | 以固定selection运行10 Job,混合成功 /失败 /缺失item | selected / visited / succeeded / failed counts、next cursor、port calls | visited是selection子集;每item结果可对账;partial不重跑整批或修core truth | JOB-001~012;SUITE-006/014 |
| Race / retry有界 | deterministic barrier重复19类race与三通道duplicate | participant、winner、loser、owner write count、port call count | 单赢家;loser走正式surface;duplicate不再次进入owner / port;无半状态 | RACE-001~019;TXN-007~014;SUITE-007/009/014 |
| 变更 / rollback有界 | review / apply / rollback / drift各运行固定generation和scope | desired / observed generation、builder / publication calls | 只处理显式generation / scope;失败保留历史;不循环fallback或自动truth rewrite | CFG-024~028;COND-004;SUITE-003/012/014 |
| 阶段观测完整 | 在上述case记录duration / count sample | operation kind、phase、duration、count、result,均为低基数字段 | 每次执行都有完整sample并可回指case;sample不参与当前数字判fail | COND-004;SUITE-014 |

`AC-SBX-036`在当前P0只以结构性条件阻断:缺boundedness观测、发生无界scan、外围增强成为核心前置、duplicate / retry产生第二次owner副作用均失败。duration值本身没有正式数字门槛,不得因“比历史数字快”记pass,也不得因“比历史数字慢”直接判fail。

### 5.2 量化候选激活门禁

| 必需前置 | 缺失时状态 | 激活后方法 | 当前去向 |
|---|---|---|---|
| 明确的产品 / backend / store / bus / target组合 | `NotRunConditional` | 绑定不可变subject和profile identity | ENV-06 / PROFILE-06 |
| 正式workload manifest:operation mix、payload class、concurrency、duration / sample policy | `NotRunConditional` | 固定manifest执行benchmark,不得临时挑样本 | TC-SBX-COND-005 |
| 基线来源、硬阈值、误差与回归判定 | `NotRunConditional` | 生成sample / percentile / throughput / capacity报告并按正式阈值裁决 | SUITE-015 / GATE-P1 |
| 验收消费方和变更规则 | `NotRunConditional` | Step 13 /新版`06`定义evidence消费与阈值变更审批 | PER-SBX-037/038 |

上述前置未闭合前,只允许记录P0-C duration / count sample用于诊断,不得形成SLO、容量、可用率或release性能结论。

## 6. 安全、四维隔离与红线专项

| 红线 /风险 | 负向操作 | P0-C语义断言 | P0-Q真实断言 | TC / Suite | 成熟度 |
|---|---|---|---|---|---|
| host / bypass /匿名正式执行 | host / caller-local / fixture路径冒充formal launch,或责任链缺失 | entry / builder / preflight拒绝;正式run / handle `=0` | candidate identity不匹配立即Blocked / Failed且0 launch | CMD-001~004/007/008;CFG-010;CONF-011/012;SUITE-004/013 | P0-Q blocked |
| resource维度未落实 | capability缺失 / stale / partial,或probe越limit | coherent decision不可形成;backend call按guard为0 | CPU / memory / wall-clock / IO适用probe真实受限或终止 | CMD-003/004;CONF-001/002/006;SUITE-013 | P0-Q blocked |
| filesystem边界打穿 | allowed / forbidden path read-write与host / sibling marker | partial capability整体拒绝;无weak fallback | 只允许声明scope;forbidden marker不可达且无host fallback | CONF-001/003/006;SUITE-013 | P0-Q blocked |
| network边界打穿 | 默认拒绝与正式allow target以外连接 / DNS动作 | policy / capability不完备时不launch | forbidden连接成功数`=0`;allowed只在正式policy + capability内成功 | CMD-005~008;CONF-001/004/006;SUITE-013 | P0-Q blocked |
| process边界打穿 | 越权spawn / signal / namespace / escape-like probe | unknown / unsupported不被映射allow | 越权动作成功数`=0`;redline可分类并进入containment | CONF-001/005/006/010;SUITE-013 | P0-Q blocked |
| policy /高风险绕过 | missing / stale / conflict / unsupported / unauthorized | run / backend调用`=0`;fail-closed正式surface | candidate probe仍不能绕过policy identity | CMD-005/006/008;CFG-018;ERR-005;SUITE-004/010/013 | P0-C designed;真实子集blocked |
| 外部正文 / material泄漏 | raw body、process output、SDK response、secret marker注入全部carrier | field拒绝或redaction scan失败;truth / audit不落正文 | provider lease、capture、handoff、diagnostic全链marker泄漏`=0` | CTR-006;CFG-009/012/013/030;CONF-013;SUITE-003/013 | provider子集blocked |
| output / obs材料升格truth | receipt / report / telemetry / candidate ref尝试成为artifact / obs truth | 只保存sandbox owner事实与refs;下游状态不反写source | 不因真实target receipt改变capture / redline / cleanup owner | CMD-009~012;CNS-013~020;JOB-004/007;SUITE-004~006/012 | designed_p0c |
| cleanup先删材料 | handoff / evidence / investigation未闭合触发release | guard non-Allowed;release调用`=0`;refs保留 | reaper不得删除未交接capture / audit / investigation材料 | CMD-017/018;JOB-005/006;CFG-022;CONF-009;SUITE-012/013 | 真实子集blocked |
| redline advisory /脱管 | active redline尝试launch、release或普通receipt解除containment | containment保持;launch / cleanup / release阻断 | redline probe进入Contained / HandoffPending,不在托管外继续 | CMD-019/020;JOB-007;CONF-010;SUITE-012/013 | 真实子集blocked |

安全专项结果传播规则:

- P0-C负向语义失败直接使所属MAIN / OPS gate失败,不能等待ENV-05补救。
- P0-Q任一identity缺失、probe未执行、cleanup disposition缺失或真实越界成功使GATE-P0Q为Blocked / Failed,并阻断release。
- ENV-02~04可以证明拒绝、状态、无副作用、redaction和guard语义,不能证明真实四维隔离已施加。
- ENV-06 selected-run不能替代ENV-05 P0-Q,PROFILE-05资格也不能自动传递给PROFILE-06 /07。

## 7. 可用性、降级与Fail-Closed专项

| 故障面 | 注入 /操作 | 通过条件 | 禁止判定 | TC / Suite |
|---|---|---|---|---|
| context / identity / ref | missing、unresolved、conflict、unauthorized、resolver unavailable | Pending / Rejected / Unresolved等正式surface;0 launch;不补造identity | 默认 /匿名语境继续 | CMD-001/002;CNS-005/006;CFG-018;SUITE-002/004/005 |
| capability / backend | stale、unsupported、partial、adapter unavailable | boundary未Coherent;partial handle不可用;0 weak fallback | host / fake继续或partial success | CMD-003/004;ERR-006/007;CFG-018;SUITE-004/010 |
| policy / authorization | missing、stale、conflict、unsafe、high-risk unknown | fail-closed;decision不为Accepted;backend调用`=0` | permissive fallback或本地allowlist | CMD-005/006/008;ERR-005;SUITE-004/010 |
| capture / handoff target | capture partial / failed,target mismatch / unavailable / retryable | source run / capture truth保留;owning state诚实;未交接不伪Delivered | rollback source或伪造receipt | CMD-009~012;CFG-021;SUITE-004/008/012 |
| inbound / publisher | dependency unavailable、invalid / forbidden,publish retryable / dead-letter | unavailable为Delayed;invalid为Quarantined;source truth不回滚 | 全部映射success / retry或ack丢失 | CNS-001~022适用;EVT-015;CFG-020/021;SUITE-005/010 |
| telemetry sink | optional sink unavailable | 只允许qualified Degraded;formal audit、redaction和hard guard保持 | 关闭audit / guard / redaction | CFG-015;SUITE-003/010 |
| projection / maintenance | missing、stale、adapter failed、mixed batch | query Degraded且0 write;job PartialFailed / Degraded且honest counts | query修复、job改core truth或伪全成 | QRY-017~024;JOB-008~010/012;CFG-019/023;SUITE-004/006/012 |
| ENV / harness前置 | fixture、candidate、provider、lab或suite本身缺失 | test infra失败或P0-Q Blocked | 把环境缺失当预期negative TC pass | Step 8环境处置;GATE-MAIN / P0Q |

## 8. 一致性、幂等与并发专项

| 场景 | 故障注入 /调度 | 必须断言 | TC / Suite | PER |
|---|---|---|---|---|
| staged transaction failure | reserve、truth、audit、relay、result、complete、cursor、commit各阶段失败 | transaction只允许全量可见或全量不可见;rollback后staged writes均不可见 | TXN-001~006;SUITE-007 | PER-022 |
| commit unknown | commit返回unknown后same key重试 | 先查idempotency / stored result / truth;不盲做第二次owner write | TXN-005/013/014及ERR适用;SUITE-007/010 | PER-022/024/026 |
| rollback failure | rollback同时失败 | safe diagnostic / manual integrity disposition;不隐藏补偿写或宣称回滚成功 | ERR / TXN适用;SUITE-010/012 | PER-022/026 |
| duplicate same digest | Command / Consumer / Job预存completed结果后重放 | 返回stored result / receipt / report;resolver / backend / selection / owner mutation调用`=0` | TXN-007~009;CNS / JOB duplicate;SUITE-005~007 | PER-024 |
| duplicate different digest | 同key不同正式输入 | conflict;旧result与truth不变;不复用错误结果种类 | TXN-010~012;CTR-004;SUITE-007 | PER-002/024 |
| missing / wrong stored result | completed reservation缺result或kind错 | consistency error;不从current truth重算 | TXN-007~012适用;ERR-017/018;SUITE-007/010 | PER-024/026 |
| expected version conflict | stale version与新winner并发 | loser冲突;不覆盖新状态;无半audit / relay / result | TXN-013/014;RACE适用;SUITE-007/009 | PER-023/025 |
| 19类owner race | barrier控制两个或多个参与者的关键interleaving | 每类single-winner;loser正式surface;owner group无半状态 | RACE-001~019;SUITE-009 | PER-025 |
| relay / handoff race | publish / delivery terminal与retry并发 | terminal record不被同record重开;source truth / capture不回滚 | RACE / EVT / CNS适用;SUITE-005/009 | PER-020/025 |
| control / cleanup / redline race | kill、cleanup、reaper、containment竞争 | guard优先级稳定;不复活run;active redline不release | CMD-013~020;RACE-011~013;SUITE-009/012 | PER-007/018/025 |

## 9. 恢复、Cleanup、Lease、Reaper与Redline专项

| 恢复主题 | 触发 | 允许恢复动作 | 禁止动作 /通过条件 | TC /环境 |
|---|---|---|---|---|
| timeout / kill / cancel | formal control或backend timeout | 新control / classification flow保存稳定事实;bounded inspect | 不执行runtime recover / agent replay;run状态单调;重复信号不分叉 | CMD-013~016;CONF-007;ENV-02 /05 |
| capture partial / failed | adapter partial / failed或post-failure inspect | 记录Partial / Failed与safe refs,后续新handoff / investigation | 不把failed映射Complete,不把raw output入carrier,不改run成功 | CMD-009/010;CONF-008;ENV-02 /05 |
| handoff retry / terminal | target mismatch、retryable、failed、dead-letter | owning marker / report更新,新retry按正式协议 | 不回滚capture / source truth,不伪Delivered | CMD-011/012;CFG-021;ENV-03 /04 |
| lease expiry / orphan | expiry、lifecycle断开、inspect失败 | stop-new-use、inspect、orphan marker、guard重评 | expiry不auto-release;uncertain保持Blocked / OrphanSuspected | JOB-005;CFG-013/022;CONF-009;ENV-04 /05 |
| cleanup readiness | evidence / handoff / investigation / redline组合 | 只评估并保存guard;Allowed后才可独立release flow | missing默认Blocked;无force-clean;评估命令本身release调用`=0` | CMD-017/018;JOB-006;ENV-02 /04 |
| reaper release | expired / orphan环境候选 | guard-first inspect / release;逐item保存honest disposition | non-Allowed release`=0`;release失败不伪Released;lab teardown与产品truth分离 | JOB-005;CONF-009;ENV-04 /05 |
| redline containment | escape-like / fs / network / process / secret / high-risk detector | Detected -> Contained / HandoffPending;investigation handoff | 非advisory;普通receipt不解除;launch / cleanup / release继续受阻 | CMD-019/020;JOB-007;CONF-010;ENV-02 /04 /05 |
| maintenance partial failure | rebuild / derived / reconciliation item失败 | per-item新marker / report、可重放stored report | 不修core truth、不改历史report、不伪全成功 | JOB-008~012;CFG-023;ENV-04 |

恢复专项必须同时保留原始失败状态与后续新动作的因果引用。诊断重跑使用新`<run_id>`并记录父run引用;不得覆盖原Failed / Blocked artifact。具体status schema和归档规则由Step 13收口。

## 10. 可观测性、正式审计与脱敏专项

| 观测 /审计对象 | 必须存在 | 禁止内容 /错误替代 | 检查方式 | TC / PER |
|---|---|---|---|---|
| accepted Command truth group | truth / audit / relay / stored result / idempotency complete / cursor适用引用且同UoW | 只有log没有formal audit;部分提交;外部正文 | service assertion + transaction write-set audit | CMD accepted;TXN-001~006;PER-009/022/032 |
| rejected / blocked Command | safe public error、必要的rejection / diagnostic material、0 forbidden side effect | success trace、active handle、backend launch或raw adapter body | case side-effect audit + error mapping | CMD negative;ERR-001~038适用;PER-026/032 |
| Query | formalview / degradation surface、query metric / safe log适用 | write UoW、audit append、relay、refresh / repair | write-audit + repository / port call audit | QRY-001~026;PER-010/019/032 |
| Consumer / relay | receipt disposition、stored result、relay marker / payload refs | ack无receipt、publish失败回滚source、raw envelope body | protocol row + worker side-effect audit | CNS-001~022;EVT-001~015;PER-011/012/020 |
| Job / recovery | report ref、per-item refs / counts / status、cleanup / containment disposition | full-success伪造、core truth repair、报告无raw回链 | report schema + no-repair / pairing check | JOB-001~012;PER-013/018/019 |
| structured log | trace ref、operation kind、state / result、error kind、safe diagnostic ref、duration / count适用 | secret、token、raw ref、raw topic / endpoint、SQL / HTTP / SDK body、process output、stack | synthetic marker scan;禁止值不在失败报告回显 | CTR-006;CFG-009/030;PER-029/032 |
| metric | 正式`03`定义的counter / histogram及低基数kind / state / result标签 | request / actor / subject / trace / relay ID、digest、key、free text | metric name / label schema scan + injected forbidden label | CFG-030;PER-032 |
| formal audit trace | context、boundary、policy、run、capture、handoff、failure、control、cleanup、redline关键变化可分页回链 | telemetry替代audit、page cursor混成truth cursor、restricted item泄漏 | audit append assertion + QRY-025/026 | PER-023/032 |
| fixed-run report | suite raw digest、TC / CUT / PER、status、failure / blocked reason、cleanup summary | `latest`、静态pass、缺raw、Blocked归一Skipped | pairing / no-static-evidence / blocked-propagation checks | Step 9 checks;PER-001~038 |

观测降级不允许削弱正式审计、安全guard或redaction。optional telemetry sink不可用时可以产生正式Degraded surface,但formal audit缺失、redaction scan失败或关键追溯缺口均是阻断失败。

## 11. AC-SBX-035~041与VF-SBX-001~010覆盖审计

### 11.1 NFR /数据边界验收覆盖

| 正式验收 | 专项承接 | 主要TC / Suite | 通过口径 | 成熟度 |
|---|---|---|---|---|
| AC-SBX-035 外部正文禁止入仓 | 安全 / sensitive / redaction | CTR-006;CFG-009/030;CONF-013;SUITE-003/013 | 所有适用carrier synthetic marker泄漏`=0` | P0-C designed;provider子集blocked |
| AC-SBX-036 性能 | 结构有界 + conditional量化 | COND-004/005;SUITE-014/015 | P0结构断言阻断;数字只在正式基线后conditional裁决 | P0-C designed;量化conditional |
| AC-SBX-037 可用性 | unavailable / stale / downstream failure | CMD / CNS / CFG / JOB负向;SUITE-004~006/010/012 | 显式等待 /拒绝 /失败 /降级且不伪成功 | designed_p0c;真实子集blocked |
| AC-SBX-038 安全 | host /四维 / policy / cleanup / leak红线 | CFG / ARCH / CONF;SUITE-003/010/012/013 | 正式零容忍结果;P0-Q不得被低profile替代 | P0-C designed;P0-Q blocked |
| AC-SBX-039 审计追溯 | same-UoW audit、trace、pairing | QRY-025/026;EVT / TXN适用;SUITE-004~007/011 | 关键追溯缺口`=0`;raw / report可回链 | designed_p0c |
| AC-SBX-040 幂等一致性 | stored replay、transaction、race、owner不分叉 | TXN-001~014;RACE-001~019;SUITE-007/009 | one truth、single winner、duplicate 0重算 | designed_p0c |
| AC-SBX-041 可观测性 | log / metric / marker / report + redaction | CTR-006;CFG-015/030;ERR / JOB适用 | 关键状态 /异常有safe surface;无盲区 /泄漏 | P0-C designed;真实probe blocked |

### 11.2 一票否决覆盖

| VF | 负向证明 | 主Suite / Gate | 当前判定 |
|---|---|---|---|
| VF-SBX-001 核心闭环缺节点 | 254 TC主归属 + C-SBX各主线suite + release固定run完整性 | SUITE-001~014 / RELEASE | designed;release当前Blocked |
| VF-SBX-002 host /旁路 /匿名冒充formal | entry / identity / substitution veto / candidate preflight | SUITE-001/004/013 / P0Q | P0-C designed;P0-Q blocked |
| VF-SBX-003 四维silent degrade | partial capability整体拒绝 + 四维candidate-real probe | SUITE-002/004/010/013 | P0-Q blocked |
| VF-SBX-004 policy不完备继续 | missing / stale / conflict / unauthorized时backend call `=0` | SUITE-002/004/010/013 | P0-C designed;真实子集blocked |
| VF-SBX-005 外部正文 / truth入仓 | field negative + all-carrier synthetic marker scan | SUITE-001/003/010/013 | P0-C designed;provider子集blocked |
| VF-SBX-006 材料静默升格下游truth | capture / handoff / event / query owner与write-audit | SUITE-004~006/008/012 | designed_p0c |
| VF-SBX-007 cleanup先删材料 | non-Allowed guard + release call audit + candidate reaper probe | SUITE-002/004/012/013 | P0-C designed;P0-Q blocked |
| VF-SBX-008 orphan / redline脱管 | deterministic safety race + lifecycle / containment probe | SUITE-002/009/012/013 | P0-C designed;P0-Q blocked |
| VF-SBX-009 第二套execution / policy / control语义 | caller / adapter parity、stored replay、single-winner、no rollback | SUITE-001~012适用 / MAIN | designed_p0c |
| VF-SBX-010 追溯缺口 | protocol inventory、audit page、artifact / report pairing、qualification identity | SUITE-011/013 / MAIN / P0Q / RELEASE | P0-C designed;P0-Q blocked |

审计结论: `AC-SBX-035~041`与`VF-SBX-001~010`均有测试方法、环境、TC / suite和通过口径。没有P0 manual-only断言,也没有把Blocked / conditional当成Passed。

## 12. 专项到Suite / Gate反向映射与结果传播

| 专项 | Primary suite | 补强suite / check | Gate传播 | Planned requirement |
|---|---|---|---|---|
| 结构有界性 | SUITE-014 | 004 /006~010 /012 | MAIN + OPS;缺观测或结构越界失败 | PER-004~007/025/030 |
| 量化性能 | SUITE-015 | none | P1 conditional,不进入P0补偿 | PER-037/038 |
| 安全 / redaction / dependency | SUITE-003 | 001/004/010/012;redaction / dependency check | PR / MAIN / OPS阻断 | PER-026/029/032/033 |
| 四维隔离资格 | SUITE-013 | identity / cleanup / redaction checks | P0Q Blocked / Failed传播到RELEASE | PER-034~036 |
| 可用性 / fail-closed | SUITE-004/010 | 002/005/006/008/012 | MAIN / OPS阻断 | PER-003~008/016~21/026/031 |
| 一致性 /幂等 /并发 | SUITE-007/009 | 004~006/008/010/012 | MAIN / OPS阻断 | PER-022~025 |
| 恢复 /生命周期 | SUITE-012 | 007~010;013真实子集 | OPS阻断;P0Q独立阻断 | PER-007/018/035 |
| 可观测性 /正式审计 | SUITE-003/011 | 004~007/010/012;pairing checks | MAIN / OPS / RELEASE阻断 | PER-012/022/023/026/032 |

传播规则:

1. 语义断言失败为`Failed`;suite / harness / raw缺失为`InfraFailed`或`Blocked`,不能统一成Skipped。
2. ENV-05前置不完整时SUITE-013为Blocked且0 launch;GATE-P0Q与RELEASE保持Blocked。
3. ENV-06未qualified时SUITE-015为`NotRunConditional`;不改变P0状态。
4. fixed-run raw、report、digest或TC / protocol / PER pairing任一缺失时对应gate失败 /阻断。
5. Step 13再固定最终status schema和正式证据归档;本Step不创建EV或evidence index。

## 13. Blocker、上游影响与历史材料处理

| 项 | 状态 | 本Step结论 | 后续处理 |
|---|---|---|---|
| 历史性能数字 / backend名称 | contained_as_historical_material | 不进入P0或P1门槛,不选择Docker / gVisor | 需要量化时先建立正式产品 / workload / baseline并回写相关文档。 |
| 目标实现仓 / suite /脚本 / CI缺失 | open_for_07_precheck | 不阻塞专项设计,阻塞所有实际运行和artifact生成 | `07`实施边界承接Step 9 /10契约。 |
| ENV-05 candidate / capability / provider / lab缺失 | open_for_p0q_execution | P0-Q方法完整,执行保持Blocked | 不得由fake / simulation / ENV-06替代。 |
| PROFILE-06 durable / real-like / rollout未qualified | open_for_p05_p06_p07_activation | 量化和physical drill保持conditional | 满足正式激活门禁后selected-run。 |
| PROFILE-07 | inactive_reopen_required | 只做absence / activation reject | 新production要求先回写`00~04`并重开测试设计。 |
| 正式`00/03/04`冲突 | none_found | 六类NFR均有设计对象和既有TC承接,无需上游回写 | 后续若阈值或public surface变化,触发design-reopen guard。 |

新增的`SBX-TEST-NONFUNCTIONAL-001`属于本Step内部收敛项:正式NFR、红线、TC、suite和成熟度原分散于Step 5~9,现已形成统一专项矩阵并解析为`resolved_for_test_step_10`。它不是产品或执行blocker。

## 14. 正式文档回填草稿

正式`05-测试方案.md` §10后续应装配:

- §4专项总矩阵,明确每项方法、环境、来源阈值、TC、suite、PER和成熟度。
- §5的`AC-SBX-036`分层:结构有界性为P0-C blocking;量化latency / throughput / capacity为conditional。
- §6四维真实隔离、host / weak fallback、外部正文、cleanup / redline红线,并保持ENV-05执行Blocked。
- §7~§9的fail-closed、事务 /幂等 /race和cleanup / lease / reaper / redline fault injection。
- §10的log / metric / formal audit / report / redaction验证,并明确telemetry不能替代formal audit。
- §11~§12的`AC-SBX-035~041`、`VF-SBX-001~010`全覆盖和suite / gate传播。

当前不得修改旧正式`05`;只能在Step 15由用户确认的Step 1~14整体装配。

## 15. 专项停审与进入下一步条件

| 审查项 | 结论 | 缺口 /处置 |
|---|---|---|
| 六类NFR是否都有专项方法 | 通过 | 性能、可用性、安全、审计、幂等一致性、可观测性均已闭合。 |
| AC-SBX-035~041是否可判定 | 通过设计停审 | P0-Q真实子集保持execution blocked。 |
| VF-SBX-001~010是否都有负向测试 | 通过设计停审 | 无manual-only红线。 |
| 是否发明无来源性能阈值 | 否 | 历史数字排除,量化候选保持conditional。 |
| 是否把fake / simulation当真实隔离资格 | 否 | 仅ENV-05 / SUITE-013可证明P0-Q。 |
| fault injection / race / cleanup是否可落码 | 通过 | 复用正式TC、数据集、环境和suite,未新造第二套编号。 |
| 观测 /审计是否可由证据验证 | 通过 | planned raw / report / pairing与redaction入口明确;实例留真实执行。 |
| 是否创建真实证据 /结果 | 否 | 仅PER与planned producer,无EV、run_id、artifact、report或签署。 |
| 是否存在阻塞Step 11设计的上游blocker | 否 | 执行blocker继续保留但不阻塞缺陷规则设计。 |

当前状态为`reviewed_passed_to_step_11`。用户已确认Step 10;Step 11完成后必须重新停审。
