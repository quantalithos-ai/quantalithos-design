# L0-bus 07 实施计划 Step 9: Spike、风险与待确认事项

> 本文件是 `projects/L0-bus/07-实施计划.md` 的 Step 9 中间产物。
> 本步前置识别 L0-bus 实施中可能导致返工、延期、验收失败或上游设计回写的不确定性,并为每项定义处理方式、输出物和截止点。
> 本步不创建或修改正式 `07-实施计划.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 9 |
| 主题 | 定义 Spike、风险与待确认事项 |
| 状态 | 已确认 |
| 正式回填位置 | `07-实施计划.md` §9 |
| 是否修改正式 `07-实施计划.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_01_input_boundary.md` | 已确认 | 继承输入风险、目标仓不存在、core dependency snapshot 和正式 `07` 尚不存在的结论 |
| `07_implementation_plan_step_05_phases_dependencies.md` | 已确认 | 继承 PH-01~PH-08 阶段依赖顺序,用于绑定风险影响阶段 |
| `07_implementation_plan_step_07_tests_acceptance_gates.md` | 已确认 | 继承阶段测试门禁、验收门禁、artifact / report 输出和 VETO 前置规避 |
| `07_implementation_plan_step_08_config_env_dependencies.md` | 已确认 | 继承配置、环境、外部依赖、fake / in-memory 和 Cargo path dependency 边界 |
| `03-详细设计.md` §9~§17 | 已完成 | 提取状态、事务、幂等、并发、配置、观测、测试切口和风险 |
| `05-测试方案.md` | 已完成 | 提取 redaction、gate、artifact、report、缺陷复验和残余风险处理 |
| `06-验收标准.md` | 已完成 | 提取 AC、VETO、风险接受和最终签署口径 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 哪些技术点需要先做 Spike | `core-contracts` path dependency 和 workspace 命名、in-memory UoW 语义、outbox source ack failure / duplicate、feedback / timeout 并发、redaction scanner、artifact / report generator 需要以 Spike 或最小验证切片前置。 |
| 2. 哪些风险会阻塞某个阶段 | `core-contracts` 不可编译会阻塞 PH-01;target repo 未创建会阻塞 PH-01 编码;payload / secret 泄漏会阻塞 PH-02 起所有安全门禁;source 幂等失败阻塞 PH-04;feedback / timeout 并发错误阻塞 PH-05;replay guard 失败阻塞 PH-06;Query 写 truth 阻塞 PH-07;证据路径错误阻塞 PH-08。 |
| 3. 哪些待确认事项会影响提交边界或验收门禁 | 是否接入真实 MQ / durable store、是否改用 Git dependency、是否纯脚本生成 acceptance handoff、是否支持 hot reload、是否允许 P1 / P2 能力进入 P0 结论,都会影响提交边界或验收口径。当前均采用保守方案推进。 |
| 4. 每个 Spike 的输出是什么 | 每个 Spike 都必须输出一个可审查物:compile smoke、最小测试、失败样例、fixture、checker 输出、report 样例或决策记录。不能只输出口头结论。 |
| 5. 每个风险的处理方式和截止点是什么 | 风险必须绑定 PH 阶段和 commit boundary 截止点。P0 / P0-min 风险不得拖到 PH-08 才首次发现。 |
| 6. 哪些风险需要回写上游设计 | 如果发现 `core-contracts` 实际 API 与 `03` 不一致、配置 schema 无法支持 runtime graph、VETO 规则与测试方案不一致、或 production adapter 被迫进入 P0,必须回写 `03` / `04` / `05` / `06` 后再继续。 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 风险分散在 `03`、`05`、`06` 和 Step 8 | 实施者需要跨文档自行识别 | 可能遗漏 redaction、幂等、证据路径等阻断项 | 汇总成阶段绑定风险表 |
| Spike 与正式任务边界不清 | 一些复杂点可以作为测试先导,也可以误写成长期探索 | Spike 可能拖延或没有输出 | 每个 Spike 绑定输出和截止点 |
| 待确认事项容易长期悬空 | production adapter、Git dependency、hot reload 等都有诱惑 | 影响 P0 范围和验收结论 | 为每项列方案并自动采用推荐方案 |
| 上游回写触发条件未统一 | 实施时可能直接修改代码绕过设计 | 文档与实现分叉 | 定义必须回写的触发条件 |
| blocker 与 risk 混用 | 一些问题当前不阻塞文档,但实施时会阻塞阶段 | 可能错误继续推进 | 区分当前 blocker、阶段 blocker 和可接受风险 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| Spike | 只知道复杂点存在 | 每个 Spike 有编号、阶段、输出和截止点 | 可在阶段前验证关键不确定性 |
| 风险 | 散落在上游文档 | 形成阶段风险表 | 实施者知道何时必须停下 |
| 待确认事项 | 容易写成“后续确认” | 每项有方案、推荐方案和截止点 | 避免长期悬空 |
| blocker | 未统一分类 | 当前无文档 blocker,但存在阶段 blocker | 实施推进更清晰 |
| 上游回写 | 依赖临场判断 | 定义回写触发条件 | 防止实现绕过设计 |

---

## 6. 实施设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 不单独列 Spike,直接在阶段任务中处理 | 表面简洁 | 高风险点可能到后期才暴露 | 不采用 |
| 把所有不确定性都做成 Spike | 充分探索 | 会拖慢 P0,且可能变成研究项目 | 不采用 |
| 只对会影响阶段门禁的技术不确定性设 Spike | 聚焦可验证风险 | 需要明确输出和截止点 | 采用 |
| 待确认事项全部等用户逐项确认 | 决策显式 | 会中断自动推进 | 不采用 |
| 待确认事项列方案并采用推荐方案推进 | 可审查、不中断、可回退 | 用户仍可能后续调整 | 采用 |
| 风险只写在正式 `07` | 文档少 | 缺少讨论过程和依据 | 不采用 |
| 风险先在中间产物分类,Step 13 再回填正式文档 | 符合 SOP | 多一个归档文件 | 采用 |

---

## 7. 结构化中间产物

### 7.1 Spike 表

| 编号 | 类型 | 描述 | 影响阶段 | 输出物 | 截止点 |
|---|---|---|---|---|---|
| SP-BUS-001 | spike | 验证 `/home/aris/Projects/quantalithos-core/crates/contracts` 的 Cargo package、lib name 和 path dependency 能被目标 workspace 编译 | PH-01 | dependency snapshot、workspace compile smoke、`core-contracts` 引用样例 | `commit-01-a` 前 |
| SP-BUS-002 | spike | 验证 in-memory store / UnitOfWork 是否能表达 expected version、unique constraint、rollback 和 append-only audit | PH-02 | in-memory UoW 最小测试、rollback 失败样例、unique conflict 样例 | `commit-02-b` 前 |
| SP-BUS-003 | spike | 验证 outbox fact fixture source 对 committed-only、duplicate 和 source ack failure replay 的表达能力 | PH-04 | fixture outbox fact 样例、duplicate 测试、ack failure replay 测试 | `commit-04-a` 前 |
| SP-BUS-004 | spike | 验证 feedback、timeout、retry 和 DLQ 在 fake clock / delivery lock 下的并发冲突语义 | PH-05 / PH-06 | 并发测试样例、expected conflict 输出、无孤儿事实证明 | `commit-05-b` 前 |
| SP-BUS-005 | spike | 验证 redaction scanner 能覆盖 artifact、report、log、event payload 和 config summary 中的 forbidden body / raw secret | PH-02 / PH-07 / PH-08 | `check_redaction.sh` 最小实现、命中样例、clean 样例 | `commit-02-b` 前先完成 smoke,PH-07 前覆盖只读输出 |
| SP-BUS-006 | spike | 验证 `artifacts/test/<run_id>` 到 `reports/runs/<run_id>` 再到 `reports/acceptance` 的证据回链格式 | PH-01 / PH-08 | artifact index 样例、report link check、acceptance handoff 初稿样例 | `commit-01-b` 前建骨架,PH-08 前完整 |

### 7.2 风险表

| 编号 | 类型 | 描述 | 影响阶段 | 处理方式 | 截止点 |
|---|---|---|---|---|---|
| R-BUS-001 | risk | 目标实现仓 `/home/aris/Projects/quantalithos-bus` 当前不存在 | PH-01 | PH-01 创建目标仓并建立 workspace,不得在 design 仓实现 | `commit-01-a` 前 |
| R-BUS-002 | risk | `core-contracts` 目录、package name、lib name 或 API 与设计文档不一致 | PH-01 | 先做 SP-BUS-001;不一致时暂停并回写 `03` 或依赖说明 | `commit-01-a` 前 |
| R-BUS-003 | risk | 真实 MQ / durable store / production adapter 被提前纳入 P0 | PH-03 / PH-07 | 仅实现 port + fake / in-memory;production adapter 作为 P1 / P2 后续专项 | 每个涉及 adapter 的 commit 前 |
| R-BUS-004 | risk | payload body、raw secret、backend private body 或 governance decision body 泄漏到 truth、event、log、artifact 或 report | PH-02~PH-08 | redaction checker 前置;命中即阻断;修复后重跑受影响 suite | PH-02 smoke,PH-08 全量 |
| R-BUS-005 | risk | idempotency anchor、expected version 或 unique constraint 表达不足,导致重复 truth 或冲突不可判定 | PH-02 / PH-04 / PH-05 | SP-BUS-002 + 阶段幂等测试;冲突必须返回 existing / conflict / version conflict | `commit-05-b` 前 |
| R-BUS-006 | risk | source ack failure 或 duplicate outbox fact 造成重复 publication acceptance | PH-04 | SP-BUS-003;ack 在 truth commit 后;重复消费走幂等 | `commit-04-b` 前 |
| R-BUS-007 | risk | feedback、timeout、retry、DLQ 并发导致双终态、孤儿事实或恢复路径分叉 | PH-05 / PH-06 | SP-BUS-004;delivery lock + expected version + recovery policy 测试 | `commit-06-b` 前 |
| R-BUS-008 | risk | replay preparation 绕过 approval ref、dead-letter、history 或 audit chain | PH-06 | replay guard negative tests;缺材料只能 rejected | `commit-06-b` 前 |
| R-BUS-009 | risk | Query / projection / tap 输出反写 truth 或自动 rebuild truth | PH-07 | Query no-write 测试;projection stale 只返回 marker | `commit-07-a` 前 |
| R-BUS-010 | risk | artifact / report 目录误加 `<project>` 层、使用 `latest` 或证据链接不可回溯 | PH-01 / PH-08 | path check、link check、fixed run_id;PH-01 建骨架,PH-08 全量校验 | `commit-01-b` 和 PH-08 |
| R-BUS-011 | risk | acceptance handoff 由脚本生成后无人审查,导致 VETO、风险接受或 open issues 不可签署 | PH-08 | 脚本生成初稿,人或 Agent 审查补充;风险接受必须有 owner、deadline、retest plan | `commit-08-b` 前 |
| R-BUS-012 | risk | commit boundary 被按文件或对象拆散,导致 review 和回退困难 | PH-01~PH-08 | 一笔提交对应一个 §6 commit boundary;body 按子功能分组;使用 `git commit -F` 控格式 | 每笔提交前 |

### 7.3 待确认事项表

| 编号 | 类型 | 待确认事项 | 方案 | 推荐方案 | 影响阶段 | 截止点 |
|---|---|---|---|---|---|---|
| Q-BUS-001 | decision | 是否提前接真实 MQ / durable store / production adapter | A. P0 直接接真实后端;B. P0 只实现 port + fake / in-memory;C. 等后端选型后再启动 | 推荐 B,原因是 P0 目标是默认可验证路径,真实后端会扩大范围并阻塞主链 | PH-03 / PH-07 | `commit-03-b` 前 |
| Q-BUS-002 | decision | 是否把 `core-contracts` 改为 crates.io 或 Git dependency | A. public crates.io;B. private git tag / rev;C. 本地 sibling path dependency | 推荐 C,原因是当前所有实现仓在 `/home/aris/Projects`,尚未发布公共包 | PH-01 | `commit-01-a` 前 |
| Q-BUS-003 | decision | 目标仓不存在是否阻塞继续写实施计划 | A. 阻塞;B. 不阻塞,由 PH-01 创建;C. 在 design 仓临时实现 | 推荐 B,原因是实施计划本身应定义建仓步骤,但源码不能进入 design 仓 | PH-01 | `commit-01-a` 前 |
| Q-BUS-004 | decision | `reports/acceptance` 是否允许纯脚本生成 | A. 纯脚本;B. 脚本生成初稿 + 人或 Agent 审查补充;C. 全人工手写 | 推荐 B,原因是证据索引可自动生成,但 VETO 和风险接受需要责任判断 | PH-08 | `commit-08-b` 前 |
| Q-BUS-005 | decision | 是否在 P0 支持 config hot reload / config center | A. 支持;B. 明确拒绝 reload request;C. 先留空 | 推荐 B,原因是 runtime graph 需要冷启动可审计,hot reload 属于 P2 | PH-01 / PH-08 | `commit-01-b` 前 |
| Q-BUS-006 | decision | 是否允许 P1 / P2 能力改变 P0 验收结论 | A. 允许;B. 不允许,只作为风险或后续专项;C. 视情况决定 | 推荐 B,原因是 P0 验收必须稳定,不能依赖 production adapter、SDK、dashboard 或 governance 产品就绪 | PH-08 | `commit-08-b` 前 |

### 7.4 上游回写触发条件

| 触发条件 | 回写目标 | 当前处理 | 截止点 |
|---|---|---|---|
| `core-contracts` 实际包名、lib name、类型或 trait 与 `03-详细设计.md` 不一致 | `03-详细设计.md`、必要时 `02-概要设计.md` | 暂停 PH-01 编码,先回写设计或调整依赖说明 | `commit-01-a` 前 |
| JSON 配置无法表达 `RuntimeConfig`、profile 或 fail-fast / fail-closed 语义 | `04-配置设计.md`、`03-详细设计.md` §13 | 暂停相关 config 实现,回写配置设计 | PH-01 或 PH-08 前 |
| redaction checker 无法覆盖验收标准要求的 artifact / report / event / log 范围 | `05-测试方案.md`、`06-验收标准.md` | 暂停安全门禁通过结论,补测试或验收口径 | PH-02 smoke 或 PH-08 前 |
| 真实 MQ / durable store 被迫纳入 P0 默认路径 | `00-需求文档.md`、`01-架构设计.md`、`03-详细设计.md` | 暂停 P0 范围,重新裁剪需求和架构依赖 | PH-03 前 |
| replay preparation、DLQ、approval ref 或 audit chain 语义无法按当前设计实现 | `03-详细设计.md`、`06-验收标准.md` | 暂停 PH-06,补 recovery 状态和验收门禁 | `commit-06-a` 前 |
| report / artifact 路径规则与 standards 新规则冲突 | `05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` | 以 standards 为准回写项目文档 | PH-08 前 |

### 7.5 blocker 分类表

| 分类 | 当前是否存在 | 示例 | 处理 |
|---|---|---|---|
| 当前文档 blocker | 否 | 缺少 `00~06` 中任一必需文档 | 不存在,可继续 Step 10 |
| 阶段 blocker | 是 | `core-contracts` 不可编译、target repo 未创建、redaction 命中、VETO 命中 | 阶段内暂停,修复或回写后再继续 |
| 可接受风险 | 是 | P1 production adapter 未实现、SDK high-level client 未实现、dashboard 未上线 | 不阻塞 P0,但 PH-08 需要风险接受或后续专项记录 |
| 不可接受风险 | 是 | P0 主闭环失败、证据不可审计、forbidden body 泄漏、Query 写 truth | 不得风险接受,必须修复或判定不通过 |

---

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §9。

```markdown
## 9. Spike、风险与待确认事项

