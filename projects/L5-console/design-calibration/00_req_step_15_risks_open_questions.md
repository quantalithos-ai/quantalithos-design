# Step 15 · 风险与待确认事项

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 15 · 风险与待确认事项 |
| 输出文件 | `design-calibration/00_req_step_15_risks_open_questions.md` |
| 当前模式 | `full-restart + single-agent-serial` |
| 已读取规范 | yes，需求 SOP Step 15、书写规范 §4.15 与通用规范 |
| 已读取前序输入 | yes，Step 1~14、专项 owner pending 与项目台账 |
| 模块骨架 | done：风险清单 / 待确认事项表 / 影响范围 / 当前处理口径 / 当前状态 / 门禁 |
| 进入条件 | `pass`，Step 14 已完成 |

## 2. Step 内计划

| 计划项 | 状态 | 产物 / 门禁 |
|---|---|---|
| 汇总前文已显式暴露的具体风险 | done | 见 §7.1 |
| 区分结构风险、合同风险、数据/安全风险和量化风险 | done | 见 §7.1 |
| 将待确认事项与风险分表 | done | 见 §7.2 |
| 为每项写当前处理口径/当前挂起状态 | done | 见 §7.1~§7.2 |
| 判断哪些阻塞后续精确设计、哪些不阻塞需求闭环 | done | 见 §7.3 |
| 审计是否脑补 ready、实现方案或新需求 | done | 见 §7.4 |
| 形成正式回填草稿、自检和三层门禁 | done | 见 §9、§11~§12 |

## 3. 本步输入

| 输入 | 本步使用方式 |
|---|---|
| Step 1~6 | 承接来源、定位、问题、目标、角色和依赖裁剪中的 pending；不重新打开已通过结论。 |
| Step 7~14 | 承接六节点、故事、功能、规则、数据、接口、NFR 和验收中的开放项；只做风险归纳，不新增需求。 |
| owner 台账 | 只承接正式停审边界；实现/activation/测试状态不被推导为 Console ready。 |
| historical material | 旧 Provider Contract、固定控制/指标、阈值、技术栈和 SLA 只作为污染风险记录。 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 当前还有哪些尚未关闭的风险？ | 主要是各 owner exact query/command/result/ref 与 safe-field 合同、正式 scope/visibility 语义、unknown reconciliation、跨域状态解释、诊断和性能/兼容 authority 不完整；它们不会改变 Console 的产品边界，但会限制正向页面和精确实现。 |
| 这些风险影响哪一层需求结构？ | 合同风险影响接口、数据、NFR、验收和 C5 正向面；scope/visibility 风险影响 C1/C2；safe-field/forbidden-body 风险影响数据与安全一票否决；量化风险影响 NFR 数值和后续验收，不影响行为级底线。 |
| 当前还有哪些待确认事项？ | §7.2 汇总 scope owner、可见性 reason、owner surface、safe-field、草稿生命周期、reconciliation、Workspace、Method/Capability/Observability/Archive/Sandbox 合同、性能/SLO、a11y/诊断和未来跨产品链接等事项。 |
| 哪些待确认项会影响前文结论是否成立？ | 若 scope/visibility 无法提供安全语境，C1/C2 的正向能力不能成立；若 owner-safe 数据或正式结果合同缺失，相应 C3~C5 区域只能保持 blocked/read-only；这些情况不会推翻 Console 作为客户端产品边界。 |
| 哪些风险当前可接受，哪些会阻塞后续推进？ | 当前可接受的是外围能力、可选事件提示、数值目标和未停审产品链接；会阻塞后续精确架构/接口/测试的，是 exact owner surface、scope/visibility、safe-field/redaction、reconciliation、兼容矩阵和诊断 envelope。需求层 Step 16 仍可在 pending 显式保留的前提下推进。 |

## 5. 当前材料与旧文档问题诊断

