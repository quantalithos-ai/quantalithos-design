# 07 Step 2：明确实施目标、范围和非范围

## Step 状态

`completed_with_explicit_blockers`

## 本步输入

| 输入 | 来源 | 用途 |
|---|---|---|
| 五 capability 与 15 个核心功能 | `00-需求文档.md` §7、§9 | 定义可验证功能增量 |
| 七技术模块与依赖方向 | `01-架构设计.md` §6~§9 | 防止按 capability 误拆服务或反转 owner |
| 28 条 non-outbound logical surface | `03-详细设计.md` §7~§8 | 绑定实现对象与当前行为上限 |
| 测试/验收分母 | `05-测试方案.md` §5~§13、`06-验收标准.md` §2~§11 | 绑定阶段门禁，不扩大分母 |
| blocker / pending | `03` §17、`05` §14、`06` §13 | 标记 positive lane 的边界 |

## SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 最小交付结果 | 能构造并验证本地 typed contract、domain guard、strict config、Query no-write、marker-only inbound、bounded Job stop 与证据脚本契约 | 03 §2/§7/§15、04 §3~§11、05 §9/§13 |
| 本轮必须覆盖什么 | `C-MI-1~C-MI-5` 的实现路径与负向上限，`F-MI-001~015` 的 planned surface，10/10/2/6/0 inventory | 00 §7/§9、03 §7 |
| 哪些功能可形成正向实现 | local pure contract、safe read、composition validation、body-free gap、bounded selection | B01/B02 与 owner blocker 之外的设计闭环 |
| 哪些功能不能宣称完成 | builder 成功、candidate/digest、gate pass、Artifact Accepted、consumer confirmation、outbound publisher、container/runtime readiness | 00 §10、03 §8/§17、06 §2/§11 |
| P1/P2 如何处理 | 作为 future/residual 或 reopen 输入，不进入 P0 完成分母 | 00 §9.2、06 §2.3 |

## 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| “实现五 capability”容易被误写成五个 crate | 依赖循环、owner 混乱 | capability 作为纵切，crate 仍按七职责单元 |
| 需求中有“构建/发布/实例化”词汇 | 可能越过 builder、Artifact、consumer 和 container owner | 只实施本仓 truth、ref、gap、local supply 与 entry seam |
| 10 Command/6 Job 看似应全量落地 | B01/B02 未闭使 mutation/replay 不可激活 | 先实现合法 shape、zero-effect、blocked mapping；positive lane 等待重开 |
| 测试方案包含 future evidence | 可能把规划 EV 写成实际报告 | 只交付脚本/报告生成能力的 planned contract，不创建实例 |

## 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 目标 | 泛化“实现镜像系统” | 实现可验证的成员镜像资产/供给本地契约 | 可追溯且不越界 |
| P0 | 容易把外部成功纳入 | 只纳入本地 truth、safe ref、gap、no-write 和 gate 工具 | 保护 owner truth |
| 完成条件 | 可能以编译或 fake 通过代替 | 以 boundary gate、evidence pair、无 blocker 作为未来条件 | 对齐 06 |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 先做全链路成功 happy path | 直观 | 需要私造 owner/schema、违反 fail-closed | 拒绝 |
| 只做静态类型、不做入口与门禁 | 风险低 | 无法交付可验证实施路径 | 拒绝 |
| 先做本地契约与安全负向纵切，再按 owner 关闭条件扩展 | 可验证、可暂停、可回退 | 正向功能要等 blocker | 采用 |

## 结构化中间产物

### 实施目标表

| 目标 ID | 目标 | 追溯 | 本轮上限 |
|---|---|---|---|
| OBJ-MI-01 | 受控 definition、mapping ref 与 body-free gap | C-MI-1 / F-MI-001~003 | 不复制 Role/mapping body |
| OBJ-MI-02 | pinned static assembly、placement 与 revision 方向 | C-MI-2 / F-MI-004~006 | 不承接 live state、secret 或 owner body |
| OBJ-MI-03 | build intent/snapshot/attempt/candidate 分层 | C-MI-3 / F-MI-007~009 | current 只允许 zero-effect/blocked |
| OBJ-MI-04 | provenance、gate、eligibility、Artifact gap 分层 | C-MI-4 / F-MI-010~012 | 不 mint digest、gate pass 或 Artifact ref |
| OBJ-MI-05 | local availability、pinned entry、consumer gap | C-MI-5 / F-MI-013~015 | 不宣称 launch/health/confirmation |
| OBJ-MI-06 | strict config、safe observability、planned evidence tooling | NFR-MI-001~022 / AC-MI-026~030 | 不生成实际 evidence/verdict |

