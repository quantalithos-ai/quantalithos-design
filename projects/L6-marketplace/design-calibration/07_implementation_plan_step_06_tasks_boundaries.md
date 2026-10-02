# 07 Step 6：阶段任务、编写顺序与提交边界

## Step 状态

| 字段 | 值 |
|---|---|
| status | completed / selfcheck_done / stop_review |
| gate_status | pass (design-only) |
| gate_reason | 本Step结构化/定向回修及正式传播已完成；Step13实际文档静态核验通过，见07_implementation_static_review_record.md；仅design，不表示实施或资格 |
| next_allowed_action | waiting_user_confirmation |
| source_files | Step5；正式03 §3～17、04 §7/9、05 §6/9/13、06 §7/8/10/14；实施SOP Step6/书写§4.7～4.9 |

### Step 内计划

| 项 | 状态 | 产物 |
|---|---|---|
| 来源/32问题/诊断/取舍 | done | 下方逐问与对比 |
| 七phase任务/批次/15boundary | done | 依次01→07收口，不授权实现 |
| 复杂度 | done | 库存/55经验另附录，独立骨架承载完整gate |
| 回填 | done | 正式§6按本表收口，不复制schema |
| 自检/停审 | done | Step13实际文档静态核验通过；外部资格/实施Gate不通过 |

## 本步目标

把7phase拆为15个能力提交边界；实现批次可独立编译/验证，当前phase不能依赖未来对象或证据。

## 本步输入

[Step5](07_implementation_plan_step_05_phases.md)全部结构化结果、诊断/取舍/open；正式03全部types/ports/49flow/矩阵与32store，04配置，05/06测试与证据。独立细库存见[规范性审核附录](07_implementation_boundary_closure_audit.md)。

## SOP 问题回答

| SOP问题 | 回答 |
|---|---|
| 1. 每个阶段内有哪些实施动作。 | §各phase任务表列动作，49flow按独立typed入口落实，不按crate裸拆。 |
| 2. 每个任务的输入、输出和完成判定是什么。 | 每任务列正式输入、模块/结果输出与验证门禁，scope来自boundary及路径库存。 |
| 3. 阶段内代码应该按什么顺序写，为什么。 | 先typed contract/guard、前置runner与PG、再业务/入口/adapter；高风险逻辑独立batch。 |
| 4. 是否先锁定外部契约和测试切口，再填内部实现。 | 先锁03/owner formal seam与05 CUT/TC，再内部实现；任何缺定义回写。 |
| 5. 哪些任务必须同提交，哪些任务必须分开提交。 | 同vertical的输入/guard/状态/同Tx写集/原result/直接测试同boundary；独立phase及资格装配拆boundary。 |
| 6. 哪些时机可以 commit，哪些时机不能 commit。 | 全部当前required gates真实通过且有提交授权才commit；半实现/未跑/失败/混scope不得commit。 |
| 7. 哪些测试必须在提交前执行。 | Step7逐boundary planned checks；fmt/check/clippy、直接单测与PG/entry/browser按实际触发，非任选。 |
| 8. 是否存在提交边界过大或过小的问题。 | 15boundary是能力边界；BATCH是工作切片，不能按每文件commit，也不把7phase合成一笔。 |
| 9. 是否存在把无关修改混入同一提交的风险。 | Scope/Worktree/staged三次核验；不处理其他项目dirty、不暂存他人文件。 |
| 10. 每个提交边界能否用一句话描述。 | 总表每行是一句话增量，详scope/read由skeleton承接。 |
| 11. 每个提交边界是否可以独立 review、独立验证、必要时独立回退。 | 先审scope及可验证输出；回退只撤当前增量，不删除原history/Unknown责任，保护后续依赖。 |
| 12. 本阶段是否存在单批代码预计超过 300 行或 500 行的实现动作。 | 表的100～300是每个重复子切片，不是整行所有对象总量；>300预拆、>500禁止一次写。 |
| 13. 哪些实现动作必须拆成多个代码批次。 | typed family/每factory/逐port方法组/逐store/逐flow/逐route/每SDKslot/每脚本都按表展开子批。 |
| 14. 哪些状态机、事务、并发、幂等、安全、审计、错误恢复或跨仓同步逻辑必须单独批次实现。 | state、Tx/CAS、幂等、scope、late outcome、redaction、recovery单独子批，即使不足300行。 |
| 15. 每个代码批次完成后应该执行哪些编译、格式化、lint、单测、集成测试或验收门禁。 | 每子批fmt/check/lint/直接单测及对应layer；当前仓不执行未来命令。 |
| 16. 每个代码批次与提交边界是什么关系。 | 多个子批归单boundary；全部协作能力/测试通过才一笔commit。 |
| 17. 每个 phase / commit boundary 开工前需要复核哪些字段、DTO、状态、证据和 phase boundary。 | 55项独立经验表和正式03/05/06/07、04配置、字段/DTO/state/证据/前置齐核。 |
| 18. 发现详细设计、测试方案、验收标准之间冲突时，是暂停、回写设计还是调整本阶段范围。 | pause→回写所属truth/calibration→固定新baseline→重新审当前受影响boundary；不缩expected回避。 |
| 19. 每个 commit boundary 内有哪些协作子功能,为什么这些子功能必须同提交。 | 七phase表逐boundary列协作子功能；Step11映射英文body groups，同逻辑不能拆散。 |
| 20. 每个 commit boundary 是否明确不包含哪些后续 boundary 内容。 | 总表forbidden和前置链列future排除；ownerpositive不因同boundary local通过而放行。 |
| 21. 每个 commit boundary 涉及 command / query / event / job / outbox / projection / state / persistence / idempotency / evidence 中哪些设计面。 | 逐boundary设计面详下方，event/outbox=0active/Archive/Billing不引入；Query/replay零写。 |
| 22. 每个 commit boundary 从 `设计真相源闭环与可落码性标准.md` §九触发哪些历史经验项。 | 标准§9.2实际55项，附录矩阵+各独立skeleton逐项P/N/B，不只挑几个。 |
| 23. 每个适用经验项是否已经有正式 schema、port、flow、state matrix、persistence 或测试证据位置。 | P项有正式schema/ports/flow/状态/PG/TC位置；是设计来源，不是运行evidence。 |
| 24. 哪些高风险经验项被判定为不适用,不适用理由是否具体到当前 boundary。 | N项说明本切片不触发的具体面及对应负责boundary；不得只N/A。 |
| 25. 经验复核中是否存在 blocker,是否必须先回写设计真相源并固定新 baseline。 | positive资格B保留MP-UP/SRC；本轮排程/配置冲突先修设计，不作为实现todo。 |
| 26. 经验复核是否由设计者完成,是否需要在设计修复后重复核同一 boundary。 | 设计者本轮完成55×15审核，修复后重核；实现者只二次确认。 |
| 27. 实现 agent 后续只需二次校验哪些 baseline / 文档 / 实现仓条件,发现不符时如何阻塞回报。 | 实现者核不可变baseline/targetrepo/toolchain/port/export/owner资格，与结论不符blocked回报。 |
| 28. 每个 commit boundary 的实施台账文件路径是什么。 | implementation-boundaries/<boundary_id>.md，全15预创建，真实实例不存在。 |
| 29. 每个 commit boundary 的 allowed scope / forbidden scope 如何写入 boundary 台账。 | scope列具体路径和可修改的方法/半侧；共享文件只允许当前职责增量。 |
| 30. 每个 commit boundary 的 required checks、Commit Gate 和 Handoff Gate 分别需要哪些证据。 | checks→同run raw/report；Commit→staged/message/git；Handoff→真实hash/baseline/reviewer/remaining blockers。 |
| 31. 每个 commit boundary 完成后是否通过停审。 | 逐boundary本轮设计小循环停审见表；实际Build/Test/Handoff均pending。 |
| 32. 所有 boundary 完成后,是否存在过细拆分、过粗合并、跨 phase 混入、测试门禁缺失或提交时机不清。 | 跨boundary检查覆盖/顺序/批次/工具成熟度/经验及15统一；Step13真实静态后最终登记。 |

