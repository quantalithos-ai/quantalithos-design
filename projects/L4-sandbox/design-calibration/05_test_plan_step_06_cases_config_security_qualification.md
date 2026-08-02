# Step 6 分件 E. 配置、安全、资格与Conditional用例矩阵

> 父Step: `05_test_plan_step_06_cases.md`
> 正式来源: `04-配置设计.md` §5~§14;`04_config_step_11_failure_degradation.md` §9.10;`04_config_step_12_downstream_handoff.md` §9.4~§9.6;`05_test_plan_step_02_scope.md`;`05_test_plan_step_04_strategy_layers.md`
> 生成日期: 2026-07-12
> 状态: reviewed_passed_with_step_06
> 边界: P0-Q case保持`covered_designed_execution_blocked`;本文不选择backend / provider / lab,不创建qualification packet实例或真实evidence。Step 7定义synthetic数据,Step 8定义环境,Step 9定义suite,Step 10定义专项方法 /阈值。

---

## 1. 参数化覆盖规则

| 集合 | Step 6最低case化规则 | 不得缩减为 |
|---|---|---|
| I001~I101 | 每项至少执行required / type / enum / range / collection / ref中适用的合法边界和非法边界;维护101项coverage index | 只抽3个配置key |
| 40配置组 / D01~D44 | 每组 /域至少进入source、composition、generation、scoped或failure用例的适用索引 | “builder integration覆盖” |
| NCFG-01~24 | 每类override逐项拒绝且builder前停止 | 只测一个`fail_closed=false` |
| FC-01~06 / XVAL-01~36 | 每项正向完整组合 + 负向缺依赖 /冲突disposition | 只测字段validator |
| 40 sensitive /23 material slot | sensitive taxonomy和slot逐项进入source / resolve / lease / carrier扫描索引 | 真实secret或单一env key |
| carrier闭集 | config issue、log、metric、formal audit、receipt、report、public error、event、handoff、workload input逐类扫描 | 只扫日志 |

## 2. FDT-01~30同序配置用例

