# Step 11. 定义缺陷管理与复验规则

> 对应SOP: `standards/document/测试方案讨论流程_SOP.md` Step 11
> 书写规范: `standards/document/测试方案书写规范.md` §5.11
> 回填章节: `05-测试方案.md` §11 缺陷管理与复验规则
> 生成日期: 2026-07-13
> 状态: reviewed_passed_to_step_12
> 所属流程: `05_test_plan_calibration_flow.md`
> 本Step口径: 定义缺陷分级、归因、阻断、风险接受、修复复验、证据失效和自动化防回归规则。当前没有真实测试执行,因此本文不创建缺陷实例、缺陷ID、run_id、commit、EV、测试结果、风险接受或关闭结论。

---

## 1. Step开工确认与状态

| 检查项 | 结论 |
|---|---|
| 用户是否确认Step 10并允许进入Step 11 | 是。用户在Step 10停审后明确回复“继续”,本次只放行Step 11。 |
| 台账与flow是否允许进入 | 是。Step 10原为`pass_wait_review`;本次确认后转为`passed_to_step_11`。 |
| 是否读取Step 11标准 | 是。已读取测试SOP Step 11和书写规范§5.11,必须形成S / A / B分级与可执行复验规则。 |
| 是否读取正式输入 | 是。复核正式`00`的`VF-SBX-001~010` /风险,正式`03`错误恢复 /并发,正式`04` `VETO-CFG-01~16`,以及Step 6 /9 /10。 |
| 是否参考L1粒度 | 是。参考L1-governance / L1-artifact的阻断、复验、关闭证据和自动化补强结构,按Sandbox的P0-C / P0-Q、cleanup和redline边界重建。 |
| 当前状态 | S / A / B分级、执行状态归因、16 suite升级条件、复验范围、证据失效和自动化补强已收稳;用户已确认并传递至Step 12。 |
| 上游blocker | 未发现需要回写`00/03/04`的新冲突。目标仓与ENV-05缺失仍是执行blocker,不是已发现的产品缺陷。 |
| 停审 | 用户已确认Step 11;只放行Step 12,不得跨入Step 13或修改正式`05-测试方案.md`。 |

## 2. 本步目标、边界与核心取舍

本Step完成:

1. 将`VF-SBX-001~010`、`VETO-CFG-01~16`和P0红线映射为不可降级的S级条件。
2. 区分产品缺陷、测试基础设施缺陷、设计重开项、执行阻塞和conditional residual,避免把“未执行”伪装成产品失败或通过。
3. 定义从失败TC到同family、suite、gate和release的逐级复验范围。
4. 定义修复前后raw / report保留、P0-Q qualification identity连续性和既有证据失效规则。
5. 定义何时扩展既有TC断言、何时新增TC、何时必须先回写设计。

本Step不定义缺陷平台、人员组织、排期、真实缺陷编号、正式EV schema、acceptance handoff或最终退出裁决。Step 12定义进出准则,Step 13定义证据归档,新版`06`定义验收裁决。

设计取舍:

- 正式缺陷等级只使用标准要求的`S/A/B`;`ResidualTracked`是处置,不是第四等级。
- gate失败先形成defect candidate并归因,不能仅凭exit code把产品判为S;一旦证明命中VF / VETO则必须升S。
- P0-Q因ENV-05缺失而Blocked不是产品缺陷,但始终阻断P0-Q与release;合格环境中的真实越界失败才是S。
- 同配置重跑变绿不能覆盖原失败;必须保留原run并处理间歇性 /根因。
- S级不允许风险接受;A也不能通过风险接受计入P0退出或release。

## 3. 状态、归因与缺陷等级分离

Step 13会固定最终结果schema;本Step只定义triage最低语义。

本文件表内`CMD-001`等token按`TC-SBX-CMD-001`展开,`SUITE-001`按`SUITE-SBX-001`展开,`PER-001`按`PER-SBX-001`展开;紧凑引用不创建第二套编号。

