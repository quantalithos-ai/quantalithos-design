# Step 8. 设计测试环境与配置矩阵

> 对应SOP: `standards/document/测试方案讨论流程_SOP.md` Step 8
> 书写规范: `standards/document/测试方案书写规范.md` §5.8
> 回填章节: `05-测试方案.md` §8 测试环境与配置矩阵
> 生成日期: 2026-07-13
> 状态: reviewed_passed_to_step_9
> 所属流程: `05_test_plan_calibration_flow.md`
> 本Step口径: 将Step 6用例和Step 7数据绑定到正式`SBX-ENV-01~07` / `SBX-PROFILE-01~07`,并逐项判断compile / runtime / event依赖及协作方式。本文只定义环境职责、激活前置和配置矩阵,不声称环境实例、candidate backend、provider、suite、run、EV或测试结果已经存在。

---

## 1. Step开工确认与状态

| 检查项 | 结论 |
|---|---|
| 用户是否确认Step 7并允许进入Step 8 | 是。用户在Step 7停审后明确回复“同意”,本次只放行Step 8。 |
| 台账与flow是否允许进入 | 是。Step 7原为`pass_wait_review`;本次确认后转为`passed_to_step_8`。 |
| 是否读取Step 8标准 | 是。已读取测试SOP Step 8、书写规范§5.8和全局依赖裁剪规则。 |
| 是否读取正式配置与依赖 | 是。复核正式`01`依赖裁剪、正式`03`外部绑定、正式`04`的ENV / PROFILE、S01~S08、I001~I101、D01~D44和failure / degradation。 |
| 是否读取用例与数据 | 是。复核Step 6的254条TC和Step 7的28个DS-SBX数据集。 |
| 是否参考L1粒度 | 是。参考L1-governance / L1-artifact Step 8的环境、依赖、配置、数据和不可用处置结构,不继承其环境别名或领域依赖。 |
| 当前状态 | 七个正式环境 / profile、依赖类型、配置域、数据集、不可用处置、拓扑和停审已收稳;用户已确认并传递至Step 9。 |
| 上游blocker | 未发现阻塞Step 8设计的上游冲突。ENV-05 /06 /07实例资格缺口继续阻塞相应执行。 |
| 停审 | 用户已确认Step 8;Step 9已据此完成。正式`05`仍不得修改。 |

## 2. 本步目标、边界与术语

本Step完成:

1. 以正式`SBX-ENV-01~07`为环境身份,不另造`local-dev / ci-test / staging-like`别名。
2. 固定每个环境的用途、依赖、协作方式、关键配置、数据策略、激活前置和证明上限。
3. 裁剪L4-sandbox相关compile / runtime / event依赖,禁止把运行期或事件协作写成path dependency。
4. 将D01~D44、I001~I101、S01~S08和PROFILE门禁映射到测试切口 / TC。
5. 定义环境 /依赖不可用时的failed / blocked / delayed / degraded / conditional处置,禁止skip-as-pass。

| 术语 | 本Step定义 | 禁止误用 |
|---|---|---|
| 环境可定位 | 有稳定ENV ID、profile、职责、依赖类型、配置前置和不可用处置 | 不表示物理地址、部署或环境实例已存在。 |
| 环境可执行 | 实例、binding、material、harness和进入门禁真实满足 | 不能由设计表或fixture推导。 |
| P0-C环境 | ENV-01~04,承载L1~L4 contract / orchestration / integration语义 | 不证明真实隔离。 |
| P0-Q环境 | ENV-05 dedicated backend conformance lab | fake / seam / simulation不能替代。 |
| conditional环境 | ENV-06 PROFILE-06 real-like组合 | 不补偿P0-C或P0-Q。 |
| inactive目标 | ENV-07 / PROFILE-07 | 当前不得启用、执行或宣称ready。 |

分类轴说明: 正式`04`把PROFILE-05标为配置成熟度 /部署优先级P1,Step 2 /4把CUT-SBX-034~036标为测试核心门禁P0-Q。前者说明profile当前条件化且未qualified,后者说明真实隔离证明不能从核心通过条件中删除;两者不冲突,也不得互相改写。

本Step不定义具体主机名、endpoint、topic原名、credential、CI job、suite、shell命令、artifact路径、性能阈值、EV、结果或签署。Step 9定义suite /命令 /CI,Step 10定义专项方法,Step 13定义报告与证据schema,`07/09`后续定义真实实现与运行准备。

## 3. SOP问题回答

