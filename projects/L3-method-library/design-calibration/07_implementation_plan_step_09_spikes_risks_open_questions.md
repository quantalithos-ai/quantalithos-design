# Step 9. 定义 Spike、风险与待确认事项

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 9
> 回填章节: `07-实施计划.md` §9 Spike、风险与待确认事项
> 当前模块: `R9.2 spikes risks open questions:再写入`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 9 定义 Spike、风险与待确认事项 |
| 当前模块 | `R9.2 spikes risks open questions:再写入` |
| 当前状态 | completed_confirmed |
| 输入基线 | Step 1~8;`00`~`06`;`03` §17;`04` §14;`05` §11~§14;`06` §4 / §11~§14 |
| 输出文件 | `projects/L3-method-library/design-calibration/07_implementation_plan_step_09_spikes_risks_open_questions.md` |
| 停审方式 | 用户已确认 Step 9,允许进入 Step 10 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 1 输入边界 | completed_confirmed | 识别旧 `07`、旧 MethodContent / publish / snapshot / outbox / PostgreSQL 污染风险 |
| Step 5 phase | completed_confirmed | 绑定风险影响阶段和前置截止点 |
| Step 6 candidate boundary | completed_confirmed | 绑定风险到 commit boundary 开工前 / 提交前 |
| Step 7 gate matrix | completed_confirmed | 将风险与 suite、EV、VETO、artifact/report gate 对齐 |
| Step 8 config / environment / dependency | completed_confirmed | 将目标仓旧 layout、core dependency、profile、fake seam 和 artifact/report root 风险前置 |
| `03-详细设计.md` §17 | 已读取 | 提供 source-missing stop、old material pollution、实现前不得补 schema/port/mapper/state/marker 的规则 |
| `04-配置设计.md` §14 | 已读取 | 提供 config future/watch、secret/provider、P1/P2 污染和 forbidden configurable boundary 风险 |
| `05-测试方案.md` §11~§14 | 已读取 | 提供 S/A/B/R 缺陷分级、进入退出、EV-ML、artifact/report 和 residual 规则 |
| `06-验收标准.md` §4 / §11~§14 | 已读取 | 提供 VETO-ML、risk acceptance、open issues 和 final decision 规则 |
| L1-governance Step 9 | framework_reference | 只参考 Spike / risk / open question / design writeback trigger 的结构,不得复制 GOV 编号或领域事实 |

## 3. SOP 问题回答

1. 哪些技术点需要先做 Spike。

   回答: 只对会影响 boundary、gate、evidence 或 design closure 的点做 Spike。L3 需要前置 Spike 的点包括目标仓 layout bootstrap、core dependency / crate rename dry-run、config profile smoke、run-scoped report generator dry-run、query marker source dry-run、job stored report replay dry-run、event topic-neutral source dry-run、redaction/dependency/report audit dry-run。

2. 哪些风险会阻塞某个阶段。

   回答: 目标仓 layout 未迁移阻塞 PH-01;`core-contracts` path/package/lib 不闭合阻塞 commit-01-a;schema/port/state/mapper/marker/config/evidence 缺口阻塞对应 boundary;redaction leak、non-core compile dependency、query/job truth repair、static evidence、invalid P0 config silent fallback 均阻塞当前 boundary 和最终验收。

3. 哪些待确认事项会影响提交边界或验收门禁。

   回答: `core-contracts` 实际 package/lib、旧实现仓依赖保留、config skeleton 格式、report script CLI、release run_id、acceptance report 审查责任、P1 selected-run 是否执行、真实产品选型、implementation ledger 创建时点都会影响提交或验收。

4. 每个 Spike 的输出是什么。

   回答: Spike 只能输出 dry-run report、closure checklist、target repo audit、fixture list、source matrix 或可执行检查记录。不能只输出口头结论,也不能生成真实 implementation evidence 或跳过 Step 11/12。

5. 每个风险的处理方式和截止点是什么。

   回答: 风险表逐项绑定处理方式和截止点。截止点必须是 phase 开工前、boundary 开工前、boundary 提交前或 PH-11 release gate 前,不得写成无限期“后续确认”。

