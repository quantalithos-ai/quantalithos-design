# Step 7. 定义接口、事件与跨仓同步验收

> 回填章节: `06-验收标准.md` §7 接口、事件与跨仓同步验收
> 状态: Completed

## 1. 本步输入

| 输入 | 用途 |
|---|---|
| `03` §7 | 13 Command、11 Query、7 inbound、10 outbound、7 job |
| `05` §6 / §13 | protocol / event / job 测试和证据 |

## 2. SOP 问题回答

1. 协议入口数量是什么?
   回答:13 Command、11 Query、7 Inbound Event Consumer、10 Outbound Event、7 Operations Job。
2. 下游未就绪时如何验收?
   回答:验 contracts、resolver / publisher / handoff fake 接缝、topic map、dedup 和 evidence;不要求下游完整生产实现。
3. fake 能否代表 production success?
   回答:不能。fake 必须有 marker,configured adapter unavailable 不得 fallback fake success。

## 3. 当前文档问题诊断

旧文档没有 public protocol 数量、event / job 证据和跨仓依赖类型的裁决表。

## 4. 结构化中间产物

| 协议组 | 正式入口 | 测试用例 | 证据 |
|---|---|---|---|
| Command | 13 Command | `TC-PROC-CMD-001~013`;`TC-PROC-CONTRACT-001~002` | `EV-SERVICE-001`;`EV-CONTRACT-001` |
| Query | 11 Query | `TC-PROC-QUERY-001~011` | `EV-SERVICE-002` |
| Inbound Consumer | 7 inbound events | `TC-PROC-EVENT-001~007` | `EV-WORKER-001` |
| Outbound Event | 10 outbound events | `TC-PROC-PUB-001` | `EV-WORKER-002` |
| Operations Job | 7 jobs | `TC-PROC-JOB-001~007` | `EV-JOB-001` |
| Config / adapter seam | configured / fake resolver、publisher、handoff | `TC-PROC-CONFIG-001~009`;`TC-PROC-P1-001` | `EV-INTEGRATION-002`;`EV-E2E-002` |

## 5. 回填草稿

§7 裁决 public protocol、event、job 和跨仓同步接缝是否与 `03` / `04` / `05` 闭合。

## 6. 待确认事项

P1 real-like adapter smoke 是否作为 release 阻断由风险接受和后续 `07` 决定,不阻塞 P0。
