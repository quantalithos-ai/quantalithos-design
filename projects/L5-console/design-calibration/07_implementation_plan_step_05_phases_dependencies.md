# Step 5. 设计实施阶段与依赖顺序

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 5
> 回填章节：`07-实施计划.md` §5 实施阶段与依赖顺序
> 执行模式：`full-restart + single-agent-serial`
> 粒度参考：`projects/L1-governance/design-calibration/07_implementation_plan_step_05_phases_dependencies.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 5 · 设计实施阶段与依赖顺序 |
| 当前状态 | `done / pass / self_reviewed`（设计层；不是实现或测试结果） |
| 输入基线 | Step 4 交付物、正式 `03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md` |
| 正式 07 写入 | `false`；Step 13 full-restart 前不得创建或修改正式文件 |
| 实现移交 | `blocked / wait_design`；目标仓不存在，exact owner/SDK surface 未闭口 |
| 本步输出 | 本文件的 phase 依赖图、阶段总表、逐 phase 增量、停审和跨 phase 审计 |
| 下一动作 | 进入 Step 6 · 拆分阶段任务、编写顺序与提交边界 |

本 Step 的 `pass` 只表示阶段设计在文档层通过自审；当前没有实现仓、源码、构建、测试运行、artifact、report、evidence、verdict、signoff 或 readiness 事实。

## 2. 本步输入

| 输入 | 读取范围 | 本步用途 | 事实状态 |
|---|---|---|---|
| Step 4 交付物 | `07_implementation_plan_step_04_deliverables.md` §3～§6 | 确定十模块、5 Command、16 Query、1 conditional consumer、0 Event/0 Job 与配置/测试/证据交付面 | planned；目标仓未创建 |
| 详细设计 | `03-详细设计.md` §4～§17 | 确定模块依赖、Port、协议、flow、状态、carrier、错误、并发和实施暂停条件 | formal stop review；exact owner surface pending |
| 配置设计 | `04-配置设计.md` §3～§13 | 确定四项配置、三个 profile、strict whole-document、startup-only、fail-closed | formal stop review；未绑定 runtime |
| 测试方案 | `05-测试方案.md` §3～§14 | 确定 TC family、suite、gate/check、artifact/report/evidence 责任和失败姿态 | planned/not_created；未执行 |
| 验收标准 | `06-验收标准.md` §2～§14 | 确定 AC、AR、IFG、ST/TX/CC、NFR、VETO 与证据上限 | future adjudication contract；当前 `not_evaluated` |
| 实施规范 | 07 SOP、书写规范、代码实施台账规范、可落码性标准 | 确定按可验证增量拆 phase、phase 小循环停审和跨 phase 审计 | 已读取；只用于计划门禁 |

## 3. SOP 十问回答

### 3.1 最小可运行或可测试的纵切是什么

本项目的最小纵切不是某个页面、对象或文件，而是：

```text
validated startup/config
  -> formal access/context posture
  -> guarded navigation/session shell
  -> safe query mapping (zero-write)
  -> local draft / controlled intent posture
  -> canonical owner-partition composition
  -> typed degradation/recovery + semantic a11y
  -> optional formal adapter binding (or explicit disabled/blocked)
  -> fixed-run gate/report/evidence path
