# Step 5. 设计实施阶段与依赖顺序

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 5
>
> 回填章节：未来 `07-实施计划.md` §5 实施阶段与依赖顺序
>
> 本文件只定义 future phase 的能力增量和依赖关系，不表示任何 phase、代码、构建、测试、artifact、report、evidence、verdict、signoff 或 readiness 已执行。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 5：设计实施阶段与依赖顺序 |
| Step 状态 | `completed / pass_with_explicit_blockers / serial_continuation_authorized` |
| 输入基线 | 07 Step 1～4；正式 `03`、`04`、`05`、`06`；L1-governance phase 粒度参考 |
| 本步输出 | 本文件；未来正式 §5 回填草稿 |
| 停审方式 | 已完成 phase DAG、阶段表、每阶段可验证增量和跨 phase 审计；用户已授权连续推进，下一动作只能进入 Step 6。 |
| 当前实现事实 | 无目标实现仓、无 immutable design baseline、无 phase 执行结果；所有 gate 仍为 future planned。 |

## 2. 本步输入

| 输入 | 用途 | 使用边界 |
|---|---|---|
| Step 4 implementation objects | 将 code / config / test / report 面组织成纵切 | 不按单个对象或文件拆 phase |
| `03-详细设计.md` §4～§16 | 读取七模块、CP01～CP07、协议、flow、state、Store/UoW 和错误边界 | 不在本步新增 schema、Port、状态或 physical product |
| `04-配置设计.md` §6～§14 | 确定 profile、strict validation、builder 和 blocked slot 的前置顺序 | 配置不得改写 owner/invariant |
| `05-测试方案.md` §9～§14 | 确定 suite、证据路径和回归关系 | planned suite 不等于执行结果 |
| `06-验收标准.md` §5～§14 | 确定 AC/VF/VETO 的阶段覆盖 | 不在本步填写 verdict |
| Step 3 阅读矩阵与 blocker | 确定每阶段开工前阅读和不可用姿态 | UP/DDD blocker 不得降格为普通待办 |

## 3. SOP 问题回答

1. **最小可运行或可测试的纵切是什么？**

   最小纵切是 PH-01 后的 CP01 本地在场链：typed 双锚与 startup contract → domain admission/presence → application UoW/idempotency → deterministic local Store → logical API result。它可以只验证 local accepted、reject 和 blocked surface，不需要 host、IPC、Runtime 或 Bus 的真实正向成功。

2. **哪些阶段必须先于其他阶段？**

   workspace/依赖/配置骨架必须先于所有业务代码；可写 local truth 与状态/UoW/replay 基础必须先于 Query、Consumer 和 Job；CP01/CP02 的输入基础必须先于 CP03 Runtime mediation；CP03 的 committed material 必须先于 CP04/CP05；CP01～CP06 committed fact 必须先于 CP07 projection；Consumer/Job continuation 必须在其 source truth、receipt/report contract 成立后；release evidence 最后。

3. **哪些风险或跨仓依赖需要前置？**

   `L2M-DDD-001`（目标仓）、Core contracts path、Rust/toolchain、命名、config/profile、artifact/report roots 是 PH-01 前置。`L2M-UP-001~008` 不作为 P0 正向前置，而在受影响 phase 提供 blocked/negative seam；`L2M-UP-005` 在所有 phase 都是 24 candidate non-materialization 红线。

4. **每个阶段完成后能验证什么？**

   PH-01 验证组合与依赖边界；PH-02 验证在场与宿主本地面；PH-03 验证入站 scope/screening；PH-04 验证 Runtime 受控投递的 local decision/attempt/reception；PH-05 验证 outbound 与 trace/observation local fact；PH-06 验证 mirror、summary、outlet 的 committed-only read；PH-07 验证 14 Consumer、5 Job、replay 和 continuation；PH-08 验证 gate/report/evidence 生成路径和 acceptance handoff 结构。

5. **是否存在按对象拆分而不可验证的阶段？**

   不采用“所有 struct / repository / service”横切阶段。每个 phase 都有一项可独立观察的能力增量；对象和 crate 只作为该增量的实现落点。

6. **哪些阶段可以并行，哪些不能并行？**

   P0 主链按 PH-01→PH-08 串行。PH-01 后可并行准备 test fixture、redaction checker 和 report script shell，但它们不能绕过业务 phase gate。P1 owner selected-run 只有在对应合同闭合后才能作为独立 lane，不改变 P0 顺序。

