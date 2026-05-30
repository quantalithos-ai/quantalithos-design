# L0-bus 04 配置设计 Step 10: 配置变更、审计与回滚

> 本文件是 `projects/L0-bus/04-配置设计.md` 的 Step 10 中间产物。
> 本步定义配置如何变更、评审、审计和回滚。
> 本步不绑定具体工单系统,不创建正式 `04-配置设计.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 10 |
| 主题 | 定义配置变更、审计与回滚 |
| 状态 | 已确认 |
| 正式回填位置 | `04-配置设计.md` §10 |
| 是否修改正式 `04-配置设计.md` | 否 |
| 是否必须判定对 `03-详细设计.md` 的影响 | 是 |

---

## 2. 本步输入

| 输入 | 关键结论 | 本步使用方式 |
|---|---|---|
| `04_config_step_07_config_items.md` | 配置项清单、模块级 JSON demo、失败策略已定义 | 确定哪些配置变更属于普通、高风险或禁止 |
| `04_config_step_08_sensitive_secrets.md` | 敏感配置只保存引用,P0 冷更新,输出必须脱敏 | 确定敏感引用变更的评审、审计和回滚 |
| `04_config_step_09_load_validate_apply.md` | P0 不支持 reload / hot update;配置变更通过重启或 job restart 生效 | 确定生效和回滚方式 |
| `03-详细设计.md` §14 / §15 | 已定义审计、redaction 和测试切口 | 确定审计记录和验证门禁 |

---

## 3. SOP 问题回答

### 3.1 哪些配置可以由谁变更?

本步不绑定具体组织岗位或工单系统,只定义职责类型:

| 变更对象 | 可发起方 | 说明 |
|---|---|---|
| local / CI JSON fixture | 开发者或测试执行者 | 仅用于 local-dev、ci-test、integration-test |
| runtime JSON config file | 项目维护者或部署操作者 | 改变启动配置,必须经过校验后重启入口 |
| environment override | 部署操作者或 CI 维护者 | 只覆盖允许的普通配置项 |
| job local args | operations job 执行者 | 只影响本次 job invocation |
| secret / connection ref | 部署操作者或安全边界维护者 | 只能变更引用,不能写入 material |
| security boundary policy | 不允许作为普通配置变更 | 需要回到需求 / 架构 / 详细设计重新校准 |
| P1/P2 external backend kind | 不允许作为 P0 普通配置变更 | 需要对应 adapter、测试、验收和运维方案完成后再启用 |

### 3.2 哪些配置变更需要评审?

需要评审的变更:

- 任何 `sensitive-ref` 变更。
- `store.kind`、`transport_backend.kind`、`publisher.kind`、`projection.kind` 变更。
- `security_boundary.*` 任何变更,且默认视为不可通过配置直接变更。
- `recovery_policy.*` 变更。
- batch、timeout、poll interval 超过默认安全范围的变更。
- 从 in-memory / fixture profile 切换到 external profile。
- 从 local / test profile 迁移到 staging-like / production-like profile。

无需额外评审但仍需记录的变更:

- local-dev fixture 的 batch 小范围调整。
- ci-test 中 deterministic clock / id generator 的测试 fixture 调整。
- job local args 的 dry-run 或 batch 小范围调整。

### 3.3 变更如何生效?

P0 生效方式:

| 变更类型 | 生效方式 |
|---|---|
| JSON config file 变更 | 重启对应 API / worker 入口后生效 |
| env override 变更 | 重启对应入口后生效 |
| job local args 变更 | 仅本次 job invocation 生效 |
| secret / connection ref 变更 | 重启入口或重新发起 job 后生效 |
| provider 后端 material 轮换但 ref 不变 | adapter 下一次解析或重启后使用 provider 当前 material |
| reload / hot update 请求 | P0 拒绝,不应用新配置 |

### 3.4 变更如何记录审计?

配置变更审计只记录可安全输出的摘要:

| 审计字段 | 说明 |
|---|---|
| actor / initiator | 发起者或执行上下文 |
| change_type | JSON file / env / job args / secret ref / policy attempt |
| config_path | 配置项路径,例如 `worker.batch_size` |
| old_summary | 旧值摘要;敏感引用只记录短摘要 |
| new_summary | 新值摘要;敏感引用只记录短摘要 |
| source | defaults / JSON / env / job local args |
| validation_result | accepted / rejected / failed-fast / failed-closed |
| effective_after | restart / job invocation / rejected |
| trace_id | 关联日志和测试报告 |

不得记录完整 secret ref、密钥 material、完整 DSN、token、private key 或 provider private response。

### 3.5 变更失败或效果异常如何回滚?

P0 回滚口径:

- 配置解析或校验失败: 新配置不生效,入口启动失败;回滚为恢复上一份已知可用配置并重启。
- job local args 非法: 本次 job 失败,不影响全局配置;回滚为重新提交合法 job args。
- external kind 未实现或 provider 不可用: 新配置不生效;回滚为上一个可验证 adapter profile。
- 敏感引用失效: 新配置不生效;回滚为上一个有效 ref 或修复 provider 后重启。
- reload / hot update 请求: 直接拒绝,旧 runtime graph 保持运行,不需要运行时回滚。
- 变更后业务效果异常: 停止受影响入口,恢复上一份已知可用配置,重新执行配置校验和相关 smoke / integration tests。

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 配置变更治理未独立定义 | Step 7~9 已有配置项和生效方式,但未说明谁能改、哪些要评审 | 实施和运维可能把高风险配置当普通参数 | 本步按变更类型定义发起方和评审要求 |
| 审计摘要规则需要与敏感配置对齐 | Step 8 已有禁止输出规则,但变更审计还未落表 | 变更记录可能泄露敏感信息 | 本步定义审计字段和禁止记录内容 |
| 回滚口径需要与 P0 不支持 reload 对齐 | Step 9 说拒绝 reload,但配置变更失败如何恢复未整理 | 可能误写运行时回滚机制 | 本步明确 P0 回滚主要是恢复配置并重启 |
| P1/P2 external profile 需要变更门禁 | Step 7 提到 external kind 但 P0 不实现 | 后续可能直接改配置启用未实现 adapter | 本步要求先完成 adapter、测试、验收和运维方案 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 变更发起方 | 未定义 | 按开发、测试、部署、job 执行、安全边界维护职责分类 | 不依赖具体组织名称也能落地 |
| 评审规则 | 未定义 | 高风险项必须评审,安全边界不可普通变更 | 避免配置绕过设计红线 |
| 审计 | 只有 redaction 规则 | 变更审计字段、摘要方式和禁止记录内容明确 | 可被测试和验收引用 |
| 回滚 | 只知道 P0 冷更新 | 失败配置不生效,通过恢复上一份配置并重启回滚 | 与不支持 reload 的机制一致 |

---

## 6. 配置设计取舍

### 6.1 是否绑定具体工单系统

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 不绑定具体工单系统,只定义审计和评审要求 | 通用,不影响后续工具选择 | 需要实施计划选择具体落地方式 | 采用 |
| B. 直接指定某个工单 / ITSM 系统 | 操作具体 | 当前项目未选型,会制造外部前提 | 不采用 |
| C. 完全不写变更流程 | 简洁 | 高风险配置无法治理 | 不采用 |

结论: 配置设计只定义治理要求,不绑定具体工单系统。

### 6.2 回滚是运行时回滚还是配置回滚

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. P0 配置回滚 + 重启 | 简单,符合冷更新 | 需要短暂停机或重启入口 | 采用 |
| B. 运行时 graph 回滚 | 用户体验好 | 需要 reload、双 graph、adapter swap 和并发控制 | 不采用 |
| C. 按配置项区分 | 灵活 | 复杂且超出 P0 | 不采用 |

结论: P0 采用配置回滚 + 重启。运行时 graph 回滚属于 P1/P2。

### 6.3 高风险配置是否允许 emergency bypass

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 不允许绕过 validator 和安全边界 | 保持设计红线 | 紧急处理需要恢复旧配置或停入口 | 采用 |
| B. 允许 emergency bypass | 表面灵活 | 会破坏审计、安全和一致性 | 不采用 |
| C. 只允许人工确认 bypass | 看似受控 | 仍然绕过代码门禁 | 不采用 |

结论: 不提供 bypass。紧急恢复只能回滚配置、停用入口或切回可验证 profile。

---

## 7. 结构化中间产物

### 7.1 配置变更表

| 变更类型 | 发起方 | 评审要求 | 生效方式 | 审计记录 | 回滚方式 |
|---|---|---|---|---|---|
| local-dev / ci-test fixture 变更 | 开发者 / 测试执行者 | 不需要正式评审,但需通过测试 | 下次测试运行生效 | test report 记录配置摘要 | 恢复 fixture 文件 |
| runtime JSON config file 变更 | 项目维护者 / 部署操作者 | 中高风险项需评审 | 重启 API / worker 后生效 | 记录 config path、old/new summary、validation result、trace id | 恢复上一份已知可用配置并重启 |
| environment override 变更 | 部署操作者 / CI 维护者 | 影响外部 adapter、敏感 ref、policy 时需评审 | 重启入口后生效 | 记录 env key 映射后的 config path 和摘要 | 移除 override 或恢复旧值并重启 |
| job local args 变更 | operations job 执行者 | 高风险 job 需评审;普通 dry-run / batch 小调整可免评审 | 本次 job invocation 生效 | 记录 job id、args summary、validation result | 重新发起合法 job |
| secret / connection ref 变更 | 部署操作者 / 安全边界维护者 | 必须评审 | 重启入口或 job restart 后生效 | 记录 ref 类型、短摘要、adapter kind、validation result | 恢复旧 ref 或修复 provider 后重启 |
| adapter kind 切换 | 项目维护者 / 部署操作者 | 必须评审,且需要对应测试验收通过 | 重启入口后生效 | 记录 old/new kind、capability profile、validation result | 切回上一 adapter kind 并重启 |
| recovery policy 变更 | 项目维护者 / recovery 操作者 | 必须评审 | 重启入口或 job restart 后生效 | 记录 policy path、old/new summary、actor、trace id | 恢复旧 policy 并重启 |
| security boundary policy 变更 | 不允许普通发起 | 必须重开设计校准 | 不通过配置生效 | 记录 rejected change attempt | 不应用新值 |
| reload / hot update 请求 | 不允许普通发起 | 不适用 | P0 拒绝 | 记录 unsupported request | 旧 runtime graph 保持不变 |

### 7.2 审计与回滚规则

| 规则 | 内容 |
|---|---|
| 审计必须脱敏 | 敏感引用只记录短摘要,不得记录完整引用或 material |
| 变更必须可关联 | 记录 actor、trace id、source、config path、validation result |
| 新配置失败不生效 | parse / validate / build 失败时不构造新的 runtime graph |
| 不做 silent fallback | 高风险配置失败不得悄悄回退旧值并继续伪装成功 |
| 回滚必须重新校验 | 恢复旧配置后仍需执行 `ConfigLoader` / `ConfigValidator` |
| 安全边界不能 bypass | emergency 场景也不得关闭 validator、redaction、audit 或 forbidden boundary |

### 7.3 配置变更流程图

```text
change request
  -> classify config path and risk
  -> review if required
  -> update JSON / env / job args / ref
  -> ConfigLoader parses and merges
  -> ConfigValidator validates
  -> RuntimeBuilder builds or rejects
  -> restart entry or run job
  -> audit redacted change summary
  -> run smoke / integration check
