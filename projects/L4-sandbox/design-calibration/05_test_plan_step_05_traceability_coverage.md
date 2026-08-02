# Step 5. 建立需求追溯与覆盖矩阵

> 对应SOP: `standards/document/测试方案讨论流程_SOP.md` Step 5
> 书写规范: `standards/document/测试方案书写规范.md` §5.5
> 回填章节: `05-测试方案.md` §5 需求追溯与覆盖矩阵
> 生成日期: 2026-07-12
> 状态: reviewed_passed_to_step_6
> 所属流程: `05_test_plan_calibration_flow.md`
> 本Step口径: 建立正式需求 /规则 /验收 /设计到`CUT-SBX-001~038`的双向追溯,并预留case batch candidate与planned evidence requirement。本文不创建正式TC、EV alias、suite、artifact、run、结果或验收裁决,不修改旧正式`05`。

---

## 1. Step开工确认与状态

| 检查项 | 结论 |
|---|---|
| 用户是否确认Step 4并允许进入Step 5 | 是。用户审查Step 4后回复“同意”,本次只放行Step 5。 |
| 项目台账与flow是否允许进入Step 5 | 是。原恢复点为Step 4 `pass_wait_review`;用户确认后解除门禁。 |
| 是否读取Step 5标准 | 是。已读取测试SOP Step 5与书写规范§5.5,必须形成双向矩阵、未覆盖项、停审和跨覆盖审计。 |
| 是否读取正式需求全集 | 是。已机械盘点C-SBX-1~5、FR-SBX-001~018 / E01~E06、BR-SBX-001~033、AC-SBX-001~041、VF-SBX-001~010和六类NFR。 |
| 是否读取已确认Step 1~4 | 是。P0-C / P0-Q、CUT-SBX-001~038和L1~L6层级保持不变。 |
| 是否读取配置证据handoff | 是。EHR-01~20仍是planned requirement,不得误写为EV或执行事实。 |
| 是否参考L1粒度 | 是。参考L1-governance / L1-artifact Step 5结构,但按L4-sandbox正式编号和P0-Q风险重建。 |
| 当前状态 | 前向需求矩阵、38 CUT反向矩阵、EHR承接、未覆盖项、停审和跨矩阵审计已收稳;用户已确认并传递至Step 6。 |
| 是否发现阻塞Step 5的上游设计blocker | 否。全部P0命题均能回指正式设计和切口;执行blocker不等于追溯空洞。 |
| 停审方式 | Step 5停审已由用户确认解除;当前审查门禁位于Step 6。 |

---

## 2. 本步目标与非范围

本Step必须完成:

1. 从C / FR / BR / AC / VF / NFR正向定位设计章节、CUT、场景候选、case batch candidate和planned evidence requirement。
2. 从CUT-SBX-001~038反向定位至少一个需求 /规则 /验收命题或明确的设计风险。
3. 为每个P0命题记录自动化判断和设计覆盖状态,把P0-Q执行blocked与设计未覆盖区分开。
4. 逐项承接EHR-01~20,但不创建EV alias、artifact路径或执行结果。
5. 单列FR-SBX-E01~E06、AC-SBX-024/025和AC-SBX-036量化部分的P1 / P2边界;AC-SBX-036结构性部分仍须覆盖,不得把外围增强计入P0补偿。
6. 审计孤儿需求、孤儿CUT、重复planned ID、P0自动化缺口和phase boundary。

本Step不定义:

- 正式TC编号、前置、输入、步骤、预期字段 /状态 /副作用;留给Step 6。
- fixture / builder / seed、隔离键与清理;留给Step 7。
- 环境、backend产品、profile实例和dedicated lab拓扑;留给Step 8。
- suite、命令、CI触发、artifact / report路径和阻断实现;留给Step 9。
- 性能硬阈值、安全 /恢复专项执行方法;留给Step 10。
- 正式evidence schema、EV alias、retention和验收消费;留给Step 13与新版`06`。
- 正式`05-测试方案.md`;只允许Step 15装配。

---

## 3. 本步输入

| 输入 | 状态 | 本Step用途 |
|---|---|---|
| `00-需求文档.md` §7 / §9 / §10 / §13 / §14 / §16 | current reviewed baseline | 提供全部C / FR / BR / AC / VF / NFR及上游追溯 |
| `01-架构设计.md` §7~§13 | current architecture baseline | 固定依赖裁剪、truth ownership、通信和安全红线 |
| `03-详细设计.md` §5~§15 | direct formal input | 提供七模块、55协议、状态、事务、错误、幂等、配置和观测契约 |
| `04-配置设计.md` §6 / §8~§14 | direct formal input | 提供profile、配置 /安全 /失效命题和资格上限 |
| `04_config_step_12_downstream_handoff.md` | planned handoff input | 提供TSH / FDT / AHG / EHR映射;均非执行事实 |
| `05_test_plan_step_02_scope.md` | reviewed | 固定P0 / P1 / P2、SCP-SBX-001~036、VF / veto和非范围 |
| `05_test_plan_step_03_test_objects_cuts.md` | reviewed | 固定CUT-SBX-001~038、55协议和36个P0停审 |
| `05_test_plan_step_04_strategy_layers.md` | reviewed_passed_to_step_5 | 固定L1~L6、主发现层、补强层和P0传播 |
| L1-governance / L1-artifact Step 5 | granularity reference | 参考双向矩阵、planned ID成熟度和跨项审计结构 |

---

## 4. Step内执行记录

| 序号 | 动作 | 状态 | 产物 /门禁 |
|---:|---|---|---|
| 1 | 恢复Step 4、flow和项目台账 | done | 用户确认只放行Step 5 |
| 2 | 读取SOP Step 5、书写规范§5.5和L1参考 | done | 固定双向追溯与停审要求 |
| 3 | 机械盘点正式需求 /规则 /验收编号 | done | 5 C、18核心FR、6增强FR、33 BR、41 AC、10 VF、6类NFR |
| 4 | 定义CBC / PER设计期预留规则 | done | 与38个CUT一一对应,不创建TC / EV |
| 5 | 构造需求正向矩阵和CUT反向矩阵 | done | P0无孤儿,enhancement不计P0补偿 |
| 6 | 承接EHR-01~20并完成停审 /总审计 | done | 无真实evidence identity或结果 |
| 7 | 完成影响判定、回填草稿和门禁 | done | 无当前上游回写;P0-Q执行blocker保留 |
| 8 | 更新Step 4、flow和项目台账 | done | 三方状态已同步到Step 5审查点;Step 6仍被用户审查门禁阻塞 |

---

## 5. 设计期ID与覆盖状态规则

| ID /状态 | 含义 | 后续转换 | 明确禁止解释 |
|---|---|---|---|
| `CUT-SBX-001~038` | 已确认测试切口 | Step 6~13继续消费 | 不是case、suite或结果 |
| `CBC-SBX-001~038` | case batch candidate,与同序CUT一一对应 | Step 6可拆成多个正式TC并逐批停审 | 不是TC编号或已实现用例 |
| `PER-SBX-001~038` | planned evidence requirement,与同序CUT一一对应 | Step 9 /13绑定suite / artifact / report schema后,真实执行才产生证据 | 不是EV alias、artifact、run或通过事实 |
| `EHR-01~20` | 正式`04`移交的配置侧planned requirement | 本Step映射到PER,后续继续绑定 | 不重命名为EV,不宣称已满足 |
| `covered_designed` | 需求到设计 / CUT / CBC / PER追溯完整 | 允许进入Step 6用例设计 | 不表示测试已实现或执行 |
| `covered_designed_execution_blocked` | 追溯完整,但P0-Q或后置产品执行前置未形成 | 设计可继续;核心资格保持blocked | 不等于未覆盖、N/A或pass |
| `covered_designed_quantitative_pending` | 结构性命题已追溯;依赖产品 /负载模型的量化门槛待Step 10裁定 | Step 6先展开结构性case,Step 10决定候选阈值是否成为门禁 | 不得把整项降为conditional,也不表示已有性能结果 |
| `conditional_non_p0` | P1 / P2 / enhancement有去向但不计P0 | 激活前按trigger重开或关闭前置 | 不得补偿P0失败 |

自动化判断只表达设计责任:

- P0-C CBC必须成为可重复自动化或可重复static gate候选;Step 9才定义具体suite /脚本 /命令。
- P0-Q CBC必须成为L5 dedicated conformance harness候选;当前因backend / capability / environment缺失标执行blocked,不能降为人工确认。
- 物理破坏性safety场景即使需要受控人工启动,其步骤、结果采集和判定仍必须可重复且可留证;不能用自由文本签字替代。

