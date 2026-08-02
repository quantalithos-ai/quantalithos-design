# Step 4. 制定测试策略与分层

> 对应SOP: `standards/document/测试方案讨论流程_SOP.md` Step 4
> 书写规范: `standards/document/测试方案书写规范.md` §5.4
> 回填章节: `05-测试方案.md` §4 测试策略与分层
> 生成日期: 2026-07-12
> 状态: reviewed_passed_to_step_5
> 所属流程: `05_test_plan_calibration_flow.md`
> 本Step口径: 为`CUT-SBX-001~038`固定风险最早发现层、强制补强层和阻断语义。测试层级是设计责任,不是suite、脚本、环境实例、TC、EV、run或结果。本步不修改旧正式`05`,不创建测试代码、实施产物或资格事实。

---

## 1. Step开工确认与状态

| 检查项 | 结论 |
|---|---|
| 用户是否确认Step 3并允许进入Step 4 | 是。用户审查Step 3后回复“同意”,本次只放行Step 4。 |
| 项目台账与flow是否允许进入Step 4 | 是。原恢复点为Step 3 `pass_wait_review`;用户确认后解除门禁。 |
| 是否读取Step 4标准 | 是。已读取测试SOP Step 4与书写规范§5.4,必须输出分层图、分层表并覆盖全部P0切口。 |
| 是否读取已确认Step 1~3 | 是。权威输入、P0-C / P0-Q、SCP-SBX-001~036和CUT-SBX-001~038均保持不变。 |
| 是否读取直接设计输入 | 是。已复核正式`03`模块 / flow /状态 /一致性 /测试切口和正式`04` PROFILE / TSH / FDT边界。 |
| 是否参考L1粒度 | 是。已读取L1-governance / L1-artifact Step 4,只参考分层、替身边界和审计结构。 |
| 当前状态 | 六层策略、38个CUT映射、P0-Q资格层、profile /协议分层和跨层审计已收稳;用户已确认并传递至Step 5。 |
| 是否发现阻塞Step 4的上游设计blocker | 否。P0-Q执行前置仍开放,但不阻塞其分层策略设计。 |
| 停审方式 | Step 4停审已由用户确认解除;当前审查门禁位于Step 5。 |

---

## 2. 本步目标与非范围

本Step必须完成:

1. 决定schema、domain、flow、repository / adapter、entry和真实backend风险各自最早在哪层失败。
2. 为每个CUT记录主发现层、不可省略的补强层和P0失败传播,避免只写泛化“unit / integration”。
3. 把P0-Q从fake integration和跨仓E2E中分离,形成dedicated backend conformance层。
4. 明确PROFILE-01~07在各层的证明上限,禁止fake、seam、simulation、staging名称或release summary越级证明。
5. 证明55个协议、状态 /事务 /幂等、配置 /安全和重点隔离边界均有合理层级。
6. 固定E2E / release gate只汇总闭环与资格,不得成为底层断言的替代品。

本Step不定义:

- 需求 /规则 /设计 /切口 /case / evidence双向追溯;留给Step 5。
- TC编号、场景步骤、输入、断言数量和逐错误case;留给Step 6。
- fixture、seed、builder、synthetic marker和清理数据;留给Step 7。
- backend产品、环境拓扑、安装、principal、网络或材料配置;留给Step 8。
- suite名、CI job、命令、触发器、artifact / report路径和实际阻断实现;留给Step 9。
- 专项阈值、执行结果、run_id、EV alias、资格包实例、验收裁决或签署。
- 正式`05-测试方案.md`;只允许Step 15装配。

---

## 3. 本步输入

| 输入 | 状态 | 本Step用途 |
|---|---|---|
| `05_test_plan_step_01_input_boundary.md` | reviewed | 固定测试不补设计、historical隔离和evidence真实性边界 |
| `05_test_plan_step_02_scope.md` | reviewed | 固定P0-C / P0-Q不可替代、P1 / P2和profile证明上限 |
| `05_test_plan_step_03_test_objects_cuts.md` | reviewed_passed_to_step_4 | 提供CUT-SBX-001~038、55协议、状态 /错误闭集和P0停审 |
| `03-详细设计.md` §5 / §8 | current formal baseline | 固定七模块、entry边界和Command / Query / Consumer / Event / Job flow |
| `03-详细设计.md` §9~§12 | direct strategy input | 固定状态、UoW、错误、并发、幂等和恢复风险的最早发现位置 |
| `03-详细设计.md` §13~§15 | direct strategy input | 固定adapter / builder、观测 /审计和最小验证入口 |
| `03_ddd_step_16_test_cuts.md` | explanatory input | 提供建议测试类型;本Step转译成正式分层责任 |
| `04-配置设计.md` §6 / §9 / §11 / §12 | direct strategy input | 固定PROFILE-01~07、atomic generation、失败分层和planned handoff |
| `04_config_step_12_downstream_handoff.md` | explanatory input | 提供TSH-01~20 / FDT-01~30在`05`继续展开的责任 |
| L1-governance / L1-artifact Step 4 | granularity reference | 参考风险前置、替身边界、release gate与覆盖审计结构 |

