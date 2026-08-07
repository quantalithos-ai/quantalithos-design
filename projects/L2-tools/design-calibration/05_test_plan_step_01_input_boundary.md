# L2-tools 05 测试方案 · Step 1 输入边界

> 对应 SOP：`测试方案讨论流程_SOP.md` Step 1「确认测试输入边界」
>
> 目标回填：`projects/L2-tools/05-测试方案.md` §1
>
> 当前状态：`accepted_for_step_01 / proceed_to_step_02`

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | 1 / 确认测试输入边界 |
| 状态 | `accepted_for_step_01` |
| 当前模块 | `input_boundary:upstream_and_historical_audit` |
| 正式文档写入 | 未允许；正式05保持锁定，Step 15 才装配 |
| 本步结论 | 当前正式00~04足以定义测试对象、风险和计划证据面；外部 positive seam 不足以定义 provider success/readiness，必须以 blocker-aware 方式测试 |
| 下一步 | Step 2：明确测试目标、范围和非范围 |

## 2. 本步输入

| 输入 | 来源 | 状态 | 说明 |
|---|---|---|---|
| 需求、规则、数据归属、NFR、验收方向 | `projects/L2-tools/00-需求文档.md` | `current formal` | 使用 `C-L2T-*`、`FR-L2T-*`、`BR-L2T-*`、`DR-L2T-*`、`NFR-L2T-*`、`AC-L2T-*`、`VF-L2T-*`；不重新发明编号。 |
| 架构边界和依赖裁剪 | `projects/L2-tools/01-架构设计.md` | `current formal` | 使用 owner、compile/runtime/event 类型、写权、接缝、禁止方向和开放 seam。 |
| 概要组成部分和流程轮廓 | `projects/L2-tools/02-概要设计.md` | `current formal` | 使用六个主要组成部分、对象轮廓、接口骨架、处理流和状态概念；细节以03为准。 |
| 详细实现契约 | `projects/L2-tools/03-详细设计.md` | `current formal / direct oracle` | 使用七模块、41对象、Store/UoW/Port、CF/QF/IF/OF/JF、六状态族、错误、事务、幂等、并发、配置、观测和§15最小切口。 |
| 配置测试输入 | `projects/L2-tools/04-配置设计.md` | `current formal / direct oracle` | 使用54 canonical item、profiles、来源/冲突、sensitive/ref-only、V0~V8/B0~B8、CFG测试族；只写计划，不写执行。 |
| 验收方向 | `00` §14 的 `AC/VF` | `current requirement direction` | 当前正式06旧文件不可信；05预留可被未来06消费的证据和追溯，不代替06裁决。 |
| 旧 README | `projects/L2-tools/README.md` | `historical_material` | 仅用于发现旧 Python/builtin/MCP/registry/host callback 等污染。 |
| 旧05/06 | `projects/L2-tools/05-测试方案.md`、`06-验收标准.md` | `historical_material` | 旧用例、阈值、报告路径、签署和结果叙事全部不继承；Step 15 前不追加。 |

## 3. SOP 问题回答

| SOP 问题 | 回答 | 依据 |
|---|---|---|
| 当前测试方案承接哪些需求、规则和非功能目标？ | 承接五个核心能力闭环、17项核心功能需求、核心业务规则/禁止行为/显式变化、四类数据归属、六类NFR、需求验收条件和veto方向；具体映射在Step 2/5完成。 | `00` §7、§9~§14 |
| 哪些概要/详细设计章节直接影响测试对象？ | `02` 的组成部分/对象/接口/流程/状态轮廓；`03` §4~§15 的模块契约、协议、flow、状态、持久化事务、错误恢复、并发幂等、配置、观测，尤其 §15 最小验证清单。 | `02` §4~§13；`03` §4~§15 |
| 哪些验收项需要测试方案提供证据？ | `AC-L2T-001~039` 与 `VF-L2T-*` 只作为未来06的消费方向；05为每个P0切口预留TC和planned EV，且不写真实结果、run、签署或readiness。 | `00` §14~§15；测试方案规范 §2.5、§4.5 |
| 哪些内容不应在05重新定义？ | 需求目标/编号、架构owner/依赖方向、03对象字段/状态/错误/流程、04配置key和词表、外部provider/registry/authorization/sandbox/bus/observability truth、验收通过条件和实施排期。 | 测试方案SOP §2.1、§2.9；规范 §2 |
| 当前上游是否有阻塞测试设计的缺口？ | 有9项开放上游边界：authorization owner/source/schema、sandbox mapping/receipt/cleanup/DLQ、Bus/Observability producer/route/status、workspace baseline、Core tools-specific schema、SDK client seam。它们阻塞正向 provider/readiness/真实联调断言，但不阻塞 local/negative/blocked-aware 测试设计。 | 项目台账 `L2T-UP-001~009`；`03` §1/§17；`04` §1/§14 |

