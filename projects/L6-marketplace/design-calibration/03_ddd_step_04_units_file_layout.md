# 03 Step 4：收稳实现单元与文件布局

## 1. Step状态

开工确认：2026-10-01；full-restart / single-agent；授权仅Step1～4。当前 completed / selfcheck_done，gate_status=pass（仅本Step设计产物）。输出：03_ddd_step_04_units_file_layout.md；未来回填正式§4，当前不得修改正式03。已读通用规范、详细SOP当前Step、书写规范对应章节和前序输入。

### Step内计划

| 单元 | 产物位置 | 状态 |
|---|---|---|
| P1读取输入 | §2 | done |
| P2问题回答 | §3 | done |
| P3诊断 | §4 | done |
| P4取舍与前后比较 | §5/6 | done |
| P5结构化 | §7 | done |
| P6复杂度判断 | §7末 | done |
| P7回填草稿 | §8 | done |
| P8自检与停审 | §10 | done |

## 2. 本步输入

前序：[Step2](03_ddd_step_02_scope.md)、[Step3](03_ddd_step_03_coding_constraints.md)问题/诊断/取舍/开放项；当前02§4/5/7/12；已读[目录规范](../../../standards/document/子项目目录与代码文件组织规范.md)全文、详细SOP Step4/书写规范5.4。Core/SDK根与contracts/client真实manifest用于path核验，非本仓文件。当前marketplace目标实现仓不存在。

## 3. SOP问题回答

1. 本轮实现包含哪些crate/package/binary/library？

答：选择一个plannedmarketplace实现仓内六Rustmember（contracts/domain/application/infra/api/worker）与独立apps/web。api和worker是两个binary；infra封装运行组装，两入口共享application，Web独立build/deploy。无CLI/jobs/ops/xtask新member，12常驻Worker内部任务不变成12binary。只画planned，不创建这些目录。

2. 每个实现单元对应概要设计中的哪个代码主体？

答：contracts承接typedC/Q/J/view/error，domain承接43对象中的领域不变量与14carrier迁移，application承接七Service/三Entry的内侧编排和requiredports，infra承接PG/SDK/runtime，api对应Command/Query入口外壳，worker对应耐久任务入口，web展示/发意图。U不是crate轴，七U跨domain/application而非七服务。

3. 文件路径应该如何组织，才能体现模块边界？

答：role用crates/<role>；application按七责任模块再按49用例snakecase文件；domain按聚合/记录/策略职责文件；infra按PG/SDK/fake/runtime；web按页面和功能composable，locale资源独立。应用ports与SDK/SQL实现不能放同目录，测试就近按功能与跨层riskcut。

4. 哪些文件必须创建，哪些文件只是后续可能扩展？

答：本Step列出的文件是完整03当前范围的planned必需清单，但未获实施许可、不意味着已创建。完整SQLDDL/migration文件要等持久化Step确定schema后受控回修布局，不先造001_init.sql内容或空目录；transportroute细节等协议Step。未来CLI/outbox/billing/archive/脚本报告等不列必须文件；07/05确认后才追加具体路径。

5. 每个文件负责定义哪些对象/trait/handler/repository或测试？

答：须用具体路径→U/技术层→typed定义/责任表。公共词汇/context/result在contracts，领域aggregate/guard在domain，applicationporttraits与用例不碰SDK字段，infraadapter和PGtx/mapping，apihandler只映射，workerclaim/scheduler调用内部job，webtypedclient/runtimevalidation/状态呈现，fake只devtest不能生产fallback。本Step只分配文件owner，不提前定义Step5模块完整契约。

6. 当前仓的projectslug是什么？

答：marketplace，planned实现仓/home/aris/Projects/quantalithos-marketplace；designL6导航不入代码标识。apps/webpackage计划marketplace-web，不另造领域项目。

7. workspacemember目录是否使用crates/<role>？

答：是，六role短目录，不用crates/marketplace_domain或l6_marketplace。

8. Cargopackage是否使用<project>-<role>？

答：是，marketplace-contracts/domain/application/infra/api/worker；根virtualworkspace不是quantalithos-marketplace总package。

9. Rustlibrarycrate是否使用<project>_<role>？

答：四library分别marketplace_contracts/domain/application/infra；api/worker只binary不额外library。TypeScriptpackage不是Rustcrate。

10. binary名是否表达用户入口或具体动作？

答：marketplace-api、marketplace-worker，分别入口server与常驻worker；无模糊service/bin，内部Job不公开创建运维binary。

11. 是否有L0/L1/l0_/l1_等架构层级泄漏进代码命名？

答：没有，层级仅design路径与source导航。owneradapter按语义职责命名，不用l1_governance_adapter。

12. 如果本仓存在已确认的编译期依赖，Cargopathdependency应写在哪个Cargo.toml，使用哪个真实crate路径？

答：plannedrootCargo.toml的workspace.dependencies声明Corecontracts与SDKclient/contracts真实siblingpath；member引用workspace=true。root基于/home/aris/Projects/quantalithos-marketplace，故../quantalithos-core/crates/contracts及../quantalithos-sdk/crates/client/contracts；不能在member直接照抄根相对path。domain只依赖本地contracts的纯词汇，不能依赖Core/SDK/HTTP/SQLruntime；两入口通过infra wiring使用SDK。

13. 哪些运行期依赖或事件协作依赖只能在adapter/event/projection章节表达，不能进入文件布局的Cargo依赖？

答：九owner、publisher/material/receiver/noticeauthority、Archive/Billing等无直接Cargo。SDKports的blockedslots与typed资格设计保留；当前0activeevent无event.rs/outbox.rs/consumer.rs文件。provider产品不成为ownertruth。

## 4. 当前文档问题诊断

当前02§4图是代码关系而非目录树，七U若直接拆七crate会掩盖Domain与SDK/SQL隔离；§7三Entry与12Job需要共享application，但不能凭空新增CLI/jobs/ops。当前目录专项规范要求crates/<role>，详细书写规范布局对照表仍展示crates/<name>_domain旧示例，后者不能覆盖该章随后明确的短role规则。真实Core/SDK都为workspace，必须依其具体member而非根path。scope/metadata/fakeruntime文件必须有明确归属，未定义migration/evidence脚本不能放大量占位。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 工程布局 | 02只有分层图 | 六member+apps/webplanned单仓 | 多入口共享且编译隔离 |
| 业务/技术轴 | 七U容易误拆微服务 | 七责任模块跨role，49用例有路径 | 无部署/owner分裂 |
| 本地依赖 | 仓级Core/SDK | root真实memberpath+memberworkspace引用 | 相对路径正确 |
| future文件 | 容易造CLI/事件/支付/报告目录 | 当前不列，受控重开后追加 | 不伪进度 |
| 文件状态 | 可能误称仓已建 | 所有树路径为planned，外部checked | 无实现授权 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| workspace六member+同repoapps/web | API/Worker共享、强制Domain纯净，Web独立build/deploy | workspace与两toolchain维护成本 | 采用；多入口/infra重已满足选择条件，不声称外部Rust消费者已确认 |
| 单crate模块分层 | 初期目录简单 | API/Worker/SDK/SQL边界依赖review，外层库容易流入Domain | 不采用；本仓一致性/typedports需可检查边界 |
| 前后端独立repo或七U七repo | 发布可分别管理 | 当前无独立owner/team/release需求，增加协议漂移/台账成本 | 不采用；独立build/deploy不等独立repo |
| domain→infra或owner直接path | 调用方便 | 破坏向内边界和globalcompile裁剪 | 禁止 |

## 7. 结构化中间产物

### 规则与实现仓判定

遵守[目录规范](../../../standards/document/子项目目录与代码文件组织规范.md)§2～8/输出表。slug=marketplace；target=/home/aris/Projects/quantalithos-marketplace，当前不存在。下方路径均planned，不创建代码文件；无历史工程偏离需继承。短role规则优先于详细书写规范对照表的旧重复前缀示例。

### 布局形态决策表

| 候选布局 | 是否采用 | 判断依据 | 影响 |
|---|---|---|---|
| 单crate模块分层架构 | 否 | 多运行入口共享复杂UoW与SDK/PG，需要依赖边界可检查 | 不依赖仅目录review防domain污染 |
| workspace多crate架构 | 是 | API/Worker独立binary，共享application，domain不得依赖HTTP/DB/SDK | 六member；七U不等七crate，不新增外部Rustconsumer承诺 |
| 多repo前后端/七U微服务 | 否 | 当前同一truthowner且无独立团队/版本需求 | 同repoapps/web独立build/deploy，不共享DB访问 |

### 实现单元总表