| 用例ID | FDT /触发操作 | 预期结果 | 关键断言 | PER / EHR |
|---|---|---|---|---|
| TC-SBX-CFG-001 | FDT-01: S02 selector冲突、S03 / S05多selector | source intent阶段拒绝 | 读取第二source前失败;issue仅stable ID / safe reason | PER-SBX-027;EHR-03 |
| TC-SBX-CFG-002 | FDT-02: explicit S02不存在 /不可读 | fail-fast | 不回退S01、alternate path或旧process | PER-SBX-027;EHR-03 |
| TC-SBX-CFG-003 | FDT-03: malformed、comment、trailing comma、duplicate、unknown、alias、wrong top-level、secret-like field | strict parse / closed schema拒绝 | 不进入typed snapshot;issue无raw value | PER-SBX-027;EHR-01 |
| TC-SBX-CFG-004 | FDT-04: high-priority env / source present-invalid | reject winner | 不fallback lower source、不clamp / guess | PER-SBX-027;EHR-03 |
| TC-SBX-CFG-005 | FDT-05: I001~I101适用required / active dependency缺失 | global candidate失败;S05只拒绝current invocation | global发布0;FZ-03与旧formal result不变 | PER-SBX-027/028/031;EHR-02/06/10 |
| TC-SBX-CFG-006 | FDT-06: wrong ref family、registry missing / ambiguous | validation reject | 不substring猜family / provider / route | PER-SBX-027;EHR-02 |
| TC-SBX-CFG-007 | FDT-07: S07 / S08、reload、LKG、hot / callback声明 | unsupported / design-reopen gate | 无current API / config surface;old process不算success | PER-SBX-027/033/038;EHR-19 |
| TC-SBX-CFG-008 | FDT-08: NCFG-01~24每类override | builder前reject / related operation fail-closed | truth owner、policy、四维boundary、no-write / repair、audit、cleanup、redline、redaction均不可配置关闭 | PER-SBX-027/028/033;EHR-05 |
| TC-SBX-CFG-009 | FDT-09: raw / full sensitive ref / synthetic marker进入ordinary source与每类carrier | field / candidate / launch拒绝或scan失败 | config、log、metric、audit、error、receipt、report、event、handoff、workload无禁止内容 | PER-SBX-029/032;EHR-07/17 |
| TC-SBX-CFG-010 | FDT-10: P05+使用fake / fixture / incomplete candidate,P07 activation | qualification blocked / inactive | P01~04 non-executing;fake / seam不升格;profile identity明确 | PER-SBX-028/034/036/038;EHR-04/20 |
| TC-SBX-CFG-011 | FDT-11: FC-01~06与XVAL-01~36逐项负向 | exact blocked / fail-closed disposition | enabled dependency / route / target / retention / guard不可拆分或silent disable | PER-SBX-028;EHR-06 |
| TC-SBX-CFG-012 | FDT-12: pre-review调用S04;descriptor missing;provider unavailable / denied / audit unavailable | review前禁止resolve;required binding blocked | 不fallback raw / fake / other provider;不partial build | PER-SBX-028/029/030;EHR-08/11 |
| TC-SBX-CFG-013 | FDT-13: 23 material slot逐类renew、expiry、revoke、rotation、release failure、cross-consumer | lease仅到expiry;检测revoke后stop-new-use;release failure禁止复用 | renew有界;revoked / expired不rollback;lease不跨consumer | PER-SBX-029/035;EHR-08 |
| TC-SBX-CFG-014 | FDT-14: 每个required repository / adapter constructor或availability失败 | generation build失败 | 发布0 handle;accepted mutation未开始 | PER-SBX-028/031;EHR-09 |
| TC-SBX-CFG-015 | FDT-15: optional telemetry sink unavailable | qualified Degraded surface | local diagnostic、formal audit、redaction保持;不削弱hard guard | PER-SBX-028/032;EHR-09/15 |
| TC-SBX-CFG-016 | FDT-16: generation identity mismatch、partial / mixed set、publication failure | publication rejected | LD-23 complete后LD-24仅0或完整;无mixed handle | PER-SBX-022/028/031;EHR-09 |
| TC-SBX-CFG-017 | FDT-17: S05 / S06 entry、loop、job分别ceiling / registry / target / scope越界 | current unit独立拒绝 | global FZ-03、其他unit与旧receipt / report不变;P05+不注入fixture | PER-SBX-028/031;EHR-10 |
| TC-SBX-CFG-018 | FDT-18: post-publication context unavailable、policy stale / conflict、capability stale / degraded | reject / fail-closed / boundary blocked | 不猜context;technical Degraded不授权launch | PER-SBX-004/005/011/031/034~036;EHR-14 |
| TC-SBX-CFG-019 | FDT-19: projection / reference missing / stale / degraded | formal query degraded surface | write UoW、refresh、rebuild、audit append均0 | PER-SBX-010/019/031;EHR-15 |
| TC-SBX-CFG-020 | FDT-20: inbound dependency unavailable vs invalid / forbidden | unavailable `Delayed`;invalid / forbidden `Quarantined` | 不造guessed truth;receipt owner正确 | PER-SBX-011/026/031;EHR-14/16 |
| TC-SBX-CFG-021 | FDT-21: publisher / relay与handoff adapter retryable / failed / dead-letter | owning marker / report更新 | source truth、capture、guard、stored result不回滚 | PER-SBX-006/012/017/020;EHR-16 |
| TC-SBX-CFG-022 | FDT-22: cleanup / release / redline依赖、证据或handoff缺失 | Blocked / OrphanSuspected / Contained保持 | force success与release=0;材料 / investigation refs保留 | PER-SBX-007/018/035;EHR-14/16 |
| TC-SBX-CFG-023 | FDT-23: maintenance batch含success / missing / adapter failed items | `PartialFailed` / `Degraded` report | per-item refs / counts完整;no core truth repair | PER-SBX-008/013/019;EHR-15/16 |
| TC-SBX-CFG-024 | FDT-24: prevalidation / independent review rejected或candidate revision变化 | no activation | S04 / builder调用0;旧approval失效;safe rejection retained | PER-SBX-030;EHR-11 |
| TC-SBX-CFG-025 | FDT-25: apply S04 / build / publication失败 | active relation诚实关闭 /失败 | desired / observed mismatch与原history保留;old process不算applied | PER-SBX-030/037;EHR-09/13 |
| TC-SBX-CFG-026 | FDT-26: generation effect suspect | freeze automatic action | 只允许new investigation / rollback request;不自动mutation / truth rewrite | PER-SBX-030/037;EHR-12/16 |
| TC-SBX-CFG-027 | FDT-27: prior target missing / revoked / incompatible或rollback validation / build / publication失败 | parent / child failure均保留 | prior仍过current validator;old process不算rollback;history immutable | PER-SBX-030/037;EHR-12/16 |
| TC-SBX-CFG-028 | FDT-28: desired / observed差异、active same-scope rollout、missing observation | Pending / Drift / MissingObservation准确分类 | 仅active same-scope可pending;observed不反写desired;missing不aligned | PER-SBX-030/037;EHR-13 |
| TC-SBX-CFG-029 | FDT-29: ordinary config被宣称隐含TTL | assumption rejected | 只处理明确material / freshness / qualification / compatibility expiry | PER-SBX-027/033/038;EHR-19 |
| TC-SBX-CFG-030 | FDT-30: ALC-01~06各carrier与metric label注入marker / ref / actor / instance / raw detail | unsafe carrier拒绝 / scan失败 | safe field闭集;metric低基数;early log不冒充durable audit | PER-SBX-029/032;EHR-17 |