---

## 4. Step内执行记录

| 序号 | 动作 | 状态 | 产物 /门禁 |
|---:|---|---|---|
| 1 | 恢复Step 3、flow和项目台账 | done | 用户确认只放行Step 4 |
| 2 | 读取SOP Step 4、书写规范§5.4和L1参考 | done | 固定分层图、分层表和P0全覆盖要求 |
| 3 | 复核38个CUT及正式`03/04`风险来源 | done | 识别最早发现层与不可替代层 |
| 4 | 定义六层策略和替身证明上限 | done | 单列dedicated backend conformance |
| 5 | 映射CUT、55协议、PROFILE-01~07和高风险断言 | done | 36个P0均有主层与阻断语义 |
| 6 | 完成跨层审计、影响判定和回填草稿 | done | 无当前上游回写;P0-Q执行blocker保留 |
| 7 | 更新Step 3、flow和项目台账 | done | Step 4已由用户确认并传递至Step 5;当前门禁位于Step 5 |

---

## 5. SOP问题回答

| SOP问题 | 本Step回答 |
|---|---|
| 哪些问题必须在unit层发现 | public carrier / typed ref / metadata / digest、domain factory与不变量、31个 Step 10 canonical status enum entries合法转换、policy fail-closed纯规则、38错误闭集、strict config parse / source / item / cross-field纯校验、redaction和low-cardinality规则必须在`L1 Contract / Unit / Static`发现。 |
| 哪些问题必须在service层验证编排 | 10 Command的UoW与副作用顺序、13 Query no-write、9 Consumer dedup / quarantine / receipt、10 Job partial report / no-repair、stored replay、no-rollback、错误映射和状态owner传播必须在`L2 Application Service / Orchestration`验证。 |
| 哪些问题依赖DB / adapter / worker集成 | repository version / cursor / uniqueness / rollback、UoW atomic visibility、runtime builder complete-generation publication、adapter failure mapping、relay / handoff single-winner和write-audit必须在`L3 Repository / Adapter Integration`验证;P0-C允许deterministic fake / controlled seam,但必须保持正式语义parity。 |
| 哪些问题需要API / contract test | 10 Command、13 Query、9 Consumer、13 Event和10 Job的envelope / DTO / entry mapping、required metadata、schema / disposition / public safe error、worker loop和job runner report surface必须在`L4 API / Worker / Job Entry`验证,但entry层不得替代service事务断言。 |
| 哪些场景需要E2E或release gate | 最小跨入口闭环、profile / generation identity汇总、redaction / dependency / veto扫描和真实资格包完整性进入`L6 E2E / Release Gate`;它只聚合已由下层证明的事实。完整跨仓real-like组合属于P1,生产容量属于P2。 |
| 真实隔离有效性在哪层证明 | CUT-034~036只能由`L5 Dedicated Backend Conformance`对绑定的candidate backend、capability matrix、coherent boundary template和dedicated environment证明。L1~L4只证明契约,L6只汇总;均不能替代L5。 |

---

## 6. 当前文档问题诊断与测试设计取舍

| 议题 /问题 | 处理与取舍 | 原因 |
|---|---|---|
| 旧`05`按单元 /集成 /E2E平铺 | 改为按“最早风险发现位置”分层 | 平铺无法判断失败owner或是否把高风险推迟 |
| 普通五层金字塔缺真实隔离证明层 | 增加L5 dedicated backend conformance | sandbox核心命题包含真实四维限制,不是普通adapter集成 |
| fake repository / backend能否承担P0 | 可承担P0-C,但必须有parity断言;绝不承担P0-Q | fake适合确定性故障注入,无法证明宿主边界 |
| controlled seam能否证明backend安全 | 只证明接缝schema、mapping和failure disposition | seam成功不代表resource / fs / network / process真实受限 |
| operations simulation能否证明cleanup | 只证明guard、状态和禁止副作用;真实inspect / release另归L5 | simulated handle不代表真实资源已清理 |
| 是否用跨仓E2E覆盖55协议 | 不采用;协议契约、编排和entry逐层覆盖,E2E只做最小样本 | 大E2E定位弱且会越入相邻仓内部语义 |
| P0-Q前置未形成如何计分 | `blocked / not run`,并阻断核心资格;不得降为N/A、P1或risk accepted | 未执行不等于通过,也不能由P0-C补偿 |
| PROFILE-05在`04`是配置P1 | 在测试风险轴仍承载P0-Q;两个分类轴并存 | 配置引入成熟度不改变真实隔离的核心风险 |
| release gate能否重试后覆盖底层失败 | 禁止;底层失败必须在owner层关闭,L6不得重算或润色 | 防止汇总层成为第二真相源 |

