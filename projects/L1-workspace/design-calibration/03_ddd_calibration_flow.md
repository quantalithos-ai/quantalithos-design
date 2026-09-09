# L1-workspace 03 详细设计校准流程

> 日期：2026-09-07；模式：full-restart / single-agent-serial。
> 最新授权：继续完成03 Step11~19并装配正式03，参考L1-governance粒度；完成后停审。
> 当前恢复点：Step19 completed_stop_review；Step18补审完成；正式03已装配；等待用户确认04。

## 1. 输入与执行纪律

直接输入：[正式00](../00-需求文档.md)、[正式01](../01-架构设计.md)、[正式02](../02-概要设计.md)及其校准链；[项目台账](project_execution_ledger.md)为跨文档恢复入口。已完成00/01/02不重启；旧README/draft只作后置historical_material审计。

执行依据：`standards/document/详细设计讨论流程_SOP.md`、`详细设计书写规范.md`、`设计文档编写通则.md`、`设计文档讨论中间产物规范.md`、`设计真相源闭环与可落码性标准.md`、`全局项目依赖关系与裁剪规则.md`、`子项目目录与代码文件组织规范.md`；编码依据`standards/coding/rust.md`；提交依据`projects/README.md` §8.2。以上标准路径均相对设计仓根。

- 每Step先创建当步十段产物，按问题→诊断→取舍→结构化→历史审计→回填→自检串行推进；复杂部分先完成局部小循环，再跨部分审计。
- 三层台账逐Step同步；未到Step不创建其产物。表中后续步骤仅总流程计划。
- 仅修改本项目设计文件；不写实现、不执行项目测试、不提交，不跨项目回写。
- Step通过仅表示该步设计深度闭合，不表示用户逐项签署、正式03完成或实现就绪。
- 本项目00~07完成停审后才轮到L4-archive；不推进归档或产品窗口。

## 2. 总流程计划与状态台账

| Step | 讨论内容 / 产物 | 回填位置 | 状态 / 门禁 | 下一动作 |
|---|---|---|---|---|
| 1 | `03_ddd_step_01_upstream_boundary.md`：关系、依赖、缺口 | §1/17 | completed / pass | 允许Step2 |
| 2 | `03_ddd_step_02_scope.md`：范围/非范围 | §2 | completed / pass | 允许Step3 |
| 3 | `03_ddd_step_03_constraints.md`：编码/runtime/仓库约束 | §3/16 | completed / pass | 允许Step4 |
| 4 | `03_ddd_step_04_file_layout.md`：实现单元与文件布局 | §4 | completed / pass；前轮停点已被新授权覆盖 | 本轮Step5已完成 |
| 5 | `03_ddd_step_05_module_contracts.md` | §5 | completed / pass | 进入Step6 |
| 6 | `03_ddd_step_06_object_contracts.md` | §5/6 | completed / pass_with_external_slots | 进入Step7 |
| 7 | `03_ddd_step_07_trait_port_adapter_contracts.md` | §5/6 | completed / pass_with_external_slots | 进入Step8 |
| 8 | `03_ddd_step_08_protocol_contracts.md` | §7 | completed / pass_with_external_slots | 进入Step9 |
| 9 | `03_ddd_step_09_function_flows.md` | §8 | completed / pass_with_external_slots | 进入Step10 |
| 10 | `03_ddd_step_10_state_matrix.md` | §9 | completed / pass_with_external_slots | 历史停点已获完成03授权 |
| 11 | 持久化/事务/一致性 | §10 | completed / pass_with_external_slots | 已补审 |
| 12 | 错误/异常/恢复 | §11 | completed / pass_with_external_slots | 补审完成；允许Step13 |
| 13 | 并发/幂等/重入 | §12 | completed / pass_with_external_slots | 补审完成；允许Step14 |
| 14 | 配置/外部绑定 | §13 | completed / pass_with_external_slots | 补审完成；允许Step15 |
| 15 | 可观测性/审计 | §14 | completed / pass_with_external_slots | 补审完成；允许Step16 |
| 16 | 测试切口 | §15 | completed / pass_with_external_slots | 补审完成；允许Step17 |
| 17 | 实施承接 | §16 | completed / pass_with_external_slots | 补审完成；允许Step18 |
| 18 | 风险与待确认 | §17 | completed / pass_with_external_slots | 补审完成；允许Step19 |
| 19 | 正式装配 | §1~18 | completed / formal_stop_review | 正文与静态审计完成；等待用户确认04 |