6. 哪些风险需要回写上游设计。

   回答: 凡涉及字段、DTO、protocol、repository/port、state transition、UoW、idempotency、query marker、job report surface、event source identity、config key/profile/source、artifact/report schema 或 EV/VETO 映射的缺口,必须回 `03/04/05/06/07` owning source 闭口。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| Step 8 | 目标实现仓存在但 layout 旧 | 如果不列 blocker,PH-01 可能沿旧 crate 主线继续 | 标为 R-ML-001 / SP-ML-001 |
| Step 6 | 25 个 candidate boundary 涉及大量 formal source | 实现期容易遇到 schema/port/marker 缺口 | 设置 design closure risk 和回写触发 |
| Step 7 | release evidence 与 VETO 依赖真实 artifact/report | 静态 evidence 风险高 | 设置 report generator / static evidence spike |
| `04` §14 | future/watch 项较多 | P1/P2 可能污染 P0 | 设置 P1/P2 residual 风险 |
| `06` §11~§14 | VETO / risk acceptance 很严格 | 不能用风险接受覆盖 hard gate | 明确不可风险接受项 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| Spike | 未集中定义 | 只保留影响 boundary/gate/evidence 的 Spike | 防止 Spike 替代实施 |
| 风险 | 分散在 `00`~`06` 和前序 Step | 统一绑定 phase、boundary、处理方式和截止点 | 防止实现侧临场判断 |
| 待确认 | Step 8 有零散项 | 形成 OQ-ML 表并绑定截止点 | 防止长期悬空 |
| 回写触发 | 散落在 `03/04/05/06` | 汇总为 design writeback trigger 表 | 防止代码私补 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 把所有未知项都列为 Spike | 保守 | Spike 过多会替代正常实现 | 不采用 |
| 只列影响 boundary/gate/evidence/design closure 的 Spike | 聚焦 | 需要执行期严格 gate | 采用 |
| 允许“后续确认”无截止 | 文档短 | blocker 会留给实现仓 | 不采用 |
| 每个风险绑定截止点和处理动作 | 可执行 | 表格较长 | 采用 |
| 风险说明中补字段/port/schema | 看似闭口 | 违反真相源职责 | 不采用 |

## 7. 结构化中间产物

### 7.1 Spike 表

| 编号 | 类型 | 描述 | 影响阶段 | 输出 | 截止点 |
|---|---|---|---|---|---|
| SP-ML-001 | spike | 目标实现仓 layout bootstrap dry-run:确认旧 `crates/method_library_*` 到正式七 crate 的迁移路径 | PH-01 | workspace audit、rename plan、`crates/jobs` gap list | commit-01-a 开工前 |
| SP-ML-002 | spike | `core-contracts` dependency dry-run:确认 path、package 名、lib crate 名和 dependency graph | PH-01 | dependency-boundary dry-run record | commit-01-a 开工前 |
| SP-ML-003 | spike | Config profile smoke:验证 `local-dev`、`ci-test`、`integration-like`、`operations-replay` 可被 skeleton validator 覆盖 | PH-01 | config smoke report and invalid profile negative case | commit-01-b 提交前 |
| SP-ML-004 | spike | Query marker source dry-run:确认 stale/degraded/unavailable/not-visible surface 有正式 source 或明确 design stop | PH-08 | marker source closure checklist | commit-08-a 开工前 |
| SP-ML-005 | spike | Event topic-neutral source dry-run:确认 inbound receipt、outbound candidate、publisher outcome 不依赖 raw payload/current truth rebuild | PH-09 | event source matrix and fixture list | commit-09-a 开工前 |
| SP-ML-006 | spike | Job stored report replay dry-run:确认 duplicate completed path 可返回 stored report,partial retry 只用 formal issue/progress | PH-10 | stored report / checkpoint closure checklist | commit-10-a 开工前 |
| SP-ML-007 | spike | Run-scoped report generator dry-run:确认 suite report、evidence index、VETO checklist 均从 raw artifact/report 推导 | PH-11 | report-generation-audit dry-run and static evidence negative fixture | commit-11-a 提交前 |
| SP-ML-008 | spike | Redaction/dependency/observability audit dry-run:确认 raw body/secret/full ref、non-core compile dependency 和 observability-as-truth 可被阻断 | PH-01~PH-11 | targeted audit dry-run record | 对应 first affected boundary 提交前 |

