# 07 Step 3：实施前置条件与阅读清单

## Step 状态

| 字段 | 值 |
|---|---|
| status | completed / selfcheck_done / stop_review |
| gate_status | pass (design-only) |
| gate_reason | 本Step结构化/定向回修及正式传播已完成；Step13实际文档静态核验通过，见07_implementation_static_review_record.md；仅design，不表示实施或资格 |
| next_allowed_action | waiting_user_confirmation |
| source_files | 前序 Step2；正式03 §3/4/13/16/17，04/05/06；实施 SOP Step3/书写规范5.3及4.9；本节明确规范链接 |

### Step 内计划

| 项 | 状态 | 对应产物 |
|---|---|---|
| 读取输入/前序 | done | §本步输入/§阅读清单；补读实施规范1021～1460、中间规范640～920、闭环§9 |
| 问题/诊断/取舍 | done | 下方逐项回答与前后对比 |
| 逐boundary阅读矩阵/记忆 | done | §结构化；15行/10种子 |
| 复杂度 | done | 阅读矩阵独立，业务schema不复制；无需再拆类型附录 |
| 回填 | done | §回填草稿，正式§3仅收口 |
| 自检/停审 | done | Step13实际文档静态核验通过；外部资格/实施Gate不通过 |

## 本步目标

固定开工阅读、环境、规范、git、台账及永久记忆的可执行入口，不授权实现。

## 本步输入

[Step2](07_implementation_plan_step_02_scope.md) 的范围/诊断/取舍及open项；正式03技术/布局/绑定，04配置，05脚本/schema，06证明范围；九owner只读核验。此前不存在的独立提交规范路径不能沿用，统一用实际书写规范§4.9。

## SOP 问题回答