| 测试 / Gate状态 | 含义 | 是否自动创建产品缺陷 | 必需动作 |
|---|---|---:|---|
| `Failed` | 用例断言或检查观察到不符合预期 | 否,先归因 | 保留raw;定位产品 /测试 /环境 /设计责任后分S / A / B。 |
| `InfraFailed` | harness、fixture、runner、report generator或环境装配异常 | 否 | 建测试基础设施问题;P0相关时按A阻断,修复后仍要执行有效产品断言。 |
| `Blocked` | candidate、identity、provider、lab、前置suite或必需输入缺失 | 否 | 保持门禁Blocked;关闭前置后新run,不得转Skipped / Passed。 |
| `NotRunConditional` | P1 / P2激活条件不成立 | 否 | 记录residual /触发条件;不得补偿P0。 |
| `Passed` | 当前run完成全部适用断言 | 否 | 仅作为该固定run结果;不能覆盖其他Failed / Blocked run。 |

| 归因类型 | 判定 | 管理去向 | 对Gate影响 |
|---|---|---|---|
| 产品 /契约缺陷 | 正式实现或行为违反已确认契约 | 按S / A / B管理 | 按等级和受影响gate阻断。 |
| 测试基础设施缺陷 | 测试代码、fixture、scheduler、scanner、runner或report工具不可信 | P0为A起步;若伪造 /吞掉红线结果则升S | 修复前相关结果无效,相关gate阻断。 |
| 设计缺口 /冲突 | 无法从`00~04`得到唯一可落码断言,或正式契约互相冲突 | 登记design-reopen blocker,回写owner文档 | 相关切口暂停,不能由测试方案补语义。 |
| 执行前置阻塞 | 目标仓、ENV-05、candidate、provider或lab未形成 | 保留现有blocker | P0-Q / release保持Blocked,不生成缺陷结果。 |
| Conditional residual | P1 / P2 /量化基线尚未激活 | Step 14承接残余风险 | 不阻断P0,不得声称已验证。 |

## 4. SOP问题回答

| 问题 | 回答 |
|---|---|
| 哪些缺陷属于S级阻断 | 任一`VF-SBX-001~010`或`VETO-CFG-01~16`命中;host / weak fallback、四维边界失守、policy fail-open、正文 / secret泄漏、cleanup先删材料、orphan / redline脱管、truth /幂等 /事务分叉、query / job越权写、正式审计缺失、证据伪造或非core sibling编译依赖。 |
| 哪些缺陷可以风险接受 | 仅B级且不影响P0、VF / VETO、raw / report完整性或正式验收引用时可接受。A可获临时“继续开发 /继续诊断”例外,但不能关闭缺陷、改变gate状态或计入P0退出。 |
| 修复后必须回归哪些用例 | 至少原失败TC、同owner /同协议 /同状态family、主suite和相关check。共享contract、UoW、redaction、配置、race、cleanup / redline或P0-Q identity变化必须扩大到对应gate;详见§8。 |
| 缺陷关闭需要哪些证据 | 原失败固定run、归因与影响、修复revision、修复后新run、必跑TC / suite / check结果、证据失效处置和自动化补强说明。本文只定义字段要求,不创建实例。 |
| 是否需要新增自动化 | 手工发现P0、release才发现而低层漏检、redaction / dependency / pairing漏检、间歇性race、fault path缺断言或正式新场景出现时必须补强;新语义先回写设计再新增TC。 |

## 5. 缺陷分级表