```

其中前七段可以用 formal-shaped fake 和 negative/safety seam 形成可测试骨架；最后的正向 owner binding 只有在 exact contract、authority 和 baseline 固定后才允许进入。任何阶段都不能以页面出现、adapter slot 存在、fake 返回成功、receipt、toast、诊断 receipt 或配置 flag 代替 formal observation。

### 3.2 哪些阶段必须先于其他阶段

1. `PH-01` 必须先于所有代码阶段：没有目标 package、strict config、测试/证据根和 dependency 规则，后续 gate 无法定位。
2. `PH-02` 必须先于 Query 和 topic：context、visibility、scope cleanup 是所有受保护读取的前置。
3. `PH-03` 必须先于 topic composition：必须先固定 safe mapping、source/status 五轴和 Query no-write，才能组合 owner partition。
4. `PH-04` 必须先于恢复和 runtime integration：draft/request/result、carrier、single-flight、unknown/no-replay 是 recovery 与 adapter 的输入。
5. `PH-05` 必须先于统一 runtime binding：先证明八个 owner 分区不会合成第二 truth，再允许 formal slots 组合。
6. `PH-06` 必须先于 release evidence：错误、降级、a11y 和 diagnostics 的安全上限必须先闭合，才能审计 evidence 边界。
7. `PH-08` 永远最后：它只从真实 raw artifact/report 生成 future candidate/handoff 草稿，不新增业务能力。

### 3.3 哪些风险或跨仓依赖需要前置

| 风险/依赖 | 前置阶段 | 处理口径 |
|---|---|---|
| 目标仓 `/home/aris/Projects/quantalithos-console` 不存在（`BLK-CON-07-001`） | PH-01 前 | 不创建仓；保持 `blocked / wait_design`，不得在设计仓写实现 |
| package manager/framework/router/bundler/host 未定（`RES-CON-07-002`） | PH-01、PH-02 | 只规划 TypeScript/ESM 与 framework-neutral Port；不从旧材料选型 |
| exact owner/SDK query/command/result/ref、scope、qualification、safe-field 未闭口（`BLK-CON-07-002`） | PH-03～PH-07 | 只实现/验证 safe fake、no-call、blocked/read-only/partial；不猜 schema |
| reconciliation/幂等/dispatch boundary 未闭口 | PH-04、PH-07 | ambiguous→`unknown`；无 formal reconcile 不 replay |
| carrier medium、TTL、migration、cross-tab 语义未闭口（`CON-Q-044`） | PH-04、PH-07 | 只保留 exact-scope whole-record、single-writer、session-volatile |
| browser/AT、diagnostic sink、量化 authority 未选（`RES-CON-07-001`） | PH-06、PH-08 | 只做 semantic/body-free/structural gate；selected 保持 residual |
| invalidation envelope/order/dedup 未闭口 | PH-07 | switch 默认 disabled；不直连 bus、cursor、replay 或 store |

### 3.4 每个阶段完成后能验证什么

阶段门禁只验证当前阶段新增的不变量和负向红线；不把后续正向 integration 当作当前完成条件。

| 阶段 | 设计层可验证增量 | 不可由本阶段证明 |
|---|---|---|
| PH-01 | package/config/script/root/dependency 的结构边界和 strict/fail-closed 计划 | owner integration、运行结果、production readiness |
| PH-02 | current context、visibility、selection cleanup、shell restricted posture、semantic navigation | owner truth、授权决定、具体 browser/AT verdict |
| PH-03 | safe material mapping、source/status 五轴、8 Core Query zero-write、safe link revalidation | owner schema 的正向完整性 |
| PH-04 | draft/request/result phase、5 Command side-effect inventory、carrier scope、single-flight、no replay | ambiguous request 的 owner outcome；exact idempotency positive |
| PH-05 | 8 Topic Query 的 owner partition、canonical order、partial isolation、activation ceiling | 任一 owner 的 production readiness 或统一 health |
| PH-06 | typed error、subject-specific recovery、semantic a11y、body-free diagnostics、sink isolation | production diagnostic sink、selected compatibility |
| PH-07 | narrow adapter registry、fake/formal parity、conditional invalidation、安全组合闭环 | 缺 exact contract 时的 positive binding |
| PH-08 | fixed-run 证据生成链、pairing/redaction/no-static/dependency 审计入口 | 实际 evidence、verdict、signoff、readiness |

### 3.5 是否存在按对象拆分而不可验证的阶段

存在这种风险，尤其是把十模块、16 Query 或八个主题各自列成阶段。该方案否决。模块和对象只作为 phase 的落点；phase 以“安全 shell”“safe query”“controlled intent”“owner partition”“recovery/a11y”“runtime seam”“release evidence”等可观察增量组织。这样每个 phase 都能绑定当前 TC family、AC/AR/IFG/VETO 和失败姿态，而不是等待所有对象完成后才首次验证。

### 3.6 哪些阶段可以并行，哪些不能并行

- 主链 `PH-01 → PH-02 → PH-03 → PH-04 → PH-05 → PH-06 → PH-07 → PH-08` 按设计顺序串行；当前项目内部不启用 phase 并行。
- `PH-01` 之后可以在同一 phase 内增量准备纯测试 fixture、redaction corpus、报告脚本壳，但它们不能绕过依赖或宣称业务阶段已通过。
- `PH-06` 的 diagnostics/a11y 结构检查可在 PH-02～PH-05 期间预研，正式 phase gate 仍在 PH-06 统一收口。
- selected browser/AT、owner positive、quantitative sample 只有在 P0 骨架完成且 authority/baseline 固定后才可作为 future/selected 轨道；不与 P0 phase 并行形成主链。
- phase 设计与实现 agent 的代码工作不得并行；本轮仍无实现 agent、无目标仓、无代码执行。

### 3.7 每个 phase 是否有功能增量、输入、输出、测试和验收门禁

有。§7 为每个 phase 给出功能增量、输入、输出、不包含和门禁；门禁引用正式 05/06 的 suite、TC family、AC/AR/IFG/ST/TX/CC/NFR/VETO。所有 suite、artifact、report、EV 均标记 future/planned，当前不产生结果。

### 3.8 是否把后续 phase 才能提供的对象、协议、flow、状态或证据前置

设计审计后没有把后续业务对象前置。早期 phase 只消费已定义的 Port/状态名和 formal-shaped fake；后续 phase 的真实 adapter、invalidation observation、release evidence 不作为早期 gate 的必需 positive 输入。若某 boundary 需要新增字段、状态、错误、owner schema、evidence 字段或 phase 依赖，必须回写正式 `03/05/06`，不能由 07 补造。

### 3.9 每个 phase 完成后是否通过停审

每个 phase 都设置四项停审：可验证增量、依赖/越界、当前门禁可执行性、设计回写缺口。§8 逐 phase 记录设计层结论。结论中的“通过”仅表示计划结构通过；实际实施必须在 Step 7/12 按真实 baseline、代码、run 和 evidence 再审。

### 3.10 所有 phase 完成后的跨 phase 审计是否通过

通过设计层审计：顺序由 access/safe material/state/partition/recovery/runtime/evidence 依赖驱动；没有 phase 共享第二 truth、没有把 Event/Job/DB/projection/outbox 引入 Console；P0 gate 从 PH-01 起有入口，最终证据只在 PH-08 从真实产物推导。目标仓、exact contracts 和 immutable baseline 仍是实施移交 blocker，不是顺序已经满足的证明。

## 4. 当前文档问题诊断

| 位置/问题 | 影响 | 本 Step 修正 |
|---|---|---|
| 07 尚无阶段依赖主轴 | Step 6 无法拆任务与 boundary | 建立 PH-01～PH-08 可验证增量顺序 |
| 03 的十模块/22 个协议容易被机械逐对象拆分 | 形成不可独立验收的长清单 | 以客户端安全闭环和 owner partition 组织 phase |
| 05 suite 横跨模块与横切门禁 | 实施者可能把测试留到末尾 | 每个 phase 绑定 blocking suite、TC family 和证据方向 |
| 06 的 AC/VETO 覆盖整条链 | 早期阶段可能漏掉红线 | PH-01 起加入 config/dependency/redaction/no-static 前置，PH-08 汇总 |
| exact owner/SDK surface 未闭口 | 直接规划 positive adapter 会诱导猜造 | 将正向 binding 设为 conditional；缺口统一 `blocked / wait_design` |
| 目标仓不存在 | 不能把路径/脚本写成已存在 | 全部输出使用 planned/not_created；不创建实现仓 |
| Governance 参考包含 Rust、DB、projection、Event、Job | 直接复制会越过 Console ownership | 只借用 phase/停审/跨边界审计框架，不继承领域对象 |

## 5. 改动前后对比

| 项 | 本 Step 前 | 本 Step 后 | 收口理由 |
|---|---|---|---|
| 阶段主轴 | 只有模块/交付物清单 | 8 个按依赖驱动的客户端安全增量 phase | 每阶段可绑定当前 gate |
| 最小纵切 | 未定义 | config→context→query→intent→topic→recovery→binding→evidence | 避免页面或对象裸拆 |
| 外部依赖 | 容易提前写真实 owner adapter | safe fake/disabled/blocked 先行，positive conditional | 保持 SDK-only 与事实诚实 |
| 测试/验收 | 可能全部推迟到 release | 各 phase 提前绑定 suite、AC/AR/IFG/VETO | 防止末端补测和静态证据 |
| Event/Job/服务端单元 | 参考项目有完整服务端阶段 | Console 明确 `0 Event / 0 Job`、无 DB/repository/projection/outbox | 不迁移 Governance truth |
| 并行性 | 未说明 | 主链串行；selected 轨道仅 future/residual | 符合本项目内部 full-restart |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按十模块各拆一个 phase | 文件映射直观 | 形成对象清单；无法证明跨模块安全闭环 | 不采用 |
| 按 5 Command/16 Query 分协议拆 phase | 协议可追溯 | context、state、a11y、owner partition 被割裂；重复 gate | 不采用 |
| 按客户端安全纵切 + release 收口拆 phase | 每阶段有可验证增量；能提前阻断 VETO | Step 6 需要更细 commit boundary | 采用 |
| 复制 Governance 的 truth/DB/projection/event/job 阶段 | 可借用既有表格 | 越权并制造 Console 不存在的服务端事实 | 不采用 |
| 先做真实 owner integration 再做安全 shell | 体验直观 | exact contract 缺失时会猜造、无法 fail-closed | 不采用 |
| 先用 fake/disabled 骨架，合同到达后再启用 positive | 可在不越权前验证 negative/semantic/static | 正向集成延后 | 采用 |
| PH-08 手写 evidence/VETO 结论 | 看似快速 | 违反 artifact/report/no-static 真实性 | 不采用 |

## 7. 结构化中间产物

### 7.1 阶段依赖图：L5-console 客户端安全实施顺序

```text
[PH-01 package/config/test-evidence skeleton]
        | enables
        v
