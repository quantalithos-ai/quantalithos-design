# Step 6. 拆分阶段任务、编写顺序与提交边界

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 6
> 回填章节: `07-实施计划.md` §6 阶段任务拆分、编写顺序与提交边界

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 6 拆分阶段任务、编写顺序与提交边界 |
| 当前状态 | 进行中;按 phase 分批写入 |
| 输入基线 | Step 5 PH-01~PH-08;`03-详细设计.md`;`05-测试方案.md`;`06-验收标准.md`;可落码性标准 §九 |
| 输出文件 | `projects/L1-governance/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` |
| 停审方式 | 用户已要求自动执行后续 Step;本 Step 完成后直接进入 Step 7 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 5 阶段总表 | 已完成 | 定义 PH-01~PH-08 的任务归属和依赖顺序 |
| `03-详细设计.md` §4~§16 | 已存在 | 提供文件布局、对象、port、protocol、flow、state、persistence、idempotency、observability 和 implementation handoff |
| `05-测试方案.md` §9 / §13 | 已存在 | 提供 suite、artifact、report、EV 证据和 release gate 切口 |
| `06-验收标准.md` §5~§14 | 已存在 | 提供 AC / VETO / risk acceptance / final decision 约束 |
| `standards/document/设计真相源闭环与可落码性标准.md` §九 | 已存在 | 提供每个 commit boundary 的开工前闭环复核项和历史经验复核项 |
| `standards/document/实施计划书写规范.md` | 已存在 | 提供 commit message、代码批次、设计者复核和实现者二次校验规则 |

## 3. SOP 问题回答

1. 每个阶段内有哪些实施动作。

   回答: 本 Step 将 PH-01~PH-08 分解为 workspace / config / scripts、contracts / domain、application service / handler、infra fake / runtime、entry runner、tests / evidence 的可验证实施动作。每个动作归属一个 phase,不跨 phase 混入。

2. 每个任务的输入、输出和完成判定是什么。

   回答: 每个 phase 的任务表给出输入、输出和完成判定。输入只引用已完成 phase、正式 `03/05/06` 和标准文档;输出限定到代码、测试、配置、脚本、artifact 或 report。

3. 阶段内代码应该按什么顺序写,为什么。

   回答: 固定顺序为 public contracts/ref/reason -> domain object/state/policy -> application ports/services/idempotency/UoW -> infra fake/runtime -> api/worker/jobs entry -> tests/evidence scripts。这样能先锁定协议和可落码真相源,再填实现,避免实现侧发明 schema。

4. 是否先锁定外部契约和测试切口,再填内部实现。

   回答: 是。每个 phase 的第一批次优先写 contracts 和测试 fixture 或 script shell,再写 domain/application。任何 service / job / publisher 在 public DTO、repository port、状态矩阵和测试切口未闭合前不得开工。

5. 哪些任务必须同提交,哪些任务必须分开提交。

   回答: 构成同一可验证增量的 contracts+domain+unit tests 可以同提交;同一 accepted flow 的 service+repo fake+handler+service tests 可以同提交。不同协议族、不同 phase、release evidence 与业务功能必须分开提交。

6. 哪些时机可以 commit,哪些时机不能 commit。

   回答: 只有当前 boundary 的代码、测试和文档证据全部通过提交前门禁后可以 commit。不能在编译失败、测试缺失、设计闭环复核存在 blocker、混入无关修改或越过后续 phase 时 commit。

7. 哪些测试必须在提交前执行。

   回答: 每个 boundary 表定义最小门禁。基础门禁至少包含 `cargo fmt --check`、`cargo check` 或对应 package check、相关 unit / service / integration test slice、`git diff --check`。release / evidence boundary 还要运行对应 scripts。

8. 是否存在提交边界过大或过小的问题。

   回答: 当前按可验证能力拆分。单个函数、单个 struct、单个文件不作为默认 commit boundary;多个无关功能不合并。预计超过 500 行的实现动作必须拆批,状态机、事务、幂等、outbox、job、projection、evidence 等高风险逻辑单独批次验证。

9. 是否存在把无关修改混入同一提交的风险。

   回答: 存在,尤其是 workspace skeleton、Cargo.lock、config profile、fixtures、test artifacts 和 report scripts。每个 boundary 都要求 `git status --short` 和 staged diff 复核,禁止混入未跟踪 `.gitignore` 或其他用户改动。

10. 每个提交边界能否用一句话描述。

    回答: 是。提交边界命名采用 `commit-xx-y` 并给出一句话目标;正式 commit message 由 Step 11 约束。

11. 每个提交边界是否可以独立 review、独立验证、必要时独立回退。

    回答: 是。每个 boundary 都有包含内容、不包含内容、提交前门禁和停审记录。无法独立 review / 验证 / 回退的 boundary 需要拆分或合并。

12. 本阶段是否存在单批代码预计超过 300 行或 500 行的实现动作。

    回答: 存在,尤其是 query surface、event consumers、outbound event payload builder、operations jobs 和 release report scripts。本 Step 将它们拆成多批次,批次控制是为了便于 review 和验证,不是压缩内容。

13. 哪些实现动作必须拆成多个代码批次。

    回答: 23 Command、14 Query、9 Consumer、12 Outbound Event、7 Job、projection rebuild、reference refresh、handoff/export、release evidence generator 都必须按协议族或 job 类型拆批。

14. 哪些状态机、事务、并发、幂等、安全、审计、错误恢复或跨仓同步逻辑必须单独批次实现。

    回答: accepted command transaction、idempotency duplicate replay、optimistic version save、visibility/not-visible query surface、projection stale / rebuild、outbox payload snapshot、publisher retry/failed、consumer receipt/dead-letter、job report duplicate replay、handoff/export partial failure、redaction/report evidence 均单独批次或 boundary。

15. 每个代码批次完成后应该执行哪些编译、格式化、lint、单测、集成测试或验收门禁。

    回答: 批次表给出最小验证。通用门禁为 formatting、package check、targeted tests、diff whitespace check;涉及 scripts/report 的批次增加 shell dry-run 或 artifact/report audit。

16. 每个代码批次与提交边界是什么关系。

    回答: 批次是编写和验证单位,commit boundary 是 review / 回退单位。多个批次可归入同一 boundary,但必须共同构成一句话可描述的可验证增量。

17. 每个 phase / commit boundary 开工前需要复核哪些字段、DTO、状态、证据和 phase boundary。

    回答: 每个 boundary 都引用 §7.1 的通用开工前设计闭环复核,并在经验复核表中列出当前适用经验项。

18. 发现详细设计、测试方案、验收标准之间冲突时,是暂停、回写设计还是调整本阶段范围。

    回答: 暂停当前 boundary,回写设计真相源并固定新 baseline;如果只是 phase scope 不合理,先调整 Step 6 / 正式 §6,再继续。实现 agent 不自行补 schema、port、状态或证据。

19. 每个 commit boundary 内有哪些协作子功能,为什么这些子功能必须同提交。

    回答: 子功能分组表按 boundary 记录。同提交的原因必须是共同形成一个可验证增量,例如 DTO + domain state + unit tests,或 service + repo fake + handler + service tests。

20. 每个 commit boundary 是否明确不包含哪些后续 boundary 内容。

    回答: 是。每个 boundary 的不包含列都明确排除后续 phase 或后续 boundary 的协议、service、entry、job、publisher、report。

21. 每个 commit boundary 涉及 command / query / event / job / outbox / projection / state / persistence / idempotency / evidence 中哪些设计面。

    回答: 经验复核表按涉及设计面列出,用于触发 `设计真相源闭环与可落码性标准.md` §九。

22. 每个 commit boundary 从可落码性标准 §九触发哪些历史经验项。

    回答: 每个 boundary 至少复核字段闭环、DTO 构造闭环、状态闭环、ref identity、validation truth、phase boundary。Query / event / job / outbox / projection / evidence boundary 额外复核对应专项经验。

23. 每个适用经验项是否已经有正式 schema、port、flow、state matrix、persistence 或测试证据位置。

    回答: 本 Step 给出设计者复核结论为“需开工前逐项确认”。若任一项缺正式证据,该 boundary 标为 blocker,不得移交实现。

24. 哪些高风险经验项被判定为不适用,不适用理由是否具体到当前 boundary。

    回答: 不适用项必须写明原因,例如 skeleton boundary 不写业务 truth,因此 outbox source identity 不适用;query boundary 不写 truth,因此 idempotency result_ref 不适用。

25. 经验复核中是否存在 blocker,是否必须先回写设计真相源并固定新 baseline。

    回答: 当前 Step 不做字段级最终审计结论,但要求每个 boundary 开工前由设计者按标准复核。发现 blocker 时必须回写 `03/05/06/07` 并固定 baseline。

26. 经验复核是否由设计者完成,是否需要在设计修复后重复核同一 boundary。

    回答: 是。设计者负责复核和修复后重复核;实现者只做 baseline 二次校验和阻塞回报。

27. 实现 agent 后续只需二次校验哪些 baseline / 文档 / 实现仓条件,发现不符时如何阻塞回报。

    回答: 实现 agent 二次校验 design commit、目标仓 HEAD、工作区干净度、当前 boundary 的正式 `03/05/06/07` 与 Step 6 表格。发现不符时暂停,给出文件行号、影响范围和建议设计闭口。

28. 每个 commit boundary 完成后是否通过停审。

    回答: 本 Step 为每个 boundary 设置停审项。执行期必须在提交前重复停审。

29. 所有 boundary 完成后,是否存在过细拆分、过粗合并、跨 phase 混入、测试门禁缺失或提交时机不清。

    回答: 当前设计层审计通过。Step 7 会进一步校准测试和验收门禁。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| Step 5 | 只有 phase,没有 commit boundary | 实施 agent 无法按提交粒度推进 | 本 Step 拆 commit-01-a 到 commit-08-b |
