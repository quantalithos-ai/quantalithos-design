# L4-observability 07-实施计划 Step 05：实施阶段与依赖顺序

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 5
> 对应书写规范：`standards/document/实施计划书写规范.md` §5.5
> 文档性质：设计讨论中间产物。本文定义 phase 依赖和可验证增量，不替代详细设计的 flow/state/schema，也不生成实现事实。

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| project | `L4-observability` |
| document | `07-实施计划` |
| step | `Step 05 / 实施阶段与依赖顺序` |
| mode | `full-restart` |
| status | `completed_current_step_05` |
| current module | `phase-order-and-cross-phase-closure` |
| upstream | current Step 01~04；current formal `03/04/05/06` |
| phase model | 8 个 phase、16 个 planned boundary 候选 |
| design gate | `pass_with_affected_open` |
| implementation handoff | `blocked_until_current_07_completion_and_boundary_audit` |
| new upstream blocker | `none` |
| inherited affected | 12 项绑定到后续 phase/boundary，未关闭 |
| next allowed action | `continue_to_step_06` |
| current commit | 不需要；用户未要求提交 |

## 2. Step 内计划与执行记录

| 计划项 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 读取 Step 04 交付面和 current 依赖/流程 | 输入基线 | done | 七 crate、五协议族、状态/测试/配置资产可映射 |
| 识别最小可验证纵切 | 纵切选择 | done | 先 contracts/domain，再按 observation flow 扩展 |
| 定义 8 个 phase 与依赖图 | phase matrix | done | 每 phase 有功能增量、输入、输出、排除项和门禁 |
| 逐 phase 停审 | phase review register | done | 无 phase 依赖后续能力才能成立 |
| 跨 phase 审计 | closure audit | done | 协议、状态、affected、测试和验收无孤儿/越界 |
| 回填草稿与自检 | §5 草稿 | done | 可进入 Step 06 boundary 拆分 |

## 3. SOP 问题回答

### 3.1 最小可验证纵切

最小纵切不是单个 crate，也不是单个函数，而是“typed public contract -> observation-owned domain state -> application boundary -> controlled/fake persistence -> exact test assertion”的最小闭环。该纵切首先覆盖安全观测准入，再逐步接入审计/evidence、signal/read、handoff/maintenance 和 runtime wiring。

### 3.2 为什么不是按七个 crate 依次完成

按 crate 完成会在每个 crate 留下无法执行的横向半成品：contracts 没有 state/flow 验证、domain 没有 UoW、entry 没有真实 surface、worker/jobs 没有 completion 语义。当前 phase 采用功能增量组织，crate 只是每个 phase 内的编写顺序和 owner 边界。

### 3.3 阶段依赖图

#### 阶段依赖图: L4-observability 实施阶段顺序

```text
[PH-01 仓初始化与验证骨架]
  | enables
  v
[PH-02 contracts/domain carrier closure]
  | enables
  v
[PH-03 intake/redaction/correlation accepted flow]
  | enables
  v
[PH-04 audit/evidence/hash/gap projection]
  | enables
  v
[PH-05 signal projection and strict read surface]
  | enables
  v
[PH-06 handoff/retention/rebuild/job maintenance]
  | enables
  v
[PH-07 runtime/entry/worker/jobs activation]
  | enables
  v
[PH-08 release gate/report/acceptance handoff shell]
```

关键说明：

- 图表达 phase 之间的实施依赖，不表达单个函数调用链或 runtime 拓扑。
- PH-01 的“验证骨架”不等于目标仓已存在；目标仓缺失时 phase 状态为 blocker。
- PH-03~PH-06 的 controlled/blocked 分支是正式交付面，不得为了获得正向样例关闭 inherited affected。
- PH-08 只能生成真实执行所需的报告/交接壳和 gate 入口，不能生成静态 passed、evidence alias 或 signoff。

## 4. 阶段总表