## 3. 静态依赖与unsupported surface用例

| 用例ID | 场景 /操作 | 预期结果 | 关键断言 | CUT / PER |
|---|---|---|---|---|
| TC-SBX-ARCH-001 | 对目标实现仓manifest / dependency metadata执行sibling compile dependency闭集检查 | 仅`core-contracts`可作为sibling compile dependency | tools / runtime / member / policy / artifact / observability等相邻仓不得以package依赖进入;目标仓未形成时case保持designed-not-run | CUT-SBX-033;PER-SBX-033;EHR-18 |
| TC-SBX-ARCH-002 | 对public protocol、config schema与entry registry扫描S07 / S08、remote / admin、reload、LKG、hot swap、immediate callback等名称 /入口 | current unsupported surface不存在或输入被正式reject | 无私造API / config alias / fallback;新增要求触发`03/04`重开 | CUT-SBX-033/038;PER-SBX-033/038;EHR-19 |
| TC-SBX-ARCH-003 | 对模块 / protocol / port责任映射检查领域越界 | sandbox仅承接launch policy和运行隔离 | 不拥有tools semantic execution、runtime agent loop、member lifecycle orchestration或downstream truth | CUT-SBX-033;PER-SBX-033;EHR-18 |

## 4. P0-Q dedicated conformance用例设计

以下case必须保留正式ID与可执行步骤,但当前状态均为`designed_execution_blocked`。只有Step 8绑定candidate + capability matrix + boundary template + dedicated environment后才能执行;L1~L4 / fake / simulation结果不可代替。

