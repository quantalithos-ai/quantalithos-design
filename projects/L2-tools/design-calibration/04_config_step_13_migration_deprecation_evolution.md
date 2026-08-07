# L2-tools 04 配置设计 Step 13：配置迁移、废弃与演进

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 13
> 对应书写规范：`standards/document/配置设计书写规范.md` §5.13
> 回填目标：`projects/L2-tools/04-配置设计.md` §13
> 状态：`completed / pass; continuous authorization`
> 模式：`full-restart / single-agent-serial`

## 1. Step 状态与结论

| 项目 | 记录 |
|---|---|
| 当前 Step | 定义当前 baseline、未来新增/重命名/废弃/移除与设计重开规则。 |
| 前序门禁 | Step 7~12 已完成 schema、change、failure 和下游承接。 |
| 本步状态 | `completed / pass; continuous authorization` |
| 核心结论 | 当前没有已发布 L2-tools runtime config schema、artifact或实现 binary，因此迁移项为 0。 |
| historical | README、旧 `05/06` 的 builtin/MCP/registry/policy/executor/test DB 等不是 legacy runtime config，不获得 alias/兼容窗口。 |
| 下一动作 | 连续授权下进入 Step 14 风险/待确认/03回写门禁。 |
| 提交 | 不需要。 |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 是否有旧配置迁移 | 无。当前 `04` 是 initial design baseline；目标实现仓不存在，不能声称已发布/消费。 |
| 新配置如何引入 | 先判定需求/架构/`03`影响，再重开受影响 `04` Step 3~13，补schema/source/profile/sensitive/validation/change/failure/downstream。 |
| 旧配置如何废弃 | 只有真实发布后才可能进入deprecated；必须有replacement、window、conflict、warning、test/acceptance/ops承接。 |
| 是否兼容窗口 | 当前无。未来必须按binary×schema×artifact matrix明确，不能默认永久兼容。 |
| 何时移除 | inventory、binary/artifact pairing、environment cleanup、test/acceptance、rollback/ops均有真实证据后。 |

## 3. 当前材料诊断与取舍

| 材料 | 诊断 | 当前处理 |
|---|---|---|
| README | Python monorepo、builtin tools、MCP client、registry、policy check | `historical_material`；不映射任何 canonical key。 |
| 旧 `05` | test DB、controlled host callback、policy fixture等旧主线 | `historical_material`；测试方向待重建，不是配置artifact。 |
| 旧 `06` | policy/scope/host execution旧验收门禁 | `historical_material`；无签署/迁移authority。 |
| 当前 Step 7 | 54 canonical items/document demos | initial formal design candidate；不是released schema。 |

取舍：拒绝“为了兼容历史文字”创造 alias；拒绝用 source priority处理 rename；拒绝 converter猜测 missing/split/merged field；拒绝把 config migration 当 runtime reload。

## 4. 结构化中间产物

### 4.1 当前配置迁移与废弃表

| 旧配置 | 新配置 | 状态 | 兼容窗口 | 迁移策略 | 移除条件 |
|---|---|---|---|---|---|
| 不适用：无已发布旧配置 | Step 7 十 root / 54 items initial baseline | `initial_design_baseline; not released` | 不适用 | 由 Step 1~15 建立正式04；后续07安排实现；不生成v0 alias | 不适用。 |
| README builtin/MCP/registry/policy/executor文字 | 无canonical mapping | `historical_material / rejected as schema` | 无 | 不读取、不转换、不alias | 始终不进入current schema。 |
| 旧05/06 test DB/host callback/policy字段 | 无canonical mapping | `historical_material / not config artifact` | 无 | 下游文档full-restart重建 | 不作为runtime key存在。 |

### 4.2 演进 lifecycle（设计/发布状态，不是 runtime enum）

| 状态 | 含义 | Loader/source行为 | 退出门禁 |
|---|---|---|---|
| `proposed` | 变更请求，尚非authority | current schema不变；unknown仍reject | motivation/owner/impact/reopen闭合。 |
| `introduced` | 新schema已正式设计但可能未实现/发布 | 仅在exact version/profile opt-in；不能称ready | `03/04/05/06/07`与实现证据闭合。 |
| `active` | 对特定released binary正式支持 | strict exact parse | replacement正式引入。 |
| `deprecated` | 显式窗口内仍接受旧identity | exact old path + safe warning；无silent alias | usage/artifact/env/binary/rollback清零有证据。 |
| `rejected` | 不再/从不接受 | deterministic typed reject | 仅历史记录保留。 |
| `removed` | implementation schema定义删除 | old identity仍unknown/reject | post-removal test/acceptance/ops完成。 |
| `design-change-required` | 改变03/架构/安全 | 不进入runtime schema | 先回写正式设计。 |

当前计数：active released=0、deprecated=0、removed=0；initial baseline不是implementation status。

### 4.3 新配置引入门禁

| 顺序 | 必须闭合 | 未闭合处理 |
|---:|---|---|
| 1 | motivation与需求/运维问题 | 不进入schema。 |
| 2 | owner和禁止责任审计 | 越界则reject/回上游。 |
| 3 | `03` impact：field/enum/Port/error/constructor/flow/state/lifecycle | 有影响先回写03。 |
| 4 | `04` item：type/default/required/source/scope/activation/sensitivity/failure | 缺列不得实现。 |
| 5 | source/profile/conflict | 不明确则design review失败。 |
| 6 | sensitive/no-output | 未分类不得启用。 |
| 7 | V0~V8/B0~B8和cross-field | 不完整不得assembly。 |
| 8 | change/review/audit/rollback | high无rollback不得release。 |
| 9 | `05/06/07/09` handoff | 下游未承接不得active。 |