| 阶段 | 阶段名称 | 可验证功能增量 | 依赖阶段 | 核心交付物 | 主要门禁 |
|---|---|---|---|---|---|
| `PH-01` | 仓初始化与验证骨架 | 目标仓、workspace、only-core dependency、strict profile/config 和 run/report 路径具备可核验骨架 | none | workspace manifest、7 crate skeleton、config shell、scripts/report roots | `G-01` target/workspace reality、dependency scan、config parse、path checks |
| `PH-02` | Contracts/domain carrier closure | public refs/DTO/error 与 27+1 state/domain policy 形成可构造、可拒绝的 observation-side carrier | PH-01 | contracts/domain modules、state/policy tests、fixture constructors | `G-02` contract/domain suite、owner/static scan、body-free checks |
| `PH-03` | Intake/redaction/correlation accepted flow | safe input 经 validation/redaction 形成 receipt/disposition/correlation/safe signal 的 accepted、duplicate、reject、quarantine、delayed surface | PH-02 | C01~C04、I01~I03 相关 service/entry/fake、UoW/idempotency | `G-03` intake/correlation/redaction/UoW tests、AC-OBS-001、VF redlines |
| `PH-04` | Audit/evidence/hash/gap projection | audit projection、body-free evidence linkage、hash/cursor、visibility/gap 形成 append/read 关系 | PH-02、PH-03 | C05/C06/C13/C14、Q05/Q06、E04/E05/E08/E09 相关对象和服务 | `G-04` audit/evidence/query tests、body-free/redaction/no-write checks、AC-OBS-002 |
| `PH-05` | Signal projection and strict read surface | safe log/metric/trace projection、rollup、diagnostic/read model 和 14 Query strict zero-write surface | PH-03、PH-04 | C04、Q01~Q05/Q07~Q14、E03/E10/E11/E12、projection stores | `G-05` query no-write、freshness/visibility/degraded、AC-OBS-003/004 |
| `PH-06` | Handoff/retention/rebuild/job maintenance | immutable report handoff/evidence-index input、retention/protection、bounded replay/rebuild、job report/fence/no-write | PH-04、PH-05 | C07~C12/C15~C16、J01~J09、E06/E07/E11/E12 | `G-06` job/UoW/recovery/retention/no-write tests、AC-OBS-004/005；J06 controlled |
| `PH-07` | Runtime/entry/worker/jobs activation | strict config assembly把已闭合 façade 以 least-authority 分配到 API/worker/jobs，并保留 fake/controlled/disabled availability | PH-01~PH-06 | runtime builder、API/worker/jobs wiring、catalog/registrar、adapter parity | `G-07` config/runtime/entry/dependency/redaction checks；无 partial activation |
| `PH-08` | Release gate/report/acceptance handoff shell | 以 same-run raw artifact 生成 run report、candidate linkage、acceptance handoff/VETO/risk/open-issues 输入 | PH-01、PH-05~PH-07 | 5 scripts/checks、9 suites 的 gate wiring、report shell、handoff skeleton | `G-08` release/report provenance/static redline；不产生真实结论 |

## 5. 各 phase 可验证增量说明

### 5.1 PH-01 仓初始化与验证骨架

| 项 | 内容 |
|---|---|
| 功能增量 | 能检查目标仓是否存在，创建或确认七 role crate 的 manifest 形状，并验证唯一 sibling compile dependency 候选 |
| 输入 | current `03` §3~§4、`04` §3~§6、`05` §8~§9、Step 03 阅读矩阵 |
| 输出 | workspace/Cargo skeleton、typed config shell、scripts/artifact/report planned roots、reality record |
| 不包含 | 业务对象、service flow、生产 adapter、真实测试结果、任何 source truth |
| 验证方式 | target repo/worktree check、Cargo metadata、dependency static check、strict config parse、script help/dry-run |
| 停审 | 目标仓缺失或 core package/type 不匹配时停在 PH-01；不得进入 PH-02 |

### 5.2 PH-02 Contracts/domain carrier closure

| 项 | 内容 |
|---|---|
| 功能增量 | public typed carrier 和 observation domain state 可构造，并能拒绝 forbidden body、非法 variant、缺失 ref/digest |
| 输入 | PH-01 naming/dependency；`03` §5~§7、§9、§11、§14 |
| 输出 | contracts/domain modules、finite vocabulary、state/policy/error tests、fixture constructors |
| 不包含 | application UoW、external adapter、API route、worker ack、Job execution |
| 验证方式 | contract/domain suite、owner/use static scan、body-free serialization/redaction checks |
| 停审 | 任何二级 public type 无唯一 owner、state factory 不可构造或 ref identity 不闭合时回写 `03` |

### 5.3 PH-03 Intake/redaction/correlation accepted flow

| 项 | 内容 |
|---|---|
| 功能增量 | safe observation material 经过入口验证、redaction、receipt/disposition、correlation 和 safe signal 最小 accepted flow |
| 输入 | PH-02 carriers；`03` §7~§8、§11~§14；`04` safety config |
| 输出 | C01~C04、I01~I03 的 application orchestration、fake ports、API/worker slice、idempotency/UoW tests |
| 不包含 | audit/evidence final linkage、external handoff、retention cleanup、source truth write |
| 验证方式 | `TC-OBS-ING-*`、`TC-OBS-COR-*`、`TC-OBS-RED-*`、`TC-OBS-UOW-*` 适用切口和 `AC-OBS-001` |
| 停审 | raw/secret 穿透、accepted set/order 不闭合、duplicate 二写或 I05 positive 被误启用时阻塞 |

