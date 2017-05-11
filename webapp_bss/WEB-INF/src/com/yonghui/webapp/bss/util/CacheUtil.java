package com.yonghui.webapp.bss.util;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.feizhu.redis.cluster.RedisClusterClient;

import cn770880.jutil.j4log.Logger;

/**
 * 
 * <br>
 * <b>功能：</b>缓存工具类<br>
 * <b>日期：</b>2016年10月25日<br>
 * <b>作者：</b>RUSH<br>
 *
 */
public final class CacheUtil {

	private static Logger log = Logger.getLogger("webapp_bss");

	private static RedisClusterClient client = RedisClusterClient.getInstance();

	/**
	 * 图片上传临时文件缓存
	 */
	public static final String uploadTempKey = "upload_temp_key";
	
	public static Long getListSize(String key) {
		return client.llen(key);
	}
	
	public static Long getHashSize(String key) {
		return client.hlen(key);
	}
	public static <T> boolean saveBean(String key, String field, T bean) {
		Long result = client.hsetFromBean(key, field, bean);
		if (null == result) {
			log.error("CacheUtil.saveBean[key="+key+",field="+field+"] error : result["+result+"]");
			return false;
		}
		return true;
	}
	
	public static Long hdel(String key, String field) {
		return client.hdel(key, field);
	}
	
	public static Long delListByVal(String key, long count, String val) {
		return client.lrem(key, count, val);
	}

	public static <T> Long delListByVal(String key, long count, T val) {
		return client.lrem(key, count, val);
	}

	public static <T> T getOneBean(String key, String field, Class<T> cls) {
		return client.hgetFromBean(key, field, cls);
	}

	public static <T> Map<String, T> getMapByKey(String key, Class<T> cls) {
		return client.hgetAllFromBean(key, cls);
	}

	public static <T> List<T> getValuesByKey(String key, Class<T> cls) {
		return client.hvalsFromBean(key, cls);
	}

	public static Set<String> getKeysByKey(String key) {
		return client.hkeysFromBean(key);
	}

}
