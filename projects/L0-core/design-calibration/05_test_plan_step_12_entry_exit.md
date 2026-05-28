# Step 12. 定义进入准则与退出准则

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 12
- 回填章节：`projects/L0-core/05-测试方案.md` §12

## 2. 本步输入

| 输入 | 内容 | 使用方式 |
|---|---|---|
| Step 7 测试数据 | fixture、builder、seed 和清理规则 | 定义进入准则中的数据可用性 |
| Step 8 环境矩阵 | local-dev、ci-test、integration、release-like | 定义环境可用性 |
| Step 9 自动化门禁 | suite、执行位置、阻断级别 | 定义自动化可运行和退出条件 |
| Step 11 缺陷规则 | S/A/B/C 分级、复验和风险接受 | 定义退出阻断条件 |

依赖的前序 Step：Step 1~11 已确认。

## 3. SOP 问题回答

1. 开始测试前哪些文档必须冻结?

   回答：`00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 至少要形成当前基线；`05-测试方案.md` 本身需要完成本轮 Step 1~15；`06-验收标准.md` 可作为下游待校准风险,但不能作为当前测试事实来源。

2. 哪些环境和数据必须可用?

   回答：ci-test 和 integration 必须可用；release-like 在发布候选前必须可用。P0 fixture、builder、seed、temp root、fake / failing port、配置 fixture 必须可自动构造和清理。

3. 哪些自动化必须可运行?

   回答：PR 阶段的 fmt / lint、unit、service、DTO contract、config smoke 必须可运行；main CI 的 integration、worker、outbox relay boundary 必须可运行；release gate 前 e2e minimal loop 必须可运行。

4. 退出时哪些用例必须通过?

   回答：所有 P0 用例、P0 配置用例、P0 专项红线、main CI 阻断 suite、release gate suite 必须通过。P1 nightly 可有条件风险接受,但不得影响 release gate。

5. 哪些缺陷和风险会阻断退出?

   回答：任意 S 级缺陷、A 级缺陷、P0 用例失败、release gate 失败、raw secret / 禁止正文入仓、失败伪成功、配置 fail fast 失效、证据归档缺失都会阻断退出。

## 4. 当前文档问题诊断

| 位置 | 问题 | 影响 |
|---|---|---|
| `05-测试方案.md` §10 | 进入 / 退出准则沿用旧 shared primitive 场景 | 无法判断新版 L0-core 是否可以开始或结束测试 |
| `05-测试方案.md` §10 | 准则偏泛化 | 不可执行,无法作为门禁 |
| `05-测试方案.md` §10 | 未承接配置、证据和缺陷分级 | 退出时可能遗漏 P0 风险 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 文档基线 | 未明确新版 00~04 | 明确 00~04 是测试输入基线,06 是下游待校准 | 防止旧验收反向污染 |
| 进入条件 | 环境准备好 | 环境、数据、自动化、配置 fixture 均可判定 | 支撑执行 |
| 退出条件 | 测试通过 | P0 用例、suite、缺陷、证据、风险均有门禁 | 支撑验收 |
| 风险处理 | 未明确 | S/A 不得退出,P1 可条件接受 | 对齐缺陷规则 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 准则写成原则性描述 | 简短 | 不可判定 | 不采用 |
| B. 每个用例单独列进入 / 退出条件 | 最细 | 文档过重且重复 | 不采用 |
| C. 按文档、环境、数据、自动化、缺陷、证据分组列可勾选门禁 | 可执行,可审查 | 需要维护清单 | 采用 |

## 7. 结构化中间产物

### 7.1 进入准则

- [ ] `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 已作为当前测试输入基线。
- [ ] `05-测试方案.md` Step 1~15 中间产物已完成,且每个 Step 有回填来源。
- [ ] `ci-test` 环境可运行 PR 阻断 suite。
- [ ] `integration` 环境可运行 repository、audit、outbox、worker 和配置失效模式测试。
- [ ] P0 fixture、builder、seed、fake / failing port 和配置 fixture 可自动生成。
- [ ] 测试数据可通过 `test_run_id` 隔离并可清理。
- [ ] PR 阶段的 `fmt_lint_suite`、`unit_domain_suite`、`service_command_query_suite`、`dto_schema_contract_suite`、`config_smoke_suite` 可运行。
- [ ] main CI 阶段的 integration、worker、outbox relay boundary suite 可运行或已有明确执行位置。
- [ ] 缺陷分级、复验规则和证据编号已确认。

### 7.2 退出准则

- [ ] 所有 P0 用例通过,包括 `TC-CMD-*`、`TC-QUERY-*`、`TC-EVENT-*`、`TC-OUTBOX-*`、`TC-JOB-*`、`TC-IDEM-*`、`TC-CONC-*`、`TC-TXN-*`、`TC-CONFIG-*`、`TC-AUDIT-*` 和 `TC-E2E-001`。
- [ ] PR 阻断 suite 和 main CI 阻断 suite 均通过。
- [ ] release candidate 必须通过 `e2e_minimal_loop_suite` 和 release-like 配置失败门禁。
- [ ] S 级和 A 级缺陷为 0。
- [ ] S 级 / A 级修复均已完成复验并补充或确认自动化防回归。
- [ ] raw secret、禁止正文入仓、失败伪成功、引用失败默认放行等一票否决专项均未触发。
- [ ] 测试报告、自动化报告、专项证据、配置证据和残余风险记录已归档。
- [ ] P1 / nightly 未关闭问题已记录 owner、期限、影响范围和是否影响 release。

## 8. 回填草稿

```md
## 12. 进入准则与退出准则

> 校准来源：
> - `design-calibration/05_test_plan_step_12_entry_exit.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“进入准则”和“退出准则”小节,了解测试开始与结束的可判定门禁。

### 进入准则

- [ ] `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 已作为当前测试输入基线。
- [ ] `ci-test` 与 `integration` 环境可运行对应自动化 suite。
- [ ] P0 fixture、builder、seed、fake / failing port 和配置 fixture 可自动生成并清理。
- [ ] 缺陷分级、复验规则和证据编号已确认。

### 退出准则

- [ ] 所有 P0 用例通过。
- [ ] PR 阻断 suite、main CI 阻断 suite 和 release gate 必要 suite 均通过。
- [ ] S 级和 A 级缺陷为 0。
- [ ] 一票否决专项未触发。
- [ ] 测试报告、自动化报告、专项证据、配置证据和残余风险记录已归档。
```

## 9. 待确认事项

- 是否接受 `06-验收标准.md` 在本轮测试方案中只作为下游待校准风险,不作为测试输入事实。
- 是否接受 release candidate 必须额外满足 release-like 环境的最小闭环和配置失败门禁。

## 10. 进入下一步条件

- [x] 进入 / 退出准则无模糊项。
- [x] 准则均可通过检查框判定。
- [x] 退出条件覆盖用例、自动化、缺陷、证据和风险。
- [x] 可以进入 Step 13 定义测试报告与证据归档。
