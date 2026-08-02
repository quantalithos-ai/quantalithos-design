# Step 7. 设计测试数据

> 对应SOP: `standards/document/测试方案讨论流程_SOP.md` Step 7
> 书写规范: `standards/document/测试方案书写规范.md` §5.7
> 回填章节: `05-测试方案.md` §7 测试数据设计
> 生成日期: 2026-07-13
> 状态: reviewed_passed_to_step_8
> 所属流程: `05_test_plan_calibration_flow.md`
> 本Step口径: 为Step 6的254条`TC-SBX-*`定义可重复生成的数据集、fixture / builder / seed、隔离键、替身和清理规则。本文只设计数据,不创建真实数据实例、run_id、secret、qualification packet、EV、测试结果或环境事实。

---

## 1. Step开工确认与状态

| 检查项 | 结论 |
|---|---|
| 用户是否确认Step 6并允许进入Step 7 | 是。用户在Step 6停审后明确回复“同意”,本次只放行Step 7。 |
| 台账与flow是否允许进入 | 是。Step 6原为`pass_wait_review`;本次确认后转为`passed_to_step_7`。 |
| 是否读取本Step标准 | 是。已读取测试SOP Step 7与书写规范§5.7。 |
| 是否读取正式设计输入 | 是。复核正式`03`的DTO /状态 /持久化 /事务 /错误 /并发契约和正式`04`的配置 /敏感性 /profile /failure handoff。 |
| 是否读取全部测试用例 | 是。复核Step 6主文件与5个分件,覆盖14个TC前缀、254条TC。 |
| 是否参考L1粒度 | 是。参考L1-governance / L1-artifact Step 7的数据族、映射、隔离和停审结构,领域数据全部按sandbox重建。 |
| 当前状态 | 数据集、构造规则、38个CUT映射、254条TC前缀全覆盖、替身矩阵和清理审计已收稳;用户已确认并传递至Step 8。 |
| 上游blocker | 未发现阻塞Step 7设计的上游冲突。目标仓、candidate backend、provider、dedicated lab和durable组合仍只阻塞执行。 |
| 停审 | 用户已确认Step 7;Step 8已据此完成。正式`05`仍不得修改。 |

## 2. 本步目标、边界与输入

本Step完成以下事项:

1. 把Step 6中formal object state、DTO、port outcome、config集合和qualification identity前置转换成稳定数据集。
2. 分离基础、边界、异常、并发和恢复数据,避免happy-path数据掩盖负向断言。
3. 固定canonical builder、single-delta mutation、seed、fault script、schedule script和probe manifest规则。
4. 为每个CUT和全部254条TC建立数据集回指,并定义测试级隔离与清理义务。
5. 明确fake / stub / controlled / real-like的证明上限,保持P0-Q执行blocked和conditional非P0边界。

本Step不定义实际fixture文件路径、Rust函数签名、数据库产品、容器产品、真实endpoint、环境拓扑、suite /命令 /CI、性能阈值、artifact schema、EV或测试结果。这些分别由实现仓、Step 8~10和Step 13承接。

| 输入 | 本Step用途 | 结论 |
|---|---|---|
| `05_test_plan_step_06_cases.md`及5个分件 | 254条TC的前置、操作和断言 | 全部纳入§9前缀覆盖与§8 CUT映射。 |
| `03_ddd_step_06_object_contracts.md` | object factory、typed ref、状态和字段来源 | builder只能使用正式factory / carrier;非法迁移不靠伪造对象证明。 |
| `03_ddd_step_08_protocol_contracts.md` | 55协议DTO、receipt、report、page和error surface | canonical protocol corpus逐family生成。 |
| `03_ddd_step_10_state_matrix.md` | 30个正式enum与合法 /非法迁移 | 状态seed按owner分组,同名状态不跨owner复用。 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | UoW、version、cursor、index、stored replay和fake parity | transactional seed必须模拟staging / rollback / unique / version语义。 |
| `03_ddd_step_12_error_recovery.md`;Step 13并发设计 | 38错误、恢复和19 race | 每个错误使用正式producer触发;race使用确定性schedule。 |
| `04-配置设计.md`及Step 7 /8 /12中间产物 | I001~I101、FDT、NCFG、FC / XVAL、敏感slot、PROFILE | config corpus参数化完整,只使用synthetic sensitive marker。 |

## 3. SOP问题回答