---

## 6. SOP问题回答与设计取舍

| SOP问题 /议题 | 本Step结论 |
|---|---|
| 每个P0需求对应哪些设计章节 | C / FR / BR / AC / VF均回指正式`03` §5~§15;配置 /profile命题叠加正式`04` §6 / §8~§14。详见§7。 |
| 每个P0需求至少有哪些场景 | 至少一个主线 /合法状态场景和一个关键负向 /拒绝 /禁止副作用场景;具体TC拆分留Step 6。 |
| 哪些场景必须自动化 | CUT-001~033必须自动化或static gate;CUT-034~036必须进入可重复L5 harness;不能仅写人工确认。 |
| 场景证据如何编号 | 本Step预留PER-SBX-001~038,后续绑定真实producer / artifact schema;当前不创建EV。 |
| 哪些需求暂未覆盖 | 当前P0无未覆盖项。FR-SBX-E01~E06、AC-SBX-024~025与AC-SBX-036量化候选为conditional non-P0;AC-SBX-036结构性部分已覆盖;P0-Q为执行blocked而非未覆盖。 |
| 每个CUT是否有需求 /设计去向 | 是。CUT-001~036回指正式需求 /规则 /验收;CUT-037回指P1与conditional AC;CUT-038回指enhancement / production重开触发。 |
| 是否逐条创建正式TC | 否。Step 5只创建CBC批次候选,Step 6按CUT逐批展开正式TC和断言。 |
| 是否沿用旧TC / evidence | 否。旧TC-001~012、旧环境和旧checkbox保持historical material。 |

---

## 7. 正向需求覆盖矩阵

### 7.1 核心能力闭环C-SBX-1~5

| 需求ID | 设计依据 | CUT /层级 | 场景候选 | CBC / PER | 自动化 | 覆盖状态 |
|---|---|---|---|---|---|---|
| C-SBX-1 语境 / identity /统一入口 | `03` §6~§9 / §14 | CUT-001~003/009~011/014/022/024/026/031~033;L1~L4 | 正式受理与归责;missing / conflict /匿名 /正文 /旁路拒绝;query no-write | CBC / PER-001~003/009~011/014/022/024/026/031~033 | 必须 | covered_designed |
| C-SBX-2 coherent isolation boundary | `03` §6~§13;`04` PROFILE-05 | CUT-004/009/015/022/025~028/031/033/034/036;L1~L5 | 四维整体裁定、unsupported整体拒绝、真实越界阻断、no host fallback | CBC / PER-004/009/015/022/025~028/031/033/034/036 | 必须;L5当前blocked | covered_designed_execution_blocked |
| C-SBX-3 policy内执行 / fail-closed | `03` §6~§13 | CUT-005/009/011/016/021/022/024/026/028/031~033/034/036;L1~L5 | policy accepted;missing / stale / conflict / unauthorized拒绝;真实高风险动作不越界 | CBC / PER-005/009/011/016/021/022/024/026/028/031~034/036 | 必须;适用L5 blocked | covered_designed_execution_blocked |
| C-SBX-4 capture / handoff分层 | `03` §6~§14;`04` sensitive / handoff | CUT-006/009~013/017/020/022/024~026/029/031/032/035/036;L1~L5 | run / capture / handoff主线;partial / delivery failure no rollback;真实capture / inspect | CBC / PER-006/009~013/017/020/022/024~026/029/031/032/035/036 | 必须;L5当前blocked | covered_designed_execution_blocked |
| C-SBX-5 failure / cleanup / redline | `03` §6~§14;`04` safety profiles | CUT-007/008/011~013/015/018~022/024~026/029/031/032/035/036;L1~L5 | stable failure、guard-first、orphan / reaper、contained redline、真实guarded release | CBC / PER-007/008/011~013/015/018~022/024~026/029/031/032/035/036 | 必须;L5当前blocked | covered_designed_execution_blocked |

### 7.2 核心功能FR-SBX-001~018

| 需求ID | 正式设计 /主要CUT | 场景候选 | CBC / PER | 自动化 | 覆盖状态 |
|---|---|---|---|---|---|
| FR-SBX-001 请求语境接入 | `03` intake flow;CUT-001~003/009/014/022/024/026/031/032 | accepted、missing actor / ref、forbidden body、duplicate / conflict、rollback | CBC / PER-001~003/009/014/022/024/026/031/032 | 必须 | covered_designed |
| FR-SBX-002 identity /责任链绑定 | `03` identity / resolution;CUT-001~003/009~011/014/022/023/026/031/032 | identity resolved / rejected / unresolved、wrong ref family、来源可回链 | CBC / PER-001~003/009~011/014/022/023/026/031/032 | 必须 | covered_designed |
| FR-SBX-003 跨调用方统一入口 | `03` entry adapters;CUT-001~003/009~011/013/031/033/036 | API / worker / job同语义、旁路 / host / direct-repo拒绝、identity绑定 | CBC / PER-001~003/009~011/013/031/033/036 | 必须 | covered_designed |
| FR-SBX-004 正式隔离环境建立 | `03` boundary / backend flow;CUT-004/009/015/022/025/026/031/034/036 | establish成功 / unsupported / unavailable / race;candidate真实launch,no host fallback | CBC / PER-004/009/015/022/025/026/031/034/036 | 必须;L5 blocked | covered_designed_execution_blocked |
| FR-SBX-005 四维统一限制 | `03` coherent boundary;CUT-004/015/025/027/028/031/034/036 | resource / fs / network / process同代;任一缺失整体拒绝;真实越界阻断 | CBC / PER-004/015/025/027/028/031/034/036 | 必须;L5 blocked | covered_designed_execution_blocked |
| FR-SBX-006 可落实性校验 /拒绝 | `03` capability / error;CUT-004/015/026~028/031/033/034/036 | stale / unsupported / unverified / partial / weak fallback拒绝 | CBC / PER-004/015/026~028/031/033/034/036 | 必须;L5 blocked | covered_designed_execution_blocked |
| FR-SBX-007 启动前policy语境 | `03` policy flow;CUT-003/005/009/011/016/022/024/026/031/032 | snapshot / ref承接、missing / stale / conflict、policy body拒绝 | CBC / PER-003/005/009/011/016/022/024/026/031/032 | 必须 | covered_designed |
| FR-SBX-008 策略内执行 /高风险阻断 | `03` policy + run + safety;CUT-004~007/009/016~018/025/026/034~036 | allow主线、unauthorized / boundary expansion阻断、真实高风险越界不成功 | CBC / PER-004~007/009/016~018/025/026/034~036 | 必须;L5 blocked | covered_designed_execution_blocked |
| FR-SBX-009 policy不完备保守拒绝 | `03` fail-closed;CUT-005/016/021/026~028/031/033/036 | missing / conflicted / unsupported / unavailable均不allow,无degraded授权 | CBC / PER-005/016/021/026~028/031/033/036 | 必须 | covered_designed |
| FR-SBX-010 跨调用方统一policy口径 | `03` command / consumer / entry;CUT-002/005/009/011/016/024/031/033/036 | API / worker / job相同snapshot / digest / failure语义,无第二套decision | CBC / PER-002/005/009/011/016/024/031/033/036 | 必须 | covered_designed |
| FR-SBX-011 输出统一捕获 | `03` run / capture;CUT-006/009/010/012/017/022/024~026/029/032/035 | complete / partial / failed capture、body-free refs、timeout后真实capture / inspect | CBC / PER-006/009/010/012/017/022/024~026/029/032/035 | 必须;L5 blocked | covered_designed_execution_blocked |
| FR-SBX-012 候选材料安全收口 | `03` capture / material handoff;CUT-006/009/012/017/022/024/026/029/032/035/036 | candidate refs、不升格artifact、raw output拒绝、handoff failure保留capture | CBC / PER-006/009/012/017/022/024/026/029/032/035/036 | 必须;L5 blocked | covered_designed_execution_blocked |
| FR-SBX-013 观测 /审计材料交接 | `03` audit / handoff;CUT-006/008/011~013/017/019/020/022/026/029/032/035/036 | usage / trace / audit safe carrier、formal audit同UoW、sink失败no rollback | CBC / PER-006/008/011~013/017/019/020/022/026/029/032/035/036 | 必须;L5 blocked | covered_designed_execution_blocked |
| FR-SBX-014 跨调用方统一回收链 | `03` capture / handoff protocols;CUT-006/009~013/017/022/024~026/031/036 | API / consumer / event / job使用同一capture / handoff owner与stored replay | CBC / PER-006/009~013/017/022/024~026/031/036 | 必须 | covered_designed |
| FR-SBX-015 失败分类 | `03` error / failure;CUT-007/009~013/018/021/022/024~026/031/032/035 | 38错误producer / safe surface / recovery、unknown不成功、真实backend failure | CBC / PER-007/009~013/018/021/022/024~026/031/032/035 | 必须;L5 blocked | covered_designed_execution_blocked |
| FR-SBX-016 redline保守收束 | `03` redline / safety;CUT-007/009/011~013/018/022/025/026/029/032/035/036 | detected -> contained、advisory-only禁止、handoff失败仍contained、真实越权收束 | CBC / PER-007/009/011~013/018/022/025/026/029/032/035/036 | 必须;L5 blocked | covered_designed_execution_blocked |
| FR-SBX-017 非happy path留痕 | `03` control / audit;CUT-007/008/009/011~013/018/020/022/024/026/029/032/035 | deny / kill / timeout / replay / cleanup事实、audit与report不可改写 | CBC / PER-007/008/009/011~013/018/020/022/024/026/029/032/035 | 必须;L5 blocked | covered_designed_execution_blocked |
| FR-SBX-018 lease / orphan保守回收 | `03` lease / cleanup / reaper;CUT-004/007/011/013/015/018/022/025/026/028/031/032/035/036 | expiry / orphan / blocked guard / no direct release / single-winner /真实inspect-release | CBC / PER-004/007/011/013/015/018/022/025/026/028/031/032/035/036 | 必须;L5 blocked | covered_designed_execution_blocked |

