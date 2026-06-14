# Step 2. 明确实施目标、范围和非范围

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 2
> 回填章节: `07-实施计划.md` §2 实施目标与范围

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 2 明确实施目标、范围和非范围 |
| 当前状态 | 已完成,按用户授权自动进入后续 Step |
| 输入基线 | Step 1 输入边界、新版 `00/03/06`、`03_ddd_step_02_scope.md`、`03_ddd_step_17_implementation_handoff.md` |
| 输出文件 | `projects/L1-identity/design-calibration/07_implementation_plan_step_02_scope.md` |
| 正式文档状态 | 本 Step 不修改正式 `07-实施计划.md` |
| 停审方式 | 自动停审:范围不新增设计真相、不提前定义 phase / commit boundary |

## 2. 本步目标

明确本轮实施计划要交付什么、不交付什么,以及哪些需求、详细设计契约和验收项属于本轮覆盖范围。

本 Step 只回答:

- 本轮实现的最小可交付结果是什么。
- 哪些需求编号、设计契约和验收项必须覆盖。
- 哪些能力明确不进入本轮 P0 实施。
- 哪些 P1 / P2 或真实产品能力容易被误写进 P0。

本 Step 不定义实施阶段、提交边界、代码批次、测试命令、具体证据 run、仓库真实状态或正式 `07` 正文。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `07_implementation_plan_step_01_input_boundary.md` | 已完成 | 固定新版 `00~06` 为实施计划输入,旧 `07` 只作历史诊断 |
| `00-需求文档.md` | 新版输入 | 提供 C-ID、FR-ID、BR-ID、NFR-ID、AC-ID、VETO-ID 和需求非范围 |
| `03-详细设计.md` | Step 19 final self-check 已完成 | 提供实现契约直接范围和下游承接口径 |
| `03_ddd_step_02_scope.md` | 已审核通过 | 提供详细设计 P0 实现范围、非范围和实现者可完成范围 |
| `03_ddd_step_17_implementation_handoff.md` | 已完成 | 提供可实施契约 inventory 和 `07` 不得补设计的红线 |
| `06-验收标准.md` | 已审核通过 | 提供 P0 验收范围、P1/P2 residual、AC/VETO 和 evidence 裁决边界 |
| `实施计划讨论流程_SOP.md` Step 2 | 流程标准 | 决定目标、范围、非范围的输出要求 |
| `实施计划书写规范.md` §一~§三 | 书写标准 | 决定正式 `07` 的目标 / 范围章节边界 |

## 4. 模块计划 / 模块目录

| 模块 | 目标 | 输入 | 输出 | 停审门禁 |
|---|---|---|---|---|
| M1 最小可交付目标 | 明确本轮实现完成后最小成立的系统能力 | `00` C-ID/FR、`03` 实现范围、`06` 验收目标 | 实施目标表 | 不新增需求;不把 P1/P2 写成 P0 |
| M2 实施范围 | 把需求、详细设计契约和验收范围转为本轮实施范围 | `00` §7~§14、`03` §2、`06` §2 | 实施范围表 | 每项可回指来源编号或正式契约族 |
| M3 非范围 | 明确不由本轮 P0 实现交付的能力 | `00` 非目标 / 业务边界、`03` 非范围、`06` P1/P2 | 非范围表 | 非范围必须显式写出,不得用“后续再看”代替 |
| M4 优先级与误入风险 | 防止真实产品、UI、容量、外部正文和相邻 truth 被误做进 P0 | `06` §2 / §13、`00` VETO、`03` handoff | P0/P1/P2 边界表和误入风险表 | VETO 不能风险接受;P1/P2 不得替代 P0 evidence |
| M5 回填与影响判定 | 形成正式 `07` §2 的回填草稿和下游影响 | 本 Step M1~M4 | 回填草稿、影响判定、进入下一步条件 | 不提前定义 phase、boundary、BATCH 或 GATE 编号 |

### 4.1 模块停审记录

