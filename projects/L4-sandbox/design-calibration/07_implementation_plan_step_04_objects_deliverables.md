# L4-sandbox 实施计划 Step 4 抽取实施对象与交付物

> 对应SOP: `standards/document/实施计划讨论流程_SOP.md` Step 4
> 书写规范: `standards/document/实施计划书写规范.md` §5.4
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 回填章节: `07-实施计划.md` §4 实施对象与交付物清单
> 创建日期: 2026-07-16
> 状态: completed_reviewed_passed_to_step_5
> 本Step口径: 从已审查的实施范围、详细设计、配置设计、测试方案和验收标准抽取可交付surface,不复制完整对象 / 字段目录。本Step不拆phase或commit boundary,不选择隔离产品,不创建正式`07`、implementation ledger、planned boundary skeleton、目标实现仓、runtime artifact、报告实例或验收事实。

---

## 1. Step状态与三层开工门禁

| 门禁层 | 检查结果 | 裁决 |
|---|---|---|
| 项目级台账 | 原恢复点为`07 / Step 3 / pending_user_review`;用户已明确“继续”,确认Step 3并放行Step 4,随后明确“同意”本Step并放行Step 5。 | passed_to_step_5 |
| 文档级flow | Step 1~3已依次审查传递;本Step完成停审后已获用户确认。 | passed_to_step_5 |
| Step级输入 | Step 2已固定`MDR-SBX-P0`,Step 3已固定阅读 / 仓库 / 工具 / 台账前置;正式`03~06`提供实现、配置、测试和验收来源。 | passed_for_deliverable_extraction |
| 正式文档写入 | 本Step只形成§4回填草稿;正式`07`只能由Step 13装配。 | forbidden_in_step_4 |
| 实现侧产物 | 目标实现仓、代码、测试、脚本、CI和runtime evidence均未形成。 | forbidden_in_design_task |
| 下游Step | Step 5已由用户放行;Step 6~13仍无本轮用户放行。 | step_5_only |

当前恢复点:

```text
current_document = `07-实施计划.md`
current_step = Step 4 `抽取实施对象与交付物`
current_module = `implementation_objects_deliverables_reviewed`
gate_status = passed_to_step_5
next_allowed_action = 由`07_implementation_plan_step_05_phases_dependencies.md`承接
formal_07_created = no
implementation_ledger_created = no
planned_boundary_skeleton_created = no
implementation_repo_exists = no
real_implementation_started = no
```

### 1.1 Step内计划

| 顺序 | 动作 | 状态 | 可审查产物 / 完成门禁 |
|---:|---|---|---|
| 1 | 恢复项目台账、flow和Step 3审查状态。 | done | 用户放行与唯一下一动作可追溯 |
| 2 | 读取Step 4 SOP / 书写规范、Step 2 / 3及正式`03~06`。 | done | 六项SOP问题均有权威来源 |
| 3 | 将详细对象目录聚合为可交付surface。 | done | 不把完整对象表复制为实施清单 |
| 4 | 建立实施对象、交付物、非交付物和跨仓依赖表。 | done | 每项交付物有来源、预计落点和完成判定 |
| 5 | 完成范围、真实性和后续phase承接审计。 | done | P0-C / P0-Q、P1 / P2及执行事实边界闭合 |
| 6 | 输出§4回填草稿、blocker、自检和停审条件。 | done | 停在Step 4待审 |

---

## 2. 本步目标、输入与抽取规则

### 2.1 本步必须回答的目标

1. 哪些代码模块、协议、adapter、job、配置、测试、脚本和文档是本轮实际交付面。
2. 如何用可判定交付物覆盖七crate、55协议、30个owner-level state machines、31个Step 10 canonical status enum entries、39个Step 6 shared status declarations、38 typed error、配置控制面、254条TC、16个suite、7个gate、17个脚本和21个planned evidence slot。
3. 如何把P0-Q concrete candidate binding保留为mandatory交付面,同时不伪造产品选择、环境、manifest实例或资格结果。
4. 哪些上游对象只提供truth或裁决口径,不能被误写成Sandbox交付物。
5. 哪些文件属于Step 13设计移交交付,但当前不得提前创建。

### 2.2 输入表

| 输入 | 状态 | 本Step使用方式 |
|---|---|---|
| `07_implementation_plan_step_02_scope.md` | completed_reviewed | 固定`MDR-SBX-P0`、P0-C / P0-Q、P1 / P2和相邻仓非范围 |
| `07_implementation_plan_step_03_prerequisites_reading.md` | completed_reviewed | 固定目标路径、七crate命名、依赖裁剪、17脚本、报告路径和Step 13台账交付 |
| `03-详细设计.md` §4~§16 | reviewed implementation contract | 提供文件布局、模块、对象 / port、55协议、flow、状态、事务、错误、并发、观测和测试切口 |
| `04-配置设计.md` §3~§12 | reviewed config contract | 提供40配置组、I001~I101、D01~D44、PROFILE、source / generation、敏感材料、builder和IMH-01~16 |
| `05-测试方案.md` §3 / §6~§14 | reviewed test contract | 提供254条TC、28数据集、16 suite、7 gate、17脚本、九schema和21 slot |
| `06-验收标准.md` §5~§14 | reviewed adjudication contract | 提供功能 / 红线 / 协议 / 状态 / NFR / evidence / VETO及最终裁决消费要求 |
| L1-governance / L1-artifact Step 4 | granularity reference | 参考聚合粒度和表结构,不继承领域语义、数量或产品假设 |

### 2.3 抽取规则

