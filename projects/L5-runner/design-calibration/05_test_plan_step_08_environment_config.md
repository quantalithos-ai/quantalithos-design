# Step 8. 设计测试环境与配置矩阵

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 8
> 回填章节：`05-测试方案.md` §8
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与事实边界

| 项 | 当前值 |
|---|---|
| current_document | `05-测试方案.md` |
| current_step | Step 8 |
| current_module | `environment_config:profile_dependency_and_unavailable_matrix` |
| gate_status | `pass_for_step_09` |
| gate_reason | 四个正式 profile、local/CI/controlled/replay 环境、compile/runtime/event 依赖分类、配置域矩阵、18 个切口的数据分配和不可用处理均已闭合；未把真实跨仓环境或 profile 标签写成 readiness。 |
| formal_05_write_allowed | `false_until_step_15` |
| implementation_write_allowed | `false` |
| test_execution_allowed | `false` |
| commit_required | `false` |
| next_allowed_action | 创建并完成 Step 9 |

本 Step 只定义测试环境、配置 profile、依赖类型、测试协作方式和环境故障处理。环境 ID、profile 文档、adapter ref、fixture root、命令、CI job、artifact、report、run_id、evidence、verdict 和 readiness 均为计划合同，不表示已经创建或可运行。

## 2. 本步目标、输入与非目标

### 2.1 目标

把 Step 6 用例和 Step 7 数据集放入可定位的测试环境，明确：

1. `local-safe`、`test-deterministic`、`integration-pending`、`product-pending` 各自能证明什么、不能证明什么；
2. local、CI、controlled integration、operations replay 和未来 product-like 环境的职责；
3. `L0-core`、`L0-sdk`、Artifact、Governance、Sandbox、Runtime、Observability、Archive、平台及事件协作的依赖类型；
4. 每个配置域和关键失败姿态对测试结果的影响；
5. 环境或依赖不可用时，何时 fail-fast、何时产生预期的 `Blocked/Unknown/Degraded` 负向断言、何时只能记为未执行；
6. 所有 P0 切口和数据集都有环境归属，且不会把 fake/fixture 当成真实 owner 证据。

### 2.2 输入基线

| 输入 | 本 Step 用途 |
|---|---|
| `05_test_plan_step_06_cases.md` | 提供用例层级、controlled adapter、write-audit、header-first、Job 和静态扫描要求。 |
| `05_test_plan_step_07_test_data.md` | 提供数据集、profile 隔离、fault profile、清理和替身边界。 |
| `01-架构设计.md` §8 | 提供 compile/runtime/event 依赖分类、SDK-first 和禁止 sibling 私有实现。 |
| `03_ddd_step_14_config_dependencies.md` | 提供 builder、adapter slot、store、clock/id/digest 和 readiness seam。 |
| `04-配置设计.md` §6～§12 | 提供四个 profile、七个配置域、strict source、configured/enabled/ready 和 fail-closed 规则。 |
| `05_test_plan_step_04_strategy_layers.md` | 提供测试分层和 P0 fake/controlled、P1/P2 blocked 边界。 |

### 2.3 非目标

