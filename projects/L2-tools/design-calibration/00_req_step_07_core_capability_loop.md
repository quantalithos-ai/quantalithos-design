# L2-tools 需求 Step 7:核心能力闭环

> Step 状态: completed_stop_review
> 当前模式: full-restart
> 正式回填目标: `00-需求文档.md` §7
> 本步原则: 从仓存在必要性提炼能力成立骨架;闭环箭头只表达逻辑依赖,不表达运行时调用、接口时序、事件传播、开发顺序或阶段优先级。

---

## 1. Step 状态与 Step 内计划

### 1.1 Step 状态

| 字段 | 值 |
|---|---|
| step | Step 7 |
| status | `completed_stop_review` |
| gate_status | `pass` |
| previous_step | Step 6 `使用方与依赖` |
| current_module | `core_capability_loop:completed` |
| next_allowed_action | `wait_user_review_to_step_08` |
| formal_section | `00-需求文档.md` §7 |
| formal_write_status | `not_written` |
| blocker_status | 既有上游缺口不阻塞 Step 7,但必须约束 Step 10 / 12 / 15 及后续正式设计。 |

### 1.2 本步目标

从 Step 2 的工具调用语义契约真相边界、Step 4 的目标 / 非目标和 Step 6 的仓际关系中,提炼 `L2-tools` 成立必须共同具备的核心能力,固定后续 Step 8~14 的逐节点讨论顺序和停审合同。

本步只回答“哪些能力必须成立以及为何共同成立”,不回答具体故事、功能编号、规则、数据字段、接口、事件、状态机、实现组件、质量数字或验收结果。

### 1.3 Step 内计划

| 序号 | 动作 | 状态 | 输出 / 门禁 |
|---:|---|---|---|
| 1 | 恢复项目 ledger、需求 flow 和 Step 2 / 4 / 6 | done | 确认只允许 Step 7,正式 `00` 不可写。 |
| 2 | 读取需求 SOP Step 7 与书写规范 §4.7 | done | 固定七项中间产物和正式章节三件套。 |
| 3 | 复核参考项目粒度 | done | 采用完整结构并补齐逐节点进入 / 退出条件。 |
| 4 | 回答 SOP 九问 | done | 必要性、共同能力、缺失后果、层级、映射、顺序和停审均有结论。 |
| 5 | 比较候选闭环主轴 | done | 排除旧功能链、外仓调用链和实现链,采用工具语义 truth 成立链。 |
| 6 | 固定五个能力节点 | done | 节点使用能力成立句,图中不出现外仓或对象名。 |
| 7 | 处理条件路径 | done | capability-unbound、本地工具、执行前拒绝和外部交接失败均有边界说明。 |
| 8 | 建立能力层级与历史线索映射 | done | 核心、外围和边界外三类清晰,旧功能不反向生成节点。 |
| 9 | 预定义 Step 8~14 节点停审合同 | done | 只登记未来必须证明的内容,不伪报后续 Step 已完成。 |
| 10 | 判定 blocker、自检并停审 | done | 无新增 blocker;等待用户确认是否进入 Step 8。 |

---

## 2. 本步输入

