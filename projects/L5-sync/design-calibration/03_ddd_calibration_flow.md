# L5-sync 03-详细设计校准流程

> 当前模式：`full-restart + single-agent-serial`。
> 用户授权：完成全部 `03-详细设计`（Step 11～19 继续承接 Step 1～10），并采用 `projects/L1-governance` 对应 Step 的粒度和工作框架；Step 19 装配正式 03 后停审。
> 本文件是详细设计中间产物工作台，不替代正式 `projects/L5-sync/03-详细设计.md`。
> 当前 agent 独立完成全部阅读、分析、写入和审计；禁止创建、调用或委派任何 sub-agent、worker、team 或并行代理。

## 1. 执行边界与来源纪律

- 只修改 `projects/L5-sync/` 下的设计文档、`design-calibration/` 中间产物和项目台账。
- 正式 `03-详细设计.md` 在 Step 19 前不得写入；本轮 Step 5～10 只产生校准中间产物和台账更新。
- 正式 `00/01/02` 是当前直接输入；README、旧正式 `03` 和 `draft/03_模块划分与分层.md` 仅作为 `historical_material` / `pre-calibration_input`，不得直接继承。
- `SYNC-UP-001～010` 全部保持 `pending/blocked`。本轮只能定义保守的 capability、blocked、unsupported、needs-action、probe-required 结构，不得借历史文档、fake、cache、ACK、日志或推测关闭。
- `done` 只表示中间产物完成；是否允许下一动作必须由 `gate_status`、`gate_reason` 和 `next_allowed_action` 表达。
- 不实现代码、不创建目标实现仓、不运行测试、不生成 artifact/report/evidence/verdict/signoff/readiness、不提交 commit。

## 2. 执行依据

| 类型 | 必读材料 |
|---|---|
| 详细设计流程 | `standards/document/详细设计讨论流程_SOP.md` |
| 详细设计结构 | `standards/document/详细设计书写规范.md` |
| 中间产物纪律 | `standards/document/设计文档讨论中间产物规范.md` |
| 通用设计原则 | `standards/document/设计文档编写通则.md` |
| 真相源与可落码性 | `standards/document/设计真相源闭环与可落码性标准.md` |
| 全局依赖裁剪 | `standards/document/全局项目依赖关系与裁剪规则.md` |
| 目录与代码组织 | `standards/document/子项目目录与代码文件组织规范.md` |
| TypeScript 规范 | `standards/coding/typescript.md` |
| 项目提交与语言约定 | `projects/README.md` |
| 当前输入 | `projects/L5-sync/00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` |
| 框架参考 | `projects/L1-workspace/draft/03_模块划分与分层.md`（仅参考组织粒度） |
| 专项上游 | `L0-sdk`、`L1-identity`、`L1-work`、`L1-governance`、`L1-artifact`、`L1-workspace`、`L4-archive`、`L4-observability` 当前正式文档及必要台账/校准材料 |

## 3. 状态总览与总流程计划

