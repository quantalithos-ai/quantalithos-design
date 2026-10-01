# L5-chat 05 · Step 2 本次测试目标与范围

## 1. Step状态

> done / pass_with_upstream_blockers；2026-10-01。全部用例/证据/路径均planned，未执行。

## 2. 本步输入

已通过Step1；05 SOP Step2与书写规范5.2；03 Step16、04 §12；真相源§2.15/§7。复杂cut逐个收口，前序gate成立才创建本文件。

## 3. SOP问题回答

本轮验证什么、不验证什么、如何优先？§2.1层次与owner排除、§2.2风险要求给出执行范围，不承诺通过率。

## 4. 当前文档问题诊断

旧计划按按钮/页面分组遗漏并发、撤销和source归属，增强功能被混为当前交付。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 旧计划按按钮/页面分组遗漏并发、撤销和source归属，增强功能被混为当前交付。 | 本步§7结构化结论 | 防止历史设计与当前owner合同分叉 |

## 6. 设计取舍与复杂度

以真实契约风险定义P0，正常/异常成对；保留增强激活条件。范围表无需另画流程图。

## 7. 结构化中间产物

### 2.1 目标、范围和排除

| 范围 | 目标 | 层/当前状态 |
|---|---|---|
| 本地10模块+native host | 初始化、pure reducer、CAS、内存repo、safe view、SDK adapter、host guard | 所有测试planned |
| 43协议 | 每协议正向、异常/late、零越权副作用 | 隔离fixture可验证本地合同；真实消费blocked |
| 17状态主体 | 全部合法矩阵行、逐guard缺失、全部非法行 | parameterized rowsets，不只共享enum |
| 项目/流程/目录 | 五tab、whole→stage→node、并行/汇聚/循环、多群一项目、独立成员、全公司覆盖 | UI行为与正式资格化分别验证 |
| 发送/Gate/恢复 | 单dispatch、frozen draft、formal result、unknown、revoke优先 | P0安全/一致性 |
| 配置与安全 | 8域14叶子/6profiles/12cuts、严格JSON、无private API/bus/secret | P0拒绝边界 |
| Desktop/AT | 真实窗口/IPC/重启/键盘/IME/读屏、安全图表等价 | OS/native合同未定，真实gate blocked |
| 非功能 | 资源有界/可恢复/安全/可观测/兼容 | hard guard可定义；生产预算实测待批准 |
| 外围增强F-E01～04 | 授权搜索、通知快捷键、富文本引用、mobile | 缺正式能力不激活；mobile仅保留接口，V1不交付 |

不测试owner的内部数据库、Runtime推理、Tools执行、Bridges mapping、Observability backend实现；改为客户端不得旁路与safe摘要不能成为审批/验收truth的断言。无后端事务回滚：Chat验证一CAS失败root/slice/watermark全不变、hide先于清理且失败不回滚撤销。

### 2.2 风险与优先级

| 优先级 | 判定 | 退出要求 |
|---|---|---|
| P0 | 七条否决、权限/secret、single dispatch、unknown、防旧slot/父图/目录串权、配置fail-closed | 全部对应cases、matrix行与真实必要层有证据；缺失/blocked不能通过 |
| P1 | 正常布局、非关键空/失败文案、非敏感兼容体验 | 问题有责任人/复验记录；不能覆盖P0失败 |
| P2 | 未激活增强/视觉优化 | 明确scope与后续授权，不能冒充V1交付 |

本文所有正式cases采用P0以覆盖当前契约安全主线；视觉golden只辅助，不设虚构覆盖率。测试计划完整与测试执行完成分开。

## 8. 回填草稿

正式05 §2回填本步§7全部表、步骤和schema。

## 9. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native/生产预算/版本兼容/质量仍open或blocked。真实正向不得由fixture解除。无当前测试结果、EV或readiness。

## 10. 自检与下一Step门禁

范围、层、优先级与七条否决方向一致；没有新增业务能力。 本地设计gate pass_with_upstream_blockers；进入Step3，先读本产物/台账与对应SOP。
