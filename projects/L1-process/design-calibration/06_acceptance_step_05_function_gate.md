# Step 5. 定义功能验收门禁

> 回填章节: `06-验收标准.md` §5 功能验收门禁
> 状态: Completed

## 1. 本步输入

| 输入 | 用途 |
|---|---|
| `00` §14 | `AC-PROC-001`~`013` |
| `05` §5~§6 | `TC-PROC-*` 和 `EV-*` |

## 2. SOP 问题回答

1. 功能验收覆盖哪些项?
   回答:覆盖 `AC-PROC-001`~`013`,其中 `001`~`005` 是核心闭环,`006`~`013` 是 `FR-PROC-001`~`008` 功能能力。
2. 外围增强是否进入 P0?
   回答:不进入。`FR-PROC-E01`~`E05` 只作为后续专项或风险输入。

## 3. 当前文档问题诊断

旧功能门禁缺少 AC / TC / EV 对照,无法判断每条能力由哪份证据支撑。

## 4. 结构化中间产物

| AC | 功能 / 场景 | P0 证据 |
|---|---|---|
| `AC-PROC-001` | 运行时过程形态成立 | `TC-PROC-CMD-001~013`;`EV-SERVICE-001`;`EV-E2E-001` |
| `AC-PROC-002` | 项目过程实例成立 | `TC-PROC-CMD-001~013`;`EV-SERVICE-001`;`EV-DOMAIN-001` |
| `AC-PROC-003` | Activity / Token / Gateway 位置成立 | `TC-PROC-STATE-001~016`;`EV-DOMAIN-001`;`EV-E2E-001` |
| `AC-PROC-004` | waiting gate / checkpoint / recovery 连续成立 | `TC-PROC-RECOVERY-001~004`;`EV-INTEGRATION-001`;`EV-E2E-001` |
| `AC-PROC-005` | 授权消费和追溯成立 | `TC-PROC-QUERY-001~011`;`EV-SERVICE-002`;`EV-SCRIPT-003` |
| `AC-PROC-006` | runtime shape 形成能力 | `TC-PROC-CONTRACT-001`;`TC-PROC-CMD-001~013`;`EV-CONTRACT-001`;`EV-SERVICE-001` |
| `AC-PROC-007` | process instance 成立能力 | `TC-PROC-CMD-001~013`;`EV-SERVICE-001` |
| `AC-PROC-008` | 节点与流控表达能力 | `TC-PROC-STATE-001~016`;`EV-DOMAIN-001` |
| `AC-PROC-009` | Activity 反馈绑定能力 | `TC-PROC-EVENT-001~007`;`EV-WORKER-001` |
| `AC-PROC-010` | 暂停等待和恢复语境 | `TC-PROC-CMD-001~013`;`TC-PROC-RECOVERY-001~004`;`EV-INTEGRATION-001` |
| `AC-PROC-011` | 恢复连续性维护 | `TC-PROC-RECOVERY-001~004`;`TC-PROC-JOB-001~007`;`EV-INTEGRATION-001`;`EV-JOB-001` |
| `AC-PROC-012` | 消费与追溯能力 | `TC-PROC-QUERY-001~011`;`TC-PROC-SCRIPT-001~003`;`EV-SERVICE-002`;`EV-SCRIPT-003` |
| `AC-PROC-013` | 维护与对账能力 | `TC-PROC-JOB-001~007`;`EV-JOB-001`;`EV-E2E-001` |

## 5. 回填草稿

§5 使用门禁表列出 `AC-PROC-001`~`013` 的通过条件、失败条件和证据来源。

## 6. 待确认事项

无阻塞项。