分层总原则:

- `主发现层`是该风险应最早、最精确失败的位置;`强制补强层`验证跨边界后语义仍成立,不是重复执行同一断言。
- P0-C的L1~L4任一必需断言失败均阻断相应合并 /候选推进;具体suite与触发器由Step 9定义。
- P0-Q的L5失败、blocked或not run阻断candidate资格、PROFILE-06前置和“sandbox核心测试通过”声明,但不伪装成所有开发活动必须停止。
- L6只能消费下层结果与身份,不能把missing、blocked、failed或wrong-profile改写为pass。

---

## 7. 六层风险发现模型

### 7.1 层级定义与禁止替代关系

| 层级 | 名称 | 主要真相 | 允许替身 /依赖 | 明确不证明 |
|---|---|---|---|---|
| L1 | Contract / Unit / Static | schema、typed carrier、纯不变量、状态、纯validator、redaction、依赖裁剪 | fixed value、pure builder、static manifest | UoW编排、adapter副作用、真实隔离 |
| L2 | Application Service / Orchestration | flow顺序、UoW边界、幂等、no-write / no-repair、owner传播 | fake ports、recording UoW、fixed clock / id | repository物理语义、entry mapping、真实backend |
| L3 | Repository / Adapter / Runtime Builder Integration | rollback / version / cursor / race、adapter mapping、complete generation、write audit | parity fake、controlled seam、failure injection | candidate真实四维限制、跨仓完整语义 |
| L4 | API / Worker / Job Entry | public carrier解析、entry映射、consumer disposition、event / job surface | handler harness、controlled worker / runner | service内部事务完整性、真实隔离资格 |
| L5 | Dedicated Backend Conformance | candidate capability、四维边界真实施加、lifecycle / capture / inspect / release、no fallback | candidate-real backend与受控conformance workload | 其他backend、staging / production readiness、相邻仓内部语义 |
| L6 | E2E / Release Gate / Qualification Summary | 最小闭环、profile / generation / result identity、redaction / dependency / veto汇总 | 已完成的下层输出和受控跨入口样本 | 新增领域结论、替代下层失败、伪造evidence或验收裁决 |

### 7.2 测试分层图: L4-sandbox双门禁测试金字塔

```text
                 [L6 E2E / Release Gate / Qualification Summary]
                    - minimal cross-entry loop and identity binding
                    - redaction / dependency / veto aggregation
                                      ^
                                      |
             [L5 Dedicated Backend Conformance: P0-Q only]
                - real resource / filesystem / network / process limits
                - lifecycle / capture / inspect / guarded release
                                      ^
                                      |
                    [L4 API / Worker / Job Entry]
                     - 55 protocol carrier and entry mapping
                                      ^
                                      |
          [L3 Repository / Adapter / Runtime Builder Integration]
             - UoW parity / failure injection / atomic generation
                                      ^
                                      |
                [L2 Application Service / Orchestration]
                 - flow / idempotency / no-write / no-repair
                                      ^
                                      |
                   [L1 Contract / Unit / Static]
                    - schema / invariant / state / config / redaction
```

关键说明:

- L1~L4共同构成P0-C,但不是“低层通过一次即可”:跨层风险必须完成表中强制补强。
- L5不是更大的E2E,而是按candidate identity隔离的资格层;其结果不得跨backend、capability、template、profile或environment继承。
- L6位于汇总顶层,只证明闭环与证据身份完整;它不拥有domain truth、backend capability truth或验收truth。

### 7.3 测试分层策略表

