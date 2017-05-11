package com.yonghui.webapp.bp.api.ad.adinfo;

import java.io.IOException;
import java.io.Writer;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn770880.jutil.data.DataPage;
import cn770880.jutil.data.RespWrapper;
import cn770880.jutil.net.NetUtil;
import cn770880.jutil.string.StringUtil;

import com.yonghui.comp.ad.share.AdClient;
import com.yonghui.comp.ad.share.AdInfoService;
import com.yonghui.comp.ad.share.bean.AdInfo;
import com.yonghui.comp.ader.share.bean.AderEntity;
import com.yonghui.webapp.bp.api.ApiHandler;
import com.yonghui.webapp.bp.util.JsonUtil;

/**
 * 
 * <br>
 * <b>功能：</b>分页查询广告信息<br>
 * <b>日期：</b>2016年11月9日<br>
 * <b>作者：</b>RUSH<br>
 *
 */
public class FindAdInfoPage implements ApiHandler {

	@Override
	public void handle(HttpServletRequest request,
			HttpServletResponse response, Writer out, AderEntity ader) throws IOException {
		AdInfoService service = AdClient.getAdInfoService();
		
		int adUin = ader.getAdUin();
		int pageNo = NetUtil.getIntParameter( request, "pageNo", 1);
		int pageSize = NetUtil.getIntParameter( request, "pageSize", 20);
		int sgId = NetUtil.getIntParameter( request, "sgId", 0);
		int spId = NetUtil.getIntParameter( request, "spId", 0);
		String title = NetUtil.getStringParameter( request, "title", "");
		String alIds = NetUtil.getStringParameter(request, "alIds", "");
		int cmd = NetUtil.getIntParameter(request, "cmd", 0);
		
		Map<String, Object> findParams = new HashMap<String, Object>();
		if (sgId > 0)
			findParams.put("sgId", sgId);
		if (spId > 0)
			findParams.put("spId", spId);
		if (StringUtil.isNotEmpty(title))
			findParams.put("title", title);
		if (StringUtil.isNotEmpty(alIds))
			findParams.put("alIds", alIds);
		if (cmd == 1)
			findParams.put("cmd", cmd);
		
		RespWrapper<DataPage<AdInfo>> result = service.findAdInfoPageForBP(findParams, adUin, pageNo, pageSize);
		JsonUtil.MAPPER.writeValue( out, result);
	}
}