# Step 18. 风险与待确认事项

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 18  
> 书写规范：`standards/document/详细设计书写规范.md` §5.17  
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md`  
> 参考框架：`projects/L1-governance/design-calibration/03_ddd_step_18_risks_open_questions.md`  
> 回填位置：未来正式 `projects/L5-runner/03-详细设计.md` §17  
> 状态：`completed_with_upstream_blockers`

## 1. Step 状态与开工确认

| 项 | 当前值 |
|---|---|
| current_document | `03-详细设计.md` |
| current_step | Step 18 |
| current_module | `risks_open_questions:implementation_and_upstream_readiness` |
| gate_status | `pass_for_step_19` |
| gate_reason | 所有未关闭事项均已按影响、阻塞范围、待确认方和未确认前处理方式登记；未新增对象/协议/状态/配置/phase 事实。 |
| formal_03_write_allowed | `false_until_step_19` |
| implementation_write_allowed | `false` |
| implementation_ledger_allowed | `false_until_07` |
| test_execution_allowed | `false` |
| commit_required | `false` |
| next_allowed_action | 创建并完成 Step 19 正式详细设计装配审计 |

Step 18 只记录风险和待确认事项，不用主观判断替代 authority，不把 pending 事项写成已确认契约。Step 19 仍可在保留 blockers 的前提下装配正式 03；正式实现移交和代码开工仍受后续 `04/05/06/07` 门禁约束。

## 2. 本步目标、输入与非目标

### 2.1 本步目标

- 汇总 Step 1～17 仍影响正式文档、实现开工、生产化 adapter、测试/验收或后续文档的风险。
- 区分 `blocking implementation`、`blocking production/acceptance` 和 `downstream documentation` 范围。
- 为每一项指定待确认方和未确认前的 fail-closed / planned / blocked 处理。
- 确认 Step 19 装配不得引入旧正式 03、README、draft 的历史技术选择或旧对象主线。

### 2.2 输入

| 输入 | 用途 |
|---|---|
| Step 1～4 | 上游关系、范围、技术/仓库和 physical layout 风险。 |
| Step 5～10 | 模块、对象、port、protocol、flow、state 的内部闭环与保留路径。 |
| Step 11～13 | persistence、error/recovery、concurrency/idempotency 风险。 |
| Step 14～16 | config/dependency、observability/redaction、test-cut 风险。 |
| Step 17 | 实施阅读、字段/DTO/Query/state/metadata/idempotency/projection/phase 预复核和命名冲突。 |
| 当前文件系统与 sibling 事实 | 目标 implementation repo 缺失；其他仓/SDK 只能作为事实和边界输入。 |

### 2.3 非目标

- 不新增 schema、enum variant、状态转换、port、配置默认值、产品选择、phase、commit boundary 或测试结果。
- 不替实现者决定 language/runtime/shell/store/backend/transport/SDK method。
- 不创建实现仓、implementation ledger、boundary skeleton、脚本、fixture、artifact、report 或 evidence。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些问题仍可能影响代码实现？ | 正式 03 尚未重建；目标实现仓不存在；语言/runtime/shell/process/store 未定；L0-sdk 和各 truth owner 的 exact DTO/error/redaction/trace/lease/read surface 未闭合；local persistence backend/locking/corruption 方案未定。 |
| 哪些阻塞实现、哪些只影响后续优化？ | 正式 03、目标仓、语言/runtime、local store guarantees、exact compile/runtime binding 和关键 owner semantic seam 阻塞对应代码或正式 integration。metric backend、DLQ、diagnostic store、Archive peripheral、SLO/runbook 等不阻塞 semantic P0，但阻塞生产化/验收 evidence。04/05/06/07 缺失阻塞正式配置、测试、验收和 phase 移交。 |
| 谁需要确认？ | 详细设计维护者确认 Step 19；架构/产品 authority 确认技术与入口；L0-sdk 与 Artifact/Governance/Sandbox/Runtime/Observability/Archive owner 确认公开 seam；配置/测试/验收/实施计划维护者生成后续正式文档；用户确认是否解除文档切换停审。 |
| 未确认前如何处理？ | 保留 semantic port 和负向路径；正向 adapter/consumer 维持 Blocked/Reserved；Unknown 开 RecoveryCase；Query no-write；不复用 private implementation；不创建物理路径或 fallback store；不得声称 readiness/evidence。 |

## 4. 当前文档问题诊断

| 问题 | 影响 | 本 Step 处理 |
|---|---|---|
| 旧正式 `03-详细设计.md` | 旧 `RunnerRun/RunQueueEntry`、Rust/Tauri、queue truth 会污染新版实现入口 | 列为 Step 19 必须 full-restart 的正式文档风险。 |
| `04-配置设计.md` 未建立 | profile、secret、endpoint、limits、adapter binding 不能由实现补 | 只保留 Step 14 semantic binding；交由后续 04。 |
| `05/06` 可能继承旧口径 | 测试/验收可能引用旧状态、旧 evidence 或旧对象 | 后续按新版 03 复核/重写；当前不把旧文件当 gate。 |
| `07-实施计划.md` 未建立 | phase、commit、ledger、handoff gate 未闭合 | 不创建 implementation ledger；后续按 07 SOP。 |
| 上游 contract 不完整 | 无法证明 positive adapter、approved/baselined、running、cleaned、evidence | 只写 required semantic seam 和 blocked/recovery path。 |
| 技术与物理仓未定 | 不能写 package/crate/file/test command | Step 3/4 blocker 保持，Step 19 正式文档第 4 章明确 blocked。 |

## 5. 风险分层图

```text
L5-runner detailed design risks
  |
  +-- Formal chain
  |     +-- Step 19 formal 03 not assembled
  |     +-- 04/07 absent; 05/06 need new-03 review
  |
  +-- Implementation start
  |     +-- target repo absent
  |     +-- language/runtime/shell/store/SDK binding unresolved
  |
  +-- Upstream integration
  |     +-- Artifact/Governance/Sandbox/Runtime/Observability/Archive seams blocked
  |     +-- L0-sdk exact error/redaction/trace surface pending
  |
  +-- Production and evidence
        +-- durable backend/locking/migration/corruption repair unselected
        +-- telemetry/DLQ/diagnostic store/SLO/evidence path unselected