| 问题 | 回答 |
|---|---|
| local / CI / integration / staging分别测什么 | ENV-01本地contract shell;ENV-02 deterministic CI contract;ENV-03 controlled seam;ENV-04 operations simulation;ENV-05 dedicated P0-Q conformance;ENV-06 conditional real-like staging;ENV-07 inactive production target。 |
| 每个环境依赖哪些服务 | ENV-01~04使用in-memory / semantic fake / controlled seam / simulation;ENV-05需要candidate backend、capability、dedicated store、secure provider和受控targets;ENV-06需要qualified backend与durable / bus / resolver / handoff / scheduler / sink完整组合。 |
| 哪些配置影响结果 | S01~S06来源、I001~I101字段、D01~D44域、PROFILE composition、store / resolver / backend / event / handoff / job / observability binding和NCFG / FC / XVAL。S07 / S08当前unsupported。 |
| 哪些依赖需要mock / fake | ENV-01~02 deterministic fake;ENV-03 controlled stub / fake;ENV-04 simulation / replay;ENV-05 candidate-real且禁止fixture替代;ENV-06 conditional real-like。 |
| 环境不可用如何处理 | P0-C必需fixture / binding缺失则fail-fast;预期dependency unavailable用例仅在正式surface命中时通过;ENV-05缺资格为Blocked;ENV-06 unavailable为conditional not run;ENV-07保持inactive。 |
| 哪些依赖可用path dependency | 只有`quantalithos-core` / `core-contracts`编译期依赖。 |
| 哪些是运行期或事件协作 | context / policy / capability sources、isolation backend、stores、provider、handoff targets是runtime;`L0-bus`及inbound / outbound event协作是event;均不得成为sibling path dependency。 |

## 4. 测试环境总矩阵

| 环境 | 用途 | 依赖服务 | 全局依赖类型 | 测试协作方式 | 关键配置 / feature flag | 数据策略 | 当前状态 /风险 |
|---|---|---|---|---|---|---|---|
| `SBX-ENV-01 developer workstation` / PROFILE-01 | 本地loader / validator / builder、Command / Query / Job shell、safe diagnostic smoke | in-memory contract stores;deterministic context / policy / capability fake;non-executing backend fake;event / handoff disabled或fake | compile:`core-contracts`;runtime:fake ports;event:fixture-only | fake / in-memory / disabled;禁止host spawn | S01 required;S02 / S03 optional;bounded S05;fixture-owned S06;S04 / S07 / S08 forbidden;D01~08 / D37~42 | BASE / PROTO及owner happy rows;namespace reset | design-locatable;环境实例与测试未声称存在;不能证明执行隔离 |
| `SBX-ENV-02 ordinary PR / merge CI` / PROFILE-02 | deterministic L1~L4 contract、state、UoW、replay、race、config、redaction、entry tests | run-isolated semantic stores;fixed clock / id;failure-injection fakes;fixture event loop;fake handoff / publisher | compile:`core-contracts`;runtime:semantic fakes;event:fixture envelope | deterministic fake / generated fixture / static metadata | S01 + suite S02 + CI allowlisted S03 + S05 + required S06;S04 / S07 / S08 forbidden;I001~I101参数矩阵 | 全部P0-C DS-SBX数据,CONF除外;per-case namespace | design-locatable;真实CI / suite尚不存在;任一required fixture缺失fail-fast |
| `SBX-ENV-03 controlled integration test` / PROFILE-03 | resolver / consumer / publisher / handoff / diagnostic接缝、route / target完整性和failure mapping | isolated test store;controlled context / policy / capability source;execution non-executing fake;controlled event / target / safe sink | compile:`core-contracts`;runtime:controlled ports;event:controlled envelopes / publisher | controlled stub / fake fault / registered endpoint refs;不接真实material | S01 baseline + required S02 + controlled S03 + bounded S05 / S06;S04 forbidden;D14~28 / D33~40 | PORT / RELAY / JOB / READ / CONFIG / SENSITIVE数据;namespace + adapter reset | design-locatable;不证明backend、bus或下游产品资格 |
| `SBX-ENV-04 controlled operations simulation` / PROFILE-04 | relay / retry、refresh / projection / reconciliation、lease / orphan / cleanup / redline、rollback / drift simulation | simulation / replay stores;simulated handles / lease / reports;fake publisher / targets;safe diagnostics | compile:`core-contracts`;runtime:simulation;event:replay / feedback fixture | simulation / event replay / deterministic fault;绝不真实release | S01 + required simulation S02 / S03 / S06 + typed S05;S04 / S07 / S08 forbidden;D24 / D28~40 / D42 | READ / RELAY / REPLAY / JOB / RACE / SAFETY / CHANGE数据 | design-locatable;不得把simulation写成真实cleanup / containment |
| `SBX-ENV-05 dedicated backend conformance lab` / PROFILE-05 | P0-Q四维真实施加、bounded launch / capture / lifecycle / release / redline和qualification integrity | candidate real backend / capability source;isolated conformance store;S04 provider;controlled non-production capture / material / obs / investigation targets;required safe audit sink | compile:`core-contracts`;runtime:candidate backend / provider / targets;event:optional controlled evidence route | candidate-real + controlled harness;禁止fake / fixture / host替代 | strict S01 + required S02 / S03 / S04 + typed S05;S06~S08 forbidden;D16~20 / D25~32 / D37~43 complete | QUAL / PROBE / LIFECYCLE-Q01 / SUBSTITUTION-X01 / SENSITIVE-X01;qualification-scoped cleanup | design-locatable but instance blocked;candidate / capability / provider / lab均未形成;P0-Q不得pass |
| `SBX-ENV-06 staging` / PROFILE-06 | conditional P1 durable parity、real-like E2E、dependency outage、scheduler / handoff / observability、rollout / drift / rollback | conformance-qualified backend;durable stores;real-like bus / resolvers / targets / scheduler / sink;qualified S04 provider | compile:`core-contracts`;runtime:real-like composition;event:real-like transport | selected-run real-like;禁止fake fallback | safe S01 + complete S02 / S03 / S04 + restricted S05;S06~S08 forbidden;D01~43完整 | COND + CHANGE + selected P0 contract corpus;run-scoped durable cleanup | conditional_not_currently_qualified;不补偿P0 |
| `SBX-ENV-07 production` / PROFILE-07 target | 未来production security / capacity / disaster / validation目标 | future approved backend / durable store / bus / resolver / targets / scheduler / sink / provider | future compile/runtime/event,当前不激活 | none current | future S02 / S03 / S04 + restricted S05;S06~S08 forbidden;当前selector即reject;D44仍non-config | 当前无测试数据实例;仅ARCH / COND absence checks | inactive;不得写成ready、部署或验收 |

