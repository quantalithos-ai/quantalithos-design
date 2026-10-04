# C-BR-1：受权绑定与映射成立

> 00 Step7当前单元；design_self_review=pass；非用户/owner signoff。

## 1. 来源与职责

Step2/4/5/6、Identity00 §2/10、Conversation03 §7.4、平台附录§3。只定义桥接配置、explicit binding及mapping关系，不创建actor/GlobalMember/频道/Conversation。外部安装scope与内部授权basis分别验证。

## 2. 问题、诊断与取舍

要证明什么？目标、主体、方向、操作和secret引用可追溯。历史任意external ID平铺GlobalMember会造成身份串线；采用分namespace绑定与明确主体kind，不采用显示名称匹配、首次消息自动建档或admin默认全权。配置更新与绑定撤销必须显式产生局部版本，不改变owner truth。

## 3. 故事目标与能力主题

绑定管理者需要获授权接入、可解释待激活与及时撤销；参与者需要自己及AI的身份/位置关系不被串绑。主题为配置与secret准入、受权binding生命周期、identity/location/message关系定位；不是CRUD或UI配置页。

## 4. 输入、输出、状态与数据边界

输入：adapter/capability revision、installation namespace、external subject/location、internal typed ref、formal basis/version/scope/action/expiry、opaque secret ref/version。输出：局部绑定与mapping版本、active或waiting/blocked/suspended/revoked、安全reason/ref。

成立条件：各输入可从正式来源解析，主体类型与目标一致，平台安装资格及内部授权同时有效。configured不能直接视active；waiting/blocked不允许外呼；active撤销或权限失效后不得接新操作，旧排队intent需当前授权重校验。已发生外部效果不能被撤销记录抹去。

关系键必须包括platform、server/installation、external object kind与opaque locator、binding generation、internal target/ref；一个external_id不能跨租户唯一化。display name/mention只是显示材料，不能决定身份或目标。凭证只保ref/version，实际解析值不持久化。

## 5. 接口、幂等与失败

能力面是显式接入变更、绑定/能力状态查询与owner依据读取；配置/provider未核验保持waiting。相同管理operation复用同结果；同identity不同语义conflict。mapping与binding generation变化不能重置已有投递effectidentity。并发撤销与派发必须有可验证版本保护，不以旧cache放行。

## 6. 质量与验收语义

切口：跨tenant相同ID、主体类型混淆、外部安装成功但内部未授权、过期secret、撤销与派发竞争、默认配置/SDK越权。否决：自动建GlobalMember、raw secret入配置/日志、篡改target或旧binding继续外呼。证据仅basis/ref/version与安全结果类别，不含账号credential。

## 7. blocker与进入/退出

BR-UP-002/003/005/007/008：actor授权、owning visibility、provider/capability版本未闭合。进入需管理请求和正式basis；退出是受权局部relation或明确waiting/blocked/revoked，不能以外部安装回执代替。

## 8. 停审

来源、目标、主题、局部状态、引用、失败与否决已定义；没有业务owner写入或默认权限。允许讨论C2；本卡通过仅是需求语义自检。
