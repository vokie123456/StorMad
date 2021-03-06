/**
 *
 */
$(function() {

	var queryBinds=function(pageNo) {
		$.ajax({
			type : 'POST',
			url  : yonghui.contextPath + '/api/bidplan/queryBindList.jsp',
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
		var statusCN = '';
		var list = page.record;
		var startDate = '';
		var endDate = '';
		var startTime = '';
		var endTime = '';
		var period = '';

		$('#tblBinding tbody').html('');
		for(var i = 0; i < list.length; i++) {
			startDate = new Date(list[i].startDate);
			endDate = new Date(list[i].endDate);

			startTime = new Date(parseInt(list[i].startDate) + parseInt(list[i].startTime));
			endTime = new Date(parseInt(list[i].endDate) + parseInt(list[i].endTime));
			period = startTime.format('hh:mm') + " 至 " + endTime.format('hh:mm');

			tbl += '<tr>';
			tbl += '<td>'+ list[i].bpName +'</td>';
			tbl += '<td>'+ startDate.format('yyyy-MM-dd') +'至'+ endDate.format('yyyy-MM-dd') +'<br>';
			tbl += ''+ period +'</td>';
			tbl += '<td><span class="status-tips ad-Preview"><i class="tips-icon"></i><a href="#">'+ list[i].location +'<span></td>';
			tbl += '<td><span class="status-tips store-List"><i class="tips-icon"></i><a href="javascript:showShops(\''+ list[i].bpId +'\')">查看门店<a><span></td>';
			tbl += '<td>'+ list[i].iName +'</td>';
			tbl += '<td>'+ list[i].bidPrice +'</td>';
			tbl += '<td>'+ list[i].adTitle +'</td>';
			tbl += '<td>'+ list[i].statusCN +'</td>';
			if(list[i].status == 0) {
				tbl += '<td><a type="button" class="btn btn-default" href="javascript:bindAd(\''+ list[i].bpaId +'\', \''+ list[i].bpId +'\', \''+ list[i].location +'\', \''+ list[i].bpName +'\')">立即绑定</a></td>';
			} else {
				tbl += '<td><a type="button" class="btn btn-default" href="javascript:unBindAd(\''+ list[i].bpaId +'\', \''+ list[i].adId +'\')">解除绑定</a></td>';
			}
			tbl += '</tr>';
		}

		$('#tblBinding tbody').html(tbl);
	};

	layui.use(['laypage', 'layer'], function(){
		var laypage = layui.laypage, layer = layui.layer;
		var page = null;

		$.ajax({
			type : 'POST',
			url  : yonghui.contextPath + '/api/bidplan/queryBindList.jsp',
			data : {'pageNo':1, 'pageSize':yonghui.pageSize},
			dataType : 'json',
			success : function(data) {
				if(data.errCode == 0) {
					page = data.obj;
					laypage({
						cont: 'pageNumber01',
						groups: yonghui.groups,
						pages: page.pageCount,
						jump: function(obj, first){
							if(first) {
								fillTable(page);
							} else {
								queryBinds(obj.curr);
							}
						}
					});
				} else {
					layer.alert(data.errMsg);
				}
			},
			error :function(data) {
				layer.alert(data.errMsg);
			}
		});
	});
});

//绑定广告
var bindAd=function(bpaId, bpId, local, bpName) {
	location.href = encodeURI('ad-binding.html?bpaId='+ bpaId +'&bpId='+bpId+'&local='+local+'&bpName='+bpName, "UTF-8");

}

//解除广告和档期的绑定
var unBindAd=function(bpaId, adId) {
	$.ajax({
		type : 'POST',
		url  : yonghui.contextPath + '/api/bidplan/bindAd.jsp?op=0',
		data : {'bpaId':bpaId, 'adId':adId},
		dataType : 'json',
		success : function(data) {
			if(data.errCode == 0) {
				layer.msg('解除绑定成功',{
					time: 1000
				},function(){
					location.href = yonghui.contextPath + "/ad/ad-management.html";
				});
			} else {
				layer.msg(data.errMsg);
			}
		},
		error :function(data) {
			layer.msg(data.errMsg);
		}
	});
};

//列出门店
var showShops=function(bpId) {
	$('#shops').empty();
	$.ajax({
		type : 'POST',
		url  : yonghui.contextPath + '/api/bidplan/query.jsp',
		data : {'pageNo':1, 'pageSize':yonghui.maxPageSize, 'op':1, 'bpId':bpId},
		dataType : 'json',
		success : function(data) {
			if(data.errCode == 0) {
				var lis = '';
				var shops = data.obj.shops;
				if(shops != null) {
					for(var i = 0; i < shops.length; i++) {
						lis += '<li>'+ shops[i].shopName +'</li>';
					}

					$('#shops').append(lis);
					$('#storeList').css('display', 'inline');
				}
			}
		},
		error :function(data) {
			layer.alert(data.errMsg);
		}
	});
};