| 材料 | 风险表现 | 当前处理 |
|---|---|---|
| 旧 `00/01/02/03/05/06` | 把固定数字、SLA、Provider Contract、技术框架和页面绿色状态写成正式事实 | 统一标为 `historical_material`；不回填正式正文，只在污染审计和本表记录。 |
| 上游正式文档与台账 | 设计停审、实现完成、activation 和可消费合同可能处于不同状态 | 只承接已确认边界；未闭口项按 owner 局部 blocked/read-only 处理。 |
| C5 多 owner 主题 | 不同 owner 的 freshness、coverage、visibility 和结果语义可能不兼容 | 保持分 owner 展示、来源回链和局部降级，不合成跨域结论。 |
| 客户端状态候选 | 草稿、缓存、布局、请求反馈可能被误当业务 truth | 以 Step 10/11 的规则和数据归属共同约束，保留为 Console 交互真相 בלבד。 |
| 事件/诊断候选 | 直接消费内部总线或记录原始载荷会形成 projection/证据旁路 | 只允许 SDK 正式状态提示与安全裁剪诊断；无合同则不启用。 |

## 6. 改动前后对比与设计取舍

| 主题 | 旧口径 | 当前口径 |
|---|---|---|
| 未闭合合同 | 用 mock、旧 proto 或页面占位填成 ready | 显式 `pending/blocked/read-only`，不伪造集成事实 |
| 风险记录 | TODO、空泛“未来优化”或技术方案 | 具体对象、影响章节和当前约束；不在此步解决 |
| owner 失败 | 统一 skeleton 或清空页面 | 身份/语境全局 fail-closed，单 owner 局部降级，未知保持 unknown |
| 量化目标 | 继承旧 P95、首屏、SLA、38/8 | 无 authority 不设目标值；行为底线先行 |
| 未停审项目 | 复制相邻 L5/L6 的页面/API 结论 | 只记为 pending 协作候选，不进入本仓真相或主链 |

## 7. 结构化中间产物

### 7.1 风险清单

