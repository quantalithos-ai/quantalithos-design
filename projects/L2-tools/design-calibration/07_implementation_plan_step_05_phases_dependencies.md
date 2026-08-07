# L2-tools 07 实施计划 Step 5：设计实施阶段与依赖顺序

## Step 状态

`accepted`

## 本步输入

| 输入 | 来源 | 用途 |
|---|---|---|
| 可判定交付物 | Step 4 | 按可验证增量归组，不按文件裸拆。 |
| 模块/flow/state 依赖 | `03-详细设计.md` §4~§13 | 判断 foundation、业务纵切、entry 和 job 顺序。 |
| 测试/验收门禁 | `05` §3/§6/§9；`06` §5~§10 | 为每个 phase 配置 selector 和 fail 条件。 |
| 上游 blocker | Step 1、`L2T-UP-001~009` | 把 external positive 与本地路径隔离。 |

## SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 最小可测试纵切是什么？ | workspace -> shared foundation -> 单一能力 contract/domain/service/Store/fake/entry/test；不以对象或文件为 phase。 | SOP Step 5、03 §16。 |
| 哪些阶段必须先行？ | PH-01 工程骨架、PH-02 contracts/domain/application foundation 必须先于业务纵切；entry/jobs 依赖已闭合业务 surface；release tooling 最后聚合。 | 03 §4~§8、05 pipeline。 |
| 哪些风险要前置？ | repo/baseline/Core path、strict config roots、public carrier/state/UoW/idempotency、blocked adapter 语义。 | 03 §16.3、04、05 entry。 |
| 哪些可并行？ | 设计上 PH-03~07 有局部独立性，但实现默认串行；PH-08/09 共享前置，仍按 08 -> 09 以减少 read/report surface 漂移。 | phase boundary discipline。 |
| 如何避免后续 phase 依赖？ | 每 phase 明确“不包含”，只消费已存在的 contract/Port/Store；future surface 只能 reserved 且当前不调用。 | 可落码标准 §9.2。 |

## 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 单纯按六业务组成部分不足以覆盖 entry/config/evidence | 最后阶段会堆成大包 | 增加 PH-08~11 独立纵切。 |
| Query 与 integrity/job 相互依赖 | Query 可能偷偷 rebuild | PH-07 先提供 read-only derived surface，PH-09 再实现 bounded maintenance。 |
| External handoff 与 outcome 很紧密 | 可能把 delivery truth 合入 outcome | PH-06 只形成 local material/attempt；PH-08 承载 IF/OF continuation，仍不拥有 delivery。 |
| Config/runtime composition 过大 | 单提交不可审查 | PH-10 内拆两个 commit boundary，Step 6 固定。 |

## 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 实施阶段 | 初稿 11 phase/25 boundary | 11 phase/26 boundary | PH-10 两个独立可验证增量。 |
| Query | 可能集中最后实现 | 随 owner slice 建最小 Query，PH-07 完成全量 read/derived | 测试前置且避免 mutation 驱动 Query。 |
| External seams | 与 core path 同阶段 | blocked-aware seam 随业务闭合，entry continuation PH-08 | 不伪造 owner readiness。 |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 7 个 module phase | 文件组织简单 | 不可验证、测试后置 | 不采用。 |
| 6 个业务组 phase | 语义清楚 | foundation/entry/config/release 缺位置 | 扩展为 11 phase。 |
| 11 个纵切 phase | 每阶段有可测输出和禁止范围 | 依赖/门禁表较长 | 采用。 |

## 结构化中间产物

### 阶段依赖图：L2-tools 实施顺序

```text
[PH-01 Workspace / tooling baseline]
                  |
                  v
[PH-02 Contract / domain / application foundation]
                  |
                  v
[PH-03 Tool identity / definition / evolution]
                  |
                  v
[PH-04 Capability binding / controlled source]
                  |
                  v
[PH-05 Invocation / admission / precondition / Sandbox handoff]
                  |
                  v
[PH-06 Outcome / audit / safe handoff]
                  |
                  v
[PH-07 Query / integrity / derived projections]
                  |
          +-------+-------+
          v               v
[PH-08 Inbound /     [PH-09 Bounded jobs /
 outbound seams]      refresh / rebuild]
          +-------+-------+
                  v
[PH-10 Runtime composition / strict config activation]
                  |
                  v
[PH-11 Full test / evidence / acceptance handoff]
```

关键说明：

- 图表示实施前置顺序，不是 runtime 调用链；实现默认串行。
- PH-05/06 的 external Port 只实现 local/blocked-aware 合同，不能把 Sandbox/Bus/Obs positive truth 写成前置已满足。
- PH-08 与 PH-09 可在共享 PH-07 baseline 后设计上并行，但默认按 08 -> 09 以固定 receipt/status source 后再做 refresh job。
- PH-11 生成工具和真实执行能力；设计阶段不生成任何 run/evidence/verdict。

