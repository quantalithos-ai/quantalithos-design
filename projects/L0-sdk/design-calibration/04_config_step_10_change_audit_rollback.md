# Step 10. 定义配置变更、审计与回滚

> 本文件是 `projects/L0-sdk/04-配置设计.md` 的 Step 10 中间产物。
> 本步定义配置如何被提出、评审、记录、生效和回滚。
> 本步不新增配置变更 API、不新增配置审计事件类型、不改变 `03-详细设计.md` 中的 runtime builder、audit、event、error 或 function flow 契约。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 10
- 回填章节：`projects/L0-sdk/04-配置设计.md` §10 配置变更、审计与回滚

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 7 配置项清单 | 11 个配置组、字段级 key、敏感级别、失败策略 | 判定配置变更类型和风险 |
| Step 8 敏感配置 | P0 无 secret material,只允许 sensitive reference,敏感引用变更必须审计 | 固定 sensitive ref 变更规则 |
| Step 9 生效机制 | P0 配置在 runtime / CLI / job 启动时加载,不支持 reload / hot update | 固定生效和回滚方式 |
| Step 5 来源优先级 | 普通来源为 defaults、JSON file、env;CLI / job args 仅作局部输入 | 固定变更来源责任 |
| `03-详细设计.md` §14 / §15 | 已有业务审计、日志、指标和测试切口 | 避免新增配置审计事件契约 |

已确认结论:

```text
P0 配置变更不是在线管理操作。
code defaults 通过代码变更生效。
JSON config file 通过版本化文件变更生效。
environment variables 通过运行环境或 CI / job 环境变更生效。
CLI / job args 只影响本次入口选择或 operation-local 参数。
所有正式变更都在下一次 runtime / CLI / job 启动时加载和校验后生效。
回滚通过恢复上一版配置来源并重跑完成,不是 hot rollback。
```

## 3. SOP 问题回答

1. 哪些配置可以由谁变更?

   回答：code defaults 只能由代码实施者通过代码变更修改;JSON config file 由项目维护者或实施者修改;environment variables 由 CI、integration 或 candidate validation 执行者修改;CLI / job args 由当前命令或 job 调度者提供;future sensitive ref 只能由安全运维或部署运维在外层密钥 / 部署边界修改。L0-sdk 不内建身份校验,actor 来自外层流程、提交记录、CI metadata 或 job metadata。

2. 哪些配置变更需要评审?

   回答：进入版本化 JSON config file 或 code defaults 的正式变更需要 review。影响 source、boundary、runner、artifact、outbox、projection、language package、policy、CLI / jobs 的共享配置需要说明影响范围、验证方式和回滚方式。local-dev 临时 CLI / job args 可轻量处理;integration-test、candidate-validation、staging-like 和 production-like 的 env / sensitive ref 变更必须留痕。任何试图关闭 redaction、credential protection、fake marker 或 compatibility gate 的变更直接拒绝,不进入评审通过路径。

3. 变更如何生效?

   回答：P0 没有 reload / hot update。变更写入来源后,下一次 runtime / CLI / job 启动时由 Step 9 加载链生效。已经运行中的 job 不重新读取配置。高优先级来源非法时当前启动 fail-fast,不得自动回退低优先级继续运行。

4. 变更如何记录审计?

   回答：配置变更审计由来源侧记录和运行侧摘要共同承接。来源侧记录包括 commit / review、CI 变量变更、job 参数、部署记录或安全运维记录。运行侧摘要包括 profile、配置来源摘要、config fingerprint、actor_ref、trace_id、run_id、changed key、校验结果和脱敏错误类别。不得记录 raw secret、credential value、token、private key、生产请求 / 响应正文或完整外部响应。

5. 变更失败或效果异常如何回滚?

   回答：parse / type / cross-field / sensitive boundary validate 失败时本次启动或 job 失败,不修改当前 runtime。已提交的配置变更通过 revert JSON file、恢复 env、移除 CLI / job override、恢复上一版 sensitive ref 或回退代码默认值来回滚。回滚后必须重新启动 runtime / CLI / job 并重新经过 Step 9 校验。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| Step 7 配置项清单 | 已列配置项,但未定义变更责任和风险等级 | 实施者可能把 policy、boundary、runner、artifact root 当成普通参数随意改 |
