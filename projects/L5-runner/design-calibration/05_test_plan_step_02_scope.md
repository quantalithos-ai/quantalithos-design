# Step 2. 明确测试目标、范围和非范围

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 2
> 回填章节：`05-测试方案.md` §2
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| current_document | `05-测试方案.md` |
| current_step | Step 2 |
| current_module | `scope:priority_and_non_scope` |
| gate_status | `pass_for_step_03` |
| gate_reason | P0/P1/P2、非范围、阻断级别、owner 依赖和残余风险已收稳；每个 P0 可导向具体切口。 |
| formal_05_write_allowed | `false_until_step_15` |
| implementation_write_allowed | `false` |
| test_execution_allowed | `false` |
| commit_required | `false` |
| next_allowed_action | 创建并完成 Step 3 |

## 2. 本步输入

| 输入 | 来源 | 用途 |
|---|---|---|
| 能力节点与 FR/BR/AC | `00-需求文档.md` §7、§9、§10、§14、§16 | 定义核心证明目标和一票否决边界。 |
| 组件、flow、state、异常轮廓 | `02-概要设计.md` §5～§10 | 确定范围按能力与风险切分，而非按旧 UI 对象。 |
| 模块/协议/状态/事务/恢复/观测契约 | `03-详细设计.md` §5～§15 | 定义 P0 可测试契约和禁止 shortcut。 |
| 最小 test cuts | `03_ddd_step_16_test_slices.md` | 约束 P0 完整性和 reserved/blocked 处理。 |
| 配置范围与失败策略 | `04-配置设计.md` §2、§6～§12 | 把配置加载、readiness、redaction、rollback 纳入范围。 |

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| P0 必须通过什么证明主链成立？ | 可信 context + exact Release/version 选择；材料取得/完整性分轴；qualified 后才可发起 RunIntent；accepted/owner projection/control/cleanup/recovery 分轴；preview/diagnosis/handoff redaction 与 truth-owner 边界；所有 Query no-write、Unknown no-replay、Consumer no-parse、Job no-truth-repair。 | `00` AC-RUN-001~011；`03` §7～§15 |
| P1 覆盖什么？ | fake/controlled adapter 的语义 parity、四 profile 组合、跨模块 integration-like、generation/version race、故障注入、平台能力 conflict，以及未来 owner seam 闭合后的正向集成。 | `04` §6、§12；`03` Step 16 |
| P2 覆盖什么？ | 批量预取、多运行比较、Archive 浏览、真实平台容量/性能/SLO、生产 Observability/GRC 和产品级跨平台矩阵；不阻塞核心安全闭环。 | `00` FR-RUN-014~016、NFR 后置量化、`RUN-OPS-*` |
| 哪些不在本方案中？ | 不测试相邻仓内部 truth、Sandbox 私有 backend、Runtime loop、Artifact/Governance/Archive 完整实现、实现仓构建/部署、正式 evidence/verdict/signoff 的生成。只测公开 seam、safe refs 和 Runner-owned boundary。 | `00` §2/§4/§6；`01`/`03` truth ownership |
| 哪些是阻断级别？ | P0 安全/真相边界失败、未经资格运行、accepted→running shortcut、cleanup guard 绕过、Unknown 自动重放、raw secret/body 泄露、Query 写入、Consumer 解析未授权 payload、Job 修复 owner truth，均为阻断。 | `03` §9～§15；`00` BR/AC |

## 4. 范围表

| 范围项 | 类型 | 优先级 | 验证目标 | 非目标 / 说明 |
|---|---|---:|---|---|
| Trusted context 与 `ReleaseSelection` exact binding | context/selection | P0 | actor/scope/generation/ref 完整；拒绝 `latest/default/newest/tag/branch`。 | 不验证 Work/Governance 内部授权实现。 |
| Authority、manifest、digest/signature、platform qualification | material/integrity | P0 | `Complete`、`Verified`、`Qualified` 分轴；任何缺失或漂移 fail-closed。 | Artifact/Governance 正向合同未闭合时只测 semantic fake/negative。 |
| Acquisition task/cache protection/qualification | material/cache | P0 | quarantine、binding、cache guard、不可越级 promotion 和安全淘汰。 | 不测试真实下载协议或 cache backend。 |
| `RequestRun` 与 `RunIntentState` | command/application | P0 | qualified binding、resource guard、Sandbox request、accepted/pending/unknown 分离。 | 不将 Sandbox execution truth 纳入 Runner 测试范围。 |
| `RequestRunControl` 与 `ControlIntentState` | control | P0 | start/stop/cancel intent、owner receipt、confirmed/unknown/conflict 分离。 | 不证明 Runtime/Sandbox 控制已成功。 |
| `RequestCleanup`、`ProtectionGuard`、`RecoveryCase` | resource/recovery | P0 | guard-first、active lease/capture/handoff/retention/orphan 保护、unknown 冻结和 manual review。 | 不执行 destructive cleanup 或 reaper。 |
| 12 Queries 与 `RunnerReadModel` | read/presentation | P0 | visible/empty/not-visible/degraded/stale 映射；全部 no-write。 | 不测 UI shell 像素/布局。 |
| 4 planned Consumers | worker/contract | P0（当前负向） | header-first blocked/unsupported/rejected/strict duplicate；不解析 payload、不 ACK、不写 owner cursor。 | positive apply 保留 reserved，待上游合同重开。 |
| 5 Operations Jobs | operations | P0 | claim/checkpoint/report、bounded iteration、duplicate replay、Unknown/Blocked 保真、no truth repair。 | 不依赖真实 scheduler。 |
| 观测、redaction、safe preview/diagnosis/handoff | security/observability | P0 | forbidden-field、低基数、source/freshness、receipt≠evidence。 | 不生成正式 L4 evidence/report。 |
| UoW、版本、generation、幂等和 commit-unknown | consistency | P0 | 写入顺序、expected version、stored result、RecoveryCase、无盲重试。 | 不锁具体数据库/locking 产品。 |
| 配置 parser/validator/builder/readiness | configuration | P0 | strict JSON、四 profile、configured/enabled/ready、缺 core store fail-closed、无 feature bypass。 | 不执行真实 config artifact 发布。 |
| fake/controlled adapter 与 integration-like seam | integration | P1 | 替身语义与 formal port 一致，失败分类不靠字符串猜测。 | 不是 production readiness 证据。 |
| 四 profile isolation、failure injection、跨平台 capability conflict | environment/recovery | P1 | profile 不互相污染，unsupported/unknown/conflict 可见。 | 平台覆盖率和容量阈值后置。 |
| owner seam 正向跨仓集成 | integration | P1 / blocked | 合同闭合后验证 locator/authority/Sandbox/Runtime/Observability/Archive 正向消费。 | 当前 `RUN-UP-001~008` 阻塞，不得声称通过。 |
| 批量预取、多运行比较、Archive 浏览 | peripheral | P2 | 只验证不会改变核心 truth 边界。 | 不影响核心退出门禁。 |
| 性能、容量、SLO、生产 GRC/telemetry | nonfunctional | P2 / blocked | 待权威 workload、平台和运维合同后量化。 | 不继承旧 `200ms/1s/99.9%` 等数字。 |