| 问题 | 回答 |
|---|---|
| 哪些基础数据必须存在 | protocol metadata、actor / trace、context / identity / reference、boundary / capability / handle / lease、policy、run / capture / handoff、failure / control / cleanup / redline、projection / derived / report、audit / relay、idempotency / stored result / receipt / job report和runtime config summary。 |
| 哪些边界、异常、并发和恢复数据必须构造 | missing / wrong-family / stale / conflicted refs,terminal state,partial boundary,fail-closed policy,partial capture,guard blocked,invalid selector,staged UoW failure,same-key conflict,version race,dependency unavailable,unsafe config,synthetic leak和orphan / reaper / redline恢复数据。 |
| 数据如何隔离不同测试执行 | 每次执行生成harness-only `test_namespace_token`;再按`case_instance_ref`、formal scope / context / operation / key / ref和参数序号分区。该token不是sandbox domain字段或真实run_id。 |
| 数据如何清理 | pure DTO无持久化清理;fake / stub reset namespace;persisted semantic store按namespace drop或事务回滚;artifact scan corpus删除isolated root;受控P0-Q资源必须先按formal cleanup guard / reaper收束再由lab回收。 |
| 哪些外部依赖使用fake / stub / real-like | P0-C使用semantic fake / deterministic stub / controlled fault;P0-Q只能使用fixed candidate + dedicated controlled lab,当前blocked;PROFILE-06 durable / real-like为conditional P1。 |
| 每个P0用例是否可稳定构造 | 是。§9覆盖14个TC前缀的完整连续区间;P0-Q所需数据manifest已定义,但实例必须等待candidate / provider / lab形成。 |
| 哪些负向数据必须单独数据集 | protocol invalid、forbidden body、illegal transition、UoW fault、duplicate conflict、race schedule、config invalid、sensitive leak、qualification substitution和cleanup / redline blocked均独立于happy path。 |
| 是否存在人工临时造数依赖 | 否。所有数据必须经builder、parameter catalog、seed plan、fault / schedule script或externally supplied qualification manifest生成。 |

## 4. 数据分类与统一生成规则

| 类别 | 标识 | 定义 | 允许构造方式 | 禁止方式 |
|---|---|---|---|---|
| 基础数据 | B | 可复用的合法DTO、truth、marker、snapshot和config | canonical builder + deterministic generator | 手写缺字段对象、复制历史JSON |
| 边界数据 | E | min / max / empty / exact enum / wrong ref family / terminal edge | 从合法基线做single-delta mutation | 同时改变多项导致触发点不确定 |
| 异常数据 | X | 正式error producer、dependency outcome、corruption或unsafe carrier | fault profile / negative builder / isolated seed | 用fake-only错误或字符串替代正式错误 |
| 并发数据 | C | 同key、同version、同unique scope的竞争调用 | deterministic barrier + schedule script | 依赖sleep、概率或压力偶现 |
| 恢复数据 | R | retryable relay / handoff、stale projection、expired lease、pending guard等 | terminal / nonterminal seed + formal recovery entry | 修改旧truth、旧stored result或直接标success |
| 资格数据 | Q | candidate、profile、generation、capability、四维probe和lab identity | externally supplied immutable manifest + controlled probe | fake、host process或fixture冒充conformance |

统一规则:

1. 所有引用由typed ref factory和当前`test_namespace_token`派生;不同ref family即使文本相似也不得互换。
2. clock、ID、digest、version、cursor和page order使用确定性generator。source version、dedup key、trace ref、truth cursor和reference cursor分别生成,不得共用。
3. canonical digest只从完整canonical DTO生成。same-key duplicate复用digest;conflict只改变canonical input并重新计算digest。
4. 非法状态迁移从合法当前状态调用正式transition触发;只有repository corruption / integrity用例可用隔离seed制造缺result、wrong kind或不完整持久化面。
5. negative builder每个参数只引入一个主要违规;组合验证仅用于正式FC / XVAL / NCFG参数矩阵。
6. fake repository必须保持UoW staging、rollback invisibility、unique key、expected version、cursor assignment、stored replay、stable page和no-scan语义。
7. synthetic secret / body / full-ref marker必须明显为测试哨兵,不含真实credential或外部正文;只允许进入negative parser / scanner输入,不得成为truth seed。
8. P0-Q manifest只能引用当次固定candidate / profile / config generation / capability / template / environment / provider material;缺任何一项即Blocked,不得自动补值。

## 5. Fixture、Builder、Seed与脚本契约

| 构造器 | 输入 | 输出 | 固定规则 | 主要消费者 |
|---|---|---|---|---|
| `NamespaceFixture` | case ID、parameter ID、deterministic seed | namespace token、clock、typed-ref allocator、digest generator | token不进入domain或evidence;同参数可重建同逻辑数据 | 全部TC |
| `ProtocolCorpusBuilder` | 55协议family、schema version、metadata profile | canonical request / response / envelope / payload / receipt / report | 必填字段齐全;body-free;roundtrip后等价 | CTR / CMD / QRY / CNS / EVT / JOB |
| `ProtocolNegativeBuilder` | canonical DTO、single mutation | missing / invalid enum / wrong ref / unsupported version / forbidden marker | mutation catalog有稳定ID;不生成真实body | CTR / CNS / ERR / CFG |
| `TruthGraphBuilder` | context profile、state profile、formal refs | owner一致的context到safety truth graph | 只调用正式factory / transition;不跨owner推状态 | CMD / STA / ERR |
| `ReadSurfaceSeedPlan` | truth cursor、visibility、projection / derived / report profile | projection、index、page、audit snapshot | Fresh / Stale / Missing / Degraded分开;query seed后write audit归零 | QRY / JOB / STA |
| `ReplaySeedPlan` | channel、operation、key、digest、record / result status | idempotency record + typed stored result / receipt / report | completed必须有正确kind,除非专门integrity negative | CNS / JOB / TXN / ERR |
| `TransactionFaultScript` | stage ID、failure kind、commit disposition | deterministic UoW fault schedule | begin至cursor / commit逐stage可注入;fault结束后reset | TXN / ERR / CFG |
| `RaceScheduleScript` | race ID、两方read / reserve / save barrier | 可重复交错序列 | 明确winner point与loser expected surface;不用sleep | RACE |
| `ConfigCorpusBuilder` | source mode、PROFILE、I / D / FC / XVAL / NCFG parameter | strict raw fixture、typed snapshot或expected rejection | 101项和正式闭集保留coverage index;unknown / alias不归一化 | CFG / STA / ERR |
| `AdapterOutcomeStub` | port kind、formal availability / outcome、call budget | body-free outcome与call trace | 不返回SDK body;可断言0 / 1 / bounded call | CMD / CNS / JOB / ERR |
| `CarrierScanCorpus` | carrier kind、safe baseline、synthetic marker class | isolated config / log / metric / audit / receipt / report / event / handoff / workload sample | marker不进入shared store;metric样本含cardinality检查 | CFG / CONF |
| `QualificationManifest` | externally supplied candidate / generation / lab / provider identity | immutable preflight input | 当前只定义schema义务,不创建实例;fake标记必须触发substitution veto | CONF / COND |
| `ControlledProbeManifest` | resource / filesystem / network / process probe kind | body-free workload ref、expected allowed / denied action、cleanup obligation | probe payload归lab,只把ref / digest / safe outcome交给sandbox | CONF |

