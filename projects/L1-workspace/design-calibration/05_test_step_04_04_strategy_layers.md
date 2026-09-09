# Step 4. 制定测试策略与分层

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 4  
> 回填章节：`05-测试方案.md` §4

## 1. Step 状态

| 项目 | 结论 |
|---|---|
| 状态 | completed / pass_with_external_slots |
| 输入 | Step3 的 15 个 CUT；03 模块/flow；04 profile |
| 输出 | 测试金字塔、分层责任、CUT 映射、阻断规则 |
| 事实边界 | 分层和执行时机均为 planned；没有 CI 或测试运行事实 |

## 2. 本步目标与输入

目标是让每种风险在最低且最可判定的层级失败，同时保留真实产品接缝的不可替代性。本步不定义 TC/EV、脚本、环境值或 release verdict。

| 输入 | 用途 |
|---|---|
| Step3 §7.1~7.8 | 确保所有 P0 CUT 有首要发现层 |
| 03 §5/§8 | 保持 contracts→domain→application 与 entry/infra 分层 |
| 03 §9~§15 | 分派状态、事务、幂等、恢复、配置、观测风险 |
| 04 §6/§11 | 区分 local/test 与 staging/production，保持 fail-closed |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| Unit 层发现什么？ | typed contract/digest、16 对象工厂和不变量、状态合法/非法迁移、纯 projector、limits 关系、redaction helper。 |
| Service 层发现什么？ | 七 service 编排、六 Query no-write/现时裁剪、两 Command、两 Consumer、四 Operation、duplicate/unknown/error mapping。 |
| Integration 层发现什么？ | store 原子/FK/CAS/unknown、cursor crypto、runtime builder、adapter 故障、entry composition；真实 durable/owner/bus seam 另列 blocked integration。 |
| API/contract 层发现什么？ | 14 个 typed request/response/receipt、required metadata、公共错误映射、hidden 元信息不泄漏。 |
| E2E/release 只做什么？ | 在正式 seam 齐备后验证最小跨仓读取/事件/恢复闭环和 planned evidence 汇总；不替代底层断言，也不测试相邻仓完整生命周期。 |

## 4. 当前材料问题诊断

| 首稿问题 | 影响 | 修正 |
|---|---|---|
| 六层只列名称，未定义风险归属 | 失败难定位 | 为每层给目标、典型断言、执行时机和阻断规则 |
| “integration blocked”混淆 local adapter test | 本地可测内容被一并阻塞 | 分成 controlled integration 与 real-seam integration |
| entry 层没有区分 API/Worker/Jobs | phase/receipt/operation 可能混测 | 三类 entry 保持各自 suite |
| 未说明 E2E 的最小职责 | 容易把 no-write、原子性推给 E2E | 明确底层先行和 E2E 不承担项 |

## 5. 改动前后对比

| 维度 | 之前 | 本步后 |
|---|---|---|
| 风险发现 | 按模块罗列 | 每个 CUT 有主发现层和辅助层 |
| Integration | 单一概念 | controlled local 与 real seam 两层 |
| 失败处理 | 缺失 | P0 local 失败阻断；P0 blocked 不能给 pass |
| E2E | 泛化 | 只做正式 seam 最小闭环和证据汇总 |
| fake | 可被误读为集成 | 只证明本地规则，不能升级 readiness |

## 6. 测试设计取舍

1. Contract/domain 层优先消灭类型、状态和不变量错误；不依赖 DB 或外部服务。
2. Application service 是 no-write、UoW 顺序、duplicate 和 unknown 的首要发现层，使用具名 fake port/write spy。
3. Controlled integration 可以验证实现的 adapter contract，但必须在报告元数据标为 local/controlled，不能冒充 real seam。
4. API/Worker/Jobs 只验证入口解析、映射和隔离，不允许绕过 application 直接写 store。
5. 真正 E2E 必须等待正式 owner query/event/visibility、bus、durable store；缺任一关键 seam 就是 `blocked`，不能用全 fake 闭环替代。

## 7. 结构化中间产物

### 7.1 测试分层图：L1-workspace 测试金字塔

