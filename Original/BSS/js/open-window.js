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
		layer.open({
			type: 1,
			area: ['580px', 'auto'],
			title: false, //隐藏默认标题
			shadeClose: true, //点击遮罩关闭
			closeBtn: 0,
			content: $('#adPreview')
		});
	});

	//审核通过
	$('a.ad-Review-Pass').on('click', function() {
		layer.open({
			type: 1,
			area: ['auto', 'auto'],
			title: ['广告审核详情', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
			shadeClose: true, //点击遮罩关闭
			content: $('#adReviewPass')
		});
	});

	//审核不通过
	$('a.ad-Begin').on('click', function() {
		layer.msg('该条广告已启用');
	});

	//审核不通过
	$('a.ad-Stop').on('click', function() {
		layer.msg('该条广告已停用');
	});

	//添加金额
	$('a.add-Cash').on('click', function() {
		layer.open({
			type: 1,
			area: ['auto', 'auto'],
			title: ['添加金额', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
			shadeClose: true, //点击遮罩关闭
			content: $('#addCash')
		});
	});

	//确认添加
	$('a.add-Cash-Confirm').on('click', function() {
		layer.open({
			type: 1,
			area: ['auto', 'auto'],
			title: ['确认添加', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
			shadeClose: true, //点击遮罩关闭
			content: $('#addCash-confirm')
		});
	});

	//添加成功
	$('a.add-Cash-Success').on('click', function() {
		layer.open({
			type: 1,
			area: ['auto', 'auto'],
			title: ['添加成功', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
			shadeClose: true, //点击遮罩关闭
			content: $('#addCash-success')
		});
	});

	//发送信息
	$('a.review-Pass').on('click', function() {
		layer.open({
			type: 1,
			area: ['auto', 'auto'],
			//offset: 'rb', //弹窗右下角
			// title: false, //隐藏默认标题
			title: ['发送信息', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
			shadeClose: true, //点击遮罩关闭
			content: $('#reviewPass')
		});
	});

	//发送信息
	$('a.review-Stop').on('click', function() {
		layer.open({
			type: 1,
			area: ['auto', 'auto'],
			title: ['发送信息', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
			shadeClose: true, //点击遮罩关闭
			content: $('#reviewStop')
		});
	});

	//品牌LOGO
	$('a.brand-Logo').on('click', function() {
		layer.open({
			type: 1,
			area: ['580px', 'auto'],
			title: ['品牌LOGO', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
			shadeClose: true, //点击遮罩关闭
			content: $('#brandLogo')
		});
	});

	//营业执照/税务登记证
	$('a.business-License').on('click', function() {
		layer.open({
			type: 1,
			area: ['580px', 'auto'],
			title: ['营业执照/税务登记证', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
			shadeClose: true, //点击遮罩关闭
			content: $('#businessLicense')
		});
	});

	//一般纳税人资格认定资料
	$('a.certification-Information').on('click', function() {
		layer.open({
			type: 1,
			area: ['580px', 'auto'],
			title: ['一般纳税人资格认定资料', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
			shadeClose: true, //点击遮罩关闭
			content: $('#certificationInformation')
		});
	});

	//审核结果
	$('button.admin-Review-Stop').on('click', function() {
		layer.open({
			type: 1,
			area: ['420px', 'auto'],
			title: ['审核结果', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
			shadeClose: true, //点击遮罩关闭
			content: $('#adminReviewStop')
		});
	});

	//编辑广告位
	$('a.ad-Area-Edit').on('click', function() {
		layer.open({
			type: 1,
			area: ['auto', 'auto'],
			title: ['编辑广告位', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
			shadeClose: true, //点击遮罩关闭
			content: $('#adAreaEdit')
		});
	});

	$('button.ad-Area').on('click', function() {
		layer.open({
			type: 1,
			area: ['auto', 'auto'],
			title: ['编辑广告位', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
			shadeClose: true, //点击遮罩关闭
			content: $('#adAreaEdit')
		});
	});

	//新增规格
	$('button.add-Specification').on('click', function() {
		layer.open({
			type: 1,
			area: ['680px', 'auto'],
			title: ['新增规格', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
			shadeClose: true, //点击遮罩关闭
			content: $('#addSpecification')
		});
	});

	//寄件信息
	$('a.invoice-Preview').on('click', function() {
		layer.open({
			type: 1,
			area: ['auto', 'auto'],
			title: ['寄件信息', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
			shadeClose: true, //点击遮罩关闭
			content: $('#invoicePreview')
		});
	});

	//资料审核
	$('a.invoice-Info-Review').on('click', function() {
		layer.open({
			type: 1,
			area: ['auto', 'auto'],
			title: ['资料审核', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
			shadeClose: true, //点击遮罩关闭
			content: $('#invoiceInfoReview')
		});
	});

	//重置密码
	$('a.reset-Password').on('click', function() {
		layer.open({
			type: 1,
			area: ['auto', 'auto'],
			title: ['重置密码', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
			shadeClose: true, //点击遮罩关闭
			content: $('#resetPassword')
		});
	});

	//新增管理员
	$('button.add-Admin').on('click', function() {
		layer.open({
			type: 1,
			area: ['auto', 'auto'],
			title: ['新增管理员', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
			shadeClose: true, //点击遮罩关闭
			content: $('#addAdmin')
		});
	});

})