- 不选择语言、GUI/CLI shell、数据库/cache/backend、容器/虚拟化、transport、SDK 版本、topic、OS 命令、endpoint 或 secret provider。
- 不把 `integration-pending` 或 `product-pending` profile 名称解释为外部依赖已就绪；不创建 staging/production 环境。
- 不把 sibling 仓库源码、内部表、私有 bus topic、Sandbox 私有 Docker/gVisor/Firecracker 实现加入 compile 或 runtime 测试依赖。
- 不在本 Step 固定 suite、脚本、artifact/report 目录或正式证据编号；这些留给 Step 9/13。

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| local / CI / integration / staging 分别测什么？ | local 复现单个语义用例和 blocked UX；CI 执行 `test-deterministic` 的 Contract/Unit/Service/Fake 集；controlled integration 执行受控 adapter、entry、worker、Job 和 degraded/failure 映射；operations replay 执行既有 safe snapshot/receipt/report 的重放边界；staging/product-like 只属于未来 P1/P2，不是当前 P0 退出条件。 |
| 每个环境依赖哪些服务？ | P0 只需逻辑 stores、repository/UoW fake、controlled semantic ports、deterministic clock/id/digest、redaction scanner、call/write spies 和 header/replay fixtures；真实 sibling 服务、durable 产品、bus、secret provider、GRC 和平台分配不作为当前必需服务。 |
| 哪些配置影响结果？ | `runtime` profile/schema、`stores` logical refs、`bindings` closed slots、`limits` bounds/horizons、`observability` redaction/diagnostic refs、`determinism` clock/id/digest/fixture refs、`features` peripheral request flags。任何配置失败都必须在 builder/entry/Job 对应边界显式体现。 |
| 哪些依赖使用 fake/controlled？ | Artifact/Governance authority、material source/verifier、Sandbox/Runtime、platform resource、Observability/Archive 和 event Consumer 在 P0 使用 semantic fake、controlled failure 或 disabled/blocked；不使用真实正文或私有实现。 |
| 环境不可用如何处理？ | `test-deterministic` 核心装配缺失则 fail-fast；预期的 controlled dependency failure才作为该负向用例的输入；意外环境故障使套件 `not_run/blocked`，不得改写为测试通过。真实正向上游环境不存在时保留 `planned/blocked`。 |
| 哪些依赖可用 path dependency？ | 只有正式 authority 允许的 `L0-core` 共享契约和 `L0-sdk` 官方访问封装才是 compile candidate；当前 exact package/version/surface 未核验，不能写具体 path。所有其他项目按 runtime、event 或 ref/fixture 协作。 |

## 4. 正式 profile 与环境角色

### 4.1 Profile 总表

| 正式 profile | 目标用途 | 可用替身 | 必须保持 blocked/pending | 不能证明 |
|---|---|---|---|---|
| `local-safe` | 本地 schema、entry、页面/安全摘要和单用例手动复现 | local logical store、semantic fake、controlled negative adapter | Artifact/Governance/Sandbox/Runtime/Observability/Archive 正向以及 durable readiness | 完整下载、真实启动/清理、跨仓 integration、release evidence |
| `test-deterministic` | CI Contract/Unit/Service/Fake integration、状态/UoW/幂等/安全扫描 | 显式 fixture registry、fixed clock/id/digest、fake stores/ports、write spies | 真实 owner outcome、Consumer positive apply、durable crash parity、生产性能/SLO | 真实产品可运行性、跨平台或 release readiness |
| `integration-pending` | 未来逐 slot controlled/real-like seam 验证 | 已获 authority 的 controlled adapter；未闭合 slot 返回 blocked/unsupported | `RUN-UP-001~008` 未闭合的正向 path、真实 transport/lease/平台 allocation | 上游合同、生产 SLA、正式验收 verdict |
| `product-pending` | 未来候选产品/端侧预演 | 只能使用 approved public SDK/API、durable local capability 和正式 platform seam | 当前没有 approved artifact/provider/environment；不得使用 fake fallback | 当前生产 readiness、签署、正式 evidence |

所有 profile 共同遵守：explicit immutable selection、authority/integrity fail-closed、`Accepted != Running`、`Complete != Verified != Qualified`、`Confirmed != Cleaned`、Query no-write、Unknown/no-replay、mandatory redaction、SDK/public adapter only、local record != evidence。

### 4.2 环境角色矩阵

