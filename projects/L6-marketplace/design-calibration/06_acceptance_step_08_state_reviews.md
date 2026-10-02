# Step 8 独立状态机验收项

所有GT为P0。每项：先筛选主语/风险/取舍→exactenum/正式trigger→condition/副作用与全pair→业务TC/EV→裁决→design-stop。全14项都必选TC-CROSS-012→EV-DOMAIN-027与TC-CROSS-013→EV-DOMAIN-028，不以业务代表替代222pair。

固定报告`reports/runs/<run_id>/evidence/<完整EV-ID>.md`/配对JSON→same-run suite/raw/index；完整规则Step5§7。以下状态全集与03§9.1一致，所有TC仍planned/not-run，不预填实际迁移结果。

## U1 来源责任状态

正式[矩阵](03_ddd_step_10_part_u1.md)/[flow](03_ddd_step_09_part_u1.md)。采用正式资格current与CAS，不把配置/fake资质当结果。

| GT/AC、carrier/enum | exactvariants/pairs | 风险取舍/通过条件 | 失败/裁决 | 业务TC→EV / 独立停审 |
|---|---|---|---|---|
| GT-MP-S01 / AC-MP-101/103；PublisherRelation / PublisherRelationState | Bound, Released；4 | 正式Bind初态/Releasecurrent失效同Tx；Released不重新Bound，只新受控关系 | self/replay越权/Released复活P0，伪qualificationVETO1 | TC-SOURCE-001/002→EV-DOMAIN-001/002；design-stop/pass |
| GT-MP-S02 / AC-MP-102/103；SourceVerification / SourceVerificationState | Pending, Qualified, Blocked, Invalidated；16 | exact材料/source资格；缺口Blocked/正式失效Invalidated，conditionref与snapshotpair | fakeQualified/缺body条件/失效仍放行P0或VETO1/2 | TC-SOURCE-003/004→EV-DOMAIN-003/004；design-stop/pass |

## U2 申请与review

正式[矩阵](03_ddd_step_10_part_u2.md)/[flow](03_ddd_step_09_part_u2.md)。采用freeze与正式决定/原probe，拒绝ACK批准。

| GT/AC、carrier/enum | exactvariants/pairs | 风险取舍/通过条件 | 失败/裁决 | 业务TC→EV / 独立停审 |
|---|---|---|---|---|
| GT-MP-S03 / AC-MP-201/203；PublicationApplication / PublicationApplicationState | Draft, Submitted, Terminated；9 | Draft basis/reviewNone；Submit同Tx冻结，Submitted不可修；Terminate保旧许可/late责任 | 冻结basis覆写/Terminated复活/None条件冒成功P0或VETO5 | TC-REVIEW-001/003/004/009→EV-DOMAIN-007/009/010/015；design-stop/pass |
| GT-MP-S04 / AC-MP-202/203；ReviewHandoff / ReviewHandoffState | PendingDispatch, WaitingDecision, MatchedDecision, CommitUnknown, ContractBlocked, Failed；36 | 原dispatch许可/actualoutcome/probe，MatchedDecision包括rejected；Failed须proof，Unknown保原责任 | ACK/scan/signature/失效binding批准VETO2；Unknown盲发/假报告VETO5/P0 | TC-REVIEW-005/006/007/008→EV-DOMAIN-011/012/013/014；design-stop/pass |

## U3 市场版本

正式[矩阵](03_ddd_step_10_part_u3.md)/[flow](03_ddd_step_09_part_u3.md)。listing/category没有独立lifecycle；只版本准入state。

| GT/AC、carrier/enum | exactvariants/pairs | 风险取舍/通过条件 | 失败/裁决 | 业务TC→EV / 独立停审 |
|---|---|---|---|---|
| GT-MP-S05 / AC-MP-201/203/501；MarketVersion / MarketVersionState | Staged, Listed, Restricted, Withdrawn；16 | Register Staged；List currentfullapproved；有据Restrict/Withdraw；Withdrawnterminal无refresh/recovery复活 | 失效/错binding上架VETO2；撤回新分发/复活VETO5 | TC-CATALOG-004/005/006→EV-PG-004/005/006；TC-WITHDRAWAL-002→EV-DOMAIN-018；design-stop/pass |

## U4 分发意图与attempt

正式[矩阵](03_ddd_step_10_part_u4.md)/[flow](03_ddd_step_09_part_u4.md)。采用intent/attempt分轴，取消不删除实际结果，Confirmed不installed。

| GT/AC、carrier/enum | exactvariants/pairs | 风险取舍/通过条件 | 失败/裁决 | 业务TC→EV / 独立停审 |
|---|---|---|---|---|
| GT-MP-S06 / AC-MP-401/403；DistributionIntent / DistributionIntentState | Accepted, Cancelled；4 | currentgate→Accepted局部责任；Cancel保attempt/relation/lateimpact，不remote rollback | Cancelled复活/历史删除/丢lateVETO5/P0 | TC-DISTRIBUTION-002/007→EV-WORKER-002/007；design-stop/pass |
| GT-MP-S07 / AC-MP-402/403；DistributionAttempt / DistributionAttemptState | Prepared, Dispatching, Confirmed, Failed, CommitUnknown, Blocked；36 | 原permission及A/B；Confirmed exactformal，Failed正式notcommit，Unknown/probe/no-probe分开 | negative/Unknown command attach、盲发/伪成功VETO4/5或P0 | TC-DISTRIBUTION-005/006/008/010→EV-WORKER-005/006/008/010；design-stop/pass |

## U5 影响与通知

