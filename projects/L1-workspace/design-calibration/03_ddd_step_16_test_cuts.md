# Step 16. 测试切口与最小验证清单

> SOP Step16；书写规范§5.15；回填正式03 §15。

## 1. Step 状态

completed / pass_with_external_slots。七模块、十四入口、状态、事务、配置及观测最小切口已逐项补审；未执行项目测试。

## 2. 本步输入

[Step4](03_ddd_step_04_file_layout.md) §7.7测试发现路径；[Step5](03_ddd_step_05_module_contracts.md)、[Step6](03_ddd_step_06_object_contracts.md)、[Step7](03_ddd_step_07_trait_port_adapter_contracts.md)、[Step8](03_ddd_step_08_protocol_contracts.md)、[Step9](03_ddd_step_09_function_flows.md)、[Step10](03_ddd_step_10_state_matrix.md)、[Step11](03_ddd_step_11_persistence_transaction_consistency.md)、[Step12](03_ddd_step_12_error_recovery.md)、[Step13](03_ddd_step_13_concurrency_idempotency.md)、[Step14](03_ddd_step_14_config_external_binding.md)、[Step15](03_ddd_step_15_observability_audit.md)。参考governance Step16按模块、入口、状态和原子性分别给最小断言。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 各模块测什么？ | §7.1给现有计划suite和边界，support须显式mod导入。 |
| 每接口正/异常？ | §7.2十四行逐入口，不把六Query共用一句话。 |
| 状态合法/非法？ | §7.3按Step10全部状态族参数化，未列迁移默认拒绝。 |
| 并发和事务？ | §7.4读后/提交前屏障与故障注入，检查完整存储集合。 |
| 哪些留05？ | 用例编号、fixture、优先级、环境、脚本、报告/证据schema和运行安排。 |

## 4. 当前文档问题诊断

首批“每个Query测试Transient”不适用于Inbox/local/operation/recovery四种Query；“四Operations全部Requested到Completed”也混淆请求/推进/替代/失效。现按实际DTO/flow分派。含外部blocked slot的正向测试不能凭fake伪造owner证明，必须明确等待正式fixture合同。

## 5. 改动前后对比

| 初稿 | 本步修正 |
|---|---|
| 接口族总述 | 十四条独立正向、异常、零写/原子断言 |
| fake等于可集成 | 局部已闭合值可unit；外部正向slot等待owner schema |
| 状态名仅示意 | 九状态、两代角色/安全轴、coverage等按正式名 |
| 测试文件未定位 | 复用Step4现有member-local suite，不新增根tests |

## 6. 设计取舍

测试切口是未来验证要求，不是测试结果或验收签署。编译依赖外部缺口未闭合时不能用String别名让fixture“先通过”；可先实现独立局部值/分类负向测试，其余标blocked。当前03没有新增脚本交付物；若05/07决定交付gate/report/check脚本，须先回源补脚本参数与机器产物schema，不能直接编写。本步不新增ASCII图，矩阵足以回查。

## 7. 结构化中间产物

### 7.1 模块与自动发现路径

| 模块 | 计划suite路径（实现仓相对） | 最小切口 / 类型 |
|---|---|---|
| contracts | crates/contracts/tests/protocol_boundary.rs | ID不互换、四版本checked_next、key/digest编码、DTO enum与safe error；unit/property |
| domain | crates/domain/tests/local_state_invariants.rs | 16对象factory、不变量、状态迁移、失败不改self；unit |
| application | crates/application/tests/query_no_write.rs | 六Query与SourceReadService零写、权限优先；service |
| application | crates/application/tests/maintenance_consistency.rs | 七写store方法、duplicate、gap、unknown、recovery；service |
| infra | crates/infra/tests/adapter_contract.rs | 锁域、FK、commit回读、限额、Cursor加密、adapter故障；contract |
| infra | crates/infra/tests/read_model_boundary.rs | api/worker/jobs库入口组合，无跨层写捷径；integration切口 |
| api | crates/api/tests/read_surface.rs | metadata唯一来源、当前裁剪、safe失败无ref/count；protocol |
| worker | crates/worker/tests/consumer_boundary.rs | 正式event验证、重复/乱序/缺口/逐target回执；consumer |
| jobs | crates/jobs/tests/recovery_boundary.rs | 四独立Operations、一次有界推进、终态拒绝；entry/service |