| 规则 | 本Step应用 |
|---|---|
| 交付surface优先 | 以crate、协议族、状态 / 一致性面、adapter族、配置装配、测试 / 自动化和handoff文档组织 |
| 详细truth留在owner文档 | 不复制DTO字段、30份状态矩阵、38条错误producer或254条TC正文 |
| 完成判定可机械检查 | 使用编译、inventory、targeted test、suite / gate contract、schema / redaction / dependency check等判定 |
| planned与runtime事实分离 | 路径、writer、schema和generator可交付;真实`run_id`、EV、结果、review和签署不可静态交付 |
| unresolved prerequisite不删交付物 | candidate、edition、Shell lint和RFC 8785工具未定时登记前置,不得把对应P0交付面移出 |
| expected location不是存在声明 | 所有目标仓路径均为future planned location;当前目标仓不存在 |

---

## 3. SOP问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 1. 本轮新增或修改哪些代码模块? | 在`/home/aris/Projects/quantalithos-sandbox`建立`contracts/domain/application/infra/api/worker/jobs`七个Rust workspace member及根workspace、`tests/*`和`scripts/*`;不在设计仓写实现代码。 | `03`§4~§5;Step 2 / 3 |
| 2. 新增或修改哪些接口、事件、job或adapter? | 实现10 Command、13 Query、9 Inbound Consumer、13 Outbound Event、10 Operations Job及其55条flow;实现application-owned repository / UoW / resolver / policy / backend / capture / handoff / publisher / clock / ID / config ports,infra adapter、semantic fake和一个正式选定candidate binding。 | `03`§6~§8 / §10~§13;`05`§3 / §9 |
| 3. 新增哪些测试? | 实现254条TC contract及参数化case、28个数据集和builder、16个suite、7个gate语义;其中237条P0-C、13条P0-Q、4条conditional。PROFILE-06未激活时保持`NotRunConditional`,不能补偿P0。 | `05`§6~§10 / §14 |
| 4. 产生哪些配置、迁移、种子数据或文档同步? | 实现40组typed config、I001~I101 / D01~D44覆盖、strict loader / validator / generation / runtime builder、PROFILE-01~05装配、23类material slot处理、P0 fixture和17个自动化脚本;形成正式`07`、implementation ledger及全部planned skeleton。当前无正式DB migration、production seed或真实secret交付。 | `04`§7~§12;`05`§7 / §9 / §13;Step 3 |
| 5. 哪些上游设计对象本轮不交付? | 不交付tools semantic execution、runtime agent loop / recovery、member lifecycle orchestration、Artifact / Observability / Policy truth;不交付PROFILE-06真实组合(除非正式激活)、PROFILE-07、生产容量 / DR、rich preview / analytics / operator console或multi-host scheduling。 | Step 2;`03`§2;`04`§2 / §6;`05`§2 |
| 6. 哪些交付物跨仓或依赖外部模块? | 只有`core-contracts`是编译期sibling依赖。tools、runtime、member、bus、identity / work / policy owners、Artifact / Observability及candidate backend均通过typed ref、port、adapter、event、handoff、fake / controlled seam协作;candidate与ENV-05需外部资格输入。 | `03`§3 / §13;Step 3 §7.10 |

---

## 4. 当前材料问题诊断

| 位置 / 材料 | 当前问题 | 影响 | 本Step处理 |
|---|---|---|---|
| 正式`07-实施计划.md` | 尚不存在 | 无正式§4交付物闭集 | 仅形成可回填草稿;Step 13才装配 |
| 旧`README.md` / 重建前正式文档 | 含旧对象、旧产品和旧路线 | 可能把historical假设带回实现 | 继续标记`historical_material`,不抽取交付物 |
| `03`对象 / trait / protocol目录 | 粒度细且数量多 | 原样复制会退化为对象待办 | 聚合为可验证deliverable surface,落码时回读exact owner章节 |
| `04` IMH-01~16 | 是任务族,不是phase / boundary | 直接当boundary会跳过Step 5 / 6 | 只作为配置交付面来源 |
| `05` suite / gate / slot | 是planned contract,不是执行事实 | 可能把路径或slot写成已运行evidence | 只交付harness / writer / generator能力 |
| `06` AC / VETO / signoff | 是裁决消费契约 | 可能误造pass、risk acceptance或签署 | 只抽取让未来裁决可执行的代码 / 测试 / 报告能力 |
| 目标实现仓缺失 | 所有预计代码路径当前不存在 | 无法把planned location误认现状 | 保留为首个boundary前置,由Step 5 / 6确定创建位置 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 实施对象 | 分散在七模块、对象、protocol、IMH、TC和AC表 | 形成19个可排序实施surface | 供Step 5按可验证增量组织 |
| 交付物 | 只有范围和planned路径,无统一完成判定 | 按code / config / test / automation / evidence capability / design handoff分组 | 防止“完善相关代码”式任务 |
| P0-Q | candidate未选,容易被延后或删除 | concrete binding与13 CONF harness列为mandatory交付;真实选择列前置 | 保持P0双轴完整 |
| 证据 | slot、路径、runtime EV容易混同 | writer / schema / generator是交付物;实例 / 结论不是 | 禁止静态证据和伪结果 |
| migration / seed | 上游未要求durable产品迁移 | 明确无production migration / seed;只交付deterministic fixture / dataset | 不发明存储产品与生产数据 |
| 设计移交 | ledger / skeleton尚缺 | 列为Step 13同步交付物,当前仍禁止创建 | 防止实现agent逐boundary索要补件 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 / 风险 | 结论 |
|---|---|---|---|
| 逐个复制所有struct、字段和TC | 表面完整 | 制造第二truth源,无法表达交付完成 | 不采用 |
| 按可验证surface聚合,完成时回查owner inventory | 可排序、可测试、可追溯 | Step 6仍需下沉到boundary | 采用 |
| candidate未定就删除P0-Q交付 | P0-C可更快结束 | 违反已确认总体P0,产生弱边界替代 | 不采用 |
| 交付candidate adapter / harness,选择与manifest实例作前置 | 保持产品中立且能阻断0-launch | 受外部决策约束 | 采用 |
| 预建静态artifact / acceptance文件作模板 | 路径直观 | 容易伪造EV、Passed或签署 | 不采用;仅交付generator与schema fixture |
| 当前创建implementation ledger / boundary skeleton | 提前看到文件 | boundary ID尚未形成,会伪造计划 | 不采用;Step 13按已审查Step 6一次性创建 |

