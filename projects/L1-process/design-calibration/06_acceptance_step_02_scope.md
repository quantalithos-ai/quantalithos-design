# Step 2. 明确验收目标与范围

> 回填章节: `06-验收标准.md` §2 验收目标与范围
> 状态: Completed

## 1. 本步输入

| 输入 | 用途 |
|---|---|
| `00` §14 | AC / VF 范围 |
| `03` §7~§16 | 详细设计验收对象 |
| `04` §6~§11 | P0 配置范围 |
| `05` §2~§6 | P0/P1/P2 测试范围 |

## 2. SOP 问题回答

1. P0 验收目标是什么?
   回答:裁决 `L1-process` 是否能作为过程执行事实真相仓成立。
2. P0 范围包含什么?
   回答:C-1~C-5、`FR-PROC-001`~`008`、`AC-PROC-001`~`029`、13/11/7/10/7 public protocol、16 状态机、配置和证据红线。
3. 非范围是什么?
   回答:production-like durable store、full BPMN、remote config、hot reload、real secret provider、完整部署 runbook 和容量趋势。

## 3. 当前文档问题诊断

旧文档把“流程能不能跑”作为笼统验收主语,没有把核心闭环、接口契约、配置和证据分层裁决。

## 4. 改动前后对比

| 项 | 旧版 | 新版 |
|---|---|---|
| 验收目标 | 模板 / 实例主线可运行 | Process truth、protocol、state、config、evidence 可裁决 |
| P1/P2 | 混入硬验收 | 只作风险或后续专项 |

## 5. 结构化中间产物

| 验收目标 | 优先级 | 裁决说明 | 证据入口 |
|---|---|---|---|
| 核心闭环成立 | P0 | C-1~C-5 全部成立 | `EV-E2E-001`;`EV-SERVICE-*` |
| 功能能力成立 | P0 | `FR-PROC-001`~`008` 有正式接口和证据 | `TC-PROC-CMD-*`;`TC-PROC-E2E-001` |
| 设计契约可验 | P0 | 协议、状态、事务、幂等、错误和观测可验证 | `EV-CONTRACT-001`;`EV-DOMAIN-001`;`EV-SERVICE-*` |
| 配置红线成立 | P0 | P0 profile、ref-only sensitive、topic map 和 fail-fast 成立 | `EV-INTEGRATION-002`;`EV-SCRIPT-001` |
| 证据可复核 | P0 | EV / TC / AC / design refs 和 path 固定 | `EV-SCRIPT-003` |
| real-like adapter smoke | P1 | 可选 selected run,失败进入风险接受 | `EV-E2E-002` |

## 6. 回填草稿

§2 明确 P0 裁决 Process truth center 和设计 / 配置 / 证据闭环;P1/P2 不阻断当前 P0 通过,但不得伪装成 production success。

## 7. 待确认事项

无阻塞项。P1 real-like adapter 是否阻断 release 交由风险接受和后续 `07`。
