# Step 1. 确认实施输入边界

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 1\
> 日期：2026-09-14\
> 状态：`completed / pass_with_blocked_implementation_lanes / continue_authorized`

## 1. Step 状态与开工确认

| 项 | 结论 |
|---|---|
| 当前 Step | Step 1：确认实施输入边界 |
| 输出文件 | 本文件；正式回填目标为未来 `07-实施计划.md` §1 |
| 已读取通用规范 | 设计文档编写通则、中间产物规范、真相源闭环标准、全局依赖规则 |
| 已读取类型规范 | 实施计划 SOP、实施计划书写规范、代码实施台账规范、目录组织规范 |
| 已读取前序输入 | project ledger、06 flow/Step 15、正式 00～06、03/05/06 关键实施/证据章节、专项 owner 正式文档与样本 07/ledger |
| 当前模式 | `full-restart / continuous_authorization / single-agent-serial` |
| gate_status | `pass`（仅允许继续设计 Step 2；不允许实现） |
| gate_reason | 正式 00～06 均已停审，足以设计 phase/boundary；外部合同、实现仓与本地 provider 缺口已精确保留为实施 blocker，不由 07 补造 |
| next_allowed_action | `create_and_complete_step_02_scope` |

## 2. Step 内计划

- [x] 读取实施计划标准、正式 00～06、project ledger 与 06 完成记录。
- [x] 核对目标实现仓、正式分母、依赖分类与 historical material。
- [x] 回答 Step 1 的八个 SOP 问题。
- [x] 诊断输入冲突、区分计划可继续与实现不可继续。
- [x] 建立上游输入、闭环状态、缺口分类与回填草稿。
- [x] 自检并同步 07 flow/project ledger；按连续授权允许 Step 2。

复杂度判断：本 Step 只固定输入/缺口，不展开 phase、任务或提交边界；无需拆附录。

## 3. 本步输入

| 输入 | 状态 | 本步用途 | 限制 |
|---|---|---|---|
| 正式 `00～06` | `formal / stop_review` | 需求、架构、对象/协议、配置、测试、验收唯一项目内基线 | 当前工作区不是 immutable implementation baseline |
| `03` Step 4～18 | completed | 文件/对象/port/flow/state/UoW/error/config/evidence 与实施 handoff | 不把 planned file 当源码 |
| `04` Step 5～14 | completed | source/profile/key/assembly/failure/migration | 不填未闭合值/provider |
| `05` Step 5～15 | completed | 102 TC、13 suites、5 gates、14 scripts、19 EV 与证据合同 | 未运行、实例为 0 |
| `06` Step 3～15 | completed | baseline、AC/VETO、证据、三值裁决 | 未进入实际验收 |
| 专项 owner 正式文档 | current formal/historical status 按各项目自身声明 | source/restore/decision/material 与依赖分类核验 | 不改变本仓边界，不假设合同 ready |
| L1-workspace/L1-governance/L1-artifact/L4-observability 07/ledger | 参考样本 | 粒度、phase/boundary、台账与事实边界 | 不复制领域主语或数量 |
| 目标 `/home/aris/Projects/quantalithos-archive` | absent（只读核对） | 实施现实前置 | 本轮不创建、不核验 Git/Cargo/build |

## 4. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 00/01/02/03/05/06 是否齐全？ | 是，且 04 也已齐全；正式 00～06 均已停审。 | project ledger §2；各正式文档状态 |
| 哪些版本为计划输入？ | 当前正式 00～06 工作区内容；实施前必须另冻结 immutable design baseline，当前不得填 hash。 | 06 §3；台账规范 Design Gate |
| 03 是否足以 1:1 实现？ | 本地已定义面足以规划；外部 exact contract、codec/cursor/durable/provider 等受 18 项 blocker/pending 影响，只能规划 blocked boundary。 | 03 §16～§17 |
| 05/06 是否足以定义阶段门禁？ | 是；18 CUT/102 TC/19 EV/AC/VETO 与路径均可用于计划，但当前没有实际 run/证据。 | 05 §3～§14；06 §3～§14 |
| 上游是否有冲突？ | 已知 `AR-ARCH-001` 是全局依赖矩阵与 SDK 方向冲突；本仓固定不引入 SDK compile 依赖。其余为未闭合合同而非可由 07 决定的冲突。 | 01 §8；03 §3/§17；project ledger |
| 字段/DTO/state/phase 是否闭合？ | 本地对象、协议和 18 states 已有细化来源；每个 future boundary 仍必须执行主动闭环复核。外部/本地 pending 未闭合的 boundary 保持 blocked。 | 03 Step 6～17；闭环标准 |
| 05/06 是否使用正式命名？ | 当前审计分母一致：26 objects、30/32 surfaces、18 states、102 TC、19 EV；未发现 unresolved 本地命名冲突。 | 05/06 Step 15 审计 |
| 哪些缺口阻塞计划/实现？ | 无缺口阻塞“规划”；目标仓、immutable baseline、18 blocker/pending 阻塞相应实现、formal conformance、测试退出与 readiness。 | 06 §13；本文件 §7 |

## 5. 当前材料问题诊断与 historical 审计