### 7.2 Blocker / Risk 表

| 编号 | 类型 | 描述 | 影响阶段 | 处理方式 | 截止点 |
|---|---|---|---|---|---|
| R-ML-001 | blocker | 目标实现仓 layout 仍是旧 `method_library_*`,缺 `crates/jobs`,README 仍有旧 snapshot/outbox/PostgreSQL 语义 | PH-01 | commit-01-a 先迁移 layout 并清理旧主线污染 | commit-01-a 提交前 |
| R-ML-002 | blocker | `core-contracts` path/package/lib 与正式设计不一致 | PH-01 | 暂停并修 path 或回写 `03/07` | commit-01-a 开工前 |
| R-ML-003 | blocker | non-core sibling repo 被加入 Cargo compile dependency | PH-01~PH-11 | dependency-boundary 阻断,移除依赖或回架构闭口 | 任一 manifest 改动提交前 |
| R-ML-004 | blocker | schema / DTO / port / state / mapper / marker / config / evidence source missing | PH-02~PH-11 | 暂停当前 boundary,回 owning source 闭口 | 受影响 boundary 开工前或发现时 |
| R-ML-005 | blocker | fake / in-memory / controlled seam 跳过 version、UoW、idempotency、stored replay、marker、redaction 或 report 语义 | PH-02~PH-10 | fake parity tests and service-flow gate 阻断 | 对应 fake boundary 提交前 |
| R-ML-006 | blocker | query / projection / report / observability 反写真相或 private fallback | PH-08~PH-11 | no-write tests、VETO-ML-010、observability-boundary 阻断 | 对应 boundary 提交前 |
| R-ML-007 | blocker | operations job / recovery / replay 修 core truth 或 duplicate 重新执行 mutation | PH-10 | operations-replay-core 阻断,回 `03` job/replay source | commit-10-b / 10-c 提交前 |
| R-ML-008 | blocker | raw body、secret、provider response、full sensitive ref 进入 truth、event、audit、report、artifact 或 logs | PH-03~PH-11 | redaction-boundary 阻断,不得风险接受 | first affected boundary 起 |
| R-ML-009 | blocker | release evidence index、report、VETO checklist 来自静态 JSON、手写 pass、`latest` 或默认 passed | PH-11 | report-generation-audit 阻断,重做 raw artifact 推导 | commit-11-a / 11-b |
| R-ML-010 | blocker | invalid P0 config silent fallback、partial facade 或 P0 profile unavailable marked passed | PH-01~PH-11 | config-redline 阻断 | commit-01-b 起 |
| R-ML-011 | risk | P1 real-like selected-run、durable store、real bus、external provider 未就绪 | PH-11 | 进入 residual / risk acceptance,不得计 P0 pass | release handoff |
| R-ML-012 | risk | FR-ML-E peripheral、marketplace、dashboard、standard mapping 被误设为 core 前置 | PH-07~PH-11 | peripheral residual marker;VETO-ML-008 前置检查 | commit-07-b / release |
| R-ML-013 | risk | performance/capacity/SLA 被写成 P0 hard threshold | PH-11 | 只保留 duration/count/sample/trend;硬阈值 future baseline | release report review |
| R-ML-014 | risk | design baseline 在实现期间变化导致 boundary / required_reads 失效 | PH-01~PH-11 | 每个 boundary 开工前记录 current design baseline 并重复 closure review | 每个 boundary 开工前 |

### 7.3 待确认事项表