### 7.3 业务规则BR-SBX-001~033

| 规则ID | 主要CUT | 场景候选 | CBC / PER | 覆盖状态 |
|---|---|---|---|---|
| BR-SBX-001 | CUT-003/009/014/022/032 | 先有语境 /责任链;禁止事后补造 | CBC / PER-003/009/014/022/032 | covered_designed |
| BR-SBX-002 | CUT-003/009/014/022/032 | 正式进入显式发生;缓存 /日志不能建truth | CBC / PER-003/009/014/022/032 | covered_designed |
| BR-SBX-003 | CUT-003/004/009/031/033/034/036 | host / caller local / bypass不得宣称sandbox | CBC / PER-003/004/009/031/033/034/036 | covered_designed_execution_blocked |
| BR-SBX-004 | CUT-001/003/011/029/033 | identity / work / runner只用ref / snapshot,正文拒绝 | CBC / PER-001/003/011/029/033 | covered_designed |
| BR-SBX-005 | CUT-003/022/032 | intake accept / reject / source归责可回链 | CBC / PER-003/022/032 | covered_designed |
| BR-SBX-006 | CUT-004/006/015/031/034/036 | 真实执行只在正式隔离环境,no host replay labeling | CBC / PER-004/006/015/031/034/036 | covered_designed_execution_blocked |
| BR-SBX-007 | CUT-004/015/028/034 | 四维coherent set同代成立 | CBC / PER-004/015/028/034 | covered_designed_execution_blocked |
| BR-SBX-008 | CUT-004/015/021/026/031/034/036 | unsupported / unverified不得silent degrade | CBC / PER-004/015/021/026/031/034/036 | covered_designed_execution_blocked |
| BR-SBX-009 | CUT-004/006/007/015/017/018/022/032/035 | establish / failure / reject / target显式状态与审计 | CBC / PER-004/006/007/015/017/018/022/032/035 | covered_designed_execution_blocked |
| BR-SBX-010 | CUT-004/015/026/033/034/036 | backend outcome不反写正式边界;产品替换不改协议 | CBC / PER-004/015/026/033/034/036 | covered_designed_execution_blocked |
| BR-SBX-011 | CUT-005/009/016/031 | 高风险run前必须有正式policy语境 | CBC / PER-005/009/016/031 | covered_designed |
| BR-SBX-012 | CUT-005/016/021/026/031/033/036 | missing / conflict / unsupported无permissive fallback | CBC / PER-005/016/021/026/031/033/036 | covered_designed |
| BR-SBX-013 | CUT-005/007/016/018/026/034/035 | 越权边界 /外联识别后停止,真实越界不成功 | CBC / PER-005/007/016/018/026/034/035 | covered_designed_execution_blocked |
| BR-SBX-014 | CUT-005/009/016/022/032 | policy accept / reject / escalation显式且可审计 | CBC / PER-005/009/016/022/032 | covered_designed |
| BR-SBX-015 | CUT-001/005/011/029/033 | 只消费policy summary / ref,不拥有DSL / approval truth | CBC / PER-001/005/011/029/033 | covered_designed |
| BR-SBX-016 | CUT-002/005/009/011/016/024/031/036 | Runner / tools / automation等价语境同语义 | CBC / PER-002/005/009/011/016/024/031/036 | covered_designed |
| BR-SBX-017 | CUT-004/005/015/016/026/034/036 | 放宽边界必须有正式authorization且真实backend仍可落实 | CBC / PER-004/005/015/016/026/034/036 | covered_designed_execution_blocked |
| BR-SBX-018 | CUT-006/017/029/032 | output / candidate / observability保留来源且分层 | CBC / PER-006/017/029/032 | covered_designed |
| BR-SBX-019 | CUT-006/011/012/017/029/032 | candidate不升格artifact / baseline / evidence truth | CBC / PER-006/011/012/017/029/032 | covered_designed |
| BR-SBX-020 | CUT-006/010/017/019/032 | observability不能掩盖capture缺失;query不修复 | CBC / PER-006/010/017/019/032 | covered_designed |
| BR-SBX-021 | CUT-006/009/011/012/017/020/022/024 | 三类handoff显式发生,duplicate使用stored result | CBC / PER-006/009/011/012/017/020/022/024 | covered_designed |
| BR-SBX-022 | CUT-006/008/011/012/029/033 | 只交接ref / marker,不拥有下游truth | CBC / PER-006/008/011/012/029/033 | covered_designed |
| BR-SBX-023 | CUT-002/006/009~013/017/024/031 | Runner与其他调用方同一capture / handoff语义 | CBC / PER-002/006/009~013/017/024/031 | covered_designed |
| BR-SBX-024 | CUT-006/012/017/022/032 | output / usage / audit / capture-failure可回链 | CBC / PER-006/012/017/022/032 | covered_designed |
| BR-SBX-025 | CUT-007/018/021/026/035 | timeout / exceed / backend / capture / orphan稳定分类 | CBC / PER-007/018/021/026/035 | covered_designed_execution_blocked |
| BR-SBX-026 | CUT-007/018/026/035 | escape-like /越权必须contained,非advisory | CBC / PER-007/018/026/035 | covered_designed_execution_blocked |
| BR-SBX-027 | CUT-007/008/011~013/018~020/024/026/030 | retry / cleanup / reaper不重写相邻truth | CBC / PER-007/008/011~013/018~020/024/026/030 | covered_designed |
| BR-SBX-028 | CUT-006/007/018/029/032/035 | evidence / handoff / investigation未安全交接时cleanup blocked | CBC / PER-006/007/018/029/032/035 | covered_designed_execution_blocked |
| BR-SBX-029 | CUT-007/015/018/025/026/035 | lease expiry / orphan不得托管外继续运行 | CBC / PER-007/015/018/025/026/035 | covered_designed_execution_blocked |
| BR-SBX-030 | CUT-007/009/011~013/018/022/032/035 | deny / timeout / kill / replay / cleanup / orphan显式变化 | CBC / PER-007/009/011~013/018/022/032/035 | covered_designed_execution_blocked |
| BR-SBX-031 | CUT-007/008/018/019/026/033 | cleanup / reaper只改隔离层owner,不改产品 / policy truth | CBC / PER-007/008/018/019/026/033 | covered_designed |
| BR-SBX-032 | CUT-007/008/012/018/020/022/032/035 | control / reaper / redline均留safe audit | CBC / PER-007/008/012/018/020/022/032/035 | covered_designed_execution_blocked |
| BR-SBX-033 | CUT-007/018/026/029/032/035 | investigation保留source与containment context | CBC / PER-007/018/026/029/032/035 | covered_designed_execution_blocked |

### 7.4 验收命题AC-SBX-001~041