| 层级 | 目标 | 典型内容 | 预期执行时机 | 失败处理 |
|---|---|---|---|---|
| L1 Contract / Unit / Static | 最早发现局部、确定性和静态契约错误 | DTO / enum / typed ref、state matrix、error mapping、strict config、redaction、dependency check | local / PR / fast CI候选 | P0-C阻断;不得推迟到entry或E2E |
| L2 Application Service / Orchestration | 证明正式flow与副作用顺序 | Command UoW、Query no-write、Consumer receipt、Job no-repair、stored replay | PR / CI service候选 | P0-C阻断;定位到service / port contract |
| L3 Repository / Adapter / Builder Integration | 证明边界语义和故障映射保持parity | rollback / version / race、publisher / handoff failure、atomic generation、write audit | CI integration候选 | P0-C阻断;fake不一致视为测试基础缺陷 |
| L4 API / Worker / Job Entry | 证明55个协议实际入口不绕过应用层 | required metadata、safe error、worker disposition、event payload、job report | CI entry候选 | P0-C阻断;不得以handler成功替代flow成功 |
| L5 Dedicated Backend Conformance | 证明candidate真实隔离与安全lifecycle | coherent boundary、越界阻断、launch / timeout / capture / inspect / release、no host fallback | candidate资格阶段 | failed / blocked / not run均阻断P0-Q资格和核心通过声明 |
| L6 E2E / Release Gate / Summary | 证明最小闭环和所有必需结果身份可消费 | cross-entry smoke、profile / generation绑定、redaction / veto / dependency汇总 | candidate / release review | 下层任一必需项非pass即不送验;不得在本层修复结果 |

---

## 8. CUT-SBX-001~038分层映射

### 8.1 P0-C对象、协议与状态切口

| 测试切口 | 主发现层 | 强制补强层 | 层级责任 /禁止替代 | P0传播 |
|---|---|---|---|---|
| CUT-SBX-001 public carrier schema | L1 | L4 | L1逐carrier roundtrip / invalid family;L4证明entry真实拒绝,不能只测serializer | 任一必需carrier失败阻断P0-C |
| CUT-SBX-002 metadata / digest / field distinction | L1 | L2 + L4 | L1固定canonical规则;L2验证replay key使用;L4验证缺失 /混同surface | 失败阻断P0-C |
| CUT-SBX-003 context / identity / reference invariants | L1 | L2 + L4 | object invariant先失败;service不得补造identity;entry不得匿名旁路 | 失败阻断P0-C |
| CUT-SBX-004 coherent boundary decision contract | L1 | L2 + L3 | L1验证四维同代decision;L2验证全量拒绝;L3注入capability / adapter失败;不证明真实施加 | 失败阻断P0-C;L5另证P0-Q |
| CUT-SBX-005 policy / high-risk fail-closed | L1 | L2 + L3 | policy纯规则先失败;service / resolver不可把unavailable映射allow | 失败阻断P0-C |
| CUT-SBX-006 run / capture / handoff truth separation | L1 | L2 + L3 + L4 | owner不变量、编排、handoff failure injection和event / receipt surface逐层验证 | 失败阻断P0-C;真实lifecycle另由L5 |
| CUT-SBX-007 failure / control / cleanup / redline guards | L1 | L2 + L3 | guard / conflict纯规则、service no-force、adapter unavailable mapping;simulation不证明真实release | 失败阻断P0-C;真实安全行为另由L5 |
| CUT-SBX-008 projection / derived / reconciliation / relay ownership | L1 | L2 + L3 + L4 | owner规则、query / job no-repair、relay failure和public surface逐层验证 | 失败阻断P0-C |
| CUT-SBX-009 Command protocol / flow inventory | L2 | L4 + L3 | 10 Command逐flow验证,L4逐entry,L3补rollback / adapter失败;API smoke不可替代L2 | 10 /10均必需 |
| CUT-SBX-010 Query protocol / no-write inventory | L2 | L4 + L3 write-audit | 13 Query逐flow与0 write,L4验证surface,L3提供可观测写集 | 13 /13均必需 |
| CUT-SBX-011 Consumer protocol / dedup inventory | L2 | L4 worker + L3 | 9 Consumer逐编排、receipt / quarantine和adapter failure;不得用bus smoke抽样 | 9 /9均必需 |
| CUT-SBX-012 Outbound Event / relay inventory | L1 | L3 + L4 worker | payload schema先定;stored payload / publisher race和13 event surface再补强 | 13 /13均必需 |
| CUT-SBX-013 Operations Job / report inventory | L2 | L4 runner + L3 | 10 Job逐编排 / report / replay;runner验证entry,L3验证partial / persistence | 10 /10均必需 |
| CUT-SBX-014 intake / identity / reference states | L1 | L2 | 3 enum逐合法 /非法迁移;service验证终态不重开 | 失败阻断P0-C |
| CUT-SBX-015 boundary / capability / handle / lease states | L1 | L2 + L3 | 6 enum与guard先测;adapter race补强;不得以真实backend单次run替代状态闭集 | 失败阻断P0-C |
| CUT-SBX-016 policy / high-risk states | L1 | L2 | 3 enum fail-closed及解除来源;service不得猜测状态 | 失败阻断P0-C |
| CUT-SBX-017 run / capture / handoff states | L1 | L2 + L3 | 3 enum owner分离;service / adapter failure证明no rollback | 失败阻断P0-C |
| CUT-SBX-018 failure / control / cleanup / redline states | L1 | L2 + L3 | 4 enum与优先级先测;simulation / adapter补guard side effect | 失败阻断P0-C |
| CUT-SBX-019 query / projection / derived / reconciliation states | L1 | L2 + L3 write-audit | 4 enum owner分离;query / job不得写core truth | 失败阻断P0-C |
| CUT-SBX-020 relay states | L1 | L3 + L4 worker | terminal规则先测;repository version race和worker disposition补强 | 失败阻断P0-C |
| CUT-SBX-021 idempotency / replay / entry-job / adapter states | L1 | L2 + L3 + L4 | 6 enum、stored replay、availability和entry surface共同闭合 | 失败阻断P0-C |

