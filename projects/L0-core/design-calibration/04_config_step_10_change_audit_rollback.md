# Step 10. 定义配置变更、审计与回滚

> 本文件是 `projects/L0-core/04-配置设计.md` 的 Step 10 中间产物。
> 本步定义配置如何被提出、评审、记录、生效和回滚。
> 本步不新增配置变更 API、不新增配置审计事件类型、不改变 `03-详细设计.md` 中的 runtime builder、audit port、event 或 error 契约。

---

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 10
- 回填章节：`projects/L0-core/04-配置设计.md` §10 配置变更、审计与回滚

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 7 配置项清单 | 7 个正式 P0 配置项及其类型、默认值、来源、失败策略 | 判定哪些配置变更属于 P0 正式变更 |
| Step 8 敏感配置 | P0 无 secret 正式项;P1/P2 只允许 secret ref | 定义敏感引用变更的审计和回滚边界 |
| Step 9 生效机制 | P0 配置只在 CLI / job 启动时加载;无 reload / hot update | 固定变更生效和回滚方式 |
| Step 5 来源优先级 | defaults < file < env < CLI flags;高优先级非法 fail fast | 判断不同来源的变更责任和冲突处理 |
| `03-详细设计.md` §13 / §14 | `CoreRuntimeConfig`、runtime builder、audit events 已有契约 | 避免在 04 中新增代码契约或审计事件 |

已确认结论:

```text
P0 配置变更不是在线管理操作。
配置文件、环境变量和 CLI flags 的变更只在下一次 CLI / job 启动时生效。
回滚不是热回滚,而是恢复上一版配置来源并重新执行 CLI / job。
配置变更审计优先由版本库、CI、发布记录、运行日志或外层平台记录承接。
04 不新增 L0-core 内部配置变更 API 或配置审计事件。
```

---

## 3. SOP 问题回答

1. 哪些配置可以由谁变更?

   回答：P0 的 code defaults 只能通过代码变更调整;project config file 由项目维护者或实施者通过版本化文件调整;environment variables 由 CI / release-like / operations 环境的执行者调整;CLI flags 由当前命令或 job 的执行者在单次运行中指定。future sensitive ref 由安全运维或部署运维在外层密钥系统和部署配置中调整。L0-core 本身不做身份校验,也不内建配置管理员角色,具体 actor 来自外层流程、提交记录、CI 元数据或执行上下文。

2. 哪些配置变更需要评审?

   回答：所有进入版本化 project config file 或 code defaults 的变更都需要 review。影响 truth input、发布快照、审计、outbox、idempotency、reference resolver 的变更按高风险处理,必须说明原因、影响范围、回滚方式和验证方式。local-dev 的临时 CLI flags 可以不走正式评审,但 release-like、operations-replay 或影响 shared state 的 CLI / env override 需要评审或至少保留执行记录。future sensitive ref 变更需要安全或运维评审。

3. 变更如何生效?

   回答：P0 没有 hot reload。变更写入对应来源后,在下一次 CLI / job 启动时按 Step 9 的加载链生效。已经运行中的 job 不读取新配置。高优先级来源覆盖低优先级来源,但如果高优先级值非法,当前运行必须 fail fast,不得自动回退低优先级值继续运行。

4. 变更如何记录审计?

   回答：P0 配置变更审计分为两类。第一类是来源侧审计,例如版本库提交、review 记录、CI 变量变更记录、部署记录或命令执行记录。第二类是运行侧有效配置记录,例如启动日志、job receipt、audit summary 或测试报告中的 profile、配置来源摘要、配置 key、脱敏后的值摘要、config fingerprint、actor_ref、trace_id 和校验结果。运行侧记录不得包含 raw secret、完整敏感路径或外部正文。

