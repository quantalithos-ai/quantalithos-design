# Step 12. 定义测试、验收、实施与运维承接

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 12
> 书写规范: `standards/document/配置设计书写规范.md` §5.12
> 回填章节: `04-配置设计.md` §12 测试、验收、实施与运维承接
> 生成日期: 2026-07-12
> 状态: reviewed_passed_to_step_13
> 所属流程: `04_config_calibration_flow.md`
> 本 Step 口径: 本步承接Step 6的ENV-01~07 / PROFILE-01~07、Step 7的I001~I101 / 40配置组 / D01~D44、Step 8的SEC-01~18与S04生命周期、Step 9的FZ / LD / CFG-VAL / XVAL、Step 10的CCA / CRL / CCT / CCS / CAP / CRB / CDR、Step 11的FDP / FDS / CFM / ALC / RCV / FDT和正式`03`测试 /实施承接,定义`05/06/07/09`责任分工。本步只定义未来验证、裁决、实施和运行的输入契约,不得伪造真实test case ID、evidence alias、run_id、报告路径、验收签署、实现commit、implementation ledger、planned boundary skeleton、部署命令、真实配置值或产品资格。

---

## 1. Step开工确认与状态

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入Step 12 | 是。用户审查Step 11后回复“同意”,本次只放行Step 12。 |
| 项目级台账是否允许进入Step 12 | 是。恢复点为Step 11 `pass_wait_review`,且用户已明确确认。 |
| 文档级flow是否允许进入Step 12 | 是。Step 11已闭合失效、降级、safe signal、恢复和测试切口。 |
| 是否读取Step 12 SOP /书写规范 | 是。必须输出`04 -> 05/06/07/09`下游承接表,且不得代写完整用例或部署命令。 |
| 是否读取测试 /验收 /实施 /运维规范 | 是。已固定“05提供验证方案与未来证据、06裁决、07规划boundary、09承载运行态执行”的责任分层。 |
| 是否读取Step 6 / 7 / 11必需输入 | 是。并为防止失真补读Step 8 / 9 / 10和正式`03` §15~§17。 |
| 是否参考L1项目粒度 | 是。参考L1-governance / L1-artifact Step 12结构,但不继承其GRC、artifact、digest、topic或profile语义。 |
| 当前状态 | 已完成并通过语义一致性与机械门禁;用户已确认并放行Step 13 |
| 输出文件 | `projects/L4-sandbox/design-calibration/04_config_step_12_downstream_handoff.md` |
| 正式文档状态 | `projects/L4-sandbox/04-配置设计.md`仍不存在;只允许Step 15装配 |
| 停审方式 | 本Step完成后暂停;用户确认前不得进入Step 13 |
| 是否发现阻塞本Step的上游blocker | 否。正式`05/06`仍为旧材料、`07/09`缺失、目标实现仓 / provider / rollout carrier / P05+资格未闭合,但本Step可把它们作为明确下游责任和激活门禁,不伪造已完成事实。 |

---

## 2. 本步目标与非范围

本Step把前11步形成的配置真相源转换为下游可消费的责任包。目标不是重复配置设计,而是让后续文档知道“必须验证什么、按什么判定、实现时交付什么、运行时准备什么”,并在下游发现冲突时回到正确真相源。

本Step必须回答:

- ENV-01~07和PROFILE-01~07分别进入哪些测试环境、资格门禁、实施准备和运维前置。
- I001~I101、40配置组、D01~D44如何完整进入测试 /验收 /实施 /运维,不得形成孤儿配置。
- SEC、CFG-VAL、XVAL、CCS / rollback / drift、CFM / FDT如何转成测试主题和验收否决方向。
- `05`未来如何设计用例与证据,但为何本Step不能给出真实TC / EV alias、run_id或通过结果。
- `06`未来如何把证据需求转成acceptance gate / veto,但为何本Step不能签署或风险接受。
- `07`未来必须规划哪些配置实现任务族、precheck和boundary closure,以及何时才创建implementation ledger与全部planned boundary skeleton。
- `09`未来必须选择哪些产品、路径、权限、阈值、命令、告警和runbook,同时不得改写`04`契约。
- 哪些开放项只是不阻塞P0的downstream gap,哪些在PROFILE-05~07激活或实现boundary到达时转为blocker。

本Step不定义:

- 完整测试用例步骤、测试数据、fixture body、测试代码、真实脚本路径、真实证据文件或测试结果。
- AC / VETO最终编号、evidence alias绑定、风险接受、验收签署或release decision。
- `07` phase、commit boundary、commit message、文件allowlist、实现顺序、implementation ledger或boundary skeleton。
- 目标实现仓代码、Cargo依赖修改、adapter产品实现或任何commit。
- 部署拓扑、真实config路径 /值、env值、secret provider、endpoint、topic、principal、命令、阈值、pager和runbook步骤。
- 配置迁移 /废弃 /版本演进;该主题只在用户确认后进入Step 13。

---

## 3. 本步输入

| 输入 | 状态 | 本Step用途 |
|---|---|---|
| `04_config_step_06_environment_profiles_matrix.md` | reviewed | 提供ENV-01~07、PROFILE-01~07、真实workload资格和profile测试 /验收 /实施方向 |
| `04_config_step_07_config_items.md` | reviewed | 提供I001~I101、40配置组、D01~D44、严格JSON demo、S05 / S06和P0 registry |
| `04_config_step_08_sensitive_secrets.md` | reviewed | 提供40 sensitive、23 material-capable slot、S04、SEC-01~18和provider资格缺口 |
| `04_config_step_09_loading_validation_activation.md` | reviewed | 提供FZ-01~06、LD-01~30、CFG-VAL-01~25、XVAL-01~36和atomic publication |
| `04_config_step_10_change_audit_rollback.md` | reviewed | 提供CCA-01~07、CRL-01~04、CCT-01~18、CCS-01~14、CAP-01~17、CRB-01~12、CDR-01~08 |
| `04_config_step_11_failure_degradation.md` | reviewed_passed_to_step_12 | 提供FDP-01~10、FDS-01~10、CFM-01~46、ALC-01~06、RCV-01~15、FDT-01~30 |
| `projects/L4-sandbox/03-详细设计.md` §15~§17 | current formal baseline | 提供正式测试切口、脚本候选、实施承接、precheck、风险和no-fabrication边界 |
| `standards/document/测试方案书写规范.md` / SOP | current standard | 规定`05`必须可执行、可追溯、可留证,但测试方案不是测试报告 |
| `standards/document/验收标准书写规范.md` / SOP | current standard | 规定`06`消费证据做门禁 / veto裁决,不得以测试计划替代证据 |
| `standards/document/实施计划书写规范.md` / SOP | current standard | 规定`07`形成phase / commit boundary、阅读门禁和实现闭包 |
| `standards/document/代码实施台账与门禁规范.md` | current standard | 规定正式`07`完成时同步创建implementation ledger和全部planned boundary skeleton |
| `standards/document/部署与运维手册书写规范.md` | current standard | 规定`09`承载运行态路径、命令、检查、回滚、告警、安全和审计记录 |
| 旧`projects/L4-sandbox/05-测试方案.md` / `06-验收标准.md` | historical_material_audited_contained | 已在本Step独立结论形成后完成差异审计;不得继承旧对象、host runtime或旧环境为当前事实 |
| `projects/L4-sandbox/07-实施计划.md` / `09-部署与运维手册.md` | missing | 本Step仅定义未来输入;不得提前创建 |

---

## 4. SOP问题回答

| SOP问题 | 本Step回答 |
|---|---|
| 哪些配置场景进入测试方案 | 全部profile资格、101项schema / source / scope、NCFG、SEC、CFG-VAL、XVAL、generation atomicity、scoped snapshot、change review / TOCTOU、rollback / drift、post-publication fail-closed / degraded / delayed / failed、redaction和dependency-cut均进入`05`。FDT-01~30是最低失败切口,不是完整用例。 |
| 哪些配置门禁进入验收标准 | invalid candidate零发布、invalid winner不fallback、四维boundary整体成立、policy / audit / cleanup / redline / redaction不可降级、secret零泄露、required material / adapter失败阻断、partial generation不可见、query no-write、job no-repair、relay / handoff no-rollback、rollback / drift状态诚实、unsupported能力不伪装P0均进入`06` gate / veto候选。 |
| 哪些配置准备进入实施计划 | raw owner与strict parser、source selection / merge、profile / registry、ordinary / cross / secure validation、S04 adapter-local resolve、runtime builder / complete generation publication、S05 / S06 scoped validator、availability / failure mapper、safe signal hook、deterministic fake parity、测试 /报告脚本候选和目标仓 / `core-contracts` precheck进入`07`任务输入。具体phase / boundary由正式`07`定义。 |
| 哪些部署细节留给部署与运维手册 | config artifact路径 /权限 /发布、profile选择、S03注入、S04产品与principal、startup / restart、rollout scope、desired / observed carrier、rollback与drift处置、provider lease / revoke、alert阈值 /聚合 /pager、cleanup / reaper cadence、产品endpoint / route / store / scheduler、evidence retention和P05+运行资格均留`09`。 |
| 下游不应重复定义哪些配置契约 | 不得改写I001~I101 schema / default / source / scope、PROFILE语义、S01~S08优先级、S04边界、NCFG / XVAL / CFG-VAL、FZ / LD、CCT / CCS / CAP / CDR、FDP / CFM / RCV、hard guard、truth ownership和unsupported清单。需要变更时必须重开`04`,若影响port / DTO / flow / state则先回写`03`。 |

---

## 5. 当前文档问题诊断

| 位置 | Step 12前问题 | 本Step处理 |
|---|---|---|
| Step 6 profile handoff | 已给方向,但尚无下游责任、资格证据成熟度和激活blocker转换 | 建立逐PROFILE handoff与activation gate |
| Step 7 101项 / 40组 | 配置项可落码,但下游可能只抽样测试或遗漏运维owner | 建立40组到`05/06/07/09`完整回指 |
| Step 8 sensitive / S04 | provider-neutral语义完整,但产品资格与平台anti-leak尚未分发 | 分给`05/06/07/09`,并保持P05+前置blocker |
| Step 9 load / activation | 有25类issue与30阶段,但下游可能只测parse而漏atomic publication | 将ordinary / secure / build / publication分层交付 |
| Step 10 change / rollback / drift | ops-private carrier未选择,容易被`07/09`误写成runtime mutation API | 固定产品中立语义,carrier由`07/09`选择且不得扩public contract |
| Step 11 failure / alert | 有logical alert和test cuts,但无证据生产 /消费责任 | 定义planned evidence requirement,不生成alias /结果 |
| 旧`05/06` | 仍是旧文档链,可能含host runtime、旧对象和旧环境 | 后置差异审计并继续标historical material |
| `07/09` | 当前缺失 | 只给输入契约,不提前创建或写实现 /运维正文 |

---

## 6. 改动前后对比

| 维度 | Step 12前 | Step 12后 |
|---|---|---|
| downstream ownership | 各Step有零散方向 | `05验证 -> 06裁决 -> 07实施规划 -> 09运行执行`责任链唯一 |
| coverage | profile / item / failure分别描述 | 7 profile、40组 / 101项、11控制面和关键ID集合可反查 |
| evidence | 只有test cut与candidate方向 | 定义planned requirement、producer、consumer和禁止伪造字段 |
| implementation | `03`有总体清单,`04`无配置任务分发 | 给出配置任务族、design source、completion contract和precheck,但不拆commit |
| operations | provider / carrier /阈值散落为gap | 汇总为`09`责任、激活时机和不得改变的安全边界 |
| conflict handling | 下游可能局部修口径 | 固定发现冲突先回`04/03`,不得由`05/06/07/09`自造契约 |

---

## 7. 配置设计取舍

| 议题 | 候选 | 结论与理由 |
|---|---|---|
| 是否现在改写正式`05/06` | A. 同步改写;B. 只形成`04` handoff | 采用B。当前只获准Step 12,跨正式文档会跳过各自SOP。 |
| 是否现在创建`07/09` | A. 提前创建;B. 只定义输入 | 采用B。`07/09`必须由各自流程创建。 |
| 是否现在创建implementation ledger / boundaries | A. 创建空壳;B. 等正式`07`完成时一次创建 | 采用B。标准要求与`07` Boundary Gate Matrix同步,当前尚无合法boundary集合。 |
| 是否给未来证据分配EV alias / run_id | A. 先占位;B. 只给requirement ID | 采用B。alias / run_id代表具体证据身份,当前只能定义planned requirement。 |
| 是否把FDT直接当完整test case | A. 直接作为用例;B. 作为`05`最低测试切口 | 采用B。`05`还需前置、输入、断言、环境、自动化和证据schema。 |
| 验收是否直接引用设计表作为通过证据 | A. 可以;B. 不可以 | 采用B。设计只定义规则,运行证据必须由后续suite / gate产生。 |
| `07`是否可顺手选provider / rollout产品 | A. 实现者自行选择;B. 需按blocker / ADR /运维资格闭合 | 采用B。选型不能绕过S04、safe carrier、profile资格和`03`回写门禁。 |
| `09`是否可用runbook放宽hard guard | A. emergency override;B. 绝不放宽 | 采用B。运维动作只能恢复依赖或创建新request,不得改写policy、boundary、audit、cleanup、redline和redaction。 |