| 来源 | 已读取结论 | 对 Step 7 的约束 |
|---|---|---|
| `00_req_step_02_position_boundary.md` | 本仓是 runtime 行动契约层中的工具调用语义契约真相仓。 | 闭环必须围绕本地工具合同、规范调用、工具语义结果 / 错误 / 审计成立,不能变成 Runtime、Hub、Sandbox 或 Observability 的能力链。 |
| `00_req_step_04_goals_non_goals.md` | 已固定本地工具契约、受控 capability binding、规范调用消费、执行接缝和安全结果交接五类目标。 | 五类目标必须被能力节点承接;historical-material 处理纪律不是独立能力节点。 |
| `00_req_step_06_consumers_dependencies.md` | Core 是唯一已确认编译期依赖,但 Tools-specific shared schema / contract 仍为 pending;Hub / Sandbox 是按场景生效的当前运行期依赖;Runtime 是当前直接下游运行期消费者;Bus / Observability 是当前非阻塞事件协作依赖;governance / authorization 仅保留 owner 未解析的 pending seam,SDK 仅为 future / excluded 边界。 | 不得把依赖仓写入闭环图;不得把场景前置升级为所有工具的全局强前置,也不得把 governance 或 SDK 升格为当前项目依赖。 |
| `需求文档讨论流程_SOP.md` Step 7 | 必须输出仓存在必要性、闭环、节点顺序、停审清单、外围增强、边界外和功能回填映射。 | 每个节点必须预定义停审点;Step 7 通过前不得进入用户故事。 |
| `需求文档书写规范.md` §4.7 | 正式章节必须有闭环定义短文、ASCII 图和能力层级划分表。 | 图中节点只能写能力成立状态,建议 3~5 个,不得出现仓名、接口、事件、对象字段或实现机制。 |
| 已完成项目 Step 7 | `L3-capability-hub` 提供完整结构;`L1-artifact` 提供进入 / 退出和后续承接粒度。 | 采用约 300 行完整校准结构,不复制其它领域内容或冗长逐模块过程。 |
| README 与旧 `00/01/02/03/05/06` | 只提供旧 schema、builtin、MCP、Sandbox、audit 和 extras 线索。 | 全部为 historical material;只能在独立结论形成后映射或裁剪。 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 如果没有这个仓,系统会缺什么不可替代的能力或结构? | 平台会缺少独立、稳定且可追溯的工具调用语义合同。Runtime、具体适配方、Capability Hub、Sandbox 或观察系统将分别补造工具身份、定义、调用和结果解释,导致同一行动出现多套 truth。 |
| 这个仓成立必须共同具备哪些能力? | 必须共同具备:稳定工具身份与完整定义;外部能力事实的受控关联边界;统一且可消费的规范调用语义;执行前置约束与条件化隔离交接;结果、错误、工具域审计与安全交接。 |
| 哪些能力缺一个,这个仓就不算真正成立? | 缺身份 / 定义会退化为工具库存;缺受控外部关联会复制 Hub truth 或无法表达 capability-bound 工具;缺规范调用会由消费者各自解释输入与调用语境;缺执行接缝会旁路安全前置或混淆 Sandbox truth;缺 outcome / audit 会让调用无法统一解释和追溯。 |
| 哪些能力只是外围增强? | 契约浏览 / 搜索 / diff、批量维护、兼容性提示、开发辅助、管理 UI、派生索引、友好诊断与消费说明等改善维护和体验,但不决定工具语义 truth 是否成立。 |
| 哪些能力根本不属于本仓? | agent loop 与编排、capability / provider registry、effective authorization、Sandbox run / capture / cleanup、Bus delivery recovery、Observability store、SDK client、具体 builtin / MCP Client / Role extras / image / marketplace 及外部 provider control。 |
| 当前旧功能线索如何支撑能力? | schema / descriptor 线索只支撑 C-L2T-1 / 3;MCP / Hub 线索只支撑 C-L2T-2 的受控关联和 C-L2T-4 的适配边界;Sandbox 线索只支撑条件化交接;旧三类事件线索只支撑 C-L2T-5 的语义需求。具体库存、extras、事件名和数字不继承。 |
| 核心能力闭环拆成哪些节点? | 拆成 `C-L2T-1~5`,见 §7.4。 |
| 按什么顺序讨论? | 先固定身份 / 定义,再固定外部事实关联,再固定规范调用,再固定执行前置与条件化交接,最后固定 outcome / audit / safe handoff。该顺序是能力成立逻辑,不是运行时或实施顺序。 |
| 每个节点停审必须证明什么? | 必须证明节点的自身 truth、逻辑前置、进入 / 退出条件、相邻 owner、失败边界、禁止混写项及 Step 8~14 局部追溯已收敛;节点未通过不得展开下一节点。 |

---

## 4. 当前文档问题诊断

### 4.1 候选节点核心性判断

| 候选能力 | 分类 | 核心性判断 |
|---|---|---|
| 稳定工具身份与完整定义 | 核心 | 没有它,消费者只能按名称、实现或临时配置解释工具,不存在稳定合同。 |
| 外部 capability 受控关联 | 核心 | 本仓必须支持 capability-bound 工具但不得复制 Hub truth;即使纯本地工具无需关联,该边界仍是仓际工具合同成立条件。 |
| Runtime / 调用方规范消费 | 核心 | 工具合同若不能形成统一调用语义,Runtime 和各 adapter 会自建请求 / 结果解释。 |
| 执行前置与条件化隔离交接 | 核心 | 工具语义必须能承接外部授权结论和执行要求,同时保持 Sandbox execution truth 独立。 |
| normalized outcome / tool-domain audit | 核心 | 没有统一结果、错误和工具域审计语义,调用不能稳定消费、比较或追溯。 |
| 具体 builtin / MCP Client / adapter 库存 | 边界外或后续产品 / 实现 | 具体库存不决定合同 truth 是否成立。 |
| 搜索、diff、批量维护、UI | 外围增强 | 改善维护体验,不改变核心语义。 |

