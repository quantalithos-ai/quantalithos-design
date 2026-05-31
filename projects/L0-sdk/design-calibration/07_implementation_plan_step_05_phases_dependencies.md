# L0-sdk 07 实施计划 Step 5: 实施阶段与依赖顺序

> 本文件是 `projects/L0-sdk/07-实施计划.md` 的 Step 5 中间产物。
> 本步把 Step 4 的交付物组织成按依赖推进的阶段化可验证功能增量。
> 本步只定义阶段顺序和阶段级门禁,不拆分阶段任务、编写顺序或 commit boundary。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 5 |
| 主题 | 设计实施阶段与依赖顺序 |
| 状态 | 已确认 |
| 正式回填位置 | `07-实施计划.md` §5 |
| 是否修改正式 `07-实施计划.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_04_deliverables.md` | 已确认 | 提取交付物、非交付物、跨仓依赖和交付物边界 |
| `03-详细设计.md` §4~§16 | 已完成 | 提取 crate / package 依赖、协议依赖、状态依赖、事务依赖和测试切口 |
| `04-配置设计.md` §3~§12 | 已完成 | 提取 config / runtime graph、profile、contracts path、artifact / report root 和 forbidden config |
| `05-测试方案.md` §4~§14 | 已完成 | 提取测试分层、TC / EV、gate、report、artifact、candidate 和 smoke 门禁 |
| `06-验收标准.md` §5~§14 | 已完成 | 提取 AC / VETO 对阶段顺序的约束 |

---

## 3. SOP 问题回答

### 3.1 最小可运行或可测试的纵切是什么?

最小可测试纵切不是完整三语言 SDK,而是“目标仓可编译 + core / bus contracts path dependency + semantic baseline / derived view 写入 + freshness query + 固定 run evidence”。该纵切能最早证明 SDK 不复制上游 truth、能生成本地 SDK truth、能暴露只读查询、能输出证据,并为后续 service boundary、event boundary、candidate 和 smoke 打基础。

### 3.2 哪些阶段必须先于其他阶段?

仓初始化、依赖绑定、配置和证据骨架必须先于任何业务纵切。上游契约承接和 semantic baseline 必须先于 service / event boundary,因为 boundary 能否暴露依赖 capability model、concept map、freshness 和上游 ref。boundary guard、error / trace / redaction 和 credential ref-only 必须先于 package candidate stable gate。candidate 和 language package build 必须先于 docs / smoke。compatibility 和 deprecated 治理必须依赖 candidate、evidence 和 migration ref。

### 3.3 哪些风险或跨仓依赖需要前置?

需要前置的风险包括目标仓仅有 git shell、`core-contracts` / `bus-contracts` path dependency、Rust / Python / TypeScript 工具链、三语言 package layout、artifact / report 路径、forbidden body / raw secret redaction、fake / fixture boundary 和 public registry 膨胀风险。真实 formal API endpoint、真实 bus runtime、real credential provider、public registry 和 L1/L2/L3/L4 full client coverage 不前置为 P0 服务依赖。

### 3.4 每个阶段完成后能验证什么?

PH-01 验证仓、workspace、package 目录、path dependency、config、scripts 和证据骨架。PH-02 验证 core / bus truth 承接、semantic baseline、derived view、freshness 和只读查询。PH-03 验证 service capability、bus event client、boundary guard、error / trace、redaction 和 credential protection。PH-04 验证 local package candidate、language artifact metadata 和 Rust / Python / TypeScript package surface。PH-05 验证 docs example、cross-language smoke、verification evidence 和 evidence redaction。PH-06 验证 compatibility、deprecated 和 migration governance。PH-07 验证 projection rebuild、reports、acceptance handoff、VETO 和最终 release gate。

### 3.5 是否存在按对象拆分而不可验证的阶段?

存在风险。例如“实现所有 DTO”“实现所有 domain 对象”“实现所有 package surface”都不可作为阶段,因为它们不能独立证明 official SDK 闭环。正确做法是让每个阶段穿过 contracts、domain、application、infra、client / package、tests 和 evidence 的一条可验纵切。

### 3.6 哪些阶段可以并行,哪些不能并行?

