# Step 4. 收稳实现单元与文件布局

## 1. Step 状态

- 状态：[x] 本Step校准完成；gate_status=pass；current_part=closed_stop_before_step5。
- 对应SOP：详细设计讨论流程Step4；回填：详细设计§4。
- 开工门禁：[Step3](03_ddd_step_03_constraints.md)pass；项目ledger和03 flow仅允许完成本步，Step5未获本次授权。
- 写入前检查：只创建设计文件；以下路径均为planned实现落点，目标仓不存在，formal_fill_allowed=false。

### 1.1 Step 内计划

| 顺序 | 部分 | 输入 → 本部分产物 → 自检 | 状态 |
|---|---|---|---|
| A | 布局形态/实现单元 | 02分层、Step3 → 选择表/package映射 → 非七CP七crate机械映射 | completed / pass |
| B | 核心library布局 | A完成 → contracts/domain/application逐文件职责 → 对象/入口覆盖与无owner复制 | completed / pass |
| C | 适配/入口/测试布局 | B完成 → infra/api/worker/jobs/test路径 → no-write、无Outbox、Cargo发现 | completed / pass |
| D | 跨部分/历史/回填审计 | A~C完成 → 文件树/职责/依赖/命名总检 → 停在Step5前 | completed / pass |

每部分先问题/依据/诊断/取舍，再结构化/回填摘要/自检；本Step不定义Step5的模块exports、完整依赖矩阵、对象/trait签名或状态矩阵。

## 2. 本步输入

- [Step2](03_ddd_step_02_scope.md)、[Step3](03_ddd_step_03_constraints.md)、[正式02](../02-概要设计.md) §4/5/6/7/12、[正式01](../01-架构设计.md) §7.3。
- `standards/document/子项目目录与代码文件组织规范.md`、详细设计书写规范§5.4、SOP Step4和中间产物规范§3.5/4。
- `projects/L1-governance/design-calibration/03_ddd_step_04_file_layout.md`与artifact对应Step4：只参考映射/目录/职责粒度，不继承outbox/trace/archive/export业务或未经验证的依赖。
- Step3只读本地检查：目标仓不存在；Core contracts实际路径存在，但compile候选未转为已启用。

## 3. SOP 问题回答

1. 有哪些实现单元？选择七个技术role：contracts、domain、application、infra、api、worker、jobs。都是library；worker另有常驻入口，jobs有四个一次性动作入口，api本轮仅传输无关library不创建未选框架的server。
2. 对应哪些概要主体？七CP跨技术层：contracts承载wire/local vocabulary，domain承载局部对象/状态，application承接services与ports，infra适配存储/owner/bus，api/worker/jobs分别承接Command/Query、Consumer、Operations。七role与七CP数量相同不表示一一映射。
3. 路径如何体现边界？目标quantalithos-workspace使用crates/<role>。领域按分区/来源/投影/Inbox/意图/恢复/读取拆文件；应用按正式service与用途明确的port文件拆分；无owner业务域目录。
4. 哪些文件必需？本步给已由02明确职责需要的最小文件集合；本轮只设计不物理创建。具体HTTP路由、DB driver/migrations、CI/deployment、report/gate脚本、交互CLI不列当前必建树；后续决策必须回查本步。
5. 每文件放什么？对象/值/状态、service/port、adapter/handler、测试风险各有指定文件。字段/方法/函数签名与测试case完整契约留Step5~16；文件归属不授予未闭合上游positive schema。
6. slug是什么？workspace。设计导航L1和品牌quantalithos仅用于设计/仓目录，不加入crate/module/type前缀。
7. member目录？crates/contracts、domain、application、infra、api、worker、jobs，不用crates/workspace_domain。
8. Cargo package？workspace-<role>，例如workspace-domain。
9. Rust crate？workspace_<role>，例如workspace_domain。
10. binary如何命名？常驻workspace-worker；一次性request_workspace_recovery、advance_workspace_recovery、supersede_workspace_recovery、invalidate_workspace_view。Advance仅一次有界推进，不在jobs内无期限循环；worker不重复负责该job。
11. 是否层级泄漏？不允许L1/l1_进入源码命名；保留Workspace业务主语前缀不算层级泄漏。
12. 编译依赖在哪里声明？当前已启用sibling集合为空。仅Core候选完成核验后在目标根Cargo的workspace.dependencies声明真实../quantalithos-core/crates/contracts；member继承，不能把根相对路径直接放member manifest。候选不作为当前可复制TOML。
13. 哪些不进Cargo？bus、六L1 owner和下游SDK/product/sync/archive是event/runtime/ref/adapter关系；L2邻域为文档参考。fake只在crate-local测试support，不变生产fallback。

## 4. 当前文档问题诊断

| 位置 | 问题 / 风险 | 处理方向 |
|---|---|---|
| 02 §4/5 | 七CP只有逻辑主体无文件落点 | 选技术role后逐主体映射，不拆七业务服务 |
| 02 §7 / 01 §7.3 | 三入口角色不等三独立部署；Operations是逻辑用例 | library可同宿主组装；worker与一次性jobs不重复运行责任 |
| governance/artifact参考树 | 有Outbox、publisher、archive handoff、route placeholder | 本仓按14入口裁剪，不能复制 |
| 参考树根tests | 虚拟Cargo workspace根tests可能不被自动发现 | 使用member级tests/<suite>.rs，support显式mod |
| Step3 Core候选/DB未定 | 容易列具体未知adapter和误导path声明 | 只给角色文件与明确blocker，不列上游schema/具体driver占位 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 结构 | 七CP+技术分层 | role workspace与逐文件职责 | 编译边界保护领域不依赖I/O |
| 多入口 | 逻辑角色 | library + consumer worker + bounded Operations binaries | 不强制独立服务、不混常驻与一次性 |
| 测试路径 | 尚未映射 | member-local自动发现入口+support | 防止虚拟根tests看似存在却不执行 |
| 外部接缝 | pending合同 | 角色adapter文件、exact schema/driver不伪造 | 可定位后续修订，不冒充实现ready |