5. 变更失败或效果异常如何回滚?

   回答：parse / validate 失败时本次 CLI / job 启动失败,无需回滚已运行状态。已提交的配置文件变更通过 revert 文件、恢复上一版 env、取消 CLI override 或恢复上一版 secret ref 回滚。回滚后必须重新执行 CLI / job,并重新经过配置加载和校验。对 projection、outbox、audit、idempotency 等 state root 的错误变更,需要先停止继续写入错误位置,恢复配置,再按对应数据恢复或重建流程处理,不得把错误配置下的输出静默合并回正式状态。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `04-配置设计.md` §10 | 尚未存在配置变更、审计与回滚章节 | 实施者无法判断配置变更是否需要 review、如何留痕、如何恢复 |
| Step 7 配置项清单 | 已列出配置项,但未定义变更治理 | 高风险 root / resolver 变更容易被当作普通参数修改 |
| Step 8 敏感配置 | 已定义 secret ref 边界,但未定义 ref 变更审计 | 后续 P1/P2 真实凭据接入时可能缺少安全评审 |
| Step 9 生效机制 | 已确认无 hot reload | 需要明确回滚不是在线热回滚,而是恢复来源后重跑 |
| `03-详细设计.md` §14 | 审计事件已聚焦契约业务事件 | 04 不能静默新增配置审计事件契约 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 变更方式 | 只知道配置可来自 defaults / file / env / CLI | 明确不同来源的变更责任和评审要求 | 防止把所有配置都当成同等风险的参数 |
| 生效方式 | Step 9 只说明启动加载 | Step 10 明确变更后下一次 CLI / job 生效,无热生效 | 与无在线 runtime container 保持一致 |
| 审计边界 | 只要求业务审计不得泄露 secret | 明确配置变更审计由来源侧和运行侧共同承接 | 不新增 03 审计事件也能保留可追溯性 |
| 回滚方式 | 未定义 | 恢复上一版配置来源并重新执行 CLI / job | 避免误以为有在线 rollback API |
| 03 回写 | 未判断 | 本步不新增配置变更 API、config object 或 audit event | 无需回写 03 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：在 L0-core 内新增配置管理 API | 配置变更集中可控 | 当前无在线服务和认证层,会新增 03 代码契约 | 不采用 |
| 方案 B：通过版本化来源、CI / deployment 记录和运行侧摘要审计配置变更 | 符合 CLI / job 形态,不引入在线控制面 | 审计分散在外层流程和运行记录 | 采用 |
| 方案 C：配置变更后支持 hot reload 和在线 rollback | 使用体验灵活 | 与 P0 无在线 runtime container 冲突,需要复杂审计与一致性设计 | 不采用 |
| 方案 D：所有 CLI flags 都不需审计 | 本地开发轻量 | release-like / operations-replay 难以追溯 | 不采用 |

---

## 7. 结构化中间产物

#### 配置变更闭环图: L0-core 配置变更、审计与回滚

```text
[propose config change]
        |
        v
[classify source and risk]
        |
        +--> [review if required]
        |
        v
[update config source]
        |
        v
[next CLI / job start]
        |
        v
[load and validate config]
        |
        +--> [success: record effective summary]
        |
        +--> [failure: fail fast / fail closed]
                  |
                  v
              [restore previous source]
                  |
                  v
              [rerun CLI / job]
```

关键说明:

- 本图表达 P0 配置变更闭环,不表达在线配置中心或热更新。
- `review if required` 由配置来源和风险等级决定,不绑定具体工单系统。
- `record effective summary` 只能记录脱敏摘要、fingerprint、来源和校验结果。
- 回滚通过恢复上一版配置来源并重跑实现,不是运行时内存回滚。

### 7.1 配置变更表

