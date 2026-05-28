## Step 8. 定义配置、环境与外部依赖准备

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 8
- 回填章节：`07-实施计划.md` §8 配置、环境与外部依赖准备

### 2. 本步输入

- 上游文档：
  - `projects/L0-core/03-详细设计.md` §13
  - `projects/L0-core/04-配置设计.md` §6 / §7 / §9 / §11
  - `projects/L0-core/05-测试方案.md` §8 / §9 / §13
  - `projects/L0-core/06-验收标准.md` §7 / §10 / §11 / §13
- 已确认结论：
  - L0-core 不是常驻在线服务，P0 只覆盖 library + CLI + jobs 的实施和验证。
  - P0 profile 是 local-dev、ci-test、integration、release-like；staging-integration 和 production-ops 后置。
  - 配置文件默认使用严格 JSON，不额外包裹 `core` 顶层 key。
  - 真实 L0-bus / L0-sdk / L1+ / secret provider / observability store 不作为 P0 前置依赖。
- 依赖的前序 Step：
  - `07_implementation_plan_step_07_test_acceptance_gates.md`

### 3. SOP 问题回答

1. 哪些外部服务或仓是实施前置依赖。

   回答：P0 实施前置依赖不是外部在线服务，而是目标实现仓、Rust toolchain、文件系统状态根、JSON profile fixture、fake / real-like adapter 和 evidence artifact 目录。真实 L0-bus、真实 L0-sdk、L1+ 业务仓、真实 secret provider、真实观测归档系统和部署环境不是 P0 前置依赖。

2. 哪些依赖只在特定阶段需要。

   回答：PH-01 需要 toolchain、workspace、JSON profile 和 fake ports；PH-02 需要 source / audit / outbox / idempotency roots；PH-03 需要 fake gate 与 trace/audit fixture；PH-04 需要 projection root、read model fixture 和 security scan fixture；PH-05 需要 release snapshot root、fake publisher、toolchain runner fake；PH-06 需要 release-like profile、evidence artifact root 和 redline scan。

3. 哪些配置项必须在本地或 CI 环境准备。

   回答：必须准备 7 个 P0 配置项：`contract_source.root`、`release_snapshot.root`、`projection_index.root`、`audit.root`、`outbox.root`、`idempotency.root`、`reference_resolver.config`。配置来源按 `defaults < file < env < CLI flags` 合并，必须执行 parse、type validate 和 cross-field validate。

4. 是否允许 fake / mock，允许到什么阶段为止。

   回答：允许 fake / stub / real-like adapter 贯穿 P0，但必须标明边界。fake gate、fake resolver、fake publisher、fake toolchain runner 可用于 PH-01~PH-06 的 P0 门禁；release-like 阶段应使用 real-like file adapter 和 fake bus publisher。fake 不得伪装成真实外部联调成功。

5. 外部依赖不可用时是暂停、降级还是替代。

   回答：配置、路径、raw secret、resolver config、禁止配置化项失败时 fail fast；reference / gate / blob 运行时读取失败时 fail closed；outbox publish 失败保留 pending / failed；projection rebuild 失败标记 stale / rebuilding；真实外部服务不可用时用 boundary suite 替代并登记后续风险。

6. 哪些依赖需要由其他团队或仓提供。

   回答：真实 L0-bus runtime、L0-sdk 高层客户端、L1+ 业务联调、真实 secret provider、真实观测归档、staging / production 部署配置由后续相邻仓或运维文档提供。L0-core 本轮只提供可消费契约、outbox / CloudEvent boundary、package / guide sample 和证据字段。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| Step 7 门禁 | 已有测试 / 证据门禁，但物理环境和配置准备未固定 | 实施者可能不知道每个阶段需要哪些 root、profile 和 fake |
