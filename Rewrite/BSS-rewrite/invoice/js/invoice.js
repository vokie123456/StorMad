/**
 *
 */

$(function() {
	//获取审核状态
	get_status();

	//初始化全局变量
	var pageNo=1;
	var corpName='';
	var yearMonth='';
	var status='';

	//初始化数据
	list(pageNo,corpName,yearMonth,status);

	//表达验证与提交
	layui.use('form', function(){
		var form = layui.form();
		form.render('select');

		//提交审核通过数据
		form.on('submit(sub_audit)', function(data){
			var val=data.field;
			var url=yonghui.contextPath + '/api/invoice/approve.jsp';
			console.log(val);
			$.ajax({
				type : 'POST',
				url  : url,
				data : {'ivId':val.ivId, 'status':20},
				dataType : 'json',
				success : function(data) {
					if(data.errCode == 0) {
						layer.msg("操作成功");
						location.reload();
					} else {
						layer.alert(data.errMsg);
					}
				},
				error : function(data) {
					layer.alert('操作异常');
					layer.closeAll('page');
				}
			});

		 	 return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
		});


		//提交审核不通过数据
		form.on('submit(sub_audit_no)', function(data){
			var val=data.field;
			var url=yonghui.contextPath + '/api/invoice/approve.jsp';

			$.ajax({
				type : 'POST',
				url  : url,
				data : {'ivId':val.ivId, 'status':10},
				dataType : 'json',
				success : function(data) {
					if(data.errCode == 0) {
						layer.msg("操作成功");
						location.reload();
					} else {
						layer.alert(data.errMsg);
					}
				},
				error : function(data) {
					layer.alert('操作异常');
					layer.closeAll('page');
				}
			});

		 	 return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
		});

		//搜索表单提交
		form.on('submit(serach)', function(data){
			var val=data.field;

			list(1,val.corpName,val.yearMonth,val.status)

		 	 return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
		});
	});

});

//关闭窗口
$("#back_list").on('click',function(){
	layer.closeAll('page');
});

//改变广告状态
function set_status(id,stauts)
{
	var url=yonghui.contextPath + '/api/invoice/approve.jsp';

	$.ajax({
		type : 'POST',
		url  : url,
		data : {'ivId':val.ivId, 'status':stauts},
		dataType : 'json',
		success : function(data) {
			if(data.errCode == 0) {
				layer.msg("操作成功");
				if(stauts==30)
				{
					$("#sta_name_"+id).text('已开票');
					$("#act_"+id).text("递出");
					$("#act_"+id).attr('onclick="set_status(40,'+val[i].ivId+')"');
				}
				if(status==40)
				{
					$("#sta_name_"+id).text('已递出');
					$("#act_"+id).text("-");
					$("#act_"+id).removeAttr('onclick');
					$("#act_"+id).addClass('active-status');
				}
			} else {
				layer.alert(data.errMsg);
			}
		},
		error : function(data) {
			layer.alert('操作异常');
			layer.closeAll('page');
		}
	});

 	 return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
}

//获取列表
function list(pageNo,corpName,yearMonth,status)
{
	//分页模块
	layui.use('laypage', function() {
		var laypage = layui.laypage,
			layer = layui.layer;

		var redata={pageNo:pageNo,pageSize:yonghui.pageSize,corpName,yearMonth,status};

		//初始化分页参数
		$.post(yonghui.contextPath + "/api/invoice/query.jsp",redata,function(data){
				val=data.obj;

				laypage({
					cont: 'pageNumber',
					groups: yonghui.groups,
					pages: val.pageCount,
					jump: function(obj, first){
						if(first) {
							get_info(val);
						} else {
							query(obj.curr,corpName,yearMonth,status);
						}
					}
				});
		});
	});
}

/*获取发票审核状态*/
function get_status()
{
	url=yonghui.contextPath + "/api/invoice/query.jsp";

	$.post(url,{op:1},function(data){
		  if(data.errCode==0)
		  {
			  	var val=data.obj;

			    for(var key in val)
				{
					$("#status").append("<option value="+key+">"+val[key]+"</option>");
				}

				layui.use('form', function(){
					var form = layui.form();
					form.render('select');
				});

		  }
		  else
		  {
			  layer.alert(data.errMsg);
			  return false
		  }
	});
}