| AC ID | 主要CUT | 最小场景候选 | CBC / PER | 覆盖状态 |
|---|---|---|---|---|
| AC-SBX-001 | CUT-001~003/009/014/022/024/026/031/032 | 正式受理 / identity /责任链与旁路拒绝 | CBC / PER-001~003/009/014/022/024/026/031/032 | covered_designed |
| AC-SBX-002 | CUT-004/009/015/022/025/026/031/034/036 | 正式环境、四维限制、unsupported拒绝、真实施加 | CBC / PER-004/009/015/022/025/026/031/034/036 | covered_designed_execution_blocked |
| AC-SBX-003 | CUT-004/005/009/016/021/026/031/034/036 | 给定policy内执行;missing / conflict / unauthorized拒绝 | CBC / PER-004/005/009/016/021/026/031/034/036 | covered_designed_execution_blocked |
| AC-SBX-004 | CUT-006/009~013/017/020/022/026/029/032/035 | capture / handoff主线与失败显式状态 | CBC / PER-006/009~013/017/020/022/026/029/032/035 | covered_designed_execution_blocked |
| AC-SBX-005 | CUT-007/008/015/018~022/025/026/032/035 | failure / cleanup / redline稳定收束与材料保留 | CBC / PER-007/008/015/018~022/025/026/032/035 | covered_designed_execution_blocked |
| AC-SBX-006 | CUT-001~003/009/014/022/024/026/031 | FR-001 accepted / reject / duplicate / rollback | CBC / PER-001~003/009/014/022/024/026/031 | covered_designed |
| AC-SBX-007 | CUT-001~003/009/014/023/032 | FR-002 identity bind / unresolved / wrong family / trace | CBC / PER-001~003/009/014/023/032 | covered_designed |
| AC-SBX-008 | CUT-002/003/009/011/013/031/033/036 | FR-003跨API / worker / job统一入口,no bypass | CBC / PER-002/003/009/011/013/031/033/036 | covered_designed |
| AC-SBX-009 | CUT-004/009/015/022/025/031/034/036 | FR-004正式环境建立与真实launch | CBC / PER-004/009/015/022/025/031/034/036 | covered_designed_execution_blocked |
| AC-SBX-010 | CUT-004/015/028/034/036 | FR-005四维同代限制与真实越界阻断 | CBC / PER-004/015/028/034/036 | covered_designed_execution_blocked |
| AC-SBX-011 | CUT-004/015/021/026~028/031/034/036 | FR-006不可落实 /不可验证整体拒绝 | CBC / PER-004/015/021/026~028/031/034/036 | covered_designed_execution_blocked |
| AC-SBX-012 | CUT-003/005/009/016/022/031/032 | FR-007 policy snapshot / ref前置与正文拒绝 | CBC / PER-003/005/009/016/022/031/032 | covered_designed |
| AC-SBX-013 | CUT-004~007/009/016~018/026/034~036 | FR-008 allowed主线与越权高风险阻断 | CBC / PER-004~007/009/016~018/026/034~036 | covered_designed_execution_blocked |
| AC-SBX-014 | CUT-005/016/021/026~028/031/033/036 | FR-009不完备policy不best-effort | CBC / PER-005/016/021/026~028/031/033/036 | covered_designed |
| AC-SBX-015 | CUT-002/005/009/011/016/024/031/036 | FR-010跨调用方policy / failure同义 | CBC / PER-002/005/009/011/016/024/031/036 | covered_designed |
| AC-SBX-016 | CUT-006/009/010/012/017/022/024/026/029/032/035 | FR-011 capture complete / partial / failed与真实inspect | CBC / PER-006/009/010/012/017/022/024/026/029/032/035 | covered_designed_execution_blocked |
| AC-SBX-017 | CUT-006/009/012/017/022/026/029/032/035 | FR-012 candidate refs / handoff,不升格artifact | CBC / PER-006/009/012/017/022/026/029/032/035 | covered_designed_execution_blocked |
| AC-SBX-018 | CUT-006/008/011~013/017/020/022/029/032/035 | FR-013 usage / audit / trace安全分层交接 | CBC / PER-006/008/011~013/017/020/022/029/032/035 | covered_designed_execution_blocked |
| AC-SBX-019 | CUT-002/006/009~013/017/024/031/036 | FR-014跨调用方统一capture / handoff | CBC / PER-002/006/009~013/017/024/031/036 | covered_designed |
| AC-SBX-020 | CUT-007/009~013/018/021/026/032/035 | FR-015错误闭集、unknown不成功、真实backend failure | CBC / PER-007/009~013/018/021/026/032/035 | covered_designed_execution_blocked |
| AC-SBX-021 | CUT-007/009/011~013/018/026/032/035 | FR-016 redline contained,非advisory | CBC / PER-007/009/011~013/018/026/032/035 | covered_designed_execution_blocked |
| AC-SBX-022 | CUT-007/008/009/011~013/018/020/022/032/035 | FR-017非happy path控制事实与safe audit | CBC / PER-007/008/009/011~013/018/020/022/032/035 | covered_designed_execution_blocked |
| AC-SBX-023 | CUT-004/007/011/013/015/018/022/025/026/032/035 | FR-018 lease / orphan / guard / no-truth-rewrite /真实release | CBC / PER-004/007/011/013/015/018/022/025/026/032/035 | covered_designed_execution_blocked |
| AC-SBX-024 | CUT-037/038 + CUT-004/005/015/016 | E01 / E04 / E05若激活不改核心boundary / policy truth | CBC / PER-037/038;继承004/005/015/016 | conditional_non_p0 |
| AC-SBX-025 | CUT-037/038 + CUT-006~008/017~019/032 | E02 / E03 / E06若激活不改capture / investigation / observability truth | CBC / PER-037/038;继承006~008/017~019/032 | conditional_non_p0 |
| AC-SBX-026 | CUT-001~003/009/014/022/029/031~033 | BR-001~005正式受理 /归责 /外部truth边界 | CBC / PER-001~003/009/014/022/029/031~033 | covered_designed |
| AC-SBX-027 | CUT-004/006/015/021/026/028/031/033/034/036 | BR-006~010隔离 / backend边界 | CBC / PER-004/006/015/021/026/028/031/033/034/036 | covered_designed_execution_blocked |
| AC-SBX-028 | CUT-004/005/009/016/021/026/029/031/033/034/036 | BR-011~017 fail-closed / policy来源边界 | CBC / PER-004/005/009/016/021/026/029/031/033/034/036 | covered_designed_execution_blocked |
| AC-SBX-029 | CUT-006/008/009~013/017/020/022/029/032/035 | BR-018~024 capture / handoff / downstream truth边界 | CBC / PER-006/008/009~013/017/020/022/029/032/035 | covered_designed_execution_blocked |
| AC-SBX-030 | CUT-007/008/011~013/015/018~022/025/026/029/032/035 | BR-025~033 failure / cleanup / reaper边界 | CBC / PER-007/008/011~013/015/018~022/025/026/029/032/035 | covered_designed_execution_blocked |
| AC-SBX-031 | CUT-001/009~013/023/031/033 | 四类接口 /55协议与唯一sibling compile依赖 | CBC / PER-001/009~013/023/031/033 | covered_designed |
| AC-SBX-032 | CUT-003~008/014~022/032 | execution isolation truth owner与same-UoW audit | CBC / PER-003~008/014~022/032 | covered_designed |
| AC-SBX-033 | CUT-003~008/019/023/029/033 | context / capability / policy / handoff snapshot不升格truth | CBC / PER-003~008/019/023/029/033 | covered_designed |
| AC-SBX-034 | CUT-001~007/011/023/029/033/036 | typed refs不接管identity / work / policy / downstream生命周期 | CBC / PER-001~007/011/023/029/033/036 | covered_designed |
| AC-SBX-035 | CUT-001~008/011~013/026/029/032/035/036 | 外部正文 / raw material全carrier拒绝与扫描 | CBC / PER-001~008/011~013/026/029/032/035/036 | covered_designed_execution_blocked |
| AC-SBX-036 | CUT-004~007/025/030 + CUT-037/038 | 核心路径不被optional增强阻断、race / batch有界;候选时延 /吞吐 /容量门槛留Step 10 | CBC / PER-004~007/025/030;量化候选037/038 | covered_designed_quantitative_pending |
| AC-SBX-037 | CUT-003~007/010/011/016~019/021/026/031/034~036 | 输入 /依赖缺失显式reject / blocked / degraded,不伪成功 | CBC / PER-003~007/010/011/016~019/021/026/031/034~036 | covered_designed_execution_blocked |
| AC-SBX-038 | CUT-003~007/015~018/026/029/033~036 | host / partial boundary / unauthorized / cleanup / raw body零容忍 | CBC / PER-003~007/015~018/026/029/033~036 | covered_designed_execution_blocked |
| AC-SBX-039 | CUT-003~008/012/014~022/026/032/035 | accept / establish / policy / handoff / failure / control / redline可回链 | CBC / PER-003~008/012/014~022/026/032/035 | covered_designed_execution_blocked |
| AC-SBX-040 | CUT-002/003~008/014~025/030/031/036 | execution / policy / control同一语义,幂等 /race /history不分叉 | CBC / PER-002~008/014~025/030/031/036 | covered_designed |
| AC-SBX-041 | CUT-006~008/010~013/017~021/026/029/032/035 | 关键状态 /异常 /依赖 /超限 /guard /redline可观察且safe | CBC / PER-006~008/010~013/017~021/026/029/032/035 | covered_designed_execution_blocked |