### 阶段总表

| Phase | 名称 | 实施目标 | 依赖 | 核心交付物 | 阶段门禁 |
|---|---|---|---|---|---|
| PH-01 | Workspace / Tooling Baseline | 建立七 member、唯一 compile dependency、strict config/script/artifact roots | 无；repo/baseline preflight | manifests、source skeleton、scripts/schema roots | fmt/check、dependency/name/Rustdoc/path dry-run |
| PH-02 | Contract / Domain / Application Foundation | 建立 typed refs/errors/carriers、六状态族、Store/Port/UoW/idempotency/fake foundation | PH-01 | shared contracts/domain policies/application primitives | FOUNDATION/STATE/TX/CONC seeds |
| PH-03 | Tool Identity / Definition / Evolution | 完成 CF-01~04 与 QF-01~02 的 accepted/history/read 纵切 | PH-02 | contract/evolution objects、Store/service/API/tests | CONTRACT、STATE、TX、AC-006~008 |
| PH-04 | Capability Binding / Controlled Source | 完成 CF-05~07、QF-03 的 relation/snapshot/assessment/gap 纵切 | PH-03 | binding domain/service/Store/Hub blocked adapter/tests | BIND、QUERY-003、AC-009~011 |
| PH-05 | Invocation / Admission / Precondition / Sandbox Handoff | 完成 CF-08~10、QF-04~05 的 canonical invocation、fail-closed 和 Prepared fence | PH-04 | invocation/precondition services、Auth/Sandbox seams、attempts | INV/PRE/TX/CONC、AC-012~018 |
| PH-06 | Outcome / Audit / Safe Handoff | 完成 CF-11~13、QF-06、safe material 与 local submission foundation | PH-05 | atomic pair、source assessment、gap/material/attempt | OUTCOME/HANDOFF/OBS、AC-019~022 |
| PH-07 | Query / Integrity / Derived Projection | 完成 QF-07~11、全量 Query no-write 和 derived read material | PH-06 | projection/read ports、reports/views/API query surface | QUERY/CONC/watermark/no-write、AC-023~025/031 |
| PH-08 | Inbound / Outbound Collaboration | 完成 IF-01~05、OF-01~04 的 claim/receipt/re-entry/continuation | PH-07 | worker intake、stored receipt、event mapper、feedback refs | CONSUMER/CONT/phase/redaction |
| PH-09 | Bounded Jobs / Reference and Status Refresh | 完成 JF-01~04 的 bounded target、projection/status refresh 和 stored JobReport | PH-08 | job public surface、runners、reports/replay | JOB/CONC/job-boundedness/no-repair |
| PH-10 | Runtime Composition / Config Activation | 完成 54-item strict config validation、builder 和七入口 controlled composition | PH-09 | config loader/validator/builder、adapter registry、entry wiring | CFG-T/A/F/X、profile/dependency isolation |
| PH-11 | Full Test / Evidence / Acceptance Handoff | 实现 234 TC、11 suite+smoke、11 check、30 slot builders 和 review-required handoff | PH-10 | gate/report/check scripts、raw/report schemas、handoff drafts | release seal/evidence/VF checks；无自动 verdict |

### 每个 Phase 可验证增量说明

| Phase | 功能增量 | 输入 | 输出 | 不包含 | 验证方式 |
|---|---|---|---|---|---|
| PH-01 | 从无实现事实到可预检工程骨架 | 03 layout、04/05 roots | 七 member、脚本/路径 schema | 业务 DTO、真实 run | static/path/dependency checks |
| PH-02 | 可构造、可测试的共同 contract/state/transaction 底座 | PH-01、03 §5~§13 | carrier/state/Port/UoW/fake | 具体 CF/QF | unit/contract/TX seeds |
| PH-03 | Tool contract 首个 accepted truth/history/read 闭环 | PH-02、CF-01~04/QF-01~02 | identity/definition/evolution service | Binding/Invocation | CONTRACT/STATE/TX/no-write |
| PH-04 | relation/snapshot/assessment 可追踪且 Hub 缺口 fail-closed | PH-03、CF-05~07/QF-03 | binding slice、blocked adapter | Hub registry mutation | BIND/QUERY/replay/CAS |
| PH-05 | invocation 到 Sandbox handoff local intent 可判定 | PH-04、CF-08~10 | canonical invocation、requirement、attempt | Sandbox run/receipt/host fallback | INV/PRE/phase/unknown |
| PH-06 | terminal local truth 与 safe handoff material 不可拆且 body-free | PH-05、CF-11~13/QF-06 | outcome/audit pair、eligibility/material/attempt | delivered/observed | OUTCOME/HANDOFF/OBS/pair |
| PH-07 | 所有 read/derived surfaces 可查询而不改 truth | PH-06、QF-01~11 | projection/report/diff/diagnostic/guidance | rebuild/repair in Query | query-purity/watermark |
| PH-08 | 外部线索/状态可消费、事件可续接而不接管 owner truth | PH-07、IF/OF | receipt/feedback/continuation | broker ack/DLQ/delivery lifecycle | CONSUMER/CONT/replay |
| PH-09 | maintenance slice 可有界、可重放、不修核心 truth | PH-08、JF | target plan/report/projection/status refresh | scheduler/lease/full scan | JOB/bounded/no-repair |
| PH-10 | 配置可 strict activation，七入口可用 controlled adapter 装配 | PH-09、04 | runtime graph/profile/entry wiring | production provider readiness | CFG/config/profile gates |
| PH-11 | 真实执行期可生成同 run raw/report/seal/handoff 输入 | PH-10、05/06 | scripts/builders/checks/review drafts | static pass/final verdict/signoff | full denominator/release audit |

