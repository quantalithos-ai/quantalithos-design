# Step 10. 定义回退、暂停与变更控制

## 1. Step 状态

`completed / rules_fixed`。

## 2. 暂停规则

| 触发 | 动作 | 保留 | 恢复条件 |
|---|---|---|---|
| 设计字段/DTO/状态/phase 不闭合 | 停当前 boundary，不改实现 | blocker note、当前 diff | 正式设计回写并新 baseline |
| owner/bus/durable seam 缺失 | 只做允许的 local/negative slice，正向停 | dependency/blocker record | versioned manifest |
| gate failed/blocked/not_run | 不进下一阶段 | raw/log/status | 修复后新 run |
| redaction/dependency boundary 失败 | 停止交付/送验 | scanner output | clean fixed run |
| 用户未授权 commit | 保持 working tree，不提交 | diff/台账 | 明确授权 |

## 3. 回退规则

已验证 boundary 只在其门禁保持可追溯时回退；不得删除或改写旧 raw/report。失败实现回退由实现仓 git/审查流程决定，当前设计仓不执行。未知提交结果不得盲目重做，先通过权威 lookup resolve。

## 4. 变更控制

public contract、状态/phase、事务/幂等/unknown、visibility/no-write、依赖/profile、report/EV schema 变化必须回开受影响 03/04/05/06/07 Step，更新 AC/TC/EV、boundary ledger 和新 design baseline；影响范围不明时全量 P0 回归。

## 5. 回填与进入下一步

暂停、回退、变更动作和恢复条件明确，允许 Step11。
