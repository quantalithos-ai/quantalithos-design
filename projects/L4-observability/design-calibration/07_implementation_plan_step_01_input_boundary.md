# L4-observability 07-实施计划 Step 01：确认实施输入边界

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 1
> 对应书写规范：`standards/document/实施计划书写规范.md` §5.1
> 回填位置：未来 current `07-实施计划.md` §1「与上游文档的关系声明」
> 文档性质：设计讨论中间产物，不是正式实施计划，不授权代码实现，不产生 commit、run、artifact、report、evidence、verdict 或 signoff。

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| project | `L4-observability` |
| document | `07-实施计划` |
| step | `Step 01 / 确认实施输入边界` |
| mode | `full-restart` |
| status | `completed_current_step_01_waiting_before_step_02` |
| current module | `implementation_input_baseline_and_readiness_boundary` |
| formal `07` | 未在本 Step 修改；现有正文和旧 Step 产物只作 `historical_material` |
| implementation repo | `/home/aris/Projects/quantalithos-observability` 不存在；未创建 |
| implementation ledger | 现有 `implementation_execution_ledger.md` 与 boundary 文件属于旧链路，未激活、未作为 current truth |
| new upstream blocker | `none` |
| inherited affected | 12 项继续开放，来自 current `03/05/06`；本 Step 不关闭、不重命名、不转成 positive capability |
| design-planning gate | `pass_with_affected_open` |
| implementation handoff gate | `blocked_until_current_07_completion_and_boundary_audit` |
| next allowed action | `wait_user_confirmation_before_step_02` |
| current commit | 不需要；用户未要求提交 |

本 Step 的两个结论必须分开理解：

1. `00~06` 已足以继续讨论并制定 `07` 的实施计划。
2. 当前尚不足以把任何代码边界交给实现 agent。实现移交必须等 current `07` 完成、全部 boundary 逐项审计、implementation ledger 与 planned boundary skeleton 重建，并完成目标仓 reality check。

## 2. Step 内计划与执行记录

| 计划项 | 预期产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 读取实施计划标准和通用标准 | 必读输入登记 | done | SOP、书写规范、台账规范、真相源标准、依赖裁剪规则和中间产物规范均已读取 |
| 读取 current `00~06` | 上游输入基线表 | done | 七份正式文档存在，状态和权威顺序可定位 |
| 读取 L1 参考粒度 | 粒度与字段完整性参考 | done | 使用 `L1-governance`、`L1-artifact`、`L1-identity`、`L0-bus` 的 current `07`/Step 01 作为参考，不复制其 truth |
| 检查旧 `07`、旧台账和 boundary 资产 | historical / conflict register | done | 旧内容不继承为 current；旧 `commit-01-a` 不视为已授权 |
| 复核字段、DTO、状态、协议、测试、验收和 phase 前置闭环 | implementation readiness matrix | done | 可规划；受影响 positive path 和真实执行仍 blocked/conditional |
| 形成回填草稿与进入下一步条件 | Step 01 中间产物 | done | 本文件完成；等待用户确认后才进入 Step 02 |

## 3. 本 Step 的 SOP 问题回答

### 3.1 当前是否具备实施计划所需的上游文档

具备。current 输入不是旧 `07` 自己，而是已经完成 full-restart 正式装配的 `00~06`：

| 上游文档 | current 文件 | 本 Step 判定 | 作为 `07` 的作用 |
|---|---|---|---|
| 需求 | `projects/L4-observability/00-需求文档.md` | available / current | 固定仓定位、FR/BR/NFR、数据归属、非目标和验收方向；不得被实施计划重写 |
| 架构 | `projects/L4-observability/01-架构设计.md` | available / current | 固定 truth owner、系统边界、依赖方向、编译期裁剪、运行期/事件协作和一致性分层 |
| 概要 | `projects/L4-observability/02-概要设计.md` | available / current | 固定七个 role crate、主要组成部分、接口族、处理流和状态轮廓；不得由 `07` 重新拆业务主体 |
| 详细 | `projects/L4-observability/03-详细设计.md` | available / current formal baseline | 作为 1:1 实现契约入口，提供 file/module、object、field、DTO、port、protocol、flow、state、UoW、error、config、telemetry 和 test-cut 来源 |
| 配置 | `projects/L4-observability/04-配置设计.md` | available / current formal baseline | 固定 typed config、profile、source/priority、sensitive boundary、activation、failure/degradation 和 historical binding 规则 |
| 测试 | `projects/L4-observability/05-测试方案.md` | available / current design baseline | 固定 60 exact protocol、27+1 state corpus、99 TC、82 DS、9 suite、6 lane、3 profile、5 script/check、evidence path 和未执行语义 |
| 验收 | `projects/L4-observability/06-验收标准.md` | available / current design baseline | 固定 31 AC、24 NFR、10 VF、证据真实性、affected 影响、缺陷/风险/最终三值裁决合同；不产生真实验收结论 |