文档级状态：`formal_stop_review`；`formal_fill_allowed=false`。正式03已装配并停审；等待用户确认04。

## 3. 专题阅读与依赖裁剪登记

继承00/01/02已登记的上游链，本轮复核当前正式02/03相关边界及现有台账/flow；不声称逐行重读14项目全部00~07，也不把grep命中或目录存在当作exact契约验证。

| 项目 / 输入 | 本轮用途 | 依赖裁剪 |
|---|---|---|
| L0-core 正式02/03、03 flow；本地Cargo manifests | 共享契约authority、实际crate位置 | compile候选；Actor/metadata最小子集已核验actual定义/export，workspace专用schema仍007 blocked |
| L0-bus 正式02/03、03 flow；已登记06 AC-FUNC-005/07 PH-06 | delivery、replay preparation边界 | event；不拥有executor/ack |
| L0-sdk 正式02/03、03 flow | 官方访问封装 | 下游runtime/adapter；不引入client/cache |
| L1-identity 正式02/03、03 flow | GlobalMember与Personal身份锚 | runtime/event/ref；非编译依赖 |
| L1-work 正式02/03、03 flow | Project/ProjectMember、scope关系 | runtime/event/ref；不复制成员truth |
| L1-conversation 正式02/03、03 flow | 对话/参与/只读消费与receipt边界 | runtime/event/ref；本地read intent非receipt |
| L1-process 正式02/03、03 flow | 过程实例/活动与工作truth分离 | runtime/event/ref；视图不推进过程 |
| L1-governance 正式02/03、03 flow及Step5~10相关章节 | 正式决定消费；详细设计粒度 | runtime/event/ref；不是统一授权中心 |
| L1-artifact 正式02/03、项目台账及03 Step4 | 正文/引用、静态设计组织粒度 | runtime/event/ref；不继承outbox/handoff |
| L2-runtime 正式02/03、项目台账 | execution/GoalPlanWorkspace名称不得混同 | 文档参考，排除运行依赖 |
| L2-tools 正式02/03、项目台账 | tools execution与能力注册排除 | 文档参考，排除运行依赖 |
| L2-member 正式02/03、项目台账 | 双锚与L2M-UP-008 | 文档参考，不建第三执行主语 |
| L2-member-service 正式02/03、项目台账 | registry/session与宿主边界 | 文档参考，不进入本仓truth |
| L2-member-images 正式02/03、项目台账 | MI-UP-006静态seed与live隔离 | 文档参考；seed owner待定 |
| L4-archive | 仅承接已确认下游边界 | 非当前输入authority，不推进其设计 |
| fake | 后续局部行为验证 | 无真实授权、投递、重放或集成证明效力 |

没有project ledger的早期项目使用现有03 flow辅助；其中旧Draft说明不升级为就绪结论。精确字段/查询/事件仍按WS-UP逐源回读正式章节核验。

## 4. 持续缺口和事实边界

WS-UP-001 safe query/version、002 event/cursor/baseline、003 visibility、004 attention、005 scope/ref、006 read/export、007 Core shared schema、008 personal execution及006-S seed全部开放。缺口不阻止本轮范围与布局设计；阻止相应正向接入和实现就绪。

待回流目标见[01风险清单](01_arch_step_14_risks_open_questions.md) §7.4；本轮未写owning项目flow/ledger，实际回写需另行授权。后续读者不得把“待回流”当成已回流。

## 5. 审计与停点