## 5. 环境拓扑与依赖裁剪图

#### 依赖裁剪图: L4-sandbox测试环境

```text
                           +-------------------------+
                           | core-contracts          |
                           +------------+------------+
                                        ^
                                        | [compile]
                                        |
+------------------------+   [runtime]  +-------------------------+
| context / policy /     +------------>| L4-sandbox test subject |
| capability sources     |             | API / worker / jobs     |
+------------------------+             +---+---------+---------+--+
                                             |         |         |
                  [runtime] backend / store  |         |         | [runtime] handoff
                                             v         |         v
                                    +-------------+    |   +------------------+
                                    | isolation / |    |   | artifact / obs / |
                                    | store / S04 |    |   | investigation    |
                                    +-------------+    |   +------------------+
                                                       |
                                                       | [event]
                                                       v
                                               +---------------+
                                               | L0-bus / event|
                                               | fixtures      |
                                               +---------------+

Callers / consumers: L2-tools / L2-runtime / L2-member-service / L5-runner
  -> [runtime/event] formal requests, feedback, refs and body-free material only
  -> never [compile] dependency of L4-sandbox
```

图示说明:

- `core-contracts`是唯一允许进入package dependency的上游。
- ENV-01~04将所有runtime / event边替换为fake、controlled或simulation,但依赖类型不改变。
- ENV-05必须把backend / capability / provider边绑定到同一qualification identity,不能转为host或fixture路径。
- Artifact、observability和investigation只消费handoff material / refs,不反写sandbox truth。
- tools semantic execution、runtime agent loop和member lifecycle不进入sandbox测试主体。

## 6. 测试依赖类型与协作方式判定表

本文件表格中的`CMD-001`等token按`TC-SBX-CMD-001`展开,`PROTO`等数据token按对应`DS-SBX-*`数据集展开;它们仅是表内紧凑引用,不创建新编号体系。

