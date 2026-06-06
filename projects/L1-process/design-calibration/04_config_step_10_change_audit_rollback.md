# Step 10. 定义配置变更、审计与回滚

> 本文件是 `projects/L1-process/04-配置设计.md` 的 Step 10 中间产物。
> 本步定义配置如何变更、评审、审计和回滚。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 10
- 回填章节: `projects/L1-process/04-配置设计.md` §10 配置变更、审计与回滚

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 7 配置项清单 | 确定变更对象 | P0 变更仅涉及已定义配置项 |
| Step 8 敏感配置 | 确定脱敏审计 | ref-only sensitive 只记录 redacted ref / hash |
| Step 9 生效机制 | 确定 rollback 方式 | P0 无 hot rollback;通过恢复上一份 config 并重启 / rerun |

## 3. SOP 问题回答

### 3.1 哪些配置允许变更?

P0 允许变更普通配置值、profile、adapter kind、endpoint / credential / destination ref、topic map、batch、timeout、retry、retention、feature switch 和 runtime clock / id kind。变更后必须重新执行完整 validation。

### 3.2 变更如何生效?

- startup 配置: 更新 JSON / env / config source 后重启 runtime。
- job-run-start 配置: 新 job run 读取新配置;已启动 job 使用 run start 时冻结的配置。
- entry local args: 只影响本次入口或本次 job run。

### 3.3 高风险配置变更需要什么评审?

高风险配置包括 store adapter、external endpoint / credential ref、outbox publisher、topic map、handoff target、idempotency retention、feature switch、forbidden boundary 相关配置。高风险变更必须经过设计 / 实施 / 运维评审,且不得直接修改 truth ownership 或安全红线。

### 3.4 审计记录哪些字段?

审计记录只保存:

- config key。
- source type。
- old value digest / redacted ref。
- new value digest / redacted ref。
- actor / operator。
- change reason。
- validation result。
- applied profile。
- trace context / change ref。
- effective mode: restart / new job run / rejected。

不得保存 raw secret、raw token、external body 或完整 provider response。

### 3.5 回滚方式是什么?

P0 回滚通过恢复上一份 JSON / env / config source 并重启 runtime,或重新运行 job 使用上一份配置。非法新配置必须 reject-new-value,保持当前 runtime 不变。没有 hot update,所以不存在运行中 partial apply。

## 4. 结构化中间产物

### 4.1 配置变更表

| 变更类型 | 发起方 | 评审要求 | 生效方式 | 审计记录 | 回滚方式 |
|---|---|---|---|---|---|
| defaults 变更 | developer | 设计 / code review | build / startup | commit ref、config key、validation | revert commit / release |
| JSON file 变更 | operator / developer | 普通配置 review;高风险配置需 design review | restart / new job run | file digest、changed keys、redacted values | 恢复上一版 JSON 并重启 / rerun |
| env override 变更 | CI / operator | 高风险需 review | restart / new job run | env key、redacted value hash、source | 恢复上一版 env |
| entry local args | operator / test runner | job scope / run id review | single entry / job run | args digest、run id、outcome | rerun with previous args |
| endpoint / credential ref 变更 | operator / security | security review | restart | redacted ref / hash、actor、reason | 恢复上一 ref 并重启 |
| topic map 变更 | developer / operator | protocol compatibility review | restart | changed event key、old / new topic | 恢复上一 map;breaking change 需新 topic suffix |
| retention / retry 变更 | developer / operator | data consistency review | restart / new job run | old / new digest、cross-field validation result | 恢复上一策略 |
| feature switch 变更 | developer / operator | design review | restart | feature key、old / new value、dependency check | 恢复上一值 |
| unsupported config center / admin override | 不允许 P0 | 不适用 | reject | attempted source and reason | 无应用,无需回滚 |

### 4.2 变更审计链图

#### 变更审计链图: L1-process 配置变更审计

```text
[change request]
  -> [review if high risk]
  -> [load candidate config]
  -> [validate candidate config]
  -> [reject-new-value or apply by restart / new job run]
  -> [write redacted audit record]
  -> [rollback by previous config source when needed]
```

关键说明:

- 图表达配置变更治理链,不表达具体工单系统。
- P0 无运行中 partial apply。
- 审计记录必须脱敏。

## 5. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 变更通过配置源更新 + restart / new job run 生效 | 否 | 配置治理语义 | 无 | 无回写 |
| 审计记录只保存 redacted value / hash | 否 | 配置安全语义 | 无 | 无回写 |
| P0 无 hot rollback / partial apply | 否 | 配置生效语义 | 无 | 无回写 |

## 6. 回填草稿

`04-配置设计.md` §10 应写明 P0 配置变更只通过 defaults、JSON、env 和 entry local args 表达。startup 配置变更通过重启生效,job 配置通过新 job run 生效。配置变更审计只记录 key、source、redacted ref / digest、actor、reason、validation result 和 outcome。非法新配置必须 reject-new-value。

## 7. 待确认事项

- 无阻塞 Step 11 的待确认事项。
- 具体工单系统、secret provider 和生产 rollout 工具留给部署与运维手册。

## 8. 进入下一步条件

- 高风险配置变更有评审、审计和回滚口径。
- raw secret 不进入审计。
- 详细设计影响判定为无回写。
