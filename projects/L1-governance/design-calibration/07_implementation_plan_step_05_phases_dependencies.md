# Step 5. 设计实施阶段与依赖顺序

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 5
> 回填章节: `07-实施计划.md` §5 实施阶段与依赖顺序

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 5 设计实施阶段与依赖顺序 |
| 当前状态 | 已完成;自动继续后续 Step |
| 输入基线 | Step 4 交付物清单;`03-详细设计.md`;`05-测试方案.md`;`06-验收标准.md` |
| 输出文件 | `projects/L1-governance/design-calibration/07_implementation_plan_step_05_phases_dependencies.md` |
| 停审方式 | 用户已要求自动执行后续 Step;本 Step 完成后直接进入 Step 6 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 4 交付物清单 | 已完成 | 确定代码、测试、配置、脚本、证据交付物 |
| `03-详细设计.md` §4~§16 | 已存在 | 确定模块依赖、protocol、flow、state、persistence、job、observability |
| `05-测试方案.md` §9 / §13 | 已存在 | 确定 suite、artifact、report 和 evidence 阶段门禁 |
| `06-验收标准.md` §5~§14 | 已存在 | 确定 AC / VETO / final decision 的阶段约束 |

## 3. SOP 问题回答

1. 最小可运行或可测试的纵切是什么。

   回答: 最小纵切是从 workspace / contracts / domain 到 application service / in-memory repository / minimal handler 的 Governance context + input accepted command 主链,并能证明 idempotency、UoW、trace / outbox / stored result 和 body-free ref boundary。它依赖 PH-01 skeleton,在 PH-02 形成。

2. 哪些阶段必须先于其他阶段。

   回答: PH-01 必须先创建仓、workspace、dependency、config 和 scripts。Command/domain/service 主链必须早于 query、consumer、outbox publisher 和 operations jobs。Query / projection 要在 core truth 稳定后做。Consumer / outbox / jobs 要在协议和 truth / projection 基础形成后做。Release evidence 最后做。

3. 哪些风险或跨仓依赖需要前置。

   回答: 目标实现仓不存在、core-contracts path dependency、目录命名、artifact/report roots、config profile 和 script shell 必须前置到 PH-01。identity/process/work/method/artifact/conversation/runtime/external GRC 真实依赖不作为 P0 前置,只在对应 consumer / job phase 使用 fake / controlled / disabled seam。

4. 每个阶段完成后能验证什么。

   回答: PH-01 验证 workspace 和证据骨架;PH-02 验证治理语境和输入 accepted flow;PH-03 验证 Gate / Decision / Approval;PH-04 验证 Policy / Control / Compliance / Nonconformity;PH-05 验证 Query / Projection / Trace;PH-06 验证 Consumer / Outbox / Publisher;PH-07 验证 Operations Jobs;PH-08 验证 release gate、reports、VETO 和 acceptance handoff。

5. 是否存在按对象拆分而不可验证的阶段。

   回答: 不按单纯对象拆分。阶段围绕可验证能力和协议纵切组织。对象、crate、文件只作为落点,不作为阶段主轴。

6. 哪些阶段可以并行，哪些不能并行。

   回答: 主链 PH-01~PH-08 原则上串行。测试 fixture、redaction checker、report script shell 可从 PH-01 后随阶段增量完善,但不能替代业务阶段门禁。真实 P1 selected-run 可在 P0 完成后并行探索,不进入 P0 phase。

7. 每个 phase 是否有明确的功能增量、输入、输出、测试门禁和验收门禁。

   回答: 本 Step 的阶段总表和可验证增量说明为每个 phase 给出这些内容。Step 7 会进一步把测试与验收门禁展开到 commit boundary。

8. 每个 phase 是否包含只能由后续 phase 提供的对象、协议、flow、状态或证据。

   回答: 阶段设计避免后续依赖前置。PH-02~PH-04 可预留后续对象 ref 或 enum variant,但不能让测试要求后续 phase 的 service / job / publisher。PH-06 不要求 operations job;PH-07 不新增 business truth;PH-08 不新增功能。

9. 每个 phase 完成后是否通过停审。

   回答: 本 Step 记录 phase 停审表,结论为设计层通过;实际执行期需按 Step 7 / Step 12 的门禁重复验证。