---

## 7. 结构化中间产物

### 7.1 实施对象清单

本表识别可进入后续phase排序的实施surface,不是详细设计对象全集。`OBJ-SBX-*`仅是实施计划抽取ID,不替代正式对象 / 协议ID。

| 对象ID | 实施surface | 包含范围 | 权威来源 | Step 5承接约束 |
|---|---|---|---|---|
| OBJ-SBX-001 | 仓库 / workspace与依赖边界 | 根Cargo、七member、binary、唯一`core-contracts`编译依赖 | `03`§3~§4;Step 3 | 首个可验证bootstrap增量,版本值仍需前置关闭 |
| OBJ-SBX-002 | Public contract surface | typed ref、metadata、status、command / query / event / job / view / receipt / public error carrier | `03`§4~§7 | 先于调用方crate;不得复制外部正文 |
| OBJ-SBX-003 | Domain truth与guard | context、environment identity、coherent boundary、policy、run、capture、handoff、failure、control、cleanup、redline | `03`§5~§6 / §9 | 以factory、invariant和非法迁移形成可测闭包 |
| OBJ-SBX-004 | State与typed error闭集 | 30个正式state enum、38个typed producer及安全映射 | `03`§9 / §11;`05`§3 / §6 | 不得新增同义状态或泛化错误 |
| OBJ-SBX-005 | Application orchestration | command / query / consumer / job service、port、repository、stored result | `03`§5 / §8 | 必须保持query no-write、job no-repair、side-effect顺序 |
| OBJ-SBX-006 | UoW / persistence / replay | logical store、version / cursor、事务、三通道幂等与回放 | `03`§10 / §12 | 当前与后续adapter必须同boundary可验证或显式fake闭合 |
| OBJ-SBX-007 | Infra与runtime assembly | repository、resolver、policy、backend、capture、handoff、publisher、clock / ID、config adapter | `03`§5 / §13;`04`§9 | application-owned port,entry不得下探 |
| OBJ-SBX-008 | 同步API entry | 10 Command与13 Query handler / binary assembly | `03`§4 / §7~§8 | metadata validation、error redaction、只调application |
| OBJ-SBX-009 | Worker entry | 9 consumer、control / fulfillment / relay worker及ack / retry / quarantine | `03`§4 / §7~§8 | inbound dedup、receipt和source truth no-rollback闭合 |
| OBJ-SBX-010 | Operations jobs entry | 10 job runner、selection、partial report和stored replay | `03`§4 / §7~§8 | job不得修core truth |
| OBJ-SBX-011 | 55协议inventory | 10 Command +13 Query +9 Consumer +13 Event +10 Job及55 flow | `03`§7~§8;`05`§3 / §9 | 必须以inventory + family test机械证明55 /55 |
| OBJ-SBX-012 | 配置读取与typed schema | single raw owner、40组、I001~I101、D01~D44、strict parse / validation | `04`§3~§9 | 不能在builder补default或新建第二loader |
| OBJ-SBX-013 | Profile / generation / runtime builder | PROFILE-01~05 eligibility、complete generation、scoped snapshot和原子assembly | `04`§6 / §9~§11 | P06只保留未激活语义,P07必须拒绝 / DesignReopen |
| OBJ-SBX-014 | Sensitive material boundary | 23 slot descriptor、provider-neutral resolve、lease / cache / revoke和全carrier redaction | `04`§8~§11 | raw material不得进入ordinary config / truth / carrier |
| OBJ-SBX-015 | Deterministic seam与fake parity | P01~04 fake、fault injection、controlled adapter、simulation状态 | `03`§13 / §15;`04`§12 | fake不得spawn host或成为P05 fallback |
| OBJ-SBX-016 | Concrete candidate qualification surface | 单一candidate adapter、capability / lifecycle / capture / release contract、immutable manifest schema、13 CONF harness | `04`§6 / §12;`05`§8~§10 | candidate实例缺失则Blocked且0 launch,但对象不能删 |
| OBJ-SBX-017 | 测试数据与harness | 13 builder / script contract、28数据集、254 TC、16 suite、7 gate | `05`§6~§10 | 主归属不重复;conditional不补P0 |
| OBJ-SBX-018 | Artifact / report producer | 九machine schema、21 slot catalog、17脚本、fixed-run writer / renderer / draft generator | `05`§9 / §13;`06`§10~§14 | 只从真实raw派生,不预分配EV或结论 |
| OBJ-SBX-019 | 设计到实现handoff | 正式`07`、implementation ledger、全部planned boundary skeleton | 实施计划SOP;台账规范;Step 3 | Step 13同步创建,当前不得实例化boundary |

### 7.2 交付物清单

所有`/home/aris/Projects/quantalithos-sandbox/...`均为预计落点,不是存在性声明。完成判定描述未来实现boundary必须达到的条件,不表示当前已经执行或通过。

#### 7.2.1 代码与协议交付物

