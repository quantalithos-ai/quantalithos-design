# Step 9. 定义非功能验收门禁

> 回填章节: `06-验收标准.md` §9 非功能验收门禁
> 状态: Completed

## 1. 本步输入

| 输入 | 用途 |
|---|---|
| `00` §13 / §14 | 非功能方向和 `AC-PROC-024`~`029` |
| `04` §6~§11 | profile、fail-fast、secret / config |
| `05` §10 | 非功能专项测试 |

## 2. SOP 问题回答

1. 性能是否写硬阈值?
   回答:当前不写旧版硬阈值。P0 要求生成 performance sample,不得成为主链瓶颈;硬阈值待性能基线或后续验收确认。
2. 安全和边界是否 P0?
   回答:是。raw body、raw secret、非 core 依赖和配置绕过红线均为 P0 阻断。
3. P1 real-like smoke 失败如何处理?
   回答:进入风险接受,不自动阻断 P0,但不能伪装 production success。

## 3. 当前文档问题诊断

旧文档继承固定 P95 阈值,但新版 `05` 明确性能样本暂不写硬阈值。新 `06` 不能重新引入无来源阈值。

## 4. 结构化中间产物

| NFR | 通过条件 | 失败条件 | 证据 |
|---|---|---|---|
| 性能样本 | `TC-PROC-NFR-001` 生成 sample report,无明显主链阻塞 | 无 sample report 或主链 timeout / hang | `EV-INTEGRATION-003` |
| 可用性 / 降级 | 外部依赖 unavailable 产生 delayed / failed / unresolved / partial surface,不造真相 | unavailable 被写成 accepted truth 或 silent success | `EV-INTEGRATION-001`;`EV-JOB-001` |
| 安全 / 红线 | forbidden body / raw secret / raw token 零命中 | redaction 命中或保存外部正文 | `EV-SCRIPT-001` |
| 配置 | invalid config fail-fast;configured unavailable 不 fallback fake success | silent fallback 或 fake production success | `EV-INTEGRATION-002` |
| 幂等 / 并发 | duplicate、conflict、version conflict、commit unknown 表现稳定 | 重复事实、多赢家或 blind retry | `EV-SERVICE-004`;`EV-INTEGRATION-001` |
| 可观测 | low-cardinality metrics、refs-only audit、safe logs | 高基数 label、raw body、secret 泄露 | `EV-SCRIPT-002` |

## 5. 回填草稿

§9 以非功能门禁表裁决性能样本、可用性、安全、配置、幂等和可观测,不写无来源硬阈值。

## 6. 待确认事项

性能硬阈值和 P1 real-like smoke release 策略由后续基线 / 风险接受确认。