| 实现单元 | 类型 | 职责 | 对应概要设计章节 |
|---|---|---|---|
| contracts | library | type-only本地协议/词汇/上下文/有限结果与状态 | 02§6/7 |
| domain | library | aggregate/record/纯policy及迁移，state词汇只引用唯一contracts定义 | 02§5/6/9 |
| application | library | 七Service/三Entry内侧dispatch、49用例、port、共同runner | 02§4/5/7/8 |
| infra | library | SDK/PG/fake/runtime adapters | 02§4/7/8/11 |
| api | binary | Command/Query HTTPentry，无公开内部Job | 02§4/7 |
| worker | binary | 耐久work常驻推进12内部Job | 02§4/7/8 |
| web | TS/Vue SPA | 展示/提交意图/locale/typedclient | 02§4/11/12 |

### 目录 / package / crate / binary映射

| 实现单元目录 | 类型 | Cargo package | Rust crate / binary | 职责 | 是否对外暴露 |
|---|---|---|---|---|---|
| crates/contracts | library | marketplace-contracts | marketplace_contracts | type-only协议与纯词汇 | 仅本仓用；对外protocol，不承诺跨仓Rustimport |
| crates/domain | library | marketplace-domain | marketplace_domain | domain | 否 |
| crates/application | library | marketplace-application | marketplace_application | usecase/port | 否 |
| crates/infra | library | marketplace-infra | marketplace_infra | adapters/wiring | 否 |
| crates/api | binary | marketplace-api | marketplace-api | API入口 | HTTP服务，route后续校准 |
| crates/worker | binary | marketplace-worker | marketplace-worker | 常驻worker | 无任意HTTPjob入口 |
| apps/web | Vue/TS package | 不适用；npmname marketplace-web | 不适用 | SPA | Web客户端 |
| root | virtualworkspace | 无根package | 无根crate | member/工具链/依赖 | 否 |

### Planned文件布局树

下方为ASCII目录布局（标识/连接符ASCII，责任说明可中文），只列确认责任文件；所列单行嵌套路径等价实际目录，不代表文件已经存在。

