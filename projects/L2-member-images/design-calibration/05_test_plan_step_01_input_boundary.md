# L2-member-images 05 测试方案 Step 1：确认测试输入边界

> 状态：`completed`
> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 1
> 回填位置：正式 `05-测试方案.md` 第 1 章

## 0. Step 状态

| 项目 | 记录 |
|---|---|
| 本步目标 | 将 00~04 的可测试设计输入、pending 输入和明确 blocker 分层，防止把历史材料或兄弟草稿当成测试真相。 |
| 本步输入 | 重建版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`；03 Step 16~18；04 Step 12~15；测试方案 SOP/规范。 |
| 本步输出 | 测试输入准入矩阵、禁止推导表、设计影响判定和正式第 1 章回填草稿。 |
| gate_status | `pass_with_explicit_blockers` |
| 当前边界 | 只修改本项目 calibration；不执行测试，不读取测试平台结果，不创建实现或证据。 |

## 1. SOP 问题回答

| 问题 | 收敛回答 |
|---|---|
| 哪些文档是测试直接输入？ | 00 的需求/规则/NFR/VETO，01 的边界/依赖/风险，02 的 capability/flow/state 骨架，03 的对象/协议/状态/UoW/错误/并发/观测/测试切口，04 的配置和 fail-closed 语义。 |
| 哪些输入稳定？ | 七模块、五 capability、10 Command、10 Query、2 conditional inbound、6 Job、0 outbound、19 状态矩阵及 static/live 红线。 |
| 哪些输入只能 pending？ | Member、Member Service、Artifact handoff、Role/mapping、inbound event authority、扫描/签名 policy、实际 builder/registry/consumer schema。 |
| 当前哪些正向路径不可测？ | B01/B02 阻断 Command/Job accepted mutation/replay；PF 阻断 projection recovery；owner gap 阻断 external positive lane。 |
| 测试方案与 06 如何分工？ | 05 规定怎么测、留什么证据；06 才裁决通过/否决/风险接受。本步不写 verdict。 |

## 2. 当前材料问题诊断

| 发现 | 污染风险 | 处置 |
|---|---|---|
| 旧 05 将 persona/toolset/seed/publish 作为已闭合正向主线 | 把旧状态、旧接口和旧 evidence 继承到新版 | 仅在 Step 15 记录差异，不继承编号、结果或默认值。 |
| sibling 并行讨论未闭合 | 伪造 manifest/variant/ref/confirmation 前置 | 测试只设计 ref/gap/blocked/no-fake-fallback seam。 |
| 03 有 future flow 名称但写路径被 B01/B02 截断 | 将协议存在误写为已可运行 | Command/Job 用 zero-effect negative seam；future case 标明 reopen。 |
| local staged 状态较多 | `Available`/`Fresh` 被误解为 ready | 所有测试断言限定 subject 和 owner，不作全局汇总。 |

## 3. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 输入来源 | 旧 05 与 README 混合 | 00~04 正式文档和 03/04 calibration 为唯一当前输入 |
| 可执行性 | 默认假设 build/publish/consumer 可测 | 区分 current negative、planned pure contract、future reopen |
| 外部依赖 | 容易当作 compile/runtime 成功 | 逐项标记 `compile/runtime/event/ref/adapter/fake` 与 owner pending |
| 证据 | 旧路径和结果叙述 | 只规划固定 artifacts/reports 路径，结果留待未来执行 |

## 4. 测试设计取舍

- 采用“设计契约优先、实现结果后置”：没有代码或执行事实时仍可定义测试切口，但不填写通过。
- 采用“最小可测闭环”：验证 validation、状态 guard、no-write、redaction 和 fail-closed，不用 fake 伪造外部成功。
- 采用“边界按依赖类型分类”：ref/adapter/event 不自动升级成编译期依赖或可用服务。

## 5. 结构化中间产物

| 输入层 | 测试可使用内容 | 不得推导 |
|---|---|---|
| Stable | local domain objects、typed ref、正式状态/错误、协议名、配置 schema、模块边界 | 代码已存在、测试已通过 |
| Pending | owner ref、safe conclusion、gap、marker、future reopen 条件 | manifest、digest、consumer confirmation、Artifact acceptance |
| Blocked | B01/B02、B03、OPEN-01/02、PF、MI-UP、Q-MI | 正向 mutation、replay、recovery、readiness |

依赖输入表：`L3-method-library` 提供 Role/method ref；`L2-runtime`/`L2-tools` 提供受控 component/capability ref；`L1-artifact` 提供通用 Artifact 边界；Member/Member Service 仅供 pending supply seam；Sandbox、governance、observability 不在本仓 truth。

## 6. 回填草稿（正式 05 §1）

测试方案承接重建版 00~04 的需求、架构、概要、详细和配置设计。03 是接口、状态、事务、幂等、错误、观测与测试切口的直接真相源，04 是严格配置、profile、敏感信息、startup activation 与 fail-closed 的直接真相源。测试方案不重新定义需求、设计、owner、transport、外部 schema 或验收裁决；实际测试报告和 06 验收标准只消费未来固定证据。

## 7. 待确认事项

| 编号 | 事项 | 当前处置 |
|---|---|---|
| `DDD-S9-B01/B02` | canonical input、result replay identity 未闭合 | 保持 zero-effect；Step 6 仅设计负向与 reopen 模板 |
| `MI-UP-001~009`、`Q-MI-001~004` | owner/sibling/policy 未闭合 | 只保留 blocked/pending 断言，不写正向 readiness |
| 实际实现仓/CI | 未授权且未核验 | 不创建 run、报告、别名或测试结果 |

## 8. 进入下一步条件

- 输入来源、依赖类别和 blocker 已逐项登记；
- 测试方案不越过 00~04 边界，且可回指 03/04；
- Step 2 可以在上述稳定/pending/blocked 分层上定义 P0/P1/P2 范围。
