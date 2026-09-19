# Step 2. 明确实施目标、范围和非范围

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 2
> 回填章节：`07-实施计划.md` §2 实施目标与范围
> 执行模式：`full-restart + single-agent-serial`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 2 · 明确实施目标、范围和非范围 |
| 当前状态 | `done / pass / self_reviewed` |
| 输入基线 | Step 1 输入边界；正式 `00`～`06` 的范围、实现、测试和验收章节 |
| 正式 07 写入 | `false`；仅 Step 13 full-restart 允许 |
| 实现移交 | `blocked / wait_design`；目标实现仓不存在且 exact owner/SDK contract 未闭口 |
| 下一动作 | 进入 Step 3 · 收稳前置条件与阅读清单 |

## 2. 本步输入

| 输入 | 主要来源 | 本步用途 | 结论 |
|---|---|---|---|
| 需求目标、非目标与核心闭环 | `00-需求文档.md` §4、§7、§9、§10、§14 | 确认实施目标不得扩大为 owner truth 或相邻产品 | 采用 `G-CON-001~007`、`C-CON-1~6`、`FR-CON-001~018`；`FR-CON-E01~E03` 不进入当前 P0 |
| 客户端架构边界 | `01-架构设计.md` §3～§8 | 固定 SDK/formal-boundary-only、客户端只收紧、无第二 truth | 作为所有 phase 的不可变红线 |
| 交互与对象骨架 | `02-概要设计.md` §2、§6～§12 | 确认实现纵切主语而不是页面/对象清单 | 以 context/access/view/intent/topic/recovery 五组骨架组织 |
| 可落码契约 | `03-详细设计.md` §4～§17 | 抽取十模块、5 Command、16 Query、1 consumer 及状态/错误/一致性 | 可规划安全骨架；正向 owner binding 仍 conditional |
| 测试范围与证据 | `05-测试方案.md` §2、§8～§14 | 确认 P0 safety、negative、semantic、static、evidence integrity | 未来执行；不把 planned suite 当结果 |
| 验收范围与 VETO | `06-验收标准.md` §2、§5～§14 | 确认实施完成必须可生成可判定路径 | 适用 P0 必须可验证；最终 verdict 不在 07 产生 |

## 3. SOP 问题回答

### 3.1 本轮实施的最小可交付结果是什么

最小可交付结果是一个 planned 的 TypeScript/ESM 浏览器客户端实现路径：它能够在目标实现仓存在且正式 owner/SDK 合同闭口后，按可验证 phase 建立安全的会话/访问语境、导航、owner-safe 查询、受控意图、八主题 owner 分区、局部恢复、语义可访问性、session-volatile 客户端状态和 body-free diagnostics。这里的“可交付”只描述未来实现应达到的范围，不表示实现仓、源码、构建、测试、artifact、report 或验收事实已经存在。

P0 的判断轴是客户端安全和语义闭环，而不是“页面数量”或“已接入 owner 数量”：

- 所有受保护视图和意图都先经过 formal actor/scope/visibility/qualification 语境，无法验证即收紧。
- 16 个 Query 保持 source 与五类状态轴，且不写 owner truth 或 client carrier。
- 5 个 Command 只把 `OwnerCommandPort.submit` 作为唯一可能的 owner side effect；receipt、toast、transport success 和刷新不提升正式状态。
- 八个管理主题按 owner 分区组合；partial、stale、missing、unavailable、conflict、unknown 不被合成为统一 readiness/health/verdict。
- recovery 与 keyboard/screen-reader/AT 语义路径共享同一 guard、action、outcome 和 ceiling。
- 配置、依赖、redaction、静态架构和未来证据路径可被门禁检查，但不生成任何执行结论。

### 3.2 哪些需求编号必须覆盖

