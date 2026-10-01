# L5-chat 04 · Step 2 明确配置设计目标、范围和非范围

## 1. Step状态与开工确认

> done；gate_status：pass_with_upstream_blockers；2026-10-01。本Step已完成本地设计审查，外部blocked，实施not_started。

| 小阶段 | 输出 | 状态 |
|---|---|---|
| A | SOP回答、具体诊断与取舍 | done |
| B | 结构化产物 | done |
| C | 03影响判定、回填、自检 | done |

复杂度判断：本Step为单一边界/矩阵，可在一份独立产物中收口；长表分批写入。

## 2. 本步输入

当前00～03；已通过Step1及相关前序配置域结论；配置SOP Step2和书写规范§5.2；缺正式provider/SDK/host/预算能力继续登记而不补造。

## 3. SOP问题回答

1. P0要有严格本地配置、十四字段、启动冻结、profile区分、有限资源和安全降级。
2. P1涉及真实SDK/宿主生产资格；P2移动、durable、remote config均不纳入当前schema。
3. 真实安装路径、签名/证书、端口及密钥管理操作交09。
4. 实际包pin/lock生成与环境准备按07门禁，04定义兼容条件。
5. 外部合同与production sizing仍可能阻塞运行，必须给拒绝和blocked界面，不能fake代替。

## 4. 当前材料问题诊断

“desktop能启动”与“业务已绑定”不能合并；SDK skeleton版本不等于compatibility。原型8080/0.0.0.0仅HTML演示授权，不能成为正式桌面网络暴露默认。

## 5. 改动前后对比

| 位置 | 改前 | 改后 | 依据 |
|---|---|---|---|
| 本Step输入 | 前序仅提供边界/引用，当前主题未闭口 | 独立收口本Step明确配置设计目标、范围和非范围 | 当前03与04 SOP |
| 外部正向能力 | 未绑定 | 继续blocked，不由配置授予资格 | CHAT-UP/WS-UP/host |

## 6. 配置设计取舍

采用全P0客户端配置闭包+明确production gates；不默认开启prod/fake/任意native能力。版本方向承接03，不为完成文档安装包。

## 7. 结构化中间产物

| 目标 | 说明 | 下游输入 |
|---|---|---|
| P0客户端启动面 | 14字段/8域/strict JSON/冻结/缺项拒绝 | loader与配置矩阵 |
| P0安全限制 | 内存持有、图/list同预算、intent/unknown不变 | planned边界切口 |
| P0环境差异 | Desktop local/CI；Web preview明确隔离 | fixture不证明真实业务 |
| P1生产准备 | Desktop staging/prod与真实SDK/host资格 | 未获正式资格仍blocked |
| P2演进边界 | Mobile、durable、热更新/配置中心 | design-change-required，当前不注册 |

| 非范围 | 去向 |
|---|---|
| 服务端endpoint、credential、重试/timeout/transport | SDK正式profile与owner合同 |
| 业务权限、Gate阈值、Process定义/状态、公司目录provider | 各owner正式truth |
| 原生任意文件/URL/shell权限、签名证书 | 新设计审议及09，不以config实现 |
| 实现包安装/构建/lock/测试执行 | 07实施门禁；当前not_started |
| 完整TC/EV/验收裁决/部署步骤 | 05/06/09，当前只承接方向 |
| 原型监听8080/0.0.0.0 | draft/prototype体验演示，非本地客户端配置 |

当前有配置：纯本地loader可设计完成，正式positive SDK/host adapter仍blocked。配置文档完成不改变实施状态。

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 当前Step仅细化已有配置语义/来源/失败策略 | 否 | 配置语义 | 不适用 | 无回写 |

## 9. 回填草稿

正式04 §2仅回填§7已经收口的配置契约；保留来源链接，不复制讨论问题、停审计划或旧授权记录。Step15承担全文章节来源与总审计。

## 10. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native批准权限与SDK实际profile、生产sizing/兼容测试继续open/blocked；具体影响以当前结构化表为准。未来扩展未纳入当前schema；不以未来trigger阻塞当前已闭合本地契约。

## 11. 自检与下一门禁

来源→类别→来源优先级→profile→配置项→加载/安全/变更/失败→03影响已核对本Step适用部分。无raw secret、私有业务IO、权限提升、command重试后门；下游只承接planned测试方向。当前Step local设计门禁通过；下一步读取项目台账、本flow及Step3 SOP/对应书写规范。无代码、应用测试或commit。