## 6. 设计取舍

### A部分：形态决策记录

问题与依据：是否需要多crate，不取决于CP数量；02要求共享局部合同、多类入口、领域纯净与禁止query直接拿写适配。当前没有已确认下游Rust直接import需求，不能把“对外crate复用”当既成理由。

诊断：单crate也能组织目录，但领域不触及adapter的约束主要依靠review；按owner/CP拆crate会切断同分区原子协作。

取舍：采用技术role多crate，接受manifest数量成本，用编译方向保护领域与应用；不采用单crate或每CP一个crate。API先library以避免未选传输框架带来空routes文件；入口可同宿主组合，不规定独立部署。

## 7. 结构化中间产物

### 7.1 A部分结构化结果：布局形态与实现单元

| 候选布局 | 采用 | 判断依据 | 影响 |
|---|---|---|---|
| 单crate模块分层 | 否 | 能组织业务，但本仓要求domain不触及I/O的编译边界 | 不采用，不宣称单crate天生不可实现 |
| 技术role workspace多crate | 是 | 多种入口共享核心逻辑，domain/application依赖倒置可编译约束 | 增加manifest成本；不假设外部消费者已直接import |
| 每CP/每owner一个crate | 否 | 业务与技术轴正交，CP3/4/6需同原子边界 | 不生成七业务服务或六owner truth仓 |

| 实现单元 | 类型 | 职责 | 概要来源 |
|---|---|---|---|
| contracts | library | 本地请求/响应/局部ref与接缝载体，不定义owner schema | 02 §6/7 |
| domain | library | 16局部对象/值/状态、Inbox派生和纯规则 | 02 §5/6/9 |
| application | library | scope/partition/source/apply/local/recovery/query service与ports | 02 §7/8 |
| infra | library | store/owner/bus适配、配置/组装；无truth裁决 | 02 §4/11 |
| api | library | 两Command和六Query的传输无关入口 | 02 §7/8 |
| worker | library + binary | 两种owner事件消费常驻循环，不推进恢复job | 02 §7 Consumer |
| jobs | library + 四binary | 四Operations一次性动作，Advance每次有界推进 | 02 §7 Operations |

| member目录 | 类型 | Cargo package | Rust crate / binary | 对外边界 |
|---|---|---|---|---|
| crates/contracts | lib | workspace-contracts | workspace_contracts / 无bin | workspace协议面；不承诺外部Rust分发或发布 |
| crates/domain | lib | workspace-domain | workspace_domain / 无bin | 仓内 |
| crates/application | lib | workspace-application | workspace_application / 无bin | 仓内 |
| crates/infra | lib | workspace-infra | workspace_infra / 无bin | 仓内组装 |
| crates/api | lib | workspace-api | workspace_api / 无bin | Command/Query逻辑入口，transport binding待定 |
| crates/worker | lib+bin | workspace-worker | workspace_worker / workspace-worker | 可信owner事件接入 |
| crates/jobs | lib+bins | workspace-jobs | workspace_jobs / request_workspace_recovery、advance_workspace_recovery、supersede_workspace_recovery、invalidate_workspace_view | 受控Operations入口，不是通用交互CLI |

A回填摘要：采用技术role多crate，slug=workspace，遵守专门目录规范。七role承载七CP的跨层实现而非一一映射；api library、consumer常驻worker、一次性Operations jobs可以由同一获准宿主组合。未来增加API server/常驻恢复调度必须回查布局和01角色边界，不能从本表推出已有部署。

A自检：每role都能回指02主体/入口；无Outbox/SDK/archive crate；没有把下游直接Rust消费作为既定输入。A gate=pass，允许进入B。

### 7.2 B1 contracts文件小循环

问题/依据：02 §7的四类入口、§6局部ref及读view需要公共协议载体；owner输入和workspace公开请求不能混同。

诊断：直接复制owner事件/ActorContext字段会越过WS-UP；把source payload放任意JSON将掩盖安全边界。取舍：按Command/Query/Consumer输入/Operations/response分文件；不建“共享业务模型全集”。source_inputs只拥有本地已验证输入载体，raw owner schema属于外部adapter正式绑定，未闭合时不构造成功输入。

结构化结果如下；字段/枚举全集和共享符号具体import留Step6~8。

| 计划文件路径 | 所属层 | 定义内容 / 责任 |
|---|---|---|
| `crates/contracts/src/local_refs.rs` | contracts | 本地partition/generation/view/local/page/operation命名边界；不复制GlobalMember/ProjectMember/Core ref |
| `crates/contracts/src/context.rs` | contracts | 本地入口上下文承载与Core metadata复用接点；exact符号受WS-UP-007阻塞 |
| `crates/contracts/src/commands.rs` | contracts | ProvisionWorkspacePartition与ChangeWorkspaceLocalState请求/结果协议 |
| `crates/contracts/src/queries.rs` | contracts | 六Query请求、read selection与模式；不携写入意图 |
| `crates/contracts/src/source_inputs.rs` | contracts | 两Consumer本地验证输入/结果载体；不声明owner event family/schema |
| `crates/contracts/src/operations.rs` | contracts | 四Operations输入/结果载体与受控维护语境 |
| `crates/contracts/src/views.rs` | contracts | 六Query安全响应DTO/页/marker；不重定义domain生命周期 |
| `crates/contracts/src/errors.rs` | contracts | 安全协议错误映射槽位；完整类型/分类由Step8/12定义 |

