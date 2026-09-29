# Step 12. 定义测试、验收、实施与运维承接

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 12
> 正式回填：`04-配置设计.md` §12
> 状态：`completed / pass_with_upstream_blockers / stop_review`（连续授权下进入 Step 13）

## 1. Step 状态、输入与边界

| 项 | 结论 |
|---|---|
| 当前 Step | Step 12：测试、验收、实施与运维承接 |
| 输入 | Step 6 profile 矩阵、Step 7 配置清单、Step 8～10 安全/加载/变更规则、Step 11 失效矩阵、正式 03 §15～§17 |
| 规范 | 测试方案、验收标准、实施计划及部署与运维手册的 SOP/书写规范 |
| 输出 | 05/06/07/09 下游承接表、场景/门禁/准备/运行边界、依赖分类和禁止重复定义清单 |
| 当前事实上限 | 仅交付后续文档的设计输入；不创建用例 ID、证据 ID、run、artifact、report、verdict、risk acceptance、signoff、phase、commit 或 readiness |
| 正式顺序 | 正式 04 完成后停审；只有用户另行授权才可进入 05，随后仍按 `05 → 06 → 07` 串行 |
| 下一动作 | 同步 flow/项目台账后进入 Step 13 |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些配置场景进入测试方案？ | strict JSON 与来源冲突、required/optional slot、profile/fake 隔离、逐 source/owner/family 路由、敏感值禁止输出、cross-field、old-work pinning、candidate/rollback、local/external Unknown、telemetry non-interference，以及每个配置项的 missing/invalid/unavailable/degraded 路径。05 继续定义正式 TC/EV、数据、套件、脚本、报告和证据结构。 |
| 哪些配置门禁进入验收标准？ | raw reader 唯一性、来源优先级、required set 完整、禁止 raw secret/fake fallback/owner override、Query no-write、外部 Unknown 不升级、配置变更可审计、profile 与依赖分类一致、未关闭 blocker 不得声称 positive readiness。06 继续定义 AC/VETO、证据来源和裁决口径。 |
| 哪些配置准备进入实施计划？ | strict schema/parser、allow-listed ENV registry、typed config/ref、builder assembly、profile fixtures、adapter/store/codec/cursor/redaction/telemetry binding、配置负向测试和 planned 配置审计/迁移边界。07 再按可验证 phase/commit boundary 安排，并在其正式完成时创建 planned ledger/skeleton。 |
| 哪些细节留给部署与运维手册？ | 实际配置文件路径、ENV 名、挂载、secret provider 操作、endpoint/DSN、权限、发布与回滚命令、环境拓扑、告警阈值、Dashboard、值班、轮换和故障 runbook。它们必须引用正式 04，不得反向改变配置语义。 |
| 下游不应重复定义什么？ | key 名、类型、requiredness、来源优先级、敏感级别、生效方式、fail-closed、truth owner、source-authority、slot 分类、Query no-write、pinned identity、outbound blocker 和依赖分类均不得由 05/06/07/09 改写。 |

## 3. 当前材料诊断与设计取舍

| 发现 | 风险 | 本步裁定 |
|---|---|---|
| 旧 05/06 已存在但属于 historical material | 旧对象、provider、保留期和成功条件可能覆盖新版配置设计 | 后续正式 05/06 必须 full-restart；这里只给输入，不复用旧结论 |
| 测试规范要求 TC/EV/artifact/report | 当前未执行测试，提前编号会形成静态假证据 | Step 12 只给测试切口族；正式 05 才建立稳定 ID 和输出路径 |
| 验收规范要求 verdict/risk acceptance/signoff | 配置文档若预填会越过正式 06 | 只列候选 gate 主题和 VETO 方向，不给 verdict 或接受人 |
| 实施规范要求 phase/commit/ledger/skeleton | 正式 04 还未完成，无法形成最终依赖闭包 | 仅给配置实施对象与前置；正式 07 才创建全部 planned boundary |
| 运维需要实际值、路径和产品 | provider/workload/secret authority 尚未闭合 | 保留明确 handoff；未闭合前 fail-closed，不用 placeholder 冒充可部署值 |