| 环境 ID | 绑定 profile | 目的 | 主要层级 | 当前成熟度 | 数据/清理 |
|---|---|---|---|---|---|
| `ENV-RUN-LOCAL-SAFE` | `local-safe` | 单一 TC 复现、边界演示、blocked UX 和人工诊断 | Contract/Unit/Entry | planned；实现仓不存在 | 一个 `test_run_ref`，结束时丢弃 run namespace |
| `ENV-RUN-CI-DETERMINISTIC` | `test-deterministic` | 可重复 P0 Contract/Unit/Service/Fake 集和静态 no-write/redaction 扫描 | Contract/Unit/Service/Fake integration | planned；不得伪造 CI 运行 | 每次 run 隔离；reset fake、write spy、fault journal |
| `ENV-RUN-INTEGRATION-CONTROLLED` | `integration-pending` | 受控 adapter、entry/worker/Job 和 unavailable/degraded 映射 | Controlled integration/API/Worker/Job | planned；真实上游 blocked | controlled ref 与 failure profile 显式，run-scoped 清理 |
| `ENV-RUN-OPERATIONS-REPLAY` | `integration-pending` | safe receipt/report/projection/recovery 的只读重放和生成代价验证 | Job/Service/Recovery | planned；replay source 未存在 | 只使用脱敏 refs/snapshots；不保存 raw payload |
| `ENV-RUN-PRODUCT-REHEARSAL` | `product-pending` | 未来候选产品跨平台/跨仓 selected run | P1/P2 E2E/Release | blocked；无 approved environment | 未来由 owner 定义 run-scoped cleanup；当前不执行 |

`ENV-RUN-PRODUCT-REHEARSAL` 不可用时不影响语义 P0；但不得把 P0 fake 结果升级为 product/release 证据。

## 5. 环境拓扑与依赖类型

#### 环境拓扑图: L5-runner 测试依赖边界

```text
                         [compile candidate]
                 +-----------------------------+
                 | L0-core / L0-sdk (pending) |
                 +--------------+--------------+
                                |
                                v
 [local / CI test harness] -> [Runner contracts + domain + application]
              | [runtime]                 | [runtime]
              v                           v
 [logical stores / UoW / spies]    [semantic ports + builder]
              | [runtime]                 |
              +-------------+-------------+
                            v
                 [entry / worker / operations]
                            |
             +--------------+---------------+
             | [runtime]                    | [event]
             v                              v
 [controlled owner adapters]       [header/replay fixtures]
             |
             +--> Artifact / Governance / Sandbox / Runtime /
                  Observability / Archive / Platform (blocked refs only)
```

关键说明：

- 图中的 compile candidate 只表示依赖类别和待核验 seam，不表示 package、path、version 或仓库已存在。
- `[runtime]` 和 `[event]` 依赖只能通过正式 SDK/API/semantic adapter、safe ref/view 或 header-first fixture；不得导入 sibling 源码或内部存储。
- 当前没有 Runner-owned outbound event；event fixtures 只用于 planned Consumer 的 header-first negative path 和未来 replay 形状。

### 5.1 依赖类型与协作方式

| 依赖/边界 | 类型 | P0 协作方式 | 当前正向状态 | 禁止行为 |
|---|---|---|---|---|
| `L0-core` | compile candidate | shared typed ref/error/trace/metadata contract fixture | exact path/version pending `RUN-UP-008` | 创建 shadow type 或复制源码 |
| `L0-sdk` | compile + runtime candidate | SDK-first semantic adapter contract、error/redaction/trace fixture | exact client/surface pending `RUN-UP-008` | 猜 method/version 或绕过 SDK |
| `L1-artifact` | runtime | release/locator/integrity semantic fake；blocked/unknown vectors | positive blocked `RUN-UP-001` | 复制 Release/Artifact truth、直接读内部表 |
| `L1-governance` | runtime | authority/approval/baseline safe posture fixture | positive blocked `RUN-UP-002` | Runner 本地批准或改 decision |
| `L1-work`/`L1-workspace` | runtime/ref | context/scope/visibility safe ref/view fixture | exact Runner seam pending | 复制 project/work truth |
| `L2-runtime` | runtime | safe status/result read fake、stale/unknown vectors | positive blocked `RUN-UP-004` | 用 PID/端口/log 推导 Running/outcome |
| `L4-sandbox` | runtime | Sandbox request/control/cleanup semantic adapter fake | positive blocked `RUN-UP-003/007` | 编译/复用 Docker/gVisor/Firecracker/private backend |
| `L4-observability` | runtime/ref | redacted diagnosis/handoff marker and blocked sink | positive blocked `RUN-UP-005` | 本地日志升级 evidence/audit |
| `L4-archive` | runtime/ref | peripheral archive reference safe fixture | positive blocked `RUN-UP-006` | Archive 参与 run/cleanup success |
| platform resource | runtime | bounded observation/conflict/unknown fake | taxonomy blocked `RUN-UP-007` | 固定 OS 命令、端口/PID/path 或抢占事实 |
| event backbone / planned Consumers | event | header-only envelope、strict stored receipt、unsupported/missing vectors | positive apply blocked | 直接 topic/group、解析未授权 payload、ACK success |
| local stores/cache | runtime/internal | repository/UoW/cache controlled fake；fault profiles | durable parity blocked `RUN-DDD-003` | in-memory fallback冒充 product durable |