B1回填摘要：协议按入口族分组，workspace局部ref与外部identity分离；未闭合来源无成功载体构造。B1自检：四入口族覆盖、无outbound、无正文透传；gate=pass，进入B2。

### 7.3 B2 domain文件小循环

问题/依据：02的16对象需唯一领域定义位置，CP4派生不拥有写事务，CP5局部意图不随generation覆盖。诊断：一个projection.rs容纳全部状态会掩盖恢复/意图边界；把每个DTO再做领域对象则产生重复truth。

取舍：按局部业务主语分9个职责文件，一个文件可容纳紧密相关对象；保留纯InboxProjector，不引入全局permission policy。读view是安全输出值而非长期archive snapshot。domain依赖局部contracts词汇但不反向依赖application/infra。

| 计划文件路径 | 所属层 | 定义内容 / 责任 |
|---|---|---|
| `crates/domain/src/partition.rs` | domain | WorkspacePartition、WorkspaceScope局部身份/范围值与不变量，owner关系由已验证输入供给 |
| `crates/domain/src/source.rs` | domain | SourceSlice、VisibilityBinding；验证输入一致性，不创造授权决定 |
| `crates/domain/src/projection.rs` | domain | PartitionProjection、SourceApplicationRecord、SourceCoverage；应用终局和来源覆盖规则 |
| `crates/domain/src/inbox.rs` | domain | InboxItem、InboxProjector纯派生；Present/Withdrawn，不自行提交 |
| `crates/domain/src/local_attention.rs` | domain | LocalAttentionState、ReadCursor；显式局部意图、三值read派生，不触发receipt |
| `crates/domain/src/operation_record.rs` | domain | WorkspaceOperationRecord共享局部结果模型；CP1/5/6各自保有业务操作责任 |
| `crates/domain/src/recovery.rs` | domain | RebuildAttempt、GenerationState、InvalidationRecord；attempt与角色/安全双轴 |
| `crates/domain/src/read_view.rs` | domain | WorkspaceReadView、WorkspacePageCursor；安全组合和页语境，不执行owner查询 |
| `crates/domain/src/errors.rs` | domain | 局部不变量错误，未知/缺口/冲突不得被扁平化为成功 |

B2回填摘要：16对象分布于8个主语文件，另有领域错误；InboxProjector为纯派生协作。B2自检：2+2+3+1+2+1+3+2=16，每对象唯一落点；没有外部truth或I/O，gate=pass，进入B3。

### 7.4 B3 application文件小循环

问题/依据：02规定七个service：ScopeService、PartitionService、SourceReadService、ProjectionApplyService、LocalAttentionService、RecoveryService、WorkspaceQueryService；Scope/Partition分别承接CP1。InboxProjector为domain内部协作，不另造service。

诊断：统一WorkspaceStorePort若只给query一个可写总store将违反no-write；每CP独立事务又破坏CP3/4原子。取舍：store_ports集中本地存储契约，以读与原子写不同能力面约束注入，具体trait签名留Step7；不新建独立CP4 service或“管理所有业务”的operation manager。恢复进度与普通查询分文件。

| 计划文件路径 | 所属层 | 定义内容 / 责任 |
|---|---|---|
| `crates/application/src/scope_service.rs` | application | ScopeService，resolver-first解析/核验；不从ref/字符串推断scope |
| `crates/application/src/partition_service.rs` | application | PartitionService与ProvisionWorkspacePartition；操作记录和局部分区原子创建 |
| `crates/application/src/source_read_service.rs` | application | SourceReadService；只读owner query及visibility绑定，不保存snapshot |
| `crates/application/src/projection_apply_service.rs` | application | ProjectionApplyService/ConsumeSourceChange；调用InboxProjector，同原子应用 |
| `crates/application/src/local_attention_service.rs` | application | LocalAttentionService/ChangeWorkspaceLocalState；局部expected与幂等 |
| `crates/application/src/recovery_service.rs` | application | RecoveryService、四Operations及ConsumeSourceInvalidation；candidate/cutover/失效 |
| `crates/application/src/workspace_query_service.rs` | application | WorkspaceQueryService、六Query；read-only capability与现时裁剪 |
| `crates/application/src/scope_ports.rs` | application | ScopeResolverPort，Personal/Project正式关系读取边界 |
| `crates/application/src/source_ports.rs` | application | OwnerSourcePort、VisibilityResolverPort、RecoverySourcePort，精确owner绑定仍blocked |
| `crates/application/src/store_ports.rs` | application | WorkspaceStorePort能力拆分落点：安全读取/权威结果lookup/分区原子写与UoW，方法后续闭口 |
| `crates/application/src/operation_context.rs` | application | 入口元数据/维护上下文、请求摘要与操作查重编排，不另定义WorkspaceOperationRecord |
| `crates/application/src/errors.rs` | application | 输入拒绝、来源阻塞、局部冲突、unknown等应用错误边界，不直接暴露敏感诊断 |

B3回填摘要：七个service按正式主体分文件，ports归应用层；读写能力在存储边界分开，CP3/4仍同事务，CP1/5/6复用操作记录但各自负责业务。B3自检：14入口全部有服务落点，CP2/4无新增公开API；service计数已核为七，不把InboxProjector重复计算。B gate=pass，进入C。

### 7.5 C1 infra文件小循环

问题/依据：应用ports需要存储、安全owner输入、可见性/范围与恢复来源的技术绑定；consumer还需bus传递适配。配置与运行组装来自02 §11。诊断：按六owner各复制一个client和DTO会提前固化WS-UP；把fake放生产fallback会制造allow或已重放假象。

取舍：按消费职责落文件，不逐owner预造具体API；store_adapter是本仓分区原子存储职责，不是driver已经选定；source/visibility/bus/recovery只有已闭合正式绑定才能正向启用。运行时builder必须区分read capability与write capability，不能向query注入整个可写store。测试fake只在测试support。

