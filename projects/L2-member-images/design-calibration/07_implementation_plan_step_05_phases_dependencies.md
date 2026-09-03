# 07 Step 5：设计实施阶段与依赖顺序

## Step 状态

`completed_with_explicit_blockers`

## 本步输入

| 输入 | 来源 | 目的 |
|---|---|---|
| 实施对象与交付物 | `07_implementation_plan_step_04_objects_deliverables.md` | 按可验证增量组织 Phase |
| 模块依赖 | `03-详细设计.md` §4~§5 | 固定 contracts → domain → application → infra/entry 方向 |
| 协议/flow/state | `03-详细设计.md` §7~§12 | 识别阶段前置和高风险隔离 |
| 配置/测试/验收 | `04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md` | 为每 Phase 绑定 gate 与停止条件 |
| blocker | `03` §17、`05` §14、`06` §13 | 限定正向 lane，不改写 owner |

## SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 最小可验证纵切是什么 | 从 typed contract/domain guard 开始，逐步加入 local flow、strict config、read-only query、marker-only inbound、bounded jobs 和报告工具；当前 write flow 以 zero-effect 为止点 | 03 §7~§9、05 §6/§9 |
| 哪些阶段必须先做 | Foundation/contract → definition/assembly → build classification → qualification gap → supply/entry → reference/query → inbound/jobs → evidence tooling | capability dependency 与 owner 分层 |
| 是否按对象拆分 | 否；每个 Phase 都表达一个可验证功能增量，内部再引用模块/对象 | 实施计划规范 §3.1/§5.5 |
| 哪些阶段可并行 | 设计阶段可并行准备阅读/fixture 草稿；实现激活严格单 current boundary，不并行提交 | 台账规范 §3.2 |
| 阶段完成如何判定 | 绑定 Phase exit gate、相关 TC/EV、scope/handoff；任一 blocker 或未执行保持 blocked/pending | 05/06、台账规范 |
| 是否把正向 owner 成功前置 | 不把 owner 成功前置；只预留 safe ref/gap/marker，owner 闭合后重开受影响 Phase | MI-UP/Q-MI 规则 |

## 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 直接从 definition 跳到 build | 可能跳过 static/live、pin 与 mapping guard | 单独 PH-02 完成 definition/assembly 负向与纯契约 |
| 把 build、qualification、supply 合成一阶段 | candidate/digest/eligibility/availability 被混成 ready | 按五 capability 分成 PH-03~05 |
| Query/projection 与 mutation 混做 | Query 可能反写或 repair | PH-06 独立并设置 no-write gate |
| inbound/Job 入口早于协议闭合 | 偷渡 event envelope/scheduler | PH-07 只允许 marker/bounded action |
| 证据工具与业务实现混做 | 静态 report 冒充 evidence | PH-08 只从 fixed run raw 派生，当前不执行 |

## 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 阶段粒度 | 只有五 capability 的逻辑顺序 | 八个可验证 Phase、每个三 boundary | 对齐 L1-governance 的可 review/可回退粒度 |
| 依赖 | capability 关系与工程层混杂 | 明确 Phase DAG 与 boundary 顺序 | 防止后续结果前置 |
| 当前上限 | 可能误读为全链路实现 | 每 Phase 写 current-negative、blocked、future/reopen 上限 | 保护 blocker |
| 阶段门禁 | 未编号 | `GATE-01~24`，逐 boundary 绑定 | 可回指 05/06 |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 五 capability 各一 Phase | 直观 | Foundation、Query、evidence、entry 交叉过多，无法单独验证 | 不采用 |
| 13+ Phase（每个状态族一阶段） | 细 | 对当前仅 28 条 logical surface 过度拆分，边界噪音大 | 不采用 |
| 八 Phase、三 boundary/Phase | 兼顾纵切、风险隔离和 review | 需在 Step 6 细化批次 | 采用 |

## 结构化中间产物

### 阶段依赖图：L2-member-images 实施阶段顺序

```text
[PH-01 Foundation / workspace / contracts / config]
  | enables
  v
[PH-02 Definition / mapping / static assembly]
  | enables
  v
[PH-03 Build intent / snapshot / attempt / candidate]
  | enables
  v
[PH-04 Provenance / gate / eligibility / Artifact gap]
  | enables
  v
[PH-05 Supply / availability / entry / consumer gap]
  | enables
  v
[PH-06 Reference / projection / trace / strict Query]
  | enables
  v
[PH-07 Conditional inbound / bounded Jobs / logical entries]
  | enables
  v
[PH-08 Test / gate / report / evidence handoff]
```

关键说明：
- 图表达 Phase 依赖，不表达函数调用、部署、scheduler 或外部成功。
- PH-06 的 Query 可以读取前序 committed local truth，但不反写或修复；PH-07 不能借用未闭合 event/consumer contract。
- PH-08 的报告只能由 future fixed run raw artifact 派生；当前没有 run 或证据。

### 阶段总表

