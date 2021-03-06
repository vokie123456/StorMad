/**
 * 
 */
$(function() {

	//分页模块
	layui.use('laypage', function() {
		var laypage = layui.laypage,
			layer = layui.layer;
	
	
		
		//初始化分页参数
		$.post(yonghui.contextPath + "/api/ad/adlocation/findAdLocationPage.jsp",{pageSize:yonghui.pageSize},function(data){
				val=data.obj;
					  
				laypage({
					cont: 'pageNumber',
					groups: yonghui.groups,
					pages: val.pageCount,
					jump: function(obj, first){
						if(first) {
							get_info(val);
						} else {
							query(obj.curr);
						}
					}
				});
		});			
	});
});

/*  分页查询数据*/
function get_info(data)
{	
	var val=data.record;

	var htm="";
	for(var i=0;i<val.length;i++)
	{
		htm +='<tr>';
		
		var adTypeobj=val[i].adType.split(","); 
		var adtype=adTypeobj[0];
		var adtypename=adTypeobj[1];
		
		var specinfo=val[i].adSize;
							
		htm +='<td>'+val[i].alName+'</td><td>永辉</td><td>'+adtypename+'</td>';

		if(adtype==1)
		{
		   htm +='<td>'+specinfo.asName+'('+adtypename+'：宽：'+specinfo.width+'px&nbsp;高：'+specinfo.height+'px)</td>';
		}
		else
		{
			htm +='<td>'+specinfo.asName+'('+adtypename+'：'+specinfo.textMaxLength+')</td>';	
		}
		
		if(val[i].alStatus==1)
		{
			htm +='<td>停用</td>'
		}
		else
		{
			htm +='<td>启动</td>'		
		}
		
		htm +='</tr>';
	}
	
	$("#area_info").html(htm);
}

function query(pageNo) {
	
	$.post(yonghui.contextPath + "/api/ad/adlocation/findAdLocationPage.jsp",{pageNo:pageNo,pageSize:yonghui.pageSize},function(data){  
		if(data.errCode == 0) {
			get_info(data.obj);
		} else {
			layer.alert('查询列表失败!\r\n' + data.errMsg);
		}
	});
};