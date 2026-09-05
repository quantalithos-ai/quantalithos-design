# Step 2. 明确实施目标、范围和非范围

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 2
>
> 回填章节：未来 `07-实施计划.md` §2 实施目标与范围
>
> 输入事实等级：design-planning only；不表示实现仓、代码、构建、测试、artifact、report、evidence、verdict、signoff 或 readiness 已存在。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 2：明确实施目标、范围和非范围 |
| Step 状态 | `completed / pass_with_explicit_blockers / serial_continuation_authorized` |
| 输入基线 | Step 1；当前正式 `00~06`；`03` Step 17 实施承接；07 SOP / 书写规范 |
| 本步输出 | 本文件；未来正式 §2 的回填草稿 |
| Step 内计划 | 先逐项回指需求、详细设计、测试和验收分母；再裁决 P0/P1/P2；最后定义防误入规则与下一步输入。 |
| 停审方式 | 本 Step 已独立完成。用户已授权继续 Step 3～13，故下一动作仅可进入 Step 3，不可提前创建正式 07 或 implementation ledger。 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 | 使用上限 |
|---|---|---|---|
| Step 1 输入边界 | completed | 继承 current planning baseline、历史隔离和 blocker 分类 | 不把 planning input 升格为 implementation baseline |
| `00-需求文档.md` | current formal | 回指 `C-L2M-1~5`、`FR-L2M-001~012`、`FR-L2M-E01~E03`、`NFR-L2M-001~016`、`AC-L2M-001~033`、`VF-L2M-001~009` | 不新增需求或改变 owner |
| `03-详细设计.md` | current formal | 回指七 crate、CP01～CP07、34 对象、`10/16/14/24/5` 协议分母、28 状态和 implementation constraints | 不复制字段、Port、DTO 或 flow schema |
| `04-配置设计.md` | current formal | 回指 profile、strict validation、zero configuration、blocked seam 和 secret 红线 | 不选择物理产品或环境 |
| `05-测试方案.md` | current formal | 回指 P0 suite、TC/EV candidate、artifact/report 路径和 residual | 不把 planned suite 写成执行结果 |
| `06-验收标准.md` | current formal | 回指 AC、VETO、风险接受与最终裁决边界 | 不填写 verdict、signoff 或 readiness |

## 3. SOP 问题回答

1. **本轮实施的最小可交付结果是什么？**

   在已固定 immutable design baseline、存在获授权目标实现仓且每个 boundary 的 Design Gate 通过之后，最小结果是一个按七个 planned Rust library crate 分层的 `L2-member` member-local implementation path：CP01～CP07 的 local truth、safe read、拒绝与 blocked-aware 语义可由有限 contracts、domain、application、infra、api、worker 与 jobs 入口承接；配置、测试、artifact/report 生成路径和 acceptance handoff 路径可执行。它不是一个 host、Runtime、Bus、image 或外部系统的正向集成成果。

2. **哪些需求编号必须覆盖？**

   P0 实施计划必须覆盖 `C-L2M-1~5`、`FR-L2M-001~012` 的 member-local / negative / blocked-aware 部分、相应 `BR-L2M-001~030`、`NFR-L2M-001~016`、`AC-L2M-001~033` 与 `VF-L2M-001~009`。`FR-L2M-E01~E03` 是可裁剪的外围增强，不得被借机变成 P0 前置条件。

3. **哪些详细设计章节必须落地？**

   后续实施必须按需回读 `03` §3～§16：Rust 与依赖分类、七模块、对象/Port/protocol、flow/state、logical Store/UoW/idempotency、error/recovery、config binding、observability 和 test cuts。`03` §17 的开放项进入 blocker，而不是让实现者补写 schema、helper 或 physical product。

4. **哪些验收项必须在本轮可判定？**

   P0 需要形成让 `AC-L2M-001~033` 和 `VF-L2M-001~009` 由真实 artifact/report 进行未来判定的实现、测试和报告路径。当前仅定义该路径；没有 fixed run、artifact/report pair、review 和风险接受时，不能将任何 AC/VF 写为通过或不通过。

