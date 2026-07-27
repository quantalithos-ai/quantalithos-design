# L3-capability-hub 07 实施计划 Step 5：实施阶段与依赖顺序

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 5
> 书写规范: `standards/document/实施计划书写规范.md` §3.2~§4.3
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 回填章节: `projects/L3-capability-hub/07-实施计划.md` §5
> 输入: Step 4 对象/交付物池、正式 `03/04/05/06`、Step 3 阅读矩阵
> 参考粒度: `projects/L1-governance` 和 `projects/L3-method-library` 对应 Step 5
> 创建日期: 2026-07-26
> 当前模式: full-restart / continuous execution

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 5 设计实施阶段与依赖顺序 |
| 当前状态 | completed_continuous_execution |
| 输入基线 | Step 4 已聚合的七 member、83 protocol/flow、配置、测试和证据交付面 |
| 直接编码 authority | 正式 `03-详细设计.md` §4~§16 及其 exact calibration source |
| gate/acceptance authority | 正式 `05-测试方案.md`、`06-验收标准.md` |
| phase 数量 | 11 个稳定 phase，`PH-01`~`PH-11` |
| target repository | `/home/aris/Projects/quantalithos-capability-hub` 未建立；PH-01 implementation prerequisite |
| unresolved upstream blocker | `0` |
| 下一动作 | 进入 Step 6，逐 phase 拆任务、代码批次和 commit boundary |

## 2. 本步输入与 SOP 问题回答

| 输入 | 用途 | 读取结论 |
|---|---|---|
| Step 4 对象与交付物 | 确定 phase 必须消费和产出的 surface | 不按单个 struct/file 排 phase |
| `03` §4~§16 与 Step 17 handoff | 确定模块、能力 cut、协议、flow、状态、TX、binding 和 owner | capability cut 可逐 phase 回指 |
| `04` §3~§15 | 确定 profile、Stage 0~7、external slot、failure 和 activation | 配置先于需要它的运行边界 |
| `05` §3~§14 | 确定 189 TC/DS/EV、10 suite、5 gate、9 check 和 evidence 依赖 | phase 只引用门禁，不声称执行 |
| `06` §5~§14 | 确定 AC/VF/VETO、release/handoff 和 risk 语义 | 最终结论留给真实验收 |
| `03_ddd_step_17_implementation_handoff.md` | 做能力到协议/phase 的反向索引 | 不创建第二份 schema |

SOP 问题回答：

1. **最小可验证纵切是什么？**

   最小纵切不是单个注册接口，而是 `contracts -> domain -> application -> repository/fake -> API facade` 的 identity/access-review accepted mutation 纵切。它必须能证明 typed input、single authority、UoW、idempotency、stored result、trace/change/capture 对称和 body-free boundary；因此先有 PH-01/PH-02，再在 PH-03 形成首个业务纵切。

2. **哪些阶段必须先于其他阶段？**

   PH-01 必须先于所有代码和测试运行；PH-02 必须先于所有 capability truth；identity/registry 必须先于 descriptor、relation 和 exposure；truth 与 resolver 必须先于 query/material、event 和 job；所有业务纵切与报告输入必须先于 PH-11。

3. **哪些风险或跨仓依赖需要前置？**

   目标仓、`core-contracts` package/lib/path、七 member 命名、Rustdoc、配置 profile、run-scoped roots 和 ledger 必须在 PH-01 验证。治理、method-library、runtime/tools、SDK、MCP/A2A/API 和 observability 真实产品不作为 P0 compile dependency，分别在对应 phase 以 ref/adapter/fake/controlled/disabled seam 进入。

4. **每个 phase 完成后能验证什么？**

   每个 phase 都有独立的功能增量、测试族方向、AC/VETO 关联和禁止越界面；实际 command、case、evidence 和运行结果在 Step 6/7 绑定，缺失时保持 blocked/not_evaluated。

5. **是否存在按对象拆分而不可验证的阶段？**

   原始对象清单不能直接当 phase。当前 phase 以能力闭环和外部可验证行为组织，crate/file 只作为落点；同一 phase 可跨 contracts/domain/application/infra/api，但必须形成一个可审查的纵切。

