# Step 13. 演进路线

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 13
> 回填章节: `01-架构设计.md` §14 演进路线
> 生成日期: 2026-07-07
> 状态: 已完成,等待用户审查

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 项目级台账是否允许进入 Step 13 | pass。用户已确认 Step 12 `横切关注点`,可进入 Step 13。 |
| 是否已读取当前 flow 与前序 Step | pass。已读取 `01_architecture_calibration_flow.md`、`01_arch_step_10_technology_choices.md`、`01_arch_step_11_alternatives_tradeoffs.md` 和 `01_arch_step_12_cross_cutting_concerns.md`,并抽查 Step 6~9 的运行承载、依赖、数据和交互主线。 |
| 是否已读取架构 SOP Step 13 与书写规范 §4.14 | pass。已读取当前阶段边界、后续演进阶段、可接受债务、不可接受债务、触发条件和禁写范围要求。 |
| 是否已读取当前正式需求基线 | pass。已读取新版正式 `projects/L4-sandbox/00-需求文档.md`,重点校验 §13 非功能、§14 验收、§15 风险与待确认事项。 |
| 是否已参考 L1 粒度 | pass。已参考 `projects/L1-artifact/design-calibration/01_arch_step_13_evolution_path.md` 和 `projects/L1-governance/design-calibration/01_arch_step_13_evolution_path.md` 的阶段边界、债务分类、触发条件和不作为演进项组织方式,不复制其结论。 |
| 是否已读取上游参考 | pass。已抽查 `L2-tools`、`L2-runtime`、`L2-member-service`、`L1-identity`、`L1-work` 中与 tools policy / result、ExecutionInstance / recover、MemberExecutionHost / SandboxBinding、identity / work refs 相关边界,用于防止演进路线串仓。 |
| 是否已读取旧材料 | pass。旧 README 和旧 `01-架构设计.md` §12 仅作为 historical material / 差异审计输入。 |
| 是否允许改正式 `01-架构设计.md` | no。正式 `01` 只能在 Step 16 装配时重建。 |
| 是否允许提前创建后续 Step 文件 | no。本步只创建 / 更新 `01_arch_step_13_evolution_path.md` 并同步 flow / 台账。 |

---

## 2. 本步目标

说明 `L4-sandbox` 当前架构主线做到哪里即算成立,哪些结构债务当前可接受且不会打穿边界,哪些能力后续才进入演进主线,以及哪些事实出现后必须触发下一阶段架构调整。

本步不写项目版本、实施排期、任务拆单、TODO 清单、产品愿望池、后端产品承诺、API / RPC / SDK 形态、event / topic / outbox / retry、数据库、对象存储、OTel、secrets、GRC、seccomp / AppArmor / cap drop profile、配置 key、部署脚本、测试用例、性能阈值、实施 commit boundary 或验收签署。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `01_arch_step_06_container_deployment.md` | 已完成并经用户确认 | 承接同步入口、异步控制消费、受控执行承接、后台维护清理、truth / material 状态承载、isolation backend 和材料交接运行边界。 |
| `01_arch_step_07_dependency_direction.md` | 已完成并经用户确认 | 承接核心语义、编排 / 承接、外部能力接缝、本地影子 / 派生辅助、技术承载和跨仓依赖裁剪。 |
| `01_arch_step_08_data_ownership_consistency.md` | 已完成并经用户确认 | 承接 execution isolation truth、快照 / 投影、引用、禁止正文、一致性、cleanup guard 和 redline containment 口径。 |
| `01_arch_step_09_interactions_communication.md` | 已完成并经用户确认 | 承接同步 / 异步 / 后台三类通信方式、handoff、派生维护和失败降级语义。 |
| `01_arch_step_10_technology_choices.md` | 已完成并经用户确认 | 承接机制级关键技术选型和产品 / 协议 / profile / 指标后置口径。 |
| `01_arch_step_11_alternatives_tradeoffs.md` | 已完成并经用户确认 | 承接独立 execution isolation truth 主线、相邻替代路径和不采用方案。 |
| `01_arch_step_12_cross_cutting_concerns.md` | 已完成并经用户确认 | 承接安全、审计、可观测、韧性、性能 / 容量、配置与变更控制横切约束。 |
| `projects/L4-sandbox/00-需求文档.md` §13~§15 | 当前正式需求基线 | 校验 NFR、验收、一票否决、风险和待确认事项是否被演进路线承接且未伪收口。 |
| `projects/L2-tools/00~06` | 上游参考 | 校验 tools semantic execution、ToolPolicy、ToolInvocationResult 不回流为 sandbox 演进项。 |
| `projects/L2-runtime/00~06` | 上游参考 | 校验 ExecutionInstance、agent loop、recover / checkpoint 不回流为 sandbox 演进项。 |
| `projects/L2-member-service/00~06` | 上游参考 | 校验 MemberExecutionHost、SandboxBinding、host lifecycle 不回流为 sandbox 演进项。 |
| `projects/L1-identity/00~07`;`projects/L1-work/00~07` | 上游参考 | 校验 actor / member identity anchor、project / work / context refs 只作为 refs / summary 进入 sandbox。 |
| 旧 `projects/L4-sandbox/README.md` | historical material | 诊断旧 Docker/gVisor/Firecracker、seccomp/AppArmor、性能数字和测试后端是否污染路线图。 |
| 旧 `projects/L4-sandbox/01-架构设计.md` §12 | historical material | 诊断旧阶段 1~4、Firecracker、allowlist 粒度、local_process、P95 / deny count 触发阈值是否可继承。 |