| 交付物ID | 交付物 | 类型 | 来源章节 | 预计落点 | 完成判定 |
|---|---|---|---|---|---|
| DEL-SBX-CODE-001 | Rust workspace、七member、package / crate / binary与依赖图 | code / build | `03`§3~§4;Step 3 §7.8~§7.10 | 目标仓`Cargo.toml`;`crates/*/Cargo.toml` | 七crate和正式binary均可被Cargo识别;依赖方向符合`contracts -> domain -> application -> infra -> entry`;非core sibling compile dependency为0 |
| DEL-SBX-CODE-002 | Public protocol carrier crate | code / test | `03`§4.5 / §6~§7 | `crates/contracts/src/*` | typed ref、metadata、status、DTO / view / receipt / public error可roundtrip;禁止body / secret字段;contract tests覆盖 |
| DEL-SBX-CODE-003 | Domain truth、guard、30个owner-level state machines /31个canonical enum entries与domain error | code / test | `03`§5~§6 / §9 / §11 | `crates/domain/src/*` | factory invariant、合法 / 非法 / terminal迁移和fail-closed / cleanup / redline guard可测;30 owner machines /31 enum entries /39 shared declarations inventory完整 |
| DEL-SBX-CODE-004 | Application service、port、repository trait、UoW与stored replay | code / test | `03`§5.6 / §8 / §10 / §12 | `crates/application/src/*` | 10 Command、13 Query、9 Consumer、10 Job orchestration覆盖;query write set为0;duplicate不重算;job不修truth |
| DEL-SBX-CODE-005 | Infra repository、adapter、config与runtime builder | code / test | `03`§5.7 / §10 / §13;`04`§9~§12 | `crates/infra/src/*` | version / cursor / rollback可见性、adapter outcome、strict config和完整assembly通过targeted parity tests;无entry直连store |
| DEL-SBX-CODE-006 | Sync API entry与`sandbox-api` binary | code / test | `03`§4.3~§4.5 / §8 | `crates/api/src/*` | 23个Command / Query entry完成metadata验证、application调用和safe error映射;handler不直调domain / repository |
| DEL-SBX-CODE-007 | Consumer / control / fulfillment / relay worker | code / test | `03`§4.3~§4.5 / §8.4~§8.5 | `crates/worker/src/*` | 9 consumer及worker loop覆盖accepted / duplicate / delayed / retry / quarantine;publish失败不回滚source truth |
| DEL-SBX-CODE-008 | 10个Operations Job runner与binary | code / test | `03`§4.3 / §7.6 / §8.4~§8.5 | `crates/jobs/src/*` | 10 job可校验input、分页选择、per-item结果、partial failure和stored report replay;无core truth repair |
| DEL-SBX-CODE-009 | 55协议及逐接口flow完整实现 | code / test | `03`§7~§8;`05`§3.3 / §9.1 | contracts + application + api / worker / jobs | `check_protocol_inventory.sh`未来对实现与TC manifest证明10 +13 +9 +13 +10 =55且family无错配 |
| DEL-SBX-CODE-010 | 38 typed error producer、恢复与safe public mapping | code / test | `03`§11;`05`§6 ERR family | 七crate对应`errors.rs`;`tests/*` | ERR-001~038均命中正式producer和唯一safe surface;无临时字符串 / `anyhow`替代正式闭集 |
| DEL-SBX-CODE-011 | 事务、幂等、并发、relay / handoff no-rollback一致性 | code / test | `03`§10 / §12;`05`§6 TXN / RACE | application / infra + `tests/service`;`tests/integration` | 14 TXN、19 deterministic race及三通道replay可重复;winner唯一、rollback staged write不可见、失败只更新owner marker |
| DEL-SBX-CODE-012 | Safe observability、audit与redaction hooks | code / test | `03`§14;`04`§8 / §12;`05`§10 | domain / application / infra hooks;`tests/*` | log / metric / audit / receipt / report只含closed safe字段和低基数label;scanner命中raw body / secret即失败 |

#### 7.2.2 配置、adapter与测试数据交付物

| 交付物ID | 交付物 | 类型 | 来源章节 | 预计落点 | 完成判定 |
|---|---|---|---|---|---|
| DEL-SBX-CFG-001 | 单一raw config owner、source selector与strict loader | code / config / test | `04`§3~§5 / §9 / §12.7 IMH-03 | `crates/infra/src/config.rs`;config test fixtures | S01 / S02 / S03与S05 / S06分lane可判定;unknown / duplicate / ambiguous / unreadable / unsupported均产生stable safe issue;无第二loader或implicit fallback |
| DEL-SBX-CFG-002 | 40配置组、I001~I101和D01~D44 typed schema / coverage index | code / config / test | `04`§7 / §9;IMH-04 | `crates/infra/src/config.rs`;`tests/support` | exact key / type / required / default / ref / collection与101项coverage可机械核验;raw config不进入contracts / domain / public DTO |
| DEL-SBX-CFG-003 | NCFG / FC / XVAL validator与safe issue mapping | code / test | `04`§4 / §7 / §9;IMH-06 | infra config validator;config fixtures | 所有enabled composition在builder前关闭;issue稳定且redacted;validator不得静默disable或补default |
| DEL-SBX-CFG-004 | PROFILE-01~05 eligibility、环境适用性与P06 / P07拒绝语义 | code / config / test | `04`§6 / §9 / §12;`05`§8 | infra runtime builder;profile fixtures | P01~04 P0-C可装配,P05只在完整资格identity下可装配;P06未激活为`NotRunConditional`;P07 active claim触发DesignReopen |
| DEL-SBX-CFG-005 | Complete generation、scoped snapshot与原子runtime assembly | code / test | `04`§9~§11;IMH-08 /09 /11 | `crates/infra/src/runtime_builder.rs`;entry / worker / job assembly | partial / mixed generation不可见;entry / loop / job / fixture scope不放宽global ceiling;rollback不改business truth |
| DEL-SBX-CFG-006 | 23类sensitive material slot registry与provider-neutral lifecycle | code / config / test | `04`§8 / §10~§12;IMH-07 | infra config / adapter modules;isolated negative fixtures | descriptor、activation、resolve outcome、bounded lease / cache / revoke可测;raw material不进入ordinary config、summary、DTO、artifact或report |
| DEL-SBX-ADP-001 | P01~04 deterministic resolver / policy / backend / capture / handoff / publisher / store fake | code / test | `03`§13 / §15;`04`§12 IMH-14;`05`§7.4 | `crates/infra/src/fakes.rs`及adapter modules | success / unavailable / retryable / failed / conflict可注入;UoW、version、cursor、replay和call budget与正式port一致;fake不spawn host / network |
| DEL-SBX-ADP-002 | 单一concrete candidate isolation binding | code / config / test | `03`§13;`04`§6 / §12;`05`§8 / §10 | `crates/infra/src/isolation_backend_adapters.rs`;`crates/infra/src/config.rs`;SUITE-SBX-013 harness | 正式ADR选择后实现capability、四维boundary、launch、capture、lease、cleanup / release和safe failure mapping;无weak fallback;选择未闭合前保持blocked而非删项 |
| DEL-SBX-DATA-001 | 13类fixture / builder / schedule契约 | test support | `05`§7.2 | `tests/support` | Namespace、protocol、truth graph、read / replay seed、transaction fault、race、config、adapter、carrier scan、qualification / probe builders均可按相同seed重建且不污染domain identity |
| DEL-SBX-DATA-002 | 28个DS-SBX数据集与隔离清理契约 | test data | `05`§7.3~§7.5 | `tests/support`及受控fixture目录 | 28 /28数据集覆盖14个TC family;每个negative只引入一个主违规;namespace、stub、barrier、scan root和lab disposition均有清理 |
| DEL-SBX-DATA-003 | Qualification / controlled probe manifest schema | config / test input | `05`§7~§10 / §13 | test harness schema / `tests/support` | schema绑定candidate、profile、generation、ENV、capability、template、provider适用性和cleanup obligation;当前不包含真实实例或credential |