PH-01 必须串行先完成。PH-02 是第一条业务纵切,PH-03~PH-07 不能跳过它。PH-04 的 language package 空目录、metadata 和 layout check 可以在 PH-02 后与 PH-03 局部并行,但 candidate stable gate 必须等待 PH-03 的 boundary / redaction 门禁。PH-05 的 docs template 可以提前准备,但 smoke 和 evidence 验收依赖 PH-04。PH-06 依赖 PH-05 的 evidence。PH-07 只能最后执行。

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 交付物清单尚未排序 | Step 4 只说明交付什么 | 实施者不知道先做哪个能力 | 本步按依赖链组织阶段 |
| crate / package 容易误当阶段 | `contracts/domain/application/infra/client/packages` 边界清楚 | 可能按模块分工,但每阶段不可验 | 阶段按可验证纵切命名,crate / package 只是落点 |
| 三语言 package 易后补 | Python / TypeScript 不是 Rust 后续增强,而是 P0 official SDK 的组成部分 | 触发 VETO-SDK-003 | PH-04 / PH-05 明确纳入 package、docs 和 smoke |
| redaction / credential guard 容易后补 | 安全门禁横跨 boundary、candidate、evidence 和 reports | 后期发现 raw body 泄露会大面积返工 | PH-03 前置 boundary policy 和 redaction gate |
| reports / artifacts 易最后补 | `05` / `06` 强制 artifacts 和 reports | 最后验收时证据缺失 | PH-01 建骨架,PH-07 收口 |
| public registry 诱导膨胀 | candidate 容易被误读为公网发布 | P0 范围过大 | 阶段只做 local candidate,registry 写入非交付物 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 阶段组织 | 只有交付物列表 | 形成 PH-01~PH-07 阶段依赖顺序 | 实施者知道按什么顺序推进 |
| 最小闭环 | 尚未定义 | 明确最小纵切为 upstream contract -> semantic baseline -> derived view -> freshness query -> evidence | 避免一次性铺开全部 SDK 能力 |
| 三语言范围 | 只列为交付物 | PH-04 / PH-05 独立承接 package build、docs 和 smoke | 防止 Python / TypeScript 后补 |
| 安全红线 | 只列为验收门禁 | PH-03 前置 boundary guard、redaction、credential protection | 防止 candidate 和 report 污染 |
| 证据门禁 | 只列交付物 | 阶段从 PH-01 开始绑定 artifact / report,PH-07 收口 | 防止测试证据后补 |
| 并行性 | 未说明 | 明确 package layout / docs template 可局部并行,核心状态链路不可并行 | 降低实现冲突 |

---

## 6. 实施设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按 crate / package 阶段推进 | 目录清晰,便于分工 | 完成一个 crate 或 package 不等于完成可验能力 | 不采用 |
| 按 P0 功能纵切推进 | 每阶段可测试、可验收 | 同一阶段会跨多个 crate / package | 采用 |
| 先完整实现 Rust,再补 Python / TypeScript | Rust 进展快 | 破坏三语言 official SDK 闭环 | 不采用 |
| 早期保留三语言 package layout,中段完成 candidate / smoke | 能兼顾依赖顺序和 P0 约束 | 需要工具链前置检查 | 采用 |
| 把 public registry 发布作为阶段 | 对最终发布更完整 | 超出 P0,依赖外部凭据和 release ops | 不采用 |
| local candidate + package artifact + smoke 作为阶段 | 可独立验证 P0 | 后续仍需 release 专项 | 采用 |
| 最后统一补报告和证据 | 实现阶段更短 | 不满足验收标准,容易补不齐 | 不采用 |
| PH-01 建证据骨架,PH-07 统一收口 | 证据链从一开始可见 | 初始阶段需要多做脚本骨架 | 采用 |

---

## 7. 结构化中间产物

### 7.1 阶段依赖图: L0-sdk 实施阶段顺序

