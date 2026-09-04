# Step 4. 抽取实施对象与交付物

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 4
> 本步状态：`completed / pass_with_upstream_blockers`
> 回填目标：正式 `07-实施计划.md` §4

## Step 状态

| 项 | 结论 |
|---|---|
| gate_status | completed / pass_with_upstream_blockers |
| current_module | objects_deliverables |
| next_allowed_action | Step 5 phases |
| implementation_allowed | false |

## 本步输入

- 正式 `03-详细设计.md` §4~§7、§15~§16。
- 正式 `05-测试方案.md` §3、§9、§13。
- 正式 `06-验收标准.md` §2、§5~§10。
- Step 2 的 P0 / P1 / P2 范围和 Step 3 的目标仓、脚本、台账约束。

## SOP 问题回答

实施对象按可验证功能增量组织，不把 29 个对象直接当 29 个独立任务。代码主轴是 7 个 workspace 模块；协议分母是 10 Command、6 Query、5 Consumer、1 material helper、7 Job。交付面同时包括 contracts/domain/application/infra/api/worker/jobs、P0 config、fake seam、gate/report/check 脚本、测试 fixture、future artifact/report 结构和文档交接。真实数据库、broker、容器平台、镜像 registry、观测 backend 和 sibling 实现不属于本轮设计期交付。

## 当前文档问题诊断

若按对象或文件平铺，无法表达先后依赖、可验证纵切和回退边界；若只列代码，又会漏掉脚本、证据和台账。需要将交付物分为 code、protocol、runtime seam、test、script、evidence、handoff 七类，并显式列出非交付物。

## 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 对象清单与实施对象混淆 | 以模块 / 能力 / 交付面分组 |
| 测试、证据、脚本缺少 owner | 固定到 `05/06` 入口和 PH-08 |
| sibling 产品可能被默认交付 | 明确 seam / fake / pending，不交付产品 truth |

## 设计取舍

- 保留 29 对象作为设计分母，但将实现顺序交给八个功能 phase。
- 将 `HostFactMaterialEventCandidate` 作为 material seam 交付，不创建伪造 outbound event family。
- 将 evidence/report 视为交付面而非当前事实；只有未来真实 run 才能产出实例。

## 结构化中间产物

### 模块与对象归属

| 模块 | planned 交付 | 主要 owner | 不交付 |
|---|---|---|---|
| `contracts` | refs、metadata、Command/Query/Consumer/Job DTO、views、receipt、errors、redaction | public carrier | 外部正文、产品 client |
| `domain` | 29 对象、状态轴、policy、guard、transition | Host Truth | I/O、配置、外部调用 |
| `application` | facade、use-case、Port、UoW、幂等、mapper、stored result | 编排 | infra 实现、Job 授权 |
| `infra` | logical store、adapter、config、builder、fake | 物理承接 | 改写 domain 规则 |
| `api` | command/query 入口与 safe outcome mapping | 入口 | repository / raw config |
| `worker` | consumer、publisher、projection trigger | 事件 worker | lifecycle decision |
| `jobs` | 7 job entry、selector、report | 维护执行 | 新 intent/decision/generation |

### 业务对象分组（固定 29）

| CMP | 对象族 | 实施阶段 |
|---|---|---|
| `CMP-MS-01` | `HostIntent`、`HostOrchestrationDecision`、`HostControlPolicy` | PH-02 |
| `CMP-MS-02` | `HostQualificationContext`、`RequiredQualificationPolicy`、`HostAssembly`、`HostReadinessDecision` | PH-02~03 |
| `CMP-MS-03` | `MemberExecutionHost`、`HostActionAttempt`、`HostExternalAssociation`、`HostGenerationFence` | PH-03 |
| `CMP-MS-04` | `HostRegistration`、`HostEndpoint`、`HostSession`、`RegistrationSessionPolicy` | PH-03 |
| `CMP-MS-05` | `HealthSignalSnapshot`、`HostHealthAssessment`、`HostFailureClassification`、`HostRecoveryDecision` | PH-04 |
| `CMP-MS-06` | `HostClosure`、`CleanupAttempt`、`ResidualFinding`、`ReconciliationCase` | PH-05 |
| `CMP-MS-07` | `HostFactMaterial`、`HostHandoffRecord`、`SafeHostView`、`HostProjectionState`、`HostOutboxRecord`、`HostHistoryEntry` | PH-06~07 |

唯一 outbound material helper 为 `HostFactMaterialEventCandidate`，不计入 29 个业务对象，进入 PH-06~07 的 material/outbox seam。

### 交付物清单

| 交付面 | 交付物 | 完成判定（future） |
|---|---|---|
| code | 7 workspace modules | workspace / dependency check 可审计 |
| protocol | 10/6/5/1/7 契约与 fixtures | 每项有 accepted + negative/replay cut |
| persistence | logical truth、history、material、outbox、projection、stored result | UoW / revision / key fence 可验证 |
| runtime seam | config profile、builder、fake/controlled/disabled adapters | 不可用时显式 blocked/unknown |
| scripts | `scripts/gates`、`scripts/reports`、`scripts/checks`、可选 `scripts/dev` | 支持固定 run 参数并 fail-closed |
| tests | 05 定义的 P0 suites、fixtures、replay corpus | artifact/report 可配对 |
| evidence | raw artifact、run report、acceptance handoff 结构 | 只能从真实 run 生成 |
| docs | implementation ledger、24 boundary ledger、交接记录 | planned 状态完整且可恢复 |

### 非交付物

| 项目 | owner / 处理 |
|---|---|
| Runtime loop、run/turn/checkpoint、tool execution | `L2-runtime` / `L2-tools`；只留 ref/seam |
| Member 主体、Images 内容/构建/签名、Sandbox backend/policy | 兄弟 owner；正向合同 pending |
| Governance approval、Identity/Work truth、Observability backend | 上游 owner；只消费 safe summary/ref |
| 真实 DB/broker/DLQ/容器平台/registry 产品绑定 | infra / provider；P1/P2 或 selected-run |
| 真实 commit、run、artifact、report、verdict、signoff、readiness | 实施/验收阶段；本轮不生成 |

## 回填草稿

正式 §4 应按七个实现模块与七个交付面组织，并列出 29 对象与 10/6/5/1/7 协议分母；非交付物必须包含相邻领域 truth、真实产品和当前不存在的执行证据。

## 待确认事项

- 目标实现仓中 crate/package/binary 的最终实际创建结果。
- Core shared contract 的具体 crate 名与版本基线。
- 真实 durable store / publisher / observability 产品是否进入后续 selected-run。

## 进入下一步条件

实施对象和交付物均有 owner、来源和 future 完成判定，允许进入 Step 5 阶段与依赖顺序。