10. 所有 phase 完成后,依赖顺序、风险前置、外部依赖和验收覆盖是否通过跨 phase 审计。

   回答: 当前设计层审计通过。目标实现仓和 baseline 未固定仍是 PH-01 / 实现移交前 blocker,不是 phase 顺序冲突。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| `07-实施计划.md` | 尚无 phase 顺序 | Step 6 无法拆 commit boundary | 本 Step 建立 PH-01~PH-08 |
| `03` 协议 / flow | 协议族很多 | 若按 crate 横切会导致不可验证 | 按业务纵切和运维纵切拆 phase |
| `05` suite | suite 横跨多个代码层 | 需要映射到 phase | 本 Step 初步绑定阶段门禁 |
| `06` AC / VETO | 验收项覆盖全链路 | 需要 phase 逐步规避 VETO | 本 Step 保证红线从 PH-01 起进入门禁 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 阶段组织 | 无实施阶段 | PH-01~PH-08 按可验证能力推进 | 让后续提交边界可审查 |
| 阶段主轴 | 容易按 crate / 对象拆 | 按 command truth、decision、policy/compliance、query、events/jobs、release evidence 拆 | 防止对象清单式阶段 |
| 外部依赖 | 可能被提前做成真实 adapter | P0 使用 fake / controlled / disabled seam | 避免 P1/P2 阻塞 P0 |
| release evidence | 可能最后手工补 | 单独 PH-08 收口 | 避免静态 evidence / VETO passed |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按 `contracts/domain/application/infra` 横向拆 phase | 与 crate 对齐 | 每个 phase 不可独立验收业务能力 | 不采用 |
| 按 Governance 业务纵切拆 phase | 每阶段有功能增量和门禁 | commit boundary 需要更细 | 采用 |
| 把 consumers/outbox/jobs 合并到业务 command phase | 早集成 | outbox/job surface 大,容易拖慢 command 主链 | 不采用 |
| 独立 release evidence phase | 能专门处理 report / VETO / handoff | 最后才完整验收 | 采用 |

## 7. 结构化中间产物

### 7.1 阶段依赖图

```text
[PH-01 仓初始化、配置与证据骨架]
  | enables
  v
[PH-02 Governance context / input 最小 accepted 纵切]
  | depends_on
  v
[PH-03 Gate / Decision / Approval 正式裁决纵切]
  | depends_on
  v
[PH-04 Policy / Control / Compliance / Nonconformity 治理事实纵切]
  | depends_on
  v
[PH-05 Authorized Query / Projection / Trace 消费追溯]
  | depends_on
  v
[PH-06 Inbound / Outbound Event 与 Publisher]
  | depends_on
  v
[PH-07 Operations Jobs / Reconciliation / Handoff / Export]
  | depends_on
  v
[PH-08 Release Gate / Reports / Acceptance Handoff]
```

### 7.2 阶段总表

| 阶段编号 | 阶段名称 | 实施目标 | 依赖阶段 | 核心交付物 | 阶段门禁 |
|---|---|---|---|---|---|
| PH-01 | 仓初始化、配置与证据骨架 | 创建目标仓、workspace、core dependency、config skeleton、script / artifact / report roots | 无 | 七 crate skeleton、config shell、gate/report/check script shell | `cargo check`;script `--help`;dependency/path checks |
| PH-02 | Governance context / input 最小 accepted 纵切 | 建立治理语境和治理输入主链,证明 accepted mutation 基本事务语义 | PH-01 | context / input contracts、domain、service、repo fake、minimal handler | contract-domain-fast slice;service-flow-fast slice |
| PH-03 | Gate / Decision / Approval 正式裁决纵切 | 建立正式裁决、责任、投票、委派和 supersede 主链 | PH-02 | gate / decision / approval DTO、domain、service、handler | command/state/idempotency tests;AC-GOV-002/008 |
| PH-04 | Policy / Control / Compliance / Nonconformity 治理事实纵切 | 建立 Policy、shared rules、Control、AIIA / SoA、Nonconformity 事实闭环 | PH-03 | policy / control / compliance / NC contracts、domain、service、fixtures | contract-domain-fast;service-flow-fast;redaction targeted |
| PH-05 | Authorized Query / Projection / Trace 消费追溯 | 建立 14 Query、read views、projection state、trace page 和 no-write query surface | PH-04 | query DTO、view DTO、projection store、trace read、API query handlers | query no-write;projection / visibility tests |
| PH-06 | Inbound / Outbound Event 与 Publisher | 建立 9 Consumer、12 Outbound Event、outbox payload snapshot、publisher retry / failed marker | PH-05 | event DTO、consumer services、outbox store、publisher worker、topic map | consumer tests;outbox publisher tests;redaction |
| PH-07 | Operations Jobs / Reconciliation / Handoff / Export | 建立 7 Job runner、report、duplicate replay、partial failure、handoff / export seam | PH-06 | jobs DTO、application job services、jobs crate、fake adapters | operations-replay-core;job no truth repair tests |
| PH-08 | Release Gate / Reports / Acceptance Handoff | 生成固定 run 的 release evidence、report、VETO 和 handoff 材料 | PH-07 | release gate、evidence index、redaction/dependency/report audit、acceptance handoff | release-main-smoke;report-generation-audit;VETO checklist |