### Phase 停审记录

| Phase | 可验证性 | 依赖/边界审查 | 缺口/修正 | 结论 |
|---|---|---|---|---|
| PH-01 | 工程和路径可静态检查 | repo/baseline 仅在实现期验证 | 无 | `pass-designed` |
| PH-02 | shared contract/state/TX 可单测 | 不提前调用业务 service | 无 | `pass-designed` |
| PH-03 | accepted contract/history/read 纵切 | 只依赖 PH-02 | QF-01~02 与 mutation 同阶段以形成可读结果 | `pass-designed` |
| PH-04 | binding local/negative 闭环 | Hub positive conditional | 明确 no registry truth | `pass-designed` |
| PH-05 | invocation/precondition/attempt 可验证 | Sandbox/Auth positive blocked-aware | Prepared/unknown 单独门禁 | `pass-designed` |
| PH-06 | pair/material/attempt 本地闭环 | 不依赖 delivered/observed | CF-13 只写 gap/integrity，不修 truth | `pass-designed` |
| PH-07 | Query 全量 no-write | rebuild 延迟到 PH-09 | 无 | `pass-designed` |
| PH-08 | IF/OF claim/continuation 可测 | 不拥有 ack/route/delivery | IF-03 只重入正式 CF-11 | `pass-designed` |
| PH-09 | bounded jobs/replay 可测 | 只消费已闭合 Store/Port | 无 full scan/repair | `pass-designed` |
| PH-10 | config/builder/composition 可测 | external positive 不成为 activation success | 拆两个 boundary | `pass-designed` |
| PH-11 | scripts/schema/builders 可静态和真实运行验证 | final verdict仍归06流程/授权角色 | 无伪造 evidence | `pass-designed` |

### 跨 Phase 依赖闭环审计

| 审计项 | 结论 | 缺口/修正 |
|---|---|---|
| foundation first | pass | PH-01/02 覆盖路径、schema、state、Port/UoW/replay。 |
| vertical slices | pass | PH-03~06 各自带 contract/domain/service/Store/fake/entry/test。 |
| Query purity | pass | mutation slice 提供最小 reads，PH-07 完成全量；所有 Query 禁止 refresh。 |
| phase side-effect fence | pass | PH-05/06/08 显式 Prepared/one-call/unknown/no retry。 |
| external dependencies | pass | positive seam conditional；local/negative 不被阻塞。 |
| jobs | pass | PH-09 只消费已闭合 read/write surfaces，不修核心 truth。 |
| config/composition | pass | PH-10 后置于所有 surface，避免 builder 反向决定 schema。 |
| evidence | pass | PH-11 最后生成 tooling；planned paths 不充当 evidence。 |
| acceptance coverage | pass | 39 AC/13 VF/24 EG 由 Step 7 精确映射。 |
| phase boundary leakage | pass | 无 phase 调用后续 phase 专有对象；future surface 仅 reserved/uninvoked。 |

## 回填草稿

正式 07 §5 使用本阶段图、阶段总表、增量说明和审计结论；强调 phase 是实施顺序而非 runtime 调用链，且 external positive closure 不阻塞 local/negative 实施。

## 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| PH-08/09 是否并行 | 实现排程 | 默认串行；只有独立 worktree/ledger 且不共享 surface 时重新评审。 |
| durable backend 是否进入 PH-02/10 | adapter parity | 产品/能力未确认时只做 trait/fake/blocked adapter。 |

## 进入下一步条件

- [x] 11 个 phase 以可验证增量定义。
- [x] 每个 phase 有输入、输出、不包含和门禁。
- [x] 逐 phase 停审与跨 phase 审计无 unresolved conflict。