| 用例ID | CUT /场景 | 前置资格 | 输入 /操作 | 必须观察的真实结果 | 当前状态 / PER |
|---|---|---|---|---|---|
| TC-SBX-CONF-001 | CUT-SBX-034 coherent four-dimension establish | fixed candidate、Fresh capability、同代template / generation / environment identity | 建立resource / filesystem / network / process完整boundary并启动bounded probe | 四维均真实施加;handle / lease / profile identity一致;无host path | blocked;PER-SBX-034/036 |
| TC-SBX-CONF-002 | CUT-SBX-034 resource越界 | 同上;受控CPU / memory / wall-clock / IO probe | 分别越过每个适用limit | probe被candidate实际限制 /终止;failure kind与usage safe summary准确 | blocked;PER-SBX-034 |
| TC-SBX-CONF-003 | CUT-SBX-034 filesystem boundary | 受控workspace与禁止path marker | read / write允许与禁止path | 只允许声明scope;host / sibling / secret path不可达;无fallback | blocked;PER-SBX-034/035 |
| TC-SBX-CONF-004 | CUT-SBX-034 network boundary | 默认拒绝与明确允许target的受控endpoint | egress / ingress / DNS等适用动作 | forbidden连接不成功;allowed仅在正式policy + capability内成功 | blocked;PER-SBX-034/035 |
| TC-SBX-CONF-005 | CUT-SBX-034 process boundary | 受控spawn / signal / namespace / escape probe | 尝试越权process动作 | 越权动作不成功;failure / redline可分类;host process不受控执行 | blocked;PER-SBX-034/035 |
| TC-SBX-CONF-006 | CUT-SBX-034 unsupported / partial capability | candidate故意缺任一维或outcome无法分类 | 请求完整boundary | 整体Rejected / Blocked;0 bounded launch;不silent degrade | blocked;PER-SBX-034/036 |
| TC-SBX-CONF-007 | CUT-SBX-035 bounded launch / timeout / kill | qualified coherent boundary与body-free workload | 启动、等待timeout、发formal kill / cancel | run / control / failure状态单调;resource副作用停止;不进入runtime loop truth | blocked;PER-SBX-035 |
| TC-SBX-CONF-008 | CUT-SBX-035 capture / inspect | workload产生stdout / stderr / exit / file digest / diagnostic marker | capture complete / partial / failed与post-failure inspect | 只保存refs / digest / safe summary;raw output不进carrier;failure后仍诚实capture | blocked;PER-SBX-035 |
| TC-SBX-CONF-009 | CUT-SBX-035 lease expiry / orphan / reaper | qualified lifecycle inspection、expired lease与材料未交接组合 | 断开lifecycle /触发reaper / guard重评 | orphan可检测;non-Allowed不release;材料 / investigation未闭合不删除 | blocked;PER-SBX-035 |
| TC-SBX-CONF-010 | CUT-SBX-035 redline containment | 每维受控redline probe与investigation target | 触发fs / network / process / secret / high-risk redline | Detected -> Contained / HandoffPending;launch / cleanup受阻;非advisory | blocked;PER-SBX-035 |
| TC-SBX-CONF-011 | CUT-SBX-036 qualification identity完整 | candidate、profile、config / generation、capability、template、environment、material refs均固定 | 运行qualification preflight与case | 所有identity match才允许执行;任何缺失为Blocked而非N/A | blocked;PER-SBX-036 |
| TC-SBX-CONF-012 | CUT-SBX-036 weak fallback / substitution veto | 故意替换host / fake / fixture /错误candidate / generation / environment | 启动preflight或执行case | 立即Failed / Blocked;不得继续并标conformance | blocked;PER-SBX-036 |
| TC-SBX-CONF-013 | CUT-SBX-036 provider / material anti-leak适用子集 | fixed provider principal、lease与platform scan前置 | inject synthetic marker并执行capture / handoff / diagnostic scan | carrier零泄露;material lifecycle identity匹配;真实provider未选时Blocked | blocked;PER-SBX-029/035/036 |

## 5. Conditional P1 / P2用例

| 用例ID | CUT /触发 | 当前设计 | 激活门禁 | 当前状态 / PER |
|---|---|---|---|---|
| TC-SBX-COND-001 | CUT-SBX-037 PROFILE-06 durable parity | 对UoW / replay / version / cursor / page / no-write / no-rollback运行与fake同一contract set | durable store与real-like组合qualified后selected-run;不得补偿P0 | conditional_non_p0;PER-SBX-037 |
| TC-SBX-COND-002 | CUT-SBX-037 dependency outage / rollout / rollback / drift | controlled bus / handoff / sink / provider / rollout carrier失败矩阵 | Step 8 /10确认产品和physical drill,否则not run | conditional_non_p0;PER-SBX-037 |
| TC-SBX-COND-003 | CUT-SBX-038 current production / peripheral absence | static检查无production activation、multi-host / console / preview public API、remote / hot等current surface | 任一新需求出现先回写`00~04`,再设计happy path | conditional_non_p0;PER-SBX-038 |
| TC-SBX-COND-004 | AC-SBX-036结构性性能 | P0路径验证optional增强不阻断、race / batch有界、无无界sync scan | Step 10再定义观察方法;本结构性case保持设计覆盖 | covered_designed_quantitative_pending;PER-SBX-004~007/025/030 |
| TC-SBX-COND-005 | AC-SBX-036量化候选 | candidate latency / throughput / capacity模型 | 仅有正式产品 / workload / baseline后Step 10可升门禁;不继承旧数字 | conditional_non_p0;PER-SBX-037/038 |

## 6. 本分件停审

| 审查项 | 结论 | 后续边界 |
|---|---|---|
| FDT-01~30是否同序逐项case化 | 通过,30 /30 | Step 7建立参数化数据与coverage index |
| I001~I101 / NCFG / XVAL / sensitive是否允许抽样替代 | 否 | 必须逐项适用覆盖索引 |
| dependency / unsupported /领域边界是否有独立static case | 通过,3 /3 | 目标仓未形成只阻塞执行,不删除case |
| P0-Q是否误写为未覆盖 / pass / N/A | 否 | 13个case均designed_execution_blocked |
| fake / seam / staging是否升格 | 否 | L5与conditional层级明确 |
| production / quantitative是否伪造 | 否 | 只定义absence / trigger /候选,无阈值和结果 |
