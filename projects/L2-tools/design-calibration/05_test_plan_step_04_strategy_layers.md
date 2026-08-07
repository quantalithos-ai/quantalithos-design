# L2-tools 05 测试方案 · Step 4 测试策略与分层

> 对应 SOP：`测试方案讨论流程_SOP.md` Step 4「制定测试策略与分层」
>
> 目标回填：`projects/L2-tools/05-测试方案.md` §4

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | 4 / 制定测试策略与分层 |
| 状态 | `accepted_for_step_04 / proceed_to_step_05` |
| 当前模块 | `test_strategy_and_layers` |
| 本步结论 | 风险在最小可判定层发现；跨层测试只验证 seam、契约和组合，不复制下层 oracle；P0层级覆盖完整 |
| 正式文档写入 | 未允许 |
| 下一步 | Step 5：需求追溯与覆盖矩阵 |

## 2. 本步输入

| 输入 | 来源 | 作用 |
|---|---|---|
| 测试对象/切口全集 | `05_test_plan_step_03_test_objects_cuts.md` | 层级映射主表 |
| 模块依赖和入口顺序 | `03` §5、§6、§13 | 禁止越层调用和测试替身边界 |
| flow/state/transaction contracts | `03` §8~§12 | service/integration层断言来源 |
| config/builder lifecycle | `03` §13、`04` §9 | config/assembly层测试位置 |
| 全局依赖类型 | `standards/document/全局项目依赖关系与裁剪规则.md` | compile/runtime/event协作分类 |

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 哪些问题必须在 unit 层发现？ | typed ref/metadata/version/body-free、domain factory/invariant、状态迁移、终态唯一性、四门安全判定、result/error XOR、digest/semantic uniqueness、pure projector。 | `03` §15.1~§15.2、§9、§12 |
| 哪些问题必须在 service 层验证编排？ | CF/QF/IF/OF/JF调用顺序、UoW和StoredResult、Prepared-before-Port、Query no-write、Job bounded/no-repair、error mapping和formal re-entry。 | `03` §5.4、§8、§10、§15 |
| 哪些问题依赖 DB/adapter/worker 集成？ | Store CAS/append/page/watermark、UoW commit tri-state、idempotency claim/replay、fake/durable parity、external Port resolution、worker receipt/phase、projection lifecycle。 | `03` §5.5~§5.8、§10~§13 |
| 哪些问题需要 API/contract test？ | public Command/Query metadata、version/unknown variant、body validation、response/error mapping、worker envelope/source/version/receipt、Job bounded entry。 | `03` §5.6~§5.8、§7 |
| 哪些场景才需要 E2E/release gate？ | 只做最小跨模块闭环：valid local contract -> invocation/admission -> no-execution或local outcome/audit -> safe material attempt；外部正向闭环仅在 blocker closure 后条件启用。 | `03` §15、`00` AC-L2T-001~005 |

## 4. 测试分层图

#### 测试分层图: L2-tools 测试金字塔

```text
                    [E2E / release smoke]
              local truth-first minimal closure
             (conditional external seam only)
                           |
                 [API / Worker / Job contract]
            metadata, envelope, version, receipt,
              bounded scope and response mapping
                           |
                    [Adapter integration]
       Store/CAS/UoW/idempotency + fake/durable parity
             + blocked external Port resolution
                           |
                    [Application service]
       CF/QF/IF/OF/JF order, phase fence, no-write,
                replay, error and recovery mapping
                           |
                       [Domain / contract unit]
      refs, fields, invariants, state transitions, safety,
                canonical digest and redaction predicates
```

关键说明：

- 每一层只断言该层拥有的事实；下层已证明的规则不在高层重复成为新 oracle。
- E2E 不表示对方 provider、Bus delivery、Observed 或 production readiness 已成立。
- 图中的“release smoke”是 planned suite 名称，不是已执行或已通过的结果。

## 5. 分层契约表