5. **哪些能力明确不在本轮实施？**

   LLM 推理/plan/memory/checkpoint、tool execution/capability registry/external MCP-A2A-API adapter、container lifecycle/image build/sandbox truth、governance/conversation/artifact/identity/observability backend truth、外部 IPC/route/topic/schema、physical Store/UoW product、scheduler/transport/deployment、真正的 cross-owner positive qualification、真实验收裁决均不属于 P0 代码范围。

6. **是否存在 P1/P2 容易被误做进 P0？**

   存在。最危险的是用 real host/Runtime/Bus/image/resolver、durable product、external credential、selected integration、performance/SLO 或 24 个 outbound candidate 的 event materialization 来替代 member-local P0。它们必须保持 P1/P2 或 `blocked`，而非被 fake、static mapping 或 planned text 伪装为 P0 pass。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| 未来 `07` §2 | 尚无统一 scope | phase 可能把外部正向能力误排为本仓代码 | 固定 P0 为 member-local、negative、blocked-aware 路径 |
| `03` 的完整分母 | 34 对象和 `10/16/14/24/5` 很容易被按文件或协议数量横切 | 不能形成可验证增量 | Step 5/6 必须按 CP 纵切与 boundary gate 组织 |
| 24 candidate | 旧材料和普通 event 思维可能诱导创建 publisher/outbox | 越过 `L2M-UP-005`，触发 VETO | P0 仅保留 zero configuration/non-materialization |
| 外部 seam | `L2M-UP-001~008` 尚未闭合 | 正向 host/Runtime/Bus/image/resolver 成果不可判定 | 明确为 P1 selected lane 或 blocker，不是本地 truth |
| DDD gaps | `L2M-DDD-001~007` 与 `scope_supersede_gap` 开放 | 受影响的 durable/receipt/helper/transition 不能 1:1 落码 | 后续 boundary 标记 wait_design/blocked，不能私补 |
| 执行期结论 | 目标实现仓、固定 baseline、run、evidence、verdict 均不存在 | 容易把计划描述误认完成 | 只定义 future delivery and gate，不填写结果 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 最小目标 | 仅由上游文档分散描述 | 固定为 seven-module member-local 可验证路径 | 给 phase 和 boundary 一个共同分母 |
| P0 范围 | 易被理解成全部正向跨仓联调 | local truth、safe exposure、negative/blocked-aware seam | 避免 blocker 被实现端绕过 |
| 协议分母 | 可能被误读为全部 Event 实现 | `10 Command / 16 Query / 14 Consumer / 5 Job` 纳入计划；24 candidate 只纳入非物化检查 | 保护 Core/Bus owner 和 VETO |
| 非范围 | 分散在 00～06 | 明确列为 P1/P2/owner responsibility | 防止 implementation scope creep |
| 验收关系 | 可能被写成当前验收任务 | 固定为生成未来可判定路径 | 防止伪造 evidence/verdict |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 先实现一个“member daemon”或 transport endpoint | 似乎能快速联调 | 预设 IPC/route/lifecycle，违反 owner 边界 | 不采用 |
| 将外部 positive seam 纳入 P0 | 表面覆盖更多系统 | 当前 schema、credential、mapping、route、image contract 均未闭合 | 不采用 |
| P0 先落 member-local truth + refusal/blocked-aware seam | 可验证 owner、状态、UoW、redaction 与依赖纪律 | 不证明外部真实成功 | 采用 |
| 将 24 candidate 提前做 outbox/publisher | 容易复用常见基础设施 | 无 owner schema/route，形成 local shadow Event | 不采用 |
| 将 `FR-L2M-E01~E03` 作为 P0 | 功能看起来完整 | 将可选体验变成核心门禁 | 不采用 |

## 7. 结构化中间产物

### 7.1 实施目标表