### 7.3 Phase 可验证增量说明

| Phase | 功能增量 | 输入 | 输出 | 不包含 | 验证方式 |
|---|---|---|---|---|---|
| PH-01 | 从无目标仓到可编译 workspace 和可运行脚本壳 | Step 3;`03` §4;`04` profile;`05` script path | workspace skeleton、config skeleton、script shell、path roots | 业务 DTO / domain / service | `cargo check`;script `--help`;dependency boundary |
| PH-02 | 治理语境和输入 accepted flow 最小纵切 | `03` context/input object / protocol / flow | context/input command contracts、domain、service、repo fake、minimal handler | Gate / Decision / Policy / Query / Event / Job | contract/domain/service tests |
| PH-03 | 关键节点正式裁决主链 | PH-02;`03` Gate / Decision / Approval | Gate / Decision / Approval contracts、domain、service、handler | Policy / Control / Compliance / NC | command/state/idempotency tests |
| PH-04 | 治理策略、控制、合规和纠正事实 | PH-03;`03` Policy / Control / Compliance / NC | policy、shared rules、control、AIIA/SoA、NC domain and services | Query / Consumer / Outbox / Job | domain/service/redaction tests |
| PH-05 | 授权查询、投影、追溯和 read model | PH-04;`03` query / projection / trace | query/view DTO、projection store、trace read、query handlers | inbound consumer / outbound publish / operations jobs | query/no-write/visibility tests |
| PH-06 | 外部事件消费和出站事件发布 | PH-05;`03` consumer / outbox / event | consumer receipt、snapshot、outbox payload snapshot、publisher loop | operations jobs beyond publish loop | consumer/outbox/publisher tests |
| PH-07 | 运维 job、对账、handoff、external export | PH-06;`03` job / report / handoff / export | 7 operations jobs、job reports、duplicate replay、partial failure | final release evidence conclusion | operations-replay-core tests |
| PH-08 | release evidence and acceptance handoff | PH-07;`05` release gates;`06` acceptance | reports/runs、evidence index、redaction/dependency/report audit、acceptance handoff | 新业务功能 / production adapter | release gate and report audit |

### 7.4 Phase 停审记录