### 5.4 PH-04 Audit/evidence/hash/gap projection

| 项 | 内容 |
|---|---|
| 功能增量 | 从已有 safe ref/context 形成 audit projection、body-free evidence linkage、hash/cursor、visibility/gap 的可查询关系 |
| 输入 | PH-02 carriers、PH-03 receipt/correlation；`03` §7~§11、§14 |
| 输出 | audit/evidence/gap objects、append-only record、Q05/Q06 read surface、E04/E05/E08/E09 snapshot |
| 不包含 | 外部证据正文、业务审计 truth、final authenticity verdict、cleanup、source repair |
| 验证方式 | `TC-OBS-AUD-*`、`TC-OBS-EVD-*`、`TC-OBS-NW-*`、body-free/provenance checks、`AC-OBS-002` |
| 停审 | owner/digest/purpose/visibility source 不唯一、hash/cursor 伪造、Q05/Q06 写入或 affected positive 被假装完成 |

### 5.5 PH-05 Signal projection and strict read surface

| 项 | 内容 |
|---|---|
| 功能增量 | safe log/metric/trace/signal rollup 和 diagnostic/read-model 形成一致 read surface；14 Query 在所有 miss/stale/blocked 分支保持 zero-write |
| 输入 | PH-03 safe signal、PH-04 audit/gap/evidence；`03` §7~§10、§14；`04` read profile |
| 输出 | signal/projection stores、Q01~Q14 read carriers/assemblers、E03/E10/E11/E12 derived snapshots |
| 不包含 | Query refresh/rebuild、raw telemetry、业务 truth、dashboard/alert product behavior |
| 验证方式 | `TC-OBS-SIG-*`、`TC-OBS-QRY-*`、`TC-OBS-DIA-*`、`TC-OBS-NW-001`、`AC-OBS-003/004` |
| 停审 | read carrier 不能同一 committed boundary、Fresh 无 proof、visibility 从 row existence 推导或 Query 有写路径时阻塞 |

### 5.6 PH-06 Handoff/retention/rebuild/job maintenance

| 项 | 内容 |
|---|---|
| 功能增量 | report handoff/evidence-index input、retention/protection、bounded derived rebuild/replay 和 9 Job 的 immutable plan/fence/report surface 闭合 |
| 输入 | PH-04 linkage/gap、PH-05 read/projection；`03` §8~§13、`04` §9~§11 |
| 输出 | C07~C16、J01~J09、handoff/retention/protection/rebuild/report stores、controlled external phase |
| 不包含 | H13 positive execution、source truth repair/delete、real external acceptance、final verdict/signoff |
| 验证方式 | `TC-OBS-RPT-*`、`TC-OBS-RET-*`、`TC-OBS-REB-*`、`TC-OBS-UOW-*`、`AC-OBS-004/005` |
| 停审 | report ref/secondary type/recovery class/UoW/external phase 未闭合，或 J06/retention 产生 source write 时阻塞 |

### 5.7 PH-07 Runtime/entry/worker/jobs activation

| 项 | 内容 |
|---|---|
| 功能增量 | 通过 complete-or-error runtime builder 和 least-authority assignment 激活已有 contracts/services/ports，形成 API、worker、jobs 可运行入口 |
| 输入 | PH-01 config、PH-02~PH-06 已闭合 slice；`03` §13、`04` §9~§11 |
| 输出 | runtime builder、profile-local registrars、API/worker/jobs wiring、fake/durable/controlled/disabled parity |
| 不包含 | 生产 topology、implicit fallback、cross-crate reverse dependency、source truth owner |
| 验证方式 | config/runtime/entry suites、dependency/redaction/availability checks、`AC-OBS-006~031` 中接口/配置相关门禁 |
| 停审 | partial activation、unknown catalog fallback、entry 取得 naked context/port、non-core path dependency 或 profile 混用时阻塞 |

### 5.8 PH-08 Release gate/report/acceptance handoff shell

| 项 | 内容 |
|---|---|
| 功能增量 | 在真实 invocation 时可从同一 raw artifact root 生成 run report、candidate linkage 和 acceptance/review 输入，并保留 blocked/failed/not_run |
| 输入 | PH-07 executable target、`05` §8~§14、`06` §3~§4、§11~§14 |
| 输出 | gate/report/check scripts、9 suite wiring、run report/handoff/veto/risk/open-issues skeleton |
| 不包含 | 当前真实 run、正式 evidence alias、通过/有条件通过/不通过裁决、signoff |
| 验证方式 | report-generation/provenance/static redline dry-run；真实 lane 建立后才可执行 release smoke |
| 停审 | 使用 `latest`、跨 run join、静态 passed/evidence、缺 raw artifact 仍生成 report 时阻塞 |

