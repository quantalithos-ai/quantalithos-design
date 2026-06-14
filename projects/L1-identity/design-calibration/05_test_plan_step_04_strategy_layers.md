# Step 4. 制定测试策略与分层

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 4
> 回填章节: `05-测试方案.md` §4 测试策略与分层

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 4 制定测试策略与分层 |
| 当前状态 | 已写入;待用户审查 |
| 输入基线 | Step 3 测试对象与测试切口;`03-详细设计.md` 模块边界和处理流;`04-配置设计.md` 配置测试承接 |
| 输出文件 | `projects/L1-identity/design-calibration/05_test_plan_step_04_strategy_layers.md` |
| 正式文档状态 | 本 Step 不修改正式 `05-测试方案.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 5 |

## 2. 本步目标

决定每类测试风险应该在哪一层被发现,避免把所有高风险问题推给 E2E 或 release gate。

本 Step 只回答:

- 哪些问题必须在 unit / contract 层发现。
- 哪些问题必须在 application service 层验证编排。
- 哪些问题必须依赖 repository / adapter / runtime / worker / job integration。
- 哪些问题需要 API / worker / job entry contract test。
- 哪些场景才需要 E2E 或 release gate。

本 Step 不定义具体用例编号、执行脚本、测试数据、artifact 路径、evidence ID 或 release verdict。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_03_test_objects_cuts.md` | 已审核通过 | 提供 P0 测试对象、切口、停审和来源审计 |
| `02-概要设计.md` §4 / §5 | 正式输入 | 固定 Inbound / Operations、Application Services、Domain Model、Ports / Persistence / Projection / Outbox 分层 |
| `03-详细设计.md` §5 / §6 | 正式输入 | 固定七个 crate 职责、对象归属和模块依赖边界 |
| `03-详细设计.md` §7 / §8 | 正式输入 | 固定 Command / Query / Inbound / Callback / Outbound / Job 的协议和函数级编排 |
| `03-详细设计.md` §9~§14 | 正式输入 | 固定状态、事务、错误、幂等、恢复、配置、observability 和 redaction 测试发现层级 |
| `04-配置设计.md` §6 / §9 / §11 / §12 | 正式输入 | 固定 profile、runtime builder、adapter failure、config fail-fast 和配置 evidence 方向 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些问题必须在 unit 层发现? | contracts DTO / metadata / schema version / digest marker、domain object factory、不变量、policy accept/reject、state enum 合法 / 非法转换、config parser / typed validator、redaction helper、low-cardinality metric label rule 必须在 unit / contract 层发现。它们不依赖 repository 或外部 adapter,越早失败越好。 |
| 哪些问题必须在 service 层验证编排? | Command accepted transaction 顺序、query no-write、consumer/callback dedup / receipt / stale marker、duplicate replay、stored result / receipt / report、commit unknown、error mapping、source unavailable mapping、UoW rollback 和 job no truth repair 必须在 application service / job service 层验证。它们的风险来自编排顺序,不是单个 domain 对象。 |
| 哪些问题必须依赖 DB / adapter / worker 集成测试? | repository version/page/unique/rollback、reference bundle version、projection lookup、outbox stored payload marker、publisher single-winner、runtime builder assembly、fake / controlled adapter failure injection、worker unsupported / delayed / quarantined 和 job runner partial report 必须用 repository fake、adapter fake、worker / job integration 验证。P0 不要求真实 DB / bus / archive 产品。 |
| 哪些问题需要 API / contract test? | public protocol envelope、metadata 必填、Command / Query / Inbound / Callback / Outbound / Job DTO roundtrip、handler required-field validation、protocol error mapping、Query response missing / not visible / degraded surface 和 outbound material schema 需要 API / contract test。 |
| 哪些场景才需要 E2E 或 release gate? | E2E / release gate 只用于证明跨入口最小闭环、profile 装配、自动化门禁、artifact / report / redaction / evidence 汇总和一票否决扫描。它不替代 unit、service、integration 的具体风险发现,也不负责测试相邻仓完整内部状态机。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `05-测试方案.md` §2 / §8 | 旧分层按单元、服务、事件、恢复、E2E 并列,但没有明确每类风险应该在哪一层失败 | 本 Step 建立切口到发现层级映射 |
| Step 3 测试切口 | 已抽取对象和切口,但还未决定执行层级 | 本 Step 将每个 P0 切口映射到 unit / service / integration / API / worker / job / release gate |
| `03` Step 16 | 建议测试类型已给出,但 `05` 需要更完整的分层策略 | 本 Step 将 Step 16 建议测试类型转译成正式策略 |
| 配置测试 | `04` 给出测试主题和证据,但未纳入测试金字塔 | 本 Step 将 config parser、runtime builder、profile matrix、redaction 分层 |
| E2E / release gate | 容易被误用为所有风险的兜底 | 本 Step 明确 E2E / release gate 只做闭环证明和证据汇总 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 分层口径 | 按测试类型罗列 | 按风险发现位置分层 | 更容易定位失败责任 |
| Unit 层 | 只泛称 domain rules | 明确 contracts、domain state、config parser、redaction helper | 覆盖早期可判定错误 |
| Service 层 | 未突出编排顺序 | 明确 UoW、outbox、stored result、receipt/report replay、query no-write | 这些是 P0 主要可落码风险 |
| Integration 层 | 易被理解为真实外部产品 | 明确 P0 使用 repository / adapter fake 和 controlled seam | 产品未锁定不阻塞 P0 |
| Release gate | 容易承担过多语义 | 限定为跨入口 smoke、report、redaction、dependency evidence 汇总和 veto scan | 防止用总门禁替代具体测试 |