| `03` protocol / flow | 协议族数量大 | 容易一笔提交过大 | 按 contracts/domain、service、entry/job/publisher 分批 |
| `05` suite | suite 是最终切口 | 需要嵌入每个 boundary | 本 Step 给出提交前最小门禁,Step 7 细化 |
| `06` VETO / AC | 验收项跨阶段 | 容易最后补证据 | PH-08 只汇总证据,不新增功能 |
| 可落码性标准 §九 | 经验项多 | 容易实现时才发现 blocker | 每个 boundary 增加设计者开工前复核 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 阶段任务 | 只有 phase 目标 | 每个 phase 有任务表、批次和提交边界 | 让实施顺序可执行 |
| 提交粒度 | 未定义 | 每个 boundary 可一句话描述、可 review、可回退 | 避免大包提交或函数级碎片提交 |
| 经验复核 | 可能留给实现者现场发现 | 由设计者在移交前逐 boundary 复核 | 降低实现阻塞率 |
| 测试嵌入 | 阶段级粗粒度 | boundary 级提交前门禁 | 防止测试集中后补 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 每个对象一笔提交 | diff 小 | 不能独立验证业务能力 | 不采用 |
| 每个 phase 一笔提交 | 容易管理 | PH-04~PH-07 过大,review 风险高 | 不采用 |
| 按可验证子能力拆 boundary | review / test / rollback 清晰 | 表格较长 | 采用 |
| 把经验复核写成全局一句话 | 文档短 | 无法提前发现闭环缺口 | 不采用 |
| 每个 boundary 都写适用经验项 | 可执行、可审计 | 需要维护 | 采用 |

## 7. 结构化中间产物

### 7.1 通用开工前设计闭环复核

每个 commit boundary 开工前,设计者必须先按下表完成复核。表中“适用条件”用于避免机械套用;一旦适用但缺少正式 schema、port、flow、state matrix、persistence 或测试证据位置,该 boundary 标为 blocker。

| 复核项 | 适用条件 | 检查内容 | 失败处理 |
|---|---|---|---|
| 字段闭环 | 当前 boundary 新增或修改 domain truth / state | 必填字段、状态条件字段、reason、timestamp、actor、version、ref 来源已定义 | 暂停并回写设计 |
| DTO 构造闭环 | 当前 boundary 新增 command / event / job / query request | request / event / job 能构造目标对象或 service input | 暂停并回写协议或 flow |
| Query response 闭环 | 当前 boundary 新增 query / view / page / marker | view 字段、empty、missing、visibility、degraded、freshness surface 有来源 | 暂停并补 query/view schema |
| Projection stale 闭环 | 当前 boundary 调用 mark_stale 或 rebuild projection | affected view identity、stale cursor、rebuild source、去重/分页规则闭合 | 暂停并补 projection 读取面或 helper |
| Ref-scope 解析闭环 | 当前 boundary 从 ref 推导 project / scope / member / graph | scope DTO、resolver/repository、错误映射已定义 | 暂停并补 scope 读取面 |
| public job surface 阶段闭环 | 当前 boundary 接收 public job DTO 或返回 job report | job schema、idempotency result surface、duplicate replay、tests 同 boundary 闭合 | 暂停并调整 phase / boundary |
| job policy executable summary 闭环 | 当前 boundary 用 policy ref 做 retry / expiry / retention 判定 | policy summary 读取面和 truth 判定字段已定义 | 暂停并补 policy summary |
| history / trace / audit 构造闭环 | 当前 boundary append history / trace / audit | record id、subject、event kind、payload/source、actor、time 有来源 | 暂停并补 record factory |
| outbox source identity 闭环 | 当前 boundary append outbox 或 publish outbox | outbox record 包含 event kind、truth ref、payload snapshot、version / publication state | 暂停并补 outbox record schema |
| optimistic version 来源闭环 | 当前 boundary 更新已有 truth / marker | expected_version 来自 request / create result / get_with_version / list_with_version | 暂停并补 version 读取面 |
| idempotency 闭环 | 当前 boundary reserve duplicate operation | key、digest、result_ref、stored result / receipt / report 和 UoW 顺序闭合 | 暂停并补幂等契约 |
| config binding 闭环 | 当前 boundary 读取 config 或绑定 adapter | source priority、env key、profile、disabled/degraded/unavailable 映射闭合 | 暂停并回写配置设计 |
| artifact materialization 闭环 | 当前 boundary 生成 artifact/report | artifact root、report path、redaction、index、run_id、digest 规则闭合 | 暂停并补测试/验收证据口径 |
| phase boundary | 每个 boundary 均适用 | 不引用后续 phase 对象、结果、证据;reserved 状态不作为当前测试要求 | 调整 Step 6 或回写设计 |

### 7.2 提交前通用检查清单

| 检查 | 命令或动作 | 失败处理 |
|---|---|---|
| 工作区复核 | `git status --short` | 排除无关改动;不得提交用户未授权文件 |
| 格式检查 | `cargo fmt --check` | 修正格式后重跑 |
| 编译检查 | `cargo check` 或 package check | 当前 boundary 编译失败不得提交 |
| 目标测试 | 按 boundary 表运行 targeted tests | 失败不得提交 |
| diff 空白检查 | `git diff --check` | 修正 whitespace |
| staged diff 复核 | `git diff --cached` | 确认只包含当前 boundary |
| commit message | `git commit -F <message-file>` | 使用 Step 11 规范,不用临时交互消息 |

### 7.3 PH-01 仓初始化、配置与证据骨架

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-01-01 | 1 | 创建实现仓 workspace 与七 crate skeleton | Step 3;`03` §4 | `Cargo.toml`;`crates/contracts`;`domain`;`application`;`infra`;`api`;`worker`;`jobs` | `cargo metadata` 和 `cargo check` 可运行 |
| IMPL-01-02 | 2 | 固定 package / crate / binary 命名和 core path dependency | Step 3;`03` §4 | package 名、crate 名、path dependency | dependency boundary 检查通过 |
| IMPL-01-03 | 3 | 建立配置 profile skeleton 和 runtime config 壳 | `04` config profile | `config/profiles/*.json`;`infra::config` 壳 | config parse smoke 通过 |
| IMPL-01-04 | 4 | 建立 scripts、artifacts、reports 根目录和 dry-run shell | `05` §9 / §13;`06` report | `scripts/gates`;`scripts/reports`;`scripts/checks`;`artifacts/test`;`reports` | script `--help` 或 dry-run 通过 |
| IMPL-01-05 | 5 | 建立基础 CI 本地门禁和 README / memory handoff | standards;Step 3 memory seed | check script;local memory seed | local gate 输出固定格式 |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-01-01 | workspace 与 crate skeleton | Step 3;`03` §4 | Cargo workspace、七 crate `lib.rs` / binary stub | 100~300 行 | `cargo check`;`cargo fmt --check` | commit-01-a |
| BATCH-01-02 | dependency / naming / path boundary | Step 3 sibling dependency | core path dependency、package name、crate name | 100~200 行 | dependency boundary script 或 manual check | commit-01-a |
| BATCH-01-03 | config profile skeleton | `04` profiles | `config/profiles/local-dev.json`;`ci-test.json`;`integration-like.json`;`operations-replay.json`;config loader shell;adapter mode field skeleton | 100~300 行 | config parse smoke | commit-01-b |
| BATCH-01-04 | scripts / artifact / report roots | `05` suite path;`06` evidence path | gate/report/check script shell、artifact/report directories | 100~300 行 | scripts dry-run;`git diff --check` | commit-01-b |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-01-a | workspace、crate skeleton、dependency / naming check 全部通过后 | Cargo workspace、七 crate skeleton、core path dependency、package/crate/binary naming | config profile、业务 DTO、domain、service、test suite | `cargo fmt --check`;`cargo check`;dependency path check;`git diff --check` |
| commit-01-b | config skeleton、script shell、artifact/report root dry-run 通过后 | config profile skeleton、runtime config 壳、scripts/gates/reports/checks shell、artifacts/reports roots | 业务 flow、fake repository、真实 adapter、release evidence 结论 | config parse smoke;scripts dry-run;`cargo check`;`git diff --check` |

#### Commit boundary 子功能分组

| Commit boundary | 子功能分组 | 必须同提交的原因 | 涉及批次 | 验证门禁 | 不包含 |
|---|---|---|---|---|---|
| commit-01-a | workspace skeleton + dependency/naming | workspace 若不绑定 dependency 和命名,后续 crate 路径不稳定 | BATCH-01-01;BATCH-01-02 | `cargo check`;dependency path check | config/scripts/业务代码 |
| commit-01-b | config skeleton + script/report roots | config 和 gate/report script 都是后续证据路径前置条件 | BATCH-01-03;BATCH-01-04 | config parse smoke;scripts dry-run | 业务 DTO/domain/service |

#### PH-01 开工前设计闭环复核

| 复核项 | 检查内容 | 结论 | 失败处理 |
|---|---|---|---|
| path baseline | 目标仓路径、workspace member、crate name、binary name 与 `03` §4 一致 | 开工前确认 | 不一致则回写 `03/07` |
| config binding | profile 名、adapter kind、config source priority 与 `04` 一致 | 开工前确认 | 回写配置设计 |
| artifact materialization | artifact/report root 与 `05/06` 一致 | 开工前确认 | 回写测试/验收路径 |
| phase boundary | 不引入业务 DTO、domain、service 或 fake semantics | 通过 | 发现越界则拆出后续 boundary |

#### PH-01 Commit boundary 经验复核

| Commit boundary | 涉及设计面 | 适用经验项 | 不适用理由 | 证据位置 | 结论 | 处理 | 复核责任 |
|---|---|---|---|---|---|---|---|
| commit-01-a | workspace / path / dependency | path baseline;phase boundary | DTO/state/outbox/job/query 不适用,本 boundary 不写业务 surface | `03` §4;Step 3 | 开工前复核 | 不通过则回写 `03/07` | 设计者完成;实现者二次校验 |
| commit-01-b | config / artifact / report shell | config binding;artifact materialization;phase boundary | idempotency/outbox/query 不适用,本 boundary 只建壳 | `04`;`05` §9/§13;`06` §10 | 开工前复核 | 不通过则回写 `04/05/06/07` | 设计者完成;实现者二次校验 |

#### PH-01 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-01-a | 适中 | 是 | 是 | 保留 |
| commit-01-b | 适中 | 是 | 是 | 保留 |

#### PH-01 停审记录