### 4.2 仓存在必要性结论

`L2-tools` 必须作为独立的工具调用语义契约真相仓存在,因为平台需要一处不受行动选择、外部能力目录、隔离执行事实、观察投影和产品库存反向定义的稳定工具合同。它使调用方能够围绕同一工具身份、定义、规范调用、工具语义 outcome 和工具域审计协作,同时只通过受控引用承接外部 truth。

若缺少本仓,工具身份与定义会散落在 Runtime 配置、具体 builtin、外部 capability descriptor、Sandbox command 或 SDK wrapper 中;执行结果会分别由 adapter capture、Bus delivery audit 或 Observability projection 解释。平台因此无法回答“调用的是什么工具、依据哪份正式定义、为何进入或拒绝执行、得到何种工具语义结果、如何安全追溯”,实现侧只能反复补字段、状态和转换规则。

### 4.3 不可替代缺口

| 缺口 | 缺失表现 | 不能由谁替代 |
|---|---|---|
| 稳定工具合同 | 同名工具、具体实现和调用方配置分别定义身份与输入 / 输出语义。 | Runtime orchestration、builtin inventory、Hub descriptor、SDK client。 |
| 外部事实关联边界 | capability-bound 工具要么复制 registry / exposure truth,要么靠本地字符串猜测关联。 | 本地 allowlist、provider registry、Runtime cache。 |
| 规范调用语义 | 每个调用方各自解释调用语境、受理、拒绝和终态。 | agent loop、adapter-specific request、Sandbox command。 |
| 工具语义归一化 | Sandbox capture、provider response 或本地执行返回值被直接当成正式工具结果。 | Sandbox run truth、日志、trace 或 delivery record。 |
| 工具域审计与安全交接 | 调用无法被工具语义回链,或正文 / secret 被错误推入观察和事件面。 | Bus transport audit、Observability projection、Runtime checkpoint。 |

---

## 5. 改动前后对比

### 5.1 Historical material 问题诊断

| 历史位置 | 旧表现 | 问题 | Step 7 处理 |
|---|---|---|---|
| README 仓使命 | Python 工具集 monorepo、builtin、MCP Client、Role extras 并列。 | 用技术、库存和产品装配定义仓存在性。 | 全部降为 historical material;只保留“Runtime 需要统一工具合同”的问题线索。 |
| 旧 `00` 核心用例 | builtin 调用、Sandbox、Hub allowlist、三类事件、extras 构成主链。 | 把产品功能、外仓 truth、事件名和镜像装配当闭环。 | 重建为五个能力状态;旧用例只做回填映射。 |
| 旧 `00` `F-001~010` | registry、具体工具、sandbox_exec、MCP client、事件、extras。 | 功能清单无法证明仓为何独立成立,并侵入多个 owner。 | 逐项归为核心线索、外围候选或边界外,不继承编号和优先级。 |
| 旧 `01/02` | Python 同进程 package 和具体模块拆分。 | 技术 / 部署形态反向定义需求。 | 不进入能力节点。 |
| 旧 `03` | Rust RPC / HTTP 服务、持久化、history / replay。 | 与旧 `01` 冲突且吸收 Observability / Runtime truth。 | 不进入能力节点;仅作后续设计污染检查。 |
| 旧 `05/06` | 旧事件、错误码、SLA、测试与验收结论。 | 无当前 authority 或真实 evidence。 | 不继承,不得作为 Step 7 成立证据。 |

---

## 6. 设计取舍

### 6.1 闭环主轴方案取舍

| 方案 | 主轴 | 优点 | 缺点 | 结论 |
|---|---|---|---|---|
| A | builtin -> sandbox_exec -> MCP client -> audit event -> extras | 贴近旧稿。 | 是功能 / 产品链,混入库存、外仓能力和事件名。 | 不采用。 |
| B | Runtime -> Hub -> Tools -> Sandbox -> Bus / Observability | 外仓协作直观。 | 是依赖 / 调用图,不是本仓能力成立关系;还会把场景依赖全局化。 | 不采用。 |
| C | identity / definition -> controlled relation -> canonical invocation -> constrained execution seam -> normalized outcome / audit | 能解释本仓不可替代 truth,并保护相邻 owner。 | 需要 Step 8~14 再按节点展开具体需求。 | 采用。 |
| D | registry -> API -> adapter -> database -> events | 容易落实现。 | 是概要 / 详细设计链,违反需求粒度。 | 不采用。 |