6. **哪些阶段可以并行？**

   设计上的主依赖链按 PH-01~PH-11 顺序推进。测试 fixture、静态扫描器、redaction negative corpus 和 report script skeleton 可以在 PH-01 后随相关 phase 增量编写，但不能绕过 phase gate 或提前宣告下游能力。PH-07 的 query/material surface 与 PH-08 的 event collaboration 在代码层可有受限并行，但正式 phase gate 仍按依赖顺序关闭。

7. **每个 phase 是否有输入、输出、测试和验收方向？**

   是。阶段总表和逐 phase 增量表分别固定四项；Step 7 再将其细化为 boundary-level command、case、check、raw/report contract。

8. **是否消费后续 phase 才能提供的事实？**

   设计审计将后续-only facts 标记为禁止输入。Query 不依赖 Job 结果来形成 truth，Outbound 不依赖 delivery status，Job 不重扫 current truth，release 不生成业务事实。

9. **phase 停审是否完成？**

   已完成设计层停审；这不是实现通过。每个实现 boundary 仍必须重新通过 Design/Scope/Worktree/Build/Test/Evidence/Commit/Handoff Gate。

10. **跨 phase 依赖是否闭环？**

    设计层审计通过：唯一 compile sibling、owner 方向、核心能力顺序、测试/验收覆盖、证据归属和禁止责任均有记录；目标仓缺失仍是 implementation prerequisite，不是 upstream design blocker。

## 3. 当前材料问题诊断

| 材料 | 风险 | 当前修正 |
|---|---|---|
| 旧实施方向 | 可能把 runtime/provider/approval/cost 当作主链 | 只保留 historical diagnosis，不进入 phase |
| `03` 七 member | 按 crate 横切会让每阶段没有可验收能力 | crate 作为落点，能力 cut 作为 phase 主轴 |
| 83 protocol/flow | 一次性实现会形成不可审查的大提交 | 按 capability family、query、collaboration、job 分 phase，Step 6 再拆 boundary |
| `05` evidence | 可能被拖到最后手工补齐 | PH-01 建 roots/script shell，相关 phase 产生输入，PH-11 只汇总真实产物 |
| P1 外部产品 | 具体产品未选择，若前置会阻塞 P0 | 只交付 descriptor/adapter/controlled seam，selected integration 后置 |

## 4. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按 `contracts/domain/application/...` 横向拆 | 与目录一致 | 每个 phase 不能证明业务闭环 | 不采用 |
| 只做一个“全仓实现” phase | 计划短 | 无法独立 review、测试或回退 | 不采用 |
| 按 capability truth family 纵切，再单独拆 query/event/job/release | 可形成可验证增量，owner 和红线清楚 | Step 6 boundary 数量较多 | 采用 |
| 把 query、event、job 合并到 mutation phase | 早集成 | 会混淆 no-write、post-commit 和 no-repair 责任 | 不采用 |
| 把真实外部产品纳入 P0 phase | 便于演示 | 产品未选、跨仓责任和证据不可控 | 不采用 |

## 5. 阶段依赖图

#### 阶段依赖图: L3-capability-hub capability access truth implementation order

```text
[PH-01 Repository / Workspace / Tooling / Evidence Baseline]
  | enables
  v
[PH-02 Contract / Domain / Application Foundation]
  | enables
  v
[PH-03 Capability Identity / Access Review / Registry]
  | depends_on
  v
[PH-04 Adapter Descriptor / External Adapter Contract]
  | depends_on
  v
[PH-05 Governance Seam / Method-Library Body-Free Relation]
  | depends_on
  v
[PH-06 Formal Exposure / Visibility / Controlled Consumer View]
  | depends_on
  v
[PH-07 Traceability / Impact / Reference Resolution]
  | enables
  +------------------------------+
  |                              |
  v                              v
[PH-08 Query / Read Material]  [PH-09 Inbound / Outbound Collaboration]
  |                              |
  +--------------+---------------+
                 | depends_on
                 v
[PH-10 Operations Jobs / Replay / Recovery]
                 | enables
                 v
[PH-11 Evidence / Release / Acceptance Handoff]
```

关键说明：