### 7.5 一票否决VF-SBX-001~010

| VF ID | 否决场景候选 | 主要CUT | CBC / PER | 自动化 | 覆盖状态 |
|---|---|---|---|---|---|
| VF-SBX-001 | 任一C-SBX节点缺失或被跳过仍汇总核心通过 | CUT-003~007/009/022/031/034~036 | CBC / PER-003~007/009/022/031/034~036 | 必须;L6只读汇总 | covered_designed_execution_blocked |
| VF-SBX-002 | host / caller local / bypass / anonymous被宣称formal sandbox | CUT-003/004/009/031/033/034/036 | CBC / PER-003/004/009/031/033/034/036 | 必须;L5 | covered_designed_execution_blocked |
| VF-SBX-003 | 四维任一silent degrade / ignored / unverified仍执行 | CUT-004/015/021/026/028/031/034/036 | CBC / PER-004/015/021/026/028/031/034/036 | 必须;L5 | covered_designed_execution_blocked |
| VF-SBX-004 | policy不完备 /未授权高风险动作继续 | CUT-005/016/021/026/031/033/034/036 | CBC / PER-005/016/021/026/031/033/034/036 | 必须 | covered_designed_execution_blocked |
| VF-SBX-005 | 保存 /拥有外部正文或truth正文 | CUT-001~008/011/026/029/032/033/036 | CBC / PER-001~008/011/026/029/032/033/036 | 必须;carrier scan | covered_designed |
| VF-SBX-006 | output / candidate / observability静默升格下游truth | CUT-006/008/011/012/017/019/029/032 | CBC / PER-006/008/011/012/017/019/029/032 | 必须 | covered_designed |
| VF-SBX-007 | cleanup / reaper先删未交接材料 | CUT-006/007/018/022/029/032/035 | CBC / PER-006/007/018/022/029/032/035 | 必须;L5 safety | covered_designed_execution_blocked |
| VF-SBX-008 | lease / orphan / redline托管外继续或未contained | CUT-007/015/018/025/026/032/035 | CBC / PER-007/015/018/025/026/032/035 | 必须;L5 safety | covered_designed_execution_blocked |
| VF-SBX-009 | 调用方 /承载 /下游形成第二套execution / policy / control语义 | CUT-002~008/009~013/014~025/030/031/036 | CBC / PER-002~025/030/031/036 | 必须 | covered_designed |
| VF-SBX-010 | 关键链路存在不可重建追溯缺口 | CUT-003~008/012/014~022/026/032/035/036 | CBC / PER-003~008/012/014~022/026/032/035/036 | 必须;L6汇总 | covered_designed_execution_blocked |

### 7.6 六类NFR与配置证据方向

| NFR类别 /正式AC | 主要CUT | 场景候选 | CBC / PER / EHR | 当前口径 |
|---|---|---|---|---|
| 性能 / AC-SBX-036 | CUT-004~007/025/030/037/038 | optional增强不阻断核心;race / batch有界;候选时延 /吞吐 /容量模型后置 | CBC / PER-004~007/025/030/037/038 | covered_designed_quantitative_pending |
| 可用性 / AC-SBX-037 | CUT-003~007/010/011/016~019/021/026/031/034~036 | missing / unavailable / downstream delay显式reject / blocked / degraded | CBC / PER对应;EHR-14~16 | covered_designed_execution_blocked |
| 安全 / AC-SBX-038 | CUT-003~007/015~018/026/029/033~036 | no host、no partial boundary、no unauthorized、no early cleanup、no leak | CBC / PER对应;EHR-05/07/08/20 | covered_designed_execution_blocked |
| 审计 /追溯 / AC-SBX-039 | CUT-003~008/012/014~022/026/032/035 | accepted audit同UoW、control / handoff / failure可回链 | CBC / PER对应;EHR-17/20 | covered_designed_execution_blocked |
| 幂等 /一致性 / AC-SBX-040 | CUT-002~008/014~025/030/031/036 | stored replay、single-winner、no rollback / truth rewrite、history immutable | CBC / PER对应;EHR-09/10/12/13/16 | covered_designed |
| 可观测性 / AC-SBX-041 | CUT-006~008/010~013/017~021/026/029/032/035 | 状态 /异常 /依赖 /超限 /guard /redline safe signal无盲区 | CBC / PER对应;EHR-07/17 | covered_designed_execution_blocked |

### 7.7 外围增强FR-SBX-E01~E06

| Enhancement | 当前去向 | 继承核心CUT | future主CUT | 覆盖状态 |
|---|---|---|---|---|
| FR-SBX-E01 风险分层承载 | 当前只保留核心boundary不变与重开触发 | CUT-004/005/015/016/033~036 | CUT-037/038 | conditional_non_p0 |
| FR-SBX-E02 高级replay / inspect / console | 当前只验证无current public surface且不绕cleanup / truth | CUT-007/008/018/019/027/033 | CUT-038 | conditional_non_p0 |
| FR-SBX-E03 preview / analysis | 当前只验证capture / handoff truth不被preview升格 | CUT-006/008/017/019/029/032/033 | CUT-038 | conditional_non_p0 |
| FR-SBX-E04 多宿主 /集群调度 | 当前只验证无第二host truth / fallback | CUT-004/007/015/018/033~036 | CUT-037/038 | conditional_non_p0 |
| FR-SBX-E05 backend比较 / policy simulation | 当前只验证summary / simulation不证明资格 | CUT-004/005/008/015/016/019/033~036 | CUT-037/038 | conditional_non_p0 |
| FR-SBX-E06 容量 /性能 /成本趋势 | 当前只验证safe derived / telemetry与候选阈值边界 | CUT-008/019/029/032 | CUT-037/038 | conditional_non_p0 |

---

## 8. CUT-SBX-001~038反向覆盖矩阵