### 8.2 P0-C横切与基础设施切口

| 测试切口 | 主发现层 | 强制补强层 | 层级责任 /禁止替代 | P0传播 |
|---|---|---|---|---|
| CUT-SBX-022 UoW ordering / atomic visibility | L2 | L3 | L2逐staged failure检查顺序;L3验证commit / rollback / unknown parity | 失败阻断P0-C |
| CUT-SBX-023 version / cursor / selector invariants | L1 | L3 + L4 query | typed distinction先测;repository order / conflict和query surface补强 | 失败阻断P0-C |
| CUT-SBX-024 idempotency / stored replay | L2 | L3 + L4 | Command / Consumer / Job三channel都需same / conflict / missing;entry不得重算 | 失败阻断P0-C |
| CUT-SBX-025 concurrency / single-winner races | L3 | L2 | deterministic race harness验证10类race;L2验证loser surface和无半状态 | 失败阻断P0-C |
| CUT-SBX-026 error / recovery closed set | L1 | L2 + L3 + L4 | 38错误先做typed mapping,再逐producer / failure injection / safe surface;不能只比字符串 | 38 /38均需去向 |
| CUT-SBX-027 config source / parser / item validation | L1 | L3 builder | S00~S08、I001~I101、unknown / alias / range先测;builder证明invalid发布0 | 失败阻断P0-C |
| CUT-SBX-028 config composition / atomic generation | L1 | L3 builder + L4 entry | NCFG / FC / XVAL先测;complete set、publication和current-unit ceiling补强 | 失败阻断P0-C |
| CUT-SBX-029 sensitive material / carrier boundary | L1 | L3 + L4 + L6 scan | taxonomy / redaction先测;adapter / entry实际carrier和最终汇总扫描补强;L6扫描不替代L1 | 发现raw leak即否决P0 |
| CUT-SBX-030 config change / rollback / drift honesty | L1 | L2 + L3 simulation | record / transition规则、完整candidate编排和TOCTOU / rollback simulation;不证明物理fleet | 失败阻断P0-C |
| CUT-SBX-031 entry / runtime builder / scoped isolation | L3 | L4 | builder complete registry / generation先验证;API / worker / job current-unit entry补强 | 失败阻断P0-C |
| CUT-SBX-032 observability / formal audit / redaction | L1 | L2 + L3 + L4 + L6 | safe schema、same-UoW formal audit、sink failure、entry carrier和最终scan逐层闭合 | audit缺失或raw leak否决P0 |
| CUT-SBX-033 dependency boundary / unsupported surface | L1 static | L3 builder + L4 negative + L6 summary | manifest / protocol / config absence可重复检查;不得只作人工review | 失败阻断P0-C |

### 8.3 P0-Q、P1与P2切口

| 测试切口 | 主发现层 | 强制补强层 | 层级责任 /禁止替代 | 传播 |
|---|---|---|---|---|
| CUT-SBX-034 real coherent-boundary conformance | L5 | L6 identity summary | 按candidate + capability + four-dimension template + environment验证真实施加;L1~L4只提供前置契约 | failed / blocked / not run阻断P0-Q |
| CUT-SBX-035 real lifecycle / capture / cleanup / redline conformance | L5 | L6 identity summary | bounded workload、timeout / kill、capture / inspect、lease / orphan、guarded release与containment必须操作受控真实资源 | failed / blocked / not run阻断P0-Q |
| CUT-SBX-036 qualification integrity / no weak fallback | L5 | L6 veto summary | profile / generation / backend / environment / material identity固定;host / fake / fixture fallback立即失败 | failed / blocked / identity mismatch阻断P0-Q |
| CUT-SBX-037 durable / real-like / physical operations parity | L3 controlled / real-like | L6 selected-run | PROFILE-06资格后验证durable / bus / handoff / rollout;不补偿P0 | P1失败保留风险,不得写P0 pass来源 |
| CUT-SBX-038 production / peripheral design-reopen trigger | L1 static design gate | L6 scope review | 只检查current surface absence与重开触发;当前不创建production happy path | P2 inactive;要求执行即先回写设计 |