| Commit boundary | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| commit-01-a | workspace skeleton 是否可编译且命名稳定 | 设计层通过 | 目标仓不存在是开工前 blocker |
| commit-01-b | config / scripts / roots 是否只建壳不造证据 | 设计层通过 | 不能生成静态 passed evidence |

### 7.4 PH-02 Governance context / input 最小 accepted 纵切

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-02-01 | 1 | 编写 context / input ref、reason、command/result DTO 和 fixtures | `03` object/protocol contracts | `contracts::{refs,commands,fixtures}` context/input 子集 | contract tests 通过 |
| IMPL-02-02 | 2 | 编写 GovernanceContext / GovernanceInput domain state、policy 和 unit tests | `03` object/state matrix | `domain::{governance_context,governance_input,policies}` | state tests 通过 |
| IMPL-02-03 | 3 | 编写 application ports、UoW、idempotency、stored result 基础面 | `03` ports/flow/persistence/idempotency | `application::{ports,unit_of_work,idempotency}` 子集 | application compile + unit tests |
| IMPL-02-04 | 4 | 编写 context/input command service 和 minimal handler | `03` function flows | service、API command handler skeleton | service-flow-fast 子集通过 |
| IMPL-02-05 | 5 | 编写 in-memory repositories、id generator、clock、runtime assembly | `03` persistence;`04` fake profile | infra fake 子集 | integration-like service tests 通过 |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-02-01 | context/input command-side public DTO 与 fixtures | `03` Step 8 command contracts | refs、commands、command results、fixtures;包含 `GovernanceInputCommandResult.actor_ref` | 200~400 行;必要时拆 context/input 两批 | contract tests;`cargo check -p governance-contracts` | commit-02-a |
| BATCH-02-02 | context/input domain state | `03` Step 6/10 | domain objects、state transitions、policy errors;包含 `GovernanceInput.actor_ref` truth field 和 receive/transition actor 更新测试 | 200~400 行;状态机单独验证 | domain tests;`cargo check -p governance-domain` | commit-02-a |
| BATCH-02-03 | application base ports / UoW / idempotency | `03` Step 7/11/13 | repository traits、idempotency repository、stored result surface | 200~400 行 | `cargo check -p governance-application` | commit-02-b |
| BATCH-02-04 | context/input service + handler | `03` Step 9 flows | command service、handler、error mapping | 200~400 行 | service-flow-fast targeted | commit-02-b |
| BATCH-02-05 | infra fake + runtime wiring | `03` Step 11;`04` fake | in-memory repo、clock/id gen、runtime builder slice | 200~400 行 | infra-runtime-fake targeted | commit-02-b |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-02-a | context/input contracts、fixtures、domain state 和 unit tests 通过后 | context/input refs、command/result DTO、fixtures、domain objects、policy/state tests;`GovernanceInput.actor_ref` 与 `GovernanceInputCommandResult.actor_ref` 必须在本 boundary 闭合 | application service、repository fake、handler、Gate/Decision/Policy、Query/View DTO、projection/read model | contract-domain-fast context/input slice;`cargo check`;`git diff --check` |
| commit-02-b | context/input command service 纵切和 fake runtime tests 通过后 | application ports/UoW/idempotency基础、context/input services、minimal handler、in-memory repo、service tests;`SubmitGovernanceInput` 只保存 `Received`;`UpdateGovernanceInputState` 承接 accepted / pending evidence / rejected / superseded;repository/fake 必须持久化和回读 `GovernanceInput.actor_ref` | Gate/Decision/Approval、Query/View DTO、Consumer、Outbox publisher、Job | service-flow-fast slice;infra-runtime-fake slice;`cargo check`;`git diff --check` |

#### Commit boundary 子功能分组

| Commit boundary | 子功能分组 | 必须同提交的原因 | 涉及批次 | 验证门禁 | 不包含 |
|---|---|---|---|---|---|
| commit-02-a | command-side public DTO + domain state + state tests | DTO 和 domain factory/state 构成最小 truth contract;actor surface 只覆盖 command result 和 domain truth | BATCH-02-01;BATCH-02-02 | contract-domain-fast slice | application service / repository fake / query view |
| commit-02-b | ports/UoW/idempotency + service + fake runtime | context/input command flow 需要 transaction、idempotency、repository fake 同时闭合才能验证;fake 必须承接 `actor_ref` persistence logical contract;`SubmitGovernanceInput` receive-only 与 `UpdateGovernanceInputState` transition 分工必须同时验证 | BATCH-02-03~BATCH-02-05 | service-flow-fast;infra-runtime-fake | Gate/Decision/Policy/Query/Event/Job |

#### PH-02 开工前设计闭环复核

| 复核项 | 检查内容 | 结论 | 失败处理 |
|---|---|---|---|
| 字段闭环 | GovernanceContext / GovernanceInput 必填字段、state、reason、actor、time、source ref 均有来源 | 开工前确认 | 缺字段来源则回写 `03` Step 6/8/9 |
| DTO 构造闭环 | CreateGovernanceContext / SubmitGovernanceInput / UpdateGovernanceInputState request 能构造 domain factory / transition | 开工前确认 | 回写 protocol 或 flow |
| 状态闭环 | state matrix 中 initial / accepted / updated / rejected 等状态与 domain/tests一致 | 开工前确认 | 回写 state matrix |
| optimistic version 来源闭环 | update existing input 的 expected_version 来源明确 | 开工前确认 | 补 get_with_version 或 request version |
| idempotency 闭环 | command metadata、key、digest、stored result、UoW 顺序闭合 | 开工前确认 | 回写 Step 7/8/9/13 |
| outbox source identity 闭环 | accepted command 若 append outbox,record source identity/payload snapshot 已闭合 | 开工前确认 | 补 outbox record 或调整 PH-02 不发布 |
| history / trace / audit 构造闭环 | trace/audit/change record id、subject、kind、actor/time 有来源 | 开工前确认 | 补 id generator / record schema |
| phase boundary | 不提前实现 Gate/Decision/Policy/Query/Event/Job | 通过 | 越界内容移至后续 boundary |

#### PH-02 actor surface boundary clarification

`GovernanceInput.actor_ref` 已在 `03` Step 6 truth object、Step 8 command result、Step 10 state matrix 和 Step 11 logical persistence contract 中闭合,但这些正式 surface 分属不同 commit boundary:

| Surface | 正式来源 | 实施 boundary | 当前 boundary 口径 |
|---|---|---|---|
| `GovernanceInput.actor_ref` truth field | `03` Step 6 object contract / Step 10 state matrix | commit-02-a | 必须实现 domain 字段、factory 参数、状态迁移 actor 更新和 domain tests |
| `GovernanceInputCommandResult.actor_ref` | `03` Step 8 command result DTO | commit-02-a | 必须实现 command-side result DTO / fixtures / contract tests |
| `governance_inputs.actor_ref` logical persistence | `03` Step 11 persistence contract | commit-02-b | 不属于 commit-02-a;由 repository trait、UoW、in-memory fake 和 service-flow tests 承接 |
| `GovernanceInputView.actor_ref` | `03` Step 8 query/view protocol | commit-05-a | 不属于 commit-02-a/02-b;由 query/view DTO、projection/read model identity 和 query fixtures 承接 |

因此,实现 commit-02-a 时不得为了 actor_ref 闭环提前实现 `GovernanceInputView`、query repository、projection state 或 persistence fake。commit-02-a 只要求 actor 在 domain truth 和 command result surface 可构造、可测试。commit-02-b 再验证 repository/fake 能保存并回读该字段;commit-05-a 再让 query view 暴露该字段。

#### PH-02 Commit boundary 经验复核

| Commit boundary | 涉及设计面 | 适用经验项 | 不适用理由 | 证据位置 | 结论 | 处理 | 复核责任 |
|---|---|---|---|---|---|---|---|
| commit-02-a | command DTO / domain state | 字段闭环;DTO 构造闭环;状态闭环;ref identity;phase boundary;phase-reserved surface 标注 | Query/job/projection/read view/persistence fake 不适用,本 boundary 不写 read/job/repository fake | `03` Step 6/8/10;本 Step actor surface boundary clarification | 通过:actor_ref 仅覆盖 truth field 和 command result | blocker 则回写 `03/07` | 设计者完成;实现者二次校验 |
| commit-02-b | command flow / persistence / idempotency / trace / outbox | validation truth;optimistic version;idempotency;history/trace/audit;outbox source identity;phase boundary | Query/job 不适用;`GovernanceInputView` 仍不适用 | `03` Step 7/9/11/13/15;本 Step actor surface boundary clarification | 开工前复核 | blocker 则回写 `03/05/06/07` | 设计者完成;实现者二次校验 |

#### PH-02 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-02-a | 适中 | 是 | 是 | 保留 |
| commit-02-b | 适中 | 是 | 是 | 保留 |

#### PH-02 停审记录

| Commit boundary | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| commit-02-a | context/input DTO 与 domain state 是否能单独验证 | 设计层通过 | actor_ref 只落 command result + domain truth;不得前移 query view 或 persistence fake |
| commit-02-b | context/input command flow 是否闭合 transaction/idempotency/repo fake | 设计层通过 | repository/fake 需承接 actor_ref 持久化;`SubmitGovernanceInput` 不做 accepted / pending evidence;GovernanceInputView 仍留到 commit-05-a |