| 变更类型 | 发起方 | 评审要求 | 生效方式 | 审计记录 | 回滚方式 |
|---|---|---|---|---|---|
| code defaults 变更 | 代码实施者 | 必须代码 review;如影响默认路径或安全边界需设计复核 | 下次构建 / 发布后生效 | commit、review、release note | revert 代码或发布上一版 |
| project config file 变更 | 项目维护者 / 实施者 | 必须 review;高风险项需说明影响和验证 | 下一次 CLI / job 启动 | commit、review、config fingerprint、校验结果 | revert 配置文件并重跑 |
| environment variables 变更 | CI / release-like / operations 执行者 | local 可轻量;release-like / replay 必须留痕 | 下一次 CLI / job 启动 | CI / deployment 记录、actor_ref、trace_id | 恢复上一版 env 并重跑 |
| CLI flags override | 命令执行者 / job 调度者 | local-dev 可不评审;release-like / replay 必须记录原因 | 单次命令或 job 生效 | 命令记录、job receipt、脱敏参数摘要 | 移除 override 或恢复旧参数后重跑 |
| `contract_source.root` 变更 | 项目维护者 / 运维执行者 | 高风险,必须评审 | 下一次 CLI / job 启动 | 来源摘要、路径脱敏摘要、校验结果 | 恢复旧 root,重跑校验 / job |
| `release_snapshot.root` 变更 | 项目维护者 / 运维执行者 | 高风险,必须评审 | 下一次 CLI / job 启动 | 来源摘要、路径脱敏摘要、snapshot 影响说明 | 恢复旧 root,必要时重新派生 snapshot |
| `audit.root` / `outbox.root` / `idempotency.root` 变更 | 运维执行者 / 实施者 | 高风险,必须评审 | 下一次 CLI / job 启动 | state root 摘要、影响范围、校验结果 | 停止错误写入,恢复旧 root,按对应恢复流程处理 |
| `projection_index.root` 变更 | 实施者 / 运维执行者 | 中高风险,需要评审 | 下一次 CLI / job 启动 | projection root 摘要、重建计划 | 恢复旧 root 或触发 projection rebuild |
| `reference_resolver.config` 变更 | 项目维护者 / 运维执行者 | 高风险,必须评审 | 下一次 CLI / job 启动 | resolver 配置摘要、禁止放行校验结果 | 恢复旧 resolver config 并重跑 |
| future sensitive ref 变更 | 安全运维 / 部署运维 | 必须安全或运维评审 | 下一次 CLI / job 启动或外部 adapter 重启 | ref 标识、actor_ref、trace_id、原因;不得记录 secret | 恢复上一版 ref 或 secret provider 版本 |

### 7.2 风险分级表

| 风险等级 | 适用变更 | 必须动作 |
|---|---|---|
| 低 | local-dev 临时 CLI flags、仅影响个人本地路径的临时配置 | 本地自检;不进入正式配置 |
| 中 | CI 专用路径、projection rebuild 路径、测试 fixture 配置 | 记录变更原因和校验结果 |
| 高 | truth source、release snapshot、audit、outbox、idempotency、reference resolver | review、影响说明、回滚方案、重跑验证 |
| Critical | future secret ref、credential ref、绕过 gate / audit / fingerprint / idempotency 的尝试 | 安全 / 架构复核;绕过类配置直接拒绝 |

### 7.3 审计记录规则

| 审计位置 | 应记录 | 禁止记录 |
|---|---|---|
| 版本库 / review | 配置 key、变更原因、影响范围、回滚方式、review 结论 | raw secret、完整外部正文 |
| CI / deployment 记录 | profile、配置来源、actor_ref、trace_id、校验结果 | secret value、完整敏感路径 |
| CLI / job receipt | 有效配置来源摘要、config fingerprint、命令 / job id、result | raw secret、credential、外部响应正文 |
| audit summary / 运行日志 | 配置加载成功 / 失败类别、错误码、脱敏 key | raw config value、token、private key |
| 测试报告 | 使用的 profile、fixture 配置摘要、验证结果 | 可被真实系统解析的 secret ref 或 secret value |

### 7.4 回滚规则