| 风险 | 影响范围 | 当前处理口径 |
|---|---|---|
| `RISK-CON-001` 各 owner 面向 Console 的 exact query/command/result/ref 尚未全部闭口，正向页面可能无法按同一语义落地。 | Step 6、9、11、12、14；C3~C5 正向能力 | 当前只保留能力级接口和安全上限；相应主题按 owner 独立 `pending/blocked/read-only` 处理，不以旧协议或 mock 补齐。 |
| `RISK-CON-002` tenant/organization/project 等正式 scope 的 owner、层级和切换语义未完全确认，可能造成语境错配。 | Step 2、5、7、10、11、12、14；C1/C2 | 当前把 scope 视为外部正式语境引用；不可验证时 fail-closed，不在 Console 建模层级或推导范围。 |
| `RISK-CON-003` visibility、动作资格和受限原因的披露粒度未闭口，存在对象存在性泄露或误放行风险。 | Step 5、9、10、12、13、14；C2/C4/C5 | 当前采用最小披露、unknown 和客户端只能收紧的上限；不展示未获正式允许的原因或敏感正文。 |
| `RISK-CON-004` owner-safe 字段、redaction、freshness、coverage、availability 和 consistency 合同不一致，可能使 view model 丢失来源语义或保存 forbidden body。 | Step 11~14；C3/C5/C6；一票否决 | 当前只允许最小安全摘要/引用，原始/隐藏正文禁止进入数据、日志、诊断和导出；精确 safe-field 保持 pending。 |
| `RISK-CON-005` unknown 命令结果缺少正式 reconciliation 能力时，重复提交或错误完成提示的风险升高。 | Step 9、10、12~14；C4/C6 | 当前 unknown 不自动重放、不声明成功；无正式回查能力时保持 unknown/blocked。 |
| `RISK-CON-006` C5 各 owner 的状态时效、覆盖和一致性不同，跨域联合页面可能被误读为统一当前或强一致。 | Step 7、9~14；C3/C5/C6 | 当前按 owner 分域呈现 source/freshness/coverage/availability/consistency，局部故障独立降级，不合成单一健康/合规/readiness。 |
| `RISK-CON-007` Workspace safe read/export、Method Library 消费、Capability Hub access-review、Observability report/metric、Archive/Sandbox activation 等接缝成熟度不一，可能阻塞部分正向入口。 | Step 6、9、12、14；C5 与外围增强 | 当前把它们保留为条件化消费面；未闭口时只读、partial 或 blocked，不影响 Console 壳和已确认的横向闭环。 |
| `RISK-CON-008` 客户端草稿、布局偏好、筛选和请求呈现的生命周期/跨设备范围未定，可能引发丢失、误恢复或与 owner truth 混淆。 | Step 9、11、13、14；C3/C4/C6 | 当前只确认它们是 Console 交互真相，不是业务对象；生命周期细节挂起，提交前后和退出姿态保持显式。 |
| `RISK-CON-009` SDK 是否提供状态/失效通知未定，若直接依赖事件会形成本地 cursor/projection truth，若完全忽略又可能延迟失效反馈。 | Step 6、12、13、14；C3/C6 | 当前事件不是核心前置；无正式封装时采用显式重新查询/回查，禁止直接订阅内部总线或维护业务投影。 |
| `RISK-CON-010` 客户端诊断与 Observability 的安全 envelope、关联粒度和保留边界未定，可能泄露正文或被误当正式审计。 | Step 10~14；C5/C6；forbidden body | 当前只允许最小、无 forbidden body 的交互诊断；sink 失败不改变业务结果，正式 audit/evidence 仍归 owner。 |
| `RISK-CON-011` 性能、可用率、负载和兼容矩阵没有正式 authority，旧数字被重新写入会造成不可验证或错误承诺。 | Step 3、4、13、14；全仓 NFR | 当前使用有界、可归因、局部隔离和等价可访问行为口径；旧 P95/首屏/SLA/99.9%/99.95% 不作为目标。 |
| `RISK-CON-012` 其他尚未停审的 L5/L6 产品可能改变导航、deep-link 或交互边界，造成跨项目语义漂移。 | Step 1、2、6、8、12、15；外围链接 | 当前只保留 pending 协作候选，不把相邻项目内容写入本仓真相；产品边界以本仓已停审结论为准。 |
| `RISK-CON-013` 旧 Provider Contract、固定控制项/指标和页面“绿色”语义可能在后续设计或审计中被重新带回。 | 全部正式章节；一票否决 | 当前已在规则、数据、NFR、验收和本表标明为历史污染；任何重新写成 ready/结论的行为按越界风险处理。 |
| `RISK-CON-014` 部分 owner 的资格、状态或引用撤销若不能及时传播，旧快照可能继续可见或可操作。 | Step 10~14；C1/C2/C3/C4/C6 | 当前撤销/过期/冲突统一触发保守收紧；没有重新验证的旧快照不得放宽敏感内容或动作。 |

风险当前状态结论：上述风险均已在前文通过边界、条件化能力、fail-closed、forbidden-body 和 pending 口径暂存；其中 `RISK-CON-001~005, 007~011, 014` 会阻塞后续精确架构/接口/测试设计，但不阻塞本需求文档的行为级闭合；`RISK-CON-012~013` 属于持续污染/协作风险，当前以边界审计控制。

### 7.2 待确认事项