```text
        [Real-seam E2E / release gate]
        owner query/event/visibility + bus + durable store
                    BLOCKED until formal seams
                              ^
                              |
             [API / Worker / Jobs entry]
       14 protocol mappings, receipts, bounded operations
                              ^
                              |
             [Controlled integration]
       store/cursor/config/adapter/composition contracts
                              ^
                              |
              [Application service]
   no-write, current visibility, UoW, idempotency, recovery
                              ^
                              |
              [Contract / Domain unit]
      typed DTO, digest, 16 objects, state, pure projector
```

关键说明：

- 每层只承担其可观察且可归因的风险；上层不替代下层断言。
- controlled fake/adapter 结果只能证明 workspace 局部合同，不能证明 owner 授权、bus replay 或 durable 产品。
- Real-seam E2E 当前受 WS-UP/WS-LOCAL 阻塞；blocked 是测试结论的一部分，不是失败伪装。
- 六 Query 的 no-write 在 service 和 controlled integration 双重验证，不等待 E2E。

### 7.2 测试分层表

| 层级 | 目标 | 典型内容 | 计划执行时机 | P0 失败处理 |
|---|---|---|---|---|
| Contract unit/property | 验证 public/local typed 合同 | DTO roundtrip、metadata、digest、version checked_next、ID/轴不互换、错误映射 | local / PR | 阻断；不得进入上层解释为 adapter 问题 |
| Domain unit/property | 验证 workspace 局部真相 | 16 对象工厂、不变量、纯 projector、状态矩阵、失败 self 不变 | local / PR | 阻断 |
| Application service | 验证七 service flow 与副作用 | Query write spy、Command/Consumer/Operation、CAS、duplicate、unknown、fail-closed | PR / main CI | 阻断 |
| Controlled integration | 验证本地 store/adapter/crypto/config/composition 合同 | snapshot/UoW/FK/故障注入、cursor tamper、runtime builder、redaction capture | main CI / nightly | 阻断本地 P0；不得声称 real seam pass |
| API / Worker / Jobs | 验证 14 入口边界 | handler DTO/error、consumer receipt、不 ACK、operation 单阶段/批 | main CI / nightly | 阻断 |
| Real-seam integration/E2E | 验证正式跨仓最小闭环 | owner safe read/revoke、event ordering/replay、durable restart/unknown、下游 read | staging / release candidate | 未执行或依赖缺失即 blocked；不得形成通过结论 |
| Evidence/release review | 汇总 planned gate 输出供 06 裁决 | artifact/report/redaction/dependency/veto candidate index | release candidate | 缺 P0 真实证据不得进入验收裁决 |

### 7.3 CUT 到首要发现层映射

| CUT | 首要发现层 | 辅助层 | 不能只靠 |
|---|---|---|---|
| CUT-CONTRACT | Contract unit/property | API/Worker/Jobs | E2E |
| CUT-OBJECT | Domain unit/property | service | handler smoke |
| CUT-STATE | Domain unit/property | service/controlled integration | 只测 happy path |
| CUT-SCOPE-VIS | Application service | real-seam integration | historical token/fake allow |
| CUT-QUERY | Application service | API + controlled write audit | E2E 响应检查 |
| CUT-COMMAND | Application service | API + store integration | 单一 handler success |
| CUT-SOURCE | Application service/Worker | real event integration | fake producer success |
| CUT-RECOVERY | Domain + service/Jobs | store/real replay integration | 自动循环 smoke |
| CUT-TRANSACTION | Application service | controlled/durable adapter | domain unit |
| CUT-IDEMPOTENCY | Application service | store integration | HTTP retry观察 |
| CUT-CURSOR | Contract/infra | API read surface | token可解码即通过 |
| CUT-CONFIG | Contract/infra | runtime builder/release | 手工配置审查 |
| CUT-OBSERVE | Unit helper/service capture | artifact redaction review | 只看最终日志样本 |
| CUT-DEPENDENCY | Static architecture check | release review | 人工印象 |
| CUT-RESOURCE | Unit/service | controlled integration/performance later | 无来源性能数字 |

### 7.4 九个计划 suite 的分层职责

