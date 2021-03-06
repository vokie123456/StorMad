//引入layui方法
layui.use('form', 'upload', 'layedit', 'laydate', 'laypage', 'layer', function() {
    var form = layui.form(),
        layer = layui.layer,
        layedit = layui.layedit,
        laydate = layui.laydate;

});


//判断footer的位置是否固定
$(document).ready(function() {


    //支付提醒

    //本期竞拍结果
    $('span.result-Tips').on('click', function() {
        // $("div#resultTips").removeClass("hide");
        layer.open({
            type: 1,
            area: ['420px', 'auto'],
            offset: 'rb', //弹窗右下角
            shade: 0,
            move: false,
            title: ['本期竞拍结果', 'font-size:12px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            content: $('#resultTips')
        });

    });


    //广告预览
    $('span.ad-Preview').on('click', function() {
        // $("div#adPreview").removeClass("hide");
        layer.open({
            type: 1,
            area: ['auto', 'auto'],
            //offset: 'rb', //弹窗右下角
            title: false, //隐藏默认标题
            //title: ['该档期投放门店', 'color:#e6614f;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            closeBtn: 0,
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#adPreview')
        });
    });


    //竞拍结果
    $('span.pay-Tips').on('click', function() {
        // $("div#payTips").removeClass("hide");
        layer.open({
            type: 1,
            area: ['580px', 'auto'],
            //offset: 'rb', //弹窗右下角
            title: false, //隐藏默认标题
            title: ['竞拍结果', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            content: $('#payTips')
        });
    });

    //档期投放门店列表
    $('span.store-List').on('click', function() {
        // $("div#storeList").removeClass("hide");
        layer.open({
            type: 1,
            area: ['340px', 'auto'],
            //offset: 'rb', //弹窗右下角
            title: false, //隐藏默认标题
            //title: ['该档期投放门店', 'color:#e6614f;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            closeBtn: 0,
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#storeList')
        });
    });


    //推广计划管理
    $('a.edit-Plan, button.edit-Plan').on('click', function() {
         $("div#editPlan").removeClass("hide");
        layer.open({
            type: 1,
            title: ['推广计划管理', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            area: ['580px', 'auto'],
            shadeClose: true,
            content: $('#editPlan')
        });
    });


    //推广组编辑
    $('a.edit-Group, button.edit-Group').on('click', function() {
        $("div#editGroup").removeClass("hide");
        layer.open({
            type: 1,
            area: ['580px', 'auto'],
            //offset: 'rb', //弹窗右下角
            title: false, //隐藏默认标题
            title: ['推广组编辑', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            content: $('#editGroup')
        });
    });


    //广告绑定
    $('button.ad-Binding').on('click', function() {
        // $("div#adBinding").removeClass("hide");
        layer.open({
            type: 1,
            area: ['960px', '418px'],
            //offset: 'rb', //弹窗右下角
            title: false, //隐藏默认标题
            title: ['广告绑定', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            content: $('#adBinding')
        });
    });


    //广告信息已提交审核
    $('button.submit-Review').on('click', function() {
        // $("div#submitReview").removeClass("hide");
        layer.open({
            type: 1,
            area: ['580px', '318px'],
            //offset: 'rb', //弹窗右下角
            title: false, //隐藏默认标题
            title: ['提示', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            content: $('#submitReview')
        });
    });


    //广告预览
    $('a.ad-Text-Pic').on('click', function() {
        // $("div#adTextPic").removeClass("hide");
        layer.open({
            type: 1,
            area: ['auto', 'auto'],
            //offset: 'rb', //弹窗右下角
            title: false, //隐藏默认标题
            // title: ['广告预览', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            closeBtn: 0,
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#adTextPic')
        });
    });


    //扫码支付
    $('button.we-Chat-Pay').on('click', function() {
        // $("div#weChatPay").removeClass("hide");
        layer.open({
            type: 1,
            area: ['auto', 'auto'],
            //offset: 'rb', //弹窗右下角
            title: false, //隐藏默认标题
            title: ['请扫码支付', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#weChatPay')
        });
    });


    //支付结果
    $('button.pay-Failed').on('click', function() {
        // $("div#payFailed").removeClass("hide");
        layer.open({
            type: 1,
            area: ['580px', '318px'],
            //offset: 'rb', //弹窗右下角
            title: false, //隐藏默认标题
            title: ['支付结果', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#payFailed')
        });
    });


    //新增地址
    $('button.add-Address').on('click', function() {
        // $("div#shippingAddressEdit").removeClass("hide");
        layer.open({
            type: 1,
            area: ['auto', 'auto'],
            //offset: 'rb', //弹窗右下角
            title: false, //隐藏默认标题
            title: ['编辑收件地址', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#shippingAddressEdit')
        });
    });


    //编辑地址
    $('a.shipping-Address-Edit').on('click', function() {
        // $("div#shippingAddressEdit").removeClass("hide");
        layer.open({
            type: 1,
            area: ['auto', 'auto'],
            //offset: 'rb', //弹窗右下角
            title: false, //隐藏默认标题
            title: ['编辑收件地址', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#shippingAddressEdit')
        });
    });


    //删除操作
    $('a.shipping-Address-Delete').on('click', function() {
        // $("div#shippingAddressDelete").removeClass("hide");
        layer.open({
            type: 1,
            area: ['580px', '300px'],
            //offset: 'rb', //弹窗右下角
            title: false, //隐藏默认标题
            title: ['删除操作', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#shippingAddressDelete')
        });
    });


    //支付结果
    $('button.apply-Tips').on('click', function() {
        // $("div#applyTips").removeClass("hide");
        layer.open({
            type: 1,
            area: ['580px', 'auto'],
            //offset: 'rb', //弹窗右下角
            title: false, //隐藏默认标题
            title: ['提示', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#applyTips')
        });
    });


    //发票申请审核状态 - 审核通过
    $('a.invoice-Check').on('click', function() {
        // $("div#invoiceCheck").removeClass("hide");
        layer.open({
            type: 1,
            area: ['680px', 'auto'],
            //offset: 'rb', //弹窗右下角
            title: false, //隐藏默认标题
            title: ['发票申请审核状态', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#invoiceCheck')
        });
    });


    //发票申请审核状态 - 审核不通过
    $('a.invoice-Check-no').on('click', function() {
        // $("div#invoiceCheck-no").removeClass("hide");
        layer.open({
            type: 1,
            area: ['680px', 'auto'],
            //offset: 'rb', //弹窗右下角
            title: false, //隐藏默认标题
            title: ['发票申请审核状态', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#invoiceCheck-no')
        });
    });


    //发票申请审核状态 - 审核通过
    $('a.invoice-Check-ing').on('click', function() {
        // $("div#invoiceCheck-ing").removeClass("hide");
        layer.open({
            type: 1,
            area: ['680px', 'auto'],
            //offset: 'rb', //弹窗右下角
            title: false, //隐藏默认标题
            title: ['发票申请审核状态', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#invoiceCheck-ing')
        });
    });


    //发票申请撤销操作
    $('a.invoice-Cancel').on('click', function() {
        // $("div#invoiceCancel").removeClass("hide");
        layer.open({
            type: 1,
            area: ['580px', '318px'],
            //offset: 'rb', //弹窗右下角
            title: false, //隐藏默认标题
            title: ['撤销操作', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#invoiceCancel')
        });
    });


    //广告投放明细
    $('button.data-Detail').on('click', function() {
        // $("div#dataDetail").removeClass("hide");
        layer.open({
            type: 1,
            area: ['940px', 'auto'],
            //offset: 'rb', //弹窗右下角
            title: false, //隐藏默认标题
            title: ['广告投放明细', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#dataDetail')
        });
    });










})