7. **每个 phase 是否有输入、输出、测试门禁和验收门禁？**

   有。§7 结构化表为每个 phase 固定输入、输出、不包含、planned suite 和 AC/VF 关联；Step 6 再把 phase 展开成 commit boundary，Step 7 给出 boundary 级门禁。

8. **是否把后续 phase 才能提供的对象提前作为当前通过条件？**

   不把后续 object、result、receipt、report 或 evidence 作为当前 phase 的通过条件。当前 phase 只能使用已闭合的 source truth；预留 ref 仍须保持 blocked/waiting。

9. **每个 phase 完成后如何停审？**

   逐 phase 检查能力增量、依赖、门禁可执行性、后续 phase 越界和设计闭环。执行期任何字段、DTO、state、version、source、projection 或 evidence 缺口都暂停并回写 owning design。

10. **跨 phase 审计结论是什么？**

   设计层依赖顺序通过；目标仓、baseline、external contract、physical Store 和 helper 缺口仍是明确 blocker。它们不破坏规划 DAG，但阻止相应 implementation/qualification。

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| CP 与 crate 是两条不同轴 | 按 crate 拆 phase 会无法形成用户可验证增量 | 采用 CP 能力纵切，crate 作为落点 |
| Consumer、Query、Job 横跨多个 CP | 过早集中实现会依赖未提交 truth | Query 随 read phase，Consumer/Job 在 source truth 后集中收口 |
| 24 candidate 容易被当成 outbound feature | 可能越过 Core/Bus owner | 每一 phase 都只保留 dependency/non-materialization check |
| external seam 与 local fact 混淆 | fake success 可能污染验收 | phase 输出只允许 local/negative/blocked-aware disposition |
| evidence 只能在真实运行后产生 | 最后阶段容易静态写 pass | PH-08 只定义从 raw artifact 推导 report 的 future path |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 阶段组织 | 只有 CP、模块和对象清单 | 8 个能力纵切 phase | 支持独立验证和回退 |
| 依赖关系 | 分散在 03/05/06 | 明确 foundation → local truth → read/continuation → release | 防止后续结果前移 |
| external success | 可能成为隐含完成条件 | 独立 blocked/selected lane | 保持 owner truth |
| evidence | 未绑定阶段 | 从 PH-01 预留路径、PH-08 生成和审查 | 防止静态证据 |

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 按七个 crate 各做一个 phase | 不采用 | 产生横向堆叠，无法验证 CP 能力闭环 |
| 按 34 个对象逐个 phase | 不采用 | 过细且无法表达 protocol、状态和证据关系 |
| 按 CP 能力纵切并将 Consumer/Job 后置 | 采用 | source truth 先稳定，continuation 后验证 |
| 将外部 positive integration 混入 P0 | 不采用 | 当前 exact contract、route、credential 和 subject 未闭合 |
| 独立 PH-08 release/evidence phase | 采用 | 证据必须由真实 run 机械推导，并由 `06` 裁决 |

## 7. 结构化中间产物

### 7.1 阶段依赖图：L2-member

```text
[PH-01 Foundation / composition skeleton]
                 |
                 v
[PH-02 CP01 presence + host local surface]
                 |
                 v
[PH-03 CP02 scope + inbound screening]
                 |
                 v
[PH-04 CP03 Runtime mediation local boundary]
                 |
                 v
[PH-05 CP04 outbound + CP05 trace/observation]
                 |
                 v
[PH-06 CP06 mirror + CP07 read model]
                 |
                 v
[PH-07 Consumers + Jobs + replay continuation]
                 |
                 v
[PH-08 release gates + reports + acceptance handoff]
```

关键说明：
- 图表达 future phase 的依赖顺序，不表达 transport、IPC、网络拓扑或函数调用图。
- PH-07 只能消费已提交 local fact / safe resolution；不修复 source truth。
- 24 个 semantic candidate 在所有 phase 中都是 non-materialized blocked inventory。

### 7.2 阶段总表

