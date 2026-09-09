# Step 14. 定义最终结论与签署口径

## 1. Step 状态

`completed / unsigned`。

## 2. 结论矩阵

| 维度 | 通过 | 有条件通过 | 不通过 |
|---|---|---|---|
| P0 AC | 全部真实通过 | 全部真实通过 | 任一失败/blocked/not_run |
| VETO | 全部无触发且有证据 | 不允许 VETO | 任一触发或缺证据 |
| defects | S/A=0 | 仅允许具名 B/P2 | S/A 或未裁决 harness |
| evidence | 同 run 完整、redaction/integrity 通过 | 同上 | 缺 raw/report/静态造证据 |
| external seams | 全部正式 manifest | 不允许 P0 seam 缺失 | 任一 required seam blocked |

## 3. 签署角色

| 角色 | 责任 | 当前 |
|---|---|---|
| Workspace implementation owner | 实现/修复事实 | 未指定、未签署 |
| Test owner | 覆盖、复验、raw/report | 未指定、未签署 |
| Security/data owners | visibility、redaction、数据边界 | 未指定、未签署 |
| Architecture/dependency owner | compile/runtime/event/ref/adapter 边界 | 未指定、未签署 |
| Acceptance owner | 最终三值裁决 | 未指定、未签署 |

签署只表示对应职责审查，不替代 raw evidence；不能由本 agent 伪造。

## 4. 回填与进入下一步

正式 §14 回填三值结论和角色表；当前结论实例为 `not_run/blocked`，不写“通过”。所有门禁已定义，允许 Step15 正式装配。
