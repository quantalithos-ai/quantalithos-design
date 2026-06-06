# Step 12. 定义测试、验收、实施与运维承接

> 本文件是 `projects/L1-process/04-配置设计.md` 的 Step 12 中间产物。
> 本步定义 `05/06/07/09` 如何承接配置设计。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 12
- 回填章节: `projects/L1-process/04-配置设计.md` §12 测试、验收、实施与运维承接

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 1~11 | 下游承接输入 | 配置矩阵、配置项、敏感配置、加载校验、失败模式均可下游引用 |
| `03_ddd_step_16_test_cuts.md` | 对齐最小测试切口 | config validation、fake adapter wiring、forbidden dependency scan 必须进入测试 |
| `03` §17 风险 | 识别未同步下游 | `05/06/07` 仍需按新版 `03/04` 同步 |

## 3. 结构化中间产物

| 下游文档 | 承接内容 | 本文提供的输入 |
|---|---|---|
| `05-测试方案.md` | 配置加载、profile matrix、config validation、secret redaction、fake / configured adapter、topic map、failure mode 测试 | Step 6 profile、Step 7 配置项、Step 8 敏感配置、Step 9 validation、Step 11 failure modes |
| `06-验收标准.md` | 配置门禁、forbidden boundary、dependency discipline、redaction、default runnable profile、configured adapter 不 fallback fake | Step 4 禁止配置化、Step 5 来源优先级、Step 8 禁止输出、Step 11 失效策略 |
| `07-实施计划.md` | config loader、validator、runtime builder、adapter binding、config tests、redaction check 的 phase / commit boundary | Step 3 control plane、Step 7 field list、Step 9 load / validate / apply |
| 部署与运维手册 / `09` | 真实环境文件、secret provider、endpoint、DB / MQ / KMS、config change runbook、alert threshold | Step 10 变更审计、Step 11 failure modes、P1/P2 风险 |
| 实现仓 README / examples | P0 local / CI JSON 示例和 fake adapter 说明 | Step 7 JSONC 示例,正式运行示例需去注释 |
| CI gate scripts | config lint、redaction scan、forbidden dependency scan、report config digest | Step 8 禁止输出、Step 11 redaction check |

### 3.1 应进入测试方案的配置场景

| 测试类别 | 场景 |
|---|---|
| load / parse | defaults only、valid JSON、invalid JSON、env override、duplicate key |
| validation | bad duration、page limit 0、missing endpoint ref、retention conflict、topic map missing |
| profile | local-dev、ci-test、integration-like、operations-replay |
| sensitive | raw secret rejected、redacted audit、report redaction scan |
| adapter | fake resolver marker、configured resolver unavailable、publisher failure、handoff failure |
| boundary | forbidden body allow-list rejected、non-core Cargo dependency scan |
| replay | job config digest recorded、config drift warning |

### 3.2 应进入验收标准的配置门禁

| 门禁 | 验收口径 |
|---|---|
| P0 default runnable | defaults 可以启动 local / CI runtime |
| no raw secret | 配置、日志、报告、artifact 零 raw secret |
| no external body | 配置不得允许外部正文入仓 |
| no fake fallback | configured adapter failure 不得伪装 fake success |
| topic map complete | 10 个 outbound event 都有 topic |
| dependency discipline | 非 core sibling repo 不得进入 Cargo dependency |
| invalid config fail-fast | 高风险非法配置不得 silent fallback |

### 3.3 应进入实施计划的任务切口

| 实施任务 | 配置设计输入 |
|---|---|
| config module skeleton | Step 7 field list |
| JSON / env loader | Step 5 source priority |
| typed parser | Step 7 type rules |
| validator | Step 9 cross-field rules |
| runtime builder | Step 3 control plane |
| fake / in-memory defaults | Step 6 profile matrix |
| redaction check | Step 8 forbidden output |
| config tests | Step 11 failure modes |

## 4. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| `05/06/07/09` 必须承接 `04`,不得重复定义配置事实 | 否 | 文档承接规则 | 无 | 无回写 |
| config tests / gates 来自 Step 11 failure modes | 否 | 测试承接 | 无 | 无回写 |
| implementation phase 必须先读配置项清单和 validation rules | 否 | 实施承接 | 无 | 无回写 |

## 5. 回填草稿

`04-配置设计.md` §12 应明确 `05-测试方案.md` 承接配置测试矩阵,`06-验收标准.md` 承接配置门禁,`07-实施计划.md` 承接 config loader / validator / runtime builder / adapter binding 的实施切口,部署与运维手册承接真实环境文件、secret provider、endpoint 和 runbook。

## 6. 待确认事项

- `05-测试方案.md` 和 `06-验收标准.md` 仍需按新版 `03/04` 同步。
- `07-实施计划.md` 当前尚未生成,需在 `04` 后继续。

## 7. 进入下一步条件

- 下游文档承接内容明确。
- 测试 / 验收 / 实施 / 运维边界明确。
- 详细设计影响判定为无回写。