//资料审核
function show_invoice(id)
{
	//资料审核窗口
	layer.open({
		type: 1,
		area: ['auto', 'auto'],
		title: ['资料审核', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
		shadeClose: true, //点击遮罩关闭
		content: $('#invoiceInfoReview')
	});

	var url=yonghui.contextPath+'/api/invoice/findById.jsp';

	$.post(url,{ivId:id},function(data){
		var val=data.obj;

		$("#ivId").val(val.ivId);
		$("#acctPeriod").html(val.acctPeriod);
		$("#title").html(val.title);
		$("#money").html('￥'+((val.money)/100).toFixed(2)+'元');
		$("#corporation").html(val.corporation);
		$('#bank').html(val.bank);
		$('#phone').html(val.phone);
		$('#addr').html(val.address);

		if(val.status==10)
		{
			$("#sub_audit_no").hide();
		}else {
			$("#sub_audit_no").show();
		}
		if(val.status==20)
		{
			$("#sub_audit").hide();
		}
	})
}

/*  分页查询数据*/
function get_info(data)
{
	var val=data.record;

	var htm="";

	for(var i=0;i<val.length;i++)
	{
		htm +='<tr>';

		var applyTime=laydate.now(val[i].applyTime,"YYYY-MM-DD");
		var status=val[i].status;

		htm +='<td>'+val[i].ivId+'</td><td>'+applyTime+'</td><td>'+val[i].corporation+'</td><td>'+val[i].title+'</td><td>'+(val[i].money/100).toFixed(2)+'</td>';

		var actcss='';
		var acttxt='资料审核';
		var actclick='onclick="show_invoice('+val[i].ivId+')"';

		var statusarr=val[i].status.split(",");
		var statuscode=statusarr[0];
		var statusname=statusarr[1];


		if(statuscode==20)
		{
			 acttxt='开票';
			 actclick='onclick="set_status(30,'+val[i].ivId+')"';
		}
		if(statuscode==30)
		{
			 acttxt='递出';
			 actclick='onclick="set_status(40,'+val[i].ivId+')"';
		}
		if(statuscode==40)
		{
			 actcss='class="active-status"';
			 acttxt='-';
			 actclick='';
		}

		htm +='<td id="sta_name_'+val[i].ivId+'">'+statusname+'</td>';

		htm +='<td><a href="javascript:void(0)" class="view_addinfo" addrId="'+val[i].addrId+'" >查看</a></td>';

		htm +='<td>'+((val[i].invoiceNo && val[i].invoiceNo !== '') ? val[i].invoiceNo : '暂无')+'</td><td>'+((val[i].expressNo && val[i].expressNo !== '') ? val[i].expressNo : '暂无')+'</td>';




		htm +='<td><a class="'+actcss+'" href="javascript:void(0)" '+actclick+' id="act_'+val[i].ivId+'" >'+acttxt+'</a></td>';

		htm +='</tr>';
	}

	$("#invoice_info").html(htm);
}

//查看收件人寄件信息
$('body').on('click','.view_addinfo',function(){

	layer.open({
		type: 1,
		area: ['auto', 'auto'],
		title: ['寄件信息', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
		shadeClose: true, //点击遮罩关闭
		content: $('#invoicePreview')
	});

	var url=yonghui.contextPath+'/api/invoice/findAddrById.jsp';
	var addrId=$(this).attr('addrId');

	$.post(url,{addrId:addrId},function(data){
		if(data.errCode == 0)
		{
			var info=data.obj;

			$("#addr_name").text(info.consignee);
			$("#addr_phone").text(info.phone);
			$("#addr_addr").text(info.province+info.city+info.district+info.address);
		}
		else
		{
			layer.alert(data.errMsg);
		}
	})
})


function query(pageNo,adType,aderName,status) {

	var redata={pageNo:pageNo,pageSize:yonghui.pageSize,adType:adType,aderName:aderName,status:status};

	$.post(yonghui.contextPath + "/api/invoice/query.jsp",redata,function(data){
		if(data.errCode == 0) {
			get_info(data.obj);
		} else {
			layer.alert('查询列表失败!\r\n' + data.errMsg);
		}
	});
};

//格式化时间戳
function getLocalTime(nS) {
	return new Date(parseInt(nS)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ").replace(/下午/g, " ");
}