---

## 8. Step内执行记录

| 序号 | 动作 | 状态 | 产物 /门禁 |
|---:|---|---|---|
| 1 | 恢复项目台账、flow和Step 11 | done | 确认用户只放行Step 12 |
| 2 | 读取Step 12 SOP、书写规范和四类下游规范 | done | 固定责任边界与no-fabrication规则 |
| 3 | 读取Step 6~11和正式`03`下游承接 | done | 固定profile、item、secure、load、change、failure全集 |
| 4 | 定义handoff ID、责任模型和证据成熟度 | done | §9.1~§9.3;DSH / evidence maturity /总承接表闭合 |
| 5 | 完成`05/06/07/09`详细承接 | done | §9.4~§9.7;TSH / AHG / EHR / IMH闭合 |
| 6 | 完成profile /控制面 / 40配置组回指 | done | §9.8~§9.11;OPH、PROFILE、SBX-CP、I001~I101和D01~D44闭合 |
| 7 | 完成证据、blocker、禁止重定义和停审 | done | §9.12~§9.15;owner、转阻塞时机和no-fabrication闭合 |
| 8 | 完成historical audit、`03`影响和回填草稿 | done | §9.14 / §9.16~§11;旧`05/06`保持historical material,当前无`03`回写项 |
| 9 | 机械校验、状态同步并停审 | done | 表结构、编号、profile /控制面 / 40组 / 101项 / 44域、引用、secret和提前产物门禁通过;未创建Step 13、正式`04`或实现类文件 |

---

## 9. 结构化中间产物

### 9.1 下游责任模型

| Handoff ID / 下游 | 唯一职责 | 从`04`消费 | 必须产出 | 不得产出 /改写 |
|---|---|---|---|---|
| DSH-01 `05-测试方案.md` | 把配置契约转成可执行、可追溯、可留证的测试方案 | profile、item、validation、activation、failure、test cut、风险 | 测试对象 /场景 /用例 /环境 /数据 /门禁 /证据schema /残余风险 | 不重定义配置schema、状态、失败策略;不声明测试已执行 |
| DSH-02 `06-验收标准.md` | 消费设计与`05`未来证据做pass / fail / veto裁决 | hard gate、veto候选、planned evidence requirement、开放风险 | AC / VF / VETO、证据绑定规则、裁决状态与风险接受流程 | 不把设计表当证据;不伪造签署 / alias / run_id |
| DSH-03 `07-实施计划.md` | 把`03/04/05/06`拆成依赖闭合phase / commit boundary | config task family、precheck、test / acceptance gate、blocker | phase、boundary、allowed / forbidden scope、required checks,并同步创建implementation ledger和全部planned skeleton | 不在当前Step提前创建;不由实现者补设计schema / port / state |
| DSH-04 `09-部署与运维手册.md` | 把已实现、已选型、已验收能力转成运行态执行文档 | source / profile / material / rollout / failure / alert / recovery边界 | 路径、权限、命令、阈值、产品binding、runbook、rollback、巡检、证据归档 | 不放宽hard guard;不定义新config item / runtime API / truth ownership |

责任链固定如下:

```text
04 configuration truth
  -> 05 verification plan + future evidence production contract
  -> 06 acceptance decision contract
  -> 07 implementation boundaries + required checks
  -> implementation / test execution produces real evidence
  -> 06 consumes fixed evidence identities and decides
  -> 09 operates only an implemented and qualified baseline
```

当前尚未发生“implementation / test execution produces real evidence”及其后的任何事实。本图表达责任顺序,不代表正式文档完成顺序之外的自动授权。

### 9.2 证据成熟度与命名规则

为避免伪造真实证据,本Step只使用`EHR-xx`表示`Evidence Handoff Requirement`,它不是`EV-*` evidence alias,也不是artifact / report ID。

| 成熟度 | 含义 | 本Step允许 | 本Step禁止 |
|---|---|---|---|
| `planned_requirement` | 后续必须证明的命题 | EHR ID、证明目标、未来producer / consumer、禁止伪证据说明 | EV alias、run_id、文件路径、digest、pass结果 |
| `designed_evidence_schema` | `05/06`未来定义证据字段和绑定规则 | 本Step只要求后续形成 | 声称schema已经存在 |
| `generated_evidence` | 实现仓gate / test runner真实生成 | 当前不存在 | 任意占位artifact / report |
| `reviewed_evidence` | 证据被人工 / Agent审查且来源固定 | 当前不存在 | 用设计表替代审查 |
| `accepted_evidence` | `06`按门禁完成裁决 | 当前不存在 | 验收签署、风险接受或release批准 |

跨文档规则:

- `05`必须把EHR展开为测试切口、case、环境、断言和evidence schema,但只有真实执行后才产生固定EV alias / run_id。
- `06`可把EHR绑定为required evidence class,但不得在真实alias形成前写`pass`。
- `07`必须把证据生产脚本 / suite和验收消费门禁放进适当boundary,但planned boundary不得预填pass或commit hash。
- `09`只引用已生成且经`06`允许消费的固定证据;不得使用`latest`、设计状态或old process存活替代。

### 9.3 总下游承接表

| 下游文档 | 承接内容 | 本文提供的输入 | 完成时必须反查 | 当前状态 |
|---|---|---|---|---|
| `05-测试方案.md` | 配置专项、profile / source / sensitive / generation / scoped / change / runtime failure /安全负向验证 | PROFILE-01~07、I001~I101、SEC、CFG-VAL、XVAL、CCS / CRB / CDR、CFM、FDT | 正式`03`对象 /状态 /错误 /测试切口与本文件TSH / EHR | old formal document;must full-restart later |
| `06-验收标准.md` | 配置gate、veto、证据消费、profile资格和残余风险裁决 | AHG、EHR、hard guard、unsupported、P05+ activation gaps | 正式`00` AC / VF、正式`03`状态、后续正式`05`真实证据schema | old formal document;must full-restart later |
| `07-实施计划.md` | config implementation task family、precheck、test / evidence / acceptance gate、boundary暂停条件 | IMH、40组code binding、`03` §16、开放blocker | 正式`03/04/05/06`与代码实施台账规范 | missing;not created in this Step |
| `09-部署与运维手册.md` | artifact / source / profile / S04 / rollout / rollback / drift / alert / cleanup / qualification运行细节 | OPH、ALC、RCV、CCT / CCS / CDR、profile gate | implemented baseline、真实产品binding、固定证据和验收裁决 | missing;not created in this Step |

### 9.4 `05-测试方案.md` 配置测试承接表

`TSH-xx`表示Test Strategy Handoff,只定义后续测试方案必须展开的主题。`05`必须为每项补测试层级、环境、fixture / dependency strategy、前置、输入、正式状态 /错误 /副作用断言、自动化时机、证据schema和残余风险;本表不是完整用例。

| TSH ID /测试主题 | 配置输入 | `05`必须展开的最小场景 | 必须断言 | 禁止误证 |
|---|---|---|---|---|
| TSH-01 source intent与priority | S00~S08;C01~C27;FDS-01 | no explicit source、唯一S02、S02 selector冲突、S02 unreadable、S03 allowlist、S05 / S06 lane、S07 / S08声明 | S01 < S02 < S03;高层present-invalid不fallback;unsupported source触发reject / design reopen | 用本地第二文件、process env默认或old process作为fallback成功 |
| TSH-02 strict parse与closed schema | I001~I101;CFG-VAL-01~08;CFM-01~04 | malformed JSON、comment、trailing comma、duplicate key、unknown section / field、alias、wrong top-level、secret-like field | issue只含path class / stable ID / safe reason;parse失败不进入typed snapshot | 只测happy JSON或把unknown静默忽略 |
| TSH-03 required / type / range / collection | CFG-VAL-09~14;CFM-05~07;Step 7精确类型词汇 | required缺失、wrong type / enum、min / max边界、empty / oversized / duplicate collection、ref family / registry不匹配 | global candidate发布0 handle;S05 current invocation reject;不得clamp / substring guess | 使用实现默认值掩盖required缺失或只断言error string |
| TSH-04 profile与source资格 | ENV-01~07;PROFILE-01~07;CFG-VAL-15/16;CFM-08/11/16 | P01~P04 non-executing、P05 candidate-real前置、P06 real-like前置、P07 inactive、S06进入P05+、S04进入P01~04、S07 / S08 | 每个profile只允许声明的source / adapter / workload;P05~07未满足资格不得激活 | fake / seam / simulation通过被写成backend conformance或production readiness |
| TSH-05 NCFG与安全不变量 | NCFG-01~24;CFG-VAL-07;CFM-09/14/15 | truth ownership、policy fail-closed、四维boundary、metadata / replay、query no-write、job no-repair、no-rollback、cleanup / redline / redaction、hot / overlay尝试 | 每类违规在builder前reject或相关operation fail-closed;无emergency override | 只测配置字段存在,不测其不能关闭guard |
| TSH-06 cross-field与feature composition | FC-01~06;XVAL-01~36;CFG-VAL-17/18;CFM-12~15 | feature / store / publisher / route / handoff / safety / maintenance / telemetry组合正负矩阵 | enabled composition完整;active route / target闭集;retention关系成立;hard guard不可拆分 | 单项validator通过替代跨域组合验证 |
| TSH-07 sensitive source与carrier防泄露 | 40 sensitive;SEC-01~06/14/15;CFM-10/17 | raw material出现在S02 / S03、reference-only声明slot、P01~04真实slot、full ref / material进入每类carrier、workload injection | unsafe candidate / field拒绝;log / metric / audit / receipt / report / error / artifact不含禁止内容 | 用截尾、plain hash或synthetic secret扫描冒充真实carrier覆盖 |
| TSH-08 S04 resolve、material lifecycle与明确expiry | 23 material-capable slot;SEC-07~13/16~18;CFM-18~23/45 | provider unavailable / denied / audit unavailable、class mismatch、lease renew / expiry / revoke、release failure、same-ref rotation、partial adapter build、ordinary config隐含TTL声明 | required binding阻断;valid lease只到expiry;现有hook检测revoke后stop-new-use;revoked / expired不rollback;lease不跨consumer;ordinary config只有明确material / freshness / qualification / compatibility expiry | 声称即时callback、普通配置隐含TTL、真实provider或platform anti-leak已验证 |
| TSH-09 load / freeze / validation pipeline | V01~V10;FZ-01~06;LD-01~17;CFG-VAL-01~19 | stage顺序、ordinary validation、freeze identity、S04-before-review禁止、startup / scoped / test lane隔离 | raw / merged / validated / scoped snapshot不混用;issue稳定且redacted | 通过直接构造validated object绕parse / merge / freeze |
| TSH-10 complete generation与atomic publication | LD-18~24;CFG-VAL-20~22/25;CFM-24~27 | required store / adapter constructor逐一失败、required availability失败、optional telemetry unavailable、generation identity mismatch、publication failure | LD-23 complete set后LD-24发布0或完整;invalid config永不`Degraded`;optional surface不削弱audit / redaction | 单service handle可见、mixed generation或old process存活当apply成功 |
| TSH-11 scoped entry / loop / job / test | FZ-04~06;LD-25~30;CFG-VAL-23/24;CFM-28 | S05 ceiling / registry / target / scope越界、worker loop snapshot、job selection、S06 fixture pairing / failure injection | 只拒绝current invocation / case;FZ-03和旧receipt / report不变;S05只收窄 | scoped输入写global config、clamp或修改旧formal result |
| TSH-12 change actor / review / TOCTOU | CCA-01~07;CRL-01~04;CCT-01~18;CCS-01~07;CAP-01~07;CFM-38 | risk升级、independent review、candidate revision、prevalidation、S04-after-review、scope-bound desired declaration | CRL-04无activation;candidate变化使旧approval失效;完整candidate不是patch;actor / marker均safe | 未review调用S04、拆单降risk或伪造actor身份 |
| TSH-13 apply / rollback / generation history | CCS-08~14;CAP-08~17;CRB-01~12;CFM-39~42 | apply build / publish failure、effect suspect、prior missing / revoked / incompatible、rollback child validation / build failure、rollout close | desired / observed / original / child history保留;rollback重新走validator;old process不算rollback成功 | 原record原地改写、撤销business truth或强制旧candidate |
| TSH-14 drift与observation | C26;CDR-01~08;CFM-43/44 | desired unknown / declared、active rollout pending、aligned、uncovered drift、missing observation、rollback pending、superseded | 只有同scope active execution可掩盖差异;observed不反写desired;missing observation不算aligned | 单instance marker、approval-only或failed rollout证明fleet aligned |
| TSH-15 post-publication hard dependency | CFM-29~31/33~36;FDP-04/07/09 | context unavailable、policy stale / conflicted、capability stale、consumer dependency、relay / handoff、cleanup / release / redline依赖失败 | command reject / policy fail-closed / boundary reject / delayed / quarantine / failed / blocked / contained按role区分 | availability `Degraded`被当作policy allow或force cleanup理由 |
| TSH-16 bounded degraded与maintenance | FDP-08;CFM-26/32/37;ALC-06 | projection / reference read missing / stale、maintenance partial、optional telemetry sink失效、恢复 | read / maintenance / optional telemetry可显式degraded;query零写;job不修core truth;formal audit保持 | invalid candidate、required dependency或hard guard被降级放行 |
| TSH-17 recovery与immutability | RCV-01~15 | corrected source / candidate、new invocation、new generation、formal retry / maintenance、effect suspect、rollback failed、drift recovery | 恢复只产生new unit或合法状态迁移;accepted truth / audit / receipt / report / relay / handoff / capture不改写 | retry重算stored result、复活dead-letter或删除failed history |
| TSH-18 safe signal与alert carrier | ALC-01~06;Step 11 carrier table | startup store前、本地log、metric、config validation audit、availability audit、formal marker、ops-private record | 每类carrier字段闭集;metric低基数;early failure不伪造durable audit | marker / ref / actor / instance进metric label或raw SDK body进signal |
| TSH-19 fake / controlled / durable parity | PROFILE-01~06;正式`03` §15 | in-memory UoW、rollback、version / unique、stored replay、page order、controlled seam failure、candidate backend conformance、durable-like parity | fake保持transaction / error / no-write / redaction parity;seam不证明boundary;P05证据独立 | fake test替代real backend或durable qualification |
| TSH-20 dependency裁剪与产品中立 | 正式`03` §13/§16;全局依赖裁剪规则 | `core-contracts` compile dependency、其他runtime / event / handoff fake / adapter、backend产品替换、topic-neutral route | 不新增sibling Cargo依赖;runtime / event failure映射formal surface;产品选择不改协议 | 把tools semantic execution、runtime loop、member orchestration或downstream truth拉入sandbox |

