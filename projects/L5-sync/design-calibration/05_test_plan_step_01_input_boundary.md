# Step 1. 确认测试输入边界

> 对应 SOP：standards/document/测试方案讨论流程_SOP.md Step 1。
> 回填章节：未来正式 projects/L5-sync/05-测试方案.md §1。
> 当前模式：full-restart + single-agent-serial。
> 事实边界：本文件只定义测试输入和边界，不创建测试代码、fixture、runner、artifact、report、evidence 或执行结果。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 1 / input_boundary |
| Step 状态 | completed / stop_review |
| gate_status | pass_with_upstream_blockers |
| 正式 05 写入 | false；只允许 Step 15 装配 |
| 实现 / 测试执行 / commit | false / false / false |
| 直接下一步 | Step 2：明确测试目标、范围和非范围 |
| 持续 blocker | SYNC-UP-001~010、SYNC-LOCAL-001~005 |

## 2. 本步输入

| 输入 | 权威级别 | 测试方案使用方式 |
|---|---|---|
| 00-需求文档.md | 正式需求基线 | 使用 FR-SYNC-*、BR-SYNC-*、US-SYNC-*、AC-SYNC-*、VETO-SYNC-*、CP-SYNC-* 与 NFR 作为追溯入口，不重写需求 |
| 01-架构设计.md | 正式架构基线 | 使用上下文、owner boundary、dependency direction、adapter boundary 和安全红线确定测试层级与非范围 |
| 02-概要设计.md | 正式概要基线 | 使用五个 capability part、主要对象、处理流、状态边界和异常语义抽取测试对象 |
| 03-详细设计.md | 直接设计真相源 | 使用 29 objects、ports、10 Command、13 Query、3 Consumer、3 Job、17 states、flow、UoW、errors、config、observability 和 test cuts |
| 04-配置设计.md | 直接配置真相源 | 使用 42 leaf、38 required、4 nullable operations、4 P0 profiles、strict source/validation、redaction、activation 和 failure |
| 03_ddd_step_16_test_cuts.md | 03 已停审校准输入 | 使用最小验证入口、证据上限和 blocked/waiting 语义，不把 TC-SYNC-* 误写成已存在用例 |
| 04_config_step_12_downstream_handoff.md | 04 已停审校准输入 | 使用配置测试场景、VETO、planned handoff 和 evidence ceiling，不代写 06/07/09 |
| 04_config_step_14_risks_open_questions.md | 风险和未来触发 | 带入 blocker、future trigger 和当前无 03 回写结论 |
| 旧 05/06、README、draft、其他项目 05 | historical_material / framework only | 仅做污染诊断，不覆盖当前对象、状态、配置或证据真相 |

## 3. SOP 问题回答

| 问题 | 收口回答 | 依据 |
|---|---|---|
| 承接哪些需求和非功能？ | 承接显式选择/权限、binding/metadata、status/pull、conflict/recovery、review handoff/provenance、姿态失效、safe diagnostics、幂等一致性和安全/可追溯/可用性/可观测性 NFR。 | 00 §6～§16；03 §15 |
| 哪些设计章节直接影响测试对象？ | 02 的五个 capability parts、protocol/flow/state/exception；03 §5～§15 的模块、对象、协议、flow、state、persistence、error/recovery、concurrency/idempotency、config、observability。 | 02/03 正式基线 |
| 哪些验收项需要证据？ | AC-SYNC-001~020 与 VETO-SYNC-001~005 作为未来 06 可消费的 evidence target；当前不填通过结论。 | 00 §14；04 §12 |
| 哪些内容不能在 05 重定义？ | 对象字段、DTO、Port、error、state、config leaf、source priority、owner truth、Review Decision、physical metadata schema、Git/tool contract、runner 选择和验收裁决。 | 03/04 boundary |
| 当前阻塞缺口是什么？ | SDK/source/access/review/probe、metadata physical schema、cursor comparator、Git/tool support、dirty safety 和 local toolchain 未闭合；local/fake/contract-level planned tests 可先行，positive integration blocked/waiting。 | SYNC-UP-001~010、SYNC-LOCAL-001~005 |

## 4. 测试真相边界

### 4.1 可以定义

- 设计级测试对象、切口、用例候选、数据集类别、环境 profile、suite、gate、证据 ID 和报告目录规则。
- pure domain、DTO/schema、state transition、application flow、Query zero-write、UoW/write-set、idempotency、redaction 和 forbidden-effect spy 的 planned 验证。
- 外部正向接缝的 contract/fake/controlled seam 责任和 blocked/waiting 条件。
- clone、pull、status、push-review 的显式选择、dirty non-overwrite、provenance、handoff layering 和 unknown recovery 场景。

### 4.2 不能伪造

- 不声称 suite、runner、CI、环境、fixture、artifact、report、evidence 或 run 已存在或执行。
- 不把 opaque ref、fake、cache、ACK、Git commit、telemetry、job report 或静态映射当 capability、accepted、Artifact、Baseline、evidence 或 readiness。
- 不把正向 SDK/Git/filesystem/metadata integration 写成已可执行。
- 不使用旧 SyncTask、旧状态名、旧 API、旧固定性能数字或旧证据路径作为当前测试契约。

## 5. 上游输入映射

| 测试输入 | 正式来源 | 测试方案消费点 |
|---|---|---|
| 需求、业务规则、NFR | 00 §6～§16 | §2、§5、§6、§10、§14 |
| 架构边界和依赖 | 01 §4～§10 | §3、§4、§8、§10 |
| 主要能力和处理流 | 02 §5～§10 | §2、§3、§4、§6 |
| 对象、Port、协议、状态 | 03 §5～§10 | §3、§5、§6、§7 |
| 持久化、错误、并发、配置、观测 | 03 §10～§15 | §6、§7、§9、§10、§11 |
| 最小测试切口 | 03 §15 与 03_ddd_step_16_test_cuts | §3、§4、§6、§10 |
| 配置测试契约 | 04 §5～§12 | §2、§5、§6、§7、§8、§9 |
| 验收证据目标 | 00 §14 与 04 §12 | §5、§9、§13、§14 |
| 外部 owner/blocker | 00 §15、04 §14、专项上游 | §8、§10、§14 |

