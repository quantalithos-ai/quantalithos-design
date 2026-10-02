# 01 Step06 · 容器与部署视图

## 1. 开工确认与Step内计划

模式full-restart；当前agent单独执行；前序Step已停审。已读取架构SOP本Step、架构书写规范对应章节和通用规范适用规则。输入：Step04/05、00§13、全局§9.2及draft运行单元。输出为当前文件；正式回填仍待Step16。

计划：输入恢复→问题回答→诊断→取舍→结构化→复杂度/历史差异审计→回填草稿→自检/停审。前四项进入本批，后四项pending；未来Step不预建。

| gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|
| pass | 前序停审及用户01授权，只许可当前Step | 完成当前单元思考后才写结构化 | Step04/05、00§13、全局§9.2及draft运行单元 |

## 2. SOP问题回答

正式运行角色为Web展示入口、API同步业务入口、Worker后台/条件异步承接、市场局部存储、外部能力接缝。同步accepted由API收口；Worker推进已提交意图及状态，不能复制一套领域规则。Web无DB/owner直达权。API和Worker可以同主机但各自部署/升级；共用一市场局部存储及同一市场语义，不创建跨owner事务。外部SDK为嵌入client而非第四服务器；CLI后移薄入口。

## 3. 输入诊断

用户认可前后端分离是运行交付分离，不等于分成两个业务truth仓。旧01把package/scan工具列容器，尚无合同不能当已部署设施。9090/0.0.0.0是原型LAN约束，不是生产API默认配置。

## 4. 设计取舍

采用同设计项目Web/API/Worker独立承载；不采用全部浏览器自治，也不采用每子域独立服务数据库，前者绕truth，后者把局部原子边界拆成分布式复杂性。思考done。

## 5. 结构化中间产物

### 正式§7容器 / 部署架构

#### 容器 / 部署架构图

```text
+====================================================+
| Marketplace runtime boundary                       |
| [Web presentation entrance]                        |
|             | entrance                             |
|             v                                      |
| [API synchronous entrance] -- handling --> [Worker] |
|             | dependency                 |         |
|             +---------------+------------+         |
|                             v                      |
|                  [Local market storage]            |
+====================================================+
API / Worker -- dependency --> Formal external boundaries
```

- 图展示三运行承载及局部存储，不是源码目录、schema、协议或部署参数。
- Web仅表示展示入口，市场accepted判断由API/Worker共用语义承担。
- Worker仅从正式已提交意图或qualified输入承接；外部边界须经SDK及合同，不共享owner表。

| 对象 | 类型 | 主要职责 | 运行关系 | 说明 |
|---|---|---|---|---|
| Web展示入口 | 同步入口单元 | 展示目录/版本/发布/分发/处置和安全缺口，默认英文双语 | 入口到API | UI切换不改变refs/状态/资格，浏览器不持owner凭证。 |
| API业务入口 | 同步入口单元 | 收口市场受理、只读scope判断和显式局部处置 | 依赖局部承载/外部接缝，交后台处理 | 后台管理员UI非approval入口。 |
| Worker后台承接 | 后台处理单元 | 推进交接、unknown对账、影响通知、审计交接及投影维护 | 处理已提交意图，依赖同市场承载 | 条件事件消费并入该角色；无合同不启用consumer。 |
| 市场局部存储 | 正式存储承载 | 承载市场truth/安全历史/幂等结果/待交接责任及影子 | API/Worker依赖 | 不共享其他owner DB，不是外部资产包仓。 |
| 正式外部边界 | 运行时对接的正式外部边界 | 提供source/authority/Decision/receiver/notice/audit能力 | API/Worker依赖 | missing合同维持blocked，不部署虚构系统。 |

可独立部署并不改变一个市场ownership，API/Worker需兼容同一局部模型和契约。首期可同主机，不强制微服务或k8s。CLI可选薄客户端，不承载域规则、打包truth或安全凭据。实际环境/地址/端口/TLS/凭据/预算留04，原型9090与生产承载没有继承关系。

## 6. 复杂度判断

单文件运行承载图/表足够；通信类别另Step09，具体框架与存储实现不在此步提前指定。

## 7. 后置历史差异审计

旧01仅作污染审计，位置/口径见Step01§7；本Step由当前需求与前序独立推导，不继承旧代码组织、数字、安装/支付或自造审核。

## 8. 回填草稿

正式对应章节摘录§5已收束表与边界说明；不复制问题回答/诊断，不新增合同或运行事实。具体回填范围见本Step结构化产物。

## 9. 自检与停审

来源、责任唯一、依赖方向、数据分类、conditional合同、正文排除及本Step层次审查通过；无越界代码/schema/表结构，无新增运行/evidence。计划八项done；问题回答→诊断→取舍→结构化分批形成。

| 单元 | 思考/写入/自检 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| 本Step已列单元 | done/done/done | pass | 已逐项自检与stop_review，外部positive缺口不关闭 | 下一Step；正式装配限Step16 | §1输入及§5结构化产物 |

## 10. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01按受影响路径保留；不作为运行通过或风险接受。02及后续正式文档仍未授权。