```

图后说明:

- P0 不存在运行中替换 `RuntimeGraph` 的路径。
- 若 `ConfigValidator` 或 `RuntimeBuilder` 失败,新配置不生效。
- 对运行中入口,配置文件落盘本身不等于生效;必须重启入口。

---

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 配置变更通过重启或 job restart 生效 | 否 | 沿用 Step 9 生效机制 | 无 | 无回写 |
| 配置审计只记录脱敏摘要、actor、trace id、validation result | 否 | 沿用 `03` §14 redaction / audit 规则 | 无 | 无回写 |
| 安全边界 policy 不允许普通配置变更 | 否 | 沿用禁止配置化边界 | 无 | 无回写 |
| P0 回滚为恢复旧配置并重启,不做 runtime graph rollback | 否 | 配置治理规则细化 | 无 | 无回写 |
| 如后续要求运行时 graph rollback | 是 | 新增 reload / dual graph / adapter swap 机制 | `03-详细设计.md` §13 / §17 | 当前不采用 |

本步判定:

```text
Step 10 不要求回写 03-详细设计.md。

理由:
- 本步只定义配置变更治理、审计摘要和配置回滚方式。
- 没有新增 runtime reload、dual graph 或 adapter swap 机制。
- 没有改变配置加载、校验、装配函数签名。
```

---

## 9. 回填草稿

正式 `04-配置设计.md` §10 应从本文件摘录,不在回填草稿中重复完整表格。

建议回填结构:

```text
## 10. 配置变更、审计与回滚

