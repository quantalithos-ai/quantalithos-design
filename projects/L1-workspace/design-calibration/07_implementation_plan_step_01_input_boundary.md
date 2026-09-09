# Step 1. 确认实施输入边界

## 1. Step 状态

`completed / pass_with_external_slots`。

## 2. 正式输入

| 输入 | 实施用途 | 事实限制 |
|---|---|---|
| 00 | FR/BR/NFR、owner边界和 blocker | 不改需求 |
| 01 | 依赖裁剪、部署/协作边界 | 不改总体架构 |
| 02 | CP、对象、入口、flow 轮廓 | 不新增能力 |
| 03 | 77 planned files、16对象、7 service、14协议/flow、状态/事务/恢复 | 文件不是源码 |
| 04 | profiles、limits、bindings、secret、失效 | 不写实际值 |
| 05 | 59 TC/EV、13 suites、脚本和退出准则 | 不写执行结果 |
| 06 | AC、VETO、三值放行和证据门禁 | 不写验收结论 |

## 3. 外部输入与 blocker

WS-UP-001~008/006-S、WS-LOCAL-001~003 直接影响正向实现；owner safe query/event/visibility/attention、L0-core 专用合同、durable driver、transport/schema、crypto/UUID/CSPRNG 均待闭合。实现计划记录 blocker，不在 workspace 自行补上游真相。

## 4. 回填与进入下一步

正式 §1 列出上述输入和事实边界；允许 Step2。
