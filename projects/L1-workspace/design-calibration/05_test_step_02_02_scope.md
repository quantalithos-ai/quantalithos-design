# Step 2. 明确测试目标、范围和非范围

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 2  
> 回填章节：`05-测试方案.md` §2  
> 执行模式：full-restart / single-agent-serial

## 1. Step 状态

| 项目 | 结论 |
|---|---|
| 状态 | completed / pass_with_external_slots |
| 输入基线 | Step1；正式 `00~04`；03 Step16 |
| 本步输出 | 测试目标、P0/P1/P2、范围/非范围、否决映射 |
| 事实边界 | 只设计测试；未实现、未执行、未生成证据 |
| 下一动作 | Step3 抽取测试对象与测试切口 |

## 2. 本步目标与输入

本步只回答“本轮要证明什么、什么必须覆盖、什么不覆盖、缺口由谁承担”，不提前生成用例、环境、脚本、artifact、report、证据或验收结论。

| 输入 | 本步用途 |
|---|---|
| Step1 输入边界 | 固定权威来源、blocked seam 与禁止伪造项 |
| `00-需求文档.md` §4/§7/§9~§16 | 固定 C1~C6、FR-WS-001~010、BR-WS-001~012、NFR、否决条件 |
| `01-架构设计.md` | 固定 read-model owner、依赖类型和 no-write 边界 |
| `02-概要设计.md` | 固定七组件、16 对象、14 入口和关键处理流 |
| `03-详细设计.md` §5~§17、Step16 | 固定协议、状态、事务、错误、恢复、配置、观测和测试发现路径 |
| `04-配置设计.md` §4~§14 | 固定 profile、配置项、secret、fail-fast / blocked 姿态 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| P0 必须证明什么？ | C-WS-1~6 主链、本仓 16 对象、14 入口、七 service、正式状态族、no-write Query、owner 决定现时裁剪、幂等/乱序/gap、事务 unknown、generation 隔离、配置 fail-fast、redaction 和依赖裁剪均可判定。 |
| P1/P2 如何处理？ | P1 是正式 owner/bus/durable-driver/downstream seam 的真实或 real-like 集成；当前受 blocker 影响的正向项仍是 P0 风险但执行状态 `blocked`，不能被降格为 P1。P2 是有正式 workload/baseline 后的量化容量与优化验证。 |
| 哪些能力只测接缝？ | identity/conversation/work/process/governance/artifact 的 safe query/event/ref；L0-bus delivery；SDK/product/sync/archive 的只读消费；L2 runtime/tools 的明确排除。只验证 workspace 侧输入验证、故障姿态、无反写和稳定输出边界。 |
| 非范围残余风险是什么？ | 未闭合 owner schema、visibility、event/replay、durable store、真实 transport、下游 read/export 与 workload baseline 会阻塞正向集成、恢复真实性和量化性能结论；风险分别归 WS-UP/WS-LOCAL 或下游 owner。 |
| 哪些是一票否决？ | workspace 拥有上游 truth/authorization；缺 visibility 默认展示；Query 写任何 source/local state；跳过 gap；stale 冒充 fresh；projection/maintenance/export 反写 owner；fake 或未闭合 seam 被写成通过/readiness；混淆 cursor；混用 generation；保存禁止正文。 |

## 4. 当前材料问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| 03 Step16 是最小切口，不是优先级方案 | 无法直接得出进入/退出门禁 | 收口 P0/P1/P2 与否决关联 |
| owner/bus/durable seam 未闭合 | 正向集成无法诚实执行 | 保留 P0 重要性，执行标 `blocked`，不得 fake proof |
| 04 没有真实 profile 值 | 不可宣称环境可用 | 只测 schema/关系/失效规则；真实装配待实施 |
| 无 workload / measurement baseline | 不可写 P95、吞吐、容量数字 | 量化性能归 P2 pending；P0 只验证有界与不截断语义 |
| 06/07 尚未创建 | 无正式 AC、实施批次或真实证据别名 | 仅预留候选 TC/EV；不声称被验收引用 |