## 6. Phase 停审记录

| Phase | 可验证增量 | 后续 phase 越界检查 | 门禁可执行性 | 结论 |
|---|---|---|---|---|
| PH-01 | workspace/config/report 骨架 | 未引入业务对象或 service | 设计期可检查；目标仓缺失保持 blocker | pass_with_readiness_blocker |
| PH-02 | contract/domain carrier | 未依赖 application/entry | contract/domain tests 可定义 | pass_with_affected_open |
| PH-03 | intake/redaction/correlation | 不依赖 audit/evidence/read/job | service/UoW/redaction tests 可定义 | pass_with_affected_open |
| PH-04 | audit/evidence/gap | 不依赖 final report/cleanup | audit/query/no-write tests 可定义 | pass_with_affected_open |
| PH-05 | signal/query/diagnostic | 不触发 maintenance/job | query/no-write/freshness tests 可定义 | pass_with_affected_open |
| PH-06 | handoff/retention/rebuild/jobs | 不产生 H13/source truth | job/recovery/retention tests可定义；positive affected 保持 controlled | pass_with_affected_open |
| PH-07 | runtime/entry activation | 只装配已闭合能力，不新增业务 schema | config/entry/dependency checks 可定义 | pass_with_readiness_blocker |
| PH-08 | run/report/handoff shell | 不产生真实 verdict/signoff | provenance/static checks 可定义 | pass_with_execution_absence |

## 7. 跨 phase 依赖闭环审计

| 审计项 | 结论 | 处理 |
|---|---|---|
| 七个 crate 是否都有 phase owner | pass | PH-02~PH-07 分层承接；无 `common/utils` 收纳 phase |
| 60 exact protocol 是否有 phase 归属 | pass | Command/Query/Consumer/Event/Job 逐族绑定到 PH-03~PH-07；Step 06 再落 boundary |
| 27+1 state 是否有 phase 归属 | pass | safety/intake -> PH-03；audit/gap -> PH-04；read/maintenance -> PH-05/06；job/report -> PH-06 |
| Query 是否被错误放入 writer phase | pass | Query surface 在 PH-05，保持 zero-write；只读 maintenance relation 不转 writer |
| Event/publication 是否早于 committed source | pass | E01~E12 在 PH-04~PH-07，必须消费 accepted snapshot |
| Job/report 是否早于 plan/fence/owner | pass | PH-06 依赖 PH-02~PH-05；J06 controlled |
| config/runtime 是否早于 contracts | pass | PH-01 只做骨架，PH-07 才激活完整 runtime |
| test/evidence 是否早于可执行对象 | pass | PH-01/08 只做脚本/路径合同，functional suite 随 phase 生成 |
| 12 inherited affected 是否被隐藏 | no | 明确绑定 PH-03/04/06/07/08，保持原状态 |
| 是否存在 phase 依赖后续 phase 的输出 | no known conflict | 每个 phase 的“不包含”表已固定；Step 06 做 boundary 级复核 |

## 8. 回填草稿

正式 `07` §5 回填八个 phase 的依赖图和总表：PH-01 验证/配置骨架，PH-02 contracts/domain carrier，PH-03 intake/redaction/correlation，PH-04 audit/evidence/gap，PH-05 signal/projection/query，PH-06 handoff/retention/rebuild/jobs，PH-07 runtime/entry activation，PH-08 release/report/acceptance shell。每个 phase 都是可验证功能增量，有明确输入、输出、排除项、测试/验收门禁和停审；不把目标仓缺失、affected 或设计 planned 状态写成实现完成。

## 9. 待确认事项与 Step 自检

| 检查项 | 结论 |
|---|---|
| 是否有阶段依赖图和阶段总表 | pass |
| 每个 phase 是否是功能增量而非文件/对象清单 | pass |
| 每个 phase 是否有输入、输出、不包含和验证方式 | pass |
| 是否逐 phase 停审并完成跨 phase 审计 | pass |
| 是否把 12 项 affected 作为显式 gate 而非关闭项 | pass_with_affected_open |
| 是否引入未冻结产品、性能阈值或业务 truth | no |
| 是否伪造实现、测试、evidence 或验收结果 | no |
| new upstream blocker | none |
| gate_status | `pass_with_affected_open` |
| next_allowed_action | `continue_to_step_06` |