| 编号 | 类型 | 描述 | 影响阶段 | 处理方式 | 截止点 |
|---|---|---|---|---|---|
| OQ-ML-001 | open-question | `core-contracts` 实际 package 名和 lib crate 名是否与 path dependency 一致 | PH-01 | commit-01-a 开工前实测并记录 | commit-01-a 开工前 |
| OQ-ML-002 | open-question | 旧实现仓 `sqlx`、旧 reports、旧 README 语义是否保留、移除或后置 | PH-01 | dependency-boundary and layout audit | commit-01-a 提交前 |
| OQ-ML-003 | open-question | config skeleton 的文件格式、目录和 CLI 参数名称 | PH-01 | Step 11 固定提交纪律前确认;缺口回 `04` | commit-01-b 开工前 |
| OQ-ML-004 | open-question | report/audit script CLI 名称和 dry-run 参数 | PH-11 | Step 11 固定命令口径;Step 12 固定完成判定 | commit-11-a 开工前 |
| OQ-ML-005 | open-question | release run_id 命名和 baseline 记录格式 | PH-11 | Step 12 固定占位规则,执行期填真实 run_id | commit-11-a 开工前 |
| OQ-ML-006 | open-question | `reports/acceptance/handoff.md`、VETO、risk、open issues 的审查责任人 / Agent | PH-11 | Step 11/12 固定审查入口;执行期记录 reviewer | commit-11-b 提交前 |
| OQ-ML-007 | open-question | P1 selected-run 是否在本轮执行 | PH-11 | 不作为 P0;未执行写 residual/unavailable | release handoff |
| OQ-ML-008 | open-question | 真实 DB/bus/provider/secret backend 是否提前选型 | PH-11 | 当前不进入 P0;如推进需 ADR / `03/04` 回写 | release risk acceptance |
| OQ-ML-009 | open-question | 真实 implementation ledger / boundary ledger 实例创建的准确时点 | Step 11~13 | Step 11/12/13 闭合后、实现移交前创建 | Step 13 final assembly 前 |

### 7.4 需要回写上游设计的风险触发

| 触发 | 回写目标 | 不允许的处理 |
|---|---|---|
| command / query / event / job DTO 字段无法构造 | `03-详细设计.md` protocol / object owning Step | 实现侧新增字段、默认值或字符串拼 ref |
| repository / port / UoW 缺正式读写面 | `03-详细设计.md` port / persistence / transaction owning Step | fake 私有 map、全表扫描或绕过 UoW |
| state transition / terminal guard 不闭合 | `03-详细设计.md` state matrix owning Step | domain 直接接受未定义状态 |
| marker / visibility / freshness / degraded source 缺失 | `03-详细设计.md` mapper / flow / recovery owning Step | route、timestamp、SQL/HTTP code、error text 合成 marker |
| stored result / stored report / duplicate replay surface 缺失 | `03-详细设计.md` idempotency / job owning Step | duplicate 重新执行 mutation 或重读 current truth |
| event candidate / publisher payload source 缺失 | `03-详细设计.md` event / outbound flow owning Step | sender 从 current truth 重算 payload |
| config key / profile / source / failure strategy 不闭合 | `04-配置设计.md`;必要时 `03` | entry 自行发明 env/key/secret provider |
| artifact/report schema、EV/VETO mapping 或 suite boundary 缺失 | `05-测试方案.md`;`06-验收标准.md` | 手写 report、静态 pass、扩大当前 boundary 伪覆盖 |
| phase / commit boundary scope 冲突 | 当前 `07` Step 6/7/11/12 | 实现仓自行调整 scope 或提交声明 |

### 7.5 不可风险接受项

| 类别 | 不可接受原因 | 关联门禁 |
|---|---|---|
| truth 不归属本仓或下游替代定义 | 命中 VETO-ML-001/003 | contract/service/dependency |
| 正式版本语义静默覆盖或未正式资产被正式消费 | 命中 VETO-ML-002/004 | contract/service/replay |
| raw body / secret / provider response / full ref 泄露 | 命中 VETO-ML-005/011 | redaction/report audit |
| non-core sibling compile dependency | 命中 VETO-ML-007/012 | dependency-boundary |
| source-missing stop 私补、query/job/observability 反写真相 | 命中 VETO-ML-010 | service/replay/observability |
| static evidence、`latest`、default VETO passed | 命中 VETO-ML-013 | report-generation-audit |
| invalid P0 config silent fallback | 命中 VETO-ML-014 | config-redline |