`05`必须将FDT-01~30逐项至少映射到一个可执行case,并把TSH-01~20作为覆盖主题。一个case可以覆盖多个同源ID,但不得以“集成测试覆盖”省略正式状态、错误和副作用断言。

#### 9.4.1 FDT到测试、验收与证据桥接表

| FDT | `05`主题 | `06`门禁 | 未来证据需求 | 桥接断言 |
|---|---|---|---|---|
| FDT-01 | TSH-01 | AHG-02 | EHR-03 | selector冲突在读取第二source前拒绝 |
| FDT-02 | TSH-01 | AHG-02 | EHR-03 | explicit source不可读不回退S01 / alternate path |
| FDT-03 | TSH-02 | AHG-01 | EHR-01 | malformed / duplicate / unknown / alias closed reject |
| FDT-04 | TSH-01/03 | AHG-01/02 | EHR-03 | high winner非法不fallback / clamp |
| FDT-05 | TSH-03/06 | AHG-01/05 | EHR-02/06 | global发布0,current scope独立reject |
| FDT-06 | TSH-03 | AHG-01 | EHR-02 | ref / registry不猜family或任意provider |
| FDT-07 | TSH-01/04/20 | AHG-18 | EHR-19 | unsupported source / reload / LKG无current surface |
| FDT-08 | TSH-05 | AHG-04 | EHR-05 | 每类NCFG override在builder前拒绝 |
| FDT-09 | TSH-07/18 | AHG-06/16 | EHR-07/17 | ordinary source与所有carrier零泄露 |
| FDT-10 | TSH-04/19 | AHG-03/19 | EHR-04/20 | fixture / fake / incomplete real-like不能取得P05+资格 |
| FDT-11 | TSH-06 | AHG-05 | EHR-06 | XVAL-01~36产生精确blocked / fail-closed disposition |
| FDT-12 | TSH-07/08/12 | AHG-07/10 | EHR-08/11 | provider / descriptor失败无pre-review resolve或fallback |
| FDT-13 | TSH-08 | AHG-07 | EHR-08 | renew有界、expiry / revoke stop-new-use、release失败不复用 |
| FDT-14 | TSH-10 | AHG-08 | EHR-09 | 每个required constructor / availability失败发布0 handle |
| FDT-15 | TSH-10/16 | AHG-08/14 | EHR-09/15 | optional telemetry degraded仍保持local diagnostic / audit / redaction |
| FDT-16 | TSH-10 | AHG-08 | EHR-09 | mixed identity / partial set永不暴露 |
| FDT-17 | TSH-11 | AHG-09 | EHR-10 | entry / loop / job current unit独立拒绝,FZ-03与旧result不变 |
| FDT-18 | TSH-15 | AHG-13 | EHR-14 | context不猜、policy fail-closed、capability degraded不授权launch |
| FDT-19 | TSH-16 | AHG-14 | EHR-15 | query missing / stale / degraded且zero write |
| FDT-20 | TSH-15/17 | AHG-13/15 | EHR-14/16 | unavailable delayed、invalid / forbidden quarantine、无guessed truth |
| FDT-21 | TSH-15/17 | AHG-15 | EHR-16 | relay / handoff failure不回滚source / capture / guard |
| FDT-22 | TSH-15/17 | AHG-13/15 | EHR-14/16 | cleanup / release / redline依赖缺失保持blocked / orphan / contained |
| FDT-23 | TSH-16/17 | AHG-14/15 | EHR-15/16 | maintenance逐项partial / degraded且no core truth repair |
| FDT-24 | TSH-12 | AHG-10 | EHR-11 | rejected change不调用S04 / builder,保留safe rejection |
| FDT-25 | TSH-13/14 | AHG-11/12 | EHR-09/13 | apply失败关闭active relation并保留desired / observed mismatch |
| FDT-26 | TSH-13/17 | AHG-11/15 | EHR-12/16 | effect suspect冻结自动动作,只允许new investigation / request |
| FDT-27 | TSH-13/17 | AHG-11/15 | EHR-12/16 | prior仍走current validator,parent / child failure history immutable |
| FDT-28 | TSH-14 | AHG-12 | EHR-13 | 仅active same-scope rollout给pending,missing observation不aligned |
| FDT-29 | TSH-08/17 | AHG-18 | EHR-19 | ordinary config不存在隐含TTL,只处理明确material / freshness / qualification / compatibility expiry |
| FDT-30 | TSH-18 | AHG-16 | EHR-17 | safe fields与low-cardinality labels,无marker / ref / actor / instance label |

此表只完成设计追溯。正式`05`仍须为每个FDT分配可执行case并定义evidence schema;真实执行后由正式`06`消费固定evidence identity。

### 9.5 `06-验收标准.md` 配置门禁承接表

`AHG-xx`表示Acceptance Handoff Gate requirement,不是当前AC / VF / VETO正式编号。`06`必须按自身SOP为其分配正式验收ID、证据alias规则、适用profile、裁决主体和风险接受边界。

| AHG ID /门禁方向 | 通过命题 | 否决 /失败条件 | 未来证据要求 | 来源 |
|---|---|---|---|---|
| AHG-01 closed schema | unknown / duplicate / malformed / alias / secret-like字段均被拒绝,101项类型 /范围成立 | 非法字段被忽略、clamp或进入builder | EHR-01 / EHR-02 | I001~I101;CFG-VAL-01~14 |
| AHG-02 source determinism | source intent唯一,S01 < S02 < S03且present-invalid winner不fallback | 第二文件 /低层 /默认值接管非法winner | EHR-03 | C01~C27;CFM-01~04 |
| AHG-03 profile qualification | P01~P04无真实执行 / material;P05+按前置资格;P07保持inactive | host launch、fake进入real-like、未签署profile激活 | EHR-04 | ENV / PROFILE;CFM-11/16 |
| AHG-04 forbidden configuration | NCFG与hard guard违规全部reject / fail-closed | config可改变truth owner、policy、四维boundary、audit、cleanup、redline、redaction或no-write / no-repair | EHR-05 | NCFG-01~24;CFM-09/14/15 |
| AHG-05 composition completeness | FC / XVAL所有enabled composition、route、target、retention和guard关系成立 | enabled dependency缺失仍启动或silent disable | EHR-06 | FC-01~06;XVAL-01~36 |
| AHG-06 sensitive no-output | ordinary config和所有carrier均无raw material / full sensitive ref / provider body | 任一log / metric / error / audit / report / artifact / workload泄露 | EHR-07 | SEC-01~06/14/15 |
| AHG-07 material qualification | required slot resolve / audit / class / lease成立;expiry / revoke停止新使用 | stale / revoked / wrong consumer / unaudited material继续使用或fake / host fallback | EHR-08 | SEC-07~13/16~18 |
| AHG-08 complete generation | required dependencies完整且same-generation set原子发布 | partial / mixed handle、invalid candidate `Degraded`、old process充当apply证据 | EHR-09 | LD-18~24;CFM-24~27 |
| AHG-09 scoped isolation | S05 / S06只影响current invocation / case并遵守ceiling / profile | 修改global config、旧receipt / report或在P05+注入fixture | EHR-10 | FZ-04~06;CFG-VAL-23/24 |
| AHG-10 reviewed change | high-risk change独立review、candidate不可变、S04只在approval后 | review绕过、旧approval复用、拆单降risk或CRL-04 activation | EHR-11 | CCA / CRL / CCT;CAP-01~08 |
| AHG-11 rollback honesty | rollback为new request并重走validation / build / publication,history不改写 | old process /单instance算成功、revoked target强制回滚、truth / audit / receipt回退 | EHR-12 | CCS / CAP-13~17;CRB |
| AHG-12 drift honesty | scope-bound desired / observed可判,missing observation不aligned,无auto-overwrite | observed反写desired、failed relation掩盖drift或宣称fleet success | EHR-13 | CDR-01~08;CFM-43/44 |
| AHG-13 fail-closed runtime | policy / capability / isolation / truth-audit / cleanup / redline依赖失败不放行相关operation | technical degraded marker授权execution、mutation或release | EHR-14 | CFM-29~31/36;FDP-04/07 |
| AHG-14 bounded degraded | 仅read / maintenance / optional telemetry在完整generation内degraded且保持hard guard | required / invalid / partial generation降级成功;query写修复;job修truth | EHR-15 | FDP-08;CFM-26/32/37 |
| AHG-15 no truth rewrite | consumer / relay / handoff / recovery失败只更新formal marker / report | 回滚source truth、重算stored result、修改old receipt / report / capture / handoff | EHR-16 | FDP-09;RCV;正式`03`错误 /一致性 |
| AHG-16 signal safety | alert / diagnostic / metric / audit只含safe字段且职责分层 | raw /高基数ref泄露,log替代accepted audit或provider audit冒充business truth | EHR-17 | ALC-01~06;Step 8 / 11 carrier |
| AHG-17 dependency boundary | 仅`core-contracts`可作为sibling compile dependency;相邻truth不归sandbox | runtime / event依赖进入Cargo,或混入tools / runtime / member / artifact / observability / policy truth | EHR-18 | 正式`01/03`;依赖裁剪标准 |
| AHG-18 unsupported / undeclared capability | remote config、admin override、online LKG、hot reload / swap、immediate revoke callback与ordinary config隐含TTL均未伪装当前能力 | P0 / P1以现有能力名义启用、下游私造public API或按未定义TTL使ordinary config失效 | EHR-19 | XVAL-36;CFM-45/46;future blocker |
| AHG-19 profile activation evidence | PROFILE-05 / 06 / 07分别满足其全部前置后才可对应资格裁决 | 设计表、fake / seam结果或单次smoke替代conformance / staging / production资格 | EHR-20 | Step 6 §9.4 / §9.9 |

验收否决优先级由`06`定义,但AHG-04、06、07、08、10、11、13、15、17、18至少必须评估为VETO候选。不得在本Step提前给出最终VETO编号或风险接受结论。

### 9.6 Evidence Handoff Requirement表