## 5. P0/P1/P2 与失败处理

| 优先级 | 必须覆盖 | 自动化/执行口径 | 失败处理 |
|---|---|---|---|
| P0 | 核心能力、正式状态/协议、no-write/no-replay/no-truth-repair、redaction、配置安全 | 设计为 contract/unit/service/fake integration；目标实现仓可用后进入阻断 suite | 任一失败阻断后续合并/验收候选；当前仅记录 planned/blocked。 |
| P1 | 受控 integration、配置组合、故障注入、平台差异、恢复专项 | CI/integration-like/nightly；真实 owner seam 闭合后升级 | 可在核心 P0 通过前保持 blocked；不得降级 P0 红线。 |
| P2 | 外围增强、生产性能/容量、真实 GRC/SLO | release review/后续专项 | 进入残余风险，不阻断当前语义设计，但不得伪装已覆盖。 |

## 6. 取舍与设计边界

| 议题 | 方案 | 结论 |
|---|---|---|
| 是否按旧 Runner UI 对象分组 | 继承 `RunnerRun` 五条 UI 主线 / 按 capability + owner boundary | 按 capability + formal contract；旧对象只作历史冲突。 |
| 是否将所有跨仓正向联调列 P0 | 是 / 只将 Runner 自身 semantic boundary 列 P0 | 后者；上游 blocker 不得被 fake 隐藏。 |
| 是否固定性能数字 | 继承旧数字 / 只定义指标来源与测量方法 | 后者；数字需 authority。 |
| 是否把配置测试单独排除 | 排除 / 纳入 P0 safety cut | 纳入；04 明确配置可绕过 truth/safety 的风险。 |

## 7. 结构化中间产物：范围边界图

```text
[P0 Runner-owned semantic contract]
  context/selection -> material qualification -> run/control intent
       -> owner projection/read surface -> cleanup/recovery
       -> bounded preview/diagnosis/handoff + config/redaction
                |
                +--> [P1 controlled integration / failure injection]
                |       fake parity, profile matrix, generation races
                |
                +--> [P1 blocked owner positive seam]
                |       Artifact/Governance/Sandbox/Runtime/Obs/Archive
                |
                +--> [P2 peripheral / production qualification]
                        bulk, compare, archive browse, workload/SLO/GRC
```

关键说明：P0 图表达 Runner 的可独立证明边界，不表达任何上游 owner 已实现；P1 blocked seam 不能被 P0 fake 结果替代；P2 不得反向放宽 P0 安全门禁。

## 8. 回填草稿

正式 §2 应使用上述范围表与优先级定义，明确本轮证明的是 Runner-owned semantic safety and traceability，不是相邻仓 truth 或产品 readiness。所有未闭合 owner seam、真实平台、SLO 和外围增强均进入 P1/P2 或 blocked，并在后续 Step 5/10/14 保留可追溯入口。

## 9. 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| owner-facing exact API/DTO 是否闭合 | P1 正向 integration 仍 blocked | Step 8/10/14；不影响 P0 semantic cuts |
| performance/SLO authority | P2 阈值不可定 | Step 10；只定义测量方法 |
| 目标实现仓与 test runner | 自动化 suite 尚不能执行 | Step 9/13；保持 planned |
| 06 最终 VETO/裁决 | P0 证据的验收消费方未形成 | Step 13；先预留 AC 映射 |

## 10. 进入下一步条件

- [x] P0/P1/P2 已判定。
- [x] 范围项均绑定需求/设计来源和失败处理。
- [x] 非范围说明风险归属，不隐藏遗漏。
- [x] 当前 P0 不依赖未闭合 owner truth 的正向实现。
- [x] 可进入 Step 3 抽取对象和测试切口。

Step 2 完成，允许进入 Step 3；正式 05 仍不可写。
