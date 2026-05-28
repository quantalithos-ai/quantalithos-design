# Step 6. 定义数据边界与架构红线验收

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 6
- 回填章节：`projects/L0-core/06-验收标准.md` §6

## 2. 本步输入

| 输入 | 内容 | 使用方式 |
|---|---|---|
| `00-需求文档.md` §10 / §11 / §14 | BR-001~BR-014、真相 / 快照 / 引用 / 禁止正文四类数据归属、一票否决项 | 定义数据边界和红线来源 |
| `01-架构设计.md` §8 / §9 / §11 / §13 | 依赖方向、数据所有权、关键技术机制、横切关注点 | 定义下游不得反写真相和外部输入不得直达核心的架构红线 |
| `02-概要设计.md` §4 / §5 | 主要主体、入口、应用服务、技术承载与外部适配 | 确认概要层哪些主体只是边界或支撑,不是契约真相主体 |
| `03-详细设计.md` §2 / §9 / §10 / §14 | 实现约束、P1 迁移边界、存储对象、事务边界、日志审计字段边界 | 定义可被实现和测试检查的禁止事项 |
| `05-测试方案.md` §10 / §11 / §13 | 安全边界、职责边界、一致性、配置安全、一票否决专项、EV 证据 | 为红线验收项绑定证据 |
| Step 2 / Step 5 | 验收范围与功能门禁 | 控制本步只裁决红线,不重复定义功能验收 |

依赖的前序 Step：Step 1~5 已确认。

## 3. SOP 问题回答

1. 哪些数据不得由本仓保存?

   回答：L1 业务数据正文、事件实例 payload 正文、观测日志 / trace 正文、归档包正文、运行时执行记录正文、SDK 凭据 / token / credential secret、raw secret、外部标准正文、ADR 正文和外部系统返回全文都不得由本仓保存。L0-core 可以保存引用、fingerprint、摘要、追溯锚点、发布快照 metadata 和审计字段,但这些不能变成外部正文所有权。

2. 哪些下游不得反向改写真相?

   回答：L0-bus、L0-sdk、L1+、L2/L4 运行与基础设施仓、L5/L6 产品生态仓、工具链、生成器、下游反馈和外部标准来源都不得直接改写 L0-core 的契约真相。它们只能消费发布快照、读取契约视图、提交候选输入或通过正式接缝触发审查。

3. 哪些 projection / cache 不得反写真相?

   回答：release snapshot、package view、guide sample、read model、trace projection、compatibility summary、projection index、downstream consumption reference、outbox relay status 都不得反写 `contract_definitions`、`release_baselines` 或契约演进记录。projection rebuild 只能重建读面和推进 watermark;cache / snapshot 只能服务消费,不能成为新的 truth 来源。

4. 哪些 P1 能力不得污染 P0?

   回答：多语言 binding、样例仓、可视化、高级兼容报告、自动发布体验、真实 L0-bus runtime、真实 L0-sdk developer experience、真实下游仓业务联调、config center、hot reload、admin override、review reject to draft、snapshot supersede、package write protocol 都不得以 P0 command、P0 配置项、P0 数据模型字段或 P0 验收门禁的形式进入本轮。

5. 红线失败时是否一票否决?

   回答：禁止正文入仓、raw secret 泄露、相邻仓职责进入本仓、下游或投影反向改写真相、外部输入绕过正式接缝直达核心、P1 能力伪装成 P0 正式入口、失败伪成功、引用失败默认放行都应至少导致“不通过”。其中 raw secret、禁止正文入仓、相邻仓职责进入核心职责、truth 被反写和失败伪成功进入 Step 11 一票否决。

## 4. 当前文档问题诊断

