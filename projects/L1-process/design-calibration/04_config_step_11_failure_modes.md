# Step 11. 定义失效模式与降级 / fail-fast 策略

> 本文件是 `projects/L1-process/04-配置设计.md` 的 Step 11 中间产物。
> 本步定义配置缺失、错误、过期、不可达、漂移时的系统行为。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 11
- 回填章节: `projects/L1-process/04-配置设计.md` §11 失效模式与降级 / fail-fast 策略

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 7 配置项清单 | 枚举配置失败点 | 每个配置组必须有失败策略 |
| Step 8 敏感配置 | 定义 raw secret / ref 不可读策略 | raw secret fail-fast;runtime ref 不可读 fail-closed / explicit degraded |
| Step 9 加载校验 | 定义 startup / job-run failure | invalid config 不进入 runtime builder |
| `03_ddd_step_12_error_recovery.md` | 对齐错误恢复 | 配置失败不得写 accepted business truth |

## 3. SOP 问题回答

配置失效策略必须遵守:

- 高风险配置错误不得 silent fallback。
- configured adapter 不可用不得 fallback fake success。
- publisher / handoff / resolver 运行期失败按 Step 12 error recovery 映射 marker / retry / partial failure,不得回滚 committed truth。
- forbidden boundary violation 必须 reject。

## 4. 结构化中间产物

| 失效模式 | 影响 | 系统行为 | 是否告警 | 测试切口 |
|---|---|---|---|---|
| JSON config file 指定但不可读 | runtime 无法确定配置 | fail-fast,不启动 | 是 | config load invalid |
| JSON 解析失败或包含注释 | runtime 无法 parse | fail-fast | 是 | invalid JSON |
| JSON 内重复 key / alias key | 配置歧义 | fail-fast | 是 | duplicate key |
| env 高优先级值类型错误 | 高优先级非法 | fail-fast,不回退低优先级 | 是 | illegal env |
| 必填 configured ref 缺失 | adapter 不可构造 | fail-fast | 是 | missing endpoint / credential ref |
| raw secret / raw token 出现在普通配置 | 安全泄露风险 | reject config / fail-fast | 是 | redaction config scan |
| forbidden body allow-list 出现 | 试图绕过数据边界 | reject config / design violation | 是 | forbidden boundary config |
| unsupported config center / admin override | P0 不支持 | fail-fast unsupported profile | 是 | unsupported source |
| `store.adapter_kind = durable` 但缺 durable settings | store 不可构造 | fail-fast | 是 | durable unsupported |
| `boundary.max_page_limit < 1` | query guard 无效 | fail-fast | 是 | boundary validation |
| idempotency retention 短于 retry / redelivery | duplicate / rerun 不可靠 | fail-fast | 是 | retention cross-field |
| `reserved_record_max_age > command_retention` | reserved cleanup 语义矛盾 | fail-fast | 是 | reserved age validation |
| topic map 缺少某个 outbound event | publisher dispatch 不闭合 | fail-fast | 是 | topic map completeness |
| topic map breaking change 仍使用 `.v1` | 协议兼容性破坏 | fail-fast / design review required | 是 | topic compatibility |
| configured resolver 运行期不可达 | external snapshot / command validation 失败 | explicit unresolved / delayed / partial failure,不得 fake fallback | 是 | resolver unavailable |
| configured publisher 运行期失败 | outbox publication failed | retryable -> RetryPending;permanent -> Failed | 是 | publisher failure |
| configured handoff 运行期失败 | trace / archive handoff failed | retryable -> retry marker;permanent -> failed marker / partial job receipt | 是 | handoff failure |
| `features.search_enabled = true` 但无 search adapter | query path 不闭合 | fail-fast | 是 | feature dependency |
| `runtime.clock_kind` unsupported | timestamps 不可信 | fail-fast | 是 | runtime adapter validation |
| config drift between job run and report | evidence 不可复核 | job report records config digest;drift warning | 是 | report config digest |
| redaction check fails after report | artifact 泄露风险 | gate fail,report marked failed | 是 | redaction check |

## 5. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| invalid startup config 不进入 runtime builder | 否 | 配置失败策略 | 无 | 无回写 |
| configured adapter runtime failure 不回退 fake success | 否 | 配置安全语义 | 无 | 无回写 |
| publish / handoff / resolver failure 不回滚 committed truth | 否 | 承接 03 一致性规则 | 无 | 无回写 |

## 6. 回填草稿

`04-配置设计.md` §11 应输出失效模式表,覆盖配置文件不可读、解析失败、重复 key、非法 env、missing ref、raw secret、unsupported source、retention 冲突、topic map 缺失、configured adapter 不可达、redaction check fail 等情况。高风险失败必须 fail-fast / fail-closed,不得 silent fallback。

## 7. 待确认事项

- 无阻塞 Step 12 的待确认事项。
- 告警系统和告警阈值留给部署与运维手册。

## 8. 进入下一步条件

- 缺配置、错配置、敏感配置不可读、配置中心不可达、配置漂移均有策略。
- 高风险失败没有 silent fallback。
- 详细设计影响判定为无回写。