每步检查owner、no-write、权限裁剪、版本分轴、局部原子、恢复来源、历史污染和依赖类型；本轮额外核对实现仓不存在、Core路径与声明位置、源码注释规则冲突、Cargo测试发现路径。

2026-09-07本轮审计结果：

| 检查 | 结果 / 上限 |
|---|---|
| Step顺序与过程 | Step1→2→3→4串行；Step4按A/B/C/D小循环；所有当前Step为十段且有回填/自检 |
| 输入与范围 | 七CP、16对象、14入口保持02；没有Outbox、上游command或新truth owner |
| 实现形态 | planned Rust2024/MSRV1.93；异步边界Tokio；七role、77计划文件，未创建源码 |
| 规范冲突 | 中文设计/英文源码，package kebab-case/crate snake_case，专门目录规则优先 |
| 本地观察 | 目标仓未发现；Core manifests位置可读不等共享符号闭合；设计仓git identity匹配，不修改config |
| 历史污染 | README旧进度、draft九职责/候选事件、参考仓Outbox/根tests/path照搬均已剔除 |
| 静态文档审计 | 四Step十段、链接存在、围栏闭合、计划路径唯一、三层停点一致；无项目测试 |
| blocker | WS-UP-001~008/006-S无关闭；无新owner blocker；local driver/transport/pin待后续设计，非上游已就绪 |
| 改动范围 | 新增本flow与Step1~4、更新本项目ledger；正式00/01/02及其他项目未由本轮修改 |
| 停点 | Step4 completed；Step5不存在；正式03不存在；wait_user_before_step5 |

上表为前轮Step1~4停点历史。本轮用户已重新明确授权Step5~10；已从项目ledger、本flow、Step4、02和SOP恢复，将按模块/对象组、端口族、14入口和状态主语依次校准，不用旧停点替代当前进度。

历史Step10停审时已完成Step5~10，停在Step11前；未创建正式03或实现文件。implementation_write_allowed=false，test_execution_allowed=false，commit_required=false；不提交。

## 6. 本轮Step5~10完成停审

Step5~10已按顺序完成；细节与完整14文件变更清单见project_execution_ledger §4.7，交叉审计见Step10 §7.13。六主Step均十段，三对象附录按模块分组；14协议/14 flow、状态/方法/端口/字段可反查。新增本地读写carrier和回源修订不关闭WS-UP-001~008/006-S。Core实际字段子集已核验，不能推成整个上游就绪。

历史Step10停点：completed_stop_review / wait_user_before_step11；formal_fill_allowed=false。未写正式03、未创建Step11~19、未创建实现文件、未执行项目测试、未commit。下一轮获准后先读ledger §4.7列出的当前合同与SOP Step11/书写§5.10、governance Step11及受影响owner正式接缝。本轮到此停审。

## 7. 本轮恢复补审与当前装配

首批Step12~18曾合批写入，未逐步同步三层台账；Step19在正式文件不存在时被提前标完成。该过程不满足逐Step纪律，保留偏差记录，不声称首批严格串行。撤销过早完成结论后，已按Step12→13→14→15→16→17→18补足十段、映射、字段、配置、逐入口测试和跨文档审计，并逐步同步台账；Step11也已补审。当前Step19已完成实际装配并进入停审。

已修正Step12错误映射、Step13完整key、Step14typed配置、Step15安全观测、Step16十四入口测试、Step17字段名与实施承接、Step18独立风险/确认表。WS-UP九项全部开放，WS-LOCAL-001~003等待后续设计/验证；没有实现、测试执行或commit事实。

## 8. 正式03停审记录

2026-09-08：已创建 `03-详细设计.md`，按十八章主链装配；完成本地链接、章节、七模块、16对象、七service、14协议/flow/测试入口、状态/键/错误/事务/边界和 blocker 静态审计。未执行代码或项目测试，未生成实现/证据/commit，未进入04或L4-archive。下一步须等待用户明确授权，先读04讨论SOP与书写规范。