## 6. 测试数据集表

| 数据集 | 类别 /用途 | 构造方式 | 隔离键 | 清理方式 | 关联用例 |
|---|---|---|---|---|---|
| DS-SBX-BASE-001 namespace / deterministic primitives | B;统一ref、clock、digest、version基线 | `NamespaceFixture` | namespace + case + parameter | drop generator state | 全部254条TC |
| DS-SBX-PROTO-001 canonical protocol corpus | B;55协议与shared carrier | `ProtocolCorpusBuilder`逐family | namespace + protocol family | 无持久化清理 | CTR;CMD;QRY;CNS;EVT;JOB |
| DS-SBX-PROTO-X01 invalid protocol corpus | E/X;required / enum / ref / version / body | `ProtocolNegativeBuilder` | namespace + mutation ID | 删除isolated sample | CTR;CNS;ERR-001/002/008;CFG-009/030 |
| DS-SBX-CONTEXT-001 context / identity / reference | B/E;intake与resolution | `TruthGraphBuilder`构造Accepted / Rejected / Unresolved及Resolved / Partial / Conflicted / Unavailable | context / identity / reference refs | namespace drop | CMD-001/002;CNS-005/006;STA-001~003;ERR-014/015 |
| DS-SBX-BOUNDARY-001 boundary / capability / handle / lease | B/E;四维裁定与生命周期 | coherent / partial / unsupported graph + adapter outcome | context + boundary + generation refs | namespace drop;fake reset | CMD-003/004;CNS-009~012;STA-004~009;ERR-006/007 |
| DS-SBX-POLICY-001 policy / high-risk decision | B/E;fail-closed与launch gate | body-free policy summary + applicability / decision graph | context + policy snapshot / decision refs | namespace drop | CMD-005/006/008;CNS-007/008;STA-010~012;ERR-005 |
| DS-SBX-RUN-001 run / capture / handoff | B/E/R;受控执行结果链 | run graph + capture / handoff outcomes | context + run + capture / handoff refs | namespace drop;adapter reset | CMD-007~012;CNS-013~016;STA-013~015;ERR-009/037/038 |
| DS-SBX-SAFETY-001 failure / control / cleanup / redline | B/E/R;guard-first安全收束 | versioned safety group builder | context + safety owner refs | namespace drop;release fake reset | CMD-013~020;CNS-017~020;STA-016~019;ERR-010/011 |
| DS-SBX-READ-001 projection / derived / reconciliation | B/E/R;query与maintenance | `ReadSurfaceSeedPlan`覆盖Fresh / Stale / Missing / Rebuilding / Failed | projection / derived / report refs + cursor | namespace drop | QRY-001~024;EVT-011~013;JOB-008~010;STA-020~023 |
| DS-SBX-AUDIT-001 audit trace / page | B/E;append-only与分页 | body-free trace rows + stable cursor / page seed | subject ref + page cursor family | namespace drop | QRY-025/026;EVT;TXN;ERR-027/028 |
| DS-SBX-RELAY-001 payload snapshot / relay status | B/E/R;13 event与publish | immutable canonical payload + Pending / Retryable / terminal relay | source fact + event kind + relay ref | namespace drop;publisher reset | EVT-001~015;JOB-001;STA-024;ERR-020/036 |
| DS-SBX-REPLAY-001 idempotency / stored surfaces | B/E/X;三channel replay | `ReplaySeedPlan`覆盖Reserved / Completed / Failed / Conflict / missing / wrong kind | operation + channel + key | namespace drop | CNS-001~004;JOB-011/012;STA-025~030;TXN-007~012;ERR-016~019/022~024 |
| DS-SBX-JOB-001 selection / mixed report | B/E/R;10 job和部分失败 | typed job input + deterministic selected refs + per-item outcomes | job operation + job key + item ref | namespace drop;stubs reset | JOB-001~012;CFG-023 |
| DS-SBX-TXN-X01 staged failure / corruption | X/R;事务、rollback、commit unknown | `TransactionFaultScript` + isolated integrity seed | namespace + stage / fault ID | rollback or namespace drop;fault reset | TXN-001~006/013/014;ERR-021~024/029~031 |
| DS-SBX-RACE-001 deterministic schedules | C;19类single-winner | `RaceScheduleScript` RACE-001~019 | namespace + race + participant | namespace drop;barrier reset | RACE-001~019 |
| DS-SBX-ERROR-001 formal producer catalog | X/R;38命名错误 | producer-specific valid base + one formal trigger | namespace + error ordinal | 按base dataset清理 | ERR-001~038 |
| DS-SBX-PORT-001 resolver / handoff / publisher / investigation outcomes | B/E/X/R;外部接缝 | `AdapterOutcomeStub` success / unavailable / retryable / failed / mismatched | adapter slot + outcome ID | stub reset | CMD;CNS;JOB;ERR;CFG-018/020~023 |
| DS-SBX-CONFIG-001 valid source / profile corpus | B;S01~S06与PROFILE-01~04 | `ConfigCorpusBuilder`;I001~I101 / D01~D44 coverage index | profile + config digest + source mode | 无持久化清理 | CFG-001~006/010/014~019;STA-029/030 |
| DS-SBX-CONFIG-X01 strict parser / source negatives | E/X;malformed、priority、wrong ref、unsupported surface | single source delta + closed schema mutations | config case + source selector | 删除isolated raw fixture | CFG-001~008/011;ERR-032~035 |
| DS-SBX-COMPOSE-X01 FC / XVAL / NCFG matrix | E/X;组合与不可配置红线 | FC-01~06、XVAL-01~36、NCFG-01~24参数目录 | formal rule ID + parameter ID | 无持久化清理 | CFG-005/008/011/014~017 |
| DS-SBX-SENSITIVE-X01 synthetic marker / carrier corpus | X;敏感、正文、低基数与redaction | `CarrierScanCorpus`,40类sensitive /23 material slot / ALC-01~06 | isolated scan root + marker ID | 必须删除isolated root | CFG-009/012/013/015/030;ERR-008/012/027/028;CONF-013 |
| DS-SBX-CHANGE-001 desired / observed / generation history | B/E/R;review、apply、rollback、drift | immutable candidate revisions + relation / observation states | scope + candidate revision + generation | namespace drop | CFG-024~029;COND-002 |
| DS-SBX-ARCH-001 manifest / surface / responsibility metadata | B/E;依赖裁剪和unsupported扫描 | generated package graph / public registry / responsibility map | graph / registry digest | 无持久化清理 | ARCH-001~003;CFG-007/029 |
| DS-SBX-QUAL-001 qualification identity manifest | Q;P0-Q preflight | `QualificationManifest`,外部供应且不可变 | candidate + profile + generation + lab identity | lab-owned teardown | CONF-001~013;当前execution blocked |
| DS-SBX-PROBE-001 resource / fs / network / process probes | Q;四维真实施加 | `ControlledProbeManifest`逐维allowed / denied / limit | qualification identity + probe ID | guard收束后lab回收 | CONF-001~006/010;当前execution blocked |
| DS-SBX-LIFECYCLE-Q01 launch / capture / lease / reaper probes | Q/R;真实lifecycle | bounded workload + timeout / kill + output marker + orphan scenario | qualification identity + workload / lease refs | cleanup guard / reaper后lab回收 | CONF-007~010;当前execution blocked |
| DS-SBX-SUBSTITUTION-X01 fake / host / wrong-generation veto | Q/X;资格替代否决 | manifest中单项替换为明确unqualified identity | qualification identity + mutation ID | 不得启动;清理preflight输入 | CONF-011/012;当前execution blocked |
| DS-SBX-COND-001 durable / rollout / performance candidate | E/C/R/Q;conditional P1/P2 | externally supplied durable profile、controlled outage和workload model | selected profile + scenario ID | 依产品策略;Step 8 /10再定 | COND-001~005;conditional_non_p0 |