| 层级 | 允许依赖 | 目标 | 典型切口 | 执行时机 | 失败处理 |
|---|---|---|---|---|---|
| `L0-contract-unit` | `contracts` public types、pure mappers、deterministic Clock/ID | required field、enum/version、typed ref、body-free roundtrip、safe error | `L2T-MOD-CON-*`、协议构造负向 | PR | P0阻断 |
| `L1-domain-unit` | domain object/policy/state、显式时间/ID | invariant、合法/非法迁移、terminal guard、四门合取、result/error XOR | `L2T-MOD-DOM-*`、`CUT-STATE-*`、`CUT-NC-*` | PR | P0阻断 |
| `L2-service` | fake Store/UoW/Port/Clock/ID、application facade | 编排顺序、UoW、CAS token传递、idempotency/replay、error mapping、no-write | `CF/QF/IF/OF/JF` service cuts、`CUT-TX/ERR` | PR + main CI | P0阻断；未知需保留 |
| `L3-adapter-integration` | Store/Port trait实现、controlled fake或durable candidate | CAS/append/page/watermark、commit known/unknown、fake/durable parity、blocked mapping | `L2T-MOD-INF-*`、`CUT-CONC-*`、`CFG-T/A/F/X` | main CI/nightly | P0阻断；外部不可用标blocked |
| `L4-entry-contract` | api/worker/jobs facade、协议编解码器候选 | metadata/body/version/envelope、source isolation、receipt、bounded job entry、public mapping | `L2T-MOD-API/WRK/JOB-*` | PR + main CI | P0阻断 |
| `L5-cross-module` | 真实模块组合或同语义 controlled harness | DTO→object→service→Store/Port→state→result/audit闭环；registration/no-write | `L2T-MOD-*` cross pairs、`CUT-OBS/CFG` | main CI/nightly | P0阻断 |
| `L6-e2e-smoke` | P0 profile、完整本地 runtime graph；外部依赖仅blocked-aware | 最小工具主链、跨入口一致性、local truth first、safe material | `TG-L2T-001~010`代表样本 | staging-like only when available | release gate planned；当前不执行 |
| `L7-conditional-provider` | owner闭口后的real-like provider/event seam | positive Hub/Auth/Sandbox/Bus/Obs/SDK mapping与版本兼容 | P1 conditional cases | owner闭口后nightly/staging | blocker时`blocked_dependency`，不转pass |

## 6. P0 切口到层级映射

| 切口族 | 首要层级 | 补充层级 | 失败是否阻断 | 原因 |
|---|---|---|---|---|
| contracts/refs/metadata/views/errors | L0 | L4 | 是 | 最早发现第二合同、字段缺失和body泄漏 |
| domain objects/state/safety | L1 | L5 | 是 | 规则必须在无I/O层确定 |
| CF commands | L2 | L3/L5/L6 | 是 | 编排、UoW和副作用阶段由service层拥有 |
| QF queries | L2 | L4/L5 | 是 | no-write/no-Port必须由spy和entry组合验证 |
| IF consumers | L2/L4 | L3/L5 | 是 | claim/receipt和source隔离跨service/entry边界 |
| OF continuations | L2 | L3/L5 | 是 | one-call/unknown fence和phase-2不可只靠unit |
| JF jobs | L2/L4 | L3/L5 | 是 | bounded target、report replay和no-repair需组合验证 |
| stores/UoW/idempotency | L3 | L2 | 是 | durable/fake parity和CAS/commit unknown在adapter层发现 |
| six states/TX/CONC/ERR | L1/L2/L3 | L5 | 是 | 同时覆盖纯规则与存储/并发事实 |
| config/builder/redaction | L1 (validator) | L3/L5/L4 | 是 | validator纯规则、builder原子暴露和entry输出需分层 |
| observability/audit | L1/L2 | L4/L5 | 是 | safe fields和pair规则纯判定，跨模块对账在组合层 |

## 7. E2E / Release Gate 边界

### 7.1 当前最小本地闭环