## 4. 下游总承接表

| 下游文档 | 承接内容 | 本文提供的输入 | 下游必须继续回答 | 当前禁止 |
|---|---|---|---|---|
| `05-测试方案.md` | 配置切口、profile/依赖环境、negative/partial/unknown 场景 | 12 配置域、来源/校验/生效/失效矩阵、03 测试切口 | TC/EV、数据、suite/gate、fake/real-like 拓扑、报告与退出准则 | 不得伪造 positive external fixture、run、evidence 或把 fake 当真实集成 |
| `06-验收标准.md` | 配置基线、红线、VETO 方向、证据边界 | required/conditional 规则、fail-closed、敏感/owner/依赖边界 | AC/VETO、通过/失败条件、真实 evidence 引用、风险接受/签署 | 不得以 assembly `Ready`、ACK、日志或配置存在判 product ready |
| `07-实施计划.md` | schema/reader/builder/binding/测试的落地顺序和前置 | planned 模块、配置分类、profile、blocker/暂停条件 | phase、commit boundary、allowed scope/checks、ledger/skeleton、目标仓事实检查 | 不得创建未授权 provider、默认值、secret、实现/测试事实 |
| `09-部署与运维手册.md`（未来） | 实际环境、配置基线、发布/回滚、secret/告警/runbook | key/来源/敏感/生效/回滚/失效的正式语义 | 路径、ENV 映射、注入、权限、轮换、监控阈值、操作与证据位置 | 不得用运维 override 改 truth owner、required set、UoW、Query no-write 或治理决定 |

## 5. `05-测试方案.md` 的配置输入矩阵

| 测试切口族 | Profile/依赖 | 必须覆盖的配置行为 | 关键反断言 | 证据上限 |
|---|---|---|---|---|
| strict source/schema | `local-dev`/`ci-test` | missing file、strict JSON、duplicate/unknown/alias、`DECL < JSON < ENV`、非法 winner | 不回退低优先级、不部分装配 | planned TC/EV；本步无执行结果 |
| type/range/cross-field | `ci-test` | finite enum/ref、positive bound、profile/slot/source/owner/cursor/budget/redaction 组合 | null/zero/冲突不默许 | 由正式 05 定义 suite/report |
| runtime assembly | `ci-test`/`integration-like` | 11 类 exact slot、frozen required set、missing/mismatch/Degraded/Disabled、marker/handle | 无 required facade、无 production fake fallback | fake 只证明本地 contract |
| source-authority | `integration-like` | 8 SourceClass exact route、fence/coverage、partial/stale/missing/conflicting | workspace/observability 不补 canonical | positive owner 合同仍受 `AR-UP-001/006~008` 阻塞 |
| integrity/storage/governance | `integration-like` | unknown/unsupported/integrity-failed、no dispatch、decision/schedule 分离、commit unknown | 不造 digest/key/commit/retention/delete | positive 受 `AR-UP-003~005` 阻塞 |
| restore/inbound | `ci-test`/`integration-like` | per-owner totality、schema conflict、quarantine/ACK、partial/compensation | 无 all-owner fallback、Bundle 不写 owner DB | positive 受 `AR-UP-009` 阻塞 |
| operation/cursor | `ci-test`/`operations-replay` | same/same、same/different、codec/mapping mismatch、restart/pinned identity | 不借 Bundle digest、不回传 private cursor | positive durability 受本地 pending 阻塞 |
| sensitive/redaction | 全 P0 profile | raw secret/body/ref canary、error/log/report/metric/span/audit default-deny | 敏感值零泄露；hash 不绕过 | 真实 provider 未闭合，不造 secret evidence |
| change/rollback | `ci-test`/`operations-replay` | candidate reject、review posture、新 assembly、old-work pinning、external Unknown | 不 hot swap、不删除历史、不盲重派 | 不假设工单或部署产品 |
| telemetry non-interference | `ci-test`/`integration-like` | sink unavailable、redaction failure、material handoff blocked | 业务 UoW/result 不变；Query 零写 | telemetry 不等 evidence/readiness |