---

## 4. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、架构 flow、Step 10 / 11 / 12、SOP Step 13 和书写规范 §4.14 | done | 本文件 §1、§3 |
| 读取正式 00 NFR / 验收 / 风险、旧 README / 旧 `01` 演进段和 L1 同类 Step 13 示例 | done | 本文件 §3、§6 |
| 抽查 L2-tools、L2-runtime、L2-member-service、L1-identity、L1-work 的相邻 truth 边界 | done | 本文件 §3、§9.5 |
| 回答当前阶段、第一批必须守住结构、后续演进能力、可接受 / 不可接受债务和触发条件问题 | done | 本文件 §5 |
| 输出演进路线表、阶段边界短文、债务表、触发条件表、不作为演进项和演进边界说明 | done | 本文件 §9 |
| 写出 Step 16 可回填草稿 | done | 本文件 §10 |
| 完成 Step 13 自检并更新 flow / 项目台账 | done | 本文件 §12;`01_architecture_calibration_flow.md`;`project_execution_ledger.md` |

---

## 5. SOP 问题回答

### 5.1 当前阶段做到哪里才算足够?

当前阶段不是“选定完整后端组合、写出所有协议、配置安全 profile、量化所有 SLO 并完成运维脚本”才算架构成立。当前阶段足够成立的边界是:

1. 独立 execution isolation truth 成立,并覆盖正式受理、execution environment identity、责任链、coherent resource / filesystem / network / process boundary、给定 policy 裁定、capture / handoff、failure / control、cleanup / reaper 和 redline containment。
2. 外部调用方、policy 来源、backend、artifact、runtime、runner、observability、bus、identity、work 和 member-service 均只能通过 refs、safe summary、policy input、handoff、signal 或运行期接缝协作,不得直接写 sandbox truth。
3. 后端产品、协议外形、事件机制、安全 profile、监控字段、配置 key、数据库、对象存储、OTel、secrets、压测数字和部署方式全部后置,但不得反向改变当前主线。
4. 核心链路失败时只能拒绝、pending、unresolved、failed、blocked、contained 或保持原状态,不得伪成功、宿主直跑、silent degrade 或 cleanup 先删证据。
5. inspect / preview / replay / backend comparison / trend / dashboard 等外围增强只能只读派生,不构成核心闭环通过前提。

### 5.2 第一批必须守住哪些结构?

第一批必须守住的结构是“核心闭环 + 边界红线”,不是完整产品设施:

- 正式受控执行入口和受理 / 拒绝语义。
- execution environment identity 与 actor / member / project / work / runner / tool / runtime refs 的责任链绑定。
- resource、filesystem、network、process、workspace、mount 和 lifecycle 的 coherent boundary 裁定。
- 抽象 isolation backend 承载契约和 backend capability summary,且能力不足时 fail-closed。
- 给定 launch / isolation policy 下的执行裁定,policy definition / approval / allowlist / capability truth 外部拥有。
- capture fact、candidate material、observability material 和 handoff fact 分层。
- stable failure classification、control fact、lease / orphan、cleanup guard、reaper、redline containment 和 investigation handoff。
- 幂等、顺序保护、traceability / audit backref 和只读派生辅助。

### 5.3 哪些能力或约束留到后续阶段演进?

后续阶段才进入主线的能力包括:具体 isolation backend 组合和强隔离变体、网络 / 文件系统 / 进程边界粒度、policy source 矩阵和策略模拟、capture / handoff 协议与大材料治理、failure / cleanup / redline 更细状态、inspect / preview / replay / operator control / trend 只读派生、容量 / SLO / 配置治理、协议 / SDK / event / outbox / retry、存储 / 观测 / secrets / profile / 部署实现。