## 7. 测试设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 高风险是否推给 E2E | A. 大量 E2E;B. 分层前置发现 | 采用 B。状态、事务、幂等、redaction 必须在更低层失败 |
| integration 是否要求真实产品 | A. P0 真实 DB / bus / archive;B. P0 fake / controlled adapter | 采用 B。真实产品属于 P1/P2 |
| query no-write 放在哪层 | A. E2E;B. service + repository write audit | 采用 B。必须能精确断言无写副作用 |
| dependency boundary 放在哪层 | A. 手工审查;B. architecture check + release gate 汇总 | 采用 B。VETO-ID-006 需要可留证 |
| redaction 放在哪层 | A. 只扫最终 report;B. helper unit + integration artifact scan | 采用 B。既防规则错误,也防实际输出泄露 |

## 8. 结构化中间产物

### 8.1 测试分层图: L1-identity 测试金字塔

```text
[release gate / evidence summary]
  - cross-entry smoke
  - report / artifact / redaction / dependency evidence
  - veto candidate scan
        ^
        |
[API / Worker / Job entry]
  - handler protocol mapping
  - worker consumer / callback disposition
  - job runner input / report / duplicate replay
        ^
        |
[Integration with fake / controlled adapters]
  - repository version / rollback
  - runtime builder / profile assembly
  - adapter failure injection
  - publisher / handoff marker
        ^
        |
[Application service]
  - Command transaction orchestration
  - Query no-write
  - Consumer / callback receipt replay
  - Job partial report / no truth repair
        ^
        |
[Unit / Contract]
  - DTO / metadata / digest schema
  - domain invariants / state matrix
  - config parser / redaction helper
```

关键说明:

- 高风险状态、事务、幂等和 redaction 不等待 E2E 才发现。
- P0 integration 使用 fake / controlled adapters,不要求真实 DB、bus、archive 或 metric 产品。
- Release gate 只汇总证据和跨入口 smoke,不能替代底层断言。
- Query no-write 和 job no truth repair 需要 repository write audit、spy 或等价测试工具支持。

### 8.2 测试分层表

| 层级 | 目标 | 典型内容 | 执行时机 | 失败处理 |
|---|---|---|---|---|
| Unit / Contract | 尽早发现 schema、状态、不变量、纯函数规则错误 | DTO roundtrip、metadata required、digest marker、domain factory、policy reject、state matrix、config parser、redaction helper | PR / local / CI fast suite | 阻断提交;不进入 service 测试 |
| Application service | 验证正式 flow 编排、UoW、幂等、错误映射和副作用顺序 | command accepted transaction、query no-write、consumer/callback receipt、stored result / report、commit unknown、rollback | PR / CI service suite | 阻断提交;需要定位到 service / port contract |
| Integration with fake / controlled adapters | 验证 repository / adapter 语义、runtime builder、failure injection 和 marker 状态 | version conflict、rollback、projection lookup、reference bundle version、outbox marker、publisher / handoff failure、profile assembly | CI integration / operations-replay | P0 阻断合并;若是 P1 real-like 则记录风险 |
| API / Worker / Job entry | 验证入口 DTO 解析、handler mapping、worker disposition、job runner report | API required fields、query response surface、worker unsupported / delayed / quarantined、job duplicate replay | CI entry suite / nightly | P0 阻断合并;P1/P2 进入残余风险 |
| release gate / evidence summary | 验证最小跨入口闭环、报告生成、redaction、依赖裁剪和 evidence 汇总 | main smoke、config digest、redaction scan、dependency check、artifact / report completeness | release candidate | P0 失败阻断送验;P1/P2 缺口不得伪装 pass |