| 计划文件路径 | 所属层 | 定义内容 / 责任 |
|---|---|---|
| `crates/infra/src/store_adapter.rs` | infra | 本地原子store与读取capability适配落点；backend/schema/索引待Step11，不声称durable完成 |
| `crates/infra/src/scope_adapter.rs` | infra | 正式identity/work scope关系的只读适配；WS-UP-005未闭合拒绝解析 |
| `crates/infra/src/owner_source_adapter.rs` | infra | 六owner安全读取的技术绑定；不建正文或通用command客户端 |
| `crates/infra/src/visibility_adapter.rs` | infra | 逐owning chain正式决定读取与有效性映射，不本地裁决allow |
| `crates/infra/src/recovery_source_adapter.rs` | infra | owner baseline与获准事件接续绑定；不以projection/SDK/archive作baseline |
| `crates/infra/src/bus_subscription.rs` | infra | bus订阅/传递接缝；本地应用结果到transport动作的绑定需正式合同，不发明ack truth |
| `crates/infra/src/config.rs` | infra | RuntimeConfig/Loader/Validator的配置实现落点，后续Step14/04闭合字段/默认值 |
| `crates/infra/src/runtime_builder.rs` | infra | 配置和ports装配、资源/任务生命周期接点、读写能力隔离；不替owner造输入 |
| `crates/infra/src/errors.rs` | infra | 技术失败到应用分类映射、unknown结果保留；外部敏感详情不直接透出 |

C1回填摘要：adapter按正式消费职责隔离，配置/组装归infra，不建新config或observability crate。C1自检：没有publisher、owner DB共享、fake生产模式或反写端口；driver/owner合同blocked明确，gate=pass，进入C2。

### 7.6 C2入口文件小循环

问题/依据：入口清单固定为两Command、六Query、两Consumer和四Operations；02未授权任何outbound。诊断：将Export放jobs会把只读交接误变写任务；将Advance既放worker循环又放jobs会产生重复调度/命名。

取舍：api分别承载Command/Query handler；worker只处理事件消费，jobs四动作均一次有界调用。bin只解析受控输入/装配/调用service/映射退出，不自行决定scope或直接写store。显式维护的再次Advance需新的受控调用，不能由GET自动启动。

| 计划文件路径 | 所属层 | 定义内容 / 责任 |
|---|---|---|
| `crates/api/src/command_handlers.rs` | api | 两Command入口校验与application调用；不直接操作domain/store |
| `crates/api/src/query_handlers.rs` | api | 六Query入口，export/status保持纯读；只接收只读服务能力 |
| `crates/api/src/errors.rs` | api | 安全响应/错误映射；不泄露隐藏scope/ref/count/provenance |
| `crates/worker/src/main.rs` | worker | workspace-worker启动/受控停机与依赖装配，无业务状态推进捷径 |
| `crates/worker/src/source_change_consumer.rs` | worker | ConsumeSourceChange适配入口，仅调用ProjectionApplyService |
| `crates/worker/src/source_invalidation_consumer.rs` | worker | ConsumeSourceInvalidation入口，明确失效依据，不把gap/timeout当撤销 |
| `crates/worker/src/consumer_loop.rs` | worker | 有界资源的常驻消费循环/退出，delivery处理受bus正式合同约束 |
| `crates/jobs/src/recovery_handlers.rs` | jobs | Request/Advance/Supersede三个Operations处理器，每次有界调用RecoveryService |
| `crates/jobs/src/invalidation_handler.rs` | jobs | InvalidateWorkspaceView一次性处理器，获准依据与target校验 |
| `crates/jobs/src/bin/request_workspace_recovery.rs` | jobs | 显式请求恢复的薄binary，不表示恢复已完成 |
| `crates/jobs/src/bin/advance_workspace_recovery.rs` | jobs | 推进已有attempt一次有界步骤的薄binary，不自循环到完成 |
| `crates/jobs/src/bin/supersede_workspace_recovery.rs` | jobs | 合法replacement下替代旧attempt的薄binary |
| `crates/jobs/src/bin/invalidate_workspace_view.rs` | jobs | 显式视图失效的薄binary，不推断owner tombstone |

C2回填摘要：三类入口各归其位，api没有未定routes/server占位，worker常驻消费，jobs一次性维护。C2自检：14入口映射完整；export不进jobs、无自动GET刷新、无重复恢复loop；gate=pass，进入C3。

### 7.7 C3测试发现与证据边界小循环

问题/依据：Step4要求可直接定位的测试文件；虚拟workspace根不是package，根tests目录不会自动变Cargo集成测试。诊断：照抄参考根tests/contract目录会遗漏Cargo注册；source fixture又易被误当真实schema或授权。

取舍：每个member使用tests/<suite>.rs作为自动发现入口；辅助文件放tests/support并由同crate suite显式mod support。跨层组合由infra/tests用dev-dependency引用api/worker/jobs的library入口；不得形成正常依赖环。fixture只表示局部验证数据，不宣称真实owner schema、event delivery、run_id或evidence。这里只命名风险suite，不定义Step16完整case或执行结果。