- 图表达 phase 之间的能力依赖，不表达 83 条 flow 的完整调用图或具体 Rust 文件。
- PH-08 与 PH-09 共享 PH-07 的 truth/reference 基线；二者在受限代码批次上可并行，但不能绕过共同 gate。
- PH-10 只消费冻结的 truth/material/reference，并产生 derived/report/recovery surface；它不修复核心 truth。
- PH-11 只从同一 `run_id` 的真实 raw/report/check 产物汇总，不生成业务状态或默认通过。

## 6. 阶段总表

| 阶段 | 阶段名称 | 可验证实施目标 | 依赖 | 核心交付物 | 阶段门禁方向 |
|---|---|---|---|---|---|
| PH-01 | Repository / Workspace / Tooling / Evidence Baseline | 形成可检查的七 member workspace、唯一依赖候选、profile/script/root/ledger 前置 | 无 | Cargo layout、config skeleton、script/check shell、run roots | `cargo fmt/check`；dependency/Rustdoc/path checks；script dry-run |
| PH-02 | Contract / Domain / Application Foundation | 形成 typed carrier、closed error/ref、state/policy、Port/UoW/idempotency 和 fake foundation | PH-01 | contracts、domain policies、application Port/UoW、deterministic test support | static-contract-docs；domain-state foundation；repository-transaction seed |
| PH-03 | Capability Identity / Access Review / Registry | 建立 identity/access-review/registry 的最小 accepted mutation 与 current query基础 | PH-02 | C01~C08、Q01~Q06、identity/registry state/history/store/fake/API slice | domain-state；service-command-query；repository-transaction；AC-CH-001/002/006~011 |
| PH-04 | Adapter Descriptor / External Adapter Contract | 建立 descriptor、risk/secret-safe summary、external MCP/A2A/API body-free adapter seam | PH-03 | C09~C12、Q07~Q10、descriptor/reference stores、controlled/disabled adapter | service-command-query；runtime-binding；configuration-strict；VETO-CH-004 |
| PH-05 | Governance Seam / Method-Library Body-Free Relation | 建立 governance/policy approval seam 引用与 method-library body-free relation，不拥有外部 truth | PH-04 | C13~C17、Q11~Q14、I01~I02、relation stores/resolvers/fakes | service-command-query；entry-inbound；state/TX/redaction；VETO-CH-005/006 |
| PH-06 | Formal Exposure / Visibility / Controlled Consumer View | 建立 formal exposure、applicability、visibility、SDK server boundary 和 controlled view | PH-05 | C18~C21、Q15~Q19、J02 read/material seed、visibility resolver/view store | service-command-query；domain-state；runtime-binding；VETO-CH-007/008 |
| PH-07 | Traceability / Impact / Reference Resolution | 建立 change/trace/impact、typed reference resolution 与 body-free derived source | PH-06 | C22~C26、Q20~Q23/Q29~Q33、I03~I06、reference/trace/impact stores | repository-transaction；observability-redaction；entry-inbound；VETO-CH-009 |
| PH-08 | Query / Read Material | 完成 33 Query 的 no-write、visibility、freshness/degraded、directory/export/read material surfaces | PH-07 | Q01~Q33 full query surface、material/projection stores、API handlers、query fixtures | service-command-query；observability-redaction；AC-CH-019/020/028/033~037 |
| PH-09 | Inbound / Outbound Collaboration | 完成 6 Inbound、10 Outbound 的 receipt/capture/snapshot/A-B-C collaboration seam | PH-07；PH-08 query contracts | I01~I06、O01~O10、worker lifecycle/source/route fakes | entry-inbound；outbound-collaboration；runtime-binding；VETO-CH-007/009/010 |
| PH-10 | Operations Jobs / Replay / Recovery | 完成 8 Job 的 frozen plan、target terminal、stored report、replay、safe recovery | PH-08；PH-09 | J01~J08、jobs runner、journal/report/material refresh、recovery fixtures | jobs-lifecycle；repository-transaction；configuration-strict；VETO-CH-P-008/009 |
| PH-11 | Evidence / Release / Acceptance Handoff | 形成真实执行期 report/evidence/VETO/handoff 的生成和审计入口 | PH-10 | 10 suite aggregation、5 gates、9 checks、4 builders、acceptance/review shell | release gate、report-generation、redaction/dependency/no-static audit；不作最终 verdict |

## 7. 可验证增量说明