## 7. 数据集复用与禁止复用规则

| 场景 | 允许复用 | 必须新建 /派生 | 原因 |
|---|---|---|---|
| 同一协议正向roundtrip | DS-SBX-PROTO-001 canonical row | 不需要persistent copy | pure data且无副作用。 |
| required / enum / wrong ref负向 | canonical row作为parent | DS-SBX-PROTO-X01 single-delta row | 明确唯一违规。 |
| 合法 /非法状态迁移 | 同owner合法current state | 每条非法transition独立case instance | 避免前一迁移污染current state。 |
| duplicate replay | 相同key / digest / stored result seed | conflict必须新digest;missing result必须独立corruption seed | 三种surface不可混淆。 |
| transaction stage fault | 相同canonical command | 每个stage新namespace和fault profile | rollback后不可依赖上一个stage残留。 |
| race | 相同logical graph builder | 每个schedule新namespace、barrier和participants | winner / loser必须可判定。 |
| config parameter matrix | valid profile作为parent | 每个I / FC / XVAL / NCFG参数独立mutation | 保留逐项coverage index。 |
| carrier leak | safe corpus可共享只读模板 | 每个marker class独立isolated root | 禁止哨兵污染正常artifact。 |
| P0-C与P0-Q | DTO / formal expected surface可复用 | backend handle、probe、lab、provider material不得复用fake实例 | fake不证明真实隔离。 |

## 8. 按CUT组织的数据前置映射与停审

本表中的`CTR-001`等用例token按`TC-SBX-<token>`展开,`BASE`等数据token按`DS-SBX-<token>`展开;区间和斜线写法与Step 6 §4完全同序,不得解释为新的缩写编号体系。

