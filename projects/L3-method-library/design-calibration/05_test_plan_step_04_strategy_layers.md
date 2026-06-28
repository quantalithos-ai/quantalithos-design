# Step 4. 制定测试策略与分层

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 4
> 回填章节: `05-测试方案.md` §4 测试策略与分层
> 创建日期: 2026-06-27
> 当前模式: full-restart / step4-strategy-layers
> 当前状态: completed_wait_user_confirm_to_R5.1
> 当前模块: `R4.2 测试策略与分层:再写入`
> 当前门禁: `R4.2` completed_wait_user_confirm_to_R5.1;等待确认进入 Step 5 `R5.1 需求追溯与覆盖矩阵:先思考`

---

## 0. Step 3 handoff

Step 3 已确认当前 `05-测试方案.md` 的测试对象与测试切口输入:

- P0 测试对象候选覆盖七实现单元 owner boundary、core truth / definition、object / policy、public protocol、application flow、port / adapter、state / consistency / replay、config / dependency、observability / redaction。
- P0 测试切口已形成 module owner、truth invariant、policy guard、public shell、command orchestration、query no-write、inbound / outbound / job flow、repository / UoW、resolver / publisher / handoff seam、state transition、idempotency / replay、config validation、forbidden configurable boundary、safe diagnostic、low-cardinality metric / audit refs-only 等候选。
- 负向切口、P1/P2 接缝、非范围保护和旧材料污染防护已收口。
- P0 切口停审和跨切口审计未发现阻塞 Step 4 的 unresolved source blocker。
- Step 4 只能决定“每类风险在哪一层被发现”,不能生成 TC 编号、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准或实施计划。

Step 4 的任务是把 Step 3 的测试切口转成测试策略和分层。它回答“风险最早应该在哪个层级失败、哪些层级辅助验证、失败是否阻断”。它不是追溯矩阵,也不是用例矩阵。

---

## R4.1 测试策略与分层:先思考

### 1. 当前模块目标

`R4.1` 只思考 Step 4 的开工边界、必读文档、Step 3 handoff、L1-governance Step 4 框架参考、L3-method-library 测试分层轴、切口承接边界和 `R4.2` 写入边界。

当前模块不写最终测试分层图、最终分层表、完整切口到层级映射、追溯矩阵、用例、数据、环境、自动化门禁、evidence、验收或实施内容。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R4.2 |
| 用户确认 | 已确认从 Step 3 completed 推进到 Step 4 `R4.1`。 |
| 当前允许 | 思考 Step 4 开工边界、必读文档、SOP 五问、Step 3 切口承接、L1-governance 框架参考、L3 分层轴和 R4.2 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写最终分层图 / 分层表、完整切口映射、追溯矩阵、TC 编号、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。 |

### 2. Step 4 启动前必须承接

| 输入 | 必须承接的内容 | 禁止继承 / 禁止提前 |
|---|---|---|
| `project_execution_ledger.md` | 当前恢复点已推进到 Step 3 completed_wait_user_confirm_to_R4.1;每次确认只推进一个当前模块。 | 直接写完整 Step 4 或跳到 Step 5 追溯矩阵。 |
| `05_test_plan_calibration_flow.md` | Step 1~3 completed;Step 4 waiting_user_confirm_to_R4.1;Step 5+ blocked。 | 在 Step 4 写用例、数据、环境、自动化或 evidence。 |
| `05_test_plan_step_01_input_boundary.md` | 正式输入边界、旧材料隔离、缺口回写规则。 | 从旧 `05/06/07` 恢复旧测试层级、旧 TC / EV 或旧 CI gate。 |
| `05_test_plan_step_02_scope.md` | P0/P1/P2、非范围、下游接缝和一票否决方向。 | 把 P1/P2 real-like / production-like 抬升为 P0 阻断层。 |
| `05_test_plan_step_03_test_objects_cuts.md` | P0 测试对象、P0 切口、负向切口、P1/P2 seam、停审和跨切口审计。 | 重新发明测试对象或丢弃 Step 3 已确认切口。 |
| `测试方案讨论流程_SOP.md` Step 4 | Step 4 必须回答 unit、service、integration、API / contract、E2E / release gate 五类发现层级问题。 | 用“全部走 E2E”或“全部单测”替代风险分层。 |
| `测试方案书写规范.md` §5.4 | 正式 §4 必须输出测试分层图和分层表,并说明失败处理。 | 在 R4.1 直接写正式 §4 正文。 |
| `设计文档讨论中间产物规范.md` | 先思考后写入、单模块推进、单次写入批次不是最终长度上限。 | 为了省事压缩 Step 4 粒度或合并 Step 4/5/6。 |
| `设计真相源闭环与可落码性标准.md` | 不得补 schema、port、state、mapper、marker source、config key、evidence schema 或 phase boundary。 | 用测试工具、fake 私有规则或 CI 脚本补正式设计缺口。 |
| `00-需求文档.md`~`04-配置设计.md` | 提供 P0 风险、正式设计契约、配置红线和下游接缝。 | 改写上游需求、架构、详细设计或配置设计。 |
| L1-governance Step 4 | 参考“按风险发现位置分层”的框架和表格深度。 | 复制 governance 领域对象、suite 名、evidence 或门禁。 |