| 需求族 | 本轮处理 | 实施含义 |
|---|---|---|
| `G-CON-001~007` | 覆盖 | 作为 phase 总目标；每个 phase 至少映射一个目标和一个 P0 gate |
| `C-CON-1~6` | 覆盖 | 作为六条核心纵切闭环，不按页面拆成独立 truth |
| `FR-CON-001~018` | 覆盖 | 通过模块/Port/flow/state 的安全骨架与 future contract 映射；positive owner 面按条件启用 |
| `FR-CON-E01~E03` | 不进入当前 P0 | 记录为 future/selected residual，不得阻塞核心安全实施 |
| `BR-CON-*`、`DR-CON-*`、`NFR-CON-*` | 覆盖其已收稳部分 | 由 03 的不变量、05 的 TC/gate 和 06 的 AC/VETO 约束；不重新发明阈值 |
| `AC-CON-001~007`、`AC-FR-*`、`AC-BR-*`、`AC-DR-*`、`AC-NFR-*` | 形成可执行路径 | 07 只绑定 phase/boundary 门禁，不填写 pass/verdict |
| `VETO-CON-001~007` | 逐 phase 前置规避 | 任一命中均阻断当前 boundary/phase；不可风险接受或由其他成功抵消 |

### 3.3 哪些详细设计章节必须落地

| 详细设计面 | 当前计划如何承接 | 不能在 07 中新增的内容 |
|---|---|---|
| §4 十模块与文件布局 | 作为 planned implementation modules 和 boundary scope | 不把 planned path 写成已存在文件 |
| §5 模块契约、§6 对象/Port/Protocol 索引 | 作为 boundary 的 required reads 和 design gate | 不补字段、方法、错误码或 owner schema |
| §7 5 Command/16 Query/1 consumer | 作为协议 inventory 和阶段验证集合 | 不新增 Event、Job、BFF、repository 或 projection |
| §8 函数流、§9 状态机 | 作为实现顺序和状态/错误 gate | 不改正式状态名、不把 local state 升格为 formal truth |
| §10～§12 一致性、错误、并发 | 作为 state/adapter/recovery boundary 的 gate | 不假定 durable medium、CAS、multi-tab 或未知结果可 replay |
| §13～§15 配置、诊断、测试切口 | 作为 PH-01/PH-06/PH-07 输入 | 不把 config、diagnostic receipt 或 planned test 当运行事实 |
| §16～§17 承接清单、风险 | 作为 implementation blocker 和 handoff 条件 | 不由实现者临时补设计缺口 |

### 3.4 哪些验收项必须在本轮可判定

本轮实施计划必须使未来实现能够判定以下 P0 类别：

1. truth/access/phase/body/inference/a11y/isolation 七类 VETO 负向红线。
2. context、navigation、views、intent、topics、recovery、state、diagnostic 和 configuration 的 deterministic safety/negative/semantic 断言。
3. 16 Query zero-write、唯一 owner write、unknown no-replay、局部 failure isolation、strict whole-document config、zero-secret 和架构 absence。
4. 05 中定义的 artifact/report/evidence pairing、digest、redaction、no-static-evidence 和审查路径。
5. 在 facet 声明 enabled 后，exact owner/SDK contract-derived positive evidence 的缺失能阻断对应范围；未 enabled 的 facet 必须诚实保持 disabled/read-only/partial/blocked。

`06` 的三值 verdict、risk acceptance、signoff 和 readiness 仍只属于真实验收执行阶段。07 不填写任何实际结果。

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| 目标实现仓 `/home/aris/Projects/quantalithos-console` 不存在 | 无法验证 package、toolchain、worktree 或 build | 保留 `BLK-CON-07-001`；所有 boundary 先 `planned/blocked` |
| exact owner/SDK surface、scope/qualification/safe-field 和 reconciliation 未闭口 | 正向 adapter、submit、active posture 可能被猜造 | 保留 `BLK-CON-07-002` 与 `CON-Q-034~043`；只规划 safe/disabled posture |
| design baseline 未固定 | 无法绑定真实 implementation commit 或 handoff | 保留 `BLK-CON-07-003`；使用 `design_baseline=not_fixed` |
| browser/AT、diagnostic sink、carrier medium、量化 authority 未选择 | selected gate 集合不可判定 | 作为 `RES-CON-07-001` 和后续 Step 8/9 residual |
| 旧 README/draft/旧协议可能诱导范围膨胀 | 会把 Provider、固定指标、服务端模型带入 Console | 只作 historical_material；不进入范围表 |