| Phase | 功能增量 | 输入 | 输出 | 明确不包含 | 验证方向 |
|---|---|---|---|---|---|
| PH-01 | 从无实现仓事实到可预检的工程/证据骨架 | Step 3；`03` §3~§4；`04` profiles；`05` §9/§13 | 七 member layout、strict config skeleton、script/root contract、ledger handoff | 业务 DTO、domain truth、真实 run | path/dependency/Rustdoc/script dry-run |
| PH-02 | 从工程骨架到可构造的 typed contract/domain/application foundation | `03` §5~§13；Step 16 test cuts | public contracts、policy/state foundation、Port/UoW/idempotency、fake support | capability-specific accepted flow、external product | static/domain/contract foundation |
| PH-03 | identity/access-review/registry 的首个 accepted truth 纵切 | PH-02；C01~C08、Q01~Q06、STATE/TX source | same-UoW identity/registry mutation、history、stored result、minimal read | descriptor、governance approval、marketplace listing | service/state/TX/idempotency |
| PH-04 | descriptor 与外部接入元数据的 body-free truth | PH-03；C09~C12、Q07~Q10、external slots | descriptor/risk/secret-safe summary、typed resolver/adapter outcome | provider route/quota/cost/secret、MCP/A2A/API execution | descriptor/redaction/binding/config |
| PH-05 | governance/method relation 的只引用接缝 | PH-04；C13~C17、Q11~Q14、I01~I02 | seam/relation state、safe result/asset ref、receipt/fake | approval/policy truth、method body/source/version | command/inbound/state/redaction |
| PH-06 | formal exposure/visibility 与受控消费表达 | PH-05；C18~C21、Q15~Q19、J02 source | exposure/applicability、visibility resolver、controlled view/freshness | runtime/tools execution、SDK client/cache、listing | visibility/no-write/state/binding |
| PH-07 | trace/impact/reference 的可解释变化链 | PH-06；C22~C26、Q20~Q23/Q29~Q33、I03~I06 | trace/impact/ref state、body-free source and handoff candidates | raw audit/evidence body、downstream truth repair | trace/TX/reference/redaction |
| PH-08 | 全量 read surface 可查询且不写 truth | PH-07；33 Query contracts；material source | 33 Query handlers、read material、freshness/degraded/empty pages | Query-triggered mutation/refresh/reconcile | query no-write/read visibility/material |
| PH-09 | 外部协作可接入而不改变本地 truth | PH-07/08；I/O contracts、worker binding | inbound receipts、outbound snapshot/capture/intent、controlled publisher | local delivery lifecycle、queue/DLQ/transport truth | inbound/outbound/A-B-C/worker cleanup |
| PH-10 | 维护与恢复可重放且不修核心真相 | PH-08/09；J01~J08、journal/report contracts | frozen plan、target outcome、stored report、derived refresh/recovery | current-truth rescan、duplicate mutation、final acceptance | job lifecycle/transaction/replay |
| PH-11 | 真实执行产物可审计地汇总到验收交接 | PH-10；`05` §9/§13、`06` §10~§14 | run report/evidence index/gate/VETO/handoff builders | static passed、风险代签、最终验收 verdict | release/report/no-static/pairing/VETO |

## 8. Phase 停审记录

| Phase | 可验证增量 | 依赖/输入闭合 | 后续越界检查 | 设计层结论 |
|---|---|---|---|---|
| PH-01 | workspace/config/root preflight | 目标仓和 core path 在执行期核对 | 不实现业务 truth | pass-designed |
| PH-02 | shared contract/domain/application foundation | `03` exact declarations、UoW、Port、error source已存在 | 不提前实现 capability flow | pass-designed |
| PH-03 | identity/registry accepted mutation | C01~C08/Q01~Q06与state/TX source闭合 | 不吸收 descriptor、approval、listing | pass-designed |
| PH-04 | descriptor/body-free external seam | external Port/config/failure source闭合 | 不持有 provider/secret/execution truth | pass-designed |
| PH-05 | governance/method relation seam | typed ref/resolver/inbound source闭合 | 不创建 approval/policy/body | pass-designed |
| PH-06 | exposure/visibility/view | source-symmetric visibility and resolver source闭合 | 不做 runtime allow/deny 或 SDK client | pass-designed |
| PH-07 | trace/impact/reference | trace/capture/reference owner和TX闭合 | 不把 log/audit backend当 truth | pass-designed |
| PH-08 | Query/read material | all 33 Query exact no-write source闭合 | 不由 Query 写、修或刷新 truth | pass-designed |
| PH-09 | Inbound/Outbound collaboration | receipt/capture/A-B-C/worker binding闭合 | 不引入 local delivery lifecycle | pass-designed |
| PH-10 | Job/replay/recovery | frozen plan/journal/report/terminal UoW闭合 | 不重跑 mutation或修 core truth | pass-designed |
| PH-11 | evidence/release handoff | raw/report/check/AC/VETO contract闭合 | 不伪造 run、evidence、verdict | pass-designed |