| 级别 | 定义 | Sandbox示例 | 处理要求 | 是否阻断 |
|---|---|---|---|---|
| S | 一票否决、不可接受安全 / truth / evidence红线,或导致P0正式语义失真的缺陷 | 真实workload宿主直跑;任一四维边界silent degrade;policy fail-open;raw output / secret泄漏;cleanup先删材料;redline可release;duplicate二次执行;静态伪造report pass | 立即阻断相关gate与release;保留现场 / raw;必要时停止新launch;必须修复和完整复验;不得风险接受 | 是 |
| A | P0功能、协议、状态、错误、可用性或测试能力失败,但尚未证明命中VF / VETO | typed error映射错误但仍fail-closed;某协议receipt / report字段错;P0 harness不稳定;结构有界性断言失败但未造成安全逃逸 | 必须修复;原TC + family + suite复验;P0退出 / release前必须关闭;只允许不改变gate的临时开发例外 | 是,按受影响gate |
| B | P1 / P2、conditional、非阻断诊断 /可读性或无正式阈值的质量偏差 | PROFILE-06 selected-run问题;候选性能sample偏离但无硬阈值;raw完整时报告文案不清;非P0维护性问题 | 可修复或经明确owner /理由 /期限接受;不得改写P0状态或伪装已验证 | 否,除非范围升级 |

升级优先于默认等级:任何A / B候选一旦证明命中VF、VETO、P0 truth /安全 /证据完整性,立即升S;不得因发生在test、nightly、conditional或fake环境而降级实际红线语义。

## 6. S级不可降级判定矩阵

| S触发 | 正式来源 | 观察例 | 最低处置 |
|---|---|---|---|
| 核心隔离闭环缺节点仍宣称通过 | VF-SBX-001 | release缺context / boundary / policy / capture / safety主线之一 | 阻断release;重跑完整受影响主线。 |
| host / caller-local /匿名 /旁路冒充formal | VF-SBX-002;VETO-CFG-01 | host、fake、fixture返回formal run success | 停止新launch;保留identity / preflight材料。 |
| resource / filesystem / network / process任一失守 | VF-SBX-003;VETO-CFG-02 | partial capability继续、forbidden probe成功 | containment;P0-Q与release失败。 |
| policy / authorization不完备仍执行 | VF-SBX-004;VETO-CFG-03;VETO-CFG-04 | missing / stale / conflict映射allow | 阻断launch;复验policy与boundary链。 |
| 外部truth /正文 / sensitive进入sandbox | VF-SBX-005;VETO-CFG-05 | raw body、secret、process output进入truth / carrier | 隔离材料;redaction与owner边界全量复验。 |
| capture / observability material升格下游truth | VF-SBX-006;VETO-CFG-13 | receipt直接声明artifact / evidence truth | 阻断handoff结论;复验owner / write-audit。 |
| cleanup / reaper先删未交接材料 | VF-SBX-007;VETO-CFG-09 | guard非Allowed仍release / delete | 停止release;保持containment和材料。 |
| lease / orphan / redline脱离托管收束 | VF-SBX-008;VETO-CFG-10 | expiry auto-release、redline advisory-only | 停止新use / release;进入安全调查处置。 |
| 第二套execution / policy / control语义 | VF-SBX-009;VETO-CFG-08;VETO-CFG-12 | duplicate重算、handoff失败回滚source、同信号分叉 | 阻断owner主线;做事务 /幂等 /race复验。 |
| 关键追溯链断裂 | VF-SBX-010;VETO-CFG-07 | accepted truth无formal audit,telemetry替代audit | 相关结果无效;重建同UoW / pairing证明。 |
| partial / mixed generation对外可用 | VETO-CFG-06 | invalid config仍发布Degraded / Ready facade | startup / activation阻断;全配置复验。 |
| query / job / maintenance反写core truth | VETO-CFG-11 | query rebuild、job自动repair正式事实 | 阻断相关entry;no-write / no-repair全量复验。 |
| unsupported /安全削弱被兼容成功 | VETO-CFG-14;VETO-CFG-15 | S07 / S08 / reload / LKG silent ignore;deprecated redline bypass | design-reopen或strict reject复验。 |
| 领域编排越界 | VETO-CFG-16 | sandbox实现tools semantics、agent loop或member lifecycle | 停止相关设计 /实现,回写owner边界。 |
| evidence / report伪造或失配 | Step 9真实性检查 | 静态JSON / Markdown宣告pass、缺raw、Blocked变Skipped | 结果作废;阻断gate;复验生成与pairing。 |
| 非`core-contracts` sibling编译依赖 | AC-SBX-031;ARCH-001 | tools / runtime / member等成为package dependency | PR / MAIN阻断;修复manifest并复验图。 |