| Step 8 敏感配置 | 已定义 sensitive ref 审计要求 | 需要形成统一变更表和回滚规则 |
| Step 9 生效机制 | 已确认无 reload / hot update | 需要明确回滚不是在线热回滚 |
| `03-详细设计.md` §14 | 业务审计事件已存在 | 04 不能静默新增配置审计事件或 DTO |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 变更责任 | 只知道配置来源 | 明确 code defaults、JSON、env、CLI / job args、sensitive ref 的变更主体 | 让实施和验收可追溯 |
| 评审要求 | 未区分风险 | 按低 / 中 / 高 / Critical 分级 | 防止安全门禁和候选验证被配置绕过 |
| 生效方式 | Step 9 只说明启动加载 | 明确下一次 runtime / CLI / job 启动生效 | 符合无热更新口径 |
| 审计方式 | 散落在敏感配置和观测章节 | 明确来源侧记录 + 运行侧摘要 | 不新增 03 audit event 也能留痕 |
| 回滚方式 | 未定义 | 恢复上一版配置来源并重跑 | 避免误以为存在 hot rollback API |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：在 SDK 内新增配置管理 API | 统一管理变更 | SDK 不是在线配置服务,会新增 03 契约 | 不采用 |
| 方案 B：通过版本化来源、CI / job / deployment 记录和运行侧摘要承接变更审计 | 符合 SDK runtime / CLI / jobs 形态,不新增代码契约 | 审计分散在外层流程和运行记录 | 采用 |
| 方案 C：支持 hot rollback | 使用体验灵活 | 与 P0 无 reload / hot update 冲突,需要复杂一致性设计 | 不采用 |
| 方案 D：local / CI / candidate 配置都不需要审计 | 最轻量 | candidate、evidence、reports 和安全门禁不可追溯 | 不采用 |

推荐方案 B。

原因:

- L0-sdk 的 P0 形态是 library + CLI + jobs,不是独立配置管理服务。
- 配置变更只需保证可追溯、可验证、可回滚,不需要内建在线管理 API。
- 不新增配置审计事件能避免与 `03-详细设计.md` 的业务审计契约冲突。

## 7. 结构化中间产物

#### 配置变更闭环图: L0-sdk 配置变更、审计与回滚

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
[next runtime / CLI / job start]
        |
        v
[load and validate config]
        |
        +--> [success: record effective summary]
        |
        +--> [failure: fail-fast / fail-closed]
                  |
                  v
              [restore previous source]
                  |
                  v
              [rerun runtime / CLI / job]