| EHR ID /未来证明命题 | 未来主要producer | 未来consumer | 最小证明内容 | 当前事实 |
|---|---|---|---|---|
| EHR-01 strict parser / schema | `05`定义的unit / contract suite | AHG-01 | malformed / duplicate / unknown / alias / secret-like negative集合与safe issue | planned_requirement only |
| EHR-02 item validation coverage | item / validator suite | AHG-01 / 05 | I001~I101 type / required / range / collection / ref覆盖索引 | planned_requirement only |
| EHR-03 source priority negative | source merge suite | AHG-02 | C01~C27及invalid winner no-fallback | planned_requirement only |
| EHR-04 profile matrix | profile qualification suite | AHG-03 / 19 | PROFILE-01~07 source / adapter / workload / maturity断言 | planned_requirement only |
| EHR-05 NCFG / hard guard negative | security / invariant suite | AHG-04 | NCFG-01~24及hard guard不可配置化 | planned_requirement only |
| EHR-06 cross-field matrix | validator / builder integration suite | AHG-05 | FC-01~06、XVAL-01~36和active composition完整性 | planned_requirement only |
| EHR-07 redaction / no-output | security scan + carrier integration | AHG-06 / 16 | SEC carrier全集与forbidden-field scan,无真实material归档 | planned_requirement only |
| EHR-08 material lifecycle qualification | provider-neutral fake / candidate qualification suite | AHG-07 / 19 | resolve / deny / audit / renew / expiry / revoke / release / rotation行为 | planned_requirement only;真实provider未选 |
| EHR-09 generation atomicity | runtime builder integration suite | AHG-08 | every required constructor / availability failure发布0,complete set同代可见 | planned_requirement only |
| EHR-10 scoped / fixture isolation | API / worker / job / test suite | AHG-09 | S05 / S06只影响current unit,old formal result不变 | planned_requirement only |
| EHR-11 change review / TOCTOU | release-control contract / integration suite | AHG-10 | risk、review、immutable revision、S04-after-review、desired declaration时序 | planned_requirement only;carrier未选 |
| EHR-12 rollback failure drill | release / runtime / operations controlled drill | AHG-11 | valid prior rebuild、invalid / revoked / incompatible / build failure和history保留 | planned_requirement only;无drill结果 |
| EHR-13 drift / observation matrix | observation / rollout contract suite | AHG-12 | CDR-01~08分类、scope、active relation与no-auto-overwrite | planned_requirement only;carrier未选 |
| EHR-14 fail-closed dependency | service / adapter failure injection | AHG-13 | policy / boundary / mutation / safety dependency失效不放行 | planned_requirement only |
| EHR-15 degraded no-write / no-repair | query / job / telemetry integration suite | AHG-14 | permitted surface、zero write、no core truth repair、audit保持 | planned_requirement only |
| EHR-16 no-truth-rewrite recovery | consumer / relay / handoff / replay suite | AHG-15 | failure / retry / recovery只改变formal owning marker | planned_requirement only |
| EHR-17 safe observability | log / metric / audit / report contract + scan | AHG-16 | ALC字段闭集、低基数label、early signal / durable audit分层 | planned_requirement only |
| EHR-18 dependency graph / build | target repo manifest check + adapter contract suite | AHG-17 | sibling compile dependency闭集和runtime / event adapter隔离 | planned_requirement only;目标仓待precheck |
| EHR-19 unsupported / undeclared surface absence | static / protocol / config negative check | AHG-18 | 无remote / admin / reload / LKG / hot / callback current surface,且ordinary config无隐含TTL | planned_requirement only |
| EHR-20 profile activation packet | conformance / staging / security / capacity / ops evidence bundle | AHG-19 | 每个P05+ profile的全部前置、固定证据身份与裁决 | planned_requirement only;当前不qualified |

本表不创建任何`EV-*`、`TC-*`、`AC-*`、`VF-*`、VETO编号、artifact目录或report文件。后续正式`05/06`必须定义其编号与绑定规则,真实执行才可产生固定identity。

### 9.7 `07-实施计划.md` 配置实施承接表

`IMH-xx`表示Implementation Handoff task family,不是phase、commit boundary或授权实现。正式`07`必须将这些任务族与正式`03`模块 /文件、正式`05`检查和正式`06`门禁组成依赖闭包,再决定boundary数量和顺序。

| IMH ID /任务族 | 主要实现责任 | 设计输入 | boundary完成契约 | 到达前blocker /禁止事项 |
|---|---|---|---|---|
| IMH-01 implementation precheck | 确认或按正式计划创建目标仓;检查git identity、workspace baseline、`core-contracts` exact shared type和旧实现污染 | 正式`03` §16.2~§16.4;项目台账open precheck | precheck结果进入未来implementation ledger;缺shared type时回设计 /上游 | 当前不得声称目标仓存在;不得先写代码再补precheck |
| IMH-02 workspace / dependency boundary | 落实七workspace member与唯一sibling compile dependency | 正式`03` §3~§5;AHG-17 | Cargo graph、module direction和runtime / event adapter裁剪可检查 | 不得引入tools / runtime / member / artifact / observability sibling path dependency |
| IMH-03 raw config owner与source intent | 在`infra/config.rs`一处拥有raw read,实现S01 / S02 / S03选择与S05 / S06分lane入口 | Step 3 / 5;TSH-01 | source ambiguity / unreadable / unsupported有stable safe issue;其他模块无raw read | 禁止第二loader、directory merge、S07 / S08、implicit fallback |
| IMH-04 strict schema / typed config | 实现40顶层模块、I001~I101 typed shape、closed parse和P0 registry | Step 7;TSH-02/03 | exact key / type / default / required / collection / ref可逐项测试 | 不得把raw config加入contracts / domain / public DTO |
| IMH-05 profile composition | 实现PROFILE-01~07 selector / qualification与ENV适用性检查 | Step 6;TSH-04 | P01~04、P05、P06、P07各有明确eligible / rejected disposition | profile ID若需新增public enum先回写`03`;P07不得current active |
| IMH-06 ordinary validator / XVAL | 实现V01~V07、NCFG、FC、XVAL与CFG-VAL safe issue mapping | Step 4 / 7 / 9;TSH-05/06 | issue稳定 / redacted;所有enabled composition在builder前闭合 | 不得在builder中补default或silent disable |
| IMH-07 sensitive registry / S04 facility | 实现23 slot descriptor、activation、adapter-local bounded lease、safe marker和provider-neutral outcome | Step 8;TSH-07/08 | material不进入ordinary config / summary / DTO / carrier;required失败阻断 | provider产品 / principal未选是P05+ blocker;不得新增public secret port |
| IMH-08 runtime builder / generation | 按LD-18~24装配store / adapter / service / entry complete set并原子发布 | Step 9;TSH-09/10;正式`03` §13 | valid / blocked / bounded degraded映射到existing carrier;partial / mixed set不可见 | 若需新public state / builder port先回写`03`;old process不是成功证据 |
| IMH-09 scoped validator | 实现S05 entry / loop / job snapshot和S06 fixture / simulation assembly | Step 7 / 9;TSH-11 | global ceiling / registry不被放宽;current unit失败不改FZ-03 / old result | 不得将scoped input持久化为global override或让S06进入P05+ |
| IMH-10 change-control integration seam | 接入完整candidate prevalidation、safe manifest、review / TOCTOU和S04-after-review门禁 | Step 10;TSH-12 | runtime只暴露existing safe validation / availability;ops-private record归外部control plane | carrier与authorization source未选;不得在L4新增mutation API / repository |
| IMH-11 generation observation / rollback seam | 报告published generation safe marker,支持rollback candidate完整重建所需existing runtime seam | Step 10;TSH-13/14 | runtime不拥有fleet desired truth;rollback不改business truth;failure状态可诚实消费 | desired / observed / rollout store由`07/09`选;若需runtime query / DTO先回写`03` |
| IMH-12 runtime failure mapping | 将config-owned availability映射到existing error / receipt / report / relay / handoff / diagnostic | Step 11;TSH-15~17 | fail-closed、delayed、quarantine、failed、partial、degraded按role唯一;无truth rewrite | 不得新增泛化`ConfigFailed`或把所有adapter error归config |
| IMH-13 safe observability hooks | 实现sanitized local signal、low-cardinality metric和existing audit / marker integration | Step 8 / 11;TSH-18;正式`03` §14 | carrier字段闭集与redaction floor可自动检查;store前不伪durable audit | alert产品 /阈值留`09`;不得把ref / marker / actor / instance放label |
| IMH-14 deterministic fake / seam parity | 实现P01~04的fake、failure injection、controlled seam与simulation状态 | Step 6 / 7;TSH-19 | transaction、version、replay、no-write、no-repair、redaction与durable contract一致 | fake不得spawn host /访问未授权fs / network,不得成为P05+ fallback |
| IMH-15 configuration verification assets | 实现正式`05`规划的test suites、gate / report脚本和EHR生产能力 | 后续正式`05/06`;TSH / AHG / EHR | 真实执行后按标准路径生成fixed run evidence;失败非0且保留报告 | 当前无脚本 /路径 /run_id事实;`07`不得把test后置到不闭合boundary |
| IMH-16 implementation ledger / boundary setup | 根据正式`07` Boundary Gate Matrix创建项目级implementation ledger和全部planned boundary skeleton | 代码实施台账规范;正式`07` | 恰好一个current boundary;未来boundary均`planned / wait_until_current`;所有gate初始非pass | 只能在正式`07`完成时同步创建;当前Step 12禁止创建 |

正式`07`必须额外执行以下配置设计closure gate:

- 每个boundary列出它消费的I / PROFILE / SEC / CFG-VAL / XVAL / CCT / CFM / TSH / AHG ID,不能只写“实现配置”。
- 每个boundary的allowed scope必须与正式`03`文件布局一致;若目标仓现状不一致,先登记migration / repair boundary,不得暗改设计。
- 任一boundary需要新增config key、default、source、profile、state、port、DTO、error、audit kind或hot behavior时,立即`wait_design`,回写`04`或先回写`03`。
- 每个boundary必须形成代码、targeted negative tests、必要EHR producer和handoff的依赖闭包;不能让当前代码依赖后续boundary尚未存在的validator / mapper / fake。
- 正式`07`完成时必须一次性创建implementation ledger和全部planned boundary skeleton,但不得填真实baseline commit、实现commit、run_id或pass evidence。

### 9.8 `09-部署与运维手册.md` 运维承接表

`OPH-xx`表示Operations Handoff topic,不是当前runbook、命令或已部署能力。`09`只有在对应实现 /产品 /验收事实存在后才能写可执行值;未闭合项必须明确标记不适用或阻塞,不得填示例值冒充生产基线。