| 模块 | 结论 | 说明 |
|---|---|---|
| M1 | 通过 | 目标来自 C-ID、FR、`03` 实现范围和 `06` 验收目标 |
| M2 | 通过 | 范围项均可追溯到需求、详细设计契约或验收范围 |
| M3 | 通过 | 非范围显式列出,未把外部 truth / body / UI / production 能力写成 P0 |
| M4 | 通过 | P1/P2 和真实产品能力保留为 residual / selected-run,不污染 P0 |
| M5 | 通过 | 回填草稿只写目标与范围,不写实施阶段和提交边界 |

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本轮实施的最小可交付结果是什么? | 交付一个可按正式契约实现、测试和验收的 identity P0 主干:身份锚定、生命周期、角色能力摘要、生涯和 memory refs、消费追溯、派生维护、对外传播和外部交接均具备 contracts/domain/application/infra/entry/job/report 的可验证实现路径。 |
| 哪些需求编号必须覆盖? | 必须覆盖 C-ID-1~C-ID-5、FR-ID-001~014、BR-ID-001~015、NFR-ID-001~009、AC-ID-001~015 和 VETO-ID-001~006。实施计划后续 Step 只安排其落地顺序,不重写这些编号含义。 |
| 哪些详细设计章节必须落地? | 必须承接 `03` 的实现约束、文件布局、模块契约、对象契约、port / adapter、protocol、flow、state、persistence、error、idempotency、config binding、observability、test cuts 和 implementation handoff。字段级细节以对应 `03_ddd_step_*` 校准文件为开工阅读来源。 |
| 哪些验收项必须在本轮可判定? | `06` §5~§11 的 P0 功能、边界、接口同步、状态事务、非功能、证据和 VETO 门禁必须可判定。尤其是 AC/VETO、P0 blocking suite、run-scoped evidence、redaction、dependency boundary、query no-write、job no-repair 和 stored replay。 |
| 哪些能力明确不在本轮实施? | 登录 / 认证实现、相邻仓 truth 或外部正文、UI / dashboard、真实产品端到端、production capacity、自动修复相邻 truth、完整运维 runbook 不进入 P0 实施范围。 |
| 是否存在 P1 / P2 能力容易被误做进 P0? | 存在。真实 DB / bus / archive / metric provider、production-like capacity、advanced employee homepage、真实相邻仓完整消费体验和 selected-run 能力均容易误入 P0。Step 2 将其固定为 P1/P2 或 residual,不得替代 P0 fake/controlled/replay evidence。 |

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `07-实施计划.md` | 旧草案把旧入口、旧阶段和技术 Spike 混成实施范围 | 不继承;本 Step 重新从新版 `00/03/06` 抽取范围 |
| `03` 正文 | 字段级契约保留在校准文件,正式摘要不是完整实现输入 | Step 3 必须形成阶段阅读矩阵;Step 2 只定范围 |
| `06` 验收范围 | P0 / P1 / P2 和 residual 已分层,但实施计划尚未转成实施范围 | 本 Step 固定 P0 为本轮主干,P1/P2 不进入 P0 |
| 需求非范围 | 外部正文、相邻 truth、认证、UI、生产容量容易被实施阶段自然膨胀 | 本 Step 显式列非范围和误入风险 |
| phase / commit boundary | 尚未定义 | 留给 Step 5~6,本 Step 不提前拆 |

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 实施目标 | 旧 `07` 以旧版本主干和旧阶段表达 | 以新版 C-ID、FR、`03` 契约和 `06` 验收目标表达 | 防止旧口径回流 |
| 实施范围 | 旧草案偏开发任务 / Spike | 明确 P0 覆盖 8 类能力、6 Command、14 Query、5 Consumer/Callback、10 Outbound、6 Job 和横切一致性 | 与新版 `03/06` 对齐 |
| 非范围 | 旧草案对真实产品和 P1/P2 边界不够清楚 | 明确认证、相邻 truth、外部正文、UI、真实产品、容量和 remediation 非 P0 | 防止实施自然膨胀 |
| 验收边界 | 旧草案不以新版 AC/VETO 为主线 | 明确 AC-ID-001~015 / VETO-ID-001~006 必须可判定 | 实施计划服务验收,不替代验收 |
| 后续拆分 | 旧草案直接进入阶段 | 当前只定范围,phase / boundary 留给 Step 5~6 | 保持 SOP Step 粒度 |