| CUT | 用例ID /批次 | 主要数据集 | fixture / builder / seed | fake / stub / real-like /资格 | 清理方式 | 停审 |
|---|---|---|---|---|---|---|
| CUT-SBX-001 | CTR-001~003/006;EVT-014 | BASE;PROTO;PROTO-X01 | shared carrier canonical + invalid mutations | none | pure reset / isolated sample delete | pass |
| CUT-SBX-002 | CTR-003~005;TXN-010~013 | BASE;PROTO;REPLAY;AUDIT | metadata / digest / cursor family builders | semantic fake stores | namespace drop | pass |
| CUT-SBX-003 | CMD-001/002;STA-001~003;ERR-014/015 | CONTEXT;PORT | intake / resolver state graph | resolver fake | namespace drop;stub reset | pass |
| CUT-SBX-004 | CMD-003/004;STA-004~007;ERR-006/007;CONF-001~006 | BOUNDARY;CONFIG;QUAL;PROBE | coherent / partial graph;四维manifest | P0-C fake;P0-Q dedicated blocked | namespace drop;lab teardown未激活 | pass_design |
| CUT-SBX-005 | CMD-005/006/008;STA-010~012;ERR-005 | POLICY;PORT | applicability / decision + body-free summary | policy summary fake | namespace drop;stub reset | pass |
| CUT-SBX-006 | CMD-007~012;EVT-004~006;ERR-009/037/038 | RUN;PORT | run / capture / handoff outcome graph | isolation / capture / handoff fake | namespace drop;adapter reset | pass |
| CUT-SBX-007 | CMD-013~020;STA-016~019;ERR-010/011 | SAFETY;PORT | safety group + guard / investigation outcomes | lifecycle / investigation fake | namespace drop;release fake reset | pass |
| CUT-SBX-008 | QRY-017~024;EVT-011~013;JOB-008~010;ERR-020 | READ;JOB | projection / derived / report seeds | semantic fake stores | namespace drop | pass |
| CUT-SBX-009 | CMD-001~020;CNS-017/018 | PROTO;CONTEXT;BOUNDARY;POLICY;RUN;SAFETY | 10 Command canonical + negative graph | P0-C ports fake | namespace drop;all stubs reset | pass |
| CUT-SBX-010 | QRY-001~026;ERR-019/025/026 | PROTO;READ;AUDIT | 13 Query views / missing / restricted + write audit | read fake;write budget 0 | namespace drop;write audit reset | pass |
| CUT-SBX-011 | CNS-001~022;STA-027;ERR-002/012/032/033 | PROTO;PROTO-X01;REPLAY;PORT | 9 envelope families + receipts | source / feedback fake | namespace drop;stub reset | pass |
| CUT-SBX-012 | EVT-001~015;JOB-001;ERR-035/036 | PROTO;RELAY;TXN-X01 | 13 canonical payload snapshots | publisher fake | namespace drop;publisher reset | pass |
| CUT-SBX-013 | JOB-001~012;STA-028;ERR-020/034 | PROTO;JOB;REPLAY;PORT | 10 selection / report families | target adapters fake | namespace drop;stubs reset | pass |
| CUT-SBX-014 | STA-001~003;CMD-001/002 | CONTEXT;ERROR | intake / identity / reference state rows | repository fake | per-transition namespace drop | pass |
| CUT-SBX-015 | STA-004~009;CMD-003/004 | BOUNDARY;ERROR | boundary / capability / handle / lease / orphan rows | backend fake;qualification separate | namespace drop;backend reset | pass |
| CUT-SBX-016 | STA-010~012;CMD-005/006 | POLICY;ERROR | policy / high-risk state rows | summary fake | per-transition namespace drop | pass |
| CUT-SBX-017 | STA-013~015;CMD-007~012;CNS-013~016 | RUN;ERROR | run / capture / handoff rows | adapter fake | namespace drop;adapter reset | pass |
| CUT-SBX-018 | STA-016~019;CMD-013~020;JOB-005~007 | SAFETY;ERROR | failure / control / cleanup / redline rows | lifecycle fake | namespace drop;guard / adapter reset | pass |
| CUT-SBX-019 | STA-020~023;QRY-017~024;JOB-008~010 | READ;JOB;ERROR | read / projection / derived / report rows | fake read / write-audit stores | namespace drop;write audit reset | pass |
| CUT-SBX-020 | STA-024;CNS-021/022;EVT-015;JOB-001;RACE-014 | RELAY;REPLAY;ERROR | relay state + feedback / publish outcomes | publisher fake | namespace drop;publisher / barrier reset | pass |
| CUT-SBX-021 | STA-025~030;TXN-007~012;ERR-018/028~030 | REPLAY;CONFIG;ERROR | idempotency / result / receipt / report / availability rows | semantic fake stores | namespace drop;runtime fake reset | pass |
| CUT-SBX-022 | TXN-001~006;EVT-015;ERR-022~024/034 | TXN-X01;RELAY;AUDIT;REPLAY | stage-by-stage UoW scripts | semantic UoW fake | assert rollback then namespace drop / fault reset | pass |
| CUT-SBX-023 | CTR-005;QRY-004/017/024~026;TXN-005/013/014;ERR-021 | BASE;READ;TXN-X01 | version / cursor / selector / index seeds | semantic repository fake | namespace drop;fault reset | pass |
| CUT-SBX-024 | CTR-004;CNS-003/004;JOB-011;TXN-007~012;ERR-017/018 | REPLAY;TXN-X01 | duplicate / conflict / missing typed result | semantic replay fake | namespace drop | pass |
| CUT-SBX-025 | RACE-001~019;TXN-012~014;CMD-013/014 | RACE;TXN-X01 | 19 deterministic schedules | deterministic barriers | cancel participants;drop namespace / barriers | pass |
| CUT-SBX-026 | ERR-001~038;CTR-002/006 | ERROR;PROTO-X01;PORT;TXN-X01 | 38 formal producer rows | formal producer;no fake-only error | matching base cleanup;all faults reset | pass |
| CUT-SBX-027 | CFG-001~008/029 | CONFIG;CONFIG-X01 | FDT source / parser / schema rows | config source stub | isolated raw fixture delete | pass |
| CUT-SBX-028 | CFG-005/008/010~018;STA-029/030;ERR-030 | CONFIG;COMPOSE-X01 | profile / composition / builder rows | runtime builder fake | namespace drop;builder reset | pass |
| CUT-SBX-029 | CTR-006;CMD-009~012;CFG-009/012/013/030;CONF-013 | SENSITIVE-X01;PORT | synthetic marker / material lease corpus | synthetic provider stub;P0-Q provider blocked | isolated scan root delete;stub reset | pass_design |
| CUT-SBX-030 | CFG-024~028;COND-004 | CHANGE;CONFIG | review / apply / rollback / drift rows | apply builder stub | namespace drop;history fixture reset | pass |
| CUT-SBX-031 | CTR-003;CMD-001~020;QRY-001~026;CNS-001~022;JOB-001~012;CFG-014~018;ERR-030~032 | CONFIG;PORT;TXN-X01 | scoped invocation failure rows | scoped entry stubs | current-unit namespace drop;stubs reset | pass |
| CUT-SBX-032 | CTR-006;EVT-001~013;CFG-009/015/030;ERR-001~038适用surface | SENSITIVE-X01;AUDIT | all-carrier safe / leak scan corpus | isolated scanner corpus | isolated scan root delete;namespace drop | pass |
| CUT-SBX-033 | ARCH-001~003;CFG-007/029;ERR-029~032 | ARCH | package graph / registry / responsibility metadata | target repo absent;designed-not-run | no persistent cleanup | pass_design |
| CUT-SBX-034 | CONF-001~006 | QUAL;PROBE;SUBSTITUTION-X01 | candidate identity +四维probe | dedicated candidate required;blocked | no instance;future guarded lab teardown | pass_design |
| CUT-SBX-035 | CONF-007~010/013;CMD safety cases;JOB-005~007 | QUAL;PROBE;LIFECYCLE-Q01;SENSITIVE-X01 | bounded lifecycle / cleanup / anti-leak | dedicated lab / provider required;blocked | no instance;future guard / reaper then lab teardown | pass_design |
| CUT-SBX-036 | CONF-001/006/011~013;ARCH-001 | QUAL;SUBSTITUTION-X01 | identity completeness / substitution mutations | only L5 dedicated conformance;blocked | preflight input delete;no launch on negative | pass_design |
| CUT-SBX-037 | COND-001/002;CFG-025~028;COND-005 | COND | durable / outage / rollout rows | conditional P1 real-like;not P0 substitute | product strategy留Step 8 | pass_conditional |
| CUT-SBX-038 | ARCH-002;COND-003/005;CFG-007/010/029 | ARCH;COND | unsupported surface / future candidate rows | conditional P2 / design reopen | no persistent cleanup / inactive candidate drop | pass_conditional |