```text
[PH-01 仓初始化与证据骨架]
  | enables workspace, path deps, config and scripts
  v
[PH-02 上游契约承接与语义基线]
  | creates SDK semantic baseline and fresh derived views
  v
[PH-03 服务/事件边界与安全策略]
  | proves ref-only service call and bus event boundary
  v
[PH-04 本地 package candidate 与三语言产物]
  | creates local candidate and language artifacts
  v
[PH-05 文档示例、跨语言 smoke 与验证证据]
  | proves docs, smoke and redacted evidence
  v
[PH-06 兼容性、deprecated 与迁移治理]
  | records compatibility and lifecycle decisions
  v
[PH-07 Reports / projections / acceptance handoff 收口]
```

关键说明:

- 图表达阶段依赖顺序,不表达完整函数调用链。
- 阶段按可验证功能增量组织,不是按 crate、对象、语言包或文件组织。
- `scripts`、`artifacts`、`reports` 在 PH-01 建骨架,在 PH-07 形成完整送验材料。
- public registry、production endpoint 和 real credential provider 不在阶段主链中。

### 7.2 阶段总表

| 阶段编号 | 阶段名称 | 实施目标 | 依赖阶段 | 核心交付物 | 阶段门禁 |
|---|---|---|---|---|---|
| PH-01 | 仓初始化与证据骨架 | 创建目标仓、workspace、packages、core / bus dependency、基础 config、gate / report / check 脚本骨架 | 无 | `/home/aris/Projects/quantalithos-sdk`、`crates/*`、`packages/*`、`scripts/*`、`artifacts/test/<run_id>`、`reports/` | workspace 可编译;路径和命名检查通过;脚本支持 required args;无 `latest` 正式引用 |
| PH-02 | 上游契约承接与语义基线 | 承接 core / bus contracts,建立 semantic baseline、concept map、derived view、freshness 和基础 query | PH-01 | `core-contracts` / `bus-contracts` usage、semantic baseline、derived binding view、inbound change consumer、freshness query | `TC-SDK-CONTRACT-*`;`TC-SDK-SEMANTIC-*`;AC-FUNC-001 / 002;AC-IF-007 / 008 |
| PH-03 | 服务 / 事件边界与安全策略 | 打通最小 service capability、bus event publish、boundary guard、error / trace、redaction 和 credential ref-only | PH-02 | `ServiceClient`、`EventClient`、formal / fake boundary、bus event boundary、policy guard、error / trace mapper | `TC-SDK-BOUNDARY-*`;`TC-SDK-EVENT-*`;`TC-SDK-TRACE-*`;`TC-SDK-SECURITY-*`;AC-FUNC-003~006 |
| PH-04 | 本地 package candidate 与三语言产物 | 基于 fresh view 和 baseline 生成 local candidate,构建 Rust / Python / TypeScript package artifact metadata;artifact metadata 必须包含来源 `language_view_id` | PH-03 | package candidate service、language generator、package builder、language artifact、package layout checks | `TC-SDK-CANDIDATE-*`;package layout check;AC-FUNC-007;VETO-SDK-003 初步可判定 |
| PH-05 | 文档示例、跨语言 smoke 与验证证据 | 运行 quickstart / docs example / cross-language smoke,记录 passed + redacted verification evidence | PH-04 | docs runner、smoke runner、validation finished consumer、verification evidence、boundary verification job | `TC-SDK-DOCS-*`;`TC-SDK-SMOKE-*`;`TC-SDK-SECURITY-003~004`;AC-FUNC-008 / 009 |
| PH-06 | 兼容性、deprecated 与迁移治理 | 记录 compatibility decision、deprecated lifecycle 和 migration guide ref,防止 breaking 被误标 compatible | PH-05 | compatibility service、deprecated API record、migration ref、compatibility job | `TC-SDK-COMPAT-*`;AC-FUNC-010;AC-STATE compatibility / deprecated checks |
| PH-07 | Reports / projections / acceptance handoff 收口 | 重建 projection,生成 fixed run reports、evidence index、veto checklist、risk acceptance 和 acceptance handoff | PH-01~PH-06 | projection rebuild job、report generator、redaction check、handoff、veto checklist、risk acceptance | `SUITE-SDK-MAIN-REPORT-CHECK`;AC-EV-*;VETO-SDK-*;release / candidate gate |

### 7.3 阶段顺序理由