---

## 7. 结构化中间产物

### 7.1 核心能力闭环结论

`L2-tools` 的核心能力闭环不是 builtin、MCP Client、Sandbox 和事件的功能串联,而是:工具必须先能以稳定身份和完整定义进入正式契约语境;工具定义与外部能力事实的关联边界必须受控成立且不复制外部 truth;正式工具契约必须形成统一、可消费的规范调用语义;规范调用的执行前置约束与条件化隔离交接必须成立;最后,无论执行成功、执行失败还是执行前保守收束,其结果、错误、工具域审计和安全交接都必须形成一致语义。任一能力缺失,本仓都会退化为工具库存、局部 schema、外部 capability 镜像、执行适配器或审计事件发送器,无法承担工具调用语义真相源。

### 7.2 核心能力闭环 ASCII 图

```text
工具能够以稳定身份和完整定义进入正式契约语境
  -> 工具定义的外部能力关联边界能够受控成立且不复制外部真相
  -> 正式工具契约能够形成统一且可消费的规范调用语义
  -> 规范调用的执行前置约束与条件化隔离交接能够成立
  -> 规范调用的结果、错误、工具域审计与安全交接能够成立
```

本图只表达五类仓级能力成立的逻辑依赖关系,不是每次调用必须经过的运行时路径,也不是接口时序、事件传播顺序、开发步骤、阶段优先级或对象字段关系。

### 7.3 能力层级划分表

| 分类 | 内容 |
|---|---|
| 核心能力闭环 | 稳定工具身份与完整定义;外部能力事实的受控关联边界;统一且可消费的规范调用语义;执行前置约束与条件化隔离交接;结果、错误、工具域审计与安全交接。 |
| 外围增强能力 | 工具契约搜索 / 浏览 / diff;批量维护与兼容性提示;派生索引和一致性检查;管理 UI;开发辅助说明;更友好的只读诊断、审计摘要和客户端消费说明。 |
| 边界外能力 | agent loop、LLM planning、动作选择、orchestration、retry / recovery / checkpoint;capability / external provider registry、descriptor、exposure / applicability truth;effective authorization / approval / Policy truth;Sandbox environment / run / capture / failure / handoff / cleanup truth;Bus delivery / retry / DLQ / replay truth;Observability store / projection / retention;SDK client;具体 builtin / MCP Client / Role extras / member-images;marketplace listing / transaction;provider route / quota / cost / secret lifecycle。 |

### 7.4 核心能力节点执行顺序

| 顺序 | 节点 | 能力成立描述 | 逻辑前置 | 缺失后果 |
|---:|---|---|---|---|
| 1 | `C-L2T-1` | 工具能够以稳定身份和完整定义进入正式契约语境。 | Step 2 的本仓 truth 边界。 | 工具只能按实现、名称或临时配置被解释,后续所有引用均不稳定。 |
| 2 | `C-L2T-2` | 工具定义的外部能力关联边界能够受控成立且不复制外部真相。 | C-L2T-1 已存在稳定本地合同。 | capability-bound 工具会复制外部 registry / descriptor / exposure,或依赖不可验证的本地字符串。 |
| 3 | `C-L2T-3` | 正式工具契约能够形成统一且可消费的规范调用语义。 | C-L2T-1;适用时承接 C-L2T-2。 | 调用方和适配方各自解释输入、语境、受理与拒绝,产生第二套工具合同。 |
| 4 | `C-L2T-4` | 规范调用的执行前置约束与条件化隔离交接能够成立。 | C-L2T-3;适用时需要外部能力关联、正式授权结论与隔离执行能力。 | 调用可能自我授权、绕过隔离、宿主直跑,或把 capture / failure 冒充工具结果。 |
| 5 | `C-L2T-5` | 规范调用的结果、错误、工具域审计与安全交接能够成立。 | C-L2T-3 已形成可解释调用;若进入执行则承接 C-L2T-4 的安全执行材料。 | 成功、失败、拒绝和交接状态无法统一解释,工具域事实会被观察或传递真相替代。 |