正式 05 必须把 compile/runtime/event/ref/adapter/fake 关系放入环境矩阵：只有已核验 Core shared contract 可测试 compile 关系；L1/workspace/artifact/observability/storage/receiver 只能通过 runtime/ref/adapter/fake 或获准 event seam，不能用 sibling path dependency 替代。

## 6. `06-验收标准.md` 的配置门禁输入

| 门禁主题 | 通过条件输入 | 失败/VETO 方向 | 必须引用的未来证据 |
|---|---|---|---|
| 配置来源与 schema | 仅 strict JSON + allow-listed ENV；冲突/未知/非法值可判定 | 接受 alias/duplicate/unknown 或非法 winner fallback | 正式 05 的 parser/source TC/EV |
| reader/builder 隔离 | raw 只由 infra config 读取；builder 消费 validated value | domain/application/api/worker 直接读 raw config/secret | static/contract/assembly 证据 |
| exact assembly | required set 冻结且每项真实 handle 可判定 | missing/mismatch/Degraded/required Disabled 仍暴露 facade | required-slot matrix 证据 |
| truth/security redline | workspace 不升格、Archive 不决定 owner/governance truth、secret 零泄露 | 任一配置绕过 owner、visibility、redaction、UoW、restore boundary | source/redaction/negative evidence |
| failure posture | Blocked/Partial/Unknown/Unsupported/CommitUnknown 不升级 | silent fallback、blind retry、fake success、ACK=commit | failure/reconcile evidence |
| change/rollback | high/critical 有评审/审计；旧 work pinned | hot swap、删除历史、用当前配置重建旧 effect | change/replay evidence |
| profile/dependency | test fake 不进 production；runtime/event/ref 不冒充 compile | SDK/server 反向依赖、生产 fake、未批准 provider | dependency/profile scan evidence |
| blocker/readiness | 未关闭 external/local pending 只允许对应负向门禁 | 用配置存在、assembly Ready、日志/metric 声称产品就绪 | blocker closure proof + formal evidence |

本表不是 AC/VETO 正式编号，也没有任何验收结论。正式 06 只能在正式 05 的真实证据结构完成后建立裁决项，风险接受归正式 owner，不由 Archive 配置文档预先授予。

## 7. `07-实施计划.md` 的配置准备输入

| 实施对象族 | 前置阅读/输入 | 最小 planned 输出 | 必须暂停条件 |
|---|---|---|---|
| strict schema/source collector | 正式 04 §4～§9 | schema、one-file parser、ENV allow-list、redacted issue surface | key/type/source 与正式 04 冲突 |
| typed config/runtime builder | 正式 03 §5/§13 + 正式 04 §3/§7/§9 | typed refs/parameters、exact slot inspection、capability-limited facade | 需要新 struct/trait/error/flow 而 03 无定义 |
| profile/test lane | 正式 04 §6/§8/§11 + 正式 05 | deterministic test assembly、fake isolation、negative fixtures | fake 将进入 production 或未经正式 TC/EV |
| store/codec/cursor binding | 正式 03 §10～§13 + 正式 04 §7/§11/§14 | fail-closed seam 与 contract tests；positive 仅在 binding closure 后 | local pending/driver/codec 未关闭却写默认实现 |
| external adapters | owner 正式合同 + 正式 03/04/05/06 | 每个 exact target 的 adapter/negative mapping | `AR-UP-*` 未有 exact closure proof |
| change/redaction/telemetry | 正式 03 §14 + 正式 04 §8/§10/§11 | safe audit/telemetry hooks、new-assembly change path | 新 durable audit object、hot reload 或 provider API 未回写设计 |