## 5. 改动前后对比

| 首稿问题 | 本步修正 |
|---|---|
| 用“14入口、16对象”笼统代替范围 | 按主链、协议/对象、状态/一致性、安全、配置/观测、依赖接缝分项 |
| 把外部缺口简单写为非范围 | 明确“P0 风险仍在，但正向执行 blocked” |
| 没有说明 P1/P2 不得掩盖 P0 | 固定优先级与执行就绪是两个正交轴 |
| 非范围没有责任人 | 指向 owning domain、L0-bus、durable driver、下游 consumer、workload owner |
| 一票否决只列口号 | 映射到具体范围和未来负向断言 |

## 6. 测试设计取舍

1. 使用“优先级 × 可执行状态”双轴：`P0 planned` 可设计且待实现；`P0 blocked` 是必须证明但缺正式 seam；不得改写成 `P1 optional`。
2. P0 聚焦 workspace-owned truth 和边界红线；不要求相邻仓完整业务生命周期通过。
3. fake 只能验证本地已闭合分类、编排和故障处理；不能构造 owner authorization、正式事件 schema、真实 replay 或 durable transaction 成功证明。
4. Query 的核心通过条件始终包含零写调用与现时 visibility；缓存命中或历史决定不能替代当前裁剪。
5. 当前无数字阈值来源，因此不发明性能目标；资源上限仅按 04 的类型、正数、关系、有界拒绝语义验证。

## 7. 结构化中间产物

### 7.1 测试目标

| 目标 | 设计来源 | P0 判定方向 |
|---|---|---|
| 证明 workspace 仅拥有 read-model/projection/local state | G-WS-001~006；BR-WS-001/011 | 存储、协议和副作用均无 owner truth/body/outbound write |
| 证明可信且可解释的只读视图 | FR-WS-001~003/005/006/010 | principal/scope、provenance、revision、coverage、freshness、availability 可判定 |
| 证明投影维护可恢复且不猜测 | FR-WS-004/009；BR-WS-004~007 | duplicate、late、gap、unknown、replay/rebuild/cutover 均守正式状态与事务 |
| 证明 workspace-only local state | FR-WS-007/008；BR-WS-008/009 | 仅绑定 principal/scope，Inbox 只来自 owner 明示 attention input |
| 证明安全与退化姿态 | BR-WS-003/010；NFR | visibility 不可验证即 fail-closed；stale/partial/blocked/unavailable 不混同 |
| 证明配置、观测和依赖不打穿边界 | BR-WS-012；03 §13~15；04 | strict config、secret/redaction、compile/runtime/event/ref/adapter/fake 分类成立 |

### 7.2 范围与优先级