> 校准来源：
> - `design-calibration/07_implementation_plan_step_09_spikes_risks.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“Spike 表”“风险表”“待确认事项表”“上游回写触发条件”和“blocker 分类表”小节,了解哪些不确定性必须在对应阶段截止点前关闭。

本轮实施当前不存在阻塞制定实施计划的文档 blocker。实施阶段存在若干阶段 blocker,包括 `core-contracts` 不可编译、target repo 未创建、redaction 命中、source 幂等失败、replay guard 失败、Query 写 truth 和证据路径非法。

正式内容从 `design-calibration/07_implementation_plan_step_09_spikes_risks.md` §7.1~§7.5 摘录。
```

---

## 9. 待确认事项

| 事项 | 当前推荐方案 | 原因 | 影响 |
|---|---|---|---|
| 真实 MQ / durable store 是否进入 P0 | 不进入 | P0 目标是默认可验证路径,port + fake 足够 | production adapter 作为后续专项 |
| dependency 是否使用 crates.io / Git | 当前使用本地 sibling path | 当前不发布公共包,实现仓均在 `/home/aris/Projects` | 中期可切 private git tag / rev |
| target repo 不存在如何处理 | PH-01 创建 | 不阻塞文档,但阻塞编码前置 | `commit-01-a` 必须解决 |
| acceptance handoff 是否纯脚本 | 脚本初稿 + 人或 Agent 审查 | VETO、风险接受和 open issues 需要责任判断 | PH-08 必须审查 |
| hot reload 是否支持 | P0 明确拒绝 reload request | runtime graph 需要冷启动可审计 | P2 后置 |

建议方案: 接受以上推荐方案并进入 Step 10。原因是这些方案与 `00~06` 的 P0 默认可验证路径、fake / in-memory 边界、证据门禁和一票否决口径保持一致。

---

## 10. 进入下一步条件

- Spike 均有明确输出物和截止点。
- 风险均绑定影响阶段、处理方式和截止点。
- 待确认事项均给出方案、推荐方案和原因。
- 当前 blocker 与阶段 blocker 已区分。
- 上游回写触发条件已明确。
- 可以进入 Step 10,继续定义回退、暂停与变更控制。
