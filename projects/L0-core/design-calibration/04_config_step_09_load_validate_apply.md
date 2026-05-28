# Step 9. 定义配置加载、校验与生效机制

> 本文件是 `projects/L0-core/04-配置设计.md` 的 Step 9 中间产物。
> 本步定义配置如何加载、解析、校验、装配和生效。
> 本步不新增公开 `config loader` API,不新增 `CoreRuntimeConfig` 字段,不改变 `03-详细设计.md` 中的 runtime builder、adapter、trait 或 error 契约。

---

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 9
- 回填章节：`projects/L0-core/04-配置设计.md` §9 配置加载、校验与生效机制

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 7 配置项清单 | 7 个正式 P0 配置项、默认值、来源、失败策略 | 定义加载和校验对象 |
| Step 8 敏感配置 | P0 无 secret 正式项,raw secret 不进入普通来源 | 定义 sensitive / secret 输出和校验边界 |
| `03-详细设计.md` §13 | `[config source] -> CoreRuntimeConfig -> build_cli_runtime / build_job_runtime` | 固定装配入口 |
| Step 5 来源优先级 | defaults < file < env < CLI flags;高优先级非法 fail fast | 固定来源合并和错误处理 |
| Step 6 profile 矩阵 | local-dev、ci-test、release-like、operations-replay | 定义 profile 下加载时机和隔离要求 |

已确认结论:

```text
P0 配置加载发生在 CLI / job 启动阶段。
P0 不支持 reload / hot update。
配置先合并来源,再 parse/type validate,再 cross-field validate,再 assemble CoreRuntimeConfig,最后交给 runtime builder。
application service 和 domain 不直接读取配置源。
```

---

## 3. SOP 问题回答

1. 配置在什么时机加载?

   回答：P0 配置在 CLI 启动或 job 启动时加载。CLI / job entry 先收集 code defaults、project config file、environment variables、CLI flags,按 Step 5 规则合并,再形成待解析配置。配置必须在调用 `build_cli_runtime(CoreRuntimeConfig config)` 或 `build_job_runtime(CoreRuntimeConfig config)` 前完成校验。运行期间不热更新,作业重跑时重新读取配置。

2. 配置如何 parse 和 type validate?

   回答：配置来源合并后先按本地配置 key 解析为内部配置值,再转换为 03 已有的类型: `ContractSourceRoot`、`ReleaseSnapshotRoot`、`ProjectionIndexRoot`、`AuditRoot`、`OutboxRoot`、`IdempotencyRoot`、`ReferenceResolverConfig`。root 类配置必须解析为合法相对或绝对路径,不得为空、不得包含不可规范化路径。`ReferenceResolverConfig` 必须能解析为结构化对象,不能包含 raw credential。

3. 哪些配置需要 cross-field validate?

   回答：root 类配置需要交叉校验: `contract_source.root` 与 `release_snapshot.root` 不得指向同一目录;`audit.root`、`outbox.root`、`idempotency.root` 不得两两相同;`projection_index.root` 不得与 truth / audit / outbox / idempotency root 混用;所有 root 必须在当前 profile 下处于允许的 workspace 或 state root 范围内。`reference_resolver.config` 需要与“外部正文不得吸收”和“引用失败 fail closed”边界一致,不得允许 raw credential 或默认放行策略。

4. 哪些配置 startup / reload / hot / build-time / static?

   回答：7 个正式 P0 配置项全部是 startup / job-startup 配置,变更后需要重新执行 CLI 或 job。当前没有 reload 和 hot 配置。构建期配置不在本轮正式配置项中。领域不变量、架构红线、禁止配置化项是 static 设计约束,不是普通配置。

5. 校验失败后如何处理?

   回答：parse、type validate、cross-field validate、secret 边界校验失败时必须 fail fast,不得回退到低优先级配置继续运行。依赖读取失败按类别处理: root 路径不可访问 fail fast;gate / reference / blob 读取失败 fail closed;outbox publish 失败保留 pending / failed;toolchain runner 失败记录 job 失败,不回滚 truth。错误信息必须脱敏,不得回显 raw secret 或敏感路径片段。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `04-配置设计.md` §9 | 尚未存在加载、校验和生效机制 | 实施者无法判断配置失败时应启动失败、重试还是回退 |
