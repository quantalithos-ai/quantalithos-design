# L1-conversation 05 测试方案 Step 4: 制定测试策略与分层

> 所属流程: `05_test_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/05-测试方案.md` §4 测试策略与分层
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 4 |
| 主题 | 制定测试策略与分层 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/05_test_plan_step_04_strategy_layers.md` |

本步只定义测试分层和风险发现位置。具体用例 ID、执行命令、CI pipeline、测试数据和证据编号分别留给 Step 6、Step 7、Step 9 和 Step 13。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `05_test_plan_step_02_scope.md` | P0-blocking、P0-supporting、P0/P1-boundary 优先级口径 | 作为失败阻断规则来源 |
| `05_test_plan_step_03_test_objects_slices.md` | 六组测试对象与测试切口 | 作为分层分配对象 |
| `03-详细设计.md` §15 | 模块、接口、状态、一致性和脚本最小验证清单 | 必须覆盖 |
| `03_ddd_step_16_test_slices.md` | 详细设计层测试切口总表 | 作为分层完整性检查 |
| `04-配置设计.md` §6 / §7 / §11 / §12 | profile、配置失效、reports / artifacts 和 redaction 规则 | 作为 integration-like、operations-replay 和 gate 分层依据 |

## 3. SOP 问题回答

### 3.1 哪些问题必须在 unit 层发现?

| 风险 / 问题 | 对应测试对象 | Unit 层验证目标 | 失败处理 |
|---|---|---|---|
| domain object 字段缺失、不变量破坏 | space、scope、fact、manifestation、trace、projection、handoff 对象 | 构造、必填字段、ref-only、safe snapshot、payload ref 规则 | P0-blocking |
| policy guard 失效 | `ConversationTruthPolicy`、`VisibilityPolicy`、`FactAppendPolicy`、`ManifestationPolicy`、`ReferenceValidityPolicy`、`DerivedViewPolicy` | authorization、append-only、source truth isolation、derived read-only | P0-blocking |
| 状态机非法迁移 | 14 组正式状态 enum | 合法 / 非法转换、正式 variant、终态不可回退 | P0-blocking |
| forbidden body / raw secret 基础防护 | redaction policy、snapshot、event / audit 输出对象 | runtime reasoning body、bridge body、artifact body、secret 不可进入对象输出 | P0-blocking |
| outcome 与 lifecycle 混同 | `FactAppendResult`、receipt、publication / handoff result 类对象 | outcome 创建后不可变，不作为可变状态机处理 | P0-blocking |

Unit 层是最快发现 domain 和 policy 错误的位置。不得把对象不变量、状态机非法迁移或 redaction guard 推迟到 E2E 才发现。

### 3.2 哪些问题必须在 service 层验证编排?

| 风险 / 问题 | 对应测试对象 | Service 层验证目标 | 失败处理 |
|---|---|---|---|
| command truth + outbox 同事务 | space / scope / fact / manifestation / trace command service | repository、policy、trace、receipt、outbox 调用顺序和 rollback | P0-blocking |
| idempotency 与 conflict | command service、consumer service、job service | same key same digest 返回已有 result；same key different digest conflict | P0-blocking |
| query 不写 truth | authorized query service | visibility guard、stale / failed marker 暴露、无写入副作用 | P0-blocking |
| source unresolved / digest mismatch | manifestation service、snapshot refresh service | 只写 unresolved / evidence，不补造来源 truth | P0-blocking |
| handoff failure 不回滚 truth | trace review service、handoff job service | retry / failed 状态推进，fact / trace truth 保持 | P0-blocking |
| projection / cursor maintenance | derived maintenance service | read model / cursor / search stale、rebuild、no auto-repair truth | P0-supporting；关键负向 P0-blocking |

Service 层负责验证 use case 编排，不替代 repository 产品测试，也不替代 API envelope / JSON 映射。

### 3.3 哪些问题必须依赖 DB / adapter / worker 集成测试?

| 风险 / 问题 | 对应测试对象 | Integration 层验证目标 | 失败处理 |
|---|---|---|---|
| repository 事务和 version 语义 | truth / fact / manifestation / trace / outbox / idempotency repository | unique key、expected version、rollback、list / lock | P0-blocking |
| fake / controlled adapter failure semantics | resolver、publisher、handoff fake adapter | unresolved、retry、failed、quarantine、credential ref missing | P0-blocking |
| worker consumer envelope | 6 个 inbound consumer | duplicate、invalid envelope quarantine、source ack failure、projection stale | P0-blocking |
| outbox relay / publisher retry | outbox publisher、relay worker | publish failed / retry pending / rerun with same event id | P0-blocking |
| operations replay | 9 个 operations job runner | partial failure、rerun、report ref、no auto-repair truth | P0-blocking 或 P0-supporting |
| integration-like 接缝 | configured local resolver / publisher / handoff / store profile | credential ref、configured adapter 接缝、fake-as-production 拒绝 | P0/P1-boundary |

Integration 层不要求真实生产 DB、broker、resolver 或 handoff endpoint。P0 使用 in-memory、fake 和 controlled adapter，但这些 adapter 必须保留失败、重试、quarantine 和 redaction 语义。

### 3.4 哪些问题需要 API / contract test?

| 风险 / 问题 | 对应测试对象 | API / Contract 层验证目标 | 失败处理 |
|---|---|---|---|
| DTO 与 domain 构造闭环 | Command / Query / Consumer / Event / Job DTO | roundtrip、必填字段、version、metadata、typed ref | P0-blocking |
| Command envelope | 10 个 Command | actor、metadata、idempotency key、trace ref、error mapping | P0-blocking |
| Query envelope | 11 个 Query | consumer context、page / consistency、visibility denied、不写 truth | P0-blocking |
| Inbound event envelope | 6 个 Consumer | event id、source ref、digest、idempotency key、quarantine | P0-blocking |
| Outbound event payload | 9 个 outbound event | committed truth ref、payload ref-only、schema version、forbidden body absent | P0-blocking |
| Job input envelope | 9 个 Operations Job | `JobRunId`、scope、batch、report root、failure summary | P0-blocking |
| HTTP / RPC handler mapping | api command / query handlers | protocol error、application error、domain error 映射稳定 | P0-blocking |

Contract 层负责防止“字段名正确但构造闭环错误”。API handler 层负责防止 handler 自行补字段、跳过 metadata / visibility / idempotency guard。

### 3.5 哪些场景才需要 E2E 或 release gate?

| 场景 | Gate 目标 | 执行方式 | 失败处理 |
|---|---|---|---|
| P0 核心闭环 smoke | space / scope -> fact append -> authorized query -> manifestation -> trace evidence | local-dev / ci-test fake stack | P0-blocking |
| 红线组合检查 | authorization、forbidden body、append-only、source truth isolation、derived read-only 同时成立 | ci-test gate + redaction check | P0-blocking |
| outbox / worker / job 最小闭环 | accepted truth -> outbox -> fake publish -> projection stale / rebuild -> report ref | ci-test 或 operations-replay | P0-blocking |
| integration-like 接缝 | configured adapter、credential ref、unresolved / retry / failed / quarantine | integration-like profile | P0/P1-boundary；不代表 production pass |
| release evidence package | `artifacts/test/<run_id>`、`reports/runs/<run_id>`、redaction-check、evidence index 可生成 | release gate / report generation | P0-blocking |

E2E / release gate 只验证跨层闭环和证据可验收性，不承担 domain 不变量、单个状态机、DTO roundtrip 或 repository rollback 的主要发现职责。

## 4. 当前文档问题诊断

| 文档 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 容易把 stream / E2E 当主验证手段，缺少 unit / service / integration 责任分配 | 不继承旧分层 |
| Step 3 中间产物 | 已列出测试对象，但还没有执行层级和失败阻断规则 | 本步按层级分配风险发现位置 |
| `03` §15 | 给出最小验证切口，但未说明每类切口在何时执行 | 本步拆为 unit、service、integration、API / contract、gate |
| `04` §6 / §12 | profile 和 reports / artifacts 规则明确，但还未进入测试分层 | 本步将 ci-test、integration-like、operations-replay 和 evidence package 纳入分层 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 高风险发现位置 | 容易堆到 E2E 或 release gate | domain / policy / state 在 unit，编排在 service，接缝在 integration，证据在 gate |
| fake adapter | 可能只作为跑通工具 | 必须在 integration 层验证失败、重试、quarantine 和 redaction 语义 |
| API / contract | 可能只测 handler 正常返回 | 必须测 DTO roundtrip、必填字段、metadata、typed ref、payload ref-only |
| release gate | 可能被当成所有测试的替代 | 只作为跨层 smoke、红线组合和证据包门禁 |

## 6. 测试设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 高风险是否集中到 E2E | 主要靠 E2E 发现 | 分层前移到 unit / service / integration | B | E2E 定位慢，且不适合发现对象不变量 |
| fake adapter 是否只做 mock | fake 只返回成功 | fake 必须保留 failure semantics | B | P0 可 fake，但不能伪装真实成功 |
| contract test 是否独立 | 合并到 API 测试 | 独立覆盖 DTO / envelope / ref-only，再由 handler 验证映射 | B | 可避免字段漂移和 handler 补字段 |
| integration-like 是否算生产验收 | 算真实集成通过 | 只算 P0/P1-boundary 接缝通过 | B | 当前不要求真实生产 endpoint |
| release gate 是否生成证据 | 只跑测试 | 必须形成 artifact / report / redaction evidence | B | 05 面向 06 验收裁决 |

## 7. 结构化中间产物

### 7.1 测试分层图

#### 测试分层图: L1-conversation test pyramid

```text
[Unit]
  domain objects / policies / state machines / redaction guards
    |
    v
