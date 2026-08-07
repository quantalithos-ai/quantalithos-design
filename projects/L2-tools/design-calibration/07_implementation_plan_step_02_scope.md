# L2-tools 07 实施计划 Step 2：明确实施目标、范围和非范围

## Step 状态

`accepted`

## 本步输入

| 输入 | 来源 | 用途 |
|---|---|---|
| 五核心能力与非目标 | `00-需求文档.md` §2、§7、§9 | 固定本轮最小可交付边界。 |
| 七模块与依赖方向 | `01-架构设计.md` §4、§8 | 约束实现仓模块和依赖。 |
| 41 对象与协议总量 | `02-概要设计.md`、`03-详细设计.md` §5~§8 | 抽取交付物，不复制 schema。 |
| AC/VF/残余口径 | `06-验收标准.md` §5、§9、§13 | 绑定实施门禁和非范围。 |

## SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 最小可交付结果是什么？ | 本地可构造、可持久化、可查询、可重放、可安全交接的 runtime tool contract slice，含 negative/blocked-aware seam。 | `00` 核心闭环；`03` §2、§16。 |
| 必须覆盖哪些需求？ | `C-L2T-*`、`FR-L2T-001~017`、`BR/DR/NFR` 中属于本地 truth、边界、安全、一致性、幂等、观测和配置的 P0 内容；具体 TC/AC 由05/06引用。 | `00` §9~§16。 |
| 哪些能力不应进入 P0？ | 外部 provider positive、production-like、SDK client、marketplace、agent loop、LLM planning、runtime orchestration、Sandbox/Bus/Obs truth。 | `00` §4、`01` §4、`06` §2。 |
| P1/P2 如何处理？ | 规划 seam、stub/fake、条件 gate 和 residual，不因未实现而伪造 pass。 | `05` §2.3、`06` §13。 |

## 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| “工具执行”易被理解为真正运行外部工具 | 会越界到 Sandbox/Runtime。 | 将交付目标命名为行动契约、受理、交接和结果归一化。 |
| P1 外部集成与 P0 本地语义混杂 | denominator 和 release gate 不稳定。 | P0 只要求 local/negative/blocked-aware；positive 单独 conditional。 |
| 需求、详细设计、验收编号粒度不同 | 实施者无法知道完成判定。 | 用 protocol family/TC/AC 映射，不新增需求编号。 |

## 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 实施主轴 | 可能按模块或对象横向实现 | 按可验证能力纵切，基础设施先行 | 每 phase 可独立验证。 |
| 外部 positive | 与本地路径同等处理 | 明确 conditional/blocked_dependency | 维护事实边界。 |
| 测试范围 | “全量测试” | 234 concrete TC、11 P0 suite、11 check 作为可追溯分母 | 可执行、可审计。 |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 先实现全部 external adapter | 端到端看似完整 | 依赖未闭、会诱发伪造 truth | 禁止。 |
| 先实现完整本地语义，再以 controlled seam 接外部 | 可验证且符合 owner 边界 | positive 联调后置 | 采用。 |
| 将 Query/Job 与 mutation 混写 | 代码早期较快 | no-write/no-repair 红线失效 | 禁止。 |

## 结构化中间产物

### 实施目标表

| 目标 ID | 实施目标 | 交付判定 |
|---|---|---|
| OBJ-01 | 稳定 Tool identity/definition/evolution | contract/domain tests、history/CAS/replay closure。 |
| OBJ-02 | 建立 capability binding consumption seam | relation/snapshot/assessment/gap 和 blocked mapping。 |
| OBJ-03 | 建立 canonical invocation/admission | caller-independent DTO、no-execution、idempotent result。 |
| OBJ-04 | 建立 precondition/Sandbox handoff | requirement/auth consumption、Prepared/one-call/unknown fence。 |
| OBJ-05 | 建立 outcome/audit/safe handoff | atomic pair、body-free material、local submission attempt。 |
| OBJ-06 | 建立 integrity/query/derived views | bounded report、projection watermark、Query zero-write。 |
| OBJ-07 | 建立 inbound/outbound/jobs/entry seam | receipts、continuation、bounded report、no-repair。 |
| OBJ-08 | 建立 config/runtime assembly and release gate tooling | strict config, scripts, 234 TC gate/report contract。 |

### 实施范围表

| 范围 | 来源 | 本轮处理 |
|---|---|---|
| `tools-contracts` public carriers | `03` §4~§7 | P0，按协议 construction closure。 |
| `tools-domain` 六业务组成部分 | `03` §5.3、§9 | P0，纯规则和状态。 |
| `tools-application` services/Ports/UoW | `03` §5.4、§8、§10~§12 | P0，编排与 replay。 |
| `tools-infra` Stores/fakes/config builder | `03` §5.5、§13 | P0 local/deterministic；具体 backend 后置。 |
| `tools-api/worker/jobs` | `03` §5.6~§5.8 | P0 entry contract、consumer、bounded jobs。 |
| gate/report/check scripts | `05` §9、§13；`06` §10 | P0 planned implementation tooling。 |
| external positive adapters | `00`/`03` blocker table | conditional；不计当前 P0 complete。 |

### 非范围表

| 非范围 | owner/处理位置 |
|---|---|
| agent loop、LLM planning、runtime orchestration、retry/recovery/checkpoint | Runtime owner。 |
| capability registry truth、provider inventory、marketplace、MCP/A2A/API registry/client | Hub/adapter/SDK owner。 |
| effective authorization、approval、policy、risk taxonomy | Authorization owner。 |
| Sandbox isolation、run/capture/receipt/cleanup/DLQ | Sandbox owner。 |
| Bus delivery/retry/DLQ 与 Observability store/retention/route | Bus/Observability owner。 |
| SDK wrapper/client、UI、具体 transport/backend/product | SDK/产品/基础设施 owner。 |

## 回填草稿

正式 07 §2 应以 OBJ-01~08 为实施目标；范围限定七 member、本地 truth、受控 seam、测试门禁和交付台账；非范围表中的 owner 能力不得通过实现 convenience 进入 L2。

## 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| 是否启用某个具体 durable backend | infra boundary | PH-02/PH-07 前；未确认使用 fake/port。 |
| external positive 是否进入 qualification | PH-05/08/10 | owner contract 闭口且新 baseline 后。 |

## 进入下一步条件

- [x] 目标、范围和非范围均可追溯。
- [x] P0/P1/P2 分层明确。
- [x] 不存在隐含的 agent/runtime/registry/Sandbox/Obs 合并。