## 8. 设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| P0 是否只做最小身份锚点 | A. 只做 create/read anchor;B. 覆盖完整 C-ID-1~C-ID-5 P0 主干 | 采用 B。`00/06` 均要求生命周期、角色能力、生涯 memory refs、消费追溯和维护对账闭环 |
| Query / Job 是否后移 | A. 后移到 P1;B. 作为 P0 正式 surface | 采用 B。`03/06` 已把 query no-write、job report-only、duplicate replay 和 outbox/handoff 纳入 P0 验收 |
| 真实产品依赖是否作为 P0 | A. 要求真实产品端到端;B. P0 只要求 port / adapter seam 与 fake / controlled / replay evidence | 采用 B。`06` 明确真实产品 selected-run 是 P1 或 residual |
| 是否在本 Step 设计 phase | A. 直接拆 phase;B. 先收范围再进入 Step 5 | 采用 B。phase 需要先完成前置条件和交付物抽取 |
| 是否允许通过实施计划补详细设计缺口 | A. 允许;B. 不允许 | 采用 B。实施计划只承接设计,发现缺口回写 `03/04/05/06` |

## 9. 结构化中间产物

### 9.1 实施目标表

| 目标 | 来源 | 是否本轮实施 | 说明 |
|---|---|---|---|
| 建立平台级成员身份真相主干 | C-ID-1;FR-ID-001~003;AC-ID-001/006 | 是 | 包含显式建立、稳定引用、读取不建档和 ref 不复用 |
| 落地全局生命周期与高风险 basis 边界 | C-ID-2;FR-ID-004~005;AC-ID-002/007;VETO-ID-004 | 是 | 生命周期显式迁移,非法迁移拒绝,高风险处置缺依据不 accepted |
| 落地角色能力摘要和来源变化响应 | C-ID-3;FR-ID-006~008;AC-ID-003/008 | 是 | 只保存 safe summary、source refs 和 evidence refs,来源失效不静默污染 |
| 落地生涯记录和 memory / archive refs | C-ID-4;FR-ID-009~011;AC-ID-004/009/010 | 是 | career append-only,memory/archive 只保存引用和状态 |
| 落地身份事实消费、追溯和对账 | C-ID-5;FR-ID-012~014;AC-ID-005 | 是 | query、trace/audit、projection、reference、reconciliation 和 report-only job 支撑消费和追溯 |
| 落地正式协议 surface | `03` protocol;`06` §7 | 是 | 覆盖 6 Command、14 Query、5 Inbound/Callback、10 Outbound、6 Operations Job |
| 落地状态、事务、幂等和 replay 语义 | `03` state / persistence / idempotency;`06` §8 | 是 | accepted path same-UoW,duplicate replay 不重跑 mutation,query no-write,job no-repair |
| 落地证据和报告可生成路径 | `05` evidence;`06` §10 | 是 | 实施需要提供脚本 / artifact / report 产面,以支撑 P0 gate 和 acceptance handoff |

### 9.2 实施范围表