```

关键说明：

- 图表达风险层级和影响类别，不表达实现顺序或已存在的系统组件。
- P0 semantic contract 可以继续由 Step 19 装配，但不能被解释为 production-ready。
- 未确认的上游事实只能通过 blocked/unknown/degraded surface 进入 Runner。

## 6. 已关闭风险（不再作为 open item）

| 已关闭项 | 关闭依据 | 结论 |
|---|---|---|
| 七模块责任重复/反向依赖 | Step 5、7 跨模块审计 | 逻辑依赖方向稳定；physical layout 仍 blocked。 |
| Domain 字段来源主链 | Step 6、8、17 字段闭环预复核 | 语义来源、派生和缺失处理已登记；owner exact field 仍 blocked。 |
| DTO→object/view/report 构造缺口 | Step 8、9、17 | 11/12/4/0/5 surface 可回指；positive Consumer payload 保留 blocked。 |
| Query response/no-write | Step 8、9、11、16 | 12 Query 的 surface/page/marker 和零写入边界稳定。 |
| 状态名和非法迁移 | Step 10、16、17 | 正式 enum 和测试反查已统一；下游必须保持。 |
| persistence/version/generation | Step 11、13、16 | logical consistency 和 guard 已定义；backend 未选。 |
| error/Unknown/recovery | Step 12、13、16 | public mapping、RecoveryCase、no-replay 规则稳定；exact SDK code pending。 |
| config/readiness 分层 | Step 14、16、17 | configured/enabled/ready 与禁止配置化边界稳定；完整 04 未生成。 |
| observability/redaction | Step 15、16 | safe fields、低基数和 forbidden field 规则稳定；backend/SLO pending。 |

## 7. 风险表

| ID | 风险 | 影响 | 阻塞范围 | 缓解/未确认前处理 | 待确认方 |
|---|---|---|---|---|---|
| `RUN-DDD-004` | Step 19 正式 03 尚未装配，旧文档仍在磁盘 | 实现者可能读取旧主线 | 阻塞正式实现移交 | Step 19 删除旧文件后按 Step 1～18 重建；旧文档仅作诊断 | 详细设计维护者/用户 |
| `RUN-DDD-001` | `/home/aris/Projects/quantalithos-runner` 不存在 | 无 manifest/source/test/baseline 可核验 | 阻塞代码开工 | 不创建、不声称存在；07 PH-01 前确认 | 实施计划维护者/用户 |
| `RUN-DDD-002` | language/runtime/shell/process/packaging 未获 authority | 无法定义物理单元和测试命令 | 阻塞物理落码与构建 | 保持 logical contract；重开 Step 3/4 | 架构 authority/用户 |
| `RUN-DDD-003` | local store/cache atomicity/locking/migration/corruption 未定 | 无法实现 durable adapter | 阻塞 durable implementation | 只保留 required guarantees；不 fallback product | 架构/平台/安全 authority |
| `RUN-UP-001` | Artifact locator/manifest/integrity/revoke 合同未闭合 | 无法证明下载/验证/资格 | 阻塞正向 acquisition/qualification | C03/J01 保持 blocked；不猜 digest/algorithm/locator | Artifact owner/L0-sdk |
| `RUN-UP-002` | Governance approval/baseline chain未闭合 | Runner不能本地判定 approved/baselined | 阻塞 Current/可运行 gate | authority read 不可证明即 Blocked/Stale；不本地批准 | Governance owner/L0-sdk |
| `RUN-UP-003` | Sandbox request/lease/control/cleanup/recovery DTO未闭合 | 无法证明 Accepted/Confirmed/Cleaned | 阻塞正向 run/control/cleanup | semantic port + Unknown/RecoveryCase；不复用 backend | Sandbox owner/L0-sdk |
| `RUN-UP-004` | Runtime safe read/status/result/recovery surface未闭合 | 无法证明 Running/outcome | 阻塞 owner projection/reconcile integration | 只读 safe view；不以 PID/ACK/log补 truth | Runtime owner/L0-sdk |
| `RUN-UP-005` | Observability diagnostic/handoff/evidence boundary未闭合 | 本地诊断不能成为 evidence | 阻塞真实 diagnosis/handoff/evidence | body-free redaction/handoff posture；不保存 raw log | Observability owner |
| `RUN-UP-006` | Archive reference/restore seam未闭合 | 外围引用无法验收 | 阻塞 Archive integration，不阻塞核心 run gate | archive 只作为 degraded/peripheral safe ref | Archive owner |
| `RUN-UP-007` | 跨平台资源/端口/allocation/cleanup responsibility未统一 | 资源冲突和清理无法稳定证明 | 阻塞平台真实 adapter/acceptance | bounded observation + fail closed；不写平台数值 | Platform/Sandbox owners |
| `RUN-UP-008` | L0-sdk exact client/version/error/redaction/trace surface未核验 | semantic contract无法映射真实 SDK | 阻塞 compile/runtime integration | SDK-first；不猜 method/package/version | L0-sdk owner |
| `RUN-DOC-001` | `04-配置设计.md` 未生成 | 完整 config/profile/secret/binding 缺失 | 阻塞正式配置移交 | Step 14 semantic only；后续按 04 SOP | 配置文档维护者 |
| `RUN-DOC-002` | `05/06` 需按新版 03 复核 | 测试/验收可能引用旧对象/evidence | 阻塞正式测试/验收移交 | 不引用旧 gate；后续重写/复核 | 测试/验收维护者 |
| `RUN-DOC-003` | `07-实施计划.md` 未生成 | phase/commit/ledger/handoff gate 缺失 | 阻塞实现计划和代码开工 | 不预写 phase/commit/ledger；后续按 07 SOP | 实施计划维护者 |
| `RUN-OPS-001` | durable telemetry/DLQ/diagnostic store/SLO未选 | 不能生成运维级 evidence/report | 阻塞生产运维/验收证据，不阻塞 semantic cuts | 只实现安全字段/marker，后续由 04/05/07/运维 authority 定 | 运维/测试/infra |
| `RUN-OPS-002` | 真实 sibling integration 环境和 external GRC target未定 | 无法做真实跨仓 evidence | 阻塞 integration acceptance | fake/fixture/stub 且显式标记；不写产品格式 | 相邻仓/外部 GRC owner |

## 8. 待确认事项表

| 事项 | 当前影响 | 需要谁确认 | 未确认前处理方式 |
|---|---|---|---|
| Step 19 正式 03 装配及旧文件替换 | 正式实现入口尚未成立 | 详细设计维护者/用户 | 继续 Step 19 full-restart；不得按旧 03 开工。 |
| 目标实现仓路径、创建方式和初始 baseline | 无法创建 manifest、源码、测试或 baseline | 用户/实施计划维护者 | 保持 `RUN-DDD-001`；不创建仓、不伪造 hash。 |
| language/runtime/product shell/process model | 物理布局、入口和测试 runner 未定 | 架构 authority/用户 | 保持 `RUN-DDD-002`；只引用逻辑模块。 |
| local store/cache/file backend、locking/migration/corruption | durable persistence 无法落码 | 架构/平台/安全 authority | 保持 `RUN-DDD-003`；只实现语义 fake 设计入口。 |
| L0-sdk exact public package/client/error/redaction/trace | adapter DTO/方法/错误映射未定 | L0-sdk owner | semantic adapter + blocked mapping；不复制 SDK/private code。 |
| Artifact Release locator/manifest/integrity/revoke | 下载/验证/资格接口未定 | Artifact owner | C03/J01 blocked；不允许 latest/default/cache approval。 |
| Governance approved/baselined authority chain | Current gate 无法证明 | Governance owner | 未验证即 Blocked/Stale；Runner 不本地批准。 |
| Sandbox lease/control/cleanup/recovery contract | Accepted/Confirmed/Cleaned 无法真实闭合 | Sandbox owner | Unknown + RecoveryCase；不 resend/reclaim/cleanup。 |
| Runtime safe status/result read | Running/outcome projection 无法闭合 | Runtime owner | safe read unavailable/unknown；不由本地进程推导。 |
| Observability diagnostic/handoff/evidence DTO | diagnosis/handoff 无法成为真实交接 | Observability owner | bounded redaction only；不存 raw body，不生成 evidence。 |
| Platform resource/port/allocation responsibility | 跨平台冲突/清理无法验收 | Platform/Sandbox owner | bounded observation + fail closed；不锁数值。 |
| `04/05/06/07` 正式文档 | config/test/acceptance/phase 不闭合 | 对应文档维护者 | 不把旧文件当新版 gate；后续按各 SOP 生成/复核。 |
| git commit rule authority and current identity | 实现提交可能违反项目纪律 | 实施计划维护者/用户 | 开工前重读有效规范并执行 `git config` 核验；本轮不提交。 |

## 9. 未确认前处理规则

| 场景 | 规则 |
|---|---|
| 正式 03 未生成 | 不恢复旧 03；继续 Step 19；校准文件只作设计输入。 |
| 目标实现仓/语言未确认 | 不写代码、不创建 manifest/package/crate/binary/test target。 |
| 上游 typed contract 未闭合 | 只保留 semantic port、blocked/unknown/recovery 和 header-first negative path；不得复制上游私有实现。 |
| local store/backend 未确认 | 不写 DDL/migration/lock/path；不以 in-memory/file fallback 宣称 production。 |
| Query / render / reconnect 请求刷新 | 拒绝写入；显式 J05/J03 才能 refresh/reconcile。 |
| Unknown/commit-unknown/duplicate result missing | 冻结并关联 RecoveryCase；只读对账；禁止 replay/resend/reclaim/resume。 |
| configured/enabled/ready 混淆 | 保持 marker/build 三层；配置不能绕过 truth/safety gate。 |
| local log/receipt/report/handoff | 只作 safe local record；不得升级 formal audit/evidence/report/verdict/signoff。 |
| 旧名/旧技术残留 | 回写 Step 19 正式装配；不得由实现者自行兼容旧主线。 |
| 下游文档缺失 | 不把旧 `05/06` 或不存在的 `07` 当实现门禁；等待对应 SOP。 |

## 10. 回填草稿（未来正式 §17）

正式 `03-详细设计.md` §17 应回填：

- 风险分层和 blocker 影响范围（§7）。
- 待确认事项及负责人（§8）。
- 未确认前处理规则（§9）。
- 明确旧正式 03、README、draft 只作 historical/冲突输入；新版 Step 1～18 是正式装配来源。
- 明确 Step 19 后仍不等于 implementation ready；`04/05/06/07` 和上游 authority 仍是后续门禁。

不得把 §8 pending 事项转写为对象字段、协议字段、状态转换、配置默认值、产品选择、phase、commit、evidence 或 readiness。

## 11. Step 18 完成条件与进入 Step 19

| 条件 | 结论 |
|---|---|
| 未关闭事项均已登记 | 通过；见风险表和待确认表。 |
| 阻塞范围明确区分 | 通过；分别标记实现、生产/验收和下游文档影响。 |
| 待确认方明确 | 通过；owner/文档/用户责任已列出。 |
| 未确认前处理明确 | 通过；fail-closed/planned/blocked/no-replay 规则已列。 |
| 未新增设计事实 | 通过；本 Step 只记录风险，不新增 schema/state/config/phase。 |
| 可进入 Step 19 | 通过；下一动作是正式 03 装配审计。 |

Step 18 完成。本文不证明实现仓、baseline、commit、测试、artifact、report、evidence、verdict、signoff 或 readiness 存在。