```text
quantalithos-marketplace/                 # PLANNED, currently absent
  Cargo.toml                             # virtual workspace + root dependency paths
  Cargo.lock                             # only generated after authorized dependency resolution
  rust-toolchain.toml                    # planned Rust 1.93 compatibility baseline
  rustfmt.toml                           # formatter policy
  crates/
    contracts/                             # contracts ownership boundary
      Cargo.toml                         # package/member dependencies
      src/
        lib.rs # 导出type-only协议模块，不组装runtime
        value_objects.rs # 本地typed ID/ref/revision/cursor等纯词汇；不可冒称owner导出
        states.rs # 本地carrier state词汇单一来源；无迁移或外部approval定义
        context.rs # 引用Core actor/metadata的入口与worker wrapper形状，不重复key/trace
        worker_protocol.rs # 12内部Job请求/完整逐itemreport/有限结果与错误
        errors.rs # 安全public error/disposition词汇，不回传raw SDK/DB错误
        source_responsibility.rs # U1 Command/Query/Result/View协议；不持有领域对象或owner正文
        publication_review.rs # U2 Command/Query/Result/View协议；不持有领域对象或owner正文
        catalog_version.rs # U3 Command/Query/Result/View协议；不持有领域对象或owner正文
        distribution.rs # U4 Command/Query/Result/View协议；不持有领域对象或owner正文
        withdrawal_notice.rs # U5 Command/Query/Result/View协议；不持有领域对象或owner正文
        audit_recovery.rs # U6 Command/Query/Result/View协议；不持有领域对象或owner正文
        reference_read.rs # U7 Command/Query/Result/View协议；不持有领域对象或owner正文
      tests/protocol_roundtrip_tests.rs # finite typed protocol/metadata codec
    domain/                             # domain ownership boundary
      Cargo.toml                         # package/member dependencies
      src/
        lib.rs # 导出同步领域aggregate/record/policy
        source_binding.rs # re-export contracts SourceBinding/MaterialReference；SourceVerification与来源guard
        publisher_relation.rs # PublisherRelation/SourceGatePolicy；release当前资格失效
        publication_basis.rs # immutable PublicationBasis与固定basis不变量
        publication_application.rs # PublicationApplication draftspec/factory/提交固定basis
        review_handoff.rs # ReviewHandoff/GovernanceDecisionBinding/ReviewBindingPolicy，不产生approval
        marketplace_listing.rs # MarketplaceListing局部metadata，不复制资产正文
        market_version.rs # MarketVersion/VersionAdmissionPolicy与Staged/Listed/Restricted/Withdrawn
        category.rs # Category与目录分类不变量，不作owner资产kind
        distribution_intent.rs # DistributionIntent/AcquisitionGatePolicy；本地受理/取消
        distribution_attempt.rs # DistributionAttempt/ReceiverOutcomeBinding；attempt效果独立于取消
        distribution_relation.rs # DistributionRelation市场分发关系，不等installed
        withdrawal_impact.rs # WithdrawalDisposition/ImpactRecord/WithdrawalImpactPolicy与knownscope
        notice_intent.rs # NoticeIntent/NoticeOutcomeBinding；Confirmed不等read/delivered
        operation_record.rs # OperationContext/OperationRecord；StoredOperationResult re-export contracts immutable result
        market_audit_record.rs # append-only MarketAuditRecord，不等Obsreceipt
        deferred_work.rs # DeferredWork状态/claim/fence规则，不含schedulerI/O
        recovery_intent.rs # RecoveryIntent/ObservationOutcomeBinding/RecoveryPolicy
        qualified_reference_snapshot.rs # TypedOwnerReference/QualifiedReferenceSnapshot本体+state/ReadBoundaryPolicy
        read_projection.rs # ReadProjection/QualifiedReadContext，派生身份/typed rebuild规则
      tests/source_responsibility_tests.rs # U1 pure guard/state cases
      tests/publication_review_tests.rs # U2 pure guard/state cases
      tests/catalog_version_tests.rs # U3 pure guard/state cases
      tests/distribution_tests.rs # U4 pure guard/state cases
      tests/withdrawal_notice_tests.rs # U5 pure guard/state cases
      tests/audit_recovery_tests.rs # U6 pure guard/state cases
      tests/reference_read_tests.rs # U7 pure guard/state cases
    application/                             # application ownership boundary
      Cargo.toml                         # package/member dependencies
      src/
        lib.rs # 导出三Entry、七Service编排与port，不调用具体SDK/SQL
        entries.rs # MarketCommandEntry/MarketQueryEntry/MarketWorkerEntry typed dispatch
        operation_context.rs # Core上下文到本地OperationContext转换与唯一authority核验
        command_runner.rs # command共同受理/原结果/同UoW写集调用顺序
        job_runner.rs # 内部Job claim/fence/逐itemreport/原结果编排
        read_facade.rs # Query currentvisibility/disclosure与no-write
        intent_fingerprint.rs # 版本化canonical intent；不重算OwnerAssetDigest
        ports/mod.rs # 导出内侧ownedtraits
        ports/market_store.rs # MarketStorePort typed mutable/immutable save/get/bykey
        ports/operation_store.rs # OperationStorePort reserve/fullresult/load/conflict
        ports/audit_store.rs # AuditStorePort append/typed safe read
        ports/work_store.rs # WorkStorePort claim/fence/permission/durable responsibility
        ports/snapshot_store.rs # SnapshotStorePort typed material+state save/get
        ports/projection_store.rs # ProjectionStorePort identity/cursor/shadow/typed views
        ports/source_owner.rs # SourceOwnerPort正式immutable source required能力
        ports/publisher_authority.rs # PublisherAuthorityPort主体/关系资格required能力
        ports/material_authority.rs # MaterialAuthorityPort签名/扫描引用适用与有效性
        ports/governance.rs # GovernancePort正式decision/fullbinding/probe required能力
        ports/scope_resolver.rs # ScopeResolverPort trustedref→scope/disclosure
        ports/receiver.rs # ReceiverPort原intent/outcome/probe required能力
        ports/notice_channel.rs # NoticeChannelPort正式target/channel/outcome/probe
        ports/observation.rs # ObservationPort producer资格/receipt/probe
        ports/unit_of_work.rs # MarketUow/transactionrunner typedcommit/failure责任
        errors.rs # application有限错误与安全拒绝/unknown/blocked映射
        source_responsibility/mod.rs # U1 来源/发布责任 facade and exports
        source_responsibility/bind_publisher_relation.rs # U1 bind_publisher_relation use case
        source_responsibility/release_publisher_relation.rs # U1 release_publisher_relation use case
        source_responsibility/verify_publication_source.rs # U1 verify_publication_source use case
        source_responsibility/get_source_qualification.rs # U1 get_source_qualification use case
        publication_review/mod.rs # U2 申请/正式审核交接 facade and exports
        publication_review/create_publication_draft.rs # U2 create_publication_draft use case
        publication_review/revise_publication_draft.rs # U2 revise_publication_draft use case
        publication_review/submit_publication_application.rs # U2 submit_publication_application use case
        publication_review/terminate_publication_application.rs # U2 terminate_publication_application use case
        publication_review/record_governance_decision.rs # U2 record_governance_decision use case
        publication_review/get_publication_progress.rs # U2 get_publication_progress use case
        publication_review/dispatch_review_handoff.rs # U2 dispatch_review_handoff use case
        publication_review/reconcile_review_handoff.rs # U2 reconcile_review_handoff use case
        catalog_version/mod.rs # U3 目录/市场版本 facade and exports
        catalog_version/create_marketplace_listing.rs # U3 create_marketplace_listing use case
        catalog_version/edit_marketplace_listing.rs # U3 edit_marketplace_listing use case
        catalog_version/maintain_market_category.rs # U3 maintain_market_category use case
        catalog_version/register_market_version.rs # U3 register_market_version use case
        catalog_version/list_market_version.rs # U3 list_market_version use case
        catalog_version/search_marketplace_catalog.rs # U3 search_marketplace_catalog use case
        catalog_version/get_marketplace_listing.rs # U3 get_marketplace_listing use case
        catalog_version/list_market_versions.rs # U3 list_market_versions use case
        catalog_version/select_market_version.rs # U3 select_market_version use case
        catalog_version/list_market_categories.rs # U3 list_market_categories use case
        distribution/mod.rs # U4 受控分发 facade and exports
        distribution/request_distribution.rs # U4 request_distribution use case
        distribution/cancel_distribution.rs # U4 cancel_distribution use case
        distribution/record_receiver_outcome.rs # U4 record_receiver_outcome use case
        distribution/get_acquisition_eligibility.rs # U4 get_acquisition_eligibility use case
        distribution/get_distribution_progress.rs # U4 get_distribution_progress use case
        distribution/dispatch_distribution.rs # U4 dispatch_distribution use case
        distribution/reconcile_distribution.rs # U4 reconcile_distribution use case
        withdrawal_notice/mod.rs # U5 撤回/影响/通知 facade and exports
        withdrawal_notice/restrict_market_version.rs # U5 restrict_market_version use case
        withdrawal_notice/withdraw_market_version.rs # U5 withdraw_market_version use case
        withdrawal_notice/plan_impact_notifications.rs # U5 plan_impact_notifications use case
        withdrawal_notice/record_notice_outcome.rs # U5 record_notice_outcome use case
        withdrawal_notice/get_withdrawal_impact.rs # U5 get_withdrawal_impact use case
        withdrawal_notice/get_notice_progress.rs # U5 get_notice_progress use case
        withdrawal_notice/enumerate_known_impact.rs # U5 enumerate_known_impact use case
        withdrawal_notice/dispatch_notice.rs # U5 dispatch_notice use case
        withdrawal_notice/reconcile_notice.rs # U5 reconcile_notice use case
        audit_recovery/mod.rs # U6 审计/恢复 facade and exports
        audit_recovery/request_market_recovery.rs # U6 request_market_recovery use case
        audit_recovery/get_market_audit.rs # U6 get_market_audit use case
        audit_recovery/get_recovery_progress.rs # U6 get_recovery_progress use case
        audit_recovery/get_operation_result.rs # U6 get_operation_result use case
        audit_recovery/run_market_recovery.rs # U6 run_market_recovery use case
        audit_recovery/dispatch_observation.rs # U6 dispatch_observation use case
        audit_recovery/reconcile_observation.rs # U6 reconcile_observation use case
        reference_read/mod.rs # U7 引用/snapshot/索引 facade and exports
        reference_read/get_reference_freshness.rs # U7 get_reference_freshness use case
        reference_read/get_projection_freshness.rs # U7 get_projection_freshness use case
        reference_read/refresh_qualified_references.rs # U7 refresh_qualified_references use case
        reference_read/rebuild_market_read_projection.rs # U7 rebuild_market_read_projection use case
      tests/source_responsibility_flow_tests.rs # U1 typed port/UoW flow cases
      tests/publication_review_flow_tests.rs # U2 typed port/UoW flow cases
      tests/catalog_version_flow_tests.rs # U3 typed port/UoW flow cases
      tests/distribution_flow_tests.rs # U4 typed port/UoW flow cases
      tests/withdrawal_notice_flow_tests.rs # U5 typed port/UoW flow cases
      tests/audit_recovery_flow_tests.rs # U6 typed port/UoW flow cases
      tests/reference_read_flow_tests.rs # U7 typed port/UoW flow cases
    infra/                             # infra ownership boundary
      Cargo.toml                         # package/member dependencies
      src/
        lib.rs # 导出显式外层组装，不把fakes作为default
        runtime_config.rs # RuntimeConfig/validator形状；exactkey/profile由04
        runtime_builder.rs # API/Worker dependencywiring，缺合同failclosed
        telemetry.rs # 脱敏runtime日志/metric/trace，不替业务audit
        postgres/mod.rs # PostgresMarketAdapter与连接/transaction映射
        postgres/unit_of_work.rs # SQLx单localtransaction与commit错误映射
        postgres/market_store.rs # 领域对象typed save/get/bykey/CAS映射
        postgres/operation_store.rs # operation唯一性/fullresult typedcodec与读取
        postgres/audit_store.rs # safeaudit append/read映射
        postgres/work_store.rs # 耐久work/claim/fence/permissiontyped保存
        postgres/snapshot_store.rs # qualifiedsnapshot typed本体+state保存/读取
        postgres/projection_store.rs # scopeboundtypedview/shadow/cursor替换
        postgres/catalog_search.rs # 参数化过滤/search/分页索引访问，无owner正文
        postgres/row_codec.rs # DB row到typed载体/rehydrate校验，不万能JSONload
        sdk/mod.rs # SdkOwnerAdapters总导出，不公开owner直连
        sdk/source_owner_adapter.rs # SourceOwnerPort→正式SDKoperation逐类型qualification
        sdk/publisher_authority_adapter.rs # publisherauthorityslot，owner未明返回blocked
        sdk/material_authority_adapter.rs # 材料requiredport→正式SDK支持/blocked
        sdk/governance_adapter.rs # approved完整binding与原意图probe；无自裁
        sdk/scope_resolver_adapter.rs # 正式scope/disclosure requiredslot，no localauthfallback
        sdk/receiver_adapter.rs # exactversion/intent/effect/probe，缺支持不发
        sdk/notice_channel_adapter.rs # target/channel/outcome/probe，缺支持不造送达
        sdk/observation_adapter.rs # producer/receipt资格与safeaudit交接
        fake/mod.rs # dev/test显式fixture组装，生产不得导出fallback
        fake/local_store.rs # 所有localport同UoW失败/重放/CAS语义的inmemory实现
        fake/owner_ports.rs # typed formalfixture/gap/unknown/lateoutcome场景；非真实owner
      tests/postgres_atomicity_tests.rs # local writes/result/work atomicity
      tests/sdk_qualification_tests.rs # supported/gap/unknown safe mapping
      tests/withdrawal_race_tests.rs # shared local version serialization
      tests/projection_rebuild_tests.rs # typed body/state/plan/cursor
    api/                             # api ownership boundary
      Cargo.toml                         # package/member dependencies
      src/
        main.rs # marketplace-api进程启动与关闭，读取配置/组装
        routes.rs # 获准publicCommand/Queryroute注册，不公开12Job
        trusted_context.rs # trusted入口上下文校验/构造，caller不能自填qualified
        response_mapping.rs # typedresult/error→safe HTTPdisposition，结果种类不混
        handlers/source_responsibility.rs # U1入口DTOdecode/currentcontext/dispatch，no domaintruth
        handlers/publication_review.rs # U2入口DTOdecode/currentcontext/dispatch，no domaintruth
        handlers/catalog_version.rs # U3入口DTOdecode/currentcontext/dispatch，no domaintruth
        handlers/distribution.rs # U4入口DTOdecode/currentcontext/dispatch，no domaintruth
        handlers/withdrawal_notice.rs # U5入口DTOdecode/currentcontext/dispatch，no domaintruth
        handlers/audit_recovery.rs # U6入口DTOdecode/currentcontext/dispatch，no domaintruth
        handlers/reference_read.rs # U7入口DTOdecode/currentcontext/dispatch，no domaintruth
        handlers/mod.rs # 导出获准handlers
      tests/entry_mapping_tests.rs # trusted context/public disposition/no job route
    worker/                             # worker ownership boundary
      Cargo.toml                         # package/member dependencies
      src/
        main.rs # marketplace-worker常驻进程，配置/组装/关停
        scheduler.rs # 有界claim/并发/lease/fence调度，不直接改domain
        job_dispatch.rs # 12内部jobrequest到MarketWorkerEntry，report处理
        shutdown.rs # inflight许可/取消/unknown责任保留，不将关停当未发
      tests/worker_recovery_tests.rs # claim/fence/probe/crash/late result
  apps/web/                              # independent SPA build/deployment
    package.json # marketplace-web依赖/构建与测试入口planned
    tsconfig.json # strictTS配置，无tsignore兜底
    vite.config.ts # SPA构建/devprofile，不继承9090生产默认
    index.html # Vue真实应用挂载页，不是本轮HTMLdemo
    src/main.ts # App/router/i18n初始化
    src/App.vue # 应用shell与导航，无truthstore
    src/router.ts # 目录/详情/申请/分发/撤回/审计/publisher/设置视图
    src/api/marketplace_client.ts # typedMarketplaceAPI访问与错误/unknown处理，不直连owners
    src/api/protocol.ts # 正式Step8协议的TS映射，无手造第二schema
    src/api/response_validation.ts # runtimefinitevariant/optional验证，缺少形状安全失败
    src/i18n/index.ts # defaulten/zh切换，仅展示locale
    src/i18n/en.json # 英文展示资源
    src/i18n/zh.json # 中文展示资源
    src/components/MarketStatusBadge.vue # 有限carrier与freshness/disposition分别呈现
    src/components/OwnerReferenceSummary.vue # safeimmutable ref/version/digest/visibility，no body
    src/components/LanguageSwitch.vue # EN/ZH切换不改业务意图
    src/components/MarketAsyncState.vue # loading/empty/rejected/unknown/stale/degraded统一呈现
    src/views/MarketCatalogPage.vue # 分类/filter/search/count在同scope下展示
    src/views/MarketListingPage.vue # listing/versions/selection/eligibility展示与获取意图
    src/views/MarketPublicationPage.vue # safe draft/提交/正式review进度，不显示本地审批按钮
    src/views/MarketDistributionPage.vue # intent/attempt/outcome分轴、取消不假卸载
    src/views/MarketWithdrawalPage.vue # restriction/withdraw/knownimpact/notice分轴
    src/views/MarketAuditRecoveryPage.vue # safeaudit/完整原结果/恢复进度，不冒称ready
    src/views/MarketPublisherPage.vue # relation/source/material资格与gap，no mockverified
    src/composables/useMarketQuery.ts # query加载/取消/失效隔离，不触发后端维护
    src/composables/useMarketCommand.ts # 保存同意图key/完整结果，timeout不换key盲重发
    tests/marketplace_protocol_tests.ts # DTOruntimevalidation与safeerror/unknown显示
    tests/marketplace_locale_tests.ts # 双语不改变状态/ref/key
    tests/marketplace_workflow_tests.ts # UI意图/禁用/empty/lateoutcome状态映射
```

