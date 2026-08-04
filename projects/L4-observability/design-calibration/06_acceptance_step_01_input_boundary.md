# L4-observability 06-验收标准 Step 01：确认验收输入边界

## Step 状态

| 字段 | 当前值 |
|---|---|
| project / document | `L4-observability` / `06-验收标准.md` |
| step | `01 / 确认验收输入边界` |
| mode | `full-restart` |
| status | `completed_current_design_record` |
| current_module | `input_boundary_and_truthfulness` |
| formal_document_write | `not_allowed_until_step_15` |
| acceptance_execution | `not_started`;本 Step 不执行验收 |
| real artifact / report / evidence | `absent`;不得从设计期索引推定存在 |
| new_upstream_blocker | `none` |
| inherited blocker / affected | 12 项保持开放，详见 §10 |
| gate_status | `pass_for_acceptance_design_only` |
| next_allowed_action | `start_current_06_step_02` |
| commit | 不需要；用户未要求提交 |

本文件替换同名旧模板。旧模板、旧正式 `06-验收标准.md`、README 和旧 `07-实施计划.md` 仅作为
`historical_material`，其中的 `done/pass`、旧 AC/VETO、旧 suite、旧 evidence 路径和签署文本均不构成
current 验收事实。

## Step 内计划

| 计划项 | 可审查产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 读取项目级和文档级恢复点 | 台账恢复记录 | done | 当前唯一允许动作确认为 06 Step 01 |
| 读取验收 SOP、书写规范和通用标准 | 标准输入表 | done | 问题、主链、路径和真实性规则明确 |
| 读取 current `00~05` | 正式输入映射 | done | 需求、设计、配置、测试来源可定位 |
| 诊断旧 README / 旧 06 / 旧 07 | historical material 表 | done | 旧结论不进入 current truth |
| 收稳需求与测试索引 | AC/VF/TC/EV/path 索引 | done | 数量和状态与 current 上游一致 |
| 区分设计生成与真实送验门禁 | readiness 表 | done | 不把 `planned` 升级为 `passed` |
| 回填草稿与局部自检 | §12~§14 | done | 可供正式 §1 装配，未提前写正式正文 |

## 1. 本步输入与权威顺序

| 优先级 | 输入 | 本步读取内容 | 权威边界 |
|---:|---|---|---|
| 1 | `standards/document/验收标准讨论流程_SOP.md` | Step 01 问题、逐项裁决小循环、正式装配前停审 | 定义如何生成验收标准，不提供项目结论 |
| 2 | `standards/document/验收标准书写规范.md` | 15 章主链、三值结论、证据路径、来源块 | 定义正式结果结构，不证明真实交付 |
| 3 | 通用设计标准与项目台账 | full-restart、三层门禁、historical material、依赖裁剪、真实性 | 约束所有 Step 的执行和恢复 |
| 4 | current `00-需求文档.md` | `AC-OBS-001~031`、`VF-OBS-001~010`、FR/BR/DO/NFR 和非范围 | 验收目标与红线的第一来源 |
| 5 | current `01-架构设计.md` | truth owner、only-core compile dependency、运行期/事件协作边界、no-write | 架构与依赖红线来源 |
| 6 | current `02-概要设计.md` | 七模块、关键对象、接口骨架、处理流和状态轮廓 | 验收主题的结构来源，不覆盖 `03` exact contract |
| 7 | current `03-详细设计.md` | exact object/port/protocol/flow/state/UoW/error/config/telemetry contract | 字段、状态、协议和副作用判定的直接来源 |
| 8 | current `04-配置设计.md` | profile、13-stage assembly、strict source、secret/redline、降级边界 | 验收配置与环境的补充输入 |
| 9 | current `05-测试方案.md` | 99 TC、82 DS、9 suite、6 lane、5 scripts、candidate linkage 与固定路径 | 定义未来如何产生证据；不是测试结果 |
| 10 | L1 governance/artifact/identity 与 L0 bus 正式文档 | 粒度、truth owner、handoff 和依赖类型参考 | 不复制相邻项目业务主语，不替代本项目 current 文档 |

`07-实施计划.md` 是验收标准的下游承接，不是本轮 Step 01 的上游输入。它只能在正式 06 完成后引用验收门禁，
不得反向定义 AC、VETO、证据要求或当前验收状态。送验说明、交付版本、实现 commit、image、固定 run 和环境清单
当前均不存在，因此只能在 Step 03/04 定义未来必填结构和阻断语义。

## 2. SOP 问题回答

