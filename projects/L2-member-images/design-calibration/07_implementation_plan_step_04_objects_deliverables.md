# 07 Step 4：抽取实施对象与交付物

## Step 状态

`completed_with_explicit_blockers`

## 本步输入

| 输入 | 来源 | 目的 |
|---|---|---|
| 七技术模块与文件树 | `03-详细设计.md` §4~§5 | 确定实现单元和目录边界 |
| 10 Command / 10 Query / 2 inbound / 6 Job / 0 outbound | `03-详细设计.md` §7~§8 | 确定协议与入口交付面 |
| 19 state matrix、UoW、error、idempotency、projection | `03-详细设计.md` §9~§16 | 确定高风险实现切片 |
| 21 配置 key | `04-配置设计.md` §3~§13 | 确定配置/组合交付物 |
| TC/EV/suite/path | `05-测试方案.md` §6、§9、§13 | 确定测试与报告工具交付物 |
| AC/VETO/证据上限 | `06-验收标准.md` §5~§14 | 确定未来验收交接，不产生结果 |

## SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 要实现哪些模块 | `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七个 planned workspace member | 03 §4 |
| 哪些是业务主体 | DefinitionAssembly、BuildCandidate、Qualification、SupplyEntry、ReferenceDerived 五 capability | 03 §5/§9 |
| 哪些是技术交付物 | config/composition、stores/ports/fakes、logical entries、gate/report/check tooling | 03 §5/§13、04、05 |
| 哪些交付物可以当前规划 | typed carriers、pure guards、strict config、read-only/query、marker-only、bounded job stop、脚本契约 | 03/04/05 |
| 哪些交付物必须等待 | mutation UoW、stored replay、builder/digest、Artifact/consumer success、projection recovery、event publisher | B01/B02/B03/OPEN/PF、MI-UP |
| 如何判定交付完成 | 每个 boundary 有独立 scope/gate/evidence/handoff；实际完成需目标仓与真实证据，当前不填写 | 台账规范、06 §3/§12 |

## 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| “交付物”可能被误写为对象全集 | 任务不可验证、阶段退化为文件清单 | 按功能增量和边界组织，引用对象族而非复制 schema |
| `api`/`worker`/`jobs` 名称容易被解释为已部署进程 | 偷渡 transport、broker、scheduler | 仅列 logical library/action candidate |
| 测试/报告目录属于实现仓 | 在设计仓误创建真实产物 | 只列 planned paths 与生成契约 |
| external adapter 交付面不清 | fake/controlled 被写成 provider success | 交付 safe conclusion/gap adapter，不交付 owner truth |

## 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 实施对象 | 只有模块和对象索引 | 按代码、配置、入口、测试、工具、文档、台账分面 | 可验收、可分 phase |
| 交付标准 | 容易以“文件存在”算完成 | 绑定编译/测试/gate/evidence/handoff 条件 | 防止静态 readiness |
| 外部交互 | 可能包含 provider/consumer | 只交付 typed ref、marker、gap、adapter seam | 尊重 owner 边界 |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按五 capability 各建 crate | 直观 | 跨层依赖循环、重复 carrier | 不采用 |
| 按文件逐项列任务 | 细 | 缺少可验证增量和回退边界 | 不采用 |
| 按交付面+功能阶段组织 | 可映射 gate、scope、测试与回退 | 需要维护跨层矩阵 | 采用 |

## 结构化中间产物

### 实施对象总表

| 对象组 | 所属单元 | 实施动作 | 当前状态 |
|---|---|---|---|
| shared IDs/refs/metadata/reasons/views/errors | `contracts` | 建立 body-free typed carrier 与 safe mapping | planned |
| definition/assembly/revision | `domain` | 建立 pure factory、guard、state、history helper | planned；正向 source pending |
| build intent/snapshot/attempt/outcome/candidate | `domain` | 建立分层 state 与 blocked/unknown outcome | planned；B01/B02 |
| provenance/gate/eligibility/handoff gap | `domain` | 建立 qualification guard 与 gap semantics | planned；Q-MI-004/MI-UP-007 |
| availability/entry/consumer gap | `domain` | 建立 local transition/history/entry guard | planned；B03/MI-UP-001 |
| reference/projection/trace/freshness | `domain`/`application` | 建立 strict reads 与 no-repair direction | planned；PF recovery blocked |
| coordinators/ports/UoW/idempotency | `application` | 绑定 logical flow、错误和 future reopen seam | planned；B01/B02/OPEN |
| repositories/projections/config/adapters/fakes | `infra` | 实现 local stores、strict config、conservative slots | planned |
| logical API/worker/job entries | `api`/`worker`/`jobs` | mapping、marker、bounded action | planned；transport/event/scheduler pending |

### 目录 / Package / Crate / Binary 映射

