package com.yonghui.webapp.bp.api.ad.spread;

import java.io.IOException;
import java.io.Writer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn770880.jutil.data.RespWrapper;
import cn770880.jutil.net.NetUtil;
import cn770880.jutil.string.StringUtil;

import com.yonghui.comp.ad.share.AdClient;
import com.yonghui.comp.ad.share.SpreadService;
import com.yonghui.comp.ader.share.bean.AderEntity;
import com.yonghui.comp.log.share.enums.OpType;
import com.yonghui.webapp.bp.api.ApiHandler;
import com.yonghui.webapp.bp.util.JsonUtil;
import com.yonghui.webapp.bp.util.OpLogUtil;

/**
 * 
 * <br>
 * <b>功能：</b>新增推广计划<br>
 * <b>日期：</b>2016年11月9日<br>
 * <b>作者：</b>RUSH<br>
 *
 */
public class AddSpreadPlan implements ApiHandler {

	@Override
	public void handle(HttpServletRequest request,
			HttpServletResponse response, Writer out, AderEntity ader) throws IOException {
		SpreadService service = AdClient.getSpreadService();

		int adUin = ader.getAdUin();
		String operator = ader.getAccountName();
		String spName = NetUtil.getStringParameter( request, "spName", "");

		if (StringUtil.isEmpty(spName)){
			throw new RuntimeException("参数异常!");
		}

		RespWrapper<Integer> result = service.addSpreadPlan(adUin, spName, operator);
		//===============日志记录
		String opContent = "新建推广计划["+spName+"]";
		OpLogUtil.writeOperateLog(opContent, ader.getAdUin(), 
				ader.getLoginName(), OpType.ADD, (result.getErrCode() == 0));
		//=====
		JsonUtil.MAPPER.writeValue( out, result);
	}
}