## 6. 配置域与环境矩阵

### 6.1 七个配置域的测试承接

| 配置域 | `local-safe` | `test-deterministic` | `integration-pending` | `product-pending` | 失败处理 |
|---|---|---|---|---|---|
| `runtime` | 显式 schema/profile/config identity | 显式 test profile + fixture identity | immutable controlled document | approved document identity pending | 缺失/未知/不匹配 fail-fast |
| `stores` | logical refs；能力不足 blocked | isolated fake state/projection/result/operation/cache refs | controlled/durable-like refs逐 slot | formal durable refs required | core guarantee 不足则 builder 非 Ready |
| `bindings` | external slots 可 disabled/blocked | explicit semantic fake refs | controlled refs；未闭合 slot blocked | formal public refs only | duplicate/unknown slot reject；configured≠ready |
| `limits` | only safe bounded candidate，不填 production 数值 | deterministic positive values受 static cap | workload authority pending | formal authority required | zero/overflow/越界/未知值 fail-fast 或当前 Job reject |
| `observability` | mandatory redaction，diagnostic 可 blocked | redaction fake + forbidden scan | controlled safe sink pending | formal provider/handoff pending | redaction 缺失/失败 no visible content/handoff |
| `determinism` | non-test provider pending | fixed clock/id/digest/fixture refs | controlled providers | formal providers | 缺 provider 前 mutation blocked，test fixture缺失 fail-fast |
| `features` | optional flags default false | 可测 request/reject/disabled | prerequisite 完整后才 request | formal review/prerequisite | flag 不创建 Consumer/event/owner mutation |

### 6.2 关键配置项测试矩阵

| 配置面 | 正向候选 | 负向/边界候选 | 主环境 | 结果边界 |
|---|---|---|---|---|
| strict source/schema/profile | 一份完整七域 JSON，显式 `runtime.schemaVersion`/`runtime.profile` | missing/unknown/duplicate key、comment/trailing、错误类型、profile mismatch | CI deterministic | invalid 全文档 reject；不回退旧/default |
| store/cache refs | 五类 logical ref 和 capability marker | 缺 state/result/operation/cache guarantee、corrupt/unknown | CI/integration | builder failed/blocked；不暴露半 facade |
| adapter slot set | closed `bindings.adapterBindings`、unique slot/ref | unknown/duplicate/empty ref、profile/family conflict | CI/integration | document reject 或 per-slot blocked |
| limits | positive finite bounds、run-local narrowing | zero/overflow/static cap、扩大超过 authority、unknown production value | CI/integration | reject/Blocked；不继承历史数字 |
| redaction/diagnostic | required redaction refs，optional feature=false | missing/unsupported redaction、feature=true但 ref/prerequisite 缺失 | CI/integration | no visible content；handoff blocked |
| determinism | fixed test clock/id/digest/fixture | fixture in non-test profile、provider unavailable/unstable | CI deterministic | test fail-fast 或 mutation blocked |
| feature requests | false/disabled safe posture | request archive/diagnostic/handoff without contract | local/CI/integration | Disabled/Blocked；不改变 core success |
| change/rollback/drift | new validated immutable snapshot/new builder | hot reload、leaf override、digest drift、`latest`/LKG fallback | operations replay | old snapshot unchanged；new assembly reject |