[Service]
  application flows / tx boundary / idempotency / error mapping
    |
    v
[Integration]
  repositories / fake adapters / workers / operations jobs
    |
    v
[API / Contract]
  DTO roundtrip / envelope / handler mapping / payload ref-only
    |
    v
[E2E / Release gate]
  P0 smoke / redline bundle / evidence package
```

关键说明:

- 图表达风险发现层级，不表达 CI pipeline 的具体命令顺序。
- 高风险规则必须尽量前移到 unit / service / integration，不得只靠 release gate。
- Release gate 负责组合闭环和证据包，不替代底层测试。
- Integration-like 只证明 controlled adapter 接缝，不代表 production-like 通过。

### 7.2 测试分层表

| 层级 | 目标 | 典型内容 | 执行时机 | 失败处理 |
|---|---|---|---|---|
| Unit | 快速发现对象、policy、状态和 redaction guard 错误 | domain object、value object、policy、14 组状态机、forbidden field guard | PR / CI 最小门禁 | P0-blocking 直接失败 |
| Service | 验证 use case 编排、事务、幂等、错误映射和 outbox 副作用 | command service、query service、manifestation service、trace / handoff service、derived maintenance service | PR / CI 门禁 | P0-blocking 直接失败 |
| Integration | 验证 repository、adapter、worker、job 与配置接缝 | in-memory repo、fake resolver / publisher / handoff、worker consumer、operations job、config validator | CI / nightly / operations-replay | P0-blocking 失败；P0/P1-boundary 单独标记 |
| API / Contract | 验证 DTO、envelope、handler mapping 和 payload ref-only | 10 Command、11 Query、6 Consumer、9 Event、9 Job contract | CI 门禁 | P0-blocking 直接失败 |
| E2E / Release gate | 验证 P0 smoke、红线组合和证据包 | fake stack smoke、integration-like接缝、`artifacts/test/<run_id>`、`reports/runs/<run_id>`、redaction check | release gate / handoff 前 | P0-blocking 不得验收通过 |

### 7.3 Step 5 承接提示

| 分层 | Step 5 追溯时应关注 |
|---|---|
| Unit | FR / BR 中的对象不变量、状态、visibility、ref-only 和 forbidden body |
| Service | FR-CONV-001~005 主链、BR-CONV-013~020 显式变化和审计约束 |
| Integration | NFR-CONV-003~004、NFR-CONV-009~012、外部依赖降级和恢复 |
| API / Contract | FR-CONV-001~008 的协议入口、BR-CONV-014~018 的读写性质 |
| E2E / Release gate | 需求 §14 验收方向、一票否决项和证据归档可消费性 |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §4 时摘录。

```markdown
## 4. 测试策略与分层

