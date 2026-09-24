# 01 架构 Step 14 · 风险与待确认事项

> 状态：`completed`
> 前置：`01_arch_step_01_requirements_baseline.md`～`01_arch_step_13_evolution.md`、`00_req_step_15_risks_open_questions.md`
> 回填章节：正式 `01` §15 风险与待确认事项

## 1. Step 内计划与分类判断

- [x] 汇总前序步骤仍会影响主线成立的未关闭问题。
- [x] 将“已识别但未关闭”的风险与“尚未形成定论”的待确认事项分开。
- [x] 为每项风险写影响范围、当前处理口径和阻塞性。
- [x] 为每项待确认写缺失确认和保守挂起口径。
- [x] 排除 TODO、项目计划、局部实现问题和已定结论重复。

本步不尝试关闭 `RUN-UP-001~008`，也不把它们改写为实现任务。风险表记录已知会影响主线的合同/边界缺口；待确认表记录仍缺外部事实或裁决、因此不能升级为风险或结论的事项。

## 2. 风险表

| 风险项 | 影响范围 | 当前处理口径 | 是否阻塞 | 说明 |
|---|---|---|---|---|
| Artifact Release consumption 合同未闭合（`RUN-UP-001`） | 显式选择、取得、完整性晋级和启动前资格 | 只保留 locator/manifest/digest/signature/revoke/expire 的边界语义；未闭合前保持 blocked/pending，不锁协议或算法。 | 阻塞 | 已明确缺失且直接影响材料是否可交给 Sandbox，因此不是普通待办。 |
| Governance authority chain 未闭合（`RUN-UP-002`） | approved/baselined 判断、scope、expiry/revoke/conflict 和资格门禁 | Runner 不本地批准；不可验证时显示 blocked/restricted，禁止下载/启动主线放行。 | 阻塞 | 该缺口会使最核心的“能否运行”无法成立。 |
| Sandbox request/lease/cleanup/recovery 合同未闭合（`RUN-UP-003`） | 正式请求、accepted/boundary/running、停止、清理、orphan 和未知副作用 | 只定义 intent、owner status/ref、guard、lease 和 reconcile 语义；unknown 冻结危险副作用。 | 阻塞 | 缺口覆盖运行和清理主线，无法用本地进程或 ACK 代替。 |
| Runtime 端侧安全 read surface 未闭合（`RUN-UP-004`） | running、terminal、result、恢复和输出引用展示 | 仅消费未来公开安全 view/ref；没有 owner 结果时不确认 running/terminal success。 | 有条件阻塞 | 入口可继续做选择/准备结构，但运行展示主线受限。 |
| Observability diagnostic/handoff 合同未闭合（`RUN-UP-005`） | 失败诊断、safe summary、handoff、receipt、visibility/freshness/retention | 仅保留 redacted、bounded 摘要和交接姿态；不生成 evidence/report/verdict/signoff。 | 有条件阻塞 | 核心运行边界可保守表达，但正式诊断交接不能闭环。 |
| 跨平台资源与 cleanup 责任未统一（`RUN-UP-007`） | 端口/路径/容量/进程观察、allocation、lease 和清理保护 | 分离 local probe 与 owner allocation/lease；冲突或未知时 blocked/manual-review，不固定数字。 | 有条件阻塞 | 影响跨平台正向运行和清理安全，但不否定边界结构本身。 |
| SDK exact client/error/redaction/trace surface 未核验（`RUN-UP-008`） | 所有跨域访问、错误映射、来源与安全日志交接 | 坚持 SDK-first；exact 方法、版本和错误契约保持 pending，不以 fake ACK 宣称可用。 | 阻塞 | 没有正式访问面就无法证明跨域边界可落地。 |
| Archive 正向消费/恢复合同未闭合（`RUN-UP-006`） | 外围归档引用、恢复入口和历史视图 | Archive 不进入启动、运行或清理成功判定；仅保留条件性 ref seam。 | 不阻塞 | 核心运行入口可独立成立，但外围能力保持关闭。 |

## 3. 待确认事项表

| 待确认事项 | 影响范围 | 缺失确认 | 当前挂起口径 | 说明 |
|---|---|---|---|---|
| Runner-facing Release/authority consumption 的最终对象边界 | 选择与资格承接、Step 10 机制和后续概要对象 | 缺 Artifact/Governance 对 locator、manifest、digest、签名、baseline、撤销和适用性的一致合同 | 不把候选对象名或字段升级为正式接口；按 safe ref/summary 处理 | 需求已给出行为边界，但对象承接尚未有可核验定论。 |
| Sandbox 与 Runtime 的状态/控制/清理结果分层 | 生命周期展示、恢复保护和通信方式 | 缺 Runner 专用 status/result/control/reconcile 读取与提交语义 | 维持 accepted、running、terminal、cleanup 多轴和 owner attribution，不写具体协议 | 需要外部 owner 裁决，不能由 Runner 推断。 |
| 跨平台 host resource、allocation 与 cleanup 责任分配 | 资源冲突、清理保护、Step 13 承载演进 | 缺平台能力范围、分配权威和清理 guard 的统一解释 | 只展示 local observation 与 owner view 的冲突，默认保护材料 | 当前缺事实而非已知故障，故列为待确认。 |
| Observability/Archive 的安全消费和交接可见性 | 预览、诊断、handoff、外围归档视图 | 缺 source visibility、freshness、retention、receipt 与恢复引用的 Runner-facing 约束 | 只消费 bounded/redacted ref；不可见时 restricted/blocked | 未确认前不能写成正式 handoff 或离线恢复能力。 |
| L0-sdk exact versioning 与跨平台承载形态 | 依赖方向、实现载体可替换性和后续概要设计 | 缺支持的客户端版本、错误/redaction/trace surface 及平台兼容承诺 | 不锁语言、桌面框架、进程模型、包名或部署参数 | 这是实现承载前置确认，不是当前架构风险结论。 |
| 是否需要在核心闭环外提供批量预取、多运行比较和 Archive 浏览 | 演进路线与外围能力范围 | 缺明确用户需求、权限/容量约束和相应 owner 合同 | 保持外围，不纳入核心主线或验收成功条件 | 尚未形成“必须进入主线”的定论。 |

## 4. 当前处理口径说明

已识别的 owner 合同缺口会直接破坏 Runner 的资格、运行或清理主线，因此列为风险并明确阻塞性；仍缺最终对象、平台责任或外围需求裁决的事项则保留为待确认。两类问题都只能以保守边界暂存，不能用历史技术、缓存、模拟 ACK 或用户体验文案填补。后续章节只引用这些状态，不把它们润色成“已支持”或“已就绪”。

## 5. 回填草稿与门禁

正式 §15 回填风险表、待确认事项表和处理口径说明。风险不写解决方案，待确认不写任务计划；所有 `RUN-UP-001~008` 状态保持与项目台账一致。

`Step 14 gate_status = pass`；下一步允许进入 Step 15 ADR 与需求追溯。