## 7. Entry、Worker、Job 环境分配

| 入口族 | `local-safe` | `test-deterministic` | `integration-pending` | 当前禁止 |
|---|---|---|---|---|
| Command/Query entry | 手动单入口、schema/actor/no-write | all finite variants + write spies | controlled boundary/transport-neutral adapter | entry 直连 store/SDK/OS |
| planned Consumer worker | 只注册/blocked-first marker | header-first missing/unsupported/duplicate vectors | future controlled envelope only | payload parse/hash/store/ACK、直接 bus topic |
| Operations Job | explicit single Job with fake claim/checkpoint | all five Job variants、fault profiles、stored report replay | controlled source/read seam | Query 隐式触发、owner truth repair、auto reclaim |

Consumer positive `Running/Accepted/GapDetected/Delayed` shape remains reserved; environment never activates it without upstream contract/readiness.

## 8. 环境不可用与配置失败处理

| 情况 | 分类 | 必须处理 | 是否可计入通过 |
|---|---|---|---|
| 实现仓/测试 runner 不存在 (`RUN-DDD-001/002`) | implementation prerequisite | 不执行；保持 planned/blocked | 否 |
| exact L0-core/L0-sdk surface 未核验 | compile prerequisite | 不复制替代；compile-dependent suite blocked | 否 |
| `test-deterministic` profile/fixture/clock/id/digest 缺失 | test assembly failure | fail-fast；不改成 local-safe 或默认值 | 否 |
| local store/UoW capability 不足 | core readiness failure | builder `Failed/Blocked`，不暴露 facade | 否；仅专门负向用例可在实际执行后记录 |
| 预期 controlled adapter unavailable/unsupported | planned negative input | 断言 `Blocked/Unsupported/Unknown`、零危险副作用 | 仅该负向用例可计入 |
| 非预期 adapter/fixture/harness 崩溃 | environment failure | 套件 `not_run/blocked`，保留原因，不重分类 | 否 |
| planned Consumer payload seam 未授权 | upstream contract blocker | header-first `Blocked/Unsupported`；不 parse/hash/ACK | 仅 negative path 可计入 |
| `integration-pending` 外部服务/平台资源不存在 | selected integration unavailable | 标记未执行/blocked；不 fake fallback | 否 |
| `product-pending` artifact/provider/环境不存在 | product/release blocker | 不启动 selected run，不产生 release evidence | 否 |
| redaction sink/required policy 缺失 | security failure | no visible content/handoff；不 raw fallback | 仅安全负向执行后可计入 |
| observer telemetry sink 意外不可用 | environment fault | 若非脚本化 fault vector，套件无效；不得改业务结果 | 否 |

## 9. 环境到数据集分配

| 环境 | 主要数据集族 | 覆盖切口 | 隔离/清理 |
|---|---|---|---|
| `ENV-RUN-LOCAL-SAFE` | BASE、ACTOR、SELECT、PROTOCOL、PRESENTATION | 01、08、10、13、16 | 单 case `test_run_ref`；手动 teardown 只作调试，不作正式 evidence |
| `ENV-RUN-CI-DETERMINISTIC` | 全部 `DS-RUN-*` 的本地语义子集、IDEMP、UOW、PROJECTION、OBS | 18/18 P0 切口的 Contract/Unit/Service/Fake | run namespace drop、fake/journal reset、canary erase |
| `ENV-RUN-INTEGRATION-CONTROLLED` | MATERIAL、RUN、CONTROL、RESOURCE、RECOVERY、CONSUMER、JOB、CONFIG | 02～07、14～16、部分 18 | controlled adapter refs、fault case、claim/report drain 后清理 |
| `ENV-RUN-OPERATIONS-REPLAY` | IDEMP、UOW、PROJECTION、CONSUMER receipt、JOB report、OBS | 07、09、11、12、14、15、17 | 只读脱敏 snapshot/replay；不改 owner cursor，不持久化 raw payload |
| `ENV-RUN-PRODUCT-REHEARSAL` | 未来选定 subset；不得使用当前 fake evidence | P1/P2 only | 由未来运维 authority 定义清理；当前不存在 |