| 实现单元目录 | Cargo package | Rust crate / binary | 类型 | 主要交付 |
|---|---|---|---|---|
| `crates/contracts` | `member-images-contracts` | `member_images_contracts` | library | typed refs、metadata、protocol/view/error |
| `crates/domain` | `member-images-domain` | `member_images_domain` | library | five capability truth、state、guard、history |
| `crates/application` | `member-images-application` | `member_images_application` | library | facade、ports、UoW/idempotency、services |
| `crates/infra` | `member-images-infra` | `member_images_infra` | library | stores、config、composition、adapters/fakes |
| `crates/api` | `member-images-api` | `member_images_api` | logical library | command/query mapping |
| `crates/worker` | `member-images-worker` | `member_images_worker` | conditional library | marker-only inbound |
| `crates/jobs` | `member-images-jobs` | `member_images_jobs` + action candidates | library/binary candidates | six bounded jobs |

### 交付物清单

| 交付物 | 类型 | 来源 | 预计落点 | 完成判定 | 当前状态 |
|---|---|---|---|---|---|
| workspace skeleton | code/layout | 03 §4 | target repo root + `crates/*` | 命名/依赖检查与编译门禁 | blocked: repo absent |
| typed protocol carriers | code | 03 §6~§8 | `crates/contracts/src` | contract tests + no forbidden body | planned |
| domain guards/state/history | code | 03 §5、§9~§12 | `crates/domain/src` | pure unit tests + matrix coverage | planned |
| application facade/ports | code | 03 §5、§8、§10~§13 | `crates/application/src` | no-write/flow tests; positive blocked respected | planned |
| local stores/composition/fakes | code | 03 §5、04 §3~§11 | `crates/infra/src` | config/security/fake parity gates | planned |
| logical entry mappers | code | 03 §7~§8 | `crates/api`、`crates/worker`、`crates/jobs` | entry marker/action tests | planned |
| gate/check scripts | script | 05 §9、§13 | `scripts/gates`, `scripts/checks` | fixed args/path, nonzero on failure | planned |
| report generators | script | 05 §9、§13 | `scripts/reports` | derive from fixed run, no static pass | planned |
| test fixtures and suites | test | 05 §6~§10 | target repo tests/fixtures | reproducible, isolated, redacted | planned |
| raw/report/evidence schema | evidence tooling | 05 §13、06 §3/§10 | target repo paths | same-run pair and link checks | not generated |
| implementation ledgers | design handoff | SOP/台账规范 | current design-calibration directory | all 24 skeletons nonempty | this Step planned |

### 非交付物清单

| 非交付物 | 处置 |
|---|---|
| RoleDefinition/mapping/component/seed/Artifact/consumer body | 由 owner 保持；本仓只交付 ref/safe conclusion/gap |
| builder/registry 实际执行、digest、gate/Artifact acceptance | future/reopen；当前不生成 |
| HTTP/RPC/broker/topic/envelope/receipt/dedup/scheduler/lease/TTL | 未授权 transport/event/job lifecycle，不创建 |
| live memory/checkpoint/workspace/container/runtime state | 严格排除 |
| observability backend、marketplace、deployment/runbook | 另由 owner/后续文档处理 |
| 实际 run、artifact、report、EV instance、VETO、verdict、signoff、readiness | 本轮禁止 |

### 交付分层与依赖关系

```text
contracts / domain pure carriers
        | enables
        v
application ports + no-write flows
        | enables
        v
infra composition + logical entries
        | verifies
        v
tests / gates / reports / handoff
```

关键说明：
- 图表达交付依赖，不表达业务调用的完整函数链。
- external owner 通过 typed ref、safe conclusion、gap 或 marker 接入，不成为本仓源码 truth。
- 测试/报告交付是 planned capability，不等于实际证据已生成。

## 回填草稿

本轮实施对象按七职责 workspace、五 capability domain、application ports/flows、infra config/stores/adapters、三类 logical entry、测试与 gate/report 工具、implementation ledgers 分层。每项交付物均有来源和完成判定。非交付物明确排除外部 owner body、真实 builder/registry、Artifact/consumer success、event/publisher、scheduler、live state 和验收事实。

## 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| target repo 是否建立 | 所有 code/test/script deliverables | PH-01 activation 前 |
| 七 crate 是否保持 | workspace boundary | commit-01-a Design Gate |
| API/worker binary 是否需要 | 入口交付面 | MI-UP-005 与产品 authority 闭合前 |
| jobs action binary exact names | jobs 交付面 | commit-07-c 前 |
| report/evidence policy | PH-08 交付标准 | Q-MI-004 / 06 evidence gate 前 |

## 进入下一步条件

- [x] 实施对象按功能交付面而非对象全集抽取。
- [x] 交付物、非交付物、落点和完成判定均可追溯。
- [x] 外部 owner 与实际证据未被列为当前已完成事实。
