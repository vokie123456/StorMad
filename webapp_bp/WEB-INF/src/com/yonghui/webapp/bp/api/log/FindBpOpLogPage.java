package com.yonghui.webapp.bp.api.log;

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

import com.yonghui.comp.ader.share.bean.AderEntity;
import com.yonghui.comp.log.share.LogClient;
import com.yonghui.comp.log.share.LogService;
import com.yonghui.comp.log.share.bean.BpOpLog;
import com.yonghui.webapp.bp.api.ApiHandler;
import com.yonghui.webapp.bp.util.DateUtil;
import com.yonghui.webapp.bp.util.JsonUtil;

/**
 * 
 * <br>
 * <b>功能：</b>分页查询BP系统操作日志<br>
 * <b>日期：</b>2016年12月12日<br>
 * <b>作者：</b>RUSH<br>
 *
 */
public class FindBpOpLogPage implements ApiHandler {

	@Override
	public void handle(HttpServletRequest request,
			HttpServletResponse response, Writer out, AderEntity ader) throws IOException {
		LogService service = LogClient.getLogService();
		
		int adUin = ader.getAdUin();
		int pageNo = NetUtil.getIntParameter( request, "pageNo", 1);
		int pageSize = NetUtil.getIntParameter( request, "pageSize", 20);
		String content = NetUtil.getStringParameter( request, "content", "");
		String opTime = NetUtil.getStringParameter(request, "opTime", "");
		
		Map<String, Object> findParams = new HashMap<String, Object>();
		if (StringUtil.isNotEmpty(content))
			findParams.put("content", content);
		if (StringUtil.isNotEmpty(opTime)) {
			opTime = opTime + " 00:00:00";
			long startTime = DateUtil.getTime(opTime);
			long endTime = startTime + (24 * 60 * 60 * 1000L);
			findParams.put("startTime", startTime);
			findParams.put("endTime", endTime);
		}
		RespWrapper<DataPage<BpOpLog>> result = service.findBpOpLogPage(findParams, adUin, pageNo, pageSize);
		JsonUtil.MAPPER.writeValue( out, result);
	}
}