辅助路径仅application/tests/support/mod.rs与fakes.rs，suite显式导入；其他suite需fixture时先按05补正式目录，不能假定共享根tests可自动发现。fake不在生产lib导出。

### 7.2 十四入口最小断言

| 入口 | 正向切口（外部proof齐全为前提） | 异常与副作用切口 | 主要suite |
|---|---|---|---|
| ProvisionWorkspacePartition | 生成partition version1/current None，与operation同提交 | same-key回原值；不同key同scope Conflict；无local/generation隐式创建 | maintenance_consistency |
| ChangeWorkspaceLocalState | Absent显式初始化或Present next；按变体仅改局部字段 | read Advance不可比较拒绝；MarkUnread保留；source/receipt不写；异digest Conflict | maintenance_consistency |
| GetWorkspaceView | Materialized coherent snapshot；显式Transient安全聚合 | Sources selection缺合同blocked；Transient after拒绝、无durable marker；current安全失效拒绝 | query_no_write/read_surface |
| ListWorkspaceInbox | 只Present可见item；StableIdentity/PinnedFirst；read三值正确 | Withdrawn/hidden不泄漏count；overlay缺失零创建；旧local/generation token拒绝 | query_no_write/read_surface |
| GetWorkspaceLocalState | 当前授权后Absent或裁剪后的Present | 不生成默认overlay；focus/ref撤权裁剪；无last_opened写 | query_no_write/read_surface |
| GetWorkspaceOperationResult | 返回原stored result与operation_ref | result ref跨partition拒绝；当前权限撤销整体NotAvailable；不把原Requested改当前Completed | query_no_write/read_surface |
| GetWorkspaceRecoveryStatus | 同快照attempt/version/candidate/role/safety/current | Blocked/Failed必须failure，Superseded必须replacement；不Advance/repair | query_no_write/read_surface |
| ExportWorkspaceReadModel | QueryKind::Export安全read_model/schema_version1 | View token不可复用；Transient不生成token；无archive artifact/receipt/outbound | query_no_write/read_surface |
| ConsumeSourceChange | Applied原子更新；LateIgnored只记录原安全位置；Duplicate原结果 | 乱序正式分类；Gap无terminal；异digest Conflict；Unknown先lookup；不ACK | consumer_boundary |
| ConsumeSourceInvalidation | 单target合法失效；fanout逐partitionreceipt | NoTargets不建行；部分提交/未知不跳next；新目标不能绕过安全决定 | consumer_boundary |
| RequestWorkspaceRecovery | 新attempt Requested+Candidate Unverified+empty projection原子保存 | existing partition必需；无current切换；原key重复无第二候选 | recovery_boundary |
| AdvanceWorkspaceRecovery | 每次仅一有界阶段/batch，Ready合法才能cutover | baseline/cursor不连续blocked；Ready变更回Validating；四终态新key禁止 | recovery_boundary |
| SupersedeWorkspaceRecovery | 同partition已有非自身replacement，旧attempt终态Superseded | 跨partition/自环/环拒绝；不修改replacement或current；原key返原结果 | recovery_boundary |
| InvalidateWorkspaceView | DataStale或SafetyBlocked的明确basis与targets | 无依据拒绝；目标漏项/版本变更CAS失败；DataStale不改safety/coverage | recovery_boundary |

六Query均附加write spy断言：WorkspaceAtomicStore七方法调用总数为0；无create/refresh/read cursor/last-opened/operation record写入，观测开关不影响该断言。无需用不存在的mock写方法模拟“隐式刷新”。

### 7.3 状态族覆盖