| 位置 | 问题 | 影响 |
|---|---|---|
| `06-验收标准.md` §6 | 仍以旧“三红线”表达 shared primitive 可审计 / 可追溯 / 可裁剪 | 没有覆盖新版真相 / 快照 / 引用 / 禁止正文四类数据边界 |
| `06-验收标准.md` §6 | 没有列出不得保存的正文类型 | 禁止正文和 raw secret 红线无法裁决 |
| `06-验收标准.md` §6 / §7 | bus/sdk consume 仍是旧口径,未明确相邻仓职责不能进入本仓 | 可能把 L0-bus runtime、L0-sdk 高层封装或 L1 业务状态机误写为 L0-core 验收项 |
| `06-验收标准.md` 全文 | 没有 projection / snapshot / cache 不得反写真相的验收项 | 快照、报告摘要或读模型可能被误当成契约真相 |
| `06-验收标准.md` 全文 | 没有 P1 能力不得污染 P0 的红线 | 后续实现可能把增强项提前变成 P0 协议或配置负担 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 红线主轴 | 旧 primitive admission 的可审计 / 可追溯 / 可裁剪 | 数据归属、职责边界、依赖方向、投影反写、P1 污染 | 对齐新版 00~05 |
| 数据边界 | 未具体列出禁止数据 | 明确禁止业务正文、事件 payload、观测 trace、归档正文、运行记录、凭据和 raw secret | 支撑安全与数据所有权裁决 |
| 下游边界 | bus/sdk consume base | 下游只能消费快照 / 提交候选,不能反向拥有或覆盖 truth | 保护 L0-core 作为契约来源仓 |
| projection / cache | 未验收 | 明确 snapshot、read model、trace projection、summary、outbox status 不得反写 truth | 防止派生产物冒充真相 |
| P1 能力 | 未区分 | 明确增强能力不得进入 P0 command / config / schema /验收门禁 | 控制本轮实现范围 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 沿用旧三红线 | 简洁 | 无法覆盖当前数据所有权和职责边界 | 不采用 |
| B. 只在 Step 11 一票否决中处理红线 | 文档更短 | Step 6 会缺少可检查门禁,Step 11 缺少来源 | 不采用 |
| C. Step 6 先定义可检查红线,Step 11 再抽取一票否决 | 红线可追溯,裁决清晰 | 需要维护红线 ID 与一票否决映射 | 采用 |
| D. 把所有 P1 能力缺失都视为红线失败 | 更严格 | 会把增强项误变成 P0,阻塞 L0-core 独立验收 | 不采用 |

## 7. 结构化中间产物

### 7.1 数据边界与架构红线表

