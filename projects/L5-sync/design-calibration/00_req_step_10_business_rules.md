# 00 需求 Step 10 · 业务规则与边界约束

> 状态：`completed`
> 前置：`00_req_step_02_scope_boundary.md`、`00_req_step_07_core_capability_loop.md`、`00_req_step_09_functional_requirements.md`
> 回填章节：正式 `00` §10

## 1. 规则类型

本步按“不变量、禁止行为、显式变化、边界/治理约束”组织规则；规则只保护已定义能力和功能，不进入实现校验、协议字段或对象 schema。

## 2. 规则表

| ID | 类型 | 规则 | 保护的功能/能力 |
|---|---|---|---|
| `BR-SYNC-001` | 不变量 | 每次操作必须绑定明确 principal、project、version/source、target 和 operation；缺失时不得继续。 | `FR-SYNC-001~002` / `CP-SYNC-01` |
| `BR-SYNC-002` | 禁止行为 | 不得以 `latest`、默认分支、目录最新文件、Git remote 或旧缓存猜测 project/version/source。 | `FR-SYNC-001` |
| `BR-SYNC-003` | 边界约束 | 权限、项目姿态、来源可见性和允许动作必须来自正式 owner；Sync 不得本地 default allow。 | `FR-SYNC-002` |
| `BR-SYNC-004` | 禁止行为 | owner 结论 unknown、stale、revoked、archived、dissolved、conflicting 或 unsupported 时，不得产生危险 materialization/handoff 副作用。 | `FR-SYNC-002/011` |
| `BR-SYNC-005` | 不变量 | working-copy binding 必须能回指 source/version/target/generation/provenance；不明 binding 不能被静默重用。 | `FR-SYNC-003~004` |
| `BR-SYNC-006` | 禁止行为 | 不得覆盖用户未提交、未跟踪或无法解释的本地修改；不得自动 stash、merge 或 rebase 作为保护替代。 | `FR-SYNC-006~007` |
| `BR-SYNC-007` | 显式变化 | metadata 初始化、迁移、重绑、失效和修复必须是可解释的受控变化；不得静默删除或伪造 provenance。 | `FR-SYNC-003~004/011~012` |
| `BR-SYNC-008` | 不变量 | platform source cursor、local applied cursor、Git HEAD/commit、working-tree state、handoff transport 和 Review decision 必须语义分离。 | `FR-SYNC-005~010` |
| `BR-SYNC-009` | 禁止行为 | status/query 只能观察已保存状态和正式只读结果，不得隐式 refresh、推进 cursor、修复冲突或改变上游状态。 | `FR-SYNC-005` |
| `BR-SYNC-010` | 边界约束 | 无可验证版本 comparator、增量 cursor、mapping 或 gap/replay 语义时，pull/增量 materialize 必须 blocked/needs-action。 | `FR-SYNC-006` |
| `BR-SYNC-011` | 不变量 | 冲突必须保留来源、路径/映射、检测依据、影响和恢复关联，并等待人工或正式 owner 决策。 | `FR-SYNC-007~008` |
| `BR-SYNC-012` | 禁止行为 | Sync 不得自动 merge、rebase、push、强制覆盖、删除冲突证据或把“无冲突”推断为 review accepted。 | `FR-SYNC-007/009~010` |
| `BR-SYNC-013` | 显式变化 | 可能有外部副作用的调用遵循 prepare→call→probe/finalize；unknown outcome 先探测再决定安全重试。 | `FR-SYNC-008~010` |
| `BR-SYNC-014` | 不变量 | 等价输入的重复操作必须可解释、可回链并保持幂等；无法证明等价时不得自动重放。 | `FR-SYNC-008~010` |
| `BR-SYNC-015` | 边界约束 | `push-review` 只能提交候选 handoff；本地 commit、上传 ACK、远端对象存在、HTTP 200 或 transport 成功都不等于 Artifact/Baseline/accepted/approved/signoff。 | `FR-SYNC-009~010` |
| `BR-SYNC-016` | 禁止行为 | 不得绕过 Review Gate、直接写主分支、修改 Governance decision 或以 Sync 产生 verdict。 | `FR-SYNC-009~010` |
| `BR-SYNC-017` | 不变量 | 归档/撤销/来源失效优先于本地缓存和旧 status；重新验证失败时 fail-closed。 | `FR-SYNC-011` |
| `BR-SYNC-018` | 边界约束 | provenance、source ref、工具/路径关联和恢复历史不得被伪造、静默抹除或与另一 source 无记录重绑定。 | `FR-SYNC-003/008/012` |
| `BR-SYNC-019` | 禁止行为 | 不得保存或输出 Artifact/Workspace/Review/Archive/Git raw 正文、credential、token、私钥或敏感 provenance 内容。 | `FR-SYNC-004/012` |
| `BR-SYNC-020` | 边界约束 | Git/filesystem adapter 仅执行显式白名单的观察、锁、路径保护和原子 materialize；remote truth 不归 Sync。 | `FR-SYNC-005~006` |
| `BR-SYNC-021` | 不变量 | local session/status/conflict/recovery 只描述一次本地同步操作，不得冒充 Project、Artifact、Review、Workspace 或 Archive 生命周期。 | 全部核心功能 |
| `BR-SYNC-022` | 边界约束 | 诊断、telemetry、handoff receipt 和 cache 状态不得单独证明同步成功、Review accepted、evidence、report 或 readiness。 | `FR-SYNC-010/012` |
| `BR-SYNC-023` | 禁止行为 | 不得通过共享数据库、内部表、任意 bus topic、私有 SDK/remote endpoint 或跨仓事务绕过正式 seam。 | `FR-SYNC-001~012` |
| `BR-SYNC-024` | 显式变化 | 用户冲突决定、继续 materialize、重新绑定或提交 handoff 必须可见并形成新的本地关联；后台任务不得隐式代行。 | `FR-SYNC-006~011` |
| `BR-SYNC-025` | 边界约束 | LFS、浅克隆、GUI/Tauri、批量预取等待核验能力不得改变核心安全门禁或被宣称已支持。 | 外围功能 |

## 3. 规则与功能映射审计

| 检查项 | 结果 |
|---|---|
| 每条规则是否至少保护一项功能/能力 | pass |
| 是否覆盖 owner、权限、版本、dirty-state、冲突、恢复、handoff、provenance 和禁止项 | pass |
| 是否存在把接口/字段/实现写成规则的条目 | 否 |
| 是否有规则自行创建上游 truth | 否；规则只要求消费 owner 结论并 fail-closed |
| 是否把历史技术候选变成硬规则 | 否；`BR-SYNC-025` 明确 pending |

## 4. 取舍与回填草稿

正式 §10 回填 25 条需求级规则，按不变量、禁止行为、显式变化、边界/治理约束呈现；具体状态机、错误码、schema 和 port 规则后置。

## 5. 自检与门禁

- [x] 规则均可回指 Step 2/7/9 的边界、能力或功能。
- [x] 自动 merge/rebase/push、ACK-as-accept、dirty 覆盖和 provenance 伪造均明确禁止。
- [x] 未滑入 API、实现、数据库或测试细节。
- [x] 上游 blocker 未被规则伪关闭。

`Step 10 gate_status = pass_with_blockers`；允许进入 Step 11。