正式[矩阵](03_ddd_step_10_part_u5.md)/[flow](03_ddd_step_09_part_u5.md)。采用knownscope与notice分轴，通知Failed重试规则不等分发旧attempt复活。

| GT/AC、carrier/enum | exactvariants/pairs | 风险取舍/通过条件 | 失败/裁决 | 业务TC→EV / 独立停审 |
|---|---|---|---|---|
| GT-MP-S08 / AC-MP-502/G03；ImpactRecord / ImpactCoverageKind | Partial, KnownScopeComplete；4 | fixedupper union全typedPK，完整才Complete；late更高cursor显式Partial+增量work | 截断/漏unknown/late责任或夸大全安装P0/伪结果VETO5 | TC-WITHDRAWAL-004/005→EV-DOMAIN-020/021；design-stop/pass |
| GT-MP-S09 / AC-MP-502/504；NoticeIntent / NoticeIntentState | Prepared, Dispatching, Confirmed, Failed, CommitUnknown, Blocked；36 | exactformaloutcome/probe/target/channel/scope；formalnotcommit+currentgate才能sameintent获新fence | Unknown盲重发/ACK当送达/NoticeAttempt影子/旧fence覆盖P0或VETO5 | TC-WITHDRAWAL-007/008/009→EV-DOMAIN-023/024/025；design-stop/pass |

## U6 原结果与责任恢复

正式[矩阵](03_ddd_step_10_part_u6.md)/[flow](03_ddd_step_09_part_u6.md)。采用originalfullreport/durablesuccessor，不用当前projection/日志补原成功。

| GT/AC、carrier/enum | exactvariants/pairs | 风险取舍/通过条件 | 失败/裁决 | 业务TC→EV / 独立停审 |
|---|---|---|---|---|
| GT-MP-S10 / AC-MP-G02/504；OperationRecord / OperationRecordState | Reserved, Completed；4 | key/intent/context/checkpoint同源，完整原result同frame后Completed；缺fullreport保持Reserved | 缺body强Completed/重建旧结果/Completed回Reserved P0或VETO5 | TC-RECOVERY-001/005→EV-RECOVERY-001/005；design-stop/pass |
| GT-MP-S11 / AC-MP-G02/G03/504；DeferredWork / DeferredWorkState | Pending, Claimed, Settled, Blocked；16 | claim CAS/原work-fence一致；expiredClaimedself仅新授权Reconcileprobe-only；Settled有完整report与无悬空/明确successor | lease过期新send/旧fence完成/无继任Settled P0或VETO5 | TC-CROSS-019→EV-WORKER-021；TC-RECOVERY-010→EV-RECOVERY-010；design-stop/pass |
| GT-MP-S12 / AC-MP-504；RecoveryIntent / RecoveryIntentState | Requested, Running, Completed, Blocked；16 | finiteauthority/target，remoteinspectionSomeformalprobe，localSnapshot/Projection/Impact无假proof；不递归 | ownertruth修复/无probe假Completed/任意SQL P0或VETO5 | TC-RECOVERY-003/004/006→EV-RECOVERY-003/004/006；design-stop/pass |

## U7 qualified snapshot与projection

正式[矩阵](03_ddd_step_10_part_u7.md)/[flow](03_ddd_step_09_part_u7.md)。采用完整safe_material/validity与typedplan，拒绝旧index修truth。

| GT/AC、carrier/enum | exactvariants/pairs | 风险取舍/通过条件 | 失败/裁决 | 业务TC→EV / 独立停审 |
|---|---|---|---|---|
| GT-MP-S13 / AC-MP-103/303；QualifiedReferenceSnapshot / ReferenceSnapshotState | Qualified, Stale, Unavailable；9 | formalrefresh完整合法material可Qualified；失败有合法oldmaterial才Stale，无合法/不可见Unavailable；SourceVerificationfinal不可同record重核 | state/body不配对、不可见泄漏、snapshot复活version P0或VETO1/3/5 | TC-REFERENCE-001/002/006→EV-PG-011/012/016；design-stop/pass |
| GT-MP-S14 / AC-MP-303/504；ReadProjection / ReadProjectionState | Fresh, Stale, Rebuilding, Unavailable；16 | 初态Stale；全非空requiredplan/manifest/body与kindhighwater同publish才Fresh；selfmaintenance不无故Stale | partialmanifest Fresh/旧body补truth/重建循环 P0或VETO3/5 | TC-REFERENCE-003/004/005/006→EV-PG-013/014/015/016；design-stop/pass |

## 跨状态审计

14carrier的状态集合/trigger/条件同03，pairs=4+16+9+36+16+4+36+4+36+4+16+16+9+16=222；完整A73/S51/R98仍必须按03每格身份展开。factory独立，不属于pairs。immutablebasis/binding/noticeoutcome/permission、ReadSurface/HTTP/adapter姿态不新增生命周期。

MatchedDecision含rejected，Listedcurrentapproved；Cancelled与Confirmed可共存；分发terminal旧attempt新attemptsameintent，notice按其矩阵sameintentformalnotcommit重试；KnownScopeComplete晚增量回Partial；SnapshotQualified不使SourceVerificationfinal重核；Fresh不自证scope；OperationCompleted与RecoveryCompleted不混readiness。没有Currentphase reservedstate或外部approval/install/paid/delivered状态。

每carrier参数化全部pair及guard/conditionref/非法错误与零acceptedmutation/audit/work/effect，真实合法Jobblocked/unknown可有原完整报告/责任；不能把负面输入预期拒绝当缺陷。全部十四项design-stop/pass，actualrun未发生。