### 4.4 变更类型与受控重开路径

| Change | 当前默认 | 必须重开 |
|---|---|---|
| documentation-only，语义不变 | calibration/formal修正 | Step 15 audit。 |
| 合法value/ref变化，shape/meaning不变 | Step 10 new assembly | change/audit/rollback。 |
| key rename/alias/env rename | old/unknown reject | 04 Step 5/7~13；typed name变更先03。 |
| add/remove/type/unit/default/required改变 | reject current schema | 04 Step 7~13；candidate/runtime变更先03。 |
| root/profile/source/fixture lane新增 | reject | 01/03/04受影响部分。 |
| adapter constructor/capability/error/flow变化 | reject | 03 controlled reopen -> 04。 |
| config center/admin/hot/reload/LKG | reject/design-change | 01/03/04 Step 3~13。 |
| secret provider主动resolution/live rotation | reject/design-change | 03 Port/constructor/lifecycle/error -> 04。 |
| responsibility越界（runtime loop、registry、Sandbox/Obs truth等） | reject | 上游owner/architecture review。 |

### 4.5 Rename/split/merge/source规则

| 演进形态 | future必须定义 | 当前遇到时 |
|---|---|---|
| one-to-one rename | exact versions、mapping、both-present conflict、env names | old key unknown/reject。 |
| split | completeness、no implicit defaults、loss handling | reject；不猜字段。 |
| merge | equality/conflict independent of source priority | reject ambiguous input。 |
| type/unit | exact conversion、overflow/rounding、version | no coercion；reject。 |
| optional/required/default变化 | semantic owner/profile/compat window | current contract unchanged。 |
| env rename | file/new-env/old-env四向 conflict和safe output | old env unsupported。 |

Source priority只处理同一 canonical item 的已登记 source，不处理两个名字是否同义。

### 4.6 Sensitive ref 演进与移除证明

| 场景 | 允许 | 禁止 |
|---|---|---|
| adapter/target/policy ref rotation | new complete candidate + new assembly | raw material converter、live patch。 |
| credential/cert/trust provider version | provider owner动作 + safe audit ref + new assembly | raw value入config/audit/report。 |
| compromised/revoked material | fix-forward | rollback旧material。 |
| provider product replacement | formal adapter capability/constructor review | silent fallback产品/fake。 |

Future removal 必须有以下 owner 的真实 proof：formal design、config artifact inventory、environment key cleanup、binary/schema pairing、sensitive provider rotation/revoke、test、acceptance、implementation boundary和operations rollback/runbook。当前无item需要这些证据，也不声明任何 proof 已存在。

### 4.7 Future 候选与当前状态

| 候选 | 当前状态 | 进入条件 |
|---|---|---|
| `staging-like` | P1 conditional/inactive | durable refs、secret/provider、owner contracts、test/ops gates闭合。 |
| `production-like` | P2 inactive/blocked | no fake、正式external contracts、provider/ops/acceptance闭合。 |
| exact numeric policy registry | future implementation/config detail | bounded authority与测试验收闭合。 |
| remote config/admin/hot/LKG | design-change-required | 01/03/04全链生命周期/审计/rollback设计。 |
| tools-specific Core/SDK seam | upstream dependent | `L2T-UP-008/009` owner正式闭口。 |

### 4.8 跨演进审计

| 审计项 | 结论 | 缺口/修正 |
|---|---|---|
| 是否误称current schema已发布 | 通过 | initial design baseline only。 |
| historical文字是否生成alias | 通过 | 全部隔离/reject。 |
| rename是否被source priority隐式处理 | 通过 | 独立future schema规则。 |
| migration是否等于hot reload | 通过 | startup converter/new artifact only；P0无converter。 |
| sensitive material是否进入conversion | 通过 | ref-only；provider owner。 |
| removal是否可凭“无日志”推断 | 通过 | 需要多owner真实proof。 |
| future change是否绕过03 | 通过 | typed/lifecycle变化先回写03。 |

## 5. 03影响、回填与门禁

| 配置结论 | 是否影响03 | 类型 | 状态 |
|---|---|---|---|
| current initial baseline/no legacy migration | 否 | config lifecycle documentation | 无回写 |
| historical README/05/06 reject/no alias | 否 | material isolation | 无回写 |
| future raw key/value-only evolution | 视具体情况 | config schema | future trigger |
| future typed root/field/enum/Port/error/constructor/lifecycle | 是 | code contract | 先回写03；当前未触发 |

正式 §13 应装配current no-migration表、lifecycle、introduction gate、change/reopen、rename/split/merge、sensitive演进和future candidate。不得声称released version、converter、artifact inventory、migration run或removal evidence。

| 待确认 | 未确认前处理 |
|---|---|
| initial schema version是否显式字段化 | 当前十root没有version root/field；不新增，future需先评估03。 |
| future binary×schema policy | 尚无实现binary；不声明matrix。 |
| migration tool owner | 当前无migration；不创建tool。 |

| 门禁 | 状态 |
|---|---|
| 当前无迁移项明确 | 通过 |
| historical隔离 | 通过 |
| future introduction/deprecation/removal规则 | 通过 |
| 跨演进审计 | 通过 |
| 无待回写/阻塞待确认 | 通过 |
| 下一动作 | 连续授权下进入 Step 14 |