| `04-配置设计.md` §7 | 7 个配置项已明确 | 需要转成实施前检查表和阶段使用表 |
| `05-测试方案.md` §8 | 环境矩阵已定义 | 需要明确哪些环境是 P0、哪些后置 |
| `03-详细设计.md` §13 | 外部依赖绑定表已有 port / adapter | 需要明确 fake / mock 使用边界和不可用处理 |
| `06-验收标准.md` §13 | 真实外部依赖缺口可风险接受 | 需要避免把真实联调写成 P0 阻断项 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 环境口径 | 只有测试方案环境矩阵 | 收敛为实施前和阶段前检查项 | 让实施者能按阶段准备环境 |
| 配置项 | 已在 04 中定义 | 绑定到 local / CI / integration / release-like profile | 配置必须可运行、可测、可验 |
| 外部服务 | 真实外部服务后置但分散 | 明确 P0 不依赖真实在线服务 | 避免阻塞 L0-core 底座仓 |
| fake / mock | 只作为测试口径出现 | 明确使用阶段、边界和禁止伪装 | 防止 fake 结果被当成真实联调成功 |
| 失败处理 | 分散在配置和验收文档 | 集中为 fail fast / fail closed / pending / stale / risk | 实施中不可临场判断 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 要求真实 L0-bus / SDK / L1 都可用后再实施 | 联调真实性强 | 阻塞底座仓，违反 P0 范围 | 不采用 |
| P0 使用 fake / boundary suite，真实联调后置 | 可独立实现和验收 | 后续系统级风险需追踪 | 采用 |
| 配置中使用 `core` 顶层包裹 | 适合系统级聚合配置 | 当前已是 L0-core 单仓配置，增加冗余层 | 不采用 |
| 配置按功能模块拆分 JSON key | 与 04 配置设计一致，便于 cross-field validate | 后续系统级聚合需映射 | 采用 |
| 配置失败自动回退低优先级值 | 可能提升可用性 | 高风险配置会 fail open，破坏验收红线 | 不采用 |
| 高优先级非法配置 fail fast | 安全、可诊断、符合 04 | 需要用户显式修复 | 采用 |

### 7. 结构化中间产物

#### 7.1 外部依赖准备表

| 依赖项 | 类型 | 使用阶段 | 提供方 | 检查方式 | 不可用时处理 |
|---|---|---|---|---|---|
| 目标实现仓 `<l0-core-code-root>` | repo | PH-01~PH-06 | 实施者 | 记录绝对路径、branch、设计基线 commit | 未确认则不得开始编码 |
| Rust toolchain | tool | PH-01~PH-06 | 实施者 / CI | `rustc --version`、`cargo --version`、fmt/lint/test 命令 | 未就绪则暂停 PH-01 |
| `contract_source.root` | config / filesystem | PH-02~PH-06 | L0-core repo / fixture | 路径存在、可读、与 snapshot 隔离 | fail fast |
| `release_snapshot.root` | config / filesystem | PH-05~PH-06 | L0-core repo / fixture | 可写或可创建、与 source 隔离 | fail fast |
| `projection_index.root` | config / filesystem | PH-04~PH-06 | L0-core repo / fixture | 与 truth/audit/outbox/idempotency 隔离 | fail fast；运行后失败 stale |
| `audit.root` | config / filesystem | PH-02~PH-06 | L0-core repo / fixture | 可 append、与 outbox/idempotency 隔离 | fail fast；append 失败不得静默 |
| `outbox.root` | config / filesystem | PH-02~PH-06 | L0-core repo / fixture | 可 append / mark、与 audit/idempotency 隔离 | fail fast；publish 失败 pending / failed |
| `idempotency.root` | config / filesystem | PH-02~PH-06 | L0-core repo / fixture | 可 reserve / complete、与 audit/outbox 隔离 | fail fast；payload mismatch conflict |
| `reference_resolver.config` | config / adapter | PH-01~PH-06 | L0-core fake / future external | config validate、禁止 fail open、禁止正文吸收 | 配置非法 fail fast；引用失败 fail closed |
| Fake gate | adapter | PH-03~PH-06 | L0-core tests | gate pass / fail / missing fixture | 不可用则暂停 publish 相关阶段 |
| Fake toolchain runner | adapter | PH-05~PH-06 | L0-core tests | validate / fingerprint / snapshot exporter fixture | job failed，保留失败证据 |
| Fake publisher / outbox boundary | adapter | PH-05~PH-06 | L0-core tests | publish success/fail fixture、event id 稳定 | pending / failed，不连接真实 bus |
| Evidence artifact root | artifact | PH-01~PH-06 | CI / release runner | 可写、按 run_id 分区、字段完整 | P0 EV 缺失则阻断 |
| 真实 L0-bus | service | P1 / 后续联调 | L0-bus 仓 | 不作为 P0 检查项 | P0 用 boundary suite 替代 |
| 真实 L0-sdk / L1+ | repo / service | P1 / 后续联调 | 相邻仓 | 不作为 P0 检查项 | P0 提供 DTO / snapshot / view |
| 真实 secret provider | service | P1 / P2 | 运维 / 安全 | 不作为 P0 检查项 | P0 禁止 raw secret |