| 计划文件路径 | 所属层 | 定义内容 / 责任 |
|---|---|---|
| `crates/contracts/tests/protocol_boundary.rs` | contracts/tests | 四入口族与安全响应的合同边界；待Step8/16填具体case，不凭fixture补owner schema |
| `crates/domain/tests/local_state_invariants.rs` | domain/tests | 局部状态/版本分轴、终局记录和恢复保留不变量风险入口 |
| `crates/application/tests/query_no_write.rs` | application/tests | 六Query/source read无写能力与裁剪语义的测试入口 |
| `crates/application/tests/maintenance_consistency.rs` | application/tests | 应用/意图/恢复的原子、重复、缺口、unknown与cutover风险入口 |
| `crates/application/tests/support/mod.rs` | application/tests/support | 显式导入本crate测试替身，不被生产lib引用 |
| `crates/application/tests/support/fakes.rs` | application/tests/support | 按应用port合同的受控fake，只证明局部行为 |
| `crates/infra/tests/adapter_contract.rs` | infra/tests | storage/source/visibility/bus适配等价与失败分类，真实外部绑定未闭合时blocked |
| `crates/infra/tests/read_model_boundary.rs` | infra/tests | 跨layer库入口组合测试；具体dev-dependency/case在Step5/16审计 |
| `crates/api/tests/read_surface.rs` | api/tests | 只读响应与安全失败映射风险入口 |
| `crates/worker/tests/consumer_boundary.rs` | worker/tests | 重复/乱序/缺口与来源失效接入，应用结果不等ack |
| `crates/jobs/tests/recovery_boundary.rs` | jobs/tests | 四Operations受控入口、一次有界推进与禁止隐式复活 |

C3回填摘要：测试放member-local可发现suite，support显式导入；跨层仅test/dev wiring，不影响生产依赖方向。C3自检：每suite有所属package和风险依据，无虚拟根孤儿tests、无实际运行声明。C gate=pass，进入D总审计。

### 7.8 D部分总审计：根/member入口与完整文件树

问题/依据：A~C各自有唯一文件落点，组合时必须核对manifest/lib/bin/test注册，不能只列业务文件。诊断：根相对Core路径误放member、测试无Cargo owner、同名DTO/domain混同、候选adapter被当已实现均是落码风险。

取舍：文件树仅汇总A~C已讨论文件，补显式根和每member的manifest/lib装配入口（A已确认）；不新增业务契约。不在本树放未选DB migrations、HTTP routes、脚本/CI或真实证据目录。

| 文件路径 | 所属层 | 责任 |
|---|---|---|
| `Cargo.toml` | workspace root | 虚拟workspace成员、统一package属性与已获准依赖声明；无根package |
| `crates/contracts/Cargo.toml` | contracts | workspace-contracts package / lib及适用binary声明 |
| `crates/contracts/src/lib.rs` | contracts | contracts模块入口；正式exports留Step5，不泛化pub use全部内部类型 |
| `crates/domain/Cargo.toml` | domain | workspace-domain package / lib及适用binary声明 |
| `crates/domain/src/lib.rs` | domain | domain模块入口；正式exports留Step5，不泛化pub use全部内部类型 |
| `crates/application/Cargo.toml` | application | workspace-application package / lib及适用binary声明 |
| `crates/application/src/lib.rs` | application | application模块入口；正式exports留Step5，不泛化pub use全部内部类型 |
| `crates/infra/Cargo.toml` | infra | workspace-infra package / lib及适用binary声明 |
| `crates/infra/src/lib.rs` | infra | infra模块入口；正式exports留Step5，不泛化pub use全部内部类型 |
| `crates/api/Cargo.toml` | api | workspace-api package / lib及适用binary声明 |
| `crates/api/src/lib.rs` | api | api模块入口；正式exports留Step5，不泛化pub use全部内部类型 |
| `crates/worker/Cargo.toml` | worker | workspace-worker package / lib及适用binary声明 |
| `crates/worker/src/lib.rs` | worker | worker模块入口；正式exports留Step5，不泛化pub use全部内部类型 |
| `crates/jobs/Cargo.toml` | jobs | workspace-jobs package / lib及适用binary声明 |
| `crates/jobs/src/lib.rs` | jobs | jobs模块入口；正式exports留Step5，不泛化pub use全部内部类型 |

以下树是**计划布局，不是磁盘现状**；共77个计划文件。B/C逐文件表与本节根/member表合起来即完整文件职责表；树由相同清单汇总，所有文件均有职责标注。

