# Step 4. 制定测试策略与分层

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 4
> 回填章节：`projects/L2-member/05-测试方案.md` §4「测试策略与分层」
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_04_strategy_layers.md`
> 本文只定义 planned 测试发现层级，不表示测试框架、环境、脚本、执行结果或 release readiness 已存在。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 4：制定测试策略与分层 |
| 当前状态 | `completed / pass_with_explicit_blockers / stop_review` |
| 输入基线 | Step 3 测试对象与切口；`03-详细设计.md` 模块 / flow / state / consistency；`04-配置设计.md` 配置承接 |
| 输出文件 | `projects/L2-member/design-calibration/05_test_plan_step_04_strategy_layers.md` |
| 回填位置 | 正式 `05-测试方案.md` §4（Step 15） |
| 停审方式 | 分层图、切口映射和阻断口径完成后停审；按“完成全部 05”授权继续 Step 5 |

## 2. 本步目标

决定 Step 3 每类风险应在哪一层最早被发现，避免把字段、不变量、UoW、no-write、redaction 和 dependency boundary 全部推到 E2E。分层服务于风险定位，不用于宣称某测试环境已经可用。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| `05_test_plan_step_03_test_objects_cuts.md` | 提供七模块、协议、状态、一致性、配置和观测切口 |
| `03-详细设计.md` §5~§8 | 固定模块依赖方向、named service 与 entry / flow owner |
| `03-详细设计.md` §9~§12 | 固定状态、事务、错误、并发、重放与恢复行为 |
| `03-详细设计.md` §13~§15 | 固定配置、外部 seam、观测和 redaction 边界 |
| `04-配置设计.md` §6~§12 | 固定四个 P0 profile、strict validation、slot posture 和 fake / blocked parity |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些问题必须在 unit 层发现？ | public DTO / enum / required field、双锚、canonical digest include/exclude、domain factory / policy / state helper、非法和 reserved edge、config typed validation、safe reason 与 low-cardinality label 规则。 |
| 哪些问题必须在 service 层验证？ | 九个 named service 的有限路由、Command / Consumer / Job fresh-path ordering、UoW、idempotency、typed result / receipt / report、Query no-write、错误映射和 cross-owner fence。 |
| 哪些问题依赖 Store / adapter / worker 集成测试？ | expected-version CAS、append-only、rollback、missing carrier、in-flight / commit-unknown、owner resolver / handoff failure、worker source/schema/body/dedup、Job per-item isolation、builder slot availability。当前使用 deterministic fake / controlled seam。 |
| 哪些问题需要 API / contract test？ | 10 Command / 16 Query 的 name-body 配对、metadata / actor / subject gate、typed response、unsupported carrier、safe error；14 Consumer 和 5 Job 的 logical envelope / result contract。 |
| 哪些场景才需要 E2E / release gate？ | 只对已经在低层通过的 P0 local flow、blocked-aware external seam、redaction、dependency classification、report真实性做组合门禁。真实 host / Runtime / Bus / image / resolver 正向 E2E 在合同闭合前不得运行或伪 pass。 |

## 5. 当前文档问题诊断

| 问题 | 处理 |
|---|---|
| 旧 05 把事件链和多下游一致性直接放到 integration / E2E | 以 unit → service → fake integration → entry → release gate 逐层发现风险 |
| 外部 owner contract 未闭合 | E2E 只保留 blocked / selected-run 槽位，不用 fake success 代替 |
| 24 candidate 易被放进 event-chain suite | 只进入 static non-materialization / dependency boundary 检查 |
| Query / projection 容易混测 | Query no-write 在 service 与 entry 层重复断言；rebuild 只由 committed-fact Consumer / Job 测 |
| Store 未选物理产品 | P0 以 logical fake parity 为准；durable-like / product qualification 属 P1 |

## 6. 改动前后对比

| 项 | 旧姿态 | 当前策略 | 原因 |
|---|---|---|---|
| 测试分层 | unit / integration / event / E2E 粗分 | contract/unit、domain、service、fake integration、entry、release gate | 与七模块和风险发现点一致 |
| 外部集成 | staging 默认可用 | blocker-aware selected-run；不可用不能伪 pass | 上游合同仍 pending |
| 高风险边界 | 多在 E2E 验证 | 双锚、body-free、no-write、UoW、replay、redaction 前移 | 更早定位、减少模糊失败 |
| 证据 | 由 E2E 日志笼统提供 | 各层产生候选 raw result，Step 13 再绑定正式 EV | 防止静态造证据 |

## 7. 测试设计取舍

| 议题 | 结论 | 取舍 |
|---|---|---|
| 是否追求传统金字塔数量比例 | 不固定数量比例 | 本项目以 owner / truth / side-effect 风险决定层级 |
| fake 是否算集成成功 | 只算 local contract / parity | 不证明真实 DB、Bus、Runtime、host 或 resolver |
| release gate 是否要求全外部 E2E | 当前不要求正向外部 E2E | blocker 未闭合；只做 local smoke、negative seam 和报告完整性 |
| state / UoW 是否只测 service | domain helper 与 service orchestration 两层都测 | 前者证明合法迁移，后者证明持久化顺序和回滚 |

## 8. 结构化中间产物

### 8.1 测试分层图：L2-member 风险发现层级

```text
                    [P1 real-like / cross-owner selected-run]
                    [only after exact contracts are closed]
                                  ^
                                  |
                [P0 release gate / local composition smoke]
                [redaction + dependency + report integrity]
                                  ^
                                  |
                  [API / Worker / Job entry contract]
                  [pre-gate + typed result / receipt / report]
                                  ^
                                  |
             [Store / UoW / adapter / builder integration-like]
             [deterministic fake + controlled / blocked seam]
                                  ^
                                  |
                  [Application service / query tests]
                  [flow + replay + no-write + error mapping]
                                  ^
                                  |
               [Contract + domain + config unit tests]
               [field + factory + policy + state + redaction]