## 4. 当前文档问题诊断

| 材料 | 诊断 | 影响 | 处理 |
|---|---|---|---|
| 旧正式05 | 只有旧对象/接口、泛化层级、旧TC、无稳定设计来源和静态报告路径；与当前L2-tools runtime行动契约边界冲突。 | 若沿用会把旧 ToolRegistry/MCP/host callback/固定阈值写成当前测试事实。 | 标记 `historical_material`；Step 15 删除旧正文后重建。 |
| 旧正式06 | 含未执行的通过项、签署占位和旧验收对象；不是当前验收权威。 | 可能让05伪造已验收或把旧证据名当成新证据。 | 只以 `00` AC/VF 作为方向；06保持 `blocked_by_05`。 |
| README | 旧定位/库存/运行形态叙事与当前正式00~04不一致。 | 会错误增加工具库存、MCP client、agent/runtime 测试范围。 | 仅差异审计，不进入TC/EV/套件。 |
| 当前正式03 | local/negative 契约完整，但9项外部 positive seam开放。 | 正向 provider case 不能写成 pass；必须有 blocked/unavailable/unknown oracle。 | 将 blocker 状态列为计划测试类别和退出阻断条件。 |
| 当前正式04 | 配置契约已闭合，但只定义测试族/计划输出，没有执行事实。 | 不能把 `CFG-T/A/F/X` 写成已执行/通过。 | 在Step 8/9/10/13承接为 planned suite/evidence。 |

## 5. 改动前后对比

| 项 | 改动前（旧05口径） | 改动后（当前05输入边界） | 理由 |
|---|---|---|---|
| 测试真相源 | 旧功能表和泛化主线 | 正式00~04，03 §15为最小切口直接来源 | 保证测试断言与设计契约1:1对齐 |
| 范围主轴 | 工具定义/调用/策略/结果的摘要 | 七模块 + 五类协议族 + 六状态族 + 事务/幂等/配置/观测切口 | 覆盖可落码边界，避免只测happy path |
| 外部依赖 | 旧 staging/real-like 叙事 | 依赖类型分离，按 blocked/unavailable/unknown 测接缝 | 不伪造provider或readiness |
| 证据 | 静态路径和未执行报告占位 | planned EV family + 固定 artifact/report 约定，运行时绑定run_id | 避免伪造evidence alias和结果 |
| 验收关系 | 旧05直接写结论 | 05提供可追溯证据契约，未来06裁决 | 保持05/06边界 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 直接沿用旧05并追加新用例 | 写作快 | 混入旧owner、状态、阈值、路径，无法追溯 | 禁止 |
| 只按unit/service/integration/E2E写摘要 | 结构简单 | 漏掉CF/QF/IF/OF/JF、状态、事务、配置和负向边界 | 禁止 |
| 以03 §15切口为主轴，按切口展开TC、数据、suite和EV | 能定位设计来源，支持负向和跨层闭环 | 文档较长，需要跨Step审计 | 采用 |
| 对开放外部依赖写real-like正向闭环 | 表面完整 | 把fake/ref/marker当authority，制造readiness假象 | 禁止；改为blocked-aware negative/seam |

## 7. 结构化中间产物

### 7.1 测试输入映射表

| 输入层 | 当前测试输入 | 测试方案落点 | 不在05回答 |
|---|---|---|---|
| 需求能力 | `C-L2T-1~5`、`FR-L2T-001~017`、`FR-L2T-E01~E06` | §2目标/范围、§5追溯、§6场景 | 不重新定义需求 |
| 规则边界 | `BR-L2T-*`、`VF-L2T-*`、`NC-L2T-001~025` | §3切口、§6负向、§10专项、§14风险 | 不新增规则或放宽红线 |
| 数据归属 | `DR-L2T-*` truth/snapshot/ref/forbidden body | §6断言、§7数据、§10 redaction、§13证据 | 不保存或展示正文 |
| 架构边界 | `HC/AG/DB/IB-L2T-*` 与依赖类型 | §3对象、§4分层、§8环境、§9门禁 | 不改变owner或依赖 |
| 详细契约 | 七模块、41对象、Stores/UoW/Ports、CF/QF/IF/OF/JF、六状态族 | §3~§6、§10、§14 | 不补缺失schema |
| 配置契约 | 10 roots、54 items、P0 profiles、CFG-T/A/F/X | §7~§10、§12~§13 | 不声明配置已部署/生效 |
| 验收方向 | `AC-L2T-*`、`VF-L2T-*` | §5/§13预留未来06消费 | 不签署或判定通过 |

### 7.2 设计问题与测试问题分界