| 依赖对象 | 关系方向 /依赖类型 | 是否允许path dependency | ENV-01~04协作 | ENV-05+协作 | 主要TC /数据 | 风险边界 |
|---|---|---|---|---|---|---|
| `quantalithos-core` / `core-contracts` | sandbox依赖;compile | 是,具体路径由`07` precheck确认 | 正式typed refs / metadata / error carrier | 同一正式carrier | 全部TC;PROTO | exact type可用性仍待目标仓复核 |
| `L0-bus` / event transport | event collaboration | 否 | fixture envelope、fake / controlled publisher、replay | ENV-05可disabled / controlled;ENV-06 real-like | CNS / EVT / JOB;RELAY | fake route不证明真实bus |
| `L1-identity` / `L1-work` context anchors | sandbox消费;runtime / event | 否 | deterministic / controlled body-free summary | strict non-production / real-like resolver | CMD-001/002;CNS-005/006;CONTEXT / PORT | 不读取identity / work正文 |
| `L1-governance` / `L3-capability-hub` / `L2-tools` policy sources | sandbox消费;runtime / event | 否 | allow / deny / stale / unavailable summary fake | strict source;缺失fail-closed | CMD-005/006/008;CNS-007~010;POLICY / BOUNDARY | 不执行policy DSL / allowlist truth |
| isolation backend / capability infrastructure | sandbox消费;runtime infrastructure | 否 | non-executing fake / availability seam / simulation | ENV-05 candidate-real;ENV-06 qualified real-like | CMD-003/004/007~010;CONF;BOUNDARY / QUAL / PROBE | ENV-01~04不能证明真实隔离;无host fallback |
| durable / projection / replay stores | sandbox消费;runtime infrastructure | 否 | semantic in-memory / simulation store | ENV-05 isolated;ENV-06 durable parity | TXN / RACE / QRY / JOB;TXN-X01 / READ / REPLAY | fake必须保持UoW parity;durable仍conditional |
| secure material provider | sandbox消费;runtime infrastructure | 否 | S04禁止,只用synthetic marker / fake ref | ENV-05 /06 qualified non-production provider | CFG-012/013;CONF-013;SENSITIVE-X01 | 不使用真实生产secret或raw fallback |
| `L1-artifact` material target | sandbox提供;runtime / event / handoff | 否 | fake / controlled target + receipt | ENV-05 controlled non-prod;ENV-06 real-like | CNS-013/014;JOB-004;RUN / PORT | receipt不等于artifact truth |
| `L4-observability` material target | sandbox提供;event / handoff | 否 | fake / controlled safe sink | ENV-05 required safe sink;ENV-06 real-like | CNS-015/016;CFG-015/030;SENSITIVE-X01 | telemetry sink不替代formal audit |
| investigation target | sandbox提供;runtime / event / handoff | 否 | fake / simulation feedback | ENV-05 controlled security target;ENV-06 approved | CNS-019/020;CONF-010/013;SAFETY / PORT | ordinary receipt不得解除guard |
| `L2-tools` / `L2-runtime` / `L2-member-service` / `L5-runner` callers | sandbox被依赖;runtime / event | 否 | canonical request / consumer fixtures only | bounded conformance driver / future real-like caller | protocol / entry TC;PROTO | 不测试tool semantics、agent loop或member orchestration |
| clock / id generator | sandbox消费;runtime infrastructure | 否 | deterministic fake | controlled / provider-backed | state / TXN / RACE;BASE | 不把timestamp / trace当cursor |
| local manifest / carrier scanner | local test tool;不适用 | 不适用 | generated graph / isolated scan corpus | ENV-05 anti-leak scan;ENV-06 selected | ARCH / CFG;ARCH / SENSITIVE-X01 | 具体命令和artifact留Step 9 |
| `L0-sdk` / `L4-archive` /其他L5产品 | current主链裁剪外 | 否 | 不装配;只做absence / boundary static check | 需求触发时重开设计 | ARCH-001~003;COND-003 | 不因方便加入依赖 |

## 7. Profile、来源与Adapter配置矩阵

| Profile | Source组合 | Store / UoW | Context / policy / capability | Backend / capture / release | Event / handoff | Sensitive / S04 | 资格与禁止替代 |
|---|---|---|---|---|---|---|---|
| PROFILE-01 `local-contract` | S01;optional S02 / S03;bounded S05;fixture-owned S06 | in-memory contract | deterministic fake | non-executing fake / disabled | fake / disabled | S04 forbidden | no host / real workload;local启动不等于隔离通过 |
| PROFILE-02 `ci-contract` | S01 + suite S02 + CI S03 + S05 + required S06 | run-isolated semantic fake | deterministic fixture + failure injection | non-executing fake | asserted fake schema / route / receipt | S04 forbidden;fake marker only | fixture缺失fail-fast;fake通过不传递P0-Q |
| PROFILE-03 `integration-seam` | S01 + controlled S02 / S03 + bounded S05 / S06 | isolated test store / test double | controlled body-free seam | execution fake;availability / error seam | controlled consumer / publisher / target / sink | S04 forbidden | seam成功不等于coherent boundary |
| PROFILE-04 `operations-simulation` | S01 + simulation S02 / S03 / S06 + typed S05 | simulation / replay state | fixture / replay summary | simulated handle / inspect / release only | relay / receipt / handoff simulation | S04 forbidden;raw history forbidden | simulation不等于真实release / cleanup |
| PROFILE-05 `backend-conformance` | strict S01 + required S02 / S03 / S04 + typed S05;S06 forbidden | isolated conformance store | strict policy fixture + candidate capability | candidate-real launch / capture / inspect / release | controlled evidence / material / obs / investigation | qualified non-production provider required | 当前not qualified;fake / host / fixture substitution veto |
| PROFILE-06 `staging-like` | safe S01 + complete S02 / S03 / S04 + restricted S05;S06 forbidden | durable real-like + UoW parity | real-like resolvers | conformance-qualified backend | real-like bus / targets / scheduler / sink | qualified non-production provider | conditional;任一fake / incomplete binding阻断 |
| PROFILE-07 `production-like` | future S02 / S03 / S04 + restricted S05;S06~S08 forbidden | future approved | future approved | future approved | future approved | future approved | current selector / activation reject;不得声称ready |

所有profile都禁止S07 remote overlay和S08 admin / break-glass overlay。S04只解析已选opaque ref,不是global override；高优先级非法值不得fallback到低优先级source。

## 8. 配置域到测试切口矩阵

