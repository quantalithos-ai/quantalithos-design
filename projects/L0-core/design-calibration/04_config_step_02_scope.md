# Step 2. 明确配置设计目标、范围和非范围

> 本文件是 `projects/L0-core/04-配置设计.md` 的 Step 2 中间产物。
> 本步只定义本轮配置设计要覆盖哪些配置控制面、不覆盖哪些细节,并给出 P0 / P1 / P2 口径。
> 本步不创建正式 `04-配置设计.md`,不新增 `CoreRuntimeConfig` 字段,不改变 runtime builder、adapter、trait 或 error 契约。

---

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 2
- 回填章节：`projects/L0-core/04-配置设计.md` §2 本次配置设计目标与范围

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 1 输入映射 | `00/01/02/03` 为主输入,`05/06` 为下游参考 | 固定本轮范围只承接已收稳上游,不把旧测试验收口径写成配置事实 |
| `00-需求文档.md` §4 / §10 / §12 | 本仓不承担事件投递、SDK 高层配置、认证封装、重试和运行时调度 | 定义配置设计非范围 |
| `01-架构设计.md` §3 / §12 | 不设计 bus runtime、SDK 客户端、认证授权;配置与变更控制不能绕开架构边界 | 定义禁止把架构红线配置化 |
| `02-概要设计.md` §5 / §6 / §8 | 支撑接缝包括 repository、audit、outbox、gate、reference resolver、event publisher、clock、id、unit of work | 定义哪些控制面需要配置承接 |
| `03-详细设计.md` §2 / §13 / §17 | 配置文件 schema、env、CLI flag 留给配置设计;已有配置引用表和外部依赖绑定表 | 固定 P0 必须覆盖的配置项和非范围 |

已确认结论:

```text
P0 只覆盖让 L0-core 本地 CLI / job 主链可运行、可测试、可验收的配置控制面。
P0 不要求真实生产部署、在线配置中心、完整 KMS/Vault、真实 L0-bus runtime 或 SDK 高层配置体验。
本步只定义范围,不改变 03-详细设计中的代码契约。
```

---

## 3. SOP 问题回答

1. P0 必须定义哪些配置才能运行主链?

   回答：P0 必须定义 03 已经列出的 runtime config 输入和它们的来源、默认值、优先级、校验和失败策略,包括 `contract_source_root`、`release_snapshot_root`、`projection_index_root`、`audit_root`、`outbox_root`、`idempotency_root`、`reference_resolver_config`。同时 P0 必须覆盖这些配置如何进入 `build_cli_runtime(CoreRuntimeConfig config)` 与 `build_job_runtime(CoreRuntimeConfig config)`,以及文件型 store、gate / reference / blob adapter、event publisher 边界、toolchain runner、clock、id generator、unit of work 的最小配置口径。这里的“覆盖”是配置设计覆盖,不是新增 03 的代码字段。

2. 哪些配置属于 P1 / P2 或后续扩展?

   回答：P1 包括真实 L0-bus publisher 连接参数、真实 toolchain runner 二进制路径 / 参数 / 超时、reference resolver 更细的 allow-list、release-like profile、staging / prod 模板和 drift 检查。P2 包括在线配置中心、admin override、热更新、tenant / region 差异、KMS / Vault 轮换自动化、跨环境配置同步和配置治理 UI。P1/P2 可以在 04 中作为演进范围说明,但不得成为 P0 实施前置。

3. 哪些配置细节应留给部署与运维手册?

   回答：具体环境文件位置、容器挂载、KMS / Vault 接入命令、service account、运行时 secret 注入方式、告警规则、值班处置、回滚命令、生产发布 runbook、真实主机路径和平台操作应留给部署与运维手册。配置设计只定义这些事项的语义边界、输入形态、失败策略和审计要求。

4. 哪些配置细节应留给实施计划?

   回答：具体开发顺序、配置解析库选型落地、代码文件创建顺序、测试任务拆分、fake / real-like adapter 的实现节奏、git 提交流程、CI 接入顺序、第一次默认配置模板如何生成,应留给 `07-实施计划.md`。配置设计提供规则和矩阵,实施计划安排如何编码和交付。

5. 哪些非范围仍有残余风险?

   回答：真实 toolchain runner、真实 L0-bus publisher、reference resolver allow-list 和敏感配置处理如果长期停留在 P1/P2,可能导致 P0 只能完成本地 / CI 验证,无法进入真实集成环境。`05/06` 当前仍有旧口径,如果不校准,测试和验收会引用错误配置矩阵。这些风险需要进入后续 Step 12 / Step 14。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `projects/L0-core/04-配置设计.md` | 尚未存在 §2 | 无法明确哪些配置要在本轮设计内解决 |