映射审计结果: CUT-SBX-001~038均恰有一个主发现层;CUT-001~036均有明确P0传播。L5只承接CUT-034~036,没有把普通service / adapter缺陷堆入真实环境。

---

## 9. 横向风险与协议分层

### 9.1 高风险断言最早发现层

| 高风险断言 | 最早发现层 | 必须补强 | 不得只依赖 | 原因 |
|---|---|---|---|---|
| typed ref / cursor / version混同被接受 | L1 | L4 entry | E2E response | 类型和validator可确定性定位 |
| 非法状态迁移或同名Failed跨owner | L1 | L2 | backend run | 与真实产品无关,必须穷举正式enum |
| accepted Command漏truth / audit / relay / stored result | L2 | L3 rollback | API 2xx | 必须观察同一UoW staged set |
| Query refresh / rebuild / repair | L2 | L3 write-audit | 返回值正确 | “无写”只能通过写集证明 |
| duplicate从current truth重算 | L2 | L3 stored surface + L4 | 重试后相同响应 | 相同响应不证明使用stored result |
| Consumer绕过Command或错误ack | L2 | L4 worker + L3 | bus送达成功 | 需要观察receipt、quarantine和truth写集 |
| Job修复core truth或污染batch | L2 | L4 runner + L3 | report success | 需区分per-item UoW、report和truth owner |
| publisher / handoff failure回滚source | L3 | L2 owner assertion | 跨仓E2E | 必须确定性注入delivery failure |
| mixed generation / partial facade可见 | L3 builder | L4 all entries | config review | 需要观察publication与entry snapshot |
| raw material进入任何carrier | L1 | L3 / L4 actual carrier + L6 scan | 人工抽查 | 规则与真实输出都必须自动可判定 |
| 四维限制仅部分生效 | L5 | L6 identity / veto | fake / seam / config matrix | 只有真实candidate可证明内核 /平台行为 |
| cleanup绕guard或redline变advisory | L1 + L2 | L5真实lifecycle | simulation结果 | 规则与真实副作用都不可缺 |
| host / fake fallback伪装candidate | L5 | L6 identity summary | profile名称 | 必须绑定实际backend / environment identity |

### 9.2 五类协议的跨层责任

| 协议族 | 数量 | L1契约 | L2编排 | L3集成 | L4入口 | L5 / L6角色 |
|---|---:|---|---|---|---|---|
| Command | 10 | DTO / metadata / error | 10 /10 flow、UoW、replay | repository / adapter failure | 10 /10 handler | 适用launch命令作为L5 driver;L6仅最小样本 |
| Query | 13 | view / cursor / status | 13 /13 no-write / surface | write-audit / repository order | 13 /13 handler | L5只读inspect适用面;L6不替代全量 |
| Consumer | 9 | envelope / receipt | 9 /9 dedup / authority | resolver / store / publisher failure | 9 /9 worker disposition | L5只消费适用lifecycle signal;L6抽最小链 |
| Outbound Event | 13 | payload / event kind | committed source选择 | relay store / publisher race | 13 /13 worker serialization | L6检查最小事实链,不要求相邻仓内部通过 |
| Operations Job | 10 | input / report / status | 10 /10 partial / replay / no-repair | per-item UoW / adapter / report store | 10 /10 runner | L5使用适用inspect / release路径;L6只汇总 |
| 合计 | 55 | 全量 | 全量 | 按风险补强 | 55 /55 | 无协议仅靠E2E |

### 9.3 PROFILE-01~07到层级与证明上限

| Profile | 主要层级 | 必须证明 | 明确不证明 | 当前执行成熟度 |
|---|---|---|---|---|
| PROFILE-01 `local-contract` | L1 + local L4 smoke | load / validate / builder与entry wiring | 真实workload、正式P0证据或资格 | designed;未声明实现 |
| PROFILE-02 `ci-contract` | L1~L4 P0-C主层 | deterministic contract / service / fake parity / negative config | real dependency或backend安全 | designed;未声明CI存在 |
| PROFILE-03 `integration-seam` | L3 + L4 | controlled resolver / event / handoff / sink mapping | coherent boundary或真实workload | designed;未声明integration通过 |
| PROFILE-04 `operations-simulation` | L1~L4 safety / replay | guard、no-release、no-repair、report与failure injection | 真实cleanup / containment / release | designed;未声明operations evidence |
| PROFILE-05 `backend-conformance` | L5 + L6资格汇总 | CUT-034~036真实隔离、lifecycle和identity | PROFILE-06 readiness、production或跨backend资格 | conditionally defined;当前blocked |
| PROFILE-06 `staging-like` | L3 real-like + L6 selected-run | durable parity、dependency outage、物理rollout / drift / rollback | 自动继承P05或production资格 | conditional;当前unqualified |
| PROFILE-07 `production-like` | future L5 / L6 +专项层 | 未来capacity / security / disaster与approved组合 | 当前ready、active、tested或accepted | inactive;设计重开前不执行 |

