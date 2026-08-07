# L2-tools 07 实施计划 Step 4：抽取实施对象与交付物

## Step 状态

`accepted`

## 本步输入

| 输入 | 来源 | 用途 |
|---|---|---|
| Step 2 范围表 | `07_implementation_plan_step_02_scope.md` | 排除非交付 owner。 |
| 模块/对象/协议契约 | `03-详细设计.md` §4~§8 | 抽取实现单元和顺序依赖。 |
| 测试切口与数据 | `05-测试方案.md` §3、§6、§7 | 绑定测试交付物。 |
| AC/VF/evidence | `06-验收标准.md` §5、§10~§14 | 绑定报告、检查和交接。 |

## SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 本轮新增哪些代码模块？ | 七个 planned member；每个只实现其责任，不新增 `common/utils/manager` 顶层桶。 | `03` §4~§5、目录规范。 |
| 哪些协议必须落地？ | 13 Command、11 Query、5 Consumer、4 Event、4 Job；每个有 exact carrier、mapper、flow、state、error、replay。 | `03` §7、§16.2。 |
| 哪些测试必须新增？ | 234 concrete TC 所属 22 family、11 P0 suite、local smoke、11 mandatory checks；实际结果由实现期生成。 | `05` §6、§9。 |
| 哪些配置/文档要交付？ | strict config candidate/validator/builder、scripts/gates/reports/checks、manifest/report schema、implementation ledgers。 | `04` §7~§12；`05` §9/§13；台账规范。 |
| 哪些对象不作为独立实现任务？ | 全部 41 对象会按能力纵切归属，不按对象逐个提交；外部 owner 对象不交付。 | SOP Step 4。 |

## 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 41 对象数量大 | 按对象拆会形成不可验证小片 | 按六业务组成部分和 protocol flow 纵切。 |
| 37 protocol 跨多模块 | 容易产生第二版 DTO 或跨 boundary 依赖 | contract foundation 先闭合，随后按 family 切片。 |
| 证据交付容易提前伪造 | 设计文档混入 run/result | 只交付 schema/script/builder contract，结果留实现期。 |

## 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 对象清单 | 可能被当作 41 个任务 | 作为交付追溯索引，任务按 capability/protocol family | 控制提交粒度。 |
| 测试交付 | “补测试” | exact family、dataset、suite、check 和 report contract | 可执行。 |
| 配置交付 | 只列 config.rs | validator、builder、profiles、redline、script 和 evidence roots 一起规划 | 闭合 config activation。 |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 41 对象各自一个 boundary | 追踪直观 | 过细、无法独立验证完整 flow | 不采用。 |
| 七模块横向一次实现 | 文件归属清楚 | 破坏纵切和测试前置 | 不采用。 |
| foundation + capability vertical slice + entry/job/release | 可验证且可回退 | boundary 设计成本高 | 采用。 |

## 结构化中间产物

### 工程单元映射

| 实现单元目录 | Cargo package | Rust crate/binary | 主要职责 | 对外暴露 |
|---|---|---|---|---|
| `crates/contracts` | `tools-contracts` | `tools_contracts` | public DTO、typed refs、metadata、errors、protocol carriers | 是 |
| `crates/domain` | `tools-domain` | `tools_domain` | 41 对象、状态、factory、policy、pure mapper | 否/经 application |
| `crates/application` | `tools-application` | `tools_application` | facade、service、Store/Port traits、UoW、idempotency | 是（内部 API） |
| `crates/infra` | `tools-infra` | `tools_infra` | Store/Port adapters、fakes、config builder、runtime composition | 否 |
| `crates/api` | `tools-api` | `tools_api` | command/query handlers、routes、API binary | 是 |
| `crates/worker` | `tools-worker` | `tools_worker` | inbound/continuation consumers、worker binary | 是（入口） |
| `crates/jobs` | `tools-jobs` | `tools_jobs` | bounded jobs、reports、job binaries | 是（入口） |

### 对象与能力归属

