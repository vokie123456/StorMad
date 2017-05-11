package com.yonghui.webapp.bss.api.ad.adinfo;

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
import cn770880.jutil.string.StringUtil;

import com.yonghui.comp.ad.share.AdClient;
import com.yonghui.comp.ad.share.AdInfoService;
import com.yonghui.comp.ad.share.bean.AdInfo;
import com.yonghui.comp.ader.share.AderClient;
import com.yonghui.comp.ader.share.AderService;
import com.yonghui.comp.ader.share.bean.AderEntity;
import com.yonghui.comp.admin.share.bean.AdminEntity;
import com.yonghui.webapp.bss.api.ApiHandler;
import com.yonghui.webapp.bss.resp.ad.FindAdInfoPageResp;
import com.yonghui.webapp.bss.util.JsonUtil;

/**
 * 
 * <br>
 * <b>功能：</b>分页查询广告信息<br>
 * <b>日期：</b>2016年11月9日<br>
 * <b>作者：</b>RUSH<br>
 *
 */
public class FindAdInfoPage implements ApiHandler {

	@Override
	public void handle(HttpServletRequest request,
			HttpServletResponse response, Writer out, AdminEntity admin) throws IOException {
		AdInfoService service = AdClient.getAdInfoService();
		
		int pageNo = NetUtil.getIntParameter( request, "pageNo", 1);
		int pageSize = NetUtil.getIntParameter( request, "pageSize", 20);
		int sgId = NetUtil.getIntParameter( request, "sgId", 0);
		int spId = NetUtil.getIntParameter( request, "spId", 0);
		String title = NetUtil.getStringParameter( request, "title", "");
		String alIds = NetUtil.getStringParameter(request, "alIds", "");
		int adType = NetUtil.getIntParameter(request, "adType", 0);
		int status = NetUtil.getIntParameter(request, "status", -1);
		String aderName = NetUtil.getStringParameter(request, "aderName", "");
		
		Map<String, Object> findParams = new HashMap<String, Object>();
		if (sgId > 0)
			findParams.put("sgId", sgId);
		if (spId > 0)
			findParams.put("spId", spId);
		if (StringUtil.isNotEmpty(title))
			findParams.put("title", title);
		if (StringUtil.isNotEmpty(alIds))
			findParams.put("alIds", alIds);
		if (adType > 0)
			findParams.put("adType", adType);
		if (status > -1)
			findParams.put("status", status);
		if (StringUtil.isNotEmpty(aderName))
			findParams.put("aderName", aderName);
		
		RespWrapper<DataPage<AdInfo>> result = service.findAdInfoPageForBSS(findParams, pageNo, pageSize);
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
	public static RespWrapper<DataPage<FindAdInfoPageResp>> getRespPage(RespWrapper<DataPage<AdInfo>> adInfoPageWrapper) {
		
		RespWrapper<DataPage<FindAdInfoPageResp>> resp = 
				RespWrapper.makeResp(adInfoPageWrapper.getErrCode(), adInfoPageWrapper.getErrMsg(), null);
		
		DataPage<AdInfo> adInfoPage = adInfoPageWrapper.getObj();
		
		if (adInfoPage != null) {
			List<FindAdInfoPageResp> respDataList = new ArrayList<FindAdInfoPageResp>();
			DataPage<FindAdInfoPageResp> respPage = 
					new DataPage<FindAdInfoPageResp>(respDataList, adInfoPage.getTotalRecordCount(), 
							adInfoPage.getPageSize(), adInfoPage.getPageNo());
			
			List<AdInfo> infos = adInfoPage.getRecord();
			AderService aderService = AderClient.getAderService();
			for (AdInfo info : infos) {
				
				//获取广告主名称
				int adUin = info.getAdUin();
				String aderName = "未知("+adUin+")";
				RespWrapper<AderEntity> aderWrapper = aderService.findById(adUin);
				AderEntity ader = aderWrapper.getObj();
				if (aderWrapper.getErrCode() == 0 && ader != null) {
					aderName = ader.getCorporation();
				}
				//end
				
				FindAdInfoPageResp respData = new FindAdInfoPageResp();
				respData.setAdId(info.getAdId());
				respData.setAderName(aderName);
				respData.setTitle(info.getTitle());
				respData.setAdType(info.getAdType());
				respData.setContent(info.getContent());
				respData.setImgUrl(info.getImgUrl());
				respData.setLink(info.getLink());
				respData.setAdSize(info.getAdSize());
				respData.setAdStatus(info.getAdStatus());
				respData.setCreateTime(info.getCreateTime());
				respData.setOptime(info.getOptime());
				respDataList.add(respData);
			}
			resp.setObj(respPage);
		}
		return resp;
	}
}
