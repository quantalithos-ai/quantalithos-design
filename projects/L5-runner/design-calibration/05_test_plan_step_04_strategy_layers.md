# Step 4. 制定测试策略与分层

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 4
> 回填章节：`05-测试方案.md` §4
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| current_document | `05-测试方案.md` |
| current_step | Step 4 |
| current_module | `strategy_layers:risk_discovery_and_gate_boundary` |
| gate_status | `pass_for_step_05` |
| gate_reason | 18 个 Step 3 切口均有主发现层级；高风险不依赖 E2E；P0 fake/controlled seam、四 profile 和 release gate 边界已明确。 |
| formal_05_write_allowed | `false_until_step_15` |
| implementation_write_allowed | `false` |
| test_execution_allowed | `false` |
| commit_required | `false` |
| next_allowed_action | 创建并完成 Step 5 |

## 2. 本步输入

| 输入 | 来源 | 用途 |
|---|---|---|
| Step 3 测试对象与切口 | `05_test_plan_step_03_test_objects_cuts.md` | 把每个 P0 切口放到最早可定位风险的层级。 |
| 模块/flow/state/UoW/error | `03-详细设计.md` §5、§8～§12 | 识别 unit、service、integration、entry 的边界。 |
| 配置与 profile | `04-配置设计.md` §6、§9、§11、§12 | 把 parser、builder、readiness、failure 和 profile matrix 分层。 |
| 测试规范 | `测试方案讨论流程_SOP.md` Step 4、`测试方案书写规范.md` §5.4 | 固定测试金字塔与失败处理。 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些问题必须在 Unit / Contract 层发现？ | typed ref、DTO、metadata、canonical digest、domain factory、不变量、正式 state legal/illegal transition、config parser/validator、source priority negative、redaction helper 和 metric label 规则。 |
| 哪些问题必须在 Application service 层发现？ | Command 编排与 UoW 顺序、duplicate replay、same-key/different-digest conflict、Query no-write、error mapping、stored result/receipt/report、external unknown 与 RecoveryCase。 |
| 哪些问题需要 Integration with fake/controlled adapter？ | repository expected-version/page/append、projection generation guard、builder assembly、adapter availability、resource conflict、redaction failure、claim/checkpoint race 和 job partial/unknown。 |
| 哪些问题需要 API/Worker/Job entry 层？ | name/body/metadata 校验、handler disposition、header-first Consumer、strict duplicate receipt、Job input/report surface；entry 不直连 store。 |
| 哪些场景才进入 E2E/Release gate？ | 最小跨入口闭环、四 profile 装配、redaction/boundary scan、报告完整性和未来固定 run_id 的证据汇总；不替代低层断言。 |

## 4. 测试分层图: L5-runner 测试金字塔

```text
[Release gate / evidence summary]
  - minimal selection -> qualification -> request smoke
  - profile/config/redaction/boundary summary
  - fixed-run artifact/report completeness (future)
          ^
          |
[API / Worker / Job entry]
  - command/query envelope and disposition
  - header-first consumer negative path
  - five job input/claim/report surfaces
          ^
          |
[Integration with fake / controlled adapters]
  - repository version/generation/UoW behavior
  - owner/platform/redaction failure injection
  - builder/readiness and recovery reconciliation
          ^
          |
[Application service / orchestration]
  - command ordering and idempotency
  - query no-write and stored-result replay
  - unknown/recovery and no-truth-repair
          ^
          |
[Contract / Unit]
  - refs/DTO/metadata/digest schema
  - domain state and policy invariants
  - strict config and redaction helper
```

关键说明:

- Unit/Contract 发现可由纯 schema、状态和规则直接判定的问题。
- Service 层验证副作用顺序、事务边界、幂等和 no-write；不能只看最终页面。
- Integration 使用 fake/controlled semantic ports，不表示真实上游产品已 ready。
- Entry 层验证协议映射，不把 transport status、ACK、PID 或端口升级为业务 truth。
- Release gate 只汇总已由低层产出的结果；当前没有实际 run/artifact/report/evidence。

