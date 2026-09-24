# 01 架构 Step 12 · 横切关注点

> 状态：`completed`
> 前置：`01_arch_step_02_goals_constraints.md`、`01_arch_step_08_data_ownership_consistency.md`、`01_arch_step_09_interactions_communication.md`、`01_arch_step_10_technology_selection.md`、`01_arch_step_11_alternatives_tradeoffs.md`
> 回填章节：正式 `01` §13 横切关注点

## 1. Step 内计划与适用性判断

- [x] 读取目标、数据、交互、机制和取舍结论。
- [x] 按 Runner 架构单元判断横切项是否长期作用于主线。
- [x] 只保留安全、审计追溯、可观测、韧性恢复、性能容量、配置变更六类正式约束。
- [x] 诊断旧文档的固定 SLA、日志库、告警阈值和安全手册污染。
- [x] 完成单元停审与跨横切审计，形成正式 §13 回填草稿。

Runner 的横切重点不是把通用 NFR 清单搬进架构，而是保护“显式选择→资格→受控请求→资源/清理→预览/诊断”主链在跨平台、断线、失败和敏感信息场景下仍不越界。固定性能数字、具体监控产品、值班手册、密钥轮换制度和脚本不属于当前章节。

## 2. 历史污染诊断

旧 `01` 的冷/热启动数字、并发和成功率、Tauri/Electron 资源假设、统一日志库、灰度监控指标和回滚剧本均缺当前 workload 或 owner authority。它们不能被润色成架构事实；本步改以“必须可解释、可观察、可恢复、可审计”的判断口径承接，量化留给后续有来源的设计与验收。

## 3. 横切关注点约束表

| 横切关注点 | 作用范围 | 约束要求 | 保护目标 | 说明 |
|---|---|---|---|---|
| 安全边界 | 入口输入、SDK/adapter 接缝、Release/Governance authority、Sandbox/Runtime、诊断与本地持久化 | 外部能力必须经正式边界；显式 immutable version、scope、generation 和验证姿态缺一不可；敏感正文和 secret 不进入普通本地状态；unknown/conflict 默认 fail-closed。 | 保护 owner truth、材料完整性、用户语境和端侧副作用不被越权或污染。 | 持续横切职责、依赖、数据、交互和承载，不是单接口安全规则。 |
| 审计与可追溯 | 选择、资格、取得/验证、请求、控制、清理、恢复、预览、诊断和 handoff | 关键判断、状态变化、来源、scope、generation、freshness、correlation 和限制必须可回指；本地记录必须标明其非正式审计性质。 | 保护边界争议、恢复判断和后续治理/观察交接的可解释性。 | 跨数据和交互主线，不能由普通 UI 日志替代。 |
| 可观测性 | 运行承载、跨域通信、owner 状态消费、资源冲突、失败降级和交接 | 每条主线都要能区分本地观察、owner status/ref、传播是否送达和当前 freshness；不可见或不完整必须显式暴露。 | 保护用户能理解“哪里成立、哪里未知、下一步是什么”，并防止错误升级成功。 | 约束架构可见性，不指定监控平台或告警配置。 |
| 韧性 / 恢复能力 | 下载/验证、断线/休眠/重启、未知控制、lease/cleanup、事件 gap 和本地重建 | 可恢复失败允许暂停、延后、对账或人工复核；unknown 时冻结危险副作用；重建不能推进 owner cursor 或自动重放。 | 保护副作用不重复、材料不误删、恢复不篡改 owner truth。 | 横切运行承载、数据一致性和通信方式。 |
| 性能 / 容量约束 | 入口资格、长时取得、状态刷新、预览/诊断、缓存和端侧资源观察 | 不得让同步入口被长时传输或全量正文拖垮；状态展示需有可解释进度；缓存和资源保护必须可释放但不得越过 active protection；量化预算必须有 workload 来源。 | 保护主链响应、端侧资源和安全门禁在规模/平台变化下仍可成立。 | 是结构性约束，不提前写数字或压测方案。 |
| 配置与变更控制 | 入口形态、transport、cache 保留、redaction、平台能力、恢复策略和外部接缝 | 配置只能调整承载/体验，不得启用 `latest`、绕过 authority/integrity/lease/cleanup、把 unknown 改 success 或改变 truth owner；不兼容配置 fail-fast/blocked。 | 保护已收稳架构边界不被运行时开关或升级路径偷偷打穿。 | 长期作用于实现承载与主线演进，不是配置清单。 |

