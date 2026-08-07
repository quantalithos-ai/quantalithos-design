# L2-tools 04 配置设计 Step 12：测试、验收、实施与运维承接

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 12
> 对应书写规范：`standards/document/配置设计书写规范.md` §5.12
> 回填目标：`projects/L2-tools/04-配置设计.md` §12
> 状态：`completed / pass; continuous authorization`
> 模式：`full-restart / single-agent-serial`

## 1. Step 状态与目标

| 项目 | 记录 |
|---|---|
| 当前 Step | 固定 `04` 向 `05/06/07/09` 交付的配置契约输入。 |
| 前序门禁 | Step 6~11 的 profile、items、sensitive、validation、change、failure 均已通过。 |
| 本步状态 | `completed / pass; continuous authorization` |
| 正式写入 | 关闭；只形成 §12 回填草稿。 |
| blocker | 无新增；上游 blocker 必须进入下游 negative/blocked gate，不得用 fake positive 关闭。 |
| 下一动作 | 连续授权下进入 Step 13 迁移/废弃/演进。 |
| 提交 | 不需要。 |

## 2. 本步边界与 SOP 问题回答

- `05-测试方案.md` 承接“如何证明”：配置 parser/source/profile/cross-field/builder/sensitive/failure/rollback 的场景、层级、fixture、环境与计划证据；本 Step 不提前分配最终 TC/EV/run。
- `06-验收标准.md` 承接“什么算通过”：schema、no-fallback、no-leak、atomic builder、profile isolation、blocked truth、unknown fence、rollback audit 等门禁与一票否决；不伪造签署或通过结论。
- `07-实施计划.md` 承接“按什么边界落码”：config schema/parser/validator/builder/adapters/entry/job/diagnostics 的实现顺序、commit boundary、implementation ledger 与 planned boundary skeleton；不得重新猜 field/Port/error。
- `09-部署与运维手册.md` 承接“如何运行”：实际文件路径、env key 映射、opaque ref/provider binding、进程切换、配置基线、轮换、回滚命令、告警阈值与 runbook；`04` 不写这些事实。
- 下游不得改变十 root、54 items、`D < F < E`、R/X/L lane、三 P0 profile、敏感/no-output、V0~V8、B0~B8、failure semantics 或 `NC-L2T-*`。

## 3. 当前材料诊断、对比与取舍

| 项 | 本步前 | 本步后 |
|---|---|---|
| 测试 | `03` 有 `L2T-CFG-001~007` | 扩展为配置专项主题与证据结构输入。 |
| 验收 | 旧 `06` historical | 形成新验收门禁输入，不沿用旧结果/签署。 |
| 实施 | 只有 planned layout | 明确 config implementation slices 和开工 blocker。 |
| 运维 | 未定义实际绑定 | 明确必须由 `09` 提供的 deployment事实。 |
| evidence | 严禁伪造 | 只定义 future evidence class/字段边界，无 alias/run/result。 |

取舍：下游承接表可以给出 stable theme/gate ID，但正式 TC/AC/commit boundary ID 由各自 SOP 生成；不在 `04` 中写测试脚本、执行命令、报告路径实值、签署人或实现 commit。

## 4. 结构化中间产物

### 4.1 下游承接总表

| 下游文档 | 承接内容 | 本文提供的输入 | 不得重定义 |
|---|---|---|---|
| `05-测试方案.md` | 配置对象/切口、环境/profile、fixture、negative/blocked/degraded/unknown、redaction、builder/rollback测试 | §5~§11 matrices；`L2T-CFG-001~007`；`CFG-X-*`/`CFG-F-*` | 配置 schema/source/sensitivity/failure truth。 |
| `06-验收标准.md` | 配置 release/readiness gate、一票否决、证据完整性、blocked范围 | V0~V8、B0~B8、no-output、no-fallback、profile isolation、rollback audit | 通过结果、real readiness、blocker关闭。 |
| `07-实施计划.md` | schema/loader/validator/builder/adapter/entry/job/diagnostic实现 boundary和开工门禁 | 十 root/54 items/21 domains、错误surface、assembly stages、测试验收输入 | 新 field/enum/Port/error/lifecycle。 |
| `09-部署与运维手册.md` | actual config artifact、env映射、provider/adapter ref binding、restart/rotation/rollback、drift/alert/runbook | source/profile/sensitive/change/failure规则 | 配置语义、安全floor、truth/readiness。 |