> 校准来源:
> - `design-calibration/04_config_step_10_change_audit_rollback.md`
>
> 延伸阅读:
> - 建议继续阅读 Step 10 §7.1~§7.3,获取配置变更表、审计与回滚规则和配置变更流程图。

### 10.1 配置变更表

摘录 `04_config_step_10_change_audit_rollback.md` §7.1。

### 10.2 审计与回滚规则

摘录 `04_config_step_10_change_audit_rollback.md` §7.2。

### 10.3 配置变更流程图

摘录 `04_config_step_10_change_audit_rollback.md` §7.3。
```

回填时必须保留以下说明:

- 不绑定具体工单系统。
- 高风险配置必须评审、审计和可回滚。
- P0 回滚是配置回滚 + 重启,不是运行时 graph rollback。
- 安全边界 policy 不允许通过配置变更放宽。

---

## 10. 待确认事项

| 待确认项 | 可选方案 | 推荐方案 | 原因 | 当前处理 |
|---|---|---|---|---|
| 是否绑定具体工单系统 | A. 不绑定;B. 指定一个;C. 暂不写审计 | 推荐 A | 当前未选型,配置设计只定义治理要求 | 按 A 写入本步 |
| 回滚方式 | A. 恢复配置 + 重启;B. runtime graph rollback;C. 按项区分 | 推荐 A | 与 P0 冷更新一致 | 按 A 写入本步 |
| emergency 是否允许 bypass validator | A. 不允许;B. 允许;C. 人工确认允许 | 推荐 A | 不能绕过安全和一致性红线 | 按 A 写入本步 |
| sensitive ref 变更是否必须评审 | A. 必须;B. 可免评审;C. 按环境区分 | 推荐 A | 变更风险高且需要审计 | 按 A 写入本步 |

本步没有阻塞项。上述待确认项均已选择推荐方案作为当前配置设计口径。

---

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置变更类型已明确 | 已满足 | §7.1 覆盖 fixture、JSON、env、job args、sensitive ref、adapter kind、policy 等 |
| 高风险变更评审要求已明确 | 已满足 | sensitive ref、adapter kind、recovery policy 必须评审 |
| 审计记录规则已明确 | 已满足 | §7.2 定义脱敏摘要和 trace 关联 |
| 回滚方式已明确 | 已满足 | P0 采用恢复配置 + 重启 |
| 已判定对 `03-详细设计.md` 的影响 | 已满足 | §8 判定无回写 |

结论: Step 10 可以标记为已确认,并进入 Step 11“定义失效模式与降级 / fail-fast 策略”。
