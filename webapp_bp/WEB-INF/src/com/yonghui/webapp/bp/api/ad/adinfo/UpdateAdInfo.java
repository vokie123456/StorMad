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
import com.yonghui.comp.ad.share.bean.AdInfo;
import com.yonghui.comp.ad.share.enums.AdType;
import com.yonghui.comp.ader.share.bean.AderEntity;
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
 * <b>功能：</b>更新广告信息<br>
 * <b>日期：</b>2016年11月9日<br>
 * <b>作者：</b>RUSH<br>
 *
 */
public class UpdateAdInfo implements ApiHandler {

	private static final String ad_uploadPath = "/img/ad/";

	@Override
	public void handle(HttpServletRequest request,
			HttpServletResponse response, Writer out, AderEntity ader) throws IOException {
		AdInfoService service = AdClient.getAdInfoService();

		String operator = ader.getAccountName();
		int adId = NetUtil.getIntParameter(request, "adId", 0);
		String title = NetUtil.getStringParameter( request, "title", "");
		String imgKey = NetUtil.getStringParameter(request, "imgKey", "");
		int adType = NetUtil.getIntParameter(request, "adType", 0);
		int asId = NetUtil.getIntParameter( request, "asId", 0);
		String content = NetUtil.getStringParameter( request, "content", "");
		String description = NetUtil.getStringParameter( request, "description", "");
		String link = NetUtil.getStringParameter( request, "link", "");
		int spId = NetUtil.getIntParameter( request, "spId", 0);
		int sgId = NetUtil.getIntParameter( request, "sgId", 0);
		String imgUrl = "";

		if (adId < 1 || StringUtil.isEmpty(title) || adType < 1 || asId < 1 
				|| (adType == AdType.TEXT.getId() && StringUtil.isEmpty(content)) || 
				spId < 1 || sgId < 1) {
			throw new RuntimeException("参数异常!");
		}

		if (adType == AdType.IMG_TEXT.getId() && StringUtil.isNotEmpty(imgKey)) {
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

		AdInfo adInfo = service.getOneAdInfo(adId).getObj();
		RespWrapper<Boolean> result = service.updateAdInfo(adId, title, adType, asId, content, imgUrl, description, link, spId, sgId, operator);
		if (result.getErrCode() == 0 && adType == AdType.IMG_TEXT.getId() && StringUtil.isNotEmpty(imgKey)) {
			CacheUtil.hdel(CacheUtil.uploadTempKey, imgKey);	//清除图片缓存
		}
		//===============日志记录
		String opContent = "编辑广告["+(adInfo == null ? "" : adInfo.getTitle())+"]";
		OpLogUtil.writeOperateLog(opContent, ader.getAdUin(), 
				ader.getLoginName(), OpType.UPDATE, (result.getErrCode() == 0));
		//=====
		
		JsonUtil.MAPPER.writeValue( out, result);
	}
}
