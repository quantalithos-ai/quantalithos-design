# L2-member-service 02 概要设计校准工作台

> 文档：`02-概要设计.md`
> 模式：full-restart
> 最近更新：2026-08-25
> 当前状态：Step 1~14 completed / pass；02 正式文档已停审
> 正式文档状态：`02-概要设计.md` 已从 Step 1~13 全量重建并通过 Step 14 Gate；未经用户再次确认不得进入 03

## 1. 工作台职责

本工作台记录 02 的总流程、三层门禁、恢复点、主要组成部分停审和正式装配约束。每个 Step 必须先完成问题回答、当前材料诊断、取舍、结构化中间产物、回填草稿和 Gate 自检；Step 5~9 还必须按主要组成部分逐项展开、逐项停审，再执行跨部分审计。

正式 02 只能在 Step 14 删除旧文件并从 Step 1~13 的已停审结论重建。Step 14 完成后立即停审，未经用户再次明确确认不得读取或创建 03 校准材料。

## 2. 输入效力

| 输入类别 | 材料 | 使用规则 |
|---|---|---|
| direct baseline | 当前正式 `00-需求文档.md`、已获批正式 `01-架构设计.md` | 02 的直接需求与架构真相源；只下沉为可实现骨架，不重写范围、owner、子域、依赖或取舍。 |
| stable upstream | `L2-runtime/00~07`、`L2-tools/00~07`、`L4-sandbox`、`L1-identity`、`L1-work`、`L0-core`、`L0-bus`、`L0-sdk` 当前正式文档 | 只消费已正式成立的对象类别、能力边界和接缝；不得替上游定义字段、协议或 truth。 |
| sibling current | `L2-member`、`L2-member-images` 当前正式文档与台账 | 只有已停审且已获相应门禁效力的结论可采用；WIP、未获批或单侧合同继续 pending。 |
| granularity reference | `L1-governance/02-概要设计.md`、`L1-artifact/02-概要设计.md` | 只参考组成部分、对象、接口、处理流与状态骨架粒度，不复制领域主语。 |
| discussion input | `draft/README.md`、`draft/01~04` | 只作为候选和污染审计线索，不能提供正式对象、接口、状态或 ready 证明。 |
| historical_material | 旧 README、旧正式 `02/03/05/06` | Step 1 / 14 后置审计输入；不继承 action execution、capability mount、worker、产品、协议、对象、指标或实现证据。 |

## 3. 不可变执行纪律

- 严格 `Step 1 -> Step 2 -> ... -> Step 14`，当前 Step `completed / pass` 前不得创建下一 Step 文件。
- Step 5~9 必须沿同一组已停审主要组成部分完成 capability、对象、接口、处理流和状态的小循环；每部分停审后再做跨部分审计。
- API / Event / Job 可以点名骨架，但 exact 双侧合同未闭口时必须标为 placeholder / blocked / waiting，不能单方造 schema。
- 对象关键字段必须带概要类型；函数参数必须带类型；不得写完整签名、协议 schema、DDL、目录、实现代码或产品配置。
- runtime / event / ref / adapter / fake seam 不得转换为 sibling 源码依赖；fake 不证明真实集成。
- control plane、Host Truth、Runtime Session、execution handoff 以及 external outcome 必须保持分层。
- 不写代码，不修改兄弟项目，不提交 commit，不生成实现 / 测试 / 验收 / readiness 证据。

## 4. Step 总流程计划

