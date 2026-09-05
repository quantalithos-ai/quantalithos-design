# Step 11. 配置影响轮廓

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 11
> 回填章节: `02-概要设计.md` §11 配置影响轮廓
> 生成日期: 2026-08-25
> 状态: completed / pass / stop_review
> 正式 02 写入: forbidden until Step 14

## 1. 本步目标、输入与边界

本步识别已收稳的七个主要组成部分、入口 / Consumer / Job、Port、projection 与 local handoff 哪些会受运行配置影响；同时冻结所有不能由配置绕过的 owner、状态、history、body、source、dependency 与 pending 红线。它只给出影响类别和后续实现契约方向，不定义配置项、默认值、环境变量、JSON / YAML、密钥名称、加载器实现、部署挂载或热更新流程。

| 项目 | 内容 |
|---|---|
| 本步输入 | Step 3 `HLD-C-L2M-001~020`；Step 4 双轴代码主体 / 分层；Step 5~9 的组成部分、对象、接口、流与状态；Step 10 的异常与边界；正式 01 `CC-L2M-013/014` 与架构非目标。 |
| 本步输出 | 配置影响轮廓表、禁止配置化边界表、按需影响图、03 / 04 承接方向。 |
| 决策原则 | 配置可以选择受已授权结构约束的运行行为、可选投影和 operational continuation；配置不能创造 owner、放宽安全 / 状态门禁、把 pending contract 变为 closed，或把 runtime / event / ref 关系变成 package dependency。 |
| 不在范围 | concrete key、default、number、secret source、configuration format、loader / validator implementation、adapter constructor、deployment / rollback / rotation。 |

## 2. SOP 问题回答与当前材料诊断

### 2.1 哪些结构直接或间接受配置影响

直接受影响的只能是已在 Step 4 / 5 定名的 entry、Application Service 外层、owner-specific adapter / Port 装配、Operations Job 与 optional projection activation；Domain object 和 policy 只能通过已经验证的 effective configuration / safe source context 间接受影响，不能自行读取配置。

| 判断问题 | 收敛回答 |
|---|---|
| 哪些主要部分 / 接缝可受配置影响 | CP01 host collaboration 装配、CP02 subscription / screening operational profile、CP03 Runtime seam装配、CP04/05 handoff / relay job、CP06 resolver / refresh profile、CP07 visibility / optional projection / rebuild profile，以及共享 persistence / observability material 的非业务承载。 |
| 哪些模块只能间接受影响 | 所有 Domain truth / state / record / policy；它们只能接收 Application 层已验证的 typed input、effective policy result或explicit activation basis，不能读取 config / environment。 |
| 哪些不能配置化 | ProjectMember 主语与 identity anchor、owner 边界、fail-closed、forbidden body、状态迁移红线、append history、local-truth-first、unique source owner、Query no-write、Core-only compile、pending semantics。 |
| 03 需要定义什么 | `RuntimeConfig` / effective-config view 的结构边界、`ConfigLoader` / `ConfigValidator`、`AdapterConfig`、`JobConfig`、`ConfigError`、runtime builder / application injection、provenance / version / scope 与 change-application boundary。 |
| 04 需要定义什么 | 配置目录、填写 / 校验 / 发布 / 生效说明、secret reference usage、environment / deployment binding、操作约束和变更说明；其前提是 03 已锁实现契约且上游 pending 获得相应 authority。 |

### 2.2 当前材料诊断与设计取舍

| 风险 | 未采用做法 | 采用取舍 |
|---|---|---|
| 将 subscription / screening 写成私有开关 | 配置会替代 Governance / Work / Identity source truth，可能 fail-open | 只允许 runtime assembly 选择已授权消费 profile；scope、source resolution 和 screening decision 仍经 CP02 / CP06 policy。 |
| 将 host / Runtime / carrier pending 写成 endpoint / protocol 配置 | 以配置伪造未闭口 contract，导致 integration / readiness 假象 | exact host / Runtime / event schema / route保持 `L2M-UP-001~008` pending；配置不能激活未知 seam。 |
| 让 Domain 或 projection Query 直接读配置 | domain invariant 被绕过，Query产生隐式写 / refresh | 只允许 bootstrap / application wiring 注入经验证 effective configuration；Query保持只读。 |
| 将 retry / timeout 等参数当作恢复权 | unknown side effect 可能被自动重放 | Job / adapter profile 即使以后可配，也必须受 idempotency、unknown fence、source owner与state redline约束。 |
| 将 outlet availability 当 feature 开关的正向成功 | 可能把 optional view 误成 registry / authorization | activation 仅决定是否提供 optional projection；`available`仍需 matching CP06 resolution / safe refs / watermark proof。 |

## 3. 配置影响轮廓表