[PH-02 entry + access + navigation safety shell]
        | requires current context / guarded selection
        v
[PH-03 safe views + 8 Core Query + no-write mapping]
        | supplies safe material / source axes
        v
[PH-04 intent + state + 5 Command safety]
        | supplies phase / carrier / no-replay semantics
        v
[PH-05 8 topic owner partitions + activation ceiling]
        | supplies canonical composition / partial isolation
        v
[PH-06 recovery + semantic a11y + diagnostics]
        | supplies typed degradation / redaction / channel parity
        v
[PH-07 runtime adapters + conditional invalidation + composition]
        | supplies only approved formal/disabled bindings
        v
[PH-08 release gates + reports + evidence/handoff path]
```

关键说明：

- 图表达 phase 之间的设计依赖，不表达完整函数调用链，也不表示任何 phase 已执行。
- `PH-03` 的 8 Core Query 与 `PH-05` 的 8 Topic Query 共同覆盖正式 16 Query；5 Command 在 `PH-04` 形成安全库存，正向 submit 仍受合同条件约束。
- `PH-07` 只绑定正式 SDK/服务边界或保持 disabled/blocked；不引入 broker、数据库、owner source、projection、outbox、worker 或 job。
- `PH-08` 只能从同一 fixed run 的真实 artifact/report 推导 future candidate/handoff 草稿，不产生 verdict、signoff 或 readiness。

### 7.2 阶段总表

| 阶段 | 阶段名称 | 可验证实施目标 | 依赖阶段 | 核心交付面（planned） | 主要阶段门禁（planned） |
|---|---|---|---|---|---|
| PH-01 | package、配置、测试与证据骨架 | 建立 strict TypeScript/ESM package 入口、四项配置、测试/报告根和静态依赖边界 | 无 | package/config loader、profile validator、gate/check/report shell、fixture/corpus/manifest skeleton | `console-pure-contract`、`console-config-redline`、`console-architecture-static`（实现仓存在后） |
| PH-02 | entry/access/navigation 安全 shell | 建立 bootstrap、formal context posture、guarded route/selection、scope cleanup、restricted/minimal shell | PH-01 | `entry`/`access`/`navigation` 模块、host-neutral ports、context/navigation tests | `console-module-flow`、`console-semantic-a11y`、`console-redaction-boundary` |
| PH-03 | safe views 与 8 Core Query | safe material→snapshot/model、五轴 source/status、safe link、全部 Core Query zero-write | PH-02 | `views` 与 query adapter seam、8 Core Query presentation、read-only ledger | `console-pure-contract`、`console-module-flow`、`console-port-adapter`、`console-redaction-boundary` |
| PH-04 | intent/state 与 5 Command 安全 | draft/request/result phase、scoped carrier、single-flight、cancel/unknown/no-replay 与唯一 owner write inventory | PH-03 | `intent`/`state` 模块、command/reconcile seam、state/error fixtures | `console-module-flow`、`console-port-adapter`、`console-controlled-composition`、`console-concurrency-race` |
| PH-05 | 八主题 owner partition 与 composition | 八个 Topic Query 的 canonical 分区、activation ceiling、局部失败与 strict empty | PH-04 | `features` descriptors/pages、topic query composition、partition ledger | `console-controlled-composition`、`console-module-flow`、`console-redaction-boundary` |
| PH-06 | recovery、semantic a11y 与 diagnostics | typed degradation、subject-specific one-action recovery、三通道等价、body-free sink isolation | PH-05 | `recovery`/`diagnostics`、focus/announce mapping、redaction/recursion fixtures | `console-recovery-matrix`、`console-semantic-a11y`、`console-redaction-boundary` |
| PH-07 | runtime adapter、conditional invalidation 与受控组合 | 以 formal SDK/服务边界注册窄 adapters；无合同则 disabled/blocked；验证组合/并发/失效安全 | PH-06 | `adapters` registry、fake/formal parity、optional invalidation consumer、controlled composition | `console-port-adapter`、`console-controlled-composition`、`console-concurrency-race`、`console-architecture-static` |
| PH-08 | release gate、report、evidence 与 handoff | 固定 run 的 gate、pairing、redaction、dependency、no-static 和 acceptance 草稿生成链 | PH-07 | release scripts、run reports、future EV candidate index、handoff/VETO/risk/open-issues draft | `console-release-safety-smoke`、`console-release-config-redline`、`console-release-redaction`、`console-release-dependency`、`console-release-report-audit` |

### 7.3 PH-01 可验证增量：package、配置、测试与证据骨架

| 项 | 内容 |
|---|---|
| 功能增量 | 从“无实现仓”到一个可被后续门禁定位的 TypeScript/ESM package 结构、strict whole-document config 入口、显式 run/artifact/report 根和禁止依赖扫描入口。 |
| 输入 | `03` §4/§13、`04` §3～§12、`05` §8～§9/§13、`06` §3/§10；目标仓 authority（当前缺失）。 |
| 输出 | planned package/config validator、三个 profile 的名称映射、`scripts/gates/*`/`scripts/checks/*`/`scripts/reports/*` 壳、fixture/corpus/manifest 约定；均须标 `planned/not_created` 直到目标仓存在。 |
| 不包含 | 任何 owner DTO/真实 adapter、页面组件、数据库、repository、projection、outbox、worker、job、真实 artifact/report/evidence。 |
| 测试门禁 | `console-pure-contract`、`console-config-redline`、`console-architecture-static` 的结构入口；当前只能形成 planned gate，不能宣称执行。配置必须拒绝未知 key、缺 required profile、partial document、secret 或 silent fallback。 |
| 验收门禁 | `AR-CON-002/005/008`、`IFG-CON-004/005/007` 的设计映射；`AC-CON-007` 只检查未来证据入口存在性合同，不生成 acceptance result。 |

### 7.4 PH-02 可验证增量：entry/access/navigation 安全 shell

| 项 | 内容 |
|---|---|
| 功能增量 | 以 formal context/visibility/qualification 为唯一安全前置，建立 `entry`、`access`、`navigation` 的 guarded shell；context switch/logout/revocation 会清理旧 scope，无法验证时只呈现 restricted/minimal/closed。 |
| 输入 | PH-01 config/startup posture；`03` §5/§8/§9/§11；`05` CTX/NAV/A11Y/SEC TC；`06` `AC-CON-001/002`、`ST-CON-001～003`、`VETO-CON-002/006`。 |
| 输出 | session shell、access context/disclosure guards、route/selection/history/cleanup ports、semantic navigation bindings 与对应 deterministic fake/test seam；不产生 authorization truth。 |
| 不包含 | owner view body、Topic Query、Command submit、local role/RBAC/Policy/Gate、route-derived permission、URL/owner body persistence。 |
| 测试门禁 | `console-module-flow`、`console-semantic-a11y`、`console-redaction-boundary`；必须验证 protected call/selection=0、late result drop、三通道 guard 一致。 |
| 验收门禁 | `AC-CON-001/002`、`AC-FR-001/002`、`AR-CON-001/002/007`、`ST-CON-001～003`；命中 VETO 或出现 local elevation 时阻断。 |

### 7.5 PH-03 可验证增量：safe views 与 8 Core Query

| 项 | 内容 |
|---|---|
| 功能增量 | 将已获 formal access 的 safe material 映射为 owner/source-preserving snapshot/model，维持 freshness、coverage、availability、consistency、reference-validity 五轴，并使 8 Core Query 全部 zero-write。 |
| 输入 | PH-02 current context/visibility；`03` §5～§8/§10；`05` VIEW/ADAPTER/ARCH TC；`06` `AC-CON-003`、`IFG-CON-002`、`AR-CON-003/004`。 |
| 输出 | views mapper/status axes/safe link seam、8 Core Query presentation、read-only call ledger 和 whole-material rejection path。 |
| 不包含 | 八 Topic Query 的 canonical composition、owner projection/cursor/rebuild、filter-before-map、raw/hidden body、统一 health/readiness。 |
| 测试门禁 | `console-pure-contract`、`console-module-flow`、`console-port-adapter`、`console-redaction-boundary`；filter/window 只能作用于安全映射后材料，所有 query/carrier/owner write 计数必须为 0。 |
| 验收门禁 | `AC-CON-003`、`AC-FR-003`、`ST-CON-004`、`TX-CON-002`、`AR-CON-001/003/004`；source/status 轴丢失或 query side-path 写入即 P0 阻断。 |

### 7.6 PH-04 可验证增量：intent/state 与 5 Command 安全

| 项 | 内容 |
|---|---|
| 功能增量 | 建立 draft→request→receipt/result presentation 的 phase 分层、exact-scope whole-record carrier、single-flight、dispatch boundary、ambiguous→unknown 和 no-replay；仅保留 `OwnerCommandPort.submit` 这一唯一潜在 owner write。 |
| 输入 | PH-03 safe query material；`03` §5/§7～§13；`05` INTENT/STATE/CONSISTENCY TC；`06` `AC-CON-004`、`ST-CON-005/006/009`、`TX-CON-001/002`、`CC-CON-003～005`、`VETO-CON-003`。 |
| 输出 | intent/state modules、5 Command safety flows、formal reconciliation read seam、carrier fake/recording ledger、error/recovery input contracts。 |
| 不包含 | owner-side idempotency store、durable/cross-tab persistence、自动 retry/replay、local authorization、exact positive submit schema（合同未闭口时）。 |
| 测试门禁 | `console-module-flow`、`console-port-adapter`、`console-controlled-composition`、`console-concurrency-race`；必须分别覆盖 pre-dispatch cancel、possible-dispatch unknown、double semantic action、carrier write ambiguity。 |
| 验收门禁 | `AC-CON-004`、`AC-FR-004`、`AR-CON-006/010`、`ST-CON-005/006/009`、`TX-CON-001/002`、`CC-CON-003～005`；receipt/toast/2xx/保存完成不得提升 formal terminal。 |

### 7.7 PH-05 可验证增量：八主题 owner partition 与 composition

| 项 | 内容 |
|---|---|
| 功能增量 | 以固定 owner 映射组合八个 Topic Query：员工、项目/Workspace、方法资产、Governance/SoA/AIIA/Control/Gate、审计/指标、Capability Hub、Archive、Sandbox；每个 partition 独立、顺序 canonical、失败局部，严格区分 empty 与 unavailable。 |
| 输入 | PH-04 access/intent/state safety；`03` §5～§8；`05` TOPIC/CONSISTENCY TC；`06` `AC-CON-005`、`AC-FR-005～010`、`IFG-CON-006`、`AR-CON-009/010`、`VETO-CON-005/007`。 |
| 输出 | `features` descriptors/page/semantic-region composition、8 Topic Query adapters 的 blocked/read-only/partial posture、partition call ledger。 |
| 不包含 | owner domain aggregate、跨 owner transaction、projection/cursor、统一 health/compliance/readiness、未停审 L5/L6 私有 link、任何执行/治理决定。 |
| 测试门禁 | `console-controlled-composition`、`console-module-flow`、`console-redaction-boundary`；验证 completion order independence、partial isolation、canonical order 和 no-call when facet disabled。 |
| 验收门禁 | `AC-CON-005`、`AC-FR-005～010`、`AR-CON-001/009/010`、`IFG-CON-006`、`VETO-CON-005/007`；single-owner success 不得掩盖 sibling failure。 |

### 7.8 PH-06 可验证增量：recovery、semantic a11y 与 diagnostics

| 项 | 内容 |
|---|---|
| 功能增量 | 将异常/部分/过期/冲突/unknown 映射为 typed degradation，生成 immutable subject-specific recovery plan；视觉、键盘、辅助技术共用 action/guard/outcome/ceiling；diagnostic 仅 body-free、可 disabled、sink failure 隔离。 |
| 输入 | PH-05 partition states；`03` §9/§11/§14/§15；`05` RECOVERY/A11Y/DIAG/SEC TC；`06` `AC-CON-006`、`AC-FR-011/012`、`ST-CON-008/011`、`CC-CON-003`、`VETO-CON-004/006`。 |
| 输出 | recovery/diagnostics modules、focus/announcement mapper、whitelist/redaction gate、synthetic leak corpus and recursion fixture；不写 owner audit/evidence。 |
| 不包含 | generic retry-all、后台 repair/job、production log backend、browser/AT compatibility verdict、diagnostic→audit/evidence/readiness 推导。 |
| 测试门禁 | `console-recovery-matrix`、`console-semantic-a11y`、`console-redaction-boundary`；stale plan 必须 zero action 或一个批准 action，sink failed/disabled 时业务 outcome/state 不变。 |
| 验收门禁 | `AC-CON-006`、`AC-FR-011/012`、`AC-NFR-006/007`、`AR-CON-003/011`、`ST-CON-008/011`、`VETO-CON-004/006`。 |

### 7.9 PH-07 可验证增量：runtime adapter、conditional invalidation 与受控组合

| 项 | 内容 |
|---|---|
| 功能增量 | 将前六个阶段的 consumer-owned narrow Port 接入官方 SDK/正式服务边界；registry 只能选择已批准 slot；owner/SDK contract 缺失时保持 `disabled/blocked/read-only/partial`。conditional invalidation 默认 disabled，future enabled 只允许单调收紧。 |
| 输入 | PH-01～PH-06 的安全 seam；`03` §6/§7/§13；`04` §8～§12；`05` ADAPTER/consumer/ARCH/CONSISTENCY TC；`06` `IFG-CON-003/007`、`AR-CON-002/010`。 |
| 输出 | `adapters` registry、safe request/response mapper、fake/formal parity harness、optional invalidation consumer and controlled composition gates；positive instance 仅在 authority 到达后 planned。 |
| 不包含 | SDK 私有 schema、owner sibling source、DB/private bus/BFF、broker cursor/replay/store、projection/outbox/worker/job、猜造 endpoint/path/topic。 |
| 测试门禁 | `console-port-adapter`、`console-controlled-composition`、`console-concurrency-race`、`console-architecture-static`；检查 no-call/blocked posture、raw error/body redaction、invalidation duplicate/conservative race。 |
| 验收门禁 | `AC-FR-003～010` 的 conditional positive、`IFG-CON-003/006/007`、`AR-CON-002/005/010`、`ST-CON-004/006/007`、`CC-CON-006`；enabled 缺 exact positive evidence 即阻断，不得以 fake pass。 |

### 7.10 PH-08 可验证增量：release gate、report、evidence 与 handoff

| 项 | 内容 |
|---|---|
| 功能增量 | 在 implementation、design、config、environment、data、dependency、facet、run 均真实固定后，执行 release safety/config/redaction/dependency/report-audit，生成同一 run 的 raw/report、future EV candidate index 和 acceptance handoff 草稿。 |
| 输入 | PH-01～PH-07 真实执行产物；`05` §9/§13/§14；`06` §3/§10～§14；固定 `run_id` 与 review version。当前均不存在。 |
| 输出 | `artifacts/test/<run_id>/`、`reports/runs/<run_id>/`、`reports/acceptance/` 的 planned generator contract、pairing/redaction/no-static/dependency audit、handoff/VETO/risk/open-issues draft。 |
| 不包含 | 新业务功能、owner truth/evidence body、静态 EV/VETO passed、风险接受/最终 verdict/signoff/readiness 的伪造。 |
| 测试门禁 | `console-release-safety-smoke`、`console-release-config-redline`、`console-release-redaction`、`console-release-dependency`、`console-release-report-audit`；失败 run 保留，重跑用新 run id，任何缺 pair/digest/no-static 失败。 |
| 验收门禁 | `AC-CON-007`、`AC-NFR-003～007`、`EV-RELEASE-001` 资格和七项 VETO checklist 生成入口；最终 `verdict/signoff/readiness` 仍由真实 06 生命周期裁决。 |

## 8. Phase 停审记录

每个 phase 的“通过”均是设计层停审结论。执行期必须在目标仓、不可变 design baseline、真实 gate/run 和同 run 证据存在后重新执行；任何实现发现的字段、Port、状态、错误、owner schema、artifact schema 或依赖缺口都必须回写真相源并把 phase/boundary 置为 `blocked / wait_design`。

| Phase | 可验证增量审查 | 依赖/越界审查 | 当前门禁可执行性 | 设计回写缺口 | 结论 |
|---|---|---|---|---|---|
| PH-01 | package/config/root/scan skeleton 是可定位的结构增量，不冒充代码 | 未引入 owner/body/service-side unit；目标仓不存在是前置 blocker | planned gate 可在仓存在后执行；当前无 runner/result | package manager/framework、实现仓、baseline 待确认 | 设计层通过；实施 blocked |
| PH-02 | context/access/navigation shell 可用 negative/semantic flow 独立验证 | 不依赖后续 Query/Command；不把 route/menu 当授权 | module-flow、a11y、redaction 的阻断方向明确 | exact context/visibility/qualification surface 仍 pending | 设计层通过；positive blocked |
| PH-03 | safe mapping、五轴和 Query no-write 可独立断言 | 只消费 PH-02 的 formal posture；不做 topic projection/read repair | pure/module/adapter/redaction 可按 planned TC 执行 | safe-field/owner query schema 未闭口 | 设计层通过；positive blocked |
| PH-04 | phase、single-flight、unknown/no-replay、carrier scope 可独立断言 | 不依赖 owner idempotency store 或后续 invalidation；不做 replay | flow/adapter/composition/race 入口明确 | reconcile/idempotency/dispatch exact contract pending | 设计层通过；submit positive blocked |
| PH-05 | 八 partition、canonical order、partial isolation 是独立组合增量 | 不引入跨 owner transaction/readiness；不依赖 release evidence | composition/module/redaction 可执行结构检查 | 各 owner positive query/activation contract pending | 设计层通过；facet conditional |
| PH-06 | recovery ceiling、semantic parity、body-free diagnostics 可独立负向验证 | 不创建 retry/job/audit；不依赖 production sink | recovery/a11y/redaction suite 入口明确 | browser/AT matrix、diagnostic sink authority pending | 设计层通过；selected residual |
| PH-07 | adapter registry、no-call posture、conditional invalidation 可独立检查 | 只允许 SDK/formal boundary；不直连 bus/DB/private source | adapter/composition/race/architecture gate 可在合同到达后执行 | exact SDK/envelope/order/dedup/host contract pending | 设计层通过；runtime blocked |
| PH-08 | release evidence 生成链是独立收口增量，不新增业务功能 | 只读取前序真实产物；不产生 verdict/signoff/readiness | release scripts/checks 是 planned；无 run 时不可执行 | baseline/run/schema/review authority pending | 设计层通过；handoff blocked |

### 8.1 Phase 停审结论

- 八个 phase 均按可验证功能增量组织，而非按对象、函数或文件裸拆。
- 每个 phase 都有明确输入、输出、不包含、测试门禁和验收门禁；后续正向 integration 没有被偷偷前置为早期通过条件。
- 任何 `planned` suite、artifact、report、EV、VETO checklist 或 handoff 草稿都不构成当前执行结果。
- 当前不存在 implementation repo、design immutable ref、run、artifact、report、evidence instance、defect、risk acceptance、verdict、signoff 或 readiness；所有 phase 只能停在设计层。

## 9. 跨 phase 依赖闭环审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 阶段顺序是否由依赖驱动 | 通过 | config/package → access/context → safe query → intent/state → owner partition → recovery/a11y/diagnostics → adapters/invalidation → release evidence。 |
| 是否存在按对象裸拆 phase | 通过 | 十模块、22 协议和八主题作为 phase 内交付面，不单独形成不可验收阶段。 |
| 最小纵切是否早于大规模功能 | 通过 | PH-01～PH-04 先闭合 shell、safe read、intent/state safety，再进入 topic 和 runtime seam。 |
| 后续 phase 对早期 phase 的反向依赖 | 通过 | 早期 gate 不要求后续 owner positive、invalidation observation 或 release evidence；需要新增输入时必须回写设计。 |
| Query/Command 读写边界 | 通过 | 8 Core Query 在 PH-03、8 Topic Query 在 PH-05；全部 Query zero-write，唯一潜在 owner write 仍为 `OwnerCommandPort.submit`（PH-04）。 |
| state/carrier 与 formal/local 事务边界 | 通过 | PH-04 固定 whole-record/session-volatile/single-writer/no-replay；未引入 DB/UoW/CAS/durable 语义。 |
| owner partition 与跨 owner 原子性 | 通过 | PH-05 只做 canonical composition、独立调用和局部失败；不合成 health/compliance/readiness。 |
| recovery/a11y/diagnostics 是否越权 | 通过 | PH-06 只收紧、显式 action、semantic parity、body-free；不改变 formal result/activation/audit。 |
| adapters/invalidation 是否绕过正式边界 | 通过 | PH-07 仅 SDK/formal narrow Port；invalidation 默认 disabled；禁止 broker/cursor/replay/private source。 |
| Event/Job/service-side absence | 通过 | 全链路明确 0 Outbound Event、0 Operations Job；不创建 outbox/publisher/worker/projection/repository/BFF。 |
| 测试与验收覆盖是否从早期进入 | 通过 | PH-01 起有 config/architecture/dependency 入口；各 phase 绑定 05 suite 与 06 AC/AR/IFG/ST/TX/CC/VETO；PH-08 只汇总真实证据。 |
| artifact/report/evidence 归属 | 通过 | 所有 future raw/report 使用同一显式 `<run_id>`；无 `latest`、跨 run 拼接或手写 EV/VETO pass。 |
| 失败与重跑 | 通过 | P0 gate、redaction、dependency、pairing、no-static 失败阻断；重跑必须新 run，保留失败材料。 |
| 外部依赖前置 | 通过但有 blocker | 官方 SDK package boundary 已知，exact owner/SDK/host/browser/diagnostic/quantitative authority 未闭口，故对应 phase 保持 blocked/conditional。 |
| phase boundary 越界风险 | 通过 | Step 6 需继续把每个 phase 拆成独立 boundary；任何 boundary 新增 schema/状态/Port 必须先回写 03/05/06。 |
| implementation ledger / boundary skeleton 时机 | 通过 | Step 5 不创建；Step 6 收稳正式 boundary 后再创建全部 planned skeleton；Step 13 装配时同步 implementation ledger。 |
| 与 L1-governance 粒度参考的裁剪 | 通过 | 借用 phase 总表、可验证增量、停审、跨 phase 审计格式；排除 Rust/Cargo、DB、projection、outbox、Event、Job 和 Governance truth。 |

### 9.1 跨 phase 审计结论

设计层无 unresolved 顺序冲突。未关闭项均是已编号的外部/实现 blocker 或 residual，而不是 phase 顺序缺陷：`BLK-CON-07-001`、`BLK-CON-07-002`、`BLK-CON-07-003`、`RES-CON-07-001`、`RES-CON-07-002` 继续阻止实现移交或正向 binding；它们不得在 Step 6/7 被改写成“已通过”。

## 10. 回填草稿

以下内容仅供 Step 13 full-restart 装配到正式 `07-实施计划.md` §5；本 Step 不写正式文件。

### 5.1 阶段依赖顺序

`L5-console` 按客户端可验证安全增量串行推进：

```text
PH-01 package/config/test-evidence skeleton
  -> PH-02 entry/access/navigation safety shell
  -> PH-03 safe views + 8 Core Query/no-write
  -> PH-04 intent/state + 5 Command safety
  -> PH-05 8 owner partitions + activation ceiling
  -> PH-06 recovery + semantic a11y + diagnostics
  -> PH-07 runtime adapters + conditional invalidation
  -> PH-08 release gates + reports + evidence/handoff
```

该顺序先建立 strict startup/config 和可审计路径，再建立 formal context/guard、安全读取、受控意图和局部 owner 组合，最后才绑定可选 runtime seam 与 release evidence。Console 不引入服务端 truth；0 Event/0 Job、Query zero-write、唯一潜在 owner write、session-volatile carrier 和 SDK/formal boundary 是跨 phase 不变量。

### 5.2 阶段总表

正式 §5 应回填本文件 §7.2 的八行阶段总表，并在每个 phase 下面保留 §7.3～§7.10 的功能增量、输入、输出、不包含、测试/验收门禁摘要。正式文档只可把 `planned` 路径写成计划，不得转写为已创建文件、已运行 suite 或已产生 evidence。

### 5.3 阶段停审与证据纪律

每个 phase 完成后必须停审四项：可验证增量、依赖/越界、当前门禁可执行性、设计回写缺口。执行期任何设计缺口都必须先回写正式真相源、固定新 baseline、再重开受影响 phase/boundary；不能由实现者临时补 schema 或以 fake/receipt/flag/report 造 positive。PH-08 只汇总真实同 run artifact/report，永不自动产生 verdict、signoff 或 production readiness。

## 11. 待确认事项

| 事项 | 当前状态 | 影响 phase | 处理位置 / 解锁条件 |
|---|---|---|---|
| `/home/aris/Projects/quantalithos-console` 是否创建及其 authority | `BLK-CON-07-001 / not_created` | PH-01～PH-08 | Step 8/12；目标仓可定位并可审计后才可移交 |
| package manager/framework/router/bundler/host lifecycle | `RES-CON-07-002 / pending` | PH-01/02/07 | 目标仓与正式 host authority 固定；此前保持 framework-neutral |
| exact SDK owner query/command/result/ref、scope/qualification/safe-field | `BLK-CON-07-002 / pending` | PH-03～PH-07 | 对应 boundary 开工前回写 03/05/06；无合同只能 no-call/blocked |
| reconciliation/idempotency/dispatch boundary | `pending` | PH-04/07 | formal owner/SDK authority 到达；unknown 不 replay |
| carrier medium/serialization/TTL/migration/cross-tab | `CON-Q-044 / pending` | PH-04/07 | 只维持 session-volatile；要升级必须回写 03/04/05/06 |
| browser/AT matrix、diagnostic sink/envelope、量化 authority | `RES-CON-07-001 / pending` | PH-06/08 | authority+baseline 同时选择后才成为 selected gate |
| invalidation envelope/version/order/dedup/source | `pending` | PH-07 | switch false 时 disabled；enabled 前 exact source 必须闭口 |
| immutable design baseline/ref、delivery/environment/dependency manifest | `BLK-CON-07-003 / not_fixed` | PH-01/08/移交 | Step 12/13 前固定；当前不得填写 hash/digest |
| phase→commit boundary 粒度、owner、ledger path | `pending` | Step 6 | Step 6 逐 phase 拆 boundary；未完成不创建 skeleton |
| phase→TC/suite/AC/VETO/evidence 精确绑定 | `pending` | Step 7 | Step 7 逐 boundary 收口；当前只保留 phase 级映射 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 阶段依赖图已输出且顺序有设计依据 | `pass` | 8 phase 主链由 access/query/state/partition/recovery/runtime/evidence 依赖驱动 |
| 每个 phase 有可验证增量、输入、输出、不包含、测试/验收门禁 | `pass` | §7.3～§7.10 逐 phase 完成 |
| Phase 停审全部完成 | `pass` | §8 记录设计层停审；执行期需重新复核 |
| 跨 phase 依赖、风险、外部依赖、证据和越界审计 | `pass with blockers` | 顺序无冲突；实现仓、exact contract、baseline 等 blocker 保持开放 |
| 没有复制 Governance 服务端领域阶段 | `pass` | 仅采用粒度框架，明确排除 Rust/Cargo、DB、projection、Event/Job |
| 正式 07、实现仓、代码、测试和证据事实未伪造 | `pass` | 正式文件仍不可写；本文件仅 calibration |
| 可进入 Step 6 | `pass` | 下一步只允许拆 phase→commit boundary；不得直接实现或创建正式 07 |

## 13. Step 自审记录

- [x] 已按恢复门禁读取项目台账、07 flow、Step 4、正式 03/04/05/06 和相关 SOP/规范。
- [x] 已回答 Step 5 十个 SOP 问题，并采用 phase/可验证增量而非对象/文件裸拆。
- [x] 已建立 Console 专属 8 phase 依赖图和阶段总表。
- [x] 每个 phase 均写明功能增量、输入、输出、不包含、测试门禁和验收门禁。
- [x] 已记录每个 phase 的停审与跨 phase 依赖闭环审计，并保留 blockers/residual。
- [x] 已裁剪 L1-governance 的 Rust/Cargo、DB、projection、Event、Job 和服务端 truth，不把其作为 Console 真相。
- [x] 未创建目标实现仓、源码、脚本、测试、artifact、report、evidence、implementation ledger 或 boundary skeleton。
- [x] 未运行测试、未生成 run/verdict/signoff/readiness、未提交 commit；正式 `07-实施计划.md` 仍未创建。


### 7.3 PH-01 可验证增量：package、配置、测试与证据骨架

| 项 | 内容 |
|---|---|
| 功能增量 | 从“无实现仓”到一个可被后续门禁定位的 TypeScript/ESM package 结构、strict whole-document config 入口、显式 run/artifact/report 根和禁止依赖扫描入口。 |
| 输入 | `03` §4/§13、`04` §3～§12、`05` §8～§9/§13、`06` §3/§10；目标仓 authority（当前缺失）。 |
| 输出 | planned package/config validator、三个 profile 的名称映射、`scripts/gates/*`/`scripts/checks/*`/`scripts/reports/*` 壳、fixture/corpus/manifest 约定；均须标 `planned/not_created` 直到目标仓存在。 |
| 不包含 | 任何 owner DTO/真实 adapter、页面组件、数据库、repository、projection、outbox、worker、job、真实 artifact/report/evidence。 |
| 测试门禁 | `console-pure-contract`、`console-config-redline`、`console-architecture-static` 的结构入口；当前只能形成 planned gate，不能宣称执行。配置必须拒绝未知 key、缺 required profile、partial document、secret 或 silent fallback。 |
| 验收门禁 | `AR-CON-002/005/008`、`IFG-CON-004/005/007` 的设计映射；`AC-CON-007` 只检查未来证据入口存在性合同，不生成 acceptance result。 |

### 7.4 PH-02 可验证增量：entry/access/navigation 安全 shell

| 项 | 内容 |
|---|---|
| 功能增量 | 以 formal context/visibility/qualification 为唯一安全前置，建立 `entry`、`access`、`navigation` 的 guarded shell；context switch/logout/revocation 会清理旧 scope，无法验证时只呈现 restricted/minimal/closed。 |
| 输入 | PH-01 config/startup posture；`03` §5/§8/§9/§11；`05` CTX/NAV/A11Y/SEC TC；`06` `AC-CON-001/002`、`ST-CON-001～003`、`VETO-CON-002/006`。 |
| 输出 | session shell、access context/disclosure guards、route/selection/history/cleanup ports、semantic navigation bindings 与对应 deterministic fake/test seam；不产生 authorization truth。 |
| 不包含 | owner view body、Topic Query、Command submit、local role/RBAC/Policy/Gate、route-derived permission、URL/owner body persistence。 |
| 测试门禁 | `console-module-flow`、`console-semantic-a11y`、`console-redaction-boundary`；必须验证 protected call/selection=0、late result drop、三通道 guard 一致。 |
| 验收门禁 | `AC-CON-001/002`、`AC-FR-001/002`、`AR-CON-001/002/007`、`ST-CON-001～003`；命中 VETO 或出现 local elevation 时阻断。 |

### 7.5 PH-03 可验证增量：safe views 与 8 Core Query

| 项 | 内容 |
|---|---|
| 功能增量 | 将已获 formal access 的 safe material 映射为 owner/source-preserving snapshot/model，维持 freshness、coverage、availability、consistency、reference-validity 五轴，并使 8 Core Query 全部 zero-write。 |
| 输入 | PH-02 current context/visibility；`03` §5～§8/§10；`05` VIEW/ADAPTER/ARCH TC；`06` `AC-CON-003`、`IFG-CON-002`、`AR-CON-003/004`。 |
| 输出 | views mapper/status axes/safe link seam、8 Core Query presentation、read-only call ledger 和 whole-material rejection path。 |
| 不包含 | 八 Topic Query 的 canonical composition、owner projection/cursor/rebuild、filter-before-map、raw/hidden body、统一 health/readiness。 |
| 测试门禁 | `console-pure-contract`、`console-module-flow`、`console-port-adapter`、`console-redaction-boundary`；filter/window 只能作用于安全映射后材料，所有 query/carrier/owner write 计数必须为 0。 |
| 验收门禁 | `AC-CON-003`、`AC-FR-003`、`ST-CON-004`、`TX-CON-002`、`AR-CON-001/003/004`；source/status 轴丢失或 query side-path 写入即 P0 阻断。 |

### 7.6 PH-04 可验证增量：intent/state 与 5 Command 安全

| 项 | 内容 |
|---|---|
| 功能增量 | 建立 draft→request→receipt/result presentation 的 phase 分层、exact-scope whole-record carrier、single-flight、dispatch boundary、ambiguous→unknown 和 no-replay；仅保留 `OwnerCommandPort.submit` 这一唯一潜在 owner write。 |
| 输入 | PH-03 safe query material；`03` §5/§7～§13；`05` INTENT/STATE/CONSISTENCY TC；`06` `AC-CON-004`、`ST-CON-005/006/009`、`TX-CON-001/002`、`CC-CON-003～005`、`VETO-CON-003`。 |
| 输出 | intent/state modules、5 Command safety flows、formal reconciliation read seam、carrier fake/recording ledger、error/recovery input contracts。 |
| 不包含 | owner-side idempotency store、durable/cross-tab persistence、自动 retry/replay、local authorization、exact positive submit schema（合同未闭口时）。 |
| 测试门禁 | `console-module-flow`、`console-port-adapter`、`console-controlled-composition`、`console-concurrency-race`；必须分别覆盖 pre-dispatch cancel、possible-dispatch unknown、double semantic action、carrier write ambiguity。 |
| 验收门禁 | `AC-CON-004`、`AC-FR-004`、`AR-CON-006/010`、`ST-CON-005/006/009`、`TX-CON-001/002`、`CC-CON-003～005`；receipt/toast/2xx/保存完成不得提升 formal terminal。 |

### 7.7 PH-05 可验证增量：八主题 owner partition 与 composition

| 项 | 内容 |
|---|---|
| 功能增量 | 以固定 owner 映射组合八个 Topic Query：员工、项目/Workspace、方法资产、Governance/SoA/AIIA/Control/Gate、审计/指标、Capability Hub、Archive、Sandbox；每个 partition 独立、顺序 canonical、失败局部，严格区分 empty 与 unavailable。 |
| 输入 | PH-04 access/intent/state safety；`03` §5～§8；`05` TOPIC/CONSISTENCY TC；`06` `AC-CON-005`、`AC-FR-005～010`、`IFG-CON-006`、`AR-CON-009/010`、`VETO-CON-005/007`。 |
| 输出 | `features` descriptors/page/semantic-region composition、8 Topic Query adapters 的 blocked/read-only/partial posture、partition call ledger。 |
| 不包含 | owner domain aggregate、跨 owner transaction、projection/cursor、统一 health/compliance/readiness、未停审 L5/L6 私有 link、任何执行/治理决定。 |
| 测试门禁 | `console-controlled-composition`、`console-module-flow`、`console-redaction-boundary`；验证 completion order independence、partial isolation、canonical order 和 no-call when facet disabled。 |
| 验收门禁 | `AC-CON-005`、`AC-FR-005～010`、`AR-CON-001/009/010`、`IFG-CON-006`、`VETO-CON-005/007`；single-owner success 不得掩盖 sibling failure。 |

### 7.8 PH-06 可验证增量：recovery、semantic a11y 与 diagnostics

| 项 | 内容 |
|---|---|
| 功能增量 | 将异常/部分/过期/冲突/unknown 映射为 typed degradation，生成 immutable subject-specific recovery plan；视觉、键盘、辅助技术共用 action/guard/outcome/ceiling；diagnostic 仅 body-free、可 disabled、sink failure 隔离。 |
| 输入 | PH-05 partition states；`03` §9/§11/§14/§15；`05` RECOVERY/A11Y/DIAG/SEC TC；`06` `AC-CON-006`、`AC-FR-011/012`、`ST-CON-008/011`、`CC-CON-003`、`VETO-CON-004/006`。 |
| 输出 | recovery/diagnostics modules、focus/announcement mapper、whitelist/redaction gate、synthetic leak corpus and recursion fixture；不写 owner audit/evidence。 |
| 不包含 | generic retry-all、后台 repair/job、production log backend、browser/AT compatibility verdict、diagnostic→audit/evidence/readiness 推导。 |
| 测试门禁 | `console-recovery-matrix`、`console-semantic-a11y`、`console-redaction-boundary`；stale plan 必须 zero action 或一个批准 action，sink failed/disabled 时业务 outcome/state 不变。 |
| 验收门禁 | `AC-CON-006`、`AC-FR-011/012`、`AC-NFR-006/007`、`AR-CON-003/011`、`ST-CON-008/011`、`VETO-CON-004/006`。 |

### 7.9 PH-07 可验证增量：runtime adapter、conditional invalidation 与受控组合

| 项 | 内容 |
|---|---|
| 功能增量 | 将前六个阶段的 consumer-owned narrow Port 接入官方 SDK/正式服务边界；registry 只能选择已批准 slot；owner/SDK contract 缺失时保持 `disabled/blocked/read-only/partial`。conditional invalidation 默认 disabled，future enabled 只允许单调收紧。 |
| 输入 | PH-01～PH-06 的安全 seam；`03` §6/§7/§13；`04` §8～§12；`05` ADAPTER/consumer/ARCH/CONSISTENCY TC；`06` `IFG-CON-003/007`、`AR-CON-002/010`。 |
| 输出 | `adapters` registry、safe request/response mapper、fake/formal parity harness、optional invalidation consumer and controlled composition gates；positive instance 仅在 authority 到达后 planned。 |
| 不包含 | SDK 私有 schema、owner sibling source、DB/private bus/BFF、broker cursor/replay/store、projection/outbox/worker/job、猜造 endpoint/path/topic。 |
| 测试门禁 | `console-port-adapter`、`console-controlled-composition`、`console-concurrency-race`、`console-architecture-static`；检查 no-call/blocked posture、raw error/body redaction、invalidation duplicate/conservative race。 |
| 验收门禁 | `AC-FR-003～010` 的 conditional positive、`IFG-CON-003/006/007`、`AR-CON-002/005/010`、`ST-CON-004/006/007`、`CC-CON-006`；enabled 缺 exact positive evidence 即阻断，不得以 fake pass。 |

### 7.10 PH-08 可验证增量：release gate、report、evidence 与 handoff

| 项 | 内容 |
|---|---|
| 功能增量 | 在 implementation、design、config、environment、data、dependency、facet、run 均真实固定后，执行 release safety/config/redaction/dependency/report-audit，生成同一 run 的 raw/report、future EV candidate index 和 acceptance handoff 草稿。 |
| 输入 | PH-01～PH-07 真实执行产物；`05` §9/§13/§14；`06` §3/§10～§14；固定 `run_id` 与 review version。当前均不存在。 |
| 输出 | `artifacts/test/<run_id>/`、`reports/runs/<run_id>/`、`reports/acceptance/` 的 planned generator contract、pairing/redaction/no-static/dependency audit、handoff/VETO/risk/open-issues draft。 |
| 不包含 | 新业务功能、owner truth/evidence body、静态 EV/VETO passed、风险接受/最终 verdict/signoff/readiness 的伪造。 |
| 测试门禁 | `console-release-safety-smoke`、`console-release-config-redline`、`console-release-redaction`、`console-release-dependency`、`console-release-report-audit`；失败 run 保留，重跑用新 run id，任何缺 pair/digest/no-static 失败。 |
| 验收门禁 | `AC-CON-007`、`AC-NFR-003～007`、`EV-RELEASE-001` 资格和七项 VETO checklist 生成入口；最终 `verdict/signoff/readiness` 仍由真实 06 生命周期裁决。 |