| 实施目标 | 主要来源 | 未来完成判定 |
|---|---|---|
| 成立 C1 在场与宿主协作的 member-local 面 | `C-L2M-1`; CP01; `AC-L2M-001/006~008` | 双锚、startup/presence、host material/attempt 与 host acceptance/session/health 分层可测 |
| 成立 C2 入站筛选与受控投递的安全面 | `C-L2M-2`; CP02/03; `AC-L2M-002/009~011` | source/scope/screening 四态、body-free、Runtime submission refusal/attempt 可测 |
| 成立 C3 出站承接与安全发布的本地决定面 | `C-L2M-3`; CP03/04; `AC-L2M-003/012~013` | committed-safe gate、decision、material、attempt/gap 与 delivery/accepted 分层可测 |
| 成立 C4 可回链的 trace/observation 安全面 | `C-L2M-4`; CP05; `AC-L2M-004/014~015` | correlation、append-only、安全观测与 observed/evidence fence 可测 |
| 成立 C5 摘要与能力出口的派生边界 | `C-L2M-5`; CP06/07; `AC-L2M-005/016~017` | committed-only view、freshness/stale/gap/no-write 与 non-authorizing outlet 可测 |
| 保持架构、配置、测试和证据闭环 | `03` §3～§16; `04`; `05`; `06` | Core-only compile、strict config、test/report path、VETO/redaction/dependency gates 可执行 |

### 7.2 P0 实施范围表

| 范围 | 需求 / 设计追溯 | P0 实施口径 | 明确不含 |
|---|---|---|---|
| CP01 presence / host local surface | `FR-L2M-001~003`; `03` CP01 | double anchor、local admission/presence、material/attempt、invalid/blocked outcome | host acceptance、registry、session、health、lifecycle、credential issue |
| CP02 inbound screening | `FR-L2M-004~005`; `03` CP02 | verified scope/source、four-state disposition、safe record、body fence | Bus delivery、policy body、local allowlist、raw body persistence |
| CP03 Runtime mediation | `FR-L2M-006`; `03` CP03 | delivery decision、typed safe context、submission attempt/result link/reception、unknown fence | Runtime run/context/plan/outcome、transport、positive trigger mapping |
| CP04 outbound local boundary | `FR-L2M-007~008`; `03` CP04 | safe source gate、body-free material、decision, attempt/gap and late feedback separation | delivery/downstream accepted/Conversation/Artifact truth、Event materialization |
| CP05 trace / observation | `FR-L2M-009~010`; `03` CP05 | correlation, append-only safe trace, redacted observation posture/attempt/gap | observed/evidence/backend truth、full log |
| CP06 mirror | `FR-L2M-011`; `03` CP06 | owner-specific ref/safe snapshot, purpose/scope/freshness, stale/gap/blocked | foreign truth、authorization/health/registry、generic resolver |
| CP07 read model / outlet boundary | `FR-L2M-012`; `03` CP07 | committed-only summary, safe outlet view, no-write projection behavior | UI/SDK experience、definition body、registry/grant/invocation readiness |
| seven-module architecture | `03` §4～§5 | planned contracts/domain/application/infra/api/worker/jobs dependency direction and finite entry posture | binaries, server, worker loop, scheduler, deployment topology |
| protocol/state/test safety denominator | `03` §7～§15; `05`; `06` | 10 Commands, 16 no-write Queries, 14 Consumer pre-gates, 5 Jobs, 28 state subjects, config/redaction/dependency/evidence path | 24 candidate Event/publisher/outbox/topic/route/retry/DLQ |

### 7.3 P1 / P2 与防误入规则

| 层级 | 内容 | 启用条件 | 防误入规则 |
|---|---|---|---|
| P1 | host, Runtime, Bus, image, resolver, credential, screening, durable-like and outlet positive qualification | 对应 owner exact contract、source baseline、profile、real execution authority 已闭合 | `blocked/not_run/waiting` 不能计入 P0 pass；不借 fake 生成 external success |
| P1 | `FR-L2M-E01~E03` 提供时的只读增强 | 需求保持可选且有安全/owner来源 | 不成为 C1～C5 成立条件，不反写 truth |
| P2 | non-project subject、production capacity/SLO、deep product integration、deployment/ops | 新需求/架构/config authority 与可测阈值 | 不在当前 boundary 建第三主语、SLO 数字、transport 或 runbook |
| hard stop | 24 outbound semantic candidate | `L2M-UP-005` 关闭并给出 member-specific schema/route 前 | 禁止 Event envelope/payload/publisher/outbox/route/topic/retry/DLQ/config key |
| hard stop | current design/implementation baseline | immutable design manifest、target repo and boundary Design Gate 未具备前 | 禁止创建代码、build/test/run/artifact/report/evidence/commit 结论 |