## 4. 按架构单元的横切适用表与停审

| 架构单元 | 安全边界 | 审计/追溯 | 可观测性 | 韧性/恢复 | 性能/容量 | 配置/变更 | 停审 |
|---|---|---|---|---|---|---|---|
| 选择与资格承接 | 显式版本、authority、scope、visibility | selection generation、source ref、资格判断可回指 | authority freshness、不可见/冲突可见 | source stale 时 blocked，重新验证 | 不阻塞入口于长时取得 | 禁止 latest/default/宽松 allow | 通过：无本地批准、来源完整。 |
| 取得与材料资格承接 | locator/manifest/secret 最小暴露，quarantine | transfer/integrity/protection ref 可追溯 | 传输与验证分轴、进度和失败可见 | pause/resume、quarantine、保护淘汰 | 取得后台化，空间压力不绕过保护 | transport/cache/redaction 变更不改资格规则 | 通过：不修改 Release。 |
| 本地运行意图与生命周期 | 请求绑定 generation/actor，控制最小权限 | request/control correlation、owner status/ref | accepted/boundary/running/terminal 明确来源 | unknown 冻结 start/stop 重放 | 入口不承载长时执行正文 | 不以开关改变状态语义 | 通过：不拥有 execution truth。 |
| 资源、清理与恢复保护 | lease/capture/handoff/retention/orphan guard | probe、allocation、cleanup 意图/确认可回指 | conflict、freshness、保护状态可见 | reconcile/manual-review，禁止误删 | 观察与对账可延后，保护优先 | 不允许绕过 guard 或静默抢占 | 通过：owner cleanup 优先。 |
| 输出预览与失败诊断 | redaction/body bound、secret 不持久化 | source/coverage/correlation/handoff posture | partial/restricted/stale/blocked 可见 | source 不可用时安全降级 | 不拉取全量正文拖垮端侧 | redaction profile 变更需审计，不可关闭保护 | 通过：不生成 evidence/verdict。 |
| 端侧入口与展示 | 不直连私有 backend/存储 | 用户操作与安全状态来源可定位 | 汇总不压平多轴状态 | 断线/重连不自动触发副作用 | 视图只消费 bounded view | 壳/平台切换不改变核心门禁 | 通过：只经编排边界。 |

## 5. 横切影响说明

这些横切要求之所以进入架构层，是因为它们同时约束入口、承载、数据、通信和恢复，而不是单点实现偏好。安全和追溯保护 owner 边界与判断来源，可观测和韧性确保未知不会被 UI 或后台任务掩盖。性能、容量和配置只规定结构性不得越界，具体数字与产品由后续有来源的设计承接。

## 6. 主线映射小表

| 横切关注点 | 主要作用章节/主线 |
|---|---|
| 安全边界 | §4 职责、§8 依赖、§9 数据、§10 交互、§11 机制 |
| 审计与可追溯 | §9 数据、§10 交互、§15 风险、§16 追溯、§17 ADR |
| 可观测性 | §7 承载、§9 数据、§10 交互、§14 演进 |
| 韧性 / 恢复能力 | §7 承载、§9 一致性、§10 通信、§14 演进 |
| 性能 / 容量约束 | §2 目标、§7 承载、§10 通信、§14 演进 |
| 配置与变更控制 | §3 约束、§7 承载、§8 依赖、§11 机制、§14 演进 |

## 7. 跨横切约束审计

| 审计项 | 结果 |
|---|---|
| 模板化空话 | 无；每项均有作用范围、具体约束和保护目标。 |
| 适用性遗漏 | 无；六个架构单元均完成逐项停审，外围增强未冒充主线。 |
| 审计/追溯缺口 | 保留来源、generation、correlation、freshness 和 handoff posture；正式 Observability 合同仍受 `RUN-UP-005` 约束。 |
| 配置边界遗漏 | 明确禁止 latest、绕过 authority/integrity/lease/cleanup、unknown→success 和 truth owner 改写。 |
| 与数据/通信冲突 | 无；redaction、snapshot/ref、异步事实、后台对账与 Step 8/9 一致。 |
| 量化事实污染 | 无；旧 SLA、并发、冷/热启动和成功率不进入当前架构。 |

## 8. 回填草稿与门禁

正式 §13 回填横切约束表、单元适用表、影响说明、映射小表和审计结果。具体日志字段、告警阈值、密钥轮换、性能预算数字、配置文件与运维步骤后置。

`Step 12 gate_status = pass`；下一步允许进入 Step 13 演进路线。