```

关键说明:

- 本图表达 P0 配置变更闭环,不表达在线配置中心或热更新。
- `review if required` 由配置来源、profile 和风险等级决定,不绑定具体工单系统。
- `record effective summary` 只能记录脱敏摘要、fingerprint、来源和校验结果。
- 回滚通过恢复上一版配置来源并重跑实现,不是运行时内存回滚。

### 7.1 配置变更表

| 变更类型 | 发起方 | 评审要求 | 生效方式 | 审计记录 | 回滚方式 |
|---|---|---|---|---|---|
| code defaults 变更 | 代码实施者 | 必须 code review;影响安全下限需设计复核 | 下次构建 / 发布后生效 | commit、review、release note | revert 代码或发布上一版 |
| JSON config file 变更 | 项目维护者 / 实施者 | 正式配置必须 review | 下一次 runtime / CLI / job 启动 | commit、review、config fingerprint、校验结果 | revert 配置文件并重跑 |
| environment variables 变更 | CI / integration / candidate 执行者 | local 可轻量;CI / candidate 必须留痕 | 下一次 runtime / CLI / job 启动 | CI / job 记录、actor_ref、trace_id | 恢复上一版 env 并重跑 |
| CLI / job args | 命令执行者 / job 调度者 | local 可轻量;candidate 必须记录原因 | 单次命令或 job 生效 | command / job receipt、run_id、脱敏参数摘要 | 移除 override 或恢复旧参数后重跑 |
| source path / snapshot ref 变更 | 项目维护者 / 实施者 | 高风险,必须评审 | 下一次 runtime / job 启动 | source 摘要、fingerprint、校验结果 | 恢复旧 source / ref 并重跑 refresh / validation |
| boundary ref 变更 | 集成执行者 / 运维执行者 | 高风险,必须评审;fake / formal 区分必须明确 | 下一次 runtime / job 启动 | redacted ref、boundary kind、actor_ref、trace_id | 恢复旧 ref 并重跑 boundary validation |
| runner / language package 变更 | 实施者 / candidate 执行者 | 中高风险,需说明影响语言和 evidence | 下一次 job 启动 | runner profile、language set、evidence result | 恢复旧 profile,重跑 candidate job |
| artifact / report root 变更 | 实施者 / CI 执行者 | 中风险;candidate / CI 必须留痕 | 下一次 runtime / job 启动 | root 脱敏摘要、run_id、写入结果 | 恢复旧 root,隔离错误产物,重跑报告 |
| outbox / projection / store root 变更 | 实施者 / 运维执行者 | 高风险,必须评审 | 下一次 runtime / job 启动 | state root 摘要、影响范围、校验结果 | 停止错误写入,恢复旧 root,按重建 / replay 处理 |
| policy 变更 | 架构 / 安全 / 实施者 | 高风险;降级类直接拒绝 | 下一次 runtime / job 启动 | policy key、旧值摘要、新值摘要、validator 结果 | 恢复旧 policy,重跑安全门禁 |
| future sensitive ref 变更 | 安全运维 / 部署运维 | Critical,必须安全或运维评审 | 下一次 runtime / job 启动或外部 adapter 重启 | redacted ref、actor_ref、trace_id、原因;不得记录 secret | 恢复上一版 ref 或 secret provider 版本 |

### 7.2 风险分级表

| 风险等级 | 适用变更 | 必须动作 |
|---|---|---|
| 低 | local-dev 临时 CLI / job args、个人本地路径 | 本地自检;不得进入正式配置 |
| 中 | CI path、artifact / report root、projection rebuild root、test fixture ref | 记录原因、run_id 和校验结果 |
| 高 | source、boundary、runner、language set、outbox、store、policy、compatibility gate | review、影响说明、回滚方案、重跑验证 |
| Critical | future secret / credential ref、关闭 redaction / credential / fake marker / gate 的尝试 | 安全或架构复核;绕过类配置直接拒绝 |

### 7.3 审计记录规则

| 审计位置 | 应记录 | 禁止记录 |
|---|---|---|
| 版本库 / review | 配置 key、变更原因、影响范围、回滚方式、review 结论 | raw secret、生产请求 / 响应正文 |
| CI / job 记录 | profile、run_id、配置来源、actor_ref、trace_id、校验结果 | secret value、credential value、完整敏感 ref |
| CLI / job receipt | 有效配置来源摘要、config fingerprint、operation、result | raw config value、token、private key |
| reports | profile、fixture / fake marker、artifact ref、validation result | 真实 credential ref 全文、生产响应正文 |
| logs / audit summary | 配置加载成功 / 失败类别、错误码、脱敏 key | raw body、secret、credential、完整外部响应 |

### 7.4 回滚规则

| 场景 | 回滚动作 | 验证动作 |
|---|---|---|
| parse / type / cross-field validate 失败 | 修正或恢复上一版配置来源 | 重新启动 runtime / CLI / job,确认通过 Step 9 校验 |
| 高优先级 env / CLI override 错误 | 移除 override 或恢复旧值 | 确认不再触发 fail-fast |
| source / snapshot ref 指错 | 恢复旧 source / ref,隔离错误派生产物 | 重跑 source refresh、candidate 或 validation |
| boundary ref 指错 | 恢复旧 boundary ref | 重跑 boundary validation,确认 fake marker / support 口径正确 |
| runner / language package 配置错误 | 恢复旧 runner / language set | 重跑 build / smoke / docs / compatibility |
| artifact / report root 指错 | 恢复旧 root,隔离错误输出 | 重跑报告生成,确认路径不含项目名重复层级 |
| outbox / projection / store root 指错 | 停止继续写入错误位置,恢复旧 root | 按 replay / rebuild / consistency check 处理 |
| policy 配置错误 | 恢复旧 policy | 重跑 redaction、credential、fake marker、compatibility gate |
| future sensitive ref 错误 | 恢复上一版 ref 或外部 secret 版本 | 重启相关入口,确认脱敏错误消失 |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 配置变更通过来源侧变更和下一次 runtime / CLI / job 启动生效 | 否 | 配置治理规则 | 无 | 无回写 |
| 不新增配置变更 API、配置管理 command 或配置审计 event | 否 | 避免新增代码契约 | 无 | 无回写 |
| 运行侧只记录脱敏有效配置摘要,不要求新增正式 audit event | 否 | 配置审计规则 | 无 | 无回写 |
| 如果后续要新增 `ConfigChanged` / `ConfigApplied` 审计事件或 config change object | 是 | audit event / DTO / application flow 变化 | `03-详细设计.md` §14 或 contracts 章节 | 待回写 |
| 如果后续要把 config fingerprint 放入正式 runtime DTO / event | 是 | runtime config / event 结构变化 | `03-详细设计.md` §13 / §14 | 待回写 |

说明:

- 本步没有新增 `SdkRuntimeConfig` 字段、adapter constructor 参数、trait 方法、错误枚举或审计事件。
- 本步的配置审计主要约束外层变更记录和运行侧脱敏摘要,不改变 SDK 现有业务审计事件表。

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §10。

````md
## 10. 配置变更、审计与回滚

> 校准来源：
> - `design-calibration/04_config_step_10_change_audit_rollback.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“配置变更闭环图”“配置变更表”“风险分级表”“审计记录规则”“回滚规则”和“对详细设计的影响判定”小节，了解本章变更治理如何收敛。