### 7.5 PH-03 Gate / Decision / Approval 正式裁决纵切

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-03-01 | 1 | 编写 Gate / Decision / ApprovalResponsibility public DTO、ref、reason、fixtures | `03` protocol/object contracts | contracts gate/decision/approval 子集 | contract tests 通过 |
| IMPL-03-02 | 2 | 编写 Gate / GovernanceDecision domain local state 和 tests | `03` object/state matrix | `domain::{gate,decision}` | state tests 通过;不得依赖 ApprovalResponsibility / ResponsibilityChain / SharedRuleSet object |
| IMPL-03-03 | 3 | 编写 ApprovalResponsibility / requirement / delegation domain state、policy 和 tests | `03` approval object/state | `domain::approval_responsibility` | approval state tests 通过 |
| IMPL-03-04 | 4 | 扩展 application ports 和 in-memory repositories | `03` port/persistence | gate/decision/approval repositories | repository version tests 通过 |
| IMPL-03-05 | 5 | 编写 OpenGate / RecordDecision / SupersedeDecision / approval command services and handlers | `03` function flows | services、handlers、stored result、trace/outbox | service-flow-fast 裁决 slice 通过 |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-03-01 | Gate / Decision contracts | `03` Step 8 | refs、commands、results、fixtures | 200~400 行 | contract tests | commit-03-a |
| BATCH-03-02 | Gate / Decision local domain | `03` Step 6/10 | domain state、ref-only transition、unit tests | 200~400 行 | domain tests | commit-03-a |
| BATCH-03-03 | Approval contracts/domain | `03` Step 6/8/10 | responsibility、requirement、vote、delegation DTO/domain/tests | 300~500 行;必要时拆 vote/delegation | contract-domain-fast | commit-03-b |
| BATCH-03-04 | repositories and services | `03` Step 7/9/11/13 | ports、repos、services、handlers、tests | 300~500 行;事务/idempotency 单独验证 | service-flow-fast | commit-03-c |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-03-a | Gate / Decision DTO、domain local state 和 tests 通过后 | OpenGate、RecordDecision、SupersedeDecision contracts;Gate / GovernanceDecision 本地 state tests;Gate pending 只允许 ref-only `request_decision_by_ref` surface | ApprovalResponsibility / ResponsibilityChain / SharedRuleSet object dependency;DecisionPolicy;application service;Query;Consumer | contract-domain-fast gate/decision slice;`cargo check`;`git diff --check` |
| commit-03-b | ApprovalResponsibility DTO、domain state、vote/delegation tests 通过后 | Assign/RecordVote/Delegate approval contracts/domain/tests | application service、query projection、policy/compliance | contract-domain-fast approval slice;`cargo check`;`git diff --check` |
| commit-03-c | 裁决与 approval command service、handler、repo fake tests 通过后 | repositories、application services、handlers、stored results、trace/history/outbox accepted path、DecisionPolicy responsibility-chain guard;OpenGovernanceGate requirement path same-command `request_decision_by_ref(...)` binding and `ResponsibilityTraceRecord` append | PH-04 shared rule body evaluation、policy/control/compliance/NC、query/event/job;RecordGovernanceDecision precheck 不执行 `Open -> PendingDecision` | service-flow-fast decision/approval slice;infra-runtime-fake;`git diff --check` |

#### Commit boundary 子功能分组

| Commit boundary | 子功能分组 | 必须同提交的原因 | 涉及批次 | 验证门禁 | 不包含 |
|---|---|---|---|---|---|
| commit-03-a | gate/decision contracts + local domain | Gate 和 Decision 构成同一正式裁决核心,但本提交只验证不依赖 approval object 的本地状态 | BATCH-03-01;BATCH-03-02 | contract-domain-fast | approval service / DecisionPolicy / shared rules guard |
| commit-03-b | approval responsibility contracts + domain | vote/delegation/requirement 共用 responsibility state 和 policy | BATCH-03-03 | contract-domain-fast | application service |
| commit-03-c | repositories + command services + handlers + decision policy guard | 裁决 accepted flow 需要 repo version、UoW、stored result、trace/outbox 和 responsibility-chain guard 同时闭合 | BATCH-03-04 | service-flow-fast;infra-runtime-fake | PH-04 shared rule body evaluation;query/event/job |

#### PH-03 开工前设计闭环复核

| 复核项 | 检查内容 | 结论 | 失败处理 |
|---|---|---|---|
| 字段闭环 | Gate、Decision、ApprovalResponsibility、Requirement、Vote、Delegation 的 required fields 有来源 | 开工前确认 | 回写 object/protocol contract |
| DTO 构造闭环 | command request 能构造 open/record/supersede/assign/vote/delegate transition | 开工前确认 | 回写 Step 8/9 |
| 状态闭环 | gate state、decision state、responsibility state、vote/delegation transition 与 matrix 一致 | 开工前确认 | 回写 Step 10 |
| validation truth 闭环 | actor capability、context/input、policy guard、supersede target、delegate target 有正式 repository/resolver;commit-03-a 不得要求 approval/shared-rule body | 开工前确认 | 回写 Step 7/9 |
| optimistic version 来源闭环 | update/supersede/vote/delegate expected_version 来源明确 | 开工前确认 | 补 versioned read |
| history/trace/audit/outbox | accepted path 的 record id、subject、kind、payload source 闭合 | 开工前确认 | 补 record / outbox schema |
| phase boundary | 不提前实现 DecisionPolicy / Approval service / Policy / Control / Query / Event / Job;PH-04 shared rule body evaluation 不进入 PH-03 | 通过 | 越界移出 |

#### PH-03 Commit boundary 经验复核

| Commit boundary | 涉及设计面 | 适用经验项 | 不适用理由 | 证据位置 | 结论 | 处理 | 复核责任 |
|---|---|---|---|---|---|---|---|
| commit-03-a | command/local state | 字段闭环;DTO构造闭环;状态闭环;phase boundary;ref-only transition | Query/job、application service、DecisionPolicy、ApprovalResponsibility / ResponsibilityChain / SharedRuleSet body 不适用 | `03` Step 6/8/9/10 | 开工前复核 | blocker 回写设计 | 设计者完成;实现者二次校验 |
| commit-03-b | command/state/delegation | 字段闭环;DTO构造闭环;public target 穷尽闭环;状态闭环;phase boundary | Outbox publish/job 不适用 | `03` Step 6/8/9/10 | 开工前复核 | blocker 回写设计 | 设计者完成;实现者二次校验 |
| commit-03-c | flow/persistence/idempotency/outbox/policy guard | optimistic version;idempotency;history/trace/audit;outbox source identity;validation truth;responsibility-chain guard | Query/job、PH-04 shared rule body evaluation 不适用 | `03` Step 7/9/11/13/15 | 开工前复核 | blocker 回写设计 | 设计者完成;实现者二次校验 |

#### PH-03 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-03-a | 适中 | 是 | 是 | 保留 |
| commit-03-b | 适中 | 是 | 是 | 保留 |
| commit-03-c | 偏大但可验证 | 是 | 是 | 若 service 超过 500 行,按 Gate/Decision 与 Approval service 批次拆写但同 boundary review |

#### PH-03 停审记录

| Commit boundary | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| commit-03-a | Gate / Decision 是否为同一可验证裁决增量 | 设计层通过:只覆盖 DTO 与本地状态,不覆盖 DecisionPolicy / approval chain | 开工前复核 ref-only transition 与 phase boundary |
| commit-03-b | Approval vote / delegation 是否同属 responsibility state | 设计层通过 | 开工前复核 target 穷尽 |
| commit-03-c | accepted service 是否不依赖 query/event/job | 设计层通过 | 开工前复核 trace/outbox source |

### 7.6 PH-04 Policy / Control / Compliance / Nonconformity 治理事实纵切

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-04-01 | 1 | 编写 PolicyEffectiveFact / SharedRuleSet / PolicyConflict contracts、domain、tests | `03` policy object/protocol/state | policy/sharing/conflict DTO/domain | contract-domain-fast policy slice |
| IMPL-04-02 | 2 | 编写 ControlApplicability / ControlReview contracts、domain、tests | `03` control object/protocol/state | control DTO/domain | contract-domain-fast control slice |
| IMPL-04-03 | 3 | 编写 AIIAConclusion / SoAConclusion / Compliance approval contracts、domain、tests | `03` compliance object/protocol/state | compliance DTO/domain | contract-domain-fast compliance slice |
| IMPL-04-04 | 4 | 编写 Nonconformity / CorrectiveAction / VerificationResult contracts、domain、tests | `03` NC object/protocol/state | NC / CA / verification DTO/domain | contract-domain-fast NC slice |
| IMPL-04-05 | 5 | 编写 policy/control/compliance/NC application services、repos、handlers、redaction targeted tests | `03` flows/ports/persistence;`05` redaction | services、fake repos、handlers、tests | service-flow-fast + redaction targeted |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-04-01 | policy/shared rules/conflict contracts+domain | `03` Step 6/8/10 | DTO、domain、state tests | 300~500 行;conflict 可单独批 | contract-domain-fast | commit-04-a |
| BATCH-04-02 | control applicability/review contracts+domain | `03` Step 6/8/10 | DTO、domain、state tests | 200~400 行 | contract-domain-fast | commit-04-b |
| BATCH-04-03 | compliance conclusion contracts+domain | `03` Step 6/8/10 | AIIA/SoA/approval DTO、domain、tests | 300~500 行 | contract-domain-fast | commit-04-b |
| BATCH-04-04 | nonconformity/corrective action/verification contracts+domain | `03` Step 6/8/10 | NC/CA/verification DTO、domain、tests | 300~500 行;可按 NC/CA 拆写 | contract-domain-fast | commit-04-c |
| BATCH-04-05 | services/repos/handlers/redaction | `03` Step 7/9/11/13;`05` redaction | ports、repos、services、handlers、redaction tests | 500 行以上;按 policy/control/compliance/NC 服务分批 | service-flow-fast;redaction-boundary targeted | commit-04-d |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-04-a | policy/shared rules/conflict contracts/domain tests 通过后 | PolicyEffectiveFact、SharedRuleSet、PolicyConflictRecord DTO/domain/tests | control/compliance/NC service、query/event/job | contract-domain-fast policy slice;`cargo check`;`git diff --check` |
| commit-04-b | control + compliance contracts/domain tests 通过后 | ControlApplicability、ControlReview、AIIAConclusion、SoAConclusion、Compliance approval DTO/domain/tests | NC、application service、query/event/job | contract-domain-fast control/compliance slice;`cargo check`;`git diff --check` |
| commit-04-c | NC / corrective action / verification contracts/domain tests 通过后 | NonconformityRecord、CorrectiveAction、VerificationResult DTO/domain/tests | application services、query/event/job | contract-domain-fast NC slice;`cargo check`;`git diff --check` |
| commit-04-d | PH-04 application services、handlers、fake repos 和 redaction targeted tests 通过后 | policy/control/compliance/NC services、repos、handlers、stored result、trace/outbox、redaction tests | query views、event consumers、jobs | service-flow-fast PH-04 slice;redaction-boundary targeted;`git diff --check` |