```text
quantalithos-workspace/
├─ Cargo.toml  # 虚拟workspace成员、统一package属性与已获准依赖声明；无根package
└─ crates/
   ├─ api/
   │  ├─ Cargo.toml  # workspace-api package / lib及适用binary声明
   │  ├─ src/
   │  │  ├─ command_handlers.rs  # 两Command入口校验与application调用；不直接操作domain/store
   │  │  ├─ errors.rs  # 安全响应/错误映射；不泄露隐藏scope/ref/count/provenance
   │  │  ├─ lib.rs  # api模块入口；正式exports留Step5，不泛化pub use全部内部类型
   │  │  └─ query_handlers.rs  # 六Query入口，export/status保持纯读；只接收只读服务能力
   │  └─ tests/
   │     └─ read_surface.rs  # 只读响应与安全失败映射风险入口
   ├─ application/
   │  ├─ Cargo.toml  # workspace-application package / lib及适用binary声明
   │  ├─ src/
   │  │  ├─ errors.rs  # 输入拒绝、来源阻塞、局部冲突、unknown等应用错误边界，不直接暴露敏感诊断
   │  │  ├─ lib.rs  # application模块入口；正式exports留Step5，不泛化pub use全部内部类型
   │  │  ├─ local_attention_service.rs  # LocalAttentionService/ChangeWorkspaceLocalState；局部expected与幂等
   │  │  ├─ operation_context.rs  # 入口元数据/维护上下文、请求摘要与操作查重编排，不另定义WorkspaceOperationRecord
   │  │  ├─ partition_service.rs  # PartitionService与ProvisionWorkspacePartition；操作记录和局部分区原子创建
   │  │  ├─ projection_apply_service.rs  # ProjectionApplyService/ConsumeSourceChange；调用InboxProjector，同原子应用
   │  │  ├─ recovery_service.rs  # RecoveryService、四Operations及ConsumeSourceInvalidation；candidate/cutover/失效
   │  │  ├─ scope_ports.rs  # ScopeResolverPort，Personal/Project正式关系读取边界
   │  │  ├─ scope_service.rs  # ScopeService，resolver-first解析/核验；不从ref/字符串推断scope
   │  │  ├─ source_ports.rs  # OwnerSourcePort、VisibilityResolverPort、RecoverySourcePort，精确owner绑定仍blocked
   │  │  ├─ source_read_service.rs  # SourceReadService；只读owner query及visibility绑定，不保存snapshot
   │  │  ├─ store_ports.rs  # WorkspaceStorePort能力拆分落点：安全读取/权威结果lookup/分区原子写与UoW，方法后续闭口
   │  │  └─ workspace_query_service.rs  # WorkspaceQueryService、六Query；read-only capability与现时裁剪
   │  └─ tests/
   │     ├─ maintenance_consistency.rs  # 应用/意图/恢复的原子、重复、缺口、unknown与cutover风险入口
   │     ├─ query_no_write.rs  # 六Query/source read无写能力与裁剪语义的测试入口
   │     └─ support/
   │        ├─ fakes.rs  # 按应用port合同的受控fake，只证明局部行为
   │        └─ mod.rs  # 显式导入本crate测试替身，不被生产lib引用
   ├─ contracts/
   │  ├─ Cargo.toml  # workspace-contracts package / lib及适用binary声明
   │  ├─ src/
   │  │  ├─ commands.rs  # ProvisionWorkspacePartition与ChangeWorkspaceLocalState请求/结果协议
   │  │  ├─ context.rs  # 本地入口上下文承载与Core metadata复用接点；exact符号受WS-UP-007阻塞
   │  │  ├─ errors.rs  # 安全协议错误映射槽位；完整类型/分类由Step8/12定义
   │  │  ├─ lib.rs  # contracts模块入口；正式exports留Step5，不泛化pub use全部内部类型
   │  │  ├─ local_refs.rs  # 本地partition/generation/view/local/page/operation命名边界；不复制GlobalMember/ProjectMember/Core ref
   │  │  ├─ operations.rs  # 四Operations输入/结果载体与受控维护语境
   │  │  ├─ queries.rs  # 六Query请求、read selection与模式；不携写入意图
   │  │  ├─ source_inputs.rs  # 两Consumer本地验证输入/结果载体；不声明owner event family/schema
   │  │  └─ views.rs  # 六Query安全响应DTO/页/marker；不重定义domain生命周期
   │  └─ tests/
   │     └─ protocol_boundary.rs  # 四入口族与安全响应的合同边界；待Step8/16填具体case，不凭fixture补owner schema
   ├─ domain/
   │  ├─ Cargo.toml  # workspace-domain package / lib及适用binary声明
   │  ├─ src/
   │  │  ├─ errors.rs  # 局部不变量错误，未知/缺口/冲突不得被扁平化为成功
   │  │  ├─ inbox.rs  # InboxItem、InboxProjector纯派生；Present/Withdrawn，不自行提交
   │  │  ├─ lib.rs  # domain模块入口；正式exports留Step5，不泛化pub use全部内部类型
   │  │  ├─ local_attention.rs  # LocalAttentionState、ReadCursor；显式局部意图、三值read派生，不触发receipt
   │  │  ├─ operation_record.rs  # WorkspaceOperationRecord共享局部结果模型；CP1/5/6各自保有业务操作责任
   │  │  ├─ partition.rs  # WorkspacePartition、WorkspaceScope局部身份/范围值与不变量，owner关系由已验证输入供给
   │  │  ├─ projection.rs  # PartitionProjection、SourceApplicationRecord、SourceCoverage；应用终局和来源覆盖规则
   │  │  ├─ read_view.rs  # WorkspaceReadView、WorkspacePageCursor；安全组合和页语境，不执行owner查询
   │  │  ├─ recovery.rs  # RebuildAttempt、GenerationState、InvalidationRecord；attempt与角色/安全双轴
   │  │  └─ source.rs  # SourceSlice、VisibilityBinding；验证输入一致性，不创造授权决定
   │  └─ tests/
   │     └─ local_state_invariants.rs  # 局部状态/版本分轴、终局记录和恢复保留不变量风险入口
   ├─ infra/
   │  ├─ Cargo.toml  # workspace-infra package / lib及适用binary声明
   │  ├─ src/
   │  │  ├─ bus_subscription.rs  # bus订阅/传递接缝；本地应用结果到transport动作的绑定需正式合同，不发明ack truth
   │  │  ├─ config.rs  # RuntimeConfig/Loader/Validator的配置实现落点，后续Step14/04闭合字段/默认值
   │  │  ├─ errors.rs  # 技术失败到应用分类映射、unknown结果保留；外部敏感详情不直接透出
   │  │  ├─ lib.rs  # infra模块入口；正式exports留Step5，不泛化pub use全部内部类型
   │  │  ├─ owner_source_adapter.rs  # 六owner安全读取的技术绑定；不建正文或通用command客户端
   │  │  ├─ recovery_source_adapter.rs  # owner baseline与获准事件接续绑定；不以projection/SDK/archive作baseline
   │  │  ├─ runtime_builder.rs  # 配置和ports装配、资源/任务生命周期接点、读写能力隔离；不替owner造输入
   │  │  ├─ scope_adapter.rs  # 正式identity/work scope关系的只读适配；WS-UP-005未闭合拒绝解析
   │  │  ├─ store_adapter.rs  # 本地原子store与读取capability适配落点；backend/schema/索引待Step11，不声称durable完成
   │  │  └─ visibility_adapter.rs  # 逐owning chain正式决定读取与有效性映射，不本地裁决allow
   │  └─ tests/
   │     ├─ adapter_contract.rs  # storage/source/visibility/bus适配等价与失败分类，真实外部绑定未闭合时blocked
   │     └─ read_model_boundary.rs  # 跨layer库入口组合测试；具体dev-dependency/case在Step5/16审计
   ├─ jobs/
   │  ├─ Cargo.toml  # workspace-jobs package / lib及适用binary声明
   │  ├─ src/
   │  │  ├─ bin/
   │  │  │  ├─ advance_workspace_recovery.rs  # 推进已有attempt一次有界步骤的薄binary，不自循环到完成
   │  │  │  ├─ invalidate_workspace_view.rs  # 显式视图失效的薄binary，不推断owner tombstone
   │  │  │  ├─ request_workspace_recovery.rs  # 显式请求恢复的薄binary，不表示恢复已完成
   │  │  │  └─ supersede_workspace_recovery.rs  # 合法replacement下替代旧attempt的薄binary
   │  │  ├─ invalidation_handler.rs  # InvalidateWorkspaceView一次性处理器，获准依据与target校验
   │  │  ├─ lib.rs  # jobs模块入口；正式exports留Step5，不泛化pub use全部内部类型
   │  │  └─ recovery_handlers.rs  # Request/Advance/Supersede三个Operations处理器，每次有界调用RecoveryService
   │  └─ tests/
   │     └─ recovery_boundary.rs  # 四Operations受控入口、一次有界推进与禁止隐式复活
   └─ worker/
      ├─ Cargo.toml  # workspace-worker package / lib及适用binary声明
      ├─ src/
      │  ├─ consumer_loop.rs  # 有界资源的常驻消费循环/退出，delivery处理受bus正式合同约束
      │  ├─ lib.rs  # worker模块入口；正式exports留Step5，不泛化pub use全部内部类型
      │  ├─ main.rs  # workspace-worker启动/受控停机与依赖装配，无业务状态推进捷径
      │  ├─ source_change_consumer.rs  # ConsumeSourceChange适配入口，仅调用ProjectionApplyService
      │  └─ source_invalidation_consumer.rs  # ConsumeSourceInvalidation入口，明确失效依据，不把gap/timeout当撤销
      └─ tests/
         └─ consumer_boundary.rs  # 重复/乱序/缺口与来源失效接入，应用结果不等ack
```