| Phase | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| PH-01 | 是否形成可编译 workspace、稳定命名、core path dependency 和脚本 / 证据根目录 | 通过 | 目标实现仓当前不存在,作为 PH-01 开工前 blocker,不影响 phase 顺序 |
| PH-01 | 是否提前引入业务 DTO、domain 或 fake 业务语义 | 通过 | 本 phase 只做 skeleton / config / script shell |
| PH-02 | 是否形成最小 accepted command 纵切 | 通过 | 只覆盖 Governance context / input,不提前做裁决和 policy |
| PH-02 | 是否具备独立测试门禁 | 通过 | contract-domain-fast 和 service-flow-fast 可针对 context / input 子集运行 |
| PH-03 | 是否覆盖正式裁决链路且不越界到 policy/compliance | 通过 | Gate / Decision / Approval 作为同一裁决纵切,Policy 留给 PH-04 |
| PH-03 | 是否依赖后续 query / outbox / job 才可验证 | 通过 | 通过 command result、state、idempotency 和 trace/outbox record 结构验证,不依赖 publisher |
| PH-04 | 是否覆盖 policy/control/compliance/NC 的治理事实闭环 | 通过 | Query / consumer / job 不进入本 phase |
| PH-04 | 是否仍可通过局部门禁验证 | 通过 | 通过 domain/service/redaction targeted tests 验证 |
| PH-05 | 是否只做 authorized read surface,不修复 truth | 通过 | query no-write 作为阶段门禁 |
| PH-05 | 是否需要已有业务 truth 支撑投影和 trace | 通过 | 依赖 PH-02~PH-04 的 committed truth |
| PH-06 | 是否把 inbound consumer 与 outbound publisher 拆在 query 之后 | 通过 | 需要 PH-05 的 projection identity 和 stale marker 口径 |
| PH-06 | 是否提前做 operations job | 通过 | publish loop 属于 outbox publisher;operations job 留给 PH-07 |
| PH-07 | 是否只做 operation marker / report / handoff,不新增业务 truth | 通过 | job 不修复核心 truth,只按 Step 9 flow 写 report/marker |
| PH-07 | 是否具备 duplicate / partial failure / no truth repair 门禁 | 通过 | operations-replay-core 覆盖 |
| PH-08 | 是否只做 release evidence and handoff,不新增功能 | 通过 | release-main-smoke/report audit/VETO checklist 作为最终收口 |

### 7.5 跨 phase 依赖闭环审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 阶段顺序是否由依赖驱动 | 通过 | workspace -> command truth -> decision -> policy/compliance -> query -> event -> jobs -> release evidence |
| 是否存在按对象裸拆 phase | 通过 | 每个 phase 都有业务或运维能力增量和门禁 |
| 是否存在只能由后续 phase 提供的必需输入 | 通过 | 后续对象可预留 ref,但不可作为当前 phase 测试通过条件 |
| 外部依赖是否前置降级 | 通过 | identity/process/work/method/artifact/conversation/runtime/external GRC 均走 fake / controlled / disabled seam |
| 验收门禁是否最后才出现 | 通过 | PH-01 起引入路径、脚本、redaction、dependency boundary;PH-08 汇总最终证据 |
| release evidence 是否可能静态伪造 | 通过 | PH-08 明确 report 由 suite artifact / selected reports 推导,不默认 VETO passed |
| 目标实现仓不存在是否影响阶段顺序 | 通过但有前置 blocker | PH-01 开工前必须创建或确认 `/home/aris/Projects/quantalithos-governance` |
| 是否需要正式 production adapter | 通过 | P0 不要求 real DB / bus / search / object storage / external GRC product |
| 是否给 Step 6 commit boundary 留出足够粒度 | 通过 | PH-02~PH-07 均可继续拆成 contracts/domain、service/handler、entry/job/publisher 等 boundary |

## 8. 回填草稿

以下内容回填到正式 `07-实施计划.md` §5,Step 13 装配时可按正式章节语气精简,但不得改变 phase 顺序和边界。

### 5.1 阶段依赖顺序

Governance 实施按可验证功能增量拆为八个 phase:

```text
[PH-01 仓初始化、配置与证据骨架]
  -> [PH-02 Governance context / input 最小 accepted 纵切]
  -> [PH-03 Gate / Decision / Approval 正式裁决纵切]
  -> [PH-04 Policy / Control / Compliance / Nonconformity 治理事实纵切]
  -> [PH-05 Authorized Query / Projection / Trace 消费追溯]
  -> [PH-06 Inbound / Outbound Event 与 Publisher]
  -> [PH-07 Operations Jobs / Reconciliation / Handoff / Export]
  -> [PH-08 Release Gate / Reports / Acceptance Handoff]
```

阶段顺序遵循三条原则:

1. 先建立仓、命名、依赖、配置、脚本和证据路径,再进入业务代码。
2. 先建立可写 truth 和 accepted command 纵切,再建立 read model、consumer、publisher 和 operations jobs。
3. release evidence 只汇总已产生的 suite artifact、report、VETO 和 handoff 材料,不得在最后新增业务功能或静态伪造通过结论。

### 5.2 Phase 表