| 配置域 /稳定项 | 环境影响 | 主要用例 | 数据集 | 必须断言的失败策略 |
|---|---|---|---|---|
| D01~D04 / I001 / config identity / validator / builder | source选择、profile和atomic generation | CFG-001~006/014/016;STA-030;ERR-030~035 | CONFIG / CONFIG-X01 / COMPOSE-X01 / TXN-X01 | invalid winner reject;0或完整publish;无mixed generation |
| D05~D08 / I002~I016 entry / worker / job / feature assembly | entry ceiling、registry、current-unit isolation | CFG-005/008/017;ARCH-002;CMD / QRY / CNS / JOB适用entry | PROTO / CONFIG / PORT | unit独立拒绝;不得修改旧result或其他unit |
| D09~D13 / I017~I027 stores / replay | UoW、projection、relay、idempotency / retention | TXN-001~014;RACE;QRY;JOB;CFG-014/016 | TXN-X01 / READ / RELAY / REPLAY / RACE | no partial visibility;duplicate不重算;fake parity |
| D14~D16 / I028~I038 context / policy / capability | resolution、fail-closed、boundary capability | CMD-001~006;CNS-005~010;CFG-018 | CONTEXT / POLICY / BOUNDARY / PORT | unavailable / stale不猜truth、不allow launch |
| D17~D20 / I039~I048 / I065 boundary / backend / capture / lease | 四维boundary、launch、capture、handle / lease | CMD-003/004/007~010;STA-004~009/013/014;CONF-001~009 | BOUNDARY / RUN / QUAL / PROBE / LIFECYCLE-Q01 | ENV-01~04 no real launch;ENV-05 no weak fallback |
| D21~D24 / I049~I054 event / route / relay | schema、route、publisher、retry / dead-letter | CNS-001~022;EVT-001~015;JOB-001;CFG-020/021 | PROTO / RELAY / REPLAY / PORT | invalid quarantine;publish failure no rollback;missing route reject |
| D25~D28 / I055~I064 / I074 handoff | material / obs / investigation target和receipt | CNS-013~020;JOB-004/007;CFG-021/022 | RUN / SAFETY / PORT / JOB | target mismatch / unavailable诚实;source truth不回滚 |
| D29~D32 / I043 / I065~I075 cleanup / reaper / redline | lease / orphan、guard、release、containment | CMD-013~020;JOB-005~007;RACE-011~013;CONF-009/010 | SAFETY / RACE / LIFECYCLE-Q01 / PORT | no force-clean;non-Allowed release=0;containment非advisory |
| D33~D36 / I076~I085 read / maintenance | refresh、projection、derived、reconciliation | QRY-017~024;JOB-002/003/008~010;CFG-019/023 | READ / JOB / PORT | query no-write;job no-repair;partial report honest |
| D37~D40 / I086~I095 log / metric / audit / diagnostic / redaction | safe carrier、formal audit、low-cardinality | CTR-006;EVT;ERR;CFG-009/015/030;CONF-013 | AUDIT / SENSITIVE-X01 | sink degraded不关audit;raw leak立即失败 |
| D41~D44 / I096~I101 profile / fixture / real-like / future overlay | profile exact composition与资格传播 | CFG-007/010/029;ARCH-002;CONF-011/012;COND | CONFIG / COMPOSE-X01 / SUBSTITUTION-X01 / COND / ARCH | P05+拒fixture;P07 / overlay current reject;无资格传递捷径 |

参数化义务:

- I001~I101仍按Step 6 `TC-SBX-CFG-005`与Step 7 ConfigCorpus coverage index逐项执行,本表不以11行配置域抽样替代。
- NCFG-01~24、FC-01~06和XVAL-01~36使用COMPOSE-X01逐项验证。
- S01~S06逐profile验证允许来源和冲突;S07 / S08逐profile验证unsupported / absent。
- D01~D44每域至少进入上述一个environment / TC组,不得以“builder covered”省略。

## 9. 环境到数据集与测试层映射