| `03-详细设计.md` §13 | 标注“待补（配置设计文档）”,但没有区分 P0 / P1 / P2 | 实施者可能把真实 bus、toolchain、部署参数都误认为 P0 必需 |
| `01-架构设计.md` §12 | “配置与变更控制”是边界原则,不是配置清单 | 需要在 04 中转成可执行范围和非范围 |
| 当前 `05/06` | 测试和验收仍未按新版 L0-core 主线校准 | 不能倒推配置设计范围 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| P0 范围 | 只有 03 的配置引用表,没有范围分级 | P0 只覆盖本地 CLI / job 主链、文件型 store、reference resolver、安全失败策略和最小 adapter 绑定 | 防止 P0 被真实部署和全量外部集成拖慢 |
| P1 / P2 | 未明确 | P1 承接真实外部集成和 release-like profile;P2 承接在线配置中心、热更新、tenant / region 和治理 UI | 让后续演进可见,但不阻塞 P0 |
| 非范围 | 散落在 00/01/03 | 集中列出部署命令、SDK 高层配置、认证授权、bus runtime、运维 runbook 等非范围 | 防止配置设计越界 |
| 03 回写关系 | 未在范围步骤判断 | 本步明确不改变 03 代码契约 | 保持 04 与 03 的边界清晰 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：P0 覆盖所有真实环境配置和外部集成参数 | 一次性完整 | 会把 bus、toolchain、KMS、部署运维都压到 P0,超出当前 L0-core 主线 | 不采用 |
| 方案 B：P0 覆盖运行主链和测试验收必需配置,P1/P2 承接真实集成和治理能力 | 主线可开发,边界清晰,后续扩展有位置 | 真实生产部署细节需要后续文档继续细化 | 采用 |
| 方案 C：配置设计只写 03 已有字段,其余全部交给实施 | 最快 | 来源优先级、环境矩阵、敏感配置和失效策略会在实现中漂移 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 配置设计目标表

| 目标 | 说明 | 交付给下游的结果 |
|---|---|---|
| 收稳 P0 runtime 配置控制面 | 让 CLI / job runtime 能通过统一 `CoreRuntimeConfig` 装配 | `05-测试方案.md` 可据此构造 local / CI 配置矩阵 |
| 收稳文件型 state / asset root | 明确 source、snapshot、projection、audit、outbox、idempotency 的 root 配置语义 | 实施者可实现默认目录、校验和失败策略 |
| 收稳外部依赖最小配置边界 | 明确 reference、gate、blob、event publisher、toolchain runner 的 P0 / P1 差异 | 详细设计已有 port / adapter 不被配置层误改 |
| 收稳配置来源和优先级 | 后续 Step 定义 defaults / file / env / CLI flag / secret ref 的覆盖关系 | 测试和验收可以验证冲突与缺失场景 |
| 收稳禁止配置化边界 | 明确配置不能绕过审计、门禁、append-only、兼容性和数据所有权 | 避免用配置破坏 00/01 已确认红线 |

### 7.2 P0 / P1 / P2 范围表

| 优先级 | 配置范围 | 是否进入本轮正式 04 | 说明 |
|---|---|---|---|
| P0 | 03 已列出的 7 个 runtime config 输入 | 是 | 必须覆盖名称、类型、默认值、来源、作用域、生效方式、失败策略 |
| P0 | config source / priority / conflict handling | 是 | 必须让实现者知道 file / env / CLI flag / defaults 如何合并 |
| P0 | local / CI / release-like / operations replay 的最小 profile 口径 | 是 | profile 是配置矩阵分类,本步不新增 `CoreRuntimeConfig.runtime_profile` 字段 |
| P0 | gate / reference / blob 的 fail closed 语义 | 是 | 承接 03 外部依赖绑定,不改变 trait |
| P0 | outbox relay 与 event publisher 边界配置 | 是 | 只定义边界和失败策略,不实现 L0-bus runtime |
| P0 | fake / local toolchain runner 配置边界 | 是 | 支撑本地和 CI 测试,真实命令参数后置 |
| P1 | 真实 L0-bus publisher 连接、认证、重试参数 | 作为待扩展说明 | 真实投递属于 L0-bus / 部署运维,04 只保留边界 |
| P1 | 真实 toolchain runner 二进制路径、参数、超时 | 作为待扩展说明 | 工具链细节未定,不阻塞 P0 |
| P1 | reference resolver allow-list 细化 | 作为待确认说明 | 若拆分 `ReferenceResolverConfig`,需回写 03 |
| P2 | 在线配置中心、admin override、热更新 | 不进入 P0 正式范围 | 当前无在线 runtime container |
| P2 | tenant / region / 多环境配置治理 UI | 不进入 P0 正式范围 | 当前 L0-core 不承担产品化配置治理 |