#### 7.2 profile 与阶段使用表

| profile | 使用阶段 | 关键依赖 | 必须覆盖的门禁 |
|---|---|---|---|
| local-dev | PH-01~PH-04 | defaults + local JSON + temp roots + fake adapters | fmt/lint、unit、service、config smoke |
| ci-test | PH-01~PH-05 | deterministic fixture、fixed clock、temp root、fake publisher | PR/main 阻断 suite、negative config |
| integration | PH-02~PH-05 | real-like file adapter、failing port、fake publisher | integration persistence、worker、relay boundary |
| release-like | PH-06 | versioned JSON、clean runtime fixture、evidence root | E2E minimal loop、release gate、redline scan |
| staging-integration(P1) | 后续 | 真实 L0-bus / downstream / secret provider | 不进入 P0 |

#### 7.3 配置项检查表

| 配置项 | 检查内容 | 阶段 | 失败处理 |
|---|---|---|---|
| `contract_source.root` | 可读、不是 snapshot root | PH-02 前 | fail fast |
| `release_snapshot.root` | 可写或可创建、不是 source root | PH-05 前 | fail fast |
| `projection_index.root` | 不与 truth / audit / outbox / idempotency root 混用 | PH-04 前 | fail fast |
| `audit.root` | 可 append、不与 outbox / idempotency root 相同 | PH-02 前 | fail fast；运行失败阻断 command/job |
| `outbox.root` | 可 append / mark、不与 audit / idempotency root 相同 | PH-02 前 | fail fast；publish 失败 pending / failed |
| `idempotency.root` | 可 reserve / complete、不与 audit / outbox root 相同 | PH-02 前 | fail fast |
| `reference_resolver.config` | 不含 raw credential、不允许 fail open、不吸收外部正文 | PH-01 前 | fail fast / fail closed |

#### 7.4 fake / mock 使用边界

| fake / mock | 允许阶段 | 允许用途 | 禁止用途 |
|---|---|---|---|
| fake repository / temp store | PH-01~PH-04 | 单元、service、local-dev 快速验证 | 替代 integration persistence 结论 |
| real-like file adapter | PH-02~PH-06 | integration、release-like、状态根验证 | 声称具备生产部署能力 |
| fake gate | PH-03~PH-06 | gate pass/fail/missing 测试 | 冒充真实审批系统已接入 |
| fake reference resolver | PH-01~PH-06 | resolved / missing / invalid / fail closed 测试 | 引用失败默认放行 |
| fake toolchain runner | PH-05~PH-06 | validate/fingerprint/snapshot failure 测试 | 冒充完整外部工具链 |
| fake publisher | PH-05~PH-06 | outbox relay success/failure boundary | 冒充真实 L0-bus 投递成功 |
| fixed clock / id generator | PH-01~PH-06 | deterministic tests | 进入生产配置或影响真实时间语义 |

#### 7.5 依赖不可用处理表

