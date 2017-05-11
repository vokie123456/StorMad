package com.yonghui.webapp.bp.api.test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Writer;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn770880.jutil.string.StringUtil;

import com.yonghui.comp.ader.share.bean.AderEntity;
import com.yonghui.webapp.bp.api.ApiHandler;
import com.yonghui.webapp.bp.api.test.utils.Sign;

/**
 * 
 * <br>
 * <b>功能：</b>获取所有广告类型<br>
 * <b>日期：</b>2016年11月9日<br>
 * <b>作者：</b>RUSH<br>
 *
 */
public class TestGetTickedAd implements ApiHandler {
	
	private static final String API_ID = "2016113291010165521";
	private static final String API_KEY = "E7D5FC56C64B49105F958F39AA1F577F3FBDC75D97A02CD7";
	
	@Override
	public void handle(HttpServletRequest request,
			HttpServletResponse response, Writer out, AderEntity ader) throws IOException {
		request.setCharacterEncoding("UTF-8");
		BufferedReader br = new BufferedReader(
		new InputStreamReader(request.getInputStream(),"UTF-8"));
		String line="";
		StringBuffer buffer = new StringBuffer();
		while((line=br.readLine())!=null){
			buffer.append(line);
		}
		String reqJson = buffer.toString();
		System.out.println(reqJson);
		Map<String, String> params = null;
		if (StringUtil.isNotEmpty(reqJson)) {
			try {
				params = JsonUtil.toMap(reqJson);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		if (params == null || params.isEmpty())
			throw new RuntimeException("JSON参数错误!");
		
		String shopCode = params.get("shopCode");
		String goods_str = params.get("goods");
		String payInfo_str = params.get("payInfo");
		
//		List<Map<String, String>> goods = new ArrayList<Map<String,String>>();
//		
//		List<Map<String, String>> payInfo = new ArrayList<Map<String,String>>();
//
//		try {
//			JSONArray array = JSONArray.fromObject( goods_str );
//			for (Object obj : array) {
//				Map<String, String> goodsMap = JsonUtil.toStrMap(obj.toString());
//				goods.add(goodsMap);
//			}
//		} catch (Exception e) {
//			e.printStackTrace();
//			throw new RuntimeException("参数goods格式错误!");
//		}
//		if (goods == null || goods.isEmpty())
//			throw new RuntimeException("参数goods格式错误!");
//
//		try {
//			JSONArray array = JSONArray.fromObject( payInfo_str );
//			for (Object obj : array) {
//				Map<String, String> payInfoMap = JsonUtil.toStrMap(obj.toString());
//				payInfo.add(payInfoMap);
//			}
//		} catch (Exception e) {
//			e.printStackTrace();
//			throw new RuntimeException("参数payInfo格式错误!");
//		}
//		if (goods == null || goods.isEmpty())
//			throw new RuntimeException("参数payInfo格式错误!");
		
		
		Map<String, String> data = new HashMap<String, String>();
		data.put("api_id", API_ID);
		data.put("shopCode", shopCode);
		data.put("goods", goods_str);
		data.put("payInfo", payInfo_str);
		
		data.put("sign_type", "MD5");
		String linkStr = Sign.createLinkString(Sign.paraFilter(data));
		String sign = Sign.sign(linkStr, API_KEY);
		data.put("sign", sign);
		TestClient client = new TestClient();

		Map<String, String> result = client.postJson("http://openad.yonghui.cn/ad/popTicketAd", null, data);
		JsonUtil.MAPPER.writeValue(out, result);
	}
}