## 5. 实施目标表

| 目标 ID | 实施目标 | 来源 | 未来完成判定（planned） |
|---|---|---|---|
| `IMP-CON-001` | 建立安全 bootstrap、正式访问语境和 session shell | `G-CON-001/002`；03 §5、§8、§9 | formal context 不可验证时 fail-closed；旧 scope 清理；无本地授权推导 |
| `IMP-CON-002` | 建立 source-preserving owner-safe Query/view 消费面 | `G-CON-003`；03 §5～§8 | 16 Query 可按 value/empty/blocked/unavailable/unknown 映射；filter/window 只作用于安全材料；write=0 |
| `IMP-CON-003` | 建立 draft/request/result 分层与受控 Command seam | `G-CON-004`；03 §7～§12 | 唯一 owner side effect 为 submit；receipt≠confirmed；ambiguous→unknown；无依据 replay |
| `IMP-CON-004` | 建立八主题 owner partition 与局部降级 | `G-CON-005`；03 §5～§8 | canonical composition、failure isolation、owner/source 归属保真；不合成 readiness |
| `IMP-CON-005` | 建立显式恢复与语义可访问等价 | `G-CON-006`；03 §9、§11、§15 | subject-specific recovery ceiling；三通道同 guard/action/outcome；不自动重复副作用 |
| `IMP-CON-006` | 建立 scoped client state、conditional invalidation 与 body-free diagnostics | `G-CON-006/007`；03 §10～§15 | whole-record、single-writer、late-drop、单调收紧；diagnostics whitelist/redaction/isolation |
| `IMP-CON-007` | 建立可审计的配置、测试、证据和 handoff 路径 | `05`、`06`、04 §3～§12 | future gate/artifact/report/evidence 路径可生成；当前无实例、无 verdict |

## 6. 实施范围表

| 范围项 | 来源 | 优先级 | 本轮实施口径 | 条件/上限 |
|---|---|---|---|---|
| `entry/access/navigation` | 03 §5、05 §2/§6 | P0 | bootstrap、context、visibility、route/selection/history cleanup | 不签发身份或授权 |
| `views` 与 8 Core Query | 03 §5/§7/§8 | P0 | safe mapping、五轴、strict empty、zero-write | 不验证 owner DB/projection |
| `intent` 与 5 Command | 03 §5/§7～§12 | P0 safety；positive conditional | draft/request/result、eligibility、single-flight、unknown/no-replay | exact submit 依赖正式 owner/SDK contract |
| `features` 与 8 Topic Query | 03 §5/§7/§8 | P0 safety；positive conditional | 八主题 canonical partition、局部 failure、blocked/read-only/partial | 不拥有八类 owner truth |
| `recovery` 与 semantic a11y | 03 §5/§9/§11/§15 | P0 semantic | typed recovery、one-action ceiling、focus/announce/fallback | 具体 browser/AT matrix 后置 |
| `adapters` 与 formal seams | 03 §5/§7/§13 | P0 safety；P1 positive | narrow Port、safe mapper、typed failure、fake/formal parity | 不直连 private transport |
| `state` carrier 与 invalidation consumer | 03 §5/§10/§12 | P0 session/disabled；P1 observed | exact scope、whole-record、single writer、monotonic tightening | carrier medium/order/dedup 未闭口 |
| `diagnostics` | 03 §5/§14 | P0 disabled/fake safety | whitelist、body-free redaction、sink isolation | production sink/envelope 后置 |
| 配置与 profile | 04 §3～§12 | P0 | 恰好四项、三个 profile、strict/startup-only、fail-closed | profile 不等 readiness |
| 测试/证据/验收 handoff | 05 §9/§13/§14；06 §3/§10/§14 | P0 support | suite/check/report/artifact/evidence contract 可生成 | 不创建真实实例或 verdict |
| 静态 absence/依赖 | 01、03、05、06 | P0 | SDK-only、无 DB/repository/private bus/BFF/worker/job、5+16+1 | 由未来 static gate 检查 |