### 7.5 每个节点的进入 / 退出条件与禁止误写

| 节点 | 进入条件 | 退出条件 | 本节点禁止误写 |
|---|---|---|---|
| `C-L2T-1` | 本仓 truth 范围与相邻 owner 已确认。 | 稳定身份、完整定义、变更 / 退役的需求边界足以供 Step 8~14 展开,且唯一 owner 不含具体库存。 | 具体 builtin 名单、registry 技术、schema 字段、DTO、代码目录或部署形态。 |
| `C-L2T-2` | C-L2T-1 已有可被关联的稳定工具合同。 | capability-bound 与明确无需外部关联的场景可区分;本地只拥有 body-free binding relation,不复制 capability identity / descriptor / exposure / applicability truth。 | 把 Hub 可见性写成调用资格;建立本地 capability registry / allowlist;保存 external provider 正文。 |
| `C-L2T-3` | C-L2T-1 成立;capability-bound 场景已承接 C-L2T-2。 | 调用方能够消费同一正式合同和规范调用语义;动作选择、planning、orchestration、retry / recovery 仍在下游 owner。 | agent loop、LLM planning、API path、请求字段、函数调用顺序或 Runtime checkpoint。 |
| `C-L2T-4` | C-L2T-3 已形成可解释调用;适用的执行要求、风险声明和外部裁决引用可判断。 | direct / adapter / sandbox-required 等承载不分叉工具语义;governed 场景缺失 / 冲突 / 不可验证时 fail closed;sandbox-required 场景不可旁路,且 Sandbox truth 仍由其 owner 持有。 | L2 自我 allow / deny;管理 Sandbox run / capture / cleanup;宿主直跑;伪造 adapter mapping、receipt 或 dead-letter。 |
| `C-L2T-5` | C-L2T-3 已产生可解释的调用终态语境;若真实执行发生,已有可验证执行材料。 | normalized result / error、工具域审计和外部安全材料分层;本地 truth 先成立,外部 handoff 单独显式;body / secret 不越界。 | 把 capture、Bus delivery audit 或 observation projection 当工具结果;私造 producer enum / route;拥有 retention、replay 或 recovery truth。 |

### 7.6 条件路径与跨节点不变量

| 条件路径 / 不变量 | 结论 |
|---|---|
| 纯本地工具 | 若其正式定义明确无需外部能力关联,可以从 C-L2T-1 进入 C-L2T-3;这不删除 C-L2T-2 作为仓级核心能力,也不允许用“本地”绕过工具合同。 |
| capability-bound 工具 | 必须承接 C-L2T-2 的受控关联;关联缺失、stale 或不可验证时不能猜测 capability truth 或回退本地 registry。 |
| governed 调用 | 风险声明只表达本仓执行要求,不产生 effective authorization;正式 owner / source 缺失、冲突或不可验证时必须 fail closed。 |
| sandbox-required 调用 | 只有正式隔离交接成立后才能发生相应执行;不得静默降级到宿主直跑。 |
| 执行前拒绝 / 等待 / 保守收束 | 不要求伪造 Sandbox run 或 capture;由 C-L2T-3 / C-L2T-4 直接进入 C-L2T-5,形成可解释的无执行 outcome / error / audit 语义。 |
| 执行已发生 | C-L2T-5 只能消费正式 execution material / source ref 并做工具语义归一化,不得重写 Sandbox run / capture / failure truth。 |
| Bus / Observability handoff 失败 | 本地 result / error / 工具域审计不回滚、不改写;交接缺失单独显式,不得伪装本地调用失败或驱动 Runtime recovery。 |
| 核心闭环图箭头 | 表达仓级能力共同成立的逻辑依赖,不表示每次调用都经过相同分支或时序。 |

### 7.7 能力节点停审清单

> 本表只预定义 Step 8~14 的能力级停审证明,当前状态均为 `not_started`。不得把本表误读为故事、功能、规则、数据、接口、NFR 或验收已经完成。