这些后续能力只有在不改变 execution isolation truth ownership、coherent boundary、policy fail-closed、capture / handoff 分层、cleanup guard、redline containment、外部正文禁止入仓、依赖裁剪和跨调用方同一正式语义的前提下才能进入演进主线。

### 5.4 哪些设计债务当前可接受,哪些不可接受?

当前可接受债务是那些不改变核心 truth 和边界红线的结构未细化:未锁定 Docker / gVisor / Firecracker / k8s 组合,未锁定 RPC / SDK / event / topic / outbox,未写 DB / object store / OTel / secrets 产品,未写 seccomp / AppArmor / cap drop profile,未量化旧 P95 / SLA,未细化 policy 来源矩阵、handoff ack、网络粒度、长时会话、大体积输出和多宿主调度。

不可接受债务是会导致核心闭环无法成立的缺口:宿主直跑或 test-only 路径被宣称为正式 sandbox;任一必需边界可 silent degrade;policy 缺失或不支持时继续执行;外部正文入仓;candidate material / observability material 静默升级为下游 truth;cleanup 先删证据;orphan 或 redline 脱离托管收束;重复执行、重复 control 或多调用方产生第二套正式语义;关键链路不可追溯。

### 5.5 未来哪些触发条件会迫使架构调整?

会触发下一阶段演进的事实必须是结构压力,不是愿望或排期。例如:

- 后端能力差异、强隔离场景或承载环境变化导致当前 abstract backend contract 无法表达足够边界。
- policy 来源、授权结论或高风险动作类型开始影响裁定一致性。
- capture / handoff、材料体积、下游 ack 或 cleanup guard 的复杂度超过当前分层交接口径。
- failure / cleanup / redline 争议需要更细状态、调查联动或 containment 解除条件。
- inspect / preview / replay / trend 成为安全审查、排障或容量治理的关键输入,但仍不得反写真相。
- 测试、验收或生产负载证明隔离建立、policy 判断、capture、cleanup / reaper 或派生重建出现不可解释瓶颈。
- 配置变更开始影响后端能力、边界、policy、fallback、材料保留、cleanup 放行或 redline 解除。

### 5.6 当前主线演进时最先改变的结构面是什么?

最先改变的结构面不是核心 truth owner,而是外围承接层和技术承载层:backend capability summary、policy input / authorization summary、handoff fact、cleanup guard、failure classification、derived read surface、configuration governance 和 test / acceptance gates 会先细化。只有这些层面经正式证据证明无法表达核心语义时,才允许回到核心模型评估结构调整。

---

## 6. 当前材料问题诊断

| 旧材料内容 | 问题 | 本步处理 |
|---|---|---|
| 旧 `01` §12 把阶段 1 写成 Docker + gVisor + deny-by-default | 把产品组合和网络默认策略写成当前阶段目标,忽略抽象 backend contract 和 coherent boundary 裁定。 | 当前阶段改为 execution isolation truth + abstract backend contract + fail-closed;产品组合后移。 |
| 旧 `01` §12 写 Runner / runtime 统一接口稳定 | 协议外形和 SDK surface 不是架构演进本体,且容易让统一接口替代统一语义。 | 改为统一 sandbox 语义先成立,协议 / SDK 进入后续概要 / 详细设计。 |
| 旧 `01` §12 写 allowlist 粒度增强 + local_process 测试后端 | allowlist 来源和粒度属于 policy / 配置接缝;`local_process` 若被路线化会污染宿主直跑红线。 | allowlist 粒度作为后续 policy / high-risk boundary refinement;`local_process` 不作为正式演进项。 |
| 旧 `01` §12 写 Firecracker / nested scenarios | 强隔离变体有价值,但不能作为当前核心通过前提或默认承诺。 | 作为 backend capability / stronger isolation variant 的后续触发项。 |
| 旧 `01` §12 用 gVisor >2s、deny count 阈值触发调整 | 旧数字和阈值缺新版负载模型和验证来源。 | 不继承为硬阈值;后续由测试 / 验收 / 生产负载事实触发容量和配置治理。 |
| 旧 README 写 seccomp、AppArmor、cap drop、只读挂载、drop all 网络 | 这是安全配置候选,不是当前架构演进阶段。 | 后移 `04`、`05`、`07`,当前只固定边界不可越过和 fail-closed。 |
| 旧材料将 audit event、backend fallback、cleanup 脚本散落在路线中 | 可能让观测事件、fallback 或运维脚本替代 sandbox truth。 | 改为 material / handoff、同等边界证明、cleanup guard / reaper / redline containment 后续增强。 |