`04-配置设计.md` 虽不是旧版实施计划 SOP 的最小六文档清单，但 current `03`、`05` 和 `06` 均把它作为实施输入；因此本项目必须将 `04` 纳入正式 `07` 的必读基线，不能沿用旧 `07` 的省略。

### 3.2 本轮实施基线是什么

本轮实施基线是 current 正式文档及其已确认 calibration 来源，权威顺序如下：

```text
current formal 00~06
  -> 对应 current design-calibration Step 产物（用于解释和追溯）
  -> 实施计划 07 的 phase / boundary / gate 转译
  -> 实现仓的真实 design baseline（未来由实际提交或可核验状态产生）
```

旧 README、旧正式 `07`、旧 `07` Step 01~13、旧 `implementation_execution_ledger.md`、旧 `implementation-boundaries/*`、旧产品栈、旧性能数字和旧协议/编号只用于冲突诊断。它们不能提供 current phase、commit boundary、实现状态或 evidence 事实。

### 3.3 详细设计是否足以支持 1:1 实现

结论是：足以支持实施计划的拆解，但尚不足以宣称所有 boundary 均可立即激活。

已闭合、可用于规划的方面：

| 复核面 | current 结论 | 规划时如何使用 |
|---|---|---|
| truth / scope | Observability 只拥有 observation-side fact、projection、marker、handoff、history/outbox/stored-result 和派生维护事实 | 每个 phase 都必须保留 observation-only 和 no-write 约束 |
| workspace / file owner | 七个 role crate：`contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`；文件 owner 已在 `03` 固定 | Step 04/05 可抽取交付物和阶段，不得新增 `common/utils` 或按产品拆 crate |
| protocol inventory | 16 Command、14 Query、9 Inbound Consumer、12 Outbound Event、9 Operations Job，共 60 exact protocol | Step 05/06 必须按 exact protocol 关联 phase/boundary，不得用 family 摘要替代 |
| state inventory | 27 formal state owner + 1 technical coordination state | 状态迁移、非法/terminal/reserved 和 technical state 必须分别进入实现门禁 |
| transaction / consistency | `TX-OBS-001~023` 与 UoW、cursor、history、outbox、result、completion、commit 顺序已定义 | 每个 mutation boundary 必须从 current `03/05/06` 读取 exact order |
| config / runtime | typed validated config、13-stage assembly、profile-local activation、registrar 和 failure semantics 已定义 | Step 03/08/06 只能引用这些来源，不新增 fallback 或隐式默认 |
| telemetry / evidence | log/metric/trace/audit、redaction、correlation、body-free linkage、retention marker、report handoff 和 canonical path 已定义 | Step 07/11/12 将其转译为可执行 gate，不把候选证据当真实 evidence |

仍不能直接激活的方面：