#### 7.2.3 测试、自动化与证据生产能力交付物

| 交付物ID | 交付物 | 类型 | 来源章节 | 预计落点 | 完成判定 |
|---|---|---|---|---|---|
| DEL-SBX-TEST-001 | 254条TC contract及参数化case实现 | test | `05`§5~§7 | `tests/contracts`;`tests/domain`;`tests/service`;`tests/integration`;`tests/support` | 237 P0-C +13 P0-Q +4 conditional主归属完整且唯一;expected manifest无缺失、重复或换义;conditional不计P0 pass |
| DEL-SBX-TEST-002 | 16个SUITE-SBX harness | test / harness | `05`§9.1 | `tests/*`及suite runner | SUITE-001~016均可按正式TC owner、环境、profile和status闭集执行或诚实Blocked / NotRunConditional;008 /011 /012不重复计算主归属 |
| DEL-SBX-TEST-003 | 7个GATE-SBX触发、聚合与阻断语义 | automation / CI contract | `05`§9.2 | `scripts/gates`;目标仓CI binding由对应boundary固定 | PR / MAIN / OPS / P0Q / RELEASE / P1 / SCOPE-REOPEN消费正确suite与identity;失败、Blocked、缺源、错序或digest mismatch不被归一为pass |
| DEL-SBX-TEST-004 | 13条CONF candidate conformance harness | test / external qualification | `05`§6 / §8~§10 | SUITE-SBX-013 harness;candidate adapter fixtures | CONF-001~013覆盖四维boundary、lifecycle、capture、reaper、redline、identity和substitution veto;identity缺失时0 probe且`Blocked` |
| DEL-SBX-TEST-005 | 14 TXN、19 RACE和replay / no-write专项harness | test | `03`§15;`05`§6 / §10 | service / integration tests | deterministic schedule不使用sleep / 概率;rollback、winner、duplicate、query write set、job repair和relay / handoff no-rollback均可判定 |
| DEL-SBX-AUTO-001 | 5个gate入口脚本 | script | `05`§9.3;Step 3 §7.11 | `scripts/gates/run_ci_gate.sh`;`run_operations_gate.sh`;`run_backend_conformance_gate.sh`;`run_release_gate.sh`;`run_selected_real_like_gate.sh` | 参数与context writer契约完整;非0退出保留safe failure / blocked raw;P0Q缺identity不launch;RELEASE按四source role固定顺序聚合 |
| DEL-SBX-AUTO-002 | 3个report生成脚本 | script / report capability | `05`§9.3 / §13;`06`§10 / §14 | `scripts/reports/generate_reports.sh`;`generate_gate_results.sh`;`generate_acceptance_handoff.sh` | 只从fixed raw生成run report、gate result和四份acceptance draft;缺raw / schema错非0;不得写pass、risk accepted或签署 |
| DEL-SBX-AUTO-003 | 9个真实性 / 安全check脚本 | script / check capability | `05`§9.3 / §13;`06`§10~§11 | `scripts/checks/check_redaction.sh`;`check_dependency_boundary.sh`;`check_tc_coverage.sh`;`check_protocol_inventory.sh`;`check_artifact_report_pairing.sh`;`check_no_static_evidence.sh`;`check_qualification_identity.sh`;`check_blocked_propagation.sh`;`check_cleanup_disposition.sh` | 9 /9入口具备正式输入、stable finding、safe output和nonzero失败语义;check本身不自动升格EV |
| DEL-SBX-EVD-001 | 九类machine artifact schema、canonical writer与digest verifier | code / test / script | `05`§13.4;Step 3 PRE-SBX-008 | test harness / `tests/support`;`scripts/*` | 九schema required字段、status闭集、relative path、RFC 8785和`sha256:<64 lowercase hex>` self-digest规则有fixture验证;实现库须在boundary前固定 |
| DEL-SBX-EVD-002 | 21个ESLOT producer catalog与runtime allocation guard | test / evidence capability | `05`§13.2;`06`§10 | expected manifest;harness / report generator | ESLOT-001~021均有producer、TC / PER / CUT / AC / VF / VETO映射;无合法raw / report pair时不分配`EV-SBX-*`;P0 expected 001~019不得被020 /021补偿 |
| DEL-SBX-EVD-003 | Fixed-run raw artifact writer与pairing contract | evidence capability | `05`§9.4 / §13.1~§13.5 | runtime输出契约`artifacts/test/<run_id>` | 每次suite无论状态均写context、suite `report.json`和redacted stdout / stderr pair;失败run不覆盖;路径无`latest` / project子层 / symlink escape |
| DEL-SBX-EVD-004 | Human-readable run / suite / evidence report renderer | report capability | `05`§13;`06`§10 | runtime输出契约`reports/runs/<run_id>` | summary、gate / coverage / inventory / redaction / dependency / audit及suite / evidence报告只从fixed raw生成并回链digest;raw缺失不能补洞 |
| DEL-SBX-EVD-005 | Acceptance draft与independent review入口生成能力 | report / handoff capability | `05`§9 / §13;`06`§10 / §14~§15 | runtime输出契约`reports/acceptance/*`;`reports/review/*` | generator只形成handoff / veto / risk / open-issues draft并绑定fixed release sources;review文件由未来真实审查产生,脚本不得预填结论或签署 |

