/**
 * 
 */				
$(function() {
	
	//新增广告
	$("#btnSubmit").click(function() {
		var planId = $('#plans').val();
		if(planId == '' || planId == 0) {
			layer.alert('请选择推广计划');
			$('#plans').focus();
			return;
		}
		var groupId = $('#groups').val();
		if(groupId == '' || groupId == 0) {
			layer.alert('请选择推广组');
			$('#groups').focus();
			return;
		}
		var typeId = $('#adTypes').val();
		if(typeId == '' || typeId == 0) {
			layer.alert('请选额广告类型');
			return;
		}
		var sizeId = $('#adSizes').val();
		if(sizeId == '' || sizeId == 0) {
			layer.alert('请选额广告规格');
			return;
		}
		var title = $('#title').val();
		var content = $('#content').val();
		var link = $('#link').val();
		var imgKey = $('#imgKey').val();
		var asId = $('#adSizes').val();
		var adId = $('#adId').val();
		var url = yonghui.contextPath + '/api/ad/adinfo/addAdInfo.jsp';
		if(adId != null && adId != '') {
			url = yonghui.contextPath + '/api/ad/adinfo/updateAdInfo.jsp';
		}
		if(link.indexOf('http://') == -1) {
			layer.alert('链接地址请使用http://开头');
			return;
		}
		
		$.ajax({
			type : 'POST',
			url  : url,
			data : {'title':title,'adType':typeId,'content':content,'link':link,'spId':planId,'sgId':groupId,'asId':asId,'imgKey':imgKey,'adId':adId},
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

		        layer.open({
		            type: 1,
		            area: ['580px', '318px'],
		            title: false, //隐藏默认标题
		            title: ['提示', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
		            shadeClose: true, //点击遮罩关闭
		            content: $('#submitReview')
		        });
		       
			},
			error :function(data) {
				layer.alert(data.errMsg);
			}
		});
	});
	
	//填充推广计划
	var fillPlans=function(form) {
		$('#plans').empty();
		//填充推广计划下拉框
		$.ajax({
			type : 'POST',
			url  : yonghui.contextPath + '/api/ad/spread/findSpreadPlanPage.jsp',
			data : {'pageNo':1, 'pageSize':100},
			dataType : 'json',
			success : function(data) {
				if(data.errCode == 0) {
					var list = data.obj.record;
					var options = '<option value=0>选择推广计划</option>';
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
	var fillGroups=function(form, spId) {
		$('#groups').empty();
		$.ajax({
			type : 'POST',
			url  : yonghui.contextPath + '/api/ad/spread/findSpreadGroupPage.jsp',
			data : {'spId':spId},
			dataType : 'json',
			success : function(data) {
				if(data.errCode == 0) {
					var list = data.obj.record;
					var options = '';
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
	
	//填充广告类型
	var fillAdTypes=function(form, spId) {
		$('#adTypes').empty();
		//填充广告类型下拉框
		$.ajax({
			type : 'POST',
			url  : yonghui.contextPath + '/api/ad/getAllAdType.jsp',
			data : {'pageNo':1, 'pageSize':100},
			dataType : 'json',
			success : function(data) {
				if(data.errCode == 0) {
					var list = data.obj;
					var options = '';
					for(var i = 0; i < list.length; i++) {
						options += '<option value=\''+ list[i].first + '\'>'+ list[i].second +'</option>';
					}
					$('#adTypes').append(options);
					
					if(list.length >= 1) {
						fillAdSizes(form, list[0].first);
					}
					form.render('select');
				} else {
					layer.alert('查询广告类型失败!\r\n' + data.errMsg);
				}
			},
			error :function(data) {
				layer.alert('查询广告类型失败!\r\n' + data.errMsg);
			}
		});
	};
	
	//填充广告规格
	var fillAdSizes=function(form, adType) {
		$('#adSizes').empty();
		$.ajax({
			type : 'POST',
			url  : yonghui.contextPath + '/api/ad/adsize/getAdSizesByAdType.jsp',
			data : {'adType':adType},
			dataType : 'json',
			success : function(data) {
				if(data.errCode == 0) {
					var list = data.obj;
					var options = '';
					for(var i = 0; i < list.length; i++) {
						options += '<option value=\''+ list[i].asId + '\'>'+ list[i].asName +'</option>';
					}
					$('#adSizes').append(options);
					form.render('select');
				} else {
					layer.alert('查询广告规格失败!\r\n' + data.errMsg);
				}
			},
			error :function(data) {
				layer.alert('查询广告规格失败!\r\n' + data.errMsg);
			}
		});
	};
	
	//如果是编辑广告，则填充内容
	var fillAdInfo=function(form, adId) {
		$.ajax({
			type : 'POST',
			url  : yonghui.contextPath + '/api/ad/adinfo/getOneAdInfo.jsp',
			data : {'adId':adId},
			dataType : 'json',
			success : function(data) {
				if(data.errCode == 0) {
					var adType = 0;
					var adSize = 0;
					if(data.obj.adType != null) {
						adType = data.obj.adType.split(',')[0];
					}
					if(data.obj.adSize != null) {
						adSize = data.obj.adSize.split(',')[0];
					}

					fillGroups(form, data.obj.spId);
					fillAdSizes(form, adType);
					
					$('#title').val(data.obj.title);
					$('#adId').val(data.obj.adId);
					$('#content').val(data.obj.content);
					$('#link').val(data.obj.link);
					$('#plans').val(data.obj.spId);
					$('#groups').val(data.obj.sgId);
					$('#adTypes').val(adType);
					$('#adSizes').val(adSize);
					if(adType != 2) {
						$('#adImg').attr('src', data.obj.content);
					}
					form.render();
				} else {
					layer.alert('查询广告失败!\r\n' + data.errMsg);
				}
			},
			error :function(data) {
				layer.alert('查询广告失败!\r\n' + data.errMsg);
			}
		});
	};
	
	//完成元素的渲染和事件的监听
	layui.use('form', function(){
		var form = layui.form();
  
		fillPlans(form);	//推广计划
		
		fillAdTypes(form);	//广告类型
		
		var adId = getQueryString('adId');
		if(adId != null && adId != '') {
			fillAdInfo(form, adId);
		}
		
		//根据不同的推广计划，设置不同的推广组
		form.on('select(plans)', function(data) {
			fillGroups(form, data.value);
		});
		
		//根据选择不同的广告类型，刷新广告规格
		form.on('select(adTypes)', function(data){
			fillAdSizes(form, data.value);
			
			var adType = $('#adTypes').val();
			if(adType == 1) {
				$('#imgDiv').show();
			} else {
				$('#imgDiv').hide();
			}
		});   
	});
	
	//上传图片
	layui.use('upload', function() {
		layui.upload({
			url: '/api/ad/upload.jsp', //上传接口
			method:'post',
			dataType:'json',
			success: function(data) { //上传成功后的回调
				if(data.errCode == 0) {
					$('#imgKey').val(data.obj);
					var imgUrl = yonghui.contextPath + '/api/showTempImg.jsp?key='+data.obj;
					$('#adImg').attr('src', imgUrl);
				} else {
					$('#errMsg').css('display', 'block');
					$('.exclamation-icon').append(data.errMsg);
				}
			},
			error: function(data) {
				$('#errMsg').css('display', 'block');
				$('.exclamation-icon').append(data.errMsg);
			}
		});
	});
	
	//返回广告列表
	$('#btnKnow').click(function() {
		location.href = 'ad-list.html';
	});
	
	//返回广告列表
	$('#btnBack').click(function() {
		location.href = 'ad-list.html';
	});
	
	//获取链接参数
	var getQueryString=function(name) {
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null)return  unescape(r[2]); return null;
	};
});