| SOP 问题 | Current 回答 | 后续落点 |
|---|---|---|
| 本轮验收依据哪些需求和设计 | 依据 current `00~05`；需求以 31 个 AC 和 10 个 VF 为入口，exact 名称与副作用以 `03` 为准，配置以 `04` 为准，证据产生合同以 `05` 为准 | Step 02~11 |
| 哪些测试证据支撑裁决 | 未来真实 run 中，由 99 个 `TC-OBS-*` 经唯一 primary suite 产生 raw artifact、suite report 和真实 evidence index；`EV-CAND-OBS-*` 当前只是 planned linkage | Step 03、05~11 |
| 哪些交付版本、环境和数据成为基线 | 必须固定实现 commit/build、不可变 `<run_id>`、selected environment lane/profile、dataset manifest、dependency/config snapshot；当前全部未建立 | Step 03~04 |
| 哪些内容属于测试方案 | 用例步骤、dataset 构造、suite 编排、脚本实现、fault injection 和运行执行由 `05` 管理；06 只定义到什么程度可裁决 | 全文边界 |
| 哪些内容属于实施计划 | phase、task、commit boundary、allowed scope、代码门禁和 implementation ledger 由后续 `07` 管理 | 不进入 06 正文 |
| 是否存在阻塞验收标准生成的上游缺口 | 无新 blocker；12 项 inherited affected 可被显式转为 blocked/conditional 门禁，不阻断设计文档生成 | Step 07、08、12、13 |
| 是否已经具备真实验收条件 | 否；目标实现仓、CI、RuntimeLike、durable store、固定 run、artifact/report、真实 evidence 和送验签署均不存在 | Step 03~04、10、14 |

## 3. 当前文档问题诊断

| 历史材料 / 旧写法 | 问题 | Current 处理 |
|---|---|---|
| 旧正式 06 只有 6 个高层 AC | 与 current `AC-OBS-001~031` 不一致，功能、规则、数据和 NFR 门禁大量缺失 | 全文替换；31 个 AC 按主题分配到 Step 05~10 |
| 旧 `VETO-OBS-001~009` | current 需求唯一红线为 `VF-OBS-001~010`，旧编号会制造第二套 truth | Step 11 只使用 `VF-OBS-*`，不得创建 alias VETO 编号 |
| `TC-OBS-GRD-001` 等旧用例 | current 99-row manifest 不含该 ID | 所有测试引用必须从 current `05` exact manifest 选取 |
| `service-flow-fast.md` 等旧报告路径 | current suite 与报告合同已改为 `S-OBS-*` 和 run-scoped canonical root | 禁止旧 suite/path 进入 current 06 |
| 旧 07 的 `local-dev/ci-test`、旧 gate 和旧 boundary | 与 current `LocalTest/IntegrationLike/RuntimeLike`、9 suite 和 detailed design 不一致 | 仅作为 historical material；正式 06 完成后再 full-restart 07 |
| README 的 TimescaleDB/Grafana/P95/147 events | 无 current 需求或可审计阈值来源 | 只能作为 historical discrepancy，不能成为验收硬门禁 |
| 设计期 `EV-CAND-OBS-*` | 名称像 evidence，易被误读为真实 alias | 所有表必须显式标注 `planned linkage`；真实 evidence 必须来自固定 run |
| 旧 `passed/signoff` 文本 | 无真实交付、run、报告或签署 | 全部作 historical；current 只定义未来裁决口径 |

## 4. Current 需求验收输入索引

### 4.1 `AC-OBS-001~031`

| ID 范围 | 数量 | 主题 | 主要验收 Step |
|---|---:|---|---|
| `AC-OBS-001~005` | 5 | 五个核心能力闭环：安全入口、审计/证据、运行观察面、只读诊断/交接、留存/no-write | Step 02、05、10 |
| `AC-OBS-006~018` | 13 | `FR-OBS-001~013` 的功能能力 | Step 05，协议细节由 Step 07/08 补强 |
| `AC-OBS-019~024` | 6 | `BR-OBS-001~026` 的规则与边界 | Step 06~08、10 |
| `AC-OBS-025~028` | 4 | `DO-OBS-001~034` 的 owned/snapshot/ref/forbidden 数据归属 | Step 06 |
| `AC-OBS-029~030` | 2 | `NFR-OBS-001~024` 的能力级与全仓质量 | Step 09~10 |
| `AC-OBS-031` | 1 | 未冻结硬指标、产品栈和实现方案不得进入验收 | Step 09、11 |
| **合计** | **31** | 每项必须进入至少一个可判定门禁，不允许只在参考中出现 | Step 15 总审计 |

### 4.2 `VF-OBS-001~010`