| SOP问题 | 回答 |
|---|---|
| 1. 实施者必须先读哪些文档，分别为了理解什么。 | 正式 00～07 为基线，§7 阅读表给目的、风险与可验证确认方式。 |
| 2. 当前项目使用什么语言和编码规范。 | Rust/API/Worker 与 Vue/TS Web；编码规范按技术边界列于阅读清单。 |
| 3. Rust 项目是否已明确 `standards/coding` 下的 Rust 编码规范。 | 是，Rust 实现前读取 standards/coding/rust.md，不将它作为所有语言默认。 |
| 4. 是否必须阅读提交规范和历史提交。 | 必须读实施书写规范 §4.9；目标仓尚不存在，未来读取该仓真实近期 log，不虚造历史。 |
| 5. 项目级 git `user.name` 和 `user.email` 应如何配置。 | 仅目标仓 git config --local，固定 user.name/email；本轮不执行配置写入。 |
| 6. 是否有必须先启动或确认的本地服务、数据库、消息系统或外部依赖。 | PH-01 Core/SDK 编译输入，PH-02 PG；owner 正向资格依接缝，0 active Bus/Billing/Archive。 |
| 7. 每个实施阶段或 commit boundary 开工前，必须先读哪些正式章节。 | 15 行阶段/boundary 阅读矩阵逐项指向正式章节。 |
| 8. 这些正式章节引用了哪些 `design-calibration` 中间产物，其中哪些会影响当前阶段实现判断。 | 各行具体文件指向 carrier/ports/flow/状态/config/TC/schema；禁止只写 Step 编号。 |
| 9. 如果正式文档和 `design-calibration` 表述不一致，实施者应该以哪个为准，何时暂停回报设计缺口。 | 正式优先；calibration 仍不能解释时暂停并回报，不自行造默认。 |
| 10. 本仓是否依赖 `/home/aris/Projects` 下已经实现的 sibling repo？ | Core/SDK sibling 的已确认编译依赖；运行期 owner 不作为 sibling Cargo。 |
| 11. 对已确认的编译期依赖，当前应使用本地 path dependency，还是已经具备 private git tag / rev 的中期条件？ | 当前 root workspace.dependencies 使用真实 crate path；private git/tag/rev 尚无授权与已冻结事实。 |
| 12. 目标实现仓目录是否为 `/home/aris/Projects/quantalithos-<project>`？ | planned 路径 /home/aris/Projects/quantalithos-marketplace；本轮只读检查、不创建。 |
| 13. workspace member 目录、Cargo package、Rust crate 和 binary 名是否与详细设计一致？ | 六 member、四 library、marketplace-api/marketplace-worker 与 marketplace-web 按03 §4。 |
| 14. 是否存在 `L0` / `L1` / `l0_` / `l1_` 等架构层级泄漏进代码命名？ | L6 只用于设计导航；不得进入 package/crate/module/identifier。 |
| 15. 目标实现仓是否需要创建 `scripts/gates/`、`scripts/reports/`、`scripts/checks/` 和 `scripts/dev/`？ | 22 正式脚本放 gates/checks/reports；dev 只在确需辅助动作时，不新增 mandatory 脚本。 |
| 16. 目标实现仓是否需要创建或保留 `artifacts/test/<run_id>` 和 `reports/`？ | 仅未来实现 run 写 artifacts/test/<run_id> 与 reports/runs/<run_id>；设计不创建实例。 |
| 17. 哪些 gate / report / check 脚本是本轮实施交付物？ | 05 Step9 §7.1/7.3 的22脚本；01-a 前置参数/raw/shell能力，07-a 完善全量能力。 |
| 18. 这些脚本是否必须支持 `--run-id`、`--artifact-root`、`--config-profile`？ | gate 必须 run-id/artifact-root/config-profile/registry/subcase manifest，reports/checks 按正式05参数。 |
| 19. 是否明确禁止 `artifacts/test/<project>/<run_id>`、`reports/<project>` 和正式引用 `latest`？ | 三种错误路径与 latest 正式引用均拒绝，验证 realpath/同run与防覆盖。 |
| 20. 哪些规则必须由实现 agent 在项目永久记忆中保存,以便后续每个编码回合先遵守？ | §7 种子表仅执行规则，10条机械投影，不复制业务schema。 |
| 21. 当前项目的项目级实施台账路径是什么？ | design-calibration/implementation_execution_ledger.md。 |
| 22. 每个 commit boundary 的 boundary 级实施台账如何命名和生成？ | implementation-boundaries/<boundary_id>.md，正式07时按15行全量预创建。 |
| 23. 实现仓是否需要 `.codex/implementation_ledger.md` scratch 台账？ | 可选 .codex/implementation_ledger.md；不能替代设计仓两层台账；本轮不创建。 |
| 24. 实现 agent 开始修改代码前,哪些 Design Gate / Scope Gate 字段必须为 `pass`？ | 项目 current 及授权成立，Design/Scope/Worktree Gate 有真实证据才可编码。 |
| 25. 实现 agent 提交前,Commit Gate 必须检查哪些 staged files、commit message、whitespace、required checks？ | 单boundary staged、whitespace、英文type(scope)/body/footer与required checks；没有授权不commit。 |
| 26. 实现 agent 提交后,Handoff Gate 必须回写哪些 commit hash、next boundary、remaining blocker 和未跑测试？ | 真实hash、baseline、reports、未跑检查、blocker及next boundary；无hash不伪填。 |
| 27. 永久记忆种子是否只写执行规则和规范索引,没有复制详细设计字段 schema、状态矩阵或业务规则正文？ | 是；DTO/state等只作为正式文档索引。 |
| 28. 每条永久记忆是否有稳定 ID、适用范围、来源文档、来源章节、刷新触发和冲突处理口径？ | 固定ID/范围/类别/来源/章节/刷新/失效/冲突/禁改列齐全。 |
| 29. 当前 boundary 的语言 / 技术栈规范路径是否来自阅读清单,而不是在永久记忆中写死某一种语言？ | MEM-MP-008 指向阅读清单，不在记忆中硬编码单一语言。 |
| 30. 如果项目 owner 有临时执行约束,是否明确它是临时规则、失效条件是什么,且没有混入通用永久记忆默认项？ | owner 临时资格留到 blocker 台账，不复制到永久规则；until superseded只用于稳定执行规则。 |
| 31. 永久记忆种子是否包含“交付实现前按 phase / commit boundary 审计正式 `03/05/06/07`”这一执行规则？ | MEM-MP-010 明确全体phase/boundary及03/05/06/07 pre-handoff审计。 |
| 32. 永久记忆种子是否包含“修复设计文档后必须显式检查是否需要总结可复用经验,需要时连同项目改动补标准 / SOP / 项目记忆并添加示例”的执行规则？ | MEM-MP-007规定项目归属、可复用经验、正反例、授权提交及后续交接；不越权改标准。 |

## 当前文档问题诊断

- 初稿把候选phase当最终阅读轴，PH-04/06与Step5冲突；改为最终15boundary。
- 记忆种子缺类别、失效、来源章节、禁改和交付实现前全链审计；补齐而不存schema。
- 代码提交规范文件不存在；不能把“以后确认路径”当开工前条件已闭合。
- Identity设计项目台账未找到不等implementation ledger不存在；分别披露。读取 owner 台账中的实际进度不替本项目资格。

## 改动前后对比

| 项 | 之前 | 之后 | 原因 |
|---|---|---|---|
| 读取定位 | 03 Step6等泛称/候选phase | 真实文件+正式章节+当前判断 | 能定位唯一truth |
| 记忆 | 六列/七条 | 十一列/十条机械规则 | 不遗漏workspace与移交审计 |
| 提交 | 不存在的文件 | 实施书写规范§4.9 | 无猜路径 |

## 设计取舍

| 方案 | 结论 / 理由 |
|---|---|
| 一次读完所有calibration | 拒绝；按boundary只读影响本切片的正式定义 |
| 自由总结永久记忆 | 拒绝；只机械投影种子，冲突暂停刷新 |
| 将本轮dirty工作区作为冻结实现baseline | 拒绝；未提交，不可移交为不可变baseline |
| 先规划本地负例再等ownerpositive | 采用；资格缺口不阻断设计规划，但阻断受影响正向集成 |

## 结构化中间产物

### 总阅读清单