| 受影响面 | current 状态 | 对实施计划的限制 |
|---|---|---|
| I05 payload schema | `S08-E-I05-PAYLOAD-SCHEMA-01 = open_upstream_internal` | 只规划 pre-parse/schema fail-closed 路径；不得规划 positive decode/DTO/ack 为已可用 |
| I05 producer binding | `S08-E-I05-PRODUCER-EVENT-BINDING-01 = open_upstream_internal` | 不规划 broad subscription、任选 event 或 positive binding；需上游 owner 闭合 |
| J06 / H13 | `R06.6-F2-H13-UPSTREAM = open_controlled` | 只规划 controlled `Blocked/manual` 和 no-fabrication；不得规划 `Completed` 或 H13 positive result |
| UoW / recovery / external phase | `R06-F-AFFECT-UOW-01`、`S08-RECOVERY-CLASS-OWNER-01`、`R07-EXTERNAL-PHASE-LINK-01`、`R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | boundary 必须带 exact order、typed recovery、same-token probe/manual 和 known/unknown distinction；未闭合前不得声明 positive capability |
| Consumer completion / outbox | `S08-CONSUMER-OUTBOX-SURFACE-01`、`S08-CONSUMER-INDETERMINATE-COMPLETION-01` | 只规划 snapshot/no-write/indeterminate controlled 分支；不得默认 ack/retry/dead-letter |
| Job report ref / secondary type | `S08-JOB-REPORT-REF-OWNER-01`、`S08-M1-SECONDARY-TYPE-OWNER-01` | 不得发明 alias、wrapper、String fallback 或临时 report ref；需 owner/static closure |
| exact per-flow proof | `03-RPR-S09-PER-FLOW = open_internal_affected` | 60 协议必须逐 flow 复核；不能以 60/60 design record 等同 implementation proof |

这些项不是本 Step 新发现的 upstream blocker，而是 current 上游明确保留的 inherited affected。它们必须进入后续 `07` 的 phase/boundary gate matrix，不能被“实施计划已写完”关闭。

### 3.4 测试方案和验收标准是否足以定义阶段门禁

足以定义设计期阶段门禁，但不提供执行结果。

| 门禁输入 | current 可用结论 | 实施计划使用边界 |
|---|---|---|
| `05` exact test index | `99` TC、`82` DS、`9` suite、`6` lane、`3` profile、`5` script/check 及同 run path 已固定 | `07` 为 phase/boundary 选择 required checks；不复制完整测试步骤 |
| `06` functional / NFR / veto | `31` AC、`24` NFR、`10` VF 有来源、影响和真实性规则 | `07` 把 AC/VF 作为阶段退出和 handoff gate；不写 passed |
| evidence semantics | `EV-CAND-OBS-*` 只代表 planned linkage；真实 alias、run、artifact、report 均 absent | 实施计划只能写 future producer/consumer contract |
| target reality | implementation repo、CI、RuntimeLike、durable store、real run 均未建立 | 不能把 `cargo check`、fake、模板或设计索引写成已通过证据 |

### 3.5 是否存在上游文档之间的冲突

本轮没有发现需要回退 `00~06` 的新上游 blocker。发现的旧内容冲突均已由 current 正式链路显式隔离：

| 冲突材料 | 冲突 | current 处置 |
|---|---|---|
| 旧 `07` | 继承旧 AC/VETO 名称、旧数量、旧 phase/boundary、旧“当前 commit-01-a”状态，并把未验证实现资产写成实施输入 | 全部 historical；后续 Step 02~12 不直接消费；Step 13 从 current Step 01~12 重建正式正文 |
| 旧 implementation ledger | 写入 `not_committed_design_files_as_of_2026-07-06`、current `commit-01-a` 和“boundary skeleton 已预创建”，但没有目标仓实现事实或真实 design baseline | historical；不激活、不回填 commit/hash/status；正式 `07` 完成时重新创建/核验 |
| 旧 boundary skeleton | 允许 scope 和 checks 仍基于旧 `07`，未通过 current 07 boundary audit | historical；不能作为当前 allowed scope 或授权实现 |
| README / 产品候选 | OTel、Prometheus、Grafana、TimescaleDB、对象存储、P95/P99、冷存、147 events 等 | 只作 historical material；不进入 phase gate 或硬阈值 |
| `03/05/06` current | 设计记录和 planned linkage 可能被误读为 implementation/evidence pass | 保持 `planned`、`blocked`、`conditional`、`not_run`、`not_evaluated`；由 Step 07/11/12继续转译 |

### 3.6 哪些缺口阻塞 `07`，哪些允许继续规划

| 缺口 | 分类 | 是否阻塞继续写 `07` | 是否阻塞实现移交/相关 boundary | 处理 |
|---|---|---:|---:|---|
| 目标实现仓不存在 | implementation precondition | 否 | 是，阻塞 initialization/reality-check 之外的实现 | Step 03/08 记录；Step 05/06 规划 bootstrap boundary |
| current `00~06` 正式文档 | 已存在且 current | 否 | 否 | 作为唯一设计输入 |
| current `04` | 已存在且 current | 否 | 否 | 纳入正式 `07` 必读基线 |
| 12 inherited affected | upstream/implementation affected | 否 | 是，阻塞对应 positive boundary | 逐项绑定 phase/boundary；不得伪造关闭 |
| 真实 CI / RuntimeLike / run / evidence | execution reality absent | 否 | 是，阻塞真实 gate/acceptance | 由未来实现和测试产生；当前不声称存在 |
| actual target repo git identity / dirty state | target reality absent | 否 | 是，阻塞 commit gate | 目标仓建立后现场核验，不用 design repo 代替 |
| current `07` phase/boundary plan | 尚未按本轮重建 | 是，阻塞 formal `07` 完成 | 是，阻塞 handoff | Step 05/06/11/13 分步收敛 |
| implementation ledger / all planned boundary skeleton | 旧资产存在但非 current | 否 | 是，阻塞 handoff | Step 13 完成时同时重建并预创建 |

## 4. 当前文档问题诊断与历史材料处置

### 4.1 诊断结果

当前正式 `07-实施计划.md` 只有约 285 行，并且采用旧一轮的 8 phase / 16 boundary 摘要；它没有经过本轮 Step 01~13 的 current 门禁，因此不满足本轮正式基线要求。不能在其上追加内容或沿用其“已完成”状态。

### 4.2 处置矩阵

| 材料 | 当前分类 | 可保留内容 | 禁止继承内容 |
|---|---|---|---|
| `README.md` | `historical_material` | 横切观测、审计、redaction、correlation、retention、handoff 方向性线索 | 产品栈、性能数字、存储产品、旧目录和旧 phase |
| 旧正式 `07-实施计划.md` | `historical_material` | 章节主链和可能的路径线索，仅供差异审计 | 旧范围、旧编号、旧 phase/boundary、实现状态、commit-01-a current |
| 旧 `07_implementation_plan_step_01~13` | `historical_material` | 仅供对应 current Step 的后置差异审计 | `pass`、自动顺序执行、旧回填草稿和旧门禁结论 |
| 旧 `implementation_execution_ledger.md` | `historical_material` | 台账字段结构可参考标准 | baseline、current boundary、gate、commit 或 handoff 事实 |
| 旧 `implementation-boundaries/*` | `historical_material` | 未来可重建的文件命名线索 | allowed scope、required checks、current/active 授权或 pass |
| L1/L0 参考 `07` | reference material | 粒度、字段完整性、边界台账和交付门禁结构 | 业务 truth、crate 数量、phase 名称、commit ID 或实现事实 |

### 4.3 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 在旧 `07` 上增量修补 | 放弃 | 会把旧编号、旧 boundary 和历史实现状态带入 current；违反 full-restart 替换纪律 |
| 立即装配完整新 `07` | 放弃 | Step 02~12 尚未逐 Step 讨论，无法满足中间产物先行和用户确认门禁 |
| 先冻结输入边界，再逐步转译为 phase/boundary | 采用 | 保持上游 truth、实现规划和真实执行三层分离；后续每一步可独立审查和回滚 |
| 将 inherited affected 作为“无法继续”总 blocker | 放弃 | 它们阻塞特定 positive capability，不阻塞识别输入和规划整体实施路径；应精确绑定到相关 boundary |

## 5. 结构化中间产物

### 5.1 Current 输入基线索引

| 设计面 | 权威入口 | `07` 当前可消费的结论 | 禁止行为 |
|---|---|---|---|
| 仓定位与边界 | current `00` §1~§6、§9~§17 | observation/audit projection 基础；不拥有业务 truth、外部正文、执行 truth、archive truth 或产品 truth | 不把 log/metric/trace/report 当业务结论 |
| 架构与依赖 | current `01` §3~§12 | only-core compile dependency；相邻仓 runtime/event/ref/handoff collaboration；no reverse truth ownership | 不增加 sibling Cargo path dependency |
| 代码主体与文件 owner | current `02` §4~§12、current `03` §3~§5 | seven role crates and fixed owner boundaries | 不按旧产品或对象清单重拆 crate |
| exact contracts | current `03` §6~§9、§16 | 60 protocols、27+1 states、typed carrier and transition sources | 不发明 local alias/default/wildcard |
| consistency and recovery | current `03` §10~§13、§16.10 | UoW/order/idempotency/claim/fence/token/probe/no-write contract | 不以实现便利重排顺序或 blind retry |
| config/runtime | current `04` §2~§13 | validated config、profiles、activation/rollback/failure and historical binding | 不从 README 读取默认值或切换未授权 fallback |
| tests/evidence | current `05` §7~§14 | exact test/data/suite/lane/script/path and not-run semantics | 不将 planned linkage 变成 real evidence |
| acceptance | current `06` §5~§14 | AC/NFR/VF、三值结论、affected/risk/signoff contract | 不填写 verdict/signoff 或用风险接受关闭 VF/S |

### 5.2 1:1 可落码性复核字段

每个后续 phase/boundary 必须至少能回指以下字段来源；缺一项就只能规划为 blocked/conditional，不能交给实现 agent猜测：

| 复核项 | 必须闭合的来源 | 当前 Step 01 结论 |
|---|---|---|
| public type / field | `03` exact protocol/object cards | source exists;逐 boundary 尚未复核 |
| DTO constructor / validator | `03` protocol/flow/entry sections | source exists;I05 and affected paths conditional/open |
| state / transition | `03` state matrix + `05/06` gate mapping | source exists;27 formal owner + technical state |
| port / adapter | `03` application port and infra owner tables | source exists;physical capability未建立 |
| UoW / side-effect order | `03` §10~§13 + `TX-OBS-*` | source exists;implementation proof pending |
| idempotency / digest / token | `03` §12~§13 | source exists;affected external/consumer paths remain open |
| config binding | `04` exact registry and activation | source exists;target runtime未建立 |
| test / data / evidence | `05` exact index + `06` gate mapping | planned only;没有真实产物 |
| phase boundary | current `07` Step 05/06 | not yet defined in current restart |

### 5.3 Affected-to-plan register

| affected ID | 最早可能消费的 `07` Step | 规划要求 | 当前不能写成 |
|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | Step 05/06/07 | pre-parse fail-closed boundary and upstream closure reference | positive DTO decode/accepted consumer |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | Step 05/06/07 | finite binding slot or disabled startup path | broad subscription/ack success |
| `R06.6-F2-H13-UPSTREAM` | Step 05/06/07/09 | controlled J06 blocked/manual and no-fabrication | H13 Completed/replay result |
| `R06-F-AFFECT-UOW-01` | Step 05/06/07 | exact UoW order and commit-unknown handling per boundary | atomicity proven |
| `S08-RECOVERY-CLASS-OWNER-01` | Step 05/06/07 | existing recovery owner mapping or blocked gate | new enum/default retry |
| `R07-EXTERNAL-PHASE-LINK-01` | Step 05/06/07/08 | prepare/call/finalize relation and same-token binding | provider success / Delivered truth |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | Step 06/07/09 | probe/manual and no blind retry/new token | automatic retry completion |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | Step 05/06/07 | snapshot-only minimum surface and rollback gate | consumer-owned outbox policy |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | Step 06/07/09 | no default ack/retry; stored-result probe | success ack by default |
| `S08-JOB-REPORT-REF-OWNER-01` | Step 04/05/06/07 | canonical ref owner/mint/rehydrate or blocked | temporary report ref/Completed |
| `S08-M1-SECONDARY-TYPE-OWNER-01` | Step 04/05/06 | exact owner/static scan | alias/wrapper/String fallback |
| `03-RPR-S09-PER-FLOW` | Step 05/06/07 | one exact flow card per protocol and audit output | family summary as implementation proof |

## 6. SOP 问题逐项回答

| 问题 | 回答 |
|---|---|
| 1. 是否具备完整 `00/01/02/03/05/06`？ | 是；`04` 也已存在并作为必须输入纳入。 |
| 2. 哪些版本是基线？ | current full-restart 正式文档及其 current calibration 来源；旧 `07` 不属于基线。 |
| 3. 详细设计能否支持 1:1 实现？ | 能支持实施计划规划；逐 boundary positive activation 仍需后续审计，12 affected 和 target reality 不能忽略。 |
| 4. 测试/验收能否定义阶段门禁？ | 能定义设计期 required checks、AC/VF 影响和证据路径；不能提供执行结果。 |
| 5. 是否有冲突？ | 无新增上游 blocker；旧 `07`、旧台账和旧产品/编号与 current 冲突，已降级 historical。 |
| 6. 字段/DTO/状态/phase 是否闭环？ | 字段、DTO、状态、UoW、config、test/evidence source 已在上游存在；phase/boundary 尚未在本轮 `07` 重建，标为 pending。 |
| 7. `05/06` 是否使用正式名称？ | 是；使用 current `AC-OBS-*`、`NFR-OBS-*`、`VF-OBS-*`、`TC-OBS-*`、`DS-OBS-*`、`EV-CAND-OBS-*`、suite/lane/path 语义；旧 `VETO-*` 只出现在 historical 诊断语境或禁止扫描规则中。 |
| 8. 哪些缺口阻塞什么？ | 见 §3.6：目标仓/真实环境阻塞实现启动，affected 阻塞相关 positive boundary，current phase/boundary 未重建阻塞正式 `07` 和 handoff；均不阻塞本 Step 或后续设计讨论。 |

## 7. 回填草稿

未来正式 `07` §1 应只保留以下收口结论：

> 本实施计划承接 current `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md` 和 `06-验收标准.md`。这些文档定义需求、架构、概要、实现契约、配置、测试证据和验收裁决；本计划只把它们转译为可验证的 phase、commit boundary、测试/验收门禁和交付台账，不重新定义上游 truth。旧 `README.md`、旧正式 `07`、旧 Step/implementation ledger/boundary 资产只作 historical material。当前 `00~06` 足以继续规划，但目标实现仓和真实执行资产尚未建立，12 项 inherited affected 仍必须由后续 boundary gate 显式处理。

正式正文不得把本节的 SOP 问题回答、历史冲突表、数量核对过程或临时路径检查原样复制进去。

## 8. 待确认事项与进入下一步条件

### 8.1 待确认事项

| ID | 事项 | 当前状态 | 处理原则 |
|---|---|---|---|
| `07-INPUT-Q-01` | 用户是否确认从 Step 01 进入 Step 02 | pending user confirmation | 未确认前不读取/修改 Step 02 current 内容，不装配正式 `07` |
| `07-INPUT-Q-02` | 目标实现仓何时建立 | external reality absent | 不由设计仓创建，不在本 Step伪造存在；后续 Step 03/08 固化初始化边界 |
| `07-INPUT-Q-03` | inherited affected 的 owner 何时提供 positive closure | open upstream/affected | 先按 fail-closed/controlled 规划；不能由实现者补设计 |

### 8.2 进入 Step 02 的条件

- 用户明确确认进入 Step 02。
- 项目台账和 `07` flow 指向本文件的 current completed 状态。
- Step 02 只读取本文件、current `00`、current `03`、current `06` 及对应实施计划 SOP/书写规范片段；不得顺带消费 Step 03 以后结论。
- Step 02 继续保持旧正式 `07` 和旧 implementation 资产为 historical，直到各自 current Step 被重建。

### 8.3 Step 01 自检门禁

| 门禁 | 状态 | 证据/说明 |
|---|---|---|
| `S01-INPUT-DOCS` | pass | current `00~06` 与实施计划标准文件均存在 |
| `S01-AUTHORITY` | pass | formal `00~06` > current calibration > historical material 顺序固定 |
| `S01-DESIGN-CLOSURE` | pass_with_affected_open | 上游提供字段/DTO/state/port/config/test/acceptance 来源；12 affected 不关闭 |
| `S01-HISTORY` | pass | 旧 `07`、旧台账、旧 boundaries、README 产品/数字已分类，不作为 current |
| `S01-REALITY` | pass_design_only | target repo absent、core package path only verified；无实现/测试/evidence claim |
| `S01-HANDOFF` | blocked | current `07` 尚未完成，boundary audit/ledger skeleton 尚未重建 |
| `S01-USER-GATE` | pending | 等用户确认后进入 Step 02 |

## 9. 本 Step 完成记录

| 项 | 结果 |
|---|---|
| current 输入 | `00/01/02/03/04/05/06` 全部存在且可定位 |
| 需求规模 | 13 项核心 FR（`FR-OBS-001~013`）、6 项外围 FR（`FR-OBS-E01~E06`）、26 BR、24 NFR、31 AC、10 VF；外围 FR 不进入核心实现默认范围 |
| 实现契约规模 | 7 role crate、16 Command、14 Query、9 Consumer、12 Event、9 Job、27+1 state、23 TX |
| 测试/验收输入 | 99 TC、82 DS、9 suite、6 lane、3 profile、5 script/check；全部为设计期 planned contract |
| target reality | `/home/aris/Projects/quantalithos-observability` absent；`quantalithos-core/crates/contracts` package/path 可核验 |
| new upstream blocker | `none` |
| inherited affected | `12 open/controlled/conditional` |
| formal document changed | no |
| implementation ledger activated | no |
| next action | `wait_user_confirmation_before_step_02` |
| commit | 不需要；用户未要求提交 |