## 当前文档问题诊断

原稿将15写成14；U1缺业务实施落点、U7和report工具后置；每条batch写全部contracts/PG仅100～300会误导；只摘经验项无法证明55项已逐边界核。原“通过”不代表实施通过，当前统一分层pending。

## 改动前后对比

| 项 | 前 | 后 / 理由 |
|---|---|---|
| 边界/批次 | 14口径/15粗批次 | 15边界、逐能力batch模板；大面按family/flow/方法组展开 |
| 业务 | 无U1、projection维护后置 | 03-a U1/U2/U3 C，03-b U3 Q/U7全部 |
| 公共前置 | 业务阶段临补 | 02-a执行面/02-btypedplans先存在 |
| 工具 | 07-a才有 | 01-a bootstrap；07-a final，早期partial非EV |
| 经验 | 精选数项声称通过 | 55×15及具体N/B理由，设计者负责 |

## 设计取舍

不采用按crate/route拆提交，也不把全部大phase揉为一笔；按能描述/验证/保护性回退的能力边界。43对象/32stores/49flow只作为内部子批导航，同boundary协作仍最终一笔。无需新增业务schema。

## 结构化中间产物

### Boundary 总表

| ID / 台账 | Phase | 一句话增量 | allowed scope（共享文件仅当前职责） | forbidden scope | 前置 |
|---|---|---|---|---|---|
| [commit-01-a](implementation-boundaries/commit-01-a.md) | PH-01 | contracts/domain、workspace 基础和 scripts 参数/原始输出/最小 index 能力 | crates/contracts/; crates/domain/; Cargo.toml; Cargo.lock; rust-toolchain.toml; rustfmt.toml; 六 member Cargo.toml 的依赖/target 骨架; scripts/gates/; scripts/checks/; scripts/reports/ | SQL/业务编排/HTTP/SDK effect；final EV/draft/验收结论 | 正式baseline/额外实施授权/工具与依赖 |
| [commit-01-b](implementation-boundaries/commit-01-b.md) | PH-01 | loader 映射七字段/八 slot、拒绝非法输入和展示 locale | crates/infra/src/runtime_config.rs; crates/infra/src/lib.rs（只导出 loader）; config 示例（04 JSON）；config 定向测试；C gate 接线 | runtime positive 装配、热更新/admin、business bypass、secret 值 | commit-01-a |
| [commit-02-a](implementation-boundaries/commit-02-a.md) | PH-02 | 17 ports、runners、FlowSupport、Query/replay、UoW 与同语义 fake | crates/application/src/ports/; crates/application/src/operation_context.rs; crates/application/src/command_runner.rs; crates/application/src/job_runner.rs; crates/application/src/read_facade.rs; crates/application/src/intent_fingerprint.rs; crates/application/src/errors.rs; crates/application/src/lib.rs; crates/infra/src/fake/; crates/infra/src/postgres/unit_of_work.rs（本 boundary 所需 UoW）；infra 导出最小 wiring | 七 U 业务用例、SDK positive、任意默认 qualified | commit-01-b |
| [commit-02-b](implementation-boundaries/commit-02-b.md) | PH-02 | 32 store、typed Row/codec、CAS/as-of/page/source-cursor | crates/infra/src/postgres/（catalog_search 的底层读取、plan writer 非业务 service）; migrations/（03 §10）；crates/infra/tests/postgres_atomicity_tests.rs; fake/local_store.rs 的同面 parity | 业务权限自裁、SDK/HTTP/Web、Archive、TTL/删除 authority | commit-02-a |
| [commit-03-a](implementation-boundaries/commit-03-a.md) | PH-03 | U1 全部 + U2 全部 + U3 五 Command 的本地纵切 | crates/application/src/source_responsibility/; crates/application/src/publication_review/; crates/application/src/catalog_version/ 的五 Command 与 mod.rs; application/tests/source_responsibility_flow_tests.rs、publication_review_flow_tests.rs、catalog_version_flow_tests.rs | 审批 writer、扫描/签名自产、复制 owner 正文、receiver 派发 | commit-02-b |
| [commit-03-b](implementation-boundaries/commit-03-b.md) | PH-03 | U3 五 Query + U7 两 Query/两 Job；四种 projection 完整 builder | crates/application/src/catalog_version/ 的五 Query; crates/application/src/reference_read/; crates/infra/src/postgres/projection_store.rs、catalog_search.rs、snapshot_store.rs 的 builder/index 接线；application/tests/catalog_version_flow_tests.rs、reference_read_flow_tests.rs；infra/tests/projection_rebuild_tests.rs | Query 写入/隐式 refresh、projection 授权、新业务 truth、私有 source mapping | commit-03-a |
| [commit-04-a](implementation-boundaries/commit-04-a.md) | PH-04 | U4 全部七 flow | crates/application/src/distribution/; application/tests/distribution_flow_tests.rs; infra/tests/withdrawal_race_tests.rs 的分发半侧；fake/owner_ports.rs 的同 port 场景 | installed/paid、receiver 内部执行/DB、未 qualified effect、盲重发 | commit-03-b |
| [commit-04-b](implementation-boundaries/commit-04-b.md) | PH-04 | U5 全部九 flow | crates/application/src/withdrawal_notice/; application/tests/withdrawal_notice_flow_tests.rs; infra/tests/withdrawal_race_tests.rs 的撤回半侧；fake/owner_ports.rs 的 notice 场景 | 全局真实影响、通知送达/阅读、远端卸载/撤销、NoticeAttempt | commit-04-a |
| [commit-05-a](implementation-boundaries/commit-05-a.md) | PH-05 | U6 三 Query | crates/application/src/audit_recovery/get_market_audit.rs、get_recovery_progress.rs、get_operation_result.rs、mod.rs; application/tests/audit_recovery_flow_tests.rs 的 read 半侧；read_facade.rs 的已定义审计投影 mapping | Query/replay I/O effect/业务写、审计冒 evidence、绕 current 披露 | commit-04-b |
| [commit-05-b](implementation-boundaries/commit-05-b.md) | PH-05 | U6 一 Command/三 Job | crates/application/src/audit_recovery/request_market_recovery.rs、run_market_recovery.rs、dispatch_observation.rs、reconcile_observation.rs; application/tests/audit_recovery_flow_tests.rs 的 write/job 半侧；work/operation store 的既定恢复接线 | Archive restore、业务 truth 修复、无原报告 settled、Obs receipt 当 evidence | commit-05-a |
| [commit-06-a](implementation-boundaries/commit-06-a.md) | PH-06 | 可信 context、21C/16Q route、typed disposition/error | crates/api/; crates/application/src/entries.rs 的 Command/Query dispatch 与直接测试；runtime_builder.rs 的 API wiring（positive 留到06-c） | API 直接 DB/SDK/owner、公开12 Job、自造登录/verified actor | commit-05-b |
| [commit-06-b](implementation-boundaries/commit-06-b.md) | PH-06 | 12 internal Job dispatch + Vue/TS UI 的 protocol-only 视图 | crates/worker/; apps/web/; crates/application/src/entries.rs 的 Worker dispatch；runtime_builder.rs 的 Worker wiring；Worker/Web 直接测试 | Web DB/SDK/owner/secret、任意公开 job、UI 审批/安装/支付 truth | commit-06-a |
| [commit-06-c](implementation-boundaries/commit-06-c.md) | PH-06 | Source/Publisher/Material/Governance/Scope/Receiver/Notice/Observation SDK wiring | crates/infra/src/sdk/; crates/infra/src/runtime_builder.rs; crates/infra/src/telemetry.rs; infra/tests/sdk_qualification_tests.rs；既定 fake parity/slot tests | 直接 owner HTTP/DB、generic SDK 自证资格、生产 fake、Billing/Archive/Bus slot | commit-06-b |
| [commit-07-a](implementation-boundaries/commit-07-a.md) | PH-07 | 完善22脚本，98 TC/EV/subcase manifest、artifact/seal 两阶段 | scripts/gates/; scripts/checks/; scripts/reports/; 正式 TC test registry/schema fixtures；reports/README.md 的路径说明（非结果） | 静态 pass、latest、跨 run、缺子例缩集合、自裁 verdict/signoff/readiness | commit-06-c |
| [commit-07-b](implementation-boundaries/commit-07-b.md) | PH-07 | 审查完整 run/EV/20AC/5VETO、台账/剩余风险与证明范围 | design-calibration/implementation_execution_ledger.md; implementation-boundaries/; 未来实现仓 reports/review/ 与 reports/acceptance/ 的真实审查说明 | 业务代码、新 schema、无 authority 风险接受、自动实现/发布/验收签署 | commit-07-a |