#### Commit boundary 子功能分组

| Commit boundary | 子功能分组 | 必须同提交的原因 | 涉及批次 | 验证门禁 | 不包含 |
|---|---|---|---|---|---|
| commit-04-a | policy fact + shared rules + conflict | 三者共同定义 policy effective surface 和 conflict resolution truth | BATCH-04-01 | contract-domain-fast | control/compliance/NC |
| commit-04-b | control + compliance conclusion | control applicability/review 与 AIIA/SoA conclusion 构成合规判断输入输出 | BATCH-04-02;BATCH-04-03 | contract-domain-fast | NC/service |
| commit-04-c | nonconformity + corrective action + verification | NC lifecycle 必须包含 cause/action/verify 才能独立验证闭环 | BATCH-04-04 | contract-domain-fast | services/query/event |
| commit-04-d | PH-04 services + repos + handlers + redaction | accepted flow 需要 persistence/idempotency/trace/outbox 和敏感字段边界一起验证 | BATCH-04-05 | service-flow-fast;redaction-boundary | query/event/job |

#### PH-04 开工前设计闭环复核

| 复核项 | 检查内容 | 结论 | 失败处理 |
|---|---|---|---|
| 字段闭环 | policy/control/compliance/NC objects required fields、reason、evidence refs、actor/time 来源明确 | 开工前确认 | 回写 object/protocol |
| DTO 构造闭环 | 13 个左右 PH-04 command request 能构造 domain transition | 开工前确认 | 回写 Step 8/9 |
| 状态闭环 | policy active/superseded/conflict;control review;compliance approval;NC lifecycle 与 matrix 一致 | 开工前确认 | 回写 Step 10 |
| validation truth 闭环 | method policy/control snapshot、evidence summary、actor capability、decision context 有 resolver/port | 开工前确认 | 回写 Step 7/9 |
| public target 穷尽闭环 | AIIA/SoA target、NC subject、corrective action target、verification outcome variant 穷尽 | 开工前确认 | 回写 protocol/flow |
| optimistic version 来源闭环 | update/approve/resolve/complete/verify 均有 version source | 开工前确认 | 补 versioned read |
| redaction boundary | evidence summary / external GRC / policy body 不泄露正文 | 开工前确认 | 回写 redaction rules |
| phase boundary | 不提前写 Query / Consumer / Job / release evidence | 通过 | 越界移出 |

#### PH-04 Commit boundary 经验复核

| Commit boundary | 涉及设计面 | 适用经验项 | 不适用理由 | 证据位置 | 结论 | 处理 | 复核责任 |
|---|---|---|---|---|---|---|---|
| commit-04-a | policy command/state | 字段闭环;DTO构造闭环;状态闭环;validation truth;public target 穷尽;phase boundary | query/job 不适用 | `03` Step 6/8/9/10 | 开工前复核 | blocker 回写设计 | 设计者完成;实现者二次校验 |
| commit-04-b | control/compliance command/state | 字段闭环;DTO构造闭环;状态闭环;validation truth;redaction;phase boundary | outbox publish/job 不适用 | `03` Step 6/8/9/10;`05` redaction | 开工前复核 | blocker 回写设计 | 设计者完成;实现者二次校验 |
| commit-04-c | NC lifecycle/state | 字段闭环;DTO构造闭环;状态闭环;history构造闭环;public target 穷尽 | query/job 不适用 | `03` Step 6/8/9/10/15 | 开工前复核 | blocker 回写设计 | 设计者完成;实现者二次校验 |
| commit-04-d | service/persistence/idempotency/outbox/redaction | optimistic version;idempotency;validation truth;history/trace/audit;outbox source identity;redaction | query/job 不适用 | `03` Step 7/9/11/13/15;`05` §redaction | 开工前复核 | blocker 回写设计 | 设计者完成;实现者二次校验 |

#### PH-04 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-04-a | 适中 | 是 | 是 | 保留 |
| commit-04-b | 适中 | 是 | 是 | 保留 |
| commit-04-c | 适中 | 是 | 是 | 保留 |
| commit-04-d | 偏大但必要 | 是 | 是 | 代码按服务分批写,同 boundary 提交 |

#### PH-04 停审记录

| Commit boundary | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| commit-04-a | policy/shared rules/conflict 是否同属 policy truth 增量 | 设计层通过 | 开工前复核 policy body-free 边界 |
| commit-04-b | control + compliance 是否可作为合规事实增量 | 设计层通过 | 开工前复核 evidence summary / method snapshot 来源 |
| commit-04-c | NC lifecycle 是否完整到可单独验证 | 设计层通过 | 开工前复核 closure / verification reason |
| commit-04-d | service accepted path 是否闭合且不做 query/event/job | 设计层通过 | 开工前复核 version/idempotency/outbox/redaction |

### 7.7 PH-05 Authorized Query / Projection / Trace 消费追溯

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-05-01 | 1 | 编写 query request/response、page、status、marker、view DTO 和 fixtures | `03` query/view protocol | `contracts::{queries,views,fixtures}` | contract tests 通过 |
| IMPL-05-02 | 2 | 编写 projection/read model identity、projection state、trace read model domain helpers | `03` projection/trace object contracts | projection state、view identity、trace read helper | domain/read-model tests 通过 |
| IMPL-05-03 | 3 | 编写 query ports、projection store、visibility/freshness/degraded decision surface | `03` ports/flows/state | application query ports and decisions | application compile/tests |
| IMPL-05-04 | 4 | 编写 14 个 query service 和 no-write guard tests | `03` function flows | query services | query no-write and visibility tests |
| IMPL-05-05 | 5 | 编写 API query handlers、search/dashboard/reconciliation read endpoints | `03` API/query contracts | API query handlers | API handler tests |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-05-01 | shared query/page/status marker | `03` Step 8 query shared | page request/info、query response、status、visibility/degraded/freshness markers | 200~400 行 | contract tests | commit-05-a |
| BATCH-05-02 | 14 query request/view DTO | `03` Step 8 query/view | query DTO、view DTO、fixtures | 500 行以上;按 dashboard/decision/policy/NC/trace/search 拆批 | contract tests | commit-05-a |
| BATCH-05-03 | projection identity/state and trace read helpers | `03` Step 6/10 | DerivedGovernanceViewState、view refs、trace page helper | 200~400 行 | domain tests | commit-05-a |
| BATCH-05-04 | query ports and decisions | `03` Step 7/9 | read repositories、visibility decision result、freshness/degraded surface | 300~500 行 | application compile | commit-05-b |
| BATCH-05-05 | query services | `03` Step 9 | 14 query service methods | 500 行以上;按 query family 拆批 | query no-write;visibility tests | commit-05-b |
| BATCH-05-06 | API query handlers | `03` entry contracts | query handlers and error mapping | 300~500 行 | API handler tests | commit-05-c |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-05-a | query/view DTO、projection identity/state、trace read helper tests 通过后 | query shared types、14 query DTO、view DTO、projection state、trace read helper | query services、API handlers、consumer stale marker | contract-domain-fast query/view slice;`cargo check`;`git diff --check` |
| commit-05-b | query ports/services、visibility/freshness/degraded/no-write tests 通过后 | query repositories, projection store, read visibility decision, 14 query services | API handlers、event consumers、jobs | query no-write;projection/visibility tests;`cargo check`;`git diff --check` |
| commit-05-c | API query handlers and response mapping tests 通过后 | API query handlers、search/dashboard/reconciliation read entry、error mapping | inbound consumers/outbox/jobs | API query handler tests;query no-write regression;`git diff --check` |

#### Commit boundary 子功能分组

| Commit boundary | 子功能分组 | 必须同提交的原因 | 涉及批次 | 验证门禁 | 不包含 |
|---|---|---|---|---|---|
| commit-05-a | query contracts + views + projection identity | Query response 必须与 view identity/status marker 同时闭合 | BATCH-05-01~BATCH-05-03 | contract-domain-fast | service/handler |
| commit-05-b | query ports + services + no-write guards | Query service 需要 read repositories、visibility/freshness/degraded decision 一起验证 | BATCH-05-04;BATCH-05-05 | query no-write;visibility tests | API/event/job |
| commit-05-c | API query handlers + error mapping | Entry 层必须只调用 query service,不能直接访问 repository | BATCH-05-06 | API handler tests | consumers/outbox/jobs |

#### PH-05 开工前设计闭环复核

| 复核项 | 检查内容 | 结论 | 失败处理 |
|---|---|---|---|
| Query response 闭环 | 每个 query response/view/page/status marker 的字段、empty/missing/not visible/degraded/stale surface 有来源 | 开工前确认 | 回写 query/view schema |
| Query status marker 来源闭环 | `NotAuthorized` / `NotVisible` / `Degraded` / stale marker 来自正式 decision/result | 开工前确认 | 补 visibility/freshness/degraded result schema |
| public read-model identity | 每个 view ref/cursor/search item identity 有 schema、repository key、派生规则 | 开工前确认 | 补 public ref schema |
| Projection stale/rebuild 闭环 | 当前 read surface 的 stale state、freshness、rebuild source 有 committed truth 或 projection state 来源 | 开工前确认 | 补 projection truth/source |
| Ref-scope 解析闭环 | query subject/scope 到 context/input/decision/policy/NC 的 lookup path 和 visibility scope 已定义 | 开工前确认 | 补 resolver/repository |
| validation truth 闭环 | visibility policy 和 authorization summary 有正式 source | 开工前确认 | 补 port/decision |
| phase boundary | Query no-write,不 append outbox/trace,不 refresh reference,不 repair truth | 通过 | 越界实现移出 |

#### PH-05 Commit boundary 经验复核