| Suite | 层级 | 独占职责 | 明确不承担 |
|---|---|---|---|
| protocol_boundary | Contract | typed schema/digest/version/error/cursor plaintext codec | owner exact schema 正向 |
| local_state_invariants | Domain | 16 对象、状态与纯 projector | port 编排/持久化 |
| query_no_write | Service | 六 Query、现时裁剪、七写方法 spy | 真实 owner authorization 正向 |
| maintenance_consistency | Service | 2 Command+2 Consumer+4 Operation、事务/幂等/unknown | durable transaction proof |
| adapter_contract | Controlled integration | store/cursor/config/adapter/fault | 真实 DB/bus/secret provider |
| read_model_boundary | Composition integration | 模块依赖、read/write capability 隔离 | 跨仓 E2E |
| read_surface | API entry | Command/Query DTO 与安全错误映射 | 业务规则重复实现 |
| consumer_boundary | Worker entry | envelope/receipt/no ACK/no outbound | producer/delivery/replay truth |
| recovery_boundary | Jobs entry | 四 Operation 单次有界调用 | scheduler/无限自动恢复 |

### 7.5 高风险断言的最早发现位置

| 风险 | 最早发现层 | 辅助证明 | 原因 |
|---|---|---|---|
| 非法状态转换/终态复活 | Domain unit | service flow | 不需要 I/O |
| Query 写 local/projection/operation | Service write spy | controlled store audit | 必须精确证明“零调用” |
| visibility 缺失仍泄漏 item/ref/count | Service | API/real seam | safe response 组合可直接断言 |
| Gap 被存为 terminal | Service | store integration | 需检查 carrier 与 record 集合 |
| commit unknown 被当 rollback | Service | durable fault/restart | 先验证分类，再验证产品终局 |
| cutover 与 invalidation 竞争 | Service barrier | durable serialization | 需控制 validate/commit 间屏障 |
| cursor 篡改/错轴接受 | Contract/infra | API | codec 与绑定轴可直接变异 |
| secret/body 泄漏 | helper/service capture | artifact/report scan | 既防规则错，也防真实输出漏 |
| L1 sibling compile dependency | static check | release report | 可重复机器检查，不依赖运行 |

### 7.6 Real-seam E2E 边界

| 最小闭环 | 必需正式 seam | 当前状态 | 不承担 |
|---|---|---|---|
| scope + visibility + materialized/transient read | owner scope/query/visibility | blocked WS-UP-001/003/005 | owner 内部 authorization 测试 |
| owner change→projection→safe read | event schema/order + bus delivery + visibility | blocked WS-UP-002/003/004/007 | producer truth 或 bus ACK 实现 |
| gap→baseline/catch-up→safe cutover | baseline/replay/continuation + durable store | blocked WS-UP-001/002、WS-LOCAL-001 | 任意 offset replay 承诺 |
| local state 写→Inbox/read | scope/attention relation + durable store | blocked 部分 seam | conversation receipt 或 owner unread |
| read/export→下游消费 | stable downstream contract | blocked WS-UP-006 | archive acceptance/package truth |

### 7.7 分层覆盖审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 15 个 P0 CUT 是否都有首要层 | pass；见 §7.3 | 无 |
| 高风险是否全推 E2E | no；状态/no-write/事务/安全均前置 | 无 |
| controlled fake 是否冒充 real integration | no；单独层与禁止项已写明 | 无 |
| 14 入口是否有 entry 层 | pass；API 8、Worker 2、Jobs 4 | 无 |
| Query no-write 是否可精确判定 | pass；service write spy + store audit | 实现仍 planned |
| Real seam 不可用姿态 | explicit blocked | 等 WS-UP/WS-LOCAL |
| 是否发明 outbox/publisher/archive E2E | no | 本仓无 outbound event/outbox/handoff |

## 8. 对 03/04 的影响判定

分层完全承接现有模块、suite 路径和 profile；无新增对象、入口、配置或依赖。若实施无法提供七写方法 spy 或原子故障注入点，应回写 03 的可测性设计；当前仅 planned，不判定缺失。

## 9. 回填草稿

正式 §4 回填测试金字塔、分层表、CUT 映射、suite 职责和 real-seam E2E 边界。不得写“CI 已运行”“release gate 已建立”或任何通过率。

## 10. 待确认事项与进入下一步条件

- 实际 CI 平台、runner、durable product 和正式 staging 均未确定，交 Step8/9 与 WS-LOCAL。
- Step3 全部 P0 CUT 已有首要发现层；失败阻断和 external blocked 姿态明确。
- Step4 通过，允许进入 Step5 建立双向追溯矩阵。