| Phase | 阶段名称 | 可验证功能增量 | 依赖 | 核心交付物 | Phase exit gate | 当前姿态 |
|---|---|---|---|---|---|---|
| PH-01 | Foundation / workspace / contracts / config | 建立可编译的职责骨架、typed shared carrier、strict config binding 和 ledger/script roots | 无（activation preflight） | 七 crate skeleton、contracts、config shell、台账规则 | GATE-03 | blocked: repo/baseline/toolchain |
| PH-02 | Definition / mapping / static assembly | 能识别 definition、mapping validity、pinned static baseline、placement 与 revision 变化 | PH-01 | definition/assembly contracts/domain/guards | GATE-06 | planned; owner positive blocked |
| PH-03 | Build intent / snapshot / attempt / candidate | 能表达 build intent、immutable snapshot、attempt 与 conservative outcome；当前合法输入后 zero-effect | PH-02 | build contracts/domain/application stop + bounded sweep | GATE-09 | blocked: B01/B02, MI-UP-005, Q-MI-003 |
| PH-04 | Provenance / gate / eligibility / Artifact gap | 能分层 provenance、applicable gate、eligibility 与 Artifact gap；不 mint external success | PH-03 | qualification contracts/domain/adapter gap | GATE-12 | blocked: B01/B02, Q-MI-004, MI-UP-007 |
| PH-05 | Supply / availability / entry / consumer gap | 能表达 local availability/history/pinned entry 与 consumer gap；不宣称 launch/health | PH-04 | supply/domain/query/entry seam | GATE-15 | blocked: B03, MI-UP-001 |
| PH-06 | Reference / projection / trace / strict Query | 能从既有 local truth/read model 做安全、分页、freshness-aware 查询；无写/repair | PH-02~05（只读消费） | reference/projection/query services、no-write tests | GATE-18 | blocked for recovery: PF |
| PH-07 | Conditional inbound / bounded Jobs / logical entries | 能返回 inbound marker、bounded action disposition 和 facade-only entry | PH-03~06 | worker/jobs/api mapping、six Job boundary | GATE-21 | blocked: MI-UP-005, B01/B02 |
| PH-08 | Test / gate / report / evidence handoff | 能按 fixed run 生成 raw/report/index 的工具契约并交接 future 06 | PH-01~07 | scripts、fixtures、reports、handoff templates | GATE-24 | blocked: target repo/evidence execution |

### Phase 可验证增量说明

#### PH-01

| 项 | 内容 |
|---|---|
| 功能增量 | workspace/package/crate 命名、contracts carrier、strict config/composition 和 implementation ledger 入口 |
| 输入 | 03 §3~§5、04 §3~§7、目录/台账规范 |
| 输出 | 目标仓 planned layout、config parse/validation shell、planned script/report roots、台账骨架 |
| 不包含 | 业务 mutation、external adapter success、event/publisher、real evidence |
| 验证方式 | future workspace/config/path checks；当前仅设计审计 |

#### PH-02

| 项 | 内容 |
|---|---|
| 功能增量 | definition/mapping snapshot、static pin、seed placement、baseline completeness 和 revision guard |
| 输入 | PH-01 contracts/config；03 Step 6/8/10 |
| 输出 | pure domain guard、safe gap、negative tests |
| 不包含 | build candidate、digest、Artifact、consumer、live state |
| 验证方式 | `TC-CMD-001~003`、`TC-STATE-001~006`、`EV-UNIT-001` planned |

#### PH-03

| 项 | 内容 |
|---|---|
| 功能增量 | build intent/snapshot/attempt/outcome/candidate 的阶段分层和 bounded action stop |
| 输入 | PH-02 buildable revision 语义、03 Step 8/9/10 |
| 输出 | conservative failure/blocked/unknown、zero-effect flow、nightly page boundary |
| 不包含 | builder/registry success、digest、scheduler、event receipt |
| 验证方式 | `TC-CMD-004~005`、`TC-JOB-001~002`、`TC-CON-001~005` |

#### PH-04

| 项 | 内容 |
|---|---|
| 功能增量 | provenance/gate/eligibility/Artifact handoff gap 的独立判定和安全映射 |
| 输入 | PH-03 candidate safe outcome；03 qualification contracts；04 external boundary selectors |
| 输出 | blocked/pending/unknown/gap disposition、body-free adapter surface |
| 不包含 | gate authority、evidence body、Artifact acceptance、positive eligibility |
| 验证方式 | `TC-CMD-006~007`、`TC-QUERY-004`、`TC-JOB-003`、`EV-SEC-001` |

#### PH-05

| 项 | 内容 |
|---|---|
| 功能增量 | local availability transition/history、pinned entry 和 consumer handoff gap |
| 输入 | PH-04 eligible-or-gap conclusion、03 supply contracts |
| 输出 | local safe entry/unavailable/gap/read model |
| 不包含 | consumer manifest、launch、health、notification、container lifecycle |
| 验证方式 | `TC-CMD-008~010`、`TC-QUERY-005~007`、`TC-STATE-015~018` |