| OPH ID /运维主题 | `09`必须闭合的运行态内容 | `04`提供的不变边界 | 前置事实 /未闭合处理 |
|---|---|---|---|
| OPH-01 config artifact基线 | 真实文件 /制品位置、owner、权限、发布、完整性标记、版本保留、读取账号 | S02单一完整文档;strict parse;无directory merge / patch source;artifact retention不产生ordinary runtime config TTL | 产品 /路径由实施后确认;未确认不得部署 |
| OPH-02 profile selection | 每个environment允许的profile、selector载体、启动前资格检查和禁止组合 | ENV-01~07 / PROFILE-01~07;P07 inactive;通用dev/test/prod不是alias | P05+只有固定资格证据和验收后可启用 |
| OPH-03 S03 injection | allowlisted env名称 /注入 /权限 /变更来源、present-invalid诊断 | S03只承载Step 7允许scalar / ref;priority不变;raw material禁止 | 真实env值不进手册示例 /日志;非法值fail-fast |
| OPH-04 S04 provider binding | provider产品、principal class、access policy、descriptor registry、lease / renew / release、native audit | ordinary config只存opaque ref;23 slot闭集;adapter-local bounded lease | P05+前必须选择并qualification;当前P01~04不调用真实provider |
| OPH-05 startup / restart | preflight、validation、builder、publication、health observation、失败诊断与restart操作 | LD-01~24;发布0或完整;invalid candidate不degraded | 具体命令 /service manager由实现后填写 |
| OPH-06 rollout / desired / observed | rollout scope、actor / review接口、desired / active relation / observed carrier、completion判定 | CAP / CDR时序;scope唯一desired;observed不反写desired | carrier产品和fleet topology未选,在`07/09`闭合前不得宣称aligned |
| OPH-07 rollback / forward fix | prior candidate取回、current compatibility validation、new generation、scope observation和失败处置 | rollback是child request;revoked / expired / incompatible不强制;old process非成功 | 真实orchestrator / traffic / drain / zero-downtime细节待选 |
| OPH-08 drift handling | observation cadence、missing marker、active rollout判断、调查、apply / rollback入口 | CDR-01~08;failed / cancelled relation不掩盖drift;no auto-overwrite | 无carrier时只能标operation blocker,不能从instance猜desired |
| OPH-09 material expiry / revoke | detection hook、lease expiry预警、stop-new-use、termination / restart、forward rotation | 现有hook检测后FDP-07;不承诺immediate push callback;revoked不可rollback | callback若需要先回写`03/04`;provider hook未验证不得激活 |
| OPH-10 adapter / dependency outage | 按role的重试、隔离、quarantine、dead-letter、blocked / contained和manual intervention | CFM-29~37;policy / boundary / mutation / safety无weak fallback | 产品特定timeout / retry / dead-letter值由`09`基于实现填写 |
| OPH-11 cleanup / lease / reaper / redline | cadence、batch、ownership、evidence / investigation guard、orphan处置、release / containment升级 | I065~I075;guard-first;missing evidence默认blocked;redline非advisory | 禁止force-clean / auto-release;真实删除命令必须带前置检查 |
| OPH-12 observability / alert | ALC到产品severity / route / threshold / window / pager映射,dashboard和signal freshness | safe字段闭集、low-cardinality、formal audit独立、no raw / full ref | 当前只定义ALC;产品 /阈值未选不等于告警已配置 |
| OPH-13 audit / evidence retention | ops-private change record、provider audit、runtime safe audit、test evidence和acceptance record各自保留 /访问 /导出 | 各carrier不互相替代;不复制provider正文;固定run evidence不使用`latest` | retention数字和reader权限由`09` /安全owner闭合 |
| OPH-14 store / bus / route / target / scheduler binding | 产品、endpoint / route / target注册、权限、capacity、health和failover | runtime / event / handoff依赖产品中立;route closed map;no sibling compile dependency | 产品未选时profile不qualified;不得用host / memory / fake替代real-like |
| OPH-15 maintenance jobs | reference refresh、projection rebuild、derived / reconciliation、relay / handoff retry的schedule、scope、batch、report和rerun | I076~I085 / I052~I064;S05只收窄;job no core truth repair;old report immutable | scheduler产品和数字未选;duplicate必须replay stored report |
| OPH-16 security / access / incident | config / provider / rollout / evidence访问角色、break-glass边界、安全事件升级和凭据轮换 | CRL-04无emergency config override;secret / redaction / boundary hard guard不可放宽 | 真实role / principal由security / operations确认;break-glass不能改truth |
| OPH-17 profile promotion / deactivation | P05 conformance到P06 staging、P07未来激活 /停用的证据包、审批、rollback和退出条件 | 每profile前置全满足;设计状态不等于qualification / acceptance | P07当前不可用;后续需Step 13 / 14、`05/06/07/09`共同重开 |
| OPH-18 backup / continuity | config artifact、ops-private marker / record和必要store的备份 /恢复 /兼容性检查 | 不把old config恢复等同rollback成功;恢复后仍全量validation / generation | 真实store / retention / RPO / RTO需产品与正式NFR输入 |

`09`不得把以下内容写成“应急操作”:放宽boundary维度、fallback host / fake、关闭policy fail-closed / audit / redaction / cleanup / redline、注入raw secret、observed反写desired、修改old receipt / report、重算missing stored result、用old process存活宣称apply / rollback成功。

### 9.9 PROFILE-01~07下游承接与激活资格表

| Profile | `05`验证责任 | `06`裁决责任 | `07`实施准备 | `09`运行准备 | 当前资格结论 |
|---|---|---|---|---|---|
| PROFILE-01 `local-contract` | loader / validator / builder / entry contract、safe diagnostic、no real launch;TSH-01~06/09~11 | 只能作为本地contract evidence;不得证明隔离backend;AHG-01~05/08/09 | S01 baseline、optional S02 / S03、non-executing fake和local entry wiring;IMH-03~06/08/09/14 | 本地artifact / selector / failure diagnosis,显式标non-production;OPH-01~03/05 | design_defined;未声明实现或测试通过 |
| PROFILE-02 `ci-contract` | deterministic、negative config、state / UoW / replay / redaction / failure injection;TSH-01~07/09~19 | P0自动化契约证据候选,不证明real dependency;AHG-01~16 | run-isolated fake、fixed clock / id、fixture registry、CI gate producer;IMH-04~06/09/13~15 | CI config / fixture权限和evidence归档边界;OPH-01~03/12/13 | design_defined;未声明CI或evidence存在 |
| PROFILE-03 `integration-seam` | resolver / consumer / publisher / handoff / sink seam和failure mapping;TSH-06~10/15~20 | 接缝完整性候选,不得作为coherent boundary证据;AHG-05~09/13~18 | controlled adapters、closed route / target registry和seam harness;IMH-06~09/12~15 | controlled endpoint / route / target注册和排障,无real execution;OPH-10/12~15 | design_defined;未声明integration通过 |
| PROFILE-04 `operations-simulation` | lease / orphan / cleanup / redline / relay / replay / maintenance / rollback state simulation;TSH-11~18 | safety flow、no-repair、no-release、history honesty候选;AHG-09~16 | simulated handle / state / report、operations job harness与failure injection;IMH-09/11~15 | simulation数据、job schedule和report归档,不得运行真实release / cleanup;OPH-08~15 | design_defined;未声明operations evidence |
| PROFILE-05 `backend-conformance` | candidate capability、四维boundary、resource exceed、capture / inspect / release、material lifecycle、no host fallback;TSH-04~10/13~20 | backend conformance资格证据包;AHG-03~08/11~19 | candidate backend / S04 / dedicated lab / conformance suite;IMH-01/02/05~08/11~16 | lab topology、provider、principal、guarded lifecycle、incident和evidence;OPH-02/04~17 | conditionally_defined;provider / backend / environment / evidence未qualified |
| PROFILE-06 `staging-like` | durable parity、real-like E2E、dependency outage、scheduler / handoff / observability、rollout / drift / rollback;TSH-04~20 | release-candidate gate,必须消费P05资格及完整EHR;AHG-03~19 | durable / bus / resolver / target / scheduler / sink composition和evidence boundary;IMH-01~16 | 完整artifact / source / S04 / rollout / alert / continuity runbook;OPH-01~18 | conditional_not_currently_qualified |
| PROFILE-07 `production-like` | future capacity / security / disaster / production validation,只能在设计重开后展开 | future production acceptance / risk / sign-off,不得使用当前设计状态代替;AHG-18/19 | future approved implementation / hardening / rollout boundary;当前不得排入可执行boundary | future production topology、credentials、runbook、continuity和evidence retention | inactive target;当前不得启用、测试为ready或验收 |

Profile资格不具有传递捷径:PROFILE-02通过不推出PROFILE-05,PROFILE-03 seam通过不推出四维boundary,PROFILE-04 simulation通过不推出真实cleanup,PROFILE-05 conformance通过也不自动推出PROFILE-06 release readiness。

### 9.10 SBX-CP-01~11控制面下游覆盖表

| Control Plane | `05`主题 | `06`门禁 | `07`任务 | `09`主题 | 覆盖结论 |
|---|---|---|---|---|---|
| SBX-CP-01 启动装配与配置身份 | TSH-01~04/09/10/12~14 | AHG-01~03/08/10~12 | IMH-03~06/08/10/11 | OPH-01~08 | covered;raw owner、identity、generation和rollout分层 |
| SBX-CP-02 入口与负载包络 | TSH-03/11/17 | AHG-01/09/15 | IMH-04/09/12 | OPH-05/10/15 | covered;entry / loop / job只消费typed scoped input |
| SBX-CP-03 存储、事务与重复回放 | TSH-03/06/08/10/15~17/19 | AHG-05/07/08/13~15/17 | IMH-04/06~08/12/14 | OPH-04/10/13~15/18 | covered;store不改变UoW / replay / truth语义 |
| SBX-CP-04 外部语境、策略与能力摘要 | TSH-04/06/08/10/15/17/20 | AHG-03/05/07/08/13/15/17 | IMH-05~08/12/14 | OPH-04/09/10/14 | covered;body-free summary与policy fail-closed |
| SBX-CP-05 隔离边界与执行后端 | TSH-04~10/13/15/17/19/20 | AHG-03~08/11/13/15/17/19 | IMH-01/02/05~08/11~15 | OPH-02/04~11/14/16~18 | covered;四维boundary、backend / capture / release无weak fallback |
| SBX-CP-06 事件接入、发布与relay | TSH-06~13/15/17~20 | AHG-05~11/13/15~18 | IMH-04/06~10/12~15 | OPH-05~08/10/12~15 | covered;协议 / route / relay truth分层和no-rollback |
| SBX-CP-07 材料、观测与调查交接 | TSH-06~13/15~20 | AHG-05~11/13~19 | IMH-04/06~10/12~15 | OPH-04~17 | covered;target / receipt不升格downstream truth |
| SBX-CP-08 租约、清理、reaper与redline | TSH-05~08/11~19 | AHG-04~07/09~16/19 | IMH-05~09/11~15 | OPH-04~18 | covered;guard-first、stop-new-use和containment |
| SBX-CP-09 引用刷新、投影、派生与对账 | TSH-03/06/10/11/15~19 | AHG-01/05/08/09/13~15 | IMH-04/06/08/09/12~15 | OPH-05/10/12~15/18 | covered;read degraded、maintenance no-repair |
| SBX-CP-10 可观测性、诊断与脱敏 | TSH-05~10/12~20 | AHG-04~08/10~19 | IMH-06~08/10~15 | OPH-04~18 | covered;safe carrier、formal audit和redaction floor |
| SBX-CP-11 环境与deterministic test profile | TSH-01~20 | AHG-01~19 | IMH-03~16 | OPH-01~18 | covered;profile只组合已定义域,不授权overlay / reload |

### 9.11 按40配置组组织的下游承接表