| 节点 | 停审时必须证明 | 未通过风险 | 当前状态 |
|---|---|---|---|
| `C-L2T-1` | 角色故事、功能、规则、数据归属、接口边界、质量约束和验收共同证明稳定工具身份 / 定义由唯一 owner 持有,且具体库存和实现不反向定义合同。 | 后续节点围绕不稳定名称或具体实现补 truth。 | `not_started` |
| `C-L2T-2` | 能区分 capability-bound / unbound;只使用受控 ref / safe summary;Hub applicability 不等于 invocation authorization;外部 truth 正文不入仓。 | 本地复制 Hub registry / descriptor / exposure 或形成第二 allowlist。 | `not_started` |
| `C-L2T-3` | 调用方消费同一正式合同和 canonical invocation 语义;agent loop、planning、retry / recovery 未进入本仓。 | Runtime / adapter 各自形成请求和终态语义。 | `not_started` |
| `C-L2T-4` | 外部授权前置、fail-closed、条件化 Sandbox 交接、不可旁路和 execution truth owner 均有局部追溯;开放协议保持 blocker。 | L2 自我授权、宿主直跑或伪造 Sandbox 事实。 | `not_started` |
| `C-L2T-5` | 本地 normalized outcome / error / 工具域审计与外部 safe handoff 分层;无执行终态可解释;正文和 secret 不越界;观察 / 传递失败不反写。 | 多套结果 truth、审计替代、敏感正文泄露或观察系统驱动恢复。 | `not_started` |

### 7.8 功能回填映射结论

| 历史 / 预期线索 | 当前分类 | 支撑节点 / 后续落点 | 裁剪说明 |
|---|---|---|---|
| `ToolDescriptor registry`、input / output schema | 核心支撑线索 | C-L2T-1、C-L2T-3;Step 9~12 | 保留稳定定义与调用可解释性;不继承 `registry` 技术、旧字段或覆盖率数字。 |
| file / code / git / test / docs 等 builtin | 边界外库存线索 | 后续产品 / 实现裁剪 | 不以任何具体工具证明仓成立,也不承诺库存。 |
| `sandbox_exec` / 危险工具 | 核心边界线索 | C-L2T-4、C-L2T-5;Step 10~14 | 重裁为执行要求、条件化隔离交接和保守终态;不把 Sandbox 真相收入 L2。 |
| MCP Client / Hub allowlist | 核心接缝与实现历史线索 | C-L2T-2、C-L2T-4;Step 10~12 / 15 | 重裁为 controlled capability ref 与 adapter seam;不保留 Client 产品或本地 allowlist。 |
| `ToolInvoked / ToolCompleted / ToolFailed` | 核心语义线索 | C-L2T-5;Step 9~14 | 只保留“调用 outcome / audit 可追溯”的需要;旧事件名、三态和 100% 指标不继承。 |
| `requires_policy_check` / security 配规则 | 规则历史线索 | C-L2T-4;Step 10 / 12 / 14 / 15 | 风险 / 执行要求不等于 authorization truth;旧字段和管理员自授权不继承。 |
| Role extras / member-images | 边界外产品线索 | 不进入当前需求主链 | 工具库存与镜像装配不定义工具合同。 |
| invocation history / replay / metrics / trace store | 边界外线索 | Step 10 / 11 / 13 / 15 持续排除 | 分属 Runtime、Bus、Observability 或后续 owner;Tool-domain audit 不升级为观察 / 恢复存储。 |
| 契约搜索、diff、兼容性提示、管理 UI | 外围增强候选 | Step 8 / 9 / 13 | 可改善维护体验,不得阻塞核心闭环。 |

### 7.9 后续 Step 承接合同

| 后续 Step | 必须按五节点逐项形成的产物 | 禁止做法 |
|---|---|---|
| Step 8 用户故事 | 每节点的角色目标、核心 / 外围分类、故事映射和故事停审。 | 先生成全仓故事再强行归类;把 Runtime / Hub / Sandbox 仓名直接当角色。 |
| Step 9 功能需求 | 每节点外部可见业务能力、输入 / 输出 / 失败语境、故事映射和功能停审。 | 按 CRUD、API、handler、repository 或旧 `F-001~010` 直接恢复。 |
| Step 10 规则与边界 | 每节点保护 truth、fail-closed、不可旁路、不得反写的规则和停审。 | 私造 authorization source / allowlist / risk taxonomy 或把字段校验当业务规则。 |
| Step 11 数据归属 | 每节点的 truth / snapshot / ref / forbidden body 和 owner / consumer 边界。 | 提前定 struct / DTO / 表;保存 Hub / Sandbox / Observability 正文。 |
| Step 12 接口与依赖 | 每节点需求级输入、输出、失败、handoff 和依赖类型;显式承接 blocker。 | 私造 Sandbox receipt / route、Observability producer family 或 sibling path dependency。 |
| Step 13 非功能 | 每节点质量约束与全仓六类总审;无 authority 时保留可判断口径。 | 继承旧 P95、100% 或伪 SLA。 |
| Step 14 验收标准 | 每节点闭环 / 功能 / 规则 / 数据 / NFR 验收与一票否决,形成能力级停审。 | 伪造测试结果、run_id、evidence alias、签署或通过事实。 |
| Step 15~16 | 登记开放 blocker;以 FR 为主轴做跨能力孤儿 / 重复 / 串线审计。 | 在矩阵中补造新需求或把 pending 写成 resolved。 |