---

## 7. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 阶段主语 | Docker/gVisor、Runner/runtime 接口、allowlist、local_process、Firecracker。 | 当前主线成立、可接受债务、后续结构演进、触发条件。 | 对齐书写规范 §4.14,避免路线图变项目愿望池。 |
| 当前阶段 | 产品 / 协议 / 策略实现先行。 | 独立 execution isolation truth 与正式边界协作先成立。 | 当前目标是主线可落码边界,不是产品清单。 |
| 后续演进 | Firecracker、allowlist 粒度、local_process 和性能阈值。 | 后端能力、policy 高风险边界、capture / handoff、cleanup / redline、只读派生、容量 / 配置治理。 | 后续项必须能改变结构承接方式且不打穿边界。 |
| 设计债务 | 未区分可接受与不可接受。 | 明确未锁产品 / 协议 / profile / 数字可接受,边界红线不可接受。 | 防止实现阶段把红线当成“以后再说”。 |
| 触发条件 | 旧 P95、deny count、阶段编号。 | 由边界、policy、交接、失败、安全、容量、配置压力触发。 | 触发条件必须来自事实,不是排期或愿望。 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 继承旧阶段 1~4 路线图 | 文字短,接近旧文档。 | 把 Docker/gVisor、allowlist、local_process、Firecracker 和旧阈值包装成当前架构承诺。 | 不采用。 |
| 方案 B: 按当前主线成立、可接受债务、后续结构演进和触发条件写演进路线 | 能解释当前为什么足以成立,也能为后续设计留下明确触发门槛。 | 后续仍需 `02/03/04/05/06/07` 落到对象、状态、配置、测试和实施边界。 | 采用。 |
| 方案 C: 当前直接锁定完整后端产品组合、安全 profile、协议、事件 outbox 和性能数字 | 实施方向看似明确。 | 过早进入实现和配置,且会反向改变抽象 boundary、policy 和 capture / cleanup 语义。 | 不采用。 |
| 方案 D: 完全不写演进路线 | 文档更轻。 | 后续实现容易把外围增强、旧愿望和红线债务混在一起。 | 不采用。 |

### 8.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否把 Docker / gVisor / Firecracker 组合写成当前阶段目标 | A. 是;B. 否,当前只固定 abstract backend contract 和 capability 裁定 | B | 后端产品不能反向定义 coherent boundary。 | 本步采用 B。 |
| 是否把统一 RPC / SDK / SandboxService 写成演进路线节点 | A. 是;B. 否,只把统一语义作为当前主线,协议后续收敛 | B | 接口外形不是结构演进本体。 | 本步采用 B。 |
| 是否把 `local_process` 作为后续正式后端 | A. 是;B. 否,不得成为正式 sandbox 路线 | B | 宿主直跑 / 低隔离路径不能被路线化。 | 本步采用 B。 |
| 是否把旧性能 / deny 阈值作为触发条件 | A. 是;B. 否,后续由正式负载模型和测试验收触发 | B | 当前缺验证来源,不能伪量化。 | 本步采用 B。 |
| 是否把 inspect / preview / replay / trend 纳入核心通过前提 | A. 是;B. 否,保持只读派生 / 外围增强 | B | 派生调查能力不能反写核心 truth。 | 本步采用 B。 |

---

## 9. 结构化中间产物

### 9.1 演进路线表