## 9. 跨 phase 依赖闭环审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 唯一 compile-time sibling | pass-designed | 仅 PH-01 预检 `core-contracts`；其余 sibling 为 seam |
| capability truth 顺序 | pass-designed | identity -> registry -> descriptor -> relation -> exposure -> trace/reference |
| Query no-write | pass-designed | PH-08 在 truth/material source 后，不能成为 mutation 前置 |
| Inbound/Outbound owner | pass-designed | PH-09 使用既有 application/capture owner，不反向拥有外部 truth |
| Job no-truth-repair | pass-designed | PH-10 只处理 frozen plan、derived/material/report/recovery |
| evidence provenance | pass-designed | PH-01 建 root，PH-03~10提供输入，PH-11派生汇总 |
| VETO coverage | pass-designed | VETO-CH-001~013 和 VETO-CH-P-001~010 在相关 phase 前置规避，PH-11汇总 |
| phase 越界 | pass-designed | 没有 phase 依赖后续-only business fact |
| P1 selected integration | deferred by design | 不阻塞 P0；缺失时按 blocked_dependency，不转换为 pass |
| target repo | implementation prerequisite | 缺失阻止所有代码 boundary，但不改变 phase order |
| unresolved upstream design blocker | `0` | 无需回写 `00~06` 才能继续 Step 6 |

## 10. 回填草稿

> 校准来源：
> - `design-calibration/07_implementation_plan_step_05_phases_dependencies.md`
>
> 延伸阅读：
> - 建议继续阅读本中间产物的“阶段依赖图”“阶段总表”“可验证增量说明”“Phase 停审记录”和“跨 phase 依赖闭环审计”小节。

正式 `07-实施计划.md` §5 应采用 `PH-01`~`PH-11` 的稳定顺序：工程/证据基线、合同与应用基础、identity/registry、descriptor、governance/method relation、exposure/view、trace/reference、query/material、event collaboration、operations jobs、evidence/release handoff。每个 phase 以可验证能力增量组织，明确依赖、产出、门禁方向和禁止越界；不按 crate、struct 或文件裸拆，也不把 runtime execution、approval truth、method body、provider truth、marketplace 或 SDK client 并入本仓。

## 11. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| PH-01 执行时目标仓是否已建立 | 阻塞全部代码 boundary | 只在实现 preflight 确认；不得使用替代路径 |
| PH-01 的具体 script 实现方式 | 影响 Step 6/7 文件级 scope | 当前只固定 command/path contract，Step 6 拆 boundary |
| 外部 MCP/A2A/API 具体产品 | 影响 selected integration | 保持 controlled/disabled；不阻塞 P0 |
| PH-08/PH-09 的并行程度 | 影响 boundary 排序 | 默认按 PH-08 -> PH-09；Step 6 可声明受限并行但不得改变 gate 顺序 |
| concrete observability backend | 影响 instrumentation binding | 保持 backend-neutral；按 `03` controlled reopen 规则处理 |

## 12. 进入下一步条件

| 条件 | 状态 | 依据 |
|---|---|---|
| 阶段依赖图已输出 | pass-designed | PH-01~PH-11 稳定编号和依赖关系 |
| 每个 phase 是可验证功能增量 | pass-designed | 每阶段有输入、输出、验证和不包含 |
| phase 停审已完成 | pass-designed | 11/11 phase 有设计层停审记录 |
| 跨 phase 审计无 unresolved 设计冲突 | pass-designed | owner、dependency、evidence、VETO 和越界项闭合 |
| 可进入 Step 6 | allowed | `enter_07_step_06_tasks_commit_boundaries` |
