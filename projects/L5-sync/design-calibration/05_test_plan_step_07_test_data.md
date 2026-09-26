# Step 7. 设计测试数据

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 7。
> 回填章节：未来正式 `05-测试方案.md` §7。
> 本步定义数据类别、生成约束和最小 fixture contract；不创建真实 fixture、credential、provider payload、artifact 或 report。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 7 / test_data |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 直接下一步 | Step 8：设计测试环境与配置矩阵 |
| 持续 blocker | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` |

## 2. 本步输入与安全边界

- Step 6 的用例字段模板和 VETO/redaction 断言。
- 03 的对象字段来源、typed ref、version/generation/cursor/mapping/provenance 约束。
- 04 的 42 leaf、4 P0 profile、strict JSON、sensitive ref-only 与 no-output 规则。
- 测试数据只允许 synthetic/deterministic/opaque ref；不能把真实 Project/Artifact/Workspace/Review/Git 内容拷贝进仓。

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 数据如何保证可重复？ | 设计 deterministic seed、固定逻辑时钟、`IdPort`/`DigestPort` controlled implementation 和显式 generation/version；不依赖 wall-clock/random/default branch。 |
| 哪些数据可以持久化到 fixture？ | typed refs、短 token 化的 path/ref、状态/版本、safe summary、digest、synthetic change descriptors；不持久化正文、secret、credential、完整 path 或 provider body。 |
| 如何覆盖 partial/unknown？ | 使用 typed port result/disposition、fault plan 和 commit ambiguity marker；不伪造 network response 或把 unknown 改 known。 |
| 如何生成 dirty/path/conflict？ | controlled `WorkingCopyObservation` 与 `PathChangeSet` 数据模型表达 dirty/untracked/symlink/root escape/rename/delete；真实 filesystem positive 依赖仍 blocked。 |
| 如何覆盖 external owner？ | 只提供 contract-shaped opaque refs、freshness/posture/access result 和 unavailable/unknown variants；owner 正向 DTO 未闭合前不得手写。 |

## 3A. 旧材料诊断与改动前后对比

| 维度 | 旧材料 | 当前数据方案 |
|---|---|---|
| 数据来源 | 可能复用真实项目/正文/Git 输出 | deterministic synthetic ref、summary、digest、fault plan |
| 时间/ID | wall-clock/random/default | 注入 `ClockPort`/`IdPort`/`DigestPort` |
| 外部响应 | 手写成功 payload | typed unavailable/unknown/failure；positive contract 未闭合不伪造 |
| 清理 | 删除历史或覆盖结果 | namespace 隔离，provenance/history 只追加/保护 |

## 3B. 测试设计取舍

1. 数据工厂优先支持安全边界和重放确定性，不追求真实业务正文逼真度。
2. path/content 只用 token/digest/descriptor；这样可测试 dirty/rename/delete/redaction，同时不泄露敏感内容。
3. physical metadata、真实 Git/fs、owner/provider payload 留作 blocker 关闭后的数据扩展，不在 05 预填。

## 4. 数据分类矩阵

| 数据集 | 内容 | 生成方式 | 允许落盘 | 主要用例 |
|---|---|---|---|---|
| `D-SYNC-SEL` selection/access | synthetic principal/project/version/source/target refs、operation、eligibility/freshness | deterministic factory | 允许 safe refs | CP1、CMD-001/003/009、QRY-001 |
| `D-SYNC-META` metadata | generation、manifest summary、cursor/mapping keys、provenance chain IDs、integrity states | logical store builder | 允许摘要和 digest；不锁 physical schema | CMD-002/003、QRY-003/004、JOB-001 |
| `D-SYNC-DELTA` source delta | source version token、ordered change descriptors、comparator result、gap marker | synthetic comparator input | 允许 descriptor；不含正文 | CMD-001/004、QRY-006 |
| `D-SYNC-PATH` path safety | canonical relative path token、rename/delete collision、dirty/untracked/symlink/root escape flags | path policy generator | 允许 tokenized path | CMD-001/004、QRY-005、VETO-001 |
| `D-SYNC-CONFLICT` conflict/recovery | conflict facts、scope token、checkpoint fingerprint、manual resolution intent、probe identity | deterministic state fixture | 允许 refs/summary；不含内容 | CMD-005~008、QRY-007/009 |
| `D-SYNC-HANDOFF` review | candidate digest/scope/generation、attempt/transport/probe/Decision refs/status | layered fake contract | 允许 opaque refs和disposition | CMD-009/010、QRY-011/012、CONS-003 |
| `D-SYNC-CONFIG` config | strict JSON variants、source precedence、duplicate/alias/unknown/forbidden leaf、profile | parser input builder | 允许 synthetic config；secret 仅 ref | CONFIG-001、profile gates |
| `D-SYNC-FAULT` fault plan | unavailable/timeout/malformed/commit-unknown/version-race/sink-failure | typed fault injector | 允许 fault name/parameters；不含真实 response | all flow/fault suites |
| `D-SYNC-REDACT` canary | sentinel strings for secret/body/path/stdout/stderr/provider response | deterministic canary | 仅 hashed/synthetic sentinel，输出检查后不进入 evidence | PROTO-004、REDACT-001 |

## 5. 数据不变量与关系

| 关系 | 数据规则 | 负向数据 |
|---|---|---|
| selection→binding | project/version/source/target/generation/provenance context 一致 | missing ref、cross-kind ref、generation drift |
| binding→manifest/cursor/mapping | same runtime binding snapshot、same generation；old history retained | dangling mapping、wrong generation、cursor from another source |
| delta→plan/run | delta comparator/gap 和 path safety 固定进 plan；run 只能消费一次 | out-of-order、gap、plan digest mismatch、second consume |
| conflict→resolution/checkpoint | conflict fact、human intent、checkpoint fingerprint 分层 | system actor、scope escape、stale/closed conflict |
| candidate→attempt | frozen candidate digest/scope/generation；attempt prepared before call | candidate mutated after freeze、attempt without candidate |
| attempt→probe/Decision | exact external ref/attempt identity；transport/Decision/probe separate | ACK as accepted、probe wrong attempt、missing prior attempt |
| config→capability snapshot | profile and leaf digest fixed at operation start | hot replacement、fallback on invalid high-risk value |

## 6. 敏感数据与红线

1. secret/token/private key/credential 只用 `secretRef: synthetic://...`，永不写明文。
2. provider body、文件正文、完整 diff、真实绝对路径、Git stdout/stderr 只以 digest/length/safe category 代替。
3. 真实项目、真实用户、真实 remote URL、真实 review link 不进入 fixture、日志、报告或计划 evidence。
4. canary 必须可检测；测试数据清理/失败报告也不得回显原值。
5. 数据工厂不能通过默认/latest/当前目录推断 selection 或 version。