| 阶段 | 当前目标 / 范围 | 当前可接受债务 | 后续演进项 | 触发条件 | 说明 |
|---|---|---|---|---|---|
| 当前主线成立阶段 | 让独立 execution isolation truth、正式承接边界、execution environment identity、coherent resource / filesystem / network / process boundary、抽象 backend contract、给定 policy fail-closed、truth / ref / body-free summary / derived separation、同步 / 异步 / 后台分离、capture / handoff、failure / control、cleanup / reaper、redline containment 和 traceability 成立。 | 暂不锁定 Docker / gVisor / Firecracker / k8s / DB / queue / object store / OTel / secrets / RPC / SDK / event / seccomp / AppArmor / cap drop / P95 / SLA;暂不展开高级 inspect / preview / trend、多宿主调度、大体积输出和完整配置治理。 | 进入 `02/03/04/05/06/07` 时细化对象、状态、port、协议、配置、测试、验收和 implementation boundary。 | 当前主线需要落成可实现边界,但尚未出现必须改变核心结构的压力。 | 当前不是“全做完”,而是先让受控执行隔离事实和边界协作稳定成立。 |
| Backend capability / stronger isolation 增强阶段 | 在不改变 sandbox truth 的前提下细化 backend capability summary、风险分层承载、强隔离变体、多宿主 / 多集群承载和同等边界证明。 | 当前允许不锁具体后端组合、后端优先级、Firecracker 引入条件、多集群调度和产品生命周期。 | 后端能力矩阵、同等边界证明、强隔离 profile 候选、多承载选择、后端不可用 / 不支持 / 过期处理。 | 高风险场景、监管要求、后端能力差异、容量隔离或宿主污染风险证明当前抽象承载不足。 | 增强的是承载裁定和能力证明,不是让后端产品定义 sandbox truth。 |
| Policy / high-risk boundary refinement 增强阶段 | 细化 launch / isolation policy 输入、authorization / approval 摘要、网络 / 文件系统 / 进程高风险边界、策略缺失 / 冲突 / 不支持处理和策略模拟。 | 当前允许不锁 policy source 矩阵、allowlist 粒度、domain / IP / port 结构、policy DSL 或 approval workflow。 | policy source 接缝矩阵、boundary action taxonomy、策略冲突解释、unsupported policy 状态、模拟与预检。 | policy 来源增多、越权动作类型扩大、网络 / 文件系统 / 进程规则影响执行裁定一致性。 | 增强的是给定 policy 的消费和裁定,不是把 policy definition truth 移入 sandbox。 |
| Capture / handoff / material governance 增强阶段 | 强化 stdout / stderr、输出文件、candidate material、usage / audit / trace / metric material、handoff ack、下游失败和 cleanup guard 的交接语义。 | 当前允许不锁 ack 协议、artifact / observability 物理交接形态、大材料存放、材料保留窗口和 outbox / retry 机制。 | handoff protocol、material size / retention policy input、capture failure 分类、safe summary、retryable / failed / handoff-pending 状态、下游回链验证。 | 输出体积、候选材料争议、下游 ack 延迟、观测消费失败或 cleanup guard 复杂度开始影响核心收束。 | 该阶段强化交接,不得让 candidate material 或 observability material 静默升级为下游 truth。 |
| Failure / cleanup / redline containment 增强阶段 | 细化 timeout、resource exceeded、backend failure、capture failure、deny、kill、cancel、orphan、lease expiry、cleanup、reaper、escape-like redline、investigation handoff 和 containment 解除条件。 | 当前允许不锁完整状态机、reaper 部署形态、安全调查系统协议、恢复脚本和解除审批流。 | 失败分类 taxonomy、control conflict 收束、cleanup guard matrix、orphan recovery、redline containment lifecycle、investigation handoff、解除条件和审计回放。 | 非 happy path 占比上升、安全争议增多、orphan / cleanup 复杂化、redline 需要跨仓调查闭环。 | 该阶段不得把 cleanup 私有化为 SRE 脚本,也不得让 redline 退化为 advisory event。 |
| Derived investigation / read-surface 增强阶段 | 增强 inspect、preview、replay view、backend comparison、capacity trend、operator read surface 和 reconciliation,用于调查、排障、安全审查和容量判断。 | 当前允许只提供最小只读派生、stale / rebuilding / failed / unavailable 口径,不把派生作为核心通过前提。 | 派生索引、预览、调查视图、趋势分析、后端比较、对账报告、operator read surface 和查询降级。 | 调查、排障、容量分析或安全审查需要比核心 material 更强的只读解释能力。 | 派生能力只能读取核心 truth 和材料,不得反写 execution isolation truth、policy 或 cleanup 结论。 |
| Capacity / SLO / configuration governance 增强阶段 | 基于正式负载模型硬化隔离建立、policy 判断、capture、cleanup / reaper、派生重建、配置变更和降级策略。 | 当前不继承旧 Docker `<1s`、gVisor `<2s`、销毁 `<500ms`、network gate `<5ms`、API `99.9%` 等数字为硬指标。 | SLO、容量模型、限流、读写隔离、配置清单、变更审查、fallback 约束、灰度 / 回滚、压测门禁和运行报告。 | 测试、验收或生产负载证明当前承载不足,或配置变更开始影响 boundary、policy、cleanup、redline、材料保留和 fallback。 | 该阶段由量化事实和配置风险触发,不是提前锁定数字、产品或运维流程。 |
| Protocol / event / storage implementation closure 阶段 | 在不改变前述结构边界的前提下,将 port、API / RPC / SDK、event、outbox、store、worker、job、adapter、配置和脚本落到后续设计与实施计划。 | 当前允许不写接口路径、DTO、event payload、topic、repository、worker、job、DB schema、object store 和 deployment manifests。 | 概要设计接口、详细设计对象 / 状态 / 端口、配置设计、测试方案、验收标准和 07 implementation boundaries。 | 进入对应正式文档阶段,或实现 agent 无法基于已确认设计落码而需要正式 boundary。 | 这是文档链路闭口,不是在 Step 13 提前实现。 |