### 7.4 范围防漂移检查

| 检查问题 | P0 合格答案 | 不合格信号 |
|---|---|---|
| 是否属于 member-local fact、safe read 或 conservative seam？ | 是，且能回指 CP/FR/AC/VF | 需要创建 external owner truth、transport 或 product |
| 是否能在当前 boundary 用正式设计 1:1 落码？ | 有对象、carrier、state、Port、Store/UoW、test/acceptance 来源 | 要靠私有 fake map、字符串解析或默认成功补洞 |
| 是否把 blocked status 当成功？ | 否，保留 blocked/waiting/unknown/gap 事实等级 | 使用“模拟成功”“暂时 accepted”“ready”替代 |
| 是否物化 24 candidate？ | 否，仅做 non-materialization boundary check | 出现 event route/topic/outbox/retry/DLQ/publisher |
| 是否扩大到 P1/P2？ | 否，记录 residual/trigger/owner | 以联调、SLO、部署或外部产品作为 P0 进入条件 |

## 8. 回填草稿

> 校准来源：`design-calibration/07_implementation_plan_step_02_scope.md`
>
> 延伸阅读：本文件的“实施目标表”“P0 实施范围表”“P1 / P2 与防误入规则”和“范围防漂移检查”。

未来正式 `07-实施计划.md` §2 应说明：本轮计划的 P0 是把 `L2-member` 的 CP01～CP07 member-local truth、safe read、状态/一致性、redaction、配置、测试与证据生成路径按七模块落实为可验证实施边界，而不是完成 host、Runtime、Bus、image 或外部产品的正向集成。范围覆盖 `C-L2M-1~5`、`FR-L2M-001~012` 的 local/negative/blocked-aware 语义、`NFR-L2M-001~016`、`AC-L2M-001~033` 和 `VF-L2M-001~009`；协议分母为 10 Command、16 Query、14 Consumer、5 Job 和 28 状态主语。24 个 outbound semantic candidate 在 `L2M-UP-005` 关闭前始终是 zero configuration/non-materialization。

`FR-L2M-E01~E03`、owner contract 闭合后的 positive qualification、真实 durable product、production SLO/capacity、non-project subject、外部 adapter/transport、deployment/ops 和真实验收结论不属于 P0。P1/P2 缺失不能被 fake、planned 文本或 blocked/not_run 伪装成 P0 pass；所有无法 1:1 落码的 boundary 必须暂停并回写 owning design source。

## 9. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| immutable design baseline 如何固定 | 所有 boundary Design Gate | Step 3/11/12 定义 gate；当前仍 blocker |
| 目标实现仓何时、以何种授权创建 | 所有代码/构建/测试 | `L2M-DDD-001`；不在本设计仓创建 |
| physical Store/UoW 选型 | durable/crash/performance lane | `L2M-DDD-002`；不在 07 选产品 |
| CP04～CP07 helper/receipt/scope successor 缺口 | 若干 positive boundary | 保持 blocked/wait_design，不弱化为普通风险 |
| owner contracts 与 workload/SLO | P1/P2 qualification | Step 8/9 固定 owner、trigger 和 residual，不发明合同或阈值 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 最小 P0 目标明确 | 通过 | member-local + safe + blocked-aware implementation path |
| 需求、设计、测试、验收追溯明确 | 通过 | C/FR/NFR/AC/VF、CP、模块和协议分母均有入口 |
| 非范围与 P1/P2 边界明确 | 通过 | external positive、product、SLO、deployment、真实 verdict 后置 |
| 24 candidate 防误入规则明确 | 通过 | 保持 zero configuration/non-materialization |
| blocker 未被弱化 | 通过 | `L2M-UP-*`、`L2M-DDD-*` 和 scope gap 继续开放 |
| 可进入 Step 3 | 通过 | 下一步只收稳前置条件、阅读清单和 implementation-ledger 规则 |
