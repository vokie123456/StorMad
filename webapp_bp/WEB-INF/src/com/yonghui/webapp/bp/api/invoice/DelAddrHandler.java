package com.yonghui.webapp.bp.api.invoice;

import java.io.IOException;
import java.io.Writer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.yonghui.comp.ader.share.bean.AderEntity;
import com.yonghui.comp.invoice.share.AddrService;
import com.yonghui.comp.invoice.share.InvoiceClient;
import com.yonghui.comp.invoice.share.bean.AddrEntity;
import com.yonghui.comp.log.share.enums.OpType;
import com.yonghui.webapp.bp.api.ApiHandler;
import com.yonghui.webapp.bp.util.JsonUtil;
import com.yonghui.webapp.bp.util.OpLogUtil;

import cn770880.jutil.data.RespWrapper;
import cn770880.jutil.string.StringUtil;

public class DelAddrHandler implements ApiHandler {

	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response, Writer out, AderEntity ader)
			throws IOException {
		
		RespWrapper<Boolean> resp = RespWrapper.makeResp(7103, "删除地址失败！", false);
		
		int addrId = StringUtil.convertInt(request.getParameter("addrId"), 0);
		if(addrId == 0) {
			resp.setErrMsg("地址非法，删除失败");
			JsonUtil.MAPPER.writeValue(out, resp);
			return;
		}
		
		AddrService service = InvoiceClient.getAddrService();
		AddrEntity entity = service.findById(addrId).getObj();
		if(entity == null) {
			resp.setErrMsg("地址非法，删除失败");
			JsonUtil.MAPPER.writeValue(out, resp);
			return;
		}
		resp = service.delete(addrId, ader.getAdUin());
		
		OpLogUtil.writeOperateLog("广告主["+ader.getLoginName()+"]删除地址["+ entity.getAddress() +"]", ader.getAdUin(), ader.getLoginName(), OpType.DELETE, resp.getObj());
		JsonUtil.MAPPER.writeValue(out, resp);
	}

}
