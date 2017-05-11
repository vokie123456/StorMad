package com.yonghui.webapp.bp.api.ader;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.Writer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.feizhu.conf.ProfileManager;
import com.yonghui.comp.ader.share.AderClient;
import com.yonghui.comp.ader.share.AderService;
import com.yonghui.comp.ader.share.bean.AderEntity;
import com.yonghui.comp.ader.share.enums.StatusEnum;
import com.yonghui.comp.common.share.CommonClient;
import com.yonghui.comp.common.share.SmsService;
import com.yonghui.comp.common.share.enums.MsgEnum;
import com.yonghui.comp.log.share.enums.OpType;
import com.yonghui.webapp.bp.api.ApiHandler;
import com.yonghui.webapp.bp.util.CacheUtil;
import com.yonghui.webapp.bp.util.DateUtil;
import com.yonghui.webapp.bp.util.FileObj;
import com.yonghui.webapp.bp.util.JsonUtil;
import com.yonghui.webapp.bp.util.OpLogUtil;

import cn770880.jutil.data.RespWrapper;
import cn770880.jutil.string.StringUtil;

public class RegHandler implements ApiHandler {
	
//	private static final Logger log = Logger.getLogger("api_ader");
	
	private static final String ADER_UPLOAD_PATH = "/img/ader/";

	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response, Writer out, AderEntity ader)
			throws IOException {
		
		String corporation = request.getParameter("corporation");
		String province = request.getParameter("province");
		String city = request.getParameter("city");
		String district = request.getParameter("district");
		String address = request.getParameter("address");
		String legalPerson = request.getParameter("legalPerson");
		String legalIdcard = request.getParameter("legalIdcard");
		String bank = request.getParameter("bank");
		String accountName = request.getParameter("accountName");
		String cardNo = request.getParameter("cardNo");
		String loginName = request.getParameter("loginName");
		String password = request.getParameter("password");
		String contact = request.getParameter("contact");
		String phone = request.getParameter("phone");
		String email = request.getParameter("email");
		String orgCode = request.getParameter("orgCode");
		String busiRegNo = request.getParameter("busiRegNo");
		String logoUrl = request.getParameter("logoUrl");
		String busiLicenseUrl = request.getParameter("busiLicenseUrl");
		String taxCertifyUrl = request.getParameter("taxCertifyUrl");
		String vCode = request.getParameter("vCode");
		
		RespWrapper<Boolean> resp = RespWrapper.makeResp(2001, "账号注册申请失败", false);
		if(StringUtil.isEmpty(vCode)) {
			resp.setErrMsg("无效的验证码");
			JsonUtil.MAPPER.writeValue( out, resp);
			return;
		}
		
		SmsService smsService = CommonClient.getSmsService();
		RespWrapper<Boolean> smsResp = smsService.verifyCode(phone, MsgEnum.REGISTER.getMsgType(), vCode);
		if(!smsResp.getObj()) {
			resp.setErrMsg("无效的验证码");
			JsonUtil.MAPPER.writeValue( out, resp);
			return;
		}
		
		String logoImgKey = "";
		String licenseImgKey = "";
		String certifyImgKey = "";
		if(StringUtil.isNotEmpty(logoUrl)) {
			logoImgKey = logoUrl;
			logoUrl = saveImg(logoUrl, loginName);
		}
		if(StringUtil.isNotEmpty(busiLicenseUrl)) {
			licenseImgKey = busiLicenseUrl;
			busiLicenseUrl = saveImg(busiLicenseUrl, loginName);
		}
		if(StringUtil.isNotEmpty(taxCertifyUrl)) {
			certifyImgKey = taxCertifyUrl;
			taxCertifyUrl = saveImg(taxCertifyUrl, loginName);
		}
		
		long applyTime = System.currentTimeMillis();
		int approvePerson = 0;
		
		AderEntity entity = new AderEntity();
		
		entity.setCorporation(corporation);
		entity.setProvince(province);
		entity.setCity(city);
		entity.setDistrict(district);
		entity.setAddress(address);
		entity.setLegalPerson(legalPerson);
		entity.setLegalIdcard(legalIdcard);
		entity.setBank(bank);
		entity.setAccountName(accountName);
		entity.setCardNo(cardNo);
		entity.setLoginName(loginName);
		entity.setPassword(password);
		entity.setContact(contact);
		entity.setPhone(phone);
		entity.setEmail(email);
		entity.setOrgCode(orgCode);
		entity.setBusiRegNo(busiRegNo);
		entity.setLogoUrl(logoUrl);
		entity.setBusiLicenseUrl(busiLicenseUrl);
		entity.setTaxCertifyUrl(taxCertifyUrl);
		entity.setApplyTime(applyTime);
		entity.setApprovePerson(approvePerson);
		entity.setStatus(StatusEnum.APPLY.getStatus());
		entity.setUtype(1);
		entity.setNotifyPhone(phone);
		
		AderService service = AderClient.getAderService();
		resp = service.apply(entity);
		
		if(resp.getObj()) {
			if(StringUtil.isNotEmpty(logoImgKey)) {
				CacheUtil.hdel(CacheUtil.uploadTempKey, logoImgKey);	//清除logo缓存
			}
			if(StringUtil.isNotEmpty(licenseImgKey)) {
				CacheUtil.hdel(CacheUtil.uploadTempKey, licenseImgKey);	//清除营业执照缓存
			}
			if(StringUtil.isNotEmpty(certifyImgKey)) {
				CacheUtil.hdel(CacheUtil.uploadTempKey, certifyImgKey);	//清除图片缓存
			}
		}
		
		OpLogUtil.writeOperateLog("广告主申请账号", 0, entity.getLoginName(), OpType.ADD, resp.getObj());
		
		JsonUtil.MAPPER.writeValue( out, resp);
	}
	
	/**
	 * 
	 * <b>日期：2016年12月3日</b><br>
	 * <b>作者：bob</b><br>
	 * <b>功能：保存图片</b><br>
	 * <b>@param imgKey
	 * <b>@param loginName
	 * <b>@return</b><br>
	 * <b>String</b>
	 */
	private String saveImg(String imgKey, String loginName) {
		String imgUrl = "";
		
		FileObj imgFile = CacheUtil.getOneBean(CacheUtil.uploadTempKey, imgKey, FileObj.class);
		if (imgFile == null)
			throw new RuntimeException("抱歉，图片已失效，请重新上传!");

		String baseUploadPath = ProfileManager.getStringByKey("bp.upload_base_path", "/data/static");
		String uploadPath = baseUploadPath + ADER_UPLOAD_PATH + DateUtil.getDate();
		String fileName = loginName + "_" + imgFile.getFileName();
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
//			CacheUtil.hdel(CacheUtil.uploadTempKey, imgKey);	//清除图片缓存
			try {
				if (fos != null) {
					fos.flush();
					fos.close();
				}
			} catch(Exception ex) {
				ex.printStackTrace();
			}
		}
		imgUrl = ADER_UPLOAD_PATH + DateUtil.getDate() + File.separator + fileName;
		
		return imgUrl;
	}

}