## 7. Suite / Gate到缺陷等级映射

| Suite / Check | 默认失败级别 | 升S条件 | 必需阻断 |
|---|---|---|---|
| SUITE-001 carrier-contract | A | raw body / ref越界、metadata缺失仍进入正式执行 | PR / MAIN |
| SUITE-002 state-invariants | A | terminal重开、hard guard绕过、非法状态形成正式truth | PR / MAIN |
| SUITE-003 config-static | A | redaction / dependency失败、partial generation、forbidden override成功 | PR / MAIN |
| SUITE-004 service-flow | A | host / policy bypass、query write、owner truth污染 | PR / MAIN |
| SUITE-005 consumer-event | A | unsafe body落库、duplicate二写、publish失败回滚source | MAIN |
| SUITE-006 jobs | A | report伪成功、job修core truth、duplicate重跑副作用 | MAIN |
| SUITE-007 transaction-replay | A | partial visibility、commit unknown盲重试、missing result重算 | MAIN / OPS |
| SUITE-008 fake-parity | A | fake吞掉hard failure并让P0语义错误通过 | MAIN / OPS |
| SUITE-009 deterministic-race | A | 双winner、半状态、cleanup / redline竞争误release | MAIN / OPS |
| SUITE-010 error-closed-set | A | fail-open、raw error泄漏、恢复动作重写truth | MAIN / OPS |
| SUITE-011 protocol-inventory | A | 缺协议被report伪装完整或入口旁路正式contract | MAIN |
| SUITE-012 operations-simulation | A | cleanup先删、redline释放、maintenance修truth | OPS / RELEASE input |
| SUITE-013 backend-conformance | 无默认:当前Blocked | 合法固定identity下真实越界、weak fallback、anti-leak或cleanup失败为S;harness故障为A | P0Q / RELEASE |
| SUITE-014 structural-boundedness | A | 有界性失败进一步造成核心闭环 /安全guard失守时S | MAIN / OPS |
| SUITE-015 conditional-real-like | B | 结果被冒充P0或伪造成已验证时S | P1 only |
| SUITE-016 scope-absence | A或design-reopen | unsupported surface静默成功、领域越界或无重开仍实现时S | PR / SCOPE-REOPEN |
| redaction / dependency / no-static-evidence checks | S | 固定为S,不得降级 | 对应PR / MAIN / P0Q / RELEASE |
| TC / protocol / pairing / identity / blocked checks | A | 故意 /静态伪造完整性、替换identity或吞Blocked时S | 对应gate |

Gate为Blocked或Failed只说明不能继续,不是自动产品S。triage必须回指首个失败TC / check和raw;同一根因不得为每个补强suite重复创建互不关联的缺陷记录。

## 8. 修复后复验范围决策矩阵

### 8.1 通用层级

| 复验层级 | 触发条件 | 最低范围 | 可否只跑原TC |
|---|---|---|---:|
| L-R1 targeted | 局部实现修复且断言 / contract未变 | 原失败TC全部参数 + 原负向fixture | 否,还需同family抽取规则下的必跑项。 |
| L-R2 family | shared DTO、enum、state、error mapper、owner flow变化 | 原TC + 同协议 /状态 /错误 /owner family | 否 |
| L-R3 suite | fixture、repository、adapter、UoW、scheduler、scanner或shared helper变化 | 受影响suite全量 +相关check | 否 |
| L-R4 gate | P0 shared contract、config generation、redaction、dependency、report或operations变化 | 固定subject下对应PR / MAIN-CONTRACT / MAIN-SEAM / OPS / P0Q完整输入 | 否 |
| L-R5 release | S级、P0-Q、跨gate、evidence integrity或release后发现 | 新固定release聚合所需MAIN-CONTRACT + MAIN-SEAM + OPS + P0Q四源run | 否 |

