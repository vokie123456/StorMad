/**
 *
 */
$(function() {
	var queryAds=function(pageNo) {
		$.ajax({
			type : 'POST',
			url  : yonghui.contextPath + '/api/ad/adinfo/findAdInfoPage.jsp',
			data : {'pageNo':pageNo, 'pageSize':yonghui.pageSize},
			dataType : 'json',
			success : function(data) {
				if(data.errCode == 0) {
					fillTable(data.obj);
				} else {
					layer.alert(data.errMsg);
				}
			},
			error :function(data) {
				layer.alert(data.errMsg);
			}
		});
	};

	var fillTable=function(page) {
		var tbl = '';
		var spName = '';
		var sgName = '';
		var location = getQueryString('local');
		var bpaId = getQueryString('bpaId');
		var list = page.record;

		$('#tblAd tbody').html('');
		for(var i = 0; i < list.length; i++) {
			spName = '';
			if(list[i].spreadPlan != null) {
				spName = list[i].spreadPlan.spName;
			}
			sgName = '';
			if(list[i].spreadGroup != null) {
				sgName = list[i].spreadGroup.sgName;
			}

			tbl += '<tr>';
			tbl += '<td>'+ list[i].title +'</a></td>';
			tbl += '<td>'+ spName +'</td>';
			tbl += '<td>'+ sgName +'</td>';
			tbl += '<td>'+ location +'</td>';
			tbl += '<td><a href="javascript:bindAd(\''+ bpaId +'\', \''+ list[i].adId +'\')" type="button" class="btn btn-default">绑定</a></td>';
			tbl += '</tr>';
		}
		$('#tblAd tbody').html(tbl);
	};

	layui.use(['laypage', 'layer'], function(){
		var laypage = layui.laypage, layer = layui.layer;
		var page = null;

		$.ajax({
			type : 'POST',
			url  : yonghui.contextPath + '/api/ad/adinfo/findAdInfoPage.jsp',
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
								queryAds(obj.curr);
							}
						}
					});
				}
			},
			error :function(data) {
				layer.alert(data.errMsg);
			}
		});
	});

	//获取链接参数
	var getQueryString=function(name) {
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null)return  decodeURI(r[2]); return null;
	};

	$('#bpName').html(getQueryString('bpName'));
	//新增广告
	$("#btnAdd").click(function() {
		var bpaId = getQueryString('bpaId');
		location.href = yonghui.contextPath + '/ad/ad-binding-add.html?bpaId='+bpaId;
	});
});


//绑定广告
var bindAd=function(bpaId, adId) {
	$.ajax({
		type : 'POST',
		url  : yonghui.contextPath + '/api/bidplan/bindAd.jsp?op=1',
		data : {'bpaId':bpaId, 'adId':adId},
		dataType : 'json',
		success : function(data) {
			if(data.errCode == 0) {
				layer.msg('绑定成功',{
					time:800
				},function(){
					location.href = yonghui.contextPath + "/ad/ad-management.html";
				});
			} else {
				layer.alert(data.errMsg);
			}
		},
		error :function(data) {
			layer.alert(data.errMsg);
		}
	});
};
