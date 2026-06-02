# Step 10. 定义配置变更、审计与回滚

> 本文件是 `projects/L1-conversation/04-配置设计.md` 的 Step 10 中间产物。
> 本步定义配置如何变更、评审、审计和回滚。
> 本步不绑定具体工单系统,不定义运行时 hot reload,不创建正式 `04-配置设计.md`。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 10
- 回填章节: `projects/L1-conversation/04-配置设计.md` §10 配置变更、审计与回滚

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_07_config_items.md` | 配置项清单、失败策略和完整配置 demo | 判断普通变更、高风险变更和禁止变更 |
| `04_config_step_08_sensitive_secrets.md` | 敏感 ref、明文禁止、轮换和审计边界 | 定义 sensitive-ref 变更的评审和脱敏审计 |
| `04_config_step_09_load_validate_apply.md` | P0 启动 / job 启动加载,不支持 reload / hot update | 定义生效和回滚方式 |
| `03-详细设计.md` §14.4 | 观测字段禁止表 | 限制审计和报告输出 |

已确认结论:

```text
P0 配置变更不做运行时 graph 热替换。
JSON / env / credential ref 变更通过重启 api / worker 或重新发起 job 生效。
配置变更审计只记录脱敏摘要、actor、trace id、config path、source 和 validation result。
安全边界、truth ownership、visibility、state machine、idempotency 和 audit chain 不能作为普通配置变更。
```

## 3. SOP 问题回答

### 3.1 哪些配置可以由谁变更?

| 变更对象 | 可发起方 | 说明 |
|---|---|---|
| local / CI JSON fixture | 开发者或测试执行者 | 仅用于 local-dev、ci-test |
| runtime JSON config file | 项目维护者或部署操作者 | 影响 api / worker / jobs 启动 |
| environment override | 部署操作者或 CI 维护者 | 只覆盖允许的普通配置项 |
| job local args | operations job 执行者 | 只影响本次 job invocation |
| credential ref / secret ref | 部署操作者或安全边界维护者 | 只能变更引用,不能写入 material |
| adapter kind | 项目维护者或部署操作者 | 从 fake 切 configured 必须评审 |
| security boundary policy | 不允许普通配置变更 | 需要回到设计链路 |

### 3.2 哪些配置变更需要评审?

必须评审:

- sensitive-ref 变更。
- `storage.*.kind` 从 `in_memory` 切到 durable-like。
- `outbox.publisher.kind`、resolver kind、handoff kind 切换到 `configured`。
- job batch、retry、timeout 超过默认安全范围。
- reports / artifacts root 指向 shared 或 production-like 目录。
- local / CI profile 切换到 integration-like、staging-like 或 production-like。
- 任何试图改变 redaction、forbidden body、visibility、truth ownership、state machine 或 audit chain 的配置。

可由测试流程直接管理:

- local-dev fixture 小范围调整。
- ci-test deterministic fake adapter 调整。
- job dry-run、run id、scope 或 batch 在默认范围内调整。

### 3.3 变更如何生效?

| 变更类型 | 生效方式 |
|---|---|
| JSON config file 变更 | 重启 api / worker 或重新发起 job 后生效 |
| env override 变更 | 重启对应入口后生效 |
| job local args 变更 | 仅本次 job invocation 生效 |
| credential ref / secret ref 变更 | 重启入口或重新发起 job 后生效 |
| provider material 轮换但 ref 不变 | P0 不直接处理;由 provider / 运维承接 |
| reload / hot update 请求 | P0 拒绝,不应用新配置 |

### 3.4 变更如何记录审计?

| 审计字段 | 说明 |
|---|---|
| actor / initiator | 发起者或执行上下文 |
| trace id | 关联日志、报告和配置校验结果 |
| change type | JSON file / env / job args / credential ref / forbidden attempt |
| config path | 配置项路径,例如 `outbox.publisher.kind` |
| source | defaults / JSON / env / entry local args |
| old summary / new summary | 脱敏摘要;sensitive-ref 只记录短摘要或 ref class |
| validation result | accepted / rejected / failed-fast / failed-closed |
| effective after | restart / job invocation / rejected |

不得记录 raw secret、raw token、完整 credential ref、private key、HTTP body、source body、runtime body、artifact body 或 debug dump。

### 3.5 变更失败或效果异常如何回滚?

| 场景 | 回滚方式 |
|---|---|
| 新配置 parse / validate 失败 | 新配置不生效;恢复上一份已知可用配置并重启 |
| job local args 非法 | 本次 job 失败;重新发起合法 job |
| configured adapter ref 不可用 | 新配置不生效或 adapter fail-closed;恢复旧 ref / fake profile 后重启 |
| redaction / forbidden boundary 命中 | 拒绝配置;不得自动降级 |
| 变更后业务效果异常 | 停止受影响入口,恢复上一份配置,重新执行配置校验和 smoke / integration check |
| reload / hot update 请求 | 直接拒绝;旧 runtime 保持不变 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| Step 7~9 | 已有配置项、敏感规则和生效机制,但没有变更治理 | 实施和运维可能把高风险项当普通参数 |
| Step 8 | 已有脱敏规则,但审计字段未落表 | 变更记录可能泄露敏感信息 |
| Step 9 | 已确认不支持 hot update,但回滚口径未说明 | 后续可能误写运行时 graph rollback |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 变更发起方 | 未定义 | 按开发、测试、部署、job 执行和安全边界职责分类 | 不依赖具体组织名称也能落地 |
| 评审规则 | 未定义 | sensitive-ref、adapter、store、profile 和安全边界变更必须评审 | 防止配置绕过红线 |
| 审计 | 只有输出防泄露规则 | 形成审计字段、脱敏摘要和禁止记录内容 | 可被测试验收引用 |
| 回滚 | 只知道 P0 冷更新 | 恢复旧配置并重启;不做 runtime graph rollback | 与 Step 9 生效机制一致 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 不绑定具体工单系统,只定义评审、审计和回滚要求 | 通用,不影响后续工具选择 | 实施计划需选择落地方式 | 采用 |
| 方案 B: 直接指定工单 / ITSM 系统 | 操作具体 | 当前未选型,会制造外部前提 | 不采用 |
| 方案 C: P0 支持运行时 graph rollback | 用户体验好 | 需要 reload、dual graph、adapter swap 和并发控制 | 不采用 |
| 方案 D: 允许 emergency bypass validator | 表面灵活 | 破坏安全、审计和一致性门禁 | 不采用 |

推荐方案 A。

原因:

- `04` 是配置设计,不应预设具体工单系统。
- P0 已明确冷更新,配置回滚 + 重启比运行时 graph rollback 更符合当前边界。
- 高风险和安全边界变更不能通过 bypass 规避 validator。

## 7. 结构化中间产物

### 7.1 配置变更表

| 变更类型 | 发起方 | 评审要求 | 生效方式 | 审计记录 | 回滚方式 |
|---|---|---|---|---|---|
| local / CI fixture 变更 | 开发者 / 测试执行者 | 不需正式评审,但需通过测试 | 下次测试运行 | test report 配置摘要 | 恢复 fixture 文件 |
| runtime JSON config 变更 | 项目维护者 / 部署操作者 | 中高风险项需评审 | 重启 api / worker / job | config path、old/new summary、validation result、trace id | 恢复旧配置并重启 |
| env override 变更 | 部署操作者 / CI 维护者 | 影响 adapter、sensitive-ref、policy 时需评审 | 重启入口 | env key 映射后的 config path 和摘要 | 移除 override 或恢复旧值 |
| job local args 变更 | job 执行者 | 高风险 job 需评审 | 本次 job invocation | job id、args summary、validation result | 重新发起合法 job |
| credential / secret ref 变更 | 部署操作者 / 安全边界维护者 | 必须评审 | 重启入口或 job restart | ref class、短摘要、adapter kind、validation result | 恢复旧 ref 或修复 provider |
| adapter kind 切换 | 项目维护者 / 部署操作者 | 必须评审且测试通过 | 重启入口 | old/new kind、profile、validation result | 切回旧 kind 并重启 |
| profile 切换 | 项目维护者 / 部署操作者 | 切到 integration-like / staging-like / production-like 必须评审 | 重启入口或 job restart | old/new profile、source、validation result | 切回上一 profile |
| security boundary 变更 | 不允许普通发起 | 必须重开设计校准 | 不通过配置生效 | rejected attempt | 不应用新值 |
| reload / hot update 请求 | 不允许普通发起 | 不适用 | P0 拒绝 | unsupported request | 旧 runtime 保持不变 |

### 7.2 审计与回滚规则

| 规则 | 内容 |
|---|---|
| 审计必须脱敏 | sensitive-ref 只记录短摘要或 ref class,不得记录 material |
| 变更必须可关联 | 记录 actor、trace id、source、config path、validation result |
| 新配置失败不生效 | parse / validate / build 失败时不构造新的 runtime |
| 不做 silent fallback | 高风险配置失败不得悄悄回退旧值并伪装成功 |
| 回滚必须重新校验 | 恢复旧配置后仍需执行 loader / validator / runtime builder |
| 禁止 bypass | emergency 场景也不得关闭 validator、redaction、audit 或 forbidden boundary |

### 7.3 变更审计链图

#### 变更审计链图: L1-conversation 配置变更审计链

```text
[change request]
  -> [classify config path and risk]
  -> [review if required]
  -> [update JSON / env / job args / ref]
  -> [ConfigLoader]
  -> [ConfigValidator]
  -> [RuntimeBuilder]
  -> [restart entry or run job]
  -> [redacted audit record]
  -> [smoke / integration check]