### 7.9 CP到文件与入口反查

表内路径分别相对domain/src和application/src，具体全路径见§7.3/7.4。

| CP | 领域文件 | 应用文件 | 入口落点 |
|---|---|---|---|
| CP1 | partition.rs、operation_record.rs | scope_service.rs、partition_service.rs、scope_ports.rs | api/command_handlers.rs：Provision |
| CP2 | source.rs | source_read_service.rs、source_ports.rs | 内部调用，不新增API |
| CP3 | projection.rs | projection_apply_service.rs、store_ports.rs | worker/source_change_consumer.rs |
| CP4 | inbox.rs | CP3/CP6调用InboxProjector | 无独立入口/事务 |
| CP5 | local_attention.rs、operation_record.rs | local_attention_service.rs | api/command_handlers.rs：Change；读取归CP7 |
| CP6 | recovery.rs、operation_record.rs | recovery_service.rs、source_ports.rs、store_ports.rs | worker/source_invalidation_consumer.rs、jobs两个handler/四bin |
| CP7 | read_view.rs | workspace_query_service.rs | api/query_handlers.rs：六Query，含export/status |

入口列路径省略crates/<role>/src前缀，仅用于索引，不是另建目录。contracts/views是外部DTO，domain/read_view是内部值对象；不得用同一名字定义两份不同字段的“领域truth”，具体命名和转换由Step6/8闭合。

### 7.10 依赖声明位置与保护方向

当前**已启用外部sibling编译依赖为空**；不输出“已确认path依赖表”的假成员。以下是唯一候选的关闭后落点核对，不是当前Cargo配置：

| 候选 / 状态 | 允许声明位置（关闭后） | 已观察真实crate位置 | 条件与限制 |
|---|---|---|---|
| Core contracts / WS-UP-007 open | 目标根Cargo.toml的workspace.dependencies | /home/aris/Projects/quantalithos-core/crates/contracts；package core-contracts | 根相对位置../quantalithos-core/crates/contracts；schema/定义/export/使用范围闭合后member继承，不照抄到member相对路径 |

同仓planned依赖先固定方向，完整逐模块允许矩阵留Step5：contracts不依赖其他本仓层；domain可使用contracts局部词汇，不依赖application/infra/入口；application使用domain/contracts并定义ports；infra实现application ports；api/worker/jobs调用application，只有组装代码可引用infra，不得handler直接写store。测试dev-dependency与正常依赖分别审查，不把fake导入生产lib。

根workspace统一登记本地role依赖位置crates/<role>，成员通过workspace继承；七member各有自己的Cargo和lib入口，worker的main默认对应workspace-worker，jobs的src/bin四文件对应四动作名。API无bin、根无package，所以测试必须位于member或显式注册，不能误认为根tests自动可运行。

runtime/event/ref/adapter/fake关系不能变为path：bus、六L1 owner、SDK/product/sync/archive无Cargo入口；L2相邻项目无runtime依赖。Core paths的中期private git tag/rev未给真实值，留07实际核验。

### 7.11 命名与闭环自检