```

关键说明：

- 上层不能替代下层：字段、状态、UoW 和 redaction 错误必须在最早可定位层阻断。
- P0 integration-like 使用 deterministic fake / controlled seam，只证明 member-local contract。
- P1 cross-owner selected-run 必须由对应 blocker 关闭后显式启用；`not_run` / `blocked` 不得记为 pass。
- 24 candidate 不进入 event E2E，只进入 static non-materialization 检查。

### 8.2 测试分层表

| 层级 | 目标 | 典型内容 | 执行时机 | 失败处理 |
|---|---|---|---|---|
| Contract / domain / config unit | 尽早发现 schema、不变量、状态、config/redaction 错误 | 34 对象组、28 状态、10/16/14/5 carrier、digest、typed validation | 本地 / PR | P0 阻断 |
| Application service / query | 验证编排和 owner fence | 9 service、UoW、CAS、exact replay、Query no-write、safe error | 本地 / PR / main | P0 阻断 |
| Integration-like fake | 验证 Port / Store / adapter / builder parity | rollback、commit unknown、unavailable / unknown、slot gate、partial item | main / nightly / replay | P0 阻断；P1 real-like unavailable 单独记录 |
| API / Worker / Job entry | 验证 logical boundary | pre-gate、source/schema/body/dedup、result/receipt/report、registry finite | PR / main | P0 阻断 |
| Release gate / local smoke | 验证组合后仍守住红线和证据完整性 | C1~C5 local scenario、VF negative、redaction、dependency、report pairing | release candidate | P0 阻断 |
| P1 real-like selected-run | 资格验证真实 owner / product seam | host、Runtime、Bus、resolver、durable Store、image/pinned entry | 合同关闭后的 selected run | 不可用记 blocked / residual；不得伪 pass |

### 8.3 切口到发现层级映射

| 切口组 | 首要发现层 | 二次保护层 | 不应推迟到 |
|---|---|---|---|
| contracts / metadata / digest / carrier | contract unit | API / worker / jobs entry | E2E |
| domain factory / policy / 28 states | domain unit | service + Store fake | release smoke |
| Command / Consumer / Job UoW / replay | service | fake integration | external E2E |
| 16 Query no-write / visibility / redaction | query service | API entry + instrumentation spy | staging |
| Store version / append / rollback / commit unknown | fake integration | operations replay | physical DB only |
| adapter unavailable / unknown fence | fake integration | release negative seam | real owner only |
| worker source/schema/body/dedup | worker boundary | service + report gate | Bus E2E |
| Job partial / no source repair | job boundary | operations replay | scheduler E2E |
| config / builder / slot posture | config unit + builder | release local smoke | deployment |
| 24 candidate non-materialization | static architecture check | release dependency check | event-chain test |
| logs / metrics / trace / audit / redaction | instrumentation test | release redaction check | backend observability E2E |

### 8.4 P0 / P1 分层资格

| 能力 | P0 可执行姿态 | P1 解锁条件 | 当前状态 |
|---|---|---|---|
| host collaboration | local material / attempt、unavailable / unknown | `L2M-UP-001/006` exact contract | positive qualification blocked |
| Runtime mediation | local decision / attempt、missing mapping / unknown fence | `L2M-UP-003/004` exact entry / result family | positive qualification blocked |
| publication / observation | safe material、attempt / gap、no foreign success | Core / Bus / route / helper gap closed | positive qualification blocked |
| external context mirror | owner-specific fake、stale / blocked / mismatch | resolver owner contract | selected-run blocked |
| image / host assembly | ref availability / waiting only | `L2M-UP-002` release / compatibility | not a P0 execution lane |
| capability outlet | not-available / stale / safe-view boundary | formal safe-view owner binding | positive activation P1 |

## 9. 回填草稿（供正式 §4）

L2-member 采用风险驱动的六层测试策略：contract/domain/config unit、application service/query、integration-like fake、API/Worker/Job entry、P0 release gate/local smoke，以及合同闭合后的 P1 real-like selected-run。字段、双锚、body-free、factory、正式状态和配置校验必须在 unit 层发现；UoW、CAS、typed replay、Query no-write 和错误映射在 service 层发现；Store、adapter、builder、commit-unknown 和 partial isolation 在 deterministic fake 层验证；entry 层验证 pre-gate 与有限协议；release gate 验证 local composition、VF 红线、redaction、dependency 和报告完整性。

真实 host、Runtime、Bus、resolver、image 与 durable Store 的正向资格测试在对应 owner contract 关闭前保持 blocked / not-run，不能由 fake success 替代。24 个 outbound semantic candidate 只做 non-materialization 静态检查，不进入事件链测试。

## 10. 待确认事项

| 待确认项 | 影响 | 处理 |
|---|---|---|
| 真实测试框架、目标仓和命令 | 自动化实现 | 留 Step 9 / 07；当前不选择 |
| durable-like Store / transport 产品 | P1 集成层 | `L2M-DDD-001/002` 关闭后定向补充 |
| host / Runtime / Bus / image / resolver exact contract | P1 E2E | 按 `L2M-UP-*` 解锁，不影响 P0 local strategy |

## 11. 进入下一步条件

- [x] 分层图和分层表覆盖 Step 3 全部 P0 切口。
- [x] 每类风险有首要发现层和失败阻断口径。
- [x] fake、blocked、not-run 与 real-like qualification 明确区分。
- [x] 未生成脚本、执行结果、artifact、report、evidence 或 readiness。

**Step 4 结论：** `completed / pass_with_explicit_blockers / stop_review`。可按用户授权进入 Step 5。