### 8.2 变更面到必跑集合

| 缺陷 /修复面 | 必跑TC / Suite | 必跑Check / Gate | 特殊要求 |
|---|---|---|---|
| carrier / metadata / protocol | 原TC + CTR family +受影响协议family;SUITE-001/011 | TC coverage + protocol inventory;PR / MAIN | schema变化先触发设计重开。 |
| domain state / terminal guard | 原STA / CMD / CNS / JOB +同owner状态;SUITE-002和owner suite | error closed-set;MAIN | 必须含合法与非法迁移。 |
| command / query service | 原CMD / QRY +对应TXN / ERR;SUITE-004/007/010 | write-audit;MAIN | Query修复必须全量保持0 write。 |
| consumer / event / relay | 原CNS / EVT + duplicate / no-rollback;SUITE-005/007/011 | protocol / pairing;MAIN,必要时OPS | ack / receipt / source owner同时验证。 |
| job / maintenance | 原JOB + duplicate / partial / no-repair;SUITE-006/007/012 | cleanup / pairing;MAIN + OPS | report counts与stored replay必须一致。 |
| UoW / idempotency / stored result | TXN-001~014 + owner channel + ERR适用;SUITE-007/008 | pairing;MAIN + OPS | commit unknown与rollback failure必须fault injection。 |
| concurrency / control / lifecycle race | 原RACE +相关CMD / JOB;SUITE-009/012 | cleanup disposition;OPS | deterministic schedule,不得靠重复偶现。 |
| config / profile / builder | 原CFG +I / NCFG / FC / XVAL适用index;SUITE-003/008/016 | dependency / redaction适用;PR + MAIN | 0或完整same-generation publication。 |
| sensitive / redaction | 原CTR / CFG / ERR / CONF适用;SUITE-003 | redaction check;MAIN | 若涉及provider / platform,补SUITE-013且P0Q。 |
| cleanup / lease / reaper / redline | CMD-013~020;JOB-005~007;CFG-022;RACE适用;SUITE-012 | cleanup + blocked propagation;OPS | 涉真实backend时完整SUITE-013 / P0Q。 |
| four-dimension / candidate backend | CONF-001~013;SUITE-013 | identity + redaction + cleanup;P0Q | 新subject / candidate / generation / template / provider任一变化均重跑完整qualification packet。 |
| structural boundedness | COND-004 +受影响QRY / JOB / TXN / RACE;SUITE-014 | MAIN + OPS | 不使用历史数字;量化变化另走COND-005。 |
| report / gate / evidence工具 | 原失败check +所有受影响suite summary | pairing + no-static + blocked propagation;对应gate | raw未变可重新生成report;raw缺失则重跑suite。 |
| dependency / scope | ARCH-001~003;CFG-007/029;SUITE-003/016 | dependency + scope-reopen;PR / MAIN | 新public / config /领域面先回写`00~04`。 |

### 8.3 P0-Q复验身份规则

- 原失败qualification raw不可覆盖或并入新packet。
- 新run必须固定新的subject revision、candidate、PROFILE-05、config generation、capability、boundary template、environment、provider / material identity。
- 上述任一identity变化时,不能拼接旧case的Passed行;必须重跑SUITE-013完整13条TC及identity / redaction / cleanup checks。
- lab teardown失败与被测产品cleanup disposition分别记录;lab强制回收不得改写产品truth或把产品失败变pass。
- ENV-02~04或PROFILE-06结果不能作为P0-Q复验结果。

## 9. 缺陷生命周期、复验与关闭

```text
Detected
  -> Preserve original raw / report / identity
  -> Attribute: product | test-infra | design-reopen | execution-blocked | residual
  -> Classify: S | A | B (only product / test-infra defects)
  -> Contain / block affected gate
  -> Fix or design writeback
  -> ReadyForRetest
  -> Retest on new fixed run
  -> RetestFailed -> reopen
  -> RetestPassed + closure evidence complete -> Closed
```