Profile传播红线:

- PROFILE-02通过不推出PROFILE-03 / 04 / 05;PROFILE-03 seam通过不推出真实boundary;PROFILE-04 simulation通过不推出真实cleanup。
- PROFILE-05资格只对同一candidate backend、capability、boundary template、config generation、environment和适用material有效。
- PROFILE-06必须显式消费有效PROFILE-05资格并独立证明durable / real-like组合;PROFILE-07不得由任一前序profile自动激活。

### 9.4 E2E / Release Gate使用边界

| 场景 | 是否进入L6 | 进入目的 | L6不得承担 |
|---|---|---|---|
| context -> boundary / policy -> run -> capture / handoff -> query最小闭环 | 是 | 证明跨入口可组合且身份连续 | 不替代10 Command /13 Query全量case |
| Consumer -> truth / marker -> relay最小闭环 | 是 | 证明worker和stored event可组合 | 不测试相邻仓内部状态机 |
| Operations Job -> report最小闭环 | 是 | 证明runner、per-item结果和report可消费 | 不替代10 Job no-repair / partial矩阵 |
| PROFILE-05资格包汇总 | 是,当前blocked | 检查backend / capability / template / generation / environment / result identity | 不执行或重解释L5断言 |
| redaction / dependency / veto汇总扫描 | 是 | 检查实际输出与静态结果完整 | 不替代L1规则或L3 / L4 carrier检查 |
| full cross-repo real-like E2E | P1条件进入 | 验证PROFILE-06组合差异 | 不作为P0-C或P0-Q替代 |
| production capacity / hard SLO / DR | 当前否 | PROFILE-07重开后再设计 | 无正式阈值时不得判pass / fail |

---

## 10. 分层覆盖与反替代审计

| 审计项 | 结论 | 缺口 /后续 |
|---|---|---|
| CUT-SBX-001~038是否全量映射 | 38 /38有唯一主层和补强责任 | 无孤儿 |
| P0-C CUT-001~033是否覆盖L1~L4 | 是;纯规则前置L1,编排L2,边界L3,入口L4 | Step 5 /6继续映射场景和case |
| P0-Q CUT-034~036是否独立L5 | 是;未与fake integration或E2E合并 | 执行前置仍blocked |
| 55协议是否只靠协议族抽样 | 否;L2 / L4均要求55 /55,L3按风险补强 | 无 |
| 30 owner-level state machines /31 Step 10 enum entries是否推到E2E | 否;L1主发现,L2 / L3补owner传播 | 无 |
| UoW /幂等 /race是否可精确定位 | 是;L2 / L3承担,不依赖final response | write-audit实现留Step 9 |
| config 101 item /40组 /44域是否有层级 | L1 validator、L3 builder、L4 scoped entry、L6汇总 | 字段级覆盖索引留Step 5 /6 |
| TSH-01~20 / FDT-01~30是否有策略入口 | 是;parser / state / carrier / builder / seam / conformance按L1~L6分层 | 仍非case / suite /结果 |
| VF / VETO是否可被risk acceptance绕过 | 否;命中P0层失败或identity缺失即阻断 | 新版`06`后续裁决 |
| 是否把高风险全部推给E2E | 否;L6无新增领域断言权 | 无 |
| 是否让fake / seam / simulation替代真实隔离 | 否;只有L5可证明CUT-034~036 | P0-Q blocker开放 |
| tools / runtime / member生命周期是否混入 | 否;只在L3 /L4测试body-free接缝 | 无范围膨胀 |
| 是否创建TC / suite / environment / evidence事实 | 否 | phase boundary保持 |

跨层审计结论: 全部36个P0切口均有可执行的最早发现层和明确阻断传播,没有P0风险只挂在L6,也没有用P1 / P2或较低profile补偿P0失败。允许完成Step 4设计停审。

---

## 11. 对上游设计的影响判定

| 分层结论 | 是否影响上游 | 回写位置 | 处理状态 |
|---|---:|---|---|
| 六层模型可承接正式对象、协议、状态、事务、错误和配置契约 | 否 | 不适用 | 无当前回写 |
| L5 dedicated conformance单列为P0-Q | 否 | 不适用 | 承接Step 2 /3既有真实隔离硬门禁 |
| PROFILE-05测试P0-Q与配置P1并存 | 否 | 不适用 | 分类轴不同,不改变正式`04`成熟度 |
| Query no-write / Job no-repair需要write-audit | 否 | Step 9自动化设计 | 属于测试工具要求,不是上游协议缺口 |
| CUT-034~036需要candidate / capability / lab | 否 | Step 8~10、`07/09` | 保留执行blocker,不影响Step 5追溯设计 |
| 后续发现某CUT无法在指定层观察正式副作用 | 条件性是 | 对应`03/04`契约章节 | 触发`SBX-TEST-DESIGN-REOPEN-001`,先回写上游 |

