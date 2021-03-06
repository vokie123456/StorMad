//引入layui方法
layui.use('form', 'upload', 'layedit', 'laydate', 'laypage', 'layer', function() {
    var form = layui.form(),
        layer = layui.layer,
        layedit = layui.layedit,
        laydate = layui.laydate;

    layui.upload({
        url: '' //上传接口
            ,
        success: function(res) { //上传成功后的回调
            console.log(res)
        }
    });

    layui.upload({
        url: '/test/upload.json',
        elem: '#test' //指定原始元素，默认直接查找class="layui-upload-file"
            ,
        method: 'get' //上传接口的http类型
            ,
        success: function(res) {
            LAY_demo_upload.src = res.url;
        }
    });

});


//判断footer的位置是否固定
$(document).ready(function() {


    //弹出一个页面层
    //支付提醒

    //广告预览
    $('i.ad-Preview').on('click', function() {
        // $("div#adPreview").removeClass("hide");
        layer.open({
            type: 1,
            area: ['580px', 'auto'],
            //offset: 'rb', //弹窗右下角
            title: false, //隐藏默认标题
            // title: ['提示', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            closeBtn: 0,
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#adPreview')
        });
    });

    //添加金额
    $('a.add-Cash').on('click', function() {
        // $("div#addCash").removeClass("hide");
        layer.open({
            type: 1,
            area: ['auto', 'auto'],
            //offset: 'rb', //弹窗右下角
            // title: false, //隐藏默认标题
            title: ['添加金额', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            // closeBtn: 0,
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#addCash')
        });
    });

    //确认添加
    $('a.add-Cash-Confirm').on('click', function() {
        // $("div#addCash-confirm").removeClass("hide");
        layer.open({
            type: 1,
            area: ['auto', 'auto'],
            //offset: 'rb', //弹窗右下角
            // title: false, //隐藏默认标题
            title: ['确认添加', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            // closeBtn: 0,
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#addCash-confirm')
        });
    });

    //添加成功
    $('a.add-Cash-Success').on('click', function() {
        // $("div#addCash-success").removeClass("hide");
        layer.open({
            type: 1,
            area: ['auto', 'auto'],
            //offset: 'rb', //弹窗右下角
            // title: false, //隐藏默认标题
            title: ['添加成功', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            // closeBtn: 0,
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#addCash-success')
        });
    });

    //发送信息
    $('a.review-Pass').on('click', function() {
        // $("div#reviewPass").removeClass("hide");
        layer.open({
            type: 1,
            area: ['auto', 'auto'],
            //offset: 'rb', //弹窗右下角
            // title: false, //隐藏默认标题
            title: ['发送信息', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            // closeBtn: 0,
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#reviewPass')
        });
    });

    //发送信息
    $('a.review-Stop').on('click', function() {
        // $("div#reviewStop").removeClass("hide");
        layer.open({
            type: 1,
            area: ['auto', 'auto'],
            //offset: 'rb', //弹窗右下角
            // title: false, //隐藏默认标题
            title: ['发送信息', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            // closeBtn: 0,
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#reviewStop')
        });
    });

    //品牌LOGO
    $('a.brand-Logo').on('click', function() {
        // $("div#brandLogo").removeClass("hide");
        layer.open({
            type: 1,
            area: ['580px', 'auto'],
            //offset: 'rb', //弹窗右下角
            // title: false, //隐藏默认标题
            title: ['品牌LOGO', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            // closeBtn: 0,
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#brandLogo')
        });
    });

    //营业执照/税务登记证
    $('a.business-License').on('click', function() {
        // $("div#businessLicense").removeClass("hide");
        layer.open({
            type: 1,
            area: ['580px', 'auto'],
            //offset: 'rb', //弹窗右下角
            // title: false, //隐藏默认标题
            title: ['营业执照/税务登记证', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            // closeBtn: 0,
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#businessLicense')
        });
    });

    //一般纳税人资格认定资料
    $('a.certification-Information').on('click', function() {
        // $("div#certificationInformation").removeClass("hide");
        layer.open({
            type: 1,
            area: ['580px', 'auto'],
            //offset: 'rb', //弹窗右下角
            // title: false, //隐藏默认标题
            title: ['一般纳税人资格认定资料', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            // closeBtn: 0,
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#certificationInformation')
        });
    });

    //审核结果
    $('button.admin-Review-Stop').on('click', function() {
        // $("div#adminReviewStop").removeClass("hide");
        layer.open({
            type: 1,
            area: ['420px', 'auto'],
            //offset: 'rb', //弹窗右下角
            // title: false, //隐藏默认标题
            title: ['审核结果', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            // closeBtn: 0,
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#adminReviewStop')
        });
    });

    //编辑广告位
    $('a.ad-Area-Edit').on('click', function() {
        // $("div#adAreaEdit").removeClass("hide");
        layer.open({
            type: 1,
            area: ['auto', 'auto'],
            //offset: 'rb', //弹窗右下角
            // title: false, //隐藏默认标题
            title: ['编辑广告位', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            // closeBtn: 0,
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#adAreaEdit')
        });
    });

    $('button.ad-Area').on('click', function() {
        layer.open({
            type: 1,
            area: ['auto', 'auto'],
            //offset: 'rb', //弹窗右下角
            // title: false, //隐藏默认标题
            title: ['编辑广告位', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            // closeBtn: 0,
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#adAreaEdit')
        });
    });

    //新增规格
    $('button.add-Specification').on('click', function() {
        // $("div#addSpecification").removeClass("hide");
        layer.open({
            type: 1,
            area: ['680px', 'auto'],
            //offset: 'rb', //弹窗右下角
            // title: false, //隐藏默认标题
            title: ['新增规格', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            // closeBtn: 0,
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#addSpecification')
        });
    });

    //寄件信息
    $('i.invoice-Preview').on('click', function() {
        // $("div#invoicePreview").removeClass("hide");
        layer.open({
            type: 1,
            area: ['auto', 'auto'],
            //offset: 'rb', //弹窗右下角
            // title: false, //隐藏默认标题
            title: ['寄件信息', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            // closeBtn: 0,
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#invoicePreview')
        });
    });

    //资料审核
    $('a.invoice-Info-Review').on('click', function() {
        // $("div#invoiceInfoReview").removeClass("hide");
        layer.open({
            type: 1,
            area: ['auto', 'auto'],
            //offset: 'rb', //弹窗右下角
            // title: false, //隐藏默认标题
            title: ['资料审核', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            // closeBtn: 0,
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#invoiceInfoReview')
        });
    });

    //重置密码
    $('a.reset-Password').on('click', function() {
        // $("div#resetPassword").removeClass("hide");
        layer.open({
            type: 1,
            area: ['auto', 'auto'],
            //offset: 'rb', //弹窗右下角
            // title: false, //隐藏默认标题
            title: ['重置密码', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            // closeBtn: 0,
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#resetPassword')
        });
    });

    //新增管理员
    $('button.add-Admin').on('click', function() {
        // $("div#addAdmin").removeClass("hide");
        layer.open({
            type: 1,
            area: ['auto', 'auto'],
            //offset: 'rb', //弹窗右下角
            // title: false, //隐藏默认标题
            title: ['新增管理员', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            // closeBtn: 0,
            //content: '\<\div style="padding:20px;">自定义内容\<\/div>'
            content: $('#addAdmin')
        });
    });









})