## 9. 254条TC数据前置全覆盖表

| TC完整区间 | 数量 | 必需数据集 | 构造 /清理摘要 | 覆盖结论 |
|---|---:|---|---|---|
| TC-SBX-CTR-001~006 | 6 | BASE;PROTO;PROTO-X01;REPLAY | canonical / single-delta;pure或namespace drop | covered |
| TC-SBX-CMD-001~020 | 20 | BASE;PROTO;CONTEXT;BOUNDARY;POLICY;RUN;SAFETY;PORT;REPLAY | truth graph + outcomes;namespace drop / stubs reset | covered |
| TC-SBX-QRY-001~026 | 26 | BASE;PROTO;READ;AUDIT;CONTEXT;SAFETY | view / access / page seeds;write audit reset | covered |
| TC-SBX-CNS-001~022 | 22 | BASE;PROTO;PROTO-X01;REPLAY;CONTEXT;BOUNDARY;POLICY;RUN;SAFETY;RELAY;PORT | envelope / receipt / feedback seeds;namespace drop | covered |
| TC-SBX-EVT-001~015 | 15 | BASE;PROTO;RELAY;AUDIT;TXN-X01 | immutable payload snapshots;namespace drop | covered |
| TC-SBX-JOB-001~012 | 12 | BASE;PROTO;JOB;REPLAY;READ;RELAY;PORT | deterministic selection / report;namespace drop / reset | covered |
| TC-SBX-STA-001~031 | 31 | CONTEXT;BOUNDARY;POLICY;RUN;SAFETY;READ;RELAY;REPLAY;CONFIG;ERROR | per-owner legal current state;STA-031 reuses handoff / retry deterministic attempt fixture;new case for illegal transition | covered |
| TC-SBX-TXN-001~014 | 14 | BASE;TXN-X01;REPLAY;RELAY;AUDIT;READ | per-stage fault namespace;rollback / drop / reset | covered |
| TC-SBX-RACE-001~019 | 19 | BASE;RACE;TXN-X01 + matching owner graph | per-race barrier / participants;namespace drop | covered |
| TC-SBX-ERR-001~038 | 38 | ERROR + matching owner graph;PROTO-X01;TXN-X01;PORT;SENSITIVE-X01 | one formal producer trigger;按base清理 | covered |
| TC-SBX-CFG-001~030 | 30 | CONFIG;CONFIG-X01;COMPOSE-X01;SENSITIVE-X01;CHANGE;PORT;ARCH | parameter index + isolated raw / scan fixtures | covered |
| TC-SBX-ARCH-001~003 | 3 | ARCH | generated metadata;no persistent cleanup | designed_execution_blocked_by_target_repo |
| TC-SBX-CONF-001~013 | 13 | QUAL;PROBE;LIFECYCLE-Q01;SUBSTITUTION-X01;SENSITIVE-X01 | externally supplied identity;guarded lab teardown | designed_execution_blocked |
| TC-SBX-COND-001~005 | 5 | COND;ARCH;CHANGE | activation-specific data;Step 8 /10补physical strategy | conditional_non_p0 |
| 合计 | 254 | 28个DS-SBX数据集 | 14个前缀均为完整连续区间,无未映射TC | complete |

