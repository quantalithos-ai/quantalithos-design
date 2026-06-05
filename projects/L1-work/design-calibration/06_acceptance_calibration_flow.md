# L1-work 06-验收标准校准流程

> 本文件是 `projects/L1-work/06-验收标准.md` 的 SOP 校准工作台。
> 它记录每个 Step 的中间产物位置、状态、验收裁决影响判定和回填章节。
> 本目录中的内容是中间产物,不替代正式 `06-验收标准.md`。
>
> 本轮状态说明:
> - 正式 `projects/L1-work/06-验收标准.md` 已按新版生成;早期 Step 中关于旧版草案的表述仅为历史诊断。
> - 本轮验收标准以新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md` 为主输入。
> - `07-实施计划.md` 与 `09-部署与运维手册.md` 是下游承接文档,不作为当前验收真相源。
> - 每个 Step 必须形成中间产物并经审核后,再进入下一 Step。
> - 正式 `06-验收标准.md` 只能在 Step 15 统一整理。

---

## 一、执行依据

| 类型 | 文档 |
|---|---|
| 验收标准书写规范 | `standards/document/验收标准书写规范.md` |
| 验收标准讨论 SOP | `standards/document/验收标准讨论流程_SOP.md` |
| 中间产物规范 | `standards/document/设计文档讨论中间产物规范.md` |
| 当前需求文档 | `projects/L1-work/00-需求文档.md` |
| 当前架构设计 | `projects/L1-work/01-架构设计.md` |
| 当前概要设计 | `projects/L1-work/02-概要设计.md` |
| 当前详细设计 | `projects/L1-work/03-详细设计.md` |
| 当前配置设计 | `projects/L1-work/04-配置设计.md` |
| 当前测试方案 | `projects/L1-work/05-测试方案.md` |
| 稳定上游 / 相邻输入 | `projects/L0-core/00~07`、`projects/L0-bus/00~07`、`projects/L0-sdk/00~07`、`projects/L1-identity/00~07`、`projects/L1-conversation/00~07`、`projects/L3-method-library/00~07` |

---

## 二、状态总览

```text
[ ] 未开始
[~] 已生成,待用户审核
[x] 已确认
```

| Step | 状态 | 主题 | 中间产物 | 回填章节 |
|---|---|---|---|---|
| Step 1 | [x] | 确认验收输入边界 | `06_acceptance_step_01_input_boundary.md` | §1 与上游文档的关系声明 |
| Step 2 | [x] | 明确验收目标与范围 | `06_acceptance_step_02_scope.md` | §2 验收目标与范围 |
| Step 3 | [x] | 固定验收基线 | `06_acceptance_step_03_baseline.md` | §3 验收基线 |
| Step 4 | [x] | 定义进入条件与退出条件 | `06_acceptance_step_04_entry_exit.md` | §4 进入条件与退出条件 |
| Step 5 | [x] | 定义功能验收门禁 | `06_acceptance_step_05_function_gate.md` | §5 功能验收门禁 |
| Step 6 | [x] | 定义数据边界与架构红线验收 | `06_acceptance_step_06_data_architecture_redline.md` | §6 数据边界与架构红线验收 |
| Step 7 | [x] | 定义接口、事件与跨仓同步验收 | `06_acceptance_step_07_interface_event_sync.md` | §7 接口、事件与跨仓同步验收 |
| Step 8 | [x] | 定义状态机、事务与一致性验收 | `06_acceptance_step_08_state_transaction_consistency.md` | §8 状态机、事务与一致性验收 |
| Step 9 | [x] | 定义非功能验收门禁 | `06_acceptance_step_09_non_functional_gate.md` | §9 非功能验收门禁 |
| Step 10 | [x] | 定义可观测性、审计与证据门禁 | `06_acceptance_step_10_observability_evidence.md` | §10 可观测性、审计与证据门禁 |
| Step 11 | [x] | 定义一票否决项 | `06_acceptance_step_11_veto.md` | §11 一票否决项 |
| Step 12 | [x] | 定义缺陷分级、复验与放行规则 | `06_acceptance_step_12_defect_retest_release.md` | §12 缺陷分级、复验与放行规则 |
| Step 13 | [x] | 定义风险接受与遗留项 | `06_acceptance_step_13_risk_acceptance.md` | §13 风险接受与遗留项 |
| Step 14 | [x] | 定义最终结论与签署口径 | `06_acceptance_step_14_conclusion_signoff.md` | §14 最终结论与签署 |
| Step 15 | [~] | 整理正式验收标准文档 | `06_acceptance_step_15_formal_document_assembly.md` | 全文 |

---

## 三、本轮校准总目标

本轮不是在旧 `06-验收标准.md` 上追加门禁,而是把新版 `00/01/02/03/04/05` 中已收稳的需求、设计、配置和测试证据口径,转化为可裁决的验收标准。

目标输出:

```text
1. 06 只承接 00/01/02/03/04/05 的已确认结论,不重新定义它们。
2. 06 按验收标准书写规范的 15 章主链组织。
3. 06 明确验收范围、验收基线、进入 / 退出条件、门禁、一票否决、缺陷复验、风险接受和签署口径。
4. 06 必须把 AC-WORK-* 验收项闭环到 03 / 04 设计契约、05 测试用例和 EV-WORK-* 证据。
5. 06 必须固定 run_id、artifact / report / acceptance handoff 路径,不得使用 latest。
6. 06 不写测试用例正文、不写实施计划、不写部署命令、不重新定义 Rust struct / enum / trait / DTO / state / error / config。
7. 如果 06 发现验收项无法回指需求、设计或证据,必须暂停并回写上游文档,不得在 06 中自行补设计。
```

---

## 四、验收输入影响判定总览

本表在 Step 14 前持续汇总。每个 Step 的中间产物都必须包含同名判定表。

| Step | 验收结论 | 是否影响上游设计 / 测试 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|---|
| Step 1 | 确认新版 `00/01/02/03/04/05` 为验收标准主输入,旧 `06` 降级为诊断输入;当前无阻塞 Step 2 的上游缺口 | 否 | 输入边界,无设计或测试契约变化 | 无 | 已确认 |
| Step 2 | 确认本轮验收 P0 裁决核心能力闭环、正式工作事实边界、详细设计契约、配置红线和证据闭环;P1/P2 只作接缝或后续专项 | 否 | 验收范围裁剪,无设计或测试契约变化 | 无 | 已确认 |
| Step 3 | 确认文档基线使用当前已生成的新版 `00~05`;真实送验裁决必须另行固定 implementation commit / build / run_id / reports,不得使用 `latest` 或模糊当前版本 | 否 | 验收基线规则,无设计或测试契约变化 | 无 | 已确认 |
| Step 4 | 定义正式验收进入条件必须固定文档、实现、构建、环境、配置、数据、run_id 和证据路径;退出条件必须形成三值裁决、缺陷和风险闭环 | 否 | 验收门禁规则,无设计或测试契约变化 | 无 | 已确认 |
| Step 5 | 定义 `AC-WORK-001`~`013` 的核心闭环和功能能力门禁,以 `FR-WORK-001`~`008`、`TC-WORK-*`、`EV-WORK-*` 为证据入口;外围增强只作 P1/P2 后置边界 | 否 | 功能验收门禁,无设计或测试契约变化 | 无 | 已确认 |
| Step 6 | 定义 Work truth ownership、外部正文排除、query / projection / maintenance no-write、配置不可绕过核心边界和唯一编译期依赖等红线门禁 | 否 | 数据边界与架构红线门禁,无设计或测试契约变化 | 无 | 已确认 |
| Step 7 | 定义 18 个 Command、8 个 Query、7 个 Inbound Consumer、9 个 Outbound Event、6 个 Operations Job 和跨仓依赖类型的接口 / 事件 / 同步验收门禁 | 否 | 接口、事件与跨仓同步门禁,无设计或测试契约变化 | 无 | 已确认 |
| Step 8 | 定义业务 truth 状态、辅助状态、UoW、rollback、optimistic version、idempotency / dedup、commit unknown 和 job recovery 的一致性验收门禁 | 否 | 状态机、事务与一致性门禁,无设计或测试契约变化 | 无 | 已确认 |
| Step 9 | 定义性能观察、运行边界阈值、可用性 / 降级、安全 / 授权、兼容性、容量、恢复和幂等一致性等非功能验收门禁 | 否 | 非功能验收门禁,无设计或测试契约变化 | 无 | 已确认 |
| Step 10 | 定义 trace / audit / outbox / structured log / metric、EV 索引、gate results、redaction、acceptance handoff、veto checklist 和 risk acceptance 的证据门禁 | 否 | 可观测性、审计与证据门禁,无设计或测试契约变化 | 无 | 已确认 |
| Step 11 | 定义 `VF-WORK-001`~`008`、release redline、redaction、evidence、配置边界、重复 truth 和追溯缺失的一票否决项;否决项不得风险接受 | 否 | 一票否决裁决门禁,无设计或测试契约变化 | 无 | 已确认 |
| Step 12 | 定义 S / A / B / C 缺陷分级、复验矩阵、缺陷记录字段和放行规则;S 级、veto、release redline、P0 evidence 缺失不可风险接受 | 否 | 缺陷复验与放行门禁,无设计或测试契约变化 | 无 | 已确认 |
| Step 13 | 定义有条件通过所需的风险接受结构、候选残余风险、不可接受风险、接受记录最小字段和风险移交规则;无接受人、无 owner、无截止条件的风险不得支撑有条件通过 | 否 | 风险接受与遗留项门禁,无设计或测试契约变化 | 无 | 已确认 |
| Step 14 | 定义最终结论三值口径、进入下一阶段 / 发布准备规则、签署角色、签署记录字段和签署不等于风险接受的边界 | 否 | 最终裁决与签署门禁,无设计或测试契约变化 | 无 | 已确认 |
| Step 15 | 按验收标准书写规范装配正式 `06-验收标准.md`,保留每章校准来源,并完成自审清单 | 否 | 正式文档装配,无设计或测试契约变化 | 无 | 待用户审核 |

---

## 五、执行纪律

- 每个 Step 必须先形成中间产物,不得直接重写正式 `06-验收标准.md`。
- 每个 Step 必须逐项回答 SOP 的“应问的问题”。
- 每个 Step 必须包含当前文档问题诊断和改动前后对比。
- 每个 Step 必须包含验收裁决取舍。
- 每个 Step 必须包含“验收输入影响判定”。
- 每个 Step 必须包含至少一个结构化产物: 表格、ASCII 图、矩阵、清单或回填草稿。
- 每个 Step 如涉及图示,必须遵守验收标准 ASCII 图统一格式。
- Step 状态从 `[~]` 改为 `[x]` 后,才能进入下一 Step。
- 未确认事项不得写成正式验收标准契约。
- 验收标准不得自行发明字段、状态、接口、错误、配置项、测试用例或证据口径。
- P0 验收项必须同时回指设计契约、测试用例、证据 ID 和固定 report 路径。