### 9.2 阶段边界说明短文

当前阶段不是“后端产品、协议、事件、配置、安全 profile、监控、压测和运维流程全部定稿才算成立”,而是先让 `L4-sandbox` 的独立 execution isolation truth、正式入口、边界裁定、policy fail-closed、capture / handoff、failure / cleanup / redline 和追溯主线稳定成立。当前可接受债务之所以可接受,是因为它们暂不改变 sandbox 是否拥有正确的受控执行隔离事实,也不会让调用方、后端产品、policy 来源、artifact、observability、runtime、member-service 或派生视图反向定义核心。后续演进必须由明确的边界、策略、材料、失败、安全、容量、配置或实施闭口压力触发,不能把旧 Draft 的产品设施、性能数字和未来愿望写成当前架构承诺。

### 9.3 可接受债务与不可接受债务表

| 债务类型 | 当前是否可接受 | 理由 | 后续处理 |
|---|---|---|---|
| 未锁定 Docker / gVisor / Firecracker / k8s / containerd / runc 组合 | 可接受 | 当前核心是抽象承载契约和 coherent boundary 裁定,产品组合不能反向定义边界。 | Backend capability / stronger isolation 增强阶段;`04/05/07` 闭口。 |
| 未写 `local_process` 正式后端 | 可接受且必须保守 | 低隔离 / 宿主直跑路径不能成为正式 sandbox 语义。 | 只能作为受限 fake / fixture 讨论,不得作为正式演进项。 |
| 未锁定 RPC / SDK / API / SandboxService 外形 | 可接受 | 当前只需同一 sandbox 语义,协议外形属于概要 / 详细设计。 | `02-概要设计.md`;`03-详细设计.md`。 |
| 未锁定 event / topic / outbox / backlog / retry | 可接受 | 事件机制不能替代 truth / material 状态承载。 | `03`;`05`;`07` 根据 handoff 与追溯闭口。 |
| 未锁定数据库、对象存储、缓存、OTel、secrets、GRC 产品 | 可接受 | 技术产品服务状态承载和交接,不能定义业务语义。 | `03/04/07` 结合实现仓边界选择。 |
| 未锁定 seccomp / AppArmor / cap drop / mount profile | 可接受 | profile 必须绑定正式后端组合、配置和测试证据。 | `04-配置设计.md`;`05-测试方案.md`;`07-实施计划.md`。 |
| 未细化 policy 来源矩阵、allowlist 粒度、approval workflow | 可接受 | sandbox 只消费给定 policy / authorization,不拥有 policy truth。 | Policy / high-risk boundary refinement 增强阶段。 |
| 未细化 handoff ack、材料保留窗口、大体积输出治理 | 可接受 | 当前已固定 capture / handoff 分层和 cleanup guard,协议形态可后置。 | Capture / handoff / material governance 增强阶段。 |
| 未量化旧 P95 / SLA / deny count 触发阈值 | 可接受 | 当前缺正式负载模型和验证依据。 | Capacity / SLO / configuration governance 增强阶段。 |
| 未展开高级 inspect / preview / replay / trend / dashboard | 可接受 | 派生调查不是核心闭环通过前提。 | Derived investigation / read-surface 增强阶段。 |
| execution isolation truth owner 不清 | 不可接受 | 会让 sandbox 退化为调用方、后端、事件或观测的附属状态。 | 必须当前修正。 |
| 宿主直跑、调用方本地执行或匿名执行可宣称正式 sandbox | 不可接受 | 违反正式受理和隔离入口零容忍。 | 必须当前修正。 |
| 任一必需 resource / filesystem / network / process boundary 可 silent degrade | 不可接受 | 破坏 coherent boundary 和安全底线。 | 必须当前修正。 |
| policy 缺失、冲突、不支持、不可解析或未授权仍继续执行 | 不可接受 | 破坏 fail-closed。 | 必须当前修正。 |
| sandbox 保存 identity / work / tool semantic / runtime recover / artifact / observability / policy 正文 | 不可接受 | 污染数据所有权和外部 truth 边界。 | 必须当前修正。 |
| candidate material / observability material 静默升级为 formal artifact / evidence / observability store truth | 不可接受 | 打穿 capture / handoff 分层。 | 必须当前修正。 |
| cleanup / reaper 先删证据或 redline advisory-only | 不可接受 | 破坏审计、调查和安全 containment。 | 必须当前修正。 |
| 重复 execute、重复 control、bus replay 或不同调用方产生第二套正式语义 | 不可接受 | 平台无法对账。 | 必须当前修正。 |
| 关键 accept / reject / establish / policy / handoff / failure / control / cleanup / redline 追溯缺口 | 不可接受 | 核心审计与问责链断裂。 | 必须当前修正。 |