| 不可用对象 | 处理 |
|---|---|
| Rust toolchain / workspace 不可构建 | 暂停 PH-01，先修复工具链或 workspace |
| JSON 配置 parse / type / cross-field validate 失败 | fail fast，不回退低优先级来源 |
| root path 不可读 / 不可写 / 混用 | fail fast，禁止启动 CLI/job runtime |
| raw secret / token / credential 出现在配置或证据 | blocker，清理并重跑安全扫描 |
| reference / gate / blob 读取失败 | fail closed，不发布，不补造正文 |
| audit append 失败 | command/job 失败或事务回滚，不得伪成功 |
| outbox publish 失败 | 保留 pending / failed，event id 稳定可重放 |
| projection rebuild 失败 | 标记 stale / rebuilding，不反写真相 |
| 真实 L0-bus / L0-sdk / L1+ 不可用 | 不阻塞 P0；通过 boundary suite 替代并登记后续风险 |
| evidence root 不可写或 EV 缺失 | 阻断对应阶段或 PH-06 放行 |

### 8. 回填草稿

以下内容回填到正式 `07-实施计划.md` §8。

```md
## 8. 配置、环境与外部依赖准备

> 校准来源：
> - `design-calibration/07_implementation_plan_step_08_config_environment.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“外部依赖准备表”“profile 与阶段使用表”“配置项检查表”“fake / mock 使用边界”和“依赖不可用处理表”小节，了解实施前和阶段前必须准备哪些环境能力。

L0-core P0 不是常驻在线服务实施，不要求真实 L0-bus、L0-sdk、L1+、secret provider 或观测归档系统在线。本轮实施环境由 Rust toolchain、目标实现仓、文件系统状态根、严格 JSON 配置、profile fixture、fake / real-like adapter 和 evidence artifact root 组成。

| profile | 使用阶段 | 关键依赖 | 必须覆盖的门禁 |
|---|---|---|---|
| local-dev | PH-01~PH-04 | defaults + local JSON + temp roots + fake adapters | fmt/lint、unit、service、config smoke |
| ci-test | PH-01~PH-05 | deterministic fixture、fixed clock、temp root、fake publisher | PR/main 阻断 suite、negative config |
| integration | PH-02~PH-05 | real-like file adapter、failing port、fake publisher | integration persistence、worker、relay boundary |
| release-like | PH-06 | versioned JSON、clean runtime fixture、evidence root | E2E minimal loop、release gate、redline scan |

必须准备 7 个 P0 配置项：`contract_source.root`、`release_snapshot.root`、`projection_index.root`、`audit.root`、`outbox.root`、`idempotency.root`、`reference_resolver.config`。配置来源按 `defaults < file < env < CLI flags` 合并，随后执行 parse、type validate 和 cross-field validate。配置非法、root path 冲突、raw secret、引用失败默认放行、禁止配置化项出现时必须 fail fast 或 fail closed。

fake gate、fake reference resolver、fake toolchain runner 和 fake publisher 允许用于 P0 boundary suite，但不得宣称真实外部系统已接入。真实外部联调进入后续仓或系统级验收。
```

### 9. 待确认事项

- 目标实现仓的实际 config fixture 路径和 CI artifact 物理路径仍需 Step 11 与实现仓约定对齐。
- `release-like` profile 的 evidence root 由实现仓 CI / release runner 最终确定。
- 真实 staging / production 配置不进入 P0；若用户要求提前设计，应另开部署与运维文档，不写入本实施计划 P0 门禁。

建议方案：接受当前配置和环境边界。原因是它严格承接 04 配置设计和 05 测试环境，同时保持 L0-core P0 可独立实施，不被真实外部服务阻塞。

### 10. 进入下一步条件

- 关键依赖均有检查方式和失败处理。
- P0 profile 与阶段使用关系明确。
- fake / mock 使用边界明确。
- 阶段级依赖关系与 Step 5 不冲突。
- 可以进入 Step 9，继续定义 Spike、风险与待确认事项。