## 6. 旧材料诊断与改动前后对比

| 项 | 旧方向 | 当前 05 输入边界 | 理由 |
|---|---|---|---|
| 测试主语 | 旧 SyncTask/SyncStatus/ConflictView 体验层 | 03 的 29 objects、10 Command、13 Query、3 Consumer、3 Job、17 state subjects | full-restart |
| truth boundary | 可能把 sync result 当统一真相 | 只测试 local session/metadata/cursor/mapping/conflict/recovery/handoff/provenance | 防止 local carrier 升格 |
| 配置 | 旧环境和固定值 | 04 的 42 leaf、4 P0 profiles、strict source、no fallback、no output | 与 04 唯一真相一致 |
| 证据 | 旧路径或静态索引 | artifacts/test/run_id、reports/runs/run_id、reports/acceptance；计划 ID 不等实际 evidence | 遵循测试规范 |
| 上游依赖 | 假设 provider/tool 可用 | capability blocked/waiting；fake 只证明 local contract | 保留 blocker 真实性 |
| 非功能 | 历史固定吞吐/延迟候选 | 00 的能力级 NFR；数字等待权威 workload | 不伪造性能承诺 |

## 7. 测试设计取舍

| 议题 | 采用方案 | 不采用方案 | 理由 |
|---|---|---|---|
| 上游合同未闭合 | 先完成 local contract/fake/negative 设计，正向 integration blocked/waiting | 用 fake 冒充 owner/provider/tool 正向能力 | 保持证据真实 |
| 是否沿用旧 05 | 不沿用；从 03/04 重新抽取 | 在旧 05 上追加用例 | 避免旧 truth 污染 |
| 是否预填 06 verdict | 只提供 evidence target、VETO mapping 和 planned AC | 写通过/失败/readiness | 05 不作验收裁决 |
| 是否固定 runner/tool | 只固定层级、脚本路径和 artifact/report schema | 自猜 package/test runner/Git library | SYNC-LOCAL-001~005 未闭合 |
| 是否定义 production-like E2E | 只定义入口条件和 blocked/waiting contract | 写成可执行或已通过 | 正向依赖未实例化 |

## 8. 不在 05 重新回答的问题

| 问题 | 归属 |
|---|---|
| 对象字段、DTO、Port、state、error code | 03 |
| 42 leaf、source precedence、strict parser、activation | 04 |
| 验收判定、VETO 关闭、风险签署 | 06 |
| phase/commit boundary、runner 安装、实际执行 | 07/实现 |
| 部署命令、secret provider、环境挂载和值班处置 | 09 |
| 上游 owner API、metadata schema、Git/tool support | 对应上游/持续 blocker |

## 9. 对 03/04 的影响判定

| 测试发现 | 当前处理 |
|---|---|
| 缺少测试场景但不改变字段/状态/Port | 留在 05 的切口、风险或待确认 |
| 需要新增公共字段、state、error、carrier、config leaf 或 capability | 先记录 design-change-required，回写 03/04 后重开受影响 Step |
| 上游无法提供 fixture/contract | 标 blocked/waiting；不 fake 关闭 blocker |
| 证据载体需要新 schema | 先回写 03/04/06 对应边界，再更新 05 |

当前判定：03 回写=0，04 回写=0；测试设计可进入 Step 2。

## 10. Step 1 自检与门禁

| 检查项 | 结果 |
|---|---|
| 输入文档和历史材料定位明确 | pass |
| 正式 03/04 直接测试输入列全 | pass |
| 旧 05/06 未覆盖当前测试真相 | pass |
| blocker 与正向测试上限明确 | pass_with_upstream_blockers |
| 不在 05 重新定义对象/字段/验收 | pass |
| 当前无 03/04 回写项 | pass |
| 正式 05 尚未装配 | pass |
| 允许进入 Step 2 | pass |

## 11. 回填草稿（未来正式 §1）

正式 §1 应说明：测试方案承接正式 00～04、03 测试切口和 04 配置 handoff；旧 05/06 只作 historical_material；测试计划不重新定义设计契约或验收裁决；正向外部 integration 受 SYNC-UP-001~010、SYNC-LOCAL-001~005 限制，local contract/fake/negative 可先行，positive integration 保持 blocked/waiting。

## 12. 待确认事项

| 事项 | 当前影响 | 未确认前处理 |
|---|---|---|
| 06 是否重建新的 AC/VETO 标识 | evidence 消费映射可能变化 | 使用 00 的 AC-SYNC-* 作为 planned target，并标记 06 待重建 |
| runner/package/CLI/Git library | suite 执行方式未锁 | 只写 semantic suite/script path contract |
| 上游正向 fixtures/schema | integration suite 无法执行 | blocked/waiting，不用 fake 伪造 |
| staging/production-like 环境 | E2E/release gate 未实例化 | 只定义入口条件与阻断规则 |
| artifact/report 保留策略 | 生命周期未产品化 | 05 只锁路径和 redaction，具体保留留 07/09 |

## 13. 进入下一步条件

- [x] 权威输入、历史材料和测试边界明确。
- [x] 03/04 对象、协议、状态、配置和证据上限已列为直接输入。
- [x] blocker、future trigger 和回写规则已记录。
- [x] 未产生实现、测试或证据事实。
- [x] 可以进入 Step 2。