| 范围项 | 类型 | 优先级 | 执行状态 | 验证目标 | 非目标 / 说明 |
|---|---|---|---|---|---|
| contracts typed key/ref/version/digest/DTO/error | 协议 | P0 | planned | 构造、roundtrip、required field、不同 ID/版本轴不可互换 | 不复制 owner schema |
| 16 个 workspace 局部对象与纯 projector | domain | P0 | planned | 工厂、不变量、不可变字段、合法/非法转换、失败不改 self | 不判断 owner 业务真相 |
| 2 Command、6 Query、2 Consumer、4 Operation | 入口/flow | P0 | planned；外部正向部分 blocked | 每个入口有独立正向、负向、边界、事务/零写断言 | 不合并为万能 dispatcher |
| Coverage/Attention/Rebuild/Generation/Read/Commit/Availability 状态族 | 状态 | P0 | planned | 正式 variant、终态、非法迁移、轴分离 | 不增加状态或别名 |
| local store、UoW、commit resolution、CAS/锁域 | 一致性 | P0 | local orchestration planned；durable positive blocked | 原子可见、同 key replay、异 digest 冲突、unknown 权威查询 | 不指定数据库产品 |
| visibility、scope、owner read、attention | 安全/运行时接缝 | P0 | negative planned；positive blocked | 当前决定优先、缺失/冲突/撤销 fail-closed、no-write | 不测试 owner 内部授权引擎 |
| owner event、cursor、baseline、replay/rebuild | 事件/恢复接缝 | P0 | local classification planned；positive blocked | 幂等、乱序、gap、bounded recovery、generation safety | 不把 fake 当真实 replay |
| Inbox 与 local attention | 局部状态 | P0 | planned；owner attention positive blocked | 读轴按 stream 分离、重复不增 unread、Withdrawn 不泄漏 | 不写 conversation receipt |
| 配置 schema/profile/limits/secret/binding | 配置 | P0 | schema planned；真实 binding blocked | 必填、未知键、关系、fail-fast、no fallback、redaction | 不填部署值/credential |
| 日志/指标/trace/audit 材料 | 观测/安全 | P0 | planned | 白名单、低基数、sink failure 不改业务、无正文/secret | 不验证外部 telemetry 后端 |
| L0-core 编译边界与非 core sibling 排除 | 架构 | P0 | planned；L0-core workspace 类型 pending | 依赖分类、无 L1 path dependency | 不证明外部 crate 已发布 |
| owner/bus/durable adapter 真实或 real-like 集成 | 集成 | P1 | blocked | exact schema、撤销、delivery/replay、重启/隔离/unknown | 不能作为 fake 成功结论 |
| SDK/product/sync/archive 只读消费 | 下游接缝 | P1 | blocked | 只读 revision/provenance/status handoff，无 accepted/archive truth | L4-archive 不反向定义 workspace |
| 量化性能、容量、SLO、长稳与灾难恢复 | 非功能 | P2 | pending baseline | 用正式 workload 与环境验证数值目标 | 当前不发明阈值 |
| 搜索、统计、历史比较、预测 ranking | 外围增强 | P2 | out_of_scope | 后续能力不得改变 owner/read-model 边界 | 当前不设计产品行为 |

### 7.3 P0 / P1 / P2 口径

| 优先级 | 定义 | 当前必须留下的设计输出 |
|---|---|---|
| P0 | 主链、数据所有权、安全与一致性红线；未通过不得宣称 workspace 可用 | 可执行切口/用例候选、精确断言、planned 证据面；缺 seam 时显式 blocked |
| P1 | 真实产品/跨仓接缝对 P0 语义的验证 | integration/staging 计划、依赖前置、failure mapping；不降低 P0 红线 |
| P2 | 依赖 workload/baseline 或属于外围增强的验证 | 触发条件、风险和 owner；无来源数字不得进入 gate |

### 7.4 只测接缝、不测完整实现

| 外部方 | workspace 侧验证 | 不验证 | 残余风险 owner |
|---|---|---|---|
| L1 identity/work/conversation/process/governance/artifact | safe ref/query/event/visibility 输入校验、故障姿态、provenance | 正文、内部状态机、业务命令、授权实现 | 各 owning domain；WS-UP-001/003~005 |
| L0-bus | envelope 入口、去重键、cursor/gap、无 ACK truth | producer 正确性、delivery truth、正式 replay executor | L0-bus / event owner；WS-UP-002 |
| durable store/secret/transport | adapter contract、故障映射、no fallback | 产品级隔离、重启、密钥轮换、实际 endpoint | 本仓实施/ADR；WS-LOCAL-001~003 |
| SDK/product/sync | 稳定只读 DTO/ref/revision/status 边界 | UI、client cache、sync 私有状态 | 下游 owner；WS-UP-006 |
| L4-archive | 只读消费边界、不产生 handoff/accepted truth | package、freeze、restore、archive truth | L4-archive；WS-UP-006 |
| L2 runtime/tools/member 系列 | 明确无 execution/tool/sandbox/member truth 合并 | 其内部运行与成员生命周期 | 各 L2 owner / WS-UP-008 |