| Commit boundary | 涉及设计面 | 适用经验项 | 不适用理由 | 证据位置 | 结论 | 处理 | 复核责任 |
|---|---|---|---|---|---|---|---|
| commit-05-a | query/view/projection identity | Query response闭环;Query status marker来源闭环;public read-model identity;phase boundary | idempotency/outbox/job 不适用,本 boundary 不写 mutation | `03` Step 6/8/10 | 开工前复核 | blocker 回写设计 | 设计者完成;实现者二次校验 |
| commit-05-b | query service/read ports/visibility | Query response闭环;Ref-scope解析闭环;Sidecar truth读取面;Projection stale闭环;validation truth | command idempotency/job 不适用 | `03` Step 7/9/11 | 开工前复核 | blocker 回写设计 | 设计者完成;实现者二次校验 |
| commit-05-c | API query entry | Query response闭环;phase boundary;path baseline | outbox/job 不适用 | `03` Step 8/9;API layout | 开工前复核 | blocker 回写设计 | 设计者完成;实现者二次校验 |

#### PH-05 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-05-a | 偏大但同属 read contracts | 是 | 是 | DTO 按 query family 分批写,同 boundary 提交 |
| commit-05-b | 偏大但同属 query service | 是 | 是 | service 按 query family 分批写,同 boundary 提交 |
| commit-05-c | 适中 | 是 | 是 | 保留 |

#### PH-05 停审记录

| Commit boundary | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| commit-05-a | Query DTO / view / marker 是否字段级闭合 | 设计层通过 | 开工前逐 query 复核 |
| commit-05-b | Query service 是否 no-write 且 visibility surface 正式 | 设计层通过 | 开工前复核 visibility decision result |
| commit-05-c | API query entry 是否不越权访问 repository | 设计层通过 | 开工前复核 entry 依赖方向 |

### 7.8 PH-06 Inbound / Outbound Event 与 Publisher

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-06-01 | 1 | 编写 9 个 inbound event DTO、consumer request/receipt、dead-letter/rejected marker | `03` event protocol | inbound events、receipt DTO、fixtures | contract tests 通过 |
| IMPL-06-02 | 2 | 编写 local reference snapshot / consumer receipt / stale marker domain and ports | `03` reference/projection/consumer object contracts | reference state、receipt、projection stale ports | domain/application tests |
| IMPL-06-03 | 3 | 编写 9 个 consumer service、fake resolvers、quarantine/dead-letter tests | `03` consumer flows | consumer services and fake adapters | consumer tests 通过 |
| IMPL-06-04 | 4 | 编写 12 个 outbound event DTO、payload snapshot、topic map、outbox record | `03` outbound event contracts | outbound events、outbox record/payload | contract-domain-fast event slice |
| IMPL-06-05 | 5 | 编写 outbox append integration from accepted flows and payload builders | `03` outbox flows/persistence | payload builders、accepted flow outbox writes | service regression tests |
| IMPL-06-06 | 6 | 编写 publisher port/fake、publish loop、retry/failed state、topic map verification | `03` publisher flow;`05` outbox suite | outbox publisher service/worker | outbox publisher tests |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-06-01 | inbound shared envelope/receipt/dead-letter | `03` Step 8/12/13 | consumer metadata、receipt、rejected/dead-letter DTO | 200~400 行 | contract tests | commit-06-a |
| BATCH-06-02 | 9 inbound event DTO | `03` Step 8 | identity/process/work/artifact/method/runtime/conversation/observability events | 500 行以上;按 event family 拆批 | contract tests | commit-06-a |
| BATCH-06-03 | reference snapshot + receipt + stale ports | `03` Step 6/7/11 | reference state、receipt store、projection stale repository | 300~500 行 | application compile/domain tests | commit-06-b |
| BATCH-06-04 | consumer services and fake adapters | `03` Step 9 | 9 consumer services、resolver fake、dead-letter/quarantine | 500 行以上;按 consumer family 拆批 | consumer tests | commit-06-b |
| BATCH-06-05 | outbound event DTO + outbox record snapshot | `03` Step 6/8/11 | 12 outbound events、event kind、payload snapshot、outbox record | 500 行以上;按 event family 拆批 | contract-domain-fast | commit-06-c |
| BATCH-06-06 | payload builders + accepted flow outbox migration | `03` Step 9 | builders、service accepted paths append outbox | 500 行以上;按 PH-02~PH-04 accepted flow 分批 | service regression | commit-06-c |
| BATCH-06-07 | publisher loop + retry/failed | `03` Step 7/9/11/13 | publisher port/fake、worker loop、mark_published/failed | 300~500 行 | outbox publisher tests | commit-06-d |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-06-a | inbound event shared DTO、9 event DTO、fixtures contract tests 通过后 | inbound event contracts、consumer receipt/rejected DTO、fixtures | consumer services、outbound events、publisher | contract tests inbound slice;`cargo check`;`git diff --check` |
| commit-06-b | reference snapshot/receipt/stale ports and consumer services tests 通过后 | local snapshots、receipt store、projection stale ports、9 consumer services、fake resolvers | outbound events、outbox publisher、operations jobs | consumer tests;projection stale targeted;`cargo check`;`git diff --check` |
| commit-06-c | outbound event DTO、outbox record snapshot、payload builders、accepted flow outbox migration tests 通过后 | 12 outbound events、outbox record/payload snapshot、payload builders、accepted flow append outbox | publisher loop、operations jobs、release evidence | contract-domain-fast outbound slice;service regression;`git diff --check` |
| commit-06-d | publisher loop、retry/failed state、topic map tests 通过后 | publisher port/fake、outbox publish service、worker loop、topic map verification | public job DTO、operations jobs、release report | outbox publisher tests;topic map check;`cargo check`;`git diff --check` |

#### Commit boundary 子功能分组

| Commit boundary | 子功能分组 | 必须同提交的原因 | 涉及批次 | 验证门禁 | 不包含 |
|---|---|---|---|---|---|
| commit-06-a | inbound event contracts + receipt DTO | Consumer service 需要稳定 public event and receipt surface | BATCH-06-01;BATCH-06-02 | contract tests | services/outbound |
| commit-06-b | snapshot/receipt/stale ports + consumer services | accepted consumer path 必须同时保存 receipt/snapshot 并 mark stale | BATCH-06-03;BATCH-06-04 | consumer tests | outbound/publisher/job |
| commit-06-c | outbound DTO + outbox record + payload builders | accepted command outbox write 需要 payload snapshot 和 event kind 同时闭合 | BATCH-06-05;BATCH-06-06 | outbound contract;service regression | publisher/job |
| commit-06-d | publisher port + loop + publication state | publish result 必须和 retry/failed/version/topic map 同时验证 | BATCH-06-07 | outbox publisher tests | operations job public surface |

#### PH-06 开工前设计闭环复核

| 复核项 | 检查内容 | 结论 | 失败处理 |
|---|---|---|---|
| DTO 构造闭环 | inbound events 能构造 snapshot/ref state/consumer input;outbound payload 能从 committed source object 构造 | 开工前确认 | 回写 event protocol/flow |
| Ref-scope 解析闭环 | event subject/ref 到 affected governance scope 和 projection view 的映射闭合 | 开工前确认 | 补 resolver/repository |
| Projection stale 闭环 | 每个 consumer success path 的 affected view identity、去重、分页、empty branch 明确 | 开工前确认 | 补 affected view helper/port |
| Sidecar truth 读取面闭环 | local snapshot / reference state / receipt get/list/save surface 闭合 | 开工前确认 | 补 port/persistence |
| outbox source identity 闭环 | outbox record 有 event_kind、truth_ref、core_trace_id、visibility_marker、payload_snapshot、publication_state/version | 开工前确认 | 回写 outbox record |
| optimistic version 来源闭环 | reference state、receipt、outbox publication marker 的 expected_version 来源明确 | 开工前确认 | 补 versioned read/list |
| idempotency 闭环 | consumer duplicate replay、outbox publication retry/duplicate 行为明确 | 开工前确认 | 补 receipt/result surface |
| phase boundary | publisher loop 不引入 public operations job DTO/report | 通过 | 若需要 job surface,移至 PH-07 |

#### PH-06 Commit boundary 经验复核

| Commit boundary | 涉及设计面 | 适用经验项 | 不适用理由 | 证据位置 | 结论 | 处理 | 复核责任 |
|---|---|---|---|---|---|---|---|
| commit-06-a | inbound event DTO | DTO构造闭环;ref identity;public target穷尽;phase boundary | outbox publisher/job 不适用 | `03` Step 8/12/13 | 开工前复核 | blocker 回写设计 | 设计者完成;实现者二次校验 |
| commit-06-b | consumer/snapshot/projection stale | Ref-scope解析;Sidecar truth读取面;Projection stale闭环;idempotency;optimistic version | outbound publish 不适用 | `03` Step 7/9/11/13 | 开工前复核 | blocker 回写设计 | 设计者完成;实现者二次校验 |
| commit-06-c | outbound/outbox/payload | outbox source identity;DTO构造闭环;history/trace/audit;phase boundary | publisher retry/job 不适用 | `03` Step 6/8/9/11 | 开工前复核 | blocker 回写设计 | 设计者完成;实现者二次校验 |
| commit-06-d | publisher/retry/topic | optimistic version;idempotency;config binding;artifact materialization for publisher evidence;phase boundary | public job report 不适用,本 boundary 是 worker loop | `03` Step 7/9/11/13;`04`;`05` | 开工前复核 | blocker 回写设计 | 设计者完成;实现者二次校验 |

#### PH-06 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-06-a | 适中 | 是 | 是 | DTO 按 event family 分批写 |
| commit-06-b | 偏大 | 是 | 是 | consumer services 按 family 分批写,同 boundary 提交 |
| commit-06-c | 偏大 | 是 | 是 | outbound payload 按 accepted flow family 分批写 |
| commit-06-d | 适中 | 是 | 是 | 保留 |

#### PH-06 停审记录

| Commit boundary | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| commit-06-a | inbound contracts 是否不依赖 consumer implementation | 设计层通过 | 开工前复核 event variant 穷尽 |
| commit-06-b | consumer accepted path 是否闭合 receipt/snapshot/stale | 设计层通过 | 开工前复核 affected view 来源 |
| commit-06-c | outbox payload snapshot 是否来自 committed source object | 设计层通过 | 开工前复核 outbox source identity |
| commit-06-d | publisher 是否不提前引入 public job surface | 设计层通过 | 开工前复核 versioned publication marker |