前置是串行实施关系；01-a目标仓尚不存在、所有boundary status=planned。相关正向资格blocked不阻断设计规划，local负例/controlled seam不能替代formal selected。若当前门禁必须positive且缺资格则暂停，不跳过边界。

### 编写批次纪律

下表每行是可重复展开的子批族，不承诺“所有43对象/32store/49入口合计300行”。子批稳定后缀 `-01/-02/...` 在当前实施台账按一个carrier、一工厂/迁移、一port方法组、一store、一flow分支、一route、一slot或一脚本展开；每片100～300行，>300预拆，>500禁止一次写。每flow先入口/guard、再accepted同Tx写集与result、再拒绝/duplicate/Unknown/竞态测试；Query先读取及resolver、再Empty/Degraded/零写测试。高风险state/Tx/CAS/幂等/scope/redaction/recovery即使较小也独立子批review。

单子批完成运行目标语言格式/编译/lint与直接测试；PG真层用PG，entry用直接协议，Web用browser，scripts用参数/退出负例。多个子批完成后仍须完整boundary review，才能按额外授权一笔commit。

### PH-01 任务、批次与提交时机

| 任务 / 批次族 | Boundary | 增量 | 输入 | 输出 | 预计规模 / 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| IMPL-01-a1 / BATCH-01-01 | commit-01-a | workspace与依赖target骨架 | 03 §3/4；目录规范 | 六member四library/两binary；仅空target保证Cargo可检查 | 每子片100～300；Build：fmt/check/dependency | 全部子批通过后归commit-01-a一笔，不逐文件commit |
| IMPL-01-a2 / BATCH-01-02 | commit-01-a | 每个typed carrier/value/state | 03 shared types/对象/协议 | 43对象/14carrier/222pair/33canonical所需closed shape；每family分批 | 每子片100～300；D定向 codec/unknown/roundtrip | 全部子批通过后归commit-01-a一笔，不逐文件commit |
| IMPL-01-a3 / BATCH-01-03 | commit-01-a | 每个domain factory/guard | 03 Step6/10 | validated create/rehydrate、纯transition及正负单测 | 每子片100～300；D定向 from-state/非法guard | 全部子批通过后归commit-01-a一笔，不逐文件commit |
| IMPL-01-a4 / BATCH-01-04 | commit-01-a | 原始输出与报告bootstrap | 05 §9/13；06 §10 | 22工具的参数/path/失败finalizer接口及最小index shell；不finalEV | 每子片100～300；工具CLI/退出/跨run/redaction负例 | 全部子批通过后归commit-01-a一笔，不逐文件commit |
| IMPL-01-b1 / BATCH-01-05 | commit-01-b | strict loader/envelope | 04 §3/5/7/9 | duplicate/unknown/ref/domain校验和metadata边界 | 每子片100～300；C定向 loader负例 | 全部子批通过后归commit-01-b一笔，不逐文件commit |
| IMPL-01-b2 / BATCH-01-06 | commit-01-b | 七RuntimeConfig映射/四profile | 03 §13；04 §6/7 | 七字段/六域/八slot；validator只算资格姿态 | 每子片100～300；C定向 mapping与production禁fake | 全部子批通过后归commit-01-b一笔，不逐文件commit |
| IMPL-01-b3 / BATCH-01-07 | commit-01-b | 秘密ref与safe展示 | 04 §8/11；05 DS10/11 | ref-only provider seam与日志/Web/redacted summary | 每子片100～300；C/X定向 redaction/locale | 全部子批通过后归commit-01-b一笔，不逐文件commit |

### PH-02 任务、批次与提交时机

| 任务 / 批次族 | Boundary | 增量 | 输入 | 输出 | 预计规模 / 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| IMPL-02-a1 / BATCH-02-01 | commit-02-a | 17port/146method closed签名 | 03 Step7/8 | 全部前置typed输入/输出/Clock/ID/ScopeResolver | 每子片100～300；contract compile/fake parity | 全部子批通过后归commit-02-a一笔，不逐文件commit |
| IMPL-02-a2 / BATCH-02-02 | commit-02-a | Command/Job runner/context/原结果 | 03 Step6/9/13 | channel/selector/digest/reserve/replay；33canonical完整stored result | 每子片100～300；P/R定向 key/原payload/duplicate | 全部子批通过后归commit-02-a一笔，不逐文件commit |
| IMPL-02-a3 / BATCH-02-03 | commit-02-a | FlowSupport/FreshGate与ReadFacade | 03 Step6/7/9/12 | accepted inventory/subject/cursor/current disclosure/Empty/Degraded | 每子片100～300；S/P定向零写与missing | 全部子批通过后归commit-02-a一笔，不逐文件commit |
| IMPL-02-a4 / BATCH-02-04 | commit-02-a | UoW与同语义fake | 03 §10～12 | A/B frame、rollback/fence；fake采用相同ports并隔离test | 每子片100～300；I/P定向故障/回滚（非PG证明） | 全部子批通过后归commit-02-a一笔，不逐文件commit |
| IMPL-02-b1 / BATCH-02-05 | commit-02-b | 逐store Row/codec/migration | 03 §10；32store及03 Step11 | typed PK/version/checked decode；每store或方法组拆batch | 每子片100～300；真实P codec/constraints/CAS | 全部子批通过后归commit-02-b一笔，不逐文件commit |
| IMPL-02-b2 / BATCH-02-06 | commit-02-b | 事务锁/cursor/history/result | 03 §10～12 | 固定锁序、accepted cursor/history与result同Tx | 每子片100～300；真实P rollback/race/commit uncertainty | 全部子批通过后归commit-02-b一笔，不逐文件commit |
| IMPL-02-b3 / BATCH-02-07 | commit-02-b | lookup/as-of/page与projection plan | 03 typedports/U7；Step11 | 全部typed reads、固定upper、四builder typed输入/shadow存储 | 每子片100～300；真实P missing/compound cursor/manifest | 全部子批通过后归commit-02-b一笔，不逐文件commit |
| IMPL-02-b4 / BATCH-02-08 | commit-02-b | fake/durable parity补齐 | 03 ports；05 DS/CUT | 同读写/version/missing/rollback语义；非生产fake | 每子片100～300；I/P对照断言 | 全部子批通过后归commit-02-b一笔，不逐文件commit |

### PH-03 任务、批次与提交时机