| 规范 | 路径 | 用途 / 未读风险 / 确认方式 |
|---|---|---|
| 通则 | [设计文档编写通则](../../../standards/document/设计文档编写通则.md) | 唯一来源与小循环；能解释证明上限 |
| SOP | [实施计划讨论流程](../../../standards/document/实施计划讨论流程_SOP.md) | 13 Step；按当前 Step 回答问题 |
| 实施书写/提交 | [实施计划书写规范](../../../standards/document/实施计划书写规范.md) §4.6～4.10/§5 | phase/batch/单笔 boundary/英文提交；Commit Gate 核对 §4.9，不存在独立代码提交规范文件 |
| calibration | [中间产物规范](../../../standards/document/设计文档讨论中间产物规范.md) | 状态、恢复、先结构化后装配 |
| 设计闭环 | [真相源闭环](../../../standards/document/设计真相源闭环与可落码性标准.md) §9 | 55 项逐边界；不能只声称已阅 |
| 实施台账 | [代码实施台账与门禁](../../../standards/document/代码实施台账与门禁规范.md) | current-only、Worktree/Commit/Handoff |
| 目录 | [目录与代码文件组织](../../../standards/document/子项目目录与代码文件组织规范.md) | 六 crate / scripts / artifact / report 路径 |
| 全局依赖 | [依赖规则](../../../standards/document/全局项目依赖关系与裁剪规则.md) §4.1 | Layer 5 并行窗口不是本 agent 调度代理许可 |
| Rust | [Rust](../../../standards/coding/rust.md) | PH-01～06 Rust 边界、公开 Rustdoc / fmt / lint |
| Web | [Vue](../../../standards/coding/vue.md)、[TypeScript](../../../standards/coding/typescript.md)、[HTML](../../../standards/coding/html.md)、[JavaScript](../../../standards/coding/javascript.md) | PH-06 Web/tooling，严格 typed protocol 和展示语言 |
| Shell / JSON Schema | 05 §9/13 与实施书写规范 §4.7.2；仓内无专门 shell 标准 | scripts 必须 shellcheck/退出码/路径/脱敏审核，不猜新语言规范 |

### 专项上游阅读与资格

| 专项上游 | 当前正式阅读入口 | 本轮只读复核 / 必要台账 |
|---|---|---|
| L0-sdk | [当前03](../../L0-sdk/03-详细设计.md) §7/16/17、[当前07](../../L0-sdk/07-实施计划.md) 的前置/门禁（进入该接缝时重读） | generic call/read 不证明 exact 市场 operation；项目台账未找到，正式与 flow 继续核验 |
| L1-identity | [当前03](../../L1-identity/03-详细设计.md) §2/7/17、[当前07](../../L1-identity/07-实施计划.md) 的前置/门禁（进入该接缝时重读） | 项目级设计台账未找到；implementation ledger 存在，仅 owner 的报告，不证明 human/org/auth |
| L1-governance | [当前03](../../L1-governance/03-详细设计.md) §7/17、[当前07](../../L1-governance/07-实施计划.md) 的前置/门禁（进入该接缝时重读） | GetGateDecision 是正式读面线索；full binding/current/SDK qualification 和历史状态冲突仍待核验 |
| L1-artifact | [当前03](../../L1-artifact/03-详细设计.md) §7/16/17、[当前07](../../L1-artifact/07-实施计划.md) 的前置/门禁（进入该接缝时重读） | 03 正式协议 + 07 设计台账存在；不提供正文/血缘副本，不自动证明市场材料资格 |
| L3-method-library | [当前03](../../L3-method-library/03-详细设计.md) §7/16/17、[当前07](../../L3-method-library/07-实施计划.md) 的前置/门禁（进入该接缝时重读） | implementation ledger 报告当前 commit-07-b；资产正文和 definition truth 仍归 Method |
| L3-capability-hub | [当前03](../../L3-capability-hub/03-详细设计.md) §7/16/17、[当前07](../../L3-capability-hub/07-实施计划.md) 的前置/门禁（进入该接缝时重读） | fixed reason 受控 repair anchor pending；不得用历史 scanner anchor 证明市场 consumer |
| L2-member-images | [当前03](../../L2-member-images/03-详细设计.md) §7/16/17、[当前07](../../L2-member-images/07-实施计划.md) 的前置/门禁（进入该接缝时重读） | B01/B02 与 consumer/material 资格受阻；07 planned skeleton 不等包/签名/扫描存在 |
| L4-observability | [当前03](../../L4-observability/03-详细设计.md) §7/16/17、[当前07](../../L4-observability/07-实施计划.md) 的前置/门禁（进入该接缝时重读） | 台账仍有 affected/open；市场 producer/redaction/SDK 正向资格保留受影响姿态 |
| L4-archive | [当前03](../../L4-archive/03-详细设计.md) §1/2/16/17、[当前07](../../L4-archive/07-实施计划.md) 的前置/门禁（进入该接缝时重读） | 正式 07 停审；当前无 Marketplace source lane，不纳入 writer/restore |