#### 7.2.4 设计移交交付物

| 交付物ID | 交付物 | 类型 | 来源章节 | 预计落点 | 完成判定 |
|---|---|---|---|---|---|
| DEL-SBX-DOC-001 | 正式实施计划 | design doc | 实施计划SOP Step 1~13 | `projects/L4-sandbox/07-实施计划.md` | 只从已审查Step 1~12装配13章并通过一致性 / 可落码审计;当前Step 4不得提前创建 |
| DEL-SBX-DOC-002 | 项目级implementation ledger | design handoff | Step 3 §7.4~§7.5;台账规范 | `projects/L4-sandbox/design-calibration/implementation_execution_ledger.md` | Step 13与正式`07`同步创建;字段、Boundary Ledger、Open Blockers完整;初始不含真实实现commit / gate pass |
| DEL-SBX-DOC-003 | 全部planned boundary skeleton | design handoff | future Step 6 Boundary Gate Matrix;Step 3 §7.5 | `projects/L4-sandbox/design-calibration/implementation-boundaries/<boundary_id>.md` | Step 6每个已审查boundary恰有一件;仅一个current,其余`planned / wait_until_current`;required reads、scope和九类gate齐全且无伪事实 |

### 7.3 非交付物清单

| 非交付物 | 来源 / 边界 | 不交付原因 | 后续处理 |
|---|---|---|---|
| Tools semantic execution、tool registry / planner truth | `00~03`职责边界 | 属于L2-tools, Sandbox只执行给定launch contract | 仅交付typed Command / Query与caller seam |
| Runtime agent loop、planning、recovery orchestration | `00~03`职责边界 | 属于L2-runtime | 仅消费runtime refs / control requests并回传Sandbox outcome |
| Member / host / session / worker lifecycle orchestration | `00~03`职责边界 | 属于L2-member-service | 仅消费safe refs,不建立其状态机 |
| Artifact正文、版本、归档或evidence truth | `01` / `03`数据所有权 | 属于Artifact / archive owner | 只交付capture ref、handoff adapter和receipt |
| Observability store、ledger truth或平台产品 | `01` / `03`数据所有权 | Sandbox只提供safe hooks和handoff | 真实sink组合留P1或相邻仓 |
| Policy DSL、authoring、评估内部语义和policy truth | `01` / `03`职责边界 | Sandbox只消费给定safe summary并fail-closed | policy owner负责正文与语义 |
| PROFILE-06 durable / real-like实际组合 | Step 2;`04`§6;`05`§8 | P1 conditional,当前未激活 | 保留selector、script和`NotRunConditional`;正式claim后DesignReopen / 激活 |
| PROFILE-07、production、capacity、DR与rollout运营面 | Step 2;`04`§6;`05`§2 | P2 inactive | 任一active / ready claim先重开正式`00~07` |
| Rich preview / analytics、operator console、advanced replay operator | Step 2非范围 | 外围产品能力,不是P0 isolation truth | 后续需求与详细设计 |
| 多backend选择 / 市场、multi-host / remote scheduling | Step 2非范围 | 本轮只要求一个concrete candidate binding | 后续产品 / 编排项目 |
| Production DB migration、bus topic provisioning、production seed data | `03` / `04`产品中立边界 | 未选择durable产品且不应发明真实数据 | 需要时由新ADR和配置 / 运维设计重开 |
| 真实secret、credential、provider principal或material正文 | `04`§8;安全红线 | 只能由外部安全设施在运行期提供 | 只交付descriptor / ref / resolve contract与synthetic negative fixture |
| 物理retention天数、介质与清理runbook | `05` / `06`开放项 | 当前只有condition-based guard,无权威数值 | future`07/09`在硬要求出现时固定 |
| 实现commit、真实design baseline选择、真实`run_id` / EV /测试结果 | 执行期事实 | 当前设计任务不能生成 | 未来真实boundary和run记录 |
| 风险接受、验收结论、runtime authorization与签署 | `06`§13~§14 | 需真实packet和授权角色裁决 | acceptance draft不能替代人 / Agent审查 |

### 7.4 跨仓 / 外部依赖交付物表