| 任务 / 批次族 | Boundary | 增量 | 输入 | 输出 | 预计规模 / 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| IMPL-03-a1 / BATCH-03-01 | commit-03-a | U1四flow | 03 U1 object/protocol/flow/matrix | publisher关系/来源与资格summary；仅owner immutable refs | 每子片100～300；SOURCE定向与VETO-MP-1 | 全部子批通过后归commit-03-a一笔，不逐文件commit |
| IMPL-03-a2 / BATCH-03-02 | commit-03-a | U2八flow | 03 U2 object/protocol/flow/matrix | 草案/提交/终止、review handoff/reconcile、正式decision绑定 | 每子片100～300；REVIEW定向与VETO-MP-2 | 全部子批通过后归commit-03-a一笔，不逐文件commit |
| IMPL-03-a3 / BATCH-03-03 | commit-03-a | U3五Command | 03 U3 object/protocol/flow/matrix | listing/category/version注册与current Listed gate | 每子片100～300；CATALOG001～006定向真实PG | 全部子批通过后归commit-03-a一笔，不逐文件commit |
| IMPL-03-a4 / BATCH-03-04 | commit-03-a | 高风险原子写与decisions拒绝 | 03 §10～12/15；06 §6/8 | 每accepted inventory/history/stale/work/full result同Tx；签名扫描不approval | 每子片100～300；partial matched/mismatch/current/rollback | 全部子批通过后归commit-03-a一笔，不逐文件commit |
| IMPL-03-b1 / BATCH-03-05 | commit-03-b | U3五Query | 03 U3 protocol/flow；typedports | scope/current disclosure/PageReadContext/lookup/Empty/Degraded | 每子片100～300；CATALOG007～010定向零写 | 全部子批通过后归commit-03-b一笔，不逐文件commit |
| IMPL-03-b2 / BATCH-03-06 | commit-03-b | U7两Query与两Job | 03 U7 object/protocol/flow/matrix | 引用新鲜度、refresh qualified refs、rebuild四projection | 每子片100～300；REFERENCE001～006真实PG/fault | 全部子批通过后归commit-03-b一笔，不逐文件commit |
| IMPL-03-b3 / BATCH-03-07 | commit-03-b | 四kind完整builder/shadow/manifest | 03 Step11/13 typedplan | fixed upper/body-free input、完整Empty、原子publish/state/current过滤 | 每子片100～300；CROSS004/017与concurrent rebuild | 全部子批通过后归commit-03-b一笔，不逐文件commit |
| IMPL-03-b4 / BATCH-03-08 | commit-03-b | 存储与Query协作接线 | PH02 typedplan/store，不调用未来04/05 service | 依已有committed rows；未来族fixture只用于typed contract | 每子片100～300；不隐式refresh/无private fake input | 全部子批通过后归commit-03-b一笔，不逐文件commit |

### PH-04 任务、批次与提交时机

| 任务 / 批次族 | Boundary | 增量 | 输入 | 输出 | 预计规模 / 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| IMPL-04-a1 / BATCH-04-01 | commit-04-a | U4三Command/两Query | 03 U4全部七flow/状态；PH03 Listed | permission/eligibility/原intent/attempt/relation/outcome | 每子片100～300；DISTRIBUTION定向业务层 | 全部子批通过后归commit-04-a一笔，不逐文件commit |
| IMPL-04-a2 / BATCH-04-02 | commit-04-a | U4两Job | 03 U4 dispatch/reconcile；job execution | 原intent dispatch/probe、完整report/Unknown/late | 每子片100～300；W/R定向；完整W至06-b | 全部子批通过后归commit-04-a一笔，不逐文件commit |
| IMPL-04-a3 / BATCH-04-03 | commit-04-a | 分发与撤回共享锁 | 03 §10～12 | Acommit→effect→Bframe、no-new检查、late outcome持久责任 | 每子片100～300；P race/Unknown不盲重发 | 全部子批通过后归commit-04-a一笔，不逐文件commit |
| IMPL-04-b1 / BATCH-04-04 | commit-04-b | U5四Command/两Query | 03 U5全部九flow/状态 | restrict/withdraw/notification plan/绑定；known impact/current | 每子片100～300；WITHDRAWAL十TC定向 | 全部子批通过后归commit-04-b一笔，不逐文件commit |
| IMPL-04-b2 / BATCH-04-05 | commit-04-b | U5三Job | 03 U5 enumerate/dispatch/reconcile | 固定known upper、late cursor回Partial、target/channel/receipt | 每子片100～300；S/P/Job定向，非真实送达 | 全部子批通过后归commit-04-b一笔，不逐文件commit |
| IMPL-04-b3 / BATCH-04-06 | commit-04-b | 撤回-分发竞态与原结果 | 03 §10～12 | 共同锁与no-new；late关系仍进入已知影响 | 每子片100～300；withdrawal race/late/rollback | 全部子批通过后归commit-04-b一笔，不逐文件commit |

### PH-05 任务、批次与提交时机

| 任务 / 批次族 | Boundary | 增量 | 输入 | 输出 | 预计规模 / 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| IMPL-05-a1 / BATCH-05-01 | commit-05-a | U6三只读入口 | 03 U6 GetMarketAudit/GetRecoveryProgress/GetOperationResult | 完整原report/result与审计page/脱敏披露 | 每子片100～300；R/W补层 current/Empty/Degraded | 全部子批通过后归commit-05-a一笔，不逐文件commit |
| IMPL-05-a2 / BATCH-05-02 | commit-05-a | 16Query/33replay联合复核 | 03 readfacade/原结果；06 §7/8 | 不新造TC；给已有TC增加readonly补层，primary归属不变 | 每子片100～300；query/replay write counter=0与current deny | 全部子批通过后归commit-05-a一笔，不逐文件commit |
| IMPL-05-b1 / BATCH-05-03 | commit-05-b | U6一Command/三Job | 03 U6 recovery/Observation全部flow | 请求与typed plan、恢复执行、Observation dispatch/reconcile | 每子片100～300；RECOVERY十一TC定向业务层 | 全部子批通过后归commit-05-b一笔，不逐文件commit |
| IMPL-05-b2 / BATCH-05-04 | commit-05-b | checkpoint/lease/fence与原报告 | 03 job execution/§10～12 | 恢复原responsibility，不重建owner truth；missing保持等待 | 每子片100～300；R crash/takeover/CommitUnknown | 全部子批通过后归commit-05-b一笔，不逐文件commit |
| IMPL-05-b3 / BATCH-05-05 | commit-05-b | Observation防递归/safe handoff | 03 §14；05 X；06 §10 | producer envelope ref/admission/receipt；不审计自身为evidence | 每子片100～300；X/R补层/producer Blocked | 全部子批通过后归commit-05-b一笔，不逐文件commit |

### PH-06 任务、批次与提交时机