| Phase | 阶段名称 | 实施目标 | 依赖 | 核心交付物 | planned 阶段门禁 | AC/VF 关联 |
|---|---|---|---|---|---|---|
| PH-01 | Foundation / composition skeleton | 建立七 library crate、Core-only candidate、config/builder 和检查根 | 无（但受 DDD-001、baseline blocker） | workspace skeleton、profile/config shell、test/script roots | `config-redline`、`dependency-boundary`（future） | `AC-L2M-026/033`、`VF-L2M-007/008` |
| PH-02 | CP01 presence + host local surface | 双锚 admission、presence successor、host material/attempt 的 local/blocked 面 | PH-01 | Command 001～004 local path、CP01 domain/application/API surface | `contract-domain-fast`、`service-flow-fast` | `AC-L2M-001/006~008`、`VF-L2M-001/002/005` |
| PH-03 | CP02 scope + inbound screening | verified scope、body-free inbound fact、四态 screening 和 refusal | PH-02 | Command 005～006、InboundFactConsumer local pre-gate、Query 003～004 | `contract-domain-fast`、`service-flow-fast`、`api-worker-entry` | `AC-L2M-002/009/010`、`VF-L2M-002/004` |
| PH-04 | CP03 Runtime mediation local boundary | screened ref → delivery decision → local submission attempt/result link/reception | PH-03 | Command 007～008、Query 005～006、blocked Runtime seam | `service-flow-fast`、`replay-recovery`、`redaction-boundary` | `AC-L2M-003/011`、`VF-L2M-003/005` |
| PH-05 | CP04 outbound + CP05 trace | committed-safe material、outbound decision、attempt/gap、append-only trace/observation posture | PH-04 | Query 007～011、trace/material domain、local continuation selectors | `service-flow-fast`、`redaction-boundary`、`infra-fake-parity` | `AC-L2M-003/004/012~015`、`VF-L2M-004/005/009` |
| PH-06 | CP06 mirror + CP07 read model | owner-specific safe resolution、freshness/gap、summary/outlet/diagnostic no-write projection | PH-05 | Command 009～010、Query 012～016、projection state/view | `projection-readmodel`、`service-flow-fast`、`dependency-boundary` | `AC-L2M-005/016/017/024`、`VF-L2M-003/007` |
| PH-07 | Consumers + Jobs + replay continuation | 14 Consumer、5 Job、receipt/report、partial isolation、exact replay | PH-06 | worker/jobs logical entries、continuation stores、report carriers | `api-worker-entry`、`job-continuation`、`replay-recovery` | `AC-L2M-008/013/016/021/031`、`VF-L2M-005/008` |
| PH-08 | Release gates + reports + handoff | 从真实 run 生成 report/evidence index、redaction/dependency audit 和 handoff 草稿 | PH-07 | gate/report/check orchestration、acceptance paths | `local-smoke`、`release-redline`、`report-generation-audit` | `AC-L2M-019~033`、`VF-L2M-001~009` |

### 7.3 Phase 可验证增量说明

| Phase | 功能增量 | 输入 | 输出 | 明确不包含 | 验证姿态 |
|---|---|---|---|---|---|
| PH-01 | 从无 workspace 到可检查的 composition skeleton | Step 3/4、03 §3/4、04 profile contract | 七 crate layout、Core candidate、config/script/report path contract | 业务 truth、外部 adapter、binary | future static/path/config checks；目标仓缺失时 blocked |
| PH-02 | 在场和宿主协作的 member-local 纵切 | 双锚、startup、presence object/flow | local admission/presence/material/attempt 和 typed refusal | host acceptance/session/health/IPC | local command/domain/service suites；UP-001/006 positive blocked |
| PH-03 | 入站筛选的安全纵切 | presence、scope source、screening source | body-free fact、四态 screening、scope replacement blocked path | Bus delivery、policy body、allowlist | contract/service/entry negative suites；UP-007 pending |
| PH-04 | Runtime mediation 的受控本地面 | screened fact、Runtime boundary ref、policy | delivery decision、attempt、result link、reception posture | Runtime run/context/plan/outcome | service/replay/redaction；UP-003/004 positive blocked |
| PH-05 | 出站与追溯的 local fact 面 | committed reception、safe source ref、trace policy | decision/material/attempt/gap/trace/observation posture | downstream delivery、Conversation/Artifact/Observability truth | service/fake/redaction；UP-004/005 positive blocked |
| PH-06 | 安全镜像与派生读取面 | committed local facts、owner-specific refs | resolution/snapshot/gap、summary/outlet/diagnostic、freshness | generic resolver、authorization、source repair | projection/no-write/dependency suites；DDD-006/007 影响 helper lane |
| PH-07 | 消费和运维 continuation 的有限闭环 | committed fact/resolution、receipt/report contracts | 14 pre-gates、5 finite Job、exact replay/partial report | arbitrary Store scan、source truth repair、event materialization | entry/job/replay suites；DDD-003~005 affected lanes blocked |
| PH-08 | 可审查的 release/evidence 生成路径 | all prior reports、fixed run and baseline | raw/report pairing、evidence index、VETO/handoff drafts | 当前 verdict/signoff/readiness | only real-run outputs can later qualify; now not_run |