## 7. 非范围表

| 非范围 | 来源 | 处理口径 |
|---|---|---|
| 成员、项目、工作、流程、治理、制品、workspace、方法、能力、观测、归档、sandbox truth | `00` NG-CON-001；`01` §3～§4 | 只消费 owner-safe view/ref；不存储、修复或重定义 |
| 本地认证、RBAC/Policy/Gate/审批/合规/readiness 裁决 | `00` NG-CON-002；`01` §3.3 | 只呈现正式决定与安全解释；不从 UI/flag/cache 推导 |
| DB、repository、UnitOfWork、projection、outbox、BFF、private bus、worker/job | `00` NG-CON-003；03 §2/§4 | static forbidden；不得作为实现 shortcut |
| evidence/audit/report/archive package 正文生成与保存 | `00` NG-CON-004；03 §14 | 只持有 body-free ref/enum/digest；正式 owner 负责正文 |
| Chat、Runner、Sync、Marketplace、Bridges 主流程及未停审 L5/L6 私有状态 | `00` NG-CON-005；06 §2.4 | `pending/disabled`；不进入主链或 P0 positive |
| Provider Contract、固定控制/指标数量、无 authority 数字、前端 framework/router/bundler | `00` NG-CON-006；历史污染审计 | 保持 pending；需正式 authority 与设计回写 |
| durable/cross-session carrier、multi-tab CAS、online LKG、hot reload/remote config | 03 §10/§13；04 §13 | current scope 只承诺 session-volatile/startup-only |
| production owner integration、browser/AT compatibility、quantitative/load/SLO、production diagnostic sink | 05 §8/§10/§14；06 §2/§9/§13 | selected/P1/P2 residual；enabled 后另行 baseline 与复验 |
| implementation repo、commit、run/artifact/report/evidence、verdict/signoff/readiness | 06 §3/§14；07 Step 1 | 绝不在设计阶段伪造 |

## 8. P0/P1/P2 防膨胀规则

| 层级 | 允许内容 | 不得发生 |
|---|---|---|
| P0 | deterministic safety、negative、semantic、static、dependency、config、evidence-integrity path；fake/controlled/disabled seam | 不因 UI 可见、fake 成功、profile 名称或测试计数宣称 owner integration/readiness |
| P1 | authority 到达且 exact contract 固定后的 selected owner/SDK、invalidation、browser/AT 或 integration positive | 不把 pending contract 猜成 schema；不阻塞未启用 facet 的 P0 safety |
| P2 | durability、production diagnostics、量化、capacity、外围增强和相邻产品深链 | 不进入当前 P0 phase；升级前必须回写范围、配置、测试、验收与 baseline |

规则补充：

1. facet 未启用或合同未闭口时，最强允许姿态是 `disabled/read-only/partial/blocked`，并且必须 no-call/no-fake。
2. facet 声明 enabled 后，必须由 contract-derived positive evidence 支撑；缺证据即阻断对应 boundary，不得用 P0 safety 替代。
3. 任一 `VETO-CON-001~007`、P0 S 级红线、Query write、forbidden body、unknown replay、静态造证据或 partition failure 扩散，都不能通过风险接受降级。
4. phase/boundary 只描述未来落地顺序，不授予当前实现权限；目标仓不存在或 design baseline 未固定时全部保持 planned/blocked。

## 9. 改动前后对比

| 项 | 进入本步前 | 收口后 |
|---|---|---|
| 实施目标 | 分散在 00/03/05/06，容易按页面或 owner 数量膨胀 | 七个可验证客户端目标，绑定正式需求/设计/门禁 |
| P0 边界 | safety 与 positive integration 可能混同 | P0 safety/negative/semantic/static/evidence 与 P1/P2 明确分层 |
| 非范围 | 多份文档分别声明，容易遗漏 | owner truth、服务端单元、外围产品、量化/兼容/生产和执行事实逐类列出 |
| blocker 处理 | 可能由实现者临场补 contract | 明确 `BLK-CON-07-001~003` 与 `RES-CON-07-001`，仅允许 safe/disabled 计划 |