## 7. 数据生成与隔离策略

| 策略 | 设计要求 |
|---|---|
| deterministic seed | 每个 suite/案例显式 seed；seed 本身不含业务标识或 secret。 |
| logical clock | 所有时间通过 `ClockPort` 注入；构造 stale/expiry/ordering，不依赖系统时间。 |
| ID/digest | `IdPort`、`DigestPort` 返回可重复 synthetic 值；digest mismatch 是独立变体。 |
| store isolation | 每个案例使用隔离 logical namespace；exact replay 读取 stored carrier，不共享 mutable cache。 |
| path isolation | 使用 tokenized relative path；root/symlink escape 以 policy descriptor 表达；真实 FS 仅 P1 blocked seam。 |
| external isolation | SDK/Git/fs/review adapter 只能被 controlled fake/availability fixture 注入；禁止 private endpoint。 |
| cleanup | 不删除 provenance/history 作为 cleanup；清理只作用于测试 namespace，不伪造业务删除。 |

## 8. 数据与 blocker 关系

| blocker | 受影响数据 | 当前数据策略 |
|---|---|---|
| `SYNC-UP-001~005/008` | owner/source/handoff/probe DTO、access/posture、comparator | contract-shaped refs/result variants；positive data `blocked/waiting` |
| `SYNC-UP-006` | physical `.qs-sync` records/migration/crash | logical metadata builder；不定义物理行/文件 fixture |
| `SYNC-UP-007/009/010` | Git remote/LFS/shallow/GUI/dirty/fs real result | observation/path descriptor 和 fault plan；真实 tool fixture blocked |
| `SYNC-LOCAL-001~005` | package/parser/validator/runner/Git library | data schema semantic only；不生成 package/lock/test script |

## 9. 回填草稿（未来正式 §7）

测试数据采用 deterministic synthetic refs、logical metadata、safe change descriptors、fault plans 和 redaction canaries。每个 dataset 明确关系、不变量、敏感边界和 blocker；真实 owner/provider/Git/filesystem 内容不进入仓。测试数据只支持验证 local contract、状态、幂等、恢复和输出安全，不制造 Artifact、Baseline、Review accepted 或正式 evidence。

## 10. 待确认事项

| 事项 | 处理 |
|---|---|
| 真实 SDK DTO / source version | 合同确认前不写 payload fixture。 |
| physical metadata schema | 由 `SYNC-UP-006` 关闭后再定义 migration/crash fixture。 |
| test framework fixture API | 由 `SYNC-LOCAL-004` 确认；当前仅数据类别与字段语义。 |
| performance dataset size | 等权威 workload；不填固定容量/延迟数字。 |

## 11. Step 自检与进入下一步门禁

| 检查项 | 结果 |
|---|---|
| 所有核心用例有最小数据类别 | pass |
| 敏感值、正文、credential 和真实路径均被排除 | pass |
| unknown/partial/commit ambiguity 有 typed 数据设计 | pass |
| 未创建实际 fixture 或 artifact | pass |
| 允许进入 Step 8 | pass |

## 12. 下一步门禁

Step 8 必须把数据类别映射到 `04` 的 4 个 P0 profile、启动/冷加载、job-run-start、entry-local 和 test harness 作用域，并显式列出 blocked/waiting 环境，不得写成已部署环境。
