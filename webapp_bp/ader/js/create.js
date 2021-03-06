/**
 * 创建广告主JS
 */
$(function(){
	
	//点击提交按钮事件
	$("#btnSubmit").click(function() {
		alert($('#aderForm').serialize());
		
		var corpName = $('#corporation').val();
		if(corpName == '') {
			alert('请输入企业全称');
			$('#corporation').focus();
			return;
		}
		
		$.ajax({
			type : 'POST',
			url  : yonghui.contextPath + '/api/ader/register.jsp',
			data : $('#aderForm').serialize(),
			dataType : 'text',
			success : function(data) {
				var json = JSON.parse(data);
				alert(json);
			},
			error :function(data) {
				alert('创建广告失败!\r\n' + data.responseText);
			}
		});
	});
	
	//獲取驗證碼
	$("#btnVCode").click(function() {
		var phone = $("#phone").val();
		$.ajax({
			type : 'GET',
			url  : yonghui.contextPath + '/api/ader/getVCode.jsp',
			data : {'phone':phone},
			dataType : 'text',
			success : function(data) {
				var json = JSON.parse(data);
				if(json.errCode == 0) {
					alert('請輸入驗證碼');
					$('#phone').focus();
				} else {
					alert('驗證碼發送失敗，請重試！');
				}
			},
			error :function(data) {
				alert('獲取驗證碼失敗!\r\n');
			}
		});
	});
	
	$('#btnBack').click(function() {
		location.href = yonghui.contextPath + '/ader/login.html';
	});
});