| ID | Current 红线主语 | 主要证据方向 |
|---|---|---|
| `VF-OBS-001` | 五个核心能力任一闭环不能成立 | release smoke + AC 总审计 |
| `VF-OBS-002` | raw body/secret/credential/payload/full sensitive ref 等进入观察或输出 | redaction/forbidden material artifact + report |
| `VF-OBS-003` | evidence/artifact/identity/governance/source audit body 入仓 | owner/schema/static + repository conformance |
| `VF-OBS-004` | projection/telemetry/handoff 冒充任一 source truth | contract/service/static truth-boundary evidence |
| `VF-OBS-005` | query/diagnostic/job/rebuild/report/export 反写 source truth 或发控制命令 | no-write capability + call-spy + static evidence |
| `VF-OBS-006` | 静态伪造 run/evidence/passed/verdict/signoff | report provenance + documentation/static scan |
| `VF-OBS-007` | retention/archive/cleanup 删除 active/held/referenced material | retention state/UoW/concurrency evidence |
| `VF-OBS-008` | 非 `L0-core` sibling 编译依赖或把 bus 作为 package dependency | dependency graph/report |
| `VF-OBS-009` | 外部观测/GRC 产品成为 truth source 或硬前置 | config/schema/dependency/static report |
| `VF-OBS-010` | README/旧文档指标、路径或 boundary 升级为 current 硬验收 | documentation/current-baseline audit |

Step 11 必须逐项保留这 10 个正式 ID，不得将多个 VF 合并成一个不可追溯的“安全红线”，也不得使用旧
`VETO-OBS-*` 作为兼容 alias。

## 5. Current 设计契约输入

| 验收主题 | 正式设计入口 | 验收使用方式 |
|---|---|---|
| truth ownership / dependency | `01` 边界与依赖；`02` 组件边界；`03` §5、§10、§13 | 检查本仓只拥有 observation-side truth，只有 `L0-core` compile edge |
| object / schema / protocol | `03` §5~§7 | 使用 exact type、variant、field、Command/Query/Consumer/Event/Job 名称，不接受口语替代 |
| exact flow / side effects | `03` §8、§14.9 | 判断 accepted/rejected/duplicate/blocked/degraded/unknown 的写集、零写与外部动作 |
| formal state | `03` §9 | 使用 27 个 formal state owner；技术协调状态单独处理 |
| persistence / UoW | `03` §10 | 判断原子性、cursor、history/outbox/result、rollback 和 source no-write |
| errors / recovery | `03` §11 | 判断 typed failure、safe detail、recovery class 和 unknown handling |
| concurrency / idempotency | `03` §12 | 判断 reservation、digest、CAS、claim/fence、same-token probe |
| config / runtime | `03` §13；`04` §4~§13 | 判断 strict source、profile、availability、13-stage complete-or-error 和 redline |
| telemetry / audit / evidence | `03` §14 | 判断 log/metric/trace/audit schema、redaction、correlation、evidence、retention、handoff |
| implementation readiness | `03` §16~§17 | inherited activation gate 只记录开放状态，不由验收设计伪关闭 |

## 6. Current 测试与证据输入

| 索引 | Current 设计基线 | 06 使用规则 |
|---|---:|---|
| canonical test cuts | 16 | 用于覆盖主题审计，不替代 exact TC |
| exact protocols | 60：16 Command + 14 Query + 9 Consumer + 12 Event + 9 Job | Step 07 必须逐 family 和 exact inventory 停审 |
| formal state owners | 27 + 1 technical coordination state | Step 08 必须使用正式名称和合法/非法 transition |
| exact test cases | 99 `TC-OBS-*` | 每个 P0 AC/VF 至少回指一个 exact TC；不得发明新 TC |
| exact datasets | 82 `DS-OBS-*` | 作为未来真实 run 的 dataset anchor，不是已创建数据 |
| primary suites | 9 `S-OBS-*` | 每个 TC 只有一个 primary suite；旧 gate 名不得使用 |
| environment lanes | 6 | 真实送验时必须记录 selected lane/profile，不允许用低保真 lane 替代必要 lane |
| script contracts | 5 | 只定义未来命令/报告关系，不声称脚本已实现 |
| candidate linkages | 99 `EV-CAND-OBS-*` | 仅 planned linkage；真实 run 后才能形成真实 evidence identity |

Canonical 路径固定为：

```text
artifacts/test/<run_id>/...
reports/runs/<run_id>/...
reports/acceptance/...
reports/review/...
```

禁止 `latest`、`artifacts/test/<project>/<run_id>`、`reports/<project>/...`、静态 passed 表或只从手写索引生成
evidence。Step 03、05~11 必须保持 `raw artifact -> suite report -> evidence index -> acceptance handoff` 的可回指链。