### 9.4 触发条件小表

| 触发条件 | 触发的演进方向 | 最先改变的结构面 | 不应改变的边界 |
|---|---|---|---|
| 高风险场景需要更强隔离,或后端 capability 差异影响边界可落实性 | Backend capability / stronger isolation 增强 | backend capability summary、同等边界证明、后端选择策略 | 后端产品不得定义 sandbox truth;能力不足不得 fallback 到弱边界。 |
| policy 来源增多、授权语境分叉或高风险动作 taxonomy 影响执行裁定 | Policy / high-risk boundary refinement 增强 | policy input summary、来源矩阵、冲突 / unsupported 状态 | sandbox 不拥有 policy definition、approval、allowlist 或 capability truth。 |
| 输出体积、candidate material、下游 ack 或 observability 消费失败影响 cleanup guard | Capture / handoff / material governance 增强 | handoff fact、material summary、retryable / failed / pending 状态 | candidate / observability material 不得升级为下游正式 truth。 |
| timeout、backend failure、orphan、cleanup 或 redline 争议超过当前分类能力 | Failure / cleanup / redline containment 增强 | failure taxonomy、control conflict、cleanup guard matrix、containment lifecycle | cleanup 不得私有脚本化;redline 不得 advisory-only。 |
| inspect / preview / replay / trend 成为安全审查、排障或容量治理关键输入 | Derived investigation / read-surface 增强 | 只读派生索引、预览、趋势、对账报告 | 派生不反写核心,不成为验收签署来源。 |
| 测试、验收或生产负载证明隔离建立、policy 判断、capture 或 cleanup / reaper 不可解释变慢 | Capacity / SLO / configuration governance 增强 | SLO、容量模型、限流、读写隔离、压测门禁 | 不降低边界一致性、fail-closed 或追溯完整性。 |
| 配置变更开始影响后端能力、网络边界、材料保留、fallback、cleanup 放行或 redline 解除 | Capacity / SLO / configuration governance 增强 | 配置清单、变更审查、回滚、审计 trail | 配置不得暗改 truth、boundary、policy、cleanup、redline 或依赖裁剪。 |
| 概要 / 详细 / 配置 / 测试 / 验收 / 实施进入具体落码闭口 | Protocol / event / storage implementation closure 阶段 | port、state、protocol、schema、config、test gate、boundary skeleton | 不在后续文档私补未确认架构结论。 |

### 9.5 不作为演进项的事项

| 事项 | 不作为演进项的原因 | 正确归属 |
|---|---|---|
| ToolDefinition、ToolPolicy、ToolInvocationRequest、ToolInvocationResult、tool semantic result normalization | sandbox 不拥有 tools semantic execution 或工具结果真相。 | `L2-tools` |
| ExecutionInstance、agent loop、CurrentStep、checkpoint、recover、runtime retry | sandbox 不拥有 runtime execution truth 或 recover truth。 | `L2-runtime` |
| MemberExecutionHost、MemberRuntimeSession、SandboxBinding、host health、member host lifecycle | sandbox 不拥有宿主装配 truth;SandboxBinding 只是 member-service 的绑定结果。 | `L2-member-service` |
| GlobalMember、actor identity、role / capability identity、ProjectMember、WorkItem、project / work lifecycle | sandbox 只消费 identity / work refs 和 safe summary。 | `L1-identity`;`L1-work` |
| Artifact、baseline、formal evidence、artifact retention、archive package body | sandbox 只形成 candidate material 与 handoff fact。 | `L1-artifact`;`L4-archive` |
| Observability physical ledger、metric store、trace backend、alert platform | sandbox 只形成 observability material fact 和 handoff fact。 | `L4-observability` |
| Policy DSL、approval workflow、allowlist truth、capability catalog truth | sandbox 只执行给定 policy / authorization。 | `L1-governance`;`L3-capability-hub`;`L2-tools` |
| Runner UI、operator console、conversation card、workspace layout | sandbox 可提供只读材料和状态,不拥有产品展示 truth。 | `L5-runner`;`L1-conversation`;workspace / console |
| `local_process` / host-run 作为正式生产后端 | 违反宿主直跑和边界 silent degrade 零容忍。 | 仅可作为受限测试 fake / fixture,且不得伪装正式 sandbox。 |
| 旧 P95 / SLA / deny count / backend 切换阈值 | 缺新版负载模型和验证证据。 | `05-测试方案.md`;`06-验收标准.md`;容量治理增强阶段。 |