## 10. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按八个页面逐页实施 | 直观 | 会把 owner truth、Query、恢复和状态拆散，难以验证跨主题红线 | 不采用 |
| 按十模块逐个实现 | 贴近 03 文件树 | 退化为对象/文件清单，无法形成可验证纵切 | 不采用 |
| 以客户端安全闭环和 owner seam 为主轴分阶段 | 可映射 C-CON、TC、AC/VETO，能局部停审 | 需要保留 conditional/blocked 状态 | 采用 |
| 先接真实 owner/生产依赖再补安全边界 | 表面接近生产 | 合同未闭口会诱发猜 schema、第二 truth 和不可审计证据 | 不采用 |

## 11. 回填草稿

正式 `07-实施计划.md` §2 应声明：本轮实施只规划将 `L5-console` 落地为安全、来源保真的浏览器客户端，覆盖 `G-CON-001~007`、`C-CON-1~6`、`FR-CON-001~018` 的 P0 安全/语义闭环，以及十模块、5 Command、16 Query、1 conditional consumer、四项配置和 05/06 证据门禁路径。`FR-CON-E01~E03`、owner truth、服务端单元、真实生产/浏览器/量化依赖、durability、未停审相邻产品和所有执行事实不在当前范围；exact owner/SDK contract、目标实现仓和 design baseline 未闭口时只允许 planned/blocked/disabled/read-only/partial 姿态。

## 12. 待确认事项

| 事项 | 影响 | 当前状态 | 处理时点 |
|---|---|---|---|
| exact owner/SDK query/command/result/ref、scope/qualification/safe-field | 正向 adapter、submit、active posture | `BLK-CON-07-002` | 对应 boundary 开工前回写 03/05/06 |
| 目标实现仓、package/toolchain/framework authority | 所有代码 boundary | `BLK-CON-07-001` | Step 3/8 前置检查；不存在则继续 blocked |
| design baseline immutable ref | Commit/Handoff Gate | `BLK-CON-07-003` | Step 12 移交前固定 |
| carrier medium/TTL/migration、invalidation envelope/order/dedup | state/invalidation boundary | `RES-CON-07-001` | Step 8/9；未闭口保持 session-volatile/disabled |
| browser/AT authority、diagnostic sink、quantitative threshold | selected/P2 gates | `RES-CON-07-001` | Step 9；无 authority 不升级 P0 |

## 13. 进入下一步条件

| 条件 | 结果 | 说明 |
|---|---|---|
| 实施目标可追溯到正式需求和设计 | `pass` | 七个目标映射 `00/03/05/06` |
| P0/P1/P2 及 conditional positive 可判定 | `pass` | 未启用 facet 的安全上限明确 |
| 非范围与不可接受项明确 | `pass` | 七项 VETO 与执行事实边界保留 |
| 未新增对象、Port、状态、错误码或 owner contract | `pass` | 本步仅做范围收敛 |
| 正式 07 仍未写入、无实现事实伪造 | `pass` | Step 13 前关闭正式回填 |
| 可进入 Step 3 | `pass` | 下一步收稳阅读/配置/台账前置 |

## 14. Step 自审记录

- [x] 已读取 Step 1、正式 `00`～`06` 的范围和承接章节。
- [x] 已回答 SOP Step 2 的六个问题。
- [x] 目标、范围、非范围、P0/P1/P2 防膨胀规则均有编号或来源。
- [x] 未把 conditional positive、planned suite、profile、fake 或文档状态写成实现/验收事实。
- [x] 已保留 `BLK-CON-07-001~003` 与 `RES-CON-07-001`，未自行关闭上游 blocker。
- [x] 允许更新 flow/ledger 并进入 Step 3；正式 `07-实施计划.md` 仍不可写。
