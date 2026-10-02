# 04 Step 13：定义配置迁移、废弃与演进

## 1. Step状态

2026-10-02；`completed / selfcheck_done / stop_review`。本步定义envelope schema和配置项的兼容/废弃规则；当前不执行迁移、不切换profile、不引入新运行契约。

## 2. 本步目标

**目标**：保证配置未来演进不会悄悄新增业务能力、改变外部资格或迁移Marketplace业务状态。

### 本步输入

Step7严格项清单、Step9版本/加载、Step10快照回滚、03七字段/八slot和实现承接边界。

### 本步输出

版本策略、添加/废弃/迁移规则、重开触发条件和兼容性检查表，回填正式04§13。

## 3. 应问的问题与SOP回答

1. **版本放在哪里？** `schema_version`在JSON envelope中，仅供loader识别；`profile`同为metadata，不传播到domain。
2. **如何新增配置？** 先更新配置设计、schema校验、测试/验收矩阵；若新增RuntimeConfig字段、port、constructor、error、DTO或flow，必须先回写03并重新审查04。
3. **如何删除配置？** 经过明确的废弃窗口和运维批准；窗口结束后未知键拒绝。不得静默忽略旧键或把删除项映射为业务默认。
4. **如何迁移？** 只转换配置快照，不迁移listing/version/projection/cursor/operation/audit/work或owner正文；迁移失败保留旧快照。
5. **哪些变化必须重新打开设计？** 新slot、动态reload、TLS/auth独立字段、Billing/Archive/event lane、secret算法/协议、业务状态/approval/visibility配置以及任何影响03代码契约的变化。

### 当前材料问题诊断与取舍

旧材料没有schema版本、废弃窗口和“配置迁移不得迁移业务状态”的边界。采用envelope版本、显式兼容/拒绝和重开清单；不提供隐式默认或自动把旧键转换成业务策略。

### 改动前后对比

| 之前 | 本步后 |
|---|---|
| 配置演进可能静默增加字段 | 新字段先做03/04影响审计和schema更新 |
| 旧键可能被忽略 | 废弃窗口后未知键拒绝 |
| 迁移可能改写projection/operation | 迁移只处理配置表示和ref版本 |

## 4. 版本与兼容规则

| 变化 | 兼容策略 | 生效方式 | 失败策略 |
|---|---|---|---|
| 当前schema版本内补充已定义域的允许值 | 先扩展schema/测试，再按profile启用 | startup/build-time | 未知值拒绝 |
| 新增顶层域或配置项 | 先完成04/03影响审计；不提供隐式默认 | 新快照+重启 | 旧loader拒绝，不能静默忽略 |
| `schema_version` major不兼容 | 显式迁移工具/人工审查（未来） | 新快照 | 保留last-known-good |
| 配置项废弃 | 先告警/审计窗口，后schema拒绝 | 冷更新 | 旧项不再生效 |
| profile集合变化 | 先更新矩阵和门禁 | 新快照 | profile未知fail-fast |
| owner slot增加/替换 | 必须重开03/04并完成正式SDK/owner合同 | startup | 影响slot Blocked，不自动fallback |
| provider/secret算法变化 | 兼容窗口、轮换、回滚审查 | 受控重启 | 不明文降级 |
| state/approval/visibility/installed/paid规则变化 | 不得以配置迁移处理 | 需求/架构/03重开 | 当前配置拒绝该键 |

## 5. 迁移安全边界

配置迁移允许改变键的外部表示、profile元数据或ref版本，但不允许：

- 重算owner正文、Artifact/Method digest、签名/扫描结果或Governance决定。
- 复制第二套资产truth、改变current visibility/scope、改变listing/version状态。
- 移动或删除幂等key、原始operation、frame/CAS、audit/work、cursor或full result。
- 通过新增`auto_approve`、`force_installed`、`payment_success`、`enable_archive_lane`等键改变领域语义。

迁移执行前需完成schema静态检查、敏感项redaction检查、profile差异审计、last-known-good准备和05/06承接；本轮不生成迁移脚本、run或成功证据。

## 6. 重开触发清单

| 触发条件 | 重新打开内容 | 当前状态 |
|---|---|---|
| 新RuntimeConfig字段或非metadata配置域 | 03 Step14、04 Step3/7/9 | future/blocker |
| 新adapter kind或owner operation | 03 ports/协议/资格、04 owner清单 | future/blocker |
| hot/reload/config center/admin override | 03 builder/并发/审计、04 Step9/10 | 禁止当前启用 |
| Billing/payment/subscription/revenue/cross-border | 00/01边界、owner正式合同、03 scope | future/blocker |
| Archive/export/restore或active event/outbox | 00/01/02/03及04 control plane | future/blocker |
| TLS/auth/CORS成为typed server字段 | 03 RuntimeConfig/entry、04 inventory/secrets | pending owner/platform |
| secret provider或加密算法改变 | Step8/10/13及03 security | pending provider |

## 7. 详细设计影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| schema_version/profile仅envelope metadata | 否 | 兼容语义 | 03§13七字段约束 | 无回写 |
| 新字段/新slot/热更新须重开03 | 否 | 变更门禁 | 03§13/§16已有门禁 | 无回写 |
| 迁移不触碰业务projection/cursor/operation | 否 | 不变量复述 | 03§9～§13 | 无回写 |

## 8. 回填草稿、待确认与进入下一步条件

正式§13回填版本、废弃、迁移和重开触发规则；不写具体迁移命令、兼容结果或未来字段。待确认：provider/算法、平台版本策略和未来owner lane，进入Step14。

进入Step14条件：演进规则能区分配置表示变化与业务/代码契约变化；所有需要回写03的触发条件被显式列出。
