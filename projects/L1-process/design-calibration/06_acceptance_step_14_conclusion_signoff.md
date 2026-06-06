# Step 14. 定义最终结论与签署口径

> 回填章节: `06-验收标准.md` §14 最终结论与签署
> 状态: Completed

## 1. 本步输入

| 输入 | 用途 |
|---|---|
| 验收规范 | 三值结论 |
| Step 4 / Step 11 / Step 13 | 退出、veto、风险接受 |

## 2. SOP 问题回答

1. 最终结论有哪些值?
   回答:只允许通过 / 有条件通过 / 不通过。
2. 有条件通过的条件是什么?
   回答:P0 门禁成立、无 veto、无 S / P0 A、残余风险已具名接受。
3. 签署是否等于风险接受?
   回答:不等于。风险接受必须在 §13 独立记录。

## 3. 当前文档问题诊断

旧文档使用占位式结论,没有绑定 baseline、run_id、reports 和签署角色。

## 4. 结构化中间产物

| 结论 | 条件 | 后续 |
|---|---|---|
| 通过 | 全部 P0 门禁通过;无 veto;S=0;P0 A=0;证据完整 | 可进入下一阶段 |
| 有条件通过 | P0 主线成立;仅有已接受残余风险 | 可进入下一阶段,但必须跟踪条件 |
| 不通过 | P0 失败、veto、S 级、P0 A、redaction fail、P0 evidence missing | 修复后重验 |

| 签署角色 | 职责 |
|---|---|
| Product / Domain Owner | 验收目标与风险接受 |
| Architecture Owner | 架构红线和依赖边界 |
| Test Owner | 测试证据和缺陷复验 |
| Security / Operations Owner | redaction、config、handoff 和运行风险 |
| Implementation Owner | implementation commit、build 和修复承诺 |

## 5. 回填草稿

§14 固定三值结论、签署表、结论记录字段和归档路径。

## 6. 待确认事项

真实签署人由送验评审填写。