| 环境 | 主要层级 /切口 | 数据集 | 构造与隔离 | 证明上限 |
|---|---|---|---|---|
| ENV-01 / PROFILE-01 | L1 + local L4 smoke;CUT-001~033适用happy / validation | BASE;PROTO;CONTEXT;POLICY;CONFIG;ARCH | local namespace;in-memory reset;no material | loader / contract shell;非正式evidence |
| ENV-02 / PROFILE-02 | L1~L4 deterministic P0-C;CUT-001~033 | 除QUAL / PROBE / LIFECYCLE-Q01 / COND外全部P0-C数据 | per-case namespace;fixed clock / id;fake / barrier reset | P0-C自动化候选;不证明P0-Q |
| ENV-03 / PROFILE-03 | L3 / L4 seam;CUT-003~013 /17~24 /26 /28~32 | PORT;RELAY;RUN;JOB;READ;CONFIG;SENSITIVE-X01 | registered scenario + adapter slot;namespace drop | port / protocol / failure mapping |
| ENV-04 / PROFILE-04 | L2 / L3 operations;CUT-007/008/013/018~25/30~32 | SAFETY;READ;RELAY;REPLAY;JOB;RACE;CHANGE | simulation namespace + replay root;no raw history | guard / replay / no-repair simulation |
| ENV-05 / PROFILE-05 | L5 / L6 identity summary;CUT-034~036及029 /032适用 | QUAL;PROBE;LIFECYCLE-Q01;SUBSTITUTION-X01;SENSITIVE-X01 | immutable qualification identity;guard / reaper then lab teardown | 唯一P0-Q证明环境;当前blocked |
| ENV-06 / PROFILE-06 | conditional L3 / L6;CUT-037及selected regression | COND;CHANGE + selected contract corpus | run-scoped durable namespace;real-like teardown | P1 selected-run;不补偿P0 |
| ENV-07 / PROFILE-07 | static absence / future reopen;CUT-038 | ARCH;COND inactive rows | no environment data instance | 当前只证明未激活 /无unsupported surface |

P0人工启动只允许两类: ENV-01本地contract诊断,以及未来ENV-05由受控人员启动的deterministic conformance harness。人工启动不允许自由文本裁决;TC断言、identity、cleanup disposition和结果schema仍由后续Step 9 /13固定。

### 9.1 逐数据集环境分配审计

| 数据集 | 主环境 | 补强 / conditional环境 | 环境用法 | 执行状态 |
|---|---|---|---|---|
| DS-SBX-BASE-001 | ENV-02 | ENV-01 /03 /04 /05 /06 | namespace、clock、ref、digest基线 | designed |
| DS-SBX-PROTO-001 | ENV-02 | ENV-01 /03 /04 /05 /06 | canonical 55协议corpus | designed |
| DS-SBX-PROTO-X01 | ENV-02 | ENV-03 | invalid carrier / schema / forbidden marker | designed |
| DS-SBX-CONTEXT-001 | ENV-02 | ENV-01 /03 /05 /06 | context / identity / reference graph | designed;real-like conditional |
| DS-SBX-BOUNDARY-001 | ENV-02 | ENV-03 /04 /05 /06 | decision contract、seam、simulation、candidate identity | designed;ENV-05 blocked |
| DS-SBX-POLICY-001 | ENV-02 | ENV-01 /03 /04 /05 /06 | fail-closed summary / decision | designed;real source conditional |
| DS-SBX-RUN-001 | ENV-02 | ENV-03 /04 /05 /06 | fake / simulated / candidate-real run chain | designed;ENV-05 blocked |
| DS-SBX-SAFETY-001 | ENV-02 | ENV-03 /04 /05 /06 | guard matrix、simulation、candidate lifecycle | designed;ENV-05 blocked |
| DS-SBX-READ-001 | ENV-02 | ENV-03 /04 /06 | query / projection / report / durable parity | designed;ENV-06 conditional |
| DS-SBX-AUDIT-001 | ENV-02 | ENV-01 /03 /04 /05 /06 | append / page / same-UoW / safe audit | designed;ENV-05 sink blocked |
| DS-SBX-RELAY-001 | ENV-02 | ENV-03 /04 /05 /06 | fake / controlled / simulated / real-like transport | designed;ENV-06 conditional |
| DS-SBX-REPLAY-001 | ENV-02 | ENV-04 /06 | three-channel replay / durable parity | designed;ENV-06 conditional |
| DS-SBX-JOB-001 | ENV-02 | ENV-03 /04 /05 /06 | deterministic / seam / simulation / scheduler | designed;ENV-05 blocked / ENV-06 conditional |
| DS-SBX-TXN-X01 | ENV-02 | ENV-03 /04 /06 | staged fault / corruption / durable parity | designed;ENV-06 conditional |
| DS-SBX-RACE-001 | ENV-02 | ENV-04 /06 | deterministic barrier / selected durable race | designed;ENV-06 conditional |
| DS-SBX-ERROR-001 | ENV-02 | ENV-03 /04 /05 /06 | formal producer across adapter modes | designed;ENV-05 subset blocked |
| DS-SBX-PORT-001 | ENV-03 | ENV-02 /04 /05 /06 | resolver / handoff / publisher / investigation outcome | designed;real adapters blocked / conditional |
| DS-SBX-CONFIG-001 | ENV-02 | ENV-01 /03 /04 /05 /06 | valid profile / source corpus | designed;P05 / P06 instance unavailable |
| DS-SBX-CONFIG-X01 | ENV-02 | ENV-01 /03 /04 | strict parser / source negatives | designed |
| DS-SBX-COMPOSE-X01 | ENV-02 | ENV-03 /04 /05 /06 /07 | FC / XVAL / NCFG / activation rejection | designed;P05+ positive activation unavailable |
| DS-SBX-SENSITIVE-X01 | ENV-02 | ENV-03 /04 /05 /06 | synthetic carrier scan / provider anti-leak | designed;ENV-05 provider subset blocked |
| DS-SBX-CHANGE-001 | ENV-04 | ENV-02 /06 | desired / observed / generation / drift / rollback | designed;physical drill conditional |
| DS-SBX-ARCH-001 | ENV-02 | ENV-01 /07 static | manifest / unsupported surface / dependency boundary | designed-not-run until target repo |
| DS-SBX-QUAL-001 | ENV-05 | none | immutable qualification preflight identity | designed_execution_blocked |
| DS-SBX-PROBE-001 | ENV-05 | none | resource / fs / network / process real probe | designed_execution_blocked |
| DS-SBX-LIFECYCLE-Q01 | ENV-05 | none | bounded launch / capture / lease / reaper / redline | designed_execution_blocked |
| DS-SBX-SUBSTITUTION-X01 | ENV-05 | ENV-02 static precheck | host / fake / fixture / wrong-generation veto | negative design ready;ENV-05 execution blocked |
| DS-SBX-COND-001 | ENV-06 | ENV-07 inactive absence | durable / outage / rollout / performance candidate | conditional_non_p0 |