P0 配置变更不是在线管理操作。code defaults 通过代码变更生效;JSON config file 通过版本化文件变更生效;environment variables 由 CI / integration / candidate validation 环境提供;CLI / job args 只影响本次入口选择或 operation-local 参数。所有正式变更都在下一次 runtime / CLI / job 启动时经加载、解析、校验和装配后生效。

高风险配置包括 source、boundary、runner、language set、artifact / report root、outbox、projection、store、policy 和 future sensitive ref。这些变更必须有评审、影响说明、回滚方式和验证记录。local-dev 临时参数可以轻量处理,但不得进入正式配置。

配置变更审计由来源侧记录和运行侧摘要共同承接。来源侧包括 commit、review、CI、job、deployment 或安全运维记录;运行侧包括 profile、run_id、配置来源摘要、config fingerprint、actor_ref、trace_id 和校验结果。任何记录都不得包含 raw secret、credential、token、private key、生产请求 / 响应正文或完整外部响应。

P0 不支持 hot rollback。回滚通过恢复上一版配置来源并重新执行 runtime / CLI / job 完成。配置校验失败时必须 fail-fast 或 fail-closed,不得自动回退到低优先级配置继续运行。
````

## 10. 待确认事项

- 是否接受 P0 配置变更不是在线管理操作。
- 是否接受配置变更通过恢复来源并重跑来回滚。
- 是否接受高风险配置变更必须 review、留痕并说明回滚方式。
- 是否接受本步不新增配置变更 API、配置审计事件或 runtime config 字段。
- 是否接受本步无需回写 `03-详细设计.md`。

## 11. 进入下一步条件

- [x] 配置变更闭环图已明确。
- [x] 配置变更表已覆盖来源、风险、生效、审计和回滚。
- [x] 风险分级表、审计记录规则和回滚规则已明确。
- [x] 本步无需回写 `03-详细设计.md`。
- [x] Step 10 状态从 `[~]` 更新为 `[x]`。