| 阶段 | 强制规则 |
|---|---|
| Detect / preserve | 保存首个失败case、suite raw、environment / profile / subject / config identity和gate上下文;禁止覆盖、删除或改写为latest。 |
| Triage | 先排除fixture / harness /环境装配问题;不能用“重跑通过”代替归因。S触发需立即升级且不可降级。 |
| Contain | S级按边界停止相关launch / handoff / release;redline / cleanup类保持guard与材料,不得为了测试清理而force-release。 |
| Fix | 记录真实修复revision和影响面;若正式契约需变化,先回写`00/03/04`及相应测试Step。 |
| Retest | 使用新`<run_id>`和固定identity;先原TC,再按§8扩大范围;诊断run不能替代完整gate run。 |
| Close | 所有必跑项和checks有真实raw / report且状态可回链;证据失效已处置;防回归结论已记录。 |

同subject / config / data / environment重跑后变绿时,原失败仍保留,缺陷标记为intermittent candidate并扩大到scheduler / timing / fixture隔离调查。没有根因和防回归断言时不得仅凭一次绿色重跑关闭。

## 10. 缺陷关闭与证据失效规则

### 10.1 关闭必需信息

| 信息 /证据类型 | S | A | B |
|---|---:|---:|---:|
| 原失败固定run、TC / parameter、suite / gate、raw / report refs | 必需 | 必需 | 有执行失败时必需 |
| 归因、影响范围、关联AC / VF / VETO / PER | 必需 | 必需 | 适用 |
| 修复revision /设计回写ref与变更说明 | 必需 | 必需 | 修复时必需 |
| 修复后新run与§8必跑TC / suite / check结果 | 必需 | 必需 | 修复时必需 |
| redaction / dependency / pairing / cleanup / identity结果 | 相关即必需 | 相关即必需 | 相关即必需 |
| 旧证据失效 / supersede处置 | 必需 | 必需 | 影响既有证据时必需 |
| 自动化新增 /扩展或无需新增的可审理由 | 必需 | 必需 | 适用 |
| 风险接受owner、理由、期限、重开触发 | 不允许 | 不可用于P0关闭 | 接受时必需 |

Step 13会固定实际路径、schema和正式EV;本表不表示这些材料已经存在。

### 10.2 证据失效矩阵

| 变化 /发现 | 既有结果处理 | 复验要求 |
|---|---|---|
| 产品实现、shared contract、state、UoW或error mapping变化 | 受影响TC / suite旧Passed不再作为当前revision证明 | 按§8执行新run。 |
| 测试断言、fixture、fake parity、scheduler变化 | 旧结果不能证明新断言 /新harness | 重跑全部受影响参数和suite。 |
| redaction规则 / scanner变化 | 旧scan结果失效 | 能验证digest时重扫immutable raw;raw不完整则重跑producer。 |
| report generator / Markdown模板变化 | raw产品结果可保留,旧report失效 | 从同一固定raw重生成并复跑pairing / no-static check。 |
| config generation / profile / dependency binding变化 | 旧环境结果不代表新组合 | 重跑受影响gate;不得混用generation。 |
| P0-Q任一qualification identity变化 | 整个旧packet不能证明新identity | 完整重跑SUITE-013与P0Q checks。 |
| 已交接证据关联缺陷后来重开 | 相关evidence必须标记待失效 / supersede | Step 13索引与新版`06`不得继续消费旧通过结论。 |
| 仅文案修正且raw digest /语义 /引用不变 | 产品raw不失效 | 复跑report生成与pairing即可。 |

## 11. 风险接受与自动化防回归

### 11.1 风险接受规则