> 校准来源：
> - `design-calibration/05_test_plan_step_04_strategy_layers.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“SOP 问题回答”“测试分层图”“测试分层表”和“测试设计取舍”小节，了解每类风险为什么被分配到对应测试层级。

本轮测试采用 Unit、Service、Integration、API / Contract、E2E / Release gate 五层策略。Unit 层负责 domain object、policy、状态机和 redaction guard；Service 层负责 application flow、事务、幂等、错误映射和 outbox 副作用；Integration 层负责 repository、fake / controlled adapter、worker、operations job 和配置接缝；API / Contract 层负责 DTO roundtrip、envelope、handler mapping 和 payload ref-only；E2E / Release gate 只验证 P0 smoke、红线组合和 evidence package。

高风险规则必须尽量前移，不能全部依赖 E2E。Release gate 必须形成 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、redaction check 和 evidence index，供 `06-验收标准.md` 裁决。
```

## 9. 待确认事项

无阻塞进入 Step 5 的待确认事项。

后续 Step 必须继续收口:

- Step 5 将需求、业务规则、非功能要求映射到本步分层。
- Step 6 生成用例时必须标注用例所在层级。
- Step 9 定义自动化门禁时必须承接本步执行时机，但不得反向改变分层职责。
- Step 13 定义证据归档时必须承接 release gate evidence package。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| Unit / Service / Integration / API / Gate 分层明确 | 通过 | 五层职责已定义 |
| Step 3 全部 P0 切口可落入测试层级 | 通过 | 六组切口均有承接层 |
| 失败阻断规则明确 | 通过 | P0-blocking、P0-supporting、P0/P1-boundary 已分配 |
| 可以进入 Step 5 | 通过 | 下一步建立需求追溯与覆盖矩阵 |