| 任务 / 批次族 | Boundary | 增量 | 输入 | 输出 | 预计规模 / 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| IMPL-06-a1 / BATCH-06-01 | commit-06-a | 可信API context与37route | 03 §5.5/7/8 | 21C/16Q、channel/request metadata/selector factory | 每子片100～300；W/API mapping/current permission | 全部子批通过后归commit-06-a一笔，不逐文件commit |
| IMPL-06-a2 / BATCH-06-02 | commit-06-a | typed response/error mapping | 03 protocol/shared surface；05 CUT | 完整Visible/Empty/Degraded/Denied；0Jobroute | 每子片100～300；CROSS005/007/018直接测试 | 全部子批通过后归commit-06-a一笔，不逐文件commit |
| IMPL-06-a3 / BATCH-06-03 | commit-06-a | API runtime装配 | 03 runtimeconfig/runtimebuilder | 只application/ports；unqualified seam真实Blocked | 每子片100～300；no direct DB/owner/SDK guard | 全部子批通过后归commit-06-a一笔，不逐文件commit |
| IMPL-06-b1 / BATCH-06-04 | commit-06-b | 12internal Job与scheduler | 03 §5.6/8/9/11 | dispatch/lease/fence/A-B/shutdown及完整report | 每子片100～300；W/R完整expected subcase | 全部子批通过后归commit-06-b一笔，不逐文件commit |
| IMPL-06-b2 / BATCH-06-05 | commit-06-b | Vue/TS client/7views/状态/i18n | 03 §5.7/7/8；05 CUT13 | typed protocol、EN/ZH切换、pending/blocked/Empty/Degraded/Unknown | 每子片100～300；B browser protocol/locale/workflow | 全部子批通过后归commit-06-b一笔，不逐文件commit |
| IMPL-06-b3 / BATCH-06-06 | commit-06-b | 入口与UI联合回归 | PH01～05全部49flow | W14/B2/R11完整执行层；不重复dispatch或改成功state | 每子片100～300；37HTTP/12Job/全部query/replay | 全部子批通过后归commit-06-b一笔，不逐文件commit |
| IMPL-06-c1 / BATCH-06-07 | commit-06-c | 逐八slot SDK exact mapping | 03 §13/17；九owner03/07及台账 | kind/operation/ref/version/scope/current qualification；未有则Blocked | 每子片100～300；I/C资格负例与selected positive隔离 | 全部子批通过后归commit-06-c一笔，不逐文件commit |
| IMPL-06-c2 / BATCH-06-08 | commit-06-c | Unknown/probe与failure映射 | 03 ports/errors/8/12 | PotentialCommitted/Uncertain保持原intent；不解析error strings | 每子片100～300；receiver/notice/Gov/Obs原outcome | 全部子批通过后归commit-06-c一笔，不逐文件commit |
| IMPL-06-c3 / BATCH-06-09 | commit-06-c | runtime/telemetry/redaction装配 | 03 §13/14；04；05 X | profile/secret/低基数label及禁止production fake | 每子片100～300；C14完整、X全sink补层 | 全部子批通过后归commit-06-c一笔，不逐文件commit |

### PH-07 任务、批次与提交时机

| 任务 / 批次族 | Boundary | 增量 | 输入 | 输出 | 预计规模 / 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| IMPL-07-a1 / BATCH-07-01 | commit-07-a | 完善22脚本/registry/manifest | 05 §9/13；06 §10 | 11suite+release/六checks/四reports；98TC/EV与required库存 | 每子片100～300；CLI/path/exit/finalizer与E | 提交前全部工具能力/直接测试通过后归commit-07-a一笔；提交后新run完整材料通过才Handoff |
| IMPL-07-a2 / BATCH-07-02 | commit-07-a | raw→suite→run→finalEV | 05 artifact schema/DAG | 同run JSON/MD/98detail/index；未跑subcase不valid | 每子片100～300；artifact六checks全量与E/M | 提交前全部工具能力/直接测试通过后归commit-07-a一笔；提交后新run完整材料通过才Handoff |
| IMPL-07-a3 / BATCH-07-03 | commit-07-a | final seal与acceptance draft | 05 §13；06 §10/14 | 六seal检查；immutable draft，仅真实测试形成结果 | 每子片100～300；all11suite/fullcoverage/98EV；draft非verdict | 提交前全部工具能力/直接测试通过后归commit-07-a一笔；提交后新run完整材料通过才Handoff |
| IMPL-07-b1 / BATCH-07-04 | commit-07-b | 逐boundary实际交付审查 | 07 §6/7/12；代码台账规范 | 真实commit/baseline/gate/report/未跑项与remaining blocker | 每子片100～300；pre-handoff design/implementation audit | 全部子批通过后归commit-07-b一笔，不逐文件commit |
| IMPL-07-b2 / BATCH-07-05 | commit-07-b | AC/VETO/分层handoff审查 | 06 §4～14 | 人工/Agent审查20AC/5VETO和合法风险接受；当前无reviewer | 每子片100～300；VETO不可risk accept；local/selected/capacity分层 | 全部子批通过后归commit-07-b一笔，不逐文件commit |
| IMPL-07-b3 / BATCH-07-06 | commit-07-b | 台账/current与下一动作 | project/boundary ledger | 真实hash/handoff/next记录；未来planned，不自动实现/部署 | 每子片100～300；Handoff Gate后等待授权 | 全部子批通过后归commit-07-b一笔，不逐文件commit |

### 涉及设计面与协作子功能

| Boundary | command/query/job/projection/state/persistence/idempotency/evidence面 | 必须同笔的能力 / 排除 |
|---|---|---|
| commit-01-a | foundation前置/装配/测试面；raw/report（非最终EV） | workspace与依赖target骨架；每个typed carrier/value/state；每个domain factory/guard；原始输出与报告bootstrap；排除SQL/业务编排/HTTP/SDK effect；final EV/draft/验收结论 |
| commit-01-b | config前置/装配/测试面；raw/report（非最终EV） | strict loader/envelope；七RuntimeConfig映射/四profile；秘密ref与safe展示；排除runtime positive 装配、热更新/admin、business bypass、secret 值 |
| commit-02-a | operation前置/装配/测试面；raw/report（非最终EV） | 17port/146method closed签名；Command/Job runner/context/原结果；FlowSupport/FreshGate与ReadFacade；UoW与同语义fake；排除七 U 业务用例、SDK positive、任意默认 qualified |
| commit-02-b | storage前置/装配/测试面；raw/report（非最终EV） | 逐store Row/codec/migration；事务锁/cursor/history/result；lookup/as-of/page与projection plan；fake/durable parity补齐；排除业务权限自裁、SDK/HTTP/Web、Archive、TTL/删除 authority |
| commit-03-a | Command/Query/Job；各accepted/state/PG/result或Q零写；raw/report（非最终EV） | U1四flow；U2八flow；U3五Command；高风险原子写与decisions拒绝；排除审批 writer、扫描/签名自产、复制 owner 正文、receiver 派发 |
| commit-03-b | Query/Job；各accepted/state/PG/result或Q零写；raw/report（非最终EV） | U3五Query；U7两Query与两Job；四kind完整builder/shadow/manifest；存储与Query协作接线；排除Query 写入/隐式 refresh、projection 授权、新业务 truth、私有 source mapping |
| commit-04-a | Command/Query/Job；各accepted/state/PG/result或Q零写；raw/report（非最终EV） | U4三Command/两Query；U4两Job；分发与撤回共享锁；排除installed/paid、receiver 内部执行/DB、未 qualified effect、盲重发 |
| commit-04-b | Command/Query/Job；各accepted/state/PG/result或Q零写；raw/report（非最终EV） | U5四Command/两Query；U5三Job；撤回-分发竞态与原结果；排除全局真实影响、通知送达/阅读、远端卸载/撤销、NoticeAttempt |
| commit-05-a | Query；各accepted/state/PG/result或Q零写；raw/report（非最终EV） | U6三只读入口；16Query/33replay联合复核；排除Query/replay I/O effect/业务写、审计冒 evidence、绕 current 披露 |
| commit-05-b | Command/Job；各accepted/state/PG/result或Q零写；raw/report（非最终EV） | U6一Command/三Job；checkpoint/lease/fence与原报告；Observation防递归/safe handoff；排除Archive restore、业务 truth 修复、无原报告 settled、Obs receipt 当 evidence |
| commit-06-a | api前置/装配/测试面；raw/report（非最终EV） | 可信API context与37route；typed response/error mapping；API runtime装配；排除API 直接 DB/SDK/owner、公开12 Job、自造登录/verified actor |
| commit-06-b | worker-web前置/装配/测试面；raw/report（非最终EV） | 12internal Job与scheduler；Vue/TS client/7views/状态/i18n；入口与UI联合回归；排除Web DB/SDK/owner/secret、任意公开 job、UI 审批/安装/支付 truth |
| commit-06-c | adapter前置/装配/测试面；raw/report（非最终EV） | 逐八slot SDK exact mapping；Unknown/probe与failure映射；runtime/telemetry/redaction装配；排除直接 owner HTTP/DB、generic SDK 自证资格、生产 fake、Billing/Archive/Bus slot |
| commit-07-a | evidence前置/装配/测试面；raw/report（非最终EV） | 完善22脚本/registry/manifest；raw→suite→run→finalEV；final seal与acceptance draft；排除静态 pass、latest、跨 run、缺子例缩集合、自裁 verdict/signoff/readiness |
| commit-07-b | handoff前置/装配/测试面；raw/report（非最终EV） | 逐boundary实际交付审查；AC/VETO/分层handoff审查；台账/current与下一动作；排除业务代码、新 schema、无 authority 风险接受、自动实现/发布/验收签署 |