| 配置组 / Item | `05`测试输入 | `06`门禁输入 | `07`实现输入 | `09`运维输入 |
|---|---|---|---|---|
| `configIdentity` I001 | TSH-01/04/09/12~14 | AHG-02/03/10/12 | IMH-03/05/08/10/11 | OPH-01/02/05/06/08 |
| `entryEnvelope` I002~I006 | TSH-02/03/11/17/18 | AHG-01/09/15/16 | IMH-04/09/12/13 | OPH-03/05/10/12 |
| `workerEnvelope` I007~I009 | TSH-03/11/15/17 | AHG-01/09/13/15 | IMH-04/09/12/14 | OPH-05/10/15 |
| `jobEnvelope` I010~I013 | TSH-03/08/11/15~17 | AHG-01/07/09/13~15 | IMH-04/07/09/12/14 | OPH-04/05/10/15 |
| `featureAssembly` I014~I016 | TSH-05/06/10/12 | AHG-04/05/08/10 | IMH-06/08/10 | OPH-05/06/14/17 |
| `truthStore` I017 | TSH-05~10/15/17/19 | AHG-04~08/13/15/17 | IMH-02/04/06~08/12/14 | OPH-04/05/10/13/14/18 |
| `projectionStore` I018 | TSH-06/08/10/16/19 | AHG-05/07/08/14/17 | IMH-04/06~08/12/14 | OPH-04/05/10/14/15/18 |
| `derivedStore` I019 | TSH-06/08/10/16/19 | AHG-05/07/08/14/17 | IMH-04/06~08/12/14 | OPH-04/05/10/14/15/18 |
| `referenceStore` I020 | TSH-06/08/10/15~17/19 | AHG-05/07/08/13~15/17 | IMH-04/06~08/12/14 | OPH-04/05/10/14/15/18 |
| `relayStore` I021 | TSH-06/08/10/15/17/19 | AHG-05/07/08/13/15/17 | IMH-04/06~08/12/14 | OPH-04/05/10/13~15/18 |
| `replayStore` I022 | TSH-05/08/10/15/17/19 | AHG-04/07/08/13/15/17 | IMH-04/06~08/12/14 | OPH-04/05/10/13/14/18 |
| `replayLifecycle` I023~I027 | TSH-03/06/11/17/19 | AHG-01/05/09/15 | IMH-04/06/09/12/14 | OPH-10/13/15/18 |
| `contextSource` I028~I030 | TSH-04/06/08/10/15~17/20 | AHG-03/05/07/08/13~15/17 | IMH-02/04~08/12/14 | OPH-04/05/09/10/14 |
| `policySource` I031~I034 | TSH-04~08/10/15/17/20 | AHG-03~08/13/15/17 | IMH-02/04~08/12/14 | OPH-04/05/09/10/14/16 |
| `backendCapability` I035~I038 | TSH-04~10/15/17/19/20 | AHG-03~08/13/15/17/19 | IMH-01/02/04~08/12/14/15 | OPH-02/04/05/09/10/14/17 |
| `boundaryEnforcement` I039~I040 | TSH-04~10/12/15/17/19 | AHG-03~08/10/13/15/19 | IMH-01/04~08/10/12/14/15 | OPH-02/05/07/10/14/16/17 |
| `isolationBackend` I041~I043 | TSH-04~10/13/15/17/19/20 | AHG-03~08/11/13/15/17/19 | IMH-01/02/04~08/11~15 | OPH-02/04/05/07/09~11/14/16~18 |
| `executionCapture` I044~I048 | TSH-05~10/13/15/17~20 | AHG-04~08/11/13/15~19 | IMH-01/02/04~08/11~15 | OPH-02/04/05/07/09/10/13/14/16~18 |
| `inboundEvents` I049 | TSH-02/04/06~12/15/17~20 | AHG-01/03/05~10/13/15~18 | IMH-02~10/12~15 | OPH-02~06/10/12~15 |
| `eventPublisher` I050 | TSH-06~10/12/13/15/17~20 | AHG-05~08/10/11/13/15~18 | IMH-02/04/06~08/10/12~15 | OPH-04~07/10/12~15 |
| `eventRoutes` I051 | TSH-02/06~10/12/13/17/18/20 | AHG-01/05~08/10/11/15~18 | IMH-02~08/10/12~15 | OPH-01/04~07/10/12~14 |
| `eventRelay` I052~I054 | TSH-03/06/08/10~13/15/17~20 | AHG-01/05/07~11/13/15~18 | IMH-02/04/06~10/12~15 | OPH-04~08/10/12~15 |
| `materialHandoff` I055~I056 | TSH-03/06~13/15/17~20 | AHG-01/05~11/13/15~19 | IMH-02/04/06~10/12~15 | OPH-02/04~07/10/12~17 |
| `observabilityHandoff` I057~I058 | TSH-03/06~13/15~20 | AHG-01/05~11/13~19 | IMH-02/04/06~10/12~15 | OPH-02/04~07/10/12~17 |
| `investigationHandoff` I059~I060 | TSH-03/05~13/15~20 | AHG-01/04~11/13~19 | IMH-02/04/06~10/12~15 | OPH-02/04~17 |
| `handoffDelivery` I061~I064 | TSH-03/06/08/10~13/15/17~20 | AHG-01/05/07~11/13/15~18 | IMH-02/04/06~10/12~15 | OPH-04~08/10/12~15 |
| `leaseSafety` I065~I067 | TSH-03~08/11~19 | AHG-01/03~07/09~16/19 | IMH-01/04~09/11~15 | OPH-02/04~11/13~18 |
| `cleanupSafety` I068~I070 | TSH-03/05/06/11~19 | AHG-01/04/05/09~16 | IMH-04~06/09/11~15 | OPH-05~18 |
| `backendRelease` I071~I073 | TSH-03~10/11~19 | AHG-01/03~16/19 | IMH-01/04~09/11~15 | OPH-02/04~18 |
| `redlineSafety` I074~I075 | TSH-03/05~08/11~19 | AHG-01/04~07/09~16/19 | IMH-04~07/09/11~15 | OPH-04~18 |
| `referenceRefresh` I076~I078 | TSH-03/06/08/11/15~19 | AHG-01/05/07/09/13~17 | IMH-04/06/07/09/12~15 | OPH-04/05/10/12~15/18 |
| `projectionMaintenance` I079~I081 | TSH-03/06/11/15~19 | AHG-01/05/09/13~17 | IMH-04/06/09/12~15 | OPH-05/10/12~15/18 |
| `derivedMaintenance` I082~I084 | TSH-03/06/08/11/15~19 | AHG-01/05/07/09/13~17 | IMH-04/06/07/09/12~15 | OPH-04/05/10/12~15/18 |
| `reconciliationMaintenance` I085 | TSH-05/06/11/15~19 | AHG-04/05/09/13~17 | IMH-04/06/09/12~15 | OPH-05/10/12~15/18 |
| `runtimeTelemetry` I086~I090 | TSH-02/05~10/12/15/16/18~20 | AHG-01/04~08/10/13/14/16~19 | IMH-02/04/06~08/10/12~15 | OPH-01/04~06/10/12~14/16~18 |
| `auditTrace` I091 | TSH-05~10/12~20 | AHG-04~08/10~19 | IMH-02/04/06~08/10~15 | OPH-01/04~18 |
| `diagnostics` I092~I093 | TSH-02/05~10/11/12/15/16/18~20 | AHG-01/04~10/13/14/16~19 | IMH-02/04/06~10/12~15 | OPH-01/03~18 |
| `safeOutput` I094~I095 | TSH-02/05~10/12/15/16/18~20 | AHG-01/04~08/10/13/14/16~19 | IMH-02/04/06~08/10/12~15 | OPH-01/03~18 |
| `deterministicAdapters` I096~I097 | TSH-04/07/11/17/19/20 | AHG-03/06/09/15/17/19 | IMH-02/04/05/09/14/15 | OPH-02/13/17 |
| `testFixtures` I098~I101 | TSH-03/04/07/11/17/19/20 | AHG-01/03/06/09/15/17/19 | IMH-02/04/05/09/14/15 | OPH-02/13/17 |

本表的ID引用表示后续必须消费的责任集合,不是测试 /验收 /实施 /运维已完成状态。40行必须与Step 7 / 10 / 11组名、Item范围和顺序一致。

#### 9.11.1 D01~D44配置域下游责任审计

| Domain | `05/06`验证 /裁决焦点 | `07`实施责任 | `09`运行责任 | 审计结论 |
|---|---|---|---|---|
| D01 config source intake | source intent、single S02、priority和unsupported source | IMH-03 | OPH-01/03 | covered;无第二loader / fallback |
| D02 runtime profile / identity | exact profile、body-free identity、drift marker | IMH-05/08/11 | OPH-02/06/08 | covered;instance不反推desired |
| D03 startup validation | V01~V10 / NCFG / XVAL / safe issue | IMH-06 | OPH-05/12 | covered;blocked发布0 handle |
| D04 runtime builder / registry | complete registry / generation / atomic publication | IMH-07/08 | OPH-04/05/14 | covered;same-generation complete set |
| D05 sync API envelope | global ceiling、entry selector和query no-write | IMH-04/09/12 | OPH-03/05/10 | covered;不clamp / raw diagnostic |
| D06 worker envelope | loop snapshot、ceiling和delayed / quarantine | IMH-04/09/12 | OPH-05/10 | covered;invalid loop不启动 |
| D07 job envelope | typed input、retry / retention和report immutability | IMH-04/09/12/14 | OPH-05/10/15 | covered;old report不改写 |
| D08 feature assembly | FC完整性和enabled dependency | IMH-06/08 | OPH-05/14/17 | covered;不得silent disable |
| D09 truth / audit / UoW store | required store、same-UoW audit、no memory fallback | IMH-02/07/08/12 | OPH-04/10/13/14/18 | covered;unavailable不接受mutation |
| D10 projection / derived store | read / maintenance degraded与no truth fallback | IMH-07/08/12/14 | OPH-04/10/14/15/18 | covered;query no-write |
| D11 reference store | body-free、resolver unavailable和read degraded | IMH-07/08/12/14 | OPH-04/10/14/15/18 | covered;不保存external body |
| D12 relay store | enabled dependency、relay fact和no source rollback | IMH-07/08/12/14 | OPH-04/10/13~15 | covered;publish failure不删fact |
| D13 replay / stored surface | retention关系、duplicate replay和missing result blocker | IMH-06~08/12/14 | OPH-10/13~15/18 | covered;duplicate不重算 |
| D14 context source | body-free resolution、freshness与command / consumer / query分面 | IMH-07/08/12/14 | OPH-04/09/10/14 | covered;不造summary truth |
| D15 policy source | missing / stale / conflict / denied fail-closed | IMH-07/08/12/14 | OPH-04/09/10/14/16 | covered;availability不授权allow |
| D16 backend capability | profile / registry / freshness / probe和boundary资格 | IMH-01/05~08/12/15 | OPH-02/04/09/10/14/17 | covered;不猜support |
| D17 coherent boundary | resource / filesystem / network / process整体成立 | IMH-05/06/08/14/15 | OPH-02/05/07/10/14/16/17 | covered;partial为veto候选 |
| D18 backend lifecycle | candidate binding、launch / inspect和no host / fake fallback | IMH-01/05~08/12/14/15 | OPH-02/04/05/07/09~11/14/16~18 | covered;typed failure不伪success |
| D19 execution capture | adapter / class / timeout / handoff / redaction完整 | IMH-05~08/12~15 | OPH-02/04/05/07/10/13/14/16~18 | covered;capture failure不伪run success |
| D20 backend handle / lease | material expiry / revoke、stop-new-use和guarded lifecycle | IMH-07/08/11~15 | OPH-04/07/09~11/16~18 | covered;无force release |
| D21 inbound subscription | exact binding map、schema、dedup、quarantine和loop scope | IMH-03~10/12~15 | OPH-02~06/10/12~15 | covered;consumer不造core success |
| D22 publisher | feature dependency、material、availability和relay outcome | IMH-06~08/10/12~15 | OPH-04~07/10/12~15 | covered;failure no rollback |
| D23 route binding | exact closed map、active key coverage和no raw topic synthesis | IMH-03~08/10/13~15 | OPH-01/04~07/10/12~14 | covered;route不改protocol |
| D24 relay delivery | scoped batch、retry / timeout、dead-letter和fact retention | IMH-04/06/09/12~15 | OPH-05~08/10/12~15 | covered;payload不现查重建 |
| D25 material handoff | class / adapter / target enablement、receipt和capture immutability | IMH-04/06~10/12~15 | OPH-02/04~07/10/12~17 | covered;不升格artifact truth |
| D26 observability handoff | unique enablement、target / redaction和formal audit独立 | IMH-04/06~10/12~15 | OPH-02/04~07/10/12~17 | covered;handoff failure非core degraded |
| D27 investigation handoff | target / containment关系和receipt no-release | IMH-04/06~10/12~15 | OPH-02/04~17 | covered;guard保持 |
| D28 handoff retry | retry / retention / timeout / batch和old fact immutability | IMH-04/06/09/12~15 | OPH-05~08/10/12~15 | covered;new job / formal retry |
| D29 lease / orphan | expiry inspect-only、cadence / batch和orphan保守状态 | IMH-04~09/11~15 | OPH-04/05/09~11/13~18 | covered;不自动delete |
| D30 cleanup guard | evidence / handoff / investigation / redline前置与blocked默认 | IMH-04~06/09/11~15 | OPH-05~18 | covered;no force-clean |
| D31 backend release | optional override、reuse capability、retry / timeout和orphan retention | IMH-05~09/11~15 | OPH-04~18 | covered;failure不伪Released |
| D32 redline | containment always active、handoff / escalation和safe signal | IMH-04~07/09/11~15 | OPH-04~18 | covered;非advisory |
| D33 reference refresh | threshold / batch / cadence、body-free和partial report | IMH-04/06/09/12~15 | OPH-05/10/12~15/18 | covered;不写external truth |
| D34 projection rebuild | stale / rebuild、query no-write和job report | IMH-04/06/09/12~15 | OPH-05/10/12~15/18 | covered;query不触发rebuild |
| D35 derived view | feature / store / scope关系、read degraded和no truth promotion | IMH-04/06/08/09/12~15 | OPH-05/10/12~15/18 | covered;derived不成为policy / truth |
| D36 reconciliation | query / job / report完整、optional event和no auto-fix | IMH-04/06/08/09/12~15 | OPH-05/10/12~15/18 | covered;finding不升格accepted fact |
| D37 runtime log / metric | sink / sampling / labels、optional degraded和low-cardinality | IMH-06~08/12~15 | OPH-04/05/10/12~14/16~18 | covered;formal audit保持 |
| D38 audit / trace | mandatory route、same-UoW、safe fields和provider audit分层 | IMH-06~08/10/13~15 | OPH-04~18 | covered;无audit不接受mutation |
| D39 diagnostic issue | safe / quiet、surface / retention和store前signal | IMH-04/06/08/09/12~15 | OPH-03/05/10/12/13/16 | covered;无raw / verbose body |
| D40 redaction gate | profile、17-class deny floor、all carrier scan | IMH-04/06~08/10/12~15 | OPH-03~05/10/12/13/16 | covered;deny只可equal-or-stricter |
| D41 profile composition | exact PROFILE、source / material / fixture eligibility | IMH-05/06/08/14/15 | OPH-02/04/17 | covered;profile不隐式启用能力 |
| D42 deterministic fixture | fake clock / id / adapter / state配对和P05+排除 | IMH-04/05/09/14/15 | OPH-02/13/17 | covered;fake parity且不进入real-like |
| D43 real-like composition | complete binding、P05 / P06资格和P07 inactive | IMH-01/02/05~08/11/13~16 | OPH-02/04~18 | covered;产品 /证据缺失即unqualified |
| D44 overlay / reload trigger | S07 / S08 / reload / LKG / hot声明negative absence | 不进入current implementation boundary | 不提供current operation | covered;要求时先回写`03`并重开`04` |

