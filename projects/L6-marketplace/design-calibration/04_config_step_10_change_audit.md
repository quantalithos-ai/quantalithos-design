# 04 Step 10：定义配置变更、审计与回滚

## 1. Step状态

2026-10-02；`completed / selfcheck_done / stop_review`。本步定义冷更新和安全审计，不开放hot/reload，不建立新的业务audit对象或outbox。

## 2. 本步目标

**目标**：规定配置快照如何提出、校验、发布、审计和回滚，使配置变化不会改写Marketplace业务truth。

### 本步输入

Step5来源/冲突、Step8密钥轮换、Step9加载生效、03§10～§15事务/幂等/审计/观测边界。

### 本步输出

配置变更状态流、审计字段边界、回滚规则和变更停审记录，回填正式04§10。

## 3. 应问的问题与SOP回答

1. **配置是否热更新？** 否。所有server字段startup生效；Web API base build-time；变更需要生成新快照并重启/重建。
2. **如何识别快照？** 由外部发布系统或loader提供单调revision/受控fingerprint metadata；它不进入RuntimeConfig、业务key、audit truth或owner digest，也不在本轮生成实际digest。
3. **何时算可发布？** 新快照必须通过严格schema、关系、secret ref和profile检查；生产还需外部资格与容量门禁。配置通过不等于业务ready。
4. **如何审计？** 记录操作者类别、profile、配置域/slot、revision、结果、错误类别和redacted摘要；不记录secret、完整ref、body或凭证。
5. **如何回滚？** 只能重新指向上一个已验证快照并重启；不回滚listing/version/disposition/operation/notice/receiver状态，也不重试未知外部效果。

### 当前材料问题诊断与取舍

旧材料没有快照版本、审计字段或回滚边界，容易把配置回滚当成业务撤回。采用冷更新、last-known-good和安全摘要审计；配置revision/fingerprint只作发布元数据，不进入业务truth，也不生成实际证据。

### 改动前后对比

| 之前 | 本步后 |
|---|---|
| 逐项修改可能部分生效 | 新快照整体校验，失败保留旧快照 |
| 审计可能记录secret/body | 只记录域/slot/profile/结果的redacted摘要 |
| 回滚语义与业务状态混淆 | 回滚只重启配置，不触碰listing/version/operation |

## 4. 配置变更状态流

```text
[Proposed snapshot]
        |
        v
[schema/profile/ref validation]
        |
   +----+----+
   |         |
 invalid   valid
   |         |
 reject   [approved snapshot]
                 |
                 v
        [restart / rebuild]
                 |
          +------+------+
          |             |
       starts        fails
          |             |
          v             v
 [current config]  [retain last-known-good]
```

图示说明：

- 变更状态流只描述配置快照，不描述市场版本或外部分发状态。
- startup失败不把旧进程在内存中半切换；由运行平台保留上一个已验证快照。
- 当前没有在线reload、灰度配置中心或admin override，因此不设计热更新原子切换。

## 5. 变更审计字段

| 字段 | 是否记录 | 规则 |
|---|---:|---|
| `config_revision`或受控fingerprint | 是 | 仅作为发布元数据；不生成或声称实际digest |
| profile / schema_version | 是 | 有限枚举，不包含secret |
| 操作者类别 | 是 | 记录人类/自动发布器类别，不记录凭证 |
| 变更域 / owner slot | 是 | 记录有限allowlist；不记录完整ref |
| 校验结果 / 错误类别 | 是 | 使用03有限错误码或redacted config error |
| 生效方式 | 是 | startup/build-time/rejected |
| raw配置值 / secret / body | 否 | 永不进入日志、trace、metric或审计 |
| 业务operation、listing、version、payment | 否 | 不把配置发布伪装成业务事件 |

若未来需要持久化配置审计，它必须使用已有正式观察/审计合同；本轮不新增market event/outbox、Archive writer或第二套证据真相。当前安全诊断可按03§14有限label输出，丢失不触发业务replay。

## 6. 回滚与轮换规则

| 场景 | 处理 | 不允许 |
|---|---|---|
| 新快照schema无效 | 拒绝发布，保留旧快照 | 猜测默认值/部分应用 |
| 新secret ref不可解析 | 拒绝关键装配；owner/SDK可保持Blocked | 记录或输出raw secret |
| 重启后PG/SDK不兼容 | 服务不进入业务accepting状态；回到已验证快照 | 用fake替代生产adapter |
| 业务运行中发现配置错误 | 依照03入口/worker安全停机或能力Unavailable | 通过热补丁改变state/approval |
| 密钥轮换失败 | 保留旧已验证快照，等待provider修复 | 盲重试effect或清除历史 |
| 回滚到旧快照 | 受控重启，业务状态保持原样 | 回滚listing/version/operation或重发外部intent |

配置变更不会改变幂等key、canonical fingerprint、frame lock、CAS、current disclosure、撤回顺序或完整结果；这些是不受配置控制的03不变量。

## 7. 详细设计影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 版本化快照、startup冷更新、last-known-good | 否 | 变更语义 | 03§13.4已有startup/清理 | 无回写 |
| 审计只记安全摘要，不新增业务对象 | 否 | 观测边界 | 03§14已有redaction | 无回写 |
| 回滚不触碰业务状态/外部intent | 否 | 领域不变量复述 | 03§9～§13 | 无回写 |

## 8. 回填草稿、待确认与进入下一步条件

正式§10回填变更流、审计字段和回滚表；不写发布平台命令、真实revision、digest、运行报告或signoff。待确认：平台审计保留期、provider轮换窗口和运维批准流程，进入Step14；当前无03待回写项。

进入Step11条件：新旧快照、审计与回滚边界明确；失败不会部分切换或回滚业务truth。
