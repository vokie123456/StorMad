package com.yonghui.webapp.bss.api.ader;

import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.yonghui.comp.ad.share.AdClient;
import com.yonghui.comp.ad.share.SpreadService;
import com.yonghui.comp.ader.share.AderClient;
import com.yonghui.comp.ader.share.AderService;
import com.yonghui.comp.ader.share.bean.AderEntity;
import com.yonghui.comp.ader.share.enums.ResultEnum;
import com.yonghui.comp.ader.share.enums.StatusEnum;
import com.yonghui.comp.admin.share.bean.AdminEntity;
import com.yonghui.comp.log.share.enums.OpType;
import com.yonghui.webapp.bss.api.ApiHandler;
import com.yonghui.webapp.bss.util.JsonUtil;
import com.yonghui.webapp.bss.util.OpLogUtil;

import cn770880.jutil.data.RespWrapper;
import cn770880.jutil.j4log.Logger;
import cn770880.jutil.string.StringUtil;

public class ApproveHandler implements ApiHandler {
	
	private static Logger log = Logger.getLogger("api_ader");

	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response, Writer out, AdminEntity admin)
			throws IOException {
		RespWrapper<Boolean> resp = RespWrapper.makeResp(2010, "审核广告主账号失败", false);
		
		int op = StringUtil.convertInt(request.getParameter("op"), 0);
		if(op == 1) {
			getReasons(out);
			return;
		}
		
		int status = StringUtil.convertInt(request.getParameter("status"), 0);
		int tuin = StringUtil.convertInt(request.getParameter("tuin"), 0);
		int result = StringUtil.convertInt(request.getParameter("result"), 0);
		String reason = request.getParameter("reason");
		
		if(tuin == 0) {
			resp.setErrMsg("请选择目标广告主账号进行操作");
			JsonUtil.MAPPER.writeValue(out, resp);
			return;
		}
		
		if(status == 0) {
			resp.setErrMsg("请指定审核通过或者不通过");
			JsonUtil.MAPPER.writeValue(out, resp);
			return;
		}
		
		if(status == StatusEnum.NOPASS.getStatus()) {
			if(result == ResultEnum.OTHER_ERROR.getResult() && StringUtil.isEmpty(reason)) {
				resp.setErrMsg("如果审核不通过，请填写原因");
				JsonUtil.MAPPER.writeValue(out, resp);
				return;
			}
			
			if(result == ResultEnum.PASS.getResult()) {
				resp.setErrMsg("如果审核不通过，请选择不通过的原因");
				JsonUtil.MAPPER.writeValue(out, resp);
				return;
			}
		}
		
		AderService service = AderClient.getAderService();
		AderEntity entity = service.findById(tuin).getObj();
		if(entity == null) {
			resp.setErrMsg("请选择目标广告主账号进行操作");
			JsonUtil.MAPPER.writeValue(out, resp);
			return;
		}
		
		resp = service.approve(tuin, admin.getAdmUin(), status, result, reason);
		if(resp.getObj()) {			
			SpreadService spService = AdClient.getSpreadService();
			RespWrapper<Boolean> spResp = spService.addDefaultSpAndSg(tuin);
			if(!spResp.getObj()) {
				log.info("添加默认推广计划和推广组失败["+ spResp.getErrMsg() +"]");
			}
		}
		
		OpLogUtil.writeOperateLog("审核广告主["+ entity.getLoginName() +"]", admin.getAdmUin(), admin.getUserName(), OpType.UPDATE, resp.getObj());
		
		JsonUtil.MAPPER.writeValue(out, resp);
	}

	/**
	 * 
	 * <b>日期：2016年11月23日</b><br>
	 * <b>作者：bob</b><br>
	 * <b>功能：获取审核不同过的原因</b><br>
	 * <b>@param out
	 * <b>@throws IOException</b><br>
	 * <b>void</b>
	 */
	private void getReasons(Writer out) throws IOException {
		Map<String,Object> map = null;
		
		List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();
		for(ResultEnum item : ResultEnum.values()) {
			map = new HashMap<String,Object>();
			map.put("id", item.getResult());
			map.put("name", item.getResultCN());
			list.add(map);
		}
		JsonUtil.MAPPER.writeValue(out, RespWrapper.makeResp(0, "", list));
	}
}