| 本仓交付surface | 依赖对象 | 依赖类型 | 当前交付形态 | 完成判定 / 未就绪处理 |
|---|---|---|---|---|
| Shared typed carrier | `quantalithos-core/core-contracts` | compile-time sibling | Cargo path dependency | revision / API compatibility固定且dependency check通过;缺失阻塞首个Cargo boundary |
| Tools调用接缝 | L2-tools | runtime caller | 10 Command / 13 Query中的适用safe surface、port / fake | 无tools Cargo依赖,不实现tool语义;仓缺失不阻塞P0-C |
| Runtime控制接缝 | L2-runtime | runtime caller / event | context / run / control / capture refs和outcome | 不推进agent loop;真实联合loop仅P1 conditional |
| Member orchestration接缝 | L2-member-service | runtime orchestration | member / host safe ref与Sandbox outcome | 不拥有host / session / worker lifecycle;仓缺失不阻塞P0-C |
| Context / responsibility / policy接缝 | identity / work / governance / policy owners | resolver / event | body-free ref / summary、freshness、failure mapping、controlled fake | owner truth不复制;missing / stale / conflict按正式error fail-closed |
| Bus接缝 | `quantalithos-bus` | runtime / event | publisher / consumer adapter、envelope和fake | 不作为compile dependency;真实bus组合属PROFILE-06 |
| Material / archive接缝 | Artifact / archive owner | handoff | candidate material ref、target refs、handoff adapter / receipt | P0-C用fake;receipt不升格Artifact truth;真实target为conditional组合 |
| Observability接缝 | Observability owner | runtime handoff | safe local hook、material ref、backpressure adapter | telemetry不替代formal audit;真实sink未就绪不伪造 |
| Concrete isolation candidate | external backend / provider / lab | runtime / qualification | 一个concrete adapter、immutable manifest schema、controlled probe harness | 产品 / provider / ENV-05未选时P0-Q保持Blocked且0 launch;不得fallback host / fake |

### 7.5 上游范围到交付物反向覆盖

| 上游范围 | 主要交付物 | 覆盖结论 |
|---|---|---|
| C-SBX-1受理与execution environment identity | CODE-002~004 /006~007;CFG-001~005;TEST-001~003 | covered_planned |
| C-SBX-2 coherent resource / filesystem / network / process boundary | CODE-003~005 /009~011;ADP-001 /002;TEST-004 /005 | covered_planned;candidate实例仍是前置 |
| C-SBX-3给定policy与launch enforcement | CODE-003~005;CFG-003~006;ADP-001 /002 | covered_planned;不实现policy truth |
| C-SBX-4 run / capture / handoff / failure / control | CODE-003~012;ADP-001 /002;EVD-001~005 | covered_planned |
| C-SBX-5 lease / cleanup / reaper / redline | CODE-003~012;CFG-005~006;TEST-004 /005;AUTO-003 | covered_planned |
| 18项FR与55协议 | CODE-002~010;TEST-001~003;AUTO-003 inventory check | 18 /18和55 /55保留mechanical gate |
| P0-C + P0-Q | ADP-001 /002;TEST-001~005;AUTO-001~003;EVD-001~005 | 两轴均为mandatory;P0-Q缺资格输入只允许Blocked |
| 254 TC / 21 ESLOT / 17 VETO可判定性 | TEST-001~005;AUTO-001~003;EVD-001~005 | producer capability covered;无runtime结论 |

### 7.6 交付物闭环与后续phase约束

| 闭环维度 | 本Step结论 | Step 5 / 6必须继续闭合 |
|---|---|---|
| 字段 / DTO | owner仍是`03`§6~§7与handoff索引;本Step只引用carrier surface | 每个phase / boundary列exact protocol / DTO owner章节,不得临时补字段 |
| Ref / metadata | typed ref、source version、digest、trace、cursor不得混同 | 在protocol、UoW、artifact boundary绑定构造 / 传递测试 |
| State / error | 30 owner machines /31 canonical enum entries /39 shared declarations和38 typed producer完整纳入交付 | 按可验证纵切绑定状态owner、非法迁移和error mapping |
| Read model | projection / derived / reconciliation只交付P0最小支撑 | query phase必须no-write;rich UX继续排除 |
| Transaction / replay | UoW、version、cursor、三通道replay与19 race为横切交付 | 不能让当前phase依赖后续尚不存在的UoW / fake / result store |
| Config / adapter | strict config、runtime builder、P01~05与candidate adapter均有交付面 | Step 8固定外部准备;受影响boundary关闭version / RFC 8785 / candidate前置 |
| Artifact / evidence | writer、schema、slot和renderer可交付,实例不可预建 | Step 7逐phase绑定TC / suite / gate / planned evidence及失败传播 |
| Phase boundary | 本Step未设计phase或commit boundary | Step 5按功能增量拆phase,Step 6逐boundary做字段 / DTO / state / evidence闭环和经验复核 |
| Design handoff | 正式`07`、ledger和全量skeleton已列为交付 | Step 13必须同步创建,不能只给当前boundary |

### 7.7 复杂度与分批判断

本Step有19个实施surface、23项代码 / 配置 / adapter / 数据交付、13项测试 / 自动化 / evidence capability交付、3项设计handoff交付及15类非交付物。内容按“对象surface”“代码 / 配置”“测试 / evidence”“非交付 / 依赖”“闭环审计”分组,足以让Step 5按可验证功能增量排序,无需复制详细设计对象全集或在本Step提前拆phase。

---

## 8. 正式章节回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_04_objects_deliverables.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“实施对象清单”“交付物清单”“非交付物清单”“跨仓 / 外部依赖交付物表”和“交付物闭环与后续phase约束”,了解每类交付物的来源、预计落点、完成判定及为何不能把planned路径当作执行事实。

正式`07-实施计划.md` §4应收口为:

本轮实施按可验证交付surface组织,不按完整domain对象目录组织。代码面在目标仓建立`contracts/domain/application/infra/api/worker/jobs`七crate,实现10 Command、13 Query、9 Consumer、13 Outbound Event、10 Operations Job及55条flow,并闭合30个正式state enum、38个typed error、UoW / version / cursor、三通道replay、deterministic concurrency、query no-write、job no-repair、relay / handoff no-rollback和safe observability。

配置与adapter面实现单一raw owner、40配置组、I001~I101、D01~D44、strict validation、complete generation、runtime builder、23类material slot和PROFILE-01~05装配。P01~04使用deterministic fake / controlled seam证明P0-C;一个正式选择的concrete candidate adapter、immutable qualification manifest contract和13 CONF harness属于P0-Q mandatory。产品、provider、ENV-05或material identity未闭合时保持Blocked且0 launch,不能删项或fallback。