### 4.2 `05-测试方案.md` 配置测试承接

| 主题 ID | 必测方向 | Profile/fixture | 计划证据类别 | 禁止声明 |
|---|---|---|---|---|
| `CFG-T-01` | strict JSON: comment/trailing/duplicate/unknown/alias/null/coercion | local/CI parser fixtures | config validation report | 当前已通过。 |
| `CFG-T-02` | D/F/E precedence；invalid high no fallback；R/X/L isolation | local/CI/integration-like | source merge matrix | actual env names未定义。 |
| `CFG-T-03` | 54 item required/type/default/scope/sensitivity/failure | generated contract cases | schema coverage report | 100%已实现。 |
| `CFG-T-04` | three P0 profiles；staging/production inactive；fake isolation | explicit fixture graphs | profile matrix report | production readiness。 |
| `CFG-T-05` | 12 cross-field gates、25 redlines | candidate builder fixtures | cross-validation report | unsafe override可豁免。 |
| `CFG-T-06` | Store/UoW/pair/CAS/replay capability and B0~B8 atomic exposure | fake/durable parity candidates | builder capability report | backend/product readiness。 |
| `CFG-T-07` | sensitive ref-only、raw material reject、all output surfaces redacted | security fixtures，无真实secret | redaction/forbidden sweep report | raw secret/hash入artifact。 |
| `CFG-T-08` | blocked/unavailable/degraded/unknown/partial separation | scripted typed fakes | failure semantics report | fake关闭upstream blocker。 |
| `CFG-T-09` | feature disabled only peripheral；Query no-write/Job no-repair | CI integration fixtures | write/registration audit | core safety关闭。 |
| `CFG-T-10` | entry/job snapshot isolation and no mid-run reread | entry/job fixtures | scope isolation report | global mutation。 |
| `CFG-T-11` | change audit fields、previous candidate revalidation、compromised fix-forward | change/rollback fixtures | rollback audit report | real rollback执行结果。 |
| `CFG-T-12` | config identity drift no raw diff | safe digest fixtures | drift report | actual deployment baseline。 |

`05` 必须把这些方向追溯回 `03` flow/error/test cuts 和本 `04` section；报告不得包含 raw config、full sensitive ref、secret、provider body、stack trace或伪造 evidence alias。

### 4.3 `06-验收标准.md` 配置门禁输入

| Gate ID | 通过条件方向 | 失败/一票否决方向 | 证据类别（planned） |
|---|---|---|---|
| `CFG-A-01 Schema` | 所有 P0 section/item严格 parse/type/required | unknown/duplicate/coercion/raw secret被接受 | validation report。 |
| `CFG-A-02 No fallback` | invalid high source阻断 | 回退低优先级/default/fake继续 | source negative report。 |
| `CFG-A-03 Builder atomicity` | invalid/capability-missing不暴露entry | partial graph/facade可调用 | builder failure-injection report。 |
| `CFG-A-04 Sensitive no-output` | all surfaces无raw/full sensitive/secret-derived digest | 任一artifact泄露 | redaction scan report。 |
| `CFG-A-05 Profile isolation` | fake/deterministic仅Local/CI；P1/P2 inactive | fake进入real-like或宣称production ready | profile report。 |
| `CFG-A-06 Safety redlines` | `NC-L2T-*` override全部拒绝 | identity/audit/UoW/no-write/fail-closed可配置绕过 | forbidden override report。 |
| `CFG-A-07 External truth` | blocked/ref/endpoint不升级ready/delivered/observed | fake/health/ref关闭 blocker | blocker negative evidence。 |
| `CFG-A-08 Unknown fence` | side-effect ambiguity保持unknown/manual | generic retry或推断success/failure | phase-fence report。 |
| `CFG-A-09 Degraded no-write` | degraded只读/外围且显式 | Query/Job修truth或silent fallback | write audit report。 |
| `CFG-A-10 Change/rollback` | high变更有actor/review/digest/rollback且重验证 | live patch/skip validation/revoked rollback | config change audit。 |

这些是后续裁决规则输入，不是当前验收结论。正式 `06` 必须自行定义进入/退出、缺陷等级、evidence authority和签署，且不得签署未运行项目。