### 7.9 PH-07 Operations Jobs / Reconciliation / Handoff / Export

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-07-01 | 1 | 编写 job shared schema、metadata、receipt/report/error、stored job report result surface | `03` job protocol/idempotency | `contracts::jobs`;application job result store | job contract tests |
| IMPL-07-02 | 2 | 编写 PublishOutbox/RebuildProjections/RefreshSnapshots/RunReconciliation job DTO、runner service | `03` job flows | job services and runners | operations-replay-core 子集 |
| IMPL-07-03 | 3 | 编写 TraceHandoff/ArchiveHandoff/ExternalGrcExport job DTO、handoff/export ports/fakes | `03` handoff/export flows;`04` adapters | handoff/export services and fake adapters | partial failure tests |
| IMPL-07-04 | 4 | 编写 jobs crate bin/runner、duplicate replay、artifact/report output | `03` jobs layout;`05` suite | jobs entry and reports | job entry tests |
| IMPL-07-05 | 5 | 编写 operations replay suite and no truth repair assertions | `05` operations suite;`06` VETO | operations-replay-core | suite 通过 |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-07-01 | job shared schema/result surface | `03` Step 8/13 | JobMetadata、JobRunReceipt、JobError、GovernanceJobReport、stored job report | 300~500 行 | job contract tests | commit-07-a |
| BATCH-07-02 | publish/rebuild/refresh/reconcile jobs | `03` Step 9 jobs | job DTO、application job services、runners | 500 行以上;按 job type 拆批 | operations-replay-core subset | commit-07-b |
| BATCH-07-03 | trace/archive handoff jobs | `03` handoff flow | handoff DTO、ports/fakes、partial failure | 300~500 行 | handoff tests | commit-07-c |
| BATCH-07-04 | external GRC export job | `03` external GRC flow;`04` adapter | export DTO、port/fake、redacted payload/export report | 300~500 行 | export tests;redaction targeted | commit-07-c |
| BATCH-07-05 | jobs crate entry and reports | `03` layout;`05` suite | bin runners、artifact/report output | 300~500 行 | job entry tests | commit-07-d |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-07-a | job shared schema、stored report surface、duplicate replay contract tests 通过后 | job metadata/receipt/error/report DTO、stored job report repository/idempotency surface | concrete job runners、handoff/export adapters | job contract tests;`cargo check`;`git diff --check` |
| commit-07-b | publish/rebuild/refresh/reconcile job runners tests 通过后 | publish outbox job、projection rebuild、snapshot refresh、reconciliation runners and reports | handoff/archive/export jobs、release evidence | operations-replay-core subset;job duplicate tests;`git diff --check` |
| commit-07-c | trace/archive handoff and external GRC export tests 通过后 | handoff/export DTO、ports/fakes、partial failure report、redaction targeted tests | release report generation、final acceptance handoff | handoff/export tests;redaction-boundary targeted;`git diff --check` |
| commit-07-d | jobs crate entry and report artifact tests 通过后 | jobs crate bins, runner wiring, artifact/report output for operations jobs | final EV index/VETO checklist/release summary | entry-worker-job;operations-replay-core;`git diff --check` |

#### Commit boundary 子功能分组

| Commit boundary | 子功能分组 | 必须同提交的原因 | 涉及批次 | 验证门禁 | 不包含 |
|---|---|---|---|---|---|
| commit-07-a | job shared schema + stored report | duplicate replay of public jobs requires stable report result surface | BATCH-07-01 | job contract tests | concrete runners |
| commit-07-b | publish/rebuild/refresh/reconcile runners | 这些 jobs 共同维护 public projection/reference/report markers and reconciliation report | BATCH-07-02 | operations-replay-core subset | handoff/export |
| commit-07-c | handoff/archive/export ports + jobs | handoff/export 都是 external delivery seam,需统一 partial failure/redaction/report | BATCH-07-03;BATCH-07-04 | handoff/export/redaction tests | release evidence |
| commit-07-d | jobs entry + artifact/report output | runner entry 必须把 job service result materialize 为 suite artifact/report | BATCH-07-05 | entry-worker-job | final release reports |

#### PH-07 开工前设计闭环复核

| 复核项 | 检查内容 | 结论 | 失败处理 |
|---|---|---|---|
| public job surface 阶段闭环 | job DTO、metadata、receipt、error、report、stored result、duplicate replay 同 boundary 闭合 | 开工前确认 | 调整 boundary 或回写 Step 8/13 |
| job policy executable summary 闭环 | refresh/retry/rebuild/reconcile/handoff/export 的 policy ref 若用于判定,必须有 executable summary 或 truth field | 开工前确认 | 补 policy summary / repository |
| Projection stale/rebuild 闭环 | rebuild jobs 的 truth snapshot source、projection set、replace semantics 闭合 | 开工前确认 | 补 rebuild source |
| Ref-scope 解析闭环 | refresh/reconcile/handoff/export scope 的展开 owner、分页、去重、empty branch 定义 | 开工前确认 | 补 list/resolve port |
| artifact materialization 闭环 | job report、handoff/export artifact path、redaction、run_id、digest 有规则 | 开工前确认 | 回写 `05/06` |
| idempotency 闭环 | duplicate job returns stored report or明确重新扫描语义 | 开工前确认 | 回写 job result surface |
| phase boundary | jobs 不修复 business truth,只写正式 marker/report | 通过 | 越界回写 flow 或移出 |

#### PH-07 Commit boundary 经验复核

| Commit boundary | 涉及设计面 | 适用经验项 | 不适用理由 | 证据位置 | 结论 | 处理 | 复核责任 |
|---|---|---|---|---|---|---|---|
| commit-07-a | public job/report/idempotency | public job surface阶段闭环;idempotency;artifact materialization;phase boundary | concrete scope parsing 不适用 | `03` Step 8/13;`05` | 开工前复核 | blocker 回写设计 | 设计者完成;实现者二次校验 |
| commit-07-b | publish/rebuild/refresh/reconcile jobs | Projection stale/rebuild;Ref-scope解析;job policy executable summary;optimistic version;artifact materialization | handoff/export 不适用 | `03` Step 7/9/11;`05/06` | 开工前复核 | blocker 回写设计 | 设计者完成;实现者二次校验 |
| commit-07-c | handoff/archive/export | artifact materialization;Ref-scope解析;public target穷尽;redaction;job report failed refs | projection rebuild 不适用 | `03` Step 7/8/9;`04`;`05/06` | 开工前复核 | blocker 回写设计 | 设计者完成;实现者二次校验 |
| commit-07-d | jobs entry/report output | path baseline;artifact materialization;config binding;phase boundary | business DTO 不适用 | `03` layout;`04`;`05` suite | 开工前复核 | blocker 回写设计 | 设计者完成;实现者二次校验 |

#### PH-07 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-07-a | 适中 | 是 | 是 | 保留 |
| commit-07-b | 偏大 | 是 | 是 | 按 job type 分批写,同 boundary 提交 |
| commit-07-c | 适中 | 是 | 是 | 保留 |
| commit-07-d | 适中 | 是 | 是 | 保留 |

#### PH-07 停审记录

| Commit boundary | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| commit-07-a | job report duplicate replay surface 是否同 boundary 闭合 | 设计层通过 | 开工前复核 stored report |
| commit-07-b | rebuild/refresh/reconcile 是否有 scope and truth source | 设计层通过 | 开工前复核 scope expansion |
| commit-07-c | handoff/export 是否有 target/failed item/redaction 口径 | 设计层通过 | 开工前复核 failed refs |
| commit-07-d | jobs entry 是否只调用 application job service | 设计层通过 | 开工前复核 artifact path |

