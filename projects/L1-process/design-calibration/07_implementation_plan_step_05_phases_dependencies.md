# L1-process 07 实施计划 Step 5: 设计实施阶段与依赖顺序

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-process/07-实施计划.md` §5 实施阶段与依赖顺序
> 状态: `[x] 已完成`
> 日期: 2026-06-06

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 5 |
| 主题 | 设计实施阶段与依赖顺序 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-process/design-calibration/07_implementation_plan_step_05_phases_dependencies.md` |

本步把 Step 4 的交付物组织成按依赖推进的可验证功能增量。本步只定义阶段顺序、阶段目标和阶段门禁,不拆分具体 commit boundary。

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_04_deliverables.md` | 已确认 | 提取 7 crate、13 Command、11 Query、7 inbound event、10 outbound event、7 job 和 evidence 交付物 |
| `03-详细设计.md` §4~§16 | 已完成 | 提取 workspace、对象、protocol、flow、状态、事务、幂等、配置、观测和 test cuts |
| `04-配置设计.md` | 已完成 | 提取 P0 profile、runtime builder、adapter binding、artifact / report root 和 failure mode |
| `05-测试方案.md` | 已完成 | 提取 TC / EV / suite / artifact / report / redaction 门禁 |
| `06-验收标准.md` | 已完成 | 提取 AC / VF / ST / RL / risk acceptance 约束 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 最小可运行或可测试纵切是什么 | 目标仓 Rust workspace + `core-contracts` path dependency + config / evidence skeleton 是技术最小纵切;业务最小纵切是 runtime shape / profile adoption,因为 instance、activity、waiting、query 和 job 都依赖可执行过程形态。 |
| 哪些阶段必须先于其他阶段 | PH-01 必须先于所有阶段;shape/profile 先于 instance/activity;instance/activity 先于 waiting/recovery;query/projection 要在 consumer/outbox/job 前建立消费验证;release reports 必须最后。 |
| 哪些风险需要前置 | 目标仓不存在、唯一编译期依赖、旧 README 技术栈、raw body / secret redaction、configured adapter 不可伪成功、query/job no truth repair 和 evidence path 固定。 |
| 每个阶段完成后能验证什么 | 每阶段都能验证一个可审查的 Process 能力闭环,并产生对应 TC / EV / AC 证据。 |
| 是否存在不可验证的阶段拆法 | 是。按 crate、对象、DTO 全量或 repository 全量拆分都不可验证;必须按功能纵切推进。 |
| 哪些阶段可以并行 | PH-01 后脚本模板、fixtures 和 report shell 可增量并行;核心 truth、query、consumer、outbox、job 和 release 阶段必须按依赖串行。 |

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 交付物尚未排序 | Step 4 只列交付对象 | 实施者无法判断先做 shape 还是 instance / job | 本步按 Process truth 依赖排序 |
| 7 crate 容易误当阶段 | crate 是落点不是能力 | 一次只完成一个 crate 无法验收 | 阶段按纵切能力组织 |
| query 容易后置 | Query 被误认为只读 UI | 后续 consumer / job 无消费验证 | PH-06 单独建立 authorized query / projection |
| jobs 容易提前 | jobs 依赖 outbox、projection、reference 和 handoff state | 提前实现会缺 truth / report 来源 | PH-09 后置到主要写入和消费闭环之后 |
| reports 容易最后才开始 | `05/06` 要求 fixed run evidence | 最终证据补不齐 | PH-01 建骨架,PH-10 收口 |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 阶段组织 | 只有交付物清单 | 形成 PH-01~PH-10 阶段链 | 实施顺序明确 |
| 最小闭环 | 未定义 | 先 workspace,再 shape/profile,再 instance/activity | 避免一开始铺开全部对象 |
| 消费面 | 可被后置 | PH-06 专门建立 query / projection / trace read | 后续 consumer / job 可立即验证 |
| 运维任务 | 容易和写路径混做 | PH-09 专门处理 jobs / reports / no truth repair | 降低状态和事务风险 |
| 证据 | 只列输出路径 | PH-01 建壳,PH-10 生成最终送验材料 | 满足验收追溯 |

## 6. 实施计划取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按 crate 推进 | 目录清楚 | 不形成可验业务闭环 | 不采用 |
| 按 Command 逐个推进 | 粒度小 | shape/profile/instance/activity 共享状态和事务,容易重复 | 只在阶段内用 commit boundary 表达 |
| 按 Process 能力纵切推进 | 每阶段可测、可验、可回退 | 单阶段跨多个 crate | 采用 |
| query / jobs 最后统一做 | 写路径推进快 | 无法早发现 no-write 和 report 闭环问题 | 不采用 |
| scripts 最后补 | 初期省事 | evidence / redaction 失败发现太晚 | 不采用 |

## 7. 结构化中间产物

### 7.1 阶段依赖图: L1-process 实施阶段顺序

```text
[PH-01 仓初始化与证据骨架]
  | enables workspace, core dependency, config and script roots
  v
