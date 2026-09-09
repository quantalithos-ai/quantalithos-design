# Step 3. 收稳前置条件与阅读清单

## 1. Step 状态

`completed / blockers_preserved`。

## 2. 实施前必读

| 阶段 | 必读正式文档 | 需补读校准材料 |
|---|---|---|
| 全部 | 00~07、目录/编码/台账规范 | 对应本阶段 calibration Step |
| PH-01/02 | 03 §3~6、04 §3~7 | 03 Step3~7、07 Step4~6 |
| PH-03 | 03 §7~10、05 §3~6、06 §5/8 | 03 Step8~13、05 Step6、06 Step5/8 |
| PH-04/05 | 03 §9~12、05 §6/10/11、06 §8/11 | 03 Step9~13、05 Step10/11 |
| PH-06 | 04 §5~13、05 §8~10、06 §6/9/10 | 04 Step5~13、05 Step8~10 |
| PH-07/08 | 05 §9/13/14、06 §7/10~14 | 05 Step9/13/14、06 Step7/10~14 |

## 3. 工具、语言与目录

planned Rust 2024/MSRV 1.93；源码标识符、rustdoc、测试名默认英文；Tokio 仅边界/组装；目标实现仓 `quantalithos-workspace` 当前不存在。未来实施者必须先读提交规范、历史提交和代码实施台账规范，再确认 git user 配置。

## 4. 依赖检查

只有 `/home/aris/Projects/quantalithos-core` 作为 compile candidate；路径和真实 crate 布局需实施前检查。L0-bus、L1 owners、SDK/product/sync/archive 均使用 runtime/event/ref/adapter，不得写 Cargo path dependency。

## 5. 回填与进入下一步

未满足的仓、依赖、secret、transport、durable、crypto 条件均记录 blocker；允许 Step4。