### 7.10 PH-08 Release Gate / Reports / Acceptance Handoff

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-08-01 | 1 | 编写 release gate script 的 suite orchestration 和 config redline / dependency boundary checks | `05` §9;`06` VETO | `scripts/gates/run_release_gate.sh`;checks | dry-run 和 targeted checks 通过 |
| IMPL-08-02 | 2 | 编写 evidence index generator,从真实 suite artifact/report 推导 EV 映射 | `05` evidence;`06` EV/VETO | `scripts/reports/build_evidence_index.sh` | report-generation-audit 通过 |
| IMPL-08-03 | 3 | 编写 veto checklist / risk acceptance / release summary generator | `06` VETO/final decision | reports/acceptance/* generators | report audit 通过 |
| IMPL-08-04 | 4 | 编写 release-main-smoke 固定业务闭环 smoke and artifacts | `05` release-main-smoke | smoke suite script/report | release-main-smoke 通过 |
| IMPL-08-05 | 5 | 编写 final acceptance handoff bundle and completion checklist | `06` final signoff | acceptance handoff docs/reports | Step 12 completion criteria 通过 |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-08-01 | release gate orchestration shell | `05` suite list | release gate script、config redline/dependency checks | 300~500 行 | release gate dry-run | commit-08-a |
| BATCH-08-02 | minimal evidence index shell | `05` evidence roots | evidence index generator from selected reports | 200~400 行 | report-generation-audit | commit-08-a |
| BATCH-08-03 | release-main-smoke business scenario | `05` release-main-smoke | fixed smoke suite and artifact | 300~500 行 | release-main-smoke | commit-08-b |
| BATCH-08-04 | veto/risk/release summary generators | `06` VETO/risk/final | veto checklist、risk acceptance、release summary | 300~500 行 | report audit | commit-08-b |
| BATCH-08-05 | acceptance handoff bundle | `06` signoff | handoff index、completion checklist | 100~300 行 | final local acceptance dry-run | commit-08-b |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-08-a | release gate orchestration 和 minimal evidence index dry-run 通过后 | release gate script, config redline/dependency checks, evidence index generator shell | final smoke business scenario, VETO passed conclusions, handoff bundle | release gate dry-run;report-generation-audit skeleton;`git diff --check` |
| commit-08-b | fixed release smoke、VETO/risk/release summary、acceptance handoff bundle 全部通过后 | release-main-smoke, evidence index final mapping, veto checklist from evidence, risk acceptance, release summary, handoff bundle | 新业务功能、production adapter、手工伪造 passed evidence | release-main-smoke;report-generation-audit;redaction-boundary;dependency-boundary;VETO checklist audit;`git diff --check` |

#### Commit boundary 子功能分组

| Commit boundary | 子功能分组 | 必须同提交的原因 | 涉及批次 | 验证门禁 | 不包含 |
|---|---|---|---|---|---|
| commit-08-a | release gate shell + evidence index shell | release gate 必须能调用 suites 并把 report roots 交给 index generator | BATCH-08-01;BATCH-08-02 | dry-run;report audit skeleton | final pass conclusion |
| commit-08-b | smoke + final reports + handoff | final acceptance material 必须由真实 suite artifacts and selected reports 推导 | BATCH-08-03~BATCH-08-05 | release-main-smoke;report-generation-audit;VETO audit | 新业务功能 |

#### PH-08 开工前设计闭环复核

| 复核项 | 检查内容 | 结论 | 失败处理 |
|---|---|---|---|
| artifact materialization | run_id、artifact root、report root、EV index、digest/redaction/path rules 闭合 | 开工前确认 | 回写 `05/06` |
| evidence source 闭环 | EV index 从真实 suite artifact / selected reports 推导,不从静态 JSON 宣告 | 开工前确认 | 回写 report generation 规则 |
| VETO 证据闭环 | VETO checklist 从 evidence、redline、defect/retest、risk acceptance 状态计算 | 开工前确认 | 回写验收标准 |
| release smoke 闭环 | release-main-smoke 是固定业务闭环,不是通用 `cargo test -q` 计数 | 开工前确认 | 回写测试方案 |
| phase boundary | 不新增业务功能、不引入 production adapter、不把 P1 selected-run 伪装成 P0 pass | 通过 | 移出 P0 或记录 risk |

#### PH-08 Commit boundary 经验复核

| Commit boundary | 涉及设计面 | 适用经验项 | 不适用理由 | 证据位置 | 结论 | 处理 | 复核责任 |
|---|---|---|---|---|---|---|---|
| commit-08-a | scripts/report shell/evidence index | artifact materialization;path baseline;phase boundary | business DTO/query/outbox 不适用 | `05` §9/§13;`06` §10/§11 | 开工前复核 | blocker 回写设计 | 设计者完成;实现者二次校验 |
| commit-08-b | release smoke/final reports/VETO/handoff | artifact materialization;evidence source闭环;VETO证据闭环;release smoke闭环;phase boundary | production adapter 不适用 | `05` release gates;`06` final signoff | 开工前复核 | blocker 回写设计 | 设计者完成;实现者二次校验 |

#### PH-08 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-08-a | 适中 | 是 | 是 | 保留 |
| commit-08-b | 偏大但同属 final handoff | 是 | 是 | 按 report generator 分批写,同 boundary 提交 |

#### PH-08 停审记录

| Commit boundary | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| commit-08-a | release gate shell 是否不伪造 evidence | 设计层通过 | 开工前复核 report source |
| commit-08-b | final pass material 是否由真实 artifact 推导 | 设计层通过 | 开工前复核 VETO and smoke evidence |

### 7.11 跨 boundary 粒度 / 依赖 / 门禁审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| boundary 是否按可验证功能增量拆分 | 通过 | 每个 boundary 有一句话目标、门禁和不包含内容 |
| 是否存在单个函数 / 单个文件默认提交 | 通过 | 未采用函数级或文件级提交边界 |
| 是否存在 phase 越界 | 通过 | Query、Event、Job、Release evidence 分别后置 |
| 是否存在测试后补 | 通过 | 每个 boundary 有提交前门禁 |
| 是否存在经验复核缺失 | 通过 | 每个 boundary 有适用经验项和设计者复核责任 |
| 是否存在过粗 boundary | 有受控风险 | commit-04-d、commit-05-a/b、commit-06-b/c、commit-07-b、commit-08-b 偏大,要求按批次分写但同 boundary review |
| 是否存在过细 boundary | 通过 | 未按单 struct 或单函数拆 commit |
| 是否存在 external dependency 前置阻塞 | 通过但有前置 blocker | 目标实现仓不存在;PH-01 开工前必须解决 |
| 是否存在 release evidence 静态通过风险 | 已前置控制 | PH-08 要求从真实 suite artifact/report 计算 |

## 8. 回填草稿

以下内容回填到正式 `07-实施计划.md` §6,Step 13 装配时可按正式章节语气压缩表格说明,但不得删掉 commit boundary、提交前门禁、经验复核责任和 phase boundary。

### 6.1 提交边界总表

| Phase | Commit boundary | 一句话目标 | 提交前关键门禁 |
|---|---|---|---|
| PH-01 | commit-01-a | 建立可编译 workspace、七 crate skeleton 和稳定命名 / dependency boundary | `cargo check`;dependency path check |
| PH-01 | commit-01-b | 建立 config skeleton、script shell、artifact/report roots | config parse smoke;scripts dry-run |
| PH-02 | commit-02-a | 建立 context/input contracts and domain state | contract-domain-fast context/input |
| PH-02 | commit-02-b | 打通 context/input accepted command service and fake runtime | service-flow-fast context/input |
| PH-03 | commit-03-a | 建立 Gate / Decision contracts and local domain state | contract-domain-fast gate/decision |
| PH-03 | commit-03-b | 建立 ApprovalResponsibility contracts and domain state | contract-domain-fast approval |
| PH-03 | commit-03-c | 打通裁决 / approval accepted services and handlers | service-flow-fast decision/approval |
| PH-04 | commit-04-a | 建立 policy/shared rules/conflict contracts and domain state | contract-domain-fast policy |
| PH-04 | commit-04-b | 建立 control/compliance contracts and domain state | contract-domain-fast control/compliance |
| PH-04 | commit-04-c | 建立 nonconformity/corrective action/verification contracts and domain state | contract-domain-fast NC |
| PH-04 | commit-04-d | 打通 PH-04 accepted services, repositories, handlers and redaction tests | service-flow-fast PH-04;redaction targeted |
| PH-05 | commit-05-a | 建立 query/view/projection identity contracts and read state | contract-domain-fast query/view |
| PH-05 | commit-05-b | 打通 query services, visibility/freshness/degraded and no-write guard | query no-write;visibility tests |
| PH-05 | commit-05-c | 建立 API query handlers and response mapping | API query handler tests |
| PH-06 | commit-06-a | 建立 inbound event contracts and consumer receipt surface | inbound contract tests |
| PH-06 | commit-06-b | 打通 consumer services, local snapshots, receipts and projection stale markers | consumer tests;projection stale targeted |
| PH-06 | commit-06-c | 建立 outbound event DTO, outbox record snapshot and payload builders | outbound contract;service regression |
| PH-06 | commit-06-d | 打通 publisher loop, retry/failed marker and topic map verification | outbox publisher tests;topic map check |
| PH-07 | commit-07-a | 建立 public job shared schema and stored report result surface | job contract tests |
| PH-07 | commit-07-b | 打通 publish/rebuild/refresh/reconcile operations jobs | operations-replay-core subset |
| PH-07 | commit-07-c | 打通 trace/archive handoff and external GRC export jobs | handoff/export/redaction tests |
| PH-07 | commit-07-d | 建立 jobs crate entry, runner wiring and operations artifact output | entry-worker-job;operations-replay-core |
| PH-08 | commit-08-a | 建立 release gate orchestration and minimal evidence index generator | release gate dry-run;report audit skeleton |
| PH-08 | commit-08-b | 生成 final smoke, evidence, VETO/risk/release summary and acceptance handoff | release-main-smoke;report-generation-audit;VETO audit |

### 6.2 代码编写顺序

每个 phase 内采用统一编写顺序:

```text
contracts / refs / reasons / fixtures
  -> domain state / policy / unit tests
  -> application ports / UoW / idempotency
  -> application services / query / consumer / job orchestration
  -> infra fake / runtime builder
  -> api / worker / jobs entry
  -> scripts / artifacts / reports
```

具体 boundary 可跳过不适用层,但不得颠倒“public contract 先于 implementation”和“测试切口先于提交”的原则。

### 6.3 设计者复核与实现者二次校验

每个 boundary 开工前,设计者必须按 `设计真相源闭环与可落码性标准.md` §九完成经验复核。复核失败时,先回写设计真相源并固定新 baseline,再重复核同一 boundary。

实现 agent 后续只做二次校验:

1. 确认当前 design commit 与实施计划记录一致。
2. 确认目标实现仓 HEAD 和工作区状态适合当前 boundary。
3. 确认当前 boundary 的正式 `03/05/06/07` 不存在字段、DTO、状态、port、version、outbox、query、job、evidence 缺口。
4. 发现不符时暂停并回报具体文件行号、影响范围和建议闭口点,不得自行补 schema 或选边。

## 9. 待确认事项

| 事项 | 当前结论 | 处理位置 |
|---|---|---|
| 目标实现仓 `/home/aris/Projects/quantalithos-governance` 不存在 | PH-01 开工前 blocker | Step 8 / 正式 §8 |
| 每个 boundary 的字段级最终审计 | 本 Step 给出复核框架,开工前必须由设计者逐项确认 | 正式 §6 / §11 |
| commit-04-d / 05-a / 05-b / 06-b / 06-c / 07-b / 08-b 偏大 | 允许按批次分写,同 boundary 提交 | 正式 §6 |
| release evidence 生成规则 | 必须从真实 suite artifact/report 推导 | Step 7 / Step 12 |
| P1 real-like selected-run | 不进入 P0 commit boundary | Step 9 风险 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 每个 phase 有任务表 | 通过 | PH-01~PH-08 已覆盖 |
| 每个 phase 有代码实现批次表 | 通过 | 大型实现动作已标注分批 |
| 每个 phase 有提交边界 | 通过 | commit-01-a 到 commit-08-b |
| 每个 commit boundary 有子功能分组 | 通过 | 已说明必须同提交的原因 |
| 每个 commit boundary 有经验复核 | 通过 | 由设计者开工前完成,实现者二次校验 |
| 每个 commit boundary 有停审记录 | 通过 | 当前为设计层停审 |
| 跨 boundary 审计无 unresolved 冲突 | 通过 | 目标仓不存在作为 PH-01 blocker |
| 可进入 Step 7 | 通过 | 下一步嵌入测试与验收门禁 |