| 主要部分 / 接缝 | 是否受配置影响 | 配置影响类型 | 交给详细设计展开 |
|---|---|---|---|
| CP01 Presence / Host：command / host collaboration Port 装配 | 是 | runtime profile、host-seam selection、credential / startup reference usage、local handoff operational profile | 定义 bootstrap / application injection、`AdapterConfig` / credential-ref usage boundary、effective config provenance；不得定义或签发 credential。 |
| CP01 `MemberPresence` / `StartupAdmission` domain state | 间接受影响 | Application 将已验证启动语境 / operational profile 传入；不允许 state自行读取配置 | 定义 application-to-domain typed input boundary；不允许配置改变双锚入场或状态迁移红线。 |
| CP02 subscription / inbound boundary | 是 | allowed operational subscription profile、intake enablement / source binding、inspection operational guard | 定义 `RuntimeConfig` 到 `SubscriptionScopeService` / `InboundBoundaryService` 的注入与 validation；scope仍必须有正式 source / subject basis。 |
| CP02 screening policy / decision | 间接受影响 | effective-policy consumption profile、approved inspection boundary | 定义 `ConfigValidator` 如何验证 profile 与 owner-provided safe result的兼容性；不得把 policy rule、allowlist或default pass配置化。 |
| CP03 Runtime mediation Port / command application | 是 | Runtime seam selection / adapter assembly、operational backpressure / continuation profile | 定义 `AdapterConfig`、runtime builder 与 `RuntimeEntryPort` injection；exact trigger / carrier mapping仍由 `L2M-UP-003/004/005` 阻断。 |
| CP03 delivery decision / submission attempt domain | 间接受影响 | 已验证 port availability / application policy context | 定义 domain input与application guard边界；不得由配置创建 Runtime run、绕过 entry mapping或解除 unknown fence。 |
| CP04 publication boundary / relay job | 是 | formal handoff operational profile、relay scheduling / batch / continuation constraints | 定义 `JobConfig`、`EventPublicationPort` adapter injection与local continuation boundary；不得配置为宣称 delivery / downstream acceptance。 |
| CP05 trace / observation relay | 是 | observability material profile、relay scheduling / cardinality / retention implementation category | 定义 `JobConfig`、material policy injection / retention contract；不得开放 complete log、evidence body或把 observed写入 member。 |
| CP06 owner-specific resolver ports / refresh job | 是 | resolver / refresh profile、source binding、freshness evaluation implementation category | 定义 `AdapterConfig`、`JobConfig`、provenance / scope / version validation；不得配置 generic source hub、source truth或authorization。 |
| CP07 summary / diagnostics visibility与projection rebuild | 是 | read consistency hint handling、visibility profile、rebuild / reconciliation operational profile | 定义 `RuntimeConfig`、`JobConfig`、projection-store injection、effective config view；不得配置 Query write、source repair或current证明条件。 |
| CP07 optional capability outlet | 是（可裁剪） | explicit activation / pruning、safe display filter、read profile | 定义 activation basis / `AdapterConfig` validation；`available`仍必须由 CP06 resolution与watermark覆盖决定。 |
| stores、ports、semantic event / observation carrier的装配层 | 是 | persistence / adapter / carrier operational selection category | 定义 runtime builder、config provenance、error surface与pending-aware validation；不得将 event / runtime / ref seam改写成 compile dependency。 |
| configuration explanation read surface（外围） | 是（只读） | effective-config provenance / source / version / scope visibility | 定义 body-free explanation DTO / Query boundary；不得使解释视图成为 config truth或控制入口。 |

#### 配置影响轮廓图

```text
<Config source / deployment binding>
              │ load + validate + provenance
              ▼
<Bootstrap / runtime builder / Application wiring>
      │                 │                    │
      ▼                 ▼                    ▼
<Port / adapter>   <Operations Job>   <optional read projection>
      │                 │                    │
      └──────────────┬──┴────────────────────┘
                     ▼
<validated typed input / effective profile>
                     │
                     ▼
<Domain truth / policy / state>
  owner, body, state and history invariants remain fixed
```

关键说明：

- 图表达配置只经 bootstrap / application injection 影响既有 Port、Job、可选投影或 validated typed input；Domain 不直接读取配置。
- 图不表达配置格式、字段、密钥系统、deployment mount、热更新、rollback 或实际 adapter constructor。
- 任何 effective configuration 仍必须有 owner、source、version、scope 与 effective state；stale / conflict / unknown 不能静默生效。
- 运行配置不能绕过 fail-closed、forbidden-body、append history、Query no-write、unique source owner或`L2M-UP-001~008` pending boundary。

## 4. 禁止配置化边界表