- 一仓不等一部署：marketplace-api、marketplace-worker与apps/web可独立构建/交付；共享的是契约，不是UI写数据库。
- 七U模块在application内承接49用例；Domain按aggregate职责拆文件，不将五种展示分类当owner类型枚举。
- contracts是type-only叶子；domain只用其中纯value/state词汇，不能依赖DTO编排、Core/SDKruntime或infra。完整module依赖契约等授权Step5，不在本步补签名。
- fake仅dev/test显式组装，生产RuntimeBuilder不得静默fallback；所有SDK文件当前包含待资格slot，不证明owner已支持。
- 不列CLI/jobs/ops/outbox/billing/archive/报告脚本。SQLmigration待Step11完整schema后明确具体文件并回修本步；05/07确认gate/report脚本后再追加，不创建空placeholder。

### 文件职责表

以下逐路径为planned职责清单。定义内容是文件owner分配，不是已完成struct/trait/DTOschema；完整module契约须授权Step5后校准，不允许实现者仅凭此表造类型。

| 文件路径 | 所属模块 | 定义内容 | 主要责任 |
|---|---|---|---|
| `Cargo.toml` | root | virtualworkspace members与workspace.dependencies | 统一六member/root相对路径，无owner直接Cargo |
| `Cargo.lock` | root | 未来resolved依赖锁 | 只有授权依赖解析后生成，当前无文件/版本事实 |
| `rust-toolchain.toml` | root | Rust工具链兼容基线 | 实施前核验MSRV并锁定工具链 |
| `rustfmt.toml` | root | formatter配置 | Rust规范P.FMT.01 |
| `crates/contracts/Cargo.toml` | contracts | marketplace-contracts package与限定依赖 | member workspace=true，不照抄root相对path |
| `crates/domain/Cargo.toml` | domain | marketplace-domain package与限定依赖 | member workspace=true，不照抄root相对path |
| `crates/application/Cargo.toml` | application | marketplace-application package与限定依赖 | member workspace=true，不照抄root相对path |
| `crates/infra/Cargo.toml` | infra | marketplace-infra package与限定依赖 | member workspace=true，不照抄root相对path |
| `crates/api/Cargo.toml` | api | marketplace-api package与限定依赖 | member workspace=true，不照抄root相对path |
| `crates/worker/Cargo.toml` | worker | marketplace-worker package与限定依赖 | member workspace=true，不照抄root相对path |
| `crates/contracts/src/lib.rs` | contracts | 导出type-only协议模块，不组装runtime | type-only协议；唯一来源，no domain/SDK/SQLruntime |
| `crates/contracts/src/value_objects.rs` | contracts | 本地typed ID/ref/revision/cursor等纯词汇；不可冒称owner导出 | type-only协议；唯一来源，no domain/SDK/SQLruntime |
| `crates/contracts/src/states.rs` | contracts | 本地carrier state词汇单一来源；无迁移或外部approval定义 | type-only协议；唯一来源，no domain/SDK/SQLruntime |
| `crates/contracts/src/context.rs` | contracts | 引用Core actor/metadata的入口与worker wrapper形状，不重复key/trace | type-only协议；唯一来源，no domain/SDK/SQLruntime |
| `crates/contracts/src/worker_protocol.rs` | contracts | 12内部Job请求/完整逐itemreport/有限结果与错误 | type-only协议；唯一来源，no domain/SDK/SQLruntime |
| `crates/contracts/src/errors.rs` | contracts | 安全public error/disposition词汇，不回传raw SDK/DB错误 | type-only协议；唯一来源，no domain/SDK/SQLruntime |
| `crates/contracts/src/source_responsibility.rs` | contracts | U1 Command/Query/Result/View协议；不持有领域对象或owner正文 | type-only协议；唯一来源，no domain/SDK/SQLruntime |
| `crates/contracts/src/publication_review.rs` | contracts | U2 Command/Query/Result/View协议；不持有领域对象或owner正文 | type-only协议；唯一来源，no domain/SDK/SQLruntime |
| `crates/contracts/src/catalog_version.rs` | contracts | U3 Command/Query/Result/View协议；不持有领域对象或owner正文 | type-only协议；唯一来源，no domain/SDK/SQLruntime |
| `crates/contracts/src/distribution.rs` | contracts | U4 Command/Query/Result/View协议；不持有领域对象或owner正文 | type-only协议；唯一来源，no domain/SDK/SQLruntime |
| `crates/contracts/src/withdrawal_notice.rs` | contracts | U5 Command/Query/Result/View协议；不持有领域对象或owner正文 | type-only协议；唯一来源，no domain/SDK/SQLruntime |
| `crates/contracts/src/audit_recovery.rs` | contracts | U6 Command/Query/Result/View协议；不持有领域对象或owner正文 | type-only协议；唯一来源，no domain/SDK/SQLruntime |
| `crates/contracts/src/reference_read.rs` | contracts | U7 Command/Query/Result/View协议；不持有领域对象或owner正文 | type-only协议；唯一来源，no domain/SDK/SQLruntime |
| `crates/domain/src/lib.rs` | domain | 导出同步领域aggregate/record/policy | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/source_binding.rs` | domain | re-export contracts SourceBinding/MaterialReference；SourceVerification与来源guard | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/publisher_relation.rs` | domain | PublisherRelation/SourceGatePolicy；release当前资格失效 | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/publication_basis.rs` | domain | immutable PublicationBasis与固定basis不变量 | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/publication_application.rs` | domain | PublicationApplication draftspec/factory/提交固定basis | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/review_handoff.rs` | domain | ReviewHandoff/GovernanceDecisionBinding/ReviewBindingPolicy，不产生approval | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/marketplace_listing.rs` | domain | MarketplaceListing局部metadata，不复制资产正文 | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/market_version.rs` | domain | MarketVersion/VersionAdmissionPolicy与Staged/Listed/Restricted/Withdrawn | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/category.rs` | domain | Category与目录分类不变量，不作owner资产kind | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/distribution_intent.rs` | domain | DistributionIntent/AcquisitionGatePolicy；本地受理/取消 | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/distribution_attempt.rs` | domain | DistributionAttempt/ReceiverOutcomeBinding；attempt效果独立于取消 | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/distribution_relation.rs` | domain | DistributionRelation市场分发关系，不等installed | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/withdrawal_impact.rs` | domain | WithdrawalDisposition/ImpactRecord/WithdrawalImpactPolicy与knownscope | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/notice_intent.rs` | domain | NoticeIntent/NoticeOutcomeBinding；Confirmed不等read/delivered | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/operation_record.rs` | domain | OperationContext/OperationRecord；StoredOperationResult re-export contracts immutable result | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/market_audit_record.rs` | domain | append-only MarketAuditRecord，不等Obsreceipt | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/deferred_work.rs` | domain | DeferredWork状态/claim/fence规则，不含schedulerI/O | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/recovery_intent.rs` | domain | RecoveryIntent/ObservationOutcomeBinding/RecoveryPolicy | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/qualified_reference_snapshot.rs` | domain | TypedOwnerReference/QualifiedReferenceSnapshot本体+state/ReadBoundaryPolicy | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/domain/src/read_projection.rs` | domain | ReadProjection/QualifiedReadContext，派生身份/typed rebuild规则 | 纯同步构造/guard/transition/rehydrate，无I/O或config |
| `crates/application/src/lib.rs` | application | 导出三Entry、七Service编排与port，不调用具体SDK/SQL | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/entries.rs` | application | MarketCommandEntry/MarketQueryEntry/MarketWorkerEntry typed dispatch | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/operation_context.rs` | application | Core上下文到本地OperationContext转换与唯一authority核验 | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/command_runner.rs` | application | command共同受理/原结果/同UoW写集调用顺序 | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/job_runner.rs` | application | 内部Job claim/fence/逐itemreport/原结果编排 | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/read_facade.rs` | application | Query currentvisibility/disclosure与no-write | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/intent_fingerprint.rs` | application | 版本化canonical intent；不重算OwnerAssetDigest | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/mod.rs` | application | 导出内侧ownedtraits | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/market_store.rs` | application | MarketStorePort typed mutable/immutable save/get/bykey | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/operation_store.rs` | application | OperationStorePort reserve/fullresult/load/conflict | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/audit_store.rs` | application | AuditStorePort append/typed safe read | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/work_store.rs` | application | WorkStorePort claim/fence/permission/durable responsibility | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/snapshot_store.rs` | application | SnapshotStorePort typed material+state save/get | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/projection_store.rs` | application | ProjectionStorePort identity/cursor/shadow/typed views | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/source_owner.rs` | application | SourceOwnerPort正式immutable source required能力 | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/publisher_authority.rs` | application | PublisherAuthorityPort主体/关系资格required能力 | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/material_authority.rs` | application | MaterialAuthorityPort签名/扫描引用适用与有效性 | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/governance.rs` | application | GovernancePort正式decision/fullbinding/probe required能力 | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/scope_resolver.rs` | application | ScopeResolverPort trustedref→scope/disclosure | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/receiver.rs` | application | ReceiverPort原intent/outcome/probe required能力 | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/notice_channel.rs` | application | NoticeChannelPort正式target/channel/outcome/probe | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/observation.rs` | application | ObservationPort producer资格/receipt/probe | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/ports/unit_of_work.rs` | application | MarketUow/transactionrunner typedcommit/failure责任 | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/errors.rs` | application | application有限错误与安全拒绝/unknown/blocked映射 | 内侧ownedcallable，完整签名等获授权Step5～7校准 |
| `crates/application/src/source_responsibility/mod.rs` | U1/application | 来源/发布责任Service façade/export | 汇集本U用例，与其他U交互仍走内侧typed契约 |
| `crates/application/src/source_responsibility/bind_publisher_relation.rs` | U1/Command | bind_publisher_relation usecase | 校验/当前scope/原结果/qualifiedinput/UoW编排；不造approval |
| `crates/application/src/source_responsibility/release_publisher_relation.rs` | U1/Command | release_publisher_relation usecase | 校验/当前scope/原结果/qualifiedinput/UoW编排；不造approval |
| `crates/application/src/source_responsibility/verify_publication_source.rs` | U1/Command | verify_publication_source usecase | 校验/当前scope/原结果/qualifiedinput/UoW编排；不造approval |
| `crates/application/src/source_responsibility/get_source_qualification.rs` | U1/Query | get_source_qualification usecase | no-write/currentdisclosure，隐藏/缺失安全映射 |
| `crates/application/src/publication_review/mod.rs` | U2/application | 申请/正式审核交接Service façade/export | 汇集本U用例，与其他U交互仍走内侧typed契约 |
| `crates/application/src/publication_review/create_publication_draft.rs` | U2/Command | create_publication_draft usecase | 校验/当前scope/原结果/qualifiedinput/UoW编排；不造approval |
| `crates/application/src/publication_review/revise_publication_draft.rs` | U2/Command | revise_publication_draft usecase | 校验/当前scope/原结果/qualifiedinput/UoW编排；不造approval |
| `crates/application/src/publication_review/submit_publication_application.rs` | U2/Command | submit_publication_application usecase | 校验/当前scope/原结果/qualifiedinput/UoW编排；不造approval |
| `crates/application/src/publication_review/terminate_publication_application.rs` | U2/Command | terminate_publication_application usecase | 校验/当前scope/原结果/qualifiedinput/UoW编排；不造approval |
| `crates/application/src/publication_review/record_governance_decision.rs` | U2/Command | record_governance_decision usecase | 校验/当前scope/原结果/qualifiedinput/UoW编排；不造approval |
| `crates/application/src/publication_review/get_publication_progress.rs` | U2/Query | get_publication_progress usecase | no-write/currentdisclosure，隐藏/缺失安全映射 |
| `crates/application/src/publication_review/dispatch_review_handoff.rs` | U2/Job | dispatch_review_handoff internalusecase | 正式typedrequest/完整report/原结果/claim-fence，unknown不盲发 |
| `crates/application/src/publication_review/reconcile_review_handoff.rs` | U2/Job | reconcile_review_handoff internalusecase | 正式typedrequest/完整report/原结果/claim-fence，unknown不盲发 |
| `crates/application/src/catalog_version/mod.rs` | U3/application | 目录/市场版本Service façade/export | 汇集本U用例，与其他U交互仍走内侧typed契约 |
| `crates/application/src/catalog_version/create_marketplace_listing.rs` | U3/Command | create_marketplace_listing usecase | 校验/当前scope/原结果/qualifiedinput/UoW编排；不造approval |
| `crates/application/src/catalog_version/edit_marketplace_listing.rs` | U3/Command | edit_marketplace_listing usecase | 校验/当前scope/原结果/qualifiedinput/UoW编排；不造approval |
| `crates/application/src/catalog_version/maintain_market_category.rs` | U3/Command | maintain_market_category usecase | 校验/当前scope/原结果/qualifiedinput/UoW编排；不造approval |
| `crates/application/src/catalog_version/register_market_version.rs` | U3/Command | register_market_version usecase | 校验/当前scope/原结果/qualifiedinput/UoW编排；不造approval |
| `crates/application/src/catalog_version/list_market_version.rs` | U3/Command | list_market_version usecase | 校验/当前scope/原结果/qualifiedinput/UoW编排；不造approval |
| `crates/application/src/catalog_version/search_marketplace_catalog.rs` | U3/Query | search_marketplace_catalog usecase | no-write/currentdisclosure，隐藏/缺失安全映射 |
| `crates/application/src/catalog_version/get_marketplace_listing.rs` | U3/Query | get_marketplace_listing usecase | no-write/currentdisclosure，隐藏/缺失安全映射 |
| `crates/application/src/catalog_version/list_market_versions.rs` | U3/Query | list_market_versions usecase | no-write/currentdisclosure，隐藏/缺失安全映射 |
| `crates/application/src/catalog_version/select_market_version.rs` | U3/Query | select_market_version usecase | no-write/currentdisclosure，隐藏/缺失安全映射 |
| `crates/application/src/catalog_version/list_market_categories.rs` | U3/Query | list_market_categories usecase | no-write/currentdisclosure，隐藏/缺失安全映射 |
| `crates/application/src/distribution/mod.rs` | U4/application | 受控分发Service façade/export | 汇集本U用例，与其他U交互仍走内侧typed契约 |
| `crates/application/src/distribution/request_distribution.rs` | U4/Command | request_distribution usecase | 校验/当前scope/原结果/qualifiedinput/UoW编排；不造approval |
| `crates/application/src/distribution/cancel_distribution.rs` | U4/Command | cancel_distribution usecase | 校验/当前scope/原结果/qualifiedinput/UoW编排；不造approval |
| `crates/application/src/distribution/record_receiver_outcome.rs` | U4/Command | record_receiver_outcome usecase | 校验/当前scope/原结果/qualifiedinput/UoW编排；不造approval |
| `crates/application/src/distribution/get_acquisition_eligibility.rs` | U4/Query | get_acquisition_eligibility usecase | no-write/currentdisclosure，隐藏/缺失安全映射 |
| `crates/application/src/distribution/get_distribution_progress.rs` | U4/Query | get_distribution_progress usecase | no-write/currentdisclosure，隐藏/缺失安全映射 |
| `crates/application/src/distribution/dispatch_distribution.rs` | U4/Job | dispatch_distribution internalusecase | 正式typedrequest/完整report/原结果/claim-fence，unknown不盲发 |
| `crates/application/src/distribution/reconcile_distribution.rs` | U4/Job | reconcile_distribution internalusecase | 正式typedrequest/完整report/原结果/claim-fence，unknown不盲发 |
| `crates/application/src/withdrawal_notice/mod.rs` | U5/application | 撤回/影响/通知Service façade/export | 汇集本U用例，与其他U交互仍走内侧typed契约 |
| `crates/application/src/withdrawal_notice/restrict_market_version.rs` | U5/Command | restrict_market_version usecase | 校验/当前scope/原结果/qualifiedinput/UoW编排；不造approval |
| `crates/application/src/withdrawal_notice/withdraw_market_version.rs` | U5/Command | withdraw_market_version usecase | 校验/当前scope/原结果/qualifiedinput/UoW编排；不造approval |
| `crates/application/src/withdrawal_notice/plan_impact_notifications.rs` | U5/Command | plan_impact_notifications usecase | 校验/当前scope/原结果/qualifiedinput/UoW编排；不造approval |
| `crates/application/src/withdrawal_notice/record_notice_outcome.rs` | U5/Command | record_notice_outcome usecase | 校验/当前scope/原结果/qualifiedinput/UoW编排；不造approval |
| `crates/application/src/withdrawal_notice/get_withdrawal_impact.rs` | U5/Query | get_withdrawal_impact usecase | no-write/currentdisclosure，隐藏/缺失安全映射 |
| `crates/application/src/withdrawal_notice/get_notice_progress.rs` | U5/Query | get_notice_progress usecase | no-write/currentdisclosure，隐藏/缺失安全映射 |
| `crates/application/src/withdrawal_notice/enumerate_known_impact.rs` | U5/Job | enumerate_known_impact internalusecase | 正式typedrequest/完整report/原结果/claim-fence，unknown不盲发 |
| `crates/application/src/withdrawal_notice/dispatch_notice.rs` | U5/Job | dispatch_notice internalusecase | 正式typedrequest/完整report/原结果/claim-fence，unknown不盲发 |
| `crates/application/src/withdrawal_notice/reconcile_notice.rs` | U5/Job | reconcile_notice internalusecase | 正式typedrequest/完整report/原结果/claim-fence，unknown不盲发 |
| `crates/application/src/audit_recovery/mod.rs` | U6/application | 审计/恢复Service façade/export | 汇集本U用例，与其他U交互仍走内侧typed契约 |
| `crates/application/src/audit_recovery/request_market_recovery.rs` | U6/Command | request_market_recovery usecase | 校验/当前scope/原结果/qualifiedinput/UoW编排；不造approval |
| `crates/application/src/audit_recovery/get_market_audit.rs` | U6/Query | get_market_audit usecase | no-write/currentdisclosure，隐藏/缺失安全映射 |
| `crates/application/src/audit_recovery/get_recovery_progress.rs` | U6/Query | get_recovery_progress usecase | no-write/currentdisclosure，隐藏/缺失安全映射 |
| `crates/application/src/audit_recovery/get_operation_result.rs` | U6/Query | get_operation_result usecase | no-write/currentdisclosure，隐藏/缺失安全映射 |
| `crates/application/src/audit_recovery/run_market_recovery.rs` | U6/Job | run_market_recovery internalusecase | 正式typedrequest/完整report/原结果/claim-fence，unknown不盲发 |
| `crates/application/src/audit_recovery/dispatch_observation.rs` | U6/Job | dispatch_observation internalusecase | 正式typedrequest/完整report/原结果/claim-fence，unknown不盲发 |
| `crates/application/src/audit_recovery/reconcile_observation.rs` | U6/Job | reconcile_observation internalusecase | 正式typedrequest/完整report/原结果/claim-fence，unknown不盲发 |
| `crates/application/src/reference_read/mod.rs` | U7/application | 引用/snapshot/索引Service façade/export | 汇集本U用例，与其他U交互仍走内侧typed契约 |
| `crates/application/src/reference_read/get_reference_freshness.rs` | U7/Query | get_reference_freshness usecase | no-write/currentdisclosure，隐藏/缺失安全映射 |
| `crates/application/src/reference_read/get_projection_freshness.rs` | U7/Query | get_projection_freshness usecase | no-write/currentdisclosure，隐藏/缺失安全映射 |
| `crates/application/src/reference_read/refresh_qualified_references.rs` | U7/Job | refresh_qualified_references internalusecase | 正式typedrequest/完整report/原结果/claim-fence，unknown不盲发 |
| `crates/application/src/reference_read/rebuild_market_read_projection.rs` | U7/Job | rebuild_market_read_projection internalusecase | 正式typedrequest/完整report/原结果/claim-fence，unknown不盲发 |
| `crates/infra/src/lib.rs` | infra | 导出显式外层组装，不把fakes作为default | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/runtime_config.rs` | infra | RuntimeConfig/validator形状；exactkey/profile由04 | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/runtime_builder.rs` | infra | API/Worker dependencywiring，缺合同failclosed | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/telemetry.rs` | infra | 脱敏runtime日志/metric/trace，不替业务audit | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/postgres/mod.rs` | infra | PostgresMarketAdapter与连接/transaction映射 | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/postgres/unit_of_work.rs` | infra | SQLx单localtransaction与commit错误映射 | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/postgres/market_store.rs` | infra | 领域对象typed save/get/bykey/CAS映射 | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/postgres/operation_store.rs` | infra | operation唯一性/fullresult typedcodec与读取 | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/postgres/audit_store.rs` | infra | safeaudit append/read映射 | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/postgres/work_store.rs` | infra | 耐久work/claim/fence/permissiontyped保存 | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/postgres/snapshot_store.rs` | infra | qualifiedsnapshot typed本体+state保存/读取 | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/postgres/projection_store.rs` | infra | scopeboundtypedview/shadow/cursor替换 | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/postgres/catalog_search.rs` | infra | 参数化过滤/search/分页索引访问，无owner正文 | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/postgres/row_codec.rs` | infra | DB row到typed载体/rehydrate校验，不万能JSONload | localtruth/事务/typedmapping，禁止复制owner正文 |
| `crates/infra/src/sdk/mod.rs` | infra | SdkOwnerAdapters总导出，不公开owner直连 | 仅SDKformalbinding/blocked，禁止privateownerfallback |
| `crates/infra/src/sdk/source_owner_adapter.rs` | infra | SourceOwnerPort→正式SDKoperation逐类型qualification | 仅SDKformalbinding/blocked，禁止privateownerfallback |
| `crates/infra/src/sdk/publisher_authority_adapter.rs` | infra | publisherauthorityslot，owner未明返回blocked | 仅SDKformalbinding/blocked，禁止privateownerfallback |
| `crates/infra/src/sdk/material_authority_adapter.rs` | infra | 材料requiredport→正式SDK支持/blocked | 仅SDKformalbinding/blocked，禁止privateownerfallback |
| `crates/infra/src/sdk/governance_adapter.rs` | infra | approved完整binding与原意图probe；无自裁 | 仅SDKformalbinding/blocked，禁止privateownerfallback |
| `crates/infra/src/sdk/scope_resolver_adapter.rs` | infra | 正式scope/disclosure requiredslot，no localauthfallback | 仅SDKformalbinding/blocked，禁止privateownerfallback |
| `crates/infra/src/sdk/receiver_adapter.rs` | infra | exactversion/intent/effect/probe，缺支持不发 | 仅SDKformalbinding/blocked，禁止privateownerfallback |
| `crates/infra/src/sdk/notice_channel_adapter.rs` | infra | target/channel/outcome/probe，缺支持不造送达 | 仅SDKformalbinding/blocked，禁止privateownerfallback |
| `crates/infra/src/sdk/observation_adapter.rs` | infra | producer/receipt资格与safeaudit交接 | 仅SDKformalbinding/blocked，禁止privateownerfallback |
| `crates/infra/src/fake/mod.rs` | infra | dev/test显式fixture组装，生产不得导出fallback | dev/testonly，语义不得强于真实port |
| `crates/infra/src/fake/local_store.rs` | infra | 所有localport同UoW失败/重放/CAS语义的inmemory实现 | dev/testonly，语义不得强于真实port |
| `crates/infra/src/fake/owner_ports.rs` | infra | typed formalfixture/gap/unknown/lateoutcome场景；非真实owner | dev/testonly，语义不得强于真实port |
| `crates/api/src/main.rs` | api | marketplace-api进程启动与关闭，读取配置/组装 | entry mapping/currentcontext，不执行domainguard或任意Job |
| `crates/api/src/routes.rs` | api | 获准publicCommand/Queryroute注册，不公开12Job | entry mapping/currentcontext，不执行domainguard或任意Job |
| `crates/api/src/trusted_context.rs` | api | trusted入口上下文校验/构造，caller不能自填qualified | entry mapping/currentcontext，不执行domainguard或任意Job |
| `crates/api/src/response_mapping.rs` | api | typedresult/error→safe HTTPdisposition，结果种类不混 | entry mapping/currentcontext，不执行domainguard或任意Job |
| `crates/api/src/handlers/source_responsibility.rs` | api | U1入口DTOdecode/currentcontext/dispatch，no domaintruth | entry mapping/currentcontext，不执行domainguard或任意Job |
| `crates/api/src/handlers/publication_review.rs` | api | U2入口DTOdecode/currentcontext/dispatch，no domaintruth | entry mapping/currentcontext，不执行domainguard或任意Job |
| `crates/api/src/handlers/catalog_version.rs` | api | U3入口DTOdecode/currentcontext/dispatch，no domaintruth | entry mapping/currentcontext，不执行domainguard或任意Job |
| `crates/api/src/handlers/distribution.rs` | api | U4入口DTOdecode/currentcontext/dispatch，no domaintruth | entry mapping/currentcontext，不执行domainguard或任意Job |
| `crates/api/src/handlers/withdrawal_notice.rs` | api | U5入口DTOdecode/currentcontext/dispatch，no domaintruth | entry mapping/currentcontext，不执行domainguard或任意Job |
| `crates/api/src/handlers/audit_recovery.rs` | api | U6入口DTOdecode/currentcontext/dispatch，no domaintruth | entry mapping/currentcontext，不执行domainguard或任意Job |
| `crates/api/src/handlers/reference_read.rs` | api | U7入口DTOdecode/currentcontext/dispatch，no domaintruth | entry mapping/currentcontext，不执行domainguard或任意Job |
| `crates/api/src/handlers/mod.rs` | api | 导出获准handlers | entry mapping/currentcontext，不执行domainguard或任意Job |
| `crates/worker/src/main.rs` | worker | marketplace-worker常驻进程，配置/组装/关停 | bounded常驻任务，不以leaseexpiry/关停判未提交 |
| `crates/worker/src/scheduler.rs` | worker | 有界claim/并发/lease/fence调度，不直接改domain | bounded常驻任务，不以leaseexpiry/关停判未提交 |
| `crates/worker/src/job_dispatch.rs` | worker | 12内部jobrequest到MarketWorkerEntry，report处理 | bounded常驻任务，不以leaseexpiry/关停判未提交 |
| `crates/worker/src/shutdown.rs` | worker | inflight许可/取消/unknown责任保留，不将关停当未发 | bounded常驻任务，不以leaseexpiry/关停判未提交 |
| `apps/web/package.json` | web | marketplace-web依赖/构建与测试入口planned | 展示/意图/typed协议，不是ownertruth |
| `apps/web/tsconfig.json` | web | strictTS配置，无tsignore兜底 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/vite.config.ts` | web | SPA构建/devprofile，不继承9090生产默认 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/index.html` | web | Vue真实应用挂载页，不是本轮HTMLdemo | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/main.ts` | web | App/router/i18n初始化 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/App.vue` | web | 应用shell与导航，无truthstore | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/router.ts` | web | 目录/详情/申请/分发/撤回/审计/publisher/设置视图 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/api/marketplace_client.ts` | web | typedMarketplaceAPI访问与错误/unknown处理，不直连owners | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/api/protocol.ts` | web | 正式Step8协议的TS映射，无手造第二schema | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/api/response_validation.ts` | web | runtimefinitevariant/optional验证，缺少形状安全失败 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/i18n/index.ts` | web | defaulten/zh切换，仅展示locale | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/i18n/en.json` | web | 英文展示资源 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/i18n/zh.json` | web | 中文展示资源 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/components/MarketStatusBadge.vue` | web | 有限carrier与freshness/disposition分别呈现 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/components/OwnerReferenceSummary.vue` | web | safeimmutable ref/version/digest/visibility，no body | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/components/LanguageSwitch.vue` | web | EN/ZH切换不改业务意图 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/components/MarketAsyncState.vue` | web | loading/empty/rejected/unknown/stale/degraded统一呈现 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/views/MarketCatalogPage.vue` | web | 分类/filter/search/count在同scope下展示 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/views/MarketListingPage.vue` | web | listing/versions/selection/eligibility展示与获取意图 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/views/MarketPublicationPage.vue` | web | safe draft/提交/正式review进度，不显示本地审批按钮 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/views/MarketDistributionPage.vue` | web | intent/attempt/outcome分轴、取消不假卸载 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/views/MarketWithdrawalPage.vue` | web | restriction/withdraw/knownimpact/notice分轴 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/views/MarketAuditRecoveryPage.vue` | web | safeaudit/完整原结果/恢复进度，不冒称ready | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/views/MarketPublisherPage.vue` | web | relation/source/material资格与gap，no mockverified | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/composables/useMarketQuery.ts` | web | query加载/取消/失效隔离，不触发后端维护 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/src/composables/useMarketCommand.ts` | web | 保存同意图key/完整结果，timeout不换key盲重发 | 展示/意图/typed协议，不是ownertruth |
| `apps/web/tests/marketplace_protocol_tests.ts` | web | DTOruntimevalidation与safeerror/unknown显示 | 仅计划测试，不代表run/evidence |
| `apps/web/tests/marketplace_locale_tests.ts` | web | 双语不改变状态/ref/key | 仅计划测试，不代表run/evidence |
| `apps/web/tests/marketplace_workflow_tests.ts` | web | UI意图/禁用/empty/lateoutcome状态映射 | 仅计划测试，不代表run/evidence |
| `crates/contracts/tests/protocol_roundtrip_tests.rs` | contracts/tests | C/Q/J/result/view有限codec与metadata | 完整传递类型后校准case |
| `crates/domain/tests/source_responsibility_tests.rs` | U1/domain/tests | pureguards/合法非法状态/optionalcondition | domain测试切口，no ownerqualification证据 |
| `crates/domain/tests/publication_review_tests.rs` | U2/domain/tests | pureguards/合法非法状态/optionalcondition | domain测试切口，no ownerqualification证据 |
| `crates/domain/tests/catalog_version_tests.rs` | U3/domain/tests | pureguards/合法非法状态/optionalcondition | domain测试切口，no ownerqualification证据 |
| `crates/domain/tests/distribution_tests.rs` | U4/domain/tests | pureguards/合法非法状态/optionalcondition | domain测试切口，no ownerqualification证据 |
| `crates/domain/tests/withdrawal_notice_tests.rs` | U5/domain/tests | pureguards/合法非法状态/optionalcondition | domain测试切口，no ownerqualification证据 |
| `crates/domain/tests/audit_recovery_tests.rs` | U6/domain/tests | pureguards/合法非法状态/optionalcondition | domain测试切口，no ownerqualification证据 |
| `crates/domain/tests/reference_read_tests.rs` | U7/domain/tests | pureguards/合法非法状态/optionalcondition | domain测试切口，no ownerqualification证据 |
| `crates/application/tests/source_responsibility_flow_tests.rs` | U1/application/tests | typedports/UoW/重放/失败分支 | 使用相同trait与完整原结果，no privatefakeAPI |
| `crates/application/tests/publication_review_flow_tests.rs` | U2/application/tests | typedports/UoW/重放/失败分支 | 使用相同trait与完整原结果，no privatefakeAPI |
| `crates/application/tests/catalog_version_flow_tests.rs` | U3/application/tests | typedports/UoW/重放/失败分支 | 使用相同trait与完整原结果，no privatefakeAPI |
| `crates/application/tests/distribution_flow_tests.rs` | U4/application/tests | typedports/UoW/重放/失败分支 | 使用相同trait与完整原结果，no privatefakeAPI |
| `crates/application/tests/withdrawal_notice_flow_tests.rs` | U5/application/tests | typedports/UoW/重放/失败分支 | 使用相同trait与完整原结果，no privatefakeAPI |
| `crates/application/tests/audit_recovery_flow_tests.rs` | U6/application/tests | typedports/UoW/重放/失败分支 | 使用相同trait与完整原结果，no privatefakeAPI |
| `crates/application/tests/reference_read_flow_tests.rs` | U7/application/tests | typedports/UoW/重放/失败分支 | 使用相同trait与完整原结果，no privatefakeAPI |
| `crates/infra/tests/postgres_atomicity_tests.rs` | infra/tests | PGaccepted/audit/fullresult/work事务 | 未来真实PG测试，不造当前run |
| `crates/infra/tests/sdk_qualification_tests.rs` | infra/tests | supported/gap/unknown安全映射 | fake或formalintegration必须标资格上限 |
| `crates/infra/tests/withdrawal_race_tests.rs` | infra/tests | versionwithdraw/admission/dispatchpermission竞争 | 本地序列化不等外部瞬时撤回 |
| `crates/infra/tests/projection_rebuild_tests.rs` | infra/tests | typed snapshot本体+state/nonemptyplan/cursor/shadow | 不能用旧索引重造truth |
| `crates/api/tests/entry_mapping_tests.rs` | api/tests | trustedcontext/publicdisposition/nojobroute | 不以HTTP200当approval |
| `crates/worker/tests/worker_recovery_tests.rs` | worker/tests | claim/fence/probe/crash/lateoutcome | unknownprobe与新attempt责任 |

### 文件范围与后续回修规则

| 文件类别 | 当前处置 | 添加条件 |
|---|---|---|
| 上述源码/manifest/test路径 | 完整03范围planned，当前不创建 | 完整03/04～07及实施授权后按boundary进入 |
| Cargo.lock | 只规划生成位置，不给虚构resolvedversions | 授权dependency resolution，MSRV/安全/兼容核验 |
| SQLmigration | 未给具体文件名，不列空占位 | Step11完整typed schema/keys/constraints确定后回修Step4 |
| APIroute/transport配置 | 当前文件责任明确但无虚构endpoint/port | Step8/9确定protocol/flow，04给实际profile |
| CI/gate/report/evidence scripts | 未作为当前交付物规划，不列空目录 | 05/07明确正式命令/schema/证据来源后具体路径回修 |
| CLI/outbox/Billing/Archive | future/blocked，不创建文件 | 正式owner合同与上位范围受控重开 |

### 命名检查表

| 检查项 | 通过条件 | 结果 |
|---|---|---|
| target实现仓 | quantalithos-marketplace、slugmarketplace | 计划命名pass；实际仓不存在 |
| member目录 | crates/<role>，短职责无重复前缀 | 六rolepass |
| Cargo package | marketplace-<role> | 六packagepass；rootvirtual |
| Rust library | marketplace_<role> | 四librarypass |
| binary | marketplace-api/marketplace-worker具体入口 | pass |
| 七U部署映射 | 语义模块，不七microservice/七owner | pass |
| filename/module | Rustsnake_case.rs、Vue多词PascalCase | planned清单pass |
| 层级泄漏 | 无L0/L1/l0_/l1_代码前缀 | pass；designsource路径不受此禁令 |
| source依赖隔离 | domain无infra/HTTP/SQL/SDK直接依赖 | planned边界pass，非编译验证 |
| fake | dev/test显式启用，生产不fallback | planned责任pass |
| 文件状态 | 所有自身路径planned、checked外部路径分离 | pass |
| future占位 | 无未知脚本/outbox/CLI/billing/归档lane | pass |

### 真实sibling compile路径与manifest落点

| 依赖仓库 | 全局依赖类型 | Cargo.toml位置 | path dependency写法 | 说明 |
|---|---|---|---|---|
| quantalithos-core | compile | plannedrootCargo.toml的workspace.dependencies | core-contracts = { path = "../quantalithos-core/crates/contracts" } | 只读确认真实packagecore-contracts/libcore_contracts |
| quantalithos-sdk | compile | plannedrootCargo.toml的workspace.dependencies | sdk-client = { path = "../quantalithos-sdk/crates/client" } | 只读确认package/sdk_client，infra接入 |
| quantalithos-sdk | compile | plannedrootCargo.toml的workspace.dependencies | sdk-contracts = { path = "../quantalithos-sdk/crates/contracts" } | 只有infra需要显式protocol请求型时引入；不能扩大ownercompile |

根路径基于未来/home/aris/Projects/quantalithos-marketplace，不是本design项目目录或member目录。设计写法：

```toml
# Planned workspace root, not an existing implementation manifest.
[workspace.dependencies]
core-contracts = { path = "../quantalithos-core/crates/contracts" }
sdk-client = { path = "../quantalithos-sdk/crates/client" }
sdk-contracts = { path = "../quantalithos-sdk/crates/contracts" }
```

```toml
# Planned crates/contracts/Cargo.toml: shared actor/metadata only.
[dependencies]
core-contracts.workspace = true
```

```toml
# Planned crates/infra/Cargo.toml: SDK-facing adapters only.
[dependencies]
core-contracts.workspace = true
sdk-client.workspace = true
sdk-contracts.workspace = true
```

application/api/worker若直接使用Core导出context需要core-contracts.workspace=true；domain不直接声明Core/SDK，仅本地type-onlyvocabulary。其他本仓member采用root集中版本/本地member路径，完整允许依赖矩阵由获授权Step5校准，不在本步伪造manifest已经建好。privategit固定tag/rev切换等正式release；无公共crates.io前置。九owner、Bus、receiver/notice/authauthority均不出现在此compile表，不因sibling目录存在获得path权限。

### 复杂度与交叉核对

Step4按“单元映射/目录树”和“逐文件职责/命名/path”两批写入同一文件；不是对象schema重Step，不需对象附录。49usecase路径严格对应02的21C/16Q/12J，七module/facade按U分组；Domain文件覆盖对象职责但不把对象全集当目录表。树与职责表必须逐路径一致，下一阶段若有具体文件新增须回修本Step和flow，不能以planned目录伪造已创建。

### Step9回修：组合类型与技术记录的单authority

215 planned path不增加文件。contracts/value_objects.rs唯一声明SourceBinding、MaterialReference、PublicationBasis、GovernanceDecisionBinding、Receiver/Notice/ObservationOutcomeBinding、TypedOwnerReference完整immutable schema；contracts/audit_recovery.rs唯一声明StoredOperationResult完整immutable result。原domain对应文件re-export上述类型并实现mutablecarrier，immutable纯guard/factory在contracts内无I/O实现，不让contracts反向依赖domain。

application/ports/unit_of_work.rs承接ClockPort/IdGeneratorPort及统一Tx；operation_store.rs承接CoreContextRecord/JobCheckpoint typedappend/get；market_store.rs承接Versioned/ScanPage/ImpactScanItem。runner-support/DeferredPlan/JobCheckpoint由既有application facade和audit_recovery职责文件承接，具体path仍本步总表；ProjectionBuildItem/manifest是contracts安全读词汇，typedfacts构建是application，PG负责成对存取。完整callable权威见Step7 application_callables，不生成代码或新增crate。

## 8. 回填草稿

### 正式§4候选草稿（未装配）

目标实现仓计划位于/home/aris/Projects/quantalithos-marketplace，当前不存在。采用workspace多crate架构：contracts/domain/application/infra四library、marketplace-api与marketplace-worker两binary，以及独立构建部署的apps/web SPA；七U不是七微服务，仍属唯一Marketplace truth边界。目录/package/crate/binary映射、完整树、逐文件职责、命名与compile路径采用本Step§7，全部planned。Core/SDK真实member只在rootworkspace.dependencies声明，成员workspace引用；九owner只能在SDKadapter/requiredport表达，当前无canonicalevent/outbox、财务writer或Archive lane。新migration/gate脚本须在对应Step形成正式契约后回修布局，不由实现者自造。

## 9. 待确认事项

Step3全部owner/版本/qualification缺口继续；完整module/schema/SQL/HTTProute/测试脚本尚未校准，不以本Step文件职责表冒充可落码契约。若后续新增持久化/脚本必要文件须回修Step4/flow而非实现者自造。Step4结束须等待用户明确Step5授权。

## 10. 进入下一步条件

### 实际静态检查记录（仅文档，不是实现运行证据）

| 检查项 | 实际结果 / 上限 |
|---|---|
| 03 flow+四Step | 5文件存在；四Step固定十段顺序正确 |
| 本地链接 | 32引用目标存在；无外部consumerready推断 |
| Markdown表格/代码围栏 | 列数一致，围栏成对，无结构错误 |
| tree→filetable | 215planned文件逐路径对应，无漏项或重复 |
| application用例 | 49路径，逐U对应21Commands/16Queries/12Jobs；无新增入口 |
| shortrole/package/crate/binary/filename | 六member/四lib/两binary/Web映射完整，无层级泄漏 |
| Core/SDK compilepath | 来自已检索真实member；root与member相对路径不混 |
| futureStep与实现文件 | Step5～19未创建；tree仅Markdown，无代码目录/manifest创建 |
| 正式03保护 | 写入前后git hash-object相同，只用于确认本地文件未变；不是实现baseline/digest |
| scoped git diff --check | 无whitespace错误；未staged/commit，不归并其他dirty |

复杂度、两批结构化写入与候选§4均完成；本Step文档gate pass。当前状态：completed / paused_at_authorized_boundary。Step5～19 not_started / waiting_user_authorization，禁止继续读取为启动或写入模块实现契约；旧正式03未装配。

下一阅读仅在用户明确授权后：详细SOP Step5、书写规范5.5模块契约、闭环callable/schema/字段/metadata/UoW标准，本Step与前序诊断/取舍，以及九owner受影响formal03所指exact calibration/SDKconsumerexports。无需提交commit。MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01与Hub/Images/Obs受影响资格继续保留，不因215planned文件或文档检查pass解除。