| 状态族 | 合法覆盖 | 非法 / 边界覆盖 |
|---|---|---|
| CoverageState | Unknown/Partial/Complete→正式advance；Gap保留安全进度 | Invalidated不可解除；无proof不能Complete；gap无bridge不可advance |
| AttentionState | Present/Withdrawn镜像正式生命周期 | 不凭文本产生attention；Withdrawn重开须owner依据 |
| RebuildStatus | Requested→Baselining→CatchingUp→Validating→Ready→Completed；中间批次自环 | Completed/Blocked/Failed/Superseded不复活；Ready回校不能绕SafetyBlocked |
| GenerationRole | Candidate→Current→Retired | Retired不回Current；单partition最多一个Current |
| GenerationSafetyState | Unverified→Validated；候选变化→Unverified；安全失效→SafetyBlocked | SafetyBlocked不清除；DataStale无safety迁移 |
| LocalReadBasis / intent | Absent→Present(1)、Present(n)→Present(n+1) | Query不初始化；ReadCursor按stream独立；u64溢出拒绝 |
| ReadClassification | 正式关系Read/Unread；无依据Unknown；override优先Unread | source cursor不等read basis；visibility缺失不是Unknown可展示 |
| terminal record | Applied/LateIgnored不可变；operation回原StoredWorkspaceResult | Gap/Blocked/Unknown不伪terminal，result FK缺失不补造 |
| Read axes | Fresh/Stale/Unknown × Complete/Partial/Unknown安全组合 | 安全unknown始终fail-closed，token不是authorization |
| CommitOutcome/Resolution | Operation/Source/Gap精确回读；确定终止NotCommitted | 缺行/超时/进程死仅Pending；不生成第二成功结果 |
| AdapterAvailability | Bound/Unavailable/ContractBlocked按观测 | Bound非readiness/allow；配置不能直接设Bound |

### 7.4 原子、并发、配置与观测

| 切口 | 故障/竞争注入 | 必须断言 |
|---|---|---|
| apply原子性 | 写projection后、terminal前中断 | 全部不可见或全部可见；无半cursor/Inbox |
| baseline原子性 | bindings/result之间中断 | provenance不悬空；无fake event key |
| commit unknown | 提交后回包丢失、权威读不可用 | Pending保留；恢复后返原record，版本不二次增长 |
| gap unknown | gap事务回包丢失 | resolve为Gap，后续同event可正式Applied |
| cutover竞争 | validate后并发写候选/失效/换pointer | 任一basis变化拒绝旧切换；current不混世代 |
| 两个local写 | 同expected屏障并发 | 一胜一冲突，read_cursors/overrides不丢 |
| duplicate与新版本 | 旧操作重放时当前state已变化 | 原结果优先；不以旧expected拒绝同key replay |
| fanout分页 | 中间target Unknown | 已提交独立保留；未决不跨页丢失 |
| store全量装配 | 超rows/bytes上限 | 明确Unavailable，绝不截断Complete |
| config/DI | 零时限、缺slot、可写store注入query | 校验拒绝/受影响分支blocked，domain无配置I/O |
| token | 每绑定轴改变、header/nonce/ciphertext/tag篡改 | CursorInvalid；解密错误无细节；encode无DB写 |
| telemetry | raw字段canary、sink失败、duplicate | 禁止字段零出现；sink不改变事务；无版本全局gauge |

### 7.5 验证能力分级

| 类别 | 可以证明 | 当前边界 |
|---|---|---|
| 局部unit/property | 已闭合局部类型、状态、不变量 | planned，未执行 |
| port fake/故障注入 | 已定义的局部编排与负向处理 | 需类型可构造，未闭合owner proof不得伪造 |
| durable adapter contract | 真正持久事务、锁、重启、unknown | WS-LOCAL-001 blocked |
| owner/bus integration | exact schema、次序、权限撤销和replay接续 | WS-UP-001~005/007 blocked |
| 下游read/export | SDK/product/sync/archive消费合同 | WS-UP-006/006-S blocked；无archive反向truth |

## 8. 回填草稿

正式§15给suite映射和十四入口索引，读者继续读本步§7完整断言。05/06需将planned切口映射真实用例/验收，不得宣称本轮已测试通过。

## 9. 待确认事项

fixture与机器报告契约、测试环境、验收编号和实际运行证据均未创建，交05/06/07；上游/driver阻塞按§7.5保留。

## 10. 进入下一步条件

七模块、十四入口每项均有正/异常切口，全部状态族、事务、幂等、配置与观测有可执行断言设计。补审通过，进入Step17。
