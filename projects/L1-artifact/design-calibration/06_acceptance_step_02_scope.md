# Step 2. 明确验收目标与范围

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 2
> 回填章节: `06-验收标准.md` §2 验收目标与范围

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 2 明确验收目标与范围 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 1 输入映射;`00-需求文档.md` §14~§15;`05-测试方案.md` §2 / §14;`03-详细设计.md` truth boundary、protocol、state 与 job seam |
| 输出文件 | `projects/L1-artifact/design-calibration/06_acceptance_step_02_scope.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 3 |

## 2. 本步目标

定义新版 `06-验收标准.md` 本轮要裁决什么、不裁决什么,以及 P0 / P1 / P2 在验收结论中的地位。

本 Step 只回答:

- 本轮验收的核心裁决目标是什么。
- 哪些能力属于 P0 必须裁决范围。
- 哪些能力只验 runtime / event / adapter / handoff 接缝。
- 哪些能力属于 P1 / P2 residual 或 future,不作为当前 P0 通过前置。
- 哪些范围项可能成为一票否决。

本 Step 不固定送验版本、真实证据 run、单条验收项编号、通过 / 失败条件和最终结论。这些分别由 Step 3、Step 5~11 和 Step 14 收口。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_01_input_boundary.md` | 已完成 | 提供验收输入边界和旧 `06` 处理策略 |
| `00-需求文档.md` §14 | 已完成 | 提供 `14.1~14.6` 和 `VF-ART-001~004` |
| `00-需求文档.md` §15 | 已完成 | 提供当前不阻塞项、后续阻塞项和外围增强边界 |
| `03-详细设计.md` §5~§16 | 已完成 | 提供 Command / Query / Consumer / Event / Job、truth、state、transaction、idempotency、observability 等验收契约来源 |
| `04-配置设计.md` §2 / §6 / §12~§14 | 已完成 | 提供 P0 profile、P1/P2 profile、配置不可越界和 future 触发项 |
| `05-测试方案.md` §2 | 已完成 | 提供 P0/P1/P2 测试范围、只测接缝能力和 VF 关联 |
| `05-测试方案.md` §14 | 已完成 | 提供 residual、不可风险接受项和必须转入新版 `06` 的事项 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本轮验收的核心裁决目标是什么? | 裁决 `L1-artifact` 作为正式制品真相仓是否成立,并能否阻断 `VF-ART-001~004`。 |
| P0/P1/P2 验收范围如何划分? | P0 裁决 Artifact truth center、正式对象、protocol、状态、事务、幂等、配置、redaction、dependency、证据完整性和 no truth repair。P1 只作为 real-like / durable-like / staging-like selected-run 或 residual,不作为当前 P0 通过前置。P2 只记录 production-like、capacity、advanced browse / dashboard / search / external provider 等 future 能力。 |
| 哪些下游能力只验接缝? | process、work、artifact/archive、identity、method-library、runtime/capability、conversation/workspace/console、observability、external content source 均只验 ref / safe snapshot / event / adapter / handoff / disabled-or-controlled seam,不验对方内部 truth 或产品 UI。 |
| 哪些非范围会影响最终结论? | P1/P2 unavailable 不导致 P0 不通过,但若被误写成 P0 passed、或缺少 residual / risk acceptance,会影响有条件通过和送验交接完整性。P0 红线不允许风险接受。 |
| 哪些范围项可能成为一票否决? | Artifact/Version 混层、外部正文入仓、evidence ref 替代采纳关系、baseline freeze 失效、query no-write 失守、job no-truth-repair 失守、redaction 泄漏、dependency boundary 破坏、report 静态造证据、`VF-ART-001~004` 命中。 |
| 哪些验收范围必须使用详细设计正式字段、状态或接口名? | 16 Command、13 Query、6 Consumer、8 Event、6 public Job、worker-only `PublishPendingArtifactRelays`、状态矩阵、accepted flow、query no-write、outbox stored payload、job report replay、reference/projection marker、config profile 和 redaction / observability surface。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` §1~§7 | 范围仍围绕 CreateArtifact / PublishArtifactVersion / EvidenceRef / FreezeBaseline 旧主线 | 本 Step 用新版 Artifact truth center、`VF-ART-*`、`TC-ART-*` 和 `EV-CAND-ART-*` 重定验收范围 |
| 旧 `06-验收标准.md` | 把 test / staging 级环境写成泛化验收基线 | 本 Step 明确 P0/P1/P2 分层,真实环境不作为 P0 前置 |
| 旧 `06-验收标准.md` | 缺少 Query / Consumer / Outbound Event / Operations Job / config / redaction / dependency / evidence 作为验收范围 | 本 Step 把这些纳入 P0 裁决范围 |
| `05-测试方案.md` | 已给出范围,但 `06` 需要转成裁决目标 | 本 Step 把测试范围转成验收范围项 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 核心裁决 | 审批接口 / 请求 / 风险接受主线 | Artifact truth center 是否成立并阻断 `VF-ART-001~004` | 承接新版 `00`~`05` |
| P0 范围 | 旧核心场景 + 泛化非功能 | truth、protocol、state、command、query、consumer、event、job、config、redaction、dependency、evidence | 防止验收漏掉详细设计关键 surface |
| P1/P2 | 与 test / staging 混写 | P1/P2 只作 residual / future,不作为 P0 pass 前置 | 防止真实产品不可用阻塞 P0 或被伪造为 P0 |
| 下游能力 | 旧文档中容易写成 E2E 验证 | 只验接缝,不验相邻仓内部 truth | 保持仓级验收边界 |

## 7. 验收裁决取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否按旧“功能/安全/红线”简单分组 | A. 继续旧分组;B. 按 truth / protocol / consistency / evidence 范围重建 | 采用 B。新版详细设计 surface 更宽,旧分组会漏掉 query/job/evidence 红线 |
| 是否把 P1 real-like selected-run 作为通过前置 | A. 是;B. 否 | 采用 B。当前 P0 使用 fake / controlled / disabled 证明正式语义;P1 只作 selected-run 或 residual |
| 是否把性能 P95/SLA 硬化 | A. 硬化;B. 只保留 sample / trend 和 `06` 待收口项 | 采用 B。当前无正式负载模型和阈值来源 |
| 是否验相邻仓内部生命周期 | A. 验;B. 只验接缝 | 采用 B。相邻仓内部 truth 属于对应仓验收 |

## 8. 结构化中间产物

### 8.1 验收目标

| 验收目标 | 来源 | 裁决口径 |
|---|---|---|
| 证明 Artifact truth center 独立成立 | 五个核心能力;`00` §14;`01` truth boundary;`03` truth object / protocol | Artifact fact、version、lineage、baseline 和 consumption backref 均按正式对象、flow 和只读边界成立 |
| 证明 `VF-ART-001~004` 可被阻断 | `00` §14.6;`05` §2.4 / §14 | 任一 VETO 命中时不得通过;P0 红线不得风险接受 |
| 证明 public protocol 和状态 surface 可裁决 | `03` §7~§10;`05` §3 | 16 Command、13 Query、6 Consumer、8 Event、6 Job 和状态矩阵均有可追溯验收项 |
| 证明一致性、幂等和恢复不变式成立 | `03` §11~§13;`05` §14 | UoW、version、stored result / receipt / report、duplicate replay、commit unknown、race guard 和 no truth repair 成立 |
| 证明配置、redaction、dependency 和证据真实性成立 | `04`;`05` §8~§13 | P0 profile 可装配;invalid config fail-fast;no raw body;dependency boundary 和 evidence index 可审计 |

### 8.2 验收范围表

| 验收范围项 | 类型 | 优先级 | 裁决目标 | 非范围 / 说明 |
|---|---|---|---|---|
| Artifact truth center | core truth | P0 | 正式 Artifact fact、version、lineage、baseline 和 consumable backref 成立 | 不验证上游正文生成过程 |
| 5 个核心能力 | core truth | P0 | 制品事实承载、版本化、血缘关联、基线冻结、事实可消费表达均成立 | 不验证相邻仓完整生命周期 |
| 16 Command / 13 Query / 6 Consumer / 8 Event / 6 Job | protocol | P0 | 协议、状态、错误、幂等、no-write / no-truth-repair、report replay 成立 | 不要求真实 message / search / archive 产品 |
| worker-only `PublishPendingArtifactRelays` | event / worker | P0 | relay snapshot 只从 stored snapshot 发布,与 6 个 public job 独立裁决 | 不并入 6 个 public job family |
| Config profile / runtime builder / redaction gates | config / security / observability | P0 | `local-dev`、`ci-test`、`integration-like`、`operations-replay` 可装配;strict JSON、redaction、degraded no-write 和 replay 成立 | `staging-like` / `production-like` 与真实 secret provider 不作为 P0 必过 |
| Durable-like stores / real-like resolver / publisher / handoff seam | product seam | P1 | 验证真实或 real-like adapter 接缝不会改变 P0 truth 语义 | 不作为当前 truth center 成立前置 |
| Production-like profile / search backend / secret provider / hot reload / hard SLO | operations / future enhancement | P2 | 后续基于真实产品、负载模型和运维约束验证 | 当前只保留候选和残余风险 |

### 8.3 只测接缝的下游 / 外部能力

| 下游 / 外部能力 | 本轮测试内容 | 不测试内容 | 残余风险 |
|---|---|---|---|
| `L1-work` | work context ref、consumption backref、Artifact truth 回指 | Project / WorkItem / Iteration 内部状态机 | 真实工作流消费差异留给跨仓集成 |
| `L1-process` | process context ref、活动输出到 artifact 的收束接缝 | ProcessInstance / Activity / checkpoint 生命周期 | 真实过程编排留给跨仓集成 |
| `L1-governance` | evidence / basis / artifact consumption seam、formal ref 回指 | Gate / Decision / Policy 内部治理逻辑 | 治理内部语义留给 governance 仓 |
| `L1-conversation` / `L1-workspace` | read surface、preview、notification、safe summary 消费边界 | UI 状态、交互、搜索体验 | 产品体验风险后置 |
| `L4-archive` | archive handoff marker、trace / report refs、no package body | archive package 存储与 restore orchestration | 真实归档恢复留给 archive |
| `L4-observability` | trace available / safe diagnostic refs / redaction scan seam | 物理 log / metric / trace backend | 真实观测平台接入留给 observability |
| `L3-method-library` | definition ref、artifact kind / definition snapshot seam | method 正文、标准文本、definition 内部状态机 | 真实定义演进留给 method-library |
| `L2-runtime` / `L3-capability-hub` | automation source ref、runtime signal、body-free consumption boundary | tool execution、agent loop、capability registry | 真实执行策略传播留给 runtime / capability |
| `L0-sdk` / `L5-console` / `L5-sync` | external read / sync / handoff seam、formal refs | 入口 UI、同步副本内部状态 | 真实访问 / 同步产品差异后置 |
| external content source | source ref、resolution state、degraded / unavailable surface | vendor API、真实对象存储或搜索产品 | 真实外部产品接入留给 P1/P2 |

### 8.4 P0 / P1 / P2 裁决口径

| 优先级 | 验收裁决地位 | 证据要求 |
|---|---|---|
| P0 | 必须有明确通过 / 失败条件;失败或 VETO 命中时不得通过 | 必须闭环到 `TC-ART-*`、`EV-CAND-ART-*`、report path 和 raw artifact |
| P1 | 不作为当前 P0 通过前置;可作为 selected-run 或 residual 记录 | 可进入 evidence index,但必须标记 non-P0 / unavailable / residual |
| P2 | 不作为当前验收通过前置;仅作为 future risk / operations readiness 输入 | 进入风险接受或后续 `09` / ADR / future test plan |

### 8.5 范围项到一票否决候选

| VF | 对应范围项 | 一票否决方向 |
|---|---|---|
| `VF-ART-001` | Artifact truth center;5 个核心能力 | 任一核心能力节点无法成立 |
| `VF-ART-002` | 外部正文排除、只读消费边界、自动化事实收束 | 外部正文、运行材料、派生材料或消费副本进入正式 fact truth |
| `VF-ART-003` | version / lineage / baseline 主线 | version、lineage、baseline 必须稳定追溯、冻结且不可被后续语境改写 |
| `VF-ART-004` | 可消费引用与回指、只读消费边界 | 消费方不得反写 Artifact truth,且消费后必须可回指正式 fact / version / lineage / baseline |

## 9. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_02_scope.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“验收目标”“验收范围表”“只测接缝的下游 / 外部能力”“P0 / P1 / P2 裁决口径”和“范围项到一票否决候选”小节,了解验收目标与范围如何收敛。

正式 `06-验收标准.md` §2 应回填:

- 本轮验收目标是裁决 `L1-artifact` 作为正式制品真相仓是否成立,并能否阻断 `VF-ART-001~004`。
- P0 覆盖 Artifact truth center、正式对象、协议、状态、事务、幂等、配置、redaction、dependency 和证据真实性。
- P1 仅作为 real-like / durable-like / staging-like selected-run 或 residual,不作为当前 P0 通过前置。
- P2 包含 production-like、capacity、advanced browse / dashboard / search / external provider 等 future 能力,不参与当前通过条件。
- process、work、artifact/archive、identity、method-library、runtime/capability、conversation/workspace/console、observability、external content source 只验正式接缝,不验对方内部 truth。
- 凡命中 `VF-ART-001~004` 的范围项均不得风险接受。

## 10. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| P1 selected-run 是否在某个 release candidate 中强制 | 影响 Step 13 风险接受和 Step 14 最终结论 | 当前不作为 P0 前置;后续 Step 13 / `06` 风险接受表承接 |
| 性能 hard threshold 是否硬化 | 影响 Step 9 非功能门禁 | 当前只保留 sample / trend;没有正式阈值不裁决 pass/fail |
| production-like / real adapter certification 是否升级 | 影响 P1/P2 范围 | 当前作为 future / residual,需后续 ADR / 配置 / 运维文档收口 |
| formal EV / AC alias 是否需要 | 影响 Step 5 / Step 10 / Step 11 / Step 14 | 当前不发明;若后续引入,必须保持与 `EV-CAND-ART-*` 可逆追溯 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 验收目标可裁决 | 通过 | 目标聚焦 Artifact truth center 和 `VF-ART-*` 阻断 |
| P0/P1/P2 边界明确 | 通过 | P1/P2 不作为当前 P0 通过前置 |
| 只验接缝的下游能力已列出 | 通过 | 见 §8.3 |
| 一票否决候选已关联范围项 | 通过 | 见 §8.5 |
| 可进入 Step 3 | 待用户审查 | 下一步固定验收基线;进入前等待用户审查 |