### 3. SOP Step 4 五问思考边界

| SOP 问题 | R4.1 思考边界 | 后续落点 |
|---|---|---|
| 哪些问题必须在 unit 层发现? | 先识别不依赖 repository / adapter 的 DTO、typed ref、object invariant、policy、state enum、config parser、redaction helper 和 metric label 规则。 | R4.2 写 unit / contract 层目标和典型内容。 |
| 哪些问题必须在 service 层验证编排? | 先识别 command accepted/rejected/duplicate、query no-write/degraded、consumer replay、outbound/job no truth repair、stored replay 和 error mapping。 | R4.2 写 application service 层目标、失败处理和切口映射。 |
| 哪些问题必须依赖 DB / adapter / worker 集成测试? | 先识别 repository / UoW atomicity、rollback、version conflict、checkpoint、resolver/publisher/handoff seam、runtime builder 和 fake parity。 | R4.2 写 integration with fake / controlled adapter 层。 |
| 哪些问题需要 API / contract test? | 先识别 Command、Query、Inbound、Outbound、Operations Job public shell、safe surface、required field 和 entry mapping。 | R4.2 写 API / worker / job entry 层。 |
| 哪些场景才需要 E2E 或 release gate? | 先限定为最小跨入口 smoke、profile assembly smoke、redaction scan、dependency boundary scan 和 evidence summary。 | R4.2 写 release gate 边界,并禁止它替代底层断言。 |

### 4. L1-governance Step 4 框架参考思考

L1-governance Step 4 的可借鉴点是“风险发现位置优先”,不是测试类型堆叠。L3-method-library 应采用同样的组织方式,但层级名称和典型内容必须来自 L3 当前 `03/04` 与 Step 3 切口。

| L1-governance 框架点 | L3 采用方式 | L3 禁止 |
|---|---|---|
| 先声明 Step 状态、输入基线和停审方式 | L3 Step 4 先记录当前模块、Step 3 handoff、输入、禁止范围和 R4.2 门禁。 | 不在开头直接写正式 §4。 |
| 分层按风险发现位置组织 | L3 按 Unit / Contract、Application service、Integration seam、Entry / runner、Release gate 分层。 | 不按“单元/集成/E2E”泛泛罗列。 |
| 每层有目标、典型内容、执行时机和失败处理 | L3 R4.2 应写分层表,并说明 P0 失败是否阻断。 | R4.1 不写最终表。 |
| Step 3 切口逐项映射到主发现层级 | L3 R4.2 应让每个 P0 切口都有主发现层和辅助层。 | 不让 E2E 承担所有 P0 风险。 |
| Release gate 只做闭环证明和证据汇总 | L3 release gate 只承接最小 smoke、redaction、dependency、evidence summary。 | 不用 release gate 补缺单测、service test 或正式 source。 |

### 5. L3-method-library 分层轴思考

L3 的分层应体现“方法资产定义仓”的特征:truth 与 formal version 是低层不变量,受控消费和 public shell 是协议边界,后台 flow 和 adapter seam 是编排与一致性风险,配置和观测红线需要在多层重复防守。