| CUT | 需求 /规则 /验收去向 | 正式设计契约 | 最低场景候选 | Case batch candidate | Planned evidence requirement | 覆盖状态 |
|---|---|---|---|---|---|---|
| CUT-SBX-001 | FR-SBX-001~003/007/012~013;BR-SBX-004/015/022;AC-SBX-031/034/035;VF-SBX-005 | `03` §6.1 / §7.2 | public carrier roundtrip、required缺失、invalid enum / ref family、正文拒绝 | CBC-SBX-001 | PER-SBX-001 | covered_designed |
| CUT-SBX-002 | FR-SBX-001/003/010/014;BR-SBX-016/023;AC-SBX-031/040;VF-SBX-009 | `03` §7.2 / §7.7 / §12.4 | metadata必填、canonical digest、cursor / version / key禁止混同 | CBC-SBX-002 | PER-SBX-002 | covered_designed |
| CUT-SBX-003 | C-SBX-1;FR-SBX-001~003/007;BR-SBX-001~005;AC-SBX-001/006~008/026/032~035/037~040;VF-SBX-002/005/009/010 | `03` §6.1 / §9批次10.1 | accepted / rejected / unresolved、匿名 /冲突 /正文 /终态非法 | CBC-SBX-003 | PER-SBX-003 | covered_designed |
| CUT-SBX-004 | C-SBX-2;FR-SBX-004~006/008;BR-SBX-006~010/017;AC-SBX-002/009~011/027/032/038;VF-SBX-001~003 | `03` §6.1 / §9批次10.2 | coherent decision、unsupported整体拒绝、weak fallback禁止 | CBC-SBX-004 | PER-SBX-004 | covered_designed |
| CUT-SBX-005 | C-SBX-3;FR-SBX-007~010;BR-SBX-011~017;AC-SBX-003/012~015/028/037/038;VF-SBX-004 | `03` §6.1 / §9批次10.3 | allow / deny、missing / stale / conflict / unauthorized fail-closed | CBC-SBX-005 | PER-SBX-005 | covered_designed |
| CUT-SBX-006 | C-SBX-4;FR-SBX-011~014;BR-SBX-018~024;AC-SBX-004/016~019/029/039;VF-SBX-006/010 | `03` §6.1 / §9批次10.4 | run / capture / handoff owner分离、partial / failure no rollback | CBC-SBX-006 | PER-SBX-006 | covered_designed |
| CUT-SBX-007 | C-SBX-5;FR-SBX-015~018;BR-SBX-025~033;AC-SBX-005/020~023/030/038~041;VF-SBX-007/008/010 | `03` §6.1 / §9批次10.5 | stable failure、control conflict、guard-first、contained redline | CBC-SBX-007 | PER-SBX-007 | covered_designed |
| CUT-SBX-008 | FR-SBX-013/015~017;BR-SBX-020/022/024/027/031~033;AC-SBX-004/005/018/020~022/029/030/039/041;VF-SBX-005/006/009/010 | `03` §6.1 / §9批次10.6~10.7 | read / maintenance / relay只改owning marker,不修truth | CBC-SBX-008 | PER-SBX-008 | covered_designed |
| CUT-SBX-009 | C-SBX-1~5;FR-SBX-001/004/007/008/011/012/014~017;AC-SBX-006/009/012/013/016~022/031 | `03` §7.3 / §8.2 | 10 Command逐项accepted / reject / duplicate / conflict / rollback | CBC-SBX-009 | PER-SBX-009 | covered_designed |
| CUT-SBX-010 | FR-SBX-002/011/013/015~018;BR-SBX-020/024/031;AC-SBX-031/037/041;VF-SBX-009 | `03` §7.4 / §8.3 | 13 Query逐项surface + zero write | CBC-SBX-010 | PER-SBX-010 | covered_designed |
| CUT-SBX-011 | FR-SBX-002/003/007/013~018;BR-SBX-004/015/019/021~023/027/030;AC-SBX-008/018~023/031;VF-SBX-005~010 | `03` §7.5 / §8.4 | 9 Consumer逐项accepted / duplicate / delayed / quarantine / source authority | CBC-SBX-011 | PER-SBX-011 | covered_designed |
| CUT-SBX-012 | FR-SBX-011~014/017;BR-SBX-019/021/022/024/027/032;AC-SBX-004/016~019/022/029/031/039;VF-SBX-005/006/009/010 | `03` §7.6 / §8.4 | 13 Event逐项stored payload、safe schema、publish failure no rollback | CBC-SBX-012 | PER-SBX-012 | covered_designed |
| CUT-SBX-013 | FR-SBX-003/013~018;BR-SBX-023/027/030;AC-SBX-008/018~023/030/031;VF-SBX-009/010 | `03` §7.6 / §8.4 | 10 Job逐项success / invalid / partial / replay / no-repair | CBC-SBX-013 | PER-SBX-013 | covered_designed |
| CUT-SBX-014 | C-SBX-1;FR-SBX-001~003;BR-SBX-001/002/005;AC-SBX-001/006~008/026/039/040 | `03` §9批次10.1 | 3 enum合法主线、边界和terminal非法迁移 | CBC-SBX-014 | PER-SBX-014 | covered_designed |
| CUT-SBX-015 | C-SBX-2/5;FR-SBX-004~006/018;BR-SBX-006~010/017/029;AC-SBX-002/009~011/023/027/030/038;VF-SBX-003/008 | `03` §9批次10.2 | 6 enum、lease / orphan / release guard和非法复活 | CBC-SBX-015 | PER-SBX-015 | covered_designed |
| CUT-SBX-016 | C-SBX-3;FR-SBX-007~010;BR-SBX-011~017;AC-SBX-003/012~015/028/037/038;VF-SBX-004/009 | `03` §9批次10.3 | 3 enum、missing / stale / conflict永不allow | CBC-SBX-016 | PER-SBX-016 | covered_designed |
| CUT-SBX-017 | C-SBX-4;FR-SBX-011~014;BR-SBX-018~024;AC-SBX-004/016~019/029;VF-SBX-006/009 | `03` §9批次10.4 | run terminal、capture partial、handoff retry / terminal和no rollback | CBC-SBX-017 | PER-SBX-017 | covered_designed |
| CUT-SBX-018 | C-SBX-5;FR-SBX-015~018;BR-SBX-025~033;AC-SBX-005/020~023/030/038~041;VF-SBX-007~010 | `03` §9批次10.5 | 4 safety enum、guard优先级、contained不可advisory | CBC-SBX-018 | PER-SBX-018 | covered_designed |
| CUT-SBX-019 | FR-SBX-013/015~018;BR-SBX-020/027/031;AC-SBX-018/020~023/030/037/041;VF-SBX-006/009 | `03` §9批次10.6 | 4 read-side enum、同名Failed分owner、query / job no-repair | CBC-SBX-019 | PER-SBX-019 | covered_designed |
| CUT-SBX-020 | FR-SBX-013/014/017;BR-SBX-021/024/027/032;AC-SBX-004/018/019/022/039~041;VF-SBX-009/010 | `03` §9批次10.7 | relay terminal、retry single-winner、source不回滚 | CBC-SBX-020 | PER-SBX-020 | covered_designed |
| CUT-SBX-021 | FR-SBX-006/009/015;BR-SBX-008/012/025;AC-SBX-011/014/020/037;VF-SBX-003/004 | `03` §9批次10.8 | 6 technical / replay enum、missing result、hard guard不可degraded | CBC-SBX-021 | PER-SBX-021 | covered_designed |
| CUT-SBX-022 | FR-SBX-001~018适用;BR-SBX-001/002/005/009/014/021/024/030/032;AC-SBX-032/039/040 | `03` §10.4~§10.5 | 逐staged failure验证全量可见或全量不可见 | CBC-SBX-022 | PER-SBX-022 | covered_designed |
| CUT-SBX-023 | FR-SBX-002;AC-SBX-007/031/033/034/040 | `03` §10.3 / §10.6~10.8 | version / truth cursor / page cursor / ref / selector不混用 | CBC-SBX-023 | PER-SBX-023 | covered_designed |
| CUT-SBX-024 | FR-SBX-001/010/014/017;BR-SBX-016/021/023/027;AC-SBX-006/015/019/040;VF-SBX-009 | `03` §12.1 / §12.3~12.4 | Command / Consumer / Job same digest replay、different conflict、missing不重跑 | CBC-SBX-024 | PER-SBX-024 | covered_designed |
| CUT-SBX-025 | FR-SBX-004/005/008/018;BR-SBX-009/013/029;AC-SBX-009/013/023/040;VF-SBX-008/009 | `03` §12.2 | 10类race逐项single-winner、loser safe surface、无半状态 | CBC-SBX-025 | PER-SBX-025 | covered_designed |
| CUT-SBX-026 | FR-SBX-001~018负向;BR-SBX-003/008/010/012/013/025~033;AC-SBX-020/037~041;VF-SBX-003/004/008/010 | `03` §11 | 38错误逐producer / safe surface /副作用 /恢复禁止 | CBC-SBX-026 | PER-SBX-026 | covered_designed |
| CUT-SBX-027 | AC-SBX-037/038;配置AHG-01/02/18 | `04` §5 / §7 / §9 | S00~S08、I001~I101 parse / type / range / no fallback / unsupported | CBC-SBX-027 | PER-SBX-027;EHR-01~03/19 | covered_designed |
| CUT-SBX-028 | FR-SBX-005/006/009/018;BR-SBX-007/008;AC-SBX-010/011/023/037/038;配置AHG-04/05/08/09 | `04` §9 / §11 | NCFG / FC / XVAL、same-generation complete publication、scoped ceiling | CBC-SBX-028 | PER-SBX-028;EHR-02/04~06/09/10 | covered_designed |
| CUT-SBX-029 | FR-SBX-012/013/016/017;BR-SBX-004/015/018/019/022/028/033;AC-SBX-035/038/041;VF-SBX-005~007 | `04` §8 / §11 | sensitive taxonomy、S04时序、synthetic marker全carrier scan | CBC-SBX-029 | PER-SBX-029;EHR-07/08/17 | covered_designed |
| CUT-SBX-030 | BR-SBX-027;AC-SBX-036/040;配置AHG-10~12/15 | `04` §10~§14 | review / TOCTOU、new rollback、history immutable、drift no auto-overwrite | CBC-SBX-030 | PER-SBX-030;EHR-11~13/16 | covered_designed |
| CUT-SBX-031 | FR-SBX-001~010/014~018适用;AC-SBX-031/037/038;配置AHG-08/09/13 | `03` §5.8 / §13;`04` §9 | complete builder、API / worker / job mapping、current-unit isolation | CBC-SBX-031 | PER-SBX-031;EHR-09/10/14 | covered_designed |
| CUT-SBX-032 | FR-SBX-001/002/007/011~018;BR-SBX-005/009/014/018/024/032/033;AC-SBX-035/039/041;VF-SBX-005/010 | `03` §14;`04` §8 / §11 | formal audit同UoW、safe fields、低基数、telemetry不替代audit | CBC-SBX-032 | PER-SBX-032;EHR-07/15/17 | covered_designed |
| CUT-SBX-033 | FR-SBX-003/006/009;BR-SBX-003/004/010/012/015/022/031;AC-SBX-031/034/038;配置AHG-17/18 | `01` §8;`03` §5.2 / §13;`04` §14 | only core-contracts sibling dependency、unsupported surface absence / reject | CBC-SBX-033 | PER-SBX-033;EHR-18/19 | covered_designed |
| CUT-SBX-034 | C-SBX-2;FR-SBX-004~006/008;BR-SBX-003/006~010/013/017;AC-SBX-002/009~011/013/027/038;VF-SBX-001~004 | `00` VF-SBX-002/003;`03` boundary ports;`04` PROFILE-05 | candidate四维真实施加、越界阻断、unsupported整体拒绝 | CBC-SBX-034 | PER-SBX-034;EHR-04/14/20 | covered_designed_execution_blocked |
| CUT-SBX-035 | C-SBX-4/5;FR-SBX-011~018;BR-SBX-009/025~030/032/033;AC-SBX-004/005/016~023/029/030/038~041;VF-SBX-007/008/010 | `00` VF-SBX-007/008;`03` backend / safety ports;`04` PROFILE-05 | bounded launch、timeout / kill、capture / inspect、guarded release、containment | CBC-SBX-035 | PER-SBX-035;EHR-08/14~17/20 | covered_designed_execution_blocked |
| CUT-SBX-036 | C-SBX-2~5;FR-SBX-003~018适用;BR-SBX-003/006/008/010/012/016/017;AC-SBX-002~005/008~023/027~030/034/035;VF-SBX-001~005/009/010 | `00` VF-SBX-002/003/010;`04` PROFILE-05 / AHG-19 | backend / capability / template / generation / environment identity与no fallback | CBC-SBX-036 | PER-SBX-036;EHR-04/07/08/20 | covered_designed_execution_blocked |
| CUT-SBX-037 | FR-SBX-E01/E04/E05与P1 seam;AC-SBX-024及AC-SBX-036量化候选;NFR performance | `04` PROFILE-06 | durable parity、dependency outage、rollout / rollback / drift selected-run | CBC-SBX-037 | PER-SBX-037;EHR-08/11~13/20 | conditional_non_p0 |
| CUT-SBX-038 | FR-SBX-E01~E06;AC-SBX-024/025及AC-SBX-036量化候选;配置AHG-18/19 | `00` enhancement;`04` PROFILE-07 | current absence / reject与production / peripheral design-reopen trigger | CBC-SBX-038 | PER-SBX-038;EHR-19/20 | conditional_non_p0 |