#### PH-06

| 项 | 内容 |
|---|---|
| 功能增量 | 10 Query 的 exact read、page、gap、freshness、trace 和 no-write boundary |
| 输入 | 前序 local truth/既有 projection；03 Step 9/10/15/16 |
| 输出 | safe query response、empty/partial/unavailable markers、no-write evidence plan |
| 不包含 | query-time repair、projection recovery、source refresh、authorization truth |
| 验证方式 | `TC-QUERY-001~010`、`TC-OBS-001`、`EV-SVC-001` |

#### PH-07

| 项 | 内容 |
|---|---|
| 功能增量 | 两条 marker-only inbound、六个 bounded Job、api/worker/jobs facade mapping |
| 输入 | 前序 contracts/application facade、entry restriction |
| 输出 | `accepted_input=false` markers、bounded action result、safe error mapping |
| 不包含 | event envelope/receipt/dedup、scheduler/lease/run/report、outbound event |
| 验证方式 | `TC-IN-001~002`、`TC-JOB-001~006`、`TC-EVENT-001` |

#### PH-08

| 项 | 内容 |
|---|---|
| 功能增量 | gate/check/report script contract、fixed-run artifact/report pairing、future acceptance draft generation |
| 输入 | PH-01~07 outputs；05 §9/§13；06 §3/§10 |
| 输出 | planned scripts、fixtures、raw/report schemas、handoff/veto draft templates |
| 不包含 | actual run、EV instance、VETO result、risk acceptance、verdict/signoff |
| 验证方式 | script dry-run and report audit only after target repo activation |

### Phase 停审记录

| Phase | 可验证增量 | 后续依赖是否越界 | gate 是否可执行 | 结论 | 缺口/修正 |
|---|---|---|---|---|---|
| PH-01 | 是，foundation/config/ledger | 否 | 规划可执行，实际未运行 | 保留 | target repo/baseline/toolchain blocked |
| PH-02 | 是，definition/assembly | 否 | planned | 保留 | MI-UP-002/003/006/008 影响 positive lane |
| PH-03 | 是，build classification | 否 | planned negative lane | 保留 | B01/B02、MI-UP-005、Q-MI-003 |
| PH-04 | 是，qualification gap | 否 | planned | 保留 | B01/B02、Q-MI-004、MI-UP-007 |
| PH-05 | 是，local supply/entry | 否 | planned local/negative | 保留 | B03、MI-UP-001 |
| PH-06 | 是，strict Query/no-write | 否 | planned | 保留 | PF recovery blocker |
| PH-07 | 是，marker/bounded entries | 否 | planned | 保留 | MI-UP-005、B01/B02 |
| PH-08 | 是，tooling/handoff contract | 否 | planned only | 保留 | no execution/evidence |

### 跨 Phase 依赖闭环审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| contracts precede domain/application | 通过（planned） | PH-01 must remain first |
| definition/assembly precede build | 通过 | buildable revision only; no guessed pin |
| build precedes qualification | 通过 | no candidate/digest claim while B01/B02/Q-MI-003 open |
| qualification precedes supply | 通过 | Artifact handoff remains separate gap |
| supply precedes consumer entry | 通过（local only） | MI-UP-001 blocks consumer resolved |
| Query after source truth but no repair | 通过 | PF recovery remains blocked; no query workaround |
| inbound/jobs after facade/protocol | 通过 | marker-only/bounded only |
| evidence after test/gate contracts | 通过 | fixed run required; no static evidence |
| external compile dependency | 通过 | active sibling compile = 0; conditional Core only |
| phase boundary purity | 通过（planned） | each boundary must repeat design closure review in Step 6 |

## 回填草稿

八个 Phase 按 `Foundation → Definition/Assembly → Build → Qualification → Supply → Reference/Query → Inbound/Jobs → Test/Evidence` 顺序推进，每 Phase 三个 boundary，共 24 个 planned boundary。该顺序只表达本地可验证增量，不表达外部成功。任一 Phase exit gate 未执行、失败或受 blocker 影响时，Phase 保持 `planned/blocked`，不得进入下一 Phase。

## 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| 24 boundary 是否保持三段粒度 | Step 6 任务/提交映射 | Step 6 完成前 |
| PH-01 是否需拆独立 docs/script boundary | workspace/config/ledger review | commit-01-a~c 设计复核 |
| PF recovery 的 owner/函数 | PH-06 rebuild positive | PH-06 activation 前，未闭则 blocked |
| owner contract 关闭顺序 | PH-02~05 positive lane | 相应 boundary 开工前 |
| evidence policy 与 Q-MI-004 | PH-08 release/handoff | PH-08 前，未闭则仅 tooling planned |

## 进入下一步条件

- [x] 八个 Phase 具有明确输入、输出、不包含项和验证方式。
- [x] 24 个 boundary 的顺序、依赖、Phase exit gate 和当前姿态已固定。
- [x] 跨 Phase 审计确认没有把后续对象、结果或证据前置。