### 7.3 非范围表

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 具体部署命令、容器挂载、生产路径和平台操作 | 部署与运维手册 |
| KMS / Vault 具体接入命令和 secret 轮换 runbook | 部署与运维手册 / 安全运维 |
| 实现代码顺序、任务拆分、CI 接入和提交流程 | `07-实施计划.md` |
| Rust struct / enum / trait / function / DTO 变更 | `03-详细设计.md` 回写 |
| L0-bus publish / subscribe / ack / retry / dead-letter runtime | `L0-bus` |
| SDK 高层客户端配置、凭据注入、重试和开发者体验 | `L0-sdk` |
| 认证、授权、权限裁决和网关安全策略 | 安全入口 / governance / gateway 层 |
| 完整测试用例和验收裁决 | `05-测试方案.md` / `06-验收标准.md` |

---

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 本步采用 P0 / P1 / P2 范围分级,不新增代码字段 | 否 | 无代码契约变化 | 无 | 无回写 |
| profile 作为配置矩阵分类,不新增 `CoreRuntimeConfig.runtime_profile` | 否 | 无代码契约变化 | 无 | 无回写 |
| 真实 L0-bus publisher 与 toolchain runner 参数后置为 P1 | 否 | 外部集成范围分级 | 无 | 无回写 |
| reference resolver allow-list 细化暂列 P1 待确认 | 否 | 暂未改变 `ReferenceResolverConfig` | 无 | 无回写 |

说明:

- 本步没有决定拆分 `ReferenceResolverConfig`,也没有新增配置错误类型或 runtime builder 参数。
- 如果后续 Step 7 / Step 9 认为必须把 allow-list、toolchain timeout 或 publisher mode 变成 `CoreRuntimeConfig` 字段,对应 Step 必须标记为 `待回写`。

---

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §2。

```md
## 2. 本次配置设计目标与范围

> 校准来源：
> - `design-calibration/04_config_step_02_scope.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“对详细设计的影响判定”“回填草稿”和“待确认事项”小节，了解本章范围口径如何收敛。

本次配置设计的目标是把 `03-详细设计.md` 中已经确认的 runtime config、runtime builder、adapter 和外部依赖绑定,整理成可测试、可验收、可实施、可运维承接的配置控制面。

P0 覆盖本地 CLI / job 主链运行必需配置,包括 source、snapshot、projection、audit、outbox、idempotency、reference resolver、配置来源优先级、基础 profile、fail fast / fail closed 策略和最小 adapter 绑定口径。

P1 覆盖真实 L0-bus publisher、真实 toolchain runner、reference resolver allow-list 细化和 release-like profile。P1 可以在本配置设计中作为演进或待确认事项出现,但不得成为 P0 开发前置。

P2 覆盖在线配置中心、admin override、热更新、tenant / region 差异、KMS / Vault 自动轮换和配置治理 UI。当前 L0-core 没有在线 runtime container,因此这些内容不进入本轮 P0 正式范围。

本配置设计不写部署命令、运维 runbook、认证授权、SDK 高层配置体验、L0-bus runtime、Rust 代码契约变更、完整测试用例或验收裁决。如果配置设计结论需要改变 `CoreRuntimeConfig`、runtime builder、adapter、trait、error 或函数流,必须先回写 `03-详细设计.md`。
```

---

## 10. 待确认事项

- 是否接受 P0 只覆盖本地 CLI / job 主链运行和测试验收必需配置,不把真实生产部署细节纳入 P0。
- 是否接受真实 L0-bus publisher、真实 toolchain runner 和 reference resolver allow-list 细化先列为 P1 / 待确认。
- 是否接受 profile 在本轮先作为配置矩阵分类,不新增 `CoreRuntimeConfig.runtime_profile` 字段。

---

## 11. 进入下一步条件

- [x] 用户确认 P0 / P1 / P2 配置范围。
- [x] 用户确认非范围去向清楚。
- [x] 用户确认本步无需回写 `03-详细设计.md`。
- [x] Step 2 状态从 `[~]` 更新为 `[x]`。