当前没有阻塞Step 5设计的上游blocker。真实产品、环境、suite与evidence未形成,只阻塞后续执行和资格声明。

---

## 12. 正式`05` §4回填草稿

> 校准来源: `design-calibration/05_test_plan_step_04_strategy_layers.md`
>
> 延伸阅读: 建议继续阅读本文件§7六层模型、§8逐CUT映射、§9高风险 /协议 /profile分层和§10反替代审计。

正式§4应回填:

1. 测试按风险最早发现位置分为L1 Contract / Unit / Static、L2 Application Service / Orchestration、L3 Repository / Adapter / Runtime Builder Integration、L4 API / Worker / Job Entry、L5 Dedicated Backend Conformance和L6 E2E / Release Gate / Qualification Summary。
2. L1~L4共同证明P0-C:局部契约、flow / UoW、repository / adapter parity和55个协议入口分别在其owner层失败,不得全部推给E2E。
3. L5独立证明P0-Q:只有绑定candidate backend、capability matrix、coherent boundary template和dedicated environment的真实conformance才能证明四维边界、lifecycle与no weak fallback。
4. L6只验证最小跨入口闭环、identity连续性和redaction / dependency / veto /资格结果汇总,不得新增领域结论或覆盖下层failed / blocked / not run。
5. PROFILE-01~04分别承担local contract、CI contract、controlled seam和operations simulation;都不得证明真实backend。PROFILE-05承载P0-Q,PROFILE-06是P1 real-like组合,PROFILE-07当前inactive。
6. P0-C与P0-Q均为核心通过必要门禁。P1 / P2或较低profile通过不能补偿P0失败,缺真实前置时只能诚实标blocked。

---

## 13. 待确认事项

| 待确认事项 | 当前状态 | 是否阻塞Step 5 | 后续处理 |
|---|---|---:|---|
| repository / UoW write-audit与race harness载体 | open_for_automation_design | 否 | Step 7定义数据观察需求,Step 9定义suite /工具契约 |
| candidate backend与capability matrix | open_for_p0q_execution | 否 | Step 8环境要求、`07/09`真实绑定 |
| dedicated conformance与destructive safety lab是否分区 | open_for_environment_design | 否 | Step 8 /10按风险和材料保护收口 |
| L6最小闭环的最终case组合 | open_for_case_design | 否 | Step 5先建追溯,Step 6逐切口设计case |
| PROFILE-06 durable产品与selected-run | open_for_p1_execution | 否 | Step 8~10、`07/09`后置关闭 |
| 真实阻断触发器、命令与artifact路径 | not_defined_yet | 否 | Step 9定义,当前不伪造 |

---

## 14. 进入下一步条件

| 条件 | 结果 | 说明 |
|---|---|---|
| 已输出测试分层图和策略表 | 通过 | 六层风险发现模型完整 |
| CUT-SBX-001~038均有唯一主发现层 | 通过 | 38 /38全量映射 |
| P0切口均有明确阻断传播 | 通过 | CUT-001~036全部覆盖 |
| 55个协议未被E2E抽样替代 | 通过 | L2 / L4要求55 /55,L3按风险补强 |
| P0-Q与fake / seam / simulation分离 | 通过 | CUT-034~036仅由L5证明 |
| profile证明上限与资格传播明确 | 通过 | PROFILE-01~07均有层级与禁止升格 |
| 高风险未全部堆到L6 | 通过 | 状态 /事务 /幂等 /安全前置L1~L5 |
| 当前上游影响已判定 | 通过 | 无当前待回写项 |
| 正式`05`及测试 /实施事实未创建 | 通过 | 无TC / suite / environment / EV / run / implementation artifact |
| 可进入Step 5 | `passed_to_step_5` | 用户已审查确认;Step 5已据此完成 |

```text
current_document = `05-测试方案.md`
current_step = Step 4 `制定测试策略与分层`
gate_status = passed_to_step_5
next_allowed_action = 已传递至Step 5;后续恢复读取`05_test_plan_step_05_traceability_coverage.md`
formal_document_write = not_started_historical_file_untouched
real_test_execution = not_started
real_evidence_created = no
implementation_ledger_created = no
planned_boundary_skeleton_created = no
commit_required = no
```