---

## 8. 回填草稿

> 以下仅为 Step 17 装配时可使用的候选正文。当前不得直接修改正式 `00-需求文档.md`。

### 8.1 闭环定义

`L2-tools` 的核心能力闭环不是 builtin、MCP Client、Sandbox 和事件的功能串联,而是:工具必须先能以稳定身份和完整定义进入正式契约语境;工具定义与外部能力事实的关联边界必须受控成立且不复制外部 truth;正式工具契约必须形成统一、可消费的规范调用语义;规范调用的执行前置约束与条件化隔离交接必须成立;最后,无论执行成功、执行失败还是执行前保守收束,其结果、错误、工具域审计和安全交接都必须形成一致语义。任一能力缺失,本仓都会退化为工具库存、局部 schema、外部 capability 镜像、执行适配器或审计事件发送器,无法承担工具调用语义真相源。

### 8.2 核心能力闭环图

```text
工具能够以稳定身份和完整定义进入正式契约语境
  -> 工具定义的外部能力关联边界能够受控成立且不复制外部真相
  -> 正式工具契约能够形成统一且可消费的规范调用语义
  -> 规范调用的执行前置约束与条件化隔离交接能够成立
  -> 规范调用的结果、错误、工具域审计与安全交接能够成立
```

本图只表达能力成立的逻辑依赖关系,不表示每次调用的运行时路径,也不表示接口时序、事件传播顺序、开发步骤或阶段优先级。

### 8.3 核心能力节点

| 节点 | 能力成立描述 | 边界说明 |
|---|---|---|
| `C-L2T-1` | 工具能够以稳定身份和完整定义进入正式契约语境。 | 身份 / 定义不由具体实现、调用方配置或库存反向决定。 |
| `C-L2T-2` | 工具定义的外部能力关联边界能够受控成立且不复制外部真相。 | capability-bound 工具使用受控引用;纯本地工具可明确无需关联;本仓不拥有外部 registry / descriptor / exposure truth。 |
| `C-L2T-3` | 正式工具契约能够形成统一且可消费的规范调用语义。 | 调用方消费稳定工具合同,但行动选择、规划、编排和恢复不归本仓。 |
| `C-L2T-4` | 规范调用的执行前置约束与条件化隔离交接能够成立。 | 本仓承接正式外部裁决和执行要求,不自我授权,不拥有隔离执行 truth,不可满足时保守收束。 |
| `C-L2T-5` | 规范调用的结果、错误、工具域审计与安全交接能够成立。 | 本地工具语义 truth 与外部观察 / 传递 handoff 分层,无执行终态也必须可解释。 |

### 8.4 能力层级划分

| 分类 | 内容 |
|---|---|
| 核心能力闭环 | 稳定工具身份与完整定义;外部能力事实的受控关联边界;统一且可消费的规范调用语义;执行前置约束与条件化隔离交接;结果、错误、工具域审计与安全交接。 |
| 外围增强能力 | 工具契约搜索 / 浏览 / diff;批量维护与兼容性提示;派生索引和一致性检查;管理 UI;开发辅助说明;更友好的只读诊断、审计摘要和客户端消费说明。 |
| 边界外能力 | Runtime agent loop / planning / orchestration / recovery;Capability Hub / external provider registry truth;effective governance / authorization truth;Sandbox isolation execution truth;Bus delivery truth;Observability store truth;SDK client;具体 builtin / MCP Client / extras / images / marketplace / provider control。 |

---

## 9. 待确认事项

### 9.1 Blocker / pending 判定