## 10. Step 8 停审与跨环境审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 四个正式 profile 是否完整且无新增值 | 通过 | 只使用 `local-safe`、`test-deterministic`、`integration-pending`、`product-pending`。 |
| local/CI/controlled/replay 环境是否可定位 | 通过（设计层） | 有环境 ID、职责、profile、数据和不可用处理；实际环境未创建。 |
| compile/runtime/event 依赖是否区分 | 通过 | L0-core/L0-sdk 为待核验 compile candidate；其余按 runtime/event/ref 协作。 |
| 非 core sibling 是否误写为 path dependency | 无 | 不允许相邻仓源码、内部表、私有 backend 或 bus topic。 |
| P0 是否依赖真实产品服务 | 无 | semantic fake/controlled 足以设计 P0；真实正向保持 blocked。 |
| 环境不可用是否可能伪造 pass | 无 | 非预期故障标 `not_run/blocked`；只有脚本化负向 fault 可成为该 case 断言。 |
| 配置 key/profile/readiness 是否越界 | 无 | 直接承接 04 七域与四 profile；不新增配置 truth。 |
| 所有 P0 数据集是否有环境归属 | 通过 | 18 切口和 Step 7 数据集均有分配。 |
| 真实执行、artifact、report、evidence、readiness | 未发生 | 不作为本 Step 的完成条件。 |

## 11. 结构化回填草稿

正式 §8 应收录：四个 profile 与环境角色矩阵、依赖拓扑图（连线标注 `[compile]`/`[runtime]`/`[event]`）、依赖协作表、七域配置矩阵、Command/Query/Consumer/Job 入口矩阵、不可用处理和数据集分配。正文应明确这些是计划环境合同，不表示 CI、staging、产品或 release 已就绪。

## 12. 待确认与持续 blocker

| 项 | 影响 | 当前处理 |
|---|---|---|
| 实现仓、语言、测试 runner、store/cache/backend (`RUN-DDD-001~003`) | 无法固定命令、路径、durable parity、跨重启环境 | 逻辑环境与配置合同保持 planned/blocked。 |
| L0-sdk exact package/client/error/redaction/trace (`RUN-UP-008`) | compile/runtime seam 不能声明 ready | 只保留 candidate 和 semantic adapter。 |
| Artifact/Governance/Sandbox/Runtime/Observability/Archive/平台 (`RUN-UP-001~007`) | integration-pending/product-pending 正向环境无法执行 | controlled/negative/unknown 设计继续；不造 owner success。 |
| telemetry/SLO、真实跨仓 integration/GRC (`RUN-OPS-001~002`) | 不定义生产阈值或 release environment | Step 10/13 标为 planned/blocked。 |

## 13. Step 8 进入下一步门禁

- [x] 四个正式 profile 的测试含义和限制明确。
- [x] local、CI、controlled integration、operations replay 和 future product 环境有职责、数据和成熟度。
- [x] compile/runtime/event 依赖类型和协作方式明确；没有 sibling 私有依赖。
- [x] 七个配置域、entry/worker/job 和 failure/readiness 影响均有矩阵。
- [x] 环境不可用处理区分预期负向输入与非预期基础设施故障。
- [x] 18 个 P0 切口和 Step 7 数据集均有环境归属。
- [ ] 环境、配置、fixture、CI、artifact、report、测试执行和 readiness：未创建/未执行，不作为本 Step 条件。

Step 8 完成，允许进入 Step 9；正式 `05-测试方案.md` 仍不可写。