## 7. 验收标准必须回答的问题

1. 哪个不可变需求、设计、测试、交付、环境、配置、数据和 run 基线被送验。
2. `AC-OBS-001~031` 各自由哪些正式设计契约、exact TC、candidate-to-real evidence 槽和固定报告路径裁决。
3. 每个门禁的可判定通过条件、失败条件、缺证影响和总体结论影响。
4. `VF-OBS-001~010` 如何检查、触发后为何只能“不通过”、为何不能风险接受。
5. inherited affected、下游未就绪、环境缺失、测试未运行、commit/external outcome unknown 如何表达为
   `blocked/conditional/not_run/not_evaluated`，而不是默认通过。
6. 缺陷如何分级、修复后重跑哪些 suite/TC/check、何时允许讨论有条件通过。
7. 最终三值结论如何由门禁、证据、缺陷和风险接受共同推导，签署与归档需要哪些字段。

## 8. 验收标准不再回答的问题

| 不回答的问题 | 归属 |
|---|---|
| 是否新增需求、改变优先级或重新划分核心闭环 | `00-需求文档.md` |
| 是否改变架构单元、truth owner、依赖方向或产品选型 | `01-架构设计.md` |
| 是否新增组件、对象轮廓或接口骨架 | `02-概要设计.md` |
| 字段、enum、trait、协议、flow、状态、UoW、错误和算法如何实现 | `03-详细设计.md` |
| profile、key、source priority、secret、activation 和 rollback 如何配置 | `04-配置设计.md` |
| 用例步骤、数据构造、suite 编排、脚本实现和故障注入如何执行 | `05-测试方案.md` |
| phase、任务、commit boundary、allowed scope、提交和实现台账如何安排 | 下游 `07-实施计划.md` |
| 实际测试结果、缺陷实例、真实 evidence、最终签署和上线批准 | 真实执行/验收报告，不属于设计稿 |

## 9. 设计生成门禁与真实送验门禁

| 门禁层次 | 当前状态 | 判定 |
|---|---|---|
| 06 设计输入是否足够 | current `00~05` 已形成可追溯设计基线；现有 affected 可显式建模 | `pass_for_design` |
| 正式 06 是否可立即写入 | 否；必须先完成 current Step 02~14 和跨门禁审计 | `blocked_by_step_sequence` |
| 实现交付是否存在 | 目标实现仓 `/home/aris/Projects/quantalithos-observability` 不存在 | `not_established` |
| 真实验收 run 是否存在 | 无固定 `<run_id>`、build、commit、image、环境或 dataset manifest | `not_run` |
| raw artifact / report 是否存在 | 无真实 `artifacts/test/<run_id>` 或 `reports/runs/<run_id>` | `absent` |
| 真实 evidence / verdict / signoff 是否存在 | 无真实 `EV-OBS-*`、验收结论、接受人或签署 | `not_evaluated` |
| 当前是否允许写“通过/有条件通过” | 不允许 | `no` |

## 10. Inherited blocker / affected

| ID | 状态 | 对验收设计的影响 | 不得伪关闭的条件 |
|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | `open_upstream_internal` | I05 positive payload/schema path blocked | 无 canonical schema/encoder/registration 不得构造 positive evidence |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | `open_upstream_internal` | I05 producer binding/ack path conditional | binding 缺失时必须 pre-parse fail closed、no ack、zero write |
| `R06.6-F2-H13-UPSTREAM` | `open_controlled` | J06 positive replay blocked | 只允许 controlled `Blocked/manual`，不得造 H13 Completed truth |
| `R06-F-AFFECT-UOW-01` | `inherited_affected` | accepted write order 必须逐 flow 复验 | 不得把局部 surface closure 当全链路 closure |
| `S08-RECOVERY-CLASS-OWNER-01` | `inherited_affected` | recovery mapper/totality 需 conditional gate | owner 未闭合不得默认 retry/terminal |
| `R07-EXTERNAL-PHASE-LINK-01` | `inherited_affected` | prepare/deliver/finalize linkage 需复核 | 不得丢 historical binding/token/material |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | `inherited_affected` | unknown/probe/finalize accounting 需复核 | 不得 blind retry、换 token 或重复 external effect |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | `inherited_affected` | consumer accepted outbox surface 需复核 | 不得 ack before committed authorized snapshot |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | `inherited_affected` | unknown completion action 需复核 | 不得把 indeterminate 映射为默认 ack/retry |
| `S08-JOB-REPORT-REF-OWNER-01` | `inherited_affected` | durable report ref owner 需复核 | 不得用临时 path/ref 伪装 canonical owner |
| `S08-M1-SECONDARY-TYPE-OWNER-01` | `inherited_affected` | secondary type owner/use 需复核 | 不得创建 alias/wrapper 或退化为 String |
| `03-RPR-S09-PER-FLOW` | `open_internal_affected` | exact flow 与 Step 09 传播需复核 | 不得以 family 摘要代替 per-flow closure |