反向矩阵结论: CUT-SBX-001~038、CBC-SBX-001~038和PER-SBX-001~038均一一对应且连续。CUT-001~036没有孤儿需求 /规则 /验收去向;CUT-037 / 038有明确conditional范围,不计入P0补偿。

---

## 9. EHR-01~20到PER承接矩阵

| EHR | 主要PER去向 | 后续producer方向 | 当前成熟度 |
|---|---|---|---|
| EHR-01 strict parser | PER-SBX-027 | L1 config contract | mapped_planned_requirement |
| EHR-02 item validation | PER-SBX-027/028 | L1 validator + L3 builder | mapped_planned_requirement |
| EHR-03 source priority | PER-SBX-027 | L1 source merge negative | mapped_planned_requirement |
| EHR-04 profile matrix | PER-SBX-028/031/033/034/036~038 | L1~L6 profile / qualification | mapped_planned_requirement |
| EHR-05 NCFG hard guard | PER-SBX-005/007/027/028/033 | L1 invariant / config negative | mapped_planned_requirement |
| EHR-06 cross-field matrix | PER-SBX-004~008/028/031 | L1 validator + L3 builder | mapped_planned_requirement |
| EHR-07 redaction / no-output | PER-SBX-001/006/011~013/026/029/032/035/036 | L1 / L3 / L4 carrier + L6 scan | mapped_planned_requirement |
| EHR-08 material lifecycle | PER-SBX-029/035~037 | fake lifecycle + candidate qualification | mapped_planned_requirement;real provider open |
| EHR-09 generation atomicity | PER-SBX-022/025/028/030/031 | L2 / L3 builder / race | mapped_planned_requirement |
| EHR-10 scoped isolation | PER-SBX-002/024/028/031 | L2 / L4 current-unit suites | mapped_planned_requirement |
| EHR-11 change review / TOCTOU | PER-SBX-030/037 | release-control contract / selected-run | mapped_planned_requirement;carrier open |
| EHR-12 rollback failure | PER-SBX-030/037 | operations simulation / physical drill | mapped_planned_requirement;drill absent |
| EHR-13 drift / observation | PER-SBX-030/037 | observation contract / selected-run | mapped_planned_requirement;carrier open |
| EHR-14 fail-closed dependency | PER-SBX-004/005/007/011/013/021/026/031/034~036 | service / adapter / L5 failure injection | mapped_planned_requirement |
| EHR-15 degraded no-write / no-repair | PER-SBX-008/010/013/019/021/031/032 | L2 / L3 write-audit | mapped_planned_requirement |
| EHR-16 no-truth-rewrite recovery | PER-SBX-006~008/011~013/017~020/024/030/035 | consumer / relay / handoff / replay | mapped_planned_requirement |
| EHR-17 safe observability | PER-SBX-001/002/006~008/011~013/026/029/032/035 | carrier contract + scan | mapped_planned_requirement |
| EHR-18 dependency graph | PER-SBX-033 | target manifest + adapter contract | mapped_planned_requirement;target repo open |
| EHR-19 unsupported absence | PER-SBX-027/033/038 | static / protocol / config negative | mapped_planned_requirement |
| EHR-20 profile activation packet | PER-SBX-028/029/031/033~038 | L5 / L6 qualification and future profile packet | mapped_planned_requirement;P05+ unqualified |

EHR承接结论: 20 /20均映射至少一个PER,没有把EHR改名为EV、预填artifact路径、run identity或结果。

---

## 10. 未覆盖项、执行阻塞与非P0清单

| 项 | 设计覆盖状态 | 当前非pass原因 | 后续处理 |
|---|---|---|---|
| P0-C C / FR / BR / AC / VF适用命题 | 无设计空洞 | 实现、suite与执行尚未形成 | Step 6~13继续设计;`07`后真实执行 |
| CUT-SBX-034~036 / P0-Q | covered_designed_execution_blocked | candidate backend、capability matrix、dedicated environment未形成 | Step 6继续case设计;Step 8 /10和`07/09`关闭执行前置 |
| 需要真实material的P0-Q子集 | covered_designed_execution_blocked | provider / principal / platform anti-leak未qualified | 不扩大为无关全局阻塞;适用case执行前关闭 |
| FR-SBX-E01~E06 / AC-SBX-024~025 | conditional_non_p0 | 外围增强未进入current core | 激活时先确认设计范围,由CUT-037 /038承接 |
| AC-SBX-036量化性能 /容量部分 | conditional_non_p0 | 无正式产品、负载模型或硬阈值 | Step 10决定结构性 /候选 /硬门禁;不得继承旧数字 |
| CUT-SBX-037 PROFILE-06 | conditional_non_p0 | durable / bus / handoff / scheduler / sink未qualified | P1 selected-run,不得补偿P0 |
| CUT-SBX-038 PROFILE-07 / production | conditional_non_p0 | inactive且需设计重开 | 当前只测absence / reject / trigger |
| 真实EV / artifact / report / run /结果 | not_created_by_design | 尚未定义producer绑定且未执行 | Step 9 /13定义schema;真实执行产生 |