| 红线 ID | 红线 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|
| AC-RED-001 | 契约真相只能由 L0-core 正式承载维护 | `contract_definitions`、`release_baselines`、契约版本 / 兼容性状态和演进记录由本仓 command / job 正式流程维护 | 下游仓、工具链、快照、投影或外部输入直接覆盖 truth;同一契约出现冲突正式解释 | `TC-CMD-*`、`TC-CONC-001`、`TC-TXN-001`;EV-SVC-001、EV-INT-001、EV-CONC-001 |
| AC-RED-002 | 禁止正文不入仓 | 业务正文、事件 payload 正文、观测 trace 正文、归档包正文、运行记录正文和外部正文全文不进入 truth、snapshot、audit、outbox、projection 和 evidence | 任一禁止正文被持久化、进入报告或作为 sample / package view 返回 | `TC-SCOPE-002`、`TC-QUERY-008`;EV-SEC-001、EV-SCOPE-001 |
| AC-RED-003 | raw secret / token / credential 不入配置、日志、审计和报告 | 只允许 redacted ref、secret ref 或安全引用;失败证据也不得包含 raw secret | raw secret、token、credential secret 出现在配置、日志、审计、outbox、trace 或 evidence artifact | `TC-CONFIG-003`;EV-SEC-002、EV-CONFIG-001 |
| AC-RED-004 | 相邻仓职责不进入 L0-core | 本仓无认证授权、事件投递 runtime、SDK 高层封装、L1 业务状态机、观测存储、归档恢复、运行调度正式接口 / 对象 / 配置 | API surface、配置、对象或流程承载相邻仓职责 | `TC-SCOPE-001`、`TC-SCOPE-002`;EV-SCOPE-001 |
| AC-RED-005 | 下游消费不得反向拥有或覆盖 truth | L0-bus、L0-sdk、L1+ 只消费发布快照、稳定引用和可感知事实;反馈必须经正式接缝进入 | 下游直接写 `contract_definitions` / `release_baselines`;下游生成物被当作 truth 来源 | `TC-JOB-002`、`TC-QUERY-007`、`TC-E2E-001`;EV-WORKER-001、EV-E2E-001 |
| AC-RED-006 | projection / snapshot / cache 不得反写真相 | read model、trace projection、compatibility summary、release snapshot、package view、guide sample、outbox relay status 只读 truth 或更新自身状态 | projection rebuild 修改 truth;stale projection 被当作 current;summary / snapshot 被用来覆盖正式定义 | `TC-QUERY-002`、`TC-JOB-003`、`TC-OUTBOX-002`;EV-INT-001、EV-WORKER-001、EV-CONTRACT-002 |
| AC-RED-007 | 外部输入不得绕过正式接缝直达核心契约语义 | 标准、ADR、草案、下游反馈和评审结论先进入 boundary / command / review / gate 流程 | 外部输入、工具链结果或反馈直接写成 Published / Released truth | `TC-CMD-003`、`TC-CMD-004`、`TC-CMD-005`;EV-SVC-001、EV-AUDIT-001 |
| AC-RED-008 | P1 能力不得污染 P0 | 多语言 binding、样例仓、可视化、自动发布体验、真实 bus / sdk / 下游联调、config center、hot reload、admin override、package write protocol 不出现在 P0 command / config / schema / gate 中 | P1 能力成为 P0 必填配置、P0 DTO 字段、P0 command 或 P0 验收阻断项 | API surface scan、配置检查、`TC-CONFIG-*`;EV-SCOPE-001、EV-CONFIG-001 |
| AC-RED-009 | 引用失败不得默认放行或补造正文 | reference resolver fail closed;引用失效显式暴露为 stale / invalid / failed;不复制正文掩盖失效 | 引用不可解析仍发布成功;读取时临时补造正文;失败被伪装为已确认基线 | `TC-CONFIG-003`、`TC-JOB-004`;EV-CONFIG-001、EV-WORKER-001 |
| AC-RED-010 | 失败不得伪成功 | command / job / relay / projection 失败必须返回错误、保持 stale、挂起、保留旧快照或记录 failed | toolchain、audit、outbox、projection、publisher 失败后仍返回成功或发布新基线 | `TC-CMD-004`、`TC-TXN-001`、`TC-OUTBOX-002`、`TC-JOB-004`;EV-INT-001、EV-AUDIT-001、EV-CONTRACT-002、EV-WORKER-001 |

### 7.2 数据类别裁决表

| 数据类别 | 本仓口径 | 允许行为 | 禁止行为 |
|---|---|---|---|
| 真相数据 | 契约定义、范围、版本 / 兼容性状态、演进记录 | 由正式 command / job / gate 流程维护 | 下游、投影、快照、工具链直接改写 |
| 快照数据 | release snapshot、消费派生产物、检查结果摘要、兼容性报告摘要 | 作为消费或报告承载,可重建、可 stale | 冒充 truth 或覆盖 truth |
| 引用数据 | 标准引用、ADR / 评审引用、下游消费关系引用、外部 source ref | 保存 ref、fingerprint、摘要、trace anchor | 保存外部正文全文或引用失败默认放行 |
| 禁止保存正文 | 业务、事件实例、观测、归档、运行记录、凭据正文 | 不进入本仓;必要时只保留 redacted ref | 写入 truth、snapshot、audit、outbox、trace、report |

### 7.3 红线失败对最终结论的影响

| 情况 | 结论影响 |
|---|---|
| AC-RED-001~AC-RED-007 任一失败 | 不通过 |
| AC-RED-002 或 AC-RED-003 失败 | 一票否决 |
| AC-RED-004 或 AC-RED-005 失败 | 一票否决 |
| AC-RED-006 失败且已经改写真相 | 一票否决 |
| AC-RED-008 失败但未影响 P0 正式入口 | 有条件通过或风险接受 |
| AC-RED-008 失败且 P1 成为 P0 必填入口 / 配置 / schema | 不通过 |
| AC-RED-009 或 AC-RED-010 失败 | 一票否决 |

## 8. 回填草稿

```md
## 6. 数据边界与架构红线验收

> 校准来源：
> - `design-calibration/06_acceptance_step_06_data_arch_redlines.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“数据边界与架构红线表”“数据类别裁决表”和“红线失败对最终结论的影响”小节,了解本章如何从数据归属、架构边界和 05 的专项证据收敛。