## 5. 测试分层表

| 层级 | 目标 | 典型内容 | 主要 profile | 执行时机 | 失败处理 |
|---|---|---|---|---|---|
| Contract / Unit | 尽早发现 schema、状态、不变量和纯函数规则错误 | exact selector、DTO required、digest、factory、state matrix、strict JSON、redaction | `test-deterministic` | PR/CI fast（未来） | P0 阻断 |
| Application service | 验证正式 flow 编排、UoW、幂等、错误和副作用顺序 | 11 Command、12 Query no-write、stored result、RecoveryCase、Job orchestration | `test-deterministic` | CI service（未来） | P0 阻断 |
| Integration fake/controlled | 验证 repository/adapter/builder/平台 seam 语义 | version/generation、availability、resource conflict、redaction failure、claim race | `test-deterministic` / `integration-pending` | CI/integration-like（未来） | P0 semantic 失败阻断；真实正向保持 blocked |
| API / Worker / Job entry | 验证 envelope、handler、Consumer disposition、Job report | entry mapping、header-first、strict duplicate、five jobs | `test-deterministic` / `integration-pending` | CI/nightly（未来） | P0 阻断 |
| E2E / Release gate | 证明最小闭环、配置组合和证据汇总 | selection→qualification→request、profile matrix、redaction/boundary scan | `integration-pending` / future product | release candidate（未来） | 未有固定 run_id 时不得判定通过 |

## 6. Step 3 切口到层级映射

| 测试切口 | 主发现层级 | 辅助层级 | P0 失败是否阻断 |
|---|---|---|---|
| `context_selection_exact_binding` | Contract/Domain Unit | Application service、entry | 是 |
| `material_acquisition_integrity_axes` | Domain Unit | Service、controlled source/verifier | 是 |
| `run_intent_acceptance_boundary` | Application service | Controlled Sandbox adapter、entry | 是 |
| `control_intent_result_separation` | Domain/Service | Controlled owner adapter | 是 |
| `owner_projection_truth_attribution` | Service/Integration | Query entry | 是 |
| `resource_cleanup_guard` | Domain Unit | Platform/Sandbox controlled adapter | 是 |
| `unknown_recovery_manual_review` | Service/Job orchestration | Connectivity/owner read fake | 是 |
| `bounded_redacted_presentation` | Contract/Domain Unit | Redaction/diagnostic integration | 是 |
| `query_read_surface_no_write` | Application service + write audit | Query entry | 是 |
| `protocol_secondary_type_closure` | Contract/Unit | Entry/worker/job | 是 |
| `command_ordering_and_duplicate` | Application service | UoW/repository fake | 是 |
| `versioned_uow_commit_unknown` | Repository/UoW integration | Service | 是 |
| `entry_actor_scope_dispatch` | Entry/Contract | Application facade | 是 |
| `consumer_header_first_negative` | Worker/Service | Controlled receipt store | 是（当前负向） |
| `job_claim_checkpoint_report` | Job orchestration/entry | Repository fake | 是 |
| `config_builder_readiness_layers` | Config Unit/Builder integration | Release gate summary | 是 |
| `observability_forbidden_field_boundary` | Contract/Unit | Artifact/report scan（未来） | 是 |
| `cross_axis_non_escalation_and_event_zero` | Cross-cut contract/call audit | Release gate summary | 是 |

## 7. 高风险断言最早发现层级