分配审计结论: 28 /28数据集均有稳定主环境;无数据集依赖未定义的环境别名。ENV-05的四个qualification数据集保持execution blocked,ENV-06数据保持conditional,ENV-07只承载inactive / absence检查。

## 10. 环境不可用与降级处置

| 环境 /依赖 | 不可用或错误场景 | 处置 | 是否可计pass |
|---|---|---|---|
| ENV-01 required config / fake binding | validator / builder失败 | 本地启动fail-fast;不得改用host process | 否 |
| ENV-02 fixture / fixed clock / semantic store | harness缺失或fake parity不满足 | CI设计门禁失败;登记test infra / implementation缺口 | 否 |
| ENV-03 controlled resolver / publisher / target | 用例主动注入Unavailable / Retryable / Failed | 仅当对应Delayed / Degraded / Retryable / Failed / Quarantined surface和副作用断言命中时通过 | 仅该负向TC可通过 |
| ENV-03 route / target未注册 | 非故障注入而是环境装配缺失 | current invocation或profile fail-fast | 否 |
| ENV-04 replay / simulation state缺失 | job selection / report无法构造 | job reject / item failed并保存honest report;若harness缺失则环境失败 | 只有预期negative TC可通过 |
| ENV-05 candidate / capability / provider / lab任一缺失 | qualification identity不完整 | P0-Q Blocked;0 launch;不得标N/A或用ENV-02~04替代 | 否 |
| ENV-05 cleanup / containment异常 | guard未闭合或lab teardown失败 | 产品surface保持Blocked / Contained;lab强制回收单列失败,不得修改被测truth | 否 |
| ENV-06任一real-like binding缺失或fake混入 | profile composition不完整 | profile not qualified / selected-run not run | 不计P0;不能记P1 pass |
| ENV-07 selector / activation | 当前任何启用尝试 | startup reject / design reopen | 否 |
| optional telemetry sink | 正式允许degraded场景 | formal audit和hard guard保持;safe diagnostic说明Degraded | 仅对应degraded TC可通过 |
| target repo / suite不存在 | 无可执行subject | 保持designed-not-run;进入`07` precheck前不伪造执行 | 否 |

## 11. 环境 /配置停审记录

| 环境 /配置 | 审查项 | 结论 | 缺口 /修正 |
|---|---|---|---|
| ENV-01 / PROFILE-01 | 本地contract可定位且无host launch | 通过设计停审 | 真实entry /命令留Step 9 / `07`。 |
| ENV-02 / PROFILE-02 | deterministic P0-C、fixture隔离和fake parity | 通过设计停审 | 真实CI不存在,不影响环境设计。 |
| ENV-03 / PROFILE-03 | controlled seam与依赖类型明确 | 通过设计停审 | 不证明真实bus / resolver / target。 |
| ENV-04 / PROFILE-04 | simulation / replay与真实release隔离 | 通过设计停审 | replay artifact schema留Step 9 /13。 |
| ENV-05 / PROFILE-05 | candidate / provider / lab / identity / cleanup要求完整 | 通过设计停审;执行blocked | 不得选择历史Docker / gVisor线索或fake替代。 |
| ENV-06 / PROFILE-06 | real-like完整组合和P1边界 | 通过conditional设计 | backend / durable / bus / targets未qualified。 |
| ENV-07 / PROFILE-07 | current inactive和reopen门禁 | 通过 | 无当前环境实例。 |
| compile dependency | 仅`core-contracts`允许path dependency | 通过 | exact path / version由`07` precheck。 |
| runtime / event dependencies | 全部使用port / adapter / event / fixture / replay | 通过 | 无sibling package越界。 |
| 配置矩阵 | S01~S08、I001~I101、D01~D44、NCFG / FC / XVAL有去向 | 通过 | exact suite / command留Step 9。 |