| Step | 名称 | 前序输入 | 输出文件 | 完成门禁 | 状态 |
|---|---|---|---|---|---|
| 1 | 确认上游输入边界 | 正式 00 / 01、稳定上游、兄弟效力、旧材料 | `02_hld_step_01_upstream_boundary.md` | 可直接承接、暂不进入和 positive ceiling 清楚 | completed / pass |
| 2 | 明确设计目标与范围 | Step 1 | `02_hld_step_02_goals_scope.md` | 结构目标、设计深度与非范围收稳 | completed / pass |
| 3 | 收稳约束条件 | Step 1~2 | `02_hld_step_03_constraints.md` | 每条约束能指导对象、接口、流程或状态判断 | completed / pass |
| 4 | 代码主体框架映射 | Step 1~3、正式 01 | `02_hld_step_04_code_skeleton.md` | 两张必画图、业务组成与实现分层不混用 | completed / pass |
| 5 | 主要组成部分、职责与边界 | Step 3~4 | `02_hld_step_05_components_boundary.md` | 每部分 capability / 候选对象 / 接缝停审，跨部分无冲突 | completed / pass |
| 6 | 关键对象轮廓 | Step 4~5 | `02_hld_step_06_key_objects.md` 及按需对象附录 | 候选池逐项处理，对象字段 / 函数为骨架且无孤儿 | completed / pass |
| 7 | API / 接口骨架 | Step 5~6 | `02_hld_step_07_interface_skeleton.md` | Command / Query / Event / Job 分类和归属逐项停审 | completed / pass |
| 8 | 关键处理流 | Step 5~7 | `02_hld_step_08_processing_flows.md` | P0 写路径、状态写入 consumer、关键 job 有流程且对象可反查 | completed / pass |
| 9 | 状态机与状态流转 | Step 6~8 | `02_hld_step_09_state_transitions.md` | 状态归属、触发、允许 / 禁止迁移和传播逐项停审 | completed / pass |
| 10 | 异常与边界场景 | Step 8~9 | `02_hld_step_10_exceptions_boundaries.md` | 主线级异常有明确落点和 fail-closed 口径 | completed / pass |
| 11 | 配置影响轮廓 | Step 4~10 | `02_hld_step_11_configuration_impact.md` | 受影响结构与禁止配置化边界清楚，无 key / value 预支 | completed / pass |
| 12 | 详细设计承接清单 | Step 4~11 | `02_hld_step_12_detailed_design_handoff.md` | 稳定输入、继续展开和回退规则完整 | completed / pass |
| 13 | 设计风险与待确认 | Step 4~12 | `02_hld_step_13_risks_open_questions.md` | 风险 / Q 分离，owner、ceiling、阻塞层级清楚 | completed / pass |
| 14 | 整理正式文档 | Step 1~13、旧 02 | `02_hld_step_14_formal_document_assembly.md`；`../02-概要设计.md` | 14 章、逐章来源、总审计、污染与非伪造审计通过 | completed / pass |

## 5. 主要组成部分冻结纪律

正式 01 的 A1~A5、S1~S3、P1~P3 是架构语义单元，不自动等于概要主要组成部分或代码模块。`draft/04_module_layering.md` 与旧 02 的分层也是候选。只有 Step 4 完成代码主体映射、Step 5 逐项停审后，主要组成部分名称、capability 和后续对象候选池才可冻结；Step 6~9 不得临时增设业务组成部分。

## 6. 当前 blocker / pending 注册表

| ID | 主题 | 概要设计期上限 |
|---|---|---|
| `MSVC-UP-001` | Runtime entry / Host Session / execution handoff surface | 只定义 host-side port、输入输出骨架和 blocked positive path；不得造 Runtime contract。 |
| `MSVC-UP-002` | Member launch / register / heartbeat / status exact contract | 需求级 owner 分工成立；接口名可作 host-side candidate，字段 / IPC / credential / 联调 waiting。 |
| `MSVC-UP-003` | Images exact pinned supply contract | 只定义 pinned supply ref / qualification 的 host-side reference skeleton；exact manifest / confirmation blocked。 |
| `MSVC-UP-004` | SandboxBinding bind / release / cleanup exact contract | 只定义 host-side association / port skeleton 与 no-fallback；caller / receipt / fields pending。 |
| `MSVC-UP-005` | policy 传递 owner | 无当前 FR，不创建组成部分、接口、对象或配置入口。 |
| `MSVC-UP-006` | launch credential owner | 只允许 instance-bound safe ref / qualification skeleton；签发、撤销、secret body 外置。 |
| `MSVC-UP-007` | Core schema / event family | 可点名本仓语义对象与 event family candidate；准确共享类型 / envelope / schema blocked。 |
| `MSVC-UP-008` | SDK compile target / Server 自测试 | 只保留受限 boundary / fake seam；不得声明准确 target、编译或自测试通过。 |
| `MSVC-UP-009` | 非项目型执行主语 | 当前范围 resolved；只支持 ProjectMemberRef + GlobalMemberRef，其他主语 fail closed。 |

## 7. 当前恢复点

```text
current_document = 02-概要设计.md
current_step = Step 14 completed / pass
current_module = formal_document_assembly
gate_status = step_14_pass_stop_review
next_allowed_action = stop_review_and_wait_for_explicit_user_confirmation
formal_02_write_allowed = false_after_stop_review
formal_03_write_allowed = false
```

## 8. 非伪造声明

02 只形成可实现结构骨架，不形成实现仓、commit、run_id、测试结果、artifact、report、evidence、verdict、signoff、integration success 或 readiness。placeholder / fake / planned 只能证明边界已被点名，不能证明真实上游、backend 或正向路径成立。