### 8.3 Step 3 切口到测试层级映射

| 测试切口 | 主发现层级 | 辅助层级 | 失败是否阻断 P0 |
|---|---|---|---|
| `contracts_protocol_surface_roundtrip` | Unit / Contract | API / Worker / Job entry | 是 |
| `contracts_body_free_command_schema` | Unit / Contract | Redaction scan | 是 |
| `contracts_metadata_validation` | Unit / Contract | API / Worker / Job entry | 是 |
| `domain_truth_factory_invariants` | Unit / Contract | Application service | 是 |
| `domain_state_transition_guards` | Unit / Contract | Application service | 是 |
| command cut family | Application service | API entry / repository fake | 是 |
| query cut family | Application service | Repository write audit / API entry | 是 |
| inbound / callback cut family | Application service | Worker entry / adapter fake | 是 |
| outbound material cut family | Unit / Contract | Application service / publish job | 是 |
| operations job cut family | Job entry / runner | Application service / integration | 是 |
| consistency / idempotency cuts | Application service | Repository fake / UoW integration | 是 |
| config test cuts | Unit / Contract | Runtime builder integration / release gate | 是 |
| redaction / observability cuts | Unit / Contract | Integration artifact scan / release gate | 是 |
| dependency boundary cut | Architecture check | Release gate evidence summary | 是 |
| P1 real-like adapter seam | Integration with controlled adapters | Release candidate selected-run | 否,除非正式升级为 P0 |
| P2 capacity / production-like | Future performance / operations suite | Release candidate review | 否 |

### 8.4 高风险断言发现层级表

| 高风险断言 | 最早发现层级 | 不应只靠哪层 | 原因 |
|---|---|---|---|
| 状态非法转换被接受 | Unit / Contract | E2E | domain enum 和 policy 可直接判定 |
| accepted command 漏 outbox / stored result | Application service | Release gate | 需要检查 UoW 内副作用顺序 |
| query 修复 projection / reference | Application service + write audit | E2E | E2E 难以证明“没有写” |
| duplicate replay 从 current truth 重算 | Application service | API smoke | 需要控制 stored surface missing / wrong kind |
| publisher failure 回滚 truth | Integration fake publisher | Release gate | 需要注入 publisher failure |
| job 反写 core truth | Job runner + write audit | E2E | 需要区分 report / marker 与 truth store |
| external body 进入 outbox / audit / report | Unit redaction + artifact scan | Manual review | 必须自动扫描输出面 |
| fake adapter 伪成功 | Integration fake adapter | Release gate | fake 本身必须验证 state / receipt / report |
| 非 core sibling 编译期依赖 | Architecture check | Manual review | 依赖裁剪必须可重复检查 |

### 8.5 E2E / release gate 使用边界

| 场景 | 是否进入 E2E / release gate | 进入原因 | 不承担内容 |
|---|---|---|---|
| identity main smoke | 是 | 证明最小 command -> query -> outbox / report / trace 主链可运行 | 不替代每个 Command 的 service case |
| profile matrix smoke | 是 | 证明 P0 profile 可装配并产出 config evidence | 不替代 config parser / validator unit |
| redaction artifact scan | 是 | 证明实际 artifacts / reports 没有 forbidden body | 不替代 redaction helper unit |
| dependency boundary scan | 是 | 证明 VETO-ID-006 可留证 | 不替代架构文档审查 |
| P1 real-like selected-run | 有条件 | 仅在 P1 环境和正式 selected-run 口径存在时执行 | 不作为当前 P0 pass 前置 |
| performance sample / trend | 有条件 | 仅提供趋势或后续 baseline 输入 | 没有正式阈值时不能判定 pass |
| full cross-repo E2E | P1/P2 | 验证真实相邻仓消费差异 | 不作为 identity P0 truth center 成立前置 |

