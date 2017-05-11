package com.yonghui.webapp.bp.api.ad.adinfo;

import java.io.IOException;
import java.io.Writer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn770880.jutil.data.RespWrapper;
import cn770880.jutil.net.NetUtil;

import com.yonghui.comp.ad.share.AdClient;
import com.yonghui.comp.ad.share.AdInfoService;
import com.yonghui.comp.ad.share.enums.AdStatus;
import com.yonghui.comp.ader.share.bean.AderEntity;
import com.yonghui.webapp.bp.api.ApiHandler;
import com.yonghui.webapp.bp.util.JsonUtil;

/**
 * 
 * <br>
 * <b>功能：</b>更新广告状态<br>
 * <b>日期：</b>2016年11月9日<br>
 * <b>作者：</b>RUSH<br>
 *
 */
public class UpdateAdStatus implements ApiHandler {

	@Override
	public void handle(HttpServletRequest request,
			HttpServletResponse response, Writer out, AderEntity ader) throws IOException {
		AdInfoService service = AdClient.getAdInfoService();
		
		String operator = ader.getAccountName();
		int adId = NetUtil.getIntParameter(request, "adId", 0);
		int adStatus = NetUtil.getIntParameter( request, "adStatus", 0);
		AdStatus ads = AdStatus.getStatus(adStatus);
		if (adId < 1 || ads == null || (ads.getId() != AdStatus.START.getId() && ads.getId() != AdStatus.STOP.getId())) {
			throw new RuntimeException("参数异常!");
		}
		
		RespWrapper<Boolean> result = service.updateAdStatus(adId, adStatus, "", operator);
		JsonUtil.MAPPER.writeValue( out, result);
	}
}