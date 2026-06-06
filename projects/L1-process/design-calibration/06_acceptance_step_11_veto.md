# Step 11. 定义一票否决项

> 回填章节: `06-验收标准.md` §11 一票否决项
> 状态: Completed

## 1. 本步输入

| 输入 | 用途 |
|---|---|
| `00` §14.2 | `VF-PROC-001`~`008` |
| Step 6 / Step 10 | 红线和证据失败映射 |

## 2. SOP 问题回答

1. 一票否决项是否可风险接受?
   回答:不可。任一 veto failed 时结论只能是不通过。
2. 一票否决项覆盖什么?
   回答:核心闭环断裂、相邻仓正文入仓、process/work/runtime/governance 边界混淆、维护反写、恢复分叉、非 core 编译期依赖。

## 3. 当前文档问题诊断

旧文档没有把一票否决项编号化,也没有说明 veto failed 不得有条件通过。

## 4. 结构化中间产物

| Veto | 失败条件 | 证据入口 |
|---|---|---|
| `VF-PROC-001` | C-1~C-5 任一核心闭环失败 | `EV-E2E-001`;`EV-SERVICE-*` |
| `VF-PROC-002` | method-library definition / content body 被 Process 接管 | `EV-SCRIPT-001` |
| `VF-PROC-003` | ProcessInstance / Activity / Token 等同 WorkItem / Iteration / runtime step truth | `EV-DOMAIN-001`;`EV-E2E-001` |
| `VF-PROC-004` | waiting gate / pause context 写成 governance Gate / Policy / decision truth | `EV-INTEGRATION-001` |
| `VF-PROC-005` | artifact / runtime / identity / conversation / workspace / observability / archive 正文保存为 Process 数据 | `EV-SCRIPT-001` |
| `VF-PROC-006` | Query / projection / report / recovery / maintenance 隐式创建或推进过程事实 | `EV-SERVICE-002`;`EV-JOB-001` |
| `VF-PROC-007` | 恢复产生第二份过程真相或关键变化不可追溯 | `EV-INTEGRATION-001`;`EV-SCRIPT-003` |
| `VF-PROC-008` | 非 core sibling repo 成为 package dependency | `EV-SCRIPT-002` |

## 5. 回填草稿

§11 逐项列出 `VF-PROC-001`~`008`;任一 failed 时不得通过或有条件通过。

## 6. 待确认事项

无阻塞项。