## 10. 外部依赖数据替身矩阵

| 依赖接缝 | P0-C数据方式 | 可证明 | 不可证明 /后续要求 |
|---|---|---|---|
| context / responsibility resolver | deterministic fake safe summary | mapping、missing / conflict / unavailable、body-free | 上游真实仓可用性 |
| policy summary source | fake body-free snapshot | fail-closed、stale / conflict mapping | policy语义执行正确性 |
| backend capability source | fake formal capability outcomes | capability mapping、partial reject | 真实施加;P0-Q candidate required |
| isolation backend lifecycle | semantic fake handle / lease / outcomes | orchestration、guard、no fallback | resource / fs / network / process隔离;P0-Q required |
| capture / inspect | fake body-free capture outcome | Complete / Partial / Failed映射和no-body | 平台真实捕获;P0-Q required |
| material / observability handoff | fake target outcomes | marker、retry、no rollback、target mismatch | 下游artifact / observability truth |
| publisher / inbound source | fake envelope / publish outcome | schema、dedup、relay status、no rollback | 真实bus产品行为;PROFILE-06 conditional |
| store / UoW / projection | semantic fake | transaction / version / cursor / replay contract | durable parity;PROFILE-06 conditional |
| config / material provider | parser fixture + synthetic provider stub | strict source、lease、redaction、no raw fallback | provider / platform anti-leak;P0-Q applicable subset |
| tools / runtime / member | refs / safe summary only,不提供semantic fake | sandbox边界不拥有其语义 | 不得把tool execution、agent loop、member lifecycle混入本测试数据 |

## 11. 隔离、清理与失败清理规则

| 数据面 | 隔离键 | 正常清理 | 测试中断 /失败清理 | 禁止行为 |
|---|---|---|---|---|
| pure DTO / config | namespace + case / parameter | 释放内存 /临时fixture | 删除isolated temp root | 写入共享开发配置 |
| truth / audit / replay / read store | namespace + formal primary / unique keys | transaction rollback或namespace drop | cleanup registry枚举本namespace后drop | 全表truncate、扫描其他namespace |
| adapter / fault / call trace | namespace + adapter slot | reset stub and call budget | finally reset | 复用上个case的fault状态 |
| race barriers | namespace + race + participant | release / destroy barriers | cancel participants后destroy | sleep等待或遗留线程 |
| synthetic leak corpus | isolated scan root + marker ID | scanner后删除root | finally强制删除并确认未进入shared store | 使用真实secret /正文 |
| P0-Q handle / lease / workload | qualification + environment + handle / lease refs | 先formal cleanup guard / release / reaper,再lab teardown | containment优先;保留body-free诊断refs;lab强制回收需标测试失败 | 为清理绕过redline / evidence / investigation guard |

清理断言:

1. duplicate / query / rejected-before-mutation用例即使没有业务写入,仍必须清理fake call trace、fault和namespace metadata。
2. rollback用例必须先断言truth、audit、relay、stale、stored result、idempotency completion和cursor不可见,再删除namespace。
3. cleanup / reaper / redline用例不能以测试teardown直接改变被测正式状态。被测断言完成后,lab级强制回收属于外部teardown,必须与产品surface分离。
4. 清理失败不得把用例标pass;Step 9需把cleanup failure纳入suite result,Step 13再定义其artifact schema。

## 12. 测试数据停审记录

