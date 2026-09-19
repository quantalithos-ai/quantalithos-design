# Step 12. 定义进入准则与退出准则

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 12
> 回填章节：`05-测试方案.md` §12
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_12_entry_exit.md`
> 状态：`done / pass / self_reviewed`

## 1. 本步目标与事实边界

本 Step 定义未来测试运行的可判定进入、退出、暂停和阻断条件。它不代表任何 suite 已运行，不生成真实 run、artifact、report、evidence、verdict 或 signoff。正式验收裁决留给新版 `06-验收标准.md`。

## 2. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 开始前哪些文档冻结？ | 正式 `00/01/02/03/04` 与 Step 1～11 calibration 必须为当前基线；影响 P0 contract、state、flow、config、redaction 或 gate 的变更必须回退并重审相关 Step。 |
| 哪些环境/数据可用？ | P0 只要求 `local-fake` 的 deterministic harness、formal-shaped fake、controlled host/carrier/sink、DS-CON 数据集和生成 static graph；`integration-pending`/`production-pending` 的正向 owner、browser/AT、量化环境仍可 blocked。 |
| 哪些自动化可运行？ | Step 9 的 P0 suites/checks 必须具备 planned command contract、显式 run/root/profile 参数和失败保留规则；本轮目标仓不存在，故实际执行前置为 blocked。 |
| 退出需满足什么？ | P0 safety/negative/semantic/static TC 及 blocking suite/check 在未来固定 run 中达到通过；所有 VETO、redaction、dependency、no-write、unknown-no-replay、report pairing 红线无未关闭 S；性能只要求结构性 sample，不要求无来源数字阈值。 |
| 哪些风险不阻断？ | P1 selected、具体 browser/AT、production sink、真实 owner positive、capacity/long-run 和未定 retention 只可作为 residual，并列接受角色/待确认项。 |

## 3. 进入准则（未来执行前 checklist）

- [ ] `00/01/02/03/04` 版本和影响范围已冻结；旧 `05/06` 未作为真相源。
- [ ] Step 1～11 中间产物均为 `done / pass / self_reviewed`，且 flow/ledger 已记录。
- [ ] 96 个 P0/safety TC 都有数据前置、断言、suite 和 candidate 归属；blocked positive 明确列 `CON-Q-*`。
- [ ] deterministic builders、formal-shaped fakes、call ledger、scheduler、leak corpus 和 generated graph 可构造并按 `<test_run_ref>/<case_ref>` 隔离。
- [ ] `local-fake` 可装配；配置恰好四项，profile 必填且无隐式 default；P0 不依赖真实 DB、bus、owner service 或 secret。
- [ ] planned gate/check/report 命令支持显式 `--run-id`、artifact/report roots 和 config profile；禁止 `latest`。
- [ ] redaction、dependency、report-pairing、no-static-evidence 的输入和失败语义已定义。
- [ ] 目标实现仓 `/home/aris/Projects/quantalithos-console`、runner、framework 和具体 CI 未确认时，执行状态必须是 planned/blocked，不得进入伪执行。

## 4. 退出准则（未来执行完成时 checklist）

- [ ] 所有 P0 safety/negative/semantic/static TC 及其阻断 suite 已有固定 `<run_id>` 的 raw artifact 和 run report；conditional positive 保持 blocked/conditional。
- [ ] `console-pure-contract`、`console-module-flow`、`console-config-redline`、`console-architecture-static`、`console-port-adapter`、`console-controlled-composition`、`console-semantic-a11y`、`console-redaction-boundary`、`console-concurrency-race`、`console-recovery-matrix`、`console-report-pairing-audit` 与 release safety/check suites 按触发范围完成。
- [ ] `VETO-CON-001～007` 对应负向断言通过；Query write=0，唯一 owner write 仍为 `OwnerCommandPort.submit`；unknown 不 replay；partition failure 不扩散。
- [ ] redaction、architecture/dependency、artifact/report pairing、no-static-evidence checks 无 blocking failure；失败 suite 仍保留 failure reason。
- [ ] 无未关闭 S 级缺陷；影响 P0 release 的 A 级缺陷已修复或有明确批准接受；B/R/P1 residual 有接受角色、影响和触发条件。
- [ ] 结构性 duration/count sample 存在；未把旧 P95/SLA 或 `production-pending` 解释为 readiness。
- [ ] 未来 Step 13 规定的 evidence index 可从真实 artifact/report 推导；不得由静态表直接宣告 EV/VETO pass。

## 5. 暂停与阻断准则

| 触发 | 处理 |
|---|---|
| 设计 contract/字段/状态缺口使 P0 case 无法构造 | 暂停，回写 03/04/05 受影响 Step；不得猜造 DTO |
| P0 harness/config/fake 无法装配 | 阻断；不得 skip-pass 或切换未批准 profile |
| S 级、redaction、dependency、report-pairing 或 static-evidence failure | 阻断退出，按 Step 11 复验 |
| 缺 raw artifact/report 或 run/root 不匹配 | 阻断证据资格；重新运行需新显式 run_id |
| exact owner/SDK positive、browser/AT、量化环境不可用 | 对应 slice `blocked/not_run_environment_unavailable`；不阻断当前 safety P0，不贡献 positive EV |
| 旧性能数字未达到但无正式 authority | 不阻断；记录 sample/trend residual |

## 6. 来源追溯与审计

| 准则组 | 来源 | 消费 |
|---|---|---|
| 基线与范围 | Step 1～3、正式 00～02 | 进入前冻结 |
| 模块/协议/状态 | 正式 03 §5～§15、Step 4～6 | TC/suite completeness |
| 数据/环境/config | Step 7～8、正式 04 §5～§12 | harness/profile gate |
| 自动化/专项 | Step 9～10 | blocking suite/check |
| 缺陷/复验 | Step 11 | S/A/B/R、回归和关闭 |

跨准则审计结论：进入/退出均为可判定 checklist；没有“基本完成”或静态 evidence 例外；P1/P2、blocked positive 和 residual 不被改写为 P0 pass。

## 7. 回填草稿与门禁

正式 §12 应回填进入、退出、暂停/阻断 checklist，以及 P0/conditional/residual 分界。

> 校准来源：`design-calibration/05_test_plan_step_12_entry_exit.md`
>
> 延伸阅读：建议继续阅读本文件的“进入准则”“退出准则”和“暂停与阻断准则”。

| 进入 Step 13 条件 | 结论 |
|---|---|
| 进入/退出条件可判定 | pass |
| P0 阻断条件明确 | pass |
| 环境不可用禁止伪通过 | pass |
| residual/blocked 保真 | pass |

Step 12 `done / pass / self_reviewed`；未执行测试或生成任何执行证据。
