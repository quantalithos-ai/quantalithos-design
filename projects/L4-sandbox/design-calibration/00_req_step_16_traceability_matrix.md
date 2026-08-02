# L4-sandbox 00 需求 Step 16: 需求追溯矩阵

> 创建日期: 2026-07-06
> 状态: done_wait_review
> 当前模式: full-restart
> 本轮口径: 用户已确认 Step 15,允许进入 Step 16;正式 `00-需求文档.md` 仍未改写。
> 回填位置: `00-需求文档.md` 第 16 章“需求追溯矩阵”
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 文档级 flow: `design-calibration/00_requirements_calibration_flow.md`
> 上游 Step: `00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md`;`00_req_step_04_goals_non_goals.md`;`00_req_step_05_users_roles.md`;`00_req_step_06_consumers_dependencies.md`;`00_req_step_07_core_capability_loop.md`;`00_req_step_08_user_stories.md`;`00_req_step_09_functional_requirements.md`;`00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`;`00_req_step_12_interfaces_dependencies.md`;`00_req_step_13_non_functional_requirements.md`;`00_req_step_14_acceptance_criteria.md`;`00_req_step_15_risks_open_questions.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 16 需求追溯矩阵 |
| 输出文件 | `design-calibration/00_req_step_16_traceability_matrix.md` |
| 前置确认 | pass:用户在 Step 15 停审后回复“同意”,允许进入 Step 16 |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/00_requirements_calibration_flow.md` |
| 已读取上游 Step | yes:`00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md`;`00_req_step_04_goals_non_goals.md`;`00_req_step_05_users_roles.md`;`00_req_step_06_consumers_dependencies.md`;`00_req_step_07_core_capability_loop.md`;`00_req_step_08_user_stories.md`;`00_req_step_09_functional_requirements.md`;`00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`;`00_req_step_12_interfaces_dependencies.md`;`00_req_step_13_non_functional_requirements.md`;`00_req_step_14_acceptance_criteria.md`;`00_req_step_15_risks_open_questions.md` |
| 已读取 SOP / 书写规范 | yes:`需求文档讨论流程_SOP.md` Step 16;`需求文档书写规范.md` §4.16 |
| 已读取通用规范 | yes:`设计文档编写通则.md`;`设计文档讨论中间产物规范.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取参考粒度 | yes:`projects/L1-governance/design-calibration/00_req_step_16_traceability_matrix.md`;`projects/L1-artifact/design-calibration/00_req_step_16_traceability_matrix.md` |
| 本 Step 主轴 | 以 `FR-SBX-001~018` 和 `FR-SBX-E01~E06` 为中心,把 C-SBX、US-SBX、BR-SBX、Step 11 数据归属和 AC / VF 显式连起来。 |
| 禁止事项 | 不新增故事、功能、规则、数据项、接口类型、NFR、验收项、风险或待确认事项;不得在矩阵里补协议、状态机、存储或实施边界。 |
| 正式文档写入 | not_allowed: Step 17 前不回填正式 `00-需求文档.md` |
| next_allowed_action | wait_user_confirm_step_17 |

---

## 1. Step 内计划

| 模块 | 状态 | 可审查产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 恢复门禁与输入读取 | done | 台账、flow、Step 1~15、SOP、书写规范、通用规范、参考样例 | pass | 进入 SOP 问题回答。 |
| SOP 问题回答 | done | 闭环映射、故事映射、功能主轴、孤儿项判断和不阻塞项判断 | pass | 进入当前材料诊断。 |
| 当前材料诊断 | done | 旧追溯缺失诊断、外围增强遗失风险诊断、接口 / NFR 漏审诊断和 Step 15 挂起项处理诊断 | pass | 进入设计取舍。 |
| 设计取舍 | done | 主矩阵是否纳入外围增强、接口 / NFR 是否单独审计、数据列压缩表达和 Step 15 挂起口径取舍 | pass | 进入结构化中间产物。 |
| 结构化中间产物 | done | 主追溯矩阵、跨能力追溯审计、漏项检查表和追溯结论 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 16 章候选正文 | pass | 进入自检与停审。 |
| 自检与停审 | done | Step 16 自检表和下一步门禁 | pass_wait_review | 等待用户确认 Step 17。 |

---

## 2. 必读摘要

| 文档 | Step 16 读取结论 | 对本 Step 的约束 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 16 | Step 16 只把前文已确认的闭环、故事、功能、规则、数据、接口和验收结构显式连接起来,用于发现漏项、孤儿项和串线项。 | 不得在矩阵中新增前文未确认的新项;发现缺口只能回退对应 Step。 |
| `需求文档书写规范.md` §4.16 | 正式追溯矩阵固定以“功能需求”为中心,使用六列表,并必须提供漏项检查表。 | 主矩阵主轴必须是 `FR-SBX-*`;不能改用故事、规则或闭环节点作主轴。 |
| `设计文档编写通则.md` | 正式文档必须可追溯,且不能把问题回答和过程性讨论直接写回正式正文。 | Step 16 要把追溯关系留在 calibration 中间产物,正式第 16 章只摘录稳定结论。 |
| `设计文档讨论中间产物规范.md` | 所有模块完成后必须做跨模块审计,检查重复定义、孤儿项、依赖方向和验收承接。 | Step 16 不能只有主矩阵,还必须有跨能力审计和漏项检查表。 |
| `设计真相源闭环与可落码性标准.md` | 继续任务必须从真相源恢复;未来 Step 文件不得提前生成;孤儿项和第二真相源必须在设计层关闭。 | Step 16 必须显式证明没有为了补齐矩阵而新造协议、状态、存储、evidence 或实施边界真相。 |
| `00_req_step_07_core_capability_loop.md` | 已固定 C-SBX-1~5 核心闭环顺序和边界,外围增强不构成核心闭环前置。 | Step 16 必须先证明 `FR-SBX-001~018` 的核心闭环闭合,再处理 `FR-SBX-E01~E06`。 |
| `00_req_step_09_functional_requirements.md` | 已形成 `FR-SBX-001~018` 和 `FR-SBX-E01~E06`。 | 所有正式功能都必须进入 Step 16 追溯,不能让外围增强在追溯中消失。 |
| `00_req_step_10_business_rules_boundaries.md` | 已形成 `BR-SBX-001~033`,并完成 `FR-SBX-* -> BR-SBX-*` 映射。 | 主矩阵必须以这些既有规则为准,不能新增补丁规则。 |
| `00_req_step_11_data_ownership.md` | sandbox 只拥有 execution isolation truth;数据只允许真相 / 快照 / 引用 / 禁止保存正文四类。 | 主矩阵数据列必须只写四类数据边界及代表性对象,不能复制字段或对象设计。 |
| `00_req_step_12_interfaces_dependencies.md` | 接口与依赖是需求边界的重要承接,但不在 4.16 固定六列表内。 | 接口 / 依赖必须进入跨能力审计和漏项检查,不能因为不进主矩阵就漏审。 |
| `00_req_step_13_non_functional_requirements.md` | Step 13 已收口六类 NFR,但未采用 `NFR-SBX-*` 编号。 | Step 16 只能通过 `AC-SBX-036~041` 与相关 `VF-SBX` 承接这些 NFR,不能另造 NFR ID。 |
| `00_req_step_14_acceptance_criteria.md` | 已形成 `AC-SBX-001~041` 与 `VF-SBX-001~010`,并给出 `FR-SBX-*` 对应承接。 | 每条功能需求都必须能回指至少一条正式 AC,必要时附带相关 VF 红线。 |
| `00_req_step_15_risks_open_questions.md` | 风险与待确认事项已明确不阻塞 Step 16,但约束后续不能擅自发明协议、状态和存储真相。 | Step 16 要显式说明哪些挂起项暂不阻塞,并防止矩阵把它们伪装成已确认结论。 |

---

## 3. SOP 问题回答

### 3.1 每个核心能力闭环节点对应哪些用户故事?

| 核心能力闭环 | 对应用户故事 |
|---|---|
| C-SBX-1 受控执行语境识别与约束 | US-SBX-001;US-SBX-002;US-SBX-003 |
| C-SBX-2 隔离环境边界建立与限制施加 | US-SBX-004;US-SBX-005;US-SBX-006 |
| C-SBX-3 给定策略内执行与 fail-closed | US-SBX-006;US-SBX-007;US-SBX-008;US-SBX-009 |
| C-SBX-4 输出与观测材料安全捕获和分层交接 | US-SBX-010;US-SBX-011;US-SBX-012 |
| C-SBX-5 失败租约清理与安全红线保守收束 | US-SBX-013;US-SBX-014;US-SBX-015;US-SBX-016 |
| 外围增强 | US-SBX-E01;US-SBX-E02;US-SBX-E03;US-SBX-E04;US-SBX-E05;US-SBX-E06 |

### 3.2 每个用户故事对应哪些功能需求?

| 用户故事 | 对应功能需求 |
|---|---|
| US-SBX-001 | FR-SBX-001;FR-SBX-002 |
| US-SBX-002 | FR-SBX-002 |
| US-SBX-003 | FR-SBX-001;FR-SBX-003 |
| US-SBX-004 | FR-SBX-004;FR-SBX-005 |
| US-SBX-005 | FR-SBX-005 |
| US-SBX-006 | FR-SBX-006;FR-SBX-007 |
| US-SBX-007 | FR-SBX-007;FR-SBX-008 |
| US-SBX-008 | FR-SBX-007;FR-SBX-008;FR-SBX-009 |
| US-SBX-009 | FR-SBX-010 |
| US-SBX-010 | FR-SBX-011;FR-SBX-012;FR-SBX-014 |
| US-SBX-011 | FR-SBX-013 |
| US-SBX-012 | FR-SBX-011;FR-SBX-014 |
| US-SBX-013 | FR-SBX-015;FR-SBX-017;FR-SBX-018 |
| US-SBX-014 | FR-SBX-016 |
| US-SBX-015 | FR-SBX-017 |
| US-SBX-016 | FR-SBX-018 |
| US-SBX-E01 | FR-SBX-E01 |
| US-SBX-E02 | FR-SBX-E02 |
| US-SBX-E03 | FR-SBX-E03 |
| US-SBX-E04 | FR-SBX-E04 |
| US-SBX-E05 | FR-SBX-E05 |
| US-SBX-E06 | FR-SBX-E06 |

### 3.3 每个功能需求对应哪些业务规则、数据归属要求和验收标准?

完整答案见 §6.1 主追溯矩阵。当前结论是:

- `FR-SBX-001~018` 均能回指既有 `BR-SBX` 映射、Step 11 数据归属和 `AC-SBX-006~023`。
- `FR-SBX-E01~E06` 虽然不构成当前整体通过硬前提,但仍有既有故事来源、继承规则边界、正式数据边界和 `AC-SBX-024~025` 承接。

### 3.4 是否存在没有来源的功能、没有承接的规则、没有验收的能力?

当前结论为否。

- 没有孤儿故事: `US-SBX-001~016` 与 `US-SBX-E01~E06` 均有 `FR-SBX` 承接。
- 没有孤儿功能: `FR-SBX-001~018` 和 `FR-SBX-E01~E06` 均有闭环、规则、数据和验收承接。
- 没有孤儿规则: `BR-SBX-001~033` 均能回指 `FR-SBX-*` 或能力节点边界。
- 没有孤儿验收: `AC-SBX-001~041` 和 `VF-SBX-001~010` 均能回指核心闭环、功能、规则、数据或 NFR。

### 3.5 Step 15 的风险与待确认事项如何进入 Step 16?

Step 15 的风险与待确认事项不进入主矩阵列,但进入跨能力追溯审计:

- 风险项通过规则、数据边界、AC / VF 和接口裁剪被持续约束。
- 待确认项保持挂起,不在 Step 16 里伪装成已收口的协议、状态、存储或承载组合。
- 当前不阻塞 Step 16 的问题仍限于承载组合、policy 来源矩阵、网络粒度、ack 形态和外围增强节奏等后续文档问题。

---

## 4. 当前材料诊断

### 4.1 旧追溯缺失诊断

| 位置 | 当前问题 | Step 16 处理 |
|---|---|---|
| 旧 `00-需求文档.md` | 没有以功能需求为主轴的正式追溯矩阵,读者只能跨章节自行拼闭环。 | 形成固定六列表主矩阵。 |
| Step 7~15 单步产物 | 每步都已有局部映射,但横向分散。 | 在 Step 16 统一汇总并做跨能力审计。 |
| 旧 README / 旧测试 / 旧验收材料 | 常把实现线索、测试线索和需求关系混写。 | 只承接已在 Step 9~15 稳定下来的正式 ID 和边界。 |

### 4.2 外围增强遗失风险诊断

如果 Step 16 只追 `FR-SBX-001~018`,会让 `FR-SBX-E01~E06` 在正式追溯中消失,随后实现阶段又会把它们当成未讨论需求重新补写。

当前处理口径:

- 外围增强保留在主矩阵中。
- 但在闭环列和验收列中显式标明“外围增强 / 不构成当前整体通过前提”。

### 4.3 接口 / NFR 漏审诊断

4.16 的固定六列表不含接口 / 依赖列,也不单列 NFR。若只照表填充,容易产生两个盲区:

1. Step 12 的接口与依赖边界没有正式承接。
2. Step 13 的六类 NFR 没有被确认由 `AC-SBX-036~041` 承接。

当前处理口径:

- 主矩阵只写规范固定六列。
- 接口 / 依赖和 NFR 进入 §6.2 跨能力追溯审计与 §6.3 漏项检查表。

### 4.4 Step 15 挂起项误收口诊断

最容易在 Step 16 被误补成“已确认结论”的内容有:

- Docker / gVisor / Firecracker / test-only 承载组合。
- policy / authorization 唯一来源仓。
- 网络 allow granularity、ack 协议、inspect / replay 协议。
- DB / object store / GRC 接入基线。

这些都不是 Step 16 可以补写的内容。当前只允许保持它们的挂起状态,并确保矩阵不因缺细节而去新造真相。

---

## 5. 设计取舍

### 5.1 主矩阵纳入外围增强,但不升级其通过门槛

| 方案 | 优点 | 问题 | 决策 |
|---|---|---|---|
| 方案 A: 只追核心 `FR-SBX-001~018` | 表更短 | `FR-SBX-E01~E06` 会变成追溯孤儿 | 不采用 |
| 方案 B: 核心与外围增强都入矩阵,外围增强显式标注为非核心通过前提 | 覆盖完整,不丢已确认功能 | 主矩阵稍长 | 采用 |

### 5.2 主矩阵保持六列表,接口 / NFR 单独审计

| 方案 | 优点 | 问题 | 决策 |
|---|---|---|---|
| 方案 A: 给主矩阵加接口 / NFR 列 | 信息更全 | 违反 4.16 固定结构 | 不采用 |
| 方案 B: 主矩阵保持六列表,接口 / NFR 进入跨能力审计 | 对齐规范,且不丢重要边界 | 需要额外审计表 | 采用 |

### 5.3 数据列只写边界结果,不复制 Step 11 全表

| 方案 | 优点 | 问题 | 决策 |
|---|---|---|---|
| 方案 A: 把 Step 11 全部数据项原样塞进每一行 | 信息完整 | 会把主矩阵变成数据归属副本 | 不采用 |
| 方案 B: 只写该功能对应的真相 / 快照 / 引用 / 禁止保存正文结论 | 保持追溯强度,不复制全文 | 需要压缩表达 | 采用 |

### 5.4 Step 15 挂起项只作约束,不进主矩阵

| 方案 | 优点 | 问题 | 决策 |
|---|---|---|---|
| 方案 A: 在主矩阵中补写承载组合、协议形态和存储基线 | 表面完整 | 违反 Step 15 挂起口径,会新造真相 | 不采用 |
| 方案 B: 只在跨能力审计里声明它们未阻塞且未被误收口 | 保持当前边界真实 | 需要显式说明 | 采用 |

---

## 6. 结构化中间产物

### 6.1 主追溯矩阵

| 功能需求 | 支撑的核心能力闭环 | 对应的用户故事 | 对应的业务规则 | 对应的数据归属要求 | 对应的验收标准 |
|---|---|---|---|---|---|
| FR-SBX-001 受控执行请求语境接入 | C-SBX-1 | US-SBX-001;US-SBX-003 | BR-SBX-001;BR-SBX-002;BR-SBX-003;BR-SBX-005 | 正式受控执行请求语境[真相];调用方上下文摘要[快照];identity/work/runner/tool/runtime request refs[引用];上游正文禁止入仓 | AC-SBX-001;AC-SBX-006;AC-SBX-026;AC-SBX-032;AC-SBX-039;VF-SBX-001;VF-SBX-002;VF-SBX-010 |
| FR-SBX-002 执行环境身份与责任链绑定 | C-SBX-1 | US-SBX-001;US-SBX-002 | BR-SBX-001;BR-SBX-004;BR-SBX-005 | 执行环境身份与责任链绑定事实[真相];调用方上下文摘要[快照];identity/work/runner refs[引用];actor/member/project/work/runner/runtime 正文禁止入仓 | AC-SBX-001;AC-SBX-007;AC-SBX-026;AC-SBX-032;AC-SBX-034;AC-SBX-039;VF-SBX-001;VF-SBX-005;VF-SBX-010 |
| FR-SBX-003 跨调用方统一受控执行入口 | C-SBX-1 | US-SBX-003 | BR-SBX-003;BR-SBX-004 | 受理 / 拒绝归责记录[真相];调用方上下文摘要[快照];request refs[引用];runner/runtime/tool semantic 正文禁止入仓 | AC-SBX-001;AC-SBX-008;AC-SBX-026;AC-SBX-034;AC-SBX-040;VF-SBX-002;VF-SBX-009 |
| FR-SBX-004 正式隔离环境建立 | C-SBX-2 | US-SBX-004 | BR-SBX-006;BR-SBX-009 | 隔离环境建立事实[真相];backend carrier capability 摘要[快照];backend carrier/workspace source refs[引用];host/cluster/member host binding 正文禁止入仓 | AC-SBX-002;AC-SBX-009;AC-SBX-027;AC-SBX-032;AC-SBX-036;AC-SBX-038;VF-SBX-001;VF-SBX-002;VF-SBX-003 |
| FR-SBX-005 统一边界限制施加 | C-SBX-2 | US-SBX-004;US-SBX-005 | BR-SBX-007;BR-SBX-008;BR-SBX-010 | 有效边界限制事实[真相];backend carrier capability 摘要[快照];carrier/workspace refs[引用];宿主文件系统正文禁止入仓 | AC-SBX-002;AC-SBX-010;AC-SBX-027;AC-SBX-032;AC-SBX-036;AC-SBX-038;VF-SBX-003;VF-SBX-005 |
| FR-SBX-006 限制可落实性校验与拒绝 | C-SBX-2 | US-SBX-006 | BR-SBX-008;BR-SBX-009;BR-SBX-010 | 限制落实校验与建立拒绝事实[真相];backend carrier capability 摘要[快照];carrier refs[引用];host lifecycle 正文禁止入仓 | AC-SBX-002;AC-SBX-011;AC-SBX-027;AC-SBX-036;AC-SBX-037;AC-SBX-038;VF-SBX-003 |
| FR-SBX-007 启动前策略语境承接 | C-SBX-3 | US-SBX-006;US-SBX-007;US-SBX-008 | BR-SBX-011;BR-SBX-014;BR-SBX-015;BR-SBX-017 | 策略执行裁定事实[真相];policy applicability / authorization 摘要[快照];policy/approval/capability refs[引用];policy DSL / approval workflow 正文禁止入仓 | AC-SBX-003;AC-SBX-012;AC-SBX-028;AC-SBX-032;AC-SBX-034;AC-SBX-037;AC-SBX-038;VF-SBX-004;VF-SBX-005 |
| FR-SBX-008 策略内执行与高风险动作阻断 | C-SBX-3 | US-SBX-007;US-SBX-008 | BR-SBX-011;BR-SBX-012;BR-SBX-013;BR-SBX-017 | 高风险边界扩张处置事实[真相];policy applicability / authorization 摘要[快照];policy/approval/capability refs[引用];allowlist / tool semantic result 正文禁止入仓 | AC-SBX-003;AC-SBX-013;AC-SBX-028;AC-SBX-033;AC-SBX-037;AC-SBX-038;VF-SBX-004;VF-SBX-005 |
| FR-SBX-009 策略缺失冲突或不支持时保守拒绝 | C-SBX-3 | US-SBX-008 | BR-SBX-012;BR-SBX-014;BR-SBX-017 | 策略缺失 / 冲突 / 不支持保守拒绝事实[真相];policy applicability 摘要[快照];policy / approval refs[引用];approval workflow 正文禁止入仓 | AC-SBX-003;AC-SBX-014;AC-SBX-028;AC-SBX-037;AC-SBX-038;VF-SBX-004 |
| FR-SBX-010 跨调用方统一策略执行口径 | C-SBX-3 | US-SBX-009 | BR-SBX-014;BR-SBX-015;BR-SBX-016 | 策略执行裁定事实[真相];policy applicability 摘要[快照];policy / capability refs[引用];外部 policy truth 正文禁止入仓 | AC-SBX-003;AC-SBX-015;AC-SBX-028;AC-SBX-040;VF-SBX-004;VF-SBX-009 |
| FR-SBX-011 执行输出统一捕获 | C-SBX-4 | US-SBX-010;US-SBX-012 | BR-SBX-018;BR-SBX-021;BR-SBX-024 | 执行结果捕获事实[真相];artifact/runtime/runner/observability handoff refs[引用];下游正式正文禁止入仓 | AC-SBX-004;AC-SBX-016;AC-SBX-029;AC-SBX-032;AC-SBX-036;AC-SBX-039;VF-SBX-006;VF-SBX-010 |
| FR-SBX-012 候选材料安全收口 | C-SBX-4 | US-SBX-010 | BR-SBX-018;BR-SBX-019;BR-SBX-021;BR-SBX-022 | 输出与候选材料事实[真相];handoff refs[引用];Artifact 正式正文 / baseline / evidence 正文禁止入仓 | AC-SBX-004;AC-SBX-017;AC-SBX-029;AC-SBX-033;AC-SBX-035;VF-SBX-005;VF-SBX-006 |
| FR-SBX-013 观测与审计材料分层交接 | C-SBX-4 | US-SBX-011 | BR-SBX-018;BR-SBX-020;BR-SBX-022;BR-SBX-024 | usage / audit / observability material 事实[真相];handoff refs[引用];observability store 正文禁止入仓 | AC-SBX-004;AC-SBX-018;AC-SBX-029;AC-SBX-035;AC-SBX-039;AC-SBX-041;VF-SBX-005;VF-SBX-006;VF-SBX-010 |
| FR-SBX-014 跨调用方统一结果回收链 | C-SBX-4 | US-SBX-010;US-SBX-012 | BR-SBX-021;BR-SBX-023;BR-SBX-024 | 结果 / 候选 / 观测交接事实[真相];handoff refs[引用];conversation / UI 展示正文禁止入仓 | AC-SBX-004;AC-SBX-019;AC-SBX-029;AC-SBX-040;VF-SBX-006;VF-SBX-009;VF-SBX-010 |
| FR-SBX-015 失败分类与原因归并 | C-SBX-5 | US-SBX-013 | BR-SBX-025;BR-SBX-030;BR-SBX-032 | 稳定失败分类事实[真相];下游安全交接 / 调查开放状态摘要[快照];runtime/artifact/observability/investigation refs[引用];runtime recover 正文禁止入仓 | AC-SBX-005;AC-SBX-020;AC-SBX-030;AC-SBX-037;AC-SBX-040;AC-SBX-041;VF-SBX-001;VF-SBX-008;VF-SBX-010 |
| FR-SBX-016 安全红线保守收束 | C-SBX-5 | US-SBX-014 | BR-SBX-026;BR-SBX-030;BR-SBX-033 | redline containment / investigation 事实[真相];调查开放状态摘要[快照];investigation refs[引用];operator console / replay UI 正文禁止入仓 | AC-SBX-005;AC-SBX-021;AC-SBX-030;AC-SBX-038;AC-SBX-039;AC-SBX-041;VF-SBX-007;VF-SBX-008;VF-SBX-010 |
| FR-SBX-017 非 happy path 材料留痕 | C-SBX-5 | US-SBX-013;US-SBX-015 | BR-SBX-027;BR-SBX-028;BR-SBX-030;BR-SBX-032;BR-SBX-033 | deny / kill / timeout / replay / cleanup / reaper 控制事实[真相];cleanup guard 事实[真相];investigation refs[引用];raw audit store 正文禁止入仓 | AC-SBX-005;AC-SBX-022;AC-SBX-030;AC-SBX-039;AC-SBX-041;VF-SBX-007;VF-SBX-010 |
| FR-SBX-018 租约到期与孤儿环境保守回收 | C-SBX-5 | US-SBX-013;US-SBX-016 | BR-SBX-028;BR-SBX-029;BR-SBX-030;BR-SBX-031;BR-SBX-032 | lease / orphan / recovery 收束事实[真相];cleanup guard 事实[真相];下游安全交接 / 调查开放状态摘要[快照];runtime/artifact/observability/investigation refs[引用];artifact retention 正文禁止入仓 | AC-SBX-005;AC-SBX-023;AC-SBX-030;AC-SBX-034;AC-SBX-037;AC-SBX-041;VF-SBX-007;VF-SBX-008;VF-SBX-010 |
| FR-SBX-E01 风险分层隔离承载选择 | 外围增强 | US-SBX-E01 | 继承 BR-SBX-007;BR-SBX-008;BR-SBX-010;BR-SBX-016;BR-SBX-017 | 继承隔离环境建立事实 / 有效边界限制事实[真相];backend capability 摘要[快照];carrier refs[引用];不新增 backend truth | AC-SBX-024;AC-SBX-027;AC-SBX-036;AC-SBX-038;VF-SBX-003;VF-SBX-009 |
| FR-SBX-E02 高级 replay / inspect / operator 控制 | 外围增强 | US-SBX-E02 | 继承 BR-SBX-027;BR-SBX-028;BR-SBX-030;BR-SBX-032;BR-SBX-033 | 继承稳定失败分类 / 控制事实 / investigation 事实[真相];investigation refs[引用];operator UI 正文禁止入仓 | AC-SBX-025;AC-SBX-030;AC-SBX-039;AC-SBX-041;VF-SBX-005;VF-SBX-007;VF-SBX-010 |
| FR-SBX-E03 输出预览与结果分析辅助 | 外围增强 | US-SBX-E03 | 继承 BR-SBX-018;BR-SBX-021;BR-SBX-022;BR-SBX-024 | 继承执行结果捕获 / 输出与候选材料 / observability material / handoff 事实[真相];handoff refs[引用];preview / analysis 正文禁止入仓 | AC-SBX-025;AC-SBX-029;AC-SBX-039;AC-SBX-041;VF-SBX-006;VF-SBX-010 |
| FR-SBX-E04 多宿主 / 多集群隔离调度 | 外围增强 | US-SBX-E04 | 继承 BR-SBX-007;BR-SBX-008;BR-SBX-010;BR-SBX-016;BR-SBX-023 | 继承隔离环境建立 / 有效边界 / lease-orphan 收束事实[真相];carrier capability 摘要[快照];carrier refs[引用];host / cluster 正文禁止入仓 | AC-SBX-024;AC-SBX-027;AC-SBX-036;AC-SBX-037;VF-SBX-003;VF-SBX-008;VF-SBX-009 |
| FR-SBX-E05 后端能力比较与策略模拟 | 外围增强 | US-SBX-E05 | 继承 BR-SBX-010;BR-SBX-012;BR-SBX-015;BR-SBX-017 | 继承策略执行裁定事实[真相];backend capability / policy applicability 摘要[快照];carrier / policy / capability refs[引用];比较 / 模拟正文禁止入仓 | AC-SBX-024;AC-SBX-028;AC-SBX-036;AC-SBX-038;VF-SBX-004;VF-SBX-005;VF-SBX-009 |
| FR-SBX-E06 容量性能成本趋势分析 | 外围增强 | US-SBX-E06 | 继承 BR-SBX-018;BR-SBX-022;BR-SBX-024;BR-SBX-032 | 继承 usage / audit / observability material 事实[真相];失败分类事实[真相];handoff refs[引用];trend dashboard 正文禁止入仓 | AC-SBX-025;AC-SBX-036;AC-SBX-041;VF-SBX-005;VF-SBX-010 |

### 6.2 跨能力追溯审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 孤儿故事审计 | pass | `US-SBX-001~016` 与 `US-SBX-E01~E06` 均已映射到至少一条 `FR-SBX-*`。 |
| 孤儿功能审计 | pass | `FR-SBX-001~018` 与 `FR-SBX-E01~E06` 均有闭环、规则、数据和验收承接。 |
| 孤儿规则审计 | pass | `BR-SBX-001~033` 已通过 Step 10 `FR-SBX-* -> BR-SBX-*` 映射进入主矩阵或外围增强继承关系。 |
| 孤儿数据审计 | pass | Step 11 的真相 / 快照 / 引用 / 禁止保存正文四类边界均被主矩阵行或外围增强继承关系承接。 |
| 孤儿接口 / 依赖审计 | pass | Step 12 `C-SBX-1~5` 与外围增强接口面都能回指 `FR-SBX-*`;没有因为 4.16 固定六列表而丢失接口边界。 |
| 孤儿验收审计 | pass | `FR-SBX-001~018` 对应 `AC-SBX-006~023`;`FR-SBX-E01~E06` 对应 `AC-SBX-024~025`;Step 13 的六类 NFR 通过 `AC-SBX-036~041` 承接。 |
| 一票否决承接审计 | pass | `VF-SBX-001~010` 均已回指核心闭环断裂、边界打穿、真相污染或追溯链断裂,没有孤立红线。 |
| 重复定义审计 | acceptable_and_explained | Runner 统一语义分散在 C-SBX-1 入口、C-SBX-3 策略和 C-SBX-4 回收链,但三者保护对象不同,不是重复定义。 |
| 边界串线审计 | pass | `L2-tools`、`L2-runtime`、`L2-member-service`、`L1-artifact`、`L4-observability`、governance / capability / policy 来源、carrier backend 仍只以既定边界进入,未被矩阵升格为 sandbox truth。 |
| Step 15 风险承接审计 | pass | “第二套正式语义”“宿主直跑”“下游真相静默升级”“cleanup 先删证据”“外部正文越权入仓”等风险均有 BR / AC / VF 约束。 |
| Step 15 待确认项挂起审计 | pass | 承载组合、policy 来源矩阵、网络粒度、ack 形态、外部存储基线和外围增强节奏仍保持挂起,未被 Step 16 误写成已确认结论。 |
| 第二真相源审计 | pass | 当前没有补写 API path、DTO、payload、state、schema、storage、test evidence 或 implementation boundary。 |

### 6.3 漏项检查表

| 检查项 | 结果 |
|---|---|
| 是否存在没有故事来源的功能需求 | 否。`FR-SBX-001~018` 与 `FR-SBX-E01~E06` 均已映射 `US-SBX`。 |
| 是否存在没有闭环映射的功能需求 | 否。核心功能映射到 `C-SBX-1~5`;外围增强显式标注为“外围增强”。 |
| 是否存在没有规则保护的核心功能 | 否。`FR-SBX-001~018` 均已映射正式 `BR-SBX`。 |
| 是否存在没有数据归属支撑的功能需求 | 否。每条正式功能都能回指 Step 11 四类数据边界。 |
| 是否存在没有验收标准的功能需求 | 否。核心功能由 `AC-SBX-006~023` 承接,外围增强由 `AC-SBX-024~025` 承接。 |
| 是否存在没有承接的业务规则 | 否。`BR-SBX-001~033` 均能回指核心功能或外围增强继承边界。 |
| 是否存在没有承接的接口 / 依赖边界 | 否。Step 12 的能力接口面与外部依赖边界均进入跨能力审计。 |
| 是否存在没有承接的非功能要求 | 否。Step 13 六类 NFR 已由 `AC-SBX-036~041` 与相关 `VF-SBX` 承接。 |
| 是否存在未进入前文结构却出现在矩阵中的新项 | 否。本 Step 只使用既有 `C-SBX`、`US-SBX`、`FR-SBX`、`BR-SBX`、Step 11 数据边界、`AC-SBX` 和 `VF-SBX`。 |
| 是否存在边界串线或第二正式语义 | 否。没有把 tools semantic、runtime loop、member lifecycle、artifact truth 或 observability store truth 拉入 sandbox 真相。 |

### 6.4 追溯结论

| 结论项 | 结论 |
|---|---|
| 核心闭环完整性 | `C-SBX-1~5` 均已由故事、功能、规则、数据和验收完整承接。 |
| 功能完整性 | `FR-SBX-001~018` 无孤儿项;`FR-SBX-E01~E06` 保留为外围增强,但不构成当前整体通过硬前提。 |
| 边界完整性 | 统一入口、正式隔离、policy fail-closed、capture / handoff 分层、failure / cleanup / redline 保守收束和 execution isolation truth ownership 均有显式追溯链。 |
| 风险承接完整性 | Step 15 风险已被规则、数据、接口、AC / VF 和 NFR 继续约束;待确认事项未被误收口。 |
| Step 17 准入 | 允许在用户确认后进入 Step 17,装配正式 `00-需求文档.md`。 |

---

## 7. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §16。正式文档可摘录本文件 §6.1~§6.4 的表格,不重复扩写 SOP 问题回答、材料诊断和设计取舍。

```md
## 16. 需求追溯矩阵

