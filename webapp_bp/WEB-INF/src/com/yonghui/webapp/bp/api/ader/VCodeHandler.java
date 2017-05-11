package com.yonghui.webapp.bp.api.ader;

import java.io.IOException;
import java.io.Writer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.yonghui.comp.ader.share.bean.AderEntity;
import com.yonghui.comp.common.share.CommonClient;
import com.yonghui.comp.common.share.SmsService;
import com.yonghui.comp.common.share.enums.MsgEnum;
import com.yonghui.webapp.bp.api.ApiHandler;
import com.yonghui.webapp.bp.util.JsonUtil;
import com.yonghui.webapp.bp.util.PhoneCheckUtil;

import cn770880.jutil.data.RespWrapper;
import cn770880.jutil.string.StringUtil;

public class VCodeHandler implements ApiHandler {

	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response, Writer out, AderEntity ader)
			throws IOException {
		
		RespWrapper<Boolean> resp = RespWrapper.makeResp(1003, "获取手机验证码失败", false);		
		String phone = request.getParameter("phone");

		if(StringUtil.isEmpty(phone)) {
			resp.setErrMsg("请输入手机号码！");
			JsonUtil.MAPPER.writeValue(out, resp);
			return;
		}
		
		if(!PhoneCheckUtil.isPhoneLegal(phone)) {
			resp.setErrMsg("请输入合法的手机号码！");
			JsonUtil.MAPPER.writeValue(out, resp);
			return;
		}
		
		SmsService service = CommonClient.getSmsService();
		resp = service.sendVCode(phone, MsgEnum.REGISTER.getMsgType());
		
		JsonUtil.MAPPER.writeValue(out, resp);
	}

}