| Step 5 来源优先级 | 已定义覆盖和冲突 | 需要继续定义 parse / type validate / cross-field validate |
| Step 7 配置项清单 | 已定义配置项和失败策略 | 需要汇总成配置组级加载校验表 |
| Step 8 敏感配置 | 已定义 raw secret 禁止输出 | 需要进入 parse / validate 和错误输出规则 |
| `03-详细设计.md` §13 | 只定义 config source 到 runtime builder 的流向 | 04 需要补齐配置进入 `CoreRuntimeConfig` 前的加载校验机制 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 加载时机 | 只知道 config source 进入 runtime config | 明确 CLI / job 启动时加载,调用 runtime builder 前完成校验 | 保证 application/domain 不直接读配置 |
| 校验层次 | 未分层 | 拆成 parse、type validate、cross-field validate、assemble runtime config | 便于实现和测试拆分 |
| 生效方式 | 只写启动读取 | 明确 7 个 P0 配置项都是 startup / job-startup,无 reload / hot | 承接无在线 runtime container 结论 |
| 失败处理 | 散落在 Step 5 / 7 / 8 | 汇总为 fail fast / fail closed / pending / job failed | 方便后续 Step 11 继续展开失效模式 |
| 03 回写 | 未判断 | 本步不新增公开 config loader API 或 `CoreRuntimeConfig` 字段 | 无需回写 03 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：在 04 中定义正式 Rust config loader API | 实施更直接 | 会改变详细设计代码契约,需要回写 03 | 不采用 |
| 方案 B：在 04 中定义加载行为和校验规则,实现函数留给实施 | 保持 04 边界,不打断 03 | 具体函数名需实施计划或代码实现再定 | 采用 |
| 方案 C：允许非法高优先级配置回退低优先级 | 可用性较高 | 会掩盖错误配置,测试验收不可判定 | 不采用 |
| 方案 D：支持 hot reload | 灵活 | 当前无在线 runtime container,需要审计和回滚机制 | 不采用,P2 后续设计 |

---

## 7. 结构化中间产物

#### 配置加载流程图: L0-core 配置加载与校验

```text
[code defaults]
  + [project config file]
  + [environment variables]
  + [CLI flags]
        |
        v
[merge by priority]
        |
        v
[parse external keys]
        |
        v
[type validate]
        |
        v
[cross-field validate]
        |
        v
[assemble CoreRuntimeConfig]
        |
        +--> build_cli_runtime(CoreRuntimeConfig config)
        |
        +--> build_job_runtime(CoreRuntimeConfig config)
```

关键说明:

- 本图表达 P0 启动 / 作业启动加载链,不表达热更新或在线配置中心。
- 高优先级配置非法时 fail fast,不得回退低优先级配置。
- `CoreRuntimeConfig` 是配置进入 runtime builder 的边界;application/domain 不直接读取配置源。
- secret ref 解析和真实 secret material 不在普通配置加载链内。

### 7.1 配置加载校验表

| 配置项 / 配置组 | 加载时机 | 校验方式 | 生效方式 | 失败策略 |
|---|---|---|---|---|
| 普通来源合并 | CLI / job 启动 | 来源优先级、重复 key、未知 P0 来源、非法 override | startup / job-startup | fail fast |
| 6 个 root path 配置 | CLI / job 启动 | parse path、非空、可规范化、profile 允许范围、必要读写权限 | startup / job-startup | fail fast |
| `contract_source.root` | CLI / job 启动 | 目录可读、不能与 snapshot root 相同 | startup / job-startup | fail fast |
| `release_snapshot.root` | CLI / job 启动 | 目录可读写或可创建、不能与 source root 相同 | startup / job-startup | fail fast |
| `projection_index.root` | CLI / job 启动 | 不得与 truth / audit / outbox / idempotency root 混用 | startup / job-startup | fail fast;运行后 projection 失败 stale / rebuild |
| `audit.root` | CLI / job 启动 | 不得与 outbox / idempotency root 相同,必须可 append | startup / job-startup | fail fast;运行后 audit append 不得静默成功 |
| `outbox.root` | CLI / job 启动 | 不得与 audit / idempotency root 相同,必须可 append / mark | startup / job-startup | fail fast;publish 失败 pending / failed |
| `idempotency.root` | CLI / job 启动 | 不得与 audit / outbox root 相同,必须可 reserve / complete | startup / job-startup | fail fast;payload mismatch conflict |
| `reference_resolver.config` | CLI / job 启动 | parse structured config、不得包含 raw credential、不得允许默认放行 | startup / job-startup | fail fast;引用读取失败 fail closed |
| sensitive / secret boundary | CLI / job 启动和 adapter-local binding | raw secret 禁止、secret ref 格式校验、输出脱敏 | startup / job-startup | fail fast / fail closed |
| static design constraints | 设计阶段 | 禁止配置化项检查 | static | 拒绝配置,进入设计变更流程 |