| 断言 | 最早层级 | 不应只依赖 | 原因 |
|---|---|---|---|
| `Accepted` 不得变 `Running` | Domain/Service | E2E | 跨轴 enum 语义可直接判定。 |
| Query 不得 reserve/save/refresh/reconcile | Service + write audit | 页面 smoke | 必须观测零写副作用。 |
| duplicate 不得重放 external effect | Service + idempotency fake | 最终 response | 需要控制 stored result 和调用次数。 |
| commit unknown 必须冻结并关联 RecoveryCase | UoW integration | Release gate | 需要注入 commit/rollback ambiguity。 |
| Consumer 不解析 payload/不 ACK | Worker entry | 正向 E2E | 当前 positive contract 未闭合。 |
| Job 不修复 owner truth | Job orchestration + repository audit | 报告摘要 | 必须分离 report/marker 与 owner store。 |
| raw secret/body/path/URL 不出现在输出 | Redaction Unit + output scan | 人工检查 | 输出面必须机器可扫描。 |
| invalid config 不暴露 facade | Builder integration | 配置文件审阅 | 需要观察 `RunnerRuntimeBuildState`。 |

## 8. Release gate 使用边界

| 场景 | 当前是否进入 release gate | 目的 | 不承担 |
|---|---|---|---|
| 最小 selection→qualification→request smoke | planned，待实现仓/owner seam | 验证跨入口主链组合 | 不替代 11 Command 细测。 |
| 四 profile/config matrix | planned | 验证 profile 组合和 fail-closed | 不证明 product ready。 |
| redaction/forbidden-field scan | planned | 验证实际 artifacts/reports 无敏感字段 | 当前无实际 artifact。 |
| dependency boundary scan | planned | 验证 SDK/API/adapter 依赖裁剪 | 不替代架构审阅。 |
| future fixed-run evidence export | blocked | 为 06 提供可消费证据 | 不得引用 `latest` 或静态伪造 EV。 |
| real cross-repo E2E / capacity / SLO | P1/P2 blocked | 等 owner/platform/workload authority | 不作为当前 P0 退出前置。 |

## 9. 分层覆盖审计

| 审计项 | 结论 | 缺口/修正 |
|---|---|---|
| 18 个 P0 切口均有主层级 | 通过 | 见 §6。 |
| 高风险是否被全部推给 E2E | 通过 | 状态、事务、幂等、redaction、no-write 前置。 |
| P0 integration 是否误写成真实产品 | 通过 | 仅 semantic fake/controlled；正向 owner seam blocked。 |
| 四个 profile 是否可映射 | 通过 | 见 §5；`product-pending` 不得伪装 product readiness。 |
| release gate 是否承担过多语义 | 通过 | 只做组合/扫描/汇总。 |
| 是否存在未分层 P0 | 通过 | 无。 |

## 10. 测试设计取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| 高风险测试位置 | 大量 E2E / 分层前置 | 采用分层前置。 |
| P0 外部依赖 | 真实 DB/bus/owner / fake-controlled | 采用 fake-controlled；不伪造 ready。 |
| Query no-write | 最终页面 / service write audit | 采用 service write audit。 |
| redaction | 只扫报告 / helper + 输出面扫描 | 采用两层。 |

## 11. 回填草稿

正式 §4 应回填本 Step 的分层图、分层表和 18 个切口映射；明确 Release gate 只汇总低层证据，P1/P2/blocked 不得转成 P0 通过。

## 12. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| write-audit 具体工具 | Query/job 自动化细节 | Step 9 定义逻辑脚本合同，不锁实现。 |
| 目标 test runner | 真实命令和文件路径 | `RUN-DDD-001/002`；保持 planned。 |
| owner positive seam | P1 integration | `RUN-UP-001~008`；只保留 blocked/unknown。 |
| workload/SLO | 性能 release gate | Step 10 仅定义阈值来源门禁。 |

## 13. 进入下一步条件

- [x] 分层覆盖全部 Step 3 P0 切口。
- [x] 高风险未全部推给 E2E/release gate。
- [x] P0 fake/controlled 与 P1/P2/blocked 边界明确。
- [x] 失败阻断级别已写明。
- [x] 可进入 Step 5 建立追溯与覆盖矩阵。

Step 4 完成，允许进入 Step 5；正式 05 仍不可写。
