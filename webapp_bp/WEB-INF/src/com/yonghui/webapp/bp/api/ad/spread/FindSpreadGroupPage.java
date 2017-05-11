package com.yonghui.webapp.bp.api.ad.spread;

import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn770880.jutil.data.DataPage;
import cn770880.jutil.data.RespWrapper;
import cn770880.jutil.net.NetUtil;

import com.yonghui.comp.ad.share.AdClient;
import com.yonghui.comp.ad.share.SpreadService;
import com.yonghui.comp.ad.share.bean.SpreadGroup;
import com.yonghui.comp.ader.share.bean.AderEntity;
import com.yonghui.webapp.bp.api.ApiHandler;
import com.yonghui.webapp.bp.resp.spread.FindSpreadGroupPageResp;
import com.yonghui.webapp.bp.util.JsonUtil;

/**
 * 
 * <br>
 * <b>功能：</b>分页查询推广组<br>
 * <b>日期：</b>2016年11月9日<br>
 * <b>作者：</b>RUSH<br>
 *
 */
public class FindSpreadGroupPage implements ApiHandler {

	@Override
	public void handle(HttpServletRequest request,
			HttpServletResponse response, Writer out, AderEntity ader) throws IOException {
		SpreadService service = AdClient.getSpreadService();
		int adUin = ader.getAdUin();
		int pageNo = NetUtil.getIntParameter( request, "pageNo", 1);
		int pageSize = NetUtil.getIntParameter( request, "pageSize", 20);
		int spId = NetUtil.getIntParameter(request, "spId", 0);
		Map<String, Object> findParams = new HashMap<String, Object>();
		if (spId > 0)
			findParams.put("spId", spId);
		RespWrapper<DataPage<SpreadGroup>> result = service.findSpreadGroupPage(findParams, adUin, pageNo, pageSize);

		JsonUtil.MAPPER.writeValue( out, getRespPage(result));
	}
	
	/**
	 * 
	 * <br>
	 * <b>功能：</b>封装前端显示所需参数<br>
	 * <b>日期：</b>2016年11月17日<br>
	 * <b>作者：</b>RUSH<br>
	 *
	 * @param adInfoPageWrapper
	 * @return
	 */
	public static RespWrapper<DataPage<FindSpreadGroupPageResp>> getRespPage(RespWrapper<DataPage<SpreadGroup>> sgPageWrapper) {
		
		RespWrapper<DataPage<FindSpreadGroupPageResp>> resp = 
				RespWrapper.makeResp(sgPageWrapper.getErrCode(), sgPageWrapper.getErrMsg(), null);
		
		DataPage<SpreadGroup> sgPage = sgPageWrapper.getObj();
		
		if (sgPage != null) {
			List<FindSpreadGroupPageResp> respDataList = new ArrayList<FindSpreadGroupPageResp>();
			DataPage<FindSpreadGroupPageResp> respPage = 
					new DataPage<FindSpreadGroupPageResp>(respDataList, sgPage.getTotalRecordCount(), 
							sgPage.getPageSize(), sgPage.getPageNo());
			
			List<SpreadGroup> infos = sgPage.getRecord();
			for (SpreadGroup info : infos) {
				
				FindSpreadGroupPageResp respData = new FindSpreadGroupPageResp();
				respData.setSgId(info.getSgId());
				respData.setSgName(info.getSgName());
				respData.setSgStatus(info.getSgStatus());
				respData.setSpreadPlan(info.getSpreadPlan());
				respData.setPv(0);
				respData.setClick(0);
				respData.setCtr(0);
				respData.setAdCount(info.getAdCount());
				respData.setCreateTime(info.getCreateTime());
				respData.setOptime(info.getOptime());
				respDataList.add(respData);
			}
			resp.setObj(respPage);
		}
		return resp;
	}
}