| 候选层级 | 主要发现风险 | R4.1 初判 |
|---|---|---|
| Unit / Contract | typed ref、DTO shell、domain object invariant、policy accept/reject、state enum、config parser、redaction helper、metric label family。 | 必须最早发现 schema、状态、不变量、body-free 和 secret-free 规则错误。 |
| Application service / Flow | command accepted/rejected/duplicate、query no-write、consumer replay、outbound/job report、stored replay、commit unknown、safe error mapping。 | 必须验证编排顺序和副作用边界,不能推给 E2E。 |
| Repository / UoW / Adapter fake integration | transaction atomicity、rollback、version conflict、checkpoint resume、resolver/publisher/handoff failure、runtime builder assembly。 | P0 使用 fake / controlled seam;不要求真实 DB / bus / product。 |
| API / Worker / Job entry | public protocol required fields、entry mapping、safe response / report / disposition、worker/job runner envelope。 | 验证入口层映射和 public shell,不直接证明 domain invariant。 |
| Config / Runtime redline | profile isolation、source priority、fail-fast、forbidden configurable boundary、adapter availability。 | 可跨 unit、runtime builder 和 release smoke 承接,但不写具体 env/key。 |
| Observability / Redaction check | no raw body、no secret、audit refs-only、low-cardinality metric、safe diagnostic、safe report/handoff。 | 可跨 helper、integration artifact scan 和 release gate 承接,但 evidence schema 后移 Step 13。 |
| Release gate / Evidence summary | 最小跨入口 smoke、profile assembly smoke、redaction/dependency scan、report completeness。 | 只做汇总和阻断裁决输入,不替代底层断言。 |

### 6. Step 3 切口承接思考

R4.2 写入时应把 Step 3 的每个 P0 切口至少映射到一个“主发现层级”,必要时再标注辅助层级。R4.1 只固定映射原则,不写最终完整映射表。

| 切口族 | 分层承接原则 |
|---|---|
| owner boundary / dependency direction | 主发现层应是 Unit / Contract 或 static / architecture check;release gate 只汇总证据。 |
| truth invariant / formal version / policy guard | 主发现层应是 Unit / Contract;service 只验证编排中是否正确调用和保持 no side-effect。 |
| public shell / safe surface | 主发现层应是 Contract / API entry;service 层验证 error mapping 和 stored surface。 |
| command / query / consumer / outbound / job flow | 主发现层应是 Application service / runner;entry 和 fake adapter 作为辅助。 |
| repository / UoW / resolver / publisher / handoff seam | 主发现层应是 fake integration / adapter seam;service 层验证调用顺序和失败映射。 |
| state / idempotency / replay / concurrency | Unit / Contract 发现非法状态;service + fake persistence 发现 duplicate、race 和 stored replay。 |
| config validation / forbidden configurable boundary | config parser / validator、runtime builder 和 service guard 分层承接;不从 config 补正式 source。 |
| observability / redaction / audit refs-only | helper / contract 层发现规则错误;artifact scan / release gate 只证明输出面无泄露。 |

### 7. Step 4 与后续 Step 边界思考

Step 4 只建立策略和分层,不能把后续 Step 的工作提前写完。

| 后续 Step | Step 4 可做 | Step 4 禁止 |
|---|---|---|
| Step 5 追溯矩阵 | 标注分层会服务覆盖矩阵。 | 写需求 / 规则 / 设计 / 场景 / 用例 / evidence 映射。 |
| Step 6 用例矩阵 | 说明哪些切口应在何层发现。 | 写 TC 编号、用例步骤、断言点、前置条件。 |
| Step 7 测试数据 | 标注某些层级后续需要 fixture / builder。 | 写 seed、JSON、fake state、清理策略。 |
| Step 8 环境配置 | 标注 P0 fake / controlled seam 和 profile smoke 方向。 | 写 env key、URL、topic、secret provider、部署命令。 |
| Step 9 自动化门禁 | 标注 PR / CI / release gate 的粗粒度执行时机。 | 写 suite 名、CI command、required check、脚本路径。 |
| Step 13 evidence | 标注 release gate 只汇总证据。 | 写 EV 编号、artifact schema、report path、JSON 字段。 |

### 8. R4.2 写入边界思考

`R4.2 测试策略与分层:再写入` 应把 R4.1 的思考固化为 Step 4 中间产物,仍不能修改正式 `05-测试方案.md`。