### Gate Matrix 与经验入口

| Boundary | Required Reads | 最小checks / TC补层 | Commit Gate | Handoff Gate / 经验 |
|---|---|---|---|---|
| commit-01-a | 正式03 §3～7/9/15；05 §9/13；06 §10；07 §3/6/7；[Step3具体阅读](07_implementation_plan_step_03_prerequisites_reads.md)与[独立骨架](implementation-boundaries/commit-01-a.md) | fixture codec/domain；工具参数/路径/失败 finalizer；primary TC-CROSS-001, TC-CROSS-002, TC-CROSS-011, TC-CROSS-012, TC-CROSS-013, TC-CROSS-020 | 真实Design/Scope/Worktree/Build/Test/Evidence、单boundary staged/message；未有不commit | 真实hash/baseline/report/reviewer/未跑检查/remaining blockers；next commit-01-b；55项独立表 |
| commit-01-b | 正式03 §13；04 §3～11；05 §8/9/13；06 §6/9；[Step3具体阅读](07_implementation_plan_step_03_prerequisites_reads.md)与[独立骨架](implementation-boundaries/commit-01-b.md) | strict parser/profile/redaction；七字段映射；primary TC-CONFIG-001, TC-CONFIG-002, TC-CONFIG-003, TC-CONFIG-004, TC-CONFIG-005, TC-CONFIG-006, TC-CONFIG-007, TC-CONFIG-008, TC-CONFIG-009, TC-CONFIG-010, TC-CONFIG-011, TC-CONFIG-012, TC-CROSS-009, TC-CROSS-022 | 真实Design/Scope/Worktree/Build/Test/Evidence、单boundary staged/message；未有不commit | 真实hash/baseline/report/reviewer/未跑检查/remaining blockers；next commit-02-a；55项独立表 |
| commit-02-a | 正式03 §5.3/6.2/8/10～12/14；05 §6/9；06 §8；[Step3具体阅读](07_implementation_plan_step_03_prerequisites_reads.md)与[独立骨架](implementation-boundaries/commit-02-a.md) | reserve/replay/完整 result、rollback、channel/digest 与 fake parity；无独立primary；补层 TC-CROSS-003, TC-CROSS-015, TC-CROSS-016, TC-RECOVERY-001, TC-RECOVERY-011 | 真实Design/Scope/Worktree/Build/Test/Evidence、单boundary staged/message；未有不commit | 真实hash/baseline/report/reviewer/未跑检查/remaining blockers；next commit-02-b；55项独立表 |
| commit-02-b | 正式03 §10～12；04 §7/9；05 §6/8/9；06 §8；[Step3具体阅读](07_implementation_plan_step_03_prerequisites_reads.md)与[独立骨架](implementation-boundaries/commit-02-b.md) | 实际 PG 帧锁/CAS/rollback/固定 upper/compound cursor；primary TC-CROSS-003, TC-CROSS-015, TC-CROSS-016 | 真实Design/Scope/Worktree/Build/Test/Evidence、单boundary staged/message；未有不commit | 真实hash/baseline/report/reviewer/未跑检查/remaining blockers；next commit-03-a；55项独立表 |
| commit-03-a | 正式03 §6.3/7～12/14/17；05 §6；06 §5/7/8；[Step3具体阅读](07_implementation_plan_step_03_prerequisites_reads.md)与[独立骨架](implementation-boundaries/commit-03-a.md) | publisher/source/material/full basis；MatchedDecision 可为 rejected；current Listed gate；primary TC-SOURCE-001, TC-SOURCE-002, TC-SOURCE-003, TC-SOURCE-006, TC-REVIEW-001, TC-REVIEW-002, TC-REVIEW-003, TC-REVIEW-004, TC-REVIEW-005, TC-REVIEW-007, TC-REVIEW-009, TC-REVIEW-010, TC-CATALOG-001, TC-CATALOG-002, TC-CATALOG-003, TC-CATALOG-004, TC-CATALOG-005, TC-CATALOG-006 | 真实Design/Scope/Worktree/Build/Test/Evidence、单boundary staged/message；未有不commit | 真实hash/baseline/report/reviewer/未跑检查/remaining blockers；next commit-03-b；55项独立表 |
| commit-03-b | 正式03 §6.3/7～12；05 §6/9；06 §5/7/8；[Step3具体阅读](07_implementation_plan_step_03_prerequisites_reads.md)与[独立骨架](implementation-boundaries/commit-03-b.md) | search/current disclosure/PageReadContext；完整 shadow manifest/body/state 原子替换；primary TC-CATALOG-007, TC-CATALOG-008, TC-CATALOG-009, TC-CATALOG-010, TC-REFERENCE-001, TC-REFERENCE-002, TC-REFERENCE-003, TC-REFERENCE-004, TC-REFERENCE-005, TC-REFERENCE-006, TC-CROSS-004, TC-CROSS-017 | 真实Design/Scope/Worktree/Build/Test/Evidence、单boundary staged/message；未有不commit | 真实hash/baseline/report/reviewer/未跑检查/remaining blockers；next commit-04-a；55项独立表 |
| commit-04-a | 正式03 §6.3/7～12/17；05 §6/9；06 §5/7/8/11；[Step3具体阅读](07_implementation_plan_step_03_prerequisites_reads.md)与[独立骨架](implementation-boundaries/commit-04-a.md) | 原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome；primary TC-DISTRIBUTION-001, TC-DISTRIBUTION-002, TC-DISTRIBUTION-003, TC-DISTRIBUTION-004, TC-DISTRIBUTION-005, TC-DISTRIBUTION-006, TC-DISTRIBUTION-007, TC-DISTRIBUTION-008, TC-DISTRIBUTION-009, TC-DISTRIBUTION-010 | 真实Design/Scope/Worktree/Build/Test/Evidence、单boundary staged/message；未有不commit | 真实hash/baseline/report/reviewer/未跑检查/remaining blockers；next commit-04-b；55项独立表 |
| commit-04-b | 正式03 §6.3/7～12/17；05 §6/9；06 §5/7/8/11；[Step3具体阅读](07_implementation_plan_step_03_prerequisites_reads.md)与[独立骨架](implementation-boundaries/commit-04-b.md) | no-new shared lock、known upper/late cursor 回 Partial、NoticeIntent 结果绑定；primary TC-WITHDRAWAL-001, TC-WITHDRAWAL-002, TC-WITHDRAWAL-003, TC-WITHDRAWAL-004, TC-WITHDRAWAL-005, TC-WITHDRAWAL-006, TC-WITHDRAWAL-007, TC-WITHDRAWAL-008, TC-WITHDRAWAL-009, TC-WITHDRAWAL-010 | 真实Design/Scope/Worktree/Build/Test/Evidence、单boundary staged/message；未有不commit | 真实hash/baseline/report/reviewer/未跑检查/remaining blockers；next commit-05-a；55项独立表 |
| commit-05-a | 正式03 §6.3/7～12/14；05 §6/9；06 §5/7/8/10；[Step3具体阅读](07_implementation_plan_step_03_prerequisites_reads.md)与[独立骨架](implementation-boundaries/commit-05-a.md) | 16 Query/33 replay 总审查；原完整 payload、分页及脱敏；无独立primary；补层 TC-RECOVERY-007, TC-RECOVERY-008, TC-RECOVERY-009, TC-CROSS-005 | 真实Design/Scope/Worktree/Build/Test/Evidence、单boundary staged/message；未有不commit | 真实hash/baseline/report/reviewer/未跑检查/remaining blockers；next commit-05-b；55项独立表 |
| commit-05-b | 正式03 §6.3/7～12/14/17；05 §6/9；06 §7/8/10；[Step3具体阅读](07_implementation_plan_step_03_prerequisites_reads.md)与[独立骨架](implementation-boundaries/commit-05-b.md) | typed recovery plan、checkpoint/lease/fence、原报告、producer 防递归；primary TC-RECOVERY-001, TC-RECOVERY-002, TC-RECOVERY-003, TC-RECOVERY-004, TC-RECOVERY-005, TC-RECOVERY-006, TC-RECOVERY-007, TC-RECOVERY-008, TC-RECOVERY-009, TC-RECOVERY-010, TC-RECOVERY-011 | 真实Design/Scope/Worktree/Build/Test/Evidence、单boundary staged/message；未有不commit | 真实hash/baseline/report/reviewer/未跑检查/remaining blockers；next commit-06-a；55项独立表 |
| commit-06-a | 正式03 §5.5/6.3/7/8/11/13；04 §9；05 §6/9；06 §7；[Step3具体阅读](07_implementation_plan_step_03_prerequisites_reads.md)与[独立骨架](implementation-boundaries/commit-06-a.md) | trusted context/channel/page、HTTP status/Query degraded、37route/0Jobroute；primary TC-CROSS-005, TC-CROSS-007, TC-CROSS-018 | 真实Design/Scope/Worktree/Build/Test/Evidence、单boundary staged/message；未有不commit | 真实hash/baseline/report/reviewer/未跑检查/remaining blockers；next commit-06-b；55项独立表 |
| commit-06-b | 正式03 §5.6/5.7/6.3/7/8/11/13；04 §7；05 §6/8/9；06 §7/8/9；[Step3具体阅读](07_implementation_plan_step_03_prerequisites_reads.md)与[独立骨架](implementation-boundaries/commit-06-b.md) | 12 jobs/完整 report、A/B/shutdown；Web 全状态/EN-ZH、不重发意图；primary TC-CROSS-008, TC-CROSS-019, TC-CROSS-021 | 真实Design/Scope/Worktree/Build/Test/Evidence、单boundary staged/message；未有不commit | 真实hash/baseline/report/reviewer/未跑检查/remaining blockers；next commit-06-c；55项独立表 |
| commit-06-c | 正式03 §3/6.2/13/14/17；04 §7/9/11；05 §6/9；06 §7/10；[Step3具体阅读](07_implementation_plan_step_03_prerequisites_reads.md)与[独立骨架](implementation-boundaries/commit-06-c.md) | exact owner/type/operation/version/scope；safe unavailable、Unknown/probe 与 redaction；primary TC-SOURCE-004, TC-SOURCE-005, TC-REVIEW-006, TC-REVIEW-008, TC-CROSS-006, TC-CROSS-014 | 真实Design/Scope/Worktree/Build/Test/Evidence、单boundary staged/message；未有不commit | 真实hash/baseline/report/reviewer/未跑检查/remaining blockers；next commit-07-a；55项独立表 |
| commit-07-a | 正式05 §6/9/12/13；06 §10/14；07 §7/12；[Step3具体阅读](07_implementation_plan_step_03_prerequisites_reads.md)与[独立骨架](implementation-boundaries/commit-07-a.md) | 22 CLI/exit/failed finalizer、98+库存与55项经验审计；提交前验证工具能力，提交后固定源码生成final EV/draft；primary TC-CROSS-010, TC-CROSS-023 | 真实Design/Scope/Worktree/Build/Test/Evidence、单boundary staged/message；未有不commit | 真实hash/baseline/report/reviewer/未跑检查/remaining blockers；next commit-07-b；55项独立表 |
| commit-07-b | 正式03 §16/17；05 §12～14；06 §4/10～14；07 §12；[Step3具体阅读](07_implementation_plan_step_03_prerequisites_reads.md)与[独立骨架](implementation-boundaries/commit-07-b.md) | design/Scope/Worktree/Commit/Handoff复核；真实 reviewer/新 review，不造结果；无独立primary；补层 全98TC及required subcase（复核07-a同run输出，变更后新run） | 真实Design/Scope/Worktree/Build/Test/Evidence、单boundary staged/message；未有不commit | 真实hash/baseline/report/reviewer/未跑检查/remaining blockers；next waiting user；55项独立表 |

