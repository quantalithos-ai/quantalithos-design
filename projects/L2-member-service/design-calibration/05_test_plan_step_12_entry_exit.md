# Step 12. 定义进入准则与退出准则

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 12
> 回填章节：`05-测试方案.md` §12

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 12 进入准则与退出准则 |
| 当前状态 | `completed / pass_with_upstream_blockers` |
| 原则 | 每项准则必须可判定；pending / blocked 不得被“基本完成”掩盖 |
| 停审结论 | P0 开始和结束门禁可执行；外部正向路径按 blocker 处理 |

## 2. 进入准则

### 2.1 设计与范围

- [ ] `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 基线已由对应停审点确认。
- [ ] 当前测试运行使用的测试切口、状态、错误、配置和依赖分类能回指正式设计；不存在待回写的 P0 schema 缺口。
- [ ] 运行范围明确为 P0 / P1 / P2；`MSVC-UP-001~008` 的 affected positive seam 已标为 blocked/waiting/unavailable。

### 2.2 环境与数据

- [ ] 选择的 profile 属于 `local-dev`、`ci-test`、`integration-like` 或 `operations-replay`；`deterministic_fixture.*` 只在允许的 test-entry / replay run 使用。
- [ ] 所有 P0 用例的 fixture/builder/seed 可由 `test_run_ref` 隔离、重复生成和清理。
- [ ] required local store、UoW、Clock、IdGenerator、fake/controlled adapters 和 safe sink 可被测试入口定位；不可用时有明确 blocked/fail-fast 行为。

### 2.3 自动化与安全

- [ ] 需要阻断的 suite 有 planned gate entry、`--run-id`、`--artifact-root`、`--config-profile` 参数约定。
- [ ] artifact/report root 固定为 `artifacts/test/<run_id>` 与 `reports/runs/<run_id>`，不使用 `latest`。
- [ ] redaction、dependency boundary 和 report pairing 检查已纳入本次运行范围。

## 3. 退出准则

### 3.1 P0 功能与边界

- [ ] 10 Command、6 Query、5 Consumer、1 material helper、7 Job 的 P0 用例均已运行或被明确标为 blocked/unavailable，并有对应 evidence 状态。
- [ ] C-MS-1~5 核心切口无未解释的 failed / partial；Query no-write、Job no-truth-repair、generation/key fence 和 immutable material 通过。
- [ ] `VF-MS-001~009` 相关负向门禁无未处理 S 级违反。

### 3.2 一致性、安全与证据

- [ ] duplicate、concurrent、late、out-of-order、commit unknown 和 rollback unknown 结果符合 `03` 正式语义。
- [ ] required seam 缺失 / unknown 不产生 ready、healthy、delivered、observed 或 accepted 伪正向。
- [ ] 所有 P0 输出通过 redaction scan；没有 raw secret、credential、external body、manifest、endpoint、stack 或完整业务正文。
- [ ] 每个正式 evidence item 都能从 evidence index 回指真实 suite artifact、report、TC 和 AC/VF；失败 suite 仍保留失败材料。
- [ ] 阻断缺陷为 0，或明确记录为未关闭 blocker / residual；S 级缺陷不得以风险接受放行。

### 3.3 交接

- [ ] `reports/runs/<run_id>`、`reports/acceptance` 和 `reports/review` 所需结构完整；人工 / Agent 审查项已列出但未伪造结论。
- [ ] P1/P2 unavailable、性能硬阈值缺 authority、真实 sibling 合同 pending 均进入残余风险并有责任 owner / 触发条件。

## 4. 暂停 / 阻断准则

| 条件 | 处理 |
|---|---|
| 配置 parse/type/cross-field 失败 | fail-fast；不启动半配置 facade |
| required local store/UoW 不可用 | P0 mutation suite blocked；不以空实现替代 |
| sibling exact contract 未闭合 | 只执行负向/结构性测试；positive 标 blocked/waiting |
| redaction 或 dependency gate 失败 | 立即阻断并保留 artifact/report；不得手写通过 |
| evidence index 缺 raw artifact/report | 阻断送验；转 report-audit defect |
| 正式设计出现字段/状态/Port/phase 漂移 | 暂停测试并回写对应 `03/04`，不得在测试侧修正 |

## 5. 来源追溯与回填草稿

| 准则组 | 来源 |
|---|---|
| 设计基线 / P0 范围 | `00` §2、§14；`01` §4/§8；`02` §5~§10 |
| 对象 / 协议 / 状态 / UoW | `03` §6~§15、Step 16 |
| profile / builder / redaction / failure | `04` §6~§12 |
| evidence / gate | Step 9、Step 13（本测试方案） |
| blocker / residual | `00` §15、Step 14（本测试方案） |

正式 §12 应将进入、退出、暂停准则写成可勾选清单和阻断表；不填当前运行是否通过。

- [x] 准则可判定。
- [x] 外部 blocker 的影响明确。
- [x] 可进入 Step 13。