### 7.6 风险 / Spike 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| Spike 是否都有明确输出 | 通过 | dry-run report、checklist、source matrix、audit record |
| 风险是否绑定 phase / boundary | 通过 | R-ML-001~014 均有影响阶段和截止点 |
| blocker 是否明确 | 通过 | target layout、core dependency、source missing、redaction、dependency、static evidence、config fallback |
| 待确认事项是否有截止点 | 通过 | OQ-ML-001~009 均有截止点 |
| 回写上游设计触发是否明确 | 通过 | 表 7.4 |
| 是否存在长期悬空“后续确认” | 未发现 | P1/P2 和 future 均进入 residual 或 owning source trigger |
| 是否创建真实 Spike / evidence | 未创建 | 本 Step 只定义计划,不执行实现仓动作 |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_09_spikes_risks_open_questions.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“Spike 表”“Blocker / Risk 表”“待确认事项表”“需要回写上游设计的风险触发”和“不可风险接受项”小节。

正式 `07-实施计划.md` §9 后续应回填:

本轮只允许对影响 boundary、gate、evidence 或 design closure 的事项做 Spike。Spike 输出必须是 dry-run report、closure checklist、target repo audit、fixture list、source matrix 或可执行检查记录,不得用口头结论替代,也不得提前生成正式 implementation evidence。

目标实现仓旧 layout、`core-contracts` dependency 不闭合、schema/port/state/mapper/marker/config/evidence source missing、fake shortcut、query/job truth repair、raw body/secret 泄露、non-core compile dependency、static evidence、invalid P0 config silent fallback 均为 blocker。触发后不得继续当前 boundary,必须修复、回写 owning source 或调整实施计划后再恢复。

P1 real-like selected-run、durable store、real bus、external provider、production-like capacity、advanced package/marketplace/dashboard 和硬性能阈值只进入 residual / future。它们不得计入 P0 pass,也不得替代 controlled seam、blocking suite、artifact/report pair 或 VETO 审查。

## 9. 待确认事项

| 事项 | 当前结论 | 处理位置 |
|---|---|---|
| `core-contracts` package/lib 名 | 开工前实测 | commit-01-a |
| 旧实现仓依赖和 README 清理 | PH-01 审计 | commit-01-a |
| config skeleton / CLI 名 | Step 11 固定纪律前确认 | commit-01-b / Step 11 |
| report/audit script CLI | Step 11 / Step 12 收口 | commit-11-a |
| release run_id | Step 12 固定占位规则 | PH-11 |
| acceptance reports 审查责任 | Step 11/12 收口 | commit-11-b |
| P1 selected-run | residual only | release handoff |
| implementation ledger 实例创建 | Step 11/12/13 后 | Step 13 前 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| Step 8 已确认 | 通过 | 用户已确认 |
| Spike 表已定义 | 通过 | SP-ML-001~008 |
| Blocker / Risk 表已定义 | 通过 | R-ML-001~014 |
| 待确认事项已定义 | 通过 | OQ-ML-001~009 |
| design writeback trigger 已定义 | 通过 | 表 7.4 |
| 不可风险接受项已定义 | 通过 | 表 7.5 |
| 未修改正式 `07` 或实现仓 | 通过 | 本 Step 只写设计中间产物 |
| 可进入 R9.2 / Step 10 | 通过 | 用户已确认,允许推进到 Step 10 |

## 11. R9.2 用户确认记录

| 确认项 | 结论 |
|---|---|
| 用户确认 | 已确认 |
| 确认输入 | `同意` |
| 确认范围 | Step 9 Spike、风险与待确认事项中间产物 |
| 后续动作 | 推进到 Step 10 `R10.1 rollback pause change control:先思考` |
| 限制 | Step 13 前仍不得修改正式 `07-实施计划.md`;不得创建真实 implementation ledger、boundary ledger、CI、脚本、代码或 evidence |
