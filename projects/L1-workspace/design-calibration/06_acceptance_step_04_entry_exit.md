# Step 4. 定义进入条件与退出条件

## 1. Step 状态

`completed / current_not_satisfied`。定义完整，当前未满足运行条件。

## 2. 分层进入条件

| 层 | 必要条件 | 当前 |
|---|---|---|
| 设计送验 | 00~05停审、AC/TC/EV/VETO映射完整 | 满足 |
| local/test | 实现仓、runner、builder、profile、隔离清理可用 | 未满足 |
| controlled | named fault/write spy/adapter 可执行 | planned |
| formal seam | owner query/visibility/event、bus、durable、secret、downstream manifest | blocked |

## 3. 退出条件

必须同时满足：P0 fixed run 完整；59 EV 有 raw/report；S=0、A=0；redaction/integrity/dependency 通过；formal seam 不 blocked；所有 VETO 有真实检查；风险接受文件完整；授权角色签署。当前全部真实运行条件均未满足。

## 4. 暂停/不可裁决

缺实现 revision、owner schema/decision、event order/replay proof、durable resolution、redaction scan、报告或 VETO source 时暂停；`blocked`/`pending` 不得升级为有条件通过。

## 5. 回填草稿与进入下一步

正式 §4 采用上述分层进入、退出和暂停清单。准则可裁决，允许进入 Step5 功能门禁。
