/**
 * 
 */				
$(function() {
	
	var queryAdes=function(pageNo) {
		var title = $('#title').val();
		var spId = $('#plans').val();
		var sgId = $('#groups').val();
		
		$.ajax({
			type : 'POST',
			url  : yonghui.contextPath + '/api/ad/adinfo/findAdInfoPage.jsp',
			data : {'pageNo':pageNo, 'pageSize':yonghui.pageSize, 'title':title, 'spId':spId, 'sgId':sgId, 'cmd':1},
			dataType : 'json',
			success : function(data) {
				if(data.errCode == 0) {
					fillTable(data.obj);
				} else {
					layer.alert('查询广告失败!\r\n' + data.errMsg);
				}
			},
			error :function(data) {
				layer.alert('查询广告失败!\r\n' + data.errMsg);
			}
		});
	};
	
	//填充表格
	var fillTable=function(page) {
		var tbl = '';
		var statusCN = '';
		var list = page.record;
		
		var spName = '';
		var sgName = '';
		var adType = '';
		var adTypeCN = '';
		var adSize = '';
		var statusCN = '';
		var status = 0;
		$('#tblGroup tbody').html('');
		for(var i = 0; i < list.length; i++) {
			if(list[i].spreadPlan == null) {
				spName = '';
			} else {
				spName = list[i].spreadPlan.spName;
			}
			if(list[i].spreadGroup == null) {
				sgName = '';
			} else {
				sgName = list[i].spreadGroup.sgName;
			}
			if(list[i].adType.indexOf(',') == -1) {
				adType = 0;
				adTypeCN = '';
			} else {
				adType = list[i].adType.split(',')[0];
				adTypeCN = list[i].adType.split(',')[1];
			}
			if(list[i].adSize == null) {
				adSize = '';
			} else {
				adSize = list[i].adSize.asName;
			}
			if(list[i].adStatus.indexOf(',') == -1) {
				statusCN = '';
				status = 0;
			} else {
				statusCN = list[i].adStatus.split(',')[1];
				status = list[i].adStatus.split(',')[0];
			}

			tbl += '<tr>';
			tbl += '<td>'+ list[i].title +'</td>';
			tbl += '<td>'+ adTypeCN +'</td>';
			tbl += '<td>'+ adSize +'</td>';
			tbl += '<td>'+ spName +'</td>';
			tbl += '<td>'+ sgName +'</td>';
			tbl += '<td>'+ statusCN +'</td>';
			tbl += '<td>';
			tbl += '<a class="ad-Text-Pic" href="javascript:previewAd(\''+list[i].content+'\', '+adType+');">预览</a>';
			if(status == 20) {
				tbl += '<a class="edit-Plan" href="javascript:editAd(\''+ list[i].adId +'\');">编辑</a>';
			}
			tbl += '<a class="plan-Delete" href="javascript:delAd(\''+ list[i].adId +'\');">删除</a>';
			tbl += '</td>';
			tbl += '</tr>';
		}
		$("#tblAd tbody").html(tbl);
	};
	
	layui.use(['laypage', 'layer'], function(){
		var laypage = layui.laypage, layer = layui.layer;
		var page = null;
		
		var title = $('#title').val();
		var spId = $('#plans').val();
		var sgId = $('#groups').val();
		if(sgId == '') {
			sgId = getQueryString('sgId');
		}
		
		$.ajax({
			type : 'POST',
			url  : yonghui.contextPath + '/api/ad/adinfo/findAdInfoPage.jsp',
			data : {'pageNo':1, 'pageSize':yonghui.pageSize, 'title':title, 'spId':spId, 'sgId':sgId},
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
								queryAdes(obj.curr);
							}
						}
					});
				} else {
					layer.alert('查询广告失败\r\n' + data.errMsg);
				}
			},
			error :function(data) {
				layer.alert('查询广告失败!\r\n' + data.errMsg);
			}
		});
	});
	
	var fillPlans=function(form) {
		//填充推广计划下拉框
		$.ajax({
			type : 'POST',
			url  : yonghui.contextPath + '/api/ad/spread/findSpreadPlanPage.jsp',
			data : {'pageNo':1, 'pageSize':yonghui.maxPageSize},
			dataType : 'json',
			success : function(data) {
				if(data.errCode == 0) {
					var list = data.obj.record;
					var options = '<option value=\'-1\'>选择推广计划</option>';
					for(var i = 0; i < list.length; i++) {
						options += '<option value=\''+ list[i].spId + '\'>'+ list[i].spName +'</option>';
					}
					$('#plans').append(options);
					form.render('select');
				} else {
					layer.alert('查询推广计划失败!\r\n' + data.errMsg);
				}
			},
			error :function(data) {
				layer.alert('查询推广计划失败!\r\n' + data.errMsg);
			}
		});
	};
	
	//填充推广组下拉框
	var fillGroups=function(form) {
		$.ajax({
			type : 'POST',
			url  : yonghui.contextPath + '/api/ad/spread/findSpreadGroupPage.jsp',
			data : {'pageNo':1, 'pageSize':yonghui.maxPageSize},
			dataType : 'json',
			success : function(data) {
				if(data.errCode == 0) {
					var list = data.obj.record;
					var options = '<option value=\'-1\'>选择推广组</option>';
					for(var i = 0; i < list.length; i++) {
						options += '<option value=\''+ list[i].sgId + '\'>'+ list[i].sgName +'</option>';
					}
					$('#groups').append(options);
					form.render('select');
				} else {
					layer.alert('查询推广组失败!\r\n' + data.errMsg);
				}
			},
			error :function(data) {
				layer.alert('查询推广组失败!\r\n' + data.errMsg);
			}
		});
	};
	
	//完成元素的渲染和事件的监听
	layui.use('form', function(){
		var form = layui.form();
  
		fillPlans(form);	//推广计划
		
		fillGroups(form);
	});
	
	//查询广告
	$('#btnSearch').click(function() {
		queryAdes(1);
	});
	
	//获取链接参数
	var getQueryString=function(name) {
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null)return  unescape(r[2]); return null;
	};
});

//编辑广告
var editAd=function(adId) {
	location.href = 'ad-add.html?adId='+ adId;
};

//删除广告
var delAd=function(adId) {
	layer.confirm('确认删除这条广告？', {
		btn: ['确认', '取消']
		,btn2: function(index, layero){
			}
		}, function(index, layero){
			$.ajax({
			type : 'POST',
			url  : yonghui.contextPath + '/api/ad/adinfo/deleteAdInfo.jsp',
			data : {'adId':adId},
			dataType : 'json',
			success : function(data) {
				if(data.errCode == 0) {
					layer.alert('删除广告成功');
					queryAdes(1);
				} else {
					layer.alert('删除广告失败!\r\n' + data.errMsg);
				}
			},
			error :function(data) {
				layer.alert('删除广告失败!\r\n' + data.errMsg);
			}
		});
	});
};

//预览广告
var previewAd=function(content, adType) {
	var height = 100;

	if(adType == 2) {
		$('#adText').css('display', 'block');
		$('#imgPreview').css('display', 'none');
		$('#adText').html(content);
		height = 600;
	} else {
		$('#adText').css('display', 'none');
		$('#imgPreview').css('display', 'block');
		$('#imgPreview').attr('src', content);
	}
	
	layer.open({
        type: 1,
        area: ['auto', height],
        title: false, //隐藏默认标题
        shadeClose: true, //点击遮罩关闭
        closeBtn: 0,
        content: $('#adTextPic')
    });
};