### 7.5 一票否决关联

| 否决风险 | P0 承接范围 | 必须形成的断言方向 |
|---|---|---|
| workspace 拥有上游 truth/authorization | domain/store/protocol/dependency | 只能保存安全 ref/snapshot/decision binding；无本地 allow truth |
| visibility 缺失默认展示 | 六 Query、source read、export | 缺失/冲突/撤销整体或分区 fail-closed，且不泄漏 ref/count |
| Query 产生写副作用 | 六 Query | `WorkspaceAtomicStore` 七写方法调用总数为 0；不初始化/刷新/推进 cursor |
| 静默跳 gap 或猜版本 | Consumer/recovery/Coverage | gap 不占 terminal key；无 bridge 不 advance/Complete |
| stale 冒充 fresh/complete | read view/page/status | freshness、coverage、availability 分轴；超限不得截断成 Complete |
| projection/maintenance/export 反写 owner | application/ports/worker/jobs | 无 outbound event/outbox/owner mutation/archive handoff |
| fake/缺口伪成功 | adapter/env/gate/report | blocked 保持 blocked；fake 证据不能升级 integration/readiness |
| cursor 或 generation 混轴 | state/token/recovery | source/view/read cursor 不互换；candidate/current 不混读、不越过 safety |
| 禁止正文或 secret 泄漏 | store/DTO/log/trace/report | raw body、credential、secret value 不可出现；只允许 safe ref/redacted field |

### 7.6 非范围与残余风险

| 非范围 | 原因 | 风险 | 归属 / 后续处置 |
|---|---|---|---|
| 相邻仓完整生命周期和授权引擎 | workspace 非 owner | safe seam 与真实行为可能不一致 | owning domain；P1 blocked integration |
| bus producer/delivery/replay 实现 | delivery truth 属于 L0-bus/owner | gap/replay 正向闭环未证明 | WS-UP-002；P1 |
| durable store 与实际 secret/transport 产品 | 产品与 ADR 未锁定 | transaction unknown、重启隔离、crypto binding 未证明 | WS-LOCAL-001~003；P1 |
| 下游产品、sync、archive 完整流程 | 仅是消费者 | read/export 兼容性未证明 | WS-UP-006；P1，archive 串行 |
| 性能硬阈值、容量和保留期 | 无 workload/measurement baseline | 无法做发布量化裁决 | baseline owner；P2 pending |
| UI、SDK cache、通知、execution/tools/sandbox | 明确仓外 | 产品体验或执行接入另行验证 | 相应 owner；不扩张本仓 |

## 8. 对 03/04 的影响判定

| 结论 | 是否需回写 | 处理 |
|---|---|---|
| 范围完整承接 03 Step16 | 否 | 后续拆为切口与用例 |
| P0 blocked 与优先级双轴 | 否 | 是测试计划事实，不改变设计语义 |
| 无量化阈值 | 否 | 保持 00/04 pending，不新增配置值 |
| 后续若对象/入口无法构造精确断言 | 是 | 停止并回写 owning 03/04；不得在05补协议 |
| 当前发现新增 owner blocker | 否 | 既有 WS-UP/WS-LOCAL 足以描述；无跨项目写入 |

## 9. 回填草稿

正式 §2 应包含测试目标、范围/优先级表、双轴口径、接缝非范围、否决映射。所有条目保持 `planned/blocked/pending` 事实，不写通过率、run_id、evidence alias、verdict 或 readiness。

## 10. 待确认事项与进入下一步条件

- WS-UP-001~008、WS-UP-006-S、WS-LOCAL-001~003 均保持开放。
- 无新增上游 blocker；无权跨项目回写。
- P0/P1/P2、非范围、风险归属和一票否决已收稳；Step2 通过，允许进入 Step3。