结论: 当前P0设计覆盖无空洞。`covered_designed_quantitative_pending`、`execution_blocked`、`conditional_non_p0`和`not_created_by_design`均不是测试通过,不得被汇总成pass。

---

## 11. 覆盖矩阵停审与跨项审计

### 11.1 覆盖矩阵停审记录

| 覆盖批次 | 审查项 | 结论 | 缺口 /后续修正 |
|---|---|---|---|
| C-SBX-1~5 | 设计依据、正负场景、CBC / PER、P0-Q传播是否完整 | 通过（设计） | C-SBX-2~5适用真实证明保持execution blocked |
| FR-SBX-001~003 | intake / identity /统一入口是否可自动化且不依赖L5 | 通过（设计） | Step 6逐flow拆case |
| FR-SBX-004~006 | boundary contract与真实施加是否不可替代 | 通过（设计） | CBC-034 /036执行前置开放 |
| FR-SBX-007~010 | policy /高风险 /跨调用方fail-closed是否闭合 | 通过（设计） | Step 6逐missing / stale / conflict / unauthorized |
| FR-SBX-011~014 | capture / handoff /跨调用方回收是否分owner | 通过（设计） | 真实capture由CBC-035补强 |
| FR-SBX-015~018 | failure / redline /留痕 /回收是否guard-first | 通过（设计） | CBC-035执行前置开放 |
| BR-SBX-001~033 | 33 /33是否逐ID有CUT、场景、CBC / PER | 通过（设计） | 无孤儿规则 |
| AC-SBX-001~041 | 41 /41是否区分P0、P0-Q blocked与conditional | 通过（设计） | AC-SBX-024/025及AC-SBX-036量化候选不得计P0补偿;AC-SBX-036结构性部分已覆盖 |
| VF-SBX-001~010 | 10 /10是否有负向场景且不可人工豁免 | 通过（设计） | L5相关项不得由L1~L4替代 |
| 六类NFR | 是否承接正式AC且无来源硬数字未固化 | 通过（设计） | 性能阈值留Step 10 |
| CUT-SBX-001~038 | 是否逐项反查需求 /规则 /设计并绑定同序CBC / PER | 通过（设计） | 38 /38连续且一一对应 |
| EHR-01~20 | 是否映射PER且保持planned maturity | 通过（设计） | 20 /20;无EV / artifact /结果 |

### 11.2 跨覆盖项审计表

| 审计项 | 结论 | 缺口 /处理 |
|---|---|---|
| P0孤儿核心能力 / FR / BR / AC / VF | 无 | 正向矩阵全部有CUT、CBC、PER |
| P0孤儿设计契约 | 无 | 七模块、55协议、30 owner-level state machines、38错误、配置 /安全均有CUT |
| 孤儿测试切口 | 无 | CUT-001~038逐项反查 |
| CBC重复 /断号 | 无 | CBC-001~038与CUT同序一一对应 |
| PER重复 /断号 | 无 | PER-001~038与CUT同序一一对应 |
| EHR孤儿 | 无 | EHR-01~20全部映射PER |
| P0自动化缺口 | 无设计缺口 | CUT-001~033为自动化 /static候选,CUT-034~036为可重复L5 harness候选 |
| 55协议抽样遗漏 | 无 | Command 10、Query 13、Consumer 9、Event 13、Job 10均由CBC-009~013全量承接 |
| fake / seam / simulation升格 | 无 | PER-034~036只消费L5结果 |
| P1 / P2补偿P0 | 无 | CUT-SBX-037/038、AC-SBX-024/025及AC-SBX-036量化候选明确conditional |
| evidence真实性 | 通过 | PER / EHR均为planned requirement,未创建EV / run / artifact /结果 |
| historical material回流 | 无 | 旧对象、TC、产品、环境、阈值和checkbox未进入矩阵 |
| phase boundary | 通过 | 未提前设计TC步骤、数据、环境、suite或正式evidence schema |

跨项审计结论: P0覆盖矩阵无unresolved空洞,双向追溯闭合,允许完成Step 5设计停审。

---

## 12. 对上游设计的影响判定

| 覆盖结论 | 是否影响上游 | 回写位置 | 处理状态 |
|---|---:|---|---|
| C / FR / BR / AC / VF均能回指正式设计与CUT | 否 | 不适用 | 无当前回写 |
| CBC / PER与CUT一一对应 | 否 | 不适用 | 测试设计期编号,不改上游协议 |
| P0-Q追溯完整但执行blocked | 否 | Step 8~10、`07/09` | 保持后置blocker |
| AC-SBX-036无正式硬阈值 | 否 | Step 10 | 承接需求候选口径,不回填旧数字 |
| Step 6若无法把CBC拆成正式字段 /状态 /副作用断言 | 条件性是 | 对应`03/04`章节 | 触发设计重开并停止相关case |

当前没有阻塞Step 6用例设计的上游blocker。

---

## 13. 正式`05` §5回填草稿

> 校准来源: `design-calibration/05_test_plan_step_05_traceability_coverage.md`
>
> 延伸阅读: 建议继续阅读本文件§7正向矩阵、§8 CUT反向矩阵、§9 EHR承接、§10未覆盖项和§11跨项审计。

正式§5应回填:

1. 正向矩阵从C-SBX-1~5、FR-SBX-001~018、BR-SBX-001~033、AC-SBX-001~041、VF-SBX-001~010和六类NFR追溯到正式设计、CUT、场景候选、CBC与PER。
2. 反向矩阵要求CUT-SBX-001~038均能回查需求 /规则 /验收或明确conditional设计风险;CBC / PER与CUT同序一一对应。
3. `CBC-SBX-*`只是Step 6 case batch candidate,`PER-SBX-*`与EHR只是planned evidence requirement;均不是TC、EV、artifact、run或结果。
4. CUT-001~033承担P0-C自动化 /static候选,CUT-034~036承担可重复L5 P0-Q harness候选;后者当前execution blocked但不是设计未覆盖。
5. FR-SBX-E01~E06、AC-SBX-024/025、AC-SBX-036量化候选及CUT-SBX-037/038为conditional non-P0;AC-SBX-036结构性部分由CUT-SBX-004~007/025/030承接,前述conditional项不得补偿P0失败。

---

## 14. 待确认事项与进入下一步条件

| 待确认事项 | 当前状态 | 是否阻塞Step 6 | 后续处理 |
|---|---|---:|---|
| CBC-001~038拆成多少正式TC | open_for_step_6 | 否 | Step 6按CUT逐批设计并停审 |
| 一个PER绑定单suite还是多suite | open_for_step_9 | 否 | Step 9按层级 /profile确定producer |
| PER与最终EV alias关系 | open_for_step_13 | 否 | Step 13定义唯一性与artifact schema |
| P0-Q backend / lab / material前置 | open_for_p0q_execution | 否 | 不阻塞case设计;阻塞真实执行 |
| AC-SBX-036量化候选是否升级为硬门禁 | open_for_step_10 | 否 | 基于正式产品与负载模型判断;不影响结构性部分已覆盖结论 |

| 进入条件 | 结果 | 说明 |
|---|---|---|
| P0正向矩阵无空洞 | 通过 | C / FR / BR / AC / VF均有设计 / CUT / CBC / PER |
| CUT反向矩阵无孤儿 | 通过 | 38 /38逐项反查 |
| 覆盖矩阵已停审 | 通过 | §11.1 |
| 跨覆盖项无unresolved冲突 | 通过 | §11.2 |
| 未伪造TC / EV /执行结果 | 通过 | 仅CBC / PER / EHR planned maturity |
| 可进入Step 6 | `passed_to_step_6` | 用户已审查确认;Step 6已据此完成 |

```text
current_document = `05-测试方案.md`
current_step = Step 5 `建立需求追溯与覆盖矩阵`
gate_status = passed_to_step_6
next_allowed_action = 已传递至Step 6;后续恢复读取`05_test_plan_step_06_cases.md`及5个分件
formal_document_write = not_started_historical_file_untouched
real_test_execution = not_started
real_evidence_created = no
implementation_ledger_created = no
planned_boundary_skeleton_created = no
commit_required = no
```