### 7.2 cross-field validate 清单

| 校验项 | 规则 | 失败处理 |
|---|---|---|
| source / snapshot 隔离 | `contract_source.root` 不得等于 `release_snapshot.root` | fail fast |
| state root 隔离 | `audit.root`、`outbox.root`、`idempotency.root` 不得两两相同 | fail fast |
| projection 隔离 | `projection_index.root` 不得与 source / snapshot / audit / outbox / idempotency root 混用 | fail fast |
| profile 允许范围 | local / CI root 必须落在 workspace / temp / CI artifact 允许范围 | fail fast |
| secret 边界 | 普通配置源不得包含 raw secret | fail fast |
| reference resolver 安全 | 不得配置为引用失败默认放行或吸收外部正文 | fail fast |
| 禁止配置化项 | 配置中出现绕过 gate / audit / fingerprint / idempotency 的开关 | fail fast + 设计变更 |

---

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 定义加载行为为 CLI / job 启动时执行 | 否 | 配置设计行为规则 | 无 | 无回写 |
| 不定义公开 Rust config loader API | 否 | 避免新增代码契约 | 无 | 无回写 |
| 不新增 reload / hot update 机制 | 否 | 范围分级 | 无 | 无回写 |
| 如果后续需要公开 `load_core_runtime_config` 等函数签名 | 是 | function / module contract 变化 | `03-详细设计.md` runtime wiring / infra module | 待回写 |

说明:

- 本步没有新增 `CoreRuntimeConfig` 字段、adapter constructor 参数、trait 方法或错误枚举。
- 本步给出实现必须满足的配置加载行为,具体内部函数名留给实施计划或代码实现。

---

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §9。

````md
## 9. 配置加载、校验与生效机制

> 校准来源：
> - `design-calibration/04_config_step_09_load_validate_apply.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“配置加载流程图”“配置加载校验表”“cross-field validate 清单”和“对详细设计的影响判定”小节，了解本章加载机制如何收敛。

P0 配置在 CLI / job 启动时加载。配置来源按 `defaults < file < env < CLI flags` 合并后,必须完成 parse、type validate、cross-field validate,再装配为 `CoreRuntimeConfig`,并交给 `build_cli_runtime(CoreRuntimeConfig config)` 或 `build_job_runtime(CoreRuntimeConfig config)`。

P0 不支持 reload 或 hot update。高优先级配置非法时必须 fail fast,不得回退低优先级配置。application service 和 domain object 不直接读取配置源。

#### 配置加载流程图: L0-core 配置加载与校验

```text
[source merge]
  -> [parse external keys]
  -> [type validate]
  -> [cross-field validate]
  -> [assemble CoreRuntimeConfig]
  -> [build cli/job runtime]
```

配置校验必须覆盖 root path 类型、路径合法性、root 间隔离、profile 允许范围、secret 边界和 reference resolver 安全边界。校验失败时按 fail fast / fail closed / pending / job failed 等策略处理,不得静默成功。
````

---

## 10. 待确认事项

- 是否接受 P0 配置只在 CLI / job 启动时加载。
- 是否接受本步不定义公开 Rust config loader API,只定义加载行为。
- 是否接受 root path 的 cross-field validate 规则。
- 是否接受 P0 不支持 reload / hot update。
- 是否接受本步无需回写 `03-详细设计.md`。

---

## 11. 进入下一步条件

- [x] 用户确认配置加载流程图。
- [x] 用户确认配置加载校验表。
- [x] 用户确认 cross-field validate 清单。
- [x] 用户确认本步无需回写 `03-详细设计.md`。
- [x] Step 9 状态从 `[~]` 更新为 `[x]`。