### 9.6 演进边界说明

`L4-sandbox` 的演进必须优先保护独立 execution isolation truth,而不是扩张为 tools、runtime、member-service、artifact、observability、policy 或 runner 的总控层。能在 backend capability summary、policy input、safe summary、handoff fact、cleanup guard、derived read surface、configuration governance 或测试 / 验收 gate 中解决的问题,不应直接改变核心 truth center。只有当后端边界表达、policy 裁定、材料交接、失败收束、安全调查、容量隔离或实施闭口明确证明当前事实模型不足时,才考虑核心结构演进。每个后续阶段都必须继续满足九条底线:正式入口不可绕过,coherent boundary 不可 silent degrade,policy 必须 fail-closed,外部正文不入仓,capture / handoff 分层不打穿,cleanup 不先删证据,redline 必须 containment,派生不反写,跨调用方不产生第二套正式语义。

---

## 10. 回填草稿

正式 `01-架构设计.md` 后续整理时:

- §14 “演进路线”直接摘录并整理本文件 §9.1、§9.2、§9.3、§9.4、§9.5 和 §9.6。
- 不在本 Step 重复粘贴完整正式章节,后续 Step 16 从结构化中间产物摘录生成正式文档。

---

## 11. 待确认事项

### 11.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 具体 isolation backend 组合是否当前锁定 | A. 当前锁定;B. 不锁产品,只锁抽象承载契约与能力裁定;C. 完全不考虑后端 | B | 产品组合应由配置、测试和实施证据闭口,不能反向定义边界。 | 本步采用 B。 |
| policy 来源矩阵和网络粒度是否当前锁定 | A. 当前锁定;B. 后续细化,当前只锁给定 policy + fail-closed | B | sandbox 不拥有 policy truth,但必须消费给定策略并保守裁定。 | 本步采用 B。 |
| handoff ack 和大材料治理是否当前锁定协议 | A. 当前锁定;B. 后续细化,当前只锁 capture / handoff 分层和 cleanup guard | B | 架构层先保护分层,协议和材料存储后续落地。 | 本步采用 B。 |
| inspect / replay / operator control 是否进入当前核心 | A. 是;B. 否,作为只读派生和外围增强 | B | 外围调查能力不能成为核心闭环通过前提。 | 本步采用 B。 |
| 旧性能数字是否当前作为触发阈值 | A. 是;B. 否,由正式负载模型和测试 / 验收事实触发 | B | 避免无证据硬指标污染架构路线。 | 本步采用 B。 |

### 11.2 本 Step 未确认事项

本步不新增阻塞 Step 14 的待确认事项。具体后端产品组合、policy source 矩阵、网络粒度、handoff ack 协议、大体积输出治理、failure 状态机、redline 调查系统接缝、inspect / preview / replay / trend 范围、配置 key、SLO 数字、事件机制、存储产品和 implementation boundary 留到 `02/03/04/05/06/07` 继续闭口。

---

## 12. 自检与进入下一步条件

| 自检项 | 结论 |
|---|---|
| 已明确当前阶段主线成立的最低结构边界 | pass。见 §5.1 和 §9.1 当前主线成立阶段。 |
| 已明确第一批必须守住的结构 | pass。见 §5.2。 |
| 已明确当前可接受债务及其理由 | pass。见 §9.3。 |
| 已明确当前不可接受债务和边界红线 | pass。见 §9.3 不可接受债务。 |
| 已明确哪些能力后续才进入演进主线 | pass。见 §9.1 后续阶段。 |
| 已明确触发下一阶段演进的条件 | pass。见 §9.4。 |
| 已明确哪些事项不作为 sandbox 演进项 | pass。见 §9.5。 |
| 未滑入项目排期、版本路线图、任务拆单、TODO 清单、产品愿望池或实现计划 | pass。 |
| 未把已排除的边界外事项重新包装成后续演进项 | pass。tools / runtime / member-service / identity / work / artifact / observability / policy / runner 边界均已列明。 |
| 是否允许进入 Step 14 | 本步完成后需等待用户审查确认;确认后才能进入 Step 14 `风险与待确认事项`。 |
