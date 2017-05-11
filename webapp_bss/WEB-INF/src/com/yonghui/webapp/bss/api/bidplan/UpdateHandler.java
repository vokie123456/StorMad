package com.yonghui.webapp.bss.api.bidplan;

import java.io.IOException;
import java.io.Writer;
import java.util.Calendar;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.yonghui.comp.admin.share.bean.AdminEntity;
import com.yonghui.comp.bidplan.share.BidPlanClient;
import com.yonghui.comp.bidplan.share.BidPlanService;
import com.yonghui.comp.bidplan.share.bean.BidPlanEntity;
import com.yonghui.comp.bidplan.share.enums.RepeatEnum;
import com.yonghui.comp.log.share.enums.OpType;
import com.yonghui.webapp.bss.api.ApiHandler;
import com.yonghui.webapp.bss.util.JsonUtil;
import com.yonghui.webapp.bss.util.OpLogUtil;

import cn770880.jutil.data.RespWrapper;
import cn770880.jutil.string.StringUtil;

public class UpdateHandler implements ApiHandler {

	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response, Writer out, AdminEntity admin)
			throws IOException {
		RespWrapper<Boolean> resp = RespWrapper.makeResp(4002, "新增档期失败", null);
		
		int bpId = StringUtil.convertInt(request.getParameter("bpId"), 0);
		String bpName = request.getParameter("bpName");
		String iids = request.getParameter("iids");
		long startDate = StringUtil.convertLong(request.getParameter("startDate"), 0);
		long endDate = StringUtil.convertLong(request.getParameter("endDate"), 0);
		long startTime = StringUtil.convertLong(request.getParameter("startTime"), 0);
		long endTime = StringUtil.convertLong(request.getParameter("endTime"), 0);
		long cStartTime = StringUtil.convertLong(request.getParameter("cStartTime"), 0);
		long cEndTime = StringUtil.convertLong(request.getParameter("cEndTime"), 0);
		int repeatType = StringUtil.convertInt(request.getParameter("repeatType"), 0);
		int chargeType = StringUtil.convertInt(request.getParameter("chargeType"), 0);
		String alids = request.getParameter("alIds");
		String areaCodes = request.getParameter("aIds");
		String shopCodes = request.getParameter("sIds");
		int basePrice = StringUtil.convertInt(request.getParameter("cbasePrice"), 0);
		int incRange = StringUtil.convertInt(request.getParameter("incRange"), 0);
		int operator = admin.getAdmUin();
		long opTime = System.currentTimeMillis();
		
		startTime = startTime * 60 * 60 * 1000;
		if(endTime == 0) {
			endTime = 24 * 60 * 60 * 1000 - 1;
		} else {
			endTime = endTime * 60 * 60 * 1000;
		}
		
		Calendar calendar = Calendar.getInstance();
		calendar.setTimeInMillis(startDate);
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MILLISECOND, 0);
		startDate = calendar.getTimeInMillis();
		
		calendar.setTimeInMillis(endDate);
		calendar.set(Calendar.HOUR_OF_DAY, 23);
		calendar.set(Calendar.MINUTE, 59);
		calendar.set(Calendar.SECOND, 59);
		calendar.set(Calendar.MILLISECOND, 999);
		endDate = calendar.getTimeInMillis();
		
		BidPlanService service = BidPlanClient.getBidPlanService();
		BidPlanEntity entity = service.findBidPlanById(bpId).getObj();
		
		if(entity == null) {
			resp.setErrMsg("更新档期信息失败，未找到ID为["+bpId+"]的档期");
			JsonUtil.MAPPER.writeValue(out, resp);
			return;
		}
		
		long curTime = System.currentTimeMillis();
		if(entity.getRepeatedType() == RepeatEnum.ONCE.getRepeatType() && curTime > entity.getCStartTime()) {
			resp.setErrMsg("档期已经开始竞投或者投放，不能修改");
			JsonUtil.MAPPER.writeValue(out, resp);
			return;
		}

		if(entity.getRepeatedType() == RepeatEnum.REPEAT.getRepeatType()) {
			curTime = System.currentTimeMillis();
			if(curTime > entity.getCStartTime() && curTime < entity.getCEndTime()) {
				resp.setErrMsg("档期处于竞投期间，不能操作");
				JsonUtil.MAPPER.writeValue(out, resp);
				return;
			}
		}
		
		entity.setBpName(bpName);
		entity.setIIds(iids);
		entity.setStartDate(startDate);
		entity.setEndDate(endDate);
		entity.setStartTime(startTime);
		entity.setEndTime(endTime);
		entity.setCStartTime(cStartTime);
		entity.setCEndTime(cEndTime);
		entity.setRepeatedType(repeatType);
		entity.setChargeType(chargeType);
		entity.setAlIds(alids);
		entity.setAreaCodes(areaCodes);
		entity.setShopCodes(shopCodes);
		entity.setCBasePrice(basePrice);
		entity.setCIncRange(incRange);
		entity.setAdmUin(operator);
		entity.setOptime(opTime);
		
		resp = service.update(entity);
		
		OpLogUtil.writeOperateLog("更新档期["+ entity.getBpName() +"]", admin.getAdmUin(), admin.getUserName(), OpType.UPDATE, resp.getObj());
		JsonUtil.MAPPER.writeValue(out, resp);
	}

}
