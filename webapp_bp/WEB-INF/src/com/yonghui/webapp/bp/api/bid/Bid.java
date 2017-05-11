package com.yonghui.webapp.bp.api.bid;

import java.io.IOException;
import java.io.Writer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn770880.jutil.data.RespWrapper;
import cn770880.jutil.net.NetUtil;
import cn770880.jutil.string.StringUtil;

import com.yonghui.comp.ader.share.bean.AderEntity;
import com.yonghui.comp.bid.share.BidClient;
import com.yonghui.comp.bid.share.BidService;
import com.yonghui.webapp.bp.api.ApiHandler;
import com.yonghui.webapp.bp.util.JsonUtil;

/**
 * 
 * <br>
 * <b>功能：</b>竞价<br>
 * <b>日期：</b>2016年11月9日<br>
 * <b>作者：</b>RUSH<br>
 *
 */
public class Bid implements ApiHandler {

	@Override
	public void handle(HttpServletRequest request,
			HttpServletResponse response, Writer out, AderEntity ader) throws IOException {
		BidService service = BidClient.getBidService();
		
		int adUin = ader.getAdUin();
		String operator = ader.getAccountName();
		int bpId = NetUtil.getIntParameter(request, "bpId", 0);
		String iId = NetUtil.getStringParameter( request, "iId", "");
		int money = NetUtil.getIntParameter( request, "money", 0);
		
		if (bpId < 1 || StringUtil.isEmpty(iId) || money < 1) {
			throw new RuntimeException("参数异常!");
		}

		RespWrapper<Boolean> result = service.bid(bpId, iId, money, adUin, operator);
		JsonUtil.MAPPER.writeValue( out, result);
	}
}