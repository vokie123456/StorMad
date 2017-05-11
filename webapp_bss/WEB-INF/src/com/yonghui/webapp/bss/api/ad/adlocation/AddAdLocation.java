package com.yonghui.webapp.bss.api.ad.adlocation;

import java.io.IOException;
import java.io.Writer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn770880.jutil.data.RespWrapper;
import cn770880.jutil.net.NetUtil;
import cn770880.jutil.string.StringUtil;

import com.yonghui.comp.ad.share.AdClient;
import com.yonghui.comp.ad.share.AdLocationService;
import com.yonghui.comp.ad.share.enums.AdType;
import com.yonghui.comp.admin.share.bean.AdminEntity;
import com.yonghui.comp.log.share.enums.OpType;
import com.yonghui.webapp.bss.api.ApiHandler;
import com.yonghui.webapp.bss.util.JsonUtil;
import com.yonghui.webapp.bss.util.OpLogUtil;

/**
 * 
 * <br>
 * <b>功能：</b>添加广告位置信息<br>
 * <b>日期：</b>2016年11月9日<br>
 * <b>作者：</b>RUSH<br>
 *
 */
public class AddAdLocation implements ApiHandler {

	@Override
	public void handle(HttpServletRequest request,
			HttpServletResponse response, Writer out, AdminEntity admin) throws IOException {
		AdLocationService service = AdClient.getAdLocationService();

		String operator = admin.getUserName();
		String alName = NetUtil.getStringParameter( request, "alName", "");
		int adType = NetUtil.getIntParameter(request, "adType", 0);
		int asId = NetUtil.getIntParameter(request, "asId", 0);
		String description = NetUtil.getStringParameter( request, "description", "");
		String sketchMap = NetUtil.getStringParameter(request, "sketchMap", "");

		if (StringUtil.isEmpty(alName) || AdType.getType(adType) == null || asId < 1 || StringUtil.isEmpty(sketchMap)) {
			throw new RuntimeException("参数异常!");
		}

		RespWrapper<Integer> result = service.addAdLocation(alName, adType, asId, description, sketchMap, operator);
		//===============日志记录
		String opContent = "新增"+AdType.getName(adType)+"类型广告位["+alName+"]";
		OpLogUtil.writeOperateLog(opContent, admin.getAdmUin(), 
				operator, OpType.ADD, (result.getErrCode() == 0));
		//=====
		JsonUtil.MAPPER.writeValue( out, result);
	}
}