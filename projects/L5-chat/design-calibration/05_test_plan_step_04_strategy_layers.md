# L5-chat 05 · Step 4 测试策略与分层

## 1. Step状态

> done / pass_with_upstream_blockers；2026-10-01。全部用例/证据/路径均planned，未执行。

## 2. 本步输入

已通过Step3；05 SOP Step4与书写规范5.4；03 Step16、04 §12；真相源§2.15/§7。复杂cut逐个收口，前序gate成立才创建本文件。

## 3. SOP问题回答

单元、组件、集成、系统、手工各测试什么？表明确；自动化以重复可靠调度为准，真实AT保留手工。

## 4. 当前文档问题诊断

以截图与集成fake统称E2E会混淆UI、SDK和host证据。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 以截图与集成fake统称E2E会混淆UI、SDK和host证据。 | 本步§7结构化结论 | 防止历史设计与当前owner合同分叉 |

## 6. 设计取舍与复杂度

选择成熟现有测试工具配合typed port，拒绝自研通用runner/复制backend harness。分层ASCII标明依赖与blocked层。

## 7. 结构化中间产物

### 4.1 分层与工具选择

#### 测试分层图: L5-chat

```text
+-----------------------------------------------------+
| 真实 Desktop / OS / AT 手工与自动化                  | 真实host批准前blocked
+-----------------------------------------------------+
| 正式 SDK integration / owner-safe query-change-result| runtime capability前blocked
+-----------------------------------------------------+
| Playwright shared-Web流程 / 用户交互                | fixture scope，不证明Desktop
+-----------------------------------------------------+
| Testing Library React组件 / 键盘 / IME / ARIA        | safe props + typed callbacks
+-----------------------------------------------------+
| Vitest TS factory/reducer/coordinator/port/repo/config| deterministic deferred ports
+-----------------------------------------------------+
| Rust native guard unit tests                        | 不冒充真实IPC或OS许可
+-----------------------------------------------------+
```

| 层 | 方法/边界 | fixture证明 | 不能证明 |
|---|---|---|---|
| unit | Vitest，纯函数/构造器、计数spy、immutable比较、fake clock | 本地guard/分支/error | SDK部署/owner提交 |
| component | React Testing Library+user-event；axe-core辅助扫描 | 可达性/回调次数/安全DOM/ARIA | 实际读屏等价体验 |
| shared-Web E2E | Playwright隔离browser context | 五tab与三层流程、目录与聊天协作体验 | Tauri IPC/OS窗口权限 |
| formal integration | 将来正式SDK/session，公开query/event/result能力 | 未bound时报告blocked | 不允许mock替代business proof |
| native unit | cargo test对应guard文件，注入可信policy fixture | allowlist/finite probe输出 | build签名/真实origin与OS |
| Desktop+AT | 将来真实OS窗口，实际键盘/读屏/重启 | 真实分层证据 | 无环境即blocked |
| architecture/report | AST依赖规则、JSON schema/digest/redaction自检 | 禁旁路、证据可追溯 | 不产生业务验收结论 |

仅选工具族，精确package/version/pins兼容需07锁文件与真实验证；未安装。snapshot/视觉比对只辅助行为断言，不替代单dispatch、权限、source/结果gate。
同一TC可跨参数行，不把unit/component证据升级成real integration。test support与fixture adapter只进入测试composition，不进入public contracts/production入口。

## 8. 回填草稿

正式05 §4回填本步§7全部表、步骤和schema。

## 9. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native/生产预算/版本兼容/质量仍open或blocked。真实正向不得由fixture解除。无当前测试结果、EV或readiness。

## 10. 自检与下一Step门禁

分层、工具、替身、真实环境与证据能力分开；无安装或执行。 本地设计gate pass_with_upstream_blockers；进入Step5，先读本产物/台账与对应SOP。