## 12. 跨环境 /配置审计

| 审计项 | 结论 | 缺口 /修正 |
|---|---|---|
| 是否复用正式ENV / PROFILE身份 | 是,ENV-01~07与PROFILE-01~07一一承接。 | 未创建第二命名体系。 |
| P0-C自动化环境是否可定位 | 是,ENV-02为主,ENV-01 /03 /04按层补强。 | 实例 / suite未形成,只阻塞执行。 |
| P0人工 /受控启动环境是否可定位 | 是,ENV-01 local contract;ENV-05未来受控启动harness。 | ENV-05实例blocked。 |
| P0-Q是否被低profile替代 | 否,仅ENV-05可证明CUT-034~036。 | blocker保持开放。 |
| compile / runtime / event是否区分 | 是。 | 只有`core-contracts`可path dependency。 |
| 环境是否映射到Step 7数据集 | 是,28个DS族均有环境去向或明确inactive / conditional。 | 无孤儿数据集。 |
| 配置是否可定位 | 是,按S / I / D / PROFILE稳定ID定位。 | 不伪造raw key / env var / route原名。 |
| 不可用是否可能skip-as-pass | 禁止。 | Blocked / Failed / conditional not run边界明确。 |
| sensitive material是否进入低profile | 否,ENV-01~04禁止S04和真实material。 | 仅synthetic marker。 |
| fake / simulation是否升格资格 | 否。 | substitution negative由CONF-011/012覆盖。 |
| 是否提前定义suite /命令 /artifact /EV | 否。 | 留Step 9 /13。 |
| 是否创建真实环境、run、结果或签署 | 否。 | 持续禁止。 |

## 13. Blocker、待确认与Step 9承接

| 项 | 状态 | 对当前Step影响 | 后续处理 |
|---|---|---|---|
| 目标实现仓 /真实test subject不存在 | open_for_07_precheck | 不阻塞环境设计;所有环境执行not started | Step 9只定义planned suite;`07`首个precheck确认仓与shared types。 |
| ENV-05 candidate backend / capability matrix缺失 | open_for_p0q_execution | P0-Q环境实例Blocked | Step 9定义blocked gate承载,Step 10定义专项方法,`07/09`完成真实绑定。 |
| ENV-05 dedicated lab / destructive partition缺失 | open_for_p0q_execution | cleanup / escape-like probe不可执行 | Step 10继续定义风险隔离要求;不得复用普通CI。 |
| S04 provider / principal / platform anti-leak缺失 | open_for_p0q_execution | CONF-013 blocked | Step 9 /10定义gate / scan要求;不创建material。 |
| ENV-06 durable / bus / resolver / targets / scheduler / sink未选 | conditional_non_p0 | PROFILE-06不qualified | 保持selected-run;不得用test double宣称parity。 |
| ENV-07产品 / security / capacity / runbook未形成 | inactive_reopen_required | 无当前执行 | 需求触发后回写`00~04`,再重开`05`。 |
| suite、命令、CI触发、artifact / report路径未定义 | open_for_step_9 | 不阻塞Step 8 | Step 9必须逐层 /逐profile闭合。 |

Step 9必须读取:

1. Step 6的254条TC、Step 7的28个数据集和本文件ENV / PROFILE矩阵。
2. Step 4的L1~L6分层与P0-C / P0-Q传播规则。
3. 正式`03` §15计划脚本切口和正式`04` TSH / FDT / EHR handoff,但不得把计划脚本写成已存在。
4. 测试SOP Step 9与测试方案书写规范§5.9。
5. 每个suite的执行位置、触发、阻断、planned command、artifact / report schema、TC / PER映射和blocked传播。

## 14. 回填草稿

正式`05-测试方案.md` §8后续应装配:

- §4七环境矩阵和各自证明上限。
- §5依赖裁剪拓扑、§6依赖类型 /协作方式。
- §7 Profile / source / adapter矩阵和§8配置域到TC映射。
- §9环境到数据 /层级映射、§10不可用处置和§13开放blocker。

当前不得修改旧正式`05`;只能在Step 15由已确认Step 1~14整体装配。

## 15. 当前结论

Step 8在设计层已完成:

- P0-C自动化 /本地 / controlled / simulation环境均以正式ENV ID定位。
- P0-Q dedicated环境的职责、依赖、配置、数据和不可用处置已定位,但实例保持Blocked。
- compile / runtime / event依赖完成裁剪,没有非core sibling path dependency。
- S01~S08、I001~I101、D01~D44及七个PROFILE均有测试环境和用例去向。
- 环境不可用不得伪pass;ENV-06 conditional、ENV-07 inactive边界保持。
- 未创建真实环境、candidate、provider material、suite、run、EV、结果或签署。

当前状态为`reviewed_passed_to_step_9`。Step 9已承接本Step的七环境、七profile和28个数据集分配;当前恢复点以flow和项目台账为准。