本表名称与顺序必须与Step 9 D01~D44一致。它只证明责任闭合,不声明任何测试、验收、实现或运维准备已完成。

### 9.12 下游不得重复定义的配置契约

| 契约 | 当前真相源 | 下游允许动作 | 下游禁止动作 | 冲突处理 |
|---|---|---|---|---|
| ENV / PROFILE语义与资格 | Step 6 | 设计环境矩阵、资格suite、promotion gate和runbook | 用旧dev/test/staging/prod alias、从环境名推产品或宣称已qualified | 回Step 6 / Step 13~14,必要时重开`04` |
| I001~I101 schema / default / type / required / source / scope | Step 7 | 生成typed config、测试输入、运维参数文档 | 新增 /删除 /重命名字段、改default /范围 /来源、引入第二schema | 回Step 7,若改public carrier先回`03` |
| S01~S08和priority / conflict | Step 5 | 验证、部署和审计approved source | 新增config center / admin override / directory merge、低层fallback | 回Step 5 / Step 13,hot能力先回`03` |
| sensitive taxonomy与S04 | Step 8 | provider qualification、security tests、adapter-local实现与runbook | ordinary raw material、public secret port、shared cache、full ref输出 | 回Step 8,port / flow变化先回`03` |
| NCFG / FC / XVAL | Step 4 / 7 / 9 | 负向suite、acceptance veto和builder validator | 用feature flag /运维override绕过或拆分hard guard | 视为design / security violation,不得局部豁免 |
| load / freeze / activation / publication | Step 9 | 实现和验证LD / FZ、写startup / restart runbook | partial generation、mixed identity、in-place mutation、hot swap | 回Step 9,新runtime状态 / flow先回`03` |
| change / review / rollback / drift | Step 10 | 选择ops-private carrier、设计tests / gates / runbook | 新增L4 mutation API / repo、修改failed history、observed反写desired | carrier不改变语义;需要public surface先回`03` |
| failure / degraded / recovery | Step 11 | 写failure injection、acceptance gate、alert / recovery route | invalid / required failure降级成功、weak fallback、truth rewrite | 回Step 11,新error / DTO / callback先回`03` |
| domain / protocol / state / truth ownership | 正式`03`及正式`00~02` | 引用正式名称和断言,实现既有contract | 在`05/06/07/09`发明对象、状态、error、event、port或truth | 先修拥有该真相源的正式文档 |
| implementation boundary / ledger | 正式`07` +代码实施台账规范 | 正式`07`完成时创建、实现期间按gate更新 | Step 12提前创建、未来boundary标pass、伪造baseline / commit | 回正式`07`,不得由实现agent临场设计 |
| evidence identity与acceptance | 正式`05/06` +真实execution | 定义schema、生成fixed run evidence、审查 /裁决 | 本Step分配真实EV / run_id、用`latest`、设计表或空checkbox作证据 | 回`05/06`并执行真实gate |

### 9.13 开放Blocker分发与转换表

| Blocker / gap | 当前状态 | `05`责任 | `06`责任 | `07`责任 | `09`责任 | 转为阻塞的时机 |
|---|---|---|---|---|---|---|
| 旧正式`05/06`未重建 | open_downstream | full-restart并消费TSH / FDT / EHR | 在新版`05`后full-restart并消费AHG /真实evidence | 未完成新版`05/06`不得正式移交实现 | 不引用旧通过 /空checkbox | 当前不阻塞Step 12;阻塞`07`正式移交 |
| 目标实现仓未确认 | open_for_07_precheck | 测试环境路径不能假定存在 | 不接受不存在仓的实现证据 | IMH-01首个precheck确认或按正式boundary创建 | 只在实现存在后写真实路径 | 阻塞首个实现boundary |
| `core-contracts` exact type未复核 | open_for_07_precheck | contract tests使用正式类型,不可stub成第二schema | dependency gate消费检查结果 | 目标仓检索;缺失回`03` /上游 | 无直接动作 | 阻塞消费缺失类型的boundary |
| provider / principal / native audit未选 | open_for_p05_p06_p07_activation | provider-neutral fake与candidate qualification schema | AHG-07/19不得通过real profile | IMH-07只做neutral seam或在选型后实现 | OPH-04 / 09闭合产品、权限、lease、audit | 阻塞PROFILE-05+激活,不阻塞P0 |
| platform anti-leak未验证 | open_for_05_06_07_09 | swap / core dump / SDK memory / zeroization安全专项 | AHG-06/07与P05+资格消费 | 交付hardening / scan boundary | secure runtime / incident / evidence保留 | 阻塞使用真实material的profile |
| rollout / desired / observed carrier未选 | open_for_07_09 | contract suite验证状态语义 | AHG-10~12不接受猜测marker | 选择ops-private integration boundary且不扩L4 public API | OPH-06 / 08闭合store / scope / observation | 阻塞真实rollout / drift acceptance |
| process orchestration / traffic / drain未定义 | open_for_07_09 | controlled rollback / failure drill设计 | AHG-11 / 19按scope裁决 | 规划deployment integration,不伪zero-downtime | OPH-05~08写真实顺序 /补救 | 阻塞P06+ rollout readiness |
| alert产品 /阈值 /聚合 / runbook未定义 | open_for_05_06_07_09 | 验证ALC safe signal与可路由性 | AHG-16 / 19消费真实alert evidence | 实现safe hook和产品adapter boundary | OPH-12定义severity / threshold / pager | 阻塞需要operational alert资格的profile |
| immediate revoke callback不存在 | contained_future_reopen | 只测existing hook detect + stop-new-use | AHG-07不要求即时push | 当前不实现;若需求出现先`wait_design` | OPH-09不声称即时callback | 需求明确要求时立即阻塞并回写`03/04` |
| remote / admin / reload / LKG / hot swap unsupported | blocker_if_requested | negative absence / declaration reject | AHG-18 | 当前不得排实现boundary | 不写操作命令 / fallback runbook | 任一下游要求时阻塞并重开`03/04` |
| P07 production-like inactive | inactive_target | 只设计future validation前置,不宣称可执行 | AHG-19保持not applicable / blocked直到完整evidence | 不排current production rollout boundary | OPH-17只保留future trigger | 当前任何启用 / ready / accepted声明均阻塞 |

当前没有阻塞Step 12完成的上游blocker。表中缺口均有明确owner和转阻塞时机;这不等于缺口已解决或对应profile已qualified。

### 9.14 Historical Material后置差异审计

| Historical material | 与当前基线冲突 | 当前处理 | 下游必须如何重建 |
|---|---|---|---|
| 旧`05`以`SandboxExecution` / `SandboxSession` / `SandboxCommand` / `SandboxOutput`为主线 | 与正式`00~03`当前对象、协议和状态机不一致 | historical_material;不得继承用例 / fixture / assertion | 从正式`03`测试切口、TSH和FDT重新提取对象与场景 |
| 旧`05`使用`local host runtime` / `real-like host runtime` | 违反P01~04 non-executing和P05 candidate backend / no-host-fallback | rejected historical direction | 按PROFILE-01~07环境 / adapter mode重建 |
| 旧`05`写`cleanup disabled by default`方向 | 违反所有profile guard-first / cleanup / redline不可关闭 | rejected historical direction | 以I065~I075、CFM-36、AHG-04/13为负向门禁 |
| 旧`05/06`使用capability allowlist作为sandbox本地配置 /真相 | policy / allowlist truth不归sandbox;当前只消费body-free summary且fail-closed | historical boundary conflict | 按policySource / backendCapability与依赖裁剪重建 |
| 旧`05`的`dev/test/staging`配置矩阵 | 未映射当前ENV / PROFILE稳定ID,且包含未经资格的产品语义 | historical only | 使用Step 6的ENV-01~07 / PROFILE-01~07 |
| 旧`05`的TC-001~TC-012与报告 /证据描述 | 属旧对象链,且没有当前run_id / fixed evidence identity | 不继承编号或结果 | 新`05`按自身SOP重新编号并明确evidence schema;真实执行后才有结果 |
| 旧`06`以旧execution/session/output链和host staging为验收基线 | 与当前正式设计和profile资格冲突 | historical_material;不得作为acceptance baseline | 从正式`00` AC / VF、正式`03`、AHG和新版`05`重建 |
| 旧`06`“是否通过”列均为空checkbox、最终结论待评审 | 不是验收签署或真实证据,也不能证明旧门禁通过 | 保持未验收事实;不得润色为pass | 新`06`绑定真实fixed evidence后再裁决 |

### 9.15 下游承接停审记录

| 下游目标 | 输入覆盖 | 职责边界 | no-fabrication | 开放缺口owner | 结论 /修正 |
|---|---:|---:|---:|---:|---|
| `05-测试方案.md` | 是 | 是 | 是 | 是 | 通过;TSH-01~20、FDT-01~30、EHR-01~20为输入,旧`05`必须full-restart |
| `06-验收标准.md` | 是 | 是 | 是 | 是 | 通过;AHG-01~19与EHR为输入,不提前分配正式ID /签署 |
| `07-实施计划.md` | 是 | 是 | 是 | 是 | 通过;IMH-01~16为任务族,正式`07`才拆boundary并创建全部ledger skeleton |
| `09-部署与运维手册.md` | 是 | 是 | 是 | 是 | 通过;OPH-01~18为运行主题,无真实产品 /值 /命令声明 |
| PROFILE-01~07 | 是 | 是 | 是 | 是 | 通过;成熟度、不可传递资格和P05+ blocker明确 |
| SBX-CP-01~11 | 是 | 是 | 是 | 是 | 通过;全部控制面均有四类下游owner |
| 40配置组 / I001~I101 | 是 | 是 | 是 | 是 | 通过;§9.11按Step 7顺序覆盖全部item |
| evidence maturity | 是 | 是 | 是 | 是 | 通过;EHR仅planned requirement,无EV / run_id / pass事实 |
| historical material | 是 | 是 | 是 | 是 | 通过;旧`05/06`冲突已隔离,不作当前下游输入 |

### 9.16 跨下游承接审计表

| 审计项 | 结论 | 证据 /修正 | unresolved缺口 |
|---|---|---|---|
| 是否满足SOP必出下游承接表 | 是 | §9.1 / §9.3 | 无 |
| Step 6 profile是否全部承接 | 是 | §9.9覆盖PROFILE-01~07 | P05+资格仍open,owner明确 |
| Step 7配置项是否全部承接 | 是 | §9.11覆盖40组 / I001~I101 | 无 |
| Step 11失效 /测试切口是否承接 | 是 | TSH-01~20、AHG、EHR;FDT-01~30交`05` | 无 |
| Step 8 / 9 / 10是否因SOP最小输入而遗漏 | 否 | sensitive、activation、change / rollback / drift均进入四类handoff | 无 |
| 11控制面是否都有测试 /验收 /实施 /运维owner | 是 | §9.10 | 无 |
| 是否替`05`写完整用例 | 否 | 只定义TSH、最小场景与后续补全字段 | 正式`05`待full-restart |
| 是否替`06`作裁决 /签署 | 否 | AHG只是handoff requirement,EHR均planned | 正式`06`待full-restart |
| 是否替`07`拆phase / commit | 否 | IMH只到task family;未创建ledger / skeleton | 正式`07`缺失 |
| 是否替`09`写命令 /真实值 /产品 | 否 | OPH只定义主题 /边界 /前置 | 正式`09`缺失 |
| 是否伪造TC / EV / AC / VF / VETO / run_id | 否 | 本文件未分配真实下游ID;EHR明确非alias | 无 |
| 是否把设计状态当实现 /测试 /验收事实 | 否 | profile和evidence成熟度均写明当前事实 | 无 |
| 下游是否可改写配置契约 | 否 | §9.12固定冲突回`04/03` | 无 |
| 旧`05/06`是否被继承 | 否 | §9.14后置审计为historical_material | 后续必须重建 |
| implementation ledger / boundary skeleton是否提前创建 | 否 | 文件门禁待机械检查 | 正式`07`完成时必须同时创建 |
| 是否需要当前回写`03` | 否 | handoff只分配文档责任,不新增public carrier / flow / state | future trigger见§9.13 |

### 9.17 Historical Material / Blocker记录