| 场景 | 回滚动作 | 验证动作 |
|---|---|---|
| 配置 parse / type validate 失败 | 修正或恢复上一版来源 | 重新启动 CLI / job,确认通过 Step 9 校验 |
| 高优先级 override 错误 | 移除 CLI flag / env override 或恢复旧值 | 确认不再触发 fail fast |
| truth source root 指错 | 立即停止使用错误 root,恢复旧 root | 重新执行 fingerprint / gate / validate job |
| snapshot root 指错 | 恢复旧 root,隔离错误输出 | 必要时重新派生 snapshot 并比对 fingerprint |
| audit / outbox / idempotency root 指错 | 停止继续写入错误位置,恢复旧 root | 按 state 恢复流程检查丢失或重复记录 |
| projection root 指错 | 恢复旧 root 或清理并重建 projection | 触发 projection rebuild 并检查 stale 状态 |
| reference resolver config 错误 | 恢复旧 resolver config | 重新执行引用解析;失败必须 fail closed |
| future secret ref 错误 | 恢复上一版 ref 或外部 secret 版本 | 重启相关入口,确认脱敏错误消失 |

---

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 配置变更通过来源侧变更和下一次 CLI / job 启动生效 | 否 | 配置治理规则 | 无 | 无回写 |
| 不新增配置变更 API、配置管理 command 或配置审计 event | 否 | 避免新增代码契约 | 无 | 无回写 |
| 运行侧只记录脱敏有效配置摘要,不要求新增正式 audit event | 否 | 配置审计规则 | 无 | 无回写 |
| 如果后续要新增 `ConfigChanged` / `ConfigApplied` 审计事件或 config change object | 是 | audit event / DTO / application flow 变化 | `03-详细设计.md` §14 或相关 contracts 章节 | 待回写 |
| 如果后续要把 config fingerprint 放入 `CoreRuntimeConfig` 字段 | 是 | runtime config 结构变化 | `03-详细设计.md` §13 | 待回写 |

说明:

- 本步没有新增 `CoreRuntimeConfig` 字段、adapter constructor 参数、trait 方法、错误枚举或审计事件。
- 本步的配置审计主要约束外层变更记录和运行侧脱敏摘要,不改变 L0-core 现有业务审计事件表。

---

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §10。

````md
## 10. 配置变更、审计与回滚

> 校准来源：
> - `design-calibration/04_config_step_10_change_audit_rollback.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“配置变更表”“风险分级表”“审计记录规则”“回滚规则”和“对详细设计的影响判定”小节，了解本章变更治理如何收敛。

P0 配置变更不是在线管理操作。code defaults 通过代码变更生效;project config file 通过版本化文件变更生效;environment variables 和 CLI flags 分别由 CI / runtime environment 和命令执行上下文提供。所有正式配置变更都在下一次 CLI / job 启动时经加载、解析、校验和装配后生效。

高风险配置包括 truth source、release snapshot、audit、outbox、idempotency、reference resolver 和 future sensitive ref。这些变更必须有评审、影响说明、回滚方式和验证记录。local-dev 临时 CLI flags 可以轻量处理,但不得进入正式配置。

配置变更审计由来源侧记录和运行侧摘要共同承接。来源侧包括 commit、review、CI、deployment 或命令执行记录;运行侧包括 profile、配置来源摘要、config fingerprint、actor_ref、trace_id 和校验结果。任何审计、日志、错误或测试报告都不得记录 raw secret、credential、token、private key 或完整外部正文。

P0 不支持 hot rollback。回滚通过恢复上一版配置来源并重新执行 CLI / job 完成。配置校验失败时必须 fail fast 或 fail closed,不得自动回退到低优先级配置继续运行。
````

---

## 10. 待确认事项

- 是否接受 P0 配置变更不是在线管理操作。
- 是否接受配置变更通过恢复来源并重跑来回滚。
- 是否接受高风险配置变更必须 review、留痕并说明回滚方式。
- 是否接受本步不新增配置变更 API、配置审计事件或 `CoreRuntimeConfig` 字段。
- 是否接受本步无需回写 `03-详细设计.md`。

---

## 11. 进入下一步条件

- [x] 用户确认配置变更闭环图。
- [x] 用户确认配置变更表。
- [x] 用户确认风险分级表、审计记录规则和回滚规则。
- [x] 用户确认本步无需回写 `03-详细设计.md`。
- [x] Step 10 状态从 `[~]` 更新为 `[x]`。