| 项 | 可否接受 | 约束 |
|---|---:|---|
| S级、VF、VETO、安全 / truth / evidence完整性 | 否 | 必须修复、复验并关闭。 |
| A级用于P0退出 / release | 否 | 允许继续诊断 /开发的临时例外不改变缺陷open与gate blocked。 |
| B级conditional / P1 / P2 | 是 | 必须有owner、理由、期限、影响、重开触发;不补偿P0。 |
| 无正式阈值的性能sample偏差 | 不作为缺陷强行接受 | 记录trend / residual;阈值硬化需先回写基线。 |
| ENV-05 /目标仓缺失 | 不是风险接受项 | 保持Blocked;不能接受为P0 pass。 |
| NotRunConditional | 不是缺陷关闭 | 记录未激活原因和未来触发。 |
| design-reopen blocker | 否 | 回写owner文档后才恢复测试设计 /执行。 |

### 11.2 自动化补强规则

| 触发 | 必需动作 |
|---|---|
| 手工或安全调查发现P0缺陷 | 增加deterministic自动断言;不得保留manual-only关闭。 |
| release / P0Q发现但低层suite未发现 | 把断言下沉到最早contract / domain / service / fake / static层,并保留高层补强。 |
| 既有TC缺一个参数 /副作用断言 | 扩展原TC的parameter / assertion,不换义改号。 |
| 新独立正式场景已有上游契约 | 在Step 5 /6追溯后新增TC并更新254基线、suite manifest和PER映射。 |
| 新场景没有正式字段 /状态 /错误 /配置依据 | 先触发design-reopen,不得直接写测试私有语义。 |
| redaction / dependency / pairing / blocked propagation漏检 | 扩scanner / check fixture并重跑受影响固定raw / gate。 |
| race / commit unknown / rollback / cleanup间歇复发 | 增加barrier或fault injection schedule,不得靠重复次数碰撞。 |
| B级范围升级为P0 | 先回写Step 2 /5~11和环境 / gate,再升级自动化与阻断。 |

## 12. 上游影响、回填与停审

| 结论 | 是否回写上游 | 当前处理 |
|---|---:|---|
| VF / VETO全部进入S级 | 否 | 测试管理细化,与正式`00/04`一致。 |
| P0-Q Blocked与产品缺陷分离 | 否 | 保留Step 8~10成熟度,不伪造失败 /通过。 |
| S / A不能通过风险接受计入P0退出 | 否 | Step 12承接退出准则。 |
| 证据失效和关闭材料需固定schema | 否 | Step 13承接,当前不创建EV。 |
| 未来缺陷暴露正式设计无唯一断言 | 条件性是 | 停止相关切口并回写`00/03/04`,再更新Step 5~11。 |

正式`05-测试方案.md` §11后续应装配:

- §3的状态 /归因分离和§5的S / A / B分级。
- §6的VF / VETO不可降级矩阵和§7的suite / check升级规则。
- §8的分层复验矩阵与P0-Q identity规则。
- §9~§11的生命周期、关闭证据、证据失效、风险接受和自动化补强规则。

当前不得修改旧正式`05`;只能在Step 15由用户确认的Step 1~14整体装配。

| 进入下一步条件 | 状态 | 说明 |
|---|---|---|
| 缺陷分级可执行 | 通过 | S / A / B定义、升级与阻断清楚。 |
| 一票否决不可降级 | 通过 | VF / VETO全部映射S。 |
| Blocked / InfraFailed不伪装产品缺陷 | 通过 | 归因与gate传播已分离。 |
| 风险接受边界清楚 | 通过 | S不可接受,A不可用于P0退出,B仅限非P0。 |
| 修复后回归范围可执行 | 通过 | TC -> family -> suite -> gate -> release逐级明确。 |
| 复验说明证据要求 | 通过 | 原失败、新run、checks和失效处置已定义。 |
| 自动化防回归触发明确 | 通过 | 参数扩展、新TC和design-reopen边界清楚。 |
| 是否存在阻塞Step 12设计的上游blocker | 否 | 执行blocker继续保留,不阻塞进出准则设计。 |

新增`SBX-TEST-DEFECT-001`已在本Step解析为`resolved_for_test_step_11`:Step 9 /10原有失败状态、红线和suite尚缺统一分级、复验与证据失效规则,现已闭合。当前状态为`reviewed_passed_to_step_12`;用户已确认Step 11,Step 12完成后必须重新停审。
