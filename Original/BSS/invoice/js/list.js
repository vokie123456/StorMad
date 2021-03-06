/**
 * 
 */				
$(function() {
	
	var queryInvoices=function(pageNo) {
		$.ajax({
			type : 'POST',
			url  : yonghui.contextPath + '/api/invoice/query.jsp',
			data : {'pageNo':pageNo, 'pageSize':yonghui.pageSize},
			dataType : 'json',
			success : function(data) {
				if(data.errCode == 0) {
					fillTable(data.obj);
				} else {
					layer.alert('查询失败!\r\n' + data.errMsg);
				}
			},
			error :function(data) {
				layer.alert('查询失败);
			}
		});
	};
	
	var fillTable=function(page) {
		var tbl = '';
		var statusCN = '';
		var list = page.record;
		
		$('#tblPlan tbody').html('');
		for(var i = 0; i < list.length; i++) {
			tbl += '<tr>';
			tbl += '<td><div class="checkbox"><label><span class="checkbox">';
			tbl += '<input name="spId" id="'+list[i].spId+'" value="'+list[i].spId+'" type="checkbox"><i></i>';
			tbl += '</span></label></div></td>';
			tbl += '<td>'+ list[i].spName +'</td>';
			tbl += '<td>'+ list[i].pv +'</td>';
			tbl += '<td>'+ list[i].click +'</td>';
			tbl += '<td>'+ list[i].ctr +'</td>';
			tbl += '<td>'+ list[i].sgCount +'</td>';
			tbl += '<td>'+ list[i].adCount +'</td>';
			statusCN = '推广中';
			if(list[i].spStatus == 0) {
				statusCN = '未参与';
			}
			tbl += '<td>'+ statusCN +'</td>';
			tbl += '<td><a class="edit-Plan" href="javascript:approve(\''+ list[i].spId +'\', \''+ list[i].spName +'\')">编辑</a></td>';
			tbl += '</tr>';
		}
		$('#tblPlan tbody').html(tbl);
	};
	
	layui.use(['laypage', 'layer'], function(){
		var laypage = layui.laypage, layer = layui.layer;
		var page = null;
		
		$.ajax({
			type : 'POST',
			url  : yonghui.contextPath + '/api/invoice/query.jsp',
			data : {'pageNo':1, 'pageSize':yonghui.pageSize},
			dataType : 'json',
			success : function(data) {
				if(data.errCode == 0) {
					page = data.obj;
					laypage({
						cont: 'pageNumber',
						groups: yonghui.groups,
						pages: page.pageCount,
						jump: function(obj, first){
							if(first) {
								fillTable(page);
							} else {
								queryInvoices(obj.curr);
							}
						}
					});
				}
			},
			error :function(data) {
				layer.alert('查询推广计划失败!\r\n' + data.errMsg);
			}
		});
	});
	
	//添加推广计划
	$("#btnAdd").click(function() {
		var planId = $('#planId').val();
		if(planId == '') {
			addPlan();
		} else {
			updatePlan();
		}
	});
	
	//执行推广计划更新
	var updatePlanStatus=function(planId, status) {
		$.ajax({
			type : 'POST',
			url  : yonghui.contextPath + '/api/ad/spread/updateSpStatus.jsp',
			data : {'spStatus':status, 'spId':planId},
			dataType : 'json',
			success : function(data) {
				if(data.errCode == -10000) {
					layer.alert('你尚未登录系统，不能操作');
					return;
				}
				if(data.errCode != 0) {
					layer.alert(data.errMsg);
					return;
				}
				layer.alert("更新推广计划状态成功");
				layer.closeAll('page');
				queryInvoices(1);
			},
			error :function(data) {
				layer.alert('编辑推广计划失败!\r\n' + data.errMsg);
			}
		});
	};
});

//彈出修改推廣計劃窗口
var editPlan=function(id, name) {
	$('#planName').val(name);
	$('#planId').val(id);
	layer.open({
        type: 1,
        area: ['580px', 'auto'],
        //offset: 'rb', //弹窗右下角
        title: false, //隐藏默认标题
        title: ['推广计划管理', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
        shadeClose: true, //点击遮罩关闭
        content: $('#editPlan')
    });
};