当前formal03及必要台账受影响段已补读；07的阶段/前置在进入exact接缝时重读。这里只记录设计来源，不消费owner代码、run或签署为本项目结果。

### 阶段实施前阅读矩阵

| 阶段 / boundary | 必读正式章节 | 必读 calibration（具体文件） | 开工门禁 |
|---|---|---|---|
| PH-01 / commit-01-a | [正式03](../03-详细设计.md)、[04](../04-配置设计.md)、[05](../05-测试方案.md)、[06](../06-验收标准.md)、[07](../07-实施计划.md)：03 §3～7/9/15；05 §9/13；06 §10；07 §3/6/7 | [03_ddd_step_06_shared_types.md](03_ddd_step_06_shared_types.md)；[03_ddd_step_06_runtime_helpers.md](03_ddd_step_06_runtime_helpers.md)；[03_ddd_step_06_object_contracts.md](03_ddd_step_06_object_contracts.md)；[03_ddd_step_08_shared_surface.md](03_ddd_step_08_shared_surface.md)；[03_ddd_step_10_state_matrix.md](03_ddd_step_10_state_matrix.md)；[05_test_plan_step_09_automation_gates.md](05_test_plan_step_09_automation_gates.md)；[05_test_plan_step_13_artifact_schema.md](05_test_plan_step_13_artifact_schema.md) | 能逐项说明 fixture codec/domain；工具参数/路径/失败 finalizer 的 schema/port/flow/测试来源；缺口暂停 |
| PH-01 / commit-01-b | [正式03](../03-详细设计.md)、[04](../04-配置设计.md)、[05](../05-测试方案.md)、[06](../06-验收标准.md)、[07](../07-实施计划.md)：03 §13；04 §3～11；05 §8/9/13；06 §6/9 | [03_ddd_step_14_config_bindings.md](03_ddd_step_14_config_bindings.md)；[04_config_step_07_item_inventory.md](04_config_step_07_item_inventory.md)；[04_config_step_09_loading_validation.md](04_config_step_09_loading_validation.md)；[04_config_step_11_failure_modes.md](04_config_step_11_failure_modes.md)；[05_test_plan_step_08_environment_config.md](05_test_plan_step_08_environment_config.md)；[05_test_plan_step_09_automation_gates.md](05_test_plan_step_09_automation_gates.md) | 能逐项说明 strict parser/profile/redaction；七字段映射 的 schema/port/flow/测试来源；缺口暂停 |
| PH-02 / commit-02-a | [正式03](../03-详细设计.md)、[04](../04-配置设计.md)、[05](../05-测试方案.md)、[06](../06-验收标准.md)、[07](../07-实施计划.md)：03 §5.3/6.2/8/10～12/14；05 §6/9；06 §8 | [03_ddd_step_07_typed_ports.md](03_ddd_step_07_typed_ports.md)；[03_ddd_step_07_application_callables.md](03_ddd_step_07_application_callables.md)；[03_ddd_step_09_job_execution.md](03_ddd_step_09_job_execution.md)；[03_ddd_step_11_persistence_transactions.md](03_ddd_step_11_persistence_transactions.md)；[03_ddd_step_13_concurrency_idempotency.md](03_ddd_step_13_concurrency_idempotency.md)；[05_test_plan_step_06_contract_index.md](05_test_plan_step_06_contract_index.md) | 能逐项说明 reserve/replay/完整 result、rollback、channel/digest 与 fake parity 的 schema/port/flow/测试来源；缺口暂停 |
| PH-02 / commit-02-b | [正式03](../03-详细设计.md)、[04](../04-配置设计.md)、[05](../05-测试方案.md)、[06](../06-验收标准.md)、[07](../07-实施计划.md)：03 §10～12；04 §7/9；05 §6/8/9；06 §8 | [03_ddd_step_11_persistence_transactions.md](03_ddd_step_11_persistence_transactions.md)；[03_ddd_step_12_errors_recovery.md](03_ddd_step_12_errors_recovery.md)；[03_ddd_step_13_concurrency_idempotency.md](03_ddd_step_13_concurrency_idempotency.md)；[05_test_plan_step_06_cases.md](05_test_plan_step_06_cases.md)；[05_test_plan_step_09_automation_gates.md](05_test_plan_step_09_automation_gates.md) | 能逐项说明 实际 PG 帧锁/CAS/rollback/固定 upper/compound cursor 的 schema/port/flow/测试来源；缺口暂停 |
| PH-03 / commit-03-a | [正式03](../03-详细设计.md)、[04](../04-配置设计.md)、[05](../05-测试方案.md)、[06](../06-验收标准.md)、[07](../07-实施计划.md)：03 §6.3/7～12/14/17；05 §6；06 §5/7/8 | [03_ddd_step_09_part_u1.md](03_ddd_step_09_part_u1.md)；[03_ddd_step_09_part_u2.md](03_ddd_step_09_part_u2.md)；[03_ddd_step_09_part_u3.md](03_ddd_step_09_part_u3.md)；[03_ddd_step_08_part_u1.md](03_ddd_step_08_part_u1.md)；[03_ddd_step_08_part_u2.md](03_ddd_step_08_part_u2.md)；[03_ddd_step_08_part_u3.md](03_ddd_step_08_part_u3.md)；[03_ddd_step_10_part_u1.md](03_ddd_step_10_part_u1.md)；[03_ddd_step_10_part_u2.md](03_ddd_step_10_part_u2.md)；[03_ddd_step_10_part_u3.md](03_ddd_step_10_part_u3.md)；[05_test_plan_step_06_cases.md](05_test_plan_step_06_cases.md) | 能逐项说明 publisher/source/material/full basis；MatchedDecision 可为 rejected；current Listed gate 的 schema/port/flow/测试来源；缺口暂停 |
| PH-03 / commit-03-b | [正式03](../03-详细设计.md)、[04](../04-配置设计.md)、[05](../05-测试方案.md)、[06](../06-验收标准.md)、[07](../07-实施计划.md)：03 §6.3/7～12；05 §6/9；06 §5/7/8 | [03_ddd_step_08_part_u3.md](03_ddd_step_08_part_u3.md)；[03_ddd_step_08_part_u7.md](03_ddd_step_08_part_u7.md)；[03_ddd_step_09_part_u3.md](03_ddd_step_09_part_u3.md)；[03_ddd_step_09_part_u7.md](03_ddd_step_09_part_u7.md)；[03_ddd_step_07_typed_ports.md](03_ddd_step_07_typed_ports.md)；[03_ddd_step_11_persistence_transactions.md](03_ddd_step_11_persistence_transactions.md)；[03_ddd_step_13_concurrency_idempotency.md](03_ddd_step_13_concurrency_idempotency.md)；[05_test_plan_step_06_cases.md](05_test_plan_step_06_cases.md) | 能逐项说明 search/current disclosure/PageReadContext；完整 shadow manifest/body/state 原子替换 的 schema/port/flow/测试来源；缺口暂停 |
| PH-04 / commit-04-a | [正式03](../03-详细设计.md)、[04](../04-配置设计.md)、[05](../05-测试方案.md)、[06](../06-验收标准.md)、[07](../07-实施计划.md)：03 §6.3/7～12/17；05 §6/9；06 §5/7/8/11 | [03_ddd_step_08_part_u4.md](03_ddd_step_08_part_u4.md)；[03_ddd_step_09_part_u4.md](03_ddd_step_09_part_u4.md)；[03_ddd_step_10_part_u4.md](03_ddd_step_10_part_u4.md)；[03_ddd_step_09_job_execution.md](03_ddd_step_09_job_execution.md)；[03_ddd_step_12_errors_recovery.md](03_ddd_step_12_errors_recovery.md)；[05_test_plan_step_06_cases.md](05_test_plan_step_06_cases.md) | 能逐项说明 原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome 的 schema/port/flow/测试来源；缺口暂停 |
| PH-04 / commit-04-b | [正式03](../03-详细设计.md)、[04](../04-配置设计.md)、[05](../05-测试方案.md)、[06](../06-验收标准.md)、[07](../07-实施计划.md)：03 §6.3/7～12/17；05 §6/9；06 §5/7/8/11 | [03_ddd_step_08_part_u5.md](03_ddd_step_08_part_u5.md)；[03_ddd_step_09_part_u5.md](03_ddd_step_09_part_u5.md)；[03_ddd_step_10_part_u5.md](03_ddd_step_10_part_u5.md)；[03_ddd_step_09_job_execution.md](03_ddd_step_09_job_execution.md)；[03_ddd_step_11_persistence_transactions.md](03_ddd_step_11_persistence_transactions.md)；[05_test_plan_step_06_cases.md](05_test_plan_step_06_cases.md) | 能逐项说明 no-new shared lock、known upper/late cursor 回 Partial、NoticeIntent 结果绑定 的 schema/port/flow/测试来源；缺口暂停 |
| PH-05 / commit-05-a | [正式03](../03-详细设计.md)、[04](../04-配置设计.md)、[05](../05-测试方案.md)、[06](../06-验收标准.md)、[07](../07-实施计划.md)：03 §6.3/7～12/14；05 §6/9；06 §5/7/8/10 | [03_ddd_step_08_part_u6.md](03_ddd_step_08_part_u6.md)；[03_ddd_step_09_part_u6.md](03_ddd_step_09_part_u6.md)；[03_ddd_step_07_application_callables.md](03_ddd_step_07_application_callables.md)；[03_ddd_step_15_observability_audit.md](03_ddd_step_15_observability_audit.md)；[05_test_plan_step_06_cases.md](05_test_plan_step_06_cases.md) | 能逐项说明 16 Query/33 replay 总审查；原完整 payload、分页及脱敏 的 schema/port/flow/测试来源；缺口暂停 |
| PH-05 / commit-05-b | [正式03](../03-详细设计.md)、[04](../04-配置设计.md)、[05](../05-测试方案.md)、[06](../06-验收标准.md)、[07](../07-实施计划.md)：03 §6.3/7～12/14/17；05 §6/9；06 §7/8/10 | [03_ddd_step_08_part_u6.md](03_ddd_step_08_part_u6.md)；[03_ddd_step_09_part_u6.md](03_ddd_step_09_part_u6.md)；[03_ddd_step_09_job_execution.md](03_ddd_step_09_job_execution.md)；[03_ddd_step_10_part_u6.md](03_ddd_step_10_part_u6.md)；[03_ddd_step_12_errors_recovery.md](03_ddd_step_12_errors_recovery.md)；[03_ddd_step_15_observability_audit.md](03_ddd_step_15_observability_audit.md)；[05_test_plan_step_06_cases.md](05_test_plan_step_06_cases.md) | 能逐项说明 typed recovery plan、checkpoint/lease/fence、原报告、producer 防递归 的 schema/port/flow/测试来源；缺口暂停 |
| PH-06 / commit-06-a | [正式03](../03-详细设计.md)、[04](../04-配置设计.md)、[05](../05-测试方案.md)、[06](../06-验收标准.md)、[07](../07-实施计划.md)：03 §5.5/6.3/7/8/11/13；04 §9；05 §6/9；06 §7 | [03_ddd_step_08_protocol_contracts.md](03_ddd_step_08_protocol_contracts.md)；[03_ddd_step_08_shared_surface.md](03_ddd_step_08_shared_surface.md)；[03_ddd_step_07_application_callables.md](03_ddd_step_07_application_callables.md)；[03_ddd_step_16_test_cuts.md](03_ddd_step_16_test_cuts.md)；[05_test_plan_step_06_contract_index.md](05_test_plan_step_06_contract_index.md)；[06_acceptance_step_07_entry_reviews.md](06_acceptance_step_07_entry_reviews.md) | 能逐项说明 trusted context/channel/page、HTTP status/Query degraded、37route/0Jobroute 的 schema/port/flow/测试来源；缺口暂停 |
| PH-06 / commit-06-b | [正式03](../03-详细设计.md)、[04](../04-配置设计.md)、[05](../05-测试方案.md)、[06](../06-验收标准.md)、[07](../07-实施计划.md)：03 §5.6/5.7/6.3/7/8/11/13；04 §7；05 §6/8/9；06 §7/8/9 | [03_ddd_step_09_job_execution.md](03_ddd_step_09_job_execution.md)；[03_ddd_step_08_shared_surface.md](03_ddd_step_08_shared_surface.md)；[03_ddd_step_07_application_callables.md](03_ddd_step_07_application_callables.md)；[03_ddd_step_16_test_cuts.md](03_ddd_step_16_test_cuts.md)；[05_test_plan_step_06_contract_index.md](05_test_plan_step_06_contract_index.md)；[06_acceptance_step_07_entry_reviews.md](06_acceptance_step_07_entry_reviews.md) | 能逐项说明 12 jobs/完整 report、A/B/shutdown；Web 全状态/EN-ZH、不重发意图 的 schema/port/flow/测试来源；缺口暂停 |
| PH-06 / commit-06-c | [正式03](../03-详细设计.md)、[04](../04-配置设计.md)、[05](../05-测试方案.md)、[06](../06-验收标准.md)、[07](../07-实施计划.md)：03 §3/6.2/13/14/17；04 §7/9/11；05 §6/9；06 §7/10 | [03_ddd_step_07_port_adapter_contracts.md](03_ddd_step_07_port_adapter_contracts.md)；[03_ddd_step_07_typed_ports.md](03_ddd_step_07_typed_ports.md)；[03_ddd_step_14_config_bindings.md](03_ddd_step_14_config_bindings.md)；[03_ddd_step_18_risks.md](03_ddd_step_18_risks.md)；[05_test_plan_step_06_cases.md](05_test_plan_step_06_cases.md)；[06_acceptance_step_07_interface_sync_gate.md](06_acceptance_step_07_interface_sync_gate.md) | 能逐项说明 exact owner/type/operation/version/scope；safe unavailable、Unknown/probe 与 redaction 的 schema/port/flow/测试来源；缺口暂停 |
| PH-07 / commit-07-a | [正式03](../03-详细设计.md)、[04](../04-配置设计.md)、[05](../05-测试方案.md)、[06](../06-验收标准.md)、[07](../07-实施计划.md)：05 §6/9/12/13；06 §10/14；07 §7/12 | [05_test_plan_step_06_cases.md](05_test_plan_step_06_cases.md)；[05_test_plan_step_09_automation_gates.md](05_test_plan_step_09_automation_gates.md)；[05_test_plan_step_13_artifact_schema.md](05_test_plan_step_13_artifact_schema.md)；[05_test_plan_step_13_evidence.md](05_test_plan_step_13_evidence.md)；[06_acceptance_step_10_evidence_index.md](06_acceptance_step_10_evidence_index.md)；[06_acceptance_step_14_conclusion_signoff.md](06_acceptance_step_14_conclusion_signoff.md) | 能逐项说明 22 CLI/exit/failed finalizer、98+库存与55项经验审计；提交前验证工具能力，提交后固定源码生成final EV/draft 的 schema/port/flow/测试来源；缺口暂停 |
| PH-07 / commit-07-b | [正式03](../03-详细设计.md)、[04](../04-配置设计.md)、[05](../05-测试方案.md)、[06](../06-验收标准.md)、[07](../07-实施计划.md)：03 §16/17；05 §12～14；06 §4/10～14；07 §12 | [03_ddd_step_17_implementation_handoff.md](03_ddd_step_17_implementation_handoff.md)；[05_test_plan_step_14_regression_risks.md](05_test_plan_step_14_regression_risks.md)；[06_acceptance_step_13_risk_acceptance.md](06_acceptance_step_13_risk_acceptance.md)；[06_acceptance_step_14_conclusion_signoff.md](06_acceptance_step_14_conclusion_signoff.md) | 能逐项说明 design/Scope/Worktree/Commit/Handoff复核；真实 reviewer/新 review，不造结果 的 schema/port/flow/测试来源；缺口暂停 |

### Agent 启动与永久记忆种子

| ID | 适用范围 | 类别 | 必须写入的记忆文本 | 规范路径来源 | 来源文档 | 来源章节 | 刷新触发 | 失效条件 | 冲突处理 | 禁止改写 |
|---|---|---|---|---|---|---|---|---|---|---|
| MEM-MP-001 | project | 基线 | 实现必须以正式 00～07 为基线，calibration 只作追溯，仍有冲突时暂停并回报设计缺口。 | 07 §3.1 阅读清单 | 正式 03/05/06/07 | §3.1 | baseline 变化 | until superseded | 正式文档优先；暂停并刷新 | 是 |
| MEM-MP-002 | commit-boundary | 开工复核 | 每个 boundary 开工前必须按闭环标准 §9.2 二次核验当前设计与实现条件，发现缺口先回写设计，禁止实现端补设 schema。 | 07 §3.1 阅读清单 | 正式 03/05/06/07 | §6.3 | 每个 boundary | until superseded | 正式文档优先；暂停并刷新 | 是 |
| MEM-MP-003 | project | 所有权 | 实现必须遵守正式 03 §2 的所有权边界，仅保存 owner 不可变引用和 Marketplace 局部状态。 | 07 §3.1 阅读清单 | 正式 03/05/06/07 | 03 §2；07 §2 | ownership 变化 | until superseded | 正式文档优先；暂停并刷新 | 是 |
| MEM-MP-004 | commit-boundary | 恢复 | 不确定外部效果必须按正式 03 §11～12 保留原意图与结果并执行正式 probe/reconcile，无终局则等待。 | 07 §3.1 阅读清单 | 正式 03/05/06/07 | 03 §11～12；07 §10 | 恢复合同变化 | until superseded | 正式文档优先；暂停并刷新 | 是 |
| MEM-MP-005 | commit-boundary | 读取 | Query 和 duplicate replay 必须遵守正式 03 的当前披露与零写零副作用规则，不得隐式 refresh 或 repair。 | 07 §3.1 阅读清单 | 正式 03/05/06/07 | 03 §8/12；07 §6 | 读面变化 | until superseded | 正式文档优先；暂停并刷新 | 是 |
| MEM-MP-006 | project | 真实性 | 代码、运行、原始材料、报告与验收结论必须有各自真实来源；提交前只保留非合格诊断，正式05材料必须在提交后固定真实implementation/generator源码并以新run生成，不得用旧HEAD代表未提交输入或把草稿当成执行与签署事实。 | 07 §3.1 阅读清单 | 正式 03/05/06/07 | 05 §13；06 §10/14；07 §7 | 证据合同变化 | until superseded | 正式文档优先；暂停并刷新 | 是 |
| MEM-MP-007 | project | 经验沉淀 | 设计修复后必须先判断上一提交的项目归属并检查可复用经验，需要时补项目记忆种子及具体正反例，标准或 SOP 越出授权范围时只登记待回写，只有获提交授权后才按同项目 amend 或异项目新增提交交接。 | 07 §3.1 阅读清单 | 正式 03/05/06/07 | 07 §10/11/12 | 每次设计修复 | until superseded | 正式文档优先；暂停并刷新 | 是 |
| MEM-MP-008 | commit-boundary | 规范索引 | 修改代码、配置、脚本或测试前必须读取 07 §3.1 阅读清单中当前技术栈、目录和提交规范，不得自行猜测规范路径。 | 07 §3.1 阅读清单 | 正式 03/05/06/07 | 07 §3.1 | 技术栈/规范变化 | until superseded | 正式文档优先；暂停并刷新 | 是 |
| MEM-MP-009 | commit-boundary | 工作区安全 | 提交前必须核对 worktree 和 staged diff，仅纳入当前 boundary 文件，禁止改写、暂存或删除用户无关改动。 | 07 §3.1 阅读清单 | 正式 03/05/06/07 | 07 §10/11 | 每次修改/提交 | until superseded | 正式文档优先；暂停并刷新 | 是 |
| MEM-MP-010 | project | 移交审计 | 移交实现或切换 design baseline 前必须按闭环标准对正式 03/05/06/07 逐 phase 和 boundary 做可落码闭环审计，未通过时先回写设计并固定新 baseline，不得凭标准存在放行。 | 07 §3.1 阅读清单 | 正式 03/05/06/07 | 07 §3.3/12 | 移交实现/新 baseline | until superseded | 正式文档优先；暂停并刷新 | 是 |