| 检查 | 可判断条件 | 本次结论 |
|---|---|---|
| 布局资格 | 技术role理由独立于CP数量、外部Rust消费者不预设 | 通过 |
| 仓/slug/member | quantalithos-workspace / workspace / crates/<role> | planned路径一致，目标仓未创建 |
| package/crate/bin | workspace-<role> / workspace_<role> /入口或动作名 | 7 package、7 library、5 bin一致 |
| 目录前缀 | 无crates/workspace_domain、L1/l1_实现名 | 通过 |
| 模糊文件 | 无utils/common/helper/manager或第二套infrastructure | 通过 |
| 对象/入口覆盖 | 16对象唯一domain落点；14入口；CP2/4无新增公开API | 通过 |
| 读写/原子 | Query只读能力；CP3/4同原子；CP5意图不随cutover覆盖 | 结构保持；具体签名/事务仍待后续Step |
| 外部truth | 无六owner正文/authorization engine/执行/seed/archive/SDK | 通过 |
| consumer/Operations | worker只常驻消费；jobs每次有界；export属于Query | 通过 |
| Cargo发现 | 每测试suite有member Cargo；support显式mod | 计划可发现；未执行Cargo测试 |
| blocked真实 | Core候选、owner schema、driver、transport不被路径命名关闭 | 通过；不表示正向可用 |
| 未来文件 | 未列migrations/routes/outbox/scripts/reports/evidence空占位 | 通过 |

复杂度判断：已按A/B1~B3/C1~C3/D串行完成小循环，77个已知职责文件可在本Step审查；不再拆附录。后续Step5~16若新增必要文件，必须先回修本Step与flow，不在正式03暗增。

D回填摘要：§7.1映射、§7.2~7.8职责/树、§7.9覆盖与§7.10~7.11检查共同交付实现布局。后置历史对照及最终停点审计已完成，D gate=pass；仅代表计划布局，不是实现事实。

## 8. 回填草稿

### 8.1 后置历史差异审计（校准记录，不进正式正文）

| 历史/参考材料位置 | 旧口径 | 判断 | 理由与影响 |
|---|---|---|---|---|
| 本项目README头部/§三 | 未完成00/01，清单缺04 | 废弃进度来源 | 以当前ledger与正式00/01/02为准，不修改旧占位README |
| draft/03 §1/2 | 九候选职责、Outbox/Read Handoff | 重映射/裁剪 | 按当前七CP跨role映射；无outbound family，不建Outbox |
| draft/03 §3 | Personal/Project、RefreshAttempt等候选对象 | 不直接继承 | 02的统一scope/attempt/16对象作为输入，不为页面增独立crate |
| governance/artifact Step4实现树 | outbox/publisher/trace/archive/export job、routes占位 | 不继承 | workspace无这些写职责；export为Query，API transport未选 |
| governance/artifact Step4根tests | 测试路径以根tests分类 | 改为member-local suite | 目标是虚拟workspace，必须让Cargo可发现或显式注册 |
| governance Step4 Core声明 | 默认root依赖并广泛member引用 | 不继承已确认判断 | 本仓Core只有候选，逐symbol和必要性需继续核验 |

### 8.2 详细设计§4回填草稿

本仓遵守《子项目目录与代码文件组织规范》，采用技术role的Rust workspace多crate形态。目标路径为/home/aris/Projects/quantalithos-workspace，slug=workspace；当前仅为计划布局，未创建实现仓。

布局形态/实现单元/package/crate/binary映射采用§7.1，具体文件职责采用§7.2~7.8，完整文件树采用§7.8。七个role分别承载公共局部合同、领域值/状态、应用编排/ports、适配/配置/组装、同步访问、事件消费和一次性维护；七CP按§7.9跨层映射，不是七个独立服务。16对象和14入口均有唯一责任落点，CP2/4无新增公开API，Outbox不适用。

测试入口放各member的tests/<suite>.rs，辅助模块显式导入。API当前为library handler，worker常驻消费，四jobs每次有界维护；可按01既定逻辑角色同宿主组装，不强制独立部署。编译保护方向、候选Core声明位置与命名审查采用§7.10/7.11。未闭合的owner/driver/transport不能因存在计划文件名而启用。

### 8.3 回填成熟度

以上仅为§4可装配草稿，不是正式03。对象字段/trait/API schema/函数流/状态矩阵/持久化/配置/测试case未在本Step展开；后续若正式契约需要增减文件，必须回修本Step对应部分和flow后再装配。

## 9. 待确认事项

| pending | 影响 | 后续必读 / 关闭位置 |
|---|---|---|
| WS-UP-001~008/006-S | 外部safe输入/事件/权限/scope/export/Core/执行与seed边界 | Step1 §7.3及owning正式合同；不在workspace补truth |
| 本地目标仓未创建 | 无实际manifest/toolchain/源码/git identity | 07及另行授权实施前检查；本轮不创建 |
| 持久化driver/schema未选 | store_adapter正向durable不可开工 | Step11论证分区原子/索引/unknown与03→04绑定，必要时回修布局 |
| API transport/宿主绑定未选 | 只有library入口，无可运行server承诺 | Step8/14与04；新增host/route须回修布局，不私造产品协议 |
| Tokio精确pin/features及其他第三方闭包未定 | 未形成可编译dependency lock | Step7/8/11/12/14及07，未运行cargo验证 |
| Step5及以后用户范围 | 当前只允许完成Step4 | 等新确认再读Step5，不创建未来Step产物 |

这些后续设计项并非新发现的上游owner blocker，不能与WS-UP混称，也不阻塞本步范围内的计划布局自检。

## 10. 进入下一步条件

A/B1~B3/C1~C3/D均完成来源/问题/诊断/取舍、结构化/回填摘要/自检；最终历史差异审计与正式§4草稿完成。七role、77计划文件（含根Cargo）、16对象、14入口、五binary映射一致；四Step十段结构、Markdown链接/代码围栏与台账停点完成静态检查。

gate_status=pass；gate_reason=Step4计划布局与跨部分审计完成，外部WS-UP及后续契约pending保留；next_allowed_action=wait_user_before_step5；formal_fill_allowed=false。

已在Step5开始前停止。未创建Step5文件、正式03、目标实现仓或任何源码；未运行项目测试、生成真实证据或提交commit。此处不是正式03完成停审，也不是用户逐条signoff。
