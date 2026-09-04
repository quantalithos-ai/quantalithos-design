# Step 4. 制定测试策略与分层

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 4
> 回填章节：`05-测试方案.md` §4

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 4 测试策略与分层 |
| 当前状态 | `completed / pass_with_upstream_blockers` |
| 原则 | 按风险发现位置分层，不把高风险全部推给 E2E |
| 停审结论 | 五层测试策略可覆盖 Step 3 P0 切口 |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| Unit 层发现什么？ | DTO / ref / metadata、domain invariant、state transition、digest、config parser、redaction helper、低基数标签等纯契约。 |
| Service 层发现什么？ | Command UoW 顺序、Query no-write、Consumer receipt / marker、Job report / no-truth-repair、duplicate replay 和 error mapping。 |
| Integration 层发现什么？ | logical repository、revision、rollback、outbox/material、projection cursor、fake/controlled adapter failure、runtime builder。 |
| API / Worker / Job 层发现什么？ | 入口解析、transport-neutral disposition、unsupported version、worker receipt、outbox publisher、单项 job runner。 |
| E2E / Release gate 做什么？ | 最小跨入口宿主控制面 smoke、profile 装配、redaction、dependency、artifact/report 完整性；不替代底层断言。 |

## 3. 测试分层图

#### 测试分层图：L2-member-service 测试金字塔

```text
[Release gate / evidence summary]
  - minimal host-control smoke
  - profile / redaction / dependency / report checks
                ^
[API / Worker / Job entry]
  - command/query mapping
  - consumer/publisher/job disposition
                ^
[Integration with fake / controlled seams]
  - logical stores / UoW / revision / rollback
  - member/images/runtime/sandbox/carrier failure markers
                ^
[Application service]
  - command orchestration / query no-write
  - consumer receipt / job report / idempotency
                ^
[Unit / Contract]
  - refs / DTO / domain states / config / redaction
```

关键说明：

- 底层优先发现字段、状态、写集和边界错误。
- E2E 只证明最小闭环的入口拼装，不代表 sibling 正向合同已闭合。
- `integration-like` 的 controlled seam 结果只能证明 failure mapping 和接缝语义。

## 4. 测试分层表

| 层级 | 目标 | 典型内容 | 执行时机 | 失败处理 |
|---|---|---|---|---|
| Unit / Contract | schema、ref、状态和纯规则 | DTO roundtrip、required metadata、domain factory、state matrix、config parser、redaction | PR / local / CI fast | P0 阻断 |
| Application service | 编排和写集 | 10 Command、6 Query、5 Consumer、idempotency、UoW、Job report | PR / CI service | P0 阻断 |
| Integration fake / controlled | store / adapter / builder 语义 | revision、rollback、material/outbox、projection、failure injection | CI integration / replay | P0 阻断；P1 缺口记录 |
| API / Worker / Job | 入口和异步 disposition | handler、consumer、publisher、7 job runner | CI entry / nightly | P0 阻断 |
| E2E / Release gate | 最小闭环及证据汇总 | host intent→decision→qualification→safe query/material、profile/redaction/dependency | release candidate | P0 阻断送验 |

## 5. 切口到层级映射

| 切口 | 主层级 | 辅助层级 | P0 失败是否阻断 |
|---|---|---|---|
| contracts / domain / state | Unit / Contract | service | 是 |
| command / query / consumer orchestration | Application service | API / worker | 是 |
| material / outbox / job | Integration / runner | worker / release | 是 |
| consistency / idempotency / recovery | Application + integration | replay | 是 |
| config / redaction | Unit + builder | release artifact scan | 是 |
| dependency boundary | Architecture check | release evidence | 是 |
| real-like sibling seam | controlled integration | selected release run | 否，除非后续升为 P0 |

## 6. 高风险断言最早发现层级

| 高风险断言 | 最早层级 | 不应只靠 | 原因 |
|---|---|---|---|
| 非法状态迁移被接受 | Unit | E2E | domain matrix 可直接判定 |
| accepted command 漏 history/material/result | Service | E2E | 需要检查 UoW 写集顺序 |
| Query 修改 projection / source | Service + write audit | E2E | 需要观察无写副作用 |
| duplicate 从 current truth 重算 | Service | API smoke | 需要控制 stored result 缺失 |
| old generation 覆盖 current | Service + integration | E2E | 需要 generation fixture |
| adapter `Ok` 冒充 external completion | Integration fake | release | 需要注入 unknown |
| raw body/secret 泄漏 | Unit + artifact scan | 人工抽查 | 输出面必须自动扫描 |
| 非 Core sibling compile dependency | architecture check | E2E | 依赖图是静态风险 |

## 7. E2E / Release Gate 使用边界

| 场景 | 是否进入 | 只证明什么 | 不承担 |
|---|---|---|---|
| minimal host-control smoke | 是 | 入口组合与本地 safe material 流 | 不替代每个 command case |
| profile matrix smoke | 是 | P0 profile 可装配 / invalid fail-fast | 不替代 parser unit |
| redaction artifact scan | 是 | 实际输出面无 forbidden body | 不替代 helper unit |
| dependency boundary scan | 是 | compile seam 裁剪可留证 | 不替代设计审查 |
| full cross-repo E2E | P1/P2 | 真实协作差异 | 不作为当前 P0 前置 |

## 8. 设计取舍与进入条件

| 方案 | 结论 | 理由 |
|---|---|---|
| 所有风险推给 E2E | 不采用 | 难定位且无法证明 no-write / no-truth-repair |
| 只做单测 | 不采用 | 无法覆盖 UoW、adapter、入口、报告和证据链 |
| 五层分层 | 采用 | 与风险位置、L1-governance 粒度和 `03` test cuts 对齐 |

- [x] Step 3 所有 P0 切口有主发现层级。
- [x] 失败处理和 E2E 边界明确。
- [x] 可进入 Step 5。