| 待确认事项 | 影响章节 | 当前状态 |
|---|---|---|
| `CON-Q-034` 各 owner 面向 Console 的 exact query/command/result/ref 和正式 activation 清单。 | 6、9、11、12、14、16；C3~C5 | 当前保持待确认状态，不强行定论；未闭口主题维持 `pending/blocked/read-only`。 |
| `CON-Q-035` tenant/organization/project 等 scope 的正式 owner、层级、切换和跨页面绑定语义。 | 2、5、7、10、11、12、14、16；C1/C2 | 当前暂按外部 actor/scope 语境引用处理，不纳入 Console 自有模型。 |
| `CON-Q-036` visibility、动作资格和受限 reason 的安全披露粒度及撤销传播口径。 | 5、9、10、12、13、14、16；C2/C4/C5 | 当前暂按最小披露、unknown、fail-closed 和客户端只可收紧挂起。 |
| `CON-Q-037` 各 owner safe-field、redaction、freshness、coverage、availability、consistency 的共同/分域合同。 | 9、11、12、13、14、16；C3/C5/C6 | 当前暂按最小安全摘要与引用挂起；不允许 raw/hidden body。 |
| `CON-Q-038` owner 对 unknown 命令结果提供的 reconciliation、幂等和重复风险语义。 | 9、10、12、13、14、16；C4/C6 | 当前暂不纳入正向自动恢复主链；无正式能力时持续 unknown/blocked。 |
| `CON-Q-039` `L1-workspace` safe read/export 是否成为项目/Workspace 主题的可选来源及其范围。 | 6、9、11、12、14、16；C5 | 当前暂按条件化、非唯一来源处理；合同未闭口不影响分 owner 只读边界。 |
| `CON-Q-040` Method Library 的方法资产消费与提交/发布请求合同。 | 8、9、11、12、14、16；C5 | 当前暂按浏览 + 本地草稿 + 条件化入口处理；正向动作不声称 ready。 |
| `CON-Q-041` Capability Hub access-review/暴露状态的可见语义及管理入口。 | 8、9、11、12、14、16；C5 | 当前暂按 owner 状态/引用消费处理；不得由 Console 创建注册或推导 capability readiness。 |
| `CON-Q-042` Observability 审计、指标、验证、报告和客户端诊断的安全接缝。 | 8、9、11、12、13、14、16；C5/C6 | 当前暂按只读 owner 结果 + 最小诊断分类处理；不生成 audit/evidence/report truth。 |
| `CON-Q-043` Archive/Sandbox 的 activation、正向命令和多轴状态消费范围。 | 8、9、11、12、14、16；C5 | 当前暂按分 owner 只读/blocked/partial 处理；不执行归档/恢复/隔离或推导 readiness。 |
| `CON-Q-044` 客户端草稿、布局偏好、筛选和请求呈现的保留、清理、跨设备和跨会话范围。 | 9、11、13、14、16；C3/C4/C6 | 当前暂按 Console 交互真相挂起；不让生命周期细节改变业务 owner truth。 |
| `CON-Q-045` 客户端本地交互、owner 请求、回查和故障隔离的性能/可用率/负载 authority。 | 3、4、13、14、16；全仓 NFR | 当前暂不纳入数值主链；只采用有界、可归因和局部降级判断。 |
| `CON-Q-046` 受支持浏览器、辅助技术组合、适用核心路径和诊断 envelope。 | 5、13、14、16；C6/全仓 | 当前暂按所有适用核心目标等价完成挂起；具体兼容矩阵后移，不填旧阈值。 |
| `CON-Q-047` 其他未停审 L5/L6 的正式导航、deep-link、诊断或引用合同。 | 1、2、6、8、12、15、16；外围 | 当前暂不纳入主链，仅保留未来正式合同候选。 |

### 7.3 风险处理与后续推进边界

| 状态层级 | 当前允许推进 | 当前禁止推进 |
|---|---|---|
| 需求层 `00` | 在 pending 显式保留的前提下完成 Step 16 追溯和 Step 17 正式装配。 | 把任一 pending 写成 integrated/ready，或在本步新增未讨论需求。 |
| 架构/概要/详细设计 | 仅在用户另行授权且读取当前正式 `00` 后，按 owner 合同逐项设计。 | 预先锁定 API path、DTO、数据库、组件、状态机、技术栈或跨域聚合。 |
| 配置/测试/验收 | 仅在获得正式 authority 后定义数值目标、兼容矩阵和证据边界。 | 伪造 baseline、run_id、测试结果、artifact、report、evidence、verdict、signoff 或 readiness。 |
| 外围增强 | 可作为 conditional/pending 保留，不影响核心闭环。 | 以外围缺口改写核心能力，或让个性化/趋势/批量改变权限和 truth。 |