这些事项不是本 Step 新发现的 blocker，也不阻止 06 设计继续；但它们会阻断对应 positive path 的真实验收，且不能被
Step 12/13 的缺陷或风险接受规则绕过。关闭必须回到正式设计 owner，形成可审计修订后再更新测试和验收基线。

## 11. 验收裁决取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 只验 5 个核心闭环 | 拒绝 | 会遗漏 13 个 FR、规则/数据/NFR 和 10 个 VF 的 exact 裁决 |
| 直接把 99 个 TC 当 99 个验收项 | 拒绝 | 测试用例回答怎么测，不等于业务/架构门禁；会重复且失去 AC/VF 主轴 |
| 以 31 AC + 10 VF 为裁决入口，关联 exact TC/EV/path | 采用 | 保持需求真相源，同时具备可执行证据链和失败影响 |
| 用 candidate EV 作为正式 evidence | 拒绝 | 设计期 linkage 没有真实 artifact/report provenance |
| 允许 affected 以 conditional 设计继续 | 采用 | 可以完成裁决结构，但 positive path 必须保持 blocked，不能宣布通过 |
| 让下游 07 补齐验收门禁 | 拒绝 | 会反转权威顺序并迫使实现者补设计 |

## 12. 改动前后对比

| 维度 | 旧材料 | Current Step 01 |
|---|---|---|
| 需求入口 | 6 个旧高层 AC | 31 个 current AC + 10 个 current VF |
| 测试入口 | 少量旧 TC / gate | 99 exact TC、82 DS、9 suite、6 lane、5 scripts |
| evidence | 模糊 EV / passed 文本 | candidate linkage 与真实 evidence 严格分离 |
| 路径 | 旧报告名或 latest 风险 | canonical run-scoped roots，禁止 latest |
| affected | 未进入验收输入 | 12 项逐项保留 blocked/conditional 影响 |
| 07 关系 | 可能反向参与验收输入 | 明确为下游，必须在正式 06 后重建 |
| 当前状态 | 文件存在即像已验收 | 只允许 `pass_for_design`，真实验收 `not_run/not_evaluated` |

## 13. 正式 §1 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_01_input_boundary.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“本步输入与权威顺序”“Current 需求验收输入索引”“Current 测试与证据输入”和
>   “设计生成门禁与真实送验门禁”，了解正式验收输入如何与历史材料、下游计划和真实执行事实分离。

正式 `06-验收标准.md` §1 只承载以下收口结论：

1. 验收标准以 current `00~05` 为上游：`00` 定义 31 AC/10 VF，`01~04` 定义架构、对象、协议、状态、事务、
   配置和安全红线，`05` 定义 99 TC 及 run-scoped evidence 产生合同。
2. `07-实施计划.md` 是下游，不得反向定义验收门禁；旧 README、旧 06/07、旧 suite/path/指标只作
   `historical_material`。
3. 每个 P0 门禁必须闭合正式设计契约、exact TC、planned candidate linkage、固定 raw/report path、可判定通过/失败
   条件和总体裁决影响。
4. 当前没有实现仓、固定 run、artifact/report、真实 evidence、verdict 或 signoff；因此本文只定义未来裁决，不记录
   当前通过事实。
5. 12 项 inherited affected 保持开放，对应 positive path 必须 `blocked/conditional`；本轮未发现新的上游 blocker。

## 14. 待确认事项与进入下一步条件

| 检查项 | 结论 |
|---|---|
| 项目台账、06 flow 和当前 Step 是否一致 | pass |
| 是否读取验收 SOP、书写规范和 current `00~05` | pass |
| 是否把 31 AC / 10 VF 作为 current 唯一需求入口 | pass |
| 是否把 candidate EV 与真实 evidence 分离 | pass |
| 是否固定 canonical path 并禁止 `latest` | pass |
| 是否将旧 README/06/07 降级为 historical material | pass |
| 是否让下游 07 反向定义 06 | no |
| 是否伪造实现 commit/run/result/evidence/verdict/signoff | no |
| 是否保留 12 项 inherited affected | pass |
| 新上游 blocker | none |
| 真实送验 readiness | `not_ready`;不影响继续设计 Step 02 |
| gate_status | `pass_for_acceptance_design_only` |
| next_allowed_action | `start_current_06_step_02` |