1. 写 Step 4 必读文档表与读取状态。
2. 写 Step 3 handoff 承接表。
3. 写 SOP 五问回答。
4. 写 L1-governance Step 4 框架参考边界。
5. 写 L3 测试分层图候选和测试分层表候选。
6. 写 Step 3 P0 切口到主发现层级 / 辅助层级的映射候选。
7. 写 E2E / release gate 使用边界和高风险不得下沉到 release gate 的审计。
8. 写正式 §4 回填草稿候选边界、待确认事项和 Step 5 进入条件。
9. 禁止写正式 `05-测试方案.md`、追溯矩阵、用例、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或 implementation code。

### 9. R4.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 Step 4 开工边界和分层策略 | pass |
| 是否承接 Step 3 completed handoff | pass |
| 是否读取并对照 SOP Step 4 和书写规范 §5.4 | pass |
| 是否参考 L1-governance 框架但不复制领域语义 | pass |
| 是否形成 L3 分层轴思考 | pass |
| 是否形成 Step 3 切口承接原则 | pass |
| 是否形成 R4.2 写入边界 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写最终分层图 / 表、追溯矩阵、用例、数据、环境、门禁、evidence、验收或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.2 测试策略与分层:再写入`;只允许写入 Step 4 必读文档表、Step 3 handoff 承接、SOP 五问回答、L1-governance 框架参考边界、L3 测试分层图候选、测试分层表候选、Step 3 P0 切口到层级映射候选、E2E / release gate 使用边界、正式 §4 回填草稿候选边界、待确认事项和 Step 5 进入条件;不得直接修改正式 `05-测试方案.md`;不得写追溯矩阵、TC 编号、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。

---

## R4.2 测试策略与分层:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R5.1 |
| 用户确认 | 已确认从 `R4.1` 推进到 `R4.2`。 |
| 本模块写入范围 | Step 4 必读文档表、Step 3 handoff 承接、SOP 五问回答、L1-governance 框架参考边界、L3 测试分层图候选、测试分层表候选、Step 3 P0 切口到层级映射候选、E2E / release gate 使用边界、正式 §4 回填草稿候选边界、待确认事项和 Step 5 进入条件。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、追溯矩阵、TC 编号、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划和 implementation code。 |

### 2. 必读文档表与读取状态

| 文档 | 读取状态 | Step 4 用途 | 当前裁决 |
|---|---|---|---|
| `project_execution_ledger.md` | 已读取并承接 | 确认恢复点为 Step 4 `R4.1` completed_wait_user_confirm_to_R4.2、当前模块和 next_allowed_action。 | 当前只推进 `R4.2`。 |
| `05_test_plan_calibration_flow.md` | 已读取并承接 | 确认 Step 1~3 completed、Step 4 `R4.1` completed_wait_user_confirm_to_R4.2、Step 5+ blocked。 | `R4.2` 完成后等待 `R5.1`。 |
| `05_test_plan_step_03_test_objects_cuts.md` | 已读取并承接 | 提供 P0 测试切口、负向切口、P1/P2 seam、停审和进入 Step 4 条件。 | Step 4 不重开测试对象抽取。 |
| `测试方案讨论流程_SOP.md` | 已读取 Step 4 | 固定 Step 4 五问、分层图、分层表和进入下一步条件。 | 当前只写策略与分层。 |
| `测试方案书写规范.md` | 已读取 §5.4 / §4 入口 | 固定正式 §4 必须有分层图、分层表、执行时机和失败处理。 | 正式 `05` 留到 Step 15。 |
| `设计文档讨论中间产物规范.md` | 已读取通用纪律 | 固定逐 Step、先思考后写入、单模块推进和批次规则。 | 本轮只写 R4.2。 |
| `设计真相源闭环与可落码性标准.md` | 已承接 | 防止测试策略补 schema、port、state、mapper、config、marker 或 evidence 缺口。 | 缺正式 source 时回 owning source。 |
| `00-需求文档.md`~`04-配置设计.md` | 已承接 | 提供 P0 范围、模块边界、详细设计契约、配置 / 依赖 / redaction 红线。 | 不在 Step 4 改写上游。 |
| L1-governance Step 4 | 已对照 | 参考风险发现位置优先、分层图、分层表、切口映射和 release gate 边界。 | framework reference only。 |

### 3. Step 3 handoff 承接

| Step 3 结论 | Step 4 承接方式 | 当前状态 |
|---|---|---|
| P0 测试切口均有正式 source | Step 4 只分配发现层级,不重定义切口来源。 | pass |
| 每个 P0 切口已有推荐层级候选 | Step 4 将推荐层级收敛为主发现层级和辅助层级。 | pass |
| 负向切口已保留 | Step 4 将负向风险前置到 unit / service / fake integration,不得只靠 release gate。 | pass |
| P1/P2 seam 不阻塞 P0 | Step 4 将 P1/P2 归为 selected-run / watch,不写入 P0 阻断层。 | pass |
| Step 3 未发现 unresolved blocker | Step 4 可继续分层;若分层需要新 source,必须暂停并回写。 | pass |

### 4. SOP 五问回答

| SOP 问题 | Step 4 回答 |
|---|---|
| 哪些问题必须在 unit 层发现? | typed ref / DTO shell、truth object invariant、formal version rule、policy accept/reject、body-free guard、formal state enum、config parser / validator、redaction helper、metric label low-cardinality rule 必须在 Unit / Contract 层发现。它们不依赖 repository、adapter 或 runner,失败应阻断进入 service 测试。 |
| 哪些问题必须在 service 层验证编排? | command accepted/rejected/duplicate、query visible/empty/not-visible/degraded/partial no-write、consumer replay、outbound publisher candidate / failure mapping、operations job report / no truth repair、stored replay、commit unknown 和 safe error mapping 必须在 Application service / Flow 层验证。风险来自编排顺序和副作用边界,不能由单个 domain object 或 release smoke 证明。 |
| 哪些问题必须依赖 DB / adapter / worker 集成测试? | repository / UoW atomicity、rollback、version conflict、checkpoint resume、resolver unavailable/degraded、publisher delayed/failed、handoff failure、runtime builder assembly 和 fake parity 必须在 Repository / UoW / Adapter fake integration 层验证。P0 采用 fake / controlled seam,不要求真实 DB、bus、secret provider 或外部产品。 |
| 哪些问题需要 API / contract test? | Command、Query、Inbound、Outbound、Operations Job public shell、required fields、safe result/report/error surface、entry mapping、worker disposition 和 job runner envelope 需要 API / Worker / Job entry 层验证。该层验证入口映射和 public shell,不替代 domain invariant 或 service 编排断言。 |
| 哪些场景才需要 E2E 或 release gate? | 只有最小跨入口 smoke、P0 profile assembly smoke、redaction / dependency boundary scan、report completeness 和 evidence summary 进入 release gate。Release gate 负责汇总和阻断送验,不得替代 unit、service、fake integration 或 entry 层的具体断言。 |

### 5. L1-governance Step 4 框架参考边界

| 框架点 | L3 采用 | L3 差异 |
|---|---|---|
| 风险发现位置优先 | 采用;L3 先判断风险最早在哪层失败。 | L3 关注方法资产定义 truth、formal version、body-free 消费、config / redaction 红线。 |
| 分层图 + 分层表 | 采用;本 Step 输出候选分层图和分层表。 | 不复制 Governance 的 truth center、GRC 语义、case 或 evidence。 |
| 切口到层级映射 | 采用;Step 3 P0 切口必须映射主发现层级。 | L3 的切口来自 `03/04` 与 `03_ddd_step_16_test_cut.md`。 |
| E2E / release gate 收窄 | 采用;release gate 只做闭环证明和证据汇总。 | L3 release gate 不证明真实 DB / bus / sibling 仓完整状态机。 |

### 6. 测试分层图候选: L3-method-library 测试金字塔

```text
[Release gate / evidence summary]
  - minimum cross-entry smoke
  - profile assembly smoke
  - redaction / dependency scan
  - report completeness summary
        ^
        |