### 7.4 跨前文风险审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 风险与待确认事项是否分为两张表 | pass | §7.1 为具体风险与当前处理，§7.2 为结构性待确认与当前挂起。 |
| 风险是否有具体对象、影响范围和当前口径 | pass | 无“复杂度高”“未来可能变化”等空泛风险。 |
| 待确认状态是否说明如何挂起 | pass | 每项均说明 pending、外围、边界背景或 blocked/read-only 口径。 |
| 是否把 TODO、方案或实现步骤写成风险 | pass | 未加入工作项、技术选型、函数/路径或实施方案。 |
| 是否覆盖前文所有主要 pending | pass | exact surface、scope、visibility、safe-field、reconciliation、Workspace、Method、Capability、Observability、Archive/Sandbox、量化、a11y、诊断和 L5/L6 均有记录。 |
| 是否把可接受 pending 误判为需求 blocker | pass | 需求层可继续追溯；仅精确设计/正向集成层保持 blocked。 |
| 是否伪造 ready 或执行事实 | pass | 未出现 baseline、commit、run_id、测试结果、artifact、report、evidence、verdict、signoff 或 readiness。 |

## 8. 复杂度判断

14 条风险和 14 条待确认事项覆盖需求层已发现的不确定性，数量来自前文结构而非新增范围。精确 owner contract 与量化 authority 会使后续设计复杂，但不影响当前行为级需求和追溯矩阵；单文件可审查，无需拆分附录。

## 9. 回填草稿

正式 §15 回填 §7.1 风险清单与 §7.2 待确认事项表的压缩版，并保留每项影响章节和当前处理/挂起口径。§7.3 的推进边界可作为正式章末的短说明；详细历史污染审计和风险分级留在 calibration。

## 10. 待确认事项（本 Step 自身）

| ID | 待确认事项 | 当前处理口径 | 当前状态 |
|---|---|---|---|
| `CON-Q-048` | 风险清单是否需要在后续文档按 owner 再拆分。 | 当前保持跨能力需求级聚合，避免在需求层复制 owner 结构。 | `open / non_blocking_for_step_16` |
| `CON-Q-049` | 风险 ID 是否需与未来项目风险系统共享编号。 | 当前使用本仓 `RISK-CON-*` / `CON-Q-*` 局部编号，不推导外部系统编号。 | `open / non_blocking` |

## 11. 自检

| 检查项 | 结果 |
|---|---|
| 是否明确拆分风险与待确认事项两张表 | pass |
| 每条风险是否有影响范围和当前处理口径 | pass |
| 每条待确认事项是否有影响章节和当前挂起状态 | pass |
| 是否避免 TODO、空话、实现方案和新需求 | pass |
| 是否区分需求层可继续推进与精确设计/正向集成 blocker | pass |
| 是否覆盖历史污染、上游 pending、数据/安全、量化、a11y 与诊断风险 | pass |
| 是否未伪造 ready、执行证据或 signoff | pass |
| 是否发现阻塞 Step 16 的 blocker | no；Step 16 只做已确认结构映射，pending 作为状态列保留 |

## 12. 三层门禁

| 层级 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| Step / 模块级 | `pass` | 风险与待确认事项已分表、具体化、分级并完成前文覆盖审计 | 更新 flow，激活 Step 16 | 本文件；Step 1~14；书写规范 §4.15 |
| 文档级 | `pass_to_step_16` | 未关闭项已显式挂起，不新增需求；可进行功能中心追溯矩阵 | 创建并完成 `00_req_step_16_traceability_matrix.md` | 本文件；Step 7~14 |
| 项目级 | `pass_with_open_contracts` | 精确 owner contract、scope、safe-field、reconciliation、量化和兼容矩阵仍 pending，但不阻塞需求级追溯 | 进入 Step 16；正式 00 仍不可写 | 项目台账；需求 flow |