种子表不存在、来源缺失、自由扩写或复制schema时不生成记忆；当前不实际写 agent memory。正式03/05/06/07变更或移交前必须重核MEM-MP-010。

### 环境/路径/git/台账前置

| 前置 | 要求 / 检查方式 | 当前事实 / 失败姿态 |
|---|---|---|
| 实现仓 | /home/aris/Projects/quantalithos-marketplace；只在额外实施授权后建立 | 尚不存在；本轮不创建 |
| 布局 | crates/contracts/domain/application/infra/api/worker、apps/web；03布局215path | planned；root virtual workspace，四library与两个binary |
| 编译依赖 | root ../quantalithos-core/crates/contracts、../quantalithos-sdk/crates/client、../quantalithos-sdk/crates/contracts；members workspace=true | 03已有路径核验；future exact export/build须二次校验，存在不等资格 |
| 工具 | rustc/cargo --version、Node22.12+、PG17/SQLx0.8；Rust2024/MSRV1.93 | 未跑；锁定/构建与未来真实checks配对 |
| Git | 目标仓 git config --local user.name=quantalithos-labs、user.email=quantalithos.ai@gmail.com；git log读取真实近期记录 | 本轮不写git；不开全局配置 |
| 目录 | 22 scripts、artifacts/test/<run_id>、reports/runs/<run_id>、reports/acceptance、reports/review | 全部planned，禁止latest/重复project根 |
| project ledger | [implementation ledger](implementation_execution_ledger.md) | Step13创建；恢复/继续/修复/提交/新boundary必读 |
| boundary ledger | implementation-boundaries/<boundary_id>.md | 15 planned skeleton；缺一个不得移交；current-only |
| scratch ledger | 未来实现仓 .codex/implementation_ledger.md，可选 | 不替代正式两层台账；本轮无repo不创建 |
| 前置gate | Design/Scope/Worktree pass后编码；Build/Test/Evidence/Commit/Handoff各独立 | 当前全部未执行；用户确认07不等实施授权 |