测试与自动化面实现254条TC、28个数据集、16 suite、7 gate、5个gate脚本、3个report脚本、9个check脚本、九machine schema和21个planned evidence producer。交付的是harness、writer、schema、check、renderer和acceptance draft generator能力;`artifacts/test/<run_id>`、`reports/runs/<run_id>`及acceptance / review文件只能由未来真实执行生成,不得静态创建EV、Passed、risk acceptance、final verdict或signoff。

本轮不交付tools semantic execution、runtime agent loop、member lifecycle、Artifact / Observability / Policy truth、PROFILE-06真实组合、PROFILE-07、生产 / 容量 / DR、rich preview / analytics、operator console、多backend产品面、多宿主调度、production migration / seed或物理retention runbook。编译期sibling dependency只允许`core-contracts`;其余协作方均通过typed ref、port、adapter、event、handoff和fake / controlled seam。

设计移交面在Step 13与正式`07`同步创建`implementation_execution_ledger.md`和Step 6 Boundary Gate Matrix中的全部planned skeleton。当前Step不创建这些文件,也不声明目标仓、实现commit、run、evidence或验收事实存在。

---

## 9. 待确认事项与blocker

| 事项 | 类型 | 是否阻塞Step 5讨论 | 当前处理 | 最迟关闭位置 |
|---|---|---:|---|---|
| 目标仓由独立准备还是首个bootstrap boundary创建 | planning decision | 否 | 已将workspace列为交付物,未创建仓 | Step 5定phase;Step 6定boundary |
| target edition / rust-version exact值 | affected-boundary blocker | 否 | 不写入DEL-SBX-CODE-001的已完成事实 | bootstrap boundary前由design owner固定 |
| concrete candidate产品 / ADR | P0-Q affected-boundary blocker | 否 | ADP-002 / TEST-004保持mandatory | Step 8准备;candidate boundary前关闭 |
| ENV-05 / provider / material identity | P0-Q execution blocker | 否 | manifest schema可交付,实例不伪造 | Step 8;P0-Q执行前固定 |
| RFC 8785实现库 / 工具 | evidence writer blocker | 否 | EVD-001要求fixture,不选择库 | Step 6 / 7对应boundary前关闭 |
| Shell规范与lint工具 | automation blocker | 否 | 17脚本保留交付,不发明规则 | Step 6 / 7首个script boundary前关闭 |
| CI provider / binding path | external integration decision | 否 | 先固定7 gate语义和17脚本 | Step 8或首个CI boundary前固定 |
| implementation ledger / boundary ID | handoff blocker | 否 | DOC-002 /003已列交付,当前不创建 | Step 6定义ID;Step 13创建 |
| 新design baseline commit | implementation handoff blocker | 否 | 当前工作区不伪造commit | Step 13 / 正式移交前由用户决定 |

未发现必须回写正式`00~06`才能进入Step 5的上游设计blocker。上述open项分别阻塞受影响实现boundary或真实执行,不阻塞阶段设计;Step 5不得以“前置未定”为由删除对应mandatory交付物。

---

## 10. 自检与停审

| 自检项 | 结果 |
|---|---|
| 是否回答Step 4六项SOP问题 | 通过,6 /6 |
| 是否避免复制全部对象目录 | 通过,聚合为19个实施surface |
| 每个正式交付物是否有来源、预计落点和完成判定 | 通过,全部`DEL-SBX-*`表均包含 |
| 是否覆盖七crate和55协议 | 通过,7 /7;10 +13 +9 +13 +10 =55 |
| 是否覆盖30 owner machines /31 canonical enum entries /39 shared declarations、38 error、事务 / replay / concurrency | 通过 |
| 是否覆盖40配置组、I001~I101、PROFILE-01~05和sensitive material | 通过 |
| 是否覆盖254 TC、28数据集、16 suite、7 gate、17脚本、九schema和21 slot | 通过 |
| 是否保持P0-Q concrete binding与13 CONF mandatory | 通过;未选择产品或伪造资格事实 |
| 是否明确migration / seed和P1 / P2非交付 | 通过 |
| 是否保持tools / runtime / member / Artifact / Observability / Policy边界 | 通过 |
| 是否区分producer capability与runtime evidence / verdict | 通过 |
| 是否提前拆phase / boundary或创建正式`07` / ledger / skeleton | 否 |
| 是否伪造commit、run、EV、测试结果、风险接受、结论或签署 | 否 |

本Step完成后已停审并经用户确认。后续只允许由`07_implementation_plan_step_05_phases_dependencies.md`承接;仍不得写正式`07`,不得创建implementation ledger、`implementation-boundaries/`或目标实现仓。

---

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 实施对象明确 | passed | 19个surface可供Step 5排序 |
| 交付物可判定且可追溯 | passed | code / config / data / test / automation / evidence capability / handoff均有source、location、criteria |
| 非交付物明确 | passed | 相邻仓truth、P1 / P2、产品运营与执行事实均排除 |
| 跨仓 / 外部依赖边界明确 | passed | 仅core compile;其余seam / fake / external prerequisite |
| P0-C / P0-Q完整且无弱替代 | passed | candidate未定不删除P0-Q |
| 无阻塞Step 5的上游设计冲突 | passed | open项均有受影响boundary与关闭位置 |
| 用户确认Step 4 | passed | 用户已明确“同意”,Step 5获放行 |

```text
step_4_result = completed_reviewed_passed_to_step_5
implementation_surfaces = 19
protocol_inventory = 55
test_contracts = 254
planned_scripts = 17
planned_evidence_slots = 21
allow_step_5_discussion = yes
allow_formal_07_assembly = no
allow_implementation_handoff = no
commit_required = no
```