| Step | 主题 | 必须读取的输入 | 输出文件 | 状态 | gate_status | 下一动作 |
|---|---|---|---|---|---|---|
| 1 | 确认概要设计输入边界 | 正式 00/01/02、02 Step 12/13、专项上游、全局规范 | `03_ddd_step_01_upstream_boundary.md` | `completed` | `pass_with_upstream_blockers` | 已通过静态门禁；进入 Step 2 |
| 2 | 明确本轮实现范围和非范围 | Step 1、02 §2/§12/§13 | `03_ddd_step_02_scope.md` | `completed` | `pass_with_upstream_blockers` | 已通过静态门禁；进入 Step 3 |
| 3 | 收稳编码规范、语言/runtime、仓库约束 | Step 2、01 §11、02 §3、TS/目录/项目规范、SDK package 只读核验 | `03_ddd_step_03_coding_runtime_constraints.md` | `completed` | `pass_with_upstream_blockers` | 已通过静态门禁；进入 Step 4 |
| 4 | 收稳实现单元与文件布局 | Step 2/3、02 §4/§5、目录规范、目标仓只读状态 | `03_ddd_step_04_units_file_layout.md` | `completed` | `pass_with_upstream_blockers` | 用户已确认；进入 Step 5 |
| 5 | 定义模块实现契约主轴 | Step 4、02 五个部分/分层、Governance Step 5 框架 | `03_ddd_step_05_module_contracts_axis.md` | `completed` | `pass_with_upstream_blockers` | 已审计；进入 Step 6 |
| 6 | 逐模块定义对象实现契约 | Step 5 | `03_ddd_step_06_object_contracts.md` | `completed` | `pass_with_upstream_blockers` | 已审计；进入 Step 7 |
| 7 | 逐模块定义 Port / Adapter 契约 | Step 6 | `03_ddd_step_07_trait_port_adapter_contracts.md` | `completed` | `pass_with_upstream_blockers` | 已审计；进入 Step 8 |
| 8 | 定义 API / Command / Query / Event / Job 协议 | Step 7 | `03_ddd_step_08_protocol_contracts.md` | `completed` | `pass_with_upstream_blockers` | 已审计；进入 Step 9 |
| 9 | 定义逐接口函数级处理流 | Step 8 | `03_ddd_step_09_function_flows.md` | `completed` | `pass_with_upstream_blockers` | 已完成 29 个 flow、逐 flow停审与前序接缝回补；进入 Step 10 |
| 10 | 定义状态机与转换矩阵 | Step 9 | `03_ddd_step_10_state_matrix.md` | `completed / stop_review` | `formal_stop_review` | 17 个状态机与跨状态审计完成；等待用户确认后才可进入 Step 11 |
| 11 | 定义持久化、事务与一致性 | Step 10、Step 7 ports、Step 9 flows、治理 Step 11 | `03_ddd_step_11_persistence_transaction_consistency.md` | `completed / stop_review` | `formal_stop_review` | logical store、UoW、append/replay 与原子可见性审计完成；进入 Step 12 |
| 12 | 定义错误、异常与恢复 | Step 11、Step 6～10、治理 Step 12 | `03_ddd_step_12_error_recovery.md` | `completed / stop_review` | `pass_with_upstream_blockers` | 错误层级、29 条协议 flow 映射、known/unknown 与恢复矩阵已审计；进入 Step 13 |
| 13 | 定义并发、幂等与重入 | Step 12 | `03_ddd_step_13_concurrency_idempotency.md` | `completed / stop_review` | `pass_with_upstream_blockers` | namespaced key/digest、local/Git/fs/external 并发、exact replay与per-item重入已审计；进入 Step 14 |
| 14 | 定义配置与外部依赖绑定 | Step 13 | `03_ddd_step_14_config_dependencies.md` | `completed / stop_review` | `pass_with_upstream_blockers` | typed config/capability snapshot、metadata/SDK/Git/fs/diagnostics binding与runtime composition已审计；进入Step 15 |
| 15 | 定义可观测性与审计 | Step 14 | `03_ddd_step_15_observability_audit.md` | `completed / stop_review` | `pass_with_upstream_blockers` | closed telemetry schemas、signal/durable traceability分层、redaction与sink failure isolation已审计；进入Step 16 |
| 16 | 定义测试切口与最小验证 | Step 15 | `03_ddd_step_16_test_cuts.md` | `completed / stop_review` | `pass_with_upstream_blockers` | 模块、29入口、17状态机、一致性/错误/幂等/配置/观测与证据边界已审计；进入Step 17 |
| 17 | 详细设计到实施计划承接 | Step 16 | `03_ddd_step_17_implementation_handoff.md` | `completed / stop_review` | `pass_with_upstream_blockers` | Step 17 十类闭环与实施前置阅读已完成；进入 Step 18 风险登记 |
| 18 | 风险与待确认事项 | Step 17、所有 blocker | `03_ddd_step_18_risks_open_questions.md` | `completed / stop_review` | `pass_with_upstream_blockers` | 风险、待确认事项、未确认前姿态与责任方已登记；进入 Step 19 正式装配 |
| 19 | 正式文档装配 | Step 1～18、详细设计书写规范 | `03_ddd_step_19_formal_document_assembly.md` | `completed / stop_review` | `formal_stop_review` | 正式 03 已 full-restart 重建并完成静态闭环审计；等待用户明确授权 04 |

未来 Step 文件不得提前创建、清空或写入占位内容；只有真正进入对应 Step 时才允许创建或改写。

## 4. 本轮 Step 5～10 完成上限

Step 5～10 只收稳：

1. 五个业务 feature 与正交技术层的模块职责、暴露面和依赖方向。
2. 正式 02 的 29 个关键对象及必要二级 TypeScript 类型、字段、函数、状态和不变量。
3. local repository/UoW、owner/source/review、SDK/Git/filesystem/diagnostics 等 Port/Adapter seam。
4. Command、Query、条件性 Consumer、Operations Job 协议及其 DTO/result/error 边界。
5. 逐接口函数级处理流、prepare→call→probe/finalize、no-write query 与 unknown outcome 边界。
6. Sync-local 多轴状态机、转换矩阵、非法转换及跨状态传播；外部 truth 只作 ref/snapshot/decision layer。

Step 5～10 仍不锁定：

- 精确 Node.js 版本、package manager、CLI parser、package 名、binary 名、flags、exit code。
- `@quantalithos/sdk` 之外的依赖、Sync 专用 SDK schema、SDK 方法和错误映射。
- `.qs-sync` 物理 schema、迁移版本、存储驱动、事务实现、完整配置、测试用例和实施 phase。
- owner/source/review handoff 的正向 adapter 合同、增量 comparator、Git remote 映射、LFS/浅克隆/GUI 支持。

## 5. 持续 blocker

`SYNC-UP-001～010` 的正式登记以 `project_execution_ledger.md` 为准。本 flow 不关闭其中任何一项；任何新发现的本地布局待决必须标记为 `local_pending`，不得伪装成上游合同已闭合。

## 6. 当前停审状态

Step 19 已完成，当前唯一有效状态为：

```text
current_document = 03-详细设计.md
current_step = 19
current_module = formal_assembly / full_restart
gate_status = formal_stop_review
formal_03_status = formal / stop_review
formal_03_write_allowed = closed
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
next_allowed_action = wait_for_user_authorization_before_step_04
```

Step 11～19 的 `completed` 只表示设计中间产物和正式 03 装配完成，不表示实现、测试、证据、评审、签署或 readiness 已完成。`SYNC-UP-001～010` 与 `SYNC-LOCAL-001～005` 均未因停审而关闭。