正式 07 必须重新核验目标仓路径、Git、toolchain、Core contracts 和用户改动；按可验证功能增量定义 phase/commit boundary，并同时创建初始仅为 `planned/blocked/waiting` 的 `implementation_execution_ledger.md` 和全部 planned boundary skeleton。本 Step 不创建这些文件。

## 8. `09-部署与运维手册.md` 的运行输入

| 运维主题 | 正式 04 固定输入 | 09 继续补齐 | 未闭合前姿态 |
|---|---|---|---|
| 配置基线 | strict JSON、schema/config revision、profile、来源优先级 | 实际文件位置、ENV 映射、版本/发布记录 | 无可验证基线不得启动/切换 |
| secret/binding | opaque ref、禁止输出、new assembly 轮换 | provider、挂载/权限、轮换和应急操作 | raw secret 禁止；provider unavailable→Blocked |
| external dependencies | exact slot、owner/target/family、依赖分类 | endpoint/topology/health check/责任方 | 合同/配置缺失不启用 positive surface |
| deployment/rollback | candidate/new assembly、pinned old work | 发布命令、顺序、验证、回滚命令和窗口 | 不 hot swap、不删除历史、不替代 probe |
| telemetry/alert | safe fields、sink non-interference、native audit 分层 | sink、dashboard、threshold、pager/runbook、retention | sink 失败可 degraded；不声称 evidence complete |
| capacity/continuity | typed budgets 无默认 | workload、容量、RTO/RPO、测量法、演练 | `AR-HLD-Q-002` 前无数字/readiness |

## 9. 下游禁止重复定义清单

- 不得重命名 Step 7 的 12 个配置域或为本地 key 强制增加重复 `archive.` 前缀；系统聚合映射必须单独说明。
- 不得添加 remote config center、admin/CLI override、hot reload、online LKG、动态 adapter replacement 或 outbound publisher 配置。
- 不得把 L1/workspace/artifact/observability/storage/receiver 运行关系写成 Cargo/package dependency；SDK 不进入 Archive server graph。
- 不得让测试 fixture、job payload、event body、provider response或运维命令覆盖正式配置来源。
- 不得填入未经 authority 的 provider、algorithm、key、digest、retention、batch/page/lease/retry/RTO/RPO 数值。
- 不得让 `Ready`、测试通过、配置发布、sink ACK 或日志存在升级为 Bundle/restore/owner/产品 readiness。
- 不得由 05/06/07/09 反写 identity、conversation、work、process、governance、artifact、workspace 或 observability truth。

## 10. 对 `03-详细设计.md` 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 05/06/07/09 只承接已定义的配置语义，不得改写代码/owner 契约 | 否 | 跨文档边界 | 不适用 | 无回写 |
| 正式 07 才定义 phase/commit/ledger/skeleton，当前不提前生成 | 否 | 实施门禁 | 不适用 | 无回写 |
| 未来下游若要求新 field/port/error/DTO/flow、hot reload 或 durable audit object | 是（未来触发） | 代码契约变化 | 03 对应 Step/章节 | 无回写（触发前暂停） |

## 11. 回填草稿与进入下一步条件

正式 §12 应回填下游总承接表、05 测试输入、06 门禁输入、07 配置准备、09 运维输入及禁止重复定义清单。过程诊断、未来 ID 和未执行事实不进入正式正文。

| 条件 | 状态 |
|---|---|
| 05/06/07/09 各自承接内容与禁止项明确 | 通过 |
| 配置场景、门禁、实施准备和运维细节均可定位 | 通过 |
| 依赖类型、fake/real-like 与 evidence 边界未混淆 | 通过 |
| 未生成 TC/EV/AC/VETO/run/report/verdict/phase/commit 等事实 | 通过 |
| 当前无 03 待回写或阻塞待确认项 | 通过；future contract change 为触发器 |
| 可进入 Step 13 | 通过 |
