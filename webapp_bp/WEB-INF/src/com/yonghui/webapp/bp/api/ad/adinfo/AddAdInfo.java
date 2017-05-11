package com.yonghui.webapp.bp.api.ad.adinfo;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.Writer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn770880.jutil.data.RespWrapper;
import cn770880.jutil.net.NetUtil;
import cn770880.jutil.string.StringUtil;

import com.feizhu.conf.ProfileManager;
import com.yonghui.comp.ad.share.AdClient;
import com.yonghui.comp.ad.share.AdInfoService;
import com.yonghui.comp.ad.share.enums.AdType;
import com.yonghui.comp.ader.share.bean.AderEntity;
import com.yonghui.comp.bidplan.share.BidPlanClient;
import com.yonghui.comp.bidplan.share.BidPlanService;
import com.yonghui.comp.log.share.enums.OpType;
import com.yonghui.webapp.bp.api.ApiHandler;
import com.yonghui.webapp.bp.util.CacheUtil;
import com.yonghui.webapp.bp.util.DateUtil;
import com.yonghui.webapp.bp.util.FileObj;
import com.yonghui.webapp.bp.util.JsonUtil;
import com.yonghui.webapp.bp.util.OpLogUtil;

/**
 * 
 * <br>
 * <b>功能：</b>新增广告信息<br>
 * <b>日期：</b>2016年11月9日<br>
 * <b>作者：</b>RUSH<br>
 *
 */
public class AddAdInfo implements ApiHandler {

	private static final String ad_uploadPath = "/img/ad/";

	@Override
	public void handle(HttpServletRequest request,
			HttpServletResponse response, Writer out, AderEntity ader) throws IOException {
		AdInfoService service = AdClient.getAdInfoService();

		int adUin = ader.getAdUin();
		String operator = ader.getAccountName();
		String title = NetUtil.getStringParameter( request, "title", "");
		int adType = NetUtil.getIntParameter(request, "adType", 0);
		String imgKey = NetUtil.getStringParameter(request, "imgKey", "");
		int asId = NetUtil.getIntParameter( request, "asId", 0);
		String content = NetUtil.getStringParameter( request, "content", "");
		String description = NetUtil.getStringParameter( request, "description", "");
		String link = NetUtil.getStringParameter( request, "link", "");
		int spId = NetUtil.getIntParameter( request, "spId", 0);
		int sgId = NetUtil.getIntParameter( request, "sgId", 0);
		int bpaId = NetUtil.getIntParameter(request, "bpaId", 0);

		String imgUrl = "";
		if (StringUtil.isEmpty(title) || adType < 1 || asId < 1 || 
				(adType == AdType.IMG_TEXT.getId() && StringUtil.isEmpty(imgKey)) || 
				(adType == AdType.TEXT.getId() && StringUtil.isEmpty(content)) || 
				spId < 1 || sgId < 1) {
			throw new RuntimeException("参数异常!");
		}
		if (adType == AdType.IMG_TEXT.getId()) {
			FileObj imgFile = CacheUtil.getOneBean(CacheUtil.uploadTempKey, imgKey, FileObj.class);
			if (imgFile == null)
				throw new RuntimeException("抱歉，图片已失效，请重新上传!");

			String baseUploadPath = ProfileManager.getStringByKey("bp.upload_path_ad", "/data/static");
			String uploadPath = baseUploadPath + ad_uploadPath + DateUtil.getDate();
			String fileName = ader.getAdUin() + "_" + imgFile.getFileName();
			FileOutputStream fos = null;
			try {
				File directory = new File(uploadPath);
				if (!directory.isDirectory()) {
					directory.mkdirs();
				}

				File file = new File(uploadPath + File.separator + fileName);
				if (!file.exists()) {
					file.createNewFile();
				}

				fos = new FileOutputStream(file);
				fos.write(imgFile.getFileBytes());
			} catch (Exception e) {
				e.printStackTrace();
				throw new RuntimeException("图片上传失败!");
			} finally {
				if (fos != null) {
					fos.flush();
					fos.close();
				}
			}
			imgUrl = ad_uploadPath + DateUtil.getDate() + File.separator + fileName;
		}
		RespWrapper<Integer> result = service.addAdInfo(adUin, title, adType, asId, content, imgUrl, description, link, spId, sgId, operator);
		int errCode = result.getErrCode();
		String errMsg = result.getErrMsg();
		if (errCode == 0 && adType == AdType.IMG_TEXT.getId()) {
			CacheUtil.hdel(CacheUtil.uploadTempKey, imgKey);	//清除图片缓存
		}
		if (bpaId > 0) {
			if (result.getErrCode() == 0 && result.getObj() != null) {
				int adId = result.getObj().intValue();
				if (adId > 0) {
					BidPlanService bps = BidPlanClient.getBidPlanService();
					RespWrapper<Boolean> boolWrapper = bps.bindAd(bpaId, adId, adUin);
					if (boolWrapper.getErrCode() != 0) {
						errCode = boolWrapper.getErrCode();
						errMsg = "广告添加成功，绑定档期出错["+boolWrapper.getErrMsg()+"]";
					}
				}
			}
		}
		//===============日志记录
		String opContent = "新增" + AdType.getName(adType) + "类型广告["+title+"]";
		OpLogUtil.writeOperateLog(opContent, adUin, 
				ader.getLoginName(), OpType.ADD, (errCode == 0));
		//=====
		JsonUtil.MAPPER.writeValue( out, RespWrapper.makeResp(errCode, errMsg, result.getObj()));
	}
}