### 实施范围表

| 范围项 | 来源 | 实施形态 | 当前资格 |
|---|---|---|---|
| 七职责 workspace | 03 §4 | planned crate/package/file skeleton | blocked until target repo |
| `contracts` typed carriers | 03 §5~§7 | local DTO/ref/reason/error | planned |
| `domain` guards/state/history helpers | 03 §5、§9~§12 | pure functions and negative tests | planned |
| `application` facade/ports/no-write flows | 03 §5、§8、§10~§13 | zero-effect/read-only/bounded orchestration | planned; mutation blocked |
| `infra` config/composition/fake seams | 03 §5、04 §3~§11 | strict startup binding and TestOnly parity | planned |
| `api`/`worker`/`jobs` logical entries | 03 §5、§7~§8 | transport-neutral mapping/markers | planned; event positive blocked |
| scripts/check/report contract | 05 §9、§13 | planned commands and path validation | not executed |

### 非范围表

| 非范围 | Owner / 后续 | 绝对禁止的替代 |
|---|---|---|
| RoleDefinition 与 mapping body | `L3-method-library` | 本地枚举、复制正文、fallback |
| runtime/tools/member/supervisor 正文与 release truth | 各 owner / `L2-member` | shadow component schema、live state |
| policy/memory/workspace seed body 与 live memory | seed owner / member-service | 把模板当 live state |
| builder/registry、digest、gate、Artifact truth | builder/Artifact/security owner | fake/ACK 伪造 candidate 或 acceptance |
| member-service manifest/consumer confirmation/container | `L2-member-service` | 把 local entry 当 launch/health |
| inbound event envelope/receipt/dedup、outbound event/outbox/publisher | Bus/Core/event owner | 创建当前不存在的 event surface |
| scheduler、lease/TTL、recovery policy、observability backend | 各 owner / 03 blocker | 实现端自行补 policy |
| production deployment、marketplace/product entry | 产品/运维 owner | 写成 P0 deliverable |

### P1/P2 防误入表

| 项 | 处置 |
|---|---|
| `F-MI-E01~E05` | future/reopen；不进入当前 P0 分母 |
| `Q-MI-001~004` | blocked/wait_design；不能当作已选 scope、产品或证据 policy |
| `MI-UP-001~009` | 只保留 ref/gap/marker/zero inventory；owner 闭合后重开受影响 Step |
| 量化性能/容量/SLO/retention | 仅规划 benchmark 输入，不写 numeric pass |

## 回填草稿

本轮实施范围是本仓 local truth、typed ref、safe conclusion、gap、projection/read-only surface、strict configuration、TestOnly fake parity、marker-only inbound、bounded Job stop 与 planned gate/report tooling。10 Command 与 6 Job 的合法 shape 可在当前范围内验证，但在 `DDD-S9-B01/B02` 关闭前不能进入 mutation、reservation、stored result 或 replay。任何跨仓 positive success、digest、Artifact acceptance、consumer confirmation、event publisher 或 readiness 均为非范围或 blocker。

## 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| 目标仓与实际 Cargo identities | PH-01 无法激活 | commit-01-a 前 |
| MI-UP-003 mapping owner contract | PH-02 正向 definition blocked | commit-02-a 前 |
| MI-UP-002/006/008 static inputs | PH-02 baseline positive blocked | commit-02-b 前 |
| Q-MI-003 / MI-UP-005 builder/event | PH-03 candidate positive blocked | commit-03-a 前 |
| Q-MI-004 / MI-UP-007 gate/Artifact | PH-04 eligibility positive blocked | commit-04-a 前 |
| MI-UP-001 consumer contract、B03 | PH-05 supply/entry positive blocked | commit-05-a 前 |

## 进入下一步条件

- [x] P0 目标与 10/10/2/6/0 逻辑库存已固定。
- [x] 非范围、future 与 blocker 的处理上限已写明。
- [x] 所有目标均可回指 00/03/05/06 编号，不新增需求。
