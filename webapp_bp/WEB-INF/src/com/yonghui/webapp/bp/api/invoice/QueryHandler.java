package com.yonghui.webapp.bp.api.invoice;

import java.io.IOException;
import java.io.Writer;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.yonghui.comp.ader.share.bean.AderEntity;
import com.yonghui.comp.invoice.share.InvoiceClient;
import com.yonghui.comp.invoice.share.InvoiceService;
import com.yonghui.comp.invoice.share.bean.InvoiceEntity;
import com.yonghui.comp.invoice.share.enums.InvoiceStatus;
import com.yonghui.webapp.bp.api.ApiHandler;
import com.yonghui.webapp.bp.util.JsonUtil;
import com.yonghui.webapp.bp.util.MoneyUtil;

import cn770880.jutil.data.DataPage;
import cn770880.jutil.data.RespWrapper;
import cn770880.jutil.string.StringUtil;

public class QueryHandler implements ApiHandler {

	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response, Writer out, AderEntity ader)
			throws IOException {
		
		int op = StringUtil.convertInt(request.getParameter("op"), 0);
		
		//查询发票状态
		if(op == 1) {
			Map<Integer, Object> map = new HashMap<Integer, Object>();
			for(InvoiceStatus item : InvoiceStatus.values()) {
				map.put(item.getStatus(), item.getName());
			}
			
			RespWrapper<Map<Integer, Object>> resp = RespWrapper.makeResp(0, "", map);
			JsonUtil.MAPPER.writeValue(out, resp);
			return;
		}
		
		int pageNo = StringUtil.convertInt(request.getParameter("pageNo"), 1);
		int pageSize = StringUtil.convertInt(request.getParameter("pageSize"), 20);
		String yearMonth = request.getParameter("yearMonth");
		long money = MoneyUtil.convertMoney(request.getParameter("money"));
		int status = StringUtil.convertInt(request.getParameter("status"), -1);
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("ad_uin", ader.getAdUin());
		
		if(StringUtil.isNotEmpty(yearMonth)) {
			params.put("yearMonth", yearMonth);
		}
		if(money > 0) {
			params.put("money", money);
		}
		if(status > -1) {
			params.put("status", status);
		}

		InvoiceService service = InvoiceClient.getInvoiceService();
		RespWrapper<DataPage<InvoiceEntity>> resp = service.query(params, pageNo, pageSize);
		
		JsonUtil.MAPPER.writeValue(out, resp);
	}
}
