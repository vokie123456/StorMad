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
import com.yonghui.comp.ad.share.bean.SpreadPlan;
import com.yonghui.comp.ader.share.bean.AderEntity;
import com.yonghui.comp.log.share.enums.OpType;
import com.yonghui.webapp.bp.api.ApiHandler;
import com.yonghui.webapp.bp.util.JsonUtil;
import com.yonghui.webapp.bp.util.OpLogUtil;

/**
 * 
 * <br>
 * <b>功能：</b>更新推广计划状态<br>
 * <b>日期：</b>2016年11月9日<br>
 * <b>作者：</b>RUSH<br>
 *
 */
public class UpdateSpStatus implements ApiHandler {

	@Override
	public void handle(HttpServletRequest request,
			HttpServletResponse response, Writer out, AderEntity ader) throws IOException {
		SpreadService service = AdClient.getSpreadService();
		
		String operator = ader.getAccountName();
		String spIds = NetUtil.getStringParameter(request, "spIds", "");
		int spStatus = NetUtil.getIntParameter(request, "spStatus", -1);//0未推广 1推广中
		
		if (StringUtil.isEmpty(spIds) || spStatus < 0){
			throw new RuntimeException("参数异常!");
		}
		String [] _spIds = spIds.split(",");
		String errMsg = "";
		for (String _spId : _spIds) {
			int spId = StringUtil.convertInt(_spId, 0);
			RespWrapper<Boolean> result = service.updateSpStatus(spId, spStatus, operator);
			if (result.getErrCode() != 0 || !result.getObj()) {
				errMsg += "推广计划["+_spId+"]操作失败："+result.getErrMsg()+" \r\n";
			}
			//===============日志记录
			SpreadPlan sp = service.getOneSpreadPlan(spId).getObj();
			String opMsg = spStatus == 0 ? "暂停推广" : "参与推广";
			String opContent = "推广计划["+(sp == null ? "" : sp.getSpName())+"]" + opMsg;
			OpLogUtil.writeOperateLog(opContent, ader.getAdUin(), 
					ader.getLoginName(), OpType.UPDATE, (result.getErrCode() == 0));
			//=====
		}
		errMsg = StringUtil.isEmpty(errMsg) ? "操作成功!" : errMsg;
		JsonUtil.MAPPER.writeValue( out, RespWrapper.makeResp(0, errMsg, true));
	}
}
