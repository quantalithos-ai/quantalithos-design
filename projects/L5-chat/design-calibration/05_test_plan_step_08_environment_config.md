# L5-chat 05 · Step 8 测试环境与配置矩阵

## 1. Step状态

> done / pass_with_upstream_blockers；2026-10-01。全部用例/证据/路径均planned，未执行。

## 2. 本步输入

已通过Step7；05 SOP Step8与书写规范5.8；03 Step16、04 §12；真相源§2.15/§7。复杂cut逐个收口，前序gate成立才创建本文件。

## 3. SOP问题回答

环境、依赖、配置、版本、隔离各是什么？§8.1～3逐profile与层列出；未批准真实层保持blocked。

## 4. 当前文档问题诊断

只有开发/生产环境名不能区分compile可用、SDK runtime与native/AT实际批准。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 只有开发/生产环境名不能区分compile可用、SDK runtime与native/AT实际批准。 | 本步§7结构化结论 | 防止历史设计与当前owner合同分叉 |

## 6. 设计取舍与复杂度

沿用04六catalog，三OS/AT仅候选待批准；隔离fixture层独立。拓扑明确compile/runtime/event，避免用Web验Desktop。

## 7. 结构化中间产物

### 8.1 六profile测试矩阵

| profile | platform/host | intended layer | SDK/public/runtime | native/质量门禁 |
|---|---|---|---|---|
| desktop-local | desktop/非空批准host alias | unit/component/nativeunit，future本机host | 正式sdkProfileRef required；fixture isolated | 真OS批准未闭，real blocked |
| desktop-ci | desktop/非空批准host alias | PR unit/component/static/config/report/nativeunit | profile valid≠registry bound | native unit≠真实IPC |
| desktop-staging | desktop/非空批准host alias | formalSDK/host/AT联调 | 每public能力与owner safe源逐项资格 | OS/AT/build/预算需真实批准，当前blocked |
| desktop-prod | desktop/非空批准host alias | future release smoke与批准质量验证 | 只能批准profile；禁fake/privatetoken | 不在当前部署或连接prod |
| web-preview-local | web_preview/显式null | sharedUI开发/E2E fixture | SDK-only，不提供desktop权限 | 不证明Desktop，native缺失explicit |
| web-preview-ci | web_preview/显式null | component/Web行为自动化 | 隔离fixture或批准formalSDK分别scope | 不顶替desktop-staging/release |

8域14叶子启动全量immutable，三安全叶缺省仅schemaVersion1/memoryOnlytrue/diagnosticdisabled。剩余11叶子required；八numeric测试值来自04批准示例与边界，不作为生产测量。无env/CLI/remote/admin/hot覆盖；runner --config-profile只选择测试catalog/source，不给app新增CLI。

### 8.2 环境拓扑图: L5-chat planned

```text
[test runner / approved profile source]
             | compile/type dependency
             v
[TS core + React UI] ----compile----> [public @quantalithos/sdk]
      | runtime adapter                    | runtime formal session
      +---- isolated test composition       v
      |                           [owner safe query/command/probe]
      | event/runtime              [SDK-qualified change/resume]
      +<---------------------------+
      |
      | controlled IPC technical probes
      v
[Tauri2 native host / approved origin-window policy]
      |
      v
[approved OS + AT]           (real capability/approval currently blocked)
```

compile依赖/运行时能力/事件输入分别标注。无UI↔ownerprivateAPI或bus路径。SDK package private0.1.0 skeleton与dist exports仅说明编译材料位置；无正式public capability/runtime wiring不能报告integration通过。版本兼容由07锁定与真实验证，不杜撰已安装版本。

### 8.3 Desktop/AT候选矩阵

| 候选组合 | 真实执行方法 | planned TC | 批准前状态 |
|---|---|---|---|
| Windows / NVDA | 真实Tauri窗口+键盘+读屏执行核心目标 | TC-REAL-002/003 | waiting/blocked；版本与支持范围未批准 |
| macOS / VoiceOver | 真实窗口/焦点/读屏/生命周期 | TC-REAL-002/003 | waiting/blocked |
| Linux / Orca | 批准发行版与WebView后验证 | TC-REAL-002/003 | waiting/blocked |
| Web Playwright候选Chromium/Firefox/WebKit | safe fixture流程、键盘与组件DOM；无host资格 | TC-AT-001～005 | planned preview-only |

候选三OS不是已承诺支持矩阵。精确OS、WebView、Tauri/Rust/Node/npm/React/browser/AT版本需批准。布局候选1280×800/640×600与200%zoom用于探测，不制造设备覆盖/性能门槛。运行环境artifact只存安全version/profile alias，无host路径、用户名、credential。


## 8. 回填草稿

正式05 §8回填本步§7全部表、步骤和schema。

## 9. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native/生产预算/版本兼容/质量仍open或blocked。真实正向不得由fixture解除。无当前测试结果、EV或readiness。

## 10. 自检与下一Step门禁

6profile名称/platform/hostcrossfield与04一致，无隐式env/AppCLI，真实层阻塞显式。 本地设计gate pass_with_upstream_blockers；进入Step9，先读本产物/台账与对应SOP。
