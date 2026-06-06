# L1-process 07 实施计划 Step 8: 定义配置、环境与外部依赖准备

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-process/07-实施计划.md` §8 配置、环境与外部依赖准备
> 状态: `[x] 已完成`
> 日期: 2026-06-06

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 8 |
| 主题 | 配置、环境与外部依赖准备 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-process/design-calibration/07_implementation_plan_step_08_config_env_dependencies.md` |

本步把 `04-配置设计.md`、`01-架构设计.md` 和 `03-详细设计.md` 的环境、配置、依赖和 adapter seam 约束转成实施前准备清单。

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 目标实现环境 | `/home/aris/Projects/quantalithos-process`,Rust 2024 workspace,7 crate。 |
| 唯一编译期 sibling dependency | `core-contracts = { path = "../quantalithos-core/crates/contracts" }`。 |
| 其他 sibling repo 如何协作 | 只能通过 port、adapter、event、snapshot、query、handoff 或 fake seam;不得作为 Cargo path dependency。 |
| P0 profile | `local-dev`、`ci-test`、`integration-like`、`operations-replay`。 |
| P1/P2 profile | staging / production-like 不进入 P0,只能作为 risk / follow-up。 |
| secret 和 sensitive 如何处理 | 使用 ref / env key / credential ref;raw secret 不进 config artifact、log、report 或 commit。 |
| configured adapter 不可用如何处理 | fail-fast、delayed、retry、failed 或 partial;不得 fallback 到 fake 伪成功。 |

## 3. 结构化中间产物

### 3.1 配置 profile 准备矩阵

| Profile | 用途 | 必备能力 | 禁止行为 | 主要门禁 |
|---|---|---|---|---|
| `local-dev` | 本地开发和最小闭环 | in-memory store、fake resolver / publisher / handoff、deterministic clock / id | 声称 production 成功、保存 raw body | config smoke、minimum command/query |
| `ci-test` | P0 自动化门禁 | deterministic fixtures、script artifacts、redaction、dependency scan | 使用真实 secret、依赖外部不可控服务 | `TC-PROC-CONFIG-*`;script tests |
| `integration-like` | controlled adapter seam smoke | configured adapter dry-run、failure injection、no fake fallback | 将 P1 smoke 作为 P0 必过 | `TC-PROC-P1-001`;risk report |
| `operations-replay` | job rerun / recovery / report | stable run_id、job config digest、partial report、replay fixture | 修改业务 truth 或 blind retry | `TC-PROC-JOB-*`;`TC-PROC-RECOVERY-*` |

### 3.2 外部依赖准备表

| 外部依赖 | P0 处理 | 实施准备 | 不可做 |
|---|---|---|---|
| L0-core | 唯一编译期依赖 | 确认 `/home/aris/Projects/quantalithos-core/crates/contracts` 可用 | 复制 core 类型或伪造 core schema |
| L0-bus | runtime dependency seam | publisher / consumer port + fake topic map | Cargo path dependency |
| L1-method / method-library | source snapshot / event seam | method definition ref / version / digest fixture | 保存 method definition body |
| Work context source | work context / timebox / stage refs | work snapshot resolver fake | 保存 work item / project body |
| L1-identity | actor capability event seam | actor capability snapshot / marker | 接管 identity actor truth |
| L1-governance | decision / waiting gate refs | governance decision event fixture | 接管 governance decision truth |
| L1-artifact | evidence / checkpoint refs | artifact evidence snapshot fixture | 保存 artifact body |
| L2-runtime | activity feedback event seam | runtime feedback marker and digest | 保存 runtime execution body |
| Conversation context source | conversation context refs | conversation context snapshot fixture | 保存 conversation body |
| L4-observability | trace handoff seam | observability destination / receipt fake | 保存 provider response body |
| L4-archive | archive handoff seam | archive destination / package ref fake | 保存 archive package body |

### 3.3 本地准备检查命令

```bash
pwd
git config user.name
git config user.email
test -d /home/aris/Projects/quantalithos-core/crates/contracts
test -d /home/aris/Projects/quantalithos-process || true
```

期望:

- 当前设计仓为 `/home/aris/Projects/quantalithos-design`。
- 实现仓提交用户为 `quantalithos-labs` / `quantalithos.ai@gmail.com`。
- `core-contracts` 路径存在。
- `quantalithos-process` 不存在时由 PH-01 创建;存在且有冲突时暂停确认。

### 3.4 目录与证据路径准备

| 路径 | 用途 | 创建阶段 | 约束 |
|---|---|---|---|
| `scripts/gates/run_ci_gate.sh` | 统一 gate 入口 | PH-01 / PH-10 完成 | 支持 `--run-id`、`--artifact-root`、`--config-profile` |
| `scripts/reports/generate_reports.sh` | 从 artifact 生成 reports | PH-01 / PH-10 完成 | 输出 `reports/runs/<run_id>` |
| `scripts/checks/check_redaction.sh` | redaction scan | PH-01 / PH-10 完成 | 扫 artifacts + reports |
| `artifacts/test/<run_id>` | 测试原始证据 | PH-01 | 禁止正式引用 `latest` |
| `reports/runs/<run_id>` | 渲染报告 | PH-01 / PH-10 | 每次 release gate 使用固定 run_id |
| `reports/acceptance` | 验收交接 | PH-10 | 包含 handoff、veto、risk、open issues |

### 3.5 配置变更门禁

| 配置变更 | 必须重跑 | 阻断条件 |
|---|---|---|
| profile / source priority | config tests、runtime builder smoke | invalid profile silent success |
| topic map / publisher binding | publisher tests、dependency scan | topic missing 仍启动 |
| resolver / handoff adapter | integration-like smoke、failure injection | configured unavailable fallback fake |
| secret / credential ref | redaction checker | raw secret 出现在 artifact / report |
| artifact / report root | script tests、path grep | 输出到非固定路径或引用 `latest` |
| Cargo dependency | dependency scan、`cargo check` | 非 core sibling path dependency |

## 4. 回填草稿

```markdown
## 8. 配置、环境与外部依赖准备

> 校准来源:
> - `design-calibration/07_implementation_plan_step_08_config_env_dependencies.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“配置 profile 准备矩阵”“外部依赖准备表”“目录与证据路径准备”和“配置变更门禁”小节。

P0 实施只依赖 `core-contracts` 作为编译期 sibling dependency。其他外部仓和服务必须通过 port、adapter、event、snapshot、query、handoff 或 fake / controlled seam 表达。
```

## 5. 进入下一步条件

- P0 profile、外部依赖 seam、路径和配置变更门禁已固定。
- 后续 Step 9 可以定义 spike、风险和待确认事项。