> 校准来源:
> - `design-calibration/00_req_step_16_traceability_matrix.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“主追溯矩阵”“跨能力追溯审计”和“漏项检查表”小节,了解本章如何检查闭环、故事、功能、规则、数据和验收之间的追溯关系。

本文采用 `design-calibration/00_req_step_16_traceability_matrix.md` §6 的追溯矩阵结论。主矩阵以功能需求为中心,把核心闭环、用户故事、业务规则、数据归属要求和验收标准显式连接起来。当前没有孤儿功能、孤儿规则、孤儿数据归属要求、孤儿接口边界或孤儿验收项;Step 15 的风险与待确认事项已通过规则、数据边界、接口边界和 AC / VF 口径继续约束,但未被误写成新的已确认结论。

正式章节应摘录:

- `design-calibration/00_req_step_16_traceability_matrix.md` §6.1 主追溯矩阵。
- `design-calibration/00_req_step_16_traceability_matrix.md` §6.2 跨能力追溯审计。
- `design-calibration/00_req_step_16_traceability_matrix.md` §6.3 漏项检查表。
- `design-calibration/00_req_step_16_traceability_matrix.md` §6.4 追溯结论。
```

---

## 8. 自检与停审

| 自检项 | 结果 | 说明 |
|---|---|---|
| 是否以功能需求为主轴 | yes | 主矩阵统一使用 `FR-SBX-*` 作为主轴。 |
| 是否保持了 4.16 固定六列表结构 | yes | 主矩阵未新增接口 / NFR / 风险列。 |
| 是否补上了跨能力审计和漏项检查表 | yes | 已补充接口 / 依赖、NFR、风险和待确认事项的横向审计。 |
| 是否不存在为了补齐矩阵而新增的新项 | yes | 当前只引用 Step 7~15 已确认的正式编号与边界。 |
| 是否存在孤儿故事、孤儿功能、孤儿规则、孤儿数据、孤儿接口、孤儿验收 | no | 已全部审计为无。 |
| 是否把 Step 15 挂起项误写成已收口结论 | no | 承载组合、policy 来源矩阵、网络粒度和存储基线仍保持挂起。 |
| 是否发现新的上游 blocker | no | 当前无新增上游 blocker;既有 downstream 缺口仍不阻塞 `00` Step 16。 |
| 是否允许进入 Step 17 | yes_after_user_review | 本 Step 已完成,等待用户确认后进入 Step 17 `整理正式文档`。 |

停审结论:

```text
Step 16 `需求追溯矩阵` 已按需求 SOP、书写规范、Step 7 核心闭环、Step 8 用户故事、Step 9 功能需求、Step 10 规则边界、Step 11 数据归属、Step 12 接口依赖、Step 13 非功能要求、Step 14 验收标准和 Step 15 风险挂起口径完成重建;
当前 gate_status = pass_wait_review;
未修改正式 `projects/L4-sandbox/00-需求文档.md`;
next_allowed_action = 等待用户确认后进入 Step 17 `整理正式文档`;
当前不需要提交 commit。
```