| ID | 当前状态 | 对 Step 7 的判定 | 后续约束 |
|---|---|---|---|
| `L2T-UP-001/002` | Sandbox policy owner/source matrix 与 high-risk taxonomy 未闭口。 | 不阻塞能力级声明“承接外部裁决、未知时 fail closed”。 | Step 10 / 12 / 15 和后续 `01~05/07` 不得私造 owner、来源矩阵或分类。 |
| `L2T-UP-003` | ToolInvocation 到 generic Sandbox chain、capture / failure 到工具结果的 adapter mapping 未闭口。 | 不阻塞确认 C-L2T-4 / 5 必须存在。 | Step 12 / 15 及后续 `02/03` 只能固定 L2 adapter responsibility,不能伪称 mapping 已可执行。 |
| `L2T-UP-004` | Sandbox receipt、dead-letter、investigation feedback、cleanup release 未闭口。 | 不阻塞能力骨架。 | Step 12 / 15 及后续 `02~07` 保持 blocked handoff,不得私造协议。 |
| `L2T-UP-005` | Observability 无 Tools-specific producer / source family 或正向 route。 | 不阻塞本地 C-L2T-5 truth 成立。 | 外部安全交接只能写需求和 fail-safe 边界,不得私造 enum、schema、event 或 route。 |
| `L2T-UP-006/007` | Observability 正式链状态冲突且 workspace 上游输入未提交。 | 不阻塞 Step 7;不能声称 immutable upstream baseline。 | 后续 readiness / evidence 继续显式 pending。 |
| `L2T-UP-008` | Core 当前无 tools-specific shared schema。 | 不阻塞需求能力节点,但阻塞跨仓字段 / contract 定稿。 | Step 11 / 12 / 15 与后续 `01~03/07` 只引用 shared 类别候选。 |
| `L2T-UP-009` | SDK 无 tools-specific client seam 闭口。 | 不阻塞服务端工具合同自身成立。 | 当前不进入核心主链;未来下游消费保持 pending。 |

结论: 未发现新增且阻塞 Step 7 的上游 blocker。上述缺口不得因本步通过而改写为 resolved。

---

## 10. 进入下一步条件

### 10.1 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 已说明仓存在必要性 | pass | 已说明缺仓会导致工具 identity / definition / invocation / outcome 多 truth。 |
| 已定义一条核心能力闭环 | pass | 五个节点共同构成工具调用语义合同。 |
| 节点数符合 3~5 建议 | pass | 当前为 5。 |
| 图中只写能力成立状态 | pass | 无仓名、角色、接口、事件、对象字段或实现组件。 |
| 已说明箭头语义 | pass | 明确不是 runtime path 或实施顺序。 |
| 已区分核心、外围和边界外 | pass | 固定三类能力表齐全。 |
| 已给出节点顺序、逻辑前置、进入 / 退出条件 | pass | 条件路径和缺失后果已显式。 |
| 已预定义逐节点停审清单 | pass | 后续状态均为 `not_started`,未伪报完成。 |
| 已给出功能回填映射 | pass | historical material 只被映射或裁剪。 |
| 是否把 Hub / Sandbox 场景依赖或 governance / authorization pending seam 全局化 | no | 纯本地、capability-bound、governed、sandbox-required 场景已区分;SDK future / excluded 边界也未升格为当前依赖。 |
| 是否把 Tool-domain audit 与 Bus / Observability truth 合并 | no | 本地 truth 与外部 handoff 明确分层。 |
| 是否伪称上游协议已闭口 | no | `L2T-UP-001~009` 保持原状态。 |
| 是否写故事、功能、字段、接口、事件 schema、实现或验收结果 | no | 只预定义后续承接合同。 |
| 是否修改正式 `00-需求文档.md` | no | 正式写入仍 blocked until Step 17。 |

### 10.2 模块状态

| 模块 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status |
|---|---|---|---|---|---|---|---|
| necessity | done | done | done | done | done | pass | `pass` |
| capability_nodes | done | done | done | done | done | pass | `pass` |
| conditions_and_stop_review | done | done | done | done | done | pass | `pass` |
| capability_tiers_and_mapping | done | done | done | done | done | pass | `pass` |

### 10.3 停审结论

```text
step_status = completed_stop_review
gate_status = pass
formal_section_write_allowed = false
next_allowed_action = wait_user_review_to_step_08
step_08_write_allowed = false_until_user_confirmation
next_formal_document_allowed = false
commit_required = false
```