### 4.4 `07-实施计划.md` 配置实施承接

| 实施切片 | 必须读取 | planned delivery | 开工/完成门禁 |
|---|---|---|---|
| config schema/source | Step 5/7/8 | ten-root candidate decode、source attribution、safe issue mapping | 不缺item/unknown/duplicate/raw-secret处理。 |
| validation | Step 9 | V0~V8、12 cross gates、redline sweep | 仅既有typed error；无 silent field/default。 |
| runtime builder | `03` §13 + Step 9 | B0~B8、adapter/Store registry、atomic exposure | no partial entry；capability checks closed。 |
| scope wiring | Step 7/9 | API/worker/job validated snapshots | no raw config in application/domain/contracts。 |
| sensitive/diagnostic | Step 8/10/11 | typed redaction、safe audit/metric/log issue | no full ref/secret/body。 |
| tests/gates | `03` §15 + Step 12 | config suites/reports/gates planned by `05/06` | no fabricated run/evidence。 |

正式 `07` 必须按用户既定规则同步创建 implementation ledger 和全部 planned boundary skeleton，但只能在 `07` 自身 SOP/Step 装配时创建；`04` 不提前伪造这些文件或 commit。

### 4.5 `09-部署与运维手册.md` 承接

| 运维主题 | `04` 固定的设计输入 | `09` 必须补的运行事实 |
|---|---|---|
| config artifact | strict JSON、十 root、source priority | actual path/mount/ownership/permission/version baseline。 |
| env mapping | only allowlisted canonical leaves | exact env names、injection mechanism、drift check。 |
| refs/secrets | opaque ref-only、no material、provider owner分离 | chosen provider/adapter binding、access/rotation/revoke procedure。 |
| activation | new complete assembly/restart | process/deployment switch command、health/smoke、rollback trigger。 |
| profile | P0/P1/P2 semantics | environment-to-profile mapping and approved values。 |
| audit/change | safe fields/high review/previous candidate | actual approval/audit storage、retention、operator roles。 |
| failure/alert | safe event categories/fields | thresholds、route、dashboard、runbook、escalation。 |
| recovery | no online LKG、unknown manual fence | named operational resolution procedure consistent with `03`。 |

### 4.6 跨下游承接审计

| 审计项 | 结论 | 缺口/修正 |
|---|---|---|
| `05` 是否被提前写成测试报告 | 通过 | 只有planned themes/evidence classes。 |
| `06` 是否伪造验收结论/签署 | 通过 | 只有gate inputs。 |
| `07` 是否提前创建commit/ledger/boundary | 通过 | 明确留给正式07 SOP。 |
| `09` 是否在04中写部署命令/具体值 | 通过 | 只列运行事实缺口。 |
| 下游是否可重定义config contract | 通过 | 明确不可；设计变更需重开03/04。 |
| upstream blockers是否丢失 | 通过 | 进入negative/blocked gates，不作为positive evidence。 |

## 5. 对详细设计影响、回填与门禁

| 结论 | 是否影响 03 | 类型 | 状态 |
|---|---|---|---|
| 下游测试/验收/实施/运维承接矩阵 | 否 | documentation handoff | 无回写 |
| planned theme/gate IDs | 否 | downstream trace handle | 无回写 |
| future 下游发现new field/Port/error/lifecycle缺口 | 是 | design reopen trigger | 先回写03再重开04 |

正式 §12 应装配总表、测试主题、验收门禁、实施切片和运维承接，不包含真实 run_id、artifact path instance、evidence alias、commit、通过结果或签署。

| 待确认 | 未确认前处理 |
|---|---|
| 正式 `05/06/07` 的最终 ID 命名 | 以本Step theme/gate为输入，由各SOP生成。 |
| `09` 是否在本正式链范围内 | 当前仅定义future承接，不自动创建。 |
| 上游blocker何时关闭 | 继续open；对应positive tests/gates blocked。 |

| 门禁 | 状态 |
|---|---|
| 05/06/07/09承接明确 | 通过 |
| 配置契约不被下游重定义 | 通过 |
| 无伪造结果/evidence/commit/signoff | 通过 |
| 跨下游审计无unresolved | 通过 |
| 03当前无回写 | 通过 |
| 下一动作 | 连续授权下进入 Step 13 |