### 提交前诊断与提交后固定源码（05 Context前置）

正式05 schema的Context必须有真实implementation_commit和generator_commit，且与实际被测/报告生成源码一致。首次boundary未有commit，或源码/fixture/tooling仍有未提交改动时，不能把旧HEAD、设计commit、占位hash或临时tree当作这两个字段。此时只保存安全实际直接测试/工具输出的诊断与审查说明，位置为reports/review/<boundary_id>-precommit.md；它不是正式machine case/report/EV，也不伪渲染合格index。schema/工具负例fixture只是测试输入，不能代替实际业务raw。

提交前Build/Test核当前完整能力与直接层检查；Evidence Gate按当前诊断成熟度核真实输出/失败解释、scope和安全，不能声称完整主suite/合格EV。全部代码能力及这些required检查有真实结果、用户另授权后，才可单boundarycommit。提交之后固定真实源码与generatorcommit，源码/fixture/tooling无dirty或无关未跟踪输入，再以新run/newexecution生成正式05 Context和当前partial/full材料；不能让旧HEAD报告覆盖未提交代码来源。输出区新增报告不等源码dirty，所有输入仍须可追溯。

当前边界Handoff再核提交后同源材料、remainingblockers与next。07-a提交前只验证fulltool能力/直接测试/非合格诊断，不先发finalEV；提交后新run才运行全11/allsubcase/六artifact→98EV/index→六seal→draft，完整包通过才能handoff07-b。若失败保留currentblocked，在额外提交授权和用户改动保护下修复同boundary/fix或获准amend，固定新实际commit后再新run；不提前激活下一边界。本时序不放宽任何05/06 required集合，不新增machine字段/证明状态。

## 回填草稿

正式§3收口规范链接、15行阅读矩阵、完整机械种子和仓库/工具/台账检查；业务schema只回指03，当前实现repo与不可变baseline仍缺失。

## 待确认事项

实现仓/工具/真实提交样例、不可变design baseline与九owner exact资格待未来授权及实际核验；不以本次阅读关闭MP-UP/SRC/Q/R。Shell专门标准缺失采用正式05参数/安全/exit及shellcheck，若需新binding先回设计。

## 进入下一步条件

阅读清单和32问题已逐项收口，记忆不复制truth；Step13已实际核对路径、15行阅读矩阵及10种子的机械一致性。条件仅文档设计，不是环境或实现gate通过。

## 停审记录

本Step及其定向回修已通过Step13实际文档静态检查，正式来源与结构化产物一致。状态为completed / selfcheck_done / stop_review；本轮全部07设计已完成，现在等待用户确认07，不跨文档或实施。上游blocker、immutablebaseline与实际实现Gate仍未通过；无业务测试run或commit。