实现Gate全部pending；本轮设计经验P/N/B定义及source代号见审核附录，不代表代码或真实资格。直接checked命令依据Step7；有raw必须生成对应报告。07-b文档/台账增量只做静态checks与现有同run报告审查，如改代码/config/工具就回对应boundary并新run。

### 本轮逐boundary定向小循环/停审

本表是Step13初审后本次设计修复记录，不虚构早先时间、真实run或owner受理。每行按来源/问题→诊断/取舍→结构化→候选正文→设计停审，才进入下一行；可复用经验已由标准§9.2的phase/config/selector/typedplan/artifact规则覆盖，无新增规则需要越权改标准，项目记录具体正反例并刷新记忆。

| Boundary | 来源/当前问题 | 取舍及当前产物 | 设计停审 / 未关闭 |
|---|---|---|---|
| commit-01-a | 正式03 §3～7/9/15；05 §9/13；06 §10；07 §3/6/7；fixture codec/domain；工具参数/路径/失败 finalizer | 前置及scope如总表；workspace与依赖target骨架/每个typed carrier/value/state/每个domain factory/guard/原始输出与报告bootstrap；55项见独立表 | 设计分配收口，设计静态已核；实际仓/baseline/checks waiting |
| commit-01-b | 正式03 §13；04 §3～11；05 §8/9/13；06 §6/9；strict parser/profile/redaction；七字段映射 | 前置及scope如总表；strict loader/envelope/七RuntimeConfig映射/四profile/秘密ref与safe展示；55项见独立表 | 设计分配收口，设计静态已核；实际仓/baseline/checks waiting |
| commit-02-a | 正式03 §5.3/6.2/8/10～12/14；05 §6/9；06 §8；reserve/replay/完整 result、rollback、channel/digest 与 fake parity | 前置及scope如总表；17port/146method closed签名/Command/Job runner/context/原结果/FlowSupport/FreshGate与ReadFacade/UoW与同语义fake；55项见独立表 | 设计分配收口，设计静态已核；实际仓/baseline/checks waiting |
| commit-02-b | 正式03 §10～12；04 §7/9；05 §6/8/9；06 §8；实际 PG 帧锁/CAS/rollback/固定 upper/compound cursor | 前置及scope如总表；逐store Row/codec/migration/事务锁/cursor/history/result/lookup/as-of/page与projection plan/fake/durable parity补齐；55项见独立表 | 设计分配收口，设计静态已核；实际仓/baseline/checks waiting |
| commit-03-a | 正式03 §6.3/7～12/14/17；05 §6；06 §5/7/8；publisher/source/material/full basis；MatchedDecision 可为 rejected；current Listed gate | 前置及scope如总表；U1四flow/U2八flow/U3五Command/高风险原子写与decisions拒绝；55项见独立表 | 设计分配收口，设计静态已核；selected positive blocked MP-UP-001,MP-UP-002,MP-UP-003,MP-UP-004,MP-SRC-010,MP-SRC-013 |
| commit-03-b | 正式03 §6.3/7～12；05 §6/9；06 §5/7/8；search/current disclosure/PageReadContext；完整 shadow manifest/body/state 原子替换 | 前置及scope如总表；U3五Query/U7两Query与两Job/四kind完整builder/shadow/manifest/存储与Query协作接线；55项见独立表 | 设计分配收口，设计静态已核；selected positive blocked MP-UP-001,MP-UP-003 |
| commit-04-a | 正式03 §6.3/7～12/17；05 §6/9；06 §5/7/8/11；原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome | 前置及scope如总表；U4三Command/两Query/U4两Job/分发与撤回共享锁；55项见独立表 | 设计分配收口，设计静态已核；selected positive blocked MP-UP-001,MP-UP-002,MP-UP-003,MP-UP-004,MP-UP-005 |
| commit-04-b | 正式03 §6.3/7～12/17；05 §6/9；06 §5/7/8/11；no-new shared lock、known upper/late cursor 回 Partial、NoticeIntent 结果绑定 | 前置及scope如总表；U5四Command/两Query/U5三Job/撤回-分发竞态与原结果；55项见独立表 | 设计分配收口，设计静态已核；selected positive blocked MP-UP-003,MP-UP-005,MP-UP-007 |
| commit-05-a | 正式03 §6.3/7～12/14；05 §6/9；06 §5/7/8/10；16 Query/33 replay 总审查；原完整 payload、分页及脱敏 | 前置及scope如总表；U6三只读入口/16Query/33replay联合复核；55项见独立表 | 设计分配收口，设计静态已核；selected positive blocked MP-UP-003 |
| commit-05-b | 正式03 §6.3/7～12/14/17；05 §6/9；06 §7/8/10；typed recovery plan、checkpoint/lease/fence、原报告、producer 防递归 | 前置及scope如总表；U6一Command/三Job/checkpoint/lease/fence与原报告/Observation防递归/safe handoff；55项见独立表 | 设计分配收口，设计静态已核；selected positive blocked MP-UP-003,MP-UP-005,MP-UP-007,MP-UP-008 |
| commit-06-a | 正式03 §5.5/6.3/7/8/11/13；04 §9；05 §6/9；06 §7；trusted context/channel/page、HTTP status/Query degraded、37route/0Jobroute | 前置及scope如总表；可信API context与37route/typed response/error mapping/API runtime装配；55项见独立表 | 设计分配收口，设计静态已核；selected positive blocked MP-UP-003 |
| commit-06-b | 正式03 §5.6/5.7/6.3/7/8/11/13；04 §7；05 §6/8/9；06 §7/8/9；12 jobs/完整 report、A/B/shutdown；Web 全状态/EN-ZH、不重发意图 | 前置及scope如总表；12internal Job与scheduler/Vue/TS client/7views/状态/i18n/入口与UI联合回归；55项见独立表 | 设计分配收口，设计静态已核；selected positive blocked MP-UP-003 |
| commit-06-c | 正式03 §3/6.2/13/14/17；04 §7/9/11；05 §6/9；06 §7/10；exact owner/type/operation/version/scope；safe unavailable、Unknown/probe 与 redaction | 前置及scope如总表；逐八slot SDK exact mapping/Unknown/probe与failure映射/runtime/telemetry/redaction装配；55项见独立表 | 设计分配收口，设计静态已核；selected positive blocked MP-UP-001,MP-UP-002,MP-UP-003,MP-UP-004,MP-UP-005,MP-UP-007,MP-UP-008,MP-SRC-010 |
| commit-07-a | 正式05 §6/9/12/13；06 §10/14；07 §7/12；22 CLI/exit/failed finalizer、98+库存与55项经验审计；提交前验证工具能力，提交后固定源码生成final EV/draft | 前置及scope如总表；完善22脚本/registry/manifest/raw→suite→run→finalEV/final seal与acceptance draft；55项见独立表 | 设计分配收口，设计静态已核；selected positive blocked MP-UP-008 |
| commit-07-b | 正式03 §16/17；05 §12～14；06 §4/10～14；07 §12；design/Scope/Worktree/Commit/Handoff复核；真实 reviewer/新 review，不造结果 | 前置及scope如总表；逐boundary实际交付审查/AC/VETO/分层handoff审查/台账/current与下一动作；55项见独立表 | 设计分配收口，设计静态已核；selected positive blocked MP-UP-001,MP-UP-002,MP-UP-003,MP-UP-004,MP-UP-005,MP-UP-007,MP-UP-008,Q-MP-01 |