| 顺序 | 理由 |
|---|---|
| PH-01 先行 | 没有目标仓、workspace、dependency、config 和证据骨架,任何代码阶段都不可验证 |
| PH-02 早于 PH-03 | service / event boundary 必须基于 fresh upstream view、semantic baseline 和 capability model |
| PH-03 早于 PH-04 | candidate stable gate 依赖 boundary guard、redaction、credential protection 和 fake marker 规则 |
| PH-04 早于 PH-05 | docs / smoke 必须基于可构建的 local package candidate 和三语言 package surface |
| PH-05 早于 PH-06 | compatibility decision 需要 candidate、evidence、smoke 和 migration ref 输入 |
| PH-07 最后 | reports、acceptance handoff 和 VETO 裁决必须基于全部 P0 能力和固定 run evidence |

### 7.4 阶段可并行性判断

| 阶段 | 可并行部分 | 不可并行部分 | 结论 |
|---|---|---|---|
| PH-01 | README / script help / report template 可与 workspace 骨架并行 | path dependency、crate / package naming、artifact / report root 必须统一后再推进 | 小范围并行 |
| PH-02 | DTO schema tests 和 fixture builder 可并行 | semantic baseline、derived view 和 freshness query 必须形成一条纵切 | 阶段内可并行,阶段不可跳过 |
| PH-03 | service boundary 和 event boundary 可分工 | boundary policy、redaction 和 credential guard 必须统一 | 阶段内可并行 |
| PH-04 | Python / TypeScript layout 可提前准备 | candidate generation 和 stable gate 依赖 PH-03 | 部分并行 |
| PH-05 | docs template 可提前准备 | smoke、validation evidence 和 redaction evidence 依赖 PH-04 | 部分并行 |
| PH-06 | 无明显可提前验收项 | compatibility / deprecated 依赖 evidence 和 migration ref | 不提前验收 |
| PH-07 | 无 | 必须等待 PH-01~PH-06 证据齐全 | 不并行 |

### 7.5 按对象拆分风险检查

| 错误阶段写法 | 问题 | 替代表达 |
|---|---|---|
| 实现所有 DTO | 只能证明类型存在,不能证明 SDK 闭环 | PH-02 / PH-03 / PH-04 随纵切交付 DTO |
| 实现所有 domain 对象 | 缺少 service、adapter、client、package 和证据 | 按 semantic、boundary、candidate、evidence、compatibility 纵切交付 |
| 实现所有 repository / adapter | 没有用例驱动,容易过度抽象 | 在 PH-02 起随写路径、query、candidate 和 evidence 交付 |
| 实现 Rust SDK 后再补 Python / TypeScript | 破坏三语言 official SDK P0 | PH-04 / PH-05 明确纳入三语言产物和 smoke |
| 最后统一写测试和 reports | 阶段不可验,不符合验收标准 | 每个阶段绑定 TC / AC,PH-07 只做总收口 |

---

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §5。

```markdown
## 5. 实施阶段与依赖顺序

> 校准来源:
> - `design-calibration/07_implementation_plan_step_05_phases_dependencies.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“阶段依赖图”“阶段总表”“阶段顺序理由”“阶段可并行性判断”和“按对象拆分风险检查”小节,了解本轮为什么按可验证功能增量而不是按 crate / 对象 / 语言包排阶段。

#### 阶段依赖图: L0-sdk 实施阶段顺序

```text
[PH-01 仓初始化与证据骨架]
  | enables workspace, path deps, config and scripts
  v
[PH-02 上游契约承接与语义基线]
  | creates SDK semantic baseline and fresh derived views
  v
[PH-03 服务/事件边界与安全策略]
  | proves ref-only service call and bus event boundary
  v
[PH-04 本地 package candidate 与三语言产物]
  | creates local candidate and language artifacts
  v
[PH-05 文档示例、跨语言 smoke 与验证证据]
  | proves docs, smoke and redacted evidence
  v
[PH-06 兼容性、deprecated 与迁移治理]
  | records compatibility and lifecycle decisions
  v
[PH-07 Reports / projections / acceptance handoff 收口]
```

阶段必须按可验证功能增量推进。`contracts/domain/application/infra/client/cli/jobs/packages` 是代码落点,不是阶段拆分依据。