| 测试切口 /数据集 | 审查项 | 结论 | 缺口 /修正 |
|---|---|---|---|
| protocol / shared carrier | 55协议是否有canonical与single-delta negative | 通过 | actual fixture path留实现仓。 |
| context / boundary / policy | identity、四维、fail-closed是否可独立构造 | 通过 | 真实四维施加仍P0-Q blocked。 |
| run / capture / handoff / safety | owner graph、partial、guard和恢复是否分离 | 通过 | 不引入runtime loop / downstream truth。 |
| query / projection / derived | visible / missing / degraded与write=0前置是否明确 | 通过 | write-audit实现留Step 9。 |
| consumer / relay / job | envelope、stored payload、selection / report和duplicate是否可重建 | 通过 | bus / target产品留Step 8。 |
| state / error | 31 Step 10 enum entries与38 error是否使用正式owner / producer | 通过 | 不用非法struct或字符串错误替代。 |
| transaction / idempotency / race | stage fault、stored replay和19 schedule是否确定性 | 通过 | fake必须满足durable parity contract。 |
| config / security | 101项、FC / XVAL / NCFG、40 sensitive /23 slot和carrier是否参数化 | 通过 | 只允许synthetic marker。 |
| P0-Q | manifest / probe / lifecycle / substitution数据是否设计完整 | 通过设计停审 | candidate / provider / lab缺失,执行保持blocked。 |
| conditional | durable / rollout /性能数据是否未补偿P0 | 通过 | 激活条件留Step 8 /10。 |

## 13. 跨数据隔离 /清理审计表

| 审计项 | 结论 | 缺口 /修正 |
|---|---|---|
| 254条TC是否全部回指数据集 | 通过。14个前缀完整连续区间合计254。 | 无。 |
| 基础 /边界 /异常 /并发 /恢复 /资格是否区分 | 通过。B / E / X / C / R / Q六类明确。 | 无。 |
| 是否有人工临时造数 | 否。 | 实现阶段缺builder必须回写设计,不得手工补。 |
| 是否存在跨case key / ref污染 | 设计上无。namespace + case + parameter + formal key四层隔离。 | Step 9需绑定harness enforcement。 |
| fake是否掩盖P0-Q | 否。P0-C / P0-Q实例硬分离,substitution有negative dataset。 | P0-Q执行blocked。 |
| synthetic marker是否可能进入正常store | 设计上禁止,scan root独立且必须删除。 | Step 9需定义anti-leak harness。 |
| rollback / cleanup顺序是否会掩盖断言 | 否。先断言visibility / guard,后teardown。 | 无。 |
| query / duplicate是否遗留call trace | 已要求finally reset。 | 无。 |
| external dependency替身是否明确 | 通过。resolver / backend / capture / handoff / publisher / store / provider逐项定义。 | physical environment留Step 8。 |
| 是否创建真实数据、secret、run_id、EV或结果 | 否。 | 持续禁止。 |

## 14. Blocker、待确认与Step 8承接

| 项 | 状态 | 对当前Step影响 | 后续处理 |
|---|---|---|---|
| 目标实现仓、真实fixture / suite不存在 | open_for_07_precheck | 不阻塞数据设计;阻塞执行 | `07` precheck确认仓和文件归属;Step 9只定义计划门禁。 |
| candidate backend / capability matrix / dedicated lab缺失 | open_for_p0q_execution | QUAL / PROBE数据实例不可创建 | Step 8定义环境职责;不得选择或伪造candidate。 |
| provider / platform anti-leak缺失 | open_for_p0q_execution | CONF-013真实数据blocked | Step 8 /10定义provider / platform验证要求。 |
| durable / real-like store / bus组合未选 | conditional_non_p0 | COND-001/002不激活 | Step 8定义条件环境,不得补偿P0。 |
| AC-SBX-036量化workload / baseline未形成 | conditional_non_p0 | COND-005只有数据需求轮廓 | Step 10定义观察方法和门槛。 |
| 新版正式`06-验收标准.md`未重建 | open_for_06_full_restart | 不阻塞测试数据设计 | 正式`05`完成后再按SOP重建`06`。 |

Step 8必须读取:

1. 本文件§6~§13和Step 6全套用例。
2. 正式`04-配置设计.md`的PROFILE-01~07、source / generation / scoped boundary、external binding和failure / degradation。
3. `全局项目依赖关系与裁剪规则.md`,逐依赖判定compile / runtime / event协作。
4. 测试SOP Step 8与测试方案书写规范§5.8。
5. P0-C fake环境、P0-Q dedicated environment、conditional PROFILE-06环境之间的禁止替代边界。

## 15. 回填草稿

正式`05-测试方案.md` §7后续应装配:

- §4的B / E / X / C / R / Q分类和统一生成规则。
- §5的fixture / builder / seed / fault / schedule / qualification manifest契约。
- §6测试数据集表、§8 CUT映射和§9全TC覆盖摘要。
- §10 external substitution边界、§11隔离 /清理规则和§14开放blocker。

当前不得将本文直接复制进旧正式`05`;只能在Step 15由已确认Step 1~14整体装配。

## 16. 当前结论

Step 7进入下一步的SOP条件已在设计层满足:

- 所有P0-C用例都有可重复生成的数据集、builder / seed、隔离键和清理方式。
- 所有P0-Q用例都有qualification manifest / probe / lifecycle数据需求,但实例和执行明确blocked。
- 38个测试切口均已完成数据停审,254条TC无未映射区间。
- 未发现数据污染、清理缺失、替身不明确或人工临时造数依赖。
- 未创建真实测试数据、secret、run_id、EV、artifact、测试结果或验收签署。

当前状态为`reviewed_passed_to_step_8`。Step 8已承接本Step的28个数据集和254条TC;当前恢复点以flow和项目台账为准。