| 类别 | 内容 | 来源 | 是否本轮实施 | 说明 |
|---|---|---|---|---|
| 核心能力 | 身份锚定、生命周期、角色能力、生涯 memory refs、消费追溯 | C-ID-1~C-ID-5 | 是 | P0 主干,不得只做身份目录 |
| 功能需求 | FR-ID-001~014 | `00` §9 | 是 | 后续 phase 只安排落地顺序,不改变需求含义 |
| 业务规则 | BR-ID-001~015 | `00` §10 | 是 | 作为 domain、application、adapter、query、job 和 evidence 红线 |
| 非功能 | NFR-ID-001~009 | `00` §13;`06` §9 | 是 | 当前以 sample、degraded、redaction、traceability、idempotency 和 observability 为主 |
| 验收项 | AC-ID-001~015 | `00` §14;`06` | 是 | 每个 P0 boundary 后续必须能回指 AC 或中间门禁 |
| 一票否决 | VETO-ID-001~006 | `00` §14;`06` §11 | 是 | 任一命中不得通过,不得风险接受 |
| 代码层 | contracts/domain/application/infra/api/worker/jobs | `03` file layout / module contracts | 是 | 具体交付物在 Step 4 抽取 |
| 协议层 | 6 Command、14 Query、5 Consumer/Callback、10 Outbound、6 Job | `03` protocol;`06` §7 | 是 | 不使用旧入口名 |
| 横切一致性 | state、UoW、idempotency、stored replay、visibility、projection、reference、report | `03` Step 10~13;`06` §8 | 是 | 不允许 query 写入或 job 修 truth |
| 配置与外部依赖 | P0 profile、adapter mode、runtime builder、disabled/fake no-success | `04`;`06` §9 | 是 | 真实产品深度集成非 P0 |
| 测试证据 | TC / EV / suite / artifact/report / acceptance reports | `05`;`06` §10 | 是 | 具体门禁在 Step 7 嵌入 boundary |

### 9.3 非范围表

| 非范围 | 来源 | 是否本轮实施 | 当前处理 |
|---|---|---|---|
| 登录、账号、session、credential 校验实现 | `00` 边界;`06` §2.3 | 否 | 只消费可信 actor / context 输入 |
| 授权裁决 truth 或高风险决策系统本体 | `00` / `03` 非范围 | 否 | identity 只消费 basis ref / safe marker |
| Project、WorkItem、ProjectMember truth | BR-ID-011;AC-ID-012 | 否 | 只保存来源引用或生涯记录所需 marker |
| RoleDefinition / CapabilityDefinition 正文和能力评估算法 | BR-ID-007/009 | 否 | 只保存 role/capability safe summary、source ref 和 evidence ref |
| memory 原文、embedding、archive package、artifact body | BR-ID-012;VETO-ID-003 | 否 | 只保存 refs、state、handoff marker 或 issue refs |
| conversation、workspace、UI 展示状态和 advanced dashboard | `06` §2.3 | 否 | P2 或未来产品体验 |
| 真实 DB / bus / archive / metric / external provider 产品端到端 | `06` §2.3 / §13 | 否 | P1 selected-run 或 residual;P0 只验 seam |
| production-like capacity、硬 SLO、压测结论 | `06` §2.3 / §13 | 否 | P0 只要求 duration/count sample 与趋势记录 |
| 自动 remediation 或修复相邻仓 truth | BR-ID-015;VETO-ID-005 | 否 | 只允许 report-only finding 和后续正式能力处理 |
| 部署拓扑、告警阈值、值班 runbook | `03` 非范围 | 否 | 留给运维文档 |

### 9.4 P0 / P1 / P2 边界表

| 优先级 | 本实施计划口径 | 证据 / 验收影响 |
|---|---|---|
| P0 | 必须按正式 `03` 契约实现并能由 `05/06` P0 suite / evidence 裁决 | 任一 P0 gate fail、VETO 命中或 evidence 缺失不得通过 |
| P1 | 真实产品 selected-run、real-like adapter、真实相邻仓深度协作、额外环境 smoke | 不存在时记录 residual,不得替代 P0 pass |
| P2 | UI / dashboard、production-like capacity、advanced analytics、完整产品体验 | 当前只作为后续演进触发,不得伪装为已验收 |

### 9.5 误入 P0 风险表