| 阶段编号 | 阶段名称 | 实施目标 | 依赖阶段 | 核心交付物 | 阶段门禁 |
|---|---|---|---|---|---|
| PH-01 | 仓初始化与证据骨架 | 创建目标仓、workspace、packages、core / bus dependency、基础 config 和脚本证据骨架 | 无 | 目标仓、`crates/*`、`packages/*`、`scripts/*`、`artifacts/test/<run_id>`、`reports/` | workspace 可编译;命名和路径检查通过 |
| PH-02 | 上游契约承接与语义基线 | 承接 core / bus contracts,建立 semantic baseline、concept map、derived view、language view、freshness 和基础 query | PH-01 | contracts usage、semantic baseline、derived / language view、freshness query | `TC-SDK-CONTRACT-*`;`TC-SDK-SEMANTIC-*`;AC-FUNC-001 / 002 |
| PH-03 | 服务 / 事件边界与安全策略 | 打通最小 service capability、bus event publish、boundary guard、error / trace、redaction 和 credential ref-only | PH-02 | `ServiceClient`、`EventClient`、boundary adapters、policy guard、error / trace mapper | `TC-SDK-BOUNDARY-*`;`TC-SDK-EVENT-*`;`TC-SDK-TRACE-*`;`TC-SDK-SECURITY-*` |
| PH-04 | 本地 package candidate 与三语言产物 | 基于 fresh view 和 baseline 生成 local candidate,构建三语言 package artifact metadata;metadata 包含来源 `language_view_id` | PH-03 | package candidate、language generator、package builder、language artifacts | `TC-SDK-CANDIDATE-*`;package layout check |
| PH-05 | 文档示例、跨语言 smoke 与验证证据 | 运行 quickstart、docs example、cross-language smoke,记录 redacted evidence | PH-04 | docs runner、smoke runner、validation evidence、boundary verification job | `TC-SDK-DOCS-*`;`TC-SDK-SMOKE-*`;security evidence |
| PH-06 | 兼容性、deprecated 与迁移治理 | 记录 compatibility decision、deprecated lifecycle 和 migration guide ref | PH-05 | compatibility service、deprecated record、migration ref、compatibility job | `TC-SDK-COMPAT-*`;AC-FUNC-010 |
| PH-07 | Reports / projections / acceptance handoff 收口 | 重建 projection,生成 reports、evidence index、veto checklist、risk acceptance 和 handoff | PH-01~PH-06 | projection rebuild、report generator、redaction check、handoff | AC-EV-*;VETO-SDK-*;release / candidate gate |
```

---

## 9. 待确认事项

| 事项 | 当前结论 | 影响 | 建议 |
|---|---|---|---|
| PH-04 是否可早于 PH-03 | package layout 可提前,但 candidate stable gate 依赖 boundary / redaction | 影响三语言产物启动时机 | 推荐 PH-04 主体验收放在 PH-03 后 |
| PH-05 docs template 是否可提前 | template 可提前,但 docs runner / smoke 依赖 package candidate | 影响文档示例投入时机 | 推荐模板可早做,验收仍在 PH-05 |
| PH-06 是否可与 PH-05 并行 | compatibility 需要 evidence 和 migration ref 输入 | 并行会产生假 compatibility | 不并行 |
| public registry 是否设独立阶段 | 当前非 P0 | 若纳入会扩大范围 | 不设阶段,只列 P1 / P2 风险 |

建议方案: 接受 PH-01~PH-07 的阶段顺序。原因是该顺序以最小 official SDK 闭环为主线,能前置仓库、依赖、三语言、边界、安全和证据风险,同时避免按 crate、对象或语言包拆阶段。

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 阶段依赖图已输出 | 已满足 |
| 阶段总表已覆盖 Step 4 的核心交付物 | 已满足 |
| 每个阶段都有实施目标、依赖阶段、核心交付物和阶段门禁 | 已满足 |
| 阶段顺序已经说明为什么不能按对象、crate、语言包或文件裸拆 | 已满足 |
| 最小可测试纵切已明确 | 已满足 |

结论: 可以进入 Step 6,继续拆分阶段任务、编写顺序与提交边界。
