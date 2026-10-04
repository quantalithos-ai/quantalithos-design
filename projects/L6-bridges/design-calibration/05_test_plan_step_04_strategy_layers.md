# L6-bridges 05 Step4：策略与分层

## 1. Step状态与开工确认

2026-10-04；仅05获授权；full-restart / single-agent-serial。此步先骨架，不提前创建未来Step或正式正文。

| 模块 | 骨架 | 思考 | 写入 | 自检 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|---|---|---|
| strategy_layers | done | done | done | pass_design_static | pass | step_design_review_complete_external_gates_open | begin_step05_skeleton | 本Step§2/7；实际静态审计 |

### Step内计划

| 小阶段 | 状态 |
|---|---|
| 输入/前序阅读 | done |
| SOP问题回答 | done |
| 当前材料诊断 | done |
| 测试设计取舍 | done |
| 结构化/逐切口停审 | done |
| 复杂度与批次判断 | done |
| 回填草稿 | done |
| 实际自检/下一条件 | done |

## 2. 本步输入

已回读Step3切口/源审计与03§15/16.3；SOP Step4、书写§5.4。Step3曾有表间空行和audit包含已到达Step4空骨架误报；已修连续表格并限制审计范围到当前完成Step，补表块delimiter检查，复跑Step3 errors=[]，非业务修订。

## 3. SOP问题回答

1. codec/typed refs/19对象factory与21机guard、配置parse边界必须在unit发现。
2. service验证19flow参数顺序/current/全阶段U，fake脚本显式返回typed结果与实际调用计数。
3. 同driver actual commit、shared rate/source/四平台需要integration；fake journal只机制验证，不给存储准入。
4. API/Worker/Job实际dispatch/ACK/cancel/ownership/source排他须entry契约。
5. E2E/release只在准入/安全sandbox/真实版本成立时，以原身份安全正向+未知恢复证明消费seam；不取代低层P0。

## 4. 当前材料问题诊断

只用金字塔图无法说明某case需要actual driver还是脚本假设。suite和qualification维度必须正交，synthetic pass不可汇总成real pass。报告工具自身必须有负向suite，不能依赖人为读报告。

## 5. 改动前后对比

| 容易混同 | 本轮处理 |
|---|---|
| 低层fake=真实存储原子性 | local机制与actual STORE资格分报告 |
| API ACK=业务完成 | entry验证phase分离，owner assertion留service/real |
| E2E包办全部P0 | unit→service→integration→entry→actual seam，各层独立阻断 |
| 测试报告没有测试 | TOOLS自校验作为P0门禁，EVIDENCE cut独立 |

## 6. 测试设计取舍与复杂度

沿03十一target，suite直接以target简称登记SUITE-S~J；另TOOLS组合S/P及planned检查脚本，REAL在同一target受控real-seam模式，不新造Rust文件。图不暗示local可升级actual。约90行，以层表/cut映射分批。

## 7. 结构化中间产物

### 7.1 测试分层图: L6-bridges 风险发现与资格

```text
[Unit: S/D, strict schema + pure guards]
                 |
                 v
[Service: A/C/R, scripted ports + no forbidden calls]
                 |
                 v
[Integration: B/L/P, typed adapter/store/private contracts]
                 |
                 v
[Entry: I/W/J, trusted dispatch + owned resources + ACK]
                 |
                 v
[Qualified real seams: approved pin/account/driver/owner/producer]
                 |
                 v
[Fixed-run report + human acceptance handoff (no automatic verdict)]

[TOOLS S/P + safe evidence check] -- validates --> [every layer output]
[Synthetic pass] -- never releases --> [real qualification]
```

关键说明：上层不替代下层断言；跨phase结果独立。actual seam缺资格为blocked，不能跳过后声明E2E通过。图中箭头为验证依赖，不是compile依赖。

### 7.2 分层、suite与失败处理

| 层/套件 | 目标与内容 | 执行时机（planned） | 失败是否阻断 |
|---|---|---|---|
| Unit SUITE-S/D | 全20协议codec/refs与factory/hydrate/全部pair；零IO/失败不变；harness schema自测 | 每变更、PR | 任一P0 fail/缺参数实例阻local |
| Service SUITE-A/C/R | 当前binding/Policy、19flow、原key/unknown/cursor/fullU、Query no-write | 每业务/协议变更、PR | fail/漏断言/脚本未消费阻local |
| Integration SUITE-B/L/P | 四平台typed转换、same-driver/unique/CAS/actual proof、secret/private禁出口；mode区分synthetic/real-seam | PR synthetic；qualified driver运行actual | synthetic fail阻local；real缺资格阻real，不容用fake补 |
| Entry SUITE-I/W/J | 七bin三参数/required、source模式、ACK/dispatch、cancel/shutdown/batch/实际summary | 每entry/config/资源变更、PR | 不完整/非法IO/unknown丢失阻local |
| TOOLS（S/P及检查脚本） | 安全产物DTO、digest关联、枚举/漏case/伪pass/泄露/路径自检；后续Step9/13闭口 | 每脚本/schema变更及每run完成 | malformed/泄露/伪归档阻报告，保安全失败材料 |
| REAL（复用B/L/A/C/P/I/W/J） | actual manifest/pin/安装scope/内部basis、owner/producer/driver/secret资格，各platform independently | 批准sandbox与测试授权后，release候选 | blocked/unavailable/fail均不能释放受影响AC/qualification |

所有套件目前planned/not_run，运行权限=false；03路径未实现。test-only support明确synthetic，完整original/Slot/expected保留；不作运行fallback。

### 7.3 切口到层映射

S/D覆盖SURFACE/STATE；A/C/R覆盖BIND/MAP/INBOUND/PRESENT/ATTACH/CALLBACK/KEY/CURSOR/RATE/RECOVERY/READ/AUDIT；B/L/P覆盖平台CHANGE/DELIVERY、LOCAL、CONFIG/PRIVATE；I/W/J覆盖入口ENTRY及相关流程。EVIDENCE横切TOOLS，REAL独立actual资格门禁。具体target取Step3切口表，不允许由分层简称裁剪表中附加target。

每具体case instance只有一处primarysuite/target归属；TC族跨target只按Step6/9封闭参数路由产生独立instance，其余参与target仅为交叉回归选择，不复制原instance或汇总伪pass。所有TC/DS/配置/suite/EV均planned/not_run。

## 8. 回填草稿

正式§4保图/说明、分层表及切口映射；不把suite planned误写成已执行或真实准入。07负责任务/boundary而非本Step。

## 9. 待确认事项

actual store/platform/SDK/owner/producer/secret/executor兼容仍未知；不承诺生产吞吐或自动release。下一Step按00原编号建立候选追溯，再逐cut定义用例。

## 10. 自检与进入下一步条件

实际自检：22cut的target均纳入suite/层，TOOLS/REAL独立；图phase/compile不混同，local与actual资格不互证。已运行当前05校准Markdown/编号章节/相对文件链接检查，errors=[]；仅设计静态，不是项目测试或运行证据。

self_review=pass_design_static_external_gates_open；gate_status=pass；gate_reason=step_design_review_complete_external_gates_open；next_allowed_action=begin_step05_skeleton；source_files=本Step§2/7及对应SOP/规范。
formal_document_write_allowed=false；implementation_write_allowed=false；test_execution_allowed=false；commit_required=false。