| 禁止配置化边界 | 原因 | 若需改变应回到哪里 |
|---|---|---|
| 项目型 `ProjectMemberRef` 执行主语、`GlobalMemberRef` 身份锚及其关联一致性 | 这是 CP01 admission invariant，不能由 profile、显示名或环境覆盖。 | 回到 00 需求 / Work / Identity / ADR-0004，并重新校准 CP01。 |
| member 与 Runtime、host、Bus、Governance、Tools、Conversation、Observability等 owner 的 truth 边界 | 配置不能创造第二 run / policy / registry / health / delivery / observed truth。 | 回到对应 owner合同与 01 架构边界。 |
| fail-closed、unknown fence、blocked / pending / stale / gap 的显式性 | 配置化放行会把未证明 source / side effect 伪装为成功。 | 回到 00 BR / 01 AIC / Step 3 约束与相关状态机。 |
| screening 规则 truth、authorization、allowlist / denylist裁决 | member 只消费 Governance formal result / safe snapshot，不能从本地 config取得裁决权。 | 回到 Governance owner与CP02 / CP06设计。 |
| forbidden-body、body-free、redaction、低敏低基数边界 | 正文 / hidden reasoning / secret / definition / complete log不能因部署差异穿越数据边界。 | 回到 00 BR / 01 CC与CP02~CP07对象 / 流。 |
| `MemberPresence`、screening、delivery、attempt、gap、resolution、projection状态迁移红线 | 状态含义与允许迁移是领域结构，不是 feature behavior。 | 回到 Step 9及相应CP对象 / flow。 |
| append / successor history、dedup与unknown side-effect fence | 配置不得启用覆盖历史、盲重放或将late input自动升级。 | 回到 Step 3 / Step 8 / Step 9，并在03定义受约束实现。 |
| local-truth-first、无跨仓事务与外部反馈不反写 | 不能用一致性模式开关改变 owner 和回滚语义。 | 回到 01一致性机制、Step 8处理流与相邻owner合同。 |
| CP06唯一 rule / capability source update owner与CP07 no-write | 防止 generic hub、direct source event或projection repair取得写权。 | 回到 CP06 / CP07 接口、流、状态与上游 owner。 |
| Core-only compile dependency与runtime / event / ref / adapter / fake分类 | 不能以配置把 sibling package、pending schema或adapter假装成正式依赖。 | 回到全局依赖裁剪规则、01 §8与Step 7依赖审计。 |
| `L2M-UP-001~008` 的 pending / blocked / fail-closed语义 | 配置不能闭合 host、image、Runtime、event、credential、policy或subject的精确合同。 | 回到 Step 13风险台账与相应上游 / sibling正式合同。 |
| non-authorizing capability outlet与Query no-write | 不能用开关把 view变为registry / invocation gateway，或令读取触发refresh / rebuild。 | 回到 CP07对象、接口、处理流与状态机。 |

## 5. 03 / 04 承接方向

| 后续文档 | 必须继续收敛 | 当前不可假设 |
|---|---|---|
| `03-详细设计.md` | effective-config model、source / version / scope / provenance、`ConfigLoader`、`ConfigValidator`、`ConfigError`、`RuntimeConfig` / `AdapterConfig` / `JobConfig`边界、runtime builder injection、domain不得直读config、pending-aware validation。 | 字段全集、具体格式、constructor signature、reload / transaction / retry实现、精确external contract。 |
| `04-配置设计.md` | 依托03已锁定契约，说明配置分类、填写 / 校验 / 生效 / audit方式、secret ref使用、环境 / deployment绑定、变更约束和可解释视图。 | 未有authority的endpoint、credential shape、event route、schema、默认值、数值、host / image / Runtime readiness。 |
| `05~07` | configuration fake / test coverage、验收边界、实施顺序和planned skeleton。 | test pass、run、evidence、report、signoff或readiness。 |

## 6. 回填草稿

正式 `02-概要设计.md` §11 应保留两张表：一张按 CP01~CP07 / shared wiring 说明“是否受配置影响、影响类型、交给03展开”，另一张列出不可配置化的主体、owner、fail-closed、body、状态、history、source-owner、dependency和pending红线。正文附一段明确说明：配置只经 bootstrap / Application 影响既有边界，03 收敛实现契约，04 再说明如何填写和使用；不含 key、default、format或deployment细节。

## 7. Step 11 停审与进入下一步条件

| 审查项 | 结论 | 说明 |
|---|---|---|
| 受配置影响结构可回指 | pass | 每项都回指 Step 4实现层、Step 5 CP01~07、Step 7 Port / Job / Query或Step 10异常边界。 |
| 间接受影响的Domain隔离明确 | pass | Domain truth / policy / state不直读config，只接收validated typed input / effective profile。 |
| 禁止配置化红线完整 | pass | owner、fail-closed、body、状态、history、source owner、no-write、dependency和pending均已覆盖。 |
| 03 / 04承接分工清楚 | pass | 03定义实现契约；04说明填写 / 校验 / 使用；当前不假设任何具体key或外部合同。 |
| 未滑入详细配置或实施 | pass | 未写配置项、默认值、格式、环境变量、密钥、加载实现、部署或run结论。 |
| pending诚实性 | pass | `L2M-UP-001~008`未被config activation、endpoint或profile伪闭口。 |

Step 11 结论为 `completed / pass / stop_review`。下一允许动作是读取 Step 12 的 SOP 与书写规范输入，更新三层台账到 `detailed_design_handoff` 并创建 `02_hld_step_12_detailed_design_handoff.md`；不得提前创建 Step 13。