[API / Worker / Job entry]
  - public shell required fields
  - safe response / report / disposition
  - entry mapping and runner envelope
        ^
        |
[Repository / UoW / Adapter fake integration]
  - transaction / rollback / version / checkpoint
  - resolver / publisher / handoff controlled seam
  - runtime builder assembly
        ^
        |
[Application service / Flow]
  - command accepted / rejected / duplicate
  - query no-write / degraded / partial
  - consumer / outbound / job orchestration
        ^
        |
[Unit / Contract]
  - typed refs / DTO shell / object invariant
  - policy / state enum / config parser
  - redaction helper / metric label rule
```

关键说明:

- 状态、不变量、body-free、secret-free 和 config parser 错误必须前置到 Unit / Contract。
- 编排顺序、副作用边界、duplicate replay 和 query no-write 必须在 service / flow 层失败。
- P0 integration 使用 fake / controlled seam,不要求真实产品或完整跨仓 E2E。
- Release gate 只汇总最小闭环、扫描和报告完整性,不得替代底层断言。

### 7. 测试分层表候选

| 层级 | 目标 | 典型内容 | 执行时机 | 失败处理 |
|---|---|---|---|---|
| Unit / Contract | 尽早发现 schema、状态、不变量、纯规则、config 和 redaction 错误。 | typed ref、DTO shell、truth invariant、policy reject、state enum、config validator、redaction helper、metric label rule。 | PR / local / fast CI | P0 阻断;不得进入 service 证明。 |
| Application service / Flow | 验证正式 flow 编排、UoW 调用顺序、幂等、错误映射和副作用边界。 | command accepted/rejected/duplicate、query no-write、consumer replay、outbound failure mapping、job report/no truth repair。 | PR / CI service suite | P0 阻断;定位到 service / port contract。 |
| Repository / UoW / Adapter fake integration | 验证 repository、transaction、controlled seam 和 runtime builder 语义。 | rollback、version conflict、checkpoint resume、resolver unavailable/degraded、publisher failed/delayed、handoff failure、runtime assembly。 | CI integration / selected controlled seam | P0 阻断;P1 real-like 仅记录 selected-run。 |
| API / Worker / Job entry | 验证 public shell、entry mapping、safe surface 和 runner envelope。 | Command / Query required fields、safe error、worker disposition、job input/report envelope、entry response mapping。 | CI entry suite / staging smoke candidate | P0 阻断;不替代 service 断言。 |
| Release gate / Evidence summary | 验证最小闭环、profile 装配、扫描和报告汇总可交给验收。 | minimum smoke、profile assembly smoke、redaction scan、dependency scan、report completeness。 | release candidate | P0 失败阻断送验;不得伪装 P1/P2 pass。 |

### 8. Step 3 P0 切口到层级映射候选

| P0 测试切口 | 主发现层级 | 辅助层级 | 阻断 |
|---|---|---|---|
| module owner / dependency direction cut | Unit / Contract + static boundary check | Release gate summary | 是 |
| truth invariant and formal version cut | Unit / Contract | Application service | 是 |
| policy guard and body-free boundary cut | Unit / Contract | Application service / Entry | 是 |
| public shell and safe surface cut | API / Worker / Job entry | Unit / Contract | 是 |
| command accepted / rejected / duplicate orchestration cut | Application service / Flow | Repository / UoW fake integration | 是 |
| query no-write and degraded surface cut | Application service / Flow | Repository write-audit style check | 是 |
| inbound / outbound / operations job flow cut | Application service / Flow | Worker / Job entry;adapter fake integration | 是 |
| repository / UoW transaction cut | Repository / UoW fake integration | Application service | 是 |
| resolver / publisher / handoff seam cut | Adapter fake integration | Application service / Release summary | 是 |
| state machine legal / illegal transition cut | Unit / Contract | Application service | 是 |
| idempotency / replay / concurrency cut | Application service / Flow | Repository / UoW fake integration | 是 |
| config validation and profile isolation cut | Unit / Contract + runtime builder integration | Release profile smoke | 是 |
| forbidden configurable boundary cut | Unit / Contract + Application service guard | Runtime builder integration | 是 |
| no raw body / no secret / safe diagnostic cut | Unit / Contract redaction check | Artifact / release scan candidate | 是 |
| low-cardinality metric / audit refs-only cut | Unit / Contract observability rule | Artifact / release scan candidate | 是 |
| negative public shell / source / state / replay / config / observability cuts | Unit / Contract or Application service by risk family | Entry / fake integration as needed | 是 |

### 9. E2E / Release Gate 使用边界

| 场景 | 是否进入 release gate | 进入原因 | 不承担内容 |
|---|---|---|---|
| minimum cross-entry smoke | 是 | 证明最小 command / query / background entry 可运行并能汇总结果。 | 不覆盖每个 command / query / job case。 |
| profile assembly smoke | 是 | 证明 P0 profile 可以装配并启动关键测试入口。 | 不替代 config parser / validator unit。 |
| redaction scan | 是 | 证明实际输出面没有 raw body、secret 或 unsafe diagnostic。 | 不替代 redaction helper 和 safe surface 测试。 |
| dependency boundary scan | 是 | 证明依赖裁剪和 owner boundary 可重复检查。 | 不替代架构 / 模块 owner 审查。 |
| report completeness summary | 是 | 证明后续 evidence/report 能汇总各层结果。 | 当前不定义 evidence schema 或 report path。 |
| P1 real-like selected-run | 有条件 | 仅在后续正式环境和 selected-run 口径存在时执行。 | 不作为当前 P0 pass 前置。 |
| production-like / capacity / SLO | 否 | 当前为 P2 watch。 | 不作为当前 release gate 判定。 |

### 10. 正式 §4 回填草稿候选边界

正式 `05-测试方案.md` §4 只能在 Step 15 装配。本节只记录候选边界,不得当作正式正文。

| §4 候选块 | 中间产物来源 | 装配边界 |
|---|---|---|
| §4.1 校准来源与延伸阅读 | R4.2 | 引用 Step 4 中间产物,不复制旧 `05/06/07`。 |
| §4.2 测试分层图 | R4.2 §6 | 装配 L3 测试金字塔和关键说明。 |
| §4.3 测试分层表 | R4.2 §7 | 装配层级、目标、典型内容、执行时机和失败处理。 |
| §4.4 切口到层级映射 | R4.2 §8 | 装配 P0 切口主发现层级、辅助层级和阻断口径。 |
| §4.5 E2E / Release Gate 边界 | R4.2 §9 | 装配 release gate 使用边界和 P1/P2 不阻断口径。 |

### 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| repository write-audit helper 如何表达 | 影响 query no-write / job no truth repair 自动化。 | Step 9 再定义自动化或手工门禁,当前只保留层级需求。 |
| dependency boundary scan 采用脚本还是人工检查 | 影响 release gate 和 evidence 汇总。 | Step 9 / Step 13 承接。 |
| release gate smoke 的最小入口组合 | 影响 Step 6 用例和 Step 9 suite。 | 后续在 Step 6 / Step 9 收口。 |
| P1 real-like selected-run 是否升级 | 影响 P0 阻断口径。 | 当前不升级;若升级需回写上游和新版 `06/07`。 |

### 12. Step 5 进入条件

| 条件 | 状态 | 说明 |
|---|---|---|
| Step 4 分层覆盖 Step 3 全部 P0 切口 | pass | 见切口到层级映射候选。 |
| 高风险未全部推给 E2E / release gate | pass | Unit、service、fake integration 和 entry 层均有明确阻断职责。 |
| 每层目标、典型内容、执行时机和失败处理已说明 | pass | 见测试分层表候选。 |
| P1/P2 未反向抬升为 P0 | pass | release gate 边界已限定。 |
| 未提前写 Step 5+ 内容 | pass | 未写追溯矩阵、TC、数据、环境、自动化、evidence、验收或实施内容。 |
| 正式 `05-测试方案.md` 未修改 | pass | 正式正文仍留到 Step 15 装配。 |

### 13. R4.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 Step 4 必读文档表 | pass |
| 是否写入 Step 3 handoff 承接 | pass |
| 是否写入 SOP 五问回答 | pass |
| 是否写入 L1-governance 框架参考边界 | pass |
| 是否写入测试分层图候选和分层表候选 | pass |
| 是否写入 Step 3 P0 切口到层级映射候选 | pass |
| 是否写入 E2E / release gate 使用边界 | pass |
| 是否写入正式 §4 回填草稿候选边界、待确认事项和 Step 5 进入条件 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写追溯矩阵、TC、用例、数据、环境、自动化、evidence、验收或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.1 需求追溯与覆盖矩阵:先思考`;只允许思考 Step 5 开工边界、必读文档、Step 4 handoff、L1-governance Step 5 框架参考、需求 / 规则 / 设计 / 切口 / 场景 / evidence 追溯边界和 R5.2 写入边界;不得直接修改正式 `05-测试方案.md`;不得写最终追溯矩阵、TC 编号、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。
