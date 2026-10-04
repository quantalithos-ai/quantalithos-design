# L6-bridges 02 Step 2：目标与范围

## 1. Step 状态与内计划

done / pass；full-restart / single-agent-serial；SOP2/规范4.2；正式§2。开工：项目/flow当前Step2、Step1问题/诊断/取舍/挂起已读；通用纪律见flow§3。

| 计划项 | 状态 | 入口 |
|---|---|---|
| 前序读取 | done | §2 |
| 问题/诊断/取舍 | done | §3~6 |
| 结构化/复杂度 | done | §6~7 |
| 草稿/自检 | done / pass | §8~10 |

## 2. 本步输入

Step1全部结论/BR-UP边界；00§9/10/11、01§6/9/10，概要SOP2与规范4.2。

## 3. SOP 问题回答

1. 需要讲清六组成部分到实现层的关系、每capability的对象来源、typed mapping与adapter/private seam。
2. 停在关键字段类型、typed函数参数、输入输出骨架、主流程事务外呼与状态guard，可交03逐合同展开；不能直接交实现。
3. 范围覆盖所有16FR的本仓承担面：关系管理、入站、外显/附件、callback、连续性/恢复、安全handoff/query。
4. owner/provider未核验正向方法只作为本仓port需求；真实安装、账号、grant、部署和验证不在范围。
5. 完整字段可选性/序列化、签名/错误枚举/DDL/持久driver属于03，配置项值/profile/secret配置属于04，TC/EV/phase属于05~07。

## 4. 当前文档问题诊断

只写六模块名称不足以支撑03；反之写完整schema会占用03责任且虚构共享类型。需要对mapping的定位、来源、generation及结果引用给typed骨架，对缺owner资格给阻塞结果，不能以“实现时补”替代当前选择。

## 5. 改动前后对比

| 当前线索 | 本轮收束 | 不下沉内容 |
|---|---|---|
| 架构语义维度 | 业务组成部分到service/object/port/flow/state | crate/目录/DDL |
| 平台差异 | 四adapter能力与验证/receipt分类 | 未核验固定配额/SDK pin |
| 未绑定合同 | port语义需求及blocked分支 | 假owner callable / 联调结果 |

## 6. 设计取舍

采用完整语义骨架而非概念摘要；不采用复制上游schema或直接写可运行协议。前者足以发现断链，保留后续03具体可落码闭口责任；复杂度后续按组成部分/对象拆附录，本Step仅两表，不画图。

## 7. 结构化中间产物

| 目标 | 说明 | 交付给详细设计的结果 |
|---|---|---|
| 主体组织 | 六组成部分与实现分层不同轴 | service/entry/domain/port的责任映射 |
| 对象与映射 | 候选池筛选、独立对象、typed关键字段 | 局部truth/ref/state及factory/method骨架 |
| 协议与阶段 | 五类本地入口、平台adapter和owner交接 | 输入输出、metadata权威、ACK/owner/effect分离 |
| 连续性 | operation/effect、cursor/gap、lane/retry | 状态触发、权威来源、未知/人工出口 |
| 安全与承接 | 配置secret影响、no-write、安全材料和验证切口 | 03/04待展开合同与禁止实现的缺口 |

| 非范围 | 留给哪一层 |
|---|---|
| 改需求/owner/架构/ADR | 00/01或相应owner |
| 全schema/完整函数/目录/DDL/driver实现 | 03 |
| 配置项值、环境变量、secret名称、pin/profile | 04，产品核验须具来源 |
| TC/fixture/EV/verdict/phase/boundary | 05/06/07；真实执行另授权 |
| human认证/业务裁决/实体正文truth | 正式入口与对应owner，不转本仓 |

深度：02定义结构与必要类型/状态语义，不声称具备完整schema或可实施资格；03必须闭合所有支撑carrier/port/protocol，缺正式owner来源则受影响分支继续blocked。

## 8. 回填草稿

正式§2摘录§7两表和深度声明，不把任务/排期写入目标。

## 9. 待确认事项

BR-UP原姿态不变。

## 10. 进入下一步条件

范围覆盖16FR且未复制需求；深度与Step1输入限制一致，无owner接口臆造，非范围有明确归属。自检pass；gate_status=pass；gate_reason=scope_and_depth_consistent；next_allowed_action=step_03_constraints；source_files=Step1/00/01/SOP2；formal_backfill_allowed=after_step14；commit_required=false。