| 组成部分 | 对象数 | 主要 boundary | 完成判定 |
|---|---:|---|---|
| contract/evolution | 6 | PH-02、PH-03 | exact identity/revision/history/CAS/replay。 |
| binding/source | 6 | PH-02、PH-04 | relation/snapshot/assessment/gap/selector。 |
| invocation/admission | 5 | PH-02、PH-05 | canonical invocation、admission、no-execution。 |
| precondition/handoff | 6 | PH-02、PH-05 | requirement、auth consumption、Prepared/unknown。 |
| outcome/audit/safe handoff | 10 | PH-02、PH-06、PH-08 | pair/material/attempt/status separation。 |
| integrity/derived | 8 | PH-02、PH-07、PH-09 | assessment/gap/report/projection/guidance。 |
| **合计** | **41** |  |  |

### Protocol 交付映射

| protocol family | 数量 | 主要交付 boundary | 核心结果 |
|---|---:|---|---|
| Commands `CF-01~13` | 13 | PH-03~PH-07 | `ToolCommandResponse`/stored result。 |
| Queries `QF-01~11` | 11 | PH-03~PH-07 | read-only response/view。 |
| Inbound `IF-01~05` | 5 | PH-08 | `ConsumerReceipt`。 |
| Outbound `OF-01~04` | 4 | PH-08 | `ExternalSubmissionAttemptView`。 |
| Jobs `JF-01~04` | 4 | PH-09 | `JobReport`。 |
| **合计** | **37** |  |  |

### 交付物清单

| 交付物 | 类型 | 来源 | 预计落点 | 完成判定 |
|---|---|---|---|---|
| Workspace manifest/member skeleton | code/config | 03 §4、目录规范 | target repo root/`crates/*` | naming/dependency/static gate。 |
| Public contract carriers and codec tests | code/test | 03 §6~§7、05 FOUNDATION | `crates/contracts` | roundtrip/invalid/body-free/Rustdoc。 |
| Domain objects/state/policies | code/test | 03 §5.3、§9、05 STATE | `crates/domain` | legal/illegal/terminal/pure tests。 |
| Stores, Ports, UoW, idempotency/fakes | code/test | 03 §5.4~§5.5、§10~§13 | `crates/application`,`crates/infra` | CAS/transaction/replay/fake parity。 |
| Capability vertical slices | code/test | 03 CF/QF and 00 FR | application/domain/infra/api | selected TC + AC mapping。 |
| Query/read projections | code/test | 03 QF、05 QUERY | application/infra/api | zero-write/freshness/visibility。 |
| Consumers/events | code/test | 03 IF/OF、05 CONSUMER/CONT | worker/application/infra | claim/one-call/unknown/replay。 |
| Bounded jobs | code/test | 03 JF、05 JOB | jobs/application/infra | bounded report/no-repair。 |
| Strict config candidate/validator/builder | code/test/config | 04 §7~§11 | infra/config + tests | V0~V8/B0~B8/CFG-T/A/F/X。 |
| Gate/check/report scripts | script/report | 05 §9、§13；06 §10 | `scripts/*`, `artifacts`, `reports` | CLI/path/schema/redaction/pairing。 |
| Test datasets/case manifest | test/config | 05 §7 | `tests/fixtures`/run artifacts | 234 TC identity and deterministic reset. |
| Implementation ledgers | doc | code台账规范 | design-calibration | project ledger、all 26 skeletons and state machine. |
| Acceptance handoff inputs | report/doc | 06 §10~§14 | run-scoped reports/acceptance | only real run can populate; design only plans. |

### 非交付物

| 非交付物 | 原因 |
|---|---|
| external provider implementation/readiness | owner seam/blocker。 |
| Sandbox run/receipt/capture/cleanup/DLQ | L4-sandbox owner。 |
| Bus delivery/Obs store/SDK client | sibling owner。 |
| production deployment/quantitative SLA | future qualification/no authority。 |
| real commit/run/evidence/signoff | current design task has no execution facts。 |

## 回填草稿

正式 07 §4 应使用工程单元、对象组成部分、protocol family 和交付物表；不复制 03 字段定义，只引用其章节和对应 Step 文件。

## 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| 实现仓是否采用七 member 原名 | PH-01 layout | target repo creation。 |
| 具体 durable Store adapter | PH-02/07 | before durable batch；fake parity 先行。 |
| report generator 实现形式 | PH-11 | scripts batch 开工前。 |

## 进入下一步条件

- [x] 交付物可判定、可定位、可追溯。
- [x] 非交付物显式列出。
- [x] 对象/protocol 没有被误拆成不可验证单元。