```

关键说明:

- 本图不表达运行时 hot reload。
- 配置文件落盘不等于生效,必须通过校验并重启入口或重新发起 job。
- 如果校验失败,新配置不生效,审计记录 validation failure。

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 配置变更通过重启或 job restart 生效 | 否 | 沿用 Step 9 生效机制 | 无 | 无回写 |
| 配置审计只记录脱敏摘要、actor、trace id、validation result | 否 | 沿用 `03` §14.4 redaction / audit 规则 | 无 | 无回写 |
| security boundary 不允许普通配置变更 | 否 | 沿用禁止配置化边界 | 无 | 无回写 |
| P0 回滚为恢复旧配置并重启,不做 runtime graph rollback | 否 | 配置治理规则细化 | 无 | 无回写 |

说明:

```text
本步没有新增 reload、dual graph、adapter swap、runtime rollback 或审计存储 API。
如果后续要求运行时 graph rollback,必须回到 `03-详细设计.md` 重新校准。
```

## 9. 回填草稿

正式 `04-配置设计.md` §10 建议采用以下结构:

```text
10. 配置变更、审计与回滚
  10.1 配置变更表
  10.2 审计与回滚规则
  10.3 变更审计链图
  10.4 对 03-详细设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §10.1 | `design-calibration/04_config_step_10_change_audit_rollback.md` §7.1 |
| §10.2 | `design-calibration/04_config_step_10_change_audit_rollback.md` §7.2 |
| §10.3 | `design-calibration/04_config_step_10_change_audit_rollback.md` §7.3 |
| §10.4 | `design-calibration/04_config_step_10_change_audit_rollback.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 11 的待确认事项。

后续 Step 必须继续收口:

- Step 11 定义缺失配置、错配置、secret provider 不可用和配置漂移的失败模式。
- Step 12 将配置变更审计和回滚要求交给测试、验收、实施和运维。
- `05/06` 后续需要把 high-risk config bypass 设为验收失败项。

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置变更表已形成 | 通过 | §7.1 |
| 审计与回滚规则已形成 | 通过 | §7.2 |
| 变更审计链图已形成 | 通过 | §7.3 |
| 对 03 影响已有判定 | 通过 | §8 当前无回写 |
| 可以进入 Step 11 | 通过 | 下一步定义失效模式与降级 / fail-fast 策略 |