| 问题类型 | 05可以回答 | 05必须回流/保持待确认 |
|---|---|---|
| 如何验证已有字段/状态/流程 | 测试层级、前置、输入、断言、数据和证据路径 | 若字段/状态/错误本身缺失，不由05猜测 |
| 外部 provider 是否成功 | blocked/unavailable/unknown/fail-closed 的期望行为 | 不写 provider accepted/run/receipt/delivered/observed/readiness |
| 性能/可用性 | 来源、测量方法和无数字阈值的结构性门禁 | 无measurement authority时不写P95/QPS/SLA/百分比 |
| 配置行为 | parse/validation/profile/source/redaction/no-output测试设计 | 不新增config key、环境变量或部署值 |
| 验收关系 | 预留TC/EV到AC/VF的双向映射 | 不把planned EV写成真实evidence或签署 |

### 7.3 当前必须回答的问题清单

1. 五个核心能力和17项核心FR分别由哪些测试切口、用例和证据覆盖。
2. `03` §15 的七模块、13 Commands、11 Queries、5 Consumers、4 continuations、4 Jobs 是否每项都有最小测试入口。
3. 六状态族的合法迁移、终态守卫、非法迁移、late material、CAS、幂等、replay 和 no-write 如何被断言。
4. `NC-L2T-001~025` 如何形成负向测试，尤其 identity/definition、authorization fail-closed、sandbox no-bypass、local truth first、safe material、query/job no-write 和 dependency boundary。
5. 04 的 `CFG-T-01~12`、`CFG-A-01~10`、`CFG-F-01~20`、`CFG-X-01~12` 如何映射到配置/环境/门禁套件，不写成执行结果。
6. 开放 `L2T-UP-*` 如何阻断正向 provider/readiness，但仍允许本地合同和负向行为测试。
7. planned TC/EV、suite、script、artifact/report 路径如何保持可逆追溯，并在未来真实run绑定前不伪造事实。

## 8. 回填草稿（正式05 §1）

> 校准来源：
> - `design-calibration/05_test_plan_step_01_input_boundary.md`
>
> 延伸阅读：
> - 建议继续阅读该中间产物的“结构化中间产物”“回填草稿”和“待确认事项”小节，了解测试输入边界如何从正式00~04及历史材料审计中收敛。

本测试方案承接当前正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md` 和 `04-配置设计.md`。`00` 提供需求、规则、数据归属、非功能与验收方向；`01` 提供 owner、依赖类型、交互和写权边界；`02` 提供组成部分、对象、接口、流程和状态轮廓；`03` 提供七模块、协议、函数级流程、六状态族、事务/一致性、错误/恢复、并发/幂等、配置/外部绑定、观测/审计以及 §15 最小验证清单；`04` 提供配置 schema、来源/冲突、profile、敏感边界、加载校验、生效和失败测试输入。

测试方案不重新定义需求、架构、对象字段、状态、错误、协议、配置项、外部 provider truth、验收结论或实施事实。旧 README、旧 `05-测试方案.md` 与旧 `06-验收标准.md` 仅作为 `historical_material` 做污染和冲突审计。`L2T-UP-001~009` 继续开放：测试设计可以验证 blocked、unavailable、unverifiable、unknown 和 fail-closed 行为，但不能把 fake、endpoint、health marker、ref、planned evidence 或本地 attempt 写成 authority、accepted、executed、delivered、observed、readiness 或 positive provider closure。

## 9. 待确认事项

| 事项 | 影响 | 处理 | 截止点 |
|---|---|---|---|
| `L2T-UP-001~009` 外部 owner/schema/mapping/route/client 尚未闭口 | 正向provider、真实跨仓联调、readiness和量化证据不可定稿 | 各后续Step保留blocked/unavailable/unknown/negative；不阻塞local契约测试 | Step 8~13、Step 15总审计 |
| `06-验收标准.md` 尚未按当前链重建 | EV不能被当前06正式消费 | 以00 AC/VF预留验收方向；不写06结论 | Step 13/15 |
| 实现仓不存在且无测试运行 authority | 不能固定脚本实际存在、run、结果或覆盖率 | 只写planned script/path/schema convention | Step 9/13/15 |
| measurement/evidence authority未定 | NFR不能量化 | 只写结构性方法和待量化触发器 | Step 10/14 |

## 10. Step 内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 输入文档清单完整 | 通过 | 当前正式00~04和标准已列全；旧材料单独降级。 |
| 详细设计直接输入明确 | 通过 | 03 §15及§4~§15契约被指定为oracle。 |
| 测试/验收边界明确 | 通过 | 05设计证据，06裁决；不把planned EV当结果。 |
| blocker处理明确 | 通过 | 9项上游缺口进入blocked-aware测试，不伪造positive closure。 |
| 正式文档写入门禁 | 通过 | Step 15前正式05锁定。 |

## 11. 进入下一步条件

- [x] 输入文档、权威级别和历史材料定位明确。
- [x] 测试方案不重新定义需求/设计/验收/实施边界。
- [x] 上游 blocker 及其测试处理方式已登记。
- [x] Step 2 可基于本产物定义测试目标、P0/P1/P2范围和非范围。