| ID | 类型 | 状态 | 冲突 /缺口 | 本Step处理 |
|---|---|---|---|---|
| SBX-CFG-HANDOFF-001 | design gap | resolved_for_cfg_step_12 | Step 6~11分别有下游方向,但缺少统一责任、证据成熟度、覆盖和冲突回退链 | 本文件已闭合DSH / TSH / AHG / EHR / IMH / OPH、profile、控制面、40组和跨下游审计 |
| SBX-CFG-HANDOFF-EVIDENCE-001 | evidence maturity guard | resolved_by_planned_requirement_boundary | test cut / gate方向可能被误写成已存在EV / run_id / pass结果 | EHR只表示planned requirement;真实identity必须由后续正式`05/06`和执行形成 |
| SBX-CFG-HANDOFF-HIST-001 | historical_material | contained | 旧`05/06`对象、host runtime、环境和空checkbox可能回流为当前测试 /验收事实 | §9.14已隔离,后续必须full-restart |
| SBX-CFG-HANDOFF-TEST-001 | downstream document gap | open_for_05_full_restart | 正式`05`当前仍是旧文档链 | 不阻塞Step 12;未来按测试SOP从正式`00~04`及TSH / FDT / EHR重建 |
| SBX-CFG-HANDOFF-ACCEPT-001 | downstream document gap | open_for_06_full_restart | 正式`06`当前仍是旧文档链且无当前evidence裁决 | 不阻塞Step 12;未来在新版`05`后按验收SOP重建AHG /证据绑定 |
| SBX-CFG-HANDOFF-IMPLEMENT-001 | downstream document gap | open_for_07 | 正式`07`、implementation ledger和planned boundaries不存在 | 不阻塞Step 12;正式`07`完成时必须同步创建全部台账骨架 |
| SBX-CFG-HANDOFF-OPS-001 | downstream document gap | open_for_09 | 正式`09`不存在,真实产品 /路径 /命令 /阈值未定义 | 不阻塞Step 12;只在implemented / qualified baseline后创建运行态手册 |
| SBX-CFG-HANDOFF-ACTIVATION-001 | P05+ activation gap | open_for_p05_p06_p07_activation | backend、provider、platform anti-leak、rollout carrier、alert、runbook和真实evidence未闭合 | §9.13按owner分发;任何P05+资格声明前必须逐项关闭 |
| SBX-CFG-HANDOFF-FUTURE-001 | future blocker | blocker_if_requested | remote / admin / reload / LKG / hot swap / immediate callback若被下游要求,会越过当前`03/04` | 当前全部unsupported;要求时先回写`03`,再重开`04`对应Step |

当前未发现阻塞Step 12完成的上游blocker。正式`05/06/07/09`缺失或旧化是明确下游工作,不是本Step可以代做的内容;P05+ activation gaps不影响P0配置文档继续进入Step 13。

### 9.18 对下游文档的影响总表

| 下游 | 从本Step接收 | 必须继续读取 | 本Step明确不提供 |
|---|---|---|---|
| `04` Step 13 | unsupported能力、profile promotion、artifact / evidence identity和产品binding的未来演进触发 | Step 5 / 7 / 8 / 10 / 11 | migration / deprecation版本与兼容策略 |
| `04` Step 14 | 全部open / future blocker、owner和转阻塞时机 | Step 6 / 8 / 10 / 11 /本文件§9.13 / §9.17 | 风险优先级最终收口和Step 15准入裁决 |
| `05-测试方案.md` | TSH-01~20、FDT-01~30、PROFILE / 40组 / EHR和historical exclusion | 正式`00~04`、测试SOP /规范、正式`03` §15 | 完整case、真实TC / EV、run_id、结果 |
| `06-验收标准.md` | AHG-01~19、EHR-01~20、VETO候选、profile资格与no-fabrication | 正式`00~05`、验收SOP /规范 | 正式AC / VF / VETO编号、证据alias、签署 /裁决 |
| `07-实施计划.md` | IMH-01~16、40组binding、blocker转换、ledger / skeleton创建义务 | 正式`00~06`、实施SOP /规范、代码实施台账规范 | phase / commit boundary、baseline hash、实现commit、台账文件 |
| `09-部署与运维手册.md` | OPH-01~18、ALC / RCV、provider / rollout / alert / profile activation gap | implemented baseline、正式`04~07`、真实产品 /证据 /验收 | 路径、值、命令、产品、阈值、pager、runbook |

---

## 10. 对详细设计的影响判定

| 配置结论 | 是否影响`03` | 判定依据 | 回写位置 | 状态 |
|---|---:|---|---|---|
| `05/06/07/09`责任分层与handoff ID | 否 | 文档治理 /追溯分类,不进入runtime object / protocol | 不适用 | no_writeback |
| TSH / AHG / EHR只表示future requirement | 否 | 不新增test / acceptance runtime carrier,不伪造evidence | 不适用 | no_writeback |
| IMH任务族与`07` ledger创建义务 | 否 | 承接正式`03` §16和代码实施台账规范,未定义phase / boundary | 不适用 | no_writeback |
| OPH运行主题与产品 /命令留置 | 否 | 只分配operations owner,不改变Step 14 binding / Step 15 signal契约 | 不适用 | no_writeback |
| 40配置组和11控制面下游覆盖 | 否 | 仅回指既有I001~I101 / D01~D44 / formal code binding | 不适用 | no_writeback |
| rollout / desired / observed选择ops-private carrier | 否,若保持现有边界 | 承接Step 10;runtime只报告existing safe marker / availability | 不适用 | open_for_07_09_no_writeback |
| provider产品、principal、audit和lease实现 | 否,若只实现infra-private S04 facility | 承接Step 8 existing adapter constructor边界 | 不适用 | open_for_p05_activation_no_writeback |
| 新runtime mutation / change query / repository | 是,若要求 | 新增object、port、DTO、authorization、idempotency、flow和audit | `03` Step 6~15 | blocker_if_requested |
| remote config、admin override、reload、online LKG、partial / hot swap | 是,若要求 | 改变source、runtime state、concurrency、rollback、entry和audit | `03` Step 6 / 7 / 9 / 10 / 12~15 | blocker_if_requested |
| immediate revocation callback / adapter hot-stop / new failure DTO | 是,若要求 | 新增callback port、termination flow或public error carrier | `03` Step 7~9 / 12 / 14 / 15 | blocker_if_requested |

本Step没有当前`待回写`项。No-writeback成立的前提是DSH / TSH / AHG / EHR / IMH / OPH均保持文档级handoff ID,实现和运维复用正式`03`既有contract,且下游不引入本表列出的future public capability。

---

## 11. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_12_downstream_handoff.md`
>
> 延伸阅读:
> - 建议继续阅读本文件“下游责任模型”“证据成熟度”“`05/06/07/09`详细承接”“PROFILE资格”“控制面 / 40配置组覆盖”“不得重复定义的配置契约”“Blocker分发”“Historical Material审计”和“跨下游承接审计”。

正式`04-配置设计.md` §12应回填:

1. DSH-01~04下游责任模型和责任链。
2. evidence maturity规则,明确EHR不是EV alias / run_id /通过结果。
3. 总下游承接表。
4. TSH-01~20测试方案handoff,并要求`05`逐项承接FDT-01~30。
5. AHG-01~19验收门禁handoff和VETO候选方向。
6. EHR-01~20未来证明命题、producer / consumer和当前事实。
7. IMH-01~16实施任务族与正式`07` ledger / planned skeleton同步创建义务。
8. OPH-01~18运维主题与hard guard禁止应急绕过清单。
9. PROFILE-01~07、SBX-CP-01~11和40配置组 / I001~I101覆盖表。
10. 下游不得重定义的配置契约、blocker转换和旧`05/06` historical material结论。
11. 下游停审、跨下游审计、`03`影响判定和开放缺口。

正式装配不得:

- 把TSH写成已执行test case,把AHG写成已通过acceptance gate,或把EHR写成真实EV alias / artifact。
- 给出任何run_id、固定evidence alias、test result、acceptance sign-off、risk acceptance或release approval。
- 把IMH展开成未讨论的phase / commit boundary,或声称implementation ledger / planned skeleton已创建。
- 把OPH写成真实路径、env值、secret / endpoint / topic、产品、命令、阈值、pager或runbook。
- 继承旧`05/06`的execution/session/command/output对象、host runtime、old environment或空checkbox。
- 让下游改变I001~I101、PROFILE、source、S04、validation、activation、change、failure或正式`03`契约。

---

## 12. 待确认事项

| 事项 | 当前状态 | 是否阻塞Step 12 | 后续owner /处理 |
|---|---|---:|---|
| 正式`05` full-restart时间与最终test / evidence编号 | open_downstream | 否 | 完成正式`04`后按测试SOP重建,消费TSH / FDT / EHR |
| 正式`06` full-restart时间、VETO编号和evidence alias绑定 | open_downstream | 否 | 新版`05`后按验收SOP重建,不得提前签署 |
| 正式`07` phase / boundary和目标实现仓创建策略 | open_downstream | 否 | `07`按IMH与正式`03~06`裁决;完成时同步全部ledger skeleton |
| 正式`09`创建时间 | open_downstream | 否 | 在实现 /产品 /证据 /验收事实形成后按运维规范创建 |
| provider产品、principal、native audit和anti-leak qualification | P05+ activation gap | 否 | `05/06/07/09`共同闭合;未闭合不得P05+ |
| backend产品 / capability matrix与四维conformance环境 | P05+ activation gap | 否 | ADR / `05/06/07/09`;no host / fake fallback |
| rollout / desired / observed carrier和fleet completion | open_for_07_09 | 否 | `07/09`选择ops-private carrier;需要L4 public API时先回`03` |
| traffic / drain / zero-downtime和rollback runbook | open_for_07_09 | 否 | `07/09`基于真实topology闭合,当前不声明能力 |
| alert产品、severity / threshold / aggregation / pager | open_for_05_06_07_09 | 否 | `05`验证signal,`06`门禁,`07`hook,`09`产品 / runbook |
| remote / admin / reload / LKG / hot / immediate callback未来需求 | unsupported_future | 否 | Step 13 / 14登记;一旦要求先回写`03`并重开`04` |
| PROFILE-07 production-like目标是否保留 /何时激活 | inactive_target | 否 | Step 13 / 14定义演进与风险;当前任何激活均reject |

---

## 13. 进入下一步条件

| 条件 | 结果 | 说明 |
|---|---|---|
| 用户已确认Step 11 | 通过 | 本次确认只放行Step 12 |
| DSH-01~04责任模型连续且边界明确 | 通过 | §9.1编号连续且责任唯一 |
| TSH-01~20测试handoff连续 | 通过 | §9.4编号连续 |
| AHG-01~19验收handoff连续 | 通过 | §9.5编号连续 |
| EHR-01~20证据需求连续且无伪造identity | 通过 | §9.2 / §9.6编号连续;均为planned requirement |
| IMH-01~16实施任务族连续且未拆commit | 通过 | §9.7编号连续;未定义phase / commit boundary |
| OPH-01~18运维主题连续且无命令 /真实值 | 通过 | §9.8编号连续 |
| PROFILE-01~07全部承接 | 通过 | §9.9集合完整 |
| SBX-CP-01~11全部承接 | 通过 | §9.10集合完整 |
| 40配置组 / I001~I101完整覆盖且顺序一致 | 通过 | §9.11与Step 7 / Step 11同名同序;I001~I101恰好覆盖一次 |
| D01~D44逐域责任完整且顺序一致 | 通过 | §9.11与Step 9同名同序;44域均有测试 /验收 /实施 /运维责任 |
| FDT-01~30已明确交`05`逐项承接 | 通过 | §9.4结论 / §9.18 |
| 下游不得重复定义的配置契约明确 | 通过 | §9.12 |
| open blocker均有owner和转阻塞时机 | 通过 | §9.13 / §9.17 |
| 旧`05/06`已后置审计为historical material | 通过 | §9.14 |
| 下游停审和跨下游审计无unresolved conflict | 通过 | §9.15 / §9.16;开放缺口均有owner,无阻塞本Step的上游冲突 |
| 对`03`影响已判定 | 通过 | 当前无待回写;future blocker已登记 |
| 未创建正式`04`、Step 13、implementation ledger、boundary skeleton或实现类文件 | 通过 | 文件检查未发现上述提前产物 |

```text
current_document = `04-配置设计.md`
current_step = Step 12 `定义测试、验收、实施与运维承接`
gate_status = passed_to_step_13
next_allowed_action = Step 13已按门禁创建并完成;当前等待用户审查`04_config_step_13_migration_deprecation_evolution.md`
formal_document_write = not_started
commit_required = no
```