| 风险 | 误入方式 | 防护口径 |
|---|---|---|
| 真实产品端到端误入 | 把真实 bus/archive/provider 不可用当成 P0 blocker,或用 fake success 假装真实产品通过 | P0 只验 formal port / adapter seam;真实产品为 P1 selected-run |
| UI / dashboard 误入 | 把高级展示页当作身份摘要 P0 交付 | P0 只交付正式 query / view surface 和 evidence;UI 留 P2 |
| 外部正文误入 | 为方便调试保存 method body、memory body、archive body、raw callback body | VETO-ID-003 阻断;只保存 safe summary、refs、markers、issue refs |
| 维护修复误入 | reconciliation 或 job 直接改相邻 truth 或 identity business truth | VETO-ID-005 / job no-repair 阻断;只 report-only |
| 性能硬阈值误入 | 用旧 P95 / SLA 当 P0 pass/fail | P0 只要求 sample / trend;硬阈值后续基线化 |

## 10. 对上游 / 下游文档的影响判定

| 结论 | 是否影响上游 / 下游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 本轮 P0 覆盖 C-ID-1~C-ID-5 和 FR-ID-001~014 | 否 | 承接需求 | 无需回写 |
| 本轮实施范围必须包含 query、consumer/callback、outbound、job 和 evidence / report surface | 否 | 承接 `03/05/06` | 后续 Step 4~7 继续拆 |
| P1/P2 不进入 P0 | 否 | 承接验收边界 | Step 7 / Step 9 继续防误入 |
| 若后续发现某 P0 范围缺正式设计契约 | 是 | 设计闭口缺口 | 回写 `03` 或暂停相关 boundary |
| 若后续发现某 P0 范围缺正式测试 / evidence | 是 | 测试 / 验收闭口缺口 | 回写 `05/06` 或调整 boundary |
| 正式 `07` §2 待回填 | 是 | 下游正式文档装配 | Step 13 统一装配 |

## 11. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_02_scope.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“模块计划 / 模块目录”“结构化中间产物”“对上游 / 下游文档的影响判定”和“待确认事项”小节,了解实施目标、范围和非范围如何从新版 `00/03/06` 收敛。

正式 `07-实施计划.md` §2 应回填:

- 本轮实施目标是把 `L1-identity` 的 P0 identity truth center 主干落成可运行、可测试、可验收的代码与证据产面。
- 本轮 P0 覆盖 C-ID-1~C-ID-5、FR-ID-001~014、BR-ID-001~015、NFR-ID-001~009、AC-ID-001~015 和 VETO-ID-001~006。
- 本轮实施范围包含 contracts/domain/application/infra/api/worker/jobs、6 Command、14 Query、5 Inbound/Callback、10 Outbound、6 Operations Job,以及 state、UoW、idempotency、stored replay、visibility、projection、reference、report、config、redaction、evidence/report 产面。
- 非范围包括登录认证实现、相邻仓 truth、外部正文、UI/dashboard、真实产品端到端、production-like capacity、自动修复相邻 truth 和运维 runbook。
- P1 selected-run、真实产品行为、production capacity 和高级产品体验不得替代 P0 gate 或 evidence。

## 12. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 目标实现仓是否已有部分实现及其基线 | 影响 Step 3 前置条件和 Step 4 交付物抽取 | Step 3 检查 |
| P0 scope 是否会因实现仓已有旧功能而被误缩小 | 影响 Step 5 phase 设计 | Step 4 / Step 5 按正式 `03/06` 重新抽取,不按旧实现决定 |
| P1 selected-run 是否已有环境 | 影响 Step 8 / Step 9 | 当前不影响 P0,后续记录为 optional / residual |
| evidence / report writer 当前是否存在 | 影响 Step 4 / Step 7 | 后续作为交付物抽取和门禁设计 |
| 正式 `07` 仍是旧草案 | 读者可能误用旧范围 | Step 13 重建正式文档 |

## 13. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 本轮实施目标明确 | 通过 | 见 §9.1 |
| 本轮范围明确 | 通过 | 见 §9.2 |
| 非范围显式列出 | 通过 | 见 §9.3 |
| P0/P1/P2 边界明确 | 通过 | 见 §9.4 |
| 未新增上游不存在的需求或设计真相 | 通过 | 本 Step 只承接 `00/03/06` |
| 未提前定义 phase / commit boundary | 通过 | 留给 Step 5~6 |
| 可进入 Step 3 | 通过 | 下一步:收稳前置条件与阅读清单 |