### 跨 boundary 审计

49flow、215path、98TC/EV的唯一主归属在附录；多边界共享文件只允许增量方法组，不能再建truth；15首尾链接及PH04→PH03 Listed前置一致。0activeevent/outbox、0Billing/Archive writer；N经验不能变成省略实际required读写的理由。全部真实gate未执行，Step13核后才登记设计自检。

### 提交前诊断与提交后固定源码（05 Context前置）

07-a三个BATCH族在提交前闭合完整工具能力与直接测试，不要求先产正式finalEV；其实际all11/98EV/六artifact/六seal/draft验证放在提交后固定源码的新run，完整材料通过前不Handoff。任务表的“子批通过”只指提交前能力/直接检查，不是未提交增量的正式证据通过。

正式05 schema的Context必须有真实implementation_commit和generator_commit，且与实际被测/报告生成源码一致。首次boundary未有commit，或源码/fixture/tooling仍有未提交改动时，不能把旧HEAD、设计commit、占位hash或临时tree当作这两个字段。此时只保存安全实际直接测试/工具输出的诊断与审查说明，位置为reports/review/<boundary_id>-precommit.md；它不是正式machine case/report/EV，也不伪渲染合格index。schema/工具负例fixture只是测试输入，不能代替实际业务raw。

提交前Build/Test核当前完整能力与直接层检查；Evidence Gate按当前诊断成熟度核真实输出/失败解释、scope和安全，不能声称完整主suite/合格EV。全部代码能力及这些required检查有真实结果、用户另授权后，才可单boundarycommit。提交之后固定真实源码与generatorcommit，源码/fixture/tooling无dirty或无关未跟踪输入，再以新run/newexecution生成正式05 Context和当前partial/full材料；不能让旧HEAD报告覆盖未提交代码来源。输出区新增报告不等源码dirty，所有输入仍须可追溯。

当前边界Handoff再核提交后同源材料、remainingblockers与next。07-a提交前只验证fulltool能力/直接测试/非合格诊断，不先发finalEV；提交后新run才运行全11/allsubcase/六artifact→98EV/index→六seal→draft，完整包通过才能handoff07-b。若失败保留currentblocked，在额外提交授权和用户改动保护下修复同boundary/fix或获准amend，固定新实际commit后再新run；不提前激活下一边界。本时序不放宽任何05/06 required集合，不新增machine字段/证明状态。

## 回填草稿

正式§6装配15边界/七phase任务、批次模板、协作body组、提交时机、55经验入口及库存引用。实现者不需补schema；缺定义回到truth owner，本次执行不做实现或commit。

## 待确认事项

实际不可变baseline、目标repo/toolchain、Core/SDKexport、ownerpositive、PG/capacity/retention与reviewer按最早使用点waiting/blocked；不是可随意跳过的当前门禁。

## 进入下一步条件

任务/scope/前置/批次/55项经验有来源，Step13已实际核对49任务族、49flow、215path与15骨架；条件仅设计定义，不是测试证据已执行。

## 停审记录

本Step及其定向回修已通过Step13实际文档静态检查，正式来源与结构化产物一致。状态为completed / selfcheck_done / stop_review；本轮全部07设计已完成，现在等待用户确认07，不跨文档或实施。上游blocker、immutablebaseline与实际实现Gate仍未通过；无业务测试run或commit。