[PH-02 Runtime shape / profile foundation]
  | creates executable process shape and project profile baseline
  v
[PH-03 Process instance / activity / token / gateway progression]
  | proves ProcessInstance and Activity progression as Process truth
  v
[PH-04 Waiting gate / checkpoint / recovery continuity]
  | proves waiting and recovery continue the same Process truth
  v
[PH-05 Stage / timebox rhythm]
  | binds process rhythm to external work refs without owning Work truth
  v
[PH-06 Authorized query / projection / trace consumption]
  | proves 11 queries, view status, trace and no-write
  v
[PH-07 Inbound consumers / reference snapshots / runtime feedback intake]
  | proves safe intake, dedup, quarantine and delayed markers
  v
[PH-08 Outbox publisher / outbound event protocol]
  | proves 10 outbound events, publication retry and failure markers
  v
[PH-09 Operations jobs / handoff / reconciliation / recovery maintenance]
  | proves 7 jobs, reports, partial failure and no truth repair
  v
[PH-10 Release gates / reports / acceptance handoff]
```

关键说明:

- 图表达阶段依赖顺序,不表达函数调用链。
- 阶段按可验证功能增量组织,不是按 crate、对象或文件组织。
- `scripts`、`artifacts`、`reports` 在 PH-01 建骨架,在 PH-10 形成完整送验材料。
- production DB / broker / search / trace / archive adapter 不进入 P0 主链。

### 7.2 阶段总表

| 阶段 | 阶段名称 | 实施目标 | 依赖阶段 | 核心交付物 | 阶段门禁 |
|---|---|---|---|---|---|
| PH-01 | 仓初始化与证据骨架 | 创建目标仓、workspace、唯一 core dependency、config skeleton、scripts 和 evidence root | 无 | `/home/aris/Projects/quantalithos-process`;7 crate;`scripts/*`;`artifacts/test/<run_id>`;`reports/` | workspace 可编译;路径 / 命名 / dependency scan 通过 |
| PH-02 | Runtime shape / profile foundation | 建立 method definition 到 runtime shape、project profile adoption 和 tailoring baseline | PH-01 | shape/profile DTO、domain、repository、service、API handler、outbox intent | `TC-PROC-CONTRACT-*`;shape/profile command tests;AC-PROC-001/006 |
| PH-03 | Process instance / activity / token / gateway progression | 建立 ProcessInstance、Activity、Token、Gateway 推进闭环 | PH-02 | instance/activity command、state machine、progression service、trace / outbox / result | `TC-PROC-CMD-*`;`TC-PROC-STATE-*`;AC-PROC-002/003/007/008 |
| PH-04 | Waiting gate / checkpoint / recovery continuity | 建立 waiting gate、checkpoint、recovery attempt 和恢复连续性 | PH-03 | gate / checkpoint / recovery command、state、service、failure handling | `TC-PROC-RECOVERY-*`;`EV-INTEGRATION-001`;AC-PROC-004/010/011 |
| PH-05 | Stage / timebox rhythm | 建立 stage state 和 timebox binding,只引用 Work 节奏,不接管 Work truth | PH-04 | rhythm command、stage/timebox domain、snapshot marker、outbox | rhythm command/state tests;RL-PROC-ARCH-001 |
| PH-06 | Authorized query / projection / trace consumption | 建立 11 Query、read model、projection、trace、search / report read surface 和 no-write | PH-05 | query DTO、view DTO、projection store、query handler、trace read | `TC-PROC-QUERY-001~011`;`EV-SERVICE-002`;AC-PROC-005/012 |
| PH-07 | Inbound consumers / reference snapshots / runtime feedback intake | 承接 7 inbound event,写 snapshot / stale / pending / quarantine marker | PH-06 | inbound DTO、consumer service、dedup、reference snapshot、runtime feedback marker | `TC-PROC-EVENT-001~007`;`EV-WORKER-001`;AC-PROC-009 |
| PH-08 | Outbox publisher / outbound event protocol | 建立 10 outbound event payload、publisher dispatch、retry / failed state 和 publish outbox job 最小执行面 | PH-07 | outbox event DTO、payload builder、publisher fake、`PublishProcessOutboxJob` DTO、worker/job loop | `TC-PROC-PUB-001`;`EV-WORKER-002`;topic map / redaction |
| PH-09 | Operations jobs / handoff / reconciliation / recovery maintenance | 建立除 publish outbox 外的 6 个 operations job、report、handoff、reference refresh、projection rebuild、no truth repair,并汇总 7 job suite | PH-08 | non-publish job DTO、job runner、partial report、handoff fake、reconciliation report | `TC-PROC-JOB-001~007`;`EV-JOB-001`;VF-PROC-006/007 |
| PH-10 | Release gates / reports / acceptance handoff | 执行 P0 gate,生成 fixed run reports、evidence index、redaction、veto 和 risk acceptance | PH-09 | gate script、report generator、redaction checker、acceptance handoff | `TC-PROC-SCRIPT-*`;`EV-SCRIPT-*`;`EV-E2E-001`;AC-PROC-001~029;VF-PROC-001~008 |

PH-02~PH-05 中的 `outbox intent` 只表示 PH-08 前用于 command side-effect 验证的过渡保存面。进入 commit-08-b 后,所有旧 outbox intent port、fake store 和 accepted-flow call site 必须迁移为正式 `ProcessOutboxRecord` 保存面;旧 `event_kind + subject_ref + trace_ref` 形态不得继续作为并行 outbox path 或 publisher 输入。

`PublishProcessOutboxJob` 是 PH-08 publisher loop 的正式 public job surface,不是 PH-09 才出现的内部 runner。因为 Step 8 / Step 9 已规定 `PublishProcessOutboxFlow` 接收 `PublishProcessOutboxJob` 并返回 `JobRunReceipt` / `JobError`,commit-08-e 必须允许提前引入 publish outbox 所需的最小 `contracts/src/jobs.rs` shared schema、publish job idempotency result replay 和 `ProcessOutboxService.publish_pending(...)` 签名。commit-09-a 起只承接 non-publish operations job 的 shared scope / report / runner foundation,不得再把 publish job DTO 作为后置 deliverable。

### 7.3 阶段顺序理由

| 顺序 | 理由 |
|---|---|
| PH-01 先行 | 没有 workspace、core dependency、config 和 evidence root,任何后续代码都不可验证 |
| PH-02 早于 PH-03 | ProcessInstance 必须基于 active runtime shape 和 adopted profile |
| PH-03 早于 PH-04 | waiting gate、checkpoint 和 recovery 必须挂在既有 instance / activity 上 |
| PH-04 早于 PH-05 | stage / timebox rhythm 需要已有过程实例和恢复连续性,避免把 Work truth 当 Process truth |
| PH-05 早于 PH-06 | Query / projection 需要覆盖 shape、profile、instance、activity、waiting、recovery 和 rhythm 主对象 |
| PH-06 早于 PH-07 | Consumer 写入的 snapshot / marker 必须能被授权查询和 degraded view 验证 |
| PH-07 早于 PH-08 | Outbound event 需要覆盖 command 和 inbound 引发的 Process truth / marker 变化 |
| PH-08 早于 PH-09 | Operations jobs 需要 pending outbox、projection、reference 和 publication state 作为输入 |
| PH-10 最后 | release gate 和 acceptance handoff 必须基于全部 P0 evidence |

### 7.4 阶段可并行性判断

| 阶段 | 可并行部分 | 不可并行部分 | 结论 |
|---|---|---|---|
| PH-01 | README、script help、report shell、config fixture root | crate naming、Cargo dependency、workspace layout | 小范围并行 |
| PH-02~PH-05 | fixtures / negative tests 可与 domain skeleton 协同 | 阶段之间的 core truth 链路必须串行 | 阶段间不并行 |
| PH-06 | view fixtures、report shell 可提前准备 | query no-write 和 projection source 依赖前置 truth | 部分并行 |
| PH-07~PH-09 | fake adapter failure scripts 可提前准备 | consumer/outbox/job 主逻辑依赖前置状态 | 部分并行 |
| PH-10 | 无 | 必须等待全部 P0 evidence | 不并行 |

### 7.5 按对象拆分风险检查

| 错误阶段写法 | 问题 | 替代表达 |
|---|---|---|
| 实现所有 DTO | 只能证明类型存在,不能证明流程可用 | 随 PH-02~PH-09 的纵切交付 DTO |
| 实现所有 domain 对象 | 缺 repository、service、entry 和 tests | 按 shape/profile、instance/activity、waiting/recovery 等能力交付 |
| 实现所有 repository | 无业务用例驱动,容易过度抽象 | 随 command、query、consumer、job 逐步交付 |
| 实现所有 worker | worker 依赖 consumer、outbox 和 job 状态 | PH-07 / PH-08 / PH-09 分别交付 |
| 最后统一补测试和 reports | 阶段不可验,不符合验收标准 | 每阶段绑定 TC / EV,PH-10 只做总收口 |

## 8. 回填草稿

```markdown
## 5. 实施阶段与依赖顺序

> 校准来源:
> - `design-calibration/07_implementation_plan_step_05_phases_dependencies.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“阶段依赖图”“阶段总表”“阶段顺序理由”“阶段可并行性判断”和“按对象拆分风险检查”小节。

L1-process 按 PH-01~PH-10 推进:先建立仓和证据骨架,再落 runtime shape / profile、instance / activity、waiting / recovery、rhythm、query / projection、inbound consumer、outbox publisher、operations jobs,最后生成 release evidence 和 acceptance handoff。
```

## 9. 进入下一步条件

- PH-01~PH-10 阶段顺序已固定。
- 每阶段都有可验证目标、依赖阶段和门禁。
- 后续 Step 6 可以按阶段拆任务、代码批次和 commit boundary。
