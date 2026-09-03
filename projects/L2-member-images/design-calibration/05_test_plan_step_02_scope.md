# L2-member-images 05 测试方案 Step 2：测试目标、范围与非范围

> 状态：`completed`
> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 2
> 回填位置：正式 `05-测试方案.md` 第 2 章

## 0. Step 状态与输入

| 项目 | 记录 |
|---|---|
| 本步目标 | 把需求/设计输入转换为可判定的 P0、P1、P2 测试范围，并标出一票否决风险。 |
| 本步输入 | Step 1；00 §4/9/10/13/14；01 边界与风险；02 capability/flow；03 §7~§16；04 §6~§14。 |
| 本步输出 | 范围/非范围表、优先级规则、VETO 关联表、下游承接表。 |
| gate_status | `pass_with_explicit_blockers` |

## 1. SOP 问题回答

| 问题 | 收敛回答 |
|---|---|
| 本轮测试要证明什么？ | 本仓 local image definition、static assembly、build/qualification/supply 分阶段 truth、typed protocol、状态/一致性/安全边界可被验证，并能拒绝越界输入。 |
| P0 如何定义？ | 需求核心能力、VETO、正式协议/状态/事务/配置/脱敏契约以及当前可执行的 negative/no-write seam。 |
| P1 如何定义？ | owner 合同闭合后的 controlled/real-like adapter seam；不作为 P0 truth 成立前置。 |
| P2 如何定义？ | production-like、容量/SLO、高级扫描签名、复杂 consumer/product 集成等需新 authority 的扩展。 |
| 哪些内容明确不测？ | member 主体、runtime loop/tool execution、live memory/checkpoint/workspace、container/sandbox backend、Artifact/governance/observability truth、marketplace/product entry。 |

## 2. 范围与非范围表

| 范围项 | 类型 | 优先级 | 验证目标 | 非目标/说明 |
|---|---|---:|---|---|
| definition / mapping ref / variant revision | 功能/对象 | P0 | local definition 不变量、来源引用、非法迁移和历史替代 | 不验证 Role/mapping body |
| baseline / component / seed / static-live boundary | 功能/安全 | P0 | pinned、完整性、静态 seed 与 live state 分离 | 不固化 live memory/workspace |
| build intent/snapshot/attempt/candidate | 状态/协议 | P0 | 字段校验、阶段隔离、unknown/blocked 和 future reopen seam | 当前不宣称真实 builder 成功 |
| provenance/gate/eligibility/Artifact handoff | 资格/边界 | P0 | body-free provenance、门禁结论和 gap 不越 owner | 不创建 scanner/signer/Artifact truth |
| availability/entry/consumer gap | 供给/查询 | P0 | pinned entry、append-only transition、consumer gap 隔离 | 不验证 launch/health/confirmation |
| 10 Command、10 Query、2 inbound、6 Job、0 outbound | 协议 | P0 | protocol DTO、错误、no-write/marker/zero inventory | transport/topic/scheduler 未绑定 |
| UoW/version/idempotency/concurrency/recovery | 一致性 | P0 | duplicate、conflict、rollback、commit-unknown 口径可验证 | B01/B02 未闭时 accepted write 仅 future |
| strict config/profile/redaction | 配置/安全 | P0 | 21 key、来源优先级、startup-only、fail-closed 和 secret no-output | 不绑定 provider/endpoint |
| controlled adapters / durable-like stores | 接缝 | P1 | failure mapping、fake parity、no silent fallback | owner 未闭时不产生正向结果 |
| production capacity/SLO、真实 registry/consumer、复杂扫描 | 非功能/产品 | P2 | 后续演进验证 | 当前无 baseline、阈值或授权 |

## 3. VETO 关联

| VETO/风险 | P0 测试方向 | 当前限制 |
|---|---|---|
| static/live 混同、外部 body 入仓 | body rejection、redaction、seed/live separation | 只断言 body 不进入 local truth/output |
| staged status 冒充 ready | cross-subject negative assertions | `Available/Fresh/Assembled` 不能升格 |
| query/job 修复 truth | query no-write、job no-truth-repair | PF recovery 未闭只保留 blocker |
| fake/ACK 冒充成功 | adapter fake parity、no-fake-fallback | 不填写 Passed/Accepted/digest |
| sibling compile dependency 打穿裁剪 | dependency scan | 当前 active sibling Cargo dependency 为零 |

## 4. 改动前后对比与取舍

旧材料按 persona/toolset/publish 主线列正向 case；本轮改为按 local truth、协议、状态、边界和风险分层。采用 P0 先验证可独立闭合的 pure contract/no-write，P1 只验证受控接缝，P2 仅记录 future trigger；避免为填满范围而伪造外部成功。

## 5. 结构化中间产物与回填草稿

P0 的退出条件必须可由测试套件和固定证据判断；P1/P2 不能成为当前 must-pass。正式 §2 将使用上表，并在每个非范围项注明 owner、原因与残余风险。

## 6. 待确认事项与进入下一步条件

`MI-UP-001/007/009`、`Q-MI-003/004` 和 `DDD-S9-B01/B02` 仍会影响正向 case，但不阻止建立 product-neutral 测试切口。下一步只有在 P0 范围、非范围、VETO 和优先级均可追溯后，才抽取测试对象与切口。