### 8.6 分层覆盖审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| Step 3 全部 P0 切口是否有主发现层级 | 通过 | 见 §8.3 |
| 是否把所有高风险推给 E2E | 通过 | 高风险已前置到 unit / service / integration |
| Unit / Contract 是否覆盖 schema、state、config、redaction | 通过 | 见 §8.2 / §8.3 |
| Service 是否覆盖 UoW、duplicate、query no-write、consumer/callback receipt | 通过 | 见 §8.3 / §8.4 |
| Integration 是否限定为 fake / controlled adapter | 通过 | P0 不要求真实产品 |
| API / Worker / Job 是否只作为入口映射和 runner 层 | 通过 | 不直接写 repository |
| release gate 是否不伪造 P1/P2 pass | 通过 | P1 selected-run 和性能阈值需正式口径 |
| 是否存在未分层 P0 切口 | 通过 | 当前未发现 |

## 9. 对上游设计的影响判定

| 分层结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| P0 integration 使用 fake / controlled adapters | 否 | 测试策略 | 符合 `04` profile 和产品中立口径 |
| Query no-write 需要 repository write audit | 否 | 测试工具需求 | Step 9 再定义自动化或 manual gate |
| Job no truth repair 需要 repository write audit | 否 | 测试工具需求 | Step 9 再定义自动化或 manual gate |
| Dependency boundary 需要 architecture check | 否 | 测试工具需求 | Step 9 / Step 13 承接 evidence |
| P1 real-like selected-run 不作为 P0 | 否 | release gate 边界 | 符合 Step 2 P1/P2 口径 |
| 若后续要求 P1/P2 进入 pass gate | 是 | 验收基线变更 | 需要回写 `05/06/07` 口径 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_04_strategy_layers.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“测试分层图”“测试分层表”“Step 3 切口到测试层级映射”和“E2E / release gate 使用边界”小节,了解测试策略如何避免把高风险推给 E2E。

正式 `05-测试方案.md` §4 应回填:

- 测试分层按照风险发现位置组织:Unit / Contract、Application service、Integration with fake / controlled adapters、API / Worker / Job entry、release gate / evidence summary。
- 状态、不变量、DTO、digest marker、config parser 和 redaction helper 必须在 unit / contract 层发现。
- UoW、outbox、stored result、typed receipt、job report、duplicate replay、query no-write、consumer/callback receipt 和 job no truth repair 必须在 service / runner 层发现。
- repository version、rollback、projection lookup、reference bundle version、publisher / handoff failure 和 runtime builder 必须在 fake / controlled integration 层发现。
- E2E / release gate 只用于最小跨入口闭环、profile 装配、redaction scan、dependency scan 和 evidence 汇总,不得替代底层断言。
- P1 real-like selected-run 和 performance sample 不得在缺正式环境或阈值时伪装成 P0 pass。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| repository write audit helper 如何实现 | 影响 query no-write / job no truth repair 自动化 | Step 9 设计自动化门禁时收口 |
| dependency boundary scan 采用脚本还是人工 gate | 影响 VETO-ID-006 evidence | Step 9 / Step 13 再定义 |
| release gate smoke 的最小闭环细节 | 影响 Step 9 / Step 13 evidence | 后续按 Step 6 用例和 Step 9 门禁收口 |
| P1 real-like selected-run 是否后续升级 | 影响 pass gate | 当前不升级;若升级需回写设计和验收标准 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 测试分层覆盖 Step 3 全部 P0 切口 | 通过 | 见 §8.3 / §8.6 |
| 高风险未全部推给 E2E | 通过 | 见 §8.4 |
| 失败是否阻断已说明 | 通过 | 见 §8.2 / §8.3 |
| release gate 边界已明确 | 通过 | 见 §8.5 |
| 正式 `05` 未提前改写 | 通过 | 本 Step 只写 `design-calibration` 中间产物 |
| 可进入 Step 5 | 待用户确认 | 用户审核通过后进入 Step 5: 建立需求追溯与覆盖矩阵 |