| 红线 ID | 红线 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|
| AC-RED-001 | 契约真相只能由 L0-core 正式承载维护 | truth 由本仓 command / job 正式流程维护 | 下游、工具链、快照、投影或外部输入直接覆盖 truth | `TC-CMD-*`、`TC-CONC-001`、`TC-TXN-001`;EV-SVC-001、EV-INT-001 |
| AC-RED-002 | 禁止正文不入仓 | 禁止正文不进入 truth、snapshot、audit、outbox、projection 和 evidence | 任一禁止正文被持久化、进入报告或返回 | `TC-SCOPE-002`、`TC-QUERY-008`;EV-SEC-001、EV-SCOPE-001 |
| AC-RED-003 | raw secret / token / credential 不入配置、日志、审计和报告 | 只允许 redacted ref 或 secret ref | raw secret 出现在配置、日志、审计、outbox、trace 或 evidence | `TC-CONFIG-003`;EV-SEC-002、EV-CONFIG-001 |
| AC-RED-004 | 相邻仓职责不进入 L0-core | 本仓无认证授权、bus runtime、SDK 高层、L1 业务等正式接口 / 对象 / 配置 | API surface、配置、对象或流程承载相邻仓职责 | `TC-SCOPE-*`;EV-SCOPE-001 |
| AC-RED-005 | 下游消费不得反向拥有或覆盖 truth | 下游只消费发布快照、稳定引用和事实输出 | 下游直接写 truth 或生成物被当作 truth 来源 | `TC-JOB-002`、`TC-QUERY-007`、`TC-E2E-001`;EV-WORKER-001、EV-E2E-001 |
| AC-RED-006 | projection / snapshot / cache 不得反写真相 | 读面、快照、summary 和 relay status 只读 truth 或更新自身状态 | projection / snapshot / summary 覆盖正式定义 | `TC-QUERY-002`、`TC-JOB-003`、`TC-OUTBOX-002`;EV-INT-001、EV-WORKER-001 |
| AC-RED-007 | 外部输入不得绕过正式接缝直达核心契约语义 | 外部输入经 boundary / command / review / gate 流程进入 | 外部输入或工具链结果直接写成 Published / Released truth | `TC-CMD-003`~`TC-CMD-005`;EV-SVC-001、EV-AUDIT-001 |
| AC-RED-008 | P1 能力不得污染 P0 | P1 能力不出现在 P0 command / config / schema / gate 中 | P1 成为 P0 必填配置、DTO 字段、command 或验收阻断项 | API surface scan、`TC-CONFIG-*`;EV-SCOPE-001、EV-CONFIG-001 |
| AC-RED-009 | 引用失败不得默认放行或补造正文 | resolver fail closed,引用失效显式暴露 | 引用不可解析仍发布成功或补造正文 | `TC-CONFIG-003`、`TC-JOB-004`;EV-CONFIG-001、EV-WORKER-001 |
| AC-RED-010 | 失败不得伪成功 | 失败返回错误、保持 stale、挂起、保留旧快照或记录 failed | 失败后仍返回成功或发布新基线 | `TC-CMD-004`、`TC-TXN-001`、`TC-OUTBOX-002`、`TC-JOB-004`;EV-INT-001、EV-AUDIT-001、EV-WORKER-001 |
```

## 9. 待确认事项

- 是否接受 Step 6 先定义红线可检查门禁,Step 11 再抽取一票否决项。
- 是否接受 AC-RED-008 的区分口径：P1 未完成不直接失败,但 P1 污染 P0 正式入口 / 配置 / schema 则不通过。
- 是否接受 projection / snapshot / cache 不反写真相作为独立红线,而不是只放入一致性章节。

## 10. 进入下一步条件

- [x] 数据边界和架构红线都有验收项。
- [x] 每条红线都有通过条件、失败条件和证据来源。
- [x] 禁止正文、raw secret、相邻仓职责、下游反写、projection 反写和 P1 污染均已覆盖。
- [x] 可以进入 Step 7 定义接口、事件与跨仓同步验收。