| 问题 | 影响 | 处理 |
|---|---|---|
| 尚无正式 07 | 无可恢复实施路径与 boundary 台账 | 按 Step 1～13 从零生成，Step 13 前不创建正式 07 |
| 目标实现仓不存在 | 不能声称 repo/workspace/package/branch/build 存在 | 作为 implementation prerequisite blocker；本轮不创建 |
| 当前设计未冻结 Git baseline | 不能给 Design Gate 填 commit hash | 记 `not_fixed_until_authorized_handoff` |
| 外部合同未闭合 | source/storage/integrity/governance/receiver 正向实现不可开始 | 按 exact target 映射 blocked boundary，不允许 fake 替代 |
| README/draft/旧正式材料含固定 provider、期限、数字或旧主语 | 污染 phase、配置和完成判定 | 只作 historical material；正式 00～06 优先 |
| `AR-ARCH-001` 依赖方向冲突 | 错误 Cargo edge 可产生 SDK↔service 循环 | Archive 服务端排除 SDK compile；交给 owning standard/project 关闭 |

## 6. 改动前后对比与设计取舍

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 实施输入 | 对话和 03 handoff 中散列 | 正式 00～06 + scoped calibration + owner docs 分级 | 避免第二真相源 |
| 可继续性 | 易把 blocker 解释为无法写 07 | 计划设计可继续，受影响实现仍 blocked | 计划完整性与事实可用性分离 |
| baseline | 容易使用 dirty HEAD/日期 | 实施前另冻 immutable baseline；当前 absent | 禁止伪造 hash |
| 外部依赖 | 可能用 sibling path/fake | Core 仅 compile candidate；其余 runtime/event/ref/adapter/fake | 符合正式依赖裁剪 |
| 历史材料 | 可能直接继承旧方案 | 仅做污染审计 | full-restart |

取舍结论：选择“完整规划所有 required lane，并把不可实施处精确标 blocked”，不删除 P0 lane，也不把未知合同固化成产品/算法/接口选择。

## 7. 结构化中间产物

### 7.1 实施输入边界表

| 正式输入 | 本计划使用 | 不得重定义 | 状态/风险 |
|---|---|---|---|
| `00` | A1～A9、F/BR/NFR、owner 边界 | 优先级、业务/治理 authority | available；blocker retained |
| `01` | U1～U6、依赖/所有权/交互 | 架构边界、部署/provider 决定 | available；SDK conflict open |
| `02` | 6 CP、26 对象、30 logical entries、flow/state 轮廓 | 新 capability/object/API | available |
| `03` | 6 crates、26 objects、8 services、7 ports、30/32、18 states、UoW/effect | 字段/DTO/port/state/flow | locally closed；external/local pending |
| `04` | 12 domains/55 keys、profiles/binding/fail-closed | 真实配置值、secret/provider | design available；runtime binding absent |
| `05` | 18 CUT/102 TC/13 suites/5 gates/14 scripts/19 EV | 用例或执行结果 | design available；execution=0 |
| `06` | P0 AC、10 VETO、defect/risk/signoff | verdict/risk/signoff/readiness | design available；acceptance not entered |

### 7.2 闭环与实施阻塞表

| 闭环面 | 当前设计状态 | 受影响实施范围 | 处理 |
|---|---|---|---|
| 本地字段/DTO/状态 | 可从 03/校准精确读取 | contracts/domain/application/local flows | 每 boundary 开工前二次核验 |
| source/material authority | `AR-UP-001/006/007/008` open | capture/bundle/restore/formal seam | typed slot + fail-closed；positive blocked |
| governance/project state | `AR-UP-002/003` open | lifecycle/restore admission | 只消费决定；缺失零 effect |
| integrity/storage | `AR-UP-004/005` open | verify/place/retrieve/lifecycle | provider-neutral slot；positive blocked |
| restore receiver | `AR-UP-009` open | plan/material/handoff/outcome | per-owner blocked；禁止 direct DB |
| dependency direction | `AR-ARCH-001` open | Cargo graph/downstream SDK | SDK excluded from server compile graph |
| outbound | `AR-HLD-Q-001` blocked | outbox/publisher/topic/delivery | 全部不交付；若解锁回开设计 |
| workload/numbers | `AR-HLD-Q-002` open | budgets/P2/NFR | 不填数字；measured not_run |
| codec/cursor/store/config/telemetry | `AR-03-LOCAL-001～005` open | production local adapters/assembly | blocked until formal decision + proof |
| implementation start | `AR-03-LOCAL-006` open | all code/test/commit | 07 只计划；另需用户授权 |

## 8. 回填草稿

正式 §1 应声明：本计划只转译已停审的正式 00～06；正式文档优先，calibration 用于 scoped 解释；目标仓和 immutable baseline 当前不存在；18 blocker/pending 不阻止计划设计但阻止相应实现和完整验收；Archive 只拥有本地归档/恢复 truth，所有外部 relation 必须保持 compile/runtime/event/ref/adapter/fake 分类。

## 9. 待确认、上游影响与事实边界

| 事项 | owner | 影响 | 截止点/姿态 |
|---|---|---|---|
| 18 个既有 blocker/pending | 对应 owning project / L4-archive implementation owner | 对应 positive boundary | 每 boundary 开工前；保持 open |
| 目标仓与 immutable baseline | 用户/实施交接 | 所有 boundary activation | 实施前；本轮 absent |
| 实际 Git identity/toolchain/Core layout | 目标仓/实施者 | Commit/Build Gate | PH-01 preflight；当前不核验 |

本 Step 未发现需要修改上游正式文档的新 blocker；只把已知冲突与缺口映射到 07。未实现、未测试、未生成证据、未提交。

## 10. 自检与进入下一步条件

- [x] 正式 00～06 齐全且状态可追溯。
- [x] 计划可继续与实现 blocked 已分离。
- [x] known conflict、18 blocker/pending、target repo/baseline absence 已登记。
- [x] 未把 historical material、fake、planned path 或静态审计当实现事实。
- [x] 用户已连续授权全部 07；允许创建并完成 Step 2。