| 阶段编号 | 阶段名称 | 实施目标 | 依赖阶段 | 核心交付物 | 阶段门禁 |
|---|---|---|---|---|---|
| PH-01 | 仓初始化、配置与证据骨架 | 创建目标仓、workspace、core dependency、config skeleton、script / artifact / report roots | 无 | 七 crate skeleton、config shell、gate/report/check script shell | `cargo check`;script `--help`;dependency/path checks |
| PH-02 | Governance context / input 最小 accepted 纵切 | 建立治理语境和治理输入主链,证明 accepted mutation 基本事务语义 | PH-01 | context / input contracts、domain、service、repo fake、minimal handler | contract-domain-fast slice;service-flow-fast slice |
| PH-03 | Gate / Decision / Approval 正式裁决纵切 | 建立正式裁决、责任、投票、委派和 supersede 主链 | PH-02 | gate / decision / approval DTO、domain、service、handler | command/state/idempotency tests;AC-GOV-002/008 |
| PH-04 | Policy / Control / Compliance / Nonconformity 治理事实纵切 | 建立 Policy、shared rules、Control、AIIA / SoA、Nonconformity 事实闭环 | PH-03 | policy / control / compliance / NC contracts、domain、service、fixtures | contract-domain-fast;service-flow-fast;redaction targeted |
| PH-05 | Authorized Query / Projection / Trace 消费追溯 | 建立 14 Query、read views、projection state、trace page 和 no-write query surface | PH-04 | query DTO、view DTO、projection store、trace read、API query handlers | query no-write;projection / visibility tests |
| PH-06 | Inbound / Outbound Event 与 Publisher | 建立 9 Consumer、12 Outbound Event、outbox payload snapshot、publisher retry / failed marker | PH-05 | event DTO、consumer services、outbox store、publisher worker、topic map | consumer tests;outbox publisher tests;redaction |
| PH-07 | Operations Jobs / Reconciliation / Handoff / Export | 建立 7 Job runner、report、duplicate replay、partial failure、handoff / export seam | PH-06 | jobs DTO、application job services、jobs crate、fake adapters | operations-replay-core;job no truth repair tests |
| PH-08 | Release Gate / Reports / Acceptance Handoff | 生成固定 run 的 release evidence、report、VETO 和 handoff 材料 | PH-07 | release gate、evidence index、redaction/dependency/report audit、acceptance handoff | release-main-smoke;report-generation-audit;VETO checklist |

### 5.3 Phase 停审要求

每个 phase 完成时必须停审四项:

1. 是否形成可验证功能增量,而不是对象或文件清单。
2. 是否依赖后续 phase 的对象、协议、flow、状态或证据。
3. 阶段门禁是否可以在当前代码状态下执行。
4. 是否存在需要回写 `03/05/06/07` 的设计闭环缺口。

如果停审发现字段、DTO、状态、ref identity、version、outbox source、job report、projection stale、visibility marker 或 evidence source 缺口,实现不得继续补 schema,必须回写设计并固定新 baseline。

## 9. 待确认事项

| 事项 | 当前结论 | 处理位置 |
|---|---|---|
| 目标实现仓不存在 | 不能移交实现;PH-01 开工前必须创建或确认 | Step 8 / 正式 §8 |
| Phase commit boundary 粒度 | 尚未展开 | Step 6 |
| 各 phase 的 suite / AC / VETO 精确映射 | 尚未展开 | Step 7 |
| P1 selected-run / production-like adapter | 不进入 P0 phase | Step 9 风险记录 |
| release evidence 防静态伪造 | PH-08 要求从真实 suite artifact / report 推导 | Step 7 / Step 12 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 阶段依赖图已输出 | 通过 | PH-01~PH-08 串行推进 |
| 阶段总表已输出 | 通过 | 每阶段包含目标、依赖、交付物和门禁 |
| 每个 phase 有可验证增量说明 | 通过 | 已说明输入、输出、不包含和验证方式 |
| 每个 phase 已完成停审 | 通过 | 当前为设计层停审,执行期需重复验证 |
| 跨 phase 审计无 unresolved 冲突 | 通过 | 目标仓不存在记录为 PH-01 前置 blocker |
| 可进入 Step 6 | 通过 | 下一步拆分阶段任务、编写顺序与提交边界 |