### 7.4 Phase 停审记录

| Phase | 审查项 | 设计层结论 | 执行期缺口 / 处理 |
|---|---|---|---|
| PH-01 | 是否只做 foundation | 通过 | target repo、baseline、Core compatibility 仍阻塞开工 |
| PH-02 | 是否形成独立 CP01 增量 | 通过 | UP-001/006 只允许 local/blocked lane |
| PH-03 | 是否隔离 raw body 与 policy truth | 通过 | UP-007、scope successor gap 保持 blocked |
| PH-04 | 是否把 Runtime 当外部 owner | 通过 | UP-003/004 正向 mapping 未闭合 |
| PH-05 | 是否把 delivery/observed 当 local success | 通过 | UP-004/005 及 material helper 需 owner/design closure |
| PH-06 | Query 是否 no-write、projection 是否不修 source | 通过 | DDD-006/007 helper/version 缺口需回写 |
| PH-07 | Consumer/Job 是否只消费 committed fact | 通过 | DDD-003~005 receipt/attempt/gap 缺口阻塞正向 lane |
| PH-08 | evidence 是否由真实 artifact 推导 | 通过 | 当前无 run/artifact/report，不能填写 pass |

### 7.5 跨 phase 依赖闭环审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| foundation 先于业务代码 | 通过 | PH-01 仍受目标仓与 baseline blocker |
| local truth 先于 read/continuation | 通过 | CP01～CP06 source fact 顺序固定 |
| Query 不反向驱动写入 | 通过 | Step 7 需逐 boundary 加 write-spy gate |
| Consumer/Job 不读取未提交 truth | 通过 | receipt/report 缺口按 DDD blocker 处理 |
| 24 candidate 未被任何 phase 物化 | 通过 | dependency-boundary 每阶段保留 non-materialization check |
| external dependencies 分类正确 | 通过 | 只有 Core contracts 是 planned compile candidate |
| phase 不依赖后续 evidence | 通过 | PH-08 才生成 release evidence；前置只定义路径 |
| P1/P2 不污染 P0 | 通过 | selected-run、physical product、SLO 和 non-project subject 后置 |

## 8. 回填草稿

正式 §5 应采用上述 PH-01～PH-08 顺序：先建立 composition skeleton，再依次落实 CP01 在场、CP02 入站、CP03 Runtime 受控投递、CP04/CP05 出站与追溯、CP06/CP07 镜像与派生读取、Consumer/Job continuation，最后生成 release evidence/handoff 路径。每个 phase 以能力增量、依赖、输出、门禁和不包含项定义；不按对象或文件裸拆。所有 phase 的外部 positive seam 继续使用 blocked/waiting/unknown，24 个 semantic candidate 只接受 zero-configuration/non-materialization 检查。

## 9. 待确认事项

| 事项 | 影响 | 截止 / 处理 |
|---|---|---|
| target implementation repo 与 immutable design baseline | PH-01 及全部后续 phase | PH-01 开工前；缺失则 blocked/wait_design |
| Core contracts 实际 API/版本兼容 | PH-01 contracts | PH-01 commit boundary 前；不能建立 shadow contract |
| DDD-003~007、scope_supersede_gap | PH-03、PH-05～PH-07 affected lane | 对应 boundary 前回写 owning Step；未闭合不得实现 |
| owner exact contract（host/Runtime/Bus/credential/screening/image/subject） | P1 positive lane | selected-run 前；P0 只保留 negative/blocked |
| workload/SLO authority | PH-08 后的性能结论 | 独立 spike；当前不写数字 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 阶段依赖图 | 通过 | PH-01～PH-08 已形成 DAG |
| 每 phase 可验证增量 | 通过 | 均有输入、输出、不包含和验证姿态 |
| phase 停审 | 通过（设计层） | 执行期需重新跑对应 gate |
| 跨 phase 审计 | 通过（显式 blocker） | UP/DDD/baseline blocker 未弱化 |
| 可进入 Step 6 | 通过 | 下一步只拆 task、batch 和 commit boundary，不改变 phase 顺序 |