```text
validated profile
   -> ToolContract / FormalToolDefinition
   -> canonical Invocation + Admission
   -> (Rejected/Unavailable pair OR accepted source -> Outcome/Audit pair)
   -> SafeHandoffEligibility / body-free material
   -> local ExternalSubmissionAttempt disposition
   -> independent Bus/Observation status layer
```

该闭环只证明 L2 本地事实和受控接缝语义；`SubmittedLocally` 不等 `Delivered`，`ObservationMaterialRef` 不等 `Observed`，`Prepared` 不等 provider accepted/run/receipt。

### 7.2 Release smoke 进入条件

| 条件 | 当前状态 | 处理 |
|---|---|---|
| P0 config profile graph可构造且B0~B8无partial exposure | planned | Step 8/9定义验证；未执行 |
| local/deterministic fake仅Local/CI profile | planned | `CFG-A-05`；未执行 |
| 所有P0 service/entry/adapter suites有固定artifact/report契约 | pending | Step 9/13收敛 |
| 外部owner positive seam闭合 | open | 只启用conditional suite；当前不阻断本地设计完成 |
| 真实run/evidence authority和06引用规则成立 | open | 不创建或声称release结果 |

## 8. 失败与重试处理

| 失败位置 | 计划处理 | 是否自动重试 |
|---|---|---:|
| unit/service deterministic assertion | 保留失败输出，阻断对应gate | 否，先修设计/实现 |
| Store/UoW known error | typed failure + rollback/abort断言 | 由用例显式重入，不由gate自动重试 |
| commit outcome unknown | 保留unknown，调用resolve/replay surface | 否，禁止重建current truth |
| external Port unavailable/blocked | `blocked_dependency`或typed unavailable | 否，不升级pass/readiness |
| side-effect call outcome unknown | manual fence + no second call | 否，直到owner确认 |
| flaky/timeout | 标记未判定，生成诊断 | 不自动重试为pass；由缺陷/复验规则处理 |

## 9. 对03的影响判定

| 判定 | 说明 |
|---|---|
| 无回写 | 分层只是测试执行位置和失败处理，不增加实现契约。 |
| 观察项 | 若后续需要某层访问未定义的Store/Port/字段，必须回到03补闭口，不能通过测试helper越界。 |

## 10. 回填草稿（正式05 §4）

> 校准来源：
> - `design-calibration/05_test_plan_step_04_strategy_layers.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“测试分层图”“分层契约表”“P0切口到层级映射”和“E2E/Release Gate边界”。

测试策略采用从契约/领域单元到应用服务、adapter integration、API/worker/job contract、跨模块组合和最小E2E smoke的分层结构。契约字段、typed ref、状态不变量、四门安全判定和redaction在低层发现；Command/Query/Consumer/Continuation/Job的顺序、UoW、幂等、no-write和error mapping在service层发现；Store/CAS/UoW/Port blocked mapping和fake/durable parity在adapter层发现；entry层验证metadata、version、envelope、receipt和bounded scope；E2E只验证本地truth-first最小闭环。外部provider正向闭环只有在`L2T-UP-*`对应owner/schema/mapping/route闭合后才条件启用。

## 11. 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| 实现仓测试框架和真实entry形式 | 影响suite命令实现，不影响层级契约 | Step 9 |
| durable adapter是否在当前轮可用 | 影响L3 integration是否执行，不能改变P0设计 | Step 8/9 |
| release smoke是否需要跨仓真实环境 | 影响P2条件门禁，当前不作事实 | Step 12/14 |

## 12. Step 内停审记录

| 审查项 | 结论 |
|---|---|
| 所有P0切口都有首要层级 | 通过 |
| 高风险不被全部推迟到E2E | 通过 |
| 层级允许依赖与全局依赖类型一致 | 通过 |
| 失败/unknown/blocked不会自动变pass | 通过 |
| E2E边界没有吸收外部owner truth | 通过 |

## 13. 进入下一步条件

- [x] 测试分层图和分层表完成。
- [x] Step 3全部P0切口有层级映射。
- [x] 失败处理、unknown fence和release/E2E边界明确。
- [x] 无需回写03，可进入Step 5建立双向追